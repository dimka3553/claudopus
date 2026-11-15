import { expect, test } from 'claude-code/testing'

import { isPulledBack, PULL_BACK } from './scrolls'

// Moves as the real app reported them on 15 Nov while a reply box held the focus (time in ms, rows)
test("a move the other way within moments of the person's, while a box they type in holds the focus, is the app pulling the panel back; anything else is the person's", () => {
  const cases: [string, { at: number; by: number } | undefined, { at: number; by: number; to?: number }, boolean, boolean, number?][] = [
    ['up a row, pulled back down 23 ms later', { at: 11289, by: -1 }, { at: 11312, by: 1 }, true, true],
    ['up five, pulled back five 22 ms later', { at: 11389, by: -5 }, { at: 11411, by: 5 }, true, true],
    ['up two, pulled thirteen down 26 ms later', { at: 11514, by: -2 }, { at: 11540, by: 13 }, true, true],
    ['down three, pulled 59 further down to the box 17 ms later', { at: 3287, by: 2 }, { at: 3304, by: 59, to: 68 }, true, true, 67],
    ['the person, up 27 rows at once in a slow drawing, far from the box', { at: 18953, by: -3 }, { at: 19065, by: -27, to: 9 }, true, false, 68],
    ['the person flicking down nine after one', { at: 7426, by: 1 }, { at: 7441, by: 9 }, true, false],
    ['the person going on up', { at: 11483, by: -4 }, { at: 11485, by: -2 }, true, false],
    ['the person scrolling down row by row', { at: 7390, by: 1 }, { at: 7424, by: 1 }, true, false],
    ['the person turning back after a while', { at: 1000, by: -1 }, { at: 1000 + PULL_BACK, by: 1 }, true, false],
    ['no box holds the focus', { at: 11289, by: -1 }, { at: 11312, by: 1 }, false, false],
    ['the first move of all', undefined, { at: 11312, by: 1 }, true, false],
    ['after a rest, a jump of 62 to row 70 where the last pull landed', { at: 14000, by: -2 }, { at: 15043, by: 62, to: 70 }, true, true, 69],
    ['after a rest, the person scrolling 25 to row 30, far from where pulls land', { at: 14000, by: -2 }, { at: 15043, by: 25, to: 30 }, true, false, 69],
    ['a move of nothing', { at: 11289, by: -1 }, { at: 11300, by: 0 }, true, false],
  ]
  for (const [what, last, move, isBoxFocused, isPull, pulledTo] of cases) expect([what, isPulledBack(last, move, isBoxFocused, pulledTo)]).toEqual([what, isPull])
})
