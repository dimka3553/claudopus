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
  expect(memory?.props.alt).toBe('Memory: 29 of 64 GB in use, 3.3 GB by Claude and what it started')
  expect(String(memory?.props.source)).toContain('#8A63F0')
  expect(drawings.find(d => String(d.props.alt).startsWith('Processor'))?.props.alt).toBe('Processor: 50% busy, 20% by Claude and what it started')
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

// On battery the computer is looked at every 15 seconds, not 5, and top once in five minutes, as the disk's look every half minute,
// which every chat makes, tells
test('on battery the computer is looked at a third as often, and top once in five minutes, as each look costs the processor', async ($, on) => {
  const asked: string[] = []
  const { clock, files } = world(on, { usage: script => (asked.push(script), lookAt(asked.length)) })
  files.set('df', "/dev/disk3s1s1 971350180 900000000 70000000 93% /System/Volumes/Data\n@@POWER@@\nNow drawing from 'Battery Power'\n -InternalBattery-0 (id=22872163)\t85%; discharging; 4:12 remaining present: true\n")
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // (the disk is looked at a few seconds after the load: from the next look on, the battery is known)
  for (let s = 0; s < 7; s++) await clock.advance(1000)
  expect(asked.length).toBeGreaterThan(0)
  const before = asked.length
  for (let s = 0; s < 20 && asked.length === before; s++) await clock.advance(1000)
  const first = asked.length
  expect(first).toBe(before + 1)
  for (let s = 0; s < 13; s++) await clock.advance(1000)
  expect(asked.length - first).toBe(0)
  for (let s = 0; s < 3; s++) await clock.advance(1000)
  expect(asked.length - first).toBe(1)
  for (let s = 0; s < 4; s++) await clock.advance(60_000)
  expect(asked.filter(script => script.includes('top -l')).length).toBe(1)
})

