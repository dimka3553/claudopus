// Cards: work becoming a card, its to-dos, its own chat, steers, context and model, Details, stops, its pause, work the engine reports

test('what I ask for becomes a box in the panel, the panel opens once, and the chat shows only that work is running', async ($, on) => {
  const { opened, logged } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })

  const r = await $.agent.spawn({ ...spawn, prompt: 'The nose on head A is flawed, can you fix it?' } as never)
  expect(r.agentId).toBe('a1')
  // The work is told to keep its to-do true
  expect(prompts[0]).toContain('mcp__claudopus__todo')
  expect(prompts[0]).toContain('mcp__claudopus__note')
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  expect(opened).toEqual(['claudopus'])

  for (const surface of ['terminal', 'desktop'] as const) {
    const band = await $.ui.mount({ ...BAND, surface } as never)
    // One short line: what the work that last moved is doing, and how many others run
    expect((await band.find({ type: 'Text', text: /more$/ }))?.text).toBe('· +1 more')
    expect((await band.find({ type: 'Text', text: /Check the ears|Fix the nose/ }))?.props.wrap).toBe('truncate-end')
    expect(await band.findAll({ type: 'Button' })).toHaveLength(0)
    await band.unmount()
  }

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    // A small card says its to-do in a few words and where it stands, each on one line that is cut at the edge
    expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
    expect((await pane.find({ type: 'Text', text: /Check the ears/ }))?.text).toBe('Check the ears')
    expect(await pane.findAll({ type: 'Text', text: /^0s$/ })).toHaveLength(2)
    expect(await pane.find({ type: 'Text', text: /flawed/ })).toBeUndefined()
    // Pressed, its Details opens as a tab of its own, named after the work, and gives what it started from in my words
    await pressed(pane, 'open-a1')
    expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    expect((await tab.find({ type: 'Text', text: /^Started from$/ }))?.props.bold).toBe(true)
    expect((await tab.find({ type: 'Text', text: /flawed/ }))?.text).toBe('“The nose on head A is flawed, can you fix it?”')
    expect(await tab.find({ type: 'Text', text: /Check the ears/ })).toBeUndefined()
    // and has nothing that leads back: the list stays as it was in its own tab
    expect(await tab.find({ type: 'Button', key: 'back' })).toBeUndefined()
    await tab.unmount()
    expect((await pane.find({ type: 'Text', text: /Check the ears/ }))?.text).toBe('Check the ears')
    expect(await pane.find({ type: 'Text', text: /^Started from$/ })).toBeUndefined()
    await pane.unmount()
  }
  // Nothing about the work is written into the chat
  expect(logged).toEqual([])
})

