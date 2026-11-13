// The chat's own life: its start and end, each message and reply, compaction, and what it is told

// How full this chat's context is, against the window the app's own panel measures it by
const measure = async ($: EngineInterface) => {
  const context = (await $.session.usage({ breakdown: 'summary' }).catch(() => undefined))?.context
  const window = context?.breakdown?.rawMaxTokens ?? context?.window
  return update($, me, one => ({ ...one, tokens: context?.tokens ?? one.tokens, window: window ?? one.window }))
}

// ---- After each reply: the size, the answer, the asks and the title ----

const afterReply = async ($: EngineInterface, text: string, answer: string) => {
  await measure($)
  const title = await appTitle($)
  const m = await update($, me, one => ({ ...one, title: title || one.title }))
  // A server is looked for while the chat that started it is still above it
  await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
  // What Claude answered is kept beside what the person said, so a search finds what happened as well as what was asked
  if (answer.trim()) {
    await appendWords($, m.id, `### Claude ${new Date().toISOString()}\n${answer.trim()}\n\n`).catch(err => log($, `answer not saved: ${String(err)}`))
  }
  // A reply with no message of the person's before it relays an agent's result: it is logged when it says something
  const isRelay = !text.trim()
  if (isRelay && answer.trim().length < 200) return

  const r = await $.model.complete({
    model: 'sonnet',
    system: ASKS_SYSTEM,
    prompt: `Current title: ${m.title || '(none)'}\n\nUser message:\n"""\n${isRelay ? '(none: this reply relays the result of a background agent)' : clip(text, 3000)}\n"""\n\nAssistant reply (shortened):\n"""\n${clip(answer, isRelay ? 1500 : 600)}\n"""`,
    maxTokens: 500,
  })
  if (!r.isAnswered) return
  const lines = r.text.split('\n').map(line => line.trim())
  // The index of this chat: what was asked and what came of it, one line each under the time it happened
  const asks = lines.filter(line => line.startsWith('- ') || /^did:/i.test(line))
  if (asks.length) await appendAsks($, m.id, `## ${new Date().toISOString()}\n${asks.join('\n')}\n\n`)
  const named = lines.find(line => /^title:/i.test(line))?.replace(/^title:\s*/i, '').trim() ?? ''
  if (named && named !== m.title && named.length <= 80) {
    await $.mcp
      .call('ccd_session_mgmt', 'set_session_title', { session_id: 'self', title: named })
      .then(() => update($, me, one => ({ ...one, title: named })))
      .catch(() => undefined)
  }
}

