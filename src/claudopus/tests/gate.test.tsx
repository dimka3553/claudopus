// The admin gate: an admin command waits for the person's press on its work's card

const ADMIN = '/plug/claudopus/bin/admin'
const GRANTS = `${MEMORY}/admin-grants/`
const ALLOWED = `${MEMORY}/admin-allowed.json`
// A piece of work under way in a chat of Sam's, and the panel
const gated = async ($: Parameters<Parameters<typeof test>[1]>[0], on: On, config: Record<string, unknown> = {}, options: Parameters<typeof world>[1] = {}) => {
  const w = world(on, options)
  w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', ...config }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Fix the hosts file', prompt: 'fix the hosts file' } as never)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  const bash = (id: string, command: string, agentId = 'a1', more: Record<string, unknown> = {}) => $.tool.call({ tool: 'Bash', tool_use_id: id, command, agentId, ...more } as never)
  const labels = async () => (await list.findAll({ type: 'Button' })).map(one => String(one.props.label ?? ''))
  // The call is held once its buttons are on the card
  const held = async (id: string) => until(async () => keyed(list, `gate-${id}-0-deny`))
  const grants = () => [...w.files.keys()].filter(path => path.startsWith(GRANTS))
  // A press on a card's gate, and the second after which the held call reads it
  const press = async (key: string) => (await pressed(list, key), w.wake())
  return { ...w, list, bash, labels, held, grants, press }
}

test('an admin command is held however the runner is reached, and nothing else is taken for one', async ($, on) => {
  const { press, bash, held, admins, list } = await gated($, on)
  let n = 0
  for (const command of [
    `${ADMIN} here "id -u"`,
    `/plug/claudopus/bin/../bin/admin here 'id -u'`,
    `/plug/claudopus//bin/./admin here 'id -u'`,
    `cd /plug/claudopus/bin && ./admin here 'id -u'`,
    `cd /plug/claudopus && bin/admin here 'id -u'`,
    `"$CLAUDE_PLUGIN_ROOT"/bin/admin here 'id -u'`,
    `X=1 env Y=2 ${ADMIN} here 'id -u'`,
    `nohup ${ADMIN} here 'id -u' &`,
    `timeout 600 ${ADMIN} here 'id -u'`,
    `command ${ADMIN} here 'id -u'`,
    `bash -c "${ADMIN} here 'id -u'"`,
    `sh -lc '${ADMIN} here "id -u"'`,
    `bash ${ADMIN} here 'id -u'`,
    `eval "${ADMIN} here 'id -u'"`,
    `out=$(${ADMIN} here 'id -u') && echo "$out"`,
    `echo start; ${ADMIN} here 'id -u' | grep 0`,
    `sudo -u root ${ADMIN} here 'id -u'`,
    `if ${ADMIN} here 'id -u'; then echo yes; fi`,
    `if true; then ${ADMIN} here 'id -u'; fi`,
  ]) {
    const id = `d${(n += 1)}`
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    // Each shows the command as the runner would be handed it
    expect((await list.find({ type: 'Text', text: 'id -u' }))?.props.mono).toBe(true)
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // The command is shown as the shell hands it over, quotes inside it and all
  const quoted = bash('q1', `${ADMIN} here 'echo "a b" > /etc/x; chmod 644 /etc/x'`)
  expect(await held('q1')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'echo "a b" > /etc/x; chmod 644 /etc/x' })).toBeDefined()
  await press('gate-q1-0-deny')
  await quoted
  // Inside double quotes a backslash stays, as the shell leaves it, unless it escapes a quote, a dollar or itself
  const slashed = bash('q2', `${ADMIN} here "printf 'a\\nb' > \\"/etc/x y\\""`)
  expect(await held('q2')).toBeDefined()
  expect(await list.find({ type: 'Text', text: `printf 'a\\nb' > "/etc/x y"` })).toBeDefined()
  await press('gate-q2-0-deny')
  await slashed
  expect(admins).toEqual([])
  // Words about it, forgetting a password, and other tools are no admin command: they run as they are
  for (const command of [`git commit -m "bin/admin here 'id -u' now asks"`, `echo ${ADMIN} here id`, `${ADMIN} here --forget`, `${ADMIN}`, 'django-admin migrate', 'ls bin/admin', `cat ${ADMIN}`, '/usr/local/bin/admin here now', 'vendor/bin/admin migrate up']) expect((await bash(`n${(n += 1)}`, command)).result).toBe('ran')
})

