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
// Every test may take a minute, not the kit's 5 seconds: the areas' files run side by side, and on a busy machine or GitHub's runner
// (about twice as slow as a Mac) the longest scenarios, 4 to 8 seconds alone, passed or failed by the machine's load, not by the mod.
// SLOW is that limit, kept for the tests that name it
const SLOW = { timeoutMs: 60_000 }
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
const world = (on: On, options: { tailscale?: string; reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unseen?: string[]; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; shells?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean; owner?: (pid: string) => 'mine' | 'other' | 'hidden' }; usage?: (script: string) => string; startedOn?: Record<string, string>; release?: Release } = {}) => {
  const files = new Map<string, string>()
  files.set(KEYCHAIN, '')
  // Someone already set up has an index.md; a new person has no memory folder at all
  if (!options.isNew) files.set(`${MEMORY}/index.md`, '# Streams\n\nname | repo | session | state | summary\n\n')
  const titles: string[] = []
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
  // What was sent on to an agent, what the mod wrote into an agent's chat, and what it submitted to this one
  const sent: string[] = []
  const appended: string[] = []
  const submitted: string[] = []
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
  on('model.complete', () => ({
    value: {
      isAnswered: true,
      text: options.reply ?? 'title: Old title',
      usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    },
  }))
  // One response of a model: its text, then what the API says it was answered over
  on('turn.step', async function* (_, e) {
    stepped.push(e.model)
    yield { kind: 'text', index: 0, text: 'Looking at the nose.' } as never
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
    // What was handed to this Mac's keychain on security's stdin
    if (tool === '/usr/bin/security' && !files.has(KEYCHAIN)) files.set('keychain:dialog', String(rest[0]))
    if (tool === '/usr/bin/security') return (keychain.push(String(e.init?.stdin ?? '')), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
    // bin/catch-up, started in a session of its own
    if (tool === '/bin/sh' && String(rest[4] ?? '').endsWith('/bin/catch-up')) return (own.push([...e.argv]), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
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
    if (tool === 'sh' && String(rest[1]).includes('git diff --numstat')) return ok(files.get('git:numstat') ?? '')
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
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--show-toplevel')) return ok(files.has('git:top') ? `${files.get('git:top')}\n` : '', files.has('git:top') ? 0 : 128)
    // and where the repo a worktree belongs to keeps its git folder, as git:common lays it
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--git-common-dir')) return ok(files.has('git:common') ? `${files.get('git:common')}\n` : '', files.has('git:common') ? 0 : 128)
    if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--abbrev-ref')) return ok(files.has('git:branch') ? `${files.get('git:branch')}\n` : '', files.has('git:branch') ? 0 : 128)
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
    if (e.origin.kind !== 'composer') submitted.push(e.text)
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

  return { files, pressRuns, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, resumed, atHandback, resumedAtHandback, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keep, settle, keychain, admins, wake, gitRan, backgrounds, agentModels, asked, types, registered, kindTools }
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

// Cards: work becoming a card, its to-dos, its own chat, steers, context and model, Details, stops, its pause, work the engine reports

test('what I ask for becomes a box in the panel, the panel opens once, and the chat shows only that work is running', async ($, on) => {
  const { opened, logged } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })

  const r = await $.agent.spawn({ ...spawn, prompt: 'The nose on head A is flawed, can you fix it?' } as never)
  expect(r.agentId).toBe('a1')
  // The work is told to keep its to-do true
  expect(prompts[0]).toContain('mcp__claudopus__todo')
  expect(prompts[0]).toContain('mcp__claudopus__note')
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  expect(opened).toEqual(['claudopus'])

  for (const surface of ['terminal', 'desktop'] as const) {
    const band = await $.ui.mount({ ...BAND, surface } as never)
    // One short line, and never what a piece of work is doing: that is on its card
    expect(await band.find({ type: 'Text', text: /more$|Check the ears|Fix the nose/ })).toBeUndefined()
    expect(await band.findAll({ type: 'Button' })).toHaveLength(0)
    await band.unmount()
  }

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    // A small card says its to-do in a few words and where it stands, each on one line that is cut at the edge
    expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
    expect((await pane.find({ type: 'Text', text: /Check the ears/ }))?.text).toBe('Check the ears')
    expect(await pane.findAll({ type: 'Text', text: /^0s$/ })).toHaveLength(2)
    expect(await pane.find({ type: 'Text', text: /flawed/ })).toBeUndefined()
    // Pressed, its Details opens as a tab of its own, named after the work, and gives what it started from in my words
    await pressed(pane, 'open-a1')
    expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    expect((await tab.find({ type: 'Text', text: /^Started from$/ }))?.props.bold).toBe(true)
    expect((await tab.find({ type: 'Text', text: /flawed/ }))?.text).toBe('“The nose on head A is flawed, can you fix it?”')
    expect(await tab.find({ type: 'Text', text: /Check the ears/ })).toBeUndefined()
    // and has nothing that leads back: the list stays as it was in its own tab
    expect(await tab.find({ type: 'Button', key: 'back' })).toBeUndefined()
    await tab.unmount()
    expect((await pane.find({ type: 'Text', text: /Check the ears/ }))?.text).toBe('Check the ears')
    expect(await pane.find({ type: 'Text', text: /^Started from$/ })).toBeUndefined()
    await pane.unmount()
  }
  // Nothing about the work is written into the chat
  expect(logged).toEqual([])
})

test('a small card shows where the work is and a count of its to-dos; pressed, it lists every to-do; ended work stays among the cards until it is dismissed', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { logged, clock, files, opened } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)

  await call('todo', { item: 'Fit the nostril again' })
  await call('todo', { item: 'Try the other model' })
  // Only one to-do is being done at a time
  await call('todo', { item: 'Try the other model', state: 'doing' })
  const doing = await call('todo', { item: 'Fit the nostril again', state: 'doing' })
  expect(String(doing.result)).toBe('[doing] Fit the nostril again\n[ ] Try the other model')
  await call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
  // as the edge's lighter part, the rest only counted
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^To-do / }))?.text).toBe('To-do 1 of 2 ·')
  expect((await pane.find({ type: 'Text', text: /^Fit the/ }))?.props.dimColor).toBe(false)
  expect(await pane.find({ type: 'Text', text: /^Try the/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /of \d+ to-dos done/ }))?.text).toMatch(/(^| · )0 of 2 to-dos done · \d+s$/)
  // Its edge is its to-dos, one part each: the one being done lighter than a done one, the rest a dim tint; a terminal's edge is whole
  const edgeOf = async (of: typeof pane) => (await of.findAll({ type: 'Box' })).map(b => String(b.props.backgroundColor)).filter(colour => colour.startsWith('#8A63F0'))
  expect(await edgeOf(pane)).toEqual(['#8A63F0AD', '#8A63F05C'])
  // in a purple that a terminal of 256 colours rounds to the octopus's own (no COLORTERM here)
  const flat = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await flat.findAll({ type: 'Box' })).map(b => String(b.props.backgroundColor)).filter(colour => colour === '#6E3CFF')).toEqual(['#6E3CFF'])
  await flat.unmount()
  // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
  expect(await keyed(pane, 'go-a1')).toBeUndefined()
  expect((await keyed(pane, 'open-a1'))?.props.plain).toBe(true)
  expect((await pane.find({ type: 'Button', key: 'stop-a1' }))?.props).toMatchObject({ label: 'Stop', plain: true })
  // A line too long for its two rows is cut at the end of a word
  await call('note', { text: `I am ${'fitting the nostril again and again '.repeat(5)}today.` })
  expect((await pane.find({ type: 'Text', text: /^I am fitting/ }))?.text).toBe('I am fitting the nostril again and again fitting the nostril again and …')
  await call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })
  expect((await pane.find({ type: 'Text', text: /^I am fitting/ }))?.text).toBe('I am fitting the nostril again, because the first fit left it open.')

  await call('note', { text: 'The nostril is closed; I am comparing the head with your scan.' })
  await call('todo', { item: 'Fit the nostril again', state: 'done' })
  await call('todo', { item: 'Try the other model', state: 'dropped' })
  const listed = await call('todo', { item: 'Compare the head with your scan', was: 'compare with scan' })
  expect(String(listed.result)).toBe('[x] Fit the nostril again\n[dropped] Try the other model\n[ ] Compare the head with your scan')
  // A chat's own thread has no to-do of its own
  expect(String((await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' } as never)).result)).toContain('Only a background task')

  // The newer line replaced the older; a dropped to-do is not counted
  expect(await pane.find({ type: 'Text', text: /^I am fitting/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^The nostril is closed/ }))?.text).toBe('The nostril is closed; I am comparing the head with your scan.')
  expect((await pane.find({ type: 'Text', text: /of \d+ to-dos done/ }))?.text).toContain('1 of 2 to-dos done')
  // The done to-do's part of the edge is bright, and with none being done the other is dim; with none marked doing the card names
  // no to-do: no "Next to-do 2 of 2" beside "1 of 2 to-dos done" (18 Nov)
  expect(await edgeOf(pane)).toEqual(['#8A63F0', '#8A63F05C'])
  expect(await pane.find({ type: 'Text', text: /to-do \d+ of \d+/i })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Compare the head/ })).toBeUndefined()
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^To do/ })).toBeUndefined()

  // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
  // done or dropped is one quiet count that opens on a press
  await call('todo', { item: 'Compare the head with your scan', state: 'doing' })
  await call('todo', { item: 'Check the left ear' })
  for (const n of [1, 2, 3, 4]) await call('todo', { item: `Later step ${n}` })
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await tab.findAll({ type: 'Svg' })).toHaveLength(1)
  expect((await tab.find({ type: 'Text', text: /^To-dos$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Conversation$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /of \d+ done$/ }))?.text).toBe('1 of 7 done')
  expect((await tab.find({ type: 'Text', text: /^Compare/ }))?.props.dimColor).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Check the left ear/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^The nostril is closed/ }))?.props.dimColor).toBe(true)
  expect(await tab.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
  expect(await tab.find({ type: 'Text', text: /^Later step 4$/ })).toBeDefined()
  expect(await keyed(tab, 'fold--1000003')).toBeUndefined()
  expect((await tab.find({ type: 'Text', text: /^Fit the/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Try the/ }))?.props.strikethrough).toBe(true)
  // The list behind it is as it was
  expect((await pane.find({ type: 'Text', text: /of \d+ to-dos done/ }))?.text).toContain('1 of 7 to-dos done')

  // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
  await $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' } as never)
  await $.agent.spawn({ ...spawn, fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' } as never)
  expect(prompts.at(-1)).toBe('search')
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' } as never)
  expect((await pane.find({ type: 'Text', text: /^I am reading/ }))?.text).toBe('I am reading how the other model draws outlines.')
  // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
  expect((await keyed(pane, 'open-list-a2'))?.props.label).toBe('Search the docs')
  expect((await pane.findAll({ type: 'Svg' })).filter(svg => String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'Working' && svg.props.isInteractive === true)).toHaveLength(1)
  const plain = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await plain.find({ type: 'Text', text: /^└─/ }))?.text).toBe('└───')
  await plain.unmount()
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label).filter(label => label === 'Stop')).toHaveLength(1)
  // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
  await pressed(pane, 'open-list-a2')
  expect(await until(async () => opened.includes('work-a2') || undefined)).toBe(true)
  const helperTab = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  expect((await helperTab.find({ type: 'Text', text: /Search the docs/ }))?.props.bold).toBe(true)
  expect((await keyed(helperTab, 'open-parent-a2'))?.props.label).toBe('↑ A helper of: Fix the nose')
  await helperTab.unmount()
  // and the work's own Details lists it under Helpers
  expect((await tab.find({ type: 'Text', text: /^Helpers$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /helper working$/ }))?.text).toBe('1 helper working')

  // Work that ends its turn while its helper works goes on working, though its own run is over as Claude Code lists it: a
  // turn's end is only a pause, its clock runs on and it keeps its Stop
  await clock.advance(120_000)
  agents.a1 = 'completed'
  kinds.a1 = kinds.a2 = 'general-purpose'
  await $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  expect(await pane.find({ type: 'Text', text: '✓ Done' })).toBeUndefined()
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  expect((await pane.findAll({ type: 'Box' })).some(b => String(b.props.backgroundColor).startsWith('#8A63F0'))).toBe(true)
  agents.a1 = 'running'
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' } as never)

  // Work that has ended stays in the list until it is dismissed; its Details tab keeps up: it says it finished, with no Stop
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  // (every to-do ticked first, as a task does before it ends; its run over and never pressed for a hand-back, its last words
  // are its result)
  for (const item of ['Compare the head with your scan', 'Check the left ear', 'Later step 1', 'Later step 2', 'Later step 3', 'Later step 4']) await call('todo', { item, state: 'done' })
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^Done · \d+m/ }))?.text).toBe('Done · 2m 00s')
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await tab.unmount()
  // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: '✓ Done' }))?.props.color).toBe('success')
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect((await pane.find({ type: 'Text', text: /^Just finished$/ }))?.text).toBe('Just finished')
  // Its helper, ended in the same moment, stays in its card for the same pause
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Dismiss', 'Search the docs'])
  await clock.advance(1_000)
  expect(await pane.find({ type: 'Text', text: '✓ Done' })).toBeDefined()
  await clock.advance(1_100)
  // After them it is still among the cards, green, its line the last written into it (its helper's), and nothing is under Finished:
  // only Dismiss puts it there
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: '✓ Done' }))?.props.color).toBe('success')
  expect((await pane.find({ type: 'Text', text: /^ · I am reading/ }))?.text).toBe(' · I am reading how the other model draws outlines.')
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing waits for you')
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Dismiss', '1 helper ended'])
  await pressed(pane, 'dismiss-a1')
  // Dismissed, it is one folded row, "Finished", under the running cards; unfolded, a card as running work has, with Details and no Stop
  const buttons = (await until(async () => ((await pane.findAll({ type: 'Button' })).some(b => b.props.label === '▸ Finished 1') ? pane.findAll({ type: 'Button' }) : undefined))) ?? []
  expect(buttons.map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', '▸ Finished 1'])
  await pane.press({ key: String(buttons.find(b => b.props.label === '▸ Finished 1')?.key) })
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  // its top row only its facts, the line under it how it ended
  expect((await pane.find({ type: 'Text', text: /to-dos done ·/ }))?.text).toBe('7 of 7 to-dos done · 2m 00s')
  expect((await pane.find({ type: 'Text', text: '✓ Done' }))?.props.color).toBe('success')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  // Finished work's Details opens as a tab of its own too
  await pressed(pane, 'open-a1')
  const ended = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await ended.find({ type: 'Text', text: /^Done · \d+m/ }))?.text).toBe('Done · 2m 00s')
  expect((await ended.find({ type: 'Text', text: /^Conversation$/ }))?.props.bold).toBe(true)
  await ended.unmount()
  await clock.advance(20_000)
  // kept with its helper, so its Details still lists it after a reload
  expect(JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]').map((one: { id: string }) => one.id)).toEqual(['a1', 'a2'])
  await pane.unmount()

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await band.find({ type: 'Text' }))?.text).toBe("the engine's own")
  await band.unmount()
  expect(logged).toEqual([])
})

