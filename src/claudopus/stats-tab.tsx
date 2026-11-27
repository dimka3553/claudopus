// Stats: Claude's records read into what is kept, the Stats tab and the leaderboard (the sums and drawing are in
// ../../mods/claudopus/hooks/stats.tsx, which says what is kept and why)

// ---- Stats: reading Claude's records ----

let jqPath = ''
// On Windows jq is no part of Git for Windows: the one on the PATH, else where winget puts the one Claudopus's installer offers. Its
// program goes in a file there, as Windows' own quoting of a long argument full of quotes would not reach jq.exe whole
const jqPlaces = async ($: EngineInterface) => {
  if (!isWindows) return ['/usr/bin/jq', '/opt/homebrew/bin/jq', '/usr/local/bin/jq', 'jq']
  const local = slashed(((await $.env.get('LOCALAPPDATA').catch(() => undefined)) ?? '').trim())
  return ['jq', ...(local ? [`${local}/Microsoft/WinGet/Links/jq.exe`] : [])]
}
let jqProgram = ''
const jqProgramArgs = async ($: EngineInterface) => {
  if (!isWindows) return [SUM_JQ]
  const file = `${dir}/stats/sum.jq`
  if (jqProgram !== file || (await readOr($, file)) !== SUM_JQ) {
    await runOn($, ['mkdir', '-p', `${dir}/stats`]).catch(() => undefined)
    await $.fs.write(file, SUM_JQ)
    jqProgram = file
  }
  return ['-f', file]
}
// No more than six jq at once, whichever chats they sum for: each is a process
const jqLine: (() => void)[] = []
let jqBusy = 0
async function sumOf($: EngineInterface, path: string): Promise<FileSum> {
  if (jqBusy >= 6) await new Promise<void>(go => jqLine.push(go))
  else jqBusy += 1
  try {
    const program = await jqProgramArgs($)
    for (const jq of jqPath ? [jqPath] : await jqPlaces($)) {
      const r = await runOn($, [jq, '-cnR', '--argjson', 'gap', String(GAP), ...program, path]).catch(() => undefined)
      if (!r || r.exitCode !== 0) continue
      jqPath = jq
      return parsed<FileSum>(r.stdout.trim(), { s: [], u: [], d: [] })
    }
    throw new Error('jq')
  } finally {
    // The next in line takes this one's place
    const next = jqLine.shift()
    if (next) next()
    else jqBusy -= 1
  }
}
// Where a chat's records are: its own folder under the engine's projects folder (in ~/.claude, or in CLAUDE_CONFIG_DIR when the
// person keeps Claude Code elsewhere: until 0.2.281 only ~/.claude was looked in, and such a Mac counted nothing), found by its id
async function chatFolderOf($: EngineInterface, chatId: string) {
  const root = `${await configDir($)}/projects`
  for (const entry of await $.fs.list(root).catch(() => [])) {
    if (entry.kind !== 'dir') continue
    if (await $.fs.stat(`${root}/${entry.name}/${chatId}.jsonl`).catch(() => undefined)) return `${root}/${entry.name}`
  }
  return ''
}
// The chats the mod has kept work for (finished/<chat id>.json), and this one
async function chatsKept($: EngineInterface, memory: string, chatId: string) {
  const kept = (await $.fs.list(`${memory}/finished`).catch(() => [])).map(e => /^(.+)\.json$/.exec(e.name)?.[1] ?? '').filter(Boolean)
  return [...new Set([chatId, ...kept])]
}
const statsText = ($: EngineInterface, path: string) => $.fs.read(path).then(text => String(text), () => '')

// ---- Stats: the kept files ----

// A map kept across files that each stay well under the 4 MB the engine reads and writes whole: <base>.json, then <base>.1.json and
// so on. The first says how many there are and holds what goes with the whole map (`head`). An entry stays in its file while that
// has room, so a change writes one file. `e` is the keeping's own mark (all.json's): a file with another is from a keeping that
// was started over, and reads as empty
const PART_MOST = 1_500_000
type Shards<T, H> = { base: string; head: H; of: Map<string, T>; home: Map<string, number>; lens: Map<string, number>; sizes: number[]; dirty: Set<number>; isBroken: boolean }
type PartFile<T, H> = { v?: number; e?: string; n?: number; head?: H; of?: Record<string, T> }
const partPath = (base: string, i: number) => (i ? `${base}.${i}.json` : `${base}.json`)
async function shardsRead<T, H>($: EngineInterface, base: string, epoch: string, head: H): Promise<Shards<T, H>> {
  const kept: Shards<T, H> = { base, head, of: new Map(), home: new Map(), lens: new Map(), sizes: [0], dirty: new Set(), isBroken: false }
  const text = await statsText($, partPath(base, 0))
  if (!text) return kept
  const first = parsed<PartFile<T, H> | undefined>(text, undefined)
  if (!first || typeof first !== 'object') return ((kept.isBroken = true), kept)
  if (first.v !== CACHE_V || first.e !== epoch) return kept
  const rest = await Promise.all(Array.from({ length: Math.max(0, (first.n ?? 1) - 1) }, (_, i) => statsText($, partPath(base, i + 1))))
  const parts = [first, ...rest.map(one => parsed<PartFile<T, H> | undefined>(one, undefined))]
  if (parts.some(one => !one || one.v !== CACHE_V || one.e !== epoch)) return ((kept.isBroken = true), kept)
  kept.head = first.head ?? head
  kept.sizes = [text.length, ...rest.map(one => one.length)]
  parts.forEach((part, i) => {
    for (const [key, value] of Object.entries(part?.of ?? {})) (kept.of.set(key, value), kept.home.set(key, i))
  })
  return kept
}
const shardSet = <T, H>(kept: Shards<T, H>, key: string, value: T | undefined) => {
  const home = kept.home.get(key)
  const was = kept.of.get(key)
  if (home !== undefined) ((kept.sizes[home] = (kept.sizes[home] ?? 0) - (was === undefined ? 0 : (kept.lens.get(key) ?? JSON.stringify(was).length + key.length + 4))), kept.dirty.add(home))
  if (value === undefined) return void (kept.of.delete(key), kept.home.delete(key), kept.lens.delete(key))
  const len = JSON.stringify(value).length + key.length + 4
  // Where it was while that file has room, else the first with room (an empty one takes anything), else a new one
  const fits = (i: number) => (kept.sizes[i] ?? 0) + len <= PART_MOST || (kept.sizes[i] ?? 0) < 100
  const found = home !== undefined && fits(home) ? home : kept.sizes.findIndex((_, i) => fits(i))
  const at = found < 0 ? (kept.dirty.add(0), kept.sizes.push(0) - 1) : found
  ;(kept.of.set(key, value), kept.home.set(key, at), kept.lens.set(key, len), (kept.sizes[at] = (kept.sizes[at] ?? 0) + len), kept.dirty.add(at))
}
async function shardsWrite<T, H>($: EngineInterface, kept: Shards<T, H>, epoch: string) {
  for (const i of [...kept.dirty].sort((a, b) => a - b)) {
    const of: Record<string, T> = {}
    for (const [key, at] of kept.home) if (at === i) of[key] = kept.of.get(key) as T
    await $.fs.write(partPath(kept.base, i), JSON.stringify(i ? { v: CACHE_V, e: epoch, of } : { v: CACHE_V, e: epoch, n: kept.sizes.length, head: kept.head, of }))
  }
  kept.dirty.clear()
}

