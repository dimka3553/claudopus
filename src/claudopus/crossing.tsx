// Tasks of one chat crossing each other's files. They share the chat's one scratchpad and often one checkout: on 16 Nov one task's
// script replaced another's in the scratchpad, and a task's half-done change to a shared checkout broke the build for the others,
// who waited until someone noticed. Each task the chat starts is told a scratch folder of its own, and its write at the scratchpad's
// top is refused. A write into another running task's own folder, or onto a repo file another running task changed minutes ago, is
// refused once, its next write there going through. A task that starts changing a checkout another running task is changing is told
// so. A command of a task's that fails with an error naming, from that command's own folder, the very file another running task
// changed lately in that checkout tells that task, and tells the task that met it whose change it may be. Claudopus sees every tool
// call of the chat's tasks, which is all this uses: a command's writes are seen only by its own redirects and tee, never a script's

// How long a change of another task's counts as under way: its file refused once, its checkout named
const CROSS_RECENT = 10 * 60_000
// How long an error naming a file another task changed may be put down to that change
const CROSS_BROKE = 30 * 60_000
// What an error says, on a line at or beside the file it names
const ERROR_WORDS = /\berror\b|\bfailed\b|\bcannot\b|can't resolve|\bnot found\b|\bunexpected\b|\bis not pure\b|\bENOENT\b|\bexception\b/i
// Commands that only read or search: what they print names files, never a failure of the folder's build
const READ_ONLY = /^(?:grep|rg|ag|ack|cat|head|tail|less|more|sed|awk|jq|ls|find|fd|wc|echo|printf|diff|stat|file|tree|git\s+(?:log|diff|show|status|grep|blame|ls-files|ls-tree|cat-file|rev-parse|branch))\b/

// Each repo file a task changed, by path: which task (its top), when, and its checkout
const crossWrites = new Map<string, { top: string; at: number; root: string }>()
// Folder names handed out and not yet on a card, so two tasks started in one message never get one name: when each was handed
const scratchHanded = new Map<string, number>()
// What was refused or told once, with the tasks it was about: so a task's next write there goes through, nothing is told twice,
// and each is let go once a task it names has ended
const crossWarned = new Map<string, string[]>()

// A task's own scratch folder: its few words as a name, made unique among the cards and the names just handed out
const scratchName = (list: Todo[], title: string, now: number) => {
  for (const [name, at] of scratchHanded) if (now - at > CROSS_RECENT || list.some(one => one.scratch === name)) scratchHanded.delete(name)
  const base = oneLine(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 5).join('-') || 'task'
  const taken = new Set([...list.map(one => one.scratch ?? ''), ...scratchHanded.keys()])
  let name = base
  for (let n = 2; taken.has(name); n += 1) name = `${base}-${n}`
  scratchHanded.set(name, now)
  return name
}
const SCRATCH_LINE = (name: string) =>
  `- Your own folder for scratch files is \`${name}\` in the scratchpad directory you were given: make it, and give your helpers folders inside it. Every task of this chat shares that scratchpad, so never write at its top or into another task's folder.`

const SCRATCH_TOP = (name: string) =>
  `Not written: the scratchpad's top is shared by every task of this chat, and a file of one task's there replaced another's. Put it in your own folder in the scratchpad, \`${name}\`, and run it from there.`
const SCRATCH_THEIRS = (title: string, name: string) =>
  `Not written: this folder in the scratchpad is the task "${title}"'s own, and that task is still working, so a file of yours there can replace one of its. Use your own folder, \`${name}\`. Claudopus refuses this once: your next write into that folder goes through.`
const SAME_FILE = (title: string, when: string) =>
  `Not written: the task "${title}", still working, changed this file ${when}, and a change of yours now can undo or break its half-done work. Work in a worktree or copy of your own. Claudopus refuses this once: your next write to this same file goes through.`
const SAME_FOLDER = (title: string, root: string) =>
  `Claudopus: the task "${title}" is changing files in this same checkout (${root}) right now. Its half-done changes can break your build and yours its: make a worktree of your own (git worktree add) and work there.`
const BROKE_TOLD = (title: string, file: string, when: string, line: string) =>
  `From Claudopus: a command of the task "${title}" failed in the checkout you share, with an error naming ${file}, which you changed ${when}: "${line}". Your change may have caused it: if so, finish it or put it back, so the checkout builds for both tasks.`
