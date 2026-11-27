import { expect, test } from 'claude-code/testing'

import { holdsStems, latestBlock, latestIn, listChanges, listKeys, recallStems, saidEntry, splitHistory, stemOf, tidyTopics, topicsShown, withLatest, withoutLatest } from './topics'

const REPORTS = '/home/sam/.claude/claudopus/reports'
const NOW = Date.parse('2026-11-26T12:00:00Z')
const DAY = 86_400_000
const topic = (name: string, state = '', summary = '') => ({ name, repo: '/repo', session: '', state, summary })
const area = { id: 'nose', name: 'Nose', aim: 'A nose that fits every face', next: [{ text: 'A nose that moves with the mouth', state: 'open' }, { text: 'Old step', state: 'done' }], updated: '2026-11-26T10:00:00.000Z' }
const entry = (n: number) => ({ title: `Look ${n}`, at: `2026-11-${String(10 + n).padStart(2, '0')}T10:00:00.000Z`, kind: n === 2 ? 'aside' : 'task', outcome: `came to ${n}`, report: `r${n}`, reason: n === 2 ? 'Not now' : '' })

test("a topic page's Latest block names the area's five newest entries with their dates and results, never next steps, and takes the old block's place under the title, the tasks' text kept", async () => {
  const block = latestBlock([{ area, entries: [6, 5, 4, 3, 2, 1].map(entry) }], REPORTS, NOW)
  expect(block.split('\n').slice(1, -1)).toEqual([
    '## Latest (2026-11-26)',
    '- Nose: A nose that fits every face',
    `  - 2026-11-16 Look 6: came to 6 · ${REPORTS}/r6/report.md`,
    `  - 2026-11-15 Look 5: came to 5 · ${REPORTS}/r5/report.md`,
    `  - 2026-11-14 Look 4: came to 4 · ${REPORTS}/r4/report.md`,
    `  - 2026-11-13 Look 3: came to 3 · ${REPORTS}/r3/report.md`,
    `  - 2026-11-12 Look 2: came to 2 (set aside: Not now) · ${REPORTS}/r2/report.md`,
  ])
  const page = '# 3D heads\n\nWhere things are: the old prose.\n'
  const once = withLatest(page, block)
  expect(once.startsWith(`# 3D heads\n\n${block}\n\nWhere things are`)).toBe(true)
  const newer = latestBlock([{ area, entries: [entry(7)] }], REPORTS, NOW + DAY)
  const twice = withLatest(once, newer)
  expect(twice).toBe(`# 3D heads\n\n${newer}\n\nWhere things are: the old prose.\n`)
  expect(latestIn(twice)).toBe(newer)
  expect(withoutLatest(twice)).toBe(page)
  // A page with no title has the block at its top
  expect(withLatest('Notes only.\n', newer)).toBe(`${newer}\n\nNotes only.\n`)
})

test('a history past its limit has its older half, cut at an entry, moved once to a file of its own, and its top points to every such file', async () => {
  const entries = Array.from({ length: 10 }, (_, n) => `## 2026-11-${String(n + 10).padStart(2, '0')} 10:00 A task\n\n${'x'.repeat(90)}\n\n`).join('')
  expect(splitHistory(entries, 'old.1.md', 10_000)).toBe(undefined)
  const split = splitHistory(entries, '/m/streams/heads.log.1.md', 500)
  expect(split?.moved.startsWith('## 2026-11-10')).toBe(true)
  expect(split?.moved.endsWith('x\n\n')).toBe(true)
  expect(split?.kept.startsWith('Older entries: /m/streams/heads.log.1.md (up to 2026-11-14)\n\n## 2026-11-15')).toBe(true)
  expect(`${split?.moved}${split?.kept.split('\n\n').slice(1).join('\n\n')}`).toBe(entries)
  const again = splitHistory(`${split?.kept}${entries.slice(0, 600)}`, '/m/streams/heads.log.2.md', 500)
  expect(again?.kept.split('\n').slice(0, 4)).toEqual(['Older entries: /m/streams/heads.log.1.md (up to 2026-11-14)', 'Older entries: /m/streams/heads.log.2.md (up to 2026-11-19)', '', '## 2026-11-10 10:00 A task'])
  expect(again?.moved.startsWith('## 2026-11-15')).toBe(true)
})

test("the person's own words are kept dated, a paste as its start and the path of the whole", async () => {
  expect(saidEntry(NOW, ' (from the phone)', '  fix the nose \n')).toBe('## 2026-11-26T12:00:00.000Z (from the phone)\nfix the nose\n\n')
  expect(saidEntry(NOW, '', `${'a'.repeat(700)}`, '/m/pastes/p.md')).toBe(`## 2026-11-26T12:00:00.000Z\n${'a'.repeat(600)}\n[the whole paste: /m/pastes/p.md]\n\n`)
})

test("the topic list is tidied: a topic named by its slug takes its page's title unless another has it, an empty summary its page's first line; one done and quiet for two weeks is only named", async () => {
  const list = [topic('update-the-revenue-by-country', 'open'), topic('Heads', 'done: pushed', ''), topic('taken-name'), topic('Taken')]
  const pages = new Map([
    ['update-the-revenue-by-country', '# Revenue by country\n\n<!-- x -->\nWhere: the sheet of sales.\n'],
    ['Heads', '# Heads\n\n## Now\n**Nose** fits side faces.\n'],
    ['taken-name', '# Taken\n'],
  ])
  const tidied = tidyTopics(list, pages)
  expect(tidied.list.map(one => [one.name, one.summary])).toEqual([['Revenue by country', 'Where: the sheet of sales.'], ['Heads', 'Nose fits side faces.'], ['taken-name', ''], ['Taken', '']])
  expect(tidied.renames).toEqual([{ from: 'update-the-revenue-by-country', to: 'Revenue by country' }])
  expect(tidyTopics(tidied.list, pages).isChanged).toBe(false)
  const changedAt = new Map([['Heads', NOW - 15 * DAY], ['Taken', NOW - 15 * DAY]])
  const given = topicsShown([...tidied.list, topic('Song', 'done', '')], new Map([...changedAt, ['Song', NOW - DAY]]), NOW)
  expect(given.shown.map(one => one.name)).toEqual(['Revenue by country', 'taken-name', 'Taken', 'Song'])
  expect(given.done).toEqual(['Heads'])
})

test('what changed since a chat was last given the lists: a new or changed topic with its state, a new or changed area', async () => {
  const topics = [topic('Heads', 'nose fixed'), topic('Song')]
  const areas = [{ ...area, next: [] }]
  const seen = listKeys(topics, areas)
  expect(listChanges(topics, areas, seen)).toBe('')
  expect(listChanges([topic('Heads', 'chin next'), topic('Song'), topic('Site', 'started')], [{ ...areas[0]!, updated: 'later' }, { ...area, id: 'song', name: 'Song stills' }], seen)).toBe('topics Heads (chin next), Site (started) (new); areas Nose, Song stills (new)')
})

test("recall's words match in any order on a line by their stems, whatever their case", async () => {
  expect(['pages', 'boxes', 'fixing', 'fixed', 'running', 'stopped', 'studies', 'class', 'is', 'nose'].map(stemOf)).toEqual(['page', 'box', 'fix', 'fix', 'run', 'stop', 'stud', 'class', 'is', 'nose'])
  const stems = recallStems('Fixing the Pages')
  expect(stems).toEqual(['fix', 'the', 'page'])
  expect(holdsStems('The page was fixed today', stems)).toBe(true)
  expect(holdsStems('the page is broken', stems)).toBe(false)
})
