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
      return { id: f.id, kind: (meta.spawnDepth ?? 1) > 1 ? 'helper' : 'work', parent: meta.parentAgentId ?? '', title: meta.description ?? 'Background work', isFinished: Boolean(meta.finished), sum }
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
    held.set(scope, { runs: was?.runs ?? [], at: now, error: String(err).includes('jq') ? 'Stats reads Claude’s records with jq, and jq was not found on this Mac.' : `The records could not be read: ${String(err)}` })
  } finally {
    reading.delete(scope)
    $.ui.invalidate('ui.render')
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
    { name: 'Subjects', count: subjects, bytes: kb.get('index.md') ?? 0 },
    { name: 'Briefs', count: (await names('streams')).length, bytes: kb.get('streams') ?? 0 },
    { name: 'Your words, by chat', count: (await names('words')).length, bytes: kb.get('words') ?? 0 },
    { name: 'Asks and answers, by chat', count: (await names('asks')).length, bytes: kb.get('asks') ?? 0 },
    { name: 'Results', count: reports.filter(e => e.kind === 'dir').length, bytes: kb.get('reports') ?? 0 },
    { name: 'Finished work, by chat', count: (await names('finished')).length, bytes: kb.get('finished') ?? 0 },
    { name: 'Workflow runs', count: (await names('flows')).length, bytes: kb.get('flows') ?? 0 },
    { name: 'Thumbnails and sums', count: (await names('thumbs')).length + (await names('stats')).length, bytes: (kb.get('thumbs') ?? 0) + (kb.get('stats') ?? 0) },
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
    <ui.Button key={`stats-open-${presses}`} label="Stats" hotkey={isKeyed ? 's' : undefined} onPress={() => void openStats($).catch(err => log($, `stats not opened: ${String(err)}`))} />
  </ui.Box>
)
