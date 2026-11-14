// The running jobs a piece of work has, told apart and read: a server, a download or a script, from its command or its own words,
// and the latest line it wrote, from the end of its output. Nothing here touches the engine

export type JobKind = 'server' | 'download' | 'script' | 'watch'
export type Job = { id: string; label: string; cmd: string; kind: JobKind; at: number; port?: string; latest?: string; pct?: string }

// How often the jobs' output is read, and how often a job that wrote something new counts as news for its card
export const JOB_LOOK = 5_000
export const JOB_NEWS = 60_000
// Only the end of each job's output is read
export const JOB_TAIL = 4000

export const JOB_COLOR: Record<JobKind, string> = { server: '#4EBA65', download: '#5AA7E6', script: '#8A63F0', watch: '#808080' }
export const JOB_GLYPH: Record<JobKind, string> = { server: '●', download: '↓', script: '▶', watch: '◌' }
export const JOB_WORD: Record<JobKind, string> = { server: 'Server running', download: 'Downloading', script: 'Running', watch: 'Watching' }

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

// The end of a job's output as its latest line: colours and cursor moves taken out, a line a progress bar rewrites read as it
// stands last, with the last percent in it and any port it named
export const latestOf = (text: string) => {
  const clean = text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07]*\x07/g, '')
  const lines = clean
    .split('\n')
    .map(line => line.split('\r').map(part => part.trim()).filter(Boolean).at(-1) ?? '')
    .filter(Boolean)
  const last = lines.at(-1) ?? ''
  const pct = last.match(/\b\d{1,3}(?:\.\d+)?\s?%/g)?.at(-1)?.replace(/\s/g, '')
  return { latest: last.replace(/\s+/g, ' ').trim().slice(0, 240), pct, port: portOf(clean) }
}


// A command started detached, with nohup or setsid and its output sent to a file: the command itself, the log as written, and the
// folder a leading `cd` moved it to; undefined for any other command
export const detachedOf = (command: string) => {
  if (!/\b(nohup|setsid)\b/.test(command)) return undefined
  const log = command.match(/(?:^|[^0-9&2])>>?\s*("[^"]+"|'[^']+'|[^\s;&|]+)/)?.[1]?.replace(/^["']|["']$/g, '')
  if (!log || log === '/dev/null') return undefined
  const cd = command.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)\s*&&/)?.[1]?.replace(/^["']|["']$/g, '')
  const core = (command.match(/\b(?:nohup|setsid)\s+(.*?)\s*(?:>|$)/)?.[1] ?? command).trim()
  return { log, cd, core }
}
// The process id a detached start printed, as `echo $!` does
export const pidOf = (stdout: string) => stdout.match(/^\s*(\d{2,7})\s*$/m)?.[1]
