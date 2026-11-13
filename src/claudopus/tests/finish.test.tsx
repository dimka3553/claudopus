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
  // The engine's next looks still list it held: its card stays done
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  // What it left running wakes it for a turn of words alone: it stays as it ended, not announced again, its report kept
  const otto = () => [...files.keys()].filter(key => /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key))
  const reportsBefore = otto().length
  await clock.advance(11_000)
  await $.turn.complete({ answer: 'The watch exited.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' } as never)
  expect(await pane.find({ type: 'Text', text: '✓ Finished' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(10)
  expect(otto().length).toBe(reportsBefore)
  // What it left running wakes it and it takes a step: it is working again
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' } as never)
  await clock.advance(2_100)

  // Handed back with a helper of its own still at work, it is done too, and the helper goes on
  await $.agent.spawn({ ...spawn, description: 'Name the squid', prompt: 'name it', resume: { agentId: 'h1' } } as never)
  await $.agent.spawn({ ...spawn, description: 'Look up names', prompt: 'look', parentAgentId: 'h1', resume: { agentId: 'h2' } } as never)
  agents.h1 = 'waiting'
  agents.h2 = 'running'
  kinds.h1 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'h1', message: 'Named it Sid.' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4t', reason: 'answer', agentId: 'h1' } as never)
  expect((await pane.find({ type: 'Text', text: '✓ Finished' }))?.props.color).toBe('success')
  agents.h2 = 'completed'
  await clock.advance(2_100)

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