const BROKE_HERE = (title: string, file: string, when: string) =>
  `Claudopus: this error names ${file}, which the task "${title}" changed ${when} in this same checkout and is still working on, so its change may be the cause; Claudopus has told it. Rather than wait for it or change its file, carry on in a worktree of your own.`

const crossAgo = (at: number, now: number) => {
  const minutes = Math.round(Math.max(0, now - at) / 60_000)
  return minutes < 1 ? 'less than a minute ago' : minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`
}

// A command as the shell reads it at its top: its heredocs' text left out, and what is quoted kept apart, so a `>` in quotes
// (node -e "a > 1", awk '$3 > 100', a commit message) is no redirect. Each piece is a word's text and whether it was quoted
const shellPieces = (command: string) => {
  const lines = command.split('\n')
  const kept: string[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    kept.push(line)
    const tag = /<<-?\s*['"]?([A-Za-z_]\w*)['"]?/.exec(line)?.[1]
    if (tag) while (i + 1 < lines.length && (lines[i + 1] ?? '').trim() !== tag) i += 1
  }
  const text = kept.join('\n')
  // The text with every quoted stretch replaced by a mark of the same length, so places in it still line up with the command
  let open = ''
  let plain = ''
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i] ?? ''
    if (open) {
      if (c === '\\' && open === '"') (plain += '__'), (i += 1)
      else if (c === open) (open = ''), (plain += c)
      else plain += '_'
    } else if (c === '\\') (plain += '__'), (i += 1)
    else if (c === '"' || c === "'") (open = c), (plain += c)
    else plain += c
  }
  return { text, plain: open ? '' : plain }
}

// The folder a command runs in: the chat's, or the one a cd at its very start moves it to; '' when a cd or pushd elsewhere in it, or
// a subshell, leaves that unsure
const commandFolder = (command: string, home: string, from: string) => {
  const { text, plain } = shellPieces(command)
  if (!plain) return ''
  const lead = /^\s*cd\s+("[^"]*"|'[^']*'|[^\s;&|()]+)\s*(?:&&|;)/.exec(text)
  const rest = plain.slice(lead ? lead[0].length : 0)
  if (/(?:^|[\s;&|(])(?:cd|pushd|popd)\b|\(/.test(rest)) return ''
  const word = (lead?.[1] ?? '').replace(/^(["'])(.*)\1$/, '$2')
  return lead ? (word.includes('$') ? '' : pathOf(word, home, from)) : from
}

// The files a command writes by its own redirects and tee, outside quotes, with the variables set in it read; a relative one only
// where the folder it runs in is sure
const writtenBy = (command: string, home: string, from: string): string[] => {
  const { text, plain } = shellPieces(command)
  if (!plain) return []
  const at = commandFolder(command, home, from)
  const vars = new Map<string, string>([['HOME', home]])
  const bare = (word: string) => word.replace(/^(["'])(.*)\1$/, '$2')
  for (const m of plain.matchAll(/(?:^|[\s;&|(])([A-Za-z_]\w*)=(\S*)/g)) {
    const start = (m.index ?? 0) + m[0].indexOf('=') + 1
    vars.set(m[1] ?? '', bare(text.slice(start, start + (m[2] ?? '').length).replace(/[;&|)]+$/, '')))
  }
  const expand = (word: string) => bare(word).replace(/\$\{?([A-Za-z_]\w*)\}?/g, (all, name: string) => vars.get(name) ?? all)
  const words: string[] = []
  // Each target found in the unquoted text, read from the command itself, quotes and all
  const target = (m: RegExpMatchArray) => {
    const start = (m.index ?? 0) + m[0].length - (m[1] ?? '').length
    return text.slice(start, start + (m[1] ?? '').length)
  }
  for (const m of plain.matchAll(/(?<![<>=&\d-])\d?>>?\|?\s*("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g)) words.push(target(m))
  for (const m of plain.matchAll(/(?:^|[\s;&|(])tee\s+(?:-a\s+)?("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g)) words.push(target(m))
  return words
    .map(expand)
    .filter(word => word && !word.startsWith('&') && !word.startsWith('/dev/') && !word.includes('$') && !word.includes('`') && (word.startsWith('/') || word.startsWith('~') || Boolean(at)))
    .map(word => pathOf(word, home, at || from))
}

