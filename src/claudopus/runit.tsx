// ---- A command Claude Code blocked a task from running, run on the person's own Allow ----
// Claude Code's auto mode refuses some of a background task's commands outright (an unpack of an app, a Claude Code session driven
// for a test, a look at a site's name servers: three on 17 Nov), and the person then pasted the command into their own terminal
// and told the chat. Its card asks as any permission does (needs.tsx): "Claude Code blocked this command. Run it anyway?", the
// command whole, Allow and Don't allow. Allow, and only that press, has Claudopus run that very command once, as a command the
// person types would run (bin/run-it), and the task gets what it printed. Nothing about the task's own calls changes: the refused
// call stays refused, no permission or setting is touched, and the task is never let run anything itself.
// What may be run is kept in the mod's own state by the hook that saw Claude Code's refusal, never taken from the card: Allow
// runs only that command, on the question it was put up with, and goes with the press
// A command longer than this is not offered: it could not be read on the card before pressing
const RUN_TEXT_MOST = 4000
// Nor one holding a character that is drawn otherwise than the shell reads it, or not at all: a control character but a line break
// or tab, a direction mark or override, a zero-width or invisible one, a tag character
const RUN_UNSEEN = new RegExp('[\\u0000-\\u0008\\u000B-\\u001F\\u007F-\\u009F\\u00AD\\u034F\\u115F\\u1160\\u180E\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u206F\\u2800\\u3164\\uFEFF\\uFFA0\\uFFF9-\\uFFFB\\u{1D173}-\\u{1D17A}\\u{E0000}-\\u{E007F}]', 'u')
// The longest a command runs once pressed: one Claude would have held open, at most its own timeout or ten minutes; one it would
// have sent to the background, an hour. Then Claudopus stops it, and the task gets what it printed by then
const RUN_LIMIT = 10 * 60_000
const RUN_LIMIT_BACKGROUND = 60 * 60_000
// How often a running one is looked at, and how much of its output the task is sent in the message (the whole is in its file)
const RUN_LOOK = 5_000
const RUN_TAIL_LINES = 30
const RUN_TAIL_CHARS = 4000
// Offers never pressed, ended runs, and their output files are let go after a day; a run under way is always kept
const RUN_KEPT = 24 * 60 * 60_000
const RUNS_KEPT = 40
const RUN_END = /claudopus-exit (\d+)( stopped)?\s*$/

