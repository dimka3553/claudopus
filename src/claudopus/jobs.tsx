// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id: its latest line, when its output last changed, whether its processes are paused,
// and for a wait, how what it waits for stands
type Seen = { latest: string; mem?: string; isUntold?: boolean; tail?: string[]; pct?: string; done?: string; total?: string; rate?: string; left?: string; isEarlier?: boolean; isOwn?: boolean; isEmpty?: boolean; port?: string; wroteAt?: number; isPaused?: boolean; target?: string }
const jobLog = new Map<string, Seen>()
// When each card was last told that one of its jobs wrote something new
const jobNews = new Map<string, number>()
let jobsLookedAt = 0
// The processes on this Mac, looked at less often than the outputs; and how many looks in a row found no shell for a command
let jobProcs: Proc[] = []
let jobProcsAt = 0
const JOB_PS = 15_000
// How long past its time limit a watch is still waited for to say it ended, before it counts as ended anyway
const WATCH_GRACE = 2 * 60_000
const shellMissed = new Map<string, number>()
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
let tasksDir = ''
let tasksOf = ''
let tasksMissedAt = 0
// The output a command held open writes while it runs, by its row's id: the engine writes it to a file of its own in the tasks
// folder and names it only once the command ends or goes to the background, so it is found as the file its shell writes to
const callFiles = new Map<string, { file: string; at: number }>()
// The file each row's output was last read from, by its id, so a press on the row can show it whole
const jobFiles = new Map<string, string>()

