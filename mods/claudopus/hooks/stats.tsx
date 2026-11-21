// Stats: what the work added up to, read from Claude's own records of it. Each piece of work, helper, workflow agent and the chat
// itself is a transcript (~/.claude/projects/<folder>/<chat id>.jsonl and its subagents/ folder); every response in one carries
// its model and the tokens it used, by kind: input, cache writes (5-minute and 1-hour), cache reads, output. A transcript can run
// to a hundred megabytes, more than the mod may read, so jq sums each one outside the mod, and the sums are kept by file size
// and time in ~/.claude/claudopus/stats/<chat id>.json, so a file is read once until it changes
import type { ElementTable } from 'claude-code'

export type Span = [from: number, to: number]
// One response: its id (the same response can sit in two transcripts, a fork and its chat), model, time, whether it ran fast,
// whether its prompt passed 100,000 tokens, and its tokens by kind
export type Msg = [id: string, model: string, at: number, fast: number, long: number, input: number, write5m: number, write1h: number, read: number, output: number]
// One call of the to-do tool: when, the item, its state, the wording it had before
export type TodoCall = [at: number, item: string, state: string, was: string]
// What jq makes of one transcript: the stretches it was busy (rows less than GAP apart), its responses, its to-do calls
// and, in a chat's own transcript, each turn that began with the person's message: from it to the chat's last response or tool
// result before the next message of any kind (the person's, or a background agent's notice); bookkeeping rows such as the queue's,
// which Claude Code writes as the next message arrives, and meta rows (the mod's notices, a command's caveat, a compaction's
// summary) never end a turn
export type FileSum = { s: Span[]; u: Msg[]; d: TodoCall[]; turns?: Span[] }
// One transcript, and what it was: a piece of work the chat started, a helper a piece of work started, an agent of a workflow,
// or the chat's own thread
export type Run = { id: string; kind: 'work' | 'helper' | 'flow' | 'chat'; parent: string; title: string; isFinished: boolean; sum: FileSum }

// A transcript with no row for longer than this was not working: it had finished and was later sent a message
export const GAP = 15 * 60_000

// ---- Prices ----

// Dollars per million tokens: input, 5-minute cache write, 1-hour cache write, cache read, output. From Anthropic's pricing page,
// platform.claude.com/docs/en/about-claude/pricing, read 12 Nov 2026. Fast mode is twice each price, and caching's multipliers
// apply on top. Haiku 5.5 costs more once a prompt passes 100,000 tokens (`long`)
type Price = [input: number, write5m: number, write1h: number, read: number, output: number]
export const PRICED = '12 Nov 2026'
const PRICES: [string, Price, Price?][] = [
  ['claude-fable-5-2', [8, 10, 16, 0.2, 40]],
  ['claude-mythos-5-2', [8, 10, 16, 0.2, 40]],
  ['claude-fable-5-1', [10, 12.5, 20, 0.25, 50]],
  ['claude-mythos-5-1', [10, 12.5, 20, 0.25, 50]],
  ['claude-fable-5', [10, 12.5, 20, 1, 50]],
  ['claude-mythos-5', [10, 12.5, 20, 1, 50]],
  ['claude-opus-5-5', [4, 5, 8, 0.2, 20]],
  ['claude-opus-5', [5, 6.25, 10, 0.5, 25]],
  ['claude-opus-4-8', [5, 6.25, 10, 0.5, 25]],
  ['claude-opus-4-7', [5, 6.25, 10, 0.5, 25]],
  ['claude-opus-4-6', [5, 6.25, 10, 0.5, 25]],
  ['claude-opus-4-5', [5, 6.25, 10, 0.5, 25]],
  ['claude-sonnet-5-5', [2, 2.5, 4, 0.1, 10]],
  ['claude-sonnet-5', [2, 2.5, 4, 0.2, 10]],
  ['claude-sonnet-4-6', [3, 3.75, 6, 0.3, 15]],
  ['claude-sonnet-4-5', [3, 3.75, 6, 0.3, 15]],
  ['claude-haiku-5-5', [0.1, 0.125, 0.2, 0.01, 0.5], [0.5, 0.625, 1, 0.05, 2.5]],
  ['claude-haiku-4-5', [1, 1.25, 2, 0.1, 5]],
]
// The price of a model by its id, which may carry a suffix ("[1m]", a date); an id not listed, such as a newer version, has none
export const priceOf = (model: string, isLong = false): Price | undefined => {
  const id = model.toLowerCase()
  const row = PRICES.find(([name]) => id === name || new RegExp(`^${name}(-\\d{8}|\\[|@)`).test(id))
  return row ? (isLong && row[2] ? row[2] : row[1]) : undefined
}
// What one response would have cost on the API, in dollars; undefined for a model with no price
export const costOf = (m: Msg) => {
  const p = priceOf(m[1], m[4] === 1)
  if (!p) return undefined
  const fast = m[3] === 1 ? 2 : 1
  return ((m[5] * p[0] + m[6] * p[1] + m[7] * p[2] + m[8] * p[3] + m[9] * p[4]) * fast) / 1_000_000
}

// ---- Time ----

// Stretches of time joined where they touch or overlap, in order
export const union = (spans: Span[]): Span[] =>
  [...spans]
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0])
    .reduce<Span[]>((all, [a, b]) => {
      const last = all.at(-1)
      if (last && a <= last[1]) last[1] = Math.max(last[1], b)
      else all.push([a, b])
      return all
    }, [])
export const lengthOf = (spans: Span[]) => union(spans).reduce((sum, [a, b]) => sum + (b - a), 0)
export const clip = (spans: Span[], from: number, to: number): Span[] => spans.map(([a, b]): Span => [Math.max(a, from), Math.min(b, to)]).filter(([a, b]) => b > a)
// The work added up (each piece's busy time, summed), the time on the clock while any of it ran, and the difference: what running
// side by side saved. Work that ran alone adds the same to both, so only overlap saves time
export const timeOf = (pieces: Span[][]) => {
  const added = pieces.reduce((sum, spans) => sum + lengthOf(spans), 0)
  const all = union(pieces.flat())
  const clock = lengthOf(all)
  return { added, clock, saved: added - clock, first: all[0]?.[0] ?? 0, last: all.at(-1)?.[1] ?? 0 }
}

// ---- To-dos ----

