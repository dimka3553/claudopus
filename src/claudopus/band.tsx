// Above the prompt: the small octopus while work runs, and how Claude uses this computer

// How long an answer picked above the prompt by its number waits for the same number again
const BAND_PICK = 6000
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
const BAND_TERM_MARK = 3
const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const cards = await read($, todos)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    const ui = uiOf($, e)
    const { Box, Text } = ui

    // What waits on the person, each with its answers, above the figures: the same as at the top of the panel, answered the same way
    const waits = await barWaitsDrawn($, ui, e)
    if (!working.length && !happy) return waits ?? next(e)
    // A narrow terminal seats no panel until it is asked for: the band says how
    const isPanelAway = e.surface === 'terminal' && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)

    // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
    // network's speed, looked at every few seconds while work runs. New figures redraw it
    await read($, figuresAt)
    const figures = usageNow(await $.clock.now())
    if (!figures) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))

    const drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null
    const row = (
      <Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
        {figures ? (drawn ?? <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
        {/* The figures fill a phone's terminal: the hint shows until they come */}
        {isPanelAway && !figures ? (
          <Box flexShrink={0}>
            <Text dimColor>· /claudopus shows the panel</Text>
          </Box>
        ) : null}
      </Box>
    )
    // Where the figures are drawn, a pointer resting on one shows its card above them; the bar grows upward, so the figures stay put
    return (drawn && figures) || waits ? (
      <Box flexDirection="column">
        {waits}
        {drawn && figures ? usageCardsDrawn(ui, figures) : null}
        {row}
      </Box>
    ) : (
      row
    )
  })

}

