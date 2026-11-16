// The running jobs a piece of work has, told apart and read: a server, a download or a script, from its command or its own words,
// and the latest line it wrote, from the end of its output. Nothing here touches the engine

export type JobKind = 'server' | 'download' | 'script' | 'watch' | 'wait'
// A job as its row shows it: when its output last changed, whether its processes are paused, how many alike it stands for, and
// for a wait, what it waits for and how that stands
export type Job = {
  id: string
  // The last few lines its output ends with, as a terminal shows them; shown under its row in Details
  tail?: string[]
  label: string
  cmd: string
  kind: JobKind
  at: number
  port?: string
  latest?: string
  pct?: string
  done?: string
  total?: string
  rate?: string
  left?: string
  isEarlier?: boolean
  isOwn?: boolean
  // The plain words of the work's own progress line, after its numbers
  words?: string
  isEmpty?: boolean
  // A run left going whose output goes to no file: it runs, and says nothing of how far it is
  isUntold?: boolean
  // The memory it and all it started hold, in words
  mem?: string
  isNamed?: boolean
  expect?: number
  expectText?: string
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
// A job whose output has not changed for this long says, in amber, that it has gone quiet, and one that has printed nothing at all
// says so: work is told to print progress at least every 10 seconds, so a few minutes of nothing is worth a look
export const JOB_QUIET = 3 * 60_000
// A run that has given no word this long is silent on its row, and from a minute that is in amber: work is told to give word at
// least every 10 seconds, so a run is never anything but at work
export const SILENT_AFTER = 10_000
export const SILENT_WARN = 60_000
// A job whose output has not been found this long after it started says so on its row
export const JOB_UNREAD = 60_000

export const SERVER_CMD =
  /\b(http\.server|http-server|uvicorn|gunicorn|hypercorn|flask run|runserver|vite( dev| preview)?|next (dev|start)|(npm|pnpm|yarn|bun) (run )?(dev|start|serve|preview)|rails s(erver)?|jupyter (lab|notebook)|ollama serve|tensorboard|serve -[sl]|python3? -m (http\.server|uvicorn))\b/i
export const DOWNLOAD_CMD =
  /\b(curl|wget|aria2c|huggingface-cli download|hf download|git clone|git lfs (pull|fetch)|rsync|scp|gsutil (-m )?cp|aws s3 (cp|sync)|pip3? install|uv (pip )?(install|sync)|npm (i|install|ci)|pnpm (i|install)|yarn install|brew install|docker pull|yt-dlp|azcopy (copy|cp|sync)|az storage (blob|file) (download|upload)(-batch)?|python3? -m pip install)\b/i

// What kind a job is, from its command, or else its own words for itself
// A download is one whose own program fetches (curl, wget, rsync...), not one that names such a tool as a word to another
// (`vercel curl` reads a page): on 15 Nov "Reload page and check function logs" was called a download for that
// A curl or wget that only reads a page to check it (curl -s ... | grep, wget --spider, wget -O -) is no download: only one that
// keeps what it fetches in a file is (on 15 Nov "Wait for deploy and verify the live pages", a loop of curl -s, was called one).
// Work that says it waits, checks or tests is never a download, whatever it runs
const CHECKS = /^(wait|poll|check|verify|test|watch|confirm|reload|ping|probe|look)\b/i
const isFetching = (step: string) => {
  const head = step.replace(/^[^\s/]*\//, '/').replace(/^\/\S*\//, '')
  if (head.search(DOWNLOAD_CMD) !== 0) return false
  if (/^curl\b/.test(head)) return /\s(-[a-zA-Z]*[oO]\b|-[a-zA-Z]*[oO]\S|--output\b|--remote-name|--output-dir\b)|\s>>?\s*[^&\s]/.test(head)
  if (/^wget\b/.test(head)) return !/\s--spider\b|\s-[a-zA-Z]*O\s*-(\s|$)|\s-qO-/.test(head)
  return true
}
// The work's own words for a run, in the one form it is told to write them, so its card reads them as they are and guesses
// nothing from the command: its kind first (Download, Upload, Wait for, Watch, Serve, Run), what it does, and how long it
// should take in brackets: `Download the CT scans (about 3 min)`
const KIND_WORDS: [RegExp, JobKind][] = [
  [/^(download|upload|fetch|copy|sync|clone)\b/i, 'download'],
  [/^(wait(ing)?|poll(ing)?)\b/i, 'wait'],
  [/^watch\b/i, 'watch'],
  [/^serve\b/i, 'server'],
  [/^run\b/i, 'script'],
]
export const describedOf = (what: string) => {
  // only a time in the brackets, never a count (about 120 scans): a range is taken at its end (about 2-3 min)
  const m = what.match(new RegExp(String.raw`\s*\((?:about|around|roughly|up to|~)?\s*(?:\d+(?:\.\d+)?\s*[-–]\s*)?${TIME}\)\s*$`, 'i'))
  const seconds = m ? secondsIn((m[1] ?? '').trim()) : undefined
  const text = m ? what.slice(0, m.index).trim() : what.trim()
  return { text, kind: KIND_WORDS.find(([re]) => re.test(text))?.[1], ...(seconds ? { expect: seconds * 1000, expectText: (leftText(seconds) ?? '').replace(/ left$/, '') } : {}) }
}
// Words that lead a run's own name and say its kind already, so its row does not say it twice
export const isKindSaid = (label: string) => KIND_WORDS.some(([re]) => re.test(label.trim()))
// Else, for words written another way or none, its kind is told from its command
export const jobKindOf = (cmd: string, label: string): JobKind =>
  describedOf(label).kind ?? (SERVER_CMD.test(cmd) || /\bserver\b/i.test(label) ? 'server' : !CHECKS.test(label.trim()) && (stepsOf(cmd).some(isFetching) || /\bdownload/i.test(label)) ? 'download' : 'script')
// Each step of a shell line with what only sets it up taken off its head (a variable, env, nohup, time, sudo, exec), never a `cd`
const SETUP = /^(?:(?:[A-Za-z_]\w*=(?:"[^"]*"|'[^']*'|\S*)|env|nohup|setsid|exec|sudo|command|(?:\/usr\/bin\/)?time(?:\s+-\w+)*|timeout\s+\S+|caffeinate(?:\s+-\w+)*)\s+)+/
const stepsOf = (cmd: string) =>
  cmd
    .replace(/"(\\.|[^"\\])*"|'[^']*'/g, m => m.replace(/[;&|\n]/g, ' '))
    .split(/\s*(?:&&|\|\||;|\||\n|(?<![>&])&(?![>&]))\s*/)
    .map(step => step.trim().replace(/^\(+\s*/, '').replace(/^(do|then|else)\s+/, '').replace(SETUP, '').trim())
    .filter(Boolean)

// The port a server listens on, from its command or what it wrote
export const portOf = (text: string) =>
  text.match(/(?:--port[= ]|-p |localhost:|127\.0\.0\.1:|0\.0\.0\.0:|\[::\]:|\bport )(\d{2,5})\b/i)?.[1] ?? text.match(/http\.server (\d{2,5})\b/)?.[1]

// A percent is progress when a bar follows it (tqdm and the like), whatever words the line holds; else the first percent on a line
// right beside a count toward a total. A score, a coverage figure or a table cell is not
const pctOf = (line: string) => {
  const bar = line.match(/(\d{1,3}(?:\.\d+)?)\s?%\s*(\|[█▉▊▋▌▍▎▏░▒▓#\s]*\||\[[=#>.\s-]*\]|[█▉▊▋▌▍▎▏░▒▓])/)
  if (bar) return `${bar[1]}%`
  const before = line.match(/[█▉▊▋▌▍▎▏░▒▓#━]{4,}\s*(\d{1,3}(?:\.\d+)?)\s?%/) ?? line.match(/\[[#=>.\s-]{4,}\]\s*(\d{1,3}(?:\.\d+)?)\s?%/)
  if (before) return pctText(Number(before[1]))
  // make's and pytest's [ 45%] at the head of a line
  const head = line.match(/^\s*\[\s*(\d{1,3})%\]/)
  if (head) return `${head[1]}%`
  // Else a percent right beside a count toward a total, either way round
  // (never across a table's cell wall), or a size done of a size in all
  const near =
    line.match(/\b\d+\s?(?:\/|of)\s?\d+\b[^\d|]{0,8}?\b(\d{1,3}(?:\.\d+)?)\s?%/i) ??
    line.match(/\b(\d{1,3}(?:\.\d+)?)\s?%[^\d|]{0,8}?\b\d+\s?(?:\/|of)\s?\d+\b/i) ??
    line.match(/\d\s?[KMGT]i?B\s+of\s+[\d.]+\s?[KMGT]i?B\s*\((\d{1,3}(?:\.\d+)?)%\)/i)
  return near ? `${near[1]}%` : undefined
}
// How far a run is, as its own output says: how much is done of how much (bytes as KB, MB, GB or TB, or a count), its percent,
// and how fast it goes when it says. Read from the progress shapes tools print (curl, wget, rsync, az and azcopy, aws, gsutil,
// pip, git, docker, tqdm and the like) and the line work's own scripts are told to print: `progress: 3/6 steps fitting`,
// `progress: 4.2/10 GB uploading`, `progress: 45%`
export type Progress = { pct?: string; done?: string; total?: string; rate?: string; left?: string; isEarlier?: boolean; isOwn?: boolean; words?: string }

// The one shape a run's second line has, for every run however it was started: how far it is (a count of how many, a percent, a
// size of a size, its speed, time left), a few plain words of what it does now, and when it last gave a sign of life, at most
// PLAIN_MOST characters of words. Never shown: paths, file names, web addresses, clock times and dates, codes in brackets, state
// words, ids, settings (key=value), sizes that say nothing of how far (memory), program names, and any line that names a
// password, key or token. A raw line that is not plain words once those are taken out is not shown at all
export const PLAIN_MOST = 60
// A line that names a password, key, token, code or login, says who is signed in, or echoes what was typed at a prompt is never
// shown, not even in part
const SECRETISH =
  /\b(pass(?:word|phrase|wd|code)?s?|secrets?|tokens?|api[-_ ]?keys?|keys?|bearer|authori[sz]ation|credentials?|codes?|pins?|verification|verify|otp|2fa|mfa|ssh-(?:rsa|ed25519)|log(?:s|ging|ged)?[ -]?in|sign(?:s|ing|ed)?[ -]?in|authenticat\w*|user ?names?|accounts?|e-?mail)\b|\b(?:sk|pk|ghp|gho|xox[abp])[-_][A-Za-z0-9]{8,}|\S@\S|\(\w*\):\s*\S|[?:]\s*$/i
const PROGRAMS = /\b(?:curl|wget|python3?(?:\.\d+)?|node|npm|npx|pnpm|yarn|pip3?|git|az|aws|gcloud|gsutil|azcopy|rsync|scp|ssh|bash|zsh|sh|sudo|docker|kubectl|make|tar|unzip|ffmpeg|brew|uv|conda|apt(?:-get)?)\b:?/gi
const FILES = /\b[\w.-]+\.(?:py|sh|js|mjs|ts|tsx|json|jsonl|log|txt|csv|tsv|zip|tar|gz|tgz|png|jpe?g|webp|gif|mp4|nii|dcm|ply|obj|stl|pkl|pt|pth|ckpt|safetensors|bin|h5|npz|npy|ya?ml|toml|md|html|out|err|lock|rs|go|java|c|cpp|h)\b/gi
// A line that is a command or a build step, not news of how a run goes
// (case counts: a log's "[run 11:27:50]" is no Docker RUN)
const COMMANDISH = /^\s*(?:\$|>|#\d+\s|[Ss]tep \d+\/\d+\s*:)|\bRUN\s|\s-{1,2}[a-z][\w-]*(?:\s|$)|^\s*at\s+\S+\s+\(|^\s*File\s|\bthrow\b|^\s*\^\s*$/
// A single word that is technical whatever the line: one with a path's, a name's or a setting's marks in it (/ \ @ < > { } | :: _),
// a flag, a number with points (a version, an address), a short hash, a word of letters and numbers joined by - or .
const isTechWord = (word: string) =>
  /[/\\@<>{}|^`$]|::|_/.test(word) ||
  /^-/.test(word) ||
  /^\(?v?\d+(?:\.\d+){2,}/.test(word) ||
  /^\d{1,3}(?:\.\d{1,3}){3}/.test(word) ||
  /^[\w-]+(?:\.[\w-]+)+$/.test(word.replace(/[.,;:!?)]+$/, '')) && /[a-z]{2,}$/i.test(word.replace(/[.,;:!?)]+$/, '')) ||
  (/^[0-9a-f]{7,}$/i.test(word) && /\d/.test(word) && /[a-f]/i.test(word)) ||
  (/\d/.test(word) && /[A-Za-z]/.test(word) && /[-.]/.test(word.replace(/[.,;:!?)]+$/, ''))) ||
  word.length >= 24 ||
  (word.length >= 12 && /\d/.test(word) && /[A-Za-z]/.test(word)) ||
  /^E[A-Z]{3,}$/.test(word) ||
  /^:\d+/.test(word) ||
  /^[^\w·…%]+$/.test(word)
const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'onto', 'that', 'this', 'its', 'now', 'all', 'are', 'was', 'has', 'have', 'been', 'being', 'then', 'still', 'run', 'running'])
const stem = (word: string) => word.toLowerCase().slice(0, 4)
export const plainOf = (line: string | undefined, title = ''): string => {
  if (!line || SECRETISH.test(line) || COMMANDISH.test(line)) return ''
  let t = line.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/^.*?\bprogress:\s*/i, '')
  t = t
    // web addresses, paths (Windows' too) and file names
    .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, ' ')
    .replace(/\b[A-Za-z]:\\\S*/g, ' ')
    .replace(/(^|[\s'"(=:,])(?:~|\.{1,2})?\/[^\s'",)]*/g, '$1 ')
    .replace(FILES, ' ')
    // a state said as a setting (Status: Running), an npm or log marker
    .replace(/\b(?:status|state|phase)\s*:\s*\w+/gi, ' ')
    .replace(/\bERR!/g, ' ')
    // anything in square brackets (a log's time or level, an error number), a single word in round ones (a state: (Running))
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\(\s*[\w-]+\s*\)/g, ' ')
    // dates and clock times
    .replace(/\b\d{4}-\d\d-\d\d(?:[T ]\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:?\d\d)?)?\b/g, ' ')
    .replace(/\b\d{1,2}:\d\d(?::\d\d(?:\.\d+)?)?\b/g, ' ')
    // a log's level at its head
    .replace(/^\s*(?:INFO|DEBUG|TRACE|NOTICE|VERBOSE)\b:?/i, ' ')
    // an error's own program name said as the word error (FileNotFoundError: → error:)
    .replace(/\b[A-Z]\w*(?:Error|Exception)\b:?/g, 'error:')
    // settings, ids and codes: key=value, long hex or mixed strings, error names in capitals (ENOENT), line numbers
    .replace(/\S+=\S*/g, ' ')
    .replace(/\b[0-9a-f]{8,}(?:-[0-9a-f]{4,})*\b/gi, ' ')
    .replace(/\bline \d+\b/gi, ' ')
    // sizes alone, which say nothing of how far (how far is said from the numbers, not from these words)
    .replace(new RegExp(String.raw`(\d[\d,]*(?:\.\d+)?)\s?(?:[KMGTP]i?B|bytes?)\b(?:\/s)?`, 'gi'), ' ')
    .replace(PROGRAMS, ' ')
    // quotes, then a word at a time: technical words go (one at a time, so no long word is tried again and again)
    .replace(/["'`]/g, ' ')
    .replace(/\S+/g, word => (isTechWord(word) ? ' ' : word))
    .replace(/\(\s*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,;:])(?=[,;:.])/g, '')
    .replace(/^[\s,.;:!?·|>#*=+~\-"'`]+|[\s,;:|>#*=+~\-"'`]+$/g, '')
    .trim()
  const words = t.match(/[A-Za-z]{2,}/g) ?? []
  const letters = (t.match(/[A-Za-z]/g) ?? []).length
  if (words.length < 2 || letters < t.replace(/\s/g, '').length * 0.6) return ''
  // Words that only say again what its name says are no news
  const named = new Set((title.match(/[A-Za-z]{3,}/g) ?? []).map(stem))
  const own = words.filter(word => word.length >= 3 && !STOP.has(word.toLowerCase()))
  // Words that only name what is counted (epoch 3 step) are said by the count already
  if (!own.some(word => !COUNTED.test(word))) return ''
  if (title && own.every(word => named.has(stem(word)) || /^(wait(s|ing)?|for|until)$/i.test(word))) return ''
  if (t.length <= PLAIN_MOST) return t
  const cut = t.slice(0, PLAIN_MOST - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 30 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:]+$/, '')}…`
}
// A long command that would give no word of how far it is: a wait loop, or a script of the work's own (a file it runs, as read),
// run in the background, detached, or said to take a minute or more, that prints no progress line and runs no tool with a meter of
// its own. '' for any other: a short one, one that reports, or a program whose words the mod reads as they come (its row then
// says when it last gave a sign of life). The mod's own runners report for themselves
const METER = /\b(?:curl|wget|rsync|azcopy|pip3?|git\s+clone|hf\s+download|huggingface-cli|tqdm|rich\.progress|aria2c|docker\s+pull)\b/
const SILENCED = /\bcurl\b[^|;&\n]*\s(?:-[a-zA-Z]*s[a-zA-Z]*|--silent)\b|\bwget\b[^|;&\n]*\s(?:-q\b|--quiet\b|-[a-zA-Z]*q[a-zA-Z]*O\b)|\btqdm\([^)\n]*disable\s*=\s*True/
// A line it prints that the card reads as how far it is: a count of a total (`{i}/{n}`, `$i/$n`, `%d/%d`) or a percent
const PRINTS_COUNT = /\b(?:print|echo|printf|log\w*|console\.log|write)\b[^\n]*(?:\{[^}\n]*\}\s*\/\s*\{|\$\{?\w+\}?\s*\/\s*\$|%[ds]\s*\/\s*%[ds]|\{[^}\n]*:\.?\d*%\}|%%)/
// The word progress, once what only turns it off is taken out (# no progress bar, --no-progress, progress_bar=False)
const saysProgress = (text: string) => /\bprogress\b/i.test(text.replace(/\bno[-_ ]progress[\w-]*|progress[-_ ]?bar\s*=\s*(?:False|off|0|None)\b/gi, ' '))
export const reportsOf = (command: string, description: string, isBackground: boolean, scripts: string[], timeoutMs = 0): 'wait' | 'script' | '' => {
  if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(command)) return ''
  const said = describedOf(description)
  // A server or a watch never says how far it is: its row says when it was last asked or its last event
  if (said.kind === 'server' || said.kind === 'watch' || SERVER_CMD.test(command)) return ''
  const isDetached = Boolean(detachedOf(command))
  const isLongSaid = (said.expect ?? 0) >= 60_000 || timeoutMs > 2 * 60_000
  const all = [command, ...scripts]
  if (all.some(saysProgress)) return ''
  // A wait loop sent off or held open for long: every loop that sleeps between its tries
  if ((isBackground || isDetached || isLongSaid) && /\b(?:until|while|for)\b[\s\S]*?\bdo\b[\s\S]*?\bsleep\b/.test(command)) return 'wait'
  // A script of its own said to take a minute or more, or started detached (sent to the background alone it may be short)
  if (!(isDetached || isLongSaid) || !scripts.length) return ''
  return all.some(text => (METER.test(text) && !SILENCED.test(text)) || PRINTS_COUNT.test(text)) ? '' : 'script'
}
// The plain words after the numbers of a work's own progress line, without the time left it gives (said on its own)
const ownWords = (rest: string) =>
  plainOf(rest.replace(new RegExp(String.raw`,?\s*\beta:?\s*${TIME}|,?\s*\b${TIME}\s*(?:left|remaining|to go)\b`, 'gi'), ' ').replace(/^\s*(?:[KMGTP]i?B|B|bytes?)\b/i, ' ')) || undefined
// How long a run says it has left, as it says it (eta 55s, eta 0:00:55, [01:18<01:28], 3m left, curl's Time Left), in words; the
// panel works one out from its percent only where the run says none
const secondsIn = (text: string) => {
  if (/^\d+(:\d\d){1,2}$/.test(text)) return text.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
  const parts = [...text.matchAll(/(\d+(?:\.\d+)?)\s?(days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])/gi)]
  return parts.length ? parts.reduce((sum, m) => sum + Number(m[1]) * ({ d: 86400, h: 3600, m: 60, s: 1 }[(m[2] ?? 's').charAt(0).toLowerCase()] ?? 1), 0) : undefined
}
export const leftText = (seconds: number | undefined) => {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) return undefined
  const all = Math.round(seconds)
  const text = all < 60 ? `${all}s` : all < 600 ? `${Math.floor(all / 60)}m${all % 60 ? ` ${String(all % 60).padStart(2, '0')}s` : ''}` : all < 3600 ? `${Math.round(all / 60)}m` : `${Math.floor(Math.round(all / 60) / 60)}h${Math.round(all / 60) % 60 ? ` ${String(Math.round(all / 60) % 60).padStart(2, '0')}m` : ''}`
  return `${text} left`
}
const TIME = String.raw`(\d+(?::\d\d){1,2}|(?:\d+(?:\.\d+)?\s?(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])\s*){1,3})`
const leftOf = (line: string) => {
  const m =
    line.match(new RegExp(String.raw`\beta:?\s*${TIME}`, 'i')) ??
    line.match(new RegExp(String.raw`\b${TIME}\s*(?:left|remaining|to go)\b`, 'i')) ??
    line.match(/<(\d+(?::\d\d){1,2})[,\]]/) ??
    line.match(/^\s*\d[\d,]*\s+\d{1,3}%\s+[\d.]+[kKMGT]?B\/s\s+(\d+:\d\d:\d\d)/) ??
    line.match(/^\s*\d+K\s+[.\s]+\s\d{1,3}%\s+[\d.]+[KMG]\s+((?:\d+[hms])+)\s*$/)
  return m ? leftText(secondsIn((m[1] ?? '').trim())) : undefined
}
// A size as written in bytes, with the base its unit counts in: KiB, MiB and a bare K, M or G as curl and wget print count in 1024s,
// kB, MB and GB in 1000s; undefined when it is no size
type Size = { bytes: number; base: number }
const POWER: Record<string, number> = { '': 0, B: 0, K: 1, M: 2, G: 3, T: 4, P: 5 }
const sizeOf = (number: string, unit = '', bare = 1024): Size | undefined => {
  const n = Number(number.replace(/,/g, ''))
  const u = unit.trim()
  const letter = u.charAt(0).toUpperCase()
  if (!Number.isFinite(n) || !(letter in POWER) || (u && !/^([KMGTP](i?B)?|B|bytes?)$/i.test(u))) return undefined
  const base = /i/.test(u) ? 1024 : /^[KMGTP]$/i.test(u) ? bare : 1000
  return { bytes: n * base ** (POWER[letter] ?? 0), base }
}
// Bytes as a person reads them, in the base they were counted in: 460 MB, 1.4 GB, 12 KB
const sizeText = ({ bytes, base }: Size) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let n = bytes
  let i = 0
  while (n >= 1000 && i < units.length - 1) ((n /= base), i++)
  return `${n >= 100 || i === 0 ? Math.round(n) : Number(n.toFixed(1))} ${units[i]}`
}
const countText = (n: number) => (Number.isInteger(n) ? n.toLocaleString('en-US') : String(Number(n.toFixed(2))))
const pctText = (n: number) => `${Math.min(100, Math.max(0, n)) >= 10 || Number.isInteger(n) ? Math.floor(Math.min(100, n)) : Number(n.toFixed(1))}%`
const percentOf = (done: number, total: number) => (total > 0 && done <= total ? pctText((done / total) * 100) : undefined)
// A size with its unit right after (460.0 MiB, 1.41G, 460MB); the unit letter alone counts only where a size is meant
const SIZE = String.raw`(\d[\d,]*(?:\.\d+)?)\s?([KMGTP]i?B|[KMGTP](?![a-z])|B\b|bytes?\b)`
const RATE = new RegExp(String.raw`(\d+(?:\.\d+)?)\s?([KMGTP]i?B|[KMGTP]i?b|B|[KMGTP])(?:ps|/s)\b`, 'i')
const rateOf = (line: string, bare = 1000) => {
  const m = line.match(RATE) ?? line.match(/(\d+(?:\.\d+)?)\s?(it|items?|files?|frames?|steps?)\/s\b/i)
  if (!m) return undefined
  const [, n = '', unit = ''] = m
  if (/^[KMGTP]i?b$/.test(unit)) return `${n} ${unit.charAt(0).toUpperCase()}b/s`
  const size = /^(it|item|file|frame|step)/i.test(unit) ? undefined : sizeOf(n, unit, bare)
  return size ? `${sizeText(size)}/s` : `${n} ${unit}/s`
}
// What is counted, said right before its count (frame 81/120, Epoch: 3/10, step #4 of 6)
const COUNTED = /\b(steps?|stages?|phases?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|iter(ation)?s?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|mesh|fits?)\s*[:#]?\s*$/i
// A size pair that is how full something is, not how far a run is
const HELD = /\b(mem(ory)?|ram|vram|gpu|disk|used|free|avail(able)?|alloc(ated)?|reserved|cache|swap|heap|rss)\b\W*$/i
// A percent that is a score, not progress
const SCORE = /\b(acc(uracy)?|score|coverage|precision|recall|f1|auc|iou|map|top-?\d|pass(ed)?|win|rate|util(i[sz]ation)?|cpu|gpu|mem(ory)?|load)\b[^%]{0,16}$/i
// What follows the work's own `progress:` on a line (after a log's time or level), or undefined; "no progress:" is none
const ownOf = (line: string) => {
  const m = line.match(/(?:^|[\s\]|[])progress:\s*(.*)$/i)
  return m && !/\bno\s+progress:/i.test(line) ? (m[1] ?? '') : undefined
}
// The progress one line shows, or undefined
const lineProgress = (line: string): Progress | undefined => {
  // The work's own line: progress: done/total [unit] [words], or progress: N%, anywhere on a line (after a log's time or level)
  const own = ownOf(line)
  if (own !== undefined) {
    const rest = own
    const pct = rest.match(/^(\d+(?:\.\d+)?)\s?%/)
    if (pct && Number(pct[1]) <= 100) return { pct: pctText(Number(pct[1])), isOwn: true, words: ownWords(rest.slice(pct[0].length)) }
    // done/total with a unit after the total or after both: 3/6 steps, 4.2/10 GB, 4.2 GB / 10 GB, 4.2GB/10GB
    const m = rest.match(/^(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?\s*(?:\/|of)\s*(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?/)
    if (m) {
      // Its own numbers and unit, as written; a word after the total is its unit only when it is a size or a thing counted
      const [, a = '', u1 = '', b = '', u2 = ''] = m
      const na = Number(a.replace(/,/g, ''))
      const nb = Number(b.replace(/,/g, ''))
      const isSizeUnit = (u: string) => /^([KMGTP]i?B|B|bytes?)$/i.test(u)
      const unit = isSizeUnit(u2) ? u2 : isSizeUnit(u1) ? u1 : u2 && !u1 && (COUNTED.test(u2) || /^[a-z]{3,}s$/i.test(u2)) ? u2 : ''
      const isSize = isSizeUnit(unit)
      if (nb > 0 && na <= nb) return { done: isSize ? `${a} ${unit}` : countText(na), total: `${isSize ? b : countText(nb)}${unit ? ` ${unit}` : ''}`, pct: percentOf(na, nb), rate: rateOf(rest), isOwn: true, words: ownWords(rest.slice(m[0].length)) }
    }
    // A count with no end known, as a wait counts its tries: progress: 7 tries waiting for the deploy
    const so = rest.match(/^(\d[\d,]*)\s+([a-z]{3,})\b/i)
    if (so) return { done: `${countText(Number(so[1]?.replace(/,/g, '')))} ${so[2]?.toLowerCase()}`, isOwn: true, words: ownWords(rest.slice(so[0].length)) }
  }
  // curl's meter: % Total % Received % Xferd Average-speeds Times Current-speed, sizes in 1024s
  const curl = line.match(/^\s*(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+\d{1,3}\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+[-\d:]+\s+[-\d:]+\s+([-\d:]+)\s+(\d[\d.]*[kMGTP]?)\s*$/)
  if (curl) {
    const [, , total = '', pct = '', done = '', timeLeft = '', speed = ''] = curl
    const of = (text: string) => sizeOf(text.replace(/[kMGTP]$/, ''), text.match(/[kMGTP]$/)?.[0] ?? '') ?? { bytes: 0, base: 1024 }
    const t = of(total)
    return { done: sizeText(of(done)), ...(t.bytes > 0 ? { total: sizeText(t), pct: `${pct}%`, left: /\d/.test(timeLeft) ? leftText(secondsIn(timeLeft)) : undefined } : {}), rate: `${sizeText(of(speed))}/s` }
  }
  // azcopy: 45.2 %, 10 Done, 0 Failed, 90 Pending, 0 Skipped, 100 Total, 2-sec Throughput (Mb/s): 85.3
  const azcopy = line.match(/^\s*(\d+(?:\.\d+)?)\s?%,\s*(\d+) Done,.*?(\d+) Total\b(?:.*Throughput \(Mb\/s\):\s*([\d.]+))?/)
  if (azcopy) return { pct: pctText(Number(azcopy[1])), done: azcopy[2], total: `${azcopy[3]} files`, ...(azcopy[4] ? { rate: `${sizeText({ bytes: (Number(azcopy[4]) * 1e6) / 8, base: 1000 })}/s` } : {}) }
  // wget, dot style: 460800K .......... .......... 45% 10.2M 55s
  const dots = line.match(/^\s*(\d+)K\s+[.\s]+\s(\d{1,3})%\s+([\d.]+[KMG])\s/)
  if (dots) return { done: sizeText({ bytes: Number(dots[1]) * 1024, base: 1024 }), pct: `${dots[2]}%`, rate: `${sizeText(sizeOf(dots[3]?.slice(0, -1) ?? '0', dots[3]?.slice(-1)) ?? { bytes: 0, base: 1024 })}/s`, wget: true } as Progress
  // wget, bar style: big.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 55s
  const wget = line.match(/\s(\d{1,3})%\[[=> ]*\]\s+([\d.,]+)([KMGT]?)\s+([\d.]+\s?[KMG]?B\/s)/)
  if (wget) return { done: sizeText(sizeOf(wget[2] ?? '0', wget[3]) ?? { bytes: 0, base: 1024 }), pct: `${wget[1]}%`, rate: rateOf(wget[4] ?? '', 1024), wget: true } as Progress
  // rsync: 1,234,567,890  45%   10.21MB/s    0:00:55
  const rsync = line.match(/^\s*(\d[\d,]*)\s+(\d{1,3})%\s+([\d.]+[kKMGT]?B\/s)\s+\d+:\d\d:\d\d/)
  if (rsync) return { done: sizeText({ bytes: Number(rsync[1]?.replace(/,/g, '')), base: 1000 }), pct: `${rsync[2]}%`, rate: rateOf(rsync[3] ?? '') }
  const seen = pctOf(line)
  const pctSeen = seen && !SCORE.test(line.slice(0, line.indexOf(seen))) ? seen : undefined
  const hasBar = /[█▉▊▋▌▍▎▏░▒▓━]|#{3,}|\[[=#>.\s-]{3,}\]/.test(line)
  // A count right after a bar is the bar's own (tqdm: 45%|████| 450/1000)
  const barCount = line.match(/%\|(?:[^|]{0,80}\|)?\s*(\d[\d,]*)\/(\d[\d,]*)\b/)
  // A size done of a size in all (tqdm, pip, aws, gsutil, docker, hf): 1.41G/3.00G, 460.1/1024.0 MB, 460.0 MiB/  1.0 GiB, where a
  // percent, a bar or a speed says it moves and it is not how full a memory or a disk is
  const sizes =
    line.match(new RegExp(String.raw`${SIZE}\s*(?:\/|of)\s*${SIZE}`)) ??
    line.match(new RegExp(String.raw`(\d[\d,]*(?:\.\d+)?)()\s*\/\s*${SIZE}`))
  const ahead = line.slice(0, sizes?.index ?? 0)
  const isCountAhead = [...ahead.matchAll(/(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b/g)].some(m => COUNTED.test(ahead.slice(0, m.index)))
  if (sizes && (pctSeen || hasBar || RATE.test(line)) && !HELD.test(ahead) && !isCountAhead) {
    const [, a = '', ua = '', b = '', ub = ''] = sizes
    const d = sizeOf(a, ua || ub, 1000)
    const t = sizeOf(b, ub, 1000)
    if (d && t && t.bytes > 0 && d.bytes <= t.bytes * 1.001) return { done: sizeText(d), total: sizeText(t), pct: pctSeen ?? percentOf(d.bytes, t.bytes), rate: rateOf(line.slice((sizes.index ?? 0) + sizes[0].length)) }
  }
  if (barCount) {
    const a = Number(barCount[1]?.replace(/,/g, ''))
    const b = Number(barCount[2]?.replace(/,/g, ''))
    if (b > 0 && a <= b) return { done: countText(a), total: countText(b), pct: pctSeen ?? percentOf(a, b), rate: rateOf(line) }
  }
  // A count toward a total, said whole in brackets ([4/6], (450/1000)), right after what it counts (frame 81/120), or right beside
  // its percent
  const count = line.match(/(?:^|[\s[(:#])(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b(?![/.:]\d)/)
  // (none on a line whose percent is a score: accuracy 95% on 1000/1000 samples)
  if (count && !(seen && !pctSeen)) {
    const before = line.slice(0, (count.index ?? 0) + (count[0].match(/^[\s[(:#]/) ? 1 : 0))
    const after = line.slice((count.index ?? 0) + count[0].length)
    const a = Number(count[1]?.replace(/,/g, ''))
    const b = Number(count[2]?.replace(/,/g, ''))
    const isBracketed = /[[(]\s*$/.test(before) && /^\s*[\])]/.test(after)
    const around = line.slice(Math.max(0, (count.index ?? 0) - 12), (count.index ?? 0) + count[0].length + 12)
    const isBeside = Boolean(pctSeen) && !around.includes('|') && pctOf(around) === pctSeen
    // or with what it counts after it (Copied 3/6 files), or a bar of brackets after it (Keras: 450/1000 [=====>....])
    const isProgress = isBracketed || isBeside || COUNTED.test(before) || /^\s*(steps?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|fits?)\b/i.test(after) || /^\s*\[[=>.#\s-]{4,}\]/.test(after)
    // with what it counts, said after the count or before it (Processed 9 of 20 files, frame 81/120)
    const unit = after.match(/^\s*([a-z]{3,}s)\b/i)?.[1] ?? before.match(/\b([a-z]{3,}s)\s*[:#]?\s*$/i)?.[1] ?? ''
    // (or said once before it, as a log says step 1200/5000)
    const one = before.match(/\b([a-z]{3,})\s*[:#]?\s*$/i)?.[1] ?? ''
    const named = unit && COUNTED.test(unit) ? ` ${unit.toLowerCase()}` : one && !one.endsWith('s') && COUNTED.test(`${one}s`) ? ` ${one.toLowerCase()}s` : ''
    if (isProgress && b > 0 && a <= b) return { done: countText(a), total: `${countText(b)}${named}`, pct: isBeside ? pctSeen : percentOf(a, b), rate: rateOf(line) }
  }
  // Else a percent alone, with any size it says is done (git: Receiving objects: 45% (450/1000), 460.00 MiB | 10.20 MiB/s)
  if (pctSeen) {
    const size = line.match(new RegExp(String.raw`${SIZE}(?!\s?/s|ps)`))
    const d = size && /[KMGTP]/i.test(size[2] ?? '') ? sizeOf(size[1] ?? '', size[2]) : undefined
    return { pct: pctSeen, ...(d ? { done: sizeText(d) } : {}), rate: rateOf(line) }
  }
  return undefined
}
const tidy = (p: Progress): Progress => Object.fromEntries(Object.entries(p).filter(([key, v]) => key !== 'wget' && v !== undefined && v !== '')) as Progress
// How far a run is, from its last line; or else from the newest of the work's own progress lines a little higher up, which says
// it is earlier than the last line, so the last line is still shown beside it (an error after a download is never hidden). wget's
// total is its Length, said once above its bar
export const progressOf = (lines: string[]): Progress => {
  const last = lines.at(-1) ?? ''
  const found = lineProgress(last)
  if (found && (found.pct || found.done)) {
    const length = (found as { wget?: boolean }).wget && !found.total ? lines.map(l => l.match(/^Length:\s*(\d+)/)?.[1]).filter(Boolean).at(-1) : undefined
    const left = found.left ?? (found.pct === '100%' ? undefined : leftOf(last))
    return tidy({ ...(length && Number(length) > 0 ? { ...found, total: sizeText({ bytes: Number(length), base: 1024 }) } : found), left })
  }
  for (const line of lines.slice(0, -1).reverse()) {
    if (ownOf(line) === undefined) continue
    const own = lineProgress(line)
    if (own && (own.pct || own.done)) return tidy({ ...own, rate: undefined, left: undefined, words: undefined, isEarlier: true })
  }
  return {}
}

// The engine's own last line on the output of a background command or watch that has ended: `[exited with code N]` as it exits,
// `[killed]` as the engine kills it (a watch at its time limit, or one stopped)
export type RunEnd = { how: 'finished' | 'failed' | 'killed'; code?: string }
export const endOf = (text: string): RunEnd | undefined => {
  const exit = text.match(/\[exited with code ([^\]\n]*)\]\s*$/)
  if (exit) return exit[1]?.trim() === '0' ? { how: 'finished' } : { how: 'failed', code: (exit[1] ?? '').trim() }
  return /(^|\n)\[killed\]\s*$/.test(text) ? { how: 'killed' } : undefined
}
export const isOutputEnded = (text: string) => Boolean(endOf(text))
// How long a watch runs before the engine ends it, as the engine said when it started it ("expires in 30m"), in ms
export const expiresIn = (said: string) => {
  const m = said.match(/expires in ((?:\d+(?:\.\d+)?\s?(?:h|m|s)\s*){1,3})/i)
  const seconds = m ? secondsIn((m[1] ?? '').trim()) : undefined
  return seconds ? seconds * 1000 : undefined
}
// The seconds a run's time left says, as leftText wrote it (`1h 05m left`, `55s left`)
export const leftSeconds = (left: string | undefined) => (left ? secondsIn(left.replace(/\s*left$/, '').trim()) : undefined)

// The end of a job's output as its latest line: colours and cursor moves taken out, a line a progress bar rewrites read as it
// stands last, with the last percent in it and any port it named
// The last few lines an output ends with, as a terminal would show them: a line a progress bar rewrote with returns is its last
// state, colours and blank lines are dropped, each line is cut to a row
export const OUTPUT_LINES = 4
export const tailOf = (text: string, most = OUTPUT_LINES) =>
  text
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
    .replace(/\x1b\][^\x07]*\x07/g, '')
    .split('\n')
    .map(line => (line.split('\r').filter(part => part.trim()).at(-1) ?? '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trimEnd())
    .filter(line => line.trim())
    .slice(-most)
    .map(line => line.slice(0, 200))
export const latestOf = (text: string) => {
  const clean = text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07]*\x07/g, '')
  const lines = clean
    .split('\n')
    .map(line => line.split('\r').map(part => part.trim()).filter(Boolean).at(-1) ?? '')
    .filter(Boolean)
  const last = lines.at(-1) ?? ''
  const progress = progressOf(lines)
  // A web server's access line says only the request and its answer
  const hit = last.match(/"(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) (\S+) HTTP\/[\d.]+" (\d{3})/)
  const line = hit ? `${hit[1]} ${hit[2]} ${hit[3]}` : last
  return { latest: line.replace(/\s+/g, ' ').trim().slice(0, 240), ...progress, port: portOf(clean) }
}


// A command started detached, with nohup or setsid and its output sent to a file: the command itself, the log as written, and the
// folder a leading `cd` moved it to; undefined for any other command
export const detachedOf = (command: string) => {
  // Started on another Mac over ssh, its log and process are there, not here
  if (/^\s*(\S*\/)?ssh\b/.test(command)) return undefined
  // nohup or setsid at the head of a command, sent off with a lone &
  if (!/(^|&&|;|\|\||\n)\s*(nohup|setsid)\s/.test(command) || !/(?<![>&<])&(?![&>\d])/.test(command)) return undefined
  const written = command.match(/(?:^|[^0-9&2])>>?\s*("[^"]+"|'[^']+'|[^\s;&|]+)/)?.[1]?.replace(/^["']|["']$/g, '')
  if (!written || written === '/dev/null') return undefined
  // A log or folder named by a shell variable the command sets itself (S=/tmp/x && nohup ... > $S/run.log) is named whole; one
  // named by any other variable is not followed, as a wrong file would leave its card blank for as long as the run lasts
  const vars = new Map([...command.matchAll(/(?:^|&&|;|\n)\s*(?:export\s+)?([A-Za-z_]\w*)=("[^"$`]*"|'[^']*'|[^\s;&|$`]+)(?=\s*(?:&&|;|\n))/g)].map(m => [m[1] ?? '', (m[2] ?? '').replace(/^["']|["']$/g, '')]))
  const expand = (text: string) => text.replace(/\$(?:\{([A-Za-z_]\w*)\}|([A-Za-z_]\w*))/g, (all, braced: string | undefined, bare: string | undefined) => {
    const name = braced ?? bare ?? ''
    return name === 'HOME' ? '~' : (vars.get(name) ?? all)
  })
  const log = expand(written)
  const cd = command.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)\s*&&/)?.[1]?.replace(/^["']|["']$/g, '')
  if (log.includes('$') || cd?.includes('$')) return undefined
  const core = (command.match(/\b(?:nohup|setsid)\s+(.*?)\s*(?:>|$)/)?.[1] ?? command).trim()
  return { log, cd, core }
}
// The process id a detached start printed, as `echo $!` does
// (never 0 or a number with a leading zero: on 15 Nov a curl's "000" in the same output was taken for one, and `kill -0 0` always
// succeeds, so a run long ended stayed on its card for hours)
// Only when it is the one number printed: a status code another command printed beside it could be taken for it
export const pidOf = (stdout: string) => {
  const numbers = stdout.split('\n').filter(line => /^\s*\d+\s*$/.test(line))
  return numbers.length === 1 ? numbers[0]?.match(/^\s*([1-9]\d{1,6})\s*$/)?.[1] : undefined
}
export const isPid = (pid: string) => /^[1-9]\d{1,6}$/.test(pid)

// A call that only waits (a sleep, a wait) is no job of its own
export const isWaitOnly = (cmd: string) => /^\s*(sleep\s|wait\b|python3? -c ['"]import time; ?time\.sleep)/.test(cmd)
// A job's own words, without the command some descriptions repeat after a colon
// A job the work gave no words to is named by what it runs, in a few words (bash round3b_figs.sh, python rc.py), never by the head
// of its shell line: on 15 Nov a row read "cd /private/tmp/claude-501/-Users ..."
export const labelOf = (what: string, cmd: string) => {
  const isCommand = !what || (cmd.trim() && cmd.replace(/\s+/g, ' ').trim().startsWith(what.replace(/\s+/g, ' ').trim().slice(0, 40)))
  if (isCommand) return commandName(cmd) || what
  const head = what.split(': ')[0] ?? what
  const first = cmd.trim().split(/\s+/).find(word => !/^(cd|&&|nohup|setsid)$/.test(word) && !word.startsWith('/')) ?? ''
  return head !== what && first && what.slice(head.length + 2).startsWith(first.slice(0, 6)) ? head : what
}

// What a shell line runs, in a few words: its first step that does more than move or set up, as its program and the file or word
// it works on, each without its folders
const LEAD = /^(cd|pushd|popd|export|source|\.|mkdir|set|unset|umask|ulimit|echo|printf|true|sleep|wait|clear)\b/
export const commandName = (cmd: string) => {
  const steps = stepsOf(cmd).map(one => one.replace(/^(do|then|else)\s+/, ''))
  // A loop or test leading the line is named as one, not by its first word
  if (/^(for|while|until|if|select)\b/.test(steps[0] ?? '') && !steps.slice(1).some(one => !LEAD.test(one) && !/^(for|while|until|if|done|fi|esac)\b/.test(one) && !/^[A-Za-z_]\w*=/.test(one))) return 'a shell loop'
  const step = steps.find(one => !LEAD.test(one) && !/^(for|while|until|if|done|fi|esac)\b/.test(one) && !/^[A-Za-z_]\w*=/.test(one)) ?? ''
  let words = (step.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map(word => word.replace(/^["']|["']$/g, ''))
  // A runner of runners says what it runs: uv run python train.py is python train.py
  while (/^(uv|poetry|pipenv|pdm|hatch|conda|mamba)$/.test(words[0] ?? '') && words.includes('run')) words = words.slice(words.indexOf('run') + 1).filter((word, n, all) => !(n < 2 && (/^-n$|^--name$/.test(word) || /^-n$|^--name$/.test(all[n - 1] ?? ''))))
  const program = (words[0] ?? '').split('/').filter(Boolean).at(-1) ?? ''
  if (!program) return ''
  const isRunner = /^(python\d?(\.\d+)?|node|bash|sh|zsh|ruby|perl|deno|bun|uv|npx|Rscript|julia|ssh)$/.test(program)
  // A runner says what it runs; any other program what it works on first, past a folder it is pointed at (git -C <folder>)
  const rest = words.slice(1).filter((word, n, all) => !(/^-[Cc]$/.test(all[n - 1] ?? '') || /^-[Cc]$/.test(word)))
  const arg = rest.find(word => word && !word.startsWith('-') && !/^[<>|&]/.test(word) && !/^\d+>/.test(word) && (!isRunner || !/^(run|exec|-m)$/.test(word)))
  const short = (arg ?? '').split('/').filter(Boolean).at(-1) ?? ''
  return `${program}${short && short.length <= 40 ? ` ${short}` : ''}`
}

// A command that only waits for something, polling until it is so: what it waits for, in a few words, and what can be looked at to
// tell how that stands (a process by its pattern or number, a file). Undefined for a command that does more than wait and report
export type Wait = { what: string; pattern?: string; pid?: string; file?: string; isStart?: boolean }
// A quoted word, blanked so what it holds splits nothing
const unquoted = (text: string) => text.replace(/"(\\.|[^"\\])*"|'[^']*'/g, '""')
const LIGHT = /^(date|tail|head|grep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed|jq|true|cd|uptime|pwd)\b/
const nameOf = (path: string) => path.replace(/^["']|["']$/g, '').split('/').filter(Boolean).at(-1) ?? path
export const waitOf = (cmd: string): Wait | undefined => {
  // A leading cd, joined with && or ; (on 15 Nov a wait led by `cd <folder>;` was not known as one)
  const cd = cmd.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;]+)\s*(?:&&|;)/)?.[1]?.replace(/^["']|["']$/g, '')
  const body = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;]+)\s*(?:&&|;)\s*/, '').replace(/^\s*end=\$\(\([^;]*\)\);\s*/, '')
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

// A run of a work's own that still goes, as its card keeps it: its words, its command and its process where known
export type OwnRun = { id: string; what: string; cmd: string; pid?: string }
// The steps a command that only waits is made of: looking, counting, printing and sleeping (each step as split below, a test's or a
// loop's own condition taken as a step of its own)
const LOOKS = /^(?:(?:for|done|fi|break|continue|sleep|wait|kill\s+-0|kill\s+-s\s+0|pgrep|ps|seq|test|\[\[?|\]\]?|:|true|false|exit|date|tail|head|grep|egrep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed(?!.*\s-i)|jq|cd|pwd|tr)(?:\s|$)|[A-Za-z_]\w*=\S*$|[A-Za-z_]\w*\s*[-+*/%<>]=?\s*\w+$|\d+$|\(+$)/
// A pgrep's pattern, as plain words: the longest run of it with no pattern signs, so nothing the work wrote is run as a pattern
const pgrepWords = (pattern: string) => pattern.split(/[.*+?^${}()|[\]\\]+/).reduce((a, b) => (b.trim().length > a.length ? b.trim() : a), '')
// A command whose only job is to wait for a run of the same work to end: the run it waits on, by its process (kill -0, ps -p, wait)
// or by a pgrep that waits for it to be gone. A run that ends wakes the work that started it, so such a wait only holds the next
// step back until its loop comes round (16 Nov: an upload left detached was waited on by five waits in a row, the card saying 40%
// done while it read 100%). A wait for a line in a log, a port or a file is let through: what it waits for comes while the run goes
export const ownWaitOf = (cmd: string, runs: OwnRun[]): OwnRun | undefined => {
  if (!runs.length) return undefined
  const text = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&]+)\s*(?:&&|;)\s*/, '')
  // It waits: a loop that sleeps between its tries, or the shell's own wait on a process
  const isLoop = /\b(?:for|while|until)\b[^]*?\bdo\b[^]*?\bsleep\s+[\d.]+[^]*?\bdone\b/.test(text)
  const isWait = /(?:^|[;&|]\s*)wait\s+\d+\s*(?:$|[;&|])/.test(text)
  if (!isLoop && !isWait) return undefined
  // and does nothing else: no step of its own does work, writes a file, or is sent off on its own
  if (/(?:^|[^>&0-9])>>?\s*(?!\/dev\/null\b|&)\S/.test(unquoted(text))) return undefined
  const steps = unquoted(text)
    .split(/\s*(?:;|&&?|\|\|?|\n|\$\(\(?|\)\)?|`)\s*/)
    .map(step => step.trim().replace(/^(?:(?:do|then|else|elif|if|while|until|!)\s+)+/, '').replace(/\s*\d?>+\s*\S+/g, '').trim())
    .filter(step => step && !/^(?:do|then|else)$/.test(step))
  if (!steps.every(step => LOOKS.test(step))) return undefined
  const pids = new Set([...text.matchAll(/\b(?:kill\s+(?:-0|-s\s+0)|ps\s+(?:-\w+\s+)*-p|wait)\s+(\d+)/g)].map(m => m[1] ?? ''))
  // (a pgrep that waits while it finds the run, or until it no longer does; its options that take a value are passed over, and
  // a pattern too short to name one run counts for none)
  const ends = [...text.matchAll(/\b(?:while|until\s+!)\s*pgrep\s+((?:-[uUgGPstF]\s+\S+\s+|-\w+\s+)*)("[^"]+"|'[^']+'|[^\s;&|)]+)/g)]
    .map(m => pgrepWords((m[2] ?? '').replace(/^["']|["']$/g, '')))
    .filter(words => words.length >= 8)
  return runs.find(run => (run.pid && pids.has(run.pid)) || ends.some(words => run.cmd.includes(words)))
}

// A command made only of what reads and sifts another's output (tail, grep and their kind): left going, it only watches a run and
// ends with nothing. `isFollow` when it follows a file as it grows, so it never ends of itself (16 Nov: pairs of "tail pic_eyes.log"
// and "ugrep wrote" stood silent for an hour and a half under a card and two finished helpers, long after what they watched)
const FILTER = /^(?:\S*\/)?(?:tail|grep|egrep|fgrep|ugrep|rg|awk|sed|cut|tr|head|cat|uniq)\b/
export const watcherOf = (cmd: string): { isFollow: boolean } | undefined => {
  if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(cmd)) return undefined
  const steps = unquoted(cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&]+)\s*(?:&&|;)\s*/, ''))
    .split(/\s*(?:\|\|?|;|&&?)\s*/)
    .map(step => step.trim().replace(/\s*\d?>+\s*\S+/g, '').replace(/^(?:(?:nohup|setsid|stdbuf\s+-oL)\s+)+/, ''))
    .filter(Boolean)
  if (!steps.length || !steps.every(step => FILTER.test(step) && !/\bsed\b.*\s-i\b/.test(step))) return undefined
  return { isFollow: steps.some(step => /^(?:\S*\/)?tail\b.*\s(?:-\w*[fF]\w*|--follow\S*)(?:\s|$)/.test(step)) }
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
// (listed with its process group and resident memory, `ps -axww -o pid=,ppid=,pgid=,stat=,etime=,rss=,command=`, it has those too)
export type Proc = { pid: string; ppid: string; stat: string; startAt: number; command: string; pgid?: string; rss?: number }
const secondsOf = (etime: string) => {
  const [days, rest = ''] = etime.includes('-') ? etime.split('-') : ['0', etime]
  return Number(days) * 86400 + rest.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
}
export const PS_COLUMNS = 'pid=,ppid=,pgid=,stat=,etime=,rss=,command='
export const procsOf = (text: string, now: number): Proc[] =>
  text.split('\n').flatMap(line => {
    const full = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+((?:\d+-)?[\d:]+)\s+(\d+)\s+(.*)$/)
    if (full) return [{ pid: full[1] ?? '', ppid: full[2] ?? '', pgid: full[3] ?? '', stat: full[4] ?? '', startAt: now - secondsOf(full[5] ?? '0') * 1000, rss: Number(full[6] ?? 0), command: full[7] ?? '' }]
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
// The shell a command held open runs in, found by the command itself as the engine hands it to the shell (eval '...', its own
// quotes written '"'"' and its new lines as ps writes them) and by when it started; undefined when none is. A command's words
// alone are too few to tell most commands by (python3 train.py), so the command is matched whole, from its start
const flat = (text: string) => text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim()
export const heldShellOf = (procs: Proc[], cmd: string, at: number) => {
  const want = flat(cmd).slice(0, 200)
  if (!want) return undefined
  return procs
    .filter(p => /shell-snapshots\/snapshot-/.test(p.command) && p.ppid !== '1' && Math.abs(p.startAt - at) <= 20_000)
    .filter(p => {
      const start = p.command.indexOf(" eval '")
      if (start < 0) return false
      const end = p.command.lastIndexOf("' < /dev/null")
      const body = p.command.slice(start + 7, end > start ? end : undefined).replaceAll(`'"'"'`, "'").replaceAll(`'\\''`, "'").replace(/\\012/g, '\n')
      return flat(body).startsWith(want) || want.startsWith(flat(body).slice(0, 200))
    })
    .sort((a, b) => Math.abs(a.startAt - at) - Math.abs(b.startAt - at))[0]?.pid
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

// ---- What a command leaves running, however it was started ----
// A command's shell leads a process group of its own, and what it starts keeps that group: sent off with &, under nohup, in a shell
// loop, by xargs -P, by a launcher that exits, in a Python pool. Once the shell has ended, what still runs in its group belongs to
// that command; so does what it started in a session of its own while it ran (setsid, start_new_session). A command is known here
// by the process numbers handed out while it ran, from just before it to just after it, so nothing depends on how it was written
// (on 15 Nov a launcher started with nohup but no `echo $!` drew 8 pages at once with 56 GB and no row on its card)
// (`until`: the latest a process it left can have started; none while a command sent to the background may still start more)
export type Span = { id: string; from: number; to: number; at: number; endAt: number; cmd: string; until?: number }
// A command still running: what it starts is not given to another that ended meanwhile
export type OpenCall = { from: number; at: number }
// Process numbers wrap round past this on macOS
const PID_MOST = 99_999
const inSpan = (pid: number, span: Pick<Span, 'from' | 'to'>) => (span.to >= span.from ? pid > span.from && pid < span.to : pid > span.from || (pid < span.to && pid <= PID_MOST))
// The system's own programs, which launchd starts in sessions of their own whenever it likes, are never a command's
const SYSTEM_PROG = /^(\/System\/|\/usr\/libexec\/|\/usr\/sbin\/|\/sbin\/|\/Library\/Apple\/|\/Applications\/|\/Library\/Application Support\/)/
export type Left = { span: string; top: Proc; tree: Proc[] }
// What each command left running: the topmost of each group whose shell has gone (or a session it started of its own), with all it
// started under it; never one already followed (`known`), nor what runs under one
// A process counts only when it started while its command ran (or, for one sent to the background, after it began): app helpers
// orphaned long ago keep a dead leader's group, and process numbers come round again within minutes, so a number alone proves
// nothing (a second look on 15 Nov found Claude, Telegram and Discord helpers 20 hours old claimed by a fresh command)
export const leftoversOf = (procs: Proc[], spans: Span[], known: Set<string> = new Set(), open: OpenCall[] = []): Left[] => {
  if (!spans.length) return []
  const pids = new Set(procs.map(p => p.pid))
  const byPid = new Map(procs.map(p => [p.pid, p]))
  // The groups of runs already followed: the rest of a pipeline sent off with `& echo $!` is that run's
  const knownGroups = new Set(procs.filter(p => known.has(p.pid) && p.pgid).map(p => p.pgid))
  const isTimely = (p: Proc, s: Span) => p.startAt >= s.at - 2_000 && (s.until === undefined || p.startAt <= s.until + 2_000)
  // One a command still running may have started waits for that command to end
  // (numbers handed out after it, counted round the wrap)
  const after = (n: number, from: number) => (n - from + PID_MOST + 1) % (PID_MOST + 1)
  const isOpenOnes = (n: number, p: Proc) => open.some(o => after(n, o.from) > 0 && after(n, o.from) < 50_000 && p.startAt >= o.at - 2_000)
  // A process under one already followed is that one's
  const isUnderKnown = (p: Proc) => {
    for (let at: Proc | undefined = p, n = 0; at && n < 64; at = byPid.get(at.ppid), n++) if (known.has(at.pid)) return true
    return false
  }
  // The command a number was handed out under; where two ran at once, the one whose words the process holds, else the newest
  const spanOf = (pid: number, p: Proc, isOwnSession: boolean) => {
    const fits = spans.filter(s => inSpan(pid, s) && isTimely(p, s))
    if (fits.length <= 1) return fits[0]
    // A group's leader is its command's own shell, handed its number just after that command's first one: the command whose first
    // number is nearest below is it. A session of its own goes by the words it holds first
    const worded = isOwnSession ? fits.filter(s => fragmentsOf(s.cmd).some(word => p.command.includes(word.split('/').at(-1) ?? word))) : []
    return (worded.length ? worded : fits).reduce((a, b) => (after(pid, b.from) < after(pid, a.from) ? b : a))
  }
  const out: Left[] = []
  for (const p of procs) {
    if (p.ppid !== '1' || !p.pgid || known.has(p.pid) || knownGroups.has(p.pgid) || isUnderKnown(p)) continue
    const isOwnSession = p.pgid === p.pid
    if (isOwnSession ? SYSTEM_PROG.test(p.command) : pids.has(p.pgid)) continue
    const n = Number(isOwnSession ? p.pid : p.pgid)
    if (isOpenOnes(n, p)) continue
    const span = spanOf(n, p, isOwnSession)
    if (span) out.push({ span: span.id, top: p, tree: treeOf(procs, p.pid) })
  }
  return out
}
// The memory a process and all it started hold, in words (`7.1 GB`); undefined where ps gave none
export const memOf = (tree: Proc[]) => {
  const kb = tree.reduce((sum, p) => sum + (p.rss ?? 0), 0)
  if (!kb) return undefined
  return kb >= 1024 * 1024 ? `${(kb / 1024 / 1024).toFixed(1)} GB` : `${Math.max(1, Math.round(kb / 1024))} MB`
}
// A left run's name when one command left several: its program, its script and the words after it, as `Run python fig4.py page 3`
export const leftName = (command: string) => {
  const words = command.trim().split(/\s+/)
  const at = words.findIndex(word => /\.(py|sh|js|mjs|ts|rb|pl|R|jl)$/.test(word))
  const name = (at >= 0 ? [commandName(command), ...words.slice(at + 1, at + 7)] : [commandName(command)]).join(' ').trim()
  return `Run ${name.replace(/^Python\b/, 'python')}`.slice(0, 120)
}
