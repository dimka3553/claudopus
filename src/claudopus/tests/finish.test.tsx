// Finished work: the happy green octopus and its pause

test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  // Its run over, as Claude Code lists it, and never pressed for a hand-back: its last words are its result, and it is done
  const end = (agentId: string, turnId: string) => ((agents[agentId] = 'completed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId } as never))
  // The octopus drawings a view shows, by the file each came from
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  // The moment each octopus drawing is marked with: the app keeps a picture it drew before, so a happy moment drawn the same as
  // the last would start at its end, arms down; each turn to a drawing is marked anew, and keeps its mark while it stays
  const moment = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))?.[1]).filter(Boolean)[0]
  // The cards in their finish moment: outlined green at the top
  const outlined = async (view: { findAll: (q: { type: 'Box' }) => Promise<{ key?: string; props: Record<string, unknown> }[]> }) => (await view.findAll({ type: 'Box' })).filter(b => b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF').length
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await drawn(band)).toEqual(['working-small'])

  // One finishes while another works: both octopuses are happy
  await clock.advance(400)
  await end('a1', 't1')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  const first = await moment(pane)
  const firstBand = await moment(band)
  expect(first).toBeDefined()
  expect(firstBand).toBeDefined()
  expect(await band.find({ type: 'Text', text: /Check the ears/ })).toBeUndefined()
  // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
  await clock.advance(1_000)
  await end('a2', 't2')
  expect(await drawn(pane)).toEqual(['happy'])
  expect(await drawn(band)).toEqual(['happy-small'])
  expect(await moment(pane)).toBe(first)
  expect(await moment(band)).toBe(firstBand)
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
  // (its card is still among the cards, done and green, with no second moment at the top)
  expect(await outlined(again)).toBe(0)
  expect((await again.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
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
  expect((await after.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await outlined(after)).toBe(1)
  await clock.advance(2_100)
  expect(await outlined(after)).toBe(0)
  // Work stopped in the seconds of a load is not green after it
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await after.press({ key: 'stop-a9' })
  await clock.advance(5_000)
  await $.session.start(start)
  expect(await outlined(after)).toBe(0)
  expect(await after.find({ type: 'Text', text: 'Stopped' })).toBeDefined()
  expect(await drawn(after)).toEqual(['mark'])
  await after.unmount()
})

test('work that ended its step in words while a watch of its own runs has not finished: stopped by the chat or the engine, it is stopped, not done; a hand-back ends it done at once', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const talk: unknown[] = []
  const { clock, files, stepped } = world(on, { art: true, agents, kinds, talk })
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  // The cards that say Stopped: each stays up until dismissed, so one more stopped is one more of them
  const stoppedCards = async () => (await pane.findAll({ type: 'Text' })).filter(one => one.text === 'Stopped').length
  const report = `The hover is gone and idle chats are no longer listed. ${'All tests pass and the version is pushed to main, installed on both Macs. '.repeat(8)}`
  // Its turn ends with its report in words while a watch it started still runs: a turn's end is only a pause, and its card goes
  // on working
  const answer = async (id: string, turnId: string) => {
    await $.tool.call({ tool: 'Monitor', tool_use_id: `w-${turnId}`, agentId: id, command: 'tail -f build.log', description: 'watch the build', timeout_ms: 0 } as never)
    agents[id] = 'waiting'
    kinds[id] = 'general-purpose'
    await $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId: id } as never)
  }

  // The chat stops it with TaskStop after a report in words, given while a watcher it started still runs: words are no result, as
  // only a hand-back is, so it ends stopped, not done, and nothing is kept as its result
  await $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Remove the hover', prompt: 'remove the hover' } as never)
  await clock.advance(60_000)
  await answer('a1', 't1')
  expect(await drawn(pane)).toEqual(['working'])
  const kept = () => [...files.keys()].filter(key => /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key))
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' } as never)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await stoppedCards()).toBe(1)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(20)
  expect(kept()).toHaveLength(0)
  agents.a1 = 'killed'
  await clock.advance(2_100)

  // Stopped some other way, the engine lists it killed at its next look: stopped as well
  await $.agent.spawn({ ...spawn, description: 'Fold the idle chats', prompt: 'fold them' } as never)
  await answer('a2', 't1b')
  agents.a2 = 'killed'
  // (second by second through one look at the engine's list)
  for (let second = 0; second < 20 && (await stoppedCards()) < 2; second += 1) await clock.advance(1000)
  expect(await stoppedCards()).toBe(2)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)

  // Its step ended after only a short line ("started it in the background") while Claude Code lists its run as going on, it has
  // not finished: stopped, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Build the app', prompt: 'build it' } as never)
  agents.a3 = 'waiting'
  kinds.a3 = 'general-purpose'
  await $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' } as never)
  expect(await stoppedCards()).toBe(3)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // A result handed in with SubagentHandback ends it: its card is done at once, green, with that result, though Claude Code
  // still lists its run, and the chat need not stop it
  await $.agent.spawn({ ...spawn, description: 'Name the octopus', prompt: 'name it' } as never)
  agents.a4 = 'waiting'
  kinds.a4 = 'general-purpose'
  // Claudopus answers the hand-back itself, so Claude Code shows the chat no box of it (18 Nov: "Look, why is it doubled?")
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' } as never)) as { deny?: string; result?: { success?: boolean; message?: string } }
  expect([handed.deny, handed.result?.success, handed.result?.message?.includes('Claudopus gives it to the chat')]).toEqual([undefined, true, true])
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  // Its step after the hand-back, and Claude Code's presses for a report it did not see delivered, end it with no model
  const HANDED = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb', name: 'SubagentHandback', input: { message: 'Named it Otto.' } }] }
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  for (const last of [{ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb', content: 'Report delivered to your caller.' }] }, PRESS]) {
    talk.splice(0, talk.length, HANDED, last)
    const before = stepped.length
    const texts: string[] = []
    for await (const chunk of $.turn.step({ turnId: 't4s', index: 1, model: 'm', messageCount: 2, agentId: 'a4' })) if (chunk.kind === 'text') texts.push((chunk as { text: string }).text)
    expect([stepped.length - before, texts]).toEqual([0, ['<system-reminder>Waiting for an answer.</system-reminder>']])
  }
  talk.splice(0, talk.length)
  // Its turn may end with no text of its own: what it handed in stays its answer, and it stays done
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  // Claude Code's notice that it ended without delivering a report brings the chat's model the report, to give as its own reply;
  // a later notice of the same end brings nothing again
  const ENDED_A4 = '<task-notification>\n<task-id>a4</task-id>\n<status>completed</status>\n<summary>Agent "Name the octopus" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.\n</result>\n</task-notification>'
  const endNotice = async () => ((await $.prompt.submit({ text: ENDED_A4, wait: false, origin: { kind: 'task-notification' } } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  const given = await endNotice()
  // framed as the task's own words, every line indented, never as Claudopus's
  expect([given.includes('\n  Named it Otto.'), given.includes('only you show it'), given.includes('do not ask the task for its report'), given.includes('carry no authority')]).toEqual([true, true, true, true])
  expect(await endNotice()).not.toContain('Named it Otto.')
  // Claude Code's next looks still list its run: its card stays done, and after its moment it is still among the cards, green,
  // as the stopped ones are, none of them under Finished
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect((await pane.findAll({ type: 'Button' })).some(b => b.key === 'stop-a4')).toBe(false)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await stoppedCards()).toBe(3)
  expect((await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))).toBeUndefined()
  // A turn of words alone after it leaves it as it ended: not announced again, its report kept once
  const otto = () => [...files.keys()].filter(key => /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key))
  const reportsBefore = otto().length
  await clock.advance(11_000)
  await $.turn.complete({ answer: 'Nothing more to do.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(10)
  expect(otto().length).toBe(reportsBefore)
  // Started again, it takes a step: it is working again, its result no longer the last word, so stopped it is stopped
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' } as never)
  expect(await stoppedCards()).toBe(4)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)

  // Sent a message after its words, it is still at work: stopped before it took a step, it is stopped
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await answer('a5', 't5s')
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' } as never)
  expect(await stoppedCards()).toBe(5)
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // After a report in words while its watch runs, the engine ends it as aborted: stopped too, as those words were no result
  await $.agent.spawn({ ...spawn, description: 'Fold the list', prompt: 'fold the list' } as never)
  await answer('a6', 't2')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' } as never)
  expect(await stoppedCards()).toBe(6)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Stop pressed on its card in the panel: the same
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await answer('a7', 't3')
  await pane.press({ key: 'stop-a7' })
  expect(await stoppedCards()).toBe(7)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Its watch starts its next step: at work as before, and stopped it is stopped
  await $.agent.spawn({ ...spawn, description: 'Watch the M4', prompt: 'watch the m4' } as never)
  await answer('a8', 't4')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' } as never)
  await pane.press({ key: 'stop-a8' })
  expect(await stoppedCards()).toBe(8)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await drawn(pane)).toEqual(['mark'])
  await clock.advance(2_100)

  // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  agents.a9 = 'killed'
  kinds.a9 = 'general-purpose'
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await stoppedCards()).toBe(9)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(2_100)
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' } as never)
  expect(await drawn(pane)).toEqual(['mark'])
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await pane.unmount()
})

