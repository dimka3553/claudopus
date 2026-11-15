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
const SHIPPED_PRINCIPLES: string = "# How I work with Claude\n\nThese are my principles. Every chat and every piece of work carries them.\n\n## Core truths\n\n- My words are the spec. They beat Claude's earlier suggestions.\n- Solutions, not questions. Research it properly, then bring a solution with the evidence. Ask only when it needs my hands or can't be undone: one recommendation, yes or no.\n- Build only what I asked for, and name everything that was built.\n- Show me the result. My yes or no is the gate, not the agent's verdict.\n- If it can run in parallel, it runs in parallel. No ask waits behind other work.\n\n## Boundaries\n\n- A new message adds to the current work. It switches task only if I say so.\n- If the work doesn't depend on it right now, drop it.\n- A repo's own files and notes win over these principles for that repo.\n\n## Vibe\n\n- Short replies and short rules. Say it once, in general terms, without examples.\n- Before starting, say back what I want to find out and what you will show me.\n- Titles, notes, to-dos, asks and results name what is being done, never the model doing it.\n\n## Checking\n\n- Set the bar with what already exists, and show each new attempt beside it on the same input.\n- Judge a result by looking at it, not by a number.\n- Before showing me a result, have a second agent that didn't build it look for what is wrong, on a model at least as strong as the one that built it.\n- Show the first result early. After two or three failed fixes, question the approach.\n- A surprising number means checking our own code first.\n- Explore with mockups and tests. Build for real once I say the decision is final.\n\n## Continuity\n\n- Context lives in files. Chats are disposable and stay small.\n- Read files in one batch. Send big searches and outputs to helpers.\n- Search with rg, and use rg -a for packed app files.\n- Each session works on its own branch and ends with what shipped and what's left.\n"
// The prompt each piece of work started with, as the mod left it
const prompts: string[] = []

// A release on GitHub as the test world gives it: its version, commit and the tree it published; `got` a different tree that came
// down instead, `manifest` a different version in it, `online` a newer commit online, and a fetch that fails, a folder with commits of its
// own, or uncommitted changes the move would overwrite
type Release = { version: string; commit: string; tree: string; got?: string; manifest?: string; online?: string; fetchFails?: boolean; ownCommits?: boolean; overwrite?: boolean; worktree?: boolean }
// The world beneath the mod: files in memory, the app's session tools, a cheap model
const world = (on: On, options: { tailscale?: string; reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string; drawings?: (name: string) => string | undefined; headless?: boolean; shipped?: boolean; narrow?: { isPressing: boolean }; jobs?: { output: (file: string) => string; wroteAt: (file: string) => number; ps?: () => string; fd?: () => string }; usage?: (script: string) => string; startedOn?: Record<string, string>; release?: Release } = {}) => {
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
    return { value: { kind, size: 1, mtimeMs: 0, isLink: false } as never }
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
      return ok(`${asked.map(file => `\n@@JOB@@ ${Math.floor((options.jobs?.wroteAt(file) ?? 0) / 1000)} ${file}\n${options.jobs?.output(file) ?? ''}`).join('')}\n@@ALIVE@@${pids.map(p => ` ${p}`).join('')}\n${ps}`)
    }
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
    if (tool === 'kill') killed.push(String(rest[0]))
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
      if (args[0] === 'symbolic-ref') return ok(release.worktree ? 'fix-bar\n' : 'main\n')
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
    const resume = (e as { resume?: { agentId?: string } }).resume
    // The model an agent's own type starts it on, by its task's few words, as Explore starts on Haiku
    return { model: options.startedOn?.[e.description ?? ''] ?? options.model ?? 'm', agentId: resume?.agentId ?? `a${(spawned += 1)}` } as never
  })
  on('agent.list', () => ({ value: Object.entries(options.agents ?? {}).map(([id, status]) => ({ id, description: 'Listed by the engine', type: options.kinds?.[id] ?? 'fork', status })) as never }))
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

  return { files, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, resumed, clock, copied, stepped, played, notified, osa, own, shown, dropped, terminals, sshed, events, held, keychain, admins, wake, gitRan, backgrounds, agentModels, asked }
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

// The asking card: an ask, its Copy, buttons and reply box

const GITHUB_BOX = "Claudopus needs GITHUB_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print."
const NPM_BOX = "Claudopus needs NPM_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print."
const ADMIN_BOX = 'Claudopus needs the admin password of this Mac to run the admin command below. Nothing is kept: it goes only to that command, and the next one asks again.'

