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
  mock.env(on, { HOME, ...options.env })
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

// The admin gate: an admin command waits for the person's press on its work's card

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

test('asked each time: the call is held, its card shows the exact command and the Mac with three buttons, and Allow once lets that one command run', async ($, on) => {
  const { press, list, bash, labels, held, grants, admins, logged, notified, files } = await gated($, on)
  let done = false
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`).then(r => ((done = true), r))
  expect(await held('b1')).toBeDefined()
  // Held: nothing ran, and nothing is granted
  expect(done).toBe(false)
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  expect((await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' }))?.props.color).toBe('#E5A50A')
  expect((await list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' }))?.props.mono).toBe(true)
  expect(await list.find({ type: 'Text', text: "Allow: it runs with admin rights. Deny: it doesn't run, and Claudopus tells Claude." })).toBeDefined()
  expect((await labels()).filter(one => ['Allow once', 'Always allow this command', 'Deny'].includes(one))).toEqual(['Allow once', 'Always allow this command', 'Deny'])
  // Said in the chat and as a notification; its Details tab has it at the top
  expect(logged.some(line => line.includes('The task "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts') && line.includes('Nothing typed in the chat allows it'))).toBe(true)
  expect(notified).toContain('Fix the hosts file has a question for you | Wants to run an admin command on this Mac: chmod 644 /etc/hosts')
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await details.find({ type: 'Text', text: 'Needs you now' })).toBeDefined()
  await press('gate-b1-0-once')
  expect((await call).result).toBe('ran')
  // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
  expect(admins.length).toBe(1)
  const [grant] = admins[0]?.grants ?? []
  expect(admins[0]?.grants.length).toBe(1)
  expect({ host: grant?.host, command: grant?.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' })
  expect(grant?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', `grant\n${grant?.id}\n${grant?.at}\nhere\nchmod 644 /etc/hosts`))
  expect(grants()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeUndefined()
  // In its place for a minute: what the person pressed and what happens now
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it once · it runs now' }))).toBeDefined()
  expect(files.has(ALLOWED)).toBe(false)
  // Once is once: the same command again is held again
  void bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b2')).toBeDefined()
  expect(admins.length).toBe(1)
})

test('Deny refuses the call with a line that says the person refused it, and nothing runs or is granted', async ($, on) => {
  const { press, list, bash, held, grants, admins } = await gated($, on)
  const call = bash('b1', `${ADMIN} m4 'rm -rf /Library/Caches/x'`)
  expect(await held('b1')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })).toBeDefined()
  await press('gate-b1-0-deny')
  const r = await call
  expect(r.deny).toBe("Refused by Sam: Sam pressed Deny on this admin command, so it didn't run. Don't try to run it another way. Continue without it, or say what it is needed for and ask again.")
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })).toBeUndefined()
  expect(await until(async () => list.find({ type: 'Text', text: "You denied it · it didn't run, and Claudopus told Claude" }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Admin command on m4' })).toBeDefined()
})

test('no way to the runner gets past the press: another spelling, a shell, a helper, and two commands in one call each wait', async ($, on) => {
  const { press, list, bash, held, admins, labels } = await gated($, on)
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
  // Two in one call: the first allowed, the second asked in its turn; denied, neither runs and the first grant is taken back
  const both = bash('t1', `${ADMIN} here 'id -u' && ${ADMIN} here 'whoami'`)
  expect(await held('t1')).toBeDefined()
  await press('gate-t1-0-once')
  expect(await until(async () => keyed(list, 'gate-t1-1-deny'))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'whoami' })).toBeDefined()
  await press('gate-t1-1-deny')
  expect((await both).deny).toContain('Refused by Sam')
  expect(admins.length).toBe(0)
  expect(await labels()).not.toContain('Deny')
  // Words typed in the chat and passed on by the chat allow nothing: only the press does
  const waiting = bash('w1', `${ADMIN} here 'id -u'`)
  expect(await held('w1')).toBeDefined()
  await $.prompt.submit({ text: 'Allow once', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow once' } as never)
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
  expect(await config.find({ type: 'Text', text: 'Always allowed' })).toBeDefined()
  expect((await config.find({ type: 'Text', text: 'softwareupdate -l' }))?.props.mono).toBe(true)
  expect(await config.find({ type: 'Text', text: 'rm -rf /' })).toBeUndefined()
  expect(await config.find({ type: 'Text', text: /2 more in the file were not added by your press and allow nothing/ })).toBeDefined()
  const before = files.get('keychain:gate')
  const stale = JSON.stringify(kept)
  await pressed(config, 'config-admin-remove-0')
  expect(await until(async () => (JSON.parse(files.get(ALLOWED) ?? '{"here":[1]}').here === undefined ? true : undefined))).toBe(true)
  expect(await config.find({ type: 'Text', text: /^None yet/ })).toBeDefined()
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
  const { press, list, bash, held, admins, files, labels, tabs } = await gated($, on)
  // The setting is chosen in Config, which seals it
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined()
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Ask before an admin command' })).toBeDefined()
  await config.select({ key: 'config-admin-mode-pick', value: 'work' })
  const sealedAs = await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}') as { admin?: string; adminSealed?: string }).adminSealed)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal(files.get('keychain:gate') ?? '', 'mode\nwork') })
  expect(sealedAs).toBeDefined()
  await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' } as never)
  await $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Update the other Mac', prompt: 'update the other Mac' } as never)
  const first = bash('b1', `${ADMIN} here 'id -u'`)
  expect(await held('b1')).toBeDefined()
  expect(await labels()).toContain('Allow for this task')
  expect(await labels()).not.toContain('Allow once')
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
    expect(await config.find({ type: 'Text', text: new RegExp(`config\\.json says "${admin}", but it was not chosen here, so every command asks`) })).toBeDefined()
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
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeUndefined()
  // Config's Reset puts the asking back, and makes a new key
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
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
  expect(await config.find({ type: 'Text', text: 'Admin password' })).toBeUndefined()
  expect(await config.find({ type: 'Text', text: /each one also asks for the admin password, which is never saved/ })).toBeDefined()
  // Another Mac's admin command is held on its card as this Mac's is: its password is asked when it runs
  const call = bash('b2', `${ADMIN} m4 'id -u'`)
  expect(await held('b2')).toBeDefined()
  await press('gate-b2-0-once')
  expect((await call).result).toBe('ran')
  expect(admins.length).toBe(1)
})

test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work", async ($, on) => {
  const w = world(on)
  w.files.set('keychain:gate', 'kept-key')
  w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  for (const id of ['c1', 'c2']) {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: `${ADMIN} here 'id -u'` } as never)
    expect(await until(async () => keyed(list, `gate-${id}-0-deny`))).toBeDefined()
    expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeDefined()
    // No piece of work to allow it for: the chat's thread never ends, so it is asked each time
    expect((await list.findAll({ type: 'Button' })).map(one => one.props.label)).toContain('Allow once')
    expect((await list.findAll({ type: 'Button' })).map(one => one.props.label)).not.toContain('Allow for this task')
    await pressed(list, `gate-${id}-0-once`)
    w.wake()
    expect((await call).result).toBe('ran')
  }
  expect(w.admins.length).toBe(2)
})

test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at }], startedAt: at - 60_000, endedAt: 0, status: 'working' }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'softwareupdate -i -a' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Allow or deny it on its card in its own chat.' })).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).some(one => ['Allow once', 'Always allow this command', 'Deny'].includes(String(one.props.label)))).toBe(false)
})

test('a release whose output goes to a log asks once, for its own branch: the 15 Nov run-progress-rows release asked twice, first for a branch called ">"', async ($, on) => {
  const { list, press, files, grants, holding } = await gated($, on)
  files.set('git:top', '/repo/wt')
  files.set('git:branch', 'fix-it')
  for (const [id, tail] of [['rl1', ' > /tmp/release.log 2>&1'], ['rl2', ' 2>/tmp/release.log'], ['rl3', '>/tmp/release.log']] as const) {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold x${id}; /plug/claudopus/bin/release${tail}` } as never) as Promise<{ deny?: string; result?: unknown }>
    expect(await until(async () => keyed(list, `gate-${id}-r0-once`))).toBeDefined()
    // Said in plain words: what is released, its branch, and where from in one line
    expect(await list.find({ type: 'Text', text: 'Branch fix-it' })).toBeDefined()
    expect((await list.findAll({ type: 'Text' })).some(one => /^>|> from/.test(String(one.text ?? '')))).toBe(false)
    await press(`gate-${id}-r0-once`)
    const granted = await until(async () => (grants().length ? grants() : undefined))
    expect(granted?.map(path => (({ host, command }) => [host, command])(JSON.parse(files.get(path) ?? '{}')))).toEqual([['release', '/repo/wt\nfix-it']])
    holding.get(`x${id}; /plug/claudopus/bin/release${tail}`)?.('released')
    expect((await call).deny).toBeUndefined()
  }
})

