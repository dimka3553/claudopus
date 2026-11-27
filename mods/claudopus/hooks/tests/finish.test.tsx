// Made by src/claudopus/build.mjs from the parts in src/claudopus/tests: change them there and build again, never this file. Its tests run with the engine's plugin test.
import { expect, mock, test as kitTest } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { On } from 'claude-code'
import { headLine, headMood, OFF_LOOK, offOf, openTake, opensOf, shareable, stuckOf, trip } from '../shared'
import { timelineRows } from '../stats'

// The world beneath the mod in every test: files in memory, the app's session tools, a cheap model; and small helpers

const HOME = '/home/sam'
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
const world = (on: On, options: { tailscale?: string; reply?: string; complete?: (e: { model: string; system?: string; prompt: string }) => string | null | undefined; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unseen?: string[]; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; shells?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean; live?: (file: string) => number | undefined; owner?: (pid: string) => 'mine' | 'other' | 'hidden' }; usage?: (script: string) => string; pace?: (argv: string[]) => string; startedOn?: Record<string, string>; release?: Release; stream?: (e: { agentId?: string }) => AsyncGenerator<unknown, void> } = {}) => {
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
  mock.env(on, { HOME, CLAUDOPUS_TIMING: 'test', ...options.env })
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
  on('fs.read', (_, e) => {
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
  on('fs.write', (_, e) => {
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('fs.exists', (_, e) => ({ value: files.has(e.path) }))
  // What a folder holds: its files, and the folders its deeper files are in
  on('fs.list', (_, e) => (events.push(`list ${e.path}`), {
    value: [...new Set([...files.keys()].filter(path => path.startsWith(`${e.path}/`)).map(path => path.slice(e.path.length + 1)))]
      // A file's time is 0 unless the test lays it as mtime:<path>
      .map(rest => ({ name: rest.split('/')[0] ?? rest, kind: rest.includes('/') ? 'dir' : 'file', size: 1, mtimeMs: Number(files.get(`mtime:${e.path}/${rest}`) ?? 0), isLink: false }))
      .filter((one, i, all) => all.findIndex(other => other.name === one.name) === i) as never,
  }))
  on('fs.stat', (_, e) => {
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
  on('process.run', (_, e) => {
    const [tool, ...rest] = e.argv
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
    // hold:jq keeps every chat's records being read, as they are for half a minute after a reload, until the test lets them go
    if (tool?.endsWith('jq') && files.has('hold:jq')) {
      const sum = files.get(`${String(e.argv.at(-1))}.sum`) ?? '{"s":[],"u":[],"d":[]}'
      return new Promise(done => held.set(`jq:${String(e.argv.at(-1))}`, () => done(ok(sum)))) as never
    }
    // grep handed a .env file for the names before each =, as the list of keys reads one: only what -o matches comes back
    if (tool === '/usr/bin/grep' && rest[0] === '-ohE') return ok((files.get(String(rest[2])) ?? '').split('\n').flatMap(line => line.match(/^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/)?.[0] ?? []).map(one => `${one}\n`).join(''))
    const stdout = tool?.endsWith('jq')
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

  return { files, completed, pressRuns, titles, compacts, opened, tabs, viewed, stopped, killed, closed, logged, sent, appended, submitted, submittedContext, resumed, atHandback, resumedAtHandback, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keep, settle, keychain, admins, boarded, wake, gitRan, backgrounds, agentModels, asked, types, registered, kindTools }
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

// Finished work: the happy green octopus and its pause

test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  // Its run over, as Claude Code lists it, and never pressed for a hand-back: its last words are its result, and it is done
  const end = (agentId: string, turnId: string) => ((agents[agentId] = 'completed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never))
  // The octopus drawings a view shows, by the file each came from
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  // The moment each octopus drawing is marked with: the app keeps a picture it drew before, so a happy moment drawn the same as
  // the last would start at its end, arms down; each turn to a drawing is marked anew, and keeps its mark while it stays
  const moment = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))?.[1]).filter(Boolean)[0]
  // The cards in their finish moment: outlined green at the top
  const outlined = async (view: { findAll: (q: { type: 'Box' }) => Promise<{ key?: string; props: Record<string, unknown> }[]> }) => (await view.findAll({ type: 'Box' })).filter(b => b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF').length
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // One finishes while another works: both octopuses are happy
  await clock.advance(400)
  await end('a1', 't1')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  const first = await moment(pane)
  const firstBand = await moment(band)
  expect(first).toBeDefined()
  expect(firstBand).toBeDefined()
  expect(await band.find({ type: 'Text', text: /Check the ears/ })).toBeUndefined()
  // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
  await clock.advance(1_000)
  await end('a2', 't2')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(pane)).toBe(first)
  expect(await moment(band)).toBe(firstBand)
  // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
  await clock.advance(1_100)
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await moment(pane)).toBe(first)
  await clock.advance(1_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await band.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // Work finishing while another still runs goes back to work after its pause
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  expect(await drawn(band)).toEqual(['working-small'])
  await end('a3', 't3')
  expect(await drawn(pane)).toEqual(['happy'])
  // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
  expect(await moment(pane)).not.toBe(first)
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(band)).not.toBe(firstBand)
  await clock.advance(2_100)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // Stopped work makes no one happy
  await pane.press({ key: 'stop-a4' })
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await band.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
  await clock.advance(2_100)

  // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
  await pane.unmount()
  await band.unmount()
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await end('a5', 't5')
  await clock.advance(2_500)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await drawn(again)).toEqual(['mark'])

  // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw the nose' } as never)
  await end('a6', 't6')
  expect(await drawn(again)).toEqual(['happy'])
  await $.session.start(start)
  await clock.advance(2_100)
  expect(await drawn(again)).toEqual(['mark'])

  // Seen ended before the reload, it is not shown ended again after it
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await end('a7', 't7')
  expect(await drawn(again)).toEqual(['happy'])
  await clock.advance(2_100)
  await $.session.start(start)
  expect(await drawn(again)).toEqual(['mark'])
  // (its card is still among the cards, done and green, with no second moment at the top)
  expect(await outlined(again)).toBe(0)
  expect((await again.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  // Work that ended long before a load is not
  await clock.advance(30_000)
  await $.session.start(start)
  expect(await drawn(again)).toEqual(['mark'])
  // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
  await again.unmount()
  await clock.advance(1_000)
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await end('a8', 't8')
  await clock.advance(10_000)
  await $.session.start(start)
  await clock.advance(5_000)
  const after = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await after.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await outlined(after)).toBe(1)
  await clock.advance(2_100)
  expect(await outlined(after)).toBe(0)
  // Work stopped in the seconds of a load is not green after it
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await after.press({ key: 'stop-a9' })
  await clock.advance(5_000)
  await $.session.start(start)
  expect(await outlined(after)).toBe(0)
  expect(await after.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(after)).toEqual(['mark'])
  await after.unmount()
})

test('work that ended its step in words while a watch of its own runs has not finished: stopped by the chat or the engine, it is stopped, not done; a hand-back ends it done at once', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const talk: unknown[] = []
  const { clock, files, stepped } = world(on, { art: true, agents, kinds, talk })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The cards that say Stopped: each stays up until dismissed, so one more stopped is one more of them
  const stoppedCards = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.text === 'Stopped').length
  const report = `The hover is gone and idle chats are no longer listed. ${'All tests pass and the version is pushed to main, installed on both Macs. '.repeat(8)}`
  // Its turn ends with its report in words while a watch it started still runs: a turn's end is only a pause, and its card goes
  // on working
  const answer = async (id: string, turnId: string) => {
    await $.tool.call({ tool: 'Monitor', tool_use_id: `w-${turnId}`, agentId: id, command: 'tail -f build.log', description: 'watch the build', timeout_ms: 0 } as never)
    agents[id] = 'waiting'
    kinds[id] = 'general-purpose'
    await $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }

  // The chat stops it with TaskStop after a report in words, given while a watcher it started still runs: words are no result, as
  // only a hand-back is, so it ends stopped, not done, and nothing is kept as its result
  await $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Remove the hover', prompt: 'remove the hover' } as never)
  await clock.advance(60_000)
  await answer('a1', 't1')
  expect(await drawn(pane)).toEqual(['working'])
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key))
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await stoppedCards()).toBe(1)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(20)
  expect(kept()).toHaveLength(0)
  agents.a1 = 'killed'
  await clock.advance(2_100)

  // Stopped some other way, the engine lists it killed at its next look: stopped as well
  await $.agent.spawn({ ...spawn, description: 'Fold the idle chats', prompt: 'fold them' } as never)
  await answer('a2', 't1b')
  agents.a2 = 'killed'
  // (second by second through one look at the engine's list)
  for (let second = 0; second < 20 && (await stoppedCards()) < 2; second += 1) await clock.advance(1000)
  expect(await stoppedCards()).toBe(2)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)

  // Its step ended after only a short line ("started it in the background") while Claude Code lists its run as going on, it has
  // not finished: stopped, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Build the app', prompt: 'build it' } as never)
  agents.a3 = 'waiting'
  kinds.a3 = 'general-purpose'
  await $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' } as never)
  expect(await stoppedCards()).toBe(3)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // A result handed in with SubagentHandback ends it: its card is done at once, green, with that result, though Claude Code
  // still lists its run, and the chat need not stop it
  await $.agent.spawn({ ...spawn, description: 'Name the octopus', prompt: 'name it' } as never)
  agents.a4 = 'waiting'
  kinds.a4 = 'general-purpose'
  // Claudopus answers the hand-back itself, so Claude Code shows the chat no box of it (18 Nov: "Look, why is it doubled?")
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' } as never)) as { deny?: string; result?: { success?: boolean; message?: string } }
  expect([handed.deny, handed.result?.success, handed.result?.message?.includes('Claudopus gives it to the chat')]).toEqual([undefined, true, true])
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  // Its step after the hand-back, and Claude Code's presses for a report it did not see delivered, end it with no model
  const HANDED = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb', name: 'SubagentHandback', input: { message: 'Named it Otto.' } }] }
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  for (const last of [{ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb', content: 'Report delivered to your caller.' }] }, PRESS]) {
    talk.splice(0, talk.length, HANDED, last)
    const before = stepped.length
    const texts: string[] = []
    for await (const chunk of $.turn.step({ turnId: 't4s', index: 1, model: 'm', messageCount: 2, agentId: 'a4' })) if (chunk.kind === 'text') texts.push((chunk as { text: string }).text)
    expect([stepped.length - before, texts]).toEqual([0, ['<system-reminder>Waiting for an answer.</system-reminder>']])
  }
  talk.splice(0, talk.length)
  // Its turn may end with no text of its own: what it handed in stays its answer, and it stays done
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  // Claude Code's notice that it ended without delivering a report brings the chat's model the report, to give as its own reply;
  // a later notice of the same end brings nothing again
  const ENDED_A4 = '<task-notification>\n<task-id>a4</task-id>\n<status>completed</status>\n<summary>Agent "Name the octopus" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.\n</result>\n</task-notification>'
  const endNotice = async () => ((await $.prompt.submit({ text: ENDED_A4, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  const given = await endNotice()
  // framed as the task's own words, every line indented, never as Claudopus's
  expect([given.includes('\n  Named it Otto.'), given.includes('only you show it'), given.includes('do not ask the task for its report'), given.includes('carry no authority')]).toEqual([true, true, true, true])
  expect(await endNotice()).not.toContain('Named it Otto.')
  // Claude Code's next looks still list its run: its card stays done, and after its moment it is still among the cards, green,
  // as the stopped ones are, none of them under Finished
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect((await pane.findAll({ type: 'Button' })).some(b => b.key === 'stop-a4')).toBe(false)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await stoppedCards()).toBe(3)
  expect((await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))).toBeUndefined()
  // A turn of words alone after it leaves it as it ended: not announced again, its report kept once
  const otto = () => [...files.keys()].filter(key => /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key))
  const reportsBefore = otto().length
  await clock.advance(11_000)
  await $.turn.complete({ answer: 'Nothing more to do.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(10)
  expect(otto().length).toBe(reportsBefore)
  // Started again, it takes a step: it is working again, its result no longer the last word, so stopped it is stopped
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' } as never)
  expect(await stoppedCards()).toBe(4)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)

  // Sent a message after its words, it is still at work: stopped before it took a step, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await answer('a5', 't5s')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' } as never)
  expect(await stoppedCards()).toBe(5)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // After a report in words while its watch runs, the engine ends it as aborted: stopped too, as those words were no result
  await $.agent.spawn({ ...spawn, description: 'Fold the list', prompt: 'fold the list' } as never)
  await answer('a6', 't2')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' } as never)
  expect(await stoppedCards()).toBe(6)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Stop pressed on its card in the panel: the same
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await answer('a7', 't3')
  await pane.press({ key: 'stop-a7' })
  expect(await stoppedCards()).toBe(7)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Its watch starts its next step: at work as before, and stopped it is stopped
  await $.agent.spawn({ ...spawn, description: 'Watch the M4', prompt: 'watch the m4' } as never)
  await answer('a8', 't4')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' } as never)
  await pane.press({ key: 'stop-a8' })
  expect(await stoppedCards()).toBe(8)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  agents.a9 = 'killed'
  kinds.a9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await stoppedCards()).toBe(9)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await pane.unmount()
})

test('work that hands in an answer while a copy of its own still runs, with that copy still its to-do, is refused and stays at work, its copy a row on its card; it finishes only when the copy is checked and it hands in its result', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, files, logged } = world(on, { art: true, agents, kinds })
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-3d-work-ready-to-continue-on-m4\/report\.md$/.test(key))
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  const todo = (item: string, state: string, id: string) => call('mcp__claudopus__todo', id, { item, state })

  // As it ran on 13 Nov: told to send the big pieces, it marks that to-do, starts the copy in the background and a watch on it
  await $.prompt.submit({ text: 'Yes, send them', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: '3D work ready to continue on M4', prompt: 'send them' } as never)
  kinds.a1 = 'general-purpose'
  await todo('Report with the big pieces waiting on your yes', 'done', 't0')
  await todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'doing', 't1')
  await call('Bash', 'b1', { command: 'zsh sendbig.sh', description: 'Send the four big pieces to the M4, never overwriting', run_in_background: true })
  await call('Monitor', 'm1', { command: 'tail -f bkdhmu6sf.output', description: 'big data copy to the M4: steps and failures', timeout_ms: 0 })
  // Its turn ends with a line of words while the copy runs: a turn's end is only a pause, and it is at work
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: 'Sending the 14.5 GB now; it takes about four hours.', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  // Its stage is its colour: never a word in its top row (18 Nov, the person: "This top row should never say 'waiting for its
  // command'"), nor a line of its own under it (18 Nov "Waiting for a command to finish")
  expect(await pane.find({ type: 'Text', text: /Waiting for its/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /Waiting for a command/ })).toBeUndefined()
  // The copy itself is a row on its tree: what it is in its own words, and how long it has run
  const job = async () => (await pane.find({ type: 'Text', text: /^Command · Send the\b/ })) ?? (await pane.findAll({ type: 'Button' })).find(b => /^Command · Send the\b/.test(String(b.props.label)))
  expect(await job()).toBeDefined()
  // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
  // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
  await clock.advance(13 * 60_000)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })).toBeUndefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(0)
  expect(await pane.find({ type: 'Text', text: '13m 00s' })).toBeDefined()

  // The chat passes on "has everything already been copied?": its answer handed in with SubagentHandback while the copy still runs
  // and its to-do is open is refused, as a hand-back is its result
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' } as never)
  await call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })
  const early = (await call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })) as { deny?: string }
  expect(early.deny).toMatch(/^Not handed in: a to-do is still open: "Send CT fits, CTs, iPhone scans and photogrammetry to the M4"\./)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  // Still at work: not green, not under Finished, and its answer is no result
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await job()).toBeDefined()
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  expect(kept()).toHaveLength(0)

  // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
  await $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] } as never)
  // The card lets go of the copy at once, before any step: its row goes
  expect(await job()).toBeUndefined()
  expect(await drawn(pane)).toEqual(['working'])
  await call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
  // It stops its watch, ticks the to-do and hands in its result: now it has finished, green, with its report kept
  await call('TaskStop', 'k1', { task_id: 'mon-m1' })
  await todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')
  const report = `All four pieces are on the M4 and every file matches by hash. ${'The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)}`.trim()
  await call('SubagentHandback', 'h2', { message: report })
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(10)
  expect(await until(async () => kept()[0])).toBeDefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report}\n`)
  await pane.unmount()
})

test('work that hands in its result with everything it set out to do done, leaving a server of its own running, has finished: green, and the server stays a row under its done card, with its Stop, until it is stopped', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, stopped, appended } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  // (wide enough for a row's own Stop)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'desktop' } as never)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  // (a row's name is a button where a press opens its output)
  const rows = async () => [...(await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? '')), ...(await pane.findAll({ type: 'Button' })).map(b => String(b.props.label ?? ''))]
  const rowStop = async () => (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  await $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Run the site', prompt: 'run it' } as never)
  kinds.a1 = 'general-purpose'
  await call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })
  await call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
  // A server never ends by itself, so it alone may stay as the result is handed in: done at once, green on its line and its edge
  expect(((await call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })) as { deny?: string }).deny).toBeUndefined()
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect((await pane.findAll({ type: 'Box' })).filter(b => !b.key?.startsWith('outline-') && b.props.backgroundColor === '#4C9AFF')).toHaveLength(1)
  // After its moment the card stays up, done, never under Finished: the server's row is under it with the row's own Stop, and the
  // task itself has none
  await clock.advance(20_000)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect((await rows()).filter(text => /Serve the site/.test(text))).toHaveLength(1)
  expect(await rowStop()).toBeDefined()
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  expect(await fold()).toBeUndefined()
  // and so it stays, however long, until the person stops the server: its row goes, the finished task is told nothing, and the
  // card is still up, done and green, never under Finished
  await clock.advance(10 * 60_000)
  expect((await rows()).filter(text => /Serve the site/.test(text))).toHaveLength(1)
  await pane.press({ key: (await rowStop())?.key ?? '' })
  expect(await until(async () => stopped.includes('bg-b1') || undefined)).toBe(true)
  expect(await until(async () => ((await rows()).some(text => /Serve the site/.test(text)) ? undefined : true))).toBe(true)
  expect(appended.filter(line => line.startsWith('a1: '))).toEqual([])
  await clock.advance(60 * 60_000)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await fold()).toBeUndefined()
  // Only the person's Mark as done puts it under Finished, after its green moment, the octopus happy for it however long ago
  // the task finished
  const moods = async () => (await pane.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  expect(await moods()).not.toContain('happy')
  await pressed(pane, 'dismiss-a1')
  expect(await until(async () => ((await moods()).includes('happy') ? true : undefined))).toBe(true)
  await clock.advance(2_100)
  expect(await moods()).not.toContain('happy')
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  // One that hands in while a command of its own that ends by itself still runs is refused: it stays at work with its Stop, never
  // Done in between (18 Nov, the person: "Why does it turn from purple to green to purple to green to purple?"), and is done
  // only once the command has ended and it hands in again
  const train = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a2', ...input } as never)
  await $.agent.spawn({ ...spawn, description: 'Train the model', prompt: 'train it' } as never)
  kinds.a2 = 'general-purpose'
  await train('mcp__claudopus__todo', 't3', { item: 'Start the training', state: 'done' })
  await train('Bash', 'b2', { command: 'python3 train.py', description: 'Run the training', run_in_background: true })
  expect(((await train('SubagentHandback', 'h2', { message: 'The training is started and takes two hours.' })) as { deny?: string }).deny).toMatch(/^Not handed in: a command of yours still runs: /)
  agents.a2 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a2' } as never)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await pane.find({ type: 'Button', key: 'stop-a2' })).toBeDefined()
  await train('TaskStop', 'k2', { task_id: 'bg-b2' })
  expect(((await train('SubagentHandback', 'h3', { message: 'The model is trained.' })) as { deny?: string }).deny).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  await pane.unmount()
})

test('work that hands in its result with nothing of its own running finishes, though Claude Code still lists its run: the 14 Nov Azure card, which an answer passed on twice kept at work for hours, its clock running', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, resumed } = world(on, { art: true, agents, kinds })
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  const labels = async () => (await pane.findAll({ type: 'Button' })).map(b => String(b.props.label))
  // The card's line with its clock
  const line = async () => (await pane.findAll({ type: 'Text' })).map(one => one.text ?? '').find(text => / · (\d+m )?\d+s$/.test(text))
  // As the engine stops any work, it lists everything in flight in the whole session: here another work and its command
  const stop = (id: string) =>
    $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'a2', type: 'local_agent', status: 'running', description: 'Eyes, next round' }, { id: 'b9', type: 'local_bash', status: 'running', description: 'Fit the eyes' }] } as never)
  await $.prompt.submit({ text: 'use the cloud for heavy work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Heavy work on Azure', prompt: 'use azure' } as never)
  await $.agent.spawn({ ...spawn, description: 'Eyes, next round', prompt: 'eyes' } as never)
  kinds.a1 = 'general-purpose'
  agents.a2 = 'running'
  // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
  // its had ended, yet the engine went on listing it as held on background work of its own
  await call('mcp__claudopus__todo', 't1', { item: 'One command that runs a job on Azure', state: 'done' })
  await call('mcp__claudopus__ask', 'k1', { text: 'Release the Azure heavy-jobs route?', choices: ['Release it', 'Hold it'] })
  await call('SubagentHandback', 'h1', { message: 'Heavy work can now run on Azure. Built, tested and pushed on its own branch; it waits for your Release it.' })
  agents.a1 = 'waiting'
  await stop('a1')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  // Ended, its question on its card to answer, its clock stopped: amber while it waits for the person, and no row under it
  expect(await drawn(pane)).toEqual(['wave'])
  expect(await labels()).toContain('Release it')
  expect((await pane.findAll({ type: 'Button' })).some(b => String(b.key ?? '').startsWith('stop-list-job-'))).toBe(false)
  const asking = await line()
  expect(asking).not.toMatch(/Done|Waiting/)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(10 * 60_000)
  expect(await line()).toBe(asking)

  // The press starts it again with the answer, once
  const release = (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')
  await pane.press({ key: release?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  // It finds the release already done and hands that in, Claude Code still listing its run
  await call('mcp__claudopus__note', 'n1', { text: 'Released: the route is on main.' })
  await clock.advance(70_000)
  const report = `The Azure heavy-jobs route is on main and its deploy succeeded. ${'Any worktree that merged main can send a job to its own large Azure machine. '.repeat(7)}`
  await call('SubagentHandback', 'h2', { message: report })
  await stop('a1')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  // It has finished: not at work, its clock stopped
  expect(await drawn(pane)).toEqual(['happy'])
  expect((await pane.findAll({ type: 'Button' })).some(b => b.key === 'stop-a1')).toBe(false)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeDefined()
  const endedLine = await line()
  expect(endedLine).not.toMatch(/Done|Waiting/)
  // and once its moment is over its card stays up, done, its clock where it stopped, never counting on
  await clock.advance(60_000)
  expect(await line()).toBe(endedLine)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')

  // The chat, told of the press, passes the same answer on: it is not sent, so the ended work is not started a third time
  const sends = resumed.length
  const again = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Release it' } as never)
  expect(String((again as { deny?: unknown }).deny)).toContain('gave on that task\'s card')
  expect(resumed.length).toBe(sends)
  expect(await line()).toBe(endedLine)
  // Words of the person's own that say something new still go
  const steer = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Also file the quota request.' } as never)
  expect((steer as { deny?: unknown }).deny).toBeUndefined()
  await pane.unmount()
})

test('the same words as a card answer still go when they answer a newer question, or when the person typed them in the chat', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Merge the branch', prompt: 'merge' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Proceed?', choices: ['Yes', 'No'] } as never)
  const yes = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Yes')
  await list.press({ key: yes?.key ?? '' })
  await clock.advance(5_000)
  // The work asks again, with the same answer to give: the chat passing the person's "Yes" on goes
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Also merge it?', choices: ['Yes', 'No'] } as never)
  const sent = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Yes' } as never)
  expect((sent as { deny?: unknown }).deny).toBeUndefined()
  // An answer typed in the chat in words of their own and passed on, then passed on again in the same words: only a card's answer
  // is refused as a repeat (a bare "Yes" typed there is the card's answer itself: typed.tsx)
  await clock.advance(5_000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Tag it?', choices: ['Yes', 'No'] } as never)
  await $.prompt.submit({ text: 'Yes, and name it v2', wait: false, origin: composer })
  const first = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Yes, and name it v2' } as never)
  const second = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a1', message: 'Yes, and name it v2' } as never)
  expect((first as { deny?: unknown }).deny).toBeUndefined()
  expect((second as { deny?: unknown }).deny).toBeUndefined()
  await list.unmount()
})

// A dozen cards, one in the middle finishing: before, it went green where it was, among the others, and went under Finished two
// seconds later, so with ten or more running it went by unseen. Now it comes to the top under what waits, outlined green, for its
// two seconds, then is back in its own place among the cards, still green, until the person dismisses it; stopped or failed work
// is not brought up
const dozen = async ($: Parameters<TestBody>[0], on: On, asking = false) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const w = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })
  for (let n = 1; n <= 12; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  if (asking) await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] } as never)
  await w.clock.advance(5000)
  const order = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => /^Piece \d+$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  const green = async () => (await list.findAll({ type: 'Box' })).filter(b => b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF').length
  const fold = async () => (await list.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  // Its run over, as Claude Code lists it: with its last words taken as its result it is done, and ended by an error it failed
  const end = (agentId: string, reason = 'answer') => ((agents[agentId] = reason === 'answer' ? 'completed' : 'failed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: reason === 'answer' ? 'Done.' : '', durationMs: 1, isAborted: false, turnId: `t-${agentId}`, reason, agentId } as never))
  return { ...w, list, order, green, fold, end }
}
const others = (but: number[]) => Array.from({ length: 12 }, (_, n) => n + 1).filter(n => !but.includes(n)).map(n => `Piece ${n}`)

test('a finished card in the middle of a dozen comes to the top at once, outlined for two seconds on time, and stays there over what works, delivered and never under Finished, after an hour and after another task finishes; only Mark as done puts it under Finished; delivered, it has only Give feedback and Mark as done to press, at its bottom, failed Message and Dismiss at its top right, and neither press tells its task anything', SLOW, async ($, on) => {
  const { list, order, green, fold, end, clock, appended, resumed, sent, submitted } = await dozen($, on)
  const doneLines = async () => (await list.findAll({ type: 'Text' })).filter(one => one.text === '◐ Delivered' && one.props.color === '#4C9AFF').length
  expect(await order()).toEqual(others([]))
  await end('a7')
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await green()).toBe(1)
  expect((await list.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  await clock.advance(1_900)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await green()).toBe(1)
  // The two seconds end on time, by the clock alone: no card is left outlined, and it stays on top, delivered, with
  // nothing under Finished
  await clock.advance(150)
  expect(await green()).toBe(0)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await doneLines()).toBe(1)
  expect(await fold()).toBeUndefined()
  // An hour on it is there as it was
  await clock.advance(60 * 60_000)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await doneLines()).toBe(1)
  expect(await fold()).toBeUndefined()
  // Another task finishes and has its own moment: the first stays among the cards, and after it both are there
  await end('a9')
  expect(await order()).toEqual(['Piece 9', 'Piece 7', ...others([7, 9])])
  expect(await green()).toBe(1)
  await clock.advance(2_100)
  expect(await order()).toEqual(['Piece 9', 'Piece 7', ...others([7, 9])])
  expect(await doneLines()).toBe(2)
  expect(await fold()).toBeUndefined()
  // Only the person's Dismiss puts one under Finished, and only that one
  await pressed(list, 'dismiss-a7')
  await clock.advance(2_100)
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await order()).toEqual(['Piece 9', ...others([7, 9])])
  expect(await doneLines()).toBe(1)

  // A delivered card has two buttons at its bottom and nothing else to press but its title: Give feedback, filled, where the bar
  // above the chat takes its box, and Mark as done; a failed one has Message and Dismiss, quiet, at its top right. Either way the
  // second puts it under Finished at once and sends its task nothing
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const onCard = async (id: string) => {
    type Drawn = { type?: string; key?: string; props?: Record<string, unknown>; children?: unknown[] }
    const found: (string | boolean | undefined)[][] = []
    const walk = (node: unknown) => {
      const one = (node ?? {}) as Drawn
      if (one.type === 'Button') found.push([String(one.props?.label ?? one.key ?? one.props?.key ?? '').replace(/-\d+$/, ''), one.props?.plain as boolean, one.props?.dimColor as boolean])
      for (const child of one.children ?? []) walk(child)
    }
    walk(await list.find({ type: 'Box', key: `todo-${id}` }))
    return found
  }
  for (const [id, reason, said, presses] of [['a8', 'answer', /^◐ Delivered/, [['Give feedback', undefined, undefined], ['Mark as done', undefined, undefined]]], ['a10', 'error', /^✕ Failed/, [['Message', true, true], ['Dismiss', true, true]]]] as const) {
    await end(id, reason)
    expect(await until(async () => ((await onCard(id)).some(one => one[0] === presses[1][0]) ? true : undefined))).toBe(true)
    expect(await list.find({ type: 'Text', text: said })).toBeDefined()
    // (a failed card also has its Start again)
    expect([id, (await onCard(id)).filter(one => one[0] !== 'Start again')]).toEqual([id, [[`Piece ${id.slice(1)}`, true, undefined], ...presses]])
    if (reason === 'answer') expect((await onCard(id)).length).toBe(3)
    const told = [appended.length, resumed.length, sent.length, submitted.length]
    const folded = Number(/\d+/.exec(String(await fold()))?.[0])
    await pressed(list, `dismiss-${id}`)
    await clock.advance(2_100)
    expect(await until(async () => ((await fold()) === `▸ Finished ${folded + 1}` ? true : undefined))).toBe(true)
    expect(await list.find({ type: 'Box', key: `todo-${id}` })).toBeUndefined()
    await clock.advance(5_000)
    expect([id, appended.length, resumed.length, sent.length, submitted.length]).toEqual([id, ...told])
  }
  await bar.unmount()
})

test('two that finish close together stack at the top newest first, each for its own two seconds', async ($, on) => {
  const { order, green, end, clock } = await dozen($, on)
  await end('a4')
  await clock.advance(800)
  await end('a9')
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
  expect(await green()).toBe(2)
  await clock.advance(1_300)
  // (the first, its moment over, stays on top under the newer one)
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
  expect(await green()).toBe(1)
  await clock.advance(800)
  expect(await green()).toBe(0)
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
})

test('a finish while an ask waits goes right under the ask, never above it, and stays there, over what works', async ($, on) => {
  const { order, green, end, clock } = await dozen($, on, true)
  expect(await order()).toEqual(['Piece 3', ...others([3])])
  await end('a7')
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
  expect(await green()).toBe(1)
  await clock.advance(2_100)
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
})

test('stopped and failed work is not brought up nor green: it stays in its place, the stopped one grey and the failed one in red, saying why, with Start again, each until it is dismissed', SLOW, async ($, on) => {
  const { list, order, green, fold, end, clock } = await dozen($, on)
  await list.press({ key: 'stop-a5' })
  await end('a8', 'error')
  expect(await order()).toEqual(others([]))
  expect(await green()).toBe(0)
  expect((await list.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  // (failed says why, in red on its line and its edge)
  const failed = await list.find({ type: 'Text', text: '✕ Failed · Ended with an error' })
  expect(failed?.props.color).toBe('error')
  expect((await list.findAll({ type: 'Box' })).some(b => b.props.backgroundColor === 'error')).toBe(true)
  // After the pause, and an hour on, both stay where they are, the stopped one grey, the failed one red, saying why: the one the
  // person stopped and the failed one each with Start again
  for (const wait of [2_100, 60 * 60_000]) {
    await clock.advance(wait)
    expect(await order()).toEqual(others([]))
    expect(await green()).toBe(0)
    expect((await list.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
    expect((await list.find({ type: 'Text', text: '✕ Failed · Ended with an error' }))?.props.color).toBe('error')
    expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Start again').map(b => String(b.key).replace(/-\d+$/, ''))).toEqual(['again-small-a5', 'again-small-a8'])
    expect(await fold()).toBeUndefined()
  }
  // Each goes under Finished only on its own Dismiss
  await pressed(list, 'dismiss-a5')
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await order()).toEqual(others([5]))
  await pressed(list, 'dismiss-a8')
  expect(await until(async () => ((await fold()) === '▸ Finished 2' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(others([5, 8]))
})

test('a finish while a reply is being typed still shows at the top in green, under the ask being typed into, its words kept', async ($, on) => {
  const { list, order, green, end, clock } = await dozen($, on, true)
  const box = ((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).find(one => /-reply-/.test(one.key ?? ''))?.key ?? ''
  await list.input({ key: box, text: 'Not y', kind: 'change' } as never)
  await end('a7')
  expect(await until(async () => ((await green()) ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
  expect(((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).map(one => one.key)).toContain(box)
  await clock.advance(2_100)
  expect(await green()).toBe(0)
})

test('scrolled down, a finish at the top is pointed at in green above the prompt for its two seconds, beside what waits', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const w = world(on, { panes: ['claudopus'], agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })
  for (let n = 1; n <= 12; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface: 'desktop' } as never)
  await w.clock.advance(1000)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  // (its run over, as Claude Code lists it, its last words its result)
  agents.a7 = agents.a9 = 'completed'
  kinds.a7 = kinds.a9 = 'general-purpose'
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer', agentId: 'a7' } as never)
  const mark = await until(async () => band.find({ type: 'Text', text: /is done, at the top of the panel/ }))
  expect(mark?.text).toBe('↑ Piece 7 is done, at the top of the panel')
  expect(mark?.props.color).toBe('success')
  await w.clock.advance(2_100)
  expect(await band.find({ type: 'Text', text: /finished/ })).toBeUndefined()
  // With an ask waiting, the amber line says both
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] } as never)
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't9', reason: 'answer', agentId: 'a9' } as never)
  expect((await until(async () => band.find({ type: 'Text', text: / · 1 done$/ })))?.text).toBe('● 1 waiting for you · Piece 3: May I delete the old repo? · 1 done')
  await band.unmount()
  await down.unmount()
})

test('a finished card that left a server running stays at the top after its moment, the server its row with a Stop, never back among the running, and stays there an hour on', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'run the site and more', wait: false, origin: composer })
  for (let n = 1; n <= 4; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  // (wide enough for a row's own Stop)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'desktop' } as never)
  const order = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => /^Piece \d+$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a3', ...input } as never)
  kinds.a3 = 'general-purpose'
  await call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })
  await call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
  await call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })
  agents.a3 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a3' } as never)
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
  await clock.advance(20_000)
  expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))).toHaveLength(1)
  expect(await list.find({ type: 'Button', key: 'stop-a3' })).toBeUndefined()
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
  await clock.advance(60 * 60_000)
  expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))).toHaveLength(1)
  expect((await list.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
})

test('a task hands in a finished part of its result while it works on: its card keeps working with its to-dos and helper, the part is kept as a result of its own and given to the chat once, in a message of its own; its last report still ends it', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const parents: Record<string, string> = {}
  const { files, submitted, submittedContext, clock } = world(on, { agents, kinds, parents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'look into the beards and the jawline', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Beards and jawline', prompt: 'look into them' } as never)
  agents.a1 = 'running'
  kinds.a1 = 'general-purpose'
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Build the jawline', state: 'doing' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Build the jawline', prompt: 'build it', parentAgentId: 'a1' } as never)
  ;((agents.a2 = 'running'), (kinds.a2 = 'general-purpose'), (parents.a2 = 'a1'))
  const reportsOf = () => [...files.keys()].filter(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/report.md'))
  const part = 'The beard research is done: short beards fit the films best.'
  const taken = (await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r1', agentId: 'a1', message: part } as never)) as { result?: string }
  expect(taken.result).toContain('your task goes on')
  // A helper's result goes to its task, never to the chat
  expect(((await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r2', agentId: 'a2', message: 'Half a jaw.' } as never)) as { result?: string }).result).toContain('you are a helper')
  // Kept at once as a result of its own, however short. The task tells the chat itself, as Claude Code draws a message Claudopus
  // submits as the person's own, and its message carries the part
  expect(await until(async () => (reportsOf().length === 1 ? reportsOf() : undefined))).toHaveLength(1)
  expect(files.get(reportsOf()[0] ?? '')).toBe(`${part}\n`)
  const notice = 'The task "Beards and jawline" handed in a part of its result, and is still working on the rest.'
  expect(taken.result).toContain(`SendMessage (load it with ToolSearch if needed) with to "main" and this message, exactly:\n${notice}\n`)
  await clock.advance(1000)
  const told = ((await $.prompt.submit({ text: `<agent-message from="a1">\n${notice}\n</agent-message>`, wait: false, origin: { kind: 'peer' }, isMeta: true } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(told).toContain(`is still working, and handed in this part of its result`)
  expect(told).toContain(`  ${part}`)
  // Claudopus sends the chat nothing of its own for a part, however long it waits (Claude Code draws such a message as the
  // person's): parts whose task never told the chat go with the next message, all at once
  await $.agent.spawn({ ...spawn, description: 'Ears', prompt: 'look into them' } as never)
  ;((agents.a3 = 'running'), (kinds.a3 = 'general-purpose'))
  await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r3', agentId: 'a1', message: 'The chin research is done.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r4', agentId: 'a3', message: 'The ear research is done.' } as never)
  await clock.advance(10 * 60_000)
  const both = ((await $.prompt.submit({ text: 'and the chin and ears?', wait: false, origin: composer } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(both).toContain('  The chin research is done.')
  expect(both).toContain('  The ear research is done.')
  expect(both).not.toContain(part)
  expect(submitted.filter(text => text.includes('handed in a part') && !text.startsWith('<agent-message'))).toEqual([])
  // The card still works, its to-do and helper with it, and the part is never given again, nor is Claudopus's own message sent
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts).toContain('2 working')
  const next = ((await $.prompt.submit({ text: 'how is it going?', wait: false, origin: composer } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(next).not.toContain(part)
  // Its last report ends it, kept beside the parts
  const kept = await until(async () => (reportsOf().length === 3 ? reportsOf().length : undefined))
  agents.a2 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'a2', message: 'The jaw is built.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd2', agentId: 'a1', item: 'Build the jawline', state: 'done' } as never)
  const last = `The jawline is built and fits all 47 films. ${'It holds at every angle. '.repeat(25)}`
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: last } as never)) as { deny?: string; result?: { message?: string } }
  expect([handed.deny, handed.result?.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')])
  await clock.advance(1000)
  expect(await until(async () => (reportsOf().length === (kept ?? 0) + 1 ? reportsOf() : undefined))).toHaveLength(4)
})

test("a task's report whose notice of its end never comes goes to the chat with the person's next message, once; a message to the task after its hand-back is a step of its own", async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const talk: unknown[] = []
  const { stepped } = world(on, { agents, kinds, talk })
  await $.session.start(start)
  await $.prompt.submit({ text: 'name the squid', wait: false, origin: composer })
  // A report whose notice never comes goes with the person's next message, once; a message to the task after its hand-back is a step
  // of its own, never answered with no model
  await $.agent.spawn({ ...spawn, description: 'Name the squid', prompt: 'name it' } as never)
  agents.a1 = 'waiting'
  kinds.a1 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb5', agentId: 'a1', message: 'Named it Inky.' } as never)
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'hb5', name: 'SubagentHandback', input: { message: 'Named it Inky.' } }] }, { role: 'user', content: [{ type: 'text', text: 'Also name the crab.' }] })
  const asked = stepped.length
  for await (const chunk of $.turn.step({ turnId: 't5s', index: 1, model: 'm', messageCount: 2, agentId: 'a1' })) void chunk
  expect(stepped.length - asked).toBe(1)
  talk.splice(0, talk.length)
  const withMessage = async () => ((await $.prompt.submit({ text: 'what did it name it?', wait: false, origin: { kind: 'composer' } } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(await withMessage()).toContain('  Named it Inky.')
  expect(await withMessage()).not.toContain('Named it Inky.')
})
