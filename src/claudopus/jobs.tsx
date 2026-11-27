// What each piece of work has running: the commands, watches and servers it sent to the background, as Claude Code tracks them,
// each a row on its card's tree with what kind it is, what it is in its own words, how long it has run and how far it is

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id: its latest line and when its output last changed
type Seen = { latest: string; tail?: string[]; pct?: string; done?: string; total?: string; rate?: string; left?: string; isEarlier?: boolean; isOwn?: boolean; words?: string; isEmpty?: boolean; live?: 'busy' | 'idle'; port?: string; wroteAt?: number }
const jobLog = new Map<string, Seen>()
// Each output as last read, by its job: its size and time then, when it last changed (as the shell told it) and its end. One that
// has not moved since is not read again, and starts no process
const jobRead = new Map<string, { sign: string; m: string; text: string }>()
// When each card was last told that one of its jobs wrote something new
const jobNews = new Map<string, number>()
let jobsLookedAt = 0
// How long past its time limit a watch is still waited for to say it ended, before it counts as ended anyway
const WATCH_GRACE = 2 * 60_000
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
let tasksDir = ''
let tasksOf = ''
let tasksMissedAt = 0
// The file each row's output was last read from, by its id, so a press on the row can show it whole
const jobFiles = new Map<string, string>()

// A job as its row shows it, from its command and words: a watch is what waits for something far away and ends when it is there
// (with its title and kind in plain words where the small model gave them, and what it does now)
const jobOf = (id: string, what: string, cmd: string, at: number, isWatch = false, theirs?: Seen & { now?: string }, named?: { title?: string; kind?: string }): Job => {
  const seen = jobLog.get(id) ?? theirs
  const said = describedOf(what)
  // (one the small model says is a cloud job runs on another computer, whatever its line looks like)
  const told: JobKind = isWatch ? 'watch' : jobKindOf(cmd, what)
  const kind: JobKind = told === 'script' && named?.kind === 'cloud job' ? 'remote' : told
  const label = labelOf(said.text || cmd, cmd)
  const now = namedNow.get(id) ?? theirs?.now
  return { id, label, isNamed: Boolean(what) && label !== labelOf('', cmd), cmd, kind, at, ...(seen ?? {}), port: portOf(cmd) ?? seen?.port, ...(named?.title ? { title: named.title, ...(named.kind ? { namedKind: named.kind } : {}) } : {}), ...(now ? { now } : {}) }
}
// The rows a card has: what it sent to the background and Claude Code still tracks, and nothing else; jobs alike are one
const jobsOf = (one: Todo): Job[] => foldJobs((one.bg ?? []).map(b => jobOf(b.id, b.what, b.cmd ?? b.what, b.at, b.isWatch, one.seenJobs?.[b.id], b.named)))

// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for
const jobHead = (job: Job) => {
  if (job.id.startsWith('more-')) return job.label
  const many = job.count && job.count > 1 ? ` ×${job.count}` : ''
  // Named by the small model: its kind in its words, then its title
  if (job.title) return `${namedHead({ title: job.title, kind: job.namedKind as Naming['kind'] })}${job.kind === 'server' && job.port && !job.title.includes(job.port) ? ` :${job.port}` : ''}${many}`
  const kind = `${JOB_HEAD[job.kind]}${job.kind === 'server' && job.port ? ` :${job.port}` : ''}${many}`
  // Its own words alone when they say its kind already (Download the CT scans, Watch the cloud jobs)
  // (only when they say the kind it is: a watch named Check that… still leads with Watch)
  const said = describedOf(job.label).kind
  if (job.isNamed && isKindSaid(job.label) && (said === job.kind || (said === 'script' && job.kind === 'remote'))) return `${job.label}${job.kind === 'server' && job.port && !job.label.includes(job.port) ? ` :${job.port}` : ''}${many}`
  return `${kind} · ${job.label}`
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

// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news
const lookJobs = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - jobsLookedAt < JOB_LOOK) return
  jobsLookedAt = now
  const list = await ownCards($)
  // A watch's output is its events, read as any other
  const owned = list.flatMap(one => (one.chat ? [] : (one.bg ?? []).map(b => ({ owner: one.id, id: b.id }))))
  for (const id of jobLog.keys()) if (!owned.some(o => o.id === id)) jobLog.delete(id)
  for (const id of jobRead.keys()) if (!owned.some(o => o.id === id)) jobRead.delete(id)
  for (const owner of jobNews.keys()) if (!owned.some(o => o.owner === owner)) jobNews.delete(owner)
  if (!owned.length) return
  const sid = await $.session.id().catch(() => '')
  if (sid !== tasksOf) ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0))
  if (!tasksDir && now - tasksMissedAt >= JOB_NEWS) {
    tasksDir = await findTasks($)
    if (!tasksDir) tasksMissedAt = now
  }
  const asked = tasksDir ? owned : []
  const files = asked.map(o => `${tasksDir}/${o.id}.output`)
  jobFiles.clear()
  asked.forEach((o, n) => jobFiles.set(o.id, files[n] ?? ''))
  const ended: string[] = []
  // How each ended, where its output says: finished, failed with its code, or killed
  const endedAs: Record<string, EndAs> = {}
  // What each wrote, as read, for the small model that names them
  const texts: Record<string, string> = {}
  // A watch well past the time limit the engine set it has ended, whether or not its last line was read
  for (const one of list) for (const b of one.bg ?? []) if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE) (ended.push(b.id), (endedAs[b.id] = 'timed out'))
  let isChanged = false
  const moved = new Set<string>()
  if (files.length) {
    // One go: the end of each output with when it last changed
    // (stat as this system has it: a Mac tried Linux's form first, a failed process for each output every few seconds)
    const mtime = isLinux ? 'm=$(stat -c %Y "$f" 2>/dev/null || echo 0)' : 'm=$(stat -f %m "$f" 2>/dev/null || echo 0)'
    const script = `for f; do ${mtime}; printf '\\n@@JOB@@ %s %s\\n' "$m" "$f"; tail -c ${JOB_TAIL} "$f" 2>/dev/null; done`
    // Only the outputs that moved since they were last read (by size and time, asked of the file system, no process), or whose
    // size and time it does not tell
    const signs = await Promise.all(files.map(file => $.fs.stat(file).then(st => (st.mtimeMs ? `${st.size}:${st.mtimeMs}` : ''), () => '')))
    const moving = asked.flatMap((o, n) => (signs[n] && jobRead.get(o.id)?.sign === signs[n] ? [] : [n]))
    const r = moving.length ? await $.process.run(['sh', '-c', script, 'sh', ...moving.map(n => files[n] ?? '')], { timeoutMs: 5000 }).catch(() => undefined) : { stdout: '' }
    if (!r) return
    const parts = r.stdout.split(/\n@@JOB@@ ([^\n]*)\n/)
    // The outputs come back in the order they were asked for, each after when it last changed
    for (let n = 1; n + 1 < parts.length; n += 2) {
      const at = moving[(n - 1) / 2] ?? -1
      const id = asked[at]?.id
      if (id) jobRead.set(id, { sign: signs[at] ?? '', m: parts[n] ?? '', text: parts[n + 1] ?? '' })
    }
    for (const job of asked) {
      const id = job.id
      const read = jobRead.get(id)
      if (!read) continue
      const text = read.text
      texts[id] = text
      const m = Number(read.m.split(' ')[0] ?? 0) * 1000
      // One that ended, by the engine's last line on its output, and when: as that output last changed
      const end = runEndOf(text)
      // (one that failed with why, read from the end of what it wrote)
      const why = end?.how === 'failed' ? whyOf(text) : ''
      if (end) (ended.includes(id) || ended.push(id), (endedAs[id] = { ...end, ...(m ? { at: m } : {}), ...(why ? { why } : {}) }))
      // A task's background command that failed is read as one held open is: an error in its last lines naming a file another running
      // task changed lately in the same checkout tells that task, and the task whose command it was (crossing.tsx)
      const failedCmd = end?.how === 'failed' && job?.owner ? (list.find(one => one.id === job.owner)?.bg?.find(b => b.id === id)?.cmd ?? '') : ''
      if (failedCmd && job?.owner) {
        const owner = job.owner
        void crossEnded($, { tool: 'Bash', agentId: owner, command: failedCmd }, {}, text, true)
          .then(line => (line ? tell($, owner, line) : undefined))
          .catch(err => log($, `a failed background command not read for crossing: ${String(err)}`))
      }
      // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote
      const seen = { ...latestOf(text), ...(m && !text.trim() ? { isEmpty: true } : {}) }
      const was = jobLog.get(id)
      // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
      const kept = !seen.pct && !seen.done && was?.isOwn ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {}
      const next: Seen = { ...seen, tail: tailOf(text), ...kept, ...(m ? { wroteAt: m } : {}) }
      const isSame = was?.latest === next.latest && was?.words === next.words && was?.pct === next.pct && was?.done === next.done && was?.total === next.total && was?.rate === next.rate && was?.left === next.left && was?.isEmpty === next.isEmpty && was?.isEarlier === next.isEarlier && was?.wroteAt === next.wroteAt && was?.tail?.join('\n') === next.tail?.join('\n')
      if (isSame) continue
      jobLog.set(id, next)
      isChanged = true
      const owner = job?.owner
      if (seen.latest && owner && was && was.latest !== seen.latest && now - (jobNews.get(owner) ?? 0) >= JOB_NEWS) moved.add(owner)
    }
  }
  // A command that has written nothing for a minute: whether the programs that hold its log open use the processor, looked at
  // every LIVE_LOOK, so its row can say it is still busy or idle instead of leaving that to a guess (19 Nov: a command silent for
  // 20 minutes, and nothing said whether it still ran)
  const quiet = asked.filter(o => {
    if (ended.includes(o.id)) return false
    const b = list.find(one => one.id === o.owner)?.bg?.find(b => b.id === o.id)
    const seen = jobLog.get(o.id)
    if (!b || b.isWatch || !seen) return false
    return now - (seen.wroteAt && !seen.isEmpty ? seen.wroteAt : b.at) >= SILENT_WARN
  })
  for (const o of asked) if (!quiet.includes(o) && jobLog.get(o.id)?.live) (jobLog.set(o.id, { ...(jobLog.get(o.id) as Seen), live: undefined }), (isChanged = true))
  if (quiet.length && now - liveLookedAt >= LIVE_LOOK) {
    liveLookedAt = now
    const r = await $.process.run(['sh', '-c', LIVE_SCRIPT, 'sh', ...quiet.map(o => `${tasksDir}/${o.id}.output`)], { timeoutMs: 8000 }).catch(() => undefined)
    for (const m of (r?.stdout ?? '').matchAll(/^@@LIVE@@ (\d+) (.*)$/gm)) {
      const o = quiet.find(o => `${tasksDir}/${o.id}.output` === m[2])
      const seen = o ? jobLog.get(o.id) : undefined
      const live = Number(m[1]) >= LIVE_BUSY ? 'busy' : 'idle'
      if (o && seen && seen.live !== live) (jobLog.set(o.id, { ...seen, live }), (isChanged = true))
    }
  }
  // Each command that needs it is named afresh in plain words, in the background: never waited for here
  void nameJobs($, list, texts, endedAs).catch(err => log($, `commands not named: ${String(err)}`))
  // A background command that has ended, by the engine's last line on its output, leaves its card
  if (ended.length) {
    await dropBackground($, ended, endedAs)
    for (const id of ended) (jobLog.delete(id), jobRead.delete(id))
    isChanged = true
  }
  // (not waited for: a work's chat may take its time to take a line, and the look goes on meanwhile)
  void tellSilent($, list, now).catch(err => log($, `silent runs not told: ${String(err)}`))
  void endWatchers($, await ownCards($), now).catch(err => log($, `watchers not stopped: ${String(err)}`))
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await changeTodos($, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  // A command that ended leaves its row at once; new output alone waits for the panel's next calm drawing (calmLook, every CALM while
  // work runs): drawn afresh at each output, seven tasks' commands drew the panel without a pause and no click held (16 Nov)
  if (ended.length) void drawFresh($)
  else if (isChanged) outputMoved = true
}
let outputMoved = false
// How often a silent command's programs are looked at, how much of a processor counts as busy (percent, all of them together),
// and the look itself: who holds each log open, and what they use
const LIVE_LOOK = 20_000
const LIVE_BUSY = 3
let liveLookedAt = 0
const LIVE_SCRIPT = `command -v lsof >/dev/null 2>&1 || exit 0; for f; do p=$(lsof -t "$f" 2>/dev/null | tr '\\n' ',' | sed 's/,$//'); [ -n "$p" ] || continue; c=$(ps -o pcpu= -p "$p" 2>/dev/null | awk '{s+=$1} END{printf "%d", s+0.5}'); echo "@@LIVE@@ $c $f"; done`