test('a press is answered by a line, not a card: an ask is an outlined box, what was done a line with no fill or edge that goes once its call ends', async ($, on) => {
  const { press, bash, held, list, clock } = await gated($, on)
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b1')).toBeDefined()
  const boxes = async () => (await list.findAll({ type: 'Box' })) as { props: Record<string, unknown> }[]
  // The ask: an outlined box in the colour of what needs the person, the kind of ask at its top
  expect((await boxes()).some(one => one.props.borderStyle === 'round' && one.props.borderColor === '#E5A50A')).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Admin command · waits for your press' })).toBeDefined()
  await press('gate-b1-0-once')
  await call
  expect(await until(async () => list.find({ type: 'Text', text: 'You allowed it once · it runs now' }))).toBeDefined()
  const edges = async () => (await boxes()).filter(one => one.props.backgroundColor === '#8A63F0' || one.props.backgroundColor === '#80808024').length
  const withNote = await edges()
  // Its call has ended: once it could be read, it goes, well before a minute
  await clock.advance(16_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'You allowed it once · it runs now' })) ? undefined : true))).toBe(true)
  // It had no fill or purple edge of its own, as a piece of work has
  expect(await edges()).toBe(withNote)
})

// A long list of another chat's running work, two of whose cards wait on a gate and one on an ask: what the 15 Nov panel drew below
// the fold, where the person had to scroll to find Allow once
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

