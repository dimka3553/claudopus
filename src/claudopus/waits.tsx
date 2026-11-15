// Above the prompt, over the figures: everything that waits on the person, each with its own answers, the same things as at the top of
// the panel and answered through the same presses (answerAsk, answerGate), so an answer in one shows in the other in the same drawing
// and an ask is never answered twice. A press here draws the row green in place, as the panel's box turns green; it leaves a moment
// later. A key or password is typed only in the panel's box, and another chat's ask only in its own chat: here each is its line and
// the press that shows it

// What waits, as the bar draws it. `id` is the row's own and stays the same from waiting to answered, so the row keeps its place
type BarWait = {
  id: string
  at: number
  kind: 'ask' | 'gate' | 'box' | 'there'
  who: string
  what: string
  state: 'waits' | 'acting' | 'answered' | 'refused'
  said?: string
  failed?: string
  card?: Todo
  gate?: Gate
  cardId?: string
}
// How long a row answered here stays green before it leaves; the panel's box keeps saying it for longer
const BAR_ANSWERED = 5000
// How many rows show before "and N more"; opened, how many at most, the rest being at the top of the panel
const BAR_ROWS = 3
const BAR_ROWS_OPEN = 8
// A command longer than this is never allowed from the bar: its whole text shows only once its row is opened
const BAR_COMMAND = 240
// The rows the person opened to read in full, and whether "and N more" is open
const barOpen = new Set<string>()
let barAll = false
// Where each row first stood, so an answered row keeps its place among the rest
const barAt = new Map<string, number>()
// The answer picked in the terminal by its number, which the same number again sends
let barPick: { id: string; n: number } | undefined

// Everything that waits, newest first: this chat's work's asks and gates, gates with no card, key boxes, then what other chats ask
const barWaits = async ($: EngineInterface, at: number): Promise<BarWait[]> => {
  const all = (await read($, todos)).map(asPressed)
  const rows: BarWait[] = []
  const placed = (id: string, since: number) => (barAt.has(id) ? (barAt.get(id) ?? since) : (barAt.set(id, since), since))
  for (const one of all) {
    if (one.chat) continue
    // Its ask: waiting, acted on after a reply in words, or answered a moment ago (green)
    if (!one.parentId) {
      const ask = one.ask
      if (ask) {
        const id = `ask-${one.id}-${ask.at}`
        const line = sentLine(one, at)
        rows.push({ id, at: placed(id, ask.at), kind: 'ask', who: titleOf(one), what: oneLine(ask.text), state: isActingOnReply(one) ? 'acting' : 'waits', card: one, cardId: one.id, ...(line.startsWith('Not sent') ? { failed: line } : {}), ...(isActingOnReply(one) ? { said: line } : {}) })
      } else {
        const sent = heldAnswer(one, at)
        if (sent?.askAt !== undefined && (sent.to === 'sending' || at - sent.at < BAR_ANSWERED)) {
          const id = `ask-${one.id}-${sent.askAt}`
          rows.push({ id, at: placed(id, sent.askAt), kind: 'ask', who: titleOf(one), what: oneLine(sent.ask), state: 'answered', said: sentLine(one, at) || `✓ You answered “${cut(sent.text, 60)}”`, cardId: one.id })
        }
      }
    }
    for (const gate of one.admins ?? []) {
      const id = `gate-${gate.id}`
      rows.push({ id, at: placed(id, gate.at), kind: 'gate', who: titleOf(one), what: gateWhat(gate), state: 'waits', gate, cardId: one.id })
    }
  }
  for (const gate of looseGates.filter(one => !gatePressed.has(one.id))) {
    const id = `gate-${gate.id}`
    rows.push({ id, at: placed(id, gate.at), kind: 'gate', who: gateKind(gate), what: gateWhat(gate), state: 'waits', gate })
  }
  // A gate just pressed: what was done, green, or grey once refused, in the row where it waited
  for (const note of doneNotes.filter(one => one.id.startsWith('gate-') && at - one.at < BAR_ANSWERED && barAt.has(one.id))) {
    if (rows.some(row => row.id === note.id)) continue
    const card = note.card ? all.find(one => one.id === note.card) : undefined
    rows.push({ id: note.id, at: barAt.get(note.id) ?? note.at, kind: 'gate', who: card ? titleOf(card) : note.head, what: note.head, state: note.isOn ? 'answered' : 'refused', said: note.said, ...(note.card ? { cardId: note.card } : {}) })
  }
  for (const box of boxes) rows.push({ id: `box-${box.id}`, at: placed(`box-${box.id}`, box.at), kind: 'box', who: box.key ? 'Admin password' : 'Key', what: boxHead(box.text), state: 'waits' })
  // What other chats ask is answered in their own chat: its line, and the press that shows it in the panel
  for (const c of await read($, others)) {
    for (const one of cardsOf([c]).filter(needsPerson)) {
      const id = `there-${c.host}-${c.chat}-${one.id}`
      rows.push({ id, at: placed(id, one.ask?.at ?? Math.max(0, ...(one.admins ?? []).map(gate => gate.at))), kind: 'there', who: `${titleOf(one)} · ${chatName(c)}`, what: one.ask ? oneLine(one.ask.text) : 'Wants your press on its card', state: 'waits', cardId: one.id })
    }
    for (const p of c.prompts ?? []) {
      const id = `there-${c.host}-${c.chat}-prompt-${p.id}`
      rows.push({ id, at: placed(id, p.at), kind: 'there', who: chatName(c), what: oneLine(p.text || p.title || 'Asks you something'), state: 'waits' })
    }
  }
  // A row gone for good is let go of, so a new one in its place starts where it comes
  for (const id of [...barAt.keys()]) if (!rows.some(row => row.id === id) && !doneNotes.some(note => note.id === id)) (barAt.delete(id), barOpen.delete(id))
  // Newest first; asked in the same moment, the one listed later first, as the panel orders them
  return rows.map((row, n) => ({ row, n })).sort((a, b) => b.row.at - a.row.at || b.n - a.n).map(one => one.row)
}

