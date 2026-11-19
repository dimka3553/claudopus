// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, and the
// card of work under which nothing new has come back for STUCK_AFTER

// Nothing new for this long anywhere under a piece of work, while it works, and its card says so and the chat is told once. Above
// the longest one command can run (ten minutes) with a step either side of it, so a single long build or wait is not flagged
const STUCK_AFTER = 12 * 60_000
// One call running this long shows on its row, with its time
const RUNNING_SHOWN = 2 * 60_000
// Lines each agent has seen come back, so a wait that returns what it returned before is no news; kept to this many each
const SEEN_KEPT = 5000
// Only this many lines of one result are looked at
const LINES_READ = 2000
// What each agent's last call returned, whole, and when a call last returned something different: a frame count that moves on is
// output that changed, a call that says what the last one said is not
const lastResult = new Map<string, string>()
const changedAt = new Map<string, number>()

// The calls running now, by tool_use_id: whose, what, since when
const inFlight = new Map<string, { agent: string; what: string; at: number; cmd?: string; label?: string }>()
const seenLines = new Map<string, Set<string>>()

// What each agent began last and whether it has ended, in plain words, for the second line of a helper's row. Kept here, not on
// its card, so a call does not write the cards and redraw every panel
const lastCall = new Map<string, { id: string; what: string; at: number; endedAt?: number }>()
// A command's own words turned into what it is doing: "Render the song stills" is "Rendering the song stills"
const DOUBLED = new Set(['commit', 'rerun', 'plot', 'crop', 'fit', 'refit', 'format', 'submit', 'omit', 'permit', 'chop', 'prep', 'spin', 'run', 'stop', 'get', 'set', 'put', 'cut', 'plan', 'drop', 'ship', 'scan', 'grab', 'trim', 'zip', 'pin', 'tag', 'map', 'log', 'shut', 'chat', 'swap', 'skip', 'step', 'wrap', 'snap', 'clip', 'dig', 'begin'])
const VERBS = new Set(['run', 'download', 'upload', 'watch', 'serve', 'wait', 'check', 'render', 'build', 'test', 'install', 'fetch', 'copy', 'move', 'make', 'find', 'read', 'write', 'draw', 'train', 'fit', 'compute', 'count', 'convert', 'compress', 'push', 'pull', 'clone', 'deploy', 'start', 'stop', 'open', 'save', 'sync', 'update', 'fix', 'look', 'search', 'list', 'measure', 'compare', 'merge', 'release', 'export', 'import', 'generate', 'create', 'delete', 'remove', 'clean', 'tidy', 'record', 'capture', 'take', 'shoot', 'encode', 'decode', 'transcribe', 'play', 'send', 'load', 'prepare', 'set', 'get', 'sort', 'scan', 'crop', 'resize', 'split', 'join', 'bake', 'solve', 'analyse', 'analyze', 'plot', 'extract', 'unpack', 'pack', 'zip', 'grade', 'score', 'rank', 'evaluate', 'label', 'align', 'compile', 'lint', 'format', 'verify', 'validate', 'probe', 'query', 'print', 'show', 'restart', 'stage', 'commit', 'rebuild', 'retry', 'redo', 'rerun', 'resize', 'collect', 'gather', 'process', 'index', 'upscale', 'mesh', 'paint', 'cut', 'trim', 'publish', 'post', 'preview', 'shrink', 'combine', 'reset', 'apply', 'mark', 'tag', 'map', 'kill', 'begin', 'close', 'add', 'try'])
const doingOf = (said: string) => {
  const [first = '', ...rest] = said.trim().split(/\s+/)
  const word = first.toLowerCase()
  if (!VERBS.has(word) || !rest.length) return said.trim()
  const ing = DOUBLED.has(word) ? `${word}${word.at(-1)}ing` : /[^aeiou]e$/.test(word) && word !== 'be' ? `${word.slice(0, -1)}ing` : /ie$/.test(word) ? `${word.slice(0, -2)}ying` : `${word}ing`
  return [ing[0]?.toUpperCase() + ing.slice(1), ...rest].join(' ')
}
// What a call does, in a few plain words; nothing for the mod's own tools and the app's bookkeeping
const callWords = (tool: string, input?: { description?: unknown; command?: unknown }) => {
  const said = oneLine(String(input?.description ?? '')).replace(/\s*\((?:about|under|over|around|up to|~)?\s*[\d.,\-– ]+\s*(?:s|sec|seconds?|m|mins?|minutes?|h|hours?)\)\s*$/i, '').trim()
  if (tool.startsWith(TOOLS) || tool.startsWith(OLD_TOOLS) || ['ToolSearch', 'TodoWrite', 'SubagentHandback', 'ExitPlanMode'].includes(tool)) return ''
  if (tool === 'Bash') return said ? doingOf(said) : 'Running a command'
  if (tool === 'Monitor') return said ? `Watching: ${said}` : 'Watching for news'
  if (tool === 'Read') return 'Reading files'
  if (tool === 'Grep' || tool === 'Glob') return 'Searching the files'
  if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit' || tool === 'NotebookEdit') return 'Changing files'
  if (tool === 'WebFetch') return 'Reading a web page'
  if (tool === 'WebSearch') return 'Searching the web'
  if (tool === 'Agent' || tool === 'Task') return said ? `Starting the helper “${said}”` : 'Starting a helper'
  if (tool === 'SendMessage') return 'Sending a message'
  if (tool === 'TaskStop' || tool === 'KillShell') return 'Stopping a command'
  if (tool === 'TaskOutput' || tool === 'BashOutput') return "Reading a command's output"
  if (tool === 'Skill') return 'Using a skill'
  if (/chrome|browser|playwright|puppeteer/i.test(tool)) return 'Using the browser'
  const server = /^mcp__([^_]+(?:_[^_]+)*)__/.exec(tool)?.[1]
  // (a plugin's server is named once: "mcp__plugin_easel_easel__draw" is easel)
  const words = (server ?? '').replace(/^plugin_/, '').split(/[-_]+/).filter((word, n, all) => word && all.indexOf(word) === n)
  return words.length ? `Using ${words.join(' ')}` : 'Using a tool'
}
// What a helper is doing now: its own latest note where that is newer than its latest action; else the action, with how long it
// has run once that is a minute; between actions, thinking
const helperNow = (one: Todo, at: number, commands = 0, most = 200) => {
  const call = lastCall.get(one.id)
  const note = [...one.entries].reverse().find(entry => entry.kind !== 'steer' && entry.text)
  // The last thing it said, cut so how long it has been quiet always stays in sight
  const last = (words: string, tail: string) => `Last: ${cut(words, Math.max(8, most - tail.length - 9))} · ${tail}`
  const waits = (idle: number) => `${commands === 1 ? 'Waiting for its command' : 'Waiting for its commands'} · ${took(idle)}`
  // (a note that has stood for minutes with nothing since is the last thing it said, or it waits for its commands)
  if (note && (!call || (note.at ?? 0) >= call.at)) {
    const quiet = at - (note.at ?? at)
    return quiet < 3 * 60_000 ? cut(note.text, most) : commands ? waits(quiet) : last(note.text, `nothing new for ${took(quiet)}`)
  }
  if (!call) return ''
  if (!call.endedAt) return at - call.at >= 60_000 ? `${cut(call.what, Math.max(8, most - 12))} · ${took(at - call.at)}` : cut(call.what, most)
  // Between actions it is thinking; long after its last one, with commands of its own running in the background, it waits for
  // them, as their rows under it show; long after with none, what it did last and how long nothing new has come
  const idle = at - call.endedAt
  if (idle < 60_000) return 'Thinking'
  if (commands) return waits(idle)
  return idle < 3 * 60_000 ? `Thinking · ${took(idle)}` : last(call.what, `nothing new for ${took(idle)}`)
}

