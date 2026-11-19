// Results: kept, listed, opened, changed, put away and brought back, and rounds of one work

test('finished work leaves a result for good that asks nothing: its pictures copied, listed under Results, opened, changed from the one box above the chat by its own task, named to the chat, and its card dismissed', async ($, on) => {
  const { files, submitted, clock, copied, opened, resumed, kindTools } = world(on)
  // A write of the cards held until the test lets it land (below, a Dismiss)
  let isWriteHeld = false
  let writeHeld: (() => void) | undefined
  on('state.set', async (_, e, next) => {
    if (isWriteHeld && (e as { key?: string }).key === 'todos') ((isWriteHeld = false), await new Promise<void>(go => (writeHeld = go)))
    return next(e)
  })
  // Nothing is ever put in the chat's own box
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG')
  await $.session.start(start)
  await $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Weekly revenue', prompt: 'how is revenue doing' } as never)
  // A helper's answer is no report
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' } as never)
  await $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })

  // No kind of task has a tool that records questions for its result: a task asks on its card, before it finishes
  expect(Object.keys(kindTools).filter(kind => kindTools[kind]?.includes('mcp__claudopus__ask')).length).toBeGreaterThan(0)
  expect(Object.values(kindTools).flat().filter(tool => /waits/.test(tool))).toEqual([])
  // and a call to the old one is no tool of the mod's: the engine's own answer comes back, and nothing is kept with the result
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?'], agentId: 'a1' } as never)).result).toBe('ran')

  const report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.\n\nShall I send it to the team?'
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metaPath = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/meta.json')))
  const folder = (metaPath ?? '').replace('/meta.json', '')
  expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/)
  expect(files.get(`${folder}/report.md`)).toBe(`${report}\n`)
  expect(copied).toEqual([`${folder}/revenue.png`])
  const meta = JSON.parse(files.get(metaPath ?? '') ?? '{}') as { title: string; files: string[]; waiting?: unknown; question?: string; gist: string; folder: string }
  expect(meta.title).toBe('Weekly revenue')
  expect(meta.files).toEqual(['revenue.png'])
  // A question in its text is text: the result keeps no list of what waits
  expect(meta.waiting).toBeUndefined()
  expect(meta.question).toBeUndefined()
  expect(meta.gist).toBe('Revenue rose 12% this week to $4,210.')
  expect(meta.folder).toBe('/repo')
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  // A short answer with no picture is a confirmation, not a report
  await $.agent.spawn({ ...spawn, description: 'Save a rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a3', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })
  await clock.advance(10)
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  // The same report again is not kept twice
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })
  await clock.advance(10)
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // On the Claudopus pane the reports are one small button, with no mark
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 1')
  expect(await pane.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  // Its task is done, in green, and waits for nobody: no question from its result on the card, nothing to press for one, and the
  // header counts nothing as waiting
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Result ready|Shall I send it to the team/ })).toBeUndefined()
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === '#E5A50A').length).toBe(0)
  expect((await pane.findAll({ type: 'Button' })).filter(b => /^result-ask-/.test(b.key ?? '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)))).toEqual([])
  // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
  await pressed(pane, 'reports-open')
  expect(opened).toContain('reports')
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  // One line a row: its title, when, and Archive; nothing under it, and no mark
  expect((await keyed(list, `report-${folder.split('/').pop()}`))?.props.label).toBe('Weekly revenue')
  expect(await list.find({ type: 'Text', text: /^\d\d:\d\d$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /Revenue rose/ })).toBeUndefined()
  expect((await keyed(list, `archive-${folder.split('/').pop()}`))?.props.label).toBe('Archive')

  // A report opens as a pane of its own, named after it: what its task made, the finding, the report, how to go on from it
  await pressed(list, `report-${folder.split('/').pop()}`)
  const id = `report-${folder.split('/').pop()}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'desktop' } as never)
  const heads = (await one.findAll({ type: 'Text' })).filter(text => text.props.bold).map(text => text.text)
  // What its task made is right under its title, as tiles; its pictures are among them, so no Pictures part repeats them. Nothing
  // in it waits: no part of questions, and no answer to press
  expect(heads).toEqual(['Weekly revenue', 'Files', 'Summary', 'In full', 'Follow-up'])
  expect((await one.findAll({ type: 'Button' })).filter(b => /^report-say-/.test(b.key ?? '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)))).toEqual([])
  expect((await one.findAll({ type: 'Svg' })).map(svg => String(svg.props.alt))).toContain('revenue')
  expect((await one.find({ type: 'Markdown', text: /Revenue rose 12%/ }))?.props.text).toBe(`${report}\n`)
  // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
  expect(await keyed(one, 'report-page')).toBeUndefined()
  expect(await one.find({ type: 'Text', text: `${folder}/revenue.png` })).toBeUndefined()

  // Message opens the one box above the chat: its heading names the result, then the field, what Enter and Send do,
  // Send and Close. Nothing is typed in the result's own tab on the desktop, and nothing is put in the chat's own box
  const inputsOf = async (site: typeof bar) => (await site.findAll({ type: 'Input' } as never)) as { key?: string; props: Record<string, unknown> }[]
  const barLabels = async () => (await bar.findAll({ type: 'Button' })).map(b => String(b.props.label))
  expect((await keyed(one, 'report-carry'))?.props.label).toBe('Message')
  expect(await inputsOf(one as never)).toEqual([])
  expect(await inputsOf(bar)).toEqual([])
  await pressed(one, 'report-carry')
  const head = await until(async () => bar.find({ type: 'Text', text: /^↳ Message to/ }))
  expect(head?.text).toBe('↳ Message to “Weekly revenue”')
  const [field, ...moreFields] = await inputsOf(bar)
  expect(moreFields).toEqual([])
  expect(field?.props.placeholder).toBe('Type your message')
  expect(await bar.find({ type: 'Text', text: /^Enter sends/ })).toBeUndefined()
  expect((await barLabels()).filter(label => label === 'Send' || label === 'Close')).toEqual(['Send', 'Close'])
  expect(await inputsOf(one as never)).toEqual([])
  // (the button that opened it closes it again; opened once more, it is there as before)
  expect(await until(async () => ((await keyed(one, 'report-carry'))?.props.label === 'Close' ? true : undefined))).toBe(true)
  await pressed(one, 'report-carry')
  expect(await until(async () => ((await inputsOf(bar)).length ? undefined : true))).toBe(true)
  expect(await bar.find({ type: 'Text', text: /^↳ Message to/ })).toBeUndefined()
  await pressed(one, 'report-carry')
  const again = await until(async () => (await inputsOf(bar))[0])
  // What is sent from it goes to the result's own task, whose card is still there to carry on from: it is started again with the
  // person's words from the press's own hook (the clock has not moved), the chat is asked nothing, and the box goes
  const changes = () => resumed.filter(line => line.startsWith('a1: ') && line.includes('wrote to you from the card'))
  await bar.input({ key: again?.key ?? '', text: 'send it to the team' })
  expect(await until(async () => changes()[0])).toContain('in their own words: send it to the team\n')
  expect(changes()).toHaveLength(1)
  expect(submitted).toEqual([])
  expect(await until(async () => ((await inputsOf(bar)).length ? undefined : true))).toBe(true)
  // Its card is at work again at once, with Stop, and nothing waits
  expect(await until(async () => (await pane.find({ type: 'Button', key: 'stop-a1' })) ?? undefined)).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4', reason: 'answer' })
  await clock.advance(10)
  expect(await until(async () => ((await keyed(one, 'report-carry'))?.props.label === 'Message' ? true : undefined))).toBe(true)
  // In the terminal, whose bar draws no field, the result has its own field instead, and what is sent from it goes the same way
  const termed = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'terminal' } as never)
  expect(await keyed(termed, 'report-carry')).toBeUndefined()
  const own = (await inputsOf(termed as never)).filter(input => /^report-carry-reply-/.test(input.key ?? ''))
  expect(own.map(input => input.props.placeholder)).toEqual(['Type your message'])
  await termed.input({ key: own[0]?.key ?? '', text: 'check the refunds' })
  expect(await until(async () => changes()[1])).toContain('in their own words: check the refunds\n')
  await termed.unmount()
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4b', reason: 'answer' })
  await clock.advance(10)
  expect(submitted).toEqual([])
  expect(filled).toEqual([])
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)
  await bar.unmount()

  // The chat is told of the reports with each message, and reads one itself to answer from it
  const next = await $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })
  expect(next.context?.join('\n')).toContain('Results saved')
  expect(next.context?.join('\n')).toContain(`${folder}/report.md`)
  expect(next.context?.join('\n')).not.toContain('waiting on')
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: `${folder}/report.md` } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: `cat ${folder}/report.md` } as never)).deny).toContain('Start a fresh agent')

  // The person dismisses a card themselves, one that ended with its question open and one just done: it goes under Finished at
  // once and stays there across a redraw and a reload of the cards (18 Nov: "Either way, I should have the ability to just close it")
  const finishedCount = async () => Number(/Finished (\d+)/.exec(String((await keyed(cards, 'finished-fold'))?.props.label))?.[1] ?? 0)
  await $.agent.spawn({ ...spawn, description: 'Pick an opening', prompt: 'pick an opening' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Which opening should go out?', choices: ['A', 'B', 'C'] } as never)
  // (it hands in its result with the question still open: that, not its turn's end, ends a task)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h4', agentId: 'a4', message: 'Three openings are cut, A, B and C. Nothing is posted until one is picked.' } as never)
  await $.turn.complete({ agentId: 'a4', answer: '', durationMs: 1, isAborted: false, turnId: 't5', reason: 'answer' })
  await clock.advance(3_000)
  await pane.unmount()
  const cards = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await until(async () => (await cards.find({ type: 'Text', text: 'Which opening should go out?' })) ?? undefined))?.props.color).toBe('#E5A50A')
  expect(await cards.find({ type: 'Text', text: /^1 .*waiting for you/ })).toBeDefined()
  // (the two that ended before it stay up, with nothing under Finished, until each is dismissed)
  expect(await finishedCount()).toBe(0)
  for (const id of ['a1', 'a3']) await pressed(cards, `dismiss-${id}`)
  await clock.advance(2_100)
  await until(async () => ((await finishedCount()) === 2 ? true : undefined))
  const before = await finishedCount()
  expect(before).toBe(2)
  expect((await keyed(cards, 'dismiss-a4'))?.props.label).toBe('Dismiss')
  await pressed(cards, 'dismiss-a4')
  await clock.advance(2_100)
  expect(await until(async () => ((await cards.find({ type: 'Text', text: 'Which opening should go out?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => ((await finishedCount()) === before + 1 ? true : undefined))).toBe(true)
  expect(await cards.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await $.agent.spawn({ ...spawn, description: 'Save another rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a5', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't6', reason: 'answer' })
  expect(await until(async () => (await cards.find({ type: 'Text', text: '◐ Delivered' })) ?? undefined)).toBeDefined()
  await pressed(cards, 'dismiss-a5')
  await clock.advance(2_100)
  expect(await until(async () => ((await cards.find({ type: 'Text', text: '◐ Delivered' })) ? undefined : true))).toBe(true)
  expect(await until(async () => ((await finishedCount()) === before + 2 ? true : undefined))).toBe(true)
  // And while the person uses the panel scrolled down, where the drawing on screen is kept while they move: the card dismissed is
  // under Finished in the drawing right after the press, not once they have left the panel alone (18 Nov, the person: "when I
  // click this, the message should go below the finished")
  await $.agent.spawn({ ...spawn, description: 'Save a third rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a6', answer: 'The third rule is saved.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer' } as never)
  await cards.unmount()
  const used = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80, scroll: { offset: 20, bodyRows: 50 } }, surface: 'desktop' } as never)
  await ($.ui as any).scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(() => undefined)
  expect(await until(async () => (await keyed(used, 'dismiss-a6')) ?? undefined)).toBeDefined()
  // (the press's write of the cards is slow, as in the app under load: the app draws the panel again before it lands)
  isWriteHeld = true
  await used.press({ key: String((await keyed(used, 'dismiss-a6'))?.key) })
  await used.findAll({ type: 'Text' })
  expect(await keyed(used, 'dismiss-a6')).toBeUndefined()
  writeHeld?.()
  // (green where it stood for its two seconds, then under Finished, in the drawing kept while they use the panel too)
  await clock.advance(2_200)
  expect(await keyed(used, 'dismiss-a6')).toBeUndefined()
  expect(Number(/Finished (\d+)/.exec(String((await keyed(used, 'finished-fold'))?.props.label))?.[1])).toBe(before + 3)
  await used.unmount()
  // A redraw later, and a reload of the cards: all still under Finished, nothing back at the top
  await clock.advance(30_000)
  await $.session.start(start)
  await clock.advance(30_000)
  const after = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await after.find({ type: 'Text', text: /^Result ready/ })).toBeUndefined()
  expect(await after.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  expect(Number(/Finished (\d+)/.exec(String((await keyed(after, 'finished-fold'))?.props.label))?.[1])).toBe(before + 3)
  expect((await after.findAll({ type: 'Button' })).some(b => /^dismiss-/.test(b.key ?? ''))).toBe(false)
})

test('work started from a report keeps its own report linked to it, beside the older one on the same subject', async ($, on) => {
  const { files, clock, opened } = world(on)
  const old = { id: '20261101-0900-revenue', title: 'Revenue', subject: 'Revenue', at: 1_600_000_000_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Revenue was flat.', files: [], agent: '' }
  files.set(`${MEMORY}/reports/${old.id}/meta.json`, JSON.stringify(old))
  files.set(`${MEMORY}/reports/${old.id}/report.md`, 'Revenue was flat.\n')
  await $.session.start(start)
  await $.prompt.submit({ text: `Carry on from the report "Revenue", ${MEMORY}/reports/${old.id}/report.md: look again`, wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Revenue again', prompt: 'look again' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 'u1', name: 'Revenue', repo: '/shop', agentId: 'a1' } as never)
  await $.turn.complete({ agentId: 'a1', answer: `Revenue rose 5% since the last look.\n\n${'Each week is in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metas = await until(async () => {
    const all = [...files.keys()].filter(path => path.endsWith('/meta.json'))
    return all.length === 2 ? all : undefined
  })
  const fresh = JSON.parse(files.get((metas ?? []).find(path => !path.includes(old.id)) ?? '') ?? '{}') as { from?: string; subject: string; question?: string; folder: string }
  expect(fresh.from).toBe(old.id)
  expect(fresh.subject).toBe('Revenue')
  // Filed under the subject's own folder, not the chat's
  expect(fresh.folder).toBe('/shop')
  expect(fresh.question).toBeUndefined()
  // The older one is kept as it was
  expect(files.get(`${MEMORY}/reports/${old.id}/report.md`)).toBe('Revenue was flat.\n')

  // The same work reporting again, and the report it started from, are one row: the newest (the person's words start it again:
  // a task that is done reports again only from a run of its own)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “count the refunds too”' } as never)
  for await (const _ of $.turn.step({ turnId: 't2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  await $.turn.complete({ agentId: 'a1', answer: `Revenue rose 6% once the refunds are counted.\n\n${'Refunds are in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })
  await clock.advance(70_000)
  await until(async () => ([...files.keys()].filter(path => path.endsWith('/meta.json')).length === 3 ? true : undefined))

  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  const rows = (await list.findAll({ type: 'Button' })).filter(one => /^report-\d{8}/.test(one.key ?? ''))
  expect(rows.map(one => one.props.label)).toEqual(['Revenue again'])
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect(await list.find({ type: 'Text', text: /^1$/ })).toBeDefined()
  // No subject heading, no line under the row, no fold of rounds in the list
  expect((await list.findAll({ type: 'Text' })).filter(text => text.text === 'Revenue' || /Revenue rose/.test(text.text))).toHaveLength(0)
  expect((await list.findAll({ type: 'Button' })).some(one => /^rounds-/.test(one.key ?? ''))).toBe(false)

  // Opened, a report names what it started from and its other rounds; a fourth report pane closes the one opened longest ago
  const newest = (await list.findAll({ type: 'Button' })).filter(one => /^report-\d{8}/.test(one.key ?? ''))[0]
  await list.press({ key: newest?.key ?? '' })
  const id = `report-${String(newest?.key).replace(/^report-/, '').replace(/-\d+$/, '')}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Revenue again', bodyColumns: 80 }, surface: 'desktop' } as never)
  const kin = (await one.findAll({ type: 'Button' })).map(button => String(button.props.label))
  expect(kin.some(label => label.includes('Revenue · this result came from it'))).toBe(true)
  expect(kin.some(label => label.includes('Revenue again · earlier result'))).toBe(true)
})

test('a report opened when three are open closes the one opened longest ago', async ($, on) => {
  const { files, opened, closed } = world(on, { panes: ['claudopus', 'report-a', 'reports', 'report-b', 'report-c'] })
  const r = { id: 'd', title: 'Fourth', subject: 'Fourth', at: 1_600_000_000_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'It was found.', files: [], agent: '' }
  files.set(`${MEMORY}/reports/d/meta.json`, JSON.stringify(r))
  files.set(`${MEMORY}/reports/d/report.md`, 'It was found.\n')
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'report-d')
  await until(async () => opened.includes('report-d') || undefined)
  expect(closed.filter(id => id.startsWith('report-'))).toEqual(['report-a'])
})

test('a result saved earlier that lists questions shows them as plain text under Questions it left, with nothing to press; the list has no group of what waits, the chat is told of no question, and a change asked of it goes as the person\'s message', async ($, on) => {
  const { files, submitted, resumed } = world(on)
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const reps = [
    { ...base, id: 'old', title: 'Old', at: 1_600_000_000_000, gist: 'Old one.', question: 'Ship the old one?' },
    { ...base, id: 'two', title: 'Two', at: 1_600_000_100_000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?', choices: ['Public', 'Private'] }] },
    { ...base, id: 'ends', title: 'Ends', at: 1_600_000_200_000, gist: 'Ends asking.' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n\nShall I go on?\n`)
  }
  await $.session.start(start)
  // The panel counts none of them as waiting
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 3')
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await pane.unmount()
  // The list is newest first, whatever a result lists
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Button' })).filter(one => /^report-/.test(one.key ?? '')).map(one => one.props.label)).toEqual(['Ends', 'Two', 'Old'])
  // Opened, each shows what it listed as dim text between its title and its summary, in the order it listed them, and no button
  // but Archive and Continue; one that lists nothing has no such part
  const cases: { id: string; heads: string[]; left: string[] }[] = [
    { id: 'old', heads: ['Old', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Ship the old one?'] },
    { id: 'two', heads: ['Two', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Delete the folder?', 'Make it public?'] },
    { id: 'ends', heads: ['Ends', 'Summary', 'In full', 'Follow-up'], left: [] },
  ]
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  for (const one of cases) {
    const tab = await $.ui.mount({ ...LIST, requestId: `report-${one.id}`, props: { ...LIST.props, title: one.id, bodyColumns: 80 }, surface: 'desktop' } as never)
    const texts = await tab.findAll({ type: 'Text' })
    expect([one.id, texts.filter(text => text.props.bold).map(text => text.text)]).toEqual([one.id, one.heads])
    expect([one.id, texts.filter(text => /\?$/.test(String(text.text))).map(text => [text.text, text.props.dimColor, text.props.color])]).toEqual([one.id, one.left.map(text => [text, true, undefined])])
    expect([one.id, (await tab.findAll({ type: 'Button' })).map(button => String(button.props.label)).filter(label => !/ · /.test(label))]).toEqual([one.id, ['Archive', 'Message']])
    await tab.unmount()
  }
  // Message on a result whose task has no card left to carry on from: what is sent from the box above the chat goes as
  // the person's own message naming the result and its path, and nothing is put in the chat's own box
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-old', props: { ...LIST.props, title: 'Old', bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(tab, 'report-carry')
  expect((await until(async () => bar.find({ type: 'Text', text: /^↳ Message to/ })))?.text).toBe('↳ Message to “Old”')
  const field = ((await bar.findAll({ type: 'Input' } as never)) as { key?: string }[])[0]
  await bar.input({ key: field?.key ?? '', text: 'ship it after all' })
  expect(await until(async () => submitted[0])).toMatch(new RegExp(`^Continue from the result "Old" \\(13 Sep 2020, \\d\\d:26\\), ${MEMORY}/reports/old/report\\.md: ship it after all$`))
  expect(submitted).toHaveLength(1)
  expect(resumed).toEqual([])
  expect(filled).toEqual([])
  await tab.unmount()
  await bar.unmount()
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/old/report.md')
  expect(told).not.toContain('waiting on')
  expect(told).not.toContain('Ship the old one?')
  expect(told).not.toContain('Make it public?')
  expect(told).not.toContain('Shall I go on?')
})

test('a result archived with one press leaves the list, its tab, the count and the note, keeps its text, and comes back from the folded Archived row', async ($, on) => {
  const { files, closed } = world(on, { panes: ['claudopus', 'reports', 'report-b'] })
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [] }
  const reps = [
    { ...base, id: 'a0', title: 'Revenue', at: 1_600_000_000_000, gist: 'Revenue was flat.', agent: 'w1' },
    { ...base, id: 'a1', title: 'Revenue', at: 1_600_000_100_000, gist: 'Revenue rose.', agent: 'w1' },
    { ...base, id: 'b', title: 'Bots', subject: 'Bots', at: 1_600_000_200_000, gist: 'A bot wave.', agent: '', waiting: [{ text: 'Block them?' }] },
    { ...base, id: 'c', title: 'Kept', subject: 'Kept', at: 1_600_000_300_000, gist: 'Still here.', agent: '' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n`)
  }
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()

  // From its tab: the tab closes, and the text stays as it was
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-b', surface: 'desktop' } as never)
  await pressed(tab, 'report-archive')
  await until(async () => closed.includes('report-b') || undefined)
  expect(JSON.parse(files.get(`${MEMORY}/reports/b/meta.json`) ?? '{}').archived).toBe(1_700_000_000_000)
  expect(files.get(`${MEMORY}/reports/b/report.md`)).toBe('A bot wave.\n')
  expect(await until(async () => list.find({ type: 'Text', text: /^2$/ }))).toBeDefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 2')
  expect(await pane.find({ type: 'Text', text: '●' })).toBeUndefined()

  // From its row: every round of that work goes
  await pressed(list, 'archive-a1')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/a0/meta.json`) ?? '{}').archived ? true : undefined))
  expect(JSON.parse(files.get(`${MEMORY}/reports/a1/meta.json`) ?? '{}').archived).toBeDefined()
  expect(await until(async () => list.find({ type: 'Text', text: /^1$/ }))).toBeDefined()
  expect(await keyed(list, 'report-a1')).toBeUndefined()

  // The chat is told only of the one kept, and of no question
  const told = (await $.prompt.submit({ text: 'what is new', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/c/report.md')
  expect(told).not.toContain('reports/b/')
  expect(told).not.toContain('reports/a1/')
  expect(told).not.toContain('Block them?')

  // The way back: one folded row, unfolded to each with Bring back
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▸ Archived 2')
  expect(await keyed(list, 'unarchive-b')).toBeUndefined()
  await pressed(list, 'archived-fold')
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▾ Archived 2')
  await pressed(list, 'unarchive-b')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/b/meta.json`) ?? '{}').archived ? undefined : true))
  expect(await until(async () => list.find({ type: 'Text', text: /^2$/ }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▾ Archived 1')

  // An archived one opened from the row says so, with Bring back in place of Archive
  const old = await $.ui.mount({ ...LIST, requestId: 'report-a1', surface: 'desktop' } as never)
  expect((await keyed(old, 'report-archive'))?.props.label).toBe('Bring back')
  expect(await old.find({ type: 'Text', text: /· archived$/ })).toBeDefined()

  // One that came after the list was opened, archived and brought back, is listed in its place
  await pressed(pane, 'reports-open')
  const d = { ...base, id: 'd', title: 'Later', subject: 'Later', at: 1_600_000_400_000, gist: 'Came later.', agent: '' }
  files.set(`${MEMORY}/reports/d/meta.json`, JSON.stringify(d))
  files.set(`${MEMORY}/reports/d/report.md`, 'Came later.\n')
  await pressed(old, 'report-archive')
  const later = await $.ui.mount({ ...LIST, requestId: 'report-d', surface: 'desktop' } as never)
  await until(async () => ((await keyed(later, 'report-archive'))?.props.label === 'Archive' ? true : undefined))
  await pressed(later, 'report-archive')
  await until(async () => keyed(list, 'unarchive-d'))
  await pressed(list, 'unarchive-d')
  expect(await until(async () => keyed(list, 'report-d'))).toBeDefined()
})

test('the results list is one line a row, newest first with no group of what waits: the five newest, the rest folded, rounds of one work as one row, archived and told as one', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'A long line that no row shows.' }
  const at = (n: number) => 1_700_000_000_000 - n * 60_000
  const reps = [
    // A video in three rounds by three pieces of work, each started from the one before, each saved earlier with a question listed
    { ...base, id: 'v1', title: 'Explainer video', subject: 'Claude workflow', at: at(60), agent: 'w1', waiting: [{ text: 'Keep the first cut?' }] },
    { ...base, id: 'v2', title: 'Video second cut', subject: 'Claude workflow', at: at(40), agent: 'w2', from: 'v1', waiting: [{ text: 'Keep the second cut?' }] },
    { ...base, id: 'v3', title: 'Video third cut', subject: 'Claude workflow', at: at(20), agent: 'w3', from: 'v2', waiting: [{ text: 'Keep the third cut?' }] },
    // Two looks on one subject whose titles lead with it
    { ...base, id: 'i1', title: 'Old-chat index: first', subject: 'Old-chat index', at: at(300), agent: 'w4' },
    { ...base, id: 'i2', title: 'Old-chat index: second', subject: 'Old-chat index', at: at(290), agent: 'w5' },
    // Eight more on one broad subject, none joined
    ...Array.from({ length: 8 }, (_, n) => ({ ...base, id: `p${n}`, title: `Panel change ${n}`, subject: 'Claude workflow', at: at(100 + n), agent: `x${n}` })),
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n`)
  }
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Results', bodyColumns: 80 }, surface: 'desktop' } as never)
  const titles = async () => (await list.findAll({ type: 'Button' })).filter(one => /^report-/.test(one.key ?? '')).map(one => String(one.props.label))
  // 13 reports are 10 rows: the video one, the index one, eight panel changes
  expect(await list.find({ type: 'Text', text: /^10$/ })).toBeDefined()
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)).toEqual(['Results', 'Newest'])
  expect(await titles()).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3'])
  // Nothing under a title: no finding, no subject, no question it lists, no mark; the time, Archive
  expect(await list.find({ type: 'Text', text: /long line|waiting|Keep the|Claude workflow/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text', text: /^●$/ })).length).toBe(0)
  const rowBoxes = (await list.drawn()) as unknown as { props?: { key?: string; height?: number }; children?: unknown[] }
  const heights: number[] = []
  const walk = (n: unknown) => {
    const one = n as { props?: { key?: string; height?: number }; children?: unknown[] }
    if (one?.props?.key?.startsWith('entry-')) heights.push(one.props.height ?? 0)
    for (const child of one?.children ?? []) walk(child)
  }
  walk(rowBoxes)
  expect(heights).toEqual([1, 1, 1, 1, 1])
  // The rest is one row that unfolds
  expect((await keyed(list, 'earlier-fold'))?.props.label).toBe('▸ Earlier 5')
  await pressed(list, 'earlier-fold')
  expect((await titles()).slice(5)).toEqual(['Panel change 4', 'Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second'])

  // The chat is told of the results, and of no question any of them lists
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/v3/report.md')
  expect(told).not.toContain('Keep the third cut?')
  expect(told).not.toContain('Keep the first cut?')
  expect(told).not.toContain('Keep the second cut?')

  // Opened, its earlier rounds are listed inside it
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-v3', surface: 'desktop' } as never)
  const kin = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(kin.some(label => label.includes('Video second cut · this result came from it'))).toBe(true)
  expect(kin.some(label => label.includes('Explainer video · earlier result'))).toBe(true)

  // Archived from its row, every round goes
  await pressed(list, 'archive-v3')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/v1/meta.json`) ?? '{}').archived ? true : undefined))
  expect(['v1', 'v2', 'v3'].map(id => Boolean(JSON.parse(files.get(`${MEMORY}/reports/${id}/meta.json`) ?? '{}').archived))).toEqual([true, true, true])
  expect(await until(async () => keyed(list, 'archived-fold'))).toBeDefined()
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▸ Archived 1')
})

test('work whose brief names one result on what it is about is a round of that work; one naming several, or one on something else, is not', async ($, on) => {
  const { files, clock } = world(on)
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'Done.', agent: 'w0' }
  for (const r of [{ ...base, id: '20261111-1853-explainer-video', title: 'Claudopus explainer video', at: 1 }, { ...base, id: '20261111-1700-logo', title: 'Draw the logo', at: 2 }]) (files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r)), files.set(`${MEMORY}/reports/${r.id}/report.md`, "Done.\n"))
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the video clearer', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Video second cut', prompt: `Start from ${MEMORY}/reports/20261111-1853-explainer-video/report.md` } as never)
  await $.agent.spawn({ ...spawn, description: 'Fix the panel', prompt: `Start from ${MEMORY}/reports/20261111-1853-explainer-video/report.md` } as never)
  await $.agent.spawn({ ...spawn, description: 'Video and logo', prompt: `Read ${MEMORY}/reports/20261111-1853-explainer-video/report.md and ${MEMORY}/reports/20261111-1700-logo/report.md` } as never)
  for (const id of ['a1', 'a2', 'a3']) await $.turn.complete({ agentId: id, answer: `Finished ${id}.\n\n${'It is in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: `t-${id}`, reason: 'answer' })
  await clock.advance(10)
  const metas = await until(async () => {
    const all = [...files.entries()].filter(([path]) => path.endsWith('/meta.json')).map(([, text]) => JSON.parse(text) as { agent: string; from?: string })
    return all.length === 5 ? all : undefined
  })
  expect(['a1', 'a2', 'a3'].map(id => metas?.find(one => one.agent === id)?.from ?? '')).toEqual(['20261111-1853-explainer-video', '', ''])
})

test('every button of the results list and of a result takes a new key whenever its drawing changes, and keeps it while nothing does, so the app never presses a handle that is gone', async ($, on) => {
  const { files, clock, opened } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const put = (r: { id: string; title: string; at: number; waiting?: { text: string }[] }) => {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify({ ...base, gist: 'It was found.', ...r }))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, 'It was found, and it is written here in full.\n')
  }
  put({ id: 'bucket', title: 'FaceIQ bucket migration plan', at: 1_699_000_000_000, waiting: [{ text: 'Start step 0?' }] })
  put({ id: 'header', title: 'Rethink the panel header', at: 1_699_000_100_000, waiting: [{ text: 'Reopen the M4 chat?' }] })
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Results', bodyColumns: 80 }, surface: 'desktop' } as never)
  const keys = async () => (await list.findAll({ type: 'Button' })).map(one => String(one.key))
  const first = await keys()
  expect(first.some(key => /^report-bucket-\d+$/.test(key))).toBe(true)
  // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
  await clock.advance(5000)
  expect(await keys()).toEqual(first)
  // A result arriving from another chat changes the drawing: no key stays, so the app takes every button afresh
  put({ id: 'fresh', title: 'Something new', at: 1_700_000_000_000 })
  // (a search of the memory reads the results again, as the panel's own look does)
  await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'found' } as never)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => /^report-fresh-\d+$/.test(String(one.key))) || undefined))).toBe(true)
  const after = await keys()
  expect(after.filter(key => first.includes(key))).toEqual([])
  // and a press on either named result opens it, drawn
  await pressed(list, 'report-bucket')
  expect(await until(async () => opened.includes('report-bucket') || undefined)).toBe(true)
  await pressed(list, 'report-header')
  expect(await until(async () => opened.includes('report-header') || undefined)).toBe(true)
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-header', props: { ...LIST.props, title: 'Rethink the panel header', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await tab.find({ type: 'Text', text: /^Rethink the panel header$/ })).toBeDefined()
  const tabKeys = (await tab.findAll({ type: 'Button' })).map(one => String(one.key))
  // The result's own tab follows the same rule: changed on another Mac, it changes with no press here, and every key moves
  expect(await tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })).toBeDefined()
  put({ id: 'header', title: 'Rethink the panel header', at: 1_699_000_100_000, waiting: [] })
  await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't2', query: 'found' } as never)
  expect(await until(async () => ((await tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })) ? undefined : true))).toBe(true)
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.key)).filter(key => tabKeys.includes(key))).toEqual([])
})
