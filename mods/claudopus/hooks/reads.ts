// A command that only reads, so the guard on the memory folder's own files lets it through: every one of its commands a reader
// (cat, grep, rg, jq, head, tail, sed -n and the like, find without its acts, python -I whose code only reads), each sending
// nothing into a file of the memory folder. The guard reads a command a second time with its quotes taken out, to catch a write
// hidden in a quoted shell command; that reading also cut a quoted pattern such as 'a|b' into commands of their own, and refused
// plain searches of the memory folder (26 Nov: a search of the list of keys, refused twice). Anything this cannot tell is left to
// the guard as before: it stops slips and common tricks, and is no wall. Nothing here touches the engine

const READERS = new Set(['cat', 'grep', 'egrep', 'fgrep', 'rg', 'jq', 'head', 'tail', 'wc', 'ls', 'du', 'stat', 'file', 'tree', 'diff', 'cmp', 'shasum', 'sha256sum', 'md5', 'md5sum', 'less', 'cut', 'tr', 'nl', 'column', 'paste', 'comm', 'fold', 'rev', 'strings', 'od', 'xxd', 'echo', 'printf', 'true', 'basename', 'dirname', 'realpath', 'readlink', 'pwd', 'date', 'read', 'test', '[', 'cd', 'pushd', 'popd', 'sort', 'uniq', 'find', 'sed', 'for', 'done', 'fi', '}'])
// The words that only lead a command of the shell's own
const LEADS = new Set(['do', 'then', 'else', 'elif', 'if', 'while', 'until', '!', '{'])
const FIND_ACTS = /^-(?:delete|exec|execdir|ok|okdir|fprint|fprint0|fprintf|fls)$/
// What a Python program could write or run with: any of it and the program is not taken for a reader
const PY_WRITES = [
  /\b(?:exec|eval|compile|__import__|getattr|setattr|delattr|globals|locals|vars|breakpoint|__builtins__|__dict__|__class__|__subclasses__|FileIO)\b/,
  /\b(?:shutil|subprocess|pty|ctypes|importlib|socket|shelve|dbm|sqlite3|logging|multiprocessing|signal|tarfile|zipfile|webbrowser|runpy|marshal|pickle|tempfile|fileinput)\b/,
  /\bsys\s*\.\s*modules\b/,
  /\bimport\s+[^\n;]*\bas\b|\bfrom\s+os\b/,
  // os only for its paths, listings and reading the environment
  /\bos\s*\.\s*(?!path\b|listdir\b|scandir\b|walk\b|stat\b|lstat\b|environ\b|getenv\b|getcwd\b|sep\b|fspath\b|cpu_count\b|getpid\b)\w/,
  /\.\s*(?:write|writelines|write_text|write_bytes|truncate|unlink|rmdir|mkdir|makedirs|rename|touch|chmod|lchmod|symlink_to|hardlink_to|link_to|save|savez|savetxt|tofile|to_csv|to_json|to_parquet|to_excel|savefig|imwrite|dump)\s*\(/,
]
// Every open(...) only for reading: one argument, or a mode that only reads
const opensToWrite = (code: string) =>
  [...code.matchAll(/\bopen\s*\(([^)]*)\)?/g)].some(m => {
    const [, mode, ...more] = (m[1] ?? '').split(',')
    const isRead = (arg: string | undefined) => arg === undefined || /^\s*(?:(?:mode\s*=\s*)?['"][rbtU]*['"]|encoding\s*=|errors\s*=|newline\s*=|buffering\s*=)/.test(arg)
    return !isRead(mode) || !more.every(isRead)
  })
export const pythonReadsOnly = (code: string) => !PY_WRITES.some(re => re.test(code)) && !opensToWrite(code) && !(/\.\s*replace\s*\(/.test(code) && /\b(?:pathlib|Path)\b/.test(code))

// The bodies of a command's here-documents, in order, and the command without them: a << only outside quotes starts one
export const hereDocs = (command: string) => {
  const bodies: string[] = []
  const waiting: { tag: string; isTabbed: boolean }[] = []
  let shell = ''
  let quote = ''
  for (let i = 0; i < command.length; i++) {
    const c = command[i] ?? ''
    if (c === '\\' && quote !== "'") {
      shell += command.slice(i, i + 2)
      i++
      continue
    }
    if (quote || c === "'" || c === '"') {
      quote = !quote ? c : c === quote ? '' : quote
      shell += c
      continue
    }
    const m = c === '<' ? /^<<(?!<)(-?)\s*(['"]?)([A-Za-z_][\w-]*)\2/.exec(command.slice(i)) : null
    if (m) {
      waiting.push({ tag: m[3] ?? '', isTabbed: m[1] === '-' })
      shell += m[0]
      i += m[0].length - 1
      continue
    }
    shell += c
    if (c !== '\n' || !waiting.length) continue
    let end = i + 1
    for (const one of waiting.splice(0)) {
      const body: string[] = []
      for (;;) {
        if (end > command.length) return { shell, bodies, isWhole: false }
        const stop = command.indexOf('\n', end)
        const line = command.slice(end, stop < 0 ? command.length : stop)
        end = stop < 0 ? command.length + 1 : stop + 1
        if ((one.isTabbed ? line.replace(/^\t+/, '') : line) === one.tag) break
        body.push(line)
      }
      bodies.push(body.join('\n'))
    }
    i = end - 1
  }
  return { shell, bodies, isWhole: !waiting.length }
}

// A path as written against the folder given, with ~ and $HOME read; '' when it cannot be told (a variable, a pattern)
const pathAt = (path: string, home: string, folder: string) => {
  const full = path.replace(/^(?:~|\$HOME|\$\{HOME\})(?=\/|$)/, home)
  if (/[$*?[`{]/.test(full) || (!full.startsWith('/') && !folder)) return ''
  const parts: string[] = []
  for (const part of (full.startsWith('/') ? full : `${folder}/${full}`).split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return `/${parts.join('/')}`
}

// `split`: the command as the shell splits it, quote by quote, into its commands' words (shellWords); `start`: where a command's
// own words start, past settings and what runs a command it is handed (commandAt); `memory`: the memory folder
export const readsOnly = (command: string, at: { home: string; folder: string; memory: string }, split: (command: string) => string[][], start: (words: string[]) => number) => {
  // A command inside double quotes runs: a quoted $( or backtick is not read here
  let quote = ''
  for (let i = 0; i < command.length; i++) {
    const c = command[i]
    if (c === '\\' && quote !== "'") i++
    else if (quote) quote = c === quote ? '' : quote === '"' && (c === '`' || (c === '$' && command[i + 1] === '(')) ? 'x' : quote
    else if (c === "'" || c === '"') quote = c
    if (quote === 'x') return false
  }
  const { shell, bodies, isWhole } = hereDocs(command)
  const parts = split(shell)
  if (!isWhole || parts.flat().filter(word => /^<<(?!<)/.test(word)).length !== bodies.length) return false
  const memory = at.memory.toLowerCase().replace(/\/+$/, '')
  const isMemory = (path: string) => !path || path.toLowerCase() === memory || path.toLowerCase().startsWith(`${memory}/`)
  let folder = at.folder
  let body = 0
  return parts.every((given, n) => {
    // (the number of a >&1 the shell's split leaves as a command of its own is no command)
    let words = /^\d+-?$|^-$/.test(given[0] ?? '') && parts[n - 1]?.at(-1)?.endsWith('>') ? given.slice(1) : given
    while (words.length && LEADS.has(words[0] ?? '')) words = words.slice(1)
    if (!words.length || words.every(word => /^\w+=/.test(word))) return true
    const i = start(words)
    const head = (words[i] ?? '').split('/').pop() ?? ''
    const args = words.slice(i + 1)
    const fed = words.filter(word => /^<<(?!<)/.test(word)).map(() => bodies[body++] ?? '')
    // What it sends into a file: never into the memory folder, nor anywhere this cannot tell (a > in a quoted pattern is taken for one too)
    for (const [k, word] of words.entries()) {
      if (!word.includes('>')) continue
      const to = word.slice(word.indexOf('>')).replace(/^>>?\|?/, '') || (words[k + 1] ?? '')
      // (a >& the shell's split leaves as a > that ends its command sends into no file)
      if (to && !to.startsWith('&') && to !== '/dev/null' && isMemory(pathAt(to, at.home, folder))) return false
    }
    if (head === 'cd' || head === 'pushd') return void (folder = args[0] ? pathAt(args[0], at.home, folder) : at.home), true
    if (/^python(?:3(?:\.\d+)?)?$/.test(head)) {
      if (!args.some(arg => /^-[A-Za-z]*I[A-Za-z]*$/.test(arg))) return false
      const c = args.findIndex(arg => /^-[A-Za-z]*c$/.test(arg))
      const code = c >= 0 ? args[c + 1] : args.includes('-') ? fed[0] : undefined
      return code !== undefined && pythonReadsOnly(code)
    }
    if (!READERS.has(head)) return false
    if (head === 'sed') return !args.some(arg => /^-(?:[a-zA-Z]*i|-in-place)/.test(arg) || /(?:^|[;{}\s/])[wWe](?:\s|$)/.test(arg))
    if (head === 'sort') return !args.some(arg => /^-[a-zA-Z]*o|^--output/.test(arg))
    if (head === 'uniq') return args.filter(arg => !arg.startsWith('-')).length <= 1
    if (head === 'find') return !args.some(arg => FIND_ACTS.test(arg))
    return true
  })
}