// What a running call is, in a few words, for its row
const runningWhat = (tool: string) =>
  tool === 'Bash' ? 'a command running' : tool === 'Grep' || tool === 'Glob' ? 'a search running' : tool === 'Agent' ? 'a helper running' : `${tool.replace(/^mcp__.*__/, '')} running`

// A result as lines: its text where it has some, else its parts each on a line of their own
const resultLines = (result: unknown): string[] => {
  const text =
    typeof result === 'string'
      ? result
      : Array.isArray((result as { content?: unknown })?.content)
        ? ((result as { content: { text?: unknown }[] }).content.map(part => String(part.text ?? '')).join('\n'))
        : result && typeof result === 'object'
          ? Object.values(result as Record<string, unknown>).map(value => (typeof value === 'string' ? value : JSON.stringify(value) ?? '')).join('\n')
          : String(result ?? '')
  // Digits are left out, so a wait that only prints a new time or count says nothing new
  return text.split('\n', LINES_READ).map(line => line.trim().replace(/\d/g, '#').slice(0, 300)).filter(Boolean)
}

// The longest-running call of an agent, as its card keeps it
const runningOf = (agent: string) => {
  const first = [...inFlight.values()].filter(one => one.agent === agent).sort((a, b) => a.at - b.at)[0]
  return first ? { what: first.what, at: first.at, ...(first.cmd ? { cmd: first.cmd, label: first.label } : {}) } : undefined
}
// A card with its running call as it is now, worked out as it is changed, so calls that begin and end together leave it true;
// the list itself when nothing changed
const withRunning = (list: Todo[], agent: string, newAt?: number) => {
  const running = runningOf(agent)
  const at = list.findIndex(one => one.id === agent)
  const one = list[at]
  if (!one || (one.running?.at === running?.at && one.running?.what === running?.what && (newAt === undefined || one.newAt === newAt))) return list
  return list.map((card, n) => (n === at ? { ...card, running, newAt: newAt ?? card.newAt } : card))
}