// A long work resumed with new rounds: 16 to-dos, 12 done and one being done, more than the edge has parts for
test('past the parts the edge has, it is one bar in three shades, and the step being done is named with the same number', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'add the depth model to the video fit', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'add the depth model to the video fit' } as never)
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)
  for (let n = 1; n <= 16; n += 1) await call('todo', { item: `Round step ${n}` })
  for (let n = 1; n <= 12; n += 1) await call('todo', { item: `Round step ${n}`, state: 'done' })
  await call('todo', { item: 'Round step 13', state: 'doing' })
  await call('note', { text: 'New round on the nose only.' })
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const edge = (await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0'))
  expect(edge.map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 12], ['#8A63F0AD', 1], ['#8A63F05C', 3]])
  expect((await pane.find({ type: 'Text', text: /of \d+ to-dos done/ }))?.text).toContain('12 of 16 to-dos done')
  expect((await pane.find({ type: 'Text', text: /^To-do / }))?.text).toBe('To-do 13 of 16 ·')
  expect(await pane.find({ type: 'Text', text: /^Round step 13$/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /^Round step 14$/ })).toBeUndefined()
  // With nothing being done, the bar has no lighter part and no to-do is named, nor once every one is ticked: the facts row counts them
  await call('todo', { item: 'Round step 13', state: 'done' })
  const after = (await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0'))
  expect(after.map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 13], ['#8A63F05C', 3]])
  expect(await pane.find({ type: 'Text', text: /to-do \d+ of \d+/i })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Round step 14$/ })).toBeUndefined()
  for (let n = 14; n <= 16; n += 1) await call('todo', { item: `Round step ${n}`, state: 'done' })
  expect(await pane.find({ type: 'Text', text: /^All \d+ to-dos done$/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /of \d+ to-dos done/ }))?.text).toContain('16 of 16 to-dos done')
})

