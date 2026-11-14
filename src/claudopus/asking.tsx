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
const canOpenTerminal = (one: Todo) => Boolean(one.ask?.isCommand && one.ask.copy) && !one.chat?.host && !isRunFromAfar
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
// What the person has typed into a reply box and not sent, by the work, so a redraw keeps it
const drafts = new Map<string, string>()
// While the person types into a reply box the list's running times stand still: the list is drawn again each second, and a box in
// a list drawn that often lost its place and threw the panel to the bottom. Each letter typed, or the box taking the focus, holds
// the times for TYPING more; sending lets them go
const TYPING = 30_000
let typing = 0
let isTyping = false
const holdTimes = ($: EngineInterface) => {
  const made = (typing += 1)
  isTyping = true
  $.clock.after(TYPING, () => void (typing === made && (isTyping = false)))
}
const freeTimes = () => void ((typing += 1), (isTyping = false))
// The last answer given to each work's ask, shown on its card for a while after: sent to the work (which reads a message only at
// its next step, so it says so until that step starts), read by it, or sent to the chat when the work had ended
type Sent = { text: string; ask: string; to: 'work' | 'read' | 'chat' | 'other' | 'lost'; at: number; line?: string; isHeld?: boolean }
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
// The asks of this chat's work already answered, by work and when it asked
const answeredAsks = new Set<string>()
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
const answerNow = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  if (one.chat) return answerElsewhere($, one, choice, isReply)
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
  const at = await $.clock.now()
  let isCleared = false
  await update($, todos, list =>
    list.map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isCleared = true), { ...card, ask: undefined, entries: [...card.entries, { at, kind: 'steer' as const, text: isReply ? said : `${said} — to: ${ask.text}` }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isCleared) return
  drafts.delete(one.id)
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  if (isReply) freeTimes()
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line })
  redraw($)
  void askGone($, one, said)
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your ask ("${ask.text}"), in their own words: ${said}` : `${who(true)} pressed "${said}" in answer to your ask: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn(target, one.id), sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line }), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line })
}
// A reply in the person's own words that does not settle the ask: the ask stays open on the card, with the reply under it, and the
// work is told so; its card stays among the running cards while the work acts on it. A button pressed later still answers it
const holdAsk = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, target: string) => {
  // The same words twice at once count once; typed again later, after an earlier reply, they go again
  const key = `${one.id}:${ask.at}:${ask.text}:reply:${ask.replied?.at ?? ''}:${said}`
  if (answeredAsks.has(key)) return
  answeredAsks.add(key)
  const at = await $.clock.now()
  let isHeld = false
  await update($, todos, list =>
    list.map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isHeld = true), { ...card, ask: { ...card.ask, replied: { text: said, at } }, entries: [...card.entries, { at, kind: 'steer' as const, text: said }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isHeld) return
  // The box keeps its place, emptied, so the focus does not fall onto the ask's first button, which a stray key would press
  drafts.delete(one.id)
  freeTimes()
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line })
  redraw($)
  if (inChat.has(one.id)) void sayInChat($, named(ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`)))
  const working = (await read($, todos)).find(card => card.id === target)?.status === 'working'
  const to = `${who(true)} replied to your ask ("${ask.text}"), in their own words: ${said}\n${named(REPLY_HOLDS)}`
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn(target, one.id), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line })
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
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await $.session.send({ to: { agentId: wake.target }, text: wake.text }).catch(err => ({ isDelivered: false as const, reason: String(err) })).finally(() => ownSent($))
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
const writtenIn = (target: string, card: string) => {
  pending.set(target, card)
  for (const key of startedBy) if (key.startsWith(`${card}:`)) startedBy.delete(key)
}
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
const wakeCard = async ($: EngineInterface, target: string) => {
  const now = await $.clock.now()
  await update($, todos, list => list.map(card => (card.id !== target || card.status === 'working' ? card : (endedByHandback.delete(target), resumed(card, now)))))
}
const wakeFailed = async ($: EngineInterface, { target, answers }: (typeof wakes)[number], reason: string) => {
  if (answers.some(({ one }) => pending.get(target) === one.id)) pending.delete(target)
  await log($, `work ${target} not started again with an answer: ${reason}`)
  for (const { one, sent } of answers) {
    sentReplies.set(one.id, { ...sent, to: 'chat' })
    const said = named(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text))
    $.ui.log(said)
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
const sayInChat = async ($: EngineInterface, text: string) => {
  $.ui.log(text)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } }).catch(err => log($, `chat not told: ${String(err)}`))
}
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
const askGone = async ($: EngineInterface, one: Todo, said?: string) => {
  if (!inChat.has(one.id)) return
  inChat.delete(one.id)
  await sayInChat($, named(said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`)))
}
// The person's answer typed in the chat, passed on by the chat to the work: once on its way the card stops asking and says what was
// answered, and a helper that asked is told too when the chat sent it to the work it helps; refused, the ask stays to be answered
const answeredInChat = async ($: EngineInterface, a: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number }, to: string, isSent: boolean) => {
  if (!isSent) return void answeredAsks.delete(a.key)
  // Words that do not settle an ask with buttons of its own leave it open, as a reply on the card does; a later answer still counts
  const isHeld = !settles(a.ask, a.words, true)
  if (isHeld) answeredAsks.delete(a.key)
  else inChat.delete(a.card.id)
  await update($, todos, all => all.map(one => (one.id === a.card.id && one.ask?.at === a.ask.at && one.ask.text === a.ask.text ? { ...one, ask: isHeld ? { ...one.ask, replied: { text: a.words, at: a.at } } : undefined } : one)))
  drafts.delete(a.card.id)
  sentReplies.set(a.card.id, { text: a.words, ask: a.ask.text, to: 'work', at: a.at, line: lineOf(a.card) })
  writtenIn(to, a.card.id)
  const helper = a.ask.from && a.ask.from !== to ? (await read($, todos)).find(one => one.id === a.ask.from && one.status === 'working') : undefined
  if (helper) await tell($, helper.id, `${who(true)} answered your ask ("${a.ask.text}") in the chat, in their own words: ${a.words}`)
  redraw($)
}
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
const replyAfter = async ($: EngineInterface, one: Todo, said: string, asked: string) => {
  const told = one.status === 'working' ? await tell($, one.id, `${who(true)} added, in their own words, to their answer to your ask ("${asked}"): ${said}`) : undefined
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
  await toEnded($, one, agentId, `${who(true)} ${isHeld ? 'replied to' : 'answered'} your ask ("${sent.ask}"), and you ended before reading it: ${sent.text}${isHeld ? `\n${named(REPLY_HOLDS)}` : ''}\n${RESUMED_BY_ANSWER}`, sent)
}
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
const sentLine = (one: Todo, now: number) => {
  const sent = sentReplies.get(one.id)
  // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
  const replied = one.ask?.replied
  if (replied && !(sent && sent.ask === one.ask?.text && (sent.text === replied.text || sent.isHeld))) return `✓ You replied “${cut(replied.text, 60)}”; it still asks this`
  if (!sent) return ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}”. That Mac could not be reached; answer it in its own chat` : ''
  const newer = lineOf(one) !== sent.line
  const isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || one.ask.replied?.text === sent.text))
  if ((one.ask && !isHeld) || (!isHeld && (newer || now - sent.at > ANSWER_SHOWN))) return ''
  const how = {
    work: 'it reads this at its next step',
    read: 'it has read it',
    chat: 'left in the chat, which carries the work on',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose work reads it at its next step`,
  }[sent.to]
  if (isHeld) return `✓ You replied “${cut(sent.text, 60)}” · ${sent.to === 'read' ? (one.status === 'working' ? 'it is acting on it' : 'it has read it') : how}; it still asks this`
  return `✓ You answered “${cut(sent.text, 60)}” · ${how}`
}