// Every offer and run, kept across reloads in the mod's state; drawn from `runList`, its copy as last written or read
const runs = atom({ plugin: 'claudopus', key: 'runs' } as const, [], { shape: 'runs-1' })
let runList: PressRun[] = []
const saveRuns = async ($: EngineInterface, fn: (list: PressRun[]) => PressRun[]) => {
  const now = await $.clock.now()
  runList = await update($, runs, list => {
    const next = fn(list)
    const live = (one: PressRun) => Boolean(one.startedAt && !one.endedAt)
    const kept = next.filter(one => !live(one) && now - (one.endedAt ?? one.startedAt ?? one.askAt) < RUN_KEPT).slice(-RUNS_KEPT)
    return next.filter(one => live(one) || kept.includes(one))
  })
  redraw($)
  return runList
}
const isSameRun = (one: PressRun, other: Pick<PressRun, 'card' | 'askAt'>) => one.card === other.card && one.askAt === other.askAt
// What another copy kept, read from the mod's state as Allow is pressed: the copy that saw Claude Code refuse a command may not be
// the one that draws its card, so Allow is on every such card (needs.tsx) and looks up its command only as it is pressed. On 27 Nov a
// card came up 16 s after an update, saved by the copy the update replaced, and the new copy, which had not read the runs yet, drew
// it with Don't allow alone. Only what this copy lacks is taken: a read may come back older than this copy's own last write
const readRuns = async ($: EngineInterface) => {
  const kept = await read($, runs)
  const missing = kept.filter(one => !runList.some(other => isSameRun(other, one)))
  if (missing.length) runList = [...runList, ...missing]
  return runList
}
// The command its card's notice offers, not yet pressed: only the one Claudopus kept as Claude Code refused it, on that same notice
const offeredRun = (one: Todo) => {
  const ask = one.ask
  if (!ask?.refused || one.chat || !ask.copy) return undefined
  return runList.find(run => isSameRun(run, { card: one.id, askAt: ask.at }) && run.command === ask.copy && !run.startedAt)
}
// The runs on a card under way, and those ended whose output is kept for their task's next step
const runningOn = (card: string) => runList.filter(run => run.card === card && run.startedAt && (!run.endedAt || Boolean(run.waiting)))
// Whether a task or helper waits on a command the person allowed: it runs, or it ended and what it printed is on its way to it. Its
// card stays at work meanwhile, however long its own step has been over: it is not over, and it has not failed (25 Nov: the release
// a task asked for, refused by Claude Code, allowed by Dima and running, while its card said "Failed · Ended without its result")
const holdsCard = (id: string) => runList.some(run => (run.card === id || run.from === id) && run.startedAt && (!run.endedAt || Boolean(run.waiting && !run.waiting.isLost)))
// How long a run's end stays one grey line where it ran, unless its task writes a line of its own first: after that its end is
// the ended row under the card and in Details
const RUN_END_SHOWN = 60_000
// The runs said on a card: those running or kept, and one that ended just now
const runsShownOn = (one: Todo, at: number) => [...runningOn(one.id), ...runList.filter(run => run.card === one.id && run.startedAt && run.endedAt && !run.waiting && at - run.endedAt < RUN_END_SHOWN && (ownNote(one)?.at ?? 0) <= run.endedAt)]
// How a run the person allowed ended, in the card's own words: its grey line for a while, never the task's line (19 Nov)
const endedSaid = (run: PressRun, what = 'your command') => {
  const ran = took((run.endedAt ?? 0) - (run.startedAt ?? run.endedAt ?? 0))
  const What = what.charAt(0).toUpperCase() + what.slice(1)
  if (!run.log) return `${What} didn't start`
  return { exited: run.exit === 0 ? `${What} ended after ${ran}` : `${What} failed after ${ran}`, limit: `${What} was stopped at its limit of ${limitText(run.limitMs)}`, stopped: `You stopped ${what} after ${ran}`, lost: `${What} stopped after ${ran}` }[run.end ?? 'lost']
}
// An allowed run that ended is a row of the card's ended commands, as one of the task's own is: its words, how it ended, its log
const keepRunEnded = async ($: EngineInterface, run: PressRun, why?: string) => {
  const kept = runList.find(one => isSameRun(one, run)) ?? run
  if (!kept.endedAt) return
  const how = ({ exited: kept.exit === 0 ? 'finished' : 'failed', limit: 'timed out', stopped: 'stopped', lost: why ? 'failed' : 'ended' } as const)[kept.end ?? 'lost']
  const ended: EndedRun = { id: `press-${kept.askAt}`, what: kept.description || 'Your command', at: kept.startedAt ?? kept.endedAt, endedAt: kept.endedAt, how, cmd: kept.command, ...(kept.exit !== undefined && kept.exit !== 0 ? { code: String(kept.exit) } : {}), ...(why ? { why } : {}), ...(kept.log ? { file: kept.log } : {}) }
  await changeTodos($, list => list.map(card => (card.id === kept.card ? { ...card, ...keepEnded(card, [ended]) } : card)))
  redraw($)
}
// The ones the person stopped, for this load (the stop is also written in its output)
const runStopped = new Set<string>()
const runKey = (run: Pick<PressRun, 'card' | 'askAt'>) => `${run.card}:${run.askAt}`
// The presses this load took, so two at once run it once, and the ask a press cleared that starts its run (answerCleared)
const runPressed = new Set<string>()
const runAsked = new Map<string, PressRun>()
// What an ended run printed, kept for a task that was not at a step when it ended: it is told as its next step begins (replyRead,
// from that step's own hook), and its card says so meanwhile in one grey line. Nothing starts the task for it
const runsAtStep = async ($: EngineInterface, agent: string) => {
  const due = runList.filter(run => run.waiting?.target === agent && !runSending.has(runKey(run)))
  for (const run of due) {
    const told = await tell($, agent, run.waiting?.text ?? '').catch(() => undefined)
    if (!told || told.deny) continue
    await saveRuns($, list => list.map(one => (isSameRun(one, run) ? { ...one, waiting: undefined } : one)))
  }
}
const limitText = (ms: number) => (ms >= 60 * 60_000 ? `${Math.round(ms / 3_600_000)} hour${ms >= 2 * 3_600_000 ? 's' : ''}` : `${Math.max(1, Math.round(ms / 60_000))} min`)

