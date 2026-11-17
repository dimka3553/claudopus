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
function test(name: string, body: TestBody): void
function test(name: string, options: { timeoutMs?: number }, body: TestBody): void
function test(name: string, options: TestBody | { timeoutMs?: number }, body?: TestBody) {
  if (typeof options === 'function') kitTest(name, SLOW, options)
  else kitTest(name, { ...SLOW, ...options }, body as TestBody)
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
const SHIPPED_PRINCIPLES: string = "# How I work with Claude\n\nThese are my principles. Every chat and every task follows them.\n\n## Core truths\n\n- My words are the spec. They beat Claude's earlier suggestions.\n- Solutions, not questions. Research it properly, then bring a solution with the evidence. Ask only when it needs my hands or can't be undone: one recommendation, yes or no.\n- Build only what I asked for, and name everything that was built.\n- Show me the result. My yes or no is the gate, not the agent's verdict.\n\n## Boundaries\n\n- A new message adds to the current task. It switches to a new task only if I say so.\n- If the work doesn't depend on it right now, drop it.\n- A repo's own files and notes win over these principles for that repo.\n\n## Vibe\n\n- Short replies and short rules. Say it once, in general terms, without examples.\n- Before starting, say back what I want to find out and what you will show me.\n\n## Checking\n\n- Set the bar with what already exists, and show each new attempt beside it on the same input.\n- Judge a result by looking at it, not by a number.\n- Before showing me a result, have a second agent that didn't build it look for what is wrong. A lookup or a small fix proved directly goes without.\n- Show the first result early. After two or three failed fixes, question the approach.\n- A surprising number means checking our own code first.\n- Explore with mockups and tests. Build for real once I say the decision is final.\n\n## Continuity\n\n- Context lives in files. Chats are disposable and stay small.\n- Read files in one batch. Send big searches and outputs to helpers.\n- Each session works on its own branch and ends with what shipped and what's left.\n"
// The prompt each piece of work started with, as the mod left it
const prompts: string[] = []

// A release on GitHub as the test world gives it: its version, commit and the tree it published; `got` a different tree that came
// down instead, `manifest` a different version in it, `online` a newer commit online, and a fetch that fails, a folder with commits of its
// own, or uncommitted changes the move would overwrite
type Release = { version: string; commit: string; tree: string; got?: string; manifest?: string; online?: string; fetchFails?: boolean; ownCommits?: boolean; overwrite?: boolean; worktree?: boolean; noBranch?: boolean }
// The world beneath the mod: files in memory, the app's session tools, a cheap model
const world = (on: On, options: { tailscale?: string; reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean }; usage?: (script: string) => string; startedOn?: Record<string, string>; release?: Release } = {}) => {
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
  const clock = mock.clock(on, { now: 1_700_000_000_000 })
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
    if (isShipped && e.path.endsWith('roles/work.md')) return { value: 'WORK ROLE; an admin command runs through `{admin}`; a key runs as `{secret} NAME`; main is reached through `{release}`' }
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
  on('session.id', () => ({ value: 'engine-id' }))
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
    if (options.jobs?.fd && tool === 'sh' && String(rest[1]).includes('/proc/$p/fd/1')) return ok(options.jobs.fd())
    // The engine's tasks folder, where the test reads jobs
    if (options.jobs && tool === 'sh' && String(rest[1]).includes('"$1"/tasks')) return ok('/tmp/claude-501/x/s1/tasks\n')
    // What sips says of a picture, where the test gives it
    const sipsSaid = tool === 'sips' ? options.sips?.([...e.argv]) : undefined
    if (sipsSaid !== undefined) return { value: { exitCode: 0, stdout: sipsSaid, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    if (tool === 'osascript') osa.push([...e.argv])
    // What was handed to this Mac's keychain on security's stdin
    if (tool === '/usr/bin/security' && !files.has(KEYCHAIN)) files.set('keychain:dialog', String(rest[0]))
    if (tool === '/usr/bin/security') return (keychain.push(String(e.init?.stdin ?? '')), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
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
    if (release && tool === 'sh' && String(rest[1]).includes('write-tree')) return ok(`${files.get('tree:installed') ?? release.tree}\n`)
    if (release && tool === 'env' && rest.includes('git')) {
      const args = rest.slice(rest.indexOf('-C') + 2).map(String)
      gitRan.push(args.join(' '))
      const at = (arg?: string) => (arg ?? '').replace(/\^\{commit\}$/, '')
      if (args[0] === 'rev-parse' && args.includes('--show-toplevel')) return ok('/plugins-src\n')
      if (args[0] === 'ls-files') return ok('mods/claudopus/.claude-plugin/plugin.json\n')
      if (args[0] === 'rev-parse' && args.includes('--git-dir')) return ok(release.worktree ? '/plugins-src/.git/worktrees/fix\n/plugins-src/.git\n' : '/plugins-src/.git\n/plugins-src/.git\n')
      if (args[0] === 'symbolic-ref') return release.noBranch ? ok('', 1) : ok(release.worktree ? 'fix-bar\n' : 'main\n')
      if (args.includes('--symbolic-full-name')) return ok('origin/main\n')
      if (args[0] === 'rev-parse' && args.includes('--verify')) {
        const what = args.at(-1) ?? ''
        if (what.startsWith('refs/claudopus/update')) return files.has('git:ref') ? ok(`${files.get('git:ref')}\n`) : ok('', 1)
        if (what.includes(':')) return what.startsWith(`${release.commit}:`) && files.has('git:ref') ? ok(`${release.got ?? release.tree}\n`) : ok('', 1)
        return ok(`${at(what)}\n`)
      }
      if (args[0] === 'show') return ok(JSON.stringify({ name: 'claudopus', version: release.manifest ?? release.version }))
      if (args[0] === 'update-ref' && args[1] === '-d') return (files.delete('git:ref'), ok())
      if (args[0] === 'merge-base') return ok('', release.ownCommits ? 1 : 0)
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
        ? `${MEMORY}/words/local_1.md:2:the nose is flawed\n`
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

  return { files, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, resumed, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keep, settle, keychain, admins, wake, gitRan, backgrounds, agentModels, asked, types, registered, kindTools }
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

// The chat: its role, handing work over, keys and pastes, names, the mod's tools, compaction, after a reply, the principles

test('a chat gets its role once, is told to start a fresh agent from a brief for every message, and every message is saved', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  const first = await $.prompt.submit({ text: 'fix the upload page', wait: false, origin: composer })
  expect(first.context?.join('\n')).toContain('CHAT ROLE')
  expect(first.context?.join('\n')).toContain('Topics so far')
  expect(first.context?.join('\n')).toContain(`This chat's saved words: ${MEMORY}/words/engine-id.md`)
  expect(first.context?.join('\n')).toContain('start a fresh agent')
  expect(first.context?.join('\n')).toContain('Only a message that changes what a listed task is already doing')
  expect(first.context?.join('\n')).toContain('A fault, a question or a new request gets its own agent')

  // One sent while the chat is mid-turn is its own piece of work too
  const second = await $.prompt.submit({ text: 'and the nose', wait: false, origin: composer, turnId: 'turn-1' })
  expect(second.context?.length).toBe(1)
  expect(second.context?.[0]).toContain('start a fresh agent')

  const words = files.get(`${MEMORY}/words/engine-id.md`) ?? ''
  expect(words).toContain('fix the upload page')
  expect(words).toContain('and the nose')

  // Words of a long chat, over the 4 MB the engine gives whole, are added to, never written again as only the newest
  const long = `## 2026-11-12T07:00:00.000Z\nthe first message\n\n${'x'.repeat(4_300_000)}\n\n`
  files.set(`${MEMORY}/words/engine-id.md`, long)
  await $.prompt.submit({ text: 'and the chin', wait: false, origin: composer })
  const kept = files.get(`${MEMORY}/words/engine-id.md`) ?? ''
  expect(kept.startsWith(long)).toBe(true)
  expect(kept.slice(long.length)).toContain('and the chin')
})

test('work starts as a fresh agent from written instructions, never as a copy of the chat: a clearly stated job on Sonnet, the rest as a task, a fork or an agent with no model refused whatever an old config.json chose, and a brief gets the rules for the work', async ($, on) => {
  const { files } = world(on, { tokens: 400_000, chatRole: 'CHAT ROLE {lanes}' })
  // A choice of 0.2.152's that sent small jobs to a copy of the chat counts for nothing now
  ownSet(files, 'config.json', JSON.stringify({ lean: { small: 'copy', quick: 'work' } }))
  await $.session.start(start)
  const told = (await $.prompt.submit({ text: 'push it', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('`subagent_type: "claudopus:quick"` and `model: "sonnet"`')
  expect(told).toContain('`subagent_type: "claudopus:task"`')
  expect(told).toContain('Never start a copy of this chat')
  expect(told).not.toContain('start a copy of this chat, the Agent tool')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a1', prompt: 'push it', subagent_type: 'fork' } as never)).deny).toContain('never starts a task as a copy')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a2', prompt: 'fix the nose', subagent_type: 'general-purpose' } as never)).deny).toContain('the model named')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a3', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused an Agent call that copies the chat')

  // The brief reaches the work with the rules for every piece of work and the path of the chat's saved words after it
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]?.startsWith('BRIEF')).toBe(true)
  expect(prompts[0]).toContain('WORK ROLE')
  expect(prompts[0]).toContain(`${MEMORY}/words/engine-id.md`)
})

