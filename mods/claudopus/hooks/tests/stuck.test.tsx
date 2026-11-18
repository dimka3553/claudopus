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
const world = (on: On, options: { tailscale?: string; reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; parents?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; fd?: () => string; pid?: () => string; alive?: (pid: string) => boolean; owner?: (pid: string) => 'mine' | 'other' | 'hidden' }; usage?: (script: string) => string; startedOn?: Record<string, string>; release?: Release } = {}) => {
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

// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text

test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', SLOW, async ($, on) => {
  // The engine runs all three, each in its call: they are only flagged, never started again
  const { keep, settle, clock, held, logged, resumed, appended } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'One merger for all pushes', prompt: 'one merger' } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work ONE releasing', prompt: 'one', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work TWO releasing', prompt: 'two', parentAgentId: 'a1', resume: { agentId: 'h2' } } as never)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  const look = async <T,>(fn: (pane: { find: (q: object) => Promise<{ text?: string; props: Record<string, unknown> } | undefined>; findAll: (q: object) => Promise<unknown[]> }) => Promise<T>) => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await fn(pane as never)
    await pane.unmount()
    return r
  }
  const stuck = () => look(pane => pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ }))

  // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
  await bash('a1', 'git log', 'p1')
  await bash('h1', 'git status', 'b1')
  await bash('h2', 'git status', 'b2')
  await clock.advance(11 * 60_000)
  expect(await stuck()).toBeUndefined()
  await clock.advance(2 * 60_000)
  expect((await stuck())?.props.color).toBe('#E5A50A')
  expect((await stuck())?.text).toMatch(/^Nothing new for 1[23]m\.$/)
  expect(logged.filter(line => line.includes(`Nothing new from "One merger for all pushes"`))).toHaveLength(1)
  // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
  expect(appended.filter(line => line.includes(`Nothing new from "One merger for all pushes"`) && line.includes('you may send it a message asking what it waits on'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('you may send it a message'))).toEqual([])
  // Looked at again, nothing more is said
  await clock.advance(60_000)
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(1)

  // Something new comes back: the flag goes at the next look
  void keep(bash('h1', 'hold release', 'b3'))
  const letRelease = await until(async () => held.get('release'))
  letRelease?.('released Thing 0.1.1')
  expect(await stuck()).toBeDefined()
  await clock.advance(25_000)
  expect(await stuck()).toBeUndefined()
  // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
  void keep(bash('h1', 'hold poll', 'b4'))
  const letPoll = await until(async () => held.get('poll'))
  letPoll?.('released Thing 0.1.7')
  await clock.advance(13 * 60_000)
  expect(await stuck()).toBeDefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(2)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toEqual([])
  await settle()
})

