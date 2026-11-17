// Above the prompt: the small octopus while work runs, and how Claude uses this computer

// The answer picked above the prompt by its number, and how long the pick waits for the same number again
let bandPick: { id: string; n: number } | undefined
const BAND_PICK = 6000
// Above the prompt, which never scrolls: on the desktop, one steady line for as long as anything waits for the person, however the
// list is scrolled: how many, and what the first asks (17 Nov: the line came only once the list was scrolled, so what waited was
// told nowhere near where the person types). Scrolled away from the top, Show takes the list back there; nothing else moves it.
// In the terminal the band itself holds the first ask, so the line comes only once the list is scrolled.
// Work that just finished, in its moment at the top, is pointed at the same way, in green, once the list is scrolled
const isListPlaced = async ($: EngineInterface) => (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)
const isScrolled = (surface: string) => (listOffsets.get(surface) ?? 0) > 0
const isMarkerShown = async ($: EngineInterface, surface: string) =>
  ((waitsAtTop > 0 && (surface !== 'terminal' || isScrolled(surface))) || (finishedAtTop.length > 0 && isScrolled(surface))) && (await isListPlaced($))
// What the marker says, empty when it is not drawn: a bar held with a box in it is drawn again when this moves, but not while the
// box is typed in or holds the cursor
const markerSign = async ($: EngineInterface, surface: string) => ((await isMarkerShown($, surface)) ? `${waitsAtTop}|${firstAtTop}|${isScrolled(surface)}|${finishedAtTop.join('|')}` : '')
const markerWords = (surface: string) =>
  waitsAtTop > 0
    ? `● ${waitsAtTop} ${waitsAtTop === 1 ? 'question' : 'questions'} waiting for you${firstAtTop ? ` · first: ${firstAtTop}` : ''}${isScrolled(surface) && finishedAtTop.length ? ` · ${finishedAtTop.length} done` : ''}`
    : `↑ ${finishedAtTop.length === 1 ? `${finishedAtTop[0]} is done` : `${finishedAtTop.length} tasks are done`}, at the top of the panel`
const waitMarker = async ($: EngineInterface, ui: Ui, surface: string) =>
  (await isMarkerShown($, surface)) ? (
    <ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden" gap={1}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text color={waitsAtTop > 0 ? NEEDS : DONE} bold wrap="truncate-end">{markerWords(surface)}</ui.Text>
      </ui.Box>
      {isScrolled(surface) ? (
        <ui.Box flexShrink={0}>
          <ui.Button
            key={`band-waits-${presses}`}
            label="Show"
            plain
            onPress={() => ((presses += 1), void (recordEvent($, 'scroll-call', { to: 'start' }), $.ui.scroll({ in: LIST, to: 'start', block: 'start' })).catch(() => undefined))}
          />
        </ui.Box>
      ) : null}
    </ui.Box>
  ) : null
