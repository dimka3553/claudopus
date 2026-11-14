// Work that runs its helpers beside it: a helper runs in the background, the work waits for it only when it has nothing else, is
// held back from ending while one runs, is told at the step when it could have sent calls together, and is told of a quiet helper

// One step of an agent as the engine reports it after its calls ended
const batch = ($: unknown, agent: string, calls: { tool: string; input?: object; id?: string }[]) =>
  ($ as unknown as { classic: { PostToolBatch: (e: object) => Promise<{ additionalContext?: string[] }> } }).classic.PostToolBatch({
    hook_event_name: 'PostToolBatch',
    agent_id: agent,
    tool_calls: calls.map((one, n) => ({ tool_name: one.tool, tool_input: one.input ?? {}, tool_use_id: one.id ?? `${agent}-${one.tool}-${n}` })),
  })
const toldOf = async (r: Promise<{ additionalContext?: string[] }>) => ((await r).additionalContext ?? []).join('\n')

test("a helper a piece of work starts runs in the background, while the chat's own work is started as it asked", async ($, on) => {
  const { backgrounds } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, background: false, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, background: false, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, background: false, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a2' } as never)
  expect(backgrounds).toEqual([false, true, true])
})

test('a step is told when it started a helper alone, held only to-dos, or made a commit with no second look started; one that sends calls together is told nothing', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }]))).toContain('started one helper and nothing else')
  // Sent with other calls, a helper is no line
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read' } }, { tool: 'Agent', input: { description: 'Draw' } }, { tool: 'mcp__claudopus__note' }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'mcp__claudopus__todo' }, { tool: 'mcp__claudopus__note' }]))).toContain('only to-do and note calls')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Nose"' } }]))).toContain('start them now')
  // Each kind of line is said at most twice to one agent
  await batch($, 'a1', [{ tool: 'Agent', input: { description: 'One more' } }])
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'And another' } }]))).toBe('')
  // A commit after a second look was started says nothing of it
  await $.agent.spawn({ ...spawn, prompt: 'fix the ears' } as never)
  await batch($, 'a2', [{ tool: 'Agent', input: { description: 'Second look at the ears' } }, { tool: 'Read', input: { file_path: '/repo/a' } }])
  expect(await toldOf(batch($, 'a2', [{ tool: 'Bash', input: { command: 'git -C /repo commit -m "Ears"' } }]))).toBe('')
  // The chat's own thread is never told
  expect(await toldOf(batch($, undefined as never, [{ tool: 'Agent' }]))).toBe('')
})

test('three single lookups in a row are told to go together or to a helper; two long runs of one kind in a row, to run side by side', SLOW, async ($, on) => {
  const { clock, held } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'rg nose /repo' } }]))).toBe('')
  expect(await toldOf(batch($, 'a1', [{ tool: 'Grep', input: { pattern: 'ear' } }]))).toContain('The last 3 steps each held one lookup')
  // A step of two lookups breaks the run
  await batch($, 'a1', [{ tool: 'Read' }, { tool: 'Read' }])
  expect(await toldOf(batch($, 'a1', [{ tool: 'Read' }]))).toBe('')
  // A long test run, then another of its kind, each alone in its step
  const run = async (id: string, command: string) => {
    const call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: `hold ${id}` } as never)
    await clock.advance(90_000)
    held.get(id)?.('ok')
    await call
    return toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command }, id }]))
  }
  expect(await run('t1', 'npm test -- nose')).toBe('')
  expect(await run('t2', 'npm test -- ears')).toContain('Two long runs of one kind (npm test)')
})

test('the work waits for its helpers with a command of its own: a file it waits on names the helpers running and how each is doing, and changes as one ends', async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock, files } = world(on, { agents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' } as never)
  const roll = () => files.get(`${MEMORY}/helpers/a1.txt`) ?? ''
  expect(roll().split('\n')[0]).toBe('running: a2,a3')
  expect(roll()).toContain('"Read the nose code" (a2): running')
  // Told once, as it starts them, that they run beside it and how it waits for them
  const told = await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))
  expect(told).toContain('Your helpers run in the background')
  expect(told).toMatch(/bin\/helpers' '\/home\/sam\/\.claude\/claudopus\/helpers\/a1\.txt'/)
  expect(await toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))).toBe('')
  // Five minutes with nothing new from either: the line names them as quiet, so a wait on it comes back
  await clock.advance(5 * 60_000)
  expect(roll().split('\n')[0]).toBe('running: a2,a3 quiet: a2,a3')
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(21_000)
  expect(roll().split('\n')[0]).toBe('running: a3 quiet: a3')
  expect(roll()).toContain('"Read the nose code" (a2): ended')
})

test('work that tries to end while a helper of its runs is held back, and lets go once it has ended', async ($, on) => {
  const agents: Record<string, string> = {}
  const { clock } = world(on, { agents })
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  const stop = () => ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })
  expect((await stop()).block).toContain('a helper still running in the background')
  const handback = await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' } as never)
  expect(String((handback as { deny?: unknown }).deny)).toContain('Do not finish yet')
  agents.a2 = 'completed'
  await $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' } as never)
  await clock.advance(20_000)
  expect((await stop()).block).toBeUndefined()
})

test('a helper quiet for five minutes is named to its work once, and the card says its helpers were looked in on', SLOW, async ($, on) => {
  const { clock, appended } = world(on)
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' } as never)
  await clock.advance(70_000)
  expect((await pane.find({ type: 'Text', text: /^1 helper running, looked in on/ }))?.text).toBeDefined()
  await clock.advance(5 * 60_000)
  expect(appended.filter(line => line.startsWith('a1: Your helper "Read the nose code" (a2) has shown nothing new'))).toHaveLength(1)
  expect((await pane.find({ type: 'Text', text: /1 quiet for 5\+ min/ }))?.text).toBeDefined()
  await clock.advance(3 * 60_000)
  expect(appended.filter(line => line.includes('has shown nothing new'))).toHaveLength(1)
})

test('a helper that already answered holds nothing, a report given lets the end go, and work stopped takes its running helpers with it', async ($, on) => {
  const agents: Record<string, string> = {}
  const { stopped } = world(on, { agents })
  on('classic.SubagentStop', () => ({}) as never)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix it' } as never)
  await $.agent.spawn({ ...spawn, description: 'Serve the page', prompt: 'serve', parentAgentId: 'a1' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' } as never)
  const stop = () => ($ as unknown as { classic: { SubagentStop: (e: object) => Promise<{ block?: string }> } }).classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })
  // The server helper answered and left its server running: it still works, but holds nothing; the other still does
  agents.a2 = 'waiting'
  await $.turn.complete({ answer: `The page is served on port 3100, and it keeps running for you to look at. ${'It shows the nose as drawn, at every size. '.repeat(14)}`, durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' } as never)
  expect((await stop()).block).toContain('a helper still running')
  // Stopped from its card or by the chat, the work's running helpers are stopped with it
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect(stopped).toEqual(expect.arrayContaining(['a1', 'a3']))
})
