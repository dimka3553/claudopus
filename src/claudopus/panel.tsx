// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them

// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
const backToPanel = async ($: EngineInterface, id: string) => {
  await $.ui.close({ id }).catch(() => undefined)
  await $.ui.close({ id: LIST }).catch(() => undefined)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })
}
const panelHooks = (on: On) => {

  // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
  // tab of the mod's but the panel has a first row whose key, p, closes it and hands the keys back to the panel
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    const isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(start => id.startsWith(start))
    if (e.surface !== 'terminal' || !isTab) return next(e)
    const { Box, Button, Text } = uiOf($, e)
    const body = await next({ ...e, props: { ...e.props, scroll: { ...e.props.scroll, bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) } } } as typeof e)
    return (
      <Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Panel" plain hotkey="p" onPress={() => void backToPanel($, id).catch(err => log($, `not back to the panel: ${String(err)}`))} />
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
          <Text dimColor>{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x Tab for keys'}</Text>
        </Box>
        {body}
      </Box>
    )
  })

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    const { Box, Button, Markdown, Text } = uiOf($, e)
    // A picture pressed open large in this Details tab is drawn over it, with a row back above and below it
    const large = pictureIn.get(paneId)
    if (large) {
      const back = (key: string) => <Button key={`${key}-${presses}`} label="← Back to Details" plain onPress={() => ((presses += 1), pictureBack($, paneId))} />
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
      $.clock.after(LINGER + 20, () => void update($, tick, n => n + 1))
    }
    const { isFinishedOpen = false } = await read($, view)
    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
    const all = await read($, todos)
    const own = all.filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    const chat = await read($, me)
    const at = await $.clock.now()
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask || one.leftSince)
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of the chat always does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' }
    const glance = (one: Todo, count = '') =>
      [stood[one.status], modelName(one.model ?? ''), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
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
      const rest = [one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ')
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
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
      const lost = sentLine(one, at)
      return (
        <Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={NEEDS} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
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
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map((choice, n) => (
              <Button key={`${key}-choice-${n}-${presses}`} label={choice} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
            ))}
          </Box>
          {'Input' in table ? (
            <Box width="100%" flexDirection="column">
              <table.Input
                key={`${key}-reply-${replies.get(one.id) ?? 0}`}
                autoFocus={e.surface === 'terminal' && !askFocused ? ((askFocused = true), true) : undefined}
                placeholder="Or reply in your own words"
                value={drafts.get(one.id) ?? ''}
                submitLabel="send"
                onInput={value => void (drafts.set(one.id, value), holdTimes($))}
                onSubmit={value => void (drafts.delete(one.id), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
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
    const small = (one: Todo) => {
      // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
      cardNo += 1
      const digit = keyed && cardNo <= 9 ? String(cardNo) : undefined
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      const tree = treeUnder(one)
      const scope = `card-${one.id}`
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
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
            {/* Every part under the title starts at the title's own left edge (lead) */}
            {one.ask ? (
              <Box key={`ask-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {askBlock(one, `ask-${one.id}`)}
              </Box>
            ) : null}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (
              <Box key={`stuck-${one.id}`} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>
            ) : null}
            {/* Still at work, waiting for a command of its own it started in the background: which, and how long it has run */}
            {waitLine(one, at) ? (
              <Box key={`wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at)}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {lingers(one, at) || leftLine(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : undefined} dimColor={one.status !== 'done'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? 'Stopped by an error' : 'Stopped'}
                  </Text>
                ) : (
                  <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || Boolean(one.ask)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>
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
      if (one.status !== 'working' && one.status !== 'done') return <Box width={1} flexShrink={0} />
      if (one.ask || one.status === 'done' || !count || e.surface === 'terminal') return <Box width={1} flexShrink={0} backgroundColor={one.ask ? NEEDS : one.status === 'working' ? LIVE : DONE} />
      const shade = (n: number) => (n < done ? LIVE : n === done && isDoing ? `${LIVE}AD` : `${LIVE}5C`)
      return count > EDGE_PARTS ? (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column">
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE} /> : null}
          {count > done ? <Box key="left" flexGrow={count - done} backgroundColor={`${LIVE}5C`} /> : null}
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
      const busy = [runningLine(one, at), runningLine(one, at).replace(/^.* running · /, 'running · ')].find(text => text && width - text.length >= 12)
      const side = busy ? busy : [[model, one.tokens ? thousands(one.tokens) : '', time], [model, time], [time]].map(parts => parts.filter(Boolean).join(' · ')).find(text => width - text.length >= 12) ?? time
      return twigRowOf(t, `${scope}-${one.id}`, cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, () => openWork($, one.id), one.status)
    }
    // In a small card: the helpers at work now or just ended, and any that one of those runs under; the rest are one closing
    // row, laid out as the others, that says how many have ended and opens the card's Details, where every helper is listed
    const treeUnder = (one: Todo) => {
      const under = underOf(all, one.id)
      if (!under.length) return []
      const branches = branchesOf(all, one.id, kid => kid.status === 'working' || isLingering(kid, at))
      const twigs = twigsOf(branches, true)
      const rest = under.length - twigs.length
      if (!rest) return twigsOf(branches).map(t => twigRow(t, 'list'))
      const closing: Twig = { depth: 1, rails: [], isLast: true, hasKids: false }
      return [...twigs.map(t => twigRow(t, 'list')), twigRowOf(closing, `rest-${one.id}`, `${rest} ${rest === 1 ? 'helper' : 'helpers'} ended`, true, '', () => openWork($, one.id))]
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const flowTokens = (f: Flow) => f.agents.reduce((sum, one) => sum + (one.tokens ?? 0), 0)
    const boldRow = Math.max(20, Math.floor(perRow * 0.88))
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
    // The last round the checker has judged, in a few words: its verdict's mark, its number and what the checker found, or that it passed
    const outcomeRow = (f: Flow, rounds: Round[], most: number) => {
      const r = rounds.filter(one => !one.isOpen && (one.pass !== undefined || one.why)).at(-1)
      if (!r) return <Text dimColor>{fitWords(f.status === 'working' ? 'No round checked yet' : 'No round was checked', most)}</Text>
      // The round's number goes first when the row holds it; the squares above say which round it was when it does not
      const why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : 'ended')).replace(/[.。]+$/, '')
      const whole = `Round ${r.n}: ${why}`
      return (
        <Box flexDirection="row" gap={1}>
          <Text color={r.pass ? DONE : r.pass === false ? 'error' : undefined} dimColor={r.pass === undefined}>
            {r.pass ? '✓' : r.pass === false ? '✕' : '·'}
          </Text>
          <Text dimColor>{whole.length <= most - 2 ? whole : fitWords(why, most - 2)}</Text>
        </Box>
      )
    }

    // The small card, the height of every other card: its title and where it stands; the squares with the step being run beside
    // them, and the last round checked; Details, Stop and the round against the cap. Every line written to fit its row, never cut
    const flowSmall = (f: Flow) => {
      const rounds = roundsOf(f)
      const word = stateWord(f, rounds)
      const groups = squaresOf(f, rounds)
      const squaresLetters = Math.ceil(squaresWidth(groups.length ? groups : [['waiting']]) / 7.5) + 2
      return (
        <Box key={`flow-${f.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {/* Blue while it runs, green only when its last round passed */}
          {f.status === 'working' || (f.status === 'done' && rounds.at(-1)?.pass !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column" paddingLeft={lead}>
              <Box height={1} overflow="hidden">
                <Text bold>{fitWords(f.title, boldRow)}</Text>
              </Box>
              <Box height={1} overflow="hidden">
                <Text dimColor>{flowGlance(f, perRow)}</Text>
              </Box>
            </Box>
            <Box flexDirection="column" paddingLeft={lead}>
              <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                {squaresRow(f, rounds, `flow-squares-${f.id}`)}
                <Text color={f.status === 'working' ? FLOW : word === 'Passed' ? DONE : undefined} dimColor={f.status !== 'working' && word !== 'Passed'}>
                  {fitWords(word, Math.max(6, perRow - squaresLetters))}
                </Text>
              </Box>
              <Box height={1} overflow="hidden">
                {outcomeRow(f, rounds, perRow)}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={1} paddingLeft={lead}>
              <Button key={`flow-open-${f.id}-${presses}`} label="Details" onPress={() => openFlow($, f.id)} />
              {f.status === 'working' && f.session === flowMine ? <Button key={`flow-stop-${f.id}`} label="Stop" onPress={() => void stopFlow($, f.id)} /> : null}
              <Box flexGrow={1} />
              {roundsLabel(f, rounds) ? (
                <Box flexShrink={0}>
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {roundsLabel(f, rounds)}
                  </Text>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      )
    }

    // The work this Details tab is for, if it is one; a workflow's tab folds each of its agents' chats apart
    const flowOpen = flowShown ? pickedOf(flowShown) : undefined
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...all, ...elsewhere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
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
            <Box flexShrink={0}>
              <Text dimColor>{side}</Text>
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

    // The to-dos: the one being done first, bright, with the dots and where the work says it is; the next few under it, dim; what
    // is done or dropped folded into one quiet count. Orange is the header's alone
    const todoPart = (one: Todo) => {
      const isWorking = one.status === 'working'
      const doing = one.items.filter(item => item.state === 'doing')
      const waiting = one.items.filter(item => item.state === 'open')
      const done = one.items.filter(item => item.state === 'done')
      const dropped = one.items.filter(item => item.state === 'dropped')
      const kept = one.items.length - dropped.length
      const where = isWorking ? now(one) : ''
      const shownNext = open.includes(OPEN_NEXT) ? waiting : waiting.slice(0, NEXT_SHOWN)
      const settled = [done.length ? `${done.length} done` : '', dropped.length ? `${dropped.length} dropped` : ''].filter(Boolean).join(' · ')
      if (!one.items.length && !where) return null
      return part(
        'part-todos',
        'To-dos',
        kept ? `${done.length} of ${kept} done` : '',
        <Box flexDirection="column" gap={1}>
          {doing.length || where ? (
            <Box key="doing" flexDirection="column">
              <Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
                {doing.length ? (
                  doing.map((item, i) => row(`doing-${i}`, isWorking ? live(`live-doing-${i}`) : <Text dimColor>○</Text>, item, i === 0 && where ? cut(where, room) : ''))
                ) : (
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {live('live-where')}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap">{cut(where, room)}</Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}
          {waiting.length ? (
            <Box key="next" flexDirection="column">
              <Text dimColor>Next</Text>
              {shownNext.map((item, i) => row(`next-${i}`, <Text dimColor>○</Text>, item))}
              {waiting.length > NEXT_SHOWN ? opener(OPEN_NEXT, open.includes(OPEN_NEXT) ? 'Fewer' : `${waiting.length - NEXT_SHOWN} more`) : null}
            </Box>
          ) : null}
          {settled ? (
            <Box key="settled" flexDirection="column">
              {opener(OPEN_DONE, settled)}
              {open.includes(OPEN_DONE)
                ? [...done, ...dropped].map((item, i) =>
                    row(`settled-${i}`, <Text color={item.state === 'done' ? 'success' : undefined} dimColor>{item.state === 'done' ? '✓' : '✕'}</Text>, item),
                  )
                : null}
            </Box>
          ) : null}
        </Box>,
      )
    }

    // In Details: every helper the work started, and theirs, at work or ended, as the same tree; each opens its own Details
    const helpersPart = (one: Todo) => {
      const under = underOf(all, one.id)
      if (!under.length) return null
      const running = under.filter(kid => kid.status === 'working').length
      return part(
        'part-helpers',
        'Helpers',
        running ? `${running} at work · ${under.length} in all` : `${under.length} in all`,
        <Box flexDirection="column">{twigsOf(branchesOf(all, one.id, () => true)).map(t => twigRow(t, 'details'))}</Box>,
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

    // Another chat's work: its own chat is in that chat's panel, which one press opens wherever the app can open that chat (a chat of
    // the app on this Mac, or one Remote Control serves); elsewhere it says where to go. Nothing of that chat is read from here
    const theirChat = (one: Todo, c: NonNullable<Todo['chat']>) => {
      const id = one.id
      const s = otherChats.find(one => one.chat === c.id && one.host === c.host)
      const canOpen = Boolean(s && pressOf(s))
      return (
        <Box flexDirection="column" gap={1}>
          <Text dimColor wrap="wrap">{`Its chat is shown in the panel of the chat "${chatName(c)}"${c.host ? ` on ${macName(c.host)}` : ''}, which runs it.${one.status === 'working' ? ' Stop it or move it to another model there.' : ''}`}</Text>
          {s && canOpen ? (
            <Box flexDirection="row">
              <Button key={`their-chat-${id}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, s))} />
            </Box>
          ) : null}
        </Box>
      )
    }

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      const parent = one.parentId ? all.find(card => card.id === one.parentId) : undefined
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
              {one.chat ? <Text dimColor wrap="wrap">{`From the chat "${chatName(one.chat)}"${chatSide(one.chat, selfName()) ? `, ${chatSide(one.chat, selfName())}` : ''}`}</Text> : null}
              {(one.status === 'working' && !one.chat) || left(one) ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
                  {left(one) ? <Button key={`artifact-${one.id}-${presses}`} label="Its result" onPress={() => void openReport($, left(one)?.id ?? '')} /> : null}
                </Box>
              ) : null}
            </Box>
          </Box>
          {one.ask ? (
            <Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {askBlock(one, `ask-big-${one.id}`, true)}
              </Box>
            </Box>
          ) : sentLine(one, at) ? (
            <Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>
          ) : null}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {one.chat
            ? part('part-chat', 'Its chat', '', theirChat(one, one.chat))
            : part('part-chat', 'Its chat', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>
      )
    }

    // The app's own prompt open in a chat, amber at the top of that chat's cards: what it asks in its own few words, the work it came
    // from, and where to answer it. A chat of the Claude app on this Mac opens at a press; the panel answers no prompt itself
    const promptCard = (p: Prompt, key: string, where: string, c?: Shared) => (
      <Box key={`prompt-${key}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
        <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
        <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
          <Box flexDirection="column">
            <Text bold wrap="truncate-end">{p.title || 'Needs your input'}</Text>
            <Text dimColor wrap="truncate-end">{where}</Text>
          </Box>
          <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
          {c ? (
            <Box flexDirection="row">
              <Button key={`prompt-open-${key}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`)))} />
            </Box>
          ) : null}
        </Box>
      </Box>
    )

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
    const listedChats = otherChats.filter(c => shownOf(c).length || c.prompts?.length)
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
    const alone = [...all, ...elsewhere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    if (alone && !alone.chat) void loadWork($, alone.id).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = uiOf($, e)
    // A terminal too narrow to dock the panel seats it above the prompt, a few rows tall
    const isInline = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    // The header says what every card under it says, every chat's: what needs the person, what runs here and in other chats, and
    // work that just finished (happy too for a workflow in its pause whose card turned green: it finished and its last round passed)
    const runningThere = elsewhere.filter(one => one.status === 'working' && !one.ask)
    const head = {
      here: working.filter(one => !one.ask).length + runningFlows.length,
      there: runningThere.length,
      chats: new Set(runningThere.map(one => `${one.chat?.host}/${one.chat?.id}`)).size,
      asks: boxes.length + own.filter(one => one.ask).length + waiting.length + elsewhere.filter(one => one.ask).length + listedChats.reduce((n, c) => n + (c.prompts?.length ?? 0), 0),
      isDone: isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(f => f.status === 'done' && isLingering(f, at) && roundsOf(f).at(-1)?.pass !== false),
    }
    const mood = headMood(head)
    // A letter for each header button, in the terminal alone, and only while the panel has no password box to type in: there the
    // letters are the person's words, never a press. An ask's reply box takes the keys itself (askFocused)
    const isKeyed = e.surface === 'terminal' && !boxes.length
    keyed = isKeyed
    const versions = alone ? { version: '', installed: '', isWaiting: false } : await versionsOf($)
    // A newer version whose changes the person has not seen: its screen covers the whole panel until it is closed, in place of the header's moment
    const screen = alone ? undefined : await updateScreen($, ui, versions.version, head.asks, e.surface)
    // A password or key box stays above it: the runner waits on it
    if (screen) return <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>{boxesPart($, ui)}{screen}</Box>
    const updated = alone || !versions.version ? undefined : await updatedPieces($, versions.version)

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
                    {versions.version ? <Text key="head-version" dimColor wrap="truncate-end">{`v${versions.version}${versions.isWaiting ? ` · v${versions.installed} installed${isRunFromAfar || isReloadRefused ? ', type /reload-plugins' : ''}` : ''}`}</Text> : null}
                  </Box>
                )}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? `This chat: ${fill(chat.tokens, chat.window)}` : 'This chat: just begun'}</Text>}
              </Box>
            </Box>
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={0}>
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
        {!alone ? boxesPart($, ui) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown; work that needs the person's hands comes first
              // Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (shownWork.length || shownFlows.length || waiting.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...waiting.map(p => promptCard(p, `this-${p.id}`, 'Answer it in this chat')),
              ...[...shownWork.map(one => ({ at: one.ask ? -1e15 + one.ask.at : one.startedAt, card: () => small(one) })), ...shownFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, those that wait on the person first
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).sort((a, b) => (a.ask ? -1e15 + a.ask.at : a.startedAt) - (b.ask ? -1e15 + b.ask.at : b.startedAt))
                // Open that chat whenever its link opens here: a chat of this Mac, or one of another Mac with Remote Control on
                // In a chat another Mac's app runs here, that Mac opens it
                const url = pressOf(c)
                const prompts = (c.prompts ?? []).map(p => promptCard(p, `${c.host}-${c.chat}-${p.id}`, c.host && !url ? `Answer it in that chat, on ${macName(c.host)}` : c.host ? `Answer it in that chat, which runs on ${macName(c.host)}` : 'Answer it in that chat', url ? c : undefined))
                return [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...prompts, ...cards.map(one => small(one))]
              }),
            ]}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
  })

}

