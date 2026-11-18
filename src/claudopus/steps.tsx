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
  if (isTop && lean.second !== 'asked' && seen.checkerAt === undefined && work.some(call => call.tool === 'Bash' && COMMIT.test(String((call.input as { command?: unknown })?.command ?? '')))) say('look', LOOK_NOW)
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
// works in order, is named to the work that started it, once each stretch (its card says nothing of it)
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
const WAKE_LONGEST = 15
const WAKE_MOST = 60
const WAKE_LOOK = 15_000
let wakesLookedAt = 0
const wakeTries = new Map<string, number>()
// Whether a page answers without an error, following where it sends: looked at side by side, each in at most 5 s
const pageAnswers = async ($: EngineInterface, url: string) =>
  /^2\d\d$/.test(((await $.process.run(['curl', '-s', '-L', '-o', '/dev/null', '-m', '5', '-w', '%{http_code}', url], { timeoutMs: 8000 }).catch(() => undefined))?.stdout ?? '').trim())
const WAKE_FOUND = (what: string) => `From Claudopus: what you asked to be started again for is there: ${what}. Carry on from it.`
const WAKE_TIME = (what: string) => `From Claudopus: the time you asked for has come: ${what}. Carry on.`
const WAKE_MISSED = (what: string, minutes: number) =>
  `From Claudopus: ${what} was still not there after ${minutes} min of looking, and Claudopus will not look for it again. Hand back your report now with what you have, saying what never came and why; it goes through even while helpers run.`
// What was looked for, by its file, line and page: a look that ran out is not taken again for the same
const wakeKey = (w: { file?: string; text?: string; url?: string }) => JSON.stringify([w.file ?? '', w.text ?? '', w.url ?? ''])
// What the chat is told of work Claudopus could not start again for what it waited on, which would otherwise wait for good
const WAKE_LOST_IN_CHAT = (title: string, what: string) => `Claudopus could not start "${title}" again for what it waited on: ${what}.`
const WAKE_LOST_ASK = 'Send it a message to carry on, or to hand back what it has.'
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
    // A run-out counts once the work was told of it: the same is not looked for again, and its report goes through while helpers run
    const isToldMissed = isMissed && r.isDelivered
    await changeTodos($, list =>
      list.map(card =>
        card.id === one.id && card.wakeWhen?.at === w.at ? { ...card, wakeWhen: undefined, ...(isToldMissed ? { wakeMissed: { key: wakeKey(w), what: w.what }, mayHandBack: card.mayHandBack ?? now } : {}) } : card,
      ),
    )
    isChanged = true
    if (r.isDelivered && !isAtStep) await wakeCard($, one.id)
    // Not reached at all, it would wait for good: the chat is told, and may send it a message
    if (!r.isDelivered) await lostToPerson($, one, WAKE_LOST_IN_CHAT(titleOf(one), w.what), WAKE_LOST_ASK)
    await log($, `work ${one.id} ${r.isDelivered ? 'started again' : 'not started again'}: ${isMissed ? 'not there' : 'there'}: ${w.what}`)
  }
  if (isChanged) redraw($)
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

// The helpers an agent started that are still at work. One that ended a step with words as long as a result, held on its own work,
// has not handed back while that work is something that ends and starts it again: a run, what it asked to be woken for, or helpers
// of its own (17 Nov: helpers following their runs on Azure were counted as done, and their task was pressed for its report each
// time it paused). One that gave its result and only left a server or a watch going for the person is done
const runningHelpers = (list: Todo[], id: string) =>
  list.filter(one => {
    if (one.parentId !== id || one.status !== 'working' || one.handedBackAt !== undefined) return false
    if (!one.answeredAt) return true
    const isServer = (cmd: string | undefined, what: string) => SERVER_CMD.test(cmd ?? '') || describedOf(what).kind === 'server'
    return Boolean(one.bg?.some(b => !b.isWatch && !isServer(b.cmd, b.what)) || one.detached?.some(d => !isServer(d.cmd, d.what)) || one.wakeWhen || list.some(kid => kid.parentId === one.id && kid.status === 'working'))
  })