test('no agent is started on an older model or on Haiku, by the chat or by a piece of work: one named so starts on its family\'s newest; the aliases and their newest versions pass as named', async ($, on) => {
  const { files, agentModels } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  const call = async (model: string, agentId?: string) => {
    const r = await $.tool.call({ tool: 'Agent', tool_use_id: `m-${model}-${agentId ?? ''}`, prompt: 'fix the nose', subagent_type: 'general-purpose', model, ...(agentId ? { agentId } : {}) } as never)
    return { deny: (r as { deny?: string }).deny, model: agentModels.at(-1) }
  }

  // A newer version than the mod knows is no older model; nor is an id with a date, a window or a provider around it
  for (const model of ['opus', 'sonnet', 'fable', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-opus-5.5', 'claude-opus-5-6', 'claude-opus-6', 'claude-fable-5-3', 'claude-sonnet-6', 'claude-opus-5-5-20261001', 'opus[1m]', 'us.anthropic.claude-opus-5-5-v1:0', 'inherit']) expect(await call(model)).toEqual({ deny: undefined, model })
  // An older version, a full id or not, starts on its family's newest by its alias, and Haiku on Sonnet
  for (const [model, alias] of [['haiku', 'sonnet'], ['claude-haiku-5-5', 'sonnet'], ['claude-opus-4-8', 'opus'], ['claude-opus-5', 'opus'], ['claude-sonnet-5', 'sonnet'], ['claude-fable-5-1', 'fable'], ['claude-3-5-sonnet-20241022', 'sonnet'], ['claude-sonnet-4-5-20250929', 'sonnet'], ['claude-opus-4-8[1m]', 'opus']]) expect(await call(model!)).toEqual({ deny: undefined, model: alias })
  // A helper a piece of work starts is held to the same, and one that names no model keeps its work's
  expect(await call('haiku', 'a1')).toEqual({ deny: undefined, model: 'sonnet' })
  expect(await call('claude-opus-4-8', 'a1')).toEqual({ deny: undefined, model: 'opus' })
  expect(await call('sonnet', 'a1')).toEqual({ deny: undefined, model: 'sonnet' })
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'h0', prompt: 'look it up', subagent_type: 'general-purpose', agentId: 'a1' } as never)).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('an Agent call on Opus 4.8 starts on Opus 5.5')
})

