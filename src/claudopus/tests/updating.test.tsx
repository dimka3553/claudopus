// F-019 and F-020 of the security review, and the update's three steps: a look only reads the version page and the panel says a
// newer version is out; nothing is fetched, installed or reloaded until a press, each step its own; a download that is not what the
// release published is thrown away and can never be installed; each step stands through a reload; a lock dated ahead holds nothing

const UPD_NOW = 1_700_000_000_000
const TREE = 'a'.repeat(40)
const COMMIT = 'c'.repeat(40)
const RELEASE = { version: '0.1.2', commit: COMMIT, tree: TREE }
const pageText = (version = '0.1.2', tree = TREE) =>
  JSON.stringify({ version, tree, size: 4_200_000, versions: [{ version, line: 'The bar shows the battery', more: 2 }, { version: '0.1.1', line: 'Runs show time left', more: 0 }, { version: '0.1.0', line: 'First', more: 0 }] })
const reloadsOf = (on: On) => {
  const reloads: string[] = []
  on('command.run', { command: 'reload-plugins' } as never, () => (reloads.push('reload-plugins'), { value: { text: 'Reloaded' } }) as never)
  return reloads
}
const pageOn = (on: On, text: () => string) => {
  let fetches = 0
  on('http.fetch', () => ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: text() } }) as never)
  return () => fetches
}
const listAt = (surface = 'desktop') => ({ ...LIST, props: { ...LIST.props, bodyColumns: 70 }, surface }) as never
// The text shown, or a failure that lists what is shown instead
const shownIn = async (pane: { find: (q: { type: string; text: string | RegExp }) => Promise<unknown>; findAll: (q: { type: string }) => Promise<readonly { text?: unknown }[]> }, text: string | RegExp) => {
  const found = await until(() => pane.find({ type: 'Text', text }) as Promise<{} | undefined>)
  if (!found) throw new Error(`not shown: ${String(text)}; shown: ${(await pane.findAll({ type: 'Text' })).map(one => String(one.text)).join(' | ').slice(0, 1200)}`)
  return found
}
// Time on, in steps the kit's clock can take with the panel's one-second beat running
const later = async (clock: { advance: (ms: number) => Promise<unknown> }, ms: number) => {
  for (let left = ms; left > 0; left -= 20 * 60_000) await clock.advance(Math.min(left, 20 * 60_000))
}
const changing = (ran: string[]) => ran.filter(one => /^(fetch|merge|reset|checkout|pull|update-ref)\b/.test(one) || one.includes('fetch --progress'))

test('F-019 · the look only reads the version page: the panel says a newer version is out, with Download, and nothing is fetched, installed or reloaded, whatever config.json says', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: RELEASE })
  const reloads = reloadsOf(on)
  const fetches = pageOn(on, () => pageText())
  // Keys an earlier version or a planted file might use to ask for installing by itself: none of them is read
  ownSet(files, 'config.json', JSON.stringify({ updates: true, updateEvery: 1, autoInstall: true, autoUpdate: true, install: 'always' }))
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  expect(await until(async () => fetches() || undefined)).toBe(1)
  const panel = await $.ui.mount(listAt())
  await shownIn(panel, 'Claudopus 0.1.2 is out')
  expect(await panel.find({ type: 'Text', text: '· 2 versions since yours' })).toBeDefined()
  await shownIn(panel, 'The bar shows the battery · and 3 more changes')
  expect(await keyed(panel, 'update-download')).toBeDefined()
  expect(await keyed(panel, 'update-install')).toBeUndefined()
  // Another look once the last is over an hour old, and through all of them nothing was fetched or moved, nothing installed or reloaded
  const aged = async () => files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: (await clock.now()) - 2 * 3_600_000, version: '0.1.2', result: 'seen' }))
  await aged()
  await later(clock, 16 * 60_000)
  expect(await until(async () => (fetches() > 1 ? true : undefined))).toBe(true)
  expect(changing(gitRan)).toEqual([])
  expect(files.get('manifest')).toBeUndefined()
  expect(reloads).toEqual([])
  expect(files.get(`${MEMORY}/update-steps.json`)).toBeUndefined()
  // Only when I ask: the look reads nothing more
  ownSet(files, 'config.json', JSON.stringify({ updates: false }))
  const before = fetches()
  await aged()
  await later(clock, 16 * 60_000)
  expect(fetches()).toBe(before)
})

