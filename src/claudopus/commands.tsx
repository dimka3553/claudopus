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
    // Where the person's focus last moved in the mod's panes: a press on the desktop counts only on a button it just moved onto (pressSeen)
    if (e.origin.kind === 'person' && e.plugin === 'claudopus') {
      const timed = focusMoved(e.element, e.requestId)
      timed(await $.clock.now())
    }
    if (e.origin.kind === 'person' && (e.plugin === 'claudopus' || e.plugin === undefined)) {
      // A press begins with the focus moving onto the button: from then the panel holds still for it (engage)
      if (e.plugin === 'claudopus') await engage($)
      if (e.plugin === 'claudopus' && isTypedBox(e.element)) holdTimes($)
      else freeTimes($)
    }
    return next(e)
  })
  // The person scrolling the panel or a Details tab is using it: what moves on its own waits (engage)
  on('ui.scroll', async ($, e, next) => {
    // Scrolled by anyone, the app's own pull back to a focused box too, what is under the pointer moved: a press on an ask's answer
    // that lands within STEADY of it does not count (answerPress)
    paneMoved(e.requestId, await $.clock.now())
    if (e.origin.kind === 'person' && (e.requestId === LIST || e.requestId.startsWith(WORK_PANE) || e.requestId.startsWith(FLOW_PANE))) await engage($)
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