test('a work that waits for a press comes to the top whole, its amber box in it, the newest first with the cards that asked; answered, it goes back and nothing else moves', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }, { w4: at - 1500 }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
  const texts = await textOrder(list)
  const first = (text: string) => texts.indexOf(text)
  // Newest first: the card whose gate came last, the card that asked, the older gate's card; then the rest in the order they began
  expect(first('Card six')).toBeLessThan(first('Card four'))
  expect(first('Card four')).toBeLessThan(first('Card five'))
  expect(first('Card five')).toBeLessThan(first('Card one'))
  // Each gate is in its own card, right under its title, never apart from it
  expect(first('Card six')).toBeLessThan(first('run step six'))
  expect(first('run step six')).toBeLessThan(first('Card four'))
  expect(first('Card five')).toBeLessThan(first('run step five'))
  expect(first('run step five')).toBeLessThan(first('Card one'))
  const rest = (all: string[]) => all.filter(one => /^Card (one|two|three)$/.test(one))
  expect(rest(texts)).toEqual(['Card one', 'Card two', 'Card three'])
  // The newer gate is answered (in its own chat): its card goes back to where it began, and the others keep their order
  files.set(`${MEMORY}/live/chat-b.json`, longList(at + 6000, { w5: at - 2000 }, { w4: at - 1500 }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'run step six' })) ? undefined : true))).toBe(true)
  const after = await textOrder(list)
  expect(after.indexOf('Card four')).toBeLessThan(after.indexOf('Card five'))
  expect(after.filter(one => /^Card (one|two|three|six)$/.test(one))).toEqual(['Card one', 'Card two', 'Card three', 'Card six'])
})

