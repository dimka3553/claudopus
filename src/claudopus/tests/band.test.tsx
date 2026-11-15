// Above the prompt: everything that waits on the person, each with its answers, over the figures; the same as at the top of the panel

// The bar's answer buttons of one row, by their labels
const barLabels = async (band: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined; props: Record<string, unknown> }[]> }, row = '') =>
  (await band.findAll({ type: 'Button' })).filter(b => (b.key ?? '').startsWith(`bar-${row}`) && (b.key ?? '').includes('-answer-')).map(b => String(b.props.label ?? ''))
const barKey = async (band: Parameters<typeof barLabels>[0], label: string) =>
  String((await until(async () => (await band.findAll({ type: 'Button' })).find(b => (b.key ?? '').startsWith('bar-') && (b.key ?? '').includes('-answer-') && b.props.label === label)))?.key ?? '')
// The rows the bar draws, by their keys
const barRows = async (band: { findAll: (q: { type: string }) => Promise<readonly { key: string | undefined }[]> }) =>
  (await band.findAll({ type: 'Box' })).map(b => b.key ?? '').filter(key => /^bar-(ask|gate|box|there)-/.test(key) && !/-(line|command|open|copy|links)$/.test(key))

// A work's ask with three choices, in this chat's band and panel
const barAsk = async ($: Parameters<TestBody>[0], on: On) => {
  const s = await askScene($, on)
  await $.agent.spawn({ ...spawn, description: 'Pick the logo', prompt: 'pick the logo' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo goes on the site?', choices: ['The blue one', 'The green one', 'Neither'] } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await barLabels(band)).includes('Neither') ? true : undefined))
  const picked = () => s.appended.filter(line => line.startsWith('a2: ') && line.includes('in answer to your ask'))
  return { ...s, band, picked }
}

test('every ask waiting is in the bar above the prompt with its own answers, and stays in the panel too', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  // Newest first: the logo, then the release
  expect(await barRows(s.band)).toEqual([expect.stringMatching(/^bar-ask-a2-/), expect.stringMatching(/^bar-ask-a1-/)])
  expect(await barLabels(s.band)).toEqual(['The blue one', 'The green one', 'Neither', 'Release it', 'Not now'])
  expect(await s.band.find({ type: 'Text', text: 'Which logo goes on the site?' })).toBeDefined()
  expect(await s.band.find({ type: 'Text', text: /^Pick the logo · $/ })).toBeDefined()
  // No line that only points at the panel
  expect(await s.band.find({ type: 'Text', text: /at the top of the panel$/ })).toBeUndefined()
  expect((await s.list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Neither')).toHaveLength(1)
  await s.band.unmount()
})

test('a press in the bar answers once, turns its row green in place and shows answered in the panel in the same drawing', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  const green = await barKey(s.band, 'The green one')
  const neither = await barKey(s.band, 'Neither')
  const panelNeither = String((await s.list.findAll({ type: 'Button' })).find(b => b.props.label === 'Neither')?.key ?? '')
  const rowsBefore = await barRows(s.band)
  let free = () => undefined as void
  s.holdWrites(new Promise<void>(done => (free = done)))
  const pressing = s.band.press({ key: green })
  // Before the answer is written: the bar's row says it, green, where it was; the panel's card says it too, with nothing to press
  expect(await until(async () => s.band.find({ type: 'Text', text: '✓ You answered “The green one” · on its way to the work' }))).toBeDefined()
  expect(await s.list.find({ type: 'Text', text: '✓ You answered “The green one” · on its way to the work' })).toBeDefined()
  expect((await s.list.findAll({ type: 'Button' })).some(b => b.props.label === 'Neither')).toBe(false)
  expect(await barLabels(s.band)).toEqual(['Release it', 'Not now'])
  expect(await barRows(s.band)).toEqual(rowsBefore)
  // A second press, in the bar or in the panel, on the drawing a moment old, sends nothing
  await s.band.press({ key: neither }).catch(() => undefined)
  if (panelNeither) await s.list.press({ key: panelNeither }).catch(() => undefined)
  s.freeWrites()
  free()
  await pressing
  expect(await until(async () => (s.picked().length ? s.picked() : undefined))).toHaveLength(1)
  await new Promise<void>(done => setTimeout(done, 50))
  expect(s.picked()).toHaveLength(1)
  expect(s.picked()[0]).toContain('pressed "The green one"')
  // The release's ask was not touched
  expect(s.answers()).toEqual([])
  // A moment later the green row leaves the bar; the panel's card still says it
  await s.clock.advance(5100)
  expect(await until(async () => ((await barRows(s.band)).length === 1 ? true : undefined))).toBe(true)
  expect(await s.list.find({ type: 'Text', text: /^✓ You answered “The green one”/ })).toBeDefined()
  await s.band.unmount()
})

test('a press in the panel shows in the bar at once: the row green, its answers gone', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  const panelNeither = String((await s.list.findAll({ type: 'Button' })).find(b => b.props.label === 'Neither')?.key ?? '')
  let free = () => undefined as void
  s.holdWrites(new Promise<void>(done => (free = done)))
  const pressing = s.list.press({ key: panelNeither })
  expect(await until(async () => s.band.find({ type: 'Text', text: '✓ You answered “Neither” · on its way to the work' }))).toBeDefined()
  expect(await barLabels(s.band)).toEqual(['Release it', 'Not now'])
  s.freeWrites()
  free()
  await pressing
  expect(await until(async () => (s.picked().length ? s.picked() : undefined))).toHaveLength(1)
  await s.band.unmount()
})

test('an answer from the bar that could not be written says so in its row and puts its answers back; pressed again it goes', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  const rowsBefore = await barRows(s.band)
  s.failWrites(1000)
  await s.band.press({ key: await barKey(s.band, 'Neither') }).catch(() => undefined)
  expect(await until(async () => s.band.find({ type: 'Text', text: 'Pick the logo · not sent, press it again · ' }))).toBeDefined()
  expect(await barLabels(s.band, 'ask-a2')).toEqual(['The blue one', 'The green one', 'Neither'])
  expect(await barRows(s.band)).toEqual(rowsBefore)
  expect(s.picked()).toEqual([])
  s.failWrites(0)
  await s.band.press({ key: await barKey(s.band, 'Neither') })
  expect(await until(async () => (s.picked().length ? s.picked() : undefined))).toHaveLength(1)
  await s.band.unmount()
})

