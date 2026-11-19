// Claude Code's own prompts and the commands it blocked, each asked as one Permission block

const AMBER = '#E5A50A'
const BLOCKED = 'Claude Code blocked this command. Run it anyway?'
type PromptPane = { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; text?: unknown; props: Record<string, unknown> }[]> }
// Allow or Don't allow on this chat's own prompt: its key is prompt-this-<the prompt's id>-yes|no-<the count of presses>
const promptButton = async (pane: PromptPane, said: 'yes' | 'no') => (await pane.findAll({ type: 'Button' })).find(one => new RegExp(`^prompt-this-.+-${said}-\\d+$`).test(one.key ?? ''))
const textsOf = async (pane: PromptPane) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
const labelsOf = async (pane: PromptPane) => (await pane.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
// The grey lines that say what was pressed, each with how it is drawn
const pressedLines = async (pane: PromptPane) => (await pane.findAll({ type: 'Text' })).filter(one => String(one.text ?? '').startsWith('✓ You pressed'))
// A held call's answer, which must come with the press alone: no second let go by wake(), no move of the clock
const answered = async <T,>(call: Promise<T>) => Promise.race([call, new Promise<'still held'>(resolve => setTimeout(() => resolve('still held'), 10_000))])

test("this chat waiting on Claude Code's own prompt is listed with its prompt, and idle chats beside it are not", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle}\n`)
  await $.session.start(start)
  void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } } as never)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Clear the build folder' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await keyed(list, 'quiet-fold')).toBeUndefined()
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder' } as never)
  await list.unmount()
})

test("a prompt for a task's call is a Permission block on that task's card, amber and counted once, in its file with only what the others may read, said aloud once, and gone as the call ends; the chat's own question is at the top as this chat's", async ($, on) => {
  const { files, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  // The task's call raises Claude Code's prompt: the mod holds it for a press, and answered in Claude Code's own box it passes on untouched
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The one block: its kind, the question in amber and bold, what it is for, the command whole, Allow and Don't allow
  const question = await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))
  expect([question?.props.color, question?.props.bold]).toEqual([AMBER, true])
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Clear the build folder' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'rm -rf build' })).toBeDefined()
  expect([(await until(async () => promptButton(list, 'yes')))?.props.label, (await promptButton(list, 'no'))?.props.label]).toEqual(['Allow', "Don't allow"])
  // Nothing sends the person elsewhere to answer it, and none of the old words is left
  expect((await textsOf(list)).filter(one => /box at the bottom of this chat|^Needs your permission$|^Yes: |^No: /.test(one))).toEqual([])
  expect((await labelsOf(list)).filter(one => /^(Yes|No|Allow once|Deny|Run it)$/.test(one))).toEqual([])
  // On the card of the task whose command raised it, under its title: never a block of its own above the cards, nor named as the chat's
  const texts = await textsOf(list)
  expect(texts.indexOf('Clean the build')).toBeGreaterThan(-1)
  expect(texts.indexOf('Clean the build')).toBeLessThan(texts.indexOf('Run this command?'))
  expect(texts.filter(one => one === 'Clean the build')).toHaveLength(1)
  expect(texts.filter(one => one === 'Run this command?')).toHaveLength(1)
  expect(texts.filter(one => one.startsWith('Permission ·'))).toEqual([])
  // That card waits for the person: its edge is amber, and the head line counts it once
  expect(await until(async () => list.find({ type: 'Text', text: /^1 waiting for you/ }))).toBeDefined()
  expect((await list.findAll({ type: 'Box' })).filter(one => !one.key?.startsWith('outline-') && one.props.backgroundColor === AMBER)).toHaveLength(1)
  // The others see it in this chat's file, with the task it came from and nothing of the call beyond what the block shows
  await clock.advance(1000)
  const shared = () => JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}') as { prompts?: Record<string, unknown>[]; answeredPrompts?: unknown }
  expect(shared().prompts).toEqual([{ id: expect.any(String), text: 'Run this command?', title: 'Clean the build', at: expect.any(Number), kind: 'allow', about: 'Clear the build folder', detail: 'rm -rf build', isHeld: true }])
  // Not told before the app itself says the prompt is still waiting; then told once, as a question is
  await clock.advance(5000)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual([])
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual(['Clean the build has a question for you | Run this command?'])
  // Answered in Claude Code's own box, the call runs and ends: the held request gives no answer of the mod's, and the block goes,
  // here and in the file, with nothing said of a press nobody made
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' } as never)
  expect(((await answered(asked)) as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this command?' })) ? undefined : true))).toBe(true)
  expect(await promptButton(list, 'yes')).toBeUndefined()
  expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it|You said no/.test(one))).toEqual([])
  expect(await until(async () => ((await list.find({ type: 'Text', text: /waiting for you/ })) ? undefined : true))).toBe(true)
  await clock.advance(1000)
  expect([shared().prompts, shared().answeredPrompts]).toEqual([undefined, undefined])
  // The chat's own question is answered in Claude Code's box: at the top as this chat's, with where to answer and nothing to press;
  // answered at once, it is not told
  await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which colour for the nose?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Question · This chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })).toBeDefined()
  await $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toHaveLength(1)
  await list.unmount()
})

test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  // The same command already running elsewhere, as in a terminal, says nothing of this call
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeDefined()
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeDefined()
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await clock.advance(2000)
  // Seen running, it was allowed in Claude Code's own box: the block goes, the held request gives no answer of the mod's, and
  // nothing says a press was made here
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this command?' })) ? undefined : true))).toBe(true)
  expect(((await answered(asked)) as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it/.test(one))).toEqual([])
  // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
  files.set('settings:allow', '1')
  await $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } } as never)
  await clock.advance(1000)
  expect(await list.find({ type: 'Text', text: 'Write the file notes.md?' })).toBeUndefined()
  await list.unmount()
})

test("another chat's open prompt shows amber with that chat's name and nothing to allow it with, before the chats that only work; on this Mac a press opens that chat, on another Mac it says where", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const asks = 'Run this command?'
  const waiting = (at: number, chat: string, title: string, link: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [], prompts: [{ id: 'toolu_1', text: asks, title: 'Interesting facts', kind: 'allow', about: 'Cross-repo duplicate files', at, isHeld: true }], link })
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
  // Each says whose it is and where it is answered: in that chat, named, on its Mac
  expect(await until(async () => list.find({ type: 'Text', text: 'Answer it in the chat “M4 GitHub”, on m4.' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “M4 Remote”, which runs on m4.' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Web chat”.' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Odd chat”.' })).toBeDefined()
  expect((await textsOf(list)).filter(one => one === 'Permission · Interesting facts')).toHaveLength(4)
  // What waits on the person comes before the chat that only works
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold)
  const questions = bold.filter(one => one.text === asks)
  expect(questions.map(one => one.props.color)).toEqual([AMBER, AMBER, AMBER, AMBER])
  expect(bold.map(one => one.text).lastIndexOf(asks)).toBeLessThan(bold.map(one => one.text).indexOf('Billing page'))
  // No press here answers another chat's prompt: no Allow, no Don't allow
  expect((await labelsOf(list)).filter(one => /^(Allow|Don't allow|Yes|No)$/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Button' })).filter(one => /^prompt-.*-(yes|no)-\d+$/.test(one.key ?? ''))).toEqual([])
  // Open chat: the M4 chat with Remote Control, by its Remote Control id, and the chat of this Mac with the app's link; the M4 chat
  // with only the app's own id there says where to answer instead
  const opens = (await list.findAll({ type: 'Button' })).filter(one => one.props.label === 'Open chat')
  expect(opens).toHaveLength(2)
  await list.press({ key: opens.find(one => String(one.key).includes('chat-rc'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01M4Remote'])
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Open chat' && String(one.key).includes('chat-w'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.includes('local_ab-12')))).toEqual(['open', 'claude://code/continue?session=local_ab-12'])
  // Answered there, its file no longer carries it, and its block leaves; with nothing going on, its chat is named no more
  files.set(`${MEMORY}/live/chat-w.json`, JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => one.props.label === 'Open chat' && String(one.key).includes('chat-w')) ? undefined : true))).toBe(true)
  expect((await textsOf(list)).filter(one => one.includes('Web chat'))).toEqual([])
  await list.unmount()
})

test("a message the chat passes to a task is asked with that task's name and the message whole, never a tool's own name; answered in Claude Code's own box, refused, allowed or interrupted, its block goes as the call ends with nothing said of a press", async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the cards', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the panel cards', prompt: 'fix the cards' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const message = 'Send this message to the task “Fix the panel cards”?'
  const gone = async (text: string) => until(async () => ((await list.find({ type: 'Text', text })) ? undefined : true))
  const first = $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'Make the buttons bigger too' } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: message }))).toBeDefined()
  // The chat's own call: at the top as this chat's, the message whole in the block
  expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Make the buttons bigger too' })).toBeDefined()
  expect([(await promptButton(list, 'yes'))?.props.label, (await promptButton(list, 'no'))?.props.label]).toEqual(['Allow', "Don't allow"])
  // No tool's own name anywhere on it
  expect((await textsOf(list)).some(one => one.includes('SendMessage'))).toBe(false)
  // How each answer given in Claude Code's own box ends: the block goes, the held request passes on with no answer of the mod's
  for (const [tool, input, laid, asks, agent] of [
    ['SendMessage', { to: 'a1', message: 'Make the buttons bigger too' }, 'refuse', message, undefined],
    ['SendMessage', { to: 'a1', message: 'One more thing' }, '', message, undefined],
    ['Bash', { command: 'make clean', description: 'Clean up' }, 'interrupt', 'Run this command?', 'a1'],
  ] as const) {
    const held = tool === 'SendMessage' && laid === 'refuse' ? first : $.classic.PermissionRequest({ tool_name: tool, tool_input: input, ...(agent ? { agent_id: agent } : {}) } as never)
    expect(await until(async () => list.find({ type: 'Text', text: asks }))).toBeDefined()
    if (laid) files.set(laid, tool)
    await $.tool.call({ tool, ...input, ...(agent ? { agentId: agent } : {}) } as never)
    if (laid) files.delete(laid)
    expect([tool, laid, ((await answered(held)) as { decision?: unknown } | undefined)?.decision]).toEqual([tool, laid, undefined])
    expect(await gone(asks)).toBe(true)
    expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it|You said no|It ended before you answered/.test(one))).toEqual([])
  }
  await list.unmount()
})

test("another chat's prompt shows with its task's name, or with none as that chat's own, never as this chat's; an answer an older version's file still lists is not shown", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW }, { id: 'toolu_7', text: 'Open a web page on example.com?', title: 'Tidy', kind: 'allow', at: NOW + 1 }], answeredPrompts: [{ id: 'toolu_8', text: 'Send this message to the task “Tidy”?', title: 'Tidy', kind: 'allow', answered: 'yes', done: 'it was sent', at: NOW, endedAt: NOW }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Count files' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Open a web page on example.com?' })).toBeDefined()
  const texts = await textsOf(list)
  expect(texts.filter(one => /^Permission/.test(one))).toEqual(['Permission', 'Permission · Tidy'])
  expect(texts.filter(one => one === 'Answer it in the chat “Other chat”.')).toHaveLength(2)
  expect(texts.filter(one => /Send this message|You allowed it|it was sent/.test(one))).toEqual([])
  await list.unmount()
})

test("Allow on a prompt's block allows the call as Claude Code's own box would, on the press alone: the block goes at once and one grey line says what was pressed", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } } as never)
  const key = String((await until(async () => promptButton(list, 'yes')))?.key)
  // Pressed twice at once, as a double click: one answer. The held request ends with the press, with no second gone by
  await Promise.all([list.press({ key }), list.press({ key }).catch(() => undefined)])
  expect(((await answered(asked)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  expect(await until(async () => ((await promptButton(list, 'yes')) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeUndefined()
  // One grey line, where the block was: no box, no colour, nothing of what the call then does
  const lines = await until(async () => ((await pressedLines(list)).length ? pressedLines(list) : undefined))
  expect(lines?.map(one => [one.text, one.props.dimColor, one.props.color])).toEqual([['✓ You pressed “Allow”', true, undefined]])
  // The call runs and ends: nothing more is said of it
  await $.tool.call({ tool: 'Bash', command: 'npm test', description: 'Run the tests' } as never)
  await clock.advance(1000)
  expect((await pressedLines(list)).map(one => one.text)).toEqual(['✓ You pressed “Allow”'])
  expect((await textsOf(list)).filter(one => /You allowed it|it ran|running now/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.color === '#26A269' || one.props.color === AMBER).map(one => one.text)).toEqual([])
  // The chat's own prompt to start a task, allowed: the task takes its card, and nothing on that card waits for the person
  const input = { description: 'Show scan numbers', prompt: 'show the scan numbers', run_in_background: true }
  const started = $.classic.PermissionRequest({ tool_name: 'Agent', tool_input: input } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' }))).toBeDefined()
  await list.press({ key: String((await until(async () => promptButton(list, 'yes')))?.key) })
  expect(((await answered(started)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  await $.tool.call({ tool: 'Agent', ...input } as never)
  await $.agent.spawn({ ...spawn, description: 'Show scan numbers', prompt: 'show the scan numbers' } as never)
  await clock.advance(1000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Show scan numbers' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /waiting for you/ })).toBeUndefined()
  expect(await promptButton(list, 'yes')).toBeUndefined()
  await list.unmount()
})

test("Don't allow on a prompt's block refuses the call on the press alone: the chat's own turn stops, and a task is told and carries on; one grey line says it, at the top for the chat's and on the task's card for its own", async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'tidy up', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Tidy the repo', prompt: 'tidy up' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const said = "✓ You pressed “Don't allow”"
  const own = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf dist', description: 'Delete the build' } } as never)
  await list.press({ key: String((await until(async () => promptButton(list, 'no')))?.key) })
  expect(((await answered(own)) as { decision?: unknown }).decision).toEqual({ behavior: 'deny', message: expect.stringContaining("pressed Don't allow"), interrupt: true })
  expect(await until(async () => ((await promptButton(list, 'no')) ? undefined : true))).toBe(true)
  expect((await until(async () => ((await pressedLines(list)).length ? pressedLines(list) : undefined)))?.map(one => [one.text, one.props.dimColor])).toEqual([[said, true]])
  // The chat's own line is above the cards; the task's own comes on its card, under its title
  const before = await textsOf(list)
  expect(before.indexOf(said)).toBeLessThan(before.indexOf('Tidy the repo'))
  const work = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'git clean -fd', description: 'Clean the tree' }, agent_id: 'a1' } as never)
  expect(await until(async () => list.find({ type: 'Markdown', text: 'Clean the tree' }))).toBeDefined()
  await list.press({ key: String((await until(async () => promptButton(list, 'no')))?.key) })
  const decision = ((await answered(work)) as { decision?: { behavior?: string; interrupt?: unknown; message?: string } }).decision
  expect([decision?.behavior, decision?.interrupt]).toEqual(['deny', undefined])
  expect(decision?.message).toContain('continue without it')
  expect(await until(async () => ((await pressedLines(list)).length === 2 ? true : undefined))).toBe(true)
  const after = await textsOf(list)
  expect(after.lastIndexOf(said)).toBeGreaterThan(after.indexOf('Tidy the repo'))
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeUndefined()
  expect(after.filter(one => /You said no|told Claude|waiting for what you say next/.test(one))).toEqual([])
  await list.unmount()
})

test("Claude Code's own question or plan has nothing to press on its block: it says where to answer it", async ($, on) => {
  world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  for (const [tool, input, asks, where] of [
    ['AskUserQuestion', { questions: [{ question: 'Which colour?' }] }, 'Which colour?', 'Pick your answer in the box at the bottom of this chat.'],
    ['ExitPlanMode', { plan: 'First the nose, then the ears.' }, 'Approve this plan?', 'Answer it in the box at the bottom of this chat.'],
  ] as const) {
    // (not held: the request passes on at once, for Claude Code's own box)
    const r = await answered($.classic.PermissionRequest({ tool_name: tool, tool_input: input } as never))
    expect([tool, (r as { decision?: unknown } | undefined)?.decision]).toEqual([tool, undefined])
    expect(await until(async () => list.find({ type: 'Text', text: asks }))).toBeDefined()
    expect(await list.find({ type: 'Text', text: 'Question · This chat' })).toBeDefined()
    expect(await list.find({ type: 'Text', text: where })).toBeDefined()
    expect((await list.findAll({ type: 'Button' })).filter(one => String(one.key ?? '').startsWith('prompt-'))).toEqual([])
    await $.tool.call({ tool, ...input } as never)
    expect(await until(async () => ((await list.find({ type: 'Text', text: asks })) ? undefined : true))).toBe(true)
  }
  await list.unmount()
})

test("another chat's held prompt has no Allow or Don't allow here, only where to answer it; an answer a file leaves for this chat's own prompt answers nothing", async ($, on) => {
  const { files, clock, wake } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW, isHeld: true }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Markdown', text: 'Count files' }))).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).filter(one => String(one.key ?? '').startsWith('prompt-'))).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Other chat”.' })).toBeDefined()
  // This chat's own prompt: an Allow left in a file, as another chat or another Mac could leave one, does not answer it
  let settled = false
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make', description: 'Build it' } } as never).then(r => ((settled = true), r))
  const allow = await until(async () => promptButton(list, 'yes'))
  const id = String(allow?.key ?? '').replace(/^prompt-this-/, '').replace(/-yes-\d+$/, '')
  expect(id).not.toBe('')
  for (const [n, choice] of ['yes', 'Allow', 'allow'].entries()) files.set(`${MEMORY}/live/answers/engine-id/${n}-a.json`, JSON.stringify({ card: `prompt:${id}`, choice, isReply: false, ask: 'Run this command?', askAt: NOW, at: NOW + 6000 }))
  await clock.advance(5000)
  wake()
  await clock.advance(1000)
  wake()
  expect(settled).toBe(false)
  expect([...files.keys()].filter(path => path.includes('/live/answers/engine-id/'))).toEqual([])
  expect((files.get(`${MEMORY}/log.md`) ?? '')).toContain('left in a file put away unread')
  // Its own Allow, pressed in this chat's panel, still answers it
  await list.press({ key: String((await promptButton(list, 'yes'))?.key) })
  expect(((await answered(asked)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  await list.unmount()
})

test("a call Claude Code refuses a background task with no prompt, as auto mode does, asks nothing when it is no command the person could run: nothing waits on the card and the task is told nothing more; a failing call whose output only holds those words is no refusal; a blocked command never replaces a question already on the card; Don't allow tells the task to carry on without it and never to reach it by other means, and pressed once the task has ended it does not start it again; and Claudopus never lets the call through itself", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  const ended = new Set<string>()
  const { files, clock, resumed, appended, pressRuns } = world(on, { agents, ended })
  // Beneath the mod the engine would put each of the checks below to its mode, which settles the ask; the refused calls are Claude
  // Code's own to refuse, with no prompt
  on('tool.check', (_, e, next) => (String((e as { tool_use_id?: unknown }).tool_use_id).startsWith('chk') ? ({ decision: 'ask' } as never) : next(e)))
  await $.session.start(start)
  await $.prompt.submit({ text: 'write the notes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Write the notes', prompt: 'write the notes' } as never)
  const logLines = (words: string) => (files.get(`${MEMORY}/log.md`) ?? '').split('\n').filter(line => line.includes(words))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const mine = () => [...appended, ...resumed].filter(one => one.startsWith('a1: '))
  // A search that fails, whose output holds Claude Code's words, is no refusal
  files.set('fails', "notes.md: Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access].")
  await $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'grep -r denied notes.md # fails', tool_use_id: 'g1' } as never)
  await clock.advance(1000)
  expect(logLines('refusal of ')).toEqual([])
  // A change to a file Claude Code refused: there is nothing the person could run, so nothing is asked of them. The card is not
  // amber, nothing is counted as waiting, and the task hears only Claude Code's own refusal
  const call = { tool: 'Edit', agentId: 'a1', file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }
  files.set('auto-refuse', 'Edit')
  await $.tool.call({ ...call, tool_use_id: 'e1' } as never)
  files.delete('auto-refuse')
  await clock.advance(1000)
  expect(await until(async () => (logLines('refusal of Edit for a1: nothing the person could run, so nothing is asked').length ? true : undefined))).toBe(true)
  expect(['its card is shown', Boolean(await until(async () => (await list.findAll({ type: 'Button' })).find(one => one.key === 'stop-a1')))]).toEqual(['its card is shown', true])
  const texts = await textsOf(list)
  expect(texts.filter(one => /Claude Code blocked|waiting for you|^Permission|^Question/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Box' })).filter(one => one.props.backgroundColor === AMBER)).toEqual([])
  expect((await labelsOf(list)).filter(one => /^(Allow|Don't allow)$|without it|another way|Leave it out/.test(one))).toEqual([])
  expect(logLines('put to the person on its card')).toEqual([])
  expect(mine()).toEqual([])
  const check = (id: string) => $.tool.check({ tool: 'Edit', input: { file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-2')).decision).toBe('ask')
  // A command it blocked while the card asks the task's own question never replaces that question
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which notes first?', choices: ['The old ones'] } as never)
  files.set('auto-refuse', 'Bash')
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b0', command: 'wc -l notes.md', description: 'Count the lines' } as never)
  await clock.advance(1000)
  expect(await until(async () => (logLines('not put on its card: its card asks something already').length ? true : undefined))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Which notes first?' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: BLOCKED })).toBeUndefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  // A command it blocked with nothing asked on the card is asked; Don't allow tells the task, still at work, to carry on without
  // it, never to get there another way, and runs nothing
  const deny = async () => list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(one => /^ask-a1-deny-/.test(one.key ?? ''))))?.key ?? '' })
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b1', command: 'wc -l notes.md', description: 'Count the lines' } as never)
  await clock.advance(1000)
  expect(['asked for the command', Boolean(await until(async () => list.find({ type: 'Text', text: BLOCKED })))]).toEqual(['asked for the command', true])
  expect(logLines('put to the person on its card')).toHaveLength(1)
  // Words on it go to the task, which answers inside the same block; it stays, waiting for the press, and runs nothing
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith('ask-a1-words-field-')))
  await list.input({ key: field?.key ?? '', text: 'Why count them?' } as never)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('about the command Claude Code refused you (wc -l notes.md)')))).toContain('“Why count them?”')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'To size the notes before I split them.' } as never)
  expect(await until(async () => (await list.findAll({ type: 'Markdown' } as never)).map(one => String(one.props.text ?? '')).find(one => one.includes('**The answer:**')))).toContain('**You asked:** Why count them?\n\n**The answer:** To size the notes before I split them.')
  expect(await list.find({ type: 'Text', text: BLOCKED })).toBeDefined()
  expect(pressRuns).toEqual([])
  await deny()
  const told = await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))
  expect(told).toContain(`pressed "Don't allow" when asked whether to run the command Claude Code refused you (wc -l notes.md)`)
  expect(told).toContain('Carry on without it, and say in your report what was left out.')
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect((await pressedLines(list)).map(one => [one.text, one.props.dimColor])).toEqual([["✓ You pressed “Don't allow”", true]])
  // (its next step reads that, so nothing of the press is left to send it when it ends)
  await steps($, 1, 'm', 'a1')
  await clock.advance(1000)
  // Pressed once the task has ended, nothing starts it again
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b2', command: 'wc -c notes.md', description: 'Count the letters' } as never)
  files.delete('auto-refuse')
  await clock.advance(1000)
  expect(['asked again for the next command', Boolean(await until(async () => list.find({ type: 'Text', text: BLOCKED })))]).toEqual(['asked again for the next command', true])
  // Pressed once the task has ended, having handed in its result, nothing starts it again
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-end', agentId: 'a1', message: 'The notes are written, without the files Claude Code refused.' } as never)
  agents.a1 = 'completed'
  ended.add('a1')
  await $.turn.complete({ answer: 'The notes are written, without the files Claude Code refused.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  const before = appended.filter(one => one.startsWith('a1: ')).length
  await deny()
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect([resumed.filter(one => one.startsWith('a1: ')), appended.filter(one => one.startsWith('a1: ')).length]).toEqual([[], before])
  expect(pressRuns).toEqual([])
  await list.unmount()
})

test("a command Claude Code blocked a task from running is asked on its card as a Permission block, the command whole with why and where it would run, Allow and Don't allow; nothing runs but on that Allow (not Don't allow, not a task's own question with a button of that name, not waiting), and the press changes no permission; the press runs exactly that command once, as the person's, shows one grey line of the press and one quiet line while it runs, never the command again nor a drawing of the whole panel at each look at it (17 Nov, the box that flashed); its output is told to a task at a step, and kept for the next step of one that ended, with a grey line and nothing to press, never sent from a timer; a long one is stopped at its limit, and Stop stops it", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  // (its clock moves bare, with no hook of the mod after each move: nothing here may go from a timer)
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
  // The buttons of the block and of the running command's line, by their keys (the card's own Stop is the task's)
  const mine = async () => (await list.findAll({ type: 'Button' })).filter(one => /^ask-a1-|^runs-a1-/.test(one.key ?? ''))
  const buttons = async () => (await mine()).map(one => String(one.props.label))
  const pressOn = async (part: string) => list.press({ key: (await until(async () => (await mine()).find(one => (one.key ?? '').includes(part))))?.key ?? '' })
  const stops = () => pressRuns.filter(argv => argv[1] === 'stop').length
  const details = async () => (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? ''))
  // Don't allow runs nothing, and tells the task to carry on without it
  await refuse('b00', { command: 'dig +short NS example.net', description: 'Look up the name servers' })
  expect(await until(async () => list.find({ type: 'Text', text: BLOCKED }))).toBeDefined()
  // (only its two buttons answer it: words typed on it go to the task and run nothing)
  expect(await buttons()).toEqual(['Allow', "Don't allow"])
  expect((await list.findAll({ type: 'Input' } as never)).map(one => one.props.placeholder)).toEqual(['Answer in words'])
  await pressOn('-deny-')
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))).toBeDefined()
  expect(pressRuns).toEqual([])
  // Nor does a task's own question with a button of that name, over the same command
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Shall I go on?', choices: ['Allow', 'Leave it'], copy: 'dig +short NS example.org' } as never)
  await pressOn('-choice-0-')
  await clock.advance(10_000)
  expect(pressRuns).toEqual([])
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  const command = "dig +short NS example.com @ns1.example.net | sort # it's the person's own"
  await refuse('b1', { command, description: 'Look up the name servers' })
  // The block: a permission on the task's own card, amber, counted once; the command whole; one line under it of where and how
  // long Allow would run it and why Claude Code blocked it (its reason alone, none of its words for the model); and the two buttons
  const question = await until(async () => list.find({ type: 'Text', text: BLOCKED }))
  expect([question?.props.color, question?.props.bold]).toEqual([AMBER, true])
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: command })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^1 waiting for you/ })).toBeDefined()
  expect((await details()).filter(one => one.startsWith('Runs once in '))).toEqual([expect.stringMatching(/^Runs once in \S+, for at most 10 min · blocked as “Unauthorized Access”\.$/)])
  expect((await details()).filter(one => /If you have other tasks|settings|Do it another way|Leave it out|it was Permission|Why: /.test(one))).toEqual([])
  expect(await buttons()).toEqual(['Allow', "Don't allow"])
  expect((await labelsOf(list)).filter(one => /^(Run it|Carry on without it|Send now|Copy|Open in Terminal|Allow once|Deny)$/.test(one))).toEqual([])
  // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
  await clock.advance(60_000)
  expect(pressRuns).toEqual([])
  const check = (id: string) => $.tool.check({ tool: 'Bash', input: { command, description: 'Look up the name servers' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-1')).decision).toBe('ask')
  // Pressed (twice at once, as a double click): run once, exactly as shown, by Claudopus's runner in the chat's folder
  const key = (await until(async () => (await mine()).find(one => (one.key ?? '').includes('-allow-'))))?.key ?? ''
  await Promise.all([list.press({ key }), list.press({ key }).catch(() => undefined)])
  expect(await until(async () => (pressRuns.length ? pressRuns : undefined))).toHaveLength(1)
  const [runner, how, ran, out, folder] = pressRuns[0] ?? []
  expect([String(runner).endsWith('/bin/run-it'), how, ran, folder]).toEqual([true, 'start', command, '/repo'])
  expect(String(out)).toMatch(/\/runs\/.+\.log$/)
  // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('pressed "Allow" on your card') && one.includes('it is running for them now') && one.includes(`What it prints goes to ${out}`)))).toBeDefined()
  expect((await check('chk-2')).decision).toBe('ask')
  // (its next step reads that, so nothing of the press is left to send it when it ends)
  await steps($, 1, 'm', 'a1')
  // The block went with the press: one grey line says what was pressed
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect((await pressedLines(list)).map(one => [one.text, one.props.dimColor])).toEqual([['✓ You pressed “Allow”', true]])
  // Running: one quiet line with how long it has run, and Stop; the command is not shown again
  files.set(String(out), 'ns1.example.net.\n')
  await clock.advance(5000)
  const runTime = async () => (await list.findAll({ type: 'Text' })).find(t => /^ · \d+[hms]/.test(String(t.text)))?.text
  const running = await until(async () => list.find({ type: 'Text', text: 'Running your command' }))
  expect(running?.props.dimColor).toBe(true)
  expect(await runTime()).toBeDefined()
  expect(await list.find({ type: 'Text', text: command })).toBeUndefined()
  expect((await textsOf(list)).filter(t => /Claudopus is running it|You allowed it/.test(t))).toEqual([])
  expect(await buttons()).toEqual(['Stop'])
  // While it prints, each look at it every 5 s draws nothing: the whole panel is drawn again only as calmly as for any running
  // work, every ten seconds at most
  redraws.count = 0
  for (let i = 0; i < 12; i++) (files.set(String(out), `ns1.example.net.\nline ${i}\n`), await clock.advance(5000))
  expect(redraws.count).toBeLessThanOrEqual(8)
  // The task ends meanwhile. The command's end starts nothing: what it printed is kept for the task's next step, its card says
  // so in one grey line, and there is nothing to press
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
  const kept = await until(async () => list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" }))
  expect(kept?.props.dimColor).toBe(true)
  expect(await buttons()).toEqual([])
  expect((await labelsOf(list)).includes('Send now')).toBe(false)
  await clock.advance(90_000)
  expect(await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })).toBeDefined()
  expect(resumed.filter(one => one.startsWith('a1: '))).toEqual([])
  expect(appended.filter(one => one.startsWith('a1: ') && one.includes('ns2.example.net.'))).toEqual([])
  // Its next step, started by whatever starts it, reads it there: what ran, how it ended, where the whole is, and that it is no permission
  agents.a1 = 'running'
  await steps($, 2, 'm', 'a1')
  const woke = await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('ns2.example.net.')))
  expect(woke).toContain(`ran for them, exactly as shown, once, as their own, in /repo:\n${command}\nIt ended well after`)
  expect(woke).toContain(`Its whole output is in ${out}`)
  expect(woke).toContain('it is no permission')
  expect(pressRuns).toHaveLength(1)
  expect(resumed.filter(one => one.startsWith('a1: '))).toEqual([])
  expect(await until(async () => ((await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })) ? undefined : true))).toBe(true)
  // One sent to the background runs an hour at most; Stop on its line stops it, and the task, at a step, is told at once
  await $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/notes.md', tool_use_id: 'r1' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', agentId: 'a1', tool_use_id: 'n1', text: 'Checking the name servers answer' } as never)
  await refuse('b2', { command: 'npm run soak', description: 'Run the soak test', run_in_background: true })
  expect(await until(async () => (await details()).find(one => /^Runs once in \S+, for at most 1 hour · blocked as /.test(one)))).toBeDefined()
  await pressOn('-allow-')
  expect(await until(async () => (pressRuns.length === 2 ? true : undefined))).toBe(true)
  await pressOn('-stop-')
  expect(await until(async () => (stops() === 1 ? true : undefined))).toBe(true)
  await clock.advance(5000)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run soak') && one.includes('was stopped by the person')))).toBeDefined()
  expect(await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })).toBeUndefined()
  // Its end is never the card's line beside the dots, which keeps the task's own words (19 Nov, "Your command ended after 20s"
  // stood there until the task wrote again): it is a row of the card's ended commands, and a grey line for a minute where it ran
  expect((await until(async () => list.find({ type: 'Text', text: /^You stopped your command after / })))?.props.dimColor).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Checking the name servers answer' })).toBeDefined()
  expect((await textsOf(list)).filter(t => /^(Your command (ended|failed|stopped|didn't)|You stopped)/.test(t) && !/^You stopped your command after \d/.test(t))).toEqual([])
  expect((await labelsOf(list)).filter(one => /commands? ended/.test(one))).toEqual(['2 commands ended'])
  // (a minute on, the next drawing has it no more)
  await clock.advance(61_000)
  await $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/soak.log', tool_use_id: 'r2' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: /^You stopped your command/ })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Checking the name servers answer' })).toBeDefined()
  // One held open with its own timeout of a minute is stopped by Claudopus at that limit
  await refuse('b3', { command: 'npm run slow', description: 'Run the slow check', timeout: 60_000 })
  await pressOn('-allow-')
  expect(await until(async () => (pressRuns.filter(argv => argv[2] === 'npm run slow').length === 1 ? true : undefined))).toBe(true)
  await clock.advance(30_000)
  expect(stops()).toBe(1)
  await clock.advance(35_000)
  expect(await until(async () => (stops() === 2 ? true : undefined))).toBe(true)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run slow') && one.includes('was stopped at its limit of 1 min')))).toBeDefined()
  await list.unmount()
})
