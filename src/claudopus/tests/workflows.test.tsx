// Workflows: the blue card

// A workflow as its script's meta names it: two stages, the maker's and the checker's
const ROUNDS = `export const meta = {
  name: 'rounds',
  description: 'A maker builds it, a separate checker holds it to the bar',
  phases: [
    { title: 'Make', detail: 'the maker builds it', model: 'opus' },
    { title: 'Check', detail: 'the checker tests it against the bar', model: 'opus' },
  ],
}
phase('Make')`
const journal = (...lines: object[]) => lines.map(one => JSON.stringify(one)).join('\n')

test('a workflow the chat starts is one blue card: how many agents, its rounds as squares with the step being run, the last round checked, nothing cut at any width, and Details with each round and agent chat; ended, it is under Finished', async ($, on) => {
  const { files, tabs, clock, played, notified } = world(on, { panes: ['claudopus'], art: true })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the roman numerals right', wait: false, origin: composer })
  // The chat's own thread starts it: a workflow is delegation, as an agent is
  const call = await $.tool.call({ tool: 'Workflow', tool_use_id: 'w1', script: ROUNDS, args: { title: 'Roman numerals', task: 'Write to_roman.', bar: 'Every case holds.', folder: '/repo', cap: 3 } } as never)
  expect(call.deny).toBeUndefined()
  // Its agents belong to its card, each with the model it was asked for
  await $.agent.spawn({ ...spawn, description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 1 } } as never)
  await $.agent.spawn({ ...spawn, description: 'checker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 2 } } as never)
  await $.agent.spawn({ ...spawn, description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 3 } } as never)
  for await (const _ of $.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' })) void _
  files.set(
    '/t/wf_1/journal.jsonl',
    journal(
      { type: 'launched' },
      { type: 'started', agentId: 'a1', label: 'maker', phase: 'Make' },
      { type: 'result', agentId: 'a1', result: 'Wrote roman.py.' },
      { type: 'started', agentId: 'a2', label: 'checker', phase: 'Check' },
      { type: 'result', agentId: 'a2', result: { pass: false, why: 'to_roman(True) is not refused', findings: ['to_roman(True) returns I'] } },
      { type: 'started', agentId: 'a3', label: 'maker', phase: 'Make' },
    ),
  )
  // The maker's chat, as its transcript keeps it: what it was told and wrote, never its thinking
  files.set(
    '/t/wf_1/agent-a3.jsonl',
    journal(
      { type: 'user', message: { role: 'user', content: 'Fix what the checker found.' } },
      { type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'SECRET THOUGHT' }, { type: 'text', text: 'Booleans are refused now.' }] } },
    ),
  )
  await clock.advance(2000)

  let pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // One card for the run, none for its agents
  expect(await until(async () => pane.find({ type: 'Text', text: /^Roman numerals$/ }))).toBeDefined()
  expect(await keyed(pane, 'open-a1')).toBeUndefined()
  // Built as every card is: the title opens Details and Stop sits at its right end; where it stands, as a card's facts line says it
  expect(await keyed(pane, 'flow-open-wf_1')).toBeDefined()
  expect((await pane.find({ type: 'Button', key: 'flow-stop-wf_1' }))?.props.plain).toBe(true)
  expect(await pane.find({ type: 'Text', text: /^Opus 5\.5 · 3 agents · round 2 of 3 · \d+s$/ })).toBeDefined()
  // The bar it is held to, under it
  expect(await pane.find({ type: 'Text', text: /^Every case holds\.$/ })).toBeDefined()
  // A row per round up to the cap, each led by its own squares: round 1's make done and its check failed, round 2's make running
  // and its check not started, round 3 not run
  const alts = (await pane.findAll({ type: 'Svg' })).map(one => String(one.props.alt)).filter(alt => /^round \d/.test(alt))
  expect(alts).toEqual(['round 1: done, failed', 'round 2: running, waiting', 'round 3: waiting, waiting'])
  const first = (await pane.findAll({ type: 'Svg' })).find(one => one.props.alt === 'round 1: done, failed')
  expect(String(first?.props.source)).toContain('#E5534B')
  // What round 1's check found, with how many; who is at work in round 2, in blue beside the moving dots; round 3 runs if needed
  expect(await pane.find({ type: 'Text', text: /^1 found · to_roman\(True\) is not refused$/ })).toBeDefined()
  expect((await pane.find({ type: 'Text', text: /^Maker fixing what the check found$/ }))?.props.color).toBe('#4E93EF')
  expect((await pane.findAll({ type: 'Svg' })).some(one => one.props.alt === 'Working now' && String(one.props.source).includes('#4E93EF'))).toBe(true)
  expect(await pane.find({ type: 'Text', text: /^if needed$/ })).toBeDefined()
  // No boxed Details button and no round count at the bottom: the card's own parts say it
  expect((await pane.findAll({ type: 'Button' })).filter(one => one.props.label === 'Details')).toEqual([])
  // On a narrow panel the rounds keep their rows
  await pane.unmount()
  const narrow = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 16 }, surface: 'desktop' } as never)
  await until(async () => narrow.find({ type: 'Text', text: /^Roman numerals$/ }))
  expect(await narrow.find({ type: 'Text', text: /^Maker fixing what the check found$/ })).toBeDefined()
  await narrow.unmount()
  pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // A surface that draws no pictures has the squares as letters, a round's pair on its row
  const words = await $.ui.mount({ ...LIST, surface: 'terminal' } as never)
  await until(async () => words.find({ type: 'Text', text: /^Roman numerals$/ }))
  expect((await words.findAll({ type: 'Text', text: /^[■□]$/ })).map(one => one.text).join('')).toBe('■■■□□□')
  await words.unmount()
  expect(await pane.find({ type: 'Text', text: /^Working on 1 thing$/ })).toBeDefined()
  // Kept in a file of its own, for the chat that started this session
  expect(JSON.parse(files.get(`${MEMORY}/flows/wf_1.json`) ?? '{}').session).toBe('local_1')

  // Details: a tab of its own in front, with its stages, its rounds and the maker's chat
  await pressed(pane, 'flow-open-wf_1')
  expect(await until(async () => tabs.includes('flow-wf_1: Roman numerals') || undefined)).toBe(true)
  const tab = await $.ui.mount({ ...LIST, requestId: 'flow-wf_1', surface: 'desktop' } as never)
  expect(await tab.find({ type: 'Text', text: /^the checker tests it against the bar · Opus 5.5 · 1 agent$/ })).toBeDefined()
  expect(await tab.find({ type: 'Text', text: /^Round 1: failed: to_roman\(True\) is not refused$/ })).toBeDefined()
  // Each failed round lists what the checker found, and each round has its own squares
  expect(await tab.find({ type: 'Text', text: /^– to_roman\(True\) returns I$/ })).toBeDefined()
  expect((await tab.findAll({ type: 'Svg' })).map(one => one.props.alt)).toEqual(['round 1: done, failed; round 2: running, waiting', 'round 1: done, failed', 'round 2: running, waiting'])
  expect(await tab.find({ type: 'Text', text: /^Conversation of the maker, round 2$/ })).toBeDefined()
  expect(await tab.find({ type: 'Markdown', text: /Booleans are refused now/ })).toBeDefined()
  expect(JSON.stringify(await tab.findAll({ type: 'Markdown' }))).not.toContain('SECRET')
  // Another agent's chat is a press away
  await pressed(tab, 'flow-pick-a2')
  expect(await until(async () => tab.find({ type: 'Text', text: /^Conversation of the checker, round 1$/ }))).toBeDefined()
  await tab.unmount()

  // The notice that it ended ends its card: it leaves the running cards and is under Finished
  await $.prompt.submit({ text: '<task-notification><task-id>wt1</task-id><status>completed</status><result>passed in 2 rounds</result></task-notification>', wait: false, origin: { kind: 'task-notification' } } as never)
  expect(await until(async () => ((await pane.find({ type: 'Text', text: /^Just finished$/ })) ? true : undefined))).toBe(true)
  // For two seconds it stays where it was, green, with no Stop, and nothing is under Finished yet
  expect(await pane.find({ type: 'Text', text: /^Roman numerals$/ })).toBeDefined()
  expect((await pane.findAll({ type: 'Box' })).filter(b => b.props.backgroundColor === 'success').length).toBe(1)
  expect(await pane.find({ type: 'Button', key: 'flow-stop-wf_1' })).toBeUndefined()
  // Its last line says how it ended, from what the run returned when its last round has no verdict; a round it did not need says so
  expect(await pane.find({ type: 'Text', text: /^✓ Passed in round 2 of 3$/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /^not needed$/ })).toBeDefined()
  // A workflow that passed makes the octopus happy for its pause too, then it rests
  const octopus = async () => (await pane.findAll({ type: 'Svg' })).map(one => String(one.props.alt)).find(alt => /^Claudopus/.test(alt))
  expect(await octopus()).toBe('Claudopus, task finished')
  expect((await pane.findAll({ type: 'Button' })).some(b => /Finished/.test(String(b.props.label)))).toBe(false)
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /^Roman numerals$/ })).toBeUndefined()
  expect(await octopus()).toBe('Claudopus')
  await pressed(pane, 'finished-fold')
  expect(await until(async () => pane.find({ type: 'Text', text: /^Finished · (Opus 5\.5 · )?(\d agents · )?round 2 of 3/ }))).toBeDefined()
  expect(JSON.parse(files.get(`${MEMORY}/flows/wf_1.json`) ?? '{}').result).toBe('passed in 2 rounds')
  // Its end was heard and told, as a piece of work's is
  expect(played).toEqual(['sounds/ready.wav'])
  expect(notified).toEqual(['Roman numerals | passed in 2 rounds'])
  await pane.unmount()
})