// The paths a call writes: a file tool's own, or a command's
const crossPaths = (e: { tool: string }) => {
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (FILE_TOOLS.includes(e.tool)) {
    const path = String(input.file_path ?? input.notebook_path ?? '')
    return path ? [pathOf(path, home, cwd || home)] : []
  }
  return e.tool === 'Bash' ? writtenBy(String(input.command ?? ''), home, cwd || home) : []
}

// The checkout a file is in, a main one or a worktree, by the nearest folder above it with a .git; '' outside git. Kept a while: a
// folder found outside git a minute, as it may become a repo
const rootCache = new Map<string, { root: string; at: number }>()
const rootOf = async ($: EngineInterface, path: string, now: number) => {
  const folder = path.slice(0, path.lastIndexOf('/')) || '/'
  const kept = rootCache.get(folder)
  if (kept && now - kept.at < (kept.root ? CROSS_RECENT : 60_000)) return kept.root
  let at = folder
  let root = ''
  for (let hops = 0; at.length > 1 && hops < 12; hops += 1) {
    if (await $.fs.exists(`${at}/.git`).catch(() => false)) {
      root = at
      break
    }
    at = at.slice(0, at.lastIndexOf('/')) || '/'
  }
  for (const [one, was] of rootCache) if (now - was.at > CROSS_RECENT) rootCache.delete(one)
  rootCache.set(folder, { root, at: now })
  return root
}

// The chat's own scratchpad, and where a path is in it: <tmp>/claude-<uid>/<project>/<this chat's session>/scratchpad/<rest>
const scratchRest = (path: string, session: string) => {
  const m = /^\/.*\/claude-\d+\/[^/]+\/([^/]+)\/scratchpad(?:\/(.*))?$/.exec(path)
  return m && m[1] === session ? (m[2] ?? '') : undefined
}

// Let go what was told about tasks that have ended
const crossForget = (list: Todo[]) => {
  const working = new Set(list.filter(one => one.status === 'working').map(one => one.id))
  for (const [key, ids] of crossWarned) if (ids.some(id => !working.has(id))) crossWarned.delete(key)
  for (const [path, one] of crossWrites) if (!working.has(one.top)) crossWrites.delete(path)
}

// Whether a call of a task's crosses another running task's files: refused (`deny`), or told as it goes through (`context`, marked
// told only then by `noteKey`)
type Crossed = { deny?: string; context?: string; noteKey?: string; noteIds?: string[]; top?: string; paths?: string[] }
const crossingOf = async ($: EngineInterface, e: { tool: string; agentId?: string }): Promise<Crossed> => {
  if (!dir || isOff || e.agentId === undefined || !(e.tool === 'Bash' || FILE_TOOLS.includes(e.tool))) return {}
  const paths = crossPaths(e)
  if (!paths.length) return {}
  const list = await ownCards($)
  const top = topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  if (!card) return {}
  crossForget(list)
  const now = await $.clock.now()
  const session = (await read($, me)).id
  const running = (id: string) => id !== top && list.some(one => one.id === id && one.status === 'working')
  const title = (id: string) => titleOf(list.find(one => one.id === id) ?? card)
  const own = card.scratch ?? ''
  let note: Crossed = {}
  for (const path of paths) {
    const rest = scratchRest(path, session)
    if (rest !== undefined) {
      // Only work the chat started and told a folder of its own, and its helpers, are held to it
      if (!own || !rest) continue
      if (!rest.includes('/')) return { deny: SCRATCH_TOP(own) }
      const name = rest.split('/')[0] ?? ''
      const owner = name === own ? undefined : list.find(one => one.scratch === name && running(one.id))
      const key = owner ? `scratch ${top} ${name}` : ''
      if (owner && !crossWarned.has(key)) return (crossWarned.set(key, [top, owner.id]), { deny: SCRATCH_THEIRS(titleOf(owner), own) })
      continue
    }
    // Only a repo's files: the memory folder's notes and a folder outside git are each task's to add to
    if (path.startsWith(`${dir}/`)) continue
    const root = await rootOf($, path, now)
    if (!root) continue
    const last = crossWrites.get(path)
    if (last && running(last.top) && now - last.at < CROSS_RECENT) {
      const key = `file ${top} ${path}`
      if (!crossWarned.has(key)) return (crossWarned.set(key, [top, last.top]), { deny: SAME_FILE(title(last.top), crossAgo(last.at, now)) })
    }
    const other = [...crossWrites.values()].find(one => one.root === root && running(one.top) && now - one.at < CROSS_RECENT)
    const key = other ? `checkout ${top} ${root} ${other.top}` : ''
    if (other && !crossWarned.has(key) && !note.noteKey) note = { context: SAME_FOLDER(title(other.top), root), noteKey: key, noteIds: [top, other.top] }
  }
  return { top, paths, ...note }
}

