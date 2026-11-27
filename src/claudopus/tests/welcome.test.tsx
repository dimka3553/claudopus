// The welcome for a new person

test('a new person gets a welcome once: it opens the panel, names /claudopus, and its button starts indexing their old chats', async ($, on) => {
  const { opened, files, submitted } = world(on, { isNew: true })
  await $.session.start(start)
  expect(opened[0]).toBe('claudopus')
  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    expect((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' }))?.props.bold).toBe(true)
    expect(await pane.find({ type: 'Text', text: /Type \/claudopus to bring it back/ })).toBeDefined()
    expect((await pane.findAll({ type: 'Button' })).some(b => b.props.label === 'Bring in old chats')).toBe(true)
    await pane.unmount()
  }
  // A reload of the same session keeps it
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeDefined()
  await pressed(pane, 'welcome-index')
  const asked = await until(async () => submitted.find(text => text.startsWith('Bring in my old chats')))
  expect(asked).toContain('/onboard/extract.py" "/home/sam/.claude/claudopus/onboard"')
  expect(asked).toContain('/onboard/reader.md')
  expect(asked).toContain('`update` tool')
  expect(JSON.parse(files.get(`${MEMORY}/welcome.json`) ?? '{}').isOpen).toBe(false)
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })) ? undefined : true))).toBe(true)
  await pane.unmount()
})

// On Windows, where the Claude app runs the engine with no HOME and Claude Code's own commands run in Git for Windows' bash: the
// memory folder is in the person's profile, and every Unix tool and shell the mod asks for runs in Git's bash, each word as it was
test('on a Windows PC the welcome comes the same, its memory in the profile and each Unix command run in Git for Windows\' bash', async ($, on) => {
  const { opened, files, windowsRuns } = world(on, { isNew: true, windows: true })
  await $.session.start(start)
  expect(opened[0]).toBe('claudopus')
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeDefined()
  await pane.unmount()
  expect(files.has('C:/Users/sam/.claude/claudopus/welcome.json')).toBe(true)
  expect([...files.keys()].filter(path => path.startsWith('/.claude') || path.startsWith('/home/sam/.claude'))).toEqual([])
  expect(await until(async () => (files.get('C:/Users/sam/.claude/claudopus/log.md') ?? '').includes(' start ') || undefined)).toBe(true)
  expect(windowsRuns.length).toBeGreaterThan(0)
  const bare = windowsRuns.filter(argv => argv[0] !== 'C:/Program Files/Git/bin/bash.exe' && !/^(?:git|where|powershell|explorer|rundll32|notepad|tasklist|taskkill|netstat)(?:\.exe)?$|\.exe$/i.test(argv[0] ?? ''))
  expect(bare).toEqual([])
  expect(windowsRuns.filter(argv => argv[0] === 'C:/Program Files/Git/bin/bash.exe').every(argv => argv[1] === '-c' && argv[2] === 'exec "$0" "$@"')).toBe(true)
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
