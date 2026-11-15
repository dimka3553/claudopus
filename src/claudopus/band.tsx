// Above the prompt: the small octopus while work runs, and how Claude uses this computer

// The answer picked above the prompt by its number, and how long the pick waits for the same number again
let bandPick: { id: string; n: number } | undefined
const BAND_PICK = 6000
// Above the prompt, which never scrolls: once the list is scrolled away from its top, how many things wait there for the person.
// Pressed, it takes the list back to its top; nothing else moves the list
// Work that just finished, in its moment at the top, is pointed at the same way, in green, under what waits
const waitMarker = async ($: EngineInterface, ui: Ui, surface: string) =>
  (waitsAtTop > 0 || finishedAtTop.length > 0) && (listOffsets.get(surface) ?? 0) > 0 && (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced) ? (
    <ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden">
      <ui.Button
        key={`band-waits-${presses}`}
        plain
        hover={{ scope: 'band-waits', underline: true }}
        onPress={() => ((presses += 1), void (recordEvent($, 'scroll-call', { to: 'start' }), $.ui.scroll({ in: LIST, to: 'start', block: 'start' })).catch(() => undefined))}
      >
        {waitsAtTop > 0 ? (
          <ui.Text color={NEEDS} bold wrap="truncate-end">{`↑ ${waitsAtTop === 1 ? '1 waits' : `${waitsAtTop} wait`} for you at the top of the panel${finishedAtTop.length ? ` · ${finishedAtTop.length} just finished` : ''}`}</ui.Text>
        ) : (
          <ui.Text color={DONE} bold wrap="truncate-end">{`↑ ${finishedAtTop.length === 1 ? `${finishedAtTop[0]} finished` : `${finishedAtTop.length} just finished`}, at the top of the panel`}</ui.Text>
        )}
      </ui.Button>
    </ui.Box>
  ) : null
