// The running jobs a piece of work has, told apart and read: a server, a download or a script, from its command or its own words,
// and the latest line it wrote, from the end of its output. Nothing here touches the engine

export type JobKind = 'server' | 'download' | 'upload' | 'script' | 'remote' | 'watch'
// A job as its row shows it: when its output last changed and how many alike it stands for
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
  isNamed?: boolean
  wroteAt?: number
  count?: number
  // While it writes nothing: whether the programs that hold its log open use the processor
  live?: 'busy' | 'idle'
  // Its title and kind in plain words, and what it does now, as the small model said them (naming.tsx)
  title?: string
  namedKind?: string
  now?: string
}

// How often the jobs' output is read, and how often a job that wrote something new counts as news for its card
export const JOB_LOOK = 5_000
export const JOB_NEWS = 60_000
// At most this many jobs are rows under one card or helper
export const JOBS_SHOWN = 4
// Only the end of each job's output is read
export const JOB_TAIL = 4000

// Purple and a round dot are a helper's alone: a job has its own colour and shape, and its kind in words at the head of its row
// (a download and an upload share their blue: the arrow says which way it goes)
// (and a command that runs on another computer is a command's square, hollow: the work is not on this Mac)
export const JOB_COLOR: Record<JobKind, string> = { server: '#4EBA65', download: '#5AA7E6', upload: '#5AA7E6', script: '#36B5A8', remote: '#36B5A8', watch: '#9A9A9A' }
export const JOB_GLYPH: Record<JobKind, string> = { server: '◆', download: '▼', upload: '▲', script: '■', remote: '□', watch: '◇' }
export const JOB_WORD: Record<JobKind, string> = { server: 'Server running', download: 'Downloading', upload: 'Uploading', script: 'Command running', remote: 'Running on another computer', watch: 'Watching' }
export const JOB_HEAD: Record<JobKind, string> = { server: 'Server', download: 'Download', upload: 'Upload', script: 'Command', remote: 'Remote command', watch: 'Watch' }
// What a row says while its command gives no plain word of its own: its kind, as a doing word
export const JOB_NOW: Record<JobKind, string> = { server: 'Serving', download: 'Downloading', upload: 'Uploading', script: 'Running', remote: 'Running on another computer', watch: 'Watching' }
// Its mark on the tree, drawn: a square, a diamond, a down arrow, an open diamond, never a helper's round dot
export const JOB_SHAPE: Record<JobKind, 'square' | 'hollow' | 'diamond' | 'down' | 'up' | 'open'> = { server: 'diamond', download: 'down', upload: 'up', script: 'square', remote: 'hollow', watch: 'open' }
// A job whose output has not changed for this long says, in amber, that it has gone quiet, and one that has printed nothing at all
// says so: work is told to print progress at least every 10 seconds, so a few minutes of nothing is worth a look
export const JOB_QUIET = 3 * 60_000
// A run that has given no word this long says so on its row, in amber. Its work is told to look at it after a minute, but on 16 Nov
// 79 runs drew that notice and none was stuck (tests, builds, installs, cloud jobs; one quiet 20 minutes ended well), and a count of
// seconds before then said nothing a still percent does not ("nothing printed for 5 seconds, 10 seconds" was useless)
export const SILENT_AFTER = 3 * 60_000
export const SILENT_WARN = 60_000
// A job whose output has not been found this long after it started says so on its row
export const JOB_UNREAD = 60_000

export const SERVER_CMD =
  /\b(http\.server|http-server|uvicorn|gunicorn|hypercorn|flask run|runserver|vite( dev| preview)?|next (dev|start)|(npm|pnpm|yarn|bun) (run )?(dev|start|serve|preview)|rails s(erver)?|jupyter (lab|notebook)|ollama serve|tensorboard|serve -[sl]|python3? -m (http\.server|uvicorn))\b/i
