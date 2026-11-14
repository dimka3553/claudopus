// The running jobs a piece of work has, told apart and read: a server, a download or a script, from its command or its own words,
// and the latest line it wrote, from the end of its output. Nothing here touches the engine

export type JobKind = 'server' | 'download' | 'script' | 'watch' | 'wait'
// A job as its row shows it: when its output last changed, whether its processes are paused, how many alike it stands for, and
// for a wait, what it waits for and how that stands
export type Job = {
  id: string
  label: string
  cmd: string
  kind: JobKind
  at: number
  port?: string
  latest?: string
  pct?: string
  wroteAt?: number
  isPaused?: boolean
  count?: number
  waitsFor?: string
  waitFile?: string
  target?: string
}

// How often the jobs' output is read, and how often a job that wrote something new counts as news for its card
export const JOB_LOOK = 5_000
export const JOB_NEWS = 60_000
// At most this many jobs are rows under one card or helper
export const JOBS_SHOWN = 4
// Only the end of each job's output is read
export const JOB_TAIL = 4000

// Purple and a round dot are a helper's alone: a job has its own colour and shape, and its kind in words at the head of its row
export const JOB_COLOR: Record<JobKind, string> = { server: '#4EBA65', download: '#5AA7E6', script: '#36B5A8', watch: '#9A9A9A', wait: '#9A9A9A' }
export const JOB_GLYPH: Record<JobKind, string> = { server: '◆', download: '▼', script: '■', watch: '◇', wait: '◇' }
export const JOB_WORD: Record<JobKind, string> = { server: 'Server running', download: 'Downloading', script: 'Command running', watch: 'Watching', wait: 'Waiting' }
export const JOB_HEAD: Record<JobKind, string> = { server: 'Server', download: 'Download', script: 'Command', watch: 'Watch', wait: 'Wait' }
// Its mark on the tree, drawn: a square, a diamond, a down arrow, an open diamond, never a helper's round dot
export const JOB_SHAPE: Record<JobKind, 'square' | 'diamond' | 'down' | 'open'> = { server: 'diamond', download: 'down', script: 'square', watch: 'open', wait: 'open' }
// A job whose output has not changed for this long says so on its row
export const JOB_QUIET = 10 * 60_000

export const SERVER_CMD =
  /\b(http\.server|http-server|uvicorn|gunicorn|hypercorn|flask run|runserver|vite( dev| preview)?|next (dev|start)|(npm|pnpm|yarn|bun) (run )?(dev|start|serve|preview)|rails s(erver)?|jupyter (lab|notebook)|ollama serve|tensorboard|serve -[sl]|python3? -m (http\.server|uvicorn))\b/i
export const DOWNLOAD_CMD =
  /\b(curl|wget|aria2c|huggingface-cli download|hf download|git clone|git lfs (pull|fetch)|rsync|scp|gsutil (-m )?cp|aws s3 (cp|sync)|pip3? install|uv (pip )?(install|sync)|npm (i|install|ci)|pnpm (i|install)|yarn install|brew install|docker pull|yt-dlp)\b/i

// What kind a job is, from its command, or else its own words for itself
export const jobKindOf = (cmd: string, label: string): JobKind =>
  SERVER_CMD.test(cmd) || /\bserver\b/i.test(label) ? 'server' : DOWNLOAD_CMD.test(cmd) || /\bdownload/i.test(label) ? 'download' : 'script'

// The port a server listens on, from its command or what it wrote
export const portOf = (text: string) =>
  text.match(/(?:--port[= ]|-p |localhost:|127\.0\.0\.1:|0\.0\.0\.0:|\[::\]:|\bport )(\d{2,5})\b/i)?.[1] ?? text.match(/http\.server (\d{2,5})\b/)?.[1]

// A percent is progress when a bar follows it (tqdm and the like), whatever words the line holds; else the first percent on a line
// that also counts toward a total, a rate or a time left. A score, a coverage figure or a table cell is not
const pctOf = (line: string) => {
  const bar = line.match(/(\d{1,3}(?:\.\d+)?)\s?%\s*(\|[█▉▊▋▌▍▎▏░▒▓#\s]*\||\[[=#>.\s-]*\]|[█▉▊▋▌▍▎▏░▒▓])/)
  if (bar) return `${bar[1]}%`
  const counts = /\b\d+\s?\/\s?\d+\b|\b\d+ of \d+\b|\b(it|s)\/s\b|[kMG]i?B\/s\b|\beta\b/i.test(line)
  return counts ? line.match(/\b(\d{1,3}(?:\.\d+)?)\s?%/)?.[1]?.concat('%') : undefined
}
// The engine's own last line on the output of a background command that has ended
export const isOutputEnded = (text: string) => /\[exited with code [^\]\n]*\]\s*$/.test(text)

// The end of a job's output as its latest line: colours and cursor moves taken out, a line a progress bar rewrites read as it
// stands last, with the last percent in it and any port it named
export const latestOf = (text: string) => {
  const clean = text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07]*\x07/g, '')
  const lines = clean
    .split('\n')
    .map(line => line.split('\r').map(part => part.trim()).filter(Boolean).at(-1) ?? '')
    .filter(Boolean)
  const last = lines.at(-1) ?? ''
  const pct = pctOf(last)
  // A web server's access line says only the request and its answer
  const hit = last.match(/"(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) (\S+) HTTP\/[\d.]+" (\d{3})/)
  const line = hit ? `${hit[1]} ${hit[2]} ${hit[3]}` : last
  return { latest: line.replace(/\s+/g, ' ').trim().slice(0, 240), pct, port: portOf(clean) }
}


