import { expect, test } from 'claude-code/testing'

import { finishedOf, isStarred, rowStar, starLine, starMoved, starredCount, starredOf, stars, starsTook, starsUnion, taskShows, tasksView } from './tasks'
import type { Report } from '../types'

const report = (id: string, at: number, agent = '', title = id): Report => ({ id, title, subject: title, at, chat: 'A chat', chatId: 'c1', folder: '/x', gist: '', files: [], agent })

test("a star is the task's newest line, whatever lines came before or were cut short; another Mac's lines are added once each, and a task starred keeps its name and state once its card is gone", () => {
  const lines = [
    starLine({ id: 'a', on: true, at: 1, title: 'Fit the heads', state: 'Working' }),
    starLine({ id: 'b', on: true, at: 2, title: 'Check the ears', state: 'Delivered', chat: 'Heads' }),
    '{"id":"c","on":tr\n',
    starLine({ id: 'a', on: false, at: 3, title: 'Fit the heads', state: 'Working' }),
  ].join('')
  expect(starsTook(lines)).toBe(true)
  expect(starsTook(lines)).toBe(false)
  expect([isStarred('a'), isStarred('b'), isStarred('c'), starredCount()]).toEqual([false, true, false, 1])
  // (an older line read after a newer one changes nothing)
  starsTook(`${lines}${starLine({ id: 'b', on: false, at: 1, title: 'Check the ears', state: 'Working' })}`)
  expect(isStarred('b')).toBe(true)
  // What moved on a starred task is a line to add; on one not starred, or one as it was, none
  expect(starMoved({ id: 'b', title: 'Check the ears', state: 'Delivered', chat: 'Heads' }, 9)).toBe('')
  expect(JSON.parse(starMoved({ id: 'b', title: 'Check the ears', state: 'Done', report: 'r1', chat: 'Heads' }, 9))).toEqual({ id: 'b', on: true, at: 9, title: 'Check the ears', state: 'Done', report: 'r1', chat: 'Heads' })
  expect(starMoved({ id: 'a', title: 'Fit the heads', state: 'Done' }, 9)).toBe('')
  // Two Macs: nothing new from the other says so; its new lines come after this one's, each once
  const mine = stars.text
  expect(starsUnion(mine, mine)).toBeUndefined()
  const theirs = starLine({ id: 'd', on: true, at: 5, title: 'Draw the eyes', state: 'Done' })
  expect(starsUnion(mine, `Welcome\n${theirs}${theirs}`)).toBe(`${mine.trim()}\n${theirs}`)
  // Starred and its card gone: drawn from its star, with its result once this Mac has it
  starsTook(`${mine}${theirs}`)
  const rows = starredOf([], [report('r-eyes', 7, 'd', 'The eyes')])
  expect(rows.map(one => [one.id, one.title, one.report, one.line])).toEqual([
    ['d', 'Draw the eyes', 'r-eyes', 'Done'],
    ['b', 'Check the ears', undefined, 'Delivered · Heads'],
  ])
  // A row starred again keeps what its star said of it
  expect(rowStar({ at: 2, id: 'b', title: 'Check the ears', line: 'Delivered · Heads' })).toEqual({ id: 'b', title: 'Check the ears', state: 'Delivered', report: undefined, chat: 'Heads', ended: 2 })
  starsTook('')
})

test('Finished lists every finished task, the newest first: its card while one is kept, else its newest result, and a result no task wrote as a row of its own', () => {
  const reports = [report('r1', 10, 'a1'), report('r2', 30, 'a2', 'Second round'), report('r2-old', 20, 'a2'), report('by-hand', 25), report('r-card', 40, 'k1')]
  const cards = [{ at: 35, id: 'k1', title: 'Kept card' }]
  const all = finishedOf(cards, reports)
  expect(all.map(one => [one.id, one.report])).toEqual([
    ['k1', undefined],
    ['a2', 'r2'],
    ['by-hand', 'by-hand'],
    ['a1', 'r1'],
  ])
  // (nor one of a card still up among the cards: it is not finished for the person yet)
  expect(finishedOf(cards, reports, ['a2']).map(one => one.id)).toEqual(['k1', 'by-hand', 'a1'])
  // (two thousand results: every one listed)
  const many = Array.from({ length: 2000 }, (_, i) => report(`r${i}`, i, `t${i}`))
  expect(finishedOf([], many).length).toBe(2000)
})

test('each tab shows only its cards, and the search only the names it finds, in any case', () => {
  const was = { ...tasksView }
  const kinds = [1, 2, 3, 0]
  const shown = () => kinds.map(kind => taskShows(kind, 'Fit the Heads'))
  expect(shown()).toEqual([true, true, true, true])
  for (const [filter, want] of [['working', [true, false, false, false]], ['waiting', [false, true, false, false]], ['delivered', [false, false, true, false]], ['finished', [false, false, false, false]], ['starred', [false, false, false, false]]] as const) {
    tasksView.filter = filter
    expect(shown()).toEqual(want)
  }
  tasksView.filter = 'all'
  tasksView.find = 'heads'
  expect(shown()).toEqual([true, true, true, true])
  tasksView.find = 'ears'
  expect(shown()).toEqual([false, false, false, false])
  Object.assign(tasksView, was)
})
