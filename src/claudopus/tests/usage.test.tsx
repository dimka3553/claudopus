// The line above the prompt while work runs: how Claude uses the computer, drawn on the desktop and written in the terminal

// A Mac's look as its commands print it, with Claude's app and chat, another app, and how much has moved by the nth look
const psTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.00`
const lookAt = (n: number, anon = 1583261, extra = '') =>
  [
    '@@SELF@@ 1423',
    '@@PS@@',
    `  852     1 686704   ${psTime(10 + n * 10)} /Applications/Claude.app/Contents/MacOS/Claude`,
    ' 1423   852 1745264   1:00.00 /Users/sam/Library/Application Support/Claude/claude-code/2.1.325/x/claude.app/Contents/MacOS/claude',
    `  700     1 400000   ${psTime(10 + n * 15)} /Applications/Safari.app/Contents/MacOS/Safari`,
    '@@VM@@',
    'Mach Virtual Memory Statistics: (page size of 16384 bytes)',
    'Pages wired down:                             207303.',
    'Pages purgeable:                               42324.',
    `Anonymous pages:                             ${anon}.`,
    'Pages occupied by compressor:                 125152.',
    '@@SYS@@',
    '68719476736',
    '10',
    '@@IO@@',
    '              disk0 ',
    '    KB/t xfrs   MB ',
    `   19.03 42547108 ${1000 + n * 300} `,
    '@@NET@@',
    `en0        1500  <Link#15>   02:00:00:00:00:01 1     0 ${n * 5_000_000} 2     0 0     0`,
    extra,
    '@@TOP@@',
    'PID    MEM',
    '852    3000M',
    '1423   400M',
    '',
  ].join('\n')

