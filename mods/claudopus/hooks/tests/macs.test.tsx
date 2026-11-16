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
  // Answered after the test's own timers have had their turn, as the engine answers from outside the helper
  on('session.id', async () => (await new Promise(done => setTimeout(() => done(undefined), 0)), { value: 'engine-id' }))
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
    if (tool === '/bin/sleep') return new Promise(done => sleepers.push(() => done(ok()))) as never
    // Every admin password an earlier version kept, taken out of the keychain as the mod loads
    if (tool === '/bin/sh' && String(rest[1]).includes('delete-generic-password -s claudopus-admin')) return (files.set('keychain:admin-forgotten', 'yes'), ok())
    // What a password box sends, sealed by openssl to the key of the runner that asked: the test's own stand-in for it
    if (tool === '/bin/bash' && String(rest[1]).includes('pkeyutl -encrypt')) return ok(`${boxSealed(String(rest[3]), String(e.init?.stdin ?? ''))}\n`)
    // The admin gate's seals: one for each message, under the key the keychain holds as keychain:gate; "make" makes a key where
    // there is none and "new" always, as the Mac's own shell does
    if (tool === '/bin/sh' && String(rest[1]).includes('claudopus-admin-gate')) {
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
  on('agent.register', (_, e) => (registered.push(String((e as { name?: string }).name)), { value: undefined }) as never)
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

  return { files, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, resumed, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keep, settle, keychain, admins, wake, gitRan, backgrounds, agentModels, asked, types, registered }
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

// The other Mac: its chats over ssh, the same results on both, and chats the app runs over ssh

test("F-014 · a Mac that reaches another hands it this Mac's chats in the same trip; answers carried back from there answer nothing here and are put away there", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // The M4 answers its clock, no chats, and one answer pressed there for this Mac's chat-b
  const pressed = JSON.stringify({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW, at: NOW, chat: 'chat-b' })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-answer---\n${NOW}-abc.json\n${pressed}\n---claudopus-answer---\nbad name\n${pressed}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const first = await until(async () => sshed.find(([command]) => command?.startsWith("sh -c 'L=")))
  // What it hands over says who this Mac is, what it calls the M4, and carries this Mac's chats only
  const [head = '', ...rest] = (first?.[1] ?? '').split('\n')
  expect(JSON.parse(head)).toEqual({ from: 'sams-macbook-air', you: 'm4' })
  expect(rest.join('\n')).toContain('"chat":"chat-b"')
  expect(first?.[0]).toContain('$L/pushed/sams-macbook-air.$$.part')
  expect(first?.[0]).not.toContain('rm -f 1')
  // The answer is left for no chat here, though it names the ask that stands
  expect([...files.keys()].filter(path => path.includes('/live/answers/chat-b/'))).toEqual([])
  // The next trip puts it away there, and carried again it is not left either
  await clock.advance(10_000)
  const second = sshed.filter(([command]) => command?.startsWith("sh -c 'L=")).at(-1)
  expect(second?.[0]).toContain(`rm -f ${NOW}-abc.json`)
  expect(files.has(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)).toBe(false)
})

