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
// Work whose step ended while all its helpers sit silent: Claudopus checks in after this long, orders it to hand back what it has
// after twice it, and tells the chat it is stuck after three times it, each on time
const HELPER_WAIT_STEP = 12 * 60_000
// A helper's call running this long no longer shows it at work: no command of the engine's runs so long in the foreground
const LIVE_CALL_MOST = 30 * 60_000
// What each agent's last call returned, whole, and when a call last returned something different: a frame count that moves on is
// output that changed, a call that says what the last one said is not
const lastResult = new Map<string, string>()
const changedAt = new Map<string, number>()

// The calls running now, by tool_use_id: whose, what, since when
// Work the mod started again after it had stopped mid-step: once only; stuck again, it is only told to the chat
const restartedOnce = new Set<string>()
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

// When a helper last showed it was at work: it started, ended (with its result), or a call of its returned something different
const helperMovedAt = (one: Todo) => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0, changedAt.get(one.id) ?? 0)
// A helper that sits silent: it is not at work (isBusy), and neither it nor any helper under it has shown it was at work for
// STUCK_AFTER. One rendering in the background, printing a new frame count call after call, or waiting on its own wake_me is at work
const isSilent = (list: Todo[], helper: Todo, at: number) =>
  !isBusy(list, helper, at) && [helper, ...underOf(list, helper.id)].filter(one => one.status === 'working').every(one => at - helperMovedAt(one) >= STUCK_AFTER)
// When a command in the background last printed: as its output last changed, or as it started while it has printed nothing
const printedAt = (one: Todo, b: NonNullable<Todo['bg']>[number]) => {
  const seen = jobLog.get(b.id) ?? one.seenJobs?.[b.id]
  return seen?.wroteAt && !seen.isEmpty ? Math.max(b.at, seen.wroteAt) : b.at
}
// A wake_me still due: Claudopus starts that work again when it comes, or when its look runs out
const isWakeDue = (one: Todo, at: number) => Boolean(one.wakeWhen && at <= one.wakeWhen.until)
// A helper visibly at work now: it, or one under it, is in a call younger than LIVE_CALL_MOST, has a command of its own in the
// background that printed within LIVE_CALL_MOST, or has a wake_me still due. A watch is no work, nor a command silent that long
// (a hung run, a dev server it left: on 17 Nov one counted as work for good, and its task was never told of)
const isBusy = (list: Todo[], helper: Todo, at: number) =>
  [helper, ...underOf(list, helper.id)]
    .filter(one => one.status === 'working')
    .some(one => {
      const call = runningOf(one.id)
      // (a command Claudopus holds for its turn is at work too: its wait is Claudopus's own)
      return Boolean((call && at - call.at < LIVE_CALL_MOST) || one.bg?.some(b => !b.isWatch && at - printedAt(one, b) < LIVE_CALL_MOST) || isWakeDue(one, at) || one.heldCalls?.length)
    })
const runningKids = (list: Todo[], id: string) => list.filter(kid => kid.parentId === id && kid.status === 'working')

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
      // Work that moved again since the chat was told it is stuck is no longer what the chat was told: flagged and told afresh if it is stuck again
      if (one.stuckTold !== undefined && movedAt(list, one) > one.stuckTold) ((isChanged = true), (one = { ...one, stuckTold: undefined, stuckAt: undefined }))
      // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
      const isWaitingOwn = Boolean(one.waitsSince && one.bg?.some(b => !b.isWatch))
      // Nor work that asked Claudopus to start it again: that look has its own end, which starts it (lookWakes)
      const isStuck = one.status === 'working' && !one.wakeWhen && !(one.ask && !one.ask.replied) && !one.admins?.length && ![one, ...underOf(list, one.id)].some(kid => kid.heldCalls?.length) && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined, stuckTold: undefined })
      return one
    })
    return isChanged ? next : list
  })
  // Stuck work the engine no longer runs had stopped mid-step (the app restarted, the Mac slept, its run was cut off): it is
  // started again at once with a message of the mod's own, rather than waiting for the chat or the person to notice
  for (const one of told) {
    const list = await read($, todos)
    const mins = Math.round((now - movedAt(list, one)) / 60_000)
    // Work that waits on its helpers is not told of here: one visibly at work makes its card say it waits on their work, and with all
    // of them silent and its step ended Claudopus follows its schedule (lookHelperWaits)
    const helpers = runningKids(list, one.id)
    const isScheduled = list.find(card => card.id === one.id)?.endedStepAt !== undefined && helpers.every(kid => isSilent(list, kid, now))
    if (helpers.length && (helpers.some(kid => isBusy(list, kid, now)) || isScheduled)) continue
    if (list.find(card => card.id === one.id)?.stuckTold !== undefined) continue
    const engine = await $.agent.list().catch(() => undefined)
    const status = engine?.find(agent => agent.id === one.id)?.status
    // Not work that only waits: on a helper the engine still runs, or on background work it holds
    const under = underOf(list, one.id).map(kid => kid.id)
    const isHelped = Boolean(engine?.some(agent => (agent.parentId === one.id || under.includes(agent.id)) && WORKING.includes(agent.status)))
    const isWaiting = WORKING.includes(String(status)) || isHelped
    // Only work the engine lists as no longer running: work it does not list at all is only flagged. Not work cut off by a
    // restart that the mod brings back itself, nor work just answered on its card, nor work started so once already
    const isStopped =
      Boolean(status) && !isWaiting && !isHeld(one) && !stoppedHere.has(one.id) && !cutPending.has(one.id) && !one.ask?.replied && !restartedOnce.has(one.id)
    if (isStopped) restartedOnce.add(one.id)
    const r = isStopped && !(await isReplaced($)) ? await sendOwn($, { to: { agentId: one.id }, text: named(RESTARTED_WORK) }).catch(err => ({ isDelivered: false as const, reason: String(err) })) : undefined
    if (r?.isDelivered) {
      await log($, `work ${one.id} had stopped mid-step (the engine lists it ${status}): started again`)
      await tellChat($, named(RESTARTED_IN_CHAT(titleOf(one), mins)))
    } else await tellStuck($, one, mins, now)
  }
  // Work flagged stuck that the chat was not told of then (a helper looked at work, or the schedule was to tell it), and that no
  // schedule tells of now, is told of once STUCK_TOLD_BY after it stopped moving, whatever its helpers look like: on 17 Nov a helper's
  // hung command kept its task from ever being told
  for (const one of (await read($, todos)).filter(card => !card.parentId && !card.chat && card.status === 'working' && card.stuckAt !== undefined && card.stuckTold === undefined && now - card.stuckAt >= STUCK_TOLD_BY)) {
    const list = await read($, todos)
    const helpers = runningKids(list, one.id)
    const isScheduled = one.endedStepAt !== undefined && (one.helperWait?.done ?? 0) < 3 && helpers.length > 0 && helpers.every(kid => isSilent(list, kid, now))
    if (isScheduled || isHeld(one) || stoppedHere.has(one.id) || pressed.has(one.id)) continue
    await log($, `work ${one.id} flagged stuck and not yet told of: the chat is told`)
    await tellStuck($, one, Math.round((now - movedAt(list, one)) / 60_000), now)
  }
  await lookHelperWaits($, now)
  await lookOwnWaits($, now)
  // What agents that have ended had seen come back is let go
  const list = await read($, todos)
  for (const agent of seenLines.keys()) if (!list.some(one => one.id === agent && one.status === 'working')) seenLines.delete(agent)
  for (const agent of [...lastResult.keys()]) if (!list.some(one => one.id === agent && one.status === 'working')) (lastResult.delete(agent), changedAt.delete(agent))
}

