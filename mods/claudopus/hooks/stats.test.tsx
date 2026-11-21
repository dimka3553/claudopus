import { expect, test } from 'claude-code/testing'

import { boardDelta, boardFrom, boardRange, clip, colorOf, costOf, dayCells, efficiencyOf, GAP, lengthOf, mainModel, monthFrom, monthNo, monthsKept, mostAtOnce, partOf, piecesIn, piecesKept, priceOf, RANGES, rowPiece, statsFrom, sumKept, SVG_MOST, svgFits, timelineOf, timelineSvg, timeOf, todosOf, union } from './stats'
import type { BoardSent, BoardTimeline, DayRows, Kept, Loaded, Msg, Part, Piece, Range, Run, Span, Stats, TodoCall, TokenSums } from './stats'

const M = 60_000
const msg = (id: string, model: string, at: number, tokens: Partial<{ input: number; w5: number; w1: number; read: number; output: number; fast: boolean; long: boolean }>): Msg => [
  id,
  model,
  at,
  tokens.fast ? 1 : 0,
  tokens.long ? 1 : 0,
  tokens.input ?? 0,
  tokens.w5 ?? 0,
  tokens.w1 ?? 0,
  tokens.read ?? 0,
  tokens.output ?? 0,
]
const near = (n: number | undefined) => (n === undefined ? n : Math.round(n * 1e6) / 1e6)
const run = (one: Partial<Run> & Pick<Run, 'id' | 'kind'>): Run => ({ parent: '', title: one.id, isFinished: true, sum: { s: [], u: [], d: [] }, ...one })

// What Stats keeps of some chats' transcripts, laid out as the mod lays it in its files (each chat's transcripts, each day's
// responses, each month's pieces of work), and the figures from a moment on made from it the way the mod makes them: every whole
// day's and month's sums, and of the rest only what the mod reads (`isWhole`: every month from the range's first on, as the tab
// does for its timeline; else the month the range begins in and this one, as the leaderboard does)
const keyOf = (r: Run) => (r.kind === 'chat' ? 'chat' : r.kind === 'flow' ? `${r.parent}/agent-${r.id}` : `agent-${r.id}`)
const keep = (chats: Record<string, Run[]>, first = Object.keys(chats)[0] ?? '') => {
  const days = new Map<number, DayRows>()
  const months = new Map<number, { pieces: Piece[]; turns: [number, number][] }>()
  const own = new Map<string, Map<number, { pieces: Piece[]; turns: [number, number][] }>>()
  for (const [chat, runs] of Object.entries(chats)) {
    const files: Record<string, Kept> = {}
    for (const r of runs) {
      const { kept, rows } = sumKept(r.sum, { kind: r.kind, parent: r.parent, title: r.title, fin: r.isFinished, ...(r.kind === 'flow' ? { flow: r.parent } : {}) }, 1, 1)
      files[keyOf(r)] = kept
      for (const [day, entry] of rows) days.set(day, { ...days.get(day), [`${chat} ${keyOf(r)}`]: entry })
    }
    // Through a file and back, as the mod's are
    const { pieces, turns } = piecesKept(chat, JSON.parse(JSON.stringify(files)) as Record<string, Kept>)
    own.set(chat, new Map())
    for (const [month, one] of monthsKept(pieces, turns)) {
      const read = { pieces: (JSON.parse(JSON.stringify(one.p)) as typeof one.p).map(row => rowPiece(chat, row)), turns: one.t }
      own.get(chat)?.set(month, read)
      const all = months.get(month) ?? { pieces: [], turns: [] }
      months.set(month, { pieces: [...all.pieces, ...read.pieces], turns: [...all.turns, ...read.turns] })
    }
  }
  const loaded = (from: number, now: number, chat: string, isWhole: boolean): Loaded => {
    const cells: Record<string, TokenSums> = {}
    for (const [day, rows] of days) {
      const sums = dayCells(rows, day, -Infinity, chat)
      if (Object.keys(sums).length) cells[day] = sums
    }
    const edge = (day: number, at: number) => dayCells(days.get(day) ?? {}, day, at, chat)
    if (chat) return { cells, edge, parts: {}, months: own.get(chat) ?? new Map(), first: chat }
    const parts: Record<string, Part> = {}
    for (const [month, one] of months) parts[month] = partOf(piecesIn(one.pieces), one.turns, monthFrom(month), monthFrom(month + 1))
    const begins = monthNo(Math.max(0, from))
    return { cells, edge, parts, months: new Map([...months].filter(([month]) => (isWhole ? month >= begins : month === begins || month >= monthNo(now - GAP)))), first }
  }
  const stats = (from: number, now = 8_640_000_000_000_000, chat = '', isWhole = true) => statsFrom(loaded(from, now, chat, isWhole), from, now)
  const board = (now: number, since = 0) => Object.fromEntries(RANGES.map(range => [range, boardRange(stats(boardFrom(range, now, since), now, '', false))])) as Record<Range, ReturnType<typeof boardRange>>
  const line = (most = 40_000, since = 0, now?: number) => {
    const s = stats(since, now)
    return timelineOf(s.pieces, s.time.first, s.starts, most)
  }
  return { stats, board, line }
}

