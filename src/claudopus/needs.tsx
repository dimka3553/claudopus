// Everything that waits for the person: one record, one list of them for a card, and one drawing

// A need is one thing the person is asked: a permission (an admin command, a release, a change to a file of theirs, Claude Code's
// own prompt, a command Claude Code blocked), a task's own question, a password, or a key. Whatever holds it underneath (the admin
// gate, the app's prompt, a runner's request file, the task's `ask`), it is read into this one record: its kind, the one amber
// line that asks, what it is about, the command or code shown whole, its buttons, and what each press does. needBlock draws it,
// the same on a task's card, in its Details, and at the top of the panel for one that belongs to no task
type NeedKind = 'permission' | 'question' | 'password' | 'key'
type NeedButton = { key: string; label: string; onPress: (press: { surface: string }) => void; isPlain?: boolean; hotkey?: string }
// `from`: whose it is, said beside its kind when it is not on its task's card. `card`: the card whose question it is, for its
// pictures, its Copy and its Open in Terminal. `where`: where it is answered when no press here answers it. `said`: what went wrong
// with what was last typed for it. `field`: the one field it keeps where the bar above the chat draws none (the terminal).
// `isActing`: a question the person answered in words, which its task is acting on: in the task's purple, with nothing to press
type Need = {
  id: string
  kind: NeedKind
  at: number
  text: string
  from?: string
  details?: string
  command?: string
  card?: Todo
  where?: string
  said?: string
  line?: string
  buttons: NeedButton[]
  extra?: (ui: Ui) => JSX.Element | null
  field?: { key: string; placeholder: string; value?: string; isFocused?: boolean; onInput: (value: string) => void; onSubmit: (value: string) => void }
  isActing?: boolean
}
const NEED_LABEL: Record<NeedKind, string> = { permission: 'Permission', question: 'Question', password: 'Password', key: 'Key' }

// A task's own question, or the command Claude Code blocked it from running
const askNeed = ($: EngineInterface, one: Todo, surface: string, now: number): Need | undefined => {
  const ask = one.ask
  if (!ask) return undefined
  const id = `ask-${one.id}`
  const line = sentLine(one, now)
  const base = { id, at: ask.at, text: ask.text, ...(ask.details ? { details: ask.details } : {}), ...(ask.copy ? { command: ask.copy } : {}), card: one, ...(line ? { line } : {}) }
  // Another chat's is answered only in its own chat: no file carries an answer there
  const elsewhere = one.chat ? `Answer it in its own chat, “${one.chat.title || 'another chat'}”${one.chat.host ? `, on ${one.chat.host}` : ''}.` : ''
  if (ask.refused) {
    const run = offeredRun(one)
    return {
      ...base,
      kind: 'permission',
      ...(elsewhere ? { where: elsewhere } : {}),
      buttons: elsewhere
        ? []
        : [
            ...(run ? [{ key: `${id}-allow-${ask.at}-${loadMark}`, label: ALLOW, onPress: () => void runIt($, one).catch(err => log($, `refused command not run: ${String(err)}`)) }] : []),
            { key: `${id}-deny-${ask.at}-${loadMark}`, label: DONT_ALLOW, onPress: () => void ((presses += 1), answerAsk($, one, DONT_ALLOW).catch(err => log($, `answer not sent: ${String(err)}`))) },
          ],
    }
  }
  if (isActingOnReply(one)) return { ...base, kind: 'question', isActing: true, buttons: [] }
  if (elsewhere) return { ...base, kind: 'question', where: elsewhere, buttons: [] }
  const mark = askMark(ask)
  const inBar = repliesInBar(surface)
  const send = (value: string) => void (value.trim() && (dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`))))
  return {
    ...base,
    kind: 'question',
    buttons: [
      ...(ask.choices ?? []).map((choice, n) => ({ key: `${id}-choice-${n}-${mark}-${loadMark}`, label: choice, onPress: () => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`))) })),
      // The last answer opens the box above the chat for this card, and closes it again
      ...(inBar ? [isReplyOpen(one) ? { key: `${id}-inbar-close-${presses}`, label: 'Close', isPlain: true, onPress: (press: { surface: string }) => openBar($, undefined, press.surface) } : { key: `${id}-inbar-${presses}`, label: ANSWER_IN_WORDS, isPlain: true, onPress: (press: { surface: string }) => openBar($, { kind: 'answer', id: one.id, one }, press.surface) }] : []),
    ],
    // Where the bar draws no field, the block has the one field itself
    ...(inBar
      ? {}
      : {
          field: {
            key: `${id}-reply-${replies.get(one.id) ?? 0}-${mark}`,
            placeholder: ANSWER_IN_WORDS,
            value: draftShown(one.id, ask),
            onInput: (value: string) => void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($)),
            onSubmit: send,
          },
        }),
  }
}

