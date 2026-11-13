// Every chat's work in every panel: other chats listed, answered from here, the header agreeing, ended work shared, names opening chats

// ---- Every chat's work in every panel ----

const NOW = 1_700_000_000_000
// This chat's own work as its file shares it with the other chats
const read$todos = async (files: Map<string, string>) => (JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards?.find((one: { id: string }) => one.id === 'a1') ?? {}) as { ask?: { text: string } }
// Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
const otherChat = (at: number, chat = 'chat-b', title = 'Billing page') =>
  JSON.stringify({
    chat,
    title,
    folder: '/repo/billing',
    host: '',
    at,
    cards: [
      { id: 'b1', parentId: '', isFork: false, tokens: 0, model: 'claude-opus-5-5', title: 'Send the invoices', words: 'send them', items: [{ text: 'Draft the mail', state: 'done' }], entries: [{ at, kind: 'note', text: 'I drafted the mail.' }], answer: '', ask: { text: 'May I send 12 invoices?', choices: ['Send', 'Not now'], from: 'b1', at }, startedAt: at - 60_000, endedAt: 0, status: 'working' },
      { id: 'b2', parentId: '', isFork: false, tokens: 0, title: 'Check the totals', words: 'check', items: [], entries: [{ at, kind: 'note', text: 'Adding up March.' }], answer: '', startedAt: at - 30_000, endedAt: 0, status: 'working' },
    ],
  })