// What a refused call may be offered as: a command of the Bash tool, short enough to read and drawn as it runs, with the folder it
// runs in (the chat's, where a task's commands start) and its limit
const runnableOf = (tool: string, call: Record<string, unknown>) => {
  const command = typeof call.command === 'string' ? call.command.trim() : ''
  if (tool !== 'Bash' || !command || command.length > RUN_TEXT_MOST || RUN_UNSEEN.test(command)) return undefined
  const asked = typeof call.timeout === 'number' && call.timeout > 0 ? Math.min(call.timeout, RUN_LIMIT) : RUN_LIMIT
  const limitMs = call.run_in_background === true ? RUN_LIMIT_BACKGROUND : asked
  return { command, cwd: cwd || dir.replace(/\/\.claude\/claudopus$/, ''), limitMs, description: typeof call.description === 'string' ? oneLine(call.description) : '' }
}
// Kept as its notice goes up on the card, by the hook that saw Claude Code refuse it; output files over a day old go meanwhile
const offerRun = async ($: EngineInterface, card: string, from: string, askAt: number, runnable: NonNullable<ReturnType<typeof runnableOf>>) => {
  await saveRuns($, list => [...list.filter(one => !isSameRun(one, { card, askAt })), { card, from, askAt, ...runnable }])
  if (dir) void runOn($, ['find', `${dir}/runs`, '-type', 'f', '-name', '*.log', '-mtime', '+1', '-delete'], { timeoutMs: 15_000 }).catch(() => undefined)
}
// What the card and the chat say of it before the press (where and for how long are said under the command: runWhere)
const runDetails = (run: { cwd: string; limitMs: number }, reason = '') => `Runs once in ${shortPath(run.cwd, 60)}, for at most ${limitText(run.limitMs)}${reason ? ` · blocked as “${reason}”` : ''}.`

// Allow on the card in this chat's own panel: the one way a run starts. The question is answered first, as any press answers
// it; only once it has been cleared does the command start (answerCleared calls startRun). A press whose answer could not be
// written leaves the block to be pressed again. One whose command Claudopus no longer keeps (let go after a day) runs nothing:
// the task is told to try the command again, which puts up a card of its own (RUN_GONE)
const runIt = async ($: EngineInterface, one: Todo) => {
  presses += 1
  await readRuns($).catch(err => log($, `runs not read for a press: ${String(err)}`))
  const run = offeredRun(one)
  if (!run) return void (await answerAsk($, one, ALLOW))
  if (runPressed.has(runKey(run))) return
  runPressed.add(runKey(run))
  runAsked.set(one.id, run)
  try {
    await answerAsk($, one, ALLOW)
  } finally {
    runAsked.delete(one.id)
    if (!runList.find(other => isSameRun(other, run))?.startedAt) runPressed.delete(runKey(run))
  }
}
// Started once its question is cleared, on that press; whatever goes wrong is said on the card. Answers what the task is told
const startRun = async ($: EngineInterface, one: Todo, run: PressRun): Promise<string> => {
  const at = await $.clock.now()
  const logFile = `${dir}/runs/${slug(one.id) || 'work'}-${at}.log`
  const isLogged = await $.fs.write(logFile, '').then(() => true).catch(() => false)
  const r = isLogged
    ? await runOn($, [`${pluginRoot($)}/bin/run-it`, 'start', run.command, logFile, run.cwd], { cwd: run.cwd, timeoutMs: 15_000 }).catch(err => ({ exitCode: 1, stdout: '', stderr: String(err) }))
    : { exitCode: 1, stdout: '', stderr: 'its output file could not be made' }
  const pid = r.exitCode === 0 ? /^(\d+)\s*$/.exec(r.stdout.trim())?.[1] : undefined
  if (!pid) {
    const why = cut(oneLine(r.stderr), 100) || 'no reason given'
    await log($, `run of the refused command for ${one.id} not started: ${why}`)
    await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, endedAt: at, end: 'lost' as const } : other)))
    await keepRunEnded($, run, why)
    return named(`{Name} pressed "${ALLOW}" on your card for the command Claude Code refused, but it could not be started (${why}), so it did not run. What Claude Code refused stays refused: do not do it yourself. Carry on without it, and say in your report what was left out.`)
  }
  await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, log: logFile, pid } : other)))
  await log($, `refused command for ${one.id} run on ${who()}'s press, in ${run.cwd}`)
  const stops = run.limitMs >= RUN_LIMIT_BACKGROUND ? `It is stopped after ${limitText(run.limitMs)} if it is still running then.` : `It is stopped after ${limitText(run.limitMs)} at most.`
  followRun($, { ...run, startedAt: at, log: logFile, pid })
  return named(`{Name} pressed "${ALLOW}" on your card for the command Claude Code refused, and it is running for them now, exactly as shown, as their own, in ${run.cwd}. What it prints goes to ${logFile}, which you can read as it runs; when it ends, its last lines come to you as a message: at your next step, or, once you have ended your step, as a message that starts you again. ${stops} Do not run it yourself; carry on with what does not need it, or end your step.`)
}