// The reply box of the card that asks, in the bar above the prompt (asking.tsx, repliesInBar): one line naming the work the reply goes
// to, with the line that points at the panel's top at its end so the bar keeps its height as the panel is scrolled, and the box
// under it. The box is the card's own: the same drafts, the same answer, a new one for each ask
const barReply = ($: EngineInterface, ui: Ui, one: Todo, ask: NonNullable<Todo['ask']>, more: number, marker: JSX.Element | null) => {
  const draft = draftOf(one.id, ask)
  return (
    <ui.Box key="band-reply" flexDirection="column" flexShrink={0}>
      <ui.Box key="band-reply-to" flexDirection="row" gap={2} height={1} overflow="hidden">
        <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
          <ui.Text wrap="truncate-end">
            <ui.Text color={NEEDS} bold>{`↳ Reply to “${cut(titleOf(one), 48)}”`}</ui.Text>
            <ui.Text dimColor>{`${more > 0 ? ` · ${more} more ${more === 1 ? 'question on its card' : 'questions on their cards'}` : ''} · ${oneLine(ask.text)}`}</ui.Text>
          </ui.Text>
        </ui.Box>
        {marker}
      </ui.Box>
      {'Input' in ui ? (
        <ui.Box width="100%" flexDirection="column">
          <ui.Input
            key={`band-${one.id}-reply-${replies.get(one.id) ?? 0}-${askMark(ask)}`}
            placeholder="Reply in your own words"
            value={draftShown(one.id, ask)}
            submitLabel="send"
            onInput={value => void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($))}
            onSubmit={value => void (dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
          />
        </ui.Box>
      ) : null}
    </ui.Box>
  )
}
// The bar as last drawn on each surface while a reply box was in it: while the person types it is drawn as it was, whole, but for a
// change in what it holds, as a pane is (heldDrawings): each drawing is a new box under the cursor
const barHeld = new Map<string, { shape: string; drawing: unknown }>()
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
const BAND_TERM_MARK = 3
const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // Whether this surface's bar takes the reply box, and whether it shows just now: the cards draw their asks by it (repliesInBar)
    const canBox = e.surface === 'desktop' && 'Input' in uiOf($, e)
    const isShut = canBox && Boolean(e.props.hasSurvey || e.props.isCollapsed)
    const cards = await read($, todos)
    if (canBox !== barBoxes.has(e.surface) || isShut !== barShut.has(e.surface)) {
      if (canBox) barBoxes.add(e.surface)
      else barBoxes.delete(e.surface)
      if (isShut) barShut.add(e.surface)
      else barShut.delete(e.surface)
      // Only a card that asks is drawn differently for it
      if (asksForBar(cards).length) drawAgain($)
    }
    if (e.props.hasSurvey) return next(e)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    const ui = uiOf($, e)
    const { Box, Button, Text } = ui

    // In the terminal the panel is out of the keys' reach until ctrl+x Tab, and a narrow one seats no panel until it is asked for:
    // there what needs the person is said here, this chat's own (another chat's ask is answered in its chat), under the name of the work that asks, whole, with its answers
    // numbered. A bare digit typed in an empty prompt presses a band's Button, so the person answers from where they already are.
    // A message may begin with a digit too, so one press only picks the answer and says so; the same digit again sends it
    if (e.surface === 'terminal') {
      // What waits on the person comes before an ask whose work is acting on their reply, which is drawn in the work's purple
      const asking = [...cards.filter(one => !one.parentId && one.ask)].sort((a, b) => Number(needsPerson(b)) - Number(needsPerson(a)))
      const [first] = asking
      const ask = first?.ask
      if (first && ask) {
        const answers = (ask.choices?.length ? ask.choices : DEFAULT_ANSWERS).slice(0, 9)
        const id = `${first.id}:${ask.at}`
        const picked = bandPick?.id === id ? bandPick.n : -1
        const press = (n: number, choice: string) => {
          if (picked === n) return (bandPick = undefined), void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))
          const pick = (bandPick = { id, n })
          ;(recordEvent($, 'redraw-band'), $.ui.invalidate('ui.render'))
          // Left alone, the pick is let go
          $.clock.after(BAND_PICK, () => void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))))
        }
        return (
          <Box flexDirection="column">
            {await waitMarker($, ui, e.surface)}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, something needs you' : 'Claudopus at work on your reply', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{`${titleOf(first)}: `}</Text>
                  <Text color={needsPerson(first) ? NEEDS : LIVE} bold>{cut(oneLine(ask.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {/* Acted on after the person's reply in words: that reply, and nothing to press */}
            {isActingOnReply(first) ? (
              <Text key="band-ask-replied" dimColor wrap="truncate-end">{`    ${sentLine(first, await $.clock.now()) || `✓ You replied “${cut(ask.replied?.text ?? '', 60)}”`}`}</Text>
            ) : (
              <Box flexDirection="column">
                {/* The chat's notice with what it is about went only to the chat that started the work */}
                {ask.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first) ? '    What it is about is in the chat above and on its card' : '    What it is about is on its card'}</Text> : null}
                {ask.copy ? <Text key="band-ask-copy" wrap="truncate-end">{`    ${oneLine(ask.copy)}`}</Text> : null}
                <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                  {answers.map((choice, n) => (
                    <Button key={`band-ask-${first.id}-${ask.at}-${n}`} label={choice} plain hotkey={String(n + 1)} onPress={() => press(n, choice)} />
                  ))}
                  <Text dimColor={picked < 0} color={picked < 0 ? undefined : needsPerson(first) ? NEEDS : LIVE}>
                    {picked >= 0 ? `Press ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `press its number twice in the empty prompt${asking.filter(needsPerson).length > Number(needsPerson(first)) ? ` · ${asking.filter(needsPerson).length - Number(needsPerson(first))} more waiting` : ''} · /claudopus to reply in words`}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        )
      }
    }
    // Where the bar takes the reply box: the card that asks, or the one the person pointed it at, and how many more ask
    const asking = canBox && !isShut ? asksForBar(cards) : []
    const target = asking.length ? barTarget(cards) : undefined
    if (target?.ask) {
      // The box stays this card's until it is answered
      replyTo = target.id
      const marker = await waitMarker($, ui, e.surface)
      const shape = JSON.stringify([target.id, askMark(target.ask), replies.get(target.id) ?? 0, asking.length, Boolean(marker), waitsAtTop, finishedAtTop, working.length > 0, happy])
      const held = barHeld.get(e.surface)
      if (isTyping && held?.shape === shape) return held.drawing as Awaited<ReturnType<typeof next>>
      const reply = barReply($, ui, target, target.ask, asking.length - 1, marker)
      let drawing: JSX.Element = reply
      if (working.length || happy) {
        await read($, figuresAt)
        const figures = usageNow(await $.clock.now())
        if (!figures) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))
        const drawn = figures ? usageDrawn(ui, figures) : null
        drawing = (
          <Box flexDirection="column">
            {reply}
            <Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
              {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
              {drawn ? usageSpacersDrawn(ui) : null}
              {figures ? (drawn ?? <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, Infinity)}</Box>) : null}
            </Box>
          </Box>
        )
      }
      barHeld.set(e.surface, { shape, drawing })
      return drawing
    }
    barHeld.delete(e.surface)
    if (!working.length && !happy) return (await waitMarker($, ui, e.surface)) ?? next(e)
    // A narrow terminal seats no panel until it is asked for: the band says how
    const isPanelAway = e.surface === 'terminal' && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)

    // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
    // network's speed, looked at every few seconds while work runs. New figures redraw it
    await read($, figuresAt)
    const figures = usageNow(await $.clock.now())
    if (!figures) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))

    const marker = await waitMarker($, ui, e.surface)
    const drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null
    const drawing = (spacers: JSX.Element | null) => {
      const row = (
        <Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
          {spacers}
          {figures ? (drawn ?? <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
          {/* The figures fill a phone's terminal: the hint shows until they come */}
          {isPanelAway && !figures ? (
            <Box flexShrink={0}>
              <Text dimColor>· /claudopus shows the panel</Text>
            </Box>
          ) : null}
        </Box>
      )
      // Where the figures are drawn, a pointer resting on one shows its card floating over the chat above them, taking no room
      return marker ? (
        <Box flexDirection="column">
          {marker}
          {row}
        </Box>
      ) : (
        row
      )
    }
    // Where the app lifts the figures' cards, each drawing moves them past the places they had in the last
    return drawing(drawn ? usageSpacersDrawn(ui) : null)
  })

}

