// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id: its latest line, when its output last changed, whether its processes are paused,
// and for a wait, how what it waits for stands
type Seen = { latest: string; pct?: string; port?: string; wroteAt?: number; isPaused?: boolean; target?: string }
const jobLog = new Map<string, Seen>()
// When each card was last told that one of its jobs wrote something new
const jobNews = new Map<string, number>()
let jobsLookedAt = 0
// The processes on this Mac, looked at less often than the outputs; and how many looks in a row found no shell for a command
let jobProcs: Proc[] = []
let jobProcsAt = 0
const JOB_PS = 15_000
const shellMissed = new Map<string, number>()
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
let tasksDir = ''
let tasksOf = ''
let tasksMissedAt = 0

// A job as its row shows it, from its command and words: a command that only waits is a wait, with what it waits for
const jobOf = (id: string, what: string, cmd: string, at: number, isWatch = false): Job => {
  const seen = jobLog.get(id)
  const wait = isWatch ? undefined : waitOf(cmd)
  const kind: JobKind = isWatch ? 'watch' : wait ? 'wait' : jobKindOf(cmd, what)
  return { id, label: labelOf(what || cmd, cmd), cmd, kind, at, ...(seen ?? {}), ...(wait ? { waitsFor: wait.what, ...(wait.file ? { waitFile: wait.file } : {}) } : {}), port: portOf(cmd) ?? seen?.port }
}
// The jobs a card has running: what it sent to the background, and a command it has waited on a while; jobs alike are one
const jobsOf = (one: Todo, at: number): Job[] =>
  foldJobs([
    ...(one.bg ?? []).map(b => jobOf(b.id, b.what, b.cmd ?? b.what, b.at, b.isWatch)),
    ...(one.detached ?? []).map(d => jobOf(d.id, d.what, d.cmd, d.at)),
    ...(one.status === 'working' && one.running?.cmd && !isWaitOnly(one.running.cmd) && at - one.running.at >= RUNNING_SHOWN
      ? [jobOf(`call-${one.id}`, one.running.label ?? '', one.running.cmd, one.running.at)]
      : []),
  ])

// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for; a wait's own "Wait" is not said
// twice
const jobHead = (job: Job) => {
  if (job.id.startsWith('more-')) return job.label
  const kind = `${JOB_HEAD[job.kind]}${job.kind === 'server' && job.port ? ` :${job.port}` : ''}${job.count && job.count > 1 ? ` ×${job.count}` : ''}`
  // A wait leads with what it waits for, its own words after
  const label = job.kind === 'wait' ? (job.waitsFor ?? job.label.replace(/^wait(s|ing)?\s+/i, '')) : job.label
  return `${kind} · ${label}`
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
  // A log named without a folder is the leading `cd`'s, or else the chat's folder's when it is there (a helper's own folder is
  // not known); the process is the one `echo $!` printed. Without both it is not followed, so nothing stays on a card for ever
  const here = await $.session.cwd()
  const base = found.cd ? (found.cd.startsWith('/') ? found.cd : `${here}/${found.cd}`) : here
  const log = found.log.startsWith('/') || found.log.startsWith('~/') ? found.log : `${base}/${found.log}`
  if (!found.cd && !found.log.startsWith('/') && !found.log.startsWith('~/') && !(await $.fs.exists(log).catch(() => false))) return
  const pid = pidOf(String((result as { stdout?: unknown } | undefined)?.stdout ?? ''))
  if (!pid) return
  const what = oneLine(String(call.description ?? '') || found.core).slice(0, 160)
  const now = await $.clock.now()
  const id = `detached-${String(call.tool_use_id ?? now)}`
  await update($, todos, list =>
    list.map(one => (one.id === agent ? { ...one, detached: [...(one.detached ?? []), { id, what, at: now, cmd: oneLine(command).slice(0, 400), log, pid }].slice(-BG_KEPT) } : one)),
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
  for (const owner of jobNews.keys()) if (!owned.some(o => o.owner === owner)) jobNews.delete(owner)
  for (const id of shellMissed.keys()) if (!owned.some(o => o.id === id)) shellMissed.delete(id)
  if (!owned.length) return
  const sid = await $.session.id().catch(() => '')
  if (sid !== tasksOf) ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0))
  if (owned.some(o => !o.file) && !tasksDir && now - tasksMissedAt >= JOB_NEWS) {
    tasksDir = await findTasks($)
    if (!tasksDir) tasksMissedAt = now
  }
  const asked = owned.filter(o => o.file || tasksDir)
  const files = asked.map(o => o.file || `${tasksDir}/${o.id}.output`)
  // The files the waits poll, to tell whether what they wait for still moves
  const waits = list.flatMap(one => [...(one.bg ?? []).filter(b => !b.isWatch), ...(one.detached ?? [])].flatMap(j => {
    const wait = waitOf(j.cmd ?? '')
    return wait ? [{ id: j.id, wait }] : []
  }))
  const targets = waits.flatMap(w => (w.wait.file ? [w.wait.file] : []))
  const isPs = now - jobProcsAt >= JOB_PS
  const pids = owned.flatMap(o => (o.pid ? [o.pid] : []))
  // One go: the end of each output with when it last changed, when each polled file last changed, which detached processes still
  // run, and now and then every process with its state
  const mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)'
  const home = 'case $f in "~/"*) f="$HOME/${f#\\~/}";; esac'
  const script = `n=$1; shift; i=0; for f; do i=$((i+1)); o=$f; ${home}; ${mtime}; if [ $i -le $n ]; then printf '\\n@@JOB@@ %s %s\\n' "$m" "$f"; tail -c ${JOB_TAIL} "$f" 2>/dev/null; else printf '\\n@@AT@@ %s %s' "$m" "$o"; fi; done; printf '\\n@@ALIVE@@'; for p in ${pids.map(p => p.replace(/\D/g, '')).join(' ')}; do kill -0 "$p" 2>/dev/null && printf ' %s' "$p"; done; printf '\\n'${isPs ? "; printf '@@PS@@\\n'; ps -axww -o pid=,ppid=,stat=,etime=,command=" : ''}`
  const r = await $.process.run(['sh', '-c', script, 'sh', String(files.length), ...files, ...targets], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r) return
  const [body = '', tail = ''] = r.stdout.split('\n@@ALIVE@@')
  const [aliveText = '', psText] = tail.split('@@PS@@\n')
  if (psText !== undefined) ((jobProcs = procsOf(psText, now)), (jobProcsAt = now))
  const alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean))
  const changed = new Map([...body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g)].map(m => [m[2] ?? '', Number(m[1]) * 1000]))
  // A detached job whose process ended leaves its card
  const gone = owned.filter(o => o.pid && !alive.has(o.pid)).map(o => o.id)
  if (gone.length && /@@ALIVE@@/.test(r.stdout)) {
    await update($, todos, cards => cards.map(one => (one.detached?.some(d => gone.includes(d.id)) ? { ...one, detached: one.detached.filter(d => !gone.includes(d.id)).length ? one.detached.filter(d => !gone.includes(d.id)) : undefined } : one)))
    $.ui.invalidate('ui.render')
  }
  // Each background command's shell, found by its words among the engine's shells: paused when any of its processes is, and gone
  // when no shell has been found for it twice in a row while others were (so a way of running the engine has not changed), as one the engine never said ended (only once a minute has passed)
  const bgs = list.flatMap(one => (one.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, cmd: b.cmd ?? '', at: b.at })))
  const shells = jobProcs.length ? shellsOf(jobProcs, bgs) : new Map<string, string | true | null>()
  const states = new Map<string, boolean>()
  for (const [id, pid] of shells) {
    if (typeof pid === 'string') states.set(id, treeOf(jobProcs, pid).some(isPausedProc))
    if (pid) shellMissed.delete(id)
    else if (psText !== undefined && [...shells.values()].some(Boolean)) shellMissed.set(id, (shellMissed.get(id) ?? 0) + 1)
  }
  for (const o of owned) if (o.pid) states.set(o.id, treeOf(jobProcs, o.pid).some(isPausedProc))
  const ended = bgs.filter(b => (shellMissed.get(b.id) ?? 0) >= 2 && now - b.at >= 60_000).map(b => b.id)
  // How what each wait waits for stands: a run it waits on paused or gone, a file it polls still for long
  const targetOf = (wait: NonNullable<ReturnType<typeof waitOf>>) => {
    const runs = wait.pattern
      ? jobProcs.filter(p => isLike(p.command, wait.pattern ?? '') && !/shell-snapshots\/snapshot-/.test(p.command) && !/^(\S*\/)?pgrep\s/.test(p.command))
      : wait.pid
        ? jobProcs.filter(p => p.pid === wait.pid)
        : undefined
    if (runs && jobProcs.length) {
      if (!runs.length) return wait.isStart ? '' : 'what it waits for has ended'
      if (runs.some(p => treeOf(jobProcs, p.pid).some(isPausedProc))) return 'what it waits for is paused'
    }
    const at = wait.file ? changed.get(wait.file) : undefined
    return at && now - at >= JOB_QUIET ? `${wait.file?.split('/').at(-1)} unchanged ${shortAgo(now - at)}` : ''
  }
  const parts = body.split(/\n@@JOB@@ ([^\n]*)\n/)
  let isChanged = false
  const moved = new Set<string>()
  for (let n = 1; n + 1 < parts.length; n += 2) {
    // The outputs come back in the order they were asked for, each after when it last changed
    const job = asked[(n - 1) / 2]
    const id = job?.id ?? ''
    const text = (parts[n + 1] ?? '').split('\n@@AT@@ ')[0] ?? ''
    if (!job?.pid && isOutputEnded(text)) ended.push(id)
    const m = Number(parts[n]?.split(' ')[0] ?? 0) * 1000
    const seen = latestOf(text)
    const was = jobLog.get(id)
    const wait = waits.find(w => w.id === id)
    const next: Seen = { ...seen, ...(m ? { wroteAt: m } : {}), ...(states.has(id) ? { isPaused: states.get(id) } : was?.isPaused ? { isPaused: true } : {}), ...(wait ? { target: targetOf(wait.wait) } : {}) }
    const isSame = was?.latest === next.latest && was?.pct === next.pct && was?.wroteAt === next.wroteAt && was?.isPaused === next.isPaused && was?.target === next.target
    if (isSame) continue
    jobLog.set(id, next)
    isChanged = true
    const owner = job?.owner
    if (seen.latest && owner && was && was.latest !== seen.latest && now - (jobNews.get(owner) ?? 0) >= JOB_NEWS) moved.add(owner)
  }
  // A background command that has ended, by the engine's last line on its output or as no shell runs it, leaves its card
  if (ended.length) {
    await dropBackground($, ended)
    for (const id of ended) (jobLog.delete(id), shellMissed.delete(id))
    isChanged = true
  }
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await update($, todos, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  if (isChanged) $.ui.invalidate('ui.render')
}

// A short time since, for a row's side: seconds, minutes, or hours and minutes
const shortAgo = (ms: number) => {
  const all = Math.max(0, Math.floor(ms / 1000))
  return all < 60 ? `${all}s` : all < 3600 ? `${Math.floor(all / 60)}m` : `${Math.floor(all / 3600)}h ${String(Math.floor(all / 60) % 60).padStart(2, '0')}m`
}
// A process's command against a pattern as pgrep -f reads it: a regular expression, or the words themselves when it is none
const isLike = (command: string, pattern: string) => {
  try {
    return new RegExp(pattern).test(command)
  } catch {
    return command.includes(pattern)
  }
}
