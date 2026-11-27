// Memory files in the mod's tabs, and Config's Memory

test('a memory path in a reply opens in a tab of the mod on the desktop, never the app file pane; the terminal keeps its own', async ($, on) => {
  const { files, tabs } = world(on)
  files.set(`${MEMORY}/words/chat-1.md`, `# Launch video\n\nSee also ${MEMORY}/streams/launch.md.\n`)
  files.set(`${MEMORY}/streams/launch.md`, '# Launch\n\nThe brief.\n')
  await $.session.start(start)
  const MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'm1' } as const
  const said = `Its account is in \`${MEMORY}/words/chat-1.md\`, and [the brief](${MEMORY}/streams/launch.md); the repo is /repo/x.md. **${MEMORY}/index.md** at ${MEMORY}/log.md:12, run \`cat ${MEMORY}/log.md\`.\n\n\`\`\`\ncat ${MEMORY}/log.md\n\`\`\``

  // The terminal draws the reply as the engine does
  const plain = await $.ui.mount({ ...MSG, props: { text: said, isFirstOfReply: true }, surface: 'terminal' } as never)
  expect(await plain.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  const reply = await $.ui.mount({ ...MSG, props: { text: said, isFirstOfReply: true }, surface: 'desktop' } as never)
  const drawn = await reply.find({ type: 'Markdown' })
  const words = `file://${MEMORY}/words/chat-1.md`
  expect(drawn?.props.text).toContain(`[\`${MEMORY}/words/chat-1.md\`](${words})`)
  expect(drawn?.props.text).toContain(`[the brief](file://${MEMORY}/streams/launch.md)`)
  // Other paths and a fenced block stay as written
  expect(drawn?.props.text).toContain('the repo is /repo/x.md.')
  expect(drawn?.props.text).toContain(`cat ${MEMORY}/log.md\n`)
  // Bold keeps its marks, a line number is not the file's, and code holding more than a path stays code
  expect(drawn?.props.text).toContain(`**[${MEMORY}/index.md](file://${MEMORY}/index.md)**`)
  expect(drawn?.props.text).toContain(`[${MEMORY}/log.md:12](file://${MEMORY}/log.md),`)
  expect(drawn?.props.text).toContain(`run \`cat ${MEMORY}/log.md\`.`)
  expect(drawn?.props.pressableLinks).toEqual([words, `file://${MEMORY}/streams/launch.md`, `file://${MEMORY}/index.md`, `file://${MEMORY}/log.md`])
  // A reply whose only memory path is in code is the engine's
  const coded = await $.ui.mount({ ...MSG, requestId: 'm3', props: { text: `\`\`\`\ncat ${MEMORY}/log.md\n\`\`\``, isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await coded.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // A reply with no memory path is the engine's
  const other = await $.ui.mount({ ...MSG, requestId: 'm2', props: { text: 'See /repo/x.md', isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await other.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // Pressed, the file opens in a tab of its own named after its heading, and a memory link in it opens there too
  await reply.press({ key: String(drawn?.key), link: { href: words } })
  const opened = await until(async () => tabs.find(tab => tab.startsWith('memory-words-chat-1-md-')))
  expect(opened).toMatch(/^memory-words-chat-1-md-\d+: Launch video$/)
  const tab = await $.ui.mount({ ...LIST, requestId: (opened ?? '').split(':')[0], surface: 'desktop' } as never)
  const text = await tab.find({ type: 'Markdown' })
  expect(text?.props.text).toContain('# Launch video')
  expect(text?.props.text).toContain(`[${MEMORY}/streams/launch.md](file://${MEMORY}/streams/launch.md).`)
  await tab.press({ key: String(text?.key), link: { href: `file://${MEMORY}/streams/launch.md` } })
  expect(await until(async () => tabs.find(one => /^memory-streams-launch-md-\d+: Launch$/.test(one)))).toBeDefined()
})

test("Memory is in Config, not at the panel's top: its Open opens the memory folder in Finder, and in the terminal as a tab of the panel", async ($, on) => {
  const { shown, tabs } = world(on)
  await $.session.start(start)
  const panel = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await panel.findAll({ type: 'Button' })).some(one => one.props.label === 'Memory')).toBe(false)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Memory' })).toBeDefined()
  expect((await keyed(config, 'config-memory-open'))?.props.label).toBe('Open')
  await pressed(config, 'config-memory-open')
  expect(await until(async () => shown.find(argv => argv[1] === MEMORY))).toEqual(['open', MEMORY])
  const terminal = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 80 }, surface: 'terminal' } as never)
  await pressed(terminal, 'config-memory-open')
  expect(await until(async () => tabs.find(tab => /^memory-.*: Memory$/.test(tab)))).toBeDefined()
})

test('every chat starts the catch-up a minute after it loads and every ten minutes, with memory and its chat records only, never the other Macs; and the tidy of what tasks left two minutes after it loads, every ten minutes and as a task stops', async ($, on) => {
  const { files, own, clock } = world(on)
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  await $.session.start(start)
  const runs = () => own.filter(one => String(one[5] ?? '').endsWith('/bin/catch-up'))
  const tidies = () => own.filter(one => String(one[5] ?? '').endsWith('/bin/tidy'))
  expect(runs()).toHaveLength(0)
  await clock.advance(61_000)
  expect(runs()).toHaveLength(1)
  expect(runs()[0]?.slice(6)).toEqual([MEMORY, `${HOME}/.claude/projects`])
  expect(tidies()).toHaveLength(0)
  await clock.advance(60_000)
  expect(tidies().map(one => one.slice(6))).toEqual([[MEMORY]])
  await clock.advance(9 * 60_000)
  expect(runs()).toHaveLength(2)
  expect(tidies()).toHaveLength(2)
  // A task that stops starts it again, at once (bin/tidy keeps its own pause); a helper's stop does not
  await $.prompt.submit({ text: 'shoot the pages', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Shoot the pages', prompt: 'shoot' } as never)
  await $.agent.spawn({ ...spawn, description: 'Shoot the footer', prompt: 'footer', parentAgentId: 'a1' } as never)
  const stop = (id: string) => $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [] } as never)
  await stop('a2')
  expect(tidies()).toHaveLength(2)
  await stop('a1')
  expect(tidies().map(one => one.slice(6))).toEqual([[MEMORY], [MEMORY], [MEMORY]])
})

// On Windows a memory path is from the drive, C:/Users/..., which a file link writes as file:///C:/Users/...; and the catch-up starts
// apart from the chat by PowerShell, as the watcher does, while nothing tidies what tasks left there
test('on a Windows PC a memory path in a reply is a file:/// link that opens in a tab of the mod, and the catch-up starts apart by PowerShell with the chat records of the profile', async ($, on) => {
  const pc = windowsPC(on)
  const { files, tabs, clock, windowsRuns } = world(pc.on, { windows: true })
  files.set(`${WINDOWS_MEMORY}/words/chat-1.md`, '# Launch video\n')
  await $.session.start(start)
  const MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'm1' } as const
  const reply = await $.ui.mount({ ...MSG, props: { text: `Its account is in ${WINDOWS_MEMORY}/words/chat-1.md.`, isFirstOfReply: true }, surface: 'desktop' } as never)
  const drawn = await reply.find({ type: 'Markdown' })
  const href = `file:///${WINDOWS_MEMORY}/words/chat-1.md`
  expect(drawn?.props.text).toBe(`Its account is in [${WINDOWS_MEMORY}/words/chat-1.md](${href}).`)
  expect(drawn?.props.pressableLinks).toEqual([href])
  await reply.press({ key: String(drawn?.key), link: { href } })
  expect(await until(async () => tabs.find(tab => /^memory-words-chat-1-md-\d+: Launch video$/.test(tab)))).toBeDefined()
  await reply.unmount()
  // A minute on, the catch-up, its words in the environment of a hidden window of Git's bash, never a shell of the engine's own
  await clock.advance(61_000)
  const started = pc.runs.filter(run => String(run.env.CLAUDOPUS_RUN ?? '').includes('/bin/catch-up'))
  expect(started).toHaveLength(1)
  expect(started[0]?.argv.join(' ')).toContain('Start-Process -WindowStyle Hidden')
  expect(started[0]?.env.CLAUDOPUS_RUN).toContain(`set -- '${WINDOWS_MEMORY}' '${PLUGIN}/bin/catch-up' '${WINDOWS_MEMORY}' 'C:/Users/sam/.claude/projects';`)
  expect(started[0]?.env.CLAUDOPUS_RUN).toMatch(/exec nice -n 10 "\$@" >> "\$l" 2>&1 < \/dev\/null$/)
  expect(windowsRuns.filter(argv => argv.join(' ').includes('POSIX::setsid'))).toEqual([])
})