// A short time since, for a row's side: seconds, minutes, or hours and minutes
const shortAgo = (ms: number) => {
  const all = Math.max(0, Math.floor(ms / 1000))
  return all < 60 ? `${all}s` : all < 3600 ? `${Math.floor(all / 60)}m` : `${Math.floor(all / 3600)}h ${String(Math.floor(all / 60) % 60).padStart(2, '0')}m`
}

// A press on Stop on a row ends its command as the engine stops one (TaskStop). The task is told in its own chat that the person
// stopped it, and what to do next. On this Mac only
const canStopJob = (job: Job) => !isRunFromAfar && !job.id.startsWith('more-')
const stoppingJobs = new Set<string>()
const RUN_STOPPED = (what: string, silent: string) =>
  silent
    ? `${who(true)} stopped your command "${what}" from the panel because it looked stuck: it had printed nothing for ${silent}. Don't start it again as it was: find out why it stalled, make it print a plain \`progress:\` line as it goes, and start it again only if it is still needed.`
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
// A command that only reads another's output (a tail or grep left going) outlives what it watches once no command of its task, the
// task above it or the helpers under that one still goes, or once its task has ended: it is stopped then, and its task told while
// it is at work. Never a watch that looks for something far away, which ends by itself when that is there
const WATCHER_STOPPED = (what: string) => `Your command "${what}" was stopped: it only read the output of commands that have all ended. Don't start a command that only reads another's output: the end of a command of yours starts your next step by itself.`
const watchersTried = new Set<string>()
const endWatchers = async ($: EngineInterface, list: Todo[], now: number) => {
  const runsOf = (one: Todo) => (one.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, cmd: b.cmd ?? '' }))
  for (const one of list) {
    if (one.chat) continue
    const watchers = runsOf(one).filter(run => watcherOf(run.cmd) && !stoppingJobs.has(run.id) && !watchersTried.has(run.id))
    if (!watchers.length) continue
    const top = topOf(list, one.id)
    const tree = [list.find(card => card.id === top), ...underOf(list, top)].filter((card): card is Todo => Boolean(card))
    const isWatched = tree.some(card => card.status === 'working' && (runsOf(card).some(run => !watcherOf(run.cmd)) || (card.running?.cmd !== undefined && !watcherOf(card.running.cmd)) || (card.id !== one.id && card.parentId !== undefined)))
    if (one.status === 'working' && isWatched) continue
    for (const run of watchers) {
      const job = jobsOf(one).find(j => j.id === run.id) ?? jobsOf({ ...one, bg: one.bg?.filter(b => b.id === run.id) })[0]
      if (!job || now - job.at < 60_000) continue
      // (tried once: one that cannot be stopped is left to its row's Stop)
      watchersTried.add(job.id)
      stoppingJobs.add(job.id)
      try {
        await stopping($, one.id, job, one.status === 'working' ? WATCHER_STOPPED(job.label) : '')
      } finally {
        stoppingJobs.delete(job.id)
      }
      await log($, `run ${job.id} of work ${one.id} stopped: it only read the output of runs that have ended`)
    }
  }
}
// (`said`: what the work is told instead of the person's stop, nothing when empty)
const stopping = async ($: EngineInterface, owner: string, job: Job, said?: string) => {
  const now = await $.clock.now()
  const card = (await ownCards($)).find(one => one.id === owner)
  const bg = card?.bg?.find(b => b.id === job.id)
  if (!bg) return void (await log($, `run ${job.id} of work ${owner} could not be stopped: its card no longer has it`))
  const r = await $.tool.call({ tool: 'TaskStop', task_id: bg.id }).catch(err => ({ deny: String(err) }))
  // Not stopped: nothing is said to have stopped, and the row stays as it is
  if ((r as { deny?: unknown }).deny) return void (await log($, `run ${bg.id} not stopped by the engine: ${String((r as { deny?: unknown }).deny)}`))
  await dropBackground($, [bg.id], 'stopped')
  const silent = job.wroteAt && !job.isEmpty ? now - job.wroteAt : now - job.at
  // (a task that has finished is told nothing: the server it left for the person is the person's to stop)
  if (card?.status === 'working') {
    if (said === undefined) void tell($, owner, RUN_STOPPED(job.label, job.kind !== 'server' && job.kind !== 'watch' && silent >= SILENT_WARN ? shortAgo(silent) : ''))
    else if (said) void tell($, owner, said)
  }
  jobLog.delete(job.id)
  silentTold.delete(job.id)
  if (said === undefined) await log($, `the person stopped run ${job.id} of work ${owner}`)
}

