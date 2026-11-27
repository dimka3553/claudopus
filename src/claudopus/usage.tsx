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
const lookUsage = async ($: EngineInterface) => {
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
    const r = await runOn($, isWindows ? [...POWERSHELL, USAGE_WINDOWS] : ['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: isWindows ? 15_000 : 5000 }).catch(() => undefined)
    const kept = r?.stdout ? nextKept(base, r.stdout, now, isLinux, isTop, isWindows) : undefined
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
const usageNow = (now: number) => (usageKept && now - usageKept.at < usageEvery() * 6 ? usageKept.figures : undefined)
// The looks of the last minutes for the cards' charts, ending at the newest look, so a drawing between looks draws the same charts
const usageHistory = () => ({ points: usageKept?.history ?? [], at: usageKept?.at ?? 0 })

// What this computer is called in a line about it: the Mac, the PC, the machine
const machineWord = () => thisMac().replace(/^this /, '')
// Claude's own part of each figure, named the same in every place: Claude and every command it started
const CLAUDE_ALL = 'Claude and what it started'
// What each figure says in words, for a reader that cannot see the drawings
const usageWords = (f: UsageFigures) => ({
  memory: `Memory: ${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB in use, ${gbText(f.memClaude)} GB by ${CLAUDE_ALL}`,
  cpu: f.cpu === undefined ? '' : `Processor: ${pctText(f.cpu)}% busy, ${pctText(f.cpuClaude ?? 0)}% by ${CLAUDE_ALL}`,
  disk: f.disk === undefined ? '' : `Disk: ${rateText(f.disk).join(' ')} read and written`,
  net: f.net === undefined ? '' : `Network: ${rateText(f.net).join(' ')} downloaded and uploaded`,
  gpu: f.gpu === undefined ? '' : `Graphics processor: ${pctText(f.gpu)}% busy${f.gpuClaude !== undefined ? `, ${pctText(f.gpuClaude)}% by ${CLAUDE_ALL}` : ''}`,
  battery: f.battery ? `Battery: ${f.battery.pct}%, ${batteryWords(f.battery)}` : '',
})
// Each takes the battery as the bar shows it, so a charge the system calls full or empty has no time beside it
const batteryWords = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery' ? (b.left ? `${leftText(b.left)} left` : 'on battery') : b.state === 'charging' ? (b.left ? `charging, ${leftText(b.left)} to full` : b.finishing ? 'finishing the charge' : 'charging') : b.state === 'plugged' ? 'on power' : "the system doesn't say if it's charging"
// What follows the charge: the time left, the time to full, "finishing" once the system calls it full and still tops it up, or
// nothing on power and while the system still estimates
const batteryAfter = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'plugged' || b.state === 'unknown' ? '' : b.left ? ` ${leftText(b.left)}${b.state === 'charging' ? ' to full' : ' left'}` : b.state === 'charging' && b.finishing && b.pct >= 100 ? ' finishing' : ''

// The battery's state in full, for the line of more: a time only where the bar shows one, and what the system said in its place
const batteryNote = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery'
    ? b.left ? `on battery · about ${leftText(b.left)} left` : read.left ? 'on battery · the system calls it empty' : 'on battery · the system is still working out the time left'
    : b.state === 'charging'
      ? b.left ? `charging · about ${leftText(b.left)} to full` : b.pct >= 100 ? (b.finishing ? 'finishing the charge · the system calls it full and still tops it up' : 'charging · the system calls it full') : 'charging · the system is still working out the time to full'
      : b.state === 'unknown' ? "the system doesn't say if it's charging" : b.pct >= 100 ? 'full · on power' : 'on power · not charging'

// More of each figure, for a pointer resting on it: a heading with the figure in full, then rows of a name and its value (Claude's
// part, the parts of a speed, who uses the most), and for the battery its state in words. Only what the looks gave: a part that is
// not known is left out
type UsageChart = { source: string; width: number; height: number; alt: string; caption: [string, string] }
type UsageCard = { title: string; value: string; note?: string; chart?: UsageChart; rows: [string, string][]; most?: [string, string][] }
const usageCards = (f: UsageFigures, history: { points: UsagePoint[]; at: number } = { points: [], at: 0 }): Record<string, UsageCard | undefined> => {
  const most = (top: UsageTop | undefined, text: (n: number) => string) => (top?.length ? top.map(([name, n]): [string, string] => [name, text(n)]) : undefined)
  const b = f.battery
  // Each card's chart of the last ten minutes: the whole in grey, Claude's part in purple, and the highest it went. A part of the
  // whole reads to its top; a speed or a power to a little over its highest, so a quiet one is not drawn as nothing
  const chart = (title: string, pick: (p: UsagePoint) => [number, number] | undefined, text: (n: number) => string, room?: number): UsageChart | undefined => {
    const points = history.points.flatMap(p => {
      const v = pick(p)
      return v ? [[p.at, v[0], v[1]] as [number, number, number]] : []
    })
    const peak = points.filter(p => history.at - p[0] <= HISTORY_SPAN).reduce((most, p) => Math.max(most, p[1]), 0)
    const svg = chartSvg(points, history.at, room === undefined ? 1 : Math.max(room, peak * 1.15))
    return svg ? { ...svg, alt: `${title}, last 10 minutes: up to ${text(peak)}`, caption: [title === 'Power use' || title === 'Charge' ? `${title}, last 10 minutes` : 'Last 10 minutes', `up to ${text(peak)}`] } : undefined
  }
  const pct = (n: number) => `${pctText(n)}%`
  const isPowerShown = history.points.some(p => p.watts)
  // Into the battery, or out of it while the system says it charges; what the charger gives, of what it can
  const isDraining = !!b && b.state === 'charging' && f.battIn !== undefined && f.battIn < -0.5
  const charge: [string, string][] = !b || b.state === 'battery' || f.battIn === undefined
    ? []
    : f.battIn > 0.5 ? [['Into the battery', `${wattText(f.battIn)} W`]] : f.battIn < -0.5 ? [['Out of the battery', `${wattText(-f.battIn)} W`]] : []
  const charger: [string, string][] = !b || b.state === 'battery' || f.powerIn === undefined ? [] : [['From the charger', f.adapter ? `${wattText(f.powerIn)} of ${wattText(f.adapter)} W` : `${wattText(f.powerIn)} W`]]
  return {
    memory: {
      title: 'Memory',
      value: `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB`,
      chart: chart('Memory', p => p.mem, n => `${gbText(n * f.memTotal)} GB`),
      rows: [[CLAUDE_ALL, `${gbText(f.memClaude)} GB`]],
      most: most(f.memTop, n => `${gbText(n)} GB`),
    },
    cpu: f.cpu === undefined ? undefined : {
      title: 'Processor',
      value: `${pctText(f.cpu)}% busy`,
      chart: chart('Processor', p => p.cpu, pct),
      rows: [...(f.ncpu && f.ncpu > 1 ? [['Cores', `${f.ncpu}`] as [string, string]] : []), [CLAUDE_ALL, `${pctText(f.cpuClaude ?? 0)}%`]],
      most: most(f.cpuTop, n => `${pctText(n)}%`),
    },
    // Busy is time at work at any speed, so a busy graphics processor can draw little; drawing the screen is macOS's own
    // (WindowServer), for every app's window, Claude's too, so it is no one's part. The card is its rows alone, with no words under
    // them on what they cover
    gpu: f.gpu === undefined ? undefined : {
      title: 'Graphics processor',
      value: `${pctText(f.gpu)}% busy`,
      chart: chart('Graphics processor', p => p.gpu, pct),
      rows: [
        ...(f.gpuClaude !== undefined ? [[CLAUDE_ALL, `${pctText(f.gpuClaude)}%`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Power use', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.gpuMem !== undefined ? [['Graphics memory in use', f.gpuMemTotal ? `${gbText(f.gpuMem)} of ${gbText(f.gpuMemTotal)} GB` : `${gbText(f.gpuMem)} GB`] as [string, string]] : []),
      ],
      most: most(f.gpuTop?.map(([name, n]): [string, number] => [name === 'WindowServer' ? 'macOS drawing the screen' : name, n]), n => `${pctText(n)}%`),
    },
    battery: !b ? undefined : {
      title: 'Battery',
      value: `${batteryShown(b).pct}%`,
      note: isDraining ? `Charging, but the battery drains · the ${machineWord()} uses more than the charger gives` : upperFirst(batteryNote(b)),
      // What the Mac draws over time, Claude's part purple; the charge where the Mac tells no power
      chart: isPowerShown ? chart('Power use', p => p.watts, n => `${wattText(n)} W`, 10) : chart('Charge', p => (p.batt !== undefined ? [p.batt / 100, 0] : undefined), pct),
      // The strain on it: what the whole Mac draws, the processors and the graphics processor each, and Claude's part of each. The
      // Mac counts each process's own processor energy, not its graphics power: Claude's graphics is its share of the graphics
      // processor's time times what that draws, and says it is estimated. The screen, memory and storage are no one's part
      rows: [
        ...charge,
        ...charger,
        ...(f.watts !== undefined ? [[`Power use, whole ${machineWord()}`, `${wattText(f.watts)} W`] as [string, string]] : []),
        ...(f.wattsCpu !== undefined ? [['Power use, processors', `${wattText(f.wattsCpu)} W`] as [string, string]] : []),
        ...(f.wattsClaude !== undefined ? [['Claude, processors', `${wattText(f.wattsClaude)} W`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Power use, graphics', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.wattsGpuClaude !== undefined ? [['Claude, graphics', `about ${wattText(f.wattsGpuClaude)} W`] as [string, string]] : []),
      ],
    },
    disk: f.disk === undefined ? undefined : {
      title: 'Disk, read and written',
      value: rateText(f.disk).join(' '),
      chart: chart('Disk', p => p.disk, rateFine, 1024 * 1024),
      rows: f.diskClaude !== undefined ? [[CLAUDE_ALL, rateFine(Math.min(f.diskClaude, f.disk))]] : [],
    },
    net: f.net === undefined ? undefined : {
      title: 'Network',
      value: rateText(f.net).join(' '),
      chart: chart('Network', p => p.net, rateFine, 100 * 1024),
      rows: [
        ...(f.netIn !== undefined && f.netOut !== undefined ? [['Download', rateFine(f.netIn)], ['Upload', rateFine(f.netOut)]] as [string, string][] : []),
        // Claude's own, never past the Mac's: nettop counts every interface, tunnels and loopback too, where the totals count the Mac's ports
        ...(f.netInClaude !== undefined && f.netOutClaude !== undefined ? [[CLAUDE_ALL, `${rateFine(f.netIn !== undefined ? Math.min(f.netInClaude, f.netIn) : f.netInClaude)} down · ${rateFine(f.netOut !== undefined ? Math.min(f.netOutClaude, f.netOut) : f.netOutClaude)} up`]] as [string, string][] : []),
      ],
    },
  }
}
// A speed in a card, where there is room for small ones: KB/s below a megabyte a second, so an API's trickle does not read 0
const rateFine = (perSecond: number) => (perSecond < 1024 * 1024 ? `${Math.round(perSecond / 1024)} KB/s` : rateText(perSecond).join(' '))
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
// Watts, whole from ten up, a tenth below
const wattText = (w: number) => (w >= 10 ? `${Math.round(w)}` : `${Math.round(w * 10) / 10}`)
// A figure's card: one Box placed absolutely and drawn hidden inside the figure's keyed Box, which the desktop app lifts over the
// chat as its own floating card above the figure, kept in the window and shifted sideways at its edges, so showing it moves nothing
// in the chat or the bar (in the bar's column it took room: the chat was pushed up and sprang back, and a tall card hid the figures).
// It holds its words from the start: the app measures a card once as it shows it, and again at each drawing of the bar under a
// resting pointer, and puts it below the figure when it is taller than the room above. A card whose words waited for the figure's
// hover group to light was measured empty, placed just above the figure, then grew down over the figures and the prompt (25 Nov:
// "sometimes on hover it goes below the chat"). Whole, it is placed above whenever the room above is the larger
const usageCardDrawn = (ui: Ui, key: string, card: UsageCard, Svg?: UsageSvgPart) => {
  const { Box, Text } = ui
  const row = (name: string, value: string, n: number, kind: string) => (
    <Box key={`${key}-${kind}-${n}`} flexDirection="row" justifyContent="space-between" gap={3}>
      <Text dimColor wrap="truncate-end">{name}</Text>
      <Text wrap="truncate-end">{value}</Text>
    </Box>
  )
  return (
    // No key and no hover group of its own: the app lifts only a hidden absolute Box shown by the hover of its keyed Box
    <Box position="absolute" top={-1} left={0} display="none" hover={{ display: 'flex' }} flexDirection="column">
      <Box key={`${key}-card`} flexDirection="column" gap={1}>
        <Box key={`${key}-card-head`} flexDirection="row" justifyContent="space-between" gap={3}>
          <Text bold>{card.title}</Text>
          <Text bold>{card.value}</Text>
        </Box>
        {card.note ? <Text key={`${key}-card-note`} dimColor>{card.note}</Text> : null}
        {card.chart && Svg ? (
          <Box key={`${key}-card-chart`} flexDirection="column">
            <Svg key={`${key}-chart-${hashOf(card.chart.source)}`} source={card.chart.source} alt={card.chart.alt} width={card.chart.width} height={card.chart.height} />
            {row(card.chart.caption[0], card.chart.caption[1], 0, 'chart')}
          </Box>
        ) : null}
        {card.rows.length ? <Box key={`${key}-card-rows`} flexDirection="column">{card.rows.map(([name, value], n) => row(name, value, n, 'row'))}</Box> : null}
        {card.most?.length ? (
          <Box key={`${key}-card-most`} flexDirection="column">
            <Text dimColor>Using the most</Text>
            {card.most.map(([name, value], n) => row(name, value, n, 'most'))}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

// The desktop app draws the bar anew whenever anything in it changes (new figures, the work under it, the octopus), and shows again
// each lifted card whose figure's place (its count among the keyed Boxes drawn) held a card that was up as the old drawing went: so
// a card the pointer had just left stayed up with nothing under the pointer to put it away. A run of hidden keyed Boxes before the
// figures, there in every other drawing each bar gets, moves every figure past the places its last drawing had, more than all the
// keyed Boxes of the figures and their cards, so no card is shown again but the one under the pointer. Each bar (a window's, by its
// request) takes turns of its own: with one turn for all, a second bar's drawing in between gave a bar two drawings alike in a row
const USAGE_SPACERS = 120
const usageSpaced = new Map<string, boolean>()
const usageSpacersDrawn = (ui: Ui, bar = '') => {
  const { Box, Text } = ui
  if (usageSpaced.size > 50 && !usageSpaced.has(bar)) usageSpaced.clear()
  const isSpaced = !usageSpaced.get(bar)
  usageSpaced.set(bar, isSpaced)
  return isSpaced ? (
    <Box display="none">
      {Array.from({ length: USAGE_SPACERS }, (_, n) => (
        <Box key={`usage-spacer-${n}`}>
          <Text> </Text>
        </Box>
      ))}
    </Box>
  ) : null
}

// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network. The pointer resting on a figure lights its group: a faint fill under it, and its card above
type UsageSvgPart = (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element
const usageDrawn = (ui: Ui, f: UsageFigures, history = usageHistory()) => {
  const table = ui as Ui & { Svg?: UsageSvgPart }
  const { Box, Text } = ui
  if (!table.Svg) return null
  const Svg = table.Svg
  const isHigh = isMemoryHigh(f)
  const words = usageWords(f)
  const cards = usageCards(f, history)
  const one = (key: string, card: UsageCard | undefined, svg: { source: string; width: number; height: number }, alt: string, value: string, unit: string, color?: string) => (
    // A member of a group must change how it looks, or the desktop app never wires it to the pointer: hence the fill
    <Box key={`usage-${key}`} flexDirection="row" flexShrink={0} alignItems="center" hover={{ scope: `usage-${key}`, backgroundColor: FILL }}>
      <Svg key={`usage-${key}-${svg.source.length}-${hashOf(svg.source)}`} source={svg.source} alt={alt} width={svg.width} height={svg.height} />
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
      {card ? usageCardDrawn(ui, `usage-${key}`, card, Svg) : null}
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
// The battery in words, short: "bat 85% 4h12m" on battery, "bat 62% ↑1h05m" charging (↑ and the time to full), "bat 100% finishing"
// while the system calls it full and still tops it up, "bat 100% on power" on power. Times lose their space, so a phone's line fits
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
  b.state === 'plugged' ? ' on power' : b.state === 'charging' ? (!b.left && b.finishing && b.pct >= 100 ? ' finishing' : ` ↑${b.left ? leftText(b.left).replace(' ', '') : ''}`) : b.left ? ` ${leftText(b.left).replace(' ', '')}` : ''
// A short mark of a drawing, so a new drawing is a new picture to the app
const hashOf = (text: string) => {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