// What goes with a chat's transcripts in its file: where its records are (or when they were last looked for and not found), its
// own tokens by day, the months its pieces of work are kept under, and whether its sums kept the old way are still there
type Head = { folder: string; sought?: number; cells: Record<string, TokenSums>; months: number[]; old?: 1 }
const headNew = (): Head => ({ folder: '', cells: {}, months: [] })
// stats/all.json: the keeping's mark; when the chats were last looked at, and all of them; where the look at a few quiet chats
// each time has got to; how many chats are counted; the chats changed in the last two days; every whole day's tokens and every
// whole month's sums, each with when its file was last written, so a copy held in a chat is known to be old; and how the months'
// files were made (`mv`): a keeping made before they held each helper's time has them made again from the chats' files, once
// (nothing is summed again)
const MONTHS_V = 1
type AllKept = { v: number; mv?: number; epoch: string; at: number; swept: number; cursor: string; counted: number; recent: Record<string, number>; days: Record<string, { rev: number; c: TokenSums }>; months: Record<string, { rev: number; part: Part }> }
const allNew = (now: number): AllKept => ({ v: CACHE_V, mv: MONTHS_V, epoch: `${now.toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`, at: 0, swept: 0, cursor: '', counted: 0, recent: {}, days: {}, months: {} })
async function allRead($: EngineInterface, memory: string) {
  const all = parsed<AllKept | undefined>(await statsText($, `${memory}/stats/all.json`), undefined)
  return all && all.v === CACHE_V && typeof all.epoch === 'string' && all.days && all.months ? all : undefined
}
// The day and month files this chat has read, each as its file last written: read again only when all.json says it was written since
type MonthOpen = { rev: number; kept: Shards<MonthKept, null>; read?: { pieces: Piece[]; turns: [number, number][] } }
const statsOpen = { epoch: '', days: new Map<number, { rev: number; rows: Shards<DayEntry, null> }>(), months: new Map<number, MonthOpen>() }
const statsOpened = <T,>(open: Map<number, T>, at: number, one: T, most: number) => {
  open.delete(at)
  open.set(at, one)
  for (const old of open.keys()) if (open.size > most) open.delete(old)
  return one
}
// A file all.json counts on that is gone or cut short: the keeping is started over (refreshNow)
const KEPT_BROKEN = 'kept files unreadable'
async function dayRead($: EngineInterface, memory: string, all: AllKept, day: number) {
  if (statsOpen.epoch !== all.epoch) ((statsOpen.epoch = all.epoch), statsOpen.days.clear(), statsOpen.months.clear())
  const rev = all.days[day]?.rev ?? 0
  const open = statsOpen.days.get(day)
  if (open && open.rev === rev) return open.rows
  const rows = await shardsRead<DayEntry, null>($, `${memory}/stats/days/${day}`, all.epoch, null)
  if (rows.isBroken || (rev && !rows.of.size)) throw new Error(KEPT_BROKEN)
  return statsOpened(statsOpen.days, day, { rev, rows }, 8).rows
}
async function monthRead($: EngineInterface, memory: string, all: AllKept, month: number) {
  if (statsOpen.epoch !== all.epoch) ((statsOpen.epoch = all.epoch), statsOpen.days.clear(), statsOpen.months.clear())
  const rev = all.months[month]?.rev ?? 0
  const open = statsOpen.months.get(month)
  if (open && open.rev === rev) return open
  const kept = await shardsRead<MonthKept, null>($, `${memory}/stats/months/${monthName(month)}`, all.epoch, null)
  if (kept.isBroken || (rev && !kept.of.size)) throw new Error(KEPT_BROKEN)
  return statsOpened<MonthOpen>(statsOpen.months, month, { rev, kept }, 30)
}
const monthPieces = (open: MonthOpen) => (open.read ??= { pieces: [...open.kept.of].flatMap(([chat, one]) => one.p.map(row => rowPiece(chat, row))), turns: [...open.kept.of.values()].flatMap(one => one.t) })

// ---- Stats: Claude's records, looked at again ----