// Work flagged stuck is told to the chat by this long after it stopped moving, at the latest: when the schedule would have told it
const STUCK_TOLD_BY = 3 * HELPER_WAIT_STEP
// The chat is told work is stuck, and that it may write to it; marked first, so it is told once
const tellStuck = async ($: EngineInterface, one: Todo, mins: number, now: number) => {
  await changeTodos($, all => all.map(card => (card.id === one.id ? { ...card, stuckTold: now } : card)))
  const list = await read($, todos)
  const said = STUCK_IN_CHAT(titleOf(one), mins, runningKids(list, one.id).some(kid => isBusy(list, kid, now)))
  const card = list.find(card => card.id === one.id) ?? one
  await tellChat($, named(`${said} ${isOwnWaiting(list, card, now) ? STUCK_ASK_LOOKS : STUCK_ASK}`))
}

// Work whose step ended while all its helpers sit silent follows a fixed schedule from then: at HELPER_WAIT_STEP it is started again
// to check on them, at twice it to hand back what it has (its report then goes through while they run), at three times it the chat
// is told plainly that it is stuck and may write to it. Each step comes on time whether or not the last reached it; the schedule
// starts over only when a helper hands back a result or prints something different (16 Nov: tasks sat for hours on helpers, the chat
// told only that they might be stuck). Only working cards: one that has finished is left as it is
const lookHelperWaits = async ($: EngineInterface, now: number) => {
  const due: { id: string; step: number; mins: number }[] = []
  await changeTodos($, list => {
    due.length = 0
    let isChanged = false
    const next = list.map(one => {
      if (one.parentId || one.chat || one.status !== 'working' || one.handedBackAt !== undefined) return one
      const helpers = runningKids(list, one.id)
      if (!helpers.length) return one.helperWait ? ((isChanged = true), { ...one, helperWait: undefined }) : one
      // Since when: its step's end, or the latest a helper of its showed it was at work, whichever is later
      const moved = Math.max(0, ...underOf(list, one.id).map(helperMovedAt))
      let wait = one.helperWait
      if (wait && moved > wait.from) wait = undefined
      if (!wait && one.endedStepAt !== undefined) wait = { from: Math.max(one.endedStepAt, moved), done: 0 }
      if (wait !== one.helperWait) ((isChanged = true), (one = { ...one, helperWait: wait }))
      // A step is due once its time has come, its step has ended, every helper sits silent and it waits on no wake_me of its own; and
      // HELPER_WAIT_STEP after the last, so steps a helper at work held back come one by one
      if (wait && wait.done < 3 && now - wait.from >= HELPER_WAIT_STEP * (wait.done + 1) && now - (wait.at ?? 0) >= HELPER_WAIT_STEP && one.endedStepAt !== undefined && !isWakeDue(one, now) && helpers.every(kid => isSilent(list, kid, now)))
        due.push({ id: one.id, step: wait.done + 1, mins: Math.round((now - wait.from) / 60_000) })
      return one
    })
    return isChanged ? next : list
  })
  for (const { id, step, mins } of due) {
    const list = await read($, todos)
    const one = list.find(card => card.id === id)
    if (!one || isHeld(one) || stoppedHere.has(id) || pressed.has(id) || (await isReplaced($))) continue
    // (read right before: work at a step of its own again is not sent one, and the step waits for its step to end)
    if (step < 3 && WORKING.includes(String((await $.agent.list().catch(() => [])).find(agent => agent.id === id)?.status))) continue
    // A helper whose own record shows a call that returned something new since the wait began was at work: the schedule starts over
    // from then, as it does for news Claudopus saw itself
    const from = list.find(card => card.id === id)?.helperWait?.from ?? now
    const { changed, printed } = await helpersRecord($, list, id)
    // One whose record shows a command in the background still going that printed within LIVE_CALL_MOST is at work, as isBusy has
    // it: the step waits
    if (printed && now - printed < LIVE_CALL_MOST) continue
    if (changed > from) {
      await changeTodos($, all => all.map(card => (card.id === id && card.helperWait ? { ...card, helperWait: { from: changed, done: 0 } } : card)))
      await log($, `work ${id} waits on helpers, one of which had a call return something new ${took(now - changed)} ago that Claudopus had not seen: not started again`)
      continue
    }
    await changeTodos($, all => all.map(card => (card.id === id && card.helperWait ? { ...card, helperWait: { ...card.helperWait, done: step, at: now }, ...(step === 2 ? { mayHandBack: card.mayHandBack ?? now } : {}), ...(step === 3 ? { stuckTold: card.stuckTold ?? now } : {}) } : card)))
    if (step === 3) {
      // The chat already told it is stuck is not told again
      if (one.stuckTold !== undefined) continue
      await log($, `work ${id} still stuck ${mins} min on silent helpers after Claudopus asked it to hand back: the chat is told`)
      const fresh = await read($, todos)
      const card = fresh.find(c => c.id === id) ?? one
      await tellChat($, named(`${GAVE_UP_IN_CHAT(titleOf(one), mins)} ${isOwnWaiting(fresh, card, now) ? STUCK_ASK_LOOKS : STUCK_ASK}`))
      continue
    }
    const line = (step === 2 ? HELPERS_STILL_SILENT : HELPERS_SILENT)(mins, silentHelpers(list, id, now))
    const r = await sendOwn($, { to: { agentId: id }, text: line }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    await log($, `work ${id} waits on helpers silent for ${mins} min: ${r.isDelivered ? 'started again' : `not reached (${r.reason})`} to ${step === 2 ? 'hand back what it has' : 'check on them'}`)
    await tellChat($, named(NUDGED_IN_CHAT(titleOf(one), mins, step === 2)))
  }
}

// What the engine's own record of each helper at work under a piece of work shows, for when its calls passed Claudopus by (17 Nov:
// a task was started again three times to check on helpers that were mid-step or following their runs, Claudopus having seen
// nothing of them): when a call last returned something different from the call before it, by the same rule as for the calls
// Claudopus sees (callEnded: its own tools and refused calls bring no news, nor do messages to the helper or notices), and when a
// command it sent to the background that has not ended last printed. 0 for each when nothing can be read
const helpersRecord = async ($: EngineInterface, list: Todo[], id: string) => {
  const { id: session } = await read($, me)
  const seen = { changed: 0, printed: 0 }
  if (!session || !cwd) return seen
  const folder = await agentsFolder($, session)
  for (const kid of underOf(list, id).filter(one => one.status === 'working')) {
    const path = `${folder}/agent-${kid.id}.jsonl`
    // (read only as a step comes due, as a record a helper parked on its run gets nothing new while the run prints)
    const tail = (await $.process.run(['tail', '-c', '400000', path]).catch(() => undefined))?.stdout ?? ''
    const tools = new Map<string, string>()
    const runs = new Map<string, { output: string; at: number }>()
    let before: string | undefined
    for (const row of tail.split('\n')) {
      const o = parsedOr<{ type?: string; timestamp?: string; message?: { content?: unknown } }>(row, {})
      const at = Date.parse(o.timestamp ?? '') || 0
      const content = o.message?.content
      const text = typeof content === 'string' ? content : ''
      // A notice that a command in the background ended: it no longer runs
      for (const ended of text.matchAll(/<task-id>(\w+)<\/task-id>/g)) runs.delete(ended[1] ?? '')
      if (!Array.isArray(content)) continue
      for (const part of content as { type?: string; id?: string; name?: string; tool_use_id?: string; content?: unknown; is_error?: boolean }[]) {
        if (o.type === 'assistant' && part.type === 'tool_use') tools.set(part.id ?? '', part.name ?? '')
        if (o.type !== 'user' || part.type !== 'tool_result') continue
        for (const ended of JSON.stringify(part.content ?? '').matchAll(/<task-id>(\w+)<\/task-id>/g)) runs.delete(ended[1] ?? '')
        const tool = tools.get(part.tool_use_id ?? '') ?? ''
        if (part.is_error || tool.startsWith(TOOLS) || tool.startsWith(OLD_TOOLS)) continue
        const said = resultLines(part.content).join('\n')
        const started = /Command running in background with ID: (\w+)\. Output is being written to: (\S+?\.output)/.exec(JSON.stringify(part.content ?? ''))
        if (started) runs.set(started[1] ?? '', { output: started[2] ?? '', at })
        if (before !== undefined && said !== before && at > seen.changed) seen.changed = at
        before = said
      }
    }
    for (const run of runs.values()) {
      const wrote = (await $.fs.stat(run.output).catch(() => undefined))?.mtimeMs ?? 0
      seen.printed = Math.max(seen.printed, wrote || run.at)
    }
  }
  return seen
}
// Work whose step ended to wait with no helper at work, on a command of its own, a watch, or nothing Claudopus can see, is started
// again to look at what it waits on when nothing started it for this long: the first look no sooner than its newest command's own
// expected time and ten minutes more, then each after twice the last gap, and from four hours on every four hours. It counts afresh
// once a to-do is ticked or a command ends. 18 Nov: three tasks sat four to five hours on cloud jobs that never started, flagged and
// never looked at, until the person asked
const OWN_WAIT_GAPS = [30 * 60_000, 60 * 60_000, 2 * 3_600_000, 4 * 3_600_000]
const ownWaitGap = (done: number) => OWN_WAIT_GAPS[Math.min(done, OWN_WAIT_GAPS.length - 1)]!
// What it has got done, so a wait that moved starts the count over: a to-do ticked, or a command that ended of itself. Not a command
// it stopped or started, as a task that starts its wait afresh at each look would be looked in on every half hour for good
const ownWaitKey = (one: Todo) =>
  `${one.items.filter(item => item.state === 'done').length}:${(one.endedRuns ?? []).filter(run => run.how === 'finished' || run.how === 'failed' || run.how === 'ended').reduce((sum, run) => sum + (run.count ?? 1), 0)}`
// What it waits on, in words for its look-in: its commands, each with how long it has run
const ownWaitWhat = (list: Todo[], one: Todo, at: number) => {
  const helpers = runningKids(list, one.id).length ? `your helpers, which have shown nothing new: ${silentHelpers(list, one.id, at)}` : ''
  const commands = [...(one.bg ?? []).map(b => ({ what: b.what, at: b.at, isWatch: b.isWatch })), ...(one.detached ?? []).filter(d => !d.isLeft).map(d => ({ what: d.what, at: d.at, isWatch: false }))]
  if (!commands.length) return helpers || 'something Claudopus can see nothing of (no command or helper of yours runs)'
  return [helpers, ...commands.map(c => `${c.isWatch ? 'your watch' : 'your command'} "${cut(oneLine(c.what || 'with no description'), 80)}", running ${minutesSaid(Math.round((at - c.at) / 60_000))}`)].filter(Boolean).join('; ')
}
const isOwnWaiting = (list: Todo[], one: Todo, at: number) =>
  !one.parentId && !one.chat && one.status === 'working' && one.endedStepAt !== undefined && one.handedBackAt === undefined && one.answeredAt === undefined && (!runningKids(list, one.id).length || ((one.helperWait?.done ?? 0) >= 3 && runningKids(list, one.id).every(kid => isSilent(list, kid, at)))) && !isWakeDue(one, at) && !(one.ask && !one.ask.replied) && !one.admins?.length && !one.heldCalls?.length && !isHeld(one)
const lookOwnWaits = async ($: EngineInterface, now: number) => {
  const due: { id: string; mins: number; done: number }[] = []
  await changeTodos($, list => {
    due.length = 0
    let isChanged = false
    const next = list.map(one => {
      if (!isOwnWaiting(list, one, now)) return one
      const key = ownWaitKey(one)
      // (after the helpers' schedule ran out, counted from its last step)
      const wait = one.ownWait?.key === key ? one.ownWait : { key, done: 0, at: one.helperWait?.at ?? 0 }
      if (wait !== one.ownWait) ((isChanged = true), (one = { ...one, ownWait: wait }))
      // (the first look waits out the newest command's own expected time)
      const newest = (one.bg ?? []).filter(b => !b.isWatch).at(-1)
      const isPastOwnTime = wait.done > 0 || !newest || now - newest.at >= (describedOf(newest.what).expect ?? 0) + 10 * 60_000
      const gap = ownWaitGap(wait.done)
      if (isPastOwnTime && now - (one.endedStepAt ?? now) >= gap && now - wait.at >= gap) due.push({ id: one.id, mins: Math.round((now - (one.endedStepAt ?? now)) / 60_000), done: wait.done })
      return one
    })
    return isChanged ? next : list
  })
  for (const { id, mins, done } of due) {
    // (not a task cut off as the chat's process ended, which Claudopus brings back itself and tells of the cut; nor one at a step of its own)
    if (cutPending.has(id) || stoppedHere.has(id) || pressed.has(id) || (await isReplaced($))) continue
    const status = String((await $.agent.list().catch(() => [])).find(agent => agent.id === id)?.status)
    if (status === 'running' || status === 'pending') continue
    // Taken once, on the card as it is now: still waiting, and not looked in on meanwhile by a follow that ran beside this one
    let one: Todo | undefined
    await changeTodos($, all => {
      one = all.find(card => card.id === id && card.ownWait?.done === done && isOwnWaiting(all, card, now))
      return one ? all.map(card => (card.id === id && card.ownWait ? { ...card, ownWait: { ...card.ownWait, at: now } } : card)) : all
    })
    if (!one) continue
    const r = await sendOwn($, { to: { agentId: id }, text: named(OWN_WAIT_LOOK(mins, ownWaitWhat(await read($, todos), one, now))) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    await log($, `work ${id} waited ${mins} min with nothing to start it again: ${r.isDelivered ? 'started again' : `not reached (${r.reason}), tried again after the same gap`} to look at what it waits on`)
    if (!r.isDelivered) continue
    await changeTodos($, all => all.map(card => (card.id === id && card.ownWait ? { ...card, ownWait: { ...card.ownWait, done: card.ownWait.done + 1 } } : card)))
    await tellChat($, named(OWN_WAIT_IN_CHAT(titleOf(one), mins)))
  }
}
// What its card says once Claudopus started it to look: while it still waits
const ownWaitLine = (list: Todo[], one: Todo, at: number) =>
  one.ownWait?.done && one.ownWait.at && isOwnWaiting(list, one, at) ? `Claudopus asked Claude to check on what it waits for · ${minutesSaid(Math.round((at - one.ownWait.at) / 60_000))} ago` : ''

// The helpers a piece of work waits on, each by its title and id with what it runs and for how long, for its nudge
const silentHelpers = (list: Todo[], id: string, at: number) =>
  list
    .filter(kid => kid.parentId === id && kid.status === 'working')
    .map(kid => `"${titleOf(kid)}" (${kid.id})${kid.running ? `, ${kid.running.what} for ${took(at - kid.running.at)}` : ''}`)
    .join('; ')

// What a stuck card says above its line: how long nothing new has come back, and whether its helpers, or it, sit in a long call
const stuckLine = (list: Todo[], one: Todo, at: number) => {
  if (!one.stuckAt) return ''
  const mins = Math.max(1, Math.round((at - one.stuckAt) / 60_000))
  // A helper at work (a render in the background, a long call, output that changes) is no sign that nothing moves
  if (runningKids(list, one.id).some(kid => isBusy(list, kid, at))) return "Waiting for its helpers"
  const isLong = (kid: Todo) => Boolean(kid.running && at - kid.running.at >= RUNNING_SHOWN)
  const helpers = underOf(list, one.id).filter(kid => kid.status === 'working')
  const tail = helpers.length
    ? helpers.every(isLong) ? ` ${helpers.length === 1 ? 'Its helper is still' : helpers.length === 2 ? 'Both helpers are still' : `All ${helpers.length} helpers are still`} waiting.` : ''
    : isLong(one) ? ` One action has been running for ${took(at - (one.running?.at ?? at))}.` : ''
  // and what Claudopus did about it
  const done = one.helperWait?.done ?? 0
  const nudge = !done
    ? ''
    : done >= 3
      ? ' Claudopus asked Claude to check on its helpers, then to finish with what it has, and told the chat it may be stuck.'
      : ` Claudopus asked Claude ${done >= 2 ? 'to finish with what it has' : 'to check on its helpers'}.`
  return `Nothing new for ${mins}m.${tail}${nudge}`
}


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
const endedWord = (run: Pick<EndedRun, 'how' | 'code'>) => ({ finished: 'done', failed: 'failed', killed: 'stopped', stopped: 'stopped', 'timed out': 'ran out of time', ended: 'ended' })[run.how] ?? run.how
// The same with how long it ran, as a line of its own: "Done in 1m 05s", "Failed after 2m 05s"
const endedLine = (run: Pick<EndedRun, 'how' | 'code'>, ran: string) =>
  run.how === 'finished' ? `Done in ${ran}` : `${{ failed: 'Failed', killed: 'Stopped', stopped: 'Stopped', 'timed out': 'Ran out of time', ended: 'Ended' }[run.how] ?? 'Ended'} after ${ran}`
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
const endedSummary = (helpers: number, runs: Pick<EndedRun, 'how'>[]) => {
  const n = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
  const head = helpers && runs.length ? `${n(helpers, 'helper')} and ${n(runs.length, 'command')} ended` : helpers ? `${n(helpers, 'helper')} ended` : `${n(runs.length, 'command')} ended`
  const bad = (['failed', 'killed', 'timed out'] as const).flatMap(how => {
    const count = runs.filter(r => r.how === how).length
    return count ? [`${count} ${endedWord({ how })}`] : []
  })
  return bad.length ? `${head} · ${bad.join(', ')}` : head
}
// The runs a card has had end, kept so its summary row and Details can say how each ended. What one command left going and ended
// in one go is one run, with how many programs it was (17 Nov: twelve rows of "Run Google Chrome" for one test's browser)
const keepEnded = (one: Todo, runs: EndedRun[]) => {
  if (!runs.length) return {}
  // (one row however each program ended: the latest end says how the command ended)
  const keyOf = (run: EndedRun) => (leftCommandOf(run.id) ? `${leftCommandOf(run.id)}|${run.what}` : '')
  // (joined with the programs of the same command that ended earlier, in another look, so it stays one row)
  const kept = (one.endedRuns ?? []).filter(r => !runs.some(n => n.id === r.id))
  const joined = runs.reduce<EndedRun[]>((all, run) => {
    const same = keyOf(run) ? all.find(r => keyOf(r) === keyOf(run)) : undefined
    if (!same) return [...all, run]
    return all.map(r => (r === same ? { ...r, at: Math.min(r.at, run.at), endedAt: Math.max(r.endedAt, run.endedAt), how: run.endedAt >= r.endedAt ? run.how : r.how, ...(run.endedAt >= r.endedAt ? (run.code ? { code: run.code } : { code: undefined }) : {}), count: (r.count ?? 1) + (run.count ?? 1) } : r))
  }, kept)
  // (the newest end goes last, as the list is kept in the order runs ended)
  return { endedRuns: [...joined.filter(r => !runs.some(n => keyOf(n) && keyOf(n) === keyOf(r)) && !runs.some(n => n.id === r.id)), ...joined.filter(r => runs.some(n => (keyOf(n) && keyOf(n) === keyOf(r)) || n.id === r.id))].slice(-BG_KEPT) }
}
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
  if (isShort) return `Waiting for a command${more} to finish`
  return `Waiting for a command${more} to finish · ${took(at - first.at)}${first.what ? ` · ${cut(first.what, 90)}` : ''}`
}

// What finished work left running says on its card
const leftLine = (one: Todo, at: number) => (one.leftSince && one.status !== 'working' ? `A command Claude started is still running · ${took(at - one.leftSince)}` : '')


// ---- Work that stops partway: started again until it gives its result or asks the person ----

// A task whose step ends with no result, no question for the person and nothing of its own that starts it again is left stopped
// partway: Claude Code ends it, says to the chat that it "ended without delivering a report", and nothing wakes it (17 Nov: tasks
// sat for half an hour and more until the chat or the person noticed). Claudopus starts it again with a note to carry on, a moment
// after its step ends, for as long as its runs get something done. One that stops so this many times in a row with little done
// between, or this many times in all, is left stopped, and its card says so in one line
const CARRY_TRIES = 3
const CARRY_MOST = 8
// Steps of a run that count as getting something done: the tries count again from one after it
const CARRY_PROGRESS = 5
// How long after its step ends it is started again: the engine closes the run first, and a result or a message that comes for it
// meanwhile starts it by itself
const CARRY_AFTER = 5000
// The card's line that Claudopus started it again shows this long after
const CARRY_SHOWN = 10 * 60_000
// A task whose stop was taken up already, by its id and its step count then: the turn's end, the list's look and the look for work
// that ended unheard may each come to the same stop
const carryTaken = new Set<string>()
// The stops a note was sent for, by the task and when it stopped: one note each, whichever load sends it
const carrySent = new Set<string>()
// A note due that no load sent (the mod reloaded during the wait): sent by the list's look once the wait is well over
const carryDue = async ($: EngineInterface, now: number) => {
  for (const one of (await read($, todos)).filter(card => card.status === 'working' && card.carryOn && !card.carryOn.gaveUp && card.endedStepAt === card.carryOn.at && now - card.carryOn.at >= CARRY_AFTER * 4))
    if (!carrySent.has(`${one.id}:${one.carryOn?.at}`) && !carrying.has(one.id)) await carryNow($, one.id, one.carryOn?.at ?? 0)
}
const carryKey = (one: Todo) => `${one.id}:${one.steps ?? 0}`

// Whether a task whose step just ended was left stopped partway: one of this chat's tasks, whose words are no result, that has not
// handed back or given a result, is not asking the person something or waiting for their Allow, was not stopped or held by them, did
// not end after a safety flag, and was not given up on
const isStoppedShort = (one: Todo | undefined, answer: string) =>
  Boolean(
    one &&
      !one.parentId &&
      !one.chat &&
      !isWordsReport(one, answer) &&
      one.handedBackAt === undefined &&
      !one.answeredAt &&
      !endedByHandback.has(one.id) &&
      !(one.ask && !one.ask.replied) &&
      !one.admins?.length &&
      !isHeld(one) &&
      !stoppedHere.has(one.id) &&
      !pressed.has(one.id) &&
      !one.flagged &&
      !one.carryOn?.gaveUp &&
      // (a command it left detached starts it again as it ends, and Claude Code's press is answered for it with no model; a server
      // never ends, so never starts it again)
      !one.detached?.some(d => !isServerRun(d.cmd, d.what)),
  )
// Whether Claude Code pressed it for its report as its run ended, after its last call: the sign that its words reached no one (the
// chat is told only that it "ended without delivering a report"). A run where the engine asks for no report, as headless ones, ends
// with its words as its result, and is not started again
const isPressedAtEnd = (rows: unknown) => {
  if (!Array.isArray(rows)) return false
  for (const row of [...rows].reverse()) {
    const m = (row && typeof row === 'object' && 'message' in row ? (row as { message?: unknown }).message : row) as { role?: unknown; content?: unknown } | undefined
    const blocks: unknown[] = Array.isArray(m?.content) ? m.content : [m?.content]
    const texts = blocks.map(b => (typeof b === 'string' ? b : b && typeof b === 'object' ? String((b as { text?: unknown }).text ?? '') + (typeof (b as { content?: unknown }).content === 'string' ? String((b as { content?: unknown }).content) : '') : ''))
    if (m?.role === 'assistant' && blocks.some(b => b && typeof b === 'object' && (b as { type?: unknown }).type === 'tool_use')) return false
    if (m?.role === 'user' && texts.some(text => text.includes(HANDBACK_PRESS))) return true
  }
  return false
}
// (or let end past the times Claudopus kept it going: by then Claude Code has used up its own presses, so none follows its words)
const pressedAtEnd = async ($: EngineInterface, id: string) => isLetEnd((await read($, todos)).find(one => one.id === id)) || isPressedAtEnd(await $.session.messages({ as: 'api', agentId: id }).catch(() => []))
// A task Claudopus let end its step past the times it kept it going, with to-dos still to do: a stop with no result, as one pressed is
const isLetEnd = (one: Todo | undefined) => Boolean(one?.keptOn && openItems(one).length && (one.keptOn.tries > KEEP_TRIES || one.keptOn.total > KEEP_MOST))
// The next start's count, or the word that it is given up: a run that got something done since the last start counts from one again
const nextCarry = (one: Todo, now: number): NonNullable<Todo['carryOn']> => {
  const was = one.carryOn
  const tries = was && (one.steps ?? 0) - was.steps < CARRY_PROGRESS ? was.tries + 1 : 1
  const total = (was?.total ?? 0) + 1
  return { tries, total, at: now, steps: one.steps ?? 0, ...(tries > CARRY_TRIES || total > CARRY_MOST ? { gaveUp: now } : {}) }
}
// Its step ended so: its card stays at work, and a moment later Claudopus starts it again, unless something else did first. Given
// up, its card ends stopped with its line, and the chat's model is told
const carrying = new Set<string>()
// `isHeard`: its turn's end was heard, a stop of its own however few steps it took; a stop only the list's looks found is taken up once
const goOn = async ($: EngineInterface, id: string, how: string, isHeard = false) => {
  if (!dir || isOff || carrying.has(id)) return
  carrying.add(id)
  try {
    await goOnNow($, id, how, isHeard)
  } finally {
    carrying.delete(id)
  }
}
const goOnNow = async ($: EngineInterface, id: string, how: string, isHeard: boolean) => {
  const now = await $.clock.now()
  const got: { next?: NonNullable<Todo['carryOn']>; title?: string } = {}
  await changeTodos($, list =>
    list.map(one => {
      if (one.id !== id || (!isHeard && carryTaken.has(carryKey(one)))) return one
      const next = nextCarry(one, now)
      ;(got.next = next), (got.title = titleOf(one))
      return next.gaveUp ? { ...ended(one, 'stopped', now), carryOn: next } : { ...(one.status === 'working' ? one : resumed(one, now)), carryOn: next, endedStepAt: now }
    }),
  )
  const { next, title = '' } = got
  if (!next) return
  carryTaken.add(`${id}:${next.steps}`)
  redraw($)
  if (next.gaveUp) {
    await log($, `work ${id} stopped partway without a result ${next.tries > CARRY_TRIES ? `${next.tries} times in a row` : `${next.total} times`} (${how}): not started again`)
    return void (await tellChat($, named(CARRY_GAVE_UP_IN_CHAT(title, id))))
  }
  await log($, `work ${id} stopped partway without a result (${how}): started again in a moment, ${next.tries} of ${CARRY_TRIES}`)
  $.clock.after(CARRY_AFTER, () => void carryNow($, id, next.at).catch(err => log($, `work ${id} not started again: ${String(err)}`)))
}
const carryNow = async ($: EngineInterface, id: string, at: number) => {
  // (moved on meanwhile: its result, a message, a helper's result or the person's stop came first)
  const stillStopped = async () => {
    const card = (await read($, todos)).find(c => c.id === id)
    return card && card.status === 'working' && card.carryOn?.at === at && isStoppedShort(card, '') && !(await isReplaced($)) ? card : undefined
  }
  const one = await stillStopped()
  if (!one) return
  const status = (await $.agent.list().catch(() => [])).find(agent => agent.id === id)?.status
  if (WORKING.includes(String(status))) return void (await log($, `work ${id} was at work again before Claudopus started it: no note sent`))
  // (one ended from outside Claudopus meanwhile, as the app's own stop, is left as it was ended)
  if (status === 'killed') return void (await log($, `work ${id} was stopped before Claudopus started it: no note sent`))
  if (carrySent.has(`${id}:${at}`)) return
  carrySent.add(`${id}:${at}`)
  // (sent from a hook, where the task it starts keeps the mod's hooks; from this timer it waits for one, and is looked at again as it goes)
  const isStill = async () => Boolean(await stillStopped()) && !WORKING.includes(String((await $.agent.list().catch(() => [])).find(agent => agent.id === id)?.status))
  const r = await sendOwn($, { to: { agentId: id }, text: named(STOPPED_SHORT_GO_ON + (openItems(one).length ? STILL_TO_DO(openItems(one).map(item => item.text)) : '')) }, isStill).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (r.isDelivered) return void (await log($, `work ${id} started again to carry on`))
  // (no longer wanted as it went: it had moved on by itself)
  if (!(await isStill())) return void (await log($, `work ${id} moved on before Claudopus started it: no note sent`))
  const now = await $.clock.now()
  await changeTodos($, list => list.map(card => (card.id === id && card.status === 'working' ? { ...ended(card, 'stopped', now), carryOn: { ...(card.carryOn ?? nextCarry(card, now)), gaveUp: now, isLost: true } } : card)))
  redraw($)
  await log($, `work ${id} could not be started again to carry on: ${r.reason}`)
  await tellChat($, named(CARRY_LOST_IN_CHAT(titleOf(one), id)))
}
// ---- A task goes on until its to-dos are done ----

// A task that ends its step with to-dos still to do and nothing of its own running that starts it again would stop there: Claude
// Code presses it three times for its report, and it hands back what it has or nothing (16-17 Nov: since tasks stopped waiting on
// their helpers with a command, 83% of tasks were pressed, 27% handed back with to-dos not done and 8% ended without a result).
// Claudopus keeps such a step from ending, as Claude Code lets a stop hook do: the task goes on in the same run, told what is still
// to do and that nothing of its own would start it again. Kept this many times in a row with no call between, or this many times
// in all with no to-do ticked between (a task polling something Claudopus does not follow), its step ends, and carrying it on
// (above) is the net
const KEEP_TRIES = 3
const KEEP_MOST = 6
// Why the task ending its step now should go on instead, or '' to let it end: one of this chat's tasks at work, with to-dos still to
// do, that has not handed back, is not stopped partway for a reason of its own (isStoppedShort: a question for the person, their
// Allow, their stop or hold, a safety flag, a detached command), and has nothing of its own that starts it again: no command in the
// background, no helper at work, nothing it asked Claudopus to wake it for, and no command held for its turn
const keepGoingWhy = (list: Todo[], id: string) => {
  const one = list.find(card => card.id === id)
  const open = openItems(one)
  if (!one || isOff || !dir || one.status !== 'working' || !open.length || handedBack.has(id) || one.mayHandBack !== undefined) return ''
  if (!isStoppedShort(one, '') || wakesOf(list, one).isAny) return ''
  return named(KEEP_GOING(open.map(item => item.text)))
}
// Its step's end: kept from ending while it should go on, counting the times in a row with no call of its own between
const keepGoing = async ($: EngineInterface, id: string): Promise<string> => {
  let why = ''
  await changeTodos($, list => {
    why = keepGoingWhy(list, id)
    return list.map(one => {
      if (one.id !== id) return one
      if (!why) return one.keptOn ? { ...one, keptOn: undefined } : one
      const was = one.keptOn
      const done = one.items.filter(item => item.state === 'done').length
      const tries = was && was.steps === (one.steps ?? 0) ? was.tries + 1 : 1
      const total = was && was.done === done ? was.total + 1 : 1
      if (tries > KEEP_TRIES || total > KEEP_MOST) why = ''
      return { ...one, keptOn: { tries, steps: one.steps ?? 0, total, done } }
    })
  })
  if (why) await log($, `work ${id} ended its step with to-dos still to do and nothing of its own running: kept going`)
  return why
}
// Its report handed back with to-dos not done: refused, with what is still to do. Sent again with the same to-dos still to do, it
// goes through once it says what is not done, or at the third try whatever it says (Claude Code presses for a report at the same
// moment Claudopus keeps a task going, so a report sent only because of that press is refused again), and those to-dos show as not
// done on its card and in its result
const NOT_TICKED_MOST = 2
const untickedAtHandback = async ($: EngineInterface, id: string, message: string): Promise<string> => {
  const one = (await read($, todos)).find(card => card.id === id)
  const open = openItems(one).map(item => item.text)
  if (!one || isOff || !dir || one.parentId || one.chat || !open.length || one.flagged) return ''
  const key = open.join('\n')
  const times = one.toldOpen?.key === key ? one.toldOpen.times : 0
  // (one that says what is not done goes through, at once when it names each to-do left)
  const says = /\bnot done\b/i.test(message)
  if (times >= NOT_TICKED_MOST || (says && (times > 0 || open.every(item => message.includes(item))))) return ''
  await changeTodos($, list => list.map(card => (card.id === id ? { ...card, toldOpen: { key, times: times + 1 } } : card)))
  await log($, `work ${id} handed back with ${open.length} to-dos still to do: refused once`)
  return named(NOT_TICKED(open))
}
// What it handed back with still to do, kept once its report went through
const keepNotDone = async ($: EngineInterface, id: string) => {
  const one = (await read($, todos)).find(card => card.id === id)
  if (!one || one.parentId) return
  const open = openItems(one).map(item => item.text)
  await changeTodos($, list => list.map(card => (card.id === id ? { ...card, notDone: open.length ? open : undefined, toldOpen: undefined, keptOn: undefined } : card)))
}
// The card's line for a task that sent its result with to-dos not done, while it is not at work again or waiting on the person
const notDoneLine = (one: Todo) => {
  const left = one.status === 'working' || one.chat || (one.ask && !one.ask.replied) ? [] : (one.notDone ?? [])
  return left.length ? `Not done · ${left.join(' · ')}` : ''
}
// A result's lines for the to-dos its task left not done and still has not done, when it says nothing of what is not done itself
// (named in its own words, a to-do it left is on its card already)
const notDoneLines = (one: Todo, text: string) => {
  const open = new Set(openItems(one).map(item => item.text))
  const left = /\bnot done\b/i.test(text) ? [] : (one.notDone ?? []).filter(item => open.has(item))
  return left.length ? `\n\nNot done:\n${left.map(item => `- ${item}`).join('\n')}` : ''
}
// A task Claudopus stopped starting again stays in its place, its line in sight, as a task cut off that could not be started again does
const isLeftStopped = (one: Todo, at: number) => Boolean(one.carryOn?.gaveUp && one.status !== 'working' && at - one.carryOn.gaveUp < CUT_OLD)
// And so does a task that sent its result with to-dos left, shown stopped (shownAs): never folded away under Finished at once
const isLeftOpen = (one: Todo, at: number) => Boolean(one.leftOpen && !one.chat && at - one.endedAt < CUT_OLD)
// The line on its card: dim while Claudopus has just started it again, amber once it was left stopped
const carryLine = (one: Todo, at: number) => {
  const c = one.carryOn
  if (!c) return ''
  if (c.gaveUp && one.status !== 'working') return c.isLost ? `Stopped partway at ${hhmm(c.gaveUp)} · Claudopus couldn't start it again · send it a message to carry on` : `Stopped partway ${c.tries > CARRY_TRIES ? c.tries : c.total} times without a result · Claudopus stopped starting it again · send it a message to carry on`
  return one.status === 'working' && !c.gaveUp && at - c.at < CARRY_SHOWN ? `Stopped partway at ${hhmm(c.at)} without a result · Claudopus started it again` : ''
}