test('stuck work the engine no longer runs had stopped partway through: the mod starts it again at once and tells the chat; work whose step ended while all its helpers sit silent is, on a fixed schedule, started again to check on them at 12 minutes and to hand back what it has at 24, and the chat is told plainly at 36; its report then goes through, the silent helpers stopped; helpers at work, rendering in the background or printing a moving frame count, are left alone and their card says so', SLOW, async ($, on) => {
  const all = { a1: 'idle', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running', a7: 'running' }
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = Object.fromEntries(Object.keys(all).map(id => [id, 'general-purpose']))
  // (a5's render prints a line every minute)
  const { keep, settle, clock, held, logged, resumed, stopped, appended, submitted } = world(on, { agents, kinds, parents: { a3: 'a2', a5: 'a4', a7: 'a6' }, jobs: { output: () => 'rendering frames\n', wroteAt: file => (file.endsWith('/bg-r-a5.output') ? clock.now() - 60_000 : 0) } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Fit the video', prompt: 'fit' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a2' } as never)
  await $.agent.spawn({ ...spawn, description: 'Film the town', prompt: 'film' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the town', prompt: 'render', parentAgentId: 'a4' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score the faces', prompt: 'score' } as never)
  await $.agent.spawn({ ...spawn, description: 'Score each frame', prompt: 'frames', parentAgentId: 'a6' } as never)
  Object.assign(agents, all)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  for (const id of ['a1', 'a2', 'a3', 'a4', 'a6']) await bash(id, 'git status', `s-${id}`)
  // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints a new frame count
  await $.tool.call({ tool: 'Bash', tool_use_id: 'r-a5', agentId: 'a5', command: 'hold render', description: 'Render the town (about 2 h)', run_in_background: true } as never)
  // The three tasks end their steps to wait for their helpers
  const ends = async (id: string, turnId: string) => {
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }
  for (const id of ['a2', 'a4', 'a6']) await ends(id, `e-${id}`)
  let frame = 0
  const frames = async (minutes: number) => {
    for (let at = 0; at < minutes; at += 4) {
      void keep(bash('a7', 'hold frame', `f-${(frame += 1)}`))
      // Each call ends as it prints its count, before the clock moves: the last one's hold is taken away, so it is never let go twice
      const letFrame = await until(async () => held.get('frame'))
      held.delete('frame')
      letFrame?.(`frame ${frame * 100}/9000`)
      await clock.advance(4 * 60_000)
    }
  }
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  // Told to the chat's model, not shown: the card says so
  expect(appended.filter(line => line.includes('"Fit the video" stopped partway') && line.includes('started it again'))).toHaveLength(1)
  expect(logged.filter(line => line.includes('stopped partway'))).toEqual([])
  // 12 minutes on: started again to check on its helper, and the chat told so
  const nudges = (id = 'a2') => resumed.filter(line => line.startsWith(`${id}: From Claudopus:`) && line.includes('helpers'))
  expect(nudges()).toHaveLength(1)
  expect(nudges()[0]).toMatch(/^a2: From Claudopus: nothing new has come back from your helpers for 1[2-6] min while your step had ended: "[^"]+" \(a3\)\. Ask each with SendMessage/)
  expect(appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('Claudopus started Claude again and asked it to check on them.'))).toHaveLength(1)
  // Until then it may not hand back while its helper runs
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-early', agentId: 'a2', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toContain("Don't hand back your report yet")
  // It asks its helper, which never answers, and ends its step again: a step and a message start nothing over
  agents.a2 = 'running'
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-a2', agentId: 'a2', to: 'a3', message: 'What are you doing?' } as never)
  await ends('a2', 'e-a2b')
  await bash('a1', 'git status', 's-a1-again')
  await frames(13)
  expect(resumed.filter(line => line.includes('stopped partway through'))).toHaveLength(1)
  // 24 minutes on: started again, once, to hand back what it has; a message from the chat then takes nothing back
  expect(await until(async () => nudges().length === 2 || undefined)).toBe(true)
  expect(nudges()[1]).toContain('hand back your report now with what you have')
  expect(appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('asked it to send what it has now.'))).toHaveLength(1)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-chat', to: 'a2', message: 'Carry on.' } as never)
  agents.a2 = 'completed'
  // 36 minutes on, still not handed back: no third start; the chat is told plainly it is stuck and may write to it, and the card says so
  await frames(13)
  expect(nudges()).toHaveLength(2)
  expect(await until(async () => logged.find(line => line.startsWith('"Draw the lids" is stuck: nothing new from its helpers')))).toBeDefined()
  expect(appended.filter(line => line.includes('"Draw the lids" is stuck') && line.includes('you may send it a message'))).toHaveLength(1)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = (await pane.findAll({ type: 'Text' })).map(one => (one as { text?: string }).text ?? '')
  await pane.unmount()
  expect(texts.filter(text => text.startsWith('Nothing new for') && text.endsWith('and told the chat it may be stuck.'))).toHaveLength(1)
  // Helpers at work are never taken for silent: their tasks are not started again, and its card says it waits on its helpers' work;
  // with nothing new coming back, the chat is told once that its helpers still run something
  expect([nudges('a4'), nudges('a6')]).toEqual([[], []])
  expect(logged.filter(line => line.includes('"Film the town"'))).toEqual([expect.stringMatching(/^Nothing new from "Film the town" for 3\dm, though its helpers are still running something\./)])
  expect(texts.filter(text => text === 'Waiting for its helpers').length).toBeGreaterThanOrEqual(1)
  // Its report goes through while its helpers run: the silent one is stopped with it, those at work never are
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-late', agentId: 'a2', message: 'Lids drawn; rendering never ended.' } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(stopped).toContain('a3')
  expect(stopped.filter(id => id === 'a5' || id === 'a7')).toEqual([])
  // The helper Claudopus stopped tells the chat nothing as it ends, though it ends with words
  await $.turn.complete({ answer: 'Half the lids rendered.', durationMs: 1, isAborted: false, turnId: 'e-a3', reason: 'answer', agentId: 'a3' } as never)
  await clock.advance(2_000)
  expect([...appended, ...submitted].filter(line => line.includes('came after the task'))).toEqual([])
  held.get('render')?.('done')
  await settle()
})

