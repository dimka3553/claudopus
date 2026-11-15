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
  const tmp = isLinux ? '' : ((await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  const home = (await $.env.get('HOME')) ?? ''
  usageFile = tmp ? `${tmp}/claudopus-usage.json` : `${home}/.cache/claudopus-usage.json`
  return usageFile
}

// One look when the last is due: a fresh one another chat left is taken as it is, and a chat that is looking says so first in a
// small file beside it, so chats that fall due together look once
const lookUsage = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const isFresh = (at: number) => now >= at && now - at < USAGE_EVERY - 500
  if (usageBusy || isFresh(usageTriedAt) || (usageKept && isFresh(usageKept.at))) return
  usageBusy = true
  usageTriedAt = now
  try {
    const path = await usagePathOf($)
    const shared = keptOf(await $.fs.read(path).catch(() => ''))
    if (shared && isFresh(shared.at)) return void (await keepUsage($, shared))
    const taking = Number(await $.fs.read(`${path}.taking`).catch(() => '0'))
    if (taking && now >= taking && now - taking < USAGE_EVERY / 2) return
    await $.fs.write(`${path}.taking`, String(now)).catch(() => undefined)
    const base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept
    // top, the costly part, at most once a minute, answered or not
    const topAt = Math.max(base?.topAt ?? 0, usageTopTriedAt)
    const isTop = !isLinux && (!topAt || now < topAt || now - topAt >= FOOTPRINT_EVERY)
    if (isTop) usageTopTriedAt = now
    const r = await $.process.run(['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: 5000 }).catch(() => undefined)
    const kept = r?.stdout ? nextKept(base, r.stdout, now, isLinux, isTop) : undefined
    if (!kept) return
    await keepUsage($, kept)
    await $.fs.write(path, JSON.stringify(kept)).catch(() => undefined)
  } finally {
    usageBusy = false
  }
}
// New figures are kept, and the band that shows them redraws
const keepUsage = async ($: EngineInterface, kept: UsageKept) => {
  const isNew = kept.at !== usageKept?.at
  usageKept = kept
  if (isNew) await update($, figuresAt, () => kept.at)
}
// The figures to show, when a look has been had lately
const usageNow = (now: number) => (usageKept && now - usageKept.at < USAGE_EVERY * 6 ? usageKept.figures : undefined)

// What each figure says in words, for a reader that cannot see the drawings
const usageWords = (f: UsageFigures) => ({
  memory: `Memory: ${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB in use, Claude ${gbText(f.memClaude)} GB`,
  cpu: f.cpu === undefined ? '' : `Processor: ${pctText(f.cpu)}% busy, Claude ${pctText(f.cpuClaude ?? 0)}% of the whole`,
  disk: f.disk === undefined ? '' : `Disk: ${rateText(f.disk).join(' ')} read and written`,
  net: f.net === undefined ? '' : `Network: ${rateText(f.net).join(' ')} in and out`,
  gpu: f.gpu === undefined ? '' : `Graphics processor: ${pctText(f.gpu)}% busy`,
  battery: f.battery ? `Battery: ${f.battery.pct}%, ${batteryWords(f.battery)}` : '',
})
const batteryWords = (b: UsageBattery) =>
  b.state === 'battery' ? (b.left ? `${leftText(b.left)} left` : 'on battery') : b.state === 'charging' ? (b.left ? `charging, ${leftText(b.left)} to full` : 'charging') : b.state === 'plugged' ? 'on power' : 'its state not said'
// What follows the charge: the time left, the time to full, or that it is on power; nothing while the system still estimates
const batteryAfter = (b: UsageBattery) => (b.state === 'plugged' || b.state === 'unknown' ? '' : b.left ? ` ${leftText(b.left)}${b.state === 'charging' ? ' to full' : ' left'}` : '')

// More of each figure, for a pointer resting on it: a heading with the figure in full, then rows of a name and its value (Claude's
// part, the parts of a speed, who uses the most), and for the battery its state in words. Only what the looks gave: a part that is
// not known is left out
type UsageCard = { title: string; value: string; note?: string; rows: [string, string][]; most?: [string, string][] }
const usageCards = (f: UsageFigures): Record<string, UsageCard | undefined> => {
  const most = (top: UsageTop | undefined, text: (n: number) => string) => (top?.length ? top.map(([name, n]): [string, string] => [name, text(n)]) : undefined)
  const b = f.battery
  return {
    memory: { title: 'Memory', value: `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB`, rows: [['Claude and what it started', `${gbText(f.memClaude)} GB`]], most: most(f.memTop, n => `${gbText(n)} GB`) },
    cpu: f.cpu === undefined ? undefined : {
      title: 'Processor',
      value: `${pctText(f.cpu)}% busy`,
      rows: [...(f.ncpu && f.ncpu > 1 ? [['Cores', `${f.ncpu}`] as [string, string]] : []), ['Claude and what it started', `${pctText(f.cpuClaude ?? 0)}%`]],
      most: most(f.cpuTop, n => `${pctText(n)}%`),
    },
    gpu: f.gpu === undefined ? undefined : {
      title: 'Graphics processor',
      value: `${pctText(f.gpu)}% busy`,
      rows: f.gpuMem === undefined ? [] : [['Its memory in use', f.gpuMemTotal ? `${gbText(f.gpuMem)} of ${gbText(f.gpuMemTotal)} GB` : `${gbText(f.gpuMem)} GB`]],
    },
    battery: !b ? undefined : {
      title: 'Battery',
      value: `${b.pct}%`,
      note: b.state === 'battery' ? (b.left ? `On battery, about ${leftText(b.left)} left` : 'On battery, the time left is still being estimated') : b.state === 'charging' ? (b.left ? `Charging, about ${leftText(b.left)} to full` : 'Charging, the time to full is still being estimated') : b.state === 'unknown' ? 'The system does not say whether it charges' : b.pct >= 100 ? 'Fully charged, on power' : 'On power, not charging',
      rows: [],
    },
    disk: f.disk === undefined ? undefined : { title: 'Disk', value: rateText(f.disk).join(' '), note: 'Read and written together', rows: f.disks?.length ? [['Disks', f.disks.join(', ')]] : [] },
    net: f.net === undefined ? undefined : {
      title: 'Network',
      value: rateText(f.net).join(' '),
      rows: [...(f.netIn !== undefined && f.netOut !== undefined ? [['In', rateText(f.netIn).join(' ')], ['Out', rateText(f.netOut).join(' ')]] as [string, string][] : []), ...(f.ports?.length ? [['Connections', f.ports.join(', ')]] as [string, string][] : [])],
    },
  }
}
// The card, the app's own hover card: a Box placed absolutely and drawn hidden inside the figure's keyed Box, shown while the pointer
// rests on the figure. The app lifts it above the bar, gives it its own surface, edge and shadow, and keeps it in the window
const usageCardDrawn = (ui: Ui, key: string, card: UsageCard) => {
  const { Box, Text } = ui
  const row = (name: string, value: string, n: number, kind: string) => (
    <Box key={`${key}-${kind}-${n}`} flexDirection="row" justifyContent="space-between" gap={3}>
      <Text dimColor wrap="truncate-end">{name}</Text>
      <Text wrap="truncate-end">{value}</Text>
    </Box>
  )
  return (
    // No key of its own: a hidden keyed Box would be its own hover scope, which the pointer can never be over
    <Box position="absolute" top={-1} left={0} display="none" hover={{ display: 'flex' }} flexDirection="column" gap={1}>
      <Box key={`${key}-card-head`} flexDirection="row" justifyContent="space-between" gap={3}>
        <Text bold>{card.title}</Text>
        <Text bold>{card.value}</Text>
      </Box>
      {card.note ? <Text key={`${key}-card-note`} dimColor>{card.note}</Text> : null}
      {card.rows.length ? <Box key={`${key}-card-rows`} flexDirection="column">{card.rows.map(([name, value], n) => row(name, value, n, 'row'))}</Box> : null}
      {card.most?.length ? (
        <Box key={`${key}-card-most`} flexDirection="column">
          <Text dimColor>Using the most</Text>
          {card.most.map(([name, value], n) => row(name, value, n, 'most'))}
        </Box>
      ) : null}
    </Box>
  )
}

// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network. Each figure is a keyed Box, so the pointer resting on it shows its card and a faint fill
const usageDrawn = (ui: Ui, f: UsageFigures) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const { Box, Text } = ui
  if (!table.Svg) return null
  const Svg = table.Svg
  const isHigh = isMemoryHigh(f)
  const words = usageWords(f)
  const cards = usageCards(f)
  const one = (key: string, card: UsageCard | undefined, svg: { source: string; width: number; height: number }, alt: string, value: string, unit: string, color?: string) => (
    <Box key={`usage-${key}`} flexDirection="row" flexShrink={0} alignItems="center" hover={{ backgroundColor: FILL }}>
      <Svg key={`usage-${key}-${svg.source.length}-${hashOf(svg.source)}`} source={svg.source} alt={alt} width={svg.width} height={svg.height} />
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
      {card ? usageCardDrawn(ui, `usage-${key}`, card) : null}
    </Box>
  )
  return [
    one('memory', cards.memory, usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
    f.cpu === undefined ? null : one('cpu', cards.cpu, usageSvg('cpu', { claude: f.cpuClaude ?? 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
    f.gpu === undefined ? null : one('gpu', cards.gpu, usageSvg('gpu', { claude: 0, used: f.gpu }), words.gpu, pctText(f.gpu), '%'),
    f.battery ? one('battery', cards.battery, batterySvg(f.battery), words.battery, `${f.battery.pct}`, `%${batteryAfter(f.battery)}`, isBatteryLow(f.battery) ? USAGE_AMBER : undefined) : null,
    f.disk === undefined ? null : one('disk', cards.disk, usageSvg('disk'), words.disk, rateText(f.disk)[0], ` ${rateText(f.disk)[1]}`),
    f.net === undefined ? null : one('net', cards.net, usageSvg('net'), words.net, rateText(f.net)[0], ` ${rateText(f.net)[1]}`),
  ]
}
// The line as text, for the terminal, in a phone's 50 columns with the octopus: a word for each, units cut to G and M/s, and three-cell meters with Claude's cells purple
const USAGE_CELLS = 3
// Given the room, a figure that does not fit is left out whole, never cut in the middle: the network first, then the disk, then the
// graphics processor, so memory, the processor and the battery stay
const usageText = (ui: Ui, f: UsageFigures, room = Infinity) => {
  const { Text } = ui
  const rate = (n: number) => rateText(n).join('').replace('B/s', '/s')
  const widths = {
    gpu: f.gpu === undefined ? 0 : ` gpu${'▱'.repeat(USAGE_CELLS)} ${pctText(f.gpu)}%`.length,
    disk: f.disk === undefined ? 0 : ` disk ${rate(f.disk)}`.length,
    net: f.net === undefined ? 0 : ` net ${rate(f.net)}`.length,
  }
  let width = `mem${'▱'.repeat(USAGE_CELLS)} ${gbText(f.memUsed)}G`.length + (f.cpu === undefined ? 0 : ` cpu${'▱'.repeat(USAGE_CELLS)} ${pctText(f.cpu)}%`.length) + (f.battery ? batteryAfterText(f.battery).length + ` bat ${f.battery.pct}%`.length : 0) + widths.gpu + widths.disk + widths.net
  const shown = { gpu: true, disk: true, net: true }
  for (const one of ['net', 'disk', 'gpu'] as const) if (width > room && widths[one]) (shown[one] = false), (width -= widths[one])
  const isHigh = isMemoryHigh(f)
  const meter = (claude: number, used: number, color?: string) => {
    const { mine, rest } = meterOf(claude, used, USAGE_CELLS)
    return [
      <Text key="mine" color={USAGE_PURPLE}>{'▰'.repeat(mine)}</Text>,
      <Text key="rest" color={color} dimColor={!color}>{'▰'.repeat(rest)}</Text>,
      <Text key="free" dimColor>{'▱'.repeat(USAGE_CELLS - mine - rest)}</Text>,
    ]
  }
  const amber = isHigh ? USAGE_AMBER : undefined
  return (
    <Text wrap="truncate-end">
      <Text color={amber} dimColor={!amber}>mem</Text>
      {meter(f.memClaude / f.memTotal, f.memUsed / f.memTotal, amber)}
      <Text color={amber}>{` ${gbText(f.memUsed)}`}</Text>
      <Text color={amber} dimColor={!amber}>G</Text>
      {f.cpu === undefined ? null : [<Text key="c" dimColor>{' cpu'}</Text>, ...meter(f.cpuClaude ?? 0, f.cpu), <Text key="cv">{` ${pctText(f.cpu)}`}</Text>, <Text key="cu" dimColor>%</Text>]}
      {f.gpu === undefined || !shown.gpu ? null : [<Text key="g" dimColor>{' gpu'}</Text>, ...meter(0, f.gpu), <Text key="gv">{` ${pctText(f.gpu)}`}</Text>, <Text key="gu" dimColor>%</Text>]}
      {f.battery ? batteryText(ui, f.battery) : null}
      {f.disk === undefined || !shown.disk ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1].replace('B/s', '/s')}</Text>]}
      {f.net === undefined || !shown.net ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1].replace('B/s', '/s')}</Text>]}
    </Text>
  )
}
// The battery in words, short: "bat 85% 4:12" on battery, "bat 62% ↑1:05" charging (↑ and the time to full), "bat 100% ac" on power
const batteryText = (ui: Ui, b: UsageBattery) => {
  const { Text } = ui
  const low = isBatteryLow(b) ? USAGE_AMBER : undefined
  const after = batteryAfterText(b)
  return [
    <Text key="b" color={low} dimColor={!low}>{' bat '}</Text>,
    <Text key="bv" color={low}>{`${b.pct}`}</Text>,
    <Text key="bu" color={low} dimColor={!low}>%</Text>,
    after ? <Text key="ba" color={b.state === 'charging' ? USAGE_PURPLE : low} dimColor={!low && b.state !== 'charging'}>{after}</Text> : null,
  ]
}
const batteryAfterText = (b: UsageBattery) => (b.state === 'plugged' ? ' ac' : b.state === 'charging' ? ` ↑${b.left ? leftText(b.left) : ''}` : b.left ? ` ${leftText(b.left)}` : '')
// A short mark of a drawing, so a new drawing is a new picture to the app
const hashOf = (text: string) => {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
