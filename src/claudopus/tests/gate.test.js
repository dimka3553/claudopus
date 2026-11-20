"use strict";
// The admin gate: an admin command waits for the person's press on its work's card
// The waits the engine was asked to run for a held call (`/bin/sleep`, which the world ends only on wake()): a press must end the
// hold with no more than the one that was in flight, and with no wake()
const countingSleeps = (on) => {
    const seen = { sleeps: 0 };
    const counted = new Proxy(on, {
        apply: (to, self, args) => {
            const [name, handle] = args;
            const run = name !== 'process.run' ? handle : (c, e) => (e.argv?.[0] === '/bin/sleep' && (seen.sleeps += 1), handle(c, e));
            return Reflect.apply(to, self, [name, run]);
        },
    });
    return { on: counted, seen };
};
// Everything drawn in the colour of what is done: no press leaves a green box or line
const gateGreens = async (pane) => [...(await pane.findAll({ type: 'Box' })), ...(await pane.findAll({ type: 'Text' }))].filter(one => (!(one.key ?? '').startsWith('outline-') || one.key === 'outline-top') && ['color', 'borderColor', 'backgroundColor'].some(prop => one.props[prop] === 'success')).length;
const gateTexts = async (pane) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''));
// The labels of one gate's own buttons, in the order drawn
const gateButtons = async (pane, id) => (await pane.findAll({ type: 'Button' })).filter(one => (one.key ?? '').startsWith(`gate-${id}-`)).map(one => String(one.props.label ?? ''));
const ALLOWED_LINE = '✓ You pressed “Allow”';
const REFUSED_LINE = "✓ You pressed “Don't allow”";
test('an admin command is held however the runner is reached, and nothing else is taken for one', async ($, on) => {
    const { press, bash, held, admins, list } = await gated($, on);
    let n = 0;
    for (const command of [
        `${ADMIN} here "id -u"`,
        `/plug/claudopus/bin/../bin/admin here 'id -u'`,
        `/plug/claudopus//bin/./admin here 'id -u'`,
        `cd /plug/claudopus/bin && ./admin here 'id -u'`,
        `cd /plug/claudopus && bin/admin here 'id -u'`,
        `"$CLAUDE_PLUGIN_ROOT"/bin/admin here 'id -u'`,
        `X=1 env Y=2 ${ADMIN} here 'id -u'`,
        `nohup ${ADMIN} here 'id -u' &`,
        `timeout 600 ${ADMIN} here 'id -u'`,
        `command ${ADMIN} here 'id -u'`,
        `bash -c "${ADMIN} here 'id -u'"`,
        `sh -lc '${ADMIN} here "id -u"'`,
        `bash ${ADMIN} here 'id -u'`,
        `eval "${ADMIN} here 'id -u'"`,
        `out=$(${ADMIN} here 'id -u') && echo "$out"`,
        `echo start; ${ADMIN} here 'id -u' | grep 0`,
        `sudo -u root ${ADMIN} here 'id -u'`,
        `if ${ADMIN} here 'id -u'; then echo yes; fi`,
        `if true; then ${ADMIN} here 'id -u'; fi`,
    ]) {
        const id = `d${(n += 1)}`;
        const call = bash(id, command);
        expect(await held(id)).toBeDefined();
        // Each shows the command as the runner would be handed it
        expect((await list.findAll({ type: 'Text', text: 'id -u' })).some(one => one.props.mono)).toBe(true);
        await press(`gate-${id}-0-deny`);
        expect((await call).deny).toContain('Refused by Sam');
    }
    // The command is shown as the shell hands it over, quotes inside it and all
    const quoted = bash('q1', `${ADMIN} here 'echo "a b" > /etc/x; chmod 644 /etc/x'`);
    expect(await held('q1')).toBeDefined();
    expect(await list.find({ type: 'Text', text: 'echo "a b" > /etc/x; chmod 644 /etc/x' })).toBeDefined();
    await press('gate-q1-0-deny');
    await quoted;
    // Inside double quotes a backslash stays, as the shell leaves it, unless it escapes a quote, a dollar or itself
    const slashed = bash('q2', `${ADMIN} here "printf 'a\\nb' > \\"/etc/x y\\""`);
    expect(await held('q2')).toBeDefined();
    expect(await list.find({ type: 'Text', text: `printf 'a\\nb' > "/etc/x y"` })).toBeDefined();
    await press('gate-q2-0-deny');
    await slashed;
    expect(admins).toEqual([]);
    // Words about it, forgetting a password, and other tools are no admin command: they run as they are
    for (const command of [`git commit -m "bin/admin here 'id -u' now asks"`, `echo ${ADMIN} here id`, `${ADMIN} here --forget`, `${ADMIN}`, 'django-admin migrate', 'ls bin/admin', `cat ${ADMIN}`, '/usr/local/bin/admin here now', 'vendor/bin/admin migrate up'])
        expect((await bash(`n${(n += 1)}`, command)).result).toBe('ran');
});
test("asked each time: the call is held and its card has one block (Permission, the question in amber, the command whole, Allow, Don't allow and Always allow this command); Allow lets that one command run at once, and one grey line says what was pressed", async ($, on) => {
    const counted = countingSleeps(on);
    const { list, bash, labels, held, grants, admins, logged, appended, notified, files, clock, wake } = await gated($, counted.on);
    let done = false;
    const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`).then(r => ((done = true), r));
    expect(await held('b1')).toBeDefined();
    // Held: nothing ran, and nothing is granted
    expect(done).toBe(false);
    expect(admins).toEqual([]);
    expect(grants()).toEqual([]);
    // The block: an amber outline, a dim label of its kind, the question in amber, the command whole in a row of its own, the buttons
    const boxes = (await list.findAll({ type: 'Box' }));
    expect(boxes.filter(one => one.key === 'outline-top' && one.props.backgroundColor === '#E5A50A').length).toBe(1);
    const drawn = await gateTexts(list);
    expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 3)).toEqual(['Permission', 'Run this as admin on this Mac?', 'chmod 644 /etc/hosts']);
    expect((await list.find({ type: 'Text', text: 'Permission' }))?.props.dimColor).toBe(true);
    const question = await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' });
    expect([question?.props.color, question?.props.bold]).toEqual(['#E5A50A', true]);
    expect((await list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' }))?.props.mono).toBe(true);
    expect(await gateButtons(list, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command']);
    // Nothing under the question when there is nothing more to say, and none of the words the block had before
    expect((await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).filter(text => /Allow|admin/.test(text))).toEqual([]);
    expect((await labels()).filter(one => ['Allow once', 'Allow for this task', 'Deny'].includes(one))).toEqual([]);
    // Its card is amber and counted once as what waits
    expect(boxes.some(one => one.props.width === 1 && one.props.backgroundColor === '#E5A50A')).toBe(true);
    expect((await list.findAll({ type: 'Text' })).filter(one => /waiting for you/.test(String(one.text ?? ''))).map(one => [one.text, one.props.color])).toEqual([['1 waiting for you', '#E5A50A']]);
    // Said as a notification, and to the chat's model alone: the chat shows nothing of it (18 Nov: "garbage I don't need to read");
    // its Details tab has the same block
    expect(logged.some(line => line.includes('chmod 644 /etc/hosts'))).toBe(false);
    expect(appended.some(line => line.startsWith('undefined: From Claudopus: the task "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts.'))).toBe(true);
    expect(notified).toContain('Fix the hosts file has a question for you | Run an admin command on this Mac: chmod 644 /etc/hosts');
    const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' });
    expect(await details.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined();
    expect(await gateButtons(details, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command']);
    await details.unmount();
    // The press itself ends the hold: the call returns with no second let pass (no wake, no move of the clock), and no wait was
    // started but the one in flight
    await pressed(list, 'gate-b1-0-once');
    expect((await call).result).toBe('ran');
    expect(counted.seen.sleeps).toBe(1);
    // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
    expect(admins.length).toBe(1);
    const [grant] = admins[0]?.grants ?? [];
    expect(admins[0]?.grants.length).toBe(1);
    expect({ host: grant?.host, command: grant?.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' });
    expect(grant?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', `grant\n${grant?.id}\n${grant?.at}\nhere\nchmod 644 /etc/hosts`));
    expect(grants()).toEqual([]);
    expect(files.has(ALLOWED)).toBe(false);
    // In the block's place: one grey line of what was pressed, and nothing green
    expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined();
    expect((await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE })))?.props.dimColor).toBe(true);
    expect((await gateTexts(list)).filter(one => one.startsWith('✓ '))).toEqual([ALLOWED_LINE]);
    expect(await gateGreens(list)).toBe(0);
    expect(await gateButtons(list, 'b1-0')).toEqual([]);
    // The line goes by itself a minute on
    await clock.advance(61000);
    expect(await until(async () => ((await list.find({ type: 'Text', text: ALLOWED_LINE })) ? undefined : true))).toBe(true);
    // Once is once: the same command again is held again
    const again = bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`);
    expect(await held('b2')).toBeDefined();
    expect(admins.length).toBe(1);
    await pressed(list, 'gate-b2-0-deny');
    expect((await again).deny).toContain('Refused by Sam');
    wake();
});
test("Don't allow refuses the call with a line that says the person refused it, and nothing runs or is granted", async ($, on) => {
    const { list, bash, held, grants, admins, wake } = await gated($, on);
    const call = bash('b1', `${ADMIN} m4 'rm -rf /Library/Caches/x'`);
    expect(await held('b1')).toBeDefined();
    expect(await list.find({ type: 'Text', text: 'Run this as admin on m4?' })).toBeDefined();
    await pressed(list, 'gate-b1-0-deny');
    const r = await call;
    expect(r.deny).toBe("Refused by Sam: Sam pressed Don't allow on this admin command, so it didn't run. Don't try to run it another way. Continue without it, or say what it is needed for and ask again.");
    expect(admins).toEqual([]);
    expect(grants()).toEqual([]);
    expect(await list.find({ type: 'Text', text: 'Run this as admin on m4?' })).toBeUndefined();
    expect((await until(async () => list.find({ type: 'Text', text: REFUSED_LINE })))?.props.dimColor).toBe(true);
    expect(await gateGreens(list)).toBe(0);
    wake();
});
test('no way to the runner gets past the press: another spelling, a shell, a helper, and two things to allow in one call each wait', async ($, on) => {
    const { press, list, bash, held, admins, labels, grants, files } = await gated($, on);
    // A helper's call shows on the card of the work it helps
    await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' });
    let n = 0;
    for (const command of [`cd /plug/claudopus/bin && ./admin here 'id -u'`, `bash -c "/plug/claudopus/bin/../bin/admin here 'id -u'"`, `X=1 env ${ADMIN} here 'id -u'`, `eval "${ADMIN} here 'id -u'"`]) {
        const id = `s${(n += 1)}`;
        const call = bash(id, command, n % 2 ? 'a2' : 'a1');
        expect(await held(id)).toBeDefined();
        expect(admins.length).toBe(0);
        await press(`gate-${id}-0-deny`);
        expect((await call).deny).toContain('Refused by Sam');
    }
    // Two in one call, an admin command and then another or a release: the first allowed, the second asked in its turn; refused,
    // neither runs, the first grant is taken back, and the card says the refusal, never that anything was allowed
    files.set('git:top', '/repo/wt');
    files.set('git:branch', 'fix-it');
    for (const [id, command, second, shown] of [
        ['t1', `${ADMIN} here 'id -u' && ${ADMIN} here 'whoami'`, 'gate-t1-1-deny', 'whoami'],
        ['t2', `${ADMIN} here 'id -u'; /plug/claudopus/bin/release`, 'gate-t2-r0-deny', 'Release fix-it to main?'],
    ]) {
        const both = bash(id, command);
        expect(await held(id)).toBeDefined();
        await press(`gate-${id}-0-once`);
        expect(await until(async () => keyed(list, second))).toBeDefined();
        expect(await list.find({ type: 'Text', text: shown })).toBeDefined();
        await press(second);
        expect((await both).deny).toContain('Refused by Sam');
        expect(admins.length).toBe(0);
        expect(grants()).toEqual([]);
        expect(await labels()).not.toContain("Don't allow");
        expect(await until(async () => list.find({ type: 'Text', text: REFUSED_LINE }))).toBeDefined();
        expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeUndefined();
    }
    // Words typed in the chat and passed on by the chat allow nothing: only the press does
    const waiting = bash('w1', `${ADMIN} here 'id -u'`);
    expect(await held('w1')).toBeDefined();
    await $.prompt.submit({ text: 'Allow', wait: false, origin: composer });
    await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow' });
    expect(await keyed(list, 'gate-w1-0-once')).toBeDefined();
    expect(admins.length).toBe(0);
    await press('gate-w1-0-deny');
    await waiting;
});
test('Always allow this command keeps the exact command for its Mac, sealed; Config lists it with Remove, and a list work wrote itself allows nothing', async ($, on) => {
    const { press, list, bash, held, admins, files, tabs } = await gated($, on);
    const first = bash('b1', `${ADMIN} here 'softwareupdate -l'`);
    expect(await held('b1')).toBeDefined();
    await press('gate-b1-0-always');
    expect((await first).result).toBe('ran');
    const kept = JSON.parse(files.get(ALLOWED) ?? '{}');
    expect(kept.here?.map(one => one.command)).toEqual(['softwareupdate -l']);
    expect(kept.here?.[0]?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', 'allow\nhere\nsoftwareupdate -l'));
    // The same command on the same Mac now runs without a press, with its own grant
    expect((await bash('b2', `${ADMIN} here 'softwareupdate -l'`)).result).toBe('ran');
    expect(admins.length).toBe(2);
    expect(admins[1]?.grants.map(one => one.command)).toEqual(['softwareupdate -l']);
    // Another command, or the same one on another Mac, still asks
    for (const [id, command] of [['b3', `${ADMIN} here 'softwareupdate -l -a'`], ['b4', `${ADMIN} m4 'softwareupdate -l'`]]) {
        const call = bash(id, command);
        expect(await held(id)).toBeDefined();
        await press(`gate-${id}-0-deny`);
        await call;
    }
    // An entry with no seal, or another entry's seal, as work could write into the file, allows nothing
    const forged = { here: [...(kept.here ?? []), { command: 'rm -rf /', seal: kept.here?.[0]?.seal ?? '', at: 1 }, { command: 'reboot', seal: '', at: 1 }] };
    // As if it got past the guards with the kept copy (a key F-007's way): the seals still allow nothing
    ownSet(files, 'admin-allowed.json', JSON.stringify(forged));
    for (const [id, command] of [['f1', `${ADMIN} here 'rm -rf /'`], ['f2', `${ADMIN} here 'reboot'`]]) {
        const call = bash(id, command);
        expect(await held(id)).toBeDefined();
        await press(`gate-${id}-0-deny`);
        expect((await call).deny).toContain('Refused by Sam');
    }
    // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
    await pressed(list, 'config-open');
    expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined();
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
    expect(await moreShown(config)).toBe(true);
    expect(await config.find({ type: 'Text', text: /These run without asking, exactly as written and only on their Mac\./ })).toBeDefined();
    expect((await config.find({ type: 'Text', text: 'softwareupdate -l' }))?.props.mono).toBe(true);
    expect(await config.find({ type: 'Text', text: 'rm -rf /' })).toBeUndefined();
    expect(await config.find({ type: 'Text', text: /2 more in the file weren't added here, so they allow nothing/ })).toBeDefined();
    const before = files.get('keychain:gate');
    const stale = JSON.stringify(kept);
    await pressed(config, 'config-admin-remove-0');
    expect(await until(async () => (JSON.parse(files.get(ALLOWED) ?? '{"here":[1]}').here === undefined ? true : undefined))).toBe(true);
    expect(await until(() => config.find({ type: 'Text', text: /None is always allowed yet\./ }))).toBeDefined();
    // Removing made a new key: the old entry put back, seal and all, allows nothing
    expect(files.get('keychain:gate')).not.toBe(before);
    files.set(ALLOWED, stale);
    const again = bash('b5', `${ADMIN} here 'softwareupdate -l'`);
    expect(await held('b5')).toBeDefined();
    await press('gate-b5-0-deny');
    await again;
});
test('work never reads or writes the allowed list, the grants or the key that seals them', async ($, on) => {
    const { press, bash, files } = await gated($, on);
    for (const command of [
        `echo '{"here":[{"command":"reboot","seal":"x"}]}' > ~/.claude/claudopus/admin-allowed.json`,
        `cat ${MEMORY}/admin-allowed.json`,
        `cp /tmp/g.json ${MEMORY}/admin-grants/g.json`,
        'security add-generic-password -U -s claudopus-admin-gate -a seal -w abc',
        'security delete-generic-password -s claudopus-admin-gate -a seal',
    ])
        expect((await bash(`t${command.length}`, command)).deny).toContain('Only Sam adds to them');
    for (const tool of ['Write', 'Edit'])
        for (const path of [ALLOWED, `${GRANTS}g.json`])
            expect((await $.tool.call({ tool, tool_use_id: `w-${tool}-${path.length}`, file_path: path, content: '{}', agentId: 'a1' })).deny).toContain('Only Sam adds to them');
    expect(files.has(ALLOWED)).toBe(false);
    // The memory folder's other files are work's to write as before
    expect((await $.tool.call({ tool: 'Write', tool_use_id: 'w9', file_path: `${MEMORY}/streams/x.md`, content: 'x', agentId: 'a1' })).deny).toBeUndefined();
});
test('asked once per piece of work: one Allow covers that work and its helpers until it ends, and no other work', async ($, on) => {
    const { press, list, bash, held, admins, files, tabs } = await gated($, on);
    // The setting is chosen in Config, which seals it
    await pressed(list, 'config-open');
    expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined();
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
    expect(await moreShown(config)).toBe(true);
    expect(await config.find({ type: 'Text', text: 'Admin commands' })).toBeDefined();
    await config.select({ key: 'config-admin-mode-pick', value: 'work' });
    const sealedAs = await until(async () => JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').adminSealed);
    expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal(files.get('keychain:gate') ?? '', 'mode\nwork') });
    expect(sealedAs).toBeDefined();
    await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' });
    await $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Update the other Mac', prompt: 'update the other Mac' });
    const first = bash('b1', `${ADMIN} here 'id -u'`);
    expect(await held('b1')).toBeDefined();
    // The same three buttons, and under the question what this Allow covers
    expect(await gateButtons(list, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command']);
    expect((await list.findAll({ type: 'Markdown' })).map(one => one.props.text)).toContain("Allow also covers this task's next admin commands.");
    await press('gate-b1-0-once');
    expect((await first).result).toBe('ran');
    // Its later commands, and its helper's, run without another press, each with its own grant
    expect((await bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)).result).toBe('ran');
    expect((await bash('b3', `${ADMIN} m4 'whoami'`, 'a2')).result).toBe('ran');
    expect(admins.map(one => one.grants.map(grant => grant.command))).toEqual([['id -u'], ['chmod 644 /etc/hosts'], ['whoami']]);
    // Another piece of work is asked for itself
    const other = bash('b4', `${ADMIN} here 'id -u'`, 'a3');
    expect(await held('b4')).toBeDefined();
    await press('gate-b4-0-deny');
    expect((await other).deny).toContain('Refused by Sam');
    // Ended and started again, it asks again
    await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' });
    const back = bash('b5', `${ADMIN} here 'id -u'`);
    expect(await held('b5')).toBeDefined();
    await press('gate-b5-0-deny');
    await back;
    expect(admins.length).toBe(3);
});
for (const admin of ['never', 'work'])
    test(`"${admin}" written into config.json by anything but Config counts for nothing: every command still asks`, async ($, on) => {
        const { press, bash, held, admins, files } = await gated($, on, { admin, adminSealed: fakeSeal('kept-key', `mode\n${admin}`).replace(/^./, 'z') });
        files.set('keychain:gate', 'kept-key');
        const call = bash('b1', `${ADMIN} here 'id -u'`);
        expect(await held('b1')).toBeDefined();
        expect(admins.length).toBe(0);
        await press('gate-b1-0-deny');
        await call;
        const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
        expect(await moreShown(config)).toBe(true);
        expect(await config.find({ type: 'Text', text: new RegExp(`Your settings file says "${admin}", but you didn't choose it here, so every command asks`) })).toBeDefined();
    });
test('never asked, as Config sealed it: the call goes through as it was made, with no hold, no grant and nothing on the card', async ($, on) => {
    const { press, list, bash, admins, files, grants, logged, notified } = await gated($, on, { admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }, { env: {} });
    files.set('keychain:gate', 'kept-key');
    const before = [...files.keys()].filter(path => !path.endsWith('log.md')).sort();
    const r = await bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`);
    expect(r.result).toBe('ran');
    expect(r.deny).toBeUndefined();
    expect(admins).toEqual([{ command: `${ADMIN} here 'chmod 644 /etc/hosts'`, grants: [] }]);
    expect(grants()).toEqual([]);
    expect(files.has(ALLOWED)).toBe(false);
    expect([...files.keys()].filter(path => !path.endsWith('log.md') && !path.includes('/live/')).sort()).toEqual(before.filter(path => !path.includes('/live/')));
    expect(logged.some(line => line.includes('admin command'))).toBe(false);
    expect(notified.some(line => line.includes('admin command'))).toBe(false);
    expect(await list.find({ type: 'Text', text: 'Permission' })).toBeUndefined();
    expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined();
    // Config's Reset puts the asking back, and makes a new key
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
    await moreShown(config);
    await pressed(config, 'config-admin-mode-back');
    expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').admin === undefined ? true : undefined))).toBe(true);
    expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam' });
    expect(files.get('keychain:gate')).not.toBe('kept-key');
});
test('with no panel to ask on, an admin command is refused, never run unasked', async ($, on) => {
    const { press, bash, admins } = await gated($, on, {}, { headless: true });
    expect((await bash('b1', `${ADMIN} here 'id -u'`)).deny).toContain('this chat has no panel open');
    expect(admins).toEqual([]);
});
test('F-008 F-009 · no admin password is kept: Config has no setting to keep one, every one an earlier version kept is forgotten as the mod loads, and admin commands on another Mac still ask on their card', async ($, on) => {
    const { press, bash, held, admins, files } = await gated($, on, { adminPassword: 'keep' });
    expect(await until(async () => files.get('keychain:admin-forgotten'))).toBe('yes');
    expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').adminPassword === undefined ? true : undefined))).toBe(true);
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
    expect(await moreShown(config)).toBe(true);
    expect(await config.find({ type: 'Text', text: 'Admin password' })).toBeUndefined();
    expect(await config.find({ type: 'Text', text: /each asks for your Mac password, which Claudopus never saves/ })).toBeDefined();
    // Another Mac's admin command is held on its card as this Mac's is: its password is asked when it runs
    const call = bash('b2', `${ADMIN} m4 'id -u'`);
    expect(await held('b2')).toBeDefined();
    await press('gate-b2-0-once');
    expect((await call).result).toBe('ran');
    expect(admins.length).toBe(1);
});
test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work, and its press is said there in one grey line", async ($, on) => {
    const w = world(on);
    w.files.set('keychain:gate', 'kept-key');
    w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }));
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer });
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' });
    for (const id of ['c1', 'c2']) {
        const call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: `${ADMIN} here 'id -u'` });
        expect(await until(async () => keyed(list, `gate-${id}-0-deny`))).toBeDefined();
        // Whose it is stands beside its kind, as it is on no task's card
        expect((await list.find({ type: 'Text', text: 'Permission · This chat' }))?.props.dimColor).toBe(true);
        expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined();
        // No piece of work to allow it for: the chat's thread never ends, so it is asked each time, and Allow covers this one alone
        expect(await gateButtons(list, `${id}-0`)).toEqual(['Allow', "Don't allow", 'Always allow this command']);
        expect((await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).filter(text => text.includes('also covers'))).toEqual([]);
        // The press ends the hold by itself
        await pressed(list, `gate-${id}-0-once`);
        expect((await call).result).toBe('ran');
        expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeUndefined();
        expect((await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE })))?.props.dimColor).toBe(true);
        expect(await gateGreens(list)).toBe(0);
    }
    expect(w.admins.length).toBe(2);
    w.wake();
});
test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", async ($, on) => {
    const { files, clock } = world(on);
    await $.session.start(start);
    const at = 1700000000000;
    files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at }], startedAt: at - 60000, endedAt: 0, status: 'working' }] }));
    await clock.advance(5000);
    const list = await $.ui.mount({ ...LIST, surface: 'desktop' });
    expect(await until(async () => list.find({ type: 'Text', text: 'softwareupdate -i -a' }))).toBeDefined();
    expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined();
    expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined();
    expect((await list.find({ type: 'Text', text: 'Allow it on its card in its own chat.' }))?.props.dimColor).toBe(true);
    expect((await list.findAll({ type: 'Button' })).some(one => ['Allow', 'Always allow this command', "Don't allow"].includes(String(one.props.label)) || (one.key ?? '').startsWith('gate-'))).toBe(false);
});
test('a release nobody pressed for is asked, once, for its own branch, with Allow and Don\'t allow alone, saying what it puts on main: the 15 Nov run-progress-rows release, its output sent to a log, asked twice, first for a branch called ">"; and the 19 Nov release that said only its branch and folder', async ($, on) => {
    const { list, files, grants, holding, wake } = await gated($, on);
    files.set('git:top', '/repo/wt');
    files.set('git:branch', 'fix-it');
    // What it says under the question: the task's own line (-m), else that it gave none, then the commits main lacks, then the counts
    const commits = '- Fix the hosts file\n- Test the hosts file';
    for (const [id, tail, log, about] of [
        ['rl1', ' -m "Make the server start again after a reboot" > /tmp/release.log 2>&1', 'Fix the hosts file\nTest the hosts file\n', `Make the server start again after a reboot\n\n${commits}\n\n2 commits · 3 changed files · branch fix-it · from /repo/wt`],
        ['rl2', ' 2>/tmp/release.log', 'Fix the hosts file\nTest the hosts file\n', `Claude gave no reason for it. Its commits say:\n\n${commits}\n\n2 commits · 3 changed files · branch fix-it · from /repo/wt`],
        ['rl3', '>/tmp/release.log', '', 'Branch fix-it · from /repo/wt'],
    ]) {
        files.set('git:log', log);
        files.set('git:diff', log ? 'etc/hosts\ntest/hosts.test.ts\nREADME.md\n' : '');
        const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold x${id}; /plug/claudopus/bin/release${tail}` });
        expect(await until(async () => keyed(list, `gate-${id}-r0-once`))).toBeDefined();
        // Said in plain words: what is released in the question, what it puts on main under it, and no command row
        const drawn = await gateTexts(list);
        expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 2)).toEqual(['Permission', 'Release fix-it to main?']);
        expect((await list.find({ type: 'Text', text: 'Release fix-it to main?' }))?.props.color).toBe('#E5A50A');
        const under = (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? ''));
        expect(under).toContain(about);
        expect([...drawn, ...under].some(one => /^>|> from/.test(one))).toBe(false);
        expect(drawn.some(one => one === 'fix-it from /repo/wt')).toBe(false);
        // A release is asked each time: nothing to always allow
        expect(await gateButtons(list, `${id}-r0`)).toEqual(['Allow', "Don't allow"]);
        await pressed(list, `gate-${id}-r0-once`);
        const granted = await until(async () => (grants().length ? grants() : undefined));
        expect(granted?.map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-it']]);
        expect(await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE }))).toBeDefined();
        (await until(async () => holding.get(`x${id}; /plug/claudopus/bin/release${tail}`)))?.('released');
        expect((await call).deny).toBeUndefined();
    }
    wake();
});
test("the press on a task's go-ahead for a release lets that task's next release of that folder through with no block, once: a second run, another folder and another task are asked", async ($, on) => {
    const { list, files, grants, holding, appended, resumed, wake, press } = await gated($, on);
    files.set('git:top', '/repo/wt');
    files.set('git:branch', 'fix-it');
    files.set('/repo/wt/.release', 'main\n');
    await $.agent.spawn({ ...spawn, description: 'Tidy the logs', prompt: 'tidy the logs' });
    let asks = 0;
    const goAhead = async () => {
        const text = `Release the hosts fix, round ${(asks += 1)}?`;
        await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k${asks}`, agentId: 'a1', text, details: 'It changes one line.', choices: ['Release it'], release: '/repo/wt' });
        const button = await until(async () => (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Release it'));
        await list.press({ key: button?.key ?? '' });
        expect(await until(async () => [...appended, ...resumed].find(line => line.includes('pressed "Release it"') && line.includes(text)))).toBeDefined();
    };
    const release = (id, agentId) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command: `hold x${id}; /plug/claudopus/bin/release` });
    // Let through: its grant is made with nothing asked
    const through = async (id) => {
        const call = release(id, 'a1');
        const run = await until(async () => holding.get(`x${id}; /plug/claudopus/bin/release`));
        expect(run).toBeDefined();
        expect(grants().map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-it']]);
        expect(await keyed(list, `gate-${id}-r0-once`)).toBeUndefined();
        expect(await list.find({ type: 'Text', text: 'Release fix-it to main?' })).toBeUndefined();
        run?.('released');
        expect((await call).deny).toBeUndefined();
    };
    // Asked on its card, as a release nobody pressed for, and refused there
    const asked = async (id, agentId = 'a1') => {
        const call = release(id, agentId);
        expect(await until(async () => keyed(list, `gate-${id}-r0-deny`))).toBeDefined();
        expect(await gateButtons(list, `${id}-r0`)).toEqual(['Allow', "Don't allow"]);
        expect(grants()).toEqual([]);
        await press(`gate-${id}-r0-deny`);
        expect((await call).deny).toBe("Refused by Sam: Sam pressed Don't allow on this release, so nothing was released. Don't try to release it another way. Continue without it, or say what it is needed for and ask again.");
    };
    await goAhead();
    await through('r1');
    // Once: the press allowed one run
    await asked('r2');
    // A new press, and still only that folder's release by that task: another worktree's and another task's are asked, and neither
    // uses the press up
    await goAhead();
    files.set('git:top', '/repo/other');
    await asked('r3');
    files.set('git:top', '/repo/wt');
    await asked('r4', 'a2');
    await through('r5');
    await asked('r6');
    wake();
});
test("a permission on a task's card is answered in words before any press: the held call ends with the words for the task, the block stays with its buttons, shows the words and the task's answer in place of a question of its own, and only Allow lets the very same command through, once; Don't allow after words refuses it", async ($, on) => {
    const { list, bash, held, grants, press, appended, resumed, files, holding, wake } = await gated($, on);
    const told = (words) => until(async () => [...appended, ...resumed].find(line => line.startsWith('a1: ') && line.includes(words)));
    const words = async (id, text) => {
        const field = await until(async () => (await list.findAll({ type: 'Input' })).find(one => (one.key ?? '').startsWith(`gate-${id}-words-field-`)));
        await list.input({ key: field?.key ?? '', text });
        wake();
    };
    const call = bash('w1', `${ADMIN} here 'id -u'`);
    await held('w1');
    await words('w1-0', 'What is this for?');
    const said = (await call).deny ?? '';
    expect(said).toContain('neither allowed nor refused it, and wrote to you about it instead, in their own words: “What is this for?”');
    expect(said).toContain("Don't run it again until then");
    expect(grants()).toEqual([]);
    // While the task answers, the card folds the permission to the one grey line of the words, with nothing to press (19 Nov, the
    // person: "it didn't remove the buttons that I already answered"), and the card waits on nobody
    const answeredLines = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => one.startsWith('✓ You answered'));
    expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? undefined : true))).toBe(true);
    expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined();
    expect(await answeredLines()).toEqual(['✓ You answered “What is this for?”']);
    expect(await list.find({ type: 'Text', text: '1 waiting for you' })).toBeUndefined();
    const answer = async (id, text, details) => {
        await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text, ...(details ? { details } : {}) });
        expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? true : undefined))).toBe(true);
    };
    // The task's answer, given with no buttons, goes inside the permission under the words, never as a question of its own, and
    // brings back its buttons, with no grey line of the words beside the block that shows them
    await answer('k1', 'It checks which user the server runs as.', 'It changes nothing.');
    expect(await until(async () => (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).find(one => one.includes('**The answer:**')))).toBe('**You asked:** What is this for?\n\n**The answer:** It checks which user the server runs as.\n\nIt changes nothing.');
    expect(await gateButtons(list, 'w1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command']);
    expect(await answeredLines()).toEqual([]);
    expect(await list.find({ type: 'Text', text: 'Question' })).toBeUndefined();
    // More words go to the task as a message, and fold it again until the task answers them
    await words('w1-0', 'And why now?');
    expect(await told('wrote to you again about the admin command that waits on your card')).toContain('“And why now?”');
    expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? undefined : true))).toBe(true);
    await answer('k2', 'The server moves to a new user today.');
    // Allow: the task is told to run it again, and that very command goes through with nothing asked, once
    await press('gate-w1-0-once');
    expect(await told('pressed Allow on the admin command that waited on your card')).toBeDefined();
    expect(await until(async () => ((await keyed(list, 'gate-w1-0-once')) ? undefined : true))).toBe(true);
    const second = bash('w2', `hold xw2; ${ADMIN} here 'id -u'`);
    const run = await until(async () => holding.get(`xw2; ${ADMIN} here 'id -u'`));
    expect(grants()).toHaveLength(1);
    expect(await keyed(list, 'gate-w2-0-once')).toBeUndefined();
    run?.('ran');
    expect((await second).deny).toBeUndefined();
    const third = bash('w3', `${ADMIN} here 'id -u'`);
    await held('w3');
    await press('gate-w3-0-deny');
    expect((await third).deny).toContain("pressed Don't allow");
    // A release answered in words, then refused: the task hears the refusal, and its next run is asked again
    files.set('git:top', '/repo/wt');
    files.set('git:branch', 'fix-it');
    const release = $.tool.call({ tool: 'Bash', tool_use_id: 'w4', agentId: 'a1', command: 'hold xw4; /plug/claudopus/bin/release' });
    expect(await until(async () => keyed(list, 'gate-w4-r0-once'))).toBeDefined();
    await words('w4-r0', 'What does it fix?');
    expect((await release).deny).toContain('This release did not run yet');
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'It fixes the hosts file.' });
    await until(async () => keyed(list, 'gate-w4-r0-deny'));
    await press('gate-w4-r0-deny');
    expect(await told("pressed Don't allow on this release")).toBeDefined();
    expect(await until(async () => ((await keyed(list, 'gate-w4-r0-deny')) ? undefined : true))).toBe(true);
    const asked = $.tool.call({ tool: 'Bash', tool_use_id: 'w5', agentId: 'a1', command: 'hold xw5; /plug/claudopus/bin/release' });
    expect(await until(async () => keyed(list, 'gate-w5-r0-once'))).toBeDefined();
    await press('gate-w5-r0-deny');
    expect((await asked).deny).toContain("pressed Don't allow");
});
// A long list of another chat's running work, two of whose cards wait on a gate and one on an ask: what the 15 Nov panel drew below
// the fold, where the person had to scroll to find its Allow
const longList = (at, gates, asks = {}) => JSON.stringify({
    chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at,
    cards: ['one', 'two', 'three', 'four', 'five', 'six'].map((name, n) => ({
        id: `w${n + 1}`, parentId: '', isFork: false, tokens: 0, title: `Card ${name}`, words: name, items: [], entries: [], answer: '', startedAt: at - 600000 + n * 60000, endedAt: 0, status: 'working',
        ...(gates[`w${n + 1}`] ? { admins: [{ id: `g${n + 1}`, host: 'here', command: `run step ${name}`, at: gates[`w${n + 1}`] }] } : {}),
        ...(asks[`w${n + 1}`] ? { ask: { text: `Which way for ${name}?`, at: asks[`w${n + 1}`], choices: ['Left', 'Right'] } } : {}),
    })),
});
const textOrder = async (pane) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''));
test('a work that waits for a press comes to the top whole, its amber block in it, the oldest first with the cards that asked; answered, it goes at once to the place it began in, under all that still waits', async ($, on) => {
    const { files, clock } = world(on);
    await $.session.start(start);
    const at = 1700000000000;
    files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }, { w4: at - 1500 }));
    await clock.advance(5000);
    const list = await $.ui.mount({ ...LIST, surface: 'desktop' });
    expect(await until(async () => list.find({ type: 'Text', text: 'run step six' }))).toBeDefined();
    const texts = await textOrder(list);
    const first = (text) => texts.indexOf(text);
    // Oldest first, as they came: the older gate's card, the card that asked, the card whose gate came last; then the rest in the
    // order they began, so what comes later goes under what is already there
    expect(first('Card five')).toBeLessThan(first('Card four'));
    expect(first('Card four')).toBeLessThan(first('Card six'));
    expect(first('Card six')).toBeLessThan(first('Card one'));
    // Each gate is in its own card, right under its title, never apart from it
    expect(first('Card five')).toBeLessThan(first('run step five'));
    expect(first('run step five')).toBeLessThan(first('Card four'));
    expect(first('Card six')).toBeLessThan(first('run step six'));
    expect(first('run step six')).toBeLessThan(first('Card one'));
    const rest = (all) => all.filter(one => /^Card (one|two|three)$/.test(one));
    expect(rest(texts)).toEqual(['Card one', 'Card two', 'Card three']);
    // The older gate is answered (in its own chat) while the others still wait: its card goes at once to the place it began in among
    // the working, never above what waits
    files.set(`${MEMORY}/live/chat-b.json`, longList(at + 6000, { w6: at - 1000 }, { w4: at - 1500 }));
    await clock.advance(5000);
    expect(await until(async () => ((await list.find({ type: 'Text', text: 'run step five' })) ? undefined : true))).toBe(true);
    const after = await textOrder(list);
    expect(after.indexOf('Card four')).toBeLessThan(after.indexOf('Card six'));
    expect(after.indexOf('Card six')).toBeLessThan(after.indexOf('Card one'));
    expect(after.filter(one => /^Card (one|two|three|five)$/.test(one))).toEqual(['Card one', 'Card two', 'Card three', 'Card five']);
    // Once nothing waits, the cards go back to where they began
    files.set(`${MEMORY}/live/chat-b.json`, longList(at + 12000, {}, {}));
    await clock.advance(5000);
    expect(await until(async () => ((await list.find({ type: 'Text', text: 'run step six' })) ? undefined : true))).toBe(true);
    expect(await until(async () => ((await textOrder(list)).filter(one => /^Card /.test(one)).join('|') === 'Card one|Card two|Card three|Card four|Card five|Card six' ? true : undefined))).toBe(true);
});
test('a gate answered on its card says what was pressed in that same card, in one grey line with no box of its own, while the card stays at the top', async ($, on) => {
    const { press, bash, held, list } = await gated($, on);
    const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`);
    expect(await held('b1')).toBeDefined();
    await press('gate-b1-0-once');
    await call;
    expect(await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE }))).toBeDefined();
    expect((await list.findAll({ type: 'Box' })).filter(one => one.key === 'outline-top' || (one.key ?? '').startsWith('done-gate-'))).toEqual([]);
    const drawn = await textOrder(list);
    // In its card, under the work's title, not a line of its own at the top
    expect(drawn.indexOf('Fix the hosts file')).toBeLessThan(drawn.indexOf(ALLOWED_LINE));
    expect(drawn.filter(one => one === ALLOWED_LINE).length).toBe(1);
    // Another work's gate comes in while the grey line is still said: its card, which waits, is drawn above the answered one
    await $.agent.spawn({ ...spawn, description: 'Tidy the logs', prompt: 'tidy the logs' });
    const call2 = bash('b2', `${ADMIN} here 'id -u'`, 'a2');
    expect(await held('b2')).toBeDefined();
    const now = await textOrder(list);
    expect(now.indexOf('Tidy the logs')).toBeGreaterThan(-1);
    expect(now.indexOf('Tidy the logs')).toBeLessThan(now.indexOf('Fix the hosts file'));
    expect(now.indexOf(ALLOWED_LINE)).toBeGreaterThan(now.indexOf('Tidy the logs'));
    await press('gate-b2-0-deny');
    await call2;
});
test('on the desktop the line above the prompt says how many wait and what the first asks, scrolled or not, and Show takes a scrolled list to the top; in the terminal it comes only once scrolled', async ($, on) => {
    const { files, clock } = world(on, { panes: ['claudopus'] });
    await $.session.start(start);
    const at = 1700000000000;
    files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }));
    await clock.advance(5000);
    // The first is the card whose gate came first: w5's
    const MARK = /^● 2 waiting for you · /;
    const show = async (band) => (await band.findAll({ type: 'Button' })).some(one => one.props.label === 'Show');
    for (const surface of ['desktop', 'terminal']) {
        const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface });
        expect(await until(async () => down.find({ type: 'Text', text: 'run step six' }))).toBeDefined();
        const band = await $.ui.mount({ ...BAND, surface });
        const mark = await until(async () => band.find({ type: 'Text', text: MARK }));
        expect(mark?.props.color).toBe('#E5A50A');
        expect(await show(band)).toBe(true);
        await band.unmount();
        await down.unmount();
        const top = await $.ui.mount({ ...LIST, surface });
        expect(await until(async () => top.find({ type: 'Text', text: 'run step six' }))).toBeDefined();
        const still = await $.ui.mount({ ...BAND, surface });
        if (surface === 'desktop')
            expect(await until(async () => still.find({ type: 'Text', text: MARK }))).toBeDefined();
        else
            expect(await still.find({ type: 'Text', text: MARK })).toBeUndefined();
        expect(await show(still)).toBe(false);
        await still.unmount();
        await top.unmount();
    }
});
test("in the terminal, an ask that comes in while one is typed in never takes the keys from it; the oldest ask is drawn first", async ($, on) => {
    const { clock } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'two things', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' });
    await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' });
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] });
    const list = await $.ui.mount({ ...LIST, surface: 'terminal' });
    const focused = async () => (await list.findAll({ type: 'Input' })).filter(one => one.props.autoFocus).map(one => (one.key ?? '').split('-reply')[0]);
    expect(await until(async () => ((await focused()).length ? focused() : undefined))).toEqual([expect.stringContaining('a1')]);
    await clock.advance(2000);
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which ear first?', choices: ['Left', 'Right'] });
    expect(await until(async () => list.find({ type: 'Text', text: 'Which ear first?' }))).toBeDefined();
    const texts = await textOrder(list);
    expect(texts.indexOf('May I delete the old repo?')).toBeLessThan(texts.indexOf('Which ear first?'));
    expect(await focused()).toEqual([expect.stringContaining('a1')]);
});
test('the line above the prompt never points into a list that is not open', async ($, on) => {
    const { files, clock } = world(on);
    await $.session.start(start);
    const at = 1700000000000;
    files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }));
    await clock.advance(5000);
    const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface: 'desktop' });
    expect(await until(async () => down.find({ type: 'Text', text: 'run step six' }))).toBeDefined();
    await down.unmount();
    const band = await $.ui.mount({ ...BAND, surface: 'desktop' });
    expect((await textOrder(band)).some(one => one.includes('waiting for you'))).toBe(false);
});
test('in the terminal, a password box that comes while a reply is being typed leaves the keys with the reply', async ($, on) => {
    const w = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'two things', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' });
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] });
    const list = await $.ui.mount({ ...LIST, surface: 'terminal' });
    const inputs = async () => (await list.findAll({ type: 'Input' })).map(one => ({ key: one.key ?? '', focus: Boolean(one.props.autoFocus) }));
    const reply = await until(async () => (await inputs()).find(one => one.focus));
    await list.input({ key: reply?.key ?? '', text: 'Not y', kind: 'change' });
    void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: `hold /plug/claudopus/bin/admin m4 'id -u'` }));
    const id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98';
    w.files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
    await w.clock.advance(1000);
    expect(await until(async () => ((await inputs()).some(one => one.key.startsWith('box-')) ? true : undefined))).toBe(true);
    expect((await inputs()).filter(one => one.focus).map(one => one.key)).toEqual([reply?.key]);
    await w.settle();
});
test('in the terminal, an ask that comes while a password is being typed leaves the keys with the password box', async ($, on) => {
    const w = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'two things', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' });
    const list = await $.ui.mount({ ...LIST, surface: 'terminal' });
    void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: `hold /plug/claudopus/bin/admin m4 'id -u'` }));
    const id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98';
    w.files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
    await w.clock.advance(1000);
    const inputs = async () => (await list.findAll({ type: 'Input' })).map(one => ({ key: one.key ?? '', focus: Boolean(one.props.autoFocus) }));
    const box = await until(async () => (await inputs()).find(one => one.key.startsWith('box-')));
    await list.input({ key: box?.key ?? '', text: 'hunt', kind: 'change' });
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] });
    expect(await until(async () => ((await inputs()).some(one => one.key.startsWith('ask-')) ? true : undefined))).toBe(true);
    expect((await inputs()).filter(one => one.focus).map(one => one.key)).toEqual([box?.key]);
    await w.settle();
});
// Five pieces of work, the fourth asking: the 15 Nov "Release it" on an ended ask took the card from the top to the very end of a long
// panel, which read as the panel jumping to the bottom
const askingFourth = async ($, on, choices, ended = false) => {
    const w = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'five things', wait: false, origin: composer });
    for (const n of [1, 2, 3, 4, 5])
        await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` });
    const list = await $.ui.mount({ ...LIST, surface: 'desktop' });
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release piece four?', ...(choices ? { choices } : {}) });
    // (ended: it hands in its result with the question still open, which is what ends a task)
    if (ended)
        await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a4', agentId: 'a4', message: 'Waits for your Release it.' });
    if (ended)
        await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a4', reason: 'answer', agentId: 'a4' });
    await w.clock.advance(5000);
    const order = async () => (await textOrder(list)).filter(one => /^Piece \d$/.test(one)).filter((one, n, all) => all.indexOf(one) === n);
    expect(await until(async () => ((await order())[0] === 'Piece 4' ? true : undefined))).toBe(true);
    return { ...w, list, order };
};
test('Release it on an ended ask takes its card at once to the place its work began in, saying the answer, never the end', async ($, on) => {
    const { list, order, clock, resumed } = await askingFourth($, on, ['Release it'], true);
    const release = (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Release it');
    await list.press({ key: release?.key ?? '' });
    expect(await until(async () => resumed.find(line => line.startsWith('a4: ') && line.includes('pressed "Release it"')))).toBeDefined();
    expect(await until(async () => list.find({ type: 'Text', text: /You answered “Release it”/ }))).toBeDefined();
    expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
    // and so a minute on
    await clock.advance(65000);
    expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
});
const answeredStays = async ($, on, how) => {
    const { list, order, clock } = await askingFourth($, on, ['Go on']);
    if (how === 'press')
        await list.press({ key: (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Go on')?.key ?? '' });
    else
        await list.input({ key: (await list.findAll({ type: 'Input' })).find(one => /-reply-/.test(one.key ?? ''))?.key ?? '', text: 'It is pasted' });
    expect(await until(async () => list.find({ type: 'Text', text: /You answered/ }))).toBeDefined();
    expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
    // It says the answer there for a minute
    await clock.advance(30000);
    expect(await list.find({ type: 'Text', text: /You answered/ })).toBeDefined();
    expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
};
test("a press on an ask's own button takes the card at once to its own place among the working, saying the answer", async ($, on) => answeredStays($, on, 'press'));
test('an answer sent from an ask\'s box takes the card at once to its own place among the working, saying the answer', async ($, on) => answeredStays($, on, 'reply'));
test('answering one of two asks at the top takes the answered card at once to its own place among the working, under the one still waiting and under what was delivered; asked again, it goes under what already waits', async ($, on) => {
    const { list, order, clock } = await askingFourth($, on, ['Go on']);
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release piece two?', choices: ['Release it'] });
    await clock.advance(5000);
    // The newer ask goes under the older one, never above it
    expect(await until(async () => ((await order())[1] === 'Piece 2' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5']);
    // Piece 5 hands in its result: delivered, blue, it is under what waits and over what works
    await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a5', agentId: 'a5', message: 'Done.' });
    await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a5', reason: 'answer', agentId: 'a5' });
    await clock.advance(5000);
    expect(await until(async () => ((await order())[2] === 'Piece 5' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 4', 'Piece 2', 'Piece 5', 'Piece 1', 'Piece 3']);
    // The older ask, first at the top, is answered: at once the one still waiting is first and the answered card is in its own place
    // among the working, saying the answer while it holds the space its question took, and under the line its work then writes
    await list.press({ key: (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Go on')?.key ?? '' });
    expect(await until(async () => list.find({ type: 'Text', text: /You answered “Go on”/ }))).toBeDefined();
    expect(await until(async () => ((await order())[0] === 'Piece 2' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n4', agentId: 'a4', text: 'Now doing the next part' });
    await clock.advance(5000);
    expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
    expect(await list.find({ type: 'Text', text: /You answered “Go on”/ })).toBeDefined();
    await clock.advance(65000);
    expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
    // It asks again: new, it goes under what already waits
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a4', text: 'And the next part?', choices: ['Yes', 'No'] });
    await clock.advance(1000);
    expect(await until(async () => ((await order())[1] === 'Piece 4' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 2', 'Piece 4', 'Piece 5', 'Piece 1', 'Piece 3']);
    // Both are answered: both go back to where they began
    const labelled = async (label) => (await list.findAll({ type: 'Button' })).find(one => one.props.label === label)?.key ?? '';
    await list.press({ key: await labelled('Release it') });
    // (once the other has stood still for a moment: a press on a card that just moved is held back)
    await clock.advance(2000);
    await list.press({ key: await labelled('Yes') });
    await clock.advance(1000);
    expect(await until(async () => ((await order())[0] === 'Piece 5' ? true : undefined))).toBe(true);
    expect(await order()).toEqual(['Piece 5', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 4']);
});
// 15 Nov: Allow was pressed and the amber block with its buttons stayed up to a second, until the gate's wait (a one-second
// sleep the engine ran) read the press. Now the block goes in the press's own drawing, and the press itself ends the wait
test("a press on a gate takes its block away in the press's own drawing and leaves one grey line of what was pressed, with no buttons left and nothing green; the held call then ends with no second let pass", async ($, on) => {
    const counted = countingSleeps(on);
    const w = await gated($, counted.on);
    w.files.set('git:top', '/repo/wt');
    w.files.set('git:branch', 'fix-it');
    for (const [id, command, button, question, said, ends] of [
        ['p1', `${ADMIN} here 'chmod 644 /etc/hosts'`, '0-once', 'Run this as admin on this Mac?', ALLOWED_LINE, 'ran'],
        ['p2', `${ADMIN} here 'chmod 600 /etc/hosts'`, '0-always', 'Run this as admin on this Mac?', '✓ You pressed “Always allow this command”', 'ran'],
        ['p3', `${ADMIN} here 'chmod 755 /etc/hosts'`, '0-deny', 'Run this as admin on this Mac?', REFUSED_LINE, 'refused'],
        ['p4', 'hold xp4; /plug/claudopus/bin/release', 'r0-once', 'Release fix-it to main?', ALLOWED_LINE, 'held'],
        ['p5', 'hold xp5; /plug/claudopus/bin/release', 'r0-deny', 'Release fix-it to main?', REFUSED_LINE, 'refused'],
    ]) {
        const before = counted.seen.sleeps;
        const call = w.bash(id, command);
        const base = `gate-${id}-${button}`;
        expect(await until(async () => keyed(w.list, base))).toBeDefined();
        expect(await w.list.find({ type: 'Text', text: question })).toBeDefined();
        // Pressed: the very next look at the panel has the line, with nothing left to press and nothing that still asks
        await pressed(w.list, base);
        expect((await w.list.find({ type: 'Text', text: said }))?.props.dimColor).toBe(true);
        expect((await w.list.findAll({ type: 'Button' })).some(b => (b.key ?? '').startsWith(`gate-${id}-`))).toBe(false);
        expect(await w.list.find({ type: 'Text', text: question })).toBeUndefined();
        expect(await w.list.find({ type: 'Text', text: 'Permission' })).toBeUndefined();
        expect(await gateGreens(w.list)).toBe(0);
        if (ends === 'held')
            (await until(async () => w.holding.get(`x${id}; /plug/claudopus/bin/release`)))?.('released');
        const r = (await call);
        if (ends === 'refused')
            expect(r.deny).toContain('Refused by Sam');
        else
            expect(r.deny).toBeUndefined();
        // One wait was in flight while it was held, and the press started no other
        expect(counted.seen.sleeps - before).toBe(1);
        // The one line of the card is of the last press alone
        expect((await gateTexts(w.list)).filter(one => one.startsWith('✓ '))).toEqual([said]);
    }
    w.wake();
});
test('two presses on a gate send one answer: the first, as drawn', async ($, on) => {
    const { list, bash, held, wake, admins } = await gated($, on);
    const call = bash('d1', `${ADMIN} here 'chmod 644 /etc/hosts'`);
    expect(await held('d1')).toBeDefined();
    // Both keys as the panel last drew them, pressed one after the other, as a double click on a drawing a moment old does
    const once = (await keyed(list, 'gate-d1-0-once'))?.key ?? '';
    const deny = (await keyed(list, 'gate-d1-0-deny'))?.key ?? '';
    await list.press({ key: once });
    expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeDefined();
    await list.press({ key: deny }).catch(() => undefined);
    // The second press changed nothing: the card still says what the first one did
    expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeDefined();
    await list.press({ key: once }).catch(() => undefined);
    const r = (await call);
    expect(r.deny).toBeUndefined();
    expect(admins.length).toBe(1);
    expect((await gateTexts(list)).filter(one => one.startsWith('✓ '))).toEqual([ALLOWED_LINE]);
    wake();
});
test('a gate allowed but not let through says so in its grey line, never a bare "Allow"', async ($, on) => {
    const w = await gated($, on);
    w.files.set('git:top', '/repo/wt');
    w.files.set('git:branch', 'fix-it');
    // The seal for the grant cannot be made, as a keychain that refuses: nothing runs
    for (const [id, command, button, said] of [
        ['f1', `${ADMIN} here 'chmod 644 /etc/hosts'`, 'gate-f1-0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so it didn't run"],
        ['f2', '/plug/claudopus/bin/release', 'gate-f2-r0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so nothing was released"],
    ]) {
        w.files.delete('keychain:refused');
        const call = w.bash(id, command);
        expect(await until(async () => keyed(w.list, button))).toBeDefined();
        w.files.set('keychain:refused', '1');
        await w.press(button);
        const r = (await call);
        expect(r.deny).toContain('could not secure what was allowed');
        expect(w.grants()).toEqual([]);
        expect(w.admins).toEqual([]);
        expect((await until(async () => w.list.find({ type: 'Text', text: said })))?.props.dimColor).toBe(true);
        // (the line whole: nothing on the card says only that it was allowed)
        expect((await gateTexts(w.list)).filter(one => one.startsWith('✓ '))).toEqual([said]);
        expect(await gateGreens(w.list)).toBe(0);
    }
});