test('the schedule for silent helpers keeps its time: each step comes though the last never reached the task, and a bare call or a message does not start it over; a helper printing something different does, and the leave to hand back already given stays', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const unresumable = new Set(['a1'])
  const { keep, settle, clock, held, logged, resumed, appended } = world(on, { agents, kinds, parents: { a2: 'a1' }, unresumable })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the lids', prompt: 'lids' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: 'e1', reason: 'answer', agentId: 'a1' } as never)
  const said = () => appended.filter(line => line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"'))
  await clock.advance(13 * 60_000)
  expect(said()).toHaveLength(1)
  expect(resumed.filter(line => line.startsWith('a1:'))).toEqual([])
  // A call that says what it said before, and a message from the chat, start nothing over: the order to hand back comes at 24
  await $.tool.call({ tool: 'Bash', tool_use_id: 'n-a2', agentId: 'a2', command: 'git status' } as never)
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'How is it going?' } as never)
  agents.a1 = 'completed'
  await clock.advance(12 * 60_000)
  expect(await until(async () => said().length === 2 || undefined)).toBe(true)
  expect(said()[1]).toContain('asked it to send what it has now')
  // The helper prints something different: the schedule starts over, its check-in 12 minutes on, and the leave stays
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'a2', command: 'hold frame' } as never))
  const letFrame = await until(async () => held.get('frame'))
  letFrame?.('frame 100/9000')
  await clock.advance(11 * 60_000)
  expect(said()).toHaveLength(2)
  await clock.advance(2 * 60_000)
  expect(await until(async () => said().length === 3 || undefined)).toBe(true)
  expect(said()[2]).toContain('asked it to check on them')
  expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Lids drawn.' } as never)) as { deny?: string }).deny).toBeUndefined()
  await settle()
})

