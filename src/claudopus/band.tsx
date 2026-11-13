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
    const ui = uiOf($, e)
    const { Box, Button, Text } = ui

    // In the terminal the panel is out of the keys' reach until ctrl+x Tab, and a narrow one seats no panel until it is asked for:
    // there what needs the person is said here, every chat's, with its answers numbered. A bare digit typed in an empty prompt
    // presses a band's Button, so one key answers it from where the person already is
    if (e.surface === 'terminal') {
      const asking = [...cards.filter(one => !one.parentId && one.ask), ...cardsOf(await read($, others)).filter(one => one.ask && !answeredHere.has(`${one.id}:${one.ask.at}`))]
      const [first] = asking
      const ask = first?.ask
      if (first && ask) {
        const answers = (ask.choices?.length ? ask.choices : DEFAULT_ANSWERS).slice(0, 9)
        return (
          <Box flexDirection="column">
            <Box flexDirection="row" gap={1} height={1} overflow="hidden">
              {octopus(ui, 'band-mark', 'asking', BAND_MARK, 'Claudopus, something needs you', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text color={NEEDS} bold wrap="truncate-end">{oneLine(ask.text)}</Text>
              </Box>
            </Box>
            {ask.copy ? <Text key="band-ask-copy" wrap="truncate-end">{`    ${oneLine(ask.copy)}`}</Text> : null}
            <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
              {answers.map((choice, n) => (
                <Button key={`band-ask-${first.id}-${ask.at}-${n}`} label={choice} plain hotkey={String(n + 1)} onPress={() => void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))} />
              ))}
              <Text dimColor>{`type the number${asking.length > 1 ? ` · ${asking.length - 1} more waiting` : ''} · /claudopus to reply in words`}</Text>
            </Box>
          </Box>
        )
      }
    }
    if (!working.length && !happy) return next(e)
    // A narrow terminal seats no panel until it is asked for: the band says how
    const isPanelAway = e.surface === 'terminal' && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)

    // What the work that last said something is doing, in a few whole words: the to-do it is on (a to-do is written in a few
    // words), else its title. Never cut with an ellipsis: the band is one line
    const latest = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')
    const [lead] = [...working].sort((a, b) => (latest(b)?.at ?? b.startedAt) - (latest(a)?.at ?? a.startedAt))
    const doing = lead ? lead.items.find(item => item.state === 'doing')?.text || lead.title || 'Working' : '✓ Finished'
    const more = working.length - 1

    return (
      <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
        <Box flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{oneLine(doing)}</Text>
        </Box>
        {more > 0 ? (
          <Box flexShrink={0}>
            <Text dimColor>{`· +${more} more`}</Text>
          </Box>
        ) : null}
        {isPanelAway ? (
          <Box flexShrink={0}>
            <Text dimColor>· /claudopus shows the panel</Text>
          </Box>
        ) : null}
      </Box>
    )
  })

}

