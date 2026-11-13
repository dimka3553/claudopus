// Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds

// ---- Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds ----
// Each run is kept by the session that runs it in ~/.claude/claudopus/flows/<run id>.json; the chat that started that session
// reads it from there, so a workflow run in a session of its own shows in the chat's panel too

const flows = atom({ plugin: 'claudopus', key: 'flows' } as const, [], { shape: 'flows-1' })
// The app's ids of this session and of the session that started it. Outside the app there are none, and a run is named by the
// engine's id of this session
let ccd = { id: '', parent: '' }
// A model named by its alias, as a script names it, is the version the panel offers
const fullModel = (id: string) => (/^(opus|sonnet|fable)$/i.test(id.trim()) ? (MODELS.find(one => one.includes(id.trim().toLowerCase())) ?? id) : id)
const sessionName = async ($: EngineInterface) => ccd.id || `engine:${(await read($, me)).id}`
// The agents of each run, by agent id: what their responses report goes to their run
const flowAgents = new Map<string, string>()
// What each run this session runs was when its file was last written
const flowSaved = new Map<string, string>()
const flowsDir = () => `${dir}/flows`
const flowPath = (id: string) => `${flowsDir()}/${id.replace(/[^A-Za-z0-9_-]/g, '-')}.json`
// A running workflow's journal is read this often, and its card's time moves each second
const FLOW_EVERY = 2000
// How many runs the panel keeps, ended ones included; and how many looks pass between two reads of this chat for a run's end
const FLOWS_KEPT = 20
const END_LOOK = 5
// A run of another session whose file has not changed for this long has lost its session; one older than a day is not looked at again
const FLOW_STALE = 30 * 60_000
const FLOW_OLD = 24 * 3600_000
// The agent of each workflow's Details tab whose chat it shows, by the run
const flowPicked = new Map<string, string>()
// Each workflow agent's chat as last read from its transcript, by the agent
const flowTalks = new Map<string, { key: string; lines: Line[] | undefined }>()

