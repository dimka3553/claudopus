// Claudopus keeps itself up to date: every hour one chat reads the version page on claudopus.ai, and when it names a version other than the one installed runs Claude Code's own update steps for it (the pure parts are in hooks/update.ts)

// ---- Keeping itself up to date (the pure parts are in ./update) ----

// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy not installed from a marketplace (its maker's folder) is never updated
let isUpdating = false
const selfUpdate = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from || isUpdating || !dir) return
  // Automatic updates turned off in Config leave the installed version alone
  if ((await readConfig($, dir)).updates === false) return
  const stampPath = `${dir}/update.json`
  if (!isUpdateDue(stampOf(await readOr($, stampPath)), await $.clock.now())) return
  isUpdating = true
  // The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
  // chat that closed mid-look is moved aside by exactly one chat once it is old (by what it says, else by when it was written)
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  try {
    if (!(await take())) {
      const now = await $.clock.now()
      const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
      if (now - at < UPDATE_LOOK) return
      const aside = `${lock}.${token.split(' ')[1]}`
      if ((await $.process.run(['mv', lock, aside]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) return
      await $.process.run(['rm', '-f', aside]).catch(() => undefined)
      if (!(await take())) return
    }
    try {
      // Another chat may have looked between this chat's reading and its lock
      const before = stampOf(await readOr($, stampPath))
      const now = await $.clock.now()
      // and the person may have turned automatic updates off while this chat waited for it
      if (!isUpdateDue(before, now) || (await readConfig($, dir)).updates === false) return
      const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
      const id = `${from.plugin}@${from.marketplace}`
      const scope = scopeOf(installed, id, $.plugin.root)
      const have = installedVersionOf(installed, id, $.plugin.root, scope)
      // The version page on claudopus.ai says which version is current; the same one installed means nothing is run
      const page = await Promise.race([
        $.http.fetch(VERSION_PAGE).catch(err => ({ ok: false, status: 0, text: String(err) })),
        new Promise<{ ok: false; status: 0; text: string }>(done => void $.clock.after(VERSION_WAIT, () => done({ ok: false, status: 0, text: 'no answer' }))),
      ])
      const current = page.ok ? versionOnPage(page.text) : undefined
      if (!current) {
        const result = `version page not read: ${page.ok ? 'no version on it' : page.status || page.text.slice(0, 120)}`
        await $.fs.write(stampPath, JSON.stringify({ at: now, version: before?.version || have, result }))
        await log($, `Claudopus ${result}`)
        return
      }
      if (current === have) {
        await $.fs.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))
        return
      }
      await log($, `Claudopus ${current} is on the version page and ${have} is installed: updating`)
      const engine = (await $.env.get('CLAUDE_CODE_EXECPATH')) || 'claude'
      const [refresh, update] = updateSteps(engine, from, scope)
      const run = (argv: string[], timeoutMs: number) => $.process.run(argv, { timeoutMs }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
      const refreshed = await run(refresh, 180_000)
      const updated = refreshed.exitCode === 0 ? await run(update, 300_000) : refreshed
      const to = refreshed.exitCode === 0 ? updatedTo(`${updated.stdout}\n${updated.stderr}`) : undefined
      const why = `${updated.stderr || updated.stdout}`.trim().slice(-200)
      const result = to ? (to.isNew ? 'updated' : 'latest') : `${refreshed.exitCode === 0 ? 'not updated' : 'marketplace not refreshed'}: ${why}`
      // A look that learnt nothing keeps the version the last one found, so About still says what is installed
      await $.fs.write(stampPath, JSON.stringify({ at: now, version: to?.version ?? before?.version ?? '', result }))
      if (to?.isNew) await log($, `Claudopus updated to ${to.version}: chats that start from now on load it`)
      else if (!to) await log($, `Claudopus ${result}`)
    } finally {
      // Only this chat's own lock is removed: one taken over meanwhile is the other chat's
      if ((await readOr($, lock)) === token) await $.process.run(['rm', '-f', lock]).catch(() => undefined)
    }
  } finally {
    isUpdating = false
  }
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; nothing
// for a copy run from a folder of its code, which has nothing installed to move to
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) return undefined
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
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing
let updatedMoment: { from: string; to: string; loadedAt: number; startedAt: number } | undefined
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
  updatedMoment = { from, to: loaded, loadedAt: now, startedAt: 0 }
  // A panel drawn while this load was still reading has no moment yet: it is drawn again now
  await update($, tick, n => n + 1)
  await log($, `Claudopus moved from ${from} to ${loaded} in this chat: the header's octopus turns blue and says so`)
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
// The moment as it stands now, while it lasts, drawn again each UPDATED_STEP until it is over: the name line's pieces (blue in
// Claudopus's workflow blue, the glint in a light blue); the words are pieces of their own, a space between each; the panel draws the blue octopus beside them
const updatedPieces = async ($: EngineInterface, version: string) => {
  const moment = updatedMoment
  if (!moment || moment.to !== version) return undefined
  const now = await $.clock.now()
  if (!moment.startedAt) {
    if (now - moment.loadedAt > UPDATED_LATE) return void (updatedMoment = undefined)
    moment.startedAt = now
    void playUpdated($, moment.to)
    let left = Math.ceil(UPDATED_FOR / UPDATED_STEP) + 2
    const step = () =>
      void $.clock.after(UPDATED_STEP, () => {
        void update($, tick, n => n + 1)
        if ((left -= 1) > 0 && updatedMoment === moment) step()
      })
    step()
  }
  const look = updatedLook(moment.to, now - moment.startedAt)
  if (!look && updatedMoment === moment) updatedMoment = undefined
  return look
}
// The glint: a light blue letter passing along the blue word, bright in either theme
const GLINT = '#A9CDFF'
const nameLine = (ui: Ui, pieces: NonNullable<ReturnType<typeof updatedLook>>) => {
  // "Claudopus" first, then the word or version beside it, its pieces together
  const words = [pieces.slice(0, 1), pieces.slice(1)].filter(word => word.length)
  return (
    <ui.Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
      {words.map((word, w) => (
        <ui.Box key={`head-name-${w}`} flexDirection="row" flexShrink={w ? 1 : 0} minWidth={0}>
          {word.map((piece, i) => (
            <ui.Text key={`head-name-${w}-${i}`} wrap="truncate-end" color={piece.tone === 'glint' ? GLINT : FLOW} bold>
              {piece.text}
            </ui.Text>
          ))}
        </ui.Box>
      ))}
    </ui.Box>
  )
}