test('while work runs, the line above the prompt shows memory, the processor, the disk and the network, and nothing of what the work does', async ($, on) => {
  let n = 0
  let anon = 1583261
  const { clock } = world(on, { usage: () => lookAt((n += 1), anon) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // Two looks five seconds apart give the speeds
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const shown = await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  expect(shown).toBe(true)
  // Memory used of the Mac's whole, the processor busy, the disk's and the network's speed, each beside its drawing
  expect((await desk.find({ type: 'Text', text: /^29 GB$/ }))?.text).toBe('29 GB')
  expect((await desk.find({ type: 'Text', text: /^50%$/ }))?.text).toBe('50%')
  expect((await desk.find({ type: 'Text', text: /^1 MB\/s$/ }))?.text).toBe('1 MB/s')
  const drawings = await desk.findAll({ type: 'Svg' })
  // The octopus, then memory and the processor with Claude's part in purple, the disk and the network
  expect(drawings.length).toBeGreaterThanOrEqual(4)
  const memory = drawings.find(d => String(d.props.alt).startsWith('Memory'))
  expect(memory?.props.alt).toBe('Memory: 29 of 64 GB in use, Claude 3.3 GB')
  expect(String(memory?.props.source)).toContain('#8A63F0')
  expect(drawings.find(d => String(d.props.alt).startsWith('Processor'))?.props.alt).toBe('Processor: 50% busy, Claude 20% of the whole')
  expect(await desk.find({ type: 'Text', text: /fix the nose|Fix the nose/ })).toBeUndefined()
  await desk.unmount()

  // The terminal draws no pictures: the same line in words, with small meters of cells
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  const line = await term.find({ type: 'Text', text: /^mem/ })
  expect(line?.text).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% disk 63M\/s net 1M\/s$/)
  expect(line?.props.wrap).toBe('truncate-end')
  await term.unmount()

  // Memory past nine tenths of the whole turns amber
  anon = 3_600_000
  await clock.advance(6000)
  await clock.advance(1000)
  const high = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const amber = await until(async () => (await high.find({ type: 'Text', text: /^59 GB$/ })) ?? undefined)
  expect(amber?.props.color).toBe('#E5A50A')
  await high.unmount()
})

test('a look that gives nothing waits as long as one that works, so a broken look is not tried each second', async ($, on) => {
  const asked: string[] = []
  let isBroken = true
  const { clock } = world(on, { usage: script => (asked.push(script), isBroken ? '' : lookAt(asked.length)) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  for (let s = 0; s < 9; s++) await clock.advance(1000)
  // Nine seconds of a broken look: tried twice, five seconds apart, not each second, and top asked only the first time
  expect(asked.length).toBe(2)
  expect(asked.map(script => script.includes('top -l'))).toEqual([true, false])
  isBroken = false
  for (let s = 0; s < 6; s++) await clock.advance(1000)
  expect(asked.length).toBe(3)
  expect(asked[2]?.includes('top -l')).toBe(false)
})

// What the Mac's own commands print for the graphics processor and the battery, in each case the bar must tell apart
const gpuAt = (pct: number) => `@@GPU@@\n"Device Utilization %"=${pct}`
const batt = (line: string) => `@@BATT@@\nNow drawing from 'Battery Power'\n -InternalBattery-0 (id=22872163)\t${line} present: true`
const BATTERIES: { name: string; extra: string; desk: string[]; term: RegExp; alt: string }[] = [
  { name: 'on battery with a time left', extra: `${gpuAt(37)}\n${batt('85%; discharging; 4:12 remaining')}`, desk: ['37%', '85% 4:12 left'], term: / gpu[▰▱]{3} 37% bat 85% 4:12 disk/, alt: 'Battery: 85%, 4:12 left' },
  { name: 'on battery while the system still estimates', extra: batt('64%; discharging; (no estimate)'), desk: ['64%'], term: / bat 64% disk/, alt: 'Battery: 64%, on battery' },
  { name: 'charging', extra: batt('62%; charging; 1:05 remaining'), desk: ['62% 1:05 to full'], term: / bat 62% ↑1:05 disk/, alt: 'Battery: 62%, charging, 1:05 to full' },
  { name: 'fully charged on power', extra: `@@BATT@@\nNow drawing from 'AC Power'\n -InternalBattery-0 (id=22872163)\t100%; charged; 0:00 remaining present: true`, desk: ['100%'], term: / bat 100% ac disk/, alt: 'Battery: 100%, on power' },
  { name: 'low on battery', extra: batt('12%; discharging; 0:41 remaining'), desk: ['12% 0:41 left'], term: / bat 12% 0:41 disk/, alt: 'Battery: 12%, 0:41 left' },
]
for (const one of BATTERIES)
  test(`the bar shows the battery as the system reports it: ${one.name}`, async ($, on) => {
    let n = 0
    const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, one.extra) })
    await $.session.start(start)
    await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
    await clock.advance(1000)
    await clock.advance(6000)
    await clock.advance(1000)
    const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
    await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
    for (const text of one.desk) expect((await desk.find({ type: 'Text', text: new RegExp(`^${text}$`) }))?.text).toBe(text)
    const drawings = await desk.findAll({ type: 'Svg' })
    expect(drawings.find(d => String(d.props.alt).startsWith('Battery'))?.props.alt).toBe(one.alt)
    // Never a figure the system did not give
    if (/no estimate|charged/.test(one.extra)) expect(await desk.find({ type: 'Text', text: /\d:\d\d (left|to full)/ })).toBeUndefined()
    if (one.name === 'low on battery') expect((await desk.find({ type: 'Text', text: /^12% 0:41 left$/ }))?.props.color).toBe('#E5A50A')
    await desk.unmount()
    const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
    expect((await term.find({ type: 'Text', text: /^mem/ }))?.text).toMatch(one.term)
    await term.unmount()
  })

test('a computer with no battery shows none, and a desktop plugged into a UPS does not take it for its own', async ($, on) => {
  let n = 0
  const ups = "@@BATT@@\nNow drawing from 'AC Power'\n -CP1500PFCLCDa (id=1234)\t100%; charged; 0:00 remaining present: true"
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, ups) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  expect((await desk.findAll({ type: 'Svg' })).find(d => String(d.props.alt).startsWith('Battery'))).toBeUndefined()
  expect(await desk.find({ type: 'Text', text: /%/ })).toBeDefined()
  expect(await desk.find({ type: 'Text', text: /100%/ })).toBeUndefined()
  await desk.unmount()
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect((await term.find({ type: 'Text', text: /^mem/ }))?.text).not.toMatch(/bat|gpu/)
  await term.unmount()
})

