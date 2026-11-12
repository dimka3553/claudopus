// The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel

// ---- The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel ----
// The engine raises PermissionRequest as it puts a prompt to the person, and says nothing of the answer but a refusal: an allowed
// call just runs and ends. So a prompt goes when its call ends (refused, interrupted or run), when the terminal draws its running
// pill, or, for a command, as soon as a process running it is seen on this Mac. The mod never answers a prompt
type Waiting = Prompt & { tool: string; agent: string; snippet: string; seen?: number; isTold?: boolean }
let waiting: Waiting[] = []
// The tool calls whose permission check asked, newest last, so the prompt that follows is known by its call's id: the one of the same
// loop, tool and input, else the newest of the same loop and tool
type Asked = { agent: string; tool: string; input: string; id: string }
let asked: Asked[] = []
const inputKey = (input: unknown) => JSON.stringify(input ?? null).slice(0, 2000)
const askedFor = (agent: string | undefined, tool: string, input: unknown) => {
  const same = asked.filter(one => one.agent === (agent ?? '') && one.tool === tool)
  const one = same.find(other => other.input === inputKey(input)) ?? same.at(-1)
  if (one) asked = asked.filter(other => other !== one)
  return one?.id
}
// What the prompt asks, in its own few words: a command's description, the file, the site, the question
const promptText = (tool: string, input: unknown) => {
  const given = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const field = (key: string) => (typeof given[key] === 'string' ? oneLine(given[key] as string) : '')
  const file = (path: string) => path.split('/').filter(Boolean).pop() ?? ''
  if (tool === 'Bash' || tool === 'PowerShell') return `Allow a command: ${cut(field('description') || field('command'), 90) || 'one with no words'}`
  if (tool === 'Write') return `Allow writing ${file(field('file_path')) || 'a file'}`
  if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit') return `Allow editing ${file(field('file_path') || field('notebook_path')) || 'a file'}`
  if (tool === 'WebFetch') return `Allow opening ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'a web page'}`
  if (tool === 'WebSearch') return `Allow a web search: ${cut(field('query'), 80)}`
  if (tool === 'AskUserQuestion') {
    const first = Array.isArray(given.questions) ? (given.questions[0] as { question?: unknown } | undefined)?.question : undefined
    return typeof first === 'string' && first.trim() ? `Answer a question: ${cut(oneLine(first), 90)}` : 'Answer a question'
  }
  if (tool === 'ExitPlanMode') return 'Approve a plan'
  const mcp = tool.match(/^mcp__(.+?)__(.+)$/)
  if (mcp) return `Allow ${(mcp[2] ?? '').replace(/_/g, ' ')} (${(mcp[1] ?? '').replace(/^plugin_[^_]+_/, '')})`
  return `Allow ${tool}`
}
// The start of a command up to its first quote, `$` or line break, as a running shell shows it whatever the quoting
const snippetOf = (tool: string, input: unknown) => {
  if (tool !== 'Bash') return ''
  const head = (String((input as { command?: unknown } | undefined)?.command ?? '').split(/['"\\\n$`]/)[0] ?? '').trimEnd()
  return head.trim().length >= 4 ? head.slice(0, 80) : ''
}
// How many of Claude's shells on this Mac run a command that starts so (the Bash tool runs it as `eval '<command>'`): counted as its
// prompt opens, so only one more than then is this call's
const running = async ($: EngineInterface) => {
  const r = await $.process.run(['ps', '-ww', '-x', '-o', 'args='], { timeoutMs: 5000 })
  return r.exitCode === 0 ? r.stdout.split('\n') : undefined
}
const countOf = (lines: string[], snippet: string) => lines.filter(line => line.includes(`eval '${snippet}`)).length
const opened = async ($: EngineInterface, agent: string | undefined, tool: string, input: unknown) => {
  const at = await $.clock.now()
  const id = askedFor(agent, tool, input) ?? `pr-${at}-${Math.random().toString(36).slice(2, 8)}`
  const list = await read($, todos)
  const card = agent !== undefined ? list.find(one => one.id === topOf(list, agent)) : undefined
  const one: Waiting = { id, text: promptText(tool, input), ...(card ? { title: titleOf(card) } : {}), at, tool, agent: agent ?? '', snippet: snippetOf(tool, input) }
  waiting = [...waiting.filter(other => other.id !== id), one]
  redraw($)
  void shareMine($).catch(() => undefined)
  // The count to start from is taken beside the prompt, never in its way
  if (one.snippet)
    void running($)
      .then(lines => void (lines && (waiting = waiting.map(other => (other.id === id ? { ...other, seen: countOf(lines, one.snippet) } : other)))))
      .catch(() => undefined)
  return id
}
// The app says a prompt is still waiting (its own "needs your permission", a few seconds on): it is told aloud once, as an ask is.
// A prompt answered before that is never told
const tellWaiting = async ($: EngineInterface) => {
  const due = waiting.filter(one => !one.isTold)
  if (!due.length) return
  waiting = waiting.map(one => ({ ...one, isTold: true }))
  const { title } = await read($, me)
  const chat = title.trim() || cwd.split('/').filter(Boolean).pop() || 'A chat'
  for (const one of due) await aloud($, 'prompt', `${one.title ?? chat} needs your OK`, one.text, `prompt-${one.id}`).catch(err => log($, `prompt not told: ${String(err)}`))
}
// The prompt of a call goes: by its id, else the oldest one of the same loop and tool whose id was not known
const settle = ($: EngineInterface, id: string, agent?: string, tool?: string) => {
  const exact = waiting.find(one => one.id === id)
  const gone = exact ?? (tool ? waiting.find(one => one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent ?? '')) : undefined)
  if (!gone) return
  waiting = waiting.filter(one => one !== gone)
  redraw($)
  void shareMine($).catch(() => undefined)
}
// A command allowed starts at once: a process on this Mac running it ends its prompt before the command itself ends
let isLooking = false
const lookForStarted = async ($: EngineInterface) => {
  const sought = waiting.filter(one => one.snippet && one.seen !== undefined)
  if (!sought.length || isLooking) return
  isLooking = true
  try {
    const lines = await running($)
    if (!lines) return
    for (const one of sought) if (countOf(lines, one.snippet) > (one.seen ?? 0)) settle($, one.id)
  } finally {
    isLooking = false
  }
}

const promptHooks = (on: On) => {

  // A prompt the app is about to put to the person shows amber in every panel; the mod passes the request on untouched and never
  // answers it. A settings hook that answered it put nothing to the person
  on('tool.check', async ($, e, next) => {
    const r = await next(e)
    if (r.decision === 'ask' && e.tool_use_id && e.approver) {
      asked = [...asked.filter(one => one.id !== e.tool_use_id), { agent: e.agentId ?? '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }].slice(-50)
    }
    return r
  })
  on('classic.PermissionRequest', async ($, e, next) => {
    const id = dir && !isEnded ? await opened($, e.agent_id, e.tool_name, e.tool_input).catch(err => (void log($, `prompt not shown: ${String(err)}`), '')) : ''
    const r = await next(e)
    if (id && r?.decision) settle($, id)
    return r
  })
  on('classic.Notification', async ($, e, next) => {
    if (e.notification_type === 'permission_prompt' && waiting.length) await tellWaiting($).catch(err => log($, `prompt not told: ${String(err)}`))
    return next(e)
  })
  // It goes as its call ends (refused, interrupted, or allowed and run: the main tool.call hook below), or as the terminal draws its
  // running pill
  on('ui.render', { component: 'ToolProgress' }, async ($, e, next) => {
    const id = e.props.tool_use_id
    if (waiting.some(one => one.id === id)) void Promise.resolve().then(() => settle($, id))
    return next(e)
  })

}

