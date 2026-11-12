// The other Mac: its chats over ssh, the same results on both, and chats the app runs over ssh

test("a Mac that reaches another hands it this Mac's chats in the same trip, and leaves here the answers pressed there for them, once each", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // The M4 answers its clock, no chats, and one answer pressed there for this Mac's chat-b
  const pressed = JSON.stringify({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW, at: NOW, chat: 'chat-b' })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-answer---\n${NOW}-abc.json\n${pressed}\n---claudopus-answer---\nbad name\n${pressed}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const first = await until(async () => sshed.find(([command]) => command?.startsWith("sh -c 'L=")))
  // What it hands over says who this Mac is, what it calls the M4, and carries this Mac's chats only
  const [head = '', ...rest] = (first?.[1] ?? '').split('\n')
  expect(JSON.parse(head)).toEqual({ from: 'sams-macbook-air', you: 'm4' })
  expect(rest.join('\n')).toContain('"chat":"chat-b"')
  expect(first?.[0]).toContain('$L/pushed/sams-macbook-air.$$.part')
  expect(first?.[0]).not.toContain('rm -f 1')
  // The answer is left for chat-b as one pressed in another chat's panel; the one under a name it does not make is not
  const left = files.get(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)
  expect(JSON.parse(left ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', askAt: NOW })
  expect([...files.keys()].filter(path => path.includes('/live/answers/chat-b/'))).toHaveLength(1)
  // chat-b takes it; the next trip puts it away there, and carried again it is not left again
  files.delete(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)
  await clock.advance(10_000)
  const second = sshed.filter(([command]) => command?.startsWith("sh -c 'L=")).at(-1)
  expect(second?.[0]).toContain(`rm -f ${NOW}-abc.json`)
  expect(files.has(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)).toBe(false)
})

test("with another Mac named, the results become the same on both: what each lacks is copied over with its paths moved home, and what was done to one both have goes both ways", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const result = (id: string, more: object = {}) => ({ id, title: `Result ${id}`, subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: `${HOME}/repo`, gist: '', files: [], agent: '', ...more })
  // Here: "both", put away here, and "mine" only here. There: "both", with an answer given there, and "theirs" only there
  files.set(`${MEMORY}/reports/both/meta.json`, JSON.stringify(result('both', { archived: NOW, waiting: [{ text: 'Ship it?' }] })))
  files.set(`${MEMORY}/reports/both/report.md`, 'Both.\n')
  files.set(`${MEMORY}/reports/mine/meta.json`, JSON.stringify(result('mine')))
  files.set(`${MEMORY}/reports/mine/report.md`, 'Mine.\n')
  const there = JSON.stringify({ ...result('both', { waiting: [{ text: 'Ship it?', answer: 'Yes' }] }), folder: '/Users/sam/repo' })
  const theirs = JSON.stringify({ ...result('theirs'), folder: '/Users/sam/repo' })
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nboth\n111 222\n${there}\n---claudopus-result---\ntheirs\n3 4\n${theirs}\n`)
  files.set('remote:theirs/meta.json', theirs)
  files.set('remote:theirs/report.md', 'See /Users/sam/repo/a.png\n')
  await $.session.start(start)
  await clock.advance(10_000)
  // "theirs" is brought, whole, its paths on this Mac's home
  await until(async () => files.get(`${MEMORY}/reports/theirs/meta.json`))
  expect(files.get(`${MEMORY}/reports/theirs/meta.json`)).toContain(`"folder":"${HOME}/repo"`)
  expect(files.get(`${MEMORY}/reports/theirs/report.md`)).toBe(`See ${HOME}/repo/a.png\n`)
  expect(sshed.find(([script]) => script?.includes('tar xf - -C "$S"'))?.[1]).toContain('tar cf - theirs -C _sync _end')
  // "mine" is handed there, and only it
  const handed = await until(async () => sshed.find(([script]) => script?.includes(': > _end && COPYFILE_DISABLE=1 tar cf')))
  expect(handed?.[1]).toMatch(/ mine$/)
  // "both": the answer given there is kept here, and put away here goes there, written only if unchanged there since it was read
  const marked = await until(async () => sshed.find(([command]) => command?.includes('/reports/both/meta.json')))
  const here = JSON.parse(files.get(`${MEMORY}/reports/both/meta.json`) ?? '{}')
  expect(here.waiting).toEqual([{ text: 'Ship it?', answer: 'Yes' }])
  expect(here.archived).toBe(NOW)
  expect(marked?.[0]).toContain('= "111 222" ] || exit 3')
  expect(JSON.parse(marked?.[1] ?? '{}')).toMatchObject({ archived: NOW, folder: '/Users/sam/repo', waiting: [{ text: 'Ship it?', answer: 'Yes' }] })
  // Within the next two minutes it is not looked at again; nothing here was deleted
  await clock.advance(60_000)
  expect(sshed.filter(([command]) => command?.startsWith("sh -c 'echo $HOME;")).length).toBe(1)
  expect(files.get(`${MEMORY}/reports/mine/report.md`)).toBe('Mine.\n')
})

test("a result cut short on its way is never put in place, and a list cut short sends nothing either way", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const theirs = JSON.stringify({ id: 'theirs', title: 'T', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' })
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\ntheirs\n3 4\n${theirs}\n`)
  files.set('remote:theirs/meta.json', theirs)
  files.set('remote:theirs/report.md', 'All of it.\n')
  files.set('pull:cut', '1')
  files.set(`${MEMORY}/reports/mine/meta.json`, JSON.stringify({ ...JSON.parse(theirs), id: 'mine' }))
  await $.session.start(start)
  await clock.advance(10_000)
  await until(async () => sshed.find(([script]) => script?.includes('tar xf - -C "$S"')))
  await clock.advance(1_000)
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
  // Cut between its two files with tar ending well: no _end came, so it is not put in place either
  files.set('pull:cut', 'between')
  const pulls = sshed.filter(([script]) => script?.includes('tar xf - -C "$S"')).length
  await clock.advance(120_000)
  await until(async () => sshed.filter(([script]) => script?.includes('tar xf - -C "$S"')).length > pulls)
  await clock.advance(1_000)
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
  // Two minutes on, with the list cut short: nothing is brought, handed or marked
  files.delete('pull:cut')
  files.set('ssh:cut', '1')
  const before = sshed.length
  await clock.advance(120_000)
  expect(sshed.slice(before).filter(([script]) => !script?.startsWith("sh -c 'L=") && !script?.startsWith("sh -c 'echo $HOME;") && !script?.startsWith('find'))).toEqual([])
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
})