// One chat at a time looks: a folder made in one step, which only one can make, holding when its maker last wrote to it. One left
// by a chat that closed mid-look is taken over after LOCK_STALE
const LOCK_STALE = 90_000
async function statsLock($: EngineInterface, memory: string, now: number) {
  const lock = `${memory}/stats/lock`
  const take = () =>
    runOn($, ['/bin/sh', '-c', 'mkdir -p "$1/chats" "$1/days" "$1/months" && mkdir "$2" 2>/dev/null && printf %s "$3" > "$2/at"', 'sh', `${memory}/stats`, lock, String(now)], { timeoutMs: 5000 }).then(r => r.exitCode === 0, () => false)
  if (await take()) return true
  if (now - Number(await statsText($, `${lock}/at`)) < LOCK_STALE) return false
  await runOn($, ['rm', '-rf', lock], { timeoutMs: 5000 }).catch(() => undefined)
  return take()
}
// One transcript of a chat, as looked at: what it was is read from its meta file, a workflow's title from the mod's own note of it
type Looked = { key: string; path: string; size: number; mtime: number; flow: string }
async function whatOf($: EngineInterface, f: Looked, flowTitle: string): Promise<What> {
  if (f.key === 'chat') return { kind: 'chat', parent: '', title: 'This chat', fin: false }
  const meta = parsed<Meta>(await statsText($, f.path.replace(/\.jsonl$/, '.meta.json')), {})
  if (f.flow) return { kind: 'flow', parent: f.flow, title: flowTitle, fin: Boolean(meta.finished), flow: f.flow }
  return { kind: (meta.spawnDepth ?? 1) > 1 ? 'helper' : 'work', parent: meta.parentAgentId ?? '', title: meta.description ?? 'Background task', fin: Boolean(meta.finished) }
}
// A chat as looked at: its file with what changed put in, the days whose responses changed (each transcript's of that day, or
// none), whether anything of it changed, when its newest transcript was written, and whether it had a thread of its own before
const OLD_KEPT_FOR = 3 * 86_400_000
type Checked = { id: string; index: Shards<Kept, Head>; days: { day: number; key: string; entry: DayEntry | undefined }[]; isChanged: boolean; last: number; hadMain: boolean }
const HOUR = 3_600_000
// Looks at one chat's transcripts: one whose file is as it was is not read, and one that changed is summed again, once. A
// transcript no longer there keeps what was kept of it. `isThorough` also reads again what an unfinished one that has been quiet
// for an hour says it was, and looks again for a chat whose records were not found
async function chatCheck($: EngineInterface, memory: string, chatId: string, hint: string, epoch: string, now: number, isThorough: boolean, isRemade = false): Promise<Checked> {
  const index = await shardsRead<Kept, Head>($, `${memory}/stats/chats/${chatId}`, epoch, headNew())
  // Sums kept the old way (stats/<chat>.json) are carried over the first time: none of what they hold is summed again. The file
  // is left as it is, as a chat still on an older Claudopus goes on reading and writing it, and removed once nothing has for days
  const oldPath = `${memory}/stats/${chatId}.json`
  const carried = index.of.size ? undefined : parsed<Cache | undefined>(await statsText($, oldPath), undefined)
  const old = carried?.v === 5 ? carried : undefined
  const checked: Checked = { id: chatId, index, days: [], isChanged: false, last: 0, hadMain: index.of.has('chat') }
  const head = index.head
  if (old && !head.old) ((head.old = 1), index.dirty.add(0))
  if (isThorough && head.old && index.of.size) {
    const left = await $.fs.stat(oldPath).catch(() => undefined)
    if (left && now - left.mtimeMs > OLD_KEPT_FOR) await runOn($, ['rm', '-f', oldPath], { timeoutMs: 5000 }).catch(() => undefined)
    if (!left || now - left.mtimeMs > OLD_KEPT_FOR) ((head.old = undefined), index.dirty.add(0))
  }
  const mainAt = (folder: string) => (folder ? $.fs.stat(`${folder}/${chatId}.jsonl`).catch(() => undefined) : Promise.resolve(undefined))
  let folder = hint
  let main = await mainAt(folder)
  for (const known of [head.folder, old?.folder ?? '']) if (!main && known && known !== folder) main = await mainAt((folder = known))
  // A chat whose records were not found is looked for again a day later, so records that were elsewhere still come to count
  const isSought = !main && !head.folder && (isThorough || !head.sought || now - head.sought >= DAY)
  if (isSought) main = await mainAt((folder = await chatFolderOf($, chatId)))
  if (!main) folder = head.folder
  if (!folder) {
    if (!head.sought || isSought) ((head.sought = now), index.dirty.add(0))
    return checked
  }
  if (head.folder !== folder || head.sought) ((index.head = { ...head, folder, sought: undefined }), index.dirty.add(0))
  const subs = `${folder}/${chatId}/subagents`
  const flowDirs = (await $.fs.list(`${subs}/workflows`).catch(() => [])).filter(e => e.kind === 'dir').map(e => e.name)
  const listed = [
    ...(await $.fs.list(subs).catch(() => [])).map(e => ({ ...e, dir: subs, flow: '' })),
    ...(await Promise.all(flowDirs.map(async name => (await $.fs.list(`${subs}/workflows/${name}`).catch(() => [])).map(e => ({ ...e, dir: `${subs}/workflows/${name}`, flow: name }))))).flat(),
  ].filter(e => /^agent-\w+\.jsonl$/.test(e.name))
  const files: Looked[] = [
    ...listed.map(e => ({ key: `${e.flow ? `${e.flow}/` : ''}${e.name.slice(0, -6)}`, path: `${e.dir}/${e.name}`, size: e.size, mtime: e.mtimeMs, flow: e.flow })),
    ...(main ? [{ key: 'chat', path: `${folder}/${chatId}.jsonl`, size: main.size, mtime: main.mtimeMs, flow: '' }] : []),
  ]
  const flowTitle = new Map<string, string>()
  for (const name of flowDirs) flowTitle.set(name, parsed<{ title?: string }>(await statsText($, `${memory}/flows/${name}.json`), {}).title || 'Workflow')
  const look = async (f: Looked) => {
    const was = index.of.get(f.key)
    const isSame = was !== undefined && was.size === f.size && was.mtime === f.mtime
    // What a finished transcript was never changes; nor does that of one quiet for an hour, until it is written to again
    const what: What =
      was && isSame && f.key !== 'chat' && (was.fin || (!isThorough && now - f.mtime > HOUR))
        ? { kind: was.kind, parent: was.parent, title: f.flow ? (flowTitle.get(f.flow) ?? 'Workflow') : was.title, fin: was.fin, ...(was.flow ? { flow: was.flow } : {}) }
        : await whatOf($, f, flowTitle.get(f.flow) ?? 'Workflow')
    if (was && isSame && was.kind === what.kind) {
      if (was.parent !== what.parent || was.title !== what.title || was.fin !== what.fin) (shardSet(index, f.key, { ...was, ...what }), (checked.isChanged = true))
      return
    }
    const kept5 = old?.files?.[f.path]
    const sum = kept5 && kept5.size === f.size && kept5.mtime === f.mtime ? kept5.sum : await sumOf($, f.path)
    const { kept, rows } = sumKept(sum, what, f.size, f.mtime)
    for (const day of new Set([...Object.keys(was?.days ?? {}), ...Object.keys(kept.days)])) {
      const [a, b] = [was?.days[day], kept.days[day]]
      if (!a || !b || a[0] !== b[0] || a[1] !== b[1]) checked.days.push({ day: Number(day), key: `${chatId} ${f.key}`, entry: rows.get(Number(day)) })
    }
    shardSet(index, f.key, kept)
    checked.isChanged = true
  }
  for (let at = 0; at < files.length; at += 12) await Promise.all(files.slice(at, at + 12).map(look))
  checked.last = files.reduce((last, f) => Math.max(last, f.mtime), 0)
  // (its months made again from what is kept of it)
  if (isRemade && index.of.size) checked.isChanged = true
  return checked
}
// Puts what a few chats' looks found into the kept files: each changed day's responses and its tokens, each changed month's pieces
// and its sums, then all.json, then the chats' own files, in that order, so a look cut short is only made again
async function statsApply($: EngineInterface, memory: string, all: AllKept, checked: Checked[], now: number, isRemade = false) {
  const byDay = new Map<number, Checked['days']>()
  for (const one of checked) for (const change of one.days) byDay.set(change.day, [...(byDay.get(change.day) ?? []), change])
  for (const [day, changes] of byDay) {
    const rows = await dayRead($, memory, all, day)
    for (const { key, entry } of changes) shardSet(rows, key, entry)
    const whole = Object.fromEntries(rows.of)
    if (rows.of.size) all.days[day] = { rev: now, c: dayCells(whole, day) }
    else delete all.days[day]
    for (const one of checked) {
      if (!changes.some(change => change.key.startsWith(`${one.id} `))) continue
      const own = dayCells(whole, day, -Infinity, one.id)
      if (Object.keys(own).length) one.index.head.cells[day] = own
      else delete one.index.head.cells[day]
      one.index.dirty.add(0)
    }
    await shardsWrite($, rows, all.epoch)
    statsOpened(statsOpen.days, day, { rev: all.days[day]?.rev ?? 0, rows }, 8)
  }
  const months = new Set<number>()
  for (const one of checked) {
    // A chat none of whose transcripts are there any more keeps the pieces kept of it
    if (!one.isChanged || !one.index.of.size) continue
    const { pieces, turns } = piecesKept(one.id, Object.fromEntries(one.index.of))
    const next = monthsKept(pieces, turns)
    for (const month of new Set([...one.index.head.months, ...next.keys()])) {
      const open = await monthRead($, memory, all, month)
      if (JSON.stringify(open.kept.of.get(one.id)) === JSON.stringify(next.get(month))) continue
      shardSet(open.kept, one.id, next.get(month))
      open.read = undefined
      months.add(month)
    }
    one.index.head.months = [...next.keys()]
    one.index.dirty.add(0)
  }
  // Every month's sums made again, those of chats whose files are gone too
  if (isRemade) for (const month of Object.keys(all.months)) months.add(Number(month))
  for (const month of months) {
    const open = await monthRead($, memory, all, month)
    const { pieces, turns } = monthPieces(open)
    if (open.kept.of.size) all.months[month] = { rev: now, part: partOf(piecesIn(pieces), turns, monthFrom(month), monthFrom(month + 1)) }
    else delete all.months[month]
    open.rev = all.months[month]?.rev ?? 0
    await shardsWrite($, open.kept, all.epoch)
  }
  for (const one of checked) {
    if (one.index.of.has('chat') !== one.hadMain) all.counted += one.hadMain ? -1 : 1
    if (one.last > now - 2 * DAY) all.recent[one.id] = one.last
  }
  for (const [id, last] of Object.entries(all.recent)) if (last <= now - 2 * DAY) delete all.recent[id]
  if (byDay.size || months.size || checked.some(one => one.isChanged)) await $.fs.write(`${memory}/stats/all.json`, JSON.stringify(all))
  for (const one of checked) if (one.index.dirty.size) await shardsWrite($, one.index, all.epoch)
}
// The chats a look at all of them goes through. Every one the first time, and when `isThorough`. Else this chat, the chats open
// now or since the last look (each writes its beat every few seconds), those changed in the last day, those never looked at, and
// a few of the quiet ones in turn, so that each is looked at again within the hour
const STATS_BATCH = 4
const SWEEP_EACH = 12
const SWEEP_EVERY = 10 * 60_000
async function chatsDue($: EngineInterface, memory: string, chatId: string, all: AllKept, now: number, isThorough: boolean) {
  const ids = await chatsKept($, memory, chatId)
  if (isThorough) return ids
  const have = new Set((await $.fs.list(`${memory}/stats/chats`).catch(() => [])).map(e => /^(.+?)(?:\.\d+)?\.json$/.exec(e.name)?.[1] ?? '').filter(Boolean))
  const open = new Set((await $.fs.list(`${memory}/keep`).catch(() => [])).filter(e => e.name.endsWith('.beat') && e.mtimeMs > all.at - 5 * 60_000).map(e => e.name.slice(0, -5)))
  const sorted = [...ids].sort()
  const after = Math.max(0, sorted.findIndex(id => id > all.cursor))
  const turn = new Set(Array.from({ length: Math.min(SWEEP_EACH, sorted.length) }, (_, i) => sorted[(after + i) % sorted.length] ?? ''))
  all.cursor = [...turn].at(-1) ?? ''
  return ids.filter(id => id === chatId || open.has(id) || !have.has(id) || (all.recent[id] ?? 0) > now - DAY || turn.has(id))
}
// Looks at Claude's records again and keeps what changed: this chat's alone, or the chats that may have changed. 'busy' when
// another chat is looking: what is kept is as new as that chat makes it
let statsLooking: Promise<unknown> = Promise.resolve()
const statsRefresh = ($: EngineInterface, memory: string, chatId: string, hint: string, scope: Scope, now: number, isLooking = false): Promise<'done' | 'busy'> => {
  const next = statsLooking.then(() => refreshNow($, memory, chatId, hint, scope, now, isLooking))
  statsLooking = next.catch(() => undefined)
  return next
}
async function refreshNow($: EngineInterface, memory: string, chatId: string, hint: string, scope: Scope, now: number, isLooking: boolean): Promise<'done' | 'busy'> {
  if (!(await statsLock($, memory, now))) return 'busy'
  const pass = async (all: AllKept, isNew: boolean) => {
    // Every chat the first time; and again when Stats is open on all of them and that was not done in the last ten minutes
    const isThorough = scope === 'all' && (!all.swept || (isLooking && now - all.swept >= SWEEP_EVERY))
    // Months made before they held each helper's time are made again from every chat's file, once
    const isRemade = all.mv !== MONTHS_V
    const ids = isRemade ? await chatsKept($, memory, chatId) : scope === 'all' ? await chatsDue($, memory, chatId, all, now, isThorough) : [chatId]
    let saidAt = now
    for (let at = 0; at < ids.length; at += STATS_BATCH) {
      const checked = await Promise.all(ids.slice(at, at + STATS_BATCH).map(id => chatCheck($, memory, id, id === chatId ? hint : '', all.epoch, now, isThorough || (scope === 'chat' && id === chatId), isRemade)))
      await statsApply($, memory, all, checked, now, isRemade && at + STATS_BATCH >= ids.length)
      // A long look says it is still at it, so no other chat takes it over
      const clock = await $.clock.now()
      if (clock - saidAt >= LOCK_STALE / 4) ((saidAt = clock), await $.fs.write(`${memory}/stats/lock/at`, String(clock)).catch(() => undefined))
    }
    if (isRemade) ((all.mv = MONTHS_V), await log($, `stats: the months were made again from ${ids.length} chats, with each helper's time`))
    // A chat with nothing to keep yet still has its figures: none
    if (scope !== 'all') return void ((isNew || isRemade) && (await $.fs.write(`${memory}/stats/all.json`, JSON.stringify(all))))
    ;((all.at = now), isThorough && (all.swept = now))
    await $.fs.write(`${memory}/stats/all.json`, JSON.stringify(all))
  }
  try {
    const had = await allRead($, memory)
    await pass(had ?? allNew(now), !had).catch(async err => {
      if (!String(err).includes(KEPT_BROKEN)) throw err
      // Started over under a new mark: every kept file with the old one reads as empty, and every chat is summed again
      await log($, 'stats: a kept file was gone or cut short, so the sums are made again')
      ;(statsOpen.days.clear(), statsOpen.months.clear())
      await pass(allNew(now), true)
    })
    return 'done'
  } finally {
    await runOn($, ['rm', '-rf', `${memory}/stats/lock`], { timeoutMs: 5000 }).catch(() => undefined)
  }
}

