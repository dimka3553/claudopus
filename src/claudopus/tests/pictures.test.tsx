// Pictures a piece of work made, in its chat

test("the pictures a work made are in its chat where it made them: drawn small where the panel can, opened whole in the Mac's own viewer on a press, a gone one named", async ($, on) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    {
      role: 'assistant',
      text: 'Drawing it.',
      toolUses: [
        { tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } },
        { tool_use_id: 'u2', tool: 'Bash', input: { command: 'sips -g pixelWidth /tmp/old/before.png', description: 'Measure the old one' }, text: 'pixelWidth: 10' },
        { tool_use_id: 'u4', tool: 'Read', input: { file_path: '/tmp/old/before.png' } },
      ],
    },
    { role: 'assistant', text: 'Here it is.', toolUses: [{ tool_use_id: 'u3', tool: 'SendUserFile', input: { files: ['/tmp/work/gone.png'], status: 'normal' } }] },
  ]
  const { files, logged, shown } = world(on, { talk })
  files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>')
  files.set('/tmp/old/before.png', 'old')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({ ...LIST, surface } as never)
    await pressed(pane, 'open-a1')
    const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface } as never)
    const labels = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
    // The picture it wrote, under the run of steps that made it, whether that run is open or not
    expect(labels.filter(label => label.includes('chart.svg'))).toEqual([surface === 'terminal' ? '⤢ Open: chart.svg' : '⤢ Open large: chart.svg'])
    const svgs = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
    expect(svgs.map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
    expect((await tab.find({ type: 'Text', text: /^Picture: gone\.png/ }))?.text).toBe('Picture: gone.png · no longer kept')
    expect(labels.some(label => label.includes('before.png'))).toBe(false)
    // Pressed, it opens whole in a window of its own, the panel left as it was; each press opens it again
    shown.length = 0
    const was = (await keyed(tab, 'pic-open-1-0'))?.key
    await pressed(tab, 'pic-open-1-0')
    expect(shown).toEqual([['open', svg]])
    // A new key, as every press gives, so the app does not hold the view on the row last pressed
    expect((await keyed(tab, 'pic-open-1-0'))?.key).not.toBe(was)
    await pressed(tab, 'pic-open-1-0')
    expect(shown).toEqual([['open', svg], ['open', svg]])
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
})

