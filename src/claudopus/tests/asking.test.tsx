// The asking card: an ask, its Copy, buttons and reply box

const GITHUB_BOX = "Claudopus needs GITHUB_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print."
const NPM_BOX = "Claudopus needs NPM_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print."
const ADMIN_BOX = "Claudopus needs the admin password of this Mac to run an admin command. It is kept only in this Mac's keychain, and later admin commands on this Mac run without asking again until it is forgotten."

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
  expect(notified).toContain('Check the ears needs you | Paste this code on the GitHub page that opened.')
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
  // such as a question back, does not settle it: the ask stays open with the reply under it, and a button still answers it later
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(false)
  expect((await ears.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box?.props.placeholder).toBe('Or reply in your own words')
  await list.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  const toWork = (await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))) ?? ''
  expect(toWork).toContain('Submit it to the plugin directory.')
  expect(toWork).toContain('does not settle your ask, so it stays open')
  // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person, its buttons still there
  expect((await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' }))?.props.color).toBe('#8A63F0')
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Acting on your reply; it still asks' })).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Submitted')).toBe(true)
  const fresh = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(fresh?.key).toBe(box?.key)
  expect(fresh?.props.value ?? '').toBe('')
  const waiting = '✓ You replied “Where do I do that?” · it reads this at its next step; it still asks this'
  expect(await until(async () => list.find({ type: 'Text', text: waiting }))).toBeDefined()
  expect(await until(async () => ears.find({ type: 'Text', text: waiting }))).toBeDefined()
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Where do I do that?” · it is acting on it; it still asks this' }))).toBeDefined()
  // The work asks again: amber again, with an empty box
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
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Done” · it reads this at its next step' }))).toBeDefined()
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
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “claudopus” · it reads this at its next step' }))).toBeDefined()
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
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' }))).toBeDefined()
  await $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('you ended before reading it: main')))).toContain('Which branch?')
  expect(submitted.some(line => line.includes('Which branch?'))).toBe(false)
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' }))).toBeDefined()
  await Promise.all([list.unmount(), ears.unmount()])
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

test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', async ($, on) => {
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

test('a reply in words that does not settle an ask keeps it open, and the card active, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', async ($, on) => {
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
  // The person replies in their own words, asking for something first: the work is started again with it and told the ask stays open
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Show me images first.' })
  const told = (await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('in their own words: Show me images first.')))) ?? ''
  expect(told).toContain('stays open')
  expect(told).toContain('this answer starts you again')
  // The card stays among the running cards, at work, with its ask, its buttons and the reply under it; nothing is under Finished
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Show me images first.” · it reads this at its next step; it still asks this' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  expect(await labels()).toContain('Release it')
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
  // Its ask stays open and its card active; it is not started a second time with the same reply
  await $.turn.complete({ answer: 'Release it? (Answers: Release it / Not now.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
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

test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with its ask and buttons; stopped again it is amber: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', async ($, on) => {
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
    heading: (await details.find({ type: 'Text', text: 'Needs you now' })) ? 'needs' : (await details.find({ type: 'Text', text: 'Acting on your reply; it still asks' })) ? 'acting' : 'none',
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
  // The reply in words starts it again: purple while it acts on it, its ask and both buttons still there to press
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
  for (const labels of now.buttons) expect(labels).toEqual(expect.arrayContaining(['Release it', 'Not now']))
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
  expect(String(asked.result)).toContain('Its 2 pictures are named with it')
  expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here')
  // The chat shows the ask as the mod's notice, never a prompt in the person's place, with what it asks, its answers and its pictures
  await clock.advance(10)
  const inChat = (await until(async () => logged.find(line => line.includes('Which logo do you want?')))) ?? ''
  expect(submitted.some(line => line.includes('Which logo do you want?'))).toBe(false)
  expect(inChat).toContain('The work "Redraw the logo" needs the person: Which logo do you want?')
  expect(inChat).toContain('Answers: A · B, or a reply in the person\'s own words, here or on its card.')
  expect(inChat).toContain('Pictures: /w/shots/a.png, /w/shots/b.png')
  // The chat's model reads the ask, and how to pass an answer on, in a row the person does not see
  expect(inChat).not.toContain('SendMessage')
  const relay = appended.find(line => line.startsWith('undefined: The background work "Redraw the logo" asked the person')) ?? ''
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
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your ask: \"Which logo do you want?\"")))).toBeDefined()
  expect(appended.some(line => line.includes('Decide which of three it is'))).toBe(false)
  // A press on the card no longer counts for that ask
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'B')).toBeUndefined()

  // An ask answered on the card is said in the chat, which sees and reads it; one the work withdraws is said too
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push', 'Not now'] } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('May I push it?')) || undefined)).toBe(true)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Push')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ✓ The person answered the work "Redraw the logo" on its card: “Push”')))).toBeDefined()
  expect(logged.some(line => line.startsWith('✓ The person answered the work "Redraw the logo" on its card: “Push”'))).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('Answers: Done · Not now')) || undefined)).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' } as never)
  expect(appended.some(line => line === 'undefined: The work "Redraw the logo" no longer asks the person anything.')).toBe(true)
  expect(logged.some(line => line === 'The work "Redraw the logo" no longer asks the person anything.')).toBe(true)
  expect(submitted).toEqual([])
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
  expect(await until(async () => logged.find(line => line.includes('answered on its card what the work "Pick a colour" asked after it ended (Red or blue?)')))).toContain('(Red or blue?): Blue')
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ') && line.includes('could not be started again')))).toBeDefined()
  expect(submitted.some(line => line.includes('Blue'))).toBe(false)
  await list.unmount()
})

