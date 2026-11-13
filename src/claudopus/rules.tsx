// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'A question answered by reading a few files is answered directly: read them yourself with Read, Grep and Glob. Anything that changes a file, runs a command or takes more than a few reads goes to an agent: answer this message in one line and start a fresh agent for it in the same turn: Agent, subagent_type "general-purpose", the model the rule names, and a brief as the prompt (their words as they said them, what it is about in two or three lines, the folder, the subject by name with its brief and any result by path, what done looks like). Only a message that steers what listed work is already doing (a change to what it builds, an answer it waits for, a stop) goes to that work instead, with SendMessage, in their words. A fault, a question or a new ask gets its own agent even when it is about the same area, code or card as running work, so it never waits behind it; when in doubt, its own agent. A question a few reads answer is still answered directly.'
const REFUSED =
  'This chat\'s own thread only reads (Read, Grep, Glob); it changes no file and runs no command. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and a brief as the prompt.'
const NO_COPY = () =>
  `Work is never started as a copy of this chat. Start a fresh agent instead: subagent_type "general-purpose", the model named (${modelsShort(models)}), and a brief as the prompt.`
// A command that would print a password or key the keychain keeps. Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b/
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
      else if (c === '\\' && quote === '"' && i + 1 < command.length && '$`"\\\n'.includes(command[i + 1]!)) word += command[++i]
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
// The boxes of the password and key runners are theirs alone: work never writes into their folder, ~/.claude/claudopus/boxes, nor
// reads their keychain service, claudopus-box. A command is read as the shell splits it, in small letters (this Mac's files take any),
// with each simple {a,b} tried each way, then as words split at any sign a path or a program joins words with; a word counts when it
// is the name itself or a pattern (*, ?, [...]) that matches it, and a lone * matches nothing, so a folder listed whole is not taken
// for the boxes. The folder is .claude (or the setting that moves it) followed by claudopus (a cd between them aside), then boxes; the
// service is claudopus-box with security (or a program's keychain library). A command that only reads and writes nothing (a search, a
// listing, git and gh, which a commit message naming the folder runs through) counts only for what it sends into a file with >.
// Setting the runners' own folder by hand counts too. This stops slips and common tricks: a name pieced together as the command runs,
// a link made to the folder, or a script run some other way gets past it, so it is no wall
const BOX_READERS = ['rg', 'grep', 'egrep', 'fgrep', 'ls', 'du', 'git', 'gh', 'wc', 'head', 'tail', 'less', 'file', 'stat', 'tree']
const BOX_WRAPPERS = ['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'nice', 'timeout', 'xargs', 'caffeinate']
// Where a command's own words start, past settings and what runs a command it is handed
const commandAt = (words: string[]) => {
  let i = 0
  for (;;) {
    while (i < words.length && /^\w+=/.test(words[i]!)) i++
    const head = (words[i] ?? '').split('/').pop() ?? ''
    if (!BOX_WRAPPERS.includes(head)) return i
    i++
    // its own flags and numbers (nice's -n 5, timeout's duration), and the value sudo's -u and the like take
    while (i < words.length && (words[i]!.startsWith('-') || /^\d[\d.]*[smhd]?$/.test(words[i]!))) i += head === 'sudo' && /^-[ugCchpUrt]$/.test(words[i]!) ? 2 : 1
  }
}
const BOX_WORDS = (text: string) => text.replace(/["'\\`]/g, '').split(/[^a-z0-9._*?[\]-]+/).filter(Boolean)
const wordIs = (word: string, name: string) => {
  // A list's brackets around a word, as a program's code writes it, are not part of it
  const bare = word.replace(/^\[+(?=[^\]]*$)/, '').replace(/(?<=^[^[]*)\]+$/, '')
  if (word === name || bare === name) return true
  if (!/[*?[]/.test(bare) || /^[*?]+$/.test(bare)) return false
  try {
    return new RegExp(`^${bare.replace(/[.+^${}()|\\-]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/\[!/g, '[^')}$`).test(name)
  } catch {
    return false
  }
}
const namesBoxes = (text: string): boolean => {
  const words = BOX_WORDS(text)
  const has = (name: string) => words.some(word => wordIs(word, name))
  const isFolder = words.some((word, i) => {
    if (!wordIs(word, '.claude') && word !== 'claude_config_dir') return false
    // claudopus within a few words after it (a cd, or a command started there, between them), then boxes
    const j = words.slice(i + 1, i + 6).findIndex(one => wordIs(one, 'claudopus'))
    return j >= 0 && words.slice(i + 2 + j).some(one => wordIs(one, 'boxes'))
  })
  return isFolder || (has('claudopus-box') && (has('security') || has('keyring') || has('ksecattrservice')))
}
const touchesBoxes = (text: string): boolean => {
  if (/\bCLAUDOPUS_BOX(?:ES|_TAKEN)\b/.test(text)) return true
  const kept = shellWords(text.toLowerCase())
    .map(words => {
      const part = words.join(' ')
      if (!BOX_READERS.includes((words[commandAt(words)] ?? '').split('/').pop() ?? '')) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return [0, 1, 2, 3].some(k => namesBoxes(k ? kept.replace(/\{([^{}]*,[^{}]*)\}/g, (_, alts: string) => alts.split(',')[k - 1] ?? '') : kept))
}
// A file a command runs, against the folder it runs in (a cd in it moves that): the first word of each of its commands when it is a
// path, what a shell, source or another language's program is handed to run or reads on its stdin, and a file cat pipes into a
// shell. The system's own programs are not read
const RUNNERS = ['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish', 'source', '.', 'python', 'python3', 'node', 'bun', 'deno', 'perl', 'ruby', 'php', 'osascript', 'swift', 'tsx', 'ts-node']
const filesRun = (command: string, home: string, from: string): string[] => {
  let folder = from
  const found: string[] = []
  const parts = shellWords(command)
  parts.forEach((words, n) => {
    const i = commandAt(words)
    const head = words[i] ?? ''
    const name = head.split('/').pop() ?? ''
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) return void (folder = pathOf(words[i + 1]!, home, folder))
    const take = (path: string) => found.push(pathOf(path, home, folder))
    if (RUNNERS.includes(name) || /^python3(?:\.\d+)?$/.test(name)) {
      const rest = words.slice(i + 1).filter(word => word !== 'run')
      const fed = rest.findIndex(word => word.startsWith('<'))
      if (fed >= 0) take(rest[fed] === '<' ? (rest[fed + 1] ?? '') : rest[fed]!.slice(1))
      const at = rest.findIndex(word => !word.startsWith('-') && !word.startsWith('<'))
      // A program handed its code inline (-c, -e) is read as part of the command already
      if (at >= 0 && !rest.slice(0, at).some(flag => /^-[cem]$/.test(flag))) take(rest[at]!)
      // a shell's -c is a command of its own, whose files are looked for the same way
      if (['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish'].includes(name) && at >= 0 && rest[at - 1] === '-c') found.push(...filesRun(rest[at]!, home, folder))
      // Nothing to run named: what it reads is what the command before it gives, such as a file cat prints
      const before = parts[n - 1] ?? []
      if (at < 0 && fed < 0 && (before[commandAt(before)] ?? '').split('/').pop() === 'cat') for (const one of before.slice(commandAt(before) + 1)) if (!one.startsWith('-')) take(one)
      return
    }
    if (head.includes('/') && !/^\/(?:usr|bin|sbin|System|Library\/Apple)\//.test(head)) take(head)
  })
  return found
}
// A path as written, with ~ and $HOME read and . and .. taken out, against the folder given
const pathOf = (path: string, home: string, folder: string) => {
  const full = path.replace(/^(?:~|\$HOME|\$\{HOME\})(?=\/|$)/, home)
  const parts: string[] = []
  for (const part of (full.startsWith('/') ? full : `${folder}/${full}`).split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return `/${parts.join('/')}`
}
const NO_BOXES =
  'The boxes of the password and key runners are theirs alone: work never writes into their folder or reads their keychain entries. Ask for a password only through the admin runner and for a key only through the secret runner the work rules name.'
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
  '{Name} follows this work in a panel beside the chat, as a card with its to-dos. Keep it true as you work. With the `todo` tool (mcp__claudopus__todo), list each thing you set out to do, mark the one you are on as doing, tick it when it is done, and mark it dropped when the direction changes. With the `note` tool (mcp__claudopus__note), say in one short line where the work stands now, and say it again whenever that has changed. A message from {name} changes the to-dos first. These lines are shown to {name}, so speak to them as "you", in the first person, and write for someone who does not read code: the purpose, with no file names, commands or code. When a step needs {name}\'s own hands or go-ahead now (a code to paste, a box to fill, a key to press, an approval), say so at once with the `ask` tool (mcp__claudopus__ask): what to do in `text`, what it is about in full in `details` (an ask reaches {name} before your report does, so it carries its own explanation and never points at one), the exact text to copy in `copy`, buttons to answer with in `choices`, the full paths of any pictures it is about in `pictures`, a command only {name} can run, never one you can run yourself, in `command` with its folder in `cwd` (open no terminal for it yourself); clear it with empty `text` once you have seen it done. If a panel tool answers that no hook answered it, the panel did not get it: carry on without the panel for notes and to-dos, but for an ask end your turn at once with a report whose first line is the ask, so the chat puts it to {name}.'
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
const AFAR_RULE =
  "## This chat runs on another Mac\n\n- I work from my own device and cannot see this Mac's screen. Anything that needs my hands is done from my own device: a sign-in by device code or a link that works opened on my device, never a browser, window, dialog or keychain prompt on this Mac, and nothing that needs seeing its screen. A command only I can run is given whole, with its folder and full paths, to run as it is in my own SSH session to this Mac; nothing opens a terminal on this Mac for it."
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
const ASK_IN_CHAT = (title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  [
    `The work "${title}" needs {name}: ${ask.text}`,
    // The chat's notice is plain text: Markdown's marks for bold would show as they are
    ask.details ? `What it is about:\n${ask.details.replaceAll('**', '')}` : '',
    `Answers: ${answers.join(' · ')}, or a reply in {name}'s own words, here or on its card.`,
    ask.copy ? `${ask.isCommand ? 'The command to type' : 'The text to paste'}: ${ask.copy}` : '',
    ask.pictures?.length ? `Pictures: ${ask.pictures.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  `The background work "${title}" asked {name}, on its card and in this chat as a notice from the Claudopus panel that {name} sees and you do not: ${ask.text} (answers: ${answers.join(' · ')}${ask.details ? `; what it is about, shown to {name} whole with it on the card and in the notice: ${ask.details.length > DETAILS_IN_RELAY ? `${cut(ask.details, DETAILS_IN_RELAY)} (the rest is on the card)` : ask.details}` : ''}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} has it already: do not pass it on${ask.details ? ' and do not repeat what it is about; at most say in one line that it is on the card' : ''}, do not answer it yourself, and start no work for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that work with SendMessage to "${id}", in their words; its card then stops asking.`
// What the chat is told when an ask it was sent is answered on the card, or the work no longer needs it
const ASK_ANSWERED = (title: string, said: string) => `✓ {Name} answered the work "${title}" on its card: ${said}. It no longer asks.`
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
const ASK_REPLIED = (title: string, said: string) => `✓ {Name} replied to the work "${title}" on its card: ${said}. It still asks, while it acts on that.`
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
const REPLY_HOLDS = `That reply does not settle your ask, so it stays open on {name}'s card while you act on it. Once it is settled, clear it with the \`ask\` tool and empty \`text\`; if it still waits after you have done what they said, ask it again.`
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
const RESUMED_BY_ANSWER = `You had ended; this answer starts you again. Carry the work on with it, then end with your report as before.`
// What the chat's model reads, and the person sees as a notice, when that work could not be started again with the answer
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string) => `{Name} answered on its card what the work "${title}" asked after it ended (${asked}): ${said}. That work could not be started again, so the answer waits here for {name}'s next message.`
const ANSWER_FOR_CHAT_RELAY = `With {name}'s next message here, carry that work on with this answer as you would with their own words, beside whatever that message asks.`
const ASK_CLEARED = (title: string) => `The work "${title}" no longer asks {name} anything.`
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
const ANSWERED_IN_CHAT = (asked: string, words: string, isHeld = false) =>
  `The message sent to you just now that carries {name}'s words "${words}" is {name}'s own reply, typed by them in the chat, to your ask: "${asked}". ${isHeld ? REPLY_HOLDS : 'Their card no longer asks it.'} If it answers the ask, take it as their answer and carry on, and ask again if it leaves something waiting. If it asks for something else, it is a steer: decide whether it is more for this work, a new task to hand back with the \`note\` tool and its \`task\`, or a change in how you work, and say with the \`note\` tool what you did with it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER = (words: string) =>
  `The message sent to you just now that carries {name}'s words "${words}" is from {name}, in their own words, typed by them in the chat. Stop: take no other step until you have thought about it. Decide which of three it is. More for this work: add it to your to-do list. A new task of its own: do not do it; hand it back with the \`note\` tool, its \`task\` set to the ask in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the \`note\` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and carry on. Call it {name}'s message, by no other name.`
// What the work is told when it has gone on after a steer without saying what it decided
// What work that had ended is told of the person's words that started it again: whose they are, nothing more
const WOKE = (words: string) => `The message that started you again, carrying {name}'s words "${words}", is from {name}, in their own words, typed by them in the chat.`
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string, start: string) =>
  `The message sent to you just now that begins "${start}" is from ${sender}, not from {name}: that one is not theirs. Take it as ${sender}'s and carry on; a message that carries {name}'s own words stays theirs.`
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
  `"${title}" has had nothing new come back to it or its helpers for ${mins} minutes: it may be stuck waiting on something that will not come. Its card shows where it stands.`
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not an ask: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.`
