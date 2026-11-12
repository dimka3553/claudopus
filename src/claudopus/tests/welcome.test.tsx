// The welcome for a new person

test('a new person gets a welcome once: it opens the panel, names /claudopus, and its button starts indexing their old chats', async ($, on) => {
  const { opened, files, submitted } = world(on, { isNew: true })
  await $.session.start(start)
  expect(opened[0]).toBe('claudopus')
  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    expect((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' }))?.props.bold).toBe(true)
    expect(await pane.find({ type: 'Text', text: /Type \/claudopus to bring it back/ })).toBeDefined()
    expect(await pane.find({ type: 'Button', label: 'Index my old chats' })).toBeDefined()
    await pane.unmount()
  }
  // A reload of the same session keeps it
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeDefined()
  await pressed(pane, 'welcome-index')
  const asked = await until(async () => submitted.find(text => text.startsWith('Index my old chats')))
  expect(asked).toContain('/onboard/extract.py" "/home/sam/.claude/claudopus/onboard"')
  expect(asked).toContain('/onboard/reader.md')
  expect(asked).toContain('`update` tool')
  expect(JSON.parse(files.get(`${MEMORY}/welcome.json`) ?? '{}').isOpen).toBe(false)
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })) ? undefined : true))).toBe(true)
  await pane.unmount()
})

test('the welcome is put away by Not now, and by the next session even unpressed', async ($, on) => {
  const { files, submitted } = world(on, { isNew: true })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'welcome-later')
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })) ? undefined : true))).toBe(true)
  expect(submitted).toEqual([])
  await pane.unmount()
  // Shown in an earlier session and never pressed: a later session does not show it
  files.set(`${MEMORY}/welcome.json`, JSON.stringify({ shownIn: 'an-earlier-session', isOpen: true }))
  await $.session.start(start)
  const later = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await later.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeUndefined()
  expect(JSON.parse(files.get(`${MEMORY}/welcome.json`) ?? '{}').isOpen).toBe(false)
  await later.unmount()
})

test('someone already set up never sees the welcome, and the panel does not open by itself', async ($, on) => {
  const { opened, files } = world(on)
  await $.session.start(start)
  expect(opened).toEqual([])
  expect(files.has(`${MEMORY}/welcome.json`)).toBe(false)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeUndefined()
  await pane.unmount()
})
