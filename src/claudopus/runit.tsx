// ---- A command Claude Code refused a task, run on the person's own press ----
// Claude Code's auto mode refuses some of a background task's commands outright (an unpack of an app, a Claude Code session driven
// for a test, a look at a site's name servers: three on 17 Nov), and the person then pasted the command into their own terminal
// and told the chat. The card that says so shows the command whole, where it runs and for how long at most, and a Run it button:
// the person's press, and only that press, has Claudopus run that very command once, as a command they type would run (bin/run-it),
// and sends the task what it printed. Nothing about the task's own calls changes: the refused call stays refused, no permission or
// setting is touched, and the task is never let run anything itself. (A "Run it once" button that let the refused call through on a
// press was dropped on 17 Nov for exactly that: it moved Claude Code's decision.)
// What may be run is kept in the mod's own state by the hook that saw Claude Code's refusal, never taken from the card: the button
// shows only for that command, on the notice it was put up with, and goes with the press
const RUN_IT = 'Run it'
// A command longer than this is not offered: it could not be read on the card before pressing
const RUN_TEXT_MOST = 4000
// Nor one holding a character that is drawn otherwise than the shell reads it, or not at all: a control character but a line break
// or tab, a direction mark or override, a zero-width one
const RUN_UNSEEN = new RegExp('[\\u0000-\\u0008\\u000B-\\u001F\\u007F-\\u009F\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u2069\\uFEFF]')
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
// The command its card's notice offers, not yet pressed: only the one Claudopus kept as Claude Code refused it, on that same notice
const offeredRun = (one: Todo) => {
  const ask = one.ask
  if (!ask?.refused || one.chat || !ask.copy) return undefined
  return runList.find(run => isSameRun(run, { card: one.id, askAt: ask.at }) && run.command === ask.copy && !run.startedAt)
}
// The runs on a card under way, and those ended whose output waits to start their ended task again
const runningOn = (card: string) => runList.filter(run => run.card === card && run.startedAt && (!run.endedAt || isRunWaking(run)))
// What each running one last printed, and the ones the person stopped, for this load (the stop is also written in its output)
const runLast = new Map<string, string>()
const runStopped = new Set<string>()
const runKey = (run: Pick<PressRun, 'card' | 'askAt'>) => `${run.card}:${run.askAt}`
// The presses this load took, so two at once run it once, and the ask a press cleared that starts its run (answerCleared)
const runPressed = new Set<string>()
const runAsked = new Map<string, PressRun>()
// Ended runs whose output waits, with the task it starts again, for the next hook of this chat (or the person's press of Send it now)
const runWaking = new Map<string, string>()
const isRunWaking = (run: PressRun) => {
  const target = runWaking.get(runKey(run))
  if (target === undefined) return false
  if (wakes.some(w => w.target === target)) return true
  runWaking.delete(runKey(run))
  return false
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
  if (dir) void $.process.run(['find', `${dir}/runs`, '-type', 'f', '-name', '*.log', '-mtime', '+1', '-delete'], { timeoutMs: 15_000 }).catch(() => undefined)
}
// What the card and the chat say of it before the press (where and for how long are said under the command: runWhere)
const runDetails = () =>
  `${RUN_IT}: Claudopus runs exactly the command below, once, as yours, and sends the task what it printed. Nothing else changes: Claude Code still decides each of the task's own calls. ${CARRY_ON}: it doesn't run, and the task goes on without it.`