// A call of a piece of work begins: its card keeps the one it has been running longest
const callBegun = async ($: EngineInterface, id: string, agent: string, tool: string, input?: { command?: unknown; description?: unknown }) => {
  // A command keeps itself and its own words for itself, so its row can say which
  const cmd = tool === 'Bash' ? oneLine(String(input?.command ?? '')).slice(0, 400) : ''
  const label = oneLine(String(input?.description ?? '') || cmd.split('\n')[0] || '').slice(0, 160)
  const begun = await $.clock.now()
  inFlight.set(id, { agent, what: runningWhat(tool), at: begun, ...(cmd ? { cmd, label } : {}) })
  const words = callWords(tool, input)
  if (words) lastCall.set(agent, { id, what: words, at: begun })
  await changeTodos($, list => withRunning(list, agent))
}

// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
const callEnded = async ($: EngineInterface, id: string, agent: string, tool: string, r: { result?: unknown; deny?: unknown } | undefined) => {
  inFlight.delete(id)
  const now = await $.clock.now()
  const last = lastCall.get(agent)
  if (last?.id === id) lastCall.set(agent, { ...last, endedAt: now })
  let isNew = false
  if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
    const whole = (typeof r.result === 'string' ? r.result : JSON.stringify(r.result ?? '')).slice(0, 20_000)
    if (lastResult.get(agent) !== whole) (lastResult.set(agent, whole), changedAt.set(agent, now))
    const seen = seenLines.get(agent) ?? new Set<string>()
    for (const line of resultLines(r.result)) if (!seen.has(line)) ((isNew = true), seen.add(line))
    if (seen.size > SEEN_KEPT) seenLines.set(agent, new Set([...seen].slice(-SEEN_KEPT / 2)))
    else seenLines.set(agent, seen)
  }
  await changeTodos($, list => withRunning(list, agent, isNew ? now : undefined))
}