test("a pressed card shows the work's own chat: what it was told, what it wrote, and each tool step in order", async ($, on) => {
  const talk = [
    { role: 'user', text: '', toolUses: [] },
    {
      role: 'assistant',
      text: 'The nostril is open on the left side.',
      toolUses: [
        { tool_use_id: 'u1', tool: 'Read', input: { file_path: '/repo/heads/nose.py' } },
        { tool_use_id: 'u2', tool: 'Bash', input: { command: 'python fit.py --head A', description: 'Fit the nostril again' }, isError: true },
        { tool_use_id: 'u3', tool: 'mcp__claudopus__note', input: { text: 'I am fitting the nostril again.' } },
        { tool_use_id: 'u4', tool: 'mcp__notes__search', input: { query: 'nose' } },
        { tool_use_id: 'u6', tool: 'mcp__claudopus__todo', input: { item: 'Fit the nostril again', state: 'done' } },
      ],
    },
    { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'u1', text: 'def nose(): ...', isError: false }] },
    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u7', tool: 'mcp__claudopus__note', input: { text: 'Now  the left one.' } }] },
    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u5', tool: 'SubagentHandback', input: { message: 'The nostril is **closed**.' } }] },
  ]
  const { logged } = world(on, { talk })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  // It was told the prompt as the mod left it, the panel rule included, and what the app adds for the model alone
  expect(prompts[0]).toContain('mcp__claudopus__todo')
  talk[0] = { role: 'user', text: `${prompts[0]}<system-reminder>For the model alone.</system-reminder>`, toolUses: [] }
  // A steer of mine is kept by the card
  for (const use of talk[1]?.toolUses ?? []) await $.tool.call({ tool: use.tool, tool_use_id: use.tool_use_id, agentId: 'a1', ...use.input } as never)
  await $.prompt.submit({ text: 'No, the left one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “No, the left one.”' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a1', text: 'Now  the left one.' } as never)

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    await pressed(pane, 'open-a1')
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    // The panel rule and what the app adds for the model alone are left out of what it was told
    const said = (await tab.findAll({ type: 'Markdown' })).map(one => one.props.text)
    expect(said).toEqual(['Fix the nose on head A.', 'The nostril is open on the left side.', 'I am fitting the nostril again.', 'No, the left one.', 'Now  the left one.', 'The nostril is **closed**.'])
    // There is no "Latest" button
    expect(await tab.find({ type: 'Button', text: /^Latest$/ })).toBeUndefined()
    expect(await keyed(tab, 'latest')).toBeUndefined()
    // A tool step is one line: what it was for, or what it was pointed at; one that failed says so
    // A run of tool steps is one quiet row saying what was done; pressed, it opens
    expect(await tab.find({ type: 'Text', text: /^Read/ })).toBeUndefined()
    expect((await keyed(tab, 'run-1'))?.props.label).toBe('▸ Ran 1 command, read 1 file, 1 failed')
    expect((await keyed(tab, 'run-4'))?.props.label).toBe('▸ Used 1 other tool')
    expect((await keyed(tab, 'run-5'))?.props.label).toBe('▸ Updated its to-dos')
    await pressed(tab, 'run-1')
    await pressed(tab, 'run-4')
    await pressed(tab, 'run-5')
    expect((await tab.find({ type: 'Text', text: /^Read/ }))?.text).toBe('Read nose.py')
    expect((await tab.find({ type: 'Text', text: /^Fit the nostril again \(/ }))?.text).toBe('Fit the nostril again (failed)')
    expect((await tab.find({ type: 'Text', text: /^search/ }))?.text).toBe('search: nose')
    expect((await tab.find({ type: 'Text', text: /^Done: / }))?.text).toBe('Done: Fit the nostril again')
    // My steer sits once, before what the work did about it: its to-do and the line it then wrote
    const texts = (await tab.findAll({ type: 'Text' })).map(one => one.text)
    expect(texts.indexOf('You')).toBe(texts.indexOf('search: nose') + 1)
    expect(texts.indexOf('Done: Fit the nostril again')).toBeGreaterThan(texts.indexOf('You'))
    // Pressed again, a run folds
    await pressed(tab, 'run-1')
    expect(await tab.find({ type: 'Text', text: /^Read/ })).toBeUndefined()
    // A tool's result is no line of the chat
    expect(await tab.find({ type: 'Text', text: /def nose/ })).toBeUndefined()
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
})

test('a steer is sent as written and the work is told it is one, the work is reminded until it says what it decided, and a new task goes back to the chat', async ($, on) => {
  const agents: Record<string, string> = {}
  const { sent, appended, submitted, clock } = world(on, { agents, kinds: { a1: 'general-purpose' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const step = (tool: string, input: object = {}) => $.tool.call({ tool, tool_use_id: 't', agentId: 'a1', ...input } as never)

  await $.prompt.submit({ text: 'Also make me a chart of the ears.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “Also make me a chart of the ears.”' } as never)
  // The chat's call goes on as it was made; the work is told in its own chat what a steer asks of it
  expect(sent[0]).toBe('Sam: “Also make me a chart of the ears.”')
  expect(appended).toHaveLength(1)
  // The chat put a name before their words: only the words quoted are told as theirs
  expect(appended[0]).toContain('a1: The message sent to you just now carries the person\'s words "Also make me a chart of the ears.", typed by them in the chat. Only those words are the person\'s')
  expect(appended[0]).toContain('Decide which of three it is')
  expect(appended[0]).toContain('added it to your to-do list')
  expect(appended.join('\n')).not.toMatch(/steer/i)
  // 17 Nov: a task handed back the person's "upload the second video like the first one" though it held the accounts to do it, and
  // parts of a message the chat had already seen to elsewhere: what the chat sends is done here, and only an unrelated request goes back
  expect(appended[0]).toContain('do it here, as the chat sent it to you to be done')
  expect(appended[0]).toContain('only a request this task has nothing to do with')
  expect(appended[0]).toContain("Do only what the chat's message asks of you: the chat has seen to the rest of what the person said.")

  // The work goes on without saying what it decided: after two steps it is told so, once
  await step('Bash')
  expect(appended).toHaveLength(1)
  await step('Bash')
  await step('Bash')
  expect(appended).toHaveLength(2)
  expect(appended[1]).toContain('a1: A message from the person is waiting for your decision')

  // Its line is the decision; a task of its own goes back to the chat in the person's words, and nothing more is owed
  const noted = await step('mcp__claudopus__note', { text: 'Your chart of the ears is a new task; I go on with the nose.', task: 'Make a chart of the ears' })
  // The work hands it to the chat itself, as its own message: the mod submits nothing that would show as the person's
  expect(String(noted.result)).toContain('call SendMessage (load it with ToolSearch if needed) with to "main"')
  expect(String(noted.result)).toContain('Start it as its own background task: Make a chart of the ears')
  expect(String(noted.result)).toContain('Also make me a chart of the ears.')
  expect(String(noted.result)).toContain("don't do that new one here")
  await clock.advance(10)
  expect(submitted).toHaveLength(0)
  for (let n = 0; n < 5; n += 1) await step('Bash')
  expect(appended).toHaveLength(2)

  // Work that has ended is sent a message, not a steer
  // (a run that is over is listed so by Claude Code; never pressed for a hand-back, its last words are its result)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't2', to: 'a1', message: 'Sam: thanks' } as never)
  expect(sent[1]).toBe('Sam: thanks')
  expect(appended).toHaveLength(2)
})

test("only the person's words sent on by the chat are their steer: a helper's reply, work to work and the chat's own note are told as their sender's", async ($, on) => {
  const { appended } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count nostrils', prompt: 'count', parentAgentId: 'a1' } as never)
  const steps = async (id: string) => {
    for (let n = 0; n < 3; n += 1) await $.tool.call({ tool: 'Bash', tool_use_id: 'b', agentId: id } as never)
  }

  // A helper replies to the work that started it, and that work writes to its helper
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'There are two nostrils.', agentId: 'a3' } as never)
  expect(appended.at(-1)).toBe('a1: The message sent to you just now that begins "There are two nostrils." is from your helper "Count nostrils", not from the person: that one is not theirs. Take it as your helper "Count nostrils"\'s and continue; a message that carries the person\'s own words stays theirs.')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a3: The message sent to you just now that begins "Count them again." is from the task that started you, not from the person')
  // One piece of work writes to another
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the task "Fix the nose", not from the person')
  // The chat's own note, which carries none of the person's words, is the chat's
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's4', to: 'a1', message: 'A fault seen from the chat: the card shows the wrong model.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
  expect(appended.join('\n')).not.toContain('from the person, in their own words')
  // Nothing is owed for them: going on, the work is not reminded of a steer
  await steps('a1')
  expect(appended.join('\n')).not.toContain('waiting for your decision')

  // A short message of theirs counts as whole words only: "yes" is not in "eyes"
  await $.prompt.submit({ text: 'yes', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's8', to: 'a1', message: 'Check the eyes again.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
  // The person's words, sent on by the chat, are their steer, and the card keeps them
  await $.prompt.submit({ text: 'Make the left nostril a little wider than the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's5', to: 'a1', message: 'Sam on the nose, in their words: “Make the left nostril — a little wider than the right one”' } as never)
  expect(appended.at(-1)).toContain('carries the person\'s words "Make the left nostril a little wider than the right one.", typed by them in the chat. Only those words are the person\'s')
  await steps('a1')
  expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision')
  // The same words sent by a piece of work are still not the person's steer
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the task "Fix the nose"')
  // Once the chat's turn is over, a message from it is its own again
  await $.turn.complete({ answer: 'Sent.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer' })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's7', to: 'a2', message: 'Make the left nostril a little wider than the right one.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
})

test("the person's words sent to work that has ended are theirs, and the chat's own note sent after them is labelled by its own start", async ($, on) => {
  const { appended, sent } = world(on, { agents: { a1: 'completed' }, kinds: { a1: 'general-purpose' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // (its run is over, as Claude Code lists it, and it was never pressed for a hand-back: its last words are its result)
  await $.turn.complete({ answer: 'The nose is fixed. Shall I build it into the app? '.repeat(20), durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await $.prompt.submit({ text: 'Yes, build the nose into the app', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'From Sam, as they said it: "Yes, build the nose into the app"' } as never)
  const all = [...appended, ...sent].join('\n')
  expect(all).toContain('The message you just received carries the person\'s words "Yes, build the nose into the app", typed by them in the chat. Only those words are the person\'s')
  expect(all).not.toContain('not from the person')
  // The work, started again, is working when the chat's own note follows: that line names the note, not their words
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'From the chat, not Sam: release through the release command.' } as never)
  expect(appended.at(-1)).toContain('that begins "From the chat, not Sam: release through the release command." is from the chat, not from the person: that one is not theirs')
})

test('work that takes many steps without touching its to-dos is reminded to bring them up to date', async ($, on) => {
  const { appended } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const step = (tool: string, input: object = {}) => $.tool.call({ tool, tool_use_id: 't', agentId: 'a1', ...input } as never)

  for (let n = 0; n < 11; n += 1) await step('Bash')
  expect(appended).toEqual([])
  await step('Read')
  expect(appended).toHaveLength(1)
  expect(appended[0]).toContain('a1: You have taken 12 steps since you last touched your to-dos')
  // Touching them starts the count again
  for (let n = 0; n < 11; n += 1) await step('Bash')
  await step('mcp__claudopus__todo', { item: 'Fit the nostril again', state: 'doing' })
  for (let n = 0; n < 11; n += 1) await step('Bash')
  expect(appended).toHaveLength(1)
  await step('Bash')
  expect(appended).toHaveLength(2)
})

test('work that ends in an error is kept as failed, saying why; a run that is over with nothing of its own running is failed too, "Ended without its result", with Start again, where Claude Code pressed it for a hand-back that never came, and done with its last words where it never did; time lying ended is not counted, and work under way is never forgotten; past 40 tasks, work that ended before cards stayed up and a dismissed card are forgotten before an ended card never dismissed', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const talk: unknown[] = []
  const { clock, submitted, files } = world(on, { agents, kinds, talk })
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  // Work that ended before this copy of the mod kept it, read back from Claude Code's record: under Finished, never up. Its end,
  // by its record, is later than every end below
  const folder = `${HOME}/.claude/projects/-repo/engine-id/subagents`
  files.set(`${folder}/agent-r1.meta.json`, JSON.stringify({ description: 'Old work', spawnDepth: 1, finished: true }))
  files.set(`${folder}/agent-r1.jsonl`, JSON.stringify({ timestamp: '2026-11-11T10:00:00Z', type: 'user', message: { content: 'go' } }))
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const fold = async (of: typeof pane) => (await of.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  expect(await until(() => fold(pane))).toBe('▸ Finished 1')
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await clock.advance(120_000)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'error', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^Failed ·/ }))?.text).toBe('Failed · Ended with an error · 2m 00s')

  // An hour later it is sent a message and works again: the hour is not counted
  await clock.advance(3_600_000)
  await $.agent.spawn({ ...spawn, prompt: 'try again', resume: { agentId: 'a1' } } as never)
  expect((await tab.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await tab.unmount()

  // A run that is over, as Claude Code lists it, ends its card by whether its result was received: pressed for a hand-back after
  // its last words, those reached no one and it failed; never pressed, they were taken as its result and it is done. While a
  // command of its own runs, the end of its turn is only a pause: it is at work, and ends once the command has
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  // How its Details says it stands, once ended
  const stands = async (id: string) => {
    const details = await $.ui.mount({ ...LIST, requestId: `work-${id}`, surface: 'desktop' } as never)
    const text = (await details.find({ type: 'Text', text: /^(Done|Failed|Stopped) · / }))?.text
    await details.unmount()
    return text?.replace(/ · [^·]*$/, '')
  }
  for (const [title, isPressed, hasCommand, ends] of [
    ['Pressed for a hand-back', true, false, 'Failed · Ended without its result'],
    ['Never pressed', false, false, 'Done'],
    ['Pressed, its command running', true, true, 'Failed · Ended without its result'],
    ['Never pressed, its command running', false, true, 'Done'],
  ] as const) {
    const { agentId: id = '' } = await $.agent.spawn({ ...spawn, description: title, prompt: 'go' } as never)
    kinds[id] = 'general-purpose'
    if (hasCommand) await $.tool.call({ tool: 'Bash', tool_use_id: `b-${id}`, agentId: id, command: 'python3 fit.py', description: 'Run the fit', run_in_background: true } as never)
    talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'The fit is under way.' }] }, ...(isPressed ? [PRESS] : []))
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'The fit is under way.', durationMs: 1, isAborted: false, turnId: `t-${id}`, reason: 'answer', agentId: id } as never)
    if (hasCommand) {
      await clock.advance(60_000)
      expect([title, await stands(id), Boolean(await pane.find({ type: 'Button', key: `stop-${id}` }))]).toEqual([title, undefined, true])
      // (its command ends, as Claude Code says when the run stops: nothing of its own is in flight)
      await $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [] } as never)
      await clock.advance(60_000)
    }
    expect([title, await until(() => stands(id))]).toEqual([title, ends])
    // Failed, its card stays up in red, saying why, with Start again: their press asks the chat in their name to send it a message
    if (!isPressed) continue
    expect((await pane.findAll({ type: 'Text', text: '✕ Failed · Ended without its result' })).every(one => one.props.color === 'error')).toBe(true)
    const again = (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Start again' && String(b.key).startsWith(`again-small-${id}-`))
    await pane.press({ key: again?.key ?? '' })
    expect(await until(async () => submitted.find(text => text.includes(`pressed "Start again" on "${title}" (${id}), which had failed (ended without its result)`)))).toBeDefined()
  }
  talk.splice(0, talk.length)

  // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
  await pane.unmount()
  const other = async (n: number) => {
    const r = await $.agent.spawn({ ...spawn, description: `Other ${n}`, prompt: 'x' } as never)
    agents[String(r.agentId)] = 'completed'
    kinds[String(r.agentId)] = 'general-purpose'
    await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t-${n}`, reason: 'answer', agentId: r.agentId } as never)
    return String(r.agentId)
  }
  let newest = ''
  for (let n = 0; n < 50; n += 1) newest = await other(n)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await again.find({ type: 'Text', text: /Fix the nose/ }))?.text).toBe('Fix the nose')
  // Forty are kept. The work that was only under Finished went first, though its end is the newest: nothing is under Finished,
  // and every card left ended and was never dismissed, or is at work
  const cards = async () => (await again.findAll({ type: 'Text' })).filter(one => one.props.bold && /^(Other \d+|Fix the nose|Pressed.*|Never pressed.*)$/.test(one.text)).map(one => one.text).sort()
  const before = await cards()
  expect([before.length, await fold(again)]).toEqual([40, undefined])
  // A dismissed card goes before any of them: the newest is dismissed, and as one more task ends it is the one forgotten, while
  // every card still up, the oldest too, is kept
  await pressed(again, `dismiss-${newest}`)
  expect(await until(() => fold(again))).toBe('▸ Finished 1')
  await other(50)
  expect(await until(async () => ((await fold(again)) ? undefined : true))).toBe(true)
  expect(await cards()).toEqual([...before.filter(title => title !== 'Other 49'), 'Other 50'].sort())
  await again.unmount()
})

test('a chat the app has not kept is said so, with the answer the work gave', async ($, on) => {
  world(on, { talk: { deny: 'no transcript for a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /save this task/ }))?.text).toBe("The app didn't save this task's conversation.")
  expect((await tab.find({ type: 'Markdown' }))?.props.text).toBe('The nostril is closed.')
  await tab.unmount()
  await pane.unmount()
})

test('a message of mine passed on to work already listed opens its to-do again, and that work is not told the panel rule twice', async ($, on) => {
  const agents: Record<string, string> = { a1: 'completed' }
  world(on, { agents, kinds: { a1: 'general-purpose' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)

  await $.prompt.submit({ text: 'No, the left nostril, not the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: the left nostril' } as never)
  agents.a1 = 'running'
  await $.agent.spawn({ ...spawn, prompt: 'the left nostril', resume: { agentId: 'a1' } } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /^\d+s$/ }))?.text).toBe('0s')
  expect(prompts.at(-1)).toBe('the left nostril')
  await pane.unmount()
})

test('the panel shows how full the context of this chat and of each piece of work is, and the model the work runs on', async ($, on) => {
  world(on, { model: 'claude-opus-5-5-20261001' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  // A copy of the chat, as work began before every piece started from a brief, has the chat's window
  await $.agent.spawn({ ...spawn, subagentType: 'fork', fork: true, prompt: 'fix the nose' } as never)
  await $.session.measure({ context: { tokens: 110_900, window: 500_000, percent: 22 }, rateLimits: [], changed: ['context'] } as never)
  // A response of the work ends: the stream passes through whole and its size is kept
  const kinds: string[] = []
  for await (const chunk of $.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) kinds.push(chunk.kind)
  expect(kinds).toEqual(['text'])

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /This chat/ }))?.text).toBe('This chat is 22% full')
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Opus 5.5')
  expect((await pane.find({ type: 'Text', text: /^ · \d+% full/ }))?.text).toBe(' · 61% full · 0s')
  // Work with no to-dos has a whole purple edge
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => b.props.backgroundColor)).toEqual(['#8A63F0'])
  // A helper's row says its model and its time, in that order, never a count of tokens
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)
  for await (const chunk of $.turn.step({ turnId: 'turn-3', index: 0, model: 'm', messageCount: 2, agentId: 'a2' })) kinds.push(chunk.kind)
  // More to-dos than the edge has parts for are one edge, filled as far as they are done
  for (let n = 0; n < 16; n++) await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: `e${n}`, agentId: 'a1', item: `Part ${n}`, state: n < 3 ? 'done' : 'open' } as never)
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 3], ['#8A63F05C', 13]])
  await pane.unmount()
  const wide = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await wide.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 0s')
  await wide.unmount()
  // The narrowest panel drops the model too, so the helper's name keeps its room
  const narrow = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await narrow.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 0s')
  await narrow.unmount()
  const slim = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 28 }, surface: 'desktop' } as never)
  expect(await slim.find({ type: 'Text', text: /^Opus 5\.5 · / })).toBeUndefined()
  expect((await slim.find({ type: 'Text', text: /^\d+s$/ }))?.text).toBe('0s')
  await slim.unmount()
})

test("a card's title, its line of facts and every line under them start at one left edge, on a desktop and in a terminal, at work, asking and finished", async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock } = world(on, { model: 'claude-opus-5-5-20261001', agents, kinds: { a1: 'general-purpose', a2: 'general-purpose' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, subagentType: 'fork', fork: true, prompt: 'fix the nose' } as never)
  for await (const chunk of $.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) void chunk
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)
  await call('todo', { item: 'Fit the nostril', state: 'doing' })
  await call('note', { text: 'I am fitting the nostril.' })
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)

  // How far in a line's first letter is: the padding on the way down its first parts, and a desktop's own around a plain Button
  type Drawn = { type?: string; props?: Record<string, unknown>; children?: unknown[] }
  const insetOf = (node: unknown, surface: string): string[] => {
    if (!node || typeof node !== 'object') return []
    const { type, props = {}, children = [] } = node as Drawn
    const own = [props.paddingLeft ?? props.paddingX ?? props.padding].filter(step => step !== undefined && step !== 0).map(String)
    if (type === 'Button') return [...own, ...(props.plain && surface !== 'terminal' ? ['xs'] : [])]
    return type === 'Box' ? [...own, ...insetOf(children.find(one => one && typeof one === 'object'), surface)] : own
  }
  // Each line of the card's column, the title and its facts as two
  const edges = async (surface: 'desktop' | 'terminal') => {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    const card = (await pane.find({ type: 'Box', key: 'todo-a1' })) as Drawn | undefined
    await pane.unmount()
    const column = (card?.children ?? []).filter(one => one && typeof one === 'object').at(-1) as Drawn
    const [head, ...rest] = (column.children ?? []).filter(one => one && typeof one === 'object') as Drawn[]
    return [...(head?.children ?? []), ...rest].filter(one => one && typeof one === 'object').map(line => insetOf(line, surface).join('+'))
  }
  const expectOneEdge = async (lines: number) => {
    // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge
    expect(await edges('desktop')).toEqual(Array(lines).fill('xs'))
    expect(await edges('terminal')).toEqual(Array(lines).fill(''))
  }
  // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
  await expectOneEdge(5)
  // Asking: the ask comes between the step and the line it wrote
  await call('ask', { text: 'May I replace the nose?', choices: ['Approve', 'Not now'] })
  await expectOneEdge(6)
  await call('ask', { text: '' })
  // Finished, in its pause: the facts are plain text, the line says it finished
  agents.a1 = agents.a2 = 'completed'
  await $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  await $.turn.complete({ answer: 'Fixed.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(500)
  await expectOneEdge(4)
})

test('work a safety flag would move to an older model is ended with a report that says so, never run there; an agent whose own kind starts it on an older model or Haiku runs on the newest', async ($, on) => {
  const { stepped, files } = world(on, { model: 'claude-fable-5-2', startedOn: { 'Look it up': 'claude-haiku-5-5', 'Old kind': 'claude-opus-4-1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const step = async (index: number, model: string, agentId: string | undefined = 'a1') => {
    const chunks: { kind: string; name?: string; json?: string; text?: string }[] = []
    for await (const c of $.turn.step({ turnId: 'turn-2', index, model, messageCount: 2, ...(agentId ? { agentId } : {}) })) chunks.push(c as never)
    return chunks
  }
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const line = async () => (await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')

  // On the model it was started on, nothing is changed and the card says nothing more
  await step(0, 'claude-opus-5-5')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(await line()).not.toContain('safety flag')

  // The app's safeguards flagged a message and the app would send the next step to Opus 4.8: no request is made there; the work
  // hands back a report that says why, and its card says so
  const flagged = await step(1, 'claude-opus-4-8')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(flagged.find(c => c.kind === 'tool')?.name).toBe('SubagentHandback')
  expect(JSON.parse(flagged.find(c => c.kind === 'input')?.json ?? '{}').message).toContain('Start what is left again on the current model, leaving out what was flagged')
  expect(await line()).toContain("a safety check stopped it, so it doesn't continue on Opus 4.8")
  // Where the handback does not end it, a step after is a plain last answer, and still nothing runs on the older model
  const again = await step(2, 'claude-opus-4-8')
  expect(stepped).toEqual(['claude-opus-5-5'])
  expect(again.find(c => c.kind === 'text')?.text).toContain("an older model Claudopus doesn't run tasks on")
  expect((files.get(`${MEMORY}/log.md`) ?? '').split('work a1 was flagged and the app would send it to Opus 4.8').length).toBe(2)

  // A helper of an agent type that starts on Haiku runs on Sonnet 5.5; an older Sonnet the app moves it to is not run either
  await $.agent.spawn({ ...spawn, description: 'Look it up', prompt: 'look it up', parentAgentId: 'a1' } as never)
  await step(0, 'claude-haiku-5-5', 'a2')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  await step(1, 'claude-sonnet-5', 'a2')
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  expect(stepped.length).toBe(2)

  // An agent whose own kind names an older Opus runs on the newest Opus, step after step
  await $.agent.spawn({ ...spawn, description: 'Old kind', prompt: 'look again', parentAgentId: 'a1' } as never)
  await step(0, 'claude-opus-4-1', 'a3')
  await step(1, 'claude-opus-4-1', 'a3')
  expect(stepped.slice(-2)).toEqual(['claude-opus-5-5', 'claude-opus-5-5'])

  // The chat's own thread runs on the model the person picked for it, whichever that is
  await step(0, 'claude-opus-4-8', '')
  expect(stepped.at(-1)).toBe('claude-opus-4-8')

  // An agent whose start the mod did not see (a workflow's, before this copy loaded) is left where the app sent it, Haiku too
  await step(0, 'claude-haiku-5-5', 'w1')
  expect(stepped.at(-1)).toBe('claude-haiku-5-5')
  expect(files.get(`${MEMORY}/log.md`)).toContain('work w1 was sent to Haiku 5.5 by the app: its steps stay there')
})

test('work the person moved to a model of their own is ended too when a safety flag would move it to an older model', async ($, on) => {
  const { stepped } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'model-a1')
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')
  for await (const _ of $.turn.step({ turnId: 't', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-sonnet-5-5'])
  for await (const _ of $.turn.step({ turnId: 't', index: 1, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-sonnet-5-5'])
})

test('work that answers from an older model all the same says so on its card', async ($, on) => {
  const answered: { by?: string } = { by: 'claude-opus-4-8' }
  world(on, { model: 'claude-fable-5-2', answered })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' })) void _
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Opus 4.8')
  expect((await pane.findAll({ type: 'Text' })).map(one => String(one.props.children ?? one.text ?? '')).join('\n')).toContain("Claudopus doesn't run tasks on this model")
})

test('the model a running work is on is pressed and another chosen: its next step runs on it, its card says so at once, and its chat and the work are told', async ($, on) => {
  const talk: { role: string; text: string; toolUses: never[] }[] = [{ role: 'user', text: 'Fix the nose on head A.', toolUses: [] }]
  const answered: { by?: string } = {}
  const agents: Record<string, string> = {}
  const { appended, stepped, logged } = world(on, { model: 'claude-opus-5-5', talk, answered, agents, kinds: { a1: 'general-purpose' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const step = async (index: number, model = 'claude-opus-5-5') => {
    for await (const _ of $.turn.step({ turnId: 'turn-2', index, model, messageCount: 2, agentId: 'a1' })) void _
  }
  await step(0)
  expect(stepped).toEqual(['claude-opus-5-5'])

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The model's name is a control that underlines under the pointer; pressed, the three models are offered, the one in use ticked
  expect((await keyed(pane, 'model-a1'))?.props.plain).toBe(true)
  await pressed(pane, 'model-a1')
  const offered = (await pane.findAll({ type: 'Button' })).filter(one => /^pick-a1-/.test(one.key ?? '')).map(one => one.props.label)
  expect(offered).toEqual(['✓ Opus 5.5', 'Sonnet 5.5', 'Fable 5.2'])
  expect(offered.join(' ')).not.toMatch(/Haiku/)
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')

  // The card names the new model at once, and the choice is closed
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  expect(await keyed(pane, 'pick-a1-claude-opus-5-5')).toBeUndefined()
  // The work is told in its own chat, with the time
  expect(appended).toHaveLength(1)
  expect(appended[0]).toMatch(/^a1: Model changed to Sonnet 5\.5 at \d\d:\d\d\. The person chose it in the panel: your next steps run on Sonnet 5\.5\.$/)
  // A response under way when the choice was made, answered by the old model, leaves the card on the new one
  answered.by = 'claude-opus-5-5'
  await step(1)
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  delete answered.by
  stepped.pop()
  // Its next step goes to the new model, though the engine would have sent it to the old one, and the card keeps it
  await step(1)
  expect(stepped).toEqual(['claude-opus-5-5', 'claude-sonnet-5-5'])
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Sonnet 5.5')

  // In Details the header's model is the same control, and the change is a line of its own in its chat where it happened
  talk.push({ role: 'user', text: (appended[0] ?? '').slice('a1: '.length), toolUses: [] })
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await keyed(tab, 'model-a1'))?.props.label).toBe('Sonnet 5.5')
  expect((await tab.find({ type: 'Text', text: /^Model changed/ }))?.text).toMatch(/^Model changed to Sonnet 5\.5 · \d\d:\d\d$/)
  expect((await tab.findAll({ type: 'Markdown' })).map(one => one.props.text)).toEqual(['Fix the nose on head A.'])

  // Choosing again moves it again; the model it is on already changes nothing
  await pressed(tab, 'model-a1')
  await pressed(tab, 'pick-a1-claude-sonnet-5-5')
  expect(appended).toHaveLength(1)
  await pressed(tab, 'model-a1')
  await pressed(tab, 'pick-a1-claude-fable-5-2')
  expect(appended[1]).toContain('a1: Model changed to Fable 5.2 at')
  await step(2)
  expect(stepped.at(-1)).toBe('claude-fable-5-2')

  // Work that has ended names its model as plain text
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect(await keyed(tab, 'model-a1')).toBeUndefined()
  expect((await tab.find({ type: 'Text', text: /^Done/ }))?.text).toMatch(/^Done · Fable 5\.2 · /)
  expect(logged).toEqual([])
  await tab.unmount()
  await pane.unmount()
})

test("Details opens as a tab of its own, named after the work, in front; pressed again it brings that tab forward and keeps what was unfolded", async ($, on) => {
  const { opened, tabs, closed } = world(on, { panes: ['claudopus', 'work-a1'] })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (const n of [1, 2, 3, 4, 5]) await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't', agentId: 'a1', item: `Step ${n}` } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => tabs.includes('work-a1: Fix the nose') || undefined)).toBe(true)
  // The pressed button comes back under a new key, so the list is not held where it was
  expect(await pane.find({ type: 'Button', key: 'open-a1-0' })).toBeUndefined()
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await tab.find({ type: 'Text', text: /^Step 5$/ })).toBeDefined()
  // Pressed again with its tab open: the same tab comes forward, nothing is closed, and it stays unfolded
  await pressed(pane, 'open-a1')
  expect(await until(async () => (opened.filter(id => id === 'work-a1').length === 2 ? true : undefined))).toBe(true)
  expect(closed).not.toContain('claudopus')
  expect(await tab.find({ type: 'Text', text: /^Step 5$/ })).toBeDefined()
  // The list is still the list: its header and the card
  expect((await pane.find({ type: 'Text', text: /^Claudopus$/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  await tab.unmount()
  // A tab for work no longer kept says so
  const gone = await $.ui.mount({ ...LIST, requestId: 'work-zz', surface: 'desktop' } as never)
  expect((await gone.find({ type: 'Text' }))?.text).toBe('This task is no longer available.')
  await gone.unmount()
  await pane.unmount()
})

test("a Details tab draws at once, before a long chat is read, and fills in once it is", async ($, on) => {
  // The app is slow to give this work's chat: it gives it only when let go
  let give: () => void = () => undefined
  const given = new Promise<void>(resolve => (give = resolve))
  world(on, { talk: given.then(() => [{ role: 'assistant', text: 'The nostril is closed.', toolUses: [] }]) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await tab.find({ type: 'Text', text: /^Fix the nose$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Reading the conversation/ }))?.text).toBe('Reading the conversation…')
  give()
  expect((await until(async () => (await tab.find({ type: 'Markdown' }))?.props.text))).toBe('The nostril is closed.')
  expect(await tab.find({ type: 'Text', text: /^Reading the conversation/ })).toBeUndefined()
  await tab.unmount()
})

// The gate at the hand-back: a task's result is its last word, so it is taken only once nothing of the task is left open or running
test('a result is handed in only with every to-do ticked or dropped, no helper of its own at work and no command of its own but a server running: it is refused each time, saying which and what to do; once through, the card is done with that result', async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock, files } = world(on, { agents, kinds: { a1: 'general-purpose', a2: 'general-purpose' }, parents: { a2: 'a1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const call = (tool: string, id: string, input: object = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  // (long enough to be kept as a result of its own)
  const result = `The nose is fixed, and the site runs at http://localhost:3000. ${'The nostril is closed on both sides and the bridge matches the scan. '.repeat(8)}`.trim()
  const hand = async () => (await call('SubagentHandback', 'h', { message: result })) as { deny?: string; result?: { success?: boolean } }
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // Everything that holds a result back, at once: two to-dos, a helper at work, a command that ends by itself, and a server
  await call('mcp__claudopus__todo', 't1', { item: 'Fit the nostril', state: 'doing' })
  await call('mcp__claudopus__todo', 't2', { item: 'Compare the head with the scan' })
  await call('Bash', 'fit', { command: 'python3 fit.py', description: 'Fit the nostril again', run_in_background: true })
  await call('Bash', 'site', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)
  const TODOS = (open: string) => `Not handed in: ${open}. Tick it, drop it, or ask: tick each one that is done, drop each one that will not be done and say why in your result, and put what only the person can do or decide to them with the \`ask\` tool before you finish.`
  // What it is told at each hand-back, and what it then does about it: the to-dos first, then the helper, then the command
  const steps: [string, () => Promise<unknown>][] = [
    [TODOS('2 to-dos are still open: "Fit the nostril"; "Compare the head with the scan"'), () => call('mcp__claudopus__todo', 't3', { item: 'Fit the nostril', state: 'done' })],
    [TODOS('a to-do is still open: "Compare the head with the scan"'), () => call('mcp__claudopus__todo', 't4', { item: 'Compare the head with the scan', state: 'dropped' })],
    [
      'Not handed in: a helper of yours is still at work: "Measure the nose". Its result comes to you as it ends: carry on with what needs nothing from it, or end your step until then. One you no longer need: tell it with SendMessage to hand in what it has now.',
      () => ((agents.a2 = 'completed'), $.turn.complete({ answer: 'It is 41 mm.', durationMs: 1, isAborted: false, turnId: 'th', reason: 'answer', agentId: 'a2' } as never)),
    ],
    [
      'Not handed in: a command of yours still runs: "Fit the nostril again". Hand in your result once it has ended, or stop it with TaskStop; only a server the person uses may stay, started with a description that begins with Serve and named in your result.',
      () => call('TaskStop', 'k1', { task_id: 'bg-fit' }),
    ],
  ]
  for (const [refusal, then] of steps) {
    // Refused every time it is tried, in the same words, and its card stays at work, with nothing kept as its result
    for (const _ of [1, 2]) expect((await hand()).deny).toBe(refusal)
    expect([refusal.slice(0, 40), await pane.find({ type: 'Text', text: '✓ Done' }), Boolean(await pane.find({ type: 'Button', key: 'stop-a1' }))]).toEqual([refusal.slice(0, 40), undefined, true])
    await then()
  }
  // With only the server left it goes through: the card is done at once, green, with what it handed in as its result
  const through = await hand()
  expect([through.deny, through.result?.success]).toEqual([undefined, true])
  expect((await pane.find({ type: 'Text', text: '✓ Done' }))?.props.color).toBe('success')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await clock.advance(10)
  const kept = await until(async () => [...files.keys()].find(key => /\/reports\/[^/]+\/report\.md$/.test(key)))
  expect([kept?.replace(/^.*\/reports\/[^/]*?-(?=[a-z])/, ''), files.get(kept ?? '')]).toEqual(['fix-the-nose/report.md', `${result}\n`])
  await pane.unmount()
})

test("a card's edge and the line it ends with say its stage: purple at work, through a turn's end while a command or a helper of its own runs; amber only while something of its own waits for the person; green and ✓ Done with its result; no colour and Stopped; red and ✕ Failed with why; ended, it stays so among the cards, stopped and failed with Start again and Dismiss, until it is dismissed", async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'four things', wait: false, origin: composer })
  const titles = ['Fit the nose', 'Check the ears', 'Draw the eyes', 'Draw the chin']
  for (const description of titles) await $.agent.spawn({ ...spawn, description, prompt: 'go' } as never)
  for (const id of ['a1', 'a2', 'a3', 'a4']) kinds[id] = 'general-purpose'
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  type Drawn = { type?: string; props?: Record<string, unknown>; children?: unknown[] }
  const under = (node: unknown): Drawn[] => (node && typeof node === 'object' ? [node as Drawn, ...((node as Drawn).children ?? []).flatMap(under)] : [])
  const textOf = (node: Drawn) => (node.children ?? []).filter(part => typeof part === 'string').join('')
  const AMBER = '#E5A50A'
  // A card as it is drawn: its edge's colour, the line it ended with and that line's colour, and whether anything on it is amber
  const card = async (id: string) => {
    const nodes = under(await pane.find({ type: 'Box', key: `todo-${id}` }))
    const edge = nodes.find(one => one.type === 'Box' && one.props?.width === 1)
    const line = nodes.find(one => one.type === 'Text' && /^(✓ Done|✕ Failed|Stopped)/.test(textOf(one)))
    const isAmber = nodes.some(one => [one.props?.color, one.props?.backgroundColor, one.props?.borderColor].includes(AMBER))
    return [edge?.props?.backgroundColor, line ? textOf(line) : undefined, line?.props?.color, isAmber]
  }
  const head = async () => (await pane.find({ type: 'Text', text: /working|waiting for you|^Nothing|^Just/ }))?.text
  const AT_WORK = ['#8A63F0', undefined, undefined, false]
  // At work from its start
  for (const id of ['a1', 'a2', 'a3', 'a4']) expect([id, ...(await card(id))]).toEqual([id, ...AT_WORK])
  // A turn's end is only a pause while a command of its own runs, or a helper of its own works, though Claude Code lists its run
  // as over: still purple, never amber
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'python3 fit.py', description: 'Run the fit', run_in_background: true } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the ears', prompt: 'go', parentAgentId: 'a2' } as never)
  for (const id of ['a1', 'a2']) {
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: `t-${id}`, reason: 'answer', agentId: id } as never)
    expect([id, ...(await card(id))]).toEqual([id, ...AT_WORK])
  }
  expect(await head()).toBe('4 working')
  // Waiting for the person, with its question on its card: amber, and no other card is; answered, it is purple again
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a3', text: 'May I redraw the left eye?', choices: ['Approve', 'Not now'] } as never)
  expect((await card('a3')).filter((_, n) => n !== 1 && n !== 2)).toEqual([AMBER, true])
  for (const id of ['a1', 'a2', 'a4']) expect([id, ...(await card(id))]).toEqual([id, ...AT_WORK])
  expect(await head()).toBe('1 waiting for you · 3 working')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a3', text: '' } as never)
  expect(await card('a3')).toEqual(AT_WORK)
  // Done, by handing in its result: green
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h3', agentId: 'a3', message: 'Both eyes are drawn.' } as never)
  expect(await card('a3')).toEqual(['success', '✓ Done', 'success', false])
  // Stopped by the person: no colour on its edge, its line dim
  await pane.press({ key: 'stop-a2' })
  expect(await card('a2')).toEqual([undefined, 'Stopped', undefined, false])
  expect((await pane.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  // Failed: red, saying why
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't-a4', reason: 'error', agentId: 'a4' } as never)
  expect(await card('a4')).toEqual(['error', '✕ Failed · Ended with an error', 'error', false])
  // Ended, each stays among the cards as it ended, an hour on and after another task's end (the done one's, above): stopped and
  // failed with Start again and Dismiss and nothing else
  const offered = async (id: string) => (await pane.findAll({ type: 'Button' })).filter(b => new RegExp(`^(stop|change|again-small|dismiss)-${id}(-\\d+)?$`).test(String(b.key))).map(b => b.props.label)
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  for (const ms of [2_100, 3_600_000]) {
    await clock.advance(ms)
    expect([ms, await card('a3'), await card('a2'), await card('a4'), await fold()]).toEqual([ms, ['success', '✓ Done', 'success', false], [undefined, 'Stopped', undefined, false], ['error', '✕ Failed · Ended with an error', 'error', false], undefined])
    expect([ms, await offered('a2'), await offered('a4')]).toEqual([ms, ['Start again', 'Dismiss'], ['Start again', 'Dismiss']])
  }
  // Dismissed, each is under Finished and stays there, and the one not dismissed stays up
  await pressed(pane, 'dismiss-a4')
  await pressed(pane, 'dismiss-a2')
  expect(await until(async () => ((await fold()) === '▸ Finished 2' ? true : undefined))).toBe(true)
  await clock.advance(3_600_000)
  expect([await fold(), (await card('a2'))[1], (await card('a4'))[1], await card('a3')]).toEqual(['▸ Finished 2', undefined, undefined, ['success', '✓ Done', 'success', false]])
  await pane.unmount()
})

