// ---- A command Claude Code refused a task, run on the person's own press ----
// Claude Code's auto mode refuses some of a background task's commands outright (an unpack of an app, a Claude Code session driven
// for a test, a look at a site's name servers: three on 17 Nov), and the person then pasted the command into their own terminal
// and told the chat. The card that says so shows the command whole, where it runs and for how long at most, and a Run it button:
// the person's press, and only that press, has Claudopus run that very command once, as a command they type would run, and sends
// the task what it printed, starting it again if it had ended. Nothing about the task's own calls changes: the refused call stays
// refused, no permission or setting is touched, and the task is never let run anything itself. (A "Run it once" button that let the
// refused call through on a press was dropped on 17 Nov for exactly that: it moved Claude Code's decision.)
// What may be run is kept in the mod's own state by the hook that saw Claude Code's refusal, never taken from the card: the button
// shows only for that command, on the notice it was put up with, and goes with the press
const RUN_IT = 'Run it'
// A command longer than this is not offered: it could not be read on the card before pressing
const RUN_TEXT_MOST = 4000
// The longest a command runs once pressed: one Claude would have held open, at most its own timeout or ten minutes; one it would
// have sent to the background, an hour. Then Claudopus stops it, and the task gets what it printed by then
const RUN_LIMIT = 10 * 60_000
const RUN_LIMIT_BACKGROUND = 60 * 60_000
// How often a running one is looked at, and how much of its output the task is sent in the message (the whole is in its file)
const RUN_LOOK = 5_000
const RUN_TAIL_LINES = 30
const RUN_TAIL_CHARS = 4000
// Offers never pressed, and ended runs, are let go after a day
const RUN_KEPT = 24 * 60 * 60_000
// The shell that runs it, started detached in a process group of its own so it outlives the call that starts it and can be stopped
// whole: in the folder the task's commands start in, with stdin closed, through the person's own login shell (their PATH and start
// files, as a command typed in their terminal has), and with Claude Code's own marks taken out of its environment, so a Claude Code
// it starts runs as one the person starts. Its exit is written as its output's last line
const RUN_SCRIPT = [
  '# claudopus run-it',
  'set -m',
  '(',
  '  trap "" HUP',
  '  unset CLAUDECODE CLAUDE_CODE_ENTRYPOINT CLAUDE_CODE_SSE_PORT',
  '  S="${SHELL:-/bin/sh}"; [ -x "$S" ] || S=/bin/sh',
  '  if cd "$3" 2>> "$2"; then "$S" -l -c "$1" < /dev/null >> "$2" 2>&1; echo "claudopus-exit $?" >> "$2"; else echo "claudopus-exit 1" >> "$2"; fi',
  ') > /dev/null 2>&1 &',
  'echo $!',
].join('\n')
// Whether it still runs: the process group it was started as, only while that process is still the one started for this output file
const RUN_ALIVE = '# claudopus run-it alive\nps -o args= -p "$1" 2>/dev/null | grep -qF -- "$2"'
const RUN_STOP = '# claudopus run-it stop\nps -o args= -p "$1" 2>/dev/null | grep -qF -- "$2" || exit 0\nkill -TERM -- "-$1" 2>/dev/null || kill -TERM "$1"\nsleep 3\nkill -KILL -- "-$1" 2>/dev/null\nexit 0'

