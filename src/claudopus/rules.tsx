// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'Answer a question that a few reads settle here, with Read, Grep and Glob. For anything that changes a file, runs a command or takes more than a few reads: answer this message in one line and, in the same turn, start a fresh agent: Agent, subagent_type "claudopus:task", the model the rule names, and the task\'s instructions as the prompt, unless the chat\'s rules send it another way (a single command: a push, a fetch or a look with git or gh, an open of a file or page, a local curl status check, a preview of a local page; a small job). Only a message that changes what a listed task is already doing (a change, an answer Claude is waiting for, a stop) goes to that task with SendMessage, in their words. A fault, a question or a new request gets its own agent, even when it is about the same code or card as a running task.'
const REFUSED =
  'This chat\'s own thread only reads (Read, Grep, Glob), and runs only a single command its rules allow (a push, a fetch or a look with git or gh, an open of a file or page, a local curl status check, sent with `run_in_background: true`; a preview of a local page); it changes no file. Start a fresh agent for this, with the task\'s instructions as the prompt: the Agent tool with subagent_type "claudopus:quick" for a clearly stated job, else "claudopus:task", and the model named.'
const NO_COPY = () =>
  `Claudopus never starts a task as a copy of this chat. Start a fresh agent instead: subagent_type "claudopus:quick" for a clearly stated job, "claudopus:task" for the rest, the model named (${modelsShort(models, lean)}), and the task's instructions as the prompt.`
