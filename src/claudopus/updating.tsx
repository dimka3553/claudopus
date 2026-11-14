// Claudopus keeps itself up to date: every hour one chat reads the version page on claudopus.ai, and when it names a version other than the one installed runs Claude Code's own update steps for it, or, for a copy run from a folder of its code, brings that folder up to date (the pure parts are in hooks/update.ts)

// ---- Keeping itself up to date (the pure parts are in ./update) ----

// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy run from a folder of its code brings that folder up to date with git instead
let isUpdating = false
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-look is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
const UPDATE_BUSY = 'busy' as const
const underUpdateLock = async <T,>($: EngineInterface, act: () => Promise<T>): Promise<T | typeof UPDATE_BUSY> => {
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  if (!(await take())) {
    const now = await $.clock.now()
    const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
    if (now - at < UPDATE_LOOK) return UPDATE_BUSY
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
const lookAt = async ($: EngineInterface, from: ReturnType<typeof installedFrom>) => {
  const engine = (await $.env.get('CLAUDE_CODE_EXECPATH')) || 'claude'
  const stampPath = `${dir}/update.json`
  if (!from) return folderLook(lookIo($), { root: $.plugin.root, plugins: dir.replace(/\/claudopus$/, '/plugins'), engine, stampPath })
  return lookOnce(lookIo($), { from, root: $.plugin.root, cwd, engine, stampPath })
}

// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy run from a folder of its code brings that folder up to date with git instead
const selfUpdate = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (isUpdating || !dir) return
  // Automatic updates turned off in Config leave the installed version alone
  if ((await readConfig($, dir)).updates === false) return
  const stampPath = `${dir}/update.json`
  if (!isUpdateDue(stampOf(await readOr($, stampPath)), await $.clock.now())) return
  isUpdating = true
  try {
    await underUpdateLock($, async () => {
      // Another chat may have looked between this chat's reading and its lock, and the person may have turned automatic updates
      // off while this chat waited for it
      if (!isUpdateDue(stampOf(await readOr($, stampPath)), await $.clock.now()) || (await readConfig($, dir)).updates === false) return
      await lookAt($, from)
    })
  } finally {
    isUpdating = false
  }
}

// Config's Check for updates: the same look, now, whatever the switch and the hour say. A look already under way here, or another
// chat's, is waited for (CHECK_STEP at a time, up to UPDATE_LOOK, after which a stale lock is taken over), then this one runs, so
// two looks never run at once; it is cheap when the other one already downloaded the newest version
const CHECK_STEP = 3000
const checkForUpdates = async ($: EngineInterface): Promise<{ text: string; isError: boolean }> => {
  const loaded = (await versionsOf($)).version
  const from = installedFrom($.plugin.root)
  if (!dir) return { text: "Couldn't check: Claudopus has no memory folder in this chat.", isError: true }
  const until = (await $.clock.now()) + UPDATE_LOOK + CHECK_STEP
  for (;;) {
    if (!isUpdating) {
      isUpdating = true
      try {
        const look = await underUpdateLock($, () => lookAt($, from))
        if (look !== UPDATE_BUSY) {
          await log($, `Claudopus checked for updates from Config: ${look.kind}${'version' in look && look.version ? ` ${look.version}` : ''}`)
          return checkSaid(look, loaded, isRunFromAfar || isReloadRefused, !from)
        }
      } finally {
        isUpdating = false
      }
    }
    if ((await $.clock.now()) > until) return { text: "Couldn't check: another chat's check did not finish. Try again later.", isError: true }
    await new Promise<void>(done => void $.clock.after(CHECK_STEP, done))
  }
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; for a copy
// run from a folder of its code, the version that folder has now, which a reload loads
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) {
    const root = $.plugin.root.replace(/\/+$/, '')
    const version = versionOnPage(await readOr($, `${root}/.claude-plugin/plugin.json`))
    return version ? { version, installPath: root } : undefined
  }
  const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
  const id = `${from.plugin}@${from.marketplace}`
  return copyOf(installed, id, $.plugin.root, cwd)
}

// A chat whose copy is older than the one installed loads the new one itself, with Claude Code's own /reload-plugins: the run waits
// until the chat is idle (no turn of its own running), and background work carries on through it. The reload starts this code
// afresh; each ask is kept in reloads/<chat>.json, so a reload that brought back the old copy, or was refused, is not asked again
// for the same version for RELOAD_AGAIN, and a chat never reloads over and over
let reloadAsked = ''
// In a chat the app runs on another Mac over ssh, the engine refuses a /reload-plugins it was not typed in ("isn't available over a
// remote connection in this session"): every one the mod ran there was refused, every one typed was not. There it is not sent, since
// each refusal is a line in the chat, and the header says to type it
let isReloadRefused = false
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
const reloadToInstalled = async ($: EngineInterface) => {
  if (!dir || reloadAsked || isRunFromAfar) return
  const loaded = (await versionsOf($)).version
  const copy = await installedCopy($)
  if (!loaded || !copy?.version || !isNewer(copy.version, loaded)) return
  const manifest = copy.installPath ? await readOr($, `${copy.installPath}/.claude-plugin/plugin.json`) : ''
  const mark = `${dir}/reloads/${await $.session.id()}.json`
  const before = await readOr($, mark).then(text => {
    try {
      return JSON.parse(text) as { version?: string; at?: number }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  if (!isReloadDue(loaded, copy, manifest, before, now)) return
  reloadAsked = copy.version
  try {
    await $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))
    await log($, `Claudopus ${copy.version} is installed and this chat runs ${loaded}: reloading it`)
    const said = await $.command.run({ command: 'reload-plugins' })
    if (/isn't available/i.test(String((said as { text?: unknown } | undefined)?.text ?? ''))) {
      isReloadRefused = true
      $.ui.invalidate('ui.render')
      await log($, `Claudopus not reloaded to ${copy.version}: the engine refused it over the remote connection; the header says to type /reload-plugins`)
    }
  } catch (err) {
    await log($, `Claudopus not reloaded to ${copy.version}: ${String(err)}`)
  } finally {
    // Settled without this code being replaced (refused, or the old copy came back): the mark decides when to ask again
    reloadAsked = ''
  }
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
