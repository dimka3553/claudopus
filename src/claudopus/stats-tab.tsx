// Stats: reading Claude's records for the Stats tab (the sums and drawing are in ../../mods/claudopus/hooks/stats.tsx)

// ---- Stats: reading Claude's records (the sums and drawing are in ./stats) ----

let jqPath = ''
async function sumOf($: EngineInterface, path: string): Promise<FileSum> {
  for (const jq of jqPath ? [jqPath] : ['/usr/bin/jq', '/opt/homebrew/bin/jq', '/usr/local/bin/jq', 'jq']) {
    const r = await $.process.run([jq, '-cnR', '--argjson', 'gap', String(GAP), SUM_JQ, path]).catch(() => undefined)
    if (!r || r.exitCode !== 0) continue
    jqPath = jq
    return parsed<FileSum>(r.stdout.trim(), { s: [], u: [], d: [] })
  }
  throw new Error('jq')
}
// Where a chat's records are: its own folder under ~/.claude/projects, found by its id
async function chatFolderOf($: EngineInterface, home: string, chatId: string, known?: string) {
  if (known && (await $.fs.stat(`${known}/${chatId}.jsonl`).catch(() => undefined))) return known
  const root = `${home}/.claude/projects`
  for (const entry of await $.fs.list(root).catch(() => [])) {
    if (entry.kind !== 'dir') continue
    if (await $.fs.stat(`${root}/${entry.name}/${chatId}.jsonl`).catch(() => undefined)) return `${root}/${entry.name}`
  }
  return ''
}
// Every transcript of one chat, summed, with what each was
async function runsOf($: EngineInterface, home: string, memory: string, chatId: string, hint = ''): Promise<Run[]> {
  const cachePath = `${memory}/stats/${chatId}.json`
  const read = parsed<Cache>(await readOr($, cachePath), { files: {} })
  // Sums made by an earlier program are made again
  const cache: Cache = read.v === CACHE_V ? read : { files: {} }
  const folder = await chatFolderOf($, home, chatId, hint || cache.folder)
  if (!folder) return []
  const subs = `${folder}/${chatId}/subagents`
  const flowDirs = (await $.fs.list(`${subs}/workflows`).catch(() => [])).filter(e => e.kind === 'dir').map(e => e.name)
  const listed = [
    ...(await $.fs.list(subs).catch(() => [])).map(e => ({ ...e, dir: subs, flow: '' })),
    ...(await Promise.all(flowDirs.map(async name => (await $.fs.list(`${subs}/workflows/${name}`).catch(() => [])).map(e => ({ ...e, dir: `${subs}/workflows/${name}`, flow: name }))))).flat(),
  ].filter(e => /^agent-\w+\.jsonl$/.test(e.name))
  const chatFile = (await $.fs.list(folder).catch(() => [])).find(e => e.name === `${chatId}.jsonl`)
  const files = [...listed.map(e => ({ path: `${e.dir}/${e.name}`, size: e.size, mtime: e.mtimeMs, flow: e.flow, id: e.name.slice(6, -6) })), ...(chatFile ? [{ path: `${folder}/${chatFile.name}`, size: chatFile.size, mtime: chatFile.mtimeMs, flow: '', id: '' }] : [])]
  const next: Cache = { v: CACHE_V, folder, files: {} }
  let isChanged = folder !== cache.folder
  // A few at a time: each is a process
  for (let at = 0; at < files.length; at += 6)
    await Promise.all(
      files.slice(at, at + 6).map(async f => {
        const was = cache.files[f.path]
        if (was && was.size === f.size && was.mtime === f.mtime) next.files[f.path] = was
        else {
          next.files[f.path] = { size: f.size, mtime: f.mtime, sum: await sumOf($, f.path) }
          isChanged = true
        }
      }),
    )
  if (isChanged || Object.keys(cache.files).length !== files.length) await $.fs.write(`${memory}/stats/${chatId}.json`, JSON.stringify(next)).catch(() => undefined)
  const flowTitle = new Map<string, string>()
  for (const name of flowDirs) flowTitle.set(name, parsed<{ title?: string; name?: string }>(await readOr($, `${memory}/flows/${name}.json`), {}).title || 'Workflow')
  return Promise.all(
    files.map(async (f): Promise<Run> => {
      const sum = next.files[f.path]?.sum ?? { s: [], u: [], d: [] }
      if (!f.id) return { id: chatId, kind: 'chat', parent: '', title: 'This chat', isFinished: false, sum }
      const meta = parsed<Meta>(await readOr($, f.path.replace(/\.jsonl$/, '.meta.json')), {})
      if (f.flow) return { id: f.id, kind: 'flow', parent: f.flow, title: flowTitle.get(f.flow) ?? 'Workflow', isFinished: Boolean(meta.finished) || (sum.s.at(-1)?.[1] ?? 0) < Date.now() - GAP, sum }
      return { id: f.id, kind: (meta.spawnDepth ?? 1) > 1 ? 'helper' : 'work', parent: meta.parentAgentId ?? '', title: meta.description ?? 'Background task', isFinished: Boolean(meta.finished), sum }
    }),
  )
}
// The chats the mod has kept work for (finished/<chat id>.json), and this one
async function chatsKept($: EngineInterface, memory: string, chatId: string) {
  const kept = (await $.fs.list(`${memory}/finished`).catch(() => [])).map(e => /^(.+)\.json$/.exec(e.name)?.[1] ?? '').filter(Boolean)
  return [...new Set([chatId, ...kept])]
}

