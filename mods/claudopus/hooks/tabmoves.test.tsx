import { expect, test } from 'claude-code/testing'

import { TAB_MOVES_WAIT, tabMoveQueue } from './tabmoves'
import type { TabMove } from './tabmoves'

// A clock the test moves by hand: sleep settles once `tick` passes its time
const handClock = () => {
  let now = 0
  const sleeping: { at: number; wake: () => void }[] = []
  return {
    sleep: (ms: number) => new Promise<void>(wake => void sleeping.push({ at: now + ms, wake })),
    tick: (ms: number) => {
      now += ms
      for (const one of sleeping.filter(s => s.at <= now)) (sleeping.splice(sleeping.indexOf(one), 1), one.wake())
    },
  }
}
const flush = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve()
}
const later = () => {
  let settle = () => {}
  const promise = new Promise<void>(done => (settle = done))
  return { promise, settle }
}

test('a move handed over during a press is done by the press, after its onPress, and its promise settles', async () => {
  const q = tabMoveQueue()
  const done: string[] = []
  expect(q.isPressing()).toBe(false)
  q.begin()
  expect(q.isPressing()).toBe(true)
  const handed = q.handOver({ kind: 'front', id: 'stats', title: 'Stats' })
  expect(done).toEqual([])
  await q.finish(async move => void done.push(`${move.kind} ${move.id}`), handClock().sleep)
  await handed
  expect(done).toEqual(['front stats'])
  expect(q.isPressing()).toBe(false)
})

test('a press waits for an open that reads first, and does its move once it hands it over', async () => {
  const q = tabMoveQueue()
  const done: string[] = []
  const read = later()
  q.begin()
  // A card's Details: reads the card, then hands its move over
  const opening = q.coming(read.promise.then(() => q.handOver({ kind: 'front', id: 'work-a1', title: 'Fix it' })))
  let isFinished = false
  const finishing = q.finish(async move => void done.push(move.id), handClock().sleep).then(() => void (isFinished = true))
  await flush()
  expect(isFinished).toBe(false)
  read.settle()
  await finishing
  await opening
  expect(done).toEqual(['work-a1'])
  expect(q.isPressing()).toBe(false)
})

test('two presses that overlap both end, each move done once, and the press stays on until the last one ends', async () => {
  const q = tabMoveQueue()
  const done: string[] = []
  const run = async (move: TabMove) => void done.push(move.id)
  const clock = handClock()
  const read = later()
  // Press A opens a result, which reads first; press B, a tap on x, comes while it reads
  q.begin()
  const opening = q.coming(read.promise.then(() => q.handOver({ kind: 'front', id: 'report-1', title: 'Result' })))
  let isA = false
  const a = q.finish(run, clock.sleep).then(() => void (isA = true))
  q.begin()
  const back = q.handOver({ kind: 'back', id: 'stats' })
  let isB = false
  const b = q.finish(run, clock.sleep).then(() => void (isB = true))
  await flush()
  await back
  expect(done).toEqual(['stats'])
  expect(isA || isB).toBe(false)
  expect(q.isPressing()).toBe(true)
  read.settle()
  await Promise.all([a, b, opening])
  expect(done).toEqual(['stats', 'report-1'])
  expect(q.isPressing()).toBe(false)
})

test('an open that never settles holds the press no longer than the engine counts it as asked', async () => {
  const q = tabMoveQueue()
  const clock = handClock()
  q.begin()
  void q.coming(new Promise<void>(() => {}))
  let isFinished = false
  const finishing = q.finish(async () => {}, clock.sleep).then(() => void (isFinished = true))
  await flush()
  clock.tick(TAB_MOVES_WAIT - 1)
  await flush()
  expect(isFinished).toBe(false)
  clock.tick(1)
  await finishing
  expect(q.isPressing()).toBe(false)
})

test('a move that fails rejects its own promise and leaves the press to end', async () => {
  const q = tabMoveQueue()
  q.begin()
  const handed = q.handOver({ kind: 'back', id: 'stats' })
  await q.finish(async () => {
    throw new Error('no such tab')
  }, handClock().sleep)
  await expect(handed).rejects.toThrow('no such tab')
  expect(q.isPressing()).toBe(false)
})
