// Made by src/claudopus/build.mjs from the parts in src/claudopus/tests: change them there and build again, never this file. Its tests run with the engine's plugin test.
import { expect, mock, test as kitTest } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { On } from 'claude-code'
import { headLine, headMood, OFF_LOOK, offOf, openTake, opensOf, shareable, stuckOf, trip } from '../shared'
import { timelineRows } from '../stats'

// The world beneath the mod in every test: files in memory, the app's session tools, a cheap model; and small helpers

const HOME = '/home/sam'
// The same person's profile on a Windows PC, and Git for Windows' bash there
const WINDOWS_HOME = 'C:\\Users\\sam'
const GIT_BASH = 'C:/Program Files/Git/bin/bash.exe'
// The mod's own folder on this machine: each area's tests are built into mods/claudopus/hooks/tests/
const PLUGIN = new URL('../..', (import.meta as unknown as { url: string }).url).pathname.replace(/\/$/, '')
// Every test may take three minutes, not the kit's 5 seconds: the areas' files run side by side, and on a busy machine or GitHub's
// runner (two to three times as slow as a Mac) the longest scenarios passed or failed by the machine's load, not by the mod. Those
// that run the clock through hours fire the mod's timers each second of it, as in a chat: 10 to 20 seconds alone on a Mac, 30 to 60
// on GitHub's, where a minute's limit failed them, and a test that ran out took its whole file's results with it ("the file did
// not load"). SLOW is that limit, kept for the tests that name it
const SLOW = { timeoutMs: 180_000 }
// The test now running, for the world's clock (below): the tests of a file run one after another
let driver: Parameters<TestBody>[0] | undefined
function test(name: string, body: TestBody): void
function test(name: string, options: { timeoutMs?: number }, body: TestBody): void
function test(name: string, options: TestBody | { timeoutMs?: number }, body?: TestBody) {
  const run = (typeof options === 'function' ? options : body) as TestBody
  const kept: TestBody = ($, on) => ((driver = $), run($, on))
  if (typeof options === 'function') kitTest(name, SLOW, kept)
  else kitTest(name, { ...SLOW, ...options }, kept)
}
const MEMORY = `${HOME}/.claude/claudopus`
// This Mac's keychain, there unless a test takes it away as a home of a trial chat's own has none
const KEYCHAIN = `${HOME}/Library/Keychains/login.keychain-db`
const composer = { kind: 'composer' } as const
const start = { cwd: '/repo', surface: 'desktop', isInteractive: true } as const
const PANE = {
  plugin: 'claudopus',
  component: 'Pane',
  requestId: 'servers',
  props: { title: 'Servers', isFocused: false, bodyColumns: 40, placement: 'dock', scroll: { offset: 0, bodyRows: 20 }, view: {} },
} as const
const BAND = {
  plugin: 'claudopus',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const
const LIST = {
  plugin: 'claudopus',
  component: 'Pane',
  requestId: 'claudopus',
  props: { title: 'Claudopus', isFocused: false, bodyColumns: 40, placement: 'dock', scroll: { offset: 0, bodyRows: 20 }, view: {} },
} as const
// The most the engine's fs.read gives whole
const FS_READ_MOST = 4_194_304
declare const setTimeout: (run: () => void, ms: number) => unknown
// The principles and working rules the mod ships
const PRINCIPLES = '# How I work with Claude\n\n## Principles\n\n1. My words are the spec.\n'
// The principles exactly as the mod ships them: the build puts the file's text in place of this line's string
const SHIPPED_PRINCIPLES: string = "# How I work with Claude\n\nThese are my principles. Every chat and every task follows them.\n\n## Core truths\n\n- My words are the spec. They beat Claude's earlier suggestions.\n- Solutions, not questions. Ask only when it needs my hands or can't be undone: one recommendation, yes or no.\n- Build what I asked for and what it plainly needs to work where I will use it, and name everything that was built.\n- Show me the result. My yes or no is the gate, not the agent's verdict.\n\n## Boundaries\n\n- A new message adds to the current task. It switches to a new task only if I say so.\n- If the work doesn't depend on it right now, drop it.\n- A repo's own files and notes win over these principles for that repo.\n\n## Vibe\n\n- Short replies and short rules. Say it once, in general terms, without examples.\n\n## Checking\n\n- Build it once and tell me where to look. No second agent and no rounds of pictures unless I ask.\n- A report is text I can read in the chat. A picture is for what I must see, never for a page of text.\n- After two or three failed fixes, question the approach.\n- A surprising number means checking our own code first.\n\n## Continuity\n\n- Context lives in files. Chats are disposable and stay small.\n- Read files in one batch. Send big searches and outputs to helpers.\n- Each session ends with what shipped and what's left.\n"
// The prompt each piece of work started with, as the mod left it
const prompts: string[] = []

// A release on GitHub as the test world gives it: its version, commit and the tree it published; `got` a different tree that came
// down instead, `manifest` a different version in it, `online` a newer commit online, and a fetch that fails, a folder with commits of its
// own, or uncommitted changes the move would overwrite; a checkout on no branch, at a commit its online main holds (`detached`) or
// one it doesn't (`noBranch`, a test copy); with a bisect or rebase under way, a main with commits online main lacks, or a main past
// the release
type Release = { version: string; commit: string; tree: string; got?: string; manifest?: string; online?: string; fetchFails?: boolean; ownCommits?: boolean; overwrite?: boolean; worktree?: boolean; noBranch?: boolean; detached?: boolean; midWay?: boolean; mainAhead?: boolean; mainPast?: boolean }
// The world beneath the mod: files in memory, the app's session tools, a cheap model
const world = (on: On, options: { windows?: boolean; tailscale?: string; reply?: string; complete?: (e: { model: string; system?: string; prompt: string }) => string | null | undefined; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unseen?: string[]; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; shells?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean; live?: (file: string) => number | undefined; owner?: (pid: string) => 'mine' | 'other' | 'hidden' }; usage?: (script: string) => string; pace?: (argv: string[]) => string; startedOn?: Record<string, string>; release?: Release; stream?: (e: { agentId?: string }) => AsyncGenerator<unknown, void> } = {}) => {
  const files = new Map<string, string>()
  files.set(KEYCHAIN, '')
  // Someone already set up has an index.md; a new person has no memory folder at all
  if (!options.isNew) files.set(`${MEMORY}/index.md`, '# Streams\n\nname | repo | session | state | summary\n\n')
  const titles: string[] = []
  // Each request to a model, as asked
  const completed: { model: string; system?: string; prompt: string }[] = []
  const compacts: (string | undefined)[] = []
  const opened: string[] = []
  // Folders listed and panes opened, in the order they happened
  const events: string[] = []
  // Each pane opened, with its tab's title
  const tabs: string[] = []
  const stopped: string[] = []
  const killed: string[] = []
  const gitRan: string[] = []
  const closed: string[] = []
  const logged: string[] = []
  const copied: string[] = []
  // The terminal tabs opened beside the chat, by what they were opened with
  const terminals: unknown[] = []
  // What the app's view tool was asked to show beside the chat; it refuses where the test lays ccd_view:refused
  const viewed: unknown[] = []
  // What was sent on to an agent, what the mod wrote into an agent's chat, and what it submitted to this one
  const sent: string[] = []
  const appended: string[] = []
  const submitted: string[] = []
  // (and what each of those carried for the chat's model to read with it)
  const submittedContext: string[] = []
  // What the mod sent to an agent with $.session.send, which starts again one that has ended, as "<agent>: <text>"
  const resumed: string[] = []
  const pressRuns: string[][] = []
  // How many lines the mod had written into chats as each SubagentHandback reached the engine
  const atHandback: number[] = []
  const resumedAtHandback: number[] = []
  // The model each step of a piece of work was sent to
  const stepped: string[] = []
  // The model each Agent call reached the engine with, and each spawn was asked to start on (none: left to the agent's kind or parent)
  const agentModels: (string | undefined)[] = []
  const asked: (string | undefined)[] = []
  // and the kind of agent each spawn was asked to start as
  const types: (string | undefined)[] = []
  const registered: string[] = []
  // and the tools each kind is given, by its name
  const kindTools: Record<string, string[]> = {}
  const played: string[] = []
  const notified: string[] = []
  // What was handed to osascript
  const osa: string[][] = []
  const keychain: string[] = []
  // What was handed to Claudopus.app, the mod's own notifier
  const own: string[][] = []
  // What was handed to open: a folder shown in Finder
  const shown: string[][] = []
  // What was handed to Tailscale to send to another device
  const dropped: string[][] = []
  // What was run over ssh, with what it was handed
  const sshed: string[][] = []
  // Each call of the leaderboard's functions, by name, with what it was sent
  const boarded: { fn: string; body: Record<string, unknown> }[] = []
  prompts.length = 0
  let spawned = 0
  let gateKeys = 0
  const sleepers: (() => void)[] = []
  // Whether each agent started ran in the background, as the engine was asked
  const backgrounds: boolean[] = []
  const wake = () => void sleepers.splice(0).forEach(one => one())
  // What each Bash call that ran the admin runner found waiting for it: the grants, as bin/admin would read them
  const admins: { command: string; grants: { host: string; command: string; seal: string; at: number; id: string }[] }[] = []
  // The kit's clock moves only as a test moves it: the mod's look at how late its timer comes is left out, unless a test asks for it
  // `windows`: a Windows PC, as the Claude app runs the engine there: no HOME, the person's profile, and Git for Windows' bash where
  // Claude Code finds it. Each command the mod runs is kept as it was sent (`windowsRuns`) and answered as the command it carries
  if (options.windows) files.set(GIT_BASH, '')
  mock.env(on, { ...(options.windows ? { OS: 'Windows_NT', USERPROFILE: WINDOWS_HOME, HOME: '', SHELL: GIT_BASH.replace(/\//g, '\\') } : { HOME }), CLAUDOPUS_TIMING: 'test', ...options.env })
  const kitClock = mock.clock(on, { now: 1_700_000_000_000 })
  // A hook of the mod follows each move of the clock, as in the app, where a drawing or a step of some task is never far: what the
  // mod's timers leave for a hook to send (sendHeld) goes then. A test that names `unseen` moves the clock bare, and brings the
  // hook itself, and every agent a message started while its clock moved is listed in `unseen`
  let moving = 0
  const bare = async (ms: number) => {
    moving += 1
    try {
      return await kitClock.advance(ms)
    } finally {
      moving -= 1
    }
  }
  const clock: typeof kitClock = options.unseen
    ? { ...kitClock, advance: bare as never }
    : {
        ...kitClock,
        // (in moves of half a minute at most, each followed by its hook: a long move with none would be a chat where nothing ran)
        advance: (async (ms: number) => {
          for (let left = ms; left > 0; left -= 30_000) {
            await kitClock.advance(Math.min(left, 30_000))
            await driver?.session.measure({ context: {}, rateLimits: [], changed: [] } as never).catch(() => undefined)
          }
        }) as never,
      }
  // What the engine draws where the mod draws nothing
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>the engine's own</Text>
  })
  // On a Windows PC a path from a drive (C:/Users/sam/...) is whole; the kit on a Mac or Linux takes it as under the folder it runs in
  const inProfile = <T extends { path: string }>(e: T): T => (options.windows ? { ...e, path: e.path.replace(/^.*?\/(?=[A-Za-z]:\/)/, '') } : e)
  on('fs.read', (_, raw) => {
    const e = inProfile(raw)
    // A picture's bytes, as base64, where the test gives them
    const bytes = options.bytes?.(e.path)
    if (bytes !== undefined) return { value: { base64: bytes } as never }
    // The octopus drawings, each an SVG naming its file, when a test asks for them
    const drawing = options.art ? /\/art\/([\w-]+)\.svg$/.exec(e.path)?.[1] : undefined
    if (drawing) return { value: `<svg xmlns="http://www.w3.org/2000/svg"><title>${drawing}</title></svg>` }
    // Or drawn as the mod's own are, where the test gives them
    const drawn = options.drawings?.(/\/art\/([\w-]+)\.svg$/.exec(e.path)?.[1] ?? '')
    if (drawn !== undefined) return { value: drawn }
    // The texts the mod ships; a copy of one in the memory folder is the person's own, kept in files
    const isShipped = !e.path.startsWith(MEMORY)
    if (isShipped && e.path.endsWith('roles/chat.md')) return { value: options.chatRole ?? 'CHAT ROLE' }
    if (isShipped && e.path.endsWith('roles/work.md')) return { value: 'WORK ROLE; an admin command runs through `{admin}`; a key runs as `{secret} NAME`; main is reached through `{release}`; a file goes into a page through `{pane-file}`' }
    if (isShipped && e.path.endsWith('rules/CLAUDE.md')) return { value: options.shipped ? SHIPPED_PRINCIPLES : PRINCIPLES }
    if (isShipped && options.changelog !== undefined && e.path.endsWith('/CHANGELOG.md')) return { value: options.changelog }
    // A release on GitHub, where the test gives one: the mod's folder is a main checkout, whose version a reload loads
    if (options.release && e.path.endsWith('/.git/HEAD')) return { value: 'ref: refs/heads/main\n' }
    if (e.path.endsWith('.claude-plugin/plugin.json')) return { value: files.get('manifest') ?? '{ "name": "claudopus", "version": "0.1.0" }' }
    const text = files.get(e.path)
    if (text === undefined) throw new Error(`ENOENT ${e.path}`)
    // As the engine: no file over 4 MB is given whole
    if (text.length > FS_READ_MOST) throw new Error(`${e.path} refused: the file is over the ${FS_READ_MOST}-byte limit`)
    return { value: text }
  })
  on('fs.write', (_, raw) => {
    const e = inProfile(raw)
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('fs.exists', (_, e) => ({ value: files.has(inProfile(e).path) }))
  // What a folder holds: its files, and the folders its deeper files are in
  on('fs.list', (_, raw) => { const e = inProfile(raw); return (events.push(`list ${e.path}`), {
    value: [...new Set([...files.keys()].filter(path => path.startsWith(`${e.path}/`)).map(path => path.slice(e.path.length + 1)))]
      // A file's time is 0 unless the test lays it as mtime:<path>
      .map(rest => ({ name: rest.split('/')[0] ?? rest, kind: rest.includes('/') ? 'dir' : 'file', size: 1, mtimeMs: Number(files.get(`mtime:${e.path}/${rest}`) ?? 0), isLink: false }))
      .filter((one, i, all) => all.findIndex(other => other.name === one.name) === i) as never,
  }) })
  on('fs.stat', (_, raw) => {
    const e = inProfile(raw)
    const kind = files.has(e.path) ? 'file' : [...files.keys()].some(path => path.startsWith(`${e.path}/`)) ? 'dir' : ''
    if (!kind) throw new Error(`ENOENT ${e.path}`)
    return { value: { kind, size: 1, mtimeMs: Number(files.get(`mtime:${e.path}`) ?? 0), isLink: false } as never }
  })
  on('mcp.call', (_, e) => {
    if (e.server === 'terminal') terminals.push(e.args)
    if (e.server === 'ccd_view') {
      viewed.push(e.args)
      if (files.has('ccd_view:refused')) return { value: { content: [{ type: 'text', text: files.get('ccd_view:refused') ?? '' }], isError: true } }
    }
    if (e.tool === 'set_session_title') titles.push(String(e.args.title))
    const text = e.tool === 'get_session' ? JSON.stringify({ sessionId: 'local_1', title: 'Old title' }) : '[]'
    return { value: { content: [{ type: 'text', text }], isError: false } }
  })
  // (another chat, where the test lays session:id)
  on('session.id', () => ({ value: files.get('session:id') ?? 'engine-id' }))
  // The mod's pause in a long step (breathe): answered after the test's own timers have had their turn, as the engine answers from
  // outside the helper
  on('session.turns', async () => (await new Promise(done => setTimeout(() => done(undefined), 0)), { value: 1 }))
  // A chat drawn on the desktop app, as most are; `headless` none, as a -p run
  // `narrow`: a terminal under 144 columns, as a phone over ssh, which draws only a tab opened as the person asked: here, one opened
  // while the test's press is still being answered (isPressing). The engine counts only what the press's own hook opens, which the kit
  // cannot tell from what a button's closure opens in that time; tabmoves.test.tsx holds the hand-over to the hook itself
  on('session.surfaces', () => ({ value: options.headless ? [] : options.narrow ? ['terminal'] : ['desktop'] }) as never)
  on('session.version', () => ({ value: { version: '2.1.321', base: '2.1.321' } }))
  // The chat of a piece of work as the engine keeps it, or its refusal to read one
  // A promise given as the chat is one the app is slow to give
  on('session.messages', async () => ({ value: (await (options.talk ?? [])) as never }))
  on('session.measure', (_, e) => ({ changed: e.changed }))
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens: options.tokens ?? 1000, window: 500_000 }, rateLimits: [] } }))
  // `complete`: the model's answer to each request, by what it was asked (a small model naming commands), or none
  on('model.complete', (_, e) => {
    completed.push(e as never)
    const own = options.complete?.(e as never)
    if (own !== undefined) return own === null ? { value: { isAnswered: false, reason: 'api-error', status: 529, error: 'overloaded', usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } } as never : { value: { isAnswered: true, text: own, usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } }
    return {
    value: {
      isAnswered: true,
      text: options.reply ?? 'title: Old title',
      usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    },
  }
  })
  // One response of a model: its text, then what the API says it was answered over
  on('turn.step', async function* (_, e) {
    stepped.push(e.model)
    // `stream`: the pieces of a response as a test hands them out, one at a time
    if (options.stream) for await (const chunk of options.stream(e)) yield chunk as never
    else yield { kind: 'text', index: 0, text: 'Looking at the nose.' } as never
    return {
      turnId: e.turnId,
      index: e.index,
      answer: '',
      toolUses: [],
      stopReason: 'tool_use',
      usage: { model: options.answered?.by ?? e.model, input_tokens: 5000, output_tokens: 10, cache_read_input_tokens: 290_000, cache_creation_input_tokens: 10_000 },
    } as never
  })
  on('ui.log', (_, e) => {
    logged.push(e.text)
    return { value: undefined }
  })
  // `live`: panes as a surface keeps them, opened and closed as asked; a surface that never says one is shown (a chat the app runs on
  // another Mac over ssh) is told by isShown false on every open
  on('ui.panes', () => ({ value: options.live ? options.live.map(one => ({ id: one.id, title: one.id, isShown: one.isShown, isFocused: Boolean(one.isFocused), isPlaced: one.isPlaced })) : (options.panes ?? []).map(id => ({ id, title: id, isShown: true, isFocused: false, isPlaced: true })) }))
  on('ui.close', (_, e) => {
    closed.push(e.id)
    if (options.live) options.live.splice(0, options.live.length, ...options.live.filter(one => one.id !== e.id))
    return { value: undefined }
  })
  // What the Mac answers: a dev server on 3100 started by a chat, and the system's own listener, which is not the person's
  const windowsRuns: string[][] = []
  on('process.run', (_, e) => {
    if (options.windows) windowsRuns.push([...e.argv])
    const [tool, ...rest] = options.windows && e.argv[0] === GIT_BASH && e.argv[1] === '-c' && e.argv[2] === 'exec "$0" "$@"' ? e.argv.slice(3) : e.argv
    const ok = (stdout = '', exitCode = 0) => ({ value: { exitCode, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
    // The admin gate's wait between two looks at what was pressed: it lasts until the test lets it go with wake(), as a second passing
    // The end or the first line of a file, as tail and head give them
    if (tool === 'tail' && rest[0] === '-c') return files.has(String(rest[2])) ? ok((files.get(String(rest[2])) ?? '').slice(-Number(rest[1]))) : ok('', 1)
    if (tool === 'head' && rest[0] === '-n') return files.has(String(rest[2])) ? ok((files.get(String(rest[2])) ?? '').split('\n').slice(0, Number(rest[1])).join('\n') + '\n') : ok('', 1)
    // The chat's own process, as the shell the mod starts names its parent
    if (tool === '/bin/sh' && rest[1] === 'echo $PPID') return ok('4242\n')
    // A lock of the mod's, a folder only one chat makes (takeLock): held while its time is in it
    if (tool === '/bin/sh' && String(rest[1]).startsWith('mkdir -p "$(dirname "$1")" && mkdir "$1"')) return files.has(`${rest[3]}/at`) ? ok('', 1) : (files.set(`${rest[3]}/at`, String(rest[4])), ok())
    if (tool === '/bin/sleep') return new Promise(done => sleepers.push(() => done(ok()))) as never
    // bin/run-it, as a command Claude Code refused is run on the person's press: started detached, it prints its process group's
    // number; it runs until the test lays run:gone; stopped, it is gone and its output says so
    if (tool?.endsWith('/bin/run-it') && rest[0] === 'start') return (pressRuns.push([...e.argv]), ok('51234\n'))
    if (tool?.endsWith('/bin/run-it') && rest[0] === 'alive') return ok('', files.has('run:gone') ? 1 : 0)
    if (tool?.endsWith('/bin/run-it') && rest[0] === 'stop') return (pressRuns.push([...e.argv]), files.set('run:gone', ''), files.set(String(rest[2]), `${files.get(String(rest[2])) ?? ''}claudopus-exit 143 stopped\n`), ok())
    // Every admin password an earlier version kept, taken out of the keychain as the mod loads
    if (tool === '/bin/sh' && String(rest[1]).includes('delete-generic-password -s claudopus-admin')) return (files.set('keychain:admin-forgotten', 'yes'), ok())
    // What a password box sends, sealed by openssl to the key of the runner that asked: the test's own stand-in for it
    if (tool === '/bin/bash' && String(rest[1]).includes('pkeyutl -encrypt')) return ok(`${boxSealed(String(rest[3]), String(e.init?.stdin ?? ''))}\n`)
    // The admin gate's seals: one for each message, under the key the keychain holds as keychain:gate; "make" makes a key where
    // there is none and "new" always, as the Mac's own shell does
    if (tool === '/bin/sh' && String(rest[1]).includes('claudopus-admin-gate')) {
      // Where the home holds no keychain, macOS asks on the person's screen for one to keep the key in
      if (!files.has(KEYCHAIN)) files.set('keychain:dialog', 'the gate')
      const [, , , said, ...messages] = rest
      // The kept copy of the settings and texts has its key apart, as keychain:known
      const item = String(said).startsWith('known-') ? 'keychain:known' : 'keychain:gate'
      // A keychain that does not answer (locked over ssh, or refusing)
      if (files.has('keychain:refused')) return ok('', 1)
      const mode = String(said).replace(/^known-/, '')
      if (mode === 'new' || (mode === 'make' && !files.has(item))) files.set(item, `key-${(gateKeys += 1)}`)
      const key = files.get(item)
      if (mode === 'has') return ok('', key ? 0 : 3)
      return key ? ok(messages.map(one => `${fakeSeal(key, String(one))}\n`).join('')) : ok('', 3)
    }
    // A line added to the end of a file, as the log is written
    if (tool === 'sh' && rest[1] === 'printf %s "$2" >> "$1"' && rest[3] !== undefined) {
      files.set(rest[3], `${files.get(rest[3]) ?? ''}${rest[4] ?? ''}`)
      return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    // How the computer is used, as the line above the prompt looks at it: what the test gives, else nothing to read
    if (tool === 'sh' && String(rest[1]).startsWith('echo "@@SELF@@')) return ok(options.usage?.(String(rest[1])) ?? '')
    // Claude's commands taking their turn on the processor: the processes, their threads and the background mode, as the test gives them
    if (tool === 'sh' && /^echo "@@PACE@@|^for p in \$1; do taskpolicy/.test(String(rest[1]))) return ok(options.pace?.(rest.map(String)) ?? '')
    // The jobs' outputs as the panel reads them in one go, where the test gives them: each output it asks for ends in what the test
    // says, last written when it says, and every detached process it names still runs
    // (and, where the test gives them, the processes and the file each held-open command's shell writes to)
    // (as the mod asks now: every word after the script's name is an output, with no count before them, and nothing follows the last)
    // (a log's end, as its tab reads it; and how much of the processor the programs that hold each silent log open use)
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('# the log tab')) return ok(options.jobs.output(String(rest[3])))
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('@@LIVE@@'))
      return ok(rest.slice(3).flatMap(file => { const use = options.jobs?.live?.(String(file)); return use === undefined ? [] : [`@@LIVE@@ ${use} ${String(file)}`] }).join('\n'))
    if (options.jobs && tool === 'sh' && String(rest[1]).startsWith('for f; do ') && String(rest[1]).includes('@@JOB@@'))
      return ok(rest.slice(3).map(file => `\n@@JOB@@ ${Math.floor((options.jobs?.wroteAt(String(file)) ?? 0) / 1000)} ${String(file)}\n${options.jobs?.output(String(file)) ?? ''}`).join(''))
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('@@JOB@@')) {
      const n = Number(rest[3] ?? 0)
      const asked = rest.slice(4, 4 + n).map(String)
      const pids = [...String(rest[1]).matchAll(/for p in ([\d ]*); do kill/g)].flatMap(m => (m[1] ?? '').trim().split(/\s+/).filter(Boolean))
      const ps = String(rest[1]).includes('@@PS@@') && options.jobs.ps ? `@@PS@@\n${options.jobs.ps()}\n` : ''
      return ok(`${asked.map(file => `\n@@JOB@@ ${Math.floor((options.jobs?.wroteAt(file) ?? 0) / 1000)} ${file}\n${options.jobs?.output(file) ?? ''}`).join('')}\n@@ALIVE@@${pids.filter(p => options.jobs?.alive?.(p) ?? true).map(p => ` ${p}`).join('')}\n${ps}`)
    }
    // The newest process number, as a shell started now gets it, and the processes as a command that has just ended leaves them
    if (options.jobs?.pid && tool === 'sh' && String(rest[1]).includes('# pid now')) return ok(`${options.jobs.pid()}\n`)
    if (options.jobs?.ps && tool === 'sh' && String(rest[1]).includes('@@LEFT@@')) return ok(`@@LEFT@@\n${options.jobs.ps()}\n`)
    // (and as they are while a command runs, where its shell is looked for: with the shells the test says run then)
    if (options.jobs?.ps && tool === 'sh' && String(rest[1]).includes('@@SHELLS@@')) return ok(`@@SHELLS@@\n${options.jobs.shells?.() ?? ''}\n${options.jobs.ps()}\n`)
    if (options.jobs?.fd && tool === 'sh' && String(rest[1]).includes('/proc/$p/fd/1')) return ok(options.jobs.fd())
    // Whose each process is by its environment, as the test says (this chat's where it says nothing)
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('# whose runs')) return ok(rest.slice(4).map(p => `${p} ${options.jobs?.owner?.(String(p)) ?? 'mine'}\n`).join(''))
    // The engine's tasks folder, where the test reads jobs
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('"$1"/tasks')) return ok('/tmp/claude-501/x/s1/tasks\n')
    // What sips says of a picture, where the test gives it
    const sipsSaid = tool === 'sips' ? options.sips?.([...e.argv]) : undefined
    if (sipsSaid !== undefined) return { value: { exitCode: 0, stdout: sipsSaid, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    if (tool === 'osascript') osa.push([...e.argv])
    // The file picker Attach opens: what the test lays as picker:chosen is picked, else the person cancels it
    if (tool === 'osascript' && e.argv.some(one => String(one).includes('choose file'))) return files.has('picker:chosen') ? ok(files.get('picker:chosen') ?? '') : ok('', 1)
    // What Paste finds on the clipboard: files copied, by their paths, as the test lays clipboard:files; a picture copied
    // (clipboard:picture), saved where the mod asks; else nothing
    if (tool === 'osascript' && e.argv.some(one => String(one).includes('NSPasteboard'))) {
      const to = String(e.argv.at(-1))
      if (files.has('clipboard:picture')) return (files.set(to, files.get('clipboard:picture') ?? ''), ok(`${to}\n`))
      return ok(files.get('clipboard:files') ?? '')
    }
    // On Windows the same through Windows PowerShell: its Open box, and its clipboard, a picture saved where CLAUDOPUS_PASTE_TO says
    // (each line ends as Windows ends lines)
    if (tool === 'powershell' && e.argv.some(one => String(one).includes('OpenFileDialog'))) return files.has('picker:chosen') ? ok((files.get('picker:chosen') ?? '').replace(/\n/g, '\r\n')) : ok('')
    if (tool === 'powershell' && e.argv.some(one => String(one).includes('GetFileDropList'))) {
      const to = String(e.init?.env?.CLAUDOPUS_PASTE_TO ?? '')
      if (files.has('clipboard:picture')) return (files.set(to, files.get('clipboard:picture') ?? ''), ok(`${to}\r\n`))
      return ok((files.get('clipboard:files') ?? '').replace(/\n/g, '\r\n'))
    }
    // What was handed to this Mac's keychain on security's stdin
    if (tool === '/usr/bin/security' && !files.has(KEYCHAIN)) files.set('keychain:dialog', String(rest[0]))
    if (tool === '/usr/bin/security') return (keychain.push(String(e.init?.stdin ?? '')), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
    // bin/catch-up, started in a session of its own
    if (tool === '/bin/sh' && String(rest[4] ?? '').endsWith('/bin/catch-up')) return (own.push([...e.argv]), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
    // bin/tidy, started the same way
    if (tool === '/bin/sh' && String(rest[4] ?? '').endsWith('/bin/tidy')) return (own.push([...e.argv]), ok())
    // The disk left, as df's last line, where the test lays it as df
    if (tool === 'sh' && String(rest[1]).startsWith('# disk left')) return ok(files.get('df') ?? '')
    // Claudopus.app, and Claudopus Asks for --asks, answer as the apps on this Mac are set: 0 shown, 2 turned off in System Settings
    if (tool?.endsWith('bin/notify')) {
      own.push([...e.argv])
      return { value: { exitCode: (rest[0] === '--asks' ? options.app?.asks : options.app?.claudopus) ?? 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    if (tool === 'open') shown.push([...e.argv])
    // Tailscale's file sending, where the test says this Mac has it: the devices it reaches, and what was sent
    if (tool === 'tailscale' || tool?.endsWith('/Tailscale')) {
      if (options.tailscale === undefined) return { value: { exitCode: 127, stdout: '', stderr: 'not found', isStdoutTruncated: false, isStderrTruncated: false } }
      if (!rest.includes('--targets')) dropped.push([...e.argv])
      return { value: { exitCode: 0, stdout: rest.includes('--targets') ? options.tailscale : '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    if (tool === 'kill') killed.push(...rest.map(String))
    // A run stopped from the panel: its processes asked to end, then made to, all of them gone
    if (tool === 'sh' && String(rest[1]).startsWith('kill -TERM "$@"')) return (killed.push(...rest.slice(3).map(String)), ok(''))
    // A release on GitHub, where the test gives one: the mod's folder is Claudopus's main checkout on main, a fetch of the release's
    // tag lays its commit under the download ref (and git's progress where the step reads it), and the folder's tree in that commit
    // is the one the release published unless the test says what came down instead
    const release = options.release
    if (release && tool === 'sh' && rest[1] === '"$@" 2>"$0"') {
      const argv = rest.slice(3).map(String)
      gitRan.push(argv.slice(argv.indexOf('-C') + 2).join(' '))
      if (release.fetchFails) return (files.set(String(rest[2]), 'fatal: unable to access GitHub: Could not resolve host'), ok('', 128))
      files.set(String(rest[2]), 'Receiving objects:  50% (10/20), 1.00 MiB | 2.00 MiB/s\rReceiving objects: 100% (20/20), 2.00 MiB | 2.00 MiB/s, done.\nResolving deltas: 100% (5/5), done.\n')
      files.set('git:ref', release.commit)
      return ok()
    }
    if (release && tool === 'git' && rest.includes('--show-toplevel')) return ok('/plugins-src\n')
    // No bisect or rebase under way in it, unless the test says one is
    if (release && tool === 'sh' && String(rest[1]).includes('BISECT_LOG')) return ok(release.midWay ? '' : 'clear\n')
    if (release && tool === 'sh' && String(rest[1]).includes('write-tree')) return ok(`${files.get('tree:installed') ?? release.tree}\n`)
    if (release && tool === 'env' && rest.includes('git')) {
      const args = rest.slice(rest.indexOf('-C') + 2).map(String)
      gitRan.push(args.join(' '))
      const at = (arg?: string) => (arg ?? '').replace(/\^\{commit\}$/, '')
      if (args[0] === 'rev-parse' && args.includes('--show-toplevel')) return ok('/plugins-src\n')
      if (args[0] === 'ls-files') return ok('mods/claudopus/.claude-plugin/plugin.json\n')
      if (args[0] === 'rev-parse' && args.includes('--git-dir')) return ok(release.worktree ? '/plugins-src/.git/worktrees/fix\n/plugins-src/.git\n' : '/plugins-src/.git\n/plugins-src/.git\n')
      if (args[0] === 'symbolic-ref' && args[1] === 'HEAD') return ok()
      if (args[0] === 'symbolic-ref') return release.noBranch || release.detached ? ok('', 1) : ok(release.worktree ? 'fix-bar\n' : 'main\n')
      if (args.includes('--symbolic-full-name')) return ok('origin/main\n')
      if (args[0] === 'rev-parse' && args.includes('--verify')) {
        const what = args.at(-1) ?? ''
        if (what.startsWith('refs/claudopus/update')) return files.has('git:ref') ? ok(`${files.get('git:ref')}\n`) : ok('', 1)
        if (what.includes(':')) return what.startsWith(`${release.commit}:`) && files.has('git:ref') ? ok(`${release.got ?? release.tree}\n`) : ok('', 1)
        return ok(`${at(what)}\n`)
      }
      if (args[0] === 'show') return ok(JSON.stringify({ name: 'claudopus', version: release.manifest ?? release.version }))
      if (args[0] === 'update-ref' && args[1] === '-d') return (files.delete('git:ref'), ok())
      if (args[0] === 'merge-base') {
        const isMain = args.includes('refs/heads/main')
        const isOwn = release.ownCommits || (release.noBranch && args.includes('origin/main')) || (release.mainAhead && isMain) || (release.mainPast && isMain && !args.includes('origin/main'))
        return ok('', isOwn ? 1 : 0)
      }
      if (args[0] === 'merge') {
        if (release.overwrite) return { value: { exitCode: 1, stdout: '', stderr: 'error: Your local changes to the following files would be overwritten by merge', isStdoutTruncated: false, isStderrTruncated: false } }
        files.set('manifest', JSON.stringify({ name: 'claudopus', version: release.version }))
        return ok()
      }
      if (args[0] === 'ls-remote') return ok(`${release.online ?? release.commit}\tHEAD\n`)
      return ok()
    }
    // git in the mod's folder: no checkout unless the test lays git:online, the version its branch online has; then the folder is on
    // main following origin/main, behind it, and a fast-forward (refused with what git:merge says, where laid) moves the manifest there
    if (tool === 'env' && rest.includes('git')) {
      const args = rest.slice(rest.indexOf('-C') + 2)
      const online = files.get('git:online')
      if (online === undefined) return ok('', 128)
      gitRan.push(args.join(' '))
      if (args[0] === 'merge' && args[1] !== undefined && args[1].startsWith('--ff')) {
        if (files.has('git:merge')) return { value: { exitCode: 1, stdout: '', stderr: files.get('git:merge') ?? '', isStdoutTruncated: false, isStderrTruncated: false } }
        files.set('manifest', JSON.stringify({ name: 'claudopus', version: online }))
        return ok()
      }
      if (args.includes('--symbolic-full-name')) return ok('origin/main\n')
      if (args[0] === 'symbolic-ref') return ok('main\n')
      if (args[0] === 'rev-parse' && args.at(-1) === 'HEAD') return ok('aaa\n')
      if (args[0] === 'rev-parse' && args.at(-1) === '@{u}') return ok('bbb\n')
      return ok()
    }
    // Another Mac over ssh: what it answers is laid by the test as ssh:<what>; an answer sent there is kept as it was handed over
    if (tool === 'ssh') {
      sshed.push([String(e.argv.at(-1)), String(e.init?.stdin ?? '')])
      const command = String(e.argv.at(-1))
      // Presses left there for this Mac are taken once, as moving each aside there takes it
      const opens = files.get('ssh:opens') ?? ''
      if (command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/")) files.delete('ssh:opens')
      const said = command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/") ? opens : command.startsWith("sh -c 'L=") ? files.get('ssh:fetch') : command.startsWith("sh -c 'echo $HOME;") ? files.get('ssh:results') : files.has('ssh:down') ? undefined : ''
      return { value: { exitCode: said === undefined ? 255 : 0, stdout: said ?? '', stderr: said === undefined ? 'ssh: connect to host m4: timed out' : '', isStdoutTruncated: command.startsWith("sh -c 'echo $HOME;") && files.has('ssh:cut'), isStderrTruncated: false } }
    }
    // The looks for chats running without Claudopus here and for what the app's log says: what the test lays as sh:off and sh:applog.
    // A notification told once makes its folder under live/macs/told, which a second try finds there
    if (tool === 'sh' && (String(rest[1]).includes('custom-title.json') || String(rest[1]).includes('Starting app'))) {
      const said = files.get(String(rest[1]).includes('Starting app') ? 'sh:applog' : 'sh:off') ?? ''
      return { value: { exitCode: 0, stdout: said, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    if (tool === 'sh' && String(rest[1]).startsWith('mkdir -p "$1" && mkdir "$2"')) {
      const told = `told:${String(rest[4])}`
      const isNew = !files.has(told)
      files.set(told, '')
      return { value: { exitCode: isNew ? 0 : 1, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    // A file made only where none is, as the update's lock is taken with the shell's noclobber
    if (tool === 'sh' && rest[1] === 'set -C; printf %s "$2" > "$1"' && rest[3] !== undefined) {
      if (files.has(String(rest[3]))) return ok('', 1)
      files.set(String(rest[3]), String(rest[4] ?? ''))
      return ok()
    }
    // A shell run here: bringing results from another Mac lays there what the test laid as remote:<folder>/<file>, and a folder moved
    // into place goes only where none has its name
    // Another chat's transcript, read for its work's Details: the file under the projects folder named by its folder, if kept
    if (tool === 'sh' && String(rest[1]).startsWith('for f in "$1/$2/$3"')) {
      const path = `${rest[3]}/${rest[4]}/${rest[5]}`
      return files.has(path) ? ok(files.get(path)) : ok('', 1)
    }
    // The lines a task added to and took from its files, as the test lays git:numstat
    // (git:numstat:<repo> for a repo of its own)
    if (tool === 'sh' && String(rest[1]).includes('git diff --numstat')) return ok(files.get(`git:numstat:${String(rest[3])}`) ?? files.get('git:numstat') ?? '')
    // What changed in one file, as the test lays git:diff:<the file in its repo>; a file it lays none for is new
    if (tool === 'sh' && String(rest[1]).includes('# the changes tab')) return ok(files.get(`git:diff:${String(rest.at(-1))}`) ?? 'NEW\n')
    if (tool === 'sh' || tool === 'bash') {
      sshed.push([String(rest[1]), String(rest.slice(3).join(' '))])
      // A stream cut short lays half of what it carried and fails
      if (String(rest[1]).includes('tar xf - -C "$S"')) {
        for (const [key, text] of [...files]) if (key.startsWith('remote:') && !(files.has('pull:cut') && key.endsWith('report.md'))) files.set(`${rest[3]}/${key.slice(7)}`, text)
        // Cut between two files, tar may end well: only the _end it closes with is missing
        if (files.get('pull:cut') === 'between') return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
        if (files.has('pull:cut')) return { value: { exitCode: 1, stdout: '', stderr: 'tar: Truncated input file', isStdoutTruncated: false, isStderrTruncated: false } }
        files.set(`${rest[3]}/_end`, '')
      }
      if (String(rest[1]).startsWith('mkdir "$3"')) {
        const [from = '', to = ''] = [String(rest[3]), String(rest[4])]
        if (![...files.keys()].some(key => key.startsWith(`${to}/`))) for (const [key, text] of [...files]) if (key.startsWith(`${from}/`)) (files.set(`${to}${key.slice(from.length)}`, text), files.delete(key))
      }
      return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    // This Mac's own name, as its Sharing settings give it
    if (tool === 'scutil') return { value: { exitCode: 0, stdout: 'Sams-MacBook-Air\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    if (tool === 'rm') (files.delete(String(rest.at(-1))), files.delete(`${String(rest.at(-1))}/at`))
    // A file moved aside
    if (tool === 'mv') (files.set(String(rest.at(-1)), files.get(String(rest.at(-2))) ?? ''), files.delete(String(rest.at(-2))))
    // A copy the mod makes of a file
    if (tool === 'cp') (copied.push(String(rest[2])), files.set(String(rest[2]), files.get(String(rest[1])) ?? ''))
    const isGone = killed.includes('700')
    // bin/keyring, as the runners keep a value: laid by the test as keyring:<service>/<account>
    if (tool?.endsWith('bin/keyring')) {
      const key = `keyring:${rest[1]}/${rest[2]}`
      if (rest[0] === 'get') return files.has(key) ? ok(files.get(key)) : ok('', 1)
      if (rest[0] === 'set') return (files.set(key, String(e.init?.stdin ?? '').replace(/\n$/, '')), ok())
      if (rest[0] === 'delete') return files.has(key) ? (files.delete(key), ok()) : ok('', 1)
      if (rest[0] === 'list') return ok([...files.keys()].filter(one => one.startsWith(`keyring:${rest[1]}/`)).map(one => `${one.split('/').pop()}\n`).join(''))
      // Every service and account a value is kept under, never a value: the keys laid as secret:<name> and keychain-entry:<service>\t<account>
      // (a keychain that does not answer, where the test lays keyring:refused, fails it)
      if (rest[0] === 'entries' && files.has('keyring:refused')) return ok('', 1)
      if (rest[0] === 'entries') return ok([...files.keys()].flatMap(one => (one.startsWith('secret:') && one !== 'secret:refused' ? [`claudopus-secret\t${one.slice(7)}\n`] : one.startsWith('keychain-entry:') ? [`${one.slice(15)}\n`] : [])).join(''))
      return ok('', 2)
    }
    // git, asked what a folder is as a command would change it: a main checkout where the test lays checkout:<folder>, a worktree
    // of it where that says worktree, else no repo
    if (tool === 'git' && rest.includes('--path-format=absolute') && rest.includes('--git-common-dir') && rest.includes('--show-toplevel')) {
      const folder = String(rest[rest.indexOf('-C') + 1])
      const on = files.get(`checkout:${folder}`)
      if (on === undefined) return ok('', 128)
      return ok(`${on === 'worktree' ? `${folder}/../.git/worktrees/x` : `${folder}/.git`}\n${folder}/.git\n${folder}\n`)
    }
    // git, asked where a worktree is and which branch it is on, as the test lays git:top and git:branch
    // (git:top:<folder> for a folder in a repo of its own)
    const topLaid = files.get(`git:top:${String(rest[rest.indexOf('-C') + 1])}`) ?? files.get('git:top')
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--show-toplevel')) return ok(topLaid !== undefined ? `${topLaid}\n` : '', topLaid !== undefined ? 0 : 128)
    // and where the repo a worktree belongs to keeps its git folder, as git:common lays it
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--git-common-dir')) return ok(files.has('git:common') ? `${files.get('git:common')}\n` : '', files.has('git:common') ? 0 : 128)
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--abbrev-ref')) return ok(files.has('git:branch') ? `${files.get('git:branch')}\n` : '', files.has('git:branch') ? 0 : 128)
    // and what a branch adds to main: its commits' subjects as git:log lays them, the files it changes as git:diff does
    if (tool === 'git' && rest.includes('log') && rest.includes('--format=%s')) return ok(files.get('git:log') ?? '')
    if (tool === 'git' && rest.includes('diff') && rest.includes('--name-only')) return ok(files.get('git:diff') ?? '')
    // and a branch's tip as git:tip lays it, and main as the remote has it as git:main lays its commits, newest first: a commit's
    // merge base with main is the commit itself only when main holds it
    if (tool === 'git' && rest.includes('rev-parse') && rest.some(arg => String(arg).startsWith('refs/heads/'))) return ok(files.has('git:tip') ? `${files.get('git:tip')}\n` : '', files.has('git:tip') ? 0 : 1)
    if (tool === 'git' && rest.includes('merge-base')) {
      const commit = String(rest[rest.indexOf('merge-base') + 1])
      return (files.get('git:main') ?? '').split(' ').includes(commit) ? ok(`${commit}\n`) : ok('base0\n')
    }
    // The secret runner: one key kept when the test lays its value, swapped for its name in what it is handed
    const kept = files.get('keychain:API_KEY')
    if (tool?.endsWith('bin/secret')) {
      // and the keys a test lays as secret:<name>, each listed by its name and hidden in what passes through
      const more = [...files].filter(([key]) => key.startsWith('secret:')).map(([key, value]) => [key.slice(7), value] as const)
      if (rest[0] === '--hide' && files.has('secret:refused')) return ok('', 1)
      const hidden = more.reduce((text, [name, value]) => text.replaceAll(value, `[hidden ${name}]`), kept ? String(e.init?.stdin ?? '').replaceAll(kept, '[hidden API_KEY]') : String(e.init?.stdin ?? ''))
      const said = rest[0] === '--list' ? `${kept ? 'API_KEY\n' : ''}${more.map(([name]) => `${name}\n`).join('')}` : hidden
      return { value: { exitCode: 0, stdout: said, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
    // The leaderboard's functions through curl, answered as the test lays board:<fn> ("<body>\n<status>"); none laid, curl couldn't connect
    if (tool === 'curl' && String(e.argv.at(-1)).includes('/rest/v1/rpc/')) {
      const fn = String(e.argv.at(-1)).split('/').at(-1) ?? ''
      boarded.push({ fn, body: JSON.parse(String(e.init?.stdin ?? '{}')) as Record<string, unknown> })
      const said = files.get(`board:${fn}`)
      const answer = () => (said === undefined ? ok('', 7) : ok(said))
      // hold:<fn> keeps the call on its way until the test lets it go: held.get(fn)?.('')
      return files.has(`hold:${fn}`) ? (new Promise(done => held.set(fn, () => done(answer()))) as never) : answer()
    }
    // jq:missing: none on the PATH (as on Windows, where Git for Windows has none), only one at its own full path
    if (tool === 'jq' && files.has('jq:missing')) return ok('', 127)
    // hold:jq keeps every chat's records being read, as they are for half a minute after a reload, until the test lets them go
    if (/jq(?:\.exe)?$/.test(tool ?? '') && files.has('hold:jq')) {
      const sum = files.get(`${String(e.argv.at(-1))}.sum`) ?? '{"s":[],"u":[],"d":[]}'
      return new Promise(done => held.set(`jq:${String(e.argv.at(-1))}`, () => done(ok(sum)))) as never
    }
    // grep handed a .env file for the names before each =, as the list of keys reads one: only what -o matches comes back
    if (tool === '/usr/bin/grep' && rest[0] === '-ohE') return ok((files.get(String(rest[2])) ?? '').split('\n').flatMap(line => line.match(/^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/)?.[0] ?? []).map(one => `${one}\n`).join(''))
    const stdout = /jq(?:\.exe)?$/.test(tool ?? '')
      ? // What jq makes of a transcript: the test lays it beside it
        (files.get(`${String(e.argv.at(-1))}.sum`) ?? '{"s":[],"u":[],"d":[]}')
      : tool === 'grep'
        ? // grep -rniF --include=*.md -e <phrase> <folder>, as recall asks it, over the .md files the test laid there
          [...files]
            .filter(([path]) => path.startsWith(`${String(rest.at(-1))}/`) && path.endsWith('.md'))
            .flatMap(([path, text]) => String(text).split('\n').flatMap((line, i) => (line.toLowerCase().includes(String(rest[rest.indexOf('-e') + 1]).toLowerCase()) ? [`${path}:${i + 1}:${line}\n`] : [])))
            .join('')
        : tool === 'lsof' && rest.includes('-iTCP')
          ? `p635\nn*:7000\n${isGone ? '' : 'p700\nn127.0.0.1:3100\nn[::1]:3100\n'}`
          : tool === 'lsof'
            ? `p635\nfcwd\nn/\np700\nfcwd\nn${HOME}/Documents/GitHub/3d-sandbox\n`
            : tool === 'ps' && rest.includes('-ww')
              ? // The commands running on this Mac, as a test lays them
                (files.get('ps:running') ?? '')
            : tool === 'ps' && rest.includes('-A')
              ? '  1 0 /sbin/launchd\n500 1 /Users/sam/Library/claude.app/Contents/MacOS/claude\n600 500 /bin/zsh\n700 600 /usr/local/bin/node\n635 1 /System/ControlCenter\n'
              : tool === 'ps'
                ? '700 node /repo/node_modules/.bin/next dev -p 3100\n635 /System/ControlCenter\n'
                : ''
    return { value: { exitCode: 0, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('tool.register', (_, e) => ({ value: { tool: `mcp__claudopus__${e.name}` } }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', (_, e) => {
    events.push(`open ${e.id}`)
    opened.push(e.id)
    tabs.push(`${e.id}: ${e.title}`)
    // A screen with nowhere to draw a pane, as a Remote Control chat seen from another device
    if (options.unplaced) return { value: { isPlaced: false, reason: 'no-surface' } } as never
    if (options.narrow && !options.narrow.isPressing) {
      if (options.live && !options.live.some(one => one.id === e.id)) options.live.push({ id: e.id, isShown: false, isPlaced: false })
      return { value: { isPlaced: false, reason: 'unasked below 144 columns (42 now)' } } as never
    }
    // `blind`: an engine with no surface to ask (a chat the app runs on another Mac over ssh) says nothing of any tab, drawn or not
    if (options.live && !options.live.some(one => one.id === e.id)) options.live.push({ id: e.id, isShown: false, isPlaced: !options.blind })
    return { value: { isPlaced: true } }
  })
  on('session.append', (_, e, next) => {
    if (e.agentId !== undefined && options.ended?.has(e.agentId)) return { deny: 'no running loop' } as never
    appended.push(`${e.agentId}: ${(e.message.content[0] as { text?: string }).text ?? ''}`)
    return next(e)
  })
  on('session.send', (_, e) => {
    if (options.unresumable?.has(e.to)) return { isDelivered: false, reason: 'no such agent' } as never
    // `unseen`: the agents a message started from a timer of the mod's, as the clock moved with no hook around it: the engine
    // leaves every hook of the mod out of such a run (seen in the kit: a hook of the mod's own answers its call from inside a hook,
    // and is left out of the same call from a timer)
    if (options.unseen && moving) options.unseen.push(e.to)
    resumed.push(`${e.to}: ${e.text}`)
    return { isDelivered: true } as never
  })
  // A command a test holds running until it lets it go, with what it then prints: `held.get(id)?.(text)`
  const held = new Map<string, (text: string) => void>()
  // A call a test starts and leaves running, kept so its test can end it: `keep(call)`, then `await settle()` as the test ends.
  // Left running, the call ends after its test, and the look the mod takes as a call ends runs against a later test's files
  const kept: Promise<unknown>[] = []
  const keep = <T,>(call: Promise<T>) => (kept.push(call.catch(() => undefined)), call)
  // Lets every held command go and every wait for a second end, until each kept call has ended
  const settle = async () => {
    let isDone = false
    const all = Promise.all(kept.splice(0)).then(() => (isDone = true))
    for (let n = 0; n < 2000 && !isDone; n++) {
      for (const [id, go] of [...held]) (held.delete(id), go(''))
      wake()
      await Promise.race([all, new Promise<void>(resolve => setTimeout(() => resolve(), 5))])
    }
    if (!isDone) throw new Error('a call the test kept did not end')
  }
  on('tool.call', async (_, e) => {
    if (e.tool === 'Agent') agentModels.push((e as { model?: string }).model)
    const command = String((e as { command?: string }).command ?? '')
    // The person says no to the app's prompt for this tool
    // as the engine says it: an error result in words, the same for an approval cut short
    if (files.get('refuse') === e.tool) return { result: "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.", isError: true } as never
    if (files.get('interrupt') === e.tool) return { result: '[Request interrupted by user for tool use]', isError: true } as never
    // A command marked to fail at its end (npm run build # fails) fails as the engine's does, with what the test lays in `fails`
    if (e.tool === 'Bash' && command.endsWith(' # fails')) return { result: `Exit code 1\n${files.get('fails') ?? ''}`, isError: true } as never
    // Claude Code's auto mode refuses this tool outright, as it does a background task's call, with no prompt to the person
    if (files.get('auto-refuse') === e.tool) return { result: "Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access]. If you have other tasks that don't depend on this action, continue working on those.", isError: true } as never
    // What the chat had been told when a hand-back reached the engine, which hands it on at once
    if (String(e.tool) === 'SubagentHandback') (atHandback.push(appended.length), resumedAtHandback.push(resumed.length))
    // Claude Code refuses a hand-back with a plain result too, as for a second report
    if (String(e.tool) === 'SubagentHandback' && files.get('handback-not-sent')) return { result: { success: false, message: 'Nothing was sent: an earlier report of yours was already delivered.' } } as never
    // A command started detached prints its process, as `echo $!` does
    if (e.tool === 'Bash' && /\bnohup\b/.test(command) && command.includes('$!')) return { result: { stdout: '48213\n', stderr: '', interrupted: false } } as never
    // A command that writes a file of the memory folder, by a path the hook cannot read in it: `effect <name> <text>` writes it,
    // `effect <name>` takes it away, and `effect <name> hold <key>` writes it once the test lets the call end
    // Write to the person's rules and roles writes them, as the tool does
    if (e.tool === 'Write' && /\/\.claude\/claudopus\/(?:rules|roles)\//.test(String((e as { file_path?: string }).file_path))) files.set(String((e as { file_path?: string }).file_path), String((e as { content?: string }).content ?? ''))
    if (e.tool === 'Bash' && command.startsWith('effect ')) {
      const [, name = '', ...text] = command.split(' ')
      if (text[0] === 'hold') await new Promise<string>(done => held.set(text[1] ?? '', done))
      if (text.length) files.set(`${MEMORY}/${name}`, text[0] === 'hold' ? text.slice(2).join(' ') : text.join(' '))
      else files.delete(`${MEMORY}/${name}`)
      return { result: { stdout: '', stderr: '', interrupted: false } } as never
    }
    // (or a real command marked to be held by a comment at its end: curl ... # hold dl)
    if (e.tool === 'Bash' && / # hold (\S+)$/.test(command)) return { result: { stdout: await new Promise<string>(done => held.set(command.match(/ # hold (\S+)$/)?.[1] ?? '', done)), stderr: '', interrupted: false } } as never
    // One sent to the background comes back at once, as the engine's does, and ends with the test
    if (e.tool === 'Bash' && (e as { run_in_background?: boolean }).run_in_background && command.startsWith('hold ')) {
      void new Promise<string>(done => held.set(command.slice(5), done))
      return { result: { stdout: '', stderr: '', interrupted: false, backgroundTaskId: `bg-${e.tool_use_id}` } } as never
    }
    if (e.tool === 'Bash' && command.startsWith('hold ')) return { result: { stdout: await new Promise<string>(done => held.set(command.slice(5), done)), stderr: '', interrupted: false } } as never
    if (e.tool === 'Bash' && command.includes('admin')) admins.push({ command, grants: [...files].filter(([path]) => path.startsWith(`${MEMORY}/admin-grants/`)).map(([, text]) => JSON.parse(text)) })
    // A tool gives what the test lays as result:<tool>:<its action>, as JSON
    const action = String((e as { action?: unknown }).action ?? '')
    if (files.has(`result:${e.tool}:${action}`)) return { result: JSON.parse(files.get(`result:${e.tool}:${action}`) ?? '{}') } as never
    // A command prints what the test lays as stdout:<the command>
    if (e.tool === 'Bash' && files.has(`stdout:${command}`)) return { result: { stdout: files.get(`stdout:${command}`), stderr: '', interrupted: false } } as never
    if (e.tool === 'TaskStop') stopped.push(String((e as { task_id?: string }).task_id))
    if (e.tool === 'SendMessage') sent.push(String((e as { message?: string }).message))
    // A command that prints the key, as one could print it by mistake
    if (e.tool === 'Bash' && String((e as { command?: string }).command).includes('echo $API_KEY')) return { result: { stdout: `token is ${files.get('keychain:API_KEY') ?? 'none'}`, stderr: '', interrupted: false } } as never
    // A file that holds the key, as a .env does
    if (e.tool === 'Read' && String((e as { file_path?: string }).file_path).endsWith('/.env')) return { result: { type: 'text', file: { content: `API_KEY=${files.get('keychain:API_KEY') ?? 'none'}` } } } as never
    // A workflow runs in the background: the tool answers with its run, its task and where its transcripts go
    // A command sent to the background answers at once with its task, as a real one did on 13 Nov; a watch the same
    if (e.tool === 'Bash' && (e as { run_in_background?: boolean }).run_in_background) return { result: { stdout: '', stderr: '', interrupted: false, isImage: false, noOutputExpected: false, backgroundTaskId: `bg-${e.tool_use_id}` } } as never
    // SBOS's list of names, as the test lays it
    if (e.tool === 'mcp__sbos__secrets') return { result: { content: [{ type: 'text', text: files.get('sbos:secrets') ?? '[]' }] } } as never
    if (e.tool === 'Monitor') {
      // as the engine answers: a watch not kept for good ends at its time limit, at most 30 minutes
      const w = e as { timeout_ms?: number; persistent?: boolean | string }
      const forGood = w.persistent === undefined || w.persistent === true || w.persistent === 'true'
      return { result: { taskId: `mon-${e.tool_use_id}`, timeoutMs: forGood ? 0 : Math.min(w.timeout_ms ?? 300_000, 1_800_000), persistent: forGood } } as never
    }
    if (e.tool === 'Workflow') return { result: { status: 'async_launched', taskId: 'wt1', runId: 'wf_1', taskType: 'local_workflow', workflowName: 'rounds', transcriptDir: '/t/wf_1', scriptPath: '/t/wf_1.js' } } as never
    return { result: 'ran' } as never
  })
  on('agent.spawn', (_, e) => {
    prompts.push(e.prompt)
    backgrounds.push(e.background)
    asked.push(e.model)
    types.push((e as { subagentType?: string }).subagentType)
    const resume = (e as { resume?: { agentId?: string } }).resume
    // The model an agent's own type starts it on, by its task's few words, as Explore starts on Haiku
    return { model: options.startedOn?.[e.description ?? ''] ?? options.model ?? 'm', agentId: resume?.agentId ?? `a${(spawned += 1)}` } as never
  })
  // The kinds of agent the mod registers, by name
  on('agent.register', (_, e) => (registered.push(String((e as { name?: string }).name)), (kindTools[String((e as { name?: string }).name)] = (e as { tools?: string[] }).tools ?? []), { value: undefined }) as never)
  on('agent.list', () => ({ value: Object.entries(options.agents ?? {}).map(([id, status]) => ({ id, description: 'Listed by the engine', type: options.kinds?.[id] ?? 'fork', status, ...(options.parents?.[id] ? { parentId: options.parents[id] } : {}) })) as never }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('prompt.submit', (_, e) => {
    if (e.origin.kind !== 'composer') (submitted.push(e.text), submittedContext.push((e.context ?? []).join('\n')))
    return { text: e.text, context: e.context }
  })
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  // The sounds played and the notifications raised, each as "title | text"
  on('audio.play', (_, e) => {
    played.push(String((e.clip as { asset?: string }).asset))
    return { value: undefined }
  })
  // The app takes it, or, as the desktop app does today, takes none from a mod
  on('ui.notify', (_, e) => {
    if (options.app?.noSurface) return { value: { isSent: false, reason: 'no-surface' } } as never
    notified.push(`${e.title ?? ''} | ${e.text}`)
    return { value: { isSent: true, channel: 'client' } } as never
  })
  on('tool.describe', (_, e) => ({ description: e.description }))
  // The settings hooks beneath: none answers a permission request, unless a test lays one that allows
  on('classic.Notification', () => ({}) as never)
  on('classic.PostToolBatch', () => ({}) as never)
  on('classic.PermissionRequest', () => (files.has('settings:allow') ? { decision: { behavior: 'allow' } } : {}) as never)
  on('session.compact', (_, e) => {
    compacts.push(e.instructions)
    return { messages: e.messages }
  })

  return { windowsRuns, files, completed, pressRuns, titles, compacts, opened, tabs, viewed, stopped, killed, closed, logged, sent, appended, submitted, submittedContext, resumed, atHandback, resumedAtHandback, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keep, settle, keychain, admins, boarded, wake, gitRan, backgrounds, agentModels, asked, types, registered, kindTools }
}

// A seal as the test world makes it: 64 hex digits from the key and the message, the same for the same two
const fakeSeal = (key: string, message: string) =>
  Array.from({ length: 8 }, (_, n) => [...`${n}${key}\n${message}`].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261 + n).toString(16).padStart(8, '0')).join('')
// A box's value as the test world seals it to a runner's key: hex of the key's start and the value, long as a real one, never the
// value itself as typed
const boxSealed = (key: string, value: string) => `${[...`${key.slice(0, 12)}|${value}`].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`.padEnd(344, 'A')
// The public half of a runner's key, as bin/admin puts it in a request
const BOX_PUBLIC = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${'x'.repeat(300)}IDAQAB`
// One of the person's settings or texts as Config writes it: the file, and what Claudopus knows it holds, so no check puts it back
const ownSet = (files: Map<string, string>, name: string, text: string) => {
  const kept = (() => {
    try {
      return (JSON.parse(files.get(`${MEMORY}/admin-known.json`) ?? '{}') as { files?: Record<string, string | null> }).files ?? {}
    } catch {
      return {}
    }
  })()
  const known = { ...kept, [name]: text }
  if (!files.has('keychain:known')) files.set('keychain:known', 'key-known')
  const count = (() => {
    try {
      return Number((JSON.parse(files.get(`${MEMORY}/admin-known.json`) ?? '{}') as { count?: number }).count ?? 0) + 1
    } catch {
      return 1
    }
  })()
  files.set(`${MEMORY}/admin-known.json`, JSON.stringify({ files: known, count, seal: fakeSeal(files.get('keychain:known') ?? '', `known\n${count}\n${JSON.stringify(known)}`) }))
  files.set(`${MEMORY}/${name}`, text)
}
// A button of the open card by its key less the count of presses the card adds to it
const keyed = async (pane: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; props: Record<string, unknown> }[]> }, base: string) =>
  (await pane.findAll({ type: 'Button' })).find(one => new RegExp(`^${base}-\\d+$`).test(one.key ?? ''))
const pressed = async (pane: { press: (q: { key: string }) => Promise<unknown> } & Parameters<typeof keyed>[0], base: string) => pane.press({ key: (await keyed(pane, base))?.key ?? base })
const spawn = { subagentType: 'general-purpose', fork: false, background: true, description: 'Fix the nose' } as const
// What the panel shows after work that is not awaited, such as a look at the servers. It waits by the wall clock, up to 40 seconds
// (inside a test's minute), not by a count of tries: on a loaded machine or GitHub's slower runner a
// count of tries ran out before the work did
declare const Date: { now: () => number; UTC: (year: number, month: number, day?: number, hours?: number) => number }
const until = async <T,>(look: () => Promise<T | undefined>) => {
  for (const end = Date.now() + 40_000; ; ) {
    const got = await look()
    if (got) return got
    if (Date.now() > end) return undefined
    await new Promise<void>(resolve => setTimeout(() => resolve(), 5))
  }
}
// Config's More opened, where it is closed
const moreShown = async (pane: Parameters<typeof pressed>[0]) => {
  if (await keyed(pane, 'config-more-show')) await pressed(pane, 'config-more-show')
  return until(async () => ((await keyed(pane, 'config-more-hide')) ? true : undefined))
}

// ---- Set-ups more than one area uses ----

const steps = async ($: Parameters<TestBody>[0], index: number, model: string, agentId?: string) => {
  const chunks: { kind: string; name?: string; text?: string }[] = []
  for await (const c of $.turn.step({ turnId: 't', index, model, messageCount: 2, ...(agentId ? { agentId } : {}) })) chunks.push(c as never)
  return chunks
}

const ADMIN = '/plug/claudopus/bin/admin'
const GRANTS = `${MEMORY}/admin-grants/`
const ALLOWED = `${MEMORY}/admin-allowed.json`
// A piece of work under way in a chat of Sam's, and the panel
const gated = async ($: Parameters<TestBody>[0], on: On, config: Record<string, unknown> = {}, options: Parameters<typeof world>[1] = {}) => {
  const w = world(on, options)
  w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', ...config }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the hosts file', prompt: 'fix the hosts file' } as never)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const bash = (id: string, command: string, agentId = 'a1', more: Record<string, unknown> = {}) => $.tool.call({ tool: 'Bash', tool_use_id: id, command, agentId, ...more } as never)
  const labels = async () => (await list.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
  // The call is held once its buttons are on the card
  const held = async (id: string) => until(async () => keyed(list, `gate-${id}-0-deny`))
  const grants = () => [...w.files.keys()].filter(path => path.startsWith(GRANTS))
  // A press on a card's gate, and the second after which the held call reads it
  const press = async (key: string) => (await pressed(list, key), w.wake())
  return { ...w, holding: w.held, list, bash, labels, held, grants, press }
}

// A prompt's Yes or No, by the start of its key: the prompt's id and the count of presses follow
const button = async (pane: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; props: Record<string, unknown> }[]> }, start: string) =>
  (await pane.findAll({ type: 'Button' })).find(one => String(one.key ?? '').startsWith(start))

const NOW = 1_700_000_000_000
// This chat's own work as its file shares it with the other chats
const read$todos = async (files: Map<string, string>) => (JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards?.find((one: { id: string }) => one.id === 'a1') ?? {}) as { ask?: { text: string } }
// Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
const otherChat = (at: number, chat = 'chat-b', title = 'Billing page') =>
  JSON.stringify({
    chat,
    title,
    folder: '/repo/billing',
    host: '',
    at,
    cards: [
      { id: 'b1', parentId: '', isFork: false, tokens: 0, model: 'claude-opus-5-5', title: 'Send the invoices', words: 'send them', items: [{ text: 'Draft the mail', state: 'done' }], entries: [{ at, kind: 'note', text: 'I drafted the mail.' }], answer: '', ask: { text: 'May I send 12 invoices?', choices: ['Send', 'Not now'], from: 'b1', at }, startedAt: at - 60_000, endedAt: 0, status: 'working' },
      { id: 'b2', parentId: '', isFork: false, tokens: 0, title: 'Check the totals', words: 'check', items: [], entries: [{ at, kind: 'note', text: 'Adding up March.' }], answer: '', startedAt: at - 30_000, endedAt: 0, status: 'working' },
    ],
  })
// A drawing past what the app draws (2000 parts, 32 deep, 262144 characters) is thrown away whole by the app, with no word to the
// mod, and the tab says "Nothing to show yet" for good (19 Nov: Details of a task with 22 helpers and 206 ended commands). The
// app's own check, as it runs before it draws a tab
const appDraws = (tree: unknown) => {
  let parts = 0
  let deepest = 0
  const plain = (n: unknown): unknown => {
    if (n === null || n === undefined || typeof n === 'boolean') return null
    if (typeof n === 'string' || typeof n === 'number') return String(n)
    if (Array.isArray(n)) return n.map(plain).filter(one => one !== null)
    const el = n as { type?: string; key?: string; props?: Record<string, unknown>; children?: unknown[] }
    const props: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(el.props ?? {})) if (typeof v !== 'function' && k !== 'children' && v !== undefined) props[k] = v
    return { type: el.type, props: { ...props, key: el.key }, children: (el.children ?? []).map(plain).filter(one => one !== null) }
  }
  const walk = (n: unknown, depth: number) => {
    if (typeof n === 'string') return void (parts += 1)
    const el = n as { children?: unknown[] }
    parts += 1
    deepest = Math.max(deepest, depth + 1)
    for (const child of el.children ?? []) walk(child, depth + 1)
  }
  const sent = plain(tree)
  walk(sent, 0)
  return { parts, deepest, chars: JSON.stringify(sent).length, isDrawn: parts <= 2000 && deepest <= 32 && JSON.stringify(sent).length <= 262_144 }
}
// The desktop draws each moving picture (an Svg with isInteractive) in a frame of its own, and when a pane is drawn again keeps a
// frame it drew before, its animation going on, only as its engine surface matches them (Uc, in the app's own code): in the new
// drawing's order, each takes the first frame of the drawing before, at or after the last one taken, that is the same picture with
// the same words and size, whose elements from the pane's top down are as many and of the same kinds, and none of them taken for
// another place. Any other is made anew and its animation starts again (27 Nov: rings that turned a little and jumped back). Each
// moving picture of the new drawing, by its words, and whether the app keeps it
const appKeeps = (before: unknown, after: unknown) => {
  type El = { type?: string; props?: Record<string, unknown>; children?: unknown[] }
  const TAGS: Record<string, string> = { Box: 'div', Text: 'span', div: 'div', span: 'span', b: 'b' }
  type Frame = { path: object[]; tags: string[]; leaf: string; alt: string; isMoving: boolean }
  const framesOf = (root: unknown) => {
    const out: Frame[] = []
    const walk = (n: unknown, path: object[], tags: string[]): void => {
      if (!n || typeof n !== 'object') return
      if (Array.isArray(n)) return n.forEach(one => walk(one, path, tags))
      const el = n as El
      const p = el.props ?? {}
      if (el.type === 'Svg') {
        if (p.isInteractive) out.push({ path: [...path, el], tags: [...tags, 'iframe'], leaf: JSON.stringify([p.source, p.alt, p.width, p.height]), alt: String(p.alt), isMoving: String(p.source).includes('<animate') })
        return
      }
      // A part that is no element of the app's own puts its children in its parent's place
      const tag = el.type ? TAGS[el.type] : undefined
      for (const child of el.children ?? []) tag ? walk(child, [...path, el], [...tags, tag]) : walk(child, path, tags)
    }
    walk(root, [], [])
    return out
  }
  const old = framesOf(before)
  const map = new Map<object, object>()
  const used = new Set<object>()
  let from = 0
  return framesOf(after).flatMap(f => {
    const i = old.findIndex((o, n) => n >= from && o.path.length === f.path.length && o.leaf === f.leaf && f.path.every((el, k) => (map.has(el) ? map.get(el) === o.path[k] : !used.has(o.path[k]!) && o.tags[k] === f.tags[k])))
    if (i !== -1) ((from = i + 1), f.path.forEach((el, k) => (map.set(el, old[i]!.path[k]!), used.add(old[i]!.path[k]!))))
    return f.isMoving ? [{ alt: f.alt, isKept: i !== -1 }] : []
  })
}

// The admin gate: an admin command waits for the person's press on its work's card

// The waits the engine was asked to run for a held call (`/bin/sleep`, which the world ends only on wake()): a press must end the
// hold with no more than the one that was in flight, and with no wake()
const countingSleeps = (on: On) => {
  const seen = { sleeps: 0 }
  const counted = new Proxy(on, {
    apply: (to, self, args: unknown[]) => {
      const [name, handle] = args as [string, (c: unknown, e: { argv?: readonly string[] }) => unknown]
      const run = name !== 'process.run' ? handle : (c: unknown, e: { argv?: readonly string[] }) => (e.argv?.[0] === '/bin/sleep' && (seen.sleeps += 1), handle(c, e))
      return Reflect.apply(to as never, self, [name, run])
    },
  }) as On
  return { on: counted, seen }
}
type GateDrawn = { findAll: (q: { type: string }) => Promise<readonly { key?: string | undefined; text?: unknown; props: Record<string, unknown> }[]> }
// Everything drawn in the colour of what is done: no press leaves a green box or line
const gateGreens = async (pane: GateDrawn) => [...(await pane.findAll({ type: 'Box' })), ...(await pane.findAll({ type: 'Text' }))].filter(one => (!(one.key ?? '').startsWith('outline-') || one.key === 'outline-top') && ['color', 'borderColor', 'backgroundColor'].some(prop => one.props[prop] === 'success')).length
const gateTexts = async (pane: GateDrawn) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
// The labels of one gate's own buttons, in the order drawn
const gateButtons = async (pane: GateDrawn, id: string) => (await pane.findAll({ type: 'Button' })).filter(one => (one.key ?? '').startsWith(`gate-${id}-`)).map(one => String(one.props.label ?? ''))
const ALLOWED_LINE = '✓ You pressed “Allow”'
const REFUSED_LINE = "✓ You pressed “Don't allow”"

test('an admin command is held however the runner is reached, and nothing else is taken for one', async ($, on) => {
  const { press, bash, held, admins, list } = await gated($, on)
  let n = 0
  for (const command of [
    `${ADMIN} here "id -u"`,
    `/plug/claudopus/bin/../bin/admin here 'id -u'`,
    `/plug/claudopus//bin/./admin here 'id -u'`,
    `cd /plug/claudopus/bin && ./admin here 'id -u'`,
    `cd /plug/claudopus && bin/admin here 'id -u'`,
    `"$CLAUDE_PLUGIN_ROOT"/bin/admin here 'id -u'`,
    `X=1 env Y=2 ${ADMIN} here 'id -u'`,
    `nohup ${ADMIN} here 'id -u' &`,
    `timeout 600 ${ADMIN} here 'id -u'`,
    `command ${ADMIN} here 'id -u'`,
    `bash -c "${ADMIN} here 'id -u'"`,
    `sh -lc '${ADMIN} here "id -u"'`,
    `bash ${ADMIN} here 'id -u'`,
    `eval "${ADMIN} here 'id -u'"`,
    `out=$(${ADMIN} here 'id -u') && echo "$out"`,
    `echo start; ${ADMIN} here 'id -u' | grep 0`,
    `sudo -u root ${ADMIN} here 'id -u'`,
    `if ${ADMIN} here 'id -u'; then echo yes; fi`,
    `if true; then ${ADMIN} here 'id -u'; fi`,
  ]) {
    const id = `d${(n += 1)}`
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    // Each shows the command as the runner would be handed it
    expect((await list.findAll({ type: 'Text', text: 'id -u' })).some(one => one.props.mono)).toBe(true)
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // The command is shown as the shell hands it over, quotes inside it and all
  const quoted = bash('q1', `${ADMIN} here 'echo "a b" > /etc/x; chmod 644 /etc/x'`)
  expect(await held('q1')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'echo "a b" > /etc/x; chmod 644 /etc/x' })).toBeDefined()
  await press('gate-q1-0-deny')
  await quoted
  // Inside double quotes a backslash stays, as the shell leaves it, unless it escapes a quote, a dollar or itself
  const slashed = bash('q2', `${ADMIN} here "printf 'a\\nb' > \\"/etc/x y\\""`)
  expect(await held('q2')).toBeDefined()
  expect(await list.find({ type: 'Text', text: `printf 'a\\nb' > "/etc/x y"` })).toBeDefined()
  await press('gate-q2-0-deny')
  await slashed
  expect(admins).toEqual([])
  // Words about it, forgetting a password, and other tools are no admin command: they run as they are
  for (const command of [`git commit -m "bin/admin here 'id -u' now asks"`, `echo ${ADMIN} here id`, `${ADMIN} here --forget`, `${ADMIN}`, 'django-admin migrate', 'ls bin/admin', `cat ${ADMIN}`, '/usr/local/bin/admin here now', 'vendor/bin/admin migrate up']) expect((await bash(`n${(n += 1)}`, command)).result).toBe('ran')
})

test("asked each time: the call is held and its card has one block (Permission, the question in amber, the command whole, Allow, Don't allow and Always allow this command); Allow lets that one command run at once, and one grey line says what was pressed", async ($, on) => {
  const counted = countingSleeps(on)
  const { list, bash, labels, held, grants, admins, logged, appended, notified, files, clock, wake } = await gated($, counted.on)
  let done = false
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`).then(r => ((done = true), r))
  expect(await held('b1')).toBeDefined()
  // Held: nothing ran, and nothing is granted
  expect(done).toBe(false)
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  // The block: an amber outline, a dim label of its kind, the question in amber, the command whole in a row of its own, the buttons
  const boxes = (await list.findAll({ type: 'Box' })) as { key?: string; props: Record<string, unknown> }[]
  expect(boxes.filter(one => one.key === 'outline-top' && one.props.backgroundColor === '#E5A50A').length).toBe(1)
  const drawn = await gateTexts(list)
  expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 3)).toEqual(['Permission', 'Run this as admin on this Mac?', 'chmod 644 /etc/hosts'])
  expect((await list.find({ type: 'Text', text: 'Permission' }))?.props.dimColor).toBe(true)
  const question = await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })
  expect([question?.props.color, question?.props.bold]).toEqual(['#E5A50A', true])
  expect((await list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' }))?.props.mono).toBe(true)
  expect(await gateButtons(list, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command'])
  // Nothing under the question when there is nothing more to say, and none of the words the block had before
  expect((await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).filter(text => /Allow|admin/.test(text))).toEqual([])
  expect((await labels()).filter(one => ['Allow once', 'Allow for this task', 'Deny'].includes(one))).toEqual([])
  // Its card is amber and counted once as what waits
  expect(boxes.some(one => one.props.width === 1 && one.props.backgroundColor === '#E5A50A')).toBe(true)
  expect((await list.findAll({ type: 'Text' })).filter(one => /waiting for you/.test(String(one.text ?? ''))).map(one => [one.text, one.props.color])).toEqual([['1 waiting for you', '#E5A50A']])
  // Said as a notification, and to the chat's model alone: the chat shows nothing of it (18 Nov: "garbage I don't need to read");
  // its Details tab has the same block
  expect(logged.some(line => line.includes('chmod 644 /etc/hosts'))).toBe(false)
  expect(appended.some(line => line.startsWith('undefined: From Claudopus: the task "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts.'))).toBe(true)
  expect(notified).toContain('Fix the hosts file has a question for you | Run an admin command on this Mac: chmod 644 /etc/hosts')
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await details.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined()
  expect(await gateButtons(details, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command'])
  await details.unmount()
  // The press itself ends the hold: the call returns with no second let pass (no wake, no move of the clock), and no wait was
  // started but the one in flight
  await pressed(list, 'gate-b1-0-once')
  expect((await call).result).toBe('ran')
  expect(counted.seen.sleeps).toBe(1)
  // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
  expect(admins.length).toBe(1)
  const [grant] = admins[0]?.grants ?? []
  expect(admins[0]?.grants.length).toBe(1)
  expect({ host: grant?.host, command: grant?.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' })
  expect(grant?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', `grant\n${grant?.id}\n${grant?.at}\nhere\nchmod 644 /etc/hosts`))
  expect(grants()).toEqual([])
  expect(files.has(ALLOWED)).toBe(false)
  // In the block's place: one grey line of what was pressed, and nothing green
  expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined()
  expect((await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE })))?.props.dimColor).toBe(true)
  expect((await gateTexts(list)).filter(one => one.startsWith('✓ '))).toEqual([ALLOWED_LINE])
  expect(await gateGreens(list)).toBe(0)
  expect(await gateButtons(list, 'b1-0')).toEqual([])
  // The line goes by itself a minute on
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ALLOWED_LINE })) ? undefined : true))).toBe(true)
  // Once is once: the same command again is held again
  const again = bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b2')).toBeDefined()
  expect(admins.length).toBe(1)
  await pressed(list, 'gate-b2-0-deny')
  expect((await again).deny).toContain('Refused by Sam')
  wake()
})

test("Don't allow refuses the call with a line that says the person refused it, and nothing runs or is granted", async ($, on) => {
  const { list, bash, held, grants, admins, wake } = await gated($, on)
  const call = bash('b1', `${ADMIN} m4 'rm -rf /Library/Caches/x'`)
  expect(await held('b1')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Run this as admin on m4?' })).toBeDefined()
  await pressed(list, 'gate-b1-0-deny')
  const r = await call
  expect(r.deny).toBe("Refused by Sam: Sam pressed Don't allow on this admin command, so it didn't run. Don't try to run it another way. Continue without it, or say what it is needed for and ask again.")
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Run this as admin on m4?' })).toBeUndefined()
  expect((await until(async () => list.find({ type: 'Text', text: REFUSED_LINE })))?.props.dimColor).toBe(true)
  expect(await gateGreens(list)).toBe(0)
  wake()
})

test('no way to the runner gets past the press: another spelling, a shell, a helper, and two things to allow in one call each wait', async ($, on) => {
  const { press, list, bash, held, admins, labels, grants, files } = await gated($, on)
  // A helper's call shows on the card of the work it helps
  await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' } as never)
  let n = 0
  for (const command of [`cd /plug/claudopus/bin && ./admin here 'id -u'`, `bash -c "/plug/claudopus/bin/../bin/admin here 'id -u'"`, `X=1 env ${ADMIN} here 'id -u'`, `eval "${ADMIN} here 'id -u'"`]) {
    const id = `s${(n += 1)}`
    const call = bash(id, command, n % 2 ? 'a2' : 'a1')
    expect(await held(id)).toBeDefined()
    expect(admins.length).toBe(0)
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // Two in one call, an admin command and then another or a release: the first allowed, the second asked in its turn; refused,
  // neither runs, the first grant is taken back, and the card says the refusal, never that anything was allowed
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-it')
  for (const [id, command, second, shown] of [
    ['t1', `${ADMIN} here 'id -u' && ${ADMIN} here 'whoami'`, 'gate-t1-1-deny', 'whoami'],
    ['t2', `${ADMIN} here 'id -u'; /plug/claudopus/bin/release`, 'gate-t2-r0-deny', 'Release fix-it to main?'],
  ] as const) {
    const both = bash(id, command)
    expect(await held(id)).toBeDefined()
    await press(`gate-${id}-0-once`)
    expect(await until(async () => keyed(list, second))).toBeDefined()
    expect(await list.find({ type: 'Text', text: shown })).toBeDefined()
    await press(second)
    expect((await both).deny).toContain('Refused by Sam')
    expect(admins.length).toBe(0)
    expect(grants()).toEqual([])
    expect(await labels()).not.toContain("Don't allow")
    expect(await until(async () => list.find({ type: 'Text', text: REFUSED_LINE }))).toBeDefined()
    expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeUndefined()
  }
  // The chat's own words to the task allow nothing: only the person's press, or their own typed answer, does
  const waiting = bash('w1', `${ADMIN} here 'id -u'`)
  expect(await held('w1')).toBeDefined()
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow' } as never)
  expect(await keyed(list, 'gate-w1-0-once')).toBeDefined()
  expect(admins.length).toBe(0)
  await press('gate-w1-0-deny')
  await waiting
})

test('Always allow this command keeps the exact command for its Mac, sealed; Config lists it with Remove, and a list work wrote itself allows nothing', async ($, on) => {
  const { press, list, bash, held, admins, files, tabs } = await gated($, on)
  const first = bash('b1', `${ADMIN} here 'softwareupdate -l'`)
  expect(await held('b1')).toBeDefined()
  await press('gate-b1-0-always')
  expect((await first).result).toBe('ran')
  const kept = JSON.parse(files.get(ALLOWED) ?? '{}') as Record<string, { command: string; seal: string }[]>
  expect(kept.here?.map(one => one.command)).toEqual(['softwareupdate -l'])
  expect(kept.here?.[0]?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', 'allow\nhere\nsoftwareupdate -l'))
  // The same command on the same Mac now runs without a press, with its own grant
  expect((await bash('b2', `${ADMIN} here 'softwareupdate -l'`)).result).toBe('ran')
  expect(admins.length).toBe(2)
  expect(admins[1]?.grants.map(one => one.command)).toEqual(['softwareupdate -l'])
  // Another command, or the same one on another Mac, still asks
  for (const [id, command] of [['b3', `${ADMIN} here 'softwareupdate -l -a'`], ['b4', `${ADMIN} m4 'softwareupdate -l'`]] as const) {
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    await press(`gate-${id}-0-deny`)
    await call
  }
  // An entry with no seal, or another entry's seal, as work could write into the file, allows nothing
  const forged = { here: [...(kept.here ?? []), { command: 'rm -rf /', seal: kept.here?.[0]?.seal ?? '', at: 1 }, { command: 'reboot', seal: '', at: 1 }] }
  // As if it got past the guards with the kept copy (a key F-007's way): the seals still allow nothing
  ownSet(files, 'admin-allowed.json', JSON.stringify(forged))
  for (const [id, command] of [['f1', `${ADMIN} here 'rm -rf /'`], ['f2', `${ADMIN} here 'reboot'`]] as const) {
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined()
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await moreShown(config)).toBe(true)
  expect(await config.find({ type: 'Text', text: /These run without asking, exactly as written and only on their Mac\./ })).toBeDefined()
  expect((await config.find({ type: 'Text', text: 'softwareupdate -l' }))?.props.mono).toBe(true)
  expect(await config.find({ type: 'Text', text: 'rm -rf /' })).toBeUndefined()
  expect(await config.find({ type: 'Text', text: /2 more in the file weren't added here, so they allow nothing/ })).toBeDefined()
  const before = files.get('keychain:gate')
  const stale = JSON.stringify(kept)
  await pressed(config, 'config-admin-remove-0')
  expect(await until(async () => (JSON.parse(files.get(ALLOWED) ?? '{"here":[1]}').here === undefined ? true : undefined))).toBe(true)
  expect(await until(() => config.find({ type: 'Text', text: /None is always allowed yet\./ }))).toBeDefined()
  // Removing made a new key: the old entry put back, seal and all, allows nothing
  expect(files.get('keychain:gate')).not.toBe(before)
  files.set(ALLOWED, stale)
  const again = bash('b5', `${ADMIN} here 'softwareupdate -l'`)
  expect(await held('b5')).toBeDefined()
  await press('gate-b5-0-deny')
  await again
})

test('work never reads or writes the allowed list, the grants or the key that seals them', async ($, on) => {
  const { press, bash, files } = await gated($, on)
  for (const command of [
    `echo '{"here":[{"command":"reboot","seal":"x"}]}' > ~/.claude/claudopus/admin-allowed.json`,
    `cat ${MEMORY}/admin-allowed.json`,
    `cp /tmp/g.json ${MEMORY}/admin-grants/g.json`,
    'security add-generic-password -U -s claudopus-admin-gate -a seal -w abc',
    'security delete-generic-password -s claudopus-admin-gate -a seal',
  ])
    expect((await bash(`t${command.length}`, command)).deny).toContain('Only Sam adds to them')
  for (const tool of ['Write', 'Edit'])
    for (const path of [ALLOWED, `${GRANTS}g.json`]) expect((await $.tool.call({ tool, tool_use_id: `w-${tool}-${path.length}`, file_path: path, content: '{}', agentId: 'a1' } as never)).deny).toContain('Only Sam adds to them')
  expect(files.has(ALLOWED)).toBe(false)
  // The memory folder's other files are work's to write as before
  expect((await $.tool.call({ tool: 'Write', tool_use_id: 'w9', file_path: `${MEMORY}/streams/x.md`, content: 'x', agentId: 'a1' } as never)).deny).toBeUndefined()
})

test('asked once per piece of work: one Allow covers that work and its helpers until it ends, and no other work', async ($, on) => {
  const { press, list, bash, held, admins, files, tabs } = await gated($, on)
  // The setting is chosen in Config, which seals it
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined()
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await moreShown(config)).toBe(true)
  expect(await config.find({ type: 'Text', text: 'Admin commands' })).toBeDefined()
  await config.select({ key: 'config-admin-mode-pick', value: 'work' })
  const sealedAs = await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}') as { admin?: string; adminSealed?: string }).adminSealed)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal(files.get('keychain:gate') ?? '', 'mode\nwork') })
  expect(sealedAs).toBeDefined()
  await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' } as never)
  await $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Update the other Mac', prompt: 'update the other Mac' } as never)
  const first = bash('b1', `${ADMIN} here 'id -u'`)
  expect(await held('b1')).toBeDefined()
  // The same three buttons, and under the question what this Allow covers
  expect(await gateButtons(list, 'b1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command'])
  expect((await list.findAll({ type: 'Markdown' })).map(one => one.props.text)).toContain("Allow also covers this task's next admin commands.")
  await press('gate-b1-0-once')
  expect((await first).result).toBe('ran')
  // Its later commands, and its helper's, run without another press, each with its own grant
  expect((await bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)).result).toBe('ran')
  expect((await bash('b3', `${ADMIN} m4 'whoami'`, 'a2')).result).toBe('ran')
  expect(admins.map(one => one.grants.map(grant => grant.command))).toEqual([['id -u'], ['chmod 644 /etc/hosts'], ['whoami']])
  // Another piece of work is asked for itself
  const other = bash('b4', `${ADMIN} here 'id -u'`, 'a3')
  expect(await held('b4')).toBeDefined()
  await press('gate-b4-0-deny')
  expect((await other).deny).toContain('Refused by Sam')
  // Ended and started again, it asks again
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  const back = bash('b5', `${ADMIN} here 'id -u'`)
  expect(await held('b5')).toBeDefined()
  await press('gate-b5-0-deny')
  await back
  expect(admins.length).toBe(3)
})

for (const admin of ['never', 'work'])
  test(`"${admin}" written into config.json by anything but Config counts for nothing: every command still asks`, async ($, on) => {
    const { press, bash, held, admins, files } = await gated($, on, { admin, adminSealed: fakeSeal('kept-key', `mode\n${admin}`).replace(/^./, 'z') })
    files.set('keychain:gate', 'kept-key')
    const call = bash('b1', `${ADMIN} here 'id -u'`)
    expect(await held('b1')).toBeDefined()
    expect(admins.length).toBe(0)
    await press('gate-b1-0-deny')
    await call
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
    expect(await moreShown(config)).toBe(true)
    expect(await config.find({ type: 'Text', text: new RegExp(`Your settings file says "${admin}", but you didn't choose it here, so every command asks`) })).toBeDefined()
  })

test('never asked, as Config sealed it: the call goes through as it was made, with no hold, no grant and nothing on the card', async ($, on) => {
  const { press, list, bash, admins, files, grants, logged, notified } = await gated($, on, { admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }, { env: {} })
  files.set('keychain:gate', 'kept-key')
  const before = [...files.keys()].filter(path => !path.endsWith('log.md')).sort()
  const r = await bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(r.result).toBe('ran')
  expect(r.deny).toBeUndefined()
  expect(admins).toEqual([{ command: `${ADMIN} here 'chmod 644 /etc/hosts'`, grants: [] }])
  expect(grants()).toEqual([])
  expect(files.has(ALLOWED)).toBe(false)
  expect([...files.keys()].filter(path => !path.endsWith('log.md') && !path.includes('/live/')).sort()).toEqual(before.filter(path => !path.includes('/live/')))
  expect(logged.some(line => line.includes('admin command'))).toBe(false)
  expect(notified.some(line => line.includes('admin command'))).toBe(false)
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined()
  // Config's Reset puts the asking back, and makes a new key
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  await moreShown(config)
  await pressed(config, 'config-admin-mode-back')
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').admin === undefined ? true : undefined))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam' })
  expect(files.get('keychain:gate')).not.toBe('kept-key')
})

test('with no panel to ask on, an admin command is refused, never run unasked', async ($, on) => {
  const { press, bash, admins } = await gated($, on, {}, { headless: true })
  expect((await bash('b1', `${ADMIN} here 'id -u'`)).deny).toContain('this chat has no panel open')
  expect(admins).toEqual([])
})

test('F-008 F-009 · no admin password is kept: Config has no setting to keep one, every one an earlier version kept is forgotten as the mod loads, and admin commands on another Mac still ask on their card', async ($, on) => {
  const { press, bash, held, admins, files } = await gated($, on, { adminPassword: 'keep' })
  expect(await until(async () => files.get('keychain:admin-forgotten'))).toBe('yes')
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').adminPassword === undefined ? true : undefined))).toBe(true)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await moreShown(config)).toBe(true)
  expect(await config.find({ type: 'Text', text: 'Admin password' })).toBeUndefined()
  expect(await config.find({ type: 'Text', text: /each asks for your Mac password, which Claudopus never saves/ })).toBeDefined()
  // Another Mac's admin command is held on its card as this Mac's is: its password is asked when it runs
  const call = bash('b2', `${ADMIN} m4 'id -u'`)
  expect(await held('b2')).toBeDefined()
  await press('gate-b2-0-once')
  expect((await call).result).toBe('ran')
  expect(admins.length).toBe(1)
})

test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work, and its press is said there in one grey line", async ($, on) => {
  const w = world(on)
  w.files.set('keychain:gate', 'kept-key')
  w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  for (const id of ['c1', 'c2']) {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: `${ADMIN} here 'id -u'` } as never)
    expect(await until(async () => keyed(list, `gate-${id}-0-deny`))).toBeDefined()
    // Whose it is stands beside its kind, as it is on no task's card
    expect((await list.find({ type: 'Text', text: 'Permission · This chat' }))?.props.dimColor).toBe(true)
    expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined()
    // No piece of work to allow it for: the chat's thread never ends, so it is asked each time, and Allow covers this one alone
    expect(await gateButtons(list, `${id}-0`)).toEqual(['Allow', "Don't allow", 'Always allow this command'])
    expect((await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).filter(text => text.includes('also covers'))).toEqual([])
    // The press ends the hold by itself
    await pressed(list, `gate-${id}-0-once`)
    expect((await call).result).toBe('ran')
    expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeUndefined()
    expect((await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE })))?.props.dimColor).toBe(true)
    expect(await gateGreens(list)).toBe(0)
  }
  expect(w.admins.length).toBe(2)
  w.wake()
})

test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at }], startedAt: at - 60_000, endedAt: 0, status: 'working' }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'softwareupdate -i -a' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeDefined()
  expect((await list.find({ type: 'Text', text: 'Allow it on its card in its own chat.' }))?.props.dimColor).toBe(true)
  expect((await list.findAll({ type: 'Button' })).some(one => ['Allow', 'Always allow this command', "Don't allow"].includes(String(one.props.label)) || (one.key ?? '').startsWith('gate-'))).toBe(false)
})

test('a release nobody pressed for is asked, once, for its own branch, with Allow and Don\'t allow alone, saying what it puts on main: the 15 Nov run-progress-rows release, its output sent to a log, asked twice, first for a branch called ">"; and the 19 Nov release that said only its branch and folder', async ($, on) => {
  const { list, files, grants, holding, wake } = await gated($, on)
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-it')
  // What it says under the question: the task's own line (-m), else that it gave none, then the commits main lacks, then the counts
  const commits = '- Fix the hosts file\n- Test the hosts file'
  for (const [id, tail, log, about] of [
    ['rl1', ' -m "Make the server start again after a reboot" > /tmp/release.log 2>&1', 'Fix the hosts file\nTest the hosts file\n', `Make the server start again after a reboot\n\n${commits}\n\n2 commits · 3 changed files · branch fix-it · from /repo/wt`],
    ['rl2', ' 2>/tmp/release.log', 'Fix the hosts file\nTest the hosts file\n', `Claude gave no reason for it. Its commits say:\n\n${commits}\n\n2 commits · 3 changed files · branch fix-it · from /repo/wt`],
    ['rl3', '>/tmp/release.log', '', 'Branch fix-it · from /repo/wt'],
  ] as const) {
    files.set('git:log', log)
    files.set('git:diff', log ? 'etc/hosts\ntest/hosts.test.ts\nREADME.md\n' : '')
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold x${id}; /plug/claudopus/bin/release${tail}` } as never) as Promise<{ deny?: string; result?: unknown }>
    expect(await until(async () => keyed(list, `gate-${id}-r0-once`))).toBeDefined()
    // Said in plain words: what is released in the question, what it puts on main under it, and no command row
    const drawn = await gateTexts(list)
    expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 2)).toEqual(['Permission', 'Release fix-it to main?'])
    expect((await list.find({ type: 'Text', text: 'Release fix-it to main?' }))?.props.color).toBe('#E5A50A')
    const under = (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? ''))
    expect(under).toContain(about)
    expect([...drawn, ...under].some(one => /^>|> from/.test(one))).toBe(false)
    expect(drawn.some(one => one === 'fix-it from /repo/wt')).toBe(false)
    // A release is asked each time: nothing to always allow
    expect(await gateButtons(list, `${id}-r0`)).toEqual(['Allow', "Don't allow"])
    await pressed(list, `gate-${id}-r0-once`)
    const granted = await until(async () => (grants().length ? grants() : undefined))
    expect(granted?.map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-it']])
    expect(await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE }))).toBeDefined()
    ;(await until(async () => holding.get(`x${id}; /plug/claudopus/bin/release${tail}`)))?.('released')
    expect((await call).deny).toBeUndefined()
  }
  wake()
})

test("the press on a task's go-ahead for a release lets that task's next release of that folder through with no block, once: a second run, another folder and another task are asked", async ($, on) => {
  const { list, files, grants, holding, appended, resumed, wake, press } = await gated($, on)
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-it')
  files.set('/repo/wt/.release', 'main\n')
  await $.agent.spawn({ ...spawn, description: 'Tidy the logs', prompt: 'tidy the logs' } as never)
  let asks = 0
  const goAhead = async () => {
    const text = `Release the hosts fix, round ${(asks += 1)}?`
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k${asks}`, agentId: 'a1', text, details: 'It changes one line.', choices: ['Release it'], release: '/repo/wt' } as never)
    const button = await until(async () => (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Release it'))
    await list.press({ key: button?.key ?? '' })
    expect(await until(async () => [...appended, ...resumed].find(line => line.includes('pressed "Release it"') && line.includes(text)))).toBeDefined()
  }
  const release = (id: string, agentId: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command: `hold x${id}; /plug/claudopus/bin/release` } as never) as Promise<{ deny?: string }>
  // Let through: its grant is made with nothing asked
  const through = async (id: string) => {
    const call = release(id, 'a1')
    const run = await until(async () => holding.get(`x${id}; /plug/claudopus/bin/release`))
    expect(run).toBeDefined()
    expect(grants().map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-it']])
    expect(await keyed(list, `gate-${id}-r0-once`)).toBeUndefined()
    expect(await list.find({ type: 'Text', text: 'Release fix-it to main?' })).toBeUndefined()
    run?.('released')
    expect((await call).deny).toBeUndefined()
  }
  // Asked on its card, as a release nobody pressed for, and refused there
  const asked = async (id: string, agentId = 'a1') => {
    const call = release(id, agentId)
    expect(await until(async () => keyed(list, `gate-${id}-r0-deny`))).toBeDefined()
    expect(await gateButtons(list, `${id}-r0`)).toEqual(['Allow', "Don't allow"])
    expect(grants()).toEqual([])
    await press(`gate-${id}-r0-deny`)
    expect((await call).deny).toBe("Refused by Sam: Sam pressed Don't allow on this release, so nothing was released. Don't try to release it another way. Continue without it, or say what it is needed for and ask again.")
  }
  await goAhead()
  await through('r1')
  // Once: the press allowed one run
  await asked('r2')
  // A new press, and still only that folder's release by that task: another worktree's and another task's are asked, and neither
  // uses the press up
  await goAhead()
  files.set('git:top', '/repo/other')
  await asked('r3')
  files.set('git:top', '/repo/wt')
  await asked('r4', 'a2')
  await through('r5')
  await asked('r6')
  wake()
})

test("a permission on a task's card is answered in words before any press: the held call ends with the words for the task, the block stays with its buttons, shows the words and the task's answer in place of a question of its own, and only Allow lets the very same command through, once; Don't allow after words refuses it", async ($, on) => {
  const { list, bash, held, grants, press, appended, resumed, files, holding, wake } = await gated($, on)
  const told = (words: string) => until(async () => [...appended, ...resumed].find(line => line.startsWith('a1: ') && line.includes(words)))
  const words = async (id: string, text: string) => {
    const field = await until(async () => (await list.findAll({ type: 'Input' })).find(one => (one.key ?? '').startsWith(`gate-${id}-words-field-`)))
    await list.input({ key: field?.key ?? '', text })
    wake()
  }
  const call = bash('w1', `${ADMIN} here 'id -u'`) as Promise<{ deny?: string }>
  await held('w1')
  await words('w1-0', 'What is this for?')
  const said = (await call).deny ?? ''
  expect(said).toContain('neither allowed nor refused it, and wrote to you about it instead, in their own words: “What is this for?”')
  expect(said).toContain("Don't run it again until then")
  expect(grants()).toEqual([])
  // While the task answers, the card folds the permission to the one grey line of the words, with nothing to press (19 Nov, the
  // person: "it didn't remove the buttons that I already answered"), and the card waits on nobody
  const answeredLines = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => one.startsWith('✓ You answered'))
  expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })).toBeUndefined()
  expect(await answeredLines()).toEqual(['✓ You answered “What is this for?”'])
  expect(await list.find({ type: 'Text', text: '1 waiting for you' })).toBeUndefined()
  const answer = async (id: string, text: string, details?: string) => {
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text, ...(details ? { details } : {}) } as never)
    expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? true : undefined))).toBe(true)
  }
  // The task's answer, given with no buttons, goes inside the permission under the words, never as a question of its own, and
  // brings back its buttons, with no grey line of the words beside the block that shows them
  await answer('k1', 'It checks which user the server runs as.', 'It changes nothing.')
  expect(await until(async () => (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? '')).find(one => one.includes('**The answer:**')))).toBe('**You asked:** What is this for?\n\n**The answer:** It checks which user the server runs as.\n\nIt changes nothing.')
  expect(await gateButtons(list, 'w1-0')).toEqual(['Allow', "Don't allow", 'Always allow this command'])
  expect(await answeredLines()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Question' })).toBeUndefined()
  // More words go to the task as a message, and fold it again until the task answers them
  await words('w1-0', 'And why now?')
  expect(await told('wrote to you again about the admin command that waits on your card')).toContain('“And why now?”')
  expect(await until(async () => ((await gateButtons(list, 'w1-0')).length ? undefined : true))).toBe(true)
  await answer('k2', 'The server moves to a new user today.')
  // Allow: the task is told to run it again, and that very command goes through with nothing asked, once
  await press('gate-w1-0-once')
  expect(await told('pressed Allow on the admin command that waited on your card')).toBeDefined()
  expect(await until(async () => ((await keyed(list, 'gate-w1-0-once')) ? undefined : true))).toBe(true)
  const second = bash('w2', `hold xw2; ${ADMIN} here 'id -u'`) as Promise<{ deny?: string }>
  const run = await until(async () => holding.get(`xw2; ${ADMIN} here 'id -u'`))
  expect(grants()).toHaveLength(1)
  expect(await keyed(list, 'gate-w2-0-once')).toBeUndefined()
  run?.('ran')
  expect((await second).deny).toBeUndefined()
  const third = bash('w3', `${ADMIN} here 'id -u'`) as Promise<{ deny?: string }>
  await held('w3')
  await press('gate-w3-0-deny')
  expect((await third).deny).toContain("pressed Don't allow")
  // A release answered in words, then refused: the task hears the refusal, and its next run is asked again
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-it')
  const release = $.tool.call({ tool: 'Bash', tool_use_id: 'w4', agentId: 'a1', command: 'hold xw4; /plug/claudopus/bin/release' } as never) as Promise<{ deny?: string }>
  expect(await until(async () => keyed(list, 'gate-w4-r0-once'))).toBeDefined()
  await words('w4-r0', 'What does it fix?')
  expect((await release).deny).toContain('This release did not run yet')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'It fixes the hosts file.' } as never)
  await until(async () => keyed(list, 'gate-w4-r0-deny'))
  await press('gate-w4-r0-deny')
  expect(await told("pressed Don't allow on this release")).toBeDefined()
  expect(await until(async () => ((await keyed(list, 'gate-w4-r0-deny')) ? undefined : true))).toBe(true)
  const asked = $.tool.call({ tool: 'Bash', tool_use_id: 'w5', agentId: 'a1', command: 'hold xw5; /plug/claudopus/bin/release' } as never) as Promise<{ deny?: string }>
  expect(await until(async () => keyed(list, 'gate-w5-r0-once'))).toBeDefined()
  await press('gate-w5-r0-deny')
  expect((await asked).deny).toContain("pressed Don't allow")
})

