// The asking card: an ask, its Copy, buttons and reply box

test('work that needs the person\'s hands asks: its card stands out first with the ask, the text to paste with its Copy, and answers that go back to it', async ($, on) => {
  // Once its run has ended, a work's chat takes no more lines
  const ended = new Set<string>()
  const { played, notified, appended, terminals, submitted } = world(on, { ended })
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
  // Or a reply in the person's own words, right on the small card: the reply goes to the work and the amber goes at once, the card
  // saying briefly what was answered; the box is in Details too
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(false)
  expect((await ears.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box?.props.placeholder).toBe('Or reply in your own words')
  await list.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))).toContain('Submit it to the plugin directory.')
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' })) ? undefined : true))).toBe(true)
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()
  expect(await list.find({ type: 'Input' } as never)).toBeUndefined()
  const waiting = '✓ You answered “Where do I do that?” · it reads this at its next step'
  expect(await until(async () => list.find({ type: 'Text', text: waiting }))).toBeDefined()
  expect(await until(async () => ears.find({ type: 'Text', text: waiting }))).toBeDefined()
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Where do I do that?” · it has read it' }))).toBeDefined()
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
  // A reply to work whose run has ended goes to the chat, as the panel's, says so, and clears the amber
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' } as never)
  ended.add('a2')
  const box3 = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box3?.props.value ?? '').toBe('')
  await list.input({ key: box3?.key ?? '', text: 'claudopus' })
  expect(await until(async () => submitted.find(line => line.includes('claudopus') && line.includes('From the Claudopus panel')))).toContain('Tell me the repo name.')
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “claudopus” · sent to the chat, which carries the work on' }))).toBeDefined()
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

  // A command for the person to type is shown with its Copy, and the work is told to open a terminal for it (the app opens one
  // only for Claude, never for a plugin's own code)
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub in the terminal that opened.', command: 'gh auth login', cwd: '/repo/site' } as never)
  expect(told.result).toContain('mcp__terminal__open_terminal_tab with cwd "/repo/site"')
  expect((await list.find({ type: 'Text', text: 'gh auth login' }))?.props.mono).toBe(true)
  expect(terminals).toEqual([])

  // A reply written into work that then ends without another step was never read: the chat gets it, and the box says so
  ended.delete('a2')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main', 'Not now'] } as never)
  const box4 = (await ears.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await ears.input({ key: box4?.key ?? '', text: 'main' })
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' }))).toBeDefined()
  await $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => submitted.find(line => line.includes('ended before reading the answer') && line.includes('Which branch?')))).toContain('\nmain')
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · sent to the chat, which carries the work on' }))).toBeDefined()
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
