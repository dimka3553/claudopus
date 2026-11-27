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

test('each chat beats for the watcher that brings Claudopus back, naming its process, the key its copy has in the settings, the settings file and its load, and starts the watcher', async ($, on) => {
  const { files, clock } = world(on)
  // This copy is loaded from a marketplace that is a folder on this Mac, as Claudopus's own checkout: its key is that marketplace's
  files.set(`${HOME}/.claude/plugins/known_marketplaces.json`, JSON.stringify({ other: { installLocation: '/elsewhere' }, mine: { installLocation: PLUGIN.replace(/\/mods\/claudopus$/, '') } }))
  await $.session.start(start)
  const beat = `${MEMORY}/keep/engine-id.beat`
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

// On Windows the chat's process is a Windows process, which Git's shells never name ($PPID there is 1) and Git's ps never sees: its
// number is the parent of a PowerShell the engine starts, whether one runs is tasklist's, and the watcher starts apart by PowerShell
const ENGINE_PARENT = /Win32_Process -Filter \('ProcessId=' \+ \$PID\)\)\.ParentProcessId/
test('on a Windows PC the beat names the engine by its Windows process, and the watcher starts apart from the chat by PowerShell', async ($, on) => {
  const pc = windowsPC(on, run => (ENGINE_PARENT.test(run.argv.join(' ')) ? '6120\r\n' : undefined))
  const { files, windowsRuns } = world(pc.on, { windows: true })
  await $.session.start(start)
  const [first] = (files.get(`${WINDOWS_MEMORY}/keep/engine-id.beat`) ?? '').split('\n')
  expect(first).toBe('6120\tclaudopus@inline\tC:/Users/sam/.claude/settings.json')
  // Started by Start-Process in a hidden window of Git's bash, its words in the environment, never by a shell of the engine's own
  const started = pc.runs.find(run => run.argv.join(' ').includes('Start-Process -WindowStyle Hidden'))
  expect(started?.env.CLAUDOPUS_BASH).toBe('C:/Program Files/Git/bin/bash.exe')
  expect(started?.env.CLAUDOPUS_RUN).toBe(`unset IFS; set +f; set -- '${PLUGIN}/bin/revive' '${WINDOWS_MEMORY}'; exec "$1" "$2" >/dev/null 2>&1 </dev/null`)
  expect(started?.argv.join(' ')).not.toContain('"')
  expect(windowsRuns.filter(argv => argv.join(' ').includes('POSIX::setsid'))).toEqual([])
  expect(files.get(`${WINDOWS_MEMORY}/log.md`)).not.toContain('was not started')
})

test("on a Windows PC a chat that is not open whose engine is gone lists its tasks as Interrupted, as tasklist says; one whose engine runs lists none", SLOW, async ($, on) => {
  const at = KEEP_NOW - 600_000
  const pc = windowsPC(on, run =>
    ENGINE_PARENT.test(run.argv.join(' ')) ? '6120\r\n' : /^tasklist/i.test(run.argv[0] ?? '') ? '"claude.exe","6120","Console","1","300,000 K"\r\n"claude.exe","700","Console","1","250,000 K"\r\n' : undefined,
  )
  const { files, clock } = world(pc.on, { windows: true })
  const task = (id: string, title: string) => ({ id, title, state: 'working', note: '', transcript: '', card: { id, parentId: '', isFork: false, tokens: 0, title, words: '', items: [], entries: [], answer: '', startedAt: at, endedAt: 0, status: 'working' } })
  const ledger = (chat: string, pid: string, title: string, tasks: object[]) => files.set(`${WINDOWS_MEMORY}/ledger/${chat}.json`, JSON.stringify({ chat, title, folder: 'C:/repo', pid, savedAt: at, link: { bridge: '', app: `local_${chat}` }, tasks }))
  ledger('chat-b', '3131', 'Billing', [task('b1', 'Send the invoices')])
  ledger('chat-c', '700', 'Rig', [task('c1', 'Train the splats')])
  await $.session.start(start)
  await clock.advance(5_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: '⏸ Interrupted · The app closed while it worked' }))).toBeDefined()
  const said = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(said).toContain('Send the invoices')
  expect(said.some(text => /Train the splats/.test(text))).toBe(false)
  expect(pc.runs.some(run => /^tasklist/i.test(run.argv[0] ?? ''))).toBe(true)
  await list.unmount()
})