// The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: the work the reply goes to on a
// line of its own, the box under it as wide as the bar and BOX_ROWS lines tall whatever it holds, and under it, a gap below it
// what Enter does beside Send, the big one, and Close, small, which takes the box away again with what was typed kept for its card
// (17 Nov, the person: the box was "very small" and "doesn't extend taller"; one row of a field drawn as narrow as the app makes
// one, beside the title and buttons). The box names no submitLabel: the desktop app draws one as a second, small send button
// beside it, and with one a box of several lines sends only on Cmd+Enter; without it Enter sends and Shift+Enter makes a new line.
// Nothing in it follows the panel's scrolling. The box is the card's own: the same answer, and the same box through a new question
// of its work, until the person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
const barReply = ($: EngineInterface, ui: Ui, one: Todo) => {
  const draft = barDraft(one.id)
  const send = (value: string) => void ((barBoxAt = 0), dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), sendFromBar($, one.id, value).catch(err => log($, `reply not sent: ${String(err)}`)))
  return (
    <ui.Box key="band-reply" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={NEEDS} bold wrap="truncate-end">{`↳ Your answer to “${cut(titleOf(one), 60)}”`}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (
        <ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input
            key={barBoxKey(one.id)}
            placeholder="Type your reply"
            value={draftDrawn(draft)}
            rows={BOX_ROWS}
            autoFocus
            onInput={value => void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($), $.clock.now().then(at => (barBoxAt = at)))}
            onSubmit={send}
          />
        </ui.Box>
      ) : null}
      {barFoot($, ui, 'band-reply', presses, () => void ((drafts.get(draft) ?? '').trim() && send(drafts.get(draft) ?? '')), press => openReply($, undefined, press.surface))}
    </ui.Box>
  )
}
// Under a box in the bar: what Enter does, and Send, the big one, then Close, small
const BOX_KEYS = 'Enter sends · Shift+Enter for a new line'
const barFoot = ($: EngineInterface, ui: Ui, where: string, mark: number, onSend: () => void, onClose: (press: { surface: string }) => void, isLines = true) => (
  <ui.Box key={`${where}-foot`} flexDirection="row" alignItems="center" gap={2} flexShrink={0} marginTop={1}>
    <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
      <ui.Text dimColor wrap="truncate-end">{isLines ? BOX_KEYS : 'Enter sends'}</ui.Text>
    </ui.Box>
    <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <ui.Button key={`${where}-send-${mark}`} label="Send" variant="primary" onPress={onSend} />
      <ui.Button key={`${where}-close-${mark}`} label="Close" plain dimColor onPress={onClose} />
    </ui.Box>
  </ui.Box>
)
// The bar as last drawn on each surface while a reply box was in it: while the person types, and for as long as the box holds the
// cursor (barBoxAt), it is drawn as it was, whole, but for a change in what it holds, as a pane is (heldDrawings): each drawing is
// a new box under the cursor, its ring drawn again and a selection or a half-composed letter lost
// (17 Nov: the bar was drawn anew, and the box with it, each time any work wrote its cards, several times a second, as the bar
// read them while drawing; each drawing is a new box, and the app gives it the cursor again, its ring fading in again: the box
// blinked as the person typed). So a bar with a box open is given again as it was drawn, from the moment the box opens, for as
// long as what the box is and how tall it is drawn stay the same (barShape) and, while the box is not typed in and has no cursor,
// what the marker says (markerSign), reading none of the cards: a drawing that reads nothing is not drawn again as they are
// written. The cards are looked at once a second instead (lookBar), and the bar is drawn again when what it shows of them moved
const barHeld = new Map<string, { shape: string; mark: string; drawing: unknown }>()
// What a bar with a box open is drawn for, from the mod's own memory alone: which box, and what is said beside it
const barShape = () => {
  const keyBox = barKeyTarget()
  if (boxOpen && keyBox) return `key|${barKeyBoxKey(keyBox.id, boxOpen.mode)}|${boxSaid.get(keyBox.id) ?? ''}|${boxHeldReply.has(keyBox.id)}`
  return replyTo ? `reply|${barBoxKey(replyTo)}|${barCardsDrawn}` : ''
}
// What the cards say of the box open in the bar as last looked at: its card, still asking, under its title. Part of the held shape,
// so a card that stops asking (answered elsewhere, its question withdrawn, the work stopped) takes its box away within a second
let barCardsDrawn = ''
const barCardsSign = (cards: Todo[]) => {
  const target = barTarget(cards)
  return target?.ask ? `${target.id}|${titleOf(target)}` : ''
}
// Once a second while a bar holds a box (chat.tsx): the cards it shows moved, so it is drawn again, once for each change
const lookBar = async ($: EngineInterface) => {
  // A redraw put off while the box held the cursor is made once it no longer does (drawFresh)
  if (isRedrawOwed && !isBoxHeld(await $.clock.now())) drawAgain($)
  if (!barHeld.size || !replyTo) return
  const sign = barCardsSign(await read($, todos))
  if (sign === barCardsDrawn) return
  barCardsDrawn = sign
  drawAgain($, true)
}
// A bar drawn afresh with a box in it read the cards to draw it, and the engine draws a drawing again at the first write of what
// it read: the app then built the box anew under the cursor, its ring fading in again, at the first card any work wrote after the
// box opened or the marker moved. So it is asked for once more at once, and given then as held, reading nothing; once only, so a
// bar drawn afresh again in reply asks for nothing more
let isBarSettling = false
const settleBar = ($: EngineInterface) => {
  if (isBarSettling) return void (isBarSettling = false)
  isBarSettling = true
  // (the panes' own drawings are still good: they are given again as they were)
  void drawFresh($, true)
}
// When this surface's bar last asked for the cards to be drawn again as its box came or went: at most once a second, so two
// windows of one chat that differ never ask in turn without end
let barFlipAt = 0
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
const BAND_TERM_MARK = 3
const bandHooks = (on: On) => {

  // The bar on the desktop is redrawn as often as the panel and has buttons too, so it is given again as it was while its drawings or
  // the panel's are slow (isFreshTooSoon) and from the start of a click on one of its buttons until the click lands (isPressHeld), as the panel is:
  // a newer drawing retires the buttons on screen, and a click on one already gone runs nothing. Never while its reply box is typed
  // into or holds the cursor: a bar with a box open keeps a drawing of its own (barHeld)
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const drawBar = () => drawBarNow()
    if (e.surface !== 'desktop' || e.props.hasSurvey) return drawBar()
    const key = `bar|${e.requestId ?? ''}|${e.surface}|${e.props.bodyColumns}|${e.props.isCollapsed ? 1 : 0}`
    const at = await $.clock.now()
    const recent = lastShown.get(key) as Awaited<ReturnType<typeof next>> | undefined
    const isBarHeld = isTyping || (barBoxAt > 0 && at - barBoxAt < BAR_BOX_HELD)
    if (recent && !isBarHeld && isPressHeld(at)) return ((isPressMissed = true), recent)
    if (recent && !isBarHeld && isFreshTooSoon($, key, at, isPanelSlow(at))) return recent
    freshBegins(key)
    const madeFrom = Date.now()
    let made: { at: number; ms: number; fresh: number } | undefined
    try {
      const drawing = await drawBar()
      // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
      if (recent && !isBarHeld && isPressHeld(await $.clock.now())) return ((isPressMissed = true), recent)
      lastShown.set(key, drawing)
      made = { at, ms: Date.now() - madeFrom, fresh: freshness }
      return drawing
    } finally {
      freshEnds($, key, made)
    }
    // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
    async function drawBarNow() {
    // Whether this surface's bar takes the reply box, and whether it shows just now: the cards draw their asks by it (repliesInBar)
    // While one of the app's surveys holds the bar the box has no place in it, and the card has its own again
    // Folded by the person, nothing of the bar is on screen: the card has its own box then too
    const canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed
    if (e.requestId) barIds.set(e.surface, e.requestId)
    const flipAt = await $.clock.now()
    // A box open and drawn as it is: given again as it was, reading no cards (barHeld)
    const kept = barHeld.get(e.surface)
    if (kept && canBox && barBoxes.has(e.surface) && (replyTo || boxOpen) && kept.shape === barShape()) {
      const isHeldNow = isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD)
      if (isHeldNow || kept.mark === (await markerSign($, e.surface))) return ((isBarSettling = false), kept.drawing as Awaited<ReturnType<typeof next>>)
    }
    const cards = await read($, todos)
    if (canBox !== barBoxes.has(e.surface)) {
      if (canBox) barBoxes.add(e.surface)
      else barBoxes.delete(e.surface)
      // A box open in a bar that can no longer show it is closed, and stays closed when the bar is back; what was half typed in
      // it is drawn in the card's own box, and nothing is held as typed in any more
      const open = canBox ? undefined : cards.find(one => one.id === replyTo)
      if (open) (carryDraft($, open, barDraft(open.id)), freeTimes($))
      if (!canBox) ((replyTo = ''), (replyMark = ''), (boxOpen = undefined), barHeld.delete(e.surface))
      barBoxAt = 0
      // Only a card that asks is drawn differently for it
      // and a key box, whose buttons or field are drawn by it too
      if ((asksForBar(cards).length || boxes.some(one => !one.key)) && flipAt - barFlipAt >= 1000) ((barFlipAt = flipAt), drawAgain($))
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
      const asking = [...cards.filter(one => !one.parentId && one.ask)].sort((a, b) => Number(needsPerson(b)) - Number(needsPerson(a)) || (topPlaces.get(`//${a.id}`) ?? a.ask?.at ?? 0) - (topPlaces.get(`//${b.id}`) ?? b.ask?.at ?? 0))
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
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, waiting for you' : 'Claudopus, Claude is working on your reply', $, { surface: e.surface, requestId: e.requestId })}
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
                    {picked >= 0 ? `Type ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `Type its number twice in an empty box${asking.filter(needsPerson).length > Number(needsPerson(first)) ? ` · ${asking.filter(needsPerson).length - Number(needsPerson(first))} more waiting` : ''} · /claudopus to answer in words`}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        )
      }
    }
    // A key box's field the person opened from its box in the panel, while the box waits: held as drawn while it is typed in or
    // holds the cursor, as the reply box is below
    const keyBox = canBox ? barKeyTarget() : undefined
    if (boxOpen && canBox && !keyBox) boxOpen = undefined
    if (keyBox && boxOpen) {
      const shape = barShape()
      const marker = await waitMarker($, ui, e.surface)
      const row = barKeyRow($, ui, keyBox, boxOpen.mode)
      const drawing = marker ? (
        <Box flexDirection="column">
          {marker}
          {row}
        </Box>
      ) : (
        row
      )
      barHeld.set(e.surface, { shape, mark: await markerSign($, e.surface), drawing })
      settleBar($)
      return drawing
    }
    // The reply box the person opened from a card, while that card still asks; its ask answered or gone, the box goes with it
    const target = canBox ? barTarget(cards) : undefined
    if (replyTo && canBox && !target) ((replyTo = ''), (replyMark = ''))
    if (target?.ask) {
      // Drawn as it was while the box is typed in or holds the cursor: only the card it is for draws it anew, so neither the panel
      // scrolled under the cursor nor work starting or ending puts a new box under it. The row takes the place of the figures
      // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
      barCardsDrawn = barCardsSign(cards)
      const shape = barShape()
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
      barHeld.set(e.surface, { shape, mark: await markerSign($, e.surface), drawing })
      settleBar($)
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
          {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, a task is done' : 'Claudopus, Claude is working', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
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
    }
  })

}

