// Task colours and links at the end of chat replies, each a switch in Config

test("with Task colours on, as it comes, a reply about a task sits in a box with its colour's dot, its name, Reply and its links, blue with Result where it passes on a result and grey otherwise, its card gets the same dot and its Details its links; off, only the links stay, and Links at the end off takes them away", async ($, on) => {
  const PR = 'https://github.com/acme/heads/pull/7'
  const said = `The nose is fixed and merged: ${PR}`
  // The chat's transcript as the app keeps it: the task is the chat's first, a1
  const ASKED = 'Fix the nose on head A\nThe left nostril is too wide\nKeep the bridge as it is\nMatch the scan\'s tip\nThen show me a picture'
  const talk: unknown[] = [
    { role: 'user', text: ASKED, toolUses: [] },
    { role: 'assistant', text: 'Starting a task for the nose.', uuid: 'r0', toolUses: [{ tool_use_id: 'launch', tool: 'Agent', input: { description: 'Fix the nose' }, agentId: 'a1' }] },
    { role: 'user', text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n</task-notification>', toolUses: [] },
    { role: 'assistant', text: said, uuid: 'r1', toolUses: [] },
    { role: 'user', text: 'What is the weather like?', toolUses: [] },
    { role: 'assistant', text: 'I cannot see the weather from here.', uuid: 'r2', toolUses: [] },
    { role: 'user', text: 'Also make the tip rounder', toolUses: [] },
    { role: 'assistant', text: 'Passing that to the nose task.', uuid: 'r3', toolUses: [{ tool_use_id: 'pass', tool: 'SendMessage', input: { to: 'a1', message: 'Also make the tip rounder' } }] },
    { role: 'user', text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n</task-notification>', toolUses: [] },
    { role: 'assistant', text: 'The tip of the nose is rounder now, and the bridge is as it was.', uuid: 'r4', toolUses: [] },
  ]
  const { files, tabs, clock } = world(on, { talk })
  await $.session.start(start)
    await $.prompt.submit({ text: ASKED, wait: false, origin: composer })
  const r = (await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A' } as never)) as { agentId: string }
  expect(r.agentId).toBe('a1')
  await $.agent.spawn({ ...spawn, description: 'Make the price page', prompt: 'price' } as never)
  const MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'r1', props: { text: said, isFirstOfReply: true } } as const

  for (const surface of ['desktop', 'terminal'] as const) {
    const reply = await $.ui.mount({ ...MSG, surface } as never)
    expect(await until(async () => reply.find({ type: 'Text', text: 'Fix the nose' }))).toBeDefined()
    expect((await reply.find({ type: 'Text', text: '● ' }))?.props.color).toMatch(/^#[0-9A-F]{6}$/)
    expect(await reply.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
    expect(await reply.find({ type: 'Text', text: 'Links' })).toBeDefined()
    expect((await reply.findAll({ type: 'Markdown' })).map(one => one.props.text)).toContain(`- **GitHub** · [The nose is fixed and merged](${PR})`)
    expect(await keyed(reply, `task-reply-${r.agentId}`)).toBeDefined()
    // What you wrote to the task, quoted small under its name: three lines, and View more for the rest
    const quote = await reply.find({ type: 'Text', text: /^“Fix the nose on head A/ })
    expect(quote?.props.size).toBe('footnote')
    expect(quote?.text).toBe('“Fix the nose on head A\nThe left nostril is too wide\nKeep the bridge as it is…”')
    expect((await reply.findAll({ type: 'Button' })).find(one => /^quote-more-/.test(one.key ?? ''))?.props.label).toBe('View more')
    // A reply about no task gets no box
    const plain = await $.ui.mount({ ...MSG, requestId: 'r2', props: { text: 'I cannot see the weather from here.', isFirstOfReply: true }, surface } as never)
    expect(await plain.find({ type: 'Text', text: /●/ })).toBeUndefined()
    await reply.unmount()
    await plain.unmount()
  }
  // Its name opens its Details, which lists its links; its card leads with the same colour
  const reply = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  const colour = (await until(async () => reply.find({ type: 'Text', text: '● ' })))?.props.color
  // A later reply quotes the message it answers, not the one that started the task
  const later = await $.ui.mount({ ...MSG, requestId: 'r4', props: { text: 'The tip of the nose is rounder now, and the bridge is as it was.', isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await until(async () => later.find({ type: 'Text', text: '“Also make the tip rounder”' }))).toBeDefined()
  await later.unmount()
  // A result handed in after the last read of the chat, found by its words, quotes the newest message passed on to its task since
  const RESULT = 'The bridge is narrower now, and the tip is as you asked it to be.'
  talk.push(
    { role: 'user', text: 'Make the bridge narrower too', toolUses: [] },
    { role: 'assistant', text: 'Passing that on.', uuid: 'r5', toolUses: [{ tool_use_id: 'pass2', tool: 'SendMessage', input: { to: 'a1', message: 'Make the bridge narrower too' } }] },
    { role: 'user', text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n</task-notification>', toolUses: [] },
    { role: 'assistant', text: RESULT, uuid: 'r6', toolUses: [] },
  )
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: RESULT } as never)
  const result = await $.ui.mount({ ...MSG, requestId: 'msg_r6', props: { text: RESULT, isFirstOfReply: true }, surface: 'desktop' } as never)
  await clock.advance(1000)
  expect(await until(async () => result.find({ type: 'Text', text: '“Make the bridge narrower too”' }))).toBeDefined()
  // Colour marks only what matters: the reply that passes on a task's result has a delivered card's blue edge and Result, which
  // opens the whole of it; any other reply about a task has a grey edge and no Result, its task's colour only in its dot
  const edgeOf = async (drawn: typeof result) => (await drawn.findAll({ type: 'Box' })).find(one => /^task-box-/.test(one.key ?? ''))?.props.borderColor
  expect([await edgeOf(result), await edgeOf(reply)]).toEqual(['#4C9AFF', '#80808070'])
  expect([await keyed(reply, `task-result-${r.agentId}`), await keyed(result, `task-result-${r.agentId}`)].map(Boolean)).toEqual([false, true])
  // What you write to it on its card, here in the box Reply on a reply about it opens, is what the next reply about it quotes
  const box = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await pressed(reply, `task-reply-${r.agentId}`)
  const field = await until(async () => (await box.findAll({ type: 'Input' } as never)).find(one => /-reply-change-/.test(one.key ?? '')))
  await box.input({ key: field?.key ?? '', text: 'Leave the bridge as it is now' })
  expect(await until(async () => ([...files.values()].some(text => text.includes('"written"')) ? true : undefined))).toBe(true)
  const AFTER = 'The bridge stays as it is, and the nose is done.'
  talk.push(
    { role: 'user', text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Fix the nose" finished</summary>\n</task-notification>', toolUses: [] },
    { role: 'assistant', text: AFTER, uuid: 'r7', toolUses: [] },
  )
  const after = await $.ui.mount({ ...MSG, requestId: 'r7', props: { text: AFTER, isFirstOfReply: true }, surface: 'desktop' } as never)
  await clock.advance(1000)
  expect(await until(async () => after.find({ type: 'Text', text: '“Leave the bridge as it is now”' }))).toBeDefined()
  // while the reply before it still quotes the message it answered
  expect(await result.find({ type: 'Text', text: '“Make the bridge narrower too”' })).toBeDefined()
  await after.unmount()
  await box.unmount()
  await result.unmount()
  // View more shows the whole of it
  await reply.press({ key: String((await reply.findAll({ type: 'Button' })).find(one => /^quote-more-/.test(one.key ?? ''))?.key) })
  expect(await until(async () => (await reply.findAll({ type: 'Button' })).find(one => one.props.label === 'View less'))).toBeDefined()
  expect((await reply.find({ type: 'Text', text: /^“Fix the nose on head A/ }))?.text).toBe(`“${ASKED}”`)
  await pressed(reply, `task-open-${r.agentId}`)
  expect(await until(async () => tabs.find(tab => tab.startsWith(`work-${r.agentId}:`)))).toBeDefined()
  // Reply opens the box above the chat, to that task: while it asks something, its answer box
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: r.agentId, text: 'Release the nose fix?', choices: ['Release it'] } as never)
  await pressed(reply, `task-reply-${r.agentId}`)
  const head = await until(async () => bar.find({ type: 'Text', text: /^↳ / }))
  expect(head?.text).toBe('↳ Your answer to “Fix the nose”')
  // in the task's colour, not only the amber of what waits for you
  expect(head?.props.color).toBe(colour)
  expect((await bar.find({ type: 'Text', text: '● ' }))?.props.color).toBe(colour)
  const details = await $.ui.mount({ ...LIST, requestId: `work-${r.agentId}`, surface: 'desktop' } as never)
  expect(await until(async () => details.find({ type: 'Text', text: 'Links' }))).toBeDefined()
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const dotOf = async () => (await list.findAll({ type: 'Text', text: '● ' })).find(one => one.props.color === colour)
  expect(await until(dotOf)).toBeDefined()
  // Two tasks started one after the other never share a colour, though nothing was said of the second yet
  const dots = async () => new Set((await list.findAll({ type: 'Text', text: '● ' })).map(one => one.props.color))
  expect(await until(async () => ((await dots()).size === 2 ? true : undefined))).toBe(true)

  // A part handed in by a task still at work has a working card's purple edge and says it is a part
  const PART = 'The price page has its three plans laid out, and the yearly switch works.'
  await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'p1', agentId: 'a2', message: PART } as never)
  await $.prompt.submit({ text: '<agent-message from="a2">\nThe task "Make the price page" handed in a part of its result, and is still working on the rest.\n</agent-message>', wait: false, origin: { kind: 'peer' }, isMeta: true } as never)
  const part = await $.ui.mount({ ...MSG, requestId: 'msg_p1', props: { text: PART, isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await until(async () => part.find({ type: 'Text', text: 'Part · still working' }))).toBeDefined()
  expect(await edgeOf(part)).toBe('#8A63F0')
  await part.unmount()
  // Two results passed on in one reply, a line of dashes between them, stand in a box each, under their own task's name
  const PRICE = 'The price page is live with its three plans, and nothing is needed from you.'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h2', agentId: 'a2', message: `${PRICE}\n\n---\n\n${'Each plan has its own row of what it holds. '.repeat(30)}` } as never)
  await clock.advance(1000)
  const two = await $.ui.mount({ ...MSG, requestId: 'msg_two', props: { text: `${RESULT}\n\n---\n\n${PRICE}`, isFirstOfReply: true }, surface: 'desktop' } as never)
  const boxes = async () => (await two.findAll({ type: 'Box' })).filter(one => /^task-box-.*-\d$/.test(one.key ?? ''))
  expect(await until(async () => ((await boxes()).length === 2 ? true : undefined))).toBe(true)
  expect((await boxes()).map(one => one.props.borderColor)).toEqual(['#4C9AFF', '#4C9AFF'])
  expect((await two.findAll({ type: 'Markdown' })).map(one => one.props.text)).toEqual(expect.arrayContaining([RESULT, PRICE]))
  expect(await two.find({ type: 'Text', text: 'Make the price page' })).toBeDefined()
  expect(await two.find({ type: 'Text', text: 'Fix the nose' })).toBeDefined()
  // Result opens the whole of it, of which the chat was given only the short result
  await pressed(two, 'task-result-1-a2')
  expect(await until(async () => tabs.find(tab => tab.startsWith('report-')))).toBeDefined()
  await two.unmount()
  // Task colours off in Config: the box and the dot go, the links stay
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Task colours' })).toBeDefined()
  expect(await config.find({ type: 'Text', text: 'Links at the end' })).toBeDefined()
  await reply.unmount()
  await pressed(config, 'config-taskColours-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ taskColours: false })
  const uncoloured = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  expect(await until(async () => ((await uncoloured.find({ type: 'Text', text: /●/ })) ? undefined : true))).toBe(true)
  expect(await uncoloured.find({ type: 'Text', text: 'Links' })).toBeDefined()
  expect(await dotOf()).toBeUndefined()

  await uncoloured.unmount()
  // Links at the end off: the reply is the engine's alone
  await pressed(config, 'config-replyLinks-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ taskColours: false, replyLinks: false })
  const bare = await $.ui.mount({ ...MSG, surface: 'desktop' } as never)
  expect(await until(async () => ((await bare.find({ type: 'Text', text: 'Links' })) ? undefined : true))).toBe(true)
  expect(await bare.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
})
