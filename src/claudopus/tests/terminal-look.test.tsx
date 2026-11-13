// The terminal's look: no grey bars from the app's see-through tint, a key for each button and a line that says how to reach them,
// Memory as a tab, and the Stats timeline drawn in cells

test('in the terminal no Box carries the faint tint the app draws, and the app keeps it', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose.' } as never)
  const tinted = (boxes: { props: Record<string, unknown> }[]) => boxes.filter(one => one.props.backgroundColor === '#80808024')
  const seeThrough = (color: unknown) => typeof color === 'string' && /^#[0-9a-f]{6}(?!ff)[0-9a-f]{2}$/i.test(color)

  const terminal = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  const termBoxes = await terminal.findAll({ type: 'Box' })
  expect(tinted(termBoxes as never)).toEqual([])
  // Nor any other colour a terminal cannot see through
  expect(termBoxes.filter(one => seeThrough(one.props.backgroundColor))).toEqual([])
  await terminal.unmount()

  const desktop = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(tinted((await desktop.findAll({ type: 'Box' })) as never).length).toBeGreaterThan(0)
  await desktop.unmount()
})

test('in the terminal each header button has a key, and a line says how to reach them, before and after the panel takes the keys', async ($, on) => {
  world(on)
  await $.session.start(start)
  const keysOf = async (pane: { findAll: (q: { type: string }) => Promise<{ props: Record<string, unknown> }[]> }) =>
    Object.fromEntries((await pane.findAll({ type: 'Button' })).filter(one => one.props.hotkey).map(one => [String(one.props.label).split(' ')[0], one.props.hotkey]))
  const textOf = async (pane: { findAll: (q: { type: string }) => Promise<{ text: string }[]> }) =>
    (await pane.findAll({ type: 'Text' })).map(one => one.text).join('\n')

  const idle = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect(await keysOf(idle as never)).toMatchObject({ Stats: 's', Memory: 'm', Config: 'c', About: 'a' })
  expect(await textOf(idle as never)).toContain('ctrl+x Tab')
  await idle.unmount()

  const held = await $.ui.mount({ ...LIST, props: { ...LIST.props, isFocused: true }, surface: 'terminal' } as never)
  expect(await textOf(held as never)).toContain('Esc chat')
  await held.unmount()

  // The app has its own pointer and keys: no such line there
  const app = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await textOf(app as never)).not.toContain('ctrl+x Tab')
  await app.unmount()
})

test('the Stats timeline in cells: a row a lane, each run of cells in its model, the times under it', () => {
  const h = 3_600_000
  const at = Date.UTC(2026, 10, 13, 9)
  const piece = (id: string, from: number, to: number, model: string) => ({ id, title: id, isFlow: false, isFinished: true, spans: [[from, to]] as [number, number][], bars: [{ from, to, model }], calls: [], ended: to })
  const { rows, from, to } = timelineRows([piece('a', at, at + 2 * h, 'claude-opus-5-5'), piece('b', at + h, at + 3 * h, 'claude-sonnet-5-5')] as never, 30)
  expect(rows.length).toBe(2)
  expect(rows.every(row => row.length === 30)).toBe(true)
  expect(rows[0]?.[0]).toBe('claude-opus-5-5')
  expect(rows[1]?.[0]).toBe('')
  expect(rows[1]?.[29]).toBe('claude-sonnet-5-5')
  expect(from).not.toBe('')
  expect(to).not.toBe('')
})

test('in the terminal an ask is above the prompt with its answers numbered, and the number answers it; the app keeps its band', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  expect(await band.find({ type: 'Text', text: 'Release it?' })).toBeDefined()
  const answers = (await band.findAll({ type: 'Button' })).map(one => [one.props.label, one.props.hotkey, one.props.plain])
  expect(answers).toEqual([['Approve', '1', true], ['Not now', '2', true]])
  // The number pressed answers the ask, which then leaves the band
  await band.press({ key: String((await band.findAll({ type: 'Button' }))[0]?.key) })
  await until(async () => ((await band.find({ type: 'Text', text: 'Release it?' })) ? undefined : true))
  await band.unmount()

  const app = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect((await app.findAll({ type: 'Button' })).filter(one => one.props.hotkey)).toEqual([])
  await app.unmount()
})

test('in the terminal each card has a number that opens it, Finished has f, and every tab has p back to the panel', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose.' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  const card = await keyed(pane, 'open-a1')
  expect([card?.props.hotkey, card?.props.plain]).toEqual(['1', true])
  await pane.unmount()

  // A tab of the mod's in the terminal: its first row goes back to the panel on p
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  const back = (await tab.findAll({ type: 'Button' })).find(one => one.key === 'tab-back')
  expect([back?.props.label, back?.props.hotkey]).toEqual(['Panel', 'p'])
  await tab.unmount()

  // The app has its own pointer: no numbers, no row back
  const app = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await keyed(app, 'open-a1'))?.props.hotkey).toBeUndefined()
  await app.unmount()
  const appTab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect((await appTab.findAll({ type: 'Button' })).find(one => one.key === 'tab-back')).toBeUndefined()
  await appTab.unmount()
})
