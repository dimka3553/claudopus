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


// As a turn ends the engine may still list its run as running for a moment: it is looked at again this long after
const HELD_LOOK = 1500
// The notices with nothing new let in since the chat's last turn started, each whole; the turns to answer with no model
const quietHeld = new Set<string>()
const quietTurns = new Set<string>()
// A turn of a task or helper ends (chatHooks' turn.complete). A turn that ends is a pause, not the end: a task ends only by
// handing in its result, which made its card done as the hand-back went through (workHooks' tool.call). Stopped, its card is
// stopped; ended by an error, it failed and says so. Any other stays at work: Claude Code starts its next step when a command or
// a helper of its own ends, or when the person's answer or words reach it. A run that is over with nothing of its own running and
// nothing waiting for the person is ended by lookOver
const agentTurnEnded = async <T,>($: EngineInterface, e: { answer?: string; isAborted: boolean; reason: string }, id: string, done: T): Promise<T> => {
  const now = await $.clock.now()
  // A turn that handed in its result and says nothing after has that result as its answer; the line Claude Code's press was
  // answered with is no answer of its own (its card keeps what it said before)
  const said = (e.answer ?? '').trim()
  const answer = ((said === PRESS_ANSWER ? '' : said) || handedBack.get(id) || '').slice(0, ANSWER_CHARS)
  const isHanded = handedBack.delete(id)
  const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
  // A step stopped by a passing network error is tried again, its card at work meanwhile (retryLater)
  const passing = how === 'failed' && e.reason === 'error' && dir && !isOff ? await passingError($, id, said).catch(() => '') : ''
  const isRetried = Boolean(passing) && (await retryLater($, id, passing).catch(err => (void log($, `work ${id} not tried again: ${String(err)}`), false)))
  await changeTodos($, list =>
    list.map(one => {
      // (a task whose result went through is done already, and one ended meanwhile stays as it ended)
      if (one.id !== id || one.status !== 'working') return one
      // (stopped for a message the person sent with Stop and send, which starts it again: it stays at work)
      if (how === 'stopped' && interrupting.has(id)) return one
      // (stopped by no one here, as when the app quits and stops every task, it says so: a load in the next process takes one that
      // stopped so as the process ended for cut off, never for stopped: noteClosed)
      if (how === 'stopped' && !one.parentId && !stoppedHere.has(id) && !pressed.has(id)) return { ...ended(one, stoppedAs(one), now), ...(hasReport(one) ? {} : { stoppedUnasked: true as const }) }
      if (how === 'stopped') return ended(one, stoppedAs(one), now)
      if (how === 'failed' && isRetried) return one
      if (how === 'failed') return { ...ended(one, 'failed', now), answer: answer || one.answer, why: WHY_ERROR }
      // A helper's hand-back ends it: its result went to its task
      if (isHanded && one.parentId) return { ...ended(one, 'done', now), answer: answer || one.answer }
      return answer ? { ...one, answer } : one
    }),
  )
  // Its run may be over: with nothing of its own running and nothing waiting for the person, it is (lookOver), now or once the
  // engine no longer lists it as running
  const look = async () => lookOver($, await $.agent.list().catch(() => []), await $.clock.now(), id)
  if (how === 'done') await look().catch(err => log($, `work ${id} not looked at as its turn ended: ${String(err)}`))
  if (how === 'done' && (await ownCards($)).find(one => one.id === id)?.status === 'working') $.clock.after(HELD_LOOK, () => void look().catch(err => log($, `work ${id} not looked at again: ${String(err)}`)))
  await lookEnds($)
  // A reply it never read goes to the chat; work still at work reads it at its next step
  if ((await ownCards($)).find(one => one.id === id)?.status !== 'working') await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
  if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
  await saveKeep($).catch(err => log($, `work at work not kept: ${String(err)}`))
  return done
}
// The tasks and helpers whose turn's end is being taken up now: the list's look leaves them to it
const turnEnding = new Set<string>()
// ---- A chat keeps the rules it started with ----

