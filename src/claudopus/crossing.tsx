// Tasks of one chat crossing each other's files. They share the chat's one scratchpad and often one checkout: on 16 Nov one task's
// script replaced another's in the scratchpad, and a task's half-done change to a shared checkout broke the dev server for the others,
// who waited until someone noticed. Each task gets a scratch folder of its own; a write at the scratchpad's top is refused, and one
// into another running task's folder or onto a file another running task changed minutes ago is refused once, the same call again
// going through; a task changing the same checkout as another running task is told so; and an error that names a file another
// running task changed minutes ago is told to that task, and the task that met it is told who it was. Claudopus sees every tool call
// of the chat's tasks, which is all this uses: Bash writes are seen only by their redirects and tee, as a script's own are not

// How long a change of another task's counts as under way: its file refused once, its folder named
const CROSS_RECENT = 10 * 60_000
// How long an error naming a file another task changed is put down to that change
const CROSS_BROKE = 30 * 60_000
// The engine's scratchpad, the chat's own and every task's of it alike: <tmp>/claude-<uid>/<project>/<session>/scratchpad
const SCRATCH = /^(\/.*\/claude-\d+\/[^/]+\/[^/]+\/scratchpad)(?:\/(.+))?$/
// What an error says, on a line beside the file it names
const ERROR_WORDS = /\berror\b|\bfailed\b|\bcannot\b|can't resolve|\bnot found\b|\bunexpected\b|\bis not pure\b|\bENOENT\b|\bexception\b/i

// Each file a running task changed, and each folder of a repo it changed files in, with when: the newest change of each by path
const crossWrites = new Map<string, { top: string; at: number; root: string }>()
// Scratch folders a task wrote first that were not handed to it (a folder its brief named), by name
const scratchClaims = new Map<string, string>()
// What was refused or told once, so the same call again goes through and nothing is told twice
const crossWarned = new Set<string>()

// A task's own scratch folder: its few words as a name, made unique among the cards
const scratchName = (list: Todo[], title: string) => {
  const base = oneLine(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 5).join('-') || 'task'
  const taken = new Set([...list.map(one => one.scratch ?? ''), ...scratchClaims.keys()])
  for (let n = 1; ; n += 1) if (!taken.has(n === 1 ? base : `${base}-${n}`)) return n === 1 ? base : `${base}-${n}`
}
const SCRATCH_LINE = (name: string) =>
  `- Your own folder for scratch files is \`${name}\` in the scratchpad directory you were given: make it, and give your helpers folders inside it. Every task of this chat shares that scratchpad, so never write at its top or into another task's folder.`

const SCRATCH_TOP = (name: string) =>
  `Not written: the scratchpad's top is shared by every task of this chat, and a file of one task's there replaced another's. Put it in your own folder in the scratchpad${name ? `, \`${name}\`` : ', named for your task'}, and run it from there.`
const SCRATCH_THEIRS = (title: string, name: string) =>
  `Not written: this folder in the scratchpad is the task "${title}"'s, which is still working, and a file of yours there can replace one of its. Use your own folder${name ? `, \`${name}\`` : ''}. If you mean to change its file, make the same call again.`
const SAME_FILE = (title: string, when: string) =>
  `Not written: the task "${title}", still working, changed this file ${when}, and a change of yours now can undo or break its half-done work. Work in a worktree or copy of your own; if you mean to change this same file, make the same call again.`
const SAME_FOLDER = (title: string, root: string) =>
  `Claudopus: the task "${title}" is changing files in this same checkout (${root}) right now. Its half-done changes can break your build and yours its: make a worktree of your own (git worktree add) and work there.`
const BROKE_TOLD = (title: string, file: string, when: string) =>
  `From Claudopus: the task "${title}" just met an error naming ${file}, which you changed ${when}, so its build or page fails on your change. Finish that change or put it back now, so the folder builds for the tasks that share it.`