// ---- Stats: the figures, from what is kept ----

// What is kept, read as far as ranges beginning at `froms` need: the day each begins in, the month each begins in, and this
// month (where work still running is); with `isWhole`, every month from the earliest on, for the timeline. Undefined until every
// chat has been looked at once
type StatsRead = { kept: Loaded; chats: number; all: AllKept }
async function statsFor($: EngineInterface, memory: string, chatId: string, scope: Scope, froms: number[], now: number, isWhole: boolean): Promise<StatsRead | undefined> {
  const all = await allRead($, memory)
  if (!all || (scope === 'all' && !all.swept)) return undefined
  const edges = new Map<number, DayRows>()
  const edgesOf = async (cells: Record<string, unknown>) => {
    for (const from of froms) {
      const day = dayNo(from)
      if (cells[day] && from > day * DAY && !edges.has(day)) edges.set(day, Object.fromEntries((await dayRead($, memory, all, day)).of))
    }
  }
  if (scope === 'chat') {
    const index = await shardsRead<Kept, Head>($, `${memory}/stats/chats/${chatId}`, all.epoch, headNew())
    const { pieces, turns } = piecesKept(chatId, Object.fromEntries(index.of))
    const months = new Map([...monthsKept(pieces, turns)].map(([month, one]) => [month, { pieces: one.p.map(row => rowPiece(chatId, row)), turns: one.t }]))
    await edgesOf(index.head.cells)
    return { kept: { cells: index.head.cells, edge: (day, from) => dayCells(edges.get(day) ?? {}, day, from, chatId), parts: {}, months, first: chatId }, chats: 1, all }
  }
  await edgesOf(all.days)
  const begins = froms.map(from => monthNo(Math.max(0, from)))
  const months = new Map<number, { pieces: Piece[]; turns: [number, number][] }>()
  for (const month of Object.keys(all.months).map(Number)) if (isWhole ? month >= Math.min(...begins) : begins.includes(month) || month >= monthNo(now - GAP)) months.set(month, monthPieces(await monthRead($, memory, all, month)))
  const cells = Object.fromEntries(Object.entries(all.days).map(([day, one]) => [day, one.c]))
  const parts = Object.fromEntries(Object.entries(all.months).map(([month, one]) => [month, one.part]))
  return { kept: { cells, edge: (day, from) => dayCells(edges.get(day) ?? {}, day, from), parts, months, first: chatId }, chats: all.counted, all }
}
// The figures the tab shows, added up from what is kept: today, 7 and 30 days each time, all time once it has been asked for
async function statsShow($: EngineInterface, scope: Scope, memory: string, chatId: string, now: number) {
  const was = held.get(scope)
  const ranges = RANGES.filter(range => range !== 'all' || statsShown.range === 'all' || was?.shown.all)
  const got = await statsFor($, memory, chatId, scope, ranges.map(range => rangeFrom(range, now)), now, true)
  if (!got) return false
  const shown: Held['shown'] = {}
  for (const range of ranges) shown[range] = statsFrom(got.kept, rangeFrom(range, now), now)
  held.set(scope, { shown, svgs: new Map(), chats: got.chats, at: held.get(scope)?.at ?? 0 })
  return true
}
// The tab's figures: drawn at once from what is kept, then Claude's records are looked at again, at most once a minute, and the
// figures drawn again from what that changed
const MEMORY_EVERY = 5 * 60_000
let memoryReadAt = 0
async function loadStats($: EngineInterface, scope: Scope, memory: string, chatId: string, hint: string, now: number) {
  if (reading.has(scope) || !chatId) return
  const was = held.get(scope)
  const isDue = !was || now - was.at >= READ_EVERY
  if (!isDue && was.shown[statsShown.range]) return
  reading.add(scope)
  try {
    if (now - memoryReadAt >= MEMORY_EVERY) ((memoryReadAt = now), void loadMemorySizes($, memory).then(() => drawAgain($), () => undefined))
    if (!was?.shown[statsShown.range] && (await statsShow($, scope, memory, chatId, now))) drawAgain($)
    if (!isDue) return
    const looked = await statsRefresh($, memory, chatId, hint, scope, now, true)
    await statsShow($, scope, memory, chatId, now)
    // While another chat is looking, this one asks again in a few seconds
    held.set(scope, { ...(held.get(scope) ?? { shown: {}, svgs: new Map(), chats: 0 }), at: looked === 'busy' ? now - READ_EVERY + 5000 : now, error: undefined })
    if (looked === 'busy') $.clock.after(5000, () => drawAgain($))
  } catch (err) {
    held.set(scope, { ...(held.get(scope) ?? { shown: {}, svgs: new Map(), chats: 0 }), at: now, error: String(err).includes('jq') ? `Claudopus couldn’t read Claude’s logs because jq isn’t installed on ${thisMac()}. Install jq, then open Stats again.` : `Claudopus couldn’t read Claude’s logs: ${String(err)}. Open Stats again to try once more.` })
  } finally {
    reading.delete(scope)
    drawAgain($)
  }
}
async function loadMemorySizes($: EngineInterface, memory: string) {
  const names = async (folder: string) => (await $.fs.list(`${memory}/${folder}`).catch(() => [])).filter(e => !e.name.startsWith('.'))
  // Sizes as the disk counts them, the whole of each folder
  const du = await runOn($, ['du', '-skL', ...['index.md', 'streams', 'words', 'asks', 'reports', 'finished', 'flows', 'stats', 'thumbs'].map(one => `${memory}/${one}`)]).catch(() => undefined)
  const kb = new Map((du?.stdout ?? '').split('\n').map(row => row.split('\t')).filter(([n, path]) => n && path).map(([n, path]) => [String(path).slice(memory.length + 1), Number(n) * 1024]))
  const index = await $.fs.read(`${memory}/index.md`).catch(() => '')
  const subjects = index.split('\n').filter(row => row.startsWith('- ')).length
  const reports = await names('reports')
  const parts: MemoryPart[] = [
    { name: 'Topics', count: subjects, bytes: kb.get('index.md') ?? 0 },
    { name: 'Topic notes', count: (await names('streams')).length, bytes: kb.get('streams') ?? 0 },
    { name: 'Your words, by chat', count: (await names('words')).length, bytes: kb.get('words') ?? 0 },
    { name: 'Questions and answers, by chat', count: (await names('asks')).length, bytes: kb.get('asks') ?? 0 },
    { name: 'Results', count: reports.filter(e => e.kind === 'dir').length, bytes: kb.get('reports') ?? 0 },
    { name: 'Finished tasks, by chat', count: (await names('finished')).length, bytes: kb.get('finished') ?? 0 },
    { name: 'Workflows', count: (await names('flows')).length, bytes: kb.get('flows') ?? 0 },
    { name: 'Picture previews and Stats', count: (await names('thumbs')).length + (await names('stats')).length, bytes: (kb.get('thumbs') ?? 0) + (kb.get('stats') ?? 0) },
  ]
  const bytes = [...kb.values()].reduce((sum, n) => sum + n, 0)
  memoryHeld.now = { parts, bytes }
}