// A command that would print a password or key the keychain keeps (on Linux, the files bin/keyring keeps). Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b|\bkeyring['"]?\s+get\b|claudopus\/keyring\b/
const NO_READ = 'A saved key or password is never read or printed. Use it as an environment variable through the secret runner the task rules name; it hides the value in anything the command prints.'
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
      else if (c === '\\' && quote === '"' && i + 1 < command.length && '$`"\\\n'.includes(command[i + 1]!)) word = (word ?? '') + command[++i]
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
        // a flag and, for those that take one, its value: env -u NAME, -C dir, -S text, -P path; sudo -u user and the like
        while (i < words.length && words[i]!.startsWith('-')) i += (head === 'env' && /^-[uCSP]$/.test(words[i]!)) || (head === 'sudo' && /^-[ugCchpUrtD]$/.test(words[i]!)) ? 2 : 1
        while (head === 'env' && i < words.length && /^\w+=/.test(words[i]!)) if (/^RELEASE_PUSH=/.test(words[i++]!)) return true
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
// Files of the memory folder that only the mod writes: what chats share and answer one another through (live/), the update's lock
// and stamps, the reloads' marks; and the person's own settings and texts there (config.json, rules/, roles/), which work changes only
// with Edit or Write, so its card shows the change and waits for their press. A command is read as the boxes' guard reads it: a
// command that only reads counts only for what it sends into a file with >; this stops slips and common tricks, as that guard does
const MEMORY_READERS = [...BOX_READERS, 'cat', 'jq', 'diff', 'cmp', 'shasum', 'sha256sum', 'md5', 'md5sum']
const MEMORY_OWN = ['live', 'keys.md', 'keys.json', 'update.lock', 'update.json', 'update-folder.json', 'update-seen.json', 'reloads']
const MEMORY_PERSON = ['config.json', 'rules', 'roles']
const namesMemory = (text: string, names: readonly string[]) => {
  const words = BOX_WORDS(text)
  return words.some((word, i) => {
    if (!wordIs(word, '.claude') && word !== 'claude_config_dir') return false
    const j = words.slice(i + 1, i + 6).findIndex(one => wordIs(one, 'claudopus'))
    return j >= 0 && words.slice(i + 2 + j, i + 6 + j).some(one => names.some(name => wordIs(one, name)))
  })
}
const writesMemory = (text: string, names: readonly string[]): boolean => {
  const kept = shellWords(text.toLowerCase())
    .map(words => {
      const part = words.join(' ')
      if (!MEMORY_READERS.includes((words[commandAt(words)] ?? '').split('/').pop() ?? '')) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return namesMemory(kept, names) || (names === MEMORY_PERSON && /\brelease\.local\b/.test(kept))
}
const NO_MEMORY =
  "Only Claudopus writes the files chats share and answer one another through, and the update's own files: Claude never writes them with any tool."
const NO_MEMORY_BASH = () =>
  named("Claude changes {name}'s own settings and texts (config.json, the rules and roles in the memory folder, a repo's release.local) only with the Edit or Write tool, never with a command, so the change shows on the task's card and waits for {name} to press. To read one, use the Read tool, or cat or jq.")
const NO_BOXES =
  'Only the password and key runners use their boxes: Claude never writes into their folder or reads their keychain entries. Ask for a password only through the admin runner, and for a key only through the secret runner the task rules name.'
const NO_PUSH = 'Claude never pushes or merges to main itself, so two tasks never release at once: commit on your own branch and run the release runner the task rules name, from your worktree.'
// How long the names of kept keys are trusted before they are asked again
const SECRETS_MS = 60_000
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
const workHead = () => `What follows is what Claudopus tells Claude in every task started from a chat for ${person ? `${person}, the person` : 'the person'} you work for.`
const PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.'
const KEEP =
  "Keep every request the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output."
const KEEP_AGENTS = 'Keep the name or id of each background agent, with its topic and how far it has got.'
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
const PANEL_RULE =
  '{Name} follows this task in a panel beside the chat, as a card with its to-dos. Keep the card up to date as you work: with the `todo` tool (mcp__claudopus__todo), list what you set out to do, mark the one you are on, tick what is done and drop what a change of direction left behind; with the `note` tool (mcp__claudopus__note), say in one short line how far you have got whenever that changes. A message from {name} changes the to-dos first. Write these for someone who does not read code: say what each step is for, speak to {name} as "you", and use no file names, commands or code. When a step needs {name}\'s own hands or go-ahead, say so right away with the `ask` tool (mcp__claudopus__ask). If a panel tool replies that no hook answered it, the panel did not get it: continue without it for notes and to-dos, but for a question, end your turn right away with a report whose first line is the question.'
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
const AFAR_RULE =
  "## This chat runs on another Mac\n\n- I work from my own device and can't see this Mac's screen. Anything that needs my hands, I do from my own device: a sign-in by device code, or a link that works when I open it on my device. Never a browser, window, dialog or keychain prompt on this Mac, and nothing I would need to see its screen for. Give me a command only I can run in full, with its folder and full paths, so I can run it as it is in my own SSH session to this Mac; never open a terminal on this Mac for it."
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
// One line: what it is about, its answers, a command or text and its pictures are on its card (17 Nov: "Why does this huge text even
// appear in my chat?")
const ASK_IN_CHAT = (title: string, ask: NonNullable<Todo['ask']>) => `"${title}" asks you: ${oneLine(ask.text)} Answer on its card, or here.`
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  `In the background task "${title}", Claude asked {name} a question. {Name} sees it in full on the task's card, and its question alone in this chat as a Claudopus notice, which you do not see: ${ask.text} (answers: ${answers.join(' · ')}${ask.details ? `; what it is about, which {name} sees in full with it on the card: ${ask.details.length > DETAILS_IN_RELAY ? `${cut(ask.details, DETAILS_IN_RELAY)} (the rest is on the card)` : ask.details}` : ''}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} already has it: do not pass it on${ask.details ? ' and do not repeat what it is about; at most say in one line that it is on the card' : ''}, do not answer it yourself, and do not start a task for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that task with SendMessage to "${id}", in their words; its card then stops showing the question.`
// What the chat's model is told when an ask it was sent is answered on the card, or the work no longer needs it. The person, who
// answered there, is not shown it
const ASK_ANSWERED = (title: string, said: string) => `✓ {Name} answered "${title}" on its card: ${said}. Claude already has the answer from the card, so it needs no second copy.`
// What the chat is told when it sends work an answer of the person's that reached it from the card a moment ago
const ANSWER_ALREADY_SENT = (said: string) => `Not sent: "${said}" is the answer {name} gave on that task's card. Claude already has it from there and has asked nothing since, so a second copy would only start it again. If {name} means those words for something new, send them with what they are for.`
// How long an answer given on the card counts as the one the chat would send again
const ANSWER_ECHO = 60 * 60_000
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
const ASK_REPLIED = (title: string, said: string) => `✓ {Name} replied to "${title}" on its card: ${said}. Claude is working on it now, and will ask again if it still needs {name}.`
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
const REPLY_HOLDS = `That reply does not settle your question by itself: act on it. Their card shows your question with their reply under it, and nothing more to press or type while you work on it. Once it is settled, clear it with the \`ask\` tool and empty \`text\`; if it still needs them after you have done what they said, ask it again, which brings back its answers.`
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
const RESUMED_BY_ANSWER = `You had finished; this answer starts you again. Continue the task with it, then end with your report as before.`
// What the chat's model reads, and the person sees as a notice (isYou), when that work could not be started again with the answer
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string, isYou = false) =>
  isYou
    ? `You answered "${asked}" from "${title}" on its card after it was done: ${said}. Claudopus couldn't start that task again, so your answer goes with your next message here.`
    : `{Name} answered, on its card, the question Claude asked in "${title}" after it finished (${asked}): ${said}. Claudopus couldn't start that task again, so the answer waits here for {name}'s next message.`
const ANSWER_FOR_CHAT_RELAY = `With {name}'s next message here, continue that task with this answer, as you would with their own words, alongside whatever that message asks.`
const ASK_CLEARED = (title: string) => `Claude took back its question in "${title}". You don't need to answer it.`
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
const ANSWERED_IN_CHAT = (asked: string, words: string, isHeld = false, isWhole = true) =>
  `The message sent to you just now that carries {name}'s words "${words}" is {name}'s own reply, typed by them in the chat, to your question: "${asked}".${isWhole ? '' : ' Only those words are theirs: the chat wrote anything else in that message, not {name}.'} ${isHeld ? REPLY_HOLDS : 'Their card no longer shows the question.'} If it answers your question, take it as their answer and continue, and ask again if it leaves something open. If it asks for something else, decide whether it is more for this task, a new task to hand back with the \`note\` tool and its \`task\`, or a change in how you work, and say with the \`note\` tool what you did with it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER = (words: string, isWhole = true) =>
  `${theirsAre(words, isWhole)} Stop: take no other step until you have thought about it. Decide which of three it is. More for this task: add it to your to-do list. A new task of its own: do not do it; hand it back with the \`note\` tool, with its \`task\` set to the request in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the \`note\` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and continue. Call it {name}'s message, by no other name.`
// Whose a message is that carries the person's words: the whole of it theirs only when it is their words and nothing more; else only
// the words quoted are theirs, and the rest is the chat's own, which carries none of their say
const theirsAre = (words: string, isWhole: boolean) =>
  isWhole
    ? `The message sent to you just now that carries {name}'s words "${words}" is from {name}, in their own words, typed by them in the chat.`
    : `The message sent to you just now carries {name}'s words "${words}", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, and none of it is {name}'s.`
// What the work is told when it has gone on after a steer without saying what it decided
// What work that had ended is told of the person's words that started it again: whose they are, nothing more
const WOKE = (words: string, isWhole = true) =>
  isWhole
    ? `The message that started you again, carrying {name}'s words "${words}", is from {name}, in their own words, typed by them in the chat.`
    : `The message that started you again carries {name}'s words "${words}", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, not {name}.`
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string, start: string) =>
  `The message sent to you just now that begins "${start}" is from ${sender}, not from {name}: that one is not theirs. Take it as ${sender}'s and continue; a message that carries {name}'s own words stays theirs.`
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
const STRETCH = 40
// Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
const wordsOnly = (text: string) => ` ${flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `
const carries = (message: string, words: string) => {
  const m = wordsOnly(message)
  const w = wordsOnly(words)
  if (!w.trim()) return false
  if (w.length <= STRETCH) return m.includes(w)
  const starts = [0, ...[...w].flatMap((c, i) => (c === ' ' ? [i + 1] : []))].filter(i => i + STRETCH <= w.length)
  return starts.some(i => m.includes(w.slice(i, i + STRETCH)))
}
// A message that is the person's words and nothing more, word for word: at most their name before them ("Sam: …", "Sam says …")
const isTheirsWhole = (message: string, words: string) => {
  const m = wordsOnly(message)
  const w = wordsOnly(words)
  if (!w.trim() || !m.includes(w)) return false
  const rest = m.replace(w, ' ').trim()
  const name = wordsOnly(who()).trim()
  return !rest || [name, `${name} says`, `${name} said`, `${name} wrote`].includes(rest)
}
const OWED =
  'A message from {name} is waiting for your decision, and you have kept working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.'
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
const drifted = (steps: number) =>
  `You have taken ${steps} steps since you last touched your to-dos or said how far you have got. In your next step, send the to-do calls that bring the list up to date (tick what is done, mark the one you are on as doing, add what you took on) and a \`note\` saying how far you have got, together with your next working call in that same step, never in a step of their own. If all of it is already up to date, continue.`
