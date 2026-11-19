// The app's own prompts shown amber in every panel

test("this chat waiting on the app's own prompt is listed with its prompt, and idle chats beside it are not", async ($, on) => {
  const { files, clock, wake } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle}\n`)
  await $.session.start(start)
  void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } } as never)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run a command: Clear the build folder' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await keyed(list, 'quiet-fold')).toBeUndefined()
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder' } as never)
  wake()
  await list.unmount()
})

test("a chat stopped on the app's own prompt shows it amber at the top of its panel and in its file, says so aloud once, and clears as the call ends", async ($, on) => {
  const { files, clock, notified, wake } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  // The work's call raises the app's prompt: the mod holds it for a press, and answered in the box it passes it on untouched
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run a command: Clear the build folder' }))).toBeDefined()
  // Yes and No on the card answer it; nothing tells the person to go and answer elsewhere
  expect(await until(async () => button(list, 'prompt-yes-this-'))).toBeDefined()
  expect(await button(list, 'prompt-no-this-')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer Yes or No in the box at the bottom of this chat.' })).toBeUndefined()
  // It says which work asks, that it asks permission, the command whole, and what a yes and a no each do
  expect(await list.find({ type: 'Text', text: 'Needs your permission' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'rm -rf build' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Yes: the command runs on its Mac.' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: "No: it doesn't run, and Claudopus tells Claude you said no." })).toBeDefined()
  // Amber, inside the card of the work whose command raised it, under its title: never a box of its own above the cards
  const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts.indexOf('Clean the build')).toBeLessThan(texts.indexOf('Run a command: Clear the build folder'))
  expect(texts.filter(one => one === 'Clean the build')).toHaveLength(1)
  expect((await list.find({ type: 'Text', text: 'Run a command: Clear the build folder' }))?.props.color).toBe('#E5A50A')
  // The others see it in this chat's file, with the work it came from
  await clock.advance(1000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').prompts).toEqual([expect.objectContaining({ text: 'Run a command: Clear the build folder', title: 'Clean the build' })])
  // Not told before the app itself says the prompt is still waiting; then told once, as an ask is
  await clock.advance(5000)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual([])
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual(['Clean the build has a question for you | Run a command: Clear the build folder'])
  // The call ends, allowed and run: the amber prompt goes, here and in the file, and the card says what was answered and that it ran,
  // for a minute, in this panel and in the file the others read
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' } as never)
  wake()
  expect(((await asked) as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  const amber = async (text: string) => (await list.findAll({ type: 'Text', text })).find(one => one.props.color === '#E5A50A')
  expect(await until(async () => ((await amber('Run a command: Clear the build folder')) ? undefined : true))).toBe(true)
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it · it ran and is done' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Run a command: Clear the build folder' })).toBeDefined()
  await clock.advance(1000)
  const shared = JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}')
  expect(shared.prompts).toBeUndefined()
  expect(shared.answeredPrompts).toEqual([expect.objectContaining({ text: 'Run a command: Clear the build folder', answered: 'yes', isRunning: false })])
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'You allowed it · it ran and is done' })) ? undefined : true))).toBe(true)
  // A prompt answered at once is not told
  await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Answer a question: Which colour for the nose?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'This chat itself' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })).toBeDefined()
  await $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toHaveLength(1)
  await list.unmount()
})

test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', async ($, on) => {
  const { files, clock, wake } = world(on)
  await $.session.start(start)
  // The same command already running elsewhere, as in a terminal, says nothing of this call
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run a command: Count the lines' }))).toBeDefined()
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Run a command: Count the lines' })).toBeDefined()
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await clock.advance(2000)
  // Seen running: no longer amber, and the card says it was allowed and runs now
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it · it is running now' }))).toBeDefined()
  expect((await list.findAll({ type: 'Text', text: 'Run a command: Count the lines' })).some(one => one.props.color === '#E5A50A')).toBe(false)
  wake()
  // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
  files.set('settings:allow', '1')
  await $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } } as never)
  await clock.advance(1000)
  expect(await list.find({ type: 'Text', text: 'Write the file notes.md' })).toBeUndefined()
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

test('a message the chat passes to running work names that work and the message; a no is said plainly, a minute, then it goes', async ($, on) => {
  const { files, clock, wake } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the cards', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the panel cards', prompt: 'fix the cards' } as never)
  void $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'Make the buttons bigger too' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await until(async () => list.find({ type: 'Text', text: 'Send a message to the task “Fix the panel cards”' })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Send a message to the task “Fix the panel cards”')
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Make the buttons bigger too')
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Yes: that task gets the message and acts on it.')
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain("No: it isn't sent, and the chat waits for what you say next.")
  // No tool's own name anywhere on it
  expect((await list.findAll({ type: 'Text' })).some(one => String(one.text).includes('SendMessage'))).toBe(false)
  // The person says no
  files.set('refuse', 'SendMessage')
  await $.tool.call({ tool: 'SendMessage', to: 'a1', message: 'Make the buttons bigger too' } as never)
  wake()
  await until(async () => list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain("You said no · it didn't run, and Claude is waiting for what you say next")
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Send a message to the task “Fix the panel cards”')
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })) ? undefined : true))).toBe(true)
  // Allowed, a message says it was sent
  files.delete('refuse')
  void $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'One more thing' } } as never)
  await until(async () => list.find({ type: 'Text', text: 'Send a message to the task “Fix the panel cards”' }))
  await $.tool.call({ tool: 'SendMessage', to: 'a1', message: 'One more thing' } as never)
  wake()
  await until(async () => list.find({ type: 'Text', text: 'You allowed it · Claude sent it' })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('You allowed it · Claude sent it')
  // Interrupted before an answer: nothing happened
  files.set('interrupt', 'Bash')
  void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make clean', description: 'Clean up' }, agent_id: 'a1' } as never)
  await until(async () => list.find({ type: 'Text', text: 'Run a command: Clean up' })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Run a command: Clean up')
  await $.tool.call({ tool: 'Bash', command: 'make clean', description: 'Clean up', agentId: 'a1' } as never)
  wake()
  await until(async () => list.find({ type: 'Text', text: 'It ended before you answered · nothing happened' })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('It ended before you answered · nothing happened')
  await list.unmount()
})

test("another chat's prompt and its answer show under that chat's name, titled by its work or as that chat's own", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run a command: Count files', kind: 'allow', at: NOW }], answeredPrompts: [{ id: 'toolu_8', text: 'Pass a message to the work “Tidy”', title: 'Tidy', kind: 'allow', answered: 'yes', done: 'it was sent', at: NOW, endedAt: NOW }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await until(async () => list.find({ type: 'Text', text: 'Run a command: Count files' })); expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('Run a command: Count files')
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('That chat itself')
  expect(await list.find({ type: 'Text', text: 'This chat itself' })).toBeUndefined()
  expect((await list.findAll({ type: 'Text' })).map(t => t.text)).toContain('You allowed it · it was sent')
  await list.unmount()
})

test("Yes on a prompt's card allows the call as Claude Code's own box would, and the card says it runs", async ($, on) => {
  const { clock, wake } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } } as never)
  expect(await until(async () => button(list, 'prompt-yes-this-'))).toBeDefined()
  await list.press({ key: String((await button(list, 'prompt-yes-this-'))?.key) })
  wake()
  expect(((await asked) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it · it is running now' }))).toBeDefined()
  expect(await button(list, 'prompt-yes-this-')).toBeUndefined()
  // The call runs and ends: the card says it is done
  await $.tool.call({ tool: 'Bash', command: 'npm test', description: 'Run the tests' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it · it ran and is done' }))).toBeDefined()
  await clock.advance(1000)
  // The chat's own prompt to start a task, allowed: once the task is on its card, what came of it is said inside that card, never as
  // a row of the chat itself between the cards (17 Nov, the person's screenshot)
  const input = { description: 'Show scan numbers', prompt: 'show the scan numbers', run_in_background: true }
  const started = $.classic.PermissionRequest({ tool_name: 'Agent', tool_input: input } as never)
  expect(await until(async () => button(list, 'prompt-yes-this-'))).toBeDefined()
  await list.press({ key: String((await button(list, 'prompt-yes-this-'))?.key) })
  wake()
  expect(((await started) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  await $.tool.call({ tool: 'Agent', ...input } as never)
  await $.agent.spawn({ ...spawn, description: 'Show scan numbers', prompt: 'show the scan numbers' } as never)
  await clock.advance(1000)
  const said = await until(async () => list.find({ type: 'Text', text: /^You allowed it · (Claude started it|it is running now)$/ }))
  expect(said).toBeDefined()
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts.indexOf('Show scan numbers')).toBeGreaterThan(-1)
  expect(texts.indexOf('Show scan numbers')).toBeLessThan(texts.indexOf(String(said?.text)))
  // Only its own words under what came of it: no "This chat itself" naming it as the chat's
  expect(texts[texts.indexOf(String(said?.text)) + 1]).toBe('Start a task: Show scan numbers')
  await list.unmount()
})

test("No on a prompt's card refuses the call: the chat's own turn stops, and work is told and carries on", async ($, on) => {
  const { wake } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'tidy up', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Tidy the repo', prompt: 'tidy up' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const own = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf dist', description: 'Delete the build' } } as never)
  expect(await until(async () => button(list, 'prompt-no-this-'))).toBeDefined()
  await list.press({ key: String((await button(list, 'prompt-no-this-'))?.key) })
  wake()
  expect(((await own) as { decision?: unknown }).decision).toEqual({ behavior: 'deny', message: expect.stringContaining('said no'), interrupt: true })
  expect(await until(async () => list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" }))).toBeDefined()
  const work = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'git clean -fd', description: 'Clean the tree' }, agent_id: 'a1' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run a command: Clean the tree' }))).toBeDefined()
  expect(await until(async () => button(list, 'prompt-no-this-'))).toBeDefined()
  await list.press({ key: String((await button(list, 'prompt-no-this-'))?.key) })
  wake()
  const decision = ((await work) as { decision?: { interrupt?: unknown; message?: string } }).decision
  expect(decision?.interrupt).toBeUndefined()
  expect(decision?.message).toContain('continue without it')
  expect(await until(async () => list.find({ type: 'Text', text: "You said no · it didn't run, and Claudopus told Claude" }))).toBeDefined()
  await list.unmount()
})

test('a question or a plan has no Yes or No on its card: it says where to answer it', async ($, on) => {
  const { wake } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const r = await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour?' }] } } as never)
  expect((r as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  expect(await until(async () => list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' }))).toBeDefined()
  expect(await button(list, 'prompt-yes-')).toBeUndefined()
  wake()
  await list.unmount()
})

test("another chat's held prompt has no Yes or No here, only where to answer it; an answer a file leaves for this chat's own prompt answers nothing", async ($, on) => {
  const { files, clock, wake, logged } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run a command: Count files', kind: 'allow', at: NOW, isHeld: true }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run a command: Count files' }))).toBeDefined()
  expect(await button(list, 'prompt-yes--chat-o-toolu_9')).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in that chat' })).toBeDefined()
  // This chat's own prompt: a Yes left in a file, as another chat or another Mac could leave one, does not answer it
  let settled = false
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make', description: 'Build it' } } as never).then(r => ((settled = true), r))
  expect(await until(async () => button(list, 'prompt-yes-this-'))).toBeDefined()
  const id = String((await button(list, 'prompt-yes-this-'))?.key ?? '').replace(/^prompt-yes-this-/, '').replace(/-\d+$/, '')
  files.set(`${MEMORY}/live/answers/engine-id/1-a.json`, JSON.stringify({ card: `prompt:${id}`, choice: 'yes', isReply: false, ask: 'Run a command: Build it', askAt: NOW, at: NOW + 6000 }))
  await clock.advance(5000)
  wake()
  await clock.advance(1000)
  wake()
  expect(settled).toBe(false)
  expect(files.has(`${MEMORY}/live/answers/engine-id/1-a.json`)).toBe(false)
  expect((files.get(`${MEMORY}/log.md`) ?? '')).toContain('left in a file put away unread')
  // Its own Yes, pressed in this chat's panel, still answers it
  await list.press({ key: String((await button(list, 'prompt-yes-this-'))?.key) })
  wake()
  expect(((await asked) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  void logged
  await list.unmount()
})

test("a No pressed after Claude Code's box said yes does not stand: the card says what the call did once it ends", async ($, on) => {
  const { wake } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  void $.classic.PermissionRequest({ tool_name: 'WebFetch', tool_input: { url: 'https://example.com/a' } } as never)
  expect(await until(async () => button(list, 'prompt-no-this-'))).toBeDefined()
  await list.press({ key: String((await button(list, 'prompt-no-this-'))?.key) })
  wake()
  expect(await until(async () => list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" }))).toBeDefined()
  // The box had allowed it first: the call runs and ends well
  await $.tool.call({ tool: 'WebFetch', url: 'https://example.com/a' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it · it ran and is done' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })).toBeUndefined()
  await list.unmount()
})


test("a call Claude Code refuses a background task with no prompt, as auto mode does, is shown on the task's card with Claude Code's own reason alone, and its answer tells the task to carry on without it and never to reach it by other means; a failing call whose output only holds those words shows nothing; an ask put up meanwhile is never replaced; pressed once the task has ended it is not started again; and Claudopus never lets the call through itself", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  const { files, clock, resumed, appended, logged } = world(on, { agents })
  // Beneath the mod the engine would put each of the checks below to its mode, which settles the ask; the refused calls are Claude
  // Code's own to refuse, with no prompt
  on('tool.check', (_, e, next) => (String((e as { tool_use_id?: unknown }).tool_use_id).startsWith('chk') ? ({ decision: 'ask' } as never) : next(e)))
  await $.session.start(start)
  await $.prompt.submit({ text: 'write the notes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Write the notes', prompt: 'write the notes' } as never)
  const put = () => (files.get(`${MEMORY}/log.md`) ?? '').split('\n').filter(line => line.includes('put to the person on its card'))
  // A search that fails, whose output holds Claude Code's words, is no refusal
  files.set('fails', "notes.md: Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access].")
  await $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'grep -r denied notes.md # fails', tool_use_id: 'g1' } as never)
  const call = { tool: 'Edit', agentId: 'a1', file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }
  files.set('auto-refuse', 'Edit')
  await $.tool.call({ ...call, tool_use_id: 'e1' } as never)
  files.delete('auto-refuse')
  await clock.advance(1000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asks = 'Claude Code blocked this task: Change the file notes.md.'
  expect(await until(async () => list.find({ type: 'Text', text: asks }))).toBeDefined()
  expect(put()).toHaveLength(1)
  // What was refused, Claude Code's reason alone (none of its words for the model), and that the task carries on without it
  const told = await until(async () => [...logged, ...appended].find(one => one.includes('Why: ')))
  expect(told).toContain("Why: Claude Code's auto mode blocked it (Unauthorized Access).")
  expect(told).toContain("Claude carries on without it and won't try another way.")
  expect(told).not.toMatch(/If you have other tasks|settings|Do it another way|Leave it out|it was Permission/)
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => /without it|another way|Leave it out/.test(label))
  expect(await labels()).toEqual(['Carry on without it'])
  const check = (id: string) => $.tool.check({ tool: 'Edit', input: { file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-2')).decision).toBe('ask')
  // Pressed, the task is told to carry on without it, never to get there another way, and its call is still the mode's to settle
  const press = async () => list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Carry on without it')))?.key ?? '' })
  await press()
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))).toBeDefined()
  await clock.advance(1000)
  expect((await check('chk-3')).decision).toBe('ask')
  // Two refused at once: the first on the card stays, the second never replaces it
  files.set('auto-refuse', 'Edit')
  await Promise.all([$.tool.call({ ...call, file_path: '/repo/a.md', tool_use_id: 'e2' } as never), $.tool.call({ ...call, file_path: '/repo/b.md', tool_use_id: 'e3' } as never)])
  files.delete('auto-refuse')
  await clock.advance(1000)
  expect(await until(async () => ((files.get(`${MEMORY}/log.md`) ?? '').includes('not put on its card: its card asks something already') ? true : undefined))).toBe(true)
  expect(put()).toHaveLength(2)
  // Pressed once the task has ended, having handed in its result, nothing starts it again
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-end', agentId: 'a1', message: 'The notes are written, without the files Claude Code refused.' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'The notes are written, without the files Claude Code refused.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  const before = appended.filter(one => one.startsWith('a1: ')).length
  await press()
  await clock.advance(5000)
  expect(await until(async () => ((await labels()).length ? undefined : true))).toBe(true)
  expect([resumed.filter(one => one.startsWith('a1: ')), appended.filter(one => one.startsWith('a1: ')).length]).toEqual([[], before])
  await list.unmount()
})

test("a command Claude Code refuses a task is shown whole on its card with where it runs and a Run it button; nothing runs but on that press (not words, not a task's own ask, not waiting), and the press changes no permission; the press runs exactly that command once, as the person's, shows only one quiet line while it runs, never the command again nor a drawing of the whole panel at each look at it (17 Nov, the box that flashed), and sends the task its output, an ended task started again only from a hook or the person's press, never a timer; a long one is stopped at its limit, and Stop stops it", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  // (its clock moves bare, with no hook of the mod after each move: what waits for a hook here waits for the person's press)
  const { files, clock, resumed, appended, pressRuns } = world(on, { agents, unseen: [] })
  on('tool.check', (_, e, next) => (String((e as { tool_use_id?: unknown }).tool_use_id).startsWith('chk') ? ({ decision: 'ask' } as never) : next(e)))
  const redraws = { count: 0 }
  on('ui.invalidate', (_, e, next) => ((redraws.count += 1), next(e)))
  await $.session.start(start)
  await $.prompt.submit({ text: 'find the name servers', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Find the name servers', prompt: 'find the name servers' } as never)
  const refuse = async (id: string, more: Record<string, unknown>) => {
    files.delete('run:gone')
    files.set('auto-refuse', 'Bash')
    await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: id, ...more } as never)
    files.delete('auto-refuse')
    await clock.advance(1000)
  }
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const button = async (label: string) => until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === label))
  const pressed = async (label: string) => list.press({ key: (await button(label))?.key ?? '' })
  const buttons = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => /without it|Run it|Stop it|Open in Terminal|^Send now$/.test(label))
  const stops = () => pressRuns.filter(argv => argv[1] === 'stop').length
  // Carry on without it runs nothing, and says nothing of words
  await refuse('b00', { command: 'dig +short NS example.net', description: 'Look up the name servers' })
  await pressed('Carry on without it')
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))).toBeDefined()
  expect(await list.find({ type: 'Text', text: "Your answer didn't run the command: only its Run it button runs it" })).toBeUndefined()
  // Words never run it, even "Run it" typed in its reply box: the card says only the button does
  await refuse('b0', { command: 'dig +short NS example.org', description: 'Look up the name servers' })
  const box = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? '')))
  await list.input({ key: box?.key ?? '', text: 'Run it' })
  expect(await until(async () => list.find({ type: 'Text', text: "Your answer didn't run the command: only its Run it button runs it" }))).toBeDefined()
  // Nor a task's own question with a button of that name
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Shall I go on?', choices: ['Run it', 'Not now'], copy: 'dig +short NS example.org' } as never)
  await pressed('Run it')
  await clock.advance(10_000)
  expect(pressRuns).toEqual([])
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  const command = "dig +short NS example.com @ns1.example.net | sort # it's the person's own"
  await refuse('b1', { command, description: 'Look up the name servers' })
  expect(await until(async () => list.find({ type: 'Text', text: 'Claude Code blocked this task: Run a command: Look up the name servers.' }))).toBeDefined()
  // The command whole, where it runs and for how long at most, and the two buttons
  expect(await list.find({ type: 'Text', text: command })).toBeDefined()
  expect(await until(async () => (await list.findAll({ type: 'Text' })).find(t => /^Runs in .+, as a command you type would, for at most 10 min$/.test(t.text)))).toBeDefined()
  expect(await buttons()).toEqual(['Run it', 'Carry on without it'])
  // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
  await clock.advance(60_000)
  expect(pressRuns).toEqual([])
  const check = (id: string) => $.tool.check({ tool: 'Bash', input: { command, description: 'Look up the name servers' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-1')).decision).toBe('ask')
  // Pressed (twice at once, as a double click): run once, exactly as shown, by Claudopus's runner in the chat's folder
  const key = (await button('Run it'))?.key ?? ''
  await Promise.all([list.press({ key }), list.press({ key }).catch(() => undefined)])
  expect(await until(async () => (pressRuns.length ? pressRuns : undefined))).toHaveLength(1)
  const [runner, how, ran, out, folder] = pressRuns[0] ?? []
  expect([String(runner).endsWith('/bin/run-it'), how, ran, folder]).toEqual([true, 'start', command, '/repo'])
  expect(String(out)).toMatch(/\/runs\/.+\.log$/)
  // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('Claudopus is running it for them now') && one.includes(`What it prints goes to ${out}`)))).toBeDefined()
  expect((await check('chk-2')).decision).toBe('ask')
  // Running: one quiet line with how long it has run, and Stop it; the command is not shown again
  files.set(String(out), 'ns1.example.net.\n')
  await clock.advance(5000)
  const runTime = async () => (await list.findAll({ type: 'Text' })).find(t => /^ · \d+[hms]/.test(t.text))?.text
  expect(await until(async () => list.find({ type: 'Text', text: 'Running your command' }))).toBeDefined()
  expect(await runTime()).toBeDefined()
  // and nothing else about it: not the command, nor the answer said again on the card's line
  expect(await list.find({ type: 'Text', text: command })).toBeUndefined()
  expect((await list.findAll({ type: 'Text' })).filter(t => /Run it”|Claudopus is running it/.test(t.text)).map(t => t.text)).toEqual([])
  expect(await buttons()).toEqual(['Stop it'])
  // While it prints, each look at it every 5 s draws nothing: the whole panel is drawn again only as calmly as for any running
  // work, every ten seconds at most
  redraws.count = 0
  for (let i = 0; i < 12; i++) (files.set(String(out), `ns1.example.net.\nline ${i}\n`), await clock.advance(5000))
  expect(redraws.count).toBeLessThanOrEqual(8)
  // The task ends meanwhile. The command's end starts it again with what it printed and where the whole is, from no timer: its card
  // says the output waits, and the person's press sends it
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting on the name servers.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  // Its running time still moves, calmly, with the task ended
  await clock.advance(15_000)
  const ranThen = await runTime()
  expect(ranThen).toBeDefined()
  await clock.advance(15_000)
  expect(await until(async () => ((await runTime()) !== ranThen ? true : undefined))).toBe(true)
  files.set(String(out), 'ns1.example.net.\nns2.example.net.\nclaudopus-exit 0\n')
  await clock.advance(5000)
  await clock.advance(30_000)
  expect(await until(async () => ((await buttons()).includes('Send now') ? true : undefined))).toBe(true)
  // with that one quiet line alone: the answer is not said again on the card
  expect(await list.find({ type: 'Text', text: 'Its output waits for Claude' })).toBeDefined()
  expect((await list.findAll({ type: 'Text' })).filter(t => /Run it”/.test(t.text)).map(t => t.text)).toEqual([])
  expect(resumed.filter(one => one.startsWith('a1: '))).toEqual([])
  await pressed('Send now')
  const woke = await until(async () => resumed.find(one => one.startsWith('a1: ') && one.includes('ns2.example.net.')))
  expect(woke).toContain(`ran it for them, exactly as shown, once, in /repo:\n${command}\nIt ended well after`)
  expect(woke).toContain(`Its whole output is in ${out}`)
  expect(woke).toContain('it is no permission')
  expect(pressRuns).toHaveLength(1)
  expect(await until(async () => ((await buttons()).length ? undefined : true))).toBe(true)
  // One sent to the background runs an hour at most; Stop it on its row stops it, and the task, at work, is told
  agents.a1 = 'running'
  await $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/notes.md', tool_use_id: 'r1' } as never)
  await refuse('b2', { command: 'npm run soak', description: 'Run the soak test', run_in_background: true })
  expect(await until(async () => (await list.findAll({ type: 'Text' })).find(t => /for at most 1 hour$/.test(t.text)))).toBeDefined()
  await pressed('Run it')
  expect(await until(async () => (pressRuns.length === 2 ? true : undefined))).toBe(true)
  await pressed('Stop it')
  expect(await until(async () => (stops() === 1 ? true : undefined))).toBe(true)
  await clock.advance(5000)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run soak') && one.includes('was stopped by the person')))).toBeDefined()
  // One held open with its own timeout of a minute is stopped by Claudopus at that limit
  await refuse('b3', { command: 'npm run slow', description: 'Run the slow check', timeout: 60_000 })
  await pressed('Run it')
  expect(await until(async () => (pressRuns.filter(argv => argv[2] === 'npm run slow').length === 1 ? true : undefined))).toBe(true)
  await clock.advance(30_000)
  expect(stops()).toBe(1)
  await clock.advance(35_000)
  expect(await until(async () => (stops() === 2 ? true : undefined))).toBe(true)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run slow') && one.includes('was stopped by Claudopus at its limit of 1 min')))).toBeDefined()
  await list.unmount()
})