// A command of a task at work that has printed nothing for a minute is named to that task once, in its own chat, which it reads at
// its next step. Not a server or a watch, which speak only when there is something to say
const RUN_SILENT_TOLD = 60_000
const silentTold = new Set<string>()
const RUN_SILENT = (what: string, silent: string, live?: 'busy' | 'idle') =>
  `Your command "${what}" has printed nothing for ${silent}${live === 'busy' ? ', and its programs are still using the processor, so it is likely still working' : live === 'idle' ? ', and its programs are not using the processor: it is stuck, or waits on something far away' : ''}. Look at it now: if it is stuck, stop it with TaskStop and find out why; if it is still working, let it finish, and make what you run next print a plain \`progress:\` line as it goes.`
// A cloud job that sends nothing back cannot be followed from its card: its task is told to bring the job's own output back
const CLOUD_SILENT = (what: string, silent: string) =>
  `Your cloud job "${what}" has sent nothing back for ${silent}, so its card and its log show nothing of what the cloud machine does, and ${who()} cannot tell whether it works. Look at it now. If it is stuck, stop it with TaskStop and find out why. If it works, make its own output come back while it runs: from a command of yours sent to the background, follow the job's log from its first line until the job ends (\`ssh <machine> 'tail -n +1 -f <its log>'\`, \`az ml job stream\`, \`kubectl logs -f\`), never a call that answers only at the end; print \`state: queued\`, \`state: starting\`, \`state: running\` as it changes, have the job print a \`progress:\` line as it goes, and about once a minute one line of how busy its machine is, such as \`machine: GPU 87% · 14 of 24 GB\`. Never print a key, a token or a signed link.`
