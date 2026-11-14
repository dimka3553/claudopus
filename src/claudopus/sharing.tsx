// Every chat's work in every chat's panel: this chat's file, the others' read, chats opened and answered from another chat
// (../../mods/claudopus/hooks/shared.ts says how)

// ---- The work of every chat, in every chat's panel (shared.ts says how) ----

const others = atom({ plugin: 'claudopus', key: 'others' } as const, [], { shape: 'others-1' })
const liveDir = () => `${dir}/${LIVE_DIR}`
// What this chat last wrote to its file and when: written again when it changes or its beat is due, with work or without, so the
// panels of other Macs list it as open. It is removed as the chat ends
let sharedSign = ''
let sharedAt = 0
const ownLive = (id: string) => `${liveDir()}/${id}.json`
// Set as the session ends, so a beat due after it does not write the file again
let isEnded = false
// What opens this chat in the Claude app, read off the engine's own file of this session in ~/.claude/sessions (its Remote Control id
// appears there once Remote Control is on) at most once a beat; the file found is read again alone until it no longer names this chat
let myLink: Link | undefined
let linkReadAt = 0
let linkFile = ''
const readLink = async ($: EngineInterface, id: string): Promise<Link | undefined> => {
  const folder = `${(await $.env.get('HOME')) ?? ''}/.claude/sessions`
  type Entry = { sessionId?: string; hostSessionId?: string; bridgeSessionId?: string; updatedAt?: number }
  const entryOf = async (name: string) => JSON.parse((await readOr($, `${folder}/${name}`)) || '{}') as Entry
  let found = linkFile ? await entryOf(linkFile).catch(() => ({}) as Entry) : ({} as Entry)
  if (found.sessionId !== id) {
    linkFile = ''
    found = {}
    for (const entry of await $.fs.list(folder).catch(() => [])) {
      if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue
      const one = await entryOf(entry.name).catch(() => ({}) as Entry)
      if (one.sessionId === id && (one.updatedAt ?? 0) >= (found.updatedAt ?? 0)) ((found = one), (linkFile = entry.name))
    }
  }
  const host = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
  const bridge = typeof found.bridgeSessionId === 'string' && BRIDGE_ID.test(found.bridgeSessionId) ? found.bridgeSessionId : ''
  const app = APP_ID.test(host) ? host : typeof found.hostSessionId === 'string' && APP_ID.test(found.hostSessionId) ? found.hostSessionId : ''
  return bridge || app ? { bridge, app } : undefined
}
const shareMine = async ($: EngineInterface) => {
  const { id, title } = await read($, me)
  if (!id || !dir || isOff || isEnded) return
  const now = await $.clock.now()
  if (now - linkReadAt >= BEAT) {
    linkReadAt = now
    myLink = await readLink($, id).catch(() => myLink)
  }
  const cards = shareable(await read($, todos), now)
  const shareOf = ({ tool: _tool, agent: _agent, snippet: _snippet, seen: _seen, isTold: _told, input: _input, ...p }: Waiting): Prompt => p
  const prompts: Prompt[] = waiting.map(shareOf)
  // Answered prompts go apart, so a chat of an older version, which reads only `prompts`, never shows one as still open
  const answeredNow: Prompt[] = answeredShown(now).map(shareOf)
  const sign = `${title}\n${JSON.stringify(myLink ?? null)}\n${signOf(cards)}\n${prompts.map(one => one.id).join(' ')}\n${answeredNow.map(one => `${one.id}:${one.answered}:${one.isRunning ? 1 : 0}`).join(' ')}`
  if (sign === sharedSign && now - sharedAt < BEAT) return
  const s: Shared = { chat: id, title, folder: cwd, host: '', at: now, cards, ...(prompts.length ? { prompts } : {}), ...(answeredNow.length ? { answeredPrompts: answeredNow } : {}), ...(myLink ? { link: myLink } : {}) }
  // Ended work is written apart, under `ended`: a chat still running a version from before ended work was shared reads `cards` only,
  // and would show what is there as running for good
  const isLive = (one: Todo) => one.status === 'working' || Boolean(one.ask)
  const ended = cards.filter(one => !isLive(one))
  await $.fs.write(ownLive(id), JSON.stringify({ ...s, cards: cards.filter(isLive), ...(ended.length ? { ended } : {}) }))
  sharedSign = sign
  sharedAt = now
}
// This chat's file goes as its session ends, and when it starts (a file a crash or a reload left behind): the others drop its cards
// at once, not after STALE
const unshare = async ($: EngineInterface, isSure = false) => {
  const { id } = await read($, me)
  if (!id || !dir || (!sharedSign && !isSure)) return
  sharedSign = ''
  if (await $.fs.exists(ownLive(id)).catch(() => false)) await $.process.run(['rm', '-f', ownLive(id)]).catch(() => undefined)
}
let pushedYou = ''
let pushedLatest = ''
// Whether this Mac lists other Macs' chats, and what it calls itself beside them
const isMulti = () => macs.length > 0 || pushedFrom.size > 0
const selfName = () => (isMulti() ? pushedYou || localName : '')