// What a chat is told (its role, the line with each message, the principles) is made once, at its first request, and kept by its id
// in live/rules, a folder only Claudopus writes: a changed setting, an edited copy or an update reaches new chats only, and an open
// one is told the same after a reload. A chat from before this was kept keeps what its first request under this version makes
type KeptRules = { role?: string; each?: string; principles?: { path: string; content: string } }
const RULES_KEPT_FOR = 30 * 24 * 3_600_000
const RULES_CHAT = /^[A-Za-z0-9_-]{1,80}$/
const rulesDir = () => `${dir}/live/rules`
let rulesKept: { id: string; kept: KeptRules } | undefined
let rulesKeeping: Promise<unknown> = Promise.resolve()
const keptRule = <K extends keyof KeptRules>($: EngineInterface, key: K, make: () => Promise<NonNullable<KeptRules[K]>>): Promise<NonNullable<KeptRules[K]>> => {
  // One at a time, so two requests of a chat never keep two texts
  const run = rulesKeeping.then(async () => {
    const id = await $.session.id()
    if (!dir || !RULES_CHAT.test(id)) return make()
    if (rulesKept?.id !== id) {
      const text = await readOr($, `${rulesDir()}/${id}.json`)
      let kept: KeptRules = {}
      try {
        const value = JSON.parse(text || '{}') as unknown
        if (value && typeof value === 'object' && !Array.isArray(value)) kept = value as KeptRules
      } catch {
        // A file that does not parse keeps nothing: the texts are made again, once
      }
      rulesKept = { id, kept }
    }
    const held = rulesKept.kept[key]
    if (held !== undefined) return held as NonNullable<KeptRules[K]>
    const made = await make()
    rulesKept = { id, kept: { ...rulesKept.kept, [key]: made } }
    await $.fs.write(`${rulesDir()}/${id}.json`, JSON.stringify(rulesKept.kept))
    return made
  })
  rulesKeeping = run.catch(() => undefined)
  return run
}
// As a chat loads: its own kept rules count as used now, and those of chats not opened for a month go
const tidyKeptRules = async ($: EngineInterface, id: string) => {
  if (!dir) return
  const now = await $.clock.now()
  for (const entry of await $.fs.list(rulesDir()).catch(() => [])) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue
    const path = `${rulesDir()}/${entry.name}`
    if (entry.name === `${id}.json`) {
      // (written again as it is, never as nothing: a file that could not be read is left)
      const text = await readOr($, path)
      if (text) await $.fs.write(path, text)
    }
    if (entry.name !== `${id}.json` && entry.mtimeMs && now - entry.mtimeMs > RULES_KEPT_FOR) await $.process.run(['rm', '-f', path]).catch(() => undefined)
  }
}