const HELD_AT_END = (n: number) =>
  `You have ${n === 1 ? 'a helper' : `${n} helpers`} still running in the background. Don't hand back your report yet: ${n === 1 ? 'its result' : 'their results'} would reach the chat instead of you. Carry on with what needs nothing from ${n === 1 ? 'it' : 'them'}, or end your step without a report: each result starts you again, and Claudopus tells the chat you wait for ${n === 1 ? 'it' : 'them'}. One you no longer need: tell it with SendMessage to hand back what it has now, as Claude Code does not let you stop it yourself.`
const HELPERS_STARTED = 'Your helpers run in the background: each call came back at once, and each result comes to you as a message when it ends, even after you end your step. Continue now with your own part, and when nothing else is left, end your step: never wait for them with a command.'
// What the work that started a helper is told as Claudopus passes on its result
const HELPER_ENDED = (title: string, how: Todo['status'], report: string) =>
  `From Claudopus: your helper "${title}" ${how === 'failed' ? 'failed' : how === 'stopped' ? 'was stopped' : 'has finished'} while your step had ended, so Claudopus passes its result on to you here (if you already have it, carry on).${report ? ` Its result:\n\n${report}` : ' It gave no result.'}`
// What the chat is told, so a helper's result that reached it, or a notice that the task ended without its report, needs nothing
const HELPER_PASSED = (helper: string, work: string) =>
  `From Claudopus: the result of the helper "${helper}" reached this chat because the task "${work}" had ended its step to let it work. Claudopus passes it on to that task and starts it again: there is nothing for you to do with it, and nothing to tell {name}.`
// What the chat is told when that could not be done: the result is in the chat alone, so the chat sends it on, or tells the person
// what it adds when the person stopped or holds that task, as sending it would start that task again
const HELPER_NOT_PASSED = (helper: string, work: string, id: string, reason: string, isPersons = false) =>
  `From Claudopus: the result of the helper "${helper}" reached this chat, and Claudopus did not pass it on to the task "${work}" (id ${id}): ${cut(oneLine(reason), 120)}. ${
    isPersons ? 'Do not start that task again for it: tell {name} what the result adds.' : `Send the result on to that task yourself: SendMessage to ${id}, with the result as it reached you.`
  }`

