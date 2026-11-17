// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text

test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', SLOW, async ($, on) => {
  // The engine runs all three, each in its call: they are only flagged, never started again
  const { keep, settle, clock, held, logged, resumed, appended } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'One merger for all pushes', prompt: 'one merger' } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work ONE releasing', prompt: 'one', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work TWO releasing', prompt: 'two', parentAgentId: 'a1', resume: { agentId: 'h2' } } as never)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  const look = async <T,>(fn: (pane: { find: (q: object) => Promise<{ text?: string; props: Record<string, unknown> } | undefined>; findAll: (q: object) => Promise<unknown[]> }) => Promise<T>) => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await fn(pane as never)
    await pane.unmount()
    return r
  }
  const stuck = () => look(pane => pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ }))

  // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
  await bash('a1', 'git log', 'p1')
  await bash('h1', 'git status', 'b1')
  await bash('h2', 'git status', 'b2')
  await clock.advance(11 * 60_000)
  expect(await stuck()).toBeUndefined()
  await clock.advance(2 * 60_000)
  expect((await stuck())?.props.color).toBe('#E5A50A')
  expect((await stuck())?.text).toMatch(/^Nothing new for 1[23]m\.$/)
  expect(logged.filter(line => line.includes(`Nothing new from "One merger for all pushes"`))).toHaveLength(1)
  // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
  expect(appended.filter(line => line.includes(`Nothing new from "One merger for all pushes"`) && line.includes('you may send it a message asking what it waits on'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('you may send it a message'))).toEqual([])
  // Looked at again, nothing more is said
  await clock.advance(60_000)
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(1)

  // Something new comes back: the flag goes at the next look
  void keep(bash('h1', 'hold release', 'b3'))
  const letRelease = await until(async () => held.get('release'))
  letRelease?.('released Thing 0.1.1')
  expect(await stuck()).toBeDefined()
  await clock.advance(25_000)
  expect(await stuck()).toBeUndefined()
  // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
  void keep(bash('h1', 'hold poll', 'b4'))
  const letPoll = await until(async () => held.get('poll'))
  letPoll?.('released Thing 0.1.7')
  await clock.advance(13 * 60_000)
  expect(await stuck()).toBeDefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(2)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toEqual([])
  await settle()
})

