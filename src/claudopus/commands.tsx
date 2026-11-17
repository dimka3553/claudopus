// The /claudopus and /servers commands, and the panel's focus and close

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
    // The bar holds its drawing for as long as its reply box has the cursor (band.tsx), however the cursor came there first: by the
    // person's click in the box, as the box takes it when they click into the bar (autoFocus), or by the mod's own call. After that
    // only the person's own focus renews it (and each letter): the app may give the box the cursor again each time it builds it
    // anew, and each redraw would renew the hold that puts redraws off (asking.tsx, isBoxHeld)
    const isInBarBox = e.plugin === 'claudopus' && isBarBox(e.element)
    if (isInBarBox && (e.origin.kind === 'person' || barBoxAt === 0)) barBoxAt = await $.clock.now()
    if (e.origin.kind === 'person' && (e.plugin === 'claudopus' || e.plugin === undefined)) {
      // A press begins with the focus moving onto the button: from then the panel holds still for it (engage)
      if (e.plugin === 'claudopus') await engage($)
      // A button the person put the focus on holds the panel's drawing until it is pressed (PRESS_HOLD)
      if (e.plugin === 'claudopus' && isTypedBox(e.element)) holdTimes($)
      else freeTimes($)
      // after the let-go above, whose own drawing would end the hold
      // and so does a button of the bar above the prompt on the desktop, which is redrawn as often (band.tsx)
      const isBarButton = e.plugin === 'claudopus' && e.component === 'AbovePrompt' && barIds.get('desktop') === e.requestId && !isBarBox(e.element)
      // and a button of a tab of the mod's on the desktop, such as Settings' Reset, which every drawing of the panel draws again too
      const isTabButton = e.plugin === 'claudopus' && heldTabs.has(e.requestId ?? '') && !isTypedBox(e.element)
      if ((e.plugin === 'claudopus' && e.requestId === LIST && listSurface === 'desktop' && !isTypedBox(e.element)) || isBarButton || isTabButton) await holdForPress($)
      else pressFrom = 0
      if (!isInBarBox) barBoxAt = 0
    }
    return next(e)
  })
  // The person scrolling the panel or a Details tab is using it: what moves on its own waits (engage)
  on('ui.scroll', async ($, e, next) => {
    if (e.origin.kind === 'person' && (e.requestId === LIST || e.requestId.startsWith(WORK_PANE) || e.requestId.startsWith(FLOW_PANE))) await engage($)
    // Every move is let through as it comes. The app's own moves back to a box that holds the cursor in a pane arrive here as the
    // person's, already drawn: refusing them only undid each one a moment later, a bounce worse than the pull (0.2.135, taken out).
    // The reply box is drawn in the bar above the prompt instead, where there is nothing to pull (asking.tsx, repliesInBar)
    return next(e)
  }).catch(($, e, next) => next(e))
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