// The plain way, as Stats added up before anything above a transcript's sums was kept: every response of every transcript and
// every piece of work, gone through again for each range. What is kept must come to the very same figures
type Plain = { id: string; isFlow: boolean; isFinished: boolean; spans: Span[]; bars: { from: number; to: number; model: string }[]; calls: TodoCall[]; ended: number }
const plainPieces = (runs: Run[]): Plain[] => {
  const kids = (id: string): Run[] => runs.filter(r => r.kind === 'helper' && r.parent === id).flatMap(r => [r, ...kids(r.id)])
  const works = runs.filter(r => r.kind === 'work').map(r => {
    const spans = union([...r.sum.s, ...kids(r.id).flatMap(k => k.sum.s)])
    const model = mainModel(r.sum.u)
    return { id: r.id, isFlow: false, isFinished: r.isFinished, spans, bars: spans.map(([from, to]) => ({ from, to, model })), calls: r.sum.d, ended: spans.at(-1)?.[1] ?? 0 }
  })
  const flows = [...new Set(runs.filter(r => r.kind === 'flow').map(r => r.parent))].map(id => {
    const agents = runs.filter(r => r.kind === 'flow' && r.parent === id)
    const spans = union(agents.flatMap(a => a.sum.s))
    return { id, isFlow: true, isFinished: agents.every(a => a.isFinished), spans, bars: agents.flatMap(a => union(a.sum.s).map(([from, to]) => ({ from, to, model: mainModel(a.sum.u) }))), calls: [], ended: spans.at(-1)?.[1] ?? 0 }
  })
  return [...works, ...flows].filter(p => p.spans.length)
}
const plain = (runs: Run[], from: number, now: number) => {
  const seen = new Set<string>()
  const models = new Map<string, { input: number; write: number; read: number; output: number; total: number; cost: number; unpriced: number }>()
  const none = () => ({ input: 0, write: 0, read: 0, output: 0, total: 0, cost: 0, unpriced: 0 })
  const all = none()
  const by = { work: 0, helpers: 0, flows: 0, chat: 0 }
  const order = { work: 0, flow: 1, helper: 2, chat: 3 }
  for (const r of [...runs].sort((a, b) => order[a.kind] - order[b.kind]))
    for (const m of r.sum.u) {
      if (seen.has(m[0]) || m[2] < from || !m[1] || m[1] === '<synthetic>') continue
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
        // In whole billionths of a dollar, as what is kept holds money: fractions of a dollar added in the order they are met
        // come out a millionth of a cent apart
        else one.cost += Math.round(cost * 1e9)
      }
      models.set(m[1], t)
      by[r.kind === 'work' ? 'work' : r.kind === 'helper' ? 'helpers' : r.kind === 'flow' ? 'flows' : 'chat'] += total
    }
  for (const one of [all, ...models.values()]) one.cost /= 1e9
  const pieces = plainPieces(runs)
    .map(p => ({ ...p, spans: clip(p.spans, from, Infinity), bars: p.bars.flatMap(b => clip([[b.from, b.to]], from, Infinity).map(([a, z]) => ({ ...b, from: a, to: z }))) }))
    .filter(p => p.spans.length)
  const turns = runs.filter(r => r.kind === 'chat').flatMap(r => r.sum.turns ?? []).filter(([a]) => a >= from)
  const lasted = plainPieces(runs).filter(p => !p.isFlow && p.isFinished && p.ended >= from).map(p => lengthOf(p.spans))
  return {
    models: [...models.entries()].sort((a, b) => b[1].total - a[1].total),
    all,
    by,
    finished: pieces.filter(p => p.isFinished && p.ended >= from && !p.isFlow).length,
    running: pieces.filter(p => !p.isFlow && !p.isFinished && p.ended > now - GAP).length,
    flows: pieces.filter(p => p.isFlow).length,
    todosDone: pieces.reduce((sum, p) => sum + todosOf(p.calls).filter(item => item.state === 'done' && item.at >= from).length, 0),
    messages: turns.length,
    turn: turns.length ? turns.reduce((sum, [a, b]) => sum + (b - a), 0) / turns.length : 0,
    perPiece: lasted.length ? lasted.reduce((sum, n) => sum + n, 0) / lasted.length : 0,
    time: timeOf(pieces.map(p => p.spans)),
    most: mostAtOnce(pieces.map(p => p.spans)),
    pieces,
  }
}
// The same figures, in one shape: the pieces by name, a timeline's bars with each model by its name
const shape = (s: Pick<Stats, 'models' | 'all' | 'by' | 'finished' | 'running' | 'flows' | 'todosDone' | 'messages' | 'turn' | 'perPiece' | 'most'> & { time: Stats['time']; pieces: Pick<Piece, 'id' | 'isFlow' | 'isFinished' | 'spans' | 'bars'>[] }, isWhole = true) => ({
  models: s.models,
  all: s.all,
  by: s.by,
  counts: [s.finished, s.running, s.flows, s.todosDone, s.messages, s.turn, s.perPiece, s.most],
  time: [s.time.added, s.time.clock, s.time.saved, s.time.first, s.time.last],
  pieces: isWhole ? s.pieces.map(p => ({ id: p.id, isFlow: p.isFlow, isFinished: p.isFinished, spans: p.spans, bars: p.bars })).sort((a, b) => (a.id < b.id ? -1 : 1)) : [],
})
const named = (line: BoardTimeline) => ({ base: line.base, pieces: line.pieces.map(one => one.map(([from, minutes, model]) => [from, minutes, line.models[model]])) })
const plainLine = (runs: Run[], most: number, since: number): BoardTimeline => {
  const pieces = plainPieces(runs)
    .map(p => ({ ...p, spans: clip(p.spans, since, Infinity), bars: p.bars.flatMap(b => clip([[b.from, b.to]], since, Infinity).map(([from, to]) => ({ ...b, from, to }))) }))
    .filter(p => p.bars.length)
    .sort((a, b) => (a.spans[0]?.[0] ?? 0) - (b.spans[0]?.[0] ?? 0))
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


test('time saved is only the overlap: work added up less the time any of it ran', async () => {
  expect(union([[5, 9], [0, 3], [2, 4], [9, 10]])).toEqual([[0, 4], [5, 10]])
  expect(lengthOf([[0, 10], [5, 15]])).toBe(15)
  // Alone, one after another: nothing saved
  expect(timeOf([[[0, 10 * M]], [[20 * M, 30 * M]]])).toEqual({ added: 20 * M, clock: 20 * M, saved: 0, first: 0, last: 30 * M })
  // Three at once for ten minutes, one of them running ten more: 40 minutes of work in 20 on the clock
  const three = timeOf([[[0, 20 * M]], [[0, 10 * M]], [[0, 10 * M]]])
  expect([three.added, three.clock, three.saved]).toEqual([40 * M, 20 * M, 20 * M])
  // A piece's own stretches that overlap (its helpers) are its time once
  expect(timeOf([[[0, 10 * M], [5 * M, 10 * M]]]).added).toBe(10 * M)
  expect(mostAtOnce([[[0, 20 * M]], [[0, 10 * M]], [[10 * M, 30 * M]]])).toBe(2)
})

test('each kind of token costs its own price, fast doubles it, and a model without a price is said so', async () => {
  // Opus 5.5: $4 in, $5 5-minute write, $8 1-hour write, $0.20 read, $20 out per million
  expect(near(costOf(msg('a', 'claude-opus-5-5', 0, { input: 1e6, w5: 1e6, w1: 1e6, read: 1e6, output: 1e6 })))).toBe(near(4 + 5 + 8 + 0.2 + 20))
  expect(near(costOf(msg('a', 'claude-opus-5-5', 0, { output: 1e6, fast: true })))).toBe(near(40))
  // Sonnet 5.5 reads at $0.10, Fable 5.2 writes an hour's cache at $16
  expect(near(costOf(msg('a', 'claude-sonnet-5-5', 0, { read: 1e6 })))).toBe(near(0.1))
  expect(near(costOf(msg('a', 'claude-fable-5-2', 0, { w1: 1e6 })))).toBe(near(16))
  // Haiku 5.5 costs five times more once a prompt passes 100,000 tokens
  expect(near(costOf(msg('a', 'claude-haiku-5-5', 0, { input: 1e6 })))).toBe(near(0.1))
  expect(near(costOf(msg('a', 'claude-haiku-5-5', 0, { input: 1e6, long: true })))).toBe(near(0.5))
  // An id with a suffix is its model; Opus 5 is not Opus 5.5
  expect(priceOf('claude-opus-5-5[1m]')?.[0]).toBe(4)
  expect(priceOf('claude-opus-5')?.[0]).toBe(5)
  expect(costOf(msg('a', 'claude-unknown-9', 0, { input: 1e6 }))).toBeUndefined()
})

test('a to-do counts done by its last state, renamed or not, and only once', async () => {
  const items = todosOf([
    [1, 'Draw it', 'doing', ''],
    [2, 'Draw it', 'done', ''],
    [3, 'Check it', 'open', ''],
    [4, 'Check the numbers', 'done', 'Check it'],
    [5, 'Ship it', 'done', ''],
    [6, 'Ship it', 'dropped', ''],
  ])
  expect(items.filter(one => one.state === 'done').length).toBe(2)
})

test('stats add up tokens by model once each, work and its helpers as one piece, and today apart from all time', async () => {
  const day = 1_800_000_000_000
  const runs: Run[] = [
    run({ id: 'w1', kind: 'work', sum: { s: [[day, day + 10 * M]], u: [msg('m1', 'claude-opus-5-5', day + M, { input: 10, read: 1000, output: 100 })], d: [[day + 2 * M, 'Draw it', 'done', '']] } }),
    // Its helper ran on past its own last row: the piece's time runs to the helper's end
    run({ id: 'h1', kind: 'helper', parent: 'w1', sum: { s: [[day + 5 * M, day + 15 * M]], u: [msg('m2', 'claude-sonnet-5-5', day + 6 * M, { output: 50 })], d: [] } }),
    run({ id: 'w2', kind: 'work', sum: { s: [[day, day + 10 * M]], u: [msg('m3', 'claude-sonnet-5-5', day + 2 * M, { output: 20 })], d: [] } }),
    // A workflow's agents are one piece
    run({ id: 'a1', kind: 'flow', parent: 'wf_1', sum: { s: [[day + 20 * M, day + 25 * M]], u: [msg('m4', 'claude-opus-5-5', day + 21 * M, { output: 5 })], d: [] } }),
    run({ id: 'a2', kind: 'flow', parent: 'wf_1', sum: { s: [[day + 25 * M, day + 30 * M]], u: [], d: [] } }),
    // The chat carries one response a fork also holds: it is counted once
    run({
      id: 'chat',
      kind: 'chat',
      sum: { s: [[day - 60 * M, day + 30 * M]], u: [msg('m3', 'claude-sonnet-5-5', day + 2 * M, { output: 20 }), msg('m5', 'claude-opus-5-5', day - 30 * M, { output: 1 })], d: [], turns: [[day - 60 * M, day - 59 * M], [day + 20 * M, day + 20 * M + 30_000]] },
    }),
  ]
  const kept = keep({ c1: runs })
  const s = kept.stats(0)
  expect(s.models.map(([model, t]) => [model, t.total])).toEqual([
    ['claude-opus-5-5', 1116],
    ['claude-sonnet-5-5', 70],
  ])
  expect(s.by).toEqual({ work: 1130, helpers: 50, flows: 5, chat: 1 })
  expect([s.finished, s.flows, s.todosDone, s.messages]).toEqual([2, 1, 1, 2])
  expect(s.turn).toBe(45_000)
  // w1 with its helper 15 minutes, w2 10, the workflow 10: 35 minutes of work in 25 on the clock
  expect([s.time.added, s.time.clock, s.time.saved]).toEqual([35 * M, 25 * M, 10 * M])
  // From the twentieth minute on: only the workflow, the chat's later message, and their tokens
  const later = kept.stats(day + 20 * M)
  expect([later.finished, later.flows, later.messages, later.all.total]).toEqual([0, 1, 1, 5])
  expect([later.time.added, later.time.saved]).toEqual([10 * M, 0])
  // The leaderboard's ranges: today from midnight, the last 7 and 30 days back from now, all time; work against real time
  const board = kept.board(day + 3 * 86_400_000)
  expect([board.all.work, board.all.clock, board.all.tasks, board.all.tokens]).toEqual([35 * M, 25 * M, 2, 1186])
  expect([board.d7.work, board.d30.work, board.today.work]).toEqual([35 * M, 35 * M, 0])
  expect(board.all.models.map(([model, tokens]) => [model, tokens])).toEqual([['claude-opus-5-5', 1116], ['claude-sonnet-5-5', 70]])
  expect(efficiencyOf(board.all.work, board.all.clock)).toBe(1.4)
  expect(kept.board(day + 10 * 86_400_000).d7.work).toBe(0)
  // The timeline the board draws: each task's stretches in minutes with its model, never a title; the newest kept when it is too long
  const line = kept.line()
  expect(line.pieces).toEqual([[[0, 15, 0]], [[0, 10, 1]], [[20, 5, 0], [25, 5, 2]]])
  expect(line.models).toEqual(['claude-opus-5-5', 'claude-sonnet-5-5', ''])
  expect(JSON.stringify(line)).not.toContain('w1')
  expect(kept.line(30).pieces).toEqual([[[20, 5, 0], [25, 5, 2]]])
  // Nothing from before Claudopus was installed counts on the board, in the figures or the timeline
  expect(kept.board(day + 86_400_000, day + 20 * M).all.work).toBe(10 * M)
  expect(kept.line(40_000, day + 20 * M).pieces).toEqual([[[0, 5, 0], [5, 5, 1]]])
})

test('the timeline is one drawing the app takes whatever the history: each bar its own words while they fit, then each piece, then the bars alone', async () => {
  const day = 1_800_000_000_000
  const models = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2']
  // `n` pieces of work over `days`, each in up to three stretches with gaps between, on one of three models
  const many = (n: number, days: number): Piece[] =>
    Array.from({ length: n }, (_, i) => {
      const from = day + Math.floor((i / n) * days * 1440) * M
      const spans: Span[] = Array.from({ length: 1 + (i % 3) }, (_, k): Span => [from + k * 40 * M, from + k * 40 * M + (5 + (i % 17)) * M])
      const model = models[i % 3] ?? ''
      return { id: `p${i}`, title: `A piece of work with a title of a usual length, number ${i}`, isFlow: false, isFinished: true, spans, bars: spans.map(([a, z]) => ({ from: a, to: z, model })), chat: 'c1', done: [], ended: spans.at(-1)?.[1] ?? 0 }
    })
  // About the history that made the tab fail (355 pieces, 449 bars over two months, 210,000 characters): every bar keeps its own words, as the 468 of the real one do
  const usual = many(230, 60)
  const svg = timelineSvg(usual, 412)
  expect(svg.length).toBeGreaterThan(0)
  expect(svg.length).toBeLessThanOrEqual(SVG_MOST)
  expect(svg.split('class="b"').length - 1).toBe(usual.reduce((n, p) => n + p.bars.length, 0))
  // Far more: a piece's bars light up together with its name, then the bars alone, never past the limit
  for (const [n, days, width, groups] of [[355, 60, 412, 355], [1500, 90, 412, 0], [5000, 365, 412, 0], [5000, 365, 1400, 0], [60, 1, 200, 'bars']] as const) {
    const pieces = many(n, days)
    const source = timelineSvg(pieces, width)
    expect(svgFits(source)).toBe(true)
    // Each model in its colour; drawn on a grid, each cell is the model that ran most in it
    if (groups !== 0) for (const model of models) expect(source).toContain(colorOf(model))
    if (typeof groups === 'number') expect(source.split('class="b"').length - 1).toBe(groups)
    // Bars drawn one shape a model never lie over each other, so no model hides another
    if (groups === 0) {
      const taken = new Set<string>()
      for (const [, d] of source.matchAll(/<path d="([^"]+)" fill="#/g)) {
        let [x, y] = [0, 0]
        for (const [, move, a, b, w] of (d ?? '').matchAll(/([Mm])(-?[\d.]+) (-?[\d.]+)h([\d.]+)/g)) {
          ;[x, y] = move === 'M' ? [Number(a), Number(b)] : [x + Number(a), y]
          for (let c = Math.round(x * 2); c < Math.round((x + Number(w)) * 2); c++) {
            expect(taken.has(`${y}:${c}`)).toBe(false)
            taken.add(`${y}:${c}`)
          }
        }
      }
      expect(taken.size).toBeGreaterThan(0)
    }
  }
  expect(svgFits('x'.repeat(SVG_MOST + 1))).toBe(false)
})