test('a small card shows where the work is and a count of its to-dos; pressed, it lists every to-do; ended work leaves the panel', async ($, on) => {
  const { logged, clock, files, opened } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)

  await call('todo', { item: 'Fit the nostril again' })
  await call('todo', { item: 'Try the other model' })
  // Only one to-do is being done at a time
  await call('todo', { item: 'Try the other model', state: 'doing' })
  const doing = await call('todo', { item: 'Fit the nostril again', state: 'doing' })
  expect(String(doing.result)).toBe('[doing] Fit the nostril again\n[ ] Try the other model')
  await call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // Three moving dots beside the line the work last wrote and nowhere else; its to-dos are only counted
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Fit the/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Try the/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toMatch(/(^| · )0 of 2 done · \d+s$/)
  // Its edge is its to-dos, one part each: the one being done lighter than a done one, the rest a dim tint; a terminal's edge is whole
  const edgeOf = async (of: typeof pane) => (await of.findAll({ type: 'Box' })).map(b => String(b.props.backgroundColor)).filter(colour => colour.startsWith('#8A63F0'))
  expect(await edgeOf(pane)).toEqual(['#8A63F0AD', '#8A63F05C'])
  // in a purple that a terminal of 256 colours rounds to the octopus's own (no COLORTERM here)
  const flat = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await flat.findAll({ type: 'Box' })).map(b => String(b.props.backgroundColor)).filter(colour => colour === '#6E3CFF')).toEqual(['#6E3CFF'])
  await flat.unmount()
  // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
  expect(await keyed(pane, 'go-a1')).toBeUndefined()
  expect((await keyed(pane, 'open-a1'))?.props.plain).toBe(true)
  expect((await pane.find({ type: 'Button', key: 'stop-a1' }))?.props).toMatchObject({ label: 'Stop', plain: true })
  // A line too long for its two rows is cut at the end of a word
  await call('note', { text: `I am ${'fitting the nostril again and again '.repeat(5)}today.` })
  expect((await pane.find({ type: 'Text', text: /^I am fitting/ }))?.text).toBe('I am fitting the nostril again and again fitting the nostril again and …')
  await call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })
  expect((await pane.find({ type: 'Text', text: /^I am fitting/ }))?.text).toBe('I am fitting the nostril again, because the first fit left it open.')

  await call('note', { text: 'The nostril is closed; I am comparing the head with your scan.' })
  await call('todo', { item: 'Fit the nostril again', state: 'done' })
  await call('todo', { item: 'Try the other model', state: 'dropped' })
  const listed = await call('todo', { item: 'Compare the head with your scan', was: 'compare with scan' })
  expect(String(listed.result)).toBe('[x] Fit the nostril again\n[dropped] Try the other model\n[ ] Compare the head with your scan')
  // A chat's own thread has no to-do of its own
  expect(String((await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' } as never)).result)).toContain('Only background work')

  // The newer line replaced the older; a dropped to-do is not counted
  expect(await pane.find({ type: 'Text', text: /^I am fitting/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^The nostril is closed/ }))?.text).toBe('The nostril is closed; I am comparing the head with your scan.')
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('1 of 2 done')
  // The done to-do's part of the edge is bright, and with none being done the other is dim
  expect(await edgeOf(pane)).toEqual(['#8A63F0', '#8A63F05C'])
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^To do/ })).toBeUndefined()

  // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
  // done or dropped is one quiet count that opens on a press
  await call('todo', { item: 'Compare the head with your scan', state: 'doing' })
  await call('todo', { item: 'Check the left ear' })
  for (const n of [1, 2, 3, 4]) await call('todo', { item: `Later step ${n}` })
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await tab.findAll({ type: 'Svg' })).toHaveLength(1)
  expect((await tab.find({ type: 'Text', text: /^To-dos$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Its chat$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /of \d+ done$/ }))?.text).toBe('1 of 7 done')
  expect((await tab.find({ type: 'Text', text: /^Compare/ }))?.props.dimColor).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Check the left ear/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^The nostril is closed/ }))?.props.dimColor).toBe(true)
  expect(await tab.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  // The next three are listed, the rest behind "more"
  expect(await tab.find({ type: 'Text', text: /^Later step 2$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Later step 3$/ })).toBeUndefined()
  await pressed(tab, 'fold--1000002')
  expect(await tab.find({ type: 'Text', text: /^Later step 4$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Fit the/ })).toBeUndefined()
  expect((await keyed(tab, 'fold--1000003'))?.props.label).toBe('▸ 1 done · 1 dropped')
  // A pressed button comes back under a new key: the app keeps the button that holds the focus in view, and pulled the view back to it
  const before = (await keyed(tab, 'fold--1000003'))?.key
  await pressed(tab, 'fold--1000003')
  expect((await keyed(tab, 'fold--1000003'))?.key).not.toBe(before)
  expect((await tab.find({ type: 'Text', text: /^Fit the/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Try the/ }))?.props.strikethrough).toBe(true)
  // The list behind it is as it was
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('1 of 7 done')

  // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
  await $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' } as never)
  await $.agent.spawn({ ...spawn, fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' } as never)
  expect(prompts.at(-1)).toBe('search')
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' } as never)
  expect((await pane.find({ type: 'Text', text: /^I am reading/ }))?.text).toBe('I am reading how the other model draws outlines.')
  // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
  expect((await keyed(pane, 'open-list-a2'))?.props.label).toBe('Search the docs')
  expect((await pane.findAll({ type: 'Svg' })).filter(svg => String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'At work' && svg.props.isInteractive === true)).toHaveLength(1)
  const plain = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await plain.find({ type: 'Text', text: /^└─/ }))?.text).toBe('└───')
  await plain.unmount()
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label).filter(label => label === 'Stop')).toHaveLength(1)
  // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
  await pressed(pane, 'open-list-a2')
  expect(await until(async () => opened.includes('work-a2') || undefined)).toBe(true)
  const helperTab = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  expect((await helperTab.find({ type: 'Text', text: /Search the docs/ }))?.props.bold).toBe(true)
  expect((await keyed(helperTab, 'open-parent-a2'))?.props.label).toBe('↑ A helper of: Fix the nose')
  await helperTab.unmount()
  // and the work's own Details lists it under Helpers
  expect((await tab.find({ type: 'Text', text: /^Helpers$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /at work · / }))?.text).toBe('1 at work · 1 in all')

  // Work that ends its turn to wait for its helper goes on working
  await clock.advance(120_000)
  await $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' } as never)

  // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  await $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^Finished · \d+m/ }))?.text).toBe('Finished · 2m 00s')
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await tab.unmount()
  // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect((await pane.find({ type: 'Text', text: /^Just finished$/ }))?.text).toBe('Just finished')
  // Its helper, ended in the same moment, stays in its card for the same pause
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Search the docs'])
  await clock.advance(1_000)
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeDefined()
  await clock.advance(1_100)
  expect(await pane.find({ type: 'Text', text: /Fix the nose/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing is running')
  // It is one folded row, "Finished", under the running cards; unfolded, a card as running work has, with Details and no Stop
  const buttons = await pane.findAll({ type: 'Button' })
  expect(buttons.map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', '▸ Finished 1'])
  await pane.press({ key: String(buttons[4]?.key) })
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 1 of 7 done · 2m 00s')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  // Finished work's Details opens as a tab of its own too
  await pressed(pane, 'open-a1')
  const ended = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await ended.find({ type: 'Text', text: /^Finished · \d+m/ }))?.text).toBe('Finished · 2m 00s')
  expect((await ended.find({ type: 'Text', text: /^Its chat$/ }))?.props.bold).toBe(true)
  await ended.unmount()
  expect(files.get(`${MEMORY}/finished/engine-id.json`) ?? '').toBe('')
  await clock.advance(20_000)
  // kept with its helper, so its Details still lists it after a reload
  expect(JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]').map((one: { id: string }) => one.id)).toEqual(['a1', 'a2'])
  await pane.unmount()

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await band.find({ type: 'Text' }))?.text).toBe("the engine's own")
  await band.unmount()
  expect(logged).toEqual([])
})

