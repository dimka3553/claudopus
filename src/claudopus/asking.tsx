// The asking card: an ask's text to copy, its buttons and reply box, and the answer reaching the work

// An ask's text put on the clipboard; its button says so for two seconds, and a later copy starts its own two seconds
let copiedKey = ''
let copies = 0
const copyAsk = ($: EngineInterface, id: string, text: string, surface: RenderSurface) =>
  void $.ui
    .copy({ text, surface })
    .then(r => {
      presses += 1
      const made = (copies += 1)
      copiedKey = r.isCopied ? id : ''
      if (!r.isCopied) void log($, `copy not made: ${r.reason}`)
      redraw($)
      $.clock.after(2000, () => void (copies === made && ((copiedKey = ''), redraw($))))
    })
    .catch(err => log($, `copy not made: ${String(err)}`))

// A command to type opens in Terminal only when the person presses its button, typed at the prompt in the folder it is for and never
// run: Return runs it. The app opens its own terminal tabs only for Claude, never for a plugin's own code, so it is the Mac's Terminal.
// A small zsh start folder of its own reads the person's own start files, then types the command with `print -z`; folders an hour
// old are cleared as the next one is made. A chat drawn on another Mac, or work on another Mac, has no button: this Mac is not theirs
let openedKey = ''
let opens = 0
const zshQuoted = (text: string) => `'${text.replaceAll("'", `'\\''`)}'`
// Linux has no Terminal app to type it into, so there the card gives the command to copy only
const canOpenTerminal = (one: Todo) => Boolean(one.ask?.isCommand && one.ask.copy) && !one.chat?.host && !isRunFromAfar && !isLinux
const terminalFiles = (folder: string, home: string) => ({
  // Their own .zshenv runs first; one that moves ZDOTDIR to their own folder is followed there afterwards, not before ours runs
  '.zshenv': [
    '[[ -f "${_CLAUDOPUS_DOT:-$HOME}/.zshenv" ]] && source "${_CLAUDOPUS_DOT:-$HOME}/.zshenv"',
    `if [[ "$ZDOTDIR" != ${zshQuoted(home)} ]]; then _CLAUDOPUS_DOT="$ZDOTDIR"; ZDOTDIR=${zshQuoted(home)}; fi`,
    '',
  ].join('\n'),
  // Then their own .zshrc, from their own folder, with the history file theirs again (the Mac's /etc/zshrc set it from ours)
  '.zshrc': [
    `_claudopus_here=${zshQuoted(home)}`,
    'if [[ -n "$_CLAUDOPUS_DOT" ]]; then ZDOTDIR="$_CLAUDOPUS_DOT"; else unset ZDOTDIR; fi',
    'unset _CLAUDOPUS_DOT',
    '[[ "$HISTFILE" == "$_claudopus_here"/* ]] && HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"',
    '[[ -f "${ZDOTDIR:-$HOME}/.zshrc" ]] && source "${ZDOTDIR:-$HOME}/.zshrc"',
    `if cd ${zshQuoted(folder)} 2>/dev/null; then`,
    "  print -P '%F{3}Claudopus typed the command below. Press Return to run it.%f'",
    'else',
    `  print -r -- $'\\e[33mClaudopus typed the command below, but its folder was not found:\\e[0m '${zshQuoted(folder)}`,
    'fi',
    'print -rz -- "$(<"$_claudopus_here/command.txt")"',
    'unset _claudopus_here',
    '',
  ].join('\n'),
  // Terminal's own saved sessions are left out of this one window, so its history stays the person's own file
  'open.command': ['#!/bin/zsh', `cd ${zshQuoted(folder)} 2>/dev/null`, 'export _CLAUDOPUS_DOT="${ZDOTDIR-}" SHELL_SESSIONS_DISABLE=1', `ZDOTDIR=${zshQuoted(home)} exec /bin/zsh -i`, ''].join('\n'),
})
const openTerminal = async ($: EngineInterface, one: Todo) => {
  const ask = one.ask
  if (!ask?.copy || !canOpenTerminal(one)) return
  const at = await $.clock.now()
  const made = (opens += 1)
  const base = `${dir}/terminal`
  const home = `${base}/${slug(one.id) || 'work'}-${at}`
  await $.fs.write(`${home}/command.txt`, ask.copy)
  for (const [name, text] of Object.entries(terminalFiles(ask.cwd || cwd, home))) await $.fs.write(`${home}/${name}`, text)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/open.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/open.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  presses += 1
  openedKey = r.exitCode === 0 ? `${one.id}:${ask.at}:${ask.copy}` : ''
  if (r.exitCode !== 0) void log($, `terminal not opened: ${r.stderr.trim().slice(0, 160)}`)
  redraw($)
  $.clock.after(3000, () => void (opens === made && ((openedKey = ''), redraw($))))
}

// The person's answer to an ask, a button pressed or a reply in their own words: to work under way, a message it reads at its next
// step; to work that has ended, a message that starts it again. Either way the ask goes at once, and the card
// says briefly what was answered; the work turns amber again only by asking again
const replies = new Map<string, number>()
// Each ask its own mark, so its reply box is a new one, empty, when the work asks something new, and the same one while it is held
const askMark = (ask: NonNullable<Todo['ask']>) => `${ask.at}-${[...ask.text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36)}`
// What the person has typed into a reply box and not sent, by the work and the ask it was typed for (draftOf), so a redraw keeps it
// and a newer ask of the same work starts with an empty box
const drafts = new Map<string, string>()
const draftOf = (id: string, ask: NonNullable<Todo['ask']>) => `${id}|${askMark(ask)}`
// Whether the person has typed something not sent into a work's reply box
const hasDraft = (id: string) => [...drafts].some(([key, value]) => key.startsWith(`${id}|`) && Boolean(value))
// While the person types into a reply box or a key box the panel and every Details tab hold their drawing whole. The app builds a
// pane afresh at each drawing, the box in it too: a pane drawn every few seconds under the person's typing flickered the box's ring,
// put older letters over newer ones, and, as Markdown came or went above, threw the panel to its bottom, out of the person's reach
// (15 Nov, typing an answer while other work ran; measured on the app's own drawing, headless). Each letter typed, or the box taking
// the focus, holds it for TYPING more; sending, any press, or the focus leaving the boxes lets it go. The desktop app's reply box is
// in the bar above the prompt (repliesInBar), which is held the same way while it is typed in
const TYPING = 30_000
let typing = 0
let isTyping = false
// Not typing, a pane is drawn again at once for anything new in what it shows, but for its running times alone at most every CALM:
// each drawing is a new pane under the pointer, which lost its hover, and a click whose press and release fell on two drawings did
// nothing (15 Nov: Approve took several clicks)
const CALM = 10_000
// The last drawing of each pane on each surface and size: what it showed in shape (paneShape) and in full (paneContent), when, and
// which call for a drawing of the mod's own it answered (freshness)
const heldDrawings = new Map<string, { shape: string; content: string; at: number; fresh: number; drawing: unknown }>()
// Counts the mod's own calls for a drawing: a press, a reply, a picture made, a box that came. Each one is drawn at once
let freshness = 0
const drawAgain = ($: EngineInterface) => {
  freshness += 1
  void drawFresh($)
}
// The text each reply box was last drawn with: while the person types it is drawn with that again, never with the letters as they
// arrive, so a drawing never puts older letters over the newer ones the box already holds
const drawnDrafts = new Map<string, string>()
const draftShown = (id: string, ask: NonNullable<Todo['ask']>) => draftDrawn(draftOf(id, ask))
const draftDrawn = (key: string) => {
  if (isTyping && drawnDrafts.has(key)) return drawnDrafts.get(key) ?? ''
  const value = drafts.get(key) ?? ''
  drawnDrafts.set(key, value)
  return value
}
// What a pane shows, as far as it moves while the person types: work that starts, finishes, asks, waits on an admin command, is cut
// or stuck, or leaves after its pause, here or in another chat; workflows; boxes, gates and prompts that come or go; a Details
// tab's own to-dos
const paneShape = async ($: EngineInterface, paneId: string) => {
  const at = await $.clock.now()
  const card = (one: Todo) => [one.id, one.status, one.ask?.at ?? 0, one.ask?.replied?.at ?? 0, one.parentId ?? '', lingers(one, at), (one.admins ?? []).map(gate => gate.id), one.leftSince ?? 0, one.cutAt ?? 0, one.stuckAt ?? 0, one.waitsSince ?? 0, one.running?.at ?? 0, jobsOf(one, at).length]
  const own = await read($, todos)
  const chats = await read($, others)
  const theirs = [cardsOf(chats).map(card), helpersOf(chats).map(card), chats.map(c => [c.host, c.chat, c.prompts?.length ?? 0, c.answeredPrompts?.length ?? 0])]
  const flowsNow = (await read($, flows)).map(f => [f.id, f.status, isLingering(f, at), f.agents.length])
  const mine = paneId === LIST ? null : own.find(other => paneId.endsWith(other.id))?.items.map(item => item.state)
  return JSON.stringify([own.map(card), theirs, flowsNow, [...lastRunning.keys()], boxes.map(one => one.id), [...boxSaid.keys()], looseGates.map(one => one.id), mine, paneId === LIST ? await updateShape($) : '', [...gatePressed.keys()], [...askPressed], [...barBoxes], replyTo, replyMark])
}
// and in full, but for what moves on its own as work runs: its running times, its tokens, its commands and their output, which are
// drawn again at most every CALM
const calmCard = (one: Todo) => {
  const { tokens: _tokens, running: _running, newAt: _newAt, bg: _bg, seenJobs: _seen, detached: _detached, lookedIn: _looked, ...rest } = one as Todo & Record<string, unknown>
  return rest
}
const paneContent = async ($: EngineInterface) => JSON.stringify([await read($, view), { ...(await read($, me)), tokens: 0 }, (await read($, reports)).length, (await read($, todos)).map(calmCard), (await read($, others)).map(c => ({ ...c, at: 0, cards: c.cards.map(calmCard), helpers: c.helpers?.map(calmCard) })), await read($, flows), boxes, [...boxSaid], looseGates])
const holdTimes = ($: EngineInterface) => {
  if (!isTyping) recordEvent($, 'hold')
  const made = (typing += 1)
  isTyping = true
  $.clock.after(TYPING, () => void (typing === made && ((isTyping = false), drawAgain($))))
}
const freeTimes = ($: EngineInterface) => {
  const wasHeld = isTyping
  if (wasHeld) recordEvent($, 'let-go')
  typing += 1
  isTyping = false
  if (wasHeld) drawAgain($)
}
// Every pane of the mod's is drawn again, from the values as they are now
const drawFresh = async ($: EngineInterface) => (recordEvent($, 'redraw-all'), $.ui.invalidate('ui.render'))
// What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
const drawnPanes = new Map<string, { shape: string; content: string; at: number; side: string }>()
// What the panel shows from the mod's own memory rather than its values: what the app's prompts, the admin and file gates, the boxes,
// pictures, the update and the presses hold. A change in it draws the panel again within a second
const sideSign = () =>
  JSON.stringify([
    waiting.map(one => [one.agent, one.tool, one.seen ?? 0, one.isPressedNo ?? false]), asked.length, answeredPrompts.length, [...promptSaid], [...promptHeld],
    [...gateHeld], [...gateSaid.keys()], looseGates.map(one => one.id), [...undoneOffers.keys()], boxes.map(one => one.id), doneNotes.length, [...boxSaid], [...boxSent], boxPresses,
    [...pictureIn.keys()], isUpdating, updatedMoment ?? null, presses, loadMark, freshness,
  ])
// While the person uses the panel (scrolls it, moves the focus in it, presses in it, or types) its running times stand still: they
// move again ENGAGED after the person's last move
const ENGAGED = 15_000
let engagedAt = 0
// A click is the focus moving onto a button, then the press: a drawing between them is a new button under the pointer, and the
// click did nothing (16 Nov, recorded: the update note's What's new took several clicks while other chats' writes drew the panel
// twice a second). From the person's focus on one of the panel's buttons until its press, or PRESS_HOLD, the panel is drawn as it
// last was, but for the mod's own calls for a drawing (a box, an ask, a press: freshness), which come at once. Only on the desktop
// surface: in the terminal a press is one key, and the arrows moving the focus would hold the panel still. A drawing asked for
// meanwhile is made once the hold ends
const PRESS_HOLD = 2000
let pressFrom = 0
let pressFresh = 0
let isPressMissed = false
const holdForPress = async ($: EngineInterface) => {
  const at = (pressFrom = await $.clock.now())
  pressFresh = freshness
  $.clock.after(PRESS_HOLD + 20, () => void (pressFrom === at && ((pressFrom = 0), isPressMissed && ((isPressMissed = false), drawAgain($)))))
}
const isPressHeld = (at: number) => pressFrom > 0 && at - pressFrom < PRESS_HOLD && pressFresh === freshness
let calmAt = 0
const engage = async ($: EngineInterface) => void (engagedAt = await $.clock.now())
// Each second: anything new the panel shows draws it again by itself, as the values it read are written; its running times alone
// draw it again only every CALM while work moves, and not while the person uses it
const calmLook = async ($: EngineInterface, isMoving: boolean) => {
  const now = await $.clock.now()
  const list = drawnPanes.get(LIST) ?? { shape: '', content: '', at: 0, side: sideSign() }
  // What the mod holds in memory, or a file the panel read, changed: drawn again at once, as anything new is
  const side = sideSign()
  let isNew = !isTyping && list.side !== side
  for (const [path, text] of isTyping ? [] : drawnFiles) {
    const now = await readOr($, path)
    if (now !== text) (drawnFiles.set(path, now), (isNew = true))
  }
  // Asked for once: a panel the app does not draw just then is not asked for again each second
  if (isNew) return void ((list.side = side), drawAgain($), (list.side = sideSign()))
  // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
  // every CALM too, not each second
  if (!isMoving || isTyping || now - engagedAt < ENGAGED || now - Math.max(list.at, calmAt) < CALM) return
  calmAt = now
  await writeHeldOthers($)
  recordEvent($, 'redraw-calm')
  $.ui.invalidate('ui.render')
}
// Whether an element of the mod's is a box the person types into: an ask's reply box or a key box
const isTypedBox = (element: string | undefined) => /-reply-|^box-.*-field/.test(element ?? '')
// Kept through a reload of the mod, and read back as it loads; drafts for work no longer kept go then
const keepDraft = ($: EngineInterface, key: string, value: string | undefined) =>
  void update($, draftsKept, kept => {
    const next = { ...(kept as Record<string, string>) }
    if (value) next[key] = value
    else delete next[key]
    return next
  }).catch(() => undefined)
// A work's drafts go once its ask is answered
const dropDrafts = ($: EngineInterface, id: string) => {
  for (const key of [...drafts.keys()]) if (key.startsWith(`${id}|`)) drafts.delete(key)
  void update($, draftsKept, kept => Object.fromEntries(Object.entries(kept as Record<string, string>).filter(([key]) => !key.startsWith(`${id}|`)))).catch(() => undefined)
}
const readDrafts = async ($: EngineInterface) => {
  const kept = ((await read($, draftsKept).catch(() => ({}))) ?? {}) as Record<string, string>
  const ids = new Set((await read($, todos)).map(one => one.id))
  const live = Object.entries(kept).filter(([key, value]) => typeof value === 'string' && ids.has(key.split('|')[0] ?? ''))
  for (const [key, value] of live) if (!drafts.has(key)) drafts.set(key, value)
  if (live.length !== Object.keys(kept).length) await update($, draftsKept, () => Object.fromEntries(live))
}
// The last answer given to each work's ask, shown on its card for a while after: sent to the work (which reads a message only at
// its next step, so it says so until that step starts), read by it, or sent to the chat when the work had ended
type Sent = { text: string; ask: string; to: 'sending' | 'work' | 'read' | 'chat' | 'other' | 'lost' | 'failed'; at: number; line?: string; isHeld?: boolean; isCard?: boolean; askAt?: number }
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
const lineOf = (one: Todo) => { const last = [...one.entries].reverse().find(entry => entry.kind !== 'steer'); return last ? `${last.at}:${last.text}` : '' }
// How long the card says what was answered, unless the work writes a newer line first
const ANSWER_SHOWN = 60_000
// The answers every ask offers when the work gave none of its own
const DEFAULT_ANSWERS = ['Done', 'Not now']
// An ask's question is one line of at most ASK_TEXT letters; what it is about, its details, is kept whole up to ASK_DETAILS
const ASK_TEXT = 300
const ASK_DETAILS = 12_000
// Words by which an ask points at an explanation somewhere else (the chat, a report, a message still to come), never at something
// shown, such as a code on a page or a picture
const POINTS_AWAY = /\b(?:as (?:i |we )?(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|agreed|said)|(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|said|wrote) (?:in (?:the|my|this) (?:chat|report|message|result|explanation)|above|below|earlier|before)|(?:see|per) (?:my|the) (?:report|last message|explanation|message above)|in my (?:report|last message)|(?:the )?(?:differences|changes) (?:above|below|i listed)|see (?:above|below)\b)|\(see (?:above|below)\)/i
// How much of what an ask is about the small card shows; Details shows it whole, as does the chat's notice
const DETAILS_ON_CARD = 1500
// How much of it the row the chat's model reads carries: the person has it whole, and the chat stays small
const DETAILS_IN_RELAY = 2000
const sentReplies = new Map<string, Sent>()
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
const pending = new Map<string, string>()
// Asks of another chat's work replied to here in words that hold them, by work and when it asked: acted on from the moment the reply
// is left, until that chat's own file carries the reply
const actingOn = new Map<string, string>()
// The asks of this chat's work already answered, by work and when it asked
const answeredAsks = new Set<string>()
// When the ask each work last had answered and cleared was asked, so a reply in words left after a press reaches only that ask
const answeredAt = new Map<string, number>()
// Answers on their way, so a press hook can wait for the one its press started (a button's handler does not await it)
const answersOnWay = new Set<Promise<unknown>>()
const answerAsk = ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  const run = answerNow($, one, choice, isReply)
  if (one.chat) return run
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
// Whether an answer settles its ask: a press does, and so does a reply to an ask that wanted words (it gave no buttons of its own)
// or one that begins with the words of one of its buttons. Any other reply, such as a request first, leaves the ask open while the work acts on it
const plainWords = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const settles = (ask: NonNullable<Todo['ask']>, said: string, isReply: boolean) =>
  !isReply || !ask.choices?.length || ask.choices.some(choice => plainWords(choice) && `${plainWords(said)} `.startsWith(`${plainWords(choice)} `))
// The asks a press answered, by card, as `${at}:${text}`: the panel draws the card answered from the press itself, its buttons and box
// gone in the press's own drawing, before the answer is written; the mark goes once the card's file no longer carries the ask
const askPressed = new Map<string, string>()
// A card as the panel draws it: an ask or a gate already pressed is not drawn as still waiting
const asPressed = (one: Todo): Todo => {
  const isAnswered = Boolean(one.ask && askPressed.get(one.id) === `${one.ask.at}:${one.ask.text}`)
  const admins = one.admins?.filter(gate => !gatePressed.has(gate.id))
  if (!isAnswered && admins?.length === one.admins?.length) return one
  return { ...one, ask: isAnswered ? undefined : one.ask, admins: admins?.length ? admins : undefined }
}
// Where a reply in words is typed. The desktop app keeps moving a pane's window back to a box that holds the cursor inside it, many
// times a second, and reports each move as the person's own scroll (found live, 15 Nov: stuck at the box while typing, a bounce
// once the moves were refused). A pane has no part that stays still, so on a surface whose bar above the prompt takes a box
// (barBoxes: the bar was drawn there with an Input in its table) an ask's reply box is drawn in that bar, a site of its own that the
// pane's scrolling does not reach, and never in the pane. It is there only once the person asks for it: the card's answers end
// with "Reply in your own words", which opens the box in the bar for that card, and Close takes it away again (16 Nov: a box
// always in the bar looked bad, and the person asked for it as one of the options)
// A bar the person folded shows nothing of the mod's, and one of the app's surveys takes its place: neither takes the box, and the
// card has its own again, so a reply in words can always be typed somewhere
const barBoxes = new Set<string>()
const repliesInBar = (surface: string) => barBoxes.has(surface)
// When the bar's box last took the cursor or a letter, 0 once the cursor is known to have left it or its reply was sent: the bar
// holds its drawing that long (band.tsx, barHeld). The app may say nothing when the cursor leaves for the chat's own box, so the
// hold ends by itself BAR_BOX_HELD after the last sign of it
let barBoxAt = 0
const BAR_BOX_HELD = 300_000
const isBarBox = (element: string | undefined) => /^band-.*-reply-/.test(element ?? '')
// The card whose reply box is open in the bar, none when it is closed: opened by the card's "Reply in your own words", closed by
// Close (on the card or in the bar), by the reply sent, by the card answered, or by the bar folding. One box at a time: opened on
// another card it is that card's, and what was half typed is kept for the card it was typed for. Nothing but the person closes or
// moves it while the card asks: when the work puts a new question in place of the one it was opened on (replyMark), the box stays
// as it is, with what is typed in it, and what is sent from it answers the question the work asks then (16 Nov, the person:
// "it should just allow me to keep typing until I myself either close it or open the new question")
let replyTo = ''
let replyMark = ''
const isReplyOpen = (one: Todo) => Boolean(replyTo && one.id === replyTo && one.ask)
// The open box's own name and what is typed in it, the same through a new question of its work
const barBoxKey = (id: string) => `band-${id}-reply-${replies.get(id) ?? 0}-${replyMark}`
const barDraft = (id: string) => `${id}|${replyMark}`
// This chat's cards that wait for an answer
const asksForBar = (cards: Todo[]) => cards.filter(one => !one.parentId && !one.chat && Boolean(asPressed(one).ask) && !isActingOnReply(one))
const barTarget = (cards: Todo[]) => (replyTo ? asksForBar(cards).find(isReplyOpen) : undefined)
// The bar's own id on each surface, as its drawing is asked for: where the cursor is put when the box opens
const barIds = new Map<string, string>()
// What was typed in the bar's box is its card's: when the work has since put a new question in place of the one the box was
// opened on, the words are shown under that question too, in the box as it is opened again and in the card's own box when the
// bar folds. Only the words of the box the person last had open for that card (barLeft), never those of an older question
const barLeft = new Map<string, string>()
const carryDraft = ($: EngineInterface, one: Todo, from: string | undefined) => {
  if (!one.ask || !from) return
  const to = draftOf(one.id, one.ask)
  const typed = drafts.get(from)
  if (from === to || !typed || drafts.get(to)) return
  drafts.set(to, typed)
  keepDraft($, to, typed)
  drafts.delete(from)
  keepDraft($, from, undefined)
}
// A reply sent from the bar's box answers what its card asks as it is sent: the box may have been drawn for an earlier question.
// On its way from the press itself, as an answer from the card is (answersOnWay)
const sendFromBar = ($: EngineInterface, id: string, value: string) => {
  const run = (async () => {
    const one = (await read($, todos)).find(card => card.id === id)
    if (one?.ask && value.trim()) await answerAsk($, one, value, true)
  })()
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
// Opens the bar's reply box for a card, or closes it. Opening it, the cursor is asked into the box: the app gives it only where
// the bar already holds the keys, so where it does not the person clicks the box
const openReply = ($: EngineInterface, one: Todo | undefined, surface: string) => {
  if (replyTo) barLeft.set(replyTo, barDraft(replyTo))
  if (one) (carryDraft($, one, barLeft.get(one.id)), barLeft.delete(one.id))
  replyTo = one?.ask ? one.id : ''
  replyMark = one?.ask ? askMark(one.ask) : ''
  barBoxAt = 0
  presses += 1
  redraw($)
  const ask = one?.ask
  const bar = barIds.get(surface)
  if (!one || !ask || !bar) return
  void $.ui
    .focus({ requestId: bar, key: barBoxKey(one.id) })
    .then(r => recordEvent($, 'focus-call', { deny: r.deny ?? null }))
    .catch(err => recordEvent($, 'focus-call', { failed: String(err).slice(0, 80) }))
}
const answerNow = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  // Another chat's ask is answered only in that chat: no file carries an answer to it, from this Mac or another
  if (one.chat) return
  const ask = one.ask
  const said = choice.trim()
  if (!ask || !said) return
  const target = ask.from ?? one.id
  if (!settles(ask, said, isReply)) return holdAsk($, one, ask, said, target)
  // The amber goes and the box clears at once. Only the first answer to the ask it was made for counts: a second press, or a press
  // on an ask the work has since replaced, sends nothing. Marked before anything is awaited, so two presses at once count once
  const asked = `${one.id}:${ask.at}:${ask.text}`
  if (answeredAsks.has(asked)) return
  answeredAsks.add(asked)
  // Answered in the press's own drawing, before anything is awaited: what was pressed, on its way
  const mark = `${ask.at}:${ask.text}`
  askPressed.set(one.id, mark)
  // Its reply box in the bar goes with the answer, and is closed when the same work asks again
  if (replyTo === one.id) ((replyTo = ''), (replyMark = ''), (barBoxAt = 0))
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at: Infinity, line, isCard: true, askAt: ask.at })
  if (isReply) freeTimes($)
  redraw($)
  let isCleared = false
  let steerAt = 0
  try {
    const at = await $.clock.now()
    steerAt = at
    // Set afresh on each run of the change, as it runs again on a list written meanwhile
    await changeTodos($, list =>
      ((isCleared = false), list).map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isCleared = true), { ...card, ask: undefined, entries: [...card.entries, { at, kind: 'steer' as const, text: isReply ? said : `${said} — to: ${ask.text}` }].slice(-ENTRIES_KEPT) }) : card)),
    )
    if (askPressed.get(one.id) === mark) askPressed.delete(one.id)
    // The work has since asked something else, or it was answered elsewhere: nothing went, and the card shows what it carries now
    if (!isCleared) return void (sentReplies.get(one.id)?.to === 'sending' && sentReplies.delete(one.id), redraw($))
    await answerCleared($, one, ask, said, isReply, target, at, line)
  } catch (err) {
    // It did not reach the work: the card says so, and its buttons come back to be pressed again, with nothing of the answer left
    if (askPressed.get(one.id) === mark) askPressed.delete(one.id)
    answeredAsks.delete(asked)
    if (answeredAt.get(one.id) === ask.at) answeredAt.delete(one.id)
    if (pending.get(target) === one.id) pending.delete(target)
    const isBack = !isCleared || (await changeTodos($, list => list.map(card => (card.id === one.id && !card.ask ? { ...card, ask, entries: card.entries.filter(entry => !(entry.kind === 'steer' && entry.at === steerAt)) } : card))).then(() => true).catch(() => false))
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'failed', at: await $.clock.now().catch(() => 0), line, isCard: true, askAt: ask.at })
    // and when even that could not be written, the chat is told, so the ask is not lost unseen
    if (!isBack) $.ui.log(`Your answer “${cut(said, 120)}” to "${titleOf(one)}" (${ask.text}) didn't reach Claude, and the question couldn't be put back on its card. Type your answer in this chat instead.`)
    redraw($)
    throw err
  }
}
// The rest of an answer once its ask is cleared from the card's file: to the work, or to wake it
const answerCleared = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, isReply: boolean, target: string, at: number, line: string) => {
  answeredAt.set(one.id, ask.at)
  dropDrafts($, one.id)
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at, line, isCard: true, askAt: ask.at })
  redraw($)
  // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}` : `${who(true)} pressed "${said}" in answer to your question: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) {
    writtenIn($, target, one.id)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line, isCard: true, askAt: ask.at })
    redraw($)
  } else await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line, isCard: true, askAt: ask.at })
  // Said in the chat only once the answer is on its way
  void askGone($, one, said)
}
// A reply in the person's own words that does not settle the ask: the ask stays on the card, its question with the reply under it,
// and the work is told so; its card stays among the running cards while the work acts on it. The person has answered, so its
// buttons and box go at once, and come back only when the work asks again, or ends with the ask still open
const holdAsk = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, target: string) => {
  // The same words twice at once count once; typed again later, after an earlier reply, they go again
  const key = `${one.id}:${ask.at}:${ask.text}:reply:${ask.replied?.at ?? ''}:${said}`
  if (answeredAsks.has(key)) return
  answeredAsks.add(key)
  const at = await $.clock.now()
  let isHeld = false
  // Acted on from now while the work is started again with it; never on a card no run of its own will end
  const listed = await read($, todos)
  const isWaking = listed.find(card => card.id === one.id)?.status !== 'working' && listed.find(card => card.id === target)?.status !== 'working'
  await changeTodos($, list =>
    ((isHeld = false), list).map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isHeld = true), { ...card, ask: { ...card.ask, replied: { text: said, at, ...(isWaking ? { isWaking } : {}) } }, entries: [...card.entries, { at, kind: 'steer' as const, text: said }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isHeld) return
  // The box goes with the buttons, as after a press; what was typed in it is not kept for the next ask
  dropDrafts($, one.id)
  // A new box, empty, whenever it comes back: the surface keeps what was typed in a box it finds again by its key
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  freeTimes($)
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line, isCard: true, askAt: ask.at })
  redraw($)
  // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  // Said in the chat once; the ask is then done with there, so the work asking again is sent to the chat afresh
  if (inChat.has(one.id)) (inChat.delete(one.id), void sayInChat($, named(ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`)), ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`, true)))
  const working = (await read($, todos)).find(card => card.id === target)?.status === 'working'
  const to = `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}\n${named(REPLY_HOLDS)}`
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn($, target, one.id), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line, isCard: true, askAt: ask.at })
}
// An answer to work that has ended starts that work again with it, as a message to it: the chat then gets the work's report as
// it gets any, and nothing goes into the chat in the person's place.
// The engine runs what a mod sends from outside its hooks (a timer, a button's own handler) under the mod's own origin, and work
// started again that way runs with every hook of the mod skipped: each of its panel tools answered "no tool.call hook answered",
// and its ask never reached the card. So the message waits here and is sent from inside a hook (the press's or the reply's own,
// a prompt, the end of a turn, a change in how full the chat is), where the work it wakes keeps its tools. Not from a tool call's
// hook: the engine leaves the calling hook out of what that call raises, and may of what it starts, and work woken there could miss its own tool calls' hook. One no hook takes within WAKE_WAIT, in a chat where
// nothing runs, is sent from the timer all the same: the work does what it was asked, and its rules have it end with any ask as
// its report's first line when the panel does not answer, which the chat puts to the person. One a copy a reload replaced still
// holds goes to the chat instead: a notice the person sees and a row its model reads, with no turn of its own
const WAKE_WAIT = 4000
// Each wake carries every answer joined into it, so each card's line and the chat's notice are settled for every one
const wakes: { target: string; text: string; answers: { one: Todo; sent: Omit<Sent, 'to'> }[] }[] = []
const toEnded = async ($: EngineInterface, one: Todo, target: string, text: string, sent: Omit<Sent, 'to'>) => {
  // Marked on its way before it is sent, so a run that starts before the send resolves counts as reading it
  pending.set(target, one.id)
  // A reply that holds its ask is acted on from now: no answers on the card while its work is started again with it
  await changeTodos($, list => list.map(card => (card.id === one.id && card.ask?.replied?.text === sent.text && !card.ask.replied.isWaking && card.status !== 'working' ? { ...card, ask: { ...card.ask, replied: { ...card.ask.replied, isWaking: true } } } : card)))
  sentReplies.set(one.id, { ...sent, to: 'work' })
  redraw($)
  // One message for a work: a second answer for the same one joins the first
  const same = wakes.find(w => w.target === target)
  if (same) return void ((same.text = `${same.text}\n\n${text}`), same.answers.push({ one, sent }))
  const wake = { target, text, answers: [{ one, sent }] }
  wakes.push(wake)
  void $.clock.after(WAKE_WAIT, () => {
    const at = wakes.indexOf(wake)
    if (at < 0) return
    wakes.splice(at, 1)
    void log($, `work ${target} started again from a timer: no hook of the mod ran within ${WAKE_WAIT / 1000} s, so its panel tools will not answer`)
    void sendWake($, wake)
  })
}
// Sends what waits, from inside the hook that calls it; a press's or a reply's hook first waits for the answer it started
const sendWakes = async ($: EngineInterface, isAnswering = false) => {
  if (isAnswering && answersOnWay.size) await Promise.allSettled([...answersOnWay])
  while (wakes.length) {
    const wake = wakes.shift()
    if (wake) await sendWake($, wake)
  }
}
const sendWake = async ($: EngineInterface, wake: (typeof wakes)[number]) => {
  // Work the person stopped is not woken by an answer that was on its way
  if (isHeld((await read($, todos)).find(one => one.id === wake.target))) return void (await log($, `work ${wake.target} not started again with an answer: the person stopped it`))
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await sendOwn($, { to: { agentId: wake.target }, text: wake.text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return wakeFailed($, wake, r.reason)
  // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
  await wakeCard($, wake.target)
  // Started by the message, the work reads it in the run it starts: that run's end never sends it a second time, even when no hook
  // of the mod saw its steps (a wake from the timer)
  for (const { one, sent } of wake.answers) startedBy.add(`${one.id}:${sent.at}`)
}
// The answers, by card and when given, that started their work again: the run each started reads it
const startedBy = new Set<string>()
// An answer written into work under way, which reads it at a step of its own: an earlier wake's run no longer covers this card
const writtenIn = ($: EngineInterface, target: string, card: string) => {
  pending.set(target, card)
  void replyWaiting($, target)
  for (const key of startedBy) if (key.startsWith(`${card}:`)) startedBy.delete(key)
}
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
const wakeCard = async ($: EngineInterface, target: string) => {
  const now = await $.clock.now()
  let isWoken = false
  await changeTodos($, list => ((isWoken = false), list).map(card => (card.id !== target || card.status === 'working' ? card : ((isWoken = true), resumed(card, now)))))
  if (isWoken) endedByHandback.delete(target)
}
const wakeFailed = async ($: EngineInterface, { target, answers }: (typeof wakes)[number], reason: string) => {
  if (answers.some(({ one }) => pending.get(target) === one.id)) pending.delete(target)
  await log($, `work ${target} not started again with an answer: ${reason}`)
  // An ask its reply held waits on the person again, every answer back
  const ids = new Set(answers.map(({ one }) => one.id))
  await changeTodos($, list => list.map(card => (ids.has(card.id) && card.ask?.replied?.isWaking ? { ...card, ask: { ...card.ask, replied: { text: card.ask.replied.text, at: card.ask.replied.at } } } : card)))
  for (const { one, sent } of answers) {
    sentReplies.set(one.id, { ...sent, to: 'chat' })
    const said = named(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text))
    $.ui.log(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text, true))
    await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: `${said}\n${named(ANSWER_FOR_CHAT_RELAY)}` }] } }).catch(err => log($, `chat not told of an answer: ${String(err)}`))
  }
  redraw($)
}
// Every ask of this chat's work is also sent into the chat, as a message from the mod, with its answers and pictures: the chat
// shows it to the person, and an answer they type there goes to the work as a press on the card does. Kept by card, so an ask
// answered or withdrawn on the card is said in the chat too, and the same ask is never sent twice
const inChat = new Map<string, string>()
const askKey = (ask: NonNullable<Todo['ask']>) => JSON.stringify([ask.text, ask.details ?? '', ask.choices ?? [], ask.pictures ?? [], ask.copy ?? ''])
const askInChat = async ($: EngineInterface, one: Todo) => {
  const ask = one.ask
  if (!ask || isOff || !dir || inChat.get(one.id) === askKey(ask)) return
  inChat.set(one.id, askKey(ask))
  const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
  // The person sees the ask as the mod's notice in the chat: a prompt the mod submitted would be drawn by the desktop app as the
  // person's own message, and a chat cannot send itself a message from another session. Its model reads the ask in a row of its
  // own, with how to pass an answer on; neither starts a turn
  // The terminal draws a notice as one line and a line break in it as a broken character: there each line is a notice of its own
  const notice = named(ASK_IN_CHAT(titleOf(one), ask, answers))
  const surfaces = await $.session.surfaces().catch(() => [])
  for (const line of surfaces.length && surfaces.every(s => s === 'terminal') ? notice.split('\n').filter(line => line.trim()) : [notice]) $.ui.log(line)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(err => (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, `chat not told of an ask: ${String(err)}`)))
}
// A line in the chat the person sees (the mod's notice, which the model never reads) and its model reads (a row the person does not
// see), sent with no turn of its own. The notice is the mod's log line: the desktop app leaves out a system row the mod appends
const sayInChat = async ($: EngineInterface, text: string, shown = text) => {
  $.ui.log(shown)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } }).catch(err => log($, `chat not told: ${String(err)}`))
}
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
const askGone = async ($: EngineInterface, one: Todo, said?: string) => {
  if (!inChat.has(one.id)) return
  inChat.delete(one.id)
  await sayInChat($, named(said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`)), said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`, true))
}
// The person's answer typed in the chat, passed on by the chat to the work: once on its way the card stops asking and says what was
// answered, and a helper that asked is told too when the chat sent it to the work it helps; refused, the ask stays to be answered
const answeredInChat = async ($: EngineInterface, a: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number }, to: string, isSent: boolean) => {
  if (!isSent) return void answeredAsks.delete(a.key)
  // Words that do not settle an ask with buttons of its own leave it open, as a reply on the card does; a later answer still counts
  const isHeld = !settles(a.ask, a.words, true)
  // Either way the ask is done with in the chat: the work asking again is sent to it afresh
  if (isHeld) answeredAsks.delete(a.key)
  inChat.delete(a.card.id)
  await changeTodos($, all => all.map(one => (one.id === a.card.id && one.ask?.at === a.ask.at && one.ask.text === a.ask.text ? { ...one, ask: isHeld ? { ...one.ask, replied: { text: a.words, at: a.at, ...(one.status === 'working' ? {} : { isWaking: true }) } } : undefined } : one)))
  dropDrafts($, a.card.id)
  sentReplies.set(a.card.id, { text: a.words, ask: a.ask.text, to: 'work', at: a.at, line: lineOf(a.card) })
  writtenIn($, to, a.card.id)
  const helper = a.ask.from && a.ask.from !== to ? (await read($, todos)).find(one => one.id === a.ask.from && one.status === 'working') : undefined
  if (helper) await tell($, helper.id, `${who(true)} answered your question ("${a.ask.text}") in the chat, in their own words: ${a.words}`)
  redraw($)
}
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
const replyAfter = async ($: EngineInterface, one: Todo, said: string, asked: string) => {
  const told = one.status === 'working' ? await tell($, one.id, `${who(true)} added, in their own words, to their answer to your question ("${asked}"): ${said}`) : undefined
  if (told && !told.deny) return
  const at = await $.clock.now()
  await toEnded($, one, one.id, `${who(true)} added, in their own words, to their answer to your ask ("${asked}"): ${said}\n${RESUMED_BY_ANSWER}`, { text: said, ask: asked, at, line: lineOf(one) })
}
// The work an answer was written into starts its next step: that step reads it
const replyRead = ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  if (sent?.to === 'work') (sentReplies.set(card, { ...sent, to: 'read' }), redraw($))
}
// The person's words written into work under way are marked beside the file its wait on helpers reads, so that wait comes back at
// once and the work reads them; the mark goes at the work's next step, which reads them
const replyMarked = new Set<string>()
// (a mark an earlier copy of the mod left, before a reload, is looked for once at each work's first step here)
const replyLooked = new Set<string>()
const replyWaiting = async ($: EngineInterface, agentId: string) => {
  if (!dir) return
  const at = await $.clock.now()
  await $.fs.write(`${rollPath(agentId)}.reply`, `${at}\n`).catch(err => log($, `reply mark for ${agentId} not written: ${String(err)}`))
  replyMarked.add(agentId)
}
const replyTaken = async ($: EngineInterface, agentId: string) => {
  if (!dir) return
  const isFirst = !replyLooked.has(agentId)
  replyLooked.add(agentId)
  if (!replyMarked.delete(agentId) && !(isFirst && (await readOr($, `${rollPath(agentId)}.reply`)).trim())) return
  await $.fs.write(`${rollPath(agentId)}.reply`, '').catch(() => undefined)
}
// Work whose run ended with an answer written in but never read is started again with it
const replyUnread = async ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined || wakes.some(w => w.target === agentId)) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  // The run that ends was started by the answer itself: it read it
  if (sent && startedBy.delete(`${card}:${sent.at}`)) return void (sent.to === 'work' && (sentReplies.set(card, { ...sent, to: 'read' }), redraw($)))
  const one = (await read($, todos)).find(todo => todo.id === card)
  if (sent?.to !== 'work' || !one) return
  const isHeld = one.ask?.replied?.text === sent.text
  await toEnded($, one, agentId, `${who(true)} ${isHeld ? 'replied to' : 'answered'} your question ("${sent.ask}"), and you ended before reading it: ${sent.text}${isHeld ? `\n${named(REPLY_HOLDS)}` : ''}\n${RESUMED_BY_ANSWER}`, sent)
}
// An answer given on the card in the last ANSWER_SHOWN: the card stays where it was meanwhile (answeredSince), and says it
const heldAnswer = (one: Todo, now: number) => {
  const sent = one.chat ? undefined : sentReplies.get(one.id)
  return sent?.isCard && sent.to !== 'lost' && now - sent.at < ANSWER_SHOWN ? sent : undefined
}
// A reply written into work while one of its calls is held open is read only when that call ends: the card names it and how long it
// has run, so a wait is never taken for a reply lost
const waitsBehind = (one: Todo, at: number, now: number) => {
  // the call held open by the very work the reply was written into (the helper that asked, or the work), while it is unread
  const target = [...pending].find(([, card]) => card === one.id)?.[0]
  const running = target !== undefined && one.status === 'working' ? runningOf(target) : undefined
  if (!running || running.at > at) return ''
  const name = running.label ? `“${cut(describedOf(running.label).text || running.label, 50)}”` : running.what.replace(/ running$/, '')
  return `waiting: Claude will see it when ${name} ends (running ${took(now - running.at)})`
}
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
const sentLine = (one: Todo, now: number) => {
  const sent = sentReplies.get(one.id)
  // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
  const replied = one.ask?.replied
  if (replied && !(sent && sent.ask === one.ask?.text && (sent.text === replied.text || sent.isHeld))) return `✓ You replied “${cut(replied.text, 60)}”${isActingOnReply(one) ? ' · Claude is working on it' : '; Claude still has this question'}`
  if (!sent) return ''
  if (sent.to === 'failed') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}” didn't reach Claude. Press it again` : ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}”. That Mac couldn't be reached; answer it in its own chat` : ''
  const newer = lineOf(one) !== sent.line
  const isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || one.ask.replied?.text === sent.text))
  if ((one.ask && !isHeld) || (!isHeld && (newer || now - sent.at > ANSWER_SHOWN))) return ''
  const how = {
    sending: 'Sending to Claude…',
    work: waitsBehind(one, sent.at, now) || 'Claude will see this after its current step',
    read: 'Claude has read it',
    chat: 'left in the chat, which continues the task',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose task will see it after its current step`,
  }[sent.to]
  if (isHeld) return `✓ You replied “${cut(sent.text, 60)}” · ${sent.to === 'read' ? (one.status === 'working' ? 'Claude is working on it' : 'Claude has read it') : how}${isActingOnReply(one) ? '' : '; Claude still has this question'}`
  return `✓ You answered “${cut(sent.text, 60)}” · ${how}`
}
