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
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: /^63 MB\/s$/ })) ? true : undefined))
  const cards: Record<string, string[]> = {
    memory: ['Memory', '29 of 64 GB', 'Claude and what it started', '3.3 GB', 'Using the most', 'Safari', '0.4 GB'],
    cpu: ['Processor', '50% busy', 'Cores', '10', 'Claude and what it started', '20%', 'Using the most', 'Safari', '30%'],
    gpu: ['Graphics processor', '37% busy', 'Graphics memory in use', '1.2 GB'],
    battery: ['Battery', '85%', 'On battery · about 4h 12m left'],
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
    // Its part of the card waits hidden and shows while the group is lit, so one figure's part shows at a time and goes as the
    // pointer leaves
    const card = find(drawn, `usage-${key}-card`)
    expect(card?.props?.display).toBe('none')
    expect(card?.hover).toEqual({ scope: `usage-${key}`, display: 'flex' })
    for (const part of parts) expect(textOf(card)).toContain(part)
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

test('the battery card says what the Mac draws, the processors and graphics each, and Claude\'s part of each, with no paragraph under them', async ($, on) => {
  let n = 0
  // Each look: Claude's renderer a quarter of the graphics time, Safari the rest; Claude's chat 20 J a look, the
  // processors 40 J, the graphics processor 5 J
  const power = (k: number) =>
    [
      gpuAt(60),
      ac('94%; charging; (no estimate)'),
      '@@POWER@@',
      '"SystemLoad"=80000',
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
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await desk.find({ type: 'Text', text: 'Power use, whole Mac' })) ? true : undefined))
  for (const text of ['Power use, whole Mac', '80 W', 'Power use, processors', 'Claude and what it started', 'Power use, graphics', /^about [\d.]+ W$/])
    expect(await desk.find({ type: 'Text', text })).toBeDefined()
  expect(await desk.find({ type: 'Text', text: "Claude's processors draw" })).toBeUndefined()
  // The cards are their rows alone: no paragraph under them on what the figures cover, and no line on what busy means
  expect(await desk.find({ type: 'Text', text: /^Claude: the app/ })).toBeUndefined()
  expect(await desk.find({ type: 'Text', text: 'Time at work, at any speed' })).toBeUndefined()
  // The graphics card: what it draws, and who uses it most
  for (const text of ['Power use', 'Safari', '45%', '15%']) expect(await desk.find({ type: 'Text', text })).toBeDefined()
  await desk.unmount()
})