test('every start is held to a current model: an older id, a parent on an older model, a checker weaker than its builder, a workflow agent and a copy', async ($, on) => {
  const { asked, files } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  const go = (e: Record<string, unknown>) => $.agent.spawn({ ...spawn, prompt: 'p', parentModel: 'claude-opus-5-5', ...e } as never) as Promise<{ deny?: string; agentId?: string }>
  // Named older, by a full id the Agent tool's own check never saw (a workflow script's, a hook's): its family's newest
  await go({ model: 'claude-opus-4-8', parentAgentId: 'a0' })
  expect(asked.at(-1)).toBe('claude-opus-5-5')
  await go({ model: 'claude-haiku-4-5', parentAgentId: 'a0' })
  expect(asked.at(-1)).toBe('claude-sonnet-5-5')
  // No model, under a parent the app moved to an older model: not left to inherit it
  await go({ parentModel: 'claude-opus-4-8', parentAgentId: 'a0', description: 'Search the docs' })
  expect(asked.at(-1)).toBe('claude-opus-5-5')
  await go({ model: 'inherit', parentModel: 'claude-sonnet-5', parentAgentId: 'a0', description: 'Search the docs' })
  expect(asked.at(-1)).toBe('claude-sonnet-5-5')
  // No model under a current parent is left to the engine: the kind's own model, then the parent's
  await go({ parentAgentId: 'a0', description: 'Search the docs' })
  expect(asked.at(-1)).toBeUndefined()
  // A check of what was built never runs weaker than what built it, nor below Opus
  await go({ model: 'sonnet', parentAgentId: 'a0', description: 'Second look at the CT scans page' })
  expect(asked.at(-1)).toBe('claude-opus-5-5')
  await go({ model: 'opus', parentModel: 'claude-fable-5-2', parentAgentId: 'a0', description: 'Check the page for faults' })
  expect(asked.at(-1)).toBe('claude-fable-5-2')
  await go({ parentModel: 'claude-sonnet-5-5', parentAgentId: 'a0', description: 'Review what was built' })
  expect(asked.at(-1)).toBe('claude-opus-5-5')
  await go({ model: 'fable', parentAgentId: 'a0', description: 'Second look at the page' })
  expect(asked.at(-1)).toBe('fable')
  // A workflow script's agent is held to the same
  await go({ model: 'claude-sonnet-4-5', workflow: { runId: 'wf_1', agentIndex: 1 }, description: 'Index the photos' })
  expect(asked.at(-1)).toBe('claude-sonnet-5-5')
  await go({ model: 'sonnet', workflow: { runId: 'wf_1', agentIndex: 2 }, description: 'Verify the fix' })
  expect(asked.at(-1)).toBe('claude-opus-5-5')
  // A copy of an agent on an older model cannot be moved, so it is refused with why
  expect((await go({ fork: true, parentModel: 'claude-opus-4-8', parentAgentId: 'a0' })).deny).toContain("Claudopus doesn't run tasks on Opus 4.8. Start a fresh agent")
  expect((await go({ fork: true, parentAgentId: 'a0' })).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('a workflow agent asked to run on Sonnet 4.5 starts on Sonnet 5.5')
})

test("the mod's own kinds start the cheapest measured way: a reader and a quick task on the legwork model, a check never weaker than its parent and at least Opus, each with only its own tools, whatever an old config.json chose", async ($, on) => {
  const { asked, types, files, registered, kindTools } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  // The kinds are the engine's own from the session's start
  expect(await until(async () => (registered.length >= 5 ? [...registered].sort() : undefined))).toEqual(['check', 'helper', 'quick', 'reader', 'task'])
  // Each kind told to call wake_me rather than wait has it (16 Nov: a task had none, and had the chat start it again by hand)
  expect(Object.keys(kindTools).filter(kind => kindTools[kind]?.includes('mcp__claudopus__wake_me')).sort()).toEqual(['helper', 'quick', 'task'])
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  const go = async (subagentType: string, e: Record<string, unknown> = {}) => {
    await $.agent.spawn({ ...spawn, subagentType, prompt: 'p', description: 'The nose', parentModel: 'claude-opus-5-5', parentAgentId: 'a0', ...e } as never)
    return [asked.at(-1), types.at(-1)]
  }
  const shipped: [string, Record<string, unknown>, (string | undefined)[]][] = [
    ['claudopus:reader', {}, ['sonnet', 'claudopus:reader']],
    ['claudopus:reader', { model: 'opus' }, ['sonnet', 'claudopus:reader']],
    ['claudopus:check', { model: 'sonnet', parentModel: 'claude-sonnet-5-5' }, ['claude-opus-5-5', 'claudopus:check']],
    ['claudopus:check', { model: 'opus', parentModel: 'claude-fable-5-2' }, ['claude-fable-5-2', 'claudopus:check']],
    ['claudopus:check', { model: 'fable' }, ['fable', 'claudopus:check']],
    ['claudopus:quick', {}, ['sonnet', 'claudopus:quick']],
    ['claudopus:quick', { model: 'inherit', parentModel: 'claude-fable-5-2' }, ['sonnet', 'claudopus:quick']],
    ['claudopus:quick', { model: 'opus' }, ['sonnet', 'claudopus:quick']],
    // a title that reads like a check (16 Nov second look: "Push and check the build" went to the parent's Fable)
    ['claudopus:quick', { model: 'fable', description: 'Push and check the build', parentModel: 'claude-fable-5-2', parentAgentId: undefined }, ['sonnet', 'claudopus:quick']],
    ['claudopus:quick', { model: 'sonnet' }, ['sonnet', 'claudopus:quick']],
    ['claudopus:task', { model: 'opus' }, ['opus', 'claudopus:task']],
  ]
  for (const [type, e, want] of shipped) expect([type, e, await go(type, e)]).toEqual([type, e, want])
  // 0.2.152's choices of a reader on its parent's model, a check always on Fable and every kind with everything count for nothing now
  ownSet(files, 'config.json', JSON.stringify({ lean: { readers: 'own', checker: 'strongest', start: 'all', quick: 'work' } }))
  await $.session.start(start)
  const old: [string, Record<string, unknown>, (string | undefined)[]][] = [
    ['claudopus:reader', {}, ['sonnet', 'claudopus:reader']],
    ['claudopus:check', { model: 'sonnet' }, ['claude-opus-5-5', 'claudopus:check']],
    ['claudopus:quick', {}, ['sonnet', 'claudopus:quick']],
    ['claudopus:task', { model: 'opus' }, ['opus', 'claudopus:task']],
    ['claudopus:helper', { model: 'opus' }, ['opus', 'claudopus:helper']],
    ['general-purpose', { model: 'sonnet' }, ['sonnet', 'general-purpose']],
    ['Explore', {}, [undefined, 'Explore']],
  ]
  for (const [type, e, want] of old) expect([type, e, await go(type, e)]).toEqual([type, e, want])
  // A quick task a task starts as a check is held to the check rule; with Fable for every task a clear job runs on Fable
  expect(await go('claudopus:quick', { description: 'Review the fix', parentModel: 'claude-fable-5-2' })).toEqual(['claude-fable-5-2', 'claudopus:quick'])
  ownSet(files, 'config.json', JSON.stringify({ lean: { fable: 'all' } }))
  await $.session.start(start)
  expect(await go('claudopus:quick', { model: 'sonnet', parentAgentId: undefined })).toEqual(['fable', 'claudopus:quick'])
})

test('what counts as current follows the newest model the engine offers, never a version written into the mod', async ($, on) => {
  const { asked, agentModels } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  // The engine starts work on a newer Opus by its alias: from then on Opus 5.5 is an older model, and the card's choice offers the newer one
  await $.agent.spawn({ ...spawn, prompt: 'p', model: 'opus', parentModel: 'claude-opus-6' } as never)
  for await (const _ of $.turn.step({ turnId: 't', index: 0, model: 'claude-opus-6', messageCount: 2, agentId: 'a1' })) void _
  await $.agent.spawn({ ...spawn, prompt: 'p', model: 'claude-opus-5-5', parentModel: 'claude-opus-6', parentAgentId: 'a1' } as never)
  expect(asked.at(-1)).toBe('claude-opus-6')
  await $.tool.call({ tool: 'Agent', tool_use_id: 'n1', prompt: 'p', subagent_type: 'general-purpose', model: 'claude-opus-5-5', agentId: 'a1' } as never)
  expect(agentModels.at(-1)).toBe('opus')
})

test('with Haiku named in the settings for a kind of work, an agent on Haiku is let through; an older model still is not', async ($, on) => {
  const { files, agentModels } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ models: { legwork: 'haiku' } }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'c1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' } as never)).deny).toBeUndefined()
  expect(agentModels.at(-1)).toBe('haiku')
  await $.tool.call({ tool: 'Agent', tool_use_id: 'c2', prompt: 'index', subagent_type: 'general-purpose', model: 'claude-opus-4-8' } as never)
  expect(agentModels.at(-1)).toBe('opus')
})

test('with the handing-over switched off the mod refuses no model and moves no step', async ($, on) => {
  const { files, stepped } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ agents: false }))
  await $.session.start(start)
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'o1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' } as never)).deny).toBeUndefined()
  for await (const _ of $.turn.step({ turnId: 't', index: 0, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-opus-4-8'])
})

test("the work's rules name where the admin runner is, the one way work uses a Mac's password", async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clear the disk', wait: false, origin: composer })

  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/an admin command runs through `\/\S*mods\/claudopus\/bin\/admin`/)
  expect(prompts[0]).not.toContain('{admin}')
})

