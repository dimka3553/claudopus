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
  expect(await textOf(held as never)).toContain('Esc back to the chat')
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
