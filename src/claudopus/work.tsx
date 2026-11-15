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
  for (const text of await scriptsRun($, command)) if (touchesBoxes(text)) return true
  return false
}
// The files a command runs, as filesRun finds them, each read (the first megabyte): the mod's own runners (bin/admin, bin/secret,
// bin/release, bin/keyring) are let through unread
const scriptsRun = async ($: EngineInterface, command: string) => {
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const root = $.plugin.root
  const texts: string[] = []
  for (const path of filesRun(command, home, cwd || home)) {
    const runner = /\/bin\/(admin|secret|release|keyring)$/.exec(path)?.[1]
    if (runner && (path === `${root}/bin/${runner}` || new RegExp(`^${home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.claude/plugins/cache/claudopus/claudopus/[^/]+/bin/(?:admin|secret|release|keyring)$`).test(path))) continue
    const text = (await readOr($, path)).slice(0, 1_000_000)
    if (runner && text && text === (await readOr($, `${root}/bin/${runner}`))) continue
    if (text) texts.push(text)
  }
  return texts
}
// A command, or a script it runs, that would print a kept key or password: read as written and with its quotes taken out
const readsKept = async ($: EngineInterface, command: string) =>
  [command, unquoted(command)].some(one => KEYCHAIN_READ.test(one)) || (await scriptsRun($, command)).some(text => KEYCHAIN_READ.test(text) || KEYCHAIN_READ.test(unquoted(text)))
