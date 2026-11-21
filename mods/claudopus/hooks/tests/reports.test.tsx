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
    if (tool === 'rm') files.delete(String(rest.at(-1)))
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
        ? `${MEMORY}/work/local_1.md:9:the nose model returned\n${MEMORY}/words/local_1.md:2:the nose is flawed\n`
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

// Results: kept, listed, opened, changed, put away and brought back, and rounds of one work

test('finished work leaves a result for good that asks nothing: its pictures copied, listed under Results, opened, changed from the one box above the chat by its own task, named to the chat, and its card dismissed', async ($, on) => {
  const { files, submitted, clock, copied, opened, resumed, kindTools } = world(on)
  // A write of the cards held until the test lets it land (below, a Dismiss)
  let isWriteHeld = false
  let writeHeld: (() => void) | undefined
  on('state.set', async (_, e, next) => {
    if (isWriteHeld && (e as { key?: string }).key === 'todos') ((isWriteHeld = false), await new Promise<void>(go => (writeHeld = go)))
    return next(e)
  })
  // Nothing is ever put in the chat's own box
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG')
  await $.session.start(start)
  await $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Weekly revenue', prompt: 'how is revenue doing' } as never)
  // A helper's answer is no report
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' } as never)
  await $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })

  // No kind of task has a tool that records questions for its result: a task asks on its card, before it finishes
  expect(Object.keys(kindTools).filter(kind => kindTools[kind]?.includes('mcp__claudopus__ask')).length).toBeGreaterThan(0)
  expect(Object.values(kindTools).flat().filter(tool => /waits/.test(tool))).toEqual([])
  // and a call to the old one is no tool of the mod's: the engine's own answer comes back, and nothing is kept with the result
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?'], agentId: 'a1' } as never)).result).toBe('ran')

  const report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.\n\nShall I send it to the team?'
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metaPath = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/meta.json')))
  const folder = (metaPath ?? '').replace('/meta.json', '')
  expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/)
  expect(files.get(`${folder}/report.md`)).toBe(`${report}\n`)
  expect(copied).toEqual([`${folder}/revenue.png`])
  const meta = JSON.parse(files.get(metaPath ?? '') ?? '{}') as { title: string; files: string[]; waiting?: unknown; question?: string; gist: string; folder: string }
  expect(meta.title).toBe('Weekly revenue')
  expect(meta.files).toEqual(['revenue.png'])
  // A question in its text is text: the result keeps no list of what waits
  expect(meta.waiting).toBeUndefined()
  expect(meta.question).toBeUndefined()
  expect(meta.gist).toBe('Revenue rose 12% this week to $4,210.')
  expect(meta.folder).toBe('/repo')
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  // A short answer with no picture is a confirmation, not a report
  await $.agent.spawn({ ...spawn, description: 'Save a rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a3', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })
  await clock.advance(10)
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  // The same report again is not kept twice
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })
  await clock.advance(10)
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)

  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // On the Claudopus pane the reports are one small button, with no mark
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 1')
  expect(await pane.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  // Its task is done, in green, and waits for nobody: no question from its result on the card, nothing to press for one, and the
  // header counts nothing as waiting
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Result ready|Shall I send it to the team/ })).toBeUndefined()
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === '#E5A50A').length).toBe(0)
  expect((await pane.findAll({ type: 'Button' })).filter(b => /^result-ask-/.test(b.key ?? '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)))).toEqual([])
  // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
  await pressed(pane, 'reports-open')
  expect(opened).toContain('reports')
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  // One line a row: its title, when, and Archive; nothing under it, and no mark
  expect((await keyed(list, `report-${folder.split('/').pop()}`))?.props.label).toBe('Weekly revenue')
  expect(await list.find({ type: 'Text', text: /^\d\d:\d\d$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /Revenue rose/ })).toBeUndefined()
  expect((await keyed(list, `archive-${folder.split('/').pop()}`))?.props.label).toBe('Archive')

  // A report opens as a pane of its own, named after it: what its task made, the finding, the report, how to go on from it
  await pressed(list, `report-${folder.split('/').pop()}`)
  const id = `report-${folder.split('/').pop()}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'desktop' } as never)
  const heads = (await one.findAll({ type: 'Text' })).filter(text => text.props.bold).map(text => text.text)
  // What its task made is right under its title, as tiles; its pictures are among them, so no Pictures part repeats them. Nothing
  // in it waits: no part of questions, and no answer to press
  expect(heads).toEqual(['Weekly revenue', 'Files', 'Summary', 'In full', 'Follow-up'])
  expect((await one.findAll({ type: 'Button' })).filter(b => /^report-say-/.test(b.key ?? '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)))).toEqual([])
  expect((await one.findAll({ type: 'Svg' })).map(svg => String(svg.props.alt))).toContain('revenue')
  expect((await one.find({ type: 'Markdown', text: /Revenue rose 12%/ }))?.props.text).toBe(`${report}\n`)
  // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
  expect(await keyed(one, 'report-page')).toBeUndefined()
  expect(await one.find({ type: 'Text', text: `${folder}/revenue.png` })).toBeUndefined()

  // Message opens the one box above the chat: its heading names the result, then the field, what Enter and Send do,
  // Send and Close. Nothing is typed in the result's own tab on the desktop, and nothing is put in the chat's own box
  const inputsOf = async (site: typeof bar) => (await site.findAll({ type: 'Input' } as never)) as { key?: string; props: Record<string, unknown> }[]
  const barLabels = async () => (await bar.findAll({ type: 'Button' })).map(b => String(b.props.label))
  expect((await keyed(one, 'report-carry'))?.props.label).toBe('Message')
  expect(await inputsOf(one as never)).toEqual([])
  expect(await inputsOf(bar)).toEqual([])
  await pressed(one, 'report-carry')
  const head = await until(async () => bar.find({ type: 'Text', text: /^↳ Message to/ }))
  expect(head?.text).toBe('↳ Message to “Weekly revenue”')
  const [field, ...moreFields] = await inputsOf(bar)
  expect(moreFields).toEqual([])
  expect(field?.props.placeholder).toBe('Type your message')
  expect(await bar.find({ type: 'Text', text: /^Enter sends/ })).toBeUndefined()
  expect((await barLabels()).filter(label => label === 'Send' || label === 'Close')).toEqual(['Send', 'Close'])
  expect(await inputsOf(one as never)).toEqual([])
  // (the button that opened it closes it again; opened once more, it is there as before)
  expect(await until(async () => ((await keyed(one, 'report-carry'))?.props.label === 'Close' ? true : undefined))).toBe(true)
  await pressed(one, 'report-carry')
  expect(await until(async () => ((await inputsOf(bar)).length ? undefined : true))).toBe(true)
  expect(await bar.find({ type: 'Text', text: /^↳ Message to/ })).toBeUndefined()
  await pressed(one, 'report-carry')
  const again = await until(async () => (await inputsOf(bar))[0])
  // What is sent from it goes to the result's own task, whose card is still there to carry on from: it is started again with the
  // person's words from the press's own hook (the clock has not moved), the chat is asked nothing, and the box goes
  const changes = () => resumed.filter(line => line.startsWith('a1: ') && line.includes('wrote to you from the card'))
  await bar.input({ key: again?.key ?? '', text: 'send it to the team' })
  expect(await until(async () => changes()[0])).toContain('in their own words: send it to the team\n')
  expect(changes()).toHaveLength(1)
  expect(submitted).toEqual([])
  expect(await until(async () => ((await inputsOf(bar)).length ? undefined : true))).toBe(true)
  // Its card is at work again at once, with Stop, and nothing waits
  expect(await until(async () => (await pane.find({ type: 'Button', key: 'stop-a1' })) ?? undefined)).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4', reason: 'answer' })
  await clock.advance(10)
  expect(await until(async () => ((await keyed(one, 'report-carry'))?.props.label === 'Message' ? true : undefined))).toBe(true)
  // In the terminal, whose bar draws no field, the result has its own field instead, and what is sent from it goes the same way
  const termed = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'terminal' } as never)
  expect(await keyed(termed, 'report-carry')).toBeUndefined()
  const own = (await inputsOf(termed as never)).filter(input => /^report-carry-reply-/.test(input.key ?? ''))
  expect(own.map(input => input.props.placeholder)).toEqual(['Type your message'])
  await termed.input({ key: own[0]?.key ?? '', text: 'check the refunds' })
  expect(await until(async () => changes()[1])).toContain('in their own words: check the refunds\n')
  await termed.unmount()
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4b', reason: 'answer' })
  await clock.advance(10)
  expect(submitted).toEqual([])
  expect(filled).toEqual([])
  expect([...files.keys()].filter(path => path.endsWith('/meta.json'))).toHaveLength(1)
  await bar.unmount()

  // The chat is told of the reports with each message, and reads one itself to answer from it
  const next = await $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })
  expect(next.context?.join('\n')).toContain('Results saved')
  expect(next.context?.join('\n')).toContain(`${folder}/report.md`)
  expect(next.context?.join('\n')).not.toContain('waiting on')
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: `${folder}/report.md` } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: `cat ${folder}/report.md` } as never)).deny).toContain('Start a fresh agent')

  // The person dismisses a card themselves, one that ended with its question open and one just done: it goes under Finished at
  // once and stays there across a redraw and a reload of the cards (18 Nov: "Either way, I should have the ability to just close it")
  const finishedCount = async () => Number(/Finished (\d+)/.exec(String((await keyed(cards, 'finished-fold'))?.props.label))?.[1] ?? 0)
  await $.agent.spawn({ ...spawn, description: 'Pick an opening', prompt: 'pick an opening' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Which opening should go out?', choices: ['A', 'B', 'C'] } as never)
  // (it hands in its result with the question still open: that, not its turn's end, ends a task)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h4', agentId: 'a4', message: 'Three openings are cut, A, B and C. Nothing is posted until one is picked.' } as never)
  await $.turn.complete({ agentId: 'a4', answer: '', durationMs: 1, isAborted: false, turnId: 't5', reason: 'answer' })
  await clock.advance(3_000)
  await pane.unmount()
  const cards = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await until(async () => (await cards.find({ type: 'Text', text: 'Which opening should go out?' })) ?? undefined))?.props.color).toBe('#E5A50A')
  expect(await cards.find({ type: 'Text', text: /^1 .*waiting for you/ })).toBeDefined()
  // (the two that ended before it stay up, with nothing under Finished, until each is dismissed)
  expect(await finishedCount()).toBe(0)
  for (const id of ['a1', 'a3']) await pressed(cards, `dismiss-${id}`)
  await clock.advance(2_100)
  await until(async () => ((await finishedCount()) === 2 ? true : undefined))
  const before = await finishedCount()
  expect(before).toBe(2)
  expect((await keyed(cards, 'dismiss-a4'))?.props.label).toBe('Dismiss')
  await pressed(cards, 'dismiss-a4')
  await clock.advance(2_100)
  expect(await until(async () => ((await cards.find({ type: 'Text', text: 'Which opening should go out?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => ((await finishedCount()) === before + 1 ? true : undefined))).toBe(true)
  expect(await cards.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await $.agent.spawn({ ...spawn, description: 'Save another rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a5', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't6', reason: 'answer' })
  expect(await until(async () => (await cards.find({ type: 'Text', text: '◐ Delivered' })) ?? undefined)).toBeDefined()
  await pressed(cards, 'dismiss-a5')
  await clock.advance(2_100)
  expect(await until(async () => ((await cards.find({ type: 'Text', text: '◐ Delivered' })) ? undefined : true))).toBe(true)
  expect(await until(async () => ((await finishedCount()) === before + 2 ? true : undefined))).toBe(true)
  // And while the person uses the panel scrolled down, where the drawing on screen is kept while they move: the card dismissed is
  // under Finished in the drawing right after the press, not once they have left the panel alone (18 Nov, the person: "when I
  // click this, the message should go below the finished")
  await $.agent.spawn({ ...spawn, description: 'Save a third rule', prompt: 'save it' } as never)
  await $.turn.complete({ agentId: 'a6', answer: 'The third rule is saved.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer' } as never)
  await cards.unmount()
  const used = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80, scroll: { offset: 20, bodyRows: 50 } }, surface: 'desktop' } as never)
  await ($.ui as any).scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(() => undefined)
  expect(await until(async () => (await keyed(used, 'dismiss-a6')) ?? undefined)).toBeDefined()
  // (the press's write of the cards is slow, as in the app under load: the app draws the panel again before it lands)
  isWriteHeld = true
  await used.press({ key: String((await keyed(used, 'dismiss-a6'))?.key) })
  await used.findAll({ type: 'Text' })
  // (drawn at once as marked done: green where it stood, its presses gone)
  expect((await until(async () => (await used.find({ type: 'Text', text: '✓ Done' })) ?? undefined))?.props.color).toBe('success')
  expect(await keyed(used, 'dismiss-a6')).toBeUndefined()
  writeHeld?.()
  // (green where it stood for its two seconds, then under Finished, in the drawing kept while they use the panel too)
  await clock.advance(2_200)
  expect(await keyed(used, 'dismiss-a6')).toBeUndefined()
  expect(Number(/Finished (\d+)/.exec(String((await keyed(used, 'finished-fold'))?.props.label))?.[1])).toBe(before + 3)
  await used.unmount()
  // A redraw later, and a reload of the cards: all still under Finished, nothing back at the top
  await clock.advance(30_000)
  await $.session.start(start)
  await clock.advance(30_000)
  const after = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await after.find({ type: 'Text', text: /^Result ready/ })).toBeUndefined()
  expect(await after.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  expect(Number(/Finished (\d+)/.exec(String((await keyed(after, 'finished-fold'))?.props.label))?.[1])).toBe(before + 3)
  expect((await after.findAll({ type: 'Button' })).some(b => /^dismiss-/.test(b.key ?? ''))).toBe(false)
})

test('work started from a report keeps its own report linked to it, beside the older one on the same subject', async ($, on) => {
  const { files, clock, opened } = world(on)
  const old = { id: '20261101-0900-revenue', title: 'Revenue', subject: 'Revenue', at: 1_600_000_000_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Revenue was flat.', files: [], agent: '' }
  files.set(`${MEMORY}/reports/${old.id}/meta.json`, JSON.stringify(old))
  files.set(`${MEMORY}/reports/${old.id}/report.md`, 'Revenue was flat.\n')
  await $.session.start(start)
  await $.prompt.submit({ text: `Carry on from the report "Revenue", ${MEMORY}/reports/${old.id}/report.md: look again`, wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Revenue again', prompt: 'look again' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 'u1', name: 'Revenue', repo: '/shop', agentId: 'a1' } as never)
  await $.turn.complete({ agentId: 'a1', answer: `Revenue rose 5% since the last look.\n\n${'Each week is in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metas = await until(async () => {
    const all = [...files.keys()].filter(path => path.endsWith('/meta.json'))
    return all.length === 2 ? all : undefined
  })
  const fresh = JSON.parse(files.get((metas ?? []).find(path => !path.includes(old.id)) ?? '') ?? '{}') as { from?: string; subject: string; question?: string; folder: string }
  expect(fresh.from).toBe(old.id)
  expect(fresh.subject).toBe('Revenue')
  // Filed under the subject's own folder, not the chat's
  expect(fresh.folder).toBe('/shop')
  expect(fresh.question).toBeUndefined()
  // The older one is kept as it was
  expect(files.get(`${MEMORY}/reports/${old.id}/report.md`)).toBe('Revenue was flat.\n')

  // The same work reporting again, and the report it started from, are one row: the newest (the person's words start it again:
  // a task that is done reports again only from a run of its own)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “count the refunds too”' } as never)
  for await (const _ of $.turn.step({ turnId: 't2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  await $.turn.complete({ agentId: 'a1', answer: `Revenue rose 6% once the refunds are counted.\n\n${'Refunds are in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })
  await clock.advance(70_000)
  await until(async () => ([...files.keys()].filter(path => path.endsWith('/meta.json')).length === 3 ? true : undefined))

  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  const rows = (await list.findAll({ type: 'Button' })).filter(one => /^report-\d{8}/.test(one.key ?? ''))
  expect(rows.map(one => one.props.label)).toEqual(['Revenue again'])
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect(await list.find({ type: 'Text', text: /^1$/ })).toBeDefined()
  // No subject heading, no line under the row, no fold of rounds in the list
  expect((await list.findAll({ type: 'Text' })).filter(text => text.text === 'Revenue' || /Revenue rose/.test(text.text))).toHaveLength(0)
  expect((await list.findAll({ type: 'Button' })).some(one => /^rounds-/.test(one.key ?? ''))).toBe(false)

  // Opened, a report names what it started from and its other rounds; a fourth report pane closes the one opened longest ago
  const newest = (await list.findAll({ type: 'Button' })).filter(one => /^report-\d{8}/.test(one.key ?? ''))[0]
  await list.press({ key: newest?.key ?? '' })
  const id = `report-${String(newest?.key).replace(/^report-/, '').replace(/-\d+$/, '')}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Revenue again', bodyColumns: 80 }, surface: 'desktop' } as never)
  const kin = (await one.findAll({ type: 'Button' })).map(button => String(button.props.label))
  expect(kin.some(label => label.includes('Revenue · this result came from it'))).toBe(true)
  expect(kin.some(label => label.includes('Revenue again · earlier result'))).toBe(true)
})

test('a report opened when three are open closes the one opened longest ago', async ($, on) => {
  const { files, opened, closed } = world(on, { panes: ['claudopus', 'report-a', 'reports', 'report-b', 'report-c'] })
  const r = { id: 'd', title: 'Fourth', subject: 'Fourth', at: 1_600_000_000_000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'It was found.', files: [], agent: '' }
  files.set(`${MEMORY}/reports/d/meta.json`, JSON.stringify(r))
  files.set(`${MEMORY}/reports/d/report.md`, 'It was found.\n')
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'report-d')
  await until(async () => opened.includes('report-d') || undefined)
  expect(closed.filter(id => id.startsWith('report-'))).toEqual(['report-a'])
})

test('a result saved earlier that lists questions shows them as plain text under Questions it left, with nothing to press; the list has no group of what waits, the chat is told of no question, and a change asked of it goes as the person\'s message', async ($, on) => {
  const { files, submitted, resumed } = world(on)
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const reps = [
    { ...base, id: 'old', title: 'Old', at: 1_600_000_000_000, gist: 'Old one.', question: 'Ship the old one?' },
    { ...base, id: 'two', title: 'Two', at: 1_600_000_100_000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?', choices: ['Public', 'Private'] }] },
    { ...base, id: 'ends', title: 'Ends', at: 1_600_000_200_000, gist: 'Ends asking.' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n\nShall I go on?\n`)
  }
  await $.session.start(start)
  // The panel counts none of them as waiting
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 3')
  expect(await pane.find({ type: 'Text', text: /waiting for you/i })).toBeUndefined()
  await pane.unmount()
  // The list is newest first, whatever a result lists
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Button' })).filter(one => /^report-/.test(one.key ?? '')).map(one => one.props.label)).toEqual(['Ends', 'Two', 'Old'])
  // Opened, each shows what it listed as dim text between its title and its summary, in the order it listed them, and no button
  // but Archive and Continue; one that lists nothing has no such part
  const cases: { id: string; heads: string[]; left: string[] }[] = [
    { id: 'old', heads: ['Old', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Ship the old one?'] },
    { id: 'two', heads: ['Two', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Delete the folder?', 'Make it public?'] },
    { id: 'ends', heads: ['Ends', 'Summary', 'In full', 'Follow-up'], left: [] },
  ]
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  for (const one of cases) {
    const tab = await $.ui.mount({ ...LIST, requestId: `report-${one.id}`, props: { ...LIST.props, title: one.id, bodyColumns: 80 }, surface: 'desktop' } as never)
    const texts = await tab.findAll({ type: 'Text' })
    expect([one.id, texts.filter(text => text.props.bold).map(text => text.text)]).toEqual([one.id, one.heads])
    expect([one.id, texts.filter(text => /\?$/.test(String(text.text))).map(text => [text.text, text.props.dimColor, text.props.color])]).toEqual([one.id, one.left.map(text => [text, true, undefined])])
    expect([one.id, (await tab.findAll({ type: 'Button' })).map(button => String(button.props.label)).filter(label => !/ · /.test(label))]).toEqual([one.id, ['Archive', 'Message']])
    await tab.unmount()
  }
  // Message on a result whose task has no card left to carry on from: what is sent from the box above the chat goes as
  // the person's own message naming the result and its path, and nothing is put in the chat's own box
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-old', props: { ...LIST.props, title: 'Old', bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(tab, 'report-carry')
  expect((await until(async () => bar.find({ type: 'Text', text: /^↳ Message to/ })))?.text).toBe('↳ Message to “Old”')
  const field = ((await bar.findAll({ type: 'Input' } as never)) as { key?: string }[])[0]
  await bar.input({ key: field?.key ?? '', text: 'ship it after all' })
  expect(await until(async () => submitted[0])).toMatch(new RegExp(`^Continue from the result "Old" \\(13 Sep 2020, \\d\\d:26\\), ${MEMORY}/reports/old/report\\.md: ship it after all$`))
  expect(submitted).toHaveLength(1)
  expect(resumed).toEqual([])
  expect(filled).toEqual([])
  await tab.unmount()
  await bar.unmount()
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/old/report.md')
  expect(told).not.toContain('waiting on')
  expect(told).not.toContain('Ship the old one?')
  expect(told).not.toContain('Make it public?')
  expect(told).not.toContain('Shall I go on?')
})

test('a result archived with one press leaves the list, its tab, the count and the note, keeps its text, and comes back from the folded Archived row', async ($, on) => {
  const { files, closed } = world(on, { panes: ['claudopus', 'reports', 'report-b'] })
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [] }
  const reps = [
    { ...base, id: 'a0', title: 'Revenue', at: 1_600_000_000_000, gist: 'Revenue was flat.', agent: 'w1' },
    { ...base, id: 'a1', title: 'Revenue', at: 1_600_000_100_000, gist: 'Revenue rose.', agent: 'w1' },
    { ...base, id: 'b', title: 'Bots', subject: 'Bots', at: 1_600_000_200_000, gist: 'A bot wave.', agent: '', waiting: [{ text: 'Block them?' }] },
    { ...base, id: 'c', title: 'Kept', subject: 'Kept', at: 1_600_000_300_000, gist: 'Still here.', agent: '' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n`)
  }
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()

  // From its tab: the tab closes, and the text stays as it was
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-b', surface: 'desktop' } as never)
  await pressed(tab, 'report-archive')
  await until(async () => closed.includes('report-b') || undefined)
  expect(JSON.parse(files.get(`${MEMORY}/reports/b/meta.json`) ?? '{}').archived).toBe(1_700_000_000_000)
  expect(files.get(`${MEMORY}/reports/b/report.md`)).toBe('A bot wave.\n')
  expect(await until(async () => list.find({ type: 'Text', text: /^2$/ }))).toBeDefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 2')
  expect(await pane.find({ type: 'Text', text: '●' })).toBeUndefined()

  // From its row: every round of that work goes
  await pressed(list, 'archive-a1')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/a0/meta.json`) ?? '{}').archived ? true : undefined))
  expect(JSON.parse(files.get(`${MEMORY}/reports/a1/meta.json`) ?? '{}').archived).toBeDefined()
  expect(await until(async () => list.find({ type: 'Text', text: /^1$/ }))).toBeDefined()
  expect(await keyed(list, 'report-a1')).toBeUndefined()

  // The chat is told only of the one kept, and of no question
  const told = (await $.prompt.submit({ text: 'what is new', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/c/report.md')
  expect(told).not.toContain('reports/b/')
  expect(told).not.toContain('reports/a1/')
  expect(told).not.toContain('Block them?')

  // The way back: one folded row, unfolded to each with Bring back
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▸ Archived 2')
  expect(await keyed(list, 'unarchive-b')).toBeUndefined()
  await pressed(list, 'archived-fold')
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▾ Archived 2')
  await pressed(list, 'unarchive-b')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/b/meta.json`) ?? '{}').archived ? undefined : true))
  expect(await until(async () => list.find({ type: 'Text', text: /^2$/ }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting for you$/ })).toBeUndefined()
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▾ Archived 1')

  // An archived one opened from the row says so, with Bring back in place of Archive
  const old = await $.ui.mount({ ...LIST, requestId: 'report-a1', surface: 'desktop' } as never)
  expect((await keyed(old, 'report-archive'))?.props.label).toBe('Bring back')
  expect(await old.find({ type: 'Text', text: /· archived$/ })).toBeDefined()

  // One that came after the list was opened, archived and brought back, is listed in its place
  await pressed(pane, 'reports-open')
  const d = { ...base, id: 'd', title: 'Later', subject: 'Later', at: 1_600_000_400_000, gist: 'Came later.', agent: '' }
  files.set(`${MEMORY}/reports/d/meta.json`, JSON.stringify(d))
  files.set(`${MEMORY}/reports/d/report.md`, 'Came later.\n')
  await pressed(old, 'report-archive')
  const later = await $.ui.mount({ ...LIST, requestId: 'report-d', surface: 'desktop' } as never)
  await until(async () => ((await keyed(later, 'report-archive'))?.props.label === 'Archive' ? true : undefined))
  await pressed(later, 'report-archive')
  await until(async () => keyed(list, 'unarchive-d'))
  await pressed(list, 'unarchive-d')
  expect(await until(async () => keyed(list, 'report-d'))).toBeDefined()
})

test('the results list is one line a row, newest first with no group of what waits: the five newest, the rest folded, rounds of one work as one row, archived and told as one', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'A long line that no row shows.' }
  const at = (n: number) => 1_700_000_000_000 - n * 60_000
  const reps = [
    // A video in three rounds by three pieces of work, each started from the one before, each saved earlier with a question listed
    { ...base, id: 'v1', title: 'Explainer video', subject: 'Claude workflow', at: at(60), agent: 'w1', waiting: [{ text: 'Keep the first cut?' }] },
    { ...base, id: 'v2', title: 'Video second cut', subject: 'Claude workflow', at: at(40), agent: 'w2', from: 'v1', waiting: [{ text: 'Keep the second cut?' }] },
    { ...base, id: 'v3', title: 'Video third cut', subject: 'Claude workflow', at: at(20), agent: 'w3', from: 'v2', waiting: [{ text: 'Keep the third cut?' }] },
    // Two looks on one subject whose titles lead with it
    { ...base, id: 'i1', title: 'Old-chat index: first', subject: 'Old-chat index', at: at(300), agent: 'w4' },
    { ...base, id: 'i2', title: 'Old-chat index: second', subject: 'Old-chat index', at: at(290), agent: 'w5' },
    // Eight more on one broad subject, none joined
    ...Array.from({ length: 8 }, (_, n) => ({ ...base, id: `p${n}`, title: `Panel change ${n}`, subject: 'Claude workflow', at: at(100 + n), agent: `x${n}` })),
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n`)
  }
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Results', bodyColumns: 80 }, surface: 'desktop' } as never)
  const titles = async () => (await list.findAll({ type: 'Button' })).filter(one => /^report-/.test(one.key ?? '')).map(one => String(one.props.label))
  // 13 reports are 10 rows: the video one, the index one, eight panel changes
  expect(await list.find({ type: 'Text', text: /^10$/ })).toBeDefined()
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)).toEqual(['Results', 'Newest'])
  expect(await titles()).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3'])
  // Nothing under a title: no finding, no subject, no question it lists, no mark; the time, Archive
  expect(await list.find({ type: 'Text', text: /long line|waiting|Keep the|Claude workflow/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text', text: /^●$/ })).length).toBe(0)
  const rowBoxes = (await list.drawn()) as unknown as { props?: { key?: string; height?: number }; children?: unknown[] }
  const heights: number[] = []
  const walk = (n: unknown) => {
    const one = n as { props?: { key?: string; height?: number }; children?: unknown[] }
    if (one?.props?.key?.startsWith('entry-')) heights.push(one.props.height ?? 0)
    for (const child of one?.children ?? []) walk(child)
  }
  walk(rowBoxes)
  expect(heights).toEqual([1, 1, 1, 1, 1])
  // The rest is one row that unfolds
  expect((await keyed(list, 'earlier-fold'))?.props.label).toBe('▸ Earlier 5')
  await pressed(list, 'earlier-fold')
  expect((await titles()).slice(5)).toEqual(['Panel change 4', 'Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second'])

  // The chat is told of the results, and of no question any of them lists
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('reports/v3/report.md')
  expect(told).not.toContain('Keep the third cut?')
  expect(told).not.toContain('Keep the first cut?')
  expect(told).not.toContain('Keep the second cut?')

  // Opened, its earlier rounds are listed inside it
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-v3', surface: 'desktop' } as never)
  const kin = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(kin.some(label => label.includes('Video second cut · this result came from it'))).toBe(true)
  expect(kin.some(label => label.includes('Explainer video · earlier result'))).toBe(true)

  // Archived from its row, every round goes
  await pressed(list, 'archive-v3')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/v1/meta.json`) ?? '{}').archived ? true : undefined))
  expect(['v1', 'v2', 'v3'].map(id => Boolean(JSON.parse(files.get(`${MEMORY}/reports/${id}/meta.json`) ?? '{}').archived))).toEqual([true, true, true])
  expect(await until(async () => keyed(list, 'archived-fold'))).toBeDefined()
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▸ Archived 1')
})

// 20 Nov: with about a thousand results, Earlier unfolded every one of them, past what the app draws: the tab said only that it
// couldn't be shown, and Earlier seemed to do nothing
test('Earlier and Archived unfold a page of results at a time, with a row that shows more, so the tab is always drawn', async ($, on) => {
  const { files } = world(on)
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'Done.' }
  for (let n = 0; n < 700; n++) {
    const r = { ...base, id: `2026111${n % 10}-${String(1000 + n)}-result-${n}`, title: `Result number ${n} with a title of a usual length`, at: 1_700_000_000_000 - n * 60_000, agent: `w${n}`, ...(n >= 600 ? { archived: true } : {}) }
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, 'Done.\n')
  }
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Results', bodyColumns: 80 }, surface: 'desktop' } as never)
  const titles = async () => (await list.findAll({ type: 'Button' })).filter(one => /^report-/.test(one.key ?? '')).length
  expect(await until(async () => keyed(list, 'earlier-fold'))).toBeDefined()
  expect((await keyed(list, 'earlier-fold'))?.props.label).toBe('▸ Earlier 595')
  await pressed(list, 'earlier-fold')
  expect(await until(async () => ((await titles()) === 55 ? true : undefined))).toBe(true)
  expect(appDraws(await list.drawn()).isDrawn).toBe(true)
  expect((await keyed(list, 'earlier-more'))?.props.label).toBe('Show 50 more')
  await pressed(list, 'earlier-more')
  expect(await until(async () => ((await titles()) === 105 ? true : undefined))).toBe(true)
  // Shown past what the app draws, it takes pages back until it fits, never the tab's message alone
  for (let n = 0; n < 12; n++) await pressed(list, 'earlier-more')
  expect(await until(async () => ((await titles()) > 105 ? true : undefined))).toBe(true)
  expect(appDraws(await list.drawn()).isDrawn).toBe(true)
  expect(await list.find({ type: 'Text', text: "Claudopus couldn't show this tab" })).toBeUndefined()
  // Folded and unfolded again, it starts at one page
  await pressed(list, 'earlier-fold')
  await pressed(list, 'earlier-fold')
  expect(await until(async () => ((await titles()) === 55 ? true : undefined))).toBe(true)
  // Archived the same way
  await pressed(list, 'archived-fold')
  expect(await until(async () => ((await titles()) === 105 ? true : undefined))).toBe(true)
  expect((await keyed(list, 'archived-more'))?.props.label).toBe('Show 50 more')
  expect(appDraws(await list.drawn()).isDrawn).toBe(true)
  await list.unmount()
})

test('work whose brief names one result on what it is about is a round of that work; one naming several, or one on something else, is not', async ($, on) => {
  const { files, clock } = world(on)
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'Done.', agent: 'w0' }
  for (const r of [{ ...base, id: '20261111-1853-explainer-video', title: 'Claudopus explainer video', at: 1 }, { ...base, id: '20261111-1700-logo', title: 'Draw the logo', at: 2 }]) (files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r)), files.set(`${MEMORY}/reports/${r.id}/report.md`, "Done.\n"))
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the video clearer', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Video second cut', prompt: `Start from ${MEMORY}/reports/20261111-1853-explainer-video/report.md` } as never)
  await $.agent.spawn({ ...spawn, description: 'Fix the panel', prompt: `Start from ${MEMORY}/reports/20261111-1853-explainer-video/report.md` } as never)
  await $.agent.spawn({ ...spawn, description: 'Video and logo', prompt: `Read ${MEMORY}/reports/20261111-1853-explainer-video/report.md and ${MEMORY}/reports/20261111-1700-logo/report.md` } as never)
  for (const id of ['a1', 'a2', 'a3']) await $.turn.complete({ agentId: id, answer: `Finished ${id}.\n\n${'It is in the table. '.repeat(30)}`, durationMs: 1, isAborted: false, turnId: `t-${id}`, reason: 'answer' })
  await clock.advance(10)
  const metas = await until(async () => {
    const all = [...files.entries()].filter(([path]) => path.endsWith('/meta.json')).map(([, text]) => JSON.parse(text) as { agent: string; from?: string })
    return all.length === 5 ? all : undefined
  })
  expect(['a1', 'a2', 'a3'].map(id => metas?.find(one => one.agent === id)?.from ?? '')).toEqual(['20261111-1853-explainer-video', '', ''])
})

test('every button of the results list and of a result takes a new key whenever its drawing changes, and keeps it while nothing does, so the app never presses a handle that is gone', async ($, on) => {
  const { files, clock, opened } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const put = (r: { id: string; title: string; at: number; waiting?: { text: string }[] }) => {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify({ ...base, gist: 'It was found.', ...r }))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, 'It was found, and it is written here in full.\n')
  }
  put({ id: 'bucket', title: 'FaceIQ bucket migration plan', at: 1_699_000_000_000, waiting: [{ text: 'Start step 0?' }] })
  put({ id: 'header', title: 'Rethink the panel header', at: 1_699_000_100_000, waiting: [{ text: 'Reopen the M4 chat?' }] })
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Results', bodyColumns: 80 }, surface: 'desktop' } as never)
  const keys = async () => (await list.findAll({ type: 'Button' })).map(one => String(one.key))
  const first = await keys()
  expect(first.some(key => /^report-bucket-\d+$/.test(key))).toBe(true)
  // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
  await clock.advance(5000)
  expect(await keys()).toEqual(first)
  // A result arriving from another chat changes the drawing: no key stays, so the app takes every button afresh
  put({ id: 'fresh', title: 'Something new', at: 1_700_000_000_000 })
  // (a search of the memory reads the results again, as the panel's own look does)
  await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'found' } as never)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => /^report-fresh-\d+$/.test(String(one.key))) || undefined))).toBe(true)
  const after = await keys()
  expect(after.filter(key => first.includes(key))).toEqual([])
  // and a press on either named result opens it, drawn
  await pressed(list, 'report-bucket')
  expect(await until(async () => opened.includes('report-bucket') || undefined)).toBe(true)
  await pressed(list, 'report-header')
  expect(await until(async () => opened.includes('report-header') || undefined)).toBe(true)
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-header', props: { ...LIST.props, title: 'Rethink the panel header', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await tab.find({ type: 'Text', text: /^Rethink the panel header$/ })).toBeDefined()
  const tabKeys = (await tab.findAll({ type: 'Button' })).map(one => String(one.key))
  // The result's own tab follows the same rule: changed on another Mac, it changes with no press here, and every key moves
  expect(await tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })).toBeDefined()
  put({ id: 'header', title: 'Rethink the panel header', at: 1_699_000_100_000, waiting: [] })
  await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't2', query: 'found' } as never)
  expect(await until(async () => ((await tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })) ? undefined : true))).toBe(true)
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.key)).filter(key => tabKeys.includes(key))).toEqual([])
})