test('what is kept by chat, day and month comes to the very figures of adding every response and task up again, from any moment on, for every chat or one', async () => {
  const H = 60 * M
  const start = Date.UTC(2026, 8, 20)
  const october = Date.UTC(2026, 9, 1)
  const now = Date.UTC(2026, 10, 21, 12)
  let seed = 7
  const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296
  const upTo = (n: number) => Math.floor(next() * n)
  const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-haiku-5-5', 'made-up-1', '<synthetic>']
  let made = 0
  // A transcript's responses: a few in each busy stretch, most on its own model, some fast, some after a long prompt
  const answers = (chat: string, spans: Span[], model: string) =>
    spans.flatMap(([a, z]) =>
      Array.from({ length: 1 + upTo(3) }, () =>
        msg(`${chat}-m${made++}`, next() < 0.8 ? model : (MODELS[upTo(MODELS.length)] ?? ''), a + upTo(z - a), { input: upTo(900), w5: upTo(5000), w1: upTo(3000), read: upTo(90_000), output: 1 + upTo(4000), fast: next() < 0.1, long: next() < 0.1 }),
      ),
    )
  // One to three busy stretches from `from`, with quiet between them
  const stretches = (from: number, most = 3): Span[] => {
    let at = from
    return Array.from({ length: 1 + upTo(most) }, (): Span => {
      const span: Span = [at, at + (3 + upTo(88)) * M + upTo(60_000)]
      at = span[1] + (16 + upTo(200)) * M
      return span
    })
  }
  const two = (n: number) => String(n).padStart(2, '0')
  const chatOf = (chat: string): Run[] => {
    const own: Span[] = Array.from({ length: 24 }, () => start + upTo(now - start - 6 * H)).sort((a, b) => a - b).map((at): Span => [at, at + (2 + upTo(50)) * M])
    const said = answers(chat, own, 'claude-opus-5-5')
    const runs: Run[] = [run({ id: chat, kind: 'chat', isFinished: false, sum: { s: own, u: said, d: [], turns: own.flatMap(([a, z]): Span[] => [[a, a + 5000 + upTo(z - a - 5000)], [a + 1000, a + 1000 + upTo(90_000)]]) } })]
    for (let i = 0; i < 14; i++) {
      const id = `${chat}w${two(i)}`
      const spans = stretches(start + upTo(now - start - 12 * H))
      const model = MODELS[i % 4] ?? ''
      // A task carries a response of the chat that started it, as a fork does
      const carried = said[upTo(said.length)] as Msg
      runs.push(run({ id, kind: 'work', isFinished: i % 5 !== 4, sum: { s: spans, u: [carried, ...answers(chat, spans, model)], d: spans.flatMap(([a, z], k): TodoCall[] => [[a + 1000, `Step ${k}`, 'doing', ''], [z - 1000, k % 2 ? `Step ${k}, said again` : `Step ${k}`, k === 2 ? 'dropped' : 'done', k % 2 ? `Step ${k}` : '']]) } }))
      if (i % 3 === 0) {
        // Its helper runs on past its end, and a helper's own helper past that
        const end = spans.at(-1)?.[1] ?? 0
        const later = end + (1 + upTo(30)) * M
        const helped: Span[] = [[end - 2 * M, later]]
        runs.push(run({ id: `${chat}h${two(i)}`, kind: 'helper', parent: id, sum: { s: helped, u: answers(chat, helped, 'claude-sonnet-5-5'), d: [] } }))
        if (i % 6 === 0) runs.push(run({ id: `${chat}h${two(i)}x`, kind: 'helper', parent: `${chat}h${two(i)}`, sum: { s: [[later - M, later + 7 * M]], u: answers(chat, [[later, later + 5 * M]], 'claude-haiku-5-5'), d: [] } }))
      }
    }
    for (let j = 0; j < 2; j++) {
      const at = start + upTo(now - start - 12 * H)
      for (const [name, model, from] of [['a', 'claude-fable-5-2', at], ['b', 'claude-sonnet-5-5', at + 20 * M]] as const) {
        const spans = stretches(from, 2)
        runs.push(run({ id: `${chat}f${j}${name}`, kind: 'flow', parent: `wf_${chat}_${j}`, title: `Workflow ${j}`, isFinished: j === 0, sum: { s: spans, u: answers(chat, spans, model), d: [] } }))
      }
    }
    return runs
  }
  const chats: Record<string, Run[]> = { a1: chatOf('a1'), b2: chatOf('b2') }
  // By hand, what a range's edge can cut: a task busy across midnight between two months, with a response and a to-do on each side;
  // one busy in two months with a quiet night between; one still running; two tasks carrying the same response with different times;
  // and a chat copied from another, carrying its first responses
  chats.a1?.push(
    run({ id: 'a1x-over', kind: 'work', sum: { s: [[october - 30 * M, october + 40 * M]], u: [msg('over-1', 'claude-fable-5-2', october - 10 * M, { output: 700, w1: 9 }), msg('over-2', 'claude-fable-5-2', october + 10 * M, { output: 300, read: 11 })], d: [[october - 5 * M, 'Before', 'done', ''], [october + 5 * M, 'After', 'done', '']] } }),
    run({ id: 'a1x-night', kind: 'work', sum: { s: [[Date.UTC(2026, 9, 31, 22), Date.UTC(2026, 9, 31, 22, 30)], [Date.UTC(2026, 10, 1, 2), Date.UTC(2026, 10, 1, 2, 30)]], u: [msg('night-1', 'made-up-1', Date.UTC(2026, 9, 31, 22, 10), { output: 50 }), msg('night-2', 'made-up-1', Date.UTC(2026, 10, 1, 2, 10), { output: 60 })], d: [] } }),
    run({ id: 'a1x-running', kind: 'work', isFinished: false, sum: { s: [[now - 40 * M, now - 5 * M]], u: [msg('running-1', 'claude-opus-5-5', now - 20 * M, { output: 123 })], d: [] } }),
    run({ id: 'a1x-twin1', kind: 'work', sum: { s: [[Date.UTC(2026, 9, 10, 13), Date.UTC(2026, 9, 10, 13, 30)]], u: [msg('twin', 'claude-opus-5-5', Date.UTC(2026, 9, 10, 13), { output: 77 })], d: [] } }),
    run({ id: 'a1x-twin2', kind: 'work', sum: { s: [[Date.UTC(2026, 9, 10, 14), Date.UTC(2026, 9, 10, 14, 30)]], u: [msg('twin', 'claude-opus-5-5', Date.UTC(2026, 9, 10, 14), { output: 77 })], d: [] } }),
  )
  const b2 = chats.b2?.[0]
  if (b2) b2.sum.u = [...(chats.a1?.[0]?.sum.u.slice(0, 5) ?? []), ...b2.sum.u]
  // Each chat's transcripts by name, as its folder lists them
  for (const runs of Object.values(chats)) runs.sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : 1))
  const everything = Object.values(chats).flat()
  const kept = keep(chats)
  const froms = [
    0, start, october - 30 * M, october - 10 * M, october, october + 10 * M, october + 40 * M, Date.UTC(2026, 9, 10), Date.UTC(2026, 9, 10, 13), Date.UTC(2026, 9, 10, 13, 20), Date.UTC(2026, 9, 10, 14),
    Date.UTC(2026, 9, 31, 22, 30), Date.UTC(2026, 9, 31, 23), Date.UTC(2026, 10, 1), Date.UTC(2026, 10, 1, 2, 30), now - 30 * 86_400_000, now - 7 * 86_400_000, now - 40 * M, now - 5 * M, now, now + 86_400_000,
    // and a hundred moments anywhere, some of them the very moment a task began or ended, or a response was given
    ...Array.from({ length: 100 }, (_, i) => {
      const r = everything[upTo(everything.length)] as Run
      const span = r.sum.s[upTo(r.sum.s.length)]
      return i % 4 === 0 ? (span?.[0] ?? start) : i % 4 === 1 ? (span?.[1] ?? start) : i % 4 === 2 ? (r.sum.u[upTo(r.sum.u.length)]?.[2] ?? start) : start + upTo(now - start)
    }),
  ]
  for (const from of froms) {
    const want = plain(everything, from, now)
    expect([from, shape(kept.stats(from, now))]).toEqual([from, shape(want)])
    // With only the month the range begins in and this one read, as the leaderboard reads: the same figures
    expect([from, shape(kept.stats(from, now, '', false), false)]).toEqual([from, shape(want, false)])
    for (const [chat, runs] of Object.entries(chats)) expect([from, chat, shape(kept.stats(from, now, chat))]).toEqual([from, chat, shape(plain(runs, from, now))])
  }
  // Something of every kind was there to count, and the copies were counted once
  const all = kept.stats(0, now)
  expect([all.finished > 20, all.running, all.flows, all.todosDone > 20, all.messages, all.all.unpriced > 0, all.by.helpers > 0, all.by.flows > 0, all.time.saved > 0]).toEqual([true, 1, 4, true, 96, true, true, true, true])
  expect(all.all.total).toBeLessThan(everything.flatMap(r => r.sum.u).filter(m => m[1] !== '<synthetic>').reduce((sum, m) => sum + m[5] + m[6] + m[7] + m[8] + m[9], 0))
  // The leaderboard's timeline: the same tasks at the same minutes in the same models, whole and cut to its newest, with nothing
  // from before Claudopus was installed
  for (const [most, since] of [[40_000, 0], [600, 0], [40_000, october + 10 * M], [900, Date.UTC(2026, 9, 31, 23)], [40_000, now - 20 * M]] as const) {
    const want = plainLine(everything, most, since)
    const got = kept.line(most, since, now)
    expect([most, since, named(got)]).toEqual([most, since, named(want)])
    expect([...got.models].sort()).toEqual([...want.models].sort())
  }
})