// What the Mac's own commands print for the graphics processor and the battery, in each case the bar must tell apart
const gpuAt = (pct: number) => `@@GPU@@\n"Device Utilization %"=${pct}`
const batt = (line: string) => `@@BATT@@\nNow drawing from 'Battery Power'\n -InternalBattery-0 (id=22872163)\t${line} present: true`
const ac = (line: string) => `@@BATT@@\nNow drawing from 'AC Power'\n -InternalBattery-0 (id=22872163)\t${line} present: true`
const BATTERIES: { name: string; extra: string; desk: string[]; term: RegExp; alt: string }[] = [
  { name: 'on battery with a time left', extra: `${gpuAt(37)}\n${batt('85%; discharging; 4:12 remaining')}`, desk: ['37%', '85% 4h 12m left'], term: / gpu[▰▱]{3} 37% bat 85% 4h12m disk/, alt: 'Battery: 85%, 4h 12m left' },
  { name: 'on battery while the system still estimates', extra: batt('64%; discharging; (no estimate)'), desk: ['64%'], term: / bat 64% disk/, alt: 'Battery: 64%, on battery' },
  { name: 'charging', extra: batt('62%; charging; 1:05 remaining'), desk: ['62% 1h 05m to full'], term: / bat 62% ↑1h05m disk/, alt: 'Battery: 62%, charging, 1h 05m to full' },
  { name: 'fully charged on power', extra: `@@BATT@@\nNow drawing from 'AC Power'\n -InternalBattery-0 (id=22872163)\t100%; charged; 0:00 remaining present: true`, desk: ['100%'], term: / bat 100% on power disk/, alt: 'Battery: 100%, on power' },
  { name: 'low on battery', extra: batt('12%; discharging; 0:41 remaining'), desk: ['12% 41m left'], term: / bat 12% 41m disk/, alt: 'Battery: 12%, 41m left' },
  // macOS calls the charge 100% while it still tops the cells up, and still gives a time to full: the time beside 100% is dropped
  { name: 'called full while it finishes the charge', extra: ac('100%; finishing charge; 0:36 remaining'), desk: ['100% finishing'], term: / bat 100% finishing disk/, alt: 'Battery: 100%, finishing the charge' },
  { name: 'called full while it still says charging', extra: ac('100%; charging; 0:12 remaining'), desk: ['100%'], term: / bat 100% ↑ disk/, alt: 'Battery: 100%, charging' },
  { name: 'nearly full, finishing the charge', extra: ac('99%; finishing charge; 0:05 remaining'), desk: ['99% 5m to full'], term: / bat 99% ↑5m disk/, alt: 'Battery: 99%, charging, 5m to full' },
  { name: 'held at 80% by optimised charging, or on a charger too weak to charge', extra: ac('80%; AC attached; not charging'), desk: ['80%'], term: / bat 80% on power disk/, alt: 'Battery: 80%, on power' },
  { name: 'charging while the system still estimates', extra: ac('45%; charging; (no estimate)'), desk: ['45%'], term: / bat 45% ↑ disk/, alt: 'Battery: 45%, charging' },
  // The low end the same way: a charge the system calls 0% has no time left beside it
  { name: 'called empty with a time left', extra: batt('0%; discharging; 0:09 remaining'), desk: ['0%'], term: / bat 0% disk/, alt: 'Battery: 0%, on battery' },
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
    if (/no estimate|charged|\t(100|0)%|not charging/.test(one.extra)) expect(await desk.find({ type: 'Text', text: /\dm (left|to full)/ })).toBeUndefined()
    if (one.name === 'low on battery') expect((await desk.find({ type: 'Text', text: /^12% 41m left$/ }))?.props.color).toBe('#E5A50A')
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
  // A third look, so every figure has two to chart
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.findAll({ type: 'Svg' })).some(d => /^Disk, last 10 minutes/.test(String(d.props.alt))) ? true : undefined))
  const cards: Record<string, string[]> = {
    memory: ['Memory', '29 of 64 GB', 'Claude and what it started', '3.3 GB', 'Using the most', 'Safari', '0.4 GB'],
    cpu: ['Processor', '50% busy', 'Cores', '10', 'Claude and what it started', '20%', 'Using the most', 'Safari', '30%'],
    gpu: ['Graphics processor', '37% busy', 'Graphics memory in use', '1.2 GB'],
    battery: ['Battery', '85%', 'On battery · about 4h 12m left', 'Charge, last 10 minutes', 'up to 85%'],
    disk: ['Disk, read and written', '63 MB/s'],
    net: ['Network', '1 MB/s', 'Download', 'Upload'],
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
  const parentOf = (node: unknown, key: string): El | undefined => {
    if (!node || typeof node !== 'object') return undefined
    if (Array.isArray(node)) return node.map(n => parentOf(n, key)).find(Boolean)
    const el = node as El
    return kids(el).some(k => k.props?.key === key) ? el : kids(el).map(k => parentOf(k, key)).find(Boolean)
  }
  for (const [key, parts] of Object.entries(cards)) {
    const figure = find(drawn, `usage-${key}`)
    // The figure lights its group and a faint fill under a resting pointer: a group member whose hover changes nothing is never wired
    // to the pointer by the desktop app
    expect(figure?.hover?.scope).toBe(`usage-${key}`)
    expect(Object.keys(figure?.hover ?? {}).sort()).toEqual(['backgroundColor', 'scope'])
    // The card holds its words from the start, never waiting for the group to light them: the app measures a card as it shows it,
    // so one measured empty was placed low and grew down over the figures and the prompt
    const card = find(drawn, `usage-${key}-card`)
    expect(card?.props?.display).toBeUndefined()
    expect(card?.hover).toBeUndefined()
    for (const part of parts) expect(textOf(card)).toContain(part)
    // Its chart of the last ten minutes, the whole and Claude's part, with the highest it went: drawn from the looks the bar had
    // anyway
    const chart = find(drawn, `usage-${key}-card-chart`)
    const svg = kids(chart ?? {}).find(k => k.type === 'Svg')
    expect([key, String(svg?.props?.alt)]).toEqual([key, expect.stringMatching(/, last 10 minutes: up to \d/)])
    expect(svg?.props?.source).toMatch(/<path d="M[\d.]+ 30L/)
    expect(textOf(chart)).toEqual(expect.arrayContaining([expect.stringMatching(/[Ll]ast 10 minutes$/), expect.stringMatching(/^up to \d/)]))
    // The card floats over the chat, taking no room, so nothing in the chat or the bar moves when it shows: an absolute Box drawn
    // hidden in the figure's keyed Box and shown by its hover, with no key or group of its own, which the desktop app lifts above
    // the figure as its own card, kept in the window
    const lifted = parentOf(drawn, `usage-${key}-card`)
    expect(lifted?.props?.position).toBe('absolute')
    expect(lifted?.props?.display).toBe('none')
    expect(lifted?.props?.key).toBeUndefined()
    expect(lifted?.hover).toEqual({ display: 'flex' })
    expect(kids(figure ?? {})).toContain(lifted)
  }
  // Nothing in the bar's own flow but its row: no card above the figures to push the chat up or the figures out of the bar
  const inFlow = (node: unknown): El[] =>
    !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(inFlow) : (node as El).props?.position === 'absolute' ? [] : [node as El, ...kids(node as El).flatMap(inFlow)]
  expect(inFlow(drawn).filter(k => k.props?.key?.endsWith('-card'))).toEqual([])
  await desk.unmount()
})