test('stuck work the engine no longer runs had stopped partway through: the mod starts it again at once and tells the chat; work whose step ended while all its helpers sit silent is, on a fixed schedule, started again to check on them at 12 minutes and to hand back what it has at 24, and the chat is told plainly at 36; its report then goes through, the silent helpers stopped; helpers at work, rendering in the background or printing a moving frame count, are left alone and their card says so', SLOW, async ($, on) => {
  const all = { a1: 'idle', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running', a7: 'running' }
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = Object.fromEntries(Object.keys(all).map(id => [id, 'general-purpose']))
  // (a5's render prints a line every minute)
  const { keep, settle, clock, held, logged, resumed, stopped, appended, submitted } = world(on, { agents, kinds, parents: { a3: 'a2', a5: 'a4', a7: 'a6' }, jobs: { output: () => 'rendering frames\n', wroteAt: file => (file.endsWith('/bg-r-a5.output') ? clock.now() - 60_000 : 0) } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fit the video', prompt: 'fit' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a2' } as never)
  await $.agent.spawn({ ...spawn, description: 'Film the town', prompt: 'film' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the town', prompt: 'render', parentAgentId: 'a4' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score the faces', prompt: 'score' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score each frame', prompt: 'frames', parentAgentId: 'a6' } as never)
  Object.assign(agents, all)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  for (const id of ['a1', 'a2', 'a3', 'a4', 'a6']) await bash(id, 'git status', `s-${id}`)
  // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints a new frame count
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r-a5', agentId: 'a5', command: 'hold render', description: 'Render the town (about 2 h)', run_in_background: true } as never)
  // The three tasks end their steps to wait for their helpers
  const ends = async (id: string, turnId: string) => {
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }
  for (const id of ['a2', 'a4', 'a6']) await ends(id, `e-${id}`)
  let frame = 0
  const frames = async (minutes: number) => {
    for (let at = 0; at < minutes; at += 4) {
      void keep(bash('a7', 'hold frame', `f-${(frame += 1)}`))
      // Each call ends as it prints its count, before the clock moves: the last one's hold is taken away, so it is never let go twice
      const letFrame = await until(async () => held.get('frame'))
      held.delete('frame')
      letFrame?.(`frame ${frame * 100}/9000`)
      await clock.advance(4 * 60_000)
    }
  }
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  // Told to the chat's model, not shown: the card says so
  expect(appended.filter(line => line.includes('"Fit the video" stopped partway') && line.includes('started it again'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('stopped partway'))).toEqual([])
  // 12 minutes on: started again to check on its helper, and the chat told so
  const nudges = (id = 'a2') => resumed.filter(line => line.startsWith(`${id}: From Claudopus:`) && line.includes('helpers'))
  expect(nudges()).toHaveLength(1)
  expect(nudges()[0]).toMatch(/^a2: From Claudopus: nothing new has come back from your helpers for 1[2-6] min while your step had ended: "[^"]+" \(a3\)\. Ask each with SendMessage/)
  expect(appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('Claudopus started Claude again and asked it to check on them.'))).toHaveLength(1)
  // Until then it may not hand back while its helper runs
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-early', agentId: 'a2', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toContain("Don't hand back your report yet")
  // It asks its helper, which never answers, and ends its step again: a step and a message start nothing over
  agents.a2 = 'running'
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-a2', agentId: 'a2', to: 'a3', message: 'What are you doing?' } as never)
  await ends('a2', 'e-a2b')
  await bash('a1', 'git status', 's-a1-again')
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  // 24 minutes on: started again, once, to hand back what it has; a message from the chat then takes nothing back
  expect(await until(async () => nudges().length === 2 || undefined)).toBe(true)
  expect(nudges()[1]).toContain('hand back your report now with what you have')
  expect(appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('asked it to send what it has now.'))).toHaveLength(1)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-chat', to: 'a2', message: 'Carry on.' } as never)
  agents.a2 = 'completed'
  // 36 minutes on, still not handed back: no third start; the chat is told plainly it is stuck and may write to it, and the card says so
  await frames(13)
  expect(nudges()).toHaveLength(2)
  expect(await until(async () => logged.find(line => line.startsWith('"Draw the lids" is stuck: nothing new from its helpers')))).toBeDefined()
  expect(appended.filter(line => line.includes('"Draw the lids" is stuck') && line.includes('you may send it a message'))).toHaveLength(1)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = (await pane.findAll({ type: 'Text' })).map(one => (one as { text?: string }).text ?? '')
  await pane.unmount()
  expect(texts.filter(text => text.startsWith('Nothing new for') && text.endsWith('and told the chat it may be stuck.'))).toHaveLength(1)
  // Helpers at work are never taken for silent: their tasks are not started again, and its card says it waits on its helpers' work;
  // with nothing new coming back, the chat is told once that its helpers still run something
  expect([nudges('a4'), nudges('a6')]).toEqual([[], []])
  expect(logged.filter(line => line.includes('"Film the town"'))).toEqual([expect.stringMatching(/^Nothing new from "Film the town" for 3\dm, though its helpers are still running something\./)])
  expect(texts.filter(text => text === 'Waiting for its helpers').length).toBeGreaterThanOrEqual(1)
  // Its report goes through while its helpers run: the silent one is stopped with it, those at work never are
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-late', agentId: 'a2', message: 'Lids drawn; rendering never ended.' } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(stopped).toContain('a3')
  expect(stopped.filter(id => id === 'a5' || id === 'a7')).toEqual([])
  // The helper Claudopus stopped tells the chat nothing as it ends, though it ends with words
  await $.turn.complete({ answer: 'Half the lids rendered.', durationMs: 1, isAborted: false, turnId: 'e-a3', reason: 'answer', agentId: 'a3' } as never)
  await clock.advance(2_000)
  expect([...appended, ...submitted].filter(line => line.includes('came after the task'))).toEqual([])
  held.get('render')?.('done')
  await settle()
})

test('the schedule for silent helpers keeps its time: each step comes though the last never reached the task, and a bare call or a message does not start it over; a helper printing something different does, and the leave to hand back already given stays', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const unresumable = new Set(['a1'])
  const { keep, settle, clock, held, logged, resumed, appended } = world(on, { agents, kinds, parents: { a2: 'a1' }, unresumable })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: 'e1', reason: 'answer', agentId: 'a1' } as never)
  const said = () => appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"'))
  await clock.advance(13 * 60_000)
  expect(said()).toHaveLength(1)
  expect(resumed.filter(line => line.startsWith('a1:'))).toEqual([])
  // A call that says what it said before, and a message from the chat, start nothing over: the order to hand back comes at 24
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n-a2', agentId: 'a2', command: 'git status' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'How is it going?' } as never)
  agents.a1 = 'completed'
  await clock.advance(12 * 60_000)
  expect(await until(async () => said().length === 2 || undefined)).toBe(true)
  expect(said()[1]).toContain('asked it to send what it has now')
  // The helper prints something different: the schedule starts over, its check-in 12 minutes on, and the leave stays
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'a2', command: 'hold frame' } as never))
  const letFrame = await until(async () => held.get('frame'))
  letFrame?.('frame 100/9000')
  await clock.advance(11 * 60_000)
  expect(said()).toHaveLength(2)
  await clock.advance(2 * 60_000)
  expect(await until(async () => said().length === 3 || undefined)).toBe(true)
  expect(said()[2]).toContain('asked it to check on them')
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toBeUndefined()
  await settle()
})

