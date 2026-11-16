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
    // One short line, and never what a piece of work is doing: that is on its card
    expect(await band.find({ type: 'Text', text: /more$|Check the ears|Fix the nose/ })).toBeUndefined()
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
  // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
  // as the edge's lighter part, the rest only counted
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^Step / }))?.text).toBe('Step 1 of 2 ·')
  expect((await pane.find({ type: 'Text', text: /^Fit the/ }))?.props.dimColor).toBe(false)
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
  expect(String((await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' } as never)).result)).toContain('Only a background task')

  // The newer line replaced the older; a dropped to-do is not counted
  expect(await pane.find({ type: 'Text', text: /^I am fitting/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^The nostril is closed/ }))?.text).toBe('The nostril is closed; I am comparing the head with your scan.')
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('1 of 2 done')
  // The done to-do's part of the edge is bright, and with none being done the other is dim, named dim as the next
  expect(await edgeOf(pane)).toEqual(['#8A63F0', '#8A63F05C'])
  expect((await pane.find({ type: 'Text', text: /^Next, step / }))?.text).toBe('Next, step 2 of 2 ·')
  expect((await pane.find({ type: 'Text', text: /^Compare the head/ }))?.props.dimColor).toBe(true)
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
  expect((await tab.find({ type: 'Text', text: /^Conversation$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /of \d+ done$/ }))?.text).toBe('1 of 7 done')
  expect((await tab.find({ type: 'Text', text: /^Compare/ }))?.props.dimColor).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Check the left ear/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^The nostril is closed/ }))?.props.dimColor).toBe(true)
  expect(await tab.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
  expect(await tab.find({ type: 'Text', text: /^Later step 4$/ })).toBeDefined()
  expect(await keyed(tab, 'fold--1000003')).toBeUndefined()
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
  expect((await pane.findAll({ type: 'Svg' })).filter(svg => String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'Working' && svg.props.isInteractive === true)).toHaveLength(1)
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
  expect((await tab.find({ type: 'Text', text: /helper working$/ }))?.text).toBe('1 helper working')

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
  await pane.press({ key: String(buttons.find(b => b.props.label === '▸ Finished 1')?.key) })
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 1 of 7 done · 2m 00s')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  // Finished work's Details opens as a tab of its own too
  await pressed(pane, 'open-a1')
  const ended = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await ended.find({ type: 'Text', text: /^Finished · \d+m/ }))?.text).toBe('Finished · 2m 00s')
  expect((await ended.find({ type: 'Text', text: /^Conversation$/ }))?.props.bold).toBe(true)
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

// A long work resumed with new rounds: 16 to-dos, 12 done and one being done, more than the edge has parts for
test('past the parts the edge has, it is one bar in three shades, and the step being done is named with the same number', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'add the depth model to the video fit', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'add the depth model to the video fit' } as never)
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)
  for (let n = 1; n <= 16; n += 1) await call('todo', { item: `Round step ${n}` })
  for (let n = 1; n <= 12; n += 1) await call('todo', { item: `Round step ${n}`, state: 'done' })
  await call('todo', { item: 'Round step 13', state: 'doing' })
  await call('note', { text: 'New round on the nose only.' })
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const edge = (await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0'))
  expect(edge.map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 12], ['#8A63F0AD', 1], ['#8A63F05C', 3]])
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('12 of 16 done')
  expect((await pane.find({ type: 'Text', text: /^Step / }))?.text).toBe('Step 13 of 16 ·')
  expect(await pane.find({ type: 'Text', text: /^Round step 13$/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /^Round step 14$/ })).toBeUndefined()
  // With nothing being done, the bar has no lighter part and the next is named dim
  await call('todo', { item: 'Round step 13', state: 'done' })
  const after = (await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0'))
  expect(after.map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 13], ['#8A63F05C', 3]])
  expect((await pane.find({ type: 'Text', text: /^Next, step / }))?.text).toBe('Next, step 14 of 16 ·')
  // Every step ticked while it still runs: the row stays and says so
  for (let n = 14; n <= 16; n += 1) await call('todo', { item: `Round step ${n}`, state: 'done' })
  expect((await pane.find({ type: 'Text', text: /^All \d+ steps done$/ }))?.text).toBe('All 16 steps done')
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
  // The chat put a name before their words: only the words quoted are told as theirs
  expect(appended[0]).toContain('a1: The message sent to you just now carries the person\'s words "Also make me a chart of the ears.", typed by them in the chat. Only those words are the person\'s')
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
  expect(String(noted.result)).toContain('Start it as its own background task: Make a chart of the ears')
  expect(String(noted.result)).toContain('Also make me a chart of the ears.')
  expect(String(noted.result)).toContain("don't do that new one here")
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
  expect(appended.at(-1)).toBe('a1: The message sent to you just now that begins "There are two nostrils." is from your helper "Count nostrils", not from the person: that one is not theirs. Take it as your helper "Count nostrils"\'s and continue; a message that carries the person\'s own words stays theirs.')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a3: The message sent to you just now that begins "Count them again." is from the task that started you, not from the person')
  // One piece of work writes to another
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the task "Fix the nose", not from the person')
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
  expect(appended.at(-1)).toContain('carries the person\'s words "Make the left nostril a little wider than the right one.", typed by them in the chat. Only those words are the person\'s')
  await steps('a1')
  expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision')
  // The same words sent by a piece of work are still not the person's steer
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the task "Fix the nose"')
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
  expect(all).toContain('The message that started you again carries the person\'s words "Yes, build the nose into the app", typed by them in the chat. Only those words are the person\'s')
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
  expect((await tab.find({ type: 'Text', text: /^Failed with/ }))?.text).toBe('Failed with an error · 2m 00s')

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
  expect((await tab.find({ type: 'Text', text: /save this task/ }))?.text).toBe("The app didn't save this task's conversation.")
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
    return [...(head?.children ?? []), ...rest].filter(one => one && typeof one === 'object').map(line => insetOf(line, surface).join('+'))
  }
  const expectOneEdge = async (lines: number) => {
    // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge
    expect(await edges('desktop')).toEqual(Array(lines).fill('xs'))
    expect(await edges('terminal')).toEqual(Array(lines).fill(''))
  }
  // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
  await expectOneEdge(5)
  // Asking: the ask comes between the step and the line it wrote
  await call('ask', { text: 'May I replace the nose?', choices: ['Approve', 'Not now'] })
  await expectOneEdge(6)
  await call('ask', { text: '' })
  // Finished, in its pause: the facts are plain text, the line says it finished
  await $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  await $.turn.complete({ answer: 'Fixed.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(500)
  await expectOneEdge(4)
})