test('work uses a kept key without reading it: the keychain is not read, and what a tool answers comes back with the key hidden', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/\/\S*mods\/claudopus\/bin\/secret NAME/)
  expect(prompts[0]).not.toContain('{secret}')

  const read = await $.tool.call({ tool: 'Bash', tool_use_id: 'k1', command: 'security find-generic-password -s claudopus-secret -a API_KEY -w', agentId: 'w1' } as never)
  expect(read.deny).toContain('never read or printed')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k2', command: 'security dump-keychain -d', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k5', command: 'security find-generic-password -wa API_KEY', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k6', command: 'CLAUDOPUS_SECRET_SERVICE=other bin/secret API_KEY here "env"', agentId: 'w1' } as never)).deny).toContain('never read')
  // A command that only lists what the keychain holds, with no value, runs
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k7', command: 'security find-generic-password -s claudopus-secret -a API_KEY', agentId: 'w1' } as never)).deny).toBeUndefined()
  // bin/keyring and its store on Linux, by any tool: the runner named, its verb quoted, its folder reached through a cd, read,
  // searched or written; git alone may name it in a message
  for (const command of ['mods/claudopus/bin/keyring get claudopus-admin here', '"$HOME/x/bin/keyring" "get" claudopus-secret API_KEY', 'cd ~/.local/share/claudopus && cat keyring/claudopus-admin/here', 'keyring set claudopus-admin-gate seal'])
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `kr-${command.length}`, command, agentId: 'w1' } as never)).deny).toContain('never read')
  for (const [tool, field] of [['Read', 'file_path'], ['Write', 'file_path'], ['Grep', 'path'], ['Glob', 'path']] as const)
    expect((await $.tool.call({ tool, tool_use_id: `kf-${tool}`, [field]: '~/.local/share/claudopus/keyring/claudopus-admin/here', ...(tool === 'Write' ? { content: 'x' } : { pattern: '.' }), agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'kg', command: 'git commit -m "keyring for Linux"', agentId: 'w1' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'kd', command: 'git diff --no-index /dev/null ~/.local/share/claudopus/keyring/claudopus-admin/here', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Grep', tool_use_id: 'ku', path: '~/.local/share', pattern: '.', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Grep', tool_use_id: 'kb', path: '~/GitHub', pattern: '.', glob: 'keyring/**', agentId: 'w1' } as never)).deny).toContain('never read')

  // Nothing kept: what the tool answers passes as it was
  expect(JSON.stringify((await $.tool.call({ tool: 'Bash', tool_use_id: 'k3', command: 'echo $API_KEY', agentId: 'w1' } as never)).result)).toContain('token is none')
  files.set('keychain:API_KEY', 'sk-live-123456')
  const shown = await $.tool.call({ tool: 'Bash', tool_use_id: 'k4', command: 'bin/secret API_KEY here "echo $API_KEY"', agentId: 'w1' } as never)
  expect(JSON.stringify(shown.result)).toContain('token is [hidden API_KEY]')
  expect(JSON.stringify(shown.result)).not.toContain('sk-live-123456')
  // What the chat reads in its own thread comes back with the key hidden too
  const read2 = await $.tool.call({ tool: 'Read', tool_use_id: 'k8', file_path: '/repo/.env' } as never)
  expect(read2.deny).toBeUndefined()
  expect(JSON.stringify(read2.result)).toContain('API_KEY=[hidden API_KEY]')
  expect(JSON.stringify(read2.result)).not.toContain('sk-live-123456')
})

test('work never writes into the boxes folder or reads the boxes\' keychain service, by any common way, while the admin and secret runners still run', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  const bin = /(\/\S*mods\/claudopus\/bin)\/secret NAME/.exec(prompts[0] ?? '')?.[1] ?? ''
  expect(bin).not.toBe('')
  let n = 0
  const call = async (input: Record<string, unknown>, agentId = 'w1') => (await $.tool.call({ tool: 'Bash', tool_use_id: `b${n++}`, agentId, ...input } as never)).deny
  const refused = async (command: string, agentId?: string) => expect([command, await call({ command }, agentId)]).toEqual([command, expect.stringContaining('Only the password and key runners use their boxes')])
  const runs = async (command: string) => expect([command, await call({ command })]).toEqual([command, undefined])
  // A direct command and redirections, in every spelling of the folder
  await refused(`echo '{"id":"x","kind":"admin","host":"here"}' > ~/.claude/claudopus/boxes/x.json`)
  await refused('cat req.json >> "$HOME/.claude/claudopus/boxes/$(uuidgen).json"')
  await refused('cp req.json ${HOME}/.claude//claudopus/./boxes/')
  await refused('tee /home/sam/.claude/claudopus/../claudopus/boxes/a.json < req.json')
  await refused('cp req.json ~/.cl*/claudo*/box?s/')
  await refused(`cp req.json ~/.claude/"claud"'opus'/bo\\xes/`)
  await refused('cd ~/.claude && cd claudopus && cp /tmp/req.json boxes/a.json')
  await refused('cp req.json "$CLAUDE_CONFIG_DIR/claudopus/boxes/"')
  // Pointing the runners at a folder of one's own
  await refused(`CLAUDOPUS_BOXES=/tmp/mine ${bin}/secret API_KEY here 'true'`)
  // Reading the service, with or without the value
  await refused('security find-generic-password -s claudopus-box -a 0f1e2d3c-4b5a-4987-a654-3210fedcba98')
  await refused("/usr/bin/security find-generic-password -s 'claudopus-box' -a x -w")
  await refused('security find-generic-password -s claudopus-b* -a x')
  // Another language's program handed the code inline: a helper's call
  await refused(`python3 -c "import subprocess; subprocess.run(['security','find-generic-password','-s','claudopus-box','-a','x'])"`)
  await refused(`node -e "require('fs').writeFileSync(require('os').homedir() + '/.claude/claudopus/boxes/a.json', '{}')"`)
  // A script that does it, run every usual way, and a planted copy named like a runner
  files.set('/repo/plant.sh', 'cat > ~/.claude/claudopus/boxes/a.json <<EOF\n{"kind":"admin","host":"here"}\nEOF\n')
  files.set('/tmp/peek.py', "import subprocess\nsubprocess.run(['/usr/bin/security', 'find-generic-password', '-s', 'claudopus-box', '-a', 'x', '-w'])\n")
  files.set('/tmp/bin/secret', '#!/bin/bash\nmkdir -p "$HOME/.claude/claudopus/boxes"\n')
  await refused('bash plant.sh')
  await refused('./plant.sh')
  await refused('cd /tmp && sh /repo/plant.sh')
  await refused('env FOO=1 python3 /tmp/peek.py')
  await refused('source /repo/plant.sh')
  await refused("/tmp/bin/secret API_KEY here 'true'")
  files.set('/work/tree/p.sh', 'cp /tmp/req.json ~/.claude/claudopus/boxes/\n')
  await refused('cd /work/tree && ./p.sh')
  await refused('cd ~/.claude && cp req.json claudopus/boxes/')
  await refused('cd ~/.claude; cp req.json ./claudopus/boxes/a.json')
  await refused(`zsh -c 'cd /work/tree && ./p.sh'`)
  await refused('sudo -u sam /work/tree/p.sh')
  await refused('cat plant.sh | bash')
  await refused('bash < /repo/plant.sh')
  await refused('timeout 5 ./plant.sh')
  await refused('nice -n 5 bash plant.sh')
  files.set('/repo/plant.ts', "Bun.write(`${process.env.HOME}/.claude/claudopus/boxes/a.json`, '{}')\n")
  await refused('bun run plant.ts')
  // Capitals, which this Mac's files take as the same, brace expansion, and another language's keychain library
  await refused('cp req.json ~/.Claude/Claudopus/Boxes/')
  await refused('cp req.json ~/.claude/claudopus/box{e,}s/')
  files.set('/repo/peek.swift', 'import Security\nlet q = [kSecAttrService: "claudopus-box", kSecReturnData: true] as CFDictionary\n')
  await refused('swift peek.swift')
  await refused(`python3 -c "import keyring; print(keyring.get_password('claudopus-box', 'x'))"`)
  // A helper work starts is held to it as the work is
  await refused('bash /repo/plant.sh', 'helper-1')
  // A file written or edited into the folder
  for (const [tool, path] of [['Write', '/home/sam/.claude/claudopus/boxes/a.json'], ['Edit', '~/.claude/claudopus/boxes/b.json'], ['Write', '/home/sam/.claude/claudopus/./boxes'], ['Write', '/home/sam/.Claude/claudopus/Boxes/a.json'], ['Write', '/home/sam/.claude/plugins/cache/claudopus/claudopus/9.9.9/bin/secret']] as const)
    expect([tool, path, (await $.tool.call({ tool, tool_use_id: `b${n++}`, agentId: 'w1', file_path: path, content: '{}', old_string: 'a', new_string: 'b' } as never)).deny]).toEqual([tool, path, expect.stringContaining('Only the password and key runners use their boxes')])
  // The runners themselves, and what only looks near the folder or the service, still run
  files.set('keychain:API_KEY', 'sk-live-123456')
  await runs(`${bin}/secret API_KEY here 'curl -H "Authorization: Bearer $API_KEY" https://api.example.com'`)
  // The admin runner past its own gate, here set never to ask as Config seals it (gate.test.tsx holds the asking)
  files.set('keychain:gate', 'kept-key')
  ownSet(files, 'config.json', JSON.stringify({ admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }))
  await runs(`${bin}/admin here 'whoami'`)
  await runs(`bash ${bin}/secret API_KEY here 'true'`)
  await runs('cat src/claudopus/boxes.tsx && rg -n boxes src/claudopus')
  await runs('ls ~/.claude/claudopus/*')
  // Looks that only read, a commit message naming the folder, and work in a worktree kept under a .claude folder of the repo
  await runs('ls ~/.claude/claudopus/boxes && rg -n boxes ~/.claude/claudopus/rules')
  await runs('git commit -qm "Refuse writes into ~/.claude/claudopus/boxes" && gh pr create --body "claudopus-box via security"')
  await runs("rg -n 'security|claudopus-box' mods/claudopus")
  await runs('cd /code/claudopus/.claude/worktrees/agent-1 && rg -n boxes src && cat src/claudopus/boxes.tsx')
  await runs(`${bin}/secret --list`)
  await runs('security find-generic-password -s claudopus-secret -a API_KEY')
  files.set('/repo/build.sh', 'node src/claudopus/build.mjs\n')
  await runs('bash build.sh')
  expect((await $.tool.call({ tool: 'Write', tool_use_id: `b${n++}`, agentId: 'w1', file_path: '/home/sam/.claude/claudopus/streams/x.md', content: 'boxes' } as never)).deny).toBeUndefined()
})

