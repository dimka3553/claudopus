// How Claude uses this computer, for the line above the prompt: looked at every few seconds while work runs, shared by every chat
// through one small file, so a computer with many chats open still looks once. The measuring and the drawings are in hooks/usage.ts

let usageKept: UsageKept | undefined
let usageBusy = false
let usageFile = ''
// The shared file, in the person's own temporary folder (on Linux, their cache folder: /tmp is everyone's)
const usagePathOf = async ($: EngineInterface) => {
  if (usageFile) return usageFile
  const tmp = isLinux ? '' : ((await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  const home = (await $.env.get('HOME')) ?? ''
  usageFile = tmp ? `${tmp}/claudopus-usage.json` : `${home}/.cache/claudopus-usage.json`
  return usageFile
}

// One look when the last is due: a fresh one another chat left is taken as it is
const lookUsage = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (usageBusy || (usageKept && now - usageKept.at < USAGE_EVERY - 500 && now >= usageKept.at)) return
  usageBusy = true
  try {
    const path = await usagePathOf($)
    const shared = keptOf(await $.fs.read(path).catch(() => ''))
    if (shared && now - shared.at < USAGE_EVERY - 500 && now >= shared.at) return void (usageKept = shared)
    const base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept
    const isTop = !isLinux && (!base?.footprint || now - base.footprint.at >= FOOTPRINT_EVERY)
    const r = await $.process.run(['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: 5000 }).catch(() => undefined)
    const kept = r?.stdout ? nextKept(base, r.stdout, now, isLinux) : undefined
    if (!kept) return
    usageKept = kept
    if (isLinux) await $.process.run(['mkdir', '-p', path.replace(/\/[^/]*$/, '')]).catch(() => undefined)
    await $.fs.write(path, JSON.stringify(kept)).catch(() => undefined)
  } finally {
    usageBusy = false
  }
}
// The figures to show, when a look has been had lately
const usageNow = (now: number) => (usageKept && now - usageKept.at < USAGE_EVERY * 6 ? usageKept.figures : undefined)

// What each figure says in words, for a reader that cannot see the drawings
const usageWords = (f: UsageFigures) => ({
  memory: `Memory: ${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB in use, Claude ${gbText(f.memClaude)} GB`,
  cpu: f.cpu === undefined ? '' : `Processor: ${pctText(f.cpu)}% busy, Claude ${pctText(f.cpuClaude ?? 0)}% of the whole`,
  disk: f.disk === undefined ? '' : `Disk: ${rateText(f.disk).join(' ')} read and written`,
  net: f.net === undefined ? '' : `Network: ${rateText(f.net).join(' ')} in and out`,
})

// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network
const usageDrawn = (ui: Ui, f: UsageFigures) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const { Box, Text } = ui
  if (!table.Svg) return null
  const Svg = table.Svg
  const isHigh = isMemoryHigh(f)
  const words = usageWords(f)
  const one = (key: string, svg: { source: string; width: number; height: number }, alt: string, value: string, unit: string, color?: string) => (
    <Box key={key} flexDirection="row" flexShrink={0} alignItems="center">
      <Svg key={`${key}-${svg.source.length}-${hashOf(svg.source)}`} source={svg.source} alt={alt} width={svg.width} height={svg.height} />
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
    </Box>
  )
  return [
    one('usage-memory', usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
    f.cpu === undefined ? null : one('usage-cpu', usageSvg('cpu', { claude: f.cpuClaude ?? 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
    f.disk === undefined ? null : one('usage-disk', usageSvg('disk'), words.disk, rateText(f.disk)[0], ` ${rateText(f.disk)[1]}`),
    f.net === undefined ? null : one('usage-net', usageSvg('net'), words.net, rateText(f.net)[0], ` ${rateText(f.net)[1]}`),
  ]
}
// The line as text, for the terminal, short enough for a phone's: a word for each, and four-cell meters with Claude's cells purple
const USAGE_CELLS = 4
const usageText = (ui: Ui, f: UsageFigures) => {
  const { Text } = ui
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
      <Text color={amber} dimColor={!amber}>GB</Text>
      {f.cpu === undefined ? null : [<Text key="c" dimColor>{' cpu'}</Text>, ...meter(f.cpuClaude ?? 0, f.cpu), <Text key="cv">{` ${pctText(f.cpu)}`}</Text>, <Text key="cu" dimColor>%</Text>]}
      {f.disk === undefined ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1]}</Text>]}
      {f.net === undefined ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1]}</Text>]}
    </Text>
  )
}
// A short mark of a drawing, so a new drawing is a new picture to the app
const hashOf = (text: string) => {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