test("the panel shows every open chat's running work under that chat's name, this chat's first; a chat gone silent shows none", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // A chat that has said nothing for minutes was closed, or its Mac sleeps
  files.set(`${MEMORY}/live/chat-c.json`, otherChat(NOW - 200_000, 'chat-c', 'Old landing page'))
  await clock.advance(5000)
  // This chat says what it runs, for the others
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards?.[0]?.title).toBe('Fix the nose')
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  expect(bold.indexOf('This chat')).toBeGreaterThan(-1)
  expect(bold.indexOf('This chat')).toBeLessThan(bold.indexOf('Fix the nose'))
  expect(bold.indexOf('Fix the nose')).toBeLessThan(bold.indexOf('Billing page'))
  // Under the other chat's name, its ask first
  expect(bold.indexOf('Billing page')).toBeLessThan(bold.indexOf('Send the invoices'))
  expect(bold.indexOf('Send the invoices')).toBeLessThan(bold.indexOf('Check the totals'))
  expect(bold).not.toContain('Old landing page')
  expect(await list.find({ type: 'Text', text: 'billing' })).toBeDefined()
  // The header counts every chat's: the ask first, then all that runs, here and there
  expect(await list.find({ type: 'Text', text: '1 thing needs you, 2 running' })).toBeDefined()
  // Another chat's work is stopped in its own chat: no Stop here, and its model is no control
  const buttons = (await list.findAll({ type: 'Button' })).map(one => one.key ?? '')
  expect(buttons.filter(key => key.startsWith('stop-'))).toEqual(['stop-a1'])
  expect(buttons.some(key => key.startsWith('model-r-'))).toBe(false)
  // The chat's own work ends: its file says so at once, so the others show it finished as this chat does
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{"cards":[]}').ended?.[0]?.status === 'done' ? true : undefined))).toBe(true)
  // Ended work is written apart from the running, so a chat still on a version that reads only the running cards never shows it as running
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards).toEqual([])
  // A chat of this Mac with no work is not listed in the others' panels
  files.set(`${MEMORY}/live/chat-d.json`, JSON.stringify({ chat: 'chat-d', title: 'Quiet chat', folder: '/repo/quiet', host: '', at: NOW + 6000, cards: [] }))
  await clock.advance(5000)
  expect(await list.find({ type: 'Text', text: 'Quiet chat' })).toBeUndefined()
  // It keeps saying it is open while it runs
  const was = JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').at
  await clock.advance(25_000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').at).toBeGreaterThan(was)
  // Once that chat stops saying so, its work leaves this panel
  await clock.advance(95_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Billing page' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("an ask of another chat's work is answered from this panel and reaches that chat's work; that chat acts on it as if pressed there", async ($, on) => {
  const { files, clock, appended } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  expect(send).toBeDefined()
  await list.press({ key: send?.key ?? '' })
  const left = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/live/answers/chat-b/`)))
  expect(JSON.parse(files.get(left ?? '') ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW })
  expect(left?.endsWith('.json')).toBe(true)
  // The ask leaves this panel at once
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Send') ? undefined : true))).toBe(true)
  // A reply in their own words to another chat's ask is left for that chat the same way, and its amber goes here at once
  // (a new title, so the file's size changes as a rewritten file's would)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW + 4000, 'chat-b', 'Billing pages'))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: 'May I send 12 invoices?' }))).toBeDefined()
  const other = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: other?.key ?? '', text: 'Only the March ones' })
  const replied = await until(async () => [...files.entries()].find(([path, body]) => path.startsWith(`${MEMORY}/live/answers/chat-b/`) && body.includes('Only the March ones'))?.[1])
  expect(JSON.parse(replied ?? '{}')).toMatchObject({ card: 'b1', choice: 'Only the March ones', isReply: true, askAt: NOW + 4000 })
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'May I send 12 invoices?' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: /^✓ You answered “Only the March ones” · sent to the chat "Billing pages"/ })).toBeDefined()
  // Its Details has the reply box, and says where its chat is
  const id = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-r-'))?.key?.replace(/^open-/, '').replace(/-\d+$/, '') ?? ''
  const details = await $.ui.mount({ ...LIST, requestId: `work-${id}`, surface: 'desktop' } as never)
  expect(await details.find({ type: 'Text', text: /Its chat is shown in the panel of the chat "Billing pages"/ })).toBeDefined()
  await list.unmount()
  await details.unmount()

  // The other way round: this chat's own work asks, and an answer another chat left for it arrives
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  // The clock has moved on 10 s in this test
  const t0 = NOW + 10_000
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  // One pressed for an earlier ask in the same words is dropped, as is one that waited too long; one for the ask that stands is acted on, once
  files.set(`${MEMORY}/live/answers/engine-id/0-z.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I delete the old repo?', askAt: NOW, at: NOW - 11 * 60_000 }))
  files.set(`${MEMORY}/live/answers/engine-id/1-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0 - 1000, at: NOW }))
  files.set(`${MEMORY}/live/answers/engine-id/2-b.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0, at: NOW }))
  await clock.advance(5000)
  const told = appended.filter(line => line.startsWith('a1: ') && line.includes('"Approve"'))
  expect(told).toHaveLength(1)
  expect(told[0]).toContain('May I delete the old repo?')
  expect([...files.keys()].filter(path => path.includes('/live/answers/engine-id/'))).toEqual([])
  // The answer clears the ask here too, and this chat's file says so to the other chats at its next write
  await clock.advance(1000)
  expect((await read$todos(files)).ask).toBeUndefined()
  // A reply in words another chat left for a new ask clears it the same way and reaches the work
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which repo?' } as never)
  await clock.advance(1000)
  expect((await read$todos(files)).ask?.text).toBe('Which repo?')
  files.set(`${MEMORY}/live/answers/engine-id/3-c.json`, JSON.stringify({ card: 'a1', choice: 'the old one', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 7000 }))
  await clock.advance(6000)
  expect(appended.find(line => line.startsWith('a1: ') && line.includes('the old one'))).toContain('Which repo?')
  expect((await read$todos(files)).ask).toBeUndefined()
  // A second reply in words left right after, with the ask already answered, still reaches the work
  files.set(`${MEMORY}/live/answers/engine-id/4-d.json`, JSON.stringify({ card: 'a1', choice: 'the one from 2024', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 13_000 }))
  await clock.advance(5000)
  expect(appended.find(line => line.startsWith('a1: ') && line.includes('the one from 2024'))).toContain('Which repo?')
})