test('work reaches main only through the release runner: its rules name it, and a push or merge to main by hand is refused', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'ship it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/main is reached through `\/\S*mods\/claudopus\/bin\/release`/)
  expect(prompts[0]).not.toContain('{release}')

  const refused = [
    'git push origin main',
    'cd /repo && git push -q origin HEAD:main',
    'git -C /repo push origin +main',
    'git push origin work:refs/heads/master',
    'git push --force origin main; echo done',
    'gh pr merge 12 --squash',
    'git push origin "main"',
    "git push -u origin HEAD:'main'",
    'git push --no-verify origin work/one',
    'RELEASE_PUSH=1 git push origin HEAD',
    'gh api -X PUT repos/me/it/pulls/3/merge',
    'echo hi && git -c user.name=x push origin main',
    'sudo git push origin main',
    'env FOO=1 git push origin main',
    "bash -c 'git push origin main'",
    'git push --repo=origin main',
  ]
  for (const [i, command] of refused.entries()) {
    const r = await $.tool.call({ tool: 'Bash', tool_use_id: `p${i}`, command, agentId: 'w1' } as never)
    expect(r.deny).toContain('never pushes or merges to main itself')
    expect(r.deny).toMatch(/bin\/release\.$/)
  }
  const allowed = ['git push origin work/one', 'git push -u origin main-menu-fix', 'git pull origin main', 'git merge origin/main', 'git log origin/main', 'git checkout main', 'git commit -qam "git push of main across Macs, merges onto main"', 'echo "never git push origin main"', 'git push', 'grep -n RELEASE_PUSH= bin/release']
  for (const [i, command] of allowed.entries()) {
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `a${i}`, command, agentId: 'w1' } as never)).deny).toBeUndefined()
  }
})

test('a large paste is saved to a file and left out of the chat', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  const paste = `start ${'x'.repeat(20_000)} end`

  const r = await $.prompt.submit({ text: paste, wait: false, origin: composer })
  expect(r.text?.length ?? 0).toBeLessThan(2000)
  expect(r.text).toContain('were saved to')
  const saved = [...files.entries()].find(([path]) => path.startsWith(`${MEMORY}/pastes/`))
  expect(saved?.[1]).toBe(paste)
  // and the chat does not read it back in: the agent that needs it reads it
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'p1', file_path: saved?.[0] } as never)).deny).toContain('Start a fresh agent')
  expect((await $.tool.call({ tool: 'Grep', tool_use_id: 'p2', pattern: 'end', path: `${MEMORY}/pastes` } as never)).deny).toContain('Start a fresh agent')
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'p3', file_path: saved?.[0], agentId: 'w1' } as never)).deny).toBeUndefined()
})