test('a gate answered on its card says what was allowed in that same card, outlined green, while the card stays at the top', async ($, on) => {
  const { press, bash, held, list } = await gated($, on)
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b1')).toBeDefined()
  await press('gate-b1-0-once')
  await call
  const green = await until(async () => ((await list.findAll({ type: 'Box' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.borderStyle === 'round' && one.props.borderColor === 'success'))
  expect(green?.key).toBe('done-gate-b1-0')
  const texts = await textOrder(list)
  // In its card, under the work's title, not a line of its own at the top
  expect(texts.indexOf('Fix the hosts file')).toBeLessThan(texts.indexOf('You allowed it once · it runs now'))
  expect(texts.filter(one => one === 'You allowed it once · it runs now').length).toBe(1)
  // Under anything that still waits: another work's gate comes in, and its card is drawn above the answered one
  await $.agent.spawn({ ...spawn, description: 'Tidy the logs', prompt: 'tidy the logs' } as never)
  const call2 = bash('b2', `${ADMIN} here 'id -u'`, 'a2')
  expect(await held('b2')).toBeDefined()
  const now = await textOrder(list)
  expect(now.indexOf('Tidy the logs')).toBeGreaterThan(-1)
  expect(now.indexOf('Tidy the logs')).toBeLessThan(now.indexOf('Fix the hosts file'))
  void call2.catch(() => undefined)
})

test('scrolled down a long list, the line above the prompt says how many wait at the top, and pressed takes the list there; at the top it says nothing', async ($, on) => {
  const { files, clock } = world(on, { panes: ['claudopus'] })
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, longList(at, { w5: at - 2000, w6: at - 1000 }))
  await clock.advance(5000)
  const MARK = '↑ 2 things are waiting for you at the top of the panel'
  for (const surface of ['desktop', 'terminal']) {
    const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface } as never)
    expect(await until(async () => down.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
    const band = await $.ui.mount({ ...BAND, surface } as never)
    expect(await until(async () => band.find({ type: 'Text', text: MARK }))).toBeDefined()
    await band.unmount()
    await down.unmount()
    const top = await $.ui.mount({ ...LIST, surface } as never)
    expect(await until(async () => top.find({ type: 'Text', text: 'run step six' }))).toBeDefined()
    const still = await $.ui.mount({ ...BAND, surface } as never)
    expect(await still.find({ type: 'Text', text: MARK })).toBeUndefined()
    await still.unmount()
    await top.unmount()
  }
})

test("in the terminal, an ask that comes in above the one being typed in never takes the keys from it; the newest ask is drawn first", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two things', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  const focused = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => one.props.autoFocus).map(one => (one.key ?? '').split('-reply')[0])
  expect(await until(async () => ((await focused()).length ? focused() : undefined))).toEqual([expect.stringContaining('a1')])
  await clock.advance(2000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which ear first?', choices: ['Left', 'Right'] } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Which ear first?' }))).toBeDefined()
  const texts = await textOrder(list)
  expect(texts.indexOf('Which ear first?')).toBeLessThan(texts.indexOf('May I delete the old repo?'))
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
  expect((await textOrder(band)).some(one => one.includes('waiting for you at the top'))).toBe(false)
})

test('in the terminal, a password box that comes while a reply is being typed leaves the keys with the reply', async ($, on) => {
  const w = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two things', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
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
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
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
  if (ended) await $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: 'turn-a4', reason: 'answer', agentId: 'a4' } as never)
  await w.clock.advance(5000)
  const order = async () => (await textOrder(list)).filter(one => /^Piece \d$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  expect(await until(async () => ((await order())[0] === 'Piece 4' ? true : undefined))).toBe(true)
  return { ...w, list, order }
}