test('the stop button of a to-do stops its work, and its card stays among the cards, plain, saying Stopped, with Start again and Dismiss, until it is dismissed', async ($, on) => {
  const { stopped, clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a1' })
  expect(stopped).toEqual(['a1'])
  // Stopped work stays in its place, plain, saying it was stopped, with no Stop: through its pause, an hour and another task's end
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text).filter(text => /nose|ears/.test(text))
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears'])
  expect((await pane.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await clock.advance(2_100)
  await clock.advance(3_600_000)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h2', agentId: 'a2', message: 'The ears match.' } as never)
  await clock.advance(2_100)
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears'])
  expect((await pane.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  // It offers Start again, as the person stopped it, and Dismiss, and nothing else
  const offered = async (id: string) => (await pane.findAll({ type: 'Button' })).filter(b => new RegExp(`^(stop|change|again-small|dismiss)-${id}(-\\d+)?$`).test(String(b.key))).map(b => b.props.label)
  expect(await offered('a1')).toEqual(['Start again', 'Dismiss'])
  // Dismissed, it is under Finished, and stays there
  await pressed(pane, 'dismiss-a1')
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  expect(await until(fold)).toBe('▸ Finished 1')
  expect(await titles()).toEqual(['Check the ears'])
  await clock.advance(3_600_000)
  expect([await fold(), await titles()]).toEqual(['▸ Finished 1', ['Check the ears']])
  await pane.unmount()
})

test("work that finishes comes to the top for two seconds, then stays among the cards, green, until it is dismissed: two at once, through an hour and another task's end, one ended while the panel was closed; done, it offers only Change something and Dismiss; dismissed, it stays under Finished; a message to it makes the same card work again, and done again when it hands in", async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)
  // (the bar above the prompt is drawn, which takes the box Change something opens)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'The nostril is closed on both sides.' } as never)
  // Its run over, as Claude Code lists it, and never pressed for a hand-back: its last words are its result, and it is done
  const end = (agentId: string, turnId: string) => ((agents[agentId] = 'completed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never))
  type Pane = Awaited<ReturnType<typeof $.ui.mount>>
  const titles = async (of: Pane) => (await of.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|eyes/.test(one.text)).map(one => one.text)
  const fold = async (of: Pane) => (await of.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  // The cards drawn done: each line's colour, and each green edge
  const dones = async (of: Pane) => [(await of.findAll({ type: 'Text', text: '✓ Done' })).map(one => one.props.color), (await of.findAll({ type: 'Box' })).filter(b => b.props.width === 1 && b.props.backgroundColor === 'success').length]
  // What a card offers beside its title
  const offered = async (of: Pane, id: string) => (await of.findAll({ type: 'Button' })).filter(b => new RegExp(`^(stop|change|again-small|dismiss)-${id}(-\\d+)?$`).test(String(b.key))).map(b => b.props.label)
  const head = async (of: Pane) => (await of.find({ type: 'Text', text: /working|waiting for you|^Nothing|^Just/ }))?.text
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)

  // Two that end together both go to the top, green, the newer first, over the one still working; neither is under Finished
  await clock.advance(400)
  await end('a1', 't1')
  await clock.advance(100)
  await end('a3', 't3')
  expect(await titles(pane)).toEqual(['Draw the eyes', 'Fix the nose', 'Check the ears'])
  expect(await dones(pane)).toEqual([['success', 'success'], 2])
  expect(await head(pane)).toBe('1 working')
  expect(await fold(pane)).toBeUndefined()
  // After their two seconds both are still among the cards, each in the place it began in, green, and so an hour later: no time
  // moves a card under Finished
  for (const ms of [2_100, 3_600_000]) {
    await clock.advance(ms)
    expect([ms, await titles(pane), await dones(pane), await fold(pane)]).toEqual([ms, ['Fix the nose', 'Check the ears', 'Draw the eyes'], [['success', 'success'], 2], undefined])
  }

  // Nor does another task's end, and work that ends while the panel is closed is up among the cards, green, when it opens
  await pane.unmount()
  await end('a2', 't2')
  await clock.advance(2_500)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect([await titles(again), await dones(again), await fold(again)]).toEqual([['Fix the nose', 'Check the ears', 'Draw the eyes'], [['success', 'success', 'success'], 3], undefined])
  expect(await head(again)).toBe('Nothing waits for you')
  // A done card's line is the last it wrote; it offers Change something and Dismiss and nothing else: no Stop, no Start again,
  // and no question about its result
  expect((await again.find({ type: 'Text', text: /^ · The nostril/ }))?.text).toBe(' · The nostril is closed on both sides.')
  for (const id of ['a1', 'a2', 'a3']) expect([id, await offered(again, id)]).toEqual([id, ['Change something', 'Dismiss']])
  expect(await again.find({ type: 'Text', text: /^Result ready/ })).toBeUndefined()

  // Dismiss puts it under Finished, and it stays there: an hour on, and as other work goes on and ends
  await pressed(again, 'dismiss-a1')
  expect(await until(() => fold(again))).toBe('▸ Finished 1')
  expect(await titles(again)).toEqual(['Check the ears', 'Draw the eyes'])
  await clock.advance(3_600_000)
  expect([await fold(again), await titles(again), await dones(again)]).toEqual(['▸ Finished 1', ['Check the ears', 'Draw the eyes'], [['success', 'success'], 2]])

  // A message to a done task makes the same card work again, purple with its Stop, and no second card; started again by
  // Claude Code under its id, it is still that one card
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a3', message: 'Shade the eyes too.' } as never)
  agents.a3 = 'running'
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'Shade the eyes too.', resume: { agentId: 'a3' } } as never)
  expect([await titles(again), await offered(again, 'a3'), await dones(again), await head(again), await fold(again)]).toEqual([['Check the ears', 'Draw the eyes'], ['Stop'], [['success'], 1], '1 working', '▸ Finished 1'])
  // When it hands in it is done again: at the top for its two seconds, then among the cards as before, the dismissed one still
  // under Finished
  agents.a3 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h3', agentId: 'a3', message: 'The eyes are shaded.' } as never)
  expect([await titles(again), await offered(again, 'a3'), await dones(again), await fold(again)]).toEqual([['Draw the eyes', 'Check the ears'], ['Change something', 'Dismiss'], [['success', 'success'], 2], '▸ Finished 1'])
  await clock.advance(2_100)
  expect([await titles(again), await dones(again), await fold(again)]).toEqual([['Check the ears', 'Draw the eyes'], [['success', 'success'], 2], '▸ Finished 1'])
  await again.unmount()
  await band.unmount()
})

// The world's `unresumable`: nothing sent to that agent is delivered, as for a run Claude Code no longer has
test('a message to a done task whose run is gone starts nothing and adds no card: once the list of what runs is read again its card is Done as before', async ($, on) => {
  const { clock, resumed } = world(on, { agents: { a1: 'completed' }, kinds: { a1: 'general-purpose' }, unresumable: new Set(['a1']) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'The nose is fixed.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(2_100)
  // How the list stands: its cards, the done ones, and whether the task has a Stop
  const stands = async () => [(await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose/.test(one.text)).map(one => one.text), (await pane.findAll({ type: 'Text', text: '✓ Done' })).map(one => one.props.color), Boolean(await pane.find({ type: 'Button', key: 'stop-a1' }))]
  expect(await stands()).toEqual([['Fix the nose'], ['success'], false])
  await $.prompt.submit({ text: 'Also close the left nostril.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “Also close the left nostril.”' } as never)
  // At once, and once the list of what runs has been looked at again
  // (the call itself went through, so until the list of what runs is next read the card is drawn at work; from then, and
  // ten minutes on, it is Done as before)
  for (const ms of [90_000, 600_000]) {
    await clock.advance(ms)
    expect([ms, ...(await stands())]).toEqual([ms, ['Fix the nose'], ['success'], false])
  }
  expect(resumed).toEqual([])
  await pane.unmount()
})

test('work the engine runs is listed even when the mod never saw it start, and work it lists as failed is failed on its card, in red, saying why', async ($, on) => {
  const agents: Record<string, string> = { a7: 'running' }
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /Listed/ }))?.text).toBe('Listed by the engine')
  // A helper the mod never saw start is no to-do
  agents.h9 = 'running'
  kinds.h9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await pane.findAll({ type: 'Text', text: /Listed/ })).toHaveLength(1)
  // (a run only the list shows as over is given half a minute, as Claude Code may be about to start its next step)
  agents.a7 = 'failed'
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: /^✕ Failed/ })).toBeUndefined()
  await clock.advance(40_000)
  const failed = await until(() => pane.find({ type: 'Text', text: /^✕ Failed/ }))
  expect([failed?.text, failed?.props.color]).toEqual(['✕ Failed · Ended with an error', 'error'])
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing waits for you')
  await pane.unmount()
})

