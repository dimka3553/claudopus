// Memory files in the mod's tabs, and the Memory button

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

test('Memory, beside Stats, opens the memory folder in Finder', async ($, on) => {
  const { shown } = world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'memory-open'))?.props.label).toBe('Memory')
  await pressed(pane, 'memory-open')
  expect(await until(async () => shown.find(argv => argv[1] === MEMORY))).toEqual(['open', MEMORY])
})