test("a task's heavy command waits its turn while the Mac is busy and another runs: refused at once with its place in the line, its card says so and stays at work through its step's end and any wake_me of its own, and its work (a helper too) is started again in order once there is room or after 15 minutes; one with nothing else heavy running, or with the setting at Never, runs at once; nothing waits in a hook (16 Nov: ten tasks drove headless browsers on one Mac at once)", SLOW, async ($, on) => {
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
  // A second and a third are refused at once, each with its place, and their cards say they wait
  expect((await shoot('s2', 'a2', 'Take the card shots')).deny).toMatch(/^Not run yet: the Mac is busy \(load 60 on 10 cores, .*\) and other heavy commands of Claudopus's tasks run, so this one \("Take the card shots"\) waits its turn, next in line\. Do other work that does not need it, or end your step: Claudopus starts you again when its turn comes, in 15 minutes at the latest\. Then send the same command again\.$/)
  expect((await shoot('s3', 'a3', 'Take the menu shots')).deny).toMatch(/waits its turn, 2nd in line\./)
  const texts = async () => {
    const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
    const all = (await list.findAll({ type: 'Text' })).map(one => one.text)
    await list.unmount()
    return all
  }
  expect(await until(async () => ((await texts()).some(text => /^Waiting until the Mac is less busy · 2nd in line/.test(text)) || undefined))).toBe(true)
  const held = await texts()
  expect(held.some(text => /^Wait · its turn to run Take the card shots/.test(text))).toBe(true)
  expect(held.some(text => /^Waiting until the Mac is less busy · next in line/.test(text))).toBe(true)
  expect(held.some(text => /^Wait · its turn to run Take the menu shots/.test(text))).toBe(true)
  // (said once, on the row: the card's line does not say a time it is started again by)
  expect(held.some(text => /starts Claude again/.test(text))).toBe(false)
  // The same command sent again before its turn keeps its place
  expect((await shoot('s2b', 'a2', 'Take the card shots')).deny).toMatch(/waits its turn, next in line\./)
  // A helper waits its turn as a task does, told to end its step without handing back
  await $.agent.spawn({ ...spawn, description: 'Shoot the footer', prompt: 'footer', parentAgentId: 'a1' } as never)
  expect((await shoot('s9', 'a4', 'Take the footer shots')).deny).toMatch(/waits its turn, 3rd in line\. Do other work that does not need it, or end your step without handing back: Claudopus starts you again/)
  // Their steps end: still at work, whatever a wake_me of their own does meanwhile (one set and gone off leaves the wait standing)
  expect(((await $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w1', agentId: 'a2', what: 'a short pause', minutes: 1 } as never)) as { result?: string }).result).toBeDefined()
  for (const agentId of ['a2', 'a4']) await $.turn.complete({ answer: 'Waiting my turn.', durationMs: 1, isAborted: false, turnId: `t-${agentId}`, reason: 'answer', agentId } as never)
  await clock.advance(90_000)
  const waited = await texts()
  expect(waited.filter(text => /^Wait · its turn to run Take the (card|footer) shots/.test(text))).toHaveLength(2)
  expect(waited.some(text => /^Shoot the cards$/.test(text))).toBe(true)
  // Nobody is woken while the load stays
  const woken = () => [...appended, ...resumed].filter(line => /your command's turn|has waited 15 minutes/.test(line))
  await clock.advance(20_000)
  expect(woken()).toEqual([])
  // The load falls: the first in line is started again first, and its command, sent again, runs
  load = 3
  expect(await until(async () => (await clock.advance(6000), woken().length > 0 || undefined))).toBe(true)
  expect(woken()[0]).toBe('a2: It is your command\'s turn: the Mac has room for "Take the card shots" now. Send it again now, and it runs at once.')
  expect((await shoot('s2c', 'a2', 'Take the card shots')).deny).toBeUndefined()
  expect(await until(async () => (await clock.advance(6000), woken().some(line => line.startsWith('a3: ')) || undefined))).toBe(true)
  expect((await shoot('s3b', 'a3', 'Take the menu shots')).deny).toBeUndefined()
  // and the helper whose step had ended is started again with its turn, its command then run
  expect(await until(async () => (await clock.advance(6000), woken().some(line => line === 'a4: It is your command\'s turn: the Mac has room for "Take the footer shots" now. Send it again now, and it runs at once.') || undefined))).toBe(true)
  expect((await shoot('s9b', 'a4', 'Take the footer shots')).deny).toBeUndefined()
  expect(await until(async () => (!(await texts()).some(text => /its turn|room on the Mac/.test(text)) || undefined))).toBe(true)
  // Busy again, one more waits; after 15 minutes its work is started again however busy the Mac is
  load = 60
  await clock.advance(6000)
  expect((await shoot('s4', 'a2', 'Take the footer shots')).deny).toMatch(/waits its turn, next in line\./)
  for (let k = 0; k < 15; k++) await clock.advance(60_000)
  expect(await until(async () => (await clock.advance(6000), woken().some(line => line === 'a2: Your command "Take the footer shots" has waited 15 minutes for room on the Mac: send it again now, and it runs whatever the load. If it fails or times out for lack of room, try it again later.') || undefined))).toBe(true)
  // With the setting at Never, a heavy command runs at once however busy the Mac is
  ownSet(files, 'config.json', JSON.stringify({ heavy: 'never' }))
  expect((await shoot('s5', 'a3', 'Take the header shots')).deny).toBeUndefined()
})