// A long list of another chat's running work, two of whose cards wait on a gate and one on an ask: what the 15 Nov panel drew below
// the fold, where the person had to scroll to find its Allow
const longList = (at: number, gates: Record<string, number>, asks: Record<string, number> = {}) =>
  JSON.stringify({
    chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at,
    cards: ['one', 'two', 'three', 'four', 'five', 'six'].map((name, n) => ({
      id: `w${n + 1}`, parentId: '', isFork: false, tokens: 0, title: `Card ${name}`, words: name, items: [], entries: [], answer: '', startedAt: at - 600_000 + n * 60_000, endedAt: 0, status: 'working',
      ...(gates[`w${n + 1}`] ? { admins: [{ id: `g${n + 1}`, host: 'here', command: `run step ${name}`, at: gates[`w${n + 1}`] }] } : {}),
      ...(asks[`w${n + 1}`] ? { ask: { text: `Which way for ${name}?`, at: asks[`w${n + 1}`], choices: ['Left', 'Right'] } } : {}),
    })),
  })
const textOrder = async (pane: { findAll: (q: { type: string }) => Promise<{ text?: unknown }[]> }) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))

test('a work that waits for a press comes to the top whole, its amber block in it, the oldest first with the cards that asked; answered, it goes at once to the place it began in, under all that still waits', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }, { w4: at - 1500 }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
  const texts = await textOrder(list)
  const first = (text: string) => texts.indexOf(text)
  // Oldest first, as they came: the older gate's card, the card that asked, the card whose gate came last; then the rest in the
  // order they began, so what comes later goes under what is already there
  expect(first('Card five')).toBeLessThan(first('Card four'))
  expect(first('Card four')).toBeLessThan(first('Card six'))
  expect(first('Card six')).toBeLessThan(first('Card one'))
  // Each gate is in its own card, right under its title, never apart from it
  expect(first('Card five')).toBeLessThan(first('run step five'))
  expect(first('run step five')).toBeLessThan(first('Card four'))
  expect(first('Card six')).toBeLessThan(first('run step six'))
  expect(first('run step six')).toBeLessThan(first('Card one'))
  const rest = (all: string[]) => all.filter(one => /^Card (one|two|three)$/.test(one))
  expect(rest(texts)).toEqual(['Card one', 'Card two', 'Card three'])
  // The older gate is answered (in its own chat) while the others still wait: its card goes at once to the place it began in among
  // the working, never above what waits
  files.set(`${MEMORY}/live/chat-b.json`, longList(at + 6000, { w6: at - 1000 }, { w4: at - 1500 }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'run step five' })) ? undefined : true))).toBe(true)
  const after = await textOrder(list)
  expect(after.indexOf('Card four')).toBeLessThan(after.indexOf('Card six'))
  expect(after.indexOf('Card six')).toBeLessThan(after.indexOf('Card one'))
  expect(after.filter(one => /^Card (one|two|three|five)$/.test(one))).toEqual(['Card one', 'Card two', 'Card three', 'Card five'])
  // Once nothing waits, the cards go back to where they began
  files.set(`${MEMORY}/live/chat-b.json`, longList(at + 12_000, {}, {}))
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'run step six' })) ? undefined : true))).toBe(true)
  expect(await until(async () => ((await textOrder(list)).filter(one => /^Card /.test(one)).join('|') === 'Card one|Card two|Card three|Card four|Card five|Card six' ? true : undefined))).toBe(true)
})

