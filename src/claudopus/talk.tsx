// A piece of work's own chat, read for its Details tab: what it was told, what it wrote, each tool step; and opening that tab

// ---- A piece of work's own chat: what it was told, what it wrote, and each tool step, in order ----

// One line of that chat as the panel draws it: a message to the work, the work's own words, or one tool step
// `pictures` are the picture files a step wrote or sent; `seen` the ones a command only named, kept if made since the work began
type Line = {
  kind: 'told' | 'steer' | 'said' | 'step' | 'model'
  text: string
  id?: string
  isError?: boolean
  isUse?: boolean
  tool?: string
  at?: number
  name?: string
  covers?: string
  sentAt?: number
  readAt?: number
  pictures?: string[]
  seen?: string[]
}
// A picture a step can make, by its name
const IMAGE = /\.(png|jpe?g|gif|webp|svg)$/i
// The most picture files one command may name and still be taken to have made them
const SEEN_MOST = 4
// The pictures one tool step made: a file it wrote or sent, and the picture files its command or output names or that it looked
// at, which count when made since the work began (a work looks at what it rendered)
const picturesOf = (use: ToolUseSummary) => {
  const input = use.input ?? {}
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  if (use.isError) return { pictures: [], seen: [] }
  // One file as /tmp and /private/tmp alike
  const same = (path: string) => path.replace(/^\/private(?=\/(tmp|var)\/)/, '')
  const sent = use.tool === 'SendUserFile' && Array.isArray(input.files) ? input.files.filter((one): one is string => typeof one === 'string') : []
  const written = ['Write', 'Edit'].includes(use.tool) ? [given('file_path')] : []
  const named = use.tool === 'Bash' ? namedPaths(`${given('command')}\n${use.text ?? ''}`) : use.tool === 'Read' ? [given('file_path')] : []
  // A command that lists a folder of pictures made none of them: past a few, it names none
  const seen = [...new Set(named.filter(one => IMAGE.test(one)).map(same))]
  return { pictures: [...new Set([...written, ...sent].filter(one => IMAGE.test(one)).map(same))], seen: seen.length > SEEN_MOST ? [] : seen }
}

// A tool's name as a person reads it: the last part of a connector's tool, in words
const toolName = (tool: string) => (tool.startsWith('mcp__') ? (tool.split('__').pop() ?? tool).replaceAll('_', ' ') : tool)
const fileName = (path: string) => path.split('/').pop() ?? path
// What a tool step was for: the call's own description where it has one, else what it was pointed at
const aim = (input: Record<string, unknown>) => {
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  const path = given('file_path') || given('path') || given('notebook_path')
  return given('description') || (path && fileName(path)) || given('pattern') || given('query') || given('url') || given('skill') || given('command') || given('prompt') || given('message') || ''
}
// One tool step as one short line. What the work wrote for the person through a tool is its own words, not a step
const stepOf = (use: ToolUseSummary): Line => {
  const input = use.input ?? {}
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  if (isTool(use.tool, 'note')) return { kind: 'said', text: given('text'), isUse: true }
  if (use.tool === 'SubagentHandback' || isTool(use.tool, 'report')) return { kind: 'said', text: whole(given('message')), isUse: true }
  if (use.tool === 'Agent') return { kind: 'step', text: `Started a helper: ${given('description') || 'unnamed'}`, isError: use.isError, isUse: true, tool: use.tool, name: given('description') }
  const file = given('file_path') || given('notebook_path')
  const text =
    isTool(use.tool, 'todo')
      ? `${{ doing: 'Started', done: 'Done', dropped: 'Dropped' }[given('state')] ?? 'To-do'}: ${given('item')}`
      : given('description')
        ? oneLine(given('description'))
        : file
          ? `${toolName(use.tool)} ${fileName(file)}`
          : [toolName(use.tool), oneLine(aim(input))].filter(Boolean).join(': ')
  const { pictures, seen } = picturesOf(use)
  return {
    kind: 'step',
    ...(use.tool_use_id ? { id: use.tool_use_id } : {}),
    text: text.length > STEP_CHARS ? `${text.slice(0, STEP_CHARS)} …` : text,
    isError: use.isError,
    isUse: true,
    tool: use.tool,
    ...(pictures.length ? { pictures } : {}),
    ...(seen.length ? { seen } : {}),
  }
}
// The steps of an opened run as it lists them: helpers started one after another are one line, named by what their names share
const listed = (steps: Line[]) =>
  steps.reduce<Line[]>((all, line) => {
    const last = all.at(-1)
    if (line.tool !== 'Agent' || last?.tool !== 'Agent' || line.isError || last.isError) return [...all, { ...line, covers: line.name }]
    const names = [...(last.covers ?? '').split('\n'), line.name ?? '']
    const first = names[0] ?? ''
    const end = names.at(-1) ?? ''
    let same = 0
    while (same < first.length && names.every(name => name[same] === first[same])) same += 1
    const text = same >= 6 ? `Started ${names.length} helpers: ${first} to ${end.slice(same) || end}` : `Started ${names.length} helpers: ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''}`
    return [...all.slice(0, -1), { ...last, text, covers: names.join('\n') }]
  }, [])
