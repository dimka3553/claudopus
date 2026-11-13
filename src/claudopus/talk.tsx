// A piece of work's own chat, read for its Details tab: what it was told, what it wrote, each tool step; and opening that tab

// ---- A piece of work's own chat: what it was told, what it wrote, and each tool step, in order ----

// One line of that chat as the panel draws it: a message to the work, the work's own words, or one tool step
// `pictures` are the picture files a step wrote or sent; `seen` the ones a command only named, kept if made since the work began
type Line = {
  kind: 'told' | 'steer' | 'said' | 'step' | 'model'
  text: string
  isError?: boolean
  isUse?: boolean
  tool?: string
  at?: number
  name?: string
  covers?: string
  isWaiting?: boolean
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
  if (use.tool === 'SubagentHandback') return { kind: 'said', text: whole(given('message')), isUse: true }
  if (use.tool === 'Agent') return { kind: 'step', text: `Started a helper: ${given('description') || 'no name'}`, isError: use.isError, isUse: true, tool: use.tool, name: given('description') }
  const file = given('file_path') || given('notebook_path')
  const text =
    isTool(use.tool, 'todo')
      ? `${{ doing: 'Started on', done: 'Ticked', dropped: 'Dropped' }[given('state')] ?? 'To-do'}: ${given('item')}`
      : given('description')
        ? oneLine(given('description'))
        : file
          ? `${toolName(use.tool)} ${fileName(file)}`
          : [toolName(use.tool), oneLine(aim(input))].filter(Boolean).join(': ')
  const { pictures, seen } = picturesOf(use)
  return {
    kind: 'step',
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
    some(steps.filter(line => !known.includes(line.tool ?? '')).length, 'took', 'other step'),
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
// about it, its to-dos and the line it then wrote. One the work has written nothing since is last, and is waiting
const withSteers = (lines: Line[], entries: Entry[]): Line[] => {
  const all = [...lines]
  let from = 1
  entries.forEach((entry, i) => {
    if (entry.kind !== 'steer') return
    const text = oneLine(entry.text.replace(/<\/?pasted_content[^>]*>/g, ' '))
    const head = flat(text).slice(0, 40)
    const sent = all.findIndex((line, n) => n > 0 && flat(line.covers ?? (line.kind === 'told' ? line.text : '')).includes(head))
    if (sent >= 0) {
      const covers = all[sent]?.covers ?? all[sent]?.text ?? ''
      const isFirst = all[sent]?.kind === 'told'
      let at = sent
      while (!isFirst && all[at + 1]?.covers === covers) at += 1
      all.splice(isFirst ? sent : at + 1, isFirst ? 1 : 0, { kind: 'steer', text, covers })
      from = Math.max(from, at + 1)
      return
    }
    const later = entries.slice(i + 1).filter(one => one.kind !== 'steer').map(one => one.text)
    let at = all.findIndex((line, n) => n >= from && line.kind === 'said' && later.includes(oneLine(line.text).slice(0, NOTE_CHARS)))
    while (at > from && isTool(all[at - 1]?.tool, 'todo')) at -= 1
    all.splice(at < 0 ? all.length : at, 0, { kind: 'steer', text, isWaiting: later.length === 0 })
    from = at < 0 ? all.length : at + 1
  })
  return all
}
// The newest lines of a chat that one drawing has room for
const newest = (lines: Line[]) => {
  let room = TALK_CHARS
  const from = lines.findLastIndex((line, i) => i < lines.length - TALK_KEPT || (room -= line.text.length) < 0)
  return lines.slice(from + 1)
}

// A piece of work's Details is a tab of its own, named after the work, beside the list, as a result is: closing it leaves the
// list as it was. A press on Details for work whose tab is open brings that tab to the front
const WORK_PANE = 'work-'
const workPaneOf = (id: string) => `${WORK_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64)
const titleOf = (one: Todo) => one.title || quoted(one.words, 60) || 'Background work'
const openWork = ($: EngineInterface, id: string) => {
  presses += 1
  void comingTab((async () => {
    const one = [...(await read($, todos)), ...cardsOf(await read($, others))].find(card => card.id === id)
    if (!one) return
    // A tab opened afresh starts folded; one already open keeps what was unfolded in it
    if (!(await $.ui.panes()).some(pane => pane.id === workPaneOf(id))) (folds.delete(id), pictureIn.delete(workPaneOf(id)))
    await front($, workPaneOf(id), cut(titleOf(one), 30))
    // The pressed card's button gets a new name, so the app does not hold the list where that button was
    redraw($)
  })()).catch(err => log($, `details of ${id} not opened: ${String(err)}`))
}