test('a gate answered on its card says what was pressed in that same card, in one grey line with no box of its own, while the card stays at the top', async ($, on) => {
  const { press, bash, held, list } = await gated($, on)
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b1')).toBeDefined()
  await press('gate-b1-0-once')
  await call
  expect(await until(async () => list.find({ type: 'Text', text: ALLOWED_LINE }))).toBeDefined()
  expect(((await list.findAll({ type: 'Box' })) as { key?: string; props: Record<string, unknown> }[]).filter(one => one.key === 'outline-top' || (one.key ?? '').startsWith('done-gate-'))).toEqual([])
  const drawn = await textOrder(list)
  // In its card, under the work's title, not a line of its own at the top
  expect(drawn.indexOf('Fix the hosts file')).toBeLessThan(drawn.indexOf(ALLOWED_LINE))
  expect(drawn.filter(one => one === ALLOWED_LINE).length).toBe(1)
  // Another work's gate comes in while the grey line is still said: its card, which waits, is drawn above the answered one
  await $.agent.spawn({ ...spawn, description: 'Tidy the logs', prompt: 'tidy the logs' } as never)
  const call2 = bash('b2', `${ADMIN} here 'id -u'`, 'a2')
  expect(await held('b2')).toBeDefined()
  const now = await textOrder(list)
  expect(now.indexOf('Tidy the logs')).toBeGreaterThan(-1)
  expect(now.indexOf('Tidy the logs')).toBeLessThan(now.indexOf('Fix the hosts file'))
  expect(now.indexOf(ALLOWED_LINE)).toBeGreaterThan(now.indexOf('Tidy the logs'))
  await press('gate-b2-0-deny')
  await call2
})