test('each drawing of the bar moves the figures past the places they had, so the app shows again no card the pointer has left', async ($, on) => {
  let n = 0
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, `${gpuAt(37)}\n${batt('85%; discharging; 4:12 remaining')}`) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  // The hidden keyed Boxes before the figures, there in every other drawing: more than the figures and their cards hold, so no
  // figure's card takes a place a card had in the drawing before
  const spacers = async () => (JSON.stringify(await desk.drawn()).match(/"key":"usage-spacer-\d+"/g) ?? []).length
  const keyed = async () => (JSON.stringify(await desk.drawn()).match(/"key":"usage-(?!spacer)[^"]*"/g) ?? []).length
  const first = await spacers()
  expect(await keyed()).toBeLessThan(120)
  await clock.advance(6000)
  await clock.advance(1000)
  expect(await until(async () => ((await spacers()) !== first ? true : undefined))).toBe(true)
  expect([first, await spacers()].sort((a, b) => a - b)).toEqual([0, 120])
  // and a drawing for anything else, here more work under the bar, with the same figures
  const before = await spacers()
  await $.agent.spawn({ ...spawn, prompt: 'fix the ears' } as never)
  expect(await until(async () => ((await spacers()) !== before ? true : undefined))).toBe(true)
  // Each bar takes turns of its own: another window's bar drawn in between, as the test kit's drawings came in pairs alike, leaves
  // this one's next drawing moved past its last all the same
  const other = await $.ui.mount({ ...BAND, requestId: 'another-window', surface: 'desktop' } as never)
  for (const _ of [1, 2, 3]) {
    const was = await spacers()
    await other.redraw()
    await desk.redraw()
    expect([was, await spacers()].sort((a, b) => a - b)).toEqual([0, 120])
  }
  await other.unmount()
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
  expect(await line(44)).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% bat 85% 4h12m$/)
  expect(await line(50)).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% gpu[▰▱]{3} 37% bat 85% 4h12m$/)
  expect(await line(80)).toMatch(/bat 85% 4h12m disk 63M\/s net 1M\/s$/)
})
test('in a phone-narrow terminal the word for a charge the system calls full while it finishes is shown whole', async ($, on) => {
  let n = 0
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, `${gpuAt(37)}\n${ac('100%; finishing charge; 0:00 remaining')}`) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  const term = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 44 }, surface: 'terminal' } as never)
  await until(async () => ((await term.find({ type: 'Text', text: /^mem/ })) ? true : undefined))
  expect((await term.find({ type: 'Text', text: /^mem/ }))?.text).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% bat 100% finishing$/)
  await term.unmount()
  // and the line of more says what the system said, with no estimate it did not give
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  // Its card says it in full
  expect(await desk.find({ type: 'Text', text: 'Finishing the charge · the system calls it full and still tops it up' })).toBeDefined()
  await desk.unmount()
})