// The answers a row offers: an ask's own (Done and Not now when it gave none), a gate's three. A gate whose command is too long to
// show whole in a row offers only Deny until the row is opened, so it is never allowed unseen
type BarAnswer = { label: string; choice?: string; said?: GateSaid }
const barAnswers = (row: BarWait): BarAnswer[] => {
  if (row.state !== 'waits') return []
  if (row.kind === 'ask' && row.card?.ask) return (row.card.ask.choices?.length ? row.card.ask.choices : DEFAULT_ANSWERS).map(choice => ({ label: choice, choice }))
  if (row.kind === 'gate' && row.gate && gateHeld.has(row.gate.id)) {
    const gate = row.gate
    const isSeen = (gate.command ?? '').length <= BAR_COMMAND || barOpen.has(row.id)
    return [
      ...(isSeen ? [{ label: gate.isWork ? 'Allow for this work' : 'Allow once', said: 'once' as const }] : []),
      ...(isSeen && !gate.kind ? [{ label: 'Always allow', said: 'always' as const }] : []),
      { label: 'Deny', said: 'deny' as const },
    ]
  }
  return []
}
// A press on one: the same call the panel's own button makes, so the first press anywhere is the one answer
const barAnswer = ($: EngineInterface, row: BarWait, answer: BarAnswer) => {
  if (answer.choice !== undefined && row.card) return void ((presses += 1), answerAsk($, row.card, answer.choice).catch(err => log($, `answer not sent: ${String(err)}`)))
  if (answer.said && row.gate) answerGate($, row.gate, answer.said, row.cardId ?? '')
}
// In the terminal the first press of a number picks the answer and says so; the same number again sends it
const barPress = ($: EngineInterface, row: BarWait, answer: BarAnswer, n: number) => {
  const id = `${row.id}:${answer.label}`
  if (barPick?.id === id && barPick.n === n) return void ((barPick = undefined), barAnswer($, row, answer))
  const pick = (barPick = { id, n })
  $.ui.invalidate('ui.render')
  // Left alone, the pick is let go
  $.clock.after(BAND_PICK, () => void (barPick === pick && ((barPick = undefined), $.ui.invalidate('ui.render'))))
}

