// Task colours and links at the end of chat replies, each a switch in Config

test("with Task colours on in Config, a reply about a task sits in its colour's box with its name, Reply and its links, its card gets the same dot and its Details its links; off, only the links stay, and Links at the end off takes them away", async ($, on) => {
  const PR = 'https://github.com/acme/heads/pull/7'
  const said = `The nose is fixed and merged: ${PR}`
  // The chat's transcript as the app keeps it: the task is the chat's first, a1
  const talk: unknown[] = [
    { role: 'user', text: 'Fix the nose on head A', toolUses: [] },
    { role: 'assistant', text: 'Starting a task for the nose.', uuid: 'r0', toolUses: [{ tool_use_id: 'launch', tool: 'Agent', input: { description: 'Fix the nose' }, agentId: 'a1' }] },
    { role: 'user', text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n</task-notification>', toolUses: [] },
    { role: 'assistant', text: said, uuid: 'r1', toolUses: [] },
    { role: 'user', text: 'What is the weather like?', toolUses: [] },
    { role: 'assistant', text: 'I cannot see the weather from here.', uuid: 'r2', toolUses: [] },
  ]
  const { files, tabs } = world(on, { talk })
  ownSet(files, 'config.json', JSON.stringify({ taskColours: true }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'Fix the nose on head A', wait: false, origin: composer })
  const r = (await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A' } as never)) as { agentId: string }
  expect(r.agentId).toBe('a1')
  const MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'r1', props: { text: said, isFirstOfReply: true } } as const

  for (const surface of ['desktop', 'terminal'] as const) {
    const reply = await $.ui.mount({ ...MSG, surface } as never)
    expect(await until(async () => reply.find({ type: 'Text', text: 'Fix the nose' }))).toBeDefined()
    expect((await reply.find({ type: 'Text', text: '● ' }))?.props.color).toMatch(/^#[0-9A-F]{6}$/)
    expect(await reply.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
    expect(await reply.find({ type: 'Text', text: 'Links' })).toBeDefined()
    expect((await reply.findAll({ type: 'Markdown' })).map(one => one.props.text)).toContain(`- **GitHub** · [The nose is fixed and merged](${PR})`)
    expect(await keyed(reply, `task-reply-${r.agentId}`)).toBeDefined()
    // A reply about no task gets no box
    const plain = await $.ui.mount({ ...MSG, requestId: 'r2', props: { text: 'I cannot see the weather from here.', isFirstOfReply: true }, surface } as never)
    expect(await plain.find({ type: 'Text', text: /●/ })).toBeUndefined()
  }
  // Its name opens its Details, which lists its links; its card leads with the same colour
  const reply = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  const colour = (await until(async () => reply.find({ type: 'Text', text: '● ' })))?.props.color
  await pressed(reply, `task-open-${r.agentId}`)
  expect(await until(async () => tabs.find(tab => tab.startsWith(`work-${r.agentId}:`)))).toBeDefined()
  const details = await $.ui.mount({ ...LIST, requestId: `work-${r.agentId}`, surface: 'desktop' } as never)
  expect(await until(async () => details.find({ type: 'Text', text: 'Links' }))).toBeDefined()
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const dotOf = async () => (await list.findAll({ type: 'Text', text: '● ' })).find(one => one.props.color === colour)
  expect(await until(dotOf)).toBeDefined()

  // Task colours off in Config: the box and the dot go, the links stay
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Task colours' })).toBeDefined()
  expect(await config.find({ type: 'Text', text: 'Links at the end' })).toBeDefined()
  await pressed(config, 'config-taskColours-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({})
  const uncoloured = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  expect(await until(async () => ((await uncoloured.find({ type: 'Text', text: /●/ })) ? undefined : true))).toBe(true)
  expect(await uncoloured.find({ type: 'Text', text: 'Links' })).toBeDefined()
  expect(await dotOf()).toBeUndefined()

  // Links at the end off: the reply is the engine's alone
  await pressed(config, 'config-replyLinks-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ replyLinks: false })
  const bare = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  expect(await until(async () => ((await bare.find({ type: 'Text', text: 'Links' })) ? undefined : true))).toBe(true)
  expect(await bare.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
})