test('an ask that wants words opens in its row to its whole text, what it is about, and a box to reply in', SLOW, async ($, on) => {
  const s = await askScene($, on)
  await $.agent.spawn({ ...spawn, description: 'Name the app', prompt: 'name the app' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'What should the app be called?', details: 'It goes on the store page and the icon.' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const more = await until(async () => (await band.findAll({ type: 'Button' })).find(b => /^bar-ask-a2-.*-more$/.test(b.key ?? '')))
  expect(await band.find({ type: 'Input' })).toBeUndefined()
  await band.press({ key: String(more?.key) })
  expect(await until(async () => band.find({ type: 'Text', text: 'It goes on the store page and the icon.' }))).toBeDefined()
  const box = await until(async () => band.find({ type: 'Input' }))
  expect(box).toBeDefined()
  await band.input({ key: String(box?.key), text: 'Octo' } as never)
  expect(await until(async () => (s.appended.some(line => line.startsWith('a2: ') && line.includes('Octo')) ? true : undefined))).toBe(true)
  await band.unmount()
})

test('an admin command waits in the bar with Allow once, Always allow and Deny; a press there is the one answer, shown in the panel', SLOW, async ($, on) => {
  const w = await gated($, on)
  const call = w.bash('p1', `${ADMIN} here 'chmod 644 /etc/hosts'`)
  expect(await w.held('p1')).toBeDefined()
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await barLabels(band)).length ? barLabels(band) : undefined))).toEqual(['Allow once', 'Always allow', 'Deny'])
  // The command whole, as on its box
  const shown = (await w.list.findAll({ type: 'Text' })).find(t => t.props.mono && /chmod 644/.test(String(t.text)))?.text
  expect(shown).toBeDefined()
  expect(await band.find({ type: 'Text', text: String(shown) })).toBeDefined()
  const rowsBefore = await barRows(band)
  const deny = await barKey(band, 'Deny')
  await band.press({ key: await barKey(band, 'Allow once') })
  // In the press's own drawing: green in the bar, the same row; answered in the panel, nothing left to press there
  expect(await band.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeDefined()
  expect(await barRows(band)).toEqual(rowsBefore)
  expect(await barLabels(band)).toEqual([])
  expect(await w.list.find({ type: 'Text', text: 'You allowed it once · it runs now' })).toBeDefined()
  expect((await w.list.findAll({ type: 'Button' })).some(b => (b.key ?? '').startsWith('gate-p1-'))).toBe(false)
  // A press on the bar's Deny a moment old changes nothing
  await band.press({ key: deny }).catch(() => undefined)
  w.wake()
  const r = (await call) as { deny?: string }
  expect(r.deny).toBeUndefined()
  expect(await w.list.find({ type: 'Text', text: /^You denied it/ })).toBeUndefined()
  await band.unmount()
})

