// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, the
// card of work under which nothing new has come back for STUCK_AFTER, and finished work that something it started still holds

// Nothing new for this long anywhere under a piece of work, while it works, and its card says so and the chat is told once. Above
// the longest one command can run (ten minutes) with a step either side of it, so a single long build or wait is not flagged
const STUCK_AFTER = 12 * 60_000
// One call running this long shows on its row, with its time
const RUNNING_SHOWN = 2 * 60_000
// Lines each agent has seen come back, so a wait that returns what it returned before is no news; kept to this many each
const SEEN_KEPT = 5000
// Only this many lines of one result are looked at
const LINES_READ = 2000

// The calls running now, by tool_use_id: whose, what, since when
// Work the mod started again after it had stopped mid-step: once only; stuck again, it is only told to the chat
const restartedOnce = new Set<string>()
const inFlight = new Map<string, { agent: string; what: string; at: number; cmd?: string; label?: string }>()
const seenLines = new Map<string, Set<string>>()

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
  inFlight.set(id, { agent, what: runningWhat(tool), at: await $.clock.now(), ...(cmd ? { cmd, label } : {}) })
  await changeTodos($, list => withRunning(list, agent))
}

// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
const callEnded = async ($: EngineInterface, id: string, agent: string, tool: string, r: { result?: unknown; deny?: unknown } | undefined) => {
  inFlight.delete(id)
  const now = await $.clock.now()
  let isNew = false
  if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
    const seen = seenLines.get(agent) ?? new Set<string>()
    for (const line of resultLines(r.result)) if (!seen.has(line)) ((isNew = true), seen.add(line))
    if (seen.size > SEEN_KEPT) seenLines.set(agent, new Set([...seen].slice(-SEEN_KEPT / 2)))
    else seenLines.set(agent, seen)
  }
  await changeTodos($, list => withRunning(list, agent, isNew ? now : undefined))
}

// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
const movedAt = (list: Todo[], top: Todo) => Math.max(...[top, ...underOf(list, top.id)].map(one => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0)))

// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work waiting on the person is not flagged: asking them something, or stopped
// on the app's own prompt to allow a call; nor work that gave its report and is only held by what it left running
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
      // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
      const isWaitingOwn = Boolean(one.waitsSince && one.bg?.some(b => !b.isWatch))
      const isStuck = one.status === 'working' && !(one.ask && !one.ask.replied) && !one.admins?.length && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined })
      return one
    })
    return isChanged ? next : list
  })
  // Stuck work the engine no longer runs had stopped mid-step (the app restarted, the Mac slept, its run was cut off): it is
  // started again at once with a message of the mod's own, rather than waiting for the chat or the person to notice
  const engine = told.length ? await $.agent.list().catch(() => undefined) : undefined
  for (const one of told) {
    const mins = Math.round((now - movedAt(await read($, todos), one)) / 60_000)
    const status = engine?.find(agent => agent.id === one.id)?.status
    // Not work that only waits: on a helper the engine still runs, or on background work it holds
    const helpers = underOf(await read($, todos), one.id).map(kid => kid.id)
    const isWaiting =
      WORKING.includes(String(status)) || Boolean(engine?.some(agent => (agent.parentId === one.id || helpers.includes(agent.id)) && WORKING.includes(agent.status)))
    // Only work the engine lists as no longer running: work it does not list at all is only flagged. Not work cut off by a
    // restart that the mod brings back itself, nor work just answered on its card, nor work started so once already
    const isStopped =
      Boolean(status) && !isWaiting && !isHeld(one) && !stoppedHere.has(one.id) && !cutPending.has(one.id) && !one.ask?.replied && !restartedOnce.has(one.id)
    if (isStopped) restartedOnce.add(one.id)
    const r = isStopped && !(await isReplaced($)) ? await sendOwn($, { to: { agentId: one.id }, text: named(RESTARTED_WORK) }).catch(err => ({ isDelivered: false as const, reason: String(err) })) : undefined
    if (r?.isDelivered) {
      await log($, `work ${one.id} had stopped mid-step (the engine lists it ${status}): started again`)
      await sayInChat($, named(RESTARTED_IN_CHAT(titleOf(one), mins)))
    } else await sayInChat($, named(STUCK_IN_CHAT(titleOf(one), mins)))
  }
  // What agents that have ended had seen come back is let go
  const list = await read($, todos)
  for (const agent of seenLines.keys()) if (!list.some(one => one.id === agent && one.status === 'working')) seenLines.delete(agent)
}

