import { expect, test } from 'claude-code/testing'

import { costOf, lengthOf, mostAtOnce, priceOf, statsOf, timeOf, todosOf, union } from './stats'
import type { Msg, Run } from './stats'

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
  const s = statsOf(runs, 0, Infinity)
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
  const later = statsOf(runs, day + 20 * M, Infinity)
  expect([later.finished, later.flows, later.messages, later.all.total]).toEqual([0, 1, 1, 5])
  expect([later.time.added, later.time.saved]).toEqual([10 * M, 0])
})
