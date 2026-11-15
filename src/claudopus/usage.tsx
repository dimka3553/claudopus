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
  gpu: f.gpu === undefined ? '' : `Graphics processor: ${pctText(f.gpu)}% busy${f.gpuClaude !== undefined ? `, Claude ${pctText(f.gpuClaude)}% of the whole` : ''}`,
  battery: f.battery ? `Battery: ${f.battery.pct}%, ${batteryWords(f.battery)}` : '',
})
// Each takes the battery as the bar shows it, so a charge the system calls full or empty has no time beside it
const batteryWords = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery' ? (b.left ? `${leftText(b.left)} left` : 'on battery') : b.state === 'charging' ? (b.left ? `charging, ${leftText(b.left)} to full` : b.finishing ? 'finishing charge' : 'charging') : b.state === 'plugged' ? 'on power' : 'its state not said'
// What follows the charge: the time left, the time to full, "finishing" once the system calls it full and still tops it up, or
// nothing on power and while the system still estimates
const batteryAfter = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'plugged' || b.state === 'unknown' ? '' : b.left ? ` ${leftText(b.left)}${b.state === 'charging' ? ' to full' : ' left'}` : b.state === 'charging' && b.finishing && b.pct >= 100 ? ' finishing' : ''

// The battery's state in full, for the line of more: a time only where the bar shows one, and what the system said in its place
const batteryNote = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery'
    ? b.left ? `on battery, ${leftText(b.left)} left as the system estimates it` : read.left ? 'on battery, at 0% as the system gives it' : 'on battery, the system is still estimating the time left'
    : b.state === 'charging'
      ? b.left ? `charging, ${leftText(b.left)} to full` : b.pct >= 100 ? (b.finishing ? 'finishing the charge: the system calls it full and still tops it up' : 'charging: the system calls it full') : 'charging, the time to full still being estimated'
      : b.state === 'unknown' ? 'the system does not say whether it charges' : b.pct >= 100 ? 'fully charged, on power' : 'on power, not charging'

