import { expect, test } from 'claude-code/testing'

import { answerJson, applyProgress, areasFrom, asideLines, chatEventOf, entriesFrom, pictureOf, progressPrompt, progressThumb, withSetAside, wordsIn } from './progress'
import type { ProgressArea, ProgressEntry, ProgressEvent, ProgressPicture } from './progress'

const REPORTS = '/home/sam/.claude/claudopus/reports'
const NOW = Date.parse('2026-11-20T12:00:00Z')
const picture: ProgressPicture = { star: { text: 'Make heads people love', said: '2026-11-10' }, goals: [{ id: 'heads', name: 'Better heads', words: 'heads that look real', said: '2026-11-10' }], updated: '2026-11-10T00:00:00.000Z' }
const areas = (): ProgressArea[] => [
  { id: 'nose', name: 'Nose', goal: 'heads', aim: 'A nose that fits every face', next: [{ id: 'n1', text: 'A nose that fits side faces', state: 'open', at: '' }, { id: 'n2', text: 'A nose that moves with the mouth', state: 'open', at: '' }], updated: '' },
  { id: 'site', name: 'Website', goal: '', aim: 'The home page', next: [], updated: '' },
]
const entry = (over: Partial<ProgressEntry>): ProgressEntry => ({ task: '', title: 'A task', at: '2026-11-19T10:00:00.000Z', kind: 'task', outcome: '', report: '', pictures: [], live: '', reason: '', ...over })
const event = (over: Partial<ProgressEvent>): ProgressEvent => ({ kind: 'result', at: NOW - 60_000, chat: 'c1', text: 'done', ...over })
const apply = (e: ProgressEvent, answer: Record<string, unknown>, entries = new Map<string, ProgressEntry[]>(), given = areas()) => {
  const done = applyProgress(e, answer, picture, given, entries, NOW, REPORTS, 'Sam')
  return { ...done, entries }
}

test("a task's start gives it its area at once, and its result takes that entry's place there, with only its own pictures, in plain words, the start's wrong guess gone", async () => {
  const entries = new Map<string, ProgressEntry[]>()
  const started = apply(event({ kind: 'start', task: 'a1', title: 'Fix the nose' }), { areas: ['nose', 'site'], entry: { title: 'Fix the nose' } }, entries)
  expect(entries.get('nose')?.map(e => [e.task, e.title, e.report])).toEqual([['a1', 'Fix the nose', '']])
  expect(entries.get('site')?.length).toBe(1)
  const answer = {
    areas: ['nose'],
    entry: { title: 'Fixed the nose in `register.tsx` for v0.2.10 and more words here', kind: 'milestone', outcome: 'The nose now fits side faces', live: 'not a link', pictures: ['a.png', '/etc/passwd', `${REPORTS}/r1/b.png`] },
    next: { done: ['n1'] },
  }
  const done = apply(event({ kind: 'result', task: 'a1', report: 'r1', files: ['a.png', 'b.png'] }), answer, entries, started.areas)
  const [kept] = entries.get('nose') ?? []
  expect(kept).toEqual({ task: 'a1', title: 'Fixed the nose in for and more words', at: new Date(NOW - 60_000).toISOString(), kind: 'milestone', outcome: 'The nose now fits side faces', report: 'r1', pictures: [`${REPORTS}/r1/a.png`, `${REPORTS}/r1/b.png`], live: '', reason: '' })
  expect(entries.get('nose')?.length).toBe(1)
  expect(entries.get('site')).toEqual([])
  // (Progress keeps no next steps: an answer that names some changes none of those an area still holds)
  expect(done.areas[0]?.next.map(n => n.state)).toEqual(['open', 'open'])
  // (the task's following result is an entry of its own beside the first)
  const again = apply(event({ kind: 'result', task: 'a1', report: 'r2', isEntryOnly: true }), { entry: { title: 'Nose checked on ten more faces', kind: 'milestone' }, next: { done: ['n2'] } }, entries, done.areas)
  expect(entries.get('nose')?.map(e => e.report).sort()).toEqual(['r1', 'r2'])
  apply(event({ kind: 'result', task: 'a1', report: 'r2' }), { areas: ['nose'], entry: { title: 'Nose checked on ten more faces', kind: 'milestone' } }, entries, again.areas)
  expect(entries.get('nose')?.length).toBe(2)
  expect(progressThumb(REPORTS, `${REPORTS}/r1/shots/a.png`)).toBe(`${REPORTS}/r1/thumbs/shots--a.png.jpg`)
})

