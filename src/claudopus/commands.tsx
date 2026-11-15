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
    if (e.origin.kind === 'person' && (e.plugin === 'claudopus' || e.plugin === undefined)) {
      if (e.plugin === 'claudopus' && isTypedBox(e.element)) holdTimes($)
      else freeTimes($)
    }
    return next(e)
  })
  // A pick of the person's in the mod's panes is their own move, as a press is (tabHooks): the drawing is let go before it acts
  on('ui.select', { plugin: 'claudopus' }, async ($, e, next) => (freeTimes($), next(e)))
  // Closed by the person's own hand, it closes in every chat and stays closed until asked for; a close of the mod's own is no choice
  on('ui.close', async ($, e, next) => {
    const r = await next(e)
    if (e.id === LIST && e.origin.kind === 'person' && dir) await choosePanel($, false)
    return r
  })

  on('command.run', { command: 'servers' }, async $ => {
    await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    const opened = await $.ui.open({ id: PANE, title: PANE_TITLE })

    return { text: opened.isPlaced ? 'Servers panel opened.' : nowhere('Servers') }
  })

}

