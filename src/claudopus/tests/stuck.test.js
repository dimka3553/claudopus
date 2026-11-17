"use strict";
// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text
test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', SLOW, async ($, on) => {
    // The engine runs all three, each in its call: they are only flagged, never started again
    const { keep, settle, clock, held, logged, resumed } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'One merger for all pushes', prompt: 'one merger' });
    await $.agent.spawn({ ...spawn, description: 'Trial work ONE releasing', prompt: 'one', parentAgentId: 'a1', resume: { agentId: 'h1' } });
    await $.agent.spawn({ ...spawn, description: 'Trial work TWO releasing', prompt: 'two', parentAgentId: 'a1', resume: { agentId: 'h2' } });
    const bash = (agentId, command, id) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command });
    const look = async (fn) => {
        const pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
        const r = await fn(pane);
        await pane.unmount();
        return r;
    };
    const stuck = () => look(pane => pane.find({ type: 'Text', text: /^No progress for / }));
    // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
    await bash('a1', 'git log', 'p1');
    await bash('h1', 'git status', 'b1');
    await bash('h2', 'git status', 'b2');
    await clock.advance(11 * 60_000);
    expect(await stuck()).toBeUndefined();
    await clock.advance(2 * 60_000);
    expect((await stuck())?.props.color).toBe('#E5A50A');
    expect((await stuck())?.text).toMatch(/^No progress for 1[23] min\.$/);
    expect(logged.filter(line => line.includes(`"One merger for all pushes" hasn't made progress`))).toHaveLength(1);
    // Looked at again, nothing more is said
    await clock.advance(60_000);
    expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(1);
    // Something new comes back: the flag goes at the next look
    void keep(bash('h1', 'hold release', 'b3'));
    const letRelease = await until(async () => held.get('release'));
    letRelease?.('released Thing 0.1.1');
    expect(await stuck()).toBeDefined();
    await clock.advance(25_000);
    expect(await stuck()).toBeUndefined();
    // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
    void keep(bash('h1', 'hold poll', 'b4'));
    const letPoll = await until(async () => held.get('poll'));
    letPoll?.('released Thing 0.1.7');
    await clock.advance(13 * 60_000);
    expect(await stuck()).toBeDefined();
    expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(2);
    expect(resumed.filter(line => line.includes('stopped partway through'))).toEqual([]);
    await settle();
});
test('stuck work the engine no longer runs had stopped partway through: the mod starts it again at once and tells the chat; work that waits on a helper the engine runs is only flagged', SLOW, async ($, on) => {
    const agents = { a1: 'idle', a2: 'idle', a3: 'running' };
    const kinds = { a1: 'general-purpose', a2: 'general-purpose', a3: 'general-purpose' };
    const { settle, clock, logged, resumed } = world(on, { agents, kinds, parents: { a3: 'a2' } });
    await $.session.start(start);
    await $.agent.spawn({ ...spawn, description: 'Fit the video', prompt: 'fit' });
    await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' });
    await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a2' });
    for (const id of ['a1', 'a2', 'a3'])
        await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' });
    await clock.advance(13 * 60_000);
    expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1);
    expect(logged.filter(line => line.includes('"Fit the video" had stopped partway through') && line.includes('restarted it'))).toHaveLength(1);
    expect(logged.filter(line => line.includes(`"Fit the video" hasn't made progress`))).toEqual([]);
    expect(logged.filter(line => line.includes(`"Draw the lids" hasn't made progress`))).toHaveLength(1);
    // Stuck again, it is not started a second time: the chat is only told
    await $.tool.call({ tool: 'Bash', tool_use_id: 's-a1-again', agentId: 'a1', command: 'git status' });
    await clock.advance(13 * 60_000);
    expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1);
    expect(resumed.every(line => !line.includes('stopped partway through') || line.startsWith('a1: From Claudopus, not'))).toBe(true);
    await settle();
});
test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', SLOW, async ($, on) => {
    const { keep, settle, clock, held } = world(on);
    await $.session.start(start);
    await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' });
    await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } });
    void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' }));
    const rows = async () => {
        const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' });
        // The command a helper waits on is a row under it, in its own words, after the word that says it is a command
        // (its name a button, as a press opens its output)
        const r = [...(await pane.findAll({ type: 'Text' })).map(one => one.text), ...(await pane.findAll({ type: 'Button' })).map(one => String(one.props.label))].filter(text => /^(Command · hold search|.* running · .*)$/.test(text));
        await pane.unmount();
        return r;
    };
    // (a row from ten seconds on: it was two minutes, and commands ran with nothing shown)
    await clock.advance(5_000);
    expect(await rows()).toEqual([]);
    await clock.advance(70_000);
    expect(await rows()).toEqual(['Command · hold search']);
    const letSearch = await until(async () => held.get('search'));
    letSearch?.('found it');
    await clock.advance(1_000);
    expect(await rows()).toEqual([]);
    await settle();
});
test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', SLOW, async ($, on) => {
    const agents = {};
    const kinds = { a2: 'general-purpose' };
    const { keep, settle, clock, logged, held } = world(on, { agents, kinds });
    await $.session.start(start);
    await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' });
    // Its first run, moving all along, takes longer than the stuck check waits; then it rests
    for (const part of ['left ear', 'right ear', 'lobes']) {
        await clock.advance(5 * 60_000);
        void keep($.tool.call({ tool: 'Bash', tool_use_id: `e-${part}`, agentId: 'a1', command: `hold ${part}` }));
        const letGo = await until(async () => held.get(part));
        letGo?.(`drew the ${part}`);
    }
    await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' });
    await clock.advance(30 * 60_000);
    await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } });
    await clock.advance(25_000);
    const look = async () => {
        const pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
        const r = await pane.find({ type: 'Text', text: /^No progress for / });
        await pane.unmount();
        return r;
    };
    expect(await look()).toBeUndefined();
    await $.turn.complete({ answer: 'Bigger now.', durationMs: 1, isAborted: false, turnId: 't1b', reason: 'answer', agentId: 'a1' });
    // Held on a watch it started after a report as long as one: its card goes on, but it is not stuck
    agents.a2 = 'waiting';
    await $.agent.spawn({ ...spawn, description: 'Watch the build', prompt: 'watch' });
    await $.turn.complete({ answer: `The build is watched. ${'Every check passes and it is pushed. '.repeat(15)}`, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' });
    await clock.advance(13 * 60_000);
    expect(await look()).toBeUndefined();
    expect(logged.filter(line => line.includes("hasn't made progress"))).toEqual([]);
    await settle();
});
test('work asking the person something waits on them and is never flagged', SLOW, async ($, on) => {
    const { clock, logged } = world(on);
    await $.session.start(start);
    await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' });
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] });
    await clock.advance(30 * 60_000);
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
    expect(await pane.find({ type: 'Text', text: /^No progress for / })).toBeUndefined();
    expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(0);
    await pane.unmount();
});
test('the log is added to, never rewritten whole, and the empty bytes earlier versions left in it are taken out', async ($, on) => {
    const { files } = world(on);
    files.set(`${MEMORY}/log.md`, `2026-01-01T00:00:00.000Z start one\u0000\u0000\u00002026-01-01T00:00:01.000Z start two\n`);
    await $.session.start(start);
    const text = files.get(`${MEMORY}/log.md`) ?? '';
    expect(text).not.toContain('\u0000');
    expect(text.startsWith('2026-01-01T00:00:00.000Z start one2026-01-01T00:00:01.000Z start two\n')).toBe(true);
    expect(text).toMatch(/Z start engine-id in \/repo\n$/);
});