test('on the desktop the line above the prompt says how many wait and what the first asks, scrolled or not, and Show takes a scrolled list to the top; in the terminal it comes only once scrolled', async ($, on) => {
  const { files, clock } = world(on, { panes: ['claudopus'] })
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }))
  await clock.advance(5000)
  // The first is the card whose gate came first: w5's
  const MARK = /^● 2 waiting for you · /
  const show = async (band: { findAll: (q: { type: string }) => Promise<{ props: Record<string, unknown> }[]> }) => (await band.findAll({ type: 'Button' })).some(one => one.props.label === 'Show')
  for (const surface of ['desktop', 'terminal']) {
    const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface } as never)
    expect(await until(async () => down.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
    const band = await $.ui.mount({ ...BAND, surface } as never)
    const mark = await until(async () => band.find({ type: 'Text', text: MARK }))
    expect(mark?.props.color).toBe('#E5A50A')
    expect(await show(band)).toBe(true)
    await band.unmount()
    await down.unmount()
    const top = await $.ui.mount({ ...LIST, surface } as never)
    expect(await until(async () => top.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
    const still = await $.ui.mount({ ...BAND, surface } as never)
    if (surface === 'desktop') expect(await until(async () => still.find({ type: 'Text', text: MARK }))).toBeDefined()
    else expect(await still.find({ type: 'Text', text: MARK })).toBeUndefined()
    expect(await show(still)).toBe(false)
    await still.unmount()
    await top.unmount()
  }
})

test("in the terminal, an ask that comes in while one is typed in never takes the keys from it; the oldest ask is drawn first", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two things', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  const focused = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => one.props.autoFocus).map(one => (one.key ?? '').split('-reply')[0])
  expect(await until(async () => ((await focused()).length ? focused() : undefined))).toEqual([expect.stringContaining('a1')])
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which ear first?', choices: ['Left', 'Right'] } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which ear first?' }))).toBeDefined()
  const texts = await textOrder(list)
  expect(texts.indexOf('May I delete the old repo?')).toBeLessThan(texts.indexOf('Which ear first?'))
  expect(await focused()).toEqual([expect.stringContaining('a1')])
})