test("a chat's own thread may only read, run a single command in the background, start agents and talk to them; an agent may do the work", async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  const told = await $.prompt.submit({ text: 'what does this function do', wait: false, origin: composer })
  expect(told.context?.join('\n')).toContain('Answer a question that a few reads settle here')
  expect(told.context?.join('\n')).toContain('For anything that changes a file, runs a command or takes more than a few reads')

  // A single command it runs itself, always in the background; reading a file, more than one command, or a runner is not that
  files.set('git:branch', 'fix-nose')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'git push' } as never)).deny).toBeUndefined()
  files.delete('git:branch')
  expect(files.get(`${MEMORY}/log.md`)).toContain("the chat's own command started in the background (bg-t1)")
  // As it ends, its notice carries how it ended and its last three lines, read from its output file
  files.set('/tmp/tasks/bg-t1.output', 'Enumerating objects: 5\nWriting objects: 100%\nTo github.com:sam/nose.git\n   1a2b3c..4d5e6f  main -> main\n')
  const notice = (id: string, status: string, summary: string) => `<task-notification>\n<task-id>${id}</task-id>\n<output-file>/tmp/tasks/${id}.output</output-file>\n<status>${status}</status>\n<summary>${summary}</summary>\n</task-notification>`
  const ended = (await $.prompt.submit({ text: notice('bg-t1', 'completed', 'Background command "git push" completed (exit code 0)'), wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[]; drop?: string }
  const endedText = ended.context?.join('\n') ?? ''
  expect(endedText).toContain('Writing objects: 100%\nTo github.com:sam/nose.git\n   1a2b3c..4d5e6f  main -> main')
  expect(endedText).not.toContain('Enumerating objects')
  expect(endedText).toContain('ended (Background command "git push" completed (exit code 0))')
  // A kept key in those lines is hidden, as in any tool's answer
  files.set('keychain:API_KEY', 'sk-live-123456')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1k', command: 'git status' } as never)).deny).toBeUndefined()
  files.set('/tmp/tasks/bg-t1k.output', 'On branch main\ntoken sk-live-123456\n')
  const keyed = ((await $.prompt.submit({ text: notice('bg-t1k', 'completed', 'Background command "git status" completed (exit code 0)'), wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(keyed).toContain('token [hidden API_KEY]')
  expect(keyed).not.toContain('sk-live-123456')
  // The engine's notice that a task whose report already came has stopped is left out; one that also says something else is not
  const REPEAT = 'Agent "Fix the nose" completed. Its report was already delivered to you as a message, so it is not repeated here.'
  const repeat = (await $.prompt.submit({ text: notice('a9', 'completed', REPEAT), wait: false, origin: { kind: 'task-notification' } } as never)) as { drop?: string }
  expect(repeat.drop).toContain('Left out a repeat notice')
  const two = (await $.prompt.submit({ text: `${notice('a9', 'completed', REPEAT)}\n${notice('a8', 'completed', REPEAT)}`, wait: false, origin: { kind: 'task-notification' } } as never)) as { drop?: string }
  expect(two.drop).toContain('Left out a repeat notice')
  for (const text of [`${notice('a9', 'completed', REPEAT)}\n${notice('a8', 'failed', 'Agent "Fix the ear" failed: it is not repeated here')}`, `${notice('a9', 'completed', REPEAT)}\nThe build on main is red.`, notice('a7', 'completed', 'Agent "Fix the ear" completed')]) {
    const kept = (await $.prompt.submit({ text, wait: false, origin: { kind: 'task-notification' } } as never)) as { drop?: string; text?: string }
    expect([text, kept.drop]).toEqual([text, undefined])
    expect(kept.text).toBe(text)
  }
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1b', command: 'git add -A && git commit -m x' } as never)).deny).toContain('only a single command')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1c', command: 'git log > /tmp/x' } as never)).deny).toContain('only a single command')
  // A command run inside it, even inside double quotes, is more than one command; a shell handed one is a task's
  for (const [i, command] of ['echo "$(git add -A)"', 'git log "`rm -rf x`"', 'git log <(ls)'].entries())
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `t1e${i}`, command } as never)).deny).toContain('only a single command')
  // Only a look or a push: one that changes or reads files, a script, a pull, a branch or remote changed, a paste or a shell is a task's
  for (const [i, command] of ['rm -rf build', 'git pull', 'git checkout .', 'git branch -D old', 'git remote add x y', './deploy.sh', 'cp -r ~/.claude/claudopus/p?stes /tmp/p', 'npm install', 'GIT_DIR=x git status', "bash -c 'git add -A'"].entries())
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `t1f${i}`, command } as never)).deny).toContain('Start a fresh agent')
  // and it names the quick task for a clearly stated job
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1f-q', command: 'git pull' } as never)).deny).toContain('"claudopus:quick" for a clearly stated job')
  // A look, an open of a file or page, and a status check of a local server run; braces and the like inside quotes are as written
  for (const [i, command] of [
    'git status',
    'git log --oneline -5',
    'gh pr checks 12',
    'git branch -a',
    'git remote -v',
    'open -a Vivaldi "/repo/out/before after [1].png"',
    'open /repo/out/shot.png',
    'open http://localhost:3000/pricing',
    'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/pricing',
    'curl -sSI --max-time 5 http://127.0.0.1:8080/',
    'curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000',
    'curl -so /dev/null -m5 localhost:3000/health',
    'curl -sI http://[::1]:3000/',
    'curl -s --url http://localhost:3000/ -o /dev/null',
    'open https://github.com/o/r/blob/main/tools/run.py',
    'open http://localhost:3000/main.js',
    'open -R /repo/run.sh',
    'open -e /repo/notes.txt',
  ].entries())
    expect([command, (await $.tool.call({ tool: 'Bash', tool_use_id: `t1g${i}`, command } as never)).deny]).toEqual([command, undefined])
  // but nothing that runs what it opens, sends data, writes a file or asks another machine
  for (const [i, command] of [
    'open /repo/deploy.command',
    'open -a Terminal /repo/run.sh',
    'open /Applications/Calculator.app',
    'open x-apple.systempreferences:com.apple.preference.security',
    'open --stdout /repo/out.txt /repo/a.png',
    'open -a Vivaldi "$HOME/x.png"',
    'curl -s -o /repo/page.html http://localhost:3000/',
    'curl -O http://localhost:3000/a.js',
    'curl -X POST http://localhost:3000/api/reset',
    'curl -d x=1 http://localhost:3000/api',
    'curl -s -w "%output{/repo/x}%{http_code}" http://localhost:3000/',
    'curl -K /repo/curlrc http://localhost:3000/',
    'curl -s https://example.com/',
    'curl -s http://localhost@example.com/',
    'curl -sL http://localhost:3000/go',
    'curl -s -w @/repo/fmt.txt http://localhost:3000/',
    'curl -X GET http://localhost:3000/',
    'curl -H "X-HTTP-Method-Override: DELETE" http://localhost:3000/',
    'curl -T /repo/a http://localhost:3000/',
    'curl -F a=@/repo/a http://localhost:3000/',
    'open /repo/scripts/deploy',
    'open /Applications/Calculator.app/Contents/MacOS/Calculator',
    'open -a /repo/build/Release/Foo.app /repo/x.png',
    'open -a "Python Launcher" /repo/x.txt',
    'open /repo/dist/build.zip',
    'open /repo/Xcode_16.xip',
    'open "file:///repo/deploy%2Ecommand"',
    'open /repo/link.fileloc',
    'open /repo/dev.cer',
  ].entries())
    expect([command, (await $.tool.call({ tool: 'Bash', tool_use_id: `t1o${i}`, command } as never)).deny]).toEqual([command, expect.stringContaining('Start a fresh agent')])
  // A refusal of one of these says the shape the chat can run it in
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1o-shape', command: 'curl -sL http://localhost:3000/go' } as never)).deny).toContain('A `curl` the chat runs itself is a plain GET or HEAD')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1o-shape2', command: 'open /repo/scripts/deploy' } as never)).deny).toContain('An `open` the chat runs itself shows a web page')
  // A .curlrc in the home folder, which may send curl's output into a file, is kept out with -q first
  files.set('/home/sam/.curlrc', 'output = /repo/x')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1rc', command: 'curl -s http://localhost:3000/' } as never)).deny).toContain('-q comes first')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1rc-q', command: 'curl -q -s http://localhost:3000/' } as never)).deny).toBeUndefined()
  files.delete('/home/sam/.curlrc')
  // The browser pane's preview of a local page, its list, its server's log and its tabs the chat calls itself; a preview that starts a
  // server by name or shows another site, a stop, and the pane's clicks and scripts are a task's
  for (const [i, call] of [
    { tool: 'mcp__Claude_Browser__preview_start', url: 'http://localhost:3000' },
    { tool: 'mcp__remote-devices__Claude_Browser__preview_start', url: 'http://127.0.0.1:5173/x' },
    { tool: 'mcp__Claude_Browser__preview_list' },
    { tool: 'mcp__Claude_Browser__preview_logs' },
  ].entries())
    expect([call.tool, (await $.tool.call({ ...call, tool_use_id: `t1p${i}` } as never)).deny]).toEqual([call.tool, undefined])
  for (const [i, call] of [
    { tool: 'mcp__Claude_Browser__preview_start', name: 'dev' },
    { tool: 'mcp__Claude_Browser__preview_start' },
    { tool: 'mcp__Claude_Browser__preview_start', name: 'dev', url: 'http://localhost:3000' },
    { tool: 'mcp__Claude_Browser__preview_start', url: 'https://example.com' },
    { tool: 'mcp__Claude_Browser__preview_stop', name: 'dev' },
    { tool: 'mcp__Claude_Browser__computer' },
    { tool: 'mcp__Claude_Browser__javascript_tool' },
    { tool: 'mcp__Claude_Browser__form_input' },
  ].entries())
    expect([call, (await $.tool.call({ ...call, tool_use_id: `t1q${i}` } as never)).deny]).toEqual([call, expect.stringContaining('Start a fresh agent')])
  expect((await $.tool.call({ tool: 'mcp__Claude_Browser__preview_start', tool_use_id: 't1q-shape', name: 'dev' } as never)).deny).toContain('only with a `url` of a local address')
  // A push only of the branch it is on, never from main and never to it by another spelling, nor anything git is set to run
  files.set('git:branch', 'fix-nose')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1h', command: 'git push -u origin fix-nose' } as never)).deny).toBeUndefined()
  for (const [i, command] of ["git -c core.fsmonitor='touch x' status", 'git -c remote.origin.push=HEAD:main push origin', 'git push origin HEAD:heads/main', 'git push origin HEAD:{main,x}', "git push origin HEAD:$'main'", 'git push origin HEAD:${X:-main}', 'git push --all', 'git push --mirror', 'git push --force', 'git push --delete origin old', 'git fetch origin x:main', 'git push origin main', 'git --config-env=core.pager=X log'].entries())
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `t1i${i}`, command } as never)).deny ?? 'ran').not.toBe('ran')
  files.set('git:branch', 'main')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1j', command: 'git push' } as never)).deny).toContain('Start a fresh agent')
  files.delete('git:branch')
  const refused = await $.tool.call({ tool: 'Bash', tool_use_id: 't1d', command: '/plug/claudopus/bin/release' } as never)
  expect(refused.deny).toContain('Start a fresh agent')
  expect(refused.deny).toContain('changes no file')
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused Bash')

  // It reads for itself: any file, a search, a list of names
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: '/repo/src/nose.ts' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Grep', tool_use_id: 'r2', pattern: 'function nose', path: '/repo' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Glob', tool_use_id: 'r3', pattern: '**/*.ts', path: '/repo' } as never)).deny).toBeUndefined()
  // and still changes nothing and runs nothing
  for (const [i, call] of [
    { tool: 'Edit', file_path: '/repo/src/nose.ts', old_string: 'a', new_string: 'b' },
    { tool: 'Write', file_path: '/repo/src/new.ts', content: 'x' },
    { tool: 'MultiEdit', file_path: '/repo/src/nose.ts', edits: [] },
    { tool: 'NotebookEdit', notebook_path: '/repo/n.ipynb', new_source: 'x' },
    { tool: 'Bash', command: 'cat /repo/src/nose.ts' },
    { tool: 'WebFetch', url: 'https://example.com', prompt: 'p' },
    { tool: 'mcp__other__write_file', path: '/repo/x' },
  ].entries())
    expect((await $.tool.call({ ...call, tool_use_id: `n${i}` } as never)).deny).toContain('Start a fresh agent')

  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 't2', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', tool_use_id: 't3', recap: 'r' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't4', command: 'ls', agentId: 'fork-1' } as never)).deny).toBeUndefined()
  // Work and its helpers are not held to the chat's reading: they read, write and run
  for (const [i, call] of [{ tool: 'Edit', file_path: '/repo/src/nose.ts', old_string: 'a', new_string: 'b' }, { tool: 'Write', file_path: '/repo/x', content: 'x' }, { tool: 'Grep', pattern: 'nose' }, { tool: 'Bash', command: 'npm test' }].entries())
    for (const agentId of ['w1', 'helper-1']) expect((await $.tool.call({ ...call, tool_use_id: `w${i}${agentId}`, agentId } as never)).deny).toBeUndefined()
  // An old config.json's everything-as-a-full-task no longer stops the chat running its own single command
  ownSet(files, 'config.json', JSON.stringify({ lean: { small: 'full' } }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'push it', wait: false, origin: composer })
  files.set('git:branch', 'fix-nose')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't9', command: 'git push' } as never)).deny).toBeUndefined()
  files.delete('git:branch')
})

