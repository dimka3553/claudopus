// Updates as the person asks for them: every hour one chat only reads the version page on claudopus.ai, and the panel says when it names a newer version, with Install. Install, like Config's Check for updates, runs Claude Code's own update steps for it, or, for a copy run from a folder of its code, brings that folder up to date (the pure parts are in hooks/update.ts)

// ---- Keeping itself up to date (the pure parts are in ./update) ----

// A look and an install run one at a time, under a lock the other chats see; what an install learnt is kept in update.json, what
// the hourly look saw on the page in update-seen.json
let isUpdating = false
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-look is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
const UPDATE_BUSY = 'busy' as const
const LOCK_SKEW = 60_000
const underUpdateLock = async <T,>($: EngineInterface, act: () => Promise<T>): Promise<T | typeof UPDATE_BUSY> => {
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  if (!(await take())) {
    const now = await $.clock.now()
    const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
    // A lock dated ahead of this Mac's clock, past what two chats' clocks can differ by, was never taken by a chat here: it is stale
    if (now - at < UPDATE_LOOK && at - now <= LOCK_SKEW) return UPDATE_BUSY
    const aside = `${lock}.${token.split(' ')[1]}`
    if ((await $.process.run(['mv', lock, aside]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) return UPDATE_BUSY
    await $.process.run(['rm', '-f', aside]).catch(() => undefined)
    if (!(await take())) return UPDATE_BUSY
  }
  try {
    return await act()
  } finally {
    // Only this chat's own lock is removed: one taken over meanwhile is the other chat's
    if ((await readOr($, lock)) === token) await $.process.run(['rm', '-f', lock]).catch(() => undefined)
  }
}
// The Mac, as one look needs it
const lookIo = ($: EngineInterface): LookIo => ({
  read: path => readOr($, path),
  write: (path, text) => $.fs.write(path, text),
  run: (argv, timeoutMs) => $.process.run(argv, { timeoutMs }),
  page: () =>
    Promise.race([
      $.http.fetch(VERSION_PAGE).catch(err => ({ ok: false, status: 0, text: String(err) })),
      new Promise<{ ok: false; status: 0; text: string }>(done => void $.clock.after(VERSION_WAIT, () => done({ ok: false, status: 0, text: 'no answer' }))),
    ]),
  now: () => $.clock.now(),
  log: text => log($, text),
})
// One look: an installed copy runs Claude Code's own update steps, a copy run from a folder of its code brings that folder up to date
// A folder's looks keep their own stamp, so they never stand in for an installed copy's hourly look on the same Mac
const stampFor = (from: ReturnType<typeof installedFrom>) => `${dir}/${from ? 'update' : 'update-folder'}.json`
// Claude Code's own program: the one the app names, else the first on the PATH, else where its installer puts it, as a terminal started without a login shell
// (seen on Linux, in tmux started over ssh) has no ~/.local/bin on its PATH, else claude on the PATH
const engineOf = async ($: EngineInterface) => {
  const named = await $.env.get('CLAUDE_CODE_EXECPATH')
  if (named) return named
  // The PATH first, as the shell would find it, so an install by npm or another copy earlier on it is still the one used
  const onPath = ((await $.env.get('PATH')) ?? '').split(':').filter(one => one.startsWith('/')).map(one => `${one.replace(/\/+$/, '')}/claude`)
  for (const one of [...onPath, `${(await $.env.get('HOME')) ?? ''}/.local/bin/claude`, '/opt/homebrew/bin/claude', '/usr/local/bin/claude', '/usr/bin/claude'])
    if (one.startsWith('/') && (await $.fs.exists(one).catch(() => false))) return one
  return 'claude'
}
const lookAt = async ($: EngineInterface, from: ReturnType<typeof installedFrom>) => {
  const engine = await engineOf($)
  const stampPath = stampFor(from)
  if (!from) return folderLook(lookIo($), { root: $.plugin.root, plugins: dir.replace(/\/claudopus$/, '/plugins'), engine, stampPath })
  return lookOnce(lookIo($), { from, root: $.plugin.root, cwd, engine, stampPath })
}

// Claudopus never installs an update by itself: Claude Code leaves automatic updates off for a marketplace other than Anthropic's
// own, and what an update installs carries no signature the mod could check. Every hour one chat only reads the version page (one
// small fetch: nothing is downloaded or run), and when it names a newer version the panel says so, with Install. A new version
// comes only from a press: Install, or Config's Check for updates (Claude Code's own update steps, as /plugin update runs them)
const lookedPath = () => `${dir}/update-seen.json`
const lookForNew = async ($: EngineInterface) => {
  if (isUpdating || !dir) return
  // The hourly look turned off in Config reads nothing
  if ((await readConfig($, dir)).updates === false) return
  if (!isUpdateDue(stampOf(await readOr($, lookedPath())), await $.clock.now())) return
  isUpdating = true
  try {
    await underUpdateLock($, async () => {
      // Another chat may have looked between this chat's reading and its lock, or the person turned the look off meanwhile
      const before = stampOf(await readOr($, lookedPath()))
      const now = await $.clock.now()
      if (!isUpdateDue(before, now) || (await readConfig($, dir)).updates === false) return
      const page = await lookIo($).page()
      const version = page.ok ? versionOnPage(page.text) : undefined
      await $.fs.write(lookedPath(), JSON.stringify({ at: now, version: version ?? before?.version ?? '', result: version ? 'seen' : `version page not read: ${page.status || page.text.slice(0, 120)}` }))
      if (version) redraw($)
    })
  } finally {
    isUpdating = false
  }
}
// The newer version the hourly look saw, while neither this chat nor the Mac has it yet, and the look is on
const newOut = async ($: EngineInterface, loaded: string, installed: string) => {
  if (!dir || !loaded) return ''
  const seen = stampOf(await readOr($, lookedPath()))?.version ?? ''
  if (!seen || !isNewer(seen, loaded) || (installed && !isNewer(seen, installed)) || installPress.done === seen) return ''
  return (await readConfig($, dir)).updates === false ? '' : seen
}

// One look now, under the lock: a look already under way here, or another chat's, is waited for (CHECK_STEP at a time, up to
// UPDATE_LOOK, after which a stale lock is taken over), then this one runs, so two never run at once; it is cheap when the other one
// already downloaded the newest version. A Look, or why there was none
const CHECK_STEP = 3000
const lookNow = async ($: EngineInterface, by: string): Promise<Look | string> => {
  const from = installedFrom($.plugin.root)
  if (!dir) return "Couldn't check: Claudopus has no memory folder in this chat."
  const until = (await $.clock.now()) + UPDATE_LOOK + CHECK_STEP
  for (;;) {
    if (!isUpdating) {
      isUpdating = true
      try {
        const look = await underUpdateLock($, () => lookAt($, from))
        if (look !== UPDATE_BUSY) {
          await log($, `Claudopus checked for updates from ${by}: ${look.kind}${'version' in look && look.version ? ` ${look.version}` : ''}`)
          return look
        }
      } finally {
        isUpdating = false
      }
    }
    if ((await $.clock.now()) > until) return "Couldn't check: another chat's check did not finish. Try again later."
    await new Promise<void>(done => void $.clock.after(CHECK_STEP, done))
  }
}
// Config's Check for updates: the look, now, whatever the hour says; a chat switches to what it got when /reload-plugins is typed
const checkForUpdates = async ($: EngineInterface): Promise<{ text: string; isError: boolean }> => {
  const loaded = (await versionsOf($)).version
  const look = await lookNow($, 'Config')
  return typeof look === 'string' ? { text: look, isError: true } : checkSaid(look, loaded, true, !installedFrom($.plugin.root))
}
// The panel's Install, pressed for the version it showed: the same look as Check for updates, then this chat alone reloads to what it
// got, with Claude Code's own /reload-plugins. Other open chats keep theirs, and their header says to type /reload-plugins. A chat run
// from another Mac is never sent one (the engine refuses it there), nor one whose reload the engine refused: it says to type it
const installPress = { version: '', isBusy: false, said: '', isError: false, done: '' }
let isReloadRefused = false
const installNew = async ($: EngineInterface, version: string) => {
  if (installPress.isBusy) return
  Object.assign(installPress, { version, isBusy: true, said: '', isError: false })
  redraw($)
  const loaded = (await versionsOf($)).version
  const from = installedFrom($.plugin.root)
  try {
    const look = await lookNow($, 'the panel\'s Install')
    if (typeof look === 'string' || look.kind === 'failed' || !loaded || !isNewer(look.version, loaded)) {
      const said = typeof look === 'string' ? { text: look, isError: true } : checkSaid(look, loaded, true, !from)
      return void Object.assign(installPress, { said: said.text, isError: said.isError })
    }
    installPress.done = version
    if (isRunFromAfar || isReloadRefused) return void Object.assign(installPress, { said: checkSaid(look, loaded, true, !from).text })
    // The mark lets the next load know what it moved from, so the header shows the moment
    await $.fs.write(`${dir}/reloads/${await $.session.id()}.json`, JSON.stringify({ version: look.version, from: loaded, at: await $.clock.now() }))
    await log($, `Claudopus ${look.version} installed from the panel's Install, and this chat runs ${loaded}: reloading it`)
    const said = await $.command.run({ command: 'reload-plugins' })
    if (/isn't available/i.test(String((said as { text?: unknown } | undefined)?.text ?? ''))) {
      isReloadRefused = true
      Object.assign(installPress, { said: checkSaid(look, loaded, true, !from).text })
      await log($, `Claudopus not reloaded to ${look.version}: the engine refused it; the panel says to type /reload-plugins`)
    }
  } catch (err) {
    Object.assign(installPress, { said: `Couldn't install: ${String(err instanceof Error ? err.message : err).slice(0, 160)}`, isError: true })
  } finally {
    installPress.isBusy = false
    redraw($)
  }
}
// The panel's card for a newer version out: what it is and Install; while it installs, that; after, what came of it
const newOutCard = ($: EngineInterface, ui: Ui, version: string) => {
  // After a press, what came of it stays once the card's version is installed
  const shown = !version || installPress.version === version ? installPress : undefined
  if (!version && !shown?.said) return null
  return (
    <ui.Box key="update-out" flexDirection="column" flexShrink={0}>
      {version ? <ui.Text key="update-out-title" bold wrap="wrap">{`Claudopus ${version} is out`}</ui.Text> : null}
      {version ? <ui.Text key="update-out-what" dimColor wrap="wrap">Nothing is downloaded until you press Install, which gets it through Claude Code's own update steps and reloads this chat.</ui.Text> : null}
      {shown?.isBusy ? (
        <ui.Text key="update-out-busy" dimColor>Installing…</ui.Text>
      ) : version ? (
        <ui.Box key="update-out-buttons" flexDirection="row">
          <ui.Button key={`update-install-${presses}`} label="Install" onPress={() => void ((presses += 1), installNew($, version))} />
        </ui.Box>
      ) : null}
      {shown?.said ? <ui.Text key="update-out-said" color={shown.isError ? 'error' : undefined} wrap="wrap">{shown.said}</ui.Text> : null}
    </ui.Box>
  )
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; for a copy
// run from a folder of its code, the version that folder has now, which a reload loads
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) {
    // Only a main checkout (its .git a folder, not a worktree's file) follows its folder: a worktree's version rises as work merges
    // main or a release numbers it, mid-build, and a chat loaded from it is reloaded by hand
    const root = $.plugin.root.replace(/\/+$/, '')
    if (!(await readOr($, `${root}/../../.git/HEAD`)).trim()) return undefined
    const version = versionOnPage(await readOr($, `${root}/.claude-plugin/plugin.json`))
    return version ? { version, installPath: root } : undefined
  }
  const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
  const id = `${from.plugin}@${from.marketplace}`
  return copyOf(installed, id, $.plugin.root, cwd)
}

// A /reload-plugins run from afar loads the new copy but leaves the old one's timers running in the same chat, and copies before
// 0.2.56 send it whatever the connection, each a refused line. They all wait while reloads/<chat>.json names the installed version from under RELOAD_AGAIN ago, so
// in a chat run from afar this copy keeps that mark naming it, looked at every HOLD_EVERY, which is far below their RELOAD_EVERY.
// A copy that a newer load in this chat has replaced (the version this chat ran last is not its own) does nothing, so the holds of
// copies left behind by typed reloads do not pile up
const HOLD_EVERY = 1000
const holdOldCopies = async ($: EngineInterface) => {
  if (!dir) return
  const loaded = (await versionsOf($)).version
  if (!loaded || (await read($, ranVersion)) !== loaded) return
  const copy = await installedCopy($)
  if (!copy?.version) return
  const mark = `${dir}/reloads/${await $.session.id()}.json`
  const before = await readOr($, mark).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const at = typeof before?.at === 'number' ? before.at : 0
  if (before?.version === copy.version && now >= at && now - at < RELOAD_AGAIN / 2) return
  await $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))
}
// ---- The moment a chat moves to a newer version ----