test('asked each time: the call is held, its card shows the exact command and the Mac with three buttons, and Allow once lets that one command run', async ($, on) => {
  const { press, list, bash, labels, held, grants, admins, logged, notified, files } = await gated($, on)
  let done = false
  const call = bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`).then(r => ((done = true), r))
  expect(await held('b1')).toBeDefined()
  // Held: nothing ran, and nothing is granted
  expect(done).toBe(false)
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  expect((await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' }))?.props.color).toBe('#E5A50A')
  expect((await list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' }))?.props.mono).toBe(true)
  expect((await labels()).filter(one => ['Allow once', 'Always allow this command', 'Deny'].includes(one))).toEqual(['Allow once', 'Always allow this command', 'Deny'])
  // Said in the chat and as a notification; its Details tab has it at the top
  expect(logged.some(line => line.includes('The work "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts') && line.includes('Nothing typed in the chat allows it'))).toBe(true)
  expect(notified).toContain('Fix the hosts file needs you | Wants to run an admin command on this Mac: chmod 644 /etc/hosts')
  const details = await $.ui.mount({ ...LIST, requestId: 'work-a1', surface: 'desktop' } as never)
  expect(await details.find({ type: 'Text', text: 'Needs you now' })).toBeDefined()
  await press('gate-b1-0-once')
  expect((await call).result).toBe('ran')
  // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
  expect(admins.length).toBe(1)
  const [grant] = admins[0]?.grants ?? []
  expect(admins[0]?.grants.length).toBe(1)
  expect({ host: grant?.host, command: grant?.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' })
  expect(grant?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', `grant\n${grant?.id}\n${grant?.at}\nhere\nchmod 644 /etc/hosts`))
  expect(grants()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeUndefined()
  expect(files.has(ALLOWED)).toBe(false)
  // Once is once: the same command again is held again
  void bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await held('b2')).toBeDefined()
  expect(admins.length).toBe(1)
})

test('Deny refuses the call with a line that says the person refused it, and nothing runs or is granted', async ($, on) => {
  const { press, list, bash, held, grants, admins } = await gated($, on)
  const call = bash('b1', `${ADMIN} m4 'rm -rf /Library/Caches/x'`)
  expect(await held('b1')).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })).toBeDefined()
  await press('gate-b1-0-deny')
  const r = await call
  expect(r.deny).toBe('Refused by Sam: Sam pressed Deny on this admin command, so it did not run. Do not try to run it another way. Carry on without it, or say what it is needed for and ask again.')
  expect(admins).toEqual([])
  expect(grants()).toEqual([])
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })).toBeUndefined()
})

test('no way to the runner gets past the press: another spelling, a shell, a helper, and two commands in one call each wait', async ($, on) => {
  const { press, list, bash, held, admins, labels } = await gated($, on)
  // A helper's call shows on the card of the work it helps
  await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' } as never)
  let n = 0
  for (const command of [`cd /plug/claudopus/bin && ./admin here 'id -u'`, `bash -c "/plug/claudopus/bin/../bin/admin here 'id -u'"`, `X=1 env ${ADMIN} here 'id -u'`, `eval "${ADMIN} here 'id -u'"`]) {
    const id = `s${(n += 1)}`
    const call = bash(id, command, n % 2 ? 'a2' : 'a1')
    expect(await held(id)).toBeDefined()
    expect(admins.length).toBe(0)
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // Two in one call: the first allowed, the second asked in its turn; denied, neither runs and the first grant is taken back
  const both = bash('t1', `${ADMIN} here 'id -u' && ${ADMIN} here 'whoami'`)
  expect(await held('t1')).toBeDefined()
  await press('gate-t1-0-once')
  expect(await until(async () => keyed(list, 'gate-t1-1-deny'))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'whoami' })).toBeDefined()
  await press('gate-t1-1-deny')
  expect((await both).deny).toContain('Refused by Sam')
  expect(admins.length).toBe(0)
  expect(await labels()).not.toContain('Deny')
  // Words typed in the chat and passed on by the chat allow nothing: only the press does
  const waiting = bash('w1', `${ADMIN} here 'id -u'`)
  expect(await held('w1')).toBeDefined()
  await $.prompt.submit({ text: 'Allow once', wait: false, origin: composer })
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow once' } as never)
  expect(await keyed(list, 'gate-w1-0-once')).toBeDefined()
  expect(admins.length).toBe(0)
  await press('gate-w1-0-deny')
  await waiting
})

test('Always allow this command keeps the exact command for its Mac, sealed; Config lists it with Remove, and a list work wrote itself allows nothing', async ($, on) => {
  const { press, list, bash, held, admins, files, tabs } = await gated($, on)
  const first = bash('b1', `${ADMIN} here 'softwareupdate -l'`)
  expect(await held('b1')).toBeDefined()
  await press('gate-b1-0-always')
  expect((await first).result).toBe('ran')
  const kept = JSON.parse(files.get(ALLOWED) ?? '{}') as Record<string, { command: string; seal: string }[]>
  expect(kept.here?.map(one => one.command)).toEqual(['softwareupdate -l'])
  expect(kept.here?.[0]?.seal).toBe(fakeSeal(files.get('keychain:gate') ?? '', 'allow\nhere\nsoftwareupdate -l'))
  // The same command on the same Mac now runs without a press, with its own grant
  expect((await bash('b2', `${ADMIN} here 'softwareupdate -l'`)).result).toBe('ran')
  expect(admins.length).toBe(2)
  expect(admins[1]?.grants.map(one => one.command)).toEqual(['softwareupdate -l'])
  // Another command, or the same one on another Mac, still asks
  for (const [id, command] of [['b3', `${ADMIN} here 'softwareupdate -l -a'`], ['b4', `${ADMIN} m4 'softwareupdate -l'`]] as const) {
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    await press(`gate-${id}-0-deny`)
    await call
  }
  // An entry with no seal, or another entry's seal, as work could write into the file, allows nothing
  const forged = { here: [...(kept.here ?? []), { command: 'rm -rf /', seal: kept.here?.[0]?.seal ?? '', at: 1 }, { command: 'reboot', seal: '', at: 1 }] }
  files.set(ALLOWED, JSON.stringify(forged))
  for (const [id, command] of [['f1', `${ADMIN} here 'rm -rf /'`], ['f2', `${ADMIN} here 'reboot'`]] as const) {
    const call = bash(id, command)
    expect(await held(id)).toBeDefined()
    await press(`gate-${id}-0-deny`)
    expect((await call).deny).toContain('Refused by Sam')
  }
  // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined()
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Always allowed' })).toBeDefined()
  expect((await config.find({ type: 'Text', text: 'softwareupdate -l' }))?.props.mono).toBe(true)
  expect(await config.find({ type: 'Text', text: 'rm -rf /' })).toBeUndefined()
  expect(await config.find({ type: 'Text', text: /2 more in the file were not added by your press and allow nothing/ })).toBeDefined()
  const before = files.get('keychain:gate')
  const stale = JSON.stringify(kept)
  await pressed(config, 'config-admin-remove-0')
  expect(await until(async () => (JSON.parse(files.get(ALLOWED) ?? '{"here":[1]}').here === undefined ? true : undefined))).toBe(true)
  expect(await config.find({ type: 'Text', text: /^None yet/ })).toBeDefined()
  // Removing made a new key: the old entry put back, seal and all, allows nothing
  expect(files.get('keychain:gate')).not.toBe(before)
  files.set(ALLOWED, stale)
  const again = bash('b5', `${ADMIN} here 'softwareupdate -l'`)
  expect(await held('b5')).toBeDefined()
  await press('gate-b5-0-deny')
  await again
})

test('work never reads or writes the allowed list, the grants or the key that seals them', async ($, on) => {
  const { press, bash, files } = await gated($, on)
  for (const command of [
    `echo '{"here":[{"command":"reboot","seal":"x"}]}' > ~/.claude/claudopus/admin-allowed.json`,
    `cat ${MEMORY}/admin-allowed.json`,
    `cp /tmp/g.json ${MEMORY}/admin-grants/g.json`,
    'security add-generic-password -U -s claudopus-admin-gate -a seal -w abc',
    'security delete-generic-password -s claudopus-admin-gate -a seal',
  ])
    expect((await bash(`t${command.length}`, command)).deny).toContain('only Sam adds to them')
  for (const tool of ['Write', 'Edit'])
    for (const path of [ALLOWED, `${GRANTS}g.json`]) expect((await $.tool.call({ tool, tool_use_id: `w-${tool}-${path.length}`, file_path: path, content: '{}', agentId: 'a1' } as never)).deny).toContain('only Sam adds to them')
  expect(files.has(ALLOWED)).toBe(false)
  // The memory folder's other files are work's to write as before
  expect((await $.tool.call({ tool: 'Write', tool_use_id: 'w9', file_path: `${MEMORY}/streams/x.md`, content: 'x', agentId: 'a1' } as never)).deny).toBeUndefined()
})

test('asked once per piece of work: one Allow covers that work and its helpers until it ends, and no other work', async ($, on) => {
  const { press, list, bash, held, admins, files, labels, tabs } = await gated($, on)
  // The setting is chosen in Config, which seals it
  await pressed(list, 'config-open')
  expect(await until(async () => tabs.find(tab => tab === 'config: Config'))).toBeDefined()
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Ask before an admin command' })).toBeDefined()
  await config.select({ key: 'config-admin-mode-pick', value: 'work' })
  const sealedAs = await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}') as { admin?: string; adminSealed?: string }).adminSealed)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal(files.get('keychain:gate') ?? '', 'mode\nwork') })
  expect(sealedAs).toBeDefined()
  await $.agent.spawn({ ...spawn, description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' } as never)
  await $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Update the other Mac', prompt: 'update the other Mac' } as never)
  const first = bash('b1', `${ADMIN} here 'id -u'`)
  expect(await held('b1')).toBeDefined()
  expect(await labels()).toContain('Allow for this work')
  expect(await labels()).not.toContain('Allow once')
  await press('gate-b1-0-once')
  expect((await first).result).toBe('ran')
  // Its later commands, and its helper's, run without another press, each with its own grant
  expect((await bash('b2', `${ADMIN} here 'chmod 644 /etc/hosts'`)).result).toBe('ran')
  expect((await bash('b3', `${ADMIN} m4 'whoami'`, 'a2')).result).toBe('ran')
  expect(admins.map(one => one.grants.map(grant => grant.command))).toEqual([['id -u'], ['chmod 644 /etc/hosts'], ['whoami']])
  // Another piece of work is asked for itself
  const other = bash('b4', `${ADMIN} here 'id -u'`, 'a3')
  expect(await held('b4')).toBeDefined()
  await press('gate-b4-0-deny')
  expect((await other).deny).toContain('Refused by Sam')
  // Ended and started again, it asks again
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  const back = bash('b5', `${ADMIN} here 'id -u'`)
  expect(await held('b5')).toBeDefined()
  await press('gate-b5-0-deny')
  await back
  expect(admins.length).toBe(3)
})

for (const admin of ['never', 'work'])
  test(`"${admin}" written into config.json by anything but Config counts for nothing: every command still asks`, async ($, on) => {
    const { press, bash, held, admins, files } = await gated($, on, { admin, adminSealed: fakeSeal('kept-key', `mode\n${admin}`).replace(/^./, 'z') })
    files.set('keychain:gate', 'kept-key')
    const call = bash('b1', `${ADMIN} here 'id -u'`)
    expect(await held('b1')).toBeDefined()
    expect(admins.length).toBe(0)
    await press('gate-b1-0-deny')
    await call
    const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
    expect(await config.find({ type: 'Text', text: new RegExp(`config\\.json says "${admin}", but it was not chosen here, so every command asks`) })).toBeDefined()
  })

test('never asked, as Config sealed it: the call goes through as it was made, with no hold, no grant and nothing on the card', async ($, on) => {
  const { press, list, bash, admins, files, grants, logged, notified } = await gated($, on, { admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }, { env: {} })
  files.set('keychain:gate', 'kept-key')
  const before = [...files.keys()].filter(path => !path.endsWith('log.md')).sort()
  const r = await bash('b1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(r.result).toBe('ran')
  expect(r.deny).toBeUndefined()
  expect(admins).toEqual([{ command: `${ADMIN} here 'chmod 644 /etc/hosts'`, grants: [] }])
  expect(grants()).toEqual([])
  expect(files.has(ALLOWED)).toBe(false)
  expect([...files.keys()].filter(path => !path.endsWith('log.md') && !path.includes('/live/')).sort()).toEqual(before.filter(path => !path.includes('/live/')))
  expect(logged.some(line => line.includes('admin command'))).toBe(false)
  expect(notified.some(line => line.includes('admin command'))).toBe(false)
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeUndefined()
  // Config's Reset puts the asking back, and makes a new key
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  await pressed(config, 'config-admin-mode-back')
  expect(await until(async () => (JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').admin === undefined ? true : undefined))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam' })
  expect(files.get('keychain:gate')).not.toBe('kept-key')
})

test('with no panel to ask on, an admin command is refused, never run unasked', async ($, on) => {
  const { press, bash, admins } = await gated($, on, {}, { headless: true })
  expect((await bash('b1', `${ADMIN} here 'id -u'`)).deny).toContain('no panel is drawn for this chat')
  expect(admins).toEqual([])
})

test('Let macOS ask, keep nothing: chosen in Config it forgets every kept password, and it runs admin commands on this Mac only', async ($, on) => {
  const { press, list, bash, held, admins, files } = await gated($, on)
  const config = await $.ui.mount({ ...LIST, requestId: 'config', props: { ...LIST.props, title: 'Config', bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await config.find({ type: 'Text', text: 'Admin password' })).toBeDefined()
  expect(await config.find({ type: 'Text', text: /a password can be read by any process running as you/ })).toBeDefined()
  expect(((await config.find({ type: 'Select', key: 'config-admin-password-pick' } as never))?.props.options as { label: string }[]).map(one => one.label)).toEqual(["Keep it in this Mac's keychain", 'Let macOS ask, keep nothing'])
  await config.select({ key: 'config-admin-password-pick', value: 'macos' })
  expect(await until(async () => files.get('keychain:admin-forgotten'))).toBe('yes')
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}')).toEqual({ name: 'Sam', adminPassword: 'macos' })
  // Another Mac has no screen here for macOS to ask on
  expect((await bash('b1', `${ADMIN} m4 'id -u'`)).deny).toContain('works only on this Mac')
  // On this Mac the card still asks first
  const call = bash('b2', `${ADMIN} here 'id -u'`)
  expect(await held('b2')).toBeDefined()
  await press('gate-b2-0-once')
  expect((await call).result).toBe('ran')
  expect(admins.length).toBe(1)
})

test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work", async ($, on) => {
  const w = world(on)
  w.files.set('keychain:gate', 'kept-key')
  w.files.set(`${MEMORY}/config.json`, JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  for (const id of ['c1', 'c2']) {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: `${ADMIN} here 'id -u'` } as never)
    expect(await until(async () => keyed(list, `gate-${id}-0-deny`))).toBeDefined()
    expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeDefined()
    // No piece of work to allow it for: the chat's thread never ends, so it is asked each time
    expect((await list.findAll({ type: 'Button' })).map(one => one.props.label)).toContain('Allow once')
    expect((await list.findAll({ type: 'Button' })).map(one => one.props.label)).not.toContain('Allow for this work')
    await pressed(list, `gate-${id}-0-once`)
    w.wake()
    expect((await call).result).toBe('ran')
  }
  expect(w.admins.length).toBe(2)
})

test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", async ($, on) => {
  const { files, clock } = world(on)
  await $.session.start(start)
  const at = 1_700_000_000_000
  files.set(`${MEMORY}/live/chat-b.json`, JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at }], startedAt: at - 60_000, endedAt: 0, status: 'working' }] }))
  await clock.advance(5000)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await until(async () => list.find({ type: 'Text', text: 'softwareupdate -i -a' }))).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })).toBeDefined()
  expect(await list.find({ type: 'Text', text: 'Allow or deny it on its card in its own chat.' })).toBeDefined()
  expect((await list.findAll({ type: 'Button' })).some(one => ['Allow once', 'Always allow this command', 'Deny'].includes(String(one.props.label)))).toBe(false)
})
