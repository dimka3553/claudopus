// Claudopus keeps itself up to date: Claude Code leaves a marketplace that is not Anthropic's alone unless each person turns its
// auto-update on, and the desktop app runs its engine with DISABLE_AUTOUPDATER=1, which turns that pass off anyway. So every few
// hours one chat on the Mac asks Claude Code itself to refresh this mod's marketplace and update the mod, the two steps a person
// would type. It runs those steps only when the version page on claudopus.ai names a version other than the one installed, so a
// look is one small fetch, with no model or agent in it. Chats that start after an update load the new version; chats already open
// keep the one they loaded.

// The page that says which version is current: site/version.json, made by build.mjs from plugin.json and served from main
export const VERSION_PAGE = 'https://www.claudopus.ai/version.json'
// How long the page may take to answer before the look counts it as not read
export const VERSION_WAIT = 30_000

// How often the Mac looks at the version page, and how long a look may hold the lock before another chat takes over
export const UPDATE_EVERY = 60 * 60 * 1000
export const UPDATE_LOOK = 15 * 60 * 1000
// How long after a chat loads before it looks, so a chat's start is never held up
export const UPDATE_AFTER = 2 * 60 * 1000
// What the Mac last learnt, kept at ~/.claude/claudopus/update.json and shared by every chat on it
export type UpdateStamp = { at: number; version: string; result: string }

// The marketplace and plugin a copy was installed from, read off its folder: Claude Code keeps an installed copy at
// <plugins>/cache/<marketplace>/<plugin>/<version>. A copy loaded from anywhere else (a folder of its code, as its maker runs it)
// is left alone: nothing was installed there to update
export const installedFrom = (root: string): { plugins: string; marketplace: string; plugin: string } | undefined => {
  const [, plugins = '', marketplace = '', plugin = ''] = /^(.*\/plugins)\/cache\/([^/]+)\/([^/]+)\/[^/]+\/?$/.exec(root) ?? []
  return plugins && /^[\w.-]+$/.test(marketplace) && /^[\w.-]+$/.test(plugin) ? { plugins, marketplace, plugin } : undefined
}

// The scope this copy was installed at, read from installed_plugins.json by its folder; absent, `plugin update` takes the user's
export const scopeOf = (installed: string, id: string, root: string): string | undefined => {
  try {
    const entries: { scope?: string; installPath?: string }[] = JSON.parse(installed)?.plugins?.[id] ?? []
    const scope = entries.find(one => one.installPath?.replace(/\/$/, '') === root.replace(/\/$/, ''))?.scope
    return scope && /^(user|project|local)$/.test(scope) ? scope : undefined
  } catch {
    return undefined
  }
}

// The version the page names, or undefined for anything that is not one
export const versionOnPage = (text: string): string | undefined => {
  try {
    const version = JSON.parse(text)?.version
    return typeof version === 'string' && /^\d+(\.\d+){1,3}([-+][\w.]+)?$/.test(version) ? version : undefined
  } catch {
    return undefined
  }
}

// The version installed at the scope this copy was installed at, from installed_plugins.json (a chat that started before an update
// runs the old folder, but the Mac has the new one); without an entry, the version folder this copy runs from
export const installedVersionOf = (installed: string, id: string, root: string, scope?: string): string => {
  const folder = root.replace(/\/$/, '').split('/').at(-1) ?? ''
  try {
    const entries: { scope?: string; version?: string; installPath?: string }[] = (JSON.parse(installed)?.plugins?.[id] ?? []).filter(
      (one: { version?: unknown }) => typeof one?.version === 'string' && one.version,
    )
    // This very folder's entry first, then one at the scope it was installed at, then the user's
    const own = entries.find(one => one.installPath?.replace(/\/$/, '') === root.replace(/\/$/, ''))
    return (own ?? entries.find(one => one.scope === (scope ?? 'user')))?.version || folder
  } catch {
    return folder
  }
}

