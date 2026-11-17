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
  await sayInChat($, named(`${said} ${STUCK_ASK}`), named(said))
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
    await changeTodos($, all => all.map(card => (card.id === id && card.helperWait ? { ...card, helperWait: { ...card.helperWait, done: step, at: now }, ...(step === 2 ? { mayHandBack: card.mayHandBack ?? now } : {}), ...(step === 3 ? { stuckTold: card.stuckTold ?? now } : {}) } : card)))
    if (step === 3) {
      // The chat already told it is stuck is not told again
      if (one.stuckTold !== undefined) continue
      await log($, `work ${id} still stuck ${mins} min on silent helpers after Claudopus asked it to hand back: the chat is told`)
      await sayInChat($, named(`${GAVE_UP_IN_CHAT(titleOf(one), mins)} ${STUCK_ASK}`), named(GAVE_UP_IN_CHAT(titleOf(one), mins)))
      continue
    }
    const line = (step === 2 ? HELPERS_STILL_SILENT : HELPERS_SILENT)(mins, silentHelpers(list, id, now))
    const r = await sendOwn($, { to: { agentId: id }, text: line }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    await log($, `work ${id} waits on helpers silent for ${mins} min: ${r.isDelivered ? 'started again' : `not reached (${r.reason})`} to ${step === 2 ? 'hand back what it has' : 'check on them'}`)
    await tellChat($, named(NUDGED_IN_CHAT(titleOf(one), mins, step === 2)))
  }
}

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
