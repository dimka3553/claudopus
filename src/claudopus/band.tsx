// Above the prompt: the small octopus while work runs

// The answer picked above the prompt by its number, and how long the pick waits for the same number again
let bandPick: { id: string; n: number } | undefined
const BAND_PICK = 6000
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
    // there what needs the person is said here, every chat's, under the name of the work that asks, whole, with its answers
    // numbered. A bare digit typed in an empty prompt presses a band's Button, so the person answers from where they already are.
    // A message may begin with a digit too, so one press only picks the answer and says so; the same digit again sends it
    if (e.surface === 'terminal') {
      // What waits on the person comes before an ask whose work is acting on their reply, which is drawn in the work's purple
      const asking = [...cards.filter(one => !one.parentId && one.ask), ...cardsOf(await read($, others)).filter(one => one.ask && !answeredHere.has(`${one.id}:${one.ask.at}`))].sort((a, b) => Number(needsPerson(b)) - Number(needsPerson(a)))
      const [first] = asking
      const ask = first?.ask
      if (first && ask) {
        const answers = (ask.choices?.length ? ask.choices : DEFAULT_ANSWERS).slice(0, 9)
        const id = `${first.id}:${ask.at}`
        const picked = bandPick?.id === id ? bandPick.n : -1
        const press = (n: number, choice: string) => {
          if (picked === n) return (bandPick = undefined), void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))
          const pick = (bandPick = { id, n })
          $.ui.invalidate('ui.render')
          // Left alone, the pick is let go
          $.clock.after(BAND_PICK, () => void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))))
        }
        return (
          <Box flexDirection="column">
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, something needs you' : 'Claudopus at work on your reply', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{`${titleOf(first)}: `}</Text>
                  <Text color={needsPerson(first) ? NEEDS : LIVE} bold>{cut(oneLine(ask.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {/* The chat's notice with what it is about went only to the chat that started the work */}
            {ask.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first) ? '    What it is about is in the chat above and on its card' : '    What it is about is on its card'}</Text> : null}
            {ask.copy ? <Text key="band-ask-copy" wrap="truncate-end">{`    ${oneLine(ask.copy)}`}</Text> : null}
            <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
              {answers.map((choice, n) => (
                <Button key={`band-ask-${first.id}-${ask.at}-${n}`} label={choice} plain hotkey={String(n + 1)} onPress={() => press(n, choice)} />
              ))}
              <Text dimColor={picked < 0} color={picked < 0 ? undefined : needsPerson(first) ? NEEDS : LIVE}>
                {picked >= 0 ? `Press ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `press its number twice in the empty prompt${asking.filter(needsPerson).length > Number(needsPerson(first)) ? ` · ${asking.filter(needsPerson).length - Number(needsPerson(first))} more waiting` : ''} · /claudopus to reply in words`}
              </Text>
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