// Shows the row's card, or the top of the panel, opening the panel when it is closed
const barShow = async ($: EngineInterface, row: BarWait) => {
  presses += 1
  if (!(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)) await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened: ${String(err)}`))
  const to = row.cardId && row.kind !== 'box' ? { key: `todo-${row.cardId}` } : 'start'
  await $.ui.scroll(to === 'start' ? { in: LIST, to: 'start', block: 'start' } : { in: LIST, to, block: 'start' }).catch(() => $.ui.scroll({ in: LIST, to: 'start', block: 'start' }).catch(() => undefined))
}
const barToggle = ($: EngineInterface, id: string) => {
  presses += 1
  if (barOpen.has(id)) barOpen.delete(id)
  else barOpen.add(id)
  $.ui.invalidate('ui.render')
}

// The second line of a gate's row: what it runs, whole, as on its box in the panel; a release names its branch and folder
const gateSecond = (gate: Gate, isOpen: boolean) =>
  gate.kind === 'release' ? `Branch ${gate.branch ?? ''}${gate.folder ? ` from ${shortPath(gate.folder)}` : ''}` : gate.kind === 'file' ? '' : (gate.command ?? '').length <= BAR_COMMAND || isOpen ? (gate.command ?? '') : `${cut(oneLine(gate.command ?? ''), 90)} · open it to see all ${(gate.command ?? '').length} characters before you allow it`

// The rows on a surface that draws native buttons: each an outlined box, amber while it waits, green once answered
const barDesktop = ($: EngineInterface, ui: Ui, rows: BarWait[], surface: RenderSurface) => {
  const { Box, Button, Text } = ui
  const shown = rows.slice(0, barAll ? BAR_ROWS_OPEN : BAR_ROWS)
  const rest = rows.length - shown.length
  const row = (one: BarWait) => {
    const isOpen = barOpen.has(one.id)
    const color = one.state === 'waits' ? NEEDS : one.state === 'acting' ? LIVE : one.state === 'answered' ? DONE : undefined
    const ask = one.kind === 'ask' && one.state === 'waits' ? one.card?.ask : undefined
    const answers = barAnswers(one)
    const second = one.kind === 'gate' && one.gate ? gateSecond(one.gate, isOpen) : ''
    const canOpen = Boolean(ask) || (one.kind === 'gate' && one.state === 'waits')
    return (
      <Box key={`bar-${one.id}`} flexDirection="column" borderStyle="round" borderColor={color} borderDimColor={!color} paddingX={1} flexShrink={0}>
        <Box key={`bar-${one.id}-line`} flexDirection="row" alignItems="center" gap={1}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end">
              <Text dimColor>{`${one.who}${one.failed ? ' · not sent, press it again' : ''} · `}</Text>
              {one.state === 'waits' || one.state === 'acting' ? <Text color={color} bold>{one.what}</Text> : <Text color={color} dimColor={!color} bold>{one.said ?? ''}</Text>}
            </Text>
          </Box>
          <Box flexDirection="row" gap={1} flexShrink={0}>
            {answers.map((answer, n) => <Button key={`bar-${one.id}-answer-${n}-${loadMark}`} label={answer.label} onPress={() => barAnswer($, one, answer)} />)}
            {one.kind === 'box' || one.kind === 'there' ? <Button key={`bar-${one.id}-show`} label={one.kind === 'box' ? 'Type it in the panel' : 'Show'} plain hover={{ scope: `bar-${one.id}-show`, underline: true }} onPress={() => void barShow($, one)} /> : null}
            {canOpen ? <Button key={`bar-${one.id}-more`} label={isOpen ? 'Less' : 'More'} plain dimColor hover={{ scope: `bar-${one.id}-more`, underline: true }} onPress={() => barToggle($, one.id)} /> : null}
          </Box>
        </Box>
        {second ? <Text key={`bar-${one.id}-command`} mono dimColor={one.state !== 'waits'} wrap={isOpen ? 'wrap' : 'truncate-end'}>{second}</Text> : null}
        {/* Opened: the whole of it, as on its card, with the box for a reply in words */}
        {isOpen && ask && one.card ? barAskOpen($, ui, one, one.card, ask, surface) : null}
        {isOpen && one.kind === 'gate' && one.state === 'waits' ? (
          <Box key={`bar-${one.id}-open`} flexDirection="row" gap={1}>
            <Text dimColor wrap="wrap">{one.gate?.kind === 'release' ? 'Allow: this branch is merged into main, checked and pushed. Deny: nothing is released, and the work is told.' : 'Allow: it runs as shown. Deny: it does not run, and the work is told.'}</Text>
            <Button key={`bar-${one.id}-card`} label="Its card" plain hover={{ scope: `bar-${one.id}-card`, underline: true }} onPress={() => void barShow($, one)} />
          </Box>
        ) : null}
      </Box>
    )
  }
  return (
    <Box key="bar-waits" flexDirection="column" flexShrink={0}>
      {shown.map(row)}
      {rest > 0 || barAll ? (
        <Box key="bar-waits-more" flexDirection="row" gap={2} height={1} overflow="hidden">
          {rest > 0 && !barAll ? <Button key="bar-waits-all" plain hover={{ scope: 'bar-waits-all', underline: true }} onPress={() => void ((presses += 1), (barAll = true), $.ui.invalidate('ui.render'))}><Text color={NEEDS} bold>{`and ${rest} more waiting`}</Text></Button> : null}
          {rest > 0 && barAll ? <Button key="bar-waits-panel" plain hover={{ scope: 'bar-waits-panel', underline: true }} onPress={() => void barShow($, { id: '', at: 0, kind: 'box', who: '', what: '', state: 'waits' })}><Text color={NEEDS} bold>{`${rest} more at the top of the panel`}</Text></Button> : null}
          {barAll ? <Button key="bar-waits-fewer" label="Show fewer" plain dimColor hover={{ scope: 'bar-waits-fewer', underline: true }} onPress={() => void ((presses += 1), (barAll = false), $.ui.invalidate('ui.render'))} /> : null}
        </Box>
      ) : null}
    </Box>
  )
}

// An ask's row opened: its whole question, what it is about, what to copy, its pictures on its card, and a box to reply in words
const barAskOpen = ($: EngineInterface, ui: Ui, row: BarWait, one: Todo, ask: NonNullable<Todo['ask']>, surface: RenderSurface) => {
  const { Box, Button, Text } = ui
  return (
    <Box key={`bar-${row.id}-open`} flexDirection="column" gap={1} paddingTop={1}>
      {oneLine(ask.text) !== ask.text || ask.text.length > 80 ? <Text key={`bar-${row.id}-text`} color={NEEDS} bold wrap="wrap">{ask.text}</Text> : null}
      {ask.details ? <Text key={`bar-${row.id}-details`} wrap="wrap">{ask.details.length <= 600 ? ask.details : `${cut(ask.details, 600)} The rest is on its card.`}</Text> : null}
      {ask.copy ? (
        <Box key={`bar-${row.id}-copy`} flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text mono wrap="wrap">{ask.copy}</Text>
          </Box>
          <Button key={`bar-${row.id}-copy-${presses}`} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, one.id, ask.copy ?? '', press.surface)} />
        </Box>
      ) : null}
      <Box key={`bar-${row.id}-links`} flexDirection="row" gap={2}>
        {ask.pictures?.length ? <Text dimColor>{`${ask.pictures.length === 1 ? 'A picture' : `${ask.pictures.length} pictures`} on its card`}</Text> : null}
        <Button key={`bar-${row.id}-card`} label="Its card" plain hover={{ scope: `bar-${row.id}-card`, underline: true }} onPress={() => void barShow($, row)} />
      </Box>
      {'Input' in ui && surface !== 'terminal' ? (
        <Box width="100%" flexDirection="column">
          <ui.Input
            key={`bar-${row.id}-reply-${replies.get(one.id) ?? 0}`}
            placeholder="Or reply in your own words"
            submitLabel="send"
            onInput={() => holdTimes($)}
            onSubmit={value => void (freeTimes($), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
          />
        </Box>
      ) : null}
    </Box>
  )
}

// The rows in the terminal: a line each, its answers numbered under it. A bare digit typed in an empty prompt presses a band's Button,
// and a message may begin with one, so the first press only picks the answer and says so; the same digit again sends it. Numbers run
// on from row to row, up to nine
const barTerminal = ($: EngineInterface, ui: Ui, rows: BarWait[], columns: number, maxRows: number) => {
  const { Box, Button, Text } = ui
  // Each row takes two lines; the figures' line and the hint keep theirs
  const room = Math.max(1, Math.min(BAR_ROWS, Math.floor((maxRows - 3) / 2)))
  const shown = rows.slice(0, barAll ? Math.max(room, Math.min(BAR_ROWS_OPEN, Math.floor((maxRows - 3) / 2))) : room)
  const rest = rows.length - shown.length
  let digit = 0
  const numbered = shown.map(row => ({ row, answers: barAnswers(row).map(answer => ({ ...answer, n: digit < 9 ? (digit += 1) : 0 })) }))
  const pickedAnswer = numbered.flatMap(one => one.answers.map(answer => ({ ...answer, id: `${one.row.id}:${answer.label}` }))).find(answer => barPick && answer.id === barPick.id && answer.n === barPick.n)
  const hasAnswers = numbered.some(one => one.answers.length)
  return (
    <Box key="bar-waits" flexDirection="column">
      {numbered.map(({ row, answers }) => {
        const color = row.state === 'waits' ? NEEDS : row.state === 'acting' ? LIVE : row.state === 'answered' ? DONE : undefined
        const second = row.kind === 'gate' && row.gate ? gateSecond(row.gate, false) : ''
        return (
          <Box key={`bar-${row.id}`} flexDirection="column">
            <Text wrap="truncate-end">
              <Text dimColor>{`${row.who}${row.failed ? ' · not sent, press it again' : ''}: `}</Text>
              <Text color={color} dimColor={!color} bold>{row.state === 'waits' || row.state === 'acting' ? cut(row.what, Math.max(40, columns * 2)) : row.said ?? ''}</Text>
            </Text>
            {second ? <Text key={`bar-${row.id}-command`} dimColor wrap="truncate-end">{`    ${second}`}</Text> : null}
            {/* The chat's notice with what it is about went to this chat */}
            {row.kind === 'ask' && row.state === 'waits' && row.card?.ask?.details ? <Text key={`bar-${row.id}-details`} dimColor wrap="truncate-end">    What it is about is in the chat above and on its card</Text> : null}
            {row.kind === 'ask' && row.state === 'waits' && row.card?.ask?.copy ? <Text key={`bar-${row.id}-copy`} wrap="truncate-end">{`    ${oneLine(row.card.ask.copy)}`}</Text> : null}
            {answers.length ? (
              <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                {answers.map(answer => (answer.n ? <Button key={`bar-${row.id}-answer-${answer.n}-${loadMark}`} label={answer.label} plain hotkey={String(answer.n)} onPress={() => barPress($, row, answer, answer.n)} /> : null))}
              </Box>
            ) : row.state === 'acting' && row.said ? (
              <Text dimColor wrap="truncate-end">{`    ${row.said}`}</Text>
            ) : row.kind === 'box' || row.kind === 'there' ? (
              <Text dimColor wrap="truncate-end">{row.kind === 'box' ? '    Type it in the panel: /claudopus, then ctrl+x Tab' : '    Answer it in its own chat'}</Text>
            ) : null}
          </Box>
        )
      })}
      {hasAnswers || rest > 0 ? (
        <Text key="bar-waits-hint" dimColor={!pickedAnswer} color={pickedAnswer ? NEEDS : undefined} wrap="truncate-end">
          {pickedAnswer ? `Press ${pickedAnswer.n} again to answer “${pickedAnswer.label}”` : `${hasAnswers ? 'press its number twice in the empty prompt · /claudopus to reply in words' : ''}${rest > 0 ? `${hasAnswers ? ' · ' : ''}${rest} more waiting in the panel` : ''}`}
        </Text>
      ) : null}
    </Box>
  )
}

// The rows, or nothing when nothing waits. Drawn again when a green row's moment is over
let barLeaves = 0
const barWaitsDrawn = async ($: EngineInterface, ui: Ui, e: { surface: RenderSurface; props: { bodyColumns: number; maxRows: number } }) => {
  const at = await $.clock.now()
  const rows = await barWaits($, at)
  if (!rows.length) return null
  const leaves = rows.filter(row => row.state === 'answered' || row.state === 'refused').length
  if (leaves && leaves !== barLeaves) $.clock.after(BAR_ANSWERED + 50, () => void ((barLeaves = 0), $.ui.invalidate('ui.render')))
  barLeaves = leaves
  return e.surface === 'terminal' ? barTerminal($, ui, rows, e.props.bodyColumns, e.props.maxRows) : barDesktop($, ui, rows, e.surface)
}
