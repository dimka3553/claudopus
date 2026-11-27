// Every chat's work in every chat's panel: this chat's file, the others' read, chats opened and answered from another chat
// (../../mods/claudopus/hooks/shared.ts says how)

// ---- The work of every chat, in every chat's panel (shared.ts says how) ----

const others = atom({ plugin: 'claudopus', key: 'others' } as const, [], { shape: 'others-1' })
const liveDir = () => `${dir}/${LIVE_DIR}`
// What this chat last wrote to its file and when: written again when it changes or its beat is due, with work or without, so the
// panels of other Macs list it as open. It is removed as the chat ends
let sharedSign = ''
// The same without how its jobs and helpers move, which alone writes the file at most every LOOK_EVERY
let sharedCore = ''
let sharedAt = 0
const ownLive = (id: string) => `${liveDir()}/${id}.json`
// Set as the session ends, so a beat due after it does not write the file again
let isEnded = false
// What opens this chat in the Claude app, read off the engine's own file of this session in its sessions folder (~/.claude/sessions, or CLAUDE_CONFIG_DIR's) (its Remote Control id
// appears there once Remote Control is on) at most once a beat; the file found is read again alone until it no longer names this chat
let myLink: Link | undefined
let linkReadAt = 0
let linkFile = ''
const readLink = async ($: EngineInterface, id: string): Promise<Link | undefined> => {
  const folder = `${await configDir($)}/sessions`
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
  const list = await ownCards($)
  // Each card and helper carries how its jobs stand, as this chat reads them, so another chat's Details shows them as this one does
  const withSeen = (one: Todo): Todo => {
    const seen = Object.fromEntries(
      (one.bg ?? []).flatMap(job => {
        const s = jobLog.get(job.id)
        return s ? [[job.id, { latest: s.latest, ...(s.pct ? { pct: s.pct } : {}), ...(s.done ? { done: s.done } : {}), ...(s.total ? { total: s.total } : {}), ...(s.wroteAt ? { wroteAt: s.wroteAt } : {}), ...(s.tail?.length ? { tail: s.tail } : {}), ...(s.words ? { words: s.words } : {}), ...(s.isOwn ? { isOwn: true } : {}), ...(s.isEarlier ? { isEarlier: true } : {}), ...(s.isEmpty ? { isEmpty: true } : {}), ...(namedNow.get(job.id) ? { now: namedNow.get(job.id) } : {}) }]] : []
      }),
    )
    return Object.keys(seen).length ? { ...one, seenJobs: seen } : one
  }
  // (each as it is kept: another chat reads its stage from the same card, as this one does)
  const cards = shareable(list, now).map(withSeen)
  const helpers = shareableHelpers(list, cards).map(withSeen)
  const jobsSign = [...cards, ...helpers].map(one => Object.values(one.seenJobs ?? {}).map(s => `${s.latest}:${s.tail?.at(-1) ?? ''}:${Math.floor((s.wroteAt ?? 0) / 30_000)}`).join('|')).join(' ')
  const shareOf = ({ tool: _tool, agent: _agent, snippet: _snippet, seen: _seen, isTold: _told, input: _input, card: _card, ...p }: Waiting): Prompt => p
  const prompts: Prompt[] = waiting.map(shareOf)
  // Helpers are signed by what their Details shows, not by the context they hold, which moves at every step
  const helpersSign = JSON.stringify(helpers.map(one => [one.id, one.status, one.items, one.entries.at(-1)?.text ?? '']))
  const core = `${title}\n${JSON.stringify(myLink ?? null)}\n${signOf(cards)}\n${prompts.map(one => one.id).join(' ')}`
  const sign = `${core}\n${helpersSign}\n${jobsSign}`
  if (sign === sharedSign && now - sharedAt < BEAT) return
  if (core === sharedCore && now - sharedAt < LOOK_EVERY) return
  const s: Shared = { chat: id, title, folder: cwd, host: '', at: now, cards, ...(helpers.length ? { helpers } : {}), ...(prompts.length ? { prompts } : {}), ...(myLink ? { link: myLink } : {}) }
  // Ended work is written apart, under `ended`: a chat still running a version from before ended work was shared reads `cards` only,
  // and would show what is there as running for good
  const isLive = (one: Todo) => one.status === 'working' || Boolean(one.ask)
  const ended = cards.filter(one => !isLive(one))
  // Every kept key and admin password is hidden in it, as in what a tool answers; a file that could not be checked is not written
  const text = await hiddenJson($, JSON.stringify({ ...s, cards: cards.filter(isLive), ...(ended.length ? { ended } : {}) }))
  if (text === undefined) return void log($, "this chat's file not shared: it could not be checked for kept keys")
  await $.fs.write(ownLive(id), text)
  sharedSign = sign
  sharedCore = core
  sharedAt = now
}
// This chat's file goes as its session ends, and when it starts (a file a crash or a reload left behind): the others drop its cards
// at once, not after STALE
const unshare = async ($: EngineInterface, isSure = false) => {
  const { id } = await read($, me)
  if (!id || !dir || (!sharedSign && !isSure)) return
  sharedSign = ''
  if (await $.fs.exists(ownLive(id)).catch(() => false)) await runOn($, ['rm', '-f', ownLive(id)]).catch(() => undefined)
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
  const seen = endSeen.get(`${one.id}:${one.endedAt}`) ?? 0
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
const LIVE_OLD = 2 * 86_400_000
let isLiveTidied = false
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
  // The files of chats long gone are taken away, once a load: a chat still open writes its file every BEAT, and 210 of the 256
  // files listed at every look on 27 Nov were eleven days old
  const gone = isLiveTidied ? [] : listed.filter(entry => entry.mtimeMs && now - entry.mtimeMs > LIVE_OLD).slice(0, 500)
  isLiveTidied = true
  if (gone.length) void runOn($, ['rm', '-f', ...gone.map(entry => `${liveDir()}/${entry.name}`)]).catch(() => undefined)
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
  // Chats of this Mac whose process ended with tasks at work, as when the app quit: those tasks, cut off, as their ledgers kept them
  for (const one of await ledgerOthers($, id, open, now).catch(err => (void log($, `other chats' ledgers not read: ${String(err)}`), [] as Shared[]))) if (!here.has(one.chat)) (here.add(one.chat), found.push(one))
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
  for (const s of found) for (const card of s.cards.filter(one => one.status === 'working')) lastRunning.set(remoteId(s, card.id), { chat: chatKey(s), card, at: now, of: { ...s, cards: [], prompts: undefined } })
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
      // By its end too: work that ends, goes on and ends again between two reads has a moment for each end
      const key = `${remoteId(s, card.id)}:${card.endedAt}`
      ids.add(key)
      if (endSeen.has(key)) continue
      const isNew = now - card.endedAt < SEEN_ENDING
      endSeen.set(key, isNew ? now : 0)
      if (isNew) $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
    }
  for (const key of [...endSeen.keys()]) if (!ids.has(key)) endSeen.delete(key)
  const isAppChanged = found.some(s => s.host) && (await readAppIds($, now).catch(err => (void log($, `app's chats not listed: ${String(err)}`), false)))
  const next = ordered(found)
  const was = othersKept ?? (await read($, others))
  if (JSON.stringify(next) === JSON.stringify(was)) {
    othersHeld = undefined
    if (`${isMulti()}:${selfName()}` !== wasSelf || isAppChanged || isOffChanged) redraw($)
  } else if (calmOthers(next) !== calmOthers(was) || next.some(s => now - (was.find(w => w.host === s.host && w.chat === s.chat)?.at ?? 0) > STALE / 2)) {
    othersHeld = undefined
    othersKept = await update($, others, () => next)
    await update($, todosMark, n => n + 1)
  } else othersHeld = next
}
// Other chats' work as the panel shows it, but for what moves by itself as it runs (their beats, times, tokens and output): a change
// in only that is not written at once, as each write draws the panel afresh under the pointer. It is held here and written with the
// panel's running times (calmLook), and at the latest once a chat's beat is half way to being taken for gone
let othersHeld: Shared[] | undefined
// The list as this copy last wrote it, which only it writes: read from the engine it is copied whole between Claude's two threads
// (ownCards), and the look each second read it several times
let othersKept: Shared[] | undefined
// (a drawing reads the mark alone, which each write of this list moves too: drawnCards)
const drawnOthers = async ($: EngineInterface) => (await read($, todosMark), othersKept ?? read($, others))
const ownOthers = async ($: EngineInterface) => (othersKept ? (await $.clock.now(), othersKept) : read($, others))
const calmOthers = (list: Shared[]) => JSON.stringify(list.map(c => ({ ...c, at: 0, cards: c.cards.map(calmCard), helpers: c.helpers?.map(calmCard) })))
const writeHeldOthers = async ($: EngineInterface) => {
  const held = othersHeld
  othersHeld = undefined
  if (held) ((othersKept = await update($, others, () => held)), await update($, todosMark, n => n + 1))
}