test('only the person sets work aside, renames or merges: a result or a start that says so changes none of it, their words, answer or press do', async () => {
  const say = { areas: ['nose'], aside: { task: 'a1', reason: 'Not needed now' }, rename: [{ id: 'site', name: 'Home page' }], merge: [{ from: 'site', into: 'nose' }] }
  for (const kind of ['result', 'start'] as const) {
    const entries = new Map([['nose', [entry({ task: 'a1' })]]])
    const done = apply(event({ kind, task: kind === 'start' ? 'a9' : 'a1', report: 'r2' }), say, entries)
    expect(done.areas.map(a => a.name)).toEqual(['Nose', 'Website'])
    expect((entries.get('nose') ?? []).some(e => e.kind === 'aside')).toBe(false)
  }
  for (const kind of ['said', 'answer'] as const) {
    const entries = new Map([['nose', [entry({ task: 'a1' })]], ['site', [entry({ task: 'a3' })]]])
    const done = apply(event({ kind, text: 'drop the nose moving, not needed now' }), say, entries)
    expect(done.areas.map(a => a.id)).toEqual(['nose'])
    expect(entries.get('nose')?.map(e => [e.task, e.kind, e.reason])).toEqual([['a1', 'aside', 'Not needed now'], ['a3', 'task', '']])
  }
  // The press: the task's entry set aside with no reason of the model's, and its later result stays set aside
  const entries = new Map([['nose', [entry({ task: 'a1' })]]])
  apply(event({ kind: 'aside', task: 'a1' }), { areas: ['nose'] }, entries)
  expect(entries.get('nose')?.map(e => [e.kind, e.reason])).toEqual([['aside', 'Sam set it aside']])
  apply(event({ kind: 'result', task: 'a1', report: 'r3' }), { areas: ['nose'], entry: { title: 'Half a nose', kind: 'milestone' } }, entries)
  expect(entries.get('nose')?.map(e => [e.kind, e.reason, e.report])).toEqual([['aside', 'Sam set it aside', 'r3']])
  // A press on a task with no entry yet makes one, set aside
  const fresh = new Map<string, ProgressEntry[]>()
  apply(event({ kind: 'aside', task: 'a5', title: 'Render the song' }), { areas: ['site'] }, fresh)
  expect(fresh.get('site')?.map(e => [e.task, e.title, e.kind])).toEqual([['a5', 'Render the song', 'aside']])
})

test('a new area is made only once for a new direction, under a goal that exists', async () => {
  const entries = new Map<string, ProgressEntry[]>()
  const first = apply(event({ kind: 'start', task: 'a1' }), { newArea: { name: 'Song stills', goal: 'nope', aim: 'Stills for the song' } }, entries)
  expect(first.areas.at(-1)).toMatchObject({ id: 'song-stills', name: 'Song stills', goal: '', aim: 'Stills for the song' })
  const again = apply(event({ kind: 'start', task: 'a2' }), { newArea: { name: 'song  stills', goal: 'heads' } }, entries, first.areas)
  expect(again.areas.filter(a => a.id.startsWith('song')).length).toBe(1)
  expect(entries.get('song-stills')?.map(e => e.task)).toEqual(['a2', 'a1'])
})

test('the files read back whole whatever was written, the model is shown each area with its newest entries and no next steps, and its answer is read out of the text around it', async () => {
  expect(areasFrom('not json')).toEqual([])
  expect(areasFrom(JSON.stringify({ areas: [{ id: '../x', name: 'Bad' }, { id: 'ok', name: 'Ok', next: [{ id: 'n', text: 'A', state: 'weird' }, { id: 'm' }] }] }))).toEqual([{ id: 'ok', name: 'Ok', goal: '', aim: '', next: [{ id: 'n', text: 'A', state: 'open', at: '' }], updated: '' }])
  expect(entriesFrom(JSON.stringify({ entries: [entry({ title: 'old', at: '2026-11-01' }), { title: '' }, entry({ title: 'new', at: '2026-11-02', kind: 'odd' as never })] })).map(e => [e.title, e.kind])).toEqual([['new', 'task'], ['old', 'task']])
  expect(answerJson('Here it is:\n```json\n{"areas": ["nose"]}\n```')).toEqual({ areas: ['nose'] })
  expect(answerJson('no')).toBe(undefined)
  const prompt = progressPrompt(event({ kind: 'answer', task: 'a1', title: 'Fix the nose', text: 'Question: Ship it?\nAnswer: Yes' }), picture, areas(), new Map([['nose', [entry({ task: 'a1', title: 'Fixed it' })]]]), NOW)
  expect(prompt).toContain('- nose: Nose (goal heads) · A nose that fits every face\n  Newest entries:\n    - 2026-11-19 task (task a1): Fixed it')
  expect(prompt).not.toMatch(/next step/i)
  expect(prompt).toContain('This task is already in: nose')
  expect(prompt).toContain('Answer: Yes')
  expect(withSetAside(['Release it'])).toEqual(['Release it', 'Set aside'])
  expect(withSetAside(['set aside'])).toEqual(['set aside'])
})