test("a pressed card shows the work's own chat: what it was told, what it wrote, and each tool step in order", async ($, on) => {
  const talk = [
    { role: 'user', text: '', toolUses: [] },
    {
      role: 'assistant',
      text: 'The nostril is open on the left side.',
      toolUses: [
        { tool_use_id: 'u1', tool: 'Read', input: { file_path: '/repo/heads/nose.py' } },
        { tool_use_id: 'u2', tool: 'Bash', input: { command: 'python fit.py --head A', description: 'Fit the nostril again' }, isError: true },
        { tool_use_id: 'u3', tool: 'mcp__claudopus__note', input: { text: 'I am fitting the nostril again.' } },
        { tool_use_id: 'u4', tool: 'mcp__notes__search', input: { query: 'nose' } },
        { tool_use_id: 'u6', tool: 'mcp__claudopus__todo', input: { item: 'Fit the nostril again', state: 'done' } },
      ],
    },
    { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'u1', text: 'def nose(): ...', isError: false }] },
    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u7', tool: 'mcp__claudopus__note', input: { text: 'Now  the left one.' } }] },
    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u5', tool: 'SubagentHandback', input: { message: 'The nostril is **closed**.' } }] },
  ]
  const { logged } = world(on, { talk })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  // It was told the prompt as the mod left it, the panel rule included, and what the app adds for the model alone
  expect(prompts[0]).toContain('mcp__claudopus__todo')
  talk[0] = { role: 'user', text: `${prompts[0]}<system-reminder>For the model alone.</system-reminder>`, toolUses: [] }
  // A steer of mine is kept by the card
  for (const use of talk[1]?.toolUses ?? []) await $.tool.call({ tool: use.tool, tool_use_id: use.tool_use_id, agentId: 'a1', ...use.input } as never)
  await $.prompt.submit({ text: 'No, the left one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “No, the left one.”' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a1', text: 'Now  the left one.' } as never)

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    await pressed(pane, 'open-a1')
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    // The panel rule and what the app adds for the model alone are left out of what it was told
    const said = (await tab.findAll({ type: 'Markdown' })).map(one => one.props.text)
    expect(said).toEqual(['Fix the nose on head A.', 'The nostril is open on the left side.', 'I am fitting the nostril again.', 'No, the left one.', 'Now  the left one.', 'The nostril is **closed**.'])
    // There is no "Latest" button
    expect(await tab.find({ type: 'Button', text: /^Latest$/ })).toBeUndefined()
    expect(await keyed(tab, 'latest')).toBeUndefined()
    // A tool step is one line: what it was for, or what it was pointed at; one that failed says so
    // A run of tool steps is one quiet row saying what was done; pressed, it opens
    expect(await tab.find({ type: 'Text', text: /^Read/ })).toBeUndefined()
    expect((await keyed(tab, 'run-1'))?.props.label).toBe('▸ Ran 1 command, read 1 file, 1 failed')
    expect((await keyed(tab, 'run-4'))?.props.label).toBe('▸ Took 1 other step')
    expect((await keyed(tab, 'run-5'))?.props.label).toBe('▸ Updated its to-dos')
    await pressed(tab, 'run-1')
    await pressed(tab, 'run-4')
    await pressed(tab, 'run-5')
    expect((await tab.find({ type: 'Text', text: /^Read/ }))?.text).toBe('Read nose.py')
    expect((await tab.find({ type: 'Text', text: /^Fit the nostril again \(/ }))?.text).toBe('Fit the nostril again (failed)')
    expect((await tab.find({ type: 'Text', text: /^search/ }))?.text).toBe('search: nose')
    expect((await tab.find({ type: 'Text', text: /^Ticked/ }))?.text).toBe('Ticked: Fit the nostril again')
    // My steer sits once, before what the work did about it: its to-do and the line it then wrote
    const texts = (await tab.findAll({ type: 'Text' })).map(one => one.text)
    expect(texts.indexOf('You')).toBe(texts.indexOf('search: nose') + 1)
    expect(texts.indexOf('Ticked: Fit the nostril again')).toBeGreaterThan(texts.indexOf('You'))
    // Pressed again, a run folds
    await pressed(tab, 'run-1')
    expect(await tab.find({ type: 'Text', text: /^Read/ })).toBeUndefined()
    // A tool's result is no line of the chat
    expect(await tab.find({ type: 'Text', text: /def nose/ })).toBeUndefined()
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
})

test('a steer is sent as written and the work is told it is one, the work is reminded until it says what it decided, and a new task goes back to the chat', async ($, on) => {
  const { sent, appended, submitted, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const step = (tool: string, input: object = {}) => $.tool.call({ tool, tool_use_id: 't', agentId: 'a1', ...input } as never)

  await $.prompt.submit({ text: 'Also make me a chart of the ears.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “Also make me a chart of the ears.”' } as never)
  // The chat's call goes on as it was made; the work is told in its own chat what a steer asks of it
  expect(sent[0]).toBe('Sam: “Also make me a chart of the ears.”')
  expect(appended).toHaveLength(1)
  expect(appended[0]).toContain('a1: The message sent to you just now that carries the person\'s words "Also make me a chart of the ears." is from the person, in their own words')
  expect(appended[0]).toContain('Decide which of three it is')
  expect(appended[0]).toContain('added it to your to-do list')
  expect(appended.join('\n')).not.toMatch(/steer/i)

  // The work goes on without saying what it decided: after two steps it is told so, once
  await step('Bash')
  expect(appended).toHaveLength(1)
  await step('Bash')
  await step('Bash')
  expect(appended).toHaveLength(2)
  expect(appended[1]).toContain('a1: A message from the person is waiting for your decision')

  // Its line is the decision; a task of its own goes back to the chat in the person's words, and nothing more is owed
  const noted = await step('mcp__claudopus__note', { text: 'Your chart of the ears is a new task; I go on with the nose.', task: 'Make a chart of the ears' })
  // The work hands it to the chat itself, as its own message: the mod submits nothing that would show as the person's
  expect(String(noted.result)).toContain('call SendMessage (load it with ToolSearch if needed) with to "main"')
  expect(String(noted.result)).toContain('Start it as its own piece of work: Make a chart of the ears')
  expect(String(noted.result)).toContain('Also make me a chart of the ears.')
  expect(String(noted.result)).toContain('do not do that task here')
  await clock.advance(10)
  expect(submitted).toHaveLength(0)
  for (let n = 0; n < 5; n += 1) await step('Bash')
  expect(appended).toHaveLength(2)

  // Work that has ended is sent a message, not a steer
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't2', to: 'a1', message: 'Sam: thanks' } as never)
  expect(sent[1]).toBe('Sam: thanks')
  expect(appended).toHaveLength(2)
})