// Each run under way is looked at every RUN_LOOK by this load, a reload's own load taking over the ones it finds (followRuns)
const followed = new Set<string>()
const followRuns = async ($: EngineInterface) => {
  runList = await read($, runs)
  for (const run of runList) if (run.startedAt && !run.endedAt && run.log && run.pid) followRun($, run)
  // (and one whose end a reload kept from its task, which ended its step: it goes to it now)
  for (const run of runList) if (run.endedAt && run.waiting && !run.waiting.isLost && !runWaking.has(runKey(run))) void wakeForRun($, run, run.waiting.target)
}
const followRun = ($: EngineInterface, run: PressRun) => {
  const key = runKey(run)
  if (followed.has(key)) return
  followed.add(key)
  let isLooking = false
  const timer = everyLoad($, RUN_LOOK, () => {
    if (isLooking) return
    isLooking = true
    void lookRun($, run)
      .then(isEnded => isEnded && (timer.cancel(), followed.delete(key)))
      .catch(err => log($, `run of ${run.card} not followed: ${String(err)}`))
      .finally(() => (isLooking = false))
  })
}
// Its output's end: what it printed, and how it ended once it has (stopped, when the stop wrote so)
const runOutputOf = (text: string) => {
  const end = RUN_END.exec(text)
  const lines = text.replace(RUN_END, '').replace(/\s+$/, '').split('\n')
  return { exit: end ? Number(end[1]) : undefined, isStopped: Boolean(end?.[2]), lines }
}
// Each run's output as last looked at (its size and time), and when it was last asked whether it still runs: an output that has
// not moved is not read again, and a run is asked for every RUN_ALIVE, as only one gone without a word is found that way
const RUN_ALIVE = 15_000
const runLooked = new Map<string, { sign: string; aliveAt: number }>()
const lookRun = async ($: EngineInterface, run: PressRun) => {
  const now = runList.find(one => isSameRun(one, run)) ?? run
  const key = runKey(run)
  if (now.endedAt || !run.log || !run.pid || !run.startedAt) return runLooked.delete(key), true
  during('look at a command run on a press')
  const stat = await $.fs.stat(run.log).catch(() => undefined)
  const sign = stat?.mtimeMs ? `${stat.size}:${stat.mtimeMs}` : ''
  const was = runLooked.get(key)
  const isMoved = !sign || sign !== was?.sign
  const out = isMoved ? runOutputOf(await fileEnd($, run.log, 64_000)) : { exit: undefined, isStopped: false, lines: [] }
  // Nothing is drawn again for a look: the card shows only that it runs, and its time moves with the panel's calm drawings (calmLook).
  // A drawing at each look, every 5 s and through the person's use of the panel, rebuilt the whole panel in the app, which flashed
  // (17 Nov, Dima's screenshot); its end is drawn at once (saveRuns)
  const at = await $.clock.now()
  const stopped = (isStopped: boolean) => (isStopped || runStopped.has(runKey(run)) ? 'stopped' : 'exited')
  const ended = () => (runLooked.delete(key), true)
  if (out.exit !== undefined) return void (await endRun($, run, stopped(out.isStopped), out.exit, out.lines)), ended()
  if (at - run.startedAt > run.limitMs) {
    await stopProcess($, run)
    return void (await endRun($, run, 'limit', undefined, runOutputOf(await fileEnd($, run.log, 64_000)).lines)), ended()
  }
  const isAliveDue = !was || at < was.aliveAt || at - was.aliveAt >= RUN_ALIVE - RUN_LOOK / 2
  runLooked.set(key, { sign, aliveAt: isAliveDue ? at : was.aliveAt })
  if (!isAliveDue) return false
  // Gone without writing its end (stopped from outside, or the Mac restarted): said so, with what it printed
  const alive = await runOn($, [`${pluginRoot($)}/bin/run-it`, 'alive', run.pid, run.log], { timeoutMs: 10_000 }).catch(() => undefined)
  if (alive && alive.exitCode !== 0) {
    const late = runOutputOf(await fileEnd($, run.log, 64_000))
    return void (await endRun($, run, late.exit !== undefined ? stopped(late.isStopped) : runStopped.has(runKey(run)) ? 'stopped' : 'lost', late.exit, late.lines)), ended()
  }
  return false
}
const stopProcess = ($: EngineInterface, run: PressRun) =>
  run.pid && run.log ? runOn($, [`${pluginRoot($)}/bin/run-it`, 'stop', run.pid, run.log], { timeoutMs: 15_000 }).catch(err => log($, `run of ${run.card} not stopped: ${String(err)}`)) : Promise.resolve()
