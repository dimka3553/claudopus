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
  expect((await pane.find({ type: 'Text' }))?.text).toBe('No servers are running from your folders.')
  await pane.unmount()
})

// On Windows: what listens is netstat's, who runs it and from where PowerShell's, and a Stop ends it with what it started
test('on a Windows PC the servers panel lists the servers a chat started or that run from my folders, from netstat and PowerShell, and Stop ends one with what it started', async ($, on) => {
  let isGone = false
  const pc = windowsPC(on, run => {
    const words = run.argv.join(' ')
    if (/^netstat/i.test(run.argv[0] ?? ''))
      return [
        '',
        'Active Connections',
        '',
        '  Proto  Local Address          Foreign Address        State           PID',
        '  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1100',
        ...(isGone ? [] : ['  TCP    0.0.0.0:3100           0.0.0.0:0              LISTENING       7000', '  TCP    [::]:3100              [::]:0                 LISTENING       7000']),
        '  TCP    127.0.0.1:4070         0.0.0.0:0              ABHÖREN         8800',
        '  TCP    127.0.0.1:52000        127.0.0.1:3100         ESTABLISHED     9100',
        '',
      ].join('\r\n')
    if (words.includes('Win32_Process') && words.includes('CommandLine'))
      return [
        '1100\t700\tC:\\Windows\\System32\\svchost.exe\tsvchost.exe\tC:\\Windows\\system32\\svchost.exe -k RPCSS',
        '5000\t4000\tC:\\Users\\sam\\AppData\\Roaming\\Claude\\claude-code\\2.1.330\\4262a1273231\\claude.exe\tclaude.exe\tclaude.exe --output-format stream-json',
        '6000\t5000\tC:\\Program Files\\Git\\usr\\bin\\bash.exe\tbash.exe\tbash -c npm run dev',
        '7000\t6000\tC:\\Program Files\\nodejs\\node.exe\tnode.exe\t"C:\\Program Files\\nodejs\\node.exe" C:\\Users\\sam\\Documents\\GitHub\\3d-sandbox\\node_modules\\next\\dist\\bin\\next dev -p 3100',
        '8800\t1\tC:\\Users\\sam\\AppData\\Roaming\\Spotify\\Spotify.exe\tSpotify.exe\t"C:\\Users\\sam\\AppData\\Roaming\\Spotify\\Spotify.exe"',
        '',
      ].join('\r\n')
    if (/^taskkill/i.test(run.argv[0] ?? '')) return ((isGone = true), '')
    return undefined
  })
  const { files, clock } = world(pc.on, { windows: true, panes: ['servers'] })
  files.set('C:/Users/sam/.claude/sessions/5000.json', '{"pid":5000,"sessionId":"s-1","name":"Photo to 3D","cwd":"C:\\\\Users\\\\sam\\\\x"}')
  await $.session.start(start)
  await $.command.run({ command: 'servers', args: '' } as never)
  const pane = await $.ui.mount({ ...PANE, surface: 'desktop' } as never)
  const link = await until(() => pane.find({ type: 'Link' }))
  expect(link?.props.href).toBe('http://localhost:3100')
  expect((await pane.find({ type: 'Text', text: /Photo to 3D/ }))?.text).toBe('3d-sandbox · Photo to 3D')
  // Windows' own listener and an app in the person's AppData are not theirs
  expect(await pane.find({ type: 'Text', text: /135|4070/ })).toBeUndefined()
  expect((await pane.findAll({ type: 'Link' })).length).toBe(1)
  const press = pane.press({ key: 'kill-7000' })
  await clock.advance(1000)
  await press
  expect(pc.runs.filter(run => /^taskkill/i.test(run.argv[0] ?? '')).map(run => run.argv)).toEqual([['taskkill', '/PID', '7000', '/T', '/F']])
  expect((await until(() => pane.find({ type: 'Text', text: 'No servers are running from your folders.' })))?.text).toBe('No servers are running from your folders.')
  await pane.unmount()
})