test('the line above the prompt never points into a list that is not open', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }))
  await clock.advance(5000)
  const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface: 'desktop' } as never)
  expect(await until(async () => down.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
  await down.unmount()
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await textOrder(band)).some(one => one.includes('waiting for you'))).toBe(false)
})

test('in the terminal, a password box that comes while a reply is being typed leaves the keys with the reply', async ($, on) => {
  const w = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two things', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  const inputs = async () => (await list.findAll({ type: 'Input' } as never)).map(one => ({ key: one.key ?? '', focus: Boolean(one.props.autoFocus) }))
  const reply = await until(async () => (await inputs()).find(one => one.focus))
  await list.input({ key: reply?.key ?? '', text: 'Not y', kind: 'change' } as never)
  void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: `hold /plug/claudopus/bin/admin m4 'id -u'` } as never))
  const id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98'
  w.files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await w.clock.advance(1000)
  expect(await until(async () => ((await inputs()).some(one => one.key.startsWith('box-')) ? true : undefined))).toBe(true)
  expect((await inputs()).filter(one => one.focus).map(one => one.key)).toEqual([reply?.key])
  await w.settle()
})

test('in the terminal, an ask that comes while a password is being typed leaves the keys with the password box', async ($, on) => {
  const w = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two things', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: `hold /plug/claudopus/bin/admin m4 'id -u'` } as never))
  const id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98'
  w.files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await w.clock.advance(1000)
  const inputs = async () => (await list.findAll({ type: 'Input' } as never)).map(one => ({ key: one.key ?? '', focus: Boolean(one.props.autoFocus) }))
  const box = await until(async () => (await inputs()).find(one => one.key.startsWith('box-')))
  await list.input({ key: box?.key ?? '', text: 'hunt', kind: 'change' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] } as never)
  expect(await until(async () => ((await inputs()).some(one => one.key.startsWith('ask-')) ? true : undefined))).toBe(true)
  expect((await inputs()).filter(one => one.focus).map(one => one.key)).toEqual([box?.key])
  await w.settle()
})