// The chats this Mac's Claude app holds: its session files, one per chat, under
// ~/Library/Application Support/Claude/claude-code-sessions/<account>/<org>/local_….json (on Windows in the app's data folder,
// appDataFolders), each naming the engine's id for that chat
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
  const found = new Map<string, string>()
  for (const root of (await appDataFolders($)).map(data => `${data}/claude-code-sessions`))
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
  const r = await openOn($, url)
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
      const r = await runOn($, ssh(mac, openTake(from)), { timeoutMs: 8_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
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
  const c = (await ownOthers($)).find(one => one.chat === chat)
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

// A file left for another chat (a request to open it), written under another name and then renamed, so it is never read half-written
const answeredHere = new Set<string>()
const leaveHere = ($: EngineInterface, folder: string, name: string, body: unknown) =>
  $.fs
    .write(`${liveDir()}/${folder}/${name}.part`, JSON.stringify(body))
    .then(() => runOn($, ['mv', '-f', `${liveDir()}/${folder}/${name}.part`, `${liveDir()}/${folder}/${name}.json`]))
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
// An answer some file leaves for this chat's work, from another chat's panel here or carried from another Mac, answers nothing: a file
// carries no proof of who wrote it, and anything running as the person on this Mac, or on a Mac named under macs, can write one. An
// ask (as a prompt of Claude Code's) is answered only in its own chat, by a press or a reply in that chat's own panel, which is in this
// code's memory. A file left there (by a version before this one) is put away unread, and said in the log
const readAnswers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const folder = `${liveDir()}/${ANSWERS}/${id}`
  const all = (await $.fs.list(folder).catch(() => [])).filter(entry => entry.name.endsWith('.json') || entry.name.endsWith('.part'))
  if (!all.length) return
  for (const entry of all) await runOn($, ['rm', '-f', `${folder}/${entry.name}`]).catch(() => undefined)
  await log($, `${all.length === 1 ? 'an answer' : `${all.length} answers`} left in a file put away unread: an ask is answered only in its own chat`)
}
