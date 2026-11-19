// The asking card: an ask, its Copy, buttons and reply box

// What a key's block and a password's block ask, and where each says it goes
const GITHUB_ASKED = "GITHUB_TOKEN is needed to run this task's command."
const KEY_GOES = "It goes only into this Mac's keychain."
const ADMIN_ASKED = "This Mac's password is needed to run this as admin."
const ADMIN_GOES = 'It goes only to this command and is never saved.'
const AMBER = '#E5A50A'
const PURPLE = '#8A63F0'
type Drawn = { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; text?: string; props: Record<string, unknown> }[]>; press: (q: { key: string }) => Promise<unknown>; input: (q: { key: string; text: string }) => Promise<unknown> }
// The one box above the chat as the bar draws it: its heading line, its one field by what it asks for, what Enter does, and
// its buttons
const oneBox = async (bar: Drawn) => {
  const texts = (await bar.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  return {
    head: texts.find(text => text.startsWith('↳')) ?? '',
    fields: (await bar.findAll({ type: 'Input' })).map(one => one.props.placeholder),
    enter: texts.find(text => /^Enter sends|carries the task on|Goes only to/.test(text)) ?? '',
    buttons: (await bar.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(label => ['Send', 'Close', 'Cancel'].includes(label)),
  }
}
// (no line under the box says what Enter does)
const SENDS = ''
const SENDS_KEY = ''
// The empty space a drawing of the list holds: any part held taller than the two rows of a card's line, and the list held taller
// than the view (`rows`). None, at any moment after an answer (19 Nov, Dima's screenshot: "There is still a gap")
const emptySpace = async (pane: Drawn, rows: number) => [
  ...(await pane.findAll({ type: 'Box' })).filter(one => Number(one.props.height ?? 0) > 2).map(one => `${one.key ?? 'a part'} held ${String(one.props.height)} rows`),
  ...(await pane.findAll({ type: 'Box' })).filter(one => Number(one.props.minHeight ?? 0) > rows).map(one => `the list held at ${String(one.props.minHeight)} rows`),
]
// An answer in words on the desktop: Answer in words on the card's block opens the one box above the chat, and what is sent
// from it is the answer. Gives the box it was typed in
const inWords = async (pane: Drawn, bar: Drawn, card: string, text: string) => {
  const open = await until(async () => (await pane.findAll({ type: 'Button' })).find(one => new RegExp(`^ask-${card}-inbar-\\d+$`).test(one.key ?? '')))
  await pane.press({ key: open?.key ?? '' })
  const box = await until(async () => (await bar.findAll({ type: 'Input' })).find(one => (one.key ?? '').startsWith(`band-${card}-reply-answer-`)))
  await bar.input({ key: box?.key ?? '', text })
  return box
}
// The buttons of a card's question, in the order drawn
const askButtons = async (pane: Drawn, card: string) => (await pane.findAll({ type: 'Button' })).filter(one => (one.key ?? '').startsWith(`ask-${card}-`)).map(one => String(one.props.label))

test('work that needs the person\'s hands asks: its card stands out first with the question in its block, the text to paste with its Copy, and only the answers the task gave, with Answer in words after them; what is typed goes in the one box above the chat, and each answer goes back to the work', async ($, on) => {
  // Once its run has ended, a work's chat takes no more lines
  const ended = new Set<string>()
  const { played, notified, appended, terminals, submitted, resumed, shown, files } = world(on, { ended })
  const clip: string[] = []
  on('ui.copy', (_, e) => (clip.push(e.text), { value: { isCopied: true } }) as never)
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'Paste this code on the GitHub page that opened.', copy: 'ABCD-1234' } as never)
  expect(asked.result).toContain('Shown on your card with a Copy button for the text and Answer in words')
  // No button is added to a question: the work is told it has none
  expect(asked.result).toContain('It has no buttons')
  expect(played.length).toBeGreaterThan(0)
  expect(notified).toContain('Check the ears has a question for you | Paste this code on the GitHub page that opened.')
  const titles = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  expect(titles.indexOf('Check the ears')).toBeGreaterThan(-1)
  expect(titles.indexOf('Check the ears')).toBeLessThan(titles.indexOf('Hide the repo'))
  // Its block: a dim label of its kind, then the question in amber, bold
  expect((await list.find({ type: 'Text', text: 'Question' }))?.props.dimColor).toBe(true)
  const question = await list.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' })
  expect([question?.props.color, question?.props.bold]).toEqual([AMBER, true])
  // Nothing to press but its Copy and Answer in words, and nothing is typed inside the panel
  expect(await until(async () => ((await askButtons(list, 'a2')).includes('Answer in words') ? askButtons(list, 'a2') : undefined))).toEqual(['Copy', 'Answer in words'])
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  // The code is shown with one Copy button, which puts it on the clipboard and says so
  expect((await list.find({ type: 'Text', text: 'ABCD-1234' }))?.props.mono).toBe(true)
  await pressed(list, 'ask-a2-copy')
  expect(clip).toEqual(['ABCD-1234'])
  expect((await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Copied')))).toBeDefined()
  // Its Details tab has the same block, and clearing it takes it away
  const ears = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  expect((await ears.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' }))?.props.color).toBe(AMBER)
  expect(await ears.find({ type: 'Text', text: 'Question' })).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: '' } as never)
  expect(await list.find({ type: 'Text', text: 'ABCD-1234' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Question' })).toBeUndefined()

  // An ask for a go-ahead carries the work's own buttons, each an answer. A choice that would only leave it open is left out,
  // and the work is told so; the one pressed goes back to the work and the block goes, one grey line saying what was pressed
  const goAhead = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'May I delete the old repo?', choices: ['Approve', 'Not now', 'Keep it'] } as never)
  expect(goAhead.result).toContain('the buttons Approve, Keep it and Answer in words')
  expect(goAhead.result).toContain('A choice that only leaves the question open (Not now, Later, Skip, Cancel) was left out')
  expect(await until(async () => ((await askButtons(ears, 'a2')).length ? askButtons(ears, 'a2') : undefined))).toEqual(['Approve', 'Keep it', 'Answer in words'])
  const approve = (await ears.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')
  await ears.press({ key: approve?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Approve"')))).toContain('May I delete the old repo?')
  expect(await askButtons(list, 'a2')).toEqual([])
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You answered “Approve”' })))?.props.dimColor).toBe(true)
  // Or an answer in the person's own words: Answer in words opens the one box above the chat, never one in the panel or Details.
  // One that is none of the ask's buttons, such as a question back, does not settle it: the ask stays with the reply under it
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted'] } as never)
  expect(await until(async () => ((await askButtons(list, 'a2')).length ? askButtons(list, 'a2') : undefined))).toEqual(['Submitted', 'Answer in words'])
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Answer in words')?.key ?? '' })
  const box = await until(async () => (await bar.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith('band-a2-reply-answer-')))
  expect(await oneBox(bar)).toEqual({ head: '↳ Your answer to “Check the ears”', fields: ['Type your answer'], enter: SENDS, buttons: ['Send', 'Close'] })
  // (Details keeps its message box at its bottom, the task's own, which answers no question)
  const askFields = async (pane: typeof list) => (await pane.findAll({ type: 'Input' } as never)).filter(one => !/^details-.*-reply-change-/.test(one.key ?? ''))
  for (const pane of [list, ears]) expect(await askFields(pane)).toEqual([])
  await bar.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  const toWork = (await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))) ?? ''
  expect(toWork).toContain('Submit it to the plugin directory.')
  expect(toWork).toContain('does not settle your question by itself')
  // At work on the reply, the ask is not waiting on the person: the small card has the reply in one grey line in its place, Details
  // the question in the work's purple with the reply under it, and nothing to press or type in either or above the chat
  const waiting = '✓ You answered “Where do I do that?”'
  for (const pane of [list, ears]) {
    expect((await until(async () => pane.find({ type: 'Text', text: waiting })))?.props.dimColor).toBe(true)
    expect((await pane.find({ type: 'Text', text: 'Submit it to the plugin directory.' }))?.props.color).toBe(pane === list ? undefined : PURPLE)
    expect(await askButtons(pane, 'a2')).toEqual([])
    expect(await askFields(pane)).toEqual([])
  }
  expect(await until(async () => ((await bar.findAll({ type: 'Input' } as never)).length ? undefined : true))).toBe(true)
  // The work's next step reads it: the line says what was answered still, and nothing of who reads it
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await list.find({ type: 'Text', text: waiting })).toBeDefined()
  // The work asks again: amber again, with its answers back and an empty box
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5b', agentId: 'a2', text: 'It is under Manage, then Submit new. Done?', choices: ['Done'] } as never)
  expect((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' }))?.props.color).toBe(AMBER)
  expect(await askButtons(list, 'a2')).toEqual(['Done', 'Answer in words'])
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Answer in words')?.key ?? '' })
  const again = await until(async () => (await bar.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith('band-a2-reply-answer-')))
  expect(again?.key).not.toBe(box?.key)
  expect(again?.props.value ?? '').toBe('')
  // Half a reply typed, then Done pressed twice: the answer goes once, the box goes with it, and the half reply is not left for
  // the next ask
  await bar.input({ key: again?.key ?? '', text: 'Not y', kind: 'change' } as never)
  const done = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? ''
  await Promise.all([list.press({ key: done }), list.press({ key: done }).catch(() => undefined)])
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Done"')))).toContain('Submit new. Done?')
  expect(appended.filter(line => line.startsWith('a2: ') && line.includes('"Done"'))).toHaveLength(1)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Done”' }))).toBeDefined()
  expect(await until(async () => ((await bar.findAll({ type: 'Input' } as never)).length ? undefined : true))).toBe(true)
  // The work writes a line: it is back under its title
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I submitted it.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I submitted it.' }))).toBeDefined()
  // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' } as never)
  ended.add('a2')
  expect(await until(async () => ((await askButtons(list, 'a2')).length ? askButtons(list, 'a2') : undefined))).toEqual(['Answer in words'])
  const box3 = await inWords(list, bar, 'a2', 'claudopus')
  expect(box3?.props.value ?? '').toBe('')
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('in their own words: claudopus')))).toContain('Continue the task with this answer')
  expect(submitted.some(line => line.includes('claudopus'))).toBe(false)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “claudopus”' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Tell me the repo name.' })).toBeUndefined()
  // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: 'Open the plugin directory and submit the form.', copy: 'Open the plugin directory page and fill in the form with the details' } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Copy')).toBe(false)
  // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k7', agentId: 'a2', text: 'Open https://claude.ai/directory/manage, press Submit new, and paste the repository.', copy: 'https://github.com/dimka3553/claudopus' } as never)
  const hrefs = async (pane: typeof list) => (await pane.findAll({ type: 'Link' })).map(one => one.props.href)
  expect(await until(async () => ((await hrefs(list)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)
  expect(await hrefs(list)).toContain('https://github.com/dimka3553/claudopus')
  expect(await until(async () => ((await hrefs(ears)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)

  // A command for the person to type is shown with its Copy and an Open in Terminal button; nothing opens by itself, and the work
  // is told to open none
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub.', command: "gh auth login --hostname 'github.com'", cwd: '/repo/site' } as never)
  expect(told.result).not.toContain('mcp__terminal__open_terminal_tab')
  expect(told.result).toContain('Do not open a terminal for it')
  expect((await list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login --hostname 'github.com'" }))?.props.mono).toBe(true)
  expect(terminals).toEqual([])
  const openedBefore = shown.length
  const openIn = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')
  expect(openIn).toBeDefined()
  expect(shown.length).toBe(openedBefore)
  // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
  await list.press({ key: openIn?.key ?? '' })
  const opened = await until(async () => shown.slice(openedBefore).find(argv => String(argv[1]).endsWith('/open.command')))
  const home = String(opened?.[1]).replace(/\/open\.command$/, '')
  expect(files.get(`${home}/command.txt`)).toBe("cd '/repo/site' && gh auth login --hostname 'github.com'")
  expect(files.get(`${home}/.zshrc`)).toContain('print -rz -- "$(<"$_claudopus_here/command.txt")"')
  expect(files.get(`${home}/.zshrc`)).toContain("cd '/repo/site'")
  expect(files.get(`${home}/open.command`)).toContain('exec /bin/zsh -i')
  // Their own history file, and their own start files where their .zshenv moves them
  expect(files.get(`${home}/.zshrc`)).toContain('HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"')
  expect(files.get(`${home}/.zshenv`)).toContain('_CLAUDOPUS_DOT="$ZDOTDIR"')
  expect(await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Typed, not run yet'))).toBeDefined()
  expect(terminals).toEqual([])
  // A folder with a quote in its name is quoted whole
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a2', text: 'Run it here.', command: 'make', cwd: "/repo/it's here" } as never)
  const before2 = shown.length
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')?.key ?? '' })
  const second = await until(async () => shown.slice(before2).find(argv => String(argv[1]).endsWith('/open.command')))
  expect(files.get(String(second?.[1]))).toContain("cd '/repo/it'\\''s here'")

  // A reply written into work that then ends without another step was never read: it starts the work again
  ended.delete('a2')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main'] } as never)
  await inWords(ears, bar, 'a2', 'main')
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main”' }))).toBeDefined()
  await $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('you ended before reading it: main')))).toContain('Which branch?')
  expect(submitted.some(line => line.includes('Which branch?'))).toBe(false)
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main”' }))).toBeDefined()
  // Nothing was ever put into the chat's own box
  expect(filled).toEqual([])
  await Promise.all([list.unmount(), ears.unmount(), bar.unmount()])
})

test('while the person types into an ask the panel holds its drawing whole, as other cards move, start and finish around it: the 15 Nov panel that jumped to its bottom and flickered with every letter typed', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Keep digging for head CTs', prompt: 'dig' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which source next?', details: 'A long explanation.\n\n- one\n- two\n- three', choices: ['Kaggle', 'TCIA'] } as never)
  for (const surface of ['desktop', 'terminal'] as const) {
    const list = await $.ui.mount({ ...LIST, surface } as never)
    const ears = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    await clock.advance(2000)
    const drawing = async (pane: typeof list) => JSON.stringify([...(await pane.findAll({ type: 'Text' })).map(one => one.text), ...(await pane.findAll({ type: 'Input' } as never)).map(one => [one.key, one.props.value])])
    const box = (await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))
    expect(box).toBeDefined()
    const [before, beforeDetails] = [await drawing(list), await drawing(ears)]
    // Each letter is one change: none of them draws the panel again, nor Details
    for (const text of ['N', 'No', 'Non', 'Non-A']) await list.input({ key: box?.key ?? '', text, kind: 'change' } as never)
    expect(await drawing(list)).toBe(before)
    // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `n-${surface}`, agentId: 'a2', text: `I am measuring the left ear on the ${surface}.` } as never)
    await clock.advance(3000)
    await list.input({ key: box?.key ?? '', text: 'Non-Asian', kind: 'change' } as never)
    expect(await drawing(list)).toBe(before)
    expect(await drawing(ears)).toBe(beforeDetails)
    // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
    await $.agent.spawn({ ...spawn, description: `Find more scans ${surface}`, prompt: 'more' } as never)
    expect(await until(async () => list.find({ type: 'Text', text: `Find more scans ${surface}` }))).toBeDefined()
    expect((await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))?.props.value).toBe('')
    // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
    await clock.advance(31_000)
    expect(await until(async () => list.find({ type: 'Text', text: `I am measuring the left ear on the ${surface}.` }))).toBeDefined()
    expect((await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))?.props.value).toBe('Non-Asian')
    // A press is the person's own move: it lets the panel go at once
    await list.input({ key: box?.key ?? '', text: 'Non-Asian heads', kind: 'change' } as never)
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `m-${surface}`, agentId: 'a2', text: `Both ears done on the ${surface}.` } as never)
    await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'TCIA')?.key ?? '' })
    expect(await until(async () => list.find({ type: 'Text', text: `Both ears done on the ${surface}.` }))).toBeDefined()
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${surface}`, agentId: 'a1', text: 'Which source next?', choices: ['Kaggle', 'TCIA'] } as never)
    await Promise.all([list.unmount(), ears.unmount()])
  }
})

test('while drawings of the panel are slow, as under seven tasks and their commands, one drawn afresh moments ago is given again as it was, buttons and all, until the gap is over, so a click amid a stream of changes names a button still there; a quick drawing and a press are drawn at once', async ($, on) => {
  const { clock } = world(on)
  // Each drawing of the panel takes 300 ms, as on 16 Nov with seven tasks at work
  const slow = { isOn: false, n: 0 }
  on('session.model', () => {
    slow.n += 1
    const until = Date.now() + (slow.isOn ? 300 : 0)
    while (Date.now() < until);
    return { value: 'claude-opus-5-5' } as never
  })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fix the nose', prompt: 'fix' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'ears' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(2000)
  // Quick drawings: every change is drawn at once
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'q0', agentId: 'a2', text: 'Quick step of the ears.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Quick step of the ears.' }))).toBeDefined()
  slow.isOn = true
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f0', agentId: 'a2', text: 'Step 0 of the ears.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Step 0 of the ears.' }))).toBeDefined()
  const keys = async () => (await list.findAll({ type: 'Button' })).map(b => b.key).join(' ')
  const before = await keys()
  // Work writing faster than a drawing reaches the app: each ask for the panel within the gap gets the drawing on screen
  for (const n of [1, 2]) {
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `f${n}`, agentId: 'a2', text: `Step ${n} of the ears.` } as never)
    expect(await list.find({ type: 'Text', text: 'Step 0 of the ears.' })).toBeDefined()
    expect(await keys()).toBe(before)
  }
  // The gap over, it is drawn afresh by itself, with the newest line
  await clock.advance(1500)
  expect(await until(async () => list.find({ type: 'Text', text: 'Step 2 of the ears.' }))).toBeDefined()
  // A press of the person's is drawn at once, whatever the gap
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f3', agentId: 'a2', text: 'Step 3 of the ears.' } as never)
  await $.agent.spawn({ ...spawn, description: 'Find more scans', prompt: 'more' } as never)
  expect(await list.find({ type: 'Text', text: 'Find more scans' })).toBeUndefined()
  await pressed(list, 'stats-open')
  expect(await until(async () => list.find({ type: 'Text', text: 'Find more scans' }))).toBeDefined()
  // The app asks for the panel with the view at the top and scrolled down in turn, as a card under the pointer changes its height:
  // within the gap each ask is given the picture on screen, buttons and all, whichever way the view stands. Each such ask drawn afresh, on 19 Nov dozens of drawings ran at once, each 7-12 s, and a press of
  // Mark as done or Close showed nothing for as long
  const DOWN = { ...LIST, props: { ...LIST.props, scroll: { offset: 6, bodyRows: 20 } }, surface: 'desktop' }
  const TOP = { ...LIST, surface: 'desktop' }
  let pane = list
  const viewAt = async (where: typeof DOWN | typeof TOP) => (await pane.unmount(), (pane = await $.ui.mount(where as never)))
  await clock.advance(5000)
  await viewAt(DOWN)
  const shown = (await pane.findAll({ type: 'Button' })).map(b => b.key).join(' ')
  const made = slow.n
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f4', agentId: 'a2', text: 'Step 4 of the ears.' } as never)
  for (const where of [TOP, DOWN, TOP, DOWN]) {
    await viewAt(where)
    expect((await pane.findAll({ type: 'Button' })).map(b => b.key).join(' ')).toBe(shown)
  }
  // (the new line, a call of the mod's own, drawn once at the first ask; the view's moves after it, none)
  expect(slow.n - made).toBe(1)
  expect(await pane.find({ type: 'Text', text: 'Step 4 of the ears.' })).toBeDefined()
  await pane.unmount()
})

test('two asks for the panel or the bar that come together, as from two windows of a chat or the engine\'s push beside the mod\'s, ask for it again only for a drawing made afresh that the engine dropped, and that ask is given it as made: they never overtake each other without end, each drawing a new pane under the pointer whose hover goes out', async ($, on) => {
  const { clock, files } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fix the nose', prompt: 'fix' } as never)
  files.set(`${MEMORY}/record-panel.on`, '')
  files.set(`mtime:${MEMORY}/record-panel.on`, String(clock.now()))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await clock.advance(2500)
  type Line = { ev: string; component?: string; held?: boolean }
  const recorded = async () => {
    await clock.advance(2100)
    const path = [...files.keys()].find(one => one.includes('/panel-record/'))
    return (files.get(path ?? '') ?? '').trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as Line)
  }
  const redraws = (lines: Line[]) => lines.filter(one => one.ev === 'redraw-all').length
  // Nothing new since the last drawing: both asks are given the panel as it was, and nothing asks for it again
  await list.redraw()
  const before = redraws(await recorded())
  await Promise.all([list.redraw(), list.redraw()])
  await new Promise<void>(done => setTimeout(() => done(), 300))
  expect(redraws(await recorded())).toBe(before)
  // The bar, made afresh at each ask: the one made while the other ask overtook it is asked for once, and given as made
  const from = (await recorded()).length
  await Promise.all([bar.redraw(), bar.redraw()])
  await new Promise<void>(done => setTimeout(() => done(), 300))
  const after = (await recorded()).slice(from)
  // (a drawing's line is written once it is given, after the call for a drawing its end made)
  const bars = after.filter(one => one.ev === 'render' && one.component === 'AbovePrompt')
  expect(bars.filter(one => !one.held).length).toBe(1)
  expect(bars.at(-1)?.held).toBe(true)
  expect(redraws(after)).toBe(1)
})

test('the bar above the prompt on the desktop, drawn as often as the panel under load, is given again as it was for a second after each drawing made afresh, and a tab of the mod\'s through a click on its buttons, so a click names one still there; both are then drawn afresh by themselves', async ($, on) => {
  const { clock, files } = world(on)
  // Each drawing of the panel takes 300 ms, as on 16 Nov with seven tasks at work; the bar's own stay quick
  const slow = { isOn: false }
  on('session.model', () => {
    const until = Date.now() + (slow.isOn ? 300 : 0)
    while (Date.now() < until);
    return { value: 'claude-opus-5-5' } as never
  })
  // (written before the chat starts, as the person's own settings: one written after is not believed)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam' }))
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fix the nose', prompt: 'fix' } as never)
  files.set(`${MEMORY}/record-panel.on`, '')
  files.set(`mtime:${MEMORY}/record-panel.on`, String(clock.now()))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await clock.advance(2500)
  slow.isOn = true
  await list.redraw()
  slow.isOn = false
  await bar.redraw()
  // Asked for again and again within the second: the drawing on screen each time
  for (const _ of [1, 2, 3]) await bar.redraw()
  await clock.advance(1500)
  await bar.redraw()
  await clock.advance(3000)
  const path = [...files.keys()].find(one => one.includes('/panel-record/'))
  const renders = (files.get(path ?? '') ?? '').trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as { ev: string; component?: string; held?: boolean }).filter(one => one.ev === 'render' && one.component === 'AbovePrompt')
  expect(renders.filter(one => one.held).length).toBeGreaterThanOrEqual(3)
  // and once the second is over, drawn afresh
  expect(renders.some((one, n) => n > 0 && renders[n - 1]?.held && !one.held)).toBe(true)
  await bar.unmount()
  // So is a tab of the mod's, Settings here, which every drawing of the panel draws again too (16 Nov: its Reset pressed, never
  // reaching the mod). What it shows of the last look for an update tells a drawing made afresh from one given again
  const looked = (min: number) => files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: clock.now() - min * 60_000, version: '0.0.1', result: 'seen' }))
  looked(5)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  const says = async () => {
    await config.redraw()
    return (await config.findAll({ type: 'Text' })).map(one => one.text ?? '').map(text => /Last checked (\d+m) ago/.exec(text)?.[1]).find(Boolean)
  }
  expect(await says()).toBe('5m')
  // From the focus on one of its buttons until the press, the drawing on screen stays, so the press names that button
  const reset = (await config.findAll({ type: 'Button' })).find(one => one.props.label === 'Reset')
  expect(reset).toBeDefined()
  await ($.ui as any).focus({ component: 'Pane', requestId: 'config', plugin: 'claudopus', element: reset?.key, isHeld: true, origin: { kind: 'person' } }).catch(() => undefined)
  looked(20)
  await clock.advance(1200)
  expect(await says()).toBe('5m')
  expect((await config.findAll({ type: 'Button' })).some(one => one.key === reset?.key)).toBe(true)
  // and once the click is over, drawn afresh
  await clock.advance(1000)
  expect(await says()).toBe('20m')
  await config.unmount()
  await list.unmount()
})

test("while the person types into a card's reply box the list's running times stand still, and move again once they stop", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const time = async () => (await list.findAll({ type: 'Text' })).map(one => one.text).find(text => /\d+s$/.test(text ?? ''))
  await clock.advance(2000)
  const before = await time()
  expect(before).toBeDefined()
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'The le', kind: 'change' } as never)
  await clock.advance(5000)
  expect(await time()).toBe(before)
  // Typing stopped for half a minute: the times move again, and the draft is still in the box
  await clock.advance(31_000)
  expect(await until(async () => ((await time()) !== before ? true : undefined))).toBe(true)
  expect((await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))?.props.value).toBe('The le')
  await list.unmount()
})

test('a button the panel draws again with the same key and the same look keeps the number the engine gave it, though the panel was drawn anew around it, so a click on the drawing still on screen names a button the engine still holds', async ($, on) => {
  world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // Each drawn button's number, by its key: the number a click names, which the engine drops with the drawing it was made in
  const numbers = async () => {
    const found = new Map<string, number>()
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return void node.forEach(walk)
      if (!node || typeof node !== 'object') return
      const one = node as { type?: string; props?: { key?: string }; press?: { handle?: number }; children?: unknown }
      if (one.type === 'Button' && one.props?.key && one.press?.handle !== undefined) found.set(one.props.key, one.press.handle)
      walk(one.children)
    }
    walk(await list.drawn())
    return found
  }
  const first = await numbers()
  const bar = [...first.keys()].filter(key => /^(stats|config|about|memory)-open-\d+$/.test(key))
  expect(bar.length).toBe(4)
  // A task starts: its card is drawn, so the whole panel is made anew, every button in it handed to the engine again
  await $.agent.spawn({ ...spawn, description: 'Fix the nose', prompt: 'fix' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Fix the nose' }))).toBeDefined()
  const second = await numbers()
  expect([...second.keys()].some(key => /^open-a1-\d+$/.test(key))).toBe(true)
  // The bar's buttons look as they did: each has the number it had, so a click on the drawing before still lands
  expect(bar.map(key => [key, second.get(key)])).toEqual(bar.map(key => [key, first.get(key)]))
  // and again as the task writes a line, its card's own buttons too
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the nose.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Looking at the nose.' }))).toBeDefined()
  const third = await numbers()
  const kept = [...second.keys()].filter(key => third.has(key))
  expect(kept.length).toBeGreaterThanOrEqual(bar.length + 1)
  expect(kept.map(key => [key, third.get(key)])).toEqual(kept.map(key => [key, second.get(key)]))
  await list.unmount()
})

test('with work running and nobody typing, the panel is drawn again at once for anything new, but for its running times alone only every ten seconds, so a button under the pointer keeps its hover and takes its click', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the chin', prompt: 'chin' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I go on?', choices: ['Approve'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = async () => JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await clock.advance(1000)
  const before = await texts()
  await clock.advance(3000)
  expect(await texts()).toBe(before)
  // Work writes a line: drawn at once. The card that waits says so with its block alone, with no line of what it last did
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'I measured the right ear.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I am looking at the chin.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I am looking at the chin.' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'I measured the right ear.' })).toBeUndefined()
  // and its time moves again within ten seconds
  const after = await texts()
  await clock.advance(11_000)
  expect(await until(async () => ((await texts()) !== after ? true : undefined))).toBe(true)
  // A press shows what it did at once
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key ?? '' })
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'May I go on?' })) ? undefined : true))).toBe(true)
  // and so does one that only opens a part of the panel, Finished, with work ended and other work running
  await $.agent.spawn({ ...spawn, description: 'Check the nose', prompt: 'nose' } as never)
  await $.turn.complete({ answer: 'Nose checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' } as never)
  await clock.advance(12_000)
  // (an ended card stays up until it is dismissed: dismissed, it is the one under Finished)
  await pressed(list, 'dismiss-a3')
  await clock.advance(2_100)
  expect(await until(async () => keyed(list, 'finished-fold'))).toBeDefined()
  const shut = await texts()
  await pressed(list, 'finished-fold')
  expect(await until(async () => ((await texts()) !== shut ? true : undefined))).toBe(true)
  await list.unmount()
})

test('a key box keeps what is typed in it without drawing it back, and holds the panel while it is typed into', async ($, on) => {
  const { keep, settle, clock, files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'get the data', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Get the data', prompt: 'data' } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret SAMPLE_USER here fetch' } as never))
  const id = '3f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'SAMPLE_USER', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  expect(field).toBeDefined()
  if (!field) return
  // The surface keeps the letters itself: the box is drawn with no value, so a drawing never puts older letters over newer ones
  expect(field.props.value).toBeUndefined()
  const before = JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await list.input({ key: field.key ?? '', text: 'made-up-na', kind: 'change' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am waiting for the made-up name.' } as never)
  await clock.advance(3000)
  expect(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))).toBe(before)
  expect((await list.findAll({ type: 'Input' } as never)).find(one => one.key === field.key)).toBeDefined()
  await list.unmount()
  await settle()
})

test('an ask outlives the work that made it: amber after the work ends, with the buttons the work gave it and none added, until the person answers', SLOW, async ($, on) => {
  const { submitted, resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run this to restart that chat yourself.', command: 'ssh m4 tmux respawn-pane -k -t claude', choices: ['Done'] } as never)
  // (it hands in its result with the question still open: that, not its turn's end, ends a task)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'I could not restart it; the command is on your card.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  // Long after it finished, the ask is still there, amber, with its own Done, its buttons for the command and Answer in words;
  // though the work has ended, its card has no Message while it asks; Dismiss puts it away, as on any ended card
  await clock.advance(10 * 60_000)
  expect((await until(async () => list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })))?.props.color).toBe(AMBER)
  expect(await until(async () => ((await askButtons(list, 'a1')).includes('Answer in words') ? askButtons(list, 'a1') : undefined))).toEqual(['Copy', 'Open in Terminal', 'Done', 'Answer in words'])
  expect((await list.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => ['Dismiss', 'Message', 'Not now'].includes(label))).toEqual(['Dismiss'])
  // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Done"') && line.includes('Run this to restart that chat yourself.')))).toBeDefined()
  expect(submitted.some(line => line.includes('Run this to restart'))).toBe(false)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })) ? undefined : true))).toBe(true)
  await Promise.all([list.unmount(), bar.unmount()])
})

test('a press on one ended work\'s ask leaves the other asks\' buttons where they were: the 14 Nov "Release it" pressed from a phone right after another card\'s, on the keys it last drew, which ran nothing', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two releases', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Linux support', prompt: 'linux' } as never)
  await $.agent.spawn({ ...spawn, description: 'Azure route', prompt: 'azure' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  for (const [id, text] of [['a1', 'Release Linux support?'], ['a2', 'Release the Azure route?']]) {
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${id}`, agentId: id, text, choices: ['Release it'] } as never)
    // (each hands in its result with the question still open: that, not its turn's end, ends a task)
    await $.tool.call({ tool: 'SubagentHandback', tool_use_id: `h-${id}`, agentId: id, message: 'Waits for your Release it.' } as never)
    await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: `turn-${id}`, reason: 'answer', agentId: id } as never)
  }
  await clock.advance(60_000)
  // The keys as the late surface last drew them, both cards amber with their buttons
  const drawn = await until(async () => {
    const releases = (await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Release it')
    return releases.length === 2 ? releases.map(b => b.key ?? '') : undefined
  })
  const linux = drawn?.find(key => key.startsWith('ask-a1-')) ?? ''
  const azure = drawn?.find(key => key.startsWith('ask-a2-')) ?? ''
  expect(linux && azure).toBeTruthy()
  await list.press({ key: linux })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
  await list.press({ key: azure }).catch(() => undefined)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('pressed "Release it"') && line.includes('Release the Azure route?')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Release the Azure route?' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

// The go-ahead for a release is one press: the task asks with its worktree, and Release it is the permission for its release run
test('Release it on a go-ahead asked with its worktree reaches the task as its answer and lets that card\'s next release run for that folder through with no second question, once: a second run is asked on the card', async ($, on) => {
  const { list, files, appended, bash, holding, grants, wake, clock } = await gated($, on)
  const gateButton = async (start: string) => (await list.findAll({ type: 'Button' })).find(b => String(b.key ?? '').startsWith(start))
  files.set('/repo/wt/.release', 'mods/claudopus/bin/release')
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-nose')
  const RELEASE = 'hold xr1; /plug/claudopus/bin/release'
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the nose fix?', details: 'It straightens the nose.', choices: ['Release it'], release: '/repo/wt' } as never)
  expect(asked.result).toContain('A press on Release it also allows your next run of the release runner for /repo/wt, once, with no second question')
  expect(await until(async () => ((await askButtons(list, 'a1')).length ? askButtons(list, 'a1') : undefined))).toEqual(['Release it'])
  // The press is the task's answer, with what it allows; it has no way back
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  const told = (await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it" in answer to your question: Release the nose fix?')))) ?? ''
  expect(told).toContain('That press is the permission for the release: your next run of the release runner for /repo/wt goes through once, within the hour, with nothing more asked.')
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You answered “Release it”' })))?.props.dimColor).toBe(true)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Take back')).toBe(false)
  expect(files.get(`${MEMORY}/log.md`)).toContain('release of fix-nose from /repo/wt allowed once for a1')
  // Its release run goes through: granted with nothing held on the card, and no second block
  const first = bash('r1', RELEASE) as Promise<{ deny?: string }>
  const run = await until(async () => holding.get(RELEASE.slice(5)))
  expect(grants().map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-nose']])
  expect((await list.findAll({ type: 'Button' })).some(b => String(b.key ?? '').startsWith('gate-'))).toBe(false)
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeUndefined()
  run?.('released')
  expect((await first).deny).toBeUndefined()
  // A task runs its release in its own background, and its card is never Done while that runs: its hand-in is refused until the
  // release has ended (18 Nov, the person: "Until it's done releasing, it's not done")
  await bash('bgr', 'hold release-in-the-background', 'a1', { description: 'Release fix-nose', run_in_background: true })
  const early = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-early', agentId: 'a1', message: 'Released.' } as never)) as { deny?: string }
  expect(early.deny).toContain('Not handed in: a command of yours still runs')
  expect(await list.find({ type: 'Text', text: /^◐ Delivered/ })).toBeUndefined()
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 'bgr-s', agentId: 'a1', task_id: 'bg-bgr' } as never)
  // Once: the same card's next release run is asked as any release nobody pressed for
  await clock.advance(1000)
  const second = bash('r2', 'hold xr2; /plug/claudopus/bin/release') as Promise<{ deny?: string }>
  expect(await until(async () => gateButton('gate-r2-r0-once-'))).toBeDefined()
  expect((await list.find({ type: 'Text', text: 'Permission' }))?.props.dimColor).toBe(true)
  expect((await list.find({ type: 'Text', text: 'Release fix-nose to main?' }))?.props.color).toBe(AMBER)
  expect((await list.findAll({ type: 'Button' })).filter(b => String(b.key ?? '').startsWith('gate-r2-r0-')).map(b => b.props.label)).toEqual(['Allow', "Don't allow"])
  await list.press({ key: (await gateButton('gate-r2-r0-deny-'))?.key ?? '' })
  wake()
  expect((await second).deny).toBeDefined()
  expect(holding.has('xr2; /plug/claudopus/bin/release')).toBe(false)
  await list.unmount()
})

