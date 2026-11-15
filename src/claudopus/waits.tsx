// Above the prompt, over the figures: everything that waits on the person, each with its own answers, the same things as at the top of
// the panel and answered through the same presses (answerAsk, answerGate), so an answer in one shows in the other in the same drawing
// and an ask is never answered twice. A press here draws the row green in place, with the same lines, as the panel's box turns green;
// it leaves a moment later. A key or password is typed only in the panel's box, and another chat's ask only in its own chat: here each
// is its line and the press that shows it

// What waits, as the bar draws it. `id` is the row's own and stays the same from waiting to answered, so the row keeps its place.
// `ask` and `gate` are what it asked, kept once it is answered so the row keeps its lines; `card` only while it can be answered
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
  ask?: NonNullable<Todo['ask']>
  gate?: Gate
  cardId?: string
  // When an answered row leaves the bar
  until?: number
}
// How long a row answered here stays green before it leaves; the panel's box keeps saying it for longer
const BAR_ANSWERED = 5000
// How many rows show before "and N more"; opened, how many at most, the rest being at the top of the panel
const BAR_ROWS = 3
const BAR_ROWS_OPEN = 8
// A command is allowed from the bar only when it is drawn whole: at most this long and this many lines, or opened in its row
const BAR_COMMAND = 240
const BAR_COMMAND_LINES = 3
// What each surface's bar has open, by `${surface}|${row}`, and the surfaces whose "and N more" is open: the app's bar and the
// terminal's are drawn apart, and an opening in one never opens, or unlocks an Allow in, the other
const barOpen = new Set<string>()
const barAll = new Set<string>()
// Where each row first stood, so an answered row keeps its place among the rest; and what it asked, so it keeps its lines
const barAt = new Map<string, number>()
const barSeen = new Map<string, { ask?: NonNullable<Todo['ask']>; gate?: Gate }>()
// The answered rows whose leaving is set, by `${row}@${until}`
const barTimed = new Set<string>()
// The lines each row's answers took in the terminal while it waited: answered, what was said takes as many, so nothing moves
const barTail = new Map<string, number>()
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
        barSeen.set(id, { ask })
        const line = sentLine(one, at)
        const failed = line.startsWith('Not sent') ? (line.includes('Press it again') ? 'not sent, press it again' : 'not sent: that Mac could not be reached, answer it in its own chat') : ''
        rows.push({ id, at: placed(id, ask.at), kind: 'ask', who: titleOf(one), what: oneLine(ask.text), state: isActingOnReply(one) ? 'acting' : 'waits', card: one, ask, cardId: one.id, ...(failed ? { failed } : {}), ...(isActingOnReply(one) ? { said: line } : {}) })
      } else {
        const sent = heldAnswer(one, at)
        if (sent?.askAt !== undefined && (sent.to === 'sending' || at - sent.at < BAR_ANSWERED)) {
          const id = `ask-${one.id}-${sent.askAt}`
          const seen = barSeen.get(id)?.ask
          rows.push({ id, at: placed(id, sent.askAt), kind: 'ask', who: titleOf(one), what: oneLine(sent.ask), state: 'answered', said: sentLine(one, at) || `✓ You answered “${cut(sent.text, 60)}”`, cardId: one.id, ...(seen ? { ask: seen } : {}), ...(sent.to === 'sending' ? {} : { until: sent.at + BAR_ANSWERED }) })
        }
      }
    }
    for (const gate of one.admins ?? []) {
      const id = `gate-${gate.id}`
      barSeen.set(id, { gate })
      rows.push({ id, at: placed(id, gate.at), kind: 'gate', who: titleOf(one), what: gateWhat(gate), state: 'waits', gate, cardId: one.id })
    }
  }
  for (const gate of looseGates.filter(one => !gatePressed.has(one.id))) {
    const id = `gate-${gate.id}`
    barSeen.set(id, { gate })
    rows.push({ id, at: placed(id, gate.at), kind: 'gate', who: gateKind(gate), what: gateWhat(gate), state: 'waits', gate })
  }
  // A gate just pressed: what was done, green, or grey once refused, in the row where it waited, with the lines it had
  for (const note of doneNotes.filter(one => one.id.startsWith('gate-') && at - one.at < BAR_ANSWERED && barAt.has(one.id))) {
    if (rows.some(row => row.id === note.id)) continue
    const card = note.card ? all.find(one => one.id === note.card) : undefined
    const seen = barSeen.get(note.id)?.gate
    rows.push({ id: note.id, at: barAt.get(note.id) ?? note.at, kind: 'gate', who: card ? titleOf(card) : seen ? gateKind(seen) : note.head, what: seen ? gateWhat(seen) : note.head, state: note.isOn ? 'answered' : 'refused', said: note.said, until: note.at + BAR_ANSWERED, ...(seen ? { gate: seen } : {}), ...(note.card ? { cardId: note.card } : {}) })
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
  for (const id of [...barAt.keys()]) {
    if (rows.some(row => row.id === id) || doneNotes.some(note => note.id === id && at - note.at < BAR_ANSWERED)) continue
    barAt.delete(id)
    barSeen.delete(id)
    for (const key of [...barOpen]) if (key.endsWith(`|${id}`)) barOpen.delete(key)
    for (const key of [...barTimed]) if (key.startsWith(`${id}@`)) barTimed.delete(key)
    barTail.delete(id)
  }
  // Newest first; asked in the same moment, the one listed later first, as the panel orders them
  return rows.map((row, n) => ({ row, n })).sort((a, b) => b.row.at - a.row.at || b.n - a.n).map(one => one.row)
}

