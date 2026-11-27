// The chat's process: what is at work is recorded beside it, a card found at work after the process was replaced says the app
// closed while it worked, and the watcher that brings Claudopus back

const LEDGER = `${MEMORY}/ledger/engine-id`
const KEEP_NOW = 1_700_000_000_000

test("every task is written to the chat's ledger as it changes, with the chat's folder and process: its title, state, to-dos, last note, worktree and branch, the instructions it was started with and its saved transcript; a delivered task stays in it until it is marked done; no keeper is started, whatever runs the chat", SLOW, async ($, on) => {
  // (a chat run from another Mac, which once started a keeper)
  const { files, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'Solve the cameras with the new rig: Sam wants all 158 frames placed.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Place the frames', state: 'doing' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am placing frame 40 of 158.' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'w1', agentId: 'a1', command: 'cd /work/rig && git worktree add -b cams ../rig-cams origin/main' } as never)
  type Kept = { chat?: string; folder?: string; pid?: string; tasks?: { id: string; title: string; state: string; note: string; transcript: string; card: { items: { text: string }[]; worktree?: string; branch?: string } }[] }
  const kept = () => JSON.parse(files.get(`${LEDGER}.json`) ?? '{}') as Kept
  const task = await until(async () => kept().tasks?.find(one => one.id === 'a1'))
  expect([kept().chat, kept().folder, kept().pid]).toEqual(['engine-id', '/repo', '4242'])
  expect(task).toMatchObject({ title: 'Solve the cameras', state: 'working', note: 'I am placing frame 40 of 158.', transcript: `${HOME}/.claude/projects/-repo/engine-id/subagents/agent-a1.jsonl`, card: { items: [{ text: 'Place the frames' }], worktree: '/work/rig-cams', branch: 'cams' } })
  // (the instructions as the chat wrote them, before the rules every task is given)
  expect(files.get(`${LEDGER}/a1.brief.md`)).toBe('Solve the cameras with the new rig: Sam wants all 158 frames placed.')
  // It hands in its result, its to-do ticked: delivered, and still in the ledger for the person to look at
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd2', agentId: 'a1', item: 'Place the frames', state: 'done' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Solved: all 158 frames placed, and the report is written with every number.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(21_000)
  expect(await until(async () => kept().tasks?.find(one => one.id === 'a1' && one.state === 'delivered'))).toBeDefined()
  expect(files.get(`${MEMORY}/log.md`) ?? '').not.toContain('keeper')
  expect([...files.keys()].filter(path => /\/keep\/engine-id\.(state|handover)$/.test(path))).toEqual([])
})

test('each chat beats for the watcher that brings Claudopus back from the start of its load, naming its process, the key its copy has in the settings, the settings file and its load, and starts the watcher', async ($, on) => {
  const { files, clock } = world(on)
  // This copy is loaded from a marketplace that is a folder on this Mac, as Claudopus's own checkout: its key is that marketplace's
  files.set(`${HOME}/.claude/plugins/known_marketplaces.json`, JSON.stringify({ other: { installLocation: '/elsewhere' }, mine: { installLocation: PLUGIN.replace(/\/mods\/claudopus$/, '') } }))
  const beat = `${MEMORY}/keep/engine-id.beat`
  // The beat is written before the rest of the start (here, the index a first start writes): a busy Mac took over a minute to reach
  // the end of a start, and the watcher took each fresh load for one switched off and loaded it again (27 Nov)
  files.delete(`${MEMORY}/index.md`)
  await $.session.start(start)
  const order = [...files.keys()]
  expect(order.indexOf(beat)).toBeGreaterThan(-1)
  expect(order.indexOf(beat)).toBeLessThan(order.indexOf(`${MEMORY}/index.md`))
  // (the load, so the watcher tells a load that beats again after its change, never off, from one that came back)
  // (on a line of its own, so a watcher of an older version still reads the first as before)
  const [first, load, ...rest] = (files.get(beat) ?? '').split('\n')
  expect(first).toBe(`4242\tclaudopus@mine\t${HOME}/.claude/settings.json`)
  expect(load).toMatch(/^\d{15}-[a-z0-9]+$/)
  expect(rest).toEqual([''])
  expect(files.get(`${MEMORY}/log.md`)).not.toContain('was not started')
  files.set(beat, 'old')
  await clock.advance(3_000)
  expect(files.get(beat)).toContain('4242')
})

test("each chat's start gives its tasks the hour's prompt cache in the person's own Claude Code settings, every other key as it was; a value of theirs, or a file that is not a plain JSON object, stays as it is", async ($, on) => {
  const { files } = world(on)
  const settings = `${HOME}/.claude/settings.json`
  const theirs = { model: 'opus', env: { SOME_SETTING: '1' }, permissions: { allow: ['Bash(ls:*)'] }, enabledPlugins: { 'claudopus@claudopus': true }, statusLine: { text: 'café' } }
  files.set(settings, JSON.stringify(theirs))
  await $.session.start(start)
  expect(files.get(settings)).toBe(`${JSON.stringify({ ...theirs, subagentPromptCacheTtl: '1h' }, null, 2)}\n`)
  // (5 minutes chosen by the person, a file cut off half way, a number JavaScript would change, and a list)
  for (const text of [JSON.stringify({ ...theirs, subagentPromptCacheTtl: '5m' }), '{ "model": "opus", ', '{ "id": 12345678901234567 }', '[]']) {
    files.set(settings, text)
    await $.session.start(start)
    expect(files.get(settings)).toBe(text)
  }
  // A Mac with no settings file yet has one with only this
  files.delete(settings)
  await $.session.start(start)
  expect(JSON.parse(files.get(settings) ?? '{}')).toEqual({ subagentPromptCacheTtl: '1h' })
})

test("after the chat's process was replaced, as when the app quits or drops the chat, every task comes back from the ledger: one that was at work, or stopped by no one as the process ended, is Interrupted with Carry on, never done; a question still waits and its answer carries it on; delivered and stopped by the person stay so; what Claude Code runs again stays at work; nothing starts by itself, and a reload in the same process cuts nothing", SLOW, async ($, on) => {
  // a8 is run again by Claude Code itself in the new process
  const { files, clock, resumed, submitted } = world(on, { agents: { a8: 'running' } })
  const at = KEEP_NOW - 600_000
  const card = (id: string, title: string, more: object = {}) => ({ id, parentId: '', isFork: false, tokens: 0, title, words: '', items: [], entries: [], answer: '', startedAt: at - 60_000, endedAt: 0, status: 'working', model: 'claude-opus-5-5', ...more })
  const cards = [
    card('a7', 'Solve the cameras', { items: [{ text: 'Place the frames', state: 'done' }, { text: 'Write the report', state: 'doing' }], entries: [{ at, kind: 'note', text: 'I am writing the report.' }], worktree: '/work/rig-cams', branch: 'cams' }),
    card('a8', 'Train the splats'),
    card('a9', 'Clean the frames', { ask: { text: 'May I delete the 12 old frames?', choices: ['Delete them', 'Keep them'], from: 'a9', at } }),
    card('a5', 'Check the totals', { status: 'done', endedAt: at, up: true, reportAt: at, answer: 'March adds up.' }),
    card('a6', 'Draw the chart', { status: 'stopped', endedAt: at, up: true, byYou: { at } }),
    // (stopped by no one, as the app's quit stops every task, as the process ended)
    card('a4', 'Fit the ears', { status: 'stopped', endedAt: at - 1000, up: true, stoppedUnasked: true }),
  ]
  const lastProcess = (pid: string) => files.set(`${LEDGER}.json`, JSON.stringify({ chat: 'engine-id', title: '', folder: '/repo', pid, savedAt: at, tasks: cards.map(one => ({ id: one.id, title: one.title, state: '', note: '', transcript: '', card: one })) }))
  files.set(`${LEDGER}/a7.brief.md`, 'Solve the cameras with the new rig: all 158 frames placed.')
  const lines = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const texts = (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
    const buttons = (await pane.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
    await pane.unmount()
    return { cut: texts.filter(text => text.startsWith('⏸ Interrupted')).length, said: texts, carry: buttons.filter(label => label === 'Carry on').length, again: buttons.filter(label => label === 'Start again').length }
  }
  // The same process wrote it: a reload of the mod, which ends nothing
  lastProcess('4242')
  await $.session.start(start)
  await clock.advance(31_000)
  expect((await lines()).cut).toBe(0)
  // Another process wrote it and is gone: what was at work ended with it, and each card comes back whole
  lastProcess('3131')
  await $.session.start(start)
  const now = await until(async () => ((await lines()).cut === 2 ? await lines() : undefined))
  // (the one with a note of its own after it says Interrupted alone, so the note has the room)
  expect(now?.said.filter(text => text.startsWith('⏸ Interrupted'))).toEqual(['⏸ Interrupted', '⏸ Interrupted · The app closed while it worked'])
  // (a8, which Claude Code runs again, stays at work)
  expect(now?.said).toEqual(expect.arrayContaining(['Solve the cameras', 'Fit the ears', 'May I delete the 12 old frames?', '◐ Delivered', 'Stopped', '1 waiting for you · 1 working', ' · 1 delivered', ' · 2 interrupted', 'Opus 5.5 · 1 of 2 to-dos done · 11m 31s']))
  expect([now?.carry, now?.again, now?.said.some(text => text.startsWith('✓ Done'))]).toEqual([2, 1, false])
  expect(files.get(`${MEMORY}/log.md`)).toContain("the chat's process was replaced (3131 to 4242) while work was at work: a7, a9, a4 ended with it")
  // Nothing starts it again by itself, and the chat is told to start nothing
  await clock.advance(91_000)
  expect([resumed, submitted.filter(line => /Carry on|again/.test(line))]).toEqual([[], []])
  // Loaded again in this process, the cards are as they were: cut off once, never a second time
  await $.session.start(start)
  await clock.advance(31_000)
  expect((await lines()).cut).toBe(2)

  // Carry on: the chat is asked in the person's name to start a fresh task, told all the ledger holds in a file of its own
  let pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: (await keyed(pane, 'carry-small-a7'))?.key ?? '' })
  const asked = await until(async () => submitted.find(text => text.includes('pressed "Carry on" on "Solve the cameras" (a7)')))
  const carry = `${LEDGER}/a7.carry.md`
  expect(asked).toContain(`subagent_type "claudopus:task", the model it ran on (Opus 5.5), description "Solve the cameras", and as its prompt exactly: Carry on a task the Claude app's close cut off. Read ${carry} first`)
  for (const part of ['Solve the cameras with the new rig: all 158 frames placed.', '- [done] Place the frames', '- [doing] Write the report', 'I am writing the report.', 'Its worktree, yours now: /work/rig-cams on branch cams', `${HOME}/.claude/projects/-repo/engine-id/subagents/agent-a7.jsonl`]) expect(files.get(carry)).toContain(part)
  // The fresh task takes its place: its to-dos and notes, and the cut-off card goes under Finished
  await pane.unmount()
  const fresh = await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: `Carry on a task the Claude app's close cut off. Read ${carry} first.` } as never)
  expect(await until(async () => ((await lines()).cut === 1 ? true : undefined))).toBe(true)
  pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await keyed(pane, `carry-small-a7`)).toBeUndefined()
  expect(await until(async () => pane.find({ type: 'Text', text: /Write the report/ }))).toBeDefined()
  expect(String(fresh.agentId)).not.toBe('a7')

  // The question the other cut-off task asked still waits, and its answer carries it on with that answer
  await pane.press({ key: (await pane.findAll({ type: 'Button' })).find(one => one.props.label === 'Delete them')?.key ?? '' })
  expect(await until(async () => submitted.find(text => text.includes('pressed "Carry on" on "Clean the frames" (a9)')))).toBeDefined()
  expect(files.get(`${LEDGER}/a9.carry.md`)).toContain('To "May I delete the 12 old frames?": Delete them')
  expect(resumed).toEqual([])
  await pane.unmount()
})