// Each item's last state, as its calls left it (an item renamed with `was` is the same item), with when it was last ticked done
const key = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export const todosOf = (calls: TodoCall[]) => {
  const items = new Map<string, { state: string; at: number }>()
  for (const [at, item, state, was] of [...calls].sort((a, b) => a[0] - b[0])) {
    if (!item) continue
    const old = items.get(key(was || item))
    if (was && old) items.delete(key(was))
    const next = { state: state || old?.state || 'open', at: state === 'done' ? at : (old?.at ?? 0) }
    items.set(key(item), next)
  }
  return [...items.values()]
}

// ---- Pieces of work ----

// A piece of work: one the chat started, or a workflow run. Its busy time is its own and that of the helpers it started (they are
// part of its time); a workflow's is its agents'. Its bars on the timeline are that time, in its model; a workflow's in each agent's
export type Bar = { from: number; to: number; model: string }
export type Piece = { id: string; title: string; isFlow: boolean; isFinished: boolean; spans: Span[]; bars: Bar[]; calls: TodoCall[]; ended: number }
// The model a transcript ran on: the one most of its output came from
export const mainModel = (msgs: Msg[]) => {
  const out = new Map<string, number>()
  for (const m of msgs) if (m[1] && m[1] !== '<synthetic>') out.set(m[1], (out.get(m[1]) ?? 0) + m[9] + 1)
  return [...out.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
}
export const piecesOf = (runs: Run[]): Piece[] => {
  const kids = (id: string): Run[] => runs.filter(r => r.kind === 'helper' && r.parent === id).flatMap(r => [r, ...kids(r.id)])
  const works = runs.filter(r => r.kind === 'work').map(r => {
    const spans = union([...r.sum.s, ...kids(r.id).flatMap(k => k.sum.s)])
    const model = mainModel(r.sum.u)
    return { id: r.id, title: r.title, isFlow: false, isFinished: r.isFinished, spans, bars: spans.map(([from, to]) => ({ from, to, model })), calls: r.sum.d, ended: spans.at(-1)?.[1] ?? 0 }
  })
  const flows = [...new Set(runs.filter(r => r.kind === 'flow').map(r => r.parent))].map(id => {
    const agents = runs.filter(r => r.kind === 'flow' && r.parent === id)
    const spans = union(agents.flatMap(a => a.sum.s))
    return {
      id,
      title: agents[0]?.title ?? 'Workflow',
      isFlow: true,
      isFinished: agents.every(a => a.isFinished),
      spans,
      bars: agents.flatMap(a => union(a.sum.s).map(([from, to]) => ({ from, to, model: mainModel(a.sum.u) }))),
      calls: [],
      ended: spans.at(-1)?.[1] ?? 0,
    }
  })
  return [...works, ...flows].filter(p => p.spans.length)
}

// ---- What it all added up to, between two times ----

export type Tokens = { input: number; write: number; read: number; output: number; total: number; cost: number; unpriced: number }
const none = (): Tokens => ({ input: 0, write: 0, read: 0, output: 0, total: 0, cost: 0, unpriced: 0 })
export type Stats = {
  // Tokens by model, the most first, and by whose they were
  models: [string, Tokens][]
  all: Tokens
  by: { work: number; helpers: number; flows: number; chat: number }
  finished: number
  running: number
  flows: number
  todosDone: number
  // The person's messages to the chat; on average, from one to the chat's last row before the next message (its turn); and how long a piece of work took
  messages: number
  turn: number
  perPiece: number
  time: ReturnType<typeof timeOf>
  pieces: Piece[]
}
// `now` tells work still running (a row in the last GAP) from work stopped without saying so
export const statsOf = (runs: Run[], from: number, to: number, now = to): Stats => {
  const seen = new Set<string>()
  const models = new Map<string, Tokens>()
  const all = none()
  const by = { work: 0, helpers: 0, flows: 0, chat: 0 }
  // A response kept in two transcripts (a fork carries its chat's last one) counts once, where it was first met: the chat's own
  // thread is read last
  const order = { work: 0, flow: 1, helper: 2, chat: 3 }
  for (const r of [...runs].sort((a, b) => order[a.kind] - order[b.kind]))
    for (const m of r.sum.u) {
      if (seen.has(m[0]) || m[2] < from || m[2] >= to || !m[1] || m[1] === '<synthetic>') continue
      seen.add(m[0])
      const t = models.get(m[1]) ?? none()
      const total = m[5] + m[6] + m[7] + m[8] + m[9]
      const cost = costOf(m)
      for (const one of [t, all]) {
        one.input += m[5]
        one.write += m[6] + m[7]
        one.read += m[8]
        one.output += m[9]
        one.total += total
        if (cost === undefined) one.unpriced += total
        else one.cost += cost
      }
      models.set(m[1], t)
      by[r.kind === 'work' ? 'work' : r.kind === 'helper' ? 'helpers' : r.kind === 'flow' ? 'flows' : 'chat'] += total
    }
  const pieces = piecesOf(runs)
    .map(p => ({ ...p, spans: clip(p.spans, from, to), bars: p.bars.flatMap(b => clip([[b.from, b.to]], from, to).map(([a, z]) => ({ ...b, from: a, to: z }))) }))
    .filter(p => p.spans.length)
  const ended = pieces.filter(p => p.isFinished && p.ended >= from && p.ended < to)
  const todosDone = pieces.reduce((sum, p) => sum + todosOf(p.calls).filter(item => item.state === 'done' && item.at >= from && item.at < to).length, 0)
  const turns = runs.filter(r => r.kind === 'chat').flatMap(r => r.sum.turns ?? []).filter(([a]) => a >= from && a < to)
  // How long a piece of work took, whole, even where it began before the range
  const lasted = piecesOf(runs).filter(p => !p.isFlow && p.isFinished && p.ended >= from && p.ended < to).map(p => lengthOf(p.spans))
  return {
    messages: turns.length,
    turn: turns.length ? turns.reduce((sum, [a, b]) => sum + (b - a), 0) / turns.length : 0,
    perPiece: lasted.length ? lasted.reduce((sum, n) => sum + n, 0) / lasted.length : 0,
    models: [...models.entries()].sort((a, b) => b[1].total - a[1].total),
    all,
    by,
    finished: ended.filter(p => !p.isFlow).length,
    running: pieces.filter(p => !p.isFlow && !p.isFinished && p.ended > now - GAP).length,
    flows: pieces.filter(p => p.isFlow).length,
    todosDone,
    time: timeOf(pieces.map(p => p.spans)),
    pieces,
  }
}

// ---- Reading the records ----

// The jq program that sums one transcript: never the text of anything said, only times, models, tokens and to-do calls
export const SUM_JQ = `def ms: (.[0:19] + "Z" | fromdateiso8601) * 1000 + ((.[20:23] | tonumber?) // 0);
reduce (inputs | fromjson? | select(type == "object" and (.timestamp | type) == "string")) as $o
  ({r: [], u: {}, d: []};
   ($o.timestamp | ms) as $s
   | (if $o.type == "user" and ($o.isMeta | not) and (($o.message.content | type) == "string" or ([$o.message.content[]? | select(type == "object" and .type == "tool_result")] | length) == 0)
      then (if ($o.origin | type) == "object" and $o.origin.kind == "human" then "h" else "o" end)
      elif $o.type == "assistant" or ($o.type == "user" and ($o.isMeta | not)) then "a" else "r" end) as $k
   | .r += [[$s, $k]]
   | if $o.type == "assistant" and ($o.message.usage | type) == "object" then
       $o.message.usage as $u
       | ($u.cache_creation_input_tokens // 0) as $cw
       | ($u.cache_creation.ephemeral_1h_input_tokens // 0) as $c1
       | (($u.input_tokens // 0) + $cw + ($u.cache_read_input_tokens // 0)) as $p
       | .u[$o.message.id // $o.uuid // ($s | tostring)] = [($o.message.model // ""), $s, (if $u.speed == "fast" then 1 else 0 end), (if $p > 100000 then 1 else 0 end), ($u.input_tokens // 0), ([$cw - $c1, 0] | max), $c1, ($u.cache_read_input_tokens // 0), ($u.output_tokens // 0)]
       | .d += [$o.message.content[]? | select(type == "object" and .type == "tool_use" and ((.name // "") | test("__(claudopus|progress)__todo$"))) | [$s, (.input.item // ""), (.input.state // ""), (.input.was // "")]]
     else . end)
| (.r | sort_by(.[0])) as $r
| ($r | map(.[0])) as $t
| {s: (if ($t | length) == 0 then [] else reduce $t[1:][] as $x ([[$t[0], $t[0]]]; if $x - .[length - 1][1] > $gap then . + [[$x, $x]] else .[length - 1][1] = $x end) end),
   turns: (reduce $r[] as $x ({cur: null, out: []}; if $x[1] == "h" or $x[1] == "o" then (if .cur then .out += [.cur] else . end) | .cur = [$x[0], $x[0], ($x[1] == "h")] elif $x[1] == "a" and .cur then .cur[1] = $x[0] else . end)
       | (if .cur then .out + [.cur] else .out end) | map(select(.[2]) | [.[0], .[1]])),
   u: [.u | to_entries[] | [.key] + .value], d: .d}`

export type Cache = { v?: number; folder?: string; files: Record<string, { size: number; mtime: number; sum: FileSum }> }
export type Meta = { description?: string; agentType?: string; spawnDepth?: number; parentAgentId?: string; finished?: boolean }

export const parsed = <T,>(text: string, or: T): T => {
  try {
    return text ? (JSON.parse(text) as T) : or
  } catch {
    return or
  }
}
export const CACHE_V = 5

// ---- Drawing ----

const FILL = '#80808024'
// Each model in its own colour, the same in light and dark; no orange
const COLORS: [RegExp, string][] = [
  [/opus/, '#8A63F0'],
  [/sonnet/, '#2FA39A'],
  [/fable|mythos/, '#D0479A'],
  [/haiku/, '#7F8C9E'],
]
export const colorOf = (model: string) => COLORS.find(([re]) => re.test(model))?.[1] ?? '#9A9A9A'
export const nameOf = (id: string) => {
  const m = /(fable|mythos|opus|sonnet|haiku)(?:-(\d+)(?:-(\d{1,2}))?(?!\d))?/.exec(id.toLowerCase())
  return m?.[1] ? `${m[1].charAt(0).toUpperCase()}${m[1].slice(1)}${m[2] ? ` ${m[2]}${m[3] ? `.${m[3]}` : ''}` : ''}` : id
}
export const tokensText = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1)}k` : String(n)
export const hours = (ms: number) => {
  const m = Math.round(ms / 60_000)
  const [d, hrs, min] = [Math.floor(m / 1440), Math.floor(m / 60) % 24, m % 60]
  return d ? `${d}d ${hrs}h ${String(min).padStart(2, '0')}m` : hrs ? `${hrs}h ${String(min).padStart(2, '0')}m` : `${min}m`
}
// A short wait, to the second: "48s", "4m 05s"; longer ones as hours()
export const shortly = (ms: number) => {
  const sec = Math.round(ms / 1000)
  return sec < 60 ? `${sec}s` : sec < 600 ? `${Math.floor(sec / 60)}m ${String(sec % 60).padStart(2, '0')}s` : hours(ms)
}
const clockText = (at: number) => {
  const d = new Date(at)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
// Each day's words made once: toLocaleDateString builds the locale's formatter each time, and the timeline asks for a day several
// times a bar, so a long history spent most of a second on it
const days = new Map<number, string>()
const dayText = (at: number) => {
  const d = new Date(at)
  const key = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate()
  const known = days.get(key)
  if (known !== undefined) return known
  const text = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  days.set(key, text)
  return text
}

// Lanes for the timeline: each piece goes in the first lane free by its start, so the lanes count the work running at once
export const lanesOf = (pieces: Piece[]) => {
  const ends: number[] = []
  const lane = new Map<string, number>()
  for (const p of [...pieces].sort((a, b) => (a.spans[0]?.[0] ?? 0) - (b.spans[0]?.[0] ?? 0))) {
    const from = p.spans[0]?.[0] ?? 0
    const at = ends.findIndex(end => end <= from)
    const i = at < 0 ? ends.length : at
    ends[i] = p.spans.at(-1)?.[1] ?? from
    lane.set(p.id, i)
  }
  return { lane, count: ends.length }
}
// The most pieces of work busy at one moment
export const mostAtOnce = (pieces: Span[][]) => {
  const edges = pieces.flatMap(spans => union(spans).flatMap(([a, b]): [number, number][] => [[a, 1], [b, -1]])).sort((x, y) => x[0] - y[0] || x[1] - y[1])
  let [now, most] = [0, 0]
  for (const [, step] of edges) most = Math.max(most, (now += step))
  return most
}
// The time axis: stretches when work ran, with each idle gap over BREAK cut down to a narrow break so the work fills the width
const BREAK = 30 * 60_000
export const axisOf = (pieces: Piece[], width: number) => {
  const busy = union(pieces.flatMap(p => p.spans).map(([a, b]): Span => [a, b + BREAK])).map(([a, b]): Span => [a, b - BREAK])
  // The breaks together take a quarter of the width at most: with weeks of history there are dozens, and at 14 px each they took
  // nearly all of it, leaving the work a sliver
  const gap = busy.length > 1 ? Math.min(14, width * 0.03, (width * 0.25) / (busy.length - 1)) : 0
  const room = width - gap * (busy.length - 1)
  const total = busy.reduce((sum, [a, b]) => sum + (b - a), 0) || 1
  let x = 0
  const parts = busy.map(([a, b]) => {
    const part = { from: a, to: b, x, w: ((b - a) / total) * room }
    x += part.w + gap
    return part
  })
  // The first part that ends at or after t, found by halves: the parts are in order, and a long history has thousands of them
  const at = (t: number) => {
    let [lo, hi] = [0, parts.length]
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if ((parts[mid]?.to ?? 0) < t) lo = mid + 1
      else hi = mid
    }
    const p = parts[lo] ?? parts.at(-1)
    return p ? p.x + (Math.min(Math.max(t, p.from), p.to) - p.from) * (p.w / Math.max(1, p.to - p.from)) : 0
  }
  return { parts, at }
}
// The room bars take on the timeline, the same for every scope and range, so the tab never changes height
const BARS = 120
const gapOf = (parts: { x: number; w: number }[]) => (parts.length > 1 ? (parts[1]?.x ?? 0) - ((parts[0]?.x ?? 0) + (parts[0]?.w ?? 0)) : 0)
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// The most characters the app takes in one Svg's source: a longer one and it refuses the whole tab ("Svg source longer than
// 131072 characters"), so every drawing is kept under it, and one that is not is a short line in its place (svgFits)
export const SVG_MOST = 131_072
export const svgFits = (source: string) => source.length > 0 && source.length <= SVG_MOST
// A number as short as it can be read: a tenth of a pixel at most, no trailing ".0"
const px = (n: number) => String(Math.round(n * 10) / 10)
// The timeline as an SVG, as detailed as fits in one Svg. With room, each bar under the pointer lights up and its piece of work, model
// and times are written on the axis line in place of the times (CSS :hover, which the desktop draws in its sandboxed frame). With
// more bars than that holds, the pointer lights a whole piece of work and writes its name and time; with more still, the same bars
// are drawn in one shape a model, without the pointer's words. The bars are the same in all three. '' when even that is too much
export const timelineSvg = (pieces: Piece[], width = 600) => {
  const { lane, count } = lanesOf(pieces)
  const { parts, at } = axisOf(pieces, width)
  // The same height whatever the work: rows grow thinner when more ran at once
  const step = Math.min(11, BARS / Math.max(1, count))
  const row = step * 0.73
  const tall = BARS + 18
  const base = BARS + 2
  // Each cut-out gap is a short dashed tick on the axis, all in one path; with so many that they are under 3 px apart they would
  // run together into a smear, and are left out
  const ticks = gapOf(parts) >= 3 ? parts.slice(1).map(p => `M${px(p.x - gapOf(parts) / 2)} ${base - 7}v6`) : []
  const breaks = ticks.length ? [`<path d="${ticks.join('')}" stroke="#8C8C8C" stroke-dasharray="2 2"/>`] : []
  const first = parts[0]?.from ?? 0
  const last = parts.at(-1)?.to ?? 0
  const isOneDay = dayText(first) === dayText(last)
  const label = (t: number) => (isOneDay ? clockText(t) : `${dayText(t)}, ${clockText(t)}`)
  // What fits on the axis line, about 6.2 px a letter
  const most = Math.max(20, Math.floor(width / 6.2))
  const fit = (words: string) => (words.length <= most ? words : `${words.slice(0, most - 1).trimEnd()}…`)
  // An end on another day than its start says its day
  const until = (a: number, z: number) => (dayText(a) === dayText(z) ? clockText(z) : `${dayText(z)}, ${clockText(z)}`)
  const tip = (words: string) => `<text class="t" y="${base + 13}">${esc(fit(words))}</text>`
  // A bar as a path: a few characters where a rect takes sixty
  const box = (x: number, y: number, w: number, h: number) => `M${px(x)} ${px(y)}h${px(w)}v${px(h)}h-${px(w)}z`
  const spot = (p: Piece, b: Bar) => {
    const x = at(b.from)
    return { x, w: Math.max(1.5, at(b.to) - x), y: (lane.get(p.id) ?? 0) * step }
  }
  // The whole row's height takes the pointer, so a thin bar is easy to land on
  const hit = (p: Piece, bars: Bar[]) => `<path class="h" d="${bars.map(b => spot(p, b)).map(s => box(s.x, s.y, Math.max(4, s.w), step)).join('')}"/>`
  // Each way stops as soon as what it made is past the limit, so a long history costs no more than one drawing's worth
  const capped = <T,>(items: T[], one: (item: T) => string[]) => {
    const out: string[] = []
    let n = 0
    for (const item of items)
      for (const part of one(item)) {
        if ((n += part.length) > SVG_MOST) return undefined
        out.push(part)
      }
    return out
  }
  const byBar = () =>
    capped(pieces, p =>
      p.bars.map(b => {
        const s = spot(p, b)
        return `<g class="b">${hit(p, [b])}<path d="${box(s.x, s.y, s.w, row)}" fill="${colorOf(b.model)}"/>${tip(`${p.title} · ${nameOf(b.model)} · ${label(b.from)}–${until(b.from, b.to)} · ${hours(b.to - b.from)}`)}</g>`
      }),
    )
  const byPiece = () =>
    capped(pieces, p => {
      const models = [...new Set(p.bars.map(b => b.model))]
      const shapes = models.map(model => `<path d="${p.bars.filter(b => b.model === model).map(b => spot(p, b)).map(s => box(s.x, s.y, s.w, row)).join('')}" fill="${colorOf(model)}"/>`)
      const [a, z] = [p.spans[0]?.[0] ?? 0, p.spans.at(-1)?.[1] ?? 0]
      return [`<g class="b">${hit(p, p.bars)}${shapes.join('')}${tip(`${p.title} · ${[...new Set(models.map(nameOf))].join(', ')} · ${label(a)}–${until(a, z)} · ${hours(lengthOf(p.spans))}`)}</g>`]
    })
  // One shape a model, on a grid of `q` pixels: each cell of a row is the colour of the model that ran longest in it, cells of one
  // model side by side joined. A row then holds at most width / q runs, and there are at most BARS / q rows, so a coarse enough grid
  // always fits; no model is drawn over another
  const byModel = (q: number) => () => {
    const tall1 = Math.max(row, q * 0.73)
    const cols = Math.max(1, Math.ceil(width / q))
    const cells = new Map<number, Map<number, Map<string, number>>>()
    for (const p of pieces)
      for (const b of p.bars) {
        const s = spot(p, b)
        const y = Math.floor(s.y / q) * q
        const rowCells = cells.get(y) ?? new Map<number, Map<string, number>>()
        cells.set(y, rowCells)
        const [from, to] = [Math.max(0, s.x), Math.min(width, s.x + s.w)]
        for (let c = Math.floor(from / q); c < Math.min(cols, Math.ceil(to / q)); c++) {
          const share = Math.min(to, (c + 1) * q) - Math.max(from, c * q)
          const cell = rowCells.get(c) ?? new Map<string, number>()
          cell.set(b.model, (cell.get(b.model) ?? 0) + Math.max(share, 0.001))
          rowCells.set(c, cell)
        }
      }
    // Each model's runs, row by row: [row, first cell, cells]
    const runs = new Map<string, [number, number, number][]>()
    for (const [y, rowCells] of [...cells.entries()].sort((m, n) => m[0] - n[0])) {
      let open: { model: string; from: number; n: number } | undefined
      const close = () => open && runs.set(open.model, [...(runs.get(open.model) ?? []), [y, open.from, open.n]])
      for (const c of [...rowCells.keys()].sort((m, n) => m - n)) {
        const model = [...(rowCells.get(c) ?? new Map<string, number>()).entries()].sort((m, n) => n[1] - m[1])[0]?.[0] ?? ''
        if (open && open.model === model && open.from + open.n === c) open.n += 1
        else (close(), (open = { model, from: c, n: 1 }))
      }
      close()
    }
    return capped([...runs.entries()], ([model, list]) => {
      // A row starts at its first run; each next run is a step along from where the last one began (a closed shape returns there)
      let [y0, x0] = [-1, 0]
      const d = list.map(([y, from, n]) => {
        const [x, w] = [from * q, Math.min(n * q, width - from * q)]
        const part = `${y === y0 ? `m${px(x - x0)} 0` : `M${px(x)} ${px(y)}`}h${px(w)}v${px(tall1)}h-${px(w)}z`
        ;[y0, x0] = [y, x]
        return part
      })
      return [`<path d="${d.join('')}" fill="${colorOf(model)}"/>`]
    })
  }
  const axis = parts.length ? `<text x="0" y="${base + 13}">${esc(label(first))}</text><text x="${width}" y="${base + 13}" text-anchor="end">${esc(label(last))}</text>` : ''
  const style = '<style>text{font:11px -apple-system,system-ui,sans-serif;fill:#8C8C8C}.h{fill:#000;fill-opacity:0}.t{visibility:hidden;font-weight:600}.b:hover .t{visibility:visible}.b:hover path:not(.h){opacity:.6}svg:has(.b:hover) .a{visibility:hidden}</style>'
  const whole = (bars: string[]) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${tall}" viewBox="0 0 ${width} ${tall}">${style}${breaks.join('')}<g class="a">${axis}</g>${bars.join('')}</svg>`
  for (const way of [byBar, byPiece, ...[0.5, 1, 2, 4, 8, 16, 32].map(byModel)]) {
    const bars = way()
    const svg = bars ? whole(bars) : ''
    if (svgFits(svg)) return svg
  }
  return ''
}

