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
// The wait for helpers, which is no run of its own
const WAIT_RUN = /\/bin\/helpers['"]? /
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
  const kind = one && command && one.tookMs >= LONG_RUN && !isLookup(one.tool, one.input) && !WAIT_RUN.test(command) ? kindOf(command) : ''
  if (kind && seen.lastRun === kind) say('serial', SERIAL_RUNS(kind))
  seen.lastRun = kind || (one ? undefined : seen.lastRun)
  // A commit with no second look started
  if (isTop && seen.checkerAt === undefined && work.some(call => call.tool === 'Bash' && COMMIT.test(String((call.input as { command?: unknown })?.command ?? '')))) say('look', LOOK_NOW)
  return lines
}

// ---- Looking in on running helpers ----

// How often a piece of work with helpers running is looked at, and how long a helper may show nothing new before it is named
const LOOK_IN_EVERY = 60_000
const HELPER_QUIET = 5 * 60_000
// What Claude is told of a helper that has shown nothing new
const QUIET_HELPER = (title: string, id: string, mins: number, running: string) =>
  `Your helper "${title}" (${id}) has shown nothing new for ${mins} minutes${running ? `; ${running}` : ''}. Look at what it is doing now: send it a short question with SendMessage, which it sees after its current step; if it is stuck, tell it the same way to hand back what it has now (Claude Code does not let you stop it yourself) and start a narrower one in its place. If it does one at a time what could be split up, start helpers for the other parts beside it.`