// Every offer and run, kept across reloads in the mod's state; drawn from `runList`, its copy as last written or read
const runs = atom({ plugin: 'claudopus', key: 'runs' } as const, [], { shape: 'runs-1' })
let runList: PressRun[] = []
const saveRuns = async ($: EngineInterface, fn: (list: PressRun[]) => PressRun[]) => {
  const now = await $.clock.now()
  runList = await update($, runs, list => fn(list).filter(one => now - (one.endedAt ?? one.startedAt ?? one.askAt) < RUN_KEPT).slice(-40))
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
// The run on a card that is under way
const runningOn = (card: string) => runList.filter(run => run.card === card && run.startedAt && !run.endedAt)
// What each running one last printed, and the ones the person stopped, for this load
const runLast = new Map<string, string>()
const runStopped = new Set<string>()
const runKey = (run: Pick<PressRun, 'card' | 'askAt'>) => `${run.card}:${run.askAt}`
// The presses this load took, so two at once run it once, and the ask a press cleared that starts its run (answerCleared)
const runPressed = new Set<string>()
const runAsked = new Map<string, PressRun>()
const limitText = (ms: number) => (ms >= 60 * 60_000 ? `${Math.round(ms / 3_600_000)} hour${ms >= 2 * 3_600_000 ? 's' : ''}` : `${Math.max(1, Math.round(ms / 60_000))} min`)

// What a refused call may be offered as: a command of the Bash tool, short enough to read, with the folder it runs in and its limit
const runnableOf = (tool: string, call: Record<string, unknown>) => {
  const command = typeof call.command === 'string' ? call.command.trim() : ''
  if (tool !== 'Bash' || !command || command.length > RUN_TEXT_MOST) return undefined
  const asked = typeof call.timeout === 'number' && call.timeout > 0 ? Math.min(call.timeout, RUN_LIMIT) : RUN_LIMIT
  const limitMs = call.run_in_background === true ? RUN_LIMIT_BACKGROUND : asked
  return { command, cwd: cwd || dir.replace(/\/\.claude\/claudopus$/, ''), limitMs, description: typeof call.description === 'string' ? oneLine(call.description) : '' }
}
// Kept as its notice goes up on the card, by the hook that saw Claude Code refuse it
const offerRun = async ($: EngineInterface, card: string, from: string, askAt: number, runnable: NonNullable<ReturnType<typeof runnableOf>>) => {
  await saveRuns($, list => [...list.filter(one => !isSameRun(one, { card, askAt })), { card, from, askAt, ...runnable }])
}
// What the card and the chat say of it before the press
const runDetails = (runnable: NonNullable<ReturnType<typeof runnableOf>>) =>
  `${RUN_IT}: Claudopus runs exactly the command shown, once, as a command you type in your terminal would run, in ${shortPath(runnable.cwd, 80)}, for at most ${limitText(runnable.limitMs)}, and sends the task what it printed. Nothing else changes: Claude Code still decides each of the task's own calls. ${CARRY_ON}: it doesn't run, and the task goes on without it.`

// The Run it press on the card in this chat's own panel: the one way a run starts. The notice is answered first, as any press
// answers it; only once it has been cleared does the command start (answerCleared calls startRun)
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
  }
}
// Started once its notice is cleared, on that press; whatever goes wrong is said on the card, and the task is told
const startRun = async ($: EngineInterface, one: Todo, run: PressRun) => {
  const at = await $.clock.now()
  const logFile = `${dir}/runs/${slug(one.id) || 'work'}-${at}.log`
  const isLogged = await $.fs.write(logFile, '').then(() => true).catch(() => false)
  const r = isLogged
    ? await $.process.run(['/bin/sh', '-c', RUN_SCRIPT, 'sh', run.command, logFile, run.cwd], { cwd: run.cwd, timeoutMs: 15_000 }).catch(err => ({ exitCode: 1, stdout: '', stderr: String(err) }))
    : { exitCode: 1, stdout: '', stderr: 'its output file could not be made' }
  const pid = r.exitCode === 0 ? /^(\d+)\s*$/.exec(r.stdout.trim())?.[1] : undefined
  if (!pid) {
    await log($, `run of the refused command for ${one.id} not started: ${cut(oneLine(r.stderr), 160)}`)
    await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, endedAt: at, end: 'lost' as const } : other)))
    await stepLine($, one.id, `Your command didn't start: Claudopus could not start it (${cut(oneLine(r.stderr), 100) || 'no reason given'})`)
    return
  }
  await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, log: logFile, pid } : other)))
  await log($, `refused command for ${one.id} run on ${who()}'s press, in ${run.cwd}`)
  const target = run.from || one.id
  const card = (await read($, todos)).find(other => other.id === target)
  if (card?.status === 'working') await tell($, target, named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus is running it for them now, exactly as shown, in ${run.cwd}, for at most ${limitText(run.limitMs)}. What it prints comes to you as a message when it ends. Do not run it yourself; carry on with what does not need it, or end your step.`))
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
const lookRun = async ($: EngineInterface, run: PressRun) => {
  const now = (runList.find(one => isSameRun(one, run)) ?? run)
  if (now.endedAt || !run.log || !run.pid || !run.startedAt) return true
  during('look at a command run on a press')
  const text = await fileEnd($, run.log, 64_000)
  const exit = /claudopus-exit (\d+)\s*$/.exec(text)?.[1]
  const lines = text.replace(/claudopus-exit \d+\s*$/, '').replace(/\s+$/, '').split('\n')
  const last = oneLine(lines.filter(line => line.trim()).at(-1) ?? '')
  if (runLast.get(runKey(run)) !== last) (runLast.set(runKey(run), last), redraw($))
  const at = await $.clock.now()
  if (exit !== undefined) return void (await endRun($, run, runStopped.has(runKey(run)) ? 'stopped' : 'exited', Number(exit), lines)), true
  if (at - run.startedAt > run.limitMs) {
    await stopProcess($, run)
    return void (await endRun($, run, 'limit', undefined, lines)), true
  }
  // Gone without writing its end (stopped from outside, or the Mac restarted): said so, with what it printed
  const alive = await $.process.run(['/bin/sh', '-c', RUN_ALIVE, 'sh', run.pid, run.log], { timeoutMs: 10_000 }).catch(() => undefined)
  if (alive && alive.exitCode !== 0) {
    const again = await fileEnd($, run.log, 64_000)
    const late = /claudopus-exit (\d+)\s*$/.exec(again)?.[1]
    const rest = again.replace(/claudopus-exit \d+\s*$/, '').replace(/\s+$/, '').split('\n')
    return void (await endRun($, run, late !== undefined ? (runStopped.has(runKey(run)) ? 'stopped' : 'exited') : runStopped.has(runKey(run)) ? 'stopped' : 'lost', late === undefined ? undefined : Number(late), rest)), true
  }
  return false
}
const stopProcess = ($: EngineInterface, run: PressRun) =>
  run.pid && run.log ? $.process.run(['/bin/sh', '-c', RUN_STOP, 'sh', run.pid, run.log], { timeoutMs: 15_000 }).catch(err => log($, `run of ${run.card} not stopped: ${String(err)}`)) : Promise.resolve()
// The person's Stop on its row
const stopRun = async ($: EngineInterface, run: PressRun) => {
  presses += 1
  if (runStopped.has(runKey(run))) return
  runStopped.add(runKey(run))
  redraw($)
  await stopProcess($, run)
}
// Its end: kept, said on the card, and sent to the task, which is started again with it if it had ended
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
  await stepLine($, run.card, named(`The command you ran ${how.replace(/\{name\}/g, 'you')}; Claude was sent what it printed`))
  const card = (await read($, todos)).find(one => one.id === run.card)
  if (!card) return
  const target = run.from || run.card
  const text = named(
    `{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus ran it for them, exactly as shown, once, in ${run.cwd}:\n${run.command}\nIt ${how}. Its whole output is in ${run.log}; ${tail ? `its last lines:\n${tail}` : 'it printed nothing.'}\nThat ran on {name}'s own press, as theirs: it is no permission. Claude Code still decides each call of yours, so do not run it, or another way to the same end, yourself. Use what it printed; if you need it run again, ask {name} with the command.`,
  )
  const isWorking = (await read($, todos)).find(one => one.id === target)?.status === 'working'
  const told = isWorking ? await tell($, target, text) : undefined
  if (told && !told.deny) return
  await toEnded($, card, target, `${text}\n${RESUMED_BY_ANSWER}`, { text: RUN_IT, ask: `the command Claude Code refused (${cut(run.description || run.command, 60)})`, at, line: lineOf(card), isCard: true, askAt: run.askAt })
}

