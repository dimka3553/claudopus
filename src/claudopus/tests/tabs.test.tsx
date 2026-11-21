// The Stats and About tabs, and the bar of buttons

test('Stats opens in front from its button beside Results, and adds up this chat\'s work from its records: tokens, work, time saved, cost', async ($, on) => {
  const { files, opened, tabs } = world(on)
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
  // Once read: 1.5M output tokens on Opus 5.5 at $20 a million, two pieces finished, two to-dos, 30 minutes of work in 20
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
  expect(await value('Time of work')).toBe('30m')
  expect(await value('Time on the clock')).toBe('20m')
  expect(await value('Saved by running at once')).toBe('10m')
  // 30 minutes of work in 20 of real time: 1.5 hours of work for each hour, and the tokens by kind, each a share of all
  expect(await value('Efficiency')).toBe('1.50×')
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
  expect(JSON.parse(files.get(`${MEMORY}/stats/engine-id.json`) ?? '{}').folder).toBe(chat)
})

test('the Leaderboard tab shows the board and is where you join with a username nobody has; nothing is sent before, then your sums go every few minutes, public or private, until you leave', async ($, on) => {
  const { files, boarded, clock, shown, opened, tabs } = world(on)
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
  // Time of work in days, hours and minutes, efficiency and favourite model; a public name opens their page on claudopus.ai
  expect(await said(/^2d 3h 00m · 1\.70× · Opus 5\.5$/)).toBeDefined()
  expect(await said(/^45m · 1\.50×$/)).toBeDefined()
  expect(await said(/^2 people on the board$/)).toBeDefined()
  await pressed(stats, 'board-person-mira_k')
  expect(await until(async () => shown.find(one => one.includes('https://claudopus.ai/leaderboard/mira_k')))).toBeDefined()
  await pressed(stats, 'board-site')
  expect(await until(async () => shown.find(one => one.includes('https://claudopus.ai/leaderboard')))).toBeDefined()
  // Before joining: what is shown, what is never sent, how often, what public adds and what Leave does, each on a line of its own
  for (const text of [/^Your username, time of work/, /^Chat titles, your words/, /^As you join, then every 3 minutes/, /^Only if you turn it on/, /^Deletes your username and stats/]) expect(await said(text)).toBeDefined()
  // Minutes pass with the tab open: the board is read again, and nothing of yours is sent
  await clock.advance(10 * M)
  expect(boarded.filter(one => one.fn !== 'lb_board')).toEqual([])
  // A username with a space is refused here, before anything is sent
  await stats.input({ key: await field(), text: 'my name' })
  expect(await said(/^A username is 3 to 20 letters/)).toBeDefined()
  expect(boarded.filter(one => one.fn !== 'lb_board')).toEqual([])
  // Someone has it already
  files.set('board:lb_join', '{"code":"23505","message":"taken"}\n409')
  await stats.input({ key: await field(), text: 'dima' })
  expect(await said(/^Someone already has the username dima/)).toBeDefined()
  const joins = boarded.filter(one => one.fn === 'lb_join')
  expect(joins.length).toBe(1)
  // Only sums go, for each range: never a title, a path or anyone's words
  const sent = joins[0]?.body.p_stats as Record<string, Record<string, unknown>>
  expect(Object.keys(sent)).toEqual(['today', 'd7', 'd30', 'all'])
  expect([sent.all?.tokens, sent.all?.read, sent.all?.write, sent.all?.input]).toEqual([200, 70, 20, 10])
  expect(JSON.stringify(sent)).not.toContain('repo')
  // Joined: the secret is kept in the memory folder, and the figures follow every few minutes
  files.set('board:lb_join', '"secret-1"\n200')
  await stats.input({ key: await field(), text: 'dima' })
  expect(await said(/^✓ You joined as dima/)).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/leaderboard.json`) ?? '{}')).toMatchObject({ name: 'dima', token: 'secret-1', isPublic: false })
  files.set('board:lb_push', 'true\n200')
  await clock.advance(4 * M)
  expect(await until(async () => boarded.find(one => one.fn === 'lb_push' && one.body.p_token === 'secret-1' && one.body.p_public === false))).toBeDefined()
  // Public, then off the board at once
  await pressed(stats, 'board-public')
  expect(await said(/^✓ Your stats are public/)).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/leaderboard.json`) ?? '{}').isPublic).toBe(true)
  // The timeline, with no task names, goes only once the stats are public
  const pushed = boarded.filter(one => one.fn === 'lb_push')
  expect(Object.keys(pushed[0]?.body.p_stats as object)).not.toContain('timeline')
  expect(Object.keys(pushed.at(-1)?.body.p_stats as object)).toContain('timeline')
  expect(await said(/plus a breakdown by model and a timeline/)).toBeDefined()
  files.set('board:lb_leave', 'true\n200')
  await pressed(stats, 'board-leave')
  expect(await said(/^✓ You left the leaderboard/)).toBeDefined()
  expect(boarded.filter(one => one.fn === 'lb_leave')).toEqual([{ fn: 'lb_leave', body: { p_token: 'secret-1' } }])
  const pushes = boarded.filter(one => one.fn === 'lb_push').length
  await clock.advance(10 * M)
  expect(boarded.filter(one => one.fn === 'lb_push').length).toBe(pushes)
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
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Leaderboard', 'Memory', 'Config', 'About'])
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
