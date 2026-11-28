// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

const NO_COPY = () =>
  `Claudopus never starts a task as a copy of this chat. Start a fresh agent instead: subagent_type "claudopus:quick" for a clearly stated job, "claudopus:task" for the rest, the model named (${modelsShort(models, lean)}), and the task's instructions as the prompt.`
// A command that would print a password or key the keychain keeps (on Linux, the files bin/keyring keeps). Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b|\bkeyring['"]?\s+get\b|claudopus[\\/]keyring\b/
// On Windows also what reads the system's own saved passwords: its Credential Manager (cmdkey, vaultcmd, PowerShell's
// Get-StoredCredential, CredRead, the PasswordVault) and what opens a value Windows locked to this user (ProtectedData)
const KEYCHAIN_READ_WINDOWS = /\bcmdkey(?:\.exe)?\s+\/+list\b|\bvaultcmd\b|\bGet-StoredCredential\b|\bCredRead\w*|\bPasswordVault\b|\bProtectedData\b/i
const isKeychainRead = (text: string) => KEYCHAIN_READ.test(text) || (isWindows && KEYCHAIN_READ_WINDOWS.test(text))
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
      const head = progName(words[i] ?? '')
      if (['env', 'command', 'sudo', 'nohup', 'time', 'exec'].includes(head)) {
        i++
        // a flag and, for those that take one, its value: env -u NAME, -C dir, -S text, -P path; sudo -u user and the like
        while (i < words.length && words[i]!.startsWith('-')) i += (head === 'env' && /^-[uCSP]$/.test(words[i]!)) || (head === 'sudo' && /^-[ugCchpUrtD]$/.test(words[i]!)) ? 2 : 1
        while (head === 'env' && i < words.length && /^\w+=/.test(words[i]!)) if (/^RELEASE_PUSH=/.test(words[i++]!)) return true
      } else break
    }
    const tool = progName(words[i] ?? '')
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
// What a command would change in the code chats run: a git command that moves what is checked out or changes its files (checkout,
// switch, restore, reset, rebase, bisect, stash, merge, pull, cherry-pick, revert, am, apply, clean, commit, rm, mv, update-ref,
// symbolic-ref setting HEAD, and a branch renamed, forced, copied over or deleted), with the folder it runs in: git's -C, then its
// --work-tree or else its --git-dir, else env's -C or --chdir, else the last
// cd or pushd before it (a bare cd is home, $HOME and ~ are home, cd - the folder before), else where the command starts. Left
// out, as they only read or are how the folder gets back on track: going back to main (`git checkout main`, `git switch main`), a
// fast-forward to main online (`merge --ff-only` with no name, origin/main or @{u}, `pull --ff-only` with no name or `<remote>
// main`), an --abort or --quit, a bare bisect reset, bisect's log and view, a stash's list and show, apply's --check and --stat, clean's dry run.
// Redirections are no names. This stops slips, not someone set on it: names in variables, quotes round a redirection's sign and
// a script it runs get past it. On 18 Nov a helper's `git checkout -q --detach origin/main` in Claudopus's own checkout left every chat on
// that commit, and Update called it a test copy
const CHANGING_GIT = ['checkout', 'switch', 'restore', 'reset', 'rebase', 'bisect', 'stash', 'merge', 'pull', 'cherry-pick', 'revert', 'am', 'apply', 'clean', 'commit', 'update-ref', 'branch', 'rm', 'mv', 'symbolic-ref']
const changesOf = (command: string, start: string, home: string): string[] => {
  const at = (here: string, path: string) => pathOf(path, home, here)
  let here = start
  let before = start
  // A copy of one output onto another (2>&1, >&2) is taken out first, and &> made a plain >, as the shell splits at their &
  return shellWords(command.replace(/\d*>&(\d+|-)/g, ' ').replace(/&>>?/g, ' >')).flatMap((all): string[] => {
    // A redirection and the file it names are no words of the command, written apart or joined to a word (main>/dev/null)
    const words = all
      .filter((one, k) => !/^\d*[<>]\S*$/.test(one) && !/^\d*[<>]+$/.test(all[k - 1] ?? 'x'))
      // (a word with a space is a quoted whole, such as the command a shell's -c runs, and is kept as it is)
      .map(one => (/\s/.test(one) ? one : one.replace(/\d*[<>].*$/, '')))
      .filter(Boolean)
    let i = commandAt(words)
    // env -C <folder> or --chdir=<folder>: commandAt stops at -C's folder, as it takes no value for env's flags
    const isEnv = words.slice(0, i).some(one => progName(one) === 'env')
    let envFolder = isEnv ? words.slice(0, i).find(one => one.startsWith('--chdir='))?.slice(8) : undefined
    if (isEnv && (words[i - 1] === '-C' || words[i - 1] === '--chdir')) (envFolder = words[i]), (i += 1 + commandAt(words.slice(i + 1)))
    const tool = progName(words[i] ?? '')
    if (tool === 'cd' || tool === 'pushd') {
      const to = words.slice(i + 1).find(one => !one.startsWith('-') || one === '-')
      const next = to === undefined ? home : to === '-' ? before : at(here, to)
      ;(before = here), (here = next)
      return []
    }
    if (tool === 'bash' || tool === 'sh' || tool === 'zsh') {
      // Its flags, -o and +o taking a value, up to the one with c: the next word is the command it runs
      for (let k = i + 1; k < words.length && /^[-+]/.test(words[k]!); k += /^[-+]o$/.test(words[k]!) ? 2 : 1)
        if (/^-[a-z]*c[a-z]*$/.test(words[k]!)) return changesOf(words[k + 1] ?? '', here, home)
      return []
    }
    if (tool !== 'git') return []
    let folder = envFolder ? at(here, envFolder) : here
    let j = i + 1
    // git's own options, those that take a value written apart taking the next word; a work tree, else a git folder, names the folder
    let tree = ''
    let gitDir = ''
    while (j < words.length && words[j]!.startsWith('-')) {
      const [opt = '', value] = words[j]!.startsWith('--') && words[j]!.includes('=') ? [words[j]!.slice(0, words[j]!.indexOf('=')), words[j]!.slice(words[j]!.indexOf('=') + 1)] : [words[j]!, undefined]
      const isApart = value === undefined && /^(-[Cc]|--(git-dir|work-tree|namespace|super-prefix|exec-path|config-env|attr-source|list-cmds))$/.test(opt) && !(opt === '--exec-path' && !words[j + 1])
      const given = value ?? (isApart ? words[j + 1] ?? '' : '')
      if (opt === '-C' && given) folder = at(folder, given)
      if (opt === '--work-tree' && given) tree = at(folder, given)
      if (opt === '--git-dir' && given) gitDir = at(folder, given)
      j += isApart ? 2 : 1
    }
    if (tree) folder = tree
    else if (gitDir) folder = gitDir.replace(/\/\.git$/, '')
    const sub = words[j] ?? ''
    if (!CHANGING_GIT.includes(sub)) return []
    const args = words.slice(j + 1)
    const names = args.filter(one => !one.startsWith('-'))
    const flags = args.filter(one => one.startsWith('-'))
    const has = (...some: string[]) => flags.some(one => some.includes(one))
    if (has('-h', '--help', '--abort', '--quit')) return []
    if ((sub === 'checkout' || sub === 'switch') && names.length === 1 && names[0] === 'main' && flags.every(one => one === '-q' || one === '--quiet')) return []
    if (sub === 'merge' && has('--ff-only') && (names.length === 0 || (names.length === 1 && /^(origin\/main|@\{u(pstream)?\})$/.test(names[0]!)))) return []
    if (sub === 'pull' && has('--ff-only') && (names.length === 0 || (names.length === 2 && /^[\w-]+$/.test(names[0]!) && names[1] === 'main'))) return []
    if (sub === 'bisect' && (['log', 'view', 'visualize'].includes(names[0] ?? '') || (names[0] === 'reset' && names.length === 1))) return []
    if (sub === 'stash' && ['list', 'show'].includes(names[0] ?? '')) return []
    if (sub === 'apply' && has('--check', '--stat', '--numstat', '--summary') && !has('--apply', '--index', '--cached')) return []
    // Short flags written together count each (-fdn is -f, -d and -n)
    const hasShort = (letters: RegExp) => flags.some(one => /^-[a-zA-Z]+$/.test(one) && letters.test(one.slice(1)))
    if (sub === 'clean' && (has('--dry-run') || hasShort(/n/))) return []
    if (sub === 'branch' && !hasShort(/[mMfdDC]/) && !has('--move', '--force', '--delete', '--copy')) return []
    if (sub === 'symbolic-ref' && names.length < 2 && !has('-d', '--delete')) return []
    return [folder]
  })
}
const NO_SWITCH = (folder: string) =>
  named(`Not run: ${folder} holds the Claudopus code {name}'s chats run, so Claude never changes what is checked out there. No checkout, switch, reset, merge or commit runs in it, except going back to main and a fast-forward to main online. To read another version, use git show <commit>:<path>. To change the code, make a worktree of your own.`)