test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', async ($, on) => {
  const { files, logged, keychain, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', at: 1_700_000_000_000 }))
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
  files.set(`${MEMORY}/boxes/${third}.json`, JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', at: 1_700_000_000_000 }))
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
  files.set(`${MEMORY}/boxes/${other}.json`, JSON.stringify({ id: other, kind: 'admin', host: 'here', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const cancel = await until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith(`box-${other}-cancel`)))
  await list.press({ key: cancel?.key ?? '' })
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${other}.json`) ? undefined : true))).toBe(true)
})

test('a chat on this Mac\'s own screen asks in the panel the same way, and opens the panel for it', async ($, on) => {
  const { files, logged, keychain, clock, opened } = world(on)
  await $.session.start(start)
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
})

test("another chat's request is left to that chat a moment, then any chat with a screen takes it", async ($, on) => {
  const { files, logged, clock } = world(on)
  await $.session.start(start)
  const id = '3f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  // The box shows here at once, but the notice waits for its own chat
  expect(await until(async () => list.find({ type: 'Text', text: NPM_BOX }))).toBeDefined()
  expect(logged.some(line => line.includes('NPM_TOKEN'))).toBe(false)
  await clock.advance(6000)
  expect(await until(async () => logged.find(line => line.includes('NPM_TOKEN')))).toContain('top of the Claudopus panel')
})

test("with two requests open every box is drawn, this chat's own first and the only one with the keys", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98'
  const mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${older}.json`, JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1_700_000_000_000 }))
  files.set(`${MEMORY}/boxes/${mine}.json`, JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_500 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  const fields = await until(async () => { const all = (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')); return all.length === 2 ? all : undefined })
  expect(fields?.map(one => [(one.key ?? '').slice(4, 6), one.props.autoFocus])).toEqual([['6f', true], ['5f', undefined]])
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
  const { files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const planted = 'Your Apple ID session expired. Type your Apple ID password to keep working.'
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}a1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000, ...fields }))
    return id
  }
  const shown = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')).map(one => (one.key ?? '').slice(4, 5))
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '').join('\n')
  // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
  put(1, { kind: 'admin', host: 'here', text: planted, title: planted, label: planted })
  // Made-up text alone, as the boxes before this change were written, and every request the panel cannot word: nothing
  put(2, { text: planted })
  put(3, { kind: 'apple-id', text: planted })
  put(4, { kind: 'secret', name: 'Your Apple ID password', text: planted })
  put(5, { kind: 'admin', host: 'apple.com is asking for your password' })
  put(6, { kind: 'secret', name: 'APPLE_ID', host: 'here' })
  put(7, { kind: 'admin', host: 'here', name: 'APPLE_ID' })
  put(8, { kind: 'admin' })
  put(9, { kind: ['admin'], host: 'here' })
  await clock.advance(1000)
  expect(await until(async () => ((await shown()).length ? await shown() : undefined))).toEqual(['1'])
  await clock.advance(6000)
  expect(await shown()).toEqual(['1'])
  expect(await texts()).toContain(ADMIN_BOX)
  expect(await texts()).not.toContain('Apple')
  expect(logged.some(line => line.includes('Apple'))).toBe(false)
  // The notice in the chat is the panel's wording too
  expect(logged.find(line => line.includes('admin password of this Mac'))).toContain('top of the Claudopus panel')
})