export const DOWNLOAD_CMD =
  /\b(curl|wget|aria2c|huggingface-cli download|hf download|git clone|git lfs (pull|fetch)|rsync|scp|gsutil (-m )?cp|aws s3 (cp|sync)|pip3? install|uv (pip )?(install|sync)|npm (i|install|ci)|pnpm (i|install)|yarn install|brew install|docker pull|yt-dlp|azcopy (copy|cp|sync)|gh release download|gh run download|az storage (blob|file) (download|upload)(-batch)?|python3? -m pip install)\b/i

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
// nothing from the command: its kind first (Download, Upload, Watch, Serve, Run), then what it does: `Download the CT scans`
const KIND_WORDS: [RegExp, JobKind][] = [
  [/^upload\b/i, 'upload'],
  [/^(download|fetch|copy|sync|clone|install)\b/i, 'download'],
  [/^(watch|wait(ing)?|poll(ing)?)\b/i, 'watch'],
  [/^serve\b/i, 'server'],
  // (the plain verb for what a command does says its kind as Run does: its row leads with it, and says Building, Testing while it goes)
  [/^(run|build|test|render|train|deploy|make|convert|compute|fit|check|verify|draw|measure|export|index|compress|extract)\b/i, 'script'],
]
export const describedOf = (what: string) => {
  // (a time in brackets at its end, as descriptions once carried, is no part of what it does: a row never says a guessed time)
  const text = what.replace(new RegExp(String.raw`\s*\((?:about|around|roughly|up to|~)?\s*(?:\d+(?:\.\d+)?\s*[-–]\s*)?${TIME}\)\s*$`, 'i'), '').trim()
  return { text, kind: KIND_WORDS.find(([re]) => re.test(text))?.[1] }
}
// Words that lead a run's own name and say its kind already, so its row does not say it twice
export const isKindSaid = (label: string) => KIND_WORDS.some(([re]) => re.test(label.trim()))
// A program that only looks at or opens what is on this Mac is never a download, whatever folder it names (find Downloads)
const LOCAL_TOOL = /^(?:\/\S*\/)?(?:find|fd|grep|egrep|rg|ag|ls|cat|head|tail|less|open|mdfind|stat|file|du|wc|sed|awk|sort|tree|cp|mv|rm|mkdir|touch|cd|echo|printf|test|pwd|code|unzip|tar|shasum)\b/
const isLocalTool = (step: string) => LOCAL_TOOL.test(step)
// Else, for words written another way or none, its kind is told from its command
// A command whose own program runs the work on another computer (ssh, a cloud job it starts or follows, a cluster's queue) is a
// remote command, whatever verb its words lead with: what it does is not on this Mac
const REMOTE_CMD = /^(?:\S*\/)?(?:ssh\s+(?!-V\b)|az\s+(?:ml\s+job\s+(?:create|stream)|batch\s|vm\s+run-command|container\s+exec|acr\s+build)|gcloud\s+(?:compute\s+ssh|ai\s|run\s+jobs|builds\s+submit|batch\s)|aws\s+(?:batch|sagemaker|ssm\s+start-session)\s|kubectl\s+(?:exec|run)\s|modal\s+run\s|sbatch\b|srun\b)/
const isRemote = (cmd: string) => stepsOf(cmd).some(step => REMOTE_CMD.test(step))
export const jobKindOf = (cmd: string, label: string): JobKind => {
  const said = describedOf(label).kind
  if (said) return said === 'script' && isRemote(cmd) ? 'remote' : said
  if (SERVER_CMD.test(cmd) || /\bserver\b/i.test(label)) return 'server'
  if (!CHECKS.test(label.trim()) && (stepsOf(cmd).some(isFetching) || (/\bdownload(?:ing|ed)?\b/i.test(label) && !stepsOf(cmd).every(isLocalTool)))) return 'download'
  return isRemote(cmd) ? 'remote' : 'script'
}
// Each step of a shell line with what only sets it up taken off its head (a variable, env, nohup, time, sudo, exec), never a `cd`
const SETUP = /^(?:(?:[A-Za-z_]\w*=(?:"[^"]*"|'[^']*'|\S*)|env|nohup|setsid|exec|sudo|command|(?:\/usr\/bin\/)?time(?:\s+-\w+)*|timeout\s+\S+|caffeinate(?:\s+-\w+)*)\s+)+/
const stepsOf = (cmd: string) =>
  cmd
    .replace(/"(\\.|[^"\\])*"|'[^']*'/g, m => m.replace(/[;&|\n]/g, ' '))
    .split(/\s*(?:&&|\|\||;|\||\n|(?<![>&])&(?![>&]))\s*/)
    .map(step => step.trim().replace(/^\(+\s*/, '').replace(/^(do|then|else)\s+/, '').replace(SETUP, '').trim())
    .filter(Boolean)

// A command that loads the Mac hard: a browser it drives (Playwright, Puppeteer, headless Chrome), a build, or a render of video or
// 3D. Told by each step's own program, and by what a script it runs imports, never by a word another program only reads
// (`grep playwright package.json`); a server is none, as it never ends to make room. The mod's own release and test kit are none
// either: they are never held. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once, and on 15 Nov
// its load average reached 204 on 18 cores
export type HeavyKind = 'browser' | 'build' | 'render'
const BROWSER_STEP = /^(?:(?:npx|pnpm(?: exec| dlx)?|yarn|bunx|uvx)\s+(?:-\S+\s+)*)?(?:playwright\b(?!\s+install\b)|puppeteer\b|shot-scraper\b|capture-website\b|pageres\b|wkhtmltoimage\b|chrome-headless-shell\b|(?:chromium(?:-browser)?|google-chrome(?:-stable)?|Google Chrome(?: for Testing| Canary)?|Chromium|Microsoft Edge|Brave Browser)\s.*--(?:headless|screenshot|print-to-pdf|dump-dom)\b)/
const BROWSER_SCRIPT = /\bfrom\s+['"](?:playwright|@playwright\/test|puppeteer(?:-core)?)['"]|\brequire\(\s*['"](?:playwright|puppeteer(?:-core)?)['"]\s*\)|\bimport\s*\{[^}]*\b(?:chromium|firefox|webkit)\b[^}]*\}\s*from\s*['"][^'"]*playwright[^'"]*['"]|\bfrom\s+playwright\.(?:sync|async)_api\s+import\b|\b(?:chromium|puppeteer)\.launch\(|\bpyppeteer\b|\bselenium\.webdriver\b/
const BUILD_STEP = /^(?:(?:npx|bunx)\s+)?(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?build\b|next\s+build\b|vite\s+build\b|astro\s+build\b|nuxt\s+build\b|remix\s+build\b|webpack\b|rollup\b|turbo\s+(?:run\s+)?build\b|cargo\s+build\b|xcodebuild\b|swift\s+build\b|go\s+build\b|docker\s+(?:buildx\s+)?build\b|gradlew?\s|mvn\s|make\b(?=.*\s-j)|cmake\s+--build\b|bazel\s+build\b|expo\s+export\b)/
const RENDER_STEP = /^(?:(?:npx|pnpm(?: exec| dlx)?|bunx)\s+(?:-\S+\s+)*)?(?:ffmpeg\b|remotion\s+render\b|hyperframes\s+render\b|blender\b.*\s(?:-b|--background)\b|manim\b|povray\b)/
// A script a step runs with an interpreter, for the browser it may drive
// A script a step runs with an interpreter, for the browser it may drive: a file it names, or code given on its own line
const INTERPRETED = /^(?:(?:npx|pnpm\s+(?:exec|dlx)|bunx)\s+(?:-\S+\s+)*)?(?:node|bun|deno(?:\s+run)?|tsx|ts-node|python3?|uv\s+run(?:\s+python3?)?)\b/
// What never ends to make room is no heavy command, as a server is not: a build or test that watches, a report or test window it
// serves, a recorder of clicks
const ENDLESS = /(?:\s--watch\b|\s-w\b|\s--ui\b|\bserve\b|\bshow-report\b|\bshow-trace\b|\bcodegen\b|\bdev\b)/
// A look that is over in a moment: a program's version or help, one frame taken out of a video
const MOMENT = /\s(?:-version|-h|-help|--help|-codecs|-formats|-encoders|-decoders|-filters|-frames:v\s+1|-vframes\s+1)\b/
const MOD_OWN = /(?:^|\/)bin\/release\b|\bguard\.mjs\b|\bplugin\s+(?:test|validate)\b|\bsrc\/claudopus\/build\.mjs\b/
export const heavyOf = (cmd: string, scripts: string[] = []): HeavyKind | '' => {
  // The mod's own runners anywhere in it, by their paths as written: the release runs builds and tests of its own and is never held
  if (MOD_OWN.test(cmd)) return ''
  // Each step by its own program's name, its folder taken off, quoted, escaped or not: "/Applications/Google Chrome.app/.../Google Chrome" --headless
  const steps = stepsOf(cmd.replace(/\\ /g, '\u0000'))
    .map(step => step.replace(/^"[^"]*\/([^"/]+)"/, '$1').replace(/^'[^']*\/([^'/]+)'/, '$1').replace(/^[^\s"']*\//, '').replace(/\u0000/g, ' '))
    .filter(step => !ENDLESS.test(step) && !MOMENT.test(step))
  const isBrowserScript = steps.some(step => INTERPRETED.test(step)) && [cmd, ...scripts].some(text => BROWSER_SCRIPT.test(text))
  if (steps.some(step => BROWSER_STEP.test(step)) || isBrowserScript) return 'browser'
  if (steps.some(step => SERVER_CMD.test(step))) return steps.some(step => RENDER_STEP.test(step)) ? 'render' : steps.some(step => BUILD_STEP.test(step) && !SERVER_CMD.test(step)) ? 'build' : ''
  if (steps.some(step => RENDER_STEP.test(step))) return 'render'
  if (steps.some(step => BUILD_STEP.test(step))) return 'build'
  return ''
}

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
// (a failure's reason is shown as written, so only what names a secret itself is kept out of it)
const SECRETISH_WHY = /\b(pass(?:word|phrase|wd|code)?s?|secrets?|tokens?|api[-_ ]?keys?|bearer|authori[sz]ation|credentials?|otp|2fa|mfa|ssh-(?:rsa|ed25519))\b|\b(?:sk|pk|ghp|gho|xox[abp])[-_][A-Za-z0-9]{8,}/i
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
// A long command of the work's own script: a file it runs, as read, asked for with a long time limit. False for any other: a short
// one, a watch or a server, or a program that is no script of its own (a long time limit alone says nothing: most such calls are a
// push, a short test or a look). The mod's own runners are never told from here. What the script prints is not looked at
export const isOwnLongScript = (command: string, description: string, scripts: string[], timeoutMs = 0) => {
  if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(command)) return false
  const said = describedOf(description)
  if (said.kind === 'server' || said.kind === 'watch' || SERVER_CMD.test(command)) return false
  return timeoutMs > 2 * 60_000 && scripts.length > 0
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
// A unit of time: a `progress:` line counts things done, never seconds or minutes, and a row ignores one that counts time
const TIME_UNIT = /^(?:s|secs?|seconds?|m|mins?|minutes?|h|hrs?|hours?|ms)$/i
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
      if (TIME_UNIT.test(u1) || TIME_UNIT.test(u2)) return undefined
      const na = Number(a.replace(/,/g, ''))
      const nb = Number(b.replace(/,/g, ''))
      const isSizeUnit = (u: string) => /^([KMGTP]i?B|B|bytes?)$/i.test(u)
      const unit = isSizeUnit(u2) ? u2 : isSizeUnit(u1) ? u1 : u2 && !u1 && (COUNTED.test(u2) || /^[a-z]{3,}s$/i.test(u2)) ? u2 : ''
      const isSize = isSizeUnit(unit)
      if (nb > 0 && na <= nb) return { done: isSize ? `${a} ${unit}` : countText(na), total: `${isSize ? b : countText(nb)}${unit ? ` ${unit}` : ''}`, pct: percentOf(na, nb), rate: rateOf(rest), isOwn: true, words: ownWords(rest.slice(m[0].length)) }
    }
    // A count with no end known, as a wait counts its tries: progress: 7 tries waiting for the deploy
    const so = rest.match(/^(\d[\d,]*)\s+([a-z]{3,})\b/i)
    if (so && TIME_UNIT.test(so[2] ?? '')) return undefined
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
// A log's lines as its tab shows them: no colour codes, a line redrawn in place as it last stood, and without the engine's own
// last line or the blank lines before it
export const logLines = (text: string): string[] => {
  const lines = text
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
    .replace(/\x1b\][^\x07]*\x07/g, '')
    .replace(/\n?\[(?:exited with code [^\]\n]*|killed)\]\s*$/, '')
    .split('\n')
    .map(line => (line.split('\r').filter(part => part.trim()).at(-1) ?? '').replace(/\s+$/, ''))
  while (lines.length && !lines.at(-1)?.trim()) lines.pop()
  while (lines.length && !lines[0]?.trim()) lines.shift()
  return lines
}
// Why a command failed, from the end of its output: the last line that names an error, or else the last line it wrote, as it
// wrote it and cut short. Nothing for a line that names a password, key or login, or where it wrote nothing
const FAULT = /\b(?:error|errno|exception|traceback|fatal|failed|failure|cannot|can't|couldn't|could not|unable|denied|refused|not found|no such|missing|invalid|unexpected|timed? ?out|killed|out of memory|oom|panic|abort(?:ed)?|segmentation)\b/i
export const WHY_MOST = 120
export const whyOf = (text: string): string => {
  const lines = text
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
    .replace(/\[exited with code [^\]\n]*\]\s*$/, '')
    .split('\n')
    .map(line => (line.split('\r').map(part => part.trim()).filter(Boolean).at(-1) ?? '').replace(/\s+/g, ' '))
    .filter(line => /[A-Za-z]{3}/.test(line))
    .slice(-12)
  // (a traceback's own heading, or a line that only points at code, says nothing of why)
  const said = lines.filter(line => !/^Traceback \(most recent call last\)|^\s*at\s+\S+\s+\(|^File "|^\^+$/.test(line))
  const line = [...said].reverse().find(one => FAULT.test(one)) ?? said.at(-1) ?? ''
  if (!line || SECRETISH_WHY.test(line)) return ''
  return line.length > WHY_MOST ? `${line.slice(0, WHY_MOST - 1).replace(/\s+\S*$/, '')}…` : line
}
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

// An ended command's name: its own words whole, as its row had them while it ran, or what it ran in a few words where it gave
// none. One kept without its command has only `what`, its words or else the head of its shell line: words stay as they are, and
// only what reads as a shell line is named by what it runs (19 Nov: every kept name was read as a shell line, so "Testing the card
// tests" stood as "Testing the" and "Run the full check" as "Run the")
const SHELLISH = /&&|\|\||[;|$=<>`]|\s-{1,2}\w|(?:^|\s)(?:\.{0,2}|~)\/\S|^(?:cd|until|while|for|if|export|source|bash|sh|zsh|python3?|node|npm|npx|pnpm|git|curl|az|ssh)\s/
export const endedName = (what: string, cmd?: string) => {
  const words = describedOf(what).text
  if (cmd?.trim()) return labelOf(words, cmd) || 'A command'
  return (SHELLISH.test(words) ? commandName(words) : words) || words || 'A command'
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

// What a command waits for when its only job is to wait, whatever shape its loop takes: a helper, a time, the shell's own wait on
// a process, a tool made to wait, or a loop that sleeps between looks at how something stands (a command, a file, a line, a page).
// Undefined for a command that does work. Nothing a task or a helper starts may only wait: its own commands and helpers wake it as
// they end, and Claudopus wakes it for anything else (16 Nov: a helper polled for a file its own script was writing, "36 tries
// waiting for sheets", and a task held itself open on "Wait for the three builders" while its helpers worked, each shape let
// through by a check that knew only waits on a process)
export type WaitKind = 'helpers' | 'time' | 'process' | 'tool' | 'loop'
// What only looks at how something stands, counts or prints: a step made of these does no work
const LOOKS = /^(?:\S*\/)?(?:for|while|until|select|if|elif|then|else|fi|do|done|case|esac|break|continue|sleep|wait|kill\s+-(?:0|s\s+0)|pgrep|pidof|ps|lsof|seq|test|\[\[?|\]\]?|:|true|false|exit|return|date|tail|head|grep|egrep|fgrep|ugrep|rg|ls|cat|echo|printf|cut|wc|stat|du|df|sort|uniq|awk|sed(?!.*\s-i)|jq|cd|pwd|tr|find|file|nc|ping|host|dig|nvidia-smi|squeue|qstat|sacct|expr|bc|basename|dirname|realpath|readlink|let|read|local|export|set|shift|osascript\s+-e\s+""|(?:ba|z|da)?sh(?:\s+-\w+)*(?:\s+"")?|ssh\s(?:[^"]*\s)?"")(?:\s|$)|^curl\s(?![^]*?(?:\s-[a-zA-Z]*[oOTd]\b|\s-X\s*(?:POST|PUT|PATCH|DELETE)|--(?:output|upload-file|data\S*|form|remote-name)\b))|^[A-Za-z_]\w*=\S*$|^[A-Za-z_]\w*\s*(?:[-+*/%<>]=?|\+\+|--)\s*\w*$|^\d+$|^!$/
// Programs that only report how a job elsewhere stands (a run on GitHub, a cloud job, a container)
const STATUS = /^(?:\S*\/)?(?:gh\s+(?:run|pr|api|workflow)\s+(?:view|list|checks|status|get|\S+\/)|gh\s+api|az\s+.*\b(?:show|list|status)\b|aws\s+.*\b(?:describe|get|list)\b|gcloud\s+.*\b(?:describe|list)\b|kubectl\s+(?:get|describe|logs)|docker\s+(?:ps|inspect|logs)|git\s+(?:status|log|ls-remote|fetch|rev-parse))\b/
// Tools made to wait for something, as the program of a step
const WAITERS = /^(?:\S*\/)?(?:watch|inotifywait|fswatch|wait4path|wait-on)(?:\s+(?!-(?:-version|-help|h|v)\b)|$)|^(?:npx\s+(?:-y\s+)?)?wait-on\b|^(?:\S*\/)?gh\s+(?:run\s+watch|pr\s+checks\b.*--watch)|^(?:\S*\/)?(?:kubectl|docker)\s+wait\b|^(?:\S*\/)?kubectl\s+rollout\s+status\b|^(?:\S*\/)?(?:az|aws)\s+(?:\S+\s+)*wait\b|^(?:\S*\/)?caffeinate\s+(?:-\w+\s+)*-[wt]\b|^(?:\S*\/)?g?timeout\s+\S+\s+(?:\S*\/)?tail\s.*-[fF]|^(?:\S*\/)?less\s+\+F|^(?:\S*\/)?curl\s.*--retry-(?:all-errors|connrefused)|^(?:\S*\/)?wget\s.*(?:--retry-connrefused|--waitretry)/
// A log followed until one line comes, by any program that follows one: a wait for that line
const FOLLOW_UNTIL = /(?:\btail\b[^|;&]*\s(?:-\w*[fF]\w*|--follow\S*)|\b(?:docker|kubectl)\s+(?:\S+\s+)*logs\b[^|;&]*\s(?:-f|--follow)\b|\bjournalctl\b[^|;&]*\s(?:-f|--follow)\b)(?:[^;&|]|\d?>&\d?|&>)*\|\s*(?:(?:\S*\/)?(?:grep|egrep|ugrep|rg)\b[^|;&]*\s(?:-\w*[mq]|--max-count|--quiet)|(?:awk|gawk)\b[^|;&]*\bexit\b|sed\b[^|;&]*\bq\b|while\s+read\b[^]*\bbreak\b)/
// The code a command hands an interpreter: the shell's own line with every quoted word and here-document blanked, and each script
// it gives a shell, Python, Node, Perl or Ruby inline (-c, -e, a here-document, ssh's remote command, a script it writes and runs
// in the same command), so words quoted for show never count
const INTERPRETER = /(?:^|[\s;&|(])(?:\S*\/)?(?:(?:ba|z|da)?sh|python\d?(?:\.\d+)?|node|perl|ruby|ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+\S+)(?:\s+-\w+)*\s*$/
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const codesOf = (cmd: string, depth = 0): { shell: string; inline: string[] } => {
  const inline: string[] = []
  const written: { file: string; body: string }[] = []
  let shell = ''
  let i = 0
  while (i < cmd.length) {
    const c = cmd[i] ?? ''
    // A here-document: its body is code when what reads it is an interpreter, or a file the command then runs
    const here = c === '<' ? /^<<-?\s*(['"]?)(\w+)\1[^\n]*\n/.exec(cmd.slice(i)) : null
    if (here) {
      const end = cmd.indexOf(`\n${here[2]}`, i + here[0].length)
      const body = cmd.slice(i + here[0].length, end < 0 ? cmd.length : end)
      const line = (shell.slice(-300).split('\n').at(-1) ?? '') + (here[0].split('\n')[0] ?? '').replace(/^<<-?\s*(['"]?)\w+\1/, '')
      const into = /(?:\bcat|\btee(?:\s+-a)?)\s*(?:>>?\s*)?([^\s<>]+)\s*$|\bcat\s+>>?\s*([^\s<>]+)/.exec(line)
      if (INTERPRETER.test(line.replace(/\s+-\s*$/, '')) || /(?:python\d?(?:\.\d+)?|node|perl|ruby|(?:ba|z)?sh)(?:\s+-\w+)*\s+-\s*$/.test(line)) inline.push(body)
      else if (into) written.push({ file: (into[1] ?? into[2] ?? '').replace(/^["']|["']$/g, ''), body })
      shell += ' "" \n'
      i = end < 0 ? cmd.length : end + (here[2]?.length ?? 0) + 1
      continue
    }
    if (c === "'" || c === '"') {
      let j = i + 1
      while (j < cmd.length && cmd[j] !== c) j += cmd[j] === '\\' && c === '"' ? 2 : 1
      const body = cmd.slice(i + 1, j)
      // Code when it follows -c or -e of an interpreter (-lc, -xc alike), or is ssh's remote command
      const before = body.trim().length > 2 ? shell.slice(-300).replace(/\s+$/, '') : ''
      if (before && (/(?:^|[\s;&|(])eval$/.test(before) || /(?:^|[\s;&|(])(?:\S*\/)?(?:(?:ba|z|da)?sh|python\d?(?:\.\d+)?|node|perl|ruby|osascript)(?:\s+-\w+)*\s+-\w*[ce]$/.test(before) || /(?:^|[\s;&|(])ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+[^\s-]\S*$/.test(before))) inline.push(body)
      shell += '""'
      i = j + 1
      continue
    }
    shell += c
    i += 1
  }
  // A script it wrote here and runs here is read as it was written
  for (const one of written) if (one.file && new RegExp(`(?:^|[\\s;&|(])(?:(?:\\S*\\/)?(?:python\\d?(?:\\.\\d+)?|node|perl|ruby|(?:ba|z)?sh|\\.)\\s+)?${escaped(one.file)}(?:\\s|$)`).test(shell.replace(/(?:cat|tee)[^\n]*""/g, ''))) inline.push(one.body)
  // A shell inside a shell is read as one, once more
  const nested = depth < 3 ? inline.filter(code => !/\b(?:import|def|const|let|var|require|print|use|setTimeout|setInterval|delay|until\s+-e)\b|=>|\w\.\w+\(/.test(code)).map(code => codesOf(code, depth + 1)) : []
  return { shell: [shell, ...nested.map(one => one.shell)].join('\n'), inline: [...inline, ...nested.flatMap(one => one.inline)] }
}
// A time to sleep, in seconds, as a shell's sleep or read -t, or a script's sleep or timer writes it; one given by a variable or a
// sum counts as long
const sleepSeconds = (amount: string, unit = '') => (/^\d+(?:\.\d+)?(?:e\d+)?$/.test(amount) ? Number(amount) * ({ m: 60, h: 3600, d: 86400 }[unit] ?? 1) : Infinity)
const LONGEST_SLEEP = 5
const SLEEPS = /(?:^|[\s;&|({])(?:(?:env|command|exec|nice|xargs(?:\s+-\S+)*)\s+)?(?:\S*\/)?(?:g?sleep|read\s+(?:-\w+\s+)*-t|delay)\s+(\$\(\([^)]*\)\)|\$\{?\w+\}?|""|\d+(?:\.\d+)?(?:e\d+)?|infinity)([smhd]?)(?=\s|$|[;&|)}])|(?:^|[\s;&|(])xargs(?:\s+-\S+)*\s+(?:\S*\/)?g?sleep\b()/g
// Each step of a shell line: what its loop or test words lead and what runs inside $( ) or ` `, each its own step
const shellSteps = (shell: string) =>
  shell
    .split(/\s*(?:;|&&?|\|\|?|\n|\$\(\(?|\)\)?|`|(?<=^|\s)[{}](?=\s|$))\s*/)
    .map(step => step.trim().replace(/^\(+\s*/, '').replace(/^(?:(?:do|then|else|elif|if|while|until|repeat\s+\S+|!|time|nohup|env|command|exec|nice(?:\s+-n\s+\S+)?|caffeinate(?:\s+-\w+)*|g?timeout\s+\S+)\s+)+/, '').replace(/\s*\d?>+&?\s*\S+/g, '').replace(/\s*<\s*\S+/g, '').trim())
    .filter(step => step && !/^(?:do|then|else|done|fi|esac|\(|\)|\{|\}|repeat\s+\S+)$/.test(step) && !/^(?:function\s+)?\w+\s*\(\)?$/.test(step))
// A script that loops on a sleep until something is there or so: a file, a process, a page's answer, a line in a file
const POLLS_FOR = /\b(?:exists|isfile|is_file|existsSync|accessSync|pid_exists|status_code|getcode|File\.exist)\b|\bpoll\(\)|os\.kill\([^)]*,\s*0\)|\bin\s+open\(|\.read\(\)\.(?:count|find)\(|\s-e\s+["'$\/]/
export type WaitOptions = { isWatch?: boolean }
export const waitingOf = (cmd: string, scripts: string[] = [], options: WaitOptions = {}): WaitKind | undefined => {
  // The wait the old rules gave for helpers, as the program run
  if (/^\s*['"]?[^'"\s]*\/bin\/helpers['"]?(?:\s|$)/.test(cmd)) return 'helpers'
  // (a very long command is read only so far, so no command can hold the mod up)
  const { shell, inline } = codesOf(cmd.slice(0, 10_000))
  const steps = shellSteps(shell)
  if (steps.some(step => WAITERS.test(step))) return 'tool'
  // A log followed and nothing else, under a time limit, only passes that time
  if (steps.length === 1 && /^(?:\S*\/)?g?timeout\s/.test(shell.trim()) && /^(?:\S*\/)?tail\b.*\s-\w*[fF]/.test(steps[0] ?? '')) return 'tool'
  if ((FOLLOW_UNTIL.test(shell) || FOLLOW_UNTIL.test(cmd.slice(0, 10_000))) && !/(?:^|[\s;&|(])g?timeout\s+(?:[1-9]|10)s?\s/.test(shell)) return 'tool'
  // The shell's own wait on something started before this command
  if (steps.some(step => /^wait\s+(?:-n\s+)?(?:\d+|\$[\w{!]+|%\S*)/.test(step)) && !/(?<![>&])&(?![>&])/.test(shell.split(/(?:^|[\s;&|(])wait\s/)[0] ?? '')) return 'process'
  // A script inline, or a short one of its own the command runs, that loops on a sleep until something is there or so
  const isWaitScript = (code: string) =>
    /\b(?:time\.sleep|asyncio\.sleep|sleep)\b|setTimeout\(|setInterval\(/.test(code) &&
    /\b(?:while|until)\b|\bfor\b[^]*\b(?:break|return|exit)\b|setInterval\(|\biter\(lambda/.test(code) &&
    POLLS_FOR.test(code) &&
    !/\bopen\([^)]*['"][wa]b?['"]|\.write(?:_text|_bytes)?\(|\bsave(?:fig)?\(|\bsubprocess\b|\bos\.system\(|\brequests\.(?:post|put|delete)\(|\bwriteFile|\bspawn\(|\bexec(?:Sync)?\(|\bshutil\.|\bupload/.test(code)
  const sleepsIn = (text: string) => [...text.matchAll(SLEEPS)].map(m => sleepSeconds(m[1] ?? 'unknown', m[2]))
  const sleeps = sleepsIn(shell)
  // A script inline that only imports, sleeps, prints or looks counts as looking; so does a call of a function defined here
  const isTrivial = (code: string) =>
    code
      .replace(/(["'])(?:(?!\1)[^\\\n]|\\.)*\1/g, '""')
      .split(/[\n;]+/)
      .every(part => /^\s*(?:$|#|import\b|from\s+\S+\s+import\b|(?:time\.|asyncio\.)?sleep\b|await\b|asyncio\.run\b|print\b|pass\b|console\.log\b|setTimeout\b|\[?\s*time\.sleep\b|delay\b)/.test(part) || POLLS_FOR.test(part))
  const isInlineLook = (step: string) => /^(?:\S*\/)?(?:(?:uv|poetry)\s+run\s+)?(?:python\d?(?:\.\d+)?|node|perl|ruby|osascript)(?:\s+-\w+)*\s+(?:-\w*[ce]\s+""|-|"")$/.test(step) && inline.every(code => isTrivial(code) || isWaitScript(code))
  const functions = [...shell.matchAll(/(?:^|[\s;&|])(?:function\s+)?(\w+)\s*\(\)\s*\{/g)].map(m => m[1] ?? '')
  const isLook = (step: string): boolean => isInlineLook(step) || ((rest => rest !== undefined && isLook(rest))(/^(?:\S*\/)?ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+[^\s-]\S*\s+(\S.*)$/.exec(step)?.[1])) || functions.includes(step.split(/\s+/)[0] ?? '') || /^[\d\s*+\-/%()]+$/.test(step) || /^eval\s+""$/.test(step) || /^xargs\s+(?:-\S+\s+)*(?:\S*\/)?g?sleep\b/.test(step) || /^(?:tee|exec)(?:\s|$)/.test(step) || LOOKS.test(step) || STATUS.test(step) || WAITERS.test(step) || /^(?:\S*\/)?(?:caffeinate|delay|osascript\s+-e\s+"")(?:\s|$)/.test(step)
  const isOnlyLooks = steps.every(isLook)
  // A loop that sleeps between its tries and ends when what it looks for is so (a while or until, a for that breaks or exits, zsh's
  // repeat), its every step only looking: what it waits for is a command, a file, a line or a page. A loop that never ends is a
  // watch, let through only as a Monitor watch, whose every line it is told
  const isPolling = (text: string) => /\b(?:while|until)\b/.test(text) || (/\b(?:for|repeat)\b/.test(text) && /\b(?:break|exit|return)\b/.test(text))
  const isForever = /\bwhile\s+(?:true|:|\[\s*1\s*\])\s*;?\s*(?:do\b|\{)/.test(shell) && !/\b(?:break|exit|return)\b/.test(shell)
  const isShellLoop = /(?:^|[\s;&|(])(?:while|until|for|repeat)\s[^]*?(?:\bdo\b|\{)/.test(shell)
  if (isShellLoop && !(isForever && options.isWatch)) {
    // (a loop that only looks and has nothing to do between its looks spins: a wait all the same)
    const isSpin = !sleeps.length && /\bdo\s*(?::|true)?\s*;?\s*done\b/.test(shell)
    if ((sleeps.length || isSpin) && isOnlyLooks && (isPolling(shell) || sleeps.reduce((a, b) => a + b, 0) > LONGEST_SLEEP || /\bfor\s+\w+\s+in\s+(?:\$\(seq|\{\d+\.\.\d+\})/.test(shell))) return 'loop'
  }
  // A time: sleeps longer than a few seconds in all, outside a loop, in a command that does nothing but look (a sleep inside real
  // work, as a server comes up or a recording runs its length, is that work's own)
  const loopless = (text: string) => text.replace(/\bdo\b[^]*\bdone\b/g, ' ')
  const codeSleeps = inline
    .filter(code => !/^\s*(?:while|for)\b|;\s*(?:while|for)\b/m.test(code))
    .flatMap(code => [...code.replace(/(["'])(?:(?!\1)[^\\\n]|\\.)*\1/g, '""').matchAll(/\b(?:time\.)?sleep\(?\s*(\d+(?:\.\d+)?)\s*\)?|\bdelay\s+(\d+(?:\.\d+)?)|setTimeout\([^]{0,200}?,\s*(\d+)\s*\)/g)].map(m => (m[1] ? Number(m[1]) : m[2] ? Number(m[2]) : Number(m[3] ?? 0) / 1000)))
  if (isOnlyLooks && [...sleepsIn(loopless(shell)), ...codeSleeps].reduce((a, b) => a + b, 0) > LONGEST_SLEEP) return 'time'
  if (inline.some(isWaitScript)) return 'loop'
  if (scripts.some(text => text.split('\n').filter(line => line.trim() && !/^\s*#/.test(line)).length <= 30 && (isWaitScript(text) || waitingOf(text.replace(/^#![^\n]*\n/, '')) === 'loop'))) return 'loop'
  return undefined
}

// A command made only of what reads and sifts another's output (tail, grep and their kind): left going, it only watches a run and
// ends with nothing. `isFollow` when it follows a file as it grows, so it never ends of itself (16 Nov: pairs of "tail pic_eyes.log"
// and "ugrep wrote" stood silent for an hour and a half under a card and two finished helpers, long after what they watched)
const FILTER = /^(?:\S*\/)?(?:tail|grep|egrep|fgrep|ugrep|rg|awk|sed|cut|tr|head|cat|uniq)\b/
export const watcherOf = (cmd: string): { isFollow: boolean } | undefined => {
  if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(cmd)) return undefined
  const text = unquoted(cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&]+)\s*(?:&&|;)\s*/, ''))
  // (one that writes a file makes something)
  if (/(?:^|[^>&0-9])>>?\s*(?!\/dev\/null\b|&)\S/.test(text)) return undefined
  const steps = text
    .split(/\s*(?:\|\|?|;|&&?)\s*/)
    .map(step => step.trim().replace(/\s*\d?>+\s*\S+/g, '').replace(/^(?:(?:nohup|setsid|stdbuf\s+-oL)\s+)+/, ''))
    .filter(Boolean)
  if (!steps.length || !steps.every(step => FILTER.test(step) && !/\bsed\b.*\s-i\b/.test(step))) return undefined
  const isFollow = (step: string) => /^(?:\S*\/)?tail\b.*\s(?:-\w*[fF]\w*|--follow\S*)(?:\s|$)/.test(step)
  // It watches only when it follows a file as it grows, or is a lone grep that sifts what is piped to it: its pattern and nothing
  // more, with only options that change how it matches or prints (a search of a folder, of files or by a file of patterns is work)
  const first = steps[0] ?? ''
  if (isFollow(first)) return { isFollow: true }
  const words = first.split(/\s+/).slice(1)
  const isLoneGrep = steps.length === 1 && /^(?:\S*\/)?u?grep$|^(?:\S*\/)?[ef]grep$/.test(first.split(/\s+/)[0] ?? '') && words.every(word => !word.startsWith('-') || /^-(?:-line-buffered|-color(?:=\w+)?|[EFiovwxH]+)$/.test(word)) && words.filter(word => !word.startsWith('-')).length === 1
  return isLoneGrep ? { isFollow: false } : undefined
}

// Jobs alike (the same kind, words and command) are one row that says how many they are, from the first one's start; the newest
// one's output stands for them
export const foldJobs = (jobs: Job[]): Job[] => {
  const keyOf = (job: Job) => `${job.kind}|${job.label}|${job.cmd}`
  const groups = new Map<string, Job[]>()
  for (const job of jobs) groups.set(keyOf(job), [...(groups.get(keyOf(job)) ?? []), job])
  return [...groups.values()].map(group => {
    const newest = group.reduce((a, b) => (b.at >= a.at ? b : a))
    if (group.length === 1) return newest
    const wrote = group.flatMap(job => (job.wroteAt ? [job.wroteAt] : []))
    return { ...newest, at: Math.min(...group.map(job => job.at)), count: group.length, ...(wrote.length ? { wroteAt: Math.max(...wrote) } : {}) }
  })
}