test("helpers are not taken for silent while their own record shows calls returning something new that Claudopus did not see, or a command in the background still printing; a record of calls that say the same again, of Claudopus's own tools, of refused calls or of messages to the helper is no news, and the check-ins and the word to the chat still come (17 Nov: a task was started again three times to check on helpers that were mid-step)", SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const { clock, resumed, appended, files } = world(on, { agents, kinds, parents: { a2: 'a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Rebuild the head model', prompt: 'rebuild' } as never)
  await $.agent.spawn({ ...spawn, description: 'Fit the CT scans', prompt: 'ct', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'A helper is fitting; I continue when it reports.', durationMs: 1, isAborted: false, turnId: 'e-a1', reason: 'answer', agentId: 'a1' } as never)
  const nudges = () => resumed.filter(line => line.startsWith('a1: From Claudopus: nothing new has come back from your helpers'))
  // The engine keeps the helper's record: each minute a call of its returns, which Claudopus never saw
  const record = `${HOME}/.claude/projects/-repo/engine-id/subagents/agent-a2.jsonl`
  const rows: string[] = ['{"type":"system"}']
  const write = (row: object) => (rows.push(JSON.stringify({ ...row, timestamp: new (Date as unknown as new (ms: number) => { toISOString: () => string })(clock.now()).toISOString() })), files.set(record, rows.join('\n')), files.set(`mtime:${record}`, String(clock.now())))
  const returned = (text: string) => write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't', content: text }] } })
  const called = (id: string, name: string, text: string) => (write({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input: {} }] } }), write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text }] } }))
  // It parks on a command in the background that follows its run, and the command prints each minute for 20 minutes: no check-in
  const output = '/tmp/claude-1/x/tasks/bfollow.output'
  returned('Command running in background with ID: bfollow. Output is being written to: /tmp/claude-1/x/tasks/bfollow.output. You will be notified when it completes.')
  files.set(output, 'progress: 1/40 heads fitting')
  for (let m = 1; m <= 20; m++) (files.set(`mtime:${output}`, String(clock.now())), await clock.advance(60_000))
  expect(nudges()).toEqual([])
  write({ type: 'user', message: { role: 'user', content: '<task-notification>\n<task-id>bfollow</task-id>\n<status>completed</status>\n</task-notification>' } })
  // For 30 minutes each call returns something new: no check-in
  for (let m = 1; m <= 30; m++) (returned(`fitted head ${['one', 'two', 'three', 'four', 'five', 'six'][m % 6]} of the batch, file ${m}.npz`), await clock.advance(60_000))
  expect(nudges()).toEqual([])
  // Then each says what the last said, and Claudopus's own messages to it land there too, beside its notes with new words and
  // refused calls: the check-ins come, and the chat is told
  for (let m = 1; m <= 40; m++) {
    const word = ['still', 'fitting', 'waiting', 'looking'][m % 4]
    returned('Running')
    write({ type: 'user', message: { role: 'user', content: 'From Claudopus: a note' } })
    called(`n${m}`, 'mcp__claudopus__note', `Noted: ${word}`)
    write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: `x${m}`, content: `Not run: ${word}`, is_error: true }] } })
    await clock.advance(60_000)
  }
  expect(await until(async () => nudges().length >= 2 || undefined)).toBe(true)
  expect(await until(async () => appended.some(line => line.includes('"Rebuild the head model" is stuck')) || undefined)).toBe(true)
})

