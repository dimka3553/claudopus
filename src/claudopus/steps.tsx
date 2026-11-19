// Steps that could have gone out together: after each step of work, a line in its next request when the step shows a pattern that
// costs time (a helper started alone, a run of single lookups, long runs of one kind one after another, a step of only to-dos, a
// commit with no second look started)

// The calls that keep the card and the memory: they ride along with a work call and are never a step's work
const BOOK = ['todo', 'note', 'update', 'waits', 'recall', 'ask']
const isBook = (tool: string) => BOOK.some(name => isTool(tool, name)) || tool === 'ToolSearch' || tool === 'TodoWrite'
// A lookup: a read of one file or one search, which a step can send several of at once
const LOOKUP_TOOLS = ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch']
const LOOKUP_COMMAND = /^\s*(?:cd \S+ && )?(?:cat|head|tail|less|wc|ls|rg|grep|find|sed -n|jq|git (?:-C \S+ )?(?:log|show|diff|status|blame|grep))\b/
const isLookup = (tool: string, input: unknown) =>
  LOOKUP_TOOLS.includes(tool) || (tool === 'Bash' && !(input as { run_in_background?: unknown })?.run_in_background && LOOKUP_COMMAND.test(String((input as { command?: unknown })?.command ?? '')))
// A commit: what a second look, pictures and docs can start from
const COMMIT = /\bgit (?:-C \S+ )?commit\b/
// A helper that looks for what is wrong: a second look
const CHECKER = /\b(check|checks|review|second look|look for what|what is wrong|verify|audit)\b/i
// Single lookups in a row before a line says to send them together
const LOOKUPS_IN_A_ROW = 3
// A run this long is a long one; two of one kind in a row, each alone in its step, could have run side by side
const LONG_RUN = 60_000
// The most lines of each kind one agent is told
const LINES_EACH = 2

// What a step sends back, in the words the work reads
const HELPER_ALONE =
  'That step started one helper and nothing else. The helper runs in the background and its result comes to you when it ends, so continue now with what needs nothing from it. Next time, send in the same step every call that needs nothing from the helper: other helpers, your own part, the second look, notes.'
const LOOKUP_RUN = (n: number) =>
  `The last ${n} steps each held one lookup. Send the lookups you already know you need together in one step. When you need only the conclusion of reading or searching across many files, send that to a helper, which keeps your context small. Read a single file you know yourself.`
const SERIAL_RUNS = (what: string) =>
  `Two long commands of one kind (${what}) ran one after the other, each alone in its step. When they don't depend on each other, run them side by side: each in its own throwaway chat, worktree, terminal session or background command, or each as a helper, all started in one step.`
const BOOK_ALONE =
  'That step held only to-do and note calls. They cost a turn of their own: send them in the same step as your next working call.'
const LOOK_NOW =
  'You committed. The second look, the pictures and the docs need nothing more than this: start them now, as helpers in the same step as your next calls, not after the rest is done.'

// Per agent: its single lookups in a row, the last long run's kind, and how many of each line it was told
const stepsSeen = new Map<string, { lookups: number; lastRun?: string; told: Record<string, number>; checkerAt?: number; steps: number; singles: number }>()
// When each call began, by call id, to tell a long run
const callStarts = new Map<string, number>()
const STEPS_KEPT = 400
const callStarted = (id: string, at: number) => {
  callStarts.set(id, at)
  if (callStarts.size > 2000) callStarts.delete(callStarts.keys().next().value ?? '')
}

// The kind of a long command: its first two words, a test run or a capture alike
const kindOf = (command: string) => oneLine(command.replace(/^\s*cd \S+ && /, '')).split(' ').slice(0, 2).join(' ')

