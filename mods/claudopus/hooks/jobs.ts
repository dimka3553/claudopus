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
export const JOB_COLOR: Record<JobKind, string> = { server: '#4EBA65', download: '#5AA7E6', script: '#E0913A', watch: '#9A9A9A', wait: '#9A9A9A' }
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

const isProgress = (line: string) =>
  /[█▉▊▋▌▍▎▏░▒▓#=]{2,}|\|[^|]*\||\b\d+(\.\d+)?\s?[kMG]?i?B\s?\/\s?\d|\d+\/\d+\b|\b(it|s)\/s\b|[kMG]B\/s\b|\beta\b|^\W*\d{1,3}(\.\d+)?\s?%/i.test(line) &&
  !/\b(coverage|accuracy|score|mean|recall|precision|iou|loss)\b[^%]*\d\s?%/i.test(line)
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
  // A percent is progress only on a line that reads as progress (a bar, a count of a total, a rate, a percent at its head);
  // a score or a coverage figure a line reports is not
  const pct = isProgress(last) ? last.match(/\b\d{1,3}(?:\.\d+)?\s?%/g)?.at(-1)?.replace(/\s/g, '') : undefined
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
const LIGHT = /^(date|tail|head|grep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed|jq|true|python3? -c ['"]import json)\b/
const nameOf = (path: string) => path.replace(/^["']|["']$/g, '').split('/').filter(Boolean).at(-1) ?? path
export const waitOf = (cmd: string): Wait | undefined => {
  const body = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|\S+)\s*&&\s*/, '').replace(/^\s*end=\$\(\([^;]*\)\);\s*/, '')
  const loop = body.match(/^\s*(until|while)\s+(.+?);\s*do\s+sleep\s+[\d.]+\s*;?\s*done\s*(.*)$/s)
  if (!loop) return undefined
  const [, word, cond = '', after = ''] = loop
  // What comes after the loop only reports
  const steps = after.split(/\s*(?:;|&&|\|\|?)\s*/).map(step => step.trim()).filter(Boolean)
  if (!steps.every(step => LIGHT.test(step) || /^\d?>/.test(step))) return undefined
  const isUntil = word === 'until'
  const grep = cond.match(/\b(?:grep|rg)\s+-\w*q\w*\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)\s+("[^"]+"|'[^']+'|\S+)/)
  if (grep) return { what: `${grep[1]?.replace(/^["']|["']$/g, '')} in ${nameOf(grep[2] ?? '')}`, file: grep[2]?.replace(/^["']|["']$/g, '') }
  const pg = cond.match(/(!\s*)?pgrep\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)/)
  if (pg) {
    const pattern = pg[2]?.replace(/^["']|["']$/g, '') ?? ''
    const isStart = isUntil !== Boolean(pg[1])
    return { what: `${pattern} to ${isStart ? 'start' : 'end'}`, pattern, isStart }
  }
  const kill = cond.match(/(!\s*)?kill\s+-0\s+(\d+)/)
  if (kill) return { what: `process ${kill[2]} to end`, pid: kill[2] }
  const file = cond.match(/\[\s+(!\s+)?-[fsed]\s+("[^"]+"|'[^']+'|[^\s\]]+)\s*\]/)
  if (file) return { what: nameOf(file[2] ?? ''), file: file[2]?.replace(/^["']|["']$/g, '') }
  return { what: cond.replace(/\s+/g, ' ').trim().slice(0, 80) }
}

// Jobs alike (the same kind, words and command, or the same wait) are one row that says how many they are, from the first one's
// start; the newest one's output stands for them
export const foldJobs = (jobs: Job[]): Job[] => {
  const keyOf = (job: Job) => (job.kind === 'wait' ? `wait|${job.label}|${job.waitsFor ?? ''}` : `${job.kind}|${job.label}|${job.cmd}`)
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

// The processes on this Mac as `ps -axww -o pid=,ppid=,stat=,command=` lists them
export type Proc = { pid: string; ppid: string; stat: string; command: string }
export const procsOf = (text: string): Proc[] =>
  text.split('\n').flatMap(line => {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/)
    return m ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', stat: m[3] ?? '', command: m[4] ?? '' }] : []
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
// The shells the engine runs background commands in, matched to the commands: each shell to one command, the oldest command to the
// oldest shell. A command whose words are too few to tell it by is not matched (undefined), not taken as gone
export const shellsOf = (procs: Proc[], jobs: { id: string; cmd: string; at: number }[]) => {
  const shells = procs.filter(p => /shell-snapshots\/snapshot-/.test(p.command) && /\beval\b/.test(p.command)).sort((a, b) => Number(a.pid) - Number(b.pid))
  const taken = new Set<string>()
  const found = new Map<string, string | null>()
  for (const job of [...jobs].sort((a, b) => a.at - b.at)) {
    const words = fragmentsOf(job.cmd)
    if (words.length < 2) continue
    const shell = shells.find(p => !taken.has(p.pid) && p.ppid !== '1' && words.every(word => p.command.includes(word)))
    if (shell) taken.add(shell.pid)
    found.set(job.id, shell ? shell.pid : null)
  }
  return found
}