// Whether a gate's whole command is drawn in its row on this surface: short enough, or opened there (never in the terminal, whose
// row has no room for it)
// Counted at a few cells under the width, as words wrap before the edge
const commandLines = (text: string, columns: number) => text.split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / Math.max(20, columns - 8))), 0)
const isCommandWhole = (gate: Gate, surface: string, row: string, columns: number) => {
  if (gate.kind === 'release') return true
  const text = gate.command ?? ''
  if (!text) return false
  if (surface !== 'terminal' && barOpen.has(`${surface}|${row}`)) return true
  return text.length <= BAR_COMMAND && commandLines(text, columns) <= BAR_COMMAND_LINES
}
// The answers a row offers: an ask's own (Done and Not now when it gave none), a gate's three. A gate whose command is not drawn whole
// offers only Deny, so it is never allowed unseen: a file change's command is what it writes
type BarAnswer = { label: string; choice?: string; said?: GateSaid }
const barAnswers = (row: BarWait, surface: string, columns: number): BarAnswer[] => {
  if (row.state !== 'waits') return []
  if (row.kind === 'ask' && row.card?.ask) return (row.card.ask.choices?.length ? row.card.ask.choices : DEFAULT_ANSWERS).map(choice => ({ label: choice, choice }))
  if (row.kind === 'gate' && row.gate && gateHeld.has(row.gate.id)) {
    const gate = row.gate
    const isSeen = isCommandWhole(gate, surface, row.id, columns)
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
const barToggle = ($: EngineInterface, key: string) => {
  presses += 1
  if (barOpen.has(key)) barOpen.delete(key)
  else barOpen.add(key)
  $.ui.invalidate('ui.render')
}
const barMore = ($: EngineInterface, surface: string, isOpen: boolean) => {
  presses += 1
  if (isOpen) barAll.add(surface)
  else barAll.delete(surface)
  $.ui.invalidate('ui.render')
}

// The second line of a gate's row: what it runs or writes, whole, as on its box in the panel; a release names its branch and folder.
// Not whole: the start of it, and where it is seen whole
const gateSecond = (gate: Gate, surface: string, row: string, columns: number) =>
  gate.kind === 'release'
    ? `Branch ${gate.branch ?? ''}${gate.folder ? ` from ${shortPath(gate.folder)}` : ''}`
    : !gate.command
      ? 'What it is is shown only on its own Mac'
      : isCommandWhole(gate, surface, row, columns)
        ? gate.command
        : `${cut(oneLine(gate.command), 70)} · ${surface === 'terminal' ? 'see it whole in the panel before you allow it' : `open it to see all ${gate.command.length} characters before you allow it`}`

// The rows on a surface that draws native buttons: each an outlined box, amber while it waits, green once answered. A Button there
// takes one line of text, so a row keeps its height when its answers go
const barDesktop = ($: EngineInterface, ui: Ui, rows: BarWait[], surface: RenderSurface, columns: number) => {
  const { Box, Button, Text } = ui
  const isAll = barAll.has(surface)
  const shown = rows.slice(0, isAll ? BAR_ROWS_OPEN : BAR_ROWS)
  const rest = rows.length - shown.length
  const row = (one: BarWait) => {
    const openKey = `${surface}|${one.id}`
    const isOpen = barOpen.has(openKey)
    const color = one.state === 'waits' ? NEEDS : one.state === 'acting' ? LIVE : one.state === 'answered' ? DONE : undefined
    const ask = one.kind === 'ask' && one.state === 'waits' ? one.card?.ask : undefined
    // Opened and then answered: the same opened lines, what was said in place of the reply box
    const askShown = one.kind === 'ask' && one.state !== 'acting' ? (ask ?? one.ask) : undefined
    const answers = barAnswers(one, surface, columns)
    const second = one.kind === 'gate' && one.gate ? gateSecond(one.gate, surface, one.id, columns) : ''
    const canOpen = Boolean(ask) || (one.kind === 'gate' && one.state === 'waits') || (isOpen && Boolean(askShown))
    const isGate = one.kind === 'gate'
    return (
      <Box key={`bar-${one.id}`} flexDirection="column" borderStyle="round" borderColor={color} borderDimColor={!color} paddingX={1} flexShrink={0}>
        <Box key={`bar-${one.id}-line`} flexDirection="row" alignItems="center" gap={1}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end">
              {/* Not sent: said first, then whose it is; the question is whole once the row is opened */}
              {one.failed ? <Text color={NEEDS}>{`${upperFirst(one.failed)} · `}</Text> : null}
              <Text dimColor>{isGate && one.state === 'waits' ? one.who : `${one.who} · `}</Text>
              {isGate && one.state === 'waits' ? null : one.state === 'waits' || one.state === 'acting' ? <Text color={color} bold>{one.what}</Text> : <Text color={color} dimColor={!color} bold>{one.said ?? ''}</Text>}
            </Text>
          </Box>
          <Box flexDirection="row" gap={1} flexShrink={0}>
            {answers.map((answer, n) => <Button key={`bar-${one.id}-answer-${n}-${loadMark}`} label={answer.label} onPress={() => barAnswer($, one, answer)} />)}
            {one.kind === 'box' || one.kind === 'there' ? <Button key={`bar-${one.id}-show`} label={one.kind === 'box' ? 'Type it in the panel' : 'Show'} plain hover={{ scope: `bar-${one.id}-show`, underline: true }} onPress={() => void barShow($, one)} /> : null}
            {canOpen ? <Button key={`bar-${one.id}-more`} label={isOpen ? 'Less' : 'More'} plain dimColor hover={{ scope: `bar-${one.id}-more`, underline: true }} onPress={() => barToggle($, openKey)} /> : null}
          </Box>
        </Box>
        {/* A gate says what it wants on a line of its own, whole, beside nothing that could cut where it runs */}
        {isGate ? (
          <Box key={`bar-${one.id}-what`}>
            <Text color={one.state === 'waits' ? NEEDS : undefined} dimColor={one.state !== 'waits'} bold={one.state === 'waits'} wrap="wrap">{one.what}</Text>
          </Box>
        ) : null}
        {/* What it runs, whole and wrapped when it can be allowed here; answered, the same lines, dim */}
        {second ? (
          <Box key={`bar-${one.id}-command`}>
            <Text mono dimColor={one.state !== 'waits'} wrap="wrap">{second}</Text>
          </Box>
        ) : null}
        {/* Opened: the whole of it, as on its card, with the box for a reply in words */}
        {isOpen && askShown ? barAskOpen($, ui, one, askShown, surface, !ask) : null}
        {isOpen && one.kind === 'gate' && one.state === 'waits' ? (
          <Box key={`bar-${one.id}-open`} flexDirection="row" gap={1}>
            <Text dimColor wrap="wrap">{one.gate?.kind === 'release' ? 'Allow: this branch is merged into main, checked and pushed. Deny: nothing is released, and the work is told.' : one.gate?.kind === 'file' ? 'Allow: the change is made as shown. Deny: the file stays as it is, and the work is told.' : 'Allow: it runs as shown. Deny: it does not run, and the work is told.'}</Text>
            <Button key={`bar-${one.id}-card`} label="Show its card in the panel" plain hover={{ scope: `bar-${one.id}-card`, underline: true }} onPress={() => void barShow($, one)} />
          </Box>
        ) : null}
      </Box>
    )
  }
  return (
    <Box key="bar-waits" flexDirection="column" flexShrink={0}>
      {shown.map(row)}
      {rest > 0 || isAll ? (
        <Box key="bar-waits-more" flexDirection="row" gap={2} height={1} overflow="hidden">
          {rest > 0 && !isAll ? <Button key="bar-waits-all" plain hover={{ scope: 'bar-waits-all', underline: true }} onPress={() => barMore($, surface, true)}><Text color={NEEDS} bold>{`and ${rest} more waiting`}</Text></Button> : null}
          {rest > 0 && isAll ? <Button key="bar-waits-panel" plain hover={{ scope: 'bar-waits-panel', underline: true }} onPress={() => void barShow($, { id: '', at: 0, kind: 'box', who: '', what: '', state: 'waits' })}><Text color={NEEDS} bold>{`${rest} more at the top of the panel`}</Text></Button> : null}
          {isAll ? <Button key="bar-waits-fewer" label="Show fewer" plain dimColor hover={{ scope: 'bar-waits-fewer', underline: true }} onPress={() => barMore($, surface, false)} /> : null}
        </Box>
      ) : null}
    </Box>
  )
}

// An ask's row opened: its whole question, what it is about, what to copy, its pictures on its card, and a box to reply in words
const barAskOpen = ($: EngineInterface, ui: Ui, row: BarWait, ask: NonNullable<Todo['ask']>, surface: RenderSurface, isDone: boolean) => {
  const cardId = row.cardId ?? ''
  const { Box, Button, Text } = ui
  return (
    <Box key={`bar-${row.id}-open`} flexDirection="column" gap={1} paddingTop={1}>
      <Text key={`bar-${row.id}-text`} color={isDone ? undefined : NEEDS} dimColor={isDone} bold={!isDone} wrap="wrap">{ask.text}</Text>
      {ask.details ? <Text key={`bar-${row.id}-details`} wrap="wrap">{ask.details.length <= 600 ? ask.details : `${cut(ask.details, 600)} The rest is on its card.`}</Text> : null}
      {ask.copy ? (
        <Box key={`bar-${row.id}-copy`} flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text mono wrap="wrap">{ask.copy}</Text>
          </Box>
          <Button key={`bar-${row.id}-copy-${presses}`} label={copiedKey === cardId ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, cardId, ask.copy ?? '', press.surface)} />
        </Box>
      ) : null}
      <Box key={`bar-${row.id}-links`} flexDirection="row" gap={2}>
        {ask.pictures?.length ? <Text dimColor>{`${ask.pictures.length === 1 ? 'A picture' : `${ask.pictures.length} pictures`} on its card`}</Text> : null}
        <Button key={`bar-${row.id}-card`} label="Show its card in the panel" plain hover={{ scope: `bar-${row.id}-card`, underline: true }} onPress={() => void barShow($, row)} />
      </Box>
      {isDone ? (
        <Text key={`bar-${row.id}-replied`} dimColor wrap="truncate-end">{row.said ?? ''}</Text>
      ) : 'Input' in ui && surface !== 'terminal' && row.card ? (
        <Box width="100%" flexDirection="column">
          <ui.Input
            key={`bar-${row.id}-reply-${replies.get(cardId) ?? 0}`}
            placeholder="Or reply in your own words"
            submitLabel="send"
            onInput={() => holdTimes($)}
            onSubmit={value => void (freeTimes($), value.trim() && row.card ? answerAsk($, row.card, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
          />
        </Box>
      ) : null}
    </Box>
  )
}

// The lines a row takes in the terminal: its line, a gate's command, an ask's two notes, then its answers (or, answered, what was
// said in their place), wrapped at the band's width
const termLines = (row: BarWait, columns: number, answers: BarAnswer[]) => {
  const second = row.kind === 'gate' && row.gate ? commandLines(gateSecond(row.gate, 'terminal', row.id, columns), columns - 4) : 0
  const notes = row.kind === 'ask' && row.state !== 'acting' ? Number(Boolean(row.ask?.details)) + Number(Boolean(row.ask?.copy)) : 0
  const tail = Math.max(answers.length ? Math.max(1, Math.ceil((4 + answers.reduce((n, a) => n + a.label.length + 6, 0)) / Math.max(20, columns - 8))) : 1, barTail.get(row.id) ?? 1)
  if (answers.length) barTail.set(row.id, tail)
  // A gate's line wraps whole, so where it runs is never cut
  const head = row.kind === 'gate' ? Math.max(1, Math.ceil((row.who.length + 2 + row.what.length) / Math.max(20, columns - 8))) : 1
  return head + second + notes + tail
}
// The rows in the terminal: a line each, its answers numbered under it. A bare digit typed in an empty prompt presses a band's Button,
// and a message may begin with one, so the first press only picks the answer and says so; the same digit again sends it. Numbers run
// on from row to row, up to nine. Rows are shown while they fit in the band above the prompt with the figures' line and the hint;
// the rest are counted
const barTerminal = ($: EngineInterface, ui: Ui, rows: BarWait[], columns: number, maxRows: number, reserved: number) => {
  const { Box, Button, Text } = ui
  // The figures' line, the hint and what band.tsx draws under the rows keep theirs
  const budget = Math.max(1, maxRows - 2 - reserved)
  let used = 0
  let digit = 0
  const numbered: { row: BarWait; answers: (BarAnswer & { n: number })[] }[] = []
  for (const row of rows) {
    const answers = barAnswers(row, 'terminal', columns)
    const lines = termLines(row, columns, answers)
    if (numbered.length && used + lines > budget) break
    used += lines
    numbered.push({ row, answers: answers.map(answer => ({ ...answer, n: digit < 9 ? (digit += 1) : 0 })) })
  }
  const rest = rows.length - numbered.length
  const pickedAnswer = numbered.flatMap(one => one.answers.map(answer => ({ ...answer, id: `${one.row.id}:${answer.label}` }))).find(answer => barPick && answer.id === barPick.id && answer.n === barPick.n)
  // The hint stays while a row answered here is still shown, so the bar keeps its height until the row leaves
  const hasHint = rest > 0 || numbered.some(one => one.answers.length || one.row.state === 'answered' || one.row.state === 'refused')
  const hasAnswers = numbered.some(one => one.answers.length)
  return (
    <Box key="bar-waits" flexDirection="column">
      {numbered.map(({ row, answers }) => {
        const color = row.state === 'waits' ? NEEDS : row.state === 'acting' ? LIVE : row.state === 'answered' ? DONE : undefined
        const second = row.kind === 'gate' && row.gate ? gateSecond(row.gate, 'terminal', row.id, columns) : ''
        const isDone = row.state === 'answered' || row.state === 'refused'
        return (
          <Box key={`bar-${row.id}`} flexDirection="column">
            <Text wrap={row.kind === 'gate' ? 'wrap' : 'truncate-end'}>
              {row.failed ? <Text color={NEEDS}>{`${upperFirst(row.failed)} · `}</Text> : null}
              <Text dimColor>{`${row.who}: `}</Text>
              <Text color={isDone ? undefined : color} dimColor={isDone} bold={!isDone}>{cut(row.what, Math.max(40, columns * 2))}</Text>
            </Text>
            {second ? (
              <Box key={`bar-${row.id}-command`} paddingLeft={4}>
                <Text dimColor wrap="wrap">{second}</Text>
              </Box>
            ) : null}
            {/* The chat's notice with what it is about went to this chat */}
            {row.kind === 'ask' && row.state !== 'acting' && row.ask?.details ? <Text key={`bar-${row.id}-details`} dimColor wrap="truncate-end">    What it is about is in the chat above and on its card</Text> : null}
            {row.kind === 'ask' && row.state !== 'acting' && row.ask?.copy ? <Text key={`bar-${row.id}-copy`} dimColor={isDone} wrap="truncate-end">{`    ${oneLine(row.ask.copy)}`}</Text> : null}
            {answers.length ? (
              <Box key={`bar-${row.id}-answers`} flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                {answers.map(answer => (answer.n ? <Button key={`bar-${row.id}-answer-${answer.n}-${loadMark}`} label={answer.label} plain hotkey={String(answer.n)} onPress={() => barPress($, row, answer, answer.n)} /> : null))}
              </Box>
            ) : (
              <Box key={`bar-${row.id}-said`} flexDirection="column">
                <Text color={isDone ? color : undefined} dimColor={!isDone || !color} bold={isDone && Boolean(color)} wrap="truncate-end">
                  {`    ${isDone || row.state === 'acting' ? row.said ?? '' : row.kind === 'box' ? 'Type it in the panel: /claudopus, then ctrl+x Tab' : row.kind === 'there' ? 'Answer it in its own chat' : row.kind === 'gate' ? 'Allow or deny it on its card' : ''}`}
                </Text>
                {/* As many lines as its answers took, so the bar keeps its height until the row leaves */}
                {Array.from({ length: Math.max(0, (barTail.get(row.id) ?? 1) - 1) }, (_, n) => <Text key={`bar-${row.id}-said-${n}`}> </Text>)}
              </Box>
            )}
          </Box>
        )
      })}
      {hasHint ? (
        <Text key="bar-waits-hint" dimColor={!pickedAnswer} color={pickedAnswer ? NEEDS : undefined} wrap="truncate-end">
          {pickedAnswer ? `Press ${pickedAnswer.n} again to answer “${pickedAnswer.label}”` : [rest > 0 ? `${rest} more waiting in the panel` : '', hasAnswers || !rest ? 'press its number twice in the empty prompt · /claudopus to reply in words' : ''].filter(Boolean).join(' · ')}
        </Text>
      ) : null}
    </Box>
  )
}

// The rows, or nothing when nothing waits. Each answered row is drawn again when its moment is over, once
const barWaitsDrawn = async ($: EngineInterface, ui: Ui, e: { surface: RenderSurface; props: { bodyColumns: number; maxRows: number } }, reserved = 0) => {
  const at = await $.clock.now()
  const rows = await barWaits($, at)
  for (const row of rows) {
    if (row.until === undefined || !Number.isFinite(row.until) || barTimed.has(`${row.id}@${row.until}`)) continue
    barTimed.add(`${row.id}@${row.until}`)
    $.clock.after(Math.max(0, row.until - at) + 50, () => $.ui.invalidate('ui.render'))
  }
  if (!rows.length) return null
  return e.surface === 'terminal' ? barTerminal($, ui, rows, e.props.bodyColumns, e.props.maxRows, reserved) : barDesktop($, ui, rows, e.surface, e.props.bodyColumns)
}
