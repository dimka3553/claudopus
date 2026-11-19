// Work that stops moving: its card is flagged and the chat told once, and nothing starts it again; the one rule against stopping
// early; a long step shows on its row, and the log stays plain text

// A task's card as the chat keeps it
const stuckCard = (files: Map<string, string>, id = 'a1') => ((JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards ?? []) as Record<string, unknown>[]).find(one => one.id === id) ?? {}

test('work that gets nothing new back for 12 minutes is flagged on its card and told to the chat once, and nothing starts it again; news clears it, and a wait that only prints a new number is no news', SLOW, async ($, on) => {
  const { keep, settle, clock, held, logged, resumed, appended, files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'One merger for all pushes', prompt: 'one merger' } as never)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  const isFlagged = () => typeof stuckCard(files).stuckAt === 'number'
  const told = () => appended.filter(line => line.startsWith('undefined: ')).map(line => line.slice(11)).filter(line => line.includes('Nothing new from "One merger for all pushes"'))

  // It waits on a start signal nobody gives: nothing comes back to it
  await bash('a1', 'git log', 'p1')
  await clock.advance(11 * 60_000)
  expect(isFlagged()).toBe(false)
  await clock.advance(2 * 60_000)
  expect(await until(async () => isFlagged() || undefined)).toBe(true)
  // Said to the chat's model alone, once: the chat shows nothing of a task's but its own words (18 Nov)
  expect(logged.filter(line => line.includes('Nothing new from'))).toEqual([])
  expect(told()).toHaveLength(1)
  expect(told()[0]).toMatch(/^Nothing new from "One merger for all pushes" for 1[23]m\. /)
  // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
  expect(told()[0]).toContain('Claudopus does nothing more about it: you may send it a message asking what it waits on')
  expect(logged.filter(line => line.includes('you may send it a message'))).toEqual([])
  // Its card stays at work and says nothing in amber of it: amber is only what waits for the person
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.findAll({ type: 'Text' })).filter(one => /Nothing new|stuck/i.test(String(one.text ?? '')) || one.props.color === '#E5A50A').map(one => one.text)).toEqual([])
  await pane.unmount()
  expect(stuckCard(files).status).toBe('working')
  // Looked at again and again, nothing more is said
  await clock.advance(60_000)
  await clock.advance(30 * 60_000)
  expect(told()).toHaveLength(1)

  // Something new comes back: the flag goes at the next look
  void keep(bash('a1', 'hold release', 'b3'))
  const letRelease = await until(async () => held.get('release'))
  letRelease?.('released Thing 0.1.1')
  await clock.advance(25_000)
  expect(await until(async () => !isFlagged() || undefined)).toBe(true)
  // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again, and told again
  void keep(bash('a1', 'hold poll', 'b4'))
  const letPoll = await until(async () => held.get('poll'))
  letPoll?.('released Thing 0.1.7')
  await clock.advance(13 * 60_000)
  expect(await until(async () => isFlagged() || undefined)).toBe(true)
  expect(appended.filter(line => line.startsWith('undefined: ')).filter(line => line.includes('Nothing new from'))).toHaveLength(2)
  // Nothing of Claudopus's started it again or sent it a word, at any point
  expect(resumed).toEqual([])
  expect(appended.filter(line => line.startsWith('a1: '))).toEqual([])
  await settle()
})

test('a helper whose step runs for a minute says what it is doing on its row, with its time, and no longer once the step ends', SLOW, async ($, on) => {
  const { keep, settle, clock, held } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' } as never)
  await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search', description: 'Search the app for how it draws panes' } as never))
  const rows = async () => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
    const r = (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(text => text.startsWith('Searching the app for how it draws panes'))
    await pane.unmount()
    return r
  }
  // In its own words for the command, with no time at first
  await clock.advance(5_000)
  expect(await rows()).toEqual(['Searching the app for how it draws panes'])
  await clock.advance(70_000)
  expect(await rows()).toEqual(['Searching the app for how it draws panes · 1m 15s'])
  const letSearch = await until(async () => held.get('search'))
  letSearch?.('found it')
  await clock.advance(1_000)
  expect(await until(async () => ((await rows()).length ? undefined : true))).toBe(true)
  await settle()
})

