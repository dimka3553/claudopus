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