test("a task the app stops as it quits, with no Stop of the person's or the chat's, is Interrupted in the next process; one the person stopped stays stopped", SLOW, async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two jobs', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'solve' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the chart', prompt: 'draw' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a2' })
  await pane.unmount()
  // The app quits: it stops every task as the process ends
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  const kept = () => JSON.parse(files.get(`${LEDGER}.json`) ?? '{}') as { pid?: string; tasks?: { id: string; state: string }[] }
  expect(await until(async () => (kept().tasks?.find(one => one.id === 'a1')?.state === 'stopped' ? kept().tasks?.map(one => [one.id, one.state]) : undefined))).toEqual([['a1', 'stopped'], ['a2', 'stopped']])
  // The next process
  files.set(`${LEDGER}.json`, JSON.stringify({ ...kept(), pid: '3131' }))
  await $.session.start(start)
  const read = async () => {
    const view = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const texts = (await view.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
    await view.unmount()
    return texts
  }
  const now = await until(async () => ((await read()).includes('⏸ Interrupted · The app closed while it worked') ? await read() : undefined))
  expect(now?.filter(text => text === '⏸ Interrupted · The app closed while it worked' || text === 'Stopped')).toEqual(['⏸ Interrupted · The app closed while it worked', 'Stopped'])
})

test("a chat of this Mac that is not open and whose process is gone lists the tasks its ledger kept at work as Interrupted under its name, the header counting them; one whose process still runs lists none", SLOW, async ($, on) => {
  const { files, clock } = world(on)
  const at = KEEP_NOW - 600_000
  const task = (id: string, title: string) => ({ id, title, state: 'working', note: '', transcript: '', card: { id, parentId: '', isFork: false, tokens: 0, title, words: '', items: [], entries: [], answer: '', startedAt: at, endedAt: 0, status: 'working' } })
  const ledger = (chat: string, pid: string, title: string, tasks: object[]) => files.set(`${MEMORY}/ledger/${chat}.json`, JSON.stringify({ chat, title, folder: '/repo', pid, savedAt: at, link: { bridge: '', app: `local_${chat}` }, tasks }))
  // (3131 ended with the app; 700 still runs)
  ledger('chat-b', '3131', 'Billing', [task('b1', 'Send the invoices')])
  ledger('chat-c', '700', 'Rig', [task('c1', 'Train the splats')])
  await $.session.start(start)
  await clock.advance(5_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: '⏸ Interrupted · The app closed while it worked' }))).toBeDefined()
  const said = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(said).toEqual(expect.arrayContaining(['Send the invoices', '1 interrupted']))
  expect(said.some(text => /Train the splats/.test(text))).toBe(false)
  // A press opens that chat, where its card has Carry on
  const open = (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Open chat')
  expect(String(open?.key)).toMatch(/^carry-there-/)
  await list.press({ key: String(open?.key) })
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/chat chat-b opened: claude:\/\/code\/continue\?session=local_chat-b/)?.[0])).toBeDefined()
  await list.unmount()
})