const NO_EDIT_OWN = (folder: string) =>
  named(`Not changed: ${folder} holds the Claudopus code {name}'s chats run, and a change there reaches every chat as it next loads, finished or not. Make a worktree of your own and change the file there.`)
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
    const head = progName(words[i] ?? '')
    if (!BOX_WRAPPERS.includes(head)) return i
    i++
    // its own flags and numbers (nice's -n 5, timeout's duration), and the value sudo's -u and the like take
    while (i < words.length && (words[i]!.startsWith('-') || /^\d[\d.]*[smhd]?$/.test(words[i]!))) i += head === 'sudo' && /^-[ugCchpUrt]$/.test(words[i]!) ? 2 : 1
  }
}
// (on Windows a backslash parts a path's names, as C:\Users\x\.claude is written, rather than being taken out with the quotes)
const BOX_WORDS = (text: string) => (isWindows ? text.replace(/\\/g, '/') : text).replace(/["'\\`]/g, '').split(/[^a-z0-9._*?[\]-]+/).filter(Boolean)
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
      if (!BOX_READERS.includes(progName(words[commandAt(words)] ?? ''))) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return [0, 1, 2, 3].some(k => namesBoxes(k ? kept.replace(/\{([^{}]*,[^{}]*)\}/g, (_, alts: string) => alts.split(',')[k - 1] ?? '') : kept))
}
// A file a command runs, against the folder it runs in (a cd in it moves that): the first word of each of its commands when it is a
// path, what a shell, source or another language's program is handed to run or reads on its stdin, and a file cat pipes into a
// shell. The system's own programs are not read
const RUNNERS = ['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish', 'source', '.', 'python', 'python3', 'node', 'bun', 'deno', 'perl', 'ruby', 'php', 'osascript', 'swift', 'tsx', 'ts-node']
// and on Windows its own: PowerShell's -File, cmd's /c (written //c in Git's bash), Windows Script Host's script, Python's launcher
const WINDOWS_RUNNERS = ['powershell', 'pwsh', 'cmd', 'wscript', 'cscript', 'py']
const filesRun = (command: string, home: string, from: string): string[] => {
  let folder = from
  const found: string[] = []
  const parts = shellWords(command)
  parts.forEach((words, n) => {
    const i = commandAt(words)
    const head = words[i] ?? ''
    const name = progName(head)
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) return void (folder = pathOf(words[i + 1]!, home, folder))
    const take = (path: string) => found.push(pathOf(path, home, folder))
    if (isWindows && WINDOWS_RUNNERS.includes(name)) {
      const rest = words.slice(i + 1)
      if (name === 'cmd') {
        const c = rest.findIndex(word => /^\/\/?[ck]$/i.test(word))
        if (c >= 0) found.push(...filesRun(rest.slice(c + 1).join(' '), home, folder))
      } else if (name === 'powershell' || name === 'pwsh') {
        const f = rest.findIndex(word => /^-(?:f|file)$/i.test(word))
        if (f >= 0 && rest[f + 1]) take(rest[f + 1]!)
      } else {
        const at = rest.findIndex(word => !word.startsWith('-') && !word.startsWith('//'))
        if (at >= 0) take(rest[at]!)
      }
      return
    }
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
      if (at < 0 && fed < 0 && progName(before[commandAt(before)] ?? '') === 'cat') for (const one of before.slice(commandAt(before) + 1)) if (!one.startsWith('-')) take(one)
      return
    }
    // (on Windows a path by either separator, and Windows' own folder is the system's too)
    const isSystem = /^\/(?:usr|bin|sbin|System|Library\/Apple)\//.test(head) || (isWindows && /^[A-Z]:\/Windows\//i.test(pathOf(head, home, folder)))
    if ((head.includes('/') || (isWindows && head.includes('\\'))) && !isSystem) take(head)
  })
  return found
}
// A path as written, with ~ and $HOME read and . and .. taken out, against the folder given. On Windows the profile's own names are
// home too ($USERPROFILE, %USERPROFILE%, PowerShell's $env:USERPROFILE), and the path is Windows' own (windowsPath): C:/Users/x
// whether written C:\Users\x or /c/Users/x as Git's bash names it, its drive kept
const HOME_WORD = /^(?:~|\$HOME|\$\{HOME\})(?=\/|$)/
const WINDOWS_HOME_WORD = /^(?:~|\$HOME|\$\{HOME\}|\$USERPROFILE|\$\{USERPROFILE\}|%USERPROFILE%|\$env:USERPROFILE)(?=[\\/]|$)/i
const windowsPath = (path: string) => {
  const forward = path.replace(/\\/g, '/')
  const m = /^(?:([A-Za-z]):|\/([A-Za-z]))(?=\/|$)(.*)$/.exec(forward)
  return m ? `${(m[1] ?? m[2] ?? '').toUpperCase()}:${m[3] || '/'}` : forward
}
const pathOf = (path: string, home: string, folder: string) => {
  const full = isWindows ? windowsPath(path.replace(WINDOWS_HOME_WORD, home)) : path.replace(HOME_WORD, home)
  const whole = isWindows ? (isAbsPath(full) ? full : `${windowsPath(folder)}/${full}`) : full.startsWith('/') ? full : `${folder}/${full}`
  const drive = isWindows ? (/^[A-Z]:/.exec(whole)?.[0] ?? '') : ''
  const parts: string[] = []
  for (const part of whole.slice(drive.length).split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return `${drive}/${parts.join('/')}`
}
// A program's name as a command names it: the last part of its path; on Windows by either separator, in small letters (BASH.EXE is
// bash there) and without .exe
const progName = (word: string) => (isWindows ? (word.split(/[\\/]/).pop() ?? '').toLowerCase().replace(/\.exe$/, '') : (word.split('/').pop() ?? ''))
// A runner's path as a command is told it: in double quotes where it holds a space, as a profile on Windows often does
const runnerAt = (root: string, name: string) => (/\s/.test(root) ? `"${root}/bin/${name}"` : `${root}/bin/${name}`)
// Files of the memory folder that only the mod writes: what chats share and answer one another through (live/), every task's ledger
// and the instructions a task carrying one on is given (ledger/), the update's lock
// and stamps, the reloads' marks; and the person's own settings and texts there (config.json, rules/, roles/), which work changes only
// with Edit or Write, so its card shows the change and waits for their press. A command is read as the boxes' guard reads it: a
// command that only reads counts only for what it sends into a file with >; this stops slips and common tricks, as that guard does
const MEMORY_READERS = [...BOX_READERS, 'cat', 'jq', 'diff', 'cmp', 'shasum', 'sha256sum', 'md5', 'md5sum']
const MEMORY_OWN = ['live', 'ledger', 'keys.md', 'keys.json', 'update.lock', 'update.json', 'update-folder.json', 'update-seen.json', 'reloads']
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
      if (!MEMORY_READERS.includes(progName(words[commandAt(words)] ?? ''))) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return namesMemory(kept, names) || (names === MEMORY_PERSON && /\brelease\.local\b/.test(kept))
}
const NO_MEMORY_BASH = () =>
  named("Claude changes {name}'s own settings and texts (config.json, the rules and roles in the memory folder, a repo's release.local) only with the Edit or Write tool, never with a command, so the change shows on the task's card and waits for {name} to press. To read one, use the Read tool, or cat or jq.")
