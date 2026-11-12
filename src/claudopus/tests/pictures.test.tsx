// Pictures a piece of work made, in its chat

test("the pictures a work made are in its chat where it made them: drawn small where the panel can, large in place on a press and never in another app, a gone one named", async ($, on) => {
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
  const { files, logged } = world(on, { talk })
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
    expect(labels.filter(label => label.includes('Picture:'))).toEqual(['▸ Picture: chart.svg'])
    const svgs = (await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt).startsWith('Picture:'))
    expect(svgs.map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
    expect((await tab.find({ type: 'Text', text: /^Picture: gone\.png/ }))?.text).toBe('Picture: gone.png · no longer kept')
    expect(labels.some(label => label.includes('before.png'))).toBe(false)
    // Pressed, it is drawn large where it is, with where the file is; pressed again, small
    await pressed(tab, 'pic-open-1-0')
    expect((await keyed(tab, 'pic-open-1-0'))?.props.label).toBe('▾ Picture: chart.svg')
    expect((await tab.find({ type: 'Text', text: svg }))?.text).toBe(svg)
    expect((await tab.findAll({ type: 'Svg' })).filter(one => String(one.props.alt) === 'Picture: chart.svg').map(one => String(one.props.source).slice(0, 4))).toEqual(surface === 'terminal' ? [] : ['<svg'])
    await pressed(tab, 'pic-open-1-0')
    expect((await keyed(tab, 'pic-open-1-0'))?.props.label).toBe('▸ Picture: chart.svg')
    expect(await tab.find({ type: 'Text', text: svg })).toBeUndefined()
    await tab.unmount()
    await pane.unmount()
  }
  expect(logged).toEqual([])
})
