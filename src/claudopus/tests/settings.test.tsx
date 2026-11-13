// Config: the person's own texts, settings, and models

test('a copy of the principles in the memory folder is the person\'s own: every conversation carries it in place of the shipped ones', async ($, on) => {
  const { files } = world(on)
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  const MINE = '# Mine\n\n## Core truths\n\n- Mine come first.\n\n## Checking\n\n1. Look at it.\n'
  files.set(`${MEMORY}/rules/CLAUDE.md`, MINE)
  await $.session.start(start)
  const told = await $.prompt.context({ blocks: [], instructionFiles: [{ path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' }] })
  expect(told.instructionFiles?.find(one => one.kind === 'user')).toEqual({ path: `${MEMORY}/rules/CLAUDE.md`, kind: 'user', content: MINE })
  expect(told.instructionFiles?.some(one => one.content === PRINCIPLES)).toBe(false)
})

test('Config lists each thing a person can set with what is in force, edits a text as their own copy, changes a setting and puts each back', async ($, on) => {
  const { files, shown, tabs } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', other: 1 }))
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBe('config: Config')
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  for (const name of ['Principles', "The chat's rules", 'Work rules', 'Your name', 'Background work', 'Sound', 'Notifications', 'Automatic updates', 'Most work', 'Long legwork', 'Heavy work'])
    expect(await config.find({ type: 'Text', text: name })).toBeDefined()
  // Only what differs from what shipped has a Reset: here the name
  expect((await config.findAll({ type: 'Button' })).filter(one => one.props.label === 'Reset').length).toBe(1)
  // Open file makes the person's own copy from the shipped text and opens it in their editor
  await pressed(config, 'config-text-principles-open')
  expect(files.get(`${MEMORY}/rules/CLAUDE.md`)).toBe(PRINCIPLES)
  expect(shown.at(-1)).toEqual(['open', '-t', `${MEMORY}/rules/CLAUDE.md`])
  // A copy still the same as what shipped is no change of theirs
  expect((await config.findAll({ type: 'Text', text: /As shipped\.$/ })).length).toBe(3)
  // Edit opens the text in the tab; Save makes it the person's own
  await pressed(config, 'config-text-work-edit')
  await config.input({ key: 'config-text-work-input', text: 'MY WORK RULES' })
  expect(files.get(`${MEMORY}/roles/work.md`)).toBe('MY WORK RULES\n')
  expect(await config.find({ type: 'Input', key: 'config-text-work-input' })).toBeUndefined()
  // Without the places the shipped rules fill, it is said to lack what an update added
  expect(await config.find({ type: 'Text', text: /Edited by you, before an update added parts yours lacks/ })).toBeDefined()
  // Reset moves it aside, and the shipped text is in force again
  await pressed(config, 'config-text-work-back')
  expect(files.has(`${MEMORY}/roles/work.md`)).toBe(false)
  expect([...files.entries()].find(([path]) => /\/roles\/work\.md\.\d{8}-\d{6}\.old$/.test(path))?.[1]).toBe('MY WORK RULES\n')
  expect((await config.findAll({ type: 'Text', text: /As shipped\.$/ })).length).toBe(3)
  // A setting is written to config.json, every other key kept; Reset takes the key out
  await pressed(config, 'config-sound-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1, sound: false })
  await pressed(config, 'config-sound-back')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1 })
  // Automatic updates are on as shipped; Off writes updates: false, and On takes the key out again
  await pressed(config, 'config-updates-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1, updates: false })
  await pressed(config, 'config-updates-on')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1 })
  await config.input({ key: 'config-name-input', text: 'Alex' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').name).toBe('Alex')
  await pressed(config, 'config-name-back')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').name).toBeUndefined()
})

test('the model each kind of work runs on comes from Config, and the chat\'s and work\'s rules name it', async ($, on) => {
  const { files } = world(on, { chatRole: 'CHAT ROLE\n- {models}' })
  await $.session.start(start)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  await config.select({ key: 'config-model-legwork-pick', value: 'opus' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ models: { legwork: 'opus' } })
  // The chat is told at its next message, and the work's rules name the helpers' model
  const told = (await $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })) as { context?: string[] }
  expect((told.context ?? []).join('\n')).toContain('Long legwork such as indexing runs on Opus 5.5, `model: "opus"`.')
  await $.agent.spawn({ ...spawn, prompt: 'index the photos' } as never)
  expect(prompts[0]).not.toContain('{helpers}')
  // Picking what shipped takes the key out again
  await config.select({ key: 'config-model-legwork-pick', value: 'sonnet' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({})
})