// How long the names of kept keys are trusted before they are asked again
const SECRETS_MS = 60_000
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
const workHead = () => `What follows is what Claudopus tells Claude in every task started from a chat for ${person ? `${person}, the person` : 'the person'} you work for.`
// Where a chat's words are: the person's own messages on their own, and the whole conversation, too long to read whole
const WORDS_LINE = (id: string) => `${who(true)}'s own messages in the chat, word for word, the newest last: ${dir}/words/${id}.said.md. The chat's saved words, Claude's replies too, too long to read whole (search them): ${dir}/words/${id}.md`
// What the chat's model is told when its work asks the person something: the ask, its answers and pictures, with how to pass an
// answer on, in a row of its own that starts no turn. The person sees it on the card, and nothing of it in the chat (17 Nov: a
// notice line in the chat for every ask was among "these fucking shits within the chat")
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[], others: string[] = []) =>
  `In the background task "${title}", Claude asked {name} a question.${others.length ? ` Its card also still shows ${others.length === 1 ? 'an earlier question' : `${others.length} other questions`}, each answered on its own: ${others.map(one => `"${cut(one, 160)}"`).join(', ')}.` : ''} {Name} sees it in full on the task's card, and nothing of it in this chat: ${ask.text} (${answers.length ? `buttons: ${answers.join(' · ')}` : 'answered in words'}${ask.details ? `; what it is about, which {name} sees in full with it on the card: ${ask.details.length > DETAILS_IN_RELAY ? `${cut(ask.details, DETAILS_IN_RELAY)} (the rest is on the card)` : ask.details}` : ''}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} already has it: do not pass it on${ask.details ? ' and do not repeat what it is about; at most say in one line that it is on the card' : ''}, never remind {name} of it in a later reply, as {name} sees it waiting in the panel and is still deciding, do not answer it yourself, and do not start a task for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that task with SendMessage to "${id}", in their words${others.length ? ', saying which question they answer' : ''}; its card then stops showing the question.`
