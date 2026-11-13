// Made by src/claudopus/build.mjs from the parts in src/claudopus/tests: change them there and build again, never this file. Its tests run with the engine's plugin test.
import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import { headLine, headMood, OFF_LOOK, offOf, openTake, opensOf, shareable, stuckOf, trip } from './shared'

// The world beneath the mod in every test: files in memory, the app's session tools, a cheap model; and small helpers

const HOME = '/home/sam'
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
// The principles and working rules the mod ships
const PRINCIPLES = '# How I work with Claude\n\n## Principles\n\n1. My words are the spec.\n'
// The prompt each piece of work started with, as the mod left it
const prompts: string[] = []

// The world beneath the mod: files in memory, the app's session tools, a cheap model
const world = (on: On, options: { reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean; claudopus?: number; asks?: number }; isNew?: boolean; ended?: Set<string>; unresumable?: Set<string>; env?: Record<string, string>; sips?: (argv: string[]) => string | undefined; bytes?: (path: string) => string | undefined; unplaced?: boolean; blind?: boolean; live?: { id: string; isShown: boolean; isPlaced: boolean; isFocused?: boolean }[]; changelog?: string } = {}) => {
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
  const played: string[] = []
  const notified: string[] = []
  // What was handed to osascript
  const osa: string[][] = []
  const keychain: string[] = []
  // What was handed to Claudopus.app, the mod's own notifier
  const own: string[][] = []
  // What was handed to open: a folder shown in Finder
  const shown: string[][] = []
  // What was run over ssh, with what it was handed
  const sshed: string[][] = []
  prompts.length = 0
  let spawned = 0
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
    // The texts the mod ships; a copy of one in the memory folder is the person's own, kept in files
    const isShipped = !e.path.startsWith(MEMORY)
    if (isShipped && e.path.endsWith('roles/chat.md')) return { value: options.chatRole ?? 'CHAT ROLE' }
    if (isShipped && e.path.endsWith('roles/work.md')) return { value: 'WORK ROLE; an admin command runs through `{admin}`; a key runs as `{secret} NAME`; main is reached through `{release}`' }
    if (isShipped && e.path.endsWith('rules/CLAUDE.md')) return { value: PRINCIPLES }
    if (isShipped && options.changelog !== undefined && e.path.endsWith('/CHANGELOG.md')) return { value: options.changelog }
    if (e.path.endsWith('.claude-plugin/plugin.json')) return { value: '{ "name": "claudopus", "version": "0.1.0" }' }
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
    // A line added to the end of a file, as the log is written
    if (tool === 'sh' && rest[1] === 'printf %s "$2" >> "$1"' && rest[3] !== undefined) {
      files.set(rest[3], `${files.get(rest[3]) ?? ''}${rest[4] ?? ''}`)
      return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
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
    if (tool === 'kill') killed.push(String(rest[0]))
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
    // A shell run here: bringing results from another Mac lays there what the test laid as remote:<folder>/<file>, and a folder moved
    // into place goes only where none has its name
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
    if (tool === 'mv') (files.set(String(rest[2]), files.get(String(rest[1])) ?? ''), files.delete(String(rest[1])))
    // A copy the mod makes of a file
    if (tool === 'cp') (copied.push(String(rest[2])), files.set(String(rest[2]), files.get(String(rest[1])) ?? ''))
    const isGone = killed.includes('700')
    // The secret runner: one key kept when the test lays its value, swapped for its name in what it is handed
    const kept = files.get('keychain:API_KEY')
    if (tool?.endsWith('bin/secret')) {
      const said = rest[0] === '--list' ? (kept ? 'API_KEY\n' : '') : kept ? String(e.init?.stdin ?? '').replaceAll(kept, '[hidden API_KEY]') : String(e.init?.stdin ?? '')
      return { value: { exitCode: 0, stdout: said, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    }
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
    const command = String((e as { command?: string }).command ?? '')
    if (e.tool === 'Bash' && command.startsWith('hold ')) return { result: { stdout: await new Promise<string>(done => held.set(command.slice(5), done)), stderr: '', interrupted: false } } as never
    if (e.tool === 'TaskStop') stopped.push(String((e as { task_id?: string }).task_id))
    if (e.tool === 'SendMessage') sent.push(String((e as { message?: string }).message))
    // A command that prints the key, as one could print it by mistake
    if (e.tool === 'Bash' && String((e as { command?: string }).command).includes('echo $API_KEY')) return { result: { stdout: `token is ${files.get('keychain:API_KEY') ?? 'none'}`, stderr: '', interrupted: false } } as never
    // A workflow runs in the background: the tool answers with its run, its task and where its transcripts go
    if (e.tool === 'Workflow') return { result: { status: 'async_launched', taskId: 'wt1', runId: 'wf_1', taskType: 'local_workflow', workflowName: 'rounds', transcriptDir: '/t/wf_1', scriptPath: '/t/wf_1.js' } } as never
    return { result: 'ran' } as never
  })
  on('agent.spawn', (_, e) => {
    prompts.push(e.prompt)
    const resume = (e as { resume?: { agentId?: string } }).resume
    return { model: options.model ?? 'm', agentId: resume?.agentId ?? `a${(spawned += 1)}` } as never
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
  on('classic.PermissionRequest', () => (files.has('settings:allow') ? { decision: { behavior: 'allow' } } : {}) as never)
  on('session.compact', (_, e) => {
    compacts.push(e.instructions)
    return { messages: e.messages }
  })

  return { files, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, resumed, clock, copied, stepped, played, notified, osa, own, shown, terminals, sshed, events, held, keychain }
}

// A button of the open card by its key less the count of presses the card adds to it
const keyed = async (pane: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; props: Record<string, unknown> }[]> }, base: string) =>
  (await pane.findAll({ type: 'Button' })).find(one => new RegExp(`^${base}-\\d+$`).test(one.key ?? ''))
const pressed = async (pane: { press: (q: { key: string }) => Promise<unknown> } & Parameters<typeof keyed>[0], base: string) => pane.press({ key: (await keyed(pane, base))?.key ?? base })
const spawn = { subagentType: 'general-purpose', fork: false, background: true, description: 'Fix the nose' } as const
declare const setTimeout: (run: () => void, ms: number) => unknown
// What the panel shows after work that is not awaited, such as a look at the servers
const until = async <T,>(look: () => Promise<T | undefined>) => {
  for (let tries = 0; tries < 100; tries += 1) {
    const got = await look()
    if (got) return got
    await new Promise<void>(resolve => setTimeout(() => resolve(), 5))
  }
  return undefined
}

// The chat: its role, handing work over, keys and pastes, names, the mod's tools, compaction, after a reply, the principles

test('a chat gets its role once, is told to start a fresh agent from a brief for every message, and every message is saved', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  const first = await $.prompt.submit({ text: 'fix the upload page', wait: false, origin: composer })
  expect(first.context?.join('\n')).toContain('CHAT ROLE')
  expect(first.context?.join('\n')).toContain('Subjects so far')
  expect(first.context?.join('\n')).toContain(`This chat's saved words: ${MEMORY}/words/engine-id.md`)
  expect(first.context?.join('\n')).toContain('start a fresh agent')
  expect(first.context?.join('\n')).toContain('Only a message that steers what listed work is already doing')
  expect(first.context?.join('\n')).toContain('A fault, a question or a new ask gets its own agent')

  // One sent while the chat is mid-turn is its own piece of work too
  const second = await $.prompt.submit({ text: 'and the nose', wait: false, origin: composer, turnId: 'turn-1' })
  expect(second.context?.length).toBe(1)
  expect(second.context?.[0]).toContain('start a fresh agent')

  const words = files.get(`${MEMORY}/words/engine-id.md`) ?? ''
  expect(words).toContain('fix the upload page')
  expect(words).toContain('and the nose')
})

test('work never starts as a copy of the chat: a fork or an agent with no model is refused, and a brief gets the rules for the work', async ($, on) => {
  const { files } = world(on, { tokens: 400_000 })
  await $.session.start(start)

  const r = await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  expect(r.context?.join('\n')).not.toContain('fork')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a1', prompt: 'fix the nose', subagent_type: 'fork' } as never)).deny).toContain('never started as a copy')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a2', prompt: 'fix the nose', subagent_type: 'general-purpose' } as never)).deny).toContain('the model named')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a3', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused an Agent call that copies the chat')

  // The brief reaches the work with the rules for every piece of work and the path of the chat's saved words after it
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]?.startsWith('BRIEF')).toBe(true)
  expect(prompts[0]).toContain('WORK ROLE')
  expect(prompts[0]).toContain(`${MEMORY}/words/engine-id.md`)
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

  // Nothing kept: what the tool answers passes as it was
  expect(JSON.stringify((await $.tool.call({ tool: 'Bash', tool_use_id: 'k3', command: 'echo $API_KEY', agentId: 'w1' } as never)).result)).toContain('token is none')
  files.set('keychain:API_KEY', 'sk-live-123456')
  const shown = await $.tool.call({ tool: 'Bash', tool_use_id: 'k4', command: 'bin/secret API_KEY here "echo $API_KEY"', agentId: 'w1' } as never)
  expect(JSON.stringify(shown.result)).toContain('token is [hidden API_KEY]')
  expect(JSON.stringify(shown.result)).not.toContain('sk-live-123456')
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
})

test("a chat's own thread may only start agents and talk to them; an agent may do the work", async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })

  const refused = await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)
  expect(refused.deny).toContain('Start a fresh agent')
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused Bash')

  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 't2', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', tool_use_id: 't3', recap: 'r' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't4', command: 'ls', agentId: 'fork-1' } as never)).deny).toBeUndefined()
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
  expect(prompts[0]).toContain('Sam follows this work in a panel')
  expect(prompts[0]).toContain("Sam's messages word for word")
  expect(prompts[0]).not.toMatch(/the person(?! you work for)/i)
})

