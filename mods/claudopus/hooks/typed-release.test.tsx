import { expect, test } from 'claude-code/testing'

import { chooseReleases, releaseReading } from './typed-release'

// 28 Nov: four messages typed while a release waited, none of which counted
test('while a release waits, a message that plainly tells to release is a go-ahead, for every one with "all", the task it names or the only one; a question or a word that holds it back never is, though it is still about releasing', () => {
  const one = [{ title: 'Fix the nose' }]
  const two = [{ title: 'Fix the nose' }, { title: 'Fix the hosts file' }]
  const pick = (typed: string, waits: { title: string }[]) => {
    const reading = releaseReading(typed)
    if (!reading.counts) return { counts: false, isTalk: reading.isTalk }
    const { chosen, more, unsure } = chooseReleases(reading, waits)
    return { chosen: chosen.map(w => w.title), isMore: more.length > 0, unsure: unsure?.map(w => w.title) ?? [] }
  }
  const go = (chosen: string[], isMore = false) => ({ chosen, isMore, unsure: [] })
  for (const [typed, waits, got] of [
    ['yes, go', one, go(['Fix the nose'])],
    ['push all so I can test', one, go(['Fix the nose'], true)],
    ['release it and switch now so I can test', one, go(['Fix the nose'], true)],
    ['OK to all go push it', one, go(['Fix the nose'])],
    ['ok deploy it', one, go(['Fix the nose'])],
    ['Release it. I allow it.', one, go(['Fix the nose'])],
    ['sure, go ahead', one, go(['Fix the nose'])],
    ['put it live', one, go(['Fix the nose'])],
    ["do it", one, go(['Fix the nose'])],
    // With two waiting: "all" presses both, a name its own, and neither asks which
    ['push them all', two, go(['Fix the nose', 'Fix the hosts file'])],
    ['ship everything', two, go(['Fix the nose', 'Fix the hosts file'])],
    ['release the nose fix so I can test it', two, go(['Fix the nose'], true)],
    ['yes the hosts file', two, go(['Fix the hosts file'])],
    ['yes, go', two, { chosen: [], isMore: false, unsure: ['Fix the nose', 'Fix the hosts file'] }],
    ['push fix', two, { chosen: [], isMore: false, unsure: ['Fix the nose', 'Fix the hosts file'] }],
    // Yes-words with words that name no waiting task: no go-ahead
    ['yes the billing page', one, go([])],
    // nor is a release verb among words that name no waiting task: talk of something else
    ['the push notifications look good', one, go([])],
    ['merge the two tables', one, go([])],
    ['push it live', one, go(['Fix the nose'])],
    ['push the fix to main', one, go(['Fix the nose'])],
    // Questions, holds and negations: no go-ahead, though still about releasing
    ['is now all pushed?', one, { counts: false, isTalk: true }],
    ['did you push it', one, { counts: false, isTalk: true }],
    ['can you release it', one, { counts: false, isTalk: true }],
    ["don't push yet", one, { counts: false, isTalk: true }],
    ['do not release', one, { counts: false, isTalk: true }],
    ['wait, then push', one, { counts: false, isTalk: true }],
    ['push it after the tests pass', one, { counts: false, isTalk: true }],
    ['release it once the build is green', one, { counts: false, isTalk: true }],
    ['never deploy on a friday', one, { counts: false, isTalk: true }],
    ['push it first thing tomorrow', one, { counts: false, isTalk: true }],
    ['is it live', one, { counts: false, isTalk: true }],
    // Not about releasing at all
    ['what does the nose look like', one, { counts: false, isTalk: false }],
    ['make the tip rounder', one, { counts: false, isTalk: false }],
    // Longer than a line's go-ahead
    [`push it ${'and then a lot more about it '.repeat(5)}`, one, { counts: false, isTalk: true }],
    ['push it\nand more', one, { counts: false, isTalk: true }],
  ] as const) expect([typed, pick(typed, [...waits])]).toEqual([typed, got])
})