test('a result put away here and brought back on the other Mac by an older version stays brought back on both', async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' }
  files.set(`${MEMORY}/reports/r/meta.json`, JSON.stringify({ ...r, archived: NOW - 1000 }))
  // The last sync left it put away on both; there it is now neither put away nor brought back with a time
  files.set(`${MEMORY}/live/macs/sam-m4.local.results.json`, JSON.stringify({ syncedAt: 1, triedAt: 1, archived: { r: NOW - 1000 } }))
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nr\n1 2\n${JSON.stringify(r)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const here = await until(async () => {
    const one = JSON.parse(files.get(`${MEMORY}/reports/r/meta.json`) ?? '{}')
    return one.broughtBack ? one : undefined
  })
  expect(here.archived).toBeUndefined()
  // Nothing puts it away there again
  expect(sshed.some(([command, stdin]) => command?.includes('/reports/r/meta.json') && JSON.parse(stdin || '{}').archived)).toBe(false)
})

test('a result brought back after it was put away on the other Mac stays out of the archive, as the later of the two', async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' }
  files.set(`${MEMORY}/reports/r/meta.json`, JSON.stringify({ ...r, archived: NOW - 1000 }))
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nr\n1 2\n${JSON.stringify({ ...r, broughtBack: NOW })}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const here = await until(async () => {
    const one = JSON.parse(files.get(`${MEMORY}/reports/r/meta.json`) ?? '{}')
    return one.broughtBack ? one : undefined
  })
  expect(here.archived).toBeUndefined()
})