// The installed copy this chat would load if it started now, with the folder Claude Code put it in: this very folder's entry, else the
// project or local install of the folder the chat runs in (the nearest one), else the user's
export const copyOf = (installed: string, id: string, root: string, cwd = ''): { version: string; installPath?: string } | undefined => {
  try {
    const entries: { scope?: string; version?: string; installPath?: string; projectPath?: string }[] = (JSON.parse(installed)?.plugins?.[id] ?? []).filter(
      (one: { version?: unknown }) => typeof one?.version === 'string' && one.version,
    )
    const trim = (path = '') => path.replace(/\/$/, '')
    const own = entries.find(one => trim(one.installPath) === trim(root))
    const inFolder = entries
      .filter(one => one.scope !== 'user' && one.projectPath && (trim(cwd) === trim(one.projectPath) || trim(cwd).startsWith(`${trim(one.projectPath)}/`)))
      .sort((x, y) => trim(y.projectPath).length - trim(x.projectPath).length)[0]
    const one = own ?? inFolder ?? entries.find(one => one.scope === 'user')
    return one?.version ? { version: one.version, installPath: one.installPath ? trim(one.installPath) : undefined } : undefined
  } catch {
    return undefined
  }
}

// How often an open chat looks whether a newer copy is installed, and how long before a chat asks again for a reload to the same
// version (one that brought back the old copy, or was refused)
export const RELOAD_EVERY = 20_000
export const RELOAD_AGAIN = 10 * 60 * 1000

// Whether a chat running `loaded` reloads to the installed copy: a newer one, whole on disk (its manifest names that version), and
// not already asked for in this chat within RELOAD_AGAIN
export const isReloadDue = (
  loaded: string,
  copy: { version: string; installPath?: string } | undefined,
  manifest: string,
  before: { version?: unknown; at?: unknown } | undefined,
  now: number,
) => {
  if (!loaded || !copy?.version || !isNewer(copy.version, loaded)) return false
  if (copy.installPath && versionIn(manifest) !== copy.version) return false
  const at = typeof before?.at === 'number' && Number.isFinite(before.at) ? before.at : undefined
  return !(at !== undefined && before?.version === copy.version && now >= at && now - at < RELOAD_AGAIN)
}
// The moment a chat moves to a newer version, UPDATED_FOR long: the octopus turns blue and jumps (its own animation, played by the
// surface), the name line says "Claudopus updated" in blue and, from UPDATED_SAYS, the new version; a sound plays once; then all is
// as before. The look changes only at UPDATED_SAYS and UPDATED_FOR, so the moment adds no drawings of its own between them: the
// desktop app drops a drawing it asked for once the next change is announced, so a moment redrawn each 150 ms never reached a chat
// run over ssh, whose drawings take longer than that to come back. Its drawings then have as long as the panel's own beat allows. A panel first drawn later than UPDATED_LATE after the load shows nothing of it
export const UPDATED_FOR = 5000
export const UPDATED_SAYS = 2500
export const UPDATED_LATE = 10 * 60 * 1000

// The version this chat ran before this load, when the load moved it to a newer one: the version the chat last loaded (kept
// through a reload), else, for a chat whose last copy kept none, the reload it asked for (reloads/<chat>.json) to this very
// version, if recent
export const updatedFrom = (loaded: string, ran: string, mark: { version?: unknown; from?: unknown; at?: unknown } | undefined, now: number) => {
  const asked =
    mark?.version === loaded && typeof mark.from === 'string' && typeof mark.at === 'number' && now >= mark.at && now - mark.at < UPDATED_LATE ? mark.from : ''
  const before = ran || asked
  return loaded && before && isNewer(loaded, before) ? before : ''
}

// What the name line shows `t` after the moment began, as pieces; nothing once it is over. First "Claudopus updated" in blue, then
// "Claudopus v<to>" in blue. Only the version moved to is ever shown: no number rolls through others on its way, which read as a
// version that does not exist (0.2.63 to 0.2.64 showed v0.2.65 to v0.2.69)
export type UpdatedPiece = { text: string }
export const updatedLook = (to: string, t: number): UpdatedPiece[] | undefined => {
  if (!(t >= 0 && t < UPDATED_FOR) || !to) return undefined
  return [{ text: 'Claudopus' }, { text: t >= UPDATED_SAYS ? `v${to}` : 'updated' }]
}
// The octopus of the moment: the happy one in the workflow blue, its jump played over the whole moment, resting on its last picture,
// and drawn closer, so it is as big as the octopus at rest (the happy drawing leaves room round it for its arms and sparkles)
export const updatedArt = (happy: string, blue: string) =>
  happy.replace('viewBox="0 0 24 24"', 'viewBox="1 -1 22 22"').replaceAll('#4EBA65', blue).replaceAll('dur="2s"', `dur="${UPDATED_FOR / 4000}s" repeatCount="4"`)