test('work that hands in an answer while a copy of its own still runs, with that copy still its to-do, is refused and stays at work, its copy a row on its card; it finishes only when the copy is checked and it hands in its result', SLOW, async ($, on) => {
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
  // Its turn ends with a line of words while the copy runs: a turn's end is only a pause, and it is at work
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: 'Sending the 14.5 GB now; it takes about four hours.', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect(await drawn(pane)).toEqual(['working'])
  // Its stage is its colour: never a word in its top row (18 Nov, the person: "This top row should never say 'waiting for its
  // command'"), nor a line of its own under it (18 Nov "Waiting for a command to finish")
  expect(await pane.find({ type: 'Text', text: /Waiting for its/ })).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /Waiting for a command/ })).toBeUndefined()
  // The copy itself is a row on its tree: what it is in its own words, and how long it has run
  const job = async () => (await pane.find({ type: 'Text', text: /^Command · Send the\b/ })) ?? (await pane.findAll({ type: 'Button' })).find(b => /^Command · Send the\b/.test(String(b.props.label)))
  expect(await job()).toBeDefined()
  // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
  // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
  await clock.advance(13 * 60_000)
  expect(await pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })).toBeUndefined()
  expect(logged.filter(line => line.includes('has had nothing new'))).toHaveLength(0)
  expect(await pane.find({ type: 'Text', text: '13m 00s' })).toBeDefined()

  // The chat passes on "has everything already been copied?": its answer handed in with SubagentHandback while the copy still runs
  // and its to-do is open is refused, as a hand-back is its result
  await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' } as never)
  await call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })
  const early = (await call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })) as { deny?: string }
  expect(early.deny).toMatch(/^Not handed in: a to-do is still open: "Send CT fits, CTs, iPhone scans and photogrammetry to the M4"\./)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  // Still at work: not green, not under Finished, and its answer is no result
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await job()).toBeDefined()
  await clock.advance(20_000)
  expect(await drawn(pane)).toEqual(['working'])
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeDefined()
  expect(kept()).toHaveLength(0)

  // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
  await $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] } as never)
  // The card lets go of the copy at once, before any step: its row goes
  expect(await job()).toBeUndefined()
  expect(await drawn(pane)).toEqual(['working'])
  await call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
  // It stops its watch, ticks the to-do and hands in its result: now it has finished, green, with its report kept
  await call('TaskStop', 'k1', { task_id: 'mon-m1' })
  await todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')
  const report = `All four pieces are on the M4 and every file matches by hash. ${'The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)}`.trim()
  await call('SubagentHandback', 'h2', { message: report })
  agents.a1 = 'completed'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await drawn(pane)).toEqual(['happy'])
  await clock.advance(10)
  expect(await until(async () => kept()[0])).toBeDefined()
  expect(files.get(kept()[0] ?? '')).toBe(`${report}\n`)
  await pane.unmount()
})