test('helpers are not taken for silent while the engine writes to one\'s transcript, nor while one waits on a command the engine says ends with its step that lives on and prints; once all sit silent, the task is started again to check on them (17 Nov: a task was told its helpers sat silent while two were mid-step and one followed its Azure run)', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose', a3: 'general-purpose' }
  const printed: Record<string, number> = {}
  const { clock, resumed, files } = world(on, { agents, kinds, parents: { a2: 'a1', a3: 'a1' }, jobs: { output: () => 'progress: 3/40 heads fitting\n', wroteAt: file => printed[(file.split('/').pop() ?? '').replace(/\.output$/, '')] ?? 0 } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Rebuild the head model', prompt: 'rebuild' } as never)
  await $.agent.spawn({ ...spawn, description: 'Fit the CT scans', prompt: 'ct', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Fit the surface scans', prompt: 'scans', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running', a3: 'running' })
  for (const id of ['a1', 'a2', 'a3']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  // a2 follows its run on Azure in the background, a command the engine says ends with a2's step, and ends its step held on it
  await $.tool.call({ tool: 'Bash', tool_use_id: 'f-a2', agentId: 'a2', command: 'hold follow # with its step', description: 'Follow the face run until it ends', run_in_background: true } as never)
  agents.a2 = 'waiting'
  await $.turn.complete({ answer: 'Waiting for the face run on Azure.', durationMs: 1, isAborted: false, turnId: 'e-a2', reason: 'answer', agentId: 'a2' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Two helpers are fitting; I continue when they report.', durationMs: 1, isAborted: false, turnId: 'e-a1', reason: 'answer', agentId: 'a1' } as never)
  const nudges = () => resumed.filter(line => line.startsWith('a1: From Claudopus: nothing new has come back from your helpers'))
  // 13 minutes on, a2's run prints each minute: no check-in
  const a3 = `${HOME}/.claude/projects/-repo/engine-id/subagents/agent-a3.jsonl`
  files.set(a3, '{}')
  for (let m = 1; m <= 13; m++) ((printed['bg-f-a2'] = clock.now()), await clock.advance(60_000))
  expect(nudges()).toEqual([])
  // a2's run then prints nothing more; for 40 minutes the engine writes a3's steps to its transcript, though Claudopus saw none of
  // its calls: no check-in
  for (let m = 1; m <= 40; m++) (files.set(`mtime:${a3}`, String(clock.now())), await clock.advance(60_000))
  expect(nudges()).toEqual([])
  // Both then sit silent: the task is started again to check on them
  await clock.advance(13 * 60_000)
  expect(await until(async () => nudges().length > 0 || undefined)).toBe(true)
})

test("a helper's command in the background is work only while it prints, for at most 30 minutes after its last line, and a task waiting on its own wake_me beside its helpers is not nudged; work flagged stuck is told to the chat once by 36 minutes whatever its helpers look like, and the word that it waits then says the chat may write to it", SLOW, async ($, on) => {
  const all = { a1: 'running', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running' }
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = Object.fromEntries(Object.keys(all).map(id => [id, 'general-purpose']))
  // When each command in the background last printed, by its task id
  const printed: Record<string, number> = {}
  const { clock, resumed, appended } = world(on, { agents, kinds, parents: { a2: 'a1', a4: 'a3', a6: 'a5' }, jobs: { output: () => 'listening on :3000\n', wroteAt: file => printed[(file.split('/').pop() ?? '').replace(/\.output$/, '')] ?? 0 } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Serve the site', prompt: 'serve' } as never)
  await $.agent.spawn({ ...spawn, description: 'Start the server', prompt: 'start', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the app', prompt: 'check' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the app log', prompt: 'read', parentAgentId: 'a3' } as never)
  await $.agent.spawn({ ...spawn, description: 'Run the dev site', prompt: 'run' } as never)
  await $.agent.spawn({ ...spawn, description: 'Watch the dev site', prompt: 'watch', parentAgentId: 'a5' } as never)
  Object.assign(agents, all)
  for (const id of Object.keys(all)) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  // a2 starts a server that prints once and then hangs silent; a6 one that prints all the time
  await $.tool.call({ tool: 'Bash', tool_use_id: 'v-a2', agentId: 'a2', command: 'hold serve', description: 'Start the server', run_in_background: true } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'v-a6', agentId: 'a6', command: 'hold watch', description: 'Serve the dev site', run_in_background: true } as never)
  printed['bg-v-a2'] = clock.now()
  // a3 asks to be started again in an hour, beside its helper
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w-a3', agentId: 'a3', what: 'the app to come up', minutes: 60 } as never)) as { result?: string }).result).toContain('in 60 min')
  for (const id of ['a1', 'a3', 'a5']) {
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: `e-${id}`, reason: 'answer', agentId: id } as never)
  }
  const nudges = (id: string) => resumed.filter(line => line.startsWith(`${id}: From Claudopus:`) && line.includes('helpers'))
  const told = () => appended.filter(line => line.includes('Nothing new from "Run the dev site"') && line.includes('you may send it a message'))
  const minutes = async (n: number) => {
    for (let at = 0; at < n; at += 1) ((printed['bg-v-a6'] = clock.now()), await clock.advance(60_000))
  }
  // 25 minutes on: the server that last printed 25 minutes ago is still work, and the task waiting on its own wake_me is not nudged
  await minutes(25)
  expect([nudges('a1'), nudges('a3'), nudges('a5'), told()]).toEqual([[], [], [], []])
  // 30 minutes after its last line it is silent: its task is checked on, and ordered to hand back only 12 minutes after that
  await minutes(7)
  expect(nudges('a1')).toHaveLength(1)
  await minutes(6)
  expect(nudges('a1')).toHaveLength(1)
  // The task whose helper prints all along, with nothing new coming back, is told to the chat once by 36 minutes
  expect(told()).toHaveLength(1)
  await minutes(8)
  expect(nudges('a1')).toHaveLength(2)
  expect([told().length, nudges('a3'), nudges('a5')]).toEqual([1, [], []])
  // Its notice that it ended now says the chat may write to it
  const notice = `<task-notification>\n<task-id>a5</task-id>\n<status>completed</status>\n<summary>Agent "Run the dev site" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`
  const r = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }
  const waits = (r.context ?? []).filter(text => text.includes('"Run the dev site" ended its step without its report'))
  expect(waits).toHaveLength(1)
  expect(waits[0]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a5)')
  expect(waits[0]).not.toContain('do not message it')
})

test('the word that the chat was told a task is stuck lasts only until it or its helpers move again: a task held off the stuck flag by a command of its own, told of at the end of the schedule, moves, and the word that it waits says again not to message it', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const { keep, clock, held, appended } = world(on, { agents, kinds, parents: { a2: 'a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Upload the lids', prompt: 'upload' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  // Its own upload runs in the background, so it is never flagged stuck; its helper sits silent
  await $.tool.call({ tool: 'Bash', tool_use_id: 'u-a1', agentId: 'a1', command: 'hold upload', description: 'Upload the lids', run_in_background: true } as never)
  // (the engine holds it for its upload as its step ends, and lists it as completed after)
  const ends = async (turnId: string) => {
    agents.a1 = 'running'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: 'a1' } as never)
    agents.a1 = 'completed'
  }
  await ends('e1')
  for (let at = 0; at < 38; at += 1) await clock.advance(60_000)
  expect(appended.filter(line => line.includes('"Upload the lids" is stuck'))).toHaveLength(1)
  expect(appended.filter(line => line.includes('Nothing new from "Upload the lids"'))).toEqual([])
  const waitsWord = async () => {
    const notice = `<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Upload the lids" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`
    const r = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }
    return (r.context ?? []).filter(text => text.includes('"Upload the lids" ended its step without its report'))
  }
  expect((await waitsWord())[0]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a1)')
  // It moves by itself: something new comes back to it, and it ends its step again
  agents.a1 = 'running'
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'l-a1', agentId: 'a1', command: 'hold look' } as never))
  const letLook = await until(async () => held.get('look'))
  letLook?.('the upload is at 80 percent')
  await ends('e2')
  await clock.advance(60_000)
  const after = await waitsWord()
  expect(after).toHaveLength(1)
  expect(after[0]).toContain('do not message it for one')
  expect(after[0]).not.toContain('Claudopus told you it is stuck')
})

