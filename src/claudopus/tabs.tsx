// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own

const tabHooks = (on: On) => {

  // In a chat the app runs on another Mac over ssh, every press that reaches the engine is one line in the log: which button, how long
  // since the panel was last drawn, and the tabs as the engine lists them, so a press that did nothing shows whether it arrived at all
  on('ui.press', async ($, e, next) => {
    if (isRunFromAfar && e.plugin === 'claudopus') await log($, `press ${e.element} in ${e.requestId} (${e.surface}), panel drawn ${drawnNow ? (await $.clock.now()) - drawnNow : -1} ms ago; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
    const r = await next(e)
    // An answer the press gave to work that had ended starts it again from here, inside the press's own hook (sendWakes)
    if (e.plugin === 'claudopus' && (answersOnWay.size || wakes.length)) await sendWakes($, true).catch(err => log($, `answer not sent: ${String(err)}`))
    return r
  })
  // and so does a reply typed in a card's box
  on('ui.input', async ($, e, next) => {
    const r = await next(e)
    if (e.plugin === 'claudopus' && e.kind === 'submit' && (answersOnWay.size || wakes.length)) await sendWakes($, true).catch(err => log($, `reply not sent: ${String(err)}`))
    return r
  })

  // The reports, in a pane of their own
  on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    const kept = await read($, reports)
    // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
    const line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)))
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportsView($, $.ui.resolve(e), kept, await $.clock.now(), line)}
      </Box>
    )
  })

  // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
  on('ui.render', { component: 'Pane', requestId: STATS_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    void statsRead($, statsShown.scope).catch(() => undefined)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {statsView(() => $.ui.invalidate('ui.render'), $.ui.resolve(e), await $.clock.now(), scope => void statsRead($, scope).catch(() => undefined), e.surface, e.props.bodyColumns * 7.4 - 32)}
      </Box>
    )
  })

  // About, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, async ($, e) => {
    const ui = $.ui.resolve(e)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {configView(ui, await configShown($), configActs($), band, presses, dir)}
      </ui.Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await aboutView($, $.ui.resolve(e))}
      </Box>
    )
  })

  // A picture opened large, in a chat the app runs on another Mac over ssh
  on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await pictureView($, e)}
      </Box>
    )
  })

  // A report opened as a pane of its own, named after it
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith('report-')) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const kept = await read($, reports)
    const r = kept.find(one => paneOf(one) === e.requestId)
    if (!r) return <Text dimColor>This result is no longer kept.</Text>
    if (!reportText.has(r.id)) reportText.set(r.id, await readOr($, `${reportPath(r)}/report.md`))
    const at = Math.min(Math.max(0, pictureAt.get(paneOf(r)) ?? 0), Math.max(0, r.files.length - 1))
    const file = r.files[at] ?? ''
    const picture = e.surface === 'terminal' ? null : RASTER.test(file) ? await thumbOf($, thumbPath(r, file)) : /\.svg$/i.test(file) ? await svgOf($, `${reportPath(r)}/${file}`) : null
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportShown($, $.ui.resolve(e), r, reportText.get(r.id) || 'This result has no text.', kept, await $.clock.now(), at, picture)}
      </Box>
    )
  })

}

