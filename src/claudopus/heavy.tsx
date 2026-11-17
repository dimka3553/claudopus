// Heavy commands wait their turn: a task's browser, build or render that would start while the Mac is busy and another of the
// chat's heavy commands runs is held before it starts, shown on its card as waiting its turn, and let go in the order they came
// once there is room. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once: captures timed out and
// a dev server took 13 s a request; on 15 Nov this Mac's load average reached 204 on 18 cores. What counts as heavy is heavyOf in
// hooks/jobs.ts; the marks are the person's setting (`heavy` in config.json, HEAVY_MODES in hooks/config.tsx)
//
// Nothing here makes the work wait with a sleep of its own: its command is held in this hook, as the admin gate holds one, and runs
// the moment its turn comes, with a line telling the work how long it waited and why. A command held this long runs anyway, so
// nothing waits for good on load the chat's work does not make
const HEAVY_MOST = 15 * 60_000
// After one is let go, the next waits this long unless few run, so the load of the last shows before another starts
const HEAVY_RAMP = 20_000
type HeldCall = { id: string; agent: string; what: string; cmd: string; kind: HeavyKind; at: number }
// The held calls in the order they came, and the heavy calls let through whose call has not ended, by tool_use_id
let heavyQueue: HeldCall[] = []
const heavyOpen = new Map<string, string>()
// The commands judged heavy, as cards keep a background or detached run's command, so one that goes on past its call still counts
const heavySeen = new Set<string>()
let heavyLetAt = 0
const keptCmd = (command: string) => oneLine(command).slice(0, 400)

// How many heavy commands of this chat's work run now: calls held open, and runs in the background or detached that go on
const heavyRunning = (list: Todo[]) =>
  heavyOpen.size + list.filter(one => one.status === 'working' || one.bg?.length || one.detached?.length).reduce((n, one) => n + [...(one.bg ?? []), ...(one.detached ?? [])].filter(run => run.cmd && heavySeen.has(run.cmd)).length, 0)
// Whether the Mac is past the setting's marks: its load average for each core, or its memory in use
const isMacBusy = (f: UsageFigures | undefined, mode: HeavyMode) =>
  Boolean(f && ((f.load !== undefined && f.loadCores && f.load >= mode.load * f.loadCores) || (f.memTotal > 0 && f.memUsed / f.memTotal >= mode.memory)))
// Whether a heavy command may start now: always when none of the chat's runs, so it never waits on load the work does not make;
// never while the Mac is busy; else when few run, or none was let go just now
const heavyRoom = (list: Todo[], f: UsageFigures | undefined, mode: HeavyMode, now: number) => {
  const running = heavyRunning(list)
  if (!running) return true
  if (isMacBusy(f, mode)) return false
  return running < Math.max(2, Math.round((f?.loadCores ?? 8) / 4)) || now - heavyLetAt >= HEAVY_RAMP
}
// How busy the Mac is, in words
const busyWords = (f: UsageFigures | undefined) =>
  !f ? 'busy' : [f.load !== undefined && f.loadCores ? `load ${Math.round(f.load)} on ${f.loadCores} cores` : '', f.memTotal ? `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB memory in use` : ''].filter(Boolean).join(', ')
const placeWords = (n: number) => (n === 1 ? 'next in line' : `${n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`} in line`)
const HEAVY_WAITED = (what: string, waited: string, f: UsageFigures | undefined, isLate: boolean) =>
  isLate
    ? `Claudopus held this command ("${what}") ${waited} while the Mac was busy (${busyWords(f)}), then ran it anyway. If it failed or timed out for lack of room, run it again once your other heavy commands end.`
    : `Claudopus held this command ("${what}") ${waited}, until the Mac had room for it, and ran it as soon as its turn came.`
const HEAVY_GONE = 'Not run: it was stopped while it waited its turn for the Mac to have room.'

// Every card's held calls, with their places in the line
const showHeld = ($: EngineInterface) =>
  changeTodos($, list =>
    list.map(one => {
      const mine = heavyQueue.flatMap((call, n) => (call.agent === one.id ? [{ id: call.id, what: call.what, cmd: call.cmd, at: call.at, place: n + 1 }] : []))
      if (!mine.length && !one.heldCalls) return one
      if (JSON.stringify(mine) === JSON.stringify(one.heldCalls ?? [])) return one
      return { ...one, heldCalls: mine.length ? mine : undefined }
    }),
  ).then(() => redraw($))
// A held row as the card's tree draws it: a wait for its turn, with how it stands
const heldJobs = (one: Todo): Job[] =>
  (one.heldCalls ?? []).map(call => ({ ...jobOf(`held-${call.id}`, call.what, call.cmd, call.at), kind: 'wait' as const, waitsFor: `its turn: ${labelOf(call.what, call.cmd)}`, target: `the Mac is busy · ${placeWords(call.place)}` }))

// Holds a heavy command of a piece of work until its turn, and says what the work is told as it runs; a deny when it was stopped
// while it waited. The id is the call's, to take out of heavyOpen as the call ends
const holdHeavy = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ id?: string; said?: string; deny?: string }> => {
  const input = e as { command?: unknown; description?: unknown; tool_use_id?: unknown }
  const command = String(input.command ?? '')
  const kind = heavyOf(command, await scriptsRun($, command))
  if (!kind) return {}
  const mode = heavyModeOf(await readConfig($, dir))
  if (mode.value === 'never') return {}
  const id = String(input.tool_use_id ?? '')
  heavySeen.add(keptCmd(command))
  const at = await $.clock.now()
  const call: HeldCall = { id, agent: e.agentId ?? '', what: oneLine(String(input.description ?? '')) || labelOf('', command), cmd: keptCmd(command), kind, at }
  await lookUsage($).catch(() => undefined)
  if (!heavyQueue.length && heavyRoom(await read($, todos), usageNow(at), mode, at)) return (heavyOpen.set(id, call.agent), (heavyLetAt = at), { id })
  heavyQueue.push(call)
  const heldBy = usageNow(at)
  await log($, `work ${call.agent}'s ${kind} command waits its turn (${heavyQueue.length} held, Mac ${busyWords(heldBy)})`)
  await showHeld($)
  let isLate = false
  let now = at
  try {
    for (;;) {
      if (next.signal?.aborted || (await isReplaced($))) return { deny: HEAVY_GONE }
      await lookUsage($).catch(() => undefined)
      now = await $.clock.now()
      isLate = now - at >= HEAVY_MOST || (next.budget?.remainingMs ?? Infinity) < 1500
      if (heavyQueue[0]?.id === id && (isLate || heavyRoom(await read($, todos), usageNow(now), mode, now))) break
      await $.process.run(['/bin/sleep', '2'], { timeoutMs: 10_000 }).catch(() => undefined)
    }
  } finally {
    heavyQueue = heavyQueue.filter(one => one.id !== id)
    await showHeld($).catch(() => undefined)
  }
  heavyOpen.set(id, call.agent)
  heavyLetAt = now
  const waited = shortAgo(now - at)
  await log($, `work ${call.agent}'s ${kind} command let go after ${waited}${isLate ? ', the Mac still busy' : ''}`)
  return { id, said: HEAVY_WAITED(cut(call.what, 120), waited, usageNow(now), isLate) }
}