// A permission the admin gate holds: an admin command, a release, a change to a file of the person's, or one it undid
const gateNeed = ($: EngineInterface, gate: Gate, card: string, elsewhere: boolean, from = ''): Need => {
  const id = `gate-${gate.id}`
  const isHeld = gateHeld.has(gate.id) && !elsewhere
  const details = gate.isUndone
    ? `${gate.isOutside ? 'Something outside the panel changed this file, maybe you in an editor' : 'A command wrote to this file'}, so the change was undone. ${ALLOW} makes it again. Either way the changed text is kept beside the file as a .put-back copy.`
    : gate.kind === 'release'
      ? `Branch ${gate.branch ?? ''}${gate.folder ? ` · from ${shortPath(gate.folder)}` : ''}`
      : gate.isWork
        ? `${ALLOW} also covers this task's next admin commands.`
        : !gate.command
          ? 'Its details show only on its own Mac.'
          : ''
  return {
    id,
    kind: 'permission',
    at: gate.at,
    text: gateWhat(gate),
    ...(from ? { from } : {}),
    ...(details ? { details } : {}),
    ...(gate.kind !== 'release' && gate.command ? { command: gate.command } : {}),
    ...(isHeld ? {} : { where: elsewhere ? 'Allow it on its card in its own chat.' : "It's no longer waiting for you." }),
    buttons: isHeld
      ? [
          { key: `${id}-once-${loadMark}`, label: ALLOW, onPress: () => answerGate($, gate, 'once', card) },
          { key: `${id}-deny-${loadMark}`, label: DONT_ALLOW, onPress: () => answerGate($, gate, 'deny', card) },
          // (a release and a change to a file are asked each time)
          ...(gate.kind ? [] : [{ key: `${id}-always-${loadMark}`, label: ALWAYS_ALLOW, isPlain: true, onPress: () => answerGate($, gate, 'always', card) }]),
        ]
      : [],
  }
}