test("a helper's command in the background is work only while it prints, for at most 30 minutes after its last line, and a task waiting on its own wake_me beside its helpers is not nudged; work flagged stuck is told to the chat once by 36 minutes whatever its helpers look like, and the word that it waits then says the chat may write to it", SLOW, async ($, on) => {
  const all = { a1: 'running', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running' }
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = Object.fromEntries(Object.keys(all).map(id => [id, 'general-purpose']))
  // When each command in the background last printed, by its task id
  const printed: Record<string, number> = {}
  const { clock, resumed, appended } = world(on, { agents, kinds, parents: { a2: 'a1', a4: 'a3', a6: 'a5' }, jobs: { output: () => 'listening on :3000\n', wroteAt: file => printed[(file.split('/').pop() ?? '').replace(/\.output$/, '')] ?? 0 } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Serve the site', prompt: 'serve' } as never)
  await $.agent.spawn({ ...spawn, description: 'Start the server', prompt: 'start', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the app', prompt: 'check' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the app log', prompt: 'read', parentAgentId: 'a3' } as never)
  await $.agent.spawn({ ...spawn, description: 'Run the dev site', prompt: 'run' } as never)
  await $.agent.spawn({ ...spawn, description: 'Watch the dev site', prompt: 'watch', parentAgentId: 'a5' } as never)
  Object.assign(agents, all)
  for (const id of Object.keys(all)) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  // a2 starts a server that prints once and then hangs silent; a6 one that prints all the time
  await $.tool.call({ tool: 'Bash', tool_use_id: 'v-a2', agentId: 'a2', command: 'hold serve', description: 'Start the server', run_in_background: true } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'v-a6', agentId: 'a6', command: 'hold watch', description: 'Serve the dev site', run_in_background: true } as never)
  printed['bg-v-a2'] = clock.now()
  // a3 asks to be started again in an hour, beside its helper
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w-a3', agentId: 'a3', what: 'the app to come up', minutes: 60 } as never)) as { result?: string }).result).toContain('in 60 min')
  for (const id of ['a1', 'a3', 'a5']) {
    agents[id] = 'completed'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: `e-${id}`, reason: 'answer', agentId: id } as never)
  }
  const nudges = (id: string) => resumed.filter(line => line.startsWith(`${id}: From Claudopus:`) && line.includes('helpers'))
  const told = () => appended.filter(line => line.includes('Nothing new from "Run the dev site"') && line.includes('you may send it a message'))
  const minutes = async (n: number) => {
    for (let at = 0; at < n; at += 1) ((printed['bg-v-a6'] = clock.now()), await clock.advance(60_000))
  }
  // 25 minutes on: the server that last printed 25 minutes ago is still work, and the task waiting on its own wake_me is not nudged
  await minutes(25)
  expect([nudges('a1'), nudges('a3'), nudges('a5'), told()]).toEqual([[], [], [], []])
  // 30 minutes after its last line it is silent: its task is checked on, and ordered to hand back only 12 minutes after that
  await minutes(7)
  expect(nudges('a1')).toHaveLength(1)
  await minutes(6)
  expect(nudges('a1')).toHaveLength(1)
  // The task whose helper prints all along, with nothing new coming back, is told to the chat once by 36 minutes
  expect(told()).toHaveLength(1)
  await minutes(8)
  expect(nudges('a1')).toHaveLength(2)
  expect([told().length, nudges('a3'), nudges('a5')]).toEqual([1, [], []])
  // Its notice that it ended now says the chat may write to it
  const notice = `<task-notification>\n<task-id>a5</task-id>\n<status>completed</status>\n<summary>Agent "Run the dev site" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`
  const r = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }
  const waits = (r.context ?? []).filter(text => text.includes('"Run the dev site" ended its step without its report'))
  expect(waits).toHaveLength(1)
  expect(waits[0]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a5)')
  expect(waits[0]).not.toContain('do not message it')
})

test('the word that the chat was told a task is stuck lasts only until it or its helpers move again: a task held off the stuck flag by a command of its own, told of at the end of the schedule, moves, and the word that it waits says again not to message it', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a1: 'general-purpose', a2: 'general-purpose' }
  const { keep, clock, held, appended } = world(on, { agents, kinds, parents: { a2: 'a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Upload the lids', prompt: 'upload' } as never)
  await $.agent.spawn({ ...spawn, description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' } as never)
  Object.assign(agents, { a1: 'running', a2: 'running' })
  for (const id of ['a1', 'a2']) await $.tool.call({ tool: 'Bash', tool_use_id: `s-${id}`, agentId: id, command: 'git status' } as never)
  // Its own upload runs in the background, so it is never flagged stuck; its helper sits silent
  await $.tool.call({ tool: 'Bash', tool_use_id: 'u-a1', agentId: 'a1', command: 'hold upload', description: 'Upload the lids', run_in_background: true } as never)
  // (the engine holds it for its upload as its step ends, and lists it as completed after)
  const ends = async (turnId: string) => {
    agents.a1 = 'running'
    await $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: 'a1' } as never)
    agents.a1 = 'completed'
  }
  await ends('e1')
  for (let at = 0; at < 38; at += 1) await clock.advance(60_000)
  expect(appended.filter(line => line.includes('"Upload the lids" is stuck'))).toHaveLength(1)
  expect(appended.filter(line => line.includes('Nothing new from "Upload the lids"'))).toEqual([])
  const waitsWord = async () => {
    const notice = `<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Upload the lids" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command "Build" completed (exit code 0)</summary>\n</task-notification>`
    const r = (await $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }
    return (r.context ?? []).filter(text => text.includes('"Upload the lids" ended its step without its report'))
  }
  expect((await waitsWord())[0]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a1)')
  // It moves by itself: something new comes back to it, and it ends its step again
  agents.a1 = 'running'
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'l-a1', agentId: 'a1', command: 'hold look' } as never))
  const letLook = await until(async () => held.get('look'))
  letLook?.('the upload is at 80 percent')
  await ends('e2')
  await clock.advance(60_000)
  const after = await waitsWord()
  expect(after).toHaveLength(1)
  expect(after[0]).toContain('do not message it for one')
  expect(after[0]).not.toContain('Claudopus told you it is stuck')
})

