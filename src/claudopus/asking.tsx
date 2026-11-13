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
// step; to work that has ended, a message to the chat, which carries the work on. Either way the ask goes at once, and the card
// says briefly what was answered; the work turns amber again only by asking again
const replies = new Map<string, number>()
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
type Sent = { text: string; ask: string; to: 'work' | 'read' | 'chat' | 'other' | 'lost'; at: number; line?: string }
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
const lineOf = (one: Todo) => { const last = [...one.entries].reverse().find(entry => entry.kind !== 'steer'); return last ? `${last.at}:${last.text}` : '' }
// How long the card says what was answered, unless the work writes a newer line first
const ANSWER_SHOWN = 60_000
// The answers every ask offers when the work gave none of its own
const DEFAULT_ANSWERS = ['Done', 'Not now']
const sentReplies = new Map<string, Sent>()
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
const pending = new Map<string, string>()
// The asks of this chat's work already answered, by work and when it asked
const answeredAsks = new Set<string>()
const answerAsk = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  if (one.chat) return answerElsewhere($, one, choice, isReply)
  const ask = one.ask
  const said = choice.trim()
  if (!ask || !said) return
  const target = ask.from ?? one.id
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
  sentReplies.set(one.id, { text: said, ask: ask.text, to: one.status === 'working' ? 'work' : 'chat', at, line })
  redraw($)
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your ask ("${ask.text}"), in their own words: ${said}` : `${who(true)} pressed "${said}" in answer to your ask: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (pending.set(target, one.id), sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line }), redraw($))
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'chat', at, line })
  redraw($)
  await sendForPerson($, isReply ? `From the Claudopus panel: ${who(true)} replied to what the work "${titleOf(one)}" asked before it ended (${ask.text}):\n${said}` : `From the Claudopus panel: ${who(true)} pressed "${said}" in answer to what the work "${titleOf(one)}" asked before it ended: ${ask.text}`)
}
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
const replyAfter = async ($: EngineInterface, one: Todo, said: string, asked: string) => {
  const told = one.status === 'working' ? await tell($, one.id, `${who(true)} added, in their own words, to their answer to your ask ("${asked}"): ${said}`) : undefined
  if (told && !told.deny) return
  await sendForPerson($, `From the Claudopus panel: ${who(true)} added, in their own words, to their answer to what the work "${titleOf(one)}" asked (${asked}):\n${said}`)
}
// The work an answer was written into starts its next step: that step reads it
const replyRead = ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  if (sent?.to === 'work') (sentReplies.set(card, { ...sent, to: 'read' }), redraw($))
}
// Work whose run ended with an answer written in but never read leaves it to the chat, which carries the work on
const replyUnread = async ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  const one = (await read($, todos)).find(todo => todo.id === card)
  if (sent?.to !== 'work' || !one) return
  sentReplies.set(card, { ...sent, to: 'chat' })
  redraw($)
  await sendForPerson($, `From the Claudopus panel: ${who(true)} answered what the work "${titleOf(one)}" asked, and it ended before reading the answer (${sent.ask}):\n${sent.text}`)
}
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
const sentLine = (one: Todo, now: number) => {
  const sent = sentReplies.get(one.id)
  if (!sent) return ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}”. That Mac could not be reached; answer it in its own chat` : ''
  const newer = lineOf(one) !== sent.line
  if (one.ask || newer || now - sent.at > ANSWER_SHOWN) return ''
  const how = {
    work: 'it reads this at its next step',
    read: 'it has read it',
    chat: 'sent to the chat, which carries the work on',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose work reads it at its next step`,
  }[sent.to]
  return `✓ You answered “${cut(sent.text, 60)}” · ${how}`
}
