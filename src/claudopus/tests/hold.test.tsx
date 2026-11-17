// Claude's helper is never held: the engine switches off an add-on that keeps its shared helper from answering for five seconds.
// Each heavy step is run on records as large as a long chat's, with a timer of the test's own that should fire every 5 ms: the
// longest it waited is how long the mod held the helper

// The longest a step may hold it here: a fifth of the engine's limit, as GitHub's runners are about twice as slow as a Mac
const HOLD_MOST = 1000
const holdMeter = () => {
  let worst = 0
  let last = Date.now()
  let isDone = false
  const tick = () => {
    const now = Date.now()
    worst = Math.max(worst, now - last)
    last = now
    if (!isDone) setTimeout(tick, 5)
  }
  setTimeout(tick, 5)
  return () => ((isDone = true), worst)
}
// One task's record as the engine saves it: rows of about `size` characters, each a step with what came back, to-dos and notes
const recordOf = (size: number) => {
  const rows: string[] = []
  let length = 0
  for (let k = 0; length < size; k++) {
    const at = `2026-11-16T${String(10 + Math.floor(k / 3600) % 14).padStart(2, '0')}:${String(Math.floor(k / 60) % 60).padStart(2, '0')}:${String(k % 60).padStart(2, '0')}Z`
    const row =
      k % 3 === 0
        ? JSON.stringify({ timestamp: at, type: 'assistant', message: { model: 'claude-opus-5-5', usage: { input_tokens: 10, output_tokens: 5 }, content: [{ type: 'tool_use', name: 'mcp__claudopus__todo', input: { item: `Step ${k % 40}`, state: 'done' } }, { type: 'tool_use', name: 'mcp__claudopus__note', input: { text: `Done step ${k}` } }] } })
        : JSON.stringify({ timestamp: at, type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: `u${k}`, content: 'x'.repeat(4000) }] } })
    rows.push(row)
    length += row.length + 1
  }
  return rows.join('\n')
}

// A long hold by the mod comes back each time; one by a busy machine (the areas' tests run side by side) does not: a step is
// measured up to three times, on fresh records, and its least counts
const TRIES = 3

test('a chat whose ended tasks have records of 4 MB and 170 MB loads without holding Claude\'s helper', { timeoutMs: 180_000 }, async ($, on) => {
  const { files } = world(on)
  const folder = `${HOME}/.claude/projects/-repo/engine-id/subagents`
  // Forty ended tasks just under what the engine gives whole, and two far over it, as the 16 Nov chat had (169 MB)
  const near = recordOf(4_100_000)
  // (one over the 4 MB the engine gives whole takes the same way at any size: its end is read, so twice that stands for 170 MB here,
  // and the areas' tests running beside this one are not slowed by a string of that size)
  const huge = near.repeat(2)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  let least = Infinity
  for (let round = 0; round < TRIES && least >= HOLD_MOST; round++) {
    // Each load reads back the newest forty it has no card for: a round's are newer than the last's
    for (let k = 0; k < 42; k++) {
      files.set(`${folder}/agent-r${round}x${k}.meta.json`, JSON.stringify({ description: `Old work ${round} ${k}`, spawnDepth: 1, finished: true }))
      files.set(`${folder}/agent-r${round}x${k}.jsonl`, k < 2 ? huge : near)
      files.set(`mtime:${folder}/agent-r${round}x${k}.jsonl`, String(1_700_000_000_000 + round * 1000 - k))
    }
    const held = holdMeter()
    await $.session.start(start)
    // read back whole, the newest forty of this round's: their fold opened, the newest listed
    const fold = await until(async () => (await pane.findAll({ type: 'Button' })).find(b => /^▸ Finished 40$/.test(String(b.props.label))))
    least = Math.min(least, held())
    if (fold) await pane.press({ key: String(fold.key) })
    expect(await until(async () => (JSON.stringify(await pane.drawn()).includes(`Old work ${round} 2`) ? 'listed' : undefined))).toBe('listed')
  }
  expect(least).toBeLessThan(HOLD_MOST)
  await pane.unmount()
})

test('behind, the mod gives its panes as they were and leaves out what can wait until it has caught up, then draws them again; a long hold is logged with its chat and the steps begun then', async ($, on) => {
  const { files, clock } = world(on, { env: { CLAUDOPUS_TIMING: 'real' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'Fix the nose.' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await clock.advance(1000)
  // A note drawn afresh just before
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'Looked at the nose' } as never)
  await pane.redraw()
  const before = JSON.stringify(await pane.drawn())
  expect(before).toContain('Looked at the nose')
  // The helper held 1.8 s, by the clock on the wall, between two of the mod's looks
  const end = Date.now() + 1800
  while (Date.now() < end) Math.sqrt(Date.now())
  await clock.advance(250)
  expect(await until(async () => (files.get(`${MEMORY}/log.md`) ?? '').match(/Claude's helper was held (\d+) ms in chat engine-id; steps begun then: [^\n]*draw the panel/)?.[0])).toBeDefined()
  // A note that would change the card: the pane is given as it was while behind
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Measured the nose' } as never)
  await pane.redraw()
  expect(JSON.stringify(await pane.drawn())).toBe(before)
  // Caught up (ten seconds of looks on time), it draws again by itself
  for (let k = 0; k < 44; k++) await clock.advance(250)
  expect(await until(async () => (await pane.find({ type: 'Text', text: /Measured the nose/ }))?.text)).toContain('Measured the nose')
  await pane.unmount()
})
