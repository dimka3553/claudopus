import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

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
const world = (on: On, options: { reply?: string; tokens?: number; agents?: Record<string, string>; kinds?: Record<string, string>; panes?: string[]; talk?: unknown; model?: string; answered?: { by?: string }; art?: boolean; chatRole?: string; app?: { noSurface: boolean } } = {}) => {
  const files = new Map<string, string>()
  const titles: string[] = []
  const compacts: (string | undefined)[] = []
  const opened: string[] = []
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
  // The model each step of a piece of work was sent to
  const stepped: string[] = []
  const played: string[] = []
  const notified: string[] = []
  // What was handed to osascript
  const osa: string[][] = []
  // What was handed to open: a folder shown in Finder
  const shown: string[][] = []
  prompts.length = 0
  let spawned = 0
  mock.env(on, { HOME })
  const clock = mock.clock(on, { now: 1_700_000_000_000 })
  // What the engine draws where the mod draws nothing
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>the engine's own</Text>
  })
  on('fs.read', (_, e) => {
    // The octopus drawings, each an SVG naming its file, when a test asks for them
    const drawing = options.art ? /\/art\/([\w-]+)\.svg$/.exec(e.path)?.[1] : undefined
    if (drawing) return { value: `<svg xmlns="http://www.w3.org/2000/svg"><title>${drawing}</title></svg>` }
    // The texts the mod ships; a copy of one in the memory folder is the person's own, kept in files
    const isShipped = !e.path.startsWith(MEMORY)
    if (isShipped && e.path.endsWith('roles/chat.md')) return { value: options.chatRole ?? 'CHAT ROLE' }
    if (isShipped && e.path.endsWith('roles/work.md')) return { value: 'WORK ROLE; an admin command runs through `{admin}`; a key runs as `{secret} NAME`' }
    if (isShipped && e.path.endsWith('rules/CLAUDE.md')) return { value: PRINCIPLES }
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
  on('fs.list', (_, e) => ({
    value: [...new Set([...files.keys()].filter(path => path.startsWith(`${e.path}/`)).map(path => path.slice(e.path.length + 1)))]
      .map(rest => ({ name: rest.split('/')[0] ?? rest, kind: rest.includes('/') ? 'dir' : 'file', size: 1, mtimeMs: 0, isLink: false }))
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
  on('ui.panes', () => ({ value: (options.panes ?? []).map(id => ({ id, title: id, isShown: true, isFocused: false, isPlaced: true })) }))
  on('ui.close', (_, e) => {
    closed.push(e.id)
    return { value: undefined }
  })
  // What the Mac answers: a dev server on 3100 started by a chat, and the system's own listener, which is not the person's
  on('process.run', (_, e) => {
    const [tool, ...rest] = e.argv
    if (tool === 'osascript') osa.push([...e.argv])
    if (tool === 'open') shown.push([...e.argv])
    if (tool === 'kill') killed.push(String(rest[0]))
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
    opened.push(e.id)
    tabs.push(`${e.id}: ${e.title}`)
    return { value: { isPlaced: true } }
  })
  on('session.append', (_, e, next) => {
    appended.push(`${e.agentId}: ${(e.message.content[0] as { text?: string }).text ?? ''}`)
    return next(e)
  })
  on('tool.call', (_, e) => {
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
  on('session.compact', (_, e) => {
    compacts.push(e.instructions)
    return { messages: e.messages }
  })

  return { files, titles, compacts, opened, tabs, stopped, killed, closed, logged, sent, appended, submitted, clock, copied, stepped, played, notified, osa, shown, terminals }
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

test('a chat gets its role once, is told to start a fresh agent from a brief for every message, and every message is saved', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  const first = await $.prompt.submit({ text: 'fix the upload page', wait: false, origin: composer })
  expect(first.context?.join('\n')).toContain('CHAT ROLE')
  expect(first.context?.join('\n')).toContain('Subjects so far')
  expect(first.context?.join('\n')).toContain(`This chat's saved words: ${MEMORY}/words/engine-id.md`)
  expect(first.context?.join('\n')).toContain('start a fresh agent')
  expect(first.context?.join('\n')).toContain('goes to the agent that has that work')

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
  const { logged, clock, files } = world(on)
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
  expect((await pane.find({ type: 'Text', text: /done$/ }))?.text).toBe('0 of 2 done')
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
  expect((await pane.find({ type: 'Text', text: /done$/ }))?.text).toBe('1 of 2 done')
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
  expect((await pane.find({ type: 'Text', text: /done$/ }))?.text).toBe('1 of 7 done')

  // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
  await $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' } as never)
  await $.agent.spawn({ ...spawn, fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' } as never)
  expect(prompts.at(-1)).toBe('search')
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' } as never)
  expect((await pane.find({ type: 'Text', text: /^I am reading/ }))?.text).toBe('I am reading how the other model draws outlines.')
  expect(await pane.find({ type: 'Text', text: /Search the docs/ })).toBeUndefined()

  // Work that ends its turn to wait for its helper goes on working
  await clock.advance(120_000)
  await $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: /^2m/ }))?.text).toBe('2m 00s')
  await $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' } as never)

  // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  await $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' } as never)
  expect((await tab.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 2m 00s')
  expect(await tab.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  await tab.unmount()
  // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once
  expect((await pane.find({ type: 'Text', text: /Fix the nose/ }))?.props.bold).toBe(true)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect((await pane.find({ type: 'Text', text: /^Nothing/ }))?.text).toBe('Nothing is running')
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toEqual(['Stats', 'Memory', 'Config', 'About', 'Details'])
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
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 2m 00s')
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  // Finished work's Details opens as a tab of its own too
  await pressed(pane, 'open-a1')
  const ended = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await ended.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · 2m 00s')
  expect((await ended.find({ type: 'Text', text: /^Its chat$/ }))?.props.bold).toBe(true)
  await ended.unmount()
  expect(files.get(`${MEMORY}/finished/engine-id.json`) ?? '').toBe('')
  await clock.advance(20_000)
  expect(JSON.parse(files.get(`${MEMORY}/finished/engine-id.json`) ?? '[]').map((one: { id: string }) => one.id)).toEqual(['a1'])
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
  expect(appended[0]).toContain('a1: The message sent to you just now is from the person, in their words')
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
  expect(appended.at(-1)).toBe('a1: The message sent to you just now is from your helper "Count nostrils", not from the person: it is not theirs. Take it as your helper "Count nostrils"\'s and carry on.')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a3: The message sent to you just now is from the work that started you, not from the person')
  // One piece of work writes to another
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a2: The message sent to you just now is from the work "Fix the nose", not from the person')
  // The chat's own note, which carries none of the person's words, is the chat's
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's4', to: 'a1', message: 'A fault seen from the chat: the card shows the wrong model.' } as never)
  expect(appended.at(-1)).toContain('a1: The message sent to you just now is from the chat, not from the person')
  expect(appended.join('\n')).not.toContain('from the person, in their words')
  // Nothing is owed for them: going on, the work is not reminded of a steer
  await steps('a1')
  expect(appended.join('\n')).not.toContain('waiting for your decision')

  // A short message of theirs counts as whole words only: "yes" is not in "eyes"
  await $.prompt.submit({ text: 'yes', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's8', to: 'a1', message: 'Check the eyes again.' } as never)
  expect(appended.at(-1)).toContain('a1: The message sent to you just now is from the chat, not from the person')
  // The person's words, sent on by the chat, are their steer, and the card keeps them
  await $.prompt.submit({ text: 'Make the left nostril a little wider than the right one.', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's5', to: 'a1', message: 'Sam on the nose, in their words: “Make the left nostril — a little wider than the right one”' } as never)
  expect(appended.at(-1)).toContain('a1: The message sent to you just now is from the person, in their words')
  await steps('a1')
  expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision')
  // The same words sent by a piece of work are still not the person's steer
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' } as never)
  expect(appended.at(-1)).toContain('a2: The message sent to you just now is from the work "Fix the nose"')
  // Once the chat's turn is over, a message from it is its own again
  await $.turn.complete({ answer: 'Sent.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer' })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's7', to: 'a2', message: 'Make the left nostril a little wider than the right one.' } as never)
  expect(appended.at(-1)).toContain('a2: The message sent to you just now is from the chat')
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
  await pane.unmount()
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

test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', async ($, on) => {
  const { clock } = world(on, { art: true })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  // The octopus drawings a view shows, by the file each came from
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // One finishes while another works: both octopuses are happy, the band still says what the other is doing
  await clock.advance(400)
  await end('a1', 't1')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await band.find({ type: 'Text', text: /Check the ears/ })).toBeDefined()
  // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
  await clock.advance(1_000)
  await end('a2', 't2')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect((await band.find({ type: 'Text', text: '✓ Finished' }))?.props.dimColor).toBe(true)
  // The first pause ends but the second has not: still happy; once both are over, at rest and the band gone
  await clock.advance(1_100)
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(1_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await band.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // Work finishing while another still runs goes back to work after its pause
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  await end('a3', 't3')
  expect(await drawn(pane)).toEqual(['happy'])
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
  await again.unmount()
})

test('work that is ready plays one sound and raises one notification; helpers, a second report, a Stop press and a reload make none; stopped work says so silently', async ($, on) => {
  // Whether the app takes notifications from a mod
  const app = { noSurface: false }
  const { clock, played, notified, files, osa } = world(on, { app })
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

  // Where the app takes no notification from a mod, this Mac's own Notification Centre is told
  app.noSurface = true
  await $.agent.spawn({ ...spawn, description: 'Draw the cheeks', prompt: 'draw the cheeks' } as never)
  await end('a9', 't11', 'The cheeks are drawn.')
  await clock.advance(1_000)
  expect(osa.at(-1)).toEqual(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', 'Draw the cheeks', 'The cheeks are drawn.'])
  app.noSurface = false

  // config.json switches each off
  files.set(`${MEMORY}/config.json`, JSON.stringify({ sound: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await end('a10', 't9')
  await clock.advance(1_000)
  expect(played).toHaveLength(5)
  expect(notified).toHaveLength(6)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await end('a11', 't10')
  await clock.advance(1_000)
  expect(played).toHaveLength(6)
  expect(notified).toHaveLength(6)
  expect(osa).toHaveLength(1)
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
  expect((await pane.find({ type: 'Text', text: /^Finished ·/ }))?.text).toBe('Finished · Opus 5.5 · context 1.0k · 5m 00s')
  expect(await pane.find({ type: 'Text', text: /secret|not ours|helper/ })).toBeUndefined()
  await pane.unmount()
})

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

test("the pictures a work made are in its chat where it made them: drawn small where the panel can, large in place on a press and never in another app, a gone one named", async ($, on) => {
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
  const { files, logged } = world(on, { talk })
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
    expect(labels.filter(label => label.includes('Picture:'))).toEqual(['▸ Picture: chart.svg'])
    const svgs = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
    expect(svgs.map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
    expect((await tab.find({ type: 'Text', text: /^Picture: gone\.png/ }))?.text).toBe('Picture: gone.png · no longer kept')
    expect(labels.some(label => label.includes('before.png'))).toBe(false)
    // Pressed, it is drawn large where it is, with where the file is; pressed again, small
    await pressed(tab, 'pic-open-1-0')
    expect((await keyed(tab, 'pic-open-1-0'))?.props.label).toBe('▾ Picture: chart.svg')
    expect((await tab.find({ type: 'Text', text: svg }))?.text).toBe(svg)
    expect((await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt) === 'Picture: chart.svg').map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    await pressed(tab, 'pic-open-1-0')
    expect((await keyed(tab, 'pic-open-1-0'))?.props.label).toBe('▸ Picture: chart.svg')
    expect(await tab.find({ type: 'Text', text: svg })).toBeUndefined()
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
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
})

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

// A workflow as its script's meta names it: two stages, the maker's and the checker's
const ROUNDS = `export const meta = {
  name: 'rounds',
  description: 'A maker builds it, a separate checker holds it to the bar',
  phases: [
    { title: 'Make', detail: 'the maker builds it', model: 'opus' },
    { title: 'Check', detail: 'the checker tests it against the bar', model: 'sonnet' },
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
  await $.agent.spawn({ ...spawn, description: 'checker', model: 'sonnet', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 2 } } as never)
  await $.agent.spawn({ ...spawn, description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 3 } } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-sonnet-5-5', messageCount: 2, agentId: 'a2' })) void _
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
  expect(await tab.find({ type: 'Text', text: /^the checker tests it against the bar · Sonnet 5.5 · 1 agent$/ })).toBeDefined()
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
  expect(await until(async () => ((await pane.find({ type: 'Text', text: /^Nothing is running$/ })) ? true : undefined))).toBe(true)
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

test('Stats opens in front from its button beside Results, and adds up this chat\'s work from its records: tokens, work, time saved, cost', async ($, on) => {
  const { files, opened, tabs } = world(on)
  const M = 60_000
  const now = 1_700_000_000_000
  const chat = `${HOME}/.claude/projects/-repo`
  const subs = `${chat}/engine-id/subagents`
  files.set(`${chat}/engine-id.jsonl`, '{}')
  files.set(`${chat}/engine-id.jsonl.sum`, JSON.stringify({ s: [[now - 30 * M, now]], u: [], d: [], h: [[now - 30 * M, now - 30 * M + 20_000]] }))
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
  expect((await stats.find({ type: 'Text', text: 'This chat' }))?.props.bold).toBe(true)
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

test('Memory, beside Stats, opens the memory folder in Finder', async ($, on) => {
  const { shown } = world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'memory-open'))?.props.label).toBe('Memory')
  await pressed(pane, 'memory-open')
  expect(await until(async () => shown.find(argv => argv[1] === MEMORY))).toEqual(['open', MEMORY])
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
  for (const name of ['Principles', "The chat's rules", 'Work rules', 'Your name', 'Background work', 'Sound', 'Notifications', 'Most work', 'Long legwork', 'Heavy work'])
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
  // Picking what shipped takes the key out again
  await config.select({ key: 'config-model-legwork-pick', value: 'sonnet' })
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({})
})

test('work that needs the person\'s hands asks: its card stands out first with the ask, the text to paste with its Copy, and answers that go back to it', async ($, on) => {
  const { played, notified, appended, terminals } = world(on)
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
  // Or a reply in the person's own words: the list has no box (it redraws each second) and its Reply opens Details, where the box
  // is; a reply goes to the work and the ask stays
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] } as never)
  expect(await list.find({ type: 'Input' } as never)).toBeUndefined()
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Reply…')).toBe(true)
  const box = (await ears.findAll({ type: 'Input' } as never)).find(one => /-reply-/.test(one.key ?? ''))
  await ears.input({ key: box?.key ?? '', text: 'Where do I do that?' })
  expect(await until(async () => appended.find(line => line.startsWith('a2: ') && line.includes('Where do I do that?')))).toContain('Submit it to the plugin directory.')
  expect(await list.find({ type: 'Text', text: 'Submit it to the plugin directory.' })).toBeDefined()
  // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: 'Open the plugin directory and submit the form.', copy: 'Open the plugin directory page and fill in the form with the details' } as never)
  expect((await list.findAll({ type: 'Button' })).some(b => b.props.label === 'Copy')).toBe(false)
  // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k7', agentId: 'a2', text: 'Open https://claude.ai/directory/manage, press Submit new, and paste the repository.', copy: 'https://github.com/dimka3553/claudopus' } as never)
  const hrefs = async (pane: typeof list) => (await pane.findAll({ type: 'Link' })).map(one => one.props.href)
  expect(await until(async () => ((await hrefs(list)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)
  expect(await hrefs(list)).toContain('https://github.com/dimka3553/claudopus')
  expect(await until(async () => ((await hrefs(ears)).includes('https://claude.ai/directory/manage') ? true : undefined))).toBe(true)

  // A command for the person to type is shown with its Copy, and the work is told to open a terminal for it (the app opens one
  // only for Claude, never for a plugin's own code)
  const told = await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub in the terminal that opened.', command: 'gh auth login', cwd: '/repo/site' } as never)
  expect(told.result).toContain('mcp__terminal__open_terminal_tab with cwd "/repo/site"')
  expect((await list.find({ type: 'Text', text: 'gh auth login' }))?.props.mono).toBe(true)
  expect(terminals).toEqual([])
  await Promise.all([list.unmount(), ears.unmount()])
})
