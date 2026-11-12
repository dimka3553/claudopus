// The servers panel

test('the servers panel opens when asked, lists the servers running from my folders with a link, names the chat that started each, and stops one', async ($, on) => {
  const { files, killed, opened, closed, clock } = world(on, { panes: ['servers'] })
  files.set(`${HOME}/.claude/sessions/500.json`, '{"pid":500,"sessionId":"s-1","name":"Photo to 3D","cwd":"/Users/sam/x"}')
  await $.session.start(start)
  // The panel an earlier version opened by itself is put away
  expect(closed).toEqual(['agents'])
  await $.command.run({ command: 'servers', args: '' } as never)
  expect(opened).toEqual(['servers'])

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const pane = await $.ui.mount({ ...PANE, surface } as never)
    const link = await pane.find({ type: 'Link' })
    expect(link?.props.href).toBe('http://localhost:3100')
    expect(link?.props.label).toBe('localhost:3100')
    expect((await pane.find({ type: 'Text', text: /Photo to 3D/ }))?.text).toBe('3d-sandbox · Photo to 3D')
    // The system's own listener is not one of mine
    expect(await pane.find({ type: 'Text', text: /7000/ })).toBeUndefined()
    await pane.unmount()
  }
  // Kept for when the chat's process has gone and the server has no parent left
  expect(files.get(`${MEMORY}/servers.json`)).toContain('Photo to 3D')

  const pane = await $.ui.mount({ ...PANE, surface: 'desktop' } as never)
  const press = pane.press({ key: 'kill-700' })
  await clock.advance(1000)
  await press
  expect(killed).toEqual(['700'])
  expect(await pane.find({ type: 'Link' })).toBeUndefined()
  expect((await pane.find({ type: 'Text' }))?.text).toBe('Nothing is listening from your folders.')
  await pane.unmount()
})