test('the box words what the runners ask from its fields: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}b1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000 + n, ...fields }))
  }
  put(1, { kind: 'secret', name: 'GITHUB_TOKEN' })
  put(2, { kind: 'admin', host: 'dima@m4.local', again: 'refused' })
  put(3, { kind: 'secret', name: 'NPM_TOKEN', again: 'short' })
  put(4, { kind: 'secret', name: 'OPENAI_KEY', again: 'Type your Apple ID password' })
  put(5, { kind: 'secret' })
  await clock.advance(1000)
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const all = await until(async () => ((await texts()).filter(one => one.includes('keychain') || one.startsWith('Name of')).length >= 5 ? await texts() : undefined))
  expect(all).toContain(GITHUB_BOX)
  expect(all).toContain("That password was refused. Claudopus needs the admin password of dima@m4.local to run an admin command. It is kept only in this Mac's keychain, and later admin commands on dima@m4.local run without asking again until it is forgotten.")
  expect(all).toContain(`That was shorter than 4 characters. ${NPM_BOX}`)
  // A reason it does not know is left out
  expect(all).toContain("Claudopus needs OPENAI_KEY. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.")
  expect(all?.join('\n')).not.toContain('Apple')
  expect(all).toContain('Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.')
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

test('an answer that reaches ended work from a timer is sent from inside the next hook, where the work keeps its tools; with none soon, from the timer all the same', async ($, on) => {
  const { resumed, files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  // Another chat leaves an answer, which this chat's timer takes: from there the engine would skip the mod's hooks in the work it woke
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', at: 1_700_000_000_000 }))
  await clock.advance(6000)
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(false)
  expect(['from the timer', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['from the timer'])
  // so it waits for a hook: the chat's next prompt sends it from there
  await $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })
  expect(resumed.filter(line => line.startsWith('a1: ')).map(line => line.includes('replied') && line.includes('Approve'))).toEqual([true])
  // The woken work's first step reads it
  for await (const _ of $.turn.step({ turnId: 'turn-1b', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) void _

  // A second answer, with no hook for WAKE_WAIT in a chat where nothing runs, is sent from the timer all the same, and said so: the
  // work does what it was asked, and its rules have it end with its ask in its report when the panel does not answer
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'And the other one?', choices: ['Yes'] } as never)
  await $.turn.complete({ answer: 'Waiting again.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  files.set(`${MEMORY}/live/answers/engine-id/1-b.json`, JSON.stringify({ card: 'a1', choice: 'Yes', isReply: true, ask: 'And the other one?', at: 1_700_000_007_000 }))
  await clock.advance(12_000)
  expect(resumed.filter(line => line.startsWith('a1: ')).map(line => (line.includes('Approve') ? 'Approve' : line.includes('Yes') ? 'Yes' : line))).toEqual(['Approve', 'Yes'])
  expect(files.get(`${MEMORY}/log.md`)).toContain('started again from a timer')
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