test('the battery card says what goes into the battery from what the charger gives, says so plainly when it drains while charging, and what the Mac draws, the processors and graphics each, and Claude\'s part of each, with no paragraph under them', async ($, on) => {
  let n = 0
  // Charging, 5 A into the battery at 12 V of the 88 W the charger gives; then the Mac draws more and the battery gives 1 A
  let draining = false
  // Each look: Claude's renderer a quarter of the graphics time, Safari the rest; Claude's chat 20 J a look, the
  // processors 40 J, the graphics processor 5 J
  const power = (k: number) =>
    [
      gpuAt(60),
      ac('94%; charging; (no estimate)'),
      '@@POWER@@',
      '"Watts"=94',
      '"SystemLoad"=80000',
      '"SystemPowerIn"=88000',
      '"Voltage" = 12000',
      `"InstantAmperage" = ${draining ? (2n ** 64n - 1000n).toString() : '5000'}`,
      '@@GPUP@@',
      `      "AppUsage" = ({"API"="Metal","accumulatedGPUTime"=${k * 1e9}})`,
      '      "IOUserClientCreator" = "pid 852, Claude"',
      `      "AppUsage" = ({"API"="Metal","accumulatedGPUTime"=${k * 3e9}})`,
      '      "IOUserClientCreator" = "pid 700, Safari"',
      '@@RU@@',
      `1423 0 0 ${k * 20e9}`,
      `E ${k * 40e9} ${k * 5e9}`,
    ].join('\n')
  const { clock } = world(on, { usage: () => lookAt((n += 1), 1583261, power(n)) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await clock.advance(6000)
  await clock.advance(1000)
  // A third look, so the power has two to chart
  await clock.advance(6000)
  await clock.advance(1000)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: 'Power use, whole Mac' })) ? true : undefined))
  for (const text of ['Into the battery', '60 W', 'From the charger', '88 of 94 W', 'Power use, whole Mac', '28 W', 'Power use, processors', 'Claude, processors', 'Power use, graphics', 'Claude, graphics', /^about [\d.]+ W$/, 'Charging · the system is still working out the time to full'])
    expect(await desk.find({ type: 'Text', text })).toBeDefined()
  // The chart is the power the Mac draws over the last ten minutes, Claude's part in purple
  expect((await desk.findAll({ type: 'Svg' })).find(d => /^Power use, last 10 minutes: up to 28 W$/.test(String(d.props.alt)))?.props.source).toContain('#8A63F0')
  draining = true
  await clock.advance(6000)
  await clock.advance(1000)
  await until(async () => ((await desk.find({ type: 'Text', text: 'Out of the battery' })) ? true : undefined))
  for (const text of ['Charging, but the battery drains · the Mac uses more than the charger gives', '12 W', '100 W']) expect(await desk.find({ type: 'Text', text })).toBeDefined()
  expect(await desk.find({ type: 'Text', text: 'Into the battery' })).toBeUndefined()
  expect(await desk.find({ type: 'Text', text: "Claude's processors draw" })).toBeUndefined()
  // The cards are their rows alone: no paragraph under them on what the figures cover, and no line on what busy means
  expect(await desk.find({ type: 'Text', text: /^Claude: the app/ })).toBeUndefined()
  expect(await desk.find({ type: 'Text', text: 'Time at work, at any speed' })).toBeUndefined()
  // The graphics card: what it draws, and who uses it most
  for (const text of ['Power use', 'Safari', '45%', '15%']) expect(await desk.find({ type: 'Text', text })).toBeDefined()
  await desk.unmount()
})

