// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text

test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', async ($, on) => {
  const { clock, held, logged } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'One merger for all pushes', prompt: 'one merger' } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work ONE releasing', prompt: 'one', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Trial work TWO releasing', prompt: 'two', parentAgentId: 'a1', resume: { agentId: 'h2' } } as never)
  const bash = (agentId: string, command: string, id: string) => $.tool.call({ tool: 'Bash', tool_use_id: id, agentId, command } as never)
  const look = async <T,>(fn: (pane: { find: (q: object) => Promise<{ text?: string; props: Record<string, unknown> } | undefined>; findAll: (q: object) => Promise<unknown[]> }) => Promise<T>) => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const r = await fn(pane as never)
    await pane.unmount()
    return r
  }
  const stuck = () => look(pane => pane.find({ type: 'Text', text: /^Nothing new for / }))

  // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
  await bash('a1', 'git log', 'p1')
  await bash('h1', 'git status', 'b1')
  await bash('h2', 'git status', 'b2')
  await clock.advance(11 * 60_000)
  expect(await stuck()).toBeUndefined()
  await clock.advance(2 * 60_000)
  expect((await stuck())?.props.color).toBe('#E5A50A')
  expect((await stuck())?.text).toMatch(/^Nothing new for 1[23] min\.$/)
  expect(logged.filter(line => line.includes('"One merger for all pushes" has had nothing new'))).toHaveLength(1)
  // Looked at again, nothing more is said
  await clock.advance(60_000)
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(1)

  // Something new comes back: the flag goes at the next look
  void bash('h1', 'hold release', 'b3')
  const letRelease = await until(async () => held.get('release'))
  letRelease?.('released Thing 0.1.1')
  expect(await stuck()).toBeDefined()
  await clock.advance(25_000)
  expect(await stuck()).toBeUndefined()
  // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
  void bash('h1', 'hold poll', 'b4')
  const letPoll = await until(async () => held.get('poll'))
  letPoll?.('released Thing 0.1.7')
  await clock.advance(13 * 60_000)
  expect(await stuck()).toBeDefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(2)
})

test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', async ($, on) => {
  const { clock, held } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Lay out the rows', prompt: 'lay out' } as never)
  await $.agent.spawn({ ...spawn, description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } } as never)
  void $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' } as never)
  const rows = async () => {
    const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
    const r = (await pane.findAll({ type: 'Text', text: / running · / })).map(one => one.text)
    await pane.unmount()
    return r
  }
  await clock.advance(90_000)
  expect(await rows()).toEqual([])
  await clock.advance(70_000)
  expect(await rows()).toEqual(['one command running · 2m 40s'])
  const letSearch = await until(async () => held.get('search'))
  letSearch?.('found it')
  await clock.advance(1_000)
  expect(await rows()).toEqual([])
})

test('work asking the person something waits on them and is never flagged', async ($, on) => {
  const { clock, logged } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Release it', prompt: 'release it' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] } as never)
  await clock.advance(30 * 60_000)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for / })).toBeUndefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(0)
  await pane.unmount()
})

test('the log is added to, never rewritten whole, and the empty bytes earlier versions left in it are taken out', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/log.md`, `2026-01-01T00:00:00.000Z start one\u0000\u0000\u00002026-01-01T00:00:01.000Z start two\n`)
  await $.session.start(start)
  const text = files.get(`${MEMORY}/log.md`) ?? ''
  expect(text).not.toContain('\u0000')
  expect(text.startsWith('2026-01-01T00:00:00.000Z start one2026-01-01T00:00:01.000Z start two\n')).toBe(true)
  expect(text).toMatch(/Z start engine-id in \/repo\n$/)
})