test('a helper and tasks that ended while the mod was out are ended on their cards from their saved record: the helper done with its words while its task works on, started again by nothing of Claudopus; a task done with the result its record says it handed in, or with its last words where Claude Code never pressed it for one, and failed, "Ended without its result", where it did; never drawn at work or warned about as stuck (16 Nov a second look that ended unheard was drawn at work for 47 minutes)', async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock, files, resumed, appended } = world(on, { agents })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Second look', prompt: 'go', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  // The work ends its step while its helper works: it is still at work
  await $.turn.complete({ answer: 'Waiting on the second look.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /^3 working/ }))?.text).toBe('3 working')
  // A run's own record, as Claude Code keeps it: finished, with its last rows
  const folder = `${HOME}/.claude/projects/-repo/engine-id/subagents`
  const row = (type: string, content: unknown) => JSON.stringify({ timestamp: '2026-11-16T13:25:13Z', type, message: { role: type, content } })
  const handback = (text: string) => row('assistant', [{ type: 'tool_use', name: 'SubagentHandback', input: { message: text } }])
  const words = (text: string) => row('assistant', [{ type: 'text', text }])
  const PRESS = row('user', '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.')
  const over = (id: string, description: string, spawnDepth: number, ...rows: string[]) => {
    files.set(`${folder}/agent-${id}.meta.json`, JSON.stringify({ description, spawnDepth, finished: true, ...(spawnDepth > 1 ? { parentAgentId: 'a1' } : {}) }))
    files.set(`${folder}/agent-${id}.jsonl`, rows.join('\n'))
  }
  const saved = () => {
    const kept = JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}') as Record<'cards' | 'helpers' | 'ended', { id: string; status: string; answer: string; why?: string }[] | undefined>
    return [...(kept.cards ?? []), ...(kept.helpers ?? []), ...(kept.ended ?? [])]
  }
  // The helper hands in its report while the mod is out: no end is heard, and the engine no longer lists it. It ends on its card
  // with its report
  over('a2', 'Second look', 2, handback('Nothing wrong found.'))
  await clock.advance(70_000)
  expect(await until(async () => saved().find(one => one.id === 'a2' && one.status === 'done'))).toMatchObject({ answer: 'Nothing wrong found.' })
  // Its task works on: Claude Code gives it its helper's result itself, and nothing of Claudopus starts it again or tells it
  await clock.advance(2 * 60_000)
  expect(saved().find(one => one.id === 'a1')?.status).toBe('working')
  expect([...resumed, ...appended].filter(line => line.startsWith('a1: '))).toEqual([])
  // Each task's own end while the mod is out, by what its record says: its result handed in; its last words, never pressed for a
  // hand-back; its last words, then Claude Code's press for a hand-back that never came
  over('a1', 'Fix the nose', 1, words('Checking the fix.'), handback('The fix is released.'))
  over('a3', 'Check the ears', 1, words('The ears match the scan.'))
  over('a4', 'Draw the eyes', 1, words('I have drawn the left eye so far.'), PRESS)
  await clock.advance(13 * 60_000)
  expect(await until(async () => (saved().some(one => one.status === 'working') ? undefined : true))).toBe(true)
  expect(['a1', 'a3', 'a4'].map(id => saved().find(one => one.id === id)).map(one => [one?.status, one?.answer, one?.why])).toEqual([
    ['done', 'The fix is released.', undefined],
    ['done', 'The ears match the scan.', undefined],
    ['failed', 'I have drawn the left eye so far.', 'Ended without its result'],
  ])
  // The failed one stays up, red, saying why, with Start again; nothing was warned about as stuck
  const failed = await until(() => pane.find({ type: 'Text', text: /^✕ Failed/ }))
  expect([failed?.text, failed?.props.color]).toEqual(['✕ Failed · Ended without its result', 'error'])
  expect((await pane.findAll({ type: 'Button' })).filter(b => b.props.label === 'Start again').map(b => String(b.key).replace(/-\d+$/, ''))).toEqual(['again-small-a4'])
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing waits for you')
  expect(await pane.find({ type: 'Text', text: /No progress|quiet|Nothing new/ })).toBeUndefined()
  await pane.unmount()
})

