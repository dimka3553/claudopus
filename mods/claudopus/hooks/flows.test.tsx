import { expect, test } from 'claude-code/testing'

import { squaresBefore, squaresKept, squaresSvg } from './flows'
import type { Square } from './flows'

test('a workflow of any length draws its squares in one drawing the app takes: its last rounds, and how many came before', async () => {
  // 400 rounds of six steps, the longest kind of square each, then one round of thousands of steps
  for (const groups of [Array.from({ length: 400 }, (): Square[] => Array(6).fill('running')), [Array<Square>(5000).fill('running')]]) {
    const kept = squaresKept(groups)
    expect(squaresSvg(kept.groups, 22).length).toBeLessThanOrEqual(131_072)
    expect(kept.groups.length + kept.earlier).toBe(groups.length)
    // The newest round is the one drawn last
    expect(kept.groups.at(-1)?.length).toBe(Math.min(600, groups.at(-1)?.length ?? 0))
  }
  // What was left out is said: earlier rounds, or one round's earlier steps
  expect(squaresBefore(squaresKept(Array.from({ length: 101 }, (): Square[] => Array(6).fill('done'))))).toBe('1 earlier round')
  expect(squaresBefore(squaresKept([Array<Square>(5000).fill('done')]))).toBe('4400 earlier steps')
  // A run that fits is drawn whole
  const short: Square[][] = [['done', 'failed'], ['running', 'waiting']]
  expect(squaresKept(short)).toEqual({ groups: short, earlier: 0, steps: 0 })
  expect(squaresBefore(squaresKept(short))).toBe('')
})