// What it is told of a helper that keeps taking single steps in order
const SERIAL_HELPER = (title: string, id: string, steps: number) =>
  `Your helper "${title}" (${id}) has taken ${steps} steps, nearly all of one call each: it does one at a time what could be split up. If its parts don't depend on each other, start helpers for the rest beside it, or tell it with SendMessage to send its calls together.`
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
      await changeTodos($, all => all.map(one => (one.id === helper.id ? { ...one, quietTold: last } : one)))
    }
    const seen = stepsSeen.get(helper.id)
    if (seen && seen.steps >= SERIAL_STEPS && seen.singles / seen.steps >= SERIAL_SHARE && !helper.serialTold) {
      told.push({ to: parent.id, line: SERIAL_HELPER(titleOf(helper), helper.id, seen.steps) })
      await changeTodos($, all => all.map(one => (one.id === helper.id ? { ...one, serialTold: true } : one)))
    }
  }
  // Each card with helpers running keeps when they were last looked at and how many were quiet; one with none running keeps nothing
  await changeTodos($, all => {
    const changed = all.some(one => (looked.get(one.id)?.quiet ?? -1) !== (one.lookedIn?.quiet ?? -1) || (looked.get(one.id)?.running ?? -1) !== (one.lookedIn?.running ?? -1))
    return changed || looked.size ? all.map(one => ({ ...one, lookedIn: looked.get(one.id) ?? (one.lookedIn && one.status === 'working' ? undefined : one.lookedIn) })) : all
  })
  for (const one of told) {
    // Work that ended its turn to wait for its helpers is woken by the line; work under way reads it at its next step
    const parent = list.find(todo => todo.id === one.to)
    if (parent?.waitsSince) await sendOwn($, { to: { agentId: one.to }, text: one.line }).catch(err => log($, `work ${one.to} not told of its helper: ${String(err)}`))
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

// ---- What a piece of work or a helper waits for that nothing of its own makes: Claudopus looks, and starts it again ----

// How long Claudopus looks for what was asked when no time is given, and at most; and how often it looks
const WAKE_LONGEST = 60
const WAKE_MOST = 360
const WAKE_LOOK = 15_000
let wakesLookedAt = 0
const wakeTries = new Map<string, number>()
// Whether a page answers without an error, following where it sends: looked at side by side, each in at most 5 s
const pageAnswers = async ($: EngineInterface, url: string) =>
  /^2\d\d$/.test(((await $.process.run(['curl', '-s', '-L', '-o', '/dev/null', '-m', '5', '-w', '%{http_code}', url], { timeoutMs: 8000 }).catch(() => undefined))?.stdout ?? '').trim())
const WAKE_FOUND = (what: string) => `From Claudopus: what you asked to be started again for is there: ${what}. Carry on from it.`
const WAKE_TIME = (what: string) => `From Claudopus: the time you asked for has come: ${what}. Carry on.`
const WAKE_MISSED = (what: string, minutes: number) => `From Claudopus: ${what} was still not there after ${minutes} min of looking. Find out why before you look again.`
// Looked at as the list is followed: each file, line or page asked for, at most every WAKE_LOOK; the work is started again (or told,
// while at a step of its own) the moment it is there, when its time comes, or when the longest look has run out
const lookWakes = async ($: EngineInterface) => {
  if (!dir || isOff) return
  const now = await $.clock.now()
  if (now - wakesLookedAt < WAKE_LOOK) return
  wakesLookedAt = now
  // (work the engine lists as ended once its step ends is still due: what it asked for starts it again, unless it gave its report)
  const due = (await read($, todos)).filter(one => one.wakeWhen && (one.status === 'working' || one.status === 'done') && one.handedBackAt === undefined && !endedByHandback.has(one.id) && !isHeld(one))
  // (nothing asked for, nothing drawn: the panel stays still under the pointer)
  if (!due.length) return
  let isChanged = false
  for (const one of due) {
    const w = one.wakeWhen
    if (!w) continue
    const isTimeOnly = !w.file && !w.url
    const path = w.file?.startsWith('~/') ? `${dir.replace(/\/\.claude\/claudopus$/, '')}/${w.file.slice(2)}` : w.file
    const found =
      isTimeOnly
        ? now >= w.until
        : path
          ? w.text
            ? (await $.process.run(['grep', '-qF', '--', w.text, path], { timeoutMs: 5000 }).catch(() => undefined))?.exitCode === 0
            : await $.fs.exists(path).catch(() => false)
          : await pageAnswers($, w.url ?? '')
    const isMissed = !found && now >= w.until
    if (!found && !isMissed) continue
    const text = isMissed ? WAKE_MISSED(w.what, Math.round((w.until - w.at) / 60_000)) : isTimeOnly ? WAKE_TIME(w.what) : WAKE_FOUND(w.what)
    // At a step of its own it reads the line at its next step; with its step ended it is started again by the message
    const isAtStep = (await $.agent.list().catch(() => [])).find(agent => agent.id === one.id)?.status === 'running'
    const r = isAtStep
      ? await tell($, one.id, text).then(() => ({ isDelivered: true as const, reason: '' })).catch(err => ({ isDelivered: false as const, reason: String(err) }))
      : (await isReplaced($))
        ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
        : await sendOwn($, { to: { agentId: one.id }, text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    // Not reached: looked at again at the next look, three times at most, before it is let go
    const tries = (wakeTries.get(one.id) ?? 0) + 1
    if (!r.isDelivered && tries < 3) (wakeTries.set(one.id, tries), await log($, `work ${one.id} not started again for ${w.what}, tried again next look: ${r.reason}`))
    if (!r.isDelivered && tries < 3) continue
    wakeTries.delete(one.id)
    await changeTodos($, list => list.map(card => (card.id === one.id && card.wakeWhen?.at === w.at ? { ...card, wakeWhen: undefined } : card)))
    isChanged = true
    if (r.isDelivered && !isAtStep) await wakeCard($, one.id)
    await log($, `work ${one.id} ${r.isDelivered ? 'started again' : 'not started again'}: ${isMissed ? 'not there' : 'there'}: ${w.what}`)
  }
  if (isChanged) redraw($)
}
// What a card that asked to be started again says under its line, in place of a command that would wait
const wakeLine = (one: Todo) => (one.wakeWhen ? `Claudopus starts Claude again when this is there: ${one.wakeWhen.what}` : '')

// What a card with helpers running says under its line: only how many have gone quiet, as those at work are rows on its tree
const lookedInLine = (one: Todo, at: number) => {
  const l = one.lookedIn
  // Helpers at work are rows on its tree already; only one gone quiet is said, as the work was told of it
  if (!l || one.status !== 'working' || !l.running || !l.quiet) return ''
  return `${l.quiet === 1 ? '1 helper' : `${l.quiet} helpers`} quiet for ${HELPER_QUIET / 60_000}+ min, Claudopus told Claude`
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

// ---- Helpers run in the background, and their work never waits for them ----

// The helpers an agent started that are still at work
const runningHelpers = (list: Todo[], id: string) => list.filter(one => one.parentId === id && one.status === 'working' && !one.answeredAt)
const HELD_AT_END = (n: number) =>
  `You have ${n === 1 ? 'a helper' : `${n} helpers`} still running in the background. Don't hand back your report yet: ${n === 1 ? 'its result' : 'their results'} would reach the chat instead of you. Carry on with what needs nothing from ${n === 1 ? 'it' : 'them'}, or end your step without a report: each result starts you again, and Claudopus tells the chat you wait for ${n === 1 ? 'it' : 'them'}. One you no longer need: tell it with SendMessage to hand back what it has now, as Claude Code does not let you stop it yourself.`
const HELPERS_STARTED = 'Your helpers run in the background: each call came back at once, and each result comes to you as a message when it ends, even after you end your step. Continue now with your own part, and when nothing else is left, end your step: never wait for them with a command.'
// What the work that started a helper is told as Claudopus passes on its result
const HELPER_ENDED = (title: string, how: Todo['status'], report: string) =>
  `From Claudopus: your helper "${title}" ${how === 'failed' ? 'failed' : how === 'stopped' ? 'was stopped' : 'has finished'} while your step had ended, so Claudopus passes its result on to you here (if you already have it, carry on).${report ? ` Its result:\n\n${report}` : ' It gave no result.'}`
// What the chat is told, so a helper's result that reached it, or a notice that the task ended without its report, needs nothing
const HELPER_PASSED = (helper: string, work: string) =>
  `From Claudopus: the result of the helper "${helper}" reached this chat because the task "${work}" had ended its step to let it work. Claudopus has passed it on to that task and started it again: there is nothing for you to do with it, and nothing to tell {name}.`

// What the chat is told of work that ended its step to wait for its helpers, or to be started again: the engine sees neither, so it
// tells the chat that work ended without its report and to ask it for one, which the work cannot give while its helpers run (16 Nov:
// five tasks asked again and again, each refused at its report). Told in the same message as that notice, never on its own: added on
// its own it reached the chat beside the notice, or rode into a later turn after the notice was left out (16 Nov evening: 27 turns).
// Work that waits only on a command it started detached is not: its card ends as the engine ends it, and the command starts it again
const plural = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`)
const WAITS_ON = (work: string, helpers: number, wake: string) =>
  `From Claudopus: the task "${work}" ended its step without its report because it waits ${helpers ? `for ${plural(helpers, 'a helper', 'helpers')} it started` : `to be started again once this is there: ${wake}`}. Claude Code may say it ended without delivering a report, but it is still at work: ${
    helpers ? `${helpers === 1 ? "the helper's result starts" : "each helper's result starts"} it again` : 'Claudopus starts it again then'
  }, and its report comes after that. Do not send it a message asking for its report, which it cannot give while it waits, and do not tell {name} it stopped.`
// The top work at work, its report not given, that waits on what the engine does not count as its own: a helper the engine still
// lists at work, or a wake_me still due. A helper's card left at work after the helper is gone, or a wake long past, is not waiting:
// the engine's word that the work ended then reaches the chat as it is
const waitingNow = async ($: EngineInterface) => {
  const list = await read($, todos)
  const listed = new Map((await $.agent.list().catch(() => [])).map(one => [one.id, one.status] as const))
  const now = await $.clock.now()
  const waiting = new Map<string, { title: string; helpers: number; wake: string }>()
  for (const card of list) {
    if (card.parentId || card.status !== 'working' || card.handedBackAt !== undefined) continue
    const helpers = runningHelpers(list, card.id).filter(one => listed.get(one.id) === 'running' || listed.get(one.id) === 'waiting').length
    const wake = card.wakeWhen && card.wakeWhen.until > now ? card.wakeWhen.what : ''
    if (helpers || wake) waiting.set(card.id, { title: titleOf(card), helpers, wake })
  }
  return waiting
}
const waitsText = (work: { title: string; helpers: number; wake: string }) => named(WAITS_ON(work.title, work.helpers, work.wake))

// A helper that ends while the work that started it has ended its step: the engine hands its result to the chat (seen live on 16
// Nov), so Claudopus passes it on to that work and starts it again with it. The work never holds itself open to wait for helpers
const passOnHelper = async ($: EngineInterface, helperId: string, report: string, how: Todo['status'], isUnheard = false) => {
  if (!dir || isOff) return
  const list = await read($, todos)
  const helper = list.find(one => one.id === helperId)
  const parent = helper?.parentId ? list.find(one => one.id === helper.parentId) : undefined
  // (nor work being stopped: a helper stopped with it says nothing worth starting it again for)
  if (!helper || !parent || isHeld(parent) || pressed.has(parent.id) || stoppedHere.has(parent.id) || parent.status === 'stopped' || parent.status === 'failed' || parent.handedBackAt !== undefined || endedByHandback.has(parent.id)) return
  // A work at a step of its own has the result from the engine itself. One the engine still holds for a command of its own may have
  // it too: it is passed on all the same, as a result lost costs more than one read twice, but the chat had none of it to be told of
  const listed = (await $.agent.list().catch(() => [])).find(one => one.id === parent.id)?.status
  // A helper whose end was never heard (it ended while the mod was out) had its result reach no step of the work's: one now at a
  // step, woken by another such helper's result, reads it at its next step
  if (listed === 'running' && isUnheard) return void (await tell($, parent.id, HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS))))
  if (listed === 'running') return
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await sendOwn($, { to: { agentId: parent.id }, text: HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return void (await log($, `helper ${helperId}'s result not passed on to ${parent.id}: ${r.reason}`))
  await wakeCard($, parent.id)
  await log($, `helper ${helperId}'s result passed on to ${parent.id}, which had ended its step`)
  // Told once the result is on its way, so the chat never lets go of a result that did not arrive
  if (listed !== 'waiting') await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(HELPER_PASSED(titleOf(helper), titleOf(parent))) }] } }).catch(err => log($, `chat not told of a helper's result passed on: ${String(err)}`))
}

// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
const isHelperSpawn = (e: { parentAgentId?: string; workflow?: unknown; resume?: unknown; fork: boolean; isTeammate?: true; background: boolean }) =>
  Boolean(e.parentAgentId) && !flowAgents.has(e.parentAgentId ?? '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir)

// Work that hands back its report while its helpers run is held back, so their results come to it and not to the chat; work that
// only ends its step is let go, as Claudopus passes each result on and starts it again (passOnHelper)
const holdAtHandback = async ($: EngineInterface, agent: string): Promise<string> => {
  if (!dir || isOff || flowAgents.has(agent)) return ''
  const running = runningHelpers(await read($, todos), agent).length
  if (!running) return ''
  await log($, `work ${agent} held at its report: ${running} helpers run`)
  return HELD_AT_END(running)
}

// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending, their
// results reaching the chat
const stopHelpers = async ($: EngineInterface, id: string) => {
  const list = await read($, todos)
  for (const one of underOf(list, id).filter(kid => kid.status === 'working')) {
    const r = await $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `helper ${one.id} of ${id} not stopped: ${String((r as { deny?: unknown }).deny)}`)
  }
}