test('work with a command of its own running in the background, with a helper at work, asking the person something, or sent a message after a long rest is never flagged, however long nothing comes back; a task beside them with none of those is', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const { keep, settle, clock, logged, appended, held, files } = world(on, { agents, jobs: { output: () => 'uploading the lids\n', wroteAt: () => 0 } })
  await $.session.start(start)
  const begin = async (id: string, title: string) => (await $.agent.spawn({ ...spawn, description: title, prompt: title } as never), (agents[id] = 'running'))
  await begin('a1', 'Draw the ears')
  // Its first run, moving all along, takes longer than the stuck check waits; then it hands in its result and rests
  for (const part of ['left ear', 'right ear', 'lobes']) {
    await clock.advance(5 * 60_000)
    void keep($.tool.call({ tool: 'Bash', tool_use_id: `e-${part}`, agentId: 'a1', command: `hold ${part}` } as never))
    const letGo = await until(async () => held.get(part))
    letGo?.(`drew the ${part}`)
  }
  expect(stuckCard(files).stuckAt).toBeUndefined()
  const handsIn = async (message: string, turnId: string) => {
    await $.tool.call({ tool: 'SubagentHandback', tool_use_id: `h-${turnId}`, agentId: 'a1', message } as never)
    agents.a1 = 'completed'
    await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: 'a1' } as never)
  }
  await handsIn('The ears are drawn.', 't1')
  await clock.advance(30 * 60_000)
  // Sent a message after its rest, it is at work again, and not stuck at once for the time it rested
  agents.a1 = 'running'
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } } as never)
  await clock.advance(25_000)
  expect(stuckCard(files)).toMatchObject({ status: 'working' })
  expect(stuckCard(files).stuckAt).toBeUndefined()
  await handsIn('The ears are bigger.', 't1b')
  // a2 waits on its own upload in the background, a3 on its helper, a4 on the person; a5 on nothing
  for (const [n, title] of ['Upload the lids', 'Draw the lids', 'Release it', 'Sort the frames'].entries()) await begin(`a${n + 2}`, title)
  for (const id of ['a2', 'a3', 'a4', 'a5']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'u1', agentId: 'a2', command: 'hold upload', description: 'Upload the lids', run_in_background: true } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a3', resume: { agentId: 'h3' } } as never)
  agents.h3 = 'running'
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(13 * 60_000)
  expect(await until(async () => typeof stuckCard(files, 'a5').stuckAt === 'number' || undefined)).toBe(true)
  await clock.advance(30 * 60_000)
  expect(Object.fromEntries(['a1', 'a2', 'a3', 'a4'].map(id => [id, stuckCard(files, id).stuckAt]))).toEqual({ a1: undefined, a2: undefined, a3: undefined, a4: undefined })
  expect(appended.filter(line => line.includes('Nothing new from')).map(line => /Nothing new from "([^"]+)"/.exec(line)?.[1])).toEqual(['Sort the frames'])
  expect(logged.filter(line => line.includes('Nothing new from'))).toEqual([])
  held.get('upload')?.('done')
  await settle()
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

