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


// Work the engine still listed as running as its turn ended is looked at again this long after: one whose run was over by then is
// listed as completed, and the look ends its card (sync) and passes on a reply it never read, as the turn's end would have
const HELD_LOOK = 1500
const heldLook = async ($: EngineInterface, id: string) => {
  const wasWorking = (await read($, todos)).find(one => one.id === id)?.status === 'working'
  await sync($)
  // Listed as idle, or no longer listed, its run is over too: nothing holds it
  const listed = (await $.agent.list().catch(() => undefined))?.find(one => one.id === id)?.status
  if (listed === 'idle' || listed === undefined) {
    const now = await $.clock.now()
    // (a task left stopped partway is started again to carry on, not ended)
    const one = (await read($, todos)).find(card => card.id === id)
    const isShort = one?.status === 'working' && isStoppedShort(one, '') && ownsNothing(await read($, todos), id) && !one.wakeWhen && !isTurnWaited(await read($, todos), id) && (await pressedAtEnd($, id))
    if (isShort) await goOn($, id, 'its step ended', true)
    else await changeTodos($, list => list.map(one => (one.id === id && one.status === 'working' ? ended(one, 'done', now) : one)))
  }
  const card = (await read($, todos)).find(one => one.id === id)
  if (card?.status === 'working') return
  await replyUnread($, id)
  if (wakes.length) await sendWakes($)
  // A helper the engine still listed as running as its turn ended, ended now: its result is passed on as at a heard end. Read as at
  // work before the look, as the look itself ends it; one the look for work that ended unheard passed on is not passed on again
  // (passOnHelper)
  if (wasWorking && card?.parentId && card.parentId !== HELPER) await passOnHelper($, id, card.answer ?? '', card.status)
}
// The notices with nothing new let in since the chat's last turn started, each whole; the turns to answer with no model
const quietHeld = new Set<string>()
const quietTurns = new Set<string>()
// A turn of a task or helper ends: its card follows what it ended with (chatHooks' turn.complete)
const agentTurnEnded = async <T,>($: EngineInterface, e: { answer?: string; isAborted: boolean; reason: string }, id: string, done: T): Promise<T> => {
  const now = await $.clock.now()
  // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer; the line
  // Claudopus answered Claude Code's press with is no answer of its own (its card keeps what it said before)
  const said = (e.answer ?? '').trim()
  const answer = ((said === PRESS_ANSWER ? '' : said) || handedBack.get(id) || '').slice(0, ANSWER_CHARS)
  // Held: the engine keeps it for what it left running, and lists it as waiting. As a turn ends the engine may still list it as
  // running for a moment, held or not: taken as held then, and looked at again shortly (heldLook)
  const listed = (await $.agent.list().catch(() => [])).find(one => one.id === id)?.status
  const isHeld = listed === 'waiting' || listed === 'running'
  if (listed === 'running') $.clock.after(HELD_LOOK, () => void heldLook($, id).catch(err => log($, `work ${id} not looked at again: ${String(err)}`)))
  const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
  // Held only by its own background work, a turn that ends with its report has finished the work: by SubagentHandback, or a
  // reply as long as a report. A short line such as "started it in the background" has not, nor work that waits on its helpers
  // Held on a command or watch of its own that wakes it as it ends, with a to-do of its still being done, it has not finished:
  // what it hands back on the way (an answer to a question while it waits) is no report, and its card stays at work
  const isGoingOn = how === 'done' && isHeld && goesOn(await read($, todos), id)
  const isReport = how === 'done' && isHeld && !isGoingOn && (handedBack.has(id) || isWordsReport((await read($, todos)).find(one => one.id === id), answer))
  // A report in words, with nothing of its own running, has finished the work as a handback does: the engine may hold it on what
  // no tool shows open, and the chat need not stop it. Its card ends with its clock, and an ask it leaves stays to be answered
  const isIdleReport = isReport && ownsNothing(await read($, todos), id)
  // SubagentHandback ends the work's run: its card ends done with its report, though what it left running in the background (a
  // server, a watch, a helper) goes on and is not stopped. Should that wake the work, its next step brings the card back
  const isHandedBack = how === 'done' && (handedBack.has(id) || isIdleReport) && !isGoingOn
  if (isHandedBack) (ownsNothing(await read($, todos), id) ? leftNothing.add(id) : leftNothing.delete(id))
  handedBack.delete(id)
  if (isHandedBack) endedByHandback.add(id)
  if (isHandedBack) await changeTodos($, list => list.map(one => (one.id === id ? { ...one, handedBackAt: now, wakeWhen: undefined } : one)))
  // Work nothing holds any more has nothing of its own left running in the background
  if (!isHeld) await changeTodos($, list => (list.some(one => one.id === id && one.bg) ? list.map(one => (one.id === id ? { ...one, bg: undefined, waitsSince: undefined } : one)) : list))
  // A task of this chat's whose step ended with no result, no question and nothing of its own that starts it again is not
  // finished: it stays at work, and Claudopus starts it again to carry on (carryOn). Not one that was stopped, nor one refused
  const isShortHow = how === 'done' || (how === 'failed' && e.reason === 'error')
  const mayBeShort = isShortHow && !isHandedBack && isStoppedShort((await read($, todos)).find(one => one.id === id), answer) && (await pressedAtEnd($, id))
  let isCarried = false
  await changeTodos($, list => {
    isCarried = false
    // (or for what it asked Claudopus to start it again for)
    const isWaiting = how === 'done' && !isHandedBack && (isHeld || isTurnWaited(list, id) || list.some(one => (one.parentId === id && one.status === 'working') || (one.id === id && one.wakeWhen !== undefined)))
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
          ? { ...one, answer: answer || one.answer, answeredAt: isReport ? now : one.answeredAt, waitsSince: waitsSince(one), endedStepAt: now }
          : how === 'stopped'
            ? one.status === 'working'
              ? ended(one, stoppedAs(one), now)
              : one
            : mayBeShort && one.status === 'working' && isStoppedShort(one, answer)
              ? ((isCarried = true), { ...one, answer: answer || one.answer })
              : { ...ended(one, how, now), answer: answer || one.answer },
    )
  })
  if (isCarried) await goOn($, id, e.reason === 'error' ? 'its step failed' : 'its step ended', true)
  if (how === 'stopped') await keepStoppedReports($, now)
  await lookEnds($)
  // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
  if ((await read($, todos)).find(one => one.id === id)?.status !== 'working') await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
  // A go-ahead pressed during this turn does its last step now, before the wakes go, so its small task starts from this hook
  await stepsAtEnd($).catch(err => log($, `last step not done: ${String(err)}`))
  if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
  // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
  // held on its own background work leaves it once it ends (keepStoppedReports)
  const card = (await read($, todos)).find(one => one.id === id)
  const report = (said === PRESS_ANSWER ? '' : said) || answer
  // A helper that has ended while its work had ended its step: its result is passed on to that work, which starts again with it
  if (card?.parentId && card.status !== 'working') await passOnHelper($, id, report, card.status).catch(err => log($, `helper's result not passed on: ${String(err)}`))
  // One that handed back while a command or helper of its own still runs stays at work on its card, but its hand-back reached the
  // chat, which was told it is passed on: it is passed on now
  else if (card?.parentId && notedAtHandback.has(id)) await passOnHelper($, id, report, 'done').catch(err => log($, `helper's result not passed on: ${String(err)}`))
  if (card && !card.parentId && card.status === 'done' && card.endedAt === now && how === 'done' && report) {
    $.clock.after(5, () => void saveReport($, card, report).catch(err => log($, `report of ${id} not kept: ${String(err)}`)))
  }
  // What is at work is kept for a restart at once: a task that just finished is never brought back by a quit seconds later
  await saveKeep($).catch(err => log($, `work at work not kept for the keeper: ${String(err)}`))
  return done
}
// The tasks and helpers whose turn's end is being taken up now: the list's look leaves them to it
const turnEnding = new Set<string>()
const chatHooks = (on: On) => {
  on('session.start', async ($, e, next) => {
    await knowSystem($).catch(() => undefined)
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    // and reads its own copy's version again
    loadedVersion = undefined
    // and takes nothing it knew of the person's settings and texts as sealed: the kept copy is checked again
    knownSeen = undefined
    const begun = await next(e)
    const home = (await $.env.get('HOME')) ?? ''
    dir = `${home}/.claude/claudopus`
    // How late the mod's own timer comes: behind, it does less until it has caught up (lookHold). From the start of the load, so a
    // long hold in the load's own reads is logged with them too
    holdAt = 0
    // (not in the test kit, whose clock a test moves by hours at once: there only a test that asks for it has it)
    isTimed = (await $.env.get('CLAUDOPUS_TIMING')) !== 'test'
    if (isTimed) everyLoad($, HOLD_LOOK, () => lookHold($))
    // The mod's own kinds of agent, each starting with only the tools its work takes
    void registerKinds($)
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
    if ((await $.ui.panes().catch(() => [])).length) (loadMark = presses = 1 + ((await $.clock.now()) % 1_000_000_000) * 1000), (freshness += 1)
    // A chat begins with no record of drawings made before it: one slow drawing of an earlier start never holds this one's (isFreshTooSoon)
    ;(freshDrawn.clear(), freshDue.clear(), freshUnderWay.clear(), (pressedAt = 0), (engagedAt = 0))
    await loadSettings($)
    await clearGates($).catch(err => log($, `admin holds not cleared: ${String(err)}`))
    await clearHeld($).catch(err => log($, `held commands not cleared: ${String(err)}`))
    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
    await closeUndrawn($)
    $.clock.after(3000, () => closeUndrawn($))
    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
    await watchLoaded($).catch(err => log($, `tabs not watched: ${String(err)}`))

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    heldChat = id
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id ? m.needsContext : true }))
    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
    await noteCut($, id).catch(err => log($, `cut-off work not looked for: ${String(err)}`))
    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
    during('load: read the other chats')
    await readOthers($).catch(() => undefined)
    keysOnStart($)

    await $.tool.register({
      name: 'update',
      description: 'Records a topic in the memory index: creates it, or changes the fields given. `brief` replaces the whole page of notes on it: read it first and keep what other tasks wrote.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          repo: { type: 'string', description: 'The folder the task happens in' },
          state: { type: 'string', description: 'How far it has got, in at most six words; start with "done" once it is pushed or deployed. Put detail in `brief`' },
          summary: { type: 'string', description: 'One line on what the topic is for' },
          brief: { type: 'string' },
        },
        required: ['name'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'recall',
      description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, topic notes, pastes, and the results finished tasks left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'todo',
      description:
        named('For background tasks: keeps the to-dos on your card in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks the one you are doing, ticks it done or drops it; `was` gives its earlier wording when you reword it.'),
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
        named('For background tasks: says how far you have got, on your card, replacing the line before. Write it when you start and whenever that changes: what is done and what you are doing, in one plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: that request in one line. The chat starts it as a task of its own') },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'ask',
      description: named(
        "For background tasks: when a step needs {name}'s own hands or go-ahead now (a code to paste, a box to fill, a key or button to press, an approval), puts your question at the top of the panel on your card and in the chat as a notice; {Name} answers with a button or in their own words. {Name} sees it before your report, so it must carry everything needed to decide and never point at an explanation elsewhere. It stays until answered, even after you finish; the answer arrives as a message at your next step, or starts you again. Meanwhile continue with what does not depend on it, or end your step saying what you are waiting for. Ask again if the answer leaves something open; call it with empty `text` only once you have seen it done. Never open a terminal for a command yourself.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          details: { type: 'string', description: 'What it is about, in full: what changes, what it costs, what is not done. Short plain lines and "- " lists with a blank line after, no tables or bold: the card is narrow and the chat shows plain text' },
          copy: { type: 'string', description: 'Only text they must paste elsewhere, such as a one-time code or a link' },
          choices: { type: 'array', items: { type: 'string' }, description: 'Buttons to answer with, such as Approve and Not now (Done and Not now when left out)' },
          command: { type: 'string', description: 'A command only they can run, never one you can run yourself: one line, whole, shown with a Copy button' },
          cwd: { type: 'string', description: 'The full path of the folder the command runs in, when it has relative paths' },
          pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the pictures the question is about, shown with it on the card and in the chat' },
          last_step: { type: 'string', description: 'For a go-ahead to finish (the first choice, such as Release it): what you would do on it, in one sentence for this repo, or `release` for the release runner. Claudopus does it on the press without starting you again' },
          folder: { type: 'string', description: 'With last_step: the full path of your worktree, where it is done' },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'wake_me',
      description: named(
        'For a file, a page or a time that nothing of yours makes (a file another program writes, a page that comes up, a moment to look again): Claudopus looks for it and starts you again the moment it is there, so you end your step instead of waiting with a command. Your own commands, in the background or detached, and your helpers wake you by themselves: never use this for them. Name a file, a line in it, a page, or only minutes; Claudopus looks for at most an hour, and not again for the same once a look ran out. A new call replaces the last one.',
      ),
      inputSchema: {
        type: 'object',
        properties: {
          what: { type: 'string', description: 'What you wait for, in a few plain words read at a glance on your card' },
          file: { type: 'string', description: 'The full path of a file to appear (with `text`, a file to hold that text)' },
          text: { type: 'string', description: 'A line of text to appear in `file`' },
          url: { type: 'string', description: 'A page to answer without an error' },
          minutes: { type: 'number', description: 'With nothing else: start you after this many minutes. With a file or page: the longest to look, after which you are started with word that it never came (15 when left out, at most 60). Should it never come, you are started again and hand back what you have' },
        },
        required: ['what'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'waits',
      description: named(
        "For background tasks, before you finish: records what in your report waits on {name}, each as one short question. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. Each call lists everything still waiting: once you finish, it replaces what your earlier results waited on, and [] says nothing does. The panel answers each with Yes / No, or the answers you name in `choices` when it is not yes or no, and always with Not now and Answer in words. Mark a question you also asked on your card with the `ask` tool with `asked: true`: answering it there answers it here. In the chat: once {name}'s own words have answered what a result waits on, call it with that result's report.md path as `result` and the numbers of the questions they answered as `answered`.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              anyOf: [
                { type: 'string', description: 'A yes-or-no question of at most 140 characters, in plain words, speaking to them as "you"' },
                {
                  type: 'object',
                  properties: {
                    text: { type: 'string', description: 'The question, at most 140 characters, in plain words, speaking to them as "you"' },
                    choices: { type: 'array', items: { type: 'string' }, description: 'Its answers when it is not yes or no, a few words each (at most 4)' },
                    asked: { type: 'boolean', description: 'true when it is the question you asked on your card with the `ask` tool' },
                  },
                  required: ['text'],
                },
              ],
            },
          },
          answered: { type: 'array', items: { type: 'number' }, description: named("Only in the chat: the numbers of the result's questions {name}'s words answered") },
          result: { type: 'string', description: named("Only in the chat: the report.md path of the result whose questions {name}'s words answered") },
        },
        required: [],
      },
      isDeferred: false,
    })
    await $.command.register({ name: 'claudopus', description: "Open the Claudopus panel: this chat's tasks, questions and results" })
    await $.command.register({ name: 'servers', description: 'Open the Servers panel: the servers running on this Mac, a link to each and the chat that started it' })

    void $.ui.close({ id: OLD_PANE }).catch(() => undefined)

    // Someone the mod has never set up has no index.md yet: they get the welcome, once
    const isNew = !(await $.fs.exists(`${dir}/index.md`))
    if (isNew) await $.fs.write(`${dir}/index.md`, INDEX_HEAD)
    await settleWelcome($, isNew, id).catch(err => log($, `welcome not settled: ${String(err)}`))
    await measure($).catch(() => undefined)
    during('load: read finished work')
    await loadFinished($).catch(err => log($, `finished work not read: ${String(err)}`))
    void recoverEnded($).catch(err => log($, `ended work not read back: ${String(err)}`))
    during('load: sync the memory')
    await sync($).catch(() => undefined)
    during('load: read the results')
    await loadReports($).catch(() => undefined)
    // What the person had typed into a reply box before a reload of the mod is in its box again
    await readDrafts($).catch(() => undefined)
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
      // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
      await lookBoxes($).catch(err => log($, `boxes not looked at: ${String(err)}`))
      await watchFront($).catch(err => log($, `tab in front not watched: ${String(err)}`))
      // A bar with a box open reads no cards while it is drawn: what it shows of them is looked at here
      await lookBar($).catch(err => log($, `bar not looked at: ${String(err)}`))
      // While a command has a row, its output is read every few seconds (lookJobs keeps to JOB_LOOK), not only as the list is followed
      // every 20: a download rewriting its percent each second sat still for 20 seconds and read "nothing printed for 15s" (16 Nov)
      if (jobLog.size) void lookJobs($).catch(err => log($, `jobs not read: ${String(err)}`))
      if (seconds % 2 === 0) await lookForStarted($).catch(err => log($, `running commands not looked at: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        if (!isBehind()) await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      // Held while the person types into a reply box (holdTimes)
      // A pane held while only its running times moved is drawn again once CALM is over (heldDrawings)
      const calmNow = await $.clock.now()
      // (a command run on the person's press too, whose running time its card shows after its task has ended)
      const isMoving = isFlowing || runList.some(run => Boolean(run.startedAt && !run.endedAt)) || (await read($, todos)).some(one => !one.parentId && one.status === 'working') || (await read($, others)).some(c => c.cards.some(card => card.status === 'working'))
      // A drawing of a size or tab no longer drawn is let go after a minute: it would only be drawn afresh
      if (!isTyping) for (const [key, held] of heldDrawings) if (calmNow - held.at >= 60_000) heldDrawings.delete(key)
      // The mod alone says when its panes are drawn again, and only when what they show has moved (calmLook)
      if (!isBehind()) await calmLook($, isMoving).catch(err => log($, `panes not looked at: ${String(err)}`))
      // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
      if (!isBehind() && (await read($, todos)).some(one => !one.parentId && one.status === 'working')) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos))].filter(card => isLingering(card, now))) {
        const key = `${one.id}:${one.endedAt}`
        if (lingerSet.has(key)) continue
        lingerSet.add(key)
        $.clock.after(pauseFrom(one) + LINGER - now + 20, () => void ((lingerSet.delete(key), drawAgain($), update($, tick, n => n + 1))))
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
    // A chat the app runs from another Mac has a keeper on this one, which goes on with its work should the app end its process
    if (isRunFromAfar) await startKeeper($, id).catch(err => log($, `keeper not started: ${String(err)}`))
    // and every chat a watcher that brings Claudopus back should Claude switch it off
    await startReviver($, id).catch(err => log($, `the watcher that brings Claudopus back was not started: ${String(err)}`))
    if (macs.length) everyLoad($, OPEN_EVERY, () => takeOpens($).catch(err => log($, `presses on other Macs not taken: ${String(err)}`)))
    if (macs.length) everyLoad($, FETCH_EVERY, () => syncResults($).catch(err => log($, `results not made the same: ${String(err)}`)))
    await shareMine($).catch(() => undefined)
    await readAnswers($).catch(() => undefined)
    await readOthers($).catch(() => undefined)
    // The workflows kept, read back, and followed while they run
    await knowSession($)
    during('load: read back workflows')
    await loadFlows($).catch(err => log($, `workflows not read back: ${String(err)}`))
    everyLoad($, FLOW_EVERY, () => followFlows($).catch(err => log($, `workflows not followed: ${String(err)}`)))
    // Every hour one chat looks at the version page, and only looks: an update is installed, and a chat reloaded to it, only by a press
    afterLoad($, UPDATE_AFTER, () => void lookForNew($).catch(err => log($, `update not looked for: ${String(err)}`)))
    everyLoad($, UPDATE_LOOK, () => lookForNew($).catch(err => log($, `update not looked for: ${String(err)}`)))
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

  // The setting that brings Claudopus back is its own: never shown in /config
  on('config.describe', ($, e, next) => next(e.key === REVIVED_KEY ? { ...e, isHidden: true } : e))

  // A chat that ends removes its file, so the other panels drop its work at once
  on('session.end', async ($, e, next) => {
    isEnded = true
    await endBeat($, (await read($, me)).id).catch(() => undefined)
    await unshare($).catch(() => undefined)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    await holdTest($)
    // The texts a message is answered with are the ones known: a change made since is put back first
    if (dir) await personCheck($).catch(err => log($, `files not compared as a message came: ${String(err)}`))
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    // The notice that a workflow ended ends its card
    if (dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) await flowEnded($, e.text).catch(err => log($, `workflow end not read: ${String(err)}`))
    // The engine's notice that work the person stopped has ended says it was stopped "by Claude": the chat is told it was them
    if (dir && !isOff && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) {
      // Each notice that a work waiting on its helpers or a wake_me ended goes with the word that it is still at work, whatever else
      // the prompt brings
      const waitingWork = await waitingNow($)
      const quiet = quietNotices(e.text, new Set(waitingWork.keys()))
      const waits = quiet.waits.map(id => waitsText(waitingWork.get(id)!))
      const ids = [...e.text.matchAll(/<task-id>([^<]+)<\/task-id>/g)].map(m => m[1] ?? '')
      const held = (await read($, todos)).filter(one => !one.parentId && isHeld(one) && ids.includes(one.id))
      if (held.length) {
        const told = held.map(one => named(STOPPED_BY_YOU(titleOf(one), one.id, stopLeft.get(one.id) ?? [])))
        for (const one of held) stopLeft.delete(one.id)
        return next({ ...e, context: [...(e.context ?? []), ...told, ...waits] })
      }
      // The chat's own command ended: how it ended and its last lines go with the notice
      const ended = await chatCommandEnded($, e.text).catch(() => [] as string[])
      if (ended.length) return next({ ...e, context: [...(e.context ?? []), ...ended, ...waits] })
      // Notices with nothing new (a report already given, a task still at work) cost the chat no turn of the model's: a turn made of
      // nothing else is answered with no model (turn.start below, workHooks' turn.step), and one that comes while the chat is at
      // work goes into that turn, or makes such a turn should that turn end first. None is dropped, which Claude Code shows as a
      // warning card. The word that a task still waits goes with it, so the chat, reading it later, does not take the task for ended
      if (quiet.isQuiet) {
        for (const one of noticesOf(e.text)) quietHeld.add(one)
        await log($, quiet.isRepeat ? 'let in the notice that repeats a report already given, with no turn of the model\'s' : 'let in notices with nothing new, with no turn of the model\'s: tasks still at work')
        return next(waits.length ? { ...e, context: [...(e.context ?? []), ...waits] } : e)
      }
      if (waits.length) return next({ ...e, context: [...(e.context ?? []), ...waits] })
    }
    // A helper's result Claudopus passes on to its task costs the chat no turn of the model's either (isQuietHandback)
    if (await isQuietHandback($, e.origin, e.text).catch(err => (void log($, `hand-back not looked at: ${String(err)}`), false))) {
      quietHeld.add(e.text)
      await log($, 'let in a helper\'s result that Claudopus passes on to its task, with no turn of the model\'s')
      return next(e)
    }
    if (e.isMeta || e.command || !dir) return next(e)
    // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
    const isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text)
    const isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed
    if (!isPerson) return next(e)
    const context = [...(e.context ?? [])]
    // Their message lifts the hold on work they stopped: the chat is reminded it was stopped, and starts it again only if asked
    const stillHeld = (await read($, todos)).filter(one => isHeld(one) && !one.parentId)
    if ((await read($, todos)).some(isHeld)) {
      await changeTodos($, list => list.map(one => (isHeld(one) && one.byYou ? { ...one, byYou: { ...one.byYou, isLifted: true } } : one)))
      if (stillHeld.length) context.push(named(STOPPED_EARLIER(stillHeld.map(one => `"${titleOf(one)}" (${one.id})`))))
    }
    let text = e.text
    const m = await read($, me)

    if (!isOff) {
      // The role goes out with the person's first message, after a compaction, and again when its text has changed
      const role = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/chat.md')).text, models, lean))
      const roleSent = mark(role)
      if (!m.isChat || m.needsContext || roleSent !== m.roleSent) {
        // Each subject with the path of its brief, so a brief for work on it can name that path without a search
        const subjects = (await readIndex($)).map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary, `streams/${slug(s.name)}.md`].join(' | ')}`).join('\n')
        context.push(`${role}\nThis chat's saved words: ${dir}/words/${m.id}.md\nTopics so far (name | folder | session | state | summary | its notes, under ${dir}):\n${subjects || '(none yet)'}`)
      }
      // How full each piece of work is, so a steer for one that is nearly full goes to a fresh agent instead
      const sizes = (await read($, todos))
        .filter(one => !one.parentId && one.tokens > 0)
        .slice(-8)
        .map(one => `${one.title || 'task'} (${one.id}) ${one.isFork && m.window ? `${Math.round((one.tokens / m.window) * 100)}%` : thousands(one.tokens)}`)
      const told = reportsTold(await read($, reports), await $.clock.now())
      context.push(`${BRIEF}${sizes.length ? `\nHow full each task's context is: ${sizes.join('; ')}.` : ''}${told ? `\n${told}` : ''}`)
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
    // One that names a result and quotes what in it waits answers that, as "Answer in words" on the result starts it
    await answeredInMessage($, text).catch(err => log($, `results answered in words not marked: ${String(err)}`))
    const how = `${e.turnId ? ' (sent while Claude was working)' : ''}${e.origin.kind === 'bridge' ? ' (from the phone)' : ''}${isPressed ? ' (pressed or replied in the panel)' : ''}`
    await appendWords($, m.id, `## ${new Date().toISOString()}${how}\n${text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))

    return next(context.length ? { ...e, text, context } : { ...e, text })
  })

  // A turn of the chat's made only of quiet notices (above) is known as it starts; its first step is answered with Claude Code's own
  // line for a turn with nothing to say (workHooks' turn.step, the module's one), so no model is asked. A turn that brings anything
  // more, the person's words or a notice with news, is the model's
  on('turn.start', async ($, e, next) => {
    const started = await next(e)
    if (e.agentId === undefined && quietHeld.size) {
      if (isQuietTurn(e.text, quietHeld)) quietTurns.add(e.turnId)
      quietHeld.clear()
    }
    return started
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    // An answer waiting to start ended work again goes from inside this hook, at the end of any turn, the chat's own too (sendWakes)
    if (wakes.length && e.agentId === undefined) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    if (!dir) return done
    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
    // One that only waits for its helpers goes on working
    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
    await lapsedSignIn($, e).catch(err => log($, `lapsed sign-in not handed over: ${String(err)}`))
    if (e.agentId !== undefined) {
      const id = e.agentId
      turnEnding.add(id)
      try {
        return await agentTurnEnded($, e, id, done)
      } finally {
        turnEnding.delete(id)
      }
    }
    // A turn answered with no model is no reply: nothing is saved or logged for it
    if (quietTurns.delete(e.turnId)) return done
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
    // A piece of work compacted loses the rules it was handed after its brief: it is handed them again at its next step
    const agent = e.agentId
    if (agent !== undefined && e.trigger !== 'precompute' && dir) await changeTodos($, list => (list.some(one => one.id === agent && !one.parentId) ? list.map(one => (one.id === agent ? { ...one, rulesDue: true } : one)) : list))

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