test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', SLOW, async ($, on) => {
  const { keep, settle, clock, held } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' } as never)
  await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' } as never))
  const rows = async () => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
    // The command a helper waits on is a row under it, in its own words, after the word that says it is a command
    // (its name a button, as a press opens its output)
    const r = [...(await pane.findAll({ type: 'Text' })).map(one => one.text), ...(await pane.findAll({ type: 'Button' })).map(one => String(one.props.label))].filter(text => /^(Command · hold search|.* running · .*)$/.test(text))
    await pane.unmount()
    return r
  }
  // (a row from ten seconds on: it was two minutes, and commands ran with nothing shown)
  await clock.advance(5_000)
  expect(await rows()).toEqual([])
  await clock.advance(70_000)
  expect(await rows()).toEqual(['Command · hold search'])
  const letSearch = await until(async () => held.get('search'))
  letSearch?.('found it')
  await clock.advance(1_000)
  expect(await rows()).toEqual([])
  await settle()
})

test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a2: 'general-purpose' }
  const { keep, settle, clock, logged, held } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  // Its first run, moving all along, takes longer than the stuck check waits; then it rests
  for (const part of ['left ear', 'right ear', 'lobes']) {
    await clock.advance(5 * 60_000)
    void keep($.tool.call({ tool: 'Bash', tool_use_id: `e-${part}`, agentId: 'a1', command: `hold ${part}` } as never))
    const letGo = await until(async () => held.get(part))
    letGo?.(`drew the ${part}`)
  }
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(30 * 60_000)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } } as never)
  await clock.advance(25_000)
  const look = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })
    await pane.unmount()
    return r
  }
  expect(await look()).toBeUndefined()
  await $.turn.complete({ answer: 'Bigger now.', durationMs: 1, isAborted: false, turnId: 't1b', reason: 'answer', agentId: 'a1' } as never)
  // Held on a watch it started after a report as long as one: its card goes on, but it is not stuck
  agents.a2 = 'waiting'
  await $.agent.spawn({ ...spawn, description: 'Watch the build', prompt: 'watch' } as never)
  await $.turn.complete({ answer: `The build is watched. ${'Every check passes and it is pushed. '.repeat(15)}`, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(13 * 60_000)
  expect(await look()).toBeUndefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toEqual([])
  await settle()
})

test('work asking the person something waits on them and is never flagged', SLOW, async ($, on) => {
  const { clock, logged } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(30 * 60_000)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })).toBeUndefined()
  expect(logged.filter(line => line.includes('Nothing new from'))).toHaveLength(0)
  await pane.unmount()
})

