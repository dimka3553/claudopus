// /claudopus and /servers, and the panel opening and closing in every chat

test('/claudopus and /servers say the panel opened, and say plainly where it can be seen when this screen has nowhere to draw it', async ($, on) => {
  world(on)
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe('Claudopus panel opened.')
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe('Servers panel opened.')
})

test('/claudopus and /servers on a screen with nowhere to draw a panel say it cannot be shown there and where it can', async ($, on) => {
  world(on, { unplaced: true })
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe("The Claudopus panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.")
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe("The Servers panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.")
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

test("closed by hand in another chat, the panel closes here; the mod's own close and a screen with nowhere to draw it choose nothing", async ($, on) => {
  const { closed, files, clock } = world(on, { panes: ['claudopus'] })
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_699_999_999_000 }))
  await $.session.start(start)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_700_000_000_500 }))
  await clock.advance(2_000)
  expect(closed).toContain('claudopus')
  // That close is the mod's own and leaves the choice as it was
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')).toEqual({ isOpen: false, at: 1_700_000_000_500 })
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