// The person's Stop on its row
const stopRun = async ($: EngineInterface, run: PressRun) => {
  presses += 1
  if (runStopped.has(runKey(run))) return
  runStopped.add(runKey(run))
  redraw($)
  await stopProcess($, run)
}
// What the task is sent of a run's end: written in while the task is at a step; else kept with the run, and sent to a task still
// at work that ended its step as a message that starts it again, from the next hook of the mod's (sendOwn), never from the timer
// that saw the end. Whatever step of its own comes first reads it instead (runsAtStep). Says whether it was sent, is kept, or is not
// sent (a task the person stopped)
const deliverRun = async ($: EngineInterface, cardId: string, target: string, run: PressRun, text: string) => {
  const card = (await read($, todos)).find(one => one.id === cardId)
  if (!card) return 'held'
  const isWorking = (await read($, todos)).find(one => one.id === target)?.status === 'working'
  const told = isWorking ? await tell($, target, text) : undefined
  if (told && !told.deny) return 'sent'
  // A task the person stopped gets nothing more: what it printed stays in its file
  if (isHeld(card)) return 'held'
  await saveRuns($, list => list.map(one => (isSameRun(one, run) ? { ...one, waiting: { target, text } } : one)))
  // (one that ended otherwise, as with its result handed in, is started by nothing: it reads it if it works again)
  if (isWorking) void wakeForRun($, run, target)
  return 'waits'
}
// What a task that ended its step is told with the end of the command it waited on, so it carries on and hands in its result
const RUN_RESUMED = 'You had ended your step while it ran: this message starts you again. Carry on from where you were with what it printed, then end with your report as before.'
// The runs whose end is on its way to their task, so one end is sent once, and those whose message is going out now, which the
// step it starts does not read a second time (marked in memory: the drawing it goes from may write nothing)
const runWaking = new Set<string>()
const runSending = new Set<string>()
const wakeForRun = async ($: EngineInterface, run: PressRun, target: string) => {
  const key = runKey(run)
  if (runWaking.has(key)) return
  runWaking.add(key)
  try {
    const kept = () => runList.find(one => isSameRun(one, run))
    const text = kept()?.waiting?.text
    if (!text) return
    // Still wanted as it goes: not yet read at a step of the task's own, and the task still at work
    const isStill = async () => {
      const one = kept()
      if (!one?.waiting || one.waiting.target !== target || (await read($, todos)).find(card => card.id === target)?.status !== 'working') return false
      runSending.add(key)
      return true
    }
    const r = await sendOwn($, { to: { agentId: target }, text: `${text}\n${RUN_RESUMED}` }, isStill).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    if (r.isDelivered) {
      await saveRuns($, list => list.map(one => (isSameRun(one, run) ? { ...one, waiting: undefined } : one)))
      runSending.delete(key)
      await wakeCard($, target)
      return void (await log($, `${target} started again with the end of the command run on ${who()}'s press`))
    }
    // Not sent: kept for a step of its own, and its card no longer held up by it, so it ends as it would
    runSending.delete(key)
    await saveRuns($, list => list.map(one => (isSameRun(one, run) && one.waiting ? { ...one, waiting: { ...one.waiting, isLost: true } } : one)))
    await log($, `${target} not started again with the end of the command run on ${who()}'s press: ${(r as { reason?: string }).reason ?? 'not sent'}`)
  } finally {
    runWaking.delete(key)
  }
}
// Its end: kept, sent to the task, and said on the card
const endRun = async ($: EngineInterface, run: PressRun, end: NonNullable<PressRun['end']>, exit: number | undefined, lines: string[]) => {
  const at = await $.clock.now()
  let isFirst = false
  const last = oneLine(lines.filter(line => line.trim()).at(-1) ?? '').slice(0, 300)
  await saveRuns($, list => ((isFirst = false), list).map(one => (isSameRun(one, run) && !one.endedAt ? ((isFirst = true), { ...one, endedAt: at, end, ...(exit === undefined ? {} : { exit }), ...(last ? { last } : {}) }) : one)))
  if (!isFirst) return
  runStopped.delete(runKey(run))
  const ran = took(at - (run.startedAt ?? at))
  const how = {
    exited: exit === 0 ? `ended well after ${ran}` : `ended with exit ${exit} after ${ran}`,
    limit: `was stopped at its limit of ${limitText(run.limitMs)}`,
    stopped: `was stopped by {name} after ${ran}`,
    lost: `stopped after ${ran} without saying how it ended`,
  }[end]
  const tail = cut(lines.slice(-RUN_TAIL_LINES).join('\n'), RUN_TAIL_CHARS)
  await log($, `refused command for ${run.card} run on ${who()}'s press ${named(how)}`)
  const text = named(
    `{Name} pressed "${ALLOW}" on your card for the command Claude Code refused, and it ran for them, exactly as shown, once, as their own, in ${run.cwd}:\n${run.command}\nIt ${how}. Its whole output is in ${run.log}; ${tail ? `its last lines:\n${tail}` : 'it printed nothing.'}\nThat ran on {name}'s own press, as theirs: it is no permission. Claude Code still decides each call of yours, so do not run it, or another way to the same end, yourself. Use what it printed; if you need it run again, ask {name} with the command.`,
  )
  await deliverRun($, run.card, run.from || run.card, run, text)
  // Said to the person where commands are: a row of the card's ended ones, with its log, and a grey line for a while where it ran
  // (runBlock), never on the line that says what the task does now (19 Nov). An output kept for the task's next step is said by
  // the card's grey line for it
  await keepRunEnded($, run)
}