const knowSession = async ($: EngineInterface) => {
  try {
    const one = JSON.parse(textOf(await $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' }))) as { sessionId?: string; parentSessionId?: string }
    ccd = { id: one.sessionId ?? '', parent: one.parentSessionId ?? '' }
  } catch {
    // Outside the desktop app a run is this session's alone
  }
}
const isFlowMine = async ($: EngineInterface, f: Flow) => f.session === (await sessionName($))
// A run this panel shows: one this session runs, or one a session this chat started runs
const isFlowShown = (f: Flow, mine: string) => f.session === mine || Boolean(ccd.id && f.parent === ccd.id)

// Writes a run this session runs to its file when it changed
const saveFlow = async ($: EngineInterface, f: Flow) => {
  if (!dir || !(await isFlowMine($, f))) return
  const text = JSON.stringify(f)
  if (flowSaved.get(f.id) === text) return
  await $.fs.write(`${dir}/flows/${f.id.replace(/[^A-Za-z0-9_-]/g, '-')}.json`, `${text}\n`)
  flowSaved.set(f.id, text)
}
const changeFlow = async ($: EngineInterface, id: string, fn: (f: Flow, at: number) => Flow) => {
  const now = await $.clock.now()
  const list = await update($, flows, all => all.map(f => (f.id === id ? fn(f, now) : f)))
  const f = list.find(one => one.id === id)
  if (f) await saveFlow($, f).catch(err => log($, `workflow ${id} not kept: ${String(err)}`))
  await lookEnds($)
}
const keptFlows = (list: Flow[]) => {
  let over = list.length - FLOWS_KEPT
  return over > 0 ? [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt)).filter(f => f.status === 'working' || (over -= 1) < 0) : list
}

// The Workflow tool started a run: its card comes up, from the call's own script and args and what the tool answered
const flowStarted = async ($: EngineInterface, input: { script?: unknown; scriptPath?: unknown; name?: unknown; args?: unknown }, answer: { taskId?: string; runId?: string; transcriptDir?: string; scriptPath?: string; workflowName?: string }) => {
  if (!dir || !answer.runId || !answer.taskId) return
  const path = typeof input.scriptPath === 'string' ? input.scriptPath : answer.scriptPath ?? ''
  const script = typeof input.script === 'string' ? input.script : path ? await readOr($, path) : ''
  const meta = metaOf(script)
  const now = await $.clock.now()
  const args = input.args
  const task = args && typeof args === 'object' && typeof (args as { task?: unknown }).task === 'string' ? String((args as { task: string }).task) : typeof args === 'string' ? args : ''
  const f: Flow = {
    id: answer.runId,
    taskId: answer.taskId,
    title: titleOfFlow(args, { name: meta.name || answer.workflowName || String(input.name ?? ''), description: meta.description }),
    name: meta.name || answer.workflowName || String(input.name ?? ''),
    description: meta.description,
    phases: meta.phases.map(p => (p.model ? { ...p, model: fullModel(p.model) } : p)),
    // The rounds script's own cap: 3 when none is given, at most 5
    ...((capOf(args) ?? (meta.name === 'rounds' ? 3 : undefined)) ? { cap: meta.name === 'rounds' ? Math.min(capOf(args) ?? 3, 5) : capOf(args) } : {}),
    task: task.trim().slice(0, 4000),
    words: said.trim().slice(0, 4000),
    session: await sessionName($),
    parent: ccd.parent,
    transcriptDir: answer.transcriptDir ?? '',
    startedAt: now,
    endedAt: 0,
    status: 'working',
    agents: flowEarly.get(answer.runId) ?? [],
    result: '',
  }
  flowEarly.delete(answer.runId)
  await update($, flows, list => keptFlows([...list.filter(one => one.id !== f.id), f]))
  await saveFlow($, f).catch(err => log($, `workflow ${f.id} not kept: ${String(err)}`))
  await openList($)
}

// The agents that started before their run's card existed, by the run
const flowEarly = new Map<string, FlowAgent[]>()
// An agent the script started: its model now, its label and stage once the journal names them
const flowSpawned = async ($: EngineInterface, runId: string, agentId: string, model: string, label: string) => {
  flowAgents.set(agentId, runId)
  // An agent that starts before the tool has answered with its run waits for the run's card
  if (!(await read($, flows)).some(f => f.id === runId)) {
    const now = await $.clock.now()
    flowEarly.set(runId, [...(flowEarly.get(runId) ?? []).filter(one => one.id !== agentId), { id: agentId, label: label.trim(), phase: '', status: 'working', at: now, model: fullModel(model) || undefined }])
    return
  }
  await changeFlow($, runId, (f, at) => {
    const was = f.agents.find(one => one.id === agentId)
    const agent: FlowAgent = { ...(was ?? { id: agentId, label: label.trim(), phase: '', status: 'working' as const, at }), model: fullModel(model) || was?.model }
    return { ...f, agents: was ? f.agents.map(one => (one.id === agentId ? agent : one)) : [...f.agents, agent] }
  })
}
// A response of a workflow's agent ended: how full its context is, and its model
const flowStep = async ($: EngineInterface, agentId: string, tokens: number, model: string | undefined) => {
  const runId = flowAgents.get(agentId)
  if (!runId) return
  await changeFlow($, runId, f => ({ ...f, agents: f.agents.map(one => (one.id === agentId ? { ...one, tokens, model: modelName(model ?? '') ? model : one.model } : one)) }))
}
// The run ended: how, and what it returned
const flowEnded = async ($: EngineInterface, text: string) => {
  for (const f of (await read($, flows)).filter(one => one.status === 'working')) {
    const end = endOf(text, f.taskId)
    if (!end || !(await isFlowMine($, f))) continue
    await readJournal($, f.id)
    await changeFlow($, f.id, (one, at) => ({ ...one, status: end.status, result: end.result || one.result, endedAt: at }))
  }
}
const stopFlow = async ($: EngineInterface, id: string) => {
  const f = (await read($, flows)).find(one => one.id === id)
  if (!f || f.status !== 'working') return
  pressed.add(`flow:${id}`)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: f.taskId }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (pressed.delete(`flow:${id}`), log($, `workflow ${id} not stopped: ${r.deny}`))
  await changeFlow($, id, (one, at) => ({ ...one, status: 'stopped', endedAt: at }))
}
const readJournal = async ($: EngineInterface, id: string) => {
  const f = (await read($, flows)).find(one => one.id === id)
  if (!f?.transcriptDir) return
  const text = await readOr($, `${f.transcriptDir}/journal.jsonl`)
  if (!text) return
  const now = await $.clock.now()
  await changeFlow($, id, one => withJournal(one, journalOf(text), now))
}
// Keeps the runs true: each running one of this session's is read from its journal, its end looked for in this chat's own record
// (a reload misses the notice as it arrives), and the runs of the sessions this chat started are read from their files
let flowLooks = 0
const followFlows = async ($: EngineInterface) => {
  if (!dir || (!ccd.id && !(await read($, flows)).length)) return
  flowLooks += 1
  const mine = await sessionName($)
  const running = (await read($, flows)).filter(f => f.status === 'working' && f.session === mine)
  for (const f of running) await readJournal($, f.id).catch(err => log($, `journal of ${f.id} not read: ${String(err)}`))
  if (running.length && flowLooks % END_LOOK === 0) {
    const rows = await $.session.messages().catch(() => [])
    for (const row of Array.isArray(rows) ? rows : []) if (row.role === 'user' && row.text.includes('<task-notification')) await flowEnded($, row.text)
  }
  // The runs of other sessions: those this chat started, read again while they run
  if (ccd.id && (flowLooks % END_LOOK === 1 || (await read($, flows)).some(f => f.status === 'working' && f.session !== mine))) {
    const found: Flow[] = []
    const now = await $.clock.now()
    for (const entry of await $.fs.list(flowsDir()).catch(() => [])) {
      if (!entry.name.endsWith('.json')) continue
      const known = (await read($, flows)).find(f => flowPath(f.id).endsWith(`/${entry.name}`))
      if (known && (known.status !== 'working' || known.session === mine)) continue
      // A file not written for a day is an old run, read once at load at most
      const stat = await $.fs.stat(`${flowsDir()}/${entry.name}`).catch(() => undefined)
      if (!known && stat && now - stat.mtimeMs > FLOW_OLD) continue
      try {
        const read1 = JSON.parse(await readOr($, `${flowsDir()}/${entry.name}`)) as Flow
        // A run its session has not written for this long has lost its session: it shows as stopped
        const one = read1.status === 'working' && stat && now - stat.mtimeMs > FLOW_STALE ? { ...read1, status: 'stopped' as const, endedAt: stat.mtimeMs } : read1
        if (one.id && one.parent === ccd.id && one.session !== mine) found.push(one)
      } catch {
        // A file being written is read at the next look
      }
    }
    if (found.length) await update($, flows, list => keptFlows([...list.filter(f => !found.some(one => one.id === f.id)), ...found]))
  }
}
// The runs this session ran before a reload or a restart come back from their files
const loadFlows = async ($: EngineInterface) => {
  const mine = await sessionName($)
  const found: Flow[] = []
  for (const entry of await $.fs.list(flowsDir()).catch(() => [])) {
    if (!entry.name.endsWith('.json')) continue
    try {
      const one = JSON.parse(await readOr($, `${flowsDir()}/${entry.name}`)) as Flow
      if (one.id && isFlowShown(one, mine)) found.push(one)
    } catch {
      // Not a run's file
    }
  }
  for (const f of found) flowSaved.set(f.id, JSON.stringify(f))
  // The agents of the runs still going: their responses go on reaching their card
  for (const f of found) if (f.status === 'working') for (const one of f.agents) flowAgents.set(one.id, f.id)
  if (found.length) await update($, flows, list => keptFlows([...found.filter(one => !list.some(f => f.id === one.id)), ...list]))
}
const openFlow = ($: EngineInterface, id: string) => {
  presses += 1
  void (async () => {
    const f = (await read($, flows)).find(one => one.id === id)
    if (!f) return
    if (!(await $.ui.panes()).some(pane => pane.id === flowPaneOf(id))) (flowPicked.delete(id), pictureIn.delete(flowPaneOf(id)))
    await front($, flowPaneOf(id), cut(f.title, 30))
    redraw($)
  })().catch(err => log($, `workflow ${id} not opened: ${String(err)}`))
}
// The agent whose chat a workflow's Details tab shows: the one pressed, else the one at work, else the last
const pickedOf = (f: Flow) => f.agents.find(one => one.id === flowPicked.get(f.id)) ?? [...f.agents].reverse().find(one => one.status === 'working') ?? f.agents.at(-1)
// A workflow agent's chat, read from its transcript in the run's folder when it has moved
const flowTalkOf = async ($: EngineInterface, f: Flow, agent: FlowAgent) => {
  const key = [agent.id, agent.status, agent.tokens ?? 0].join(':')
  if (flowTalks.get(agent.id)?.key !== key) {
    const text = f.transcriptDir ? await readOr($, `${f.transcriptDir}/agent-${agent.id}.jsonl`) : ''
    flowTalks.set(agent.id, { key, lines: text ? talkOf(rowsOf(text)) : undefined })
  }
  return flowTalks.get(agent.id)?.lines
}

const workflowHooks = (on: On) => {

  // A run of the Workflow tool: its card comes up from the call and what the tool answered. The call goes on as made
  on('tool.call', { tool: 'Workflow' }, async ($, e, next) => {
    const r = await next(e)
    const answer = (r.result ?? undefined) as { status?: string; taskId?: string; runId?: string; transcriptDir?: string; scriptPath?: string; workflowName?: string; error?: string } | undefined
    if (!r.deny && !r.isError && answer && !answer.error && answer.status === 'async_launched')
      await flowStarted($, e as unknown as { script?: unknown; scriptPath?: unknown; name?: unknown; args?: unknown }, answer).catch(err => log($, `workflow not followed: ${String(err)}`))
    return r
  })

}