test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', SLOW, async ($, on) => {
  const { keep, settle, clock, held } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' } as never)
  await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' } as never))
  const rows = async () => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
    // The command a helper waits on is a row under it, in its own words, after the word that says it is a command
    // (its name a button, as a press opens its output)
    const r = [...(await pane.findAll({ type: 'Text' })).map(one => one.text), ...(await pane.findAll({ type: 'Button' })).map(one => String(one.props.label))].filter(text => /^(Command · hold search|.* running · .*)$/.test(text))
    await pane.unmount()
    return r
  }
  // (a row from ten seconds on: it was two minutes, and commands ran with nothing shown)
  await clock.advance(5_000)
  expect(await rows()).toEqual([])
  await clock.advance(70_000)
  expect(await rows()).toEqual(['Command · hold search'])
  const letSearch = await until(async () => held.get('search'))
  letSearch?.('found it')
  await clock.advance(1_000)
  expect(await rows()).toEqual([])
  await settle()
})

test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a2: 'general-purpose' }
  const { keep, settle, clock, logged, held } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  // Its first run, moving all along, takes longer than the stuck check waits; then it rests
  for (const part of ['left ear', 'right ear', 'lobes']) {
    await clock.advance(5 * 60_000)
    void keep($.tool.call({ tool: 'Bash', tool_use_id: `e-${part}`, agentId: 'a1', command: `hold ${part}` } as never))
    const letGo = await until(async () => held.get(part))
    letGo?.(`drew the ${part}`)
  }
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(30 * 60_000)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } } as never)
  await clock.advance(25_000)
  const look = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })
    await pane.unmount()
    return r
  }
  expect(await look()).toBeUndefined()
  await $.turn.complete({ answer: 'Bigger now.', durationMs: 1, isAborted: false, turnId: 't1b', reason: 'answer', agentId: 'a1' } as never)
  // Held on a watch it started after a report as long as one: its card goes on, but it is not stuck
  agents.a2 = 'waiting'
  await $.agent.spawn({ ...spawn, description: 'Watch the build', prompt: 'watch' } as never)
  await $.turn.complete({ answer: `The build is watched. ${'Every check passes and it is pushed. '.repeat(15)}`, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(13 * 60_000)
  expect(await look()).toBeUndefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toEqual([])
  await settle()
})