test("a chat the app's rewind starts again under a new id has every card of the chat it came from, as a restart finds them: one at work Interrupted with Carry on, told its instructions and its transcript; delivered and finished ones as they ended; the person's words kept; once, and the first chat no longer listed under its own name; a copy of a chat still running takes nothing", SLOW, async ($, on) => {
  const { files, clock } = world(on)
  const at = KEEP_NOW - 600_000
  // The first chat: a task at work, one delivered, the person's words
  files.set('session:id', 'chat-old')
  await $.session.start(start)
  await $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'Solve the cameras with the new rig: all 158 frames placed.' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the totals', prompt: 'check' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a2', message: 'March adds up, and the report is written with every number.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(21_000)
  type Kept = { pid?: string; tasks?: { id: string; state: string }[] }
  const kept = () => JSON.parse(files.get(`${MEMORY}/ledger/chat-old.json`) ?? '{}') as Kept
  expect(await until(async () => (kept().tasks?.some(one => one.id === 'a2' && one.state === 'delivered') ? kept().tasks?.map(one => one.id) : undefined))).toEqual(['a1', 'a2'])
  const ended = { id: 'a3', parentId: '', isFork: false, tokens: 0, title: 'Draw the chart', words: '', items: [], entries: [], answer: '', startedAt: at - 60_000, endedAt: at, status: 'done', closedAt: at }
  files.set(`${MEMORY}/finished/chat-old.json`, JSON.stringify([ended]))
  // The rewind: the app ends that process and starts the chat again in another, as a copy under a new id
  const rewind = (pid: string) => {
    files.set(`${MEMORY}/ledger/chat-old.json`, JSON.stringify({ ...kept(), pid }))
    files.set('session:id', 'engine-id')
    files.set(`${HOME}/.claude/projects/-repo/engine-id.jsonl`, `${JSON.stringify({ type: 'custom-title', customTitle: 'Rig', sessionId: 'engine-id' })}\n${JSON.stringify({ type: 'derived-from', v: 1, sessionId: 'engine-id', sessions: [{ type: 'claude_code_session', id: 'chat-old', via: 'resume' }, { type: 'claude_code_session', id: 'chat-old', via: 'fork' }] })}\n`)
  }
  rewind('3131')
  await $.session.start(start)
  const lines = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const texts = (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
    const buttons = (await pane.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
    await pane.unmount()
    return { texts, buttons }
  }
  const now = await until(async () => ((await lines()).texts.some(text => text.startsWith('⏸ Interrupted')) ? await lines() : undefined))
  expect(now?.texts).toEqual(expect.arrayContaining(['Solve the cameras', 'Check the totals', '◐ Delivered']))
  expect([now?.buttons.filter(label => label === 'Carry on').length, now?.buttons.includes('Open chat')]).toEqual([1, false])
  // (the finished one under Finished, kept with this chat's own)
  await clock.advance(21_000)
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]') as { id: string; title: string }[]).find(one => one.id === 'a3')?.title)).toBe('Draw the chart')
  expect(files.get(`${MEMORY}/words/engine-id.said.md`)).toContain('solve the cameras')
  // Loaded again, nothing is brought over twice
  await $.session.start(start)
  await clock.advance(5_000)
  expect((files.get(`${MEMORY}/words/engine-id.said.md`) ?? '').split('solve the cameras').length).toBe(2)
  expect((await lines()).buttons.filter(label => label === 'Carry on').length).toBe(1)
  // Carry on: the fresh task is told the instructions and the transcript the first chat kept
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: (await keyed(pane, 'carry-small-a1'))?.key ?? '' })
  await pane.unmount()
  const carry = await until(async () => files.get(`${MEMORY}/ledger/engine-id/a1.carry.md`))
  for (const part of ['Solve the cameras with the new rig: all 158 frames placed.', `${HOME}/.claude/projects/-repo/chat-old/subagents/agent-a1.jsonl`]) expect(carry).toContain(part)
})