const runningKids = (list: Todo[], id: string) => list.filter(kid => kid.parentId === id && kid.status === 'working')

// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
const movedAt = (list: Todo[], top: Todo) => Math.max(...[top, ...underOf(list, top.id)].map(one => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0)))

// Looked at as the list is followed: a task at a step under which nothing new has come back for STUCK_AFTER is flagged, and the
// chat is told once; it clears when something does. Not a task that waits for the person, nor one with a command or a helper of
// its own running, which it has every right to wait for however long that lasts
const lookStuck = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const told: Todo[] = []
  await changeTodos($, list => {
    // Told afresh on each run of the change, as it runs again on a list written meanwhile
    told.length = 0
    let isChanged = false
    const isPrompted = (one: Todo) => waiting.some(p => p.agent && topOf(list, p.agent) === one.id)
    const next = list.map(one => {
      if (one.parentId || one.chat) return one
      // A task that moved again since the chat was told is no longer what the chat was told: flagged and told afresh if it is stuck again
      if (one.stuckTold !== undefined && movedAt(list, one) > one.stuckTold) ((isChanged = true), (one = { ...one, stuckTold: undefined, stuckAt: undefined }))
      const isStuck = stageOf(list, one) === 'working' && !one.ask && !one.bg?.length && !runningKids(list, one.id).length && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined, stuckTold: undefined })
      return one
    })
    return isChanged ? next : list
  })
  for (const one of told) {
    await changeTodos($, all => all.map(card => (card.id === one.id ? { ...card, stuckTold: now } : card)))
    await tellChat($, named(`${STUCK_IN_CHAT(titleOf(one), Math.round((now - movedAt(await read($, todos), one)) / 60_000))} ${STUCK_ASK}`))
  }
  // What agents that have ended had seen come back is let go
  const list = await read($, todos)
  for (const agent of seenLines.keys()) if (!list.some(one => one.id === agent && one.status === 'working')) seenLines.delete(agent)
  for (const agent of [...lastResult.keys()]) if (!list.some(one => one.id === agent && one.status === 'working')) (lastResult.delete(agent), changedAt.delete(agent))
}

// ---- What a task started in the background itself, as Claude Code tracks it: the only rows its card has ----

