// Finished work: the happy green octopus and its pause

test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', async ($, on) => {
  const { clock } = world(on, { art: true })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  const end = (agentId: string, turnId: string) => $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never)
  // The octopus drawings a view shows, by the file each came from
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  // The moment each octopus drawing is marked with: the app keeps a picture it drew before, so a happy moment drawn the same as
  // the last would start at its end, arms down; each turn to a drawing is marked anew, and keeps its mark while it stays
  const moment = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))?.[1]).filter(Boolean)[0]
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // One finishes while another works: both octopuses are happy, the band still says what the other is doing
  await clock.advance(400)
  await end('a1', 't1')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  const first = await moment(pane)
  const firstBand = await moment(band)
  expect(first).toBeDefined()
  expect(firstBand).toBeDefined()
  expect(await band.find({ type: 'Text', text: /Check the ears/ })).toBeDefined()
  // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
  await clock.advance(1_000)
  await end('a2', 't2')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(pane)).toBe(first)
  expect(await moment(band)).toBe(firstBand)
  expect((await band.find({ type: 'Text', text: '✓ Finished' }))?.props.dimColor).toBe(true)
  // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
  await clock.advance(1_100)
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await moment(pane)).toBe(first)
  await clock.advance(1_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await band.find({ type: 'Text', text: "the engine's own" })).toBeDefined()

  // Work finishing while another still runs goes back to work after its pause
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  expect(await drawn(band)).toEqual(['working-small'])
  await end('a3', 't3')
  expect(await drawn(pane)).toEqual(['happy'])
  // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
  expect(await moment(pane)).not.toBe(first)
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(band)).not.toBe(firstBand)
  await clock.advance(2_100)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // Stopped work makes no one happy
  await pane.press({ key: 'stop-a4' })
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await band.find({ type: 'Text', text: "the engine's own" })).toBeDefined()
  await clock.advance(2_100)

  // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
  await pane.unmount()
  await band.unmount()
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await end('a5', 't5')
  await clock.advance(2_500)
  const again = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect(await drawn(again)).toEqual(['mark'])

  // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
  await $.agent.spawn({ ...spawn, description: 'Draw the nose', prompt: 'draw the nose' } as never)
  await end('a6', 't6')
  expect(await drawn(again)).toEqual(['happy'])
  await $.session.start(start)
  await clock.advance(2_100)
  expect(await drawn(again)).toEqual(['mark'])

  // Seen ended before the reload, it is not shown ended again after it
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await end('a7', 't7')
  expect(await drawn(again)).toEqual(['happy'])
  await clock.advance(2_100)
  await $.session.start(start)
  expect(await drawn(again)).toEqual(['mark'])
  expect(await again.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  // Work that ended long before a load is not
  await clock.advance(30_000)
  await $.session.start(start)
  expect(await drawn(again)).toEqual(['mark'])
  // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
  await again.unmount()
  await clock.advance(1_000)
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await end('a8', 't8')
  await clock.advance(10_000)
  await $.session.start(start)
  await clock.advance(5_000)
  const after = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  expect((await after.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  await clock.advance(2_100)
  expect(await after.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  // Work stopped in the seconds of a load is not green after it
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await after.press({ key: 'stop-a9' })
  await clock.advance(5_000)
  await $.session.start(start)
  expect(await after.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await drawn(after)).toEqual(['mark'])
  await after.unmount()
})

test('work that answered while only its own background work held it, then stopped by the chat, the panel or the engine, finished: green and happy for its pause; work stopped before it answered is not', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, files } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const report = `The hover is gone and idle chats are no longer listed. ${'All tests pass and the version is pushed to main, installed on both Macs. '.repeat(8)}`
  // Its turn ends with its report while a watcher it started still runs: the engine holds it, and its card goes on working
  const answer = async (id: string, turnId: string) => {
    agents[id] = 'waiting'
    kinds[id] = 'general-purpose'
    await $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }

  // The chat stops it with TaskStop once its report is in: it ends at once, green and happy, and its report is kept then, once
  await $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Remove the hover', prompt: 'remove the hover' } as never)
  await clock.advance(60_000)
  await answer('a1', 't1')
  expect(await drawn(pane)).toEqual(['working'])
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key))
  await clock.advance(10)
  expect(kept()).toHaveLength(0)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  expect((await pane.find({ type: 'Text', text: /^Just finished$/ }))?.text).toBe('Just finished')
  await clock.advance(10)
  expect(await until(async () => kept()[0])).toBeDefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report.trim()}\n`)
  // The aborted turn that follows the stop changes nothing: its pause is not begun again, and its words are no report
  await clock.advance(1_000)
  await $.turn.complete({ answer: 'Partial words', durationMs: 1, isAborted: true, turnId: 't1x', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_100)
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report.trim()}\n`)
  await clock.advance(2_100)
  expect(await pane.find({ type: 'Text', text: /Remove the hover/ })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  // The engine's next look lists it killed: nothing changes, and no second report
  agents.a1 = 'killed'
  await clock.advance(20_000)
  expect(kept()).toHaveLength(1)

  // Stopped some other way, the engine lists it killed at its next look: the same green moment from then
  await $.agent.spawn({ ...spawn, description: 'Fold the idle chats', prompt: 'fold them' } as never)
  await answer('a2', 't1b')
  agents.a2 = 'killed'
  for (let n = 0; n < 25 && !(await pane.find({ type: 'Text', text: '✓ Finished' })); n += 1) await clock.advance(1000)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Build the app', prompt: 'build it' } as never)
  agents.a3 = 'waiting'
  kinds.a3 = 'general-purpose'
  await $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' } as never)
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
  // background goes on, unstopped, and the chat need not stop it
  await $.agent.spawn({ ...spawn, description: 'Name the octopus', prompt: 'name it' } as never)
  agents.a4 = 'waiting'
  kinds.a4 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' } as never)
  // Its turn may end with no text of its own: the handback is its answer
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
  // way to stop it
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect((await pane.find({ type: 'Text', text: /^It left something running in the background, / }))?.props.color).toBe('#E5A50A')
  expect(await pane.find({ type: 'Button', text: 'Stop it' })).toBeDefined()
  // What it left running wakes it for a turn of words alone: it stays as it ended, not announced again, its report kept
  const otto = () => [...files.keys()].filter(key => /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key))
  const reportsBefore = otto().length
  await clock.advance(11_000)
  await $.turn.complete({ answer: 'The watch exited.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' } as never)
  // Not announced again: no second pause, though the card still says what it left running
  expect(await pane.find({ type: 'Text', text: /^It left something running/ })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(10)
  expect(otto().length).toBe(reportsBefore)
  // What it left running wakes it and it takes a step: it is working again
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' } as never)
  await clock.advance(2_100)

  // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
  // the work. Once the helper has ended, the report goes through and it is done
  await $.agent.spawn({ ...spawn, description: 'Name the squid', prompt: 'name it', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Look up names', prompt: 'look', parentAgentId: 'h1', resume: { agentId: 'h2' } } as never)
  agents.h1 = 'waiting'
  agents.h2 = 'running'
  kinds.h1 = 'general-purpose'
  const early = await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'h1', message: 'Named it Sid.' } as never)
  expect(String((early as { deny?: unknown }).deny)).toContain('still running in the background')
  await $.turn.complete({ answer: 'Sid, Squidward, Inky', durationMs: 1, isAborted: false, turnId: 't4h', reason: 'answer', agentId: 'h2' } as never)
  agents.h2 = 'completed'
  await clock.advance(20_000)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'h1', message: 'Named it Sid.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4t', reason: 'answer', agentId: 'h1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  // Once nothing of it is held any more, at the engine's next look, it leaves the list
  agents.h2 = 'completed'
  agents.h1 = 'completed'
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: /Name the squid/ })).toBeUndefined()

  // Sent a message after its report, it works again: stopped before it took a step, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await answer('a5', 't5s')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' } as never)
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // The engine ends it as aborted instead: the same
  await $.agent.spawn({ ...spawn, description: 'Fold the list', prompt: 'fold the list' } as never)
  await answer('a6', 't2')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Stop pressed on its card in the panel: the same
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await answer('a7', 't3')
  await pane.press({ key: 'stop-a7' })
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(2_100)

  // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
  await $.agent.spawn({ ...spawn, description: 'Watch the M4', prompt: 'watch the m4' } as never)
  await answer('a8', 't4')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' } as never)
  await pane.press({ key: 'stop-a8' })
  expect(await pane.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  agents.a9 = 'killed'
  kinds.a9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  await clock.advance(2_100)
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  await pane.unmount()
})