// When this panel saw each of another chat's pieces of work end, by its id here; 0 for one that had ended well before
const endSeen = new Map<string, number>()
const SEEN_ENDING = 60_000
// Whether ended work is in its pause after ending: this chat's from its end, another chat's from when this panel saw it end
const lingers = (one: Todo, at: number) => {
  if (!one.chat) return isLingering(one, at)
  const seen = endSeen.get(one.id) ?? 0
  return one.status !== 'working' && seen > 0 && at >= seen && at - seen < LINGER
}
// Another chat's running work as last read, by its id here, with its chat: a chat on a version from before ended work was shared
// drops a card from its file as the work ends, saying nothing of how. Such a card, gone while its chat is still there, is shown
// finished for its pause, green with the happy octopus as any other finish, and is then gone: what is not known is not kept
const lastRunning = new Map<string, { chat: string; card: Todo; at: number; of: Shared }>()
// The cards shown finished that way, by id here, with when they were seen gone; only for their pause
const vanished = new Map<string, { chat: string; card: Todo; at: number; of: Shared }>()
const isVanished = (id: string) => vanished.has(id)
// The files of other chats, as last read, by name: a file is read again only when it changed
const liveRead = new Map<string, { key: string; text: string }>()
const isWhole = (text: string) => {
  try {
    return Boolean(JSON.parse(text))
  } catch {
    return false
  }
}
const readOthers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const now = await $.clock.now()
  const wasSelf = `${isMulti()}:${selfName()}`
  // What other Macs handed this one: a copy not handed again for STALE (that Mac asleep or its chats closed) says nothing now
  const pushed: Shared[] = []
  // Every chat still open, with or without anything going on, as host/chat
  const open = new Set<string>()
  // Gathered apart and put in place at the end, so what this Mac knows of them holds while they are read
  const from = new Set<string>()
  let you = ''
  let youAt = 0
  let latest = ''
  let latestAt = 0
  for (const entry of (await $.fs.list(`${liveDir()}/${PUSHED}`).catch(() => [])).filter(one => one.kind === 'file' && one.name.endsWith('.json'))) {
    const at = entry.mtimeMs || now
    if (now - at > STALE) continue
    const text = await readOr($, `${liveDir()}/${PUSHED}/${entry.name}`)
    const head = pushHead(text)
    if (!head || `${head.from}.json` !== entry.name) continue
    from.add(head.from)
    if (head.you && at >= youAt) (you = head.you, (youAt = at))
    if (at >= latestAt) (latest = head.from, (latestAt = at))
    pushed.push(...fetchedOf(text, head.from, at))
    for (const one of fetchedOpen(text, head.from)) open.add(one)
  }
  pushedFrom.clear()
  for (const one of from) pushedFrom.add(one)
  pushedYou = you
  pushedLatest = latest
  if (macs.length) await knowLocalName($)
  const found: Shared[] = []
  // The chats open on this Mac with something going on
  const here = new Set<string>([id])
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== `${id}.json`)
  for (const name of [...liveRead.keys()]) if (!listed.some(entry => entry.name === name)) liveRead.delete(name)
  for (const entry of listed) {
    // A file not written for longer than STALE is a chat gone silent: not read at all
    if (entry.mtimeMs && now - entry.mtimeMs > STALE) continue
    const key = `${entry.mtimeMs}:${entry.size}`
    const was = liveRead.get(entry.name)
    const text = was && entry.mtimeMs && was.key === key ? was.text : await readOr($, `${liveDir()}/${entry.name}`)
    const one = sharedOf(text, now)
    // A file caught half-written is read again at the next look, not kept as read; a whole one of a chat with nothing going on is
    // kept as read, so a hundred idle chats are not read again at every look
    if (openChatOf(text, now)) open.add(openChatOf(text, now))
    if (one || isWhole(text)) liveRead.set(entry.name, { key, text })
    else liveRead.delete(entry.name)
    if (one) here.add(one.chat)
    // Only a chat with something going on is read as one: work running or ended lately, or a prompt open
    if (one && one.chat !== id) found.push(one)
  }
  // The chats of the Macs this one reaches, whose asks and finishes are told here
  const fromMacs: Shared[] = []
  for (const mac of macs) {
    const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
    // A copy not fetched again for STALE says nothing of that Mac now
    if (!f.text || now - (f.fetchedAt ?? 0) > STALE) continue
    for (const one of fetchedOpen(f.text, mac)) open.add(one)
    // A Mac named that is this one shows its chats once, as this Mac's
    for (const one of fetchedOf(f.text, mac, f.fetchedAt)) if (!here.has(one.chat)) (here.add(one.chat), found.push(one), fromMacs.push(one))
  }
  await tellAfar($, fromMacs, now).catch(err => log($, `other Macs' asks not told: ${String(err)}`))
  const isOffChanged = await lookAfar($, now).catch(() => false)
  // A chat both fetched and handed over, as when two Macs each name the other, is listed once, as fetched
  for (const one of pushed) if (!here.has(one.chat)) (here.add(one.chat), found.push(one))
  // Work gone from a chat still open, with no word of its end: finished, for its pause. A chat with nothing left going on is not
  // among those found, so it is listed again for that pause from what was last read of it
  const chatKey = (s: { host: string; chat: string }) => `${s.host}/${s.chat}`
  const present = new Map(found.map(s => [chatKey(s), s]))
  for (const [key, was] of [...lastRunning]) {
    if (!open.has(was.chat)) {
      if (now - was.at > STALE) lastRunning.delete(key)
      continue
    }
    lastRunning.delete(key)
    const s = present.get(was.chat)
    // A card gone from its chat's list went with that chat, which is closed: nothing reads an answer left for it, so its ask goes too
    if (!s?.cards.some(card => remoteId(s, card.id) === key) && !vanished.has(key)) vanished.set(key, { chat: was.chat, card: { ...was.card, status: 'done', endedAt: now, ask: undefined }, at: now, of: was.of })
  }
  for (const s of found) for (const card of s.cards.filter(one => one.status === 'working')) lastRunning.set(remoteId(s, card.id), { chat: chatKey(s), card, at: now, of: { ...s, cards: [], prompts: undefined, answeredPrompts: undefined } })
  for (const [key, one] of [...vanished]) {
    const s = present.get(one.chat)
    if (!open.has(one.chat) || now - one.at > LINGER + LOOK_EVERY || s?.cards.some(card => remoteId(s, card.id) === key)) vanished.delete(key)
    else if (s) s.cards = [...s.cards, one.card]
    else {
      const back = { ...one.of, cards: [one.card] }
      found.push(back)
      present.set(one.chat, back)
    }
  }
  // Work of another chat seen ending, by its id here: it turns happy for its pause from when this panel saw it end, as another
  // chat's file reaches here seconds later. Work that ended well before this panel saw it goes to Finished at once
  const ids = new Set<string>()
  for (const s of found)
    for (const card of s.cards.filter(one => one.status !== 'working')) {
      const key = remoteId(s, card.id)
      ids.add(key)
      if (endSeen.has(key)) continue
      const isNew = now - card.endedAt < SEEN_ENDING
      endSeen.set(key, isNew ? now : 0)
      if (isNew) $.clock.after(LINGER + 20, () => void update($, tick, n => n + 1))
    }
  for (const key of [...endSeen.keys()]) if (!ids.has(key)) endSeen.delete(key)
  const isAppChanged = found.some(s => s.host) && (await readAppIds($, now).catch(err => (void log($, `app's chats not listed: ${String(err)}`), false)))
  const next = ordered(found)
  if (JSON.stringify(next) !== JSON.stringify(await read($, others))) await update($, others, () => next)
  else if (`${isMulti()}:${selfName()}` !== wasSelf || isAppChanged || isOffChanged) redraw($)
}

