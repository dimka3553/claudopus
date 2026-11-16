// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id: its latest line, when its output last changed, whether its processes are paused,
// and for a wait, how what it waits for stands
type Seen = { latest: string; mem?: string; isUntold?: boolean; tail?: string[]; pct?: string; done?: string; total?: string; rate?: string; left?: string; isEarlier?: boolean; isOwn?: boolean; words?: string; isEmpty?: boolean; port?: string; wroteAt?: number; isPaused?: boolean; target?: string }
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
// A command held open is a row of its own once it has run this long, so no command runs past ten seconds without a line that
// says how it goes (it was two minutes, and on 16 Nov commands ran for minutes with nothing on their card)
const ROW_SHOWN = 10_000

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
    ...(one.status === 'working' && one.running?.cmd && at - one.running.at >= ROW_SHOWN
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
  await changeTodos($, list =>
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
  const held = list.flatMap(one => (one.status === 'working' && one.running?.cmd && now - one.running.at >= ROW_SHOWN ? [{ owner: one.id, id: `call-${one.id}`, cmd: one.running.cmd, at: one.running.at }] : []))
  // A row's command that changed (another held call of the same card ran longest) starts afresh
  for (const [id, was] of callFiles) if (!held.some(h => h.id === id && h.at === was.at)) (callFiles.delete(id), jobLog.delete(id), silentTold.delete(id))
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
  // (sooner while a command held open is not yet found, so its row reads its output within seconds)
  const isPs = now - jobProcsAt >= JOB_PS || (unfound.length > 0 && now - jobProcsAt >= JOB_LOOK)
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
  // ps gives each process's age: its start is that age before ps answered, not before this look began (on a slow Mac the look can
  // start well before its ps runs, and every shell then seemed to start earlier than it did, too early to be the command held open)
  if (psText !== undefined) ((jobProcs = procsOf(psText, await $.clock.now())), (jobProcsAt = now))
  // What a command left going, however it was started, becomes a run of its card as soon as the processes show it
  if (psText !== undefined && spans.length) await adoptLeft($, jobProcs, now).catch(err => log($, `left runs not followed: ${String(err)}`))
  const alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean))
  const changed = new Map([...body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g)].map(m => [m[2] ?? '', Number(m[1]) * 1000]))
  // A detached job whose process ended leaves its card, kept as ended (how its process ended is not known)
  const gone = owned.filter(o => o.pid && !alive.has(o.pid)).map(o => o.id)
  if (gone.length && /@@ALIVE@@/.test(r.stdout)) {
    const runsOf = (one: Todo) => (one.detached ?? []).filter(d => gone.includes(d.id)).map(d => ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'ended' as const }))
    // (what this look took off its card: a run another look or a stop already took off is not woken for again)
    const taken = new Map<string, NonNullable<Todo['detached']>>()
    await changeTodos($, cards =>
      cards.map(one => {
        const ended = (one.detached ?? []).filter(d => gone.includes(d.id))
        if (!ended.length) return one
        // (one being stopped now is told by its stop, read here as the run leaves its card)
        taken.set(one.id, ended.filter(d => !stoppingJobs.has(d.id)))
        const left = (one.detached ?? []).filter(d => !gone.includes(d.id))
        return { ...one, detached: left.length ? left : undefined, ...keepEnded(one, runsOf(one)) }
      }),
    )
    void drawFresh($)
    // The engine wakes work only for what it sent to the background itself: the work is woken here the moment a run it left
    // detached ends, so it carries on at once and never waits on it. Not work the person stopped, a run they or the work stopped
    // itself, a server, nor work that has handed back its report; one message for the runs of a card that ended together
    const fresh = await read($, todos)
    for (const [id, ended] of taken) {
      const runs = ended.filter(d => !stoppingJobs.has(d.id) && !killedByWork.has(d.id) && !SERVER_CMD.test(d.cmd) && describedOf(d.what).kind !== 'server')
      if (runs.length) void wakeForRun($, fresh.find(one => one.id === id), runs).catch(err => log($, `work ${id} not woken as its run ended: ${String(err)}`))
    }
    for (const id of gone) killedByWork.delete(id)
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
    return at && now - at >= JOB_QUIET ? `what it waits on has not changed for ${shortAgo(now - at)}` : ''
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
    const isSame = was?.latest === next.latest && was?.words === next.words && was?.pct === next.pct && was?.done === next.done && was?.total === next.total && was?.rate === next.rate && was?.left === next.left && was?.isEmpty === next.isEmpty && was?.isEarlier === next.isEarlier && was?.wroteAt === next.wroteAt && was?.isPaused === next.isPaused && was?.target === next.target && was?.tail?.join('\n') === next.tail?.join('\n')
    // Memory alone moving (a MB or so at each look) is kept for the next drawing, never a reason to draw the panel afresh under the pointer
    if (isSame) {
      if (was?.mem !== next.mem) jobLog.set(id, next)
      continue
    }
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
    if (was?.isUntold && was.isPaused === next.isPaused) {
      if (was.mem !== next.mem) jobLog.set(o.id, next)
      continue
    }
    jobLog.set(o.id, next)
    isChanged = true
  }
  // A background command that has ended, by the engine's last line on its output or as no shell runs it, leaves its card
  if (ended.length) {
    await dropBackground($, ended, endedAs)
    for (const id of ended) (jobLog.delete(id), shellMissed.delete(id))
    isChanged = true
  }
  // (not waited for: a work's chat may take its time to take a line, and the look goes on meanwhile)
  void tellSilent($, list, now).catch(err => log($, `silent runs not told: ${String(err)}`))
  void endWatchers($, await read($, todos), now).catch(err => log($, `watchers not stopped: ${String(err)}`))
  if (psText !== undefined) void endWaiters($, await read($, todos), now).catch(err => log($, `waits not stopped: ${String(err)}`))
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await changeTodos($, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  if (isChanged) void drawFresh($)
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
    added.set(span.agent, [...(added.get(span.agent) ?? []), { id: `left-${one.top.pid}-${span.id}`, what, at: Math.min(now, Math.max(span.at, one.top.startAt)), cmd: oneLine(one.top.command).slice(0, 400), log, pid: one.top.pid, isLeft: true, ...(span.bgId ? { from: span.bgId } : {}) }])
  }
  if (!added.size) return
  await changeTodos($, cards => cards.map(one => (added.has(one.id) ? { ...one, detached: [...(one.detached ?? []).filter(d => !added.get(one.id)?.some(a => a.id === d.id)), ...(added.get(one.id) ?? [])].slice(-BG_KEPT) } : one)))
  for (const [agent, runs] of added) await log($, `work ${agent} left ${runs.length} run(s) going: ${runs.map(r => r.what).join(' / ').slice(0, 160)}`)
  jobsLookedAt = 0
  void drawFresh($)
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