test('work asking the person something waits on them and is never flagged', SLOW, async ($, on) => {
  const { clock, logged } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(30 * 60_000)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })).toBeUndefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(0)
  await pane.unmount()
})

test('the log is added to, never rewritten whole, and the empty bytes earlier versions left in it are taken out', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/log.md`, `2026-01-01T00:00:00.000Z start one\u0000\u0000\u00002026-01-01T00:00:01.000Z start two\n`)
  await $.session.start(start)
  const text = files.get(`${MEMORY}/log.md`) ?? ''
  expect(text).not.toContain('\u0000')
  expect(text.startsWith('2026-01-01T00:00:00.000Z start one2026-01-01T00:00:01.000Z start two\n')).toBe(true)
  expect(text).toMatch(/Z start engine-id in \/repo\n$/)
})

test('a task Claude Code pressed for its report that ended its step with none, asking nothing and with nothing that starts it again, is started again to carry on and its card stays at work saying so; stopped so again and again with little done between, it is left stopped with one line on its card; a task asking you something, one stopped, one with a result, and one never pressed for a report end as before', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  const pressed = [{ role: 'assistant', content: [{ type: 'text', text: 'Waiting for the build.' }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>' }] }]
  const talk: unknown[] = [...pressed]
  const { clock, resumed, appended } = world(on, { agents, talk })
  await $.session.start(start)
  for (const title of ['Paint the skin', 'Ask about the logo', 'Draw the banner', 'Write the notes', 'Sort the frames']) await $.agent.spawn({ ...spawn, description: title, prompt: title } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] } as never)
  const ends = async (id: string, answer: string, n: number, isAborted = false) => {
    agents[id] = 'completed'
    await $.turn.complete({ answer, durationMs: 1, isAborted, turnId: `t-${id}-${n}`, reason: 'answer', agentId: id } as never)
  }
  const lines = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const found = (await pane.findAll({ type: 'Text', text: /^Stopped partway / })).map(one => ({ text: one.text?.replace(/\d\d:\d\d/g, 'hh:mm'), color: one.props.color }))
    await pane.unmount()
    return found
  }
  const carried = (id: string) => resumed.filter(line => line.startsWith(`${id}: From Claudopus, not `) && line.includes('left stopped partway. Carry on from where you were'))
  await $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a1', command: 'git status' } as never)
  await ends('a1', 'Waiting for the build.', 1)
  for (const id of ['a2', 'a4']) await ends(id, 'Waiting for my answer.', 1)
  await ends('a3', 'Waiting for the build.', 1, true)
  await ends('a4', `Done. ${'Every banner is drawn and checked. '.repeat(20)}`, 2)
  // Started again a moment later, not at once: the engine closes the run first
  expect(carried('a1')).toHaveLength(0)
  await clock.advance(6000)
  expect(carried('a1')).toHaveLength(1)
  expect(resumed.filter(line => /^a[234]: /.test(line))).toEqual([])
  expect(await lines()).toEqual([{ text: 'Stopped partway at hh:mm without a result · Claudopus started it again', color: undefined }])
  // The chat's model is told only once Claudopus gives up; a run that ended with its words as its result, never pressed, ends as before
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Sorted.' }] })
  await ends('a5', 'Sorted.', 1)
  await clock.advance(6000)
  expect(resumed.filter(line => line.startsWith('a5: '))).toEqual([])
  talk.splice(0, talk.length, ...pressed)
  // It stops so again with nothing done: started again twice more, then left stopped, with one line on its card, in amber
  for (const n of [2, 3, 4]) {
    await ends('a1', 'Waiting for the build.', n)
    await clock.advance(6000)
  }
  expect(carried('a1')).toHaveLength(3)
  expect(await lines()).toEqual([{ text: 'Stopped partway 4 times without a result · Claudopus stopped starting it again · send it a message to carry on', color: '#E5A50A' }])
  expect(appended.filter(line => line.includes('"Paint the skin" (a1) keeps stopping partway'))).toHaveLength(1)
  await ends('a1', 'Waiting for the build.', 5)
  await clock.advance(6000)
  expect(carried('a1')).toHaveLength(3)
  // Sent a message, as its card says, it works again and gives its result: the amber line goes, and it ends under Finished
  agents.a1 = 'running'
  await $.tool.call({ tool: 'Bash', tool_use_id: 's9', agentId: 'a1', command: 'git status' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h9', agentId: 'a1', message: `Painted. ${'Every patch is gone. '.repeat(30)}` } as never)
  await ends('a1', `Painted. ${'Every patch is gone. '.repeat(30)}`, 6)
  await clock.advance(6000)
  expect(await lines()).toEqual([])
})