// The chats this Mac's Claude app holds: its session files, one per chat, under
// ~/Library/Application Support/Claude/claude-code-sessions/<account>/<org>/local_….json, each naming the engine's id for that chat
// (`cliSessionId`, the id a chat shares as `chat`). They include the chats it runs on another Mac over SSH, which a press then opens
// by the app's own id as its sidebar does, whatever version of the mod runs there. Listed again at most every half minute; a file is
// read once, as the id it names never changes
const appIds = new Set<string>()
const appOfChat = new Map<string, string>()
const appFiles = new Map<string, string>()
// The title the app gives each chat it holds, by the chat's id, as read with its file
const appTitles = new Map<string, string>()
let appIdsAt = 0
// The app's own id for a chat this Mac's app holds, or ''
const heldApp = (c: Shared) => (c.link?.app && appIds.has(c.link.app) ? c.link.app : (appOfChat.get(c.chat) ?? ''))
// Answers whether what it holds changed, so the names it opens are drawn again
const readAppIds = async ($: EngineInterface, now: number) => {
  if (now - appIdsAt < 30_000) return false
  appIdsAt = now
  const root = `${(await $.env.get('HOME')) ?? ''}/Library/Application Support/Claude/claude-code-sessions`
  const found = new Map<string, string>()
  for (const account of await $.fs.list(root).catch(() => []))
    for (const org of account.kind === 'dir' ? await $.fs.list(`${root}/${account.name}`).catch(() => []) : [])
      for (const one of org.kind === 'dir' ? await $.fs.list(`${root}/${account.name}/${org.name}`).catch(() => []) : []) {
        const app = one.name.replace(/\.json$/, '')
        if (!one.name.endsWith('.json') || !APP_ID.test(app)) continue
        if (!appFiles.has(app)) {
          const text = await readOr($, `${root}/${account.name}/${org.name}/${one.name}`).catch(() => '')
          const chat = (() => {
            try {
              return String((JSON.parse(text) as { cliSessionId?: unknown }).cliSessionId ?? '')
            } catch {
              return ''
            }
          })()
          if (text) appFiles.set(app, /^[A-Za-z0-9_-]{1,80}$/.test(chat) ? chat : '')
          const title = (() => {
            try {
              const t = (JSON.parse(text) as { title?: unknown }).title
              return typeof t === 'string' ? t.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim().slice(0, 120) : ''
            } catch {
              return ''
            }
          })()
          if (text && title && appFiles.get(app)) appTitles.set(appFiles.get(app) ?? '', title)
        }
        found.set(app, appFiles.get(app) ?? '')
      }
  const isSame = found.size === appIds.size && [...found.keys()].every(one => appIds.has(one))
  appIds.clear()
  appOfChat.clear()
  for (const app of [...appFiles.keys()]) if (!found.has(app)) appFiles.delete(app)
  for (const [app, chat] of found) (appIds.add(app), chat && appOfChat.set(chat, app))
  return !isSame
}

