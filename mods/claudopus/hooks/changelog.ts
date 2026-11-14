// The changelog, CHANGELOG.md beside the mod: what changed for the person in each version, newest first. The About tab opens it
// whole, and the update screen shows the versions a person did not have yet. The site's changelog page is made from the same file

export type Version = { version: string; date: string; changes: string[] }

// Its versions, newest first as written: a heading "## x.y.z · date" each, then its changes, a "- " line each
export const changelogOf = (text: string): Version[] => {
  const versions: Version[] = []
  for (const line of text.split('\n')) {
    const head = /^## (\d+\.\d+\.\d+)(?:\s+·\s+(.+))?\s*$/.exec(line)
    const last = versions.at(-1)
    if (head) versions.push({ version: head[1] ?? '', date: (head[2] ?? '').trim(), changes: [] })
    else if (last && /^- \S/.test(line)) last.changes.push(line.slice(2).trim())
  }
  return versions
}

// Whether version a is newer than b, by its dotted numbers
const newer = (a: string, b: string) => {
  const pa = a.split('.').map(n => parseInt(n, 10) || 0)
  const pb = b.split('.').map(n => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return false
}

// The app draws no tab holding more than about 262,000 characters, every element counted with its text. What one version costs
// there: its words, and a share for each element that holds them
const ELEMENT = 220
const costOf = (v: Version) => v.version.length + v.date.length + 4 * ELEMENT + v.changes.reduce((n, one) => n + one.length + 2 * ELEMENT, 0)
// What a tab of versions may hold, well under the app's limit: the update screen and the changelog tab
export const SCREEN_BUDGET = 60_000
export const TAB_BUDGET = 150_000

// The versions newest first that fit `budget`, always the newest one; and how many older ones were left out
export const fitted = (versions: Version[], budget: number) => {
  const shown: Version[] = []
  let used = 0
  for (const v of versions) {
    used += costOf(v)
    if (shown.length && used > budget) break
    shown.push(v)
  }
  return { shown, left: versions.length - shown.length }
}

// What the update screen shows for a move from `from` to `to`: every version after `from` up to `to`, newest first, as many as
// fit, and how many older ones it leaves to the changelog
export const missedOf = (versions: Version[], from: string, to: string, budget = SCREEN_BUDGET) =>
  fitted(versions.filter(v => newer(v.version, from) && !newer(v.version, to)), budget)

// The record of the newest version whose changes the person has seen on this Mac, seen.json: dismissing the screen writes it
export const seenIn = (text: string) => {
  try {
    const v = JSON.parse(text)?.version
    return typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v) ? v : ''
  } catch {
    return ''
  }
}
// Whether the update screen shows in a chat running `loaded`: a version newer than the one whose changes were seen last
export const isScreenDue = (loaded: string, seen: string) => Boolean(loaded && seen && newer(loaded, seen))

// The version a Mac ran before `loaded`: the newest of the mod's other installed copies (Claude Code keeps each version's folder)
// older than it; nothing on a first install
export const previousOf = (names: string[], loaded: string) =>
  names.filter(name => /^\d+\.\d+\.\d+$/.test(name) && newer(loaded, name)).reduce((best, name) => (!best || newer(name, best) ? name : best), '')
