// Work that goes on when the chat's process ends: what the keeper reads, the keeper started, cut-off work marked and started again

const KEEP_AT = `${MEMORY}/keep/engine-id`
const KEEP_NOW = 1_700_000_000_000
// What the last process of this chat left: the work it had at work, and when the keeper saw it end
const leftAtWork = (files: Map<string, string>, ids: string[], cutAt = KEEP_NOW - 60_000, pid = '4242') => {
  files.set(`${KEEP_AT}.json`, JSON.stringify({ count: ids.length, ids, title: 'Contest', pid, at: cutAt - 5_000 }))
  files.set(`${KEEP_AT}.state`, JSON.stringify({ cutAt, count: ids.length }))
}
const cardText = async ($: { ui: { mount: (q: never) => Promise<{ findAll: (q: object) => Promise<readonly { text?: string; props: Record<string, unknown> }[]>; unmount: () => Promise<void> }> } }, pattern: RegExp) => {
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const found = (await pane.findAll({ type: 'Text', text: pattern })).map(one => ({ text: one.text, color: one.props.color }))
  await pane.unmount()
  return found
}

test('what is at work is kept for the keeper, with the process that runs it, and a chat run from another Mac starts one', SLOW, async ($, on) => {
  const { files, clock } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  expect(files.get(`${MEMORY}/log.md`)).toContain('keeper started for engine-id')
  await $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Solve the cameras', prompt: 'solve' } as never)
  await clock.advance(21_000)
  expect(JSON.parse(files.get(`${KEEP_AT}.json`) ?? '{}')).toMatchObject({ count: 1, ids: ['a1'] })
  await $.turn.complete({ answer: 'Solved: all 158 frames placed, and the report is written with every number.'.repeat(4), durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(21_000)
  expect(JSON.parse(files.get(`${KEEP_AT}.json`) ?? '{}')).toMatchObject({ count: 0, ids: [] })
})

test('a chat this Mac runs itself, and the copy the keeper started, start no keeper', async ($, on) => {
  const { files } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1', CLAUDE_CODE_SESSION_KIND: 'bg' } })
  await $.session.start(start)
  expect(files.get(`${MEMORY}/log.md`) ?? '').not.toContain('keeper started')
})

test('work cut off as the process ended is started again with a message, its card says so, and the person is told', SLOW, async ($, on) => {
  const { files, clock, resumed, logged } = world(on)
  leftAtWork(files, ['a7', 'a8'])
  await $.session.start(start)
  // Nothing until Claude Code has had its moment to start what it starts itself
  expect(resumed).toEqual([])
  await clock.advance(31_000)
  expect(resumed.map(one => one.split(':')[0])).toEqual(['a7', 'a8'])
  expect(resumed[0]).toContain("this chat's process was ended at")
  expect(resumed[0]).toContain('not by')
  const lines = await cardText($ as never, /^Cut off at /)
  expect(lines).toHaveLength(2)
  expect(lines[0]?.text).toMatch(/^Cut off at \d\d:\d\d as the chat's process ended; going again since \d\d:\d\d\.$/)
  expect(logged.some(line => /^2 pieces of work were cut off at \d\d:\d\d and have been going again since \d\d:\d\d\.$/.test(line))).toBe(true)
  expect(files.get(`${MEMORY}/log.md`)).toContain('cut-off notice pushed')
  // The keeper's file says both are at work again
  expect(JSON.parse(files.get(`${KEEP_AT}.json`) ?? '{}')).toMatchObject({ count: 2 })
})

test('in the copy kept on this Mac, work Claude Code started again itself is only marked; one it could not is said in amber', SLOW, async ($, on) => {
  const { files, clock, resumed, logged } = world(on, { env: { CLAUDE_CODE_SESSION_KIND: 'bg' }, agents: { a7: 'running' }, kinds: { a7: 'general-purpose' }, unresumable: new Set(['a8']) })
  leftAtWork(files, ['a7', 'a8'])
  await $.session.start(start)
  await clock.advance(31_000)
  expect(resumed).toEqual([])
  const lines = await cardText($ as never, /^Cut off at /)
  const said = (end: string) => lines.find(one => one.text?.endsWith(end))
  expect(lines.map(one => one.text?.replace(/\d\d:\d\d/g, 'hh:mm')).sort()).toEqual([
    "Cut off at hh:mm as the chat's process ended; going again since hh:mm.",
    "Cut off at hh:mm as the chat's process ended; it could not be started again.",
  ])
  expect(said('could not be started again.')?.color).toBe('#E5A50A')
  expect(lines.find(one => one.text?.includes('going again'))?.color).toBeUndefined()
  expect(logged.some(line => line.includes('has been going on this Mac by itself') && line.includes('could not be started again'))).toBe(true)
})

test('a chat with no keeper starts nothing again, and a cut is taken up once, through a reload of the mod before it was done', SLOW, async ($, on) => {
  const { files, clock, resumed } = world(on)
  // Work left at work with no keeper to see its process end, as a chat quit on purpose days ago
  files.set(`${KEEP_AT}.json`, JSON.stringify({ count: 1, ids: ['a6'], title: 'Contest', pid: '4242', at: KEEP_NOW - 5_000 }))
  await $.session.start(start)
  await clock.advance(31_000)
  expect(resumed).toEqual([])
  // A cut the keeper saw, and a reload 10 s into the new process: each piece is sent one message, not two
  leftAtWork(files, ['a7'], KEEP_NOW + 31_000 - 60_000)
  await $.session.start(start)
  await clock.advance(10_000)
  await $.session.start(start)
  await clock.advance(31_000)
  expect(resumed.map(one => one.split(':')[0])).toEqual(['a7'])
  // Loaded again once it was done: nothing more
  await $.session.start(start)
  await clock.advance(31_000)
  expect(resumed).toHaveLength(1)
  // A day and more ago
  leftAtWork(files, ['a9'], KEEP_NOW - 25 * 3600_000)
  await $.session.start(start)
  await clock.advance(31_000)
  expect(resumed).toHaveLength(1)
})

test('the notice names each piece by its own title', SLOW, async ($, on) => {
  const { files, clock, logged } = world(on, { unresumable: new Set(['a8']) })
  const card = (id: string, title: string) => ({ id, parentId: '', isFork: false, tokens: 0, title, words: '', items: [], entries: [], answer: '', startedAt: KEEP_NOW - 600_000, endedAt: KEEP_NOW - 60_000, status: 'stopped' })
  // Kept in the order the other way round from the keeper's file
  files.set(`${MEMORY}/finished/engine-id.json`, JSON.stringify([card('a8', 'Train the splats'), card('a7', 'Solve the cameras')]))
  leftAtWork(files, ['a7', 'a8'])
  await $.session.start(start)
  await clock.advance(31_000)
  const said = logged.find(line => line.includes('was cut off at')) ?? ''
  expect(said).toMatch(/^"Solve the cameras" was cut off at \d\d:\d\d and has been going again since \d\d:\d\d\. "Train the splats" cut off at \d\d:\d\d could not be started again\.$/)
})

test('a turn ended by the lapsed sign-in of the app hands the chat to the keeper, its work counted as at work', SLOW, async ($, on) => {
  const { files } = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'train the splats', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Train the splats', prompt: 'train' } as never)
  // Another error is not a lapsed sign-in
  await $.turn.complete({ answer: 'API Error: 529 overloaded', durationMs: 1, isAborted: false, turnId: 't0', reason: 'error', agentId: 'a1' } as never)
  expect(files.has(`${KEEP_AT}.handover`)).toBe(false)
  const lapse = (turnId: string) => $.turn.complete({ answer: 'API Error: 401 {"type":"error","error":{"type":"authentication_error","message":"OAuth token has expired."}}', durationMs: 1, isAborted: false, turnId, reason: 'error', agentId: 'a1' } as never)
  // Once is no lapse; twice within minutes is
  await lapse('t1')
  expect(files.has(`${KEEP_AT}.handover`)).toBe(false)
  await lapse('t2')
  expect(files.has(`${KEEP_AT}.handover`)).toBe(true)
  expect(JSON.parse(files.get(`${KEEP_AT}.json`) ?? '{}')).toMatchObject({ ids: ['a1'] })
})