test('work that answers a question while a copy of its own still runs, with that copy still its to-do, stays at work and says what it waits for; it finishes only when the copy is checked and it reports', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, files, logged } = world(on, { art: true, agents, kinds })
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-3d-work-ready-to-continue-on-m4\/report\.md$/.test(key))
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  const todo = (item: string, state: string, id: string) => call('mcp__claudopus__todo', id, { item, state })

  // As it ran on 13 Nov: told to send the big pieces, it marks that to-do, starts the copy in the background and a watch on it
  await $.prompt.submit({ text: 'Yes, send them', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: '3D work ready to continue on M4', prompt: 'send them' } as never)
  kinds.a1 = 'general-purpose'
  await todo('Report with the big pieces waiting on your yes', 'done', 't0')
  await todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'doing', 't1')
  await call('Bash', 'b1', { command: 'zsh sendbig.sh', description: 'Send the four big pieces to the M4, never overwriting', run_in_background: true })
  await call('Monitor', 'm1', { command: 'tail -f bkdhmu6sf.output', description: 'big data copy to the M4: steps and failures', timeout_ms: 0 })
  // Its turn ends with a line of words while the engine holds it on the copy: it is at work, waiting for the copy
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: 'Sending the 14.5 GB now; it takes about four hours.', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  const wait = () => pane.find({ type: 'Text', text: /^Still at work: it waits for its background command to finish/ })
  expect((await wait())?.text).toMatch(/running .*: Send the four big pieces to the M4, never overwriting$/)
  // Forty minutes with nothing new is a long copy, not stuck work
  await clock.advance(40 * 60_000)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for / })).toBeUndefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(0)
  expect((await wait())?.text).toMatch(/running 40m /)

  // The chat passes on "has everything already been copied?": it answers with SubagentHandback while the copy still runs
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' } as never)
  await call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })
  await call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /left something running/ })).toBeUndefined()
  expect(await wait()).toBeDefined()
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Text', text: /left something running/ })).toBeUndefined()
  expect(kept()).toHaveLength(0)

  // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
  await $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] } as never)
  // The card lets go of the copy at once, before any step: it no longer says it waits for it
  expect(await wait()).toBeUndefined()
  expect(await drawn(pane)).toEqual(['working'])
  await call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
  // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
  await call('TaskStop', 'k1', { task_id: 'mon-m1' })
  await todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')
  const report = `All four pieces are on the M4 and every file matches by hash. ${'The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)}`.trim()
  await call('SubagentHandback', 'h2', { message: report })
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(10)
  expect(await until(async () => kept()[0])).toBeDefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report}\n`)
  await pane.unmount()
})

test('work that reports with everything it set out to do done, leaving a server of its own running, has finished: green, and its card says it left something running', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  await $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Run the site', prompt: 'run it' } as never)
  kinds.a1 = 'general-purpose'
  await call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })
  await call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
  await call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  expect(await pane.find({ type: 'Text', text: /^Still at work/ })).toBeUndefined()
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: /^It left something running in the background, / })).toBeDefined()
  await pane.unmount()
})

test('work that answers on the way while a helper of its still works, with its to-do still being done, stays at work', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.prompt.submit({ text: 'index the scans', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Index the scans', prompt: 'index them', resume: { agentId: 'w1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Read every scan', prompt: 'read', parentAgentId: 'w1', resume: { agentId: 'w2' } } as never)
  kinds.w1 = 'general-purpose'
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'w1', item: 'Index every scan', state: 'doing' } as never)
  agents.w1 = 'waiting'
  agents.w2 = 'running'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'w1', message: 'Half of the scans are read so far.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'x1', reason: 'answer', agentId: 'w1' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: /left something running/ })).toBeUndefined()
  await pane.unmount()
})