test('without a name in config.json the work is told of the person', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  expect(prompts[0]).toContain('started from a chat for the person you work for.')
  expect(prompts[0]).toContain('The person follows this work in a panel')
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
  expect(compacts[0]).toContain('Keep every ask')
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
  expect(ours).toContain('a sign-in by device code or a link that works opened on my device, never a browser, window, dialog or keychain prompt on this Mac')
  expect(ours).not.toContain('{name}')
  // A second copy of the mod that already added them, rule and all, does not make them go out twice
  const twice = await $.prompt.context({ blocks: [], instructionFiles: [{ path: '/other/copy/rules/CLAUDE.md', kind: 'user', content: ours }] })
  expect(twice.instructionFiles?.length).toBe(1)
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
    // One short line: what the work that last moved is doing, and how many others run
    expect((await band.find({ type: 'Text', text: /more$/ }))?.text).toBe('· +1 more')
    expect((await band.find({ type: 'Text', text: /Check the ears|Fix the nose/ }))?.props.wrap).toBe('truncate-end')
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

test('a small card shows where the work is and a count of its to-dos; pressed, it lists every to-do; ended work leaves the panel', async ($, on) => {
  const { logged, clock, files, opened } = world(on)
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
  // Three moving dots beside the line the work last wrote and nowhere else; its to-dos are only counted
  expect(await pane.findAll({ type: 'Svg' })).toHaveLength(1)
  expect(await pane.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Fit the/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /^Try the/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toMatch(/(^| · )0 of 2 done · \d+s$/)
  // Its edge is its to-dos, one part each: the one being done lighter than a done one, the rest a dim tint; a terminal's edge is whole
  const edgeOf = async (of: typeof pane) => (await of.findAll({ type: 'Box' })).map(b => String(b.props.backgroundColor)).filter(colour => colour.startsWith('#8A63F0'))
  expect(await edgeOf(pane)).toEqual(['#8A63F0AD', '#8A63F05C'])
  const flat = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect(await edgeOf(flat)).toEqual(['#8A63F0'])
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
  expect(String((await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' } as never)).result)).toContain('Only background work')

  // The newer line replaced the older; a dropped to-do is not counted
  expect(await pane.find({ type: 'Text', text: /^I am fitting/ })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^The nostril is closed/ }))?.text).toBe('The nostril is closed; I am comparing the head with your scan.')
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('1 of 2 done')
  // The done to-do's part of the edge is bright, and with none being done the other is dim
  expect(await edgeOf(pane)).toEqual(['#8A63F0', '#8A63F05C'])
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
  expect((await tab.find({ type: 'Text', text: /^Its chat$/ }))?.props.bold).toBe(true)
  expect((await tab.find({ type: 'Text', text: /of \d+ done$/ }))?.text).toBe('1 of 7 done')
  expect((await tab.find({ type: 'Text', text: /^Compare/ }))?.props.dimColor).toBe(false)
  expect((await tab.find({ type: 'Text', text: /^Check the left ear/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^The nostril is closed/ }))?.props.dimColor).toBe(true)
  expect(await tab.find({ type: 'Text', text: /^Now:$/ })).toBeUndefined()
  // The next three are listed, the rest behind "more"
  expect(await tab.find({ type: 'Text', text: /^Later step 2$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Later step 3$/ })).toBeUndefined()
  await pressed(tab, 'fold--1000002')
  expect(await tab.find({ type: 'Text', text: /^Later step 4$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Fit the/ })).toBeUndefined()
  expect((await keyed(tab, 'fold--1000003'))?.props.label).toBe('▸ 1 done · 1 dropped')
  // A pressed button comes back under a new key: the app keeps the button that holds the focus in view, and pulled the view back to it
  const before = (await keyed(tab, 'fold--1000003'))?.key
  await pressed(tab, 'fold--1000003')
  expect((await keyed(tab, 'fold--1000003'))?.key).not.toBe(before)
  expect((await tab.find({ type: 'Text', text: /^Fit the/ }))?.props.dimColor).toBe(true)
  expect((await tab.find({ type: 'Text', text: /^Try the/ }))?.props.strikethrough).toBe(true)
  // The list behind it is as it was
  expect((await pane.find({ type: 'Text', text: /of \d+ done/ }))?.text).toContain('1 of 7 done')

  // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
  await $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' } as never)
  await $.agent.spawn({ ...spawn, fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' } as never)
  expect(prompts.at(-1)).toBe('search')
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' } as never)
  expect((await pane.find({ type: 'Text', text: /^I am reading/ }))?.text).toBe('I am reading how the other model draws outlines.')
  // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
  expect((await keyed(pane, 'open-list-a2'))?.props.label).toBe('Search the docs')
  expect((await pane.findAll({ type: 'Svg' })).filter(svg => String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'At work' && svg.props.isInteractive === true)).toHaveLength(1)
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
  expect((await tab.find({ type: 'Text', text: /at work · / }))?.text).toBe('1 at work · 1 in all')

  // Work that ends its turn to wait for its helper goes on working
  await clock.advance(120_000)
  await $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' } as never)

  // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  await $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^Finished · \d+m/ }))?.text).toBe('Finished · 2m 00s')
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await tab.unmount()
  // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect((await pane.find({ type: 'Text', text: /^Just finished$/ }))?.text).toBe('Just finished')
  // Its helper, ended in the same moment, stays in its card for the same pause
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Search the docs'])
  await clock.advance(1_000)
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeDefined()
  await clock.advance(1_100)
  expect(await pane.find({ type: 'Text', text: /Fix the nose/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing is running')
  // It is one folded row, "Finished", under the running cards; unfolded, a card as running work has, with Details and no Stop
  const buttons = await pane.findAll({ type: 'Button' })
  expect(buttons.map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', '▸ Finished 1'])
  await pane.press({ key: String(buttons[4]?.key) })
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.wrap).toBe('truncate-end')
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 1 of 7 done · 2m 00s')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  // Finished work's Details opens as a tab of its own too
  await pressed(pane, 'open-a1')
  const ended = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await ended.find({ type: 'Text', text: /^Finished · \d+m/ }))?.text).toBe('Finished · 2m 00s')
  expect((await ended.find({ type: 'Text', text: /^Its chat$/ }))?.props.bold).toBe(true)
  await ended.unmount()
  expect(files.get(`${MEMORY}/finished/engine-id.json`) ?? '').toBe('')
  await clock.advance(20_000)
  // kept with its helper, so its Details still lists it after a reload
  expect(JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]').map((one: { id: string }) => one.id)).toEqual(['a1', 'a2'])
  await pane.unmount()

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await band.find({ type: 'Text' }))?.text).toBe("the engine's own")
  await band.unmount()
  expect(logged).toEqual([])
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
    expect((await keyed(tab, 'run-4'))?.props.label).toBe('▸ Took 1 other step')
    expect((await keyed(tab, 'run-5'))?.props.label).toBe('▸ Updated its to-dos')
    await pressed(tab, 'run-1')
    await pressed(tab, 'run-4')
    await pressed(tab, 'run-5')
    expect((await tab.find({ type: 'Text', text: /^Read/ }))?.text).toBe('Read nose.py')
    expect((await tab.find({ type: 'Text', text: /^Fit the nostril again \(/ }))?.text).toBe('Fit the nostril again (failed)')
    expect((await tab.find({ type: 'Text', text: /^search/ }))?.text).toBe('search: nose')
    expect((await tab.find({ type: 'Text', text: /^Ticked/ }))?.text).toBe('Ticked: Fit the nostril again')
    // My steer sits once, before what the work did about it: its to-do and the line it then wrote
    const texts = (await tab.findAll({ type: 'Text' })).map(one => one.text)
    expect(texts.indexOf('You')).toBe(texts.indexOf('search: nose') + 1)
    expect(texts.indexOf('Ticked: Fit the nostril again')).toBeGreaterThan(texts.indexOf('You'))
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
  const { sent, appended, submitted, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const step = (tool: string, input: object = {}) => $.tool.call({ tool, tool_use_id: 't', agentId: 'a1', ...input } as never)

  await $.prompt.submit({ text: 'Also make me a chart of the ears.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “Also make me a chart of the ears.”' } as never)
  // The chat's call goes on as it was made; the work is told in its own chat what a steer asks of it
  expect(sent[0]).toBe('Sam: “Also make me a chart of the ears.”')
  expect(appended).toHaveLength(1)
  expect(appended[0]).toContain('a1: The message sent to you just now that carries the person\'s words "Also make me a chart of the ears." is from the person, in their own words')
  expect(appended[0]).toContain('Decide which of three it is')
  expect(appended[0]).toContain('added it to your to-do list')
  expect(appended.join('\n')).not.toMatch(/steer/i)

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
  expect(String(noted.result)).toContain('Start it as its own piece of work: Make a chart of the ears')
  expect(String(noted.result)).toContain('Also make me a chart of the ears.')
  expect(String(noted.result)).toContain('do not do that task here')
  await clock.advance(10)
  expect(submitted).toHaveLength(0)
  for (let n = 0; n < 5; n += 1) await step('Bash')
  expect(appended).toHaveLength(2)

  // Work that has ended is sent a message, not a steer
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
  expect(appended.at(-1)).toBe('a1: The message sent to you just now that begins "There are two nostrils." is from your helper "Count nostrils", not from the person: that one is not theirs. Take it as your helper "Count nostrils"\'s and carry on; a message that carries the person\'s own words stays theirs.')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a3: The message sent to you just now that begins "Count them again." is from the work that started you, not from the person')
  // One piece of work writes to another
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the work "Fix the nose", not from the person')
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
  expect(appended.at(-1)).toContain('is from the person, in their own words')
  await steps('a1')
  expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision')
  // The same words sent by a piece of work are still not the person's steer
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('is from the work "Fix the nose"')
  // Once the chat's turn is over, a message from it is its own again
  await $.turn.complete({ answer: 'Sent.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer' })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's7', to: 'a2', message: 'Make the left nostril a little wider than the right one.' } as never)
  expect(appended.at(-1)).toContain('is from the chat, not from the person')
})

test("the person's words sent to work that has ended are theirs, and the chat's own note sent after them is labelled by its own start", async ($, on) => {
  const { appended, sent } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.turn.complete({ answer: 'The nose is fixed. Shall I build it into the app? '.repeat(20), durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  await $.prompt.submit({ text: 'Yes, build the nose into the app', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'From Sam, as they said it: "Yes, build the nose into the app"' } as never)
  const all = [...appended, ...sent].join('\n')
  expect(all).toContain('The message that started you again, carrying the person\'s words "Yes, build the nose into the app", is from the person, in their own words')
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

test('work that ends in an error is kept as failed, time lying ended is not counted, and work under way is never forgotten', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await clock.advance(120_000)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'error', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^An error/ }))?.text).toBe('An error stopped it before it finished · 2m 00s')

  // An hour later it is sent a message and works again: the hour is not counted
  await clock.advance(3_600_000)
  await $.agent.spawn({ ...spawn, prompt: 'try again', resume: { agentId: 'a1' } } as never)
  expect((await tab.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await tab.unmount()

  // Fifty more pieces of work start and end: the first is still listed
  for (let n = 0; n < 50; n += 1) {
    const r = await $.agent.spawn({ ...spawn, description: `Other ${n}`, prompt: 'x' } as never)
    await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t-${n}`, reason: 'answer', agentId: r.agentId } as never)
  }
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.text).toBe('Fix the nose')
  await pane.unmount()
})

test('a chat the app has not kept is said so, with the answer the work gave', async ($, on) => {
  world(on, { talk: { deny: 'no transcript for a1' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /not kept/ }))?.text).toBe('The app has not kept the chat of this work.')
  expect((await tab.find({ type: 'Markdown' }))?.props.text).toBe('The nostril is closed.')
  await tab.unmount()
  await pane.unmount()
})

test('a message of mine passed on to work already listed opens its to-do again, and that work is not told the panel rule twice', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })
  await $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)

  await $.prompt.submit({ text: 'No, the left nostril, not the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: the left nostril' } as never)
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
  expect((await pane.find({ type: 'Text', text: /This chat/ }))?.text).toBe('This chat: 22% · 111k of 500k')
  expect((await keyed(pane, 'model-a1'))?.props.label).toBe('Opus 5.5')
  expect((await pane.find({ type: 'Text', text: /context/ }))?.text).toBe(' · context 61% (305k) · 0s')
  // Work with no to-dos has a whole purple edge
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => b.props.backgroundColor)).toEqual(['#8A63F0'])
  // A helper's row says its model, how much context it holds and its time, in that order
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' } as never)
  for await (const chunk of $.turn.step({ turnId: 'turn-3', index: 0, model: 'm', messageCount: 2, agentId: 'a2' })) kinds.push(chunk.kind)
  // More to-dos than the edge has parts for are one edge, filled as far as they are done
  for (let n = 0; n < 16; n++) await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: `e${n}`, agentId: 'a1', item: `Part ${n}`, state: n < 3 ? 'done' : 'open' } as never)
  expect((await pane.findAll({ type: 'Box' })).filter(b => String(b.props.backgroundColor).startsWith('#8A63F0')).map(b => [b.props.backgroundColor, b.props.flexGrow])).toEqual([['#8A63F0', 3], ['#8A63F05C', 13]])
  await pane.unmount()
  const wide = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await wide.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 305k · 0s')
  await wide.unmount()
  // A narrower panel drops the context, and the narrowest the model too, so the helper's name keeps its room
  const narrow = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await narrow.find({ type: 'Text', text: /^Opus 5\.5 · / }))?.text).toBe('Opus 5.5 · 0s')
  await narrow.unmount()
  const slim = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 28 }, surface: 'desktop' } as never)
  expect(await slim.find({ type: 'Text', text: /^Opus 5\.5 · / })).toBeUndefined()
  expect((await slim.find({ type: 'Text', text: /^\d+s$/ }))?.text).toBe('0s')
  await slim.unmount()
})

test('the model a running work is on is pressed and another chosen: its next step runs on it, its card says so at once, and its chat and the work are told', async ($, on) => {
  const talk: { role: string; text: string; toolUses: never[] }[] = [{ role: 'user', text: 'Fix the nose on head A.', toolUses: [] }]
  const answered: { by?: string } = {}
  const { appended, stepped, logged } = world(on, { model: 'claude-opus-5-5', talk, answered })
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
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect(await keyed(tab, 'model-a1')).toBeUndefined()
  expect((await tab.find({ type: 'Text', text: /^Finished/ }))?.text).toMatch(/^Finished · Fable 5\.2 · /)
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
  await pressed(tab, 'fold--1000002')
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
  expect((await gone.find({ type: 'Text' }))?.text).toBe('This work is no longer kept.')
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
  expect((await tab.find({ type: 'Text', text: /^Reading its chat/ }))?.text).toBe('Reading its chat…')
  give()
  expect((await until(async () => (await tab.find({ type: 'Markdown' }))?.props.text))).toBe('The nostril is closed.')
  expect(await tab.find({ type: 'Text', text: /^Reading its chat/ })).toBeUndefined()
  await tab.unmount()
})

test('the stop button of a to-do stops its work', async ($, on) => {
  const { stopped, clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a1' })
  expect(stopped).toEqual(['a1'])
  // Stopped work stays in its place for its pause, plain, saying it was stopped, with no Stop; then it leaves the panel
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text).filter(text => /nose|ears/.test(text))
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears'])
  expect((await pane.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /Fix the nose/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeUndefined()
  expect(await pane.findAll({ type: 'Text', text: /^\d+s$/ })).toHaveLength(1)
  await pane.unmount()
})

test('work that ends pauses in its place for two seconds: two at once, one ended while the panel was closed, one that reports twice', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const titles = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.props.bold && /nose|ears|eyes/.test(one.text)).map(one => one.text)
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label

  // Two that end at once both stay green in their places, the one still working between them; neither is under Finished yet
  await clock.advance(400)
  await end('a1', 't1')
  await end('a3', 't3')
  expect(await titles()).toEqual(['Fix the nose', 'Check the ears', 'Draw the eyes'])
  expect(await pane.findAll({ type: 'Text', text: '✓ Finished' })).toHaveLength(2)
  expect((await pane.find({ type: 'Text', text: /^Working on/ }))?.text).toBe('Working on 1 thing')
  expect(await fold()).toBeUndefined()
  await clock.advance(2_100)
  expect(await titles()).toEqual(['Check the ears'])
  expect(await fold()).toBe('▸ Finished 2')

  // Work that ends while the panel is closed is already under Finished when it opens two seconds on: no card is left green
  await pane.unmount()
  await end('a2', 't2')
  await clock.advance(2_500)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 3')

  // Work sent on again is back among the running cards; when it ends again it pauses again, then goes back to Finished
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the nose again.' } as never)
  expect(await again.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  await end('a1', 't4')
  expect(await again.findAll({ type: 'Text', text: '✓ Finished' })).toHaveLength(1)
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 2')
  await clock.advance(2_100)
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect((await again.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label).toBe('▸ Finished 3')
  await again.unmount()
})

test('work the engine runs is listed even when the mod never saw it start, and work it reports as failed leaves the panel', async ($, on) => {
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
  agents.a7 = 'failed'
  await clock.advance(20_000)
  expect((await until(() => pane.find({ type: 'Text', text: /^Nothing/ })))?.text).toBe('Nothing is running')
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
  expect((await pane.find({ type: 'Text', text: /^Working on/ }))?.text).toBe('Working on 1 thing')
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
  expect((await pane.find({ type: 'Text', text: /The old line/ }))?.text).toBe('The old line')
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · Opus 5.5 · context 1.0k · 1 of 1 done · 5m 00s')
  expect(await pane.find({ type: 'Text', text: /secret|not ours|helper/ })).toBeUndefined()
  await pane.unmount()
})

test('helpers hang inside their work\'s card as a tree, one slim row each that opens its Details; ended ones fold into one row laid out the same, and Details lists every one', async ($, on) => {
  const { clock, opened } = world(on)
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
  expect(svgs.map(svg => svg.alt)).toEqual(['At work', 'At work', 'Ended'])
  expect(svgs[0]?.source).toContain('d="M9 0V20M9 10H22M27 15V20"')
  expect(svgs[1]?.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"')
  expect(svgs[1]?.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>')
  // A row at work has its slow ring round the dot; the closing row of those that ended is still
  expect(svgs[1]?.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>')
  expect(svgs[2]?.source).not.toContain('<animate')
  expect(svgs[2]?.source).toContain('d="M9 0V5Q9 10 14 10H22"')
  expect(svgs[2]?.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>')
  // No row names a model, and none has the three dots: only the card itself does
  expect((await drawn.findAll({ type: 'Svg' })).filter(svg => svg.props.alt === 'Being done now')).toHaveLength(1)
  await drawn.unmount()
  // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 20 }, surface: 'desktop' } as never)
  expect((await keyed(narrow, 'open-list-a2'))?.props.label).toBe('Measure the nose')
  await narrow.unmount()

  // The work's Details lists every helper, ended or not, as the same tree
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  expect((await tab.find({ type: 'Text', text: / in all$/ }))?.text).toBe('2 at work · 4 in all')
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(text => /manual|appendix|Measure/.test(text))).toEqual(['Measure the nose', 'Read the manual', 'Read the appendix', 'Measure the ears'])
  // One at work has a dot at the end of its line, one that finished a tick
  expect((await tab.findAll({ type: 'Text', text: '●' })).length).toBe(2)
  expect((await tab.findAll({ type: 'Text', text: '✓' })).length).toBe(2)
  expect(await keyed(tab, 'open-details-a3')).toBeDefined()
  await tab.unmount()
})

test('long work keeps only its newest ended helpers, and none of work that was forgotten', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (let n = 2; n <= 106; n += 1) {
    await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: `Measure ${n}`, prompt: 'go', parentAgentId: 'a1' } as never)
    await clock.advance(10)
    if (n <= 105) await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: `t${n}`, reason: 'answer', agentId: `a${n}` } as never)
  }
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  // 104 ended, the oldest four forgotten; the one at work is never forgotten
  expect((await tab.find({ type: 'Text', text: / in all$/ }))?.text).toBe('1 at work · 101 in all')
  const names = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(names.includes('Measure 5')).toBe(false)
  expect(names.includes('Measure 6')).toBe(true)
  await tab.unmount()
})

// Finished work: the happy green octopus and its pause

test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', async ($, on) => {
  const { clock } = world(on, { art: true })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  // The octopus drawings a view shows, by the file each came from
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  // The moment each octopus drawing is marked with: the app keeps a picture it drew before, so a happy moment drawn the same as
  // the last would start at its end, arms down; each turn to a drawing is marked anew, and keeps its mark while it stays
  const moment = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))?.[1]).filter(Boolean)[0]
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // One finishes while another works: both octopuses are happy, the band still says what the other is doing
  await clock.advance(400)
  await end('a1', 't1')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  const first = await moment(pane)
  const firstBand = await moment(band)
  expect(first).toBeDefined()
  expect(firstBand).toBeDefined()
  expect(await band.find({ type: 'Text', text: /Check the ears/ })).toBeDefined()
  // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
  await clock.advance(1_000)
  await end('a2', 't2')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(pane)).toBe(first)
  expect(await moment(band)).toBe(firstBand)
  expect((await band.find({ type: 'Text', text: '✓ Finished' }))?.props.dimColor).toBe(true)
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
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
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
  expect((await after.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  await clock.advance(2_100)
  expect(await after.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  // Work stopped in the seconds of a load is not green after it
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await after.press({ key: 'stop-a9' })
  await clock.advance(5_000)
  await $.session.start(start)
  expect(await after.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await drawn(after)).toEqual(['mark'])
  await after.unmount()
})

test('work that answered while only its own background work held it, then stopped by the chat, the panel or the engine, finished: green and happy for its pause; work stopped before it answered is not', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, files } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const report = `The hover is gone and idle chats are no longer listed. ${'All tests pass and the version is pushed to main, installed on both Macs. '.repeat(8)}`
  // Its turn ends with its report while a watcher it started still runs: the engine holds it, and its card goes on working
  const answer = async (id: string, turnId: string) => {
    agents[id] = 'waiting'
    kinds[id] = 'general-purpose'
    await $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }

  // The chat stops it with TaskStop once its report is in: it ends at once, green and happy, and its report is kept then, once
  await $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Remove the hover', prompt: 'remove the hover' } as never)
  await clock.advance(60_000)
  await answer('a1', 't1')
  expect(await drawn(pane)).toEqual(['working'])
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key))
  await clock.advance(10)
  expect(kept()).toHaveLength(0)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  expect((await pane.find({ type: 'Text', text: /^Just finished$/ }))?.text).toBe('Just finished')
  await clock.advance(10)
  expect(await until(async () => kept()[0])).toBeDefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report.trim()}\n`)
  // The aborted turn that follows the stop changes nothing: its pause is not begun again, and its words are no report
  await clock.advance(1_000)
  await $.turn.complete({ answer: 'Partial words', durationMs: 1, isAborted: true, turnId: 't1x', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_100)
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report.trim()}\n`)
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /Remove the hover/ })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  // The engine's next look lists it killed: nothing changes, and no second report
  agents.a1 = 'killed'
  await clock.advance(20_000)
  expect(kept()).toHaveLength(1)

  // Stopped some other way, the engine lists it killed at its next look: the same green moment from then
  await $.agent.spawn({ ...spawn, description: 'Fold the idle chats', prompt: 'fold them' } as never)
  await answer('a2', 't1b')
  agents.a2 = 'killed'
  for (let n = 0; n < 25 && !(await pane.find({ type: 'Text', text: '✓ Finished' })); n += 1) await clock.advance(1000)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Build the app', prompt: 'build it' } as never)
  agents.a3 = 'waiting'
  kinds.a3 = 'general-purpose'
  await $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' } as never)
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
  // background goes on, unstopped, and the chat need not stop it
  await $.agent.spawn({ ...spawn, description: 'Name the octopus', prompt: 'name it' } as never)
  agents.a4 = 'waiting'
  kinds.a4 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' } as never)
  // Its turn may end with no text of its own: the handback is its answer
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
  // way to stop it
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect((await pane.find({ type: 'Text', text: /^It left something running in the background, / }))?.props.color).toBe('#E5A50A')
  expect(await pane.find({ type: 'Button', text: 'Stop it' })).toBeDefined()
  // What it left running wakes it for a turn of words alone: it stays as it ended, not announced again, its report kept
  const otto = () => [...files.keys()].filter(key => /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key))
  const reportsBefore = otto().length
  await clock.advance(11_000)
  await $.turn.complete({ answer: 'The watch exited.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' } as never)
  // Not announced again: no second pause, though the card still says what it left running
  expect(await pane.find({ type: 'Text', text: /^It left something running/ })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(10)
  expect(otto().length).toBe(reportsBefore)
  // What it left running wakes it and it takes a step: it is working again
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' } as never)
  await clock.advance(2_100)

  // Handed back with a helper of its own still at work, it is done too, and the helper goes on
  await $.agent.spawn({ ...spawn, description: 'Name the squid', prompt: 'name it', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Look up names', prompt: 'look', parentAgentId: 'h1', resume: { agentId: 'h2' } } as never)
  agents.h1 = 'waiting'
  agents.h2 = 'running'
  kinds.h1 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'h1', message: 'Named it Sid.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4t', reason: 'answer', agentId: 'h1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  // Once nothing of it is held any more, at the engine's next look, it leaves the list
  agents.h2 = 'completed'
  agents.h1 = 'completed'
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: /Name the squid/ })).toBeUndefined()

  // Sent a message after its report, it works again: stopped before it took a step, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await answer('a5', 't5s')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' } as never)
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // The engine ends it as aborted instead: the same
  await $.agent.spawn({ ...spawn, description: 'Fold the list', prompt: 'fold the list' } as never)
  await answer('a6', 't2')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Stop pressed on its card in the panel: the same
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await answer('a7', 't3')
  await pane.press({ key: 'stop-a7' })
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
  await $.agent.spawn({ ...spawn, description: 'Watch the M4', prompt: 'watch the m4' } as never)
  await answer('a8', 't4')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' } as never)
  await pane.press({ key: 'stop-a8' })
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  agents.a9 = 'killed'
  kinds.a9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  await clock.advance(2_100)
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  await pane.unmount()
})

// Sounds and notifications: work that is ready, and work that needs the person

test('work that is ready plays one sound and raises one notification; helpers, a second report, a Stop press and a reload make none; stopped work says so silently', async ($, on) => {
  // Whether the app takes notifications from a mod
  const app = { noSurface: false, claudopus: 0 }
  const { clock, played, notified, files, osa, own } = world(on, { app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34', __CFBundleIdentifier: 'com.anthropic.claudefordesktop' } })
  await $.session.start(start)
  const end = (agentId: string, turnId: string, answer = 'Done.', extra = {}) => $.turn.complete({ answer, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId, ...extra } as never)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // Its helper ends first: nothing
  await $.agent.spawn({ ...spawn, description: 'Measure the nose', prompt: 'measure', parentAgentId: 'a1' } as never)
  await end('a2', 'h1')
  await clock.advance(1_000)
  expect(played).toEqual([])
  expect(notified).toEqual([])

  // The work finishes: one sound, one line with its title and the first words of its answer
  await end('a1', 't1', '**The nose is fixed.** Both nostrils now match, and the tests pass.\n\nMore below.')
  expect(played).toEqual([])
  await clock.advance(1_000)
  expect(played).toEqual(['sounds/ready.wav'])
  expect(notified).toEqual(['Fix the nose | The nose is fixed.'])

  // Sent on and ending again within seconds: no second sound or notification
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'One more look.' } as never)
  await end('a1', 't2')
  await clock.advance(1_000)
  expect(played).toHaveLength(1)
  expect(notified).toHaveLength(1)

  // Two that finish together: one sound and one notification naming both; what waits on the person comes first
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a3', items: ['Do you want the left ear bigger?'] } as never)
  await end('a3', 't3')
  await clock.advance(300)
  await end('a4', 't4')
  await clock.advance(1_000)
  expect(played).toHaveLength(2)
  expect(notified.at(-1)).toBe('2 pieces of work are ready | Check the ears: ready · Draw the eyes: ready')
  await $.agent.spawn({ ...spawn, description: 'Check the chin', prompt: 'check the chin' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', agentId: 'a5', items: ['Do you want the chin rounder?'] } as never)
  await end('a5', 't5')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Check the chin | Waits on the person: Do you want the chin rounder?')

  // Failed work: a notification that says so, and no sound
  await $.agent.spawn({ ...spawn, description: 'Paint the hair', prompt: 'paint the hair' } as never)
  await end('a6', 't6', '', { reason: 'error' })
  await clock.advance(1_000)
  expect(played).toHaveLength(3)
  expect(notified.at(-1)).toBe('Paint the hair | Stopped by an error.')

  // Work the person stops with its Stop button: nothing
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a7' })
  await clock.advance(1_000)
  await pane.unmount()
  expect(notified).toHaveLength(4)

  // A reload announces nothing that ended before it, and goes on announcing what ends after it
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await $.session.start(start)
  await clock.advance(1_000)
  expect(notified).toHaveLength(4)
  await end('a8', 't8', 'The ears are drawn.')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Draw the ears | The ears are drawn.')
  expect(played).toHaveLength(4)

  // Where the app takes no notification from a mod, Claudopus.app raises it, and a click opens this chat in the Claude app
  app.noSurface = true
  await $.agent.spawn({ ...spawn, description: 'Draw the cheeks', prompt: 'draw the cheeks' } as never)
  await end('a9', 't11', 'The cheeks are drawn.')
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the cheeks', '--text', 'The cheeks are drawn.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ready-a9'])
  expect(own.at(-1)?.[0]).toMatch(/\/bin\/notify$/)
  expect(osa).toEqual([])

  // Claudopus notifications turned off in System Settings: macOS's plain one instead
  app.claudopus = 2
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await end('a10', 't12', 'The chin is drawn.')
  await clock.advance(1_000)
  expect(own).toHaveLength(2)
  expect(osa.at(-1)).toEqual(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', 'Draw the chin', 'The chin is drawn.'])
  app.noSurface = false

  // config.json switches each off
  files.set(`${MEMORY}/config.json`, JSON.stringify({ sound: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await end('a11', 't9')
  await clock.advance(1_000)
  expect(played).toHaveLength(6)
  expect(notified).toHaveLength(6)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await end('a12', 't10')
  await clock.advance(1_000)
  expect(played).toHaveLength(7)
  expect(notified).toHaveLength(6)
  expect(osa).toHaveLength(1)
})

test('outside the Claude app a click on a notification brings forward the app the chat runs in, such as its terminal', async ($, on) => {
  // A session id not of the app's shape is not put in its link
  const { clock, own } = world(on, { app: { noSurface: true }, env: { CLAUDE_CODE_HOST_SESSION_ID: 'session_x', __CFBundleIdentifier: 'com.googlecode.iterm2' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--activate', 'com.googlecode.iterm2', '--key', 'ready-a1'])
})

test('with neither a chat in the Claude app nor an app to bring forward, a notification names nothing for a click to open', async ($, on) => {
  const { clock, own } = world(on, { app: { noSurface: true } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--key', 'ready-a1'])
})

test('work that needs the person is heard once: its notification comes as the amber Claudopus Asks carrying the sound, silent when sound is off', async ($, on) => {
  const app = { noSurface: true, claudopus: 0, asks: 0 }
  const { played, own, osa, files, clock } = world(on, { app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const ask = (id: string, text: string) => $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text } as never)
  const lead = (argv?: string[]) => argv?.slice(1, argv.indexOf('--title'))

  // The sound goes in the notification, so macOS plays it as the person set Claudopus Asks and as a Focus allows; no second sound
  await ask('k1', 'Paste the code.')
  expect(own).toHaveLength(1)
  expect(lead(own[0])).toEqual(['--asks', '--chime'])
  expect(own[0]?.slice(3)).toEqual(['--title', 'Hide the repo needs you', '--text', 'Paste the code.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ask-a1'])
  expect(played).toEqual([])
  // The same ask said again is neither shown nor heard again
  await ask('k2', 'Paste the code.')
  expect(own).toHaveLength(1)

  // Sound off in Config: the amber notification, silent, and no chime of the mod's
  files.set(`${MEMORY}/config.json`, JSON.stringify({ sound: false }))
  await ask('k3', 'Press Approve.')
  expect(lead(own.at(-1))).toEqual(['--asks'])
  expect(played).toEqual([])

  // Claudopus Asks turned off in System Settings: the purple Claudopus, which carries no sound, and the mod's own chime
  files.set(`${MEMORY}/config.json`, '{}')
  app.asks = 2
  await ask('k4', 'Type your password.')
  expect(lead(own.at(-2))).toEqual(['--asks', '--chime'])
  expect(lead(own.at(-1))).toEqual([])
  expect(played).toEqual(['sounds/ready.wav'])
  expect(osa).toEqual([])
  // Another within five seconds is shown and not heard again
  await ask('k4b', 'Type it again.')
  expect(lead(own.at(-1))).toEqual([])
  expect(played).toHaveLength(1)

  // The first ask on a Mac waits for macOS's allow question without its sound, so the mod's chime is heard at once instead
  app.asks = 5
  await clock.advance(6_000)
  await ask('k4c', 'Allow it.')
  expect(lead(own.at(-1))).toEqual(['--asks', '--chime'])
  expect(played).toHaveLength(2)
  app.asks = 0

  // Notifications off in Config: only the chime; both off: nothing
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false }))
  const before = own.length
  await clock.advance(6_000)
  await ask('k5', 'Pick a name.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false, sound: false }))
  await clock.advance(6_000)
  await ask('k6', 'Pick a colour.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
})

// /claudopus and /servers, and the panel opening and closing in every chat

test('/claudopus and /servers say the panel opened, and say plainly where it can be seen when this screen has nowhere to draw it', async ($, on) => {
  world(on)
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe('Claudopus panel opened.')
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe('Servers panel opened.')
})

test('/claudopus and /servers on a screen with nowhere to draw a panel say it cannot be shown there and where it can', async ($, on) => {
  world(on, { unplaced: true })
  await $.session.start(start)
  expect((await $.command.run({ command: 'claudopus', args: '' } as never)).text).toBe("The Claudopus panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.")
  expect((await $.command.run({ command: 'servers', args: '' } as never)).text).toBe("The Servers panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.")
})

test('opened in one chat, the panel opens in every other chat, at once in one that starts and within seconds in one already running', async ($, on) => {
  const { opened, files, clock } = world(on)
  await $.session.start(start)
  expect(opened).toEqual([])
  // Another chat on this Mac opened it
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_700_000_000_500 }))
  await clock.advance(2_000)
  expect(opened).toEqual(['claudopus'])
  // Followed once: the same choice does not open it again
  await clock.advance(10_000)
  expect(opened).toEqual(['claudopus'])
  // A chat that starts while the choice stands opens it as it loads
  await $.session.start(start)
  expect(opened).toEqual(['claudopus', 'claudopus'])
})

test("a chat that starts reads the other chats before its panel opens, so they never drop out of it while it loads", async ($, on) => {
  const { files, events } = world(on)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_700_000_000_500 }))
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await $.session.start(start)
  const read = events.indexOf(`list ${MEMORY}/live/pushed`)
  expect(read).toBeGreaterThanOrEqual(0)
  expect(read).toBeLessThan(events.indexOf('open claudopus'))
})

test('/claudopus opens the panel for every chat; closed by hand it closes in every chat and work does not bring it back until asked', async ($, on) => {
  const { opened, files } = world(on)
  await $.session.start(start)
  await $.command.run({ command: 'claudopus', args: '' } as never)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
  // The person's own close, as the app raises it, keeps this choice (the test kit cannot raise a close of the person's)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_700_000_000_005 }))
  const closedAt = JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')
  expect(closedAt.isOpen).toBe(false)
  opened.length = 0
  // Work started after it was closed, here or in a chat that loads with work running, leaves it closed
  await $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'The nose on head A is flawed, can you fix it?' } as never)
  await $.session.start(start)
  expect(opened).toEqual([])
  // Asked for again, it is open for every chat again, as a choice later than the close
  await $.command.run({ command: 'claudopus', args: '' } as never)
  const again = JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')
  expect(again.isOpen).toBe(true)
  expect(again.at).toBeGreaterThan(closedAt.at)
})

test("closed by hand in another chat, the panel closes here; the mod's own close and a screen with nowhere to draw it choose nothing", async ($, on) => {
  const { closed, files, clock } = world(on, { panes: ['claudopus'] })
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: true, at: 1_699_999_999_000 }))
  await $.session.start(start)
  files.set(`${MEMORY}/panel.json`, JSON.stringify({ isOpen: false, at: 1_700_000_000_500 }))
  await clock.advance(2_000)
  expect(closed).toContain('claudopus')
  // That close is the mod's own and leaves the choice as it was
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}')).toEqual({ isOpen: false, at: 1_700_000_000_500 })
})

test('/claudopus on a screen with nowhere to draw the panel does not open it for the other chats', async ($, on) => {
  const { files } = world(on, { unplaced: true })
  await $.session.start(start)
  await $.command.run({ command: 'claudopus', args: '' } as never)
  expect(files.has(`${MEMORY}/panel.json`)).toBe(false)
})

test('someone whose panel was open before chats shared it has it open in every chat once this version loads', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus'] })
  await $.session.start(start)
  expect(JSON.parse(files.get(`${MEMORY}/panel.json`) ?? '{}').isOpen).toBe(true)
})

test('a chat whose panel was never open writes no choice as it loads', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  expect(files.has(`${MEMORY}/panel.json`)).toBe(false)
})

// The servers panel

test('the servers panel opens when asked, lists the servers running from my folders with a link, names the chat that started each, and stops one', async ($, on) => {
  const { files, killed, opened, closed, clock } = world(on, { panes: ['servers'] })
  files.set(`${HOME}/.claude/sessions/500.json`, '{"pid":500,"sessionId":"s-1","name":"Photo to 3D","cwd":"/Users/sam/x"}')
  await $.session.start(start)
  // The panel an earlier version opened by itself is put away
  expect(closed).toEqual(['agents'])
  await $.command.run({ command: 'servers', args: '' } as never)
  expect(opened).toEqual(['servers'])

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...PANE, surface } as never)
    const link = await pane.find({ type: 'Link' })
    expect(link?.props.href).toBe('http://localhost:3100')
    expect(link?.props.label).toBe('localhost:3100')
    expect((await pane.find({ type: 'Text', text: /Photo to 3D/ }))?.text).toBe('3d-sandbox · Photo to 3D')
    // The system's own listener is not one of mine
    expect(await pane.find({ type: 'Text', text: /7000/ })).toBeUndefined()
    await pane.unmount()
  }
  // Kept for when the chat's process has gone and the server has no parent left
  expect(files.get(`${MEMORY}/servers.json`)).toContain('Photo to 3D')

  const pane = await $.ui.mount({ ...PANE, surface: 'desktop' } as never)
  const press = pane.press({ key: 'kill-700' })
  await clock.advance(1000)
  await press
  expect(killed).toEqual(['700'])
  expect(await pane.find({ type: 'Link' })).toBeUndefined()
  expect((await pane.find({ type: 'Text' }))?.text).toBe('Nothing is listening from your folders.')
  await pane.unmount()
})

// Results: kept, listed, opened, answered, put away and brought back, and rounds of one work

test('finished work leaves a report for good: its pictures copied, listed under Reports, opened, answered, and named to the chat', async ($, on) => {
  const { files, submitted, clock, copied, opened } = world(on)
  const filled: string[] = []
  on('prompt.fill', (_, e) => (filled.push(e.text), { isFilled: true }))
  files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG')
  await $.session.start(start)
  await $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Weekly revenue', prompt: 'how is revenue doing' } as never)
  // A helper's answer is no report
  await $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' } as never)
  // A helper records nothing over the work it answers to
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', items: ['Count again?'], agentId: 'a2' } as never)).result).toContain('A helper records nothing')
  await $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })

  const report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.'
  // What waits on the person is what the work recorded, wherever it is in the report, not its last line
  expect((await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?', 'Post it in the channel too?'], agentId: 'a1' } as never)).result).toContain('Recorded 2')
  // A helper records nothing over the work it answers to
  await $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(10)

  const metaPath = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/meta.json')))
  const folder = (metaPath ?? '').replace('/meta.json', '')
  expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/)
  expect(files.get(`${folder}/report.md`)).toBe(`${report}\n`)
  expect(copied).toEqual([`${folder}/revenue.png`])
  const meta = JSON.parse(files.get(metaPath ?? '') ?? '{}') as { title: string; files: string[]; waiting?: { text: string; answer?: string }[]; question?: string; gist: string; folder: string }
  expect(meta.title).toBe('Weekly revenue')
  expect(meta.files).toEqual(['revenue.png'])
  expect(meta.waiting).toEqual([{ text: 'Shall I send it to the team?' }, { text: 'Post it in the channel too?' }])
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

  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  expect((await keyed(pane, 'reports-open'))?.props.label).toBe('Results 1')
  expect(await pane.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
  await pressed(pane, 'reports-open')
  expect(opened).toContain('reports')
  expect(await pane.find({ type: 'Text', text: /^Results$/ })).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await list.find({ type: 'Text', text: /^Results$/ }))?.props.bold).toBe(true)
  expect((await list.find({ type: 'Text', text: /^Waiting on you$/ }))?.props.bold).toBe(true)
  // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
  expect((await keyed(list, `report-${folder.split('/').pop()}`))?.props.label).toBe('Weekly revenue')
  expect(await list.find({ type: 'Text', text: /^\d\d:\d\d$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^●$/ })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: /Revenue rose/ })).toBeUndefined()
  expect((await keyed(list, `archive-${folder.split('/').pop()}`))?.props.label).toBe('Archive')

  // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
  await pressed(list, `report-${folder.split('/').pop()}`)
  const id = `report-${folder.split('/').pop()}`
  await until(async () => opened.includes(id) || undefined)
  const one = await $.ui.mount({ ...LIST, requestId: id, props: { ...LIST.props, title: 'Weekly revenue', bodyColumns: 80 }, surface: 'desktop' } as never)
  const heads = (await one.findAll({ type: 'Text' })).filter(text => text.props.bold).map(text => text.text)
  expect(heads).toEqual(['Weekly revenue', 'Waiting on you', 'Finding', 'Pictures', 'In full', 'Carry on'])
  expect((await one.find({ type: 'Markdown', text: /Revenue rose 12%/ }))?.props.text).toBe(`${report}\n`)
  // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
  expect(await keyed(one, 'report-page')).toBeUndefined()
  expect(await one.find({ type: 'Text', text: `${folder}/revenue.png` })).toBeDefined()
  await pressed(one, 'report-carry')
  expect(filled[0]).toContain(`${folder}/report.md`)
  // Each waiting item has its own answers; answering one clears that one alone
  expect(await one.find({ type: 'Text', text: 'Post it in the channel too?' })).toBeDefined()
  await pressed(one, 'report-say-0-Yes')
  await until(async () => submitted.length > 0 || undefined)
  expect(submitted[0]).toContain('From the Claudopus panel: The person pressed "Yes" in answer to what the result "Weekly revenue"')
  expect(submitted[0]).not.toMatch(/\b(me|my)\b/)
  expect(submitted[0]).toContain('Shall I send it to the team?')
  await until(async () => (JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting?.[0]?.answer ? true : undefined))
  expect(JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting).toEqual([{ text: 'Shall I send it to the team?', answer: 'Yes' }, { text: 'Post it in the channel too?' }])
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()
  await until(async () => ((await one.find({ type: 'Text', text: 'Shall I send it to the team?' })) ? undefined : true))
  expect(await one.find({ type: 'Text', text: 'Post it in the channel too?' })).toBeDefined()
  // Not now clears the other and sends nothing
  await pressed(one, 'report-say-1-Not now')
  await until(async () => (JSON.parse(files.get(metaPath ?? '') ?? '{}').waiting?.[1]?.answer ? true : undefined))
  expect(submitted).toHaveLength(1)
  await until(async () => ((await list.find({ type: 'Text', text: /^Waiting on you$/ })) ? undefined : true))
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeUndefined()
  expect(await one.find({ type: 'Text', text: /^Waiting on you$/ })).toBeUndefined()

  // The chat is told of the reports with each message, and reads one itself to answer from it
  const next = await $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })
  expect(next.context?.join('\n')).toContain('Results kept')
  expect(next.context?.join('\n')).toContain(`${folder}/report.md`)
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: `${folder}/report.md` } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Read', tool_use_id: 'r2', file_path: '/repo/secrets.md' } as never)).deny).toContain('Start a fresh agent')
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

  // The same work reporting again, and the report it started from, are one row: the newest
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
  expect(kin.some(label => label.includes('Revenue · this started from it'))).toBe(true)
  expect(kin.some(label => label.includes('Revenue again · earlier round'))).toBe(true)
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

test('an older report waits by its one question, a report that only ends with a question waits on nothing, and the chat is told each open item', async ($, on) => {
  const { files } = world(on)
  const base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' }
  const reps = [
    { ...base, id: 'old', title: 'Old', at: 1_600_000_000_000, gist: 'Old one.', question: 'Ship the old one?' },
    { ...base, id: 'two', title: 'Two', at: 1_600_000_100_000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?' }] },
    { ...base, id: 'ends', title: 'Ends', at: 1_600_000_200_000, gist: 'Ends asking.' },
  ]
  for (const r of reps) {
    files.set(`${MEMORY}/reports/${r.id}/meta.json`, JSON.stringify(r))
    files.set(`${MEMORY}/reports/${r.id}/report.md`, `${r.gist}\n\nShall I go on?\n`)
  }
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, requestId: 'reports', props: { ...LIST.props, title: 'Reports', bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await list.find({ type: 'Text', text: /^3$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^2$/ })).toBeDefined()
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('waits on: Ship the old one?')
  expect(told).toContain('waits on: Make it public?')
  expect(told).not.toContain('Delete the folder?')
  expect(told).not.toContain('Shall I go on?')
})

test('a result archived with one press leaves the list, its tab, the count and the note, waits on nothing, keeps its text, and comes back from the folded Archived row', async ($, on) => {
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
  expect(await list.find({ type: 'Text', text: /^Waiting on you$/ })).toBeDefined()

  // From its tab: the tab closes, nothing in it waits, and the text stays as it was
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

  // The chat is told only of the one kept, and nothing waits
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
  expect(await until(async () => list.find({ type: 'Text', text: /^Waiting on you$/ }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^2$/ })).toBeDefined()
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

test('the results list is one line a row: what waits first, the five newest, the rest folded, rounds of one work as one row, archived and told as one', async ($, on) => {
  const { files } = world(on, { panes: ['claudopus', 'reports'] })
  const base = { chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'A long line that no row shows.' }
  const at = (n: number) => 1_700_000_000_000 - n * 60_000
  const reps = [
    // A video in three rounds by three pieces of work, each started from the one before: the newest waits, the older waits are its to ask again
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
  expect((await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)).toEqual(['Results', 'Waiting on you', 'Recent'])
  expect(await titles()).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3', 'Panel change 4'])
  // Nothing under a title: no finding, no subject, no line saying it waits, no mark; the time, Archive
  expect(await list.find({ type: 'Text', text: /long line|waiting on you|Claude workflow/ })).toBeUndefined()
  expect((await list.findAll({ type: 'Text', text: /^●$/ })).length).toBe(0)
  const rowBoxes = (await list.drawn()) as unknown as { props?: { key?: string; height?: number }; children?: unknown[] }
  const heights: number[] = []
  const walk = (n: unknown) => {
    const one = n as { props?: { key?: string; height?: number }; children?: unknown[] }
    if (one?.props?.key?.startsWith('entry-')) heights.push(one.props.height ?? 0)
    for (const child of one?.children ?? []) walk(child)
  }
  walk(rowBoxes)
  expect(heights).toEqual([1, 1, 1, 1, 1, 1])
  // The rest is one row that unfolds
  expect((await keyed(list, 'earlier-fold'))?.props.label).toBe('▸ Earlier 4')
  await pressed(list, 'earlier-fold')
  expect((await titles()).slice(6)).toEqual(['Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second'])

  // The chat is told what waits now: the newest round's item, not the older rounds' asked again
  const told = (await $.prompt.submit({ text: 'what waits', wait: false, origin: composer })).context?.join('\n') ?? ''
  expect(told).toContain('Keep the third cut?')
  expect(told).not.toContain('Keep the first cut?')
  expect(told).not.toContain('Keep the second cut?')

  // Opened, its earlier rounds are listed inside it
  const tab = await $.ui.mount({ ...LIST, requestId: 'report-v3', surface: 'desktop' } as never)
  const kin = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(kin.some(label => label.includes('Video second cut · this started from it'))).toBe(true)
  expect(kin.some(label => label.includes('Explainer video · earlier round'))).toBe(true)

  // Archived from its row, every round goes
  await pressed(list, 'archive-v3')
  await until(async () => (JSON.parse(files.get(`${MEMORY}/reports/v1/meta.json`) ?? '{}').archived ? true : undefined))
  expect(['v1', 'v2', 'v3'].map(id => Boolean(JSON.parse(files.get(`${MEMORY}/reports/${id}/meta.json`) ?? '{}').archived))).toEqual([true, true, true])
  expect(await until(async () => keyed(list, 'archived-fold'))).toBeDefined()
  expect((await keyed(list, 'archived-fold'))?.props.label).toBe('▸ Archived 1')
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

// Pictures a piece of work made, in its chat

test("the pictures a work made are in its chat where it made them: drawn small where the panel can, opened whole in the Mac's own viewer on a press, a gone one named", async ($, on) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    {
      role: 'assistant',
      text: 'Drawing it.',
      toolUses: [
        { tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } },
        { tool_use_id: 'u2', tool: 'Bash', input: { command: 'sips -g pixelWidth /tmp/old/before.png', description: 'Measure the old one' }, text: 'pixelWidth: 10' },
        { tool_use_id: 'u4', tool: 'Read', input: { file_path: '/tmp/old/before.png' } },
      ],
    },
    { role: 'assistant', text: 'Here it is.', toolUses: [{ tool_use_id: 'u3', tool: 'SendUserFile', input: { files: ['/tmp/work/gone.png'], status: 'normal' } }] },
  ]
  const { files, logged, shown } = world(on, { talk })
  files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>')
  files.set('/tmp/old/before.png', 'old')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    await pressed(pane, 'open-a1')
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    const labels = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
    // The picture it wrote, under the run of steps that made it, whether that run is open or not
    expect(labels.filter(label => label.includes('chart.svg'))).toEqual([surface === 'terminal' ? '⤢ Open: chart.svg' : '⤢ Open large: chart.svg'])
    const svgs = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
    expect(svgs.map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
    expect((await tab.find({ type: 'Text', text: /^Picture: gone\.png/ }))?.text).toBe('Picture: gone.png · no longer kept')
    expect(labels.some(label => label.includes('before.png'))).toBe(false)
    // Pressed, it opens whole in a window of its own, the panel left as it was; each press opens it again
    shown.length = 0
    const was = (await keyed(tab, 'pic-open-1-0'))?.key
    await pressed(tab, 'pic-open-1-0')
    expect(shown).toEqual([['open', svg]])
    // A new key, as every press gives, so the app does not hold the view on the row last pressed
    expect((await keyed(tab, 'pic-open-1-0'))?.key).not.toBe(was)
    await pressed(tab, 'pic-open-1-0')
    expect(shown).toEqual([['open', svg], ['open', svg]])
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
})

test("in a chat the app runs on another Mac over ssh, a picture's row in Details draws it large in that tab, no tab opened, closed or opened again, and Back brings the Details again", async ($, on) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
  ]
  const { files, logged, shown, opened, closed } = world(on, { talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"/>')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  shown.length = 0
  const openedBefore = [...opened]
  const closedBefore = [...closed]
  await pressed(tab, 'pic-open-1-0')
  expect(shown.filter(one => one[0] === 'open')).toEqual([])
  expect(opened).toEqual(openedBefore)
  expect(closed).toEqual(closedBefore)
  const svgs = await tab.findAll({ type: 'Svg' })
  expect(svgs.map(one => String(one.props.alt))).toEqual(['Picture: chart.svg'])
  expect(String(svgs[0]?.props.source)).toContain('width="1200"')
  const labels = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(labels).toEqual(['← Back to Details', '← Back to Details'])
  await pressed(tab, 'pic-back-top')
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))).toContain('⤢ Open large: chart.svg')
  expect(opened).toEqual(openedBefore)
  expect(closed).toEqual(closedBefore)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

// The most characters the app draws in one tab (its renderer throws a larger drawing away whole)
const APP_DRAWING_CHARS = 262_144
// How many characters a tab's drawing holds, as the app counts them before it draws one: its texts, labels and pictures' sources
const drawnChars = async (tab: Awaited<ReturnType<EngineInterface['ui']['mount']>>) =>
  (await tab.findAll({ type: 'Svg' })).reduce((sum, one) => sum + String(one.props.source).length + String(one.props.alt ?? '').length, 0) +
  (await tab.findAll({ type: 'Text' })).reduce((sum, one) => sum + String(one.text ?? '').length, 0) +
  (await tab.findAll({ type: 'Button' })).reduce((sum, one) => sum + String(one.props.label ?? '').length, 0)

test("in a chat the app runs on another Mac over ssh, a large screenshot opened large fits in one drawing the app accepts: smaller or narrower until it does, drawn whole", async ($, on) => {
  const png = '/tmp/work/shot.png'
  const talk = [
    { role: 'user', text: 'Shoot.', toolUses: [] },
    { role: 'assistant', text: 'Shot.', toolUses: [{ tool_use_id: 'u1', tool: 'SendUserFile', input: { files: [png], status: 'normal' } }] },
  ]
  // A 2300 × 2300 screenshot: as JPEG at quality 70 its base64 is about 0.156 characters a pixel, at 55 about 0.12, as the real one measured
  let wide = 2300
  let cut = { rows: 0, quality: 70 }
  const sips = (argv: string[]) => {
    const line = argv.join(' ')
    if (line.includes('hasAlpha')) return 'pixelWidth: 2300\npixelHeight: 2300\nhasAlpha: no'
    if (line.startsWith('sips --resampleWidth ')) wide = Number(argv[2])
    if (line.startsWith('sips -c ')) cut = { rows: Number(argv[2]), quality: Number(argv[argv.indexOf('formatOptions') + 1]) }
    if (line.startsWith('sips -g pixelHeight') && line.includes('-band.')) return `pixelHeight: ${cut.rows}`
    if (line.startsWith('sips -g pixelHeight')) return `pixelHeight: ${wide}`
    return line.startsWith('sips -g') ? undefined : ''
  }
  const bytes = (path: string) => (path.includes('-band.') ? 'A'.repeat(Math.round(wide * cut.rows * (cut.quality >= 70 ? 0.156 : 0.12))) : undefined)
  const { files, logged } = world(on, { talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' }, sips, bytes })
  files.set(png, 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Shoot.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await pressed(tab, 'pic-open-1-0')
  // The copy is made out of the drawing, which is drawn again once it is ready
  for (let tries = 0; tries < 50 && !(await tab.findAll({ type: 'Svg' })).length; tries += 1) await new Promise(done => setTimeout(done, 20))
  const svgs = await tab.findAll({ type: 'Svg' })
  expect(svgs.length).toBeGreaterThan(0)
  // The bands, one under the other, are the whole picture at one width
  const widths = new Set(svgs.map(one => Number(/width="(\d+)"/.exec(String(one.props.source))?.[1])))
  expect(widths.size).toBe(1)
  const width = [...widths][0] ?? 0
  expect(svgs.reduce((sum, one) => sum + Number(/height="(\d+)"/.exec(String(one.props.source))?.[1] ?? 0), 0)).toBe(width)
  // 2000 wide would be about 620000 characters, which the app throws away whole; this is the widest that fits
  expect(width).toBe(1000)
  expect(await drawnChars(tab)).toBeLessThan(APP_DRAWING_CHARS)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

test("a Details tab's small pictures together stay under what the app draws in one tab; one past that is a row that opens it", async ($, on) => {
  const shots = [1, 2, 3, 4, 5, 6].map(n => `/tmp/work/shot-${n}.png`)
  const talk = [
    { role: 'user', text: 'Shoot.', toolUses: [] },
    ...shots.map((path, n) => ({ role: 'assistant', text: `Shot ${n + 1}.`, toolUses: [{ tool_use_id: `u${n}`, tool: 'SendUserFile', input: { files: [path], status: 'normal' } }] })),
  ]
  // Each small copy as large as one may be: 36000 bytes, 48000 characters of base64
  const sips = (argv: string[]) => (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 360\npixelHeight: 240' : '')
  const bytes = (path: string) => (path.includes('/thumbs/') ? 'A'.repeat(48_000) : undefined)
  const { files, logged } = world(on, { talk, sips, bytes })
  for (const path of shots) files.set(path, 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Shoot.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  const small = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
  // Three fit; the other three are rows that open them
  expect(small.length).toBe(3)
  expect((await tab.findAll({ type: 'Button' })).filter(one => String(one.props.label).startsWith('⤢')).length).toBe(6)
  expect(await drawnChars(tab)).toBeLessThan(APP_DRAWING_CHARS)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

// Memory files in the mod's tabs, and the Memory button

test('a memory path in a reply opens in a tab of the mod on the desktop, never the app file pane; the terminal keeps its own', async ($, on) => {
  const { files, tabs } = world(on)
  files.set(`${MEMORY}/words/chat-1.md`, `# Launch video\n\nSee also ${MEMORY}/streams/launch.md.\n`)
  files.set(`${MEMORY}/streams/launch.md`, '# Launch\n\nThe brief.\n')
  await $.session.start(start)
  const MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'm1' } as const
  const said = `Its account is in \`${MEMORY}/words/chat-1.md\`, and [the brief](${MEMORY}/streams/launch.md); the repo is /repo/x.md. **${MEMORY}/index.md** at ${MEMORY}/log.md:12, run \`cat ${MEMORY}/log.md\`.\n\n\`\`\`\ncat ${MEMORY}/log.md\n\`\`\``

  // The terminal draws the reply as the engine does
  const plain = await $.ui.mount({ ...MSG, props: { text: said, isFirstOfReply: true }, surface: 'terminal' } as never)
  expect(await plain.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  const reply = await $.ui.mount({ ...MSG, props: { text: said, isFirstOfReply: true }, surface: 'desktop' } as never)
  const drawn = await reply.find({ type: 'Markdown' })
  const words = `file://${MEMORY}/words/chat-1.md`
  expect(drawn?.props.text).toContain(`[\`${MEMORY}/words/chat-1.md\`](${words})`)
  expect(drawn?.props.text).toContain(`[the brief](file://${MEMORY}/streams/launch.md)`)
  // Other paths and a fenced block stay as written
  expect(drawn?.props.text).toContain('the repo is /repo/x.md.')
  expect(drawn?.props.text).toContain(`cat ${MEMORY}/log.md\n`)
  // Bold keeps its marks, a line number is not the file's, and code holding more than a path stays code
  expect(drawn?.props.text).toContain(`**[${MEMORY}/index.md](file://${MEMORY}/index.md)**`)
  expect(drawn?.props.text).toContain(`[${MEMORY}/log.md:12](file://${MEMORY}/log.md),`)
  expect(drawn?.props.text).toContain(`run \`cat ${MEMORY}/log.md\`.`)
  expect(drawn?.props.pressableLinks).toEqual([words, `file://${MEMORY}/streams/launch.md`, `file://${MEMORY}/index.md`, `file://${MEMORY}/log.md`])
  // A reply whose only memory path is in code is the engine's
  const coded = await $.ui.mount({ ...MSG, requestId: 'm3', props: { text: `\`\`\`\ncat ${MEMORY}/log.md\n\`\`\``, isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await coded.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // A reply with no memory path is the engine's
  const other = await $.ui.mount({ ...MSG, requestId: 'm2', props: { text: 'See /repo/x.md', isFirstOfReply: true }, surface: 'desktop' } as never)
  expect(await other.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // Pressed, the file opens in a tab of its own named after its heading, and a memory link in it opens there too
  await reply.press({ key: String(drawn?.key), link: { href: words } })
  const opened = await until(async () => tabs.find(tab => tab.startsWith('memory-words-chat-1-md-')))
  expect(opened).toMatch(/^memory-words-chat-1-md-\d+: Launch video$/)
  const tab = await $.ui.mount({ ...LIST, requestId: (opened ?? '').split(':')[0], surface: 'desktop' } as never)
  const text = await tab.find({ type: 'Markdown' })
  expect(text?.props.text).toContain('# Launch video')
  expect(text?.props.text).toContain(`[${MEMORY}/streams/launch.md](file://${MEMORY}/streams/launch.md).`)
  await tab.press({ key: String(text?.key), link: { href: `file://${MEMORY}/streams/launch.md` } })
  expect(await until(async () => tabs.find(one => /^memory-streams-launch-md-\d+: Launch$/.test(one)))).toBeDefined()
})

test('Memory, beside Stats, opens the memory folder in Finder', async ($, on) => {
  const { shown } = world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'memory-open'))?.props.label).toBe('Memory')
  await pressed(pane, 'memory-open')
  expect(await until(async () => shown.find(argv => argv[1] === MEMORY))).toEqual(['open', MEMORY])
})

// Workflows: the blue card

// A workflow as its script's meta names it: two stages, the maker's and the checker's
const ROUNDS = `export const meta = {
  name: 'rounds',
  description: 'A maker builds it, a separate checker holds it to the bar',
  phases: [
    { title: 'Make', detail: 'the maker builds it', model: 'opus' },
    { title: 'Check', detail: 'the checker tests it against the bar', model: 'opus' },
  ],
}
phase('Make')`
const journal = (...lines: object[]) => lines.map(one => JSON.stringify(one)).join('\n')

test('a workflow the chat starts is one blue card: how many agents, its rounds as squares with the step being run, the last round checked, nothing cut at any width, and Details with each round and agent chat; ended, it is under Finished', async ($, on) => {
  const { files, tabs, clock, played, notified } = world(on, { panes: ['claudopus'], art: true })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the roman numerals right', wait: false, origin: composer })
  // The chat's own thread starts it: a workflow is delegation, as an agent is
  const call = await $.tool.call({ tool: 'Workflow', tool_use_id: 'w1', script: ROUNDS, args: { title: 'Roman numerals', task: 'Write to_roman.', bar: 'Every case holds.', folder: '/repo', cap: 3 } } as never)
  expect(call.deny).toBeUndefined()
  // Its agents belong to its card, each with the model it was asked for
  await $.agent.spawn({ ...spawn, description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 1 } } as never)
  await $.agent.spawn({ ...spawn, description: 'checker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 2 } } as never)
  await $.agent.spawn({ ...spawn, description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 3 } } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  files.set(
    '/t/wf_1/journal.jsonl',
    journal(
      { type: 'launched' },
      { type: 'started', agentId: 'a1', label: 'maker', phase: 'Make' },
      { type: 'result', agentId: 'a1', result: 'Wrote roman.py.' },
      { type: 'started', agentId: 'a2', label: 'checker', phase: 'Check' },
      { type: 'result', agentId: 'a2', result: { pass: false, why: 'to_roman(True) is not refused', findings: ['to_roman(True) returns I'] } },
      { type: 'started', agentId: 'a3', label: 'maker', phase: 'Make' },
    ),
  )
  // The maker's chat, as its transcript keeps it: what it was told and wrote, never its thinking
  files.set(
    '/t/wf_1/agent-a3.jsonl',
    journal(
      { type: 'user', message: { role: 'user', content: 'Fix what the checker found.' } },
      { type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'SECRET THOUGHT' }, { type: 'text', text: 'Booleans are refused now.' }] } },
    ),
  )
  await clock.advance(2000)

  let pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // One card for the run, none for its agents
  expect(await until(async () => pane.find({ type: 'Text', text: /^Roman numerals$/ }))).toBeDefined()
  expect(await keyed(pane, 'open-a1')).toBeUndefined()
  // Where it stands in as many words as fit its row: the models give way to the agents' count on a card this narrow
  expect(await pane.find({ type: 'Text', text: /^Workflow · 3 agents · \d+s$/ })).toBeDefined()
  // The run as squares, one per step, grouped by round: round 1's make done and its check failed, round 2's make running and its
  // check not started. No moving dots
  const squares = (await pane.findAll({ type: 'Svg' })).find(one => /^round 1/.test(String(one.props.alt)))
  expect(squares?.props.alt).toBe('round 1: done, failed; round 2: running, waiting')
  expect(String(squares?.props.source)).toContain('#E5534B')
  expect(String(squares?.props.source)).toContain('#4E93EF')
  expect(String(squares?.props.source).match(/<rect/g)).toHaveLength(4)
  // What is happening now in one plain line, and each checked round in a few words: no "under way", nothing cut
  expect((await pane.find({ type: 'Text', text: /^Making$/ }))?.props.color).toBe('#4E93EF')
  expect(await pane.find({ type: 'Text', text: /^to_roman\(True\) is not refused$/ })).toBeDefined()
  // Who is in it is said once, in Details: the card names no role or model
  expect((await pane.findAll({ type: 'Text' })).filter(one => /maker|checker|Opus|Sonnet/.test(String(one.text)) && !/This chat/.test(String(one.text)))).toEqual([])
  const said = (await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(said.filter(one => one.includes('…') || one.includes('under way'))).toEqual([])
  expect((await pane.findAll({ type: 'Text' })).filter(one => one.props.wrap === 'truncate-end' && /Workflow|Roman/.test(String(one.text)))).toEqual([])
  expect((await pane.find({ type: 'Text', text: /^round 2 of 3$/ }))?.props.color).toBe('#4E93EF')
  // On a narrow panel every line still fits whole, shortened and never cut
  await pane.unmount()
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 16 }, surface: 'desktop' } as never)
  await until(async () => narrow.find({ type: 'Text', text: /^Roman numerals$/ }))
  expect(await narrow.find({ type: 'Text', text: /^Workflow · 3 agents · \d+s$/ })).toBeDefined()
  expect(await narrow.find({ type: 'Text', text: /^Making$/ })).toBeDefined()
  expect(await narrow.find({ type: 'Text', text: /^to_roman\(True\)$/ })).toBeDefined()
  await narrow.unmount()
  // On a wide panel the checker's words are whole
  const wide = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await until(async () => wide.find({ type: 'Text', text: /^Roman numerals$/ }))
  expect(await wide.find({ type: 'Text', text: /^Round 1: to_roman\(True\) is not refused$/ })).toBeDefined()
  expect(await wide.find({ type: 'Text', text: /^Workflow · 3 agents · \d+k tokens · \d+s$/ })).toBeDefined()
  await wide.unmount()
  pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A surface that draws no pictures has the squares as letters
  const words = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  await until(async () => words.find({ type: 'Text', text: /^Roman numerals$/ }))
  expect((await words.findAll({ type: 'Text', text: /^[■□]$/ })).map(one => one.text).join('')).toBe('■■■□')
  await words.unmount()
  expect(await pane.find({ type: 'Text', text: /^Working on 1 thing$/ })).toBeDefined()
  // Kept in a file of its own, for the chat that started this session
  expect(JSON.parse(files.get(`${MEMORY}/flows/wf_1.json`) ?? '{}').session).toBe('local_1')

  // Details: a tab of its own in front, with its stages, its rounds and the maker's chat
  await pressed(pane, 'flow-open-wf_1')
  expect(await until(async () => tabs.includes('flow-wf_1: Roman numerals') || undefined)).toBe(true)
  const tab = await $.ui.mount({ ...LIST, requestId: 'flow-wf_1', surface: 'desktop' } as never)
  expect(await tab.find({ type: 'Text', text: /^the checker tests it against the bar · Opus 5.5 · 1 agent$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Round 1: failed: to_roman\(True\) is not refused$/ })).toBeDefined()
  // Each failed round lists what the checker found, and each round has its own squares
  expect(await tab.find({ type: 'Text', text: /^– to_roman\(True\) returns I$/ })).toBeDefined()
  expect((await tab.findAll({ type: 'Svg' })).map(one => one.props.alt)).toEqual(['round 1: done, failed; round 2: running, waiting', 'round 1: done, failed', 'round 2: running, waiting'])
  expect(await tab.find({ type: 'Text', text: /^Chat of the maker, round 2$/ })).toBeDefined()
  expect(await tab.find({ type: 'Markdown', text: /Booleans are refused now/ })).toBeDefined()
  expect(JSON.stringify(await tab.findAll({ type: 'Markdown' }))).not.toContain('SECRET')
  // Another agent's chat is a press away
  await pressed(tab, 'flow-pick-a2')
  expect(await until(async () => tab.find({ type: 'Text', text: /^Chat of the checker, round 1$/ }))).toBeDefined()
  await tab.unmount()

  // The notice that it ended ends its card: it leaves the running cards and is under Finished
  await $.prompt.submit({ text: '<task-notification><task-id>wt1</task-id><status>completed</status><result>passed in 2 rounds</result></task-notification>', wait: false, origin: { kind: 'task-notification' } } as never)
  expect(await until(async () => ((await pane.find({ type: 'Text', text: /^Just finished$/ })) ? true : undefined))).toBe(true)
  // For two seconds it stays where it was, green, with no Stop, and nothing is under Finished yet
  expect(await pane.find({ type: 'Text', text: /^Roman numerals$/ })).toBeDefined()
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect(await pane.find({ type: 'Button', key: 'flow-stop-wf_1' })).toBeUndefined()
  // A workflow that passed makes the octopus happy for its pause too, then it rests
  const octopus = async () => (await pane.findAll({ type: 'Svg' })).map(one => String(one.props.alt)).find(alt => /^Claudopus/.test(alt))
  expect(await octopus()).toBe('Claudopus, work finished')
  expect((await pane.findAll({ type: 'Button' })).some(b => /Finished/.test(String(b.props.label)))).toBe(false)
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /^Roman numerals$/ })).toBeUndefined()
  expect(await octopus()).toBe('Claudopus')
  await pressed(pane, 'finished-fold')
  expect(await until(async () => pane.find({ type: 'Text', text: /^Finished · Workflow/ }))).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/flows/wf_1.json`) ?? '{}').result).toBe('passed in 2 rounds')
  // Its end was heard and told, as a piece of work's is
  expect(played).toEqual(['sounds/ready.wav'])
  expect(notified).toEqual(['Roman numerals | passed in 2 rounds'])
  await pane.unmount()
})

// The Stats and About tabs, and the bar of buttons

test('Stats opens in front from its button beside Results, and adds up this chat\'s work from its records: tokens, work, time saved, cost', async ($, on) => {
  const { files, opened, tabs } = world(on)
  const M = 60_000
  const now = 1_700_000_000_000
  const chat = `${HOME}/.claude/projects/-repo`
  const subs = `${chat}/engine-id/subagents`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [], d: [], turns: [[now - 30 * M, now - 30 * M + 20_000]] }))
  // Two pieces of work that ran side by side for ten minutes
  for (const [id, from, to, output] of [['w1', now - 30 * M, now - 10 * M, 1_000_000], ['w2', now - 20 * M, now - 10 * M, 500_000]] as const) {
    files.set(`${subs}/agent-${id}.jsonl`, '{}')
    files.set(`${subs}/agent-${id}.meta.json`, JSON.stringify({ description: `Work ${id}`, spawnDepth: 1, finished: true }))
    files.set(`${subs}/agent-${id}.jsonl.sum`, JSON.stringify({ s: [[from, to]], u: [[`m-${id}`, 'claude-opus-5-5', from + M, 0, 0, 0, 0, 0, 0, output]], d: [[from + M, 'Do it', 'done', '']] }))
  }
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'stats-open'))?.props.label).toBe('Stats')
  await pressed(pane, 'stats-open')
  expect(opened).toContain('stats')
  expect(tabs).toContain('stats: Stats')
  const stats = await $.ui.mount({ ...LIST, requestId: 'stats', props: { ...LIST.props, title: 'Stats', bodyColumns: 80 }, surface: 'desktop' } as never)
  // At the top, what is counted: this chat, today, each chosen one filled and bold
  expect((await stats.find({ type: 'Text', text: /^This chat$/ }))?.props.bold).toBe(true)
  expect((await stats.find({ type: 'Text', text: 'Today' }))?.props.bold).toBe(true)
  expect((await keyed(stats, 'scope-All chats'))?.props.label).toBe('All chats')
  // Once read: 1.5M output tokens on Opus 5.5 at $20 a million, two pieces finished, two to-dos, 30 minutes of work in 20
  expect(await until(async () => stats.find({ type: 'Text', text: 'Saved by running side by side' }))).toBeDefined()
  expect(await stats.find({ type: 'Text', text: 'Opus 5.5' })).toBeDefined()
  expect(await stats.find({ type: 'Text', text: '1.5M' })).toBeDefined()
  expect(await stats.find({ type: 'Text', text: '$30.00' })).toBeDefined()
  const value = async (name: string) => {
    const rows = (await stats.findAll({ type: 'Text' })).map(one => one.text)
    return rows[rows.indexOf(name) + 1]
  }
  // The headline: time saved, cost, work done
  expect(await value('10m')).toBe('time saved')
  expect(await value('Pieces of work done')).toBe('2')
  expect(await value('To-dos done')).toBe('2')
  expect(await value('Work added up')).toBe('30m')
  expect(await value('On the clock')).toBe('20m')
  expect(await value('Saved by running side by side')).toBe('10m')
  expect(await value('The chat’s reply, on average')).toBe('20s')
  // The sums are kept, so the transcripts are read again only when they change
  expect(JSON.parse(files.get(`${MEMORY}/stats/engine-id.json`) ?? '{}').folder).toBe(chat)
})

test('the bar keeps its buttons whole on a row of their own under the header, wrapping in a narrow pane', async ($, on) => {
  world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 30 }, surface: 'desktop' } as never)
  const row = (await pane.findAll({ type: 'Box' })).find(one => one.key === 'head-buttons')
  expect(row?.props.flexWrap).toBe('wrap')
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About'])
  // The chat's size is no longer squeezed beside the buttons
  expect(await pane.find({ type: 'Text', text: /^This chat:/ })).toBeDefined()
})

test('the header names the version this chat loaded beside Claudopus, and a newer one the Mac has installed, on the same line', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  const version = async (pane: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; text?: string; props: Record<string, unknown> }[]> }) =>
    (await pane.findAll({ type: 'Text' })).find(one => /^v\d/.test(one.text ?? ''))
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  const name = (await pane.findAll({ type: 'Box' })).find(one => one.key === 'head-name')
  expect(name?.props.flexDirection).toBe('row')
  const shown = await version(pane)
  expect(shown?.text).toBe('v0.1.0')
  expect(shown?.props.dimColor).toBe(true)
  // The header keeps its three lines: the name, what runs, this chat's size
  expect(await pane.find({ type: 'Text', text: /^This chat:/ })).toBeDefined()
  // The installed version is Claude Code's own record, not the last look's: a copy run from a folder of its code has none, so a
  // newer version in update.json names nothing (an installed copy's is read from installed_plugins.json, tested in update.test)
  await pane.unmount()
  files.set(`${MEMORY}/update.json`, JSON.stringify({ at: 1, version: '0.1.1', result: 'updated' }))
  const later = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await version(later))?.text).toBe('v0.1.0')
  await later.unmount()
  // In a narrow pane the name stays whole; only the version shortens
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 24 }, surface: 'desktop' } as never)
  const whole = (await narrow.findAll({ type: 'Box' })).find(one => one.key === 'head-name')
  expect(whole?.props.minWidth).toBe(0)
  expect(await narrow.find({ type: 'Text', text: 'Claudopus' })).toBeDefined()
  await narrow.unmount()
  files.set(`${MEMORY}/update.json`, JSON.stringify({ at: 2, version: '0.1.0', result: 'none' }))
  const same = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await version(same))?.text).toBe('v0.1.0')
})

test('About says what Claudopus is, its version and the app\'s, and links the site, the code and its licence', async ($, on) => {
  const { tabs } = world(on)
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'about-open')
  expect(await until(async () => tabs.find(tab => tab === 'about: About'))).toBe('about: About')
  const about = await $.ui.mount({ ...LIST, requestId: 'about', props: { ...LIST.props, title: 'About', bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await about.find({ type: 'Text', text: 'Version 0.1.0 · Claude Code 2.1.321' })).toBeDefined()
  expect(await about.find({ type: 'Text', text: 'What it does' })).toBeDefined()
  // The principles are not shown there
  expect(await about.find({ type: 'Text', text: 'My words are the spec.' })).toBeUndefined()
  const links = (await about.findAll({ type: 'Link' })).map(one => one.props.href)
  expect(links).toEqual(['https://claudopus.ai', 'https://github.com/dimka3553/claudopus', 'https://github.com/dimka3553/claudopus/blob/main/LICENSE'])
  expect(await about.find({ type: 'Text', text: /a star on GitHub/ })).toBeDefined()
})

// ---- The changelog and the update screen ----

const CHANGELOG = [
  '# Changelog',
  '',
  '## 0.1.0 · 13 November 2026',
  '- The panel shows what changed.',
  '- A second change.',
  '',
  '## 0.0.9 · 12 November 2026',
  '- Pictures open large.',
  '',
  '## 0.0.8 · 11 November 2026',
  '- An old change.',
  '',
].join('\n')

test('About opens the changelog in a tab of its own, every version newest first, the one this chat runs marked', async ($, on) => {
  const { tabs } = world(on, { changelog: CHANGELOG })
  await $.session.start(start)
  const about = await $.ui.mount({ ...LIST, requestId: 'about', props: { ...LIST.props, title: 'About', bodyColumns: 60 }, surface: 'desktop' } as never)
  expect((await keyed(about, 'about-changelog'))?.props.label).toBe('Changelog')
  await pressed(about, 'about-changelog')
  expect(await until(async () => tabs.find(tab => tab === 'changelog: Changelog'))).toBe('changelog: Changelog')
  const log = await $.ui.mount({ ...LIST, requestId: 'changelog', props: { ...LIST.props, title: 'Changelog', bodyColumns: 60 }, surface: 'desktop' } as never)
  const texts = (await log.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts.filter(one => /^v0\./.test(one))).toEqual(['v0.1.0', 'v0.0.9', 'v0.0.8'])
  expect(texts).toContain('13 November 2026 · this chat')
  expect(texts).toContain('Pictures open large.')
})

test('a newer version than the one whose changes were seen covers the panel with what changed since, until Back to the panel', async ($, on) => {
  const { files } = world(on, { changelog: CHANGELOG })
  files.set(`${MEMORY}/seen.json`, JSON.stringify({ version: '0.0.8' }))
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => pane.find({ type: 'Text', text: 'Claudopus updated' }))).toBeDefined()
  const texts = (await pane.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts).toContain('v0.0.8 → v0.1.0 · 2 versions')
  expect(texts.filter(one => /^v0\.\d\.\d+$/.test(one))).toEqual(['v0.1.0', 'v0.0.9'])
  expect(texts).not.toContain('An old change.')
  // The whole panel: no header buttons under it
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).not.toContain('Stats')
  await pressed(pane, 'update-top-close')
  expect(JSON.parse(files.get(`${MEMORY}/seen.json`) ?? '{}').version).toBe('0.1.0')
  await pane.unmount()
  const after = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => (await after.findAll({ type: 'Button' })).find(b => b.props.label === 'Stats'))).toBeDefined()
  expect(await after.find({ type: 'Text', text: 'Claudopus updated' })).toBeUndefined()
  // A load of the same version again shows nothing
  await after.unmount()
  await $.session.start(start)
  const again = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => (await again.findAll({ type: 'Button' })).find(b => b.props.label === 'Stats'))).toBeDefined()
  expect(await again.find({ type: 'Text', text: 'Claudopus updated' })).toBeUndefined()
})

test('a first install starts the record of changes seen at its own version, and shows no update screen', async ($, on) => {
  const { files } = world(on, { changelog: CHANGELOG })
  await $.session.start(start)
  expect(JSON.parse(files.get(`${MEMORY}/seen.json`) ?? '{}').version).toBe('0.1.0')
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 60 }, surface: 'desktop' } as never)
  expect(await until(async () => (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Stats'))).toBeDefined()
  expect(await pane.find({ type: 'Text', text: 'Claudopus updated' })).toBeUndefined()
})

// Config: the person's own texts, settings, and models

test('a copy of the principles in the memory folder is the person\'s own: every conversation carries it in place of the shipped ones', async ($, on) => {
  const { files } = world(on)
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  const MINE = '# Mine\n\n## Core truths\n\n- Mine come first.\n\n## Checking\n\n1. Look at it.\n'
  files.set(`${MEMORY}/rules/CLAUDE.md`, MINE)
  await $.session.start(start)
  const told = await $.prompt.context({ blocks: [], instructionFiles: [{ path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' }] })
  expect(told.instructionFiles?.find(one => one.kind === 'user')).toEqual({ path: `${MEMORY}/rules/CLAUDE.md`, kind: 'user', content: MINE })
  expect(told.instructionFiles?.some(one => one.content === PRINCIPLES)).toBe(false)
})

test('Config lists each thing a person can set with what is in force, edits a text as their own copy, changes a setting and puts each back', async ($, on) => {
  const { files, shown, tabs } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', other: 1 }))
  await $.session.start(start)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBe('config: Config')
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  for (const name of ['Principles', "The chat's rules", 'Work rules', 'Your name', 'Background work', 'Sound', 'Notifications', 'Automatic updates', 'Most work', 'Long legwork', 'Heavy work'])
    expect(await config.find({ type: 'Text', text: name })).toBeDefined()
  // Only what differs from what shipped has a Reset: here the name
  expect((await config.findAll({ type: 'Button' })).filter(one => one.props.label === 'Reset').length).toBe(1)
  // Open file makes the person's own copy from the shipped text and opens it in their editor
  await pressed(config, 'config-text-principles-open')
  expect(files.get(`${MEMORY}/rules/CLAUDE.md`)).toBe(PRINCIPLES)
  expect(shown.at(-1)).toEqual(['open', '-t', `${MEMORY}/rules/CLAUDE.md`])
  // A copy still the same as what shipped is no change of theirs
  expect((await config.findAll({ type: 'Text', text: /As shipped\.$/ })).length).toBe(3)
  // Edit opens the text in the tab; Save makes it the person's own
  await pressed(config, 'config-text-work-edit')
  await config.input({ key: 'config-text-work-input', text: 'MY WORK RULES' })
  expect(files.get(`${MEMORY}/roles/work.md`)).toBe('MY WORK RULES\n')
  expect(await config.find({ type: 'Input', key: 'config-text-work-input' })).toBeUndefined()
  // Without the places the shipped rules fill, it is said to lack what an update added
  expect(await config.find({ type: 'Text', text: /Edited by you, before an update added parts yours lacks/ })).toBeDefined()
  // Reset moves it aside, and the shipped text is in force again
  await pressed(config, 'config-text-work-back')
  expect(files.has(`${MEMORY}/roles/work.md`)).toBe(false)
  expect([...files.entries()].find(([path]) => /\/roles\/work\.md\.\d{8}-\d{6}\.old$/.test(path))?.[1]).toBe('MY WORK RULES\n')
  expect((await config.findAll({ type: 'Text', text: /As shipped\.$/ })).length).toBe(3)
  // A setting is written to config.json, every other key kept; Reset takes the key out
  await pressed(config, 'config-sound-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1, sound: false })
  await pressed(config, 'config-sound-back')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1 })
  // Automatic updates are on as shipped; Off writes updates: false, and On takes the key out again
  await pressed(config, 'config-updates-off')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1, updates: false })
  await pressed(config, 'config-updates-on')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', other: 1 })
  await config.input({ key: 'config-name-input', text: 'Alex' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').name).toBe('Alex')
  await pressed(config, 'config-name-back')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').name).toBeUndefined()
})

test('the model each kind of work runs on comes from Config, and the chat\'s and work\'s rules name it', async ($, on) => {
  const { files } = world(on, { chatRole: 'CHAT ROLE\n- {models}' })
  await $.session.start(start)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  await config.select({ key: 'config-model-legwork-pick', value: 'opus' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ models: { legwork: 'opus' } })
  // The chat is told at its next message, and the work's rules name the helpers' model
  const told = (await $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })) as { context?: string[] }
  expect((told.context ?? []).join('\n')).toContain('Long legwork such as indexing runs on Opus 5.5, `model: "opus"`.')
  await $.agent.spawn({ ...spawn, prompt: 'index the photos' } as never)
  expect(prompts[0]).not.toContain('{helpers}')
  expect(prompts[0]).not.toContain('{checker}')
  // Picking what shipped takes the key out again
  await config.select({ key: 'config-model-legwork-pick', value: 'sonnet' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({})
})

test('Check for updates in Config shows it is checking, then what it found; a second press meanwhile starts no second look', async ($, on) => {
  world(on)
  // The tests run the mod from a folder of its code, as its maker does: only the version page is read, and nothing is downloaded
  let page = '{"version":"0.1.0"}'
  let answer: (() => void) | undefined
  let fetches = 0
  on('http.fetch', async () => {
    fetches += 1
    await new Promise<void>(done => (answer = done))
    return { value: { status: 200, ok: true, headers: {}, text: page } } as never
  })
  const release = () => {
    const one = answer
    answer = undefined
    one?.()
  }
  await $.session.start(start)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'This chat runs v0.1.0' })).toBeDefined()
  await pressed(config, 'config-check')
  expect(await until(() => config.find({ type: 'Text', text: 'Checking…' }))).toBeDefined()
  // While it checks there is no button to press again
  expect((await config.findAll({ type: 'Button' })).some(one => one.props.label === 'Check for updates')).toBe(false)
  release()
  expect(await until(() => config.find({ type: 'Text', text: /^You're on the newest version \(v0\.1\.0\)/ }))).toBeDefined()
  expect(fetches).toBe(1)
  // A newer release: said, with what to do for a copy run from its folder
  page = '{"version":"0.1.2"}'
  await pressed(config, 'config-check')
  await until(async () => answer)
  release()
  expect(await until(() => config.find({ type: 'Text', text: /^v0\.1\.2 is out\. This copy runs from a folder of its code/ }))).toBeDefined()
  // No answer that reads as a version: said as a failure, in the error colour
  page = 'oops'
  await pressed(config, 'config-check')
  await until(async () => answer)
  release()
  const failed = await until(() => config.find({ type: 'Text', text: /^Couldn't check/ }))
  expect(failed?.props.color).toBe('error')
})

// The asking card: an ask, its Copy, buttons and reply box

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
  // Or a reply in the person's own words, right on the small card: the reply goes to the work and the amber goes at once, the card
  // saying briefly what was answered; the box is in Details too
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(false)
  expect((await ears.findAll({ type: 'Input' } as never)).some(one => /-reply-/.test(one.key ?? ''))).toBe(true)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  expect(box?.props.placeholder).toBe('Or reply in your own words')
  await list.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))).toContain('Submit it to the plugin directory.')
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' })) ? undefined : true))).toBe(true)
  expect(await ears.find({ type: 'Text', text: 'Needs you now' })).toBeUndefined()
  expect(await list.find({ type: 'Input' } as never)).toBeUndefined()
  const waiting = '✓ You answered “Where do I do that?” · it reads this at its next step'
  expect(await until(async () => list.find({ type: 'Text', text: waiting }))).toBeDefined()
  expect(await until(async () => ears.find({ type: 'Text', text: waiting }))).toBeDefined()
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  expect(await until(async () => list.find({ type: 'Text', text: '✓ You answered “Where do I do that?” · it has read it' }))).toBeDefined()
  // The work asks again: amber again, with an empty box
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

test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', async ($, on) => {
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
  expect(String(asked.result)).toContain('Its 2 pictures are named with it')
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

test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', async ($, on) => {
  const { files, logged, keychain, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, text: 'Claudopus needs GITHUB_TOKEN for work in this chat.', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  // The chat is told only the name, and where to type it
  expect(await until(async () => logged.find(line => line.includes('GITHUB_TOKEN')))).toContain('top of the Claudopus panel')
  const field = await until(async () => (await list.findAll({ type: 'Input' } as never)).find(one => (one.key ?? '').startsWith(`box-${id}-field`)))
  expect(field).toBeDefined()
  expect((await list.find({ type: 'Text', text: 'Claudopus needs GITHUB_TOKEN for work in this chat.' }))?.props.color).toBe('#E5A50A')
  const value = 'ghp_s3cret"with\\quote'
  await list.input({ key: field?.key ?? '', text: value })
  // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
  expect(await until(async () => keychain.find(one => one.includes(id)))).toBe(`add-generic-password -U -s "claudopus-box" -a "${id}" -l "Claudopus box" -w "ghp_s3cret\\"with\\\\quote"\n`)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Claudopus needs GITHUB_TOKEN for work in this chat.' })) ? undefined : true))).toBe(true)
  // Nowhere else: not the chat, its saved words, the log or any file
  expect(logged.some(line => line.includes('s3cret'))).toBe(false)
  expect([...files.values()].some(text => text.includes('s3cret'))).toBe(false)
  // A curly quote from a phone's keyboard, which security would give back as hex, is not sent, and the box says why
  const third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${third}.json`, JSON.stringify({ id: third, text: 'Claudopus needs NPM_TOKEN for work on this Mac.', at: 1_700_000_000_000 }))
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
  files.set(`${MEMORY}/boxes/${other}.json`, JSON.stringify({ id: other, text: 'Claudopus needs the admin password of this Mac to run an admin command for work in this chat.', at: 1_700_000_000_000 }))
  await clock.advance(1000)
  const cancel = await until(async () => (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith(`box-${other}-cancel`)))
  await list.press({ key: cancel?.key ?? '' })
  expect(await until(async () => (files.has(`${MEMORY}/boxes/${other}.json`) ? undefined : true))).toBe(true)
})

test('a chat on this Mac\'s own screen draws no box: there the runners show their own', async ($, on) => {
  const { files, logged, clock } = world(on)
  await $.session.start(start)
  const id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98'
  files.set(`${MEMORY}/boxes/${id}.json`, JSON.stringify({ id, text: 'Claudopus needs GITHUB_TOKEN for work in this chat.', at: 1_700_000_000_000 }))
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Claudopus needs GITHUB_TOKEN for work in this chat.' })).toBeUndefined()
  expect(logged.some(line => line.includes('GITHUB_TOKEN'))).toBe(false)
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

test('an answer that reaches ended work from a timer is sent from inside the next hook, where the work keeps its tools; with none soon, from the timer all the same', async ($, on) => {
  const { resumed, files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Restart the old chat', prompt: 'restart the old chat' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] } as never)
  await $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' } as never)
  // Another chat leaves an answer, which this chat's timer takes: from there the engine would skip the mod's hooks in the work it woke
  files.set(`${MEMORY}/live/answers/engine-id/0-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', at: 1_700_000_000_000 }))
  await clock.advance(6000)
  expect(files.has(`${MEMORY}/live/answers/engine-id/0-a.json`)).toBe(false)
  expect(['from the timer', ...resumed.filter(line => line.startsWith('a1: '))]).toEqual(['from the timer'])
  // so it waits for a hook: the chat's next prompt sends it from there
  await $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })
  expect(resumed.filter(line => line.startsWith('a1: ')).map(line => line.includes('replied') && line.includes('Approve'))).toEqual([true])
  // The woken work's first step reads it
  for await (const _ of $.turn.step({ turnId: 'turn-1b', index: 0, model: 'm', messageCount: 2, agentId: 'a1' })) void _

  // A second answer, with no hook for WAKE_WAIT in a chat where nothing runs, is sent from the timer all the same, and said so: the
  // work does what it was asked, and its rules have it end with its ask in its report when the panel does not answer
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'And the other one?', choices: ['Yes'] } as never)
  await $.turn.complete({ answer: 'Waiting again.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  files.set(`${MEMORY}/live/answers/engine-id/1-b.json`, JSON.stringify({ card: 'a1', choice: 'Yes', isReply: true, ask: 'And the other one?', at: 1_700_000_007_000 }))
  await clock.advance(12_000)
  expect(resumed.filter(line => line.startsWith('a1: ')).map(line => (line.includes('Approve') ? 'Approve' : line.includes('Yes') ? 'Yes' : line))).toEqual(['Approve', 'Yes'])
  expect(files.get(`${MEMORY}/log.md`)).toContain('started again from a timer')
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

// The welcome for a new person

test('a new person gets a welcome once: it opens the panel, names /claudopus, and its button starts indexing their old chats', async ($, on) => {
  const { opened, files, submitted } = world(on, { isNew: true })
  await $.session.start(start)
  expect(opened[0]).toBe('claudopus')
  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    expect((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' }))?.props.bold).toBe(true)
    expect(await pane.find({ type: 'Text', text: /Type \/claudopus to bring it back/ })).toBeDefined()
    expect(await pane.find({ type: 'Button', label: 'Index my old chats' })).toBeDefined()
    await pane.unmount()
  }
  // A reload of the same session keeps it
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeDefined()
  await pressed(pane, 'welcome-index')
  const asked = await until(async () => submitted.find(text => text.startsWith('Index my old chats')))
  expect(asked).toContain('/onboard/extract.py" "/home/sam/.claude/claudopus/onboard"')
  expect(asked).toContain('/onboard/reader.md')
  expect(asked).toContain('`update` tool')
  expect(JSON.parse(files.get(`${MEMORY}/welcome.json`) ?? '{}').isOpen).toBe(false)
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })) ? undefined : true))).toBe(true)
  await pane.unmount()
})