// A press on Stop on a run's row ends it: a command sent to the background is stopped as the engine stops one, a command started
// detached or left going has its process and all it started ended, a command held open has its shell's processes ended (the work's
// call then comes back with it ended). The work is told in its own chat that the person stopped it as stuck, and what to do next.
// On this Mac only, as the processes are this Mac's
const canStopJob = (job: Job) => !isRunFromAfar && !job.id.startsWith('more-')
const stoppingJobs = new Set<string>()
const RUN_STOPPED = (what: string, silent: string) =>
  silent
    ? `${who(true)} stopped your command "${what}" from the panel because it looked stuck: it had printed nothing for ${silent}. A command must never be stuck or silent. Don't start it again as it was: find out why it stalled, make it print a plain \`progress:\` line at least every 10 seconds, and start it again only if it is still needed.`
    : `${who(true)} stopped your command "${what}" from the panel. Don't start it again unless ${who()} asks for it. Continue without it, or ask them if you need it.`
const stopJob = async ($: EngineInterface, owner: string, job: Job) => {
  if (!canStopJob(job) || stoppingJobs.has(job.id)) return
  stoppingJobs.add(job.id)
  presses += 1
  drawAgain($)
  try {
    await stopping($, owner, job)
  } finally {
    stoppingJobs.delete(job.id)
    presses += 1
    jobsLookedAt = 0
    void drawFresh($)
  }
}
// A run that only watches (a tail or grep left going) outlives what it watches once no run of its work, the work above it or the
// helpers under that one still goes, or once its work has ended: it is stopped then, and its work told while it is at work
const WATCHER_STOPPED = (what: string) => `Claudopus stopped your command "${what}": it only watched commands that have all ended. Don't start a command that only watches another; you are woken the moment a command of yours ends.`
const watchersTried = new Set<string>()
const endWatchers = async ($: EngineInterface, list: Todo[], now: number) => {
  const runsOf = (one: Todo) => [...(one.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, cmd: b.cmd ?? '' })), ...(one.detached ?? []).map(d => ({ id: d.id, cmd: d.cmd }))]
  for (const one of list) {
    if (one.chat) continue
    const watchers = runsOf(one).filter(run => watcherOf(run.cmd) && !stoppingJobs.has(run.id) && !watchersTried.has(run.id))
    if (!watchers.length) continue
    const top = topOf(list, one.id)
    const tree = [list.find(card => card.id === top), ...underOf(list, top)].filter((card): card is Todo => Boolean(card))
    const isWatched = tree.some(card => card.status === 'working' && (runsOf(card).some(run => !watcherOf(run.cmd)) || (card.running?.cmd !== undefined && !watcherOf(card.running.cmd)) || (card.id !== one.id && card.parentId !== undefined)))
    if (one.status === 'working' && isWatched) continue
    for (const run of watchers) {
      const job = jobsOf(one, now).find(j => j.id === run.id) ?? jobsOf({ ...one, bg: one.bg?.filter(b => b.id === run.id), detached: one.detached?.filter(d => d.id === run.id), running: undefined }, now)[0]
      if (!job || now - job.at < 60_000) continue
      // (tried once: one that cannot be stopped is left to its row's Stop run)
      watchersTried.add(job.id)
      stoppingJobs.add(job.id)
      try {
        await stopping($, one.id, job, one.status === 'working' ? WATCHER_STOPPED(job.label) : '')
      } finally {
        stoppingJobs.delete(job.id)
      }
      await log($, `run ${job.id} of work ${one.id} stopped: it only watched runs that have ended`)
    }
  }
}
// A command of a work's or a helper's whose processes, at two looks in a row, do nothing but pass time or follow something (only a
// sleep, a log followed, a tool made to wait at the end of its tree), however its words were written: it only waits, so it is
// stopped and its work told what wakes it instead. What the words let through is caught here as it runs (a function, a nested
// shell, a sleep given by a variable). Not a Monitor watch, whose lines the work is told, nor a server
const WAITER_STOPPED = (what: string) =>
  `Claudopus stopped your command "${what}": all it did was wait, and nothing you start may only wait. Your own commands wake you the moment they end, and each helper's result comes to you as a message: carry on, or end your step. For a file, a page or a time that nothing of yours makes, a task calls \`wake_me\`; a helper hands back what it waits for.`
