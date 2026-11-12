// Claudopus keeps itself up to date: every few hours one chat runs Claude Code's own update steps for it (the pure parts are in hooks/update.ts)

// ---- Keeping itself up to date (the pure parts are in ./update) ----

// Every few hours one chat on this Mac runs Claude Code's own two update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy not installed from a marketplace (its maker's folder) is never updated
let isUpdating = false
const selfUpdate = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from || isUpdating || !dir) return
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
      if (!isUpdateDue(before, now)) return
      const engine = (await $.env.get('CLAUDE_CODE_EXECPATH')) || 'claude'
      const scope = scopeOf(await readOr($, `${from.plugins}/installed_plugins.json`), `${from.plugin}@${from.marketplace}`, $.plugin.root)
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