const chatHooks = (on: On) => {
  on('session.start', async ($, e, next) => {
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    // and reads its own copy's version again
    loadedVersion = undefined
    const begun = await next(e)
    const home = (await $.env.get('HOME')) ?? ''
    dir = `${home}/.claude/claudopus`
    termLive = /truecolor|24bit/i.test((await $.env.get('COLORTERM')) ?? '') ? LIVE : DEEP_LIVE
    ;[termFrom = '', , termHere = '', termPort = ''] = ((await $.env.get('SSH_CONNECTION')) ?? '').trim().split(/\s+/)
    for (const [art, file] of Object.entries(ART_FILES) as [keyof typeof ART, string][]) {
      const text = await readOr($, `${$.plugin.root}/art/${file}`)
      ART[art] = text.slice(Math.max(0, text.indexOf('<svg')))
    }
    ART.asking = ART.wave.replaceAll('#8A63F0', NEEDS)
    ART.updated = updatedArt(ART.happy, FLOW)
    // A load that moved this chat to a newer version has the header say so, once its octopus is read
    await noteLoaded($).catch(err => log($, `version moved not looked at: ${String(err)}`))
    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
    await noteSeen($).catch(err => log($, `changes seen not noted: ${String(err)}`))
    cwd = e.cwd
    // A reload of this code while its panes stayed up, as in a chat that loads the mod from a folder it watches (the app's chats on
    // another Mac over ssh): the app keeps each button it drew by its key, with the handle of the code now gone, so every press
    // reached nothing. Keys no load before used make it take each button afresh: the moment of the load, with room for a thousand presses
    if ((await $.ui.panes().catch(() => [])).length) presses = 1 + ((await $.clock.now()) % 1_000_000_000) * 1000
    await loadSettings($)
    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
    await closeUndrawn($)
    $.clock.after(3000, () => closeUndrawn($))

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id ? m.needsContext : true }))
    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
    await readOthers($).catch(() => undefined)

    await $.tool.register({
      name: 'update',
      description: 'Records a subject of work in the memory index: creates it, or changes the fields given. `brief` rewrites its one-page brief.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          repo: { type: 'string', description: 'The folder the work happens in' },
          state: { type: 'string', description: 'Where it stands, in at most six words; start with "done" once it is pushed or deployed. Detail goes in the brief' },
          summary: { type: 'string', description: 'One line on what the subject is for' },
          brief: { type: 'string' },
        },
        required: ['name'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'recall',
      description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, subject briefs, pastes, and the results finished work left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'todo',
      description:
        named('For background work: keeps the to-dos under your piece of work in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks it as the one you are doing now, ticks it done or marks it dropped; `was` gives its earlier wording when you reword it. List each thing you set out to do, mark the one you are on as doing, and change the list first when {name} steers.'),
      inputSchema: {
        type: 'object',
        properties: {
          item: { type: 'string', description: named('The to-do in a few plain words, as {name} would say it') },
          state: { type: 'string', enum: ['open', 'doing', 'done', 'dropped'] },
          was: { type: 'string', description: 'The earlier wording of an item that is being reworded' },
        },
        required: ['item'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'note',
      description:
        named('For background work: says where your work stands now, on its card in the panel {name} reads beside the chat. It replaces the line before it. Write it when you start, and again whenever what is true has changed: what is done so far and what you are doing, in one short plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: the ask in one line. The chat starts it as its own piece of work') },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'ask',
      description: named(
        "For background work: when a step needs {name}'s own hands now (a code to paste, a box to fill, a key or a button to press), says so on your card, which stands out at the top of the panel with the ask in view and a Copy button for the exact text, and shows the ask in the chat as a notice, where {name} can answer it too. `text` says what to do, in one plain line; `copy` is only for text {name} must paste somewhere else (a one-time code, a token name, a link to open), never the instructions themselves; `choices` are buttons {name} answers with, such as Approve and Not now, for a go-ahead you need (without them the card offers Done and Not now); {name} can always reply in their own words instead; `pictures` are the picture files the ask is about, such as the options to pick from; `command` is a command only {name} can run, never one you can run yourself: given whole, with its folder in `cwd` or full paths, it is shown with a Copy button and, in a chat on this Mac, a button that opens a terminal with it typed when they press it: open none yourself. The ask stays until {name} answers, even after you finish. An answer clears it and arrives as a message at your next step; carry on meanwhile with what does not depend on it, or end saying what you wait for, and the answer comes back through the chat. Ask again if the answer leaves something waiting. Call it again with empty `text` only once you have seen it done.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          copy: { type: 'string', description: 'Only text they must paste somewhere else, such as a one-time code or a link; leave it out when they only read or press something' },
          choices: { type: 'array', items: { type: 'string' }, description: 'Answers to press, such as Approve and Not now (Done and Not now when left out); the one pressed comes back to you as a message' },
          command: { type: 'string', description: 'A command only they can run, never one you can run yourself, one line, whole: shown with a Copy button, and on this Mac a button that opens a terminal with it typed, never run' },
          cwd: { type: 'string', description: 'The folder the command runs in, a full path; the command is shown starting there. Needed when the command has a relative path' },
          pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the picture files the ask is about, such as the options to pick from; shown with the ask in the chat' },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'waits',
      description: named(
        "For background work, before it finishes: records what in its report waits on {name}, each one short line {name} can answer yes or no. The panel shows each with Yes / No / Not now. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. It replaces what was recorded before; leave it uncalled when nothing waits.",
      ),
      inputSchema: {
        type: 'object',
        properties: { items: { type: 'array', items: { type: 'string' }, description: 'Each a question of at most 140 characters, in plain words, speaking to them as "you"' } },
        required: ['items'],
      },
      isDeferred: false,
    })
    await $.command.register({ name: 'claudopus', description: 'Show the to-dos of this chat: what I asked for, what was done and decided, and each answer' })
    await $.command.register({ name: 'servers', description: 'Show the servers running on this Mac, with a link to each and which chat started it' })
    void $.ui.close({ id: OLD_PANE }).catch(() => undefined)

    // Someone the mod has never set up has no index.md yet: they get the welcome, once
    const isNew = !(await $.fs.exists(`${dir}/index.md`))
    if (isNew) await $.fs.write(`${dir}/index.md`, INDEX_HEAD)
    await settleWelcome($, isNew, id).catch(err => log($, `welcome not settled: ${String(err)}`))
    await measure($).catch(() => undefined)
    await loadFinished($).catch(err => log($, `finished work not read: ${String(err)}`))
    void recoverEnded($).catch(err => log($, `ended work not read back: ${String(err)}`))
    await sync($).catch(() => undefined)
    await loadReports($).catch(() => undefined)
    // Work that is running when the chat loads brings the panel up, if it has never opened
    // and comes back after a reload of the mod (which closes it) if it was open or work is running
    // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
    const isRunning = (await read($, todos)).some(one => !one.parentId && one.status === 'working')
    panelSeen = ''
    const choice = await followPanel($).catch(() => undefined)
    if (!choice && (isRunning || isWelcomeOpen)) await openList($)
    if (!choice && ((await read($, paneShown)) || isRunning) && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST))
      await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened again: ${String(err)}`))
    // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
    // open in every chat from now on
    if (!choice && (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)) await choosePanel($, true)
    everyLoad($, PANEL_EVERY, () => followPanel($).catch(err => log($, `panel not followed: ${String(err)}`)))
    everyLoad($, FOLLOW_EVERY, () => follow($).catch(err => log($, `work not followed: ${String(err)}`)))
    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
    lingerSet.clear()
    // Work that ended in the seconds the reload drew nothing has its pause from the panel's next drawing
    {
      const now = await $.clock.now()
      // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
      const last = await read($, lastDrawn)
      lateFrom.clear()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)])
        if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE) lateFrom.set(`${one.id}:${one.endedAt}`, Infinity)
    }
    let seconds = 0
    everyLoad($, 1000, async () => {
      if (drawnNow > (await read($, lastDrawn))) await update($, lastDrawn, () => drawnNow)
      await shareMine($).catch(err => log($, `work not shared: ${String(err)}`))
      if (seconds % 2 === 0) await lookForStarted($).catch(err => log($, `running commands not looked at: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      // Held while the person types into a reply box (holdTimes)
      if (!isTyping && (isFlowing || (await read($, todos)).some(one => !one.parentId && one.status === 'working') || (await read($, others)).some(c => c.cards.length))) await update($, tick, n => n + 1)
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)].filter(card => isLingering(card, now))) {
        const key = `${one.id}:${one.endedAt}`
        if (lingerSet.has(key)) continue
        lingerSet.add(key)
        $.clock.after(pauseFrom(one) + LINGER - now + 20, () => void ((lingerSet.delete(key), update($, tick, n => n + 1))))
      }
    })
    everyLoad($, TICK, () => refresh($).catch(err => log($, `servers not looked at again: ${String(err)}`)))
    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
    sharedSign = ''
    isEnded = false
    linkReadAt = 0
    // A load starts with no prompt open: one a reload cut off has no call left to end it
    waiting = []
    asked = []
    await unshare($, true).catch(() => undefined)
    if (macs.length) everyLoad($, FETCH_EVERY, () => fetchMacs($).catch(err => log($, `other Macs not fetched: ${String(err)}`)))
    isRunFromAfar = Boolean(await $.env.get('CLAUDE_SSH_DAEMON_CHILD'))
    // There the hidden boxes of the admin and secret runners are drawn in the panel
    if (isRunFromAfar) everyLoad($, BOX_EVERY, () => lookBoxes($).catch(err => log($, `boxes not looked at: ${String(err)}`)))
    if (macs.length) everyLoad($, OPEN_EVERY, () => takeOpens($).catch(err => log($, `presses on other Macs not taken: ${String(err)}`)))
    if (macs.length) everyLoad($, FETCH_EVERY, () => syncResults($).catch(err => log($, `results not made the same: ${String(err)}`)))
    await shareMine($).catch(() => undefined)
    await readAnswers($).catch(() => undefined)
    await readOthers($).catch(() => undefined)
    // The workflows kept, read back, and followed while they run
    await knowSession($)
    await loadFlows($).catch(err => log($, `workflows not read back: ${String(err)}`))
    everyLoad($, FLOW_EVERY, () => followFlows($).catch(err => log($, `workflows not followed: ${String(err)}`)))
    // Claudopus updates itself: a look a little after the chat starts, then whenever one is due
    afterLoad($, UPDATE_AFTER, () => void selfUpdate($).catch(err => log($, `update not looked for: ${String(err)}`)))
    everyLoad($, UPDATE_LOOK, () => selfUpdate($).catch(err => log($, `update not looked for: ${String(err)}`)))
    // and an open chat moves to a newer copy installed while it runs, by itself, once it is idle
    reloadAsked = ''
    everyLoad($, RELOAD_EVERY, () => reloadToInstalled($).catch(err => log($, `reload not looked for: ${String(err)}`)))
    if (isRunFromAfar) {
      await holdOldCopies($).catch(() => undefined)
      everyLoad($, HOLD_EVERY, () => holdOldCopies($).catch(err => log($, `old copies not held: ${String(err)}`)))
    }
    await tidyLog($)
    await log($, `start ${id} in ${e.cwd}${isOff ? ' (handing over is off)' : ''}`)
    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
    await takeCharge($)
    // A move to a newer version has its moment begin now that the load has started whole
    await readyUpdated($).catch(() => undefined)

    return begun
  })

  // A chat that ends removes its file, so the other panels drop its work at once
  on('session.end', async ($, e, next) => {
    isEnded = true
    await unshare($).catch(() => undefined)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    // The notice that a workflow ended ends its card
    if (dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) await flowEnded($, e.text).catch(err => log($, `workflow end not read: ${String(err)}`))
    if (e.isMeta || e.command || !dir) return next(e)
    // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
    const isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text)
    const isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed
    if (!isPerson) return next(e)
    const context = [...(e.context ?? [])]
    let text = e.text
    const m = await read($, me)

    if (!isOff) {
      // The role goes out with the person's first message, after a compaction, and again when its text has changed
      const role = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/chat.md')).text, models))
      const roleSent = mark(role)
      if (!m.isChat || m.needsContext || roleSent !== m.roleSent) {
        // Each subject with the path of its brief, so a brief for work on it can name that path without a search
        const subjects = (await readIndex($)).map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary, `streams/${slug(s.name)}.md`].join(' | ')}`).join('\n')
        context.push(`${role}\nThis chat's saved words: ${dir}/words/${m.id}.md\nSubjects so far (name | folder | session | state | summary | its brief, under ${dir}):\n${subjects || '(none yet)'}`)
      }
      // How full each piece of work is, so a steer for one that is nearly full goes to a fresh agent instead
      const sizes = (await read($, todos))
        .filter(one => !one.parentId && one.tokens > 0)
        .slice(-8)
        .map(one => `${one.title || 'work'} (${one.id}) ${one.isFork && m.window ? `${Math.round((one.tokens / m.window) * 100)}%` : thousands(one.tokens)}`)
      const told = reportsTold(await read($, reports), await $.clock.now())
      context.push(`${BRIEF}${sizes.length ? `\nContext of each piece of work: ${sizes.join('; ')}.` : ''}${told ? `\n${told}` : ''}`)
      await update($, me, one => ({ ...one, isChat: true, needsContext: false, roleSent }))

      if (text.length > PASTE_CHARS) {
        const stamp = new Date().toISOString().replaceAll(':', '-')
        const path = `${dir}/pastes/${stamp}.md`
        await $.fs.write(`${dir}/pastes/${stamp}.md`, text)
        text = `${text.slice(0, 600)}\n\n[${text.length - 1200} characters pasted here were saved to ${path} and left out of this chat]\n\n${text.slice(-600)}`
        context.push(PASTED)
      }
    }

    said = text
    heard = [...heard, text]
    // A message that names a report starts work from it: that work's own report is kept linked to it
    fromReport = (await read($, reports)).find(r => text.includes(`${reportPath(r)}/`) || text.includes(`reports/${r.id}`))?.id ?? ''
    const how = `${e.turnId ? ' (sent while Claude was working)' : ''}${e.origin.kind === 'bridge' ? ' (from the phone)' : ''}${isPressed ? ' (pressed or replied in the panel)' : ''}`
    await appendWords($, m.id, `## ${new Date().toISOString()}${how}\n${text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))

    return next(context.length ? { ...e, text, context } : { ...e, text })
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    // An answer waiting to start ended work again goes from inside this hook, at the end of any turn, the chat's own too (sendWakes)
    if (wakes.length && e.agentId === undefined) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    if (!dir) return done
    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
    // One that only waits for its helpers goes on working
    if (e.agentId !== undefined) {
      const id = e.agentId
      const now = await $.clock.now()
      // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer
      const answer = ((e.answer ?? '').trim() || handedBack.get(id) || '').slice(0, ANSWER_CHARS)
      const isHeld = (await $.agent.list().catch(() => [])).some(one => one.id === id && one.status === 'waiting')
      const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
      // Held only by its own background work, a turn that ends with its report has finished the work: by SubagentHandback, or a
      // reply as long as a report. A short line such as "started it in the background" has not, nor work that waits on its helpers
      // Held on a command or watch of its own that wakes it as it ends, with a to-do of its still being done, it has not finished:
      // what it hands back on the way (an answer to a question while it waits) is no report, and its card stays at work
      const isGoingOn = how === 'done' && isHeld && goesOn(await read($, todos), id)
      const isReport = how === 'done' && isHeld && !isGoingOn && (handedBack.has(id) || answer.length >= REPORT_LEAST)
      // SubagentHandback ends the work's run: its card ends done with its report, though what it left running in the background (a
      // server, a watch, a helper) goes on and is not stopped. Should that wake the work, its next step brings the card back
      const isHandedBack = how === 'done' && handedBack.has(id) && !isGoingOn
      handedBack.delete(id)
      if (isHandedBack) endedByHandback.add(id)
      // Work nothing holds any more has nothing of its own left running in the background
      if (!isHeld) await update($, todos, list => (list.some(one => one.id === id && one.bg) ? list.map(one => (one.id === id ? { ...one, bg: undefined, waitsSince: undefined } : one)) : list))
      await update($, todos, list => {
        const isWaiting = how === 'done' && !isHandedBack && (isHeld || list.some(one => one.parentId === id && one.status === 'working'))
        // What it waits on of its own, since when: the card says so, and a long wait for it is not taken for being stuck
        // Work that gave its report waits on nothing it means to finish
        const waitsSince = (one: Todo) => (isHeld && !isReport && one.bg?.some(b => !b.isWatch) ? (one.waitsSince ?? now) : undefined)
        // An aborted turn's own text is not kept over the report the work gave before it was stopped
        return list.map(one =>
          one.id !== id
            ? one
            : // Work that had ended, woken by what it left running, that ends a turn of words alone has not worked again: it stays
              // as it ended, with its report, and is not announced a second time
              one.status !== 'working' && how === 'done' && !isHandedBack && endedByHandback.has(id)
              ? one
              : isWaiting
              ? { ...one, answer: answer || one.answer, answeredAt: isReport ? now : one.answeredAt, waitsSince: waitsSince(one) }
              : how === 'stopped'
                ? one.status === 'working'
                  ? ended(one, stoppedAs(one), now)
                  : one
                : { ...ended(one, how, now), answer: answer || one.answer },
        )
      })
      if (how === 'stopped') await keepStoppedReports($, now)
      await lookEnds($)
      // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
      if ((await read($, todos)).find(one => one.id === id)?.status !== 'working') await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
      if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
      // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
      // held on its own background work leaves it once it ends (keepStoppedReports)
      const card = (await read($, todos)).find(one => one.id === id)
      const report = (e.answer ?? '').trim() || answer
      if (card && !card.parentId && card.status === 'done' && card.endedAt === now && how === 'done' && report) {
        $.clock.after(5, () => void saveReport($, card, report).catch(err => log($, `report of ${id} not kept: ${String(err)}`)))
      }
      return done
    }
    const text = said
    said = ''
    heard = []
    // Off the turn's clock, so the reply is never held up
    $.clock.after(5, () => void afterReply($, text, e.answer ?? '').catch(err => log($, `pass after reply failed: ${String(err)}`)))

    return done
  })

  // A compaction keeps what the person asked for, and the role text goes out again after it
  on('session.compact', async ($, e, next) => {
    const isChat = (await read($, me)).isChat && !isOff
    const r = await next({ ...e, instructions: [e.instructions, KEEP, isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') })
    if (e.agentId === undefined && e.trigger !== 'precompute') await update($, me, m => ({ ...m, needsContext: true }))

    return r
  })

  // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
  // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
  // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there
  on('prompt.context', async ($, e, next) => {
    const r = await next(e)
    const files = r.instructionFiles ?? e.instructionFiles
    // The person's own copy in the memory folder when there is one, the shipped principles otherwise
    const { path, text: content } = await inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')
    if (!files || !content.trim()) return r
    // Another copy of the mod loaded beside this one sends the same principles, with the rule for afar after them or not
    const others = files.filter(one => !one.content.trim().startsWith(content.trim()))
    const at = others.findIndex(one => one.kind !== 'managed')
    // Read here, not from the flag the chat's start sets, so a context made before that start ends still carries the rule
    const isAfar = Boolean(await $.env.get('CLAUDE_SSH_DAEMON_CHILD'))
    const ours = { path, kind: 'user' as const, content: isAfar ? `${content.trimEnd()}\n\n${named(AFAR_RULE)}\n` : content }

    return { ...r, instructionFiles: at < 0 ? [...others, ours] : [...others.slice(0, at), ours, ...others.slice(at)] }
  })

  on('tool.describe', async (_, e, next) => {
    const r = await next(e)
    const isRare = RARE_TOOLS.includes(e.tool) || RARE_SERVERS.some(prefix => e.tool.startsWith(prefix))

    return isRare ? { ...r, isDeferred: true } : r
  })

}