// On the card, before the press: where it runs and for how long at most, under the command; then the button
const runWhere = (ui: Ui, one: Todo, key: string) => {
  const run = offeredRun(one)
  return run ? <ui.Text key={`${key}-where`} dimColor wrap="wrap">{`Runs in ${shortPath(run.cwd, 60)}, as a command you type would, for at most ${limitText(run.limitMs)}`}</ui.Text> : null
}
const runButton = ($: EngineInterface, ui: Ui, one: Todo, key: string) =>
  offeredRun(one) ? <ui.Button key={`${key}-run-${one.ask?.at ?? 0}-${loadMark}`} label={RUN_IT} onPress={() => void runIt($, one).catch(err => log($, `refused command not run: ${String(err)}`))} /> : null
// While it runs: the command, where, how long it has run of how long at most, what it last printed, and Stop
const runBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string, at: number, isWhole = false) => {
  const list = one.chat ? [] : runningOn(one.id)
  if (!list.length) return null
  return (
    <ui.Box key={key} flexDirection="column" gap={1}>
      {list.map(run => {
        const last = runLast.get(runKey(run)) ?? ''
        const isStopping = runStopped.has(runKey(run))
        return (
          <ui.Box key={`${key}-${run.askAt}`} flexDirection="column" gap={1} borderStyle="round" borderColor={LIVE} paddingX={1} flexShrink={0}>
            <ui.Text wrap="truncate-end" dimColor>{`Your command · ${isStopping ? 'stopping' : `running ${took(at - (run.startedAt ?? at))}`} · at most ${limitText(run.limitMs)}`}</ui.Text>
            <ui.Box backgroundColor={FILL} paddingLeft={2}>
              <ui.Text mono wrap="wrap">{isWhole ? run.command : cut(run.command, 600)}</ui.Text>
            </ui.Box>
            <ui.Text dimColor wrap="truncate-start">{`in ${shortPath(run.cwd, 60)}`}</ui.Text>
            <ui.Text wrap="truncate-end">{last ? `Last printed: ${cut(last, 200)}` : 'Nothing printed yet'}</ui.Text>
            {isStopping ? null : (
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
