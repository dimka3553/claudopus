// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own

const tabHooks = (on: On) => {

  // In a chat the app runs on another Mac over ssh, every press that reaches the engine is one line in the log: which button, how long
  // since the panel was last drawn, and the tabs as the engine lists them, so a press that did nothing shows whether it arrived at all
  on('ui.press', async ($, e, next) => {
    if (isRunFromAfar && e.plugin === 'claudopus') await log($, `press ${e.element} in ${e.requestId} (${e.surface}), panel drawn ${drawnNow ? (await $.clock.now()) - drawnNow : -1} ms ago; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
    // In the terminal a tab the press opens or closes is opened or closed here, by this hook's handle (tabmoves.ts)
    // A press is the person's own move: a panel held while they type is let go before the press acts, so what it does shows
    if (e.plugin === 'claudopus') (freeTimes($), (freshness += 1), await engage($))
    const isTerminal = e.plugin === 'claudopus' && e.surface === 'terminal'
    if (isTerminal) tabMoves.begin()
    let r: Awaited<ReturnType<typeof next>>
    try {
      r = await next(e)
    } finally {
      if (isTerminal) await tabMoves.finish(move => runTabMove($, move), ms => $.clock.sleep(ms))
    }
    // An answer the press gave to work that had ended starts it again from here, inside the press's own hook (sendWakes)
    if (e.plugin === 'claudopus' && (answersOnWay.size || wakes.length)) await sendWakes($, true).catch(err => log($, `answer not sent: ${String(err)}`))
    return r
  })
  // and so does a reply typed in a card's box
  on('ui.input', async ($, e, next) => {
    const r = await next(e)
    if (e.plugin !== 'claudopus' || e.kind !== 'submit') return r
    // Two replies to ended work went from the timer with no sign of why: each submit says here what it found on its way
    void log($, `reply submitted: ${answersOnWay.size} answer(s) and ${wakes.length} wake(s) on the way`)
    if (answersOnWay.size || wakes.length) await sendWakes($, true).catch(err => log($, `reply not sent: ${String(err)}`))
    return r
  })

  // The reports, in a pane of their own
  on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    const kept = await read($, reports)
    // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
    const line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)))
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportsView($, uiOf($, e), kept, await $.clock.now(), line, e.props.scroll.bodyRows)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
  on('ui.render', { component: 'Pane', requestId: STATS_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    void statsRead($, statsShown.scope).catch(() => undefined)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {statsView(() => drawAgain($), uiOf($, e), await $.clock.now(), scope => void statsRead($, scope).catch(() => undefined), e.surface, e.props.bodyColumns * 7.4 - 32)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // About, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, async ($, e) => {
    const ui = uiOf($, e)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {configView(ui, await configShown($), configActs($), band, presses, dir)}
      </ui.Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await aboutView($, uiOf($, e), e.surface)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // The changelog, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CHANGELOG_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await changelogView($, uiOf($, e), e.surface)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // A picture opened large, in a chat the app runs on another Mac over ssh
  on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await pictureView($, e)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // A report opened as a pane of its own, named after it
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith('report-')) return next(e)
    const { Box, Text } = uiOf($, e)
    const kept = await read($, reports)
    const r = kept.find(one => paneOf(one) === e.requestId)
    if (!r) return <Text dimColor>This result is no longer kept.</Text>
    if (!reportText.has(r.id)) reportText.set(r.id, await readOr($, `${reportPath(r)}/report.md`))
    const at = Math.min(Math.max(0, pictureAt.get(paneOf(r)) ?? 0), Math.max(0, r.files.length - 1))
    const file = r.files[at] ?? ''
    const picture = e.surface === 'terminal' ? null : RASTER.test(file) ? await thumbOf($, thumbPath(r, file)) : /\.svg$/i.test(file) ? await svgOf($, `${reportPath(r)}/${file}`) : null
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportShown($, uiOf($, e), r, reportText.get(r.id) || 'This result has no text.', kept, await $.clock.now(), at, picture, e.props.scroll.bodyRows)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}


// ---- Tabs the app would leave saying "Nothing to show yet" ----

// The app asks a tab for its drawing once, as it shows it, and again only when told the drawing changed. One ask that comes back
// empty (the chat could not be reached that moment, or the drawing failed) leaves the tab empty until then, and a tab that reads
// nothing that changes, as Stats, About or a result, is never told. So each ask is noted, and a tab open but not asked for since it
// opened, since this code loaded, or since it came in front, is drawn again after 2, 6, 15 and 40 seconds until it is asked for. A
// redraw tells the app to ask every tab it shows, so it reaches one the engine has never drawn as well
const TAB_CHECKS = [2_000, 6_000, 15_000, 40_000]
const tabAsked = new Map<string, number>()
const tabFails = new Map<string, number[]>()
let tabInFront = ''
const noteTabAsked = async ($: EngineInterface, id: string | undefined) => {
  if (id) tabAsked.set(id, await $.clock.now())
}
// `since`: how long before now an ask already counts, for a tab seen in front a moment after the app asked for it
const watchTabs = async ($: EngineInterface, ids: string[], why: string, since = 0) => {
  if (!ids.length) return
  const from = (await $.clock.now()) - since
  for (const wait of TAB_CHECKS)
    $.clock.after(wait, async () => {
      const open = new Set((await $.ui.panes().catch(() => [])).map(pane => pane.id))
      const empty = ids.filter(id => open.has(id) && (tabAsked.get(id) ?? 0) < from)
      if (!empty.length) return
      drawAgain($)
      if (wait === TAB_CHECKS.at(-1)) await log($, `tab ${empty.join(', ')} not asked for in ${wait / 1000}s after ${why}: drawn again`)
    })
}
// As this code loads: the tab in front where the engine says which it is, else every tab open (a tab behind the others is never
// asked for, so it costs four redraws and no more)
const watchLoaded = async ($: EngineInterface) => {
  const panes = await $.ui.panes().catch(() => [])
  const shown = panes.filter(pane => pane.isShown)
  // the tab in front is watched here, not again by the first look each second
  tabInFront = shown[0]?.id ?? ''
  await watchTabs($, (shown.length ? shown : panes).map(pane => pane.id), 'this code loaded')
}
// Each second: a tab the person brought in front
const watchFront = async ($: EngineInterface) => {
  const front = (await $.ui.panes().catch(() => [])).find(pane => pane.isShown)?.id ?? ''
  if (front === tabInFront) return
  tabInFront = front
  if (front) await watchTabs($, [front], 'it came in front', 2_000)
}
// A tab whose drawing failed shows why, in place of nothing, and is asked for again in a few seconds: three times a minute at most
const tabFailed = async ($: EngineInterface, e: Parameters<EngineInterface['ui']['resolve']>[0] & { requestId?: string }, error: { kind: string; message?: string } | undefined) => {
  const id = e.requestId ?? ''
  const now = await $.clock.now()
  const fails = [...(tabFails.get(id) ?? []).filter(at => now - at < 60_000), now]
  tabFails.set(id, fails)
  const why = error?.kind === 'timeout' ? 'It took too long to draw.' : (error?.message ?? '').replace(/^\w*Error:\s*/, '') || 'No reason was given.'
  await log($, `tab ${id} not drawn (${error?.kind ?? 'unknown'}): ${why}`)
  const isAgain = fails.length < 3
  if (isAgain) await watchTabs($, [id], 'its drawing failed')
  const { Box, Text } = uiOf($, e)
  return (
    <Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>
      <Text bold>This tab could not be drawn</Text>
      <Text dimColor wrap="wrap">{cut(why, 300)}</Text>
      <Text dimColor wrap="wrap">{isAgain ? 'Trying again in a few seconds.' : 'It failed three times in a minute. Open it again to try once more.'}</Text>
    </Box>
  )
}