test('Download fetches the release and checks it against what the release published: one that does not match is thrown away and cannot be installed', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: { ...RELEASE, got: 'b'.repeat(40) } })
  const reloads = reloadsOf(on)
  pageOn(on, () => pageText())
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  await pressed(panel, 'update-download')
  await shownIn(panel, "Couldn't fetch Claudopus 0.1.2")
  await shownIn(panel, "What came down isn't what the release published, so it was thrown away. Nothing was changed: this chat still runs v0.1.0.")
  expect(await keyed(panel, 'update-install')).toBeUndefined()
  expect(gitRan).toContain('update-ref -d refs/claudopus/update')
  // A steps file that says it was downloaded, planted or left from before: Install checks it again and installs nothing
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: await clock.now() }))
  files.set('git:ref', COMMIT)
  await panel.unmount()
  const again = await $.ui.mount(listAt())
  expect(await until(() => keyed(again, 'update-install'))).toBeDefined()
  await pressed(again, 'update-install')
  await shownIn(again, "Couldn't move the folder to Claudopus 0.1.2")
  expect(gitRan.some(one => one.startsWith('merge '))).toBe(false)
  expect(files.get('manifest')).toBeUndefined()
  expect(reloads).toEqual([])
})

test('Download, Install and Reload are each their own press: the folder moves only at Install, the chat reloads only at Reload', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: RELEASE })
  const reloads = reloadsOf(on)
  pageOn(on, () => pageText())
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  await pressed(panel, 'update-download')
  await shownIn(panel, 'Claudopus 0.1.2 fetched')
  await shownIn(panel, /^Checked: it is what the release published\. Move forward takes .* from v0\.1\.0 to v0\.1\.2/)
  expect(JSON.parse(files.get(`${MEMORY}/update-steps.json`) ?? '{}')).toMatchObject({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE })
  // Downloaded, nothing the chat runs has moved
  expect(gitRan.some(one => one.startsWith('merge '))).toBe(false)
  expect(files.get('manifest')).toBeUndefined()
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: (await clock.now()) - 2 * 3_600_000, version: '0.1.2', result: 'seen' }))
  await later(clock, 16 * 60_000)
  expect(gitRan.some(one => one.startsWith('merge '))).toBe(false)
  await pressed(panel, 'update-install')
  await shownIn(panel, 'Claudopus 0.1.2 is in the folder')
  expect(gitRan).toContain(`merge --ff-only --quiet ${COMMIT}`)
  expect(JSON.parse(files.get('manifest') ?? '{}').version).toBe('0.1.2')
  await shownIn(panel, /^This chat still runs v0\.1\.0\. Every chat run from/)
  expect(reloads).toEqual([])
  await pressed(panel, 'update-reload')
  expect(await until(async () => reloads.length || undefined)).toBe(1)
  const mark = [...files.entries()].find(([path]) => path.startsWith(`${MEMORY}/reloads/`))?.[1]
  expect(JSON.parse(mark ?? '{}')).toMatchObject({ version: '0.1.2', from: '0.1.0' })
})

test('each step stands through a reload: a chat that loads finds the download waiting for Install, a step cut short said as stopped, and a copy newer than it runs offered its Reload', SLOW, async ($, on) => {
  const { files, clock } = world(on, { release: RELEASE })
  pageOn(on, () => pageText())
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }))
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: UPD_NOW - 5 * 3_600_000 }))
  await $.session.start(start)
  const panel = await $.ui.mount(listAt())
  await shownIn(panel, 'Claudopus 0.1.2 fetched')
  expect(await keyed(panel, 'update-install')).toBeDefined()
  // A download whose chat closed mid-way
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloading', at: UPD_NOW - 10 * 60_000, pct: 40 }))
  await panel.unmount()
  const stopped = await $.ui.mount(listAt())
  await shownIn(stopped, 'It stopped before it finished, when its chat closed or reloaded.')
  expect(await keyed(stopped, 'update-again')).toBeDefined()
  // The folder already has the newer version: what is left is this chat's reload
  files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.2' }))
  await stopped.unmount()
  const behind = await $.ui.mount(listAt())
  expect(await until(() => keyed(behind, 'update-reload'))).toBeDefined()
})