// The Run it press on the card in this chat's own panel: the one way a run starts. The notice is answered first, as any press
// answers it; only once it has been cleared does the command start (answerCleared calls startRun). A press whose answer could not
// be written leaves the button to be pressed again
const runIt = async ($: EngineInterface, one: Todo) => {
  presses += 1
  const run = offeredRun(one)
  if (!run || runPressed.has(runKey(run))) return
  runPressed.add(runKey(run))
  runAsked.set(one.id, run)
  try {
    await answerAsk($, one, RUN_IT)
  } finally {
    runAsked.delete(one.id)
    if (!runList.find(other => isSameRun(other, run))?.startedAt) runPressed.delete(runKey(run))
  }
}
// Started once its notice is cleared, on that press; whatever goes wrong is said on the card, and the task is told
const startRun = async ($: EngineInterface, one: Todo, run: PressRun) => {
  const at = await $.clock.now()
  const logFile = `${dir}/runs/${slug(one.id) || 'work'}-${at}.log`
  const target = run.from || one.id
  const isLogged = await $.fs.write(logFile, '').then(() => true).catch(() => false)
  const r = isLogged
    ? await $.process.run([`${$.plugin.root}/bin/run-it`, 'start', run.command, logFile, run.cwd], { cwd: run.cwd, timeoutMs: 15_000 }).catch(err => ({ exitCode: 1, stdout: '', stderr: String(err) }))
    : { exitCode: 1, stdout: '', stderr: 'its output file could not be made' }
  const pid = r.exitCode === 0 ? /^(\d+)\s*$/.exec(r.stdout.trim())?.[1] : undefined
  if (!pid) {
    const why = cut(oneLine(r.stderr), 100) || 'no reason given'
    await log($, `run of the refused command for ${one.id} not started: ${why}`)
    await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, endedAt: at, end: 'lost' as const } : other)))
    await stepLine($, one.id, `Your command didn't start: Claudopus could not start it (${why})`)
    await deliverRun($, one.id, target, run, named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, but Claudopus could not start it (${why}), so it did not run. What Claude Code refused stays refused: do not do it yourself. Carry on without it, and say in your report what was left out.`), at)
    return
  }
  await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, log: logFile, pid } : other)))
  await log($, `refused command for ${one.id} run on ${who()}'s press, in ${run.cwd}`)
  const card = (await read($, todos)).find(other => other.id === target)
  const stops = run.limitMs >= RUN_LIMIT_BACKGROUND ? `It is stopped after ${limitText(run.limitMs)} if it is still running then.` : `It is stopped after ${limitText(run.limitMs)} at most.`
  if (card?.status === 'working') await tell($, target, named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus is running it for them now, exactly as shown, in ${run.cwd}. What it prints goes to ${logFile}, which you can read as it runs; when it ends, its last lines come to you as a message. ${stops} Do not run it yourself; carry on with what does not need it, or end your step.`))
  followRun($, { ...run, startedAt: at, log: logFile, pid })
}

// Each run under way is looked at every RUN_LOOK by this load, a reload's own load taking over the ones it finds (followRuns)
const followed = new Set<string>()
const followRuns = async ($: EngineInterface) => {
  runList = await read($, runs)
  for (const run of runList) if (run.startedAt && !run.endedAt && run.log && run.pid) followRun($, run)
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
const lookRun = async ($: EngineInterface, run: PressRun) => {
  const now = runList.find(one => isSameRun(one, run)) ?? run
  if (now.endedAt || !run.log || !run.pid || !run.startedAt) return true
  during('look at a command run on a press')
  const out = runOutputOf(await fileEnd($, run.log, 64_000))
  const last = oneLine(out.lines.filter(line => line.trim()).at(-1) ?? '')
  runLast.set(runKey(run), last)
  // (drawn again at each look, so its running time moves on too)
  redraw($)
  const at = await $.clock.now()
  const stopped = (isStopped: boolean) => (isStopped || runStopped.has(runKey(run)) ? 'stopped' : 'exited')
  if (out.exit !== undefined) return void (await endRun($, run, stopped(out.isStopped), out.exit, out.lines)), true
  if (at - run.startedAt > run.limitMs) {
    await stopProcess($, run)
    return void (await endRun($, run, 'limit', undefined, runOutputOf(await fileEnd($, run.log, 64_000)).lines)), true
  }
  // Gone without writing its end (stopped from outside, or the Mac restarted): said so, with what it printed
  const alive = await $.process.run([`${$.plugin.root}/bin/run-it`, 'alive', run.pid, run.log], { timeoutMs: 10_000 }).catch(() => undefined)
  if (alive && alive.exitCode !== 0) {
    const late = runOutputOf(await fileEnd($, run.log, 64_000))
    return void (await endRun($, run, late.exit !== undefined ? stopped(late.isStopped) : runStopped.has(runKey(run)) ? 'stopped' : 'lost', late.exit, late.lines)), true
  }
  return false
}
const stopProcess = ($: EngineInterface, run: PressRun) =>
  run.pid && run.log ? $.process.run([`${$.plugin.root}/bin/run-it`, 'stop', run.pid, run.log], { timeoutMs: 15_000 }).catch(err => log($, `run of ${run.card} not stopped: ${String(err)}`)) : Promise.resolve()
// The person's Stop on its row
const stopRun = async ($: EngineInterface, run: PressRun) => {
  presses += 1
  if (runStopped.has(runKey(run))) return
  runStopped.add(runKey(run))
  redraw($)
  await stopProcess($, run)
}
// What the task is sent: written in while it runs; else it is started again with it from the next hook of this chat (a prompt, a
// turn's end, a press), never from a timer, where work started again runs with the mod's hooks skipped. Its card shows meanwhile
// that the output waits, with a press that sends it at once. Says whether it was sent now
const deliverRun = async ($: EngineInterface, cardId: string, target: string, run: PressRun, text: string, at: number) => {
  const card = (await read($, todos)).find(one => one.id === cardId)
  if (!card) return false
  const isWorking = (await read($, todos)).find(one => one.id === target)?.status === 'working'
  const told = isWorking ? await tell($, target, text) : undefined
  if (told && !told.deny) return true
  runWaking.set(runKey(run), target)
  await toEnded($, card, target, `${text}\n${RESUMED_BY_ANSWER}`, { text: RUN_IT, ask: `the command Claude Code refused (${cut(run.description || run.command, 60)})`, at, line: lineOf(card), isCard: true, askAt: run.askAt }, true)
  return false
}
// Its end: kept, sent to the task, and said on the card
const endRun = async ($: EngineInterface, run: PressRun, end: NonNullable<PressRun['end']>, exit: number | undefined, lines: string[]) => {
  const at = await $.clock.now()
  let isFirst = false
  await saveRuns($, list => ((isFirst = false), list).map(one => (isSameRun(one, run) && !one.endedAt ? ((isFirst = true), { ...one, endedAt: at, end, ...(exit === undefined ? {} : { exit }) }) : one)))
  if (!isFirst) return
  runLast.delete(runKey(run))
  runStopped.delete(runKey(run))
  const ran = took(at - (run.startedAt ?? at))
  const how = {
    exited: exit === 0 ? `ended well after ${ran}` : `ended with exit ${exit} after ${ran}`,
    limit: `was stopped by Claudopus at its limit of ${limitText(run.limitMs)}`,
    stopped: `was stopped by {name} after ${ran}`,
    lost: `stopped after ${ran} without saying how it ended`,
  }[end]
  const tail = cut(lines.slice(-RUN_TAIL_LINES).join('\n'), RUN_TAIL_CHARS)
  await log($, `refused command for ${run.card} run on ${who()}'s press ${named(how)}`)
  const text = named(
    `{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus ran it for them, exactly as shown, once, in ${run.cwd}:\n${run.command}\nIt ${how}. Its whole output is in ${run.log}; ${tail ? `its last lines:\n${tail}` : 'it printed nothing.'}\nThat ran on {name}'s own press, as theirs: it is no permission. Claude Code still decides each call of yours, so do not run it, or another way to the same end, yourself. Use what it printed; if you need it run again, ask {name} with the command.`,
  )
  const isSent = await deliverRun($, run.card, run.from || run.card, run, text, at)
  await stepLine($, run.card, `The command you ran ${how.replace(/\{name\}/g, 'you')}; ${isSent ? 'Claude was sent what it printed' : "Claude gets what it printed at this chat's next step, or on your press"}`)
}

// On the card, before the press: where it runs and for how long at most, under the command; then the button
const runWhere = (ui: Ui, one: Todo, key: string) => {
  const run = offeredRun(one)
  return run ? <ui.Text key={`${key}-where`} dimColor wrap="wrap">{`Runs in ${shortPath(run.cwd, 60)}, as a command you type would, for at most ${limitText(run.limitMs)}`}</ui.Text> : null
}
const runButton = ($: EngineInterface, ui: Ui, one: Todo, key: string) =>
  offeredRun(one) ? <ui.Button key={`${key}-run-${one.ask?.at ?? 0}-${loadMark}`} label={RUN_IT} onPress={() => void runIt($, one).catch(err => log($, `refused command not run: ${String(err)}`))} /> : null
// While it runs: the command, where, how long it has run of how long at most, what it last printed, and Stop. Once it has ended
// with its output waiting for its ended task: that, and a press that sends it now (its own hook sends what waits: tabs.tsx)
const runBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string, at: number, isWhole = false) => {
  const list = one.chat ? [] : runningOn(one.id)
  if (!list.length) return null
  return (
    <ui.Box key={key} flexDirection="column" gap={1}>
      {list.map(run => {
        const last = runLast.get(runKey(run)) ?? ''
        const isStopping = runStopped.has(runKey(run))
        const isEnded = Boolean(run.endedAt)
        const state = isEnded ? 'ended · its output waits for Claude' : isStopping ? 'stopping' : `running ${took(at - (run.startedAt ?? at))} · at most ${limitText(run.limitMs)}`
        return (
          <ui.Box key={`${key}-${run.askAt}`} flexDirection="column" gap={1} borderStyle="round" borderColor={LIVE} paddingX={1} flexShrink={0}>
            <ui.Text wrap="truncate-end" dimColor>{`Your command · ${state}`}</ui.Text>
            <ui.Box backgroundColor={FILL} paddingLeft={2}>
              <ui.Text mono wrap="wrap">{isWhole ? run.command : cut(run.command, 600)}</ui.Text>
            </ui.Box>
            <ui.Text dimColor wrap="truncate-start">{`in ${shortPath(run.cwd, 60)}`}</ui.Text>
            {isEnded ? (
              <ui.Text wrap="wrap">Claude gets what it printed at this chat's next step, or now on your press.</ui.Text>
            ) : (
              <ui.Text wrap="truncate-end">{last ? `Last printed: ${cut(last, 200)}` : 'Nothing printed yet'}</ui.Text>
            )}
            {isEnded ? (
              <ui.Box flexDirection="row">
                <ui.Button key={`${key}-${run.askAt}-send-${loadMark}`} label="Send it to Claude now" onPress={() => ((presses += 1), redraw($))} />
              </ui.Box>
            ) : isStopping ? null : (
              <ui.Box flexDirection="row">
                <ui.Button key={`${key}-${run.askAt}-stop-${loadMark}`} label="Stop it" onPress={() => void stopRun($, run).catch(err => log($, `run not stopped: ${String(err)}`))} />
              </ui.Box>
            )}
          </ui.Box>
        )
      })}
    </ui.Box>
  )
}