test('work the chat started that was running before the mod loaded, as after a rename, is a card of its own, not a helper', async ($, on) => {
  const agents: Record<string, string> = { w5: 'running' }
  const kinds: Record<string, string> = { w5: 'general-purpose' }
  const talk = [{ role: 'assistant', text: '', toolUses: [{ tool_use_id: 'x1', tool: 'Agent', input: { description: 'Listed by the engine' } }] }]
  world(on, { agents, kinds, talk })
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await pane.find({ type: 'Text', text: /Listed/ }))?.text).toBe('Listed by the engine')
  expect((await pane.find({ type: 'Text', text: /^1 working/ }))?.text).toBe('1 working')
  await pane.unmount()
})

test('work that ended before the mod kept it is read back from the chat\'s own records, its thinking never', async ($, on) => {
  const { files } = world(on)
  const folder = `${HOME}/.claude/projects/-repo/engine-id/subagents`
  files.set(`${folder}/agent-r1.meta.json`, JSON.stringify({ description: 'Old work', spawnDepth: 1, finished: true }))
  files.set(`${folder}/agent-h1.meta.json`, JSON.stringify({ description: 'A helper of it', spawnDepth: 2, finished: true }))
  files.set(`${folder}/agent-h1.jsonl`, JSON.stringify({ timestamp: '2026-11-11T10:00:00Z', type: 'user', message: {} }))
  const rows = [
    { timestamp: '2026-11-11T10:00:00Z', type: 'user', message: { content: 'go' } },
    {
      timestamp: '2026-11-11T10:05:00Z',
      type: 'assistant',
      message: {
        model: 'claude-opus-5-5',
        usage: { input_tokens: 10, cache_read_input_tokens: 1000, output_tokens: 5 },
        content: [
          { type: 'thinking', thinking: 'a secret thought' },
          { type: 'tool_use', name: 'mcp__progress__todo', input: { item: 'Step one', state: 'done' } },
          { type: 'tool_use', name: 'mcp__other__note', input: { text: 'not ours' } },
          { type: 'tool_use', name: 'mcp__progress__note', input: { text: 'The old line' } },
        ],
      },
    },
    'not json',
  ]
  files.set(`${folder}/agent-r1.jsonl`, rows.map(row => (typeof row === 'string' ? row : JSON.stringify(row))).join('\n'))
  await $.session.start(start)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const fold = await until(async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label))))
  expect(fold?.props.label).toBe('▸ Finished 1')
  await pane.press({ key: String(fold?.key) })
  expect((await pane.find({ type: 'Text', text: /The old line/ }))?.text).toBe(' · The old line')
  expect((await pane.find({ type: 'Text', text: /to-dos done ·/ }))?.text).toBe('Opus 5.5 · 1 of 1 to-dos done · 5m 00s')
  expect(await pane.find({ type: 'Text', text: /secret|not ours|helper/ })).toBeUndefined()
  await pane.unmount()
})