test('work that hands in its result with everything it set out to do done, leaving a server of its own running, has finished: green, and the server stays a row under its done card, with its Stop, until it is stopped', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, stopped, appended } = world(on, { art: true, agents, kinds })
  await $.session.start(start)
  // (wide enough for a row's own Stop)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'desktop' } as never)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  // (a row's name is a button where a press opens its output)
  const rows = async () => [...(await pane.findAll({ type: 'Text' })).map(one => String(one.text ?? '')), ...(await pane.findAll({ type: 'Button' })).map(b => String(b.props.label ?? ''))]
  const rowStop = async () => (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))
  const fold = async () => (await pane.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  await $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Run the site', prompt: 'run it' } as never)
  kinds.a1 = 'general-purpose'
  await call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })
  await call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
  // A server never ends by itself, so it alone may stay as the result is handed in: done at once, green on its line and its edge
  expect(((await call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })) as { deny?: string }).deny).toBeUndefined()
  agents.a1 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect((await pane.findAll({ type: 'Box' })).filter(b => !b.key?.startsWith('outline-') && b.props.backgroundColor === '#4C9AFF')).toHaveLength(1)
  // After its moment the card stays up, done, never under Finished: the server's row is under it with the row's own Stop, and the
  // task itself has none
  await clock.advance(20_000)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect((await rows()).filter(text => /Serve the site/.test(text))).toHaveLength(1)
  expect(await rowStop()).toBeDefined()
  expect(await pane.find({ type: 'Button', key: 'stop-a1' })).toBeUndefined()
  expect(await fold()).toBeUndefined()
  // and so it stays, however long, until the person stops the server: its row goes, the finished task is told nothing, and the
  // card is still up, done and green, never under Finished
  await clock.advance(10 * 60_000)
  expect((await rows()).filter(text => /Serve the site/.test(text))).toHaveLength(1)
  await pane.press({ key: (await rowStop())?.key ?? '' })
  expect(await until(async () => stopped.includes('bg-b1') || undefined)).toBe(true)
  expect(await until(async () => ((await rows()).some(text => /Serve the site/.test(text)) ? undefined : true))).toBe(true)
  expect(appended.filter(line => line.startsWith('a1: '))).toEqual([])
  await clock.advance(60 * 60_000)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await fold()).toBeUndefined()
  // Only the person's Mark as done puts it under Finished, after its green moment, the octopus happy for it however long ago
  // the task finished
  const moods = async () => (await pane.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  expect(await moods()).not.toContain('happy')
  await pressed(pane, 'dismiss-a1')
  expect(await until(async () => ((await moods()).includes('happy') ? true : undefined))).toBe(true)
  await clock.advance(2_100)
  expect(await moods()).not.toContain('happy')
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  // One that hands in while a command of its own that ends by itself still runs is refused: it stays at work with its Stop, never
  // Done in between (18 Nov, the person: "Why does it turn from purple to green to purple to green to purple?"), and is done
  // only once the command has ended and it hands in again
  const train = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a2', ...input } as never)
  await $.agent.spawn({ ...spawn, description: 'Train the model', prompt: 'train it' } as never)
  kinds.a2 = 'general-purpose'
  await train('mcp__claudopus__todo', 't3', { item: 'Start the training', state: 'done' })
  await train('Bash', 'b2', { command: 'python3 train.py', description: 'Run the training', run_in_background: true })
  expect(((await train('SubagentHandback', 'h2', { message: 'The training is started and takes two hours.' })) as { deny?: string }).deny).toMatch(/^Not handed in: a command of yours still runs: /)
  agents.a2 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a2' } as never)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(20_000)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  expect(await pane.find({ type: 'Button', key: 'stop-a2' })).toBeDefined()
  await train('TaskStop', 'k2', { task_id: 'bg-b2' })
  expect(((await train('SubagentHandback', 'h3', { message: 'The model is trained.' })) as { deny?: string }).deny).toBeUndefined()
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  await pane.unmount()
})

