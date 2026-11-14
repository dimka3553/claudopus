// Steps that could have gone out together: after each step of work, a line in its next request when the step shows a pattern that
// costs time (a helper started alone, a run of single lookups, long runs of one kind one after another, a step of only to-dos, a
// commit with no second look started), and a regular look at the helpers a piece of work has running

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
const CHECKER = /\b(check|review|second look|look for what|verify|audit)/i
// Single lookups in a row before a line says to send them together
const LOOKUPS_IN_A_ROW = 3
// A run this long is a long one; two of one kind in a row, each alone in its step, could have run side by side
const LONG_RUN = 60_000
// The most lines of each kind one agent is told
const LINES_EACH = 2

// What a step sends back, in the words the work reads
const HELPER_ALONE =
  'That step started one helper and nothing else. It runs in the background and its result comes to you when it ends, so carry on now with what needs nothing from it. Next time send with it, in the same step, every call that needs nothing from it: other helpers, your own part, the second look, notes.'
const LOOKUP_RUN = (n: number) =>
  `The last ${n} steps each held one lookup. Send the lookups you already know you need together in one step. Reading or searching across many files that you need only the conclusion of goes to a helper, which keeps your context small; one file you know, you read yourself.`
const SERIAL_RUNS = (what: string) =>
  `Two long runs of one kind (${what}) went one after the other, each alone in its step. When they do not need each other, run them side by side: each in its own throwaway chat, worktree, terminal session or background command, or each as a helper, all started in one step.`
const BOOK_ALONE =
  'That step held only to-do, note or memory calls. They cost a turn of their own: send them in the same step as your next work call.'
const LOOK_NOW =
  'You committed. The second look, the pictures and the docs need nothing more than this: start them now, as helpers in the same step as your next work, not after the rest is done.'

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
const stepLines = (agent: string, calls: { tool: string; input: unknown; tookMs: number }[], wait = '') => {
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
    if (calls.some(one => isTool(one.tool, 'todo') || isTool(one.tool, 'note') || one.tool === 'TodoWrite')) say('book', BOOK_ALONE)
    return lines
  }
  const helpers = work.filter(one => one.tool === 'Agent')
  if (helpers.some(one => CHECKER.test(String((one.input as { description?: unknown })?.description ?? '')))) seen.checkerAt = seen.steps
  if (work.length === 1 && helpers.length === 1) say('alone', HELPER_ALONE)
  if (helpers.length && wait && !seen.told.started) say('started', HELPERS_STARTED(wait))
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
  if (seen.checkerAt === undefined && work.some(call => call.tool === 'Bash' && COMMIT.test(String((call.input as { command?: unknown })?.command ?? '')))) say('look', LOOK_NOW)
  return lines
}

// ---- Looking in on running helpers ----

// How often a piece of work with helpers running is looked at, and how long a helper may show nothing new before it is named
const LOOK_IN_EVERY = 60_000
const HELPER_QUIET = 5 * 60_000
// What the work is told of a helper that has shown nothing new
const QUIET_HELPER = (title: string, id: string, mins: number, running: string) =>
  `Your helper "${title}" (${id}) has shown nothing new for ${mins} minutes${running ? `; ${running}` : ''}. Look at what it is doing now: send it a short question with SendMessage, which it reads at its next step; if it is stuck, stop it with TaskStop and start a narrower one in its place. If it works through in order what could be split, start helpers for the other parts beside it.`
// What it is told of a helper that keeps taking single steps in order
const SERIAL_HELPER = (title: string, id: string, steps: number) =>
  `Your helper "${title}" (${id}) has taken ${steps} steps, nearly all of one call each: it works through in order what could be split. If its parts do not need each other, start helpers for the rest beside it, or tell it with SendMessage to send its calls together.`
// A helper this many steps in, with this share of single-call steps, is working in order
const SERIAL_STEPS = 20
const SERIAL_SHARE = 0.85