// A tool call that writes a file of the memory folder only the mod writes (refused outright), or the person's own settings and texts
// by a command (refused: work changes those with Edit or Write, which wait for the person's press)
const writesOwnFiles = async ($: EngineInterface, e: { tool: string }): Promise<string> => {
  if (!dir) return ''
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (e.tool === 'Bash') {
    // The command as written and unquoted, and each script it runs
    const command = String(input.command ?? '')
    const texts = [command, ...(await scriptsRun($, command))].flatMap(one => [one, unquoted(one)])
    if (texts.some(one => writesMemory(one, MEMORY_OWN))) return NO_MEMORY
    if (texts.some(one => writesMemory(one, MEMORY_PERSON))) return NO_MEMORY_BASH()
    return ''
  }
  if (!['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const path = pathOf(String(input.file_path ?? input.notebook_path ?? ''), home, cwd || home).toLowerCase()
  const memory = dir.toLowerCase()
  return MEMORY_OWN.some(name => path === `${memory}/${name}` || path.startsWith(`${memory}/${name}/`)) ? NO_MEMORY : ''
}

// bin/keyring and its store, the runners' alone: on a Mac a way into the keychain, on Linux files that hold every kept password and
// key, the boxes' answers and the admin gate's key. A command that names the keyring runner or the store's folder (bin/keyring,
// keyring/…, "keyring"), and any tool that reads, searches or writes a path in that folder, or searches a folder of yours it is in,
// is refused. Commands that only name the word, such as `pip install keyring`, are refused with it. This stops slips and common
// tricks, as the boxes' guard does; it is no wall
const KEYRING_WORD = /(?:^|[\s'"=/;&|(`$])keyring(?:$|[\s'"/;&|)`])/i
const KEYRING_PATH = /claudopus\/keyring(?:\/|\b)|\.local\/share\/claudopus\b/i
const touchesKeyring = (e: { tool: string }) => {
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown; path?: unknown; pattern?: unknown; glob?: unknown }
  if (e.tool === 'Bash') {
    const command = String(input.command ?? '')
    // git and gh alone may name the word, so a commit message or a pull request can; never the store's folder
    return KEYRING_PATH.test(command) || (KEYRING_WORD.test(command) && !/^\s*(?:git|gh)\s[^;&|`$<>]*$/.test(command))
  }
  if (!['Read', 'Grep', 'Glob', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return false
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const roots = [keyringRoot, keyringOldRoot, `${home}/.local/share/claudopus/keyring`].filter(Boolean).map(one => one.toLowerCase())
  const isSearch = e.tool === 'Grep' || e.tool === 'Glob'
  if (isSearch && [input.pattern, input.glob].some(one => typeof one === 'string' && KEYRING_WORD.test(` ${one} `))) return true
  return [input.file_path, input.notebook_path, input.path, input.pattern, input.glob].some(one => {
    if (typeof one !== 'string' || !one) return false
    if (KEYRING_PATH.test(one)) return true
    const path = pathOf(one, home, cwd || home).toLowerCase().replace(/\/+$/, '')
    // A search from a folder of yours above the store reaches into it (ripgrep passes over hidden folders only from above your home)
    return roots.some(root => path === root || path.startsWith(`${root}/`) || (isSearch && path.length > home.length && root.startsWith(`${path}/`)))
  })
}

const workHooks = (on: On) => {

  // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
  on('tool.call', async ($, e, raw) => {
    // A prompt the call raised goes as the call ends: refused, interrupted, or allowed and run
    const run = async (call: typeof e) => {
      // What work runs, and what comes back of it, tells the stuck check whether it moves
      const isWatched = e.agentId !== undefined && Boolean(dir)
      if (isWatched) await callBegun($, e.tool_use_id, e.agentId ?? '', e.tool, e as never).catch(err => log($, `call not followed: ${String(err)}`))
      if (isWatched) callStarted(e.tool_use_id, await $.clock.now())
      let r: Awaited<ReturnType<typeof raw>> | undefined
      // The person's own files are compared with what they are known to hold as every call begins, and as a command ends: a change
      // is put back, and the work is told of what its command changed
      const isPersonWatched = e.tool === 'Bash' && Boolean(dir)
      const writes = FILE_TOOLS.includes(e.tool) ? personNamed(e) : ''
      if (dir) await personCheck($).catch(err => log($, `files not compared before a call: ${String(err)}`))
      const before = writes ? await personRead($, writes).catch(() => undefined) : undefined
      if (writes) personWriting.add(writes)
      let isPersonEnded = false
      try {
        r = await raw(call)
        if (isPersonWatched) {
          isPersonEnded = true
          const undone = await personCheck($, e).catch(() => [] as string[])
          if (undone.length && !r.deny) r = { ...r, context: [...(r.context ?? []), PERSON_UNDONE(undone)] } as typeof r
        }
        if (!r.deny) await personSeen($, e, before).catch(() => undefined)
        return r
      } finally {
        if (writes) personWriting.delete(writes)
        if (isPersonWatched && !isPersonEnded) await personCheck($, e).catch(() => undefined)
        if (isWatched) await callEnded($, e.tool_use_id, e.agentId ?? '', e.tool, r as never).catch(err => log($, `call end not followed: ${String(err)}`))
        asked = asked.filter(one => one.id !== e.tool_use_id)
        settle($, e.tool_use_id, e.agentId, e.tool, outcomeOf(r as never), e as never)
        // A grant its admin command did not take goes with the call; one sent to the background takes its own in its own time
        if (grants.length && !(e as { run_in_background?: unknown }).run_in_background) await dropGrants($, grants).catch(() => undefined)
        runnerEnded(e.tool_use_id, Boolean((e as { run_in_background?: unknown }).run_in_background), await $.clock.now())
        // A note of what the person allowed for this call goes as it ends
        await noteCallEnded($, e.tool_use_id).catch(() => undefined)
      }
    }
    let grants: string[] = []
    if (await isBoxesTouched($, e)) {
      await log($, `refused ${e.tool} touching the password and key boxes`)
      return { deny: NO_BOXES }
    }
    if ((e.tool === 'Bash' && (await readsKept($, String((e as { command?: unknown }).command ?? '')))) || touchesKeyring(e)) {
      await log($, 'refused a command that reads the keychain')
      return { deny: NO_READ }
    }
    // An ask for a key the list of keys has is told where that key is
    const keyKept = await keyAsked($, e).catch(() => '')
    if (keyKept) {
      await log($, `refused an ask for a key the list of keys has (${e.tool})`)
      return { deny: keyKept }
    }
    const ownFiles = await writesOwnFiles($, e)
    if (ownFiles) {
      await log($, `refused ${e.tool} writing the memory folder's own files`)
      return { deny: ownFiles }
    }
    // Main is reached only through the release runner, which takes its turn, so two pieces of work never release at once
    if (e.tool === 'Bash' && pushesMain(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that pushes or merges to main itself')
      return { deny: `${NO_PUSH} It is ${$.plugin.root}/bin/release.` }
    }
    // The list of admin commands always allowed, and what seals it, are the person's alone
    if (touchesGate(e) || (e.tool === 'Bash' && (await scriptsRun($, String((e as { command?: unknown }).command ?? ''))).some(text => touchesGate({ ...e, command: text } as never)))) {
      await log($, `refused ${e.tool} on the admin gate's own files`)
      return { deny: NO_GATE_TOUCH() }
    }
    if (e.tool === 'Bash' && [String((e as { command?: unknown }).command ?? ''), ...(await scriptsRun($, String((e as { command?: unknown }).command ?? '')))].some(movesRunner)) {
      await log($, `refused ${e.tool} running a runner of the mod with another home or without Claude Code's mark`)
      return { deny: NO_RUNNER_MOVED }
    }
    // An admin command waits for the person's press on its card, unless they chose never to be asked; a release always does, and so
    // does a change to the person's own settings and texts. Never for a call the chat's own thread is refused below: nothing is asked
    // or granted for a call that does not run
    const isRefusedHere = e.agentId === undefined && !isOff && Boolean(dir) && (await read($, me)).isChat && !OWN.includes(e.tool) && !OWN_SERVERS.some(prefix => e.tool.startsWith(prefix)) && !READS.includes(e.tool)
    if (e.tool === 'Bash' && !isRefusedHere) {
      const gated = await gateAdmin($, e, raw as never)
      // A call refused after a press (another of its commands denied, a grant not sealed) ends here: its note goes with it
      if (gated.deny) return (await callRefused($, e.tool_use_id), await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: gated.deny })
      grants = gated.grants
      const released = await gateRelease($, e, raw as never)
      if (released.deny) {
        await dropGrants($, grants)
        await callRefused($, e.tool_use_id)
        await noteCallEnded($, e.tool_use_id).catch(() => undefined)
        return { deny: released.deny }
      }
      grants = [...grants, ...released.grants]
      // A command that runs a runner may ask for a password or key in a box: the box is drawn only while one runs
      if ([String((e as { command?: unknown }).command ?? ''), ...(await scriptsRun($, String((e as { command?: unknown }).command ?? '')))].some(text => /\bbin\/(?:admin|secret)\b/.test(text))) runnerBegun(e.tool_use_id, String((e as { command?: unknown }).command ?? ''), await $.clock.now())
    }
    if (!isRefusedHere) {
      const fileSaid = await gateOwnFile($, e, raw as never)
      if (fileSaid) return (await dropGrants($, grants), await callRefused($, e.tool_use_id), await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: fileSaid })
    }
    // Work sent a message works again once the message is on its way: what it reported before no longer makes a stop a finish
    let woken = ''
    const next = async (call: typeof e) => {
      const r = await run(call)
      if (woken && !r.deny && !r.isError) await update($, todos, list => list.map(one => (one.id === woken && one.answeredAt ? { ...one, answeredAt: undefined } : one)))
      // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
      if (woken && !r.deny && !r.isError) await wakeCard($, woken)
      if (dir && e.agentId !== undefined && !r.deny && !r.isError) await keepBackground($, e.agentId, call as never, r.result).catch(err => log($, `background work not followed: ${String(err)}`))
      if (dir && e.agentId !== undefined && !r.deny && !r.isError && !(call as { run_in_background?: unknown }).run_in_background) await keepDetached($, e.agentId, call as never, r.result).catch(err => log($, `detached work not followed: ${String(err)}`))
      await keysLearn($, call, r).catch(err => log($, `keys not made again: ${String(err)}`))
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
    let isWhole = false
    if (dir && e.tool === 'SendMessage') {
      const to = String((e as { to?: unknown }).to ?? '')
      message = String((e as { message?: unknown }).message ?? '')
      const theirs = e.agentId === undefined ? heard.findLast(one => carries(message, one)) : undefined
      words = theirs ? quoted(theirs, 600) : ''
      // Their words and nothing more: else only the words quoted are told as theirs, and the rest as the chat's
      isWhole = Boolean(theirs) && isTheirsWhole(message, theirs ?? '')
      const now = await $.clock.now()
      const list = await read($, todos)
      const target = to ? (list.find(one => one.id === to) ?? list.find(one => to.startsWith(one.id))) : undefined
      // The chat passing on an answer the person gave on the card, which reached the work from there already, sends nothing: a
      // second copy started work that had ended again, with nothing to do but say it was done
      const given = target && e.agentId === undefined ? sentReplies.get(target.id) : undefined
      // Only the very words given on the card, to work that has asked nothing since: words for a newer question still go
      const isRepeat = Boolean(given?.isCard && (given.to === 'work' || given.to === 'read') && now - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text))
      if (given && target && isRepeat && !(target.ask && target.ask.at > given.at)) {
        await log($, `refused a second copy of an answer to ${target.id}`)
        return { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }
      }
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
      const line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole))
      if (!sent.deny) void tell($, steered, line).then(r => (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line }).catch(err => log($, `work ${steered} not told: ${String(err)}`)) : undefined))
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
    // No agent, the chat's or a work's helper, is started on an older model or on Haiku: one named so starts on its family's newest
    // (Haiku's is Sonnet), by its alias, which the Agent tool takes
    const askedModel = !isOff && e.tool === 'Agent' && (e as { subagent_type?: unknown }).subagent_type !== 'fork' ? String((e as { model?: unknown }).model ?? '') : ''
    const better = askedModel ? rightModel(askedModel) : undefined
    if (better) {
      const alias = (modelName(better).split(' ')[0] ?? '').toLowerCase()
      await log($, `an Agent call on ${modelName(askedModel)} starts on ${modelName(better)}`)
      return next({ ...e, model: alias } as typeof e)
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
        await dropBackground($, [stopId], 'stopped')
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
    if (grants.length) await dropGrants($, grants).catch(() => undefined)

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
    // A step the app sends to an older model or to Haiku after its safeguards flag a message is not moved back past the flag: the
    // work is ended there with a report that says so (FLAGGED), so its parent starts what is left again on a current model. An agent
    // that started on an older model or on Haiku itself (its own kind's model, or an alias the settings point at an older version)
    // has its steps go to that family's newest, or to the model the person picked. An agent whose start the mod did not see is left
    // where the app sent it, and its card says so
    // What it started on and whether it was flagged, kept in its card too so a reload of the mod forgets neither
    const card = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id) : undefined
    const own = id !== undefined ? (startedOn.get(id) ?? card?.startedOn) : undefined
    const isOwnOlder = id !== undefined && !flaggedOnce.has(id) && !card?.flagged && own !== undefined && Boolean(rightModel(own)) && modelName(own) === modelName(e.model)
    const isMovedByApp = id !== undefined && !isOff && Boolean(rightModel(e.model)) && !isOwnOlder
    if (isMovedByApp && own !== undefined && id !== undefined) {
      const n = (flaggedSteps.get(id) ?? 0) + 1
      flaggedSteps.set(id, n)
      flaggedOnce.add(id)
      if (n === 1) await log($, `work ${id} was flagged and the app would send it to ${modelName(e.model)}: it is ended with a report instead`)
      if (dir) {
        await update($, todos, list => list.map(one => (one.id === id ? { ...one, flagged: modelName(e.model), moved: undefined } : one)))
        await stopHelpers($, id).catch(() => undefined)
      }
      // Its report goes back through the handback tool; where that does not end it, a plain last answer, and past a few the work is
      // stopped as a press on Stop would
      if (n > 3) void $.tool.call({ tool: 'TaskStop', task_id: id }).catch(() => undefined)
      const text = FLAGGED(e.model)
      if (n === 1) {
        const call = `toolu_flagged_${id}`
        yield { kind: 'tool', index: 0, id: call, name: 'SubagentHandback' }
        yield { kind: 'input', index: 0, json: JSON.stringify({ message: text }) }
        yield { kind: 'stop', stopReason: 'tool_use', usage: null }
        return { turnId: e.turnId, index: e.index, answer: '', toolUses: [{ name: 'SubagentHandback', input: { message: text } }], stopReason: 'tool_use', usage: null }
      }
      yield { kind: 'text', index: 0, text }
      yield { kind: 'stop', stopReason: 'end_turn', usage: null }
      return { turnId: e.turnId, index: e.index, answer: text, toolUses: [], stopReason: 'end_turn', usage: null }
    }
    const instead = id !== undefined && !isOff && !isMovedByApp && !chosen ? rightModel(e.model) : undefined
    if (id !== undefined && (isMovedByApp || instead) && !sentElsewhere.has(`${id} ${e.model}`)) {
      sentElsewhere.add(`${id} ${e.model}`)
      await log($, `work ${id} was sent to ${modelName(e.model)} by the app: ${instead ? `its steps go to ${modelName(instead)}` : 'its steps stay there'}`)
    }
    // The card says so only while it holds: not once the app sends its steps to a right model again
    const moved = isMovedByApp ? modelName(e.model) : undefined
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.moved !== moved)) await update($, todos, list => list.map(one => (one.id === id ? { ...one, moved } : one)))
    // A pick the engine has since passed is its family's newest
    const pick = chosen ? (rightModel(chosen) ?? chosen) : undefined
    const to = pick && !isMovedByApp && modelName(pick) !== modelName(e.model) ? pick : instead
    const r = yield* next(to ? { ...e, model: to } : e)
    const tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0
    const model = (r.usage as { model?: string } | undefined)?.model
    if (model) seeModel(model)
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

  on('agent.spawn', async ($, asked, next) => {
    agentStarted($, asked.tool_use_id)
    // Every agent starts on a current model: one named an older model or Haiku on its family's newest, a copy of an agent on an
    // older model not at all, and one left to its parent's model, when that is older, on that family's newest. A check of what was
    // built, by a helper or a workflow's agent, runs on a model never weaker than its parent's, and at least on Opus
    const start = isOff || asked.resume ? undefined : startModel(asked)
    if (start?.deny) {
      await log($, `refused a copy of an agent on ${modelName(String(asked.parentModel ?? ''))}`)
      return { deny: start.deny }
    }
    if (start?.model) await log($, `${asked.workflow ? 'a workflow agent' : 'an agent'} asked to run on ${modelName(asked.model ?? '') || `its parent's ${modelName(String(asked.parentModel ?? '')) || 'model'}`} starts on ${modelName(start.model)}`)
    const e = start?.model ? { ...asked, model: start.model } : asked
    // An agent a workflow's script starts belongs to its run's blue card, not a card of its own
    if (e.workflow) {
      const r = await next(e)
      if (r.model) seeModel(r.model)
      if (r.agentId && r.model && !e.resume) startedOn.set(r.agentId, r.model)
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
    if (r.model) seeModel(r.model)
    // A resumed agent keeps the model it first started on, or none: the model it resumes on may be one the app moved it to after a flag. A
    // flagged one goes on to its next report afresh
    if (r.agentId && r.model && !e.resume) startedOn.set(r.agentId, r.model)
    if (r.agentId && e.resume) flaggedSteps.delete(r.agentId)
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
      return capped([...list.filter(one => one.id !== id), { ...(old ? resumed(old, now) : fresh), model: old?.chosen ?? r.model, startedOn: old?.startedOn ?? (e.resume ? undefined : r.model) }])
    })
    if (isOwn) await openList($)
    if (!isOwn) await writeRolls($, true).catch(err => log($, `helpers not written: ${String(err)}`))
    await sync($).catch(() => undefined)

    return r
  })

}