// Claude Code's own prompt: a call to allow, answered here while this chat holds it; its question or its plan, answered in its own box
const promptNeed = ($: EngineInterface, p: Prompt, c?: Shared, isOnCard = false): Need => {
  const id = `prompt-${c ? `${c.host}-${c.chat}-` : 'this-'}${p.id}`
  const isHeld = !c && Boolean(p.isHeld) && promptHeld.has(p.id) && p.kind !== 'question' && p.kind !== 'plan'
  const url = c ? pressOf(c) : ''
  const where = c
    ? `Answer it in the chat “${chatName(c)}”${c.host ? (url ? `, which runs on ${macName(c.host)}` : `, on ${macName(c.host)}`) : ''}.`
    : p.kind === 'question'
      ? 'Pick your answer in the box at the bottom of this chat.'
      : 'Answer it in the box at the bottom of this chat.'
  const press = (said: 'yes' | 'no') => () => void (answerPrompt($, p.id, said), redraw($))
  return {
    id,
    kind: p.kind === 'allow' || !p.kind ? 'permission' : 'question',
    at: p.at,
    text: p.text,
    ...(isOnCard ? {} : { from: p.title || (c ? '' : 'This chat') }),
    ...(p.about ? { details: p.about } : {}),
    ...(p.detail ? { command: p.detail } : {}),
    ...(isHeld ? {} : { where }),
    buttons: isHeld
      ? [
          { key: `${id}-yes-${presses}`, label: ALLOW, onPress: press('yes') },
          { key: `${id}-no-${presses}`, label: DONT_ALLOW, onPress: press('no') },
        ]
      : c && url
        ? [{ key: `${id}-open-${presses}`, label: 'Open chat', onPress: () => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`))) }]
        : [],
  }
}

// A password or key a command waits for: typed in the box above the chat, never in the panel, where that bar draws a field
const boxNeed = ($: EngineInterface, one: Asked, surface: string, canFocus = false): Need => {
  const id = `box-${one.id}`
  const inBar = repliesInBar(surface)
  const isKey = one.kind === 'key'
  const mode: BoxMode = (inBar ? undefined : boxModes.get(one.id)) ?? 'key'
  const isOpen = Boolean(barOpen && isBoxKind(barOpen.kind) && barOpen.id === one.id)
  const close = { key: `${id}-close-${boxPresses}`, label: 'Close', isPlain: true, onPress: (press: { surface: string }) => openBar($, undefined, press.surface) }
  const refuse = { key: `${id}-cancel-${boxPresses}`, label: isKey ? DONT_GIVE : DONT_ALLOW, onPress: () => void cancelBox($, one.id) }
  // The admin command it is for, as the person allowed it; a key's command is the task's own and is not shown again
  const command = isKey ? '' : (adminCalls(one.command ?? '', $.plugin.root)[0]?.command ?? '')
  return {
    id,
    kind: one.kind,
    at: one.at,
    text: one.text,
    details: one.details,
    ...(command ? { command } : {}),
    ...(boxSaid.get(one.id) && !isOpen ? { said: boxSaid.get(one.id) } : {}),
    ...(isOpen || !boxHeldReply.has(one.id) ? {} : { extra: (ui: Ui) => heldReplyButtons($, ui, one.id, 'box') }),
    buttons: inBar
      ? isOpen
        ? [close, refuse]
        : [
            { key: `${id}-paste-${boxPresses}`, label: isKey && one.name ? PASTE_IT : TYPE_IT, onPress: (press: { surface: string }) => openBar($, { kind: barKindOf(one, 'key'), id: one.id }, press.surface) },
            refuse,
            ...(isKey ? [{ key: `${id}-respond-${boxPresses}`, label: ANSWER_IN_WORDS, isPlain: true, onPress: (press: { surface: string }) => openBar($, { kind: 'words', id: one.id }, press.surface) }] : []),
          ]
      : [
          refuse,
          ...(isKey ? [{ key: `${id}-mode-${boxPresses}`, label: mode === 'reply' ? (one.name ? PASTE_IT : TYPE_IT) : ANSWER_IN_WORDS, isPlain: true, onPress: () => void (boxModes.set(one.id, mode === 'reply' ? 'key' : 'reply'), boxHeldReply.delete(one.id), boxSaid.delete(one.id), (boxPresses += 1), drawAgain($)) }] : []),
        ],
    ...(inBar
      ? {}
      : {
          field: {
            key: `${id}-field-${mode === 'reply' ? 'reply-' : ''}${boxTries.get(one.id) ?? 0}`,
            placeholder: mode === 'reply' ? 'Type your answer' : isKey && one.name ? 'Paste it here' : 'Type it here',
            ...(canFocus ? { isFocused: true } : {}),
            onInput: (value: string) => void ((value ? boxTyped.add(one.id) : boxTyped.delete(one.id)), holdTimes($)),
            onSubmit: (value: string) => submitBox($, one.id, mode, value),
          },
        }),
  }
}

// The needs of one card, in the order they came: its own question, the permissions held for its commands, and, for this chat's
// own cards, Claude Code's prompts for its calls and the password and key boxes of its commands
// The box whose field takes the keys where a block has its own (the terminal): this chat's own first request
const firstBox = () => [...boxes.filter(box => box.chat === boxChat), ...boxes.filter(box => box.chat !== boxChat)][0]
const needsOf = ($: EngineInterface, one: Todo, surface: string, now: number, canFocus = false): Need[] => {
  const ask = askNeed($, one, surface, now)
  const own = one.chat ? [] : [...waiting.filter(p => p.card === one.id).map(p => promptNeed($, p, undefined, true)), ...boxes.filter(box => box.card === one.id).map(box => boxNeed($, box, surface, canFocus && box === firstBox()))]
  const gates = (one.admins ?? []).filter(gate => !gatePressed.has(gate.id)).map(gate => gateNeed($, gate, one.chat ? '' : one.id, Boolean(one.chat)))
  return [...(ask ? [ask] : []), ...gates, ...own].sort((a, b) => a.at - b.at)
}
// The needs that belong to no card drawn here: the chat's own thread's, a task's whose card is not shown, and other chats' prompts
const looseNeeds = ($: EngineInterface, surface: string, shown: (card: string | undefined) => boolean, chats: Shared[], canFocus = false): Need[] => {
  return [
    ...boxes.filter(box => !shown(box.card)).map(box => boxNeed($, box, surface, canFocus && box === firstBox())),
    ...looseGates.filter(gate => !gatePressed.has(gate.id)).map(gate => gateNeed($, gate, '', false, 'This chat')),
    ...waiting.filter(p => !shown(p.card)).map(p => promptNeed($, p)),
    ...chats.flatMap(c => (c.prompts ?? []).map(p => promptNeed($, p, c))),
  ].sort((a, b) => a.at - b.at)
}

// The one drawing: an outlined amber block; a small dim label of its kind; the question in amber; what it is about; the command
// in a row of its own, whole; then its buttons. `isWhole`: in Details, where nothing is cut. `pictures`: the question's own
// pictures, drawn by the pane (it keeps how much of them one drawing holds)
const needBlock = ($: EngineInterface, ui: Ui, need: Need, opts: { isWhole?: boolean; isCompact?: boolean; room?: number; surface?: string; pictures?: JSX.Element | null; autoFocus?: boolean } = {}) => {
  const { isWhole = false, room = 80 } = opts
  const one = need.card
  const ask = one?.ask
  const Link = (ui as Ui & { Link: ElementTable['Link'] }).Link
  const copyButton = one && ask?.copy && !ask.refused ? <ui.Button key={`ask-${one.id}-copy-${presses}`} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, one.id, ask.copy ?? '', press.surface)} /> : null
  const terminalButton = one && ask && !ask.refused && canOpenTerminal(one) ? <ui.Button key={`${need.id}-terminal-${presses}`} label={openedKey === `${one.id}:${ask.at}:${ask.copy}` ? '✓ Typed, not run yet' : 'Open in Terminal'} plain onPress={() => void openTerminal($, one).catch(err => log($, `terminal not opened: ${String(err)}`))} /> : null
  return (
    // (compact, in the terminal's bar above the prompt, which has a few rows: no outline and no gaps)
    <ui.Box key={`need-${need.id}`} flexDirection="column" flexShrink={0} {...(opts.isCompact ? {} : { gap: 1, borderStyle: 'round' as const, borderColor: need.isActing ? LIVE : NEEDS, paddingX: 1 })}>
      <ui.Text dimColor wrap="truncate-end">{`${NEED_LABEL[need.kind]}${need.from ? ` · ${need.from}` : ''}`}</ui.Text>
      {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
      <ui.Text wrap="wrap" color={need.isActing ? LIVE : NEEDS} bold>{withLinks(Link, isWhole ? need.text : cut(need.text, Math.round(room * 1.6)), `${need.id}-text`, need.text)}</ui.Text>
      {/* What it is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
      {need.details ? (
        <ui.Box key={`${need.id}-details`} flexDirection="column" minWidth={0}>
          <ui.Markdown text={isWhole || need.details.length <= DETAILS_ON_CARD ? need.details : `${cut(need.details, DETAILS_ON_CARD)}\n\nThe rest is in its Details.`} />
        </ui.Box>
      ) : null}
      {opts.pictures ?? null}
      {need.command ? (
        <ui.Box flexDirection="column" backgroundColor={FILL} paddingLeft={2}>
          <ui.Box flexDirection="row" alignItems="center" gap={1}>
            <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
              <ui.Text mono wrap="wrap">{withLinks(Link, need.command, `${need.id}-copy`)}</ui.Text>
            </ui.Box>
            {/* A question's code or command is copied with one press */}
            {copyButton && !terminalButton ? copyButton : null}
          </ui.Box>
          {/* A command to type also opens in Terminal, typed and not run: with it, the two are under the command, which keeps its width */}
          {terminalButton ? (
            <ui.Box flexDirection="row" gap={1}>
              {copyButton}
              {terminalButton}
            </ui.Box>
          ) : null}
        </ui.Box>
      ) : null}
      {need.where ? <ui.Text key={`${need.id}-where`} dimColor wrap="wrap">{need.where}</ui.Text> : null}
      {need.said ? <ui.Text key={`${need.id}-said`} color={NEEDS} wrap="wrap">{need.said}</ui.Text> : null}
      {need.extra?.(ui) ?? null}
      {/* The one field a block keeps where the bar above the chat draws none */}
      {need.field && 'Input' in ui ? (
        <ui.Box width="100%" flexDirection="column">
          <ui.Input
            key={need.field.key}
            placeholder={need.field.placeholder}
            {...(need.field.value === undefined ? {} : { value: need.field.value })}
            {...(opts.surface === 'terminal' ? {} : { rows: BOX_ROWS })}
            submitLabel="Send"
            autoFocus={opts.autoFocus || need.field.isFocused ? true : undefined}
            onInput={need.field.onInput}
            onSubmit={need.field.onSubmit}
          />
        </ui.Box>
      ) : null}
      {need.buttons.length ? (
        <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
          {need.buttons.map((button, n) => (
            <ui.Button key={button.key} label={button.label} {...(button.isPlain ? { plain: true } : n === 0 ? { variant: 'primary' as const } : {})} {...(button.hotkey ? { hotkey: button.hotkey } : {})} onPress={button.onPress} />
          ))}
        </ui.Box>
      ) : null}
      {/* What was last pressed or typed for it, while it is still there: a reply that left it open, an answer that did not go */}
      {need.line ? <ui.Text key={`${need.id}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{need.line}</ui.Text> : null}
    </ui.Box>
  )
}