test('the welcome is put away by Not now, and by the next session even unpressed', async ($, on) => {
  const { files, submitted } = world(on, { isNew: true })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'welcome-later')
  expect(await until(async () => ((await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })) ? undefined : true))).toBe(true)
  expect(submitted).toEqual([])
  await pane.unmount()
  // Shown in an earlier session and never pressed: a later session does not show it
  files.set(`${MEMORY}/welcome.json`, JSON.stringify({ shownIn: 'an-earlier-session', isOpen: true }))
  await $.session.start(start)
  const later = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await later.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeUndefined()
  expect(JSON.parse(files.get(`${MEMORY}/welcome.json`) ?? '{}').isOpen).toBe(false)
  await later.unmount()
})

test('someone already set up never sees the welcome, and the panel does not open by itself', async ($, on) => {
  const { opened, files } = world(on)
  await $.session.start(start)
  expect(opened).toEqual([])
  expect(files.has(`${MEMORY}/welcome.json`)).toBe(false)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: 'Welcome to Claudopus' })).toBeUndefined()
  await pane.unmount()
})

// Every chat's work in every panel: other chats listed, answered from here, the header agreeing, ended work shared, names opening chats

// ---- Every chat's work in every panel ----

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

test("the panel shows every open chat's running work under that chat's name, this chat's first; a chat gone silent shows none", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  // A chat that has said nothing for minutes was closed, or its Mac sleeps
  files.set(`${MEMORY}/live/chat-c.json`, otherChat(NOW - 200_000, 'chat-c', 'Old landing page'))
  await clock.advance(5000)
  // This chat says what it runs, for the others
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards?.[0]?.title).toBe('Fix the nose')
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  expect(bold.indexOf('This chat')).toBeGreaterThan(-1)
  expect(bold.indexOf('This chat')).toBeLessThan(bold.indexOf('Fix the nose'))
  expect(bold.indexOf('Fix the nose')).toBeLessThan(bold.indexOf('Billing page'))
  // Under the other chat's name, its ask first
  expect(bold.indexOf('Billing page')).toBeLessThan(bold.indexOf('Send the invoices'))
  expect(bold.indexOf('Send the invoices')).toBeLessThan(bold.indexOf('Check the totals'))
  expect(bold).not.toContain('Old landing page')
  expect(await list.find({ type: 'Text', text: 'billing' })).toBeDefined()
  // The header counts every chat's: the ask first, then all that runs, here and there
  expect(await list.find({ type: 'Text', text: '1 thing needs you, 2 running' })).toBeDefined()
  // Another chat's work is stopped in its own chat: no Stop here, and its model is no control
  const buttons = (await list.findAll({ type: 'Button' })).map(one => one.key ?? '')
  expect(buttons.filter(key => key.startsWith('stop-'))).toEqual(['stop-a1'])
  expect(buttons.some(key => key.startsWith('model-r-'))).toBe(false)
  // The chat's own work ends: its file says so at once, so the others show it finished as this chat does
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1000)
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{"cards":[]}').ended?.[0]?.status === 'done' ? true : undefined))).toBe(true)
  // Ended work is written apart from the running, so a chat still on a version that reads only the running cards never shows it as running
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').cards).toEqual([])
  // A chat of this Mac with no work is not listed in the others' panels
  files.set(`${MEMORY}/live/chat-d.json`, JSON.stringify({ chat: 'chat-d', title: 'Quiet chat', folder: '/repo/quiet', host: '', at: NOW + 6000, cards: [] }))
  await clock.advance(5000)
  expect(await list.find({ type: 'Text', text: 'Quiet chat' })).toBeUndefined()
  // It keeps saying it is open while it runs
  const was = JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').at
  await clock.advance(25_000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').at).toBeGreaterThan(was)
  // Once that chat stops saying so, its work leaves this panel
  await clock.advance(95_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Billing page' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("an ask of another chat's work is answered from this panel and reaches that chat's work; that chat acts on it as if pressed there", async ($, on) => {
  const { files, clock, appended } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  expect(send).toBeDefined()
  await list.press({ key: send?.key ?? '' })
  const left = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/live/answers/chat-b/`)))
  expect(JSON.parse(files.get(left ?? '') ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW })
  expect(left?.endsWith('.json')).toBe(true)
  // The ask leaves this panel at once
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Send') ? undefined : true))).toBe(true)
  // A reply in their own words to another chat's ask is left for that chat the same way, and its amber goes here at once
  // (a new title, so the file's size changes as a rewritten file's would)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW + 4000, 'chat-b', 'Billing pages'))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: 'May I send 12 invoices?' }))).toBeDefined()
  const other = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: other?.key ?? '', text: 'Only the March ones' })
  const replied = await until(async () => [...files.entries()].find(([path, body]) => path.startsWith(`${MEMORY}/live/answers/chat-b/`) && body.includes('Only the March ones'))?.[1])
  expect(JSON.parse(replied ?? '{}')).toMatchObject({ card: 'b1', choice: 'Only the March ones', isReply: true, askAt: NOW + 4000 })
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'May I send 12 invoices?' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: /^✓ You answered “Only the March ones” · sent to the chat "Billing pages"/ })).toBeDefined()
  // Its Details has the reply box, and says where its chat is
  const id = (await list.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('open-r-'))?.key?.replace(/^open-/, '').replace(/-\d+$/, '') ?? ''
  const details = await $.ui.mount({ ...LIST, requestId: `work-${id}`, surface: 'desktop' } as never)
  expect(await details.find({ type: 'Text', text: /Its chat is shown in the panel of the chat "Billing pages"/ })).toBeDefined()
  await list.unmount()
  await details.unmount()

  // The other way round: this chat's own work asks, and an answer another chat left for it arrives
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  // The clock has moved on 10 s in this test
  const t0 = NOW + 10_000
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] } as never)
  // One pressed for an earlier ask in the same words is dropped, as is one that waited too long; one for the ask that stands is acted on, once
  files.set(`${MEMORY}/live/answers/engine-id/0-z.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I delete the old repo?', askAt: NOW, at: NOW - 11 * 60_000 }))
  files.set(`${MEMORY}/live/answers/engine-id/1-a.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0 - 1000, at: NOW }))
  files.set(`${MEMORY}/live/answers/engine-id/2-b.json`, JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0, at: NOW }))
  await clock.advance(5000)
  const told = appended.filter(line => line.startsWith('a1: ') && line.includes('"Approve"'))
  expect(told).toHaveLength(1)
  expect(told[0]).toContain('May I delete the old repo?')
  expect([...files.keys()].filter(path => path.includes('/live/answers/engine-id/'))).toEqual([])
  // The answer clears the ask here too, and this chat's file says so to the other chats at its next write
  await clock.advance(1000)
  expect((await read$todos(files)).ask).toBeUndefined()
  // A reply in words another chat left for a new ask clears it the same way and reaches the work
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which repo?' } as never)
  await clock.advance(1000)
  expect((await read$todos(files)).ask?.text).toBe('Which repo?')
  files.set(`${MEMORY}/live/answers/engine-id/3-c.json`, JSON.stringify({ card: 'a1', choice: 'the old one', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 7000 }))
  await clock.advance(6000)
  expect(appended.find(line => line.startsWith('a1: ') && line.includes('the old one'))).toContain('Which repo?')
  expect((await read$todos(files)).ask).toBeUndefined()
  // A second reply in words left right after, with the ask already answered, still reaches the work
  files.set(`${MEMORY}/live/answers/engine-id/4-d.json`, JSON.stringify({ card: 'a1', choice: 'the one from 2024', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 13_000 }))
  await clock.advance(5000)
  expect(appended.find(line => line.startsWith('a1: ') && line.includes('the one from 2024'))).toContain('Which repo?')
})

test("with another Mac named in config.json, its chats' work shows here under its chat and Mac, an answer goes there over ssh, and a Mac that stops answering shows none", async ($, on) => {
  const { files, clock, sshed } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local', '-oProxyCommand=bad'] }))
  // What the M4 answers: a login banner, its clock (an hour behind this Mac's), then its chat's file by its own clock
  const behind = NOW - 3_600_000
  files.set('ssh:fetch', `Welcome to the M4\n${behind / 1000}\n---claudopus-live---\n${otherChat(behind, 'chat-m4', 'Robot arm')}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  // Only a Mac that ssh takes as a name is reached
  expect(sshed.every(([command]) => command?.startsWith("sh -c 'L=") || command?.startsWith("sh -c 'echo $HOME;") || command?.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/") || command?.startsWith('d='))).toBe(true)
  expect(sshed.length).toBeGreaterThan(0)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on m4' })).toBeDefined()
  // Its running time is told on this Mac's clock: a minute and some, not an hour
  expect(await list.find({ type: 'Text', text: /^Opus 5\.5 · (\d+ of \d+ done · )?1m \d\ds$/ })).toBeDefined()
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  await list.press({ key: send?.key ?? '' })
  const sent = await until(async () => sshed.find(([command]) => command?.startsWith('d=')))
  expect(sent?.[0]).toContain('d=~/.claude/claudopus/live/answers/chat-m4 && mkdir -p $d && cat > $d/')
  expect(JSON.parse(sent?.[1] ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send' })
  // The M4 goes to sleep: what was fetched from it goes stale, and its work leaves the panel
  files.delete('ssh:fetch')
  await clock.advance(100_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("the header says in one line what every chat's cards say, and the octopus beside it agrees", () => {
  const head = (here: number, there: number, chats: number, asks = 0, isDone = false) => {
    const one = { here, there, chats, asks, isDone }
    return [headLine(one), headMood(one)]
  }
  expect(head(0, 0, 0)).toEqual(['Nothing is running', 'mark'])
  expect(head(1, 0, 0)).toEqual(['Working on 1 thing', 'working'])
  expect(head(2, 0, 0)).toEqual(['Working on 2 things', 'working'])
  expect(head(0, 1, 1)).toEqual(['Working on 1 thing in another chat', 'working'])
  expect(head(0, 3, 2)).toEqual(['Working on 3 things in 2 other chats', 'working'])
  expect(head(1, 1, 1)).toEqual(['Working on 2 things here and in 1 other chat', 'working'])
  expect(head(2, 3, 2)).toEqual(['Working on 5 things here and in 2 other chats', 'working'])
  expect(head(0, 0, 0, 1)).toEqual(['1 thing needs you', 'asking'])
  expect(head(1, 2, 1, 2)).toEqual(['2 things need you, 3 running', 'asking'])
  // A finish shows on the octopus for its moment whatever else goes on, the line still saying what needs the person or runs
  expect(head(0, 0, 0, 1, true)).toEqual(['1 thing needs you', 'happy'])
  expect(head(0, 1, 1, 0, true)).toEqual(['Working on 1 thing in another chat', 'happy'])
  expect(head(0, 0, 0, 0, true)).toEqual(['Just finished', 'happy'])
})

test("with work only in another chat the header and octopus are at work, amber while it asks, happy as it finishes, then at rest", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  // Only its running card, no ask
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, cards: file.cards.slice(1) }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Working on 1 thing in another chat' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['working'])
  expect(await list.find({ type: 'Text', text: /^Nothing/ })).toBeUndefined()
  // It asks: the line turns amber and says so, and the octopus waves amber
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 5000 }))
  await clock.advance(5000)
  const asks = await until(async () => list.find({ type: 'Text', text: '1 thing needs you, 1 running' }))
  expect(asks?.props.color).toBe('#E5A50A')
  expect(await drawn(list)).toEqual(['wave'])
  // Both finish: happy, "Just finished", for the pause; then at rest, "Nothing is running"
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 11_000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 10_500, ask: undefined })) }))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Just finished' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['happy'])
  await clock.advance(3000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Nothing is running' }))).toBeDefined()
  expect(await drawn(list)).toEqual(['mark'])
  await list.unmount()
})