test('work a safety flag would move to an older model is ended with a report that says so, never run there; an agent whose own kind starts it on an older model or Haiku runs on the newest', async ($, on) => {
  const { stepped, files } = world(on, { model: 'claude-fable-5-2', startedOn: { 'Look it up': 'claude-haiku-5-5', 'Old kind': 'claude-opus-4-1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const step = async (index: number, model: string, agentId: string | undefined = 'a1') => {
    const chunks: { kind: string; name?: string; json?: string; text?: string }[] = []
    for await (const c of $.turn.step({ turnId: 'turn-2', index, model, messageCount: 2, ...(agentId ? { agentId } : {}) })) chunks.push(c as never)
    return chunks
  }
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const line = async () => (await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')

  // On the model it was started on, nothing is changed and the card says nothing more
  await step(0, 'claude-opus-5-5')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(await line()).not.toContain('safety flag')

  // The app's safeguards flagged a message and the app would send the next step to Opus 4.8: no request is made there; the work
  // hands back a report that says why, and its card says so
  const flagged = await step(1, 'claude-opus-4-8')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(flagged.find(c => c.kind === 'tool')?.name).toBe('SubagentHandback')
  expect(JSON.parse(flagged.find(c => c.kind === 'input')?.json ?? '{}').message).toContain('Start what is left again on the current model, leaving out what was flagged')
  expect(await line()).toContain("ended after a safety flag, so it doesn't continue on Opus 4.8")
  // Where the handback does not end it, a step after is a plain last answer, and still nothing runs on the older model
  const again = await step(2, 'claude-opus-4-8')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(again.find(c => c.kind === 'text')?.text).toContain("an older model Claudopus doesn't run tasks on")
  expect((files.get(`${MEMORY}/log.md`) ?? '').split('work a1 was flagged and the app would send it to Opus 4.8').length).toBe(2)

  // A helper of an agent type that starts on Haiku runs on Sonnet 5.5; an older Sonnet the app moves it to is not run either
  await $.agent.spawn({ ...spawn, description: 'Look it up', prompt: 'look it up', parentAgentId: 'a1' } as never)
  await step(0, 'claude-haiku-5-5', 'a2')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  await step(1, 'claude-sonnet-5', 'a2')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  expect(stepped.length).toBe(2)

  // An agent whose own kind names an older Opus runs on the newest Opus, step after step
  await $.agent.spawn({ ...spawn, description: 'Old kind', prompt: 'look again', parentAgentId: 'a1' } as never)
  await step(0, 'claude-opus-4-1', 'a3')
  await step(1, 'claude-opus-4-1', 'a3')
  expect(stepped.slice(-2)).toEqual(['claude-opus-5-5', 'claude-opus-5-5'])

  // The chat's own thread runs on the model the person picked for it, whichever that is
  await step(0, 'claude-opus-4-8', '')
  expect(stepped.at(-1)).toBe('claude-opus-4-8')

  // An agent whose start the mod did not see (a workflow's, before this copy loaded) is left where the app sent it, Haiku too
  await step(0, 'claude-haiku-5-5', 'w1')
  expect(stepped.at(-1)).toBe('claude-haiku-5-5')
  expect(files.get(`${MEMORY}/log.md`)).toContain('work w1 was sent to Haiku 5.5 by the app: its steps stay there')
})

test('work the person moved to a model of their own is ended too when a safety flag would move it to an older model', async ($, on) => {
  const { stepped } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'model-a1')
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')
  for await (const _ of $.turn.step({ turnId: 't', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-sonnet-5-5'])
  for await (const _ of $.turn.step({ turnId: 't', index: 1, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-sonnet-5-5'])
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
  expect((await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')).toContain("Claudopus doesn't run tasks on this model")
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
  expect((await gone.find({ type: 'Text' }))?.text).toBe('This task is no longer available.')
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
  expect((await tab.find({ type: 'Text', text: /^Reading the conversation/ }))?.text).toBe('Reading the conversation…')
  give()
  expect((await until(async () => (await tab.find({ type: 'Markdown' }))?.props.text))).toBe('The nostril is closed.')
  expect(await tab.find({ type: 'Text', text: /^Reading the conversation/ })).toBeUndefined()
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

test('work that finishes comes to the top for two seconds: two at once, one ended while the panel was closed, one that reports twice', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|eyes/.test(one.text)).map(one => one.text)
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label

  // Two that end together both go to the top, green, the newer first, over the one still working; neither is under Finished yet
  await clock.advance(400)
  await end('a1', 't1')
  await clock.advance(100)
  await end('a3', 't3')
  expect(await titles()).toEqual(['Draw the eyes', 'Fix the nose', 'Check the ears'])
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
  expect(svgs.map(svg => svg.alt)).toEqual(['Working', 'Working', 'Ended'])
  expect(svgs[0]?.source).toContain('d="M9 0V20M9 10H22M27 15V20"')
  expect(svgs[1]?.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"')
  expect(svgs[1]?.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>')
  // A row at work has its slow ring round the dot; the closing row of those that ended is still
  expect(svgs[1]?.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>')
  expect(svgs[2]?.source).not.toContain('<animate')
  expect(svgs[2]?.source).toContain('d="M9 0V5Q9 10 14 10H22"')
  expect(svgs[2]?.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>')
  // No row names a model, and none has the three dots: only the card itself does
  expect((await drawn.findAll({ type: 'Svg' })).filter(svg => svg.props.alt === 'Working now')).toHaveLength(1)
  await drawn.unmount()
  // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 20 }, surface: 'desktop' } as never)
  expect((await keyed(narrow, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  await narrow.unmount()

  // The work's Details lists every helper, ended or not, as the same tree
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  expect((await tab.find({ type: 'Text', text: / helpers? working$/ }))?.text).toBe('2 of 4 helpers working')
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
  // (a run's name is a button, as a press opens its output)
  const texts = async (view: { findAll: (q: { type: 'Text' | 'Button' }) => Promise<{ text: string; props: Record<string, unknown> }[]> }) => [...(await view.findAll({ type: 'Text' })).map(one => one.text), ...(await view.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  // The work's Details: its own server first under it, then the helper with all five of its downloads, none folded into a count
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  // In drawing order, with the tree's lines: the server on the work's own line, the helper, its downloads one level under it
  const rows = (await tab.findAll({ type: 'Text' })).map(one => one.text)
  const picked = (await texts(tab)).filter(text => /^Serve the site|^Download weights/.test(text))
  // the server on the work's own line, the helper's downloads a level under it
  expect(rows.filter(text => /^ *[├└]───$/.test(text)).slice(0, 1)).toEqual(['├───'])
  expect(picked.sort()).toEqual([...[1, 2, 3, 4, 5].map(n => `Download weights ${n}`), 'Serve the site'])
  const shown = await texts(tab)
  expect(shown.some(text => /more (running|jobs)/.test(text))).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Helpers and commands$/ }))?.props.bold).toBe(true)
  expect(shown).toContain('6 commands running · 1 helper working')
  await tab.unmount()
  // The card on the list still folds the helper's jobs past JOBS_SHOWN into one row
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  expect((await texts(list)).filter(text => /Download weights/.test(text))).toHaveLength(3)
  expect((await texts(list)).some(text => /^2 more commands/.test(text))).toBe(true)
  await list.unmount()
  // The helper's own Details, with no helpers of its own, shows what it has running
  const helperTab = await $.ui.mount({ ...LIST, requestId: 'work-a2', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const its = await texts(helperTab)
  expect((await helperTab.find({ type: 'Text', text: /^Running$/ }))?.props.bold).toBe(true)
  expect(its).toContain('5 commands running')
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
  expect((await tab.find({ type: 'Text', text: / helpers? working$/ }))?.text).toBe('1 of 101 helpers working')
  const names = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(names.includes('Measure 5')).toBe(false)
  expect(names.includes('Measure 6')).toBe(true)
  await tab.unmount()
})

test('a long run shows how far it is from what it prints: how much of how much, its percent and speed, and whether output still comes', SLOW, async ($, on) => {
  let output = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r  5 1024M    5 51.2M    0     0  10.2M      0  0:01:40  0:00:05  0:01:35 10.5M\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M'
  let wroteAt = 0
  let isAlive = true
  const { clock, killed, appended } = world(on, { jobs: { output: () => output, wroteAt: () => wroteAt, alive: () => isAlive } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  // The mocked clock starts where the world sets it
  let now = 1_700_000_000_000
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' } as never)
  wroteAt = now
  await advance(20_000)
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  const texts = async (columns = 140) => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface: 'terminal' } as never)
    // (a run's name is a button, as a press opens its output)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  // How much of how much leads the side, its percent in blue, its speed and the time left curl gives, and never when it printed
  expect(await until(async () => ((await texts()).includes('460 MB of 1 GB · ') || undefined))).toBe(true)
  const shown = await texts()
  expect(shown).toContain('45%')
  expect(shown).toContain(' · 10.5 MB/s · 55s left')
  // While it gives word nothing is said of when
  expect(shown.some(text => /active|ago/.test(text))).toBe(false)
  // In a narrower panel its speed gives way first
  expect((await texts(100)).some(text => /^460 MB(\/| of )1 GB · $/.test(text))).toBe(true)
  // The work's own line, as its scripts are told to print it
  output = 'loading\nprogress: 3/6 steps fitting\nframe 12 done\n'
  wroteAt = now
  await advance(20_000)
  expect(await until(async () => ((await texts()).some(text => text.startsWith('3 of 6 steps · ')) || undefined))).toBe(true)
  // Quiet for long, in words
  wroteAt = now - 15 * 60_000
  await advance(20_000)
  expect(await until(async () => ((await texts()).some(text => / · nothing printed for 1[5-9]m/.test(text)) || undefined))).toBe(true)
  // A raw line in plain words, with its log time and state code left out, then its sign of life; 16 Nov the row read
  // "35 MB · [run 11:27:50] waiting for the machine to start (Running)"
  output = 'starting\n[run 11:27:50] waiting for the machine to start (Running)\n'
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  const plain = await until(async () => (await texts()).find(text => /(^| · )waiting for the machine to start$/.test(text)))
  expect(plain).toBeDefined()
  expect((await texts()).some(text => /\[run|Running\)|\d MB ·/.test(text))).toBe(false)
  // A wait's count of tries is how far it is, its words that say its name again are left out, and when it last tried changes
  output = 'progress: 6 tries waiting for the CT scans\nprogress: 7 tries waiting for the CT scans\n'
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^7 tries$/.test(text)))).toBeDefined()
  // Quiet for a minute or two it says nothing of it: tests, builds and installs go that quiet and are fine
  wroteAt = now - 100_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^7 tries$/.test(text)))).toBeDefined()
  expect((await texts()).some(text => /nothing printed/.test(text))).toBe(false)
  // Silent for three minutes it says so, plainly, and Stop on its row ends its process and tells the work it was stuck
  wroteAt = now - 185_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^7 tries · nothing printed for 3m [1-3]0s$/.test(text)))).toBeDefined()
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const stop = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))
  expect(stop).toBeDefined()
  await list.press({ key: stop?.key ?? '' })
  await list.unmount()
  expect(await until(async () => killed.includes('48213') || undefined)).toBe(true)
  isAlive = false
  // (quiet three minutes, it is told it looked stuck)
  expect(await until(async () => appended.find(line => /^a1: .*stopped your command "Fetch the CT scans" from the panel because it looked stuck: it had printed nothing for 3m/.test(line)))).toBeDefined()
  await advance(5_000)
  // (its row goes; the card's own line says it was stopped until the work writes again)
  expect(await until(async () => ((await texts()).every(text => !/^Fetch the CT scans/.test(text) || text === 'Fetch the CT scans was stopped') || undefined))).toBe(true)
})

test('a percent moves up on its row within seconds of being printed, and a quiet of under three minutes says nothing (16 Nov: "nothing printed for 5 seconds, 10 seconds", while the percent sat still)', async ($, on) => {
  const meter = (pct: number) => `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r ${pct} 1024M   ${pct}  ${pct * 10}M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M`
  let output = meter(45)
  let now = 1_700_000_000_000
  let wroteAt = now
  const { clock } = world(on, { jobs: { output: () => output, wroteAt: () => wroteAt } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  // (in short steps, as the panel's every-second look runs once for each advance of the clock; the list is followed every 20)
  const advance = async (ms: number) => {
    for (let left = ms; left > 0; left -= 3_000) {
      now += Math.min(3_000, left)
      await clock.advance(Math.min(3_000, left))
    }
  }
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const all = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return all
  }
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' } as never)
  await advance(21_000)
  expect(await until(async () => ((await texts()).includes('45%') || undefined))).toBe(true)
  // curl rewrites its meter: the row has the new percent before the list is next followed
  output = meter(52)
  wroteAt = now
  await advance(15_000)
  expect(await texts()).toContain('52%')
  // quiet for half a minute after, its percent stands with nothing said of the quiet
  await advance(30_000)
  const quiet = await texts()
  expect(quiet).toContain('52%')
  expect(quiet.some(text => /nothing printed/.test(text))).toBe(false)
})

test('a run whose output cannot be found says so after three minutes, so a blank row is never taken for one that moves', async ($, on) => {
  const { clock } = world(on)
  on('session.cwd', () => ({ value: '/repo' }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' } as never)
  await clock.advance(190_000)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const shown = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  // Its name, its kind already said in the work's own words
  expect(shown.some(text => /^Fetch the CT scans/.test(text))).toBe(true)
  expect(shown.some(text => /^nothing printed for 3m [01]0s$/.test(text))).toBe(true)
  await list.unmount()
})

test('a run of a work\'s own wakes it the moment it ends: any command that only waits, the work\'s or its helper\'s, is refused in one sentence, the work is told it ended, and its card no longer says how far it was (16 Nov an upload read 100% beside "about 40% done"; a helper polled for a file its own script wrote)', SLOW, async ($, on) => {
  let isAlive = true
  const talk: unknown[] = []
  const { clock, appended, resumed, stopped, stepped } = world(on, { talk, jobs: { output: () => 'progress: 8/8 GB uploading\n', wroteAt: () => 1_700_000_000_000, alive: () => isAlive } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'upload the zips', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Upload the zips', prompt: 'upload the zips' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'u1', agentId: 'a1', command: 'cd /w && nohup curl -T zips.zip https://example.com/up > upload.log 2>&1 & echo $!', description: 'Upload both zips to the folder (about 15 min)' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'The upload is about 40% done; it should finish in about 15 minutes.' } as never)
  await clock.advance(20_000)
  // A wait on it, by its process or its log, does not run
  for (const command of ['for i in $(seq 1 55); do kill -0 48213 2>/dev/null || break; echo "progress: $i/55 tries waiting for the upload"; sleep 10; done; grep -E "ERROR|Copied" /w/upload.log | tail -5', "until ! pgrep -f 'curl -T zips.zip' >/dev/null; do echo \"progress: 1 tries\"; sleep 10; done"]) {
    const r = (await $.tool.call({ tool: 'Bash', tool_use_id: 'w1', agentId: 'a1', command, description: 'Wait for the upload to finish (about 9 min)', run_in_background: true } as never)) as { deny?: string }
    expect(r.deny).toMatch(/^Not run: this command only waits, and nothing you start may only wait\. Your own commands, in the background or detached, wake you the moment they end/)
  }
  // A Monitor that only waits for it to end is refused the same
  expect(((await $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'while kill -0 48213; do sleep 10; done', description: 'Wait for the upload' } as never)) as { deny?: string }).deny).toMatch(/^Not run: this command only waits/)
  // A sifter left going beside it, which ends with nothing: let through while the upload goes
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'g1', agentId: 'a1', command: 'ugrep --line-buffered wrote', description: 'Run a look for written files', run_in_background: true } as never)) as { deny?: string }).deny).toBeUndefined()
  // A tail that waits for one line is a wait for that line
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'w4', agentId: 'a1', command: 'tail -f /w/upload.log | grep -m1 Copied', description: 'Wait for the first file copied', run_in_background: true } as never)) as { deny?: string }).deny).toMatch(/^Not run: this command only waits/)
  // A tail that follows its log never ends and tells the work nothing
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'w3', agentId: 'a1', command: 'tail -f /w/upload.log | grep --line-buffered ERROR', description: 'Watch the upload for errors', run_in_background: true } as never)) as { deny?: string }).deny).toMatch(/^Not run: this only follows a log and would never end/)
  // A wait for a line in its log, or a look once, still runs
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'a1', command: 'tail -5 /w/upload.log', description: 'Run a look at the upload' } as never)) as { deny?: string }).deny).toBeUndefined()
  const line = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return texts
  }
  expect((await line()).some(text => /about 40% done/.test(text))).toBe(true)
  // It ends: the work is told at once, and the card says so in place of the line written while it ran
  isAlive = false
  await clock.advance(20_000)
  expect(await until(async () => appended.find(one => one === 'a1: Your command "Upload both zips to the folder" has ended. Look at how it ended in its log, /w/upload.log, and carry on with the next step now.'))).toBeDefined()
  expect(await until(async () => ((await line()).some(text => text === 'Upload both zips to the folder has ended') || undefined))).toBe(true)
  expect((await line()).some(text => /about 40% done/.test(text))).toBe(false)
  // The sifter outlived what it watched: stopped a minute on, and the work told why
  await clock.advance(60_000)
  expect(await until(async () => stopped.includes('bg-g1') || undefined)).toBe(true)
  expect(await until(async () => appended.find(one => /^a1: Claudopus stopped your command ".*": it only watched commands that have all ended\./.test(one)))).toBeDefined()
  // Told once, and a new line of the work's own stands again
  await clock.advance(20_000)
  expect(appended.filter(one => /has ended\. Look at how it ended/.test(one))).toHaveLength(1)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'The upload is done; I am checking the files.' } as never)
  expect(await until(async () => ((await line()).some(text => /I am checking the files/.test(text)) || undefined))).toBe(true)
  // Work that ended its step with a run still going is started again the moment it ends, with a message
  isAlive = true
  await $.tool.call({ tool: 'Bash', tool_use_id: 'u2', agentId: 'a1', command: 'cd /w && nohup curl -T rest.zip https://example.com/up > rest.log 2>&1 & echo $!', description: 'Upload the rest (about 10 min)' } as never)
  // The engine, which cannot see that run, presses it for its report as it ends its step: the press is answered with no model, and
  // its step ends (16 Nov: 30 presses in 25 minutes ended a task early). A report in words before the press still goes on to it
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  const press = async (said: string) => {
    talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: said }] }, PRESS)
    const before = stepped.length
    const texts: string[] = []
    for await (const chunk of $.turn.step({ turnId: 't1', index: 1, model: 'm', messageCount: 2, agentId: 'a1' })) if (chunk.kind === 'text') texts.push((chunk as { text: string }).text)
    return [stepped.length - before, texts]
  }
  expect(await press('The rest uploads; I am woken when it ends.')).toEqual([0, ['My own work is still going; I am started again when it is done, and give my report then.']])
  expect(await press(`Both uploads are done. ${'Every file arrived whole. '.repeat(30)}`)).toEqual([1, ['Looking at the nose.']])
  await $.turn.complete({ answer: 'The rest uploads; I am woken when it ends.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  expect(resumed.some(one => one.startsWith('a1: '))).toBe(false)
  isAlive = false
  await clock.advance(20_000)
  expect(await until(async () => resumed.find(one => one === 'a1: Your command "Upload the rest" has ended. Look at how it ended in its log, /w/rest.log, and carry on with the next step now.'))).toBeDefined()
  // So is a helper's, whatever it waits for: the 16 Nov helper's waits on its own script's output and process, a page, a time
  await $.agent.spawn({ ...spawn, description: 'Loaders for every open head set', prompt: 'load', parentAgentId: 'a1' } as never)
  const O = '/private/tmp/claude-501/x/tasks'
  for (const command of [
    `n=0; until grep -q "Counter" ${O}/b1it4kmrm.output; do n=$((n+1)); echo "progress: $n tries waiting for fit timing"; sleep 8; [ $n -gt 60 ] && break; done; cat ${O}/b1it4kmrm.output | tail -12`,
    `n=0; while pgrep -f "sets.py" >/dev/null; do n=$((n+1)); echo "progress: $n tries waiting for sheets"; sleep 8; [ $n -gt 60 ] && break; done; ls -la ~/sets | head; cat ${O}/bg253ddbk.output`,
    'until curl -s localhost:3000 >/dev/null; do echo "progress: 1 tries"; sleep 2; done',
    'sleep 300; cat out.log',
  ]) {
    const deny = ((await $.tool.call({ tool: 'Bash', tool_use_id: 'h1', agentId: 'a2', command, description: 'Wait for the sheets', run_in_background: true } as never)) as { deny?: string }).deny ?? ''
    expect([command, deny.slice(0, 32)]).toEqual([command, 'Not run: this command only waits'])
    // a helper, which is not started again, is told to hand back what it waits for, never to call wake_me (a reader and a check have no such tool)
    if (command.startsWith('sleep')) expect([deny.includes('hand back what you found and what you wait for'), deny.includes('wake_me')]).toEqual([true, false])
  }
  // and the wait the old rules gave for helpers, said for what it waits on
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'h2', agentId: 'a1', command: "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", description: 'Wait for the three builders' } as never)) as { deny?: string }).deny).toMatch(/^Not run: this command only waits for your helpers, .*even after you end your step/)
  // A helper's real work runs
  expect(((await $.tool.call({ tool: 'Bash', tool_use_id: 'h3', agentId: 'a2', command: 'cd /w && python sets.py', description: 'Run the sheets' } as never)) as { deny?: string }).deny).toBeUndefined()
})

