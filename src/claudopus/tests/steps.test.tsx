// Work that runs its helpers beside it: a helper runs in the background, its task ends its step and stays at work while one works,
// their results reach it through Claude Code alone, a task is told at the step when it could have sent calls together, and Claude
// Code's press for a report is answered with no model only where it can bring nothing

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

test("pressed by Claude Code for its report, a task is answered with no model, by the line the app hides, only when its report was already taken or it ended its step with a question or a permission open; while a helper or a command of its own works, and once a message starts it again, the press is a step of the model's", async ($, on) => {
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const { stepped } = world(on, { agents, talk })
  await $.session.start(start)
  await $.prompt.submit({ text: 'mend the face', wait: false, origin: composer })
  const QUIET = '<system-reminder>Waiting for an answer.</system-reminder>'
  const PRESS = '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.'
  // One step of a task whose chat ends as `rows` do: how many requests went to a model, and what the step said
  const step = async (agentId: string, rows: unknown[]) => {
    talk.splice(0, talk.length, ...rows)
    const before = stepped.length
    const said: string[] = []
    for await (const chunk of $.turn.step({ turnId: `p-${agentId}`, index: 1, model: 'm', messageCount: 2, agentId })) if (chunk.kind === 'text') said.push((chunk as { text: string }).text)
    return [stepped.length - before, said]
  }
  // The press as it comes after the task's last words
  const pressedFor = (agentId: string, words: string) => step(agentId, [{ role: 'assistant', content: [{ type: 'text', text: words }] }, { role: 'user', content: PRESS }])
  const MODEL = [1, ['Looking at the nose.']]
  const HIDDEN = [0, [QUIET]]

  // A helper of its own at work: the model's step, whether it said a few words or many (the model hands in, carries on or ends its
  // step; Claudopus says nothing in its place)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'completed', a2: 'running' })
  expect(await pressedFor('a1', 'Waiting for my helper.')).toEqual(MODEL)
  expect(await pressedFor('a1', `The nose code is being read. ${'The helper still reads it. '.repeat(15)}`)).toEqual(MODEL)

  // A command of its own in the background: the model's step
  await $.agent.spawn({ ...spawn, description: 'Render the ears', prompt: 'render the ears' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r3', agentId: 'a3', command: 'hold render', description: 'Render the ears', run_in_background: true } as never)
  expect(await pressedFor('a3', 'The render runs.')).toEqual(MODEL)

  // A question open for the person: it can give no report, so the press costs no model and draws nothing
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  expect(await pressedFor('a4', 'I asked whether the old repo may go.')).toEqual(HIDDEN)

  // A permission open for the person, on a command of its own: the same
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a5' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => button(list, 'prompt-no-this-'))).toBeDefined()
  expect(await pressedFor('a5', 'The build folder is next.')).toEqual(HIDDEN)
  await list.press({ key: (await button(list, 'prompt-no-this-'))?.key ?? '' })
  await asked
  await list.unmount()

  // Its report taken at its hand-back: the step after the hand-back's own result, and each press after it, cost no model
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6', agentId: 'a6', message: 'Both eyes are drawn.' } as never)) as { deny?: string; result?: { message?: string } }
  expect([handed.deny, handed.result?.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')])
  const handBack = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb6', name: 'SubagentHandback', input: { message: 'Both eyes are drawn.' } }] }
  expect(await step('a6', [handBack, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb6', content: 'Report delivered.' }] }])).toEqual(HIDDEN)
  expect(await step('a6', [handBack, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb6', content: 'Report delivered.' }, { type: 'text', text: PRESS }] }])).toEqual(HIDDEN)
  // A message starts it again: a step of its own, and a press after that is the model's too, as its next report is not yet taken
  expect(await step('a6', [handBack, { role: 'user', content: 'Make the left eye bigger.' }])).toEqual(MODEL)
  expect(await pressedFor('a6', 'The left eye is bigger.')).toEqual(MODEL)
})

test("a task that ends its step while its helpers work stays at work, and nothing of Claudopus starts it again or looks in on it: told once that their results come by themselves, it is let go as it stops with a to-do open, may not hand in its result while one works, and each helper's result, in words or handed in, reaches it through Claude Code alone; the chat's turn for the notice of its pause is answered with no model; with its helpers ended its own result goes through and its card is done; stopped by the chat, the helpers a task has at work are stopped with it", SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const { stopped, resumed, appended, submitted, sent, clock, stepped, files } = world(on, { agents, talk })
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  agents.a1 = 'running'
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Mend the nose' } as never)
  const stop = () => ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })
  // With a to-do open and nothing of its own running it may not stop
  expect((await stop()).block).toContain('You may not stop here')
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a2: 'running', a3: 'running' })
  // Told once, as it starts them, that their results come even after its step ends, and never to wait for them
  const told = await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))
  expect(told).toContain('each result comes to you as a message when it ends, even after you end your step')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))).toBe('')
  // It ends its step while both work, the to-do still open: let go
  expect((await stop()).block).toBeUndefined()
  // Its result would leave theirs to the chat: refused while one works, with no command to wait with
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd2', agentId: 'a1', item: 'Mend the nose', state: 'done' } as never)
  const early = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' } as never)) as { deny?: string }
  expect(early.deny).toContain('Not handed in: 2 helpers of yours are still at work: "Read the nose code"; "Draw the nose"')
  expect(early.deny).not.toMatch(/bin\/helpers|Bash command|TaskStop/)
  // Everything Claudopus itself sent the task, wrote into its chat or the chat's, or sent the chat: nothing, from here to its result
  // (the notices below are the test's own, as Claude Code sends them)
  const fromClaudopus = () => [...resumed, ...appended.filter(one => /^(a1|undefined): /.test(one)), ...submitted.filter(one => !one.startsWith('<task-notification>')), ...sent]
  // The first helper ends in words, and the task ends its step: Claude Code lists it as over, and its card stays at work
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' } as never)
  // Claude Code then tells the chat it ended without its report. The chat hears nothing more of the pause: the notice is let in,
  // never dropped (a warning card), with no word of Claudopus's beside it, and its turn is answered with no model (16 Nov evening:
  // 67 of 152 turns of the chat's were such notices)
  const RESULT = 'The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.'
  const endedNotice = (id: string) =>
    `<task-notification>\n<task-id>${id}</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/tasks/${id}.output</output-file>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n<note>A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>\n<result>${RESULT}\n</result>\n<usage><subagent_tokens>9</subagent_tokens><tool_uses>1</tool_uses><duration_ms>9</duration_ms></usage>\n</task-notification>`
  const asNotice = (text: string) => $.prompt.submit({ text, wait: false, origin: { kind: 'task-notification' } } as never) as Promise<{ drop?: string; context?: string[] }>
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
  expect([alone.drop, alone.context ?? [], await answeredQuietly(endedNotice('a1'))]).toEqual([undefined, [], true])
  // Beside a notice that says something, it is the model's turn
  const mixed = `${endedNotice('a1')}\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`
  expect([(await asNotice(mixed)).drop, await answeredQuietly(mixed)]).toEqual([undefined, false])
  // Its helper draws on for forty minutes, past every time Claudopus once looked in at (5, 12, 24 and 36 minutes): the task is
  // not started, written to or named to the chat, and its card says Working, nothing of the pause or of a quiet helper
  await clock.advance(40 * 60_000)
  expect(fromClaudopus()).toEqual([])
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts).toContain('1 working')
  expect(texts).toContain('Fix the nose')
  expect(texts.filter(text => /looked in on|shown nothing new|Nothing new|told to check|starts Claude again|stuck/i.test(text))).toEqual([])
  // The second helper hands in its result. It goes only to the task that started it, never into the chat (Claude Code draws a
  // hand-back it delivers as a box in the chat, where it doubled the task's own words): Claudopus answers the hand-back itself,
  // so Claude Code delivers nothing, and gives the result to the task once, as its helper's, by the helper's title
  // (the engine here would answer "Nothing was sent": that answer is never seen, as the hand-back never reaches it)
  files.set('handback-not-sent', '1')
  // (to-dos of its own are its own: they hold its own hand-back, and are never on the list of the task that started it)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd3', agentId: 'a3', item: 'Draw at every size' } as never)
  const helperOpen = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3a', agentId: 'a3', message: 'Half drawn.' } as never)) as { deny?: string }
  expect(helperOpen.deny).toContain('"Draw at every size"')
  const ownList = (await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd4', agentId: 'a3', item: 'Draw at every size', state: 'done' } as never)) as { result?: string }
  expect(ownList.result).toBe('[x] Draw at every size')
  expect(((await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd5', agentId: 'a1', item: 'Mend the nose', state: 'done' } as never)) as { result?: string }).result).toBe('[x] Mend the nose')
  const before = { resumed: resumed.length, submitted: submitted.length, appended: appended.length }
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.\nSee nose.svg.' } as never)) as { deny?: string; result?: { message?: string } }
  expect([handed.deny, handed.result?.message]).toEqual([undefined, expect.stringContaining('Report delivered to the task that started you')])
  files.delete('handback-not-sent')
  expect(resumed.slice(before.resumed)).toEqual([expect.stringMatching(/^a1: From Claudopus: your helper "Draw the nose" \(a3\) has finished, and its result follows\.[\s\S]*\n  The nose is drawn at every size\.\n  See nose\.svg\.$/)])
  // Pressed by Claude Code afterwards, which saw nothing delivered, the helper is answered with no model
  const pressedAfter: string[] = []
  const askedBefore = stepped.length
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'hb3', name: 'SubagentHandback', input: {} }] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb3', content: 'ok' }] })
  for await (const chunk of $.turn.step({ turnId: 'h3p', index: 0, model: 'm', messageCount: 2, agentId: 'a3' } as never)) if (chunk.kind === 'text') pressedAfter.push((chunk as { text: string }).text)
  expect([pressedAfter.join(''), stepped.length]).toEqual(['<system-reminder>Waiting for an answer.</system-reminder>', askedBefore])
  talk.splice(0, talk.length)
  agents.a3 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' } as never)
  // Claude Code's notice to the chat that the helper ended without its report is nothing of the chat's: no word, no model
  const helperNotice = endedNotice('a3')
  expect([(await asNotice(helperNotice)).context ?? [], await answeredQuietly(helperNotice)]).toEqual([[], true])
  await clock.advance(60_000)
  // The task got it exactly once, and nothing reached the chat's own thread: no prompt to the chat, no line written into it
  expect(resumed.slice(before.resumed)).toHaveLength(1)
  expect(submitted.slice(before.submitted).filter(one => !one.startsWith('<task-notification>'))).toEqual([])
  expect(appended.slice(before.appended).filter(one => /^(a1|undefined): /.test(one))).toEqual([])
  // With both ended, its own result goes through, and its card is done
  agents.a1 = 'running'
  const late = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: 'The nose is fixed.' } as never)) as { deny?: string; result?: { message?: string } }
  expect([late.deny, late.result?.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')])
  expect(await until(async () => list.find({ type: 'Text', text: '✓ Done' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: '1 working' })).toBeUndefined()
  await list.unmount()
  // Stopped by the chat, a task's helpers at work are stopped with it
  await $.agent.spawn({ ...spawn, description: 'Fix the ears', prompt: 'fix the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a4' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a4' } as never)
  expect(stopped).toEqual(expect.arrayContaining(['a4', 'a5']))
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
