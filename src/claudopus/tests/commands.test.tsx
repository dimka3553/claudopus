// /claudopus and /servers, and the panel opening and closing in every chat

test('/claudopus and /servers say the panel opened, and say plainly where it can be seen when this screen has nowhere to draw it', async ($, on) => {
  world(on)
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe('Claudopus opened its panel.')
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe('Claudopus opened the Servers panel.')
})

test('/claudopus and /servers on a screen with nowhere to draw a panel say it cannot be shown there and where it can', async ($, on) => {
  world(on, { unplaced: true })
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe("Claudopus can't show the Claudopus panel on this screen. Open it in the Claude app on the Mac this chat runs on.")
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe("Claudopus can't show the Servers panel on this screen. Open it in the Claude app on the Mac this chat runs on.")
})

test('opened in one chat, the panel opens in every other chat, at once in one that starts and within seconds in one already running', async ($, on) => {
  const { opened, files, clock } = world(on)
  await $.session.start(start)
  expect(opened).toEqual([])
  // Another chat on this Mac opened it
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_700_000_000_500 }))
  await clock.advance(2_000)
  expect(opened).toEqual(['claudopus'])
  // Followed once: the same choice does not open it again
  await clock.advance(10_000)
  expect(opened).toEqual(['claudopus'])
  // A chat that starts while the choice stands opens it as it loads
  await $.session.start(start)
  expect(opened).toEqual(['claudopus', 'claudopus'])
})

test("a chat that starts reads the other chats before its panel opens, so they never drop out of it while it loads", async ($, on) => {
  const { files, events } = world(on)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_700_000_000_500 }))
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await $.session.start(start)
  const read = events.indexOf(`list ${MEMORY}/live/pushed`)
  expect(read).toBeGreaterThanOrEqual(0)
  expect(read).toBeLessThan(events.indexOf('open claudopus'))
})

test('/claudopus opens the panel for every chat; closed by hand it closes in every chat and work does not bring it back until asked', async ($, on) => {
  const { opened, files } = world(on)
  await $.session.start(start)
  await $.command.run({ command: 'claudopus', args: '' } as never)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
  // The person's own close, as the app raises it, keeps this choice (the test kit cannot raise a close of the person's)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_700_000_000_005 }))
  const closedAt = JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')
  expect(closedAt.isOpen).toBe(false)
  opened.length = 0
  // Work started after it was closed, here or in a chat that loads with work running, leaves it closed
  await $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'The nose on head A is flawed, can you fix it?' } as never)
  await $.session.start(start)
  expect(opened).toEqual([])
  // Asked for again, it is open for every chat again, as a choice later than the close
  await $.command.run({ command: 'claudopus', args: '' } as never)
  const again = JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')
  expect(again.isOpen).toBe(true)
  expect(again.at).toBeGreaterThan(closedAt.at)
})

test('at the right of the line above the prompt, Open panel opens the closed panel for every chat, Refresh puts it back as it first opens and Close panel then closes it for every chat', async ($, on) => {
  const live: { id: string; isShown: boolean; isPlaced: boolean }[] = []
  const { opened, closed, files } = world(on, { live })
  // Closed by hand earlier: work that starts leaves it closed
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_699_999_999_000 }))
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'The nose on head A is flawed, can you fix it?' } as never)
  expect(opened).toEqual([])
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const shown = async (label: string) => (await until(async () => ((await bar.findAll({ type: 'Button' })).map(b => b.props.label).includes(label) ? (await bar.findAll({ type: 'Button' })).filter(b => /^Open panel$|^Close panel$/.test(String(b.props.label))) : undefined))) ?? []
  // Closed, it offers Open panel alone
  const open = await shown('Open panel')
  expect(open.map(b => b.props.label)).toEqual(['Open panel'])
  await bar.press({ key: open[0]?.key ?? '' })
  expect(await until(async () => (opened.length ? opened : undefined))).toEqual(['claudopus'])
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
  // Refresh, before it, puts the panel back as it first opens: the tab picked in it goes back to All, every other tab of its own
  // closes, and the panel opens again in front, still open for every chat
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await until(async () => keyed(list, 'tasks-working'))
  await pressed(list, 'tasks-working')
  expect(await until(async () => ((await keyed(list, 'tasks-all'))?.props.dimColor ? true : undefined))).toBe(true)
  await pressed(list, 'open-a1')
  expect(await until(async () => (opened.includes('work-a1') ? true : undefined))).toBe(true)
  const [shut, again] = [closed.length, opened.length]
  await bar.press({ key: (await bar.findAll({ type: 'Button' })).find(b => b.props.label === 'Refresh')?.key ?? '' })
  expect(await until(async () => (closed.slice(shut).includes('work-a1') && closed.slice(shut).includes('claudopus') && opened.slice(again).includes('claudopus') ? true : undefined))).toBe(true)
  expect(await until(async () => (!(await keyed(list, 'tasks-all'))?.props.dimColor && (await keyed(list, 'tasks-working'))?.props.dimColor ? true : undefined))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
  expect(files.get(`${MEMORY}/log.md`) ?? '').toMatch(/panel refreshed in chat \S+: back to how it first opens, 1 other tab closed, the panel opened again/)
  await list.unmount()
  // Open, it offers Close panel alone, which closes it as the person's own close, for every chat
  const close = await shown('Close panel')
  expect(close.map(b => b.props.label)).toEqual(['Close panel'])
  await bar.press({ key: close[0]?.key ?? '' })
  expect(await until(async () => (closed.includes('claudopus') ? true : undefined))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(false)
  expect(files.get(`${MEMORY}/log.md`) ?? '').toContain("by the person's Close panel above the prompt")
  expect((await shown('Open panel')).map(b => b.props.label)).toEqual(['Open panel'])
  await bar.unmount()
  // The terminal keeps its own line, with no button
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect((await term.findAll({ type: 'Button' })).some(b => /panel$/.test(String(b.props.label)))).toBe(false)
  await term.unmount()
})

test("closed by hand in another chat, the panel closes here; the mod's own close and a screen with nowhere to draw it choose nothing", async ($, on) => {
  const { closed, files, clock } = world(on, { panes: ['claudopus'] })
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_699_999_999_000 }))
  await $.session.start(start)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_700_000_000_500, chat: 'chat-b' }))
  await clock.advance(2_000)
  expect(closed).toContain('claudopus')
  // That close is the mod's own and leaves the choice as it was
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')).toEqual({ isOpen: false, at: 1_700_000_000_500, chat: 'chat-b' })
  // and the log says why the panel went away here: whose close it followed, and when
  expect(files.get(`${MEMORY}/log.md`) ?? '').toContain('to follow its close in chat chat-b at 2023-11-14T22:13:20.500Z')
})

test('/claudopus on a screen with nowhere to draw the panel does not open it for the other chats', async ($, on) => {
  const { files } = world(on, { unplaced: true })
  await $.session.start(start)
  await $.command.run({ command: 'claudopus', args: '' } as never)
  expect(files.has(`${MEMORY}/panel.json`)).toBe(false)
})

test('someone whose panel was open before chats shared it has it open in every chat once this version loads', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus'] })
  await $.session.start(start)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
})

test('a chat whose panel was never open writes no choice as it loads', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  expect(files.has(`${MEMORY}/panel.json`)).toBe(false)
})