// Stats: what the work added up to, in a tab of its own, opened in front like Results
const STATS_PANE = 'stats'
const STATS_TITLE = 'Stats'
const statsHint = async ($: EngineInterface) => projectDirOf($, cwd, (await read($, me)).id)
const statsRead = async ($: EngineInterface, scope: 'chat' | 'all') => {
  const { id } = await read($, me)
  await loadStats($, scope, dir, id, await statsHint($), await $.clock.now())
}
const openStats = async ($: EngineInterface) => {
  presses += 1
  void statsRead($, statsShown.scope).catch(err => log($, `stats not read: ${String(err)}`))
  await front($, STATS_PANE, STATS_TITLE)
}
const statsButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="stats-button" flexShrink={0}>
    <ui.Button key={`stats-open-${presses}`} label="Stats" hotkey={isKeyed ? 's' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openStats($).catch(err => log($, `stats not opened: ${String(err)}`))} />
  </ui.Box>
)

// ---- The leaderboard on claudopus.ai ----
// Opt in: nothing about the person leaves this Mac until they join from Stats with a username nobody has. Joining returns a secret
// kept in leaderboard.json in the memory folder; with it Claudopus sends the person's sums (never a title, a path or a word anyone
// wrote: boardRange) every few minutes and only what changed, from one chat at a time, and Leave takes the row off the board at once. The board is a Supabase
// project's lb_* functions (supabase/leaderboard.sql), reached with its publishable key, which is public by design
const BOARD_SITE = 'https://claudopus.ai/leaderboard'
const BOARD_API = 'https://wezffxcyofkyhoowwjwi.supabase.co/rest/v1/rpc'
const BOARD_KEY = 'sb_publishable_uUNtBu-IkFqW09L45yy4ig_Ap9KqT-U'
const BOARD_EVERY = 3 * 60_000
type BoardFile = { name?: string; token?: string; isPublic?: boolean; isTimelinePublic?: boolean; sentAt?: number }
const boardNow: { file: BoardFile; said: string; isBusy: boolean; waiting: number; turn: Promise<unknown> } = { file: {}, said: '', isBusy: false, waiting: 0, turn: Promise.resolve() }
const boardPath = () => `${dir}/leaderboard.json`
const boardLoad = async ($: EngineInterface) => (boardNow.file = parsed<BoardFile>(await readOr($, boardPath()), {}))
const boardSave = async ($: EngineInterface, file: BoardFile) => {
  boardNow.file = file
  await $.fs.write(boardPath(), JSON.stringify(file))
}
// One call of the board's functions: curl with the body on its standard input, the status on the last line
const boardCall = async ($: EngineInterface, fn: string, args: Record<string, unknown>) => {
  const r = await runOn($, ['curl', '-q', '-sS', '-m', '20', '-X', 'POST', '-H', `apikey: ${BOARD_KEY}`, '-H', 'Content-Type: application/json', '--data-binary', '@-', '-w', '\n%{http_code}', `${BOARD_API}/${fn}`], {
    stdin: JSON.stringify(args),
    timeoutMs: 25_000,
  }).catch(() => ({ exitCode: 1, stdout: '' }))
  const text = r.stdout ?? ''
  const cut = text.lastIndexOf('\n')
  const status = Number(text.slice(cut + 1)) || 0
  return { ok: r.exitCode === 0 && status >= 200 && status < 300, status, body: parsed<unknown>(cut > 0 ? text.slice(0, cut) : '', undefined) }
}
// The person's sums over every range, from what is kept of every chat's records, looked at again first unless `isHeld`; the
// timeline only while they make it public. Undefined while the records have never all been read (another chat is at it)
const boardFigures = async ($: EngineInterface, isTimelinePublic: boolean, isHeld = false): Promise<BoardSent | undefined> => {
  const { id } = await read($, me)
  const now = await $.clock.now()
  if (!isHeld) await statsRefresh($, dir, id, await statsHint($), 'all', now).catch(err => log($, `stats not read for the leaderboard: ${String(err)}`))
  const since = await installedAt($)
  const got = await statsFor($, dir, id, 'all', RANGES.map(range => boardFrom(range, now, since)), now, false)
  if (!got) return undefined
  const figures: BoardSent = {}
  for (const range of RANGES) figures[range] = boardRange(statsFrom(got.kept, boardFrom(range, now, since), now))
  if (!isTimelinePublic) return figures
  // The newest tasks, as many as the timeline holds: older months are read only until it is full
  for (;;) {
    const s = statsFrom(got.kept, boardFrom('all', now, since), now)
    figures.timeline = timelineOf(s.pieces, s.time.first, s.starts)
    const older = Object.keys(got.all.months).map(Number).filter(month => month >= monthNo(boardFrom('all', now, since)) && !got.kept.months.has(month)).sort((a, b) => b - a)[0]
    const starts = s.pieces.map(p => p.spans[0]?.[0] ?? 0).sort((a, b) => b - a)
    if (older === undefined || (figures.timeline.pieces.length < s.pieces.length && (starts[figures.timeline.pieces.length - 1] ?? 0) >= monthFrom(older + 1))) return figures
    got.kept.months.set(older, monthPieces(await monthRead($, dir, got.all, older)))
  }
}
// When Claudopus was first installed on this Mac, kept in installed.json: the first time asked, the memory folder's own birth (it is
// made by the first load), else now. The board counts nothing from before it
const installedAt = async ($: EngineInterface) => {
  const kept = parsed<{ at?: number }>(await readOr($, `${dir}/installed.json`), {}).at
  if (typeof kept === 'number' && kept > 0) return kept
  const born = await runOn($, isLinux || isWindows ? ['stat', '-c', '%W', dir] : ['stat', '-f', '%B', dir], { timeoutMs: 5000 }).catch(() => undefined)
  const seconds = Number(born?.stdout.trim())
  const at = seconds > 0 ? seconds * 1000 : await $.clock.now()
  await $.fs.write(`${dir}/installed.json`, JSON.stringify({ at })).catch(() => undefined)
  return at
}
const UNREACHED = 'Couldn’t reach the leaderboard. Try again in a minute.'
// The board's calls, one at a time in the order made: a press never waits on a call it can't see, nor is dropped for one (on 0.2.261
// a Join pressed while one was on its way did nothing at all)
const boardInTurn = <T,>($: EngineInterface, call: () => Promise<T>): Promise<T> => {
  ;((boardNow.waiting += 1), (boardNow.isBusy = true))
  const done = () => void ((boardNow.waiting -= 1), (boardNow.isBusy = boardNow.waiting > 0), drawAgain($))
  const r = boardNow.turn.then(call)
  boardNow.turn = r.then(done, done)
  return r
}
// A press: what it is doing shows at once, then what it came to
const boardAct = ($: EngineInterface, doing: string, act: () => Promise<string>) => {
  ;((boardNow.said = doing), drawAgain($))
  return boardInTurn($, async () => {
    ;((boardNow.said = doing), drawAgain($))
    try {
      boardNow.said = await act()
    } catch (err) {
      ;((boardNow.said = UNREACHED), log($, `leaderboard: ${String(err)}`))
    } finally {
      void readBoard($, true).catch(() => undefined)
    }
  })
}
// Joining sends the figures read last, so it answers in a moment; the full figures follow straight after, and the board is read again
const joinBoard = ($: EngineInterface, name: string) => {
  if (!NAME_RULE.test(name)) return void ((boardNow.said = 'A username is 3 to 20 letters, digits, - or _, with no spaces.'), drawAgain($))
  return boardAct($, `Joining as ${name}…`, async () => {
    if (boardNow.file.token) return boardNow.said
    const r = await boardCall($, 'lb_join', { p_name: name, p_public: false, p_stats: (await boardFigures($, false, true)) ?? {} })
    if (r.status === 409) return `Someone already has the username ${name}. Choose another.`
    if (!r.ok || typeof r.body !== 'string') return UNREACHED
    await boardSave($, { name, token: r.body, isPublic: false, sentAt: await $.clock.now() })
    await $.fs.write(boardSentPath(), '{}').catch(() => undefined)
    const joined = `✓ You joined as ${name}. Your stats are private until you make them public.`
    ;((boardNow.said = joined), drawAgain($))
    void readBoard($, true).catch(() => undefined)
    await pushBoard($, false, false)
    return joined
  })
}
const leaveBoard = ($: EngineInterface) =>
  boardAct($, 'Taking you off the leaderboard…', async () => {
    const r = await boardCall($, 'lb_leave', { p_token: boardNow.file.token ?? '' })
    if (!r.ok) return 'Couldn’t reach the leaderboard, so you’re still on it. Press Leave again in a minute.'
    await boardSave($, {})
    await $.fs.write(boardSentPath(), '{}').catch(() => undefined)
    return '✓ You left the leaderboard. Your figures are gone from it.'
  })