test('Not now keeps a version quiet for a day, Skip this version until a newer one; the terminal shows the same notice', SLOW, async ($, on) => {
  const { files, clock } = world(on, { release: RELEASE })
  let version = '0.1.2'
  pageOn(on, () => pageText(version))
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  await pressed(panel, 'update-later-available')
  expect(await until(async () => ((await panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })) ? undefined : true))).toBe(true)
  const put = JSON.parse(files.get(`${MEMORY}/update-later.json`) ?? '{}') as { version?: string; until?: number }
  expect(put.version).toBe('0.1.2')
  expect((put.until ?? 0) - (await clock.now())).toBe(24 * 3_600_000)
  // A day on, it shows again
  files.set(`${MEMORY}/update-later.json`, JSON.stringify({ version: '0.1.2', until: (await clock.now()) - 1 }))
  await panel.unmount()
  const day = await $.ui.mount(listAt())
  await shownIn(day, 'Claudopus 0.1.2 is out')
  await pressed(day, 'update-skip-available')
  expect(await until(async () => ((await day.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })) ? undefined : true))).toBe(true)
  expect(JSON.parse(files.get(`${MEMORY}/config.json`) ?? '{}').skipVersion).toBe('0.1.2')
  version = '0.1.3'
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: (await clock.now()) - 2 * 3_600_000, version: '0.1.2', result: 'seen' }))
  await later(clock, 16 * 60_000)
  expect(JSON.parse(files.get(`${MEMORY}/update-seen.json`) ?? '{}').version).toBe('0.1.3')
  const term = await $.ui.mount(listAt('terminal'))
  await shownIn(term, 'Claudopus 0.1.3 is out')
})

test('a chat run from a worktree of the code is told a release never reaches it, and offered no download', SLOW, async ($, on) => {
  const { clock, gitRan } = world(on, { release: { ...RELEASE, worktree: true } })
  pageOn(on, () => pageText())
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await shownIn(panel, 'Claudopus 0.1.2 is out')
  await shownIn(panel, 'This chat runs from a worktree of the code, on branch fix-bar: releases come out on main and never reach a worktree: merge main there, then reload.')
  expect(await keyed(panel, 'update-download')).toBeUndefined()
  expect(changing(gitRan)).toEqual([])
})

test('F-019 · a chat run from another Mac moves at Install but is not sent a reload: it says to type /reload-plugins', SLOW, async ($, on) => {
  const { files, clock } = world(on, { release: RELEASE, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  const reloads = reloadsOf(on)
  pageOn(on, () => pageText())
  files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.0' }))
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.2' }))
  const panel = await $.ui.mount(listAt())
  await shownIn(panel, 'This chat still runs v0.1.0. Type /reload-plugins in this chat to switch it.')
  expect(await keyed(panel, 'update-reload')).toBeUndefined()
  expect(reloads).toEqual([])
})

test('F-020 · a lock on the update dated ahead of this clock holds nothing: the look reads the page all the same', SLOW, async ($, on) => {
  const { files, clock } = world(on)
  const fetches = pageOn(on, () => pageText('0.1.0'))
  files.set(`${MEMORY}/update.lock`, `${UPD_NOW + 365 * 24 * 3_600_000} planted`)
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  expect(await until(async () => fetches() || undefined)).toBe(1)
  // The version page names the one this chat runs: no notice
  const panel = await $.ui.mount(listAt())
  expect(await panel.find({ type: 'Text', text: /is out$/ })).toBeUndefined()
})
