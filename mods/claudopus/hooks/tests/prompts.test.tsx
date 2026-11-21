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
const world = (on: On, options: { tailscale?: string; reply?: string; complete?: (e: { model: string; system?: string; prompt: string }) => string | null | undefined; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unseen?: string[]; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; shells?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean; live?: (file: string) => number | undefined; owner?: (pid: string) => 'mine' | 'other' | 'hidden' }; usage?: (script: string) => string; startedOn?: Record<string, string>; release?: Release; stream?: (e: { agentId?: string }) => AsyncGenerator<unknown, void> } = {}) => {
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
      return said === undefined ? ok('', 7) : ok(said)
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

// Claude Code's own prompts and the commands it blocked, each asked as one Permission block

const AMBER = '#E5A50A'
const BLOCKED = 'Claude Code blocked this command. Run it anyway?'
type PromptPane = { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; text?: unknown; props: Record<string, unknown> }[]> }
// Allow or Don't allow on this chat's own prompt: its key is prompt-this-<the prompt's id>-yes|no-<the count of presses>
const promptButton = async (pane: PromptPane, said: 'yes' | 'no') => (await pane.findAll({ type: 'Button' })).find(one => new RegExp(`^prompt-this-.+-${said}-\\d+$`).test(one.key ?? ''))
const textsOf = async (pane: PromptPane) => (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
const labelsOf = async (pane: PromptPane) => (await pane.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
// The grey lines that say what was pressed, each with how it is drawn
const pressedLines = async (pane: PromptPane) => (await pane.findAll({ type: 'Text' })).filter(one => String(one.text ?? '').startsWith('✓ You pressed'))
// A held call's answer, which must come with the press alone: no second let go by wake(), no move of the clock
const answered = async <T,>(call: Promise<T>) => Promise.race([call, new Promise<'still held'>(resolve => setTimeout(() => resolve('still held'), 10_000))])

test("this chat waiting on Claude Code's own prompt is listed with its prompt, and idle chats beside it are not", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle}\n`)
  await $.session.start(start)
  void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } } as never)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Clear the build folder' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await keyed(list, 'quiet-fold')).toBeUndefined()
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder' } as never)
  await list.unmount()
})

test("a prompt for a task's call is a Permission block on that task's card, amber and counted once, in its file with only what the others may read, said aloud once, and gone as the call ends; the chat's own question is at the top as this chat's", async ($, on) => {
  const { files, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  // The task's call raises Claude Code's prompt: the mod holds it for a press, and answered in Claude Code's own box it passes on untouched
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The one block: its kind, the question in amber and bold, what it is for, the command whole, Allow and Don't allow
  const question = await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))
  expect([question?.props.color, question?.props.bold]).toEqual([AMBER, true])
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Clear the build folder' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'rm -rf build' })).toBeDefined()
  expect([(await until(async () => promptButton(list, 'yes')))?.props.label, (await promptButton(list, 'no'))?.props.label]).toEqual(['Allow', "Don't allow"])
  // Nothing sends the person elsewhere to answer it, and none of the old words is left
  expect((await textsOf(list)).filter(one => /box at the bottom of this chat|^Needs your permission$|^Yes: |^No: /.test(one))).toEqual([])
  expect((await labelsOf(list)).filter(one => /^(Yes|No|Allow once|Deny|Run it)$/.test(one))).toEqual([])
  // On the card of the task whose command raised it, under its title: never a block of its own above the cards, nor named as the chat's
  const texts = await textsOf(list)
  expect(texts.indexOf('Clean the build')).toBeGreaterThan(-1)
  expect(texts.indexOf('Clean the build')).toBeLessThan(texts.indexOf('Run this command?'))
  expect(texts.filter(one => one === 'Clean the build')).toHaveLength(1)
  expect(texts.filter(one => one === 'Run this command?')).toHaveLength(1)
  expect(texts.filter(one => one.startsWith('Permission ·'))).toEqual([])
  // That card waits for the person: its edge is amber, and the head line counts it once
  expect(await until(async () => list.find({ type: 'Text', text: /^1 waiting for you/ }))).toBeDefined()
  expect((await list.findAll({ type: 'Box' })).filter(one => !one.key?.startsWith('outline-') && one.props.backgroundColor === AMBER)).toHaveLength(1)
  // The others see it in this chat's file, with the task it came from and nothing of the call beyond what the block shows
  await clock.advance(1000)
  const shared = () => JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}') as { prompts?: Record<string, unknown>[]; answeredPrompts?: unknown }
  expect(shared().prompts).toEqual([{ id: expect.any(String), text: 'Run this command?', title: 'Clean the build', at: expect.any(Number), kind: 'allow', about: 'Clear the build folder', detail: 'rm -rf build', isHeld: true }])
  // Not told before the app itself says the prompt is still waiting; then told once, as a question is
  await clock.advance(5000)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual([])
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toEqual(['Clean the build has a question for you | Run this command?'])
  // Answered in Claude Code's own box, the call runs and ends: the held request gives no answer of the mod's, and the block goes,
  // here and in the file, with nothing said of a press nobody made
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' } as never)
  expect(((await answered(asked)) as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this command?' })) ? undefined : true))).toBe(true)
  expect(await promptButton(list, 'yes')).toBeUndefined()
  expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it|You said no/.test(one))).toEqual([])
  expect(await until(async () => ((await list.find({ type: 'Text', text: /waiting for you/ })) ? undefined : true))).toBe(true)
  await clock.advance(1000)
  expect([shared().prompts, shared().answeredPrompts]).toEqual([undefined, undefined])
  // The chat's own question is answered in Claude Code's box: at the top as this chat's, with where to answer and nothing to press;
  // answered at once, it is not told
  await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which colour for the nose?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Question · This chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })).toBeDefined()
  await $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('has a question for you'))).toHaveLength(1)
  await list.unmount()
})

test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  // The same command already running elsewhere, as in a terminal, says nothing of this call
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeDefined()
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeDefined()
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await clock.advance(2000)
  // Seen running, it was allowed in Claude Code's own box: the block goes, the held request gives no answer of the mod's, and
  // nothing says a press was made here
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this command?' })) ? undefined : true))).toBe(true)
  expect(((await answered(asked)) as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it/.test(one))).toEqual([])
  // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
  files.set('settings:allow', '1')
  await $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } } as never)
  await clock.advance(1000)
  expect(await list.find({ type: 'Text', text: 'Write the file notes.md?' })).toBeUndefined()
  await list.unmount()
})

test("another chat's open prompt shows amber with that chat's name and nothing to allow it with, before the chats that only work; on this Mac a press opens that chat, on another Mac it says where", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const asks = 'Run this command?'
  const waiting = (at: number, chat: string, title: string, link: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [], prompts: [{ id: 'toolu_1', text: asks, title: 'Interesting facts', kind: 'allow', about: 'Cross-repo duplicate files', at, isHeld: true }], link })
  // One M4 chat with Remote Control on, which opens here; one with only the app's own id there, which does not
  const remote = JSON.stringify({ ...JSON.parse(waiting(NOW, 'chat-rc', 'M4 Remote', '')), link: { bridge: 'session_01M4Remote', app: 'local_m4-rc' } })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${waiting(NOW, 'chat-m4', 'M4 GitHub', 'claude://code/continue?session=local_m4')}\n---claudopus-live---\n${remote}\n`)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // A chat of this Mac with no work but an open prompt is listed; a link that is not the app's own is dropped
  files.set(`${MEMORY}/live/chat-w.json`, waiting(NOW, 'chat-w', 'Web chat', 'claude://code/continue?session=local_ab-12'))
  files.set(`${MEMORY}/live/chat-x.json`, waiting(NOW, 'chat-x', 'Odd chat', 'https://example.com'))
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // Each says whose it is and where it is answered: in that chat, named, on its Mac
  expect(await until(async () => list.find({ type: 'Text', text: 'Answer it in the chat “M4 GitHub”, on m4.' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “M4 Remote”, which runs on m4.' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Web chat”.' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Odd chat”.' })).toBeDefined()
  expect((await textsOf(list)).filter(one => one === 'Permission · Interesting facts')).toHaveLength(4)
  // What waits on the person comes before the chat that only works
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold)
  const questions = bold.filter(one => one.text === asks)
  expect(questions.map(one => one.props.color)).toEqual([AMBER, AMBER, AMBER, AMBER])
  expect(bold.map(one => one.text).lastIndexOf(asks)).toBeLessThan(bold.map(one => one.text).indexOf('Billing page'))
  // No press here answers another chat's prompt: no Allow, no Don't allow
  expect((await labelsOf(list)).filter(one => /^(Allow|Don't allow|Yes|No)$/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Button' })).filter(one => /^prompt-.*-(yes|no)-\d+$/.test(one.key ?? ''))).toEqual([])
  // Open chat: the M4 chat with Remote Control, by its Remote Control id, and the chat of this Mac with the app's link; the M4 chat
  // with only the app's own id there says where to answer instead
  const opens = (await list.findAll({ type: 'Button' })).filter(one => one.props.label === 'Open chat')
  expect(opens).toHaveLength(2)
  await list.press({ key: opens.find(one => String(one.key).includes('chat-rc'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01M4Remote'])
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(one => one.props.label === 'Open chat' && String(one.key).includes('chat-w'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.includes('local_ab-12')))).toEqual(['open', 'claude://code/continue?session=local_ab-12'])
  // Answered there, its file no longer carries it, and its block leaves; with nothing going on, its chat is named no more
  files.set(`${MEMORY}/live/chat-w.json`, JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => one.props.label === 'Open chat' && String(one.key).includes('chat-w')) ? undefined : true))).toBe(true)
  expect((await textsOf(list)).filter(one => one.includes('Web chat'))).toEqual([])
  await list.unmount()
})

test("a message the chat passes to a task is asked with that task's name and the message whole, never a tool's own name; answered in Claude Code's own box, refused, allowed or interrupted, its block goes as the call ends with nothing said of a press", async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the cards', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the panel cards', prompt: 'fix the cards' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const message = 'Send this message to the task “Fix the panel cards”?'
  const gone = async (text: string) => until(async () => ((await list.find({ type: 'Text', text })) ? undefined : true))
  const first = $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'Make the buttons bigger too' } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: message }))).toBeDefined()
  // The chat's own call: at the top as this chat's, the message whole in the block
  expect(await list.find({ type: 'Text', text: 'Permission · This chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Make the buttons bigger too' })).toBeDefined()
  expect([(await promptButton(list, 'yes'))?.props.label, (await promptButton(list, 'no'))?.props.label]).toEqual(['Allow', "Don't allow"])
  // No tool's own name anywhere on it
  expect((await textsOf(list)).some(one => one.includes('SendMessage'))).toBe(false)
  // How each answer given in Claude Code's own box ends: the block goes, the held request passes on with no answer of the mod's
  for (const [tool, input, laid, asks, agent] of [
    ['SendMessage', { to: 'a1', message: 'Make the buttons bigger too' }, 'refuse', message, undefined],
    ['SendMessage', { to: 'a1', message: 'One more thing' }, '', message, undefined],
    ['Bash', { command: 'make clean', description: 'Clean up' }, 'interrupt', 'Run this command?', 'a1'],
  ] as const) {
    const held = tool === 'SendMessage' && laid === 'refuse' ? first : $.classic.PermissionRequest({ tool_name: tool, tool_input: input, ...(agent ? { agent_id: agent } : {}) } as never)
    expect(await until(async () => list.find({ type: 'Text', text: asks }))).toBeDefined()
    if (laid) files.set(laid, tool)
    await $.tool.call({ tool, ...input, ...(agent ? { agentId: agent } : {}) } as never)
    if (laid) files.delete(laid)
    expect([tool, laid, ((await answered(held)) as { decision?: unknown } | undefined)?.decision]).toEqual([tool, laid, undefined])
    expect(await gone(asks)).toBe(true)
    expect((await textsOf(list)).filter(one => /^✓ You pressed|You allowed it|You said no|It ended before you answered/.test(one))).toEqual([])
  }
  await list.unmount()
})