test("with another Mac named, the results become the same on both: what each lacks is copied over with its paths moved home, and what was done to one both have goes both ways", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const result = (id: string, more: object = {}) => ({ id, title: `Result ${id}`, subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: `${HOME}/repo`, gist: '', files: [], agent: '', ...more })
  // Here: "both", put away here, and "mine" only here. There: "both", with an answer given there, and "theirs" only there
  files.set(`${MEMORY}/reports/both/meta.json`, JSON.stringify(result('both', { archived: NOW, waiting: [{ text: 'Ship it?' }] })))
  files.set(`${MEMORY}/reports/both/report.md`, 'Both.\n')
  files.set(`${MEMORY}/reports/mine/meta.json`, JSON.stringify(result('mine')))
  files.set(`${MEMORY}/reports/mine/report.md`, 'Mine.\n')
  const there = JSON.stringify({ ...result('both', { waiting: [{ text: 'Ship it?', answer: 'Yes' }] }), folder: '/Users/sam/repo' })
  const theirs = JSON.stringify({ ...result('theirs'), folder: '/Users/sam/repo' })
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nboth\n111 222\n${there}\n---claudopus-result---\ntheirs\n3 4\n${theirs}\n`)
  files.set('remote:theirs/meta.json', theirs)
  files.set('remote:theirs/report.md', 'See /Users/sam/repo/a.png\n')
  await $.session.start(start)
  await clock.advance(10_000)
  // "theirs" is brought, whole, its paths on this Mac's home
  await until(async () => files.get(`${MEMORY}/reports/theirs/meta.json`))
  expect(files.get(`${MEMORY}/reports/theirs/meta.json`)).toContain(`"folder":"${HOME}/repo"`)
  expect(files.get(`${MEMORY}/reports/theirs/report.md`)).toBe(`See ${HOME}/repo/a.png\n`)
  expect(sshed.find(([script]) => script?.includes('tar xf - -C "$S"'))?.[1]).toContain('tar cf - theirs -C _sync _end')
  // "mine" is handed there, and only it
  const handed = await until(async () => sshed.find(([script]) => script?.includes(': > _end && COPYFILE_DISABLE=1 tar cf')))
  expect(handed?.[1]).toMatch(/ mine$/)
  // "both": the answer given there is kept here, and put away here goes there, written only if unchanged there since it was read
  const marked = await until(async () => sshed.find(([command]) => command?.includes('/reports/both/meta.json')))
  const here = JSON.parse(files.get(`${MEMORY}/reports/both/meta.json`) ?? '{}')
  expect(here.waiting).toEqual([{ text: 'Ship it?', answer: 'Yes' }])
  expect(here.archived).toBe(NOW)
  expect(marked?.[0]).toContain('= "111 222" ] || exit 3')
  expect(JSON.parse(marked?.[1] ?? '{}')).toMatchObject({ archived: NOW, folder: '/Users/sam/repo', waiting: [{ text: 'Ship it?', answer: 'Yes' }] })
  // Within the next two minutes it is not looked at again; nothing here was deleted
  await clock.advance(60_000)
  expect(sshed.filter(([command]) => command?.startsWith("sh -c 'echo $HOME;")).length).toBe(1)
  expect(files.get(`${MEMORY}/reports/mine/report.md`)).toBe('Mine.\n')
})

test("a result cut short on its way is never put in place, and a list cut short sends nothing either way", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const theirs = JSON.stringify({ id: 'theirs', title: 'T', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' })
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\ntheirs\n3 4\n${theirs}\n`)
  files.set('remote:theirs/meta.json', theirs)
  files.set('remote:theirs/report.md', 'All of it.\n')
  files.set('pull:cut', '1')
  files.set(`${MEMORY}/reports/mine/meta.json`, JSON.stringify({ ...JSON.parse(theirs), id: 'mine' }))
  await $.session.start(start)
  await clock.advance(10_000)
  await until(async () => sshed.find(([script]) => script?.includes('tar xf - -C "$S"')))
  await clock.advance(1_000)
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
  // Cut between its two files with tar ending well: no _end came, so it is not put in place either
  files.set('pull:cut', 'between')
  const pulls = sshed.filter(([script]) => script?.includes('tar xf - -C "$S"')).length
  await clock.advance(120_000)
  await until(async () => sshed.filter(([script]) => script?.includes('tar xf - -C "$S"')).length > pulls)
  await clock.advance(1_000)
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
  // Two minutes on, with the list cut short: nothing is brought, handed or marked
  files.delete('pull:cut')
  files.set('ssh:cut', '1')
  const before = sshed.length
  await clock.advance(120_000)
  expect(sshed.slice(before).filter(([script]) => !script?.startsWith("sh -c 'L=") && !script?.startsWith("sh -c 'echo $HOME;") && !script?.startsWith('find'))).toEqual([])
  expect(files.has(`${MEMORY}/reports/theirs/meta.json`)).toBe(false)
})

test('a result put away here and brought back on the other Mac by an older version stays brought back on both', async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' }
  files.set(`${MEMORY}/reports/r/meta.json`, JSON.stringify({ ...r, archived: NOW - 1000 }))
  // The last sync left it put away on both; there it is now neither put away nor brought back with a time
  files.set(`${MEMORY}/live/macs/sam-m4.local.results.json`, JSON.stringify({ syncedAt: 1, triedAt: 1, archived: { r: NOW - 1000 } }))
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nr\n1 2\n${JSON.stringify(r)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const here = await until(async () => {
    const one = JSON.parse(files.get(`${MEMORY}/reports/r/meta.json`) ?? '{}')
    return one.broughtBack ? one : undefined
  })
  expect(here.archived).toBeUndefined()
  // Nothing puts it away there again
  expect(sshed.some(([command, stdin]) => command?.includes('/reports/r/meta.json') && JSON.parse(stdin || '{}').archived)).toBe(false)
})