const nameIn = (manifest: string) => {
  try {
    const name = JSON.parse(manifest)?.name
    return typeof name === 'string' && /^[\w.-]+$/.test(name) ? name : ''
  } catch {
    return ''
  }
}
const versionIn = (manifest: string) => {
  try {
    return String(JSON.parse(manifest)?.version ?? '')
  } catch {
    return ''
  }
}

// The two commands, in order: refresh the marketplace's copy (`plugin update` alone does not, and reports the old version as the
// latest), then update the mod from it, at the scope it was installed at
export const updateSteps = (engine: string, from: { marketplace: string; plugin: string }, scope?: string): [string[], string[]] => [
  [engine, 'plugin', 'marketplace', 'update', from.marketplace],
  [engine, 'plugin', 'update', `${from.plugin}@${from.marketplace}`, ...(scope ? ['--scope', scope] : [])],
]

// The version `plugin update` says it moved to, or the one it says is already the latest
export const updatedTo = (out: string): { version: string; isNew: boolean } | undefined => {
  const moved = /updated from \S+ to (\S+?)\.?(?:\s|$)/.exec(out)
  if (moved?.[1]) return { version: moved[1], isNew: true }
  const same = /already at the latest version \(([^)]+)\)/.exec(out)
  return same?.[1] ? { version: same[1], isNew: false } : undefined
}

// ---- One look: the version page, then the two steps when it names another version ----