test("a task's heavy command that must wait, while the Mac is busy and another of the chat's runs, is refused at once with why and what it waits for, a helper's as a task's: no place is kept for it, its card says nothing of a turn, however long it waits it is never let through for that, and nothing starts its work again or sends it later, so it runs when its task sends it again once there is room; a watch in the background for that room is allowed; one with nothing else heavy running, or with the setting at Never, runs at once (16 Nov: ten tasks drove headless browsers on one Mac at once)", SLOW, async ($, on) => {
  let n = 0
  let load = 60
  const { clock, files, appended, resumed } = world(on, { usage: () => lookAt((n += 1), 1583261, `@@LOAD@@\n{ ${load}.00 50.00 40.00 }`) })
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot every page', wait: false, origin: composer })
  for (const description of ['Shoot the pages', 'Shoot the cards', 'Shoot the menus']) await $.agent.spawn({ ...spawn, description, prompt: description } as never)
  const shoot = (id: string, agentId: string, description: string, isBackground = false) =>
    $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command: `cd /w && npx playwright screenshot http://localhost:3000/${agentId} ${agentId}.png`, description, ...(isBackground ? { run_in_background: true } : {}) } as never) as Promise<{ deny?: string }>
  // Load 60 on 10 cores: the first heavy command still starts at once, as nothing else heavy of the chat's runs
  expect((await shoot('s1', 'a1', 'Take the page shots', true)).deny).toBeUndefined()
  // A second and a third are refused at once, each told why and what it waits for, and neither a place in a line nor a later start
  const HELD = (what: string) => new RegExp(`^Not run: the Mac is busy \\(load 60 on 10 cores, .* GB memory in use\\), and "${what}" is a heavy command, so it waits for "Take the page shots" to end\\. Do what does not need it, and send the same command again once one of those has ended, or the Mac has room\\.$`)
  const second = (await shoot('s2', 'a2', 'Take the card shots')).deny
  expect(second).toMatch(HELD('Take the card shots'))
  expect((await shoot('s3', 'a3', 'Take the menu shots')).deny).toMatch(HELD('Take the menu shots'))
  // The same command sent again while the Mac is busy is refused in the same words: it has no place to keep
  expect((await shoot('s2b', 'a2', 'Take the card shots')).deny).toBe(second)
  // A helper's is refused as a task's is
  await $.agent.spawn({ ...spawn, description: 'Shoot the footer', prompt: 'footer', parentAgentId: 'a1' } as never)
  expect((await shoot('s9', 'a4', 'Take the footer shots')).deny).toMatch(HELD('Take the footer shots'))
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const all = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return all
  }
  // No card says it waits its turn: the tasks are at work as before, with no row for the refused command
  const QUEUE = /less busy|in line|its turn|room on the Mac|starts Claude again/
  const held = await texts()
  expect(held.filter(text => QUEUE.test(text))).toEqual([])
  expect(held.some(text => /Take the (card|menu|footer) shots/.test(text))).toBe(false)
  expect(held.some(text => /^Shoot the cards$/.test(text))).toBe(true)
  // To wait for the room, a watch sent to the background is allowed and is a row on its card; the same wait held open is not
  const watch = { tool: 'Bash', agentId: 'a2', command: 'until [ -f /w/a1.png ]; do sleep 10; done', description: 'Watch for the page shots to end' }
  expect(((await $.tool.call({ ...watch, tool_use_id: 'w0' } as never)) as { deny?: string }).deny).toContain('this command only waits, and held open it keeps you from everything else')
  expect(((await $.tool.call({ ...watch, tool_use_id: 'w1', run_in_background: true } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(await until(async () => ((await texts()).some(text => /^Watch for the page shots to end/.test(text)) || undefined))).toBe(true)
  // A step that ends starts nothing, and however long the Mac stays busy the command is never let through for having waited
  await $.turn.complete({ answer: 'Waiting for room.', durationMs: 1, isAborted: false, turnId: 't-a3', reason: 'answer', agentId: 'a3' } as never)
  const sent = () => [...appended, ...resumed].filter(line => /turn|the Mac has room|has waited|[Ss]end it again/.test(line))
  for (let k = 0; k < 16; k++) await clock.advance(60_000)
  expect((await shoot('s3b', 'a3', 'Take the menu shots')).deny).toMatch(HELD('Take the menu shots'))
  // The load falls: nobody is started again or told, and the command runs when its task sends it again
  load = 3
  for (let k = 0; k < 10; k++) await clock.advance(6000)
  expect(sent()).toEqual([])
  expect((await texts()).filter(text => QUEUE.test(text))).toEqual([])
  expect((await shoot('s2c', 'a2', 'Take the card shots')).deny).toBeUndefined()
  // Busy again, it is refused again; with the setting at Never, a heavy command runs at once however busy the Mac is
  load = 60
  await clock.advance(6000)
  expect((await shoot('s4', 'a3', 'Take the header shots')).deny).toMatch(/^Not run: the Mac is busy \(load 60 on 10 cores, .*, and "Take the header shots" is a heavy command, so it waits for /)
  ownSet(files, 'config.json', JSON.stringify({ heavy: 'never' }))
  expect((await shoot('s5', 'a3', 'Take the header shots')).deny).toBeUndefined()
})

// 19 Nov: the person's Mac had under 1 GB free, with 205 copies Chrome made of itself as tasks drove it without a window
test("a disk nearly full says so at the top of the panel with Free up space and a notification once; under 5 GB a task's download, install, build or browser command is refused at once with why, and others run; a task never starts the person's own Chrome without a window", SLOW, async ($, on) => {
  const { clock, files, own, notified } = world(on)
  // (heavy commands never wait their turn here: only the disk holds them)
  ownSet(files, 'config.json', JSON.stringify({ heavy: 'never' }))
  const df = (gb: number) => files.set('df', `/dev/disk3s1s1 971350180 900000000 ${Math.round(gb * 1024 * 1024)} 97% /System/Volumes/Data\n`)
  df(80)
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot every page', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Shoot the pages', prompt: 'shoot' } as never)
  const bash = async (id: string, command: string, description: string) => ((await $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command, description, run_in_background: true } as never)) as { deny?: string }).deny
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const warning = () => pane.find({ type: 'Text', text: /disk space left/ })
  // Plenty left: nothing is said, and every command runs
  await clock.advance(6_000)
  expect(await warning()).toBeUndefined()
  expect(await bash('b1', 'cd /w && npm run build', 'Build the site')).toBeUndefined()
  // Under 20 GB the panel says so, with its one press, and the person is told once
  df(12)
  await clock.advance(61_000)
  expect((await until(warning))?.text).toBe('Your Mac has 12 GB of disk space left. Free up space?')
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).toContain('Free up space')
  expect(await bash('b2', 'curl -L -o /w/scans.zip https://example.com/scans.zip', 'Download the scans')).toBeUndefined()
  // Under 5 GB a download, an install, a build and a browser command are refused, with why; a small command runs
  df(3.2)
  await clock.advance(31_000)
  expect((await until(async () => ((await warning())?.text?.includes('3.2') ? warning() : undefined)))?.text).toBe('Your Mac has 3.2 GB of disk space left. Free up space?')
  const FULL = (what: string) => new RegExp(`^Not run: the Mac has 3\\.2 GB of disk space left, and "${what}" can fill it\\. .* once more than 5 GB is free\\.`)
  expect(await bash('b3', 'curl -L -o /w/scans.zip https://example.com/scans.zip', 'Download the scans')).toMatch(FULL('Download the scans'))
  expect(await bash('b4', 'cd /w && npm install', 'Install the packages')).toMatch(FULL('Install the packages'))
  expect(await bash('b5', 'cd /w && npm run build', 'Build the site')).toMatch(FULL('Build the site'))
  expect(await bash('b6', 'cd /w && npx playwright screenshot http://localhost:3000 a.png', 'Take the page shots')).toMatch(FULL('Take the page shots'))
  expect(await bash('b7', 'ls /w', 'List the site')).toBeUndefined()
  expect(notified.filter(one => /disk space/.test(one))).toEqual(['Your Mac is almost out of disk space | 12 GB left. Free up space from the Claudopus panel.'])
  // Free up space starts the tidy at once, with the caches, and says what it freed once its run ends
  await pane.press({ key: String((await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Free up space')?.key) })
  expect(own.filter(one => String(one[5] ?? '').endsWith('/bin/tidy')).map(one => one.slice(6))).toEqual([['--now', '--deep', MEMORY]])
  expect((await until(() => pane.find({ type: 'Text', text: 'Freeing up space' })))?.text).toBe('Freeing up space')
  files.set(`${MEMORY}/tidy/last.json`, JSON.stringify({ at: clock.now(), freed: 9 * 1024 ** 3 }))
  df(12.2)
  await clock.advance(31_000)
  expect((await until(() => pane.find({ type: 'Text', text: /^Freed/ })))?.text).toBe('Freed 9 GB')
  // With room again it goes, and nobody was told twice
  df(40)
  await clock.advance(31_000)
  expect(await until(async () => ((await warning()) ? undefined : true))).toBe(true)
  expect(await bash('b8', 'cd /w && npm run build', 'Build the site')).toBeUndefined()
  expect(notified.filter(one => /disk space/.test(one))).toHaveLength(1)
  // The person's own Chrome started without a window is refused at any time, written in a command or in the script it runs
  const COPIED = /^Not run: this starts your own Google Chrome app without a window\. Each start makes a copy of the whole app on the disk/
  expect(await bash('c1', '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/w/a.png http://localhost:3000', 'Take a shot')).toMatch(COPIED)
  expect(await bash('c2', '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --headless --print-to-pdf=/w/a.pdf http://localhost:3000', 'Print the page')).toMatch(COPIED)
  files.set('/w/shoot.mjs', "import puppeteer from 'puppeteer'\nconst b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })")
  expect(await bash('c3', 'cd /w && node shoot.mjs', 'Take the shots')).toMatch(COPIED)
  files.set('/w/shot.py', "from playwright.sync_api import sync_playwright\nb = p.chromium.launch(channel='chrome')")
  expect(await bash('c4', 'cd /w && python3 shot.py', 'Take the shots')).toMatch(COPIED)
  // Playwright's own Chromium, and the person's Chrome opened with a window, run
  files.set('/w/own.mjs', "import { chromium } from 'playwright'\nconst b = await chromium.launch()")
  expect(await bash('c5', 'cd /w && node own.mjs', 'Take the shots')).toBeUndefined()
  expect(await bash('c6', 'open -a "Google Chrome" http://localhost:3000', 'Open the site')).toBeUndefined()
})

// Claude's commands as ps lists them beside the app, its engine and another app's, on a Mac of ten cores, with each process's threads
// ready to run (other: the other apps' and the system's, at full speed)
const paceList = (rows: { pid: number; ppid: number; age: string; pri: number; name: string }[], ready: Record<string, number>, other = 0) =>
  [
    '@@PACE@@ 1423',
    '@@CORES@@',
    '10',
    '@@PS@@',
    '  852     1   852 01:00:00  47 /Applications/Claude.app/Contents/MacOS/Claude',
    ' 1422   852   852 01:00:00  31 /Applications/Claude.app/Contents/Helpers/disclaimer',
    ' 1423  1422   852 01:00:00  31 /Users/sam/Library/Application Support/Claude/claude-code/2.1.328/x/claude.app/Contents/MacOS/claude',
    '  700     1   700 01:00:00  31 /Applications/Safari.app/Contents/MacOS/Safari',
    ...rows.map(r => `${r.pid} ${r.ppid} ${r.ppid} ${r.age} ${r.pri} ${r.name}`),
    '@@THREADS@@',
    'USER   PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND',
    `sam   700   ??  99.0 S    31T   0:00.00   1:00.00 Safari`,
    ...Array.from({ length: other }, () => '      700         99.0 R    31T   0:00.00   1:00.00 '),
    ...Object.entries(ready).flatMap(([pid, n]) => [`sam ${pid} ?? 99.0 S 31T 0:00.00 1:00.00 python`, ...Array.from({ length: n }, () => `     ${pid}        99.0 R    31T   0:00.00   1:00.00 `)]),
    '',
  ].join('\n')

test("Claude's commands take their turn on the processor: the oldest run at full speed while their ready threads fit in the cores left after the other apps' and two more, the newest beyond wait in the Mac's background mode and come back as room comes, and nothing else is touched", async ($, on) => {
  const shell = { pid: 5000, ppid: 1423, age: '10:00', pri: 31, name: '/bin/zsh' }
  const a = { pid: 5001, ppid: 5000, age: '10:00', pri: 31, name: '/usr/bin/python3' }
  const b = { pid: 5002, ppid: 5000, age: '01:00', pri: 31, name: '/usr/bin/python3' }
  const c = { pid: 5003, ppid: 1423, age: '00:30', pri: 31, name: 'node' }
  let rows = [shell, a, b, c]
  let ready: Record<string, number> = { 5001: 5, 5002: 4, 5003: 1 }
  const set: string[][] = []
  const { clock } = world(on, { pace: argv => (argv[1]?.startsWith('echo "@@PACE@@') ? paceList(rows, ready, 2) : (set.push([argv[3] ?? '', argv[4] ?? '']), '')) })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  await until(async () => (set.length ? true : undefined))
  // Ten cores, less two and Safari's two: 5 ready threads, then 4 more would pass the 6 left, so the second waits; the third's 1 fits.
  // Never the app, an engine or Safari, and never a shell with nothing ready
  expect(set[0]).toEqual(['5002', ''])
  // The first leaves, and the one waiting in the background mode comes back to full speed
  rows = [shell, { ...b, pri: 4 }, c]
  ready = { 5002: 4, 5003: 1 }
  for (let s = 0; s < 6; s++) await clock.advance(1000)
  await until(async () => (set.length > 1 ? true : undefined))
  expect(set[1]).toEqual(['', '5002'])
  // Out of it, and nothing changes after, so nothing is set again
  rows = [shell, b, c]
  for (let s = 0; s < 6; s++) await clock.advance(1000)
  expect(set.length).toBe(2)
})

test("with no work at work, the Mac is looked at only while commands are still waiting in the background mode, so none is left there once the work is over", async ($, on) => {
  let looks = 0
  const set: string[][] = []
  const waiting = { pid: 5002, ppid: 1423, age: '01:00', pri: 4, name: '/usr/bin/python3' }
  const { clock, files } = world(on, {
    env: { TMPDIR: '/t' },
    pace: argv => (argv[1]?.startsWith('echo "@@PACE@@') ? ((looks += 1), paceList([waiting], { 5002: 0 })) : (set.push([argv[3] ?? '', argv[4] ?? '']), '')),
  })
  await $.session.start(start)
  for (let s = 0; s < 6; s++) await clock.advance(1000)
  expect(looks).toBe(0)
  files.set('/t/claudopus-pace.json', JSON.stringify({ at: 0, held: 1 }))
  for (let s = 0; s < 6; s++) await clock.advance(1000)
  await until(async () => (set.length ? true : undefined))
  expect(set[0]).toEqual(['', '5002'])
  // It is out, so the looks stop
  const seen = looks
  for (let s = 0; s < 12; s++) await clock.advance(1000)
  expect(looks).toBe(seen)
})

// A Windows PC's look as its PowerShell writes it, t seconds in: the engine under the app, a command it started, another app,
// Windows' own idle time (never work), the disk's and the ports' running totals, a virtual port, and a battery charging
const windowsLook = (t: number) =>
  [
    '@@SELF@@ 5000',
    '@@SYS@@',
    `${16 * 1024 * 1024} ${4 * 1024 * 1024} 8`,
    '@@PS@@',
    `0 0 8192 ${Math.round((1000 + t * 4) * 1e7)} System Idle Process`,
    `4000 900 900000000 ${Math.round((10 + t * 0.5) * 1e7)} Claude.exe`,
    `5000 4000 1500000000 ${60 * 1e7} claude.exe`,
    `6000 5000 600000000 ${Math.round((20 + t * 1.5) * 1e7)} node.exe`,
    `7000 900 2000000000 ${Math.round((30 + t * 2) * 1e7)} chrome.exe`,
    '@@DISK@@',
    `0 C:\t${Math.round(1e9 + t * 20e6)}`,
    '@@NET@@',
    `Intel[R] Wi-Fi 6 AX201 160MHz\t${Math.round(t * 2e6)}\t${Math.round(t * 1e6)}`,
    `vEthernet (WSL)\t${Math.round(t * 90e6)}\t${Math.round(t * 90e6)}`,
    '@@BATT@@',
    '62 6 71582788',
    '',
  ].join('\r\n')
test('on a Windows PC the line above the prompt reads one PowerShell look, three times less often: memory, the processor, the disk, the network and the battery, Claude its app and engine with what they started; no commands are paced', async ($, on) => {
  let n = 0
  let at = () => 0
  const pc = windowsPC(on, run => (run.argv.join(' ').includes("'@@SELF@@ '") ? ((n += 1), windowsLook(at())) : undefined))
  const { clock, windowsRuns } = world(pc.on, { windows: true })
  at = () => (clock.now() - 1_700_000_000_000) / 1000
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await clock.advance(1000)
  // Six seconds on is too soon for another look; fifteen give the second, and the speeds
  await clock.advance(6000)
  expect(n).toBe(1)
  await clock.advance(9000)
  await clock.advance(1000)
  expect(n).toBe(2)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const drawings = await until(async () => {
    const all = await desk.findAll({ type: 'Svg' })
    return all.some(d => String(d.props.alt).startsWith('Processor')) ? all : undefined
  })
  const alt = (what: string) => drawings?.find(d => String(d.props.alt).startsWith(what))?.props.alt
  // 12 of 16 GB in use, 2.8 of it Claude's (the app, its engine and the node it started, never Chrome); 4 of the 8 cores at work,
  // 2 of them Claude's; the disk and the machine's own port, never the virtual one
  expect(alt('Memory')).toBe('Memory: 12 of 16 GB in use, 2.8 GB by Claude and what it started')
  expect(alt('Processor')).toBe('Processor: 50% busy, 25% by Claude and what it started')
  expect(alt('Disk')).toBe('Disk: 20 MB/s read and written')
  expect(alt('Network')).toBe('Network: 3 MB/s downloaded and uploaded')
  expect(alt('Battery')).toBe('Battery: 62%, charging')
  await desk.unmount()
  // Nothing is asked of Git's ps or a taskpolicy, which see no Windows program
  expect(windowsRuns.filter(argv => argv.join(' ').includes('@@PACE@@') || argv.join(' ').includes('taskpolicy') || argv.join(' ').includes('vm_stat'))).toEqual([])
})

test("on a Windows PC a disk nearly full says so at the top of the panel and once in a notification, with nothing to press, as nothing there can tell what is safe to remove; under 5 GB a task's download is refused", async ($, on) => {
  const { clock, files, notified, windowsRuns } = world(on, { windows: true })
  files.set('df', `C:/Program Files/Git 971350180 900000000 ${12 * 1024 * 1024} 97% /\n`)
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot every page', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Shoot the pages', prompt: 'shoot' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(31_000)
  expect((await until(() => pane.find({ type: 'Text', text: /disk space left/ })))?.text).toBe('Your PC has 12 GB of disk space left.')
  expect((await pane.findAll({ type: 'Button' })).map(b => b.props.label)).not.toContain('Free up space')
  expect(notified.filter(one => /disk space/.test(one))).toEqual(['Your PC is almost out of disk space | 12 GB left.'])
  files.set('df', `C:/Program Files/Git 971350180 900000000 ${Math.round(3.2 * 1024 * 1024)} 97% /\n`)
  await clock.advance(31_000)
  const deny = ((await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'curl -L -o C:/w/scans.zip https://example.com/scans.zip', description: 'Download the scans', run_in_background: true } as never)) as { deny?: string }).deny
  expect(deny).toMatch(/^Not run: the PC has 3\.2 GB of disk space left, and "Download the scans" can fill it\. .* once more than 5 GB is free\.$/)
  // and the tidy of what tasks left is never started, two minutes on or later
  await clock.advance(10 * 60_000)
  expect(windowsRuns.filter(argv => argv.join(' ').includes('/bin/tidy'))).toEqual([])
  await pane.unmount()
})