// What the chat's model is told when an ask it was sent is answered on the card, or the work no longer needs it. The person, who
// answered there, is not shown it
const ASK_ANSWERED = (title: string, said: string, asked = '') => `✓ {Name} answered "${title}" on its card: ${said}${asked ? `, to its question "${cut(asked, 160)}"` : ''}. Claude already has the answer from the card, so it needs no second copy.`
// How long an answer given on the card counts as the one the chat would send again
const ANSWER_ECHO = 60 * 60_000
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
const ASK_REPLIED = (title: string, said: string, asked = '') => `✓ {Name} replied to "${title}" on its card: ${said}${asked ? `, to its question "${cut(asked, 160)}"` : ''}. Claude is working on it now, and will ask again if it still needs {name}.`
// The same box on a card at work: the person's words reach the task between its steps
const MESSAGE_SENT = (said: string) =>
  `${who(true)} wrote to you from your card, in their own words: ${said}\nThese are their own words to you, as a message of theirs in the chat would be: bring your to-dos in line with them first, then carry on.`
// Stop and send: the task was stopped mid-step to read this, which ended its commands and helpers
// Messages sent before it that the task had not read yet go with it, in the order sent: Claude Code would give them only after it
const MESSAGE_NOW = (said: string, earlier: string[] = []) =>
  `${
    earlier.length
      ? `${who(true)} stopped you to write to you from your card. They had written to you before that, and you hadn't read it yet. Their messages, in the order they sent them, in their own words:\n${[...earlier, said].map((one, n) => `${n + 1}. ${one}`).join('\n')}\nThe earlier ones may reach you again after this: they are the same messages, not new ones.`
      : `${who(true)} stopped you to write to you from your card, in their own words: ${said}`
  }\nWhat you were doing was cut off where it stood, and the commands and helpers you had running were stopped with it. Bring your to-dos in line with their words first, then carry on, starting again whatever they still need.`
const CHANGE_ASKED = (said: string) =>
  `${who(true)} wrote to you from the card of your finished task, in their own words: ${said}\nYou had finished. Carry on with their words: tick or add to-dos for what they ask, do it, then hand back again with only what is new.`
// The same box on a card the person stopped: their words carry it on from where it stopped
const STOPPED_ASKED = (said: string) =>
  `${who(true)} stopped you, then wrote to you from your card, in their own words: ${said}\nWhat you were doing was cut off where it stood, and the commands and helpers you had running were stopped with it. Carry on with their words: bring your to-dos in line with them first, then continue, starting again whatever they still need.`
// What the person sees as a notice, and the chat's model reads, when an answer could not reach its task
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string, isYou = false) =>
  isYou
    ? `Your answer “${said}” to “${title}” (${asked}) couldn't reach its task. It goes with your next message here.`
    : `{Name} answered, on its card, the question asked in "${title}" (${asked}): ${said}. The answer could not reach that task, so it waits here for {name}'s next message.`