// Looked at every LOOK_IN_EVERY while work runs: each running helper that has shown nothing new for HELPER_QUIET, and each that
// works in order, is named to the work that started it, once each stretch, and its card says when it was looked at and what of
const lookInOnHelpers = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const list = await read($, todos)
  const told: { to: string; line: string }[] = []
  const looked = new Map<string, { at: number; running: number; quiet: number }>()
  for (const helper of list) {
    if (!helper.parentId || helper.status !== 'working' || helper.chat) continue
    const parent = list.find(one => one.id === helper.parentId)
    if (!parent || parent.status !== 'working') continue
    const sum = looked.get(parent.id) ?? { at: now, running: 0, quiet: 0 }
    sum.running += 1
    const last = Math.max(helper.startedAt, helper.newAt ?? 0)
    const isQuiet = now - last >= HELPER_QUIET
    if (isQuiet) sum.quiet += 1
    looked.set(parent.id, sum)
    // Once for each quiet stretch: a helper that shows something new and goes quiet again is named again
    if (isQuiet && helper.quietTold !== last) {
      const running = helper.running ? `${helper.running.what} for ${took(now - helper.running.at)}` : ''
      told.push({ to: parent.id, line: QUIET_HELPER(titleOf(helper), helper.id, Math.round((now - last) / 60_000), running) })
      await update($, todos, all => all.map(one => (one.id === helper.id ? { ...one, quietTold: last } : one)))
    }
    const seen = stepsSeen.get(helper.id)
    if (seen && seen.steps >= SERIAL_STEPS && seen.singles / seen.steps >= SERIAL_SHARE && !helper.serialTold) {
      told.push({ to: parent.id, line: SERIAL_HELPER(titleOf(helper), helper.id, seen.steps) })
      await update($, todos, all => all.map(one => (one.id === helper.id ? { ...one, serialTold: true } : one)))
    }
  }
  // Each card with helpers running keeps when they were last looked at and how many were quiet; one with none running keeps nothing
  await update($, todos, all => {
    const changed = all.some(one => (looked.get(one.id)?.quiet ?? -1) !== (one.lookedIn?.quiet ?? -1) || (looked.get(one.id)?.running ?? -1) !== (one.lookedIn?.running ?? -1))
    return changed || looked.size ? all.map(one => ({ ...one, lookedIn: looked.get(one.id) ?? (one.lookedIn && one.status === 'working' ? undefined : one.lookedIn) })) : all
  })
  for (const one of told) {
    // Work that ended its turn to wait for its helpers is woken by the line; work under way reads it at its next step
    const parent = list.find(todo => todo.id === one.to)
    if (parent?.waitsSince) await $.session.send({ to: { agentId: one.to }, text: one.line }).catch(err => log($, `work ${one.to} not told of its helper: ${String(err)}`))
    else await tell($, one.to, one.line)
  }
}

// The list is followed every FOLLOW_EVERY; helpers are looked in on every LOOK_IN_EVERY of it
let lookedInAt = 0
const lookInDue = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - lookedInAt < LOOK_IN_EVERY) return
  lookedInAt = now
  await lookInOnHelpers($)
}

// What a card with helpers running says under its line: how many, when they were looked in on, and how many have gone quiet
const lookedInLine = (one: Todo, at: number) => {
  const l = one.lookedIn
  if (!l || one.status !== 'working' || !l.running) return ''
  const ago = at - l.at < 60_000 ? 'just now' : `${took(at - l.at)} ago`
  return `${l.running === 1 ? '1 helper' : `${l.running} helpers`} running, looked in on ${ago}${l.quiet ? `: ${l.quiet} quiet for ${HELPER_QUIET / 60_000}+ min, the work was told` : ''}`
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
    const lines = stepLines(agent, calls, waitCommand($, agent))
    if (!lines.length) return r
    await log($, `work ${agent} told of its step: ${lines.map(line => line.slice(0, 40)).join(' / ')}`)
    return { ...r, additionalContext: [...(r.additionalContext ?? []), ...lines] }
  })
}

// ---- Helpers run in the background, and their work waits for them only when it has nothing else ----

// How long one wait for helpers lasts before it comes back with how each is doing: the steady look-in
const HELPERS_WAIT = 3 * 60_000
// How many times a piece of work that tries to end while its helpers run is held back in one stretch, before it is let go
const HELD_AT_STOP = 6
const heldAtStop = new Map<string, number>()

