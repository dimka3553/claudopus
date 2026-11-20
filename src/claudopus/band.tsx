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
    ? `● ${waitsAtTop} waiting for you${firstAtTop ? ` · ${firstAtTop}` : ''}${isScrolled(surface) && finishedAtTop.length ? ` · ${finishedAtTop.length} done` : ''}`
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
// The one box above the chat, for everything that is typed for the panel (asking.tsx, barOpen): an answer in words, a key, a
// password, a change to a done task, what to do next from a result. One heading line says what it is for; the field under it is as
// wide as the bar and BOX_ROWS lines tall whatever it holds; under it, a gap between, what Enter does beside Send, the big one,
// and Close, small, which takes the box away again (17 Nov, the person: the box was "very small" and "doesn't extend taller").
// The field names no submitLabel: the desktop app draws one as a second, small send button beside it, and with one a box of
// several lines sends only on Cmd+Enter; without it Enter sends. Nothing in it follows the panel's scrolling. It takes the cursor
// when the person clicks anywhere in the bar (autoFocus)
// `draft`: where what is typed and not sent is kept (an answer, a change, a result); a key or a password is kept nowhere but in
// barKeyTyped while the box is open, for its Send button. `said`: what went wrong with what was last sent from it
// `message`: the task a message goes to, whose box has the message's own row under it (messageFoot): its files, Attach, Send now
// and Send, as at the bottom of its Details
type BarBox = { head: string; placeholder: string; draft?: string; secret?: string; said?: string; extra?: JSX.Element | null; message?: Todo; attachTo?: string; send: (value: string) => void }
// The card the box was opened on by Message, while it works or has finished and asks nothing: asking, its box goes
const changeTarget = (cards: Todo[]) => (barOpen?.kind === 'change' ? cards.find(one => one.id === barOpen?.id && canChange(asPressed(one))) : undefined)
// What the open box is for, as it stands now; none once that is answered, gone or no longer open to it, and the box goes with it
const barBoxOf = ($: EngineInterface, ui: Ui, cards: Todo[], kept: Report[]): BarBox | undefined => {
  const open = barOpen
  if (!open) return undefined
  const sent = (id: string) => void ((barBoxAt = 0), dropDrafts($, id), replies.set(id, (replies.get(id) ?? 0) + 1), freeTimes($))
  const forTask = (card: string | undefined) => {
    const one = card ? cards.find(other => other.id === card) : undefined
    return one ? ` for “${cut(titleOf(one), 50)}”` : ''
  }
  if (open.kind === 'answer') {
    const one = barTarget(cards)
    return one && { head: `↳ Your answer to “${cut(titleOf(one), 60)}”`, placeholder: 'Type your answer', draft: barDraft(), attachTo: one.id, send: value => void (sent(one.id), sendFromBar($, one.id, value).catch(err => log($, `reply not sent: ${String(err)}`))) }
  }
  if (open.kind === 'change') {
    const one = changeTarget(cards)
    return one && { head: `↳ ${stageOf(cards, one) === 'delivered' && one.questions?.length ? 'Reply' : 'Message'} to “${cut(titleOf(one), 50)}”`, placeholder: 'Type your message', draft: messageDraft(one.id), message: one, send: value => sendMessageFrom($, one.id, value, false) }
  }
  // Words on a permission of a task's card: they go to that task, and the block keeps Allow and Don't allow (gate.tsx, wordsOnGate)
  if (open.kind === 'permission') {
    const one = gatePressed.has(open.id) || !(gateHeld.has(open.id) || gateParked.has(open.id)) ? undefined : cards.find(card => !card.chat && card.admins?.some(gate => gate.id === open.id))
    // (its files go with the words, as from the box that answers a question)
    const sendWords = (value: string) => {
      if (!one) return
      const files = takeAttached(open.id)
      const shown = [value.trim(), ...files.map(path => `📎 ${path.split('/').pop() ?? path}`)].filter(Boolean).join(' ')
      if (!shown) return
      ;((barBoxAt = 0), drafts.delete(barDraft()), keepDraft($, barDraft(), undefined), replies.set(open.id, (replies.get(open.id) ?? 0) + 1), (barOpen = undefined), freeTimes($), redraw($))
      void wordsOnGate($, one.id, open.id, shown, filesNote(files))
    }
    return one && { head: `↳ Your answer to “${cut(titleOf(one), 60)}”`, placeholder: 'Type your answer', draft: barDraft(), attachTo: open.id, send: sendWords }
  }
  if (open.kind === 'continue') {
    const r = kept.find(one => one.id === open.id)
    return r && { head: `↳ Message to “${cut(r.title, 50)}”`, placeholder: 'Type your message', draft: barDraft(), attachTo: r.id, send: value => void (sent(r.id), (barOpen = undefined), redraw($), continueFrom($, r.id, value, takeAttached(r.id)).catch(err => log($, `message from a result not sent: ${String(err)}`))) }
  }
  const box = boxes.find(one => one.id === open.id)
  if (!box) return undefined
  const mode: BoxMode = open.kind === 'words' ? 'reply' : 'key'
  const head =
    open.kind === 'words'
      ? `↳ Your answer in place of ${box.name ?? (isNameBox(box) ? 'the name' : 'the key')}`
      : open.kind === 'password'
        ? `↳ ${box.host === 'here' || !box.host ? `${thisMac().replace(/^t/, 'T')}'s password` : `The password of ${box.host}`}${forTask(box.card)}`
        : box.name
          ? `↳ ${box.name}${forTask(box.card)}`
          : `↳ The key's name`
  return {
    head,
    placeholder: open.kind === 'words' ? 'Type your answer' : open.kind === 'password' || !box.name ? 'Type it here' : 'Paste it here',
    secret: box.id,
    ...(boxSaid.get(box.id) ? { said: boxSaid.get(box.id) } : {}),
    extra: heldReplyButtons($, ui, box.id, 'band-key'),
    // (a pasted key often ends in a line break, which is no part of it)
    send: value => submitBox($, box.id, mode, mode === 'reply' ? value : value.replace(/[\r\n]+$/, '')),
  }
}
const barBox = ($: EngineInterface, ui: Ui, box: BarBox) => {
  const typed = () => (box.draft ? (drafts.get(box.draft) ?? '') : box.secret ? (barKeyTyped.get(box.secret) ?? '') : '')
  // (pictures or files attached are an answer by themselves, with no words)
  const send = (value: string) => void ((value.trim() || (box.attachTo && attached.get(box.attachTo)?.length)) && box.send(value))
  return (
    <ui.Box key="band-box" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={NEEDS} bold wrap="truncate-end">{box.head}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (
        <ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input
            key={barBoxKey()}
            placeholder={box.placeholder}
            {...(box.draft ? { value: draftDrawn(box.draft) } : {})}
            rows={BOX_ROWS}
            autoFocus
            onInput={value => {
              const { draft, secret } = box
              if (draft) (drafts.set(draft, value), keepDraft($, draft, value))
              else if (secret) ((value ? boxTyped.add(secret) : boxTyped.delete(secret)), barKeyTyped.set(secret, value))
              holdTimes($)
              void $.clock.now().then(at => (barBoxAt = at))
            }}
            onSubmit={send}
          />
        </ui.Box>
      ) : null}
      {box.said ? <ui.Text key="band-box-said" color={NEEDS} wrap="wrap">{box.said}</ui.Text> : null}
      {box.extra ?? null}
      {box.message ? (
        <ui.Box key="band-box-message" flexShrink={0} marginTop={1} width="100%">
          {messageFoot($, ui, box.message, 'band-box', <ui.Button key={`band-box-close-${presses}-${boxPresses}`} label="Close" plain dimColor onPress={press => openBar($, undefined, press.surface)} />)}
        </ui.Box>
      ) : null}
      {box.attachTo && !box.message ? <ui.Box key="band-box-attached" flexShrink={0} marginTop={1} width="100%">{attachedRow($, ui, box.attachTo, 'band-box')}</ui.Box> : null}
      {box.message ? null : <ui.Box key="band-box-foot" flexDirection="row" alignItems="center" gap={2} flexShrink={0} marginTop={1}>
        {box.attachTo ? <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>{attachButtons($, ui, box.attachTo, 'band-box')}</ui.Box> : null}
        <ui.Box flexGrow={1} flexShrink={1} minWidth={0} />
        <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
          <ui.Button key={`band-box-send-${presses}-${boxPresses}`} label="Send" variant="primary" onPress={() => send(typed())} />
          <ui.Button key={`band-box-close-${presses}-${boxPresses}`} label="Close" plain dimColor onPress={press => openBar($, undefined, press.surface)} />
        </ui.Box>
      </ui.Box>}
    </ui.Box>
  )
}
// The bar as last drawn on each surface while its box was in it: while the person types, and for as long as the box holds the
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
const barShape = () => (barOpen ? `${barOpen.kind}|${barBoxKey()}|${attachShape(barOpen.id)}|${isBoxKind(barOpen.kind) ? `${boxSaid.get(barOpen.id) ?? ''}|${boxHeldReply.has(barOpen.id)}` : barCardsDrawn}` : '')
// What the cards say of the box open in the bar as last looked at: its card, still asking or still done, under its title. Part
// of the held shape, so a card that stops asking (answered elsewhere, its question withdrawn, the task stopped) takes its box
// away within a second
let barCardsDrawn = ''
const barCardsSign = (cards: Todo[]) => {
  const one = changeTarget(cards) ?? barTarget(cards)
  return one ? `${one.id}|${titleOf(one)}` : barOpen?.kind === 'continue' ? `result|${barOpen.id}` : ''
}
// Once a second while a bar holds a box (chat.tsx): the cards it shows moved, so it is drawn again, once for each change
const lookBar = async ($: EngineInterface) => {
  // A redraw put off while the box held the cursor is made once it no longer does (drawFresh)
  if (isRedrawOwed && !isBoxHeld(await $.clock.now())) drawAgain($)
  if (!barHeld.size || !barOpen || isBoxKind(barOpen.kind)) return
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
    // A message that waits for a hook to start a task again goes from this drawing (sendHeld)
    if (heldSends.length) await sendHeld($).catch(err => log($, `message not sent: ${String(err)}`))
    const drawBar = () => drawBarNow()
    if (e.surface !== 'desktop' || e.props.hasSurvey) return drawBar()
    const key = `bar|${e.requestId ?? ''}|${e.surface}|${e.props.bodyColumns}|${e.props.isCollapsed ? 1 : 0}`
    const at = await $.clock.now()
    const line = `bar|${e.requestId ?? ''}|${e.surface}`
    const recent = newestFor(line, key) as Awaited<ReturnType<typeof next>> | undefined
    const isBarHeld = isTyping || (barBoxAt > 0 && at - barBoxAt < BAR_BOX_HELD)
    if (recent && !isBarHeld && isPressHeld(at)) return ((isPressMissed = true), recent)
    if (recent && !isBarHeld && isFreshTooSoon($, key, at, isPanelSlow(at))) return recent
    freshBegins(key, at)
    const madeFrom = Date.now()
    let made: { at: number; ms: number; fresh: number } | undefined
    try {
      const drawing = await drawBar()
      // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
      if (recent && !isBarHeld && isPressHeld(await $.clock.now())) return ((isPressMissed = true), recent)
      paneNewest.set(line, { key, drawing })
      made = { at, ms: drawnFor(madeFrom), fresh: freshness }
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
    if (kept && canBox && barBoxes.has(e.surface) && barOpen && kept.shape === barShape()) {
      const isHeldNow = isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD)
      if (isHeldNow || kept.mark === (await markerSign($, e.surface))) return ((isBarSettling = false), kept.drawing as Awaited<ReturnType<typeof next>>)
    }
    const cards = await read($, todos)
    if (canBox !== barBoxes.has(e.surface)) {
      if (canBox) barBoxes.add(e.surface)
      else barBoxes.delete(e.surface)
      // A box open in a bar that can no longer show it is closed, and stays closed when the bar is back; what was half typed in
      // it is drawn in the card's own box, and nothing is held as typed in any more
      const open = canBox || barOpen?.kind !== 'answer' ? undefined : cards.find(one => one.id === barOpen?.id)
      if (open) (carryDraft($, open, barDraft()), freeTimes($))
      if (!canBox) ((barOpen = undefined), barHeld.delete(e.surface))
      barBoxAt = 0
      // Only a card that asks is drawn differently for it
      // and a key box, whose buttons or field are drawn by it too
      // and a Done card, whose Message is there only with the box (a working card's comes with its own next drawing)
      if ((asksForBar(cards).length || boxes.length || barOpen || cards.some(one => one.status !== 'working' && canChange(asPressed(one)))) && flipAt - barFlipAt >= 1000) ((barFlipAt = flipAt), drawAgain($))
    }
    if (e.props.hasSurvey) return next(e)
    const bandAt = await $.clock.now()
    const bandKept = await read($, reports)
    // (each card by its stage: at work from its start until its result, waiting only while something of its own waits for the person)
    const working = cards.filter(one => !one.parentId && (stageOf(cards, one) === 'working' || stageOf(cards, one) === 'waiting'))
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, bandAt)
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
        // The same block as on its card (needBlock), compact: its own buttons numbered, and nothing typed here
        const answers = (ask.choices ?? []).slice(0, 9)
        const id = `${first.id}:${ask.at}`
        const picked = bandPick?.id === id ? bandPick.n : -1
        const press = (n: number, choice: string) => {
          if (picked === n) return (bandPick = undefined), void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))
          const pick = (bandPick = { id, n })
          ;(recordEvent($, 'redraw-band'), $.ui.invalidate('ui.render'))
          // Left alone, the pick is let go
          $.clock.after(BAND_PICK, () => void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))))
        }
        const more = asking.filter(needsPerson).length - Number(needsPerson(first))
        const need: Need = {
          id: `band-ask-${first.id}`,
          kind: ask.refused ? 'permission' : 'question',
          at: ask.at,
          from: titleOf(first),
          text: cut(oneLine(ask.text), Math.max(80, e.props.bodyColumns * 3)),
          ...(ask.copy ? { command: oneLine(ask.copy) } : {}),
          isActing: isActingOnReply(first),
          // Acted on after the person's reply in words: that reply, and nothing to press
          ...(isActingOnReply(first)
            ? { line: sentLine(first, await $.clock.now()) || `✓ You answered “${cut(ask.replied?.text ?? '', 60)}”` }
            : { where: `${ask.details ? 'The details are on its card · ' : ''}${picked >= 0 ? `Type ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `${answers.length ? 'Type its number twice in an empty box · ' : ''}${more > 0 ? `${more} more waiting · ` : ''}/claudopus to answer in words`}` }),
          buttons: isActingOnReply(first) || ask.refused ? [] : answers.map((choice, n) => ({ key: `band-ask-${first.id}-${ask.at}-${n}`, label: choice, hotkey: String(n + 1), isPlain: true, onPress: () => press(n, choice) })),
        }
        return (
          <Box flexDirection="column">
            {await waitMarker($, ui, e.surface)}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, waiting for you' : 'Claudopus, working on your answer', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0} flexDirection="column">
                {needBlock($, ui, need, { isCompact: true, surface: e.surface })}
              </Box>
            </Box>
          </Box>
        )
      }
    }
    // The one box, while what it was opened for still waits; that answered or gone, the box goes with it
    const box = canBox ? barBoxOf($, ui, cards, bandKept) : undefined
    if (barOpen && canBox && !box) barOpen = undefined
    if (box) {
      // Drawn as it was while the box is typed in or holds the cursor: only what it is for draws it anew, so neither the panel
      // scrolled under the cursor nor work starting or ending puts a new box under it. The box takes the place of the figures
      // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
      barCardsDrawn = barCardsSign(cards)
      const shape = barShape()
      // What waits at the top of a panel scrolled away is still pointed at, as the bar is drawn; not while the box is held
      const marker = await waitMarker($, ui, e.surface)
      const row = barBox($, ui, box)
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
    const isListHere = e.surface !== 'terminal' && (await isListPlaced($))
    const drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null
    const drawing = (spacers: JSX.Element | null) => {
      const row = (
        <Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, a task is done' : 'Claudopus, Claude is working', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
          {spacers}
          {figures ? (drawn ?? <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
          {/* At the very right on the desktop, Open panel while the panel is closed and Close panel while it is open */}
          {e.surface !== 'terminal' ? (
            <Box key="band-panel" flexGrow={1} flexShrink={0} flexDirection="row" justifyContent="flex-end">
              <ui.Button key={`band-panel-${isListHere ? 'close' : 'open'}`} label={isListHere ? 'Close panel' : 'Open panel'} plain dimColor onPress={() => void (isListHere ? hidePanel($) : showPanel($)).catch(err => log($, `panel not ${isListHere ? 'closed' : 'opened'}: ${String(err)}`))} />
            </Box>
          ) : null}
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