test("open chats with nothing going on are listed nowhere, on any Mac and however many, and a chat with work is listed by its name and Mac until that Mac stops answering", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = (at: number, chat: string, title: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle(NOW, 'chat-rc', 'M4 idle')}\n---claudopus-live---\n${otherChat(NOW, 'chat-m4', 'Robot arm')}\n`)
  // A hundred chats of this Mac open with nothing going on
  for (let n = 0; n < 100; n += 1) files.set(`${MEMORY}/live/chat-q${n}.json`, idle(NOW, `chat-q${n}`, `Quiet ${n}`))
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Robot arm' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'billing · on m4' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: '1 thing needs you, 1 running' })).toBeDefined()
  // No idle chat by name, no row or count of them, and this chat, with nothing going on, gets no heading
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts.filter(one => /^Quiet \d+$|^M4 idle$|^[▸▾]? ?\d+ other chats?$/.test(one))).toEqual([])
  expect((await list.findAll({ type: 'Button' })).filter(one => /other chats?$/.test(String(one.props.label ?? '')))).toEqual([])
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  // No hover anywhere in the panel
  expect(JSON.stringify(await list.drawn())).not.toContain('"hover":{"display"')
  // Nothing about a fold is kept
  expect(files.has(`${MEMORY}/folds.json`)).toBe(false)
  // That Mac stops answering: its chat with work leaves too
  files.delete('ssh:fetch')
  await clock.advance(100_000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Robot arm' })) ? undefined : true))).toBe(true)
  await list.unmount()
})

test("work that ends in another chat turns happy in this panel for its pause, then folds into Finished, which then holds every chat's", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  // Its running work finishes: that chat's file says so a moment later
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  const ended = { ...file, at: NOW + 6000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 5500, ask: undefined })) }
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify(ended))
  await clock.advance(5000)
  expect(await until(async () => list.find({ type: 'Text', text: '✓ Finished' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Claudopus' })).toBeDefined()
  // After its pause it is in the Finished row, named as every chat's, and no longer under its chat
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: '✓ Finished' })) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'all chats' })).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).some(b => /Finished 2/.test(String(b.props.label)))).toBe(true)
  // On one Mac a chat with only ended work is not listed by name, and this chat's work gets no heading of its own for it
  expect(await list.find({ type: 'Text', text: 'Billing page' })).toBeUndefined()
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  expect(await until(async () => list.find({ type: 'Text', text: 'Fix the nose' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: /^This chat$/ })).toBeUndefined()
  await list.unmount()
})

test("while the person types a reply into an ask, work finishing here and in another chat still turns green and happy for its pause, then leaves", async ($, on) => {
  const { files, clock } = world(on, { art: true })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  files.set(`${MEMORY}/live/chat-b.json`, otherChat(NOW))
  await $.agent.spawn({ ...spawn, description: 'Submit the mod', prompt: 'submit the mod' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Billing page' }))).toBeDefined()
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Submit it to the plugin directory.' } as never)
  const box = (await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await list.input({ key: box?.key ?? '', text: 'Not y', kind: 'change' } as never)
  // This chat's work finishes mid-typing: green and happy at once, then gone after its pause, the times still held
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' } as never)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ Finished' })))?.props.color).toBe('success')
  expect(await drawn(list)).toContain('happy')
  await clock.advance(2_100)
  expect(await until(async () => ((await list.find({ type: 'Text', text: /Draw the eyes/ })) ? undefined : true))).toBe(true)
  // Another chat's work finishes mid-typing: the same
  const file = JSON.parse(otherChat(NOW)) as { at: number; cards: { status: string; endedAt: number; ask?: unknown }[] }
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...file, at: NOW + 8000, cards: file.cards.map(card => ({ ...card, status: 'done', endedAt: NOW + 7500, ask: undefined })) }))
  await list.input({ key: box?.key ?? '', text: 'Not ye', kind: 'change' } as never)
  // This panel reads the other chats every few seconds: the pause runs from the look that saw the end
  for (let n = 0; n < 6 && !(await list.find({ type: 'Text', text: '✓ Finished' })); n += 1) await clock.advance(1000)
  expect((await until(async () => list.find({ type: 'Text', text: '✓ Finished' })))?.props.color).toBe('success')
  expect(await drawn(list)).toContain('happy')
  await clock.advance(3000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: '✓ Finished' })) ? undefined : true))).toBe(true)
  // The half reply is still in its box
  expect((await list.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))?.props.value).toBe('Not ye')
  await list.unmount()
})

test('a chat shares the work that ended lately, the newest few, and not work that ended long ago', async () => {
  const card = (id: string, endedAt: number) => ({ id, parentId: '', isFork: false, tokens: 0, title: id, words: '', items: [], entries: [], answer: '', startedAt: endedAt - 10, endedAt, status: 'done' as const })
  const list = [card('old', NOW - 13 * 3_600_000), ...Array.from({ length: 12 }, (_, i) => card(`n${i}`, NOW - i * 1000))]
  const shared = shareable(list as never, NOW).map(one => one.id)
  expect(shared).toHaveLength(10)
  expect(shared).not.toContain('old')
  expect(shared).not.toContain('n11')
})

test("a chat shares what opens it, and nothing of what was said in it", async ($, on) => {
  const { files, clock } = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } })
  files.set(`${HOME}/.claude/sessions/41.json`, JSON.stringify({ sessionId: 'someone-else', bridgeSessionId: 'session_01Other' }))
  files.set(`${HOME}/.claude/sessions/42.json`, JSON.stringify({ sessionId: 'engine-id', hostSessionId: 'local_ab12-cd34', bridgeSessionId: 'session_01Mine', updatedAt: 5 }))
  files.set(`${MEMORY}/words/engine-id.md`, '## 2026-11-12T07:00:00.000Z\nSum up last month\n\n### Claude 2026-11-12T07:01:00.000Z\nHere it is.\n\n')
  await $.session.start(start)
  const shared = () => JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}')
  expect(shared().link).toEqual({ bridge: 'session_01Mine', app: 'local_ab12-cd34' })
  await $.prompt.submit({ text: 'And this month?', origin: composer } as never)
  await $.turn.complete({ answer: 'Here it is again.', reason: 'end_turn' } as never)
  await clock.advance(1000)
  expect(shared().said).toBeUndefined()
  expect(files.get(`${MEMORY}/live/engine-id.json`) ?? '').not.toContain('this month')
})

test("another chat's name, shown while it has something going on, opens that chat in the app when pressed, and shows nothing more under it", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const busy = (chat: string, title: string, extra: object) => JSON.stringify({ ...JSON.parse(otherChat(NOW, chat, title)), ...extra })
  // An old chat still shares what was said: it is not shown
  const withLink = busy('chat-rc', "Last month's work summary", { said: { you: 'Sum up last month', youAt: NOW, reply: 'Here is the summary.', replyAt: NOW }, link: { bridge: 'session_01Summary', app: 'local_m4-only' } })
  // A chat of the other Mac with Remote Control off: the app's own id there opens nothing here; an id of no allowed shape is dropped
  const noLink = busy('chat-t', 'Terminal chat', { link: { bridge: 'session_; rm -rf ~', app: 'local_m4-two' } })
  // A chat this Mac's app runs on the other Mac over SSH: the app holds it under its own id, so it opens as the sidebar opens it
  const viaSsh = busy('chat-s', 'SSH chat', { link: { bridge: '', app: 'local_run-from-here' } })
  files.set(`${HOME}/Library/Application Support/Claude/claude-code-sessions/acct/org/local_run-from-here.json`, '{}')
  // One run from here on a version that shares no link at all: the app's own file for it names its chat
  const old = busy('chat-old', 'Old version chat', {})
  files.set(`${HOME}/Library/Application Support/Claude/claude-code-sessions/acct/org/local_old-one.json`, JSON.stringify({ sessionId: 'local_old-one', cliSessionId: 'chat-old' }))
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${withLink}\n---claudopus-live---\n${noLink}\n---claudopus-live---\n${viaSsh}\n---claudopus-live---\n${old}\n`)
  await $.session.start(start)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: "Last month's work summary" }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Terminal chat' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Here is the summary.' })).toBeUndefined()
  expect(await list.find({ type: 'Text', text: 'Sum up last month' })).toBeUndefined()
  expect(JSON.stringify(await list.drawn())).not.toContain('"hover":{"display"')
  // The chat with Remote Control opens by its Remote Control id, the one this Mac's app runs by the app's own id; the one of the
  // other Mac's own app without Remote Control has no press at all
  expect(await until(async () => list.find({ key: 'chat-open-sam@m4.local-chat-s' }))).toBeDefined()
  const buttons = (await list.findAll({ type: 'Button' })).map(one => String(one.key))
  expect(buttons.filter(key => key.startsWith('chat-open-')).sort()).toEqual(['chat-open-sam@m4.local-chat-old', 'chat-open-sam@m4.local-chat-rc', 'chat-open-sam@m4.local-chat-s'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-old' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_old-one'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-rc' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/session_01Summary'])
  await list.press({ key: 'chat-open-sam@m4.local-chat-s' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_run-from-here'])
  await list.unmount()
})

