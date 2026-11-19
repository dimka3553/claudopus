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
// How many lines tall a box for words is drawn: always the same, and the text scrolls within once it is longer. The app draws a
// box of `rows` that tall whatever it holds and never grows one by itself, so a box that grew was a new drawing for each line,
// and each drawing of a site is a new box under the cursor: the app gives it the cursor again and its ring fades in again
// (17 Nov, the person, typing a reply of several lines: "it starts jittering and flashing blue, not blue, blue, not blue"; the bar
// also grew under the chat at each line). Four lines hold a reply of a few sentences; the bar holds them, its title, the gap,
// Send and the panel's marker within its 13 rows
const BOX_ROWS = 4
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
const drawAgain = ($: EngineInterface, isThroughTyping = false) => {
  freshness += 1
  void drawFresh($, isThroughTyping)
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
  const card = (one: Todo) => [one.id, one.status, one.ask?.at ?? 0, one.ask?.replied?.at ?? 0, one.parentId ?? '', lingers(one, at), isDoneMoment(one, at), (one.admins ?? []).map(gate => gate.id), one.stuckAt ?? 0, one.running?.at ?? 0, jobsOf(one).length]
  const own = await read($, todos)
  const chats = await read($, others)
  const theirs = [cardsOf(chats).map(card), helpersOf(chats).map(card), chats.map(c => [c.host, c.chat, c.prompts?.length ?? 0])]
  const flowsNow = (await read($, flows)).map(f => [f.id, f.status, isLingering(f, at), f.agents.length])
  const mine = paneId === LIST ? null : own.find(other => paneId.endsWith(other.id))?.items.map(item => item.state)
  return JSON.stringify([own.map(card), theirs, flowsNow, [...lastRunning.keys()], boxes.map(one => one.id), [...boxSaid.keys()], looseGates.map(one => one.id), mine, paneId === LIST ? await updateShape($) : '', [...gatePressed.keys()], [...askPressed], [...barBoxes], barOpen?.kind ?? '', barOpen?.id ?? '', barOpen?.mark ?? '', [...attached], [...replies]])
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
// Not while the person types into the bar's box, or put the cursor in it, within TYPING (isBoxHeld): the app asks again for every
// drawing of the mod's at each redraw, the bar above the prompt too, and builds each one anew, the box with the cursor in it too,
// whose ring then fades in again; holding the drawing does not spare that (17 Nov: the box flashed blue several times a second
// while tasks wrote their cards, each a redraw the app answered with a box built anew; its own renderer, headless, measured).
// Asked for meanwhile, it is made once the hold ends (lookBar, each second). What must show at once goes through
// (isThroughTyping): a box whose card stopped asking, and what newly waits on the person (urgentSign)
let isRedrawOwed = false
// Only the bar's box: a box in a pane is drawn again with its pane as before. The hold ends TYPING after the last letter or focus,
// as the app may say nothing when the cursor leaves; a letter typed after that holds it again at once
const isBoxHeld = (at: number) => (Boolean(barOpen) && barBoxAt > 0 && at - barBoxAt < TYPING) || (paneBoxAt > 0 && at - paneBoxAt < TYPING)
const drawFresh = async ($: EngineInterface, isThroughTyping = false) => {
  if (!isThroughTyping && isBoxHeld(await $.clock.now())) return void ((isRedrawOwed = true), recordEvent($, 'redraw-owed'))
  isRedrawOwed = false
  recordEvent($, 'redraw-all')
  $.ui.invalidate('ui.render')
}
// What newly waits on the person and is drawn from the mod's own memory: the app's prompts, gates without a card, key and admin
// boxes. A change in it is drawn within a second, through any hold
let urgentDrawn = ''
const urgentSign = () => JSON.stringify([waiting.map(one => [one.agent, one.tool]), asked.length, looseGates.map(one => one.id), boxes.map(one => one.id)])
// What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
const drawnPanes = new Map<string, { shape: string; content: string; at: number; side: string }>()
// What the panel shows from the mod's own memory rather than its values: what the app's prompts, the admin and file gates, the boxes,
// pictures, the update and the presses hold. A change in it draws the panel again within a second
const sideSign = () =>
  JSON.stringify([
    waiting.map(one => [one.agent, one.tool, one.seen ?? 0]), asked.length, [...promptWaits.keys()], [...promptHeld],
    [...gateHeld], [...gateWaits.keys()], looseGates.map(one => one.id), [...undoneOffers.keys()], boxes.map(one => one.id), loosePressed.length, [...boxSaid], [...boxSent], boxPresses,
    [...pictureIn.keys()], isUpdating, updatedMoment ?? null, presses, loadMark, freshness,
  ])
// While the person uses the panel (scrolls it, moves the focus in it, presses in it, or types) its running times stand still: they
// move again ENGAGED after the person's last move
const ENGAGED = 15_000
let engagedAt = 0
// While the person uses the panel on the desktop, the drawing on screen stays, whole: cards above the pointer that grew or shrank
// as work wrote moved the button under it by up to 184 px, and at the list's end each shrink and regrowth swung the view up and
// back (16 Nov, Dima's recording replayed in the app's own pane). Their own presses and anything new that waits on them (an ask, a
// box, a gate, a prompt) are drawn at once; the rest once they have left it alone for ENGAGED
const isEngaged = (at: number) => engagedAt > 0 && at - engagedAt < ENGAGED
// Only while scrolled down: at the top what comes in comes below the header, as the person expects, and every behaviour that shows
// what work did (a card that finishes comes up green, one stopped leaves after its pause) shows as before
const isInUse = (at: number, offset: number) => isEngaged(at) && offset > 0
const personSign = async ($: EngineInterface) => {
  const chats = await read($, others)
  // (only the cards that ask or wait on a gate: a card that merely starts or ends waits)
  const cards = await read($, todos)
  const asks = [...cards, ...cardsOf(chats), ...helpersOf(chats)].filter(one => one.ask || one.admins?.length).map(one => [one.id, one.ask?.at ?? 0, one.ask?.replied?.at ?? 0, (one.admins ?? []).map(gate => gate.id)])
  // (and what the person's own presses change once their write lands: a card dismissed, a result's question answered or set aside,
  // a task their answer starts again. Without them, a drawing made between the press and its write was kept while they used the
  // panel, and the card stayed at the top with its buttons for 15 seconds after each move)
  // (a card marked done is green in its place for its two seconds, then under Finished: both are drawn in the kept drawing too)
  const momentAt = await $.clock.now()
  const own = [cards.filter(one => one.closedAt).map(one => one.id), [...dismissedNow.keys()], cards.filter(one => isDoneMoment(one, momentAt)).map(one => one.id)]
  return JSON.stringify([
    presses, asks, own, chats.map(c => [c.host, c.chat, c.prompts?.length ?? 0]), waiting.map(one => [one.agent, one.tool]), asked.length, [...promptWaits.keys()], [...promptHeld],
    [...gateHeld], [...gateWaits.keys()], [...gatePressed.keys()], looseGates.map(one => one.id), [...askPressed], [...undoneOffers.keys()], boxes.map(one => one.id), [...boxSaid], [...boxSent], boxPresses,
    [...pictureIn.keys()], isUpdating, loadMark, foldsHeld(momentAt),
    // and what their presses change that shows later: a Stop's card, a note a box left, the update's steps, a copy made
    [...(await read($, todos)), ...(await read($, flows))].filter(one => (one as { byYou?: unknown }).byYou).map(one => one.id), [...stoppingJobs], loosePressed.length, [...sentReplies].map(([id, sent]) => [id, sent.to, sent.text]), updatedMoment ?? null, copiedKey, dir ? await readOr($, stepsPath()) : "",
  ])
}
// The press that folded Finished: the drawing for it is not held at the bottom of the view (panel.tsx, heldRows). The person
// shortened the list on purpose, so the view comes back to what is left; held, it showed only blank and the fold, its cards above
let foldPress = -1
// A click is the focus moving onto a button, then the press: a drawing between them is a new button under the pointer, and the
// click did nothing (16 Nov, recorded: the update note's What's new took several clicks while other chats' writes drew the panel
// twice a second). From the person's focus on one of the panel's buttons until its press, or PRESS_HOLD, the panel is drawn as it
// last was, but for the mod's own calls for a drawing (a box, an ask, a press: freshness), which come at once. Only on the desktop
// surface: in the terminal a press is one key, and the arrows moving the focus would hold the panel still. A drawing asked for
// meanwhile is made once the hold ends
const PRESS_HOLD = 2000
let pressFrom = 0
let pressFresh = 0
// The calls for a drawing that came from what other chats and work wrote (calmLook): they do not end a press hold, which only the
// person's own moves and the mod's own calls end. Each such write ended it, as other chats wrote every second under load, and the
// hold lasted only until the next one
let calmBumps = 0
let isPressMissed = false
const holdForPress = async ($: EngineInterface) => {
  const at = (pressFrom = await $.clock.now())
  pressFresh = freshness - calmBumps
  // A hold that ends with no press reaching the mod while a drawing was held back (a click on a button already gone) gives the buttons new keys: the app keeps a
  // focused button in view and scrolls back to it at every drawing, which threw the panel down and back as the person clicked on
  $.clock.after(PRESS_HOLD + 20, () => void (pressFrom === at && ((pressFrom = 0), isPressMissed && ((isPressMissed = false), (presses += 1), drawAgain($)))))
}
const isPressHeld = (at: number) => pressFrom > 0 && at - pressFrom < PRESS_HOLD && pressFresh === freshness - calmBumps
// A pane drawn afresh is given again, as it was, until FRESH_GAP has passed (or four times what its drawing took, when longer), and
// then drawn afresh once. The engine retires a drawing's buttons the moment a newer drawing of that pane is made, and a newer ask for
// one drops the reply of the drawing still under way: with seven tasks, their helpers and commands, the panel was asked for about
// five times a second and each drawing took 300 ms, so no drawing reached the app for half a minute while every one retired the
// buttons on screen, and every click named a button already gone (16 Nov, 0.2.153: Close pressed twenty times, all "not handled").
// Given again, a drawing is the same tree, keeps its buttons, and is answered at once. A press of the person's is drawn at once
const FRESH_GAP = 1000
// (250 ms: the 16 Nov drawings took 300 ms; ordinary ones on a busy Mac take 100-250 ms and are not what drops clicks. At 100 ms
// those set the gap off in the test kit too, whose clock stands still, and two tests hung on a drawing that never came)
const SLOW_DRAW = 250
const freshDrawn = new Map<string, { at: number; ms: number; fresh: number }>()
const freshDue = new Set<string>()
// The panes being drawn afresh just now: an ask that comes meanwhile gets the drawing before, and the pane is asked for again the
// moment the fresh one is made, since the engine drops the reply of a drawing a newer ask overtook
// One at a time: an ask that comes while a drawing of the pane is under way gets the drawing before, whatever came meanwhile, and the
// pane is drawn afresh once with all of it the moment that one is made. A new one begun for each change, as each second's write
// from work moved freshness, ran side by side with those before, each slowing the rest, on 19 Nov up to nine at once taking 7-12 s
// each while every click waited behind them. (A drawing the engine never finishes holds none for longer than UNDER_WAY_MOST)
const freshUnderWay = new Map<string, { fresh: number; isOvertaken: boolean; since: number }>()
const UNDER_WAY_MOST = 15_000
let pressedAt = 0
// (isLoaded: the bar above the prompt is drawn in 50-200 ms under the same load, under SLOW_DRAW, so it is given again
// whenever the panel's own drawings are slow (isPanelSlow))
const isFreshTooSoon = ($: EngineInterface, key: string, at: number, isLoaded = false, canGiveMade = true) => {
  const going = freshUnderWay.get(key)
  if (going && at - going.since < UNDER_WAY_MOST) return (going.isOvertaken = true)
  const last = freshDrawn.get(key)
  // The ask for a drawing made while it was overtaken: given that one, once (the panel and a Details tab, which hold a drawing
  // only while what they show is the same, look at that themselves: canGiveMade)
  const again = madeAgain.get(key)
  madeAgain.delete(key)
  if (canGiveMade && again && last && again.fresh === freshness && at - again.at < FRESH_GAP && last.fresh === freshness && pressedAt < last.at) return true
  // The mod's own calls for a drawing (an ask, a box, a press, a picture: freshness) come at once
  if (!last || pressedAt >= last.at || last.fresh !== freshness) return false
  // Only while drawings are slow, as under a load that drops them: a quick one reaches the app before the next is asked for
  if (last.ms < SLOW_DRAW && !isLoaded) return false
  const gap = Math.max(FRESH_GAP, last.ms * 4)
  if (at - last.at >= gap) return false
  // (asked for without counting as a call of the mod's own, which would draw afresh at once and skip the gap)
  if (!freshDue.has(key)) (freshDue.add(key), $.clock.after(gap - (at - last.at) + 20, () => void (freshDue.delete(key), drawFresh($))))
  return true
}
// Whether the panel's last drawings made afresh, in the last ten seconds, were slow: the load that drops drawings is on
const isPanelSlow = (at: number) => [...freshDrawn].some(([key, last]) => key.startsWith(`${LIST}|`) && last.ms >= SLOW_DRAW && at - last.at < 10_000)
// Around each drawing made afresh: one asked for while it was made is made again the moment it is done
const freshBegins = (key: string, at: number) => (freshUnderWay.set(key, { fresh: freshness, isOvertaken: false, since: at }), freshness)
// Asked for again only for a drawing made afresh, which the engine dropped: an ask answered with the drawing before (a held one) left
// nothing unseen. And the ask that follows within FRESH_GAP is given the drawing just made, never a new one, while nothing of the
// mod's own came (madeAgain). Asked for again after every overtaken ask, two asks that came together (as two per push) overtook each
// other again and again: in the real panel three quarters of the full redraws began the moment a drawing ended, in chains of up to
// 27, with the panel and the bar drawn about seven times a second and the hover under the pointer going out at each (17 Nov)
const madeAgain = new Map<string, { fresh: number; at: number }>()
const freshEnds = ($: EngineInterface, key: string, made?: { at: number; ms: number; fresh: number }) => {
  const going = freshUnderWay.get(key)
  freshUnderWay.delete(key)
  // (a drawing is as new as what it began with: what came while it was made is not in it, so it is never given as made, and the
  // ask that follows draws the pane afresh with it)
  const fresh = going?.fresh ?? made?.fresh ?? freshness
  if (made) freshDrawn.set(key, { ...made, fresh })
  if (!going?.isOvertaken) return
  if (fresh !== freshness) return void drawFresh($)
  if (made) (madeAgain.set(key, { fresh, at: made.at }), void drawFresh($))
}
let calmAt = 0
const engage = async ($: EngineInterface) => void (engagedAt = await $.clock.now())
// Each second: anything new the panel shows draws it again by itself, as the values it read are written; its running times alone
// draw it again only every CALM while work moves, and not while the person uses it
const calmLook = async ($: EngineInterface, isMoving: boolean) => {
  const now = await $.clock.now()
  const urgent = urgentSign()
  if (urgentDrawn && urgent !== urgentDrawn) drawAgain($, true)
  urgentDrawn = urgent
  const list = drawnPanes.get(LIST) ?? { shape: '', content: '', at: 0, side: sideSign() }
  // What the mod holds in memory, or a file the panel read, changed: drawn again at once, as anything new is
  const side = sideSign()
  const isHeld = isBoxHeld(now)
  let isNew = !isHeld && list.side !== side
  for (const [path, text] of isHeld ? [] : drawnFiles) {
    const now = await readOr($, path)
    if (now !== text) (drawnFiles.set(path, now), (isNew = true))
  }
  // Asked for once: a panel the app does not draw just then is not asked for again each second
  if (isNew) return void ((list.side = side), (calmBumps += 1), drawAgain($), (list.side = sideSign()))
  // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
  // every CALM too, not each second
  if (!(isMoving || outputMoved) || isBoxHeld(now) || now - engagedAt < ENGAGED || now - Math.max(list.at, calmAt) < CALM) return
  calmAt = now
  outputMoved = false
  await writeHeldOthers($)
  recordEvent($, 'redraw-calm')
  $.ui.invalidate('ui.render')
}
// Whether an element of the mod's is a box the person types into: an ask's reply box or a key box
const isTypedBox = (element: string | undefined) => /-reply-|^box-.*-field|^config-.*-input$/.test(element ?? '')
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
// The last answer or press given on each card, said there in one grey line for a while after (sentLine)
// `to`: where it stands. 'pressed': a press on a permission, password or key block (`whole` in place of "You pressed …", `said`
// what came of it when it came to nothing); the rest an answer to a question on its way
// ('sending'), written into or sent to its task ('work', 'read'), not sent ('failed', 'lost') or left for the chat ('chat')
// A button's answer keeps the ask it answered and the work it went to (asked, target), so it can be taken back (takeBack)
type Sent = { text: string; ask: string; details?: string; to: 'sending' | 'work' | 'read' | 'chat' | 'pressed' | 'lost' | 'failed'; at: number; line?: string; isHeld?: boolean; isCard?: boolean; isPress?: boolean; said?: string; whole?: string; askAt?: number; asked?: NonNullable<Todo['ask']>; target?: string }
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
const lineOf = (one: Todo) => { const last = ownNote(one); return last ? `${last.at}:${last.text}` : '' }
// How long the card says what was answered, unless the work writes a newer line first
const ANSWER_SHOWN = 60_000
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
  !isReply || (!ask.refused && (!ask.choices?.length || ask.choices.some(choice => plainWords(choice) && `${plainWords(said)} `.startsWith(`${plainWords(choice)} `))))
// The asks a press answered, by card, as `${at}:${text}`: the panel draws the card answered from the press itself, its block
// gone in the press's own drawing, before the answer is written; the mark goes once the card's file no longer carries the ask
const askPressed = new Map<string, string>()
// A card as the panel draws it: an ask or a gate already pressed is not drawn as still waiting. A card the person dismissed is
// drawn asking nothing
const asPressed = (given: Todo): Todo => {
  const closed = given.status !== 'working' && !given.closedAt && dismissedNow.has(given.id) ? { ...given, closedAt: dismissedNow.get(given.id) ?? (given.endedAt || 1) } : given
  const one: Todo = closed.closedAt && closed.ask ? { ...closed, ask: undefined } : closed
  const isAnswered = Boolean(one.ask && askPressed.get(one.id) === `${one.ask.at}:${one.ask.text}`)
  const admins = one.admins?.filter(gate => !gatePressed.has(gate.id))
  if (!isAnswered && admins?.length === one.admins?.length) return one
  return { ...one, ask: isAnswered ? undefined : one.ask, admins: admins?.length ? admins : undefined }
}
// Where anything is typed for the panel: one box in the bar above the prompt (band.tsx), a site of its own that the pane's
// scrolling does not reach. The desktop app keeps moving a pane's window back to a box that holds the cursor inside it, many times a
// second, and reports each move as the person's own scroll (found live, 15 Nov), so nothing is typed inside the panel there. The
// box is there only once the person asks for it, with a press on a block or a card: Answer in words, Type it, Paste it, Change
// something, or Continue on a result; Close takes it away again.
// A bar the person folded shows nothing of the mod's, one of the app's surveys takes its place, and the terminal's bar draws no
// field: there the block keeps one field of its own, so words can always be typed somewhere (repliesInBar)
const barBoxes = new Set<string>()
const repliesInBar = (surface: string) => barBoxes.has(surface)
// When the bar's box last took the cursor or a letter, 0 once the cursor is known to have left it or its words were sent: the bar
// gives its own drawing again for BAR_BOX_HELD after it (band.tsx, barHeld), and the mod puts off its other redraws for TYPING
// after it (isBoxHeld). The app may say nothing when the cursor leaves for the chat's own box, so both end by themselves
let barBoxAt = 0
const BAR_BOX_HELD = 300_000
const isBarBox = (element: string | undefined) => /^band-.*-reply-/.test(element ?? '')
// What the one box is open for, none when it is closed: an answer in words to a card's question (`id` its card, `mark` the
// question it was opened on), a change to a done task (its card), a key to paste or words in its place (the key box's id), a
// password to type (its box's id), or what to do next from a result (the result's id). One box at a time: opened for something
// else it is that thing's, and what was half typed for a question is kept for its card. Nothing but the person closes or moves it
// while what it is for still waits: when a task puts a new question in place of the one the box was opened on, the box stays as it
// is, with what is typed in it, and what is sent from it answers the question the task asks then (16 Nov, the person: "it should
// just allow me to keep typing until I myself either close it or open the new question")
type BarKind = 'answer' | 'change' | 'key' | 'words' | 'password' | 'continue' | 'permission'
let barOpen: { kind: BarKind; id: string; mark: string } | undefined
const isBarOpen = (kind: BarKind, id: string) => barOpen?.kind === kind && barOpen.id === id
const isReplyOpen = (one: Todo) => Boolean(one.ask) && isBarOpen('answer', one.id)
// Closed for what it was open for, as that is answered or goes; the caller draws again
const closeBarOf = (id: string) => void (barOpen?.id === id && ((barOpen = undefined), (barBoxAt = 0)))
// The open box's own name, the same through a new question of its task, and a new one after each thing sent from it
const barBoxKey = () => (barOpen ? `band-${barOpen.id}-reply-${barOpen.kind}-${isBoxKind(barOpen.kind) ? (boxTries.get(barOpen.id) ?? 0) : (replies.get(barOpen.id) ?? 0)}-${barOpen.mark}` : '')
// What is typed in it and not sent, kept for an answer, a change and a result (never for a key or a password)
const barDraft = () => (barOpen ? `${barOpen.id}|${barOpen.kind === 'answer' ? barOpen.mark : barOpen.kind}` : '')
// This chat's cards that wait for an answer
const asksForBar = (cards: Todo[]) => cards.filter(one => !one.parentId && !one.chat && Boolean(asPressed(one).ask) && !isActingOnReply(one))
const barTarget = (cards: Todo[]) => (barOpen?.kind === 'answer' ? asksForBar(cards).find(isReplyOpen) : undefined)
// A card's blocks moved under the pointer: what the panel draws above them changed a moment before a press on one of them. The press
// was aimed at what stood there before, so it does nothing, and the block says so (19 Nov: an empty space above closed as the person
// reached for Answer in words on one card, and the same button of the card below slid under the pointer: the press, the box and the
// answer went to that other task). Judged on the list as last drawn on the desktop: what stands above each card's first block
// (askAbove), and when that last changed (askMovedAt)
const askAbove = new Map<string, string>()
const askMovedAt = new Map<string, number>()
// (a person takes about half a second to see a change and a little more to stop a click already on its way)
const MOVED_HOLD = 1500
const isMovedUnder = (card: string) => pressedAt - (askMovedAt.get(card) ?? -Infinity) < MOVED_HOLD
// The blocks a press was held back on, by block, with when the block came: it says so until it is pressed again or goes
const movedPresses = new Map<string, number>()
const MOVED_SAID = 'This moved as you pressed, so nothing was sent. Press again.'
// The list as just drawn on the desktop: each card whose block moved is marked so from `at`
const markMoved = (now: Map<string, string>, at: number) => {
  for (const [card, sign] of now) if (askAbove.has(card) && askAbove.get(card) !== sign) askMovedAt.set(card, at)
  askAbove.clear()
  for (const [card, sign] of now) askAbove.set(card, sign)
}
// The bar's own id on each surface, as its drawing is asked for: where the cursor is put when the box opens
const barIds = new Map<string, string>()
// What was typed in the bar's box is its card's: when the work has since put a new question in place of the one the box was
// opened on, the words are shown under that question too, in the box as it is opened again and in the card's own field when the
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
// Opens the one box for something, or closes it (no `to`). Opening it, the cursor is asked into the box: the app gives it only
// where the bar already holds the keys, so where it does not the person clicks the box
const openBar = ($: EngineInterface, to: { kind: BarKind; id: string; one?: Todo } | undefined, surface: string) => {
  const was = barOpen
  // What was half typed for a question is kept for its card; a box for a change or a result, closed, is a new one, empty, next time
  if (was?.kind === 'answer') barLeft.set(was.id, barDraft())
  if (was && (was.kind === 'change' || was.kind === 'continue')) (drafts.delete(barDraft()), keepDraft($, barDraft(), undefined), replies.set(was.id, (replies.get(was.id) ?? 0) + 1))
  const ask = to?.kind === 'answer' ? to.one?.ask : undefined
  const next = to && (to.kind !== 'answer' || ask) ? to : undefined
  if (next?.one && ask) (carryDraft($, next.one, barLeft.get(next.id)), barLeft.delete(next.id))
  barOpen = next ? { kind: next.kind, id: next.id, mark: ask ? askMark(ask) : '' } : undefined
  barKeyTyped.clear()
  if (next && isBoxKind(next.kind)) (boxHeldReply.delete(next.id), boxSaid.delete(next.id))
  barBoxAt = 0
  isBarSettling = false
  presses += 1
  boxPresses += 1
  freeTimes($)
  redraw($)
  const bar = barIds.get(surface)
  if (!next || !bar) return
  void $.ui
    .focus({ requestId: bar, key: barBoxKey() })
    .then(r => recordEvent($, 'focus-call', { deny: r.deny ?? null }))
    .catch(err => recordEvent($, 'focus-call', { failed: String(err).slice(0, 80) }))
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
// Message, on a card of this chat's that works or has finished: the same box, opened for a card that asks nothing. What is sent from it
// goes to that task as the person's own words, which carries it on from the submit's or the press's own hook (answersOnWay,
// toEnded), never from a timer, and the chat is only told, with no turn of its own
// (a finished one with to-dos left open too: the person may write to any task that works or has finished, 19 Nov)
const canChange = (one: Todo) => !one.chat && !one.parentId && (one.status === 'working' || one.status === 'done' || one.status === 'failed') && !isHeld(one) && !needsPerson(one)
// A message goes the one way from both places the person writes to a task: the box above the chat that Message opens, and the box
// at the bottom of the task's Details. Send hands it to the task, which reads it at its next step: Claude Code queues a message to a
// task at work until its next tool round, and starts a paused or finished one with it at once. Stop and send, while it works, stops
// it first (interruptStep) and starts it again with the message: Claude Code has no way to cut only the step a task is on, and its
// stop ends the task's own commands and helpers too (engine 2.1.326, read 19 Nov). The files picked with Attach go with it, each by
// its path: a message to a task is text alone
const sendChange = ($: EngineInterface, id: string, value: string, isNow = false) => {
  const files = attached.get(id) ?? []
  attached.delete(id)
  const run = changeTask($, id, value.trim(), files, isNow)
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
// The files picked for a message to each task, by its card, until the message goes or the person takes one off
const attached = new Map<string, string[]>()
const ATTACH_MOST = 20
// Attach opens the computer's own file picker, where the engine runs: so not in a chat run on another Mac over ssh, whose picker
// would open on that Mac's screen (isRunFromAfar). macOS through osascript, Linux through zenity
const canAttach = () => !isRunFromAfar
const PICK_MAC = ['osascript', '-e', 'activate', '-e', 'set picked to choose file with prompt "Attach files" with multiple selections allowed', '-e', 'set out to ""', '-e', 'repeat with f in picked', '-e', 'set out to out & POSIX path of f & linefeed', '-e', 'end repeat', '-e', 'return out']
const PICK_LINUX = ['zenity', '--file-selection', '--multiple', '--separator=\n', '--title=Attach files']
const pickFiles = async ($: EngineInterface, id: string) => {
  if (!canAttach()) return
  // (a picker left open is the person's: it waits for them, the ten minutes a command of the mod's may run at most; cancelled, it
  // adds nothing)
  const r = await $.process.run(isLinux ? PICK_LINUX : PICK_MAC, { timeoutMs: 600_000 }).catch(err => (log($, `files not picked: ${String(err)}`), undefined))
  if (!r || r.exitCode !== 0) return
  const picked = r.stdout.split('\n').map(line => line.trim()).filter(line => line.startsWith('/'))
  if (!picked.length) return
  attached.set(id, [...new Set([...(attached.get(id) ?? []), ...picked])].slice(0, ATTACH_MOST))
  ;((presses += 1), (boxPresses += 1), drawAgain($, true))
}
const unattach = ($: EngineInterface, id: string, path: string) => {
  const left = (attached.get(id) ?? []).filter(one => one !== path)
  if (left.length) attached.set(id, left)
  else attached.delete(id)
  ;((presses += 1), (boxPresses += 1), drawAgain($, true))
}
// What is typed for a message to a task, kept under one name wherever it is typed: the box above the chat and the box in Details
// are the same message
const messageDraft = (id: string) => `${id}|change`
// Sent from either box: the words go, the box empties (a new one, by its key), and the box above the chat, open for this task,
// closes
const sendMessageFrom = ($: EngineInterface, id: string, value: string, isNow: boolean) => {
  if (!value.trim() && !attached.get(id)?.length) return
  barBoxAt = 0
  paneBoxAt = 0
  drafts.delete(messageDraft(id))
  keepDraft($, messageDraft(id), undefined)
  replies.set(id, (replies.get(id) ?? 0) + 1)
  if (isBarOpen('change', id)) barOpen = undefined
  freeTimes($)
  redraw($)
  void sendChange($, id, value, isNow).catch(err => log($, `message not sent: ${String(err)}`))
}
// The row under a message box, the same in the box above the chat and at the bottom of Details: the files picked, each taken off
// with a press on its name; Attach; then, while the task is in the middle of a step, Send now, and Send, the big one; `close`,
// the box above the chat's own Close
const SEND_NOW = 'Stop and send'
const messageFoot = ($: EngineInterface, ui: Ui, one: Todo, key: string, close: JSX.Element | null = null) => {
  const files = attached.get(one.id) ?? []
  const typed = () => drafts.get(messageDraft(one.id)) ?? ''
  const isMidStep = one.status === 'working'
  return (
    <ui.Box key={`${key}-foot`} flexDirection="column" flexShrink={0} gap={1} width="100%">
      {files.length ? (
        <ui.Box key={`${key}-files`} flexDirection="row" flexWrap="wrap" columnGap={2}>
          {files.map((path, n) => (
            <ui.Button key={`${key}-file-${n}-${presses}`} label={`📎 ${cut(path.split('/').pop() ?? path, 40)} ✕`} plain dimColor onPress={() => unattach($, one.id, path)} />
          ))}
        </ui.Box>
      ) : null}
      <ui.Box flexDirection="row" alignItems="center" flexWrap="wrap" gap={1}>
        {canAttach() ? <ui.Button key={`${key}-attach-${presses}-${boxPresses}`} label="Attach" plain onPress={() => void pickFiles($, one.id).catch(err => log($, `files not picked: ${String(err)}`))} /> : null}
        {/* The sends keep together at the right, on the next line when the pane is narrow */}
        <ui.Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} justifyContent="flex-end">
          {isMidStep ? <ui.Button key={`${key}-now-${presses}-${boxPresses}`} label={SEND_NOW} onPress={() => sendMessageFrom($, one.id, typed(), true)} /> : null}
          <ui.Button key={`${key}-send-${presses}-${boxPresses}`} label="Send" variant="primary" onPress={() => sendMessageFrom($, one.id, typed(), false)} />
          {close}
        </ui.Box>
      </ui.Box>
    </ui.Box>
  )
}
// The box at the bottom of a task's Details, for a task of this chat's that works or has finished and asks nothing: what is typed
// in it is the same message as in the box above the chat (messageDraft), and it goes the same way. The desktop app pulls a pane's
// window back to a box that holds the cursor each time the pane is drawn, and draws the box's ring again: so while it holds the
// cursor or is typed in, the tab is given again as it was, reading nothing, and the mod's own redraws wait (paneBoxAt, isBoxHeld),
// as the box above the chat is held. At the bottom, the pull, should one come, is to where the person types
let paneBoxAt = 0
let paneBoxIn = ''
const isPaneBox = (element: string | undefined) => /^details-.*-reply-/.test(element ?? '')
const paneBoxKey = (id: string) => `details-${id}-reply-change-${replies.get(id) ?? 0}`
const isPaneBoxHeld = (paneId: string, at: number) => paneBoxIn === paneId && paneBoxAt > 0 && at - paneBoxAt < BAR_BOX_HELD
// The Details drawing given again while its box is held, by pane, with what the box was drawn for: its key and its files
const paneBoxHeld = new Map<string, { id: string; shape: string; drawing: unknown }>()
const paneBoxShape = (id: string) => JSON.stringify([paneBoxKey(id), attached.get(id) ?? [], presses, boxPresses])
const messageBox = ($: EngineInterface, ui: Ui, one: Todo, paneId: string) => (
  <ui.Box key={`message-${one.id}`} flexDirection="column" gap={1} flexShrink={0}>
    {'Input' in ui ? (
      <ui.Input
        key={paneBoxKey(one.id)}
        placeholder="Type your message"
        value={draftDrawn(messageDraft(one.id))}
        rows={BOX_ROWS}
        onInput={value => {
          drafts.set(messageDraft(one.id), value)
          keepDraft($, messageDraft(one.id), value)
          holdTimes($)
          paneBoxIn = paneId
          void $.clock.now().then(at => (paneBoxAt = at))
        }}
        onSubmit={value => sendMessageFrom($, one.id, value, false)}
      />
    ) : null}
    {messageFoot($, ui, one, `details-${one.id}`)}
  </ui.Box>
)
// Stop and send: the task is stopped as Claude Code stops one (TaskStop), which ends its step, its commands and its helpers, and its
// card stays at work, as the message starts it again from its saved conversation (interrupting). Once Claude Code no longer lists it
// as running, at most INTERRUPT_WAIT, the message goes
const interrupting = new Set<string>()
const INTERRUPT_WAIT = 10_000
const interruptStep = async ($: EngineInterface, card: Todo) => {
  interrupting.add(card.id)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: card.id }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (interrupting.delete(card.id), log($, `task ${card.id} not stopped for a message: ${r.deny}`), false)
  const from = await $.clock.now()
  while ((await $.clock.now()) - from < INTERRUPT_WAIT) {
    const it = (await $.agent.list().catch(() => [])).find(one => one.id === card.id)
    if (!it || it.status !== 'running') break
    await $.clock.sleep(250)
  }
  $.clock.after(60_000, () => void interrupting.delete(card.id))
  return true
}
// What kind of file each is, by its ending, for how the task opens it
const fileKind = (path: string) => {
  const end = (path.split('.').pop() ?? '').toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(end)) return 'picture'
  if (['heic', 'heif', 'tif', 'tiff', 'bmp'].includes(end)) return 'picture-other'
  if (['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi'].includes(end)) return 'video'
  if (end === 'pdf') return 'pdf'
  return 'file'
}
// The paths a message names: picked with Attach, or typed or dropped into the box as text (a terminal types a dropped file's path,
// its spaces escaped; a file:// address is a path too). Only the ones that are files on this computer
const pathsIn = async ($: EngineInterface, said: string) => {
  const found = new Set<string>()
  for (const m of said.matchAll(/(?:file:\/\/)?(\/(?:\\ |[^\s'"`<>])+)|'(\/[^'\n]+)'|"(\/[^"\n]+)"/g)) {
    const raw = m[1] ?? m[2] ?? m[3] ?? ''
    const path = (() => {
      try {
        return decodeURIComponent(raw.replace(/\\ /g, ' ').replace(/[.,;:)]+$/, ''))
      } catch {
        return raw.replace(/\\ /g, ' ')
      }
    })()
    if ((await $.fs.stat(path).catch(() => undefined))?.kind === 'file') found.add(path)
  }
  return [...found]
}
// What the task is told with the files: each path, and how a task opens one of its kind
const filesNote = (files: string[]) =>
  files.length
    ? `\n\nFiles with this message, on this computer: open each one before you act on the message.\n${files
        .map(path => {
          const kind = fileKind(path)
          const how =
            kind === 'picture' || kind === 'pdf'
              ? 'open it with Read'
              : kind === 'picture-other'
                ? 'turn it into a PNG in your scratch folder (sips -s format png on a Mac, convert on Linux), then open that with Read'
                : kind === 'video'
                  ? 'take stills from it into your scratch folder with ffmpeg (one a second, or more where it moves fast), then open them with Read; ffprobe gives its length'
                  : 'read it as its kind needs'
          return `- ${path} (${how})`
        })
        .join('\n')}`
    : ''
const changeTask = async ($: EngineInterface, id: string, said: string, picked: string[] = [], isNow = false) => {
  const card = (await read($, todos)).find(one => one.id === id)
  if (!card || (!said && !picked.length) || card.chat || card.parentId || isHeld(card)) return
  const at = await $.clock.now()
  const files = [...new Set([...picked, ...(await pathsIn($, said))])]
  const shown = [said, ...picked.map(path => `📎 ${path.split('/').pop() ?? path}`)].filter(Boolean).join('\n')
  await changeTodos($, list => list.map(one => (one.id === id ? { ...one, entries: [...one.entries, { at, kind: 'steer' as const, text: shown }].slice(-ENTRIES_KEPT) } : one)))
  const words = `${said || '(no words, only the files below)'}${filesNote(files)}`
  // Send now on a task in the middle of a step: that step is stopped first, and the message starts it again from there
  if (isNow && card.status === 'working' && (await interruptStep($, card))) {
    await toEnded($, card, id, MESSAGE_NOW(words), { text: shown, ask: CHANGE_WHAT, at, line: lineOf(card), isCard: true })
    return void (await tellChat($, named(CHANGE_TOLD(titleOf(card), `“${cut(shown, 120)}”`))))
  }
  const text = card.status === 'working' ? MESSAGE_SENT(words) : CHANGE_ASKED(words)
  const sent = { text: shown, ask: CHANGE_WHAT, at, line: lineOf(card), isCard: true }
  const told = (await read($, todos)).find(one => one.id === id)?.status === 'working' ? await tell($, id, text) : undefined
  if (told && !told.deny) (writtenIn($, id, id), sentReplies.set(id, { ...sent, to: 'work' }), redraw($))
  else await toEnded($, card, id, text, sent)
  await tellChat($, named(CHANGE_TOLD(titleOf(card), `“${cut(shown, 120)}”`)))
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
  if (isBarOpen('answer', one.id)) closeBarOf(one.id)
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, ...(ask.details ? { details: ask.details } : {}), to: 'sending', at: Infinity, line, isCard: true, askAt: ask.at })
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
    if (!isBack) $.ui.log(`Your answer “${cut(said, 120)}” to "${titleOf(one)}" didn't reach its task, and the question couldn't be put back on its card. Type your answer in this chat instead. The question: ${ask.text}`)
    redraw($)
    throw err
  }
}
// The rest of an answer once its ask is cleared from the card's file: written into its task at a step, or sent to it paused
const answerCleared = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, isReply: boolean, target: string, at: number, line: string) => {
  answeredAt.set(one.id, ask.at)
  dropDrafts($, one.id)
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  // The first choice of a go-ahead for a release: the press is the permission, so it also allows that card's next run of the
  // release runner for that folder, once (gate.tsx, allowRelease), before the task hears of it. It has no way back
  const isRelease = !isReply && !ask.refused && Boolean(ask.release) && ask.choices?.[0] === said && (await allowRelease($, one.id, ask.release ?? '').catch(err => (void log($, `release not allowed by the press: ${String(err)}`), false)))
  // A command Claude Code blocked: Allow, pressed on this card in this chat's own panel, runs it now, once, as the person's
  // (runit.tsx); anything else leaves it not run. Words never run it
  const run = ask.refused && !isReply && said === ALLOW ? runAsked.get(one.id) : undefined
  const isRun = Boolean(run && run.askAt === ask.at && run.command === ask.copy)
  const back = isReply || isRelease || ask.refused ? {} : { asked: ask, target }
  const sent = { text: said, ask: ask.text, ...(ask.details ? { details: ask.details } : {}), at, line, isCard: true, askAt: ask.at, ...(ask.refused && !isReply ? { isPress: true } : {}), ...back }
  sentReplies.set(one.id, { ...sent, to: 'sending' })
  redraw($)
  // The card says the answer for ANSWER_SHOWN, and no more after
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  const to = ask.refused
    ? isRun && run
      ? await startRun($, one, run)
      : REFUSAL_ANSWERED(ask.copy ?? ask.text, said, isReply)
    : isReply
      ? `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}`
      : `${who(true)} pressed "${said}" in answer to your question: ${ask.text}${isRelease ? `\n${RELEASE_PRESSED(ask.release ?? '')}` : ''}`
  // A task whose run ended a moment ago refuses the line: it is sent to it as a message instead, which starts it with it
  // Marked on its way once written, so a step that began before it never counts as reading it
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const told = working ? await tell($, target, to) : undefined
  // A press on a blocked command starts no task again and is never sent twice: a task at a step reads it there, and one that has
  // ended hears what the command printed when it ends (runit.tsx), or nothing of a command that was not run
  if (ask.refused && !isReply) {
    if (told && !told.deny) writtenIn($, target, one.id)
    else void log($, `${said} on a blocked command of ${target}, which is not at a step: it is not started again for it`)
    sentReplies.set(one.id, { ...sent, to: 'pressed' })
    redraw($)
    return void askGone($, one, said)
  }
  if (told && !told.deny) {
    writtenIn($, target, one.id)
    sentReplies.set(one.id, { ...sent, to: 'work' })
    redraw($)
  } else await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, sent)
  // Said in the chat only once the answer is on its way
  void askGone($, one, said)
}
// What a task is told with the press on its go-ahead for a release: the press allows its release run, which it does itself
const RELEASE_PRESSED = (folder: string) =>
  `That press is the permission for the release: your next run of the release runner for ${folder} goes through once, within the hour, with nothing more asked. Run it now as your rules say, in your background, say on your card what you are releasing, and hand in your result once it has finished.`
