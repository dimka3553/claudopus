// The asking card: an ask, its Copy, buttons and reply box

const GITHUB_BOX = "Claudopus needs GITHUB_TOKEN. It is saved only in this Mac's keychain. Claude uses it by name, and it is hidden in anything a command prints."
const NPM_BOX = "Claudopus needs NPM_TOKEN. It is saved only in this Mac's keychain. Claude uses it by name, and it is hidden in anything a command prints."
const ADMIN_BOX = 'Claudopus needs the admin password of this Mac to run the admin command below. Nothing is saved: it goes only to that command, and the next one asks again.'

test('work that needs the person\'s hands asks: its card stands out first with the ask, the text to paste with its Copy, and answers that go back to it', async ($, on) => {
  // Once its run has ended, a work's chat takes no more lines
  const ended = new Set<string>()
  const { played, notified, appended, terminals, submitted, resumed, shown, files } = world(on, { ended })
  const clip: string[] = []
  on('ui.copy', (_, e) => (clip.push(e.text), { value: { isCopied: true } }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'Paste this code on the GitHub page that opened.', copy: 'ABCD-1234' } as never)
  expect(asked.result).toContain('Shown on your card')
  expect(played.length).toBeGreaterThan(0)
  expect(notified).toContain('Check the ears has a question for you | Paste this code on the GitHub page that opened.')
  const titles = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  expect(titles.indexOf('Check the ears')).toBeGreaterThan(-1)
  expect(titles.indexOf('Check the ears')).toBeLessThan(titles.indexOf('Hide the repo'))
  expect((await list.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' }))?.props.color).toBe('#E5A50A')
  // The code is shown with one Copy button, which puts it on the clipboard and says so
  expect((await list.find({ type: 'Text', text: 'ABCD-1234' }))?.props.mono).toBe(true)
  await pressed(list, 'ask-a2-copy')
  expect(clip).toEqual(['ABCD-1234'])
  expect((await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Copied')))).toBeDefined()
  // Its Details tab has it at the top, and clearing it takes it away
  const ears = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: '' } as never)
  expect(await list.find({ type: 'Text', text: 'ABCD-1234' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()

  // An ask for a go-ahead carries buttons; the one pressed goes back to the work and the ask goes
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  const approve = (await ears.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')
  expect(approve).toBeDefined()
  await ears.press({ key: approve?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Approve"')))).toContain('May I delete the old repo?')
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')).toBeUndefined()
  // Or a reply in the person's own words, right on the small card: the reply goes to the work. One that is none of the ask's buttons,
  // such as a question back, does not settle it: the ask stays with the reply under it, and its answers go, as the person has answered
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(false)
  expect((await ears.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box?.props.placeholder).toBe('Or reply in your own words')
  await list.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  const toWork = (await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))) ?? ''
  expect(toWork).toContain('Submit it to the plugin directory.')
  expect(toWork).toContain('does not settle your question by itself')
  // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
  // and no buttons, box or send, on the small card and in Details
  expect((await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' }))?.props.color).toBe('#8A63F0')
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Claude is working on your reply' })).toBeDefined()
  for (const pane of [list, ears]) {
    expect((await pane.findAll({ type: 'Button' })).some(b => b.props.label === 'Submitted' || b.props.label === 'Not now')).toBe(false)
    expect((await pane.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  }
  const waiting = '✓ You replied “Where do I do that?” · Claude will see this after its current step'
  expect(await until(async () => list.find({ type: 'Text', text: waiting }))).toBeDefined()
  expect(await until(async () => ears.find({ type: 'Text', text: waiting }))).toBeDefined()
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Where do I do that?” · Claude is working on it' }))).toBeDefined()
  // The work asks again: amber again, with its answers back and an empty box
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5b', agentId: 'a2', text: 'It is under Manage, then Submit new. Done?' } as never)
  expect((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' }))?.props.color).toBe('#E5A50A')
  // With no buttons of its own, every ask offers Done and Not now
  const labels = (await list.findAll({ type: 'Button' })).map(b => b.props.label)
  expect(labels).toContain('Done')
  expect(labels).toContain('Not now')
  const again = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(again?.key).not.toBe(box?.key)
  expect(again?.props.value ?? '').toBe('')
  // Half a reply typed, then Done pressed twice: the answer goes once, and the half reply is not left for the next ask
  await list.input({ key: again?.key ?? '', text: 'Not y', kind: 'change' } as never)
  const done = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? ''
  await Promise.all([list.press({ key: done }), list.press({ key: done }).catch(() => undefined)])
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Done"')))).toContain('Submit new. Done?')
  expect(appended.filter(line => line.startsWith('a2: ') && line.includes('"Done"'))).toHaveLength(1)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Done” · Claude will see this after its current step' }))).toBeDefined()
  // A newer line from the work takes the answer's place
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I submitted it.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I submitted it.' }))).toBeDefined()
  // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' } as never)
  ended.add('a2')
  const box3 = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box3?.props.value ?? '').toBe('')
  await list.input({ key: box3?.key ?? '', text: 'claudopus' })
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('in their own words: claudopus')))).toContain('this answer starts you again')
  expect(submitted.some(line => line.includes('claudopus'))).toBe(false)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “claudopus” · Claude will see this after its current step' }))).toBeDefined()
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
  expect(await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Opened in Terminal, typed, not run'))).toBeDefined()
  expect(terminals).toEqual([])
  // A folder with a quote in its name is quoted whole
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a2', text: 'Run it here.', command: 'make', cwd: "/repo/it's here" } as never)
  const before2 = shown.length
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')?.key ?? '' })
  const second = await until(async () => shown.slice(before2).find(argv => String(argv[1]).endsWith('/open.command')))
  expect(files.get(String(second?.[1]))).toContain("cd '/repo/it'\\''s here'")

  // A reply written into work that then ends without another step was never read: it starts the work again
  ended.delete('a2')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main', 'Not now'] } as never)
  const box4 = (await ears.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await ears.input({ key: box4?.key ?? '', text: 'main' })
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · Claude will see this after its current step' }))).toBeDefined()
  await $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('you ended before reading it: main')))).toContain('Which branch?')
  expect(submitted.some(line => line.includes('Which branch?'))).toBe(false)
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · Claude will see this after its current step' }))).toBeDefined()
  await Promise.all([list.unmount(), ears.unmount()])
})

test('while the person types into an ask the panel holds its drawing whole, as other cards move, start and finish around it: the 15 Nov panel that jumped to its bottom and flickered with every letter typed', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Keep digging for head CTs', prompt: 'dig' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which source next?', details: 'A long explanation.\n\n- one\n- two\n- three', choices: ['Kaggle', 'TCIA', 'Not now'] } as never)
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
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${surface}`, agentId: 'a1', text: 'Which source next?', choices: ['Kaggle', 'TCIA', 'Not now'] } as never)
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
    return (await config.findAll({ type: 'Text' })).map(one => one.text ?? '').map(text => /Last looked (\d+ min)/.exec(text)?.[1]).find(Boolean)
  }
  expect(await says()).toBe('5 min')
  // From the focus on one of its buttons until the press, the drawing on screen stays, so the press names that button
  const reset = (await config.findAll({ type: 'Button' })).find(one => one.props.label === 'Reset')
  expect(reset).toBeDefined()
  await ($.ui as any).focus({ component: 'Pane', requestId: 'config', plugin: 'claudopus', element: reset?.key, isHeld: true, origin: { kind: 'person' } }).catch(() => undefined)
  looked(20)
  await clock.advance(1200)
  expect(await says()).toBe('5 min')
  expect((await config.findAll({ type: 'Button' })).some(one => one.key === reset?.key)).toBe(true)
  // and once the click is over, drawn afresh
  await clock.advance(1000)
  expect(await says()).toBe('20 min')
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I go on?', choices: ['Approve', 'Not now'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = async () => JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await clock.advance(1000)
  const before = await texts()
  await clock.advance(3000)
  expect(await texts()).toBe(before)
  // The work writes a line: drawn at once
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I am looking at the left ear.' }))).toBeDefined()
  // and its time moves again within ten seconds
  const after = await texts()
  await clock.advance(11_000)
  expect(await until(async () => ((await texts()) !== after ? true : undefined))).toBe(true)
  // A press shows what it did at once
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key ?? '' })
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'May I go on?' })) ? undefined : true))).toBe(true)
  // and so does one that only opens a part of the panel, Finished, with work ended and other work running
  await $.agent.spawn({ ...spawn, description: 'Check the nose', prompt: 'nose' } as never)
  await $.turn.complete({ answer: 'Nose checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(12_000)
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

test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', SLOW, async ($, on) => {
  const { submitted, resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run this to restart that chat yourself.', command: 'ssh m4 tmux respawn-pane -k -t claude' } as never)
  await $.turn.complete({ answer: 'I could not restart it; the command is on your card.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  // Long after it finished, the ask is still there, amber, with its Done and Not now and its button for Terminal
  await clock.advance(10 * 60_000)
  expect((await until(async () => list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })))?.props.color).toBe('#E5A50A')
  const labels = (await list.findAll({ type: 'Button' })).map(b => b.props.label)
  expect(labels).toContain('Done')
  expect(labels).toContain('Not now')
  expect(labels).toContain('Open in Terminal')
  // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Done"') && line.includes('Run this to restart that chat yourself.')))).toBeDefined()
  expect(submitted.some(line => line.includes('Run this to restart'))).toBe(false)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test('a press on one ended work\'s ask leaves the other asks\' buttons where they were: the 14 Nov "Release it" pressed from a phone right after another card\'s, on the keys it last drew, which ran nothing', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two releases', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Linux support', prompt: 'linux' } as never)
  await $.agent.spawn({ ...spawn, description: 'Azure route', prompt: 'azure' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  for (const [id, text] of [['a1', 'Release Linux support?'], ['a2', 'Release the Azure route?']]) {
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${id}`, agentId: id, text, choices: ['Release it', 'Not now'] } as never)
    await $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: `turn-${id}`, reason: 'answer', agentId: id } as never)
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

test('a go-ahead to finish on ended work does its last step without waking it: a release in a repo with .release is held on the card for the allow, any other step goes to a small fresh task; a reply in words or the other choice still goes to the work', async ($, on) => {
  const { files, resumed, appended, clock, wake, asked } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'four fixes', wait: false, origin: composer })
  for (const description of ['Fix the nose', 'Fix the ear', 'Fix the chin', 'Fix the brow']) await $.agent.spawn({ ...spawn, model: 'opus', description, prompt: description } as never)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // The worktrees: one released by its runner, one with no .release
  files.set('/repo/wt/.release', 'mods/claudopus/bin/release')
  files.set('/repo/plain/README.md', '# plain')
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-nose')
  const ask = async (id: string, last_step: string, folder: string) => {
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${id}`, agentId: id, text: `Release ${id}?`, choices: ['Release it', 'Not now'], last_step, folder } as never)
    await $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: `turn-${id}`, reason: 'answer', agentId: id } as never)
  }
  const press = async (id: string, label: string) => {
    const key = await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === label && String(b.key ?? '').startsWith(`ask-${id}-`))?.key)
    await list.press({ key: key ?? '' })
  }
  await ask('a1', 'release', '/repo/wt')
  await ask('a2', 'Merge the PR and look at the build', '/repo/plain')
  await ask('a3', 'release', '/repo/wt')
  await ask('a4', 'release', '/repo/wt')
  await clock.advance(60_000)

  // Release it: the card holds the release's allow box for the branch, and the work is not started again
  await press('a1', 'Release it')
  expect(await until(async () => (await list.findAll({ type: 'Button' })).find(b => /^gate-step-a1-.*once/.test(String(b.key ?? ''))))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Branch fix-nose' })).toBeDefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('last step of a1 on')
  // Denied, nothing is released and the work still sleeps
  const deny = (await list.findAll({ type: 'Button' })).find(b => /^gate-step-a1-.*deny/.test(String(b.key ?? '')))
  await list.press({ key: deny?.key ?? '' })
  expect(await until(async () => (wake(), (files.get(`${MEMORY}/log.md`) ?? '').includes('release of wt: denied') ? true : undefined))).toBe(true)

  // Another last step: a small fresh task in the folder does it, started from the next hook of the mod (here the next press), and the
  // work is not started again
  await press('a2', 'Release it')
  expect(await until(async () => ((files.get(`${MEMORY}/log.md`) ?? '').includes('last step of a2 on') ? 'step' : undefined))).toBe('step')
  // The other choice still goes to the work
  await press('a3', 'Not now')
  expect(await until(async () => resumed.find(line => line.startsWith('a3: ') && line.includes('pressed "Not now"')))).toBeDefined()
  // (the kit drops a kind it has no definition of, so the small task is known by its prompt and model)
  const quick = await until(async () => prompts.find(one => one.startsWith('Do the last step of the task "Fix the ear"')))
  expect(quick).toContain('Merge the PR and look at the build')
  expect(quick).toContain('Work in /repo/plain, on its branch fix-nose')
  // on Sonnet, the cheapest and fastest measured for a step stated this clearly
  expect(asked.at(-1)).toBe('sonnet')
  expect(files.get(`${MEMORY}/log.md`)).toContain('does the last step of a2')
  expect(resumed.filter(line => line.startsWith('a1: ') || line.startsWith('a2: '))).toEqual([])
  // and so does a reply in words
  const box = await until(async () => ((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).find(one => /-reply-/.test(one.key ?? '') && String(one.key).includes('a4')))
  await list.input({ key: box?.key ?? '', text: 'Release it after lunch' })
  expect(await until(async () => resumed.find(line => line.startsWith('a4: ') && line.includes('Release it after lunch')))).toBeDefined()

  // Release it pressed while the work is still in the turn that asked (writing its waits and report, as on 16 Nov 19:49 and 17 Nov
  // 07:49): Claudopus still releases it, after the allow box, and the work is told so instead of being left the step
  await $.agent.spawn({ ...spawn, model: 'opus', description: 'Fix the jaw', prompt: 'Fix the jaw' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k-a5', agentId: 'a5', text: 'Release a5?', choices: ['Release it', 'Not now'], last_step: 'release', folder: '/repo/wt' } as never)
  await press('a5', 'Release it')
  expect(await until(async () => (await list.findAll({ type: 'Button' })).find(b => /^gate-step-a5-.*once/.test(String(b.key ?? ''))))).toBeDefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('last step of a5 on')
  expect(await until(async () => appended.find(line => line.startsWith('a5: ') && line.includes('Claudopus does the last step itself')))).toContain('do not do it yourself')
  await list.unmount()
})

test('a reply in words that does not settle an ask keeps it, and the card active, with nothing to press while the work acts on it, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'second round of terminal fixes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Terminal look, second round', prompt: 'second round of terminal fixes' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Release the second round of terminal fixes?'
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  const isFinished = async () => (await labels()).some(label => label.includes('Finished')) || (await texts()).some(text => text.startsWith('Finished'))
  // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release it? (Answers: Release it / Not now.) Built, tested and checked; nothing is released.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => list.find({ type: 'Text', text: ASK }))).toBeDefined()
  expect(await labels()).toContain('Release it')
  // The person replies in their own words, asking for something first: the work is started again with it and told the ask stays
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Show me images first.' })
  const told = (await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('in their own words: Show me images first.')))) ?? ''
  expect(told).toContain('does not settle your question by itself')
  expect(told).toContain('this answer starts you again')
  // The card stays among the running cards, at work, with its question and the reply under it, and no buttons, box or send;
  // nothing is under Finished
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Show me images first.” · Claude will see this after its current step' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  expect(await labels()).not.toContain('Release it')
  expect((await list.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
  // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
  // time with the same reply
  await $.turn.complete({ answer: 'Release it? (Answers: Release it / Not now.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  expect(await labels()).toContain('Release it')
  expect((await list.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  // and its box is a new one, empty: the surface would put the sent words back into a box it found again by its old key
  const back = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(back?.key).not.toBe(box?.key)
  expect(back?.props.value).toBe('')
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  expect(resumed.filter(line => line.startsWith('a1: '))).toHaveLength(1)
  // More words from the person keep it open still; Release it settles it, and the card finishes once the work has acted on it
  const box2 = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box2?.key ?? '', text: 'And the narrow window too, please.' })
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
  expect(await until(async () => ((await isFinished()) ? true : undefined))).toBe(true)
  await list.unmount()
})

test('once the person has answered, by a button or in their own words, the card keeps no buttons, box or send; the same ask asked again comes back fresh, in the panel and the chat: the 14 Nov "I would say maybe stop it" to "Should I stop the depth job?"', async ($, on) => {
  const { appended, logged, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'why the M4 is stuck', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Why the M4 is stuck', prompt: 'why the M4 is stuck' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Should I stop the depth job on your other Mac?'
  const DETAILS = 'Your other Mac is using 42 of its 44 GB of swap.'
  const inputs = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => /-reply-/.test(one.key ?? ''))
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => logged.find(line => line.includes(ASK)))).toBeDefined()
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  // Typed in their own words: purple at once, the question with the reply under it, and no buttons, box, send or details
  const [box] = await inputs()
  await list.input({ key: box?.key ?? '', text: 'I would say maybe stop it and then tell it to release it' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('maybe stop it')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#8A63F0' ? true : undefined))).toBe(true)
  expect(await list.find({ type: 'Text', text: /^✓ You replied “I would say maybe stop it/ })).toBeDefined()
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  expect(await list.find({ type: 'Text', text: DETAILS })).toBeUndefined()
  // The chat is told it acts on the reply, not that it still asks
  const toChat = (await until(async () => logged.find(line => line.includes('You replied to "Why the M4 is stuck"')))) ?? ''
  expect(toChat).toContain('will ask again if it still needs you')
  expect(toChat).not.toContain('It still asks')
  // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#E5A50A' ? true : undefined))).toBe(true)
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  const [again] = await inputs()
  expect(again?.props.value ?? '').toBe('')
  expect(again?.key).not.toBe(box?.key)
  expect(await list.find({ type: 'Text', text: /^✓ You replied/ })).toBeUndefined()
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 2 ? true : undefined))).toBe(true)
  // A button pressed: the ask goes whole, nothing left to press or type
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Stop it"')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Stop it” · Claude will see this after its current step' }))).toBeDefined()
  // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 3 ? true : undefined))).toBe(true)
  await $.prompt.submit({ text: 'Show me the swap first', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their reply: “Show me the swap first”' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#8A63F0' ? true : undefined))).toBe(true)
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 4 ? true : undefined))).toBe(true)
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  expect((await inputs()).length).toBe(1)
  await list.unmount()
})

test('a button answer pressed by mistake is taken back from its card while the card says it: the question comes back with its buttons, the work is told not to act on it, and the next press answers; gone once the work asks again: the 16 Nov "Not now" pressed while reaching for the picture', async ($, on) => {
  const { appended, clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Make the banner', prompt: 'banner' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Use banner 5 on your page?'
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  const press = async (label: string) => list.press({ key: (await list.findAll({ type: 'Button' })).find(b => String(b.props.label) === label)?.key ?? '' })
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Use it', 'Not now'] } as never)
  expect(await until(async () => ((await labels()).includes('Not now') ? true : undefined))).toBe(true)
  await press('Not now')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Not now"')))).toBeDefined()
  expect(await until(async () => ((await labels()).includes('↶ Take back “Not now”') ? true : undefined))).toBe(true)
  await press('↶ Take back “Not now”')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('took back their answer "Not now"')))).toBeDefined()
  expect(await until(async () => ((await labels()).includes('Use it') ? true : undefined))).toBe(true)
  expect(await labels()).not.toContain('↶ Take back “Not now”')
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  // Answered again, it goes as any answer
  await press('Use it')
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Use it"')))).toBeDefined()
  expect(await until(async () => ((await labels()).includes('↶ Take back “Use it”') ? true : undefined))).toBe(true)
  // The work asks something else: the old answer can no longer be taken back, not even from a drawing still showing its button
  const stale = (await list.findAll({ type: 'Button' })).find(b => String(b.props.label) === '↶ Take back “Use it”')?.key ?? ''
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Upload it now?', choices: ['Upload', 'Not now'] } as never)
  expect(await until(async () => ((await labels()).includes('Upload') ? true : undefined))).toBe(true)
  expect(await labels()).not.toContain('↶ Take back “Use it”')
  await list.press({ key: stale }).catch(() => undefined)
  await clock.advance(1000)
  expect(appended.some(line => line.includes('took back their answer "Use it"'))).toBe(false)
  expect(await list.find({ type: 'Text', text: 'Upload it now?' })).toBeDefined()
  await list.unmount()
})

test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with its question and no buttons; stopped again it is amber with them: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', async ($, on) => {
  // What the engine lists of the work, as the terminal's engine does: running while it waits on a command it left running
  const agents: Record<string, string> = {}
  const { resumed, clock } = world(on, { agents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'clip wallet versus affiliate', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clipify affiliate versus clip wallet', prompt: 'clip wallet versus affiliate' } as never)
  const ASK = 'Release PR 54 to production?'
  const AMBER = '#E5A50A'
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
    heading: (await details.find({ type: 'Text', text: 'Needs you now' })) ? 'needs' : (await details.find({ type: 'Text', text: 'Claude is working on your reply' })) ? 'acting' : 'none',
  })
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] } as never)
  await $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.)', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  // Before the reply: it waits on the person, amber everywhere
  const before = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && l.deskEdges.includes(AMBER) && l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(before ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  // The reply in words starts it again: purple while it acts on it, its question still there and nothing to press, in the panel,
  // in Details, in the terminal's panel and in its band
  const box = (await desk.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await desk.input({ key: box?.key ?? '', text: 'Explain to me the exact differences first.' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('Explain to me the exact differences first.')))).toBeDefined()
  const acting = await until(async () => {
    const l = await look()
    return isPurple(l.desk) && isPurple(l.term) && isPurple(l.band) && l.heading === 'acting' ? l : undefined
  })
  expect(acting ?? (await look())).toMatchObject({ heading: 'acting' })
  const now = await look()
  expect(now.deskEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.termEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.deskEdges.some(isPurple)).toBe(true)
  expect(now.termEdges.some(isPurple)).toBe(true)
  for (const labels of now.buttons) expect(labels.filter(label => label === 'Release it' || label === 'Not now')).toEqual([])
  expect((await details.findAll({ type: 'Button' })).some(b => b.props.label === 'Release it')).toBe(false)
  expect((await details.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  // Its turn ends while a command it started in the background still runs, the engine listing it as running: it has not stopped,
  // and stays purple
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Writing up the differences.', durationMs: 1, isAborted: false, turnId: 'turn-2a', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  const held = await look()
  expect([isPurple(held.desk), isPurple(held.term), isPurple(held.band), held.heading]).toEqual([true, true, true, 'acting'])
  agents.a1 = 'completed'
  // The header counts it as running, not as needing the person
  expect(await desk.find({ type: 'Text', text: 'Working on 1 thing' })).toBeDefined()
  // It stops again with the ask still open, the engine listing it as running for a moment as its turn ends: amber again a moment
  // later, once the engine lists its run as over
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.) The differences are…', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  // Listed as idle after, as the engine lists some ended work
  agents.a1 = 'idle'
  await clock.advance(2_000)
  const after = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && !l.deskEdges.some(isPurple) && !l.termEdges.some(isPurple) ? l : undefined
  })
  expect(after ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  for (const labels of (await look()).buttons) expect(labels).toEqual(expect.arrayContaining(['Release it', 'Not now']))
  expect(await desk.find({ type: 'Text', text: '1 thing needs you' })).toBeDefined()
  // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
  await desk.press({ key: (await desk.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => ((await desk.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  const released = await until(async () => {
    const l = await look()
    return l.deskEdges.some(isPurple) && !l.deskEdges.includes(AMBER) && l.termEdges.some(isPurple) && !l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(released ?? (await look())).toMatchObject({ desk: undefined })
  expect(released?.heading).toBe('none')
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
  // The chat shows the ask as the mod's notice, never a prompt in the person's place, with what it asks, its answers and its pictures
  await clock.advance(10)
  const inChat = (await until(async () => logged.find(line => line.includes('Which logo do you want?')))) ?? ''
  expect(submitted.some(line => line.includes('Which logo do you want?'))).toBe(false)
  expect(inChat).toContain('"Redraw the logo" has a question for you: Which logo do you want?')
  expect(inChat).toContain('Answers: A · B, or reply in your own words, here or on its card.')
  expect(inChat).toContain('Pictures: /w/shots/a.png, /w/shots/b.png')
  // The chat's model reads the ask, and how to pass an answer on, in a row the person does not see
  expect(inChat).not.toContain('SendMessage')
  const relay = appended.find(line => line.startsWith('undefined: In the background task "Redraw the logo", Claude asked the person')) ?? ''
  expect(relay).toContain('Which logo do you want? (answers: A · B; pictures: /w/shots/a.png, /w/shots/b.png)')
  expect(relay).toContain('do not pass it on')
  expect(relay).toContain('SendUserFile')
  // Pictures sent as "proactive" did not show in the chat; "normal" ones did
  expect(relay).toContain('status "normal"')
  expect(relay).not.toContain('proactive')
  expect(relay).toContain('SendMessage to "a1"')
  // The same ask said again is not sent again
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png'] } as never)
  await clock.advance(10)
  expect(logged.filter(line => line.includes('Which logo do you want?'))).toHaveLength(1)

  // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
  await $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Which logo do you want?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your question: \"Which logo do you want?\"")))).toBeDefined()
  expect(appended.some(line => line.includes('Decide which of three it is'))).toBe(false)
  // A press on the card no longer counts for that ask
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'B')).toBeUndefined()

  // An ask answered on the card is said in the chat, which sees and reads it; one the work withdraws is said too
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push', 'Not now'] } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('May I push it?')) || undefined)).toBe(true)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Push')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ✓ The person answered "Redraw the logo" on its card: “Push”')))).toBeDefined()
  expect(logged.some(line => line.startsWith('✓ You answered "Redraw the logo" on its card: “Push”'))).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('Answers: Done · Not now')) || undefined)).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' } as never)
  expect(appended.some(line => line === 'undefined: Claude no longer needs an answer for "Redraw the logo".')).toBe(true)
  expect(logged.some(line => line === 'Claude no longer needs an answer for "Redraw the logo".')).toBe(true)
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
  const away = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it', 'Not now'] } as never)
  expect(String(away.result)).toContain('Not shown: the question points at an explanation')
  expect(await list.find({ type: 'Text', text: /Release PR 54/ })).toBeUndefined()
  expect(notified.some(line => line.includes('Release PR 54'))).toBe(false)
  for (const text of ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text, choices: ['Release it', 'Not now'] } as never)).result)).toContain('Not shown')
  }
  // Asks about something shown, such as a code on a page or a picture, are not taken for one
  for (const text of ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text } as never)).result)).toContain('Shown on your card')
  }
  // A go-ahead with nothing under it is shown, and said back to the work
  const bare = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it', 'Not now'] } as never)
  expect(String(bare.result)).toContain('It carries no details')
  // Asked again with its explanation: shown whole under the question on the small card and in Details
  const differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".'
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it', 'Not now'] } as never)
  expect(String(asked.result)).toContain('what it is about under it')
  expect(String(asked.result)).not.toContain('carries no details')
  expect(await list.find({ type: 'Markdown', text: differences })).toBeDefined()
  const big = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await big.find({ type: 'Markdown', text: differences })).toBeDefined()
  // Above the prompt in the terminal, where its numbers answer it, it says there is more
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect(await band.find({ type: 'Text', text: /The details are in the chat above and on its card/ })).toBeDefined()
  await band.unmount()
  // The chat's notice carries it whole, before the answers, plain (no marks for bold), and so does the row the chat's model reads
  await clock.advance(10)
  const notice = (await until(async () => logged.find(line => line.includes('Release PR 54 to production?') && line.includes('What it is about')))) ?? ''
  expect(notice).toContain(`Release PR 54 to production?\nWhat it is about:\n${differences.replaceAll('**', '')}\nAnswers: Release it · Not now`)
  const relay = [...appended].reverse().find(line => line.startsWith('undefined: In the background task "Fix the wallet", Claude asked the person') && line.includes('Release PR 54 to production?')) ?? ''
  expect(relay).toContain(`what it is about, which the person sees in full with it on the card and in the notice: ${differences}`)
  // The chat is told not to say it again: the person has just read it
  expect(relay).toContain('do not repeat what it is about')
  // A pressed answer still matches the ask that carries details
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?')))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: differences })).toBeUndefined()

  // A question longer than one line is cut at a word, with the whole of it at the top of its details
  const long = `Release it? ${'The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)}`.trim()
  const cutShort = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it', 'Not now'] } as never)
  expect(String(cutShort.result)).toContain('whole at the top of its details')
  expect(await big.find({ type: 'Markdown', text: long })).toBeDefined()
  const question = (await big.findAll({ type: 'Text' })).find(one => one.props.bold && String(one.text).startsWith('Release it? The refund rule'))
  expect(question).toBeDefined()
  expect(String(question?.text).length).toBeLessThanOrEqual(302)
  expect(String(question?.text)).toMatch(/[a-z.] …$/)
  // Long details: whole in Details and in the notice, cut on the small card with where the rest is, and cut in the model's row
  const many = Array.from({ length: 120 }, (_, n) => `- Line ${n + 1} of what changes on the payout screens.`).join('\n')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it', 'Not now'] } as never)
  expect(await big.find({ type: 'Markdown', text: many })).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })).toBeDefined()
  await clock.advance(10)
  expect(await until(async () => logged.find(line => line.includes('Line 120 of what changes')))).toBeDefined()
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
  await $.turn.complete({ answer: 'Waiting on your colour.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Blue')))?.key ?? '' })
  expect(await until(async () => logged.find(line => line.includes('You answered, on its card, the question Claude asked in "Pick a colour" after it finished (Red or blue?)')))).toContain('(Red or blue?): Blue')
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ') && line.includes("couldn't start that task again")))).toBeDefined()
  expect(submitted.some(line => line.includes('Blue'))).toBe(false)
  await list.unmount()
})