test('a session the person has not typed into does its own work', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'Run the nightly check.', wait: false, origin: { kind: 'peer' } as never })

  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)).deny).toBeUndefined()
})

test('config.json can switch the handing-over off', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, '{"agents": false}')
  await $.session.start(start)

  const r = await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  expect(r.context ?? []).toEqual([])
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)).deny).toBeUndefined()
})

test('config.json names the person the work is for; without a name the texts say the person', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, '{"name": "Sam"}')
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  expect(prompts[0]).toContain('started from a chat for Sam, the person you work for.')
  expect(prompts[0]).toContain('Sam follows this task in a panel')
  expect(prompts[0]).toContain("Sam's messages word for word")
  expect(prompts[0]).not.toMatch(/the person(?! you work for)/i)
})

test('without a name in config.json the work is told of the person', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  expect(prompts[0]).toContain('started from a chat for the person you work for.')
  expect(prompts[0]).toContain('The person follows this task in a panel')
})

test('the update tool records a subject and rewrites its brief', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't1', name: '3D heads', repo: '/sandbox', summary: 'Fix the nose' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't2', name: '3d heads', state: 'done: pushed', brief: 'Nose fixed.' } as never)

  expect(files.get(`${MEMORY}/index.md`)).toContain('- 3D heads | /sandbox |  | done: pushed | Fix the nose')
  expect(files.get(`${MEMORY}/streams/3d-heads.md`)).toBe('Nose fixed.\n')
})

test('recall returns matching lines without the folder prefix', async ($, on) => {
  world(on)
  await $.session.start(start)

  const r = await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'nose' } as never)
  expect(String(r.result)).toContain('words/local_1.md:2:the nose is flawed')
})

test('rarely used tools wait behind tool search', async ($, on) => {
  world(on)
  const provider = { plugin: 'engine', tier: 'core' } as never

  expect((await $.tool.describe({ tool: 'Workflow', description: 'd', provider })).isDeferred).toBe(true)
  expect((await $.tool.describe({ tool: 'mcp__visualize__show_widget', description: 'd', provider })).isDeferred).toBe(true)
  expect((await $.tool.describe({ tool: 'Read', description: 'd', provider })).isDeferred).toBeUndefined()
})

test('a compaction is told what to keep, and the chat gets its role again after it', async ($, on) => {
  const { compacts } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one', wait: false, origin: composer })

  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'one', toolUses: [] }] as never })
  expect(compacts[0]).toContain('Keep every request')
  expect(compacts[0]).toContain('each background agent')

  const after = await $.prompt.submit({ text: 'two', wait: false, origin: composer })
  expect(after.context?.join('\n')).toContain('CHAT ROLE')
})

test('after a reply the answer is saved, the asks and what was done are logged, and the chat is renamed when its work changed', async ($, on) => {
  const { files, titles, clock } = world(on, { reply: '- fix the upload page\n- also look at the nose\ndid: moved the upload button above the fold\ntitle: Upload page fix' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the upload page, also look at the nose', wait: false, origin: composer })

  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })
  await clock.advance(10)

  const asks = files.get(`${MEMORY}/asks/engine-id.md`) ?? ''
  expect(asks).toContain('- fix the upload page')
  expect(asks).toContain('- also look at the nose')
  expect(asks).toContain('did: moved the upload button above the fold')
  expect(files.get(`${MEMORY}/words/engine-id.md`)).toContain('### Claude ')
  expect(files.get(`${MEMORY}/words/engine-id.md`)).toContain('Done.')
  expect(titles).toEqual(['Upload page fix'])
})

