// Heavy commands wait their turn: a task's browser, build or render that would start while the Mac is busy and another of the
// chat's heavy commands runs waits its turn, shown on its card with its place in the line, and the waiting ones go in the order
// they came once there is room. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once: captures timed out and
// a dev server took 13 s a request; on 15 Nov this Mac's load average reached 204 on 18 cores. What counts as heavy is heavyOf in
// hooks/jobs.ts; the marks are the person's setting (`heavy` in config.json, HEAVY_MODES in hooks/config.tsx)
//
// Nothing waits in a hook or with a sleep: a command that must wait is refused at once with its place in the line, so its work stays
// free to read messages and do other things, and Claudopus starts the work again the moment its turn comes (or after 15 minutes at
// the latest, so nothing waits for good on load the chat's work does not make); the work then sends the same command, which runs
const HEAVY_MOST = 15 * 60_000
// After one is let go, the next waits this long unless few run, so the load of the last shows before another starts
const HEAVY_RAMP = 20_000
type HeldCall = { id: string; agent: string; what: string; cmd: string; at: number }
// The held calls in the order they came, and the heavy calls let through whose call has not ended, by tool_use_id
let heavyQueue: HeldCall[] = []
// Work whose turn came, until when its next heavy command runs at once: a turn not taken by then goes to the next in line
const HEAVY_PASS = 3 * 60_000
const heavyPass = new Map<string, number>()
const heavyOpen = new Map<string, string>()
// The commands judged heavy, as cards keep a background or detached run's command, so one that goes on past its call still counts
const heavySeen = new Set<string>()
let heavyLetAt = 0
const keptCmd = (command: string) => oneLine(command).slice(0, 400)

// How many heavy commands of this chat's work run now: calls held open, and runs in the background or detached that go on (never
// another chat's card, which this chat's memory of what is heavy does not cover)
const heavyRunning = (list: Todo[], now: number) =>
  heavyOpen.size + [...heavyPass.values()].filter(until => until > now).length + list.filter(one => !one.chat).reduce((n, one) => n + [...(one.bg ?? []), ...(one.detached ?? [])].filter(run => run.cmd && heavySeen.has(run.cmd)).length, 0)
// Whether the Mac is past the setting's marks: its load average for each core, or its memory in use
const isMacBusy = (f: UsageFigures | undefined, mode: HeavyMode) =>
  Boolean(f && ((f.load !== undefined && f.loadCores && f.load >= mode.load * f.loadCores) || (f.memTotal > 0 && f.memUsed / f.memTotal >= mode.memory)))
// Whether a heavy command may start now: always when none of the chat's runs, so it never waits on load the work does not make;
// never while the Mac is busy; else when few run, or none was let go just now, so the load of the last shows before the next
const heavyRoom = (list: Todo[], f: UsageFigures | undefined, mode: HeavyMode, now: number) => {
  if (mode.value === 'never') return true
  const running = heavyRunning(list, now)
  if (!running) return true
  if (isMacBusy(f, mode)) return false
  return running < Math.max(2, Math.round((f?.loadCores ?? 8) / 4)) || now - heavyLetAt >= HEAVY_RAMP
}
// How busy the Mac is, in words
const busyWords = (f: UsageFigures | undefined) =>
  !f ? 'busy' : [f.load !== undefined && f.loadCores ? `load ${Math.round(f.load)} on ${f.loadCores} cores` : '', f.memTotal ? `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB memory in use` : ''].filter(Boolean).join(', ')
const placeWords = (n: number) => (n === 1 ? 'next in line' : `${n}${n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : n % 10 === 1 && n % 100 !== 11 ? 'st' : 'th'} in line`)
const HEAVY_HELD = (what: string, place: number, f: UsageFigures | undefined, isHelper: boolean) =>
  `Not run yet: the Mac is busy (${busyWords(f)}) and other heavy commands of Claudopus's tasks run, so this one ("${what}") waits its turn, ${placeWords(place)}. ${isHelper ? 'Do other work that does not need it meanwhile: Claudopus tells you when its turn comes, in 15 minutes at the latest.' : 'Do other work that does not need it, or end your step: Claudopus starts you again when its turn comes, in 15 minutes at the latest.'} Then send the same command again.`
const HEAVY_TURN = (what: string, isLate: boolean) =>
  isLate
    ? `Your command "${what}" has waited 15 minutes for room on the Mac: send it again now, and it runs whatever the load. If it fails or times out for lack of room, try it again later.`
    : `It is your command's turn: the Mac has room for "${what}" now. Send it again now, and it runs at once.`

// Every card's held calls, with their places in the line, kept on the cards so a new copy of the mod takes the line up as it was
const showHeld = ($: EngineInterface) =>
  changeTodos($, list =>
    list.map(one => {
      if (one.chat) return one
      const mine = heavyQueue.flatMap((call, n) => (call.agent === one.id ? [{ id: call.id, what: call.what, cmd: call.cmd, at: call.at, place: n + 1 }] : []))
      if (!mine.length && !one.heldCalls) return one
      if (JSON.stringify(mine) === JSON.stringify(one.heldCalls ?? [])) return one
      return { ...one, heldCalls: mine.length ? mine : undefined }
    }),
  ).then(() => redraw($))
// A held row as the card's tree draws it: a wait for its turn, with how it stands
const heldJobs = (one: Todo): Job[] =>
  (one.heldCalls ?? []).map(call => ({ ...jobOf(`held-${call.id}`, call.what, call.cmd, call.at), kind: 'wait' as const, waitsFor: `its turn: ${labelOf(call.what, call.cmd)}`, target: `waits for room on the Mac · ${placeWords(call.place)}` }))