// What the chat is told of work that ended its step to wait for its helpers, or to be started again: the engine sees neither, so it
// tells the chat that work ended without its report and to ask it for one, which the work cannot give while its helpers run (16 Nov:
// five tasks asked again and again, each refused at its report). Told in the same message as that notice, never on its own: added on
// its own it reached the chat beside the notice, or rode into a later turn after the notice was left out (16 Nov evening: 27 turns).
// Work that waits only on a command it started detached is told so too: its card stays at work, and the command's end starts it again
const plural = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`)
// Once Claudopus told the chat the task is stuck, the chat may write to it
const WAITS_ON = (work: string, helpers: number, wake: string, stuck?: string) =>
  `From Claudopus: the task "${work}" ended its step without its report because it waits ${helpers ? `for ${plural(helpers, 'a helper', 'helpers')} it started` : `to be started again once this is there: ${wake}`}. Claude Code may say it ended without delivering a report, but it is still at work: ${
    helpers ? `${helpers === 1 ? "the helper's result starts" : "each helper's result starts"} it again` : 'Claudopus starts it again then'
  }, and its report comes after that. ${
    stuck
      ? `Claudopus told you it is stuck, so you may message it (SendMessage to ${stuck}) to ask what it waits on, and to hand back what it has if nothing is coming.`
      : 'It cannot give its report while it waits, so do not message it for one: Claudopus starts it again if that wait runs out or its helpers go quiet, and tells you if it is stuck.'
  } Do not tell {name} it stopped.`
// The top work at work, its report not given, that waits on what the engine does not count as its own: a helper the engine still
// lists at work, or a wake_me still due. A helper's card left at work after the helper is gone, or a wake long past, is not waiting:
// the engine's word that the work ended then reaches the chat as it is
const waitingNow = async ($: EngineInterface) => {
  const list = await read($, todos)
  const listed = new Map((await $.agent.list().catch(() => [])).map(one => [one.id, one.status] as const))
  const now = await $.clock.now()
  const waiting = new Map<string, { title: string; helpers: number; wake: string; stuck?: string; isCarried?: boolean }>()
  for (const card of list) {
    if (card.parentId || card.status !== 'working' || card.handedBackAt !== undefined) continue
    // (one left stopped partway that Claudopus starts again to carry on: Claude Code's word that it ended needs nothing of the chat)
    if (card.carryOn && !card.carryOn.gaveUp && card.endedStepAt === card.carryOn.at && now - card.carryOn.at < CARRY_SHOWN) {
      waiting.set(card.id, { title: titleOf(card), helpers: 0, wake: '', isCarried: true })
      continue
    }
    const helpers = runningHelpers(list, card.id).filter(one => listed.get(one.id) === 'running' || listed.get(one.id) === 'waiting').length
    // (or the end of a command of its own that ends, detached or left going: never a server, which runs until stopped)
    const run = (card.detached ?? []).find(d => !isServerRun(d.cmd, d.what))
    const wake = card.wakeWhen && card.wakeWhen.until > now ? card.wakeWhen.what : run ? `the end of its command "${runWords(run.what, run.cmd)}"` : ''
    if (helpers || wake) waiting.set(card.id, { title: titleOf(card), helpers, wake, ...(card.stuckTold !== undefined ? { stuck: card.id } : {}) })
  }
  return waiting
}
const waitsText = (work: { title: string; helpers: number; wake: string; stuck?: string; isCarried?: boolean }) => named(work.isCarried ? CARRIED_IN_CHAT(work.title) : WAITS_ON(work.title, work.helpers, work.wake, work.stuck))

// A helper that ends while the work that started it has ended its step: the engine hands its result to the chat (seen live on 16
// Nov), so Claudopus passes it on to that work and starts it again with it. The work never holds itself open to wait for helpers
// The work a helper's result is for, when Claudopus passes it on: none for work held by the person, stopped, or that gave its report
// (nor work being stopped: a helper stopped with it says nothing worth starting it again for)
const passedTo = (list: Todo[], helperId: string) => {
  const helper = list.find(one => one.id === helperId)
  const parent = helper?.parentId ? list.find(one => one.id === helper.parentId) : undefined
  if (!helper || !parent || notPassedWhy(parent)) return undefined
  return { helper, parent }
}
// Why a helper's result is not passed on to its work, and whether that was the person's doing; nothing when it is
const notPassedWhy = (parent: Todo): { reason: string; isPersons: boolean } | undefined =>
  isHeld(parent)
    ? { reason: '{name} holds that task', isPersons: true }
    : pressed.has(parent.id) || stoppedHere.has(parent.id) || parent.status === 'stopped'
      ? { reason: 'that task was stopped', isPersons: true }
      : parent.status === 'failed'
        ? { reason: 'that task failed', isPersons: false }
        : parent.handedBackAt !== undefined || endedByHandback.has(parent.id)
          ? { reason: 'that task had handed back its report', isPersons: false }
          : undefined
const toChat = async ($: EngineInterface, text: string) =>
  $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(text) }] } }).catch(err => log($, `chat not told of a helper's result: ${String(err)}`))