test('the picture is made only from the person\'s own messages, and a task is told only what was set aside in the area its words share', async () => {
  const words = `## 2026-11-18T09:00:00.000Z\nI want heads people love\n\n### Claude 2026-11-18T09:00:05.000Z\nSure\n\n## 2026-11-18T10:00:00.000Z (sent by a program)\nbuild ok\n\n## 2026-11-19T10:00:00.000Z (from the phone)\nand the song too\n\n## 2026-11-01T10:00:00.000Z\ntoo old\n`
  expect(wordsIn(words, Date.parse('2026-11-10'))).toEqual([{ at: '2026-11-18T09:00:00.000Z', text: 'I want heads people love' }, { at: '2026-11-19T10:00:00.000Z', text: 'and the song too' }])
  expect(pictureOf({ star: { text: 'Heads people love', said: '2026-11-18' }, goals: [{ id: 'Heads!', name: 'Heads' }, { id: 'heads', name: 'Again' }, { name: '' }] }, NOW)).toEqual({ star: { text: 'Heads people love', said: '2026-11-18' }, goals: [{ id: 'heads', name: 'Heads', words: '', said: '' }], updated: new Date(NOW).toISOString() })
  expect(pictureOf({ goals: [] }, NOW)).toBe(undefined)
  const entries = new Map([['nose', [entry({ task: 'a1', title: 'Nose for side faces', kind: 'aside', reason: 'Not needed now' })]], ['site', [entry({ task: 'a2', title: 'Hero video', kind: 'aside', reason: 'Too slow' })]]])
  expect(asideLines('Fix the nose', 'The nose on side faces looks wrong', areas(), entries)).toEqual(['- In Nose: "Nose for side faces" (2026-11-19), set aside: Not needed now'])
  expect(asideLines('Render the song', 'Stills for it', areas(), entries)).toEqual([])
})

test('a chat from before Claudopus came in is read from its saved words into one piece of work in its area, dated by its first message, and changes no next step', async () => {
  const words = `## 2026-09-20T09:00:00.000Z\nMake the nose fit side faces\n\n### Claude 2026-09-20T09:05:00.000Z\nLooking\n\n## 2026-09-21T10:00:00.000Z (from the phone)\nand the chin\n\n### Claude 2026-09-21T10:30:00.000Z\nThe nose and chin now fit side faces.\n`
  const one = chatEventOf('c-old', words, Date.parse('2026-11-11'))
  expect(one).toEqual({ kind: 'chat', at: Date.parse('2026-09-20T09:00:00.000Z'), chat: 'c-old', task: 'chat-c-old', title: 'Make the nose fit side faces', text: '- Make the nose fit side faces\n- and the chin\n\nLast reply: The nose and chin now fit side faces.', isBackfill: true })
  // A chat begun since Claudopus came in has results of its own, and one with no message of the person's is nothing
  expect(chatEventOf('c-new', words, Date.parse('2026-09-01'))).toBe(undefined)
  expect(chatEventOf('c-none', '### Claude 2026-09-20T09:05:00.000Z\nHello\n', Date.parse('2026-11-11'))).toBe(undefined)
  expect(progressPrompt(one as ProgressEvent, picture, areas(), new Map(), NOW)).toContain('A chat from before Claudopus came in, titled "Make the nose fit side faces"')
  const entries = new Map<string, ProgressEntry[]>()
  const done = apply(one as ProgressEvent, { areas: ['nose'], entry: { title: 'Nose and chin fit side faces', kind: 'milestone' }, next: { done: ['n1'], add: ['A chin that fits'], reword: [{ id: 'n2', text: 'Moves' }] } }, entries)
  expect(entries.get('nose')?.map(e => [e.task, e.title, e.kind, e.at])).toEqual([['chat-c-old', 'Nose and chin fit side faces', 'milestone', '2026-09-20T09:00:00.000Z']])
  expect(done.areas[0]?.next.map(n => [n.text, n.state])).toEqual([['A nose that fits side faces', 'open'], ['A nose that moves with the mouth', 'open']])
})