// The version this chat loaded last, kept through a reload of this code, so the load after it knows what it moved from
const ranVersion = atom({ plugin: 'claudopus', key: 'ran' } as const, '', { shape: 'ran-1' })
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing once
// the load has started whole (isReady), or UPDATED_READY after the load if its start never finishes: in a chat run over ssh the
// start took 6 s, and drawings asked for meanwhile can be dropped as each new change is announced, so a moment begun then could be
// over before one of its drawings arrived. Until then the header is as before, so the octopus's jump and the words keep time
const UPDATED_READY = 15_000
let updatedMoment: { from: string; to: string; loadedAt: number; startedAt: number; isReady: boolean } | undefined
const noteLoaded = async ($: EngineInterface) => {
  updatedMoment = undefined
  const loaded = (await versionsOf($)).version
  if (!loaded) return
  const ran = await read($, ranVersion)
  const mark = await readOr($, `${dir}/reloads/${await $.session.id()}.json`).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; from?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const from = updatedFrom(loaded, ran, mark, now)
  await update($, ranVersion, () => loaded)
  if (!from) return
  updatedMoment = { from, to: loaded, loadedAt: now, startedAt: 0, isReady: false }
  // A panel drawn while this load was still reading has no moment yet: it is drawn again now
  await update($, tick, n => n + 1)
  const moment = updatedMoment
  $.clock.after(UPDATED_READY, () => void (updatedMoment === moment && readyUpdated($)))
  await log($, `Claudopus moved from ${from} to ${loaded} in this chat: the header's octopus turns blue and says so`)
}
// The load has started whole: the moment begins at the next drawing, asked for now
const readyUpdated = async ($: EngineInterface) => {
  if (!updatedMoment || updatedMoment.isReady) return
  updatedMoment.isReady = true
  await update($, tick, n => n + 1)
}
// The sound of the moment, a file of the mod's: three bright rising notes, 0.9 s, made by mockups/claudopus-sound/updated.py
const UPDATED_SOUND = 'sounds/updated.wav'
// The sound plays once for each version on this Mac, however many chats move to it: the first to begin its moment makes the file
// updated/<version> (made only where none is, the shell's noclobber) and plays it; config.json's sound off keeps it silent
const playUpdated = async ($: EngineInterface, version: string) => {
  if (!dir || !/^[0-9A-Za-z.+-]{1,40}$/.test(version)) return
  let config: { sound?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves the sound on
  }
  if (config.sound === false) return
  const played = `${dir}/updated/${version}`
  const made = await $.process
    .run(['sh', '-c', 'mkdir -p "$(dirname "$1")" && set -C && : > "$1"', 'sh', played])
    .catch(() => ({ exitCode: 1 }))
  if (made.exitCode !== 0) return
  // A sound that could not play leaves the version free for the next chat that moves to it
  await $.audio.play({ asset: UPDATED_SOUND }).catch(async err => {
    await $.process.run(['rm', '-f', played]).catch(() => undefined)
    await log($, `updated sound not played: ${String(err)}`)
  })
}
// The moment as it stands now, while it lasts: the name line's pieces in Claudopus's workflow blue, the panel drawing the blue
// octopus beside them. The panel is drawn again only where the look changes, at UPDATED_SAYS and at its end (see UPDATED_SAYS)
const updatedPieces = async ($: EngineInterface, version: string) => {
  const moment = updatedMoment
  if (!moment || moment.to !== version) return undefined
  const now = await $.clock.now()
  // Drawn while the load is still starting: nothing of it yet
  if (!moment.isReady) return undefined
  if (!moment.startedAt) {
    if (now - moment.loadedAt > UPDATED_LATE) return void (updatedMoment = undefined)
    moment.startedAt = now
    void playUpdated($, moment.to)
    for (const at of [UPDATED_SAYS, UPDATED_FOR]) $.clock.after(at + 20, () => void (updatedMoment === moment && update($, tick, n => n + 1)))
  }
  const look = updatedLook(moment.to, now - moment.startedAt)
  if (!look && updatedMoment === moment) updatedMoment = undefined
  return look
}
const nameLine = (ui: Ui, pieces: NonNullable<ReturnType<typeof updatedLook>>) => (
  // "Claudopus" first, then the word or version beside it
  <ui.Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
    {pieces.map((piece, i) => (
      <ui.Box key={`head-name-${i}`} flexDirection="row" flexShrink={i ? 1 : 0} minWidth={0}>
        <ui.Text key={`head-name-${i}-0`} wrap="truncate-end" color={FLOW} bold>
          {piece.text}
        </ui.Text>
      </ui.Box>
    ))}
  </ui.Box>
)