// Five pieces of work, the fourth asking: the 15 Nov "Release it" on an ended ask took the card from the top to the very end of a long
// panel, which read as the panel jumping to the bottom
const askingFourth = async ($: Parameters<TestBody>[0], on: On, choices?: string[], ended = false) => {
  const w = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'five things', wait: false, origin: composer })
  for (const n of [1, 2, 3, 4, 5]) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release piece four?', ...(choices ? { choices } : {}) } as never)
  // (ended: it hands in its result with the question still open, which is what ends a task)
  if (ended) await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a4', agentId: 'a4', message: 'Waits for your Release it.' } as never)
  if (ended) await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a4', reason: 'answer', agentId: 'a4' } as never)
  await w.clock.advance(5000)
  const order = async () => (await textOrder(list)).filter(one => /^Piece \d$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  expect(await until(async () => ((await order())[0] === 'Piece 4' ? true : undefined))).toBe(true)
  return { ...w, list, order }
}

test('Release it on an ended ask takes its card at once to the place its work began in, saying the answer, never the end', async ($, on) => {
  const { list, order, clock, resumed } = await askingFourth($, on, ['Release it'], true)
  const release = ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Release it')
  await list.press({ key: release?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a4: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => list.find({ type: 'Text', text: /You answered “Release it”/ } as never))).toBeDefined()
  expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
  // and so a minute on
  await clock.advance(65_000)
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
})