test('work that needs the person\'s hands asks: its card stands out first with the ask, the text to paste with its Copy, and answers that go back to it', async ($, on) => {
  // Once its run has ended, a work's chat takes no more lines
  const ended = new Set<string>()
  const { played, notified, appended, terminals, submitted, resumed, shown, files } = world(on, { ended })
  const clip: string[] = []
  on('ui.copy', (_, e) => (clip.push(e.text), { value: { isCopied: true } }) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'Paste this code on the GitHub page that opened.', copy: 'ABCD-1234' } as never)
  expect(asked.result).toContain('Shown on your card')
  expect(played.length).toBeGreaterThan(0)
  expect(notified).toContain('Check the ears needs you | Paste this code on the GitHub page that opened.')
  const titles = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  expect(titles.indexOf('Check the ears')).toBeGreaterThan(-1)
  expect(titles.indexOf('Check the ears')).toBeLessThan(titles.indexOf('Hide the repo'))
  expect((await list.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' }))?.props.color).toBe('#E5A50A')
  // The code is shown with one Copy button, which puts it on the clipboard and says so
  expect((await list.find({ type: 'Text', text: 'ABCD-1234' }))?.props.mono).toBe(true)
  await pressed(list, 'ask-a2-copy')
  expect(clip).toEqual(['ABCD-1234'])
  expect((await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Copied')))).toBeDefined()
  // Its Details tab has it at the top, and clearing it takes it away
  const ears = await $.ui.mount({ ...LIST, requestId: 'work-a2', surface: 'desktop' } as never)
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: '' } as never)
  expect(await list.find({ type: 'Text', text: 'ABCD-1234' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()

  // An ask for a go-ahead carries buttons; the one pressed goes back to the work and the ask goes
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  const approve = (await ears.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')
  expect(approve).toBeDefined()
  await ears.press({ key: approve?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Approve"')))).toContain('May I delete the old repo?')
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')).toBeUndefined()
  // Or a reply in the person's own words, right on the small card: the reply goes to the work. One that is none of the ask's buttons,
  // such as a question back, does not settle it: the ask stays with the reply under it, and its answers go, as the person has answered
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(false)
  expect((await ears.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box?.props.placeholder).toBe('Or reply in your own words')
  await list.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  const toWork = (await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))) ?? ''
  expect(toWork).toContain('Submit it to the plugin directory.')
  expect(toWork).toContain('does not settle your ask by itself')
  // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
  // and no buttons, box or send, on the small card and in Details
  expect((await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' }))?.props.color).toBe('#8A63F0')
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()
  expect(await ears.find({ type: 'Text', text: 'Acting on your reply' })).toBeDefined()
  for (const pane of [list, ears]) {
    expect((await pane.findAll({ type: 'Button' })).some(b => b.props.label === 'Submitted' || b.props.label === 'Not now')).toBe(false)
    expect((await pane.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  }
  const waiting = '✓ You replied “Where do I do that?” · it reads this at its next step'
  expect(await until(async () => list.find({ type: 'Text', text: waiting }))).toBeDefined()
  expect(await until(async () => ears.find({ type: 'Text', text: waiting }))).toBeDefined()
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Where do I do that?” · it is acting on it' }))).toBeDefined()
  // The work asks again: amber again, with its answers back and an empty box
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5b', agentId: 'a2', text: 'It is under Manage, then Submit new. Done?' } as never)
  expect((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' }))?.props.color).toBe('#E5A50A')
  // With no buttons of its own, every ask offers Done and Not now
  const labels = (await list.findAll({ type: 'Button' })).map(b => b.props.label)
  expect(labels).toContain('Done')
  expect(labels).toContain('Not now')
  const again = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(again?.key).not.toBe(box?.key)
  expect(again?.props.value ?? '').toBe('')
  // Half a reply typed, then Done pressed twice: the answer goes once, and the half reply is not left for the next ask
  await list.input({ key: again?.key ?? '', text: 'Not y', kind: 'change' } as never)
  const done = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? ''
  await Promise.all([list.press({ key: done }), list.press({ key: done }).catch(() => undefined)])
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('"Done"')))).toContain('Submit new. Done?')
  expect(appended.filter(line => line.startsWith('a2: ') && line.includes('"Done"'))).toHaveLength(1)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Done” · it reads this at its next step' }))).toBeDefined()
  // A newer line from the work takes the answer's place
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I submitted it.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I submitted it.' }))).toBeDefined()
  // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' } as never)
  ended.add('a2')
  const box3 = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box3?.props.value ?? '').toBe('')
  await list.input({ key: box3?.key ?? '', text: 'claudopus' })
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('in their own words: claudopus')))).toContain('this answer starts you again')
  expect(submitted.some(line => line.includes('claudopus'))).toBe(false)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “claudopus” · it reads this at its next step' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Tell me the repo name.' })).toBeUndefined()
  // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: 'Open the plugin directory and submit the form.', copy: 'Open the plugin directory page and fill in the form with the details' } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Copy')).toBe(false)
  // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k7', agentId: 'a2', text: 'Open https://claude.ai/directory/manage, press Submit new, and paste the repository.', copy: 'https://github.com/dimka3553/claudopus' } as never)
  const hrefs = async (pane: typeof list) => (await pane.findAll({ type: 'Link' })).map(one => one.props.href)
  expect(await until(async () => ((await hrefs(list)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)
  expect(await hrefs(list)).toContain('https://github.com/dimka3553/claudopus')
  expect(await until(async () => ((await hrefs(ears)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)

  // A command for the person to type is shown with its Copy and an Open in Terminal button; nothing opens by itself, and the work
  // is told to open none
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub.', command: "gh auth login --hostname 'github.com'", cwd: '/repo/site' } as never)
  expect(told.result).not.toContain('mcp__terminal__open_terminal_tab')
  expect(told.result).toContain('Do not open a terminal for it')
  expect((await list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login --hostname 'github.com'" }))?.props.mono).toBe(true)
  expect(terminals).toEqual([])
  const openedBefore = shown.length
  const openIn = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')
  expect(openIn).toBeDefined()
  expect(shown.length).toBe(openedBefore)
  // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
  await list.press({ key: openIn?.key ?? '' })
  const opened = await until(async () => shown.slice(openedBefore).find(argv => String(argv[1]).endsWith('/open.command')))
  const home = String(opened?.[1]).replace(/\/open\.command$/, '')
  expect(files.get(`${home}/command.txt`)).toBe("cd '/repo/site' && gh auth login --hostname 'github.com'")
  expect(files.get(`${home}/.zshrc`)).toContain('print -rz -- "$(<"$_claudopus_here/command.txt")"')
  expect(files.get(`${home}/.zshrc`)).toContain("cd '/repo/site'")
  expect(files.get(`${home}/open.command`)).toContain('exec /bin/zsh -i')
  // Their own history file, and their own start files where their .zshenv moves them
  expect(files.get(`${home}/.zshrc`)).toContain('HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"')
  expect(files.get(`${home}/.zshenv`)).toContain('_CLAUDOPUS_DOT="$ZDOTDIR"')
  expect(await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === '✓ Opened in Terminal, typed, not run'))).toBeDefined()
  expect(terminals).toEqual([])
  // A folder with a quote in its name is quoted whole
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a2', text: 'Run it here.', command: 'make', cwd: "/repo/it's here" } as never)
  const before2 = shown.length
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')?.key ?? '' })
  const second = await until(async () => shown.slice(before2).find(argv => String(argv[1]).endsWith('/open.command')))
  expect(files.get(String(second?.[1]))).toContain("cd '/repo/it'\\''s here'")

  // A reply written into work that then ends without another step was never read: it starts the work again
  ended.delete('a2')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main', 'Not now'] } as never)
  const box4 = (await ears.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await ears.input({ key: box4?.key ?? '', text: 'main' })
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' }))).toBeDefined()
  await $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' } as never)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('you ended before reading it: main')))).toContain('Which branch?')
  expect(submitted.some(line => line.includes('Which branch?'))).toBe(false)
  expect(await until(async () => ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' }))).toBeDefined()
  await Promise.all([list.unmount(), ears.unmount()])
})

test('while the person types into an ask the panel holds its drawing whole, as other cards move, start and finish around it: the 15 Nov panel that jumped to its bottom and flickered with every letter typed', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Keep digging for head CTs', prompt: 'dig' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which source next?', details: 'A long explanation.\n\n- one\n- two\n- three', choices: ['Kaggle', 'TCIA', 'Not now'] } as never)
  for (const surface of ['desktop', 'terminal'] as const) {
    const list = await $.ui.mount({ ...LIST, surface } as never)
    const ears = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    await clock.advance(2000)
    const drawing = async (pane: typeof list) => JSON.stringify([...(await pane.findAll({ type: 'Text' })).map(one => one.text), ...(await pane.findAll({ type: 'Input' } as never)).map(one => [one.key, one.props.value])])
    const box = (await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))
    expect(box).toBeDefined()
    const [before, beforeDetails] = [await drawing(list), await drawing(ears)]
    // Each letter is one change: none of them draws the panel again, nor Details
    for (const text of ['N', 'No', 'Non', 'Non-A']) await list.input({ key: box?.key ?? '', text, kind: 'change' } as never)
    expect(await drawing(list)).toBe(before)
    // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `n-${surface}`, agentId: 'a2', text: `I am measuring the left ear on the ${surface}.` } as never)
    await clock.advance(3000)
    await list.input({ key: box?.key ?? '', text: 'Non-Asian', kind: 'change' } as never)
    expect(await drawing(list)).toBe(before)
    expect(await drawing(ears)).toBe(beforeDetails)
    // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
    await $.agent.spawn({ ...spawn, description: `Find more scans ${surface}`, prompt: 'more' } as never)
    expect(await until(async () => list.find({ type: 'Text', text: `Find more scans ${surface}` }))).toBeDefined()
    expect((await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))?.props.value).toBe('')
    // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
    await clock.advance(31_000)
    expect(await until(async () => list.find({ type: 'Text', text: `I am measuring the left ear on the ${surface}.` }))).toBeDefined()
    expect((await list.findAll({ type: 'Input' } as never)).find(one => /^ask-a1-reply-/.test(one.key ?? ''))?.props.value).toBe('Non-Asian')
    // A press is the person's own move: it lets the panel go at once
    await list.input({ key: box?.key ?? '', text: 'Non-Asian heads', kind: 'change' } as never)
    await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: `m-${surface}`, agentId: 'a2', text: `Both ears done on the ${surface}.` } as never)
    await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'TCIA')?.key ?? '' })
    expect(await until(async () => list.find({ type: 'Text', text: `Both ears done on the ${surface}.` }))).toBeDefined()
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${surface}`, agentId: 'a1', text: 'Which source next?', choices: ['Kaggle', 'TCIA', 'Not now'] } as never)
    await Promise.all([list.unmount(), ears.unmount()])
  }
})

test("while the person types into a card's reply box the list's running times stand still, and move again once they stop", async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const time = async () => (await list.findAll({ type: 'Text' })).map(one => one.text).find(text => /\d+s$/.test(text ?? ''))
  await clock.advance(2000)
  const before = await time()
  expect(before).toBeDefined()
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'The le', kind: 'change' } as never)
  await clock.advance(5000)
  expect(await time()).toBe(before)
  // Typing stopped for half a minute: the times move again, and the draft is still in the box
  await clock.advance(31_000)
  expect(await until(async () => ((await time()) !== before ? true : undefined))).toBe(true)
  expect((await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))?.props.value).toBe('The le')
  await list.unmount()
})

test('with work running and nobody typing, the panel is drawn again at once for anything new, but for its running times alone only every ten seconds, so a button under the pointer keeps its hover and takes its click', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I go on?', choices: ['Approve', 'Not now'] } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const texts = async () => JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await clock.advance(1000)
  const before = await texts()
  await clock.advance(3000)
  expect(await texts()).toBe(before)
  // The work writes a line: drawn at once
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'I am looking at the left ear.' }))).toBeDefined()
  // and its time moves again within ten seconds
  const after = await texts()
  await clock.advance(11_000)
  expect(await until(async () => ((await texts()) !== after ? true : undefined))).toBe(true)
  // A press shows what it did at once
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key ?? '' })
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'May I go on?' })) ? undefined : true))).toBe(true)
  // and so does one that only opens a part of the panel, Finished, with work ended and other work running
  await $.agent.spawn({ ...spawn, description: 'Check the nose', prompt: 'nose' } as never)
  await $.turn.complete({ answer: 'Nose checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(12_000)
  const shut = await texts()
  await pressed(list, 'finished-fold')
  expect(await until(async () => ((await texts()) !== shut ? true : undefined))).toBe(true)
  await list.unmount()
})

test('a key box keeps what is typed in it without drawing it back, and holds the panel while it is typed into', async ($, on) => {
  const { clock, files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'get the data', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Get the data', prompt: 'data' } as never)
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret SAMPLE_USER here fetch' } as never).catch(() => undefined)
  const id = '3f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'SAMPLE_USER', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  expect(field).toBeDefined()
  if (!field) return
  // The surface keeps the letters itself: the box is drawn with no value, so a drawing never puts older letters over newer ones
  expect(field.props.value).toBeUndefined()
  const before = JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))
  await list.input({ key: field.key ?? '', text: 'made-up-na', kind: 'change' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am waiting for the made-up name.' } as never)
  await clock.advance(3000)
  expect(JSON.stringify((await list.findAll({ type: 'Text' })).map(one => one.text))).toBe(before)
  expect((await list.findAll({ type: 'Input' } as never)).find(one => one.key === field.key)).toBeDefined()
  await list.unmount()
})

test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', SLOW, async ($, on) => {
  const { submitted, resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run this to restart that chat yourself.', command: 'ssh m4 tmux respawn-pane -k -t claude' } as never)
  await $.turn.complete({ answer: 'I could not restart it; the command is on your card.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  // Long after it finished, the ask is still there, amber, with its Done and Not now and its button for Terminal
  await clock.advance(10 * 60_000)
  expect((await until(async () => list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })))?.props.color).toBe('#E5A50A')
  const labels = (await list.findAll({ type: 'Button' })).map(b => b.props.label)
  expect(labels).toContain('Done')
  expect(labels).toContain('Not now')
  expect(labels).toContain('Open in Terminal')
  // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Done')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Done"') && line.includes('Run this to restart that chat yourself.')))).toBeDefined()
  expect(submitted.some(line => line.includes('Run this to restart'))).toBe(false)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test('a press on one ended work\'s ask leaves the other asks\' buttons where they were: the 14 Nov "Release it" pressed from a phone right after another card\'s, on the keys it last drew, which ran nothing', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'two releases', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Linux support', prompt: 'linux' } as never)
  await $.agent.spawn({ ...spawn, description: 'Azure route', prompt: 'azure' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  for (const [id, text] of [['a1', 'Release Linux support?'], ['a2', 'Release the Azure route?']]) {
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${id}`, agentId: id, text, choices: ['Release it', 'Not now'] } as never)
    await $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: `turn-${id}`, reason: 'answer', agentId: id } as never)
  }
  await clock.advance(60_000)
  // The keys as the late surface last drew them, both cards amber with their buttons
  const drawn = await until(async () => {
    const releases = (await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Release it')
    return releases.length === 2 ? releases.map(b => b.key ?? '') : undefined
  })
  const linux = drawn?.find(key => key.startsWith('ask-a1-')) ?? ''
  const azure = drawn?.find(key => key.startsWith('ask-a2-')) ?? ''
  expect(linux && azure).toBeTruthy()
  await list.press({ key: linux })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
  await list.press({ key: azure }).catch(() => undefined)
  expect(await until(async () => resumed.find(line => line.startsWith('a2: ') && line.includes('pressed "Release it"') && line.includes('Release the Azure route?')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Release the Azure route?' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test('a reply in words that does not settle an ask keeps it, and the card active, with nothing to press while the work acts on it, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', async ($, on) => {
  const { resumed, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'second round of terminal fixes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Terminal look, second round', prompt: 'second round of terminal fixes' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Release the second round of terminal fixes?'
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  const isFinished = async () => (await labels()).some(label => label.includes('Finished')) || (await texts()).some(text => text.startsWith('Finished'))
  // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release it? (Answers: Release it / Not now.) Built, tested and checked; nothing is released.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => list.find({ type: 'Text', text: ASK }))).toBeDefined()
  expect(await labels()).toContain('Release it')
  // The person replies in their own words, asking for something first: the work is started again with it and told the ask stays
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Show me images first.' })
  const told = (await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('in their own words: Show me images first.')))) ?? ''
  expect(told).toContain('does not settle your ask by itself')
  expect(told).toContain('this answer starts you again')
  // The card stays among the running cards, at work, with its question and the reply under it, and no buttons, box or send;
  // nothing is under Finished
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You replied “Show me images first.” · it reads this at its next step' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  expect(await labels()).not.toContain('Release it')
  expect((await list.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
  // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
  // time with the same reply
  await $.turn.complete({ answer: 'Release it? (Answers: Release it / Not now.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  expect(await labels()).toContain('Release it')
  expect((await list.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  // and its box is a new one, empty: the surface would put the sent words back into a box it found again by its old key
  const back = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(back?.key).not.toBe(box?.key)
  expect(back?.props.value).toBe('')
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  expect(resumed.filter(line => line.startsWith('a1: '))).toHaveLength(1)
  // More words from the person keep it open still; Release it settles it, and the card finishes once the work has acted on it
  const box2 = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box2?.key ?? '', text: 'And the narrow window too, please.' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('the narrow window too')))).toBeDefined()
  await $.turn.complete({ answer: 'Here is the narrow window.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await list.find({ type: 'Text', text: ASK })).toBeDefined()
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect((await until(async () => ((await isFinished()) ? undefined : true))) ?? JSON.stringify([...(await labels()), ...(await texts())])).toBe(true)
  await $.turn.complete({ answer: 'Released as 0.2.77.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => ((await isFinished()) ? true : undefined))).toBe(true)
  await list.unmount()
})

test('once the person has answered, by a button or in their own words, the card keeps no buttons, box or send; the same ask asked again comes back fresh, in the panel and the chat: the 14 Nov "I would say maybe stop it" to "Should I stop the depth job?"', async ($, on) => {
  const { appended, logged, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'why the M4 is stuck', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Why the M4 is stuck', prompt: 'why the M4 is stuck' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const ASK = 'Should I stop the depth job on your other Mac?'
  const DETAILS = 'Your other Mac is using 42 of its 44 GB of swap.'
  const inputs = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => /-reply-/.test(one.key ?? ''))
  const labels = async () => (await list.findAll({ type: 'Button' })).map(b => String(b.props.label))
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => logged.find(line => line.includes(ASK)))).toBeDefined()
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  // Typed in their own words: purple at once, the question with the reply under it, and no buttons, box, send or details
  const [box] = await inputs()
  await list.input({ key: box?.key ?? '', text: 'I would say maybe stop it and then tell it to release it' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('maybe stop it')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#8A63F0' ? true : undefined))).toBe(true)
  expect(await list.find({ type: 'Text', text: /^✓ You replied “I would say maybe stop it/ })).toBeDefined()
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  expect(await list.find({ type: 'Text', text: DETAILS })).toBeUndefined()
  // The chat is told it acts on the reply, not that it still asks
  const toChat = (await until(async () => logged.find(line => line.includes('replied to the work "Why the M4 is stuck"')))) ?? ''
  expect(toChat).toContain('asks again if it still needs')
  expect(toChat).not.toContain('It still asks')
  // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#E5A50A' ? true : undefined))).toBe(true)
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  const [again] = await inputs()
  expect(again?.props.value ?? '').toBe('')
  expect(again?.key).not.toBe(box?.key)
  expect(await list.find({ type: 'Text', text: /^✓ You replied/ })).toBeUndefined()
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 2 ? true : undefined))).toBe(true)
  // A button pressed: the ask goes whole, nothing left to press or type
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Stop it"')))).toBeDefined()
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Stop it” · it reads this at its next step' }))).toBeDefined()
  // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 3 ? true : undefined))).toBe(true)
  await $.prompt.submit({ text: 'Show me the swap first', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their reply: “Show me the swap first”' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: ASK }))?.props.color === '#8A63F0' ? true : undefined))).toBe(true)
  expect((await labels()).filter(label => label === 'Stop it' || label === 'Not now')).toEqual([])
  expect(await inputs()).toEqual([])
  await clock.advance(1000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] } as never)
  expect(await until(async () => (logged.filter(line => line.includes(ASK) && !line.startsWith('✓')).length === 4 ? true : undefined))).toBe(true)
  expect(await labels()).toEqual(expect.arrayContaining(['Stop it', 'Not now']))
  expect((await inputs()).length).toBe(1)
  await list.unmount()
})

test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with its question and no buttons; stopped again it is amber with them: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', async ($, on) => {
  // What the engine lists of the work, as the terminal's engine does: running while it waits on a command it left running
  const agents: Record<string, string> = {}
  const { resumed, clock } = world(on, { agents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'clip wallet versus affiliate', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clipify affiliate versus clip wallet', prompt: 'clip wallet versus affiliate' } as never)
  const ASK = 'Release PR 54 to production?'
  const AMBER = '#E5A50A'
  const isPurple = (colour: unknown) => /^#(8A63F0|6E3CFF)/i.test(String(colour))
  const desk = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  // The edge of the card beside its title, in each drawing: amber, purple or green
  const edges = async (pane: typeof desk) => (await pane.findAll({ type: 'Box' })).map(b => b.props.backgroundColor).filter(c => c === AMBER || isPurple(c))
  // The terminal's panel and band are drawn afresh for each look, as a terminal draws them
  const inTerminal = async <T,>(of: typeof BAND | typeof LIST, read: (pane: typeof desk) => Promise<T>) => {
    const pane = await $.ui.mount({ ...of, surface: 'terminal' } as never)
    const got = await read(pane)
    await pane.unmount()
    return got
  }
  const look = async () => ({
    desk: (await desk.find({ type: 'Text', text: ASK }))?.props.color,
    term: await inTerminal(LIST, async pane => (await pane.find({ type: 'Text', text: ASK }))?.props.color),
    // The band's ask is a line of its own inside the line that names the work
    band: await inTerminal(BAND, async pane => (await pane.findAll({ type: 'Text' })).find(t => t.text === ASK && t.props.color)?.props.color),
    deskEdges: await edges(desk),
    termEdges: await inTerminal(LIST, edges),
    buttons: [await desk.findAll({ type: 'Button' }), await inTerminal(LIST, pane => pane.findAll({ type: 'Button' })), await inTerminal(BAND, pane => pane.findAll({ type: 'Button' }))].map(all => all.map(b => b.props.label)),
    heading: (await details.find({ type: 'Text', text: 'Needs you now' })) ? 'needs' : (await details.find({ type: 'Text', text: 'Acting on your reply' })) ? 'acting' : 'none',
  })
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] } as never)
  await $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.)', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  // Before the reply: it waits on the person, amber everywhere
  const before = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && l.deskEdges.includes(AMBER) && l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(before ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  // The reply in words starts it again: purple while it acts on it, its question still there and nothing to press, in the panel,
  // in Details, in the terminal's panel and in its band
  const box = (await desk.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await desk.input({ key: box?.key ?? '', text: 'Explain to me the exact differences first.' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('Explain to me the exact differences first.')))).toBeDefined()
  const acting = await until(async () => {
    const l = await look()
    return isPurple(l.desk) && isPurple(l.term) && isPurple(l.band) && l.heading === 'acting' ? l : undefined
  })
  expect(acting ?? (await look())).toMatchObject({ heading: 'acting' })
  const now = await look()
  expect(now.deskEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.termEdges.filter(c => c === AMBER)).toEqual([])
  expect(now.deskEdges.some(isPurple)).toBe(true)
  expect(now.termEdges.some(isPurple)).toBe(true)
  for (const labels of now.buttons) expect(labels.filter(label => label === 'Release it' || label === 'Not now')).toEqual([])
  expect((await details.findAll({ type: 'Button' })).some(b => b.props.label === 'Release it')).toBe(false)
  expect((await details.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(false)
  // Its turn ends while a command it started in the background still runs, the engine listing it as running: it has not stopped,
  // and stays purple
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Writing up the differences.', durationMs: 1, isAborted: false, turnId: 'turn-2a', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  const held = await look()
  expect([isPurple(held.desk), isPurple(held.term), isPurple(held.band), held.heading]).toEqual([true, true, true, 'acting'])
  agents.a1 = 'completed'
  // The header counts it as running, not as needing the person
  expect(await desk.find({ type: 'Text', text: 'Working on 1 thing' })).toBeDefined()
  // It stops again with the ask still open, the engine listing it as running for a moment as its turn ends: amber again a moment
  // later, once the engine lists its run as over
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.) The differences are…', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  // Listed as idle after, as the engine lists some ended work
  agents.a1 = 'idle'
  await clock.advance(2_000)
  const after = await until(async () => {
    const l = await look()
    return l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && !l.deskEdges.some(isPurple) && !l.termEdges.some(isPurple) ? l : undefined
  })
  expect(after ?? (await look())).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' })
  for (const labels of (await look()).buttons) expect(labels).toEqual(expect.arrayContaining(['Release it', 'Not now']))
  expect(await desk.find({ type: 'Text', text: '1 thing needs you' })).toBeDefined()
  // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
  await desk.press({ key: (await desk.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  expect(await until(async () => ((await desk.find({ type: 'Text', text: ASK })) ? undefined : true))).toBe(true)
  const released = await until(async () => {
    const l = await look()
    return l.deskEdges.some(isPurple) && !l.deskEdges.includes(AMBER) && l.termEdges.some(isPurple) && !l.termEdges.includes(AMBER) ? l : undefined
  })
  expect(released ?? (await look())).toMatchObject({ desk: undefined })
  expect(released?.heading).toBe('none')
  // Releasing in the background, its turn ends with the engine still holding it: at work, purple, until it is done
  agents.a1 = 'running'
  await $.turn.complete({ answer: 'Releasing in the background.', durationMs: 1, isAborted: false, turnId: 'turn-3a', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  expect((await edges(desk)).some(isPurple)).toBe(true)
  agents.a1 = 'completed'
  await $.turn.complete({ answer: 'Released PR 54.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(60_000)
  expect(await until(async () => ((await edges(desk)).some(isPurple) ? undefined : true))).toBe(true)
  for (const pane of [desk, details]) await pane.unmount()
})

test('every ask also shows in the chat as the mod\'s notice, never as the person\'s message, with its answers and pictures; an answer typed there reaches the work and the card stops asking', async ($, on) => {
  const { appended, submitted, logged, files, clock } = world(on)
  files.set('/w/shots/a.png', 'png')
  files.set('/w/shots/b.png', 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'redraw the logo', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Redraw the logo', prompt: 'redraw the logo' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png', '/w/shots/gone.png', 'rel.png'] } as never)
  expect(String(asked.result)).toContain('shown in the chat as a notice from the panel')
  expect(String(asked.result)).toContain('Its 2 pictures are drawn small on the card')
  expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here')
  // The chat shows the ask as the mod's notice, never a prompt in the person's place, with what it asks, its answers and its pictures
  await clock.advance(10)
  const inChat = (await until(async () => logged.find(line => line.includes('Which logo do you want?')))) ?? ''
  expect(submitted.some(line => line.includes('Which logo do you want?'))).toBe(false)
  expect(inChat).toContain('The work "Redraw the logo" needs the person: Which logo do you want?')
  expect(inChat).toContain('Answers: A · B, or a reply in the person\'s own words, here or on its card.')
  expect(inChat).toContain('Pictures: /w/shots/a.png, /w/shots/b.png')
  // The chat's model reads the ask, and how to pass an answer on, in a row the person does not see
  expect(inChat).not.toContain('SendMessage')
  const relay = appended.find(line => line.startsWith('undefined: The background work "Redraw the logo" asked the person')) ?? ''
  expect(relay).toContain('Which logo do you want? (answers: A · B; pictures: /w/shots/a.png, /w/shots/b.png)')
  expect(relay).toContain('do not pass it on')
  expect(relay).toContain('SendUserFile')
  // Pictures sent as "proactive" did not show in the chat; "normal" ones did
  expect(relay).toContain('status "normal"')
  expect(relay).not.toContain('proactive')
  expect(relay).toContain('SendMessage to "a1"')
  // The same ask said again is not sent again
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png'] } as never)
  await clock.advance(10)
  expect(logged.filter(line => line.includes('Which logo do you want?'))).toHaveLength(1)

  // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
  await $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Which logo do you want?' })) ? undefined : true))).toBe(true)
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your ask: \"Which logo do you want?\"")))).toBeDefined()
  expect(appended.some(line => line.includes('Decide which of three it is'))).toBe(false)
  // A press on the card no longer counts for that ask
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'B')).toBeUndefined()

  // An ask answered on the card is said in the chat, which sees and reads it; one the work withdraws is said too
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push', 'Not now'] } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('May I push it?')) || undefined)).toBe(true)
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Push')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ✓ The person answered the work "Redraw the logo" on its card: “Push”')))).toBeDefined()
  expect(logged.some(line => line.startsWith('✓ The person answered the work "Redraw the logo" on its card: “Push”'))).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' } as never)
  await clock.advance(10)
  expect(await until(async () => logged.some(line => line.includes('Answers: Done · Not now')) || undefined)).toBe(true)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' } as never)
  expect(appended.some(line => line === 'undefined: The work "Redraw the logo" no longer asks the person anything.')).toBe(true)
  expect(logged.some(line => line === 'The work "Redraw the logo" no longer asks the person anything.')).toBe(true)
  expect(submitted).toEqual([])
  await list.unmount()
})