test("with another Mac named in config.json, its chats' work shows here under its chat and Mac, an answer goes there over ssh, and a Mac that stops answering shows none", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local', '-oProxyCommand=bad'] }))
  // What the M4 answers: a login banner, its clock (an hour behind this Mac's), then its chat's file by its own clock
  const behind = NOW - 3_600_000
  files.set('ssh:fetch', `Welcome to the M4\n${behind / 1000}\n---claudopus-live---\n${otherChat(behind, 'chat-m4', 'Robot arm')}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  // Only a Mac that ssh takes as a name is reached
  expect(sshed.every(([command]) => command?.startsWith("sh -c 'L=") || command?.startsWith("sh -c 'echo $HOME;") || command?.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/") || command?.startsWith('d='))).toBe(true)
  expect(sshed.length).toBeGreaterThan(0)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on m4' })).toBeDefined()
  // Its running time is told on this Mac's clock: a minute and some, not an hour
  expect(await list.find({ type: 'Text', text: /^Opus 5\.5 · (\d+ of \d+ done · )?1m \d\ds$/ })).toBeDefined()
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  await list.press({ key: send?.key ?? '' })
  const sent = await until(async () => sshed.find(([command]) => command?.startsWith('d=')))
  expect(sent?.[0]).toContain('d=~/.claude/claudopus/live/answers/chat-m4 && mkdir -p $d && cat > $d/')
  expect(JSON.parse(sent?.[1] ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send' })
  // The M4 goes to sleep: what was fetched from it goes stale, and its work leaves the panel
  files.delete('ssh:fetch')
  await clock.advance(100_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("the header says in one line what every chat's cards say, and the octopus beside it agrees", () => {
  const head = (here: number, there: number, chats: number, asks = 0, isDone = false) => {
    const one = { here, there, chats, asks, isDone }
    return [headLine(one), headMood(one)]
  }
  expect(head(0, 0, 0)).toEqual(['Nothing is running', 'mark'])
  expect(head(1, 0, 0)).toEqual(['Working on 1 thing', 'working'])
  expect(head(2, 0, 0)).toEqual(['Working on 2 things', 'working'])
  expect(head(0, 1, 1)).toEqual(['Working on 1 thing in another chat', 'working'])
  expect(head(0, 3, 2)).toEqual(['Working on 3 things in 2 other chats', 'working'])
  expect(head(1, 1, 1)).toEqual(['Working on 2 things here and in 1 other chat', 'working'])
  expect(head(2, 3, 2)).toEqual(['Working on 5 things here and in 2 other chats', 'working'])
  expect(head(0, 0, 0, 1)).toEqual(['1 thing needs you', 'asking'])
  expect(head(1, 2, 1, 2)).toEqual(['2 things need you, 3 running', 'asking'])
  // A finish shows on the octopus for its moment whatever else goes on, the line still saying what needs the person or runs
  expect(head(0, 0, 0, 1, true)).toEqual(['1 thing needs you', 'happy'])
  expect(head(0, 1, 1, 0, true)).toEqual(['Working on 1 thing in another chat', 'happy'])
  expect(head(0, 0, 0, 0, true)).toEqual(['Just finished', 'happy'])
})

test("with work only in another chat the header and octopus are at work, amber while it asks, happy as it finishes, then at rest", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  // Only its running card, no ask
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, cards: file.cards.slice(1) }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Working on 1 thing in another chat' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['working'])
  expect(await list.find({ type: 'Text', text: /^Nothing/ })).toBeUndefined()
  // It asks: the line turns amber and says so, and the octopus waves amber
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 5000 }))
  await clock.advance(5000)
  const asks = await until(async () => list.find({ type: 'Text', text: '1 thing needs you, 1 running' }))
  expect(asks?.props.color).toBe('#E5A50A')
  expect(await drawn(list)).toEqual(['wave'])
  // Both finish: happy, "Just finished", for the pause; then at rest, "Nothing is running"
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 11_000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 10_500, ask: undefined })) }))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Just finished' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['happy'])
  await clock.advance(3000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Nothing is running' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['mark'])
  await list.unmount()
})

test("open chats with nothing going on are listed nowhere, on any Mac and however many, and a chat with work is listed by its name and Mac until that Mac stops answering", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = (at: number, chat: string, title: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle(NOW, 'chat-rc', 'M4 idle')}\n---claudopus-live---\n${otherChat(NOW, 'chat-m4', 'Robot arm')}\n`)
  // A hundred chats of this Mac open with nothing going on
  for (let n = 0; n < 100; n += 1) files.set(`${MEMORY}/live/chat-q${n}.json`, idle(NOW, `chat-q${n}`, `Quiet ${n}`))
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on m4' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: '1 thing needs you, 1 running' })).toBeDefined()
  // No idle chat by name, no row or count of them, and this chat, with nothing going on, gets no heading
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts.filter(one => /^Quiet \d+$|^M4 idle$|^[▸▾]? ?\d+ other chats?$/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Button' })).filter(one => /other chats?$/.test(String(one.props.label ?? '')))).toEqual([])
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  // No hover anywhere in the panel
  expect(JSON.stringify(await list.drawn())).not.toContain('"hover":{"display"')
  // Nothing about a fold is kept
  expect(files.has(`${MEMORY}/folds.json`)).toBe(false)
  // That Mac stops answering: its chat with work leaves too
  files.delete('ssh:fetch')
  await clock.advance(100_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("work that ends in another chat turns happy in this panel for its pause, then folds into Finished, which then holds every chat's", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  // Its running work finishes: that chat's file says so a moment later
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  const ended = { ...file, at: NOW + 6000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 5500, ask: undefined })) }
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify(ended))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ Finished' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Claudopus' })).toBeDefined()
  // After its pause it is in the Finished row, named as every chat's, and no longer under its chat
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: '✓ Finished' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'all chats' })).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).some(b => /Finished 2/.test(String(b.props.label)))).toBe(true)
  // On one Mac a chat with only ended work is not listed by name, and this chat's work gets no heading of its own for it
  expect(await list.find({ type: 'Text', text: 'Billing page' })).toBeUndefined()
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Fix the nose' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  await list.unmount()
})