test("a Mac handed another Mac's chats lists them by name and Mac with its own, leaves an answer for them to be carried back, and drops them once that Mac stops handing them over", async ($, on) => {
  const { files, clock } = world(on)
  // No macs here: this is the Mac that cannot reach the other one. Its clock is an hour behind the other Mac's
  const ahead = NOW + 3_600_000
  const push = `${JSON.stringify({ from: 'sams-m5', you: 'sams-m4' })}\n${ahead / 1000}\n---claudopus-live---\n${otherChat(ahead, 'chat-m5', 'Robot arm')}\n---claudopus-live---\n${JSON.stringify({ chat: 'chat-idle', title: 'Quiet one', folder: '/x', host: '', at: ahead, cards: [] })}\n`
  files.set(`${MEMORY}/live/pushed/sams-m5.json`, push)
  files.set(`mtime:${MEMORY}/live/pushed/sams-m5.json`, String(NOW))
  // A copy laid under a name that is not the Mac it says handed it is passed over
  files.set(`${MEMORY}/live/pushed/other.json`, push)
  // This Mac's own chat with nothing running
  files.set(`${MEMORY}/live/chat-own.json`, JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW, cards: [] }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on sams-m5' })).toBeDefined()
  // The chats with nothing going on, of either Mac, are not listed, and this chat with nothing going on gets no heading
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Own quiet' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text' })).filter(one => one.text === 'Robot arm')).toHaveLength(1)
  // Its running time is told on this Mac's clock
  expect(await list.find({ type: 'Text', text: /^Opus 5\.5 · \d+s$|^Opus 5\.5 · 1m \d\ds$/ })).toBeDefined()
  // An answer pressed here waits in the outbox for that Mac
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  await list.press({ key: send?.key ?? '' })
  const left = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/live/outbox/sams-m5/`) && path.endsWith('.json')))
  expect(JSON.parse(files.get(left ?? '') ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', chat: 'chat-m5', askAt: ahead })
  // That Mac goes to sleep: its copy is not handed over again and goes stale, and its chats leave, as does the naming of this one
  await clock.advance(100_000)
  files.set(`${MEMORY}/live/chat-own.json`, JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW + 100_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("work on another Mac whose chat runs a version that drops a card as it ends, saying nothing of its end, turns happy here for its pause, then is gone", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const running = (at: number) => JSON.stringify({ ...JSON.parse(otherChat(at, 'chat-old', 'Remote connector')), cards: [JSON.parse(otherChat(at)).cards[1]] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${running(NOW)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Check the totals' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Working on 1 thing in another chat' })).toBeDefined()
  // The work ends: that chat, still open, writes its file with no card at all
  const quiet = JSON.stringify({ chat: 'chat-old', title: 'Remote connector', folder: '/repo/billing', host: '', at: NOW + 11_000, cards: [] })
  files.set('ssh:fetch', `${(NOW + 11_000) / 1000}\n---claudopus-live---\n${quiet}\n`)
  // It is seen at the next fetch, a second at a time so its pause is not passed over
  let seen
  for (let n = 0; n < 20 && !seen; n += 1) (await clock.advance(1000), (seen = await list.find({ type: 'Text', text: '✓ Finished' })))
  expect(seen).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Check the totals' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Just finished' })).toBeDefined()
  expect(await drawn(list)).toEqual(['happy'])
  // After its pause it is gone, and not kept under Finished, since its chat said nothing of how it ended
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Check the totals' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Nothing is running' })).toBeDefined()
  expect(await drawn(list)).toEqual(['mark'])
  expect((await list.findAll({ type: 'Button' })).some(b => /Finished/.test(String(b.props.label)))).toBe(false)
  // A chat that closes with its work running shows nothing finished: its work just leaves
  files.set('ssh:fetch', `${(NOW + 40_000) / 1000}\n---claudopus-live---\n${running(NOW + 40_000)}\n`)
  let back
  for (let n = 0; n < 20 && !back; n += 1) (await clock.advance(1000), (back = await list.find({ type: 'Text', text: 'Check the totals' })))
  expect(back).toBeDefined()
  files.set('ssh:fetch', `${(NOW + 60_000) / 1000}\n`)
  let finished
  for (let n = 0; n < 20; n += 1) (await clock.advance(1000), (finished ||= await list.find({ type: 'Text', text: '✓ Finished' })))
  expect(finished).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Check the totals' })).toBeUndefined()
  await list.unmount()
})

test("Details of work in a chat the app runs on another Mac shows what that chat shares, and one press opens that chat", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const chat = { chat: 'chat-m4', title: 'Video', folder: '/Users/sam/GitHub', host: '', at: NOW, link: { bridge: 'session_01Video', app: '' }, cards: [{ id: 'v1', parentId: '', isFork: false, tokens: 242_001, title: 'Improve the video', words: 'Can you improve the video?', items: [{ text: 'Find the cuts', state: 'done' }, { text: 'Have it checked', state: 'doing' }, { text: 'Show you', state: 'open' }], entries: [{ at: NOW - 1000, kind: 'note', text: 'Rendering again for a second look.' }], answer: '', startedAt: NOW - 60_000, endedAt: 0, status: 'working', model: 'claude-fable-5-2' }] }
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${JSON.stringify(chat)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Improve the video' }))).toBeDefined()
  const id = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-r-'))?.key?.replace(/^open-/, '').replace(/-\d+$/, '') ?? ''
  const tab = await $.ui.mount({ ...LIST, requestId: `work-${id}`, surface: 'desktop' } as never)
  const texts = (await tab.findAll({ type: 'Text' })).map(t => t.text)
  expect(texts).toContain('From the chat "Video", GitHub · on m4')
  expect(texts).toContain('“Can you improve the video?”')
  expect(texts).toContain('Have it checked')
  expect(texts).toContain('Rendering again for a second look.')
  expect(texts).toContain('Its chat is shown in the panel of the chat "Video" on m4, which runs it. Stop it or move it to another model there.')
  await pressed(tab, `their-chat-${id}`)
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01Video'])
  await tab.unmount()
  await list.unmount()
})

test("in a chat whose screen never says which tab it shows, as one the app runs over ssh, Details opens its tab once and leaves it drawn", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: false, isPlaced: true }]
  const { opened, closed, clock } = world(on, { live })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  await clock.advance(1000)
  expect(opened.filter(id => id === 'work-a1')).toHaveLength(1)
  expect(closed).not.toContain('work-a1')
  expect(live.find(one => one.id === 'work-a1')?.isPlaced).toBe(true)
  await pane.unmount()
})

test("where the screen says which tab it shows, a Details tab left behind the list is brought forward once the press has run", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { opened, closed, clock } = world(on, { live })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  await clock.advance(1000)
  expect(opened.filter(id => id === 'work-a1')).toHaveLength(2)
  expect(closed.filter(id => id === 'work-a1')).toHaveLength(1)
  await pane.unmount()
})

test("an empty tab an earlier version left open, not drawn, closes as the mod loads; the list and drawn tabs stay", async ($, on) => {
  const live = [
    { id: 'claudopus', isShown: true, isPlaced: true },
    { id: 'work-a9', isShown: false, isPlaced: false },
    { id: 'reports', isShown: false, isPlaced: true },
  ]
  const { closed } = world(on, { live })
  await $.session.start(start)
  expect(closed.filter(id => id !== 'agents')).toEqual(['work-a9'])
  expect(live.map(one => one.id)).toEqual(['claudopus', 'reports'])
})

test("a reload while the panel stayed up gives every button a key no load before used, so the app takes each afresh and a press works", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { opened, clock } = world(on, { live })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const before = (await keyed(pane, 'stats-open'))?.key
  expect(before).toBeDefined()
  // The code reloads from the folder it is watched in: the panel is still up, and the load runs again
  await clock.advance(7000)
  await $.session.start(start)
  const after = await until(async () => {
    const key = (await keyed(pane, 'stats-open'))?.key
    return key && key !== before ? key : undefined
  })
  expect(after).toBeDefined()
  await pressed(pane, 'stats-open')
  expect(opened).toContain('stats')
  // Another reload a moment later moves on again
  const again = (await keyed(pane, 'stats-open'))?.key
  await clock.advance(1)
  await $.session.start(start)
  expect(await until(async () => ((await keyed(pane, 'stats-open'))?.key !== again ? true : undefined))).toBe(true)
})

test("with no screen attached every tab waits undrawn, and none is closed as the mod loads", async ($, on) => {
  const live = [
    { id: 'claudopus', isShown: false, isPlaced: false },
    { id: 'work-a9', isShown: false, isPlaced: false },
  ]
  const { closed, clock } = world(on, { live })
  await $.session.start(start)
  await clock.advance(5000)
  expect(closed.filter(id => id !== 'agents')).toEqual([])
})

test("in a chat another Mac's app runs here over SSH, a chat's name is left for that Mac to open, never opened on this Mac", async ($, on) => {
  const { files, clock, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  // The Mac whose app runs this chat hands its chats here; one of them shares no link this Mac could open
  const push = `${JSON.stringify({ from: 'sams-m5', you: 'sams-m4' })}\n${NOW / 1000}\n---claudopus-live---\n${otherChat(NOW, 'chat-m5', 'Robot arm')}\n`
  files.set(`${MEMORY}/live/pushed/sams-m5.json`, push)
  files.set(`mtime:${MEMORY}/live/pushed/sams-m5.json`, String(NOW))
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ key: 'chat-open-sams-m5-chat-m5' }))).toBeDefined()
  await list.press({ key: 'chat-open-sams-m5-chat-m5' })
  await list.press({ key: 'chat-open--chat-b' })
  const left = () => [...files.keys()].filter(path => /\/live\/outbox\/sams-m5\/o-\d+-[a-z0-9]+\.json$/.test(path))
  expect(await until(async () => (left().length === 2 ? true : undefined))).toBe(true)
  expect(left().map(path => JSON.parse(files.get(path) ?? '{}').chat).sort()).toEqual(['chat-b', 'chat-m5'])
  expect(shown.filter(one => one[0] === 'open' && String(one[1]).startsWith('claude:'))).toEqual([])
  await list.unmount()
})

test('a name pressed on another Mac for this Mac is opened here, by what this Mac holds, once, and not when it waited too long', async ($, on) => {
  const { files, clock, shown, sshed } = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_self-1' } })
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${otherChat(NOW, 'chat-m4', 'Robot arm')}\n`)
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  // A chat of this Mac with nothing going on still opens by the link its file shares
  files.set(`${MEMORY}/live/chat-idle.json`, JSON.stringify({ chat: 'chat-idle', title: 'Quiet', folder: '/q', host: '', at: NOW, cards: [], link: { bridge: '', app: 'local_idle-1' } }))
  await $.session.start(start)
  await clock.advance(12_000)
  const now = NOW + 12_000
  const press = (chat: string, at: number) => `---claudopus-open---\n${JSON.stringify({ chat, at })}\n`
  files.set('ssh:opens', `${now / 1000}\n${press('chat-b', now - 1000)}${press('engine-id', now - 1000)}${press('chat-idle', now)}${press('chat-old', now - 60_000)}${press('bad id; rm', now)}`)
  await clock.advance(4000)
  const opened = () => shown.filter(one => one[0] === 'open').map(one => one[1])
  expect(await until(async () => (opened().length >= 3 ? true : undefined))).toBe(true)
  expect(opened().sort()).toEqual(['claude://code/continue?session=local_here-1', 'claude://code/continue?session=local_idle-1', 'claude://code/continue?session=local_self-1'])
  // Taken over the kept connection, from this Mac's own folder there
  expect(sshed.some(([command]) => command?.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/sams-macbook-air"))).toBe(true)
  await clock.advance(10_000)
  expect(opened()).toHaveLength(3)
})

test('presses left on another Mac are read with their clock, each chat once, the stale and malformed dropped', () => {
  const now = 1_700_000_000
  const text = `banner\n${now}\n---claudopus-open---\n{"chat":"a","at":${now * 1000 - 5000}}\n---claudopus-open---\n{"chat":"a","at":${now * 1000}}\n---claudopus-open---\n{"chat":"b","at":${now * 1000 - 31_000}}\n---claudopus-open---\nnot json\n---claudopus-open---\n{"chat":"$(x)","at":${now * 1000}}\n`
  expect(opensOf(text)).toEqual(['a'])
  expect(opensOf('')).toEqual([])
  expect(openTake('sams-m5')).toContain('live/outbox/sams-m5 ')
})

test("in a chat another Mac's app runs here, with no Mac handing its chats here, a name opens nothing on this Mac", async ($, on) => {
  const { files, clock, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  expect(await list.find({ key: 'chat-open--chat-b' })).toBeUndefined()
  expect(shown.filter(one => one[0] === 'open')).toEqual([])
  await list.unmount()
})
