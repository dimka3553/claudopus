// Work starting and running: the chat's own thread kept to reading and handing work over, how full the chat is, each step of work, and new
// work's card

// A call that writes into the runners' boxes folder or reads their keychain service: a command that names them, a file it runs that
// does, or a file written or edited there. The runners themselves, the mod's own bin/admin and bin/secret, are what may
const isBoxesTouched = async ($: EngineInterface, e: { tool: string }): Promise<boolean> => {
  if (!dir) return false
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) {
    // in small letters, as this Mac's files take any; and a runner of the mod's planted where its copies are let through unread
    const path = pathOf(String(input.file_path ?? input.notebook_path ?? ''), home, cwd || home).toLowerCase()
    const boxes = boxesDir().toLowerCase()
    return path === boxes || path.startsWith(`${boxes}/`) || path.startsWith(`${home.toLowerCase()}/.claude/plugins/cache/claudopus/`)
  }
  if (e.tool !== 'Bash') return false
  const command = String(input.command ?? '')
  if (touchesBoxes(command)) return true
  const root = $.plugin.root
  for (const path of filesRun(command, home, cwd || home)) {
    const runner = /\/bin\/(admin|secret)$/.exec(path)?.[1]
    if (runner && (path === `${root}/bin/${runner}` || new RegExp(`^${home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.claude/plugins/cache/claudopus/claudopus/[^/]+/bin/(?:admin|secret)$`).test(path))) continue
    const text = (await readOr($, path)).slice(0, 1_000_000)
    if (runner && text && text === (await readOr($, `${root}/bin/${runner}`))) continue
    if (touchesBoxes(text)) return true
  }
  return false
}

