// ---- The same results on every Mac: a Mac that reaches another over ssh (config.json `macs`) brings over the results that Mac has
// and this one lacks, hands it those this one has and it lacks, and carries what the person did to a result both have (put away,
// brought back, answered) both ways. A result is never rewritten, deleted or kept twice: only what is missing is copied, by its
// folder's name, and only the marks beside it change. Paths inside it name that Mac's home, so they are moved onto the other's ----

// How often, at most, by whichever chat on this Mac comes first
export const RESULTS_EVERY = 120_000
// The most results one trip brings over each way, so a long gap is closed over a few trips
export const RESULTS_A_TRIP = 30
// A folder under reports/ another Mac may be asked for or handed: no slash, no dot first, nothing the shell reads
export const isResultId = (one: unknown): one is string => typeof one === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/.test(one)
// A home a Mac names: /Users/<name>, or another plain absolute path
export const isHome = (one: string) => /^\/[A-Za-z0-9._/-]{1,200}$/.test(one) && !one.endsWith('/') && !one.includes('..')

const RESULT_MARK = '---claudopus-result---'
// What one look there answers: its home, then each result as its folder's name, its meta.json's checksum and its meta.json on one line
export const RESULTS_LOOK = `sh -c 'echo $HOME; R=$HOME/.claude/claudopus/reports; [ -d "$R" ] || exit 0; cd "$R" && for d in *; do [ -f "$d/meta.json" ] || continue; echo ${RESULT_MARK}; echo "$d"; cksum < "$d/meta.json"; tr -d "\\n" < "$d/meta.json"; echo; done'`
export type Theirs = { home: string; results: Map<string, { sum: string; text: string }> }
export const resultsOf = (out: string): Theirs | undefined => {
  const [head = '', ...parts] = out.split(`${RESULT_MARK}\n`)
  // Its home is the last line before the first result, past any login banner
  const home = head.trim().split('\n').pop()?.trim() ?? ''
  if (!isHome(home)) return undefined
  const results = new Map<string, { sum: string; text: string }>()
  for (const part of parts) {
    const [id = '', sum = '', text = ''] = part.split('\n')
    if (isResultId(id) && /^\d+ \d+$/.test(sum.trim()) && text.trim().startsWith('{')) results.set(id, { sum: sum.trim(), text })
  }
  return { home, results }
}

// A path under one home, moved onto the other: only that home whole, never a longer name it begins (/Users/dima in /Users/dimas)
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const rehome = (text: string, from: string, to: string) => (from === to ? text : text.replace(new RegExp(`${escaped(from)}(?![A-Za-z0-9_-]|\\.[A-Za-z0-9_-])`, 'g'), () => to))

