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
    expect((await tab.find({ type: 'Text', text: /^Picture: gone\.png/ }))?.text).toBe('Picture: gone.png · no longer available')
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
const drawnChars = async (tab: Awaited<ReturnType<Parameters<TestBody>[0]['ui']['mount']>>) =>
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
  await until(async () => (await tab.findAll({ type: 'Svg' })).length || undefined)
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
  // Each small copy as made, 600 wide
  const sips = (argv: string[]) => (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 600\npixelHeight: 375' : '')
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
  await until(async () => (await list.findAll({ type: 'Svg' })).some(one => String(one.props.alt).startsWith('Picture:')) || undefined)
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
  const drawnIn = async () => (await tab.findAll({ type: 'Svg' })).map(one => String(one.props.alt)).filter(alt => alt.startsWith('Picture:'))
  // Once the chat's own small copies are read: its newest three fill what the tab keeps for pictures, and of the ask's the first
  // alone still fits; the rest are rows that open them
  await until(async () => (await drawnIn()).includes('Picture: g.png') || undefined)
  expect((await drawnIn()).sort()).toEqual(['Picture: a.png', 'Picture: e.png', 'Picture: f.png', 'Picture: g.png'])
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
  expect(logged.filter(line => !line.startsWith('"Pick a design" has a question for you'))).toEqual([])
})