test("in a chat the app runs on another Mac over ssh, a picture's row in Details draws it large in that tab, no tab opened, closed or opened again, and Back brings the Details again", async ($, on) => {
  const svg = '/tmp/work/chart.svg'
  const talk = [
    { role: 'user', text: 'Draw the chart.', toolUses: [] },
    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
  ]
  const { files, logged, shown, opened, closed } = world(on, { talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"/>')
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Draw the chart.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  shown.length = 0
  const openedBefore = [...opened]
  const closedBefore = [...closed]
  await pressed(tab, 'pic-open-1-0')
  expect(shown.filter(one => one[0] === 'open')).toEqual([])
  expect(opened).toEqual(openedBefore)
  expect(closed).toEqual(closedBefore)
  const svgs = await tab.findAll({ type: 'Svg' })
  expect(svgs.map(one => String(one.props.alt))).toEqual(['Picture: chart.svg'])
  expect(String(svgs[0]?.props.source)).toContain('width="1200"')
  const labels = (await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))
  expect(labels).toEqual(['← Back to Details', '← Back to Details'])
  await pressed(tab, 'pic-back-top')
  expect((await tab.findAll({ type: 'Button' })).map(one => String(one.props.label))).toContain('⤢ Open large: chart.svg')
  expect(opened).toEqual(openedBefore)
  expect(closed).toEqual(closedBefore)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

// The most characters the app draws in one tab (its renderer throws a larger drawing away whole)
const APP_DRAWING_CHARS = 262_144
// How many characters a tab's drawing holds, as the app counts them before it draws one: its texts, labels and pictures' sources
const drawnChars = async (tab: Awaited<ReturnType<EngineInterface['ui']['mount']>>) =>
  (await tab.findAll({ type: 'Svg' })).reduce((sum, one) => sum + String(one.props.source).length + String(one.props.alt ?? '').length, 0) +
  (await tab.findAll({ type: 'Text' })).reduce((sum, one) => sum + String(one.text ?? '').length, 0) +
  (await tab.findAll({ type: 'Button' })).reduce((sum, one) => sum + String(one.props.label ?? '').length, 0)

test("in a chat the app runs on another Mac over ssh, a large screenshot opened large fits in one drawing the app accepts: smaller or narrower until it does, drawn whole", async ($, on) => {
  const png = '/tmp/work/shot.png'
  const talk = [
    { role: 'user', text: 'Shoot.', toolUses: [] },
    { role: 'assistant', text: 'Shot.', toolUses: [{ tool_use_id: 'u1', tool: 'SendUserFile', input: { files: [png], status: 'normal' } }] },
  ]
  // A 2300 × 2300 screenshot: as JPEG at quality 70 its base64 is about 0.156 characters a pixel, at 55 about 0.12, as the real one measured
  let wide = 2300
  let cut = { rows: 0, quality: 70 }
  const sips = (argv: string[]) => {
    const line = argv.join(' ')
    if (line.includes('hasAlpha')) return 'pixelWidth: 2300\npixelHeight: 2300\nhasAlpha: no'
    if (line.startsWith('sips --resampleWidth ')) wide = Number(argv[2])
    if (line.startsWith('sips -c ')) cut = { rows: Number(argv[2]), quality: Number(argv[argv.indexOf('formatOptions') + 1]) }
    if (line.startsWith('sips -g pixelHeight') && line.includes('-band.')) return `pixelHeight: ${cut.rows}`
    if (line.startsWith('sips -g pixelHeight')) return `pixelHeight: ${wide}`
    return line.startsWith('sips -g') ? undefined : ''
  }
  const bytes = (path: string) => (path.includes('-band.') ? 'A'.repeat(Math.round(wide * cut.rows * (cut.quality >= 70 ? 0.156 : 0.12))) : undefined)
  const { files, logged } = world(on, { talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' }, sips, bytes })
  files.set(png, 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Shoot.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  await pressed(tab, 'pic-open-1-0')
  // The copy is made out of the drawing, which is drawn again once it is ready
  for (let tries = 0; tries < 50 && !(await tab.findAll({ type: 'Svg' })).length; tries += 1) await new Promise(done => setTimeout(done, 20))
  const svgs = await tab.findAll({ type: 'Svg' })
  expect(svgs.length).toBeGreaterThan(0)
  // The bands, one under the other, are the whole picture at one width
  const widths = new Set(svgs.map(one => Number(/width="(\d+)"/.exec(String(one.props.source))?.[1])))
  expect(widths.size).toBe(1)
  const width = [...widths][0] ?? 0
  expect(svgs.reduce((sum, one) => sum + Number(/height="(\d+)"/.exec(String(one.props.source))?.[1] ?? 0), 0)).toBe(width)
  // 2000 wide would be about 620000 characters, which the app throws away whole; this is the widest that fits
  expect(width).toBe(1000)
  expect(await drawnChars(tab)).toBeLessThan(APP_DRAWING_CHARS)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

test("a Details tab's small pictures together stay under what the app draws in one tab; one past that is a row that opens it", async ($, on) => {
  const shots = [1, 2, 3, 4, 5, 6].map(n => `/tmp/work/shot-${n}.png`)
  const talk = [
    { role: 'user', text: 'Shoot.', toolUses: [] },
    ...shots.map((path, n) => ({ role: 'assistant', text: `Shot ${n + 1}.`, toolUses: [{ tool_use_id: `u${n}`, tool: 'SendUserFile', input: { files: [path], status: 'normal' } }] })),
  ]
  // Each small copy as large as one may be: 36000 bytes, 48000 characters of base64
  const sips = (argv: string[]) => (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 360\npixelHeight: 240' : '')
  const bytes = (path: string) => (path.includes('/thumbs/') ? 'A'.repeat(48_000) : undefined)
  const { files, logged } = world(on, { talk, sips, bytes })
  for (const path of shots) files.set(path, 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'shoot', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Shoot.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pressed(pane, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  const small = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
  // Three fit; the other three are rows that open them
  expect(small.length).toBe(3)
  expect((await tab.findAll({ type: 'Button' })).filter(one => String(one.props.label).startsWith('⤢')).length).toBe(6)
  expect(await drawnChars(tab)).toBeLessThan(APP_DRAWING_CHARS)
  await tab.unmount()
  await pane.unmount()
  expect(logged).toEqual([])
})

test("an ask's pictures are drawn small on its card, in the list and in Details, each with a row that opens it large; together they stay under what the app draws in one drawing; the terminal has the rows alone", async ($, on) => {
  const shots = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(n => `/w/designs/${n}.png`)
  const sips = (argv: string[]) => (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 480\npixelHeight: 300' : '')
  // Each small copy as large as an ask's may be: 22000 bytes, about 29400 characters of base64
  // Each ask copy as large as one may be, 25000 bytes; the chat's own copies, of the same pictures it sent, as large as theirs may be
  const bytes = (path: string) => (path.includes('/thumbs/ask-') ? 'A'.repeat(33_400) : path.includes('/thumbs/') ? 'A'.repeat(48_000) : undefined)
  const talk = [
    { role: 'user', text: 'Draw the designs.', toolUses: [] },
    { role: 'assistant', text: 'Here they are.', toolUses: [{ tool_use_id: 'u1', tool: 'SendUserFile', input: { files: shots, status: 'normal' } }] },
  ]
  const { files, logged, shown } = world(on, { sips, bytes, talk })
  for (const path of shots) files.set(path, 'png')
  await $.session.start(start)
  await $.prompt.submit({ text: 'pick a design', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Pick a design', prompt: 'Draw the designs.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Pick one of the designs', details: 'Each picture is one design.', choices: ['A', 'B'], pictures: shots } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // Made out of the drawing, which is drawn again once they are
  for (let tries = 0; tries < 50 && !(await list.findAll({ type: 'Svg' })).some(one => String(one.props.alt).startsWith('Picture:')); tries += 1) await new Promise(done => setTimeout(done, 20))
  const small = (await list.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
  // Four fit in what every ask's pictures may take; the rest are rows that open them
  expect(small.map(one => String(one.props.alt))).toEqual(['Picture: a.png', 'Picture: b.png', 'Picture: c.png', 'Picture: d.png'])
  // Each drawn at most 300 across, from a copy twice as wide
  expect(small.map(one => [one.props.width, one.props.height])).toEqual(Array(4).fill([300, 188]))
  const rows = (await list.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(label => label.startsWith('⤢'))
  expect(rows).toEqual(['⤢ Open large: a.png', '⤢ Open large: b.png', '⤢ Open large: c.png', '⤢ Open large: d.png', '⤢ Open: e.png', '⤢ Open: f.png', '⤢ Open: g.png'])
  expect(await drawnChars(list)).toBeLessThan(APP_DRAWING_CHARS)
  // Pressed, one opens whole in the Mac's own viewer
  shown.length = 0
  await list.press({ key: (await list.findAll({ type: 'Button' })).find(one => one.props.label === '⤢ Open large: b.png')?.key ?? '' })
  expect(shown).toEqual([['open', '/w/designs/b.png']])
  // In Details too, under what it is about
  await pressed(list, 'open-a1')
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  for (let tries = 0; tries < 50 && (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:')).length < 4; tries += 1) await new Promise(done => setTimeout(done, 20))
  // The chat's own small copies of the same pictures and the ask's together stay under what the app draws in one tab
  expect((await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:')).length).toBeGreaterThanOrEqual(4)
  expect(await drawnChars(tab)).toBeLessThan(APP_DRAWING_CHARS)
  await tab.unmount()
  await list.unmount()
  // The terminal draws no pictures: a row each that opens it
  const term = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  expect((await term.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))).toEqual([])
  expect((await term.findAll({ type: 'Button' })).map(one => String(one.props.label)).filter(label => label.startsWith('⤢')).length).toBe(7)
  expect(await term.find({ type: 'Text', text: /Making its pictures small/ })).toBeUndefined()
  await term.unmount()
  // Only the ask's notice in the chat is logged: nothing failed
  expect(logged.filter(line => !line.startsWith('The work "Pick a design" needs the person'))).toEqual([])
})
