// Above the prompt: the small octopus while work runs

const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and nothing of what it is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const cards = await read($, todos)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    if (!working.length && !happy) return next(e)

    const ui = $.ui.resolve(e)
    const { Box, Text } = ui

    // What the work that last said something is doing, in a few whole words: the to-do it is on (a to-do is written in a few
    // words), else its title. Never cut with an ellipsis: the band is one line
    const latest = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')
    const [lead] = [...working].sort((a, b) => (latest(b)?.at ?? b.startedAt) - (latest(a)?.at ?? a.startedAt))
    const doing = lead ? lead.items.find(item => item.state === 'doing')?.text || lead.title || 'Working' : '✓ Finished'
    const others = working.length - 1

    return (
      <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work') ?? <Text dimColor>•••</Text>}
        <Box flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{oneLine(doing)}</Text>
        </Box>
        {others > 0 ? (
          <Box flexShrink={0}>
            <Text dimColor>{`· +${others} more`}</Text>
          </Box>
        ) : null}
      </Box>
    )
  })

}

