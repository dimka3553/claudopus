import { expect, test } from 'claude-code/testing'

import { isPulledBack, PULL_BACK } from './scrolls'

// Moves as the real app reported them on 15 Nov while a reply box held the focus (time in ms, rows)
test("a move the other way within moments of the person's, while a box they type in holds the focus, is the app pulling the panel back; anything else is the person's", () => {
  const cases: [string, { at: number; by: number } | undefined, { at: number; by: number }, boolean, boolean][] = [
    ['up a row, pulled back down 23 ms later', { at: 11289, by: -1 }, { at: 11312, by: 1 }, true, true],
    ['up five, pulled back five 22 ms later', { at: 11389, by: -5 }, { at: 11411, by: 5 }, true, true],
    ['up two, pulled thirteen down 26 ms later', { at: 11514, by: -2 }, { at: 11540, by: 13 }, true, true],
    ['the person going on up', { at: 11483, by: -4 }, { at: 11485, by: -2 }, true, false],
    ['the person scrolling down row by row', { at: 7390, by: 1 }, { at: 7424, by: 1 }, true, false],
    ['the person turning back after a while', { at: 1000, by: -1 }, { at: 1000 + PULL_BACK, by: 1 }, true, false],
    ['no box holds the focus', { at: 11289, by: -1 }, { at: 11312, by: 1 }, false, false],
    ['the first move of all', undefined, { at: 11312, by: 1 }, true, false],
    ['a move of nothing', { at: 11289, by: -1 }, { at: 11300, by: 0 }, true, false],
  ]
  for (const [what, last, move, isBoxFocused, isPull] of cases) expect([what, isPulledBack(last, move, isBoxFocused)]).toEqual([what, isPull])
})