test("another chat's prompt shows with its task's name, or with none as that chat's own, never as this chat's; an answer an older version's file still lists is not shown", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW }, { id: 'toolu_7', text: 'Open a web page on example.com?', title: 'Tidy', kind: 'allow', at: NOW + 1 }], answeredPrompts: [{ id: 'toolu_8', text: 'Send this message to the task “Tidy”?', title: 'Tidy', kind: 'allow', answered: 'yes', done: 'it was sent', at: NOW, endedAt: NOW }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Run this command?' }))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: 'Count files' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Open a web page on example.com?' })).toBeDefined()
  const texts = await textsOf(list)
  expect(texts.filter(one => /^Permission/.test(one))).toEqual(['Permission', 'Permission · Tidy'])
  expect(texts.filter(one => one === 'Answer it in the chat “Other chat”.')).toHaveLength(2)
  expect(texts.filter(one => /Send this message|You allowed it|it was sent/.test(one))).toEqual([])
  await list.unmount()
})

test("Allow on a prompt's block allows the call as Claude Code's own box would, on the press alone: the block goes at once and one grey line says what was pressed", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } } as never)
  const key = String((await until(async () => promptButton(list, 'yes')))?.key)
  // Pressed twice at once, as a double click: one answer. The held request ends with the press, with no second gone by
  await Promise.all([list.press({ key }), list.press({ key }).catch(() => undefined)])
  expect(((await answered(asked)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  expect(await until(async () => ((await promptButton(list, 'yes')) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeUndefined()
  // One grey line, where the block was: no box, no colour, nothing of what the call then does
  const lines = await until(async () => ((await pressedLines(list)).length ? pressedLines(list) : undefined))
  expect(lines?.map(one => [one.text, one.props.dimColor, one.props.color])).toEqual([['✓ You pressed “Allow”', true, undefined]])
  // The call runs and ends: nothing more is said of it
  await $.tool.call({ tool: 'Bash', command: 'npm test', description: 'Run the tests' } as never)
  await clock.advance(1000)
  expect((await pressedLines(list)).map(one => one.text)).toEqual(['✓ You pressed “Allow”'])
  expect((await textsOf(list)).filter(one => /You allowed it|it ran|running now/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.color === '#26A269' || one.props.color === AMBER).map(one => one.text)).toEqual([])
  // The chat's own prompt to start a task, allowed: the task takes its card, and nothing on that card waits for the person
  const input = { description: 'Show scan numbers', prompt: 'show the scan numbers', run_in_background: true }
  const started = $.classic.PermissionRequest({ tool_name: 'Agent', tool_input: input } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' }))).toBeDefined()
  await list.press({ key: String((await until(async () => promptButton(list, 'yes')))?.key) })
  expect(((await answered(started)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  await $.tool.call({ tool: 'Agent', ...input } as never)
  await $.agent.spawn({ ...spawn, description: 'Show scan numbers', prompt: 'show the scan numbers' } as never)
  await clock.advance(1000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Show scan numbers' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /waiting for you/ })).toBeUndefined()
  expect(await promptButton(list, 'yes')).toBeUndefined()
  await list.unmount()
})

test("Don't allow on a prompt's block refuses the call on the press alone: the chat's own turn stops, and a task is told and carries on; one grey line says it, at the top for the chat's and on the task's card for its own", async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'tidy up', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Tidy the repo', prompt: 'tidy up' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const said = "✓ You pressed “Don't allow”"
  const own = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf dist', description: 'Delete the build' } } as never)
  await list.press({ key: String((await until(async () => promptButton(list, 'no')))?.key) })
  expect(((await answered(own)) as { decision?: unknown }).decision).toEqual({ behavior: 'deny', message: expect.stringContaining("pressed Don't allow"), interrupt: true })
  expect(await until(async () => ((await promptButton(list, 'no')) ? undefined : true))).toBe(true)
  expect((await until(async () => ((await pressedLines(list)).length ? pressedLines(list) : undefined)))?.map(one => [one.text, one.props.dimColor])).toEqual([[said, true]])
  // The chat's own line is above the cards; the task's own comes on its card, under its title
  const before = await textsOf(list)
  expect(before.indexOf(said)).toBeLessThan(before.indexOf('Tidy the repo'))
  const work = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'git clean -fd', description: 'Clean the tree' }, agent_id: 'a1' } as never)
  expect(await until(async () => list.find({ type: 'Markdown', text: 'Clean the tree' }))).toBeDefined()
  await list.press({ key: String((await until(async () => promptButton(list, 'no')))?.key) })
  const decision = ((await answered(work)) as { decision?: { behavior?: string; interrupt?: unknown; message?: string } }).decision
  expect([decision?.behavior, decision?.interrupt]).toEqual(['deny', undefined])
  expect(decision?.message).toContain('continue without it')
  expect(await until(async () => ((await pressedLines(list)).length === 2 ? true : undefined))).toBe(true)
  const after = await textsOf(list)
  expect(after.lastIndexOf(said)).toBeGreaterThan(after.indexOf('Tidy the repo'))
  expect(await list.find({ type: 'Text', text: 'Run this command?' })).toBeUndefined()
  expect(after.filter(one => /You said no|told Claude|waiting for what you say next/.test(one))).toEqual([])
  await list.unmount()
})

test("Claude Code's own question or plan has nothing to press on its block: it says where to answer it", async ($, on) => {
  world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  for (const [tool, input, asks, where] of [
    ['AskUserQuestion', { questions: [{ question: 'Which colour?' }] }, 'Which colour?', 'Pick your answer in the box at the bottom of this chat.'],
    ['ExitPlanMode', { plan: 'First the nose, then the ears.' }, 'Approve this plan?', 'Answer it in the box at the bottom of this chat.'],
  ] as const) {
    // (not held: the request passes on at once, for Claude Code's own box)
    const r = await answered($.classic.PermissionRequest({ tool_name: tool, tool_input: input } as never))
    expect([tool, (r as { decision?: unknown } | undefined)?.decision]).toEqual([tool, undefined])
    expect(await until(async () => list.find({ type: 'Text', text: asks }))).toBeDefined()
    expect(await list.find({ type: 'Text', text: 'Question · This chat' })).toBeDefined()
    expect(await list.find({ type: 'Text', text: where })).toBeDefined()
    expect((await list.findAll({ type: 'Button' })).filter(one => String(one.key ?? '').startsWith('prompt-'))).toEqual([])
    await $.tool.call({ tool, ...input } as never)
    expect(await until(async () => ((await list.find({ type: 'Text', text: asks })) ? undefined : true))).toBe(true)
  }
  await list.unmount()
})

test("another chat's held prompt has no Allow or Don't allow here, only where to answer it; an answer a file leaves for this chat's own prompt answers nothing", async ($, on) => {
  const { files, clock, wake } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-o.json`, JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW, isHeld: true }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Markdown', text: 'Count files' }))).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).filter(one => String(one.key ?? '').startsWith('prompt-'))).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Answer it in the chat “Other chat”.' })).toBeDefined()
  // This chat's own prompt: an Allow left in a file, as another chat or another Mac could leave one, does not answer it
  let settled = false
  const asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make', description: 'Build it' } } as never).then(r => ((settled = true), r))
  const allow = await until(async () => promptButton(list, 'yes'))
  const id = String(allow?.key ?? '').replace(/^prompt-this-/, '').replace(/-yes-\d+$/, '')
  expect(id).not.toBe('')
  for (const [n, choice] of ['yes', 'Allow', 'allow'].entries()) files.set(`${MEMORY}/live/answers/engine-id/${n}-a.json`, JSON.stringify({ card: `prompt:${id}`, choice, isReply: false, ask: 'Run this command?', askAt: NOW, at: NOW + 6000 }))
  await clock.advance(5000)
  wake()
  await clock.advance(1000)
  wake()
  expect(settled).toBe(false)
  expect([...files.keys()].filter(path => path.includes('/live/answers/engine-id/'))).toEqual([])
  expect((files.get(`${MEMORY}/log.md`) ?? '')).toContain('left in a file put away unread')
  // Its own Allow, pressed in this chat's panel, still answers it
  await list.press({ key: String((await promptButton(list, 'yes'))?.key) })
  expect(((await answered(asked)) as { decision?: unknown }).decision).toEqual({ behavior: 'allow' })
  await list.unmount()
})

test("a call Claude Code refuses a background task with no prompt, as auto mode does, asks nothing when it is no command the person could run: nothing waits on the card and the task is told nothing more; a failing call whose output only holds those words is no refusal; a blocked command never replaces a question already on the card; Don't allow tells the task to carry on without it and never to reach it by other means, and pressed once the task has ended it does not start it again; and Claudopus never lets the call through itself", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  const ended = new Set<string>()
  const { files, clock, resumed, appended, pressRuns } = world(on, { agents, ended })
  // Beneath the mod the engine would put each of the checks below to its mode, which settles the ask; the refused calls are Claude
  // Code's own to refuse, with no prompt
  on('tool.check', (_, e, next) => (String((e as { tool_use_id?: unknown }).tool_use_id).startsWith('chk') ? ({ decision: 'ask' } as never) : next(e)))
  await $.session.start(start)
  await $.prompt.submit({ text: 'write the notes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Write the notes', prompt: 'write the notes' } as never)
  const logLines = (words: string) => (files.get(`${MEMORY}/log.md`) ?? '').split('\n').filter(line => line.includes(words))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const mine = () => [...appended, ...resumed].filter(one => one.startsWith('a1: '))
  // A search that fails, whose output holds Claude Code's words, is no refusal
  files.set('fails', "notes.md: Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access].")
  await $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'grep -r denied notes.md # fails', tool_use_id: 'g1' } as never)
  await clock.advance(1000)
  expect(logLines('refusal of ')).toEqual([])
  // A change to a file Claude Code refused: there is nothing the person could run, so nothing is asked of them. The card is not
  // amber, nothing is counted as waiting, and the task hears only Claude Code's own refusal
  const call = { tool: 'Edit', agentId: 'a1', file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }
  files.set('auto-refuse', 'Edit')
  await $.tool.call({ ...call, tool_use_id: 'e1' } as never)
  files.delete('auto-refuse')
  await clock.advance(1000)
  expect(await until(async () => (logLines('refusal of Edit for a1: nothing the person could run, so nothing is asked').length ? true : undefined))).toBe(true)
  expect(['its card is shown', Boolean(await until(async () => (await list.findAll({ type: 'Button' })).find(one => one.key === 'stop-a1')))]).toEqual(['its card is shown', true])
  const texts = await textsOf(list)
  expect(texts.filter(one => /Claude Code blocked|waiting for you|^Permission|^Question/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Box' })).filter(one => one.props.backgroundColor === AMBER)).toEqual([])
  expect((await labelsOf(list)).filter(one => /^(Allow|Don't allow)$|without it|another way|Leave it out/.test(one))).toEqual([])
  expect(logLines('put to the person on its card')).toEqual([])
  expect(mine()).toEqual([])
  const check = (id: string) => $.tool.check({ tool: 'Edit', input: { file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-2')).decision).toBe('ask')
  // A command it blocked while the card asks the task's own question never replaces that question
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which notes first?', choices: ['The old ones'] } as never)
  files.set('auto-refuse', 'Bash')
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b0', command: 'wc -l notes.md', description: 'Count the lines' } as never)
  await clock.advance(1000)
  expect(await until(async () => (logLines('not put on its card: its card asks something already').length ? true : undefined))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Which notes first?' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: BLOCKED })).toBeUndefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  // A command it blocked with nothing asked on the card is asked; Don't allow tells the task, still at work, to carry on without
  // it, never to get there another way, and runs nothing
  const deny = async () => list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(one => /^ask-a1-deny-/.test(one.key ?? ''))))?.key ?? '' })
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b1', command: 'wc -l notes.md', description: 'Count the lines' } as never)
  await clock.advance(1000)
  expect(['asked for the command', Boolean(await until(async () => list.find({ type: 'Text', text: BLOCKED })))]).toEqual(['asked for the command', true])
  expect(logLines('put to the person on its card')).toHaveLength(1)
  // Words on it go to the task, which answers inside the same block; it stays, waiting for the press, and runs nothing
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith('ask-a1-words-field-')))
  await list.input({ key: field?.key ?? '', text: 'Why count them?' } as never)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('about the command Claude Code refused you (wc -l notes.md)')))).toContain('“Why count them?”')
  // (nothing to press while the task answers the words: its answer brings Don't allow back)
  const hasDeny = async () => (await list.findAll({ type: 'Button' })).some(one => /^ask-a1-deny-/.test(one.key ?? ''))
  expect(await until(async () => ((await hasDeny()) ? undefined : true))).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'To size the notes before I split them.' } as never)
  expect(await until(async () => (await list.findAll({ type: 'Markdown' } as never)).map(one => String(one.props.text ?? '')).find(one => one.includes('**The answer:**')))).toContain('**You asked:** Why count them?\n\n**The answer:** To size the notes before I split them.')
  expect(await list.find({ type: 'Text', text: BLOCKED })).toBeDefined()
  expect(await hasDeny()).toBe(true)
  expect(pressRuns).toEqual([])
  await deny()
  const told = await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))
  expect(told).toContain(`pressed "Don't allow" when asked whether to run the command Claude Code refused you (wc -l notes.md)`)
  expect(told).toContain('Carry on without it, and say in your report what was left out.')
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect((await pressedLines(list)).map(one => [one.text, one.props.dimColor])).toEqual([["✓ You pressed “Don't allow”", true]])
  // (its next step reads that, so nothing of the press is left to send it when it ends)
  await steps($, 1, 'm', 'a1')
  await clock.advance(1000)
  // Pressed once the task has ended, nothing starts it again
  await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b2', command: 'wc -c notes.md', description: 'Count the letters' } as never)
  files.delete('auto-refuse')
  await clock.advance(1000)
  expect(['asked again for the next command', Boolean(await until(async () => list.find({ type: 'Text', text: BLOCKED })))]).toEqual(['asked again for the next command', true])
  // Pressed once the task has ended, having handed in its result, nothing starts it again
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-end', agentId: 'a1', message: 'The notes are written, without the files Claude Code refused.' } as never)
  agents.a1 = 'completed'
  ended.add('a1')
  await $.turn.complete({ answer: 'The notes are written, without the files Claude Code refused.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  const before = appended.filter(one => one.startsWith('a1: ')).length
  await deny()
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect([resumed.filter(one => one.startsWith('a1: ')), appended.filter(one => one.startsWith('a1: ')).length]).toEqual([[], before])
  expect(pressRuns).toEqual([])
  await list.unmount()
})

// 21 Nov: Supabase's confirm_cost, refused six times after Dima's yes on the card, and the card asked nothing of it
test("a connector's tool Claude Code refuses a task is asked on its card once, with the one command that lets it through (a rule in the person's own settings, run in their Terminal), Open in Terminal, Try again and Don't allow; Try again tells the task to call it once more, Don't allow to carry on without it; Claudopus never calls the tool, nor lets the call through itself", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  const { files, clock, appended, pressRuns } = world(on, { agents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the leaderboard', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Make the leaderboard', prompt: 'make the leaderboard' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const TOOL = 'mcp__5a3e9d85-c502-4788-adea-8783a1c00ccc__confirm_cost'
  const ASK = 'Claude Code blocked this action. Let your tasks do it?'
  const refuse = async (id: string) => {
    files.set('auto-refuse', TOOL)
    const r = (await $.tool.call({ tool: TOOL, agentId: 'a1', tool_use_id: id, type: 'project', recurrence: 'monthly', amount: 10 } as never)) as { isError?: boolean }
    files.delete('auto-refuse')
    await clock.advance(1000)
    return r
  }
  // The call stays refused: Claude Code's refusal is what the task gets
  expect((await refuse('c1')).isError).toBe(true)
  expect(await until(async () => list.find({ type: 'Text', text: ASK }))).toBeDefined()
  const said = (await list.findAll({ type: 'Markdown' } as never)).map(one => String(one.props.text ?? '')).join('\n')
  expect(said).toContain('It wanted to confirm cost: {"type":"project","recurrence":"monthly","amount":10}')
  expect(said).toContain('Claude Code never counts a yes on this card or in the chat as yours for this')
  expect(said).toContain(`it adds ${TOOL} to your Claude Code settings`)
  const labels = (await list.findAll({ type: 'Button' })).filter(b => String(b.key ?? '').startsWith('ask-a1')).map(b => String(b.props.label))
  expect(labels.filter(one => ['Try again', "Don't allow", 'Copy', 'Open in Terminal'].includes(one)).sort()).toEqual(['Copy', "Don't allow", 'Open in Terminal', 'Try again'])
  // The command on it is the runner of the mod, at the person's terminal, with that one rule
  expect([...(await textsOf(list)), said].join('\n')).toContain(`/bin/allow-tool' ${TOOL}\nIt wanted to confirm cost`)
  expect((files.get(`${MEMORY}/log.md`) ?? '')).toContain(`refusal of ${TOOL} for a1 put to the person on its card, with the rule that lets it through`)
  // Try again: the task calls it once more, and is told not to ask in words
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Try again')?.key ?? '' })
  const told = await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('pressed "Try again"')))
  expect(told).toContain(`after being shown the command that adds ${TOOL} to their Claude Code settings. Call it once more now, exactly as before.`)
  // Refused again (the rule is not in yet): asked again; Don't allow tells it to carry on without it
  await refuse('c2')
  expect(await until(async () => list.find({ type: 'Text', text: ASK }))).toBeDefined()
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => String(b.key ?? '').startsWith('ask-a1-choice-1-'))?.key ?? '' })
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes(`pressed "Don't allow" when asked to let your tasks use ${TOOL}`)))).toContain('Carry on without it')
  // Nothing ran in the person's place
  expect(pressRuns).toEqual([])
  await list.unmount()
})