// What each run's processes have shown at the looks: since when they only waited, the sleeps seen, and whether they ever did work.
// A run that ever did work is never stopped (a script that sleeps between its steps, a retry, a deploy that waits for a service);
// one is stopped only when, at every look over a minute, it did nothing but pass time, by sleeps that came and went (a loop) or one
// that has run two minutes
const waiterSeen = new Map<string, { since: number; looks: number; sleepers: Set<string>; longest: number }>()
const workSeen = new Set<string>()
const WAITER_FOR = 60_000
const WAITER_LONE = 120_000
const endWaiters = async ($: EngineInterface, list: Todo[], now: number) => {
  // (every card's commands matched against the shells at once, so two alike never claim the same shell)
  const allBgs = list.flatMap(one => (one.chat || one.status !== 'working' ? [] : (one.bg ?? []).filter(b => !b.isWatch && !SERVER_CMD.test(b.cmd ?? '') && describedOf(b.what).kind !== 'server')))
  const shells = allBgs.length ? shellsOf(jobProcs, allBgs.map(b => ({ id: b.id, cmd: b.cmd ?? '', at: b.at }))) : new Map<string, string | true | null>()
  const runs = list.flatMap(one => {
    if (one.chat || one.status !== 'working') return []
    const bgs = allBgs.filter(b => (one.bg ?? []).includes(b))
    return [
      ...bgs.flatMap(b => (typeof shells.get(b.id) === 'string' ? [{ owner: one, id: b.id, pid: shells.get(b.id) as string }] : [])),
      ...(one.detached ?? []).filter(d => d.pid && !SERVER_CMD.test(d.cmd) && describedOf(d.what).kind !== 'server').map(d => ({ owner: one, id: d.id, pid: d.pid ?? '' })),
      ...(one.running?.cmd && now - one.running.at >= ROW_SHOWN ? ((pid => (pid ? [{ owner: one, id: `call-${one.id}`, pid }] : []))(heldShellOf(jobProcs, one.running.cmd, one.running.at))) : []),
    ]
  })
  for (const id of waiterSeen.keys()) if (!runs.some(run => run.id === id)) waiterSeen.delete(id)
  for (const id of workSeen) if (!runs.some(run => run.id === id)) workSeen.delete(id)
  for (const run of runs) {
    if (workSeen.has(run.id)) continue
    const leaves = waiterLeavesOf(jobProcs, run.pid)
    if (!leaves) {
      // (a shell with nothing under it shows nothing of what it does: neither work nor a wait)
      if (treeOf(jobProcs, run.pid).length > 1) (workSeen.add(run.id), waiterSeen.delete(run.id))
      continue
    }
    const seen = waiterSeen.get(run.id) ?? { since: now, looks: 0, sleepers: new Set<string>(), longest: 0 }
    seen.looks += 1
    for (const leaf of leaves) (seen.sleepers.add(leaf.pid), (seen.longest = Math.max(seen.longest, now - leaf.startAt)))
    waiterSeen.set(run.id, seen)
    const isLoop = seen.sleepers.size >= 3 && seen.looks >= 3 && now - seen.since >= WAITER_FOR
    if ((!isLoop && seen.longest < WAITER_LONE) || stoppingJobs.has(run.id)) continue
    const job = jobsOf(run.owner, now).find(j => j.id === run.id) ?? jobsOf({ ...run.owner, bg: run.owner.bg?.filter(b => b.id === run.id), detached: run.owner.detached?.filter(d => d.id === run.id) }, now).find(j => j.id === run.id)
    if (!job) continue
    waiterSeen.delete(run.id)
    stoppingJobs.add(job.id)
    try {
      await stopping($, run.owner.id, job, WAITER_STOPPED(job.label))
    } finally {
      stoppingJobs.delete(job.id)
    }
    await log($, `run ${job.id} of ${run.owner.parentId ? 'helper' : 'work'} ${run.owner.id} stopped: all it did was wait`)
  }
}
// (`said`: what the work is told instead of the person's stop, nothing when empty)
const stopping = async ($: EngineInterface, owner: string, job: Job, said?: string) => {
  const now = await $.clock.now()
  const list = await read($, todos)
  const card = list.find(one => one.id === owner)
  const bg = card?.bg?.find(b => b.id === job.id)
  const detached = card?.detached?.find(d => d.id === job.id)
  // The processes to end: the detached one's, or the held shell's, with every process under them
  const procs = jobProcs.length ? jobProcs : procsOf((await $.process.run(['ps', '-axww', '-o', PS_COLUMNS], { timeoutMs: 5000 }).catch(() => ({ stdout: '' }))).stdout, now)
  // A background command's own shell, found as the look finds it, so it is ended even where the engine does not stop it
  const bgShell = bg && !bg.isWatch && procs.length ? shellsOf(procs, [{ id: bg.id, cmd: bg.cmd ?? '', at: bg.at }]).get(bg.id) : undefined
  const top = detached?.pid ?? (typeof bgShell === 'string' ? bgShell : undefined) ?? (job.id.startsWith('call-') && card?.running?.cmd ? heldShellOf(procs, card.running.cmd, card.running.at) : undefined)
  // (the top one itself even where the processes could not be listed)
  const pids = top ? [...new Set([top, ...treeOf(procs, top).map(p => p.pid)])].filter(isPid) : []
  let isStopped = false
  if (bg) {
    const r = await $.tool.call({ tool: 'TaskStop', task_id: bg.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `run ${bg.id} not stopped by the engine: ${String((r as { deny?: unknown }).deny)}`)
    else isStopped = true
  }
  // Asked to end, then made to a moment later if it has not
  if (pids.length) {
    const r = await $.process.run(['sh', '-c', 'kill -TERM "$@" 2>/dev/null; sleep 2; for p; do kill -0 "$p" 2>/dev/null && kill -KILL "$p" 2>/dev/null; done; for p; do kill -0 "$p" 2>/dev/null && exit 1; done; exit 0', 'sh', ...pids], { timeoutMs: 10_000 }).catch(err => ({ exitCode: 1, stderr: String(err) }))
    if (r.exitCode === 0) isStopped = true
    else await log($, `run ${job.id} not wholly stopped: ${String((r as { stderr?: unknown }).stderr ?? '').trim().slice(0, 160)}`)
  }
  // Nothing found to stop: nothing is said to have stopped, and the row stays as it is
  if (!isStopped) return void (await log($, `run ${job.id} of work ${owner} could not be stopped: nothing of it was found`))
  if (bg) await dropBackground($, [bg.id], 'stopped')
  if (detached) {
    await changeTodos($, cards => cards.map(one => (one.id === owner && one.detached?.some(d => d.id === job.id) ? { ...one, detached: one.detached.filter(d => d.id !== job.id).length ? one.detached.filter(d => d.id !== job.id) : undefined, ...keepEnded(one, [{ id: detached.id, what: detached.what, at: detached.at, endedAt: now, how: 'stopped' }]) } : one)))
  }
  const silent = job.wroteAt && !job.isEmpty ? now - job.wroteAt : now - job.at
  if (said === undefined) void tell($, owner, RUN_STOPPED(job.label, silent >= SILENT_WARN ? shortAgo(silent) : ''))
  else if (said) void tell($, owner, said)
  jobLog.delete(job.id)
  silentTold.delete(job.id)
  if (said !== undefined) return
  await log($, `the person stopped run ${job.id} of work ${owner}${pids.length ? ` (${pids.length} processes)` : ''}`)
  jobLog.delete(job.id)
  silentTold.delete(job.id)
}

// A run of a piece of work that has given no word for a minute is named to that work once, in its own chat: a run is never to be
// stuck or silent, so it stops it or makes it report. Not a server or a watch, which speak only when there is something to say
const RUN_ENDED = (what: string, log: string) =>
  `Your command "${what}" has ended. Look at how it ended${log ? ` in its log, ${log},` : ''} and carry on with the next step now.`
const RUNS_ENDED = (whats: string[]) => `Your commands ${whats.map(what => `"${what}"`).join(', ')} have ended. Look at how each ended in its log and carry on with the next step now.`
const RUN_SILENT_TOLD = 60_000
const silentTold = new Set<string>()
const RUN_SILENT = (what: string, silent: string) =>
  `Your command "${what}" has printed nothing for ${silent}. Look at it now: if it is stuck, stop it (TaskStop for a background command, kill for a detached one) and find out why; if it is still working, let it finish, and make what you run next print a plain \`progress:\` line at least every 10 seconds.`
const tellSilent = async ($: EngineInterface, list: Todo[], now: number) => {
  for (const one of list) {
    if (one.status !== 'working') continue
    for (const job of jobsOf(one, now)) {
      // (not one paused, one whose output cannot be read, or the mod's own runners, which say how they go themselves)
      if (job.kind === 'server' || job.kind === 'watch' || job.id.startsWith('more-') || silentTold.has(job.id) || job.isPaused || job.isUntold || /\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(job.cmd)) continue
      if (!job.wroteAt) continue
      const silent = job.isEmpty ? now - job.at : now - job.wroteAt
      if (silent < RUN_SILENT_TOLD) continue
      silentTold.add(job.id)
      void tell($, one.id, RUN_SILENT(job.label, shortAgo(silent)))
      await log($, `work ${one.id} told its run ${job.id} has been silent ${shortAgo(silent)}`)
    }
  }
  // (a run that speaks again may be named again when it next goes silent)
  for (const id of silentTold) if (jobLog.get(id)?.wroteAt && now - (jobLog.get(id)?.wroteAt ?? 0) < RUN_SILENT_TOLD) silentTold.delete(id)
}

// The detached runs a piece of work stopped itself with a kill naming its process: their end wakes no one
const killedByWork = new Set<string>()
const noteKills = (one: Todo | undefined, command: string) => {
  for (const d of one?.detached ?? []) if (d.pid && new RegExp(`\\b(?:kill|pkill)\\b(?![^;&|]*-0\\b)[^;&|]*\\b${d.pid}\\b`).test(command)) killedByWork.add(d.id)
}
// A work whose run left detached has ended: told in its chat while it is at a step, and started again with a message once its step
// has ended (its turn over, its card finished or waiting on the engine), as an answer of the person's starts it
const wakeForRun = async ($: EngineInterface, one: Todo | undefined, runs: NonNullable<Todo['detached']>) => {
  const first = runs[0]
  if (!one || !first || isHeld(one) || one.status === 'stopped' || one.status === 'failed' || (one.status === 'done' && (one.handedBackAt !== undefined || endedByHandback.has(one.id) || one.endedAt < first.at))) return
  const text = runs.length === 1 ? RUN_ENDED(runWords(first.what, first.cmd), first.log) : RUNS_ENDED(runs.map(d => runWords(d.what, d.cmd)))
  if (one.status === 'working' && !one.waitsSince) {
    await tell($, one.id, text)
    return void (await log($, `work ${one.id} told ${runs.length} run(s) of it ended`))
  }
  const r = (await isReplaced($)) ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' } : await sendOwn($, { to: { agentId: one.id }, text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return void (await log($, `work ${one.id} not started again as its runs ended: ${r.reason}`))
  await wakeCard($, one.id)
  await log($, `work ${one.id} started again as ${runs.length} run(s) of it ended`)
}
// A run in its own words, without the time it was given when it began
const runWords = (what: string, cmd = '') => labelOf(what, cmd).replace(/\s*\((?:about|under|over|around|up to|~)?\s*[\d.,\-– ]+\s*(?:s|sec|seconds?|m|mins?|minutes?|h|hours?)\)\s*$/i, '').trim()

// How a run ended, said after its words
const RUN_ENDED_AS: Record<EndedRun['how'], string> = { finished: 'has finished', failed: 'failed', killed: 'was stopped', stopped: 'was stopped', 'timed out': 'ran out of time', ended: 'has ended' }

// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
const canOpenJob = (job: Job) => Boolean(jobFiles.get(job.id)) && !isRunFromAfar && !isLinux
const openJobOutput = async ($: EngineInterface, job: Job) => {
  const file = jobFiles.get(job.id)
  // A press moves the buttons' keys, so the panel does not keep pulling back to this row
  presses += 1
  drawAgain($)
  if (!file || !canOpenJob(job)) return
  const at = await $.clock.now()
  const base = `${dir}/terminal`
  const home = `${base}/output-${slug(job.id) || 'job'}-${at}`
  const path = file.startsWith('~/') ? `"$HOME"/${zshQuoted(file.slice(2))}` : zshQuoted(file)
  const script = ['#!/bin/zsh', `print -r -- $'\\e[2m'${zshQuoted(`${job.label} · ${file}`)}$'\\e[0m'`, `[[ -e ${path} ]] || print -r -- 'No output yet. This window shows it as soon as the command prints something.'`, `exec tail -n 1000 -F ${path}`, ''].join('\n')
  await $.fs.write(`${home}/output.command`, script)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  if (r.exitCode !== 0) void log($, `output not opened: ${r.stderr.trim().slice(0, 160)}`)
}