test('every run under a card says how it stands: a command held open shows its progress, one that printed nothing says so, a watch its last event; 15 Nov rows said only "updated 9m ago"', SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  let heldAt = 0
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  const meter = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M'
  const outputs: Record<string, () => string> = { [`${TASKS}/bg-r1.output`]: () => '', [`${TASKS}/mon-m1.output`]: () => 'series arrived\nwrote vsd-02.png\n', [`${TASKS}/bheld.output`]: () => meter }
  const wrote: Record<string, () => number> = { [`${TASKS}/bg-r1.output`]: () => 1_700_000_000_000, [`${TASKS}/mon-m1.output`]: () => now - 30_000, [`${TASKS}/bheld.output`]: () => now - 2_000 }
  const etime = () => {
    const s = Math.max(1, Math.floor((now - heldAt) / 1000))
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }
  const { clock, held, shown: opened, files } = world(on, {
    jobs: {
      output: file => outputs[file]?.() ?? '',
      wroteAt: file => wrote[file]?.() ?? 0,
      ps: () => (heldAt ? `  4242   900 S    ${etime()} /bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'curl -L -o scans.zip https://example.com/scans.zip # hold dl' < /dev/null && pwd -P >| /tmp/claude-1-cwd` : ''),
      fd: () => `4242 ${TASKS}/bheld.output\n`,
    },
  })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'redraw and fetch', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Redraw and fetch', prompt: 'go' } as never)
  // A script that sends all it prints to files of its own, a watch, and a download held open, the work's own words for each
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r1', agentId: 'a1', command: 'bash /s/round3b_figs.sh', description: 'Redraw all pictures', run_in_background: true } as never)
  await $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'tail -n0 -F sheet.log', description: 'Azure jobs finishing' } as never)
  heldAt = now
  const call = $.tool.call({ tool: 'Bash', tool_use_id: 'h1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip # hold dl', description: 'Download the CT scans (about 3 min)' } as never)
  // The mod takes as the command held open only a shell started within 20 s of when the call began, as its hook saw it: the clock
  // moves only once the call is running, else on a slow machine (GitHub's) the hook ran a few steps late and no shell matched
  expect(await until(async () => held.has('dl') || undefined)).toBe(true)
  // Within seconds of ten it is a row of its own with how it goes (it took two minutes, and commands ran with nothing shown)
  for (let n = 0; n < 3; n++) await advance(5_000)
  const early = await until(async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all.includes('Download the CT scans') && all.some(text => /^460 MB of 1 GB|^working$/.test(text)) ? all : undefined
  })
  expect(early).toBeDefined()
  // Five minutes, past the 1.5 times its three minutes where it turns amber, in steps of 5 s: the stand-in ps ages the shell from
  // `now`, which runs a step ahead of the clock while a step's timers fire. No longer: each second the clock moves runs the
  // panel's every-second look, and on GitHub's Mac nine minutes took past the time the kit lets a held call run, which ended it
  // (57 steps here, as three were taken above for its row at ten seconds)
  for (let n = 0; n < 57; n++) await advance(5_000)
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
    // (a run's name is a button, as a press opens its output)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  const shown = (await until(async () => {
    const all = await texts()
    return all.includes('460 MB of 1 GB · ') ? all : undefined
  })) ?? []
  // The download held open: how much of how much, its percent, speed and time left, as curl printed them, and nothing of when
  // Named in the work's own form: its kind already said, how long it should take beside its time, in amber well past it
  expect(shown).toContain('Download the CT scans')
  // past it, the run's own time left makes a fresh expectation, never the old figure as if it held
  expect(shown).toContain('5m 00s of ~5m 53s')
  expect(shown.some(text => /of ~3m/.test(text))).toBe(false)
  expect(shown).toContain(' · 10.5 MB/s · 55s left')
  // The script that printed nothing says so and for how long, never that it was updated
  expect(shown.some(text => /^Command · Redraw all pictures/.test(text))).toBe(true)
  expect(shown.some(text => /^nothing printed for 5m 00s$/.test(text))).toBe(true)
  expect(shown.some(text => /updated/.test(text))).toBe(false)
  // The watch, its last event and when it came
  expect(shown.some(text => /^Watch · Azure jobs finishing/.test(text))).toBe(true)
  expect(shown).toContain('watching')
  // its event's file name is never shown
  expect(shown.some(text => /vsd-02/.test(text))).toBe(false)
  // A press on a run's name shows its output whole in a Terminal window, as it goes on
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
  const before = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Command · Redraw all pictures')?.key ?? ''
  await list.press({ key: before })
  const argv = await until(async () => opened.find(one => String(one[1]).endsWith('/output.command')))
  expect(files.get(String(argv?.[1]))).toContain(`exec tail -n 1000 -F '${TASKS}/bg-r1.output'`)
  // and moves the buttons' keys, so the panel is not pulled back to the row it pressed
  const after = await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Command · Redraw all pictures' && b.key !== before)?.key)
  expect(after).toBeDefined()
  await list.unmount()
  held.get('dl')?.('')
  await call
})

