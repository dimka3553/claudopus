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
// The moment a chat moves to a newer version: the header's version rolls to the new number and says "Updated" in blue for
// UPDATED_FOR, drawn again each UPDATED_STEP, then settles to the plain number. A panel first drawn later than UPDATED_LATE after
// the load shows nothing of it
export const UPDATED_FOR = 8000
export const UPDATED_STEP = 150
export const UPDATED_LATE = 10 * 60 * 1000
const UPDATED_ROLL = 1500
const UPDATED_SETTLE = 7000
const UPDATED_WORD = 'Updated'

// The version this chat ran before this load, when the load moved it to a newer one: the version the chat last loaded (kept
// through a reload), else, for a chat whose last copy kept none, the reload it asked for (reloads/<chat>.json) to this very
// version, if recent
export const updatedFrom = (loaded: string, ran: string, mark: { version?: unknown; from?: unknown; at?: unknown } | undefined, now: number) => {
  const asked =
    mark?.version === loaded && typeof mark.from === 'string' && typeof mark.at === 'number' && now >= mark.at && now - mark.at < UPDATED_LATE ? mark.from : ''
  const before = ran || asked
  return loaded && before && isNewer(loaded, before) ? before : ''
}

// What the version line shows `t` after the moment began, as pieces in a tone each; nothing once it is over. First the numbers
// that changed roll like a counter and land one by one, left to right; then "v<to> · Updated" in blue, a glint passing along the
// word; then both dim for a moment before the plain number comes back
export type UpdatedPiece = { text: string; tone: 'dim' | 'blue' | 'glint' }
export const updatedLook = (from: string, to: string, t: number): UpdatedPiece[] | undefined => {
  if (!(t >= 0 && t < UPDATED_FOR) || !to) return undefined
  const target = `v${to}`
  if (t < UPDATED_ROLL) {
    const old = `v${from}`
    let same = 0
    while (same < target.length && target[same] === old[same]) same += 1
    const changing = [...target.slice(same)]
    const landed = Math.floor((t / UPDATED_ROLL) * (changing.length + 1))
    const frame = Math.floor(t / UPDATED_STEP)
    const rolled = changing.map((ch, i) => (i < landed || !/\d/.test(ch) ? ch : String((Number(ch) + frame + i * 3 + 1) % 10))).join('')
    return [...(same ? [{ text: target.slice(0, same), tone: 'dim' as const }] : []), { text: rolled, tone: 'blue' }]
  }
  if (t >= UPDATED_SETTLE) return [{ text: `${target} · ${UPDATED_WORD}`, tone: 'dim' }]
  // The glint crosses the word, rests a little, and crosses again
  const at = Math.floor((t - UPDATED_ROLL) / UPDATED_STEP) % (UPDATED_WORD.length + 5)
  const word: UpdatedPiece[] =
    at < UPDATED_WORD.length
      ? [
          { text: UPDATED_WORD.slice(0, at), tone: 'blue' },
          { text: UPDATED_WORD.charAt(at), tone: 'glint' },
          { text: UPDATED_WORD.slice(at + 1), tone: 'blue' },
        ]
      : [{ text: UPDATED_WORD, tone: 'blue' }]
  const pieces: UpdatedPiece[] = [{ text: target, tone: 'blue' }, { text: ' · ', tone: 'dim' }, ...word]
  return pieces.filter(piece => piece.text)
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
