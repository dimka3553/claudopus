// The terminal's octopus, marks of work under way and pictures: cells (a Raster), repainted in place as they move

// Two drawings in the octopus's own form, squares of one pixel in groups that show and hide in turn: one still, one of two pictures
const STILL_ART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/><rect x="0" y="2" width="4" height="2"/></g></svg>'
const MOVING_ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/>' +
  '<g visibility="visible"><animate attributeName="visibility" values="visible;hidden" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="0" y="2" width="1" height="2"/></g>' +
  '<g visibility="hidden"><animate attributeName="visibility" values="hidden;visible" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="3" y="2" width="1" height="2"/></g></g></svg>'
// A 2 by 2 bitmap as sips writes one (24 bits, rows from the bottom up), base64: red and green over blue and white
const tinyBmp = () => {
  const bytes = new Uint8Array(54 + 16)
  const view = new DataView(bytes.buffer)
  view.setUint16(0, 0x4d42, true)
  view.setUint32(2, bytes.length, true)
  view.setUint32(10, 54, true)
  view.setUint32(14, 40, true)
  view.setInt32(18, 2, true)
  view.setInt32(22, 2, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  // Bottom row first, each pixel blue, green, red; each row padded to 8 bytes
  bytes.set([255, 0, 0, 255, 255, 255, 0, 0], 54)
  bytes.set([0, 0, 255, 0, 255, 0, 0, 0], 62)
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = ((bytes[i] ?? 0) << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    out += abc.charAt((n >> 18) & 63) + abc.charAt((n >> 12) & 63) + (i + 1 < bytes.length ? abc.charAt((n >> 6) & 63) : '=') + (i + 2 < bytes.length ? abc.charAt(n & 63) : '=')
  }
  return out
}

test('in the terminal the octopus and the marks of work are cells that move in place, and the app still draws its Svg', async ($, on) => {
  const { clock } = world(on, { drawings: name => (!name ? undefined : name.startsWith('working') ? MOVING_ART : STILL_ART) })
  const blits: { requestId: string; key: string; cells: string }[] = []
  on('ui.blit', (_, e) => (blits.push(e as never), { value: {} }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose.' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  // The header's octopus at work: the small one, in the middle of a box the waving one fits, two pixels to a cell
  const head = (await pane.findAll({ type: 'Raster' })).find(one => String(one.key).startsWith('head-mark-working-'))
  expect(head?.props.columns).toBe(18)
  expect(head?.props.rows).toBe(9)
  // The card's three dots, a bright one passing along them
  const dots = (await pane.findAll({ type: 'Raster' })).find(one => String(one.key) === 'live-a1')
  expect(dots?.props.columns).toBe(3)
  // Both are repainted in place as they move, each picture once, nothing drawn again
  await clock.advance(700)
  const headCells = blits.filter(one => one.requestId === 'claudopus' && one.key === head?.key).map(one => one.cells)
  expect(headCells.length).toBeGreaterThan(0)
  expect(headCells.some(cells => cells !== head?.props.cells)).toBe(true)
  expect(blits.some(one => one.key === 'live-a1' && one.cells !== dots?.props.cells)).toBe(true)
  await pane.unmount()

  // Above the prompt: the tiny octopus, one line of three cells
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  const tiny = (await band.findAll({ type: 'Raster' })).find(one => String(one.key).startsWith('band-mark-workingSmall-'))
  expect([tiny?.props.columns, tiny?.props.rows]).toEqual([3, 1])
  await band.unmount()

  // The app's drawing is as it was: its Svg, and no cells
  const app = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await app.findAll({ type: 'Svg' })).some(one => one.props.alt === 'Claudopus at work')).toBe(true)
  expect(await app.findAll({ type: 'Raster' })).toEqual([])
  await app.unmount()
})

test("in the terminal a picture a work made is drawn as cells in its colours, made by sips as a bitmap out of the drawing", async ($, on) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
  ]
  const asked: string[][] = []
  const { files, clock } = world(on, {
    talk,
    sips: argv => (asked.push(argv), argv.includes('-g') ? 'pixelWidth: 2\npixelHeight: 2' : ''),
    bytes: path => (/\/thumbs\/term-[\w]+\.bmp$/.test(path) ? tinyBmp() : undefined),
  })
  files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  await until(async () => (await tab.find({ type: 'Button', text: /chart\.svg/ })) ?? (await keyed(tab, 'pic-open-1-0')))
  // Made from a timer once the tab is drawn, then drawn again
  const cells = await until(async () => (await clock.advance(10), (await tab.findAll({ type: 'Raster' })).find(one => String(one.key) === 'pic-cells-1-0')))
  // Two pixels wide, so two cells, one row: red over blue, then green over white
  expect([cells?.props.columns, cells?.props.rows]).toEqual([2, 1])
  expect(asked.some(argv => argv.includes('-z') && argv.includes('bmp'))).toBe(true)
  // ▀ (0x2580) in red on blue: the first cell's three little-endian words
  expect(String(cells?.props.cells).slice(0, 16)).toBe('gCUAAAAA/wD/AAAA')
  await tab.unmount()
  await pane.unmount()
})