// A count of minutes as the panel writes a time: 29m, over an hour 1h 05m
const minutesSaid = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : `${mins}m`)
// The chat is told once when nothing new has come back under a piece of work for a while
// (`isHelpersAtWork`: a helper of its still runs something, which brought nothing back meanwhile)
const STUCK_IN_CHAT = (title: string, mins: number, isHelpersAtWork = false) =>
  `Nothing new from "${title}" for ${minutesSaid(mins)}${isHelpersAtWork ? ', though its helpers are still running something' : ''}. Claude may be stuck waiting for something. Its card shows how far it got.`
// What the chat alone reads with it: it may ask the task what it waits on, as nothing of Claudopus's will
const STUCK_ASK = 'Claudopus does nothing more about it: you may send it a message asking what it waits on, and to finish with what it has if nothing is coming.'
// A task that ended its step to wait for its helpers, from which nothing new has come back: Claudopus starts it again with a nudge,
// first to ask them, then to hand back what it has. What it is told, and what the chat is told
const HELPERS_SILENT = (mins: number, helpers: string) =>
  `From Claudopus: nothing new has come back from your helpers for ${mins} min while your step had ended: ${helpers}. Ask each with SendMessage what it is doing and when it will end, and tell one that is stuck or waits on nothing to hand back what it has now. Then carry on with what needs nothing from them, or end your step.`