const workHooks = (on: On) => {

  // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
  on('tool.call', async ($, e, raw) => {
    // A prompt the call raised goes as the call ends: refused, interrupted, or allowed and run
    const run = async (call: typeof e) => {
      // What work runs, and what comes back of it, tells the stuck check whether it moves
      const isWatched = e.agentId !== undefined && Boolean(dir)
      if (isWatched) await callBegun($, e.tool_use_id, e.agentId ?? '', e.tool).catch(err => log($, `call not followed: ${String(err)}`))
      if (isWatched) callStarted(e.tool_use_id, await $.clock.now())
      let r: Awaited<ReturnType<typeof raw>> | undefined
      try {
        r = await raw(call)
        return r
      } finally {
        if (isWatched) await callEnded($, e.tool_use_id, e.agentId ?? '', e.tool, r as never).catch(err => log($, `call end not followed: ${String(err)}`))
        asked = asked.filter(one => one.id !== e.tool_use_id)
        settle($, e.tool_use_id, e.agentId, e.tool)
        // A grant its admin command did not take goes with the call; one sent to the background takes its own in its own time
        if (grants.length && !(e as { run_in_background?: unknown }).run_in_background) await dropGrants($, grants).catch(() => undefined)
      }
    }
    let grants: string[] = []
    if (await isBoxesTouched($, e)) {
      await log($, `refused ${e.tool} touching the password and key boxes`)
      return { deny: NO_BOXES }
    }
    if (e.tool === 'Bash' && KEYCHAIN_READ.test(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that reads the keychain')
      return { deny: NO_READ }
    }
    // Main is reached only through the release runner, which takes its turn, so two pieces of work never release at once
    if (e.tool === 'Bash' && pushesMain(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that pushes or merges to main itself')
      return { deny: `${NO_PUSH} It is ${$.plugin.root}/bin/release.` }
    }
    // The list of admin commands always allowed, and what seals it, are the person's alone
    if (touchesGate(e)) {
      await log($, `refused ${e.tool} on the admin gate's own files`)
      return { deny: NO_GATE_TOUCH() }
    }
    // An admin command waits for the person's press on its card, unless they chose never to be asked
    if (e.tool === 'Bash') {
      const gated = await gateAdmin($, e, raw as never)
      if (gated.deny) return { deny: gated.deny }
      grants = gated.grants
    }
    // Work sent a message works again once the message is on its way: what it reported before no longer makes a stop a finish
    let woken = ''
    const next = async (call: typeof e) => {
      const r = await run(call)
      if (woken && !r.deny && !r.isError) await update($, todos, list => list.map(one => (one.id === woken && one.answeredAt ? { ...one, answeredAt: undefined } : one)))
      // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
      if (woken && !r.deny && !r.isError) await wakeCard($, woken)
      if (dir && e.agentId !== undefined && !r.deny && !r.isError) await keepBackground($, e.agentId, call as never, r.result).catch(err => log($, `background work not followed: ${String(err)}`))
      return hideKept($, call, r)
    }
    // A message of the person's that the chat's own thread passes on to work under way is a steer: that work is told so, and owes
    // a line saying what it decided. It is kept by the card in their words. Any other message to work under way, a helper's reply,
    // one between pieces of work or the chat's own note, is told as its sender's
    let steered = ''
    let from = ''
    let answered = ''
    let answer: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number } | undefined
    let message = ''
    let woke = ''
    let words = ''
    if (dir && e.tool === 'SendMessage') {
      const to = String((e as { to?: unknown }).to ?? '')
      message = String((e as { message?: unknown }).message ?? '')
      const theirs = e.agentId === undefined ? heard.findLast(one => carries(message, one)) : undefined
      words = theirs ? quoted(theirs, 600) : ''
      const now = await $.clock.now()
      const list = await read($, todos)
      const target = to ? (list.find(one => one.id === to) ?? list.find(one => to.startsWith(one.id))) : undefined
      // The person's words passed on to work whose card asks them something answer that ask, as a press on the card does: the card's
      // own work, or the helper that asked. Marked at once, so a press on the card at the same moment counts once; undone if refused
      const asking = target && words && e.agentId === undefined ? (list.find(one => one.id === target.id && one.ask) ?? list.find(one => one.ask?.from === target.id)) : undefined
      const asked = asking?.ask ? `${asking.id}:${asking.ask.at}:${asking.ask.text}` : ''
      if (asking?.ask && !answeredAsks.has(asked)) {
        answeredAsks.add(asked)
        answered = asking.ask.text
        answer = { card: asking, ask: asking.ask, key: asked, words, at: now }
      }
      if (target) {
        woken = target.id
        // Their words are theirs whether the work is under way or is started again by them: ended work is told whose they are
        const isSteer = target.status === 'working' && Boolean(words) && !answered
        if (target.status !== 'working' && words && !answered) woke = words
        if (target.status === 'working' && message && !isSteer) {
          const sender = list.find(one => one.id === e.agentId)
          const title = (one?: Todo) => (one?.title ? ` "${cut(oneLine(one.title), 60)}"` : '')
          from =
            e.agentId === undefined
              ? 'the chat'
              : sender?.parentId === target.id
                ? `your helper${title(sender)}`
                : target.parentId === e.agentId
                  ? 'the work that started you'
                  : `the work${title(sender)}`
        }
        await update($, todos, list =>
          list.map(one =>
            one.id !== target.id
              ? one
              : {
                  ...one,
                  owes: isSteer ? 0 : one.owes,
                  entries: words && one.entries.at(-1)?.text !== words ? [...one.entries, { at: now, kind: 'steer' as const, text: words }].slice(-ENTRIES_KEPT) : one.entries,
                },
          ),
        )
        if (isSteer || from || answered || woke) steered = target.id
      }
    }
    if (e.agentId !== undefined) {
      const id = e.agentId
      // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
      if (e.tool === 'Agent') helperCalls.set(e.tool_use_id, id)
      endedByHandback.delete(id)
      stoppedHere.delete(id)
      // Work that calls a tool is working: a card that had ended is back. Its steps are counted: to place a steer among them,
      // to see that a steer got its decision, and to see that its to-dos are still being kept
      if (dir) {
        const now = await $.clock.now()
        const isKeeping = isTool(e.tool, 'todo') || isTool(e.tool, 'note')
        let nudge = ''
        await update($, todos, list =>
          list.map(one => {
            if (one.id !== id) return one
            const base = { ...(one.status === 'working' ? one : resumed(one, now)), steps: (one.steps ?? 0) + 1, answeredAt: undefined, waitsSince: undefined }
            if (isKeeping) return { ...base, quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes }
            const owes = one.owes === undefined ? undefined : one.owes + 1
            const quiet = (one.quiet ?? 0) + 1
            const isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS
            nudge = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : ''
            return { ...base, owes, quiet: isQuiet ? 0 : quiet }
          }),
        )
        if (nudge) void tell($, id, nudge)
      }
    }
    // The steer is sent as it was written; once it is on its way, the work it goes to is told what a steer asks of it
    if (steered) {
      const sent = await next(e)
      if (answer) await answeredInChat($, answer, steered, !sent.deny && !sent.isError)
      // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
      // message of its own instead, read once it reaches it
      // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
      // chat's own note that landed after the person's words once marked their words as not theirs
      const line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true))) : woke ? WOKE(woke) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words))
      if (!sent.deny) void tell($, steered, line).then(r => (!r || r.deny ? $.session.send({ to: { agentId: steered }, text: line }).catch(err => log($, `work ${steered} not told: ${String(err)}`)) : undefined))
      return sent
    }
    // A report handed back is kept as the turn's answer only once the handback went through: refused, the work carries on
    if (e.agentId !== undefined && String(e.tool) === 'SubagentHandback') {
      const hold = await holdAtStop($, e.agentId, 'handback').catch(() => '')
      if (hold) return { deny: hold }
      const r = await next(e)
      if (!r.deny && !r.isError) handedBack.set(e.agentId, String((e as { message?: unknown }).message ?? '').trim())
      return r
    }
    // No agent, the chat's or a work's helper, is started on an older model or on Haiku
    if (!isOff && e.tool === 'Agent' && rightModel(String((e as { model?: unknown }).model ?? ''))) {
      const wrong = String((e as { model?: unknown }).model)
      await log($, `refused an Agent call on ${modelName(wrong)}`)
      return { deny: WRONG_MODEL(wrong) }
    }
    if (e.agentId !== undefined) return next(e)
    if (isOff || !(await read($, me)).isChat) return next(e)
    // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
    if (e.tool === 'Agent') {
      const call = e as unknown as { subagent_type?: unknown; model?: unknown }
      if (call.subagent_type === 'fork' || !String(call.model ?? '').trim()) {
        await log($, `refused an Agent call ${call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'}`)
        return { deny: NO_COPY() }
      }
    }
    // Work the chat stops ends at once, as a press on Stop ends it: done when it had already given its report
    if (e.tool === 'TaskStop' && dir) {
      const r = await next(e)
      const stopId = String((e as { task_id?: unknown }).task_id ?? '')
      if (!r.deny && stopId) {
        stoppedHere.add(stopId)
        await stopHelpers($, stopId)
        await dropBackground($, [stopId])
        const now = await $.clock.now()
        await update($, todos, list => list.map(one => (one.id === stopId && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now) : one.id === stopId && one.leftSince ? { ...one, leftSince: undefined } : one)))
        await keepStoppedReports($, now)
        await lookEnds($)
      }
      return r
    }
    if (OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return next(e)
    // The chat reads for itself: a kept report to answer from, or the few files a question needs. A saved paste stays out of it:
    // the agent that needs it reads it
    const readPath = String((e as { file_path?: unknown; path?: unknown }).file_path ?? (e as { path?: unknown }).path ?? '')
    const isPaste = Boolean(dir) && (readPath === `${dir}/pastes` || readPath.startsWith(`${dir}/pastes/`))
    if (READS.includes(e.tool) && !isPaste) return next(e)
    await log($, `refused ${e.tool} in a chat's own thread`)

    return { deny: REFUSED }
  })

  // How full this chat's context is, as the app counts it, each time it moves
  on('session.measure', async ($, e, next) => {
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    const tokens = e.context.tokens
    if (tokens !== undefined) await update($, me, one => (one.tokens === tokens && one.window ? one : { ...one, tokens, window: one.window || e.context.window }))

    return next(e)
  })

  // How full a piece of work's context is, and which model it runs on: what the API reports when a response of its ends.
  // The response itself passes through untouched and unread; only the count and the model's name are kept
  // Work the person moved to another model sends each step from then on to that model; only the model the request names changes
  on('turn.step', async function* ($, e, next) {
    const id = e.agentId
    if (id !== undefined) replyRead($, id)
    // Work that takes a step again after its report is working again: stopped from now, it is stopped
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.answeredAt)) await update($, todos, list => list.map(one => (one.id === id ? { ...one, answeredAt: undefined } : one)))
    const chosen = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id)?.chosen : undefined
    // A step the app sends to an older model or to Haiku (it moves work to an older model after its safeguards flag a message) goes
    // to a model work runs on instead, and the work's card says which model it was kept off
    const instead = id !== undefined && !chosen && !isOff ? rightModel(e.model) : undefined
    if (id !== undefined && instead && !sentElsewhere.has(`${id} ${e.model}`)) {
      sentElsewhere.add(`${id} ${e.model}`)
      await log($, `work ${id} was sent to ${modelName(e.model)} by the app: its steps go to ${modelName(instead)}`)
    }
    // The card says so only while it holds: not once the app sends its steps to a right model again, or the person picked one
    const moved = instead ? modelName(e.model) : undefined
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.moved !== moved)) await update($, todos, list => list.map(one => (one.id === id ? { ...one, moved } : one)))
    const to = chosen && modelName(chosen) !== modelName(e.model) ? chosen : instead
    const r = yield* next(to ? { ...e, model: to } : e)
    const tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0
    const model = (r.usage as { model?: string } | undefined)?.model
    if (id !== undefined && tokens && flowAgents.has(id)) await flowStep($, id, tokens, model).catch(() => undefined)
    if (id !== undefined && tokens && dir) await update($, todos, list => list.map(one => (one.id === id ? { ...one, tokens, model: one.chosen ?? (modelName(model ?? '') ? model : one.model) } : one)))

    return r
  })

  // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
  on('classic.SubagentStop', async ($, e, next) => {
    const r = await next(e)
    const hold = r.block ? '' : await holdAtStop($, e.agent_id, 'stop').catch(() => '')
    if (hold) return { ...r, block: hold }
    const live = e.background_tasks
    if (dir && Array.isArray(live)) {
      const ids = new Set(live.map(one => one.id))
      const gone = ((await read($, todos)).find(one => one.id === e.agent_id)?.bg ?? []).filter(b => !ids.has(b.id)).map(b => b.id)
      if (gone.length) await dropBackground($, gone).catch(err => log($, `ended background work not let go: ${String(err)}`))
    }
    return r
  })

  on('agent.spawn', async ($, e, next) => {
    // An agent a workflow's script starts belongs to its run's blue card, not a card of its own
    if (e.workflow) {
      const r = await next(e)
      if (r.agentId && dir) await flowSpawned($, e.workflow.runId, r.agentId, modelName(r.model ?? '') ? r.model : e.model || r.model || '', e.description ?? '').catch(err => log($, `workflow agent not kept: ${String(err)}`))
      return r
    }
    const parentId = e.parentAgentId ?? helperCalls.get(e.tool_use_id) ?? ''
    // Only what the chat's own thread starts is a to-do; what a piece of work starts is its helper
    const isOwn = !parentId
    // Work the chat starts is told to keep its to-do true; one that goes on after a message already knows
    const isTold = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow && (await read($, me)).isChat
    // and is handed, after its brief, the rules every piece of work follows and where the chat's words are, so the brief stays short
    // and where the runner is that does an admin command with a Mac's kept password
    const work = isTold ? named(fillModels((await inForce($, $.plugin.root, dir, 'roles/work.md')).text, models)).replace(/\{admin\}/g, `${$.plugin.root}/bin/admin`).replace(/\{secret\}/g, `${$.plugin.root}/bin/secret`).replace(/\{release\}/g, `${$.plugin.root}/bin/release`).trim() : ''
    const words = isTold ? `- The chat's saved words, ${who()}'s messages word for word: ${dir}/words/${(await read($, me)).id}.md` : ''
    const isBackground = isHelperSpawn(e)
    const r = await next(isTold ? { ...e, prompt: `${e.prompt}\n\n${workHead()}\n${words}\n${work}\n\n${named(PANEL_RULE)}` } : isBackground ? { ...e, background: true } : e)
    if (isBackground && r.agentId) await log($, `helper ${r.agentId} of ${e.parentAgentId} runs in the background`)
    if (!dir || !r.agentId) return r
    const id = r.agentId
    endedByHandback.delete(id)
    const now = await $.clock.now()
    // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
    // several, or one on something else, only reads them
    const named1 = isOwn && !fromReport && !e.resume ? (await read($, reports)).filter(one => e.prompt.includes(`reports/${one.id}/`) || e.prompt.endsWith(`reports/${one.id}`)) : []
    const goesOn = named1.length === 1 && named1[0] && [...aboutWords(named1[0].title)].some(word => aboutWords(e.description ?? '').has(word)) ? named1[0].id : ''
    const from = fromReport || goesOn
    await update($, todos, list => {
      const old = list.find(one => one.id === id)
      // Its title is the few words the task was given; under it, the person's message as they wrote it
      const fresh = { ...started(id, parentId, e.description ?? '', isOwn ? said : '', now, e.fork), ...(isOwn && from ? { from } : {}) }
      return capped([...list.filter(one => one.id !== id), { ...(old ? resumed(old, now) : fresh), model: old?.chosen ?? r.model }])
    })
    if (isOwn) await openList($)
    if (!isOwn) await writeRolls($, true).catch(err => log($, `helpers not written: ${String(err)}`))
    await sync($).catch(() => undefined)

    return r
  })

}

