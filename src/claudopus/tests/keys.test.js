"use strict";
// The keys remembered: names and stores only, made again from the stores, read by work in keys.md, and an ask for a kept key refused;
// and how a password or a key a command waits for is asked and given
// Made-up keys, as a person would have given them, in each store
const keysLaid = (files) => {
    files.set('secret:ELEVENLABS_API_KEY', 'el-made-up-value-0001');
    files.set('secret:KAGGLE_KEY', 'kg-made-up-value-0002');
    files.set('keychain-entry:elevenlabs-api\tsam', '');
    // An app's own storage is not a key someone gave
    files.set('keychain-entry:Chrome Safe Storage\tChrome', '');
    // An account named by what is in fact a kept value, as a slip could leave it: hidden in the list like any other
    files.set('keychain-entry:other-api\tkg-made-up-value-0002', '');
    files.set(`${MEMORY}/index.md`, '# Streams\n\nname | repo | session | state | summary\n\n- Render | /repo/render |  | going | Renders\n');
    files.set('/repo/render/.env.local', 'export OPENAI_API_KEY=env-made-up-value-0003\nVOICE_ID=abc\nDB_PASSWORD = env-made-up-value-0004\nNEXT_PUBLIC_STRIPE_KEY=pk_made_up\n');
    files.set('/repo/render/.env.example', 'EXAMPLE_TOKEN=x\n');
    files.set('sbos:secrets', JSON.stringify([
        { name: 'elevenlabs-key', label: 'ElevenLabs API key', put_in: false, value: 'sbos-made-up-value-0005' },
        { name: 'github-token', label: 'GitHub read-only token', put_in: true, secret: 'sbos-made-up-value-0006' },
        { name: 'labs', label: "Labs' production database", database: true, put_in: true },
        // labels that carry a kept value, as a slip could leave them: one with a | in it, one long enough to be cut
        { name: 'odd-one', label: `pipe ${'pp|made-up-value-0009'} and ${'x'.repeat(70)} long-made-up-value-0010`, put_in: false },
    ]));
    files.set('secret:PIPE_KEY', 'pp|made-up-value-0009');
    files.set('secret:LONG_KEY', 'long-made-up-value-0010');
};
const VALUES = ['el-made-up-value-0001', 'kg-made-up-value-0002', 'env-made-up-value-0003', 'env-made-up-value-0004', 'sbos-made-up-value-0005', 'sbos-made-up-value-0006', 'made-up-value-0009', 'long-made-up', 'pk_made_up'];
test('the list of keys holds every store\'s names and never a value', async ($, on) => {
    const { files, logged } = world(on);
    keysLaid(files);
    await $.session.start(start);
    // SBOS's list, as a piece of work reads it, is taken in
    await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' });
    const shown = files.get(`${MEMORY}/keys.md`) ?? '';
    for (const name of ['ELEVENLABS_API_KEY', 'KAGGLE_KEY', "Claudopus's keychain", '| elevenlabs-api |', 'OPENAI_API_KEY', 'DB_PASSWORD', '/repo/render/.env.local', 'elevenlabs-key', 'asked, not given', 'github-token', 'SBOS secrets'])
        expect(shown).toContain(name);
    // Not a key: an app's own storage, a variable that holds none, and an example file
    for (const name of ['Chrome', 'VOICE_ID', 'EXAMPLE_TOKEN', 'NEXT_PUBLIC_STRIPE_KEY'])
        expect(shown).not.toContain(name);
    // Another app's account that is not a name stays out of the list
    expect(shown).not.toContain('/ sam');
    // A database in SBOS is used through its query
    expect(shown).toMatch(/\| labs \|[^\n]*`query`/);
    // No value anywhere: the list, its state, the log, what the work was told
    const everything = [...files].filter(([key]) => key.startsWith(MEMORY)).map(([key, text]) => `${key}\n${text}`).join('\n') + logged.join('\n');
    for (const value of VALUES)
        expect(everything).not.toContain(value);
    // A kept value in a label is hidden before the label is cut
    expect(files.get(`${MEMORY}/keys.md`)).toContain('pipe [hidden PIPE_KEY] and');
});
test('a key taken out of a store goes from the list, and nothing is written when the list cannot be checked for kept values', async ($, on) => {
    const { files } = world(on);
    keysLaid(files);
    await $.session.start(start);
    await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY here true' });
    expect(files.get(`${MEMORY}/keys.md`)).toContain('KAGGLE_KEY');
    files.delete('secret:KAGGLE_KEY');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'b2', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY --forget' });
    expect(files.get(`${MEMORY}/keys.md`)).not.toContain('| KAGGLE_KEY |');
    expect(files.get(`${MEMORY}/keys.md`)).toContain('ELEVENLABS_API_KEY');
    // SBOS's next list drops what it no longer holds
    await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' });
    expect(files.get(`${MEMORY}/keys.md`)).toContain('github-token');
    files.set('sbos:secrets', '[]');
    await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's2', agentId: 'w1' });
    expect(files.get(`${MEMORY}/keys.md`)).not.toContain('github-token');
    // A kept value that is also a word of the list's own shape changes nothing else in it
    files.set('secret:SHORT_PIN', 'true');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'b5', agentId: 'w1', command: '/plug/bin/secret SHORT_PIN here true' });
    expect(files.get(`${MEMORY}/keys.md`)).toContain('| SHORT_PIN |');
    expect(JSON.parse(files.get(`${MEMORY}/keys.json`) ?? '{}').entries.every((one) => typeof one.isPresent === 'boolean')).toBe(true);
    files.delete('secret:SHORT_PIN');
    // A keychain that does not answer is not read as an empty one: what was known of it stays
    files.set('keyring:refused', 'yes');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'w1', command: '/plug/bin/secret ELEVENLABS_API_KEY here true' });
    expect(files.get(`${MEMORY}/keys.md`)).toContain('| ELEVENLABS_API_KEY |');
    files.delete('keyring:refused');
    // A hiding that fails leaves the list as it was
    const before = files.get(`${MEMORY}/keys.md`);
    files.set('secret:refused', 'yes');
    files.set('secret:NEW_TOKEN', 'new-made-up-value-0007');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'b3', agentId: 'w1', command: '/plug/bin/secret NEW_TOKEN here true' });
    expect(files.get(`${MEMORY}/keys.md`)).toBe(before);
});
test('an ask for a key the list has is refused with where it is; a key not kept is asked for', async ($, on) => {
    const { files } = world(on);
    keysLaid(files);
    await $.session.start(start);
    await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' });
    // SBOS asked for a key Claudopus's keychain keeps under another name: the ElevenLabs ask of 15 Nov
    const sbos = await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a1', agentId: 'w1', name: 'elevenlabs-key', label: 'ElevenLabs API key' });
    expect(sbos.deny).toContain('ELEVENLABS_API_KEY');
    expect(sbos.deny).toContain("Claudopus's keychain");
    expect(sbos.deny).toMatch(/bin\/secret ELEVENLABS_API_KEY here/);
    // one SBOS has put in already
    expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a2', agentId: 'w1', name: 'github-token', label: 'GitHub' })).deny).toContain('SBOS secrets');
    // The panel's ask for one
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a3', agentId: 'w1', text: 'Paste your ElevenLabs API key', details: 'For the transcripts.' })).deny).toContain('ELEVENLABS_API_KEY');
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a4', agentId: 'w1', text: 'Paste KAGGLE_KEY in the box' })).deny).toContain('KAGGLE_KEY');
    // The secret runner under a name it does not keep, or asked to take a kept one in again
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'a5', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_KEY here 'curl x'" })).deny).toContain('ELEVENLABS_API_KEY');
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'a6', agentId: 'w1', command: '/plug/bin/secret ELEVENLABS_API_KEY --add' })).deny).toMatch(/--forget/);
    // What is fine: the kept name used, a key not kept, an ask that is not for a key, and SBOS's own agents' keys
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_API_KEY here 'curl x'" })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f2', agentId: 'w1', name: 'stripe-customers-key', label: 'Stripe' })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f3', agentId: 'w1', text: 'Paste your Stripe key', details: 'x' })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f4', agentId: 'w1', text: 'Release the list of keys?', details: 'It lists ElevenLabs and Kaggle.', choices: ['Release it'] })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f5', agentId: 'w1', name: 'elevenlabs-key', label: 'x', agent: 'bot' })).deny).toBeUndefined();
    // An ask made leaves its name in the list as asked, not given
    expect(files.get(`${MEMORY}/keys.md`)).toMatch(/\| stripe-customers-key \|[^\n]*asked, not given/);
    // No false refusals: a name inside another word, a database of SBOS's, a key with other words in its name
    for (const text of ['Paste the Replicate API token for the FaceIQ Labs app', 'Paste the Clipify webhook secret', 'Paste your Labs login key'])
        expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `n-${text.length}`, agentId: 'w1', text })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'w1', command: "/plug/bin/secret GITHUB_PAT here 'gh x'" })).deny).toBeUndefined();
    // The most specific kept key is the one named
    files.set('secret:KAGGLE_USERNAME', 'kgu-made-up');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'n2', agentId: 'w1', command: '/plug/bin/secret KAGGLE_USERNAME here true' });
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'n3', agentId: 'w1', text: 'Type your Kaggle username for the login' })).deny).toContain('KAGGLE_USERNAME');
    // What it is about counts when the ask is to paste something; asked again on purpose, naming the kept key as it is, it is shown
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'd1', agentId: 'w1', text: 'Paste the key in the box', details: 'It is your ElevenLabs API key.' })).deny).toContain('ELEVENLABS_API_KEY');
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'd2', agentId: 'w1', text: 'Paste your ElevenLabs API key', details: 'The kept ELEVENLABS_API_KEY is refused by ElevenLabs: 401.' })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'd3', agentId: 'w1', name: 'elevenlabs-key', label: 'x', for: 'ELEVENLABS_API_KEY in the keychain answers 401' })).deny).toBeUndefined();
    // A word for a key after other words is another key; the word secret in a command that runs no runner is no ask
    files.set('secret:STRIPE_SECRET_KEY', 'st-made-up-value-0011');
    await $.tool.call({ tool: 'Bash', tool_use_id: 'n4', agentId: 'w1', command: '/plug/bin/secret STRIPE_SECRET_KEY here true' });
    for (const text of ['Paste the Stripe webhook signing secret', 'Paste the Stripe publishable key', 'Type your GitHub login email'])
        expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `s-${text.length}`, agentId: 'w1', text })).deny).toBeUndefined();
    for (const command of ['git commit -m "keep the secret STRIPE_KEY here for now"', 'kubectl get secret STRIPE_KEY default'])
        expect((await $.tool.call({ tool: 'Bash', tool_use_id: `k-${command.length}`, agentId: 'w1', command })).deny).toBeUndefined();
    expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 's1', agentId: 'w1', text: 'Paste your Stripe secret key' })).deny).toContain('STRIPE_SECRET_KEY');
    // The runner by other paths to it
    for (const command of ["cd /plug/bin && ./secret ELEVENLABS_KEY here 'x'", "/plug/bin//secret ELEVENLABS_KEY here 'x'"])
        expect((await $.tool.call({ tool: 'Bash', tool_use_id: `p-${command.length}`, agentId: 'w1', command })).deny).toContain('ELEVENLABS_API_KEY');
    // An ask in SBOS for one it holds leaves it held
    await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'h1', agentId: 'w1', name: 'github-token', label: 'GitHub', for: 'github-token answers 401' });
    expect(files.get(`${MEMORY}/keys.md`)).toMatch(/\| github-token \|[^\n]*present/);
});
test('work never writes the list of keys itself, by any tool', async ($, on) => {
    world(on);
    await $.session.start(start);
    expect((await $.tool.call({ tool: 'Write', tool_use_id: 'w1', agentId: 'w1', file_path: `${MEMORY}/keys.md`, content: 'X' })).deny).toBeDefined();
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'w1', command: 'echo x > ~/.claude/claudopus/keys.json' })).deny).toBeDefined();
});
test("a password and a key a command waits for are each one block (its label, the question in amber, its buttons); typed in the box above the chat on the desktop and in the block's one field in the terminal; given or refused, one grey line says so and the value is nowhere on screen", async ($, on) => {
    const { files, clock, keep, settle, keychain, logged } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Deploy the site', prompt: 'deploy it' });
    // One command of the task waits for a Mac's password, another for a key
    void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: "hold /plug/claudopus/bin/admin m4 'id -u'" }));
    void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-2', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret STRIPE_KEY here deploy' }));
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' });
    const bar = await $.ui.mount({ ...BAND, surface: 'desktop' });
    const PASSWORD = { kind: 'admin', host: 'm4', key: BOX_PUBLIC };
    const KEY = { kind: 'secret', name: 'STRIPE_KEY' };
    const PASSWORD_ASKS = 'The password of m4 is needed to run this as admin.';
    const KEY_ASKS = "STRIPE_KEY is needed to run this task's command.";
    let made = 0;
    const asked = async (request) => {
        const id = `${(made += 1)}a1e2d3c-4b5a-4987-a654-3210fedcba98`;
        files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, ...request, chat: 'engine-id', at: 1700000000000 }));
        await clock.advance(1000);
        return id;
    };
    const buttons = async (site, id) => (await site.findAll({ type: 'Button' })).filter(b => (b.key ?? '').startsWith(`box-${id}-`));
    const fields = async (site, id) => (await site.findAll({ type: 'Input' })).filter(one => (one.key ?? '').includes(id));
    const all = async (site) => (await site.findAll({ type: 'Text' })).map(one => String(one.text ?? ''));
    const press = async (site, id, label) => site.press({ key: (await until(async () => (await buttons(site, id)).find(b => b.props.label === label)))?.key ?? '' });
    // Gone from the panel, with one grey line of what was done in its place, and nothing green
    const gone = async (site, id, line) => {
        expect((await until(async () => site.find({ type: 'Text', text: line })))?.props.dimColor).toBe(true);
        expect(await buttons(site, id)).toEqual([]);
        expect((await all(site)).filter(one => one.startsWith('✓ '))).toEqual([line]);
        expect([...(await site.findAll({ type: 'Box' })), ...(await site.findAll({ type: 'Text' }))].some(one => ['color', 'borderColor', 'backgroundColor'].some(prop => one.props[prop] === 'success'))).toBe(false);
    };
    for (const one of [
        { request: PASSWORD, label: 'Password', asks: PASSWORD_ASKS, labels: ['Type it', "Don't allow"], open: 'Type it', head: '↳ The password of m4 for “Deploy the site”', placeholder: 'Type it here', typed: 'hunter-22', given: '✓ You gave the password', refuse: "Don't allow" },
        { request: KEY, label: 'Key', asks: KEY_ASKS, labels: ['Paste it', "Don't give it", 'Answer in words'], open: 'Paste it', head: '↳ STRIPE_KEY for “Deploy the site”', placeholder: 'Paste it here', typed: 'sk_live_made_up_0042', given: '✓ You gave STRIPE_KEY', refuse: "Don't give it" },
    ]) {
        const id = await asked(one.request);
        // The block, on its task's card: a dim label of its kind, the question in amber, then its buttons, and no field in the panel
        const question = await until(async () => list.find({ type: 'Text', text: one.asks }));
        expect([question?.props.color, question?.props.bold]).toEqual(['#E5A50A', true]);
        const drawn = await all(list);
        expect(drawn.slice(drawn.indexOf(one.label), drawn.indexOf(one.label) + 2)).toEqual([one.label, one.asks]);
        expect(drawn.indexOf('Deploy the site')).toBeLessThan(drawn.indexOf(one.label));
        expect((await list.find({ type: 'Text', text: one.label }))?.props.dimColor).toBe(true);
        expect((await buttons(list, id)).map(b => b.props.label)).toEqual(one.labels);
        expect(await list.findAll({ type: 'Input' })).toEqual([]);
        expect((await list.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => ['Cancel', 'Paste the key', 'Reply in your own words', 'Close the reply box'].includes(label))).toEqual([]);
        // Its button opens the one box above the chat, which says what it is for and where what is typed goes
        await press(list, id, one.open);
        const field = await until(async () => (await fields(bar, id))[0]);
        expect(field?.props.placeholder).toBe(one.placeholder);
        expect(await all(bar)).toEqual(expect.arrayContaining([one.head]));
        expect((await all(bar)).filter(text => /^Enter sends/.test(String(text)))).toEqual([]);
        expect((await bar.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(expect.arrayContaining(['Send', 'Close']));
        expect(await list.findAll({ type: 'Input' })).toEqual([]);
        await bar.input({ key: field?.key ?? '', text: one.typed });
        const kept = await until(async () => keychain.find(entry => entry.includes(id)));
        // A password goes only sealed to its command's key; a key as it was pasted
        if (one.request === PASSWORD)
            expect([kept?.includes(one.typed), kept?.includes(boxSealed(BOX_PUBLIC, one.typed))]).toEqual([false, true]);
        else
            expect(kept).toContain(`-w "${one.typed}"`);
        await gone(list, id, one.given);
        expect(await until(async () => ((await fields(bar, id)).length ? undefined : true))).toBe(true);
        // Refused: the request goes, so its command ends without it, and the line says the button pressed
        const refused = await asked(one.request);
        await press(list, refused, one.refuse);
        await gone(list, refused, `✓ You pressed “${one.refuse}”`);
        expect(await until(async () => (files.has(`${MEMORY}/boxes/${refused}.json`) ? undefined : true))).toBe(true);
        expect(keychain.some(entry => entry.includes(refused))).toBe(false);
    }
    // Words in place of a key go to the command that asked, never to the keychain
    const worded = await asked(KEY);
    await press(list, worded, 'Answer in words');
    const words = await until(async () => (await fields(bar, worded))[0]);
    expect(words?.props.placeholder).toBe('Type your answer');
    expect(await all(bar)).toContain('↳ Your answer in place of STRIPE_KEY');
    await bar.input({ key: words?.key ?? '', text: 'It is in the vault under Stripe' });
    expect(await until(async () => files.get(`${MEMORY}/boxes/${worded}.reply`))).toContain('in their own words: It is in the vault under Stripe');
    await gone(list, worded, '✓ You answered “It is in the vault under Stripe”');
    expect(keychain.some(entry => entry.includes(worded))).toBe(false);
    // The chat was told only what is asked and where to type it
    expect(logged).toEqual(expect.arrayContaining([`${PASSWORD_ASKS} Press Type it on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself.`]));
    for (const value of ['hunter-22', 'sk_live_made_up_0042'])
        expect([...logged, ...(await all(list)), ...(await all(bar))].some(line => line.includes(value))).toBe(false);
    await bar.unmount();
    await list.unmount();
    // In the terminal the bar draws no field: the block has the one field itself, and no button to open one
    const term = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' });
    for (const one of [
        { request: PASSWORD, label: 'Password', asks: PASSWORD_ASKS, labels: ["Don't allow"], placeholder: 'Type it here', typed: 'hunter-23', given: '✓ You gave the password' },
        { request: KEY, label: 'Key', asks: KEY_ASKS, labels: ["Don't give it", 'Answer in words'], placeholder: 'Paste it here', typed: 'sk_live_made_up_0043', given: '✓ You gave STRIPE_KEY' },
    ]) {
        const id = await asked(one.request);
        expect(await until(async () => term.find({ type: 'Text', text: one.asks }))).toBeDefined();
        expect(await term.find({ type: 'Text', text: one.label })).toBeDefined();
        expect((await buttons(term, id)).map(b => b.props.label)).toEqual(one.labels);
        const own = await fields(term, id);
        expect(own.map(field => [field.key?.startsWith(`box-${id}-field-`), field.props.placeholder])).toEqual([[true, one.placeholder]]);
        await term.input({ key: own[0]?.key ?? '', text: one.typed });
        expect(await until(async () => keychain.find(entry => entry.includes(id)))).toBeDefined();
        await gone(term, id, one.given);
        expect(await fields(term, id)).toEqual([]);
    }
    await settle();
});