test('only runs really running are listed: a watch the engine killed at its time limit, a command that failed and one that finished leave at once, counted on the closing row and told apart in Details; 15 Nov three "[killed]" watches stayed with their clocks running', SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  const born = now
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  const MIN = 60_000
  // The 15 Nov card: two alike watches set 30 minutes, one more, and the wait that was really still going
  const outputs: Record<string, () => string> = {
    [`${TASKS}/mon-m1.output`]: () => (now - born >= 30 * MIN ? '\n[killed]\n' : ''),
    [`${TASKS}/mon-m2.output`]: () => (now - born >= 30 * MIN ? '\n[killed]\n' : ''),
    [`${TASKS}/bg-w1.output`]: () => '',
    [`${TASKS}/bg-f1.output`]: () => (now - born >= 3 * MIN ? 'Traceback: boom\n\n[exited with code 1]\n' : ''),
    [`${TASKS}/bg-k1.output`]: () => (now - born >= 2 * MIN ? 'all good\n\n[exited with code 0]\n' : ''),
    // one past its time that prints how long it has left, and one past its time that does not
    [`${TASKS}/bg-p1.output`]: () => 'progress: 3/6 steps fitting eta 4m\n',
    [`${TASKS}/bg-p2.output`]: () => 'drawing frames\n',
  }
  const { clock } = world(on, { jobs: { output: file => outputs[file]?.() ?? '', wroteAt: () => now - 2_000 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'save the videos', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Save the videos', prompt: 'go' } as never)
  const watch = (id: string) => $.tool.call({ tool: 'Monitor', tool_use_id: id, agentId: 'a1', command: 'tail -f /s/screen.log | grep --line-buffered "pass 1 done"', description: 'Wait for first screening pass (about 35 min)', timeout_ms: 3_000_000, persistent: false } as never)
  await watch('m1')
  await watch('m2')
  const bg = (id: string, command: string, description: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command, description, run_in_background: true } as never)
  await bg('w1', 'python3 screen.py --details', 'Wait for the details screening to finish (about 55 min)')
  await bg('f1', 'python3 fetch.py', 'Run the fetch of the list')
  await bg('k1', 'python3 tidy.py', 'Run the tidy up')
  await bg('p1', 'python3 fit.py', 'Run the fit (about 20 min)')
  await bg('p2', 'python3 frames.py', 'Run the drawing of frames (about 20 min)')
  const texts = async (surface = 'terminal') => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface } as never)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  for (let n = 0; n < 10; n++) await advance(MIN)
  // Before the limit both watches run, as one row of two
  expect((await texts()).some(text => /^Wait for first screening pass ×2$/.test(text))).toBe(true)
  for (let n = 0; n < 39; n++) await advance(MIN)
  const shown = (await until(async () => {
    const all = await texts()
    return all.some(text => /^4 commands ended/.test(text)) ? all : undefined
  })) ?? []
  // The watches the engine killed at their limit, the failed and the finished command are gone from the tree, and no clock runs for them
  expect(shown.some(text => /\[killed\]/.test(text))).toBe(false)
  expect(shown.some(text => /screening pass ×2|Run the fetch|Run the tidy/.test(text))).toBe(false)
  // The closing row counts them and says, in words, how many did not finish well
  expect(shown).toContain('4 commands ended · 1 failed, 2 timed out')
  // The wait still running stays, within its time
  expect(shown).toContain('Wait for the details screening to finish')
  expect(shown).toContain('49m 00s of ~55m')
  // Past its time: a fresh expectation from the time left it prints; or else plainly past it, never the old figure as if it held
  expect(shown).toContain('49m 00s of ~53m')
  expect(shown).toContain('49m 00s · past ~20m')
  expect(shown.some(text => /of ~20m/.test(text))).toBe(false)
  // Details names each ended run with how it ended
  const pane = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
  const details = (await pane.findAll({ type: 'Text' })).map(one => one.text)
  await pane.unmount()
  expect(details).toContain('Commands ended')
  expect(details.filter(text => text === 'Wait for first screening pass').length).toBe(2)
  expect(details.filter(text => /^timed out after (29|30)m \d\ds · /.test(text)).length).toBe(2)
  expect(details.some(text => /^failed \(exit code 1\) after \dm \d\ds · /.test(text))).toBe(true)
  expect(details.some(text => /^finished after \dm \d\ds · /.test(text))).toBe(true)
  // Later the wait passes its time too, with nothing printed: it says so
  for (let n = 0; n < 8; n++) await advance(MIN)
  expect((await texts()).some(text => /^57m 00s · past ~55m$/.test(text))).toBe(true)
})