test('a reply in words that does not settle an ask keeps it, and the card active, with nothing to press while the work acts on it, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'second round of terminal fixes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Terminal look, second round', prompt: 'second round of terminal fixes' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const typed = async () => [...(await list.findAll({ type: 'Input' } as never)), ...(await bar.findAll({ type: 'Input' } as never))].length
  const ASK = 'Release the second round of terminal fixes?'
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  const isFinished = async () => (await labels()).some(label => label.includes('Finished')) || (await texts()).some(text => text.startsWith('Finished'))
  // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it'] } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release it? (Answer: Release it.) Built, tested and checked; nothing is released.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => list.find({ type: 'Text', text: ASK }))).toBeDefined()
  expect(await until(async () => ((await askButtons(list, 'a1')).includes('Answer in words') ? askButtons(list, 'a1') : undefined))).toEqual(['Release it', 'Answer in words'])
  // The person replies in their own words, asking for something first: the work is started again with it and told the ask stays
  const box = await inWords(list, bar, 'a1', 'Show me images first.')
  const told = (await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('in their own words: Show me images first.')))) ?? ''
  expect(told).toContain('does not settle your question by itself')
  expect(told).toContain('Continue the task with this answer')
  // The card stays among the running cards, at work, its question folded to the reply in one grey line, and nothing to press or
  // type; nothing is under Finished
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You answered “Show me images first.”' })))?.props.dimColor).toBe(true)
  expect(await list.find({ type: 'Text', text: ASK })).toBeUndefined()
  expect(await askButtons(list, 'a1')).toEqual([])
  expect(await until(async () => ((await typed()) ? undefined : true))).toBe(true)
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
  // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
  // time with the same reply
  await $.turn.complete({ answer: 'Release it? (Answer: Release it.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect((await list.find({ type: 'Text', text: ASK }))?.props.color).toBe(AMBER)
  expect(await until(async () => ((await askButtons(list, 'a1')).includes('Answer in words') ? askButtons(list, 'a1') : undefined))).toEqual(['Release it', 'Answer in words'])
  // with the reply still said under it, as one that left it open
  expect(await list.find({ type: 'Text', text: '✓ You answered “Show me images first.” · the question is still open' })).toBeDefined()
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  expect(resumed.filter(line => line.startsWith('a1: '))).toHaveLength(1)
  // More words from the person keep it open still, typed in a new box, empty (the surface would put the sent words back into a
  // box it found again by its old key); Release it settles it, and the card finishes once the work has acted on it
  const back = await inWords(list, bar, 'a1', 'And the narrow window too, please.')
  expect(back?.key).not.toBe(box?.key)
  expect(back?.props.value ?? '').toBe('')
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('the narrow window too')))).toBeDefined()
  await $.turn.complete({ answer: 'Here is the narrow window.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  await $.turn.complete({ answer: 'Released as 0.2.77.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  // Done, it stays among the cards, saying so, until the person dismisses it: only then is it under Finished
  expect(await until(async () => list.find({ type: 'Text', text: /^◐ Delivered/ }))).toBeDefined()
  expect(await isFinished()).toBe(false)
  await pressed(list, 'dismiss-a1')
  await clock.advance(2_100)
  expect(await until(async () => ((await isFinished()) ? true : undefined))).toBe(true)
  await Promise.all([list.unmount(), bar.unmount()])
})