test('every conversation carries the principles the mod ships, word for word and once, even where the same text was loaded from elsewhere', async ($, on) => {
  world(on)
  // The engine beneath answers what it was handed
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  await $.session.start(start)
  const home ={ path: `${HOME}/.claude/CLAUDE.md`, kind: 'user', content: PRINCIPLES } as const
  const repo = { path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' } as const
  const managed = { path: '/etc/claude/CLAUDE.md', kind: 'managed', content: 'ORG RULES' } as const
  const told = await $.prompt.context({ blocks: [{ name: 'claudeMd', text: 'files' }], instructionFiles: [managed, home, repo] })
  expect(told.instructionFiles?.map(one => [one.kind, one.path.endsWith('/rules/CLAUDE.md') ? 'mod' : one.path])).toEqual([['managed', managed.path], ['user', 'mod'], ['project', repo.path]])
  expect(told.instructionFiles?.find(one => one.kind === 'user')?.content).toBe(PRINCIPLES)
  // A machine with no instruction file of its own gets them from the mod alone
  const fresh = await $.prompt.context({ blocks: [], instructionFiles: [] })
  expect(fresh.instructionFiles?.map(one => [one.kind, one.content])).toEqual([['user', PRINCIPLES]])
  expect(told.instructionFiles?.some(one => one.content.includes('device code'))).toBe(false)
})

test('a chat the app runs on another Mac over ssh tells every conversation that what needs the person is done from their own device', async ($, on) => {
  world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  await $.session.start(start)
  const home = { path: `${HOME}/.claude/CLAUDE.md`, kind: 'user', content: PRINCIPLES } as const
  const told = await $.prompt.context({ blocks: [], instructionFiles: [home] })
  // The same principles loaded from elsewhere are still sent once, now ending with the rule for working from afar
  expect(told.instructionFiles?.length).toBe(1)
  const ours = told.instructionFiles?.[0]?.content ?? ''
  expect(ours.startsWith(PRINCIPLES.trimEnd())).toBe(true)
  expect(ours).toContain('## This chat runs on another Mac')
  expect(ours).toContain('a sign-in by device code, or a link that works when I open it on my device. Never a browser, window, dialog or keychain prompt on this Mac')
  expect(ours).not.toContain('{name}')
  // A second copy of the mod that already added them, rule and all, does not make them go out twice
  const twice = await $.prompt.context({ blocks: [], instructionFiles: [{ path: '/other/copy/rules/CLAUDE.md', kind: 'user', content: ours }] })
  expect(twice.instructionFiles?.length).toBe(1)
})

const go2 = ($: Parameters<TestBody>[0], e: Record<string, unknown>) => $.agent.spawn({ ...spawn, prompt: 'p', parentModel: 'claude-sonnet-5-5', ...e } as never) as Promise<{ deny?: string; agentId?: string }>

test('with Haiku named in the settings, an older Haiku asked for by its full id is still not started', async ($, on) => {
  const { files, agentModels, asked } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ models: { legwork: 'haiku' } }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'index', wait: false, origin: composer })
  await $.tool.call({ tool: 'Agent', tool_use_id: 'c1', prompt: 'index', subagent_type: 'general-purpose', model: 'claude-3-5-haiku-20241022' } as never)
  await go2($, { model: 'claude-haiku-4-5', parentAgentId: 'a0' })
  expect(agentModels.at(-1)).not.toBe('claude-3-5-haiku-20241022')
})

test('a checker the chat\'s own thread starts on Sonnet under an Opus chat runs on Opus', async ($, on) => {
  const { asked } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'x', wait: false, origin: composer })
  await $.tool.call({ tool: 'Agent', tool_use_id: 'cc1', prompt: 'look', subagent_type: 'general-purpose', model: 'sonnet', description: 'Second look at the page' } as never)
  await go2($, { tool_use_id: 'cc1', model: 'sonnet', parentModel: 'claude-opus-5-5', description: 'Second look at the page' })
  expect(asked.at(-1)).not.toBe('sonnet')
})

test('a model picked on a card is moved to its family\'s newest once a newer one is seen', async ($, on) => {
  const { stepped } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose on head A.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'model-a1')
  await pressed(pane, 'pick-a1-claude-sonnet-5-5')
  // another agent reports a newer Sonnet
  await $.agent.spawn({ ...spawn, prompt: 'other', description: 'Other' } as never)
  await steps($, 0, 'claude-sonnet-6', 'a2')
  await steps($, 1, 'claude-opus-5-5', 'a1')
  expect(stepped.at(-1)).not.toBe('claude-sonnet-5-5')
})

test('work resumed after a safety flag runs no step on the older model it was moved to', async ($, on) => {
  const { stepped } = world(on, { model: 'claude-opus-5-5', startedOn: { Resumed: 'claude-opus-4-8' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix.' } as never)
  await steps($, 0, 'claude-opus-5-5', 'a1')
  const f = await steps($, 1, 'claude-opus-4-8', 'a1')
  const before = stepped.length
  await $.agent.spawn({ ...spawn, prompt: 'go on', description: 'Resumed', resume: { agentId: 'a1' } } as never)
  const r = await steps($, 0, 'claude-opus-4-8', 'a1')
  expect(stepped.slice(before)).toEqual([])
})

test('a check is known by a checking word and what was built, or a look that is only a check; legwork that names checking something else is not', async ($, on) => {
  const { asked } = world(on, { model: 'claude-opus-5-5' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'x', wait: false, origin: composer })
  const startOn = async (description: string) => {
    await $.agent.spawn({ ...spawn, prompt: 'p', model: 'sonnet', parentModel: 'claude-opus-5-5', parentAgentId: 'a0', description } as never)
    return asked.at(-1)
  }
  for (const d of ['Check my work', 'Review my PR', 'Code review of the change', 'Checker for the branch', 'Re-check against commit 2752ee8', 'Recheck the fixes', 'Sanity check', 'Spot-check results', 'Audit the change', 'What is wrong with the build', 'Look for holes in the fix', 'Second look', 'Reviewer pass on the diff', 'Auditor for the PR', 'Verification of the build', 'Validate the fix', 'QA the page', 'Test the fix in the app', 'Critique the design', 'Find bugs in the change', 'Double-checked results', 'Inspect the output', 'Verified claims', 'Look over the diff', 'Proofread the report', 'Hunt for faults']) expect([d, await startOn(d)]).toEqual([d, 'claude-opus-5-5'])
  for (const d of ['Check the Stripe balance', 'Check the weather API quota', 'Check the repo out', 'Review the docs and summarize', 'Inspect disk usage', 'Validate JSON schema files', 'Verify the domain DNS records', 'Check the PR status', 'Check out the repo', 'Review PR comments and summarize', 'Check Stripe balance', 'Check CI logs', 'Check disk usage on Azure', 'Build a health check endpoint', 'Write a spell checker', 'Audit log export script']) expect([d, await startOn(d)]).toEqual([d, 'sonnet'])
})

test('a resumed helper keeps the model it first started on: an Explore helper resumed still runs on Sonnet, a flagged one is never moved up', async ($, on) => {
  const { stepped } = world(on, { model: 'claude-opus-5-5', startedOn: { Explore: 'claude-haiku-5-5' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix.' } as never)
  const step = async (index: number, model: string, agentId: string) => {
    for await (const _ of $.turn.step({ turnId: 't', index, model, messageCount: 2, agentId })) void _
  }
  const ex = (await $.agent.spawn({ ...spawn, prompt: 'look', description: 'Explore', parentAgentId: 'a1' } as never)) as { agentId: string }
  await $.agent.spawn({ ...spawn, prompt: 'go on', description: 'Explore', resume: { agentId: ex.agentId }, parentAgentId: 'a1' } as never)
  await step(0, 'claude-haiku-5-5', ex.agentId)
  expect(stepped.at(-1)).toBe('claude-sonnet-5-5')
  await step(1, 'claude-opus-4-8', 'a1')
  await $.agent.spawn({ ...spawn, prompt: 'go on', resume: { agentId: 'a1' } } as never)
  const before = stepped.length
  await step(2, 'claude-opus-4-8', 'a1')
  expect(stepped.length).toBe(before)
})