const answeredStays = async ($: Parameters<TestBody>[0], on: On, how: 'press' | 'reply') => {
  const { list, order, clock } = await askingFourth($, on, ['Go on'])
  if (how === 'press') await list.press({ key: ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Go on')?.key ?? '' })
  else await list.input({ key: ((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).find(one => /-reply-/.test(one.key ?? ''))?.key ?? '', text: 'It is pasted' })
  expect(await until(async () => list.find({ type: 'Text', text: /You answered/ } as never))).toBeDefined()
  expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
  // It says the answer there for a minute
  await clock.advance(30_000)
  expect(await list.find({ type: 'Text', text: /You answered/ } as never)).toBeDefined()
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
}
test("a press on an ask's own button takes the card at once to its own place among the working, saying the answer", async ($, on) => answeredStays($, on, 'press'))
test('an answer sent from an ask\'s box takes the card at once to its own place among the working, saying the answer', async ($, on) => answeredStays($, on, 'reply'))
test('answering one of two asks at the top takes the answered card at once to its own place among the working, under the one still waiting and under what was delivered; asked again, it goes under what already waits', async ($, on) => {
  const { list, order, clock } = await askingFourth($, on, ['Go on'])
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release piece two?', choices: ['Release it'] } as never)
  await clock.advance(5000)
  // The newer ask goes under the older one, never above it
  expect(await until(async () => ((await order())[1] === 'Piece 2' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5'])
  // Piece 5 hands in its result: delivered, blue, it is under what waits and over what works
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a5', agentId: 'a5', message: 'Done.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a5', reason: 'answer', agentId: 'a5' } as never)
  await clock.advance(5000)
  expect(await until(async () => ((await order())[2] === 'Piece 5' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 4', 'Piece 2', 'Piece 5', 'Piece 1', 'Piece 3'])
  // The older ask, first at the top, is answered: at once the one still waiting is first and the answered card is in its own place
  // among the working, saying the answer while it holds the space its question took, and under the line its work then writes
  await list.press({ key: ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Go on')?.key ?? '' })
  expect(await until(async () => list.find({ type: 'Text', text: /You answered “Go on”/ } as never))).toBeDefined()
  expect(await until(async () => ((await order())[0] === 'Piece 2' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4'])
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n4', agentId: 'a4', text: 'Now doing the next part' } as never)
  await clock.advance(5000)
  expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4'])
  expect(await list.find({ type: 'Text', text: /You answered “Go on”/ } as never)).toBeDefined()
  await clock.advance(65_000)
  expect(await order()).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4'])
  // It asks again: new, it goes under what already waits
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a4', text: 'And the next part?', choices: ['Yes', 'No'] } as never)
  await clock.advance(1000)
  expect(await until(async () => ((await order())[1] === 'Piece 4' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 2', 'Piece 4', 'Piece 5', 'Piece 1', 'Piece 3'])
  // Both are answered: both go back to where they began
  const labelled = async (label: string) => ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === label)?.key ?? ''
  await list.press({ key: await labelled('Release it') })
  // (once the other has stood still for a moment: a press on a card that just moved is held back)
  await clock.advance(2000)
  await list.press({ key: await labelled('Yes') })
  await clock.advance(1000)
  expect(await until(async () => ((await order())[0] === 'Piece 5' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 5', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 4'])
})

// 15 Nov: Allow was pressed and the amber block with its buttons stayed up to a second, until the gate's wait (a one-second
// sleep the engine ran) read the press. Now the block goes in the press's own drawing, and the press itself ends the wait
test("a press on a gate takes its block away in the press's own drawing and leaves one grey line of what was pressed, with no buttons left and nothing green; the held call then ends with no second let pass", async ($, on) => {
  const counted = countingSleeps(on)
  const w = await gated($, counted.on)
  w.files.set('git:top', '/repo/wt')
  w.files.set('git:branch', 'fix-it')
  for (const [id, command, button, question, said, ends] of [
    ['p1', `${ADMIN} here 'chmod 644 /etc/hosts'`, '0-once', 'Run this as admin on this Mac?', ALLOWED_LINE, 'ran'],
    ['p2', `${ADMIN} here 'chmod 600 /etc/hosts'`, '0-always', 'Run this as admin on this Mac?', '✓ You pressed “Always allow this command”', 'ran'],
    ['p3', `${ADMIN} here 'chmod 755 /etc/hosts'`, '0-deny', 'Run this as admin on this Mac?', REFUSED_LINE, 'refused'],
    ['p4', 'hold xp4; /plug/claudopus/bin/release', 'r0-once', 'Release fix-it to main?', ALLOWED_LINE, 'held'],
    ['p5', 'hold xp5; /plug/claudopus/bin/release', 'r0-deny', 'Release fix-it to main?', REFUSED_LINE, 'refused'],
  ] as const) {
    const before = counted.seen.sleeps
    const call = w.bash(id, command)
    const base = `gate-${id}-${button}`
    expect(await until(async () => keyed(w.list, base))).toBeDefined()
    expect(await w.list.find({ type: 'Text', text: question })).toBeDefined()
    // Pressed: the very next look at the panel has the line, with nothing left to press and nothing that still asks
    await pressed(w.list, base)
    expect((await w.list.find({ type: 'Text', text: said }))?.props.dimColor).toBe(true)
    expect((await w.list.findAll({ type: 'Button' })).some(b => (b.key ?? '').startsWith(`gate-${id}-`))).toBe(false)
    expect(await w.list.find({ type: 'Text', text: question })).toBeUndefined()
    expect(await w.list.find({ type: 'Text', text: 'Permission' })).toBeUndefined()
    expect(await gateGreens(w.list)).toBe(0)
    if (ends === 'held') (await until(async () => w.holding.get(`x${id}; /plug/claudopus/bin/release`)))?.('released')
    const r = (await call) as { deny?: string; result?: unknown }
    if (ends === 'refused') expect(r.deny).toContain('Refused by Sam')
    else expect(r.deny).toBeUndefined()
    // One wait was in flight while it was held, and the press started no other
    expect(counted.seen.sleeps - before).toBe(1)
    // The one line of the card is of the last press alone
    expect((await gateTexts(w.list)).filter(one => one.startsWith('✓ '))).toEqual([said])
  }
  w.wake()
})

test('two presses on a gate send one answer: the first, as drawn', async ($, on) => {
  const { list, bash, held, wake, admins } = await gated($, on)
  const call = bash('d1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('d1')).toBeDefined()
  // Both keys as the panel last drew them, pressed one after the other, as a double click on a drawing a moment old does
  const once = (await keyed(list, 'gate-d1-0-once'))?.key ?? ''
  const deny = (await keyed(list, 'gate-d1-0-deny'))?.key ?? ''
  await list.press({ key: once })
  expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeDefined()
  await list.press({ key: deny }).catch(() => undefined)
  // The second press changed nothing: the card still says what the first one did
  expect(await list.find({ type: 'Text', text: ALLOWED_LINE })).toBeDefined()
  await list.press({ key: once }).catch(() => undefined)
  const r = (await call) as { deny?: string }
  expect(r.deny).toBeUndefined()
  expect(admins.length).toBe(1)
  expect((await gateTexts(list)).filter(one => one.startsWith('✓ '))).toEqual([ALLOWED_LINE])
  wake()
})

test('a gate allowed but not let through says so in its grey line, never a bare "Allow"', async ($, on) => {
  const w = await gated($, on)
  w.files.set('git:top', '/repo/wt')
  w.files.set('git:branch', 'fix-it')
  // The seal for the grant cannot be made, as a keychain that refuses: nothing runs
  for (const [id, command, button, said] of [
    ['f1', `${ADMIN} here 'chmod 644 /etc/hosts'`, 'gate-f1-0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so it didn't run"],
    ['f2', '/plug/claudopus/bin/release', 'gate-f2-r0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so nothing was released"],
  ] as const) {
    w.files.delete('keychain:refused')
    const call = w.bash(id, command)
    expect(await until(async () => keyed(w.list, button))).toBeDefined()
    w.files.set('keychain:refused', '1')
    await w.press(button)
    const r = (await call) as { deny?: string }
    expect(r.deny).toContain('could not secure what was allowed')
    expect(w.grants()).toEqual([])
    expect(w.admins).toEqual([])
    expect((await until(async () => w.list.find({ type: 'Text', text: said })))?.props.dimColor).toBe(true)
    // (the line whole: nothing on the card says only that it was allowed)
    expect((await gateTexts(w.list)).filter(one => one.startsWith('✓ '))).toEqual([said])
    expect(await gateGreens(w.list)).toBe(0)
  }
})

test("a short answer the person types in the chat is their press on the newest block it fits, or on the task it names: \"allow\" lets a held admin command run, \"release it\" is Release it on a go-ahead; a task's message, Claudopus's own, a long message and words that name no waiting task answer nothing; a command Claude Code blocked still runs only on the press, which its card and the chat say (24 Nov: \"it counts if I type allow\")", async ($, on) => {
  const { list, bash, held, files, logged, clock } = await gated($, on)
  const say = async (text: string, origin: unknown = composer) => ((await $.prompt.submit({ text, wait: false, origin } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  const typedLog = () => (files.get(`${MEMORY}/log.md`) ?? '').split('\n').filter(line => line.includes('typed answer'))
  // An admin command waits on the task's card
  let done = false
  const first = bash('t1', `${ADMIN} here 'chmod 644 /etc/hosts'`).then(r => ((done = true), r))
  expect(await held('t1')).toBeDefined()
  // A task's message to the chat and Claudopus's own say "allow" too, and a long message holds it: none is an answer
  await say('allow', { kind: 'peer' })
  await say('allow', { kind: 'plugin' })
  expect(await say('allow me to explain why the hosts file matters before we change anything in it at all')).not.toContain('is their answer')
  expect(await say('allow the billing page')).not.toContain('is their answer')
  expect([done, typedLog()]).toEqual([false, []])
  expect(await keyed(list, 'gate-t1-0-once')).toBeDefined()
  // Typed by the person, it is their Allow: the command runs, the card says it was typed, the chat's model is told which card it answered
  const told = await say('Allow')
  expect(told).toContain('From Claudopus: Sam\'s message "Allow" is their answer "Allow" to the task "Fix the hosts file"\'s question: Run this as admin on this Mac?')
  expect((await first).result).toBe('ran')
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You typed “Allow” in the chat' }))).toBeDefined()
  expect(logged).toEqual([])

  // Two tasks wait: a bare yes answers the newest, a name answers that task's
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the nose', prompt: 'fix the nose' } as never)
  const older = bash('t2', `${ADMIN} here 'id -u'`)
  expect(await held('t2')).toBeDefined()
  await clock.advance(1000)
  const newer = bash('t3', `${ADMIN} here 'whoami'`, 'a2')
  expect(await held('t3')).toBeDefined()
  expect(await say('yes')).toContain('to the task "Fix the nose"\'s question')
  expect((await newer).result).toBe('ran')
  expect(await keyed(list, 'gate-t2-0-once')).toBeDefined()
  const third = bash('t4', `${ADMIN} here 'date'`, 'a2')
  expect(await held('t4')).toBeDefined()
  // Words that fit both tasks answer neither, and the chat asks which
  const unsure = await say('allow fix')
  expect([unsure.includes('answered nothing, as it fits more than one waiting card'), unsure.includes('"Fix the nose"'), unsure.includes('"Fix the hosts file"')]).toEqual([true, true, true])
  expect([await keyed(list, 'gate-t2-0-once'), await keyed(list, 'gate-t4-0-once')].every(Boolean)).toBe(true)
  expect(await say('allow the hosts one please')).toContain('to the task "Fix the hosts file"\'s question')
  expect((await older).result).toBe('ran')
  expect(await keyed(list, 'gate-t4-0-once')).toBeDefined()
  await pressed(list, 'gate-t4-0-deny')
  await third

  // "release it" on a go-ahead asked with its worktree is Release it: that card's release run goes through
  files.set('/repo/wt/.release', 'mods/claudopus/bin/release')
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-nose')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the nose fix?', choices: ['Release it', "Don't release"], release: '/repo/wt' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Release the nose fix?' }))).toBeDefined()
  expect(await say('release it')).toContain('is their answer "Release it" to the task "Fix the hosts file"\'s question: Release the nose fix?')
  expect(files.get(`${MEMORY}/log.md`)).toContain('release of fix-nose from /repo/wt allowed once for a1')

  // A command Claude Code blocked is never run by a typed answer: its card says only the press runs it, and so does the chat
  files.set('auto-refuse', 'Bash')
  await bash('b1', 'wc -l notes.md', 'a1', { description: 'Count the lines' })
  expect(await until(async () => list.find({ type: 'Text', text: 'Claude Code blocked this command. Run it anyway?' }))).toBeDefined()
  expect(await until(async () => (await list.findAll({ type: 'Markdown' })).find(one => String(one.props.text ?? '').includes("Only your press on Allow runs it. Typing allow in the chat doesn't.")))).toBeDefined()
  const refused = await say('allow')
  expect(refused).toContain('answered nothing. The newest card waiting, the task "Fix the hosts file", is a command Claude Code blocked (wc -l notes.md)')
  expect(files.get(`${MEMORY}/log.md`)).not.toContain('refused command for a1 run')
  expect(await list.find({ type: 'Text', text: 'Claude Code blocked this command. Run it anyway?' })).toBeDefined()
  await list.unmount()
})
