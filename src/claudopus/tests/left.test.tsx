// A task runs only what Claude Code tracks: a command that detaches what it starts is refused, a wait is a watch in the background
// with a row of its own, and a server it left for the person stays under its card once it has handed in its result (on 15 Nov a
// launcher started with nohup but no `echo $!` drew 8 pages at once with 56 GB and its card showed no run at all)

const leftTexts = async ($: Parameters<NonNullable<Parameters<typeof test>[2]>>[0], columns = 140) => {
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface: 'terminal' } as never)
  const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text ?? ''), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  await list.unmount()
  return all
}
const leftStart = async ($: Parameters<NonNullable<Parameters<typeof test>[2]>>[0]) => {
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the pages', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Draw the pages', prompt: 'draw the pages' } as never)
}
const NO_DETACH_SAID = 'Not run: this command detaches what it starts (nohup, setsid, disown or a trailing &)'

test('a command that detaches what it starts, under nohup or setsid, disowned, or sent off with an & with or without echo $!, is refused held open and in the background, told to send the command itself in the background; an && between commands, a redirect with an & in it, an & inside quotes or a here-document and a command for another Mac are not, and nothing detached has a row (17 Nov: detached drawings failed at once, and nothing told their task)', SLOW, async ($, on) => {
  world(on, { agents: { a1: 'running' } })
  await leftStart($)
  let n = 0
  const denied = async (command: string, more: object = {}) => ((await $.tool.call({ tool: 'Bash', tool_use_id: `d${(n += 1)}`, agentId: 'a1', command, description: 'Run the drawing of the pages', ...more } as never)) as { deny?: string }).deny ?? ''
  const refused = [
    'nohup python draw.py > draw.log 2>&1',
    'cd /w && nohup bash ./poll.sh > poll.log 2>&1 & echo $!',
    'setsid python draw.py',
    'python draw.py > draw.log & disown',
    'python draw.py; disown',
    'python draw.py &',
    'python draw.py > draw.log 2>&1 &',
    'python draw.py & echo $!',
    'for i in 0 1 2 3; do python batch.py $i > /s/batch_$i.log 2>&1 & done; echo started',
    'cd /w && (python pool.py > pool.log 2>&1 &)',
    'python build_scene.py &\nsleep 1; echo started',
  ]
  const allowed = [
    'npm run build && node shot.mjs desktop.png',
    'python draw.py > draw.log 2>&1',
    'python draw.py 2>&1 | tail -n 5',
    'echo "drawing failed" >&2',
    'python draw.py &> draw.log',
    'python draw.py &>> draw.log',
    'echo "drawn & checked"',
    "git commit -m 'Draw & check the pages'",
    'grep -c "nohup" notes.md',
    "cat > run.sh <<'EOF'\npython draw.py &\nEOF",
    'ssh studio "nohup python draw.py > draw.log 2>&1 &"',
  ]
  const said: Record<string, string> = {}
  for (const command of refused) said[command] = (await denied(command)).slice(0, NO_DETACH_SAID.length)
  expect(said).toEqual(Object.fromEntries(refused.map(command => [command, NO_DETACH_SAID])))
  const passed: Record<string, boolean> = {}
  for (const command of allowed) passed[command] = !(await denied(command)).includes('detaches')
  expect(passed).toEqual(Object.fromEntries(allowed.map(command => [command, true])))
  // Sent to the background it is refused all the same, and told how to send it instead
  const inBackground = await denied('nohup python draw.py > draw.log 2>&1 &', { run_in_background: true })
  expect(inBackground.startsWith(NO_DETACH_SAID)).toBe(true)
  expect(inBackground).toContain('Send the command itself, without those, with `run_in_background: true`')
  // Nothing it was refused has a row on its card
  expect((await leftTexts($)).filter(text => /Run the drawing of the pages|draw\.py/.test(text))).toEqual([])
})