test("a chat of this Mac with work opens by the app's own id when it has no Remote Control", async ($, on) => {
  const { files, clock, shown } = world(on)
  const mine = JSON.parse(otherChat(NOW)) as Record<string, unknown>
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ ...mine, link: { bridge: '', app: 'local_here-1' } }))
  await $.session.start(start)
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ key: 'chat-open--chat-b' }))).toBeDefined()
  await list.press({ key: 'chat-open--chat-b' })
  expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_here-1'])
  await list.unmount()
})

// The app's own prompts shown amber in every panel

test("this chat waiting on the app's own prompt is listed with its prompt, and idle chats beside it are not", async ($, on) => {
  const { files, clock } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] })
  files.set('ssh:fetch', `${NOW / 1000}\n---claudopus-live---\n${idle}\n`)
  await $.session.start(start)
  await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } } as never)
  await clock.advance(10_000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Quiet one' })).toBeUndefined()
  expect(await keyed(list, 'quiet-fold')).toBeUndefined()
  await list.unmount()
})

test("a chat stopped on the app's own prompt shows it amber at the top of its panel and in its file, says so aloud once, and clears as the call ends", async ($, on) => {
  const { files, clock, notified } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Clean the build', prompt: 'clean up the build' } as never)
  // The work's call raises the app's prompt: the mod passes it on untouched
  const r = await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' } as never)
  expect((r as { decision?: unknown } | undefined)?.decision).toBeUndefined()
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in this chat' })).toBeDefined()
  // Amber, above the work's own card
  const texts = (await list.findAll({ type: 'Text' })).map(one => one.text)
  expect(texts.indexOf('Allow a command: Clear the build folder')).toBeLessThan(texts.lastIndexOf('Clean the build'))
  expect((await list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' }))?.props.color).toBe('#E5A50A')
  // The others see it in this chat's file, with the work it came from
  await clock.advance(1000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').prompts).toEqual([expect.objectContaining({ text: 'Allow a command: Clear the build folder', title: 'Clean the build' })])
  // Not told before the app itself says the prompt is still waiting; then told once, as an ask is
  await clock.advance(5000)
  expect(notified.filter(line => line.includes('needs your OK'))).toEqual([])
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('needs your OK'))).toEqual(['Clean the build needs your OK | Allow a command: Clear the build folder'])
  // The call ends, refused or run: the prompt goes, here and in the file
  await $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' } as never)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Allow a command: Clear the build folder' })) ? undefined : true))).toBe(true)
  await clock.advance(1000)
  expect(JSON.parse(files.get(`${MEMORY}/live/engine-id.json`) ?? '{}').prompts).toBeUndefined()
  // A prompt answered at once is not told
  await $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Answer a question: Which colour for the nose?' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Needs your input' })).toBeDefined()
  await $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] } as never)
  await $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' } as never)
  expect(notified.filter(line => line.includes('needs your OK'))).toHaveLength(1)
  await list.unmount()
})