test('a result brought back after it was put away on the other Mac stays out of the archive, as the later of the two', async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' }
  files.set(`${MEMORY}/reports/r/meta.json`, JSON.stringify({ ...r, archived: NOW - 1000 }))
  files.set('ssh:results', `/Users/sam\n---claudopus-result---\nr\n1 2\n${JSON.stringify({ ...r, broughtBack: NOW })}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const here = await until(async () => {
    const one = JSON.parse(files.get(`${MEMORY}/reports/r/meta.json`) ?? '{}')
    return one.broughtBack ? one : undefined
  })
  expect(here.archived).toBeUndefined()
})

test("a Mac handed another Mac's chats lists them by name and Mac with its own, with their asks answered only there, and drops them once that Mac stops handing them over", async ($, on) => {
  const { files, clock } = world(on)
  // No macs here: this is the Mac that cannot reach the other one. Its clock is an hour behind the other Mac's
  const ahead = NOW + 3_600_000
  const push = `${JSON.stringify({ from: 'sams-m5', you: 'sams-m4' })}\n${ahead / 1000}\n---claudopus-live---\n${otherChat(ahead, 'chat-m5', 'Robot arm')}\n---claudopus-live---\n${JSON.stringify({ chat: 'chat-idle', title: 'Quiet one', folder: '/x', host: '', at: ahead, cards: [] })}\n`
  files.set(`${MEMORY}/live/pushed/sams-m5.json`, push)
  files.set(`mtime:${MEMORY}/live/pushed/sams-m5.json`, String(NOW))
  // A copy laid under a name that is not the Mac it says handed it is passed over
  files.set(`${MEMORY}/live/pushed/other.json`, push)
  // This Mac's own chat with nothing running
  files.set(`${MEMORY}/live/chat-own.json`, JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW, cards: [] }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on sams-m5' })).toBeDefined()
  // The chats with nothing going on, of either Mac, are not listed, and this chat with nothing going on gets no heading
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Own quiet' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text' })).filter(one => one.text === 'Robot arm')).toHaveLength(1)
  // Its running time is told on this Mac's clock
  expect(await list.find({ type: 'Text', text: /^Opus 5\.5 · (\d+ of \d+ done · )?(\d+s|1m \d\ds)$/ })).toBeDefined()
  // Its ask has nothing to press here, and nothing waits in the outbox for that Mac
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Send')).toBe(false)
  expect([...files.keys()].filter(path => path.startsWith(`${MEMORY}/live/outbox/sams-m5/`) && path.endsWith('.json'))).toEqual([])
  // That Mac goes to sleep: its copy is not handed over again and goes stale, and its chats leave, as does the naming of this one
  await clock.advance(100_000)
  files.set(`${MEMORY}/live/chat-own.json`, JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW + 100_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("work on another Mac whose chat runs a version that drops a card as it ends, saying nothing of its end, turns happy here for its pause, then is gone", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const running = (at: number) => JSON.stringify({ ...JSON.parse(otherChat(at, 'chat-old', 'Remote connector')), cards: [JSON.parse(otherChat(at)).cards[1]] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${running(NOW)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Check the totals' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Working on 1 thing in another chat' })).toBeDefined()
  // The work ends: that chat, still open, writes its file with no card at all
  const quiet = JSON.stringify({ chat: 'chat-old', title: 'Remote connector', folder: '/repo/billing', host: '', at: NOW + 11_000, cards: [] })
  files.set('ssh:fetch', `${(NOW + 11_000) / 1000}\n---claudopus-live---\n${quiet}\n`)
  // It is seen at the next fetch, a second at a time so its pause is not passed over
  let seen
  for (let n = 0; n < 20 && !seen; n += 1) (await clock.advance(1000), (seen = await list.find({ type: 'Text', text: '✓ Finished' })))
  expect(seen).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Check the totals' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Just finished' })).toBeDefined()
  expect(await drawn(list)).toEqual(['happy'])
  // After its pause it is gone, and not kept under Finished, since its chat said nothing of how it ended
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Check the totals' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Nothing is running' })).toBeDefined()
  expect(await drawn(list)).toEqual(['mark'])
  expect((await list.findAll({ type: 'Button' })).some(b => /Finished/.test(String(b.props.label)))).toBe(false)
  // A chat that closes with its work running shows nothing finished: its work just leaves
  files.set('ssh:fetch', `${(NOW + 40_000) / 1000}\n---claudopus-live---\n${running(NOW + 40_000)}\n`)
  let back
  for (let n = 0; n < 20 && !back; n += 1) (await clock.advance(1000), (back = await list.find({ type: 'Text', text: 'Check the totals' })))
  expect(back).toBeDefined()
  files.set('ssh:fetch', `${(NOW + 60_000) / 1000}\n`)
  let finished
  for (let n = 0; n < 20; n += 1) (await clock.advance(1000), (finished ||= await list.find({ type: 'Text', text: '✓ Finished' })))
  expect(finished).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Check the totals' })).toBeUndefined()
  await list.unmount()
})

test("Details of work in a chat the app runs on another Mac shows what that chat shares, and one press opens that chat", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const chat = { chat: 'chat-m4', title: 'Video', folder: '/Users/sam/GitHub', host: '', at: NOW, link: { bridge: 'session_01Video', app: '' }, cards: [{ id: 'v1', parentId: '', isFork: false, tokens: 242_001, title: 'Improve the video', words: 'Can you improve the video?', items: [{ text: 'Find the cuts', state: 'done' }, { text: 'Have it checked', state: 'doing' }, { text: 'Show you', state: 'open' }], entries: [{ at: NOW - 1000, kind: 'note', text: 'Rendering again for a second look.' }], answer: '', startedAt: NOW - 60_000, endedAt: 0, status: 'working', model: 'claude-fable-5-2' }] }
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${JSON.stringify(chat)}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Improve the video' }))).toBeDefined()
  const id = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-r-'))?.key?.replace(/^open-/, '').replace(/-\d+$/, '') ?? ''
  const tab = await $.ui.mount({ ...LIST, requestId: `work-${id}`, surface: 'desktop' } as never)
  const texts = (await tab.findAll({ type: 'Text' })).map(t => t.text)
  expect(texts).toContain('From the chat "Video", GitHub · on m4')
  expect(texts).toContain('“Can you improve the video?”')
  expect(texts).toContain('Have it checked')
  expect(texts).toContain('Rendering again for a second look.')
  expect(texts).toContain('This task runs in the chat "Video" on m4. Stop it or change its model there.')
  await pressed(tab, `their-chat-${id}`)
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01Video'])
  await tab.unmount()
  await list.unmount()
})

test("in a chat whose screen never says which tab it shows, as one the app runs over ssh, Details opens its tab once and leaves it drawn", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: false, isPlaced: true }]
  const { opened, closed, clock } = world(on, { live })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  await clock.advance(1000)
  expect(opened.filter(id => id === 'work-a1')).toHaveLength(1)
  expect(closed).not.toContain('work-a1')
  expect(live.find(one => one.id === 'work-a1')?.isPlaced).toBe(true)
  await pane.unmount()
})

test("where the screen says which tab it shows, a Details tab left behind the list is brought forward once the press has run", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { opened, closed, clock } = world(on, { live })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  expect(await until(async () => opened.includes('work-a1') || undefined)).toBe(true)
  await clock.advance(1000)
  expect(opened.filter(id => id === 'work-a1')).toHaveLength(2)
  expect(closed.filter(id => id === 'work-a1')).toHaveLength(1)
  await pane.unmount()
})

test("a press inside the list gives it the keyboard, and the engine shows no new tab over one holding it: the list lets go first, then Stats opens in front", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true, isFocused: true }]
  const { opened, closed } = world(on, { live })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'stats-open')
  expect(await until(async () => opened.includes('stats') || undefined)).toBe(true)
  // The list was closed and opened again before Stats, and is open still
  expect(closed).toContain('claudopus')
  expect(opened.lastIndexOf('claudopus')).toBeLessThan(opened.lastIndexOf('stats'))
  // Stats opened behind before the list closed, so the sidebar never stood empty
  expect(opened.indexOf('stats')).toBeLessThan(opened.lastIndexOf('claudopus'))
  expect(live.map(one => one.id)).toEqual(['claudopus', 'stats'])
  await pane.unmount()
})

test("where the engine says of no tab that it is shown or holds the keyboard (a chat over ssh), every other tab lets go first, in its place, then Stats opens in front", async ($, on) => {
  const live = [
    { id: 'claudopus', isShown: false, isPlaced: false },
    { id: 'reports', isShown: false, isPlaced: false },
  ]
  const { opened, closed } = world(on, { live, blind: true, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'stats-open')
  expect(await until(async () => opened.includes('stats') || undefined)).toBe(true)
  expect(closed).toEqual(expect.arrayContaining(['claudopus', 'reports']))
  // Stats opened behind first, so the sidebar never stood empty, and last with the keyboard
  expect(opened.indexOf('stats')).toBeLessThan(opened.lastIndexOf('claudopus'))
  expect(opened.lastIndexOf('claudopus')).toBeLessThan(opened.lastIndexOf('stats'))
  expect(opened.lastIndexOf('reports')).toBeLessThan(opened.lastIndexOf('stats'))
  // The tabs stand as they stood, Stats after them
  expect(live.map(one => one.id)).toEqual(['claudopus', 'reports', 'stats'])
  expect(closed.filter(id => id !== 'agents').sort()).toEqual(['claudopus', 'reports', 'stats'])
  await pane.unmount()
})

test("a roster that says nothing in a chat on this Mac (nothing drawn) leaves the other tabs alone on a press", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: false, isPlaced: false }]
  const { opened, closed } = world(on, { live, blind: true })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'stats-open')
  expect(await until(async () => opened.includes('stats') || undefined)).toBe(true)
  expect(closed).not.toContain('claudopus')
  await pane.unmount()
})

test("with no tab holding the keyboard, a press opens its tab and leaves the list alone", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { opened, closed } = world(on, { live })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'stats-open')
  expect(await until(async () => opened.includes('stats') || undefined)).toBe(true)
  expect(closed).not.toContain('claudopus')
  await pane.unmount()
})

test("an empty tab an earlier version left open, not drawn, closes as the mod loads; the list and drawn tabs stay", async ($, on) => {
  const live = [
    { id: 'claudopus', isShown: true, isPlaced: true },
    { id: 'work-a9', isShown: false, isPlaced: false },
    { id: 'reports', isShown: false, isPlaced: true },
  ]
  const { closed } = world(on, { live })
  await $.session.start(start)
  expect(closed.filter(id => id !== 'agents')).toEqual(['work-a9'])
  expect(live.map(one => one.id)).toEqual(['claudopus', 'reports'])
})

test("a reload while the panel stayed up gives every button a key no load before used, so the app takes each afresh and a press works", async ($, on) => {
  const live = [{ id: 'claudopus', isShown: true, isPlaced: true }]
  const { opened, clock } = world(on, { live })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const before = (await keyed(pane, 'stats-open'))?.key
  expect(before).toBeDefined()
  // The code reloads from the folder it is watched in: the panel is still up, and the load runs again
  await clock.advance(7000)
  await $.session.start(start)
  const after = await until(async () => {
    const key = (await keyed(pane, 'stats-open'))?.key
    return key && key !== before ? key : undefined
  })
  expect(after).toBeDefined()
  await pressed(pane, 'stats-open')
  expect(opened).toContain('stats')
  // Another reload a moment later moves on again
  const again = (await keyed(pane, 'stats-open'))?.key
  await clock.advance(1)
  await $.session.start(start)
  expect(await until(async () => ((await keyed(pane, 'stats-open'))?.key !== again ? true : undefined))).toBe(true)
})

test("with no screen attached every tab waits undrawn, and none is closed as the mod loads", async ($, on) => {
  const live = [
    { id: 'claudopus', isShown: false, isPlaced: false },
    { id: 'work-a9', isShown: false, isPlaced: false },
  ]
  const { closed, clock } = world(on, { live })
  await $.session.start(start)
  await clock.advance(5000)
  expect(closed.filter(id => id !== 'agents')).toEqual([])
})

test("in a chat another Mac's app runs here over SSH, a chat's name is left for that Mac to open, never opened on this Mac", async ($, on) => {
  const { files, clock, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  // The Mac whose app runs this chat hands its chats here; one of them shares no link this Mac could open
  const push = `${JSON.stringify({ from: 'sams-m5', you: 'sams-m4' })}\n${NOW / 1000}\n---claudopus-live---\n${otherChat(NOW, 'chat-m5', 'Robot arm')}\n`
  files.set(`${MEMORY}/live/pushed/sams-m5.json`, push)
  files.set(`mtime:${MEMORY}/live/pushed/sams-m5.json`, String(NOW))
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ key: 'chat-open-sams-m5-chat-m5' }))).toBeDefined()
  await list.press({ key: 'chat-open-sams-m5-chat-m5' })
  await list.press({ key: 'chat-open--chat-b' })
  const left = () => [...files.keys()].filter(path => /\/live\/outbox\/sams-m5\/o-\d+-[a-z0-9]+\.json$/.test(path))
  expect(await until(async () => (left().length === 2 ? true : undefined))).toBe(true)
  expect(left().map(path => JSON.parse(files.get(path) ?? '{}').chat).sort()).toEqual(['chat-b', 'chat-m5'])
  expect(shown.filter(one => one[0] === 'open' && String(one[1]).startsWith('claude:'))).toEqual([])
  await list.unmount()
})

test('a name pressed on another Mac for this Mac is opened here, by what this Mac holds, once, and not when it waited too long', async ($, on) => {
  const { files, clock, shown, sshed } = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_self-1' } })
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${otherChat(NOW, 'chat-m4', 'Robot arm')}\n`)
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  // A chat of this Mac with nothing going on still opens by the link its file shares
  files.set(`${MEMORY}/live/chat-idle.json`, JSON.stringify({ chat: 'chat-idle', title: 'Quiet', folder: '/q', host: '', at: NOW, cards: [], link: { bridge: '', app: 'local_idle-1' } }))
  await $.session.start(start)
  await clock.advance(12_000)
  const now = NOW + 12_000
  const press = (chat: string, at: number) => `---claudopus-open---\n${JSON.stringify({ chat, at })}\n`
  files.set('ssh:opens', `${now / 1000}\n${press('chat-b', now - 1000)}${press('engine-id', now - 1000)}${press('chat-idle', now)}${press('chat-old', now - 60_000)}${press('bad id; rm', now)}`)
  await clock.advance(4000)
  const opened = () => shown.filter(one => one[0] === 'open').map(one => one[1])
  expect(await until(async () => (opened().length >= 3 ? true : undefined))).toBe(true)
  expect(opened().sort()).toEqual(['claude://code/continue?session=local_here-1', 'claude://code/continue?session=local_idle-1', 'claude://code/continue?session=local_self-1'])
  // Taken over the kept connection, from this Mac's own folder there
  expect(sshed.some(([command]) => command?.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/sams-macbook-air"))).toBe(true)
  await clock.advance(10_000)
  expect(opened()).toHaveLength(3)
})

test('presses left on another Mac are read with their clock, each chat once, the stale and malformed dropped', () => {
  const now = 1_700_000_000
  const text = `banner\n${now}\n---claudopus-open---\n{"chat":"a","at":${now * 1000 - 5000}}\n---claudopus-open---\n{"chat":"a","at":${now * 1000}}\n---claudopus-open---\n{"chat":"b","at":${now * 1000 - 31_000}}\n---claudopus-open---\nnot json\n---claudopus-open---\n{"chat":"$(x)","at":${now * 1000}}\n`
  expect(opensOf(text)).toEqual(['a'])
  expect(opensOf('')).toEqual([])
  expect(openTake('sams-m5')).toContain('live/outbox/sams-m5 ')
})

test("in a chat another Mac's app runs here, with no Mac handing its chats here, a name opens nothing on this Mac", async ($, on) => {
  const { files, clock, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...JSON.parse(otherChat(NOW)), link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  expect(await list.find({ key: 'chat-open--chat-b' })).toBeUndefined()
  expect(shown.filter(one => one[0] === 'open')).toEqual([])
  await list.unmount()
})

test("a chat on the other Mac running without Claudopus, and this Mac's app having decided new ones will, show as a warning under the header until neither holds", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  files.set('ssh:fetch', `${NOW / 1000}\noff 0bcc28d2-aaaa {"customTitle":"FaceIQ email plan"}\noff bad;id\n`)
  files.set('sh:applog', "2026-11-12 13:57:59 [warn] [CCD] SSH local_x: 1 plugin(s) left to the host's own install did not load there; their copies are handed over from the next start on\n")
  await $.session.start(start)
  await clock.advance(40_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Claudopus is off in some chats' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^New chats on m4 start without Claudopus\. .* at 2026-11-12 13:57 .*quit and opened again\.$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^“FaceIQ email plan” on m4 runs without Claudopus/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /bad;id/ })).toBeUndefined()
  // The app is quit and opened again, and the chat there has gone: the warning goes
  files.set('sh:applog', '2026-11-13 09:00:00 [info] Starting app {\n')
  files.set('ssh:fetch', `${NOW / 1000}\n`)
  await clock.advance(40_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: /^Claudopus is off/ })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("the other Mac's asks and finishes are told here as a notification once, opening that chat; old ones are not", async ($, on) => {
  const { files, clock, own } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const chat = (at: number, more: object = {}) => JSON.stringify({ ...JSON.parse(otherChat(at, 'chat-m4', 'Robot arm')), link: { bridge: 'cse_robot1', app: '' }, ...more })
  // An ask from long ago is not told
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${chat(NOW - 3_600_000, { at: NOW })}\n`)
  await $.session.start(start)
  await clock.advance(15_000)
  expect(own.filter(one => one.includes('--asks'))).toEqual([])
  // A fresh one is, once, however many looks see it
  const later = NOW + 15_000
  files.set('ssh:fetch', `${later / 1000}\n---claudopus-live---\n${chat(later)}\n`)
  await clock.advance(30_000)
  const asked = () => own.filter(one => one.includes('--asks') && one.includes('Send the invoices has a question for you'))
  expect(await until(async () => (asked().length ? true : undefined))).toBe(true)
  await clock.advance(20_000)
  expect(asked()).toHaveLength(1)
  const one = asked()[0] ?? []
  expect(one[one.indexOf('--text') + 1]).toBe('May I send 12 invoices? · Robot arm on m4')
  expect(one[one.indexOf('--open') + 1]).toBe('claude://code/cse_robot1')
  // Its work finishes there: told as ready, once
  const ended = later + 50_000
  const done = JSON.parse(chat(later)) as { cards: { status: string; endedAt: number; ask?: unknown }[] }
  done.cards = done.cards.map(c => ({ ...c, status: 'done', endedAt: ended, ask: undefined }))
  files.set('ssh:fetch', `${ended / 1000}\n---claudopus-live---\n${JSON.stringify({ ...done, at: ended })}\n`)
  await clock.advance(30_000)
  const readyOnes = () => own.filter(one => !one.includes('--asks') && one.includes('Check the totals'))
  expect(await until(async () => (readyOnes().length ? true : undefined))).toBe(true)
  await clock.advance(20_000)
  expect(readyOnes()).toHaveLength(1)
})

test('the look for chats without Claudopus is read whole, each chat once, and what the app last logged says whether its decision holds', () => {
  expect(offOf(`banner\n1700000000\noff abc-1 {"customTitle":"Plan"}\noff abc-1 {"customTitle":"Plan"}\noff new \noff $(rm) x\n---claudopus-live---\noff later-1\n`)).toEqual([
    { chat: 'abc-1', title: 'Plan' },
    { chat: 'new', title: '' },
  ])
  expect(stuckOf("2026-11-12 13:57:59 [warn] [CCD] SSH local_x: 1 plugin(s) left to the host's own install did not load there; their copies are handed over\n")).toBe('2026-11-12 13:57')
  expect(stuckOf('2026-11-13 09:00:00 [info] Starting app {\n')).toBe('')
  expect(stuckOf('')).toBe('')
  // A trip carries the look, with nothing in it that ends its single quotes
  expect(OFF_LOOK).not.toContain("'")
  expect(trip('sams-m5', [])).toContain(OFF_LOOK)
})

test("in a chat over ssh the panel's text stays the same from second to second while work runs, so a click does not name a button a redraw let go: times to the minute, tokens to 10k, context to 5%", async ($, on) => {
  const { clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'Fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose' } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' } as never)) void _
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = async () => (await pane.findAll({ type: 'Text' })).map(t => t.text).join('|')
  const first = await texts()
  expect(first).toContain('<1m')
  expect(first).toMatch(/context \d*[05]% \(310k\)|context 310k/)
  await clock.advance(20_000)
  expect(await texts()).toBe(first)
  await clock.advance(41_000)
  expect(await texts()).toContain('1m')
  await pane.unmount()
})