test('work that hands in its result with nothing of its own running finishes, though Claude Code still lists its run: the 14 Nov Azure card, which an answer passed on twice kept at work for hours, its clock running', SLOW, async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock, resumed } = world(on, { art: true, agents, kinds })
  on('classic.SubagentStop', () => ({ value: {} }) as never)
  await $.session.start(start)
  const drawn = async (view: { findAll: (q: { type: 'Svg' }) => Promise<{ props: { source?: unknown } }[]> }) =>
    (await view.findAll({ type: 'Svg' })).map(one => /<title>([\w-]+)<\/title>/.exec(String(one.props.source))?.[1]).filter(Boolean)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  const labels = async () => (await pane.findAll({ type: 'Button' })).map(b => String(b.props.label))
  // The card's line with its clock
  const line = async () => (await pane.findAll({ type: 'Text' })).map(one => one.text ?? '').find(text => / · (\d+m )?\d+s$/.test(text))
  // As the engine stops any work, it lists everything in flight in the whole session: here another work and its command
  const stop = (id: string) =>
    $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'a2', type: 'local_agent', status: 'running', description: 'Eyes, next round' }, { id: 'b9', type: 'local_bash', status: 'running', description: 'Fit the eyes' }] } as never)
  await $.prompt.submit({ text: 'use the cloud for heavy work', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Heavy work on Azure', prompt: 'use azure' } as never)
  await $.agent.spawn({ ...spawn, description: 'Eyes, next round', prompt: 'eyes' } as never)
  kinds.a1 = 'general-purpose'
  agents.a2 = 'running'
  // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
  // its had ended, yet the engine went on listing it as held on background work of its own
  await call('mcp__claudopus__todo', 't1', { item: 'One command that runs a job on Azure', state: 'done' })
  await call('mcp__claudopus__ask', 'k1', { text: 'Release the Azure heavy-jobs route?', choices: ['Release it', 'Hold it'] })
  await call('SubagentHandback', 'h1', { message: 'Heavy work can now run on Azure. Built, tested and pushed on its own branch; it waits for your Release it.' })
  agents.a1 = 'waiting'
  await stop('a1')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(20_000)
  // Ended, its question on its card to answer, its clock stopped: amber while it waits for the person, and no row under it
  expect(await drawn(pane)).toEqual(['wave'])
  expect(await labels()).toContain('Release it')
  expect((await pane.findAll({ type: 'Button' })).some(b => String(b.key ?? '').startsWith('stop-list-job-'))).toBe(false)
  const asking = await line()
  expect(asking).not.toMatch(/Done|Waiting/)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeUndefined()
  await clock.advance(10 * 60_000)
  expect(await line()).toBe(asking)

  // The press starts it again with the answer, once
  const release = (await pane.findAll({ type: 'Button' })).find(b => b.props.label === 'Release it')
  await pane.press({ key: release?.key ?? '' })
  expect(await until(async () => resumed.find(line => line.startsWith('a1: ') && line.includes('pressed "Release it"')))).toBeDefined()
  // It finds the release already done and hands that in, Claude Code still listing its run
  await call('mcp__claudopus__note', 'n1', { text: 'Released: the route is on main.' })
  await clock.advance(70_000)
  const report = `The Azure heavy-jobs route is on main and its deploy succeeded. ${'Any worktree that merged main can send a job to its own large Azure machine. '.repeat(7)}`
  await call('SubagentHandback', 'h2', { message: report })
  await stop('a1')
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' } as never)
  // It has finished: not at work, its clock stopped
  expect(await drawn(pane)).toEqual(['happy'])
  expect((await pane.findAll({ type: 'Button' })).some(b => b.key === 'stop-a1')).toBe(false)
  expect(await pane.find({ type: 'Text', text: '◐ Delivered' })).toBeDefined()
  const endedLine = await line()
  expect(endedLine).not.toMatch(/Done|Waiting/)
  // and once its moment is over its card stays up, done, its clock where it stopped, never counting on
  await clock.advance(60_000)
  expect(await line()).toBe(endedLine)
  expect((await pane.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')

  // The chat, told of the press, passes the same answer on: it is not sent, so the ended work is not started a third time
  const sends = resumed.length
  const again = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Release it' } as never)
  expect(String((again as { deny?: unknown }).deny)).toContain('gave on that task\'s card')
  expect(resumed.length).toBe(sends)
  expect(await line()).toBe(endedLine)
  // Words of the person's own that say something new still go
  const steer = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Also file the quota request.' } as never)
  expect((steer as { deny?: unknown }).deny).toBeUndefined()
  await pane.unmount()
})

test('the same words as a card answer still go when they answer a newer question, or when the person typed them in the chat', async ($, on) => {
  const { clock } = world(on)
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Merge the branch', prompt: 'merge' } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Proceed?', choices: ['Yes', 'No'] } as never)
  const yes = (await list.findAll({ type: 'Button' })).find(b => b.props.label === 'Yes')
  await list.press({ key: yes?.key ?? '' })
  await clock.advance(5_000)
  // The work asks again, with the same answer to give: the chat passing the person's "Yes" on goes
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Also merge it?', choices: ['Yes', 'No'] } as never)
  const sent = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Yes' } as never)
  expect((sent as { deny?: unknown }).deny).toBeUndefined()
  // An answer typed in the chat in words of their own and passed on, then passed on again in the same words: only a card's answer
  // is refused as a repeat (a bare "Yes" typed there is the card's answer itself: typed.tsx)
  await clock.advance(5_000)
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Tag it?', choices: ['Yes', 'No'] } as never)
  await $.prompt.submit({ text: 'Yes, and name it v2', wait: false, origin: composer })
  const first = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Yes, and name it v2' } as never)
  const second = await $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a1', message: 'Yes, and name it v2' } as never)
  expect((first as { deny?: unknown }).deny).toBeUndefined()
  expect((second as { deny?: unknown }).deny).toBeUndefined()
  await list.unmount()
})