test('once the person has answered, by a button or in their own words, the question is gone from the card at once, one grey line of the answer in its place that opens Details, where both are whole; a press holds the rows the question took for a moment; the same ask asked again comes back fresh, in the panel and the chat: the 14 Nov "I would say maybe stop it" to "Should I stop the depth job?", and the 19 Nov "no need to keep showing the question"', async ($, on) => {
  const { appended, logged, clock, opened } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'why the M4 is stuck', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Why the M4 is stuck', prompt: 'why the M4 is stuck' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const ASK = 'Should I stop the depth job on your other Mac?'
  const DETAILS = 'Your other Mac is using 42 of its 44 GB of swap.'
  // Every field there is to type in, in the panel or above the chat
  const inputs = async () => [...(await list.findAll({ type: 'Input' } as never)), ...(await bar.findAll({ type: 'Input' } as never))]
  const labels = async () => askButtons(list, 'a1')
  const WHOLE = ['Stop it', 'Leave it running', 'Answer in words']
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] } as never)
  const relays = () => appended.filter(line => line.startsWith('undefined: In the background task') && line.includes(ASK)).length
  expect(await until(async () => relays() || undefined)).toBe(1)
  expect(await until(async () => ((await labels()).length === 3 ? labels() : undefined))).toEqual(WHOLE)
  // Typed in their own words: the question goes at once, the reply cut to one grey line in its place, and no buttons, box or send.
  // The line opens Details, where the question stands whole in the task's purple, with the whole reply under it
  const REPLY = 'I would say maybe stop it and then tell it to release it, once the swap is under 10 GB'
  const box = await inWords(list, bar, 'a1', REPLY)
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('maybe stop it')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: DETAILS })).toBeUndefined()
  const said = await list.find({ type: 'Text', text: /^✓ You answered “I would say maybe stop it/ })
  expect([said?.text, said?.props.dimColor, said?.props.wrap]).toEqual(['✓ You answered “I would say maybe stop it and then tell it to release it, …”', true, 'truncate-end'])
  expect(await labels()).toEqual([])
  expect(await until(async () => ((await inputs()).length ? undefined : true))).toBe(true)
  await pressed(list, 'answered-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await until(async () => details.find({ type: 'Text', text: ASK })))?.props.color).toBe(PURPLE)
  expect(await details.find({ type: 'Text', text: `✓ You answered “${REPLY}”` })).toBeDefined()
  await details.unmount()
  // The chat's model is told it acts on the reply, not that it still asks; the person, who replied on the card, is not shown it
  const toChat = (await until(async () => appended.find(line => line.startsWith('undefined: ✓ The person replied to "Why the M4 is stuck"')))) ?? ''
  expect(toChat).toContain('will ask again if it still needs the person')
  expect(toChat).not.toContain('It still asks')
  expect(logged.filter(line => line.startsWith('✓'))).toEqual([])
  // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#E5A50A' ? true : undefined))).toBe(true)
  expect(await until(async () => ((await labels()).length === 3 ? labels() : undefined))).toEqual(WHOLE)
  expect(await inputs()).toEqual([])
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Answer in words')?.key ?? '' })
  const again = await until(async () => (await inputs())[0])
  expect(again?.props.value ?? '').toBe('')
  expect(again?.key).not.toBe(box?.key)
  expect(await list.find({ type: 'Text', text: /^✓ You answered/ })).toBeUndefined()
  expect(await until(async () => (relays() === 2 ? true : undefined))).toBe(true)
  // A button pressed: the ask goes whole, nothing left to press or type. Its grey line stands where the question stood, and the card
  // closes up under it at once, with no space held
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Stop it"')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect(await labels()).toEqual([])
  expect(await until(async () => ((await inputs()).length ? undefined : true))).toBe(true)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You answered “Stop it”' })))?.props.dimColor).toBe(true)
  expect(await emptySpace(list, 50)).toEqual([])
  // and Details, opened from it, has the question and its details whole, with the answer
  const pressedThere = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await until(async () => pressedThere.find({ type: 'Text', text: ASK }))).toBeDefined()
  expect(await pressedThere.find({ type: 'Markdown', text: DETAILS } as never)).toBeDefined()
  await pressedThere.unmount()
  // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] } as never)
  expect(await until(async () => (relays() === 3 ? true : undefined))).toBe(true)
  await $.prompt.submit({ text: 'Show me the swap first', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their reply: “Show me the swap first”' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Show me the swap first”' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: ASK })).toBeUndefined()
  expect(await labels()).toEqual([])
  expect(await inputs()).toEqual([])
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] } as never)
  expect(await until(async () => (relays() === 4 ? true : undefined))).toBe(true)
  expect(await until(async () => ((await labels()).length === 3 ? labels() : undefined))).toEqual(WHOLE)
  expect(await inputs()).toEqual([])
  await Promise.all([list.unmount(), bar.unmount()])
})

test('a button answer pressed by mistake is taken back from its card while the card says it: the question comes back with its buttons, the work is told not to act on it, and the next press answers; gone once the work asks again: the 16 Nov press that landed on an answer while reaching for the picture', async ($, on) => {
  const { appended, clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Make the banner', prompt: 'banner' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Use banner 5 on your page?'
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  const press = async (label: string) => list.press({ key: (await list.findAll({ type: 'Button' })).find(b => String(b.props.label) === label)?.key ?? '' })
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Use it', 'Keep banner 4'] } as never)
  expect(await until(async () => ((await labels()).includes('Keep banner 4') ? true : undefined))).toBe(true)
  await press('Keep banner 4')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Keep banner 4"')))).toBeDefined()
  // Beside the one grey line of what was pressed
  expect(await until(async () => ((await labels()).includes('Take back') ? true : undefined))).toBe(true)
  expect(await list.find({ type: 'Text', text: '✓ You answered “Keep banner 4”' })).toBeDefined()
  await press('Take back')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('took back their answer "Keep banner 4"')))).toBeDefined()
  expect(await until(async () => ((await labels()).includes('Use it') ? true : undefined))).toBe(true)
  expect(await labels()).not.toContain('Take back')
  expect((await list.find({ type: 'Text', text: ASK }))?.props.color).toBe(AMBER)
  expect(await list.find({ type: 'Text', text: /^✓ You answered/ })).toBeUndefined()
  // Answered again, it goes as any answer
  await press('Use it')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Use it"')))).toBeDefined()
  expect(await until(async () => ((await labels()).includes('Take back') ? true : undefined))).toBe(true)
  // The work asks something else: the old answer can no longer be taken back, not even from a drawing still showing its button
  const stale = (await list.findAll({ type: 'Button' })).find(b => String(b.props.label) === 'Take back')?.key ?? ''
  expect(stale).not.toBe('')
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Upload it now?', choices: ['Upload'] } as never)
  expect(await until(async () => ((await labels()).includes('Upload') ? true : undefined))).toBe(true)
  expect(await labels()).not.toContain('Take back')
  await list.press({ key: stale }).catch(() => undefined)
  await clock.advance(1000)
  expect(appended.some(line => line.includes('took back their answer "Use it"'))).toBe(false)
  expect(await list.find({ type: 'Text', text: 'Upload it now?' })).toBeDefined()
  await list.unmount()
})

test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with no buttons, its question folded to the reply on the card and whole in Details and the terminal\'s band; stopped again it is amber with them: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', async ($, on) => {
  // What the engine lists of the work, as the terminal's engine does: running while it waits on a command it left running
  const agents: Record<string, string> = {}
  const { resumed, clock } = world(on, { agents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'clip wallet versus affiliate', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clipify affiliate versus clip wallet', prompt: 'clip wallet versus affiliate' } as never)
  const ASK = 'Release PR 54 to production?'
  const isPurple = (colour: unknown) => /^#(8A63F0|6E3CFF)/i.test(String(colour))
  const desk = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  // The edge of the card beside its title, in each drawing: amber, purple or green
  const edges = async (pane: typeof desk) => (await pane.findAll({ type: 'Box' })).map(b => b.props.backgroundColor).filter(c => c === AMBER || isPurple(c))
  // The terminal's panel and band are drawn afresh for each look, as a terminal draws them
  const inTerminal = async <T,>(of: typeof BAND | typeof LIST, read: (pane: typeof desk) => Promise<T>) => {
    const pane = await $.ui.mount({ ...of, surface: 'terminal' } as never)
    const got = await read(pane)
    await pane.unmount()
    return got
  }
  const look = async () => ({
    desk: (await desk.find({ type: 'Text', text: ASK }))?.props.color,
    term: await inTerminal(LIST, async pane => (await pane.find({ type: 'Text', text: ASK }))?.props.color),
    // The band's ask is a line of its own inside the line that names the work
    band: await inTerminal(BAND, async pane => (await pane.findAll({ type: 'Text' })).find(t => t.text === ASK && t.props.color)?.props.color),
    deskEdges: await edges(desk),
    termEdges: await inTerminal(LIST, edges),
    buttons: [await desk.findAll({ type: 'Button' }), await inTerminal(LIST, pane => pane.findAll({ type: 'Button' })), await inTerminal(BAND, pane => pane.findAll({ type: 'Button' }))].map(all => all.map(b => b.props.label)),
    // Its Details: the question's block in amber while it waits on the person, in purple while the work acts on their reply
    heading: await details.find({ type: 'Text', text: ASK }).then(q => (!q ? 'none' : q.props.color === AMBER ? 'needs' : isPurple(q.props.color) ? 'acting' : 'other')),
  })
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it'] } as never)
  // (it hands in its result with the question still open: that, not its turn's end, ends a task)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release PR 54 to production? (Answers: Release it / Not now.)' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  // Before the reply: it waits on the person, amber everywhere
  const before = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && l.deskEdges.includes(AMBER) && l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(before ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  // The reply in words, typed in the terminal's panel, where the bar above the prompt draws no field and the block has the one
  // field itself, with no Answer in words to press. It starts the work again: purple while it acts on it, its question still
  // there and nothing to press, in the panel, in Details, in the terminal's panel and in its band
  await inTerminal(LIST, async pane => {
    const fields = (await pane.findAll({ type: 'Input' } as never)).filter(one => /^ask-a1-reply-/.test(one.key ?? ''))
    expect(fields.map(one => [one.props.placeholder, one.props.rows])).toEqual([['Answer in words', undefined]])
    expect(await askButtons(pane, 'a1')).toEqual(['Release it'])
    await pane.input({ key: fields[0]?.key ?? '', text: 'Explain to me the exact differences first.' })
  })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('Explain to me the exact differences first.')))).toBeDefined()
  const acting = await until(async () => {
    const l = await look()
    return l.desk === undefined && l.term === undefined && isPurple(l.band) && l.heading === 'acting' && l.deskEdges.some(isPurple) ? l : undefined
  })
  expect(acting ?? (await look())).toMatchObject({ desk: undefined, term: undefined, heading: 'acting' })
  const now = await look()
  expect(now.deskEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.termEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.deskEdges.some(isPurple)).toBe(true)
  expect(now.termEdges.some(isPurple)).toBe(true)
  for (const labels of now.buttons) expect(labels.filter(label => label === 'Release it' || label === 'Answer in words')).toEqual([])
  expect((await details.findAll({ type: 'Button' })).some(b => b.props.label === 'Release it')).toBe(false)
  // (nothing to type for the question: the box at the bottom of Details is the task's own message box)
  expect((await details.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? '') && !/^details-.*-reply-change-/.test(one.key ?? ''))).toBe(false)
  // Its turn ends while a command it started in the background still runs, the engine listing it as running: it has not stopped,
  // and stays purple
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Writing up the differences.', durationMs: 1, isAborted: false, turnId: 'turn-2a', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  const held = await look()
  expect([held.desk, held.term, isPurple(held.band), held.heading]).toEqual([undefined, undefined, true, 'acting'])
  agents.a1 = 'completed'
  // The header counts it as running, not as needing the person
  expect(await desk.find({ type: 'Text', text: /^1 (task )?working/ })).toBeDefined()
  // It stops again with the ask still open, the engine listing it as running for a moment as its turn ends: amber again a moment
  // later, once the engine lists its run as over
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Release PR 54 to production? (Answer: Release it.) The differences are…', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  // Listed as idle after, as the engine lists some ended work
  agents.a1 = 'idle'
  await clock.advance(2_000)
  const after = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && !l.deskEdges.some(isPurple) && !l.termEdges.some(isPurple) ? l : undefined
  })
  expect(after ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  for (const labels of (await look()).buttons) expect(labels).toEqual(expect.arrayContaining(['Release it']))
  expect(await desk.find({ type: 'Text', text: /^1 waiting for you/ })).toBeDefined()
  // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
  await desk.press({ key: (await desk.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => ((await desk.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  const released = await until(async () => {
    const l = await look()
    return l.deskEdges.some(isPurple) && !l.deskEdges.includes(AMBER) && l.termEdges.some(isPurple) && !l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(released ?? (await look())).toMatchObject({ desk: undefined })
  // (Details keeps the question just answered, with the answer under it, in neither amber nor purple)
  expect(released?.heading).toBe('other')
  // Releasing in the background, its turn ends with the engine still holding it: at work, purple, until it is done
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Releasing in the background.', durationMs: 1, isAborted: false, turnId: 'turn-3a', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  expect((await edges(desk)).some(isPurple)).toBe(true)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Released PR 54.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => ((await edges(desk)).some(isPurple) ? undefined : true))).toBe(true)
  for (const pane of [desk, details]) await pane.unmount()
})

test('every ask also shows in the chat as the mod\'s notice, never as the person\'s message, with its answers and pictures; an answer typed there reaches the work and the card stops asking', async ($, on) => {
  const { appended, submitted, logged, files, clock } = world(on)
  files.set('/w/shots/a.png', 'png')
  files.set('/w/shots/b.png', 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'redraw the logo', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Redraw the logo', prompt: 'redraw the logo' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png', '/w/shots/gone.png', 'rel.png'] } as never)
  expect(String(asked.result)).toContain('shown in the chat as a notice from the panel')
  expect(String(asked.result)).toContain('Its 2 pictures are drawn small on the card')
  expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here')
  // The chat shows nothing of the ask, which is on its card, and never a prompt in the person's place (18 Nov: a line in the chat
  // for every ask was among "these fucking shits within the chat"); its model reads the ask, and how to pass an answer on, in a row
  // the person does not see
  await clock.advance(10)
  const relay = (await until(async () => appended.find(line => line.startsWith('undefined: In the background task "Redraw the logo", Claude asked the person')))) ?? ''
  expect(submitted.some(line => line.includes('Which logo do you want?'))).toBe(false)
  expect(logged.some(line => line.includes('Which logo do you want?'))).toBe(false)
  expect(relay).toContain('Which logo do you want? (buttons: A · B; pictures: /w/shots/a.png, /w/shots/b.png)')
  expect(relay).toContain('do not pass it on')
  expect(relay).toContain('SendUserFile')
  // Pictures sent as "proactive" did not show in the chat; "normal" ones did
  expect(relay).toContain('status "normal"')
  expect(relay).not.toContain('proactive')
  expect(relay).toContain('SendMessage to "a1"')
  // The same ask said again is not sent again
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png'] } as never)
  await clock.advance(10)
  expect(appended.filter(line => line.includes('Claude asked the person') && line.includes('Which logo do you want?'))).toHaveLength(1)

  // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
  await $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Which logo do you want?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your question: \"Which logo do you want?\"")))).toBeDefined()
  expect(appended.some(line => line.includes('Decide which of three it is'))).toBe(false)
  // A press on the card no longer counts for that ask
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'B')).toBeUndefined()

  // An ask answered on the card, or withdrawn by the work, is told to the chat's model alone: the card shows it
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push'] } as never)
  await clock.advance(10)
  expect(await until(async () => appended.some(line => line.includes('Claude asked the person') && line.includes('May I push it?')) || undefined)).toBe(true)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Push')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ✓ The person answered "Redraw the logo" on its card: “Push”')))).toBeDefined()
  expect(logged.some(line => line.startsWith('✓'))).toBe(false)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' } as never)
  await clock.advance(10)
  expect(await until(async () => appended.some(line => line.includes('Claude asked the person') && line.includes('Sign in to Vercel.')) || undefined)).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' } as never)
  expect(appended.some(line => line === 'undefined: Claude took back its question in "Redraw the logo". You don\'t need to answer it.')).toBe(true)
  expect(logged.some(line => line.startsWith('Claude took back its question'))).toBe(false)
  expect(submitted).toEqual([])
  await list.unmount()
})