// A button's answer can be taken back while the card says it (heldAnswer, ANSWER_SHOWN), unless the work has asked again since: a press
// meant for something else lands on an answer (16 Nov: "Not now" pressed while reaching for the picture above it, as the panel
// jumped). The ask is put back on the card with its buttons, to be answered again, and the work is told not to act on the answer:
// written in while it runs, dropped from a message still waiting to start it again, and nothing when it has since ended (its
// card then waits on the person again). A permission, and the go-ahead for a release, have no way back
const canTakeBack = (one: Todo, now: number) => {
  const sent = heldAnswer(one, now)
  // Only while the card still says it (sentLine), never for an answer left in the chat, whose model has it already
  return Boolean(sent?.asked && !sent.isHeld && !['pressed', 'sending', 'chat'].includes(sent.to) && !one.ask && !one.chat && sentLine(one, now))
}
// (at: the answer the button was drawn for: a click on a drawing held from before takes back nothing newer)
const takeBack = ($: EngineInterface, one: Todo, at: number) => {
  const run = takeBackNow($, one, at)
  // The press hook sends what waits only once this is done (sendWakes), so the answer taken back is never sent
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
const takeBackNow = async ($: EngineInterface, one: Todo, shownAt: number) => {
  const sent = sentReplies.get(one.id)
  const ask = sent?.asked
  if (!sent || !ask || sent.at !== shownAt) return
  const target = sent.target ?? one.id
  // Judged on the card as it is now, not as the drawing pressed showed it (a held drawing may be older than a newer question), and
  // before the answer leaves anything: one that cannot be taken back stays answered, its waiting message and all
  const now = (await read($, todos)).find(card => card.id === one.id)
  if (!now || sentReplies.get(one.id) !== sent || !canTakeBack(now, await $.clock.now())) return
  // A message still waiting to start the work again loses this answer; one that carries only it goes
  const waiting = wakes.find(w => w.target === target && w.answers.some(a => a.one.id === one.id && a.sent.at === sent.at))
  if (waiting) {
    waiting.answers = waiting.answers.filter(a => !(a.one.id === one.id && a.sent.at === sent.at))
    if (!waiting.answers.length) wakes.splice(wakes.indexOf(waiting), 1)
    else waiting.text = `${waiting.text}\n\n${TAKEN_BACK(sent.text, ask.text)}`
  }
  sentReplies.delete(one.id)
  answeredAsks.delete(`${one.id}:${ask.at}:${ask.text}`)
  if (answeredAt.get(one.id) === ask.at) answeredAt.delete(one.id)
  if (pending.get(target) === one.id) pending.delete(target)
  for (const key of startedBy) if (key === `${one.id}:${sent.at}`) startedBy.delete(key)
  const at = await $.clock.now()
  let isBack = false
  await changeTodos($, list => ((isBack = false), list).map(card => (card.id === one.id && !card.ask ? ((isBack = true), { ...card, ask, entries: [...card.entries, { at, kind: 'steer' as const, text: `took back “${sent.text}”` }].slice(-ENTRIES_KEPT) }) : card)))
  redraw($)
  void log($, `answer "${cut(sent.text, 40)}" for ${one.id} taken back`)
  // The chat was told it was answered: it is told it was taken back, and shown the question again
  if (isBack) {
    await tellChat($, named(`${who(true)} took back their answer “${cut(sent.text, 120)}” to "${titleOf(one)}": the question is open again on its card.`))
    inChat.delete(one.id)
    void askInChat($, { ...one, ask })
  }
  // Work at work, or started again by this answer a moment ago, is told not to act on it; a message that still waits carries it already
  if (!waiting) await tell($, target, TAKEN_BACK(sent.text, ask.text)).catch(err => log($, `work not told of an answer taken back: ${String(err)}`))
}
const TAKEN_BACK = (said: string, asked: string) =>
  `${who(true)} took back their answer "${said}" to your question ("${asked}"): it was pressed by mistake. Do not act on it, and undo what you already did on it if you can. The question is on your card again, and their answer comes to you as a message.`
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
    ((isHeld = false), list).map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isHeld = true), { ...card, ask: { ...card.ask, replied: { text: said, at, ...(isWaking ? { isWaking } : {}) }, ...(card.ask.refused ? { talk: [...(card.ask.talk ?? []), { by: 'you' as const, text: cut(said, ASK_DETAILS) }].slice(-PERMIT_TALK_KEPT) } : {}) }, entries: [...card.entries, { at, kind: 'steer' as const, text: said }].slice(-ENTRIES_KEPT) }) : card)),
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
  // The card says the answer for ANSWER_SHOWN, and no more after
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  // Said in the chat once; the ask is then done with there, so the work asking again is sent to the chat afresh
  if (inChat.has(one.id)) (inChat.delete(one.id), void tellChat($, named(ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`))))
  const working = (await read($, todos)).find(card => card.id === target)?.status === 'working'
  const to = ask.refused ? REFUSAL_WORDS(ask.copy ?? ask.text, said) : `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}\n${named(REPLY_HOLDS)}`
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn($, target, one.id), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line, isCard: true, askAt: ask.at })
}
// An answer to a task that is not at a step (paused, or ended) goes to it as a message, which starts it with it: the chat then
// gets the task's result as it gets any, and nothing goes into the chat in the person's place.
// The engine runs what a mod sends from outside its hooks (a timer, a button's own handler) under the mod's own origin, and a task
// started that way runs with every hook of the mod skipped: each of its panel tools answered "no tool.call hook answered", and its
// question never reached the card. So an answer travels one way: it waits here only until the hook of the press or the submit that
// gave it, which waits for it and sends it from inside itself (sendWakes, tabs.tsx), and one given inside a hook already goes at
// once. Nothing sends one from a timer. One a copy a reload replaced still holds goes to the chat instead: a notice the person
// sees and a row its model reads, with no turn of its own
// Each message carries every answer joined into it, so each card's line and the chat's notice are settled for every one
const wakes: { target: string; text: string; answers: { one: Todo; sent: Omit<Sent, 'to'> }[] }[] = []
const toEnded = async ($: EngineInterface, one: Todo, target: string, text: string, sent: Omit<Sent, 'to'>) => {
  // Marked on its way before it is sent, so a run that starts before the send resolves counts as reading it
  pending.set(target, one.id)
  // A reply that holds its ask is acted on from now: no answers on the card while its work is started again with it
  await changeTodos($, list => list.map(card => (card.id === one.id && card.ask?.replied?.text === sent.text && !card.ask.replied.isWaking && card.status !== 'working' ? { ...card, ask: { ...card.ask, replied: { ...card.ask.replied, isWaking: true } } } : card)))
  sentReplies.set(one.id, { ...sent, to: 'work' })
  redraw($)
  // One message for a task: a second answer for the same one joins the first
  const same = wakes.find(w => w.target === target)
  if (same) ((same.text = `${same.text}\n\n${text}`), same.answers.push({ one, sent }))
  else wakes.push({ target, text, answers: [{ one, sent }] })
  if (await isInHook($)) await sendWakes($)
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
  // A task the person stopped is not started by an answer that was on its way
  if (isHeld((await read($, todos)).find(one => one.id === wake.target))) return void (await log($, `task ${wake.target} not started with an answer: the person stopped it`))
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await sendOwn($, { to: { agentId: wake.target }, text: wake.text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return void (await wakeFailed($, wake, r.reason))
  // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
  await wakeCard($, wake.target)
  // Started by the message, the task reads it in the run it starts: that run's end never sends it a second time
  for (const { one, sent } of wake.answers) startedBy.add(`${one.id}:${sent.at}`)
}
// The answers, by card and when given, that started their work again: the run each started reads it
const startedBy = new Set<string>()
// An answer written into work under way, which reads it at a step of its own: an earlier wake's run no longer covers this card
const writtenIn = ($: EngineInterface, target: string, card: string) => {
  pending.set(target, card)
  for (const key of startedBy) if (key.startsWith(`${card}:`)) startedBy.delete(key)
}
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
const wakeCard = async ($: EngineInterface, target: string) => {
  const now = await $.clock.now()
  await changeTodos($, list => list.map(card => (card.id !== target || card.status === 'working' ? card : resumed(card, now))))
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
  const answers = ask.choices ?? []
  // The person sees the ask on its card, and is told by the panel's notification; the chat's model reads it in a row of its own,
  // with how to pass an answer on, which starts no turn and shows nothing in the chat
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(err => (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, `chat not told of an ask: ${String(err)}`)))
}
// A row only the chat's model reads, with no turn of its own: what a task's card already shows the person, such as an answer they
// gave there themselves. Nothing of a task's shows in the chat but what the chat itself writes (17 Nov: "✓ You replied to … on its
// card" was among the updates they called pointless; 18 Nov: "What are all of these fucking shits within the chat?"), and the chat
// says it in its next reply only where it matters to what the person asks
const tellChat = async ($: EngineInterface, text: string) => {
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } }).catch(err => log($, `chat not told: ${String(err)}`))
}
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
const askGone = async ($: EngineInterface, one: Todo, said?: string) => {
  if (!inChat.has(one.id)) return
  inChat.delete(one.id)
  // What the person did on the card themselves, or a question the work withdrew, is no news to them: only the chat's model is told
  await tellChat($, said === undefined ? ASK_CLEARED(titleOf(one)) : named(ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`)))
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
// The work an answer was written into starts its next step: that step reads it. What a command the person allowed printed, kept
// for this step, is written in now (runsAtStep)
const replyRead = ($: EngineInterface, agentId: string) => {
  if (runList.some(run => run.waiting?.target === agentId)) void runsAtStep($, agentId).catch(err => log($, `output of a command not passed on: ${String(err)}`))
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  if (sent?.to === 'work') (sentReplies.set(card, { ...sent, to: 'read' }), redraw($))
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
// An answer or a press given on the card in the last ANSWER_SHOWN: the card says it
const heldAnswer = (one: Todo, now: number) => {
  const sent = one.chat ? undefined : sentReplies.get(one.id)
  return sent?.isCard && sent.to !== 'lost' && now - sent.at < ANSWER_SHOWN ? sent : undefined
}
// The one grey line a card says of what the person last pressed or answered on it, for ANSWER_SHOWN after: what was pressed, and
// nothing of who reads it. A reply that left its question open says so under it; an answer that could not be sent says so too
// A reply that holds its ask is said for as long as the card carries it, as it stands in place of the question there. `most`: how
// many of the person's letters it gives (Details gives them all)
const sentLine = (one: Todo, now: number, most = 60) => {
  const sent = sentReplies.get(one.id)
  // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
  const replied = one.ask?.replied
  const heldLine = replied ? `✓ You answered “${cut(replied.text, most)}”${isActingOnReply(one) ? '' : ' · the question is still open'}` : ''
  if (replied && !(sent && sent.ask === one.ask?.text && (sent.text === replied.text || sent.isHeld))) return heldLine
  if (!sent) return ''
  if (sent.to === 'failed') return one.ask?.text === sent.ask ? `Couldn't send “${cut(sent.text, most)}” · press it again` : ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Couldn't reach that Mac with “${cut(sent.text, most)}” · answer in its own chat` : ''
  if (now - sent.at > ANSWER_SHOWN) return heldLine
  if (sent.to === 'pressed') return `✓ ${sent.whole || `You pressed “${sent.text}”`}${sent.said ? ` · ${sent.said}` : ''}`
  const isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || one.ask.replied?.text === sent.text))
  if (one.ask && !isHeld) return ''
  if (sent.to === 'chat') return `✓ You answered “${cut(sent.text, most)}” · it couldn't reach the task, so it goes with your next message`
  if (sent.isPress) return `✓ You pressed “${cut(sent.text, most)}”`
  return `✓ You ${sent.ask === CHANGE_WHAT ? 'wrote' : 'answered'} “${cut(sent.text, most)}”${isHeld && !isActingOnReply(one) ? ' · the question is still open' : ''}`
}
// A block a press answered on a small card, by card: the card holds the rows it took (foldRows) under the grey line that takes its
// place, for FOLD_HELD from the first drawing that shows it so, then closes up. `need`: the block's id and when it came, so the rows
// stand where it stood among the card's other blocks. Its time is counted in the panel's own drawing, which also asks for the drawing
// that closes it, and the end of each is part of what the person's own presses change (personSign), so a panel held while they use
// it scrolled down closes it too (19 Nov: the space after Release it never closed while the person moved about the panel)
const answerFolds = new Map<string, { need: string; came: number; rows: number; at: number; pressed: number }>()
const FOLD_HELD = 3000
// (one never drawn within FOLD_UNSEEN of its press is let go, so a card first shown later never opens a space)
const FOLD_UNSEEN = 10_000
const holdFold = (card: string, need: string, came: number, rows: number) => void answerFolds.set(card, { need, came, rows, at: Infinity, pressed: Date.now() })
// The rows a card holds now for a block just answered, while that block is no longer drawn
const foldOf = ($: EngineInterface, card: string, now: number, drawn: string[]) => {
  const fold = answerFolds.get(card)
  if (!fold || drawn.includes(fold.need)) return undefined
  if (fold.at === Infinity) {
    if (Date.now() - fold.pressed > FOLD_UNSEEN) return void answerFolds.delete(card)
    answerFolds.set(card, { ...fold, at: now })
    $.clock.after(FOLD_HELD + 50, () => drawAgain($))
    return fold
  }
  if (now - fold.at < FOLD_HELD) return fold
  answerFolds.delete(card)
  return undefined
}
// The cards whose space is still held, as a drawing at `now` would show them
const foldsHeld = (now: number) => [...answerFolds].filter(([, fold]) => now - fold.at < FOLD_HELD).map(([card]) => card)
// What was pressed on a block, said in one grey line where the block was: on its task's card (sentLine), or at the top of the
// panel for a block that belonged to no task (loosePressed). Drawn from the press itself, before anything is awaited
let loosePressed: { text: string; at: number }[] = []
const pressedLine = ($: EngineInterface, card: string, label: string, said = '', whole = '') => {
  const sent: Sent = { text: label, ask: '', to: 'pressed', at: Infinity, isCard: true, ...(said ? { said } : {}), ...(whole ? { whole } : {}) }
  const loose = { text: `✓ ${whole || `You pressed “${label}”`}${said ? ` · ${said}` : ''}`, at: Infinity }
  if (card) sentReplies.set(card, sent)
  else loosePressed = [...loosePressed, loose].slice(-4)
  redraw($)
  void $.clock
    .now()
    .then(at => {
      if (card && sentReplies.get(card) === sent) sentReplies.set(card, { ...sent, at })
      loosePressed = loosePressed.map(one => (one === loose ? { ...one, at } : one)).filter(one => at - one.at < ANSWER_SHOWN)
      // Drawn again as its time ends, so it goes with nothing else to redraw the panel
      $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
    })
    .catch(() => undefined)
}
const loosePressedShown = (now: number) => loosePressed.filter(one => now - one.at < ANSWER_SHOWN)