type Ui = ElementTable
// The most rows the terminal's timeline takes; more work at once shares the last row
const TEXT_LANES = 8
// The timeline in a terminal, which draws no SVG: a row of cells per lane, each cell a block in the colour of the model that ran
// then, on the same squeezed time axis, and the first and last times under it
export const timelineRows = (pieces: Piece[], cols: number) => {
  const { lane, count } = lanesOf(pieces)
  const { parts, at } = axisOf(pieces, cols)
  const rows = Array.from({ length: Math.min(TEXT_LANES, Math.max(1, count)) }, () => Array.from({ length: cols }, () => ''))
  for (const p of pieces)
    for (const b of p.bars) {
      const row = rows[Math.min(rows.length - 1, lane.get(p.id) ?? 0)]
      const [from, to] = [Math.floor(at(b.from)), Math.max(Math.floor(at(b.from)) + 1, Math.ceil(at(b.to)))]
      for (let x = Math.max(0, from); x < Math.min(cols, to); x++) if (row) row[x] = b.model
    }
  const first = parts[0]?.from ?? 0
  const last = parts.at(-1)?.to ?? 0
  const label = (t: number) => (dayText(first) === dayText(last) ? clockText(t) : `${dayText(t)}, ${clockText(t)}`)
  return { rows, from: parts.length ? label(first) : '', to: parts.length ? label(last) : '' }
}
const timelineText = (ui: Ui, pieces: Piece[], cols: number) => {
  const { Box, Text } = ui
  const { rows, from, to } = timelineRows(pieces, cols)
  // Each row as runs of one model, so a row is a few Texts, not one per cell
  const runs = (row: string[]) => row.reduce<{ model: string; n: number }[]>((all, model) => {
    const tail = all.at(-1)
    if (tail && tail.model === model) tail.n += 1
    else all.push({ model, n: 1 })
    return all
  }, [])
  return (
    <Box key="timeline-cells" flexDirection="column" flexShrink={0}>
      {rows.map((row, i) => (
        <Box key={`lane-${i}`} flexDirection="row" height={1} flexShrink={0}>
          {runs(row).map((run, j) => (run.model ? <Text key={`run-${j}`} color={colorOf(run.model)}>{'█'.repeat(run.n)}</Text> : <Text key={`run-${j}`}>{' '.repeat(run.n)}</Text>))}
        </Box>
      ))}
      <Box key="axis" flexDirection="row" justifyContent="space-between" width={cols} height={1} flexShrink={0}>
        <Text dimColor>{from}</Text>
        <Text dimColor>{to}</Text>
      </Box>
    </Box>
  )
}
export type Scope = 'chat' | 'all'
// What Stats and the leaderboard count over: today, the last 7 days, the last 30, all time
export type Range = 'today' | 'd7' | 'd30' | 'all'
export const RANGES: Range[] = ['today', 'd7', 'd30', 'all']
const DAY = 86_400_000
export const view = { scope: 'chat' as Scope, range: 'today' as Range, presses: 0 }
// What was read for each scope, and when; a scope being read is drawn from what it held last
export const held = new Map<Scope, { runs: Run[]; at: number; error?: string }>()
export const reading = new Set<Scope>()
export const READ_EVERY = 60_000