test("what a task made is on its card under its title, side by side, and as tiles under the title in its Details: a file opens on a press, three of a kind are one stack that opens out, and the files it changed in a repo are a list by kind, a bar each, each opening what changed in it in a tab of the panel", async ($, on) => {
  const { files, shown, logged, tabs } = world(on, {})
  const NEW = '9999999999999'
  const pdf = '/Users/me/out/vat-report.pdf'
  const shots = ['/Users/me/out/a.png', '/Users/me/out/b.png', '/Users/me/out/c.png']
  for (const path of [pdf, ...shots, '/repo/src/app.ts', '/repo/README.md', '/tmp/work/scratch.png']) (files.set(path, 'x'), files.set(`mtime:${path}`, NEW))
  // One that was there before the task began is not of its making
  files.set('/Users/me/out/old.pdf', 'x')
  files.set('git:top', '/repo')
  files.set('git:numstat', '12\t3\tsrc/app.ts\n40\t0\tREADME.md\tnew\n')
  files.set('git:diff:src/app.ts', 'diff --git a/src/app.ts b/src/app.ts\n--- a/src/app.ts\n+++ b/src/app.ts\n@@ -1,2 +1,2 @@\n-const a = 1\n+const a = 2\n same()\n')
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the report', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Make the report.' } as never)
  await $.tool.call({ tool: 'Write', tool_use_id: 'w1', agentId: 'a1', file_path: '/repo/src/app.ts', content: 'x' } as never)
  await $.tool.call({ tool: 'Write', tool_use_id: 'w2', agentId: 'a1', file_path: '/tmp/work/scratch.png', content: 'x' } as never)
  await $.tool.call({ tool: 'Write', tool_use_id: 'w3', agentId: 'a1', file_path: '/repo/README.md', content: 'x' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: `render ${[pdf, ...shots, '/Users/me/out/old.pdf'].join(' ')}`, description: 'Run the render of the report' } as never)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  // While it still works: its files right under its title, each an icon and a word or two
  await until(async () => (await keyed(pane, 'made-a1-pdf-0-open')) || undefined)
  const chips = (await pane.findAll({ type: 'Button' })).filter(one => String(one.key).startsWith('made-a1-')).map(one => String(one.props.label))
  expect(chips).toEqual(['3 pictures', 'vat-report', '2 changed files'])
  // Each has its icon, which the app draws only with words of its own (it drops a picture whose alt is blank)
  const icons = (await pane.findAll({ type: 'Svg' })).filter(svg => svg.props.width === 18)
  expect(icons.map(svg => String(svg.props.alt).trim())).toEqual(['Picture', 'PDF', 'Code'])
  expect((await pane.findAll({ type: 'Text' })).map(one => one.text).filter(text => /^[+−]\d/.test(String(text)))).toEqual(['+52', '−3'])
  expect((await pane.findAll({ type: 'Text' })).some(one => /\/Users\/me|\/repo\/src|scratch|old/.test(String(one.text)))).toBe(false)
  // Its changed files are a count that opens its Details (19 Nov: "1 code file" could not be pressed)
  await pressed(pane, 'made-a1-code-open')
  expect(await until(async () => tabs.find(one => one.startsWith('work-a1')))).toBeDefined()
  // A file opens on a press, as the system opens it
  await pressed(pane, 'made-a1-pdf-0-open')
  expect(shown).toEqual([['open', pdf]])
  // In its Details: the same things as tiles, right under the title and above everything else
  const tab = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  await until(async () => (await keyed(tab, 'files-a1-pile-picture-open')) || undefined)
  const bold = (await tab.findAll({ type: 'Text' })).filter(text => text.props.bold).map(text => text.text)
  expect(bold[1]).toBe('Files')
  const tiles = async () => (await tab.findAll({ type: 'Svg' })).filter(svg => svg.props.width === 96).map(svg => String(svg.props.alt))
  expect(await tiles()).toEqual(['3 pictures', 'vat-report'])
  // A stack opens out into a tile for each of its files, and folds again
  await pressed(tab, 'files-a1-pile-picture-open')
  await until(async () => ((await tiles()).includes('a') ? true : undefined))
  expect(await tiles()).toEqual(['a', 'b', 'c', 'vat-report'])
  await pressed(tab, 'files-a1-fewer')
  await until(async () => ((await tiles()).includes('3 pictures') ? true : undefined))
  // Under the tiles, the files it changed in its repo, by kind, the most changed first: a bar each, as long as its lines changed
  // against the most changed, with its name, its folder in the repo and its counts; never a folder outside the repo
  const texts = async (in_: typeof tab) => (await in_.findAll({ type: 'Text' })).map(one => String(one.text))
  expect((await texts(tab)).filter(text => /^(Code|Documents) · /.test(text))).toEqual(['Code · 1 file', 'Documents · 1 file'])
  const bars = (await tab.findAll({ type: 'Svg' })).filter(svg => svg.props.width === 64)
  expect(bars.map(svg => String(svg.props.alt))).toEqual(['12 added, 3 removed', '40 added, 0 removed'])
  expect(String(bars[1]?.props.source)).toContain('width="64" height="8" rx="2" fill="#57AB5A"')
  expect(String(bars[0]?.props.source)).toMatch(/width="(\d+)" height="8" rx="2" fill="#57AB5A".*fill="#E5534B"/)
  const rows = (await tab.findAll({ type: 'Button' })).filter(one => /^(app\.ts|README\.md)$/.test(String(one.props.label)))
  expect(rows.map(one => String(one.props.label))).toEqual(['app.ts', 'README.md'])
  expect(await texts(tab)).toContain('src')
  expect((await texts(tab)).some(text => /\/Users\/me|\/repo\//.test(text))).toBe(false)
  // A press on a file opens what changed in it in a tab of the panel named after it, drawn by Claude Code as a diff
  await tab.press({ key: rows[0]?.key ?? '' })
  const diffTab = await until(async () => tabs.find(one => /^diff-.*: app\.ts$/.test(one)))
  const diff = await $.ui.mount({ ...LIST, requestId: String(diffTab).split(':')[0], props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const code = async () => (await diff.findAll({ type: 'Code' })).map(one => ({ source: String(one.props.source), format: one.props.format, startLine: one.props.startLine }))
  expect(await until(async () => (await code())[0])).toEqual({ source: '@@ -1,2 +1,2 @@\n-const a = 1\n+const a = 2\n same()', format: 'diff', startLine: undefined })
  expect(await texts(diff)).toEqual(expect.arrayContaining(['app.ts', 'src ·', '+12', '−3', 'of the task “Fix the nose”']))
  expect((await diff.findAll({ type: 'Button' })).map(one => String(one.props.label))).toEqual(['Details', 'Whole file'])
  // Whole file draws the file itself, numbered, and Changes goes back
  await diff.press({ key: (await diff.findAll({ type: 'Button' })).find(one => one.props.label === 'Whole file')?.key ?? '' })
  expect(await until(async () => (await code()).find(one => one.startLine === 1))).toEqual({ source: 'x', format: undefined, startLine: 1 })
  await diff.unmount()
  // A file new since the task began is drawn whole, with nothing to switch
  await tab.press({ key: (await tab.findAll({ type: 'Button' })).find(one => one.props.label === 'README.md')?.key ?? '' })
  const newTab = await until(async () => tabs.find(one => /^diff-.*: README\.md$/.test(one)))
  const fresh = await $.ui.mount({ ...LIST, requestId: String(newTab).split(':')[0], props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect(await until(async () => (await fresh.findAll({ type: 'Code' }))[0]?.props.startLine)).toBe(1)
  expect(await texts(fresh)).toContain('new ·')
  expect((await fresh.findAll({ type: 'Button' })).map(one => String(one.props.label))).toEqual(['Details'])
  await fresh.unmount()
  await tab.unmount()
  // A terminal draws each bar in cells: added, removed, then the track
  const term = await $.ui.mount({ ...LIST, requestId: 'work-a1', props: { ...LIST.props, bodyColumns: 80 }, surface: 'terminal' } as never)
  await until(async () => ((await texts(term)).includes('■■■■■■') ? true : undefined))
  expect((await texts(term)).filter(text => /^[■·]+$/.test(text))).toEqual(['■■■', '■', '··', '■■■■■■'])
  await term.unmount()
  // Done: what its result names joins in, but a code file it names stays in the count, and only a link it says it made is a thing
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: `The report is made: ${pdf}. The fix is in /repo/src/app.ts.\n\nReport added: https://os.example.com/reports/9\nSee the guide at https://docs.example.com/guide` } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a1' } as never)
  await until(async () => (await keyed(pane, 'made-a1-link-0-open')) || undefined)
  expect((await pane.findAll({ type: 'Button' })).filter(one => String(one.key).startsWith('made-a1-')).map(one => String(one.props.label))).toEqual(['3 pictures', 'vat-report', 'os report 9 ↗', '2 changed files'])
  await pane.unmount()
  expect(logged).toEqual([])
})
