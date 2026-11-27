// The Stats and About tabs, and the bar of buttons

test('Stats opens in front from its button beside Results, and adds up this chat\'s work from its records: tokens, work, time saved, cost', async ($, on) => {
  const { files, opened, tabs, held: holding } = world(on)
  const M = 60_000
  const now = 1_700_000_000_000
  const chat = `${HOME}/.claude/projects/-repo`
  const subs = `${chat}/engine-id/subagents`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [], d: [], turns: [[now - 30 * M, now - 30 * M + 20_000]] }))
  // Two pieces of work that ran side by side for ten minutes
  for (const [id, from, to, output] of [['w1', now - 30 * M, now - 10 * M, 1_000_000], ['w2', now - 20 * M, now - 10 * M, 500_000]] as const) {
    files.set(`${subs}/agent-${id}.jsonl`, '{}')
    files.set(`${subs}/agent-${id}.meta.json`, JSON.stringify({ description: `Work ${id}`, spawnDepth: 1, finished: true }))
    files.set(`${subs}/agent-${id}.jsonl.sum`, JSON.stringify({ s: [[from, to]], u: [[`m-${id}`, 'claude-opus-5-5', from + M, 0, 0, 0, 0, 0, 0, output]], d: [[from + M, 'Do it', 'done', '']] }))
  }
  // and a helper the first started, at work beside both of them and on past them
  files.set(`${subs}/agent-h1.jsonl`, '{}')
  files.set(`${subs}/agent-h1.meta.json`, JSON.stringify({ description: 'Read the files', spawnDepth: 2, parentAgentId: 'w1', finished: true }))
  files.set(`${subs}/agent-h1.jsonl.sum`, JSON.stringify({ s: [[now - 15 * M, now - 5 * M]], u: [], d: [] }))
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'stats-open'))?.props.label).toBe('Stats')
  await pressed(pane, 'stats-open')
  expect(opened).toContain('stats')
  expect(tabs).toContain('stats: Stats')
  const stats = await $.ui.mount({ ...LIST, requestId: 'stats', props: { ...LIST.props, title: 'Stats', bodyColumns: 80 }, surface: 'desktop' } as never)
  // At the top, what is counted: this chat, today, each chosen one filled and bold
  expect((await stats.find({ type: 'Text', text: /^This chat$/ }))?.props.bold).toBe(true)
  expect((await stats.find({ type: 'Text', text: 'Today' }))?.props.bold).toBe(true)
  expect((await keyed(stats, 'scope-All chats'))?.props.label).toBe('All chats')
  // Once read: 1.5M output tokens on Opus 5.5 at $20 a million, two pieces finished, two to-dos, 35 minutes of work (the first with
  // its helper) in 25
  expect(await until(async () => stats.find({ type: 'Text', text: 'Saved by running at once' }))).toBeDefined()
  expect(await stats.find({ type: 'Text', text: 'Opus 5.5' })).toBeDefined()
  expect(await stats.find({ type: 'Text', text: '1.5M' })).toBeDefined()
  expect(await stats.find({ type: 'Text', text: '$30.00' })).toBeDefined()
  const value = async (name: string) => {
    const rows = (await stats.findAll({ type: 'Text' })).map(one => one.text)
    return rows[rows.indexOf(name) + 1]
  }
  // The headline: time saved, cost, work done
  expect(await value('10m')).toBe('time saved')
  expect(await value('Tasks done')).toBe('2')
  expect(await value('To-dos done')).toBe('2')
  expect(await value('Time of work')).toBe('35m')
  expect(await value('Time on the clock')).toBe('25m')
  expect(await value('Saved by running at once')).toBe('10m')
  // 35 minutes of work in 25 of real time: 1.4 hours of work for each hour, and the tokens by kind, each a share of all
  expect(await value('Efficiency')).toBe('1.40×')
  // The tasks and the helper each counted as itself: three at work at once, 30 minutes of the tasks' own and 10 of the helper's
  const helpers = ['Helpers that worked', 'Tasks and helpers at work at once, at most', 'Time of tasks, on their own', 'Time of helpers', 'Tasks and helpers, added up']
  expect(await Promise.all(helpers.map(value))).toEqual(['1', '3', '30m', '10m', '40m'])
  // The model that used the most tokens
  expect(await value('Favourite model')).toBe('Opus 5.5')
  expect(await value('Cache reads')).toBe('0% · 0')
  expect(await value('Written by the models')).toBe('100% · 1.5M')
  expect(await value('$30.00')).toBe('API cost')
  // Four ranges to count over, today chosen
  expect((await keyed(stats, 'range-7 days'))?.props.label).toBe('7 days')
  expect((await keyed(stats, 'range-30 days'))?.props.label).toBe('30 days')
  // From the person's message to the chat's last response or tool result before the next message: 20 seconds here
  expect(await value('Chat time per message, on average')).toBe('20s')
  expect(await stats.find({ type: 'Text', text: /^A message’s time runs from when the chat takes it to the chat’s last step/ })).toBeDefined()
  // The sums are kept, so the transcripts are read again only when they change
  expect(JSON.parse(files.get(`${MEMORY}/stats/chats/engine-id.json`) ?? '{}').head.folder).toBe(chat)
  // Months kept before they held each helper's time are made again from what is kept, once, with no transcript summed again
  const all = JSON.parse(files.get(`${MEMORY}/stats/all.json`) ?? '{}') as { mv?: number; months: Record<string, { part: Record<string, unknown> }> }
  delete all.mv
  for (const one of Object.values(all.months)) for (const name of ['crowd', 'ownMs', 'kidMs', 'kids']) delete one.part[name]
  files.set(`${MEMORY}/stats/all.json`, JSON.stringify(all))
  for (const [path, text] of [...files].filter(([path]) => path.startsWith(`${MEMORY}/stats/months/`))) files.set(path, text.replace(/,"o":\[[\d,]*\],"h":\[[\d,[\]]*\]\]/g, '').replace(/,"h":\[[\d,[\]]*\]\]/g, ''))
  expect([...files].filter(([path]) => path.startsWith(`${MEMORY}/stats/months/`)).some(([, text]) => text.includes('"h"'))).toBe(false)
  files.set('hold:jq', '')
  await pressed(stats, 'scope-All chats')
  expect(await until(async () => ((await value('Tasks and helpers at work at once, at most')) === '3' ? true : undefined))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/stats/all.json`) ?? '{}').mv).toBe(1)
  expect([...holding.keys()].filter(id => id.startsWith('jq:'))).toEqual([])
})

test('Stats keeps what it summed in files the engine reads whole, however much a chat did, and opened again adds nothing up twice: a transcript is summed again only once it changes', async ($, on) => {
  const { files, clock, held: holding } = world(on)
  const M = 60_000
  const now = 1_700_000_000_000
  const chat = `${HOME}/.claude/projects/-repo`
  const subs = `${chat}/engine-id/subagents`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  // 40 tasks of 1,800 responses each: over 4 MB of sums, more than the engine reads or writes as one file (on 0.2.264 a chat that
  // passed it was never kept again, and every opening summed its 600 transcripts from scratch, for half a minute)
  const sumOf = (i: number, more = 0) => JSON.stringify({ s: [[now - 30 * M, now - 10 * M]], u: Array.from({ length: 1800 + more }, (_, k) => [`m-${i}-${k}`, 'claude-opus-5-5', now - 30 * M + k * 500, 0, 0, 0, 0, 0, 0, 100]), d: [] })
  for (let i = 0; i < 40; i++) {
    files.set(`${subs}/agent-w${i}.jsonl`, '{}')
    files.set(`${subs}/agent-w${i}.meta.json`, JSON.stringify({ description: `Work ${i}`, spawnDepth: 1, finished: true }))
    files.set(`${subs}/agent-w${i}.jsonl.sum`, sumOf(i))
  }
  expect([...files].filter(([path]) => path.endsWith('.sum')).reduce((sum, [, text]) => sum + text.length, 0)).toBeGreaterThan(4_194_304)
  // What an older Claudopus summed of one of them is carried over, not summed again: its sums count as that file holds them, here
  // twice the tokens the transcript would give if it were read
  const older = JSON.stringify({ v: 5, folder: chat, files: { [`${subs}/agent-w0.jsonl`]: { size: 1, mtime: 0, sum: JSON.parse(sumOf(0).replaceAll(',100]', ',200]')) as unknown } } })
  files.set(`${MEMORY}/stats/engine-id.json`, older)
  files.set(`mtime:${MEMORY}/stats/engine-id.json`, String(now))
  await $.session.start(start)
  const stats = await $.ui.mount({ ...LIST, requestId: 'stats', props: { ...LIST.props, title: 'Stats', bodyColumns: 80 }, surface: 'desktop' } as never)
  const value = async (name: string) => {
    const rows = (await stats.findAll({ type: 'Text' })).map(one => one.text)
    return rows[rows.indexOf(name) + 1]
  }
  await pressed(stats, 'scope-All chats')
  expect(await until(async () => ((await value('Tasks done')) === '40' ? true : undefined))).toBe(true)
  expect(await value('Written by the models')).toBe('100% · 7.4M')
  // A chat still on that older Claudopus goes on using its own file, which is left as it was
  expect(files.get(`${MEMORY}/stats/engine-id.json`)).toBe(older)
  // Kept in several files, each far under the limit; the day's responses in more than one
  const kept = () => [...files].filter(([path]) => path.startsWith(`${MEMORY}/stats/`) && path.endsWith('.json') && path !== `${MEMORY}/stats/engine-id.json`)
  expect(kept().length).toBeGreaterThan(4)
  expect(kept().filter(([, text]) => text.length > 2_000_000)).toEqual([])
  expect(kept().filter(([path]) => /\/stats\/days\/\d+\.1\.json$/.test(path)).length).toBe(1)
  // Minutes later the records are looked at again: nothing changed, so no transcript is summed (a sum asked for now would be held)
  files.set('hold:jq', '')
  const looked = () => Number(JSON.parse(files.get(`${MEMORY}/stats/all.json`) ?? '{}').at)
  const first = looked()
  await clock.advance(2 * M)
  await stats.press({ key: (await until(async () => (await stats.findAll({ type: 'Button' })).find(one => one.props.label === '7 days')))?.key ?? '' })
  expect(await until(async () => (looked() > first ? true : undefined))).toBe(true)
  expect([...holding.keys()].filter(id => id.startsWith('jq:'))).toEqual([])
  expect(await value('Tasks done')).toBe('40')
  // One transcript grew: it alone is summed again, and the figures follow
  files.set(`${subs}/agent-w7.jsonl.sum`, sumOf(7, 1800))
  files.set(`mtime:${subs}/agent-w7.jsonl`, '9')
  const second = looked()
  await clock.advance(2 * M)
  await stats.press({ key: (await until(async () => (await stats.findAll({ type: 'Button' })).find(one => one.props.label === '30 days')))?.key ?? '' })
  expect(await until(async () => (holding.has(`jq:${subs}/agent-w7.jsonl`) ? true : undefined))).toBe(true)
  expect([...holding.keys()].filter(id => id.startsWith('jq:'))).toEqual([`jq:${subs}/agent-w7.jsonl`])
  files.delete('hold:jq')
  holding.get(`jq:${subs}/agent-w7.jsonl`)?.('')
  expect(await until(async () => (looked() > second ? true : undefined))).toBe(true)
  expect(await until(async () => ((await value('Written by the models')) === '100% · 7.4M' ? undefined : value('Written by the models')))).toBe('100% · 7.6M')
  // Days after the last chat on the older Claudopus wrote its file, it is cleared away
  files.set(`mtime:${MEMORY}/stats/engine-id.json`, String(now - 4 * 1440 * M))
  await clock.advance(2 * M)
  await pressed(stats, 'scope-This chat')
  expect(await until(async () => (files.has(`${MEMORY}/stats/engine-id.json`) ? undefined : true))).toBe(true)
})

// The progress folder of a made-up shop: a north star, two goals, three areas (one under no goal, each with steps once kept), and one area's entries: a task at
// work, a result set aside with its reason, a milestone with its picture, and two tasks of a day
const progressFiles = (files: Map<string, string>) => {
  const P = `${MEMORY}/progress`
  files.set(`${P}/picture.json`, JSON.stringify({ star: { text: 'A shop that sells seeds to every garden', said: '2023-11-01' }, goals: [{ id: 'g-grow', name: 'More gardens', words: '', said: '' }, { id: 'g-calm', name: 'A calm company', words: '', said: '' }], updated: '' }))
  const next = (id: string, text: string, state: string) => ({ id, text, state, at: '' })
  files.set(`${P}/areas.json`, JSON.stringify({ areas: [
    { id: 'seed-shop', name: 'Seed shop', goal: 'g-grow', aim: 'Seeds bought in two taps.', next: [next('n1', 'Card form works on phones', 'open'), next('n2', 'Saved addresses show first', 'done'), next('n3', 'Seeds by post abroad', 'aside')], updated: '' },
    { id: 'books', name: 'Bookkeeping', goal: 'g-calm', aim: 'The books close each month.', next: [next('n4', 'Monthly report sent by itself', 'open')], updated: '' },
    { id: 'cafe', name: 'Cafe menu', goal: '', aim: '', next: [], updated: '' },
  ] }))
  const entry = (task: string, title: string, at: string, kind: string, more: Record<string, unknown> = {}) => ({ task, title, at, kind, outcome: '', report: '', pictures: [], live: '', reason: '', ...more })
  files.set(`${P}/areas/seed-shop.json`, JSON.stringify({ entries: [
    entry('a1', 'Seed photos on every page', '2023-11-14T20:00:00Z', 'task'),
    entry('t2', 'Seed scanner tried in the shed', '2023-11-13T12:00:00Z', 'aside', { report: 'r-scan', reason: 'Good data, but not now.' }),
    entry('t3', 'Checkout in two taps', '2023-11-12T12:00:00Z', 'milestone', { report: 'r-pay', pictures: [`${MEMORY}/reports/r-pay/checkout.png`], live: 'https://example.com/shop', outcome: 'Most buyers pay in under a minute' }),
    entry('t4', 'Read the old orders', '2023-11-12T10:00:00Z', 'task'),
    entry('t5', 'Plan the seed pages', '2023-11-12T09:00:00Z', 'task'),
  ] }))
  files.set(`${P}/areas/books.json`, JSON.stringify({ entries: [entry('t6', 'October books closed', '2023-11-02T12:00:00Z', 'milestone')] }))
  files.set(`${P}/areas/cafe.json`, JSON.stringify({ entries: [entry('t7', 'Menu printed', '2023-10-20T12:00:00Z', 'task')] }))
  for (const [id, title, picture] of [['r-pay', 'Checkout in two taps', 'checkout.png'], ['r-scan', 'Seed scanner tried', '']]) {
    files.set(`${MEMORY}/reports/${id}/meta.json`, JSON.stringify({ id, title, subject: 'Shop', at: 1_699_000_000_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Done.', files: picture ? [picture] : [], agent: '' }))
    files.set(`${MEMORY}/reports/${id}/report.md`, 'Done.\n')
    // with the result's small copy, and the smaller one a row shows
    if (picture) for (const path of [picture, `thumbs/${picture}.jpg`, `thumbs/${picture}.small.jpg`]) files.set(`${MEMORY}/reports/${id}/${path}`, 'jpg')
  }
}

test('the Progress tab opens from its button beside Results: one month\'s chart under the north star whose rows are the areas, a square for each result, an earlier month a press away, an area opened with its timeline and no next steps, and nothing says anything waits', async ($, on) => {
  const sips = (argv: string[]) => (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 480\npixelHeight: 300' : '')
  const bytes = (path: string) => (path.includes('/thumbs/') ? 'B'.repeat(path.endsWith('.small.jpg') ? 4_000 : 30_000) : undefined)
  const { files, opened, tabs, submitted, clock } = world(on, { sips, bytes })
  progressFiles(files)
  // Past results still being sorted: 10 read in, 4 left in the queue
  files.set(`${MEMORY}/progress/backfilled`, '2023-11-14T10:00:00Z\n10\n')
  for (const n of [1, 2, 3, 4]) files.set(`${MEMORY}/progress/queue/00169999999000${n}-x.json`, JSON.stringify({ kind: 'result', at: 0, chat: '', task: '', report: `r${n}`, title: '', topic: '', files: [], text: 'Old work.', isBackfill: true }))
  // A kept result that was never counted, as its task had reported before: read in again once, only to be counted
  files.set(`${MEMORY}/reports/r-more/meta.json`, JSON.stringify({ id: 'r-more', title: 'Checkout tried on phones', subject: 'Shop', at: 1_699_000_100_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Done.', files: [], agent: 't3' }))
  files.set(`${MEMORY}/reports/r-more/report.md`, 'Done.\n')
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Seed photos on every page', prompt: 'Put seed photos on every page.' } as never)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'progress-open'))?.props.label).toBe('Progress')
  await pressed(pane, 'progress-open')
  expect(opened).toContain('progress')
  expect(tabs).toContain('progress: Progress')
  const tab = await $.ui.mount({ ...LIST, requestId: 'progress', props: { ...LIST.props, title: 'Progress', bodyColumns: 104 }, surface: 'desktop' } as never)
  const texts = async () => (await tab.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  // The chart is the areas themselves: the north star on top, then a row for each area worked on this month with its results, the
  // one at work in purple, each opened by the press beside it; the menu, last touched in October, is not among them
  const head = async () => (await tab.findAll({ type: 'Svg' })).find(one => String(one.props.alt).includes('A shop that sells seeds'))
  expect(String((await until(head))?.props.alt)).toContain('Seed shop: 5 results in November 2023, working now.')
  const strips = async () => (await tab.findAll({ type: 'Svg' })).map(one => String(one.props.source)).join('\n')
  expect((await strips()).length).toBeLessThanOrEqual(131_072)
  expect(await strips()).toMatch(/fill="#8A63F0" font-weight="600">Seed shop</)
  expect(await strips()).toContain('>Bookkeeping</text>')
  expect(await strips()).not.toContain('>Cafe menu</text>')
  for (const id of ['seed-shop', 'books']) expect(await keyed(tab, `progress-area-${id}`)).toBeDefined()
  // No list under it, no goal's name, and nothing of what is done of how much or what is next
  for (const text of ['More gardens', 'A calm company', 'Other', '1 area', 'October books closed']) expect(await texts()).not.toContain(text)
  expect(JSON.stringify(await tab.drawn())).not.toMatch(/\bnext\b/i)
  // Seven more areas worked on this month: the chart keeps its first seven, and the rest are Other
  const P = `${MEMORY}/progress`
  const extra = [1, 2, 3, 4, 5, 6, 7].map(n => ({ id: `x${n}`, name: `Extra ${n}`, goal: '', aim: '', next: [], updated: '' }))
  files.set(`${P}/areas.json`, JSON.stringify({ areas: [...JSON.parse(files.get(`${P}/areas.json`) ?? '{}').areas, ...extra] }))
  for (const one of extra) files.set(`${P}/areas/${one.id}.json`, JSON.stringify({ entries: [{ task: `t-${one.id}`, title: `Did ${one.name}`, at: '2023-11-10T12:00:00Z', kind: 'task', outcome: '', report: '', pictures: [], live: '', reason: '' }] }))
  // An earlier month is a press away, with its own areas: only the menu was worked on in October; and this month a press back
  expect(await texts()).toContain('November 2023')
  await pressed(tab, 'progress-month-earlier')
  expect(await until(async () => ((await texts()).includes('October 2023') ? true : undefined))).toBe(true)
  expect(String((await head())?.props.alt)).toContain('Results a day in October 2023')
  expect(await strips()).toContain('>Cafe menu</text>')
  expect(await strips()).not.toContain('>Seed shop</text>')
  expect(await keyed(tab, 'progress-area-cafe')).toBeDefined()
  await pressed(tab, 'progress-month-later')
  expect(await until(async () => ((await texts()).includes('November 2023') ? true : undefined))).toBe(true)
  // Other names the two areas past the first seven, and only a press on it gives them their rows
  for (const text of ['Other', 'Extra 6, Extra 7', '2 areas']) expect(await texts()).toContain(text)
  expect(await strips()).toContain('>Extra 5</text>')
  expect(await strips()).not.toContain('>Extra 6</text>')
  await pressed(tab, 'progress-other-shut')
  expect(await until(async () => ((await strips()).includes('>Extra 7</text>') ? true : undefined))).toBe(true)
  expect(await keyed(tab, 'progress-area-x7')).toBeDefined()
  await pressed(tab, 'progress-other-open')
  expect(await until(async () => ((await strips()).includes('>Extra 7</text>') ? undefined : true))).toBe(true)
  // Above the chart, how far the sorting has got: the 4 past results left, the one to count again and the start of the task above
  expect(await texts()).toContain('Sorting your past results into areas: 5 of 10 done. This page fills in as it goes.')
  // Once the sorting starts, the result never counted is queued to be, once, and those with an entry are left alone
  await clock.advance(5_000)
  expect(await until(async () => files.get(`${MEMORY}/progress/recounted`))).toMatch(/\n1\n$/)
  const recount = [...files].filter(([path, text]) => path.startsWith(`${MEMORY}/progress/queue/`) && text.includes('"isEntryOnly":true')).map(([, text]) => JSON.parse(text).report)
  expect(recount).toEqual(['r-more'])
  // Nothing on the page says it waits on the person
  const said = async () => JSON.stringify(await tab.drawn())
  expect(await said()).not.toMatch(/wait/i)
  expect((await said()).length).toBeLessThan(230_000)
  // An area opened: its aim, what was done in numbers, and its timeline with the task at work, what was set aside and why, and the milestone
  await pressed(tab, 'progress-area-seed-shop')
  expect(await until(async () => ((await texts()).includes('Seeds bought in two taps.') ? true : undefined))).toBe(true)
  for (const text of ['3 done', '1 aside', 'Done', 'set aside', 'Good data, but not now.', 'Checkout in two taps', 'live', 'Most buyers pay in under a minute']) expect(await texts()).toContain(text)
  expect((await tab.findAll({ type: 'Svg' })).some(one => one.props.alt === 'Checkout in two taps' && String(one.props.source).includes('base64,BBBB'))).toBe(true)
  // The two other tasks of that day are folded, and open
  expect(await texts()).not.toContain('Read the old orders')
  await tab.press({ key: String((await tab.findAll({ type: 'Button' })).find(one => /^progress-day-.*-shut-\d+$/.test(one.key ?? ''))?.key) })
  expect(await until(async () => ((await texts()).includes('Read the old orders') ? true : undefined))).toBe(true)
  // Nothing of what is next: no step, ticked, open or set aside
  for (const text of ['Next', 'Card form works on phones', 'Saved addresses show first', 'Seeds by post abroad']) expect(await texts()).not.toContain(text)
  expect((await tab.findAll({ type: 'Button' })).some(one => /next/i.test(String(one.props.label ?? '')))).toBe(false)
  // Pick up again sends the chat the person's words naming what was set aside and its result
  await tab.press({ key: String((await tab.findAll({ type: 'Button' })).find(one => one.props.label === 'Pick up again')?.key) })
  expect(await until(async () => submitted.find(text => text.startsWith('Pick up again: Seed scanner tried in the shed (') && text.includes('/reports/r-scan/report.md')))).toBeDefined()
  // Back to every area
  await pressed(tab, 'progress-back')
  expect(await until(async () => ((await texts()).includes('November 2023') ? true : undefined))).toBe(true)
})

test('the leaderboard is sent the work in the records where Claude Code keeps them, CLAUDE_CONFIG_DIR when it is set, and a chat whose records were not found is looked for again a day later', async ($, on) => {
  const { files, boarded, clock } = world(on, { env: { CLAUDE_CONFIG_DIR: `${HOME}/.claude-3` } })
  const M = 60_000
  const now = 1_700_000_000_000
  const sum = (output: number) => JSON.stringify({ s: [[now - 30 * M, now]], u: [[`m${output}`, 'claude-opus-5-5', now - M, 0, 0, 0, 0, 0, 0, output]], d: [] })
  // This chat's records, and another chat's in another project, and nothing in ~/.claude: until 0.2.281 only ~/.claude was read, so
  // a Mac like this counted nothing and its row on the board stayed at 0
  const at = (project: string, id: string, output: number) => (files.set(`${HOME}/.claude-3/projects/${project}/${id}.jsonl`, '{}'), files.set(`${HOME}/.claude-3/projects/${project}/${id}.jsonl.sum`, sum(output)))
  at('-repo', 'engine-id', 100)
  at('-elsewhere', 'other-chat', 200)
  for (const id of ['other-chat', 'late-chat']) files.set(`${MEMORY}/finished/${id}.json`, '[]')
  files.set(`${MEMORY}/installed.json`, JSON.stringify({ at: now - 60 * M }))
  files.set(`${MEMORY}/leaderboard.json`, JSON.stringify({ name: 'valchy', token: 'secret-1', isPublic: true, sentAt: 0 }))
  files.set('board:lb_send', '"ok"\n200')
  await $.session.start(start)
  const tokens = () => boarded.filter(one => one.fn === 'lb_send').map(one => (one.body.p_stats as Record<string, { tokens?: number }>).all?.tokens).filter(n => n !== undefined)
  await clock.advance(4 * M)
  expect(await until(async () => tokens().at(-1))).toBe(300)
  // A chat whose records were nowhere when it was looked for comes to count once they are there, with no Stats tab open: a look the
  // leaderboard makes every few minutes looks for them again once the last was a day ago
  at('-elsewhere', 'late-chat', 400)
  const late = `${MEMORY}/stats/chats/late-chat.json`
  const kept = JSON.parse(files.get(late) ?? '{}') as { head: { folder: string; sought?: number } }
  expect(kept.head).toMatchObject({ folder: '', sought: expect.any(Number) })
  await clock.advance(4 * M)
  expect(tokens().at(-1)).toBe(300)
  files.set(late, JSON.stringify({ ...kept, head: { ...kept.head, sought: now - 1441 * M } }))
  await clock.advance(4 * M)
  expect(await until(async () => (tokens().at(-1) === 700 ? true : undefined))).toBe(true)
})

test('the Leaderboard tab shows the board and is where you join with a username nobody has; nothing is sent before, then your sums go every few minutes, public or private, until you leave', async ($, on) => {
  const { files, boarded, clock, shown, opened, tabs, held: holding } = world(on)
  const M = 60_000
  const now = 1_700_000_000_000
  const chat = `${HOME}/.claude/projects/-repo`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [['m1', 'claude-opus-5-5', now - M, 0, 0, 10, 20, 0, 70, 100], ['m0', 'claude-opus-5-5', now - 3 * 60 * M, 0, 0, 1, 1, 1, 1, 1]], d: [] }))
  // Claudopus was installed an hour ago: the response before it never counts
  files.set(`${MEMORY}/installed.json`, JSON.stringify({ at: now - 60 * M }))
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // The board's top 10, read as the tab opens; nobody's own row is sent to read it
  files.set('board:lb_board', `${JSON.stringify([{ rank: 1, name: 'mira_k', is_public: true, total: 2, model: 'claude-opus-5-5', f: { work: 2 * 1440 * M + 3 * 60 * M, clock: 30 * 60 * M } }, { rank: 2, name: 'octavia', is_public: false, total: 2, model: '', f: { work: 45 * M, clock: 30 * M } }])}\n200`)
  await pressed(pane, 'board-open')
  expect(opened).toContain('leaderboard')
  expect(tabs).toContain('leaderboard: Leaderboard')
  const stats = await $.ui.mount({ ...LIST, requestId: 'leaderboard', props: { ...LIST.props, title: 'Leaderboard', bodyColumns: 80 }, surface: 'desktop' } as never)
  const said = (text: RegExp) => until(async () => stats.find({ type: 'Text', text }))
  const field = async () => (await stats.findAll({ type: 'Input' }))[0]?.key ?? ''
  // A table with headings: time of work in days, hours and minutes, efficiency and favourite model, each a column of its own, the
  // first place in gold; a public name opens their page on claudopus.ai
  for (const text of ['Time of work', 'Efficiency', 'Model', '2d 3h 00m', '1.70×', 'Opus 5.5', '45m', '1.50×']) expect(await said(new RegExp(`^${text.replace('.', '\\.')}$`))).toBeDefined()
  expect((await said(/^1$/))?.props.color).toBe('#E3B341')
  expect(await said(/^2 people on the board$/)).toBeDefined()
  await pressed(stats, 'board-person-mira_k')
  expect(await until(async () => shown.find(one => one.includes('https://claudopus.ai/leaderboard/mira_k')))).toBeDefined()
  await pressed(stats, 'board-site')
  expect(await until(async () => shown.find(one => one.includes('https://claudopus.ai/leaderboard')))).toBeDefined()
  // Before joining: what is shown, what is never sent, how often, what public adds and what Leave does, each on a line of its own
  for (const text of [/^Your username, time of work/, /^Chat titles, your words/, /^As you join, then every 3 minutes/, /^Your stats and your timeline stay private/, /^Off deletes your username and stats/]) expect(await said(text)).toBeDefined()
  // Minutes pass with the tab open: the board is read again, and nothing of yours is sent
  await clock.advance(10 * M)
  expect(boarded.filter(one => one.fn !== 'lb_board')).toEqual([])
  // A username with a space is refused here, before anything is sent
  await stats.input({ key: await field(), text: 'my name' })
  expect(await said(/^A username is 3 to 20 letters/)).toBeDefined()
  expect(boarded.filter(one => one.fn !== 'lb_board')).toEqual([])
  // Join answers at once, however long every chat's records take to read (half a minute after a reload, on 0.2.261 a Join that showed
  // nothing at all for that long): what it is doing shows as it is pressed, and someone has the name already
  files.set('hold:jq', '')
  files.set('hold:lb_join', '')
  files.set('board:lb_join', '{"code":"23505","message":"taken"}\n409')
  await stats.input({ key: await field(), text: 'dima' })
  expect(await said(/^Joining as dima…$/)).toBeDefined()
  files.delete('hold:lb_join')
  await until(async () => holding.has('lb_join'))
  holding.get('lb_join')?.('')
  expect(await said(/^Someone already has the username dima/)).toBeDefined()
  const joins = boarded.filter(one => one.fn === 'lb_join')
  expect(joins.length).toBe(1)
  // With it go only the sums kept so far, if any: never a timeline
  expect(Object.keys(joins[0]?.body.p_stats as object).filter(key => !['today', 'd7', 'd30', 'all'].includes(key))).toEqual([])
  // Joined: the secret is kept in the memory folder, then the figures follow
  files.set('board:lb_join', '"secret-1"\n200')
  files.set('board:lb_send', '"ok"\n200')
  await stats.input({ key: await field(), text: 'dima' })
  expect(await said(/^✓ You joined as dima/)).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/leaderboard.json`) ?? '{}')).toMatchObject({ name: 'dima', token: 'secret-1', isPublic: false })
  files.delete('hold:jq')
  for (const [id, go] of [...holding]) if (id.startsWith('jq:')) (holding.delete(id), go(''))
  // Only sums go, for each range: never a title, a path or anyone's words
  const sends = () => boarded.filter(one => one.fn === 'lb_send')
  const first = await until(async () => sends().find(one => one.body.p_token === 'secret-1'))
  const sent = first?.body.p_stats as Record<string, Record<string, unknown>>
  expect(Object.keys(sent)).toEqual(['today', 'd7', 'd30', 'all'])
  expect([sent.all?.tokens, sent.all?.read, sent.all?.write, sent.all?.input]).toEqual([200, 70, 20, 10])
  expect(JSON.stringify(sent)).not.toContain('repo')
  // Your part of the tab is titled with your username, and says where you stand in the range chosen
  expect(await said(/^Not in the top 10 for this range$/)).toBeDefined()
  // The first time everything goes, as nothing of this Mac's is on the board; what the board then holds is kept beside the secret,
  // with the mark it was sent under
  expect([first?.body.p_was, first?.body.p_public, typeof first?.body.p_now]).toEqual([null, false, 'string'])
  const mark = () => JSON.parse(files.get(`${MEMORY}/leaderboard-sent.json`) ?? '{}') as { rev?: string; stats?: Record<string, unknown> }
  expect(await until(async () => (mark().rev === first?.body.p_now ? true : undefined))).toBe(true)
  // Every few minutes after, the records are looked at again; nothing changed, so nothing is sent
  const sentAt = () => Number(JSON.parse(files.get(`${MEMORY}/leaderboard.json`) ?? '{}').sentAt)
  const joinedAt = sentAt()
  await clock.advance(4 * M)
  expect(await until(async () => (sentAt() > joinedAt ? true : undefined))).toBe(true)
  // A response more: the figures that changed go, on top of what the board holds, and nothing else
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [['m1', 'claude-opus-5-5', now - M, 0, 0, 10, 20, 0, 70, 100], ['m0', 'claude-opus-5-5', now - 3 * 60 * M, 0, 0, 1, 1, 1, 1, 1], ['m2', 'claude-opus-5-5', now, 0, 0, 0, 0, 0, 0, 100]], d: [] }))
  files.set(`mtime:${chat}/engine-id.jsonl`, '5')
  await clock.advance(4 * M)
  const second = await until(async () => sends().find(one => one.body.p_was === first?.body.p_now))
  expect(sends().length).toBe(2)
  expect((second?.body.p_stats as typeof sent).all?.tokens).toBe(300)
  expect(second?.body).toMatchObject({ p_token: 'secret-1', p_public: false, p_timeline: false })
  expect(await until(async () => (mark().rev === second?.body.p_now ? true : undefined))).toBe(true)
  // The board holds something else (an older Claudopus on another Mac sent since): it says so, and everything goes again
  files.set('board:lb_send', '"full"\n200')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [['m1', 'claude-opus-5-5', now - M, 0, 0, 10, 20, 0, 70, 100], ['m2', 'claude-opus-5-5', now, 0, 0, 0, 0, 0, 0, 100], ['m3', 'claude-opus-5-5', now, 0, 0, 0, 0, 0, 0, 50]], d: [] }))
  files.set(`mtime:${chat}/engine-id.jsonl`, '6')
  await clock.advance(4 * M)
  const again = await until(async () => (sends().length >= 4 ? sends().slice(2, 4) : undefined))
  expect(again?.map(one => one.body.p_was)).toEqual([second?.body.p_now, null])
  expect(Object.keys(again?.[1]?.body.p_stats as object)).toEqual(['today', 'd7', 'd30', 'all'])
  expect((again?.[1]?.body.p_stats as typeof sent).all?.tokens).toBe(350)
  files.set('board:lb_send', '"ok"\n200')
  // Stats public: the timeline stays private, and isn't sent
  await pressed(stats, 'board-stats-switch-Public')
  expect(await said(/^✓ Your stats are public/)).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/leaderboard.json`) ?? '{}')).toMatchObject({ isPublic: true, isTimelinePublic: false })
  expect(sends().at(-1)?.body).toMatchObject({ p_public: true, p_timeline: false, p_was: second?.body.p_now })
  expect(Object.keys(sends().at(-1)?.body.p_stats as object)).toEqual(['today', 'd7', 'd30', 'all'])
  expect(await said(/and a breakdown by model$/)).toBeDefined()
  // The timeline, with no task names, goes only once it is switched to public, on a switch of its own
  await pressed(stats, 'board-timeline-switch-Public')
  expect(await said(/^✓ Your timeline is public/)).toBeDefined()
  // The figures are as the board holds them, so only the timeline goes
  const last = sends().at(-1)
  expect(last?.body).toMatchObject({ p_public: true, p_timeline: true })
  expect(Object.keys(last?.body.p_stats as object)).toEqual(['timeline'])
  expect(await said(/and a timeline with no task names$/)).toBeDefined()
  // Off takes you off the board at once
  files.set('board:lb_leave', 'true\n200')
  await pressed(stats, 'board-on-switch-Off')
  expect(await said(/^✓ You left the leaderboard/)).toBeDefined()
  expect(boarded.filter(one => one.fn === 'lb_leave')).toEqual([{ fn: 'lb_leave', body: { p_token: 'secret-1' } }])
  expect(files.get(`${MEMORY}/leaderboard-sent.json`)).toBe('{}')
  const pushes = sends().length
  await clock.advance(10 * M)
  expect(sends().length).toBe(pushes)
})

test('Stats draws whatever the history: the timeline of 240 pieces of work at once, each busy a minute in ten, in one drawing the app takes, and the rest of the tab as ever', async ($, on) => {
  const { files } = world(on)
  const M = 60_000
  const t0 = 1_700_000_000_000 - 1000 * M
  const chat = `${HOME}/.claude/projects/-repo`
  const subs = `${chat}/engine-id/subagents`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [], u: [], d: [] }))
  // 24,000 bars: on 0.2.139 a drawing of eleven million characters, which the app refuses with the whole tab
  const spans = Array.from({ length: 100 }, (_, k) => [t0 + k * 10 * M, t0 + k * 10 * M + M])
  for (let i = 0; i < 240; i++) {
    files.set(`${subs}/agent-w${i}.jsonl`, '{}')
    files.set(`${subs}/agent-w${i}.meta.json`, JSON.stringify({ description: `Work ${i}`, spawnDepth: 1, finished: true }))
    files.set(`${subs}/agent-w${i}.jsonl.sum`, JSON.stringify({ s: spans, u: [[`m-${i}`, 'claude-opus-5-5', t0 + M, 0, 0, 0, 0, 0, 0, 1000]], d: [] }))
  }
  await $.session.start(start)
  const stats = await $.ui.mount({ ...LIST, requestId: 'stats', props: { ...LIST.props, title: 'Stats', bodyColumns: 60 }, surface: 'desktop' } as never)
  const allTime = await until(async () => (await stats.findAll({ type: 'Button' })).find(one => one.props.label === 'All time'))
  await stats.press({ key: allTime?.key ?? '' })
  // The timeline is drawn, its bars on a coarser grid, in one drawing the app takes
  const timeline = await until(async () => (await stats.findAll({ type: 'Svg' })).find(one => String(one.props.alt) === '240 tasks on a timeline'))
  expect(String(timeline?.props.source)).toContain('#8A63F0')
  expect((await stats.findAll({ type: 'Svg' })).filter(one => String(one.props.source).length > 131_072)).toEqual([])
  // The rest of the tab is drawn as ever
  expect(await stats.find({ type: 'Text', text: 'Saved by running at once' })).toBeDefined()
  expect(await stats.find({ type: 'Text', text: '240k' })).toBeDefined()
})

test('the bar keeps its buttons whole on a row of their own under the header, wrapping in a narrow pane', async ($, on) => {
  world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 30 }, surface: 'desktop' } as never)
  const row = (await pane.findAll({ type: 'Box' })).find(one => one.key === 'head-buttons')
  expect(row?.props.flexWrap).toBe('wrap')
  // Wrapped rows are as far apart as the buttons beside each other, so they never touch
  expect(row?.props.columnGap).toBe(1)
  expect(row?.props.rowGap).toBe(1)
  // A terminal's gap would be a whole blank line between the rows, so it has none
  const term = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 30 }, surface: 'terminal' } as never)
  expect((await term.findAll({ type: 'Box' })).find(one => one.key === 'head-buttons')?.props.rowGap).toBe(0)
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Progress', 'Stats', 'Leaderboard', 'Memory', 'Config', 'About'])
  // The chat's size is no longer squeezed beside the buttons
  expect(await pane.find({ type: 'Text', text: /^This chat /})).toBeDefined()
})

test('the header names the version this chat loaded beside Claudopus, and a newer one the Mac has installed, on the same line', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  const version = async (pane: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; text?: string; props: Record<string, unknown> }[]> }) =>
    (await pane.findAll({ type: 'Text' })).find(one => /^v\d/.test(one.text ?? ''))
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  const name = (await pane.findAll({ type: 'Box' })).find(one => one.key === 'head-name')
  expect(name?.props.flexDirection).toBe('row')
  const shown = await version(pane)
  expect(shown?.text).toBe('v0.1.0')
  expect(shown?.props.dimColor).toBe(true)
  // The header keeps its three lines: the name, what runs, this chat's size
  expect(await pane.find({ type: 'Text', text: /^This chat /})).toBeDefined()
  // The installed version is Claude Code's own record, not the last look's: a copy run from a folder of its code has none, so a
  // newer version in update.json names nothing (an installed copy's is read from installed_plugins.json, tested in update.test)
  await pane.unmount()
  files.set(`${MEMORY}/update.json`, JSON.stringify({ at: 1, version: '0.1.1', result: 'updated' }))
  const later = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await version(later))?.text).toBe('v0.1.0')
  await later.unmount()
  // In a narrow pane the name stays whole; only the version shortens
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 24 }, surface: 'desktop' } as never)
  const whole = (await narrow.findAll({ type: 'Box' })).find(one => one.key === 'head-name')
  expect(whole?.props.minWidth).toBe(0)
  expect(await narrow.find({ type: 'Text', text: 'Claudopus' })).toBeDefined()
  await narrow.unmount()
  files.set(`${MEMORY}/update.json`, JSON.stringify({ at: 2, version: '0.1.0', result: 'none' }))
  const same = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await version(same))?.text).toBe('v0.1.0')
})

test('About says what Claudopus is, its version and the app\'s, and links the site, the code and its licence', async ($, on) => {
  const { files, tabs } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'about-open')
  expect(await until(async () => tabs.find(tab => tab === 'about: About'))).toBe('about: About')
  // A press that reached its button is one line in the log, naming the button, so landed presses can be counted against dropped ones
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/press landed: about-open-\d+ in claudopus \(desktop\)/)?.[0])).toBeDefined()
  const about = await $.ui.mount({ ...LIST, requestId: 'about', props: { ...LIST.props, title: 'About', bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await about.find({ type: 'Text', text: 'Version 0.1.0 · Claude Code 2.1.321' })).toBeDefined()
  expect(await about.find({ type: 'Text', text: 'What it does' })).toBeDefined()
  // The principles are not shown there
  expect(await about.find({ type: 'Text', text: 'My words are the spec.' })).toBeUndefined()
  const links = (await about.findAll({ type: 'Link' })).map(one => one.props.href)
  expect(links).toEqual(['https://claudopus.ai', 'https://github.com/dimka3553/claudopus', 'https://github.com/dimka3553/claudopus/blob/main/LICENSE'])
  expect(await about.find({ type: 'Text', text: /a star on GitHub/ })).toBeDefined()
})

// ---- The changelog and the update screen ----

const CHANGELOG = [
  '# Changelog',
  '',
  '## 0.1.0 · 13 November 2026',
  '- The panel shows what changed.',
  '- A second change.',
  '',
  '## 0.0.9 · 12 November 2026',
  '- Pictures open large.',
  '',
  '## 0.0.8 · 11 November 2026',
  '- An old change.',
  '',
].join('\n')

test('About opens the changelog in a tab of its own, every version newest first, the one this chat runs marked', async ($, on) => {
  const { tabs } = world(on, { changelog: CHANGELOG })
  await $.session.start(start)
  const about = await $.ui.mount({ ...LIST, requestId: 'about', props: { ...LIST.props, title: 'About', bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await keyed(about, 'about-changelog'))?.props.label).toBe('Changelog')
  await pressed(about, 'about-changelog')
  expect(await until(async () => tabs.find(tab => tab === 'changelog: Changelog'))).toBe('changelog: Changelog')
  const log = await $.ui.mount({ ...LIST, requestId: 'changelog', props: { ...LIST.props, title: 'Changelog', bodyColumns: 60 }, surface: 'desktop' } as never)
  const texts = (await log.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts.filter(one => /^v0\./.test(one))).toEqual(['v0.1.0', 'v0.0.9', 'v0.0.8'])
  expect(texts).toContain('13 November 2026 · this chat runs it')
  expect(texts).toContain('Pictures open large.')
})

test('a chat that moved to a newer version than the one whose changes were seen says so in one quiet note in the header, with What\'s new, until closed', async ($, on) => {
  const { files } = world(on, { changelog: CHANGELOG })
  files.set(`${MEMORY}/seen.json`, JSON.stringify({ version: '0.0.8' }))
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => pane.find({ type: 'Text', text: 'Updated to Claudopus v0.1.0' }))).toBeDefined()
  expect(await pane.find({ type: 'Text', text: '· from v0.0.8, 2 versions' })).toBeDefined()
  // The panel stays whole beneath it: its header buttons are there
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toContain('Stats')
  await pressed(pane, 'update-close')
  expect(JSON.parse(files.get(`${MEMORY}/seen.json`) ?? '{}').version).toBe('0.1.0')
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Updated to Claudopus v0.1.0' })) ? undefined : true))).toBe(true)
  // A load of the same version again shows nothing
  await pane.unmount()
  await $.session.start(start)
  const again = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => (await again.findAll({ type: 'Button' })).find(b => b.props.label === 'Stats'))).toBeDefined()
  expect(await again.find({ type: 'Text', text: 'Updated to Claudopus v0.1.0' })).toBeUndefined()
})

test('a first install starts the record of changes seen at its own version, and shows no update screen', async ($, on) => {
  const { files } = world(on, { changelog: CHANGELOG })
  await $.session.start(start)
  expect(JSON.parse(files.get(`${MEMORY}/seen.json`) ?? '{}').version).toBe('0.1.0')
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Stats'))).toBeDefined()
  expect(await pane.find({ type: 'Text', text: 'Updated to Claudopus v0.1.0' })).toBeUndefined()
})


// "Nothing to show yet": the app asks a tab for its drawing as it shows it, and asks again only when told something changed; one
// empty answer (the chat out of reach that moment) left Stats, About or a result empty for good, as none of them reads anything that
// changes. A tab open and never asked for since is drawn again until it is
test('a tab opened but not asked for its drawing is drawn again within seconds, and one asked for costs nothing more', async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { clock } = world(on, { live })
  let redraws = 0
  on('ui.invalidate', () => ((redraws += 1), { value: undefined }) as never)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(pane, 'about-open')
  await clock.advance(500)
  const before = redraws
  // The app's ask for About never came: two seconds on, the mod draws again, and asks the app to
  await clock.advance(2_000)
  expect(redraws).toBeGreaterThan(before)
  // Opened again and asked for at once: no redraw of its own follows
  await pressed(pane, 'about-open')
  await clock.advance(100)
  await $.ui.mount({ ...LIST, requestId: 'about', props: { ...LIST.props, title: 'About', bodyColumns: 80 }, surface: 'desktop' } as never)
  await clock.advance(500)
  const asked = redraws
  await clock.advance(20_000)
  expect(redraws).toBe(asked)
})

test('a tab left open as the mod loads, after an update or a reload, is drawn again if the app does not ask for it, and the log names the chat', async ($, on) => {
  const live = [{ id: 'claudopus', isShown: false, isPlaced: false }, { id: 'stats', isShown: false, isPlaced: false }]
  const { clock, files } = world(on, { live })
  let redraws = 0
  on('ui.invalidate', () => ((redraws += 1), { value: undefined }) as never)
  await $.session.start(start)
  await clock.advance(500)
  const before = redraws
  await clock.advance(2_000)
  expect(redraws).toBeGreaterThan(before)
  // Four times at most, while nothing asks for it: a tab behind the others is never asked for
  await clock.advance(60_000)
  expect(redraws - before).toBeLessThanOrEqual(4)
  // The app asks only the chat it shows: the line names this one, so a chat in sight left unasked can be told from those out of sight
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/tab [^\n]* not asked for in 40s after this code loaded in chat engine-id: drawn again/)?.[0])).toBeDefined()
})

test("a Details tab too big for the app is drawn with less in it, its ended commands folded; one too big even so says so, with the way back", async ($, on) => {
  const { files, clock, opened } = world(on)
  await $.session.start(start)
  const runs = (owner: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `${owner}-r${i}`, what: `Check fix ${i} of ${owner}`, cmd: 'npm test', at: NOW - 600_000 + i, endedAt: NOW - 500_000 + i, how: i % 5 ? 'finished' : 'failed', kind: 'script', named: { why: 'Disk is full, so the build could not write its files' } }))
  const card = (items: { text: string; state: string }[]) => ({ id: 'b1', parentId: '', isFork: false, tokens: 0, model: 'claude-opus-5-5', title: 'Fix the security findings one by one', words: 'fix them', items, entries: [{ at: NOW, kind: 'note', text: 'Fixing S12.' }], answer: '', startedAt: NOW - 3_600_000, endedAt: 0, status: 'working', endedRuns: runs('b1', 20) })
  const helpers = Array.from({ length: 30 }, (_, n) => ({ id: `h${n}`, parentId: 'b1', isFork: false, tokens: 0, title: `Build fix S${n}`, words: '', items: [], entries: [], answer: 'Done.', startedAt: NOW - 3_000_000 + n, endedAt: NOW - 1_000_000, status: 'done', endedRuns: runs(`h${n}`, 9) }))
  const share = (items: { text: string; state: string }[]) => async () => files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ chat: 'chat-b', title: 'Security fixes', folder: '/repo/claudopus', host: '', at: NOW + 10_000, cards: [card(items)], helpers }))
  const line = (one: object) => JSON.stringify(one)
  files.set(
    `${HOME}/.claude/projects/-repo-claudopus/chat-b/subagents/agent-b1.jsonl`,
    [
      line({ type: 'user', message: { role: 'user', content: 'fix them' } }),
      ...Array.from({ length: 200 }, (_, n) => [
        line({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: `Fix S${n} is merged and its checks pass.` }, { type: 'tool_use', id: `tu${n}`, name: 'Bash', input: { command: 'npm test', description: `Test fix S${n}` } }] } }),
        line({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: `tu${n}`, content: 'ok' }] } }),
      ]).flat(),
    ].join('\n'),
  )
  await share([{ text: 'Fix S12', state: 'doing' }])()
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const id = (await until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-r-'))?.key))?.replace(/^open-/, '').replace(/-\d+$/, '') ?? ''
  const tab = await $.ui.mount({ ...LIST, requestId: `work-${id}`, props: { ...LIST.props, bodyColumns: 74 }, surface: 'desktop' } as never)
  const labels = async () => [...(await tab.findAll({ type: 'Text' })).map(t => t.text ?? ''), ...(await tab.findAll({ type: 'Button' })).map(b => String(b.props.label))]
  // Drawn whole, it is far past the app's limits: drawn with less in it, its title, helpers, commands and conversation all there
  expect(await until(async () => ((await labels()).some(text => /^Fix S199 is merged/.test(text)) || (await tab.findAll({ type: 'Markdown' })).some(m => /^Fix S199 is merged/.test(String(m.props.text))) ? true : undefined))).toBe(true)
  const size = appDraws(await tab.drawn())
  expect(size).toMatchObject({ isDrawn: true })
  const shown = await labels()
  expect(shown).toContain('Fix the security findings one by one')
  expect(shown).toContain('Helpers and commands')
  expect(shown).toContain('Conversation')
  // Each group of ended commands is one row that opens on a press
  expect(shown.filter(text => /^\d+ commands ended.* · show$/.test(text)).length).toBe(31)
  const endedRows = async () => (await tab.findAll({ type: 'Button' })).filter(b => (b.key ?? '').startsWith('ended-open-')).length
  expect(await endedRows()).toBe(0)
  await tab.press({ key: (await tab.findAll({ type: 'Button' })).find(b => /^open-ended-group-.*h3-\d+$/.test(b.key ?? ''))?.key ?? 'ended-group-h3' })
  expect(await until(async () => ((await endedRows()) === 9 ? true : undefined))).toBe(true)
  expect(appDraws(await tab.drawn()).isDrawn).toBe(true)
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/tab work-[^\n]* drawn with less in it/)?.[0])).toBeDefined()
  // Too big even with the least in it: never a drawing the app throws away, but what happened in plain words and the way back
  await share(Array.from({ length: 2500 }, (_, n) => ({ text: `Check finding ${n}`, state: 'open' })))()
  await clock.advance(6000)
  expect(await until(async () => (await tab.find({ type: 'Text', text: "Claudopus couldn't show this tab" })) ?? undefined)).toBeDefined()
  // (the log says by how much, each count beside its limit, and how wide the pane was)
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/tab work-\S+ not given: its drawing is past what the app draws \(\d+ of 1800 parts, \d+ of 230000 characters, \d+ of 30 deep, 74 columns wide\)/)?.[0])).toBeDefined()
  expect(appDraws(await tab.drawn()).isDrawn).toBe(true)
  const before = opened.length
  await pressed(tab, 'too-big-back')
  expect(await until(async () => (opened.slice(before).includes(LIST.requestId) ? true : undefined))).toBe(true)
  await tab.unmount()
  await list.unmount()
})

// Pressing in the panel closes and opens it again to let go of the keys, which puts it last: it ended on the right of Stats
test('the Claudopus tab stays first whichever tabs are opened, closed and opened again after it', async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true, isFocused: true }]
  const { clock } = world(on, { live })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const order = async () => live.map(one => one.id)
  await pressed(pane, 'stats-open')
  await clock.advance(500)
  expect((await order())[0]).toBe('claudopus')
  await pressed(pane, 'about-open')
  await clock.advance(500)
  expect(await order()).toEqual(['claudopus', 'stats', 'about'])
  // Closed, and the panel pressed in again, whichever way round
  live.splice(0, live.length, ...live.filter(one => one.id !== 'stats'))
  live[0]!.isFocused = true
  await pressed(pane, 'stats-open')
  await clock.advance(500)
  expect((await order())[0]).toBe('claudopus')
  expect(await order()).toContain('stats')
})

// The list near the app's limit: a pane as wide as the window put a few thousand more characters into the same cards, and the whole
// list said only that it couldn't show this tab, then came back once narrowed (21-22 Nov, a chat with 10 open cards and 24 helpers).
// Here 10 tasks, each with a question, 2 commands and 2 helpers with one each: beside the chat about 224,000 characters as the panel
// counts them, as wide as the window about 234,000, past its 230,000 (22 Nov)
test('the list too big for the app at a wide pane is drawn with less in it, every card still there, and the log says by how much', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const parents: Record<string, string> = {}
  const { clock, files } = world(on, { agents, kinds, parents, jobs: { output: () => 'Rendering frame 12 of 400 for the long video of the head turning slowly from the left side\n', wroteAt: () => NOW } })
  await $.session.start(start)
  const more = (n: number) => 'and checks each measured point against the scan again '.repeat(n)
  const said = (what: string, n: number) => `${what} ${n}: ${'I am comparing every measurement of the nose with the scan, writing down where each one differs, and fixing them one by one before the next check runs. '.repeat(6)}`
  const titles: string[] = []
  let id = 0
  let use = 0
  for (let t = 1; t <= 10; t += 1) {
    const me = `a${(id += 1)}`
    kinds[me] = 'general-purpose'
    titles.push(`Task number ${t} with a fairly long title that says what it does in plain words ${more(23)}`.trim())
    await $.prompt.submit({ text: `job ${t}`, wait: false, origin: composer })
    await $.agent.spawn({ ...spawn, description: titles[t - 1], prompt: `job ${t}` } as never)
    const call = (agentId: string, tool: string, input: Record<string, unknown>) => $.tool.call({ tool, tool_use_id: `u${(use += 1)}`, agentId, ...input } as never)
    for (let i = 0; i < 8; i += 1) await call(me, 'mcp__claudopus__todo', { item: `Step ${i} of task ${t}, which does one part of the whole job carefully`, state: i < 3 ? 'done' : i === 3 ? 'doing' : 'open' })
    await call(me, 'mcp__claudopus__note', { text: said('Note', t) })
    for (let c = 0; c < 2; c += 1) await call(me, 'Bash', { command: `python3 render.py --part ${c}`, description: `Render part ${c} of the long video for task ${t} with every frame at full size, then compare each frame with the one before it and write down which ones changed ${more(5)}`, run_in_background: true })
    for (let h = 0; h < 2; h += 1) {
      const kid = `a${(id += 1)}`
      kinds[kid] = 'general-purpose'
      parents[kid] = me
      await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: `Helper ${h} of task ${t} that measures a part of the head carefully, writes every number down and compares each one with the scan from last week ${more(5)}`, prompt: 'go', parentAgentId: me } as never)
      await call(kid, 'mcp__claudopus__note', { text: said('Helper note', h) })
      await call(kid, 'Bash', { command: 'python3 measure.py', description: `Measure part ${h} of the head for task ${t} at full detail, every point of it, against the scan from last week and the one before ${more(5)}`, run_in_background: true })
    }
    await call(me, 'mcp__claudopus__ask', { text: `${said('Question', t)} May I go on?`, details: more(30).slice(0, 1450), choices: ['Go on', 'Stop here'] })
    await clock.advance(100)
  }
  await clock.advance(30_000)
  const shown = async (columns: number) => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface: 'desktop' } as never)
    const titled = async () => (await list.findAll({ type: 'Text' })).filter(one => titles.includes(String(one.text))).length
    await until(async () => ((await titled()) === 10 || (await list.find({ type: 'Text', text: "Claudopus couldn't show this tab" })) ? true : undefined))
    const seen = { titles: await titled(), isTooBig: Boolean(await list.find({ type: 'Text', text: "Claudopus couldn't show this tab" })), isDrawn: appDraws(await list.drawn()).isDrawn }
    await list.unmount()
    return seen
  }
  // Beside the chat, and as wide as the window: every card, within what the app draws, never the line that it couldn't
  expect(await shown(79)).toEqual({ titles: 10, isTooBig: false, isDrawn: true })
  expect(await shown(300)).toEqual({ titles: 10, isTooBig: false, isDrawn: true })
  // The log says how much less, and how big it was whole beside each limit, and how wide the pane was
  expect((files.get(`${MEMORY}/log.md`) ?? '').match(/tab claudopus drawn with less in it \(\d of 3\) to fit what the app draws \(whole: \d+ of 1800 parts, \d+ of 230000 characters, \d+ of 30 deep, 300 columns wide\)/)?.[0]).toBeDefined()
})