// The helpers an agent started that are still at work
const runningHelpers = (list: Todo[], id: string) => list.filter(one => one.parentId === id && one.status === 'working')
// One line per helper, for the work that started it: what, how long, its steps, when it last showed something new, what it runs now
const helperRoll = (list: Todo[], id: string, at: number) =>
  list
    .filter(one => one.parentId === id)
    .filter(one => one.status === 'working' || at - one.endedAt < HELPERS_WAIT * 2)
    .map(one => {
      const last = Math.max(one.startedAt, one.newAt ?? 0)
      const state = one.status === 'working' ? `running ${took(at - one.startedAt)}, ${one.steps ?? 0} steps, last new ${took(at - last)} ago${one.running ? `, now ${one.running.what} for ${took(at - one.running.at)}` : ''}${at - last >= HELPER_QUIET ? ' (quiet: check it, nudge it with SendMessage, or stop it with TaskStop and start a narrower one)' : ''}` : `ended (${one.status})`
      return `- "${titleOf(one)}" (${one.id}): ${state}`
    })
    .join('\n')
// The command the work waits for its helpers with: a Bash call of its own, so no hook waits
const waitCommand = ($: EngineInterface, agent: string) => `"${$.plugin.root}/bin/helpers" "${rollPath(agent)}"`
const WAIT_HOW = (command: string) => `When nothing is left that needs nothing from them, wait for them with this Bash command (timeout 600000): ${command} . It comes back as soon as one ends, or after three minutes with how each is doing.`
const HELD_AT_END = (n: number, command: string) =>
  `You have ${n === 1 ? 'a helper' : `${n} helpers`} still running in the background. Do not finish yet: ${n === 1 ? 'its result' : 'their results'} would reach the chat instead of you. Carry on with what needs nothing from ${n === 1 ? 'it' : 'them'}, or wait with this Bash command (timeout 600000): ${command} ; stop one you no longer need with TaskStop.`
const HELPERS_STARTED = (command: string) => `Your helpers run in the background: each call came back at once and each result comes to you as a message when it ends. Carry on now with your own part. ${WAIT_HOW(command)}`

// The file each piece of work with helpers waits on: its first line the helpers it has running, then how each is doing
const rollPath = (agent: string) => `${dir}/helpers/${agent}.txt`
const rollsWritten = new Map<string, { head: string; at: number }>()
const writeRolls = async ($: EngineInterface, isNow = false) => {
  const list = await read($, todos)
  const now = await $.clock.now()
  const parents = new Set(list.filter(one => one.parentId && (one.status === 'working' || now - one.endedAt < HELPERS_WAIT * 2)).map(one => one.parentId))
  for (const id of parents) {
    const parent = list.find(one => one.id === id)
    if (!parent || parent.status !== 'working') continue
    const head = runningHelpers(list, id).map(one => one.id).join(',')
    const last = rollsWritten.get(id)
    if (!isNow && last && last.head === head && now - last.at < 60_000) continue
    rollsWritten.set(id, { head, at: now })
    await $.fs.write(rollPath(id), `${head}\n${helperRoll(list, id, now)}\n`).catch(err => log($, `helpers of ${id} not written: ${String(err)}`))
  }
}

// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
const isHelperSpawn = (e: { parentAgentId?: string; workflow?: unknown; resume?: unknown; fork: boolean; isTeammate?: true; background: boolean }) =>
  Boolean(e.parentAgentId) && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir)

// Work that ends its turn while its helpers run is held back, so their results come to it and not to the chat
const holdAtStop = async ($: EngineInterface, agent: string): Promise<string> => {
  if (!dir || isOff) return ''
  const running = runningHelpers(await read($, todos), agent).length
  const held = heldAtStop.get(agent) ?? 0
  if (!running || held >= HELD_AT_STOP) return (heldAtStop.delete(agent), '')
  heldAtStop.set(agent, held + 1)
  await log($, `work ${agent} held at its end: ${running} helpers run`)
  await writeRolls($, true)
  return HELD_AT_END(running, waitCommand($, agent))
}