// More of each figure, for a pointer resting on it: a heading with the figure in full, then rows of a name and its value (Claude's
// part, the parts of a speed, who uses the most), and for the battery its state in words. Only what the looks gave: a part that is
// not known is left out
// foot: what the figures above it cover, under them
type UsageCard = { title: string; value: string; note?: string; rows: [string, string][]; most?: [string, string][]; foot?: string }
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
    // Busy is time at work at any speed, so a busy graphics processor can draw little; drawing the screen is macOS's own
    // (WindowServer), for every app's window, Claude's too, so it is no one's part
    gpu: f.gpu === undefined ? undefined : {
      title: 'Graphics processor',
      value: `${pctText(f.gpu)}% busy`,
      note: 'Time at work, at any speed',
      rows: [
        ...(f.gpuClaude !== undefined ? [['Claude and what it started', `${pctText(f.gpuClaude)}%`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Drawing', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.gpuMem !== undefined ? [['Graphics memory in use', f.gpuMemTotal ? `${gbText(f.gpuMem)} of ${gbText(f.gpuMemTotal)} GB` : `${gbText(f.gpuMem)} GB`] as [string, string]] : []),
      ],
      most: most(f.gpuTop?.map(([name, n]): [string, number] => [name === 'WindowServer' ? 'macOS drawing the screen' : name, n]), n => `${pctText(n)}%`),
    },
    battery: !b ? undefined : {
      title: 'Battery',
      value: `${batteryShown(b).pct}%`,
      note: upperFirst(batteryNote(b)),
      // The strain on it: what the whole Mac draws, the processors and the graphics processor each, and Claude's part of each. The
      // Mac counts each process's own processor energy, not its graphics power: Claude's graphics is its share of the graphics
      // processor's time times what that draws, and says it is estimated. The screen, memory and storage are no one's part
      rows: [
        ...(f.watts !== undefined ? [['The whole Mac draws', `${wattText(f.watts)} W`] as [string, string]] : []),
        ...(f.wattsCpu !== undefined ? [['Processors, every program', `${wattText(f.wattsCpu)} W`] as [string, string]] : []),
        ...(f.wattsClaude !== undefined ? [[f.wattsCpu !== undefined ? 'Claude of that' : "Claude's processes on the processors", `${wattText(f.wattsClaude)} W`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Graphics, every program', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.wattsGpuClaude !== undefined ? [['Claude of that, estimated', `${wattText(f.wattsGpuClaude)} W`] as [string, string]] : []),
      ],
      ...(f.wattsClaude !== undefined || f.wattsGpuClaude !== undefined
        ? { foot: `Claude: the app, its chats and all their work.${f.wattsGpuClaude === undefined ? ' Graphics is not in its watts.' : ''} The screen, memory and storage count only in the whole.` }
        : {}),
    },
    disk: f.disk === undefined ? undefined : {
      title: 'Disk',
      value: rateText(f.disk).join(' '),
      note: 'Reading and writing together',
      rows: f.diskClaude !== undefined ? [['Claude and what it runs', rateFine(Math.min(f.diskClaude, f.disk))]] : [],
    },
    net: f.net === undefined ? undefined : {
      title: 'Network',
      value: rateText(f.net).join(' '),
      rows: [
        ...(f.netIn !== undefined && f.netOut !== undefined ? [['Download', rateFine(f.netIn)], ['Upload', rateFine(f.netOut)]] as [string, string][] : []),
        // Claude's own, never past the Mac's: nettop counts every interface, tunnels and loopback too, where the totals count the Mac's ports
        ...(f.netInClaude !== undefined && f.netOutClaude !== undefined ? [['Claude downloading', rateFine(f.netIn !== undefined ? Math.min(f.netInClaude, f.netIn) : f.netInClaude)], ['Claude uploading', rateFine(f.netOut !== undefined ? Math.min(f.netOutClaude, f.netOut) : f.netOutClaude)]] as [string, string][] : []),
      ],
    },
  }
}
// A speed in a card, where there is room for small ones: KB/s below a megabyte a second, so an API's trickle does not read 0
const rateFine = (perSecond: number) => (perSecond < 1024 * 1024 ? `${Math.round(perSecond / 1024)} KB/s` : rateText(perSecond).join(' '))
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
// Watts, whole from ten up, a tenth below
const wattText = (w: number) => (w >= 10 ? `${Math.round(w)}` : `${Math.round(w * 10) / 10}`)
// The card, in the bar's own column above the figures: drawn hidden, and shown while the pointer rests on its figure through the
// figure's hover group. The app's lifted hover cards (an absolute Box under a keyed one) were tried and left cards open after the
// pointer had gone on to the next figure; a group is lit and put out by the pointer itself, so one card shows at a time
const usageCardDrawn = (ui: Ui, key: string, card: UsageCard) => {
  const { Box, Text } = ui
  const row = (name: string, value: string, n: number, kind: string) => (
    <Box key={`${key}-${kind}-${n}`} flexDirection="row" justifyContent="space-between" gap={3}>
      <Text dimColor wrap="truncate-end">{name}</Text>
      <Text wrap="truncate-end">{value}</Text>
    </Box>
  )
  return (
    <Box key={`${key}-card`} display="none" hover={{ scope: key, display: 'flex' }} flexDirection="column" gap={1} alignSelf="flex-start" borderStyle="round" borderDimColor paddingX={1} marginBottom={1}>
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
      {card.foot ? <Text key={`${key}-card-foot`} dimColor>{card.foot}</Text> : null}
    </Box>
  )
}

// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network. The pointer resting on a figure lights its group: a faint fill under it, and its card above
const usageDrawn = (ui: Ui, f: UsageFigures) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const { Box, Text } = ui
  if (!table.Svg) return null
  const Svg = table.Svg
  const isHigh = isMemoryHigh(f)
  const words = usageWords(f)
  const cards = usageCards(f)
  const one = (key: string, card: UsageCard | undefined, svg: { source: string; width: number; height: number }, alt: string, value: string, unit: string, color?: string) => (
    // A member of a group must change how it looks, or the desktop app never wires it to the pointer: hence the fill
    <Box key={`usage-${key}`} flexDirection="row" flexShrink={0} alignItems="center" hover={{ scope: `usage-${key}`, backgroundColor: FILL }}>
      <Svg key={`usage-${key}-${svg.source.length}-${hashOf(svg.source)}`} source={svg.source} alt={alt} width={svg.width} height={svg.height} />
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
    </Box>
  )
  return [
    one('memory', cards.memory, usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
    f.cpu === undefined ? null : one('cpu', cards.cpu, usageSvg('cpu', { claude: f.cpuClaude ?? 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
    f.gpu === undefined ? null : one('gpu', cards.gpu, usageSvg('gpu', { claude: f.gpuClaude ?? 0, used: f.gpu }), words.gpu, pctText(f.gpu), '%'),
    f.battery ? one('battery', cards.battery, batterySvg(f.battery), words.battery, `${f.battery.pct}`, `%${batteryAfter(f.battery)}`, isBatteryLow(f.battery) ? USAGE_AMBER : undefined) : null,
    f.disk === undefined ? null : one('disk', cards.disk, usageSvg('disk'), words.disk, rateText(f.disk)[0], ` ${rateText(f.disk)[1]}`),
    f.net === undefined ? null : one('net', cards.net, usageSvg('net'), words.net, rateText(f.net)[0], ` ${rateText(f.net)[1]}`),
  ]
}
// The cards above the figures, one for each figure drawn, all hidden until the pointer rests on their figure
const usageCardsDrawn = (ui: Ui, f: UsageFigures) =>
  (Object.entries(usageCards(f)) as [string, UsageCard | undefined][]).map(([key, card]) => (card ? usageCardDrawn(ui, `usage-${key}`, card) : null))
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
      {f.gpu === undefined || !shown.gpu ? null : [<Text key="g" dimColor>{' gpu'}</Text>, ...meter(f.gpuClaude ?? 0, f.gpu), <Text key="gv">{` ${pctText(f.gpu)}`}</Text>, <Text key="gu" dimColor>%</Text>]}
      {f.battery ? batteryText(ui, f.battery) : null}
      {f.disk === undefined || !shown.disk ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1].replace('B/s', '/s')}</Text>]}
      {f.net === undefined || !shown.net ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1].replace('B/s', '/s')}</Text>]}
    </Text>
  )
}
// The battery in words, short: "bat 85% 4:12" on battery, "bat 62% ↑1:05" charging (↑ and the time to full), "bat 100% finishing"
// while the system calls it full and still tops it up, "bat 100% ac" on power
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
const batteryAfterText = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'plugged' ? ' ac' : b.state === 'charging' ? (!b.left && b.finishing && b.pct >= 100 ? ' finishing' : ` ↑${b.left ? leftText(b.left) : ''}`) : b.left ? ` ${leftText(b.left)}` : ''
// A short mark of a drawing, so a new drawing is a new picture to the app
const hashOf = (text: string) => {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
