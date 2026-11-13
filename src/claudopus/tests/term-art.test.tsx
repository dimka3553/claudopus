// The terminal's octopus and marks of work under way: cells (a Raster), repainted in place as they move; and its pictures, which
// are rows that open where the person is

// Two drawings in the octopus's own form, squares of one pixel in groups that show and hide in turn: one still, one of two pictures
const STILL_ART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/><rect x="0" y="2" width="4" height="2"/></g></svg>'
const MOVING_ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/>' +
  '<g visibility="visible"><animate attributeName="visibility" values="visible;hidden" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="0" y="2" width="1" height="2"/></g>' +
  '<g visibility="hidden"><animate attributeName="visibility" values="hidden;visible" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="3" y="2" width="1" height="2"/></g></g></svg>'
test('in the terminal the octopus and the marks of work are cells that move in place, and the app still draws its Svg', async ($, on) => {
  const { clock } = world(on, { drawings: name => (!name ? undefined : name.startsWith('working') ? MOVING_ART : STILL_ART) })
  const blits: { requestId: string; key: string; cells: string }[] = []
  on('ui.blit', (_, e) => (blits.push(e as never), { value: {} }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose.' } as never)

  const pane = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  // The header's octopus at work: three rows tall beside the header's three lines, four pixels to a cell
  const head = (await pane.findAll({ type: 'Raster' })).find(one => String(one.key).startsWith('head-mark-working-'))
  expect(head?.props.columns).toBe(7)
  expect(head?.props.rows).toBe(3)
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

// A piece of work that drew one picture, its Details open in a terminal
const pictured = async ($: Parameters<Parameters<typeof test>[1]>[0], on: On, options: { env?: Record<string, string>; tailscale?: string }) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
  ]
  const made = world(on, { talk, ...options })
  made.files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  await pressed(pane, 'open-a1')
  await pane.unmount()
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'terminal' } as never)
  await until(async () => keyed(tab, 'pic-open-1-0'))
  return { ...made, tab, svg }
}

test('in the terminal a picture is not drawn: its row, pressed, opens it in the viewer of the Mac the person is at', async ($, on) => {
  const { tab, shown, svg } = await pictured($, on, {})
  expect(await tab.findAll({ type: 'Raster' }).then(all => all.filter(one => String(one.key).startsWith('pic-')))).toEqual([])
  await pressed(tab, 'pic-open-1-0')
  await until(async () => (shown.some(argv => argv.includes(svg)) ? true : undefined))
  await tab.unmount()
})

test('in a terminal reached over ssh a picture pressed is sent to the device it is watched from, by Tailscale where both have it', async ($, on) => {
  const { tab, shown, dropped, svg } = await pictured($, on, { env: { SSH_CONNECTION: '100.72.19.2 65204 100.97.255.107 22', USER: 'sam' }, tailscale: '100.72.19.2\tsams-laptop\n100.86.184.91\tphone\toffline; last seen 4h ago\n' })
  await pressed(tab, 'pic-open-1-0')
  await until(async () => tab.find({ type: 'Text', text: /Sent to sams-laptop: it is in Downloads there/ }))
  expect(dropped.map(argv => argv.slice(1))).toEqual([['file', 'cp', svg, '100.72.19.2:']])
  // Nothing opens on this Mac, where nobody looks
  expect(shown.some(argv => argv.includes(svg))).toBe(false)
  await tab.unmount()
})

test('over ssh without Tailscale the row gives the one command that fetches the picture and opens it on the device', async ($, on) => {
  const { tab, shown, svg } = await pictured($, on, { env: { SSH_CONNECTION: '192.168.1.20 65204 192.168.1.7 22', USER: 'sam' } })
  await pressed(tab, 'pic-open-1-0')
  await until(async () => tab.find({ type: 'Text', text: "scp 'sam@192.168.1.7:/tmp/work/chart.svg' ~/Downloads/ && open ~/Downloads/'chart.svg'" }))
  expect((await tab.findAll({ type: 'Button' })).some(one => one.props.label === 'Copy the command')).toBe(true)
  expect(shown.some(argv => argv.includes(svg))).toBe(false)
  await tab.unmount()
})