// Whether a piece of work's Bash call runs now or waits its turn: a deny with its place in the line, else the call's id, to take
// out of heavyOpen as the call ends. Nothing waits here: the answer is given at once
const turnHeavy = async ($: EngineInterface, e: ToolCallInput): Promise<{ id?: string; deny?: string }> => {
  const input = e as { command?: unknown; description?: unknown; tool_use_id?: unknown }
  const command = String(input.command ?? '')
  if (!heavyOf(command, await scriptsRun($, command))) return {}
  const agent = e.agentId ?? ''
  // Only work with a card of its own here, where the wait can be seen
  const list = await read($, todos)
  if (!list.some(one => one.id === agent && !one.chat)) return {}
  const mode = heavyModeOf(await readConfig($, dir))
  if (mode.value === 'never') return {}
  const id = String(input.tool_use_id ?? '')
  const cmd = keptCmd(command)
  heavySeen.add(cmd)
  await lookUsage($).catch(() => undefined)
  const now = await $.clock.now()
  // Work whose turn came runs its next heavy command at once, its place given up
  const pass = heavyPass.get(agent)
  heavyPass.delete(agent)
  const waiting = heavyQueue.find(one => one.agent === agent && one.cmd === cmd)
  if ((pass && pass > now) || (!heavyQueue.length && heavyRoom(list, usageNow(now), mode, now))) {
    if (waiting) await leaveLine($, waiting.id)
    return (heavyOpen.set(id, agent), (heavyLetAt = now), { id })
  }
  // The same command sent again before its turn keeps its place
  const call = waiting ?? { id, agent, what: oneLine(String(input.description ?? '')) || labelOf('', command), cmd, at: now }
  if (!waiting) {
    heavyQueue.push(call)
    await log($, `work ${agent}'s heavy command waits its turn (${heavyQueue.length} held, Mac ${busyWords(usageNow(now))})`)
    // Its card waits to be started again, as for a wake_me of its own (one it set already stands), and says so
    await changeTodos($, cards => cards.map(one => (one.id === agent && !one.parentId && !one.wakeWhen ? { ...one, wakeWhen: { what: `its turn on the Mac for "${cut(call.what, 80)}"`, at: now, until: now + HEAVY_MOST + 2 * 60_000 } } : one)))
    await showHeld($)
  }
  return { deny: HEAVY_HELD(cut(call.what, 120), heavyQueue.indexOf(call) + 1, usageNow(now), Boolean(list.find(one => one.id === agent)?.parentId)) }
}
// A held call taken out of the line, and its card's wait for it with it
const leaveLine = async ($: EngineInterface, id: string) => {
  const call = heavyQueue.find(one => one.id === id)
  heavyQueue = heavyQueue.filter(one => one.id !== id)
  if (call && !heavyQueue.some(one => one.agent === call.agent)) await changeTodos($, cards => cards.map(one => (one.id === call.agent && one.wakeWhen?.what.startsWith('its turn on the Mac') ? { ...one, wakeWhen: undefined } : one)))
  await showHeld($)
}
// As the list is followed: work that stopped or reported leaves the line, and the first in line whose turn has come (room on the
// Mac, or 15 minutes waited) is started again, or told at a step of its own, to send its command again
const lookHeld = async ($: EngineInterface) => {
  if (!dir || isOff || !heavyQueue.length) return
  const list = await read($, todos)
  for (const call of heavyQueue) {
    const card = list.find(one => one.id === call.agent)
    // (a helper that ended its step has handed back: it is not started again)
    if (!card || card.status === 'stopped' || card.status === 'failed' || card.handedBackAt !== undefined || (card.parentId && card.status === 'done')) await leaveLine($, call.id)
  }
  const first = heavyQueue[0]
  if (!first) return
  await lookUsage($).catch(() => undefined)
  const now = await $.clock.now()
  for (const [agent, until] of heavyPass) if (until <= now) heavyPass.delete(agent)
  // (those waited past 15 minutes go one at a time too, spaced as a burst is, never all at once)
  const isLate = now - first.at >= HEAVY_MOST && now - heavyLetAt >= HEAVY_RAMP
  if (!isLate && !heavyRoom(await read($, todos), usageNow(now), heavyModeOf(await readConfig($, dir)), now)) return
  await leaveLine($, first.id)
  heavyPass.set(first.agent, now + HEAVY_PASS)
  heavyLetAt = now
  const text = HEAVY_TURN(cut(first.what, 120), isLate)
  const isAtStep = (await $.agent.list().catch(() => [])).find(agent => agent.id === first.agent)?.status === 'running'
  const r = isAtStep
    ? await tell($, first.agent, text).then(() => ({ isDelivered: true as const, reason: '' })).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    : await sendOwn($, { to: { agentId: first.agent }, text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (r.isDelivered && !isAtStep) await wakeCard($, first.agent)
  await log($, `work ${first.agent}'s heavy command's turn came after ${shortAgo(now - first.at)}${isLate ? ', before the Mac had room' : ''}: ${r.isDelivered ? (isAtStep ? 'told' : 'started again') : `not reached (${r.reason})`}`)
  redraw($)
}
// The line as the cards keep it, taken up by a new copy of the mod (a reload), in the order it had; a card's own wait stands
const clearHeld = async ($: EngineInterface) => {
  if (heavyQueue.length) return
  const kept = (await read($, todos)).filter(one => !one.chat && one.status === 'working').flatMap(one => (one.heldCalls ?? []).map(call => ({ ...call, agent: one.id })))
  heavyQueue = kept.sort((a, b) => a.place - b.place).map(({ id, agent, what, cmd, at }) => ({ id, agent, what, cmd, at }))
  await showHeld($)
}