const BROKE_HERE = (title: string, file: string, when: string) =>
  `Claudopus: this error names ${file}, which the task "${title}" changed ${when} and is still working on; Claudopus has told it. Don't wait for it or change its file: carry on in a worktree of your own.`

const crossAgo = (at: number, now: number) => {
  const minutes = Math.round(Math.max(0, now - at) / 60_000)
  return minutes < 1 ? 'less than a minute ago' : minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`
}

// The files a command writes by its own redirects and tee, its variables set in it read and its heredocs' text left out, from the
// folder a leading cd moves it to
const writtenBy = (command: string, home: string, from: string): string[] => {
  const lines = command.split('\n')
  const kept: string[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    kept.push(line)
    const tag = /<<-?\s*['"]?([A-Za-z_]\w*)['"]?/.exec(line)?.[1]
    if (tag) while (i + 1 < lines.length && (lines[i + 1] ?? '').trim() !== tag) i += 1
  }
  const text = kept.join('\n')
  const vars = new Map<string, string>([['HOME', home]])
  const bare = (word: string) => word.replace(/^(["'])(.*)\1$/, '$2')
  for (const m of text.matchAll(/(?:^|[\s;&|(])([A-Za-z_]\w*)=("[^"]*"|'[^']*'|[^\s;&|()]+)/g)) vars.set(m[1] ?? '', bare(m[2] ?? ''))
  const expand = (word: string) => bare(word).replace(/\$\{?([A-Za-z_]\w*)\}?/g, (all, name: string) => vars.get(name) ?? all)
  const cd = /^\s*cd\s+("[^"]*"|'[^']*'|[^\s;&|]+)\s*(?:&&|;)/.exec(text)?.[1]
  const at = cd ? pathOf(expand(cd), home, from) : from
  const words = [
    ...[...text.matchAll(/(?<![<>=&\d-])\d?>>?\|?\s*("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g)].map(m => m[1] ?? ''),
    ...[...text.matchAll(/(?:^|[\s;&|(])tee\s+(?:-a\s+)?("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g)].map(m => m[1] ?? ''),
  ]
  return words
    .map(expand)
    .filter(word => word && !word.startsWith('&') && !word.startsWith('/dev/') && !word.includes('$') && !word.includes('`'))
    .map(word => pathOf(word, home, at))
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

// The checkout a file is in, a main one or a worktree, by the nearest folder above it with a .git, or else the folder it is in
const rootCache = new Map<string, { root: string; isGit: boolean }>()
const rootOf = async ($: EngineInterface, path: string) => {
  const folder = path.slice(0, path.lastIndexOf('/')) || '/'
  const kept = rootCache.get(folder)
  if (kept) return kept
  let at = folder
  let found = { root: folder, isGit: false }
  for (let hops = 0; at.length > 1 && hops < 12; hops += 1) {
    if (await $.fs.exists(`${at}/.git`).catch(() => false)) {
      found = { root: at, isGit: true }
      break
    }
    at = at.slice(0, at.lastIndexOf('/')) || '/'
  }
  rootCache.set(folder, found)
  return found
}

// Whether a call of a task's crosses another running task's files: refused (`deny`) or told as it ends (`context`)
const crossingOf = async ($: EngineInterface, e: { tool: string; agentId?: string }): Promise<{ deny?: string; context?: string; top?: string; paths?: string[] }> => {
  if (!dir || isOff || e.agentId === undefined || !(e.tool === 'Bash' || FILE_TOOLS.includes(e.tool))) return {}
  const paths = crossPaths(e)
  if (!paths.length) return {}
  const list = await read($, todos)
  const top = topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  if (!card) return {}
  const now = await $.clock.now()
  const running = (id: string) => id !== top && list.some(one => one.id === id && one.status === 'working')
  const title = (id: string) => titleOf(list.find(one => one.id === id) ?? card)
  const own = card.scratch ?? ''
  let context = ''
  for (const path of paths) {
    const scratch = SCRATCH.exec(path)
    if (scratch) {
      const rest = scratch[2] ?? ''
      if (!rest) continue
      if (!rest.includes('/')) return { deny: SCRATCH_TOP(own) }
      const name = rest.split('/')[0] ?? ''
      const owner = list.find(one => one.scratch === name && one.status === 'working')?.id ?? scratchClaims.get(name)
      if (owner && running(owner) && name !== own) {
        const key = `scratch ${top} ${name}`
        if (!crossWarned.has(key)) return (crossWarned.add(key), { deny: SCRATCH_THEIRS(title(owner), own) })
      }
      if (!owner || !list.some(one => one.id === owner && one.status === 'working')) scratchClaims.set(name, top)
      continue
    }
    // Only a repo's files: the memory folder's notes and a folder outside git are each task's to add to
    const { root, isGit } = await rootOf($, path)
    if (!isGit || path.startsWith(`${dir}/`)) continue
    const last = crossWrites.get(path)
    if (last && running(last.top) && now - last.at < CROSS_RECENT) {
      const key = `file ${top} ${path}`
      if (!crossWarned.has(key)) return (crossWarned.add(key), { deny: SAME_FILE(title(last.top), crossAgo(last.at, now)) })
    }
    const other = [...crossWrites.values()].find(one => one.root === root && running(one.top) && now - one.at < CROSS_RECENT)
    const key = other ? `folder ${top} ${root} ${other.top}` : ''
    if (other && !crossWarned.has(key)) {
      crossWarned.add(key)
      context = SAME_FOLDER(title(other.top), root)
    }
  }
  return { top, paths, ...(context ? { context } : {}) }
}

// As a task's call ends: what it wrote is kept, and an error in what came back that names a file another running task changed
// lately is told to that task, the task that met it told who it was
const crossEnded = async ($: EngineInterface, e: { tool: string; agentId?: string }, crossed: { top?: string; paths?: string[] }, result: unknown): Promise<string> => {
  if (!dir || isOff || e.agentId === undefined) return ''
  const now = await $.clock.now()
  for (const [path, one] of crossWrites) if (now - one.at > CROSS_BROKE) crossWrites.delete(path)
  const list = await read($, todos)
  const top = crossed.top ?? topOf(list, e.agentId)
  for (const path of crossed.paths ?? []) {
    const { root, isGit } = SCRATCH.test(path) || path.startsWith(`${dir}/`) ? { root: '', isGit: false } : await rootOf($, path)
    if (isGit) crossWrites.set(path, { top, at: now, root })
  }
  if (e.tool !== 'Bash' || !crossWrites.size) return ''
  const r = result as { stdout?: unknown; stderr?: unknown } | string | undefined
  const text = typeof r === 'string' ? r : `${String(r?.stdout ?? '')}\n${String(r?.stderr ?? '')}`
  if (!ERROR_WORDS.test(text)) return ''
  const lines = text.split('\n')
  for (const [path, one] of crossWrites) {
    if (one.top === top || !list.some(card => card.id === one.top && card.status === 'working')) continue
    const rel = path.startsWith(`${one.root}/`) ? path.slice(one.root.length + 1) : ''
    const names = [path, ...(rel.length >= 6 && /[/.]/.test(rel) ? [rel] : [])]
    const at = lines.findIndex(line => names.some(name => line.includes(name)))
    if (at < 0 || !lines.slice(Math.max(0, at - 2), at + 3).some(line => ERROR_WORDS.test(line))) continue
    const key = `broke ${one.top} ${path} ${top}`
    if (crossWarned.has(key)) continue
    crossWarned.add(key)
    const writer = list.find(card => card.id === one.top)
    const met = list.find(card => card.id === top)
    const file = rel || path
    await log($, `work ${top} met an error naming ${file}, which work ${one.top} changed: told it`)
    void tell($, one.top, BROKE_TOLD(met ? titleOf(met) : 'another task', file, crossAgo(one.at, now)))
    return BROKE_HERE(writer ? titleOf(writer) : 'another task', file, crossAgo(one.at, now))
  }
  return ''
}