const HELPERS_STILL_SILENT = (mins: number, helpers: string) =>
  `From Claudopus: nothing new has come back from your helpers for ${mins} min, nor since you were asked to check on them: ${helpers}. Unless one told you it is still making progress and when it ends, hand back your report now with what you have, saying what each was still doing: Claudopus lets you hand it back while they run, and stops those that sit silent as you do.`
const GAVE_UP_IN_CHAT = (title: string, mins: number) =>
  `"${title}" is stuck: nothing new from its helpers for ${minutesSaid(mins)}, and Claude hasn't sent what it has, though Claudopus asked it to.`
const NUDGED_IN_CHAT = (title: string, mins: number, isLast: boolean) =>
  `Nothing new from the helpers of "${title}" for ${minutesSaid(mins)}. Claudopus started Claude again and asked it ${isLast ? 'to send what it has now' : 'to check on them'}.`
// A task that had stopped partway through a step without a report, restarted by Claudopus: what Claude is told, and what the chat is told
const RESTARTED_WORK = `From Claudopus, not {name}: you stopped partway through a step without a report (the app restarted, the Mac slept or a command was interrupted). First check what you already have, then continue from where you were; a command or helper you started may still be running, or may need starting again.`
// A task whose step ended with no result, no question and nothing of its own that starts it again: what Claude is told as Claudopus
// starts it again, what the chat's model is told beside Claude Code's notice that it ended, and what it is told once Claudopus gave up
const STOPPED_SHORT_GO_ON = `From Claudopus, not {name}: your step ended without your report, without a question for {name}, and with nothing of yours running that starts you again, so you were left stopped partway. Carry on from where you were: check what you already have and whether something you started still runs, then go on with your to-dos. When all is done, hand back your report with SubagentHandback; when a step needs {name}, ask with the ask tool; to wait for something, run it in the background or call wake_me, then end your step.`
// A task ending its step with to-dos still to do and nothing of its own running: what Claude is told as Claudopus keeps it going in
// the same run; and what it is told when it hands back its report with to-dos not done
const quotedItems = (items: string[]) => items.map(item => `"${item}"`).join('; ')
const KEEP_GOING = (items: string[]) =>
  `From Claudopus, not {name}: don't end here, your task isn't finished. Still to do: ${quotedItems(items)}. Nothing of yours is running that would start you again (no command in the background, no detached command started with \`echo $!\` after it, no helper at work, no wake_me, no question on your card), so if your step ends now this work stops undone. Claude Code's note that your report has not been delivered doesn't apply yet: send your report only once every to-do is ticked. Carry on now with the first of them. If you expected something you started to be running, look at its log: it may have failed or ended. To wait for something, run it in the background or detached with \`echo $!\` after it, or call wake_me for a file, a page or a time, then end your step. Tick each to-do as soon as it is done. For one only {name} can do, ask with the ask tool and end your step.`
