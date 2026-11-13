// Results: kept, listed, opened, answered, put away and brought back, and rounds of one work

test('finished work leaves a report for good: its pictures copied, listed under Reports, opened, answered, and named to the chat', async ($, on) => {
  const { files, submitted, clock, copied, opened } = world(on)
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG')
  await $.session.start(start)
  await $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Weekly revenue', prompt: 'how is revenue doing' } as never)
  // A helper's answer is no report
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' } as never)
  // A helper records nothing over the work it answers to
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', items: ['Count again?'], agentId: 'a2' } as never)).result).toContain('A helper records nothing')
  await $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })

  const report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.'
  // What waits on the person is what the work recorded, wherever it is in the report, not its last line
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?', 'Post it in the channel too?'], agentId: 'a1' } as never)).result).toContain('Recorded 2')
  // A helper records nothing over the work it answers to
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metaPath = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/meta.json')))
  const folder = (metaPath ?? '').replace('/meta.json', '')
  expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/)
  expect(files.get(`${folder}/report.md`)).toBe(`${report}\n`)
  expect(copied).toEqual([`${folder}/revenue.png`])
  const meta = JSON.parse(files.get(metaPath ?? '') ?? '{}') as { title: string; files: string[]; waiting?: { text: string; answer?: string }[]; question?: string; gist: string; folder: string }
  expect(meta.title).toBe('Weekly revenue')
  expect(meta.files).toEqual(['revenue.png'])
  expect(meta.waiting).toEqual([{ text: 'Shall I send it to the team?' }, { text: 'Post it in the channel too?' }])
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

  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 1')
  expect(await pane.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
  await pressed(pane, 'reports-open')
  expect(opened).toContain('reports')
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect((await list.find({ type: 'Text', text: /^Waiting on you$/ }))?.props.bold).toBe(true)
  // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
  expect((await keyed(list, `report-${folder.split('/').pop()}`))?.props.label).toBe('Weekly revenue')
  expect(await list.find({ type: 'Text', text: /^\d\d:\d\d$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /Revenue rose/ })).toBeUndefined()
  expect((await keyed(list, `archive-${folder.split('/').pop()}`))?.props.label).toBe('Archive')

  // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
  await pressed(list, `report-${folder.split('/').pop()}`)
  const id = `report-${folder.split('/').pop()}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'desktop' } as never)
  const heads = (await one.findAll({ type: 'Text' })).filter(text => text.props.bold).map(text => text.text)
  expect(heads).toEqual(['Weekly revenue', 'Waiting on you', 'Finding', 'Pictures', 'In full', 'Carry on'])
  expect((await one.find({ type: 'Markdown', text: /Revenue rose 12%/ }))?.props.text).toBe(`${report}\n`)
  // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
  expect(await keyed(one, 'report-page')).toBeUndefined()
  expect(await one.find({ type: 'Text', text: `${folder}/revenue.png` })).toBeDefined()
  await pressed(one, 'report-carry')
  expect(filled[0]).toContain(`${folder}/report.md`)
  // Each waiting item has its own answers; answering one clears that one alone
  expect(await one.find({ type: 'Text', text: 'Post it in the channel too?' })).toBeDefined()
  await pressed(one, 'report-say-0-Yes')
  await until(async () => submitted.length > 0 || undefined)
  expect(submitted[0]).toContain('From the Claudopus panel: The person pressed "Yes" in answer to what the result "Weekly revenue"')
  expect(submitted[0]).not.toMatch(/\b(me|my)\b/)
  expect(submitted[0]).toContain('Shall I send it to the team?')
  await until(async () => (JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting?.[0]?.answer ? true : undefined))
  expect(JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting).toEqual([{ text: 'Shall I send it to the team?', answer: 'Yes' }, { text: 'Post it in the channel too?' }])
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()
  await until(async () => ((await one.find({ type: 'Text', text: 'Shall I send it to the team?' })) ? undefined : true))
  expect(await one.find({ type: 'Text', text: 'Post it in the channel too?' })).toBeDefined()
  // Not now clears the other and sends nothing
  await pressed(one, 'report-say-1-Not now')
  await until(async () => (JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting?.[1]?.answer ? true : undefined))
  expect(submitted).toHaveLength(1)
  await until(async () => ((await list.find({ type: 'Text', text: /^Waiting on you$/ })) ? undefined : true))
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeUndefined()
  expect(await one.find({ type: 'Text', text: /^Waiting on you$/ })).toBeUndefined()

  // The chat is told of the reports with each message, and reads one itself to answer from it
  const next = await $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })
  expect(next.context?.join('\n')).toContain('Results kept')
  expect(next.context?.join('\n')).toContain(`${folder}/report.md`)
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: `${folder}/report.md` } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: `cat ${folder}/report.md` } as never)).deny).toContain('Start a fresh agent')
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

  // The same work reporting again, and the report it started from, are one row: the newest
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
  expect(kin.some(label => label.includes('Revenue · this started from it'))).toBe(true)
  expect(kin.some(label => label.includes('Revenue again · earlier round'))).toBe(true)
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

test('an older report waits by its one question, a report that only ends with a question waits on nothing, and the chat is told each open item', async ($, on) => {
  const { files } = world(on)
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const reps = [
    { ...base, id: 'old', title: 'Old', at: 1_600_000_000_000, gist: 'Old one.', question: 'Ship the old one?' },
    { ...base, id: 'two', title: 'Two', at: 1_600_000_100_000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?' }] },
    { ...base, id: 'ends', title: 'Ends', at: 1_600_000_200_000, gist: 'Ends asking.' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n\nShall I go on?\n`)
  }
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^2$/ })).toBeDefined()
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('waits on: Ship the old one?')
  expect(told).toContain('waits on: Make it public?')
  expect(told).not.toContain('Delete the folder?')
  expect(told).not.toContain('Shall I go on?')
})