test("a run's second line starts under its name, with the tree's lines carried down beside it: not the last, the last, a run under a helper, a narrow panel, on a desktop and in a terminal; 15 Nov the app dropped the lines and the line started left of the tree", SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  const outputs: Record<string, string> = { '/w/fit.log': 'loading\nprogress: 3/6 steps fitting\n', '/w/up.log': 'progress: 2/3 files uploading eta 4m\n', '/w/pics.log': 'progress: 10/40 pictures drawing\n' }
  const { clock } = world(on, { jobs: { output: file => outputs[file] ?? '', wroteAt: () => now - 2_000 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fit and upload', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fit and upload', prompt: 'go' } as never)
  const detach = (agentId: string, id: string, log: string, description: string) =>
    $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command: `cd /w && nohup python run.py > ${log} 2>&1 & echo $!`, description } as never)
  await detach('a1', 'n1', 'fit.log', 'Run the fit of every head')
  await detach('a1', 'n2', 'up.log', 'Upload the cleaned A, B, C over the old ones')
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Draw the pictures', prompt: 'go', parentAgentId: 'a1' } as never)
  await detach('a2', 'n3', 'pics.log', 'Run the drawing of every picture')
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Check the drawing', prompt: 'go', parentAgentId: 'a1' } as never)
  for (let n = 0; n < 6; n++) await advance(20_000)

  type Node = { type?: string; key?: string; text?: string; props: Record<string, unknown>; children?: unknown[] }
  const kids = (node: Node) => (node.children ?? []).filter(one => one && typeof one === 'object') as Node[]
  const all = (node: Node): Node[] => [node, ...kids(node).flatMap(all)]
  const textOf = (node: Node) => all(node).filter(one => one.type === 'Text').flatMap(one => (one.children ?? []).filter(part => typeof part === 'string')).join('')
  // Each run's two lines: the head (its lines and mark, its name, its time) and how it stands (the lines carried down, the words)
  const rows = async (surface: 'desktop' | 'terminal', columns: number) => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface } as never)
    const found = await until(async () => {
      const boxes = (await pane.findAll({ type: 'Box' })) as unknown as Node[]
      const runs = boxes.filter(one => /^job-list-job-/.test(String(one.key ?? '')) && kids(one).length === 2)
      return runs.length === 3 ? runs : undefined
    })
    const svgs = (await pane.findAll({ type: 'Svg' })) as unknown as Node[]
    await pane.unmount()
    return { runs: (found ?? []).map(one => ({ head: kids(kids(one)[0] as Node)[0] as Node, stand: kids(one)[1] as Node })), svgs }
  }
  for (const columns of [72, 40]) {
    // In a terminal: the carried lines are as wide as the head's lines and mark, so the words start in its name's column, a line
    // under each line that goes on and none under the last
    const { runs } = await rows('terminal', columns)
    expect(runs).toHaveLength(3)
    const seen = runs.map(({ head, stand }) => {
      const lines = textOf(head)
      const rails = textOf(kids(stand)[0] as Node)
      expect(rails.length).toBe(lines.length)
      expect([...rails].map((ch, n) => (ch === '│') === /[│├]/.test(lines[n] ?? ''))).toEqual([...rails].map(() => true))
      expect(stand.props.height).toBe(1)
      return lines
    })
    // every case is here: a run that is not the last, the last, and one under a helper with the work's own line going on beside it
    expect(seen.some(lines => lines.startsWith('├'))).toBe(true)
    expect(seen.some(lines => lines.startsWith('└') || /^│ └/.test(lines))).toBe(true)
    expect(seen.some(lines => /^│ [├└]/.test(lines))).toBe(true)
    // On a desktop: every picture has the words the app needs to draw it at all, and the carried lines are as wide as the head's
    const drawn = await rows('desktop', columns)
    for (const svg of drawn.svgs) {
      expect(String(svg.props.alt ?? '').trim()).not.toBe('')
      expect(Number(svg.props.width)).toBeGreaterThan(0)
    }
    for (const { head, stand } of drawn.runs) {
      const [lines] = all(head).filter(one => one.type === 'Svg')
      const [rails] = all(kids(stand)[0] as Node).filter(one => one.type === 'Svg')
      expect(rails?.props.width).toBe(lines?.props.width)
      // and the words move in by the step the name's own button pads it with
      expect(kids(stand)[1]?.props.paddingLeft).toBe('xs')
      expect(String(rails?.props.source)).toContain('<path')
    }
  }
  // How it stands is now: how far and how long is left, the run's own or worked out from its percent, never when it printed
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const shown = (await pane.findAll({ type: 'Text' })).map(one => one.text).join('\n')
  await pane.unmount()
  expect(shown).toContain('4m left')
  expect(shown).toMatch(/~2m left/)
  expect(shown).not.toMatch(/printed/)
  // A narrow panel keeps how long is left before the percent
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 40 }, surface: 'terminal' } as never)
  const tight = (await narrow.findAll({ type: 'Text' })).map(one => one.text)
  expect(tight).toContain('3/6 steps · ~2m left')
  // and one under a helper, with less room, keeps its count beside it
  expect(tight).toContain('10/40 · ~6m left')
  await narrow.unmount()
})
