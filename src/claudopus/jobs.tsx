// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id
const jobLog = new Map<string, { latest: string; pct?: string; port?: string }>()
// When each card was last told that one of its jobs wrote something new
const jobNews = new Map<string, number>()
let jobsLookedAt = 0
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
let tasksDir = ''
let tasksMissedAt = 0

// The jobs a card has running: what it sent to the background, and a command it has waited on a while
const jobsOf = (one: Todo, at: number): Job[] => [
  ...(one.bg ?? []).map(b => {
    const cmd = b.cmd ?? b.what
    const seen = jobLog.get(b.id)
    const kind: JobKind = b.isWatch ? 'watch' : jobKindOf(cmd, b.what)
    return { id: b.id, label: b.what || cmd, cmd, kind, at: b.at, ...(seen ?? {}), port: portOf(cmd) ?? seen?.port }
  }),
  ...(one.detached ?? []).map(d => {
    const seen = jobLog.get(d.id)
    return { id: d.id, label: d.what || d.cmd, cmd: d.cmd, kind: jobKindOf(d.cmd, d.what), at: d.at, ...(seen ?? {}), port: portOf(d.cmd) ?? seen?.port }
  }),
  ...(one.status === 'working' && one.running?.cmd && at - one.running.at >= RUNNING_SHOWN
    ? [{ id: `call-${one.id}`, label: one.running.cmd, cmd: one.running.cmd, kind: jobKindOf(one.running.cmd, one.running.cmd), at: one.running.at }]
    : []),
]

// A job's name on its row: what kind, a server's port, and its own words
const jobHead = (job: Job) => {
  const kind = job.kind === 'server' ? `Server${job.port ? ` :${job.port}` : ''}` : job.kind === 'download' ? 'Download' : job.kind === 'watch' ? 'Watch' : ''
  return kind ? `${kind} · ${job.label}` : job.label
}

// Where this chat's background output is written: the engine's tasks folder under its own temporary folder, named by the chat
const findTasks = async ($: EngineInterface) => {
  const sid = await $.session.id().catch(() => '')
  if (!sid) return ''
  const r = await $.process
    .run(['sh', '-c', 'for d in /private/tmp/claude-*/*/"$1"/tasks /tmp/claude-*/*/"$1"/tasks "${TMPDIR%/}"/claude-*/*/"$1"/tasks; do [ -d "$d" ] && { echo "$d"; exit 0; }; done; exit 1', 'sh', sid], { timeoutMs: 5000 })
    .catch(() => undefined)
  return r?.exitCode === 0 ? r.stdout.trim().split('\n')[0] ?? '' : ''
}

// A command the work started detached is kept by its card with the log it writes and its process; a leading `cd`, or else the
// work's own folder, is where a log named without a folder is
const keepDetached = async ($: EngineInterface, agent: string, call: { tool: string; command?: unknown; description?: unknown; tool_use_id?: unknown }, result: unknown) => {
  if (call.tool !== 'Bash') return
  const command = String(call.command ?? '')
  const found = detachedOf(command)
  if (!found) return
  const base = found.cd ? (found.cd.startsWith('/') ? found.cd : `${await $.session.cwd()}/${found.cd}`) : await $.session.cwd()
  const log = found.log.startsWith('/') ? found.log : found.log.startsWith('~/') ? found.log : `${base}/${found.log}`
  const stdout = String((result as { stdout?: unknown } | undefined)?.stdout ?? '')
  let pid = pidOf(stdout)
  // No `echo $!`: the newest process running its command
  if (!pid) {
    const r = await $.process.run(['pgrep', '-n', '-f', found.core.slice(0, 200)], { timeoutMs: 5000 }).catch(() => undefined)
    pid = r?.exitCode === 0 ? r.stdout.trim().split('\n')[0] : undefined
  }
  const what = oneLine(String(call.description ?? '') || found.core).slice(0, 160)
  const now = await $.clock.now()
  const id = `detached-${String(call.tool_use_id ?? now)}`
  await update($, todos, list =>
    list.map(one => (one.id === agent ? { ...one, detached: [...(one.detached ?? []), { id, what, at: now, cmd: oneLine(command).slice(0, 400), log, ...(pid ? { pid } : {}) }].slice(-BG_KEPT) } : one)),
  )
}

// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news, so a long server or download that keeps writing does not read as stuck
const lookJobs = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - jobsLookedAt < JOB_LOOK) return
  jobsLookedAt = now
  const list = await read($, todos)
  const owned = [
    ...list.flatMap(one => (one.bg ?? []).filter(b => !b.isWatch).map(b => ({ owner: one.id, id: b.id, file: '', pid: undefined as string | undefined }))),
    ...list.flatMap(one => (one.detached ?? []).map(d => ({ owner: one.id, id: d.id, file: d.log, pid: d.pid }))),
  ]
  for (const id of jobLog.keys()) if (!owned.some(o => o.id === id)) jobLog.delete(id)
  if (!owned.length) return
  if (owned.some(o => !o.file) && !tasksDir && now - tasksMissedAt >= JOB_NEWS) {
    tasksDir = await findTasks($)
    if (!tasksDir) tasksMissedAt = now
  }
  const files = owned.map(o => o.file || (tasksDir ? `${tasksDir}/${o.id}.output` : '')).filter(Boolean)
  const pids = owned.flatMap(o => (o.pid ? [o.pid] : []))
  // One go: the end of each output, then which of the detached processes still run
  const script = `for f; do printf '\\n@@JOB@@ %s\\n' "$f"; case $f in "~/"*) f="$HOME/\${f#\\~/}";; esac; tail -c ${JOB_TAIL} "$f" 2>/dev/null; done; printf '\\n@@ALIVE@@'; for p in ${pids.map(p => p.replace(/\D/g, '')).join(' ')}; do kill -0 "$p" 2>/dev/null && printf ' %s' "$p"; done; printf '\\n'`
  const r = await $.process.run(['sh', '-c', script, 'sh', ...files], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r) return
  const [body = '', aliveText = ''] = r.stdout.split('\n@@ALIVE@@')
  const alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean))
  // A detached job whose process ended leaves its card
  const gone = owned.filter(o => o.pid && !alive.has(o.pid)).map(o => o.id)
  if (gone.length && /@@ALIVE@@/.test(r.stdout)) {
    await update($, todos, cards => cards.map(one => (one.detached?.some(d => gone.includes(d.id)) ? { ...one, detached: one.detached.filter(d => !gone.includes(d.id)).length ? one.detached.filter(d => !gone.includes(d.id)) : undefined } : one)))
    $.ui.invalidate('ui.render')
  }
  const parts = body.split(/\n@@JOB@@ ([^\n]*)\n/)
  let isChanged = false
  const moved = new Set<string>()
  for (let n = 1; n + 1 < parts.length; n += 2) {
    const file = parts[n] ?? ''
    const id = owned.find(o => o.file === file)?.id ?? file.split('/').at(-1)?.replace(/\.output$/, '') ?? ''
    const seen = latestOf(parts[n + 1] ?? '')
    const was = jobLog.get(id)
    if (!seen.latest || (was?.latest === seen.latest && was?.pct === seen.pct)) continue
    jobLog.set(id, seen)
    isChanged = true
    const owner = owned.find(o => o.id === id)?.owner
    if (owner && was && now - (jobNews.get(owner) ?? 0) >= JOB_NEWS) moved.add(owner)
  }
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await update($, todos, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  if (isChanged) $.ui.invalidate('ui.render')
}