const BG_KEPT = 20
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response is not kept
const keepBackground = async ($: EngineInterface, agent: string, call: { tool: string; description?: unknown; command?: unknown; task_id?: unknown; shell_id?: unknown; timeout_ms?: unknown; persistent?: unknown }, result: unknown) => {
  if (call.tool === 'TaskStop' || call.tool === 'KillShell') return dropBackground($, [String(call.task_id ?? call.shell_id ?? '')], 'stopped')
  const r = (result && typeof result === 'object' ? result : {}) as { backgroundTaskId?: unknown; taskId?: unknown; backgroundEndsWithFinalResponse?: unknown }
  const id = call.tool === 'Bash' ? r.backgroundTaskId : call.tool === 'Monitor' ? r.taskId : undefined
  if (typeof id !== 'string' || !id || r.backgroundEndsWithFinalResponse) return
  const what = oneLine(String(call.description ?? '') || String(call.command ?? '').split('\n')[0] || '').slice(0, 160)
  const cmd = oneLine(String(call.command ?? '')).slice(0, 400)
  const now = await $.clock.now()
  // A watch ends at the time limit the engine said as it started it ("expires in 30m"), or else the one it was given where that is
  // within the engine's own 30 minutes; one kept for good has none
  const said = typeof result === 'string' ? result : JSON.stringify(result ?? '')
  const told = (result && typeof result === 'object' ? result : {}) as { timeoutMs?: unknown; persistent?: unknown }
  const isForGood = [call.persistent, told.persistent].some(p => p === true || p === 'true')
  const limit = call.tool !== 'Monitor' || isForGood ? undefined : Number(told.timeoutMs) > 0 ? Math.min(Number(told.timeoutMs), WATCH_MOST) : (expiresIn(said) ?? (Number(call.timeout_ms) > 0 ? Math.min(Number(call.timeout_ms), WATCH_MOST) : undefined))
  await changeTodos($, list =>
    list.map(one => (one.id === agent ? { ...one, bg: [...(one.bg ?? []).filter(b => b.id !== id), { id, what, at: now, ...(cmd ? { cmd } : {}), ...(call.tool === 'Monitor' || waitingOf(cmd) || describedOf(what).kind === 'watch' ? { isWatch: true } : {}), ...(limit ? { expiresAt: now + limit } : {}) }].slice(-BG_KEPT) } : one)),
  )
}
// The longest the engine lets a watch run before it ends it
const WATCH_MOST = 30 * 60_000
type EndedRun = NonNullable<Todo['endedRuns']>[number]
// How a run ended, said plainly: on its card's summary and in Details
const endedWord = (run: Pick<EndedRun, 'how' | 'code'>) => ({ finished: 'done', failed: 'failed', killed: 'stopped', stopped: 'stopped', 'timed out': 'ran out of time', ended: 'ended' })[run.how] ?? run.how
// The same with how long it ran, as a line of its own: "Done in 1m 05s", "Failed after 2m 05s"
const endedLine = (run: Pick<EndedRun, 'how' | 'code'>, ran: string) =>
  run.how === 'finished' ? `Done in ${ran}` : `${{ failed: 'Failed', killed: 'Stopped', stopped: 'Stopped', 'timed out': 'Ran out of time', ended: 'Ended' }[run.how] ?? 'Ended'} after ${ran}`
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
// Those that did not finish well are named, the newest of each kind of end and how many more, so "1 failed" never stands without
// which one (19 Nov "13 commands ended · 1 failed" named nothing); not one that has a row of its own above (`shown`, its id)
const endedSummary = (helpers: number, runs: Pick<EndedRun, 'how' | 'what' | 'id' | 'endedAt'>[], shown = '', lost: string[] = []) => {
  const n = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
  const head = helpers && runs.length ? `${n(helpers, 'helper')} and ${n(runs.length, 'command')} ended` : helpers ? `${n(helpers, 'helper')} ended` : `${n(runs.length, 'command')} ended`
  const bad = (['failed', 'killed', 'timed out'] as const).flatMap(how => {
    const of = runs.filter(r => r.how === how)
    if (!of.length) return []
    const newest = of.reduce((a, b) => (b.endedAt >= a.endedAt ? b : a))
    const name = of.some(r => r.id === shown) ? '' : runWords(String(newest.what ?? ''))
    return [`${of.length} ${endedWord({ how })}${name ? `: ${name}${of.length > 1 ? ` and ${of.length - 1} more` : ''}` : ''}`]
  })
  // (a helper that failed is named as a helper, so its name is never taken for a command's)
  const helpersBad = lost.length ? [`${n(lost.length, 'helper')} failed: ${lost.at(-1)}${lost.length > 1 ? ` and ${lost.length - 1} more` : ''}`] : []
  return [head, ...helpersBad, ...bad].join(' · ')
}
// The command that failed last and was not run again since with the same words and finished well: it has a row of its own on
// its card, with why, until it is
const failureOf = (runs: EndedRun[]) => {
  const failed = runs.filter(r => r.how === 'failed').reduce<EndedRun | undefined>((a, b) => (!a || b.endedAt >= a.endedAt ? b : a), undefined)
  return failed && !runs.some(r => r.how === 'finished' && r.endedAt >= failed.endedAt && r.what === failed.what) ? failed : undefined
}
// The runs a card has had end, kept so its summary row and Details can say how each ended, the newest last
const keepEnded = (one: Todo, runs: EndedRun[]) => (runs.length ? { endedRuns: [...(one.endedRuns ?? []).filter(r => !runs.some(n => n.id === r.id)), ...runs].slice(-BG_KEPT) } : {})
// Background work that has ended or was stopped leaves every card that kept it at once, and is kept as ended with how it ended
// (by its id, or one word for them all), so the card's summary counts it
type EndAs = EndedRun['how'] | { how: EndedRun['how']; code?: string; at?: number; why?: string }
const dropBackground = async ($: EngineInterface, ids: string[], how: EndAs | Record<string, EndAs> = 'ended') => {
  const now = await $.clock.now()
  const endOfId = (id: string) => {
    const one = typeof how === 'string' || 'how' in how ? (how as EndAs) : ((how as Record<string, EndAs>)[id] ?? 'ended')
    return typeof one === 'string' ? { how: one } : one
  }
  return changeTodos($, list => {
    const isGone = (id: string) => ids.includes(id)
    if (!list.some(one => one.bg?.some(b => isGone(b.id)))) return list
    return list.map(one => {
      const bg = one.bg?.filter(b => !isGone(b.id))
      if (bg?.length === one.bg?.length) return one
      const runs = (one.bg ?? []).filter(b => isGone(b.id)).map(b => {
        const end = endOfId(b.id)
        // It ended when its output last changed, where that is known, else as it was seen gone. A watch the engine killed at the
        // time limit it set ran out of time (within a tenth of its limit, at most a minute, as its limit is counted from when the mod saw it start); one killed
        // before it was killed
        const endedAt = end.at && end.at >= b.at && end.at <= now ? end.at : now
        const how = end.how === 'killed' && b.expiresAt && endedAt >= b.expiresAt - Math.min(60_000, (b.expiresAt - b.at) / 10) ? 'timed out' : end.how
        // With its kind, for its mark, why it failed, and the file it wrote to, which a press on its name opens
        const kind: JobKind = b.isWatch ? 'watch' : (describedOf(b.what).kind ?? jobKindOf(b.cmd ?? b.what, b.what))
        const file = jobFiles.get(b.id)
        return { id: b.id, what: b.what, at: b.at, endedAt, how, kind, ...(end.code ? { code: end.code } : {}), ...(end.why ? { why: end.why } : {}), ...(file ? { file } : {}) } as EndedRun
      })
      return { ...one, bg: bg?.length ? bg : undefined, ...keepEnded(one, runs) }
    })
  })
}