test("a task no run is behind and Claude Code can't start again, as a rewind kept its card in the same process, ends Interrupted and says it can't be reached, never Working for good: one at work after nothing moved for 12 minutes, with Carry on; a delivered one at once when a message to it can't reach it, under Finished with its result, the message marked as not reached and given to the chat", SLOW, async ($, on) => {
  // (Claude Code has no loop for either and no record of them in this chat's folder)
  const { files, clock, appended } = world(on, { ended: new Set(['a1', 'a2']), unresumable: new Set(['a1', 'a2']) })
  files.set('session:id', 'chat-old')
  await $.session.start(start)
  await $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'Solve the cameras with the new rig.' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the totals', prompt: 'check' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a2', message: 'March adds up, and the report is written with every number.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(21_000)
  type Kept = { pid?: string; tasks?: { id: string; state: string }[] }
  const kept = (chat: string) => JSON.parse(files.get(`${MEMORY}/ledger/${chat}.json`) ?? '{}') as Kept
  expect(await until(async () => (kept('chat-old').tasks?.some(one => one.id === 'a2' && one.state === 'delivered') ? true : undefined))).toBe(true)
  // The rewind, its copy in the same process (4242): what was at work there is kept at work, as nothing says its run ended
  files.set('session:id', 'engine-id')
  files.set(`${HOME}/.claude/projects/-repo/engine-id.jsonl`, `${JSON.stringify({ type: 'derived-from', v: 1, sessionId: 'engine-id', sessions: [{ type: 'claude_code_session', id: 'chat-old', via: 'fork' }] })}\n`)
  await $.session.start(start)
  const texts = async (request = '') => {
    const pane = await $.ui.mount({ ...LIST, ...(request ? { requestId: request } : {}), surface: 'desktop' } as never)
    const all = (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
    await pane.unmount()
    return all
  }
  expect(await until(async () => (kept('engine-id').tasks?.find(one => one.id === 'a1')?.state === 'working' ? true : undefined))).toBe(true)
  // A message to the delivered one can't reach it: its card ends so at once, under Finished with its result, and the chat has the words
  const view = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  const box = await until(async () => (await view.findAll({ type: 'Input' } as never)).find(one => /^details-a2-reply-change-/.test(one.key ?? '')))
  await view.input({ key: box?.key ?? '', text: 'Add April too' })
  await view.unmount()
  const after = await until(async () => ((await texts('work-a2')).some(text => text.includes("Interrupted · Can't be reached any more")) ? await texts('work-a2') : undefined))
  expect(after).toEqual(expect.arrayContaining(['Add April too', "Didn't reach the task · the chat has it", "This task can't be reached any more, so the chat has your messages. Carry on starts a fresh task in its place."]))
  expect(after?.join('\n')).not.toMatch(/not read yet/i)
  expect(after?.some(text => /^You · sent \d\d:\d\d · didn't reach the task$/.test(text))).toBe(true)
  type Ended = { id: string; status: string; answer: string }
  await clock.advance(21_000)
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]') as Ended[]).find(one => one.id === 'a2')?.answer)).toContain('March adds up')
  expect(appended).toContainEqual(expect.stringContaining(`wrote to the task "Check the totals" on its card: “Add April too”. That task can't be reached any more`))
  expect(await until(async () => (kept('engine-id').tasks?.some(one => one.id === 'a2') ? undefined : true))).toBe(true)
  // The one at work, with nothing moving under it, ends so once 12 minutes have passed with nothing new, never before
  await clock.advance(10 * 60_000)
  expect((await texts()).some(text => text.startsWith('⏸ Interrupted'))).toBe(false)
  await clock.advance(3 * 60_000)
  expect(await until(async () => ((await texts()).includes("⏸ Interrupted · Can't be reached any more") ? true : undefined))).toBe(true)
  expect(kept('engine-id').tasks?.find(one => one.id === 'a1')?.state).toBe('interrupted')
})

test("a copy of a chat that still runs in its own process is a chat of its own: it takes none of that chat's cards", SLOW, async ($, on) => {
  const { files, clock } = world(on)
  const card = { id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Send the invoices', words: '', items: [], entries: [], answer: '', startedAt: KEEP_NOW, endedAt: 0, status: 'working' }
  // (700 still runs)
  files.set(`${MEMORY}/ledger/chat-old.json`, JSON.stringify({ chat: 'chat-old', title: '', folder: '/repo', pid: '700', savedAt: KEEP_NOW, tasks: [{ id: 'b1', title: 'Send the invoices', state: 'working', note: '', transcript: '', card }] }))
  files.set(`${HOME}/.claude/projects/-repo/engine-id.jsonl`, `${JSON.stringify({ type: 'derived-from', v: 1, sessionId: 'engine-id', sessions: [{ type: 'claude_code_session', id: 'chat-old', via: 'fork' }] })}\n`)
  await $.session.start(start)
  await clock.advance(5_000)
  expect((files.get(`${MEMORY}/log.md`) ?? '').includes('goes on from')).toBe(false)
  expect(files.has(`${MEMORY}/keep/engine-id.from`)).toBe(false)
})