// What the chat's model reads, and the person sees, when what they wrote to a task can't reach it, as the task can't be reached
const LOST_FOR_CHAT = (title: string, said: string[]) =>
  `{Name} wrote to the task "${title}" on its card: ${said.map(text => `“${cut(text, 400)}”`).join(', ')}. That task can't be reached any more, as its run is gone, so its card now says so, with Carry on, and none of these words reached it. Take them up here as {name}'s own, with {name}'s next message, alongside whatever that message asks.`
const ASK_CLEARED = (title: string, asked = '') => `Claude took back its question in "${title}"${asked ? ` (${cut(asked, 160)})` : ''}. You don't need to answer it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER = (words: string, isWhole = true) =>
  `${theirsAre(words, isWhole)} Stop: take no other step until you have thought about it. Decide which of three it is. More for this task, or anything it asks that you can do with what this task already has (its folder, files, sign-ins, pages or what you have learned): add it to your to-do list and do it here, as the chat sent it to you to be done. A new task of its own: only a request this task has nothing to do with, such as another project; do not do it; hand it back with the \`note\` tool, with its \`task\` set to the request in one line, and the chat starts it.${isWhole ? '' : ' Do only what the chat\'s message asks of you: the chat has seen to the rest of what {name} said.'} A change in how you are working: change your to-dos to match. Then say with the \`note\` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and continue. Call it {name}'s message, by no other name.`
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
    ? `The message you just received, carrying {name}'s words "${words}", is from {name}, in their own words, typed by them in the chat.`
    : `The message you just received carries {name}'s words "${words}", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, not {name}.`
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
// A count of minutes as the panel writes a time: 29m, over an hour 1h 05m
const minutesSaid = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : `${mins}m`)
// The chat is told once when nothing new has come back under a piece of work for a while
// (`isHelpersAtWork`: a helper of its still runs something, which brought nothing back meanwhile)
const STUCK_IN_CHAT = (title: string, mins: number, isHelpersAtWork = false) =>
  `Nothing new from "${title}" for ${minutesSaid(mins)}${isHelpersAtWork ? ', though its helpers are still running something' : ''}. Claude may be stuck waiting for something. Its card shows how far it got.`