// What a stuck card says above its line: how long nothing new has come back, and whether its helpers, or it, sit in a long call
const stuckLine = (list: Todo[], one: Todo, at: number) => {
  if (!one.stuckAt) return ''
  const mins = Math.max(1, Math.round((at - one.stuckAt) / 60_000))
  const isLong = (kid: Todo) => Boolean(kid.running && at - kid.running.at >= RUNNING_SHOWN)
  const helpers = underOf(list, one.id).filter(kid => kid.status === 'working')
  const tail = helpers.length
    ? helpers.every(isLong) ? ` ${helpers.length === 1 ? 'Its helper is still' : helpers.length === 2 ? 'Both helpers are still' : `All ${helpers.length} helpers are still`} waiting.` : ''
    : isLong(one) ? ` One step has been running for ${took(at - (one.running?.at ?? at))}.` : ''
  return `No progress for ${mins} min.${tail}`
}

// A row's running call, with its time, once it has run RUNNING_SHOWN
const runningLine = (one: Todo, at: number) => (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? `${one.running.what} · ${took(at - one.running.at)}` : '')

// ---- What work started in the background itself, which wakes it as it ends ----

const BG_KEPT = 20
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response wakes nothing and is not kept
const keepBackground = async ($: EngineInterface, agent: string, call: { tool: string; description?: unknown; command?: unknown; task_id?: unknown; shell_id?: unknown; timeout_ms?: unknown; persistent?: unknown }, result: unknown) => {
  if (call.tool === 'TaskStop' || call.tool === 'KillShell') return dropBackground($, [String(call.task_id ?? call.shell_id ?? '')], 'stopped')
  const r = (result && typeof result === 'object' ? result : {}) as { backgroundTaskId?: unknown; taskId?: unknown; backgroundEndsWithFinalResponse?: unknown }
  // A command the engine ends with the work's final response wakes nothing and is not kept (the engine does not always say that
  // one it keeps wakes its owner, so its silence is no sign)
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
    list.map(one => (one.id === agent ? { ...one, bg: [...(one.bg ?? []).filter(b => b.id !== id), { id, what, at: now, ...(cmd ? { cmd } : {}), ...(call.tool === 'Monitor' ? { isWatch: true } : {}), ...(limit ? { expiresAt: now + limit } : {}) }].slice(-BG_KEPT) } : one)),
  )
}
// The longest the engine lets a watch run before it ends it
const WATCH_MOST = 30 * 60_000
type EndedRun = NonNullable<Todo['endedRuns']>[number]
// How a run ended, said plainly: on its card's summary and in Details
const endedWord = (run: Pick<EndedRun, 'how' | 'code'>) => (run.how === 'failed' ? `failed${run.code ? ` (exit code ${run.code})` : ''}` : run.how === 'stopped' ? 'stopped' : run.how)
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
const endedSummary = (helpers: number, runs: Pick<EndedRun, 'how'>[]) => {
  const n = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
  const head = helpers && runs.length ? `${n(helpers, 'helper')} and ${n(runs.length, 'command')} ended` : helpers ? `${n(helpers, 'helper')} ended` : `${n(runs.length, 'command')} ended`
  const bad = (['failed', 'killed', 'timed out'] as const).flatMap(how => {
    const count = runs.filter(r => r.how === how).length
    return count ? [`${count} ${how}`] : []
  })
  return bad.length ? `${head} · ${bad.join(', ')}` : head
}
// The runs a card has had end, kept so its summary row and Details can say how each ended
const keepEnded = (one: Todo, runs: EndedRun[]) => (runs.length ? { endedRuns: [...(one.endedRuns ?? []).filter(r => !runs.some(n => n.id === r.id)), ...runs].slice(-BG_KEPT) } : {})
// Background work that has ended or was stopped leaves every card that kept it at once, and is kept as ended with how it ended
// (by its id, or one word for them all), so the card's summary counts it
type EndAs = EndedRun['how'] | { how: EndedRun['how']; code?: string; at?: number }
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
        return { id: b.id, what: b.what, at: b.at, endedAt, how, ...(end.code ? { code: end.code } : {}) } as EndedRun
      })
      return { ...one, bg: bg?.length ? bg : undefined, waitsSince: bg?.some(b => !b.isWatch) ? one.waitsSince : undefined, ...keepEnded(one, runs) }
    })
  })
}

// What work still at work says on its card while it waits for a command of its own: which, and how long it has run; only that it
// waits when the command has its own row on the card's tree
const waitLine = (one: Todo, at: number, isShort = false) => {
  const commands = (one.bg ?? []).filter(b => !b.isWatch)
  // The newest command it started, the one it is most likely on now
  const first = commands.at(-1)
  if (one.status !== 'working' || !one.waitsSince || one.answeredAt || !first) return ''
  const more = commands.length > 1 ? ` and ${commands.length - 1} more` : ''
  if (isShort) return `Still working: Claude is waiting for a background command${more} to finish`
  return `Still working: Claude is waiting for a background command${more} to finish, running ${took(at - first.at)}${first.what ? `: ${cut(first.what, 90)}` : ''}`
}

// What finished work left running says on its card
const leftLine = (one: Todo, at: number) => (one.leftSince && one.status !== 'working' ? `Claude left something running in the background, ${took(at - one.leftSince)}` : '')