test('Release it on an ended ask leaves its card where it was, saying the answer, and the work started again keeps its place, never the end', async ($, on) => {
  const { list, order, clock, resumed } = await askingFourth($, on, ['Release it', 'Not now'], true)
  const release = ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Release it')
  await list.press({ key: release?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a4: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => list.find({ type: 'Text', text: /You answered “Release it”/ } as never))).toBeDefined()
  expect(await order()).toEqual(['Piece 4', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 5'])
  // A minute on, it takes its own place among the others: where it began, not after them
  await clock.advance(65_000)
  expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
})

const answeredStays = async ($: Parameters<TestBody>[0], on: On, how: 'press' | 'reply') => {
  const { list, order, clock } = await askingFourth($, on)
  if (how === 'press') await pressed(list, ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Done')?.key ?? '')
  else await list.input({ key: ((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).find(one => /-reply-/.test(one.key ?? ''))?.key ?? '', text: 'It is pasted' })
  expect(await until(async () => list.find({ type: 'Text', text: /You answered/ } as never))).toBeDefined()
  expect(await order()).toEqual(['Piece 4', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 5'])
  await clock.advance(30_000)
  expect((await order())[0]).toBe('Piece 4')
  // A minute on, it takes its own place among the others
  await clock.advance(35_000)
  expect(await until(async () => ((await order())[0] === 'Piece 1' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5'])
}
test('Done on an ask leaves the card at the top saying the answer for a minute, then in its own place', async ($, on) => answeredStays($, on, 'press'))
test('an answer sent from an ask\'s box leaves the card at the top saying the answer for a minute, then in its own place', async ($, on) => answeredStays($, on, 'reply'))
test('answering one of two asks at the top leaves both cards where they were, so nothing still waiting slides into the spot just pressed', async ($, on) => {
  const { list, order, clock } = await askingFourth($, on)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release piece two?', choices: ['Release it', 'Not now'] } as never)
  await clock.advance(5000)
  expect(await until(async () => ((await order())[0] === 'Piece 2' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 2', 'Piece 4', 'Piece 1', 'Piece 3', 'Piece 5'])
  // The older ask, second at the top, is answered: it stays second, the newer ask above it, and it still says the answer under the line its work then writes
  await pressed(list, ((await list.findAll({ type: 'Button' })) as { key?: string; props: Record<string, unknown> }[]).find(one => one.props.label === 'Done')?.key ?? '')
  expect(await until(async () => list.find({ type: 'Text', text: /You answered “Done”/ } as never))).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n4', agentId: 'a4', text: 'Now doing the next part' } as never)
  await clock.advance(5000)
  expect(await order()).toEqual(['Piece 2', 'Piece 4', 'Piece 1', 'Piece 3', 'Piece 5'])
  expect(await list.find({ type: 'Text', text: /You answered “Done”/ } as never)).toBeDefined()
})

// 15 Nov: Allow once was pressed and the amber box with its buttons stayed up to a second, until the gate's wait (a one-second
// sleep the engine runs) read the press; only then did the green box come
const pressedFirst = async ($: Parameters<TestBody>[0], on: On, button: 'once' | 'always' | 'deny', said: string, isRelease = false) => {
  const w = await gated($, on)
  if (isRelease) (w.files.set('git:top', '/repo/wt'), w.files.set('git:branch', 'fix-it'))
  const call = w.bash('p1', isRelease ? 'hold xp1; /plug/claudopus/bin/release' : `${ADMIN} here 'chmod 644 /etc/hosts'`)
  const base = `gate-p1-${isRelease ? 'r' : ''}0-${button}`
  expect(await until(async () => keyed(w.list, base))).toBeDefined()
  // Pressed, and the wait not yet let go: the drawing that follows the press shows the answer, with nothing left to press
  await pressed(w.list, base)
  expect(await w.list.find({ type: 'Text', text: said })).toBeDefined()
  expect((await w.list.findAll({ type: 'Button' })).some(b => (b.key ?? '').startsWith('gate-p1-'))).toBe(false)
  expect(await w.list.find({ type: 'Text', text: /· waits for your press$/ })).toBeUndefined()
  w.wake()
  if (isRelease) (await until(async () => w.holding.get('xp1; /plug/claudopus/bin/release')))?.('released')
  await call
}
test("Allow once on a gate draws it answered in the press's own drawing, before the wait reads it: green, with no buttons left", ($, on) => pressedFirst($, on, 'once', 'You allowed it once · it runs now'))
test("Always allow on a gate draws it answered in the press's own drawing", ($, on) => pressedFirst($, on, 'always', 'You always allow this command · it runs now, and will not ask again'))
test("Deny on a gate draws it answered in the press's own drawing", ($, on) => pressedFirst($, on, 'deny', "You denied it · it didn't run, and Claudopus told Claude"))
test("Allow once on a release draws it answered in the press's own drawing", ($, on) => pressedFirst($, on, 'once', 'You allowed it once · it releases now', true))

test('two presses on a gate before its wait reads them send one answer: the first, as drawn', async ($, on) => {
  const { list, bash, held, wake } = await gated($, on)
  const call = bash('d1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('d1')).toBeDefined()
  // Both keys as the panel last drew them, pressed one after the other, as a double click on a drawing a moment old does
  const once = (await keyed(list, 'gate-d1-0-once'))?.key ?? ''
  const deny = (await keyed(list, 'gate-d1-0-deny'))?.key ?? ''
  await list.press({ key: once })
  expect(await list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeDefined()
  await list.press({ key: deny }).catch(() => undefined)
  // The second press changed nothing: the card still says what the first one did
  expect(await list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeDefined()
  await list.press({ key: once }).catch(() => undefined)
  wake()
  const r = (await call) as { deny?: string }
  expect(r.deny).toBeUndefined()
  expect((await list.findAll({ type: 'Text' })).filter(t => /^You (allowed|denied|always)/.test(String(t.text ?? ''))).length).toBe(1)
  expect(await list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^You denied it/ })).toBeUndefined()
})

test('a gate allowed but not let through says so where its green box was, never a false "allowed"', async ($, on) => {
  const w = await gated($, on)
  const call = w.bash('f1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await w.held('f1')).toBeDefined()
  // The seal for the grant cannot be made, as a keychain that refuses: the command does not run
  w.files.set('keychain:refused', '1')
  await w.press('gate-f1-0-once')
  const r = (await call) as { deny?: string }
  expect(r.deny).toBeDefined()
  expect(w.grants()).toEqual([])
  expect(await until(async () => w.list.find({ type: 'Text', text: "It could not be secured · it didn't run, and Claudopus told Claude" }))).toBeDefined()
  expect(await w.list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeUndefined()
  expect(await w.list.find({ type: 'Text', text: /· allowed$/ })).toBeUndefined()
})

// Found on a second look: one Bash call with two commands to allow, the first allowed and the second refused, ran nothing yet left
// "You allowed it once" green for the first
test('a call refused after one of its commands was allowed says in grey that nothing in it ran, never green', SLOW, async ($, on) => {
  const w = await gated($, on)
  w.files.set('git:top', '/repo/wt')
  w.files.set('git:branch', 'fix-it')
  for (const [id, command, second] of [
    ['m1', `${ADMIN} here 'id -u'; ${ADMIN} here 'id -g'`, 'gate-m1-1-deny'],
    ['m2', `${ADMIN} here 'id -u'; /plug/claudopus/bin/release`, 'gate-m2-r0-deny'],
  ] as const) {
    const call = w.bash(id, command)
    expect(await w.held(id)).toBeDefined()
    await w.press(`gate-${id}-0-once`)
    expect(await until(async () => keyed(w.list, second))).toBeDefined()
    await w.press(second)
    expect(((await call) as { deny?: string }).deny).toBeDefined()
    expect(w.admins).toEqual([])
    expect(await until(async () => w.list.find({ type: 'Text', text: 'It did not run: another part of the same command was refused, so nothing in it ran' }))).toBeDefined()
    expect(await w.list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeUndefined()
  }
})
