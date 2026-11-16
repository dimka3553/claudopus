"use strict";
// Work that runs its helpers beside it: a helper runs in the background, the work waits for it only when it has nothing else, is
// held back from ending while one runs, is told at the step when it could have sent calls together, and is told of a quiet helper
// One step of an agent as the engine reports it after its calls ended
const batch = ($, agent, calls) => $.classic.PostToolBatch({
    hook_event_name: 'PostToolBatch',
    agent_id: agent,
    tool_calls: calls.map((one, n) => ({ tool_name: one.tool, tool_input: one.input ?? {}, tool_use_id: one.id ?? `${agent}-${one.tool}-${n}` })),
});
const toldOf = async (r) => ((await r).additionalContext ?? []).join('\n');
test("a helper a piece of work starts runs in the background, while the chat's own work is started as it asked", async ($, on) => {
    const { backgrounds } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, background: false, prompt: 'fix it' });
    await $.agent.spawn({ ...spawn, background: false, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' });
    await $.agent.spawn({ ...spawn, background: false, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a2' });
    expect(backgrounds).toEqual([false, true, true]);
});
test('a step is told when it started a helper alone, held only to-dos, or made a commit with no second look started; one that sends calls together is told nothing', async ($, on) => {
    world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix it' });
    expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }]))).toContain('started one helper and nothing else');
    // Sent with other calls, a helper is no line
    expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read' } }, { tool: 'Agent', input: { description: 'Draw' } }, { tool: 'mcp__claudopus__note' }]))).toBe('');
    expect(await toldOf(batch($, 'a1', [{ tool: 'mcp__claudopus__todo' }, { tool: 'mcp__claudopus__note' }]))).toContain('only to-do and note calls');
    expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Nose"' } }]))).toContain('start them now');
    // Each kind of line is said at most twice to one agent
    await batch($, 'a1', [{ tool: 'Agent', input: { description: 'One more' } }]);
    expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'And another' } }]))).toBe('');
    // A commit after a second look was started says nothing of it
    await $.agent.spawn({ ...spawn, prompt: 'fix the ears' });
    await batch($, 'a2', [{ tool: 'Agent', input: { description: 'Second look at the ears' } }, { tool: 'Read', input: { file_path: '/repo/a' } }]);
    expect(await toldOf(batch($, 'a2', [{ tool: 'Bash', input: { command: 'git -C /repo commit -m "Ears"' } }]))).toBe('');
    // The chat's own thread is never told
    expect(await toldOf(batch($, undefined, [{ tool: 'Agent' }]))).toBe('');
});
test('three single lookups in a row are told to go together or to a helper; two long runs of one kind in a row, to run side by side', SLOW, async ($, on) => {
    const { clock, held } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix it' });
    expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }]))).toBe('');
    expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'rg nose /repo' } }]))).toBe('');
    expect(await toldOf(batch($, 'a1', [{ tool: 'Grep', input: { pattern: 'ear' } }]))).toContain('The last 3 steps each held one lookup');
    // A step of two lookups breaks the run
    await batch($, 'a1', [{ tool: 'Read' }, { tool: 'Read' }]);
    expect(await toldOf(batch($, 'a1', [{ tool: 'Read' }]))).toBe('');
    // A long test run, then another of its kind, each alone in its step
    const run = async (id, command) => {
        const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold ${id}` });
        await clock.advance(90_000);
        held.get(id)?.('ok');
        await call;
        return toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command }, id }]));
    };
    expect(await run('t1', 'npm test -- nose')).toBe('');
    expect(await run('t2', 'npm test -- ears')).toContain('Two long commands of one kind (npm test)');
});
test("work never waits for its helpers: it is told it may end its step, it is let go when it does, and a helper's result that the engine hands the chat is passed on to it, which starts it again; a report handed back while helpers run is still held", async ($, on) => {
    const agents = {};
    const { stopped, resumed, appended, clock } = world(on, { agents });
    on('classic.SubagentStop', () => ({}));
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix it' });
    await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' });
    await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' });
    agents.a1 = 'running';
    agents.a2 = 'running';
    agents.a3 = 'running';
    // Told once, as it starts them, that their results come even after its step ends, and never to wait for them
    const told = await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]));
    expect(told).toContain('each result comes to you as a message when it ends, even after you end your step');
    expect(told).not.toMatch(/bin\/helpers/);
    expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))).toBe('');
    // It ends its step while both work: let go, not held
    const stop = () => $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] });
    expect((await stop()).block).toBeUndefined();
    // Its report would leave their results to the chat: held, with no command to wait with
    const handback = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' }));
    expect(handback.deny).toContain("Don't hand back your report yet");
    expect(handback.deny).not.toMatch(/bin\/helpers|Bash command/);
    // While it is at a step of its own the engine hands it the result itself: nothing is passed on
    agents.a2 = 'completed';
    await $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' });
    expect(resumed.filter(one => one.startsWith('a1:'))).toEqual([]);
    // Its step ended, the engine lists it as done; the second helper's result is passed on and starts it again, and the chat is told
    agents.a1 = 'completed';
    await $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' });
    // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
    await clock.advance(25_000);
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' });
    const texts = (await list.findAll({ type: 'Text' })).map(one => one.text);
    await list.unmount();
    expect(texts).toContain('Working on 1 thing');
    expect(texts).toContain('Fix the nose');
    agents.a3 = 'completed';
    await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.' });
    await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' });
    expect(await until(async () => resumed.find(one => one.startsWith('a1: From Claudopus: your helper "Draw the nose" has finished') && one.endsWith('The nose is drawn at every size.')))).toBeDefined();
    expect(await until(async () => appended.find(one => /^undefined: From Claudopus: the result of the helper "Draw the nose" reached this chat because the task ".*" had ended its step/.test(one)))).toBeDefined();
    // Stopped from its card or by the chat, the work's running helpers are stopped with it
    await $.agent.spawn({ ...spawn, description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a1' });
    await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' });
    expect(stopped).toEqual(expect.arrayContaining(['a1', 'a4']));
});
test("what nothing of the work's own makes, a file, a line in it, a page or a time, Claudopus looks for when asked and starts the work again once it is there, or once the longest look runs out, though the engine lists it as ended; the card says so in place of a command that would wait; a helper hands back instead", SLOW, async ($, on) => {
    const agents = {};
    const { clock, files, resumed } = world(on, { agents });
    await $.session.start(start);
    await $.prompt.submit({ text: 'wait for the deploy', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Check the deploy', prompt: 'check' });
    await $.agent.spawn({ ...spawn, description: 'Read the build log', prompt: 'read', parentAgentId: 'a1' });
    agents.a1 = 'completed';
    agents.a2 = 'running';
    const r = (await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w1', agentId: 'a1', what: 'the deploy marker', file: '/w/deployed.flag' }));
    expect(r.result).toContain('End your step now');
    const lines = async () => {
        const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' });
        const texts = (await list.findAll({ type: 'Text' })).map(one => one.text);
        await list.unmount();
        return texts;
    };
    expect(await until(async () => (await lines()).find(text => text === 'Claudopus starts Claude again when this is there: the deploy marker'))).toBeDefined();
    // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
    expect((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w2', agentId: 'a2', what: 'the build to finish', file: '/w/build.log', text: 'BUILD DONE' })).result).toContain('hand back your result now');
    await clock.advance(40_000);
    expect(resumed.filter(one => /^a[12]: /.test(one))).toEqual([]);
    // There: the work its step had ended, which the engine lists as ended, is started again
    files.set('/w/deployed.flag', '');
    await clock.advance(40_000);
    expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: what you asked to be started again for is there: the deploy marker. Carry on from it.'))).toBeDefined();
    expect(await until(async () => !(await lines()).some(text => text.startsWith('Claudopus starts Claude again')) || undefined)).toBe(true);
    // A time only, and a file that never comes: started when the time comes, or told it never came
    agents.a1 = 'completed';
    await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3', agentId: 'a1', what: 'a look at the queue again', minutes: 2 });
    await clock.advance(60_000);
    expect(resumed.filter(one => one.includes('a look at the queue again'))).toEqual([]);
    await clock.advance(100_000);
    expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: the time you asked for has come: a look at the queue again. Carry on.'))).toBeDefined();
    await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4', agentId: 'a1', what: 'the results file', file: '/w/never.json', minutes: 1 });
    await clock.advance(100_000);
    expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: the results file was still not there after 1 min of looking. Find out why before you look again.'))).toBeDefined();
    // Nothing to look for is said back, and the chat has no card to be started from
    expect((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w5', agentId: 'a1', what: 'something' })).result).toContain('Name a file, a page, or the minutes');
    expect((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w6', what: 'x', minutes: 1 })).result).toContain('Only a background task');
});
test('a helper quiet for five minutes is named to its work once, and the card says so only then: a helper at work is a row of its own', SLOW, async ($, on) => {
    const { clock, appended } = world(on);
    await $.session.start(start);
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix it' });
    await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' });
    await clock.advance(70_000);
    expect(await pane.find({ type: 'Text', text: /looked in on|helper running/ })).toBeUndefined();
    await clock.advance(5 * 60_000);
    expect(appended.filter(line => line.startsWith('a1: Your helper "Read the nose code" (a2) has shown nothing new'))).toHaveLength(1);
    expect((await pane.find({ type: 'Text', text: /^1 helper quiet for 5\+ min, Claudopus told Claude$/ }))?.text).toBeDefined();
    await clock.advance(3 * 60_000);
    expect(appended.filter(line => line.includes('has shown nothing new'))).toHaveLength(1);
});
test('work whose context was compacted is handed its rules again at its next step, once; work started before the rules changed is handed the new ones', async ($, on) => {
    const { files } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'draw the eyes', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'draw them' });
    // Started with the rules: nothing more at its steps
    expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))).not.toContain('These are the rules now');
    await $.session.compact({ trigger: 'auto', agentId: 'a1', messages: [{ role: 'user', text: 'one', toolUses: [] }] });
    const told = await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]));
    expect(told).toContain('Your context was compacted');
    expect(told).toContain('What follows is what Claudopus tells Claude in every task');
    expect(told).toContain('Keep the card up to date as you work');
    expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))).not.toContain('These are the rules now');
    // The rules change under it, saved in Config: the new text reaches it
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' });
    await pressed(config, 'config-text-work-edit');
    await config.input({ key: 'config-text-work-input', text: '- Every run says how far it is.' });
    expect(files.get(`${MEMORY}/roles/work.md`)).toBe('- Every run says how far it is.\n');
    await config.unmount();
    const changed = await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]));
    expect(changed).toContain('have changed since you started');
    expect(changed).toContain('Every run says how far it is.');
});
