// Claude's commands take their turn on the processor, so the person always has cores of their own (hooks/pace.ts says how and why).
// One chat looks for every chat on the Mac every few seconds, through a small shared file as the usage line does: while any of this
// chat's work runs, and while the last look left commands waiting, so none is left in the background mode once the work is over

// When this chat last tried, and whether it is at it now
let pacedAt = 0
let isPacing = false
let paceFile = ''
const pacePathOf = async ($: EngineInterface) => {
  if (paceFile) return paceFile
  const tmp = ((await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  paceFile = `${tmp || (await homeFolder($)) || ''}/claudopus-pace.json`
  return paceFile
}
// What the last look on the Mac left: when, how many commands it left waiting, and how many other threads were ready at full speed
const pacedOf = (text: string): { at: number; held: number; others?: number } => {
  try {
    const v = JSON.parse(text || '{}') as { at?: unknown; held?: unknown; others?: unknown }
    return { at: Number(v.at) || 0, held: Number(v.held) || 0, ...(typeof v.others === 'number' ? { others: v.others } : {}) }
  } catch {
    return { at: 0, held: 0 }
  }
}

// A look when one is due: the processes and their threads, then the background mode put on or taken off only where it changes
const paceWork = async ($: EngineInterface) => {
  if (isLinux || isPacing) return
  const now = await $.clock.now()
  if (now >= pacedAt && now - pacedAt < PACE_EVERY - 500) return
  const path = await pacePathOf($)
  const last = pacedOf(await $.fs.read(path).catch(() => ''))
  const isWorking = (await read($, todos)).some(one => !one.parentId && one.status === 'working')
  if ((!isWorking && !last.held) || (now >= last.at && now - last.at < PACE_EVERY - 500)) return
  isPacing = true
  pacedAt = now
  try {
    await $.fs.write(path, JSON.stringify({ ...last, at: now })).catch(() => undefined)
    const looked = await runOn($, ['sh', '-c', PACE_LOOK], { timeoutMs: 5000 }).catch(() => undefined)
    const look = paceLookOf(looked?.stdout ?? '')
    if (!look.procs.length || !look.cores) return
    const paced = paceOf(look, now - last.at < 30_000 ? last.others : undefined)
    if (paced.lower.length || paced.lift.length) await runOn($, ['sh', '-c', PACE_SET, 'pace', paced.lower.join(' '), paced.lift.join(' ')], { timeoutMs: 10_000 })
    await $.fs.write(path, JSON.stringify({ at: now, held: paced.held, others: paced.others })).catch(() => undefined)
    if (paced.held && !last.held) await log($, `${paced.held} of Claude's commands wait their turn in the background, so ${look.cores - paced.room} cores stay free for everything else`)
    if (!paced.held && last.held) await log($, "every one of Claude's commands runs at full speed again")
  } finally {
    isPacing = false
  }
}