test("while the person types a reply into an ask, work finishing here and in another chat still turns green and happy for its pause, then leaves", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await $.agent.spawn({ ...spawn, description: 'Submit the mod', prompt: 'submit the mod' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Submit it to the plugin directory.' } as never)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Not y', kind: 'change' } as never)
  // This chat's work finishes mid-typing: green and happy at once, then gone after its pause, the times still held
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ Finished' })))?.props.color).toBe('success')
  expect(await drawn(list)).toContain('happy')
  await clock.advance(2_100)
  expect(await until(async () => ((await list.find({ type: 'Text', text: /Draw the eyes/ })) ? undefined : true))).toBe(true)
  // Another chat's work finishes mid-typing: the same
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 8000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 7500, ask: undefined })) }))
  await list.input({ key: box?.key ?? '', text: 'Not ye', kind: 'change' } as never)
  // This panel reads the other chats every few seconds: the pause runs from the look that saw the end
  for (let n = 0; n < 6 && !(await list.find({ type: 'Text', text: '✓ Finished' })); n += 1) await clock.advance(1000)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ Finished' })))?.props.color).toBe('success')
  expect(await drawn(list)).toContain('happy')
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: '✓ Finished' })) ? undefined : true))).toBe(true)
  // The half reply is still in its box
  expect((await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))?.props.value).toBe('Not ye')
  await list.unmount()
})

test('a chat shares the work that ended lately, the newest few, and not work that ended long ago', async () => {
  const card = (id: string, endedAt: number) => ({ id, parentId: '', isFork: false, tokens: 0, title: id, words: '', items: [], entries: [], answer: '', startedAt: endedAt - 10, endedAt, status: 'done' as const })
  const list = [card('old', NOW - 13 * 3_600_000), ...Array.from({ length: 12 }, (_, i) => card(`n${i}`, NOW - i * 1000))]
  const shared = shareable(list as never, NOW).map(one => one.id)
  expect(shared).toHaveLength(10)
  expect(shared).not.toContain('old')
  expect(shared).not.toContain('n11')
})