// What the chat must act on as a helper's turn ends, after its own turn on that result has ended: sent as the mod's own message,
// which shows in the chat and gives it a turn (written as a row, it sat unread until the person's next message). A row when that fails
const toChatNow = async ($: EngineInterface, text: string) => {
  const r = await $.prompt.submit({ text: named(text) }).then(() => true).catch(err => (void log($, `chat not sent a helper's result: ${String(err)}`), false))
  if (!r) await toChat($, text)
}
// The helpers whose hand-back the chat was told of before it went: the engine hands it to the chat at once, and the chat's turn
// starts with it before the helper's turn ends (16 and 17 Nov: in 61 of 62 hand-backs the chat's request went out before the note
// written as the helper's turn ended, and the chat sent 31 of those results on by hand). So the chat is told as the hand-back is
// given, and its result is passed on to the work as the helper's turn ends
const notedAtHandback = new Set<string>()
// Written once the hand-back went through, before its hook returns: a refused hand-back leaves no note
const noteHandback = async ($: EngineInterface, helperId: string) => {
  if (!dir || isOff) return
  const to = passedTo(await read($, todos), helperId)
  // Nor for work that already handed back what it had while its helpers ran: the result comes late (passOnHelper)
  if (!to || handedBackLetGo.has(to.parent.id) || wokenFor.has(helperId)) return
  // Work at a step of its own, or that the engine holds for a command of its own, is handed the result by the engine itself
  const listed = (await $.agent.list().catch(() => [])).find(one => one.id === to.parent.id)?.status
  if (listed === 'running' || listed === 'waiting') return
  notedAtHandback.add(helperId)
  await toChat($, HELPER_PASSED(titleOf(to.helper), titleOf(to.parent)))
}
// A helper's hand-back the engine gives the chat because the task that started it had ended its step, whose result Claudopus passes
// on to that task (passOnHelper): Claude Code shows it, and the chat need not act on it, so it costs the chat no turn of the model's
// (17 Nov: after a "Report from subagent" box the chat sent the result on a second time and wrote "Nothing needs you here."). Only a
// helper whose hand-back went through here (handingBack), each once; one for work that already handed back what it had, held by the
// person, stopped or failed is the chat's to act on, as before. Claude Code gives a hook no way to keep the box itself from the chat:
// session.receive does not see a message from one of the chat's own agents (seen on 2.1.325), and a prompt dropped is a warning card
const handingBack = new Set<string>()
const HANDBACK_FROM = /^\s*(?:Another Claude session sent a message:\s*)?<agent-message from="([^"]+)">\s*\[Subagent hand-back\]/
const isQuietHandback = async ($: EngineInterface, origin: { kind: string }, text: string) => {
  if (!dir || isOff || origin.kind !== 'peer') return false
  const helperId = HANDBACK_FROM.exec(text)?.[1]
  if (!helperId || !handingBack.has(helperId)) return false
  const to = passedTo(await read($, todos), helperId)
  if (!to || handedBackLetGo.has(to.parent.id)) return false
  // A task the engine lists at work may be given the result by the engine, so Claudopus may not pass it on (passOnHelper): the
  // chat, which has it, is the one to act then, as noteHandback leaves it untold. One Claudopus started for it (wakeForHandback) did
  // not get it, as the chat did: Claudopus passes it on as before, and the chat is told if it cannot
  const isWoken = wokenFor.delete(helperId)
  const isSkipped = handedOnSkipped.delete(helperId)
  const listed = isWoken || isSkipped ? undefined : (await $.agent.list().catch(() => [])).find(one => one.id === to.parent.id)?.status
  if (listed === 'running' || listed === 'waiting') return false
  handingBack.delete(helperId)
  notedAtHandback.add(helperId)
  if (isSkipped) {
    passedOn.delete(helperId)
    await passOnHelper($, helperId, handedBack.get(helperId) ?? '', 'done')
  }
  return true
}
// Claude Code hands a backgrounded helper's report to the chat only when the task that started it is not at a step of its own
// (2.1.325's SubagentHandback: the recipient is the main conversation unless the caller is running), which shows in the chat as a
// "Report from subagent" box no hook can take away (17 Nov: "I want to see only the bits that are needed"). So a task that has ended
// its step is started again first, with a word of what comes, and the engine hands the report to it. Should the chat get it all the
// same (isQuietHandback), Claudopus passes it on as before
const wokenFor = new Set<string>()
// The helpers whose result Claudopus did not pass on at their turn's end, as the engine was to hand it to the task woken for it
const handedOnSkipped = new Set<string>()
const HANDBACK_COMING = (helper: string) => `From Claudopus: your helper "${helper}" is handing you its report now. It comes as a message of its own right after this one: read it there.`
// A hand-back Claude Code refused after its task was started for it: the task is told nothing comes
const handbackRefused = async ($: EngineInterface, helperId: string) => {
  const list = await read($, todos)
  const helper = list.find(one => one.id === helperId)
  const parent = list.find(one => one.id === helper?.parentId)
  if (parent) await sendOwn($, { to: { agentId: parent.id }, text: `From Claudopus: the report of your helper "${titleOf(helper ?? parent)}" did not come after all: Claude Code refused it. Carry on without it; the helper carries on too.` }).catch(() => undefined)
}
const wakeForHandback = async ($: EngineInterface, helperId: string) => {
  if (!dir || isOff) return
  const to = passedTo(await read($, todos), helperId)
  if (!to || handedBackLetGo.has(to.parent.id)) return
  const listed = (await $.agent.list().catch(() => [])).find(one => one.id === to.parent.id)?.status
  if (listed === 'running' || listed === 'waiting') return
  if (await isReplaced($)) return
  const r = await sendOwn($, { to: { agentId: to.parent.id }, text: HANDBACK_COMING(titleOf(to.helper)) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return void (await log($, `task ${to.parent.id} not started for the hand-back of ${helperId}: ${r.reason}`))
  wokenFor.add(helperId)
  await wakeCard($, to.parent.id)
  await log($, `task ${to.parent.id} started so its helper ${helperId}'s hand-back goes to it, not to the chat`)
}
// The result each helper's end was last passed on with: its turn's end, the look shortly after it and the look for work that ended
// unheard may each come to the same end, and it is passed on once. A helper started again ends again with a result of its own
// By the helper and its report alone: the same report ended again as failed or stopped is not passed on twice; a step of the helper's
// clears it (work.tsx)
const passedOn = new Map<string, string>()
const passOnHelper = async ($: EngineInterface, helperId: string, report: string, how: Todo['status'], isUnheard = false) => {
  if (!dir || isOff) return
  const key = report.trim().slice(0, ANSWER_CHARS)
  if (passedOn.get(helperId) === key) return
  passedOn.set(helperId, key)
  // Handed by the engine to the task woken for it: nothing to pass on, unless it reaches the chat after all (isQuietHandback)
  if (wokenFor.delete(helperId)) return void (handedOnSkipped.add(helperId), await log($, `helper ${helperId}'s result went to its task, started for it`))
  const isNoted = notedAtHandback.delete(helperId)
  // A result that comes after the work handed back what it had, as it was told to, reaches the chat: it is told what it is, and
  // when it was told already that the result is passed on, that it was not. None for a helper Claudopus stopped, nor one with no result
  const all = await read($, todos)
  const late = all.find(one => one.id === all.find(kid => kid.id === helperId)?.parentId)
  if (late && handedBackLetGo.has(late.id)) {
    if (how === 'stopped' || stoppedByUs.has(helperId) || !key) return void (await log($, `helper ${helperId} of ${late.id} ended after its work handed back, with nothing to tell`))
    return void (await toChatNow($, HELPER_LATE(titleOf(all.find(one => one.id === helperId) ?? late), titleOf(late), isNoted)))
  }
  // The chat was told it is passed on: when it is not, the chat is told so, so the result is never left unsent
  const notPassed = async (helper: Todo | undefined, parent: Todo, reason: string, isPersons = false) => {
    await log($, `helper ${helperId}'s result not passed on to ${parent.id}: ${reason}`)
    await toChatNow($, HELPER_NOT_PASSED(titleOf(helper ?? parent), titleOf(parent), parent.id, reason, isPersons))
  }
  const to = passedTo(all, helperId)
  if (!to) {
    const helper = all.find(one => one.id === helperId)
    const parent = all.find(one => one.id === helper?.parentId)
    const why = parent ? notPassedWhy(parent) : undefined
    if (isNoted && parent) await notPassed(helper, parent, why?.reason ?? 'that task is gone', why?.isPersons)
    return
  }
  const { helper, parent } = to
  // A work at a step of its own has the result from the engine itself. One the engine still holds for a command of its own may have
  // it too: it is passed on all the same, as a result lost costs more than one read twice, but the chat had none of it to be told of
  const listed = (await $.agent.list().catch(() => [])).find(one => one.id === parent.id)?.status
  // A helper whose end was never heard (it ended while the mod was out) had its result reach no step of the work's, nor did one the
  // engine handed the chat because the work had ended its step as it handed back: one now at a step, woken by something else since,
  // reads it at its next step
  if (listed === 'running' && (isUnheard || isNoted)) {
    const told = await tell($, parent.id, HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)))
    if ((!told || told.deny) && isNoted) await notPassed(helper, parent, told?.deny ?? 'it could not be written to')
    return
  }
  if (listed === 'running') return
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await sendOwn($, { to: { agentId: parent.id }, text: HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  // Not passed on, the result is in the chat alone: the chat is told to send it on, so nothing is lost unsaid
  if (!r.isDelivered) {
    if (listed !== 'waiting' || isNoted) await notPassed(helper, parent, r.reason)
    else await log($, `helper ${helperId}'s result not passed on to ${parent.id}: ${r.reason}`)
    return
  }
  await wakeCard($, parent.id)
  await log($, `helper ${helperId}'s result passed on to ${parent.id}, which had ended its step`)
  // Told once the result is on its way, so the chat never lets go of a result that did not arrive; told already as it was handed back
  if (listed !== 'waiting' && !isNoted) await toChat($, HELPER_PASSED(titleOf(helper), titleOf(parent)))
}

// Work that handed back what it had while helpers ran, as Claudopus let it: a result one of them gives later reaches the chat, which
// is told what it is (HELPER_LATE). Until the work takes a step again
const handedBackLetGo = new Set<string>()

// What the chat is told of a helper's result that came after its task handed back what it had; `isPassedSaid` when it was told
// already, as the helper handed back, that the result is passed on to that task
const HELPER_LATE = (helper: string, work: string, isPassedSaid = false) =>
  isPassedSaid
    ? `From Claudopus, in place of its word that it passes on the result of the helper "${helper}": the task "${work}" had already handed back what it had, so Claudopus did not pass it on, and the result stays in this chat. Pass on to {name} what it adds to that task's report.`
    : `From Claudopus: the result of the helper "${helper}" came after the task "${work}" handed back what it had, so it reached this chat. Pass on to {name} what it adds to that task's report.`
// The helpers Claudopus stopped itself: their end tells the chat nothing
const stoppedByUs = new Set<string>()

// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
const isHelperSpawn = (e: { parentAgentId?: string; workflow?: unknown; resume?: unknown; fork: boolean; isTeammate?: true; background: boolean }) =>
  Boolean(e.parentAgentId) && !flowAgents.has(e.parentAgentId ?? '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir)

// Work that hands back its report while its helpers run is held back, so their results come to it and not to the chat; work that
// only ends its step is let go, as Claudopus passes each result on and starts it again (passOnHelper)
const holdAtHandback = async ($: EngineInterface, agent: string): Promise<string> => {
  if (!dir || isOff || flowAgents.has(agent)) return ''
  const list = await read($, todos)
  const running = runningHelpers(list, agent).length
  if (!running) return ''
  // Work Claudopus told to hand back what it has (its helpers sat silent, or its wait ran out) may:
  // helpers that sit silent are stopped as it does, and a result that comes later from one at work reaches the chat (passOnHelper)
  if (isLetGo(list, agent)) return (await log($, `work ${agent} hands back while ${running} helpers run, as it was told to`), '')
  await log($, `work ${agent} held at its report: ${running} helpers run`)
  return HELD_AT_END(running)
}

// Work Claudopus told to hand back what it has: its report goes through while its helpers run
const isLetGo = (list: Todo[], id: string) => list.find(one => one.id === id)?.mayHandBack !== undefined

// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending, their
// results reaching the chat
// (`isSilentOnly`: only those that sit silent, at work on nothing; see isSilent)
const stopHelpers = async ($: EngineInterface, id: string, isSilentOnly = false) => {
  const list = await read($, todos)
  const now = await $.clock.now()
  for (const one of underOf(list, id).filter(kid => kid.status === 'working' && (!isSilentOnly || isSilent(list, kid, now)))) {
    stoppedByUs.add(one.id)
    const r = await $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `helper ${one.id} of ${id} not stopped: ${String((r as { deny?: unknown }).deny)}`)
  }
}