test("a task may not stop with to-dos open, nothing of its own running and nothing waiting for the person: its stop is refused every time, naming them, with no count kept on its card; with a command of its own in the background, a helper at work or a question open, or where Claude Code says the stop follows a refused one, it stops; a server left for the person holds nothing; its result is refused every time while a to-do is open, and goes through once each is ticked or dropped (18 Nov: detached pictures failed at once, its long word of how far it had got was kept as its result, and nothing went on for three and a half hours)", SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock, resumed, appended, files } = world(on, { agents, jobs: { output: () => '', wroteAt: () => 0 } })
  // (Claude Code's own answer to its stop hook)
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Rebuild the head model', prompt: 'rebuild' } as never)
  agents.a1 = 'running'
  let n = 0
  const call = async (tool: string, input: object) => (await $.tool.call({ tool, tool_use_id: `c${(n += 1)}`, agentId: 'a1', ...input } as never)) as { deny?: string }
  // (a command sent to the background, by the task id the engine gives it)
  const sends = async (command: string, description: string) => (await call('Bash', { command, description, run_in_background: true }), `bg-c${n}`)
  const todo = (item: string, state?: string) => call('mcp__claudopus__todo', { item, ...(state ? { state } : {}) })
  for (const item of ['Fit every scan', 'Draw new beside old', 'Second look', 'Check the licences']) await todo(item)
  await todo('Fit every scan', 'done')
  // (as it stops, Claude Code says what of its background work is still in flight)
  const stop = async (more: { background_tasks?: { id: string }[]; stop_hook_active?: boolean } = {}) => ((await ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [], ...more })) ?? {}).block
  const STILL = 'You may not stop here: 3 to-dos are still open ("Draw new beside old"; "Second look"; "Check the licences"), nothing of yours is running and nothing waits for '
  const kept = (await stop()) ?? ''
  expect(kept.slice(0, STILL.length)).toBe(STILL)
  expect(kept).toContain('or hand in your result with SubagentHandback after dropping what will not be done')
  // Every time, however often and with calls of its own between: nothing counts how often it was kept, on its card or anywhere
  const again: boolean[] = []
  for (let k = 0; k < 8; k++) (k % 2 && (await call('Bash', { command: 'tail -n 5 pic.log' })), again.push(((await stop()) ?? '').startsWith(STILL)))
  expect(again).toEqual(again.map(() => true))
  expect(Object.keys(stuckCard(files)).filter(key => /^(keptOn|carryOn|toldOpen|notDone|leftOpen)$/.test(key))).toEqual([])
  // Claude Code's own word that this stop follows a refused one lets it stop, so it is never asked twice in a row
  expect(await stop({ stop_hook_active: true })).toBeUndefined()
  // What lets it stop, each in turn, and kept again once that is gone
  const said: Record<string, unknown> = {}
  const isKept = async () => ((await stop()) ?? '').startsWith('You may not stop here')
  const render = await sends('hold render', 'Render the heads')
  said['a command of its own in the background'] = await stop({ background_tasks: [{ id: render }] })
  await call('TaskStop', { task_id: render })
  said['kept, its command stopped'] = await isKept()
  // (a server never ends by itself: it is left for the person, and the task has nothing to wait for)
  const server = await sends('npx vite preview --port 4174', 'Serve the preview of the heads')
  said['kept, only a server running'] = ((await stop({ background_tasks: [{ id: server }] })) ?? '').startsWith('You may not stop here')
  await $.agent.spawn({ ...spawn, description: 'Draw the heads', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a2 = 'running'
  said['a helper at work'] = await stop({ background_tasks: [{ id: server }] })
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  said['kept, its helper ended'] = await until(async () => ((await stop({ background_tasks: [{ id: server }] })) ?? '').startsWith('You may not stop here') || undefined)
  await call('mcp__claudopus__ask', { text: 'Which licence may the heads carry?', choices: ['Open', 'Ours'] })
  said['a question open for the person'] = await stop({ background_tasks: [{ id: server }] })
  await call('mcp__claudopus__ask', { text: '' })
  said['kept, its question taken back'] = ((await stop({ background_tasks: [{ id: server }] })) ?? '').startsWith('You may not stop here')
  expect(said).toEqual({
    'a command of its own in the background': undefined,
    'kept, its command stopped': true,
    'kept, only a server running': true,
    'a helper at work': undefined,
    'kept, its helper ended': true,
    'a question open for the person': undefined,
    'kept, its question taken back': true,
  })
  // Kept, nothing of Claudopus's starts it again or writes to it
  await clock.advance(6000)
  expect(resumed).toEqual([])
  // Its result with to-dos open is refused, naming them, every time it is sent; with one left, for the one left
  const REPORT = `The new model is nearer on unseen heads.${' Each head kept aside is closer behind the ear.'.repeat(12)}`
  const handback = async () => (await call('SubagentHandback', { message: REPORT })).deny
  expect(await handback()).toContain('Not handed in: 3 to-dos are still open: "Draw new beside old"; "Second look"; "Check the licences".')
  await todo('Draw new beside old', 'done')
  await todo('Check the licences', 'done')
  const ONE = 'Not handed in: a to-do is still open: "Second look".'
  expect([await handback(), await handback(), await handback(), await handback()].map(deny => deny?.slice(0, ONE.length))).toEqual([ONE, ONE, ONE, ONE])
  // One to-do open is said as one, as its stop is refused
  expect(await stop({ background_tasks: [{ id: server }] })).toContain('You may not stop here: a to-do is still open ("Second look")')
  const reports = () => [...files.keys()].filter(path => path.endsWith('/report.md'))
  expect(reports()).toEqual([])
  // Dropped, none is open: it may stop, and its result goes through, as it was written, its card done
  await todo('Second look', 'dropped')
  expect(await stop({ background_tasks: [{ id: server }] })).toBeUndefined()
  expect(await handback()).toBeUndefined()
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  expect(await until(async () => reports().length || undefined)).toBe(1)
  expect(files.get(reports()[0] ?? '')?.startsWith(REPORT)).toBe(true)
  expect(files.get(reports()[0] ?? '')).not.toContain('Not done')
  const done = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => (await done.find({ type: 'Text', text: '✓ Done' })) ?? undefined)).toBeDefined()
  expect((await done.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(text => /^Not done/.test(text))).toEqual([])
  await done.unmount()
  expect(appended.filter(line => /to-dos? not done/.test(line))).toEqual([])
  expect(resumed).toEqual([])
  // Two cards of the morning, read back as the chat loads: one that ended before Claudopus held to-dos to Done, one released on
  // the person's press with its release to-do never ticked. Neither comes back up as not done, and no line says not done (18 Nov,
  // the person's screenshot after the update: both at the top in amber, "Not done · Release it on your press" over "Released")
  const morning = 1_700_000_000_000 - 8 * 3600_000
  const old = (id: string, title: string, items: [string, string][], more: object) => ({ id, parentId: '', title, words: title, items: items.map(([text, state]) => ({ text, state })), entries: [], answer: '', tokens: 1, startedAt: morning - 1800_000, endedAt: morning, status: 'done', model: 'claude-opus-5-5', ...more })
  files.set(`${MEMORY}/finished/engine-id.json`, JSON.stringify([
    old('b1', 'Fix the two tests failing on main', [['See both tests fail', 'done'], ['Fix each at its cause', 'done'], ['Run every test', 'doing'], ['Ask you to release', 'open'], ['Fix the other failures', 'open']], {}),
    old('b2', 'Clear task clutter out of the chat', [['Find each line', 'done'], ['Release it on your press', 'open']], { notDone: ['Release it on your press'], entries: [{ at: morning, kind: 'note', text: 'Released · Claudopus 0.2.192 is out' }] }),
  ]))
  await $.session.start(start)
  const back = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const folded = await until(async () => (await back.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label))))
  expect(await back.find({ type: 'Text', text: /^Fix the two tests|^Clear task clutter/ })).toBeUndefined()
  if (folded) await back.press({ key: String(folded.key) })
  // (under the task of this test, done with its server still running)
  const every = (await back.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  const lines = every.slice(every.indexOf('Fix the two tests failing on main'))
  expect(lines.filter(text => /(2 of 5|1 of 2) to-dos done/.test(text))).toHaveLength(2)
  expect(lines.filter(text => text === '✓ Done')).toHaveLength(2)
  expect(lines.filter(text => text === 'Not done · Release it on your press')).toEqual([])
  await back.unmount()
})