// What one step of an agent tells it, in the order the patterns are looked at; at most LINES_EACH of each kind per agent
const stepLines = (agent: string, calls: { tool: string; input: unknown; tookMs: number }[], isTop = true) => {
  const seen = stepsSeen.get(agent) ?? { lookups: 0, told: {}, steps: 0, singles: 0 }
  if (!stepsSeen.has(agent) && stepsSeen.size >= STEPS_KEPT) stepsSeen.delete(stepsSeen.keys().next().value ?? '')
  stepsSeen.set(agent, seen)
  const lines: string[] = []
  const say = (kind: string, line: string) => {
    if ((seen.told[kind] ?? 0) >= LINES_EACH) return
    seen.told[kind] = (seen.told[kind] ?? 0) + 1
    lines.push(line)
  }
  const work = calls.filter(one => !isBook(one.tool))
  seen.steps += 1
  if (work.length === 1) seen.singles += 1
  if (!work.length) {
    if (calls.every(one => isTool(one.tool, 'todo') || isTool(one.tool, 'note') || one.tool === 'TodoWrite')) say('book', BOOK_ALONE)
    return lines
  }
  const helpers = work.filter(one => one.tool === 'Agent')
  if (helpers.some(one => CHECKER.test(String((one.input as { description?: unknown })?.description ?? '')))) seen.checkerAt = seen.steps
  if (work.length === 1 && helpers.length === 1) say('alone', HELPER_ALONE)
  if (helpers.length && !seen.told.started) say('started', HELPERS_STARTED)
  // Single lookups in a row
  seen.lookups = work.length === 1 && isLookup(work[0]!.tool, work[0]!.input) ? seen.lookups + 1 : 0
  if (seen.lookups >= LOOKUPS_IN_A_ROW) {
    say('lookups', LOOKUP_RUN(seen.lookups))
    seen.lookups = 0
  }
  // Long runs of one kind, each alone in its step
  const one = work.length === 1 ? work[0] : undefined
  const command = one?.tool === 'Bash' ? String((one.input as { command?: unknown })?.command ?? '') : ''
  const kind = one && command && one.tookMs >= LONG_RUN && !isLookup(one.tool, one.input) ? kindOf(command) : ''
  if (kind && seen.lastRun === kind) say('serial', SERIAL_RUNS(kind))
  seen.lastRun = kind || (one ? undefined : seen.lastRun)
  // A commit with no second look started
  if (isTop && lean.second !== 'asked' && seen.checkerAt === undefined && work.some(call => call.tool === 'Bash' && COMMIT.test(String((call.input as { command?: unknown })?.command ?? '')))) say('look', LOOK_NOW)
  return lines
}

const stepHooks = (on: On) => {
  // After each step of a piece of work or a helper: the patterns its calls show, as lines in its next request
  on('classic.PostToolBatch', async ($, e, next) => {
    const r = await next(e)
    const agent = (e as { agent_id?: string }).agent_id
    if (!agent || !dir || isOff) return r
    const now = await $.clock.now()
    const calls = e.tool_calls.map(call => ({ tool: call.tool_name, input: call.tool_input, tookMs: now - (callStarts.get(call.tool_use_id) ?? now) }))
    for (const call of e.tool_calls) callStarts.delete(call.tool_use_id)
    const card = (await read($, todos)).find(one => one.id === agent)
    const again = await rulesAgain($, agent).catch(err => (void log($, `rules not handed again: ${String(err)}`), ''))
    const lines = [...stepLines(agent, calls, !card?.parentId), ...(again ? [again] : [])]
    if (!lines.length) return r
    await log($, `work ${agent} told of its step: ${lines.map(line => line.slice(0, 40)).join(' / ')}`)
    return { ...r, additionalContext: [...(r.additionalContext ?? []), ...lines] }
  })
}

// ---- Helpers run in the background, and their task never waits for them with a command ----

const HELPERS_STARTED = 'Your helpers run in the background: each call came back at once, and each result comes to you as a message when it ends, even after you end your step. Continue now with your own part, and when nothing else is left, end your step: never wait for them with a command.'
// The helpers Claudopus stopped itself, with the task above them
const stoppedByUs = new Set<string>()

// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
const isHelperSpawn = (e: { parentAgentId?: string; workflow?: unknown; resume?: unknown; fork: boolean; isTeammate?: true; background: boolean }) =>
  Boolean(e.parentAgentId) && !flowAgents.has(e.parentAgentId ?? '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir)

// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending
const stopHelpers = async ($: EngineInterface, id: string) => {
  const list = await read($, todos)
  for (const one of underOf(list, id).filter(kid => kid.status === 'working')) {
    stoppedByUs.add(one.id)
    const r = await $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `helper ${one.id} of ${id} not stopped: ${String((r as { deny?: unknown }).deny)}`)
  }
}
