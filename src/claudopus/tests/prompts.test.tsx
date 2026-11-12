// The app's own prompts shown amber in every panel

test("this chat waiting on the app's own prompt is listed with its prompt, and idle chats beside it are not", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle}\n`)
  await $.session.start(start)
  await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } } as never)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await keyed(list, 'quiet-fold')).toBeUndefined()
  await list.unmount()
})

test("a chat stopped on the app's own prompt shows it amber at the top of its panel and in its file, says so aloud once, and clears as the call ends", async ($, on) => {
  const { files, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  // The work's call raises the app's prompt: the mod passes it on untouched
  const r = await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' } as never)
  expect((r as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in this chat' })).toBeDefined()
  // Amber, above the work's own card
  const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts.indexOf('Allow a command: Clear the build folder')).toBeLessThan(texts.lastIndexOf('Clean the build'))
  expect((await list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))?.props.color).toBe('#E5A50A')
  // The others see it in this chat's file, with the work it came from
  await clock.advance(1000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').prompts).toEqual([expect.objectContaining({ text: 'Allow a command: Clear the build folder', title: 'Clean the build' })])
  // Not told before the app itself says the prompt is still waiting; then told once, as an ask is
  await clock.advance(5000)
  expect(notified.filter(line => line.includes('needs your OK'))).toEqual([])
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('needs your OK'))).toEqual(['Clean the build needs your OK | Allow a command: Clear the build folder'])
  // The call ends, refused or run: the prompt goes, here and in the file
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' })) ? undefined : true))).toBe(true)
  await clock.advance(1000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').prompts).toBeUndefined()
  // A prompt answered at once is not told
  await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Answer a question: Which colour for the nose?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Needs your input' })).toBeDefined()
  await $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('needs your OK'))).toHaveLength(1)
  await list.unmount()
})

test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  // The same command already running elsewhere, as in a terminal, says nothing of this call
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Count the lines' }))).toBeDefined()
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Allow a command: Count the lines' })).toBeDefined()
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await clock.advance(2000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Allow a command: Count the lines' })) ? undefined : true))).toBe(true)
  // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
  files.set('settings:allow', '1')
  await $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } } as never)
  await clock.advance(1000)
  expect(await list.find({ type: 'Text', text: 'Allow writing notes.md' })).toBeUndefined()
  await list.unmount()
})

test("another chat's open prompt shows amber under its name, first; on this Mac a press opens that chat, on another Mac it says where", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const waiting = (at: number, chat: string, title: string, link: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [], prompts: [{ id: 'toolu_1', text: 'Allow a command: Cross-repo duplicate files', title: 'Interesting facts', at }], link })
  // One M4 chat with Remote Control on, which opens here; one with only the app's own id there, which does not
  const remote = JSON.stringify({ ...JSON.parse(waiting(NOW, 'chat-rc', 'M4 Remote', '')), link: { bridge: 'session_01M4Remote', app: 'local_m4-rc' } })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${waiting(NOW, 'chat-m4', 'M4 GitHub', 'claude://code/continue?session=local_m4')}\n---claudopus-live---\n${remote}\n`)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // A chat of this Mac with no work but an open prompt is listed; a link that is not the app's own is dropped
  files.set(`${MEMORY}/live/chat-w.json`, waiting(NOW, 'chat-w', 'Web chat', 'claude://code/continue?session=local_ab-12'))
  files.set(`${MEMORY}/live/chat-x.json`, waiting(NOW, 'chat-x', 'Odd chat', 'https://example.com'))
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'M4 GitHub' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in that chat, on m4' })).toBeDefined()
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  // Chats that wait on the person come before the one that only works
  expect(bold.indexOf('Web chat')).toBeLessThan(bold.indexOf('Billing page'))
  expect(bold.indexOf('M4 GitHub')).toBeLessThan(bold.indexOf('Billing page'))
  expect(bold.filter(one => one === 'Allow a command: Cross-repo duplicate files')).toHaveLength(4)
  // Open buttons: the M4 chat with Remote Control, by its Remote Control id, and the chat of this Mac with the app's link; the M4 chat
  // with only the app's own id there says where to answer instead
  const opens = (await list.findAll({ type: 'Button' })).filter(one => one.props.label === 'Open that chat')
  expect(opens).toHaveLength(2)
  expect(await list.find({ type: 'Text', text: 'Answer it in that chat, which runs on m4' })).toBeDefined()
  await list.press({ key: opens.find(one => String(one.key).includes('chat-rc'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01M4Remote'])
  await list.press({ key: opens.find(one => String(one.key).includes('chat-w'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.includes('local_ab-12')))).toEqual(['open', 'claude://code/continue?session=local_ab-12'])
  // Answered there, its file no longer carries it, and its amber card leaves; with nothing going on, its chat is listed no more
  files.set(`${MEMORY}/live/chat-w.json`, JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => one.props.label === 'Open that chat' && String(one.key).includes('chat-w')) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Web chat' })).toBeUndefined()
  await list.unmount()
})