test('an ask carries what it is about, whole, on the small card, in Details and in the chat: the 13 Nov "Release PR 54, with the exact differences as explained in the chat?" asked before its explanation arrived', async ($, on) => {
  const { appended, logged, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the wallet', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the wallet', prompt: 'fix the wallet' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // What happened: the ask pointed at an explanation that reached the person only with the report, after the work ended. Now it is
  // not shown at all: no card, no sound, no notice
  const away = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it', 'Not now'] } as never)
  expect(String(away.result)).toContain('Not shown: the ask points at an explanation it does not carry')
  expect(await list.find({ type: 'Text', text: /Release PR 54/ })).toBeUndefined()
  expect(notified.some(line => line.includes('Release PR 54'))).toBe(false)
  for (const text of ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text, choices: ['Release it', 'Not now'] } as never)).result)).toContain('Not shown')
  }
  // Asks about something shown, such as a code on a page or a picture, are not taken for one
  for (const text of ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?']) {
    expect(String((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `k-${text}`, agentId: 'a1', text } as never)).result)).toContain('Shown on your card')
  }
  // A go-ahead with nothing under it is shown, and said back to the work
  const bare = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it', 'Not now'] } as never)
  expect(String(bare.result)).toContain('It carries no details')
  // Asked again with its explanation: shown whole under the question on the small card and in Details
  const differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".'
  const asked = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it', 'Not now'] } as never)
  expect(String(asked.result)).toContain('what it is about under it')
  expect(String(asked.result)).not.toContain('carries no details')
  expect(await list.find({ type: 'Markdown', text: differences })).toBeDefined()
  const big = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await big.find({ type: 'Markdown', text: differences })).toBeDefined()
  // Above the prompt in the terminal, where its numbers answer it, it says there is more
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect(await band.find({ type: 'Text', text: /What it is about is in the chat above and on its card/ })).toBeDefined()
  await band.unmount()
  // The chat's notice carries it whole, before the answers, plain (no marks for bold), and so does the row the chat's model reads
  await clock.advance(10)
  const notice = (await until(async () => logged.find(line => line.includes('Release PR 54 to production?') && line.includes('What it is about')))) ?? ''
  expect(notice).toContain(`Release PR 54 to production?\nWhat it is about:\n${differences.replaceAll('**', '')}\nAnswers: Release it · Not now`)
  const relay = [...appended].reverse().find(line => line.startsWith('undefined: The background work "Fix the wallet" asked the person') && line.includes('Release PR 54 to production?')) ?? ''
  expect(relay).toContain(`what it is about, shown to the person whole with it on the card and in the notice: ${differences}`)
  // The chat is told not to say it again: the person has just read it
  expect(relay).toContain('do not repeat what it is about')
  // A pressed answer still matches the ask that carries details
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')?.key ?? '' })
  expect(await until(async () => appended.find(line => line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?')))).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: differences })).toBeUndefined()

  // A question longer than one line is cut at a word, with the whole of it at the top of its details
  const long = `Release it? ${'The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)}`.trim()
  const cutShort = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it', 'Not now'] } as never)
  expect(String(cutShort.result)).toContain('whole at the top of its details')
  expect(await big.find({ type: 'Markdown', text: long })).toBeDefined()
  const question = (await big.findAll({ type: 'Text' })).find(one => one.props.bold && String(one.text).startsWith('Release it? The refund rule'))
  expect(question).toBeDefined()
  expect(String(question?.text).length).toBeLessThanOrEqual(302)
  expect(String(question?.text)).toMatch(/[a-z.] …$/)
  // Long details: whole in Details and in the notice, cut on the small card with where the rest is, and cut in the model's row
  const many = Array.from({ length: 120 }, (_, n) => `- Line ${n + 1} of what changes on the payout screens.`).join('\n')
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it', 'Not now'] } as never)
  expect(await big.find({ type: 'Markdown', text: many })).toBeDefined()
  expect(await list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })).toBeDefined()
  await clock.advance(10)
  expect(await until(async () => logged.find(line => line.includes('Line 120 of what changes')))).toBeDefined()
  const longRelay = (await until(async () => [...appended].reverse().find(line => line.includes('Release the payout screens?') && line.includes('asked the person')))) ?? ''
  expect(longRelay).toContain('(the rest is on the card)')
  expect(longRelay).not.toContain('Line 120 of what changes')
  await big.unmount()
  await list.unmount()
})

