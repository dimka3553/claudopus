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
const reloadToInstalled = async ($: EngineInterface) => {
  if (!dir || reloadAsked) return
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
    await $.command.run({ command: 'reload-plugins' })
  } catch (err) {
    await log($, `Claudopus not reloaded to ${copy.version}: ${String(err)}`)
  } finally {
    // Settled without this code being replaced (refused, or the old copy came back): the mark decides when to ask again
    reloadAsked = ''
  }
}