const tellSilent = async ($: EngineInterface, list: Todo[], now: number) => {
  for (const one of list) {
    if (one.status !== 'working' || one.chat) continue
    for (const job of jobsOf(one)) {
      // (not the mod's own runners, which say how they go themselves)
      if (job.kind === 'server' || job.kind === 'watch' || job.id.startsWith('more-') || silentTold.has(job.id) || /\bbin\/(?:admin|secret|release|keyring)\b/.test(job.cmd)) continue
      if (!job.wroteAt) continue
      const silent = job.isEmpty ? now - job.at : now - job.wroteAt
      if (silent < RUN_SILENT_TOLD) continue
      silentTold.add(job.id)
      void tell($, one.id, job.kind === 'remote' ? CLOUD_SILENT(job.title || job.label, shortAgo(silent)) : RUN_SILENT(job.label, shortAgo(silent), job.live))
      await log($, `work ${one.id} told its run ${job.id} has been silent ${shortAgo(silent)}`)
    }
  }
  // (a run that speaks again may be named again when it next goes silent)
  for (const id of silentTold) if (jobLog.get(id)?.wroteAt && now - (jobLog.get(id)?.wroteAt ?? 0) < RUN_SILENT_TOLD) silentTold.delete(id)
}
// A run in its own words
const runWords = (what: string, cmd = '') => labelOf(describedOf(what).text, cmd)


// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
// A command that has ended keeps the file it wrote to, so its output opens the same way from where its end is said
const canOpenFile = (file: string | undefined) => Boolean(file) && !isRunFromAfar
const canOpenJob = (job: Job) => canOpenFile(jobFiles.get(job.id))
const openJobOutput = async ($: EngineInterface, job: Pick<Job, 'id' | 'label'>, written?: string) => {
  const file = written ?? jobFiles.get(job.id)
  // A press moves the buttons' keys, so the panel does not keep pulling back to this row
  presses += 1
  drawAgain($)
  if (!file || !canOpenFile(file) || isLinux) return
  const at = await $.clock.now()
  const base = `${dir}/terminal`
  const home = `${base}/output-${slug(job.id) || 'job'}-${at}`
  const path = file.startsWith('~/') ? `"$HOME"/${zshQuoted(file.slice(2))}` : zshQuoted(file)
  const script = ['#!/bin/zsh', `print -r -- $'\\e[2m'${zshQuoted(`${job.label} · ${file}`)}$'\\e[0m'`, `[[ -e ${path} ]] || print -r -- 'No output yet. It shows here as soon as the command writes something.'`, `exec tail -n 1000 -F ${path}`, ''].join('\n')
  await $.fs.write(`${home}/output.command`, script)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  if (r.exitCode !== 0) void log($, `output not opened: ${r.stderr.trim().slice(0, 160)}`)
}