test('a pointer resting on a figure shows its card: who uses the most, the parts of a speed, the battery in full', async ($, on) => {
  let n = 0
  const extra = `${gpuAt(37)}\n"In use system memory"=1288490188\n${batt('85%; discharging; 4:12 remaining')}`
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, extra) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  const cards: Record<string, string[]> = {
    memory: ['Memory', '29 of 64 GB', 'Claude and what it started', '3.3 GB', 'Using the most', 'Safari', '0.4 GB'],
    cpu: ['Processor', '50% busy', 'Cores', '10', 'Claude and what it started', '20%', 'Using the most', 'Safari', '30%'],
    gpu: ['Graphics processor', '37% busy', 'Its memory in use', '1.2 GB'],
    battery: ['Battery', '85%', 'On battery, about 4:12 left'],
    disk: ['Disk', '63 MB/s', 'Read and written together', 'Disks', 'disk0'],
    net: ['Network', '1 MB/s', 'In', 'Out', 'Connections', 'en0'],
  }
  // The drawn tree as the surface gets it: each element's props, its hover, its children
  type El = { type?: string; props?: Record<string, unknown> & { key?: string; children?: unknown }; hover?: Record<string, unknown>; children?: unknown }
  const drawn: unknown = await desk.drawn()
  const kids = (el: El): El[] => [el.children, el.props?.children].flatMap(c => (Array.isArray(c) ? c : c && typeof c === 'object' ? [c] : [])) as El[]
  const find = (node: unknown, key: string): El | undefined => {
    if (!node || typeof node !== 'object') return undefined
    if (Array.isArray(node)) return node.map(n => find(n, key)).find(Boolean)
    const el = node as El
    return el.props?.key === key ? el : kids(el).map(k => find(k, key)).find(Boolean)
  }
  const textOf = (node: unknown): string[] => (typeof node === 'string' ? [node] : !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(textOf) : kids(node as El).flatMap(textOf))
  for (const [key, parts] of Object.entries(cards)) {
    const figure = find(drawn, `usage-${key}`)
    // The figure lights a faint fill under a resting pointer: a hover the app draws, so it is no bare group name
    expect(Object.keys(figure?.hover ?? {})).toEqual(['backgroundColor'])
    // Its card is the app's own hover card: placed absolutely inside the figure's keyed Box, hidden, shown on hover, and in no group,
    // which the app would leave in the bar's own line instead of lifting it over the chat
    const card = figure && kids(figure).find(k => k.props?.position === 'absolute')
    expect(card?.props?.position).toBe('absolute')
    expect(card?.props?.display).toBe('none')
    expect(card?.hover).toEqual({ display: 'flex' })
    for (const part of parts) expect(textOf(card)).toContain(part)
  }
  // The bar stays one line: nothing is added above the figures
  expect(find(drawn, 'usage-more-memory')).toBeUndefined()
  await desk.unmount()
})

test('in a narrow terminal a figure that does not fit is left out whole, the network and the disk first, never the battery cut', async ($, on) => {
  let n = 0
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, `${gpuAt(37)}\n${batt('85%; discharging; 4:12 remaining')}`) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const line = async (bodyColumns: number) => {
    const term = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns }, surface: 'terminal' } as never)
    await until(async () => ((await term.find({ type: 'Text', text: /^mem/ })) ? true : undefined))
    const text = (await term.find({ type: 'Text', text: /^mem/ }))?.text ?? ''
    await term.unmount()
    return text
  }
  // A phone's 50 columns: memory, the processor and the battery whole; a little more room, the graphics processor too
  expect(await line(44)).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% bat 85% 4:12$/)
  expect(await line(50)).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% gpu[▰▱]{3} 37% bat 85% 4:12$/)
  expect(await line(80)).toMatch(/bat 85% 4:12 disk 63M\/s net 1M\/s$/)
})