test("a command Claude Code blocked a task from running is asked on its card as a Permission block, the command whole with why and where it would run, Allow and Don't allow; nothing runs but on that Allow (not Don't allow, not a task's own question with a button of that name, not waiting), and the press changes no permission; the press runs exactly that command once, as the person's, shows one grey line of the press and one quiet line while it runs, never the command again nor a drawing of the whole panel at each look at it (17 Nov, the box that flashed); its output is told to a task at a step, and kept for the next step of one that ended, with a grey line and nothing to press, never sent from a timer; a long one is stopped at its limit, and Stop stops it", async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  // (its clock moves bare, with no hook of the mod after each move: nothing here may go from a timer)
  const { files, clock, resumed, appended, pressRuns } = world(on, { agents, unseen: [] })
  on('tool.check', (_, e, next) => (String((e as { tool_use_id?: unknown }).tool_use_id).startsWith('chk') ? ({ decision: 'ask' } as never) : next(e)))
  const redraws = { count: 0 }
  on('ui.invalidate', (_, e, next) => ((redraws.count += 1), next(e)))
  await $.session.start(start)
  await $.prompt.submit({ text: 'find the name servers', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Find the name servers', prompt: 'find the name servers' } as never)
  const refuse = async (id: string, more: Record<string, unknown>) => {
    files.delete('run:gone')
    files.set('auto-refuse', 'Bash')
    await $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: id, ...more } as never)
    files.delete('auto-refuse')
    await clock.advance(1000)
  }
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The buttons of the block and of the running command's line, by their keys (the card's own Stop is the task's)
  const mine = async () => (await list.findAll({ type: 'Button' })).filter(one => /^ask-a1-|^runs-a1-/.test(one.key ?? ''))
  const buttons = async () => (await mine()).map(one => String(one.props.label))
  const pressOn = async (part: string) => list.press({ key: (await until(async () => (await mine()).find(one => (one.key ?? '').includes(part))))?.key ?? '' })
  const stops = () => pressRuns.filter(argv => argv[1] === 'stop').length
  const details = async () => (await list.findAll({ type: 'Markdown' })).map(one => String(one.props.text ?? ''))
  // Don't allow runs nothing, and tells the task to carry on without it
  await refuse('b00', { command: 'dig +short NS example.net', description: 'Look up the name servers' })
  expect(await until(async () => list.find({ type: 'Text', text: BLOCKED }))).toBeDefined()
  // (only its two buttons answer it: words typed on it go to the task and run nothing)
  expect(await buttons()).toEqual(['Allow', "Don't allow"])
  expect((await list.findAll({ type: 'Input' } as never)).map(one => one.props.placeholder)).toEqual(['Answer in words'])
  await pressOn('-deny-')
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means')))).toBeDefined()
  expect(pressRuns).toEqual([])
  // Nor does a task's own question with a button of that name, over the same command
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Shall I go on?', choices: ['Allow', 'Leave it'], copy: 'dig +short NS example.org' } as never)
  await pressOn('-choice-0-')
  await clock.advance(10_000)
  expect(pressRuns).toEqual([])
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' } as never)
  const command = "dig +short NS example.com @ns1.example.net | sort # it's the person's own"
  await refuse('b1', { command, description: 'Look up the name servers' })
  // The block: a permission on the task's own card, amber, counted once; the command whole; one line under it of where and how
  // long Allow would run it and why Claude Code blocked it (its reason alone, none of its words for the model); and the two buttons
  const question = await until(async () => list.find({ type: 'Text', text: BLOCKED }))
  expect([question?.props.color, question?.props.bold]).toEqual([AMBER, true])
  expect(await list.find({ type: 'Text', text: 'Permission' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: command })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^1 waiting for you/ })).toBeDefined()
  expect((await details()).filter(one => one.startsWith('Runs once in '))).toEqual([expect.stringMatching(/^Runs once in \S+, for at most 10 min · blocked as “Unauthorized Access”\.$/)])
  expect((await details()).filter(one => /If you have other tasks|settings|Do it another way|Leave it out|it was Permission|Why: /.test(one))).toEqual([])
  expect(await buttons()).toEqual(['Allow', "Don't allow"])
  expect((await labelsOf(list)).filter(one => /^(Run it|Carry on without it|Send now|Copy|Open in Terminal|Allow once|Deny)$/.test(one))).toEqual([])
  // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
  await clock.advance(60_000)
  expect(pressRuns).toEqual([])
  const check = (id: string) => $.tool.check({ tool: 'Bash', input: { command, description: 'Look up the name servers' }, agentId: 'a1', tool_use_id: id } as never) as Promise<{ decision?: string }>
  expect((await check('chk-1')).decision).toBe('ask')
  // Pressed (twice at once, as a double click): run once, exactly as shown, by Claudopus's runner in the chat's folder
  const key = (await until(async () => (await mine()).find(one => (one.key ?? '').includes('-allow-'))))?.key ?? ''
  await Promise.all([list.press({ key }), list.press({ key }).catch(() => undefined)])
  expect(await until(async () => (pressRuns.length ? pressRuns : undefined))).toHaveLength(1)
  const [runner, how, ran, out, folder] = pressRuns[0] ?? []
  expect([String(runner).endsWith('/bin/run-it'), how, ran, folder]).toEqual([true, 'start', command, '/repo'])
  expect(String(out)).toMatch(/\/runs\/.+\.log$/)
  // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('pressed "Allow" on your card') && one.includes('it is running for them now') && one.includes(`What it prints goes to ${out}`)))).toBeDefined()
  expect((await check('chk-2')).decision).toBe('ask')
  // (its next step reads that, so nothing of the press is left to send it when it ends)
  await steps($, 1, 'm', 'a1')
  // The block went with the press: one grey line says what was pressed
  expect(await until(async () => ((await list.find({ type: 'Text', text: BLOCKED })) ? undefined : true))).toBe(true)
  expect((await pressedLines(list)).map(one => [one.text, one.props.dimColor])).toEqual([['✓ You pressed “Allow”', true]])
  // Running: one quiet line with how long it has run, and Stop; the command is not shown again
  files.set(String(out), 'ns1.example.net.\n')
  await clock.advance(5000)
  const runTime = async () => (await list.findAll({ type: 'Text' })).find(t => /^ · \d+[hms]/.test(String(t.text)))?.text
  const running = await until(async () => list.find({ type: 'Text', text: 'Running your command' }))
  expect(running?.props.dimColor).toBe(true)
  expect(await runTime()).toBeDefined()
  expect(await list.find({ type: 'Text', text: command })).toBeUndefined()
  expect((await textsOf(list)).filter(t => /Claudopus is running it|You allowed it/.test(t))).toEqual([])
  expect(await buttons()).toEqual(['Stop'])
  // While it prints, each look at it every 5 s draws nothing: the whole panel is drawn again only as calmly as for any running
  // work, every ten seconds at most
  redraws.count = 0
  for (let i = 0; i < 12; i++) (files.set(String(out), `ns1.example.net.\nline ${i}\n`), await clock.advance(5000))
  expect(redraws.count).toBeLessThanOrEqual(8)
  // The task ends meanwhile. The command's end starts nothing: what it printed is kept for the task's next step, its card says
  // so in one grey line, and there is nothing to press
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting on the name servers.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  // Its running time still moves, calmly, with the task ended
  await clock.advance(15_000)
  const ranThen = await runTime()
  expect(ranThen).toBeDefined()
  await clock.advance(15_000)
  expect(await until(async () => ((await runTime()) !== ranThen ? true : undefined))).toBe(true)
  files.set(String(out), 'ns1.example.net.\nns2.example.net.\nclaudopus-exit 0\n')
  await clock.advance(5000)
  const kept = await until(async () => list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" }))
  expect(kept?.props.dimColor).toBe(true)
  expect(await buttons()).toEqual([])
  expect((await labelsOf(list)).includes('Send now')).toBe(false)
  await clock.advance(90_000)
  expect(await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })).toBeDefined()
  expect(resumed.filter(one => one.startsWith('a1: '))).toEqual([])
  expect(appended.filter(one => one.startsWith('a1: ') && one.includes('ns2.example.net.'))).toEqual([])
  // Its next step, started by whatever starts it, reads it there: what ran, how it ended, where the whole is, and that it is no permission
  agents.a1 = 'running'
  await steps($, 2, 'm', 'a1')
  const woke = await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('ns2.example.net.')))
  expect(woke).toContain(`ran for them, exactly as shown, once, as their own, in /repo:\n${command}\nIt ended well after`)
  expect(woke).toContain(`Its whole output is in ${out}`)
  expect(woke).toContain('it is no permission')
  expect(pressRuns).toHaveLength(1)
  expect(resumed.filter(one => one.startsWith('a1: '))).toEqual([])
  expect(await until(async () => ((await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })) ? undefined : true))).toBe(true)
  // One sent to the background runs an hour at most; Stop on its line stops it, and the task, at a step, is told at once
  await $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/notes.md', tool_use_id: 'r1' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', agentId: 'a1', tool_use_id: 'n1', text: 'Checking the name servers answer' } as never)
  await refuse('b2', { command: 'npm run soak', description: 'Run the soak test', run_in_background: true })
  expect(await until(async () => (await details()).find(one => /^Runs once in \S+, for at most 1 hour · blocked as /.test(one)))).toBeDefined()
  await pressOn('-allow-')
  expect(await until(async () => (pressRuns.length === 2 ? true : undefined))).toBe(true)
  await pressOn('-stop-')
  expect(await until(async () => (stops() === 1 ? true : undefined))).toBe(true)
  await clock.advance(5000)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run soak') && one.includes('was stopped by the person')))).toBeDefined()
  expect(await list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })).toBeUndefined()
  // Its end is never the card's line beside the dots, which keeps the task's own words (19 Nov, "Your command ended after 20s"
  // stood there until the task wrote again): it is a row of the card's ended commands, and a grey line for a minute where it ran
  expect((await until(async () => list.find({ type: 'Text', text: /^You stopped your command after / })))?.props.dimColor).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Checking the name servers answer' })).toBeDefined()
  expect((await textsOf(list)).filter(t => /^(Your command (ended|failed|stopped|didn't)|You stopped)/.test(t) && !/^You stopped your command after \d/.test(t))).toEqual([])
  expect((await labelsOf(list)).filter(one => /commands? ended/.test(one))).toEqual(['2 commands ended'])
  // (a minute on, the next drawing has it no more)
  await clock.advance(61_000)
  await $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/soak.log', tool_use_id: 'r2' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: /^You stopped your command/ })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Checking the name servers answer' })).toBeDefined()
  // One held open with its own timeout of a minute is stopped by Claudopus at that limit
  await refuse('b3', { command: 'npm run slow', description: 'Run the slow check', timeout: 60_000 })
  await pressOn('-allow-')
  expect(await until(async () => (pressRuns.filter(argv => argv[2] === 'npm run slow').length === 1 ? true : undefined))).toBe(true)
  await clock.advance(30_000)
  expect(stops()).toBe(1)
  await clock.advance(35_000)
  expect(await until(async () => (stops() === 2 ? true : undefined))).toBe(true)
  expect(await until(async () => appended.find(one => one.startsWith('a1: ') && one.includes('npm run slow') && one.includes('was stopped at its limit of 1 min')))).toBeDefined()
  await list.unmount()
})