// A dozen cards, one in the middle finishing: before, it went green where it was, among the others, and went under Finished two
// seconds later, so with ten or more running it went by unseen. Now it comes to the top under what waits, outlined green, for its
// two seconds, then is back in its own place among the cards, still green, until the person dismisses it; stopped or failed work
// is not brought up
const dozen = async ($: Parameters<TestBody>[0], on: On, asking = false) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const w = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })
  for (let n = 1; n <= 12; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  const list = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  if (asking) await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] } as never)
  await w.clock.advance(5000)
  const order = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => /^Piece \d+$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  const green = async () => (await list.findAll({ type: 'Box' })).filter(b => b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF').length
  const fold = async () => (await list.findAll({ type: 'Button' })).find(b => /Finished/.test(String(b.props.label)))?.props.label
  // Its run over, as Claude Code lists it: with its last words taken as its result it is done, and ended by an error it failed
  const end = (agentId: string, reason = 'answer') => ((agents[agentId] = reason === 'answer' ? 'completed' : 'failed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: reason === 'answer' ? 'Done.' : '', durationMs: 1, isAborted: false, turnId: `t-${agentId}`, reason, agentId } as never))
  return { ...w, list, order, green, fold, end }
}
const others = (but: number[]) => Array.from({ length: 12 }, (_, n) => n + 1).filter(n => !but.includes(n)).map(n => `Piece ${n}`)

test('a finished card in the middle of a dozen comes to the top at once, outlined for two seconds on time, and stays there over what works, delivered and never under Finished, after an hour and after another task finishes; only Mark as done puts it under Finished; delivered, it has only Give feedback and Mark as done to press, at its bottom, failed Message and Dismiss at its top right, and neither press tells its task anything', SLOW, async ($, on) => {
  const { list, order, green, fold, end, clock, appended, resumed, sent, submitted } = await dozen($, on)
  const doneLines = async () => (await list.findAll({ type: 'Text' })).filter(one => one.text === '◐ Delivered' && one.props.color === '#4C9AFF').length
  expect(await order()).toEqual(others([]))
  await end('a7')
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await green()).toBe(1)
  expect((await list.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  await clock.advance(1_900)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await green()).toBe(1)
  // The two seconds end on time, by the clock alone: no card is left outlined, and it stays on top, delivered, with
  // nothing under Finished
  await clock.advance(150)
  expect(await green()).toBe(0)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await doneLines()).toBe(1)
  expect(await fold()).toBeUndefined()
  // An hour on it is there as it was
  await clock.advance(60 * 60_000)
  expect(await order()).toEqual(['Piece 7', ...others([7])])
  expect(await doneLines()).toBe(1)
  expect(await fold()).toBeUndefined()
  // Another task finishes and has its own moment: the first stays among the cards, and after it both are there
  await end('a9')
  expect(await order()).toEqual(['Piece 9', 'Piece 7', ...others([7, 9])])
  expect(await green()).toBe(1)
  await clock.advance(2_100)
  expect(await order()).toEqual(['Piece 9', 'Piece 7', ...others([7, 9])])
  expect(await doneLines()).toBe(2)
  expect(await fold()).toBeUndefined()
  // Only the person's Dismiss puts one under Finished, and only that one
  await pressed(list, 'dismiss-a7')
  await clock.advance(2_100)
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await order()).toEqual(['Piece 9', ...others([7, 9])])
  expect(await doneLines()).toBe(1)

  // A delivered card has two buttons at its bottom and nothing else to press but its title: Give feedback, filled, where the bar
  // above the chat takes its box, and Mark as done; a failed one has Message and Dismiss, quiet, at its top right. Either way the
  // second puts it under Finished at once and sends its task nothing
  const bar = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  const onCard = async (id: string) => {
    type Drawn = { type?: string; key?: string; props?: Record<string, unknown>; children?: unknown[] }
    const found: (string | boolean | undefined)[][] = []
    const walk = (node: unknown) => {
      const one = (node ?? {}) as Drawn
      if (one.type === 'Button') found.push([String(one.props?.label ?? one.key ?? one.props?.key ?? '').replace(/-\d+$/, ''), one.props?.plain as boolean, one.props?.dimColor as boolean])
      for (const child of one.children ?? []) walk(child)
    }
    walk(await list.find({ type: 'Box', key: `todo-${id}` }))
    return found
  }
  for (const [id, reason, said, presses] of [['a8', 'answer', /^◐ Delivered/, [['Give feedback', undefined, undefined], ['Mark as done', undefined, undefined]]], ['a10', 'error', /^✕ Failed/, [['Message', true, true], ['Dismiss', true, true]]]] as const) {
    await end(id, reason)
    expect(await until(async () => ((await onCard(id)).some(one => one[0] === presses[1][0]) ? true : undefined))).toBe(true)
    expect(await list.find({ type: 'Text', text: said })).toBeDefined()
    // (a failed card also has its Start again)
    expect([id, (await onCard(id)).filter(one => one[0] !== 'Start again')]).toEqual([id, [[`Piece ${id.slice(1)}`, true, undefined], ...presses]])
    if (reason === 'answer') expect((await onCard(id)).length).toBe(3)
    const told = [appended.length, resumed.length, sent.length, submitted.length]
    const folded = Number(/\d+/.exec(String(await fold()))?.[0])
    await pressed(list, `dismiss-${id}`)
    await clock.advance(2_100)
    expect(await until(async () => ((await fold()) === `▸ Finished ${folded + 1}` ? true : undefined))).toBe(true)
    expect(await list.find({ type: 'Box', key: `todo-${id}` })).toBeUndefined()
    await clock.advance(5_000)
    expect([id, appended.length, resumed.length, sent.length, submitted.length]).toEqual([id, ...told])
  }
  await bar.unmount()
})