// A press on another chat's name: that chat in the Claude app, as a notification's click opens this one. Nothing else is run
// In a chat another Mac's Claude app runs here over SSH the app, and the screen it draws on, are that Mac's: a press is left for
// that Mac (the one that hands its chats here, the freshest of them), which opens the chat there
const openChat = async ($: EngineInterface, c: Shared) => {
  const there = drawnFrom()
  // Never opened on this Mac, whose screen is not the one the press was made on: with no Mac handing its chats here, nowhere
  if (isRunFromAfar && !there) return void log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} not opened: no Mac hands its chats here to open it`)
  if (there) {
    const at = await $.clock.now()
    const r = await leaveHere($, `${OUTBOX}/${there}`, `o-${at}-${Math.random().toString(36).slice(2, 8)}`, { chat: c.chat, at })
    return void log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} ${r.exitCode === 0 ? `left for ${there} to open` : `not left for ${there}: ${r.stderr.trim().slice(0, 160)}`}`)
  }
  const url = openUrl(c, heldApp(c))
  if (url) await openHere($, c, url)
}
const openHere = async ($: EngineInterface, c: { chat: string; host: string }, url: string) => {
  const r = await $.process.run(['open', url]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  await log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} ${r.exitCode === 0 ? `opened: ${url}` : `not opened: ${r.stderr.trim().slice(0, 160)}`}`)
}
// Whether this chat runs here for another Mac's Claude app, over SSH: the app's own runner says so, once, at the start
let isRunFromAfar = false
const drawnFrom = () => (isRunFromAfar ? pushedLatest : '')
// What a press on a name does in this chat: 'there' for that Mac to open, '' for none, else the link opened here
const pressOf = (c: Shared) => (isRunFromAfar ? (pushedLatest ? 'there' : '') : openUrl(c, heldApp(c)))
// The presses left on each Mac named under macs for this one, taken every OPEN_EVERY by whichever chat here comes first, and each
// chat they name opened here as a press here opens it: this chat, another of this Mac's, or one of that Mac's this app holds
let isTaking = false
const takeOpens = async ($: EngineInterface) => {
  if (isTaking) return
  isTaking = true
  try {
    const from = await knowLocalName($)
    for (const mac of macs) {
      const now = await $.clock.now()
      const stamp = `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.opens`
      if (now - (Number(await readOr($, stamp)) || 0) < OPEN_EVERY - 250) continue
      // A Mac that has not answered a trip for STALE, asleep or gone, is not asked every few seconds
      const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
      if (now - (f.fetchedAt ?? 0) > STALE) continue
      await $.fs.write(stamp, String(now))
      const r = await $.process.run(ssh(mac, openTake(from)), { timeoutMs: 8_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
      if (r.exitCode !== 0) continue
      for (const chat of opensOf(r.stdout)) await openTaken($, chat, mac)
    }
  } finally {
    isTaking = false
  }
}
const openTaken = async ($: EngineInterface, chat: string, mac: string) => {
  const { id } = await read($, me)
  if (chat === id) {
    const session = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
    return DESKTOP_SESSION.test(session) ? openHere($, { chat, host: '' }, `claude://code/continue?session=${session}`) : log($, `chat ${chat} pressed on ${mac}: not in the Claude app here`)
  }
  const c = (await read($, others)).find(one => one.chat === chat)
  // A chat of this Mac with nothing going on now still opens by the link its own file shares
  let mine: Link | undefined
  try {
    mine = c ? undefined : linkOf((JSON.parse((await readOr($, `${liveDir()}/${chat}.json`)) || '{}') as { link?: unknown }).link)
  } catch {
    mine = undefined
  }
  const url = c ? openUrl(c, heldApp(c)) : mine ? openUrl({ host: '', link: mine }) : ''
  if (url) await openHere($, c ?? { chat, host: '' }, url)
  else await log($, `chat ${chat} pressed on ${mac}: nothing here opens it`)
}

