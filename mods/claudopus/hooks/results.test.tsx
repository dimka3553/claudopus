import { expect, test } from 'claude-code/testing'

import { isResultId, marksOf, merged, pullThere, rehome, resultsOf } from './results'

test("another Mac's results are read past a login banner, by folder, with each meta.json's checksum", async () => {
  const out = 'Welcome\n/Users/sam\n---claudopus-result---\n20261112-0812-one\n123 45\n{"id":"20261112-0812-one","title":"One"}\n---claudopus-result---\n../bad\n1 2\n{}\n'
  const theirs = resultsOf(out)
  expect(theirs?.home).toBe('/Users/sam')
  expect([...(theirs?.results.keys() ?? [])]).toEqual(['20261112-0812-one'])
  expect(theirs?.results.get('20261112-0812-one')?.sum).toBe('123 45')
  expect(resultsOf('no home here')).toBeUndefined()
  expect(isResultId('_sync')).toBe(false)
  expect(isResultId('a b')).toBe(false)
  expect(pullThere(['ok-1', '$(rm)'])).toBe('cd ~/.claude/claudopus/reports && COPYFILE_DISABLE=1 tar cf - -- ok-1')
})

test("a result's paths move onto the other Mac's home, never into a longer name that begins with it", async () => {
  const text = '"folder": "/Users/dima/repo", see /Users/dima/a.png and /Users/dimashkabura/b.png, /Users/dima.'
  expect(rehome(text, '/Users/dima', '/Users/dimashkabura')).toBe('"folder": "/Users/dimashkabura/repo", see /Users/dimashkabura/a.png and /Users/dimashkabura/b.png, /Users/dimashkabura.')
  expect(rehome('/Users/dimashkabura/x', '/Users/dimashkabura', '/Users/dima')).toBe('/Users/dima/x')
})

test('put away on one Mac and brought back on the other: the later wins; an answer given on either is kept on both', async () => {
  expect(marksOf({ archived: 10 }, {}).archived).toBe(10)
  expect(marksOf({ archived: 10 }, { broughtBack: 20 }).archived).toBeUndefined()
  expect(marksOf({ archived: 30, broughtBack: 20 }, { broughtBack: 20 }).archived).toBe(30)
  const waits = [{ text: 'A?' }, { text: 'B?' }]
  const m = marksOf({ waiting: [{ text: 'A?', answer: 'Yes' }, { text: 'B?' }] }, { waiting: [{ text: 'A?', answer: 'Not now' }, { text: 'B?', answer: 'No' }] })
  expect(m.waiting).toEqual([{ text: 'A?', answer: 'Yes' }, { text: 'B?', answer: 'No' }])
  expect(marksOf({ waiting: waits }, {}).waiting).toEqual(waits)
  // Nothing to change says so; a change keeps the rest of the meta.json as it was
  expect(merged('{"id":"r","archived":5}', { archived: 5 })).toBeUndefined()
  const next = JSON.parse(merged('{"id":"r","folder":"/Users/sam/x","archived":5}', { broughtBack: 9 }) ?? '{}')
  expect(next).toEqual({ id: 'r', folder: '/Users/sam/x', broughtBack: 9 })
  expect(merged('{"id":"r"}', {})).toBeUndefined()
})
