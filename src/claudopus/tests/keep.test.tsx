// The chat's process: what is at work is recorded beside it, a card found at work after the process was replaced says the app
// closed while it worked, and the watcher that brings Claudopus back

const KEEP_AT = `${MEMORY}/keep/engine-id`
const KEEP_NOW = 1_700_000_000_000

test("what is at work is recorded with the chat's process that runs it, each task by its title, and is taken out as it ends; no keeper is started, whatever runs the chat", SLOW, async ($, on) => {
  // (a chat run from another Mac, which once started a keeper)
  const { files, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'solve' } as never)
  const kept = () => JSON.parse(files.get(`${KEEP_AT}.json`) ?? '{}') as { ids?: string[]; titles?: Record<string, string>; pid?: string }
  expect(await until(async () => (kept().ids?.length ? kept() : undefined))).toMatchObject({ ids: ['a1'], titles: { a1: 'Solve the cameras' }, pid: '4242' })
  // It hands in its result: nothing is at work
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Solved: all 158 frames placed, and the report is written with every number.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(21_000)
  expect(await until(async () => (kept().ids?.length === 0 ? kept() : undefined))).toMatchObject({ ids: [], pid: '4242' })
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

test('a card that was at work when the chat\'s process was replaced, as when the app quits or drops the chat, is failed with "The app closed while it worked" and offers Start again, a task this process has no card for under the title the last process kept; nothing is started again, what Claude Code itself runs again stays at work, and a reload in the same process fails nothing', SLOW, async ($, on) => {
  // a8 is run again by Claude Code itself in the new process
  const { files, clock, resumed, appended, submitted } = world(on, { agents: { a8: 'running' } })
  const lastProcess = (pid: string) => files.set(`${KEEP_AT}.json`, JSON.stringify({ ids: ['a7', 'a8', 'a9'], titles: { a7: 'Solve the cameras', a8: 'Train the splats' }, pid, at: KEEP_NOW - 600_000 }))
  const shown = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const texts = (await pane.findAll({ type: 'Text' })).map(one => ({ text: String(one.text ?? ''), color: one.props.color }))
    const buttons = (await pane.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
    await pane.unmount()
    return { failed: texts.filter(one => one.text.startsWith('✕ Failed')), titles: texts.filter(one => /^(Solve the cameras|Train the splats)$/.test(one.text)).map(one => one.text), again: buttons.filter(label => label === 'Start again').length }
  }
  // The same process wrote it: a reload of the mod, which ends nothing
  lastProcess('4242')
  await $.session.start(start)
  await clock.advance(31_000)
  expect(await shown()).toEqual({ failed: [], titles: [], again: 0 })
  // Another process wrote it and is gone: its work ended with it
  lastProcess('3131')
  await $.session.start(start)
  const now = await until(async () => ((await shown()).failed.length ? await shown() : undefined))
  expect(now?.failed.map(one => one.text)).toEqual(['✕ Failed · The app closed while it worked'])
  expect(now?.titles).toEqual(['Solve the cameras'])
  expect(now?.again).toBe(1)
  expect(files.get(`${MEMORY}/log.md`)).toContain("the chat's process was replaced (3131 to 4242) while work was at work: a7 ended with it")
  // Nothing starts it again by itself, at the moment the old keeper took or later, and the chat is told to start nothing
  await clock.advance(31_000)
  await clock.advance(60_000)
  expect(resumed).toEqual([])
  expect([...appended, ...submitted].filter(line => /again|cut off|process was ended/.test(line))).toEqual([])
  // Loaded again in this process, the card is as it was: failed once, never a second card
  await $.session.start(start)
  await clock.advance(31_000)
  expect((await shown()).failed.map(one => one.text)).toEqual(['✕ Failed · The app closed while it worked'])
  expect(resumed).toEqual([])
})