const NOT_TICKED = (items: string[]) =>
  `Not sent: ${items.length === 1 ? 'a to-do of yours is' : `${items.length} of your to-dos are`} still to do: ${quotedItems(items)}. Do ${items.length === 1 ? 'it' : 'each'} now, or tick it done if it is done already, then hand back your report. One that only {name} can do or decide stays as it is: name it in your report under "Not done", with what {name} needs to do, and send your report again. Claudopus then shows it as not done on your card and in your result.`
const NOT_DONE_IN_CHAT = (title: string, items: string[]) =>
  `From Claudopus: the task "${title}" sent its result with ${items.length === 1 ? 'a to-do' : `${items.length} to-dos`} not done: ${quotedItems(items)}. When you pass its result on to {name}, say these are not done.`
const CARRIED_IN_CHAT = (title: string) =>
  `From Claudopus: the task "${title}" stopped partway without its report, and Claudopus started it again to carry on. Claude Code may say it ended without delivering a report: there is nothing for you to do, and nothing to tell {name}.`
const CARRY_GAVE_UP_IN_CHAT = (title: string, id: string) =>
  `From Claudopus: the task "${title}" (${id}) keeps stopping partway without its report, so Claudopus stopped starting it again, and its card says so. Tell {name} in one line only if {name} asks about it; send it a message (SendMessage to ${id}) only when {name} asks you to.`
const CARRY_LOST_IN_CHAT = (title: string, id: string) =>
  `From Claudopus: the task "${title}" (${id}) stopped partway without its report, and Claudopus could not start it again; its card says so. Tell {name} in one line only if {name} asks about it; send it a message (SendMessage to ${id}) only when {name} asks you to.`
const RESTARTED_IN_CHAT = (title: string, mins: number) =>
  `"${title}" stopped partway ${minutesSaid(mins)} ago without a result, so Claudopus started it again. Its card shows how far it got.`

// Work the person stopped with their own press on Stop: what the chat, or the work above a helper, is told, as the engine's notice
// of the stop says only that it was stopped "by Claude"; what a call that would start it again is refused with; what their next
// message carries while some is stopped so. `left` lists what it started detached that goes on running
const STOPPED_BY_YOU = (title: string, id: string, left: string[] = []) =>
  `{Name} stopped "${title}" (${id}) with Stop on its card. {Name} stopped this, not you: do not restart it, message it or start the same task again unless {name} asks.${left.length ? ` Still running, because it was started detached: ${left.join('; ')}.` : ''} Do not mention the stop unless {name} asks.`
const STOPPED_REFUSED = (title: string) =>
  `Refused by Claudopus: {name} stopped "${title}" with Stop on its card. {Name} stopped this; do not restart it, message it or start the same task again unless {name} asks for that in a new message. Do not try another way.`
const STOPPED_EARLIER = (titles: string[]) =>
  `{Name} stopped ${titles.length === 1 ? 'this' : 'these'} earlier with Stop on ${titles.length === 1 ? 'its card' : 'their cards'}: ${titles.join('; ')}. Start ${titles.length === 1 ? 'it' : 'one'} again, message it or start the same task afresh only if this message asks for that.`
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not a request: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.`