test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', SLOW, async ($, on) => {
  const { keep, settle, files, logged, keychain, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  // The chat is told only the name, and where to type it
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('top of the Claudopus panel')
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  expect(field).toBeDefined()
  expect((await list.find({ type: 'Text', text: GITHUB_BOX }))?.props.color).toBe('#E5A50A')
  const value = 'ghp_s3cret"with\\quote'
  await list.input({ key: field?.key ?? '', text: value })
  // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
  expect(await until(async () => keychain.find(one => one.includes(id)))).toBe(`add-generic-password -U -s "claudopus-box" -a "${id}" -l "Claudopus box" -w "ghp_s3cret\\"with\\\\quote"\n`)
  expect(await until(async () => ((await list.find({ type: 'Text', text: GITHUB_BOX })) ? undefined : true))).toBe(true)
  // Nowhere else: not the chat, its saved words, the log or any file
  expect(logged.some(line => line.includes('s3cret'))).toBe(false)
  expect([...files.values()].some(text => text.includes('s3cret'))).toBe(false)
  // A curly quote from a phone's keyboard, which security would give back as hex, is not sent, and the box says why
  const third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${third}.json`, JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const curly = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${third}-field`)))
  const before = keychain.length
  await list.input({ key: curly?.key ?? '', text: 'it’s-mine' })
  expect(await until(async () => (await list.findAll({ type: 'Text' })).find(one => (one.text ?? '').startsWith('That held a line break, a curly quote')))).toBeDefined()
  // and one whose runner has stopped takes nothing
  files.delete(`${MEMORY}/boxes/${third}.json`)
  const again = (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${third}-field`))
  await list.input({ key: again?.key ?? '', text: 'plain-value-1234' })
  await clock.advance(1000)
  expect(keychain.length).toBe(before)
  // A box cancelled removes its request, which the runner takes as cancelled
  const other = '1f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${other}.json`, JSON.stringify({ id: other, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const cancel = await until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith(`box-${other}-cancel`)))
  await list.press({ key: cancel?.key ?? '' })
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${other}.json`) ? undefined : true))).toBe(true)
  // Its place says what was done, for a minute
  expect(await until(async () => list.find({ type: 'Text', text: 'You cancelled · nothing was saved, and what asked for it stops without it' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'The admin password of this Mac' })).toBeDefined()
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'The admin password of this Mac' })) ? undefined : true))).toBe(true)
  await settle()
})

test("where the bar above the prompt takes a box, a key box has no field in the panel, whose window the app drags to a field that holds the cursor: Paste the key or Give a response instead opens its field in the bar; the key goes only to the keychain, a response only to the command that asked, and one that looks like the key itself is held until the person says which", async ($, on) => {
  const { keep, settle, files, logged, keychain, clock } = world(on, { panes: ['claudopus'] })
  await $.session.start(start)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  type Site = typeof list
  const fieldsIn = async (site: Site, id: string) => (await site.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').includes(id))
  const labelled = async (site: Site, label: string) => (await site.findAll({ type: 'Button' })).filter(b => b.props.label === label)
  const press = async (site: Site, label: string) => site.press({ key: (await until(async () => (await labelled(site, label))[0]))?.key ?? '' })
  const ask = async (id: string) => (files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 })), await clock.advance(1000))
  // The key: no field in the panel, two buttons and Cancel; Paste the key opens the field in the bar, and the box says where it is
  const key = '0a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(key)
  expect(await until(async () => list.find({ type: 'Text', text: GITHUB_BOX }))).toBeDefined()
  expect(await until(async () => ((await labelled(list, 'Give a response instead')).length === 1 ? true : undefined))).toBe(true)
  expect(await fieldsIn(list, key)).toEqual([])
  expect((await labelled(list, 'Cancel')).length).toBe(1)
  await press(list, 'Paste the key')
  const pasted = await until(async () => (await fieldsIn(bar, key))[0])
  expect(await list.find({ type: 'Text', text: '✎ Type it in the box above the chat' })).toBeDefined()
  expect(await fieldsIn(list, key)).toEqual([])
  await bar.input({ key: pasted?.key ?? '', text: 'ghp_kept0nlyInKeychain' })
  expect(await until(async () => keychain.find(one => one.includes(key)))).toContain('-w "ghp_kept0nlyInKeychain"')
  expect(await until(async () => ((await fieldsIn(bar, key)).length === 0 ? true : undefined))).toBe(true)
  expect(files.has(`${MEMORY}/boxes/${key}.reply`)).toBe(false)
  // A response: its words go beside the request for the runner, which prints them to the command's caller; nothing is kept
  const said = '1a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(said)
  await press(list, 'Give a response instead')
  const words = await until(async () => (await fieldsIn(bar, said))[0])
  const kept = keychain.length
  // Sent with the row's Send, the big button first, Close the small one after it
  expect((await bar.findAll({ type: 'Button' })).filter(b => ['Send', 'Close'].includes(String(b.props.label))).map(b => [b.props.label, b.props.variant ?? null, b.props.plain ?? null])).toEqual([['Send', 'primary', null], ['Close', null, true]])
  await bar.input({ key: words?.key ?? '', text: 'It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too', kind: 'change' } as never)
  await press(bar, 'Send')
  expect(await until(async () => files.get(`${MEMORY}/boxes/${said}.reply`))).toBe('The person answered in the Claudopus panel instead of giving GITHUB_TOKEN, in their own words: It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too\n')
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${said}.json`) ? undefined : true))).toBe(true)
  expect(keychain.length).toBe(kept)
  expect(await until(async () => list.find({ type: 'Text', text: 'You gave a response instead · it went to the command that asked, and nothing was saved' }))).toBeDefined()
  // Words that look like the key itself are held, sent nowhere, until the person keeps them as the key (the key's word alone, never
  // the words around it) or sends them anyway; a path, a setting's name and a branch's, above, are no key
  const slip = '2a1e2d3c-4b5a-4987-a654-3210fedcba98'
  await ask(slip)
  await press(list, 'Give a response instead')
  const slipped = await until(async () => (await fieldsIn(bar, slip))[0])
  await bar.input({ key: slipped?.key ?? '', text: 'here: ghp_A1b2C3d4E5f6G7h8I9j0' })
  expect(await until(async () => (await bar.findAll({ type: 'Text' })).find(one => (one.text ?? '').startsWith('That looks like the key itself')))).toBeDefined()
  expect(files.has(`${MEMORY}/boxes/${slip}.reply`)).toBe(false)
  expect(logged.some(line => line.includes('A1b2C3'))).toBe(false)
  await press(bar, 'Keep it as the key')
  expect(await until(async () => keychain.find(one => one.includes(slip)))).toContain('-w "ghp_A1b2C3d4E5f6G7h8I9j0"')
  expect(files.has(`${MEMORY}/boxes/${slip}.reply`)).toBe(false)
  // and an admin password box keeps its own field
  const admin = '3a1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${admin}.json`, JSON.stringify({ id: admin, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  expect(await until(async () => (await fieldsIn(list, admin))[0])).toBeDefined()
  await list.unmount()
  await bar.unmount()
  await settle()
})