test('two that finish close together stack at the top newest first, each for its own two seconds', async ($, on) => {
  const { order, green, end, clock } = await dozen($, on)
  await end('a4')
  await clock.advance(800)
  await end('a9')
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
  expect(await green()).toBe(2)
  await clock.advance(1_300)
  // (the first, its moment over, stays on top under the newer one)
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
  expect(await green()).toBe(1)
  await clock.advance(800)
  expect(await green()).toBe(0)
  expect(await order()).toEqual(['Piece 9', 'Piece 4', ...others([4, 9])])
})

test('a finish while an ask waits goes right under the ask, never above it, and stays there, over what works', async ($, on) => {
  const { order, green, end, clock } = await dozen($, on, true)
  expect(await order()).toEqual(['Piece 3', ...others([3])])
  await end('a7')
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
  expect(await green()).toBe(1)
  await clock.advance(2_100)
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
})

test('stopped and failed work is not brought up nor green: it stays in its place, the stopped one grey and the failed one in red, saying why, with Start again, each until it is dismissed', SLOW, async ($, on) => {
  const { list, order, green, fold, end, clock } = await dozen($, on)
  await list.press({ key: 'stop-a5' })
  await end('a8', 'error')
  expect(await order()).toEqual(others([]))
  expect(await green()).toBe(0)
  expect((await list.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
  // (failed says why, in red on its line and its edge)
  const failed = await list.find({ type: 'Text', text: '✕ Failed · Ended with an error' })
  expect(failed?.props.color).toBe('error')
  expect((await list.findAll({ type: 'Box' })).some(b => b.props.backgroundColor === 'error')).toBe(true)
  // After the pause, and an hour on, both stay where they are, the stopped one grey, the failed one red, saying why: the one the
  // person stopped and the failed one each with Start again
  for (const wait of [2_100, 60 * 60_000]) {
    await clock.advance(wait)
    expect(await order()).toEqual(others([]))
    expect(await green()).toBe(0)
    expect((await list.find({ type: 'Text', text: 'Stopped' }))?.props.dimColor).toBe(true)
    expect((await list.find({ type: 'Text', text: '✕ Failed · Ended with an error' }))?.props.color).toBe('error')
    expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Start again').map(b => String(b.key).replace(/-\d+$/, ''))).toEqual(['again-small-a5', 'again-small-a8'])
    expect(await fold()).toBeUndefined()
  }
  // Each goes under Finished only on its own Dismiss
  await pressed(list, 'dismiss-a5')
  expect(await until(async () => fold())).toBe('▸ Finished 1')
  expect(await order()).toEqual(others([5]))
  await pressed(list, 'dismiss-a8')
  expect(await until(async () => ((await fold()) === '▸ Finished 2' ? true : undefined))).toBe(true)
  expect(await order()).toEqual(others([5, 8]))
})

test('a finish while a reply is being typed still shows at the top in green, under the ask being typed into, its words kept', async ($, on) => {
  const { list, order, green, end, clock } = await dozen($, on, true)
  const box = ((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).find(one => /-reply-/.test(one.key ?? ''))?.key ?? ''
  await list.input({ key: box, text: 'Not y', kind: 'change' } as never)
  await end('a7')
  expect(await until(async () => ((await green()) ? true : undefined))).toBe(true)
  expect(await order()).toEqual(['Piece 3', 'Piece 7', ...others([3, 7])])
  expect(((await list.findAll({ type: 'Input' } as never)) as { key?: string }[]).map(one => one.key)).toContain(box)
  await clock.advance(2_100)
  expect(await green()).toBe(0)
})

test('scrolled down, a finish at the top is pointed at in green above the prompt for its two seconds, beside what waits', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const w = world(on, { panes: ['claudopus'], agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })
  for (let n = 1; n <= 12; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  const down = await $.ui.mount({ ...LIST, props: { ...LIST.props, scroll: { offset: 40, bodyRows: 20 } }, surface: 'desktop' } as never)
  await w.clock.advance(1000)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)
  // (its run over, as Claude Code lists it, its last words its result)
  agents.a7 = agents.a9 = 'completed'
  kinds.a7 = kinds.a9 = 'general-purpose'
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer', agentId: 'a7' } as never)
  const mark = await until(async () => band.find({ type: 'Text', text: /is done, at the top of the panel/ }))
  expect(mark?.text).toBe('↑ Piece 7 is done, at the top of the panel')
  expect(mark?.props.color).toBe('success')
  await w.clock.advance(2_100)
  expect(await band.find({ type: 'Text', text: /finished/ })).toBeUndefined()
  // With an ask waiting, the amber line says both
  await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] } as never)
  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't9', reason: 'answer', agentId: 'a9' } as never)
  expect((await until(async () => band.find({ type: 'Text', text: / · 1 done$/ })))?.text).toBe('● 1 waiting for you · Piece 3: May I delete the old repo? · 1 done')
  await band.unmount()
  await down.unmount()
})