test('an answer to ended work that cannot be started again is left in the chat as the mod\'s notice and a row its model reads, never in the person\'s place', async ($, on) => {
  const { submitted, logged, appended } = world(on, { unresumable: new Set(['a1']) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'pick a colour', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Pick a colour', prompt: 'pick a colour' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Red or blue?', choices: ['Red', 'Blue'] } as never)
  await $.turn.complete({ answer: 'Waiting on your colour.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await list.press({ key: (await until(async () => (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Blue')))?.key ?? '' })
  expect(await until(async () => logged.find(line => line.includes('answered on its card what the work "Pick a colour" asked after it ended (Red or blue?)')))).toContain('(Red or blue?): Blue')
  expect(await until(async () => appended.find(line => line.startsWith('undefined: ') && line.includes('could not be started again')))).toBeDefined()
  expect(submitted.some(line => line.includes('Blue'))).toBe(false)
  await list.unmount()
})

test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', SLOW, async ($, on) => {
  const { files, logged, keychain, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never).catch(() => undefined)
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  // The chat is told only the name, and where to type it
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('top of the Claudopus panel')
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  expect(field).toBeDefined()
  expect((await list.find({ type: 'Text', text: GITHUB_BOX }))?.props.color).toBe('#E5A50A')
  const value = 'ghp_s3cret"with\\quote'
  await list.input({ key: field?.key ?? '', text: value })
  // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
  expect(await until(async () => keychain.find(one => one.includes(id)))).toBe(`add-generic-password -U -s "claudopus-box" -a "${id}" -l "Claudopus box" -w "ghp_s3cret\\"with\\\\quote"\n`)
  expect(await until(async () => ((await list.find({ type: 'Text', text: GITHUB_BOX })) ? undefined : true))).toBe(true)
  // Nowhere else: not the chat, its saved words, the log or any file
  expect(logged.some(line => line.includes('s3cret'))).toBe(false)
  expect([...files.values()].some(text => text.includes('s3cret'))).toBe(false)
  // A curly quote from a phone's keyboard, which security would give back as hex, is not sent, and the box says why
  const third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${third}.json`, JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const curly = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${third}-field`)))
  const before = keychain.length
  await list.input({ key: curly?.key ?? '', text: 'it’s-mine' })
  expect(await until(async () => (await list.findAll({ type: 'Text' })).find(one => (one.text ?? '').startsWith('That held a line break, a curly quote')))).toBeDefined()
  // and one whose runner has stopped takes nothing
  files.delete(`${MEMORY}/boxes/${third}.json`)
  const again = (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${third}-field`))
  await list.input({ key: again?.key ?? '', text: 'plain-value-1234' })
  await clock.advance(1000)
  expect(keychain.length).toBe(before)
  // A box cancelled removes its request, which the runner takes as cancelled
  const other = '1f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${other}.json`, JSON.stringify({ id: other, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const cancel = await until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith(`box-${other}-cancel`)))
  await list.press({ key: cancel?.key ?? '' })
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${other}.json`) ? undefined : true))).toBe(true)
  // Its place says what was done, for a minute
  expect(await until(async () => list.find({ type: 'Text', text: 'You cancelled · nothing was saved, and what asked for it stops without it' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'The admin password of this Mac' })).toBeDefined()
  await clock.advance(61_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'The admin password of this Mac' })) ? undefined : true))).toBe(true)
})

test('a chat on this Mac\'s own screen asks in the panel the same way, and opens the panel for it', async ($, on) => {
  const { files, logged, keychain, clock, opened } = world(on)
  await $.session.start(start)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never).catch(() => undefined)
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('top of the Claudopus panel')
  // The chat takes the request, which tells the runner a panel asks, and brings the panel up with the field ready
  expect(opened.filter(one => one === 'claudopus').length).toBeGreaterThan(0)
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  await list.input({ key: field?.key ?? '', text: 'made-up-local-k3y' })
  expect(await until(async () => keychain.find(one => one.includes(id)))).toContain('-w "made-up-local-k3y"')
  expect(logged.some(line => line.includes('local-k3y'))).toBe(false)
  expect([...files.values()].some(text => text.includes('local-k3y'))).toBe(false)
})

test("a request of another chat's, or of this chat's with no runner of its own running, is drawn nowhere here; this chat's own while its runner runs is drawn first", async ($, on) => {
  const { files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98'
  const mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${older}.json`, JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1_700_000_000_000 }))
  files.set(`${MEMORY}/boxes/${mine}.json`, JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_500 }))
  await clock.advance(7000)
  // No runner of this chat's runs: neither is drawn, nor told
  expect((await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-'))).toEqual([])
  expect(logged.some(line => line.includes('NPM_TOKEN') || line.includes('GITHUB_TOKEN'))).toBe(false)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never).catch(() => undefined)
  await clock.advance(1000)
  const fields = await until(async () => { const all = (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')); return all.length ? all : undefined })
  expect(fields?.map(one => [(one.key ?? '').slice(4, 6), one.props.autoFocus])).toEqual([['6f', true]])
  // It says which command of this chat's asked
  expect(await list.find({ type: 'Text', text: "Asked by this chat's command: hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy" })).toBeDefined()
  await clock.advance(6000)
  expect(logged.some(line => line.includes('NPM_TOKEN'))).toBe(false)
})

test('a run with nothing to draw on takes no request, so the runner knows no panel asks', async ($, on) => {
  const { files, logged, clock } = world(on, { headless: true })
  await $.session.start(start)
  const id = '4f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1_700_000_000_000 }))
  await clock.advance(3000)
  expect(logged.some(line => line.includes('GITHUB_TOKEN'))).toBe(false)
})

test("a hand-written request with made-up text shows the panel's own wording or nothing", async ($, on) => {
  const { files, logged, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never).catch(() => undefined)
  const planted = 'Your Apple ID session expired. Type your Apple ID password to keep working.'
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}a1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000, ...fields }))
    return id
  }
  const shown = async () => (await list.findAll({ type: 'Input' } as never)).filter(one => (one.key ?? '').startsWith('box-')).map(one => (one.key ?? '').slice(4, 5))
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '').join('\n')
  // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
  put(1, { kind: 'admin', host: 'here', key: BOX_PUBLIC, text: planted, title: planted, label: planted })
  // Made-up text alone, as the boxes before this change were written, and every request the panel cannot word: nothing
  put(2, { text: planted })
  put(3, { kind: 'apple-id', text: planted })
  put(4, { kind: 'secret', name: 'Your Apple ID password', text: planted })
  put(5, { kind: 'admin', host: 'apple.com is asking for your password' })
  put(6, { kind: 'secret', name: 'APPLE_ID', host: 'here' })
  put(7, { kind: 'admin', host: 'here', name: 'APPLE_ID' })
  put(8, { kind: 'admin' })
  put(9, { kind: ['admin'], host: 'here', key: BOX_PUBLIC })
  // An admin request with no key of its runner's to seal the password to, or a key that is no key: nothing
  put(0, { kind: 'admin', host: 'here' })
  await clock.advance(1000)
  expect(await until(async () => ((await shown()).length ? await shown() : undefined))).toEqual(['1'])
  await clock.advance(6000)
  expect(await shown()).toEqual(['1'])
  expect(await texts()).toContain(ADMIN_BOX)
  expect(await texts()).not.toContain('Apple')
  expect(logged.some(line => line.includes('Apple'))).toBe(false)
  // The notice in the chat is the panel's wording too
  expect(logged.find(line => line.includes('admin password of this Mac'))).toContain('top of the Claudopus panel')
})