test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  // The same command already running elsewhere, as in a terminal, says nothing of this call
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'Allow a command: Count the lines' }))).toBeDefined()
  await clock.advance(2000)
  expect(await list.find({ type: 'Text', text: 'Allow a command: Count the lines' })).toBeDefined()
  files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n")
  await clock.advance(2000)
  expect(await until(async () => ((await list.find({ type: 'Text', text: 'Allow a command: Count the lines' })) ? undefined : true))).toBe(true)
  // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
  files.set('settings:allow', '1')
  await $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } } as never)
  await clock.advance(1000)
  expect(await list.find({ type: 'Text', text: 'Allow writing notes.md' })).toBeUndefined()
  await list.unmount()
})

test("another chat's open prompt shows amber under its name, first; on this Mac a press opens that chat, on another Mac it says where", async ($, on) => {
  const { files, clock, shown } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ macs: ['sam@m4.local'] }))
  const waiting = (at: number, chat: string, title: string, link: string) => JSON.stringify({ chat, title, folder: '/Users/sam/GitHub', host: '', at, cards: [], prompts: [{ id: 'toolu_1', text: 'Allow a command: Cross-repo duplicate files', title: 'Interesting facts', at }], link })
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
  expect(await until(async () => list.find({ type: 'Text', text: 'M4 GitHub' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Answer it in that chat, on m4' })).toBeDefined()
  const bold = (await list.findAll({ type: 'Text' })).filter(one => one.props.bold).map(one => one.text)
  // Chats that wait on the person come before the one that only works
  expect(bold.indexOf('Web chat')).toBeLessThan(bold.indexOf('Billing page'))
  expect(bold.indexOf('M4 GitHub')).toBeLessThan(bold.indexOf('Billing page'))
  expect(bold.filter(one => one === 'Allow a command: Cross-repo duplicate files')).toHaveLength(4)
  // Open buttons: the M4 chat with Remote Control, by its Remote Control id, and the chat of this Mac with the app's link; the M4 chat
  // with only the app's own id there says where to answer instead
  const opens = (await list.findAll({ type: 'Button' })).filter(one => one.props.label === 'Open that chat')
  expect(opens).toHaveLength(2)
  expect(await list.find({ type: 'Text', text: 'Answer it in that chat, which runs on m4' })).toBeDefined()
  await list.press({ key: opens.find(one => String(one.key).includes('chat-rc'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.startsWith('claude://')))).toEqual(['open', 'claude://code/session_01M4Remote'])
  await list.press({ key: opens.find(one => String(one.key).includes('chat-w'))?.key ?? '' })
  expect(await until(async () => shown.find(argv => argv[1]?.includes('local_ab-12')))).toEqual(['open', 'claude://code/continue?session=local_ab-12'])
  // Answered there, its file no longer carries it, and its amber card leaves; with nothing going on, its chat is listed no more
  files.set(`${MEMORY}/live/chat-w.json`, JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11_000, cards: [] }))
  await clock.advance(5000)
  expect(await until(async () => ((await list.findAll({ type: 'Button' })).some(one => one.props.label === 'Open that chat' && String(one.key).includes('chat-w')) ? undefined : true))).toBe(true)
  expect(await list.find({ type: 'Text', text: 'Web chat' })).toBeUndefined()
  await list.unmount()
})

// The other Mac: its chats over ssh, the same results on both, and chats the app runs over ssh

test("a Mac that reaches another hands it this Mac's chats in the same trip, and leaves here the answers pressed there for them, once each", async ($, on) => {
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
  // The answer is left for chat-b as one pressed in another chat's panel; the one under a name it does not make is not
  const left = files.get(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)
  expect(JSON.parse(left ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', askAt: NOW })
  expect([...files.keys()].filter(path => path.includes('/live/answers/chat-b/'))).toHaveLength(1)
  // chat-b takes it; the next trip puts it away there, and carried again it is not left again
  files.delete(`${MEMORY}/live/answers/chat-b/${NOW}-abc.json`)
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

test("a Mac handed another Mac's chats lists them by name and Mac with its own, leaves an answer for them to be carried back, and drops them once that Mac stops handing them over", async ($, on) => {
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
  // An answer pressed here waits in the outbox for that Mac
  const send = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Send')
  await list.press({ key: send?.key ?? '' })
  const left = await until(async () => [...files.keys()].find(path => path.startsWith(`${MEMORY}/live/outbox/sams-m5/`) && path.endsWith('.json')))
  expect(JSON.parse(files.get(left ?? '') ?? '{}')).toMatchObject({ card: 'b1', choice: 'Send', chat: 'chat-m5', askAt: ahead })
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
  expect(texts).toContain('Its chat is shown in the panel of the chat "Video" on m4, which runs it. Stop it or move it to another model there.')
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
  const asked = () => own.filter(one => one.includes('--asks') && one.includes('Send the invoices needs you'))
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

// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text

test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', async ($, on) => {
  const { clock, held, logged } = world(on)
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
  const stuck = () => look(pane => pane.find({ type: 'Text', text: /^Nothing new for / }))

  // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
  await bash('a1', 'git log', 'p1')
  await bash('h1', 'git status', 'b1')
  await bash('h2', 'git status', 'b2')
  await clock.advance(11 * 60_000)
  expect(await stuck()).toBeUndefined()
  await clock.advance(2 * 60_000)
  expect((await stuck())?.props.color).toBe('#E5A50A')
  expect((await stuck())?.text).toMatch(/^Nothing new for 1[23] min\.$/)
  expect(logged.filter(line => line.includes('"One merger for all pushes" has had nothing new'))).toHaveLength(1)
  // Looked at again, nothing more is said
  await clock.advance(60_000)
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(1)

  // Something new comes back: the flag goes at the next look
  void bash('h1', 'hold release', 'b3')
  const letRelease = await until(async () => held.get('release'))
  letRelease?.('released Thing 0.1.1')
  expect(await stuck()).toBeDefined()
  await clock.advance(25_000)
  expect(await stuck()).toBeUndefined()
  // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
  void bash('h1', 'hold poll', 'b4')
  const letPoll = await until(async () => held.get('poll'))
  letPoll?.('released Thing 0.1.7')
  await clock.advance(13 * 60_000)
  expect(await stuck()).toBeDefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(2)
})

test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', async ($, on) => {
  const { clock, held } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' } as never)
  await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  void $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' } as never)
  const rows = async () => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
    const r = (await pane.findAll({ type: 'Text', text: / running · / })).map(one => one.text)
    await pane.unmount()
    return r
  }
  await clock.advance(90_000)
  expect(await rows()).toEqual([])
  await clock.advance(70_000)
  expect(await rows()).toEqual(['one command running · 2m 40s'])
  const letSearch = await until(async () => held.get('search'))
  letSearch?.('found it')
  await clock.advance(1_000)
  expect(await rows()).toEqual([])
})

test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = { a2: 'general-purpose' }
  const { clock, logged, held } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  // Its first run, moving all along, takes longer than the stuck check waits; then it rests
  for (const part of ['left ear', 'right ear', 'lobes']) {
    await clock.advance(5 * 60_000)
    void $.tool.call({ tool: 'Bash', tool_use_id: `e-${part}`, agentId: 'a1', command: `hold ${part}` } as never)
    const letGo = await until(async () => held.get(part))
    letGo?.(`drew the ${part}`)
  }
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(30 * 60_000)
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } } as never)
  await clock.advance(25_000)
  const look = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await pane.find({ type: 'Text', text: /^Nothing new for / })
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
  expect(logged.filter(line => line.includes('has had nothing new'))).toEqual([])
})

test('work asking the person something waits on them and is never flagged', async ($, on) => {
  const { clock, logged } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(30 * 60_000)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for / })).toBeUndefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(0)
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