// ---- One rule against stopping early, and the gate at the hand-back ----

// A task may not stop while to-dos are left, nothing of its own runs and nothing waits for the person: it carries on, asks, or
// hands in its result after dropping what will not be done. Why its stop is refused, or '' to let it stop. Asked inside its own run
// as it stops (the SubagentStop hook), where Claude Code's own `stop_hook_active` keeps it from being asked twice in a row
const stopRefused = (list: Todo[], id: string) => {
  const one = list.find(card => card.id === id)
  const open = openItems(one)
  if (!one || isOff || !dir || one.parentId || one.chat || one.status !== 'working' || one.flagged || !open.length) return ''
  if (isHeld(one) || stoppedHere.has(id) || pressed.has(id) || ownsWork(list, one) || needsPerson(one)) return ''
  return named(MAY_NOT_STOP(open.map(item => item.text)))
}
// Its result handed in: refused, every time, while a to-do is open, a helper of its is at work, or a command of its own that is no
// server still runs. Why, or '' when it goes through
const handbackRefused = (list: Todo[], id: string) => {
  const one = list.find(card => card.id === id)
  if (!one || isOff || !dir || one.chat || one.flagged || flowAgents.has(id)) return ''
  const open = openItems(one).map(item => item.text)
  if (open.length) return named(NOT_HANDED_TODOS(open))
  const helpers = helpersAtWork(list, id).map(titleOf)
  if (helpers.length) return named(NOT_HANDED_HELPERS(helpers))
  const runs = ownRuns(one).map(b => runWords(b.what, b.cmd))
  return runs.length ? named(NOT_HANDED_RUNS(runs)) : ''
}
