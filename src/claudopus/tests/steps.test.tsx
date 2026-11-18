// Work that runs its helpers beside it: a helper runs in the background, the work waits for it only when it has nothing else, is
// held back from ending while one runs, is told at the step when it could have sent calls together, and is told of a quiet helper

// One step of an agent as the engine reports it after its calls ended
const batch = ($: unknown, agent: string, calls: { tool: string; input?: object; id?: string }[]) =>
  ($ as unknown as { classic: { PostToolBatch: (e: object) => Promise<{ additionalContext?: string[] }> } }).classic.PostToolBatch({
    hook_event_name: 'PostToolBatch',
    agent_id: agent,
    tool_calls: calls.map((one, n) => ({ tool_name: one.tool, tool_input: one.input ?? {}, tool_use_id: one.id ?? `${agent}-${one.tool}-${n}` })),
  })
const toldOf = async (r: Promise<{ additionalContext?: string[] }>) => ((await r).additionalContext ?? []).join('\n')

test("a helper a piece of work starts runs in the background, while the chat's own work is started as it asked", async ($, on) => {
  const { backgrounds } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, background: false, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, background: false, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, background: false, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a2' } as never)
  expect(backgrounds).toEqual([false, true, true])
})

test('with no second check called for, as Claudopus starts, a commit is told nothing', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the chin', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the chin' } as never)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Chin"' } }]))).toBe('')
})

test('a step is told when it started a helper alone, held only to-dos, or, where a second check is set, made a commit with no second look started; one that sends calls together is told nothing', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ lean: { second: 'beyond' } }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }]))).toContain('started one helper and nothing else')
  // Sent with other calls, a helper is no line
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read' } }, { tool: 'Agent', input: { description: 'Draw' } }, { tool: 'mcp__claudopus__note' }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'mcp__claudopus__todo' }, { tool: 'mcp__claudopus__note' }]))).toContain('only to-do and note calls')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Nose"' } }]))).toContain('start them now')
  // Each kind of line is said at most twice to one agent
  await batch($, 'a1', [{ tool: 'Agent', input: { description: 'One more' } }])
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'And another' } }]))).toBe('')
  // A commit after a second look was started says nothing of it
  await $.agent.spawn({ ...spawn, prompt: 'fix the ears' } as never)
  await batch($, 'a2', [{ tool: 'Agent', input: { description: 'Second look at the ears' } }, { tool: 'Read', input: { file_path: '/repo/a' } }])
  expect(await toldOf(batch($, 'a2', [{ tool: 'Bash', input: { command: 'git -C /repo commit -m "Ears"' } }]))).toBe('')
  // The chat's own thread is never told
  expect(await toldOf(batch($, undefined as never, [{ tool: 'Agent' }]))).toBe('')
})