// A job as its row shows it, from its command and words: a command that only waits is a wait, with what it waits for
const jobOf = (id: string, what: string, cmd: string, at: number, isWatch = false, theirs?: Seen): Job => {
  const seen = jobLog.get(id) ?? theirs
  const wait = isWatch ? undefined : waitOf(cmd)
  const said = describedOf(what)
  const kind: JobKind = isWatch ? 'watch' : (said.kind ?? (wait ? 'wait' : jobKindOf(cmd, what)))
  const label = labelOf(said.text || cmd, cmd)
  return { id, label, isNamed: Boolean(what) && label !== labelOf('', cmd), cmd, kind, at, ...(said.expect ? { expect: said.expect, expectText: said.expectText } : {}), ...(seen ?? {}), ...(wait ? { waitsFor: wait.what, ...(wait.file ? { waitFile: wait.file } : {}) } : {}), port: portOf(cmd) ?? seen?.port }
}
// The jobs a card has running: what it sent to the background, and a command it has waited on a while; jobs alike are one
const jobsOf = (one: Todo, at: number): Job[] =>
  foldJobs([
    ...(one.bg ?? []).map(b => jobOf(b.id, b.what, b.cmd ?? b.what, b.at, b.isWatch, one.seenJobs?.[b.id])),
    ...(one.detached ?? []).map(d => jobOf(d.id, d.what, d.cmd, d.at, false, one.seenJobs?.[d.id])),
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
  // Its own words alone when they say its kind already (Download the CT scans, Wait for the deploy)
  if (job.isNamed && isKindSaid(job.label)) return `${job.label}${job.kind === 'server' && job.port && !job.label.includes(job.port) ? ` :${job.port}` : ''}${job.count && job.count > 1 ? ` ×${job.count}` : ''}`
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
  const logFile = found.log.startsWith('/') || found.log.startsWith('~/') ? found.log : `${base}/${found.log}`
  if (!found.cd && !found.log.startsWith('/') && !found.log.startsWith('~/') && !(await $.fs.exists(logFile).catch(() => false))) return
  // Only a command that printed its process with `echo $!` is followed by it: any other number it printed is no process
  const pid = /\$!/.test(command) ? pidOf(String((result as { stdout?: unknown } | undefined)?.stdout ?? '')) : undefined
  if (!pid) return
  const what = oneLine(String(call.description ?? '') || found.core).slice(0, 160)
  const now = await $.clock.now()
  const id = `detached-${String(call.tool_use_id ?? now)}`
  await update($, todos, list =>
    list.map(one => (one.id === agent ? { ...one, detached: [...(one.detached ?? []), { id, what, at: now, cmd: oneLine(command).slice(0, 400), log: logFile, pid }].slice(-BG_KEPT) } : one)),
  )
}

// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news, so a long server or download that keeps writing does not read as stuck
const lookJobs = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - jobsLookedAt < JOB_LOOK) return
  jobsLookedAt = now
  const list = await read($, todos)
  // Held open: a command a card has waited on long enough to be a row of its own
  const held = list.flatMap(one => (one.status === 'working' && one.running?.cmd && now - one.running.at >= RUNNING_SHOWN ? [{ owner: one.id, id: `call-${one.id}`, cmd: one.running.cmd, at: one.running.at }] : []))
  // A row's command that changed (another held call of the same card ran longest) starts afresh
  for (const [id, was] of callFiles) if (!held.some(h => h.id === id && h.at === was.at)) (callFiles.delete(id), jobLog.delete(id))
  const owned = [
    // A watch's output is its events, read as any other
    ...list.flatMap(one => (one.bg ?? []).map(b => ({ owner: one.id, id: b.id, file: '', pid: undefined as string | undefined }))),
    ...list.flatMap(one => (one.detached ?? []).map(d => ({ owner: one.id, id: d.id, file: d.log, pid: d.pid, isUntold: Boolean(d.isLeft && !d.log) }))),
    ...held.flatMap(h => (callFiles.get(h.id) ? [{ owner: h.owner, id: h.id, file: callFiles.get(h.id)?.file ?? '', pid: undefined as string | undefined }] : [])),
  ]
  for (const id of jobLog.keys()) if (!owned.some(o => o.id === id) && !held.some(h => h.id === id)) jobLog.delete(id)
  for (const owner of jobNews.keys()) if (!owned.some(o => o.owner === owner)) jobNews.delete(owner)
  for (const id of shellMissed.keys()) if (!owned.some(o => o.id === id)) shellMissed.delete(id)
  // A held-open command's shell, once the processes have been listed, and the file it writes to: only one in a tasks folder
  const unfound = held.filter(h => !callFiles.has(h.id))
  if (unfound.length && jobProcs.length) {
    const pids = unfound.flatMap(h => {
      const pid = heldShellOf(jobProcs, h.cmd, h.at)
      return pid ? [{ id: h.id, pid, at: h.at }] : []
    })
    if (pids.length) {
      const fd = await $.process
        .run(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh', ...pids.map(p => p.pid)], { timeoutMs: 5000 })
        .catch(() => undefined)
      for (const line of fd?.stdout.split('\n') ?? []) {
        const [pid = '', ...path] = line.split(' ')
        const file = path.join(' ').trim()
        const one = pids.find(p => p.pid === pid)
        if (one && /\/tasks\/[\w-]+\.output$/.test(file)) callFiles.set(one.id, { file, at: one.at })
      }
    }
  }
  await pruneSpans($, now)
  if (!owned.length && !unfound.length && !spans.length) return
  const sid = await $.session.id().catch(() => '')
  if (sid !== tasksOf) ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0))
  if (owned.some(o => !o.file) && !tasksDir && now - tasksMissedAt >= JOB_NEWS) {
    tasksDir = await findTasks($)
    if (!tasksDir) tasksMissedAt = now
  }
  const asked = owned.filter(o => !('isUntold' in o && o.isUntold) && (o.file || tasksDir))
  const files = asked.map(o => o.file || `${tasksDir}/${o.id}.output`)
  jobFiles.clear()
  asked.forEach((o, n) => jobFiles.set(o.id, files[n] ?? ''))
  // The files the waits poll, to tell whether what they wait for still moves
  const waits = list.flatMap(one => [...(one.bg ?? []).filter(b => !b.isWatch), ...(one.detached ?? [])].flatMap(j => {
    const wait = waitOf(j.cmd ?? '')
    return wait ? [{ id: j.id, wait }] : []
  }))
  const targets = waits.flatMap(w => (w.wait.file ? [w.wait.file] : []))
  const isPs = now - jobProcsAt >= JOB_PS
  // One kept before process numbers were checked, such as 000, is never asked after: it counts as ended, and leaves its card
  const pids = owned.flatMap(o => (o.pid && isPid(o.pid) ? [o.pid] : []))
  // One go: the end of each output with when it last changed, when each polled file last changed, which detached processes still
  // run, and now and then every process with its state
  const mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)'
  const home = 'case $f in "~/"*) f="$HOME/${f#\\~/}";; esac'
  const script = `n=$1; shift; i=0; for f; do i=$((i+1)); o=$f; ${home}; ${mtime}; if [ $i -le $n ]; then printf '\\n@@JOB@@ %s %s\\n' "$m" "$f"; tail -c ${JOB_TAIL} "$f" 2>/dev/null; else printf '\\n@@AT@@ %s %s' "$m" "$o"; fi; done; printf '\\n@@ALIVE@@'; for p in ${pids.map(p => p.replace(/\D/g, '')).join(' ')}; do kill -0 "$p" 2>/dev/null && printf ' %s' "$p"; done; printf '\\n'${isPs ? `; printf '@@PS@@\\n'; ps -axww -o ${PS_COLUMNS}` : ''}`
  const r = await $.process.run(['sh', '-c', script, 'sh', String(files.length), ...files, ...targets], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r) return
  const [body = '', tail = ''] = r.stdout.split('\n@@ALIVE@@')
  const [aliveText = '', psText] = tail.split('@@PS@@\n')
  if (psText !== undefined) ((jobProcs = procsOf(psText, now)), (jobProcsAt = now))
  // What a command left going, however it was started, becomes a run of its card as soon as the processes show it
  if (psText !== undefined && spans.length) await adoptLeft($, jobProcs, now).catch(err => log($, `left runs not followed: ${String(err)}`))
  const alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean))
  const changed = new Map([...body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g)].map(m => [m[2] ?? '', Number(m[1]) * 1000]))
  // A detached job whose process ended leaves its card, kept as ended (how its process ended is not known)
  const gone = owned.filter(o => o.pid && !alive.has(o.pid)).map(o => o.id)
  if (gone.length && /@@ALIVE@@/.test(r.stdout)) {
    const runsOf = (one: Todo) => (one.detached ?? []).filter(d => gone.includes(d.id)).map(d => ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'ended' as const }))
    await update($, todos, cards => cards.map(one => (one.detached?.some(d => gone.includes(d.id)) ? { ...one, detached: one.detached.filter(d => !gone.includes(d.id)).length ? one.detached.filter(d => !gone.includes(d.id)) : undefined, ...keepEnded(one, runsOf(one)) } : one)))
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
  // How each ended, where its output says: finished, failed with its code, or killed
  const endedAs: Record<string, EndAs> = {}
  // A watch well past the time limit the engine set it has ended, whether or not its last line was read
  for (const one of list) for (const b of one.bg ?? []) if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE && !ended.includes(b.id)) (ended.push(b.id), (endedAs[b.id] = 'timed out'))
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
    const m = Number(parts[n]?.split(' ')[0] ?? 0) * 1000
    // One that ended, by the engine's last line on its output, and when: as that output last changed
    const end = job?.pid ? undefined : runEndOf(text)
    if (end) (ended.includes(id) || ended.push(id), (endedAs[id] = { ...end, ...(m ? { at: m } : {}) }))
    // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote (on
    // 15 Nov such rows read "updated 9m ago" for runs that sent all they printed elsewhere)
    const seen = { ...latestOf(text), ...(m && !text.trim() ? { isEmpty: true } : {}) }
    const was = jobLog.get(id)
    const wait = waits.find(w => w.id === id)
    // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
    const kept = !seen.pct && !seen.done && was?.isOwn ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {}
    const next: Seen = { ...seen, ...memSeen(job?.pid), tail: tailOf(text), ...kept, ...(m ? { wroteAt: m } : {}), ...(states.has(id) ? { isPaused: states.get(id) } : was?.isPaused ? { isPaused: true } : {}), ...(wait ? { target: targetOf(wait.wait) } : {}) }
    const isSame = was?.latest === next.latest && was?.pct === next.pct && was?.done === next.done && was?.total === next.total && was?.rate === next.rate && was?.left === next.left && was?.isEmpty === next.isEmpty && was?.isEarlier === next.isEarlier && was?.wroteAt === next.wroteAt && was?.isPaused === next.isPaused && was?.target === next.target && was?.mem === next.mem && was?.tail?.join('\n') === next.tail?.join('\n')
    if (isSame) continue
    jobLog.set(id, next)
    isChanged = true
    const owner = job?.owner
    if (seen.latest && owner && was && was.latest !== seen.latest && now - (jobNews.get(owner) ?? 0) >= JOB_NEWS) moved.add(owner)
  }
  // A left run whose output goes nowhere it can be read runs with no progress given, with its memory
  for (const o of owned) {
    if (!('isUntold' in o && o.isUntold) || gone.includes(o.id)) continue
    const was = jobLog.get(o.id)
    const next: Seen = { latest: '', isUntold: true, ...memSeen(o.pid), ...(states.has(o.id) ? { isPaused: states.get(o.id) } : {}) }
    if (was?.isUntold && was.mem === next.mem && was.isPaused === next.isPaused) continue
    jobLog.set(o.id, next)
    isChanged = true
  }
  // A background command that has ended, by the engine's last line on its output or as no shell runs it, leaves its card
  if (ended.length) {
    await dropBackground($, ended, endedAs)
    for (const id of ended) (jobLog.delete(id), shellMissed.delete(id))
    isChanged = true
  }
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await update($, todos, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  if (isChanged) $.ui.invalidate('ui.render')
}