test("a chat shares what opens it, and nothing of what was said in it", async ($, on) => {
  const { files, clock } = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } })
  files.set(`${HOME}/.claude/sessions/41.json`, JSON.stringify({ sessionId: 'someone-else', bridgeSessionId: 'session_01Other' }))
  files.set(`${HOME}/.claude/sessions/42.json`, JSON.stringify({ sessionId: 'engine-id', hostSessionId: 'local_ab12-cd34', bridgeSessionId: 'session_01Mine', updatedAt: 5 }))
  files.set(`${MEMORY}/words/engine-id.md`, '## 2026-11-12T07:00:00.000Z\nSum up last month\n\n### Claude 2026-11-12T07:01:00.000Z\nHere it is.\n\n')
  await $.session.start(start)
  const shared = () => JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}')
  expect(shared().link).toEqual({ bridge: 'session_01Mine', app: 'local_ab12-cd34' })
  await $.prompt.submit({ text: 'And this month?', origin: composer } as never)
  await $.turn.complete({ answer: 'Here it is again.', reason: 'end_turn' } as never)
  await clock.advance(1000)
  expect(shared().said).toBeUndefined()
  expect(files.get(`${MEMORY}/live/engine-id.json`) ?? '').not.toContain('this month')
})

test("another chat's name, shown while it has something going on, opens that chat in the app when pressed, and shows nothing more under it", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const busy = (chat: string, title: string, extra: object) => JSON.stringify({ ...JSON.parse(otherChat(NOW, chat, title)), ...extra })
  // An old chat still shares what was said: it is not shown
  const withLink = busy('chat-rc', "Last month's work summary", { said: { you: 'Sum up last month', youAt: NOW, reply: 'Here is the summary.', replyAt: NOW }, link: { bridge: 'session_01Summary', app: 'local_m4-only' } })
  // A chat of the other Mac with Remote Control off: the app's own id there opens nothing here; an id of no allowed shape is dropped
  const noLink = busy('chat-t', 'Terminal chat', { link: { bridge: 'session_; rm -rf ~', app: 'local_m4-two' } })
  // A chat this Mac's app runs on the other Mac over SSH: the app holds it under its own id, so it opens as the sidebar opens it
  const viaSsh = busy('chat-s', 'SSH chat', { link: { bridge: '', app: 'local_run-from-here' } })
  files.set(`${HOME}/Library/Application Support/Claude/claude-code-sessions/acct/org/local_run-from-here.json`, '{}')
  // One run from here on a version that shares no link at all: the app's own file for it names its chat
  const old = busy('chat-old', 'Old version chat', {})
  files.set(`${HOME}/Library/Application Support/Claude/claude-code-sessions/acct/org/local_old-one.json`, JSON.stringify({ sessionId: 'local_old-one', cliSessionId: 'chat-old' }))
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${withLink}\n---claudopus-live---\n${noLink}\n---claudopus-live---\n${viaSsh}\n---claudopus-live---\n${old}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: "Last month's work summary" }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Terminal chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Here is the summary.' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Sum up last month' })).toBeUndefined()
  expect(JSON.stringify(await list.drawn())).not.toContain('"hover":{"display"')
  // The chat with Remote Control opens by its Remote Control id, the one this Mac's app runs by the app's own id; the one of the
  // other Mac's own app without Remote Control has no press at all
  expect(await until(async () => list.find({ key: 'chat-open-sam@m4.local-chat-s' }))).toBeDefined()
  const buttons = (await list.findAll({ type: 'Button' })).map(one => String(one.key))
  expect(buttons.filter(key => key.startsWith('chat-open-')).sort()).toEqual(['chat-open-sam@m4.local-chat-old', 'chat-open-sam@m4.local-chat-rc', 'chat-open-sam@m4.local-chat-s'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-old' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_old-one'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-rc' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/session_01Summary'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-s' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_run-from-here'])
  await list.unmount()
})

test("a chat of this Mac with work opens by the app's own id when it has no Remote Control", async ($, on) => {
  const { files, clock, shown } = world(on)
  const mine = JSON.parse(otherChat(NOW)) as Record<string, unknown>
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...mine, link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ key: 'chat-open--chat-b' }))).toBeDefined()
  await list.press({ key: 'chat-open--chat-b' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_here-1'])
  await list.unmount()
})