test('a finished card that left a server running stays at the top after its moment, the server its row with a Stop, never back among the running, and stays there an hour on', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const { clock } = world(on, { agents, kinds })
  await $.session.start(start)
  await $.prompt.submit({ text: 'run the site and more', wait: false, origin: composer })
  for (let n = 1; n <= 4; n += 1) await $.agent.spawn({ ...spawn, description: `Piece ${n}`, prompt: `piece ${n}` } as never)
  // (wide enough for a row's own Stop)
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 100 }, surface: 'desktop' } as never)
  const order = async () => (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? '')).filter(one => /^Piece \d+$/.test(one)).filter((one, n, all) => all.indexOf(one) === n)
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a3', ...input } as never)
  kinds.a3 = 'general-purpose'
  await call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })
  await call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })
  await call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
  await call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })
  agents.a3 = 'waiting'
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a3' } as never)
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
  await clock.advance(20_000)
  expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))).toHaveLength(1)
  expect(await list.find({ type: 'Button', key: 'stop-a3' })).toBeUndefined()
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
  await clock.advance(60 * 60_000)
  expect((await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))).toHaveLength(1)
  expect((await list.find({ type: 'Text', text: '◐ Delivered' }))?.props.color).toBe('#4C9AFF')
  expect(await order()).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4'])
})