// A part of its result a task hands in while it works (the `report` tool): what the task is told, the message Claudopus sends the
// chat for it, and what the chat reads with that message
const PARTS_KEPT = 10
// A file sent from outside the chat's folder, which the person's click would not open: the copies to send instead (opening.tsx)
const SENT_OPENABLE = (made: [string, string][]) => {
  const one = made.length === 1
  return `Not sent: the app opens a file on {name}'s click only inside this chat's folder, so ${one ? 'this file' : 'these files'} would not have opened. Claudopus copied ${one ? 'it' : 'them'} there: ${made.map(([from, to]) => `${to} (a copy of ${from})`).join('; ')}. Send the same call again with ${one ? 'the copy in place of the original' : 'the copies in place of the originals'} and nothing else changed, and when you name ${one ? 'it' : 'them'} in your words, give the copy's path.`
}

// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
// A task whose card has said nothing of its own for this long is asked, at its next step, to say what it does now: the line
// beside its dots is for the person to see that, and steps of to-dos alone leave it standing (19 Nov). Asked again no sooner
const NOTE_STALE = 3 * 60_000
const unnoted = (mins: number, last: string) =>
  `${last ? `Your card has said "${cut(oneLine(last), 80)}" for ${minutesSaid(mins)}, while you have gone on working` : `Your card has not yet said what you are doing, ${minutesSaid(mins)} in`}: that line is how {name} sees what you are doing right now. In your next step, send a \`note\` saying in one plain line what you are doing now, together with your next working call in that same step, never in a step of its own.`
