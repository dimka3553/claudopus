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
          <ui.Text color={NEEDS} bold wrap="truncate-end">{`↑ ${waitsAtTop === 1 ? '1 is' : `${waitsAtTop} are`} waiting for you at the top of the panel${finishedAtTop.length ? ` · ${finishedAtTop.length} just finished` : ''}`}</ui.Text>
        ) : (
          <ui.Text color={DONE} bold wrap="truncate-end">{`↑ ${finishedAtTop.length === 1 ? `${finishedAtTop[0]} finished` : `${finishedAtTop.length} just finished`}, at the top of the panel`}</ui.Text>
        )}
      </ui.Button>
    </ui.Box>
  ) : null
// The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: one row, the work the reply goes
// to, the box, and Close, which takes the row away again with what was typed kept for its card. Nothing in the row follows the
// panel's scrolling. The box is the card's own: the same answer, and the same box through a new question of its work, until the
// person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
const barReply = ($: EngineInterface, ui: Ui, one: Todo) => {
  const draft = barDraft(one.id)
  return (
    <ui.Box key="band-reply" flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
      <ui.Box flexShrink={1} minWidth={0}>
        <ui.Text color={NEEDS} bold wrap="truncate-end">{`↳ Your reply to “${cut(titleOf(one), 40)}”`}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (
        <ui.Box flexShrink={0}>
          <ui.Input
            key={barBoxKey(one.id)}
            placeholder="Type your reply"
            value={draftDrawn(draft)}
            submitLabel="send"
            autoFocus
            onInput={value => void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($), $.clock.now().then(at => (barBoxAt = at)))}
            onSubmit={value => void ((barBoxAt = 0), dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), sendFromBar($, one.id, value).catch(err => log($, `reply not sent: ${String(err)}`)))}
          />
        </ui.Box>
      ) : null}
      <ui.Box flexShrink={0}>
        <ui.Button key={`band-reply-close-${presses}`} label="Close" onPress={press => openReply($, undefined, press.surface)} />
      </ui.Box>
    </ui.Box>
  )
}
// The bar as last drawn on each surface while a reply box was in it: while the person types, and for as long as the box holds the
// cursor (barBoxAt), it is drawn as it was, whole, but for a change in what it holds, as a pane is (heldDrawings): each drawing is
// a new box under the cursor, its ring drawn again and a selection or a half-composed letter lost
const barHeld = new Map<string, { shape: string; drawing: unknown }>()
// When this surface's bar last asked for the cards to be drawn again as its box came or went: at most once a second, so two
// windows of one chat that differ never ask in turn without end
let barFlipAt = 0
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
const BAND_TERM_MARK = 3
const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // Whether this surface's bar takes the reply box, and whether it shows just now: the cards draw their asks by it (repliesInBar)
    // While one of the app's surveys holds the bar the box has no place in it, and the card has its own again
    // Folded by the person, nothing of the bar is on screen: the card has its own box then too
    const canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed
    if (e.requestId) barIds.set(e.surface, e.requestId)
    const cards = await read($, todos)
    const flipAt = await $.clock.now()
    if (canBox !== barBoxes.has(e.surface)) {
      if (canBox) barBoxes.add(e.surface)
      else barBoxes.delete(e.surface)
      // A box open in a bar that can no longer show it is closed, and stays closed when the bar is back; what was half typed in
      // it is drawn in the card's own box, and nothing is held as typed in any more
      const open = canBox ? undefined : cards.find(one => one.id === replyTo)
      if (open) (carryDraft($, open, barDraft(open.id)), freeTimes($))
      if (!canBox) ((replyTo = ''), (replyMark = ''), barHeld.delete(e.surface))
      barBoxAt = 0
      // Only a card that asks is drawn differently for it
      if (asksForBar(cards).length && flipAt - barFlipAt >= 1000) ((barFlipAt = flipAt), drawAgain($))
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
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, something needs you' : 'Claudopus is working on your reply', $, { surface: e.surface, requestId: e.requestId })}
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
                {ask.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first) ? '    The details are in the chat above and on its card' : '    The details are on its card'}</Text> : null}
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
    // The reply box the person opened from a card, while that card still asks; its ask answered or gone, the box goes with it
    const target = canBox ? barTarget(cards) : undefined
    if (replyTo && canBox && !target) ((replyTo = ''), (replyMark = ''))
    if (target?.ask) {
      // Drawn as it was while the box is typed in or holds the cursor: only the card it is for draws it anew, so neither the panel
      // scrolled under the cursor nor work starting or ending puts a new box under it. The row takes the place of the figures
      // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
      const shape = barBoxKey(target.id)
      const held = barHeld.get(e.surface)
      if ((isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD)) && held?.shape === shape) return held.drawing as Awaited<ReturnType<typeof next>>
      // What waits at the top of a panel scrolled away is still pointed at, as the bar is drawn; not while the box is held
      const marker = await waitMarker($, ui, e.surface)
      const reply = barReply($, ui, target)
      const drawing = marker ? (
        <Box flexDirection="column">
          {marker}
          {reply}
        </Box>
      ) : (
        reply
      )
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
          {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, task finished' : 'Claudopus, working', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
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