const chatHooks = (on: On) => {
  on('session.start', async ($, e, next) => {
    await knowSystem($).catch(() => undefined)
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    // and reads the list of work from the engine again
    cardsKept = undefined
    othersKept = undefined
    // and reads its own copy's version again
    loadedVersion = undefined
    // and takes nothing it knew of the person's settings and texts as sealed: the kept copy is checked again
    knownSeen = undefined
    const begun = await next(e)
    const home = (await $.env.get('HOME')) ?? ''
    dir = `${home}/.claude/claudopus`
    claudeDir = await configDir($)
    // How late the mod's own timer comes: behind, it does less until it has caught up (lookHold). From the start of the load, so a
    // long hold in the load's own reads is logged with them too
    holdAt = 0
    // (not in the test kit, whose clock a test moves by hours at once: there only a test that asks for it has it)
    const timing = (await $.env.get('CLAUDOPUS_TIMING')) ?? ''
    isTimed = !/^test\b/.test(timing)
    isDrawTimed = timing !== 'test'
    // (a timer of its own, which asks the engine nothing: it stops once another of this load's timers has found the load replaced)
    if (isTimed) {
      const hold = $.clock.every(HOLD_LOOK, () => (isLeft ? hold.cancel() : lookHold($)))
    }
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
    // Which reply is about which task, read from the chat's transcript, for task colours and links at the end (colours.tsx)
    void colourBuild($, true)
    // (and the cards made before task colours came in get theirs)
    await changeTodos($, list => list).catch(err => log($, `cards not given colours: ${String(err)}`))
    await clearGates($).catch(err => log($, `admin holds not cleared: ${String(err)}`))
    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
    await closeUndrawn($)
    $.clock.after(3000, () => closeUndrawn($))
    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
    await watchLoaded($).catch(err => log($, `tabs not watched: ${String(err)}`))

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    heldChat = id
    // Every chat has a watcher that brings Claudopus back should Claude switch it off. Its beat starts as soon as the chat is known,
    // before the rest of the start: on 27 Nov a Mac busy with tests took over a minute to reach it at the end, so the watcher took
    // each fresh load for one switched off and loaded Claudopus again twice, cutting off the chat's turn each time
    isEnded = false
    await startReviver($, id).catch(err => log($, `the watcher that brings Claudopus back was not started: ${String(err)}`))
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id === id ? m.needsContext : true }))
    await tidyKeptRules($, id).catch(err => log($, `kept rules not tidied: ${String(err)}`))
    // What was at work when this chat's process last ended is read before this load writes its own: it ended with that process
    await noteClosed($, id).catch(err => log($, `work the app closed on not looked for: ${String(err)}`))
    // and a chat the app's rewind started as a copy takes over what its first chat left (keep.tsx)
    await lookRewound($, id).catch(err => log($, `rewind not looked for: ${String(err)}`))
    // A result kept from before that still lists what it asks is that question on its card, as one handed in now
    // and one at work again that still shows it has had its answer
    const isOld = (one: Todo) => isStaleResultAsk(one) || (Boolean(one.questions?.length) && resultAsk(one, one.endedAt) !== one)
    if ((await ownCards($)).some(isOld)) await changeTodos($, list => list.map(one => (isStaleResultAsk(one) ? { ...one, ask: undefined } : resultAsk(one, one.endedAt))))
    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
    during('load: read the other chats')
    await readOthers($).catch(() => undefined)
    keysOnStart($)

    await $.tool.register({
      name: 'update',
      description: "Records a topic in the memory index: creates it, or changes the fields given. Each topic has a short page a fresh task reads first, and a history that is only added to: `add` puts what this task found, decided, built and left open at the end of the history, dated, with nothing to read first; `brief` replaces the whole page, so read it first and keep what still holds.",
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          repo: { type: 'string', description: 'The folder the task happens in' },
          state: { type: 'string', description: 'How far it has got, in at most six words; start with "done" once it is pushed or deployed. Put detail in `brief`' },
          summary: { type: 'string', description: 'One line on what the topic is for' },
          add: { type: 'string', description: "What this task found, decided, built and left open, with the paths that matter: added to the end of the topic's history" },
          brief: { type: 'string', description: 'The whole short page a fresh task reads first, at most 8000 characters: where things are, where each line of work stands, what is decided, what is open. Leave it out when none of that changed' },
        },
        required: ['name'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'recall',
      description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, topic notes, pastes, and the results finished tasks left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, area: { type: 'string', description: "Only this area of Progress or topic of the index, by its name: its topic page and history, its results and what the person said of it" } }, required: ['query'] },
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
          questions: { type: 'array', items: { type: 'string' }, description: named('Only with your last note before you hand in, and only when your result leaves something open that {name} may want to decide on seeing it: each as one short plain question. As you hand in they become your card\'s question, and {name}\'s answer starts you again. Never what holds you up: that is a question you ask before you finish') },
          choices: { type: 'array', items: { type: 'string' }, description: named('With `questions`: the buttons that answer them, as for `ask`, such as Release it and Don\'t release. Answer in words is always there') },
          task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: that request in one line. The chat starts it as a task of its own') },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'report',
      description: named(
        "For background tasks: hands {name} a report on a part that is finished, which they can look at or act on now, while you go on with the rest. It reaches {name} in the chat and is kept as a result of its own; your task, its helpers and commands carry on, and its card stays at work. Use it each time such a part is finished; SubagentHandback still hands in the last report, which ends the task. Write it as you write your report: the result first, with full paths, then what is still being done.",
      ),
      inputSchema: { type: 'object', properties: { message: { type: 'string', description: named('The report on what is finished, as {name} reads it in the chat') } }, required: ['message'] },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'ask',
      description: named(
        "For background tasks: when a step needs {name}'s own hands or go-ahead now (a code to paste, a key to give, a button to press, an approval; for a key give `key` and `from`, and its box shows with the question), puts your question at the top of the panel on your card and in the chat as a notice; {Name} answers with one of the buttons you give in `choices`, or in their own words. {Name} sees it before your report, so it must carry everything needed to decide and never point at an explanation elsewhere. It stays until answered, even after you finish; the answer arrives as a message at your next step, or starts you again. Meanwhile continue with what does not depend on it, or end your step saying what you are waiting for. Ask again if the answer leaves something open; call it with empty `text` only once you have seen it done. Never open a terminal for a command yourself.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          details: { type: 'string', description: 'What it is about, in full: what changes, what it costs, what is not done. Short plain lines and "- " lists with a blank line after, no tables or bold: the card is narrow and the chat shows plain text' },
          copy: { type: 'string', description: 'Only text they must paste elsewhere, such as a one-time code or a link' },
          choices: { type: 'array', items: { type: 'string' }, description: 'The buttons to answer with, in your words for this question, such as Approve and Keep it: give them, as none are added. Every button is an answer that reaches you and carries you on: never Not now, Later, Skip or Cancel, which are left out, as {name} leaves a question open by not pressing. Answer in words is always there' },
          command: { type: 'string', description: 'A command only they can run, never one you can run yourself: one line, whole, shown with a Copy button' },
          cwd: { type: 'string', description: 'The full path of the folder the command runs in, when it has relative paths' },
          pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the pictures the question is about, shown with it on the card and in the chat' },
          key: { type: 'string', description: named("Only when you ask {name} for a key, token or password a command of yours needs: the name it is saved under, such as SENTRY_READ_TOKEN. The box to paste it into shows with your question on your card at once; a saved key of that name is replaced, one of another name stays. Give no `choices` with it") },
          from: { type: 'string', description: named('With `key`: where {name} gets it, the full link of the page and what to press there, shown in the box') },
          release: { type: 'string', description: 'Only when you ask for the go-ahead to release, with the single choice Release it: the full path of your worktree. That press reaches you as the answer and allows your runs of the release runner from that folder until one has gone out, with no second question' },
        },
        required: ['text'],
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
    // A topic page grown past what a fresh task reads whole is made short in the background, the whole of it kept in its history
    afterLoad($, CATCH_UP_AFTER, () => void shortenPages($).catch(err => log($, `pages not made short: ${String(err)}`)))
    // and what waits in the queue of progress/ is indexed, the picture written when it is due, the history read in once (progress.tsx)
    afterLoad($, PROGRESS_LOAD_AFTER, () => void drainProgress($).catch(err => log($, `progress not indexed: ${String(err)}`)))
    // What the person had typed into a reply box before a reload of the mod is in its box again
    await readDrafts($).catch(() => undefined)
    // Work that is running when the chat loads brings the panel up, if it has never opened
    // and comes back after a reload of the mod (which closes it) if it was open or work is running
    // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
    const isRunning = (await ownCards($)).some(one => !one.parentId && one.status === 'working')
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
      for (const one of [...(await read($, flows)), ...(await ownCards($)).filter(card => !card.parentId)])
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
      // A question nobody has answered is said again now and then (remindAsks)
      if (seconds % 60 === 30) await remindAsks($).catch(err => log($, `questions not reminded of: ${String(err)}`))
      // (a list of every process: on battery every six seconds)
      if (seconds % (isOnBattery ? 6 : 2) === 0) await lookForStarted($).catch(err => log($, `running commands not looked at: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        if (!isBehind()) await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      // Held while the person types into a reply box (holdTimes)
      // A pane held while only its running times moved is drawn again once CALM is over (heldDrawings)
      const calmNow = await $.clock.now()
      // (a command run on the person's press too, whose running time its card shows after its task has ended)
      const isMoving = isFlowing || runList.some(run => Boolean(run.startedAt && !run.endedAt)) || (await ownCards($)).some(one => !one.parentId && one.status === 'working') || (await ownOthers($)).some(c => c.cards.some(card => card.status === 'working'))
      // A drawing of a size or tab no longer drawn is let go after a minute: it would only be drawn afresh
      if (!isTyping) for (const [key, held] of heldDrawings) if (calmNow - held.at >= 60_000) heldDrawings.delete(key)
      // The mod alone says when its panes are drawn again, and only when what they show has moved (calmLook)
      if (!isBehind()) await calmLook($, isMoving).catch(err => log($, `panes not looked at: ${String(err)}`))
      // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
      if (!isBehind() && (await ownCards($)).some(one => !one.parentId && one.status === 'working')) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))
      // and Claude's commands take their turn on the processor, so the person keeps cores of their own (pace.tsx)
      void paceWork($).catch(err => log($, `commands not paced: ${String(err)}`))
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await ownCards($))].filter(card => isLingering(card, now))) {
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
    // Its tasks keep their prompt cache an hour, as the chat does, unless the person's settings say otherwise
    await setTaskCache($).catch(err => log($, `the hour's cache for tasks was not set: ${String(err)}`))
    if (macs.length) everyLoad($, OPEN_EVERY, () => takeOpens($).catch(err => log($, `presses on other Macs not taken: ${String(err)}`)))
    if (macs.length) everyLoad($, FETCH_EVERY, () => syncResults($).catch(err => log($, `results not made the same: ${String(err)}`)))
    // What no chat on this Mac saved itself, caught up into memory a minute after the load and then every while
    afterLoad($, CATCH_UP_AFTER, () => startCatchUp($).catch(err => log($, `chats not caught up: ${String(err)}`)))
    everyLoad($, CATCH_UP_EVERY, () => startCatchUp($).catch(err => log($, `chats not caught up: ${String(err)}`)))
    // What tasks left behind, tidied as often (tidy.tsx), and the disk looked at every half minute from a few seconds after the load
    afterLoad($, TIDY_AFTER, () => startTidy($).catch(err => log($, `leftovers not tidied: ${String(err)}`)))
    everyLoad($, TIDY_EVERY, () => startTidy($).catch(err => log($, `leftovers not tidied: ${String(err)}`)))
    afterLoad($, 5000, () => lookDisk($).catch(err => log($, `disk not looked at: ${String(err)}`)))
    everyLoad($, DISK_EVERY, () => lookDisk($).catch(err => log($, `disk not looked at: ${String(err)}`)))
    // The person's figures to the leaderboard, only once they joined it (stats-tab)
    everyLoad($, 60_000, () => sendBoard($).catch(err => log($, `leaderboard not sent: ${String(err)}`)))
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

  on('prompt.submit', async ($, given, next) => {
    let e = given
    await holdTest($)
    // The texts a message is answered with are the ones known: a change made since is put back first
    if (dir) await personCheck($).catch(err => log($, `files not compared as a message came: ${String(err)}`))
    // The notice that a workflow ended ends its card
    if (dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) await flowEnded($, e.text).catch(err => log($, `workflow end not read: ${String(err)}`))
    // The engine's notice that work the person stopped has ended says it was stopped "by Claude": the chat is told it was them
    if (dir && !isOff && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) {
      const ids = [...e.text.matchAll(/<task-id>([^<]+)<\/task-id>/g)].map(m => m[1] ?? '')
      // A task's report Claudopus took at its hand-back comes to the chat's model with this notice that the task ended, for the chat
      // to give as its own reply (REPORT_FOR_CHAT); a later notice of the same end repeats nothing
      // (with the parts of results handed in while at work that the chat has not had yet, before them)
      const reports = [...(await partsFor($)), ...(await reportsFor($, ids))]
      if (reports.length) e = { ...e, context: [...(e.context ?? []), ...reports] }
      // A task that paused is still working: Claude Code's notice that it ended its step without a report is nothing new
      const cards = await ownCards($)
      // (nor is such a notice of a helper: its result goes to its task, taken at its hand-back, and is never the chat's)
      const atWork = new Set(cards.filter(one => !one.chat && (one.parentId ? one.parentId !== HELPER || one.tookReport : one.status === 'working')).map(one => one.id))
      const quiet = quietNotices(e.text, atWork, new Set(cards.filter(one => one.reportGiven && !reports.length).map(one => one.id)))
      const held = cards.filter(one => !one.parentId && isHeld(one) && ids.includes(one.id))
      if (held.length) return next({ ...e, context: [...(e.context ?? []), ...held.map(one => named(STOPPED_BY_YOU(titleOf(one), one.id)))] })
      // The chat's own command ended: how it ended and its last lines go with the notice
      const ended = await chatCommandEnded($, e.text).catch(() => [] as string[])
      if (ended.length) return next({ ...e, context: [...(e.context ?? []), ...ended] })
      // Notices with nothing new (a report already given, a task that paused) cost the chat no turn of the model's: a turn made of
      // nothing else is answered with no model (turn.start below, workHooks' turn.step), and one that comes while the chat is at
      // work goes into that turn, or makes such a turn should that turn end first. None is dropped, which Claude Code shows as a
      // warning card
      if (quiet.isQuiet && !reports.length) {
        for (const one of noticesOf(e.text)) quietHeld.add(one)
        await log($, quiet.isRepeat ? 'let in the notice that repeats a report already given, with no turn of the model\'s' : 'let in notices with nothing new, with no turn of the model\'s: tasks that paused')
        return next(e)
      }
    }
    // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
    const isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text)
    const isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed
    // The message a task sends the chat for a part of its result carries that part, as does Claudopus's own, and any other of
    // either that comes first (a task's comes marked as no one's words, isMeta)
    if (dir && !isPerson && (e.origin.kind === 'plugin' || e.origin.kind === 'peer') && !isOff && !e.command) {
      const parts = await partsFor($)
      if (parts.length) e = { ...e, context: [...(e.context ?? []), ...parts] }
    }
    if (e.isMeta || e.command || !dir) return next(e)
    if (!isPerson) {
      // A message a program, a schedule or a channel sent is saved too, marked with where it came from, so recall finds every chat;
      // notices and the mod's own messages are no one's words
      const from = programFrom(e.origin)
      if (from) await appendWords($, (await read($, me)).id, `## ${new Date().toISOString()} (${from})\n${e.text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))
      return next(e)
    }
    // A report Claudopus took whose notice never came goes with their message, so it is never left unsaid
    const context = [...(e.context ?? []), ...(await partsFor($)), ...(await reportsFor($))]
    // Their message lifts the hold on work they stopped: the chat is reminded it was stopped, and starts it again only if asked
    const stillHeld = (await ownCards($)).filter(one => isHeld(one) && !one.parentId)
    if ((await ownCards($)).some(isHeld)) {
      await changeTodos($, list => list.map(one => (isHeld(one) && one.byYou ? { ...one, byYou: { ...one.byYou, isLifted: true } } : one)))
      if (stillHeld.length) context.push(named(STOPPED_EARLIER(stillHeld.map(one => `"${titleOf(one)}" (${one.id})`))))
    }
    // A short answer typed by the person themselves, such as "allow" or "release it", is their press on the block it fits (typed.tsx)
    if (!isOff && !isPressed) {
      const typed = await typedAnswer($, e.text).catch(err => (void log($, `typed answer not taken: ${String(err)}`), undefined))
      if (typed) context.push(typed)
    }
    if (!isOff) {
      const board = await cardsNow($).catch(err => (void log($, `cards not told to the chat: ${String(err)}`), ''))
      if (board) context.push(named(board))
    }
    let text = e.text
    let pasted = ''
    const m = await read($, me)

    if (!isOff) {
      // The role goes out with the person's first message and after a compaction, each time as this chat first got it (keptRule)
      const role = await keptRule($, 'role', async () => named(fillModels((await inForce($, $.plugin.root, dir, 'roles/chat.md')).text, models, lean)))
      // The topics and areas as this message finds them: what changed since the chat was last given the list is told with it
      const index = (await readIndex($)).filter(s => !isScratchTopic(s.repo))
      const areas = await readAreas($)
      let changed = ''
      if (!m.isChat || m.needsContext) {
        // Each subject with the path of its brief, so a brief for work on it can name that path without a search
        context.push(`${role}\n${WORDS_LINE(m.id)}\n${PROGRESS_LINE()}\nTopics so far (name | folder | session | state | summary | its notes, under ${dir}):\n${await topicsGiven($)}`)
      } else changed = listChanges(index, areas, await read($, listSeen))
      if (!m.isChat || m.needsContext || changed) await update($, listSeen, () => listKeys(index, areas))
      const told = reportsTold(await ownReports($), await $.clock.now())
      context.push(`${await keptRule($, 'each', async () => BRIEF)}${told ? `\n${told}` : ''}\nProgress: ${progressDir()}${changed ? `\nChanged since you were given the topic list: ${changed}` : ''}`)
      await update($, me, one => ({ ...one, isChat: true, needsContext: false }))

      if (text.length > PASTE_CHARS) {
        const stamp = new Date().toISOString().replaceAll(':', '-')
        const path = `${dir}/pastes/${stamp}.md`
        pasted = path
        await $.fs.write(`${dir}/pastes/${stamp}.md`, hideKeys(text))
        text = `${text.slice(0, 600)}\n\n[${text.length - 1200} characters pasted here were saved to ${path} and left out of this chat]\n\n${text.slice(-600)}`
        context.push(PASTED)
      }
    }

    said = text
    heard = [...heard, text]
    // and for the quote over a reply about a task: which task each message went to (colours.tsx)
    heardSaid(e.text)
    // A message that names a report starts work from it: that work's own report is kept linked to it
    fromReport = (await ownReports($)).find(r => text.includes(`${reportPath(r)}/`) || text.includes(`reports/${r.id}`))?.id ?? ''
    const how = `${e.turnId ? ' (sent while Claude was working)' : ''}${e.origin.kind === 'bridge' ? ' (from the phone)' : ''}${isPressed ? ' (pressed or replied in the panel)' : ''}`
    await appendWords($, m.id, `## ${new Date().toISOString()}${how}\n${text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))
    // and on their own, without Claude's replies, so a task reads what they said whole (a paste as its start and where it is)
    await appendTo($, `${dir}/words/${m.id}.said.md`, hideKeys(saidEntry(await $.clock.now(), how, pasted ? e.text : text, pasted))).catch(err => log($, `message not saved: ${String(err)}`))
    // and goes into the queue of progress/, where their words may tick, add or set aside next steps (progress.tsx)
    queueSoon($, { kind: 'said', text })

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
    if (e.agentId !== undefined) {
      const id = e.agentId
      // Its last words are in its conversation now: its Details reads it again
      talkMoved(id)
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
    const r = await next({ ...e, instructions: [e.instructions, KEEP, e.agentId !== undefined && dir && !isOff ? KEEP_RULES : '', isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') })
    if (e.agentId === undefined && e.trigger !== 'precompute') await update($, me, m => ({ ...m, needsContext: true }))

    return r
  })

  // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
  // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
  // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there. They are the ones the chat
  // started with (keptRule), for the chat and its tasks alike: this event does not say whose conversation it is
  on('prompt.context', async ($, e, next) => {
    const r = await next(e)
    const files = r.instructionFiles ?? e.instructionFiles
    // The person's own copy in the memory folder when there is one, the shipped principles otherwise
    const { path, content } = await keptRule($, 'principles', async () => {
      const now = await inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')
      return { path: now.path, content: now.text }
    })
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