test('the leaderboard is sent only what changed: the ranges whose figures did, and of the timeline its end from the first task that changed; all of it the first time', async () => {
  const range = (work: number) => boardRange({ ...keep({}).stats(0), time: { added: work, clock: work, saved: 0, first: 0, last: 0 } })
  const task = (i: number): BoardTimeline['pieces'][number] => [[i * 10, 5 + (i % 7), i % 3], [i * 10 + 6, 2, 1]]
  const line = (from: number, to: number, base = 60_000): BoardTimeline => ({ base, models: ['claude-opus-5-5', 'claude-sonnet-5-5', ''], pieces: Array.from({ length: to - from }, (_, i) => task(from + i)) })
  const was: BoardSent = { today: range(1), d7: range(2), d30: range(3), all: range(4), timeline: line(0, 40) }
  // The board holds nothing this Mac knows of: everything goes, the timeline whole
  expect(boardDelta(undefined, was)).toEqual(was)
  // Nothing changed: nothing to send
  expect(boardDelta(was, JSON.parse(JSON.stringify(was)) as BoardSent)).toEqual({})
  // Today's figures changed: today's alone
  expect(boardDelta(was, { ...was, today: range(9) })).toEqual({ today: range(9) })
  // What the board makes of a change to the timeline: its own tasks from `drop` on, `keep` of them, then those added
  const applied = (old: BoardTimeline, sent: ReturnType<typeof boardDelta>) =>
    sent.line ? { base: sent.line.base, models: sent.line.models, pieces: [...old.pieces.slice(sent.line.drop, sent.line.drop + sent.line.keep), ...sent.line.add] } : sent.timeline
  const grown = line(0, 40)
  grown.pieces[39] = [[390, 99, 0]]
  const cases: [name: string, next: BoardTimeline, drop: number, keep: number, added: number][] = [
    // A task more at the end
    ['one more', line(0, 41), 0, 40, 1],
    // The oldest fell off as the newest came
    ['moved on', line(3, 43), 3, 37, 3],
    // The task still running grew
    ['still running', grown, 0, 39, 1],
    // A model nobody used before: the tasks stay, the list of models goes whole
    ['a new model', { ...line(0, 41), models: ['claude-opus-5-5', 'claude-sonnet-5-5', '', 'claude-fable-5-2'] }, 0, 40, 1],
  ]
  for (const [name, next, drop, keep, added] of cases) {
    const sent = boardDelta(was, { ...was, timeline: next })
    expect([name, Object.keys(sent)]).toEqual([name, ['line']])
    expect([name, sent.line?.drop, sent.line?.keep, sent.line?.add.length]).toEqual([name, drop, keep, added])
    expect([name, applied(line(0, 40), sent)]).toEqual([name, next])
    // Far less than the timeline whole
    expect(JSON.stringify(sent).length).toBeLessThan(JSON.stringify(next).length / 4)
  }
  // Counted from another first minute (an older task came to light), or hardly any of it the same: the timeline goes whole
  for (const next of [line(0, 40, 0), line(38, 80)]) expect(boardDelta(was, { ...was, timeline: next })).toEqual({ timeline: next })
  // Made private: no timeline is sent, and none is kept as sent, so making it public again sends it whole
  const { timeline: _, ...bare } = was
  expect(boardDelta(was, bare)).toEqual({})
  expect(boardDelta(bare, was)).toEqual({ timeline: was.timeline })
})