test('a wait for something far away is a watch: sent in the background it runs, with a row of kind Watch under its card that asks for no progress line, and a Monitor is one too; held open it is refused and told to send it in the background, and a bare sleep, a wait by the clock, is refused held open and in the background', SLOW, async ($, on) => {
  const { clock } = world(on, { agents: { a1: 'running' }, jobs: { output: () => '', wroteAt: () => 0 } })
  await leftStart($)
  const call = async (id: string, input: object) => (await $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', ...input } as never)) as { deny?: string }
  const WAIT = 'until az ml job show -n fit-7 --query status -o tsv | grep -q Completed; do sleep 30; done'
  // Held open it keeps the task from everything else
  const held = (await call('w1', { command: WAIT, description: 'Check that the cloud job has ended' })).deny ?? ''
  expect(held).toContain('Not run: this command only waits, and held open it keeps you from everything else')
  expect(held).toContain('`run_in_background: true`')
  // A wait by the clock is refused wherever it runs: a table of bare sleeps
  const sleeps: [string, object][] = [['sleep 300', {}], ['sleep 300', { run_in_background: true }], ['sleep 45 && echo awake', {}], ['sleep 10m', { run_in_background: true }]]
  const passed: string[] = []
  for (const [n, [command, more]] of sleeps.entries()) passed.push(((await call(`s${n}`, { command, description: 'Run a pause before the next look', ...more })).deny ?? '').slice(0, 41))
  expect(passed).toEqual(sleeps.map(() => 'Not run: this command only passes time, a'))
  expect((await leftTexts($)).filter(text => /cloud job|pause before/.test(text))).toEqual([])
  // In the background the same wait runs: a watch, though its words do not begin with Watch, and nothing asks it for a progress line
  expect((await call('w2', { command: WAIT, description: 'Check that the cloud job has ended', run_in_background: true, timeout: 600_000 })).deny).toBeUndefined()
  const rows = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.includes('Check that the cloud job has ended')) ? all : undefined
  })
  expect(rows?.filter(text => text.includes('Check that the cloud job has ended'))).toEqual(['Watch · Check that the cloud job has ended'])
  // Silent for minutes, it is watching, never a command that has said nothing or has no progress
  await clock.advance(5 * 60_000)
  const later = await leftTexts($)
  expect(later.some(text => text.startsWith('Watching'))).toBe(true)
  expect(later.filter(text => /progress|nothing for|silent|said nothing/i.test(text))).toEqual([])
  // A Monitor that waits for the same is a watch too
  expect(((await $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: WAIT, description: 'the second cloud job to end', timeout_ms: 600_000 } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(await until(async () => (await leftTexts($)).find(text => text.includes('the second cloud job to end')))).toBe('Watch · the second cloud job to end')
})

test('a task that leaves a preview server going for the person is done only once it hands in its result, the server no bar to that where a command that ends by itself is, and the server keeps its row with its Stop under the done card (18 Nov: a site task\'s card showed done for half an hour, no result ever came)', SLOW, async ($, on) => {
  const agents: Record<string, string> = { a1: 'running' }
  const { clock, resumed, notified } = world(on, { agents, jobs: { output: () => '', wroteAt: () => 0 } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'build and deploy the site', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Build and deploy the site', prompt: 'build it' } as never)
  const call = async (tool: string, id: string, input: Record<string, unknown> = {}) => (await $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)) as { deny?: string }
  const isDone = async () => (await leftTexts($)).some(text => text === '◐ Delivered' || /^Done · /.test(text))
  await call('mcp__claudopus__todo', 't1', { item: 'Build the full page', state: 'done' })
  await call('mcp__claudopus__todo', 't2', { item: 'Put it live', state: 'doing' })
  // The server it leaves going is sent to the background as itself, and has its row
  expect((await call('Bash', 'b1', { command: 'npx vite preview --port 4174', description: 'Serve the preview of the page', run_in_background: true })).deny).toBeUndefined()
  expect(await until(async () => ((await leftTexts($)).some(text => text.startsWith('Serve the preview of the page')) || undefined))).toBe(true)
  // Its step ends with words and a to-do open, only the server running: no card is done, nobody is told it is ready, nothing starts it
  await $.turn.complete({ answer: "Waiting for the checker's report, which is due in the next message.", durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(6_000)
  expect(await isDone()).toBe(false)
  expect(notified).toEqual([])
  expect(resumed).toEqual([])
  // With a command that ends by itself still running, its result is not taken; the server alone is no bar
  await call('mcp__claudopus__todo', 't3', { item: 'Put it live', state: 'done' })
  await call('Bash', 'b2', { command: 'hold deploy', description: 'Upload the page to the host', run_in_background: true })
  expect((await call('SubagentHandback', 'hb0', { message: 'The full page is live.' })).deny).toContain('Not handed in: a command of yours still runs: "')
  await call('TaskStop', 'x1', { task_id: 'bg-b2' })
  expect((await call('SubagentHandback', 'hb1', { message: 'The full page is live, and its preview is served on port 4174.' })).deny).toBeUndefined()
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  expect(await until(async () => ((await isDone()) || undefined))).toBe(true)
  await clock.advance(2_000)
  expect(notified.map(line => line.split(' | ')[1])).toEqual(['The full page is live, and its preview is served on port 4174.'])
  // Done, its server still runs under it, with its Stop
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  expect((await list.findAll({ type: 'Button' })).filter(b => String(b.props.label).startsWith('Serve the preview of the page')).length + (await list.findAll({ type: 'Text' })).filter(one => String(one.text ?? '').startsWith('Serve the preview of the page')).length).toBeGreaterThan(0)
  expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-')).length).toBe(1)
  await list.unmount()
  expect(resumed).toEqual([])
})
