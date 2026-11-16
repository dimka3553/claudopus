// F-019 and F-020 of the security review, and the update's steps: a look only reads the version page and the panel says a newer
// version is out; nothing is fetched, moved or reloaded until a press (a chat run from Claudopus's own checkout has two, Update and
// Reload); a download that is not what the release published is thrown away and never moves anything; uncommitted work is never
// overwritten; each step stands through a reload; a lock dated ahead holds nothing

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

test('F-019 · the look only reads the version page: the panel says a newer version is out, with Update, and nothing is fetched, installed or reloaded, whatever config.json says', SLOW, async ($, on) => {
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
  expect(await panel.find({ type: 'Text', text: '· 2 versions since v0.1.0' })).toBeDefined()
  await shownIn(panel, 'The bar shows the battery · and 3 more changes')
  expect((await keyed(panel, 'update-download'))?.props.label).toBe('Update')
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

test('Update fetches the release and checks it against what the release published: one that does not match is thrown away and moves nothing', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: { ...RELEASE, got: 'b'.repeat(40) } })
  const reloads = reloadsOf(on)
  pageOn(on, () => pageText())
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  await pressed(panel, 'update-download')
  await shownIn(panel, "Couldn't update Claudopus 0.1.2")
  await shownIn(panel, "What was downloaded isn't what the release published, so it was thrown away. Nothing was changed: this chat still runs v0.1.0.")
  expect(await keyed(panel, 'update-install')).toBeUndefined()
  expect(gitRan).toContain('update-ref -d refs/claudopus/update')
  // A steps file that says it was downloaded, planted or left from before: the panel checks the download it names, finds it is not
  // the release's tree, and offers no Install (Install itself checks again, in update.test.tsx)
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: await clock.now() }))
  files.set('git:ref', COMMIT)
  await panel.unmount()
  const again = await $.ui.mount(listAt())
  await shownIn(again, 'Claudopus 0.1.2 is out')
  expect(await keyed(again, 'update-install')).toBeUndefined()
  expect(gitRan.some(one => one.startsWith('merge '))).toBe(false)
  expect(files.get('manifest')).toBeUndefined()
  expect(reloads).toEqual([])
})

test('Update is one press for a chat run from its checkout: the fetch, its check, then a fast-forward; then the header says, beside the version, to type /reload-plugins, and nothing reloads the chat', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: RELEASE })
  const reloads = reloadsOf(on)
  pageOn(on, () => pageText())
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  expect(changing(gitRan)).toEqual([])
  await pressed(panel, 'update-download')
  await shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')
  // One press: fetched, checked against the release's tree, and only then moved forward, fast-forward only
  const fetched = gitRan.findIndex(one => one.includes('fetch'))
  const checked = gitRan.findIndex(one => one.includes(`${COMMIT}:mods/claudopus`))
  const merged = gitRan.indexOf(`merge --ff-only --quiet ${COMMIT}`)
  expect(fetched >= 0 && checked > fetched && merged > checked).toBe(true)
  expect(gitRan.some(one => /^(reset|checkout|pull)\b/.test(one))).toBe(false)
  expect(JSON.parse(files.get('manifest') ?? '{}').version).toBe('0.1.2')
  expect(JSON.parse(files.get(`${MEMORY}/update-steps.json`) ?? '{}')).toMatchObject({ version: '0.1.2', stage: 'installed', commit: COMMIT, tree: TREE })
  expect(await keyed(panel, 'update-install')).toBeUndefined()
  expect(await panel.find({ type: 'Text', text: UPDATE_JARGON })).toBeUndefined()
  // No box and no press is left: only the line beside the version, and the chat is never reloaded for the person
  expect(await panel.find({ type: 'Text', text: /^Claudopus 0\.1\.2/ })).toBeUndefined()
  expect((await panel.findAll({ type: 'Button' })).some(one => /^update-/.test(one.key ?? ''))).toBe(false)
  await later(clock, 16 * 60_000)
  expect(reloads).toEqual([])
})

test('Update pressed while a look reads the version page waits for the look to end, then updates: before, the press did nothing', SLOW, async ($, on) => {
  const { files, clock } = world(on, { release: RELEASE })
  // The page answers at once, but for the timed look below, which takes 20 s to read it
  let slow = false
  let isReading = false
  on('http.fetch', async (engine, _e) => {
    if (slow) ((slow = false), (isReading = true), await new Promise<void>(done => void engine.clock.after(20_000, () => ((isReading = false), done()))))
    return { value: { status: 200, ok: true, headers: {}, text: pageText() } }
  }) as never
  await $.session.start(start)
  await clock.advance(3 * 60_000)
  const panel = await $.ui.mount(listAt())
  await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
  slow = true
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: (await clock.now()) - 2 * 3_600_000, version: '0.1.2', result: 'seen' }))
  // Second by second up to the timed look, and the press comes while it reads the page
  for (let s = 0; s < 20 * 60 && !isReading; s++) await clock.advance(1000)
  expect(isReading).toBe(true)
  await pressed(panel, 'update-download')
  expect(isReading).toBe(true)
  await clock.advance(30_000)
  await shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')
})

