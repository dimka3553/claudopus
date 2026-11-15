// The /claudopus and /servers commands, and the panel's focus and close

// Panes whose focus is in a box the person types in, and each pane's last move of the person's
const boxFocused = new Set<string>()
const lastMoves = new Map<string, { at: number; by: number }>()
// Where the app's last refused pull would have put each pane: the focused box's place
const pulledTo = new Map<string, number>()

const commandHooks = (on: On) => {

  on('command.run', { command: 'claudopus' }, async $ => {
    await update($, me, one => ({ ...one, isListOpened: true }))
    await update($, paneShown, () => true)
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS })
    // Asked for where it can be drawn, it is open in every chat from now on
    if (opened.isPlaced) await choosePanel($, true)

    return { text: opened.isPlaced ? 'Claudopus panel opened.' : nowhere('Claudopus') }
  })

  // A box the person moves the focus into holds the panel's drawing, so nothing is drawn under them as they start typing; the focus
  // moved by them anywhere else, or out of the pane, lets it go
  on('ui.focus', async ($, e, next) => {
    if (e.origin.kind === 'person' && (e.plugin === 'claudopus' || e.plugin === undefined)) {
      // A press begins with the focus moving onto the button: from then the panel holds still for it (engage)
      if (e.plugin === 'claudopus') await engage($)
      if (e.plugin === 'claudopus' && isTypedBox(e.element)) holdTimes($)
      else freeTimes($)
    }
    // Which panes have the focus in a box typed into, for the pull back below
    if (e.plugin === 'claudopus' && isTypedBox(e.element)) boxFocused.add(e.requestId)
    else boxFocused.delete(e.requestId)
    return next(e)
  })
  // The person scrolling the panel or a Details tab is using it: what moves on its own waits (engage)
  // Every pane of the mod's counts, its tabs too: Results, Memory and Keys were drawn anew under a scroll and stopped it (scrollRest)
  on('ui.scroll', async ($, e, next) => {
    if (e.origin.kind === 'person' && isModPane(e.requestId)) (await engage($), await scrolled($))
    // The app pulling the pane back to the box the person types in, reported as their move, is refused: the window stays where
    // they scrolled it (scrolls.ts)
    if (e.origin.kind === 'person') {
      const move = { at: await $.clock.now(), by: e.by, to: e.offset }
      if (!isPullGuardOff && isPulledBack(lastMoves.get(e.requestId), move, boxFocused.has(e.requestId), pulledTo.get(e.requestId)))
        return (Math.abs(e.by) >= PULL_MARKS && pulledTo.set(e.requestId, e.offset), recordEvent($, 'pull-refused', { by: e.by, to: e.offset }), {})
      lastMoves.set(e.requestId, move)
    }
    return next(e)
  }).catch(($, e, next) => next(e))
  // Under a scroll in progress a pane of the mod's is given its last drawing again, whatever asked: its rows stay as the person is
  // scrolling them. It is still drawn, so what it reads is still followed, and a drawing that moved is drawn once the scroll rests
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    if (!isModPane(id)) return next(e)
    const key = `${scrollKey(e)}|${e.props.scroll.offset > 0 ? 1 : 0}`
    const r = await next(e)
    const last = scrollDrawings.get(key)
    if (last !== undefined && last !== r && (await isScrolling($))) return (owe($, 'drawing-held'), last as typeof r)
    scrollDrawings.set(key, r)
    return r
  })
  // A pick of the person's in the mod's panes is their own move, as a press is (tabHooks): the drawing is let go before it acts
  on('ui.select', { plugin: 'claudopus' }, async ($, e, next) => (freeTimes($), next(e)))
  // Closed by the person's own hand, it closes in every chat and stays closed until asked for; a close of the mod's own is no choice
  on('ui.close', async ($, e, next) => {
    const r = await next(e)
    // The list closed, by anyone: nothing of where it stood is kept, so the line above the prompt no longer points into it
    if (e.id === LIST) (listOffsets.clear(), drawAgain($))
    if (e.id === LIST && e.origin.kind === 'person' && dir) await choosePanel($, false)
    return r
  })

  on('command.run', { command: 'servers' }, async $ => {
    await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    const opened = await $.ui.open({ id: PANE, title: PANE_TITLE })

    return { text: opened.isPlaced ? 'Servers panel opened.' : nowhere('Servers') }
  })

}