test('three single lookups in a row are told to go together or to a helper; two long runs of one kind in a row, to run side by side', SLOW, async ($, on) => {
  const { clock, held } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'rg nose /repo' } }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Grep', input: { pattern: 'ear' } }]))).toContain('The last 3 steps each held one lookup')
  // A step of two lookups breaks the run
  await batch($, 'a1', [{ tool: 'Read' }, { tool: 'Read' }])
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read' }]))).toBe('')
  // A long test run, then another of its kind, each alone in its step
  const run = async (id: string, command: string) => {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold ${id}` } as never)
    await clock.advance(90_000)
    held.get(id)?.('ok')
    await call
    return toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command }, id }]))
  }
  expect(await run('t1', 'npm test -- nose')).toBe('')
  expect(await run('t2', 'npm test -- ears')).toContain('Two long commands of one kind (npm test)')
})

test('a helper that gave its result in words and left only a server going for the person is done: its task is pressed for its report as before; one that gave words while following a run of its own is still at work', async ($, on) => {
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const { stepped } = world(on, { agents, talk })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'build the site' } as never)
  await $.agent.spawn({ ...spawn, description: 'Serve the site', prompt: 'serve', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  await $.tool.call({ tool: 'Bash', tool_use_id: 'v2', agentId: 'a2', command: 'hold serve', description: 'Serve the site on port 3000', run_in_background: true } as never)
  agents.a2 = 'waiting'
  await $.turn.complete({ answer: `The site is up on port 3000. ${'Every page loads and the forms send. '.repeat(15)}`, durationMs: 1, isAborted: false, turnId: 'e-a2', reason: 'answer', agentId: 'a2' } as never)
  agents.a1 = 'completed'
  const press = async () => {
    talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'The site is served.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' })
    const before = stepped.length
    for await (const chunk of $.turn.step({ turnId: 'p', index: 1, model: 'm', messageCount: 2, agentId: 'a1' })) void chunk
    return stepped.length - before
  }
  expect(await press()).toBe(1)
})

test("a helper pressed for its report while a helper of its own runs is answered with the line the app hides, and when it then ends, that line is never passed on to its task as its result", async ($, on) => {
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const { resumed, stepped } = world(on, { agents, talk })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'rebuild the head' } as never)
  await $.agent.spawn({ ...spawn, description: 'Fit the CT scans', prompt: 'ct', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the fits', prompt: 'draw', parentAgentId: 'a2' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running', a3: 'running' })
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: 'e-a1', reason: 'answer', agentId: 'a1' } as never)
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Fits are done; drawing them.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' })
  const before = stepped.length
  const said: string[] = []
  for await (const chunk of $.turn.step({ turnId: 'p', index: 1, model: 'm', messageCount: 2, agentId: 'a2' })) if (chunk.kind === 'text') said.push((chunk as { text: string }).text)
  expect([stepped.length - before, said]).toEqual([0, ['<system-reminder>Waiting on my own work, which starts me again.</system-reminder>']])
  // Its own helper ends, and so does it, its last words the line: its task is started with its words before it, never the line
  agents.a3 = 'completed'
  await $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 'e-a3', reason: 'answer', agentId: 'a3' } as never)
  agents.a2 = 'completed'
  await $.turn.complete({ answer: said[0], durationMs: 1, isAborted: false, turnId: 'e-a2', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => resumed.some(line => line.startsWith('a1:')) || undefined)).toBe(true)
  expect(resumed.filter(line => line.startsWith('a1:') && line.includes('Waiting on my own work'))).toEqual([])
})

test("work never waits for its helpers: it is told it may end its step, it is let go when it does, and a helper's result that the engine hands the chat is passed on to it, which starts it again; a report handed back while helpers run is still held", async ($, on) => {
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const unresumable = new Set<string>()
  const ended = new Set<string>()
  const { stopped, resumed, appended, submitted, clock, stepped, atHandback, resumedAtHandback, files } = world(on, { agents, talk, unresumable, ended })
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a1 = 'running'
  agents.a2 = 'running'
  agents.a3 = 'running'
  // Told once, as it starts them, that their results come even after its step ends, and never to wait for them
  const told = await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))
  expect(told).toContain('each result comes to you as a message when it ends, even after you end your step')
  expect(told).not.toMatch(/bin\/helpers/)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))).toBe('')
  // It ends its step while both work: let go, not held
  const stop = () => ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })
  expect((await stop()).block).toBeUndefined()
  // Its report would leave their results to the chat: held, with no command to wait with
  const handback = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' } as never)) as { deny?: string }
  expect(handback.deny).toContain("Don't hand back your report yet")
  expect(handback.deny).not.toMatch(/bin\/helpers|Bash command|TaskStop/)
  // While it is at a step of its own the engine hands it the result itself: nothing is passed on
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' } as never)
  expect(resumed.filter(one => one.startsWith('a1:'))).toEqual([])
  // Its step ended, the engine lists it as done; the second helper's result is passed on and starts it again, and the chat is told
  agents.a1 = 'completed'
  // The helper still drawing ends a step of its own with a long word of how it stands, held on its render in the background: it has
  // not handed back
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r3', agentId: 'a3', command: 'hold render', description: 'Render the nose', run_in_background: true } as never)
  agents.a3 = 'waiting'
  await $.turn.complete({ answer: `Drawing the nose. ${'The render runs on and wakes me when it ends. '.repeat(15)}`, durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' } as never)
  // The engine, which does not count its helpers as its own at work, presses it for its report as it ends its step: answered with no
  // model and a line the app draws as nothing in a task's chat, it ends its step again (16 Nov: five tasks, pressed and refused at
  // their report, were told to the chat as ended; 17 Nov: the old line, said three times at each step's end, filled the task's chat).
  // Nor does a long word of how things stand send it to the model while a helper runs, nor a helper that said a long word itself
  const press = async (text: string) => {
    talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' })
    const before = stepped.length
    const said: string[] = []
    for await (const chunk of $.turn.step({ turnId: 'h1p', index: 1, model: 'm', messageCount: 2, agentId: 'a1' })) if (chunk.kind === 'text') said.push((chunk as { text: string }).text)
    return [stepped.length - before, said]
  }
  const QUIET = '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>'
  expect(await press('Waiting for the drawing.')).toEqual([0, [QUIET]])
  expect(await press(`The nose code is read. ${'The drawing helper still runs its render. '.repeat(15)}`)).toEqual([0, [QUIET]])
  await $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' } as never)
  // The engine then tells the chat it ended without its report. Claudopus adds no note of its own, which would ride into a later
  // turn of the chat's; at rest, the chat takes the notice as a prompt of its own, which is left out (16 Nov evening: 67 of 152 turns)
  // (saying that Claudopus starts it again should that wait run out, never that it may not be written to)
  const waits = /^From Claudopus: the task ".*" ended its step without its report because it waits for a helper it started\.[\s\S]*do not message it for one: Claudopus starts it again if that wait runs out or its helpers go quiet, and tells you if it is stuck\. Do not tell .+ it stopped\./
  const RESULT = 'The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.'
  const endedNotice = (id: string, result = RESULT) =>
    `<task-notification>\n<task-id>${id}</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/tasks/${id}.output</output-file>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n<note>A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>\n<result>${result}\n</result>\n<usage><subagent_tokens>9</subagent_tokens><tool_uses>1</tool_uses><duration_ms>9</duration_ms></usage>\n</task-notification>`
  const asNotice = (text: string) => $.prompt.submit({ text, wait: false, origin: { kind: 'task-notification' } } as never) as Promise<{ drop?: string; context?: string[] }>
  const toldOfWait = (texts: readonly string[] | undefined) => (texts ?? []).flatMap(text => text.split('\n\n')).filter(one => waits.test(one)).length
  await clock.advance(1_000)
  expect(appended.filter(one => /ended its step without its report/.test(one))).toEqual([])
  // Let in, never dropped (a warning card), its turn answered with no model, and with the word that the task is still at work for the
  // chat to read beside it later
  let quietTurn = 0
  const answeredQuietly = async (text: string) => {
    const turnId = `notice-${++quietTurn}`
    await $.turn.start({ text, turnId })
    const asked = stepped.length
    const said: string[] = []
    for await (const chunk of $.turn.step({ turnId, index: 0, model: 'm', messageCount: 2 })) if (chunk.kind === 'text') said.push((chunk as { text: string }).text)
    return stepped.length === asked && said.join('') === 'No response requested.'
  }
  const alone = await asNotice(endedNotice('a1'))
  expect([alone.drop, toldOfWait(alone.context), await answeredQuietly(endedNotice('a1'))]).toEqual([undefined, 1, true])
  // Beside a notice that says something, or with a security warning of its own, it goes on with the word that the task is still at
  // work in the same prompt
  const mixed = await asNotice(`${endedNotice('a1')}\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`)
  const warned = await asNotice(endedNotice('a1', `SECURITY WARNING: This subagent performed actions that may violate security policy. Reason: [Data Exfiltration]. Review the subagent's actions carefully before acting on its output.\n\n${RESULT}`))
  expect([mixed.drop, toldOfWait(mixed.context), warned.drop, toldOfWait(warned.context)]).toEqual([undefined, 1, undefined, 1])
  expect(await answeredQuietly(endedNotice('a1'))).toBe(false)
  // Joining a turn of the chat's under way, the notice still comes through here (seen on Claude Code 2.1.325: a notice that came
  // mid-turn was handed to this hook with that turn's id): it goes into that turn with the same word, or makes a turn of its own
  // answered with no model should that turn end first
  const midTurn = (await $.prompt.submit({ text: endedNotice('a1'), wait: false, turnId: 'chat1', origin: { kind: 'task-notification' } } as never)) as { drop?: string; context?: string[] }
  expect([midTurn.drop, toldOfWait(midTurn.context), await answeredQuietly(endedNotice('a1'))]).toEqual([undefined, 1, true])
  // A helper the engine no longer lists at work, its card left behind, is no wait: the notice reaches the chat as it is
  agents.a3 = 'completed'
  const gone = await asNotice(endedNotice('a1'))
  expect([gone.drop, toldOfWait(gone.context), await answeredQuietly(endedNotice('a1'))]).toEqual([undefined, 0, false])
  agents.a3 = 'running'
  // A step of its own and another pause: still no note of Claudopus's own in the chat
  talk.splice(0, talk.length, { role: 'user', content: 'Carry on.' })
  for await (const _ of $.turn.step({ turnId: 'h1c', index: 1, model: 'm', messageCount: 1, agentId: 'a1' })) void _
  await $.turn.complete({ answer: 'Waiting again.', durationMs: 1, isAborted: false, turnId: 'h1c', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_000)
  expect(appended.filter(one => /ended its step without its report/.test(one))).toEqual([])
  // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
  await clock.advance(25_000)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
  await list.unmount()
  expect(texts).toContain('1 task working')
  expect(texts).toContain('Fix the nose')
  agents.a3 = 'completed'
  // Its task, whose step had ended, is started first with word of what comes, so Claude Code hands the report to it and never to the
  // chat, where it would show as a "Report from subagent" box (17 Nov: "I want to see only the bits that are needed"); the chat is
  // told nothing, and nothing is passed on as the helper's turn ends
  const coming = (helper: string) => (one: string) => one === `a1: From Claudopus: your helper "${helper}" is handing you its report now. It comes as a message of its own right after this one: read it there.`
  const passed = (helper: string) => (one: string) => new RegExp(`^undefined: From Claudopus: the result of the helper "${helper}" reached this chat because the task ".*" had ended its step`).test(one)
  const beforeNose = resumed.length
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.' } as never)
  // (before the hand-back reaches Claude Code, which hands the report to the task only while it is at work)
  expect(resumed.slice(beforeNose, resumedAtHandback.at(-1)).filter(coming('Draw the nose'))).toHaveLength(1)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' } as never)
  await clock.advance(2_000)
  expect(resumed.filter(one => one.startsWith('a1: From Claudopus: your helper "Draw the nose" has finished'))).toEqual([])
  expect(appended.filter(passed('Draw the nose'))).toEqual([])
  // A helper the engine still lists as running as its turn ends has its result passed on once the engine lists it as ended
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a4 = 'running'
  await $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4', reason: 'answer', agentId: 'a4' } as never)
  agents.a4 = 'completed'
  await clock.advance(2_000)
  expect(await until(async () => resumed.find(one => one.startsWith('a1: From Claudopus: your helper "Draw the chin" has finished') && one.endsWith('The chin is drawn.')))).toBeDefined()
  expect(appended.filter(passed('Draw the chin'))).toHaveLength(1)
  // The same result ended again as failed is not passed on a second time
  await $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4b', reason: 'error', agentId: 'a4' } as never)
  await clock.advance(2_000)
  expect(resumed.filter(one => one.startsWith('a1: From Claudopus: your helper "Draw the chin"'))).toHaveLength(1)
  // Sent a message, it takes a step and ends again with the same words: that is a result of its own, passed on again
  talk.splice(0, talk.length, { role: 'user', content: 'Draw it once more.' })
  for await (const _ of $.turn.step({ turnId: 'h4c', index: 1, model: 'm', messageCount: 1, agentId: 'a4' })) void _
  await $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4c', reason: 'answer', agentId: 'a4' } as never)
  await clock.advance(2_000)
  expect(await until(async () => resumed.filter(one => one.startsWith('a1: From Claudopus: your helper "Draw the chin"')).length === 2 || undefined)).toBe(true)
  // One that cannot be passed on leaves the chat told to send it on itself
  agents.a1 = 'completed'
  unresumable.add('a1')
  await $.agent.spawn({ ...spawn, description: 'Draw the brow', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a5 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb5', agentId: 'a5', message: 'The brow is drawn.' } as never)
  const atBrowEnd = appended.length
  // Its task could not be started, so the chat gets the hand-back: the chat is told as it goes through, before the helper's turn
  // ends, as the chat's turn starts with the hand-back (16 Nov: its turn began before a note written later, and it sent it on by hand)
  expect(appended.slice(atHandback.at(-1), atBrowEnd).filter(passed('Draw the brow'))).toHaveLength(1)
  // The hand-back itself is let in and its turn answered with no model: the chat has nothing to do with it (17 Nov: it sent it on
  // again and wrote "Nothing needs you here."); once, and only a hand-back
  const handbackOf = (id: string, report: string) => `<agent-message from="${id}">\n[Subagent hand-back] The text below is the final report of a subagent this session delegated to. The report follows:\n  ${report}\n</agent-message>`
  const asPeer = (text: string) => $.prompt.submit({ text, wait: false, origin: { kind: 'peer' } } as never) as Promise<{ drop?: string }>
  const brow = handbackOf('a5', 'The brow is drawn.')
  // While the engine lists the task at work it may hand the task the result itself, so Claudopus may not pass it on: the chat's turn
  agents.a1 = 'waiting'
  expect([(await asPeer(brow)).drop, await answeredQuietly(brow)]).toEqual([undefined, false])
  agents.a1 = 'completed'
  expect([(await asPeer(brow)).drop, await answeredQuietly(brow)]).toEqual([undefined, true])
  expect([(await asPeer(brow)).drop, await answeredQuietly(brow)]).toEqual([undefined, false])
  const words = '<agent-message from="a5">\nThe brow is drawn.\n</agent-message>'
  expect([(await asPeer(words)).drop, await answeredQuietly(words)]).toEqual([undefined, false])
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h5', reason: 'answer', agentId: 'a5' } as never)
  // (sent as Claudopus's own message, which gives the chat a turn: a row written as the helper's turn ended sat unread)
  const notPassed = (helper: string, then: string) => new RegExp(`^From Claudopus: the result of the helper "${helper}" reached this chat, and Claudopus did not pass it on to the task ".*" \\(id a1\\): ${then}`)
  expect(await until(async () => submitted.find(one => notPassed('Draw the brow', 'no such agent\\. Send the result on to that task yourself: SendMessage to a1, with the result as it reached you\\.').test(one)))).toBeDefined()
  unresumable.delete('a1')
  // A hand-back Claude Code refuses leaves no note
  await $.agent.spawn({ ...spawn, description: 'Draw the lip', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a6 = 'running'
  files.set('refuse', 'SubagentHandback')
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6', agentId: 'a6', message: 'The lip is drawn.' } as never)
  files.delete('refuse')
  expect(appended.filter(passed('Draw the lip'))).toEqual([])
  // and the task started for it is told nothing comes
  expect(resumed.filter(coming('Draw the lip'))).toHaveLength(1)
  expect(resumed.at(-1)).toMatch(/^a1: From Claudopus: the report of your helper "Draw the lip" did not come after all: Claude Code refused it\./)
  // and so is it when Claude Code refuses it with a plain result, and the result is passed on as the helper's turn ends
  files.set('handback-not-sent', '1')
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6n', agentId: 'a6', message: 'The lip is drawn.' } as never)
  files.delete('handback-not-sent')
  expect(resumed.filter(one => one.includes('the report of your helper "Draw the lip" did not come after all'))).toHaveLength(2)
  // Should the chat get a hand-back all the same, its task started for it, Claudopus passes it on: here the task cannot be written
  // to, so the chat is told to send it on, with the task's id
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6b', agentId: 'a6', message: 'The lip is drawn.' } as never)
  expect(resumed.filter(coming('Draw the lip'))).toHaveLength(3)
  const lip = handbackOf('a6', 'The lip is drawn.')
  expect([(await asPeer(lip)).drop, await answeredQuietly(lip)]).toEqual([undefined, true])
  agents.a1 = 'running'
  ended.add('a1')
  agents.a6 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h6', reason: 'answer', agentId: 'a6' } as never)
  expect(await until(async () => submitted.find(one => notPassed('Draw the lip', 'no running loop\\. Send the result on to that task yourself: SendMessage to a1').test(one)))).toBeDefined()
  ended.delete('a1')
  agents.a1 = 'completed'
  // Stopped from its card or by the chat, the work's running helpers are stopped with it; one whose hand-back went to the task, as it
  // was started for it, leaves nothing for the chat
  await $.agent.spawn({ ...spawn, description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a1' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb7', agentId: 'a7', message: 'The ear is drawn.' } as never)
  expect(appended.filter(passed('Draw the ear'))).toEqual([])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect(stopped).toEqual(expect.arrayContaining(['a1', 'a7']))
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h7', reason: 'answer', agentId: 'a7' } as never)
  await clock.advance(2_000)
  expect(submitted.filter(one => one.includes('"Draw the ear"'))).toEqual([])
  expect(appended.filter(one => one.includes('Claudopus did not pass it on'))).toEqual([])
})

test("what nothing of the work's own makes, a file, a line in it, a page or a time, Claudopus looks for when asked and starts the work again once it is there, or once the longest look (15 min unless given, at most an hour, always) runs out, though the engine lists it as ended; a look that ran out has it hand back what it has, which goes through while a helper runs, and the same file, line or page is not looked for again; a helper's result that comes after is told to the chat as late; work never reached is told to the chat; its card says nothing of when it is started again; a helper hands back instead", SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const unresumable = new Set<string>()
  const { clock, files, resumed, logged, appended, submitted, notified } = world(on, { agents, unresumable })
  await $.session.start(start)
  await $.prompt.submit({ text: 'wait for the deploy', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the deploy', prompt: 'check' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the build log', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the test log', prompt: 'read', parentAgentId: 'a1' } as never)
  agents.a1 = 'completed'
  agents.a2 = 'running'
  agents.a3 = 'running'
  const r = (await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w1', agentId: 'a1', what: 'the deploy marker', file: '/w/deployed.flag' } as never)) as { result?: string }
  expect(r.result).toContain('End your step now')
  expect(r.result).toContain('after 15 min with word that it never came')
  const lines = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return texts
  }
  // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w2', agentId: 'a2', what: 'the build to finish', file: '/w/build.log', text: 'BUILD DONE' } as never)) as { result?: string }).result).toContain('hand back your result now')
  await clock.advance(40_000)
  expect(resumed.filter(one => /^a[12]: /.test(one))).toEqual([])
  // Its card says nothing of when Claudopus starts it again (18 Nov)
  expect((await lines()).some(text => /starts Claude again|the deploy marker/.test(text ?? ''))).toBe(false)
  // There: the work its step had ended, which the engine lists as ended, is started again
  files.set('/w/deployed.flag', '')
  await clock.advance(40_000)
  expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: what you asked to be started again for is there: the deploy marker. Carry on from it.'))).toBeDefined()
  expect(await until(async () => !(await lines()).some(text => text.includes('Claudopus starts Claude again')) || undefined)).toBe(true)
  // A time only, and a file that never comes: started when the time comes, or told it never came
  agents.a1 = 'completed'
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3l', agentId: 'a1', what: 'a look much later', minutes: 500 } as never)) as { result?: string }).result).toContain('in 60 min (at most 60 min).')
  await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3', agentId: 'a1', what: 'a look at the queue again', minutes: 2 } as never)
  await clock.advance(60_000)
  expect(resumed.filter(one => one.includes('a look at the queue again'))).toEqual([])
  await clock.advance(100_000)
  expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: the time you asked for has come: a look at the queue again. Carry on.'))).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4', agentId: 'a1', what: 'the results file', file: '/w/never.json', minutes: 1 } as never)
  await clock.advance(100_000)
  expect(await until(async () => resumed.find(one => one === 'a1: From Claudopus: the results file was still not there after 1 min of looking, and Claudopus will not look for it again. Hand back your report now with what you have, saying what never came and why; it goes through even while helpers run.'))).toBeDefined()
  // Told to hand back, its report goes through though its helpers run, and those at work are not stopped. One that handed back just
  // before, which the chat was told is passed on, ends after it: the chat is told in its place that it was not; one that hands back
  // after reaches the chat, which is told it came late. Each as Claudopus's own message, which gives the chat a turn
  agents.a2 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-a2', agentId: 'a2', message: 'The build log ends at step 9.' } as never)
  // (its task, whose step had ended, is started first, so the engine hands it the report, and the chat hears nothing of it)
  expect(resumed.filter(one => one.startsWith('a1: From Claudopus: your helper "Read the build log" is handing you its report now.'))).toHaveLength(1)
  expect(appended.filter(one => one.includes('reached this chat because the task'))).toEqual([])
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-miss', agentId: 'a1', message: 'The results file never came.' } as never)) as { deny?: string }).deny).toBeUndefined()
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h-a2', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(2_000)
  expect(submitted.filter(one => one.startsWith('From Claudopus, in place of its word'))).toEqual([])
  agents.a3 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-a3', agentId: 'a3', message: 'The test log is clean.' } as never)
  // Its hand-back reaches the chat, which is the one to act on it: the model's turn
  const late = '<agent-message from="a3">\n[Subagent hand-back] The report follows:\n  The test log is clean.\n</agent-message>'
  await $.prompt.submit({ text: late, wait: false, origin: { kind: 'peer' } } as never)
  await $.turn.start({ text: late, turnId: 'late' } as never)
  const lateSaid: string[] = []
  for await (const chunk of $.turn.step({ turnId: 'late', index: 0, model: 'm', messageCount: 2 })) if (chunk.kind === 'text') lateSaid.push((chunk as { text: string }).text)
  expect(lateSaid.join('')).not.toBe('No response requested.')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h-a3', reason: 'answer', agentId: 'a3' } as never)
  expect(await until(async () => submitted.find(one => /^From Claudopus: the result of the helper "[^"]+" came after the task "[^"]+" handed back what it had, so it reached this chat\./.test(one)))).toBeDefined()
  expect(submitted.filter(one => one.includes('handed back what it had'))).toHaveLength(1)
  expect(appended.filter(one => one.includes('reached this chat because the task'))).toEqual([])
  expect(appended.filter(one => one.includes('handed back what it had'))).toEqual([])
  expect(resumed.filter(one => one.startsWith('a1: From Claudopus: your helper') && one.includes('has finished'))).toEqual([])
  // The same file looked for again is refused, whatever its words; another is looked for
  agents.a1 = 'completed'
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4c', agentId: 'a1', what: 'the results, once more', file: '/w/never.json', minutes: 1 } as never)) as { result?: string }).result).toContain('Refused by Claudopus: the look for the results file ran out already')
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4d', agentId: 'a1', what: 'the results file', file: '/w/second.json', minutes: 1 } as never)) as { result?: string }).result).toContain('End your step now')
  // Work that cannot be started again for what came would wait for good: the chat is told
  await $.agent.spawn({ ...spawn, description: 'Watch the queue', prompt: 'watch' } as never)
  agents.a4 = 'completed'
  unresumable.add('a4')
  await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w7', agentId: 'a4', what: 'the queue to drain', minutes: 1 } as never)
  await clock.advance(120_000)
  expect(await until(async () => appended.find(line => line.startsWith('undefined: Claudopus could not start "Watch the queue" again for what it waited on: the queue to drain.')))).toBeDefined()
  expect(logged.filter(line => line.includes('Watch the queue'))).toEqual([])
  // Only the person can send it a message: its card says so, and they hear it as a notification
  expect(notified.some(line => line.startsWith('Watch the queue needs you | Claudopus could not start'))).toBe(true)
  // Nothing to look for is said back, and the chat has no card to be started from
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w5', agentId: 'a1', what: 'something' } as never)) as { result?: string }).result).toContain('Name a file, a page, or the minutes')
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w6', what: 'x', minutes: 1 } as never)) as { result?: string }).result).toContain('Only a background task')
})

test('a helper quiet for five minutes is named to its work once, and its card never says so: a helper at work is a row of its own', SLOW, async ($, on) => {
  const { clock, appended } = world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await clock.advance(70_000)
  expect(await pane.find({ type: 'Text', text: /looked in on|helper running/ })).toBeUndefined()
  await clock.advance(5 * 60_000)
  expect(appended.filter(line => line.startsWith('a1: Your helper "Read the nose code" (a2) has shown nothing new'))).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /shown nothing new|told to check/ })).toBeUndefined()
  await clock.advance(3 * 60_000)
  expect(appended.filter(line => line.includes('has shown nothing new'))).toHaveLength(1)
})

test('work whose context was compacted is handed its rules again at its next step, once; work started before the rules changed is handed the new ones', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the eyes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'draw them' } as never)
  // Started with the rules: nothing more at its steps
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))).not.toContain('These are the rules now')
  await $.session.compact({ trigger: 'auto', agentId: 'a1', messages: [{ role: 'user', text: 'one', toolUses: [] }] } as never)
  const told = await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))
  expect(told).toContain('Your context was compacted')
  expect(told).toContain('What follows is what Claudopus tells Claude in every task')
  expect(told).toContain('Keep the card up to date as you work')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))).not.toContain('These are the rules now')
  // The rules change under it, saved in Config: the new text reaches it
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  await pressed(config, 'config-text-work-edit')
  await config.input({ key: 'config-text-work-input', text: '- Every run says how far it is.' })
  expect(files.get(`${MEMORY}/roles/work.md`)).toBe('- Every run says how far it is.\n')
  await config.unmount()
  const changed = await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))
  expect(changed).toContain('have changed since you started')
  expect(changed).toContain('Every run says how far it is.')
})
