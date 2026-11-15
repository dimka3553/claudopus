// F-019 and F-020 of the security review, for the hourly look: it only reads the version page and shows a newer version with Install;
// nothing is downloaded, installed or reloaded until that press, and a lock dated ahead of the clock holds none of it

const UPD_NOW = 1_700_000_000_000
const reloadsOf = (on: On) => {
  const reloads: string[] = []
  on('command.run', { command: 'reload-plugins' } as never, () => (reloads.push('reload-plugins'), { value: { text: 'Reloaded' } }) as never)
  return reloads
}

test('F-019 · the hourly look only reads the version page: a newer version is shown with Install, and nothing is downloaded, installed or reloaded', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on)
  const reloads = reloadsOf(on)
  let fetches = 0
  on('http.fetch', () => ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: '{"version":"9.9.9"}' } }) as never)
  // Even with a branch online that a look would bring the folder up to
  files.set('git:online', '9.9.9')
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  expect(await until(async () => fetches || undefined)).toBe(1)
  const panel = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await until(() => panel.find({ type: 'Text', text: 'Claudopus 9.9.9 is out' }))).toBeDefined()
  expect(await keyed(panel, 'update-install')).toBeDefined()
  // Within the hour no second look, and through all of it nothing ran: no git, no update step, no reload
  await clock.advance(20 * 60_000)
  expect(fetches).toBe(1)
  expect(gitRan).toEqual([])
  expect(files.get('manifest')).toBeUndefined()
  expect(reloads).toEqual([])
  expect(files.get(`${MEMORY}/log.md`) ?? '').not.toContain('reloading it')
  // Turned off in Config, the look reads nothing more, and the card is gone
  ownSet(files, 'config.json', JSON.stringify({ updates: false }))
  await clock.advance(61 * 60_000)
  expect(fetches).toBe(1)
  expect(await until(async () => ((await panel.find({ type: 'Text', text: 'Claudopus 9.9.9 is out' })) ? undefined : true))).toBe(true)
})

test('F-019 · Install installs through the same steps as Check for updates, then reloads this chat alone', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on)
  const reloads = reloadsOf(on)
  on('http.fetch', () => ({ value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.2"}' } }) as never)
  files.set('git:online', '0.1.2')
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 70 }, surface: 'desktop' } as never)
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  expect(gitRan).toEqual([])
  await pressed(panel, 'update-install')
  expect(await until(async () => reloads.length || undefined)).toBe(1)
  // The folder moved forward to it (Claude Code's own steps for an installed copy), and the next load knows what it moved from
  expect(gitRan).toContain('merge --ff-only --quiet @{u}')
  expect(JSON.parse(files.get('manifest') ?? '{}').version).toBe('0.1.2')
  const mark = [...files.entries()].find(([path]) => path.startsWith(`${MEMORY}/reloads/`))?.[1]
  expect(JSON.parse(mark ?? '{}')).toMatchObject({ version: '0.1.2', from: '0.1.0' })
})

test('F-019 · a chat run from another Mac installs at the press but is not sent a reload: it says to type /reload-plugins', SLOW, async ($, on) => {
  const { files, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  const reloads = reloadsOf(on)
  on('http.fetch', () => ({ value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.2"}' } }) as never)
  files.set('git:online', '0.1.2')
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 70 }, surface: 'desktop' } as never)
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  await pressed(panel, 'update-install')
  expect(await until(() => panel.find({ type: 'Text', text: 'v0.1.2 is in its folder now. Type /reload-plugins to switch this chat to it.' }))).toBeDefined()
  expect(reloads).toEqual([])
})

test('F-020 · a lock on the update dated ahead of this clock holds nothing: the hourly look reads the page all the same', SLOW, async ($, on) => {
  const { files, clock } = world(on)
  let fetches = 0
  on('http.fetch', () => ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.0"}' } }) as never)
  files.set(`${MEMORY}/update.lock`, `${UPD_NOW + 365 * 24 * 3_600_000} planted`)
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  expect(await until(async () => fetches || undefined)).toBe(1)
  // The version page names the one this chat runs: no card
  const panel = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 70 }, surface: 'desktop' } as never)
  expect(await panel.find({ type: 'Text', text: /is out$/ })).toBeUndefined()
})