test('a result archived with one press leaves the list, its tab, the count and the note, waits on nothing, keeps its text, and comes back from the folded Archived row', async ($, on) => {
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
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()

  // From its tab: the tab closes, nothing in it waits, and the text stays as it was
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

  // The chat is told only of the one kept, and nothing waits
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
  expect(await until(async () => list.find({ type: 'Text', text: /^Waiting on you$/ }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^2$/ })).toBeDefined()
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

test('the results list is one line a row: what waits first, the five newest, the rest folded, rounds of one work as one row, archived and told as one', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'A long line that no row shows.' }
  const at = (n: number) => 1_700_000_000_000 - n * 60_000
  const reps = [
    // A video in three rounds by three pieces of work, each started from the one before: the newest waits, the older waits are its to ask again
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
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)).toEqual(['Results', 'Waiting on you', 'Recent'])
  expect(await titles()).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3', 'Panel change 4'])
  // Nothing under a title: no finding, no subject, no line saying it waits, no mark; the time, Archive
  expect(await list.find({ type: 'Text', text: /long line|waiting on you|Claude workflow/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text', text: /^●$/ })).length).toBe(0)
  const rowBoxes = (await list.drawn()) as unknown as { props?: { key?: string; height?: number }; children?: unknown[] }
  const heights: number[] = []
  const walk = (n: unknown) => {
    const one = n as { props?: { key?: string; height?: number }; children?: unknown[] }
    if (one?.props?.key?.startsWith('entry-')) heights.push(one.props.height ?? 0)
    for (const child of one?.children ?? []) walk(child)
  }
  walk(rowBoxes)
  expect(heights).toEqual([1, 1, 1, 1, 1, 1])
  // The rest is one row that unfolds
  expect((await keyed(list, 'earlier-fold'))?.props.label).toBe('▸ Earlier 4')
  await pressed(list, 'earlier-fold')
  expect((await titles()).slice(6)).toEqual(['Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second'])

  // The chat is told what waits now: the newest round's item, not the older rounds' asked again
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('Keep the third cut?')
  expect(told).not.toContain('Keep the first cut?')
  expect(told).not.toContain('Keep the second cut?')

  // Opened, its earlier rounds are listed inside it
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-v3', surface: 'desktop' } as never)
  const kin = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(kin.some(label => label.includes('Video second cut · this started from it'))).toBe(true)
  expect(kin.some(label => label.includes('Explainer video · earlier round'))).toBe(true)

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