// The memory a followed process and all it started hold, as the processes were last listed
const memSeen = (pid?: string) => {
  const mem = pid && jobProcs.length ? memOf(treeOf(jobProcs, pid)) : undefined
  return mem ? { mem } : {}
}

// Each piece of work's commands, by the process numbers handed out while each ran, kept a while so what one leaves going is
// found when the processes show it: at once for a command that has ended, later for one sent to the background whose shell ends
// A command that has ended is looked at once more after a while; one sent to the background until a little after it ends
type KeptSpan = Span & { agent: string; what: string; bgId?: string }
let spans: KeptSpan[] = []
const SPANS_KEPT = 300
const SPAN_KEPT_FOR = 2 * 60_000
// The commands of work still running, by their call, and every process already made a run, so none is added twice
const openCalls = new Map<string, OpenCall>()
const adopted = new Set<string>()
const pruneSpans = async ($: EngineInterface, now: number) => {
  // One sent to the background is open until its row has left every card
  const list = spans.some(s => s.bgId && s.until === undefined) ? await read($, todos) : []
  spans = spans.map(s => (s.bgId && s.until === undefined && !list.some(one => one.bg?.some(b => b.id === s.bgId)) ? { ...s, until: now } : s))
  if (spans.some(s => s.until !== undefined && now - s.until > SPAN_KEPT_FOR)) spans = spans.filter(s => s.until === undefined || now - s.until <= SPAN_KEPT_FOR)
}
// The newest process number on this Mac, as a shell started now is handed it; 0 where it cannot be told
const pidNow = async ($: EngineInterface) => {
  const r = await $.process.run(['sh', '-c', 'echo $$ # pid now'], { timeoutMs: 3000 }).catch(() => undefined)
  const n = Number(r?.stdout.trim())
  return Number.isInteger(n) && n > 1 ? n : 0
}
// A piece of work's Bash call has ended (or gone to the background): kept by the numbers handed out while it ran, and what a
// command that has ended left going is followed at once
const keepSpan = async ($: EngineInterface, agent: string, call: { tool: string; command?: unknown; description?: unknown; tool_use_id?: unknown; run_in_background?: unknown }, from: number, at: number, result?: unknown) => {
  if (call.tool !== 'Bash' || !from) return
  const to = await pidNow($)
  openCalls.delete(String(call.tool_use_id ?? ''))
  if (!to) return
  const now = await $.clock.now()
  const command = String(call.command ?? '')
  // Started on another Mac over ssh, what it leaves runs there
  if (/^\s*(\S*\/)?ssh\b/.test(command)) return
  const bgId = (result as { backgroundTaskId?: unknown } | undefined)?.backgroundTaskId
  const isBackground = Boolean(call.run_in_background) && typeof bgId === 'string'
  const span: KeptSpan = { id: String(call.tool_use_id ?? now), agent, what: oneLine(String(call.description ?? '')).slice(0, 160), cmd: oneLine(command).slice(0, 400), from, to, at, endAt: now, ...(isBackground ? { bgId: String(bgId) } : { until: now }) }
  spans = [...spans.filter(s => s.id !== span.id), span].slice(-SPANS_KEPT)
  if (call.run_in_background) return
  const r = await $.process.run(['sh', '-c', `printf '@@LEFT@@\\n'; ps -axww -o ${PS_COLUMNS}`], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r || r.exitCode !== 0 || !r.stdout.includes('@@LEFT@@')) return
  const procs = procsOf(r.stdout.split('@@LEFT@@\n')[1] ?? '', now)
  // Among every command kept, so a run held back while another ran goes to its own
  await adoptLeft($, procs, now)
}
// What commands left going becomes runs on their cards: each topmost process, with its command's words when it left one, else
// its own program and script; its log where its output goes to a file, so its progress line is read as any other
const adoptLeft = async ($: EngineInterface, procs: Proc[], now: number, only?: KeptSpan[]) => {
  const list = await read($, todos)
  // A process number gone from the list may be handed out again: it no longer stands for a run made already
  for (const pid of adopted) if (!procs.some(p => p.pid === pid)) adopted.delete(pid)
  const known = new Set([...adopted, ...list.flatMap(one => (one.detached ?? []).flatMap(d => (d.pid ? [d.pid] : [])))])
  const left = leftoversOf(procs, only ?? spans, known, [...openCalls.values()])
  if (!left.length) return
  const fd = await $.process
    .run(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh', ...left.map(l => l.top.pid)], { timeoutMs: 5000 })
    .catch(() => undefined)
  const logs = new Map((fd?.stdout.split('\n') ?? []).map(line => [line.split(' ')[0] ?? '', line.split(' ').slice(1).join(' ').trim()]))
  const added = new Map<string, NonNullable<Todo['detached']>>()
  for (const one of left) {
    const span = spans.find(s => s.id === one.span) ?? only?.find(s => s.id === one.span)
    if (!span || !list.some(card => card.id === span.agent)) continue
    const file = logs.get(one.top.pid) ?? ''
    const log = file.startsWith('/') && !file.startsWith('/dev/') ? file : ''
    const several = left.filter(l => l.span === one.span).length > 1
    const what = several || !span.what ? leftName(one.top.command) : span.what
    adopted.add(one.top.pid)
    added.set(span.agent, [...(added.get(span.agent) ?? []), { id: `left-${one.top.pid}-${span.id}`, what, at: Math.min(now, Math.max(span.at, one.top.startAt)), cmd: oneLine(one.top.command).slice(0, 400), log, pid: one.top.pid, isLeft: true }])
  }
  if (!added.size) return
  await update($, todos, cards => cards.map(one => (added.has(one.id) ? { ...one, detached: [...(one.detached ?? []).filter(d => !added.get(one.id)?.some(a => a.id === d.id)), ...(added.get(one.id) ?? [])].slice(-BG_KEPT) } : one)))
  for (const [agent, runs] of added) await log($, `work ${agent} left ${runs.length} run(s) going: ${runs.map(r => r.what).join(' / ').slice(0, 160)}`)
  jobsLookedAt = 0
  $.ui.invalidate('ui.render')
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

// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
const canOpenJob = (job: Job) => Boolean(jobFiles.get(job.id)) && !isRunFromAfar && !isLinux
const openJobOutput = async ($: EngineInterface, job: Job) => {
  const file = jobFiles.get(job.id)
  // A press moves the buttons' keys, so the panel does not keep pulling back to this row
  presses += 1
  $.ui.invalidate('ui.render')
  if (!file || !canOpenJob(job)) return
  const at = await $.clock.now()
  const base = `${dir}/terminal`
  const home = `${base}/output-${slug(job.id) || 'job'}-${at}`
  const path = file.startsWith('~/') ? `"$HOME"/${zshQuoted(file.slice(2))}` : zshQuoted(file)
  const script = ['#!/bin/zsh', `print -r -- $'\\e[2m'${zshQuoted(`${job.label} · ${file}`)}$'\\e[0m'`, `[[ -e ${path} ]] || print -r -- 'Its output is not there (yet): this window shows it once it is written.'`, `exec tail -n 1000 -F ${path}`, ''].join('\n')
  await $.fs.write(`${home}/output.command`, script)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  if (r.exitCode !== 0) void log($, `output not opened: ${r.stderr.trim().slice(0, 160)}`)
}