// Whether a command's result is a failure: the engine's error result, an exit code other than 0, or its "Exit code" line
const failedOf = (result: unknown, isError: boolean) => {
  if (isError) return true
  if (typeof result === 'string') return /^Exit code [1-9]/.test(result)
  const r = result as { exitCode?: unknown; code?: unknown; returnCode?: unknown } | undefined
  return [r?.exitCode, r?.code, r?.returnCode].some(code => typeof code === 'number' && code !== 0)
}
const outputOf = (result: unknown) => {
  if (typeof result === 'string') return result
  const r = result as { stdout?: unknown; stderr?: unknown; content?: unknown } | undefined
  if (Array.isArray(r?.content)) return r.content.map(b => String((b as { text?: unknown }).text ?? '')).join('\n')
  return `${String(r?.stdout ?? '')}\n${String(r?.stderr ?? '')}`
}

// As a task's call goes through: what it wrote is kept, a note it was given is marked told, and a failed command whose error names,
// from that command's own folder, a file another running task changed lately in that checkout is told to that task, and the task
// that met it is told whose change it may be
const crossEnded = async ($: EngineInterface, e: { tool: string; agentId?: string; command?: unknown }, crossed: Crossed, result: unknown, isError: boolean): Promise<string> => {
  if (!dir || isOff || e.agentId === undefined) return ''
  const now = await $.clock.now()
  const list = await ownCards($)
  const top = crossed.top ?? topOf(list, e.agentId)
  // A file tool's error wrote nothing; a command may have written before it failed
  const isThrough = !(isError && e.tool !== 'Bash')
  if (crossed.noteKey && isThrough) crossWarned.set(crossed.noteKey, crossed.noteIds ?? [top])
  for (const [path, one] of crossWrites) if (now - one.at > CROSS_BROKE) crossWrites.delete(path)
  if (isThrough) {
    for (const path of crossed.paths ?? []) {
      if (path.startsWith(`${dir}/`)) continue
      const root = await rootOf($, path, now)
      if (root) crossWrites.set(path, { top, at: now, root })
    }
  }
  if (e.tool !== 'Bash' || !crossWrites.size || !failedOf(result, isError)) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const command = String(e.command ?? '')
  const at = commandFolder(command, home, cwd || home)
  const first = command.replace(/^\s*cd\s+("[^"]*"|'[^']*'|[^\s;&|()]+)\s*(?:&&|;)\s*/, '').replace(/^(?:[A-Za-z_]\w*=\S*\s+)+/, '')
  if (!at || READ_ONLY.test(first)) return ''
  const lines = outputOf(result).split('\n')
  for (const [i, line] of lines.entries()) {
    if (!lines.slice(Math.max(0, i - 2), i + 3).some(near => ERROR_WORDS.test(near))) continue
    for (const m of line.matchAll(/(?:^|[\s'"(`])((?:~|\.{1,2})?\/?[\w@.+-]+(?:\/[\w@.+-]+)+)(?::\d+)*/g)) {
      const path = pathOf(m[1] ?? '', home, at)
      const one = crossWrites.get(path)
      if (!one || one.top === top || !list.some(card => card.id === one.top && card.status === 'working')) continue
      const key = `broke ${one.top} ${path} ${top}`
      if (crossWarned.has(key)) continue
      crossWarned.set(key, [top, one.top])
      const writer = list.find(card => card.id === one.top)
      const met = list.find(card => card.id === top)
      const file = path.slice(one.root.length + 1)
      const said = cut(oneLine(lines.slice(i, i + 3).join(' ')), 160)
      await log($, `work ${top}'s command failed on ${file}, which work ${one.top} changed: told it`)
      void tell($, one.top, BROKE_TOLD(met ? titleOf(met) : 'another task', file, crossAgo(one.at, now), said))
      return BROKE_HERE(writer ? titleOf(writer) : 'another task', file, crossAgo(one.at, now))
    }
  }
  return ''
}