// Whether the timeline is public: as the stats are, for a file from before it had a switch of its own
const timelineShown = (file: BoardFile) => Boolean(file.isTimelinePublic ?? file.isPublic)
// Sends the board what changed since it was last sent (boardDelta), and whether the stats and the timeline are public; nothing at
// all when nothing did. What the board then holds is kept in leaderboard-sent.json with the mark it was sent under: the board
// takes a change only on top of that mark, and asks for everything ('full') when it holds something else, as after a send from
// an older Claudopus or one whose answer was lost. A secret the board no longer knows (left from another Mac) clears this one too
const boardSentPath = () => `${dir}/leaderboard-sent.json`
const pushBoard = async ($: EngineInterface, isPublic: boolean, isTimelinePublic: boolean) => {
  const file = boardNow.file
  const figures = await boardFigures($, isTimelinePublic)
  if (!figures) return 'failed' as const
  const sent = parsed<{ rev?: string; stats?: BoardSent }>(await statsText($, boardSentPath()), {})
  const send = async (was: BoardSent | undefined) => {
    const changed = boardDelta(was, figures)
    if (was && !Object.keys(changed).length && Boolean(file.isPublic) === isPublic && timelineShown(file) === isTimelinePublic) return 'ok'
    const rev = `${(await $.clock.now()).toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`
    const r = await boardCall($, 'lb_send', { p_token: file.token ?? '', p_public: isPublic, p_timeline: isTimelinePublic, p_was: was ? (sent.rev ?? '') : null, p_now: rev, p_stats: changed })
    if (r.ok && r.body === 'ok') await $.fs.write(boardSentPath(), JSON.stringify({ rev, stats: figures })).catch(() => undefined)
    return r.ok ? r.body : undefined
  }
  const first = await send(sent.rev && sent.stats ? sent.stats : undefined)
  const said = first === 'full' ? await send(undefined) : first
  if (said === 'gone') return (await boardSave($, {}), await $.fs.write(boardSentPath(), '{}').catch(() => undefined), 'gone' as const)
  if (said !== 'ok') return 'failed' as const
  await boardSave($, { ...file, isPublic, isTimelinePublic, sentAt: await $.clock.now() })
  return 'sent' as const
}
const publicBoard = ($: EngineInterface, what: 'stats' | 'timeline', isPublic: boolean) =>
  boardAct($, `Making your ${what} ${isPublic ? 'public' : 'private'}…`, async () => {
    const file = boardNow.file
    const r = await pushBoard($, what === 'stats' ? isPublic : Boolean(file.isPublic), what === 'timeline' ? isPublic : timelineShown(file))
    return r === 'gone' ? 'You’re no longer on the leaderboard. Choose a username to join again.' : r === 'failed' ? UNREACHED : `✓ Your ${what} ${what === 'stats' ? 'are' : 'is'} ${isPublic ? 'public' : 'private'}.`
  })