// What a look found: this Mac already has the version the page names, it downloaded it now, or it could not tell or download
export type Look = { kind: 'latest'; version: string } | { kind: 'updated'; version: string } | { kind: 'failed'; why: string; version?: string; next?: string }
// What a look needs of the Mac, so the hourly look and Config's Check for updates run the very same steps, and tests can give them
export type LookIo = {
  read: (path: string) => Promise<string>
  write: (path: string, text: string) => Promise<unknown>
  run: (argv: string[], timeoutMs: number) => Promise<{ exitCode: number; stdout: string; stderr: string }>
  page: () => Promise<{ ok: boolean; status: number; text: string }>
  now: () => Promise<number>
  log: (text: string) => Promise<unknown>
}
// One look, run by whoever holds the update lock: it reads the version page, runs the two update steps only when the page names a
// version other than the one installed, and keeps what it learnt in update.json
export const lookOnce = async (io: LookIo, at: { from: { plugins: string; marketplace: string; plugin: string }; root: string; engine: string; stampPath: string; cwd?: string }): Promise<Look> => {
  const { from, engine, stampPath } = at
  const before = stampOf(await io.read(stampPath).catch(() => ''))
  const now = await io.now()
  const installed = await io.read(`${from.plugins}/installed_plugins.json`).catch(() => '')
  const id = `${from.plugin}@${from.marketplace}`
  // A chat on a copy another update has replaced has no entry of its own: the copy it would load now stands for it, so its scope and
  // version are the ones compared and updated (a project-only install is not updated at the user's scope)
  const root = scopeOf(installed, id, at.root) ? at.root : (copyOf(installed, id, at.root, at.cwd)?.installPath ?? at.root)
  const scope = scopeOf(installed, id, root)
  const have = installedVersionOf(installed, id, root, scope)
  // The version page on claudopus.ai says which version is current; the same one installed means nothing is run
  const page = await io.page()
  const current = page.ok ? versionOnPage(page.text) : undefined
  if (!current) {
    const result = `version page not read: ${page.ok ? 'no version on it' : page.status || page.text.slice(0, 120)}`
    await io.write(stampPath, JSON.stringify({ at: now, version: before?.version || have, result }))
    await io.log(`Claudopus ${result}`)
    return { kind: 'failed', why: page.ok ? 'claudopus.ai named no version' : page.status ? `claudopus.ai answered ${page.status}` : 'claudopus.ai did not answer' }
  }
  if (current === have) {
    await io.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))
    return { kind: 'latest', version: have }
  }
  await io.log(`Claudopus ${current} is on the version page and ${have} is installed: updating`)
  // A marketplace that is a folder of the code (a git checkout) is brought up to date first, so the refresh finds the new version
  const known = await io.read(`${from.plugins}/known_marketplaces.json`).catch(() => '')
  const source = (() => {
    try {
      const one = JSON.parse(known)?.[from.marketplace]?.source
      return one?.source === 'directory' && typeof one.path === 'string' ? one.path : ''
    } catch {
      return ''
    }
  })()
  const pulled = source ? await pullFolder(io, source) : undefined
  if (pulled?.kind === 'refused') await io.log(`Claudopus marketplace folder not updated: ${pulled.why}`)
  const [refresh, update] = updateSteps(engine, from, scope)
  const run = (argv: string[], timeoutMs: number) => io.run(argv, timeoutMs).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
  const refreshed = await run(refresh, 180_000)
  const updated = refreshed.exitCode === 0 ? await run(update, 300_000) : refreshed
  const to = refreshed.exitCode === 0 ? updatedTo(`${updated.stdout}\n${updated.stderr}`) : undefined
  const why = `${updated.stderr || updated.stdout}`.trim().slice(-200)
  const result = to ? (to.isNew ? 'updated' : 'latest') : `${refreshed.exitCode === 0 ? 'not updated' : 'marketplace not refreshed'}: ${why}`
  // A look that learnt nothing keeps the version the last one found, so About still says what is installed
  await io.write(stampPath, JSON.stringify({ at: now, version: to?.version ?? before?.version ?? '', result }))
  if (to?.isNew) await io.log(`Claudopus updated to ${to.version}: chats that start from now on load it`)
  else if (!to) await io.log(`Claudopus ${result}`)
  // Both steps ran, yet where Claude Code installs it from still has an older version than the page (a folder of its code not brought
  // up to date): the newest is not here, and that is said rather than "newest"
  if (to && isNewer(current, to.version))
    return pulled?.kind === 'refused'
      ? { kind: 'failed', version: current, why: `where Claude Code installs it from still has v${to.version}: ${pulled.why}`, next: 'Nothing in it was changed.' }
      : { kind: 'failed', version: current, why: `where Claude Code installs it from still has v${to.version}`, next: 'Bring that up to date, then check again.' }
  if (to) return { kind: to.isNew ? 'updated' : 'latest', version: to.version }
  const said = why.split('\n').at(-1)?.trim() ?? ''
  return { kind: 'failed', version: current, why: `${refreshed.exitCode === 0 ? 'Claude Code did not update it' : 'Claude Code could not refresh where it comes from'}${said ? ` (${said.slice(0, 120)})` : ''}` }
}

// What Config's Check for updates says once its look is over, for a chat running `loaded`: newest, downloaded and waiting for
// /reload-plugins in this chat, or why not. A chat on this Mac also switches by itself once it is idle; one run from another Mac
// cannot (the engine refuses a reload it was not typed in there), so there it is only typed
export const checkSaid = (look: Look, loaded: string, isTypedOnly = false, isFolder = false): { text: string; isError: boolean } => {
  if (look.kind === 'failed')
    return { text: `Couldn't ${look.version ? `${isFolder ? 'update to' : 'download'} v${look.version}` : 'check'}: ${look.why}. ${look.next ?? 'Try again later.'}`, isError: true }
  if (loaded && isNewer(look.version, loaded))
    return { text: `v${look.version} ${isFolder ? 'is in its folder now' : 'downloaded'}. Type /reload-plugins to switch this chat to it${isTypedOnly ? '.' : ', or it switches by itself in a moment.'}`, isError: false }
  return { text: `You're on the newest version (v${look.version}).`, isError: false }
}
// ---- A copy run from a folder of its code: the folder is brought up to date with git ----