test('an ask carries what it is about, whole, on the small card, in Details and in the chat: the 13 Nov "Release PR 54, with the exact differences as explained in the chat?" asked before its explanation arrived', async ($, on) => {
  const { appended, logged, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the wallet', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the wallet', prompt: 'fix the wallet' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // What happened: the ask pointed at an explanation that reached the person only with the report, after the work ended. Now it is
  // not shown at all: no card, no sound, no notice
  const away = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it'] } as never)
  expect(String(away.result)).toContain('Not shown: the question points at an explanation')
  expect(await list.find({ type: 'Text', text: /Release PR 54/ })).toBeUndefined()
  expect(notified.some(line => line.includes('Release PR 54'))).toBe(false)
  for (const text of ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text, choices: ['Release it'] } as never)).result)).toContain('Not shown')
  }
  // Asks about something shown, such as a code on a page or a picture, are not taken for one
  for (const text of ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text } as never)).result)).toContain('Shown on your card')
  }
  // A go-ahead with nothing under it is shown, and said back to the work
  const bare = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it'] } as never)
  expect(String(bare.result)).toContain('It carries no details')
  // Asked again with its explanation: shown whole under the question on the small card and in Details
  const differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".'
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it'] } as never)
  expect(String(asked.result)).toContain('what it is about under it')
  expect(String(asked.result)).not.toContain('carries no details')
  expect(await list.find({ type: 'Markdown', text: differences })).toBeDefined()
  const big = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await big.find({ type: 'Markdown', text: differences })).toBeDefined()
  // Above the prompt in the terminal, where its numbers answer it, it says there is more
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect(await band.find({ type: 'Text', text: /^The details are on its card · / })).toBeDefined()
  await band.unmount()
  // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
  await clock.advance(10)
  const relay = (await until(async () => [...appended].reverse().find(line => line.startsWith('undefined: In the background task "Fix the wallet", Claude asked the person') && line.includes('Release PR 54 to production?')))) ?? ''
  expect(logged.some(line => line.includes('Release PR 54 to production?'))).toBe(false)
  expect(relay).toContain(`what it is about, which the person sees in full with it on the card: ${differences}`)
  // The chat is told not to say it again: the person has just read it
  expect(relay).toContain('do not repeat what it is about')
  // A pressed answer still matches the ask that carries details
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?')))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: differences })).toBeUndefined()

  // A question longer than one line is cut at a word, with the whole of it at the top of its details
  const long = `Release it? ${'The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)}`.trim()
  const cutShort = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it'] } as never)
  expect(String(cutShort.result)).toContain('whole at the top of its details')
  expect(await big.find({ type: 'Markdown', text: long })).toBeDefined()
  const question = (await big.findAll({ type: 'Text' })).find(one => one.props.bold && String(one.text).startsWith('Release it? The refund rule'))
  expect(question).toBeDefined()
  expect(String(question?.text).length).toBeLessThanOrEqual(302)
  expect(String(question?.text)).toMatch(/[a-z.] …$/)
  // Long details: whole in Details, cut on the small card with where the rest is, never in the notice, and cut in the model's row
  const many = Array.from({ length: 120 }, (_, n) => `- Line ${n + 1} of what changes on the payout screens.`).join('\n')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it'] } as never)
  expect(await big.find({ type: 'Markdown', text: many })).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })).toBeDefined()
  await clock.advance(10)
  expect(logged.some(line => line.includes('Line 120 of what changes') || line.includes('Release the payout screens?'))).toBe(false)
  const longRelay = (await until(async () => [...appended].reverse().find(line => line.includes('Release the payout screens?') && line.includes('asked the person')))) ?? ''
  expect(longRelay).toContain('(the rest is on the card)')
  expect(longRelay).not.toContain('Line 120 of what changes')
  await big.unmount()
  await list.unmount()
})

test('an answer to ended work that cannot be started again is left in the chat as the mod\'s notice and a row its model reads, never in the person\'s place', async ($, on) => {
  const { submitted, logged, appended } = world(on, { unresumable: new Set(['a1']) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'pick a colour', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Pick a colour', prompt: 'pick a colour' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Red or blue?', choices: ['Red', 'Blue'] } as never)
  // (it hands in its result with the question still open: that, not its turn's end, ends a task)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Waiting on your colour.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Blue')))?.key ?? '' })
  expect(await until(async () => logged.find(line => line.includes('Your answer “Blue” to “Pick a colour” (Red or blue?)')))).toContain("couldn't reach its task. It goes with your next message here.")
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ') && line.includes('The answer could not reach that task')))).toContain('(Red or blue?): Blue.')
  expect(submitted.some(line => line.includes('Blue'))).toBe(false)
  // The card says so in its one grey line
  expect((await until(async () => list.find({ type: 'Text', text: "✓ You answered “Blue” · it couldn't reach the task, so it goes with your next message" })))?.props.dimColor).toBe(true)
  await list.unmount()
})

test('in a chat the app runs on another Mac over ssh, a key the runners need is typed in the box above the chat and goes only into the keychain; a password or key the person refuses goes with one grey line', SLOW, async ($, on) => {
  const { keep, settle, files, logged, keychain, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const boxButton = async (box: string, what: string) => until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith(`box-${box}-${what}-`)))
  const field = async (box: string) => until(async () => (await bar.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`band-${box}-reply-`)))
  await clock.advance(1000)
  // The chat is told only the name, and where to type it
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toBe(`${GITHUB_ASKED} Press Paste it on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself. Or answer in words, such as where it already is.`)
  // Its block: the dim label of its kind, what is asked in amber, and where it goes; nothing is typed in the panel
  expect((await until(async () => list.find({ type: 'Text', text: GITHUB_ASKED })))?.props.color).toBe(AMBER)
  expect((await list.find({ type: 'Text', text: 'Key' }))?.props.dimColor).toBe(true)
  expect(await list.find({ type: 'Markdown', text: KEY_GOES })).toBeDefined()
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  await list.press({ key: (await boxButton(id, 'paste'))?.key ?? '' })
  const value = 'ghp_s3cret"with\\quote'
  await bar.input({ key: (await field(id))?.key ?? '', text: value })
  // It goes to the keychain under the box's id, escaped for security's own reading, and the block goes, one grey line in its place
  expect(await until(async () => keychain.find(one => one.includes(id)))).toBe(`add-generic-password -U -s "claudopus-box" -a "${id}" -l "Claudopus box" -w "ghp_s3cret\\"with\\\\quote"\n`)
  expect(await until(async () => ((await list.find({ type: 'Text', text: GITHUB_ASKED })) ? undefined : true))).toBe(true)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You gave GITHUB_TOKEN' })))?.props.dimColor).toBe(true)
  // Nowhere else: not the chat, its saved words, the log or any file
  expect(logged.some(line => line.includes('s3cret'))).toBe(false)
  expect([...files.values()].some(text => text.includes('s3cret'))).toBe(false)
  // A curly quote from a phone's keyboard, which security would give back as hex, is not sent, and the box says why
  const third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${third}.json`, JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  await list.press({ key: (await boxButton(third, 'paste'))?.key ?? '' })
  const curly = await field(third)
  const before = keychain.length
  await bar.input({ key: curly?.key ?? '', text: 'it’s-mine' })
  expect(await until(async () => (await bar.findAll({ type: 'Text' })).find(one => (one.text ?? '').startsWith('That has a line break, a curly quote')))).toBeDefined()
  // in a new field, empty, to type it again; and one whose runner has stopped takes nothing
  const again = await until(async () => (await bar.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`band-${third}-reply-`) && one.key !== curly?.key))
  expect(again).toBeDefined()
  files.delete(`${MEMORY}/boxes/${third}.json`)
  await bar.input({ key: again?.key ?? '', text: 'plain-value-1234' })
  await clock.advance(1000)
  expect(keychain.length).toBe(before)
  // A password the person does not allow removes its request, which the runner takes as cancelled
  const other = '1f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${other}.json`, JSON.stringify({ id: other, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const cancel = await boxButton(other, 'cancel')
  expect(cancel?.props.label).toBe("Don't allow")
  expect(await list.find({ type: 'Text', text: ADMIN_ASKED })).toBeDefined()
  await list.press({ key: cancel?.key ?? '' })
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${other}.json`) ? undefined : true))).toBe(true)
  // Its block goes at once, and one grey line says what was pressed, for a minute
  expect(await list.find({ type: 'Text', text: ADMIN_ASKED })).toBeUndefined()
  const PRESSED = /^✓ You pressed “Don.t allow”$/
  expect((await until(async () => list.find({ type: 'Text', text: PRESSED })))?.props.dimColor).toBe(true)
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: PRESSED })) ? undefined : true))).toBe(true)
  await Promise.all([list.unmount(), bar.unmount()])
  await settle()
})

test("where the bar above the prompt takes a box, a key or a password has no field in the panel, whose window the app drags to a field that holds the cursor: Paste it, Type it or Answer in words opens the one box in the bar; the key goes only to the keychain, a password only sealed to the command that asked, words only to that command, and words that look like the key itself are held until the person says which", async ($, on) => {
  const { keep, settle, files, logged, keychain, clock } = world(on, { panes: ['claudopus'] })
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Deploy the site', prompt: 'deploy it' } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  // Another task's runner, begun later, for another key: the box for GITHUB_TOKEN is still the first task's
  await clock.advance(500)
  await $.agent.spawn({ ...spawn, description: 'Sign the build', prompt: 'sign it' } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-2', agentId: 'a2', command: 'hold /plug/claudopus/bin/secret SIGNING_KEY here sign' } as never))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  type Site = typeof list
  const fieldsIn = async (site: Site, id: string) => (await site.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').includes(id))
  const labelled = async (site: Site, label: string) => (await site.findAll({ type: 'Button' })).filter(b => b.props.label === label)
  const press = async (site: Site, label: string) => site.press({ key: (await until(async () => (await labelled(site, label))[0]))?.key ?? '' })
  // The buttons of a box's block, in the order drawn
  const boxButtons = async (id: string) => (await list.findAll({ type: 'Button' })).filter(b => (b.key ?? '').startsWith(`box-${id}-`)).map(b => String(b.props.label))
  const ask = async (id: string) => (files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 })), await clock.advance(1000))
  // The key: no field in the panel; Paste it, Don't give it and Answer in words
  const key = '0a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(key)
  expect(await until(async () => list.find({ type: 'Text', text: GITHUB_ASKED }))).toBeDefined()
  // On the card of the task whose command asked, under its title, its edge amber; counted once as what waits
  const order = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(order.indexOf('Deploy the site')).toBeGreaterThan(-1)
  expect(order.indexOf('Deploy the site')).toBeLessThan(order.indexOf(GITHUB_ASKED))
  expect(order.indexOf(GITHUB_ASKED)).toBeLessThan(order.indexOf('Sign the build'))
  expect(order.find(one => /waiting for you/.test(one))).toMatch(/^1 /)
  expect(((await list.findAll({ type: 'Box' })) as { props: Record<string, unknown> }[]).some(one => one.props.width === 1 && one.props.backgroundColor === AMBER)).toBe(true)
  expect(await until(async () => ((await boxButtons(key)).length === 3 ? boxButtons(key) : undefined))).toEqual(['Paste it', "Don't give it", 'Answer in words'])
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  // Paste it opens the one box above the chat, named for the key and its task; the block offers to close it
  await press(list, 'Paste it')
  const pasted = await until(async () => (await fieldsIn(bar, key))[0])
  expect(await oneBox(bar)).toEqual({ head: '↳ GITHUB_TOKEN for “Deploy the site”', fields: ['Paste it here'], enter: SENDS_KEY, buttons: ['Send', 'Close'] })
  expect(await until(async () => ((await boxButtons(key)).includes('Close') ? boxButtons(key) : undefined))).toEqual(['Close', "Don't give it"])
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  await bar.input({ key: pasted?.key ?? '', text: 'ghp_kept0nlyInKeychain' })
  expect(await until(async () => keychain.find(one => one.includes(key)))).toContain('-w "ghp_kept0nlyInKeychain"')
  expect(await until(async () => ((await fieldsIn(bar, key)).length === 0 ? true : undefined))).toBe(true)
  expect(files.has(`${MEMORY}/boxes/${key}.reply`)).toBe(false)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You gave GITHUB_TOKEN' })))?.props.dimColor).toBe(true)
  // Answer in words: its words go beside the request for the runner, which prints them to the command's caller; nothing is kept
  const said = '1a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(said)
  await press(list, 'Answer in words')
  const words = await until(async () => (await fieldsIn(bar, said))[0])
  expect(await oneBox(bar)).toEqual({ head: '↳ Your answer in place of GITHUB_TOKEN', fields: ['Type your answer'], enter: SENDS_KEY, buttons: ['Send', 'Close'] })
  // The one box is four lines whatever it is for, and has no small send button the app draws for a submitLabel
  expect([pasted?.props.rows, words?.props.rows]).toEqual([4, 4])
  expect([pasted, words].some(one => 'submitLabel' in (one?.props ?? {}))).toBe(false)
  const kept = keychain.length
  // Sent with the row's Send, the big button first, Close the small one after it
  expect((await bar.findAll({ type: 'Button' })).filter(b => ['Send', 'Close'].includes(String(b.props.label))).map(b => [b.props.label, b.props.variant ?? null, b.props.plain ?? null])).toEqual([['Send', 'primary', null], ['Close', null, true]])
  await bar.input({ key: words?.key ?? '', text: 'It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too', kind: 'change' } as never)
  await press(bar, 'Send')
  expect(await until(async () => files.get(`${MEMORY}/boxes/${said}.reply`))).toBe('The person answered in the Claudopus panel instead of giving GITHUB_TOKEN, in their own words: It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too\n')
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${said}.json`) ? undefined : true))).toBe(true)
  expect(keychain.length).toBe(kept)
  expect((await until(async () => list.find({ type: 'Text', text: /^✓ You answered “It is already in / })))?.props.dimColor).toBe(true)
  // Words that look like the key itself are held, sent nowhere, until the person keeps them as the key (the key's word alone, never
  // the words around it) or sends them anyway; a path, a setting's name and a branch's, above, are no key
  const slip = '2a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(slip)
  await press(list, 'Answer in words')
  const slipped = await until(async () => (await fieldsIn(bar, slip))[0])
  await bar.input({ key: slipped?.key ?? '', text: 'here: ghp_A1b2C3d4E5f6G7h8I9j0' })
  expect(await until(async () => (await bar.findAll({ type: 'Text' })).find(one => (one.text ?? '').startsWith('That looks like the key itself')))).toBeDefined()
  expect(files.has(`${MEMORY}/boxes/${slip}.reply`)).toBe(false)
  expect(logged.some(line => line.includes('A1b2C3'))).toBe(false)
  await press(bar, 'Save as the key')
  expect(await until(async () => keychain.find(one => one.includes(slip)))).toContain('-w "ghp_A1b2C3d4E5f6G7h8I9j0"')
  expect(files.has(`${MEMORY}/boxes/${slip}.reply`)).toBe(false)
  // An admin password: Type it opens the same box, and what is typed goes to the keychain only sealed to its runner's key
  const admin = '3a1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${admin}.json`, JSON.stringify({ id: admin, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  expect(await until(async () => ((await boxButtons(admin)).length ? boxButtons(admin) : undefined))).toEqual(['Type it', "Don't allow"])
  expect((await list.find({ type: 'Text', text: ADMIN_ASKED }))?.props.color).toBe(AMBER)
  expect((await list.findAll({ type: 'Text' })).some(one => /^Password( · |$)/.test(String(one.text ?? '')) && one.props.dimColor)).toBe(true)
  expect(await list.find({ type: 'Markdown', text: ADMIN_GOES })).toBeDefined()
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  await press(list, 'Type it')
  const typedIn = await until(async () => (await fieldsIn(bar, admin))[0])
  expect(await oneBox(bar)).toEqual({ head: expect.stringMatching(/^↳ This Mac's password/), fields: ['Type it here'], enter: SENDS_KEY, buttons: ['Send', 'Close'] })
  await bar.input({ key: typedIn?.key ?? '', text: 'made-up-passw0rd' })
  expect(await until(async () => keychain.find(one => one.includes(admin)))).toContain(`-w "${boxSealed(BOX_PUBLIC, 'made-up-passw0rd')}"`)
  expect(keychain.some(one => one.includes('made-up-passw0rd'))).toBe(false)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You gave the password' }))).toBeDefined()
  // Nothing was ever put into the chat's own box
  expect(filled).toEqual([])
  await list.unmount()
  await bar.unmount()
  await settle()
})

test('a chat on this Mac\'s own screen is told of a key and its panel opened the same way; in the terminal, where the bar above the prompt draws no field, the key\'s block has the one field itself, which Answer in words turns to words and back', async ($, on) => {
  const { keep, settle, files, logged, keychain, clock, opened } = world(on)
  await $.session.start(start)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  await clock.advance(1000)
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('Press Paste it on it in the Claudopus panel')
  // The chat takes the request, which tells the runner a panel asks, and brings the panel up with the field ready
  expect(opened.filter(one => one === 'claudopus').length).toBeGreaterThan(0)
  const fields = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith(`box-${id}-field`))
  const buttons = async () => (await list.findAll({ type: 'Button' })).filter(b => (b.key ?? '').startsWith(`box-${id}-`))
  expect((await until(async () => ((await fields()).length ? fields() : undefined)))?.map(one => one.props.placeholder)).toEqual(['Paste it here'])
  expect((await buttons()).map(b => b.props.label)).toEqual(["Don't give it", 'Answer in words'])
  // Answer in words turns the one field to words, and Paste it turns it back
  await list.press({ key: (await buttons())[1]?.key ?? '' })
  expect(await until(async () => ((await fields())[0]?.props.placeholder === 'Type your answer' ? true : undefined))).toBe(true)
  expect((await buttons()).map(b => b.props.label)).toEqual(["Don't give it", 'Paste it'])
  await list.press({ key: (await buttons())[1]?.key ?? '' })
  const field = await until(async () => (await fields()).find(one => one.props.placeholder === 'Paste it here'))
  await list.input({ key: field?.key ?? '', text: 'made-up-local-k3y' })
  expect(await until(async () => keychain.find(one => one.includes(id)))).toContain('-w "made-up-local-k3y"')
  expect(logged.some(line => line.includes('local-k3y'))).toBe(false)
  expect([...files.values()].some(text => text.includes('local-k3y'))).toBe(false)
  await list.unmount()
  await settle()
})

