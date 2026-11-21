"use strict";
// A Stop the person presses holds: the task stays stopped, grey, with its helpers and commands; the chat is told it was theirs, and
// nothing starts the task again but their word or their press on Start again
// The case of 15 Nov: a message sent by mistake started work, the person pressed Stop on its card, the engine's notice said it was
// "stopped by Claude", and the chat sent it a message that started it again, twice
test('a task the person stopped on its card stays stopped, grey, its helpers and commands stopped with it: the chat, a message, an answer and the mod start it again by no way, and only their word or their press on Start again does', SLOW, async ($, on) => {
    const { stopped, resumed, sent, submitted, clock, files } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'The bar above the input box just disappeared completely now.', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Bar above the input box disappeared', prompt: 'Their words: "The bar above the input box just disappeared completely now."' });
    // A helper of its own at work, and a command each of them runs in the background
    await $.agent.spawn({ ...spawn, description: 'Read the bar code', prompt: 'read', parentAgentId: 'a1' });
    await $.tool.call({ tool: 'Bash', tool_use_id: 'c1', agentId: 'a1', command: 'npm run build', description: 'Build the app', run_in_background: true });
    await $.tool.call({ tool: 'Bash', tool_use_id: 'c2', agentId: 'a2', command: 'npm test', description: 'Run the tests', run_in_background: true });
    let pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
    await pane.press({ key: 'stop-a1' });
    // The task, its helper and the commands of both are stopped
    expect([...stopped].sort()).toEqual(['a1', 'a2', 'bg-c1', 'bg-c2']);
    // The engine's notice of the stop: the chat is told it was the person's
    const notice = '<task-notification>\n<task-id>a1</task-id>\n<status>killed</status>\n<summary>Agent "Bar above the input box disappeared" was stopped by Claude</summary>\n</task-notification>';
    const told = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } }));
    expect((told.context ?? []).join('\n')).toContain('The person stopped this, not you: do not restart it, message it or start the same task again unless the person asks');
    // The chat sends it a message: refused
    const message = await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Carry on from where you stood.' });
    expect(String(message.deny)).toContain('the person stopped');
    expect(sent).toHaveLength(0);
    // It starts the same work afresh under another title, with the same words: refused
    const again = await $.tool.call({ tool: 'Agent', tool_use_id: 'm2', subagent_type: 'general-purpose', model: 'opus', description: 'Find why the prompt bar vanished', prompt: 'Their words: "The bar above the input box just disappeared completely now."' });
    expect(String(again.deny)).toContain('the person stopped');
    // or the engine is asked to resume it, by any way round: refused
    const resume = (await $.agent.spawn({ ...spawn, resume: { agentId: 'a1' }, prompt: 'go on' }));
    expect(String(resume.deny)).toContain('the person stopped');
    const fresh = (await $.agent.spawn({ ...spawn, description: 'Bar above the input box disappeared', prompt: 'again' }));
    expect(String(fresh.deny)).toContain('the person stopped');
    expect(resumed.filter(line => line.startsWith('a1: '))).toHaveLength(0);
    // Its card says Stopped, in grey, with no row of a command left under it, and a way to start it again
    const line = async () => pane.find({ type: 'Text', text: 'Stopped' });
    expect([(await line())?.props.color, (await line())?.props.dimColor]).toEqual([undefined, true]);
    expect(await pane.find({ type: 'Text', text: /Build the app|Run the tests|Building the app|Running the tests/ })).toBeUndefined();
    expect(await keyed(pane, 'again-small-a1')).toBeDefined();
    // and stays so: twenty minutes on it is still stopped, as the other chats read it too, nothing is at work, and nothing of
    // Claudopus has started it or its helper, written to the chat about it or stopped anything more
    await pane.unmount();
    await clock.advance(20 * 60000);
    pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
    const mine = JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}');
    expect([mine.cards, mine.ended?.map(one => [one.id, one.status]), mine.helpers?.map(one => [one.id, one.status])]).toEqual([[], [['a1', 'stopped']], [['a2', 'stopped']]]);
    expect(await pane.find({ type: 'Text', text: 'Nothing waits for you' })).toBeDefined();
    expect([resumed, submitted.filter(one => !one.startsWith('<task-notification>')), sent, stopped.length]).toEqual([[], [], [], 4]);
    // Other work is not held
    const other = await $.tool.call({ tool: 'Agent', tool_use_id: 'm3', subagent_type: 'general-purpose', model: 'opus', description: 'Check the ears', prompt: 'check the ears' });
    expect(other.deny).toBeUndefined();
    // A new message of theirs lifts the hold, and reminds the chat it was stopped
    const next = (await $.prompt.submit({ text: 'Carry on with the bar work.', wait: false, origin: composer }));
    expect((next.context ?? []).join('\n')).toContain('only if this message asks for that');
    const asked = await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm4', to: 'a1', message: 'Carry on with the bar work.' });
    expect(asked.deny).toBeUndefined();
    // Stopped again, it is held again; their press on Start again asks the chat in their name to send it a message
    await $.agent.spawn({ ...spawn, resume: { agentId: 'a1' }, prompt: 'Carry on with the bar work.' });
    expect(await until(async () => pane.find({ key: 'stop-a1' }))).toBeDefined();
    await pane.press({ key: 'stop-a1' });
    expect(String((await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a1', message: 'And once more.' })).deny)).toContain('the person stopped');
    await pressed(pane, 'again-small-a1');
    expect(await until(async () => submitted.find(one => one.includes('pressed "Start again" on "Bar above the input box disappeared" (a1), which they had stopped') && one.includes('SendMessage')))).toBeDefined();
    await pane.unmount();
});
test('a stop that was not the person\'s, by the chat or the engine, is not held', async ($, on) => {
    const { agents } = { agents: {} };
    world(on, { agents });
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix the nose' });
    await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' });
    const notice = '<task-notification><task-id>a1</task-id><status>killed</status></task-notification>';
    const told = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } }));
    expect((told.context ?? []).join('\n')).not.toContain('stopped this');
    const message = await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'go on' });
    expect(message.deny).toBeUndefined();
});
test('a helper the person stopped stays stopped: the work above it is told, and may not start it again', async ($, on) => {
    const { appended } = world(on);
    await $.session.start(start);
    await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, prompt: 'fix the nose' });
    await $.agent.spawn({ ...spawn, description: 'Measure the nostrils', prompt: 'measure', parentAgentId: 'a1' });
    // Its Stop is in its own Details, as the person presses it there
    const pane = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' });
    await pane.press({ key: 'stop-a2' });
    expect(appended.some(line => line.includes('stopped "Measure the nostrils"') && line.includes('do not restart it'))).toBe(true);
    const held = (await $.agent.spawn({ ...spawn, description: 'Measure the nostrils', prompt: 'measure again', parentAgentId: 'a1' }));
    expect(String(held.deny)).toContain('the person stopped');
    const message = await $.tool.call({ tool: 'SendMessage', tool_use_id: 'h1', agentId: 'a1', to: 'a2', message: 'go on' });
    expect(String(message.deny)).toContain('the person stopped');
    // The work above it goes on: it is not held
    const own = await $.tool.call({ tool: 'SendMessage', tool_use_id: 'h2', to: 'a1', message: 'how is it going?' });
    expect(own.deny).toBeUndefined();
});
test('a stop holds while the chat\'s turn for that message is still open, by name, for its helpers, and lets other work by alike titles go', async ($, on) => {
    const { sent } = world(on);
    await $.session.start(start);
    const BAR = 'The bar above the input box just disappeared completely now.';
    await $.prompt.submit({ text: BAR, wait: false, origin: composer });
    await $.agent.spawn({ ...spawn, description: 'Bar above the input box disappeared', prompt: `Their words: "${BAR}"` });
    await $.agent.spawn({ ...spawn, description: 'Read the bar code', prompt: 'read', parentAgentId: 'a1' });
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' });
    await pane.press({ key: 'stop-a1' });
    // Their own words passed on in the same turn are no way round it
    expect(String((await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: BAR })).deny)).toContain('the person stopped');
    // nor its name instead of its id
    expect(String((await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm2', to: 'Bar above the input box disappeared', message: 'carry on' })).deny)).toContain('the person stopped');
    // nor its helper, by a message or a resume
    expect(String((await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm3', to: 'a2', message: 'go on' })).deny)).toContain('the person stopped');
    expect(String((await $.agent.spawn({ ...spawn, description: '', resume: { agentId: 'a2' }, prompt: 'go on' })).deny)).toContain('the person stopped');
    expect(sent).toHaveLength(0);
    // Other work whose title shares most of its words is not held
    expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'm4', subagent_type: 'general-purpose', model: 'opus', description: 'Move the input box above the bar', prompt: 'move it' })).deny).toBeUndefined();
    // Once their message lifts it and the work goes on, a later stop by the chat is not theirs
    await $.prompt.submit({ text: 'Go on with the bar.', wait: false, origin: composer });
    await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a1', message: 'Go on with the bar.' });
    await $.agent.spawn({ ...spawn, resume: { agentId: 'a1' }, prompt: 'Go on with the bar.' });
    await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' });
    const notice = '<task-notification><task-id>a1</task-id><status>killed</status></task-notification>';
    const told = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } }));
    expect((told.context ?? []).join('\n')).not.toContain('stopped this');
    // Its card is stopped all the same, grey, but with no Start again: that is for a stop of the person's own
    expect((await until(async () => pane.find({ type: 'Text', text: 'Stopped' })))?.props.dimColor).toBe(true);
    expect(await keyed(pane, 'again-small-a1')).toBeUndefined();
    await pane.unmount();
});