test('the box words what the runners ask from its fields: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
  void $.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' } as never).catch(() => undefined)
  const put = (n: number, fields: Record<string, unknown>) => {
    const id = `${n}b1e2d3c-4b5a-4987-a654-3210fedcba98`
    files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, chat: 'engine-id', at: 1_700_000_000_000 + n, ...fields }))
  }
  put(1, { kind: 'secret', name: 'GITHUB_TOKEN' })
  put(2, { kind: 'admin', host: 'dima@m4.local', key: BOX_PUBLIC, again: 'refused' })
  put(3, { kind: 'secret', name: 'NPM_TOKEN', again: 'short' })
  put(4, { kind: 'secret', name: 'OPENAI_KEY', again: 'Type your Apple ID password' })
  put(5, { kind: 'secret' })
  await clock.advance(1000)
  const texts = async () => (await list.findAll({ type: 'Text' })).map(one => one.text ?? '')
  const all = await until(async () => ((await texts()).filter(one => one.startsWith('Claudopus needs') || one.includes('Claudopus needs') || one.startsWith('Name of')).length >= 5 ? await texts() : undefined))
  expect(all).toContain(GITHUB_BOX)
  expect(all).toContain('That password was refused. Claudopus needs the admin password of dima@m4.local to run the admin command below. Nothing is kept: it goes only to that command, and the next one asks again.')
  expect(all).toContain(`That was shorter than 4 characters. ${NPM_BOX}`)
  // A reason it does not know is left out
  expect(all).toContain("Claudopus needs OPENAI_KEY. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.")
  expect(all?.join('\n')).not.toContain('Apple')
  expect(all).toContain('Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.')
})