// A folder of the code is a git checkout; bringing it up to date fetches main from online and moves main forward to it, only as a
// plain fast-forward. Only Claudopus's own main checkout is touched: not another repo that holds the folder, not a worktree (where
// work is under way) and not a branch other than main, which releases never reach. git itself refuses, before it changes anything,
// when an uncommitted change or an untracked file there would be overwritten, so work in the folder is never lost; a main with commits
// of its own is left alone. `isClean` says whether the folder had no uncommitted changes, so nothing uncommitted is copied on
export type Pulled = { kind: 'pulled' | 'same'; isClean: boolean } | { kind: 'refused'; why: string }
export const pullFolder = async (io: Pick<LookIo, 'run'>, folder: string): Promise<Pulled> => {
  const git = (args: string[], timeoutMs = 20_000) =>
    io
      .run(['env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', folder, ...args], timeoutMs)
      .catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
  const last = (out: { stdout: string; stderr: string }) => `${out.stderr || out.stdout}`.trim().split('\n').at(-1)?.trim().replace(/^(fatal|error): /, '').slice(0, 140) ?? ''
  if ((await git(['rev-parse', '--show-toplevel'])).exitCode !== 0) return { kind: 'refused', why: 'its folder is not a git checkout' }
  if ((await git(['ls-files', '--error-unmatch', ':/mods/claudopus/.claude-plugin/plugin.json'])).exitCode !== 0)
    return { kind: 'refused', why: "its folder is in a git checkout that isn't Claudopus's" }
  const [gitDir = '', commonDir = ''] = (await git(['rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir'])).stdout.trim().split('\n')
  if (gitDir.trim() !== commonDir.trim()) return { kind: 'refused', why: 'its folder is a git worktree, not the main checkout' }
  const branch = (await git(['symbolic-ref', '-q', '--short', 'HEAD'])).stdout.trim()
  if (!branch) return { kind: 'refused', why: 'its folder is on no branch' }
  const upstream = (await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])).stdout.trim()
  if (branch !== 'main' || !/^[^/]+\/main$/.test(upstream)) return { kind: 'refused', why: `its folder is on ${upstream ? `${branch}, following ${upstream}` : branch}, and releases come out on main` }
  const fetched = await git(['fetch', '--quiet'], 120_000)
  if (fetched.exitCode !== 0) return { kind: 'refused', why: `its folder could not fetch ${upstream} (${last(fetched)})` }
  const [head, theirs] = [(await git(['rev-parse', 'HEAD'])).stdout.trim(), (await git(['rev-parse', '@{u}'])).stdout.trim()]
  if (!head || !theirs) return { kind: 'refused', why: `git did not say where ${upstream} is` }
  const isClean = async () => {
    const status = await git(['status', '--porcelain', '--untracked-files=no'])
    return status.exitCode === 0 && !status.stdout.trim()
  }
  if (head === theirs) return { kind: 'same', isClean: await isClean() }
  if ((await git(['merge-base', '--is-ancestor', 'HEAD', '@{u}'])).exitCode !== 0) return { kind: 'refused', why: `its folder's main has commits of its own that ${upstream} does not have` }
  const merged = await git(['merge', '--ff-only', '--quiet', '@{u}'], 120_000)
  if (merged.exitCode === 0) return { kind: 'pulled', isClean: await isClean() }
  const said = `${merged.stderr}\n${merged.stdout}`
  if (/would be overwritten/.test(said)) return { kind: 'refused', why: "changes in its folder that aren't committed touch files the update changes" }
  return { kind: 'refused', why: `git would not update its folder (${last(merged)})` }
}

// The marketplace a copy run from a folder belongs to, when Claude Code knows that folder as a directory marketplace: its record
// then follows the folder too, so /plugin and new installs agree with it
export const folderMarketplace = (known: string, root: string): string | undefined => {
  try {
    const trim = (path = '') => path.replace(/\/+$/, '')
    const entries = Object.entries(JSON.parse(known) ?? {}) as [string, { source?: { source?: string; path?: string } }][]
    const found = entries.find(([name, one]) => /^[\w.-]+$/.test(name) && one?.source?.source === 'directory' && one.source.path && (trim(root) === trim(one.source.path) || trim(root) === `${trim(one.source.path)}/mods/claudopus`))
    return found?.[0]
  } catch {
    return undefined
  }
}