// A task tried again after a passing network error, until the try goes (retryLater): its card says so in one grey line
const isRetrying = (one: Todo) => !one.chat && one.status === 'working' && one.retry?.at !== undefined
// While it runs: one quiet line, how long it has run, and Stop; the command itself is not shown again, the person saw it before
// pressing (17 Nov). Once it has ended with its task not at a step: one grey line that its output is kept for the task's next step
const runBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string, at: number) => {
  const list = one.chat ? [] : runsShownOn(one, at)
  // (and, while a passing network error is tried again, one grey line that says so: retryLater)
  const retry = isRetrying(one) ? one.retry : undefined
  if (!list.length && !retry) return null
  return (
    <ui.Box key={key} flexDirection="column">
      {retry ? (
        <ui.Box key={`${key}-retry`} height={1} overflow="hidden">
          <ui.Text dimColor wrap="truncate-end">{`Network error · trying again · ${retry.tries.length} of ${RETRY_MOST} tries`}</ui.Text>
        </ui.Box>
      ) : null}
      {list.map(run => {
        const isStopping = runStopped.has(runKey(run))
        const isEnded = Boolean(run.endedAt)
        const what = list.length > 1 && run.description ? `“${cut(run.description, 60)}”` : 'your command'
        const said = isEnded && !run.waiting ? endedSaid(run, what) : isEnded ? (what === 'your command' ? "Your command's output is kept for the task's next step" : `${what} · its output is kept for the task's next step`) : isStopping ? `Stopping ${what}` : `Running ${what}`
        return (
          <ui.Box key={`${key}-${run.askAt}`} flexDirection="row" gap={1} height={1} overflow="hidden">
            <ui.Box flexDirection="row" flexShrink={1} minWidth={0} height={1} overflow="hidden">
              <ui.Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                <ui.Text dimColor wrap="truncate-end">{said}</ui.Text>
              </ui.Box>
              {isEnded || isStopping ? null : (
                <ui.Box flexShrink={0}>
                  <ui.Text dimColor>{` · ${took(at - (run.startedAt ?? at))}`}</ui.Text>
                </ui.Box>
              )}
            </ui.Box>
            {isEnded || isStopping ? null : (
              <ui.Box flexShrink={0}>
                <ui.Button key={`${key}-${run.askAt}-stop-${loadMark}`} label="Stop" plain dimColor hover={{ scope: `${key}-${run.askAt}-stop`, underline: true }} onPress={() => void stopRun($, run).catch(err => log($, `run not stopped: ${String(err)}`))} />
              </ui.Box>
            )}
          </ui.Box>
        )
      })}
    </ui.Box>
  )
}