// A command's log is a tab of the panel, named after the command: what it is and how it stands, then the end of what it wrote,
// drawn again as it writes; the same for one that has ended, from the file it left. A press on a command's name opens it
// The tasks and helpers whose ended commands are folded away in Details
const endedFolded = new Set<string>()
// and those opened again by a press in a Details tab drawn with less in it, where they start folded (drawingFits)
const endedOpened = new Set<string>()
const LOG_PANE = 'log-'
const LOG_LINES = 300
const logPaneOf = (id: string) => `${LOG_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64)
const openLog = ($: EngineInterface, id: string, label: string) => {
  presses += 1
  void comingTab((async () => {
    await front($, logPaneOf(id), cut(label || 'Log', 30))
    redraw($)
  })()).catch(err => log($, `log of ${id} not opened: ${String(err)}`))
}
// The command a log tab is of, running or ended, with its task and the file it writes to
const logOf = async ($: EngineInterface, paneId: string) => {
  for (const one of await ownCards($)) {
    const b = one.bg?.find(b => logPaneOf(b.id) === paneId)
    if (b) return { one, job: jobOf(b.id, b.what, b.cmd ?? b.what, b.at, b.isWatch, one.seenJobs?.[b.id], b.named), run: undefined, file: jobFiles.get(b.id) || (tasksDir ? `${tasksDir}/${b.id}.output` : '') }
    const run = one.endedRuns?.find(r => logPaneOf(r.id) === paneId)
    // (one kept before its file was: where this chat's commands write, by its id)
    if (run) {
      const where = run.file || one.chat ? '' : tasksDir || (tasksDir = await findTasks($))
      return { one, job: undefined, run, file: run.file || (where ? `${where}/${run.id}.output` : '') }
    }
  }
  return undefined
}
const logView = async ($: EngineInterface, ui: Ui, paneId: string) => {
  const { Box, Button, Text } = ui
  const found = await logOf($, paneId)
  if (!found) return <Text dimColor>This log is no longer available.</Text>
  const { one, job, run, file } = found
  const now = await $.clock.now()
  const label = job ? (job.title ?? job.label) : run ? runLabel(run) : 'A command'
  // (why it failed, in plain words, where the small model said)
  const why = run?.how === 'failed' ? run.named?.why : undefined
  const kind: JobKind = job?.kind ?? run?.kind ?? 'script'
  const state = job ? `${JOB_NOW[kind]} · ${took(now - job.at)}` : run ? `${endedLine(run, took(run.endedAt - run.at))} · ${shortAgo(now - run.endedAt)} ago` : ''
  const r = file && canOpenFile(file) ? await $.process.run(['sh', '-c', 'tail -n "$2" "$1" 2>/dev/null # the log tab', 'sh', file, String(LOG_LINES + 1)], { timeoutMs: 5000 }).catch(() => undefined) : undefined
  const all = logLines(r?.stdout ?? '')
  const lines = all.slice(-LOG_LINES)
  const isFailed = run?.how === 'failed'
  return (
    <Box key="log" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="log-head" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" gap={1}>
          <Box flexShrink={0}>
            <Text color={isFailed ? 'error' : job ? JOB_COLOR[kind] : undefined} dimColor={!job && !isFailed}>{JOB_GLYPH[kind]}</Text>
          </Box>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold wrap="wrap">{label}</Text>
          </Box>
        </Box>
        {isFailed ? <Text color="error" wrap="wrap">{why ? `${state} · ${why}` : state}</Text> : null}
        <Text dimColor wrap="wrap">{[isFailed ? '' : state, `of the task “${cut(titleOf(one), 40)}”`].filter(Boolean).join(' · ')}</Text>
        <Box flexDirection="row" gap={2} flexShrink={0}>
          {job && canStopJob(job) ? <Button key={`log-stop-${presses}`} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain onPress={() => void stopJob($, one.id, job).catch(err => log($, `run not stopped: ${String(err)}`))} /> : null}
          <Button key={`log-details-${presses}`} label="Details" plain onPress={() => openWork($, one.id)} />
          {file && canOpenFile(file) && !isLinux ? <Button key={`log-terminal-${presses}`} label="Open in Terminal" plain onPress={() => void openJobOutput($, { id: job?.id ?? run?.id ?? '', label }, file).catch(err => log($, `output not opened: ${String(err)}`))} /> : null}
        </Box>
      </Box>
      <Box key="log-lines" flexDirection="column" backgroundColor={OUTPUT_FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {all.length > lines.length ? <Text dimColor>{`The last ${LOG_LINES} lines`}</Text> : null}
        {lines.length ? (
          lines.map((line, n) => (
            <Text key={`log-line-${n}`} wrap="wrap">{line || ' '}</Text>
          ))
        ) : (
          <Text dimColor wrap="wrap">{!file || !canOpenFile(file) ? "This log isn't on this Mac." : job ? (kind === 'remote' ? 'Nothing has come back from the cloud machine yet. The command that started the job still waits for it, and its task has been told to bring the job\'s own output here as it runs.' : 'No output yet. It shows here as soon as the command writes something.') : 'It wrote nothing.'}</Text>
        )}
      </Box>
    </Box>
  )
}