test("only the person's words sent on by the chat are their steer: a helper's reply, work to work and the chat's own note are told as their sender's", async ($, on) => {
  const { appended } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count nostrils', prompt: 'count', parentAgentId: 'a1' } as never)
  const steps = async (id: string) => {
    for (let n = 0; n < 3; n += 1) await $.tool.call({ tool: 'Bash', tool_use_id: 'b', agentId: id } as never)
  }

  // A helper replies to the work that started it, and that work writes to its helper
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'There are two nostrils.', agentId: 'a3' } as never)
  expect(appended.at(-1)).toBe('a1: The message sent to you just now that begins "There are two nostrils." is from your helper "Count nostrils", not from the person: that one is not theirs. Take it as your helper "Count nostrils"\'s and carry on; a message that carries the person\'s own words stays theirs.')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a3: The message sent to you just now that begins "Count them again." is from the work that started you, not from the person')
  // One piece of work writes to another
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the work "Fix the nose", not from the person')
  // The chat's own note, which carries none of the person's words, is the chat's
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's4', to: 'a1', message: 'A fault seen from the chat: the card shows the wrong model.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
  expect(appended.join('\n')).not.toContain('from the person, in their own words')
  // Nothing is owed for them: going on, the work is not reminded of a steer
  await steps('a1')
  expect(appended.join('\n')).not.toContain('waiting for your decision')

  // A short message of theirs counts as whole words only: "yes" is not in "eyes"
  await $.prompt.submit({ text: 'yes', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's8', to: 'a1', message: 'Check the eyes again.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
  // The person's words, sent on by the chat, are their steer, and the card keeps them
  await $.prompt.submit({ text: 'Make the left nostril a little wider than the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's5', to: 'a1', message: 'Sam on the nose, in their words: “Make the left nostril — a little wider than the right one”' } as never)
  expect(appended.at(-1)).toContain('is from the person, in their own words')
  await steps('a1')
  expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision')
  // The same words sent by a piece of work are still not the person's steer
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the work "Fix the nose"')
  // Once the chat's turn is over, a message from it is its own again
  await $.turn.complete({ answer: 'Sent.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer' })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's7', to: 'a2', message: 'Make the left nostril a little wider than the right one.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
})

test("the person's words sent to work that has ended are theirs, and the chat's own note sent after them is labelled by its own start", async ($, on) => {
  const { appended, sent } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.turn.complete({ answer: 'The nose is fixed. Shall I build it into the app? '.repeat(20), durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await $.prompt.submit({ text: 'Yes, build the nose into the app', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'From Sam, as they said it: "Yes, build the nose into the app"' } as never)
  const all = [...appended, ...sent].join('\n')
  expect(all).toContain('The message that started you again, carrying the person\'s words "Yes, build the nose into the app", is from the person, in their own words')
  expect(all).not.toContain('not from the person')
  // The work, started again, is working when the chat's own note follows: that line names the note, not their words
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'From the chat, not Sam: release through the release command.' } as never)
  expect(appended.at(-1)).toContain('that begins "From the chat, not Sam: release through the release command." is from the chat, not from the person: that one is not theirs')
})

test('work that takes many steps without touching its to-dos is reminded to bring them up to date', async ($, on) => {
  const { appended } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const step = (tool: string, input: object = {}) => $.tool.call({ tool, tool_use_id: 't', agentId: 'a1', ...input } as never)

  for (let n = 0; n < 11; n += 1) await step('Bash')
  expect(appended).toEqual([])
  await step('Read')
  expect(appended).toHaveLength(1)
  expect(appended[0]).toContain('a1: You have taken 12 steps since you last touched your to-dos')
  // Touching them starts the count again
  for (let n = 0; n < 11; n += 1) await step('Bash')
  await step('mcp__claudopus__todo', { item: 'Fit the nostril again', state: 'doing' })
  for (let n = 0; n < 11; n += 1) await step('Bash')
  expect(appended).toHaveLength(1)
  await step('Bash')
  expect(appended).toHaveLength(2)
})

test('work that ends in an error is kept as failed, time lying ended is not counted, and work under way is never forgotten', SLOW, async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await clock.advance(120_000)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'error', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^An error/ }))?.text).toBe('An error stopped it before it finished · 2m 00s')

  // An hour later it is sent a message and works again: the hour is not counted
  await clock.advance(3_600_000)
  await $.agent.spawn({ ...spawn, prompt: 'try again', resume: { agentId: 'a1' } } as never)
  expect((await tab.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await tab.unmount()

  // Fifty more pieces of work start and end: the first is still listed
  for (let n = 0; n < 50; n += 1) {
    const r = await $.agent.spawn({ ...spawn, description: `Other ${n}`, prompt: 'x' } as never)
    await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t-${n}`, reason: 'answer', agentId: r.agentId } as never)
  }
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.text).toBe('Fix the nose')
  await pane.unmount()
})

test('a chat the app has not kept is said so, with the answer the work gave', async ($, on) => {
  world(on, { talk: { deny: 'no transcript for a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /not kept/ }))?.text).toBe('The app has not kept the chat of this work.')
  expect((await tab.find({ type: 'Markdown' }))?.props.text).toBe('The nostril is closed.')
  await tab.unmount()
  await pane.unmount()
})

test('a message of mine passed on to work already listed opens its to-do again, and that work is not told the panel rule twice', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)

  await $.prompt.submit({ text: 'No, the left nostril, not the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: the left nostril' } as never)
  await $.agent.spawn({ ...spawn, prompt: 'the left nostril', resume: { agentId: 'a1' } } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /^\d+s$/ }))?.text).toBe('0s')
  expect(prompts.at(-1)).toBe('the left nostril')
  await pane.unmount()
})

test('the panel shows how full the context of this chat and of each piece of work is, and the model the work runs on', async ($, on) => {
  world(on, { model: 'claude-opus-5-5-20261001' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  // A copy of the chat, as work began before every piece started from a brief, has the chat's window
  await $.agent.spawn({ ...spawn, subagentType: 'fork', fork: true, prompt: 'fix the nose' } as never)
  await $.session.measure({ context: { tokens: 110_900, window: 500_000, percent: 22 }, rateLimits: [], changed: ['context'] } as never)
  // A response of the work ends: the stream passes through whole and its size is kept
  const kinds: string[] = []
  for await (const chunk of $.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) kinds.push(chunk.kind)
  expect(kinds).toEqual(['text'])

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /This chat/ }))?.text).toBe('This chat: 22% · 111k of 500k')
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Opus 5.5')
  expect((await pane.find({ type: 'Text', text: /context/ }))?.text).toBe(' · context 61% (305k) · 0s')
  // Work with no to-dos has a whole purple edge
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => b.props.backgroundColor)).toEqual(['#8A63F0'])
  // A helper's row says its model, how much context it holds and its time, in that order
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)
  for await (const chunk of $.turn.step({ turnId: 'turn-3', index: 0, model: 'm', messageCount: 2, agentId: 'a2' })) kinds.push(chunk.kind)
  // More to-dos than the edge has parts for are one edge, filled as far as they are done
  for (let n = 0; n < 16; n++) await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: `e${n}`, agentId: 'a1', item: `Part ${n}`, state: n < 3 ? 'done' : 'open' } as never)
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 3], ['#8A63F05C', 13]])
  await pane.unmount()
  const wide = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await wide.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 305k · 0s')
  await wide.unmount()
  // A narrower panel drops the context, and the narrowest the model too, so the helper's name keeps its room
  const narrow = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await narrow.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 0s')
  await narrow.unmount()
  const slim = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 28 }, surface: 'desktop' } as never)
  expect(await slim.find({ type: 'Text', text: /^Opus 5\.5 · / })).toBeUndefined()
  expect((await slim.find({ type: 'Text', text: /^\d+s$/ }))?.text).toBe('0s')
  await slim.unmount()
})

test("a card's title, its line of facts and every line under them start at one left edge, on a desktop and in a terminal, at work, asking and finished", async ($, on) => {
  const { clock } = world(on, { model: 'claude-opus-5-5-20261001' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, subagentType: 'fork', fork: true, prompt: 'fix the nose' } as never)
  for await (const chunk of $.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) void chunk
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)
  await call('todo', { item: 'Fit the nostril', state: 'doing' })
  await call('note', { text: 'I am fitting the nostril.' })
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)

  // How far in a line's first letter is: the padding on the way down its first parts, and a desktop's own around a plain Button
  type Drawn = { type?: string; props?: Record<string, unknown>; children?: unknown[] }
  const insetOf = (node: unknown, surface: string): string[] => {
    if (!node || typeof node !== 'object') return []
    const { type, props = {}, children = [] } = node as Drawn
    const own = [props.paddingLeft ?? props.paddingX ?? props.padding].filter(step => step !== undefined && step !== 0).map(String)
    if (type === 'Button') return [...own, ...(props.plain && surface !== 'terminal' ? ['xs'] : [])]
    return type === 'Box' ? [...own, ...insetOf(children.find(one => one && typeof one === 'object'), surface)] : own
  }
  // Each line of the card's column, the title and its facts as two
  const edges = async (surface: 'desktop' | 'terminal') => {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    const card = (await pane.find({ type: 'Box', key: 'todo-a1' })) as Drawn | undefined
    await pane.unmount()
    const column = (card?.children ?? []).filter(one => one && typeof one === 'object').at(-1) as Drawn
    const [head, ...rest] = (column.children ?? []).filter(one => one && typeof one === 'object') as Drawn[]
    return [...(head.children ?? []), ...rest].filter(one => one && typeof one === 'object').map(line => insetOf(line, surface).join('+'))
  }
  const expectOneEdge = async (lines: number) => {
    // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge
    expect(await edges('desktop')).toEqual(Array(lines).fill('xs'))
    expect(await edges('terminal')).toEqual(Array(lines).fill(''))
  }
  // At work: the title, the model's name that opens the choice of models, the line beside the dots, the helper tree
  await expectOneEdge(4)
  // Asking: the ask comes between the facts and the line it wrote
  await call('ask', { text: 'May I replace the nose?', choices: ['Approve', 'Not now'] })
  await expectOneEdge(5)
  await call('ask', { text: '' })
  // Finished, in its pause: the facts are plain text, the line says it finished
  await $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  await $.turn.complete({ answer: 'Fixed.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(500)
  await expectOneEdge(4)
})

test('work the app moves to an older model, or a helper it starts on Haiku, has each step sent to a model work runs on, and its card says what it was kept off', async ($, on) => {
  const { stepped, files } = world(on, { model: 'claude-fable-5-2' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const step = async (index: number, model: string, agentId: string | undefined = 'a1') => {
    for await (const _ of $.turn.step({ turnId: 'turn-2', index, model, messageCount: 2, ...(agentId ? { agentId } : {}) })) void _
  }
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const line = async () => (await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')

  // On the model it was started on, nothing is changed and the card says nothing more
  await step(0, 'claude-opus-5-5')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(await line()).not.toContain('kept off')

  // The app's safeguards flagged a message and the app sends the next steps to Opus 4.8: they go to Fable 5.2
  await step(1, 'claude-opus-4-8')
  await step(2, 'claude-opus-4-8')
  expect(stepped).toEqual(['claude-opus-5-5', 'claude-fable-5-2', 'claude-fable-5-2'])
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Fable 5.2')
  expect(await line()).toContain('kept off Opus 4.8')
  expect((files.get(`${MEMORY}/log.md`) ?? '').split('work a1 was sent to Opus 4.8 by the app: its steps go to Fable 5.2').length).toBe(2)

  // Once the app sends its steps to a right model again, a newer one too, nothing is changed and the card no longer says so
  await step(3, 'claude-opus-5-6')
  expect(stepped.at(-1)).toBe('claude-opus-5-6')
  expect(await line()).not.toContain('kept off')
  await step(4, 'claude-opus-4-8')
  expect(await line()).toContain('kept off Opus 4.8')

  // A helper of an agent type the app runs on Haiku runs on Sonnet 5.5; an older Sonnet too
  await $.agent.spawn({ ...spawn, description: 'Look it up', prompt: 'look it up', parentAgentId: 'a1' } as never)
  await step(0, 'claude-haiku-5-5', 'a2')
  await step(1, 'claude-sonnet-5', 'a2')
  expect(stepped.slice(-2)).toEqual(['claude-sonnet-5-5', 'claude-sonnet-5-5'])

  // The chat's own thread runs on the model the person picked for it, whichever that is
  await step(0, 'claude-opus-4-8', '')
  expect(stepped.at(-1)).toBe('claude-opus-4-8')

  // A model the person picks on the card wins over the app's move
  await pressed(pane, 'model-a1')
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')
  await step(5, 'claude-opus-4-8')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  expect(await line()).not.toContain('kept off')

  // An agent a workflow's script started has no card of its own: its step is moved all the same, and the log says so
  await step(0, 'claude-haiku-5-5', 'w1')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  expect(files.get(`${MEMORY}/log.md`)).toContain('work w1 was sent to Haiku 5.5 by the app: its steps go to Sonnet 5.5')
})

test('work that answers from an older model all the same says so on its card', async ($, on) => {
  const answered: { by?: string } = { by: 'claude-opus-4-8' }
  world(on, { model: 'claude-fable-5-2', answered })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Opus 4.8')
  expect((await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')).toContain('not a model work should run on')
})

test('the model a running work is on is pressed and another chosen: its next step runs on it, its card says so at once, and its chat and the work are told', async ($, on) => {
  const talk: { role: string; text: string; toolUses: never[] }[] = [{ role: 'user', text: 'Fix the nose on head A.', toolUses: [] }]
  const answered: { by?: string } = {}
  const { appended, stepped, logged } = world(on, { model: 'claude-opus-5-5', talk, answered })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const step = async (index: number, model = 'claude-opus-5-5') => {
    for await (const _ of $.turn.step({ turnId: 'turn-2', index, model, messageCount: 2, agentId: 'a1' })) void _
  }
  await step(0)
  expect(stepped).toEqual(['claude-opus-5-5'])

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The model's name is a control that underlines under the pointer; pressed, the three models are offered, the one in use ticked
  expect((await keyed(pane, 'model-a1'))?.props.plain).toBe(true)
  await pressed(pane, 'model-a1')
  const offered = (await pane.findAll({ type: 'Button' })).filter(one => /^pick-a1-/.test(one.key ?? '')).map(one => one.props.label)
  expect(offered).toEqual(['✓ Opus 5.5', 'Sonnet 5.5', 'Fable 5.2'])
  expect(offered.join(' ')).not.toMatch(/Haiku/)
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')

  // The card names the new model at once, and the choice is closed
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  expect(await keyed(pane, 'pick-a1-claude-opus-5-5')).toBeUndefined()
  // The work is told in its own chat, with the time
  expect(appended).toHaveLength(1)
  expect(appended[0]).toMatch(/^a1: Model changed to Sonnet 5\.5 at \d\d:\d\d\. The person chose it in the panel: your next steps run on Sonnet 5\.5\.$/)
  // A response under way when the choice was made, answered by the old model, leaves the card on the new one
  answered.by = 'claude-opus-5-5'
  await step(1)
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  delete answered.by
  stepped.pop()
  // Its next step goes to the new model, though the engine would have sent it to the old one, and the card keeps it
  await step(1)
  expect(stepped).toEqual(['claude-opus-5-5', 'claude-sonnet-5-5'])
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')

  // In Details the header's model is the same control, and the change is a line of its own in its chat where it happened
  talk.push({ role: 'user', text: (appended[0] ?? '').slice('a1: '.length), toolUses: [] })
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await keyed(tab, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  expect((await tab.find({ type: 'Text', text: /^Model changed/ }))?.text).toMatch(/^Model changed to Sonnet 5\.5 · \d\d:\d\d$/)
  expect((await tab.findAll({ type: 'Markdown' })).map(one => one.props.text)).toEqual(['Fix the nose on head A.'])

  // Choosing again moves it again; the model it is on already changes nothing
  await pressed(tab, 'model-a1')
  await pressed(tab, 'pick-a1-claude-sonnet-5-5')
  expect(appended).toHaveLength(1)
  await pressed(tab, 'model-a1')
  await pressed(tab, 'pick-a1-claude-fable-5-2')
  expect(appended[1]).toContain('a1: Model changed to Fable 5.2 at')
  await step(2)
  expect(stepped.at(-1)).toBe('claude-fable-5-2')

  // Work that has ended names its model as plain text
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect(await keyed(tab, 'model-a1')).toBeUndefined()
  expect((await tab.find({ type: 'Text', text: /^Finished/ }))?.text).toMatch(/^Finished · Fable 5\.2 · /)
  expect(logged).toEqual([])
  await tab.unmount()
  await pane.unmount()
})

test("Details opens as a tab of its own, named after the work, in front; pressed again it brings that tab forward and keeps what was unfolded", async ($, on) => {
  const { opened, tabs, closed } = world(on, { panes: ['claudopus', 'work-a1'] })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (const n of [1, 2, 3, 4, 5]) await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't', agentId: 'a1', item: `Step ${n}` } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => tabs.includes('work-a1: Fix the nose') || undefined)).toBe(true)
  // The pressed button comes back under a new key, so the list is not held where it was
  expect(await pane.find({ type: 'Button', key: 'open-a1-0' })).toBeUndefined()
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await pressed(tab, 'fold--1000002')
  expect(await tab.find({ type: 'Text', text: /^Step 5$/ })).toBeDefined()
  // Pressed again with its tab open: the same tab comes forward, nothing is closed, and it stays unfolded
  await pressed(pane, 'open-a1')
  expect(await until(async () => (opened.filter(id => id === 'work-a1').length === 2 ? true : undefined))).toBe(true)
  expect(closed).not.toContain('claudopus')
  expect(await tab.find({ type: 'Text', text: /^Step 5$/ })).toBeDefined()
  // The list is still the list: its header and the card
  expect((await pane.find({ type: 'Text', text: /^Claudopus$/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  await tab.unmount()
  // A tab for work no longer kept says so
  const gone = await $.ui.mount({ ...LIST, requestId: 'work-zz', surface: 'desktop' } as never)
  expect((await gone.find({ type: 'Text' }))?.text).toBe('This work is no longer kept.')
  await gone.unmount()
  await pane.unmount()
})

test("a Details tab draws at once, before a long chat is read, and fills in once it is", async ($, on) => {
  // The app is slow to give this work's chat: it gives it only when let go
  let give: () => void = () => undefined
  const given = new Promise<void>(resolve => (give = resolve))
  world(on, { talk: given.then(() => [{ role: 'assistant', text: 'The nostril is closed.', toolUses: [] }]) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await tab.find({ type: 'Text', text: /^Fix the nose$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Reading its chat/ }))?.text).toBe('Reading its chat…')
  give()
  expect((await until(async () => (await tab.find({ type: 'Markdown' }))?.props.text))).toBe('The nostril is closed.')
  expect(await tab.find({ type: 'Text', text: /^Reading its chat/ })).toBeUndefined()
  await tab.unmount()
})

test('the stop button of a to-do stops its work', async ($, on) => {
  const { stopped, clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a1' })
  expect(stopped).toEqual(['a1'])
  // Stopped work stays in its place for its pause, plain, saying it was stopped, with no Stop; then it leaves the panel
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text).filter(text => /nose|ears/.test(text))
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears'])
  expect((await pane.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /Fix the nose/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeUndefined()
  expect(await pane.findAll({ type: 'Text', text: /^\d+s$/ })).toHaveLength(1)
  await pane.unmount()
})

test('work that ends pauses in its place for two seconds: two at once, one ended while the panel was closed, one that reports twice', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|eyes/.test(one.text)).map(one => one.text)
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label

  // Two that end at once both stay green in their places, the one still working between them; neither is under Finished yet
  await clock.advance(400)
  await end('a1', 't1')
  await end('a3', 't3')
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears', 'Draw the eyes'])
  expect(await pane.findAll({ type: 'Text', text: '✓ Finished' })).toHaveLength(2)
  expect((await pane.find({ type: 'Text', text: /^Working on/ }))?.text).toBe('Working on 1 thing')
  expect(await fold()).toBeUndefined()
  await clock.advance(2_100)
  expect(await titles()).toEqual(['Check the ears'])
  expect(await fold()).toBe('▸ Finished 2')

  // Work that ends while the panel is closed is already under Finished when it opens two seconds on: no card is left green
  await pane.unmount()
  await end('a2', 't2')
  await clock.advance(2_500)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 3')

  // Work sent on again is back among the running cards; when it ends again it pauses again, then goes back to Finished
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the nose again.' } as never)
  expect(await again.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  await end('a1', 't4')
  expect(await again.findAll({ type: 'Text', text: '✓ Finished' })).toHaveLength(1)
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 2')
  await clock.advance(2_100)
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 3')
  await again.unmount()
})

test('work the engine runs is listed even when the mod never saw it start, and work it reports as failed leaves the panel', async ($, on) => {
  const agents: Record<string, string> = { a7: 'running' }
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /Listed/ }))?.text).toBe('Listed by the engine')
  // A helper the mod never saw start is no to-do
  agents.h9 = 'running'
  kinds.h9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await pane.findAll({ type: 'Text', text: /Listed/ })).toHaveLength(1)
  agents.a7 = 'failed'
  await clock.advance(20_000)
  expect((await until(() => pane.find({ type: 'Text', text: /^Nothing/ })))?.text).toBe('Nothing is running')
  await pane.unmount()
})

test('work the chat started that was running before the mod loaded, as after a rename, is a card of its own, not a helper', async ($, on) => {
  const agents: Record<string, string> = { w5: 'running' }
  const kinds: Record<string, string> = { w5: 'general-purpose' }
  const talk = [{ role: 'assistant', text: '', toolUses: [{ tool_use_id: 'x1', tool: 'Agent', input: { description: 'Listed by the engine' } }] }]
  world(on, { agents, kinds, talk })
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /Listed/ }))?.text).toBe('Listed by the engine')
  expect((await pane.find({ type: 'Text', text: /^Working on/ }))?.text).toBe('Working on 1 thing')
  await pane.unmount()
})

test('work that ended before the mod kept it is read back from the chat\'s own records, its thinking never', async ($, on) => {
  const { files } = world(on)
  const folder = `${HOME}/.claude/projects/-repo/engine-id/subagents`
  files.set(`${folder}/agent-r1.meta.json`, JSON.stringify({ description: 'Old work', spawnDepth: 1, finished: true }))
  files.set(`${folder}/agent-h1.meta.json`, JSON.stringify({ description: 'A helper of it', spawnDepth: 2, finished: true }))
  files.set(`${folder}/agent-h1.jsonl`, JSON.stringify({ timestamp: '2026-11-11T10:00:00Z', type: 'user', message: {} }))
  const rows = [
    { timestamp: '2026-11-11T10:00:00Z', type: 'user', message: { content: 'go' } },
    {
      timestamp: '2026-11-11T10:05:00Z',
      type: 'assistant',
      message: {
        model: 'claude-opus-5-5',
        usage: { input_tokens: 10, cache_read_input_tokens: 1000, output_tokens: 5 },
        content: [
          { type: 'thinking', thinking: 'a secret thought' },
          { type: 'tool_use', name: 'mcp__progress__todo', input: { item: 'Step one', state: 'done' } },
          { type: 'tool_use', name: 'mcp__other__note', input: { text: 'not ours' } },
          { type: 'tool_use', name: 'mcp__progress__note', input: { text: 'The old line' } },
        ],
      },
    },
    'not json',
  ]
  files.set(`${folder}/agent-r1.jsonl`, rows.map(row => (typeof row === 'string' ? row : JSON.stringify(row))).join('\n'))
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const fold = await until(async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label))))
  expect(fold?.props.label).toBe('▸ Finished 1')
  await pane.press({ key: String(fold?.key) })
  expect((await pane.find({ type: 'Text', text: /The old line/ }))?.text).toBe('The old line')
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · Opus 5.5 · context 1.0k · 1 of 1 done · 5m 00s')
  expect(await pane.find({ type: 'Text', text: /secret|not ours|helper/ })).toBeUndefined()
  await pane.unmount()
})

test('helpers hang inside their work\'s card as a tree, one slim row each that opens its Details; ended ones fold into one row laid out the same, and Details lists every one', async ($, on) => {
  const { clock, opened } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const helper = (description: string, parentAgentId: string) => $.agent.spawn({ subagentType: 'general-purpose', background: true, description, prompt: 'go', parentAgentId } as never)
  await helper('Measure the nose', 'a1')
  await clock.advance(1_000)
  await helper('Read the manual', 'a2')
  await clock.advance(1_000)
  await helper('Read the appendix', 'a2')
  await clock.advance(1_000)
  await helper('Measure the ears', 'a1')

  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  const lines = async () => (await pane.findAll({ type: 'Text' })).map(one => one.text).filter(text => /^[│├└┬─ ]{4,}$/.test(text))
  // Each helper is one row, joined to the row above it
  expect(await lines()).toEqual(['├─┬─', '│ ├───', '│ └───', '└───'])
  // Only what the chat started is a card
  expect((await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|manual|appendix/.test(one.text)).map(one => one.text)).toEqual(['Fix the nose'])
  // Each says its time beside its name, after its model and context once those are known, and has no dots
  expect((await pane.findAll({ type: 'Text', text: /^\ds$/ })).map(one => one.text)).toEqual(['3s', '3s', '2s', '1s', '0s'])
  expect((await keyed(pane, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  // Each opens its own Details by its name, with no mark at its end
  expect(await keyed(pane, 'go-list-a2')).toBeUndefined()
  await pressed(pane, 'open-list-a4')
  expect(await until(async () => opened.includes('work-a4') || undefined)).toBe(true)

  // A helper that ended leaves the tree after its pause; one that still has a helper at work stays to hold it
  await $.turn.complete({ answer: 'Read.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' } as never)
  await $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a5' } as never)
  await clock.advance(2_100)
  expect(await lines()).toEqual(['├─┬─', '│ └───', '└───'])
  expect((await keyed(pane, 'open-rest-a1'))?.props.label).toBe('2 helpers ended')
  expect(await keyed(pane, 'go-rest-a1')).toBeUndefined()
  await pressed(pane, 'open-rest-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  expect(await keyed(pane, 'open-list-a3')).toBeUndefined()
  expect(await keyed(pane, 'open-list-a5')).toBeUndefined()
  await pane.unmount()

  // Where the surface draws, each row's lines end in a dot in the colour of how it stands, and rows meet: a helper with its own
  // has a line down from its dot, its last one turns to it in a curve past the line of the level above, and the closing row has a ring
  const drawn = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const svgs = (await drawn.findAll({ type: 'Svg' })).map(svg => ({ source: String(svg.props.source), alt: svg.props.alt })).filter(svg => svg.source.includes('stroke-opacity'))
  expect(svgs.map(svg => svg.alt)).toEqual(['At work', 'At work', 'Ended'])
  expect(svgs[0]?.source).toContain('d="M9 0V20M9 10H22M27 15V20"')
  expect(svgs[1]?.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"')
  expect(svgs[1]?.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>')
  // A row at work has its slow ring round the dot; the closing row of those that ended is still
  expect(svgs[1]?.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>')
  expect(svgs[2]?.source).not.toContain('<animate')
  expect(svgs[2]?.source).toContain('d="M9 0V5Q9 10 14 10H22"')
  expect(svgs[2]?.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>')
  // No row names a model, and none has the three dots: only the card itself does
  expect((await drawn.findAll({ type: 'Svg' })).filter(svg => svg.props.alt === 'Being done now')).toHaveLength(1)
  await drawn.unmount()
  // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 20 }, surface: 'desktop' } as never)
  expect((await keyed(narrow, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  await narrow.unmount()

  // The work's Details lists every helper, ended or not, as the same tree
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  expect((await tab.find({ type: 'Text', text: / in all$/ }))?.text).toBe('2 at work · 4 in all')
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(text => /manual|appendix|Measure/.test(text))).toEqual(['Measure the nose', 'Read the manual', 'Read the appendix', 'Measure the ears'])
  // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
  expect((await tab.findAll({ type: 'Raster' })).filter(one => String(one.key).endsWith('-ring')).length).toBe(2)
  expect((await tab.findAll({ type: 'Text', text: '✓' })).length).toBe(2)
  expect(await keyed(tab, 'open-details-a3')).toBeDefined()
  await tab.unmount()
})

test('what a piece of work and its helpers have running is in its Details too, every job under the one that started it, and in a helper\'s own Details', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'run the site', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'run the site' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Fetch the weights', prompt: 'go', parentAgentId: 'a1' } as never)
  const call = (agentId: string, id: string, command: string, description: string) =>
    $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command, description, run_in_background: true } as never)
  await call('a1', 'b1', 'npm run dev', 'Serve the site')
  for (const n of [1, 2, 3, 4, 5]) await call('a2', `d${n}`, `curl -o w${n}.bin https://example.com/w${n}.bin`, `Download weights ${n}`)
  const texts = async (view: { findAll: (q: { type: 'Text' }) => Promise<{ text: string }[]> }) => (await view.findAll({ type: 'Text' })).map(one => one.text)
  // The work's Details: its own server first under it, then the helper with all five of its downloads, none folded into a count
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  // In drawing order, with the tree's lines: the server on the work's own line, the helper, its downloads one level under it
  const rows = (await tab.findAll({ type: 'Text' })).map(one => one.text)
  const picked = rows.flatMap((text, i) => (/^Server · |^Download · /.test(text) ? [`${rows[i - 2]} ${text}`] : []))
  expect(picked).toEqual(['├─── Server · Serve the site', ...[1, 2, 3, 4].map(n => `  ├─── Download · Download weights ${n}`), '  └─── Download · Download weights 5'])
  const shown = await texts(tab)
  expect(shown.some(text => /more running/.test(text))).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Helpers and jobs$/ }))?.props.bold).toBe(true)
  expect(shown).toContain('6 jobs running · 1 helper at work')
  await tab.unmount()
  // The card on the list still folds the helper's jobs past JOBS_SHOWN into one row
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  expect((await texts(list)).filter(text => /Download weights/.test(text))).toHaveLength(3)
  expect((await texts(list)).some(text => /^2 more running/.test(text))).toBe(true)
  await list.unmount()
  // The helper's own Details, with no helpers of its own, shows what it has running
  const helperTab = await $.ui.mount({ ...LIST, requestId: 'work-a2', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const its = await texts(helperTab)
  expect((await helperTab.find({ type: 'Text', text: /^Running$/ }))?.props.bold).toBe(true)
  expect(its).toContain('5 jobs running')
  expect(its.filter(text => /Download weights/.test(text))).toHaveLength(5)
  expect(its.some(text => /Serve the site/.test(text))).toBe(false)
  await helperTab.unmount()
})

test('long work keeps only its newest ended helpers, and none of work that was forgotten', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (let n = 2; n <= 106; n += 1) {
    await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: `Measure ${n}`, prompt: 'go', parentAgentId: 'a1' } as never)
    await clock.advance(10)
    if (n <= 105) await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t${n}`, reason: 'answer', agentId: `a${n}` } as never)
  }
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  // 104 ended, the oldest four forgotten; the one at work is never forgotten
  expect((await tab.find({ type: 'Text', text: / in all$/ }))?.text).toBe('1 at work · 101 in all')
  const names = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(names.includes('Measure 5')).toBe(false)
  expect(names.includes('Measure 6')).toBe(true)
  await tab.unmount()
})
