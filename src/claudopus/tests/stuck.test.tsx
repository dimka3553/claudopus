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
  const stuck = () => look(pane => pane.find({ type: 'Text', text: /^No progress for / }))

  // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
  await bash('a1', 'git log', 'p1')
  await bash('h1', 'git status', 'b1')
  await bash('h2', 'git status', 'b2')
  await clock.advance(11 * 60_000)
  expect(await stuck()).toBeUndefined()
  await clock.advance(2 * 60_000)
  expect((await stuck())?.props.color).toBe('#E5A50A')
  expect((await stuck())?.text).toMatch(/^No progress for 1[23] min\.$/)
  expect(logged.filter(line => line.includes(`"One merger for all pushes" hasn't made progress`))).toHaveLength(1)
  // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
  expect(appended.filter(line => line.includes(`"One merger for all pushes" hasn't made progress`) && line.includes('you may send it a message asking what it waits on'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('you may send it a message'))).toEqual([])
  // Looked at again, nothing more is said
  await clock.advance(60_000)
  expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(1)

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
  expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(2)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toEqual([])
  await settle()
})

test('stuck work the engine no longer runs had stopped partway through: the mod starts it again at once and tells the chat; work that ended its step to wait on helpers that all sit silent is started again to check on them, then to hand back what it has, which then goes through, the silent ones stopped; still stuck, the chat is told plainly; helpers at work, in a long call or a call after another printing only new numbers, are left alone', SLOW, async ($, on) => {
  const agents: Record<string, string> = { a1: 'idle', a2: 'idle', a3: 'running', a4: 'idle', a5: 'running', a6: 'idle', a7: 'running' }
  const kinds: Record<string, string> = Object.fromEntries(Object.keys(agents).map(id => [id, 'general-purpose']))
  const { keep, settle, clock, held, logged, resumed, stopped, appended } = world(on, { agents, kinds, parents: { a3: 'a2', a5: 'a4', a7: 'a6' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fit the video', prompt: 'fit' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a2' } as never)
  await $.agent.spawn({ ...spawn, description: 'Film the town', prompt: 'film' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the town', prompt: 'render', parentAgentId: 'a4' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score the faces', prompt: 'score' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score each frame', prompt: 'frames', parentAgentId: 'a6' } as never)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  for (const id of ['a1', 'a2', 'a3', 'a4', 'a6']) await bash(id, 'git status', `s-${id}`)
  // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints only a new frame number
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r-a5', agentId: 'a5', command: 'hold render', description: 'Render the town (about 2 h)', run_in_background: true } as never)
  let frame = 0
  const frames = async (minutes: number) => {
    for (let at = 0; at < minutes; at += 4) {
      void keep(bash('a7', 'hold frame', `f-${(frame += 1)}`))
      const letFrame = await until(async () => held.get('frame'))
      letFrame?.(`frame ${frame * 100}/9000`)
      await clock.advance(4 * 60_000)
    }
  }
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('"Fit the video" had stopped partway through') && line.includes('restarted it'))).toHaveLength(1)
  expect(logged.filter(line => line.includes(`"Fit the video" hasn't made progress`))).toEqual([])
  // Its step ended, waiting on a helper from which nothing comes: started again to check on it, and the chat told so
  const nudges = (id = 'a2') => resumed.filter(line => line.startsWith(`${id}: From Claudopus:`) && line.includes('helpers'))
  expect(nudges()).toHaveLength(1)
  expect(nudges()[0]).toMatch(/^a2: From Claudopus: nothing new has come back from your helpers for 1[2-6] min while your step had ended: "[^"]+" \(a3\)\. Ask each with SendMessage/)
  expect(logged.filter(line => line.includes(`"Draw the lids" hasn't made progress`) && line.endsWith('Claudopus started it again and asked it to check on them.'))).toHaveLength(1)
  // Until then it may not hand back while its helper runs
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-early', agentId: 'a2', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toContain("Don't hand back your report yet")
  // Stuck again, it is not started a second time: the chat is only told
  await bash('a1', 'git status', 's-a1-again')
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  expect(resumed.every(line => !line.includes('stopped partway through') || line.startsWith('a1: From Claudopus, not'))).toBe(true)
  // Its helper still silent a while after: started again, once, to hand back what it has
  expect(await until(async () => nudges().length === 2 || undefined)).toBe(true)
  expect(nudges()[1]).toContain('hand back your report now with what you have')
  expect(logged.filter(line => line.includes(`"Draw the lids" hasn't made progress`) && line.endsWith('asked it to hand back what it has now.'))).toHaveLength(1)
  // It ends its step again without handing back: no third start, the chat is told plainly it is stuck and may write to it, and the
  // card says so
  await frames(13)
  expect(nudges()).toHaveLength(2)
  expect(await until(async () => logged.find(line => line.startsWith('"Draw the lids" is stuck: nothing new has come back from its helpers')))).toBeDefined()
  expect(appended.filter(line => line.includes('"Draw the lids" is stuck') && line.includes('you may send it a message'))).toHaveLength(1)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.findAll({ type: 'Text' })).map(one => (one as { text?: string }).text).filter(text => text?.startsWith('No progress for') && text.endsWith('and told the chat it is stuck.'))).toHaveLength(1)
  await pane.unmount()
  // Helpers at work are never taken for silent: their tasks are not started again, whatever they print
  expect([nudges('a4'), nudges('a6')]).toEqual([[], []])
  // Told to hand back, it may while its helpers run: the silent one is stopped with its report, one at work never is
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-late', agentId: 'a2', message: 'Lids drawn; rendering never ended.' } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(stopped).toContain('a3')
  expect(stopped.filter(id => id === 'a5' || id === 'a7')).toEqual([])
  held.get('render')?.('done')
  await settle()
})

test('nudges about silent helpers start over when a helper brings something new or the chat writes to the task; the chat asking it to hand back lets its report through', SLOW, async ($, on) => {
  const agents: Record<string, string> = { a1: 'idle', a2: 'running' }
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const { settle, clock, resumed } = world(on, { agents, kinds, parents: { a2: 'a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' } as never)
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  const nudges = () => resumed.filter(line => line.startsWith('a1: From Claudopus:') && line.includes('helpers'))
  await clock.advance(13 * 60_000)
  expect(nudges()).toHaveLength(1)
  // The helper brings something new: the next stretch with nothing is a check-in again, not an order to hand back
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n-a2', agentId: 'a2', command: 'ls' } as never)
  await clock.advance(26 * 60_000)
  expect(await until(async () => nudges().length === 2 || undefined)).toBe(true)
  expect(nudges()[1]).toContain('Ask each with SendMessage')
  // The chat writes to it: the count starts over too, and its words asking it to hand back let the report through at once
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Hand back what you have now.' } as never)
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toBeUndefined()
  await settle()
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
    const r = await pane.find({ type: 'Text', text: /^No progress for / })
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
  expect(logged.filter(line => line.includes("hasn't made progress"))).toEqual([])
  await settle()
})

test('work asking the person something waits on them and is never flagged', SLOW, async ($, on) => {
  const { clock, logged } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(30 * 60_000)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: /^No progress for / })).toBeUndefined()
  expect(logged.filter(line => line.includes("hasn't made progress"))).toHaveLength(0)
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
