// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them

// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
// Handed to the press's own hook while one is answered (front), so a narrow terminal draws the panel opened again
const backToPanel = async ($: EngineInterface, id: string) => {
  if (tabMoves.isPressing()) return tabMoves.handOver({ kind: 'back', id })
  await backAsked($, id)
}
const backAsked = async ($: EngineInterface, id: string) => {
  await $.ui.close({ id }).catch(() => undefined)
  await $.ui.close({ id: LIST }).catch(() => undefined)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })
}
// The ask whose reply box holds the terminal's keys in the list: kept on it while it waits, so an ask that comes in above it never
// takes the keys from what the person is typing
let keysAsk = ''
// Where the list's window starts on each surface, as last drawn: above the prompt says what waits at the top once it is out of sight
// (waitMarker). Forgotten when the list is closed
const listOffsets = new Map<string, number>()
// How many things wait on the person at the top of the list, as last drawn
let waitsAtTop = 0
const panelHooks = (on: On) => {

  // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
  // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
    await noteTabAsked($, id)
    const isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(start => id.startsWith(start))
    if (e.surface !== 'terminal' || !isTab) return next(e)
    const { Box, Button, Text } = uiOf($, e)
    const body = await next({ ...e, props: { ...e.props, scroll: { ...e.props.scroll, bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) } } } as typeof e)
    return (
      <Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Close" plain hotkey="x" onPress={() => void backToPanel($, id).catch(err => log($, `not back to the panel: ${String(err)}`))} />
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
          <Text dimColor wrap="truncate-end">{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x Tab for keys'}</Text>
        </Box>
        {body}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    if (paneId === LIST) listDrawing += 1
    try {
    // While the person types into a box the pane is drawn as it last was, whole, but for a change in its shape; not typing, as it last
    // was while only its running times moved, for CALM at most (heldDrawings)
    const heldKey = `${paneId}|${e.surface}|${e.props.placement ?? ''}|${e.props.scroll.bodyRows}|${(e.props as { bodyColumns?: number }).bodyColumns ?? ''}|${e.props.isFocused ? 1 : 0}|${e.props.scroll.offset > 0 ? 1 : 0}`
    const heldAt = await $.clock.now()
    if (paneId === LIST) drawnNow = heldAt
    const shape = await paneShape($, paneId)
    const content = await paneContent($)
    const held = heldDrawings.get(heldKey)
    if (held && held.shape === shape && (isTyping || (held.fresh === freshness && held.content === content && heldAt - held.at < CALM))) return ((paneId === LIST && (listHeldAt = heldAt)), held.drawing as Awaited<ReturnType<typeof next>>)
    if (paneId === LIST) drawnFiles.clear()
    // Read only for a drawing made afresh, so the running times alone ask for one again only once CALM is over (chatHooks)
    if (paneId === LIST) await read($, tick)
    const drawing = await (async () => {
    const { Box, Button, Markdown, Text } = uiOf($, e)
    // A picture pressed open large in this Details tab is drawn over it, with a row back above and below it
    const large = pictureIn.get(paneId)
    if (large) {
      const back = (key: string) => <Button key={`${key}-${presses}`} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={() => ((presses += 1), pictureBack($, paneId))} />
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {await pictureView($, e, large.path)}
          {back('pic-back-end')}
        </Box>
      )
    }
    // The list's running times move each second; a Details tab is drawn again only when its work moves
    if (paneId === LIST) await read($, tick)
    if (paneId === LIST) drawnNow = await $.clock.now()
    // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
    if (paneId === LIST && [...lateFrom.values()].includes(Infinity)) {
      const from = await $.clock.now()
      // Only while the reload is recent: a panel first opened long after shows no finish of then
      for (const [key, value] of lateFrom) if (value === Infinity) from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key)
      $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
    }
    const { isFinishedOpen = false } = await read($, view)
    // Work that ended while the list was held (an older drawing given again) was not seen ended: its moment at the top begins with
    // this drawing, the first to show it, never before
    if (paneId === LIST) {
      const from = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)]) {
        const key = `${one.id}:${one.endedAt}`
        if (one.status !== 'working' && one.endedAt > listFreshAt && one.endedAt < listHeldAt && !lateFrom.has(key) && from - one.endedAt < RELOAD_GRACE * 2)
          (lateFrom.set(key, from), $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1))))
      }
      listFreshAt = from
    }
    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
    // A card whose ask or gate was just pressed is drawn answered, from the press itself (asPressed)
    const all = (await read($, todos)).map(asPressed)
    const own = all.filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
    for (const one of cardsOf(otherChats)) if (one.ask?.replied && actingOn.get(`${one.id}:${one.ask.at}`) === one.ask.replied.text) actingOn.delete(`${one.id}:${one.ask.at}`)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    // Their helpers, which only a Details tab lists
    const helpersThere = helpersOf(otherChats)
    const chat = await read($, me)
    const at = await $.clock.now()
    // Prompts answered here and in other chats, for a minute after their call ended
    const answeredOf = (list: Prompt[] | undefined) => (list ?? []).filter(p => !p.endedAt || at - p.endedAt < PROMPT_SHOWN)
    const promptsAnswered = answeredShown(at)
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask || one.admins?.length || one.leftSince || (one.cutAt && !one.backAt && at - one.cutAt < CUT_OLD))
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of the chat always does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work that finished, in its moment: for its two seconds it is at the top under all that waits on the person, outlined green;
    // then it goes under Finished. Work stopped or stopped by an error is not: it pauses in its place, in its own look
    // In the few rows above the prompt a narrow terminal gives the panel, the outline would take two of them
    const isAbovePrompt = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    const isFinishMoment = (one: Todo) => one.status === 'done' && !one.ask && lingers(one, at)
    const isFlowMoment = (f: Flow) => f.status === 'done' && isLingering(f, at) && flowPassed(f, roundsOf(f)) !== false
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' }
    // Work the app sent to an older model says so, and which one; work that answers from one all the same says so
    const offModel = (one: Todo) => (one.flagged ? `ended after a safety flag, not carried on on ${one.flagged}` : one.moved ? `moved to ${one.moved} by the app` : rightModel(one.model ?? '') ? 'not a model work should run on' : '')
    const glance = (one: Todo, count = '') =>
      [one.ask && one.status === 'done' && !isActingOnReply(one) ? 'Waits for your answer' : one.status === 'stopped' && one.byYou ? 'Stopped by you' : stood[isActingOnReply(one) ? 'working' : one.status], modelName(one.model ?? ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
    // The same line on running work, whose model's name is a control: dim like the rest, underlined under the pointer. Pressed,
    // the line becomes the three models, the one it runs on ticked; a press on one moves the work to it and closes the choice
    const { picking = '' } = await read($, view)
    // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
    // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
    const lead = e.surface === 'terminal' ? 0 : 'xs'
    // On a small card the line also counts its to-dos, before the time
    const facts = (one: Todo, isWhole: boolean, count = '') => {
      const name = modelName(one.model ?? '')
      // Another chat's work is moved to another model in that chat
      if (one.status !== 'working' || !name || one.chat)
        return (
          <Box paddingLeft={isWhole ? 0 : lead}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one, count)}</Text>
          </Box>
        )
      const scope = `model-${one.id}`
      if (picking === one.id)
        return (
          <Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(model => (
              <Button
                key={`pick-${one.id}-${model}-${presses}`}
                label={`${modelName(model) === name ? '✓ ' : ''}${modelName(model)}`}
                plain
                dimColor={modelName(model) !== name}
                hover={{ scope: `${scope}-${model}`, underline: true }}
                onPress={() => ((presses += 1), void choose($, one.id, model))}
              />
            ))}
          </Box>
        )
      const rest = [offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ')
      return (
        <Box flexDirection="row" alignItems="flex-start">
          <Button
            key={`model-${one.id}-${presses}`}
            label={name}
            plain
            dimColor
            hover={{ scope, underline: true }}
            onPress={() => ((presses += 1), void update($, view, v => ({ ...v, picking: one.id })))}
          />
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{` · ${rest}`}</Text>
          </Box>
        </Box>
      )
    }
    // Where a piece of work is: the line it last wrote about itself
    const now = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')?.text ?? ''

    const table = uiOf($, e)
    // How much text two rows of a small card hold: the pane's cells less the card's bar, padding and dots. The app's letters are
    // narrower than a cell, the terminal's are one each
    const room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)))
    // How many letters one row of a small card holds, and a bold one: the card's two-row room halved
    const perRow = Math.max(24, Math.floor(room / 2))
    // Three moving dots: beside the line a small card gives, and beside the to-do being done on the big one
    // A terminal draws no picture, so there the mark is a letter
    const live = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Being done now" width={22} height={LINE} isInteractive />
        </Box>
      ) : (
        (e.surface === 'terminal' ? termDots(table, $, paneId, key) : null) ?? <Text color={LIVE}>▸</Text>
      )

    // What a piece of work needs the person's hands for now, in its colour, with the exact text to copy beside one Copy button, then
    // the same three ways to answer on every ask, on the small card as in Details: the work's own buttons, or Done and Not now when
    // it gave none, and a box for a reply in the person's own words. The list's times stand still while the person types (holdTimes)
    // In the terminal the first ask's reply box holds the keys as the panel takes them: what is typed then is the person's words,
    // never a button's letter, and Tab leaves it for the buttons and their keys
    let askFocused = false
    // The small pictures every ask in this drawing draws, in characters: together they stay under ASK_PICS_CHARS, and in Details under
    // what the app draws in one tab beside the chat's own small pictures; one past that is a row that opens it
    let askChars = 0
    const askPictures = (one: Todo, key: string, isWhole: boolean) => {
      const paths = one.ask?.pictures ?? []
      if (!paths.length) return null
      // An ask of a chat on another Mac names that Mac's files, which are not here: a file at the same path here is another picture
      if (one.chat?.host) return <Text key={`${key}-pics`} dimColor wrap="wrap">{`Its ${paths.length === 1 ? 'picture is' : `${paths.length} pictures are`} on the Mac that chat runs on, and shown in that chat.`}</Text>
      const drawing = uiOf($, e)
      const canDraw = e.surface !== 'terminal' && 'Svg' in drawing
      // The terminal draws no picture: a row each that opens it, with no small copy made
      const made = canDraw ? askPicturesOf($, one) : paths.map(path => ({ name: fileName(path), path, thumb: null }) as Pic)
      if (!made) return <Text key={`${key}-pics`} dimColor>Making its pictures small…</Text>
      if (!made.length) return null
      // In Details the chat's own small pictures are drawn too: all of them together stay near what that tab keeps for pictures
      const chatChars = isWhole ? [...(shots.get(one.id)?.shots.values() ?? [])].flat().reduce((sum, pic) => sum + (pic.thumb?.source.length ?? 0), 0) : 0
      const most = isWhole ? Math.min(ASK_PICS_CHARS, PICTURES_CHARS + 30_000 - chatChars) : ASK_PICS_CHARS
      return (
        <Box key={`${key}-pics`} flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1} width="100%">
          {made.map((pic, n) => {
            const isDrawn = canDraw && pic.thumb !== null && askChars + pic.thumb.source.length <= most
            if (isDrawn && pic.thumb) askChars += pic.thumb.source.length
            const row = `${key}-pic-${n}`
            // Drawn at most ASK_PIC_WIDE across, from a copy up to twice as wide, so two sit side by side on a wide sidebar
            const size = pic.thumb && pic.thumb.width && pic.thumb.height ? sizedAskPic(pic.thumb.width, pic.thumb.height) : undefined
            return (
              <Box key={row} flexDirection="column" alignItems="flex-start" flexShrink={1} minWidth={0}>
                {isDrawn && pic.thumb && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`${row}-svg`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(size ?? {})}
                  />
                ) : null}
                <Button
                  key={`${row}-open-${presses}`}
                  label={`⤢ ${isDrawn ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                  plain
                  onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, row, press.surface))}
                />
                {e.surface === 'terminal' ? pictureSaidRow($, drawing, `${row}-said`, pic.path) : null}
              </Box>
            )
          })}
        </Box>
      )
    }
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
      const lost = sentLine(one, at)
      // Answered in the person's own words and acted on: its question, with their reply under it, and nothing to press or type
      if (isActingOnReply(one))
        return (
          <Box key={key} flexDirection="column" gap={1}>
            <Text wrap="wrap" color={LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
            {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
          </Box>
        )
      return (
        <Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={needsPerson(one) ? NEEDS : LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
          {/* What the ask is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
          {ask.details ? (
            <Box key={`${key}-details`} flexDirection="column" minWidth={0}>
              <Markdown text={isWhole || ask.details.length <= DETAILS_ON_CARD ? ask.details : `${cut(ask.details, DETAILS_ON_CARD)}\n\nThe rest is in its Details.`} />
            </Box>
          ) : null}
          {/* The pictures it is about, each drawn small with a row that opens it large, so it is decided here */}
          {askPictures(one, key, isWhole)}
          {ask.copy ? (
            <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text mono wrap="wrap">{withLinks(table.Link, ask.copy, `${key}-copy`)}</Text>
              </Box>
              <Button key={`ask-${one.id}-copy-${presses}`} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, one.id, ask.copy ?? '', press.surface)} />
            </Box>
          ) : null}
          {/* A command to type: Terminal opens with it typed, not run, only on this press */}
          {canOpenTerminal(one) ? (
            <Box flexDirection="row">
              <Button key={`${key}-terminal-${presses}`} label={openedKey === `${one.id}:${ask.at}:${ask.copy}` ? '✓ Opened in Terminal, typed, not run' : 'Open in Terminal'} onPress={() => void openTerminal($, one).catch(err => log($, `terminal not opened: ${String(err)}`))} />
            </Box>
          ) : null}
          {/* Another chat's ask is answered only in its own chat: no file carries an answer there */}
          {one.chat ? (
            <Text key={`${key}-elsewhere`} dimColor wrap="wrap">{`Answer it in its own chat, “${one.chat.title || 'another chat'}”${one.chat.host ? `, on ${one.chat.host}` : ''}.`}</Text>
          ) : null}
          {one.chat ? null : (
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map((choice, n) => (
              <Button key={`${key}-choice-${n}-${askMark(ask)}-${loadMark}`} label={choice} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
            ))}
          </Box>
          )}
          {'Input' in table && !one.chat ? (
            <Box width="100%" flexDirection="column">
              <table.Input
                key={`${key}-reply-${replies.get(one.id) ?? 0}-${askMark(ask)}`}
                autoFocus={e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : undefined}
                placeholder="Or reply in your own words"
                value={draftShown(one.id, ask)}
                submitLabel="send"
                onInput={value => void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($))}
                onSubmit={value => void (dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
              />
            </Box>
          ) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>
      )
    }

    // The small card: its title, which opens its Details, with Stop at the far end of that row; where it stands and how many
    // to-dos are done; the line the work last wrote beside the three dots; its helpers. Each part has a fixed number of rows
    // and is clipped to them, so a card never changes height as the work goes
    let cardNo = 0
    let keyed = false
    // One row under the facts while the work runs: the to-do being done, or the next when none is, numbered done + 1 of all kept,
    // which is how far along it is (the edge's lighter part), not its place in the Details list
    const stepLine = (one: Todo, kept: Item[], done: number) => {
      if (one.status !== 'working' || one.chat) return null
      const doing = kept.find(item => item.state === 'doing')
      const named = doing ?? kept.find(item => item.state === 'open')
      if (!kept.length) return null
      // Every step ticked while it still runs: said in the same row, so the card keeps its height until it ends
      if (!named)
        return (
          <Box key={`step-${one.id}`} height={1} overflow="hidden" paddingLeft={lead}>
            <Text dimColor wrap="truncate-end">{`All ${kept.length} steps done`}</Text>
          </Box>
        )
      return (
        <Box key={`step-${one.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          <Box flexShrink={0}>
            <Text dimColor>{`${doing ? 'Step' : 'Next, step'} ${done + 1} of ${kept.length} ·`}</Text>
          </Box>
          <Box flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end" dimColor={!doing}>{named.text}</Text>
          </Box>
        </Box>
      )
    }
    const small = (one: Todo) => {
      // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
      // A card in its moment at the top is not numbered, so the others keep their numbers through it
      if (!isFinishMoment(one)) cardNo += 1
      const digit = keyed && cardNo <= 9 && !isFinishMoment(one) ? String(cardNo) : undefined
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      const tree = treeUnder(one)
      const scope = `card-${one.id}`
      // Just finished, in its moment at the top: outlined in the green of what is done, as an allowed notice is
      const isMoment = isFinishMoment(one) && !isAbovePrompt
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isMoment ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
          {edge(one, kept.length, done, kept.some(item => item.state === 'doing'))}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`open-${one.id}-${presses}`} plain hotkey={digit} hover={{ scope, underline: true }} onPress={() => openWork($, one.id)}>
                    <Text bold wrap="truncate-end">{titleOf(one)}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {one.status === 'working' && !one.chat ? (
                  <Box flexShrink={0}>
                    <Button key={`stop-${one.id}`} label="Stop" plain dimColor hover={{ scope: `stop-${one.id}`, underline: true }} onPress={() => void stop($, one.id)} />
                  </Box>
                ) : null}
              </Box>
              {facts(one, false, kept.length > 0 ? `${done} of ${kept.length} done` : '')}
            </Box>
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead) */}
            {one.ask ? (
              <Box key={`ask-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {askBlock(one, `ask-${one.id}`)}
              </Box>
            ) : null}
            {one.admins?.length || cardNotesOf(one.id, at).length ? (
              <Box key={`gate-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {adminBlock($, table, one, `gates-${one.id}`, at)}
              </Box>
            ) : null}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (
              <Box key={`stuck-${one.id}`} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>
            ) : null}
            {/* Cut off as the chat's process ended: when, and since when it goes on again; amber when it could not be started again */}
            {cutLine(one) && !one.chat ? (
              <Box key={`cut-${one.id}`} paddingLeft={lead}>
                <Text color={one.backAt ? undefined : NEEDS} dimColor={Boolean(one.backAt)} wrap="wrap">{cutLine(one)}</Text>
              </Box>
            ) : null}
            {/* Still at work, waiting for a command of its own it started in the background: that it waits, the command itself
                being a row on its tree */}
            {waitLine(one, at) ? (
              <Box key={`wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at, jobsOf(one, at).length > 0)}</Text>
              </Box>
            ) : null}
            {/* Its helpers gone quiet, in amber: those at work are rows on its tree */}
            {lookedInLine(one, at) && !one.chat ? (
              <Box key={`looked-${one.id}`} paddingLeft={lead}>
                <Text dimColor={!one.lookedIn?.quiet} color={one.lookedIn?.quiet ? NEEDS : undefined} wrap="wrap">{lookedInLine(one, at)}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : one.status === 'failed' ? 'error' : undefined} dimColor={one.status !== 'done' && one.status !== 'failed'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? '✕ Stopped by an error' : one.byYou ? 'Stopped by you' : 'Stopped'}
                  </Text>
                ) : (
                  <Box flexDirection="column" minWidth={0}>
                    <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || needsPerson(one)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>
                    {/* Held where it was after an answer, once a newer line of the work's took the answer's place: why it is still up there */}
                    {!one.ask && !sentLine(one, at) && heldAnswer(one, at) ? <Text key={`held-answer-${one.id}`} dimColor wrap="truncate-end">{`✓ You answered “${cut(heldAnswer(one, at)?.text ?? '', 60)}”`}</Text> : null}
                  </Box>
                )}
              </Box>
            </Box>
            {/* Finished, with something it started still running: what, how long, and a way to stop it */}
            {leftLine(one, at) && !one.chat ? (
              <Box key={`left-${one.id}`} flexDirection="column" gap={1} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{leftLine(one, at)}</Text>
                <Box flexDirection="row">
                  <Button key={`left-stop-${one.id}-${presses}`} label="Stop it" onPress={() => void stop($, one.id)} />
                </Box>
              </Box>
            ) : null}
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={`tree-${one.id}`} flexDirection="column" paddingLeft={lead}>{tree}</Box> : null}
          </Box>
        </Box>
      )
    }
    // The card's coloured edge. Purple while it works, green once it finished, amber while it needs the person's hands; work
    // stopped or stopped by an error has none. While it works the edge is also its to-dos, one part each from the top down:
    // those done bright, the one being done between, the rest a dim tint of the same purple, so the whole edge stays purple.
    // More than EDGE_PARTS to-dos are one edge filled as far as they are done. The parts are boxes that share the card's
    // height, whatever it is; a terminal has no part thinner than a row, so there the edge is whole
    const edge = (one: Todo, count: number, done: number, isDoing: boolean) => {
      // An error that stopped it is said in red, on its edge too
      if (one.status === 'failed') return <Box width={1} flexShrink={0} backgroundColor="error" />
      if (one.status !== 'working' && one.status !== 'done') return <Box width={1} flexShrink={0} />
      if (needsPerson(one) || one.status === 'done' || !count || e.surface === 'terminal') return <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : one.status === 'working' || isActingOnReply(one) ? LIVE : DONE} />
      const shade = (n: number) => (n < done ? LIVE : n === done && isDoing ? `${LIVE}AD` : `${LIVE}5C`)
      return count > EDGE_PARTS ? (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column">
          {/* Too many to-dos for a part each: one bar in the same three shades, done, the one being done, and what is left */}
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE} /> : null}
          {isDoing && count > done ? <Box key="doing" flexGrow={1} backgroundColor={`${LIVE}AD`} /> : null}
          {count - done - (isDoing ? 1 : 0) > 0 ? <Box key="left" flexGrow={count - done - (isDoing ? 1 : 0)} backgroundColor={`${LIVE}5C`} /> : null}
        </Box>
      ) : (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column" gap={count > 8 ? 0.2 : 0.3}>
          {Array.from({ length: count }, (_, n) => (
            <Box key={`part-${n}`} flexGrow={1} backgroundColor={shade(n)} />
          ))}
        </Box>
      )
    }

    // ---- The helpers a piece of work started, inside its card as a tree: each one slim row joined to its parent by a line ----
    // A row is a dot at the end of its line, the helper's name, its model, context and time, and a press on the name
    // opens its own Details. The dot is purple while it works, green once it finished, red when an error stopped it, grey when it
    // was stopped; one that ended is dim, and one at work has a ring that slowly grows out of its dot and fades.
    // The lines are drawn as a card's three dots are, which the app is seen to draw
    const twigLines = (t: Twig, key: string, status?: Todo['status']) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg
            key={`${key}-svg`}
            source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')}
            alt={status ? { working: 'At work', done: 'Finished', failed: 'Stopped by an error', stopped: 'Stopped' }[status] : 'Ended'}
            width={twigWidth(t)}
            height={LINE}
            isInteractive
          />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          {status === 'working' && e.surface === 'terminal' && 'Raster' in table ? termRing(table, $, paneId, `${key}-ring`) : <Text color={status === 'working' ? LIVE : status === 'done' ? DONE : status === 'failed' ? 'error' : undefined} dimColor={!status || status === 'stopped'}>
            {status === 'working' ? '●' : status === 'done' ? '✓' : status === 'failed' ? '✕' : status === 'stopped' ? '■' : '○'}
          </Text>}
        </Box>
      )
    // One row of the tree, in the same columns whatever it says: the lines and dot, what a press opens, the time
    const twigRowOf = (t: Twig, key: string, label: string, isDim: boolean, time: string, onPress: () => void, status?: Todo['status']) => (
      <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigLines(t, `twig-lines-${key}`, status)}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Button key={`open-${key}-${presses}`} label={label} plain dimColor={isDim} hover={{ scope: `twig-${key}`, underline: true }} onPress={onPress} />
        </Box>
        {time ? (
          <Box flexShrink={0}>
            <Text dimColor>{time}</Text>
          </Box>
        ) : null}
      </Box>
    )
    const twigRow = (t: Twig, scope: string) => {
      const one = t.one
      if (!one) return null
      // Beside its name: the model it runs on, how much context it holds, and its time last, so the ticking moves nothing else.
      // A narrow panel drops the context, then the model, so the name keeps room to be read
      const time = took((one.endedAt || at) - one.startedAt)
      const model = modelName(one.model ?? '')
      const width = perRow - 4 - t.depth * 2
      // A call it has run for minutes says so in place of the model and context, so a long step does not look like a hang
      // (a command it waits on has its own row under it instead)
      const busy = one.running?.cmd ? '' : [runningLine(one, at), runningLine(one, at).replace(/^.* running · /, 'running · ')].find(text => text && width - text.length >= 12)
      const side = busy ? busy : [[model, one.tokens ? thousands(one.tokens) : '', time], [model, time], [time]].map(parts => parts.filter(Boolean).join(' · ')).find(text => width - text.length >= 12) ?? time
      return twigRowOf(t, `${scope}-${one.id}`, cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, () => openWork($, one.id), one.status)
    }
    // In a small card: the helpers at work now or just ended, and any that one of those runs under; the rest are one closing
    // row, laid out as the others, that says how many have ended and opens the card's Details, where every helper is listed
    // A job on the tree: its line ends in a dot in the colour of its kind (green a server, blue a download, purple a script),
    // with a ring while it runs; then what it is, the latest line it wrote, dim, and its percent and time last
    const jobLines = (t: Twig, key: string, job: Job) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={twigSvg(t, LINE, JOB_COLOR[job.kind], !job.isPaused && job.kind !== 'wait' && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
        </Box>
      )
    // Under its name, the tree's lines carried down past it, as wide as its own lines and mark, so its second line starts under its
    // name. The app drops a picture with no words for it, and the line then started at the card's edge, left of the tree
    const jobRails = (t: Twig, key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={railSvg(t, LINE)} alt={t.isLast ? 'Last on the tree' : 'The tree goes on'} width={twigWidth(t)} height={LINE} />
        </Box>
      ) : (
        <Box key={key} flexShrink={0}>
          <Text dimColor>{`${t.rails.map(isOn => (isOn ? '│ ' : '  ')).join('')}${t.isLast ? '  ' : '│ '}   `}</Text>
        </Box>
      )
    // How it stands, its second line, so a glance tells whether it moves and how far it is: how much of how much, its percent,
    // speed and time left as the run printed them, or worked out from its percent where it says none; then paused, a wait's target,
    // a watch's last event, nothing printed since it began, or quiet for minutes (in amber). A run that prints says nothing of when:
    // its line is read every few seconds, so what it says is now
    // a run whose own progress line gives its percent but no time left has one worked out from how long it has run, marked as a
    // guess: only the work's own line, which counts the whole run (a tool's bar starts again at each epoch, package or phase),
    // only while that line is the latest, and never for a wait, whose count is how long it is willing to wait
    const guessLeft = (job: Job, ran: number) => {
      const share = Number.parseFloat(job.pct ?? '') / 100
      return !job.left && job.isOwn && !job.isEarlier && job.kind !== 'wait' && share >= 0.01 && share < 1 && ran >= 20_000 ? timeLeftText((ran / 1000) * ((1 - share) / share)) : undefined
    }
    // Its time, and how long it said it should take. Once past that, the figure it said no longer holds: where the run says how
    // long it has left as it prints now (or its percent gives one), the time so far and that left make a fresh expectation;
    // otherwise its row says plainly that it is past the time it was expected to take, in amber. Nothing is made up
    const jobTime = (job: Job, ran: number) => {
      if (!job.expectText || !job.expect) return { time: took(ran), isPast: false }
      if (ran <= job.expect) return { time: `${took(ran)} of ~${job.expectText}`, isPast: false }
      const isFresh = !job.isPaused && Boolean(job.wroteAt) && at - (job.wroteAt ?? 0) < 60_000
      // the time left is as of when it was printed, so it adds to the time it had run then
      const printedAt = Math.min(ran, Math.max(0, (job.wroteAt ?? 0) - job.at))
      const left = isFresh ? leftSeconds(job.left ?? guessLeft(job, printedAt)) : undefined
      const fresh = left ? timeLeftText(Math.max(ran / 1000, printedAt / 1000 + left))?.replace(/ left$/, '') : undefined
      return fresh ? { time: `${took(ran)} of ~${fresh}`, isPast: false } : { time: `${took(ran)} · past ~${job.expectText}`, isPast: true }
    }
    const jobStand = (job: Job, width: number) => {
      const pct = job.pct ? [job.pct] : []
      const quiet = job.wroteAt ? at - job.wroteAt : 0
      const ran = at - job.at
      const [state, short, isWarn]: [string, string, boolean] =
        job.isPaused ? ['paused', 'paused', true]
        : job.kind === 'wait' && (job.target || !job.wroteAt || job.isEmpty) ? (job.target ? [job.target, job.target.replace(/^what it waits for (is|has) /, '').replace(/ unchanged /, ' still '), true] : ['waiting', 'waiting', false])
        : job.kind === 'watch' ? (job.wroteAt && !job.isEmpty ? [`last event ${shortAgo(quiet)} ago`, `event ${shortAgo(quiet)} ago`, false] : ['no event yet', 'no event', false])
        // A run left going whose output goes to no file: it runs, and gives no progress (nothing is warned of, as it was never told)
        : job.isUntold ? ['running, no progress given', 'no progress given', false]
        : job.isEmpty ? (ran >= JOB_QUIET ? [`nothing printed in ${shortAgo(ran)}`, `silent ${shortAgo(ran)}`, true] : ['nothing printed yet', 'silent', false])
        // (a server prints only when asked, so its quiet is no warning)
        : job.wroteAt && quiet >= JOB_QUIET && job.kind !== 'server' ? [`quiet for ${shortAgo(quiet)}`, `quiet ${shortAgo(quiet)}`, true]
        : job.wroteAt ? ['', '', false]
        // A job whose output cannot be found says so, so a blank row is never taken for one that moves
        : !job.id.startsWith('call-') && at - job.at >= JOB_UNREAD ? ['output not found', 'no output', true]
        : ['', '', false]
      const warn = isWarn && Boolean(state)
      // its speed and time left only while it prints: a minute old, they are no longer how it goes
      const isFresh = !warn && Boolean(job.wroteAt) && quiet < 60_000
      const guess = guessLeft(job, ran)
      const left = isFresh ? (job.left ? [job.left] : guess ? [`~${guess}`] : []) : []
      const rate = job.rate && isFresh ? [job.rate] : []
      const full = job.done ? [job.total ? `${job.done} of ${job.total}` : job.done] : []
      const compact = job.done ? [job.total ? `${job.done}/${job.total}` : job.done] : []
      // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
      const bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? [`${job.done}/${job.total.split(' ')[0]}`] : compact
      // the memory it holds, where it is known, until the line has no room for it
      const mem = job.mem ? [job.mem] : []
      const text = firstFit([[...full, ...pct, ...rate, ...left, state, ...mem], [...full, ...pct, ...rate, ...left, short, ...mem], [...full, ...pct, ...left, short, ...mem], [...compact, ...pct, ...left, short, ...mem], [...full, ...pct, ...rate, ...left, state], [...full, ...pct, ...rate, ...left, short], [...full, ...pct, ...left, short], [...compact, ...pct, ...left, short], ...(left.length ? [[...compact, ...left, short], [...bare, ...left]] : []), [...compact, ...pct, short], [...compact, ...pct], [...bare, ...pct], [...pct, short], [short]], width)
      return { text, isWarn: warn }
    }
    // A job's two lines: what it is, in the work's own words, with its time; and under it how it stands, then the latest line it
    // printed where that is not the progress already said
    const jobRow = (t: Twig, scope: string) => {
      const job = t.job
      if (!job) return null
      const key = `${scope}-job-${job.id}`
      const width = perRow - 4 - t.depth * 2
      const ran = at - job.at
      const { time, isPast: isLong } = jobTime(job, ran)
      const name = cut(jobHead(job), Math.max(12, width - time.length - 1))
      const head = (
        <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {jobLines(t, `twig-lines-${key}`, job)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {/* A press shows its output whole in a Terminal window, where this Mac can open one */}
            {canOpenJob(job) ? (
              <Button key={`output-${key}-${presses}`} label={name} plain hover={{ scope: `twig-${key}`, underline: true }} onPress={() => void openJobOutput($, job).catch(err => log($, `output not opened: ${String(err)}`))} />
            ) : (
              <Text wrap="truncate-end">{name}</Text>
            )}
          </Box>
          <Box flexShrink={0}>
            <Text dimColor={!isLong} color={isLong ? NEEDS : undefined}>{time}</Text>
          </Box>
        </Box>
      )
      if (job.id.startsWith('more-')) return head
      const { text: stand, isWarn } = jobStand(job, width)
      // Its percent, in blue, where the line says it as a part of its own
      const pctAt = job.pct && !isWarn ? (stand.startsWith(`${job.pct} · `) || stand === job.pct ? 0 : stand.includes(` · ${job.pct}`) ? stand.indexOf(` · ${job.pct}`) + 3 : -1) : -1
      // The latest line, unless it is only a progress bar its percent already says; a wait says the work's own words for it.
      // A run read from a progress line above its last still shows the last, such as an error after it
      const latest = job.kind === 'wait' && job.waitsFor ? (job.isNamed && !isKindSaid(job.label) ? job.label : '') : job.done && !job.isEarlier ? '' : job.latest && job.latest.replace(/[#=>|\-█▉▊▋▌▍▎▏░▒▓\s\d.%]/g, '').length >= 3 ? job.latest : ''
      const rest = width - stand.length - (stand ? 3 : 0)
      const detail = latest && rest >= 10 ? cut(latest, rest) : ''
      if (!stand && !detail) return head
      return (
        <Box key={`job-${key}`} flexDirection="column" flexShrink={0}>
          {head}
          <Box key={`stand-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {jobRails(t, `rails-${key}`)}
            {/* (on a desktop by the step a plain Button pads a run's name with, where its name is one, so the two start in one column) */}
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={canOpenJob(job) ? lead : 0}>
              {pctAt >= 0 && job.pct ? (
                <Box flexDirection="row" flexShrink={0}>
                  {pctAt > 0 ? <Text dimColor>{stand.slice(0, pctAt)}</Text> : null}
                  <Text color={JOB_COLOR.download}>{job.pct}</Text>
                  <Text dimColor>{stand.slice(pctAt + job.pct.length)}</Text>
                </Box>
              ) : stand ? (
                <Box flexShrink={0}>
                  <Text color={isWarn ? NEEDS : undefined} dimColor={!isWarn}>{stand}</Text>
                </Box>
              ) : null}
              {detail ? (
                <Box flexShrink={1000} minWidth={0}>
                  <Text dimColor wrap="truncate-end">{stand ? ` · ${detail}` : detail}</Text>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      )
    }
    // Each branch with the jobs its helper has running first, under it, as the card's own come first under the card
    // At most JOBS_SHOWN each, the newest; the rest one row that says how many more run and opens the card's Details
    // In Details every one is shown
    const jobBranches = (card: Todo, isAll = false): Branch[] => {
      const jobs = jobsOf(card, at)
      if (isAll || jobs.length <= JOBS_SHOWN) return jobs.map(job => ({ one: card, job, kids: [] }))
      const more = jobs.length - JOBS_SHOWN + 1
      const shown = jobs.slice(-(JOBS_SHOWN - 1))
      const rest: Job = { id: `more-${card.id}`, label: `${jobs.slice(0, more).reduce((n, job) => n + (job.count ?? 1), 0)} more jobs`, cmd: '', kind: 'watch', at: Math.min(...jobs.slice(0, more).map(job => job.at)) }
      return [...shown, rest].map(job => ({ one: card, job, kids: [] }))
    }
    const withJobs = (branches: Branch[], isAll = false): Branch[] =>
      branches.map(b => (b.job ? b : { ...b, kids: [...jobBranches(b.one, isAll), ...withJobs(b.kids, isAll)] }))
    const rowOf = (t: Twig) => (t.job ? jobRow(t, 'list') : twigRow(t, 'list'))
    // In a small card: what it has running, then the helpers at work now or just ended, and any that one of those runs under; the
    // rest are one closing row, laid out as the others, that says how many have ended and opens the card's Details, where every
    // helper is listed. A helper that ended with a job still running stays for it
    // The runs that ended under a card: its own and its helpers', oldest first
    const endedRunsOf = (one: Todo, list = all) => [one, ...underOf(list, one.id)].flatMap(kid => kid.endedRuns ?? []).sort((a, b) => a.endedAt - b.endedAt)
    // Runs that ended leave the tree at once; the closing row counts them with the helpers that ended, and says how many of them
    // failed, were killed or ran out of time, so nothing goes without a trace
    const treeUnder = (one: Todo) => {
      const under = underOf(all, one.id)
      const own = jobBranches(one)
      const runs = endedRunsOf(one, one.chat ? helpersThere : all)
      if (!under.length && !own.length && !runs.length) return []
      const branches = [...own, ...withJobs(branchesOf(all, one.id, kid => kid.status === 'working' || isLingering(kid, at) || jobsOf(kid, at).length > 0))]
      const twigs = twigsOf(branches, true)
      const rest = under.length - twigs.filter(t => !t.job).length
      if (!rest && !runs.length) return twigsOf(branches).map(rowOf)
      const closing: Twig = { depth: 1, rails: [], isLast: true, hasKids: false }
      return [...twigs.map(rowOf), twigRowOf(closing, `rest-${one.id}`, endedSummary(rest, runs), true, '', () => openWork($, one.id))]
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const flowTokens = (f: Flow) => f.agents.reduce((sum, one) => sum + (one.tokens ?? 0), 0)
    const agentsWord = (n: number) => `${n} ${n === 1 ? 'agent' : 'agents'}`
    // Where it stands, as Claude's own view of a workflow says it: "Workflow", how many agents it has started, its tokens and time,
    // in as many of those words as the row holds
    const flowGlance = (f: Flow, most = Infinity) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const tokens = flowTokens(f) ? `${thousands(flowTokens(f))} tokens` : ''
      const agents = agentsWord(f.agents.length)
      const head = stood[f.status] ? [stood[f.status], 'Workflow'] : ['Workflow']
      return firstFit([[...head, agents, tokens, time], [...head, agents, time], [head.at(-1) ?? 'Workflow', agents, time], ['Workflow', time]], most)
    }
    const roundsLabel = (f: Flow, rounds: Round[]) => (rounds.length ? `round ${rounds.length}${f.cap ? ` of ${f.cap}` : ''}` : f.cap ? `0 of ${f.cap} rounds` : '')
    const verdict = (r: Round) => (r.isOpen ? (r.phase ? `${doing(r.phase).toLowerCase()} now` : 'starting') : r.pass === true ? `passed${r.why ? `: ${r.why}` : ''}` : r.pass === false ? `failed: ${r.why || 'no reason given'}` : r.why || 'ended')
    // The run as small squares, one per step of each round, grouped by round, as Claude's own view of a workflow draws its agents
    const squaresRow = (f: Flow, rounds: Round[], key: string, first = 1) => {
      const groups = squaresOf(f, rounds)
      if (!groups.length) groups.push(f.phases.length ? f.phases.map(() => 'waiting' as const) : ['waiting'])
      const said = groups.map((g, i) => `round ${first + i}: ${g.join(', ')}`).join('; ')
      return 'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={squaresSvg(groups, LINE)} alt={said} width={squaresWidth(groups)} height={LINE} isInteractive />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" gap={1} flexShrink={0}>
          {groups.map((g, i) => (
            <Box key={`${key}-${i}`} flexDirection="row">
              {g.map((one, j) => (
                <Text key={`${key}-${i}-${j}`} color={one === 'done' || one === 'waiting' ? undefined : SQUARE_COLOR[one]} dimColor={one === 'done' || one === 'waiting'}>
                  {SQUARE_GLYPH[one]}
                </Text>
              ))}
            </Box>
          ))}
        </Box>
      )
    }
    // Beside the squares, in a word or two: the step being run, or how the run ended
    const stateWord = (f: Flow, rounds: Round[]) => {
      const round = rounds.at(-1)
      if (f.status === 'working') {
        const one = round ? [...round.agents].reverse().find(agent => agent.status === 'working') : undefined
        return one ? doing(one.phase || stageOf(f) || 'Working') : round ? 'Between steps' : 'Starting'
      }
      if (f.status === 'stopped') return 'Stopped'
      if (f.status === 'failed') return 'Error'
      return round?.pass === true ? 'Passed' : round?.pass === false ? 'Not passed' : 'Ended'
    }
    // The small card, built as every other card is: its title, which opens its Details, with Stop at the far end of that row; where
    // it stands; the bar it is held to; then a row per round up to the cap, each led by its own squares, one per step, and saying
    // what came of it: the round at work has the moving dots and who is at work, a checked round what its check found, a round not
    // run yet that it runs only if needed. Once it ended, how it ended takes the place of the moving dots
    const flowModel = (f: Flow) => modelName(f.agents.find(one => one.model)?.model ?? f.phases.find(one => one.model)?.model ?? '')
    // As a card's facts line: every part, cut at its end on a narrow panel as a card's is
    const flowFacts = (f: Flow, rounds: Round[]) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const round = rounds.length && f.cap ? `round ${rounds.length} of ${f.cap}` : rounds.length ? `round ${rounds.length}` : ''
      return [stood[f.status], flowModel(f), agentsWord(f.agents.length), round, time].filter(Boolean).join(' · ')
    }
    // Who is at work in a round, in plain words: the rounds script's maker and checker by name, any other stage by its own
    const atWork = (f: Flow, r: Round) => {
      const one = [...r.agents].reverse().find(agent => agent.status === 'working')
      const phase = one?.phase || stageOf(f)
      if (!one) return 'between steps'
      if (phase === 'Make') return r.n === 1 ? 'Maker building it' : 'Maker fixing what the check found'
      if (phase === 'Check') return 'Checker testing it against the bar'
      return doing(phase || 'Working')
    }
    const flowDots = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={dots(FLOW, LINE)} alt="Being done now" width={22} height={LINE} isInteractive />
        </Box>
      ) : e.surface === 'terminal' ? (
        (termDots(table, $, paneId, key, FLOW) ?? <Text key={key} color={FLOW}>▸</Text>)
      ) : (
        <Text key={key} color={FLOW}>▸</Text>
      )
    const roundRow = (f: Flow, rounds: Round[], n: number, isPassed: boolean) => {
      const r = rounds[n - 1]
      const key = `flow-round-${f.id}-${n}`
      const label = (color: string | undefined, isDim = false) => (
        <Box key={`${key}-label`} flexShrink={0}>
          <Text color={color} dimColor={isDim}>{`Round ${n}`}</Text>
        </Box>
      )
      const row = (parts: unknown[]) => (
        <Box key={key} flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {squaresRow(f, r ? [r] : [], `${key}-squares`, n)}
          {parts as never}
        </Box>
      )
      if (!r && n === 1 && f.status === 'working') return row([label(FLOW), flowDots(`${key}-dots`), <Text key={`${key}-why`} color={FLOW} wrap="truncate-end">Starting</Text>])
      if (!r) return row([label(undefined, true), <Text key={`${key}-why`} dimColor wrap="truncate-end">{isPassed ? 'not needed' : f.status === 'working' ? 'if needed' : 'not run'}</Text>])
      if (r.isOpen)
        return row([
          label(FLOW),
          f.status === 'working' ? flowDots(`${key}-dots`) : null,
          <Box key={`${key}-what`} flexShrink={1} minWidth={0}>
            <Text color={FLOW} wrap="truncate-end">{atWork(f, r)}</Text>
          </Box>,
        ])
      const cutShort = r.pass === undefined && !r.why && r.agents.some(one => one.status !== 'done')
      const why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : cutShort ? (f.status === 'failed' ? 'stopped by an error' : 'stopped') : 'ended')).replace(/[.。]+$/, '')
      const found = r.pass === false && r.findings.length ? `${r.findings.length} found · ` : ''
      return row([
        label(r.pass ? DONE : undefined),
        <Box key={`${key}-why`} flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{r.pass ? `passed · ${why}` : `${found}${why}`}</Text>
        </Box>,
      ])
    }
    // Whether a run passed: its last round's verdict, else what the run itself returned
    const flowPassed = (f: Flow, rounds: Round[]) => {
      const pass = rounds.at(-1)?.pass
      if (pass !== undefined) return pass
      if (/"passed"\s*:\s*false|\bnot passed\b/i.test(f.result)) return false
      if (/"passed"\s*:\s*true|\bpassed\b/i.test(f.result)) return true
      return undefined
    }
    // How it ended, as its last line; a stopped run's facts line already says it was stopped
    const flowEnd = (f: Flow, rounds: Round[]) => {
      if (f.status !== 'done') return null
      const n = rounds.length
      const pass = flowPassed(f, rounds)
      const of = f.cap ? ` of ${f.cap}` : ''
      const said = pass === true ? `✓ Passed in round ${n}${of}` : pass === false ? `Not passed after ${n}${of} ${(f.cap ?? n) === 1 ? 'round' : 'rounds'}` : '✓ Finished'
      return (
        <Box key={`flow-end-${f.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          {pass === false ? <Text color="error">✕</Text> : null}
          <Text color={pass === false ? undefined : DONE} wrap="truncate-end">{said}</Text>
        </Box>
      )
    }
    const flowSmall = (f: Flow) => {
      const rounds = roundsOf(f)
      const count = Math.max(rounds.length, f.cap ?? 0)
      const isPassed = f.status === 'done' && flowPassed(f, rounds) === true
      const scope = `flow-${f.id}`
      return (
        <Box key={`flow-${f.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isFlowMoment(f) && !isAbovePrompt ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
          {/* Blue while it runs, green only when it finished and its last round did not fail */}
          {f.status === 'working' || (f.status === 'done' && flowPassed(f, rounds) !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`flow-open-${f.id}-${presses}`} plain hover={{ scope, underline: true }} onPress={() => openFlow($, f.id)}>
                    <Text bold wrap="truncate-end">{f.title}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {f.status === 'working' && f.session === flowMine ? (
                  <Box flexShrink={0}>
                    <Button key={`flow-stop-${f.id}`} label="Stop" plain dimColor hover={{ scope: `flow-stop-${f.id}`, underline: true }} onPress={() => void stopFlow($, f.id)} />
                  </Box>
                ) : null}
              </Box>
              <Box paddingLeft={lead}>
                <Text dimColor wrap="truncate-end">{flowFacts(f, rounds)}</Text>
              </Box>
            </Box>
            {f.bar ? (
              <Box flexDirection="row" gap={1} height={2} overflow="hidden" paddingLeft={lead}>
                <Box flexShrink={0}>
                  <Text dimColor>Bar ·</Text>
                </Box>
                <Box flexShrink={1} minWidth={0}>
                  <Text dimColor wrap="wrap">{cut(f.bar, Math.max(20, room - 12))}</Text>
                </Box>
              </Box>
            ) : null}
            <Box flexDirection="column" paddingLeft={lead}>
              {Array.from({ length: Math.max(1, count) }, (_, i) => roundRow(f, rounds, i + 1, isPassed))}
            </Box>
            {flowEnd(f, rounds)}
          </Box>
        </Box>
      )
    }

    // The work this Details tab is for, if it is one; a workflow's tab folds each of its agents' chats apart
    const flowOpen = flowShown ? pickedOf(flowShown) : undefined
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...all, ...elsewhere, ...helpersThere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
    // What is unfolded in this tab: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
    const open = folds.get(workId) ?? []
    const fold = (at: number) => {
      presses += 1
      const was = folds.get(workId) ?? []
      folds.set(workId, was.includes(at) ? was.filter(n => n !== at) : [...was, at])
      void update($, view, v => ({ ...v }))
    }

    // One part of the open card: a filled block of its own with a bold heading and, at its right, a dim count. The parts stand apart
    // on the pane's own ground, so where one ends and the next begins is seen at a glance
    const part = (key: string, name: string, side: string, body: JSX.Element) => (
      <Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" alignItems="flex-start" gap={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold dimColor wrap="wrap">{name}</Text>
          </Box>
          {side ? (
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="truncate-end">{side}</Text>
            </Box>
          ) : null}
        </Box>
        {body}
      </Box>
    )
    // One to-do: its mark beside the first line of its text
    // Under the to-do being done, where the work says it is, in the same column as the text. The one being done is the brightest
    // line of the part; the others are dim, so it stands out without a mark of its own
    const row = (key: string, mark: JSX.Element, item: Item, under = '') => (
      <Box key={key} flexDirection="row" alignItems="flex-start" gap={1}>
        {mark}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text wrap="wrap" dimColor={item.state !== 'doing'} strikethrough={item.state === 'dropped'}>
            {item.text}
          </Text>
          {under ? <Text wrap="wrap" dimColor>{under}</Text> : null}
        </Box>
      </Box>
    )
    const opener = (at: number, label: string) => (
      <Box key={`fold-${at}`} alignItems="flex-start">
        <Button key={`fold-${at}-${presses}`} label={`${open.includes(at) ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => fold(at)} />
      </Box>
    )

    // Where it started: the person's words in two rows, whole on a press
    const askPart = (one: Todo) => {
      const whole = quoted(one.words, 1200)
      const short = cut(whole, room)
      const isLong = short !== whole
      return part(
        'part-ask',
        'Started from',
        '',
        <Box flexDirection="column">
          <Text wrap="wrap" dimColor>{`“${isLong && !open.includes(OPEN_ASK) ? short : whole}”`}</Text>
          {isLong ? opener(OPEN_ASK, open.includes(OPEN_ASK) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The to-dos, every one in the order the work listed them: done ticked, the one being done bright with the dots and where the
    // work says it is under it, the rest dim, dropped struck through. Many done fold into one row that opens them. Orange is the
    // header's alone
    const todoPart = (one: Todo) => {
      const isWorking = one.status === 'working'
      const done = one.items.filter(item => item.state === 'done').length
      const kept = one.items.filter(item => item.state !== 'dropped').length
      const where = isWorking ? now(one) : ''
      const hasDoing = one.items.some(item => item.state === 'doing')
      const isFolded = done > DONE_FOLDED && !open.includes(OPEN_DONE)
      if (!one.items.length && !where) return null
      let isWhereSaid = false
      return part(
        'part-todos',
        'To-dos',
        kept ? `${done} of ${kept} done` : '',
        <Box flexDirection="column">
          {done > DONE_FOLDED ? opener(OPEN_DONE, isFolded ? `${done} done` : 'Fold the done') : null}
          {one.items.map((item, i) => {
            if (item.state === 'done' && isFolded) return null
            if (item.state === 'doing') {
              const under = !isWhereSaid && where ? cut(where, room) : ''
              isWhereSaid = true
              return row(`todo-${i}`, isWorking ? live(`live-doing-${i}`) : <Text dimColor>○</Text>, item, under)
            }
            const mark = item.state === 'done' ? <Text color="success" dimColor>✓</Text> : <Text dimColor>{item.state === 'dropped' ? '✕' : '○'}</Text>
            return row(`todo-${i}`, mark, item)
          })}
          {!hasDoing && where ? (
            <Box key="where" flexDirection="row" alignItems="flex-start" gap={1}>
              {live('live-where')}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="wrap">{cut(where, room)}</Text>
              </Box>
            </Box>
          ) : null}
        </Box>,
      )
    }
    // In Details: what the work has running, then every helper it started, and theirs, at work or ended, each with what it has
    // running under it, as the same tree as on its card, every job shown; each helper opens its own Details, which shows its own
    // Under a helper at work, the step it is on and where it says it is; under a job, the last lines its output ends with, as a
    // terminal shows them. Both sit where the row's name starts; one that ended has nothing under it
    const underTwig = (t: Twig) => {
      const pad = t.depth * 2 + 4
      if (t.job) {
        // the line its row already says is not said again
        const tail = t.job.id.startsWith('more-') ? [] : (t.job.tail ?? []).filter(line => line.trim() !== (t.job?.latest ?? '').trim()).slice(-OUTPUT_LINES)
        if (!tail.length) return null
        return (
          <Box key={`tail-${t.job.id}`} flexDirection="row" paddingLeft={pad} flexShrink={0}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={OUTPUT_FILL}>
              {tail.map((line, n) => (
                <Text key={`tail-${t.job?.id}-${n}`} dimColor wrap="truncate-end">
                  {line}
                </Text>
              ))}
            </Box>
          </Box>
        )
      }
      const kid = t.one
      if (!kid || kid.status !== 'working') return null
      const kept = kid.items.filter(item => item.state !== 'dropped')
      const doing = kept.findIndex(item => item.state === 'doing')
      const lines = [doing >= 0 ? `Step ${doing + 1} of ${kept.length} · ${kept[doing]?.text ?? ''}` : '', now(kid)].filter(Boolean)
      if (!lines.length) return null
      return (
        <Box key={`under-${kid.id}`} flexDirection="column" paddingLeft={pad} flexShrink={0}>
          {lines.map((line, n) => (
            <Text key={`under-${kid.id}-${n}`} dimColor wrap="truncate-end">
              {line}
            </Text>
          ))}
        </Box>
      )
    }
    const helpersPart = (one: Todo) => {
      // Another chat's work has its helpers from that chat's file
      const list = one.chat ? helpersThere : all
      const under = underOf(list, one.id)
      const branches = [...jobBranches(one, true), ...withJobs(branchesOf(list, one.id, () => true), true)]
      const jobs = [one, ...under].reduce((n, kid) => n + jobsOf(kid, at).reduce((sum, job) => sum + (job.count ?? 1), 0), 0)
      if (!under.length && !jobs) return null
      const running = under.filter(kid => kid.status === 'working').length
      // Beside the jobs, the helpers are named, so neither count reads as the other's
      const helpers = !jobs ? (running ? `${running} at work · ${under.length} in all` : `${under.length} in all`) : running === under.length ? `${running} ${running === 1 ? 'helper' : 'helpers'} at work` : running ? `${running} of ${under.length} helpers at work` : `${under.length} ${under.length === 1 ? 'helper' : 'helpers'}`
      const side = [jobs ? `${jobs} ${jobs === 1 ? 'job' : 'jobs'} running` : '', under.length ? helpers : ''].filter(Boolean).join(' · ')
      return part(
        'part-helpers',
        !jobs ? 'Helpers' : under.length ? 'Helpers and jobs' : 'Running',
        side,
        <Box flexDirection="column">{twigsOf(branches).flatMap(t => [t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)])}</Box>,
      )
    }
    // In Details, under what runs: every run that has ended, the newest first, each with how it ended in plain words, how long it
    // ran and when it ended; one that failed, was killed or ran out of time in amber
    const endedRunsPart = (one: Todo) => {
      const runs = endedRunsOf(one, one.chat ? helpersThere : all).reverse()
      if (!runs.length) return null
      const isBad = (run: (typeof runs)[number]) => run.how === 'failed' || run.how === 'killed' || run.how === 'timed out'
      const bad = runs.filter(isBad).length
      return part(
        'part-ended-runs',
        'Runs ended',
        `${runs.length} ${runs.length === 1 ? 'run' : 'runs'}${bad ? ` · ${bad} did not finish` : ''}`,
        <Box flexDirection="column">
          {runs.map(run => (
            <Box key={`ended-${run.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{describedOf(run.what).text || run.what || 'A run'}</Text>
              </Box>
              <Box flexShrink={0}>
                <Text dimColor={!isBad(run)} color={isBad(run) ? NEEDS : undefined}>{`${endedWord(run)} after ${took(run.endedAt - run.at)} · ${shortAgo(at - run.endedAt)} ago`}</Text>
              </Box>
            </Box>
          ))}
        </Box>,
      )
    }

    // The work's own chat, drawn as the app draws a chat, the oldest first: what it was told in a filled block, what it wrote as
    // text, and each run of tool steps folded into one quiet row that opens on a press. A long message to it is folded too
    const talk = (one: Todo, lines: Line[] | undefined, shots: Map<number, Pic[]>) => {
      // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
      // a row under it that opens it whole in a window of its own, large enough to look at; one that is gone is named
      const drawing = uiOf($, e)
      const picturesOfRun = (block: Line[], at: number) => {
        const made = block.flatMap(line => shots.get(line.at ?? -1) ?? [])
        if (!made.length) return null
        return (
          <Box key={`pics-${at}`} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map((pic, n) => (
              <Box key={`pic-${at}-${n}`} flexDirection="column" alignItems="flex-start" width="100%">
                {pic.thumb && e.surface !== 'terminal' && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`pic-svg-${at}-${n}`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}
                  />
                ) : null}
                {pic.isGone ? (
                  <Text dimColor wrap="wrap">{`Picture: ${pic.name} · no longer kept`}</Text>
                ) : (
                  <Button
                    key={`pic-open-${at}-${n}-${presses}`}
                    label={`⤢ ${pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                    plain
                    onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, `pic-${at}-${n}`, press.surface))}
                  />
                )}
                {e.surface === 'terminal' && !pic.isGone ? pictureSaidRow($, drawing, `pic-said-${at}-${n}`, pic.path) : null}
              </Box>
            ))}
          </Box>
        )
      }
      // Each line knows how many tool steps came before it: that names a run of steps whatever is drawn above it
      let uses = 0
      const shown = newest((lines ?? []).map(line => ({ ...line, at: line.isUse ? (uses += 1) : uses })))
      const blocks = shown.reduce<Line[][]>((all, line) => {
        const last = all.at(-1)
        return line.kind === 'step' && last?.[0]?.kind === 'step' ? [...all.slice(0, -1), [...last, line]] : [...all, [line]]
      }, [])
      return (
        <Box flexDirection="column" gap={1}>
          {lines ? null : <Text dimColor>The app has not kept the chat of this work.</Text>}
          {blocks.map((block, i) => {
            const first = block[0]
            const at = first?.at ?? 0
            if (first?.kind === 'step') {
              const isOpen = open.includes(at)
              return (
                <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start">
                  <Button key={`run-${at}-${presses}`} label={`${isOpen ? '▾' : '▸'} ${folded(block)}`} plain dimColor onPress={() => fold(at)} />
                  {isOpen
                    ? listed(block).map((line, n) => (
                        <Box key={`step-${i}-${n}`} paddingLeft={2}>
                          <Text wrap="wrap" dimColor={!line.isError} color={line.isError ? 'error' : undefined}>
                            {line.isError ? `${line.text} (failed)` : line.text}
                          </Text>
                        </Box>
                      ))
                    : null}
                  {picturesOfRun(block, at)}
                </Box>
              )
            }
            if (first?.kind === 'said')
              return (
<Markdown key={`talk-${i}`} text={first.text} />
              )
            // A move to another model is one quiet line where it happened, with its time
            if (first?.kind === 'model')
              return (
                <Box key={`talk-${i}`}>
                  <Text dimColor wrap="wrap">{first.text}</Text>
                </Box>
              )
            const text = first?.text ?? ''
            const isLong = text.length > TOLD_CHARS * 2
            const isOpen = open.includes(-at - 1)
            // The long brief the work began with is one quiet row until pressed: "Started from" above already gives the person's words
            if (i === 0 && first?.kind === 'told' && isLong && !isOpen)
              return (
                <Box key={`talk-${i}`} alignItems="flex-start">
                  <Button key={`told-${at}-${presses}`} label="▸ The brief it was given" plain dimColor onPress={() => fold(-at - 1)} />
                </Box>
              )
            return (
              <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start" backgroundColor={FILL} paddingX={2} paddingY={1}>
                {first?.kind === 'steer' ? <Text dimColor>{first.isWaiting ? 'You · not yet answered' : 'You'}</Text> : null}
                <Markdown text={isLong && !isOpen ? cut(text, TOLD_CHARS) : text} />
                {isLong ? <Button key={`told-${at}-${presses}`} label={isOpen ? '▾ Show less' : '▸ Show all'} plain dimColor onPress={() => fold(-at - 1)} /> : null}
              </Box>
            )
          })}
          {!lines && one.answer ? (
<Markdown text={one.answer} />
          ) : null}
        </Box>
      )
    }

    // Another chat's work whose chat cannot be read here (a chat on another Mac, or one its file no longer holds): where it is. Its
    // head has the press that opens that chat
    const theirChat = (one: Todo, c: NonNullable<Todo['chat']>) => (
      <Text dimColor wrap="wrap">{`Its chat is kept by the chat "${chatName(c)}"${c.host ? ` on ${macName(c.host)}` : ''}, which runs it.${one.status === 'working' ? ' Stop it or move it to another model there.' : ''}`}</Text>
    )
    // The press on another chat's name that opens it, wherever the app can open that chat (a chat of the app on this Mac, or one Remote
    // Control serves)
    const openTheirs = (one: Todo, c: NonNullable<Todo['chat']>) => {
      const s = otherChats.find(other => other.chat === c.id && other.host === c.host)
      return s && pressOf(s) ? <Button key={`their-chat-${one.id}-${presses}`} label="Open that chat ↗" plain onPress={() => void ((presses += 1), openChat($, s))} /> : null
    }

    // What the work reported as it ended, the first of it, whole on a press
    const resultPart = (one: Todo) => {
      if (one.status === 'working' || !one.answer.trim()) return null
      const whole = one.answer.trim()
      const short = cut(whole, RESULT_SHOWN)
      const isLong = short !== whole
      return part(
        'part-result',
        'Result',
        '',
        <Box flexDirection="column">
          <Markdown text={isLong && !open.includes(OPEN_RESULT) ? short : whole} />
          {isLong ? opener(OPEN_RESULT, open.includes(OPEN_RESULT) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      const parent = one.parentId ? [...all, ...elsewhere, ...helpersThere].find(card => card.id === one.parentId) : undefined
      return (
        <Box key={`todo-${one.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {one.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={LIVE} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{titleOf(one)}</Text>
                {facts(one, true)}
              </Box>
              {parent ? (
                <Box flexDirection="row" alignItems="flex-start">
                  <Button key={`open-parent-${one.id}-${presses}`} label={`↑ A helper of: ${cut(titleOf(parent), Math.max(20, room - 16))}`} plain dimColor hover={{ scope: `parent-${one.id}`, underline: true }} onPress={() => openWork($, parent.id)} />
                </Box>
              ) : null}
              {one.chat ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1}>
                  <Text dimColor wrap="wrap">{`From the chat "${chatName(one.chat)}"${chatSide(one.chat, selfName()) ? `, ${chatSide(one.chat, selfName())}` : ''}`}</Text>
                  {openTheirs(one, one.chat)}
                </Box>
              ) : null}
              {(one.status === 'working' && !one.chat) || left(one) || (one.status === 'stopped' && one.byYou && !one.chat) ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
                  {/* Work the person stopped stays stopped until they start it again from here or ask in a message */}
                  {one.status === 'stopped' && one.byYou && !one.chat ? <Button key={`again-${one.id}-${presses}`} label="Start again" onPress={() => ((presses += 1), void startAgain($, one.id))} /> : null}
                  {left(one) ? <Button key={`artifact-${one.id}-${presses}`} label="Its result" onPress={() => void openReport($, left(one)?.id ?? '')} /> : null}
                </Box>
              ) : null}
            </Box>
          </Box>
          {one.admins?.length || cardNotesOf(one.id, at).length ? (
            <Box key="part-gates" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {adminBlock($, table, one, `gates-big-${one.id}`, at)}
              </Box>
            </Box>
          ) : null}
          {one.ask ? (
            <Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>{needsPerson(one) ? 'Needs you now' : 'Acting on your reply'}</Text>
                {askBlock(one, `ask-big-${one.id}`, true)}
              </Box>
            </Box>
          ) : sentLine(one, at) ? (
            <Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>
          ) : null}
          {resultPart(one)}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {endedRunsPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
            ? part('part-chat', 'Its chat', '', theirChat(one, one.chat))
            : part('part-chat', 'Its chat', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>
      )
    }

    // The app's own prompt open in a chat, amber at the top of that chat's cards, in plain words: which work asks, what it asks, exactly
    // what (the command, the message), what a yes and a no each do, and Yes and No that answer it while its chat holds it. Not held
    // (a question, a plan, a chat of an older version), it says where to answer it, and a chat of the Claude app on this Mac opens at a
    // press. Another chat's prompt has no Yes or No here: it is answered in that chat, and a press on Open that chat takes the person there
    const promptButtons = (p: Prompt, key: string) => {
      const press = (said: 'yes' | 'no') => () => void (answerPrompt($, p.id, said), redraw($))
      return (
        <Box key={`prompt-buttons-${key}`} flexDirection="row" gap={1}>
          <Button key={`prompt-yes-${key}-${presses}`} label="Yes" onPress={press('yes')} />
          <Button key={`prompt-no-${key}-${presses}`} label="No" onPress={press('no')} />
        </Box>
      )
    }
    // Only this chat's own prompt, while this chat holds it: another chat's is answered in that chat, as no file may answer one
    const isHeldHere = (p: Prompt, c?: Shared) => Boolean(!c && p.isHeld && promptHeld.has(p.id))
    // Drawn as Claude Code draws its permission asks, as the admin gate's are: an outlined box with the kind of ask at its top, never
    // a filled card with an edge as work's cards are
    const promptCard = (p: Prompt, key: string, where: string, c?: Shared) => (
      <Box key={`prompt-${key}`} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
        <Box flexDirection="column">
          <Text dimColor wrap="truncate-end">{`${p.kind === 'question' ? 'Question' : p.kind === 'plan' ? 'Plan' : 'Permission'} · ${isHeldHere(p, c) || !c ? 'waits for your answer' : 'asked in another chat'}`}</Text>
          <Text bold wrap="truncate-end">{p.title || (c ? 'That chat itself' : 'This chat itself')}</Text>
          {/* At the top, away from its chat's name: which chat it is */}
          {c ? <Text key={`prompt-${key}-chat`} dimColor wrap="truncate-end">{`In the chat “${chatName(c)}”${c.host ? ` on ${macName(c.host)}` : ''}`}</Text> : null}
          <Text dimColor wrap="wrap">{p.kind === 'question' ? 'Asks you a question' : p.kind === 'plan' ? 'Asks you to approve its plan' : 'Asks your permission'}</Text>
        </Box>
        <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
        {p.detail ? (
          <Box backgroundColor={FILL} paddingLeft={2} paddingRight={1}>
            <Text mono wrap="wrap">{p.detail}</Text>
          </Box>
        ) : null}
        {p.yes || p.no ? (
          <Box flexDirection="column">
            {p.yes ? <Text wrap="wrap">{p.yes}</Text> : null}
            {p.no ? <Text wrap="wrap">{p.no}</Text> : null}
          </Box>
        ) : null}
        {isHeldHere(p, c) ? promptButtons(p, key) : <Text dimColor wrap="wrap">{where}</Text>}
        {c && pressOf(c) && !isHeldHere(p, c) ? (
          <Box flexDirection="row">
            <Button key={`prompt-open-${key}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`)))} />
          </Box>
        ) : null}
      </Box>
    )
    // Where a prompt is answered: in this chat, the box Claude Code shows at its bottom
    const answerHere = (p: Prompt) => (p.kind === 'question' ? 'Pick your answer in the box at the bottom of this chat.' : 'Answer Yes or No in the box at the bottom of this chat.')
    // The same prompt once answered, for a minute after its call ends: what the person said and what is happening now, in the colour
    // of what came of it (purple while it runs, grey once over)
    const saidOf = (p: Prompt) => {
      if (p.answered === 'stopped') return 'It ended before you answered · nothing happened'
      if (p.answered === 'no') return p.kind === 'question' ? 'You skipped it · no answer went back, and it waits for you' : p.kind === 'plan' ? 'You said no · it keeps planning' : p.title ? 'You said no · it did not happen, and the work was told' : 'You said no · it did not happen, and it waits for what you say next'
      if (p.kind === 'question') return p.isRunning ? 'You answered · it is taking your answer' : 'You answered · it carries on with your answer'
      if (p.kind === 'plan') return 'You approved the plan · it is carrying it out'
      if (p.isCut) return 'You allowed it · it was stopped before it finished'
      return p.isRunning ? 'You allowed it · it is running now' : `You allowed it · ${p.done ?? 'it ran and is done'}`
    }
    // Once answered it is a line of what was done, as the gate's notes are: no box, fill or edge
    const answeredCard = (p: Prompt, key: string, c?: Shared) =>
      reportLine(table, `answered-${key}`, p.answered !== 'no' && p.answered !== 'stopped' && !p.isCut, saidOf(p), [p.title || (c ? 'That chat itself' : 'This chat itself'), p.text])

    // The name of a chat above its cards, with its folder and the Mac it runs on when another. Another chat's name opens that chat in
    // the Claude app when pressed, where its link opens here
    const chatHead = (key: string, name: string, side: string, c?: Shared) => {
      const url = c ? pressOf(c) : ''
      const label = <Text bold dimColor wrap="truncate-end">{name}</Text>
      return (
        <Box key={`chat-head-${key}`} flexDirection="column" paddingTop={1} flexShrink={0}>
          {/* One line whatever the name's length: cut short, never wrapped */}
          <Box flexDirection="row" alignItems="flex-start" gap={2} paddingX={2} height={1} overflow="hidden">
            <Box flexGrow={1} flexShrink={1} minWidth={0} height={1} overflow="hidden">
              {c && url ? (
                <Button key={`chat-open-${key}`} plain hover={{ underline: true }} onPress={() => void openChat($, c)}>
                  {label}
                </Button>
              ) : (
                <Box flexShrink={1} minWidth={0} paddingLeft={lead}>{label}</Box>
              )}
            </Box>
            {side ? (
              <Box flexShrink={0}>
                <Text dimColor wrap="truncate-end">{side}</Text>
              </Box>
            ) : null}
          </Box>
        </Box>
      )
    }

    // The newest result a piece of work left, which its open card links to
    const left = (one: Todo) => kept.filter(r => r.agent === one.id).sort((a, b) => b.at - a.at)[0]

    // Work that has ended, under the running cards: one folded row (work that still asks, or still runs something, stays above), so nothing above it moves. Unfolded, the newest first, each a
    // steady row of two lines (what it was, how it ended, its model, how long it took, when) that opens its card as for running work
    // Other chats' ended work folds in here too, once its pause is over; the row then says it holds every chat's
    // Work shown finished only because it left its chat's file is not kept there: its chat said nothing of how it ended
    const endedElsewhere = elsewhere.filter(one => one.status !== 'working' && !one.ask && !lingers(one, at) && !isVanished(one.id))
    // Each other chat's cards under its name: running, asking, or in the pause after ending. A chat with none of these and no prompt
    // is not listed at all, however many are open: the app's own list of chats has them
    const shownOf = (c: Shared) => elsewhere.filter(one => one.chat?.id === c.chat && one.chat.host === c.host && (one.status === 'working' || one.ask || lingers(one, at)))
    const listedChats = otherChats.filter(c => shownOf(c).length || c.prompts?.length || answeredOf(c.answeredPrompts).length)
    const finished = [...own.filter(one => one.status !== 'working' && !isLingering(one, at) && !one.ask), ...endedElsewhere].sort((a, b) => b.endedAt - a.endedAt)
    const finishedPart = (isOpen: boolean) =>
      finished.length || endedFlows.length ? (
        <Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button
                key={`finished-fold-${presses}`}
                label={`${isOpen ? '▾' : '▸'} Finished ${finished.length + endedFlows.length}`}
                plain
                hotkey={keyed ? 'f' : undefined}
                onPress={() => void ((presses += 1), update($, view, v => ({ ...v, isFinishedOpen: !v.isFinishedOpen })))}
              />
            </Box>
            <Text dimColor>{endedElsewhere.length ? 'all chats' : 'this chat'}</Text>
          </Box>
          {isOpen
            ? [...finished.map(one => ({ at: one.endedAt, card: () => small(one) })), ...endedFlows.map(f => ({ at: f.endedAt, card: () => flowSmall(f) }))].sort((a, b) => b.at - a.at).map(one => one.card())
            : null}
        </Box>
      ) : null

    // A workflow's Details tab: what it is, with Stop; where it started; its stages in order; its rounds, each with its agents and
    // its outcome; one agent's chat at a time, picked from the rounds; and what it returned once it ended
    const flowBig = (f: Flow, picked: FlowAgent | undefined, lines: Line[] | undefined) => {
      const rounds = roundsOf(f)
      const current = stageOf(f)
      const agentRow = (one: FlowAgent) => {
        const isPicked = picked?.id === one.id
        const facts = [modelName(one.model ?? ''), one.tokens ? `context ${thousands(one.tokens)}` : '', one.status === 'working' ? (f.status === 'working' ? 'at work' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ')
        return (
          <Box key={`flow-agent-${one.id}`} flexDirection="row" alignItems="flex-start" gap={1} paddingLeft={2}>
            <Button
              key={`flow-pick-${one.id}-${presses}`}
              label={`${isPicked ? '▾' : '▸'} ${one.label || one.phase || 'agent'}`}
              plain
              dimColor={!isPicked}
              onPress={() => ((presses += 1), flowPicked.set(f.id, one.id), void update($, view, v => ({ ...v })))}
            />
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="wrap">{facts}</Text>
            </Box>
          </Box>
        )
      }
      return (
        <Box key={`flow-${f.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {f.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={FLOW} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{f.title}</Text>
                <Text dimColor wrap="wrap">{flowGlance(f)}</Text>
              </Box>
              <Box flexDirection="column">
                <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                  {squaresRow(f, rounds, `flow-big-squares-${f.id}`)}
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {stateWord(f, rounds)}
                  </Text>
                </Box>
              </Box>
              {f.status === 'working' && f.session === flowMine ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  <Button key={`flow-stop-${f.id}`} label="Stop" onPress={() => void stopFlow($, f.id)} />
                </Box>
              ) : null}
            </Box>
          </Box>
          {f.words || f.task ? askPart({ ...started(f.id, '', f.title, f.words || f.task, f.startedAt) }) : null}
          {part(
            'part-stages',
            'Stages',
            f.name,
            <Box flexDirection="column" gap={1}>
              {f.phases.map((p, i) => {
                const ran = f.agents.filter(one => one.phase === p.title)
                const isNow = p.title === current
                return (
                  <Box key={`flow-phase-${i}`} flexDirection="row" alignItems="flex-start" gap={1}>
                    {isNow ? <Text color={FLOW}>■</Text> : <Text dimColor>{ran.length ? '✓' : '○'}</Text>}
                    <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={isNow ? FLOW : undefined} bold={isNow} dimColor={!isNow}>
                        {p.title}
                      </Text>
                      <Text wrap="wrap" dimColor>
                        {[p.detail, modelName(p.model ?? ''), ran.length ? `${ran.length} ${ran.length === 1 ? 'agent' : 'agents'}` : ''].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                  </Box>
                )
              })}
            </Box>,
          )}
          {part(
            'part-rounds',
            'Rounds',
            roundsLabel(f, rounds),
            <Box flexDirection="column" gap={1}>
              {rounds.length ? null : <Text dimColor>{f.status === 'working' ? 'The first round is starting.' : 'No agent ran.'}</Text>}
              {rounds.map(r => (
                <Box key={`flow-round-${r.n}`} flexDirection="column">
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {squaresRow(f, [r], `flow-round-squares-${r.n}`, r.n)}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={r.isOpen ? FLOW : undefined} bold={r.isOpen} dimColor={!r.isOpen}>{`Round ${r.n}: ${verdict(r)}`}</Text>
                    </Box>
                  </Box>
                  {r.agents.map(agentRow)}
                  {r.findings.length && r.pass === false ? (
                    <Box flexDirection="column" paddingLeft={4}>
                      {r.findings.map((one, i) => (
                        <Text key={`flow-finding-${r.n}-${i}`} wrap="wrap" dimColor>{`– ${one}`}</Text>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ))}
            </Box>,
          )}
          {picked
            ? part(
                'part-chat',
                `Chat of the ${picked.label || picked.phase || 'agent'}${rounds.length > 1 ? `, round ${rounds.find(r => r.agents.some(one => one.id === picked.id))?.n ?? ''}` : ''}`,
                modelName(picked.model ?? ''),
                talk({ ...started(picked.id, '', picked.label, '', picked.at), answer: picked.result ?? '' }, lines, new Map()),
              )
            : null}
          {f.status !== 'working' && f.result ? part('part-result', 'What it returned', '', <Markdown text={f.result} />) : null}
        </Box>
      )
    }
    if (paneId.startsWith(FLOW_PANE)) {
      if (!flowShown) return <Text dimColor>This workflow is no longer kept.</Text>
      const picked = pickedOf(flowShown)
      const lines = picked ? await flowTalkOf($, flowShown, picked).catch(() => undefined) : undefined
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>
      )
    }

    // A Details tab stays, even once its work has ended, until it is closed; work no longer kept says so
    const alone = [...all, ...elsewhere, ...helpersThere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    // Another chat's is read from that chat's own file, on this Mac
    if (alone) void (alone.chat ? loadTheirs($, alone) : loadWork($, alone.id)).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = uiOf($, e)
    // A terminal too narrow to dock the panel seats it above the prompt, a few rows tall
    const isInline = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    // Everything that waits on the person, every chat's, together at the top under the header and the newest first: the notices
    // (password and key boxes, gates, Claude Code's own prompts), then the cards of work that asked. Each stays until answered, and
    // then leaves the top; a card goes back to its own place among the rest, which keep their order
    const notices = [
      // A box that comes while the person types a reply in the terminal leaves the keys with that reply
      ...boxRows($, ui, e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk))),
      ...looseGates.map(gate => ({ at: gate.at, node: gateRow($, ui, gate, `gate-${gate.id}`, false) })),
      ...waiting.map(p => ({ at: p.at, node: promptCard(p, `this-${p.id}`, answerHere(p)) })),
      ...otherChats.flatMap(c => {
        const url = pressOf(c)
        return (c.prompts ?? []).map(p => ({ at: p.at, node: promptCard(p, `${c.host}-${c.chat}-${p.id}`, c.host && !url ? `Answer it in that chat, on ${macName(c.host)}` : c.host ? `Answer it in that chat, which runs on ${macName(c.host)}` : 'Answer it in that chat', c) }))
      }),
    ]
    // A work that waits on the person comes to the top whole, its ask or its gate in it as ever; once a gate is answered, what was
    // done shows in the card, outlined green, and the card stays at the top until that goes
    const isAsking = (one: Todo) => Boolean(one.ask) && !isActingOnReply(one)
    const isWaitingPress = (one: Todo) => one.status === 'working' && Boolean(one.admins?.length)
    // An ask answered on its card keeps the card where it was, its answer said in it, for ANSWER_SHOWN: a press or a reply never
    // takes the card from under the person's eyes, as a gate answered on its card does not
    const answeredSince = (one: Todo) => {
      return heldAnswer(one, at)?.at ?? 0
    }
    // An answered card keeps the place its ask had among what waits, so nothing still waiting slides into the spot just pressed
    const answeredPlace = (one: Todo) => (answeredSince(one) ? (sentReplies.get(one.id)?.askAt ?? answeredSince(one)) : 0)
    const isWaits = (one: Todo) => isAsking(one) || isWaitingPress(one) || answeredSince(one) > 0
    // Just finished: up at the top, right under what waits, the newest first, each for its own two seconds
    const isFinishing = (one: Todo) => !isWaits(one) && isFinishMoment(one)
    const finishFrom = (one: Todo) => (one.chat ? (endSeen.get(`${one.id}:${one.endedAt}`) ?? one.endedAt) : pauseFrom(one))
    // Finished but left something running: after its moment it stays up, under what waits, with its Stop it, never back among the rest
    const isLeftUp = (one: Todo) => !one.chat && one.status !== 'working' && Boolean(one.leftSince) && !isWaits(one) && !isFinishing(one)
    const isUp = (one: Todo) => isWaits(one) || isFinishing(one) || isLeftUp(one) || (!one.chat && cardNotesOf(one.id, at).length > 0)
    const upSince = (one: Todo) => Math.max(isAsking(one) ? (one.ask?.at ?? 0) : 0, ...(isWaitingPress(one) ? one.admins ?? [] : []).map(gate => gate.at), ...(one.chat ? [] : cardNotesOf(one.id, at).map(note => note.at)), answeredPlace(one))
    const askingHere = shownWork.filter(isUp)
    const askingThere = listedChats.flatMap(c => shownOf(c).filter(isUp))
    const askCards = [...askingHere, ...askingThere].sort((a, b) => upSince(b) - upSince(a))
    const restHere = shownWork.filter(one => !isUp(one))
    const restFlows = shownFlows.filter(f => !isFlowMoment(f))
    // Each card keeps the place it began in: work started again (Release it on an ended ask) never moves to the end
    const begun = (one: Todo) => one.begunAt ?? one.startedAt
    // Notices and whole cards in one order, the newest first; a card that only says what was allowed comes under all that still
    // waits. A card is drawn when the panel is
    const finishingFlows = shownFlows.filter(isFlowMoment)
    const top = [
      ...notices.map(one => ({ at: one.at, draw: () => one.node })),
      ...askCards.map(one => ({ at: isWaits(one) ? upSince(one) : isFinishing(one) ? finishFrom(one) - 1e14 : Math.max(upSince(one), isLeftUp(one) ? one.endedAt : 0) - 1e15, draw: () => small(one) })),
      ...finishingFlows.map(f => ({ at: pauseFrom(f) - 1e14, draw: () => flowSmall(f) })),
    ].sort((a, b) => b.at - a.at)
    const waitsCount = notices.length + askCards.filter(one => isAsking(one) || isWaitingPress(one)).length
    // The terminal's keys stay with the ask they were on while it waits
    if (keysAsk && !askingHere.some(one => one.id === keysAsk && isAsking(one))) keysAsk = ''
    // The header says what every card under it says, every chat's: what needs the person, what runs here and in other chats, and
    // work that just finished (happy too for a workflow in its pause whose card turned green: it finished and its last round passed)
    const runningThere = elsewhere.filter(one => one.status === 'working' && !needsPerson(one))
    const head = {
      here: working.filter(one => !needsPerson(one)).length + runningFlows.length,
      there: runningThere.length,
      chats: new Set(runningThere.map(one => `${one.chat?.host}/${one.chat?.id}`)).size,
      // Each thing at the top counts once, as the line above the prompt counts them
      asks: waitsCount,
      isDone: isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(isFlowMoment),
    }
    const mood = headMood(head)
    // A letter for each header button, in the terminal alone, and only while the panel has no password box to type in: there the
    // letters are the person's words, never a press. An ask's reply box takes the keys itself (askFocused)
    const isKeyed = e.surface === 'terminal' && !boxes.length
    keyed = isKeyed
    const versions = alone ? { version: '', installed: '', isWaiting: false } : await versionsOf($)
    // Just moved to a newer version whose changes the person has not seen: one quiet line in the header, with What's new, until closed
    const screen = alone ? undefined : await updateScreen($, ui, versions.version, head.asks, e.surface)
    // A password or key box stays above it: the runner waits on it
    if (paneId === LIST && !alone) {
      // Where this surface's list stands, as the person or a press last moved it (each move draws it again)
      const was = listOffsets.get(e.surface) ?? 0
      listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset))
      const count = waitsCount
      const finishedNow = [...askCards.filter(isFinishing).map(titleOf), ...finishingFlows.map(f => f.title)]
      if (finishedNow.join('\n') !== finishedAtTop.join('\n')) ((finishedAtTop = finishedNow), drawAgain($))
      if (count !== waitsAtTop || (was > 0) !== ((listOffsets.get(e.surface) ?? 0) > 0)) ((waitsAtTop = count), drawAgain($))
    }
    const updated = alone || !versions.version ? undefined : await updatedPieces($, versions.version)
    // Where updating stands for this chat: a small box under the header's lines, its steps each a press
    const outCard = alone ? null : (await noticeCard($, ui, await noticeNow($, versions.version, versions.installed).catch(() => undefined), versions.version).catch(() => null)) ?? screen ?? null

    return (
      <Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
          // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
          // them, which wraps onto a second row in a narrow pane rather than cutting anything off
          <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                  panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, `Claudopus, updated to ${versions.version}`, $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, something needs you', happy: 'Claudopus, work finished', working: 'Claudopus at work', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                {/* Just moved to a newer version: "Claudopus updated" in blue, then the new version, for the moment */}
                {updated ? (
                  nameLine(ui, updated)
                ) : (
                  <Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                    <Box flexShrink={0}>
                      <Text bold>Claudopus</Text>
                    </Box>
                    {/* The Mac has a newer copy than this chat runs: said beside the version, with what to type to switch to it */}
                    {versions.version ? (
                      <Text key="head-version" dimColor wrap={versions.isWaiting ? 'wrap' : 'truncate-end'}>{`v${versions.version}${versions.isWaiting ? ` · v${versions.installed} ready, type /reload-plugins` : ''}`}</Text>
                    ) : null}
                  </Box>
                )}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? `This chat: ${fill(chat.tokens, chat.window)}` : 'This chat: just begun'}</Text>}
              </Box>
            </Box>
            {outCard}
            {/* Wrapped rows keep the same gap as the buttons beside each other; a terminal's gap would be a whole blank line, so it has none */}
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={e.surface === 'terminal' ? 0 : 1}>
              {reportsButton($, ui, kept, isKeyed)}
              {statsButton($, ui, isKeyed)}
              {memoryButton($, ui, isKeyed)}
              {configButton($, ui, isKeyed)}
              {aboutButton($, ui, isKeyed)}
              {isInline && !e.props.isFocused ? <Text key="head-keys-short" dimColor>ctrl+x Tab for keys</Text> : null}
            </Box>
            {/* The terminal reaches a pane from the keys only after ctrl+x Tab, which nothing else tells; once it holds them each
                button above answers its first letter */}
            {e.surface === 'terminal' && (e.props.isFocused || !isInline) ? (
              <Text key="head-keys" dimColor wrap="wrap">
                {!e.props.isFocused ? 'ctrl+x Tab for keys' : [...own, ...elsewhere].some(one => one.ask) ? 'What you type goes in the reply box · Tab leaves it for the keys shown · Esc: back to the chat' : 'Esc: back to the chat'}
              </Text>
            ) : null}
          </Box>
        ) : null}
        {!alone ? top.map(one => one.draw()) : null}
        {!alone ? doneNotesPart(ui, at) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown, in the order it began; what waits on the
              // person is above, at the top. Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (restHere.length || restFlows.length || promptsAnswered.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...promptsAnswered.map(p => answeredCard(p, `this-${p.id}`)),
              ...[...restHere.map(one => ({ at: begun(one), card: () => small(one) })), ...restFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, with what is left of it once its asks are at the top
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).filter(one => !isUp(one)).sort((a, b) => begun(a) - begun(b))
                const answered = answeredOf(c.answeredPrompts).map(p => answeredCard(p, `${c.host}-${c.chat}-${p.id}`, c))
                return cards.length || answered.length ? [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...answered, ...cards.map(one => small(one))] : []
              }),
            ]}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
    })()
    heldDrawings.set(heldKey, { shape, content, at: heldAt, fresh: freshness, drawing })
    drawnPanes.set(paneId, { shape, content, at: heldAt, side: sideSign() })
    return drawing
    } finally {
      if (paneId === LIST) listDrawing -= 1
    }
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}