async function loadStats($: EngineInterface, scope: Scope, home: string, memory: string, chatId: string, hint: string, now: number) {
  if (reading.has(scope) || !chatId) return
  const was = held.get(scope)
  if (was && now - was.at < READ_EVERY) return
  reading.add(scope)
  try {
    await loadMemorySizes($, memory).catch(() => undefined)
    const ids = scope === 'chat' ? [chatId] : await chatsKept($, memory, chatId)
    const runs = (await Promise.all(ids.map(id => runsOf($, home, memory, id, id === chatId ? hint : '')))).flat()
    held.set(scope, { runs, at: now })
  } catch (err) {
    held.set(scope, { runs: was?.runs ?? [], at: now, error: String(err).includes('jq') ? `Claudopus couldn’t read Claude’s logs because jq isn’t installed on ${thisMac()}. Install jq, then open Stats again.` : `Claudopus couldn’t read Claude’s logs: ${String(err)}. Open Stats again to try once more.` })
  } finally {
    reading.delete(scope)
    drawAgain($)
  }
}
async function loadMemorySizes($: EngineInterface, memory: string) {
  const names = async (folder: string) => (await $.fs.list(`${memory}/${folder}`).catch(() => [])).filter(e => !e.name.startsWith('.'))
  // Sizes as the disk counts them, the whole of each folder
  const du = await $.process.run(['du', '-skL', ...['index.md', 'streams', 'words', 'asks', 'reports', 'finished', 'flows', 'stats', 'thumbs'].map(one => `${memory}/${one}`)]).catch(() => undefined)
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
const statsRead = async ($: EngineInterface, scope: 'chat' | 'all') => {
  const home = (await $.env.get('HOME')) ?? ''
  const { id } = await read($, me)
  await loadStats($, scope, home, dir, id, `${home}/.claude/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}`, await $.clock.now())
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
// wrote: boardOf) every few minutes, from one chat at a time, and Leave takes the row off the board at once. The board is a Supabase
// project's lb_* functions (supabase/leaderboard.sql), reached with its publishable key, which is public by design
const BOARD_SITE = 'https://claudopus.ai/leaderboard'
const BOARD_API = 'https://wezffxcyofkyhoowwjwi.supabase.co/rest/v1/rpc'
const BOARD_KEY = 'sb_publishable_uUNtBu-IkFqW09L45yy4ig_Ap9KqT-U'
const BOARD_EVERY = 3 * 60_000
type BoardFile = { name?: string; token?: string; isPublic?: boolean; sentAt?: number }
const boardNow: { file: BoardFile; said: string; isBusy: boolean } = { file: {}, said: '', isBusy: false }
const boardPath = () => `${dir}/leaderboard.json`
const boardLoad = async ($: EngineInterface) => (boardNow.file = parsed<BoardFile>(await readOr($, boardPath()), {}))
const boardSave = async ($: EngineInterface, file: BoardFile) => {
  boardNow.file = file
  await $.fs.write(boardPath(), JSON.stringify(file))
}
// One call of the board's functions: curl with the body on its standard input, the status on the last line
const boardCall = async ($: EngineInterface, fn: string, args: Record<string, unknown>) => {
  const r = await $.process
    .run(['curl', '-q', '-sS', '-m', '20', '-X', 'POST', '-H', `apikey: ${BOARD_KEY}`, '-H', 'Content-Type: application/json', '--data-binary', '@-', '-w', '\n%{http_code}', `${BOARD_API}/${fn}`], { stdin: JSON.stringify(args), timeoutMs: 25_000 })
    .catch(() => ({ exitCode: 1, stdout: '' }))
  const text = r.stdout ?? ''
  const cut = text.lastIndexOf('\n')
  const status = Number(text.slice(cut + 1)) || 0
  return { ok: r.exitCode === 0 && status >= 200 && status < 300, status, body: parsed<unknown>(cut > 0 ? text.slice(0, cut) : '', undefined) }
}
// The person's sums over every range, from every chat's records
const boardFigures = async ($: EngineInterface) => {
  await statsRead($, 'all').catch(() => undefined)
  const runs = held.get('all')?.runs ?? []
  const since = await installedAt($)
  return { ...boardOf(runs, await $.clock.now(), since), timeline: timelineOf(runs, 40_000, since) }
}
// When Claudopus was first installed on this Mac, kept in installed.json: the first time asked, the memory folder's own birth (it is
// made by the first load), else now. The board counts nothing from before it
const installedAt = async ($: EngineInterface) => {
  const kept = parsed<{ at?: number }>(await readOr($, `${dir}/installed.json`), {}).at
  if (typeof kept === 'number' && kept > 0) return kept
  const born = await $.process.run(isLinux ? ['stat', '-c', '%W', dir] : ['stat', '-f', '%B', dir], { timeoutMs: 5000 }).catch(() => undefined)
  const seconds = Number(born?.stdout.trim())
  const at = seconds > 0 ? seconds * 1000 : await $.clock.now()
  await $.fs.write(`${dir}/installed.json`, JSON.stringify({ at })).catch(() => undefined)
  return at
}
const UNREACHED = 'Couldn’t reach the leaderboard. Try again in a minute.'
const boardAct = async ($: EngineInterface, act: () => Promise<string>) => {
  if (boardNow.isBusy) return
  ;((boardNow.isBusy = true), (boardNow.said = ''), drawAgain($))
  try {
    boardNow.said = await act()
  } catch (err) {
    ;((boardNow.said = UNREACHED), log($, `leaderboard: ${String(err)}`))
  } finally {
    ;((boardNow.isBusy = false), drawAgain($))
  }
}
const joinBoard = ($: EngineInterface, name: string) =>
  boardAct($, async () => {
    if (!NAME_RULE.test(name)) return 'A username is 3 to 20 letters, digits, - or _, with no spaces.'
    const r = await boardCall($, 'lb_join', { p_name: name, p_public: false, p_stats: await boardFigures($) })
    if (r.status === 409) return `Someone already has the username ${name}. Choose another.`
    if (!r.ok || typeof r.body !== 'string') return UNREACHED
    await boardSave($, { name, token: r.body, isPublic: false, sentAt: await $.clock.now() })
    return `✓ You joined as ${name}. Your stats are private until you make them public.`
  })
const leaveBoard = ($: EngineInterface) =>
  boardAct($, async () => {
    const r = await boardCall($, 'lb_leave', { p_token: boardNow.file.token ?? '' })
    if (!r.ok) return 'Couldn’t reach the leaderboard, so you’re still on it. Press Leave again in a minute.'
    await boardSave($, {})
    return '✓ You left the leaderboard. Your figures are gone from it.'
  })
// Sends the figures, and public or private; a secret the board no longer knows (left from another Mac) clears this one too
const pushBoard = async ($: EngineInterface, isPublic: boolean) => {
  const file = boardNow.file
  const r = await boardCall($, 'lb_push', { p_token: file.token ?? '', p_public: isPublic, p_stats: await boardFigures($) })
  if (r.ok && r.body === false) return (await boardSave($, {}), 'gone' as const)
  if (!r.ok) return 'failed' as const
  await boardSave($, { ...file, isPublic, sentAt: await $.clock.now() })
  return 'sent' as const
}
const publicBoard = ($: EngineInterface, isPublic: boolean) =>
  boardAct($, async () => {
    const r = await pushBoard($, isPublic)
    return r === 'gone' ? 'You’re no longer on the leaderboard. Choose a username to join again.' : r === 'failed' ? UNREACHED : isPublic ? '✓ Your stats are public.' : '✓ Your stats are private.'
  })
// Every few minutes, from whichever chat comes first: the time sent is written before sending, so the other chats leave it
const sendBoard = async ($: EngineInterface) => {
  const file = await boardLoad($)
  const now = await $.clock.now()
  if (!file.token || boardNow.isBusy || now - (file.sentAt ?? 0) < BOARD_EVERY) return
  await boardSave($, { ...file, sentAt: now })
  boardNow.isBusy = true
  try {
    await pushBoard($, Boolean(file.isPublic))
  } finally {
    boardNow.isBusy = false
  }
}
const openBoard = async ($: EngineInterface) => {
  const r = await openOn($, BOARD_SITE)
  if (r.exitCode !== 0) log($, `leaderboard not opened: ${'stderr' in r ? String(r.stderr) : ''}`)
}
const boardShown = ($: EngineInterface): BoardShown => ({
  name: boardNow.file.name ?? '',
  isPublic: Boolean(boardNow.file.isPublic),
  said: boardNow.said,
  isBusy: boardNow.isBusy,
  join: name => void joinBoard($, name),
  leave: () => void leaveBoard($),
  setPublic: isPublic => void publicBoard($, isPublic),
  open: () => void openBoard($).catch(err => log($, `leaderboard not opened: ${String(err)}`)),
})
const boardButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="board-button" flexShrink={0}>
    <ui.Button key={`board-open-${presses}`} label="Leaderboard" hotkey={isKeyed ? 'l' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openBoard($).catch(err => log($, `leaderboard not opened: ${String(err)}`))} />
  </ui.Box>
)