test('a copy a reload replaced wakes no work: its timers stop, an answer left for its work stays for the copy in charge, and a press it still gets goes to the chat', async ($, on) => {
  const { resumed, appended, files, clock } = world(on)
  let isNewer = false
  on('state.get', (_, e, next) => ((e as { key?: string }).key === 'load' && isNewer ? { value: { value: `${'9'.repeat(15)}-a-newer-load`, version: 99 } } : next(e)) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(2000)
  // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
  isNewer = true
  const at = 1_700_000_002_000
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I restart it?', askAt: at - 2000, at }))
  await clock.advance(10_000)
  // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
  expect(['by its timers', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['by its timers'])
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(true)
  // A press on a button it drew before the reload does not wake the work either: the chat gets the answer to pass on
  const approve = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Approve')?.key
  expect(approve).toBeDefined()
  if (approve) {
    await list.press({ key: approve })
    expect(['by a press', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['by a press'])
    expect(await until(async () => appended.find(line => line.includes('Approve') && line.includes('May I restart it?')))).toBeDefined()
  }
  await list.unmount()
})

test('F-013 · an answer another chat left in a file for ended work wakes nothing: it is put away unread, and only a press in this chat answers', async ($, on) => {
  const { resumed, files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', askAt: 1_700_000_000_000, at: 1_700_000_000_000 }))
  await clock.advance(6000)
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(false)
  await $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })
  await clock.advance(12_000)
  expect(resumed.filter(line => line.startsWith('a1: '))).toEqual([])
  expect(files.get(`${MEMORY}/log.md`)).toContain('put away unread')
})

test('in a chat run from another Mac a command for the person is given whole, with its folder, and nothing offers to open a terminal here', async ($, on) => {
  const { terminals, shown } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'sign me in', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Sign in', prompt: 'sign me in' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A relative path with no folder named is not shown: it would be typed somewhere else, where it does not exist
  const bare = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run the release.', command: 'mods/claudopus/bin/release' } as never)
  expect(String(bare.result)).toContain('Not shown')
  expect(await list.find({ type: 'Text', text: 'Run the release.' })).toBeUndefined()
  // With its folder it is shown starting there, with a Copy button and no Open in Terminal
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Sign in to GitHub.', command: 'gh auth login', cwd: '/repo/site' } as never)
  expect(String(told.result)).toContain("cd '/repo/site' && gh auth login")
  expect(String(told.result)).not.toContain('Open in Terminal')
  expect(String(told.result)).toContain('nothing opens a terminal here')
  expect((await list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login" }))?.props.mono).toBe(true)
  expect((await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Open in Terminal')).toBeUndefined()
  expect(terminals).toEqual([])
  expect(shown.some(argv => String(argv[1]).endsWith('/open.command'))).toBe(false)
  await list.unmount()
})
