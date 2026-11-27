// How Claude uses this computer, for the line above the prompt: looked at every few seconds while work runs, shared by every chat
// through one small file, so a computer with many chats open still looks once. The measuring and the drawings are in hooks/usage.ts

let usageKept: UsageKept | undefined
let usageBusy = false
// When this chat last tried a look, whether or not it gave figures: a look that fails waits as long as one that works
let usageTriedAt = 0
// When this chat last asked top, whether or not the look came back: top costs half a second of the processor
let usageTopTriedAt = 0
let usageFile = ''
// The shared file, in the person's own temporary folder (on Linux, their cache folder: /tmp is everyone's)
const usagePathOf = async ($: EngineInterface) => {
  if (usageFile) return usageFile
  // (on Windows the person's own temporary folder, TEMP, in their profile)
  const tmp = isLinux ? '' : slashed((isWindows ? await $.env.get('TEMP') : await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  const home = (await homeFolder($)) ?? ''
  usageFile = tmp ? `${tmp}/claudopus-usage.json` : `${home}/.cache/claudopus-usage.json`
  return usageFile
}

// How often it looks: less often on battery, as the look itself costs the processor, and on Windows a third as often, as its look is
// a PowerShell, which costs far more than ps (on battery there too, at the battery's own pace when that is slower)
const usageEvery = () => Math.max(isOnBattery ? USAGE_BATTERY_EVERY : USAGE_EVERY, isWindows ? USAGE_EVERY * 3 : 0)
// One look when the last is due: a fresh one another chat left is taken as it is, and a chat that is looking says so first in a
// small file beside it, so chats that fall due together look once
// How often a look is whole: the others leave out what only the figures' cards show or what moves slowly (usageMac)
const USAGE_MORE = 15_000
const USAGE_MORE_BATTERY = 60_000
const lookUsage = async ($: EngineInterface) => {
  const ranFrom = runFrom()
  try {
  const now = await $.clock.now()
  const every = usageEvery()
  const isFresh = (at: number) => now >= at && now - at < every - 500
  if (usageBusy || isFresh(usageTriedAt) || (usageKept && isFresh(usageKept.at))) return
  usageBusy = true
  usageTriedAt = now
  try {
    const path = await usagePathOf($)
    const shared = keptOf(await $.fs.read(path).catch(() => ''))
    if (shared && isFresh(shared.at)) return void (await keepUsage($, shared))
    const taking = Number(await $.fs.read(`${path}.taking`).catch(() => '0'))
    if (taking && now >= taking && now - taking < every / 2) return
    await $.fs.write(`${path}.taking`, String(now)).catch(() => undefined)
    const base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept
    // top, the costly part, at most once a minute, answered or not, and on battery once in five
    const topAt = Math.max(base?.topAt ?? 0, usageTopTriedAt)
    const isTop = !isLinux && !isWindows && (!topAt || now < topAt || now - topAt >= (isOnBattery ? FOOTPRINT_BATTERY_EVERY : FOOTPRINT_EVERY))
    if (isTop) usageTopTriedAt = now
    const moreAt = base?.raw.slowAt ?? base?.at ?? 0
    const isMore = !moreAt || now < moreAt || now - moreAt >= (isOnBattery ? USAGE_MORE_BATTERY : USAGE_MORE) - 500
    const sys = base ? `${base.raw.memTotal} ${base.raw.ncpu}` : ''
    const r = await runOn($, isWindows ? [...POWERSHELL, USAGE_WINDOWS] : ['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop, isMore, /^[1-9]\d* [1-9]\d*$/.test(sys) ? sys : '')], { timeoutMs: isWindows ? 15_000 : 5000 }).catch(() => undefined)
    const kept = r?.stdout ? nextKept(base, r.stdout, now, isLinux, isTop, isWindows) : undefined
    if (!kept) return
    await keepUsage($, kept)
    await $.fs.write(path, JSON.stringify(kept)).catch(() => undefined)
  } finally {
    usageBusy = false
  }
  } finally {
    runTo('lookUsage', ranFrom)
  }
}
// New figures are kept, and the band that shows them redraws only when its line would read or draw differently (the figures as
// it rounds them, the meters as it draws them), or after a pause in the looks, when it had let its figures go
let usageShown = ''
const usageSign = (f: UsageFigures) => {
  const meter = (claude: number, used: number) => [meterOf(claude, used, 18), meterOf(claude, used, USAGE_CELLS)]
  return JSON.stringify([gbText(f.memUsed), isMemoryHigh(f), meter(f.memClaude / f.memTotal, f.memUsed / f.memTotal), f.cpu === undefined ? 0 : [pctText(f.cpu), meter(f.cpuClaude ?? 0, f.cpu)], f.gpu === undefined ? 0 : [pctText(f.gpu), meter(f.gpuClaude ?? 0, f.gpu)], f.battery ? batteryShown(f.battery) : 0, f.disk === undefined ? 0 : rateText(f.disk), f.net === undefined ? 0 : rateText(f.net)])
}
const keepUsage = async ($: EngineInterface, kept: UsageKept) => {
  const was = usageKept
  usageKept = kept
  if (kept.at === was?.at) return
  const sign = usageSign(kept.figures)
  if (sign === usageShown && was && kept.at - was.at < usageEvery() * 6) return
  usageShown = sign
  await update($, figuresAt, () => kept.at)
}
// The figures to show, when a look has been had lately
const usageNow = (now: number) => (usageKept && now - usageKept.at < usageEvery() * 6 ? usageKept.figures : undefined)
// The looks of the last minutes for the cards' charts, ending at the newest look, so a drawing between looks draws the same charts
const usageHistory = () => ({ points: usageKept?.history ?? [], at: usageKept?.at ?? 0 })

// What this computer is called in a line about it: the Mac, the PC, the machine
const machineWord = () => thisMac().replace(/^this /, '')