// An answer pressed here for another chat's work, left for that chat: on this Mac in its folder of answers, on a Mac named under
// macs over ssh, for a chat of a Mac that handed it over in this Mac's outbox for that Mac, which its next trip carries back. Each is
// written under another name and then renamed, so it is never read half-written. The ask leaves this panel at once; that chat's own
// file brings it back if the work asks again, and an answer that could not be left says so and brings the ask back
const answeredHere = new Set<string>()
const leaveHere = ($: EngineInterface, folder: string, name: string, body: unknown) =>
  $.fs
    .write(`${liveDir()}/${folder}/${name}.part`, JSON.stringify(body))
    .then(() => $.process.run(['mv', '-f', `${liveDir()}/${folder}/${name}.part`, `${liveDir()}/${folder}/${name}.json`]))
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
const leaveAnswer = async ($: EngineInterface, chat: { id: string; host: string }, answer: Answer) => {
  const name = `${answer.at}-${Math.random().toString(36).slice(2, 8)}`
  const mac = chat.host ? macs.find(m => m === chat.host) : undefined
  const folder = `${ANSWERS}/${chat.id}`
  return !chat.host
    ? await leaveHere($, folder, name, answer)
    : mac
      ? await $.process
          .run(ssh(mac, `d=~/.claude/claudopus/${LIVE_DIR}/${folder} && mkdir -p $d && cat > $d/${name}.part && mv $d/${name}.part $d/${name}.json`), { stdin: JSON.stringify(answer), timeoutMs: 15_000 })
          .catch(err => ({ exitCode: -1, stderr: String(err) }))
      : isKey(chat.host) && pushedFrom.has(chat.host)
        ? await leaveHere($, `${OUTBOX}/${chat.host}`, name, { ...answer, chat: chat.id })
        : { exitCode: -1, stderr: 'that Mac is no longer named in config.json' }
}
// A Yes or No pressed here on another chat's prompt, left for that chat as an answer whose card is `prompt:<its id>`: that chat answers
// its prompt as if pressed there. Until that chat's file moves it to answered, its card here says what was pressed in place of buttons
const PROMPT_ANSWER = 'prompt:'
const promptsPressed = new Map<string, 'yes' | 'no'>()
const answerPromptElsewhere = async ($: EngineInterface, c: Shared, p: Prompt, said: 'yes' | 'no') => {
  presses += 1
  const key = `${c.host}:${c.chat}:${p.id}`
  if (promptsPressed.has(key) || !/^[A-Za-z0-9_-]+$/.test(c.chat)) return
  promptsPressed.set(key, said)
  redraw($)
  const at = await $.clock.now()
  const r = await leaveAnswer($, { id: c.chat, host: c.host }, { card: `${PROMPT_ANSWER}${p.id}`, choice: said, isReply: false, ask: p.text, askAt: p.at, at })
  if (r.exitCode !== 0) {
    promptsPressed.delete(key)
    redraw($)
    await log($, `answer to a prompt of the chat ${c.chat}${c.host ? ` on ${c.host}` : ''} not left: ${r.stderr.trim().slice(0, 160)}`)
  }
}
const answerElsewhere = async ($: EngineInterface, one: Todo, choice: string, isReply: boolean) => {
  const ask = one.ask
  const said = choice.trim()
  const chat = one.chat
  if (!ask || !said || !chat || !/^[A-Za-z0-9_-]+$/.test(chat.id)) return
  // A second press on an ask already answered here sends nothing. A reply that does not settle it leaves the ask shown here, as its
  // own chat keeps it open, so a button can still answer it; the same reply sent twice at once counts once
  const isHeld = !settles(ask, said, isReply)
  const mark = isHeld ? `${one.id}:${ask.at}:${ask.replied?.at ?? ''}:${said}` : `${one.id}:${ask.at}`
  if (answeredHere.has(`${one.id}:${ask.at}`) || answeredHere.has(mark)) return
  drafts.delete(one.id)
  if (!isHeld) replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  if (isReply) freeTimes()
  answeredHere.add(mark)
  const at = await $.clock.now()
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'other', at, line: lineOf(one), isHeld })
  redraw($)
  const answer: Answer = { card: chat.agent, choice: said, isReply, ask: ask.text, askAt: ask.at, at }
  const r = await leaveAnswer($, chat, answer)
  if (r.exitCode !== 0) {
    answeredHere.delete(mark)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'lost', at, line: lineOf(one) })
    redraw($)
    await log($, `answer for the chat ${chat.id}${chat.host ? ` on ${chat.host}` : ''} not left: ${r.stderr.trim().slice(0, 160)}`)
  }
}
// Answers other chats left for this one's work: each acted on as if pressed here, once, then put away. A press answers the ask it
// was pressed for and no later one, even in the same words; a reply in words goes to the work whatever it asks now; an answer that
// waited past ANSWER_KEPT is dropped
const takenAnswers = new Set<string>()
const readAnswers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const folder = `${liveDir()}/${ANSWERS}/${id}`
  const all = (await $.fs.list(folder).catch(() => [])).filter(entry => entry.name.endsWith('.json'))
  // One taken already and left again, as an answer another Mac's trip carried twice, is put away unread
  for (const entry of all.filter(one => takenAnswers.has(one.name))) await $.process.run(['rm', '-f', `${folder}/${entry.name}`]).catch(() => undefined)
  const entries = all.filter(entry => !takenAnswers.has(entry.name))
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    takenAnswers.add(entry.name)
    const path = `${folder}/${entry.name}`
    const answer = answerOf(await readOr($, path))
    await $.process.run(['rm', '-f', path]).catch(() => undefined)
    const now = await $.clock.now()
    // A Yes or No another chat pressed on this chat's prompt answers it while it is still held; one too late does nothing
    if (answer?.card.startsWith(PROMPT_ANSWER)) {
      const isTaken = (answer.choice === 'yes' || answer.choice === 'no') && now - answer.at <= ANSWER_KEPT && answerPrompt($, answer.card.slice(PROMPT_ANSWER.length), answer.choice)
      if (!isTaken) await log($, `answer to a prompt from another chat dropped: it no longer waits`)
      continue
    }
    const card = answer ? (await read($, todos)).find(one => one.id === answer.card && !one.parentId) : undefined
    const isSame = Boolean(answer && card?.ask && (answer.askAt ? answer.askAt === card.ask.at : answer.ask === card.ask.text))
    // A reply in words to work whose ask was answered a moment ago, as a second message after a press, still reaches it
    if (answer && card && !card.ask && answer.isReply && now - answer.at <= ANSWER_KEPT) {
      await replyAfter($, card, answer.choice, answer.ask)
      continue
    }
    if (!answer || !card?.ask || now - answer.at > ANSWER_KEPT || (!answer.isReply && !isSame)) {
      await log($, `answer from another chat dropped: ${!answer ? 'unreadable' : now - answer.at > ANSWER_KEPT ? 'it waited too long' : `its ask is gone from ${answer.card}`}`)
      continue
    }
    await answerAsk($, card, answer.choice, answer.isReply)
  }
}
