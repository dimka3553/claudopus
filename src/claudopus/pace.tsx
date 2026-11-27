// Claude's commands take their turn on the processor, so the person always has cores of their own (hooks/pace.ts says how and why).
// One chat looks for every chat on the Mac every few seconds (half as often on battery), through a small shared file as the usage line does: while any of this
// chat's work runs, and while the last look left commands waiting, so none is left in the background mode once the work is over

// When this chat last tried, and whether it is at it now
let pacedAt = 0
let isPacing = false
let paceFile = ''
// The cores, once a look has told them: they never change
let paceCores = 0
const pacePathOf = async ($: EngineInterface) => {
  if (paceFile) return paceFile
  const tmp = ((await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  paceFile = `${tmp || (await $.env.get('HOME')) || ''}/claudopus-pace.json`
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
  const every = PACE_EVERY * (isOnBattery ? 2 : 1)
  if (now >= pacedAt && now - pacedAt < every - 500) return
  const path = await pacePathOf($)
  const last = pacedOf(await $.fs.read(path).catch(() => ''))
  const isWorking = (await ownCards($)).some(one => !one.parentId && one.status === 'working')
  if ((!isWorking && !last.held) || (now >= last.at && now - last.at < every - 500)) return
  isPacing = true
  pacedAt = now
  try {
    await $.fs.write(path, JSON.stringify({ ...last, at: now })).catch(() => undefined)
    const run = async (script: string) => (await $.process.run(['sh', '-c', script, 'pace', paceCores ? String(paceCores) : ''], { timeoutMs: 5000 }).catch(() => undefined))?.stdout ?? ''
    let text = await run(PACE_LOOK)
    let look = paceLookOf(text)
    paceCores = look.cores || paceCores
    if (!look.procs.length || !paceCores) return
    // The threads only when they can change what is decided, and where the look did not bring them
    const isThreads = text.includes('@@THREADS@@') || paceNeedsThreads(look)
    if (isThreads && !text.includes('@@THREADS@@')) look = paceLookOf((text += `\n${await run(PACE_THREADS)}`))
    look.cores = paceCores
    const paced = paceOf(look, isThreads && now - last.at < 30_000 ? last.others : undefined, isOnBattery)
    if (paced.lower.length || paced.lift.length) await $.process.run(['sh', '-c', PACE_SET, 'pace', paced.lower.join(' '), paced.lift.join(' ')], { timeoutMs: 10_000 })
    await $.fs.write(path, JSON.stringify({ at: now, held: paced.held, ...(isThreads ? { others: paced.others } : {}) })).catch(() => undefined)
    if (paced.held && !last.held) await log($, `${paced.held} of Claude's commands wait their turn in the background, so ${look.cores - paced.room} cores stay free for everything else`)
    if (!paced.held && last.held) await log($, "every one of Claude's commands runs at full speed again")
  } finally {
    isPacing = false
  }
}