// What the mod keeps in its memory folder, as it stands: each part's count and its size on disk
export type MemoryPart = { name: string; count: number; bytes: number; extra?: string }
export const memoryHeld: { now?: { parts: MemoryPart[]; bytes: number } } = {}
export const sizeText = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`)
// Local midnight of the day `now` falls in
export const dayStart = (now: number) => {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}
// Where a range begins: today from local midnight, the others that many days back from now
export const rangeFrom = (range: Range, now: number) => (range === 'today' ? dayStart(now) : range === 'd7' ? now - 7 * DAY : range === 'd30' ? now - 30 * DAY : 0)
// Hours of work done for each hour of real time: 3 weeks of task time in 1 week on the clock is 3×
export const efficiencyOf = (added: number, clock: number) => (clock > 0 ? added / clock : 0)
export const timesText = (n: number) => (n > 0 ? `${n.toFixed(2)}×` : '–')
// What share of all tokens one kind was, in whole percent
export const shareOf = (part: number, total: number) => Math.round((part / Math.max(1, total)) * 100)

// ---- The leaderboard ----

// One range's figures as the leaderboard on claudopus.ai keeps them: never a title, a path or a word anyone wrote, only sums
export type BoardRange = {
  work: number; clock: number; tokens: number; input: number; write: number; read: number; output: number; cost: number
  tasks: number; messages: number; todos: number; flows: number; most: number; per_task: number; models: [string, number, number][]
}
export const boardOf = (runs: Run[], now: number): Record<Range, BoardRange> => {
  const one = (range: Range): BoardRange => {
    const s = statsOf(runs, rangeFrom(range, now), Infinity, now)
    const round = (n: number) => Math.round(n)
    return {
      work: round(s.time.added), clock: round(s.time.clock), tokens: s.all.total, input: s.all.input, write: s.all.write, read: s.all.read, output: s.all.output,
      cost: Math.round(s.all.cost * 100) / 100, tasks: s.finished, messages: s.messages, todos: s.todosDone, flows: s.flows,
      most: mostAtOnce(s.pieces.map(p => p.spans)), per_task: round(s.perPiece),
      models: s.models.slice(0, 12).map(([model, t]): [string, number, number] => [model, t.total, Math.round(t.cost * 100) / 100]),
    }
  }
  return { today: one('today'), d7: one('d7'), d30: one('d30'), all: one('all') }
}
// The timeline as the leaderboard draws it on a public page: each task's busy stretches, each with its model, and never its title.
// Times are whole minutes from `base`; the newest tasks are kept while the whole stays under `most` characters
export type BoardTimeline = { base: number; models: string[]; pieces: [from: number, minutes: number, model: number][][] }
export const timelineOf = (runs: Run[], most = 40_000): BoardTimeline => {
  const pieces = piecesOf(runs).sort((a, b) => (a.spans[0]?.[0] ?? 0) - (b.spans[0]?.[0] ?? 0))
  const base = Math.floor((pieces[0]?.spans[0]?.[0] ?? 0) / 60_000) * 60_000
  const models: string[] = []
  const indexOf = (model: string) => (models.includes(model) ? models.indexOf(model) : models.push(model) - 1)
  const all = pieces.map(p => p.bars.map((b): [number, number, number] => [Math.round((b.from - base) / 60_000), Math.max(1, Math.round((b.to - b.from) / 60_000)), indexOf(b.model)]))
  const kept: [number, number, number][][] = []
  let size = 0
  for (const one of [...all].reverse()) {
    if ((size += JSON.stringify(one).length + 1) > most) break
    kept.unshift(one)
  }
  return { base, models, pieces: kept }
}
// What the Leaderboard part of Stats shows and does; the sending and the file are the hooks' (stats-tab)
export type BoardShown = {
  name: string
  isPublic: boolean
  // What the last press or send came to, said in one line; '' when nothing needs saying
  said: string
  isBusy: boolean
  join: (name: string) => void
  leave: () => void
  setPublic: (isPublic: boolean) => void
  open: () => void
}
export const NAME_RULE = /^[A-Za-z0-9_-]{3,20}$/

const band = (ui: Ui, key: string, name: string, side: string, body: JSX.Element) => (
  <ui.Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Box flexDirection="row" alignItems="flex-start" gap={2} height={1}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text bold wrap="truncate-end">{name}</ui.Text>
      </ui.Box>
      {side ? (
        <ui.Box flexShrink={0}>
          <ui.Text dimColor>{side}</ui.Text>
        </ui.Box>
      ) : null}
    </ui.Box>
    {body}
  </ui.Box>
)
// One line: a name at the left, a number at the right
const line = (ui: Ui, key: string, name: string, value: string, isBold = false) => (
  <ui.Box key={key} flexDirection="row" gap={2} height={1} overflow="hidden" flexShrink={0}>
    <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
      <ui.Text wrap="truncate-end">{name}</ui.Text>
    </ui.Box>
    <ui.Box flexShrink={0}>
      <ui.Text bold={isBold}>{value}</ui.Text>
    </ui.Box>
  </ui.Box>
)
const note = (ui: Ui, key: string, text: string) => (
  <ui.Text key={key} dimColor wrap="wrap">
    {text}
  </ui.Text>
)

// A switch of two or more: the chosen one filled, the others plain and dim; each the same width, so nothing moves on a press
const SEGMENT = '#80808050'
const segments = (ui: Ui, key: string, items: { label: string; isOn: boolean; onPress: () => void }[], width: number) =>
  // The terminal has no fill to mark the chosen one: there it is a filled dot before it, an empty one before each other
  'isTerminal' in ui ? (
    <ui.Box key={key} flexDirection="row" flexShrink={0} gap={2} height={1}>
      {items.map(item =>
        item.isOn ? (
          <ui.Text key={`${key}-${item.label}`} bold>{`● ${item.label}`}</ui.Text>
        ) : (
          <ui.Button key={`${key}-${item.label}-${view.presses}`} label={`○ ${item.label}`} plain dimColor onPress={item.onPress} />
        ),
      )}
    </ui.Box>
  ) : (
  <ui.Box key={key} flexDirection="row" flexShrink={0} backgroundColor={FILL} height={1}>
    {items.map(item => (
      <ui.Box key={`${key}-${item.label}`} width={width} height={1} justifyContent="center" alignItems="center" flexShrink={0} backgroundColor={item.isOn ? SEGMENT : undefined}>
        {item.isOn ? <ui.Text bold>{item.label}</ui.Text> : <ui.Button key={`${key}-${item.label}-${view.presses}`} label={item.label} plain dimColor onPress={item.onPress} />}
      </ui.Box>
    ))}
  </ui.Box>
  )
// One of the headline figures: the number large in weight, what it is under it
const tile = (ui: Ui, key: string, value: string, label: string, wraps = false) => (
  <ui.Box key={key} flexDirection="column" flexGrow={1} flexShrink={1} width="30%" minWidth={0} backgroundColor={FILL} paddingX={2} paddingY={1}>
    <ui.Box height={1} overflow="hidden">
      <ui.Text bold wrap="truncate-end">{value}</ui.Text>
    </ui.Box>
    {/* In the terminal the label wraps rather than being cut: in a narrow one 'tasks done' read 'pieces of work d…' */}
    <ui.Box minWidth={0} {...(wraps ? {} : { height: 1, overflow: 'hidden' as const })}>
      <ui.Text dimColor wrap={wraps ? 'wrap' : 'truncate-end'}>{label}</ui.Text>
    </ui.Box>
  </ui.Box>
)

// Join, leave, public or private: the same in every view
const boardBand = (ui: Ui, b: BoardShown) => {
  const { Box, Text } = ui
  const said = b.said ? <Text key="board-said" color={b.said.startsWith('✓') ? undefined : '#D08A00'} dimColor={b.said.startsWith('✓')} wrap="wrap">{b.said}</Text> : null
  const open = <ui.Button key={`board-open-${view.presses}`} label="Open the leaderboard" plain onPress={b.open} />
  if (!b.name)
    return band(
      ui,
      'stats-board',
      'Leaderboard',
      '',
      <Box flexDirection="column" gap={1}>
        {note(ui, 'board-how', 'Put your hours of work, tokens and API cost on the leaderboard at claudopus.ai. Nothing about you is sent until you join, and Leave takes you off at once.')}
        {'Input' in ui ? (
          <Box key="board-field" width="100%" flexDirection="column">
            <ui.Input key={`board-name-${view.presses}`} placeholder="Choose a username: 3 to 20 letters, digits, - or _" submitLabel="Join" onSubmit={value => b.join(value.trim())} />
          </Box>
        ) : null}
        {said}
        <Box flexDirection="row" gap={2} flexShrink={0}>{open}</Box>
      </Box>,
    )
  return band(
    ui,
    'stats-board',
    'Leaderboard',
    b.isBusy ? 'Sending…' : '',
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" flexShrink={0}>
        {line(ui, 'board-name', 'Your username', b.name, true)}
        {line(ui, 'board-public', 'Your stats', b.isPublic ? 'Public' : 'Private')}
      </Box>
      {note(ui, 'board-what', b.isPublic ? 'Everyone can open your stats from the leaderboard. Claudopus sends your figures every few minutes while Claude Code is open.' : 'The leaderboard shows your hours of work, tokens and API cost, and keeps the rest private. Claudopus sends your figures every few minutes while Claude Code is open.')}
      {said}
      <Box flexDirection="row" flexWrap="wrap" gap={2} flexShrink={0}>
        {open}
        <ui.Button key={`board-public-${view.presses}`} label={b.isPublic ? 'Make my stats private' : 'Make my stats public'} plain onPress={() => b.setPublic(!b.isPublic)} />
        <ui.Button key={`board-leave-${view.presses}`} label="Leave" plain dimColor onPress={b.leave} />
      </Box>
    </Box>,
  )
}

export function statsView(invalidate: () => void, ui: Ui, now: number, reload: (scope: Scope) => void, surface: string, px: number, board?: BoardShown) {
  const { Box, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number; isInteractive?: boolean }) => JSX.Element }
  const kept = held.get(view.scope)
  const from = rangeFrom(view.range, now)
  const s = kept ? statsOf(kept.runs, from, Infinity, now) : undefined
  const press = (fn: () => void) => () => void ((view.presses += 1), fn(), invalidate())
  const chats = new Set(kept?.runs.filter(r => r.kind === 'chat').map(r => r.id)).size
  // What is counted, chosen at the top: which chats, and over what time
  const nav = (
    <Box key="stats-nav" flexDirection="row" alignItems="center" gap={2} height={1} flexShrink={0}>
      {segments(
        ui,
        'scope',
        [
          { label: 'This chat', isOn: view.scope === 'chat', onPress: press(() => ((view.scope = 'chat'), reload('chat'))) },
          { label: 'All chats', isOn: view.scope === 'all', onPress: press(() => ((view.scope = 'all'), reload('all'))) },
        ],
        11,
      )}
      {segments(
        ui,
        'range',
        ([['today', 'Today'], ['d7', '7 days'], ['d30', '30 days'], ['all', 'All time']] as const).map(([range, label]) => ({ label, isOn: view.range === range, onPress: press(() => (view.range = range)) })),
        10,
      )}
      <Box flexGrow={1} />
      {reading.has(view.scope) ? <Text dimColor>Reading…</Text> : null}
    </Box>
  )
  const boardShown = board ? [boardBand(ui, board)] : []
  if (!s) return [nav, note(ui, 'stats-wait', kept?.error ?? 'Reading Claude’s logs of your tasks…'), ...boardShown]
  if (!s.all.total && !s.pieces.length) return [nav, ...(kept?.error ? [note(ui, 'stats-error', kept.error)] : []), note(ui, 'stats-none', view.range === 'today' ? 'No tasks today yet.' : view.range === 'all' ? 'No tasks yet.' : `No tasks in the last ${view.range === 'd7' ? 7 : 30} days.`), ...boardShown]
  const top = s.models[0]?.[1].total || 1
  const count = (n: number) => n.toLocaleString('en-US')
  // Whole dollars from a hundred up, cents below
  // Saved from the minutes shown, so the three lines add up as read
  const minute = (ms: number) => Math.round(ms / 60_000) * 60_000
  const saved = minute(s.time.added) - minute(s.time.clock)
  const money = (n: number) => (n >= 100 ? `$${Math.round(n).toLocaleString('en-US')}` : `$${n.toFixed(2)}`)
  const hero = (
    <Box key="stats-hero" flexDirection="row" gap={1} flexShrink={0}>
      {tile(ui, 'hero-saved', hours(saved), 'time saved', surface === 'terminal')}
      {tile(ui, 'hero-cost', money(s.all.cost), 'API cost', surface === 'terminal')}
      {tile(ui, 'hero-work', count(s.finished), 'tasks done', surface === 'terminal')}
    </Box>
  )
  const width = Math.max(200, Math.round(px))
  const svg = timelineSvg(s.pieces, width)
  const drawn = new Set(s.pieces.flatMap(p => p.bars.map(b => b.model)))
  const legend = s.models.map(([model]) => model).filter(model => drawn.has(model))
  const timeline = band(
    ui,
    'stats-timeline',
    'Timeline',
    `Up to ${mostAtOnce(s.pieces.map(p => p.spans))} tasks at once`,
    <Box flexDirection="column" gap={1}>
      {table.Svg && surface !== 'terminal' ? (
        svgFits(svg) ? (
          <Box flexShrink={0}>
            <table.Svg key={`timeline-${view.scope}-${view.range}`} source={svg} alt={`${s.pieces.length} tasks on a timeline`} width={width} height={BARS + 18} isInteractive />
          </Box>
        ) : (
          note(ui, 'timeline-too-big', `${s.pieces.length.toLocaleString('en-US')} tasks are too many to draw here. Choose Today or This chat to see fewer.`)
        )
      ) : (
        timelineText(ui, s.pieces, Math.max(20, Math.floor((px + 32) / 7.4) - 6))
      )}
      {/* The terminal does not wrap a row of boxes: there the legend is one text that wraps, so no model is cut off */}
      {surface === 'terminal' ? (
        <Text key="legend-text" wrap="wrap">
          {legend.flatMap((model, i) => [<Text key={`legend-mark-${model}`} color={colorOf(model)}>{`${i ? '   ' : ''}■ `}</Text>, <Text key={`legend-name-${model}`} dimColor>{nameOf(model)}</Text>])}
        </Text>
      ) : (
      <Box flexDirection="row" gap={2} height={1} overflow="hidden" flexShrink={0}>
        {legend.map(model => (
          <Box key={`legend-${model}`} flexDirection="row" gap={1} flexShrink={0}>
            <Text color={colorOf(model)}>■</Text>
            <Text dimColor>{nameOf(model)}</Text>
          </Box>
        ))}
      </Box>
      )}
    </Box>,
  )
  const time = band(
    ui,
    'stats-time',
    'Time',
    '',
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" flexShrink={0}>
        {line(ui, 'time-added', 'Hours of work done', hours(s.time.added))}
        {line(ui, 'time-clock', 'Hours on the clock', hours(s.time.clock))}
        {line(ui, 'time-saved', 'Saved by running at once', hours(saved), true)}
        {line(ui, 'time-efficiency', 'Efficiency', timesText(efficiencyOf(s.time.added, s.time.clock)), true)}
        {s.models[0] ? line(ui, 'time-model', 'Favourite model', nameOf(s.models[0][0])) : null}
      </Box>
      {note(ui, 'time-how', 'Efficiency is the hours of work done for each hour on the clock: 3 weeks of work in 1 week is 3×. Only tasks running at the same time save time. Claudopus leaves out quiet gaps over 15 minutes.')}
    </Box>,
  )
  const work = band(
    ui,
    'stats-work',
    'Tasks',
    s.running ? `${s.running} still running · not counted` : '',
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" flexShrink={0}>
        {line(ui, 'work-finished', 'Tasks done', count(s.finished))}
        {line(ui, 'work-flows', 'Workflows run', count(s.flows))}
        {line(ui, 'work-todos', 'To-dos done', count(s.todosDone))}
        {line(ui, 'talk-count', 'Your messages', count(s.messages))}
        {line(ui, 'talk-turn', 'Chat time per message, on average', s.messages ? shortly(s.turn) : '–')}
        {line(ui, 'talk-piece', 'Time per task, on average', s.perPiece ? shortly(s.perPiece) : '–')}
      </Box>
      {note(ui, 'talk-how', 'A message’s time runs from when the chat takes it to the chat’s last step. The tasks it started aren’t counted.')}
    </Box>,
  )
  const tokens = band(
    ui,
    'stats-tokens',
    'Tokens used',
    tokensText(s.all.total),
    <Box flexDirection="column" gap={1}>
      {s.models.map(([model, t]) => (
        <Box key={`model-${model}`} flexDirection="column" flexShrink={0}>
          {line(ui, `model-${model}-head`, nameOf(model), tokensText(t.total))}
          <Box height={1} flexDirection="row" flexShrink={0}>
            <Box width={`${Math.max(1, Math.round((t.total / top) * 100))}%`} height={1} backgroundColor={colorOf(model)} />
          </Box>
        </Box>
      ))}
      <Box flexDirection="column" flexShrink={0}>
        {line(ui, 'tokens-share-read', 'Cache reads', `${shareOf(s.all.read, s.all.total)}% · ${tokensText(s.all.read)}`)}
        {line(ui, 'tokens-share-write', 'Cache writes', `${shareOf(s.all.write, s.all.total)}% · ${tokensText(s.all.write)}`)}
        {line(ui, 'tokens-share-input', 'Input not cached', `${shareOf(s.all.input, s.all.total)}% · ${tokensText(s.all.input)}`)}
        {line(ui, 'tokens-share-output', 'Written by the models', `${shareOf(s.all.output, s.all.total)}% · ${tokensText(s.all.output)}`)}
      </Box>
      {note(ui, 'tokens-read', 'Tokens are the bits of text a model reads and writes. A cache read is text read again at a tenth of the price, a cache write is text kept for that.')}
    </Box>,
  )
  const cost = band(
    ui,
    'stats-money',
    'API cost',
    money(s.all.cost),
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" flexShrink={0}>
        {s.models.map(([model, t]) => line(ui, `cost-${model}`, nameOf(model), t.unpriced ? 'No price' : money(t.cost)))}
      </Box>
      {note(ui, 'money-how', `What Anthropic would charge per use for these tasks, at its prices on ${PRICED}.`)}
    </Box>,
  )
  // The memory, as it stands now: the same in every view
  const mem = memoryHeld.now
    ? band(
        ui,
        'stats-memory',
        'Memory',
        sizeText(memoryHeld.now.bytes),
        <Box flexDirection="column" gap={1}>
          <Box flexDirection="column" flexShrink={0}>
            {memoryHeld.now.parts.map(part => line(ui, `memory-${part.name}`, part.name, `${count(part.count)} · ${sizeText(part.bytes)}`))}
          </Box>
          {note(ui, 'memory-how', 'All of Memory, whatever you choose above. It’s plain files in ~/.claude/claudopus.')}
        </Box>,
      )
    : null
  const off = note(
    ui,
    'stats-off',
    view.scope === 'all'
      ? `Claudopus counts this from Claude’s own logs of ${chats} chats, their tasks, helpers and workflows.`
      : 'Claudopus counts this from Claude’s own logs of this chat, its tasks, helpers and workflows.',
  )
  return [nav, ...(kept?.error ? [note(ui, 'stats-error', kept.error)] : []), hero, timeline, time, work, tokens, cost, ...boardShown, ...(mem ? [mem] : []), off]
}