// Every few minutes, from whichever chat comes first: the time sent is written before sending, so the other chats leave it
const sendBoard = async ($: EngineInterface) => {
  const file = await boardLoad($)
  const now = await $.clock.now()
  if (!file.token || boardNow.isBusy || now - (file.sentAt ?? 0) < BOARD_EVERY) return
  await boardSave($, { ...file, sentAt: now })
  await boardInTurn($, () => (boardNow.file.token ? pushBoard($, Boolean(boardNow.file.isPublic), timelineShown(boardNow.file)) : Promise.resolve('gone' as const)))
}
const openSite = async ($: EngineInterface, name = '') => {
  const r = await openOn($, name ? `${BOARD_SITE}/${encodeURIComponent(name)}` : BOARD_SITE)
  if (r.exitCode !== 0) log($, `leaderboard not opened: ${'stderr' in r ? String(r.stderr) : ''}`)
}
// The board as the Leaderboard tab shows it: the top 10 of the range chosen, read again at most every 30 seconds while the tab is drawn
const BOARD_PANE = 'leaderboard'
const BOARD_TITLE = 'Leaderboard'
const BOARD_READ_EVERY = 30_000
const boardTop: { range: Range; rows?: BoardRow[]; total: number; at: number; error: string; isReading: boolean } = { range: 'd7', total: 0, at: 0, error: '', isReading: false }
const readBoard = async ($: EngineInterface, isNow = false) => {
  const now = await $.clock.now()
  if (boardTop.isReading || (!isNow && now - boardTop.at < BOARD_READ_EVERY)) return
  boardTop.isReading = true
  const range = boardTop.range
  try {
    const r = await boardCall($, 'lb_board', { p_range: range, p_sort: 'work' })
    if (range !== boardTop.range) return
    if (!r.ok || !Array.isArray(r.body)) return void (boardTop.error = 'Couldn’t reach the leaderboard. Claudopus tries again in 30 seconds.')
    const n = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : 0)
    const rows = (r.body as Record<string, unknown>[]).map((one): BoardRow => {
      const f = (one.f ?? {}) as Record<string, unknown>
      return { rank: n(one.rank), name: String(one.name ?? '').slice(0, 20), isPublic: one.is_public === true, work: n(f.work), clock: n(f.clock), model: typeof one.model === 'string' ? one.model : '' }
    })
    ;((boardTop.rows = rows), (boardTop.total = n((r.body as Record<string, unknown>[])[0]?.total)), (boardTop.error = ''))
  } finally {
    ;((boardTop.isReading = false), (boardTop.at = now), drawAgain($))
  }
}
const openBoard = async ($: EngineInterface) => {
  presses += 1
  void readBoard($).catch(err => log($, `leaderboard not read: ${String(err)}`))
  await front($, BOARD_PANE, BOARD_TITLE)
}
const boardShown = ($: EngineInterface): BoardShown => ({
  rows: boardTop.rows,
  total: boardTop.total,
  error: boardTop.error,
  range: boardTop.range,
  setRange: range => void ((boardTop.range = range), (boardTop.rows = undefined), drawAgain($), readBoard($, true).catch(err => log($, `leaderboard not read: ${String(err)}`))),
  openPerson: name => void openSite($, name).catch(err => log($, `leaderboard not opened: ${String(err)}`)),
  name: boardNow.file.name ?? '',
  isPublic: Boolean(boardNow.file.isPublic),
  isTimelinePublic: timelineShown(boardNow.file),
  said: boardNow.said,
  isBusy: boardNow.isBusy,
  join: name => void joinBoard($, name),
  leave: () => void leaveBoard($),
  setPublic: isPublic => void publicBoard($, 'stats', isPublic),
  setTimelinePublic: isPublic => void publicBoard($, 'timeline', isPublic),
  open: () => void openSite($).catch(err => log($, `leaderboard not opened: ${String(err)}`)),
})
const boardButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="board-button" flexShrink={0}>
    <ui.Button key={`board-open-${presses}`} label="Leaderboard" hotkey={isKeyed ? 'l' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openBoard($).catch(err => log($, `leaderboard not opened: ${String(err)}`))} />
  </ui.Box>
)