test('an admin command too long to show in a row is never allowed from the bar unseen: only Deny, until its row is opened to the whole', SLOW, async ($, on) => {
  const w = await gated($, on)
  const long = `${ADMIN} here 'chmod 644 /etc/hosts ${'&& true '.repeat(40)}&& rm -rf /tmp/x'`
  const call = w.bash('p2', long)
  expect(await w.held('p2')).toBeDefined()
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await barLabels(band)).length ? barLabels(band) : undefined))).toEqual(['Deny'])
  const whole = String((await w.list.findAll({ type: 'Text' })).find(t => t.props.mono && /rm -rf/.test(String(t.text)))?.text)
  expect(whole.length).toBeGreaterThan(240)
  expect(await band.find({ type: 'Text', text: whole })).toBeUndefined()
  await band.press({ key: String((await band.findAll({ type: 'Button' })).find(b => /^bar-gate-.*-more$/.test(b.key ?? ''))?.key) })
  expect(await until(async () => band.find({ type: 'Text', text: whole }))).toBeDefined()
  expect(await barLabels(band)).toEqual(['Allow once', 'Always allow', 'Deny'])
  await band.press({ key: await barKey(band, 'Deny') })
  w.wake()
  expect(((await call) as { deny?: string }).deny).toBeDefined()
  await band.unmount()
})

test('nothing waiting leaves no row: at rest the bar is the engine’s own, and with work running it is the figures alone', SLOW, async ($, on) => {
  const s = await askScene($, on)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  await until(async () => ((await barRows(band)).length ? true : undefined))
  await s.list.press({ key: await s.key('Release it') })
  await s.clock.advance(5100)
  // Work still runs: no row and no box for rows, only the figures' line
  expect(await until(async () => ((await barRows(band)).length === 0 ? true : undefined))).toBe(true)
  expect((await band.findAll({ type: 'Box' })).some(b => b.key === 'bar-waits')).toBe(false)
  expect((await band.findAll({ type: 'Box' })).some(b => b.key === 'band-row')).toBe(true)
  await band.unmount()
})

test('five things waiting: three rows and "and 2 more", which opens the rest; the height is capped', SLOW, async ($, on) => {
  const w = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'go', wait: false, origin: composer })
  for (let n = 1; n <= 5; n++) {
    await $.agent.spawn({ ...spawn, description: `Job ${n}`, prompt: `job ${n}` } as never)
    await w.clock.advance(10)
    await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: `q${n}`, agentId: `a${n}`, text: `Question ${n}?`, choices: ['Yes', 'No'] } as never)
  }
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await until(async () => ((await barRows(band)).length === 3 ? barRows(band) : undefined))).toEqual([expect.stringMatching(/^bar-ask-a5-/), expect.stringMatching(/^bar-ask-a4-/), expect.stringMatching(/^bar-ask-a3-/)])
  expect(await band.find({ type: 'Text', text: 'and 2 more waiting' })).toBeDefined()
  await band.press({ key: 'bar-waits-all' })
  expect(await until(async () => ((await barRows(band)).length === 5 ? true : undefined))).toBe(true)
  // In a terminal of few rows, fewer rows, never more than its band can show above the prompt
  const term = await $.ui.mount({ ...BAND, props: { ...BAND.props, maxRows: 6, scroll: { offset: 0, bodyRows: 6 } }, surface: 'terminal' } as never)
  await band.press({ key: 'bar-waits-fewer' }).catch(() => undefined)
  expect(await until(async () => ((await barRows(term)).length === 1 ? true : undefined))).toBe(true)
  expect(await term.find({ type: 'Text', text: /4 more waiting in the panel$/ })).toBeDefined()
  await Promise.all([band.unmount(), term.unmount()])
})

test('the chat does not move as the figures change or a row is answered: the rows above them keep their lines', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  const shape = async () => (await s.band.findAll({ type: 'Box' })).filter(b => /^bar-/.test(b.key ?? '')).map(b => b.key)
  const before = await shape()
  // The figures are looked at again: the rows stay as they were
  await s.clock.advance(6000)
  expect(await shape()).toEqual(before)
  await s.band.press({ key: await barKey(s.band, 'Neither') })
  expect(await until(async () => s.band.find({ type: 'Text', text: /^✓ You answered “Neither”/ }))).toBeDefined()
  expect(await shape()).toEqual(before)
  await s.band.unmount()
})

test('in the terminal every waiting thing is a line with its answers numbered on from row to row, the same number twice sending it', SLOW, async ($, on) => {
  const s = await barAsk($, on)
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)
  const hot = async () => (await term.findAll({ type: 'Button' })).filter(b => (b.key ?? '').includes('-answer-')).map(b => `${b.props.hotkey}:${b.props.label}`)
  expect(await until(async () => ((await hot()).length === 5 ? hot() : undefined))).toEqual(['1:The blue one', '2:The green one', '3:Neither', '4:Release it', '5:Not now'])
  const four = String((await term.findAll({ type: 'Button' })).find(b => b.props.hotkey === '4')?.key)
  await term.press({ key: four })
  expect(await until(async () => term.find({ type: 'Text', text: 'Press 4 again to answer “Release it”' }))).toBeDefined()
  expect(s.answers()).toEqual([])
  await term.press({ key: String((await term.findAll({ type: 'Button' })).find(b => b.props.hotkey === '4')?.key) })
  expect(await until(async () => (s.answers().length ? s.answers() : undefined))).toHaveLength(1)
  expect(s.picked()).toEqual([])
  await term.unmount()
})
