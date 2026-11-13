// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'Answer this message in one line and start a fresh agent for it in the same turn: Agent, subagent_type "general-purpose", the model the rule names, and a brief as the prompt (their words as they said them, what it is about in two or three lines, the folder, the subject by name with its brief and any result by path, what done looks like). Only a message that steers what listed work is already doing (a change to what it builds, an answer it waits for, a stop) goes to that work instead, with SendMessage, in their words. A fault, a question or a new ask gets its own agent even when it is about the same area, code or card as running work, so it never waits behind it; when in doubt, its own agent.'
const REFUSED =
  'This chat\'s own thread does no work itself. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and a brief as the prompt.'
const NO_COPY = () =>
  `Work is never started as a copy of this chat. Start a fresh agent instead: subagent_type "general-purpose", the model named (${modelsShort(models)}), and a brief as the prompt.`
// A command that would print a password or key the keychain keeps. Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_SECRET_(?:SERVICE|ASK)\b/
const NO_READ = 'A kept key or password is never read or printed. Use it as an environment variable through the secret runner the work rules name; it hides the value from what the command prints.'
// A push or merge to main or master by hand: git's own push naming main or master, a push that skips the repo's hooks, the release
// runner's own pass given by hand, or a pull request merged on GitHub. The command is read as the shell splits it, so words inside
// quotes, a commit message's, never count
const shellWords = (command: string) => {
  const parts: string[][] = [[]]
  let word: string | undefined
  let quote = ''
  const end = () => (word !== undefined && parts[parts.length - 1]!.push(word), (word = undefined))
  for (let i = 0; i < command.length; i++) {
    const c = command[i]!
    if (quote) {
      if (c === quote) quote = ''
      else if (c === '\\' && quote === '"' && i + 1 < command.length) word += command[++i]
      else word += c
    } else if (c === "'" || c === '"') (quote = c), (word ??= '')
    else if (c === '\\' && i + 1 < command.length) word = (word ?? '') + command[++i]
    else if (/[;&|\n()`]/.test(c)) end(), parts.push([])
    else if (/\s/.test(c)) end()
    else word = (word ?? '') + c
  }
  end()
  return parts.filter(one => one.length)
}
const pushesMain = (command: string): boolean =>
  shellWords(command).some(words => {
    let i = 0
    // What runs a command it is handed: env and its settings, command, sudo, nohup, time, exec, and a shell's -c
    for (;;) {
      while (i < words.length && /^\w+=/.test(words[i]!)) if (/^RELEASE_PUSH=/.test(words[i++]!)) return true
      const head = (words[i] ?? '').split('/').pop() ?? ''
      if (['env', 'command', 'sudo', 'nohup', 'time', 'exec'].includes(head)) {
        i++
        while (i < words.length && words[i]!.startsWith('-')) i++
      } else break
    }
    const tool = (words[i] ?? '').split('/').pop()
    if ((tool === 'bash' || tool === 'sh' || tool === 'zsh') && words[i + 1] === '-c') return pushesMain(words[i + 2] ?? '')
    if (tool === 'gh') return (words[i + 1] === 'pr' && words[i + 2] === 'merge') || (words[i + 1] === 'api' && words.slice(i + 2).some(one => /\/pulls\/\d+\/merge\b/.test(one)))
    if (tool !== 'git') return false
    i++
    while (i < words.length && words[i]!.startsWith('-')) i += /^-[Cc]$/.test(words[i]!) ? 2 : 1
    if (words[i] !== 'push') return false
    const args = words.slice(i + 1)
    if (args.includes('--no-verify')) return true
    return args.filter(one => !one.startsWith('-') || one.startsWith('--repo=')).map(one => one.replace(/^--repo=.*/, 'REMOTE')).slice(args.some(one => one.startsWith('--repo=')) ? 0 : 1).some(one => /^\+?(?:[^:]*:)?(?:refs\/heads\/)?(?:main|master)$/.test(one))
  })
const NO_PUSH = 'Work never pushes or merges to main itself, so two pieces of work never release at once: commit on your own branch and run the release runner the work rules name, from your worktree.'
// How long the names of kept keys are trusted before they are asked again
const SECRETS_MS = 60_000
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
const workHead = () => `What follows is told to every piece of work started from a chat for ${person ? `${person}, the person` : 'the person'} you work for.`
const PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.'
const KEEP =
  "Keep every ask the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output."
const KEEP_AGENTS = 'Keep the name or id of each background agent with its subject and where it stands.'
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
const PANEL_RULE =
  '{Name} follows this work in a panel beside the chat, as a card with its to-dos. Keep it true as you work. With the `todo` tool (mcp__claudopus__todo), list each thing you set out to do, mark the one you are on as doing, tick it when it is done, and mark it dropped when the direction changes. With the `note` tool (mcp__claudopus__note), say in one short line where the work stands now, and say it again whenever that has changed. A message from {name} changes the to-dos first. These lines are shown to {name}, so speak to them as "you", in the first person, and write for someone who does not read code: the purpose, with no file names, commands or code. When a step needs {name}\'s own hands or go-ahead now (a code to paste, a box to fill, a key to press, an approval), say so at once with the `ask` tool (mcp__claudopus__ask): what to do in `text`, the exact text to copy in `copy`, buttons to answer with in `choices`, the full paths of any pictures it is about in `pictures`, a command for {name} to type in `command` (the card opens a terminal for it on their press, so open none yourself); clear it with empty `text` once you have seen it done.'
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
const AFAR_RULE =
  "## This chat runs on another Mac\n\n- {Name} works from their own device and cannot see this Mac's screen. Anything that needs {name}'s hands is done from their own device: a sign-in by device code or a link that works opened on their own device, never a browser, window, dialog or keychain prompt on this Mac, and nothing that needs seeing its screen."
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
const ASK_IN_CHAT = (title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  [
    `The work "${title}" needs {name}: ${ask.text}`,
    `Answers: ${answers.join(' · ')}, or a reply in {name}'s own words, here or on its card.`,
    ask.copy ? `${ask.isCommand ? 'The command to type' : 'The text to paste'}: ${ask.copy}` : '',
    ask.pictures?.length ? `Pictures: ${ask.pictures.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  `The background work "${title}" asked {name}, on its card and in this chat as a notice from the Claudopus panel that {name} sees and you do not: ${ask.text} (answers: ${answers.join(' · ')}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} has it already: do not pass it on, do not answer it yourself, and start no work for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "proactive"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that work with SendMessage to "${id}", in their words; its card then stops asking.`
// What the chat is told when an ask it was sent is answered on the card, or the work no longer needs it
const ASK_ANSWERED = (title: string, said: string) => `✓ {Name} answered the work "${title}" on its card: ${said}. It no longer asks.`
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
const RESUMED_BY_ANSWER = `You had ended; this answer starts you again. Carry the work on with it, then end with your report as before.`
// What the chat's model reads, and the person sees as a notice, when that work could not be started again with the answer
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string) => `{Name} answered on its card what the work "${title}" asked after it ended (${asked}): ${said}. That work could not be started again, so the answer waits here for {name}'s next message.`
const ANSWER_FOR_CHAT_RELAY = `With {name}'s next message here, carry that work on with this answer as you would with their own words, beside whatever that message asks.`
const ASK_CLEARED = (title: string) => `The work "${title}" no longer asks {name} anything.`
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
const ANSWERED_IN_CHAT = (asked: string) =>
  `The message sent to you just now is {name}'s reply, typed in the chat, to your ask: "${asked}". Their card no longer asks it. If it answers the ask, take it as their answer and carry on, and ask again if it leaves something waiting. If it asks for something else, it is a steer: decide whether it is more for this work, a new task to hand back with the \`note\` tool and its \`task\`, or a change in how you work, and say with the \`note\` tool what you did with it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER =
  'The message sent to you just now is from {name}, in their words, sent while you work. Stop: take no other step until you have thought about it. Decide which of three it is. More for this work: add it to your to-do list. A new task of its own: do not do it; hand it back with the `note` tool, its `task` set to the ask in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the `note` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and carry on. Call it {name}\'s message, by no other name.'
// What the work is told when it has gone on after a steer without saying what it decided
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string) =>
  `The message sent to you just now is from ${sender}, not from {name}: it is not theirs. Take it as ${sender}'s and carry on.`
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
const STRETCH = 40
const carries = (message: string, words: string) => {
  // Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
  const plain = (text: string) => ` ${flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `
  const m = plain(message)
  const w = plain(words)
  if (!w.trim()) return false
  if (w.length <= STRETCH) return m.includes(w)
  const starts = [0, ...[...w].flatMap((c, i) => (c === ' ' ? [i + 1] : []))].filter(i => i + STRETCH <= w.length)
  return starts.some(i => m.includes(w.slice(i, i + STRETCH)))
}
const OWED =
  'A message from {name} is waiting for your decision, and you have gone on working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.'
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
const drifted = (steps: number) =>
  `You have taken ${steps} steps since you last touched your to-dos or said where the work stands. Look at your to-do list now: tick what is done, mark the one you are on as doing, add what you took on, and say where the work stands with the \`note\` tool. If all of it is already true, carry on.`
// The chat is told once when nothing new has come back under a piece of work for a while
const STUCK_IN_CHAT = (title: string, mins: number) =>
  `"${title}" has had nothing new come back to it or its helpers for ${mins} minutes: it may be stuck waiting on something that will not come. Its card says what is running.`
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not an ask: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.`