test('a chat on this Mac\'s own screen asks in the panel the same way, and opens the panel for it', async ($, on) => {
  const { keep, settle, files, logged, keychain, clock, opened } = world(on)
  await $.session.start(start)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('top of the Claudopus panel')
  // The chat takes the request, which tells the runner a panel asks, and brings the panel up with the field ready
  expect(opened.filter(one => one === 'claudopus').length).toBeGreaterThan(0)
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  await list.input({ key: field?.key ?? '', text: 'made-up-local-k3y' })
  expect(await until(async () => keychain.find(one => one.includes(id)))).toContain('-w "made-up-local-k3y"')
  expect(logged.some(line => line.includes('local-k3y'))).toBe(false)
  expect([...files.values()].some(text => text.includes('local-k3y'))).toBe(false)
  await settle()
})

test("a request of another chat's, or of this chat's with no runner of its own running, is drawn nowhere here; this chat's own while its runner runs is drawn first", async ($, on) => {
  const { keep, settle, files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98'
  const mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${older}.json`, JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1_700_000_000_000 }))
  files.set(`${MEMORY}/boxes/${mine}.json`, JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_500 }))
  await clock.advance(7000)
  // No runner of this chat's runs: neither is drawn, nor told
  expect((await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-'))).toEqual([])
  expect(logged.some(line => line.includes('NPM_TOKEN') || line.includes('GITHUB_TOKEN'))).toBe(false)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never))
  await clock.advance(1000)
  const fields = await until(async () => { const all = (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')); return all.length ? all : undefined })
  expect(fields?.map(one => [(one.key ?? '').slice(4, 6), one.props.autoFocus])).toEqual([['6f', true]])
  // It says which command of this chat's asked
  expect(await list.find({ type: 'Text', text: "Asked by this chat's command: hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy" })).toBeDefined()
  await clock.advance(6000)
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
  const shown = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')).map(one => (one.key ?? '').slice(4, 5))
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
  expect(await texts()).toContain(ADMIN_BOX)
  expect(await texts()).not.toContain('Apple')
  expect(logged.some(line => line.includes('Apple'))).toBe(false)
  // The notice in the chat is the panel's wording too
  expect(logged.find(line => line.includes('admin password of this Mac'))).toContain('top of the Claudopus panel')
  await settle()
})

test('the box words what the runners ask from its fields: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first', async ($, on) => {
  const { keep, settle, files, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
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
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const all = await until(async () => ((await texts()).filter(one => one.startsWith('Claudopus needs') || one.includes('Claudopus needs') || one.startsWith('Name of')).length >= 5 ? await texts() : undefined))
  expect(all).toContain(GITHUB_BOX)
  expect(all).toContain('That password was refused. Claudopus needs the admin password of dima@m4.local to run the admin command below. Nothing is saved: it goes only to that command, and the next one asks again.')
  expect(all).toContain(`That was shorter than 4 characters. ${NPM_BOX}`)
  // A reason it does not know is left out
  expect(all).toContain("Claudopus needs OPENAI_KEY. It is saved only in this Mac's keychain. Claude uses it by name, and it is hidden in anything a command prints.")
  expect(all?.join('\n')).not.toContain('Apple')
  expect(all).toContain('Name of the key to save, such as GITHUB_TOKEN. Claude will use it by this name.')
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the branch?', choices: ['Release it', 'Not now'] } as never)
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
  expect(await until(async () => s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Sending to Claude…' }))).toBeDefined()
  expect((await s.list.findAll({ type: 'Button' })).some(b => b.props.label === 'Release it' || b.props.label === 'Not now')).toBe(false)
  expect(await s.list.find({ type: 'Text', text: 'Release the branch?' })).toBeUndefined()
  expect(s.answers()).toEqual([])
  s.freeWrites()
  free()
  await pressing
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  expect(await until(async () => s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Claude will see this after its current step' }))).toBeDefined()
})

test('an answer that could not be written says so on the card and puts its buttons back; pressed again it goes', async ($, on) => {
  const s = await askScene($, on)
  // Another work asks after it: newer, it is above
  await s.clock.advance(1000)
  await $.agent.spawn({ ...spawn, description: 'Draw the logo', prompt: 'draw it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] } as never)
  const order = async () => (await s.list.findAll({ type: 'Text' })).map(one => one.text).filter(text => text === 'Which logo?' || text === 'Release the branch?')
  expect(await until(async () => ((await order()).length === 2 ? order() : undefined))).toEqual(['Which logo?', 'Release the branch?'])
  const release = await s.key('Release it')
  await s.clock.advance(1000)
  s.failWrites(1000)
  await s.list.press({ key: release }).catch(() => undefined)
  expect(await until(async () => s.list.find({ type: 'Text', text: "Not sent: “Release it” didn't reach Claude. Press it again" }))).toBeDefined()
  expect(await s.list.find({ type: 'Text', text: /^✓ You answered/ })).toBeUndefined()
  expect(s.answers()).toEqual([])
  // Its ask back, the card keeps its ask's place under the newer one: a failed press never lifts it to the top
  expect(await order()).toEqual(['Which logo?', 'Release the branch?'])
  // Its buttons are back, and a press now answers it
  s.failWrites(0)
  const again = await s.key('Release it')
  expect(again).not.toBe('')
  await s.list.press({ key: again })
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  expect(await until(async () => s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Claude will see this after its current step' }))).toBeDefined()
})

test('two presses on an ask, the second on the drawing before the first was taken, send one answer', async ($, on) => {
  const s = await askScene($, on)
  const release = await s.key('Release it')
  const notNow = await s.key('Not now')
  let free = () => undefined as void
  s.holdWrites(new Promise<void>(done => (free = done)))
  const first = s.list.press({ key: release })
  const second = s.list.press({ key: notNow }).catch(() => undefined)
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
  await clock.advance(12_000)
  await list.findAll({ type: 'Text' })
  // A press in the panel: drawn once for what it did, then still while the person is at it
  const title = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-'))
  expect(title).toBeDefined()
  await list.press({ key: title?.key ?? '' })
  await list.findAll({ type: 'Text' })
  // Scrolled down by the person, who the app says sees a list 90 rows tall: drawn at least that tall while they use it, so a card
  // that shrinks never snaps the view up under them
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'May I go on?', choices: ['Approve', 'Not now'] } as never)
  expect(await list.find({ type: 'Text', text: 'May I go on?' })).toBeDefined()
  expect(await tall()).toBeGreaterThanOrEqual(90)
  // Left alone, the times move again
  const asked = JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await clock.advance(30_000)
  expect(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))).not.toBe(asked)
  // with what came meanwhile, and its own height again
  expect(await until(async () => list.find({ type: 'Text', text: 'Check the chin' }))).toBeDefined()
  expect(await tall()).toBeLessThan(90)
  await list.unmount()
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
  const open = await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Reply in your own words'))
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

test('a reply never waits behind a long command: one that may run for minutes goes to the background, a wait for the person is refused, and a short one held open is named on the card while the reply waits', async ($, on) => {
  const { keep, settle, clock, held } = world(on)
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
  // A script of minutes, by its time limit or by its words, comes back at once and runs on in the background, the work told why
  for (const [id, more] of [['s1', { timeout: 600000, description: 'Run the head check on the CQ500 scans' }], ['s2', { description: 'Waiting for the CQ500 results (about 5 min)' }], ['s4', { timeout: 600000, description: 'Run the tests', command: 'hold s4 &>test.log' }]] as const) {
    const r = (await $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold ${id}`, ...more } as never)) as { context?: string[] }
    expect([...held.keys()].some(key => key.startsWith(id))).toBe(true)
    expect((r.context ?? []).join(' ')).toContain('replies reach you while it runs')
  }
  // A launcher that leaves its runs going is left as it is, as what it started is followed while it runs
  const launched = (await $.tool.call({ tool: 'Bash', tool_use_id: 's3', agentId: 'a1', command: 'nohup python run.py > run.log 2>&1 & echo $!', description: 'Wait for the head check to start on every set (about 20 min)', timeout: 600000 } as never)) as { context?: string[] }
  expect((launched.context ?? []).join(' ')).not.toContain('replies reach you while it runs')
  // A short one is held open as asked; a reply given meanwhile is received at once and names what it waits behind
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'hold build', description: 'Run the build' } as never))
  await until(async () => held.get('build'))
  await clock.advance(70_000)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Yep, looks good' })
  expect(await until(async () => (await list.findAll({ type: 'Text' })).find(one => one.text.startsWith('✓ You replied “Yep, looks good” · waiting: Claude will see it when “Run the build” ends (running 1')))).toBeDefined()
  held.get('build')?.('built')
  for await (const _ of $.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Yep, looks good” · Claude is working on it' }))).toBeDefined()
  await settle()
})
test("where the bar above the prompt takes a box, a card's answers end with Reply in your own words, which opens the reply box in that bar and never in the panel or its Details, whose window the app drags to a box that holds the cursor (15 Nov); Close takes it away with what was typed kept; one box at a time", async ($, on) => {
  const { appended, clock } = world(on, { panes: ['claudopus'] })
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
  const OPEN = 'Reply in your own words'
  const CLOSE = 'Close the reply box'
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
  // Pressed: one box, in the bar, beside the name of the work it goes to and a Close; the card says where it is and offers to close it
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 1 ? true : undefined))).toBe(true)
  expect(await says(bar, /^↳ Your reply to “Check the ears”$/)).toBe(true)
  // Send is the big button, first, and Close the small one after it (16 Nov, the person: "the send button is big but the cancel
  // button is small")
  const shape = async () => (await bar.findAll({ type: 'Button' })).filter(b => ['Send', 'Close'].includes(String(b.props.label))).map(b => [b.props.label, b.props.variant ?? null, b.props.plain ?? null])
  expect(await shape()).toEqual([['Send', 'primary', null], ['Close', null, true]])
  // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
  // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
  expect('submitLabel' in ((await boxesIn(bar))[0]?.props ?? {})).toBe(false)
  expect((await boxesIn(list)).length + (await boxesIn(details)).length).toBe(0)
  expect(await says(list, /^✎ Type it in the box above the chat$/)).toBe(true)
  expect((await labelled(list, CLOSE)).length).toBe(1)
  expect((await labelled(list, OPEN)).length).toBe(0)
  // The panel scrolled away from its top with the box open: the bar still points at what waits there
  const MARK = '↑ 1 thing is waiting for you at the top of the panel'
  const scrolled = async (offset: number) => (await list.unmount(), (list = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset, bodyRows: 20 } }, surface: 'desktop' } as never)))
  await scrolled(40)
  expect(await until(async () => bar.find({ type: 'Text', text: MARK }))).toBeDefined()
  await scrolled(0)
  expect(await until(async () => ((await bar.find({ type: 'Text', text: MARK })) ? undefined : true))).toBe(true)
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
  expect(await bar.find({ type: 'Text', text: MARK })).toBeUndefined()
  expect((await boxesIn(bar))[0]?.key).toBe(first?.key)
  await clock.advance(270_000)
  await scrolled(0)
  await scrolled(40)
  expect(await until(async () => bar.find({ type: 'Text', text: MARK }))).toBeDefined()
  await scrolled(0)
  // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
  await bar.press({ key: (await labelled(bar, 'Close'))[0]?.key ?? '' })
  expect(await until(async () => ((await boxesIn(bar)).length === 0 ? true : undefined))).toBe(true)
  expect(await until(async () => ((await labelled(list, OPEN)).length === 1 ? true : undefined))).toBe(true)
  expect(await says(list, /Type it in the box above/)).toBe(false)
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
  expect(await says(bar, /^↳ Your reply to “Check the ears”$/)).toBe(true)
  // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await says(bar, /^↳ Your reply to “Sort the invoices”$/)) ? true : undefined))).toBe(true)
  expect((await boxesIn(bar)).length).toBe(1)
  expect((await boxesIn(bar))[0]?.props.value ?? '').toBe('')
  await list.press({ key: (await labelled(list, OPEN))[0]?.key ?? '' })
  expect(await until(async () => ((await says(bar, /^↳ Your reply to “Check the ears”$/)) ? true : undefined))).toBe(true)
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
  await Promise.all([list.unmount(), details.unmount(), again.unmount()])
})