// A command started detached, with nohup or setsid and its output sent to a file: the command itself, the log as written, and the
// folder a leading `cd` moved it to; undefined for any other command
export const detachedOf = (command: string) => {
  // Started on another Mac over ssh, its log and process are there, not here
  if (/^\s*(\S*\/)?ssh\b/.test(command)) return undefined
  // nohup or setsid at the head of a command, sent off with a lone &
  if (!/(^|&&|;|\|\||\n)\s*(nohup|setsid)\s/.test(command) || !/(?<![>&<])&(?![&>\d])/.test(command)) return undefined
  const log = command.match(/(?:^|[^0-9&2])>>?\s*("[^"]+"|'[^']+'|[^\s;&|]+)/)?.[1]?.replace(/^["']|["']$/g, '')
  if (!log || log === '/dev/null') return undefined
  const cd = command.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)\s*&&/)?.[1]?.replace(/^["']|["']$/g, '')
  const core = (command.match(/\b(?:nohup|setsid)\s+(.*?)\s*(?:>|$)/)?.[1] ?? command).trim()
  return { log, cd, core }
}
// The process id a detached start printed, as `echo $!` does
export const pidOf = (stdout: string) => stdout.match(/^\s*(\d{2,7})\s*$/m)?.[1]

// A call that only waits (a sleep, a wait) is no job of its own
export const isWaitOnly = (cmd: string) => /^\s*(sleep\s|wait\b|python3? -c ['"]import time; ?time\.sleep)/.test(cmd)
// A job's own words, without the command some descriptions repeat after a colon
export const labelOf = (what: string, cmd: string) => {
  const head = what.split(': ')[0] ?? what
  const first = cmd.trim().split(/\s+/).find(word => !/^(cd|&&|nohup|setsid)$/.test(word) && !word.startsWith('/')) ?? ''
  return head !== what && first && what.slice(head.length + 2).startsWith(first.slice(0, 6)) ? head : what
}

// A command that only waits for something, polling until it is so: what it waits for, in a few words, and what can be looked at to
// tell how that stands (a process by its pattern or number, a file). Undefined for a command that does more than wait and report
export type Wait = { what: string; pattern?: string; pid?: string; file?: string; isStart?: boolean }
// A quoted word, blanked so what it holds splits nothing
const unquoted = (text: string) => text.replace(/"(\\.|[^"\\])*"|'[^']*'/g, '""')
const LIGHT = /^(date|tail|head|grep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed|jq|true|cd|uptime|pwd|python3? -c ""|python3? -c ''|python3? -c ['"]import json)\b/
const nameOf = (path: string) => path.replace(/^["']|["']$/g, '').split('/').filter(Boolean).at(-1) ?? path
export const waitOf = (cmd: string): Wait | undefined => {
  const cd = cmd.match(/^\s*cd\s+("[^"]+"|'[^']+'|\S+)\s*&&/)?.[1]?.replace(/^["']|["']$/g, '')
  const body = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|\S+)\s*&&\s*/, '').replace(/^\s*end=\$\(\([^;]*\)\);\s*/, '')
  const loop = body.match(/^\s*(until|while)\s+(.+?);\s*do\s+sleep\s+[\d.]+\s*;?\s*done\s*(.*)$/s)
  if (!loop) return undefined
  const [, word, cond = '', after = ''] = loop
  // What comes after the loop only reports
  // (a pipe a command's one line shows as " / ")
  const steps = unquoted(after).split(/\s*(?:;|&&|\|\|?|\s\/\s)\s*/).map(step => step.trim()).filter(Boolean)
  if (!steps.every(step => LIGHT.test(step) || /^\d?>/.test(step))) return undefined
  const isUntil = word === 'until'
  // A file named from the folder a leading cd moved to is named whole
  const whole = (path: string) => (path.startsWith('/') || path.startsWith('~/') || !cd ? path : `${cd.replace(/\/$/, '')}/${path}`)
  const grep = cond.match(/\b(?:grep|rg)\s+(?:-\w+\s+)*-\w*q\w*\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)\s+("[^"]+"|'[^']+'|\S+)/)
  if (grep) return { what: `${grep[1]?.replace(/^["']|["']$/g, '').replace(/\\\|/g, ' or ')} in ${nameOf(grep[2] ?? '')}`, file: whole(grep[2]?.replace(/^["']|["']$/g, '') ?? '') }
  const pg = cond.match(/(!\s*)?pgrep\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)/)
  if (pg) {
    const pattern = pg[2]?.replace(/^["']|["']$/g, '') ?? ''
    const isStart = isUntil !== Boolean(pg[1])
    return { what: `${pattern} to ${isStart ? 'start' : 'end'}`, pattern, isStart }
  }
  const kill = cond.match(/(!\s*)?kill\s+-0\s+(\d+)/)
  if (kill) return { what: `process ${kill[2]} to end`, pid: kill[2] }
  const file = cond.match(/\[\s+(!\s+)?-[fsed]\s+("[^"]+"|'[^']+'|[^\s\]]+)\s*\]/)
  if (file) return { what: nameOf(file[2] ?? ''), file: whole(file[2]?.replace(/^["']|["']$/g, '') ?? '') }
  return { what: cond.replace(/\s+/g, ' ').trim().slice(0, 80) }
}

// Jobs alike (the same kind, words and command, or the same wait) are one row that says how many they are, from the first one's
// start; the newest one's output stands for them
export const foldJobs = (jobs: Job[]): Job[] => {
  const keyOf = (job: Job) => (job.kind === 'wait' ? `wait|${job.label}|${job.waitsFor ?? ''}|${job.waitFile ?? ''}` : `${job.kind}|${job.label}|${job.cmd}`)
  const groups = new Map<string, Job[]>()
  for (const job of jobs) groups.set(keyOf(job), [...(groups.get(keyOf(job)) ?? []), job])
  return [...groups.values()].map(group => {
    const newest = group.reduce((a, b) => (b.at >= a.at ? b : a))
    if (group.length === 1) return newest
    const wrote = group.flatMap(job => (job.wroteAt ? [job.wroteAt] : []))
    return {
      ...newest,
      at: Math.min(...group.map(job => job.at)),
      count: group.length,
      isPaused: group.every(job => job.isPaused),
      ...(wrote.length ? { wroteAt: Math.max(...wrote) } : {}),
    }
  })
}

// The processes on this Mac as `ps -axww -o pid=,ppid=,stat=,etime=,command=` lists them, each with when it started, from the
// time it has run ([[dd-]hh:]mm:ss) and when they were listed
export type Proc = { pid: string; ppid: string; stat: string; startAt: number; command: string }
const secondsOf = (etime: string) => {
  const [days, rest = ''] = etime.includes('-') ? etime.split('-') : ['0', etime]
  return Number(days) * 86400 + rest.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
}
export const procsOf = (text: string, now: number): Proc[] =>
  text.split('\n').flatMap(line => {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+((?:\d+-)?[\d:]+)\s+(.*)$/)
    return m ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', stat: m[3] ?? '', startAt: now - secondsOf(m[4] ?? '0') * 1000, command: m[5] ?? '' }] : []
  })
// A process and everything it started
export const treeOf = (procs: Proc[], pid: string): Proc[] => {
  const top = procs.find(p => p.pid === pid)
  if (!top) return []
  const out = [top]
  for (let n = 0; n < out.length; n++) out.push(...procs.filter(p => p.ppid === out[n]?.pid && !out.includes(p)))
  return out
}
// Stopped (paused) as ps writes it
export const isPausedProc = (p: Proc) => p.stat.startsWith('T')
// The words of a command that stay as they are however the engine quotes it to run it: the longest few, to find its shell by
const fragmentsOf = (cmd: string) =>
  [...new Set(cmd.replace(/\s+\S*$/, '').split(/[\s'"\\$`;|&()<>]+/).filter(word => word.length >= 6 && /^[\w./:=,@%+-]+$/.test(word)))]
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
// The shells the engine runs background commands in, matched to the commands by their words and by when they started: each shell to
// the command kept nearest its start (a command kept as it went to the background may have started up to its time limit before).
// A command left without a shell when some other shell still holds its words is taken as running (true), as is one whose words
// are too few to tell it by (not listed); only one no shell holds is missing (null)
const SHELL_BEFORE = 11 * 60_000
const SHELL_AFTER = 15_000
export const shellsOf = (procs: Proc[], jobs: { id: string; cmd: string; at: number }[]) => {
  const shells = procs.filter(p => /shell-snapshots\/snapshot-/.test(p.command) && /\beval\b/.test(p.command) && p.ppid !== '1')
  const found = new Map<string, string | true | null>()
  const told = jobs.map(job => ({ job, words: fragmentsOf(job.cmd) })).filter(one => one.words.length >= 2)
  const pairs = told
    .flatMap(({ job, words }) =>
      shells.filter(p => words.every(word => p.command.includes(word)) && p.startAt >= job.at - SHELL_BEFORE && p.startAt <= job.at + SHELL_AFTER).map(p => ({ id: job.id, pid: p.pid, gap: Math.abs(job.at - p.startAt) })),
    )
    .sort((a, b) => a.gap - b.gap)
  const taken = new Set<string>()
  for (const pair of pairs) if (!found.has(pair.id) && !taken.has(pair.pid)) (found.set(pair.id, pair.pid), taken.add(pair.pid))
  for (const { job, words } of told) if (!found.has(job.id)) found.set(job.id, shells.some(p => !taken.has(p.pid) && words.every(word => p.command.includes(word))) ? true : null)
  return found
}