test('the log is added to, never rewritten whole, and the empty bytes earlier versions left in it are taken out', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/log.md`, `2026-01-01T00:00:00.000Z start one\u0000\u0000\u00002026-01-01T00:00:01.000Z start two\n`)
  await $.session.start(start)
  const text = files.get(`${MEMORY}/log.md`) ?? ''
  expect(text).not.toContain('\u0000')
  expect(text.startsWith('2026-01-01T00:00:00.000Z start one2026-01-01T00:00:01.000Z start two\n')).toBe(true)
  expect(text).toMatch(/Z start engine-id in \/repo\n$/)
})

test('a task Claude Code pressed for its report that ended its step with none, asking nothing and with nothing that starts it again, is started again to carry on and its card stays at work saying so; stopped so again and again with little done between, it is left stopped with one line on its card; a task asking you something, one stopped, one with a result, and one never pressed for a report end as before', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  const pressed = [{ role: 'assistant', content: [{ type: 'text', text: 'Waiting for the build.' }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>' }] }]
  const talk: unknown[] = [...pressed]
  const { clock, resumed, appended } = world(on, { agents, talk })
  await $.session.start(start)
  for (const title of ['Paint the skin', 'Ask about the logo', 'Draw the banner', 'Write the notes', 'Sort the frames']) await $.agent.spawn({ ...spawn, description: title, prompt: title } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] } as never)
  const ends = async (id: string, answer: string, n: number, isAborted = false) => {
    agents[id] = 'completed'
    await $.turn.complete({ answer, durationMs: 1, isAborted, turnId: `t-${id}-${n}`, reason: 'answer', agentId: id } as never)
  }
  const lines = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const found = (await pane.findAll({ type: 'Text', text: /^Stopped partway / })).map(one => ({ text: one.text?.replace(/\d\d:\d\d/g, 'hh:mm'), color: one.props.color }))
    await pane.unmount()
    return found
  }
  const carried = (id: string) => resumed.filter(line => line.startsWith(`${id}: From Claudopus, not `) && line.includes('left stopped partway. Carry on from where you were'))
  await $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a1', command: 'git status' } as never)
  await ends('a1', 'Waiting for the build.', 1)
  for (const id of ['a2', 'a4']) await ends(id, 'Waiting for my answer.', 1)
  await ends('a3', 'Waiting for the build.', 1, true)
  await ends('a4', `Done. ${'Every banner is drawn and checked. '.repeat(20)}`, 2)
  // Started again a moment later, not at once: the engine closes the run first
  expect(carried('a1')).toHaveLength(0)
  await clock.advance(6000)
  expect(carried('a1')).toHaveLength(1)
  expect(resumed.filter(line => /^a[234]: /.test(line))).toEqual([])
  expect(await lines()).toEqual([{ text: 'Stopped partway at hh:mm without a result · Claudopus started it again', color: undefined }])
  // The chat's model is told only once Claudopus gives up; a run that ended with its words as its result, never pressed, ends as before
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Sorted.' }] })
  await ends('a5', 'Sorted.', 1)
  await clock.advance(6000)
  expect(resumed.filter(line => line.startsWith('a5: '))).toEqual([])
  talk.splice(0, talk.length, ...pressed)
  // It stops so again with nothing done: started again twice more, then left stopped, with one line on its card, in amber
  for (const n of [2, 3, 4]) {
    await ends('a1', 'Waiting for the build.', n)
    await clock.advance(6000)
  }
  expect(carried('a1')).toHaveLength(3)
  expect(await lines()).toEqual([{ text: 'Stopped partway 4 times without a result · Claudopus stopped starting it again · send it a message to carry on', color: '#E5A50A' }])
  expect(appended.filter(line => line.includes('"Paint the skin" (a1) keeps stopping partway'))).toHaveLength(1)
  await ends('a1', 'Waiting for the build.', 5)
  await clock.advance(6000)
  expect(carried('a1')).toHaveLength(3)
  // Sent a message, as its card says, it works again and gives its result: the amber line goes, and it ends under Finished
  agents.a1 = 'running'
  await $.tool.call({ tool: 'Bash', tool_use_id: 's9', agentId: 'a1', command: 'git status' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h9', agentId: 'a1', message: `Painted. ${'Every patch is gone. '.repeat(30)}` } as never)
  await ends('a1', `Painted. ${'Every patch is gone. '.repeat(30)}`, 6)
  await clock.advance(6000)
  expect(await lines()).toEqual([])
})

test("a task ending its step with to-dos still to do and nothing of its own running goes on in the same run, told what is left, and its long word of how far it has got is never its result; with a helper at work it may end its step; kept three times in a row with no call between, it is let end; its report with to-dos still to do is refused once, then goes through with them shown as not done on its card, in its result and to the chat", SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  const talk: unknown[] = []
  const { clock, resumed, appended, files } = world(on, { agents, talk })
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Rebuild the head model', prompt: 'rebuild' } as never)
  agents.a1 = 'running'
  const call = (tool: string, input: object) => $.tool.call({ tool: `mcp__claudopus__${tool}`, tool_use_id: 't', agentId: 'a1', ...input } as never)
  for (const item of ['Fit every scan', 'Draw new beside old', 'Second look']) await call('todo', { item })
  await call('todo', { item: 'Fit every scan', state: 'done' })
  const stop = async () => ((await ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })) ?? {}).block
  // 18 Nov: it started its pictures detached with no `echo $!` after them, which failed at once, and ended its step with a long word
  // of how far it had got: kept as its result, its card ended at 1 of 3 and nothing started it again for three and a half hours
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'for p in a b; do nohup python3 pictures.py "$p" > pic.log 2>&1 & done; echo started', description: 'Run: draw the heads (about 5 min)' } as never)
  const kept = await stop()
  expect(kept).toContain('don\'t end here, your task isn\'t finished. Still to do: "Draw new beside old"; "Second look".')
  expect(kept).toContain('look at its log')
  // Kept three times in a row with no call of its own between, it is let end its step; a call counts from one again
  expect([Boolean(await stop()), Boolean(await stop()), await stop()]).toEqual([true, true, undefined])
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b2', agentId: 'a1', command: 'tail -n 5 pic.log' } as never)
  expect(Boolean(await stop())).toBe(true)
  // Let end, its long word of how far it has got is no result: its card stays at work, nothing is kept, and it is carried on
  const progress = `The final tests are done. ${'I am now drawing the kept-aside heads and continue when they end. '.repeat(10)}`
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: progress }] }, PRESS)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: progress, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(6000)
  const reports = () => [...files.keys()].filter(path => path.endsWith('/report.md'))
  expect(reports()).toEqual([])
  expect(resumed.filter(line => line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'))).toHaveLength(1)
  // With a helper of its own at work it may end its step: the helper's result starts it again
  agents.a1 = 'running'
  await $.agent.spawn({ ...spawn, description: 'Draw the heads', prompt: 'draw', parentAgentId: 'a1' } as never)
  agents.a2 = 'running'
  expect(await stop()).toBeUndefined()
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  // Its report with to-dos still to do is refused, naming them; with one ticked, refused again for the one left; the same again
  // goes through
  // (a result as long as one Claudopus keeps)
  const REPORT = `The new model is nearer on unseen heads.${' Each head kept aside is closer behind the ear.'.repeat(12)}`
  const handback = async () => ((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h', agentId: 'a1', message: REPORT } as never)) as { deny?: string }).deny
  expect(await handback()).toContain('Not sent: 2 of your to-dos are still to do: "Draw new beside old"; "Second look".')
  await call('todo', { item: 'Draw new beside old', state: 'done' })
  expect(await handback()).toContain('Not sent: a to-do of yours is still to do: "Second look".')
  expect(await handback()).toBeUndefined()
  expect(appended.filter(line => line.includes('handed back its result with a to-do not done: "Second look"'))).toHaveLength(1)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  expect(await until(async () => reports().length || undefined)).toBe(1)
  expect(files.get(reports()[0])).toBe(`${REPORT}\n\nNot done:\n- Second look\n`)
  // Its card, under Finished, says what is not done, in amber
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const fold = await until(async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label))))
  if (fold) await pane.press({ key: String(fold.key) })
  const line = await until(async () => (await pane.find({ type: 'Text', text: /^Not done · / })) ?? undefined)
  expect([line?.text, line?.props.color]).toEqual(['Not done · Second look', '#E5A50A'])
})