// What updating says speaks only of versions, Update and /reload-plugins: never of where the code sits or how git moves it
const UPDATE_JARGON = /folder|checkout|fetch|forward|detached|brought|commit|\bmain\b|branch|worktree|\bgit\b|fingerprint|marketplace|~\/|\/Users\//i
// Update never overwrites uncommitted work nor moves a main with commits of its own: it says why it could not move forward, and nothing moves
const STAYS: { name: string; release: Release; said: string; isNewerAfterFetch?: boolean; title?: string }[] = [
  { name: 'uncommitted changes the move would overwrite', release: { ...RELEASE, overwrite: true }, said: 'Your copy of Claudopus has changes of its own in files this version changes, so updating would lose them: ask a chat to set them aside, then press Try again. Nothing was changed: this chat still runs v0.1.0.' },
  { name: 'a newer version out between its fetch and its move', release: RELEASE, isNewerAfterFetch: true, title: 'Claudopus 0.1.3 is out', said: 'The bar shows the battery · and 3 more changes' },
  { name: 'a main with commits of its own', release: { ...RELEASE, ownCommits: true }, said: "Your copy of Claudopus has changes of its own that this version doesn't have, so Update leaves it as it is. Nothing was changed: this chat still runs v0.1.0." },
]
for (const one of STAYS)
  test(`Update with ${one.name}: it says why it could not move forward, and nothing is overwritten or moved`, SLOW, async ($, on) => {
    const { files, clock, gitRan } = world(on, { release: one.release })
    const reloads = reloadsOf(on)
    // The move reads the version page again: one naming a newer version by then moves nothing
    pageOn(on, () => (one.isNewerAfterFetch && gitRan.some(ran => ran.includes('fetch')) ? pageText('0.1.3') : pageText()))
    await $.session.start(start)
    await clock.advance(3 * 60_000)
    const panel = await $.ui.mount(listAt())
    await until(() => panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }))
    await pressed(panel, 'update-download')
    // Said why, or the newer version offered in its place
    await shownIn(panel, one.title ?? "Couldn't update Claudopus 0.1.2")
    await shownIn(panel, one.said)
    expect(await panel.find({ type: 'Text', text: UPDATE_JARGON })).toBeUndefined()
    // A merge is tried only where git itself refuses to overwrite: a fast-forward that stops before touching a changed file
    expect(gitRan.some(ran => ran.startsWith('merge '))).toBe(Boolean(one.release.overwrite))
    expect(gitRan.some(ran => /^(reset|checkout|pull|stash)\b/.test(ran) || ran.includes('--force') || ran.includes('--hard'))).toBe(false)
    expect(files.get('manifest')).toBeUndefined()
    expect(await keyed(panel, 'update-reload')).toBeUndefined()
    expect(await keyed(panel, one.title ? 'update-download' : 'update-again')).toBeDefined()
    expect(reloads).toEqual([])
  })

test('each step stands through a reload: a chat that loads finds the download waiting for Update, a step cut short said as stopped, and a copy newer than it runs told to type /reload-plugins', SLOW, async ($, on) => {
  const { files, clock, gitRan } = world(on, { release: RELEASE })
  pageOn(on, () => pageText())
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }))
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: UPD_NOW - 5 * 3_600_000 }))
  files.set('git:ref', COMMIT)
  await $.session.start(start)
  const panel = await $.ui.mount(listAt())
  // Fetched by a copy before Update was one press, or planted: offered as any version out, with what is new, and nothing moves until
  // its Update is pressed
  await shownIn(panel, 'Claudopus 0.1.2 is out')
  await shownIn(panel, 'The bar shows the battery · and 3 more changes')
  expect((await keyed(panel, 'update-install'))?.props.label).toBe('Update')
  await later(clock, 16 * 60_000)
  expect(gitRan.some(one => one.startsWith('merge '))).toBe(false)
  expect(files.get('manifest')).toBeUndefined()
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
  await shownIn(behind, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')
})

test('a steps file that says a download was checked, with no such download in the repo, is not believed: the panel offers the download again', SLOW, async ($, on) => {
  const { files } = world(on, { release: RELEASE })
  pageOn(on, () => pageText())
  files.set(`${MEMORY}/update-seen.json`, JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }))
  files.set(`${MEMORY}/update-steps.json`, JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: 'f'.repeat(40), tree: TREE, at: UPD_NOW }))
  await $.session.start(start)
  const panel = await $.ui.mount(listAt())
  await shownIn(panel, 'Claudopus 0.1.2 is out')
  expect(await keyed(panel, 'update-install')).toBeUndefined()
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

// A chat whose code Update must leave alone is told so in plain words, and offered no download
const LEFT_ALONE: { name: string; release: Release; said: string }[] = [
  { name: 'a build a piece of work is changing', release: { ...RELEASE, worktree: true }, said: 'This chat runs a build of Claudopus that a piece of work is changing: Update leaves it alone, and it gets the newest version when that work takes it in.' },
  { name: 'a test build', release: { ...RELEASE, noBranch: true }, said: 'This chat runs a test build of Claudopus: Update leaves it alone.' },
]
for (const one of LEFT_ALONE)
  test(`a chat run from ${one.name} is told Update leaves it alone, and offered no download`, SLOW, async ($, on) => {
    const { clock, gitRan } = world(on, { release: one.release })
    pageOn(on, () => pageText())
    await $.session.start(start)
    await clock.advance(3 * 60_000)
    const panel = await $.ui.mount(listAt())
    await shownIn(panel, 'Claudopus 0.1.2 is out')
    await shownIn(panel, one.said)
    expect(await panel.find({ type: 'Text', text: UPDATE_JARGON })).toBeUndefined()
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
  await shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')
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