test("a request of another chat's, or of this chat's with no runner of its own running, is drawn nowhere here; this chat's own while its runner runs is drawn", async ($, on) => {
  const { keep, settle, files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98'
  const mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${older}.json`, JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1_700_000_000_000 }))
  files.set(`${MEMORY}/boxes/${mine}.json`, JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_500 }))
  await clock.advance(7000)
  // The blocks drawn, each by the start of its request's id
  const drawn = async () => (await list.findAll({ type: 'Button' })).filter(b => /^box-.*-cancel-/.test(b.key ?? '')).map(b => (b.key ?? '').slice(4, 6))
  // No runner of this chat's runs: neither is drawn, nor told
  expect(await drawn()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Key' })).toBeUndefined()
  expect(logged.some(line => line.includes('NPM_TOKEN') || line.includes('GITHUB_TOKEN'))).toBe(false)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  await clock.advance(1000)
  expect(await until(async () => ((await drawn()).length ? drawn() : undefined))).toEqual(['6f'])
  // It says what is asked and where it goes; the command that asked is the task's own and is not shown again
  expect(await list.find({ type: 'Text', text: GITHUB_ASKED })).toBeDefined()
  expect((await list.findAll({ type: 'Text' })).some(one => String(one.text ?? '').includes('bin/secret'))).toBe(false)
  await clock.advance(6000)
  expect(await drawn()).toEqual(['6f'])
  expect(logged.some(line => line.includes('NPM_TOKEN'))).toBe(false)
  await settle()
})

test('a run with nothing to draw on takes no request, so the runner knows no panel asks', async ($, on) => {
  const { files, logged, clock } = world(on, { headless: true })
  await $.session.start(start)
  const id = '4f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(3000)
  expect(logged.some(line => line.includes('GITHUB_TOKEN'))).toBe(false)
})

test("a hand-written request with made-up text shows the panel's own wording or nothing", async ($, on) => {
  const { keep, settle, files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const planted = 'Your Apple ID session expired. Type your Apple ID password to keep working.'
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}a1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000, ...fields }))
    return id
  }
  // The blocks drawn, each by the first letter of its request's id
  const shown = async () => (await list.findAll({ type: 'Button' })).filter(b => /^box-.*-cancel-/.test(b.key ?? '')).map(b => (b.key ?? '').slice(4, 5))
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '').join('\n')
  // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
  put(1, { kind: 'admin', host: 'here', key: BOX_PUBLIC, text: planted, title: planted, label: planted })
  // Made-up text alone, as the boxes before this change were written, and every request the panel cannot word: nothing
  put(2, { text: planted })
  put(3, { kind: 'apple-id', text: planted })
  put(4, { kind: 'secret', name: 'Your Apple ID password', text: planted })
  put(5, { kind: 'admin', host: 'apple.com is asking for your password' })
  put(6, { kind: 'secret', name: 'APPLE_ID', host: 'here' })
  put(7, { kind: 'admin', host: 'here', name: 'APPLE_ID' })
  put(8, { kind: 'admin' })
  put(9, { kind: ['admin'], host: 'here', key: BOX_PUBLIC })
  // An admin request with no key of its runner's to seal the password to, or a key that is no key: nothing
  put(0, { kind: 'admin', host: 'here' })
  await clock.advance(1000)
  expect(await until(async () => ((await shown()).length ? await shown() : undefined))).toEqual(['1'])
  await clock.advance(6000)
  expect(await shown()).toEqual(['1'])
  expect(await texts()).toContain(ADMIN_ASKED)
  expect((await list.findAll({ type: 'Markdown' })).map(one => one.text)).toEqual([ADMIN_GOES])
  expect(await texts()).not.toContain('Apple')
  expect(logged.some(line => line.includes('Apple'))).toBe(false)
  // The notice in the chat is the panel's wording too
  expect(logged.find(line => line.includes("This Mac's password"))).toBe(`${ADMIN_ASKED} Press Type it on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself.`)
  await settle()
})

test('a block words what the runners ask from the fields of the request: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first; each kind with its own label and buttons', async ($, on) => {
  const { keep, settle, files, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}b1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000 + n, ...fields }))
  }
  put(1, { kind: 'secret', name: 'GITHUB_TOKEN' })
  put(2, { kind: 'admin', host: 'dima@m4.local', key: BOX_PUBLIC, again: 'refused' })
  put(3, { kind: 'secret', name: 'NPM_TOKEN', again: 'short' })
  put(4, { kind: 'secret', name: 'OPENAI_KEY', again: 'Type your Apple ID password' })
  put(5, { kind: 'secret' })
  await clock.advance(1000)
  // Each block as drawn, in the order asked: its label, what it asks, where that goes, and its buttons
  const blocks = async () => {
    const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
    const goes = (await list.findAll({ type: 'Markdown' })).map(one => String(one.text ?? ''))
    const buttons = (await list.findAll({ type: 'Button' })).filter(b => /^box-/.test(b.key ?? ''))
    const labels = texts.filter(one => /^(Key|Password)( · |$)/.test(one)).map(one => one.split(' · ')[0])
    const asks = texts.filter(one => / is needed to run | should the key be saved /.test(one))
    return [1, 2, 3, 4, 5].map((n, i) => [labels[i], asks[i], goes[i], buttons.filter(b => (b.key ?? '').startsWith(`box-${n}b1e`)).map(b => String(b.props.label))])
  }
  const KEY_BUTTONS = ['Paste it', "Don't give it", 'Answer in words']
  expect(await until(async () => ((await blocks()).every(one => (one[3] as string[]).length >= 2) ? blocks() : undefined))).toEqual([
    ['Key', GITHUB_ASKED, KEY_GOES, KEY_BUTTONS],
    ['Password', 'That password was wrong. The password of dima@m4.local is needed to run this as admin.', ADMIN_GOES, ['Type it', "Don't allow"]],
    ['Key', "That was shorter than 4 characters. NPM_TOKEN is needed to run this task's command.", KEY_GOES, KEY_BUTTONS],
    // A reason it does not know is left out
    ['Key', "OPENAI_KEY is needed to run this task's command.", KEY_GOES, KEY_BUTTONS],
    ['Key', 'Which name should the key be saved under, such as GITHUB_TOKEN?', 'Commands use the key by this name.', ['Type it', "Don't give it", 'Answer in words']],
  ])
  expect((await list.findAll({ type: 'Text' })).map(one => one.text ?? '').join('\n')).not.toContain('Apple')
  expect(await list.findAll({ type: 'Input' } as never)).toEqual([])
  await Promise.all([list.unmount(), bar.unmount()])
  await settle()
})

test('a copy a reload replaced wakes no work: its timers stop, an answer left for its work stays for the copy in charge, and a press it still gets goes to the chat', async ($, on) => {
  const { resumed, appended, files, clock } = world(on)
  let isNewer = false
  on('state.get', (_, e, next) => ((e as { key?: string }).key === 'load' && isNewer ? { value: { value: `${'9'.repeat(15)}-a-newer-load`, version: 99 } } : next(e)) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve'] } as never)
  // (ended work: it hands in its result with the question still open)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'It waits on your go-ahead.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(2000)
  // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
  isNewer = true
  const at = 1_700_000_002_000
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I restart it?', askAt: at - 2000, at }))
  await clock.advance(10_000)
  // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
  expect(['by its timers', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['by its timers'])
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(true)
  // A press on a button it drew before the reload does not wake the work either: the chat gets the answer to pass on
  const approve = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key
  expect(approve).toBeDefined()
  if (approve) {
    await list.press({ key: approve })
    expect(['by a press', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['by a press'])
    expect(await until(async () => appended.find(line => line.includes('Approve') && line.includes('May I restart it?')))).toBeDefined()
  }
  await list.unmount()
})

test('F-013 · an answer another chat left in a file for ended work wakes nothing: it is put away unread, and only a press in this chat answers', async ($, on) => {
  const { resumed, files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve'] } as never)
  // (ended work: it hands in its result with the question still open)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'It waits on your go-ahead.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', askAt: 1_700_000_000_000, at: 1_700_000_000_000 }))
  await clock.advance(6000)
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(false)
  await $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })
  await clock.advance(12_000)
  expect(resumed.filter(line => line.startsWith('a1: '))).toEqual([])
  expect(files.get(`${MEMORY}/log.md`)).toContain('put away unread')
})

test('in a chat run from another Mac a command for the person is given whole, with its folder, and nothing offers to open a terminal here', async ($, on) => {
  const { terminals, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'sign me in', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Sign in', prompt: 'sign me in' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A relative path with no folder named is not shown: it would be typed somewhere else, where it does not exist
  const bare = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run the release.', command: 'mods/claudopus/bin/release' } as never)
  expect(String(bare.result)).toContain('Not shown')
  expect(await list.find({ type: 'Text', text: 'Run the release.' })).toBeUndefined()
  // With its folder it is shown starting there, with a Copy button and no Open in Terminal
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Sign in to GitHub.', command: 'gh auth login', cwd: '/repo/site' } as never)
  expect(String(told.result)).toContain("cd '/repo/site' && gh auth login")
  expect(String(told.result)).not.toContain('Open in Terminal')
  expect(String(told.result)).toContain('nothing opens a terminal here')
  expect((await list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login" }))?.props.mono).toBe(true)
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')).toBeUndefined()
  expect(terminals).toEqual([])
  expect(shown.some(argv => String(argv[1]).endsWith('/open.command'))).toBe(false)
  await list.unmount()
})

// A press on an ask draws the card answered from the press itself: its buttons and box go in the press's own drawing, before the
// answer is written to the card's file or reaches the work
const askScene = async ($: Parameters<TestBody>[0], on: On) => {
  const w = world(on)
  // The card's file can be held or made to fail, as a slow or failing write would
  let hold: Promise<void> | undefined
  let fails = 0
  on('state.set', async (_, e, next) => {
    if ((e as { key?: string }).key !== 'todos') return next(e)
    // Refused, as a write another copy beat would be, again and again: the card's file is never written
    if (fails > 0) {
      fails -= 1
      return { value: { isSet: false, version: -1 } } as never
    }
    if (hold) await hold
    return next(e)
  })
  await $.session.start(start)
  await $.prompt.submit({ text: 'release it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Ship the branch', prompt: 'ship it' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the branch?', choices: ['Release it', 'Fix it first'] } as never)
  const key = async (label: string) => String((await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === label)))?.key ?? '')
  const answers = () => w.appended.filter(line => line.startsWith('a1: ') && line.includes('in answer to your question'))
  return { ...w, list, key, answers, holdWrites: (until: Promise<void>) => void (hold = until), failWrites: (n: number) => void (fails = n), freeWrites: () => void (hold = undefined) }
}

test("a press on an ask shows it answered in the press's own drawing, before the answer is written, with no buttons or box left", async ($, on) => {
  const s = await askScene($, on)
  const release = await s.key('Release it')
  let free = () => undefined as void
  s.holdWrites(new Promise<void>(done => (free = done)))
  const pressing = s.list.press({ key: release })
  // The card's file is not yet written: the card says what was pressed, and nothing is left to press
  expect((await until(async () => s.list.find({ type: 'Text', text: '✓ You answered “Release it”' })))?.props.dimColor).toBe(true)
  expect((await s.list.findAll({ type: 'Button' })).some(b => String(b.key ?? '').startsWith('ask-a1-'))).toBe(false)
  expect((await s.list.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  expect(await s.list.find({ type: 'Text', text: 'Question' })).toBeUndefined()
  expect(await s.list.find({ type: 'Text', text: 'Release the branch?' })).toBeUndefined()
  expect(s.answers()).toEqual([])
  s.freeWrites()
  free()
  await pressing
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  // The one grey line stays as it was drawn: nothing green, and nothing of who reads it
  const line = await until(async () => s.list.find({ type: 'Text', text: /^✓ You answered “Release it”/ }))
  expect([line?.text, line?.props.dimColor, line?.props.color]).toEqual(['✓ You answered “Release it”', true, undefined])
})

test('an answer that could not be written says so on the card and puts its buttons back; pressed again it goes', async ($, on) => {
  const s = await askScene($, on)
  // Another work asks after it: newer, it goes under
  await s.clock.advance(1000)
  await $.agent.spawn({ ...spawn, description: 'Draw the logo', prompt: 'draw it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] } as never)
  const order = async () => (await s.list.findAll({ type: 'Text' })).map(one => one.text).filter(text => text === 'Which logo?' || text === 'Release the branch?')
  expect(await until(async () => ((await order()).length === 2 ? order() : undefined))).toEqual(['Release the branch?', 'Which logo?'])
  const release = await s.key('Release it')
  await s.clock.advance(1000)
  s.failWrites(1000)
  await s.list.press({ key: release }).catch(() => undefined)
  expect((await until(async () => s.list.find({ type: 'Text', text: "Couldn't send “Release it” · press it again" })))?.props.dimColor).toBe(true)
  expect(await s.list.find({ type: 'Text', text: /^✓ You answered/ })).toBeUndefined()
  expect(s.answers()).toEqual([])
  // Its ask back, the card keeps its ask's place above the newer one: a failed press never moves it
  expect(await order()).toEqual(['Release the branch?', 'Which logo?'])
  // Its buttons are back, and a press now answers it
  s.failWrites(0)
  const again = await s.key('Release it')
  expect(again).not.toBe('')
  await s.list.press({ key: again })
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  expect(await until(async () => s.list.find({ type: 'Text', text: '✓ You answered “Release it”' }))).toBeDefined()
})

test('two presses on an ask, the second on the drawing before the first was taken, send one answer', async ($, on) => {
  const s = await askScene($, on)
  const release = await s.key('Release it')
  const other = await s.key('Fix it first')
  let free = () => undefined as void
  s.holdWrites(new Promise<void>(done => (free = done)))
  const first = s.list.press({ key: release })
  const second = s.list.press({ key: other }).catch(() => undefined)
  const third = s.list.press({ key: release }).catch(() => undefined)
  s.freeWrites()
  free()
  await Promise.all([first, second, third])
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  expect(s.answers()[0]).toContain('pressed "Release it"')
  await new Promise<void>(done => setTimeout(done, 50))
  expect(s.answers()).toHaveLength(1)
})

// What the panel reads, written in a minute, and how many seconds of it the panel was drawn afresh in: each one the app builds whole
// again, under the pointer
const watchWrites = (on: On) => {
  const writes: Record<string, number> = {}
  const counting = { isOn: false }
  on('ui.invalidate', (_, e, next) => ((counting.isOn && (writes.invalidate = (writes.invalidate ?? 0) + 1)), next(e)))
  on('state.set', (_, e, next) => {
    const key = (e as { key?: string }).key ?? (e as { ref?: { key?: string } }).ref?.key ?? Object.keys(e).join(',')
    if (counting.isOn) writes[key] = (writes[key] ?? 0) + 1
    return next(e)
  })
  return { writes, counting }
}

test('with work running and nothing new, the panel is drawn afresh only every ten seconds and nothing it reads is written over with the same: the 15 Nov hover that flickered each second', async ($, on) => {
  const { clock } = world(on)
  const { writes, counting } = watchWrites(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(2000)
  counting.isOn = true
  const drawings = new Set<string>()
  for (let i = 0; i < 60; i++) (await clock.advance(1000), drawings.add(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))))
  // Nothing the panel reads is written: the times move by the mod's own call, every ten seconds
  expect({ tick: writes.tick ?? 0, todos: writes.todos ?? 0 }).toEqual({ tick: 0, todos: 0 })
  expect(writes.invalidate ?? 0).toBeLessThanOrEqual(7)
  expect(drawings.size).toBeLessThanOrEqual(7)
  expect(drawings.size).toBeGreaterThanOrEqual(5)
  // Anything new still shows at once
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' } as never)
  expect(await list.find({ type: 'Text', text: 'I am looking at the left ear.' })).toBeDefined()
  await list.unmount()
})

test('with nothing running the panel is not drawn again at all, so what is under the pointer stays as it is and a press reaches it', async ($, on) => {
  const { clock } = world(on)
  const { writes, counting } = watchWrites(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.turn.complete({ answer: 'Ears checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(120_000)
  await list.findAll({ type: 'Text' })
  counting.isOn = true
  for (let i = 0; i < 60; i++) (await clock.advance(1000), await list.findAll({ type: 'Text' }))
  expect(writes.invalidate ?? 0).toBe(0)
  expect({ tick: writes.tick ?? 0, todos: writes.todos ?? 0 }).toEqual({ tick: 0, todos: 0 })
  await list.unmount()
})

test('while the person uses the panel its running times stand still, and move again once they stop; an ask that comes meanwhile shows at once', async ($, on) => {
  const { clock } = world(on)
  const { writes, counting } = watchWrites(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the nose', prompt: 'nose' } as never)
  // (scrolled down: at the top only the running times stand still)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 20, bodyRows: 50 } }, surface: 'desktop' } as never)
  // The list was 140 rows long a moment ago, as the app said on a scroll then
  await ($.ui as any).scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(() => undefined)
  await clock.advance(12_000)
  await list.findAll({ type: 'Text' })
  // A press in the panel: drawn once for what it did, then still while the person is at it
  const title = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-'))
  expect(title).toBeDefined()
  await list.press({ key: title?.key ?? '' })
  await list.findAll({ type: 'Text' })
  // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at its own height, never held
  // taller, whatever the list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards;
  // 19 Nov: held at the bottom of the view, it left blank under the list after an answer)
  await ($.ui as any).scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 20, bodyRows: 50, contentRows: 90, origin: { kind: 'person' } }).catch(() => undefined)
  const tall = async () => Number((await list.find({ type: 'Box' }))?.props.minHeight ?? 0)
  counting.isOn = true
  const still = JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  // Work writes a line and new work starts while the person is at it: nothing above the pointer moves (16 Nov, the button under it
  // moved by up to 184 px as cards grew and shrank)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Halfway through the ears.' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the chin', prompt: 'chin' } as never)
  for (let i = 0; i < 13; i++) (await clock.advance(1000), expect(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))).toBe(still))
  // An ask comes: shown at once all the same
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'May I go on?', choices: ['Approve'] } as never)
  expect(await list.find({ type: 'Text', text: 'May I go on?' })).toBeDefined()
  expect(await tall()).toBe(50)
  // Answered there, scrolled down and in use, with cards above and below it: the card closes up at once under its grey line, and
  // no empty space is left in it or under the list at any moment after (19 Nov, Dima's screenshot: a working card's "✓ You
  // answered" with a pane's height of blank under it)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key ?? '' })
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Approve”' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'May I go on?' })).toBeUndefined()
  for (let i = 0; i < 4; i++) (expect(await emptySpace(list, 50)).toEqual([]), await clock.advance(1000))
  // Left alone, the times move again
  const asked = JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await clock.advance(30_000)
  expect(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))).not.toBe(asked)
  // with what came meanwhile, and its own height again
  expect(await until(async () => list.find({ type: 'Text', text: 'Check the chin' }))).toBeDefined()
  expect(await tall()).toBe(50)
  await list.unmount()
})

// One line of pictures for a pane: the app asks for the panel with the view at the top and scrolled down in turn as a card changes
// its height, and each once kept a picture of its own age
test('a card never goes back to an older picture once a newer one was shown, however the view moves between the top and scrolled down, and its answered question leaves no space: the 19 Nov card that "went big, then small, then big again" after Release it, and the space after Release it', async ($, on) => {
  const { files, appended, clock } = world(on)
  files.set('/repo/wt/.release', 'mods/claudopus/bin/release')
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-nose')
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn } as never)
  const DOWN = { ...LIST, props: { ...LIST.props, scroll: { offset: 6, bodyRows: 20 } }, surface: 'desktop' }
  const TOP = { ...LIST, surface: 'desktop' }
  let pane = await $.ui.mount(DOWN as never)
  // (the app asks for the same pane again with the view elsewhere)
  const viewAt = async (where: typeof DOWN | typeof TOP) => (await pane.unmount(), (pane = await $.ui.mount(where as never)))
  const card = async () => (await pane.findAll({ type: 'Text' })).map(one => one.text).filter(text => !/Claudopus|^v\d|chat/.test(text ?? ''))
  await ($.ui as any).scroll({ component: 'Pane', requestId: LIST.requestId, offset: 6, by: 1, bodyRows: 20, contentRows: 40, origin: { kind: 'person' } }).catch(() => undefined)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'a1', item: 'Ask you before releasing', state: 'doing' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Built and tested.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the nose fix?', details: 'It straightens the nose.', choices: ['Release it'], release: '/repo/wt' } as never)
  const release = await until(async () => (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it'))
  await clock.advance(4000)
  await pane.press({ key: release?.key ?? '' })
  expect(await until(async () => appended.find(line => line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => pane.find({ type: 'Text', text: '✓ You answered “Release it”' }))).toBeDefined()
  // with no space held under it
  expect(await emptySpace(pane, 20)).toEqual([])
  await clock.advance(1000)
  const answered = await card()
  expect(answered).toContain('Built and tested.')
  // The task carries on while the person is still at the panel: its last to-do is ticked, so its card gets shorter
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't2', agentId: 'a1', item: 'Ask you before releasing', state: 'done' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'Releasing the nose fix.' } as never)
  // Scrolled down and in use, the picture on screen stays as it was
  expect(await card()).toEqual(answered)
  // The view comes to the top, as when the list gets shorter under it: the card as it is now
  await viewAt(TOP)
  const now = await card()
  expect(now).toContain('Releasing the nose fix.')
  expect(now).not.toContain('Ask you before releasing')
  // and from there on that picture or a newer one, wherever the view goes: never the taller one from before
  for (const where of [DOWN, TOP, DOWN]) (await viewAt(where), expect(await card()).toEqual(now))
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n3', agentId: 'a1', text: 'Released as 1.2.3' } as never)
  await viewAt(TOP)
  const later = await card()
  expect(later).toContain('Released as 1.2.3')
  for (const where of [DOWN, TOP, DOWN]) (await viewAt(where), expect(await card()).toEqual(later))
  // The same through the rest of its life: handed in it is Delivered, Mark as done turns it green where it stands, and it then goes
  // under Finished. Each of those is seen once, in that order, wherever the view is when the panel is asked for
  await steps($, 1, 'claude-fable-5-2', 'a1')
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Released as 1.2.3.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a1', reason: 'answer', agentId: 'a1' } as never)
  const STAGES = ['working', 'delivered', 'done', 'finished']
  const stageNow = async () => {
    const words = (await card()).join(' | ')
    return words.includes('◐ Delivered') ? 'delivered' : words.includes('✓ Done') ? 'done' : words.includes('Releas') ? 'working' : 'finished'
  }
  const seen: string[] = []
  const look = async () => {
    for (const where of [TOP, DOWN, TOP, DOWN]) (await viewAt(where), seen.push(await stageNow()))
  }
  await look()
  expect(seen.at(-1)).toBe('delivered')
  await pane.press({ key: (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Mark as done')?.key ?? '' })
  expect(await until(async () => ((await stageNow()) === 'done' ? true : undefined))).toBe(true)
  for (let i = 0; i < 6; i += 1) (await look(), await clock.advance(500))
  expect(seen.at(-1)).toBe('finished')
  expect(seen.map(stage => STAGES.indexOf(stage))).toEqual([...seen.map(stage => STAGES.indexOf(stage))].sort((x, y) => x - y))
  expect([...new Set(seen)]).toEqual(['delivered', 'done', 'finished'])
  await pane.unmount()
})

test('with only a Details tab in front, or the Servers tab open, the mod still asks for no more than a drawing every ten seconds', async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }, { id: 'servers', isShown: true, isPlaced: true }]
  const { clock } = world(on, { live })
  const { writes, counting } = watchWrites(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(2000)
  await list.unmount()
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  const servers = await $.ui.mount({ ...LIST, requestId: 'servers', props: { ...LIST.props, title: 'Servers' }, surface: 'desktop' } as never)
  await clock.advance(2000)
  counting.isOn = true
  for (let i = 0; i < 60; i++) (await clock.advance(1000), await details.findAll({ type: 'Text' }))
  expect(writes.invalidate ?? 0).toBeLessThanOrEqual(7)
  expect(writes.tick ?? 0).toBe(0)
  await Promise.all([details.unmount(), servers.unmount()])
})

test("the panel's recorder writes nothing unless switched on, and switched on writes the drawings, focus and typing as counts, never a letter typed, and switches itself off", async ($, on) => {
  const { clock, files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const box = async () => (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  const recorded = () => [...files.keys()].filter(path => path.includes('/panel-record/'))
  await clock.advance(3000)
  await list.input({ key: (await box())?.key ?? '', text: 'Zebra quartz 7731', kind: 'change' } as never)
  await clock.advance(3000)
  expect(recorded()).toEqual([])
  // A switch left from long ago starts nothing, and goes
  files.set(`${MEMORY}/record-panel.on`, '')
  await clock.advance(3000)
  await list.input({ key: (await box())?.key ?? '', text: 'Zebra quartz 7731 more', kind: 'change' } as never)
  await clock.advance(7000)
  expect(recorded()).toEqual([])
  expect(files.has(`${MEMORY}/record-panel.on`)).toBe(false)
  files.set(`${MEMORY}/record-panel.on`, '')
  files.set(`mtime:${MEMORY}/record-panel.on`, String(1_700_000_016_000))
  await clock.advance(3000)
  await box()
  for (const text of ['Q', 'Qu', 'Quiet lynx 4419']) await list.input({ key: (await box())?.key ?? '', text, kind: 'change' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear.' } as never)
  await clock.advance(200_000)
  await box()
  await clock.advance(3000)
  const [path] = recorded()
  const text = files.get(path ?? '') ?? ''
  const events = text.trim().split('\n').map(line => JSON.parse(line) as { ev: string; count?: number })
  expect(events.some(one => one.ev === 'render')).toBe(true)
  // The reply box is found in the drawing, by its key and where it sits among the drawing's elements
  expect(events.some(one => (one as { inputs?: { key: string }[] }).inputs?.some(input => /-reply-/.test(input.key)))).toBe(true)
  expect(events.filter(one => one.ev === 'input').map(one => one.count)).toEqual([1, 2, 3])
  for (const typed of ['Quiet', 'lynx', '4419', 'Zebra', 'quartz', '7731', 'Qu"']) expect(text.includes(typed)).toBe(false)
  expect(files.has(`${MEMORY}/record-panel.on`)).toBe(false)
  // The bar above the prompt, where the desktop's reply box is drawn, is recorded the same way: its drawings with the box in them,
  // typing there as counts, and the panel's drawings beside it, which hold no reply box
  files.set(`${MEMORY}/record-panel.on`, '')
  files.set(`mtime:${MEMORY}/record-panel.on`, String(clock.now()))
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const barBox = async () => (await bar.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await clock.advance(3000)
  const open = await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Answer in words'))
  await list.press({ key: open?.key ?? '' })
  expect(await until(async () => barBox())).toBeDefined()
  await box()
  for (const typed of ['M', 'Mo', 'Mossy heron 2203']) await bar.input({ key: (await barBox())?.key ?? '', text: typed, kind: 'change' } as never)
  await clock.advance(200_000)
  await barBox()
  await clock.advance(3000)
  const second = files.get(recorded().find(one => one !== path) ?? '') ?? ''
  const barEvents = second.trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as { ev: string; component?: string; site?: string; count?: number; inputs?: { key: string }[] })
  expect(barEvents.some(one => one.ev === 'render' && one.component === 'AbovePrompt' && one.inputs?.some(input => /^band-.*-reply-/.test(input.key)))).toBe(true)
  expect(barEvents.filter(one => one.ev === 'input' && one.site === 'bar').map(one => one.count)).toEqual([1, 2, 3])
  expect(barEvents.some(one => one.ev === 'render' && one.component === 'Pane' && one.inputs?.some(input => /-reply-/.test(input.key)))).toBe(false)
  for (const typed of ['Mossy', 'heron', '2203']) expect(second.includes(typed)).toBe(false)
  await bar.unmount()
  await list.unmount()
})

test('a reply never waits behind a long command: one that may run for minutes is refused with the same call to send in the background, a wait for the person is refused, and a reply given while a short one is held open is taken at once', async ($, on) => {
  const { keep, settle, clock, held, files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'try the reply box', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Reply box that never drags the panel', prompt: 'try the reply box' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Try the new reply box and tell me how it feels.', choices: ['It feels right', 'Still wrong'] } as never)
  // Waits that only mention the person, or come with no question open, are no waits for them
  for (const [n, description] of ['Wait for the preview to come up, then open it for you (30 s)', 'Wait until the page has loaded for you to see', 'Wait for your answer key upload to finish', 'Poll your decision tree training (about 1 min)', 'Wait for your CT scans to download'].entries()) {
    const r = (await $.tool.call({ tool: 'Bash', tool_use_id: `ok${n}`, agentId: 'a1', command: 'true', description } as never)) as { deny?: string }
    expect(r.deny).toBeUndefined()
  }
  // The 16 Nov wait, as it was asked: refused, with nothing run, as the answer comes as a message the moment it is given
  for (const [n, description] of ['Wait for you to try the panel (up to 9 min)', 'Wait for your reply (up to 9 min)', 'Waiting on your answer to the release'].entries()) {
    const wait = (await $.tool.call({ tool: 'Bash', tool_use_id: `w${n}`, agentId: 'a1', command: 'hold record', description, timeout: 600000 } as never)) as { deny?: string }
    expect(wait.deny).toContain('End your step now')
  }
  expect(held.has('record')).toBe(false)
  // A build, render, browser run or download asking for a longer time limit, or a script of its own asking for one, whatever it
  // prints of how far it is (19 Nov: told to print progress before it could start held open, a wait counted seconds), is
  // refused with the same call to send in the background, never changed on its way (auto mode refuses a call a hook changed after it
  // reviewed it: 484 calls on 16-17 Nov); sent so, it runs as written
  files.set('/repo/sort.py', 'for i, f in enumerate(fs):\n  print(f"progress: {i}/{len(fs)} scans", flush=True)\n')
  for (const [id, more] of [['s1', { timeout: 600000, command: 'npm run build', description: 'Run the build' }], ['s5', { timeout: 600000, command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Get the scans' }], ['s7', { timeout: 600000, command: 'python3 /repo/sort.py', description: 'Run the sorting of the scans' }]] as const) {
    const r = (await $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', ...more } as never)) as { deny?: string }
    expect([id, r.deny]).toEqual([id, expect.stringContaining('Send the same call again with `run_in_background: true` and nothing else changed')])
    expect(r.deny).toContain('replies reach you while it runs')
    expect([...held.keys()].some(key => key.startsWith(id))).toBe(false)
    const sent = (await $.tool.call({ tool: 'Bash', tool_use_id: `${id}b`, agentId: 'a1', ...more, run_in_background: true } as never)) as { deny?: string; result?: { backgroundTaskId?: string } }
    expect([id, sent.deny, sent.result?.backgroundTaskId]).toEqual([id, undefined, `bg-${id}b`])
  }
  // A long time limit alone says nothing: a push, a short test or a look runs as sent, held open and never refused
  for (const [id, more] of [['q1', { timeout: 600000, command: 'git push', description: 'Push the branch' }], ['q2', { timeout: 300000, command: 'npm test', description: 'Run the tests' }], ['q3', { timeout: 600000, command: 'rg -n nose /repo', description: 'Look for the nose' }]] as const) {
    const r = (await $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', ...more } as never)) as { deny?: string; result?: { backgroundTaskId?: string } }
    expect([id, r.deny, r.result?.backgroundTaskId]).toEqual([id, undefined, undefined])
  }
  // A short one is held open as asked; a reply given meanwhile is taken at once, and the card says it in one grey line
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'hold build', description: 'Run the build' } as never))
  await until(async () => held.get('build'))
  await clock.advance(70_000)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Yep, looks good' })
  expect((await until(async () => list.find({ type: 'Text', text: '✓ You answered “Yep, looks good”' })))?.props.dimColor).toBe(true)
  held.get('build')?.('built')
  for await (const _ of $.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Yep, looks good”' }))).toBeDefined()
  await settle()
})
test("where the bar above the prompt takes a box, a card's answers end with Answer in words, which opens the one box in that bar and never in the panel or its Details, whose window the app drags to a box that holds the cursor (15 Nov); Close takes it away with what was typed kept; one box at a time; Message on a Done card opens the same box, and what is sent from it starts that task again; nothing is ever put into the chat's own box", async ($, on) => {
  const { appended, clock, files, keep, resumed, stopped, submitted } = world(on, { panes: ['claudopus'] })
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?', choices: ['Left', 'Right'] } as never)
  let list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  type Site = typeof list
  const boxesIn = async (site: Site) => (await site.findAll({ type: 'Input' } as never)).filter(one => /-reply-/.test(one.key ?? ''))
  const says = async (site: Site, text: RegExp) => (await site.findAll({ type: 'Text' })).some(one => text.test(one.text ?? ''))
  const labelled = async (site: Site, label: string) => (await site.findAll({ type: 'Button' })).filter(b => b.props.label === label)
  const OPEN = 'Answer in words'
  const CLOSE = 'Close'
  // A surface whose bar was never drawn keeps the card's own box: a reply in words can always be typed somewhere
  expect((await boxesIn(list)).length).toBe(1)
  expect((await labelled(list, OPEN)).length).toBe(0)
  // The bar drawn on the desktop: no box anywhere until it is asked for, and the card's answers, in the panel and in Details, end
  // with the one that opens it
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await boxesIn(list)).length === 0 && (await boxesIn(details)).length === 0 ? true : undefined))).toBe(true)
  expect((await boxesIn(bar)).length).toBe(0)
  expect((await list.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => ['Left', 'Right', OPEN].includes(label))).toEqual(['Left', 'Right', OPEN])
  expect((await labelled(details, OPEN)).length).toBe(1)
  // The terminal's panel keeps its own box: only the desktop app drags a pane to it
  const term = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await boxesIn(term)).length).toBe(1)
  expect((await labelled(term, OPEN)).length).toBe(0)
  await term.unmount()
  // Pressed: one box, in the bar, under one line that names the work it goes to, with what Enter does, Send and Close; the card
  // offers to close it
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 1 ? true : undefined))).toBe(true)
  expect(await oneBox(bar)).toEqual({ head: '↳ Your answer to “Check the ears”', fields: ['Type your answer'], enter: SENDS, buttons: ['Send', 'Close'] })
  // Send is the big button, first, and Close the small one after it (16 Nov, the person: "the send button is big but the cancel
  // button is small")
  const shape = async () => (await bar.findAll({ type: 'Button' })).filter(b => ['Send', 'Close'].includes(String(b.props.label))).map(b => [b.props.label, b.props.variant ?? null, b.props.plain ?? null])
  expect(await shape()).toEqual([['Send', 'primary', null], ['Close', null, true]])
  // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
  // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
  expect('submitLabel' in ((await boxesIn(bar))[0]?.props ?? {})).toBe(false)
  // Four lines tall (17 Nov, the person: "the text box is usually very small")
  expect((await boxesIn(bar))[0]?.props.rows).toBe(4)
  // and steady from the moment it opens: the work writing its card meanwhile draws no new box. Each new box is the app's to give
  // the cursor again, its ring fading in again, and the bar was drawn anew each time any work wrote its card (17 Nov: "it's also
  // blinking"). The same element keeps the number the engine gave it
  const boxNumber = async () => {
    let found: number | undefined
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return void node.forEach(walk)
      if (!node || typeof node !== 'object') return
      const one = node as { type?: string; props?: { key?: string }; press?: { handle?: number }; children?: unknown }
      if (one.type === 'Input' && /-reply-/.test(one.props?.key ?? '')) found = one.press?.handle
      walk(one.children)
    }
    walk(await bar.drawn())
    return found
  }
  const numbered = await boxNumber()
  expect(numbered).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear now' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'n2', agentId: 'a1', item: 'Look at the left ear', state: 'doing' } as never)
  await clock.advance(1500)
  expect(await boxNumber()).toBe(numbered)
  expect((await boxesIn(list)).length + (await boxesIn(details)).length).toBe(0)
  expect((await labelled(list, CLOSE)).length).toBe(1)
  expect((await labelled(list, OPEN)).length).toBe(0)
  // With the box open the bar still says what waits, and once the panel is scrolled away from its top, Show takes it back there
  const MARK = /^● 1 waiting for you/
  const isShow = async () => (await labelled(bar, 'Show')).length > 0
  const scrolled = async (offset: number) => (await list.unmount(), (list = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset, bodyRows: 20 } }, surface: 'desktop' } as never)))
  await scrolled(40)
  expect(await until(async () => ((await isShow()) ? true : undefined))).toBe(true)
  expect(await bar.find({ type: 'Text', text: MARK })).toBeDefined()
  await scrolled(0)
  expect(await until(async () => ((await isShow()) ? undefined : true))).toBe(true)
  expect(await bar.find({ type: 'Text', text: MARK })).toBeDefined()
  // Typed in, line after line, while work runs: the bar is never asked for again until the typing stops. The app builds every
  // drawing it is given anew, the box under the cursor too, whose blue ring then fades in again, so a bar drawn again as the box
  // grew a line, or given again as it was for each redraw that work writing its cards asked for, flashed as the person typed (17 Nov,
  // the person: "it starts jittering and flashing blue, not blue, blue, not blue"). The box stays four lines, its text scrolling
  // within, and the same box
  files.set(`${MEMORY}/record-panel.on`, '')
  files.set(`mtime:${MEMORY}/record-panel.on`, String(clock.now()))
  await clock.advance(2100)
  const barDrawings = async () => {
    await clock.advance(2100)
    const path = [...files.keys()].find(one => one.includes('/panel-record/'))
    return (files.get(path ?? '') ?? '').trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as { ev: string; component?: string }).filter(one => one.ev === 'render' && one.component === 'AbovePrompt').length
  }
  const [growing] = await boxesIn(bar)
  await bar.input({ key: growing?.key ?? '', text: 'The left.', kind: 'change' } as never)
  const drawnBefore = await barDrawings()
  let typed = 'The left.'
  for (const [n, line] of ['Then the right.', 'Then both, side by side.', 'a long line that wraps '.repeat(30), 'And the scans.', 'Thanks.'].entries()) {
    typed = `${typed}\n${line}`
    await bar.input({ key: growing?.key ?? '', text: typed, kind: 'change' } as never)
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `t${n}`, agentId: 'a1', text: `Step ${n} of the ears` } as never)
    await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: `u${n}`, agentId: 'a1', item: `Look at scan ${n}`, state: 'doing' } as never)
    await clock.advance(700)
  }
  expect(await barDrawings()).toBe(drawnBefore)
  expect((await boxesIn(bar))[0]?.props.rows).toBe(4)
  expect((await boxesIn(bar))[0]?.key).toBe(growing?.key)
  // Half a minute after the last letter the hold ends by itself, as the app may say nothing when the cursor leaves: what was put
  // off is drawn then, once. A letter typed holds it again at once
  await clock.advance(31_000)
  const drawnAfter = await barDrawings()
  expect(drawnAfter).toBeGreaterThan(drawnBefore)
  await bar.input({ key: growing?.key ?? '', text: `${typed} More.`, kind: 'change' } as never)
  for (const n of [1, 2, 3]) {
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `s${n}`, agentId: 'a1', text: `Later step ${n}` } as never)
    await clock.advance(5000)
  }
  expect(await barDrawings()).toBe(drawnAfter)
  // What newly waits on the person still shows at once: a key box asked for meanwhile is in the panel within a second or two
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-k', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const keyBox = '7c1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${keyBox}.json`, JSON.stringify({ id: keyBox, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: clock.now() }))
  await clock.advance(2000)
  expect(await until(async () => list.find({ type: 'Text', text: GITHUB_ASKED }))).toBeDefined()
  files.delete(`${MEMORY}/boxes/${keyBox}.json`)
  await clock.advance(2000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: GITHUB_ASKED })) ? undefined : true))).toBe(true)
  // Half typed: the same box through the bar's own drawings, drawn with the text it was last drawn with, never with letters
  // older than the box holds
  const [first] = await boxesIn(bar)
  await bar.input({ key: first?.key ?? '', text: 'The left, but ke', kind: 'change' } as never)
  await clock.advance(6000)
  expect((await boxesIn(bar))[0]?.key).toBe(first?.key)
  expect((await boxesIn(bar))[0]?.props.value ?? '').toBe('')
  // A letter typed holds the bar as drawn for as long as the box may hold the cursor, past the half minute typing holds the
  // panel: the panel scrolled meanwhile draws nothing new under the cursor. Five minutes after the last letter it is drawn again
  await scrolled(40)
  await clock.advance(31_000)
  expect(await isShow()).toBe(false)
  expect((await boxesIn(bar))[0]?.key).toBe(first?.key)
  await clock.advance(270_000)
  await scrolled(0)
  await scrolled(40)
  expect(await until(async () => ((await isShow()) ? true : undefined))).toBe(true)
  await scrolled(0)
  // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
  await bar.press({ key: (await labelled(bar, 'Close'))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 0 ? true : undefined))).toBe(true)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 ? true : undefined))).toBe(true)
  expect((await labelled(list, CLOSE)).length).toBe(0)
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar))[0]?.props.value === 'The left, but ke' ? true : undefined))).toBe(true)
  // Closed from the card, the same
  await list.press({ key: (await labelled(list, CLOSE))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 0 ? true : undefined))).toBe(true)
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 1 ? true : undefined))).toBe(true)
  // A second piece of work asks while the box is open: the box stays the first card's, and the newer card offers its own
  await $.agent.spawn({ ...spawn, description: 'Sort the invoices', prompt: 'sort the invoices' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which month?', choices: ['October', 'November'] } as never)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 && (await labelled(list, CLOSE)).length === 1 ? true : undefined))).toBe(true)
  expect(await says(bar, /^↳ Your answer to “Check the ears”$/)).toBe(true)
  // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await says(bar, /^↳ Your answer to “Sort the invoices”$/)) ? true : undefined))).toBe(true)
  expect((await boxesIn(bar)).length).toBe(1)
  expect((await boxesIn(bar))[0]?.props.value ?? '').toBe('')
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await says(bar, /^↳ Your answer to “Check the ears”$/)) ? true : undefined))).toBe(true)
  expect((await boxesIn(bar))[0]?.props.value).toBe('The left, but ke')
  // Sent from the bar with its Send button: it reaches the work in the person's own words, and the box goes with the ask, on to no
  // other card
  await bar.input({ key: (await boxesIn(bar))[0]?.key ?? '', text: 'The left, but keep the scan', kind: 'change' } as never)
  await bar.press({ key: (await labelled(bar, 'Send'))[0]?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('in their own words: The left, but keep the scan')))).toBeDefined()
  expect(await until(async () => ((await boxesIn(bar)).length === 0 ? true : undefined))).toBe(true)
  expect((await labelled(list, OPEN)).length).toBe(1)
  // The bar folded by the person with a reply half typed in it: nothing of the bar is on screen, so the card has its own box
  // again, with what was typed, and offers no box elsewhere
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 1 ? true : undefined))).toBe(true)
  await bar.input({ key: (await boxesIn(bar))[0]?.key ?? '', text: 'Nov', kind: 'change' } as never)
  await bar.unmount()
  await clock.advance(2000)
  const folded = await $.ui.mount({ ...BAND, props: { ...BAND.props, isCollapsed: true }, surface: 'desktop' } as never)
  expect(await until(async () => ((await boxesIn(list))[0]?.props.value === 'Nov' ? true : undefined))).toBe(true)
  // The card's own box is the block's one field: a box of lines too, which sends by itself, with no Send button beside it
  expect((await boxesIn(list))[0]?.props.rows).toBe(4)
  expect((await boxesIn(list))[0]?.props.placeholder).toBe(OPEN)
  expect((await boxesIn(list))[0]?.props.submitLabel).toBe('Send')
  expect((await labelled(list, 'Send')).length).toBe(0)
  expect((await boxesIn(folded)).length + (await labelled(list, OPEN)).length + (await labelled(list, CLOSE)).length).toBe(0)
  // Unfolded: the box does not open by itself; the card offers it again
  await folded.unmount()
  await clock.advance(2000)
  const unfolded = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 && (await boxesIn(list)).length === 0 ? true : undefined))).toBe(true)
  expect((await boxesIn(unfolded)).length).toBe(0)
  // One of the app's surveys in the bar while the box is open: the box has no place there, and the card has its own again, with
  // what was typed
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(unfolded))[0]?.props.value === 'Nov' ? true : undefined))).toBe(true)
  await unfolded.unmount()
  await clock.advance(2000)
  const surveyed = await $.ui.mount({ ...BAND, props: { ...BAND.props, hasSurvey: true }, surface: 'desktop' } as never)
  expect(await until(async () => ((await boxesIn(list))[0]?.props.value === 'Nov' ? true : undefined))).toBe(true)
  await surveyed.unmount()
  await clock.advance(2000)
  // The bar back and the box opened, a reply half typed: a new question from the same work leaves the box as it is, the same box
  // with what was typed. Only the person closes or moves it (16 Nov)
  const again = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 ? true : undefined))).toBe(true)
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(again))[0]?.props.value === 'Nov' ? true : undefined))).toBe(true)
  const [typedIn] = await boxesIn(again)
  await again.input({ key: typedIn?.key ?? '', text: 'Nov 20', kind: 'change' } as never)
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'Which year?', choices: ['2025', '2026'] } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which year?' }))).toBeDefined()
  expect((await boxesIn(again)).map(one => one.key)).toEqual([typedIn?.key])
  expect((await labelled(list, CLOSE)).length).toBe(1)
  // Closed and opened again under the new question, what was typed is still there
  await list.press({ key: (await labelled(list, CLOSE))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(again)).length === 0 ? true : undefined))).toBe(true)
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(again))[0]?.props.value === 'Nov 20' ? true : undefined))).toBe(true)
  // Sent from a box drawn before yet another question came, it answers what the work asks now, and the box goes; the same work
  // asking again finds it closed
  const [second] = await boxesIn(again)
  await again.input({ key: second?.key ?? '', text: 'Nov 202', kind: 'change' } as never)
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3b', agentId: 'a2', text: 'Which decade?', choices: ['2010s', '2020s'] } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which decade?' }))).toBeDefined()
  expect((await boxesIn(again)).map(one => one.key)).toEqual([second?.key])
  await again.input({ key: second?.key ?? '', text: 'November 2026' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('in their own words: November 2026')))).toBeDefined()
  expect(await until(async () => ((await boxesIn(again)).length === 0 ? true : undefined))).toBe(true)
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Which day?', choices: ['Monday', 'Friday'] } as never)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 ? true : undefined))).toBe(true)
  expect((await boxesIn(again)).length + (await labelled(list, CLOSE)).length).toBe(0)
  // A button pressed on the card with the box open answers it, and the box leaves the bar with the ask
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(again)).length === 1 ? true : undefined))).toBe(true)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Monday')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Monday"')))).toBeDefined()
  expect(await until(async () => ((await boxesIn(again)).length === 0 ? true : undefined))).toBe(true)
  // The work taking its question back while the box is open and typed in: the box leaves the bar within a second or so, as the bar
  // held for the box is looked at once a second (the same as a card stopped or answered elsewhere)
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Which hour?', choices: ['9', '10'] } as never)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 ? true : undefined))).toBe(true)
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(again)).length === 1 ? true : undefined))).toBe(true)
  await again.input({ key: (await boxesIn(again))[0]?.key ?? '', text: 'Nine', kind: 'change' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: '' } as never)
  await clock.advance(1000)
  await clock.advance(1000)
  expect(await until(async () => ((await boxesIn(again)).length === 0 ? true : undefined))).toBe(true)
  // The card's own box, the bar folded, stays four lines as it is typed in, and is a new empty one once a reply was sent and the
  // work asks anew
  await again.unmount()
  await clock.advance(2000)
  const shut = await $.ui.mount({ ...BAND, props: { ...BAND.props, isCollapsed: true }, surface: 'desktop' } as never)
  const five = 'one\ntwo\nthree\nfour\nfive'
  for (const [n, text] of [[7, 'Which minute?'], [8, 'Which second?']] as const) {
    await clock.advance(2000)
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k${n}`, agentId: 'a2', text, choices: ['Now', 'Later'] } as never)
    expect(await until(async () => ((await boxesIn(list)).length === 1 && (await boxesIn(list))[0]?.props.rows === 4 && !(await boxesIn(list))[0]?.props.value ? true : undefined))).toBe(true)
    await list.input({ key: (await boxesIn(list))[0]?.key ?? '', text: five, kind: 'change' } as never)
    await clock.advance(1000)
    expect((await boxesIn(list))[0]?.props.rows).toBe(4)
    await list.input({ key: (await boxesIn(list))[0]?.key ?? '', text: five })
    expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('in their own words: one\ntwo')))).toBeDefined()
  }
  // Message, on a card of this chat's that has finished, beside its Dismiss, or still works, beside its Stop: only where the
  // bar above the chat takes a box, so not while that bar is folded
  const key = async (base: string) => (await list.findAll({ type: 'Button' })).find(b => new RegExp(`^${base}-\\d+$`).test(b.key ?? ''))
  await $.agent.spawn({ ...spawn, description: 'Trim the tail', prompt: 'trim the tail' } as never)
  await $.turn.complete({ agentId: 'a3', answer: 'The tail is trimmed.', durationMs: 1, isAborted: false, turnId: 'c1', reason: 'answer' })
  expect(await until(async () => (await key('dismiss-a3')) ?? undefined)).toBeDefined()
  expect(await key('change-a3')).toBeUndefined()
  await shut.unmount()
  const top = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await until(async () => (await key('change-a3')) ?? undefined))?.props.label).toBe('Give feedback')
  expect((await list.findAll({ type: 'Button' })).map(b => String(b.key)).filter(one => /^(change|dismiss)-a3-/.test(one)).map(one => one.split('-')[0])).toEqual(['change', 'dismiss'])
  // Pressed, it opens the box in the bar for that card, with no question: one line that asks what to change, Send and Close
  const changeBox = async () => (await top.findAll({ type: 'Input' } as never)).find(one => /-reply-change-/.test(one.key ?? ''))
  const changes = () => resumed.filter(line => line.includes('wrote to you from the card'))
  const toldOfChange = () => appended.filter(line => line.includes('wrote to the task'))
  const wasSubmitted = submitted.length
  expect(await changeBox()).toBeUndefined()
  await list.press({ key: (await key('change-a3'))?.key ?? '' })
  const opened = await until(changeBox)
  expect(opened).toBeDefined()
  expect(await oneBox(top)).toEqual({ head: '↳ Message to “Trim the tail”', fields: ['Type your message'], enter: SENDS, buttons: ['Send', 'Close'] })
  // Close closes it and sends nothing: the card is Done as it was, and the box opened again is empty
  await top.input({ key: opened?.key ?? '', text: 'Never mind this', kind: 'change' } as never)
  await top.press({ key: (await labelled(top, CLOSE))[0]?.key ?? '' })
  expect(await until(async () => ((await changeBox()) ? undefined : true))).toBe(true)
  expect(changes()).toHaveLength(0)
  expect(toldOfChange()).toHaveLength(0)
  expect(await key('stop-a3') ?? (await list.find({ type: 'Button', key: 'stop-a3' }))).toBeUndefined()
  await list.press({ key: (await until(async () => (await key('change-a3')) ?? undefined))?.key ?? '' })
  const again2 = await until(changeBox)
  expect(again2?.props.value).toBe('')
  // Send starts that same task again with the words, from the submit's own hook, never from a timer (the clock has not moved);
  // its card is at work at once, the box is gone, and the chat is asked nothing: it is only told, with no turn of its own
  const sentAt = clock.now()
  await top.input({ key: again2?.key ?? '', text: 'Leave the tip longer' })
  expect(clock.now()).toBe(sentAt)
  expect(changes()).toEqual(['a3: The person wrote to you from the card of your finished task, in their own words: Leave the tip longer\nYou had finished. Carry on with their words: tick or add to-dos for what they ask, do it, then hand back again with only what is new.'])
  expect(submitted).toHaveLength(wasSubmitted)
  expect(toldOfChange()).toEqual([expect.stringContaining('wrote to the task "Trim the tail" on its card: “Leave the tip longer”. The task has their words and carries on with them itself: start nothing for it.')])
  expect(await until(async () => (await list.find({ type: 'Button', key: 'stop-a3' })) ?? undefined)).toBeDefined()
  expect(await until(async () => ((await changeBox()) ? undefined : true))).toBe(true)
  // At work, its card keeps Message beside Stop: what is sent goes straight to the task as the person's words, between its steps,
  // and the chat is asked nothing
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'td-a3', agentId: 'a3', item: 'Lengthen the tip', state: 'doing' } as never)
  expect((await until(async () => (await key('change-a3')) ?? undefined))?.props.label).toBe('Message')
  await list.press({ key: (await key('change-a3'))?.key ?? '' })
  const atWork = await until(changeBox)
  expect(await oneBox(top)).toEqual({ head: '↳ Message to “Trim the tail”', fields: ['Type your message'], enter: SENDS, buttons: ['Send', 'Close'] })
  // Under the box, while the task works: Attach, Stop and send, and Send (19 Nov, the person: "either send and interrupt, or just
  // send for the next turn. Have the ability to attach pictures, videos, files, whatever")
  const footOf = async (site: Site, from: string) => (await site.findAll({ type: 'Button' })).filter(b => String(b.key ?? '').startsWith(from)).map(b => String(b.props.label))
  expect(await footOf(top, 'band-box-')).toEqual(['Attach', 'Stop and send', 'Send', 'Close'])
  await top.input({ key: atWork?.key ?? '', text: 'Keep the tuft' })
  expect(await until(async () => appended.find(line => line.startsWith('a3: ') && line.includes('wrote to you from your card, in their own words: Keep the tuft\n')))).toBeDefined()
  expect(submitted).toHaveLength(wasSubmitted)
  expect(await until(async () => ((await changeBox()) ? undefined : true))).toBe(true)
  // The task's own view, its Details: the same box at its bottom, under its conversation, at work or done; what is typed there is
  // the same message as in the box above the chat, and goes the same way
  const view3 = await $.ui.mount({ ...LIST, requestId: 'work-a3', surface: 'desktop' } as never)
  const viewBox = async () => (await view3.findAll({ type: 'Input' } as never)).find(one => /^details-a3-reply-change-/.test(one.key ?? ''))
  expect((await until(viewBox))?.props.placeholder).toBe('Type your message')
  expect((await viewBox())?.props.rows).toBe(4)
  const heads = (await view3.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(heads.lastIndexOf('Message')).toBeGreaterThan(heads.indexOf('Conversation'))
  expect(await footOf(view3, 'details-a3-')).toEqual(['Attach', 'Stop and send', 'Send'])
  // Typed in, while the task writes its card: the same box, never drawn anew under the person (its ring would flash, and the app
  // pulls the tab back to it at every drawing)
  const viewNumber = async () => {
    let found: number | undefined
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return void node.forEach(walk)
      if (!node || typeof node !== 'object') return
      const one = node as { type?: string; props?: { key?: string }; press?: { handle?: number }; children?: unknown }
      if (one.type === 'Input' && /^details-a3-reply-/.test(one.props?.key ?? '')) found = one.press?.handle
      walk(one.children)
    }
    walk(await view3.drawn())
    return found
  }
  await view3.input({ key: (await viewBox())?.key ?? '', text: 'Shorter ears', kind: 'change' } as never)
  await clock.advance(100)
  const viewNumbered = await viewNumber()
  expect(viewNumbered).toBeDefined()
  for (const n of [1, 2, 3]) {
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `ve${n}`, agentId: 'a3', text: `Ear step ${n}` } as never)
    await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: `vt${n}`, agentId: 'a3', item: `Ear to-do ${n}`, state: 'doing' } as never)
    await clock.advance(3000)
  }
  expect(await viewNumber()).toBe(viewNumbered)
  // Opened above the chat too, the box holds what was typed in the view
  await list.press({ key: (await until(async () => (await key('change-a3')) ?? undefined))?.key ?? '' })
  expect((await until(changeBox))?.props.value).toBe('Shorter ears')
  await top.press({ key: (await labelled(top, CLOSE))[0]?.key ?? '' })
  // Attach opens the computer's own file picker; what is picked shows under the box, each taken off with a press on it
  files.set('picker:chosen', '/Users/me/Desktop/ears.png\n/Users/me/Movies/ears.mov\n')
  await view3.press({ key: (await view3.findAll({ type: 'Button' })).find(b => b.props.label === 'Attach')?.key ?? '' })
  const chips = async () => (await view3.findAll({ type: 'Button' })).map(b => String(b.props.label)).filter(label => label.startsWith('📎'))
  expect(await until(async () => ((await chips()).length === 2 ? await chips() : undefined))).toEqual(['📎 ears.png ✕', '📎 ears.mov ✕'])
  await view3.press({ key: (await view3.findAll({ type: 'Button' })).find(b => b.props.label === '📎 ears.mov ✕')?.key ?? '' })
  expect(await until(async () => ((await chips()).length === 1 ? await chips() : undefined))).toEqual(['📎 ears.png ✕'])
  // A path dropped or typed into the box, a file on this computer, goes as a file too
  files.set('/Users/me/Desktop/ref shot.mov', 'x')
  await view3.input({ key: (await viewBox())?.key ?? '', text: 'Shorter ears, like /Users/me/Desktop/ref\\ shot.mov', kind: 'change' } as never)
  // Stop and send stops the task where it is and starts it again with the words and the files, each with how to open it; its card
  // stays at work all along
  const wasStopped = stopped.length
  await view3.press({ key: (await view3.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop and send')?.key ?? '' })
  expect(await until(async () => (stopped.length > wasStopped ? stopped.at(-1) : undefined))).toBe('a3')
  const now = await until(async () => resumed.find(line => line.startsWith('a3: ') && line.includes('stopped you to write to you from your card')))
  expect(now).toContain('in their own words: Shorter ears, like /Users/me/Desktop/ref\\ shot.mov\n')
  expect(now).toContain('- /Users/me/Desktop/ears.png (open it with Read)')
  expect(now).toContain('- /Users/me/Desktop/ref shot.mov (take stills from it')
  expect(now).not.toContain('ears.mov')
  expect(await until(async () => (await list.find({ type: 'Button', key: 'stop-a3' })) ?? undefined)).toBeDefined()
  expect(await until(async () => ((await chips()).length === 0 && !(await viewBox())?.props.value ? true : undefined))).toBe(true)
  // It finishes again, and can be asked for a change again
  await $.turn.complete({ agentId: 'a3', answer: 'The tip is longer now.', durationMs: 1, isAborted: false, turnId: 'c2', reason: 'answer' })
  expect(await until(async () => (await key('change-a3')) ?? undefined)).toBeDefined()
  // Done, its view keeps the box, with only Send: the message starts it again
  expect(await until(async () => ((await footOf(view3, 'details-a3-')).join() === 'Attach,Send' ? true : undefined))).toBe(true)
  await view3.input({ key: (await viewBox())?.key ?? '', text: 'One more ear' })
  expect(await until(async () => changes().find(line => line.includes('in their own words: One more ear\n')))).toBeDefined()
  await view3.unmount()
  expect(filled).toEqual([])
  await Promise.all([list.unmount(), details.unmount(), top.unmount()])
})


test('a question nobody answers on its card is said again at 15 minutes and an hour, once each, and no more once answered; with each message of the person the chat reads what every card shows and is asked to name the question once an hour', SLOW, async ($, on) => {
  const { notified, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'push the fix', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Push the fix', prompt: 'push it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'a1', item: 'Fix the scroll', state: 'done' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't2', agentId: 'a1', item: 'Push it', state: 'doing' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Sign in to GitHub in the browser pane.' } as never)
  const reminders = () => notified.filter(line => line.startsWith('Push the fix still waits for you | Waiting '))
  const minutes = async (n: number) => {
    for (let at = 0; at < n; at += 1) await clock.advance(60_000)
  }
  // 17 Nov: a sign-in sat unseen for hours, as only the first notification ever went
  await minutes(14)
  expect(reminders()).toEqual([])
  await minutes(2)
  expect(reminders()).toHaveLength(1)
  expect(reminders()[0]).toMatch(/^Push the fix still waits for you \| Waiting 1[56]m · Sign in to GitHub in the browser pane\.$/)
  await minutes(30)
  expect(reminders()).toHaveLength(1)
  // The person types in the chat: the chat reads every card as it is, and is asked to name the question in its reply, once an hour
  const said = async (text: string) => ((await $.prompt.submit({ text, wait: false, origin: composer })) as { context?: string[] }).context?.join('\n') ?? ''
  const first = await said('how is it going?')
  expect(first).toContain('What the latest task cards show now, for when the person asks how things stand')
  expect(first).toMatch(/- "Push the fix" \(a1\): waiting for the person for 4\dm: Sign in to GitHub in the browser pane\./)
  expect(first).toContain('Waiting on the person on a card, unanswered: "Push the fix". Unless your reply is about it, end it with one short line')
  // Within the hour, with nothing on the cards changed, the chat is not told again
  expect(await said('and the other one?')).not.toContain('What the latest task cards show')
  await minutes(16)
  expect(reminders()).toHaveLength(2)
  // Answered, it is said no more, and the card reads as at work with its to-dos
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  expect(await said('ok')).toMatch(/- "Push the fix" \(a1\): working, 1 of 2 to-dos done, doing "Push it"/)
  await minutes(200)
  expect(reminders()).toHaveLength(2)
  // A reply in words that does not settle a new question starts its wait afresh: no reminder of the time before the reply
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Push to main or to a branch?', choices: ['Main', 'A branch'] } as never)
  await minutes(10)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'What is the difference?' })
  await list.unmount()
  await $.turn.complete({ answer: 'Asked again.', durationMs: 1, isAborted: false, turnId: 'r1', reason: 'answer', agentId: 'a1' } as never)
  await minutes(8)
  expect(notified.filter(line => line.includes('Push to main or to a branch?') && line.includes('still waits'))).toEqual([])
})