// What the person did to a result, kept beside it: when it was put away, when it was last brought back, their answers to what it waits on
type Marked = { archived?: unknown; broughtBack?: unknown; waiting?: unknown; answer?: unknown }
type Wait = { text: string; answer?: string }
const at = (one: unknown) => (typeof one === 'number' && Number.isFinite(one) && one > 0 ? one : 0)
const waitsIn = (one: unknown): Wait[] | undefined => (Array.isArray(one) ? one.filter((w): w is Wait => Boolean(w) && typeof (w as Wait).text === 'string') : undefined)
// One answer for one thing it waits on: a Yes or No over a Not now, else the first
const answerOf = (a?: string, b?: string) => (!a ? b : !b ? a : a === 'Not now' && b !== 'Not now' ? b : a)
// The marks of both, together: put away or not by whichever came last, put away or brought back; an answer given on either Mac kept
export const marksOf = (mine: Marked, theirs: Marked) => {
  const archived = Math.max(at(mine.archived), at(theirs.archived))
  const back = Math.max(at(mine.broughtBack), at(theirs.broughtBack))
  const [a, b] = [waitsIn(mine.waiting), waitsIn(theirs.waiting)]
  // Each thing it waits on is matched by its text; one only one side has is kept as that side has it
  const waiting = a?.length && b?.length
    ? a.map(one => {
        const answer = answerOf(one.answer, b.find(other => other.text === one.text)?.answer)
        return answer ? { ...one, answer } : one
      })
    : a?.length ? a : (b ?? a)
  const answer = answerOf(typeof mine.answer === 'string' ? mine.answer : undefined, typeof theirs.answer === 'string' ? theirs.answer : undefined)
  return { archived: archived > back ? archived : undefined, broughtBack: back || undefined, waiting, answer }
}
// A meta.json with the marks of both, as it is written: undefined when it would not change
// (with what its archive was when last made the same, so a bring back by an older version on either side counts as one)
export const merged = (text: string, theirs: Marked, wasArchived = 0, now = 0) => {
  try {
    const mine = JSON.parse(text) as Record<string, unknown>
    const marks = marksOf(broughtBackBy(mine, wasArchived, now), broughtBackBy(theirs, wasArchived, now))
    const next: Record<string, unknown> = { ...mine }
    for (const [key, value] of Object.entries(marks)) if (value === undefined) delete next[key]
    else next[key] = value
    const same = (one: Record<string, unknown>) => JSON.stringify(['archived', 'broughtBack', 'waiting', 'answer'].map(key => one[key] ?? null))
    return same(next) === same(mine) ? undefined : `${JSON.stringify(next, null, 2)}\n`
  } catch {
    return undefined
  }
}
export const parsedMeta = (text: string): Marked => {
  try {
    const one = JSON.parse(text) as unknown
    return one && typeof one === 'object' ? (one as Marked) : {}
  } catch {
    return {}
  }
}

// Run here by bash, with a folder here, the Mac and the command there: brings results from there into the folder as one tar stream,
// or hands that Mac the results in the folder here. Either fails when ssh or tar on either end does, so a stream cut short is
// never taken as whole
export const PULL = 'set -o pipefail; S=$1; M=$2; C=$3; ssh -o BatchMode=yes -o ConnectTimeout=5 -- "$M" "$C" | tar xf - -C "$S"'
export const pullThere = (ids: readonly string[]) => `cd ~/.claude/claudopus/reports && COPYFILE_DISABLE=1 tar cf - -- ${ids.filter(isResultId).join(' ')}`
export const PUSH = 'set -o pipefail; S=$1; M=$2; C=$3; shift 3; cd "$S" && COPYFILE_DISABLE=1 tar cf - -- "$@" | ssh -o BatchMode=yes -o ConnectTimeout=5 -- "$M" "$C"'
// A folder goes in place only when no folder has its name, under a claim only one chat can take at a time (mkdir), so two chats
// never put one inside the other: run by sh with the folder, where it goes and the claim
export const PLACE = 'mkdir "$3" 2>/dev/null || exit 4; if [ -e "$2" ]; then s=6; else mv "$1" "$2"; s=$?; fi; rmdir "$3"; exit $s'
// There, the same for each folder handed over, once the whole stream is in; what was handed and not put in place goes with its own folder
export const PUSH_THERE = `sh -c 'R=$HOME/.claude/claudopus/reports; T=$R/_sync/in.$$; mkdir -p "$T" && tar xf - -C "$T" || { rm -rf "$T"; exit 5; }; for d in "$T"/*; do n=$(basename "$d"); C=$R/_sync/claim-$n; mkdir "$C" 2>/dev/null || continue; [ -e "$R/$n" ] || mv "$d" "$R/$n"; rmdir "$C"; done; rm -rf "$T"'`
// What a result's archive was on both Macs when last made the same, and what a side now says: a side that had it put away then and
// has it no longer, with no bring back as late, was brought back there by a version that keeps no time for it
export const broughtBackBy = <T extends Marked>(one: T, wasArchived: number, now: number): T =>
  wasArchived && !at(one.archived) && at(one.broughtBack) < wasArchived ? { ...one, broughtBack: now } : one
// Writes a result's marks there only when its meta.json is still what was read, so a press there since is never undone
export const markThere = (id: string, sum: string) =>
  `sh -c 'f=$HOME/.claude/claudopus/reports/${id}/meta.json; [ "$(cksum < "$f")" = "${sum}" ] || exit 3; cat > "$f.part" && mv -f "$f.part" "$f"'`