// One look for a copy run from a folder of its code: the version page, then, when it names a newer version than the folder has,
// the folder brought up to date; Claude Code's record of a directory marketplace in that folder is refreshed after it
export const folderLook = async (io: LookIo, at: { root: string; plugins: string; engine: string; stampPath: string }): Promise<Look> => {
  const { root, stampPath } = at
  const now = await io.now()
  const manifest = async () => versionIn(await io.read(`${root}/.claude-plugin/plugin.json`).catch(() => ''))
  const have = await manifest()
  const page = await io.page()
  const current = page.ok ? versionOnPage(page.text) : undefined
  if (!current) {
    const result = `version page not read: ${page.ok ? 'no version on it' : page.status || page.text.slice(0, 120)}`
    await io.write(stampPath, JSON.stringify({ at: now, version: have, result }))
    await io.log(`Claudopus ${result}`)
    return { kind: 'failed', why: page.ok ? 'claudopus.ai named no version' : page.status ? `claudopus.ai answered ${page.status}` : 'claudopus.ai did not answer' }
  }
  if (have && !isNewer(current, have)) {
    await io.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))
    return { kind: 'latest', version: have }
  }
  await io.log(`Claudopus ${current} is on the version page and its folder ${root} has ${have || 'no version'}: bringing the folder up to date`)
  const pulled = await pullFolder(io, root)
  const to = await manifest()
  if (pulled.kind === 'refused') {
    await io.write(stampPath, JSON.stringify({ at: now, version: to, result: `folder not updated: ${pulled.why}` }))
    await io.log(`Claudopus folder not updated: ${pulled.why}`)
    return { kind: 'failed', version: current, why: pulled.why, next: 'Nothing in it was changed.' }
  }
  if (pulled.kind === 'pulled') {
    await io.log(`Claudopus folder updated from ${have} to ${to}: chats that reload or start from now on load it`)
    // Claude Code's own record of the folder follows it, when it knows the folder as a marketplace; what it says is only logged
    const marketplace = folderMarketplace(await io.read(`${at.plugins}/known_marketplaces.json`).catch(() => ''), root)
    const plugin = nameIn(await io.read(`${root}/.claude-plugin/plugin.json`).catch(() => ''))
    const installed = await io.read(`${at.plugins}/installed_plugins.json`).catch(() => '')
    const scopes = (() => {
      try {
        return (JSON.parse(installed)?.plugins?.[`${plugin}@${marketplace}`] ?? []).map((one: { scope?: unknown }) => one?.scope) as unknown[]
      } catch {
        return []
      }
    })()
    const scope = scopes.includes('user') ? 'user' : scopes.find((one): one is string => typeof one === 'string' && /^(user|project|local)$/.test(one))
    // Only a folder with nothing uncommitted: the record is copied from the folder as it is on disk
    if (marketplace && plugin && scope && pulled.isClean)
      for (const step of updateSteps(at.engine, { marketplace, plugin }, scope)) {
        const out = await io.run(step, 180_000).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
        if (out.exitCode === 0) continue
        await io.log(`Claudopus record of ${plugin}@${marketplace} not refreshed: ${`${out.stderr || out.stdout}`.trim().slice(-160)}`)
        break
      }
  }
  await io.write(stampPath, JSON.stringify({ at: now, version: to, result: pulled.kind === 'pulled' ? 'updated' : 'latest' }))
  if (to && isNewer(current, to)) return { kind: 'failed', version: current, why: `its folder's main online still has v${to}`, next: 'Check again in a few minutes.' }
  return { kind: pulled.kind === 'pulled' ? 'updated' : 'latest', version: to || current }
}

// Whether a look is due: none yet, or the last one is older than UPDATE_EVERY (a clock moved back counts as due)
export const isUpdateDue = (stamp: UpdateStamp | undefined, now: number) => !stamp || now - stamp.at >= UPDATE_EVERY || now < stamp.at

// Whether version a is newer than b, by its dotted numbers
export const isNewer = (a: string, b: string) => {
  const pa = a.split(/[.-]/).map(n => parseInt(n, 10) || 0)
  const pb = b.split(/[.-]/).map(n => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return false
}

export const stampOf = (text: string): UpdateStamp | undefined => {
  try {
    const v = JSON.parse(text)
    return typeof v?.at === 'number' ? { at: v.at, version: String(v.version ?? ''), result: String(v.result ?? '') } : undefined
  } catch {
    return undefined
  }
}