test('a task hands in a finished part of its result while it works on: its card keeps working with its to-dos and helper, the part is kept as a result of its own and given to the chat once, in a message of its own; its last report still ends it', async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const parents: Record<string, string> = {}
  const { files, submitted, submittedContext, clock } = world(on, { agents, kinds, parents })
  await $.session.start(start)
  await $.prompt.submit({ text: 'look into the beards and the jawline', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Beards and jawline', prompt: 'look into them' } as never)
  agents.a1 = 'running'
  kinds.a1 = 'general-purpose'
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Build the jawline', state: 'doing' } as never)
  await $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Build the jawline', prompt: 'build it', parentAgentId: 'a1' } as never)
  ;((agents.a2 = 'running'), (kinds.a2 = 'general-purpose'), (parents.a2 = 'a1'))
  const reportsOf = () => [...files.keys()].filter(path => path.startsWith(`${MEMORY}/reports/`) && path.endsWith('/report.md'))
  const part = 'The beard research is done: short beards fit the films best.'
  const taken = (await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r1', agentId: 'a1', message: part } as never)) as { result?: string }
  expect(taken.result).toContain('your task goes on')
  // A helper's result goes to its task, never to the chat
  expect(((await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r2', agentId: 'a2', message: 'Half a jaw.' } as never)) as { result?: string }).result).toContain('you are a helper')
  // Kept at once as a result of its own, however short. The task tells the chat itself, as Claude Code draws a message Claudopus
  // submits as the person's own, and its message carries the part
  expect(await until(async () => (reportsOf().length === 1 ? reportsOf() : undefined))).toHaveLength(1)
  expect(files.get(reportsOf()[0] ?? '')).toBe(`${part}\n`)
  const notice = 'The task "Beards and jawline" handed in a part of its result, and is still working on the rest.'
  expect(taken.result).toContain(`SendMessage (load it with ToolSearch if needed) with to "main" and this message, exactly:\n${notice}\n`)
  await clock.advance(1000)
  const told = ((await $.prompt.submit({ text: `<agent-message from="a1">\n${notice}\n</agent-message>`, wait: false, origin: { kind: 'peer' }, isMeta: true } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(told).toContain(`is still working, and handed in this part of its result`)
  expect(told).toContain(`  ${part}`)
  // Claudopus sends the chat nothing of its own for a part, however long it waits (Claude Code draws such a message as the
  // person's): parts whose task never told the chat go with the next message, all at once
  await $.agent.spawn({ ...spawn, description: 'Ears', prompt: 'look into them' } as never)
  ;((agents.a3 = 'running'), (kinds.a3 = 'general-purpose'))
  await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r3', agentId: 'a1', message: 'The chin research is done.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__report', tool_use_id: 'r4', agentId: 'a3', message: 'The ear research is done.' } as never)
  await clock.advance(10 * 60_000)
  const both = ((await $.prompt.submit({ text: 'and the chin and ears?', wait: false, origin: composer } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(both).toContain('  The chin research is done.')
  expect(both).toContain('  The ear research is done.')
  expect(both).not.toContain(part)
  expect(submitted.filter(text => text.includes('handed in a part') && !text.startsWith('<agent-message'))).toEqual([])
  // The card still works, its to-do and helper with it, and the part is never given again, nor is Claudopus's own message sent
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const texts = (await list.findAll({ type: 'Text' })).map(one => String(one.text ?? ''))
  expect(texts).toContain('2 working')
  const next = ((await $.prompt.submit({ text: 'how is it going?', wait: false, origin: composer } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(next).not.toContain(part)
  // Its last report ends it, kept beside the parts
  const kept = await until(async () => (reportsOf().length === 3 ? reportsOf().length : undefined))
  agents.a2 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'a2', message: 'The jaw is built.' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd2', agentId: 'a1', item: 'Build the jawline', state: 'done' } as never)
  const last = `The jawline is built and fits all 47 films. ${'It holds at every angle. '.repeat(25)}`
  const handed = (await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: last } as never)) as { deny?: string; result?: { message?: string } }
  expect([handed.deny, handed.result?.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')])
  await clock.advance(1000)
  expect(await until(async () => (reportsOf().length === (kept ?? 0) + 1 ? reportsOf() : undefined))).toHaveLength(4)
})

test("a task's report whose notice of its end never comes goes to the chat with the person's next message, once; a message to the task after its hand-back is a step of its own; a file it names or the chat sends from outside the chat's folder reaches the person as a copy inside it, which their click opens", async ($, on) => {
  const agents: Record<string, string> = {}
  const kinds: Record<string, string> = {}
  const talk: unknown[] = []
  const { stepped, files } = world(on, { agents, kinds, talk })
  await $.session.start(start)
  await $.prompt.submit({ text: 'name the squid', wait: false, origin: composer })
  // A report whose notice never comes goes with the person's next message, once; a message to the task after its hand-back is a step
  // of its own, never answered with no model
  await $.agent.spawn({ ...spawn, description: 'Name the squid', prompt: 'name it' } as never)
  agents.a1 = 'waiting'
  kinds.a1 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb5', agentId: 'a1', message: 'Named it Inky.' } as never)
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'hb5', name: 'SubagentHandback', input: { message: 'Named it Inky.' } }] }, { role: 'user', content: [{ type: 'text', text: 'Also name the crab.' }] })
  const asked = stepped.length
  for await (const chunk of $.turn.step({ turnId: 't5s', index: 1, model: 'm', messageCount: 2, agentId: 'a1' })) void chunk
  expect(stepped.length - asked).toBe(1)
  talk.splice(0, talk.length)
  const withMessage = async () => ((await $.prompt.submit({ text: 'what did it name it?', wait: false, origin: { kind: 'composer' } } as never)) as { context?: string[] }).context?.join('\n') ?? ''
  expect(await withMessage()).toContain('  Named it Inky.')
  expect(await withMessage()).not.toContain('Named it Inky.')

  // The app's file pane opens only files inside the chat's folder: a file the report names elsewhere, on a line of its own with its
  // spaces, reaches the chat as its copy there, which git leaves out; a folder, a file inside the chat's folder and one gone stay
  const BOARD = `${HOME}/Documents/Squid names/board.html`
  const COPY = `/repo/.claudopus-files/Documents/Squid names/board.html`
  files.set(BOARD, '<h1>Inky</h1>')
  files.set('/repo/notes.md', 'names')
  await $.agent.spawn({ ...spawn, description: 'Draw the board', prompt: 'draw it' } as never)
  agents.a2 = 'waiting'
  kinds.a2 = 'general-purpose'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6', agentId: 'a2', message: `The board is drawn.\n${BOARD}\nNotes: /repo/notes.md, folder ${HOME}/Documents, old ${HOME}/gone.html.` } as never)
  const given = await withMessage()
  expect(given).toContain(`  ${COPY}\n`)
  expect(given).not.toContain(BOARD)
  expect(given).toContain(`Notes: /repo/notes.md, folder ${HOME}/Documents, old ${HOME}/gone.html.`)
  expect(files.get(COPY)).toBe('<h1>Inky</h1>')
  expect(files.get('/repo/.claudopus-files/.gitignore')).toBe('*\n')
  // A file sent from outside the chat's folder is copied in, and the call refused with the copy to send instead, never changed on its
  // way; the copy sent goes, made again from its file as that is now; a file inside the chat's folder goes as it is
  files.set(BOARD, '<h1>Inky, Ink</h1>')
  files.delete(COPY)
  const sent = (await $.tool.call({ tool: 'SendUserFile', tool_use_id: 's1', files: [BOARD], status: 'normal' } as never)) as { deny?: string }
  expect(sent.deny).toContain(`${COPY} (a copy of ${BOARD})`)
  expect(sent.deny).toContain('Send the same call again with the copy in place of the original')
  expect(files.get(COPY)).toBe('<h1>Inky, Ink</h1>')
  files.set(BOARD, '<h1>Inky, Ink, Squirt</h1>')
  expect(((await $.tool.call({ tool: 'SendUserFile', tool_use_id: 's2', files: [COPY], status: 'normal' } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(files.get(COPY)).toBe('<h1>Inky, Ink, Squirt</h1>')
  expect(((await $.tool.call({ tool: 'SendUserFile', tool_use_id: 's3', files: ['/repo/notes.md'], status: 'normal' } as never)) as { deny?: string }).deny).toBeUndefined()
  expect(files.has('/repo/.claudopus-files/repo/notes.md')).toBe(false)
})