// A message as the chat draws it: whole, unless it is too long for one drawing
const whole = (text: string) => (text.length > SAID_CHARS ? `${text.slice(0, SAID_CHARS)}\n\n…` : text)
// What the app adds around a message for the model alone is no part of the chat
const bare = (text: string) =>
  whole(
    (text.replace(/<system-reminder[^>]*>[\s\S]*?<\/system-reminder[^>]*>/g, '').split(workHead())[0] ?? '')
      .replace(PANEL_RULE, '')
      .trim(),
  )
// The chat of a piece of work as lines. The rows the engine gives hold each message's text and its tool calls, and no thinking
const talkOf = (rows: readonly SessionMessage[]): Line[] =>
  rows.flatMap((row): Line[] => {
    const text = bare(row.text)
    const moved = row.role === 'user' ? MODEL_LINE.exec(text) : null
    if (moved) return [{ kind: 'model', text: `${MODEL_HEAD}${moved[1]} · ${moved[2]}` }]
    if (row.role === 'user') return text ? [{ kind: 'told', text }] : []
    return [...(text ? [{ kind: 'said' as const, text }] : []), ...row.toolUses.map(stepOf)]
  })
// A run of tool steps in a few words, as the app's own chat folds one: "Ran 3 commands, read 2 files"
const folded = (steps: Line[]) => {
  const count = (tools: string[]) => steps.filter(line => tools.includes(line.tool ?? '')).length
  const some = (n: number, did: string, thing: string) => (n ? `${did} ${n} ${thing}${n === 1 ? '' : 's'}` : '')
  const known = ['Bash', 'Read', 'Edit', 'Write', 'NotebookEdit', 'Grep', 'Glob', 'Agent', `${TOOLS}todo`, `${OLD_TOOLS}todo`]
  const parts = [
    some(count(['Bash']), 'ran', 'command'),
    some(count(['Read']), 'read', 'file'),
    some(count(['Edit', 'Write', 'NotebookEdit']), 'edited', 'file'),
    some(count(['Grep', 'Glob']), 'made', 'search'),
    some(count(['Agent']), 'started', 'helper'),
    count([`${TOOLS}todo`, `${OLD_TOOLS}todo`]) ? 'updated its to-dos' : '',
    some(steps.filter(line => !known.includes(line.tool ?? '')).length, 'used', 'other tool'),
    steps.some(line => line.isError) ? `${steps.filter(line => line.isError).length} failed` : '',
  ]
    .filter(Boolean)
    .join(', ')
  return `${parts.charAt(0).toUpperCase()}${parts.slice(1)}`
}
// A message as it is compared: on one line, without quote marks or the app's own tags
const flat = (text: string) => oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' ')).replace(/["“”]/g, '')
// Each steer of the person's is shown once, in their words, where it arrived. One sent to work that had stopped is a message in the rows
// the engine gives: it takes that message's place. One sent to work under way is in no row: it goes before what the work did
// about it, its to-dos and the line it then wrote. One the work has written nothing since is last. One whose reading is followed
// (isFollowed) says when it was sent and whether it was read
const withSteers = (lines: Line[], entries: Entry[]): Line[] => {
  const all = [...lines]
  let from = 1
  entries.forEach((entry, i) => {
    if (entry.kind !== 'steer') return
    const text = oneLine(entry.text.replace(/<\/?pasted_content[^>]*>/g, ' '))
    const when = isFollowed(entry) ? { sentAt: entry.at, ...(entry.readAt ? { readAt: entry.readAt } : {}) } : {}
    const head = flat(text).slice(0, 40)
    const sent = all.findIndex((line, n) => n > 0 && flat(line.covers ?? (line.kind === 'told' ? line.text : '')).includes(head))
    if (sent >= 0) {
      const covers = all[sent]?.covers ?? all[sent]?.text ?? ''
      const isFirst = all[sent]?.kind === 'told'
      let at = sent
      while (!isFirst && all[at + 1]?.covers === covers) at += 1
      all.splice(isFirst ? sent : at + 1, isFirst ? 1 : 0, { kind: 'steer', text, covers, ...when })
      from = Math.max(from, at + 1)
      return
    }
    const later = entries.slice(i + 1).filter(isOwnEntry).map(one => one.text)
    let at = all.findIndex((line, n) => n >= from && line.kind === 'said' && later.includes(oneLine(line.text).slice(0, NOTE_CHARS)))
    while (at > from && isTool(all[at - 1]?.tool, 'todo')) at -= 1
    all.splice(at < 0 ? all.length : at, 0, { kind: 'steer', text, ...when })
    from = at < 0 ? all.length : at + 1
  })
  return all
}
// The newest lines of a chat that one drawing has room for; fewer in a Details tab drawn with less in it (`squeeze`, drawingFits)
const TALK_SQUEEZED = [
  [TALK_KEPT, TALK_CHARS],
  [100, 16_000],
  [30, 6_000],
  [10, 2_000],
] as const
const newest = (lines: Line[], squeeze = 0) => {
  const [kept, chars] = TALK_SQUEEZED[Math.min(squeeze, TALK_SQUEEZED.length - 1)] ?? TALK_SQUEEZED[0]
  let room: number = chars
  const from = lines.findLastIndex((line, i) => i < lines.length - kept || (room -= line.text.length) < 0)
  return lines.slice(from + 1)
}

// ---- What a task or helper is doing right now, as the app's own chat shows it while it happens ----

// The rows the engine gives hold only what is whole: a response once it has ended, a tool call once it has begun. What comes
// before that (thinking, words as they are written, a call whose arguments are still being written) and which calls run now are
// followed here from the model's stream (workHooks' turn.step) and the calls themselves (workHooks' tool.call), so its Details
// shows it as it happens, under what the rows already hold
// One part of a response as it arrives, in the response's own order: its thinking, its words, or a call being written
type LiveBlock = { kind: 'thinking' | 'text' | 'tool'; index: number; text: string; at: number; id?: string; name?: string }
// The response under way of each agent: from when it was asked for, its parts, and the read count (talkMarks) when it ended. It is
// shown until the conversation is read again after its end, which holds it whole
type LiveStep = { from: number; blocks: LiveBlock[]; endedAt?: number; endedMark?: number }
const liveSteps = new Map<string, LiveStep>()
// The calls each agent runs now, by tool_use_id, with what they were given and since when
const liveCalls = new Map<string, Map<string, { tool: string; input: Record<string, unknown>; at: number }>>()
// How many times each agent's conversation moved in a way its rows show (a call began or ended, a step or turn ended): the reading
// of its Details is keyed by it, so it is read again then
const talkMarks = new Map<string, number>()
// The most responses under way kept at once (an agent no tab looked at keeps its last until this many came after it)
const LIVE_KEPT = 60
// The most thinking and words one response keeps while it streams: the newest of it
const LIVE_THINKING = 1_200
const talkMoved = (id: string) => void talkMarks.set(id, (talkMarks.get(id) ?? 0) + 1)
// A response begins: it is shown as thinking until its first part comes
const liveBegun = (id: string, from: number) => {
  liveSteps.delete(id)
  liveSteps.set(id, { from, blocks: [] })
  while (liveSteps.size > LIVE_KEPT) liveSteps.delete(liveSteps.keys().next().value ?? '')
  talkMoved(id)
}
// One piece of the response arrives. Only what the person would see: thinking, words, the call's name and its arguments
const liveChunk = (id: string, chunk: { kind: string; index?: number; text?: string; id?: string; name?: string; json?: string }, at: number) => {
  const step = liveSteps.get(id)
  if (!step || step.endedAt !== undefined || typeof chunk.index !== 'number') return
  const kind = chunk.kind === 'input' ? 'tool' : chunk.kind
  if (kind !== 'thinking' && kind !== 'text' && kind !== 'tool') return
  let block = step.blocks.find(one => one.index === chunk.index && one.kind === kind)
  if (!block) step.blocks.push((block = { kind, index: chunk.index, text: '', at }))
  if (chunk.kind === 'tool') Object.assign(block, { id: chunk.id, name: chunk.name })
  const more = chunk.kind === 'input' ? (chunk.json ?? '') : (chunk.text ?? '')
  block.text = kind === 'thinking' ? (block.text + more).slice(-LIVE_THINKING) : (block.text + more).slice(0, SAID_CHARS * 2)
}
const liveEnded = (id: string, at: number) => {
  const step = liveSteps.get(id)
  if (step && step.endedAt === undefined) Object.assign(step, { endedAt: at, endedMark: talkMarks.get(id) ?? 0 })
}
// The conversation was read at `mark`, from `from`: a response that ended before that is in what was read, and leaves the live part
const liveCaughtUp = (id: string, mark: number, from: number) => {
  const step = liveSteps.get(id)
  if (step?.endedMark !== undefined && (mark > step.endedMark || from >= (step.endedAt ?? Infinity))) liveSteps.delete(id)
}
const callBegins = (agent: string, id: string, tool: string, input: Record<string, unknown>, at: number) => {
  const calls = liveCalls.get(agent) ?? new Map()
  calls.set(id, { tool, input, at })
  liveCalls.set(agent, calls)
  talkMoved(agent)
}
const callEnds = (agent: string, id: string) => {
  const calls = liveCalls.get(agent)
  calls?.delete(id)
  if (calls && !calls.size) liveCalls.delete(agent)
  talkMoved(agent)
}
// A response passed on piece by piece as it came, each piece also kept for the live part
async function* followStream<C, R>($: EngineInterface, id: string, stream: AsyncIterator<C, R>): AsyncGenerator<C, R> {
  liveBegun(id, await $.clock.now())
  let isDone = false
  try {
    for (;;) {
      const got = await stream.next()
      if (got.done) return ((isDone = true), got.value)
      liveChunk(id, got.value as never, await $.clock.now())
      yield got.value
    }
  } finally {
    liveEnded(id, await $.clock.now())
    // (a response the engine stopped taking, as on Stop, is let go beneath too)
    if (!isDone) await stream.return?.(undefined as never)
  }
}
// A call's arguments while they are still being written: whole where they already parse, else each text value written so far
// (a note's words, a command's description), so what it says shows as it is written
const partialInput = (json: string): Record<string, unknown> => {
  try {
    const whole = JSON.parse(json) as unknown
    if (whole && typeof whole === 'object') return whole as Record<string, unknown>
  } catch {
    // still being written
  }
  const found: Record<string, unknown> = {}
  for (const [, key, value = ''] of json.matchAll(/"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)/g)) {
    try {
      found[key ?? ''] = JSON.parse(`"${value.replace(/\\(u[0-9a-fA-F]{0,3})?$/, '')}"`)
    } catch {
      found[key ?? ''] = value
    }
  }
  return found
}
// What one agent is doing now, as lines drawn under its conversation, oldest first: the response under way part by part (thinking
// while it thinks, then how long it thought; its words; each call as it is written), then each call it runs now with how long it
// has run. `shown` are the tool_use_ids the conversation already holds, which its response no longer repeats
type LiveLine = { kind: 'thinking' | 'thought' | 'said' | 'call'; text: string; head?: string; detail?: string; since?: number; id?: string }
// What a call is doing, in the app's own chat's words for it while it runs
const runningWords = (tool: string) =>
  tool === 'Bash' ? 'Running a command' : tool === 'Read' ? 'Reading a file' : ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(tool) ? 'Editing a file' : tool === 'Grep' ? 'Searching files' : tool === 'Glob' ? 'Finding files' : tool === 'WebFetch' ? 'Reading a page' : tool === 'WebSearch' ? 'Searching the web' : tool === 'Agent' || tool === 'Task' ? 'Starting a helper' : tool === 'Skill' ? 'Running skill' : 'Using a tool'
const liveLinesOf = (id: string, shown: Set<string>, at: number): LiveLine[] => {
  const step = liveSteps.get(id)
  const calls = liveCalls.get(id) ?? new Map<string, { tool: string; input: Record<string, unknown>; at: number }>()
  const lines: LiveLine[] = []
  if (step) {
    const blocks = [...step.blocks].sort((a, b) => a.index - b.index)
    blocks.forEach((block, n) => {
      const after = blocks[n + 1]
      if (block.kind === 'thinking') {
        const isOn = !after && step.endedAt === undefined
        lines.push(isOn ? { kind: 'thinking', text: 'Thinking…' } : { kind: 'thought', text: `Thought for ${took(Math.max(1000, (after?.at ?? step.endedAt ?? at) - block.at))}`, detail: block.text.trim() })
        return
      }
      if (block.kind === 'text') {
        if (block.text.trim()) lines.push({ kind: 'said', text: whole(block.text.trimEnd()) })
        return
      }
      if (block.id && (calls.has(block.id) || shown.has(block.id))) return
      const line = stepOf({ tool_use_id: block.id ?? '', tool: block.name ?? '', input: partialInput(block.text) } as ToolUseSummary)
      if (line.kind === 'said') return void (line.text.trim() && lines.push({ kind: 'said', text: line.text }))
      if (isTool(block.name, 'todo')) return
      lines.push({ kind: 'call', head: runningWords(block.name ?? ''), text: line.text || toolName(block.name ?? ''), since: block.at, ...(block.id ? { id: block.id } : {}) })
    })
    // Asked for, and nothing back yet: it thinks
    if (!blocks.length && step.endedAt === undefined) lines.push({ kind: 'thinking', text: 'Thinking…' })
  }
  for (const [callId, call] of calls) {
    const line = stepOf({ tool_use_id: callId, tool: call.tool, input: call.input } as ToolUseSummary)
    // (the mod's own tools say what they say in the conversation, and end at once)
    if (line.kind !== 'step' || call.tool.startsWith(TOOLS) || call.tool.startsWith(OLD_TOOLS)) continue
    lines.push({ kind: 'call', head: runningWords(call.tool), text: line.text, since: call.at, id: callId })
  }
  return lines
}
// What a Details tab's live part shows, in a few values: it is drawn again when this moves (calmLook), the times every LIVE_STEP_TICK
const LIVE_STEP_TICK = 5_000
const liveSign = (ids: string[], at: number) =>
  JSON.stringify(
    ids.map(id => {
      const step = liveSteps.get(id)
      const isOn = (step && step.endedAt === undefined) || liveCalls.has(id)
      return [talkMarks.get(id) ?? 0, step ? [step.endedAt ?? 0, step.blocks.map(one => [one.kind, one.text.length])] : 0, [...(liveCalls.get(id)?.keys() ?? [])], isOn ? Math.floor(at / LIVE_STEP_TICK) : 0]
    }),
  )
// The Details tabs drawn lately, by pane, with the task each shows: what calmLook watches for its live part
const paneWork = new Map<string, string>()

// A piece of work's Details is a tab of its own, named after the work, beside the list, as a result is: closing it leaves the
// list as it was. A press on Details for work whose tab is open brings that tab to the front
const WORK_PANE = 'work-'
const workPaneOf = (id: string) => `${WORK_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64)
const titleOf = (one: Todo) => one.title || quoted(one.words, 60) || 'Background task'
const openWork = ($: EngineInterface, id: string) => {
  presses += 1
  void comingTab((async () => {
    const there = await read($, others)
    const one = [...(await read($, todos)), ...cardsOf(there), ...helpersOf(there)].find(card => card.id === id)
    if (!one) return
    // A tab opened afresh starts folded; one already open keeps what was unfolded in it
    if (!(await $.ui.panes()).some(pane => pane.id === workPaneOf(id))) (folds.delete(id), pictureIn.delete(workPaneOf(id)))
    await front($, workPaneOf(id), cut(titleOf(one), 30))
    // The pressed card's button gets a new name, so the app does not hold the list where that button was
    redraw($)
  })()).catch(err => log($, `details of ${id} not opened: ${String(err)}`))
}