test('helpers hang inside their work\'s card as a tree, one slim row each that opens its Details; ended ones fold into one row laid out the same, and Details lists every one', async ($, on) => {
  // (what a helper's command printed, for its last lines under it in Details)
  const agents: Record<string, string> = {}
  const { clock, opened } = world(on, { agents, kinds: { a3: 'general-purpose', a5: 'general-purpose' }, parents: { a3: 'a2', a5: 'a1' }, jobs: { output: file => (/m1/.test(file) ? 'bridge 12 mm\nnostril 9 mm\n' : ''), wroteAt: () => 1_700_000_000_000 } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const helper = (description: string, parentAgentId: string) => $.agent.spawn({ subagentType: 'general-purpose', background: true, description, prompt: 'go', parentAgentId } as never)
  await helper('Measure the nose', 'a1')
  await clock.advance(1_000)
  await helper('Read the manual', 'a2')
  await clock.advance(1_000)
  await helper('Read the appendix', 'a2')
  await clock.advance(1_000)
  await helper('Measure the ears', 'a1')

  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  const lines = async () => (await pane.findAll({ type: 'Text' })).map(one => one.text).filter(text => /^[│├└┬─ ]{4,}$/.test(text))
  // Each helper is one row, joined to the row above it
  expect(await lines()).toEqual(['├─┬─', '│ ├───', '│ └───', '└───'])
  // Only what the chat started is a card
  expect((await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|manual|appendix/.test(one.text)).map(one => one.text)).toEqual(['Fix the nose'])
  // Each says its time beside its name, after its model and context once those are known, and has no dots
  expect((await pane.findAll({ type: 'Text', text: /^\ds$/ })).map(one => one.text)).toEqual(['3s', '3s', '2s', '1s', '0s'])
  expect((await keyed(pane, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  // Each opens its own Details by its name, with no mark at its end
  expect(await keyed(pane, 'go-list-a2')).toBeUndefined()
  await pressed(pane, 'open-list-a4')
  expect(await until(async () => opened.includes('work-a4') || undefined)).toBe(true)

  // A helper that ended leaves the tree after its pause; one that still has a helper at work stays to hold it
  agents.a3 = agents.a5 = 'completed'
  await $.turn.complete({ answer: 'Read.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' } as never)
  await $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a5' } as never)
  await clock.advance(2_100)
  expect(await lines()).toEqual(['├─┬─', '│ └───', '└───'])
  expect((await keyed(pane, 'open-rest-a1'))?.props.label).toBe('2 helpers ended')
  expect(await keyed(pane, 'go-rest-a1')).toBeUndefined()
  await pressed(pane, 'open-rest-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  expect(await keyed(pane, 'open-list-a3')).toBeUndefined()
  expect(await keyed(pane, 'open-list-a5')).toBeUndefined()
  await pane.unmount()

  // Where the surface draws, each row's lines end in a dot in the colour of how it stands, and rows meet: a helper with its own
  // has a line down from its dot, its last one turns to it in a curve past the line of the level above, and the closing row has a ring
  const drawn = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const svgs = (await drawn.findAll({ type: 'Svg' })).map(svg => ({ source: String(svg.props.source), alt: svg.props.alt })).filter(svg => svg.source.includes('stroke-opacity'))
  expect(svgs.map(svg => svg.alt)).toEqual(['Working', 'Working', 'Ended'])
  expect(svgs[0]?.source).toContain('d="M9 0V20M9 10H22M27 15V20"')
  expect(svgs[1]?.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"')
  expect(svgs[1]?.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>')
  // A row at work has its slow ring round the dot; the closing row of those that ended is still
  expect(svgs[1]?.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>')
  expect(svgs[2]?.source).not.toContain('<animate')
  expect(svgs[2]?.source).toContain('d="M9 0V5Q9 10 14 10H22"')
  expect(svgs[2]?.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>')
  // No row names a model, and none has the three dots: only the card itself does
  expect((await drawn.findAll({ type: 'Svg' })).filter(svg => svg.props.alt === 'Working now')).toHaveLength(1)
  await drawn.unmount()
  // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 20 }, surface: 'desktop' } as never)
  expect((await keyed(narrow, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  await narrow.unmount()
  // A helper with helpers of its own and a line of what it does under its name: the line from its dot down to them runs on beside
  // that line, as the line of the level above does (17 Nov it stopped there, so its rows hung from nothing), drawn and as text
  await $.tool.call({ tool: 'Bash', tool_use_id: 'm1', agentId: 'a2', command: 'python3 measure.py', description: 'Size the bridge', run_in_background: true } as never)
  // (its output is read on the calm redraw)
  await clock.advance(30_000)
  await clock.advance(30_000)
  const rails = async (surface: 'desktop' | 'terminal', requestId?: string) => {
    const view = await $.ui.mount({ ...LIST, ...(requestId ? { requestId } : {}), props: { ...LIST.props, bodyColumns: 80 }, surface } as never)
    const boxes = await view.findAll({ type: 'Box' })
    type Drawn = { type?: string; text?: string; props: Record<string, unknown>; children?: readonly unknown[] }
    const inside = (node: Drawn, type: string): Drawn | undefined => (node.type === type ? node : (node.children ?? []).map(kid => inside(kid as Drawn, type)).find(Boolean))
    const found = (boxes as unknown as (Drawn & { key?: string })[])
      .filter(box => /^(twig-rails-(list|details)-a2|tail-.+-\d+-rails)$/.test(String(box.key)))
      .map(box => (surface === 'desktop' ? String(inside(box, 'Svg')?.props.source) : (inside(box, 'Text')?.children ?? []).join('')))
    await view.unmount()
    return found
  }
  expect((await rails('desktop')).map(svg => svg.match(/d="([^"]*)"/)?.[1])).toEqual(['M9 0V20M27 0V20'])
  expect(await rails('terminal')).toEqual(['│ │  '])
  // and so in Details, past each line under it there, the last lines its command printed too
  const inDetails = await rails('desktop', 'work-a1')
  expect(inDetails.length).toBeGreaterThan(1)
  expect(inDetails.map(svg => svg.match(/d="([^"]*)"/)?.[1])).toEqual(inDetails.map(() => 'M9 0V20M27 0V20'))

  // The work's Details lists every helper, ended or not, as the same tree
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  expect((await tab.find({ type: 'Text', text: / helpers? working$/ }))?.text).toBe('1 command running · 2 of 4 helpers working')
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(text => /manual|appendix|Measure/.test(text))).toEqual(['Measure the nose', 'Read the manual', 'Read the appendix', 'Measure the ears'])
  // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
  expect((await tab.findAll({ type: 'Raster' })).filter(one => String(one.key).endsWith('-ring')).length).toBe(2)
  expect((await tab.findAll({ type: 'Text', text: '✓' })).length).toBe(2)
  expect(await keyed(tab, 'open-details-a3')).toBeDefined()
  await tab.unmount()
})

test('what a piece of work and its helpers have running is in its Details too, every job under the one that started it, and in a helper\'s own Details', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'run the site', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'run the site' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Fetch the weights', prompt: 'go', parentAgentId: 'a1' } as never)
  const call = (agentId: string, id: string, command: string, description: string) =>
    $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command, description, run_in_background: true } as never)
  await call('a1', 'b1', 'npm run dev', 'Serve the site')
  for (const n of [1, 2, 3, 4, 5]) await call('a2', `d${n}`, `curl -o w${n}.bin https://example.com/w${n}.bin`, `Download weights ${n}`)
  // (a run's name is a button, as a press opens its output)
  const texts = async (view: { findAll: (q: { type: 'Text' | 'Button' }) => Promise<{ text: string; props: Record<string, unknown> }[]> }) => [...(await view.findAll({ type: 'Text' })).map(one => one.text), ...(await view.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  // The work's Details: its own server first under it, then the helper with all five of its downloads, none folded into a count
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  // In drawing order, with the tree's lines: the server on the work's own line, the helper, its downloads one level under it
  const rows = (await tab.findAll({ type: 'Text' })).map(one => one.text)
  const picked = (await texts(tab)).filter(text => /^Serve the site|^Download weights/.test(text))
  // the server on the work's own line, the helper's downloads a level under it
  expect(rows.filter(text => /^ *[├└]───$/.test(text)).slice(0, 1)).toEqual(['├───'])
  expect(picked.sort()).toEqual([...[1, 2, 3, 4, 5].map(n => `Download weights ${n}`), 'Serve the site'])
  const shown = await texts(tab)
  expect(shown.some(text => /more (running|jobs)/.test(text))).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Helpers and commands$/ }))?.props.bold).toBe(true)
  expect(shown).toContain('6 commands running · 1 helper working')
  await tab.unmount()
  // The card on the list still folds the helper's jobs past JOBS_SHOWN into one row
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  expect((await texts(list)).filter(text => /Download weights/.test(text))).toHaveLength(3)
  expect((await texts(list)).some(text => /^2 more commands/.test(text))).toBe(true)
  await list.unmount()
  // The helper's own Details, with no helpers of its own, shows what it has running
  const helperTab = await $.ui.mount({ ...LIST, requestId: 'work-a2', props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const its = await texts(helperTab)
  expect((await helperTab.find({ type: 'Text', text: /^Commands$/ }))?.props.bold).toBe(true)
  expect(its).toContain('5 commands running')
  expect(its.filter(text => /Download weights/.test(text))).toHaveLength(5)
  expect(its.some(text => /Serve the site/.test(text))).toBe(false)
  await helperTab.unmount()
})

test('long work keeps only its newest ended helpers, and none of work that was forgotten', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const parents: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds, parents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (let n = 2; n <= 106; n += 1) {
    await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: `Measure ${n}`, prompt: 'go', parentAgentId: 'a1' } as never)
    await clock.advance(10)
    // (each run over, as Claude Code lists it)
    if (n <= 105) ((agents[`a${n}`] = 'completed'), (kinds[`a${n}`] = 'general-purpose'), (parents[`a${n}`] = 'a1'))
    if (n <= 105) await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t${n}`, reason: 'answer', agentId: `a${n}` } as never)
  }
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  // 104 ended, the oldest four forgotten; the one at work is never forgotten
  expect((await tab.find({ type: 'Text', text: / helpers? working$/ }))?.text).toBe('1 of 101 helpers working')
  const names = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(names.includes('Measure 5')).toBe(false)
  expect(names.includes('Measure 6')).toBe(true)
  await tab.unmount()
})

test('a long run shows how far it is from what it prints: how much of how much, its percent and speed, and whether output still comes', SLOW, async ($, on) => {
  let output = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r  5 1024M    5 51.2M    0     0  10.2M      0  0:01:40  0:00:05  0:01:35 10.5M\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M'
  let wroteAt = 0
  const { clock, stopped, appended } = world(on, { jobs: { output: () => output, wroteAt: () => wroteAt } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  // The mocked clock starts where the world sets it
  let now = 1_700_000_000_000
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true } as never)
  wroteAt = now
  await advance(20_000)
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  const texts = async (columns = 140) => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface: 'terminal' } as never)
    // (a run's name is a button, as a press opens its output)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  // How much of how much leads the side, its percent in blue, its speed and the time left curl gives, and never when it printed
  expect(await until(async () => ((await texts()).includes('460 MB of 1 GB · ') || undefined))).toBe(true)
  const shown = await texts()
  expect(shown).toContain('45%')
  expect(shown).toContain(' · 10.5 MB/s · 55s left')
  // While it gives word nothing is said of when
  expect(shown.some(text => /active|ago/.test(text))).toBe(false)
  // In a narrower panel its speed gives way first
  expect((await texts(100)).some(text => /^460 MB(\/| of )1 GB · $/.test(text))).toBe(true)
  // The work's own line, as its scripts are told to print it
  output = 'loading\nprogress: 3/6 steps fitting\nframe 12 done\n'
  wroteAt = now
  await advance(20_000)
  expect(await until(async () => ((await texts()).some(text => text.startsWith('3 of 6 steps · ')) || undefined))).toBe(true)
  // Quiet for long, in words
  wroteAt = now - 15 * 60_000
  await advance(20_000)
  expect(await until(async () => ((await texts()).some(text => /^Last: .* · nothing new for 1[5-9]m/.test(text)) || undefined))).toBe(true)
  // A raw line in plain words, with its log time and state code left out, then its sign of life; 16 Nov the row read
  // "35 MB · [run 11:27:50] waiting for the machine to start (Running)"
  output = 'starting\n[run 11:27:50] waiting for the machine to start (Running)\n'
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  const plain = await until(async () => (await texts()).find(text => /(^| · )waiting for the machine to start$/.test(text)))
  expect(plain).toBeDefined()
  expect((await texts()).some(text => /\[run|Running\)|\d MB ·/.test(text))).toBe(false)
  // A wait's count of tries is how far it is, its words that say its name again are left out, and when it last tried changes
  output = 'progress: 6 tries waiting for the CT scans\nprogress: 7 tries waiting for the CT scans\n'
  // (written a second before the end of the step, whenever in it the panel looks)
  wroteAt = now + 19_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^7 tries$/.test(text)))).toBeDefined()
  // Quiet for a minute or two it says nothing of it: tests, builds and installs go that quiet and are fine
  wroteAt = now - 100_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^7 tries$/.test(text)))).toBeDefined()
  expect((await texts()).some(text => /nothing new/.test(text))).toBe(false)
  // Silent for three minutes it says so, plainly, and Stop on its row stops it as Claude Code tracks it and tells the work it was stuck
  wroteAt = now - 185_000
  await advance(20_000)
  expect(await until(async () => (await texts()).find(text => /^Last: 7 tries · nothing new for 3m [1-3]0s( · Claude was told to check it)?$/.test(text)))).toBeDefined()
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const stop = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))
  expect(stop).toBeDefined()
  await list.press({ key: stop?.key ?? '' })
  await list.unmount()
  expect(await until(async () => stopped.includes('bg-n1') || undefined)).toBe(true)
  // (quiet three minutes, it is told it looked stuck)
  expect(await until(async () => appended.find(line => /^a1: .*stopped your command "Fetch the CT scans" from the panel because it looked stuck: it had printed nothing for 3m/.test(line)))).toBeDefined()
  await advance(5_000)
  // (its row goes)
  expect(await until(async () => ((await texts()).every(text => !/^Fetch the CT scans/.test(text)) || undefined))).toBe(true)
})

test('a percent moves up on its row within seconds of being printed, and a quiet of under three minutes says nothing (16 Nov: "nothing printed for 5 seconds, 10 seconds", while the percent sat still)', async ($, on) => {
  const meter = (pct: number) => `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r ${pct} 1024M   ${pct}  ${pct * 10}M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M`
  let output = meter(45)
  let now = 1_700_000_000_000
  let wroteAt = now
  const { clock } = world(on, { jobs: { output: () => output, wroteAt: () => wroteAt } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  // (in short steps, as the panel's every-second look runs once for each advance of the clock; the list is followed every 20)
  const advance = async (ms: number) => {
    for (let left = ms; left > 0; left -= 3_000) {
      now += Math.min(3_000, left)
      await clock.advance(Math.min(3_000, left))
    }
  }
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const all = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return all
  }
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true } as never)
  await advance(21_000)
  expect(await until(async () => ((await texts()).includes('45%') || undefined))).toBe(true)
  // curl rewrites its meter: the row has the new percent before the list is next followed
  output = meter(52)
  wroteAt = now
  await advance(15_000)
  expect(await texts()).toContain('52%')
  // quiet for half a minute after, its percent stands with nothing said of the quiet
  await advance(30_000)
  const quiet = await texts()
  expect(quiet).toContain('52%')
  expect(quiet.some(text => /nothing new|No output/.test(text))).toBe(false)
})

test('a run whose output cannot be found says so after three minutes, so a blank row is never taken for one that moves', async ($, on) => {
  const { clock } = world(on)
  on('session.cwd', () => ({ value: '/repo' }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fetch the scans', prompt: 'fetch the scans' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true } as never)
  await clock.advance(190_000)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const shown = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  // Its name, its kind already said in the work's own words
  expect(shown.some(text => /^Fetch the CT scans/.test(text))).toBe(true)
  expect(shown.some(text => /^No output yet · started \d+m ago( · Claude was told to check it)?$/.test(text))).toBe(true)
  await list.unmount()
})

test('nothing a task or its helper starts may only wait held open, pass time or wait for helpers anywhere, detach what it starts or only follow a log: each is refused in one sentence; a wait for something far away sent to the background is a watch, a row on its card; and as a command of its own ends, its card\'s line stays the work\'s own words, never a line of commands that ended (16 Nov an upload read 100% beside "about 40% done"; 18 Nov "Run: …: ended" stood in place of the task\'s note; a helper polled for a file its own script wrote)', SLOW, async ($, on) => {
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  let isEnded = false
  const { clock, appended, resumed, stopped } = world(on, { agents: { a1: 'running' }, jobs: { output: file => (file === `${TASKS}/bg-u1.output` ? `progress: 8/8 GB uploading\n${isEnded ? '\n[exited with code 0]\n' : ''}` : ''), wroteAt: () => 1_700_000_000_000 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'upload the zips', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Upload the zips', prompt: 'upload the zips' } as never)
  await $.agent.spawn({ ...spawn, description: 'Loaders for every open head set', prompt: 'load', parentAgentId: 'a1' } as never)
  const run = async (agentId: string, id: string, tool: string, command: string, description: string, isBackground = false) =>
    ((await $.tool.call({ tool, tool_use_id: id, agentId, command, description, ...(isBackground ? { run_in_background: true } : {}) } as never)) as { deny?: string }).deny
  // (a bracketed time in a description, as descriptions once carried, is never shown)
  expect(await run('a1', 'u1', 'Bash', 'curl -T zips.zip https://example.com/up', 'Upload both zips to the folder (about 15 min)', true)).toBeUndefined()
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'The upload is about 40% done; it should finish in about 15 minutes.' } as never)
  await clock.advance(20_000)
  const HELD = 'Not run: this command only waits, and held open it keeps you from everything else. Send the same call again with `run_in_background: true`'
  const TIME = 'Not run: this command only passes time, and nothing you start may wait by the clock.'
  const HELPERS = "Not run: this command only waits for your helpers. Each helper's result comes to you as a message, even after you end your step"
  const DETACH = 'Not run: this command detaches what it starts (nohup, setsid, disown or a trailing &), so nothing would show it on your card or tell you when it ends. Send the command itself, without those, with `run_in_background: true`.'
  const FOLLOW = 'Not run: this only follows a log and would never end'
  const O = '/private/tmp/claude-501/x/tasks'
  const POLL = 'for i in $(seq 1 55); do kill -0 48213 2>/dev/null || break; echo "progress: $i/55 tries waiting for the upload"; sleep 10; done; grep -E "ERROR|Copied" /w/upload.log | tail -5'
  // Who asks, with which tool, the command, whether it is sent to the background, and what it is told ('' when it runs)
  const cases: [string, string, string, boolean, string][] = [
    // held open, a wait keeps the task from everything else, whatever it waits for and whatever shape its loop takes
    ['a1', 'Bash', POLL, false, HELD],
    ['a1', 'Bash', "until ! pgrep -f 'curl -T zips.zip' >/dev/null; do echo \"progress: 1 tries\"; sleep 10; done", false, HELD],
    ['a2', 'Bash', `n=0; until grep -q "Counter" ${O}/b1it4kmrm.output; do n=$((n+1)); echo "progress: $n tries waiting for fit timing"; sleep 8; [ $n -gt 60 ] && break; done; cat ${O}/b1it4kmrm.output | tail -12`, false, HELD],
    ['a2', 'Bash', 'until curl -s localhost:3000 >/dev/null; do echo "progress: 1 tries"; sleep 2; done', false, HELD],
    // by the clock, or for its helpers, nothing waits, in the background either
    ['a1', 'Bash', 'sleep 300; cat out.log', false, TIME],
    ['a2', 'Bash', 'sleep 300; cat out.log', true, TIME],
    ['a1', 'Bash', "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", false, HELPERS],
    ['a1', 'Bash', "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", true, HELPERS],
    // nothing is detached from Claude Code's sight: under nohup, or sent off with a trailing &
    ['a1', 'Bash', 'cd /w && nohup curl -T rest.zip https://example.com/up > rest.log 2>&1 & echo $!', false, DETACH],
    ['a2', 'Bash', 'python3 sets.py > sets.log 2>&1 &', false, DETACH],
    // a tail that follows a log never ends and tells the work nothing
    ['a1', 'Bash', 'tail -f /w/upload.log | grep --line-buffered ERROR', true, FOLLOW],
    // a look once, a sifter beside the upload, and a helper's real work run
    ['a1', 'Bash', 'tail -5 /w/upload.log', false, ''],
    ['a1', 'Bash', 'ugrep --line-buffered wrote', true, ''],
    ['a2', 'Bash', 'cd /w && python sets.py', false, ''],
    // and a wait for something far away is a watch: the same command in the background, or a Monitor
    ['a1', 'Bash', 'until curl -sf https://example.com/up/done >/dev/null; do echo "progress: 1 tries"; sleep 20; done', true, ''],
    ['a1', 'Monitor', 'until az batch job show --job-id fit --query state -o tsv | grep -q completed; do sleep 30; done', false, ''],
  ]
  const told: [string, string][] = []
  for (const [agentId, tool, command, isBackground, refusal] of cases) {
    const id = tool === 'Monitor' ? 'm1' : command.startsWith('ugrep') ? 'g1' : command.startsWith('until curl -sf') ? 'w1' : 'x'
    const deny = (await run(agentId, id, tool, command, tool === 'Monitor' ? 'Watch the Azure fit' : command.startsWith('until curl -sf') ? 'Watch for the upload to be listed' : 'Run it', isBackground)) ?? ''
    told.push([command, deny.slice(0, refusal.length || 40)])
  }
  expect(told).toEqual(cases.map(([, , command, , refusal]) => [command, refusal]))
  const line = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const texts = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return texts
  }
  // Each watch is a row of its own, of kind Watch, and the upload's row says nothing of the time its description gave
  const rows = await line()
  expect(rows.filter(text => /^Watch\b/.test(text)).sort()).toEqual(['Watch for the upload to be listed', 'Watch the Azure fit'])
  expect(rows.some(text => /\(about|of about|\bover$/.test(text))).toBe(false)
  expect(rows.some(text => /about 40% done/.test(text))).toBe(true)
  // The upload ends, by the engine's last line on its output: its row goes at once, and the card keeps the work's own words,
  // never "…: ended". Nothing of Claudopus starts the task again or tells it so: Claude Code starts its next step itself
  isEnded = true
  for (let n = 0; n < 3; n++) await clock.advance(20_000)
  expect(['its row goes', await until(async () => ((await line()).some(text => /^Upload both zips/.test(text)) ? undefined : true))]).toEqual(['its row goes', true])
  expect((await line()).some(text => /: ended$/.test(text ?? ''))).toBe(false)
  expect((await line()).some(text => /about 40% done/.test(text))).toBe(true)
  expect([...appended, ...resumed].filter(one => /has ended/.test(one))).toEqual([])
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'Both zips are in the folder; I am checking them.' } as never)
  expect(['its new line', await until(async () => ((await line()).some(text => text === 'Both zips are in the folder; I am checking them.') || undefined))]).toEqual(['its new line', true])
  expect((await line()).some(text => /about 40% done/.test(text ?? ''))).toBe(false)
  // The sifter outlived what it read, once the helper has ended too: stopped a minute on, and the work told why, once. The
  // watches, which look for something far away, are left
  await $.turn.complete({ answer: 'The loaders are written.', durationMs: 1, isAborted: false, turnId: 'th', reason: 'answer', agentId: 'a2' } as never)
  for (let n = 0; n < 3; n++) await clock.advance(20_000)
  expect(['the sifter is stopped', await until(async () => stopped.includes('bg-g1') || undefined)]).toEqual(['the sifter is stopped', true])
  expect(await until(async () => appended.find(one => /^a1: Your command ".*" was stopped: it only read the output of commands that have all ended\./.test(one)))).toBeDefined()
  await clock.advance(60_000)
  expect(appended.filter(one => /it only read the output of commands/.test(one))).toHaveLength(1)
  expect(stopped).toEqual(['bg-g1'])
  expect((await line()).filter(text => /^Watch\b/.test(text))).toHaveLength(2)
})

test('every run under a card says how it stands: a command that printed nothing says so, a watch its last event, and a press on its name shows its output whole; 15 Nov rows said only "updated 9m ago"', SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  const outputs: Record<string, () => string> = { [`${TASKS}/bg-r1.output`]: () => '', [`${TASKS}/mon-m1.output`]: () => 'series arrived\nwrote vsd-02.png\n' }
  const wrote: Record<string, () => number> = { [`${TASKS}/bg-r1.output`]: () => 1_700_000_000_000, [`${TASKS}/mon-m1.output`]: () => now - 30_000 }
  const { clock, shown: opened, files } = world(on, { jobs: { output: file => outputs[file]?.() ?? '', wroteAt: file => wrote[file]?.() ?? 0 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'redraw and fetch', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Redraw and fetch', prompt: 'go' } as never)
  // A script that sends all it prints to files of its own, and a watch, the work's own words for each
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r1', agentId: 'a1', command: 'bash /s/round3b_figs.sh', description: 'Redraw all pictures (about 1 min)', run_in_background: true } as never)
  await $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'tail -n0 -F sheet.log', description: 'Azure jobs finishing' } as never)
  for (let n = 0; n < 15; n++) await advance(20_000)
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
    // (a run's name is a button, as a press opens its output)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  const shown = (await until(async () => {
    const all = await texts()
    return all.some(text => /^No output yet/.test(text)) ? all : undefined
  })) ?? []
  // The script that printed nothing says so and for how long, never that it was updated; its row has how long it has run, and
  // nothing of the time its description gave, well past it
  expect(shown.some(text => /^Command · Redraw all pictures$/.test(text))).toBe(true)
  expect(shown.some(text => /^No output yet · started \d+m ago( · Claude was told to check it)?$/.test(text))).toBe(true)
  expect(shown.some(text => /updated/.test(text))).toBe(false)
  expect(shown.filter(text => text === '5m 00s').length).toBeGreaterThan(1)
  expect(shown.some(text => /\(about|of about|\bover$/.test(text))).toBe(false)
  // The watch, its last event and when it came
  expect(shown.some(text => /^Watch · Azure jobs finishing/.test(text))).toBe(true)
  expect(shown.some(text => /^Watching( · last: |$)/.test(text))).toBe(true)
  // its event's file name is never shown
  expect(shown.some(text => /vsd-02/.test(text))).toBe(false)
  // A press on a run's name shows its output whole in a Terminal window, as it goes on
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
  const before = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Command · Redraw all pictures')?.key ?? ''
  await list.press({ key: before })
  const argv = await until(async () => opened.find(one => String(one[1]).endsWith('/output.command')))
  expect(files.get(String(argv?.[1]))).toContain(`exec tail -n 1000 -F '${TASKS}/bg-r1.output'`)
  // and moves the buttons' keys, so the panel is not pulled back to the row it pressed
  const after = await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Command · Redraw all pictures' && b.key !== before)?.key)
  expect(after).toBeDefined()
  await list.unmount()
})

test('only runs really running are listed: a watch the engine killed at its time limit, a command that failed and one that finished leave at once, counted on the closing row and told apart in Details; 15 Nov three "[killed]" watches stayed with their clocks running', SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  const born = now
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  const MIN = 60_000
  // The 15 Nov card: two alike watches set 30 minutes, one more, and the wait that was really still going
  const outputs: Record<string, () => string> = {
    [`${TASKS}/mon-m1.output`]: () => (now - born >= 30 * MIN ? '\n[killed]\n' : ''),
    [`${TASKS}/mon-m2.output`]: () => (now - born >= 30 * MIN ? '\n[killed]\n' : ''),
    [`${TASKS}/bg-w1.output`]: () => '',
    [`${TASKS}/bg-f1.output`]: () => (now - born >= 3 * MIN ? 'Traceback: boom\n\n[exited with code 1]\n' : ''),
    [`${TASKS}/bg-k1.output`]: () => (now - born >= 2 * MIN ? 'all good\n\n[exited with code 0]\n' : ''),
    // one past the time its description gave that prints how long it has left, and one that does not
    [`${TASKS}/bg-p1.output`]: () => 'progress: 3/6 steps fitting eta 4m\n',
    [`${TASKS}/bg-p2.output`]: () => 'drawing frames\n',
  }
  const { clock } = world(on, { jobs: { output: file => outputs[file]?.() ?? '', wroteAt: () => now - 2_000 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'save the videos', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Save the videos', prompt: 'go' } as never)
  const watch = (id: string) => $.tool.call({ tool: 'Monitor', tool_use_id: id, agentId: 'a1', command: 'tail -f /s/screen.log | grep --line-buffered "pass 1 done"', description: 'Wait for first screening pass (about 35 min)', timeout_ms: 3_000_000, persistent: false } as never)
  await watch('m1')
  await watch('m2')
  const bg = (id: string, command: string, description: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command, description, run_in_background: true } as never)
  await bg('w1', 'python3 screen.py --details', 'Wait for the details screening to finish (about 55 min)')
  await bg('f1', 'python3 fetch.py', 'Run the fetch of the list')
  await bg('k1', 'python3 tidy.py', 'Run the tidy up')
  await bg('p1', 'python3 fit.py', 'Run the fit (about 20 min)')
  await bg('p2', 'python3 frames.py', 'Run the drawing of frames (about 20 min)')
  const texts = async (surface = 'terminal') => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 160 }, surface } as never)
    const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
    await list.unmount()
    return all
  }
  for (let n = 0; n < 10; n++) await advance(MIN)
  // Before the limit both watches run, as one row of two
  expect((await texts()).some(text => /^Wait for first screening pass ×2$/.test(text))).toBe(true)
  for (let n = 0; n < 39; n++) await advance(MIN)
  const shown = (await until(async () => {
    const all = await texts()
    return all.some(text => /^4 commands ended/.test(text)) ? all : undefined
  })) ?? []
  // The watches the engine killed at their limit, the failed and the finished command are gone from the tree, and no clock runs for them
  expect(shown.some(text => /\[killed\]/.test(text))).toBe(false)
  expect(shown.some(text => /^(Wait for first screening pass ×2|Run the fetch of the list|Run the tidy up)\b(?!: (failed|done))/.test(text))).toBe(false)
  // (the card's own line never names the commands that ended: how each ended is in Details, 18 Nov)
  expect(shown.some(text => /^Run the (tidy up|fetch of the list): (done|failed)/.test(text))).toBe(false)
  // The closing row counts them and says, in words, how many did not finish well
  expect(shown).toContain('4 commands ended · 1 failed, 2 ran out of time')
  // The wait still running stays, and the two fits: each row with how long it has run and nothing of the time its description
  // gave, within it or long past it
  expect(shown).toContain('Wait for the details screening to finish')
  expect(shown.filter(text => text === '49m 00s')).toHaveLength(4)
  expect(shown.some(text => /of about|\bover$|\(about|\d+ min\b/.test(text))).toBe(false)
  // Details names each ended run with how it ended
  const pane = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 160 }, surface: 'terminal' } as never)
  const details = (await pane.findAll({ type: 'Text' })).map(one => one.text)
  await pane.unmount()
  expect(details).toContain('Commands ended')
  expect(details.filter(text => text === 'Wait for first screening pass').length).toBe(2)
  expect(details.filter(text => /^Ran out of time after (29|30)m \d\ds · /.test(text)).length).toBe(2)
  expect(details.some(text => /^Failed after \dm \d\ds · /.test(text))).toBe(true)
  expect(details.some(text => /^Done in \dm \d\ds · /.test(text))).toBe(true)
  // Later the wait is past the time its description gave too: its row still says only how long it has run
  for (let n = 0; n < 8; n++) await advance(MIN)
  const later = await texts()
  expect(later).toContain('57m 00s')
  expect(later.some(text => /of about|\bover$/.test(text))).toBe(false)
})

test("a run's second line starts under its name, with the tree's lines carried down beside it: not the last, the last, a run under a helper, a narrow panel, on a desktop and in a terminal; 15 Nov the app dropped the lines and the line started left of the tree", SLOW, async ($, on) => {
  let now = 1_700_000_000_000
  const TASKS = '/tmp/claude-501/x/s1/tasks'
  const outputs: Record<string, string> = { [`${TASKS}/bg-n1.output`]: 'loading\nprogress: 3/6 steps fitting\n', [`${TASKS}/bg-n2.output`]: 'progress: 2/3 files uploading eta 4m\n', [`${TASKS}/bg-n3.output`]: 'progress: 10/40 pictures drawing\n' }
  const { clock } = world(on, { jobs: { output: file => outputs[file] ?? '', wroteAt: () => now - 2_000 } })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now += ms), await clock.advance(ms))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fit and upload', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fit and upload', prompt: 'go' } as never)
  const sent = (agentId: string, id: string, script: string, description: string) =>
    $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command: `cd /w && python ${script}`, description, run_in_background: true } as never)
  await sent('a1', 'n1', 'fit.py', 'Run the fit of every head')
  await sent('a1', 'n2', 'up.py', 'Upload the cleaned A, B, C over the old ones')
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Draw the pictures', prompt: 'go', parentAgentId: 'a1' } as never)
  await sent('a2', 'n3', 'pics.py', 'Run the drawing of every picture')
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Check the drawing', prompt: 'go', parentAgentId: 'a1' } as never)
  for (let n = 0; n < 6; n++) await advance(20_000)

  type Node = { type?: string; key?: string; text?: string; props: Record<string, unknown>; children?: unknown[] }
  const kids = (node: Node) => (node.children ?? []).filter(one => one && typeof one === 'object') as Node[]
  const all = (node: Node): Node[] => [node, ...kids(node).flatMap(all)]
  const textOf = (node: Node) => all(node).filter(one => one.type === 'Text').flatMap(one => (one.children ?? []).filter(part => typeof part === 'string')).join('')
  // Each run's two lines: the head (its lines and mark, its name, its time) and how it stands (the lines carried down, the words)
  const rows = async (surface: 'desktop' | 'terminal', columns: number) => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface } as never)
    const found = await until(async () => {
      const boxes = (await pane.findAll({ type: 'Box' })) as unknown as Node[]
      const runs = boxes.filter(one => /^job-list-job-/.test(String(one.key ?? '')) && kids(one).length === 2)
      return runs.length === 3 ? runs : undefined
    })
    const svgs = (await pane.findAll({ type: 'Svg' })) as unknown as Node[]
    await pane.unmount()
    return { runs: (found ?? []).map(one => ({ head: kids(kids(one)[0] as Node)[0] as Node, stand: kids(one)[1] as Node })), svgs }
  }
  for (const columns of [72, 40]) {
    // In a terminal: the carried lines are as wide as the head's lines and mark, so the words start in its name's column, a line
    // under each line that goes on and none under the last
    const { runs } = await rows('terminal', columns)
    expect(runs).toHaveLength(3)
    const seen = runs.map(({ head, stand }) => {
      const lines = textOf(head)
      const rails = textOf(kids(stand)[0] as Node)
      expect(rails.length).toBe(lines.length)
      expect([...rails].map((ch, n) => (ch === '│') === /[│├]/.test(lines[n] ?? ''))).toEqual([...rails].map(() => true))
      expect(stand.props.height).toBe(1)
      return lines
    })
    // every case is here: a run that is not the last, the last, and one under a helper with the work's own line going on beside it
    expect(seen.some(lines => lines.startsWith('├'))).toBe(true)
    expect(seen.some(lines => lines.startsWith('└') || /^│ └/.test(lines))).toBe(true)
    expect(seen.some(lines => /^│ [├└]/.test(lines))).toBe(true)
    // On a desktop: every picture has the words the app needs to draw it at all, and the carried lines are as wide as the head's
    const drawn = await rows('desktop', columns)
    for (const svg of drawn.svgs) {
      expect(String(svg.props.alt ?? '').trim()).not.toBe('')
      expect(Number(svg.props.width)).toBeGreaterThan(0)
    }
    for (const { head, stand } of drawn.runs) {
      const [lines] = all(head).filter(one => one.type === 'Svg')
      const [rails] = all(kids(stand)[0] as Node).filter(one => one.type === 'Svg')
      expect(rails?.props.width).toBe(lines?.props.width)
      // and the words move in by the step the name's own button pads it with
      expect(kids(stand)[1]?.props.paddingLeft).toBe('xs')
      expect(String(rails?.props.source)).toContain('<path')
    }
  }
  // How it stands is now: how far, and how long is left only where the run's own line says so (its eta): none is worked out
  // from its percent, and never when it printed
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'terminal' } as never)
  const shown = (await pane.findAll({ type: 'Text' })).map(one => one.text).join('\n')
  await pane.unmount()
  expect(shown).toContain('4m left')
  expect(shown).not.toMatch(/about \d+m? ?\d*s? left/)
  expect(shown).not.toMatch(/printed/)
  // A narrow panel keeps the count the run itself printed, and a time left only for the run whose own line gave one
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 40 }, surface: 'terminal' } as never)
  const tight = (await narrow.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(tight.filter(text => /\d+[ms] left/.test(text)).every(text => text.includes('4m left'))).toBe(true)
  expect(tight.some(text => /3 of 6|3\/6/.test(text))).toBe(true)
  // and one under a helper, with less room, keeps its count
  expect(tight.some(text => text.includes('10/40'))).toBe(true)
  await narrow.unmount()
})
