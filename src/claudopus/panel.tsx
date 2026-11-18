// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them

// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
// Handed to the press's own hook while one is answered (front), so a narrow terminal draws the panel opened again
const backToPanel = async ($: EngineInterface, id: string) => {
  if (tabMoves.isPressing()) return tabMoves.handOver({ kind: 'back', id })
  await backAsked($, id)
}
const backAsked = async ($: EngineInterface, id: string) => {
  await $.ui.close({ id }).catch(() => undefined)
  await $.ui.close({ id: LIST }).catch(() => undefined)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })
}
// The ask whose reply box holds the terminal's keys in the list: kept on it while it waits, so an ask that comes in above it never
// takes the keys from what the person is typing
let keysAsk = ''
// Where the list's window starts on each surface, as last drawn: above the prompt says what waits at the top once it is out of sight
// (waitMarker). Forgotten when the list is closed
const listOffsets = new Map<string, number>()
// How many things wait on the person at the top of the list, as last drawn, and what the first of them asks
let waitsAtTop = 0
let firstAtTop = ''
// Where each card that waits stands at the top of the list: the moment it first came up there, kept while it stays, so what comes
// later goes under it and nothing moves by itself (by chat and card: placeKey)
const topPlaces = new Map<string, number>()
// When each placed card stopped waiting (answered): kept in its place while something else still waits (only KEPT_MOST while what
// waits is all another chat's); one that asks again after that goes to the end, as anything new does
const topClosed = new Map<string, number>()
const KEPT_MOST = 10 * 60_000
// When each card's admin commands first came, kept once they are answered, so its answered note stays where the box was
const gatePartAt = new Map<string, number>()
// How far apart two admin commands of a card come for the second to be a part of its own: more than any batch of one step
const GATE_PART_GAP = 60_000
// The last drawing made of each pane on each surface, what a press under way keeps on screen (isPressHeld)
const lastShown = new Map<string, unknown>()
// Each pane's drawings made afresh are numbered as they are asked for: one that finishes after a newer one (the engine dropped its
// reply, as a newer ask overtook it) is never kept as the one on screen. Kept anyway, a press hold or the gap gave that stale
// drawing again, and an answered card came back and went under the pointer (16 Nov recording: 4 drawings late, 5 flips back)
const shownAsked = new Map<string, number>()
const shownKept = new Map<string, number>()
// What waited on the person and how often they had pressed, as each pane's drawing on screen was made (personSign), and when the
// drawing held for their use is next drawn afresh
const shownSigns = new Map<string, string>()
const shownAts = new Map<string, number>()
// The mod's tabs drawn on the desktop, whose buttons a click holds the drawing for (holdForPress)
const heldTabs = new Set<string>()
let usedUntil = 0
// The surface the list was last drawn on: the focus says none, and only the desktop's clicks are held for (isPressHeld)
let listSurface = ''
const panelHooks = (on: On) => {

  // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
  // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
    await noteTabAsked($, id)
    const isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(start => id.startsWith(start))
    // A tab of the mod's on the desktop, Settings, About, Results and the rest, but for a work's or a workflow's Details, which are
    // drawn with the panel below: every drawing of the panel draws it again too, so under load its buttons went as the panel's did
    // (16 Nov: Settings' Reset pressed, never reached the mod). Held the same way: given again through a click, and while its
    // drawings are slow at most every FRESH_GAP; an older drawing that finishes after a newer one is never the one on screen
    if (e.surface === 'desktop' && isTab && !id.startsWith(WORK_PANE) && !id.startsWith(FLOW_PANE)) {
      heldTabs.add(id)
      const key = `${id}|${e.surface}|${e.props.scroll.bodyRows}|${(e.props as { bodyColumns?: number }).bodyColumns ?? ''}|${e.props.scroll.offset > 0 ? 1 : 0}`
      const at = await $.clock.now()
      const recent = lastShown.get(key)
      if (recent && isPressHeld(at)) return ((isPressMissed = true), recent as Awaited<ReturnType<typeof next>>)
      // (a tab is often quick to draw on its own: slow or not, it is given again while the panel's drawings are slow, as the bar is)
      if (recent && !isTyping && isFreshTooSoon($, key, at, isPanelSlow(at))) return recent as Awaited<ReturnType<typeof next>>
      freshBegins(key)
      const askedNo = (shownAsked.get(key) ?? 0) + 1
      shownAsked.set(key, askedNo)
      const madeFrom = Date.now()
      let made: { at: number; ms: number; fresh: number } | undefined
      try {
        const drawing = await next(e)
        if ((shownKept.get(key) ?? 0) > askedNo && lastShown.has(key)) return lastShown.get(key) as typeof drawing
        shownKept.set(key, askedNo)
        lastShown.set(key, drawing)
        made = { at, ms: Date.now() - madeFrom, fresh: freshness }
        return drawing
      } finally {
        freshEnds($, key, made)
      }
    }
    if (e.surface !== 'terminal' || !isTab) return next(e)
    const { Box, Button, Text } = uiOf($, e)
    const body = await next({ ...e, props: { ...e.props, scroll: { ...e.props.scroll, bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) } } } as typeof e)
    return (
      <Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Close" plain hotkey="x" onPress={() => void backToPanel($, id).catch(err => log($, `not back to the panel: ${String(err)}`))} />
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
          <Text dimColor wrap="truncate-end">{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x then Tab to use the keys'}</Text>
        </Box>
        {body}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    // A message that waits for a hook to start a task again goes from this drawing (sendHeld)
    if (heldSends.length) await sendHeld($).catch(err => log($, `message not sent: ${String(err)}`))
    if (paneId === LIST) ((listDrawing += 1), (listSurface = e.surface))
    if (paneId === LIST) await holdTest($)
    try {
    // While the person types into a box the pane is drawn as it last was, whole, but for a change in its shape; not typing, as it last
    // was while only its running times moved, for CALM at most (heldDrawings)
    const heldKey = `${paneId}|${e.surface}|${e.props.placement ?? ''}|${e.props.scroll.bodyRows}|${(e.props as { bodyColumns?: number }).bodyColumns ?? ''}|${e.props.isFocused ? 1 : 0}|${e.props.scroll.offset > 0 ? 1 : 0}`
    const heldAt = await $.clock.now()
    if (paneId === LIST) drawnNow = heldAt
    // Drawn afresh moments ago: given again as it was, at once, and drawn afresh when the gap is over (FRESH_GAP). Never while the
    // person types, whose box keeps its own drawing below
    const shownKey = heldKey.replace(/\|[01]\|([01])$/, '|$1')
    const recent = lastShown.get(shownKey)
    // A press under way: the drawing on screen, the one last made for this pane on this surface, focused or not
    // (of this size and place: a pane resized or scrolled meanwhile is drawn afresh). Given before anything is read, so it is
    // answered at once: given after the pane's reads, it came too late under load and a newer ask dropped it
    if (recent && paneId === LIST && isPressHeld(heldAt)) return ((listHeldAt = heldAt), (isPressMissed = true), recent as Awaited<ReturnType<typeof next>>)
    // In use on the desktop: the drawing on screen, but for the person's own presses and what newly waits on them (isInUse)
    const sign = paneId === LIST && e.surface === 'desktop' ? await personSign($) : ''
    // (only a drawing made during this use: one kept from before, as of a scroll down after minutes at the top, is long out of date)
    if (recent && sign && !isTyping && isInUse(heldAt, e.props.scroll.offset) && shownSigns.get(shownKey) === sign && heldAt - (shownAts.get(shownKey) ?? 0) < ENGAGED) {
      const until = engagedAt + ENGAGED
      if (usedUntil !== until) ((usedUntil = until), $.clock.after(until - heldAt + 20, () => void (usedUntil === until && drawFresh($))))
      return ((listHeldAt = heldAt), recent as Awaited<ReturnType<typeof next>>)
    }
    if (recent && !isTyping && isFreshTooSoon($, shownKey, heldAt, false, false)) return ((paneId === LIST && (listHeldAt = heldAt)), recent as Awaited<ReturnType<typeof next>>)
    // (counted from the drawing's end: a call for a drawing it made itself, as its own count of what waits at the top, is in it)
    freshBegins(shownKey)
    const askedNo = (shownAsked.get(shownKey) ?? 0) + 1
    shownAsked.set(shownKey, askedNo)
    // (how long it takes by the wall clock: the engine's clock in a test stands still while a drawing is made)
    const madeFrom = Date.now()
    let isMade = false
    try {
    const shape = await paneShape($, paneId)
    const content = await paneContent($)
    const held = heldDrawings.get(heldKey)
    // While the mod is behind (lookHold), the pane is given as it was, so the drawing adds nothing to what holds Claude's helper
    if (held && held.shape === shape && (isTyping || (held.fresh === freshness && ((isBehind() && heldAt - held.at < BEHIND_HELD) || (held.content === content && heldAt - held.at < CALM))))) return ((paneId === LIST && (listHeldAt = heldAt)), held.drawing as Awaited<ReturnType<typeof next>>)
    if (paneId === LIST) drawnFiles.clear()
    during(paneId === LIST ? 'draw the panel' : 'draw a Details tab')
    // Read only for a drawing made afresh, so the running times alone ask for one again only once CALM is over (chatHooks)
    if (paneId === LIST) await read($, tick)
    const drawing = await (async () => {
    const { Box, Button, Markdown, Text } = uiOf($, e)
    // A picture pressed open large in this Details tab is drawn over it, with a row back above and below it
    const large = pictureIn.get(paneId)
    if (large) {
      const back = (key: string) => <Button key={`${key}-${presses}`} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={() => ((presses += 1), pictureBack($, paneId))} />
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {await pictureView($, e, large.path)}
          {back('pic-back-end')}
        </Box>
      )
    }
    // The list's running times move each second; a Details tab is drawn again only when its work moves
    if (paneId === LIST) await read($, tick)
    if (paneId === LIST) drawnNow = await $.clock.now()
    // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
    if (paneId === LIST && [...lateFrom.values()].includes(Infinity)) {
      const from = await $.clock.now()
      // Only while the reload is recent: a panel first opened long after shows no finish of then
      for (const [key, value] of lateFrom) if (value === Infinity) from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key)
      $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
    }
    const { isFinishedOpen = false } = await read($, view)
    // Work that ended while the list was held (an older drawing given again) was not seen ended: its moment at the top begins with
    // this drawing, the first to show it, never before
    if (paneId === LIST) {
      const from = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)]) {
        const key = `${one.id}:${one.endedAt}`
        if (one.status !== 'working' && one.endedAt > listFreshAt && one.endedAt < listHeldAt && !lateFrom.has(key) && from - one.endedAt < RELOAD_GRACE * 2)
          (lateFrom.set(key, from), $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1))))
      }
      listFreshAt = from
    }
    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
    // A card whose ask or gate was just pressed is drawn answered, from the press itself (asPressed)
    const all = (await read($, todos)).map(asPressed)
    const own = all.filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
    for (const one of cardsOf(otherChats)) if (one.ask?.replied && actingOn.get(`${one.id}:${one.ask.at}`) === one.ask.replied.text) actingOn.delete(`${one.id}:${one.ask.at}`)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    // Their helpers, which only a Details tab lists
    const helpersThere = helpersOf(otherChats)
    const chat = await read($, me)
    const at = await $.clock.now()
    // Prompts answered here and in other chats, for a minute after their call ended
    const answeredOf = (list: Prompt[] | undefined) => (list ?? []).filter(p => !p.endedAt || at - p.endedAt < PROMPT_SHOWN)
    const promptsAnswered = answeredShown(at)
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask || one.admins?.length || one.leftSince || runningOn(one.id).length || (one.cutAt && !one.backAt && at - one.cutAt < CUT_OLD) || isLeftStopped(one, at))
    // A key box or a prompt of the app's that a task's own command raised, by that task's card: drawn on the card, never above it
    // (filled where the top of the panel is put together, below)
    let onCards = new Map<string, { at: number; key: string; what: string; node: JSX.Element }[]>()
    // And once answered, what came of it, on the same card for its minute: a line of what was done, never a row of its own between
    // the cards (17 Nov, the person's screenshot: "You allowed it · it was started / This chat itself" loose under a card)
    let doneOnCards = new Map<string, { at: number; key: string; node: JSX.Element }[]>()
    let promptsLoose = promptsAnswered
    // The cards kept among what waits at the top, as last put together
    let keptUpNow = new Set<string>()
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of a chat does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work that finished, in its moment: for its two seconds it is at the top under all that waits on the person, outlined green;
    // then it goes under Finished. Work stopped or stopped by an error is not: it pauses in its place, in its own look
    // In the few rows above the prompt a narrow terminal gives the panel, the outline would take two of them
    const isAbovePrompt = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    const isFinishMoment = (one: Todo) => one.status === 'done' && !one.ask && lingers(one, at)
    const isFlowMoment = (f: Flow) => f.status === 'done' && isLingering(f, at) && flowPassed(f, roundsOf(f)) !== false
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Done', stopped: 'Stopped', failed: 'Failed' }
    // Work the app sent to an older model says so, and which one; work that answers from one all the same says so
    const offModel = (one: Todo) => (one.flagged ? `a safety check stopped it, so it doesn't continue on ${one.flagged}` : one.moved ? `Claude Code moved it to ${one.moved}` : rightModel(one.model ?? '') ? "Claudopus doesn't run tasks on this model" : '')
    const glance = (one: Todo, count = '') =>
      [one.ask && one.status === 'done' && !isActingOnReply(one) ? 'Waiting for you' : one.status === 'stopped' && one.byYou ? 'Stopped by you' : stood[isActingOnReply(one) ? 'working' : one.status] || ownWorkWords(all, one, at), modelName(one.model ?? ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
    // The same line on running work, whose model's name is a control: dim like the rest, underlined under the pointer. Pressed,
    // the line becomes the three models, the one it runs on ticked; a press on one moves the work to it and closes the choice
    const { picking = '' } = await read($, view)
    // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
    // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
    const lead = e.surface === 'terminal' ? 0 : 'xs'
    // On a small card the line also counts its to-dos, before the time
    const facts = (one: Todo, isWhole: boolean, count = '') => {
      const name = modelName(one.model ?? '')
      // Another chat's work is moved to another model in that chat
      if (one.status !== 'working' || !name || one.chat)
        return (
          <Box paddingLeft={isWhole ? 0 : lead}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one, count)}</Text>
          </Box>
        )
      const scope = `model-${one.id}`
      if (picking === one.id)
        return (
          <Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(model => (
              <Button
                key={`pick-${one.id}-${model}-${presses}`}
                label={`${modelName(model) === name ? '✓ ' : ''}${modelName(model)}`}
                plain
                dimColor={modelName(model) !== name}
                hover={{ scope: `${scope}-${model}`, underline: true }}
                onPress={() => ((presses += 1), void choose($, one.id, model))}
              />
            ))}
          </Box>
        )
      const rest = [ownWorkWords(all, one, at), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ')
      return (
        <Box flexDirection="row" alignItems="flex-start">
          <Button
            key={`model-${one.id}-${presses}`}
            label={name}
            plain
            dimColor
            hover={{ scope, underline: true }}
            onPress={() => ((presses += 1), void update($, view, v => ({ ...v, picking: one.id })))}
          />
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{` · ${rest}`}</Text>
          </Box>
        </Box>
      )
    }
    // Where a piece of work is: the line it last wrote about itself
    // While it works, a run of its own that ended after that line is said in its place, so a line written while the run went ("about
    // 40% done") never stands beside a row that has ended (16 Nov), until the work writes again; not while it asks the person something
    // A launcher whose programs still work as rows of their own has not ended for the person, and is not said; the runs that are
    // said are named with how each ended, never a bare count that reads as the rows still working (16 Nov "2 commands have ended"
    // stood above the two programs a launcher that had ended left working)
    const now = (one: Todo) => {
      const entry = [...one.entries].reverse().find(one => one.kind !== 'steer')
      // (nor what one command left going while other programs of it still work)
      const runs = one.status === 'working' && !one.ask ? (one.endedRuns ?? []).filter(r => r.endedAt > (entry?.at ?? 0) && r.how !== 'timed out' && String(r.what ?? '').trim() && !one.detached?.some(d => d.from === r.id || (leftCommandOf(r.id) !== '' && leftCommandOf(d.id) === leftCommandOf(r.id)))) : []
      const said: Record<string, string> = { finished: 'done', failed: 'failed', killed: 'stopped', stopped: 'stopped', ended: 'ended' }
      const [first = '', second = ''] = runs.map(r => `${runWords(String(r.what))}: ${said[r.how] ?? 'ended'}`)
      return !first ? (entry?.text ?? '') : !second ? first : runs.length === 2 ? `${first} · ${second}` : `${first} · ${second} · ${runs.length - 2} more ended`
    }
    // A task's own note under three minutes old stands as its line: what Claude says it does beats the name of its latest action
    const isFreshNote = (one: Todo) => { const note = [...one.entries].reverse().find(one => one.kind !== 'steer' && one.text); return Boolean(note && at - (note.at ?? 0) < 3 * 60_000) }
    // Whether the card's line is commands that ended since its last word, which stays above what it does now
    const endedNow = (one: Todo) => now(one) !== ([...one.entries].reverse().find(one => one.kind !== 'steer')?.text ?? '')

    const table = uiOf($, e)
    // How much text two rows of a small card hold: the pane's cells less the card's bar, padding and dots. The app's letters are
    // narrower than a cell, the terminal's are one each
    const room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)))
    // How many letters one row of a small card holds, and a bold one: the card's two-row room halved
    const perRow = Math.max(24, Math.floor(room / 2))
    // Three moving dots: beside the line a small card gives, and beside the to-do being done on the big one
    // A terminal draws no picture, so there the mark is a letter
    const live = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Working now" width={22} height={LINE} isInteractive />
        </Box>
      ) : (
        (e.surface === 'terminal' ? termDots(table, $, paneId, key) : null) ?? <Text color={LIVE}>▸</Text>
      )

    // What a piece of work needs the person's hands for now, in its colour, with the exact text to copy beside one Copy button, then
    // the same three ways to answer on every ask, on the small card as in Details: the work's own buttons, or Done and Not now when
    // it gave none, and a box for a reply in the person's own words, which the desktop app has in the bar above the prompt and
    // not on the card (repliesInBar). The list's times stand still while the person types (holdTimes)
    // In the terminal the first ask's reply box holds the keys as the panel takes them: what is typed then is the person's words,
    // never a button's letter, and Tab leaves it for the buttons and their keys
    let askFocused = false
    // The small pictures every ask in this drawing draws, in characters: together they stay under ASK_PICS_CHARS, and in Details under
    // what the app draws in one tab beside the chat's own small pictures; one past that is a row that opens it
    let askChars = 0
    const askPictures = (one: Todo, key: string, isWhole: boolean) => {
      const paths = one.ask?.pictures ?? []
      if (!paths.length) return null
      // An ask of a chat on another Mac names that Mac's files, which are not here: a file at the same path here is another picture
      if (one.chat?.host) return <Text key={`${key}-pics`} dimColor wrap="wrap">{`${paths.length === 1 ? 'Its picture is' : `Its ${paths.length} pictures are`} on the Mac that chat runs on. Open that chat to see ${paths.length === 1 ? 'it' : 'them'}.`}</Text>
      const drawing = uiOf($, e)
      const canDraw = e.surface !== 'terminal' && 'Svg' in drawing
      // The terminal draws no picture: a row each that opens it, with no small copy made
      const made = canDraw ? askPicturesOf($, one) : paths.map(path => ({ name: fileName(path), path, thumb: null }) as Pic)
      if (!made) return <Text key={`${key}-pics`} dimColor>Shrinking its pictures…</Text>
      if (!made.length) return null
      // In Details the chat's own small pictures are drawn too: all of them together stay near what that tab keeps for pictures
      const chatChars = isWhole ? [...(shots.get(one.id)?.shots.values() ?? [])].flat().reduce((sum, pic) => sum + (pic.thumb?.source.length ?? 0), 0) : 0
      const most = isWhole ? Math.min(ASK_PICS_CHARS, PICTURES_CHARS + 30_000 - chatChars) : ASK_PICS_CHARS
      return (
        <Box key={`${key}-pics`} flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1} width="100%">
          {made.map((pic, n) => {
            const isDrawn = canDraw && pic.thumb !== null && askChars + pic.thumb.source.length <= most
            if (isDrawn && pic.thumb) askChars += pic.thumb.source.length
            const row = `${key}-pic-${n}`
            // Drawn at most ASK_PIC_WIDE across, from a copy up to twice as wide, so two sit side by side on a wide sidebar
            const size = pic.thumb && pic.thumb.width && pic.thumb.height ? sizedAskPic(pic.thumb.width, pic.thumb.height) : undefined
            return (
              <Box key={row} flexDirection="column" alignItems="flex-start" flexShrink={1} minWidth={0}>
                {isDrawn && pic.thumb && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`${row}-svg`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(size ?? {})}
                  />
                ) : null}
                <Button
                  key={`${row}-open-${presses}`}
                  label={`⤢ ${isDrawn ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                  plain
                  onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, row, press.surface))}
                />
                {e.surface === 'terminal' ? pictureSaidRow($, drawing, `${row}-said`, pic.path) : null}
              </Box>
            )
          })}
        </Box>
      )
    }
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      // The card's own box: how many lines tall it is drawn, and its send
      // (the terminal keeps its one line, Enter sending: how a terminal draws a box of rows is not known here)
      const rows = e.surface === 'terminal' ? undefined : BOX_ROWS
      const sendCard = (value: string) =>
        void (value.trim() && (dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`))))
      const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
      const lost = sentLine(one, at)
      // Answered in the person's own words and acted on: its question, with their reply under it, and nothing to press or type
      if (isActingOnReply(one))
        return (
          <Box key={key} flexDirection="column" gap={1}>
            <Text wrap="wrap" color={LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
            {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
          </Box>
        )
      return (
        <Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={needsPerson(one) ? NEEDS : LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
          {/* What the ask is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
          {ask.details ? (
            <Box key={`${key}-details`} flexDirection="column" minWidth={0}>
              <Markdown text={isWhole || ask.details.length <= DETAILS_ON_CARD ? ask.details : `${cut(ask.details, DETAILS_ON_CARD)}\n\nThe rest is in its Details.`} />
            </Box>
          ) : null}
          {/* The pictures it is about, each drawn small with a row that opens it large, so it is decided here */}
          {askPictures(one, key, isWhole)}
          {ask.copy ? (
            <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text mono wrap="wrap">{withLinks(table.Link, ask.copy, `${key}-copy`)}</Text>
              </Box>
              <Button key={`ask-${one.id}-copy-${presses}`} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, one.id, ask.copy ?? '', press.surface)} />
            </Box>
          ) : null}
          {/* A command Claude Code refused, to run on the person's press: where and for how long at most */}
          {runWhere(table, one, key)}
          {/* A command to type: Terminal opens with it typed, not run, only on this press; not beside Run it */}
          {canOpenTerminal(one) && !offeredRun(one) ? (
            <Box flexDirection="row">
              <Button key={`${key}-terminal-${presses}`} label={openedKey === `${one.id}:${ask.at}:${ask.copy}` ? '✓ Typed into Terminal, not run yet' : 'Open in Terminal'} onPress={() => void openTerminal($, one).catch(err => log($, `terminal not opened: ${String(err)}`))} />
            </Box>
          ) : null}
          {/* Another chat's ask is answered only in its own chat: no file carries an answer there */}
          {one.chat ? (
            <Text key={`${key}-elsewhere`} dimColor wrap="wrap">{`Answer it in its own chat, “${one.chat.title || 'another chat'}”${one.chat.host ? `, on ${one.chat.host}` : ''}.`}</Text>
          ) : null}
          {one.chat ? null : (
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {runButton($, table, one, key)}
            {answers.map((choice, n) => (
              <Button key={`${key}-choice-${n}-${askMark(ask)}-${loadMark}`} label={choice} variant={n === 0 ? 'primary' : undefined} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
            ))}
            {/* Where the bar above the prompt holds the reply box, the last answer opens it there for this card, and closes it again */}
            {'Input' in table && repliesInBar(e.surface) ? (
              isReplyOpen(one) ? (
                <Button key={`${key}-inbar-close-${presses}`} label="Close" onPress={press => openReply($, undefined, press.surface)} />
              ) : (
                <Button key={`${key}-inbar-${presses}`} label="Answer in words" plain onPress={press => openReply($, one, press.surface)} />
              )
            ) : null}
          </Box>
          )}
          {/* Where the bar above the prompt holds the reply box, the card has none: a box typed in here is what the app drags the
              panel to. Once opened it says where to type: the app puts the cursor there only on the person's own click */}
          {'Input' in table && !one.chat && repliesInBar(e.surface) ? (
            isReplyOpen(one) ? (
              <Text key={`${key}-inbar`} dimColor wrap="wrap">✎ Type it in the box above the chat</Text>
            ) : null
          ) : 'Input' in table && !one.chat ? (
            // The card's own box, where the bar takes none (the terminal, a folded bar, a survey): as wide as the card and as tall as
            // BOX_ROWS lines whatever it holds; on the desktop with Send under it, a gap between, and no submitLabel, which the app draws
            // as a small send button and with which a box of several lines sends only on Cmd+Enter
            <Box width="100%" flexDirection="column">
              <table.Input
                key={`${key}-reply-${replies.get(one.id) ?? 0}-${askMark(ask)}`}
                autoFocus={e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : undefined}
                placeholder="Or answer in words"
                value={draftShown(one.id, ask)}
                rows={rows}
                submitLabel={e.surface === 'terminal' ? 'send' : undefined}
                onInput={value => void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($))}
                onSubmit={value => sendCard(value)}
              />
              {e.surface === 'terminal' ? null : (
                <Box flexDirection="row" alignItems="center" gap={2} marginTop={1}>
                  <Box flexGrow={1} flexShrink={1} minWidth={0}>
                    <Text dimColor wrap="truncate-end">Shift+Enter: new line</Text>
                  </Box>
                  <Button key={`${key}-send-${presses}`} label="Send" variant="primary" onPress={() => sendCard(drafts.get(draftOf(one.id, ask)) ?? '')} />
                </Box>
              )}
            </Box>
          ) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>
      )
    }

    // The small card: its title, which opens its Details, with Stop at the far end of that row; where it stands and how many
    // to-dos are done; the line the work last wrote beside the three dots; its helpers. Each part has a fixed number of rows
    // and is clipped to them, so a card never changes height as the work goes
    let cardNo = 0
    let keyed = false
    // One row under the facts while the work runs: the to-do being done, or the next when none is, numbered done + 1 of all kept,
    // which is how far along it is (the edge's lighter part), not its place in the Details list
    const stepLine = (one: Todo, kept: Item[], done: number) => {
      if (one.status !== 'working' || one.chat) return null
      const doing = kept.find(item => item.state === 'doing')
      const named = doing ?? kept.find(item => item.state === 'open')
      if (!kept.length) return null
      // Every step ticked while it still runs: said in the same row, so the card keeps its height until it ends
      if (!named)
        return (
          <Box key={`step-${one.id}`} height={1} overflow="hidden" paddingLeft={lead}>
            <Text dimColor wrap="truncate-end">{`All ${kept.length} to-dos done`}</Text>
          </Box>
        )
      return (
        <Box key={`step-${one.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          <Box flexShrink={0}>
            <Text dimColor>{`${doing ? 'To-do' : 'Next to-do'} ${done + 1} of ${kept.length} ·`}</Text>
          </Box>
          <Box flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end" dimColor={!doing}>{named.text}</Text>
          </Box>
        </Box>
      )
    }
    // When a card's admin commands came: the earliest still open, else as first seen
    const gatesAt = (one: Todo) => {
      const open = Math.min(...(one.admins ?? []).filter(gate => !gatePressed.has(gate.id)).map(gate => gate.at), Infinity)
      // a new admin command after the earlier ones were answered: where it came, not where they did
      if (Number.isFinite(open) && (!gatePartAt.has(one.id) || (gatePartAt.get(one.id) ?? 0) < open - GATE_PART_GAP)) gatePartAt.set(one.id, open)
      if (!one.admins?.length && !cardNotesOf(one.id, at).length) gatePartAt.delete(one.id)
      return gatePartAt.get(one.id) ?? open
    }
    const small = (one: Todo) => {
      // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
      // A card in its moment at the top is not numbered, so the others keep their numbers through it
      const isMomentNow = isFinishMoment(one) && !keptUpNow.has(one.id)
      if (!isMomentNow) cardNo += 1
      const digit = keyed && cardNo <= 9 && !isMomentNow ? String(cardNo) : undefined
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      const tree = treeUnder(one)
      const scope = `card-${one.id}`
      // Just finished, in its moment at the top: outlined in the green of what is done, as an allowed notice is
      const isMoment = isMomentNow && !isAbovePrompt
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isMoment ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
          {edge(one, kept.length, done, kept.some(item => item.state === 'doing'))}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`open-${one.id}-${presses}`} plain hotkey={digit} hover={{ scope, underline: true }} onPress={() => openWork($, one.id)}>
                    <Text bold wrap="truncate-end">{titleOf(one)}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {one.status === 'working' && !one.chat ? (
                  <Box flexShrink={0}>
                    <Button key={`stop-${one.id}`} label="Stop" plain dimColor hover={{ scope: `stop-${one.id}`, underline: true }} onPress={() => void stop($, one.id)} />
                  </Box>
                ) : null}
              </Box>
              {facts(one, false, kept.length > 0 ? `${done} of ${kept.length} to-dos done` : '')}
            </Box>
            {/* What it made so far, right under its title: side by side, each a press that opens it */}
            {madeNow($, one)?.made.length || madeNow($, one)?.code ? (
              <Box key={`made-lead-${one.id}`} paddingLeft={lead}>
                {madeChips($, table, one, `made-${one.id}`, () => openWork($, one.id))}
              </Box>
            ) : null}
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead). What the card waits on, each in the order it
                came: its question, its admin commands, the key box and the app's prompt its own commands raised. A newer one goes
                under the older, so nothing already on the card moves */}
            {[
              ...(one.ask ? [{ at: one.ask.at, node: (
                <Box key={`ask-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                  {askBlock(one, `ask-${one.id}`)}
                </Box>
              ) }] : []),
              // a command the person ran on a press: where it began
              ...(runningOn(one.id).length && !one.chat ? [{ at: Math.min(...runningOn(one.id).map(run => run.startedAt ?? 0)), node: (
                <Box key={`run-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                  {runBlock($, table, one, `runs-${one.id}`, at)}
                </Box>
              ) }] : []),
              ...(one.admins?.length || cardNotesOf(one.id, at).length ? [{ at: gatesAt(one), node: (
                <Box key={`gate-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                  {adminBlock($, table, one, `gates-${one.id}`, at)}
                </Box>
              ) }] : []),
              ...[...(onCards.get(one.id) ?? []), ...(doneOnCards.get(one.id) ?? [])].map(row => ({ at: row.at, node: (
                <Box key={`own-lead-${row.key}`} flexDirection="column" paddingLeft={lead}>
                  {row.node}
                </Box>
              ) })),
            ].sort((a, b) => a.at - b.at).map(part => part.node)}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (
              <Box key={`stuck-${one.id}`} paddingLeft={lead}>
                {runningKids(all, one.id).some(kid => isBusy(all, kid, at)) ? <Text dimColor wrap="wrap">{stuckLine(all, one, at)}</Text> : <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>}
              </Box>
            ) : null}
            {/* Cut off as the chat's process ended: when, and since when it goes on again; amber when it could not be started again */}
            {cutLine(one) && !one.chat ? (
              <Box key={`cut-${one.id}`} paddingLeft={lead}>
                <Text color={one.backAt ? undefined : NEEDS} dimColor={Boolean(one.backAt)} wrap="wrap">{cutLine(one)}</Text>
              </Box>
            ) : null}
            {/* Stopped partway without a result: dim while Claudopus has just started it again, amber once it stopped doing so */}
            {carryLine(one, at) && !one.chat ? (
              <Box key={`carry-${one.id}`} paddingLeft={lead}>
                <Text color={one.carryOn?.gaveUp ? NEEDS : undefined} dimColor={!one.carryOn?.gaveUp} wrap="wrap">{carryLine(one, at)}</Text>
              </Box>
            ) : null}
            {/* Ended with to-dos not done: which, in the colour of what needs the person, so nobody has to ask what was left */}
            {notDoneLine(one) ? (
              <Box key={`not-done-${one.id}`} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{notDoneLine(one)}</Text>
              </Box>
            ) : null}
            {/* Still at work, waiting for a command of its own it started in the background: that it waits, the command itself
                being a row on its tree */}
            {waitLine(one, at) ? (
              <Box key={`wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at, jobsOf(one, at).length > 0)}</Text>
              </Box>
            ) : null}
            {/* Waiting with nothing that started it again for long: Claudopus started it to look at what it waits for */}
            {ownWaitLine(all, one, at) ? (
              <Box key={`own-wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{ownWaitLine(all, one, at)}</Text>
              </Box>
            ) : null}
            {/* Its helpers gone quiet, in amber: those at work are rows on its tree */}
            {lookedInLine(one, at) && !one.chat ? (
              <Box key={`looked-${one.id}`} paddingLeft={lead}>
                <Text dimColor={!one.lookedIn?.quiet} color={one.lookedIn?.quiet ? NEEDS : undefined} wrap="wrap">{lookedInLine(one, at)}</Text>
              </Box>
            ) : null}
            {/* What it asked Claudopus to start it again for, in place of a command that would only wait */}
            {wakeLine(one) && !one.chat ? (
              <Box key={`wake-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{wakeLine(one)}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : one.status === 'failed' ? 'error' : undefined} dimColor={one.status !== 'done' && one.status !== 'failed'}>
                    {one.status === 'done' ? '✓ Done' : one.status === 'failed' ? '✕ Failed' : one.byYou ? 'Stopped by you' : 'Stopped'}
                  </Text>
                ) : (
                  <Box flexDirection="column" minWidth={0}>
                    <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || needsPerson(one)}>{(!one.ask && sentLine(one, at)) || (one.status === 'working' && !one.ask && !endedNow(one) && !isFreshNote(one) ? helperNow(one, at, jobsOf(one, at).length, room) : '') || cut(now(one), room) || (one.status === 'working' ? (one.ask ? 'Waiting for you' : 'Starting') : "Claude hasn't said what it's doing")}</Text>
                    {/* Held where it was after an answer, once a newer line of the work's took the answer's place: why it is still up there */}
                    {!one.ask && !sentLine(one, at) && heldAnswer(one, at) && heldAnswer(one, at)?.to !== 'ran' && !heldAnswer(one, at)?.isRun ? <Text key={`held-answer-${one.id}`} dimColor wrap="truncate-end">{`✓ You answered “${cut(heldAnswer(one, at)?.text ?? '', 60)}”`}</Text> : null}
                  </Box>
                )}
              </Box>
            </Box>
            {/* A button's answer, while the card says it: a press to take it back, the question back on the card */}
            {canTakeBack(one, at) ? (
              <Box key={`take-back-${one.id}`} paddingLeft={lead} flexDirection="row">
                <Button key={`take-back-${one.id}-${heldAnswer(one, at)?.at ?? 0}`} label={`↶ Take back “${cut(heldAnswer(one, at)?.text ?? '', 30)}”`} plain onPress={() => void ((presses += 1), takeBack($, one, heldAnswer(one, at)?.at ?? 0).catch(err => log($, `answer not taken back: ${String(err)}`)))} />
              </Box>
            ) : null}
            {/* Finished, with something it started still running: what, how long, and a way to stop it */}
            {leftLine(one, at) && !one.chat ? (
              <Box key={`left-${one.id}`} flexDirection="column" gap={1} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{leftLine(one, at)}</Text>
                <Box flexDirection="row">
                  <Button key={`left-stop-${one.id}-${presses}`} label="Stop it" onPress={() => void stop($, one.id)} />
                </Box>
              </Box>
            ) : null}
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={`tree-${one.id}`} flexDirection="column" paddingLeft={lead}>{tree}</Box> : null}
          </Box>
        </Box>
      )
    }
    // The card's coloured edge. Purple while it works, green once it finished, amber while it needs the person's hands; work
    // stopped or stopped by an error has none. While it works the edge is also its to-dos, one part each from the top down:
    // those done bright, the one being done between, the rest a dim tint of the same purple, so the whole edge stays purple.
    // More than EDGE_PARTS to-dos are one edge filled as far as they are done. The parts are boxes that share the card's
    // height, whatever it is; a terminal has no part thinner than a row, so there the edge is whole
    const edge = (one: Todo, count: number, done: number, isDoing: boolean) => {
      // An error that stopped it is said in red, on its edge too
      if (one.status === 'failed') return <Box width={1} flexShrink={0} backgroundColor="error" />
      if (one.status !== 'working' && one.status !== 'done') return <Box width={1} flexShrink={0} />
      const isNeeded = needsPerson(one) || (onCards.get(one.id)?.length ?? 0) > 0
      if (isNeeded || one.status === 'done' || !count || e.surface === 'terminal') return <Box width={1} flexShrink={0} backgroundColor={isNeeded ? NEEDS : one.status === 'working' || isActingOnReply(one) ? LIVE : DONE} />
      const shade = (n: number) => (n < done ? LIVE : n === done && isDoing ? `${LIVE}AD` : `${LIVE}5C`)
      return count > EDGE_PARTS ? (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column">
          {/* Too many to-dos for a part each: one bar in the same three shades, done, the one being done, and what is left */}
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE} /> : null}
          {isDoing && count > done ? <Box key="doing" flexGrow={1} backgroundColor={`${LIVE}AD`} /> : null}
          {count - done - (isDoing ? 1 : 0) > 0 ? <Box key="left" flexGrow={count - done - (isDoing ? 1 : 0)} backgroundColor={`${LIVE}5C`} /> : null}
        </Box>
      ) : (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column" gap={count > 8 ? 0.2 : 0.3}>
          {Array.from({ length: count }, (_, n) => (
            <Box key={`part-${n}`} flexGrow={1} backgroundColor={shade(n)} />
          ))}
        </Box>
      )
    }

    // ---- The helpers a piece of work started, inside its card as a tree: each one slim row joined to its parent by a line ----
    // A row is a dot at the end of its line, the helper's name, its model, context and time, and a press on the name
    // opens its own Details. The dot is purple while it works, green once it finished, red when an error stopped it, grey when it
    // was stopped; one that ended is dim, and one at work has a ring that slowly grows out of its dot and fades.
    // The lines are drawn as a card's three dots are, which the app is seen to draw
    const twigLines = (t: Twig, key: string, status?: Todo['status']) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg
            key={`${key}-svg`}
            source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')}
            alt={status ? { working: 'Working', done: 'Done', failed: 'Failed', stopped: 'Stopped' }[status] : 'Ended'}
            width={twigWidth(t)}
            height={LINE}
            isInteractive
          />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          {status === 'working' && e.surface === 'terminal' && 'Raster' in table ? termRing(table, $, paneId, `${key}-ring`) : <Text color={status === 'working' ? LIVE : status === 'done' ? DONE : status === 'failed' ? 'error' : undefined} dimColor={!status || status === 'stopped'}>
            {status === 'working' ? '●' : status === 'done' ? '✓' : status === 'failed' ? '✕' : status === 'stopped' ? '■' : '○'}
          </Text>}
        </Box>
      )
    // One row of the tree, in the same columns whatever it says: the lines and dot, what a press opens, the time
    const twigRowOf = (t: Twig, key: string, label: string, isDim: boolean, time: string, onPress: () => void, status?: Todo['status']) => (
      <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigLines(t, `twig-lines-${key}`, status)}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Button key={`open-${key}-${presses}`} label={label} plain dimColor={isDim} hover={{ scope: `twig-${key}`, underline: true }} onPress={onPress} />
        </Box>
        {time ? (
          <Box flexShrink={0}>
            <Text dimColor>{time}</Text>
          </Box>
        ) : null}
      </Box>
    )
    const twigRow = (t: Twig, scope: string) => {
      const one = t.one
      if (!one) return null
      // Beside its name: the model it runs on, how much context it holds, and its time last, so the ticking moves nothing else.
      // A narrow panel drops the context, then the model, so the name keeps room to be read
      const time = took((one.endedAt || at) - one.startedAt)
      const model = modelName(one.model ?? '')
      const width = perRow - 4 - t.depth * 2
      // A call it has run for minutes says so in place of the model and context, so a long step does not look like a hang
      // (a command it waits on has its own row under it instead)
      const side = [[model, time], [time]].map(parts => parts.filter(Boolean).join(' · ')).find(text => width - text.length >= 12) ?? time
      const row = twigRowOf(t, `${scope}-${one.id}`, cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, () => openWork($, one.id), one.status)
      // Under a helper at work, what it is doing now in plain words, as a command's second line says how it goes (17 Nov: a
      // helper's row said only its model, tokens and time, nothing of what it did)
      const doing = one.status === 'working' && !one.chat ? helperNow(one, at, jobsOf(one, at).length, Math.max(12, width)) : ''
      if (!doing) return row
      return (
        <Box key={`twig-pair-${scope}-${one.id}`} flexDirection="column" flexShrink={0}>
          {row}
          <Box key={`twig-now-${scope}-${one.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {twigRails(t, `twig-rails-${scope}-${one.id}`)}
            <Box flexGrow={1} flexShrink={1} minWidth={0} paddingLeft={lead}>
              <Text dimColor wrap="truncate-end">{doing}</Text>
            </Box>
          </Box>
        </Box>
      )
    }
    // In a small card: the helpers at work now or just ended, and any that one of those runs under; the rest are one closing
    // row, laid out as the others, that says how many have ended and opens the card's Details, where every helper is listed
    // A job on the tree: its line ends in a dot in the colour of its kind (green a server, blue a download, purple a script),
    // with a ring while it runs; then what it is, the latest line it wrote, dim, and its percent and time last
    const jobLines = (t: Twig, key: string, job: Job) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={twigSvg(t, LINE, JOB_COLOR[job.kind], !job.isPaused && job.kind !== 'wait' && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
        </Box>
      )
    // Under a row's name, the tree's lines carried down past it, as wide as its own lines and mark, so each line under it starts
    // under its name and the tree's lines run on beside it. The app drops a picture with no words for it, and the line then started
    // at the card's edge, left of the tree
    const twigRails = (t: Twig, key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={railSvg(t, LINE)} alt={t.isLast ? 'Last row' : 'More rows below'} width={twigWidth(t)} height={LINE} />
        </Box>
      ) : (
        <Box key={key} flexShrink={0}>
          <Text dimColor>{railText(t)}</Text>
        </Box>
      )
    // One line under a row, one line high, beside the tree's lines carried down, starting where the row's name does
    const twigUnder = (t: Twig, key: string, body: JSX.Element, inset: typeof lead = lead) => (
      <Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigRails(t, `${key}-rails`)}
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={inset}>
          {body}
        </Box>
      </Box>
    )
    // How it stands, its second line, so a glance tells whether it moves and how far it is: how much of how much, its percent,
    // speed and time left as the run printed them, or worked out from its percent where it says none; then paused, a wait's target,
    // a watch's last event, nothing printed since it began, or quiet for minutes (in amber). A run that prints says nothing of when:
    // its line is read every few seconds, so what it says is now
    // a run whose own progress line gives its percent but no time left has one worked out from how long it has run, marked as a
    // guess: only the work's own line, which counts the whole run (a tool's bar starts again at each epoch, package or phase),
    // only while that line is the latest, and never for a wait, whose count is how long it is willing to wait
    const guessLeft = (job: Job, ran: number) => {
      const share = Number.parseFloat(job.pct ?? '') / 100
      return !job.left && job.isOwn && !job.isEarlier && job.kind !== 'wait' && share >= 0.01 && share < 1 && ran >= 20_000 ? timeLeftText((ran / 1000) * ((1 - share) / share)) : undefined
    }
    // Its time, and how long it said it should take. Once past that, the figure it said no longer holds: where the run says how
    // long it has left as it prints now (or its percent gives one), the time so far and that left make a fresh expectation;
    // otherwise its row says plainly that it is past the time it was expected to take, in amber. Nothing is made up
    const jobTime = (job: Job, ran: number) => {
      if (!job.expectText || !job.expect) return { time: took(ran), isPast: false }
      if (ran <= job.expect) return { time: `${took(ran)} of about ${job.expectText}`, isPast: false }
      const isFresh = !job.isPaused && Boolean(job.wroteAt) && at - (job.wroteAt ?? 0) < 60_000
      // the time left is as of when it was printed, so it adds to the time it had run then
      const printedAt = Math.min(ran, Math.max(0, (job.wroteAt ?? 0) - job.at))
      const left = isFresh ? leftSeconds(job.left ?? guessLeft(job, printedAt)) : undefined
      const fresh = left ? timeLeftText(Math.max(ran / 1000, printedAt / 1000 + left))?.replace(/ left$/, '') : undefined
      return fresh ? { time: `${took(ran)} of about ${fresh}`, isPast: false } : { time: `${took(ran)} · ${shortAgo(ran - job.expect)} over`, isPast: true }
    }
    // Every run's second line has the one shape plainOf describes: how far, a few plain words, and its sign of life, which changes
    // as time goes so the line never stands still while the run goes on. Nothing raw is shown: a line that is not plain words is
    // left out, and a run that has given no word says so and for how long, in amber past a few minutes
    const jobStand = (job: Job, width: number) => {
      const pct = job.pct ? [job.pct] : []
      const quiet = job.wroteAt && !job.isEmpty ? at - job.wroteAt : undefined
      const ran = at - job.at
      // (to ten seconds past a minute, so the line moves at each drawing however long it has been)
      const ago = (ms: number) => {
        const all = Math.max(0, Math.floor(ms / 1000))
        return all < 60 || all >= 3600 ? shortAgo(ms) : `${Math.floor(all / 60)}m ${String(Math.floor((all % 60) / 10) * 10).padStart(2, '0')}s`
      }
      const still = quiet ?? ran
      // Quiet for three minutes, in amber: a server or a watch speaks only when there is something to say, so its quiet is no
      // fault, and one whose output has not been read yet is not known to be silent until a minute has passed. Before three
      // minutes nothing is said of when: a count of seconds beside a still percent told nothing (16 Nov)
      const isSilent = !job.isPaused && !job.target && job.kind !== 'server' && job.kind !== 'watch' && !(quiet === undefined && !job.isEmpty && ran < SILENT_WARN) && still >= SILENT_AFTER
      // its speed and time left only while it prints: ten seconds old, they are no longer how it goes
      const isFresh = quiet !== undefined && quiet < 10_000
      const guess = guessLeft(job, ran)
      const left = isFresh ? (job.left ? [job.left] : guess ? [`about ${guess}`] : []) : []
      const rate = job.rate && isFresh ? [job.rate] : []
      const full = job.done ? [job.total ? `${job.done} of ${job.total}` : job.done] : []
      const compact = job.done ? [job.total ? `${job.done}/${job.total}` : job.done] : []
      // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
      const bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? [`${job.done}/${job.total.split(' ')[0]}`] : compact
      // The memory it holds only where it is a gigabyte or more, said as memory, as it counts against what this Mac may hold; a few
      // megabytes say nothing to a person (16 Nov a row led with "35 MB"), and it goes first when the line has no room
      const mem = job.mem && /\b[GT]B\b/.test(job.mem) ? [`${job.mem} memory`] : []
      // Its own plain words for what it does now; a watch's are its last event
      const words = plainOf(job.isOwn && !job.isEarlier ? job.words : job.latest, `${job.label} ${job.waitsFor ?? ''}`)
      const hasSaid = Boolean(words || full.length || pct.length)
      // Quiet never stands alone (17 Nov "nothing printed for 29m 30s" said nothing of what it did): the last thing it said stays,
      // marked as the last, or that it has shown no output or no progress at all; and once Claude was told of it, that too
      const told = isSilent && silentTold.has(job.id) ? 'Claude was told to check it' : ''
      const [state, short]: [string, string] =
        job.isPaused ? ['Paused', 'Paused']
        : job.target ? [job.target, job.target.replace(/^What it waits for hasn't changed for /, 'No change for ').replace(/^What it waits for /, 'Its target ')]
        : job.kind === 'server' || job.kind === 'watch' ? ['', '']
        : !isSilent ? ['', '']
        : hasSaid ? [`nothing new for ${ago(still)}`, `nothing new for ${shortAgo(still)}`]
        : !job.wroteAt || job.isEmpty ? [`No output yet · started ${shortAgo(ran)} ago`, `No output yet · ${shortAgo(ran)}`]
        : [`No progress shown · nothing new for ${ago(still)}`, `No progress for ${shortAgo(still)}`]
      const isWarn = job.isPaused || Boolean(job.target) || isSilent
      // A server or a watch leads with what it does, then the last thing it said
      const lead = job.kind === 'server' ? (words ? 'Serving · last: ' : 'Serving · ') : job.kind === 'watch' ? (words ? 'Watching · last: ' : 'Watching · ') : isSilent && hasSaid ? 'Last: ' : ''
      // (what one command left going, when it is several programs, says how many: its row names the command once)
      // (a narrow row drops the "about" of a time left worked out from its percent)
      const near = left.map(one => one.replace(/^about /, ''))
      const programs = leftCommandOf(job.id) && job.count && job.count > 1 ? [`${job.count} programs`] : []
      const numbers = [[...full, ...pct, ...rate, ...left, ...programs, ...mem], [...full, ...pct, ...rate, ...left, ...programs], [...full, ...pct, ...left, ...programs], [...full, ...pct, ...left], ...(near.length ? [[...full, ...near]] : []), [...compact, ...pct, ...left], ...(left.length ? [[...compact, ...left], [...compact, ...near], [...bare, ...near]] : []), [...compact, ...pct], [...bare, ...pct], [...pct], []]
      const tails = [[state, told], [state], [short, told], [short]].map(t => t.filter(Boolean))
      // How far it is comes first, then its sign of life, then whether Claude was told: the fullest counts with each tail, then any
      const tries = [...numbers.slice(0, 3).flatMap(nums => tails.map(tail => ({ nums, tail }))), ...tails.flatMap(tail => numbers.map(nums => ({ nums, tail })))]
      for (const { nums, tail } of tries) {
        const fixed = [...nums, ...tail].join(' · ')
        if (lead.length + fixed.length > width) continue
        // ("Last:" needs the last thing it said after it: one with room for nothing of that drops the long tail first)
        if (lead && !nums.length && !(words && width - lead.length - fixed.length - 3 >= 12) && tail !== tails.at(-1)) continue
        // Its own words go between how far it is and its sign of life, cut to the room left
        const room = width - lead.length - fixed.length - (fixed ? 3 : 0)
        const said = words && room >= 12 ? (words.length <= room ? words : `${words.slice(0, room - 1).replace(/\s+\S*$/, '')}…`) : ''
        const text = [...nums, said, ...tail].filter(Boolean).join(' · ')
        // A run that gives word but says nothing plain of how far it is or what it does: that it is at work, and its kind's word
        // (a server's or watch's "last:" only before its own words; "Last:" before how far it got or its words, else the tail alone
        // with a capital)
        const kindLead = job.kind === 'server' ? 'Serving' : job.kind === 'watch' ? 'Watching' : ''
        const shownLead = kindLead ? `${kindLead} · ${said ? 'last: ' : ''}` : lead && (nums.length || said) ? lead : ''
        const line = `${shownLead}${text}`
        return { text: text ? line.charAt(0).toUpperCase() + line.slice(1) : kindLead || (job.kind === 'wait' ? 'Waiting' : job.kind === 'download' ? 'Downloading' : 'Working'), isWarn }
      }
      return { text: short, isWarn }
    }
    // A job's two lines: what it is, in the work's own words, with its time; and under it how it stands, then the latest line it
    // printed where that is not the progress already said
    const jobRow = (t: Twig, scope: string) => {
      const job = t.job
      if (!job) return null
      const key = `${scope}-job-${job.id}`
      const width = perRow - 4 - t.depth * 2
      const ran = at - job.at
      const { time, isPast: isLong } = jobTime(job, ran)
      // Stop, at its end, where it can be stopped from here: it ends the run and tells the work it was stuck
      const owner = t.one?.id ?? ''
      // (not on a row too narrow to say how far it is beside it; Details, wider, has it)
      const isStoppable = Boolean(owner) && canStopJob(job) && !job.id.startsWith('more-') && width >= 44
      const name = cut(jobHead(job), Math.max(12, width - time.length - 1))
      const head = (
        <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {jobLines(t, `twig-lines-${key}`, job)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {/* A press shows its output whole in a Terminal window, where this Mac can open one */}
            {canOpenJob(job) ? (
              <Button key={`output-${key}-${presses}`} label={name} plain hover={{ scope: `twig-${key}`, underline: true }} onPress={() => void openJobOutput($, job).catch(err => log($, `output not opened: ${String(err)}`))} />
            ) : (
              <Text wrap="truncate-end">{name}</Text>
            )}
          </Box>
          <Box flexShrink={0}>
            <Text dimColor={!isLong} color={isLong ? NEEDS : undefined}>{time}</Text>
          </Box>
        </Box>
      )
      if (job.id.startsWith('more-')) return head
      // (Stop sits at the end of its second line, under its time, so its name keeps its room)
      const stopButton = isStoppable ? (
        <Box key={`stop-box-${key}`} flexShrink={0}>
          <Button key={`stop-${key}-${presses}`} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain hover={{ scope: `stop-${key}`, underline: true }} onPress={() => void stopJob($, owner, job).catch(err => log($, `run not stopped: ${String(err)}`))} />
        </Box>
      ) : null
      const { text: stand, isWarn } = jobStand(job, width - (isStoppable ? 10 : 0))
      // Its percent, in blue, where the line says it as a part of its own
      const pctAt = job.pct && !isWarn ? (stand.startsWith(`${job.pct} · `) || stand === job.pct ? 0 : stand.includes(` · ${job.pct}`) ? stand.indexOf(` · ${job.pct}`) + 3 : -1) : -1
      // (its plain words are in the line itself, which every run has)
      const detail = ''
      return (
        <Box key={`job-${key}`} flexDirection="column" flexShrink={0}>
          {head}
          <Box key={`stand-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {twigRails(t, `rails-${key}`)}
            {/* (on a desktop by the step a plain Button pads a run's name with, where its name is one, so the two start in one column) */}
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={canOpenJob(job) ? lead : 0}>
              {pctAt >= 0 && job.pct ? (
                <Box flexDirection="row" flexShrink={0}>
                  {pctAt > 0 ? <Text dimColor>{stand.slice(0, pctAt)}</Text> : null}
                  <Text color={JOB_COLOR.download}>{job.pct}</Text>
                  <Text dimColor>{stand.slice(pctAt + job.pct.length)}</Text>
                </Box>
              ) : stand ? (
                <Box flexShrink={0}>
                  <Text color={isWarn ? NEEDS : undefined} dimColor={!isWarn}>{stand}</Text>
                </Box>
              ) : null}
              {detail ? (
                <Box flexShrink={1000} minWidth={0}>
                  <Text dimColor wrap="truncate-end">{stand ? ` · ${detail}` : detail}</Text>
                </Box>
              ) : null}
            </Box>
            {stopButton}
          </Box>
        </Box>
      )
    }
    // Each branch with the jobs its helper has running first, under it, as the card's own come first under the card
    // At most JOBS_SHOWN each, the newest; the rest one row that says how many more run and opens the card's Details
    // In Details every one is shown
    const jobBranches = (card: Todo, isAll = false): Branch[] => {
      const jobs = jobsOf(card, at)
      if (isAll || jobs.length <= JOBS_SHOWN) return jobs.map(job => ({ one: card, job, kids: [] }))
      const more = jobs.length - JOBS_SHOWN + 1
      const shown = jobs.slice(-(JOBS_SHOWN - 1))
      const rest: Job = { id: `more-${card.id}`, label: `${jobs.slice(0, more).reduce((n, job) => n + (leftCommandOf(job.id) ? 1 : (job.count ?? 1)), 0)} more commands`, cmd: '', kind: 'watch', at: Math.min(...jobs.slice(0, more).map(job => job.at)) }
      return [...shown, rest].map(job => ({ one: card, job, kids: [] }))
    }
    const withJobs = (branches: Branch[], isAll = false): Branch[] =>
      branches.map(b => (b.job ? b : { ...b, kids: [...jobBranches(b.one, isAll), ...withJobs(b.kids, isAll)] }))
    const rowOf = (t: Twig) => (t.job ? jobRow(t, 'list') : twigRow(t, 'list'))
    // In a small card: what it has running, then the helpers at work now or just ended, and any that one of those runs under; the
    // rest are one closing row, laid out as the others, that says how many have ended and opens the card's Details, where every
    // helper is listed. A helper that ended with a job still running stays for it
    // The runs that ended under a card: its own and its helpers', oldest first
    // (what one command left going counts as ended once its last program has: before that it is still its running row)
    const endedRunsOf = (one: Todo, list = all) => [one, ...underOf(list, one.id)].flatMap(kid => (kid.endedRuns ?? []).filter(r => !leftCommandOf(r.id) || !kid.detached?.some(d => leftCommandOf(d.id) === leftCommandOf(r.id)))).sort((a, b) => a.endedAt - b.endedAt)
    // Runs that ended leave the tree at once; the closing row counts them with the helpers that ended, and says how many of them
    // failed, were killed or ran out of time, so nothing goes without a trace
    const treeUnder = (one: Todo) => {
      const under = underOf(all, one.id)
      const own = jobBranches(one)
      const runs = endedRunsOf(one, one.chat ? helpersThere : all)
      if (!under.length && !own.length && !runs.length) return []
      const branches = [...own, ...withJobs(branchesOf(all, one.id, kid => kid.status === 'working' || isLingering(kid, at) || jobsOf(kid, at).length > 0))]
      const twigs = twigsOf(branches, true)
      const rest = under.length - twigs.filter(t => !t.job).length
      if (!rest && !runs.length) return twigsOf(branches).map(rowOf)
      const closing: Twig = { depth: 1, rails: [], isLast: true, hasKids: false }
      return [...twigs.map(rowOf), twigRowOf(closing, `rest-${one.id}`, endedSummary(rest, runs), true, '', () => openWork($, one.id))]
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const agentsWord = (n: number) => `${n} ${n === 1 ? 'helper' : 'helpers'}`
    // Where it stands, as Claude's own view of a workflow says it: "Workflow", how many agents it has started, its tokens and time,
    // in as many of those words as the row holds
    const flowGlance = (f: Flow, most = Infinity) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const agents = agentsWord(f.agents.length)
      const head = stood[f.status] ? [stood[f.status], 'Workflow'] : ['Workflow']
      return firstFit([[...head, agents, time], [head.at(-1) ?? 'Workflow', agents, time], ['Workflow', time]], most)
    }
    const roundsLabel = (f: Flow, rounds: Round[]) => (rounds.length ? `round ${rounds.length}${f.cap ? ` of ${f.cap}` : ''}` : f.cap ? `0 of ${f.cap} rounds` : '')
    const verdict = (r: Round) => (r.isOpen ? (r.phase ? `${doing(r.phase).toLowerCase()} now` : 'starting') : r.pass === true ? `passed${r.why ? ` · ${r.why}` : ''}` : r.pass === false ? `failed · ${r.why || 'no reason given'}` : r.why || 'ended')
    // The run as small squares, one per step of each round, grouped by round, as Claude's own view of a workflow draws its agents
    const squaresRow = (f: Flow, rounds: Round[], key: string, first = 1) => {
      const groups = squaresOf(f, rounds)
      if (!groups.length) groups.push(f.phases.length ? f.phases.map(() => 'waiting' as const) : ['waiting'])
      if ('Svg' in table && e.surface !== 'terminal') {
        // One drawing holds so many squares: a long run draws its last rounds, after how many came before
        const kept = squaresKept(groups)
        const said = kept.groups.map((g, i) => `round ${first + kept.earlier + i}: ${g.join(', ')}`).join('; ')
        const source = squaresSvg(kept.groups, LINE)
        return (
          <Box key={key} flexDirection="row" gap={1} alignItems="center" flexShrink={0}>
            {squaresBefore(kept) ? <Text key={`${key}-earlier`} dimColor>{`${squaresBefore(kept)} ·`}</Text> : null}
            {svgFits(source) ? <table.Svg key={`${key}-svg`} source={source} alt={said} width={squaresWidth(kept.groups)} height={LINE} isInteractive /> : <Text key={`${key}-too-big`} dimColor>{`${groups.length} rounds`}</Text>}
          </Box>
        )
      }
      return (
        <Box key={key} flexDirection="row" gap={1} flexShrink={0}>
          {groups.map((g, i) => (
            <Box key={`${key}-${i}`} flexDirection="row">
              {g.map((one, j) => (
                <Text key={`${key}-${i}-${j}`} color={one === 'done' || one === 'waiting' ? undefined : SQUARE_COLOR[one]} dimColor={one === 'done' || one === 'waiting'}>
                  {SQUARE_GLYPH[one]}
                </Text>
              ))}
            </Box>
          ))}
        </Box>
      )
    }
    // Beside the squares, in a word or two: the step being run, or how the run ended
    const stateWord = (f: Flow, rounds: Round[]) => {
      const round = rounds.at(-1)
      if (f.status === 'working') {
        const one = round ? [...round.agents].reverse().find(agent => agent.status === 'working') : undefined
        return one ? doing(one.phase || stageOf(f) || 'Working') : round ? 'Between stages' : 'Starting'
      }
      if (f.status === 'stopped') return 'Stopped'
      if (f.status === 'failed') return 'Failed'
      return round?.pass === true ? 'Passed' : round?.pass === false ? 'Not passed' : 'Done'
    }
    // The small card, built as every other card is: its title, which opens its Details, with Stop at the far end of that row; where
    // it stands; the bar it is held to; then a row per round up to the cap, each led by its own squares, one per step, and saying
    // what came of it: the round at work has the moving dots and who is at work, a checked round what its check found, a round not
    // run yet that it runs only if needed. Once it ended, how it ended takes the place of the moving dots
    const flowModel = (f: Flow) => modelName(f.agents.find(one => one.model)?.model ?? f.phases.find(one => one.model)?.model ?? '')
    // As a card's facts line: every part, cut at its end on a narrow panel as a card's is
    const flowFacts = (f: Flow, rounds: Round[]) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const round = rounds.length && f.cap ? `round ${rounds.length} of ${f.cap}` : rounds.length ? `round ${rounds.length}` : ''
      return [stood[f.status], flowModel(f), agentsWord(f.agents.length), round, time].filter(Boolean).join(' · ')
    }
    // Who is at work in a round, in plain words: the rounds script's maker and checker by name, any other stage by its own
    const atWork = (f: Flow, r: Round) => {
      const one = [...r.agents].reverse().find(agent => agent.status === 'working')
      const phase = one?.phase || stageOf(f)
      if (!one) return 'between stages'
      if (phase === 'Make') return r.n === 1 ? 'Maker building it' : 'Maker fixing what the check found'
      if (phase === 'Check') return 'Checker testing it'
      return doing(phase || 'Working')
    }
    const flowDots = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={dots(FLOW, LINE)} alt="Working now" width={22} height={LINE} isInteractive />
        </Box>
      ) : e.surface === 'terminal' ? (
        (termDots(table, $, paneId, key, FLOW) ?? <Text key={key} color={FLOW}>▸</Text>)
      ) : (
        <Text key={key} color={FLOW}>▸</Text>
      )
    const roundRow = (f: Flow, rounds: Round[], n: number, isPassed: boolean) => {
      const r = rounds[n - 1]
      const key = `flow-round-${f.id}-${n}`
      const label = (color: string | undefined, isDim = false) => (
        <Box key={`${key}-label`} flexShrink={0}>
          <Text color={color} dimColor={isDim}>{`Round ${n}`}</Text>
        </Box>
      )
      const row = (parts: unknown[]) => (
        <Box key={key} flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {squaresRow(f, r ? [r] : [], `${key}-squares`, n)}
          {parts as never}
        </Box>
      )
      if (!r && n === 1 && f.status === 'working') return row([label(FLOW), flowDots(`${key}-dots`), <Text key={`${key}-why`} color={FLOW} wrap="truncate-end">Starting</Text>])
      if (!r) return row([label(undefined, true), <Text key={`${key}-why`} dimColor wrap="truncate-end">{isPassed ? 'not needed' : f.status === 'working' ? 'if needed' : 'not run'}</Text>])
      if (r.isOpen)
        return row([
          label(FLOW),
          f.status === 'working' ? flowDots(`${key}-dots`) : null,
          <Box key={`${key}-what`} flexShrink={1} minWidth={0}>
            <Text color={FLOW} wrap="truncate-end">{atWork(f, r)}</Text>
          </Box>,
        ])
      const cutShort = r.pass === undefined && !r.why && r.agents.some(one => one.status !== 'done')
      const why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : cutShort ? (f.status === 'failed' ? 'failed with an error' : 'stopped') : 'ended')).replace(/[.。]+$/, '')
      const found = r.pass === false && r.findings.length ? `${r.findings.length} found · ` : ''
      return row([
        label(r.pass ? DONE : undefined),
        <Box key={`${key}-why`} flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{r.pass ? `passed · ${why}` : `${found}${why}`}</Text>
        </Box>,
      ])
    }
    // Whether a run passed: its last round's verdict, else what the run itself returned
    const flowPassed = (f: Flow, rounds: Round[]) => {
      const pass = rounds.at(-1)?.pass
      if (pass !== undefined) return pass
      if (/"passed"\s*:\s*false|\bnot passed\b/i.test(f.result)) return false
      if (/"passed"\s*:\s*true|\bpassed\b/i.test(f.result)) return true
      return undefined
    }
    // How it ended, as its last line; a stopped run's facts line already says it was stopped
    const flowEnd = (f: Flow, rounds: Round[]) => {
      if (f.status !== 'done') return null
      const n = rounds.length
      const pass = flowPassed(f, rounds)
      const of = f.cap ? ` of ${f.cap}` : ''
      const said = pass === true ? `✓ Passed in round ${n}${of}` : pass === false ? `Not passed after ${n}${of} ${(f.cap ?? n) === 1 ? 'round' : 'rounds'}` : '✓ Finished'
      return (
        <Box key={`flow-end-${f.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          {pass === false ? <Text color="error">✕</Text> : null}
          <Text color={pass === false ? undefined : DONE} wrap="truncate-end">{said}</Text>
        </Box>
      )
    }
    const flowSmall = (f: Flow) => {
      const rounds = roundsOf(f)
      const count = Math.max(rounds.length, f.cap ?? 0)
      const isPassed = f.status === 'done' && flowPassed(f, rounds) === true
      const scope = `flow-${f.id}`
      return (
        <Box key={`flow-${f.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isFlowMoment(f) && !isAbovePrompt ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
          {/* Blue while it runs, green only when it finished and its last round did not fail */}
          {f.status === 'working' || (f.status === 'done' && flowPassed(f, rounds) !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`flow-open-${f.id}-${presses}`} plain hover={{ scope, underline: true }} onPress={() => openFlow($, f.id)}>
                    <Text bold wrap="truncate-end">{f.title}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {f.status === 'working' && f.session === flowMine ? (
                  <Box flexShrink={0}>
                    <Button key={`flow-stop-${f.id}`} label="Stop" plain dimColor hover={{ scope: `flow-stop-${f.id}`, underline: true }} onPress={() => void stopFlow($, f.id)} />
                  </Box>
                ) : null}
              </Box>
              <Box paddingLeft={lead}>
                <Text dimColor wrap="truncate-end">{flowFacts(f, rounds)}</Text>
              </Box>
            </Box>
            {f.bar ? (
              <Box flexDirection="row" gap={1} height={2} overflow="hidden" paddingLeft={lead}>
                <Box flexShrink={0}>
                  <Text dimColor>Test to pass ·</Text>
                </Box>
                <Box flexShrink={1} minWidth={0}>
                  <Text dimColor wrap="wrap">{cut(f.bar, Math.max(20, room - 12))}</Text>
                </Box>
              </Box>
            ) : null}
            <Box flexDirection="column" paddingLeft={lead}>
              {Array.from({ length: Math.max(1, count) }, (_, i) => roundRow(f, rounds, i + 1, isPassed))}
            </Box>
            {flowEnd(f, rounds)}
          </Box>
        </Box>
      )
    }

    // The work this Details tab is for, if it is one; a workflow's tab folds each of its agents' chats apart
    const flowOpen = flowShown ? pickedOf(flowShown) : undefined
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...all, ...elsewhere, ...helpersThere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
    // What is unfolded in this tab: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
    const open = folds.get(workId) ?? []
    const fold = (at: number) => {
      presses += 1
      const was = folds.get(workId) ?? []
      folds.set(workId, was.includes(at) ? was.filter(n => n !== at) : [...was, at])
      void update($, view, v => ({ ...v }))
    }

    // One part of the open card: a filled block of its own with a bold heading and, at its right, a dim count. The parts stand apart
    // on the pane's own ground, so where one ends and the next begins is seen at a glance
    const part = (key: string, name: string, side: string, body: JSX.Element) => (
      <Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" alignItems="flex-start" gap={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold dimColor wrap="wrap">{name}</Text>
          </Box>
          {side ? (
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="truncate-end">{side}</Text>
            </Box>
          ) : null}
        </Box>
        {body}
      </Box>
    )
    // One to-do: its mark beside the first line of its text
    // Under the to-do being done, where the work says it is, in the same column as the text. The one being done is the brightest
    // line of the part; the others are dim, so it stands out without a mark of its own
    const row = (key: string, mark: JSX.Element, item: Item, under = '') => (
      <Box key={key} flexDirection="row" alignItems="flex-start" gap={1}>
        {mark}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text wrap="wrap" dimColor={item.state !== 'doing'} strikethrough={item.state === 'dropped'}>
            {item.text}
          </Text>
          {under ? <Text wrap="wrap" dimColor>{under}</Text> : null}
        </Box>
      </Box>
    )
    const opener = (at: number, label: string) => (
      <Box key={`fold-${at}`} alignItems="flex-start">
        <Button key={`fold-${at}-${presses}`} label={`${open.includes(at) ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => fold(at)} />
      </Box>
    )

    // Where it started: the person's words in two rows, whole on a press
    const askPart = (one: Todo) => {
      const whole = quoted(one.words, 1200)
      const short = cut(whole, room)
      const isLong = short !== whole
      return part(
        'part-ask',
        'Started from',
        '',
        <Box flexDirection="column">
          <Text wrap="wrap" dimColor>{`“${isLong && !open.includes(OPEN_ASK) ? short : whole}”`}</Text>
          {isLong ? opener(OPEN_ASK, open.includes(OPEN_ASK) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The to-dos, every one in the order the work listed them: done ticked, the one being done bright with the dots and where the
    // work says it is under it, the rest dim, dropped struck through. Many done fold into one row that opens them. Orange is the
    // header's alone
    const todoPart = (one: Todo) => {
      const isWorking = one.status === 'working'
      const done = one.items.filter(item => item.state === 'done').length
      const kept = one.items.filter(item => item.state !== 'dropped').length
      const where = isWorking ? now(one) : ''
      const hasDoing = one.items.some(item => item.state === 'doing')
      const isFolded = done > DONE_FOLDED && !open.includes(OPEN_DONE)
      if (!one.items.length && !where) return null
      let isWhereSaid = false
      return part(
        'part-todos',
        'To-dos',
        kept ? `${done} of ${kept} done` : '',
        <Box flexDirection="column">
          {done > DONE_FOLDED ? opener(OPEN_DONE, isFolded ? `${done} done` : 'Hide done') : null}
          {one.items.map((item, i) => {
            if (item.state === 'done' && isFolded) return null
            if (item.state === 'doing') {
              const under = !isWhereSaid && where ? cut(where, room) : ''
              isWhereSaid = true
              return row(`todo-${i}`, isWorking ? live(`live-doing-${i}`) : <Text dimColor>○</Text>, item, under)
            }
            const mark = item.state === 'done' ? <Text color="success" dimColor>✓</Text> : <Text dimColor>{item.state === 'dropped' ? '✕' : '○'}</Text>
            return row(`todo-${i}`, mark, item)
          })}
          {!hasDoing && where ? (
            <Box key="where" flexDirection="row" alignItems="flex-start" gap={1}>
              {live('live-where')}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="wrap">{cut(where, room)}</Text>
              </Box>
            </Box>
          ) : null}
        </Box>,
      )
    }
    // In Details: what the work has running, then every helper it started, and theirs, at work or ended, each with what it has
    // running under it, as the same tree as on its card, every job shown; each helper opens its own Details, which shows its own
    // Under a helper at work, the step it is on and where it says it is; under a job, the last lines its output ends with, as a
    // terminal shows them. Both sit where the row's name starts; one that ended has nothing under it
    const underTwig = (t: Twig) => {
      if (t.job) {
        // (its row says it in plain words, so the last line is here as it was printed too)
        const tail = t.job.id.startsWith('more-') ? [] : (t.job.tail ?? []).slice(-OUTPUT_LINES)
        if (!tail.length) return null
        const inset = canOpenJob(t.job) ? lead : 0
        return (
          <Box key={`tail-${t.job.id}`} flexDirection="column" flexShrink={0}>
            {tail.map((line, n) =>
              twigUnder(
                t,
                `tail-${t.job?.id}-${n}`,
                <Box flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={OUTPUT_FILL}>
                  <Text dimColor wrap="truncate-end">
                    {line}
                  </Text>
                </Box>,
                inset,
              ),
            )}
          </Box>
        )
      }
      const kid = t.one
      if (!kid || kid.status !== 'working') return null
      const kept = kid.items.filter(item => item.state !== 'dropped')
      const doing = kept.findIndex(item => item.state === 'doing')
      const lines = [doing >= 0 ? `To-do ${doing + 1} of ${kept.length} · ${kept[doing]?.text ?? ''}` : '', now(kid)].filter(Boolean)
      if (!lines.length) return null
      return (
        <Box key={`under-${kid.id}`} flexDirection="column" flexShrink={0}>
          {lines.map((line, n) =>
            twigUnder(
              t,
              `under-${kid.id}-${n}`,
              <Text dimColor wrap="truncate-end">
                {line}
              </Text>,
            ),
          )}
        </Box>
      )
    }
    const helpersPart = (one: Todo) => {
      // Another chat's work has its helpers from that chat's file
      const list = one.chat ? helpersThere : all
      const under = underOf(list, one.id)
      const branches = [...jobBranches(one, true), ...withJobs(branchesOf(list, one.id, () => true), true)]
      // (what one command left going counts as that one command, however many programs it is)
      const jobs = [one, ...under].reduce((n, kid) => n + jobsOf(kid, at).reduce((sum, job) => sum + (leftCommandOf(job.id) ? 1 : (job.count ?? 1)), 0), 0)
      if (!under.length && !jobs) return null
      const running = under.filter(kid => kid.status === 'working').length
      // Beside the jobs, the helpers are named, so neither count reads as the other's
      const helpers = running === under.length ? `${running} ${running === 1 ? 'helper' : 'helpers'} working` : running ? `${running} of ${under.length} helpers working` : `${under.length} ${under.length === 1 ? 'helper' : 'helpers'}`
      const side = [jobs ? `${jobs} ${jobs === 1 ? 'command' : 'commands'} running` : '', under.length ? helpers : ''].filter(Boolean).join(' · ')
      return part(
        'part-helpers',
        !jobs ? 'Helpers' : under.length ? 'Helpers and commands' : 'Commands',
        side,
        <Box flexDirection="column">{twigsOf(branches).flatMap(t => [t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)])}</Box>,
      )
    }
    // In Details, under what runs: every run that has ended, the newest first, each with how it ended in plain words, how long it
    // ran and when it ended; one that failed, was killed or ran out of time in amber
    const endedRunsPart = (one: Todo) => {
      const runs = endedRunsOf(one, one.chat ? helpersThere : all).reverse()
      if (!runs.length) return null
      const isBad = (run: (typeof runs)[number]) => run.how === 'failed' || run.how === 'killed' || run.how === 'timed out'
      const bad = runs.filter(isBad).length
      return part(
        'part-ended-runs',
        'Commands ended',
        endedSummary(0, runs),
        <Box flexDirection="column">
          {runs.map(run => (
            <Box key={`ended-${run.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{describedOf(run.what).text || run.what || 'A command'}</Text>
              </Box>
              <Box flexShrink={0}>
                <Text dimColor={!isBad(run)} color={isBad(run) ? NEEDS : undefined}>{`${endedLine(run, took(run.endedAt - run.at))} · ${shortAgo(at - run.endedAt)} ago`}</Text>
              </Box>
            </Box>
          ))}
        </Box>,
      )
    }

    // The work's own chat, drawn as the app draws a chat, the oldest first: what it was told in a filled block, what it wrote as
    // text, and each run of tool steps folded into one quiet row that opens on a press. A long message to it is folded too
    const talk = (one: Todo, lines: Line[] | undefined, shots: Map<number, Pic[]>) => {
      // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
      // a row under it that opens it whole in a window of its own, large enough to look at; one that is gone is named
      const drawing = uiOf($, e)
      const picturesOfRun = (block: Line[], at: number) => {
        const made = block.flatMap(line => shots.get(line.at ?? -1) ?? [])
        if (!made.length) return null
        return (
          <Box key={`pics-${at}`} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map((pic, n) => (
              <Box key={`pic-${at}-${n}`} flexDirection="column" alignItems="flex-start" width="100%">
                {pic.thumb && e.surface !== 'terminal' && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`pic-svg-${at}-${n}`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}
                  />
                ) : null}
                {pic.isGone ? (
                  <Text dimColor wrap="wrap">{`Picture: ${pic.name} · no longer available`}</Text>
                ) : (
                  <Button
                    key={`pic-open-${at}-${n}-${presses}`}
                    label={`⤢ ${pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                    plain
                    onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, `pic-${at}-${n}`, press.surface))}
                  />
                )}
                {e.surface === 'terminal' && !pic.isGone ? pictureSaidRow($, drawing, `pic-said-${at}-${n}`, pic.path) : null}
              </Box>
            ))}
          </Box>
        )
      }
      // Each line knows how many tool steps came before it: that names a run of steps whatever is drawn above it
      let uses = 0
      const shown = newest((lines ?? []).map(line => ({ ...line, at: line.isUse ? (uses += 1) : uses })))
      const blocks = shown.reduce<Line[][]>((all, line) => {
        const last = all.at(-1)
        return line.kind === 'step' && last?.[0]?.kind === 'step' ? [...all.slice(0, -1), [...last, line]] : [...all, [line]]
      }, [])
      return (
        <Box flexDirection="column" gap={1}>
          {lines ? null : <Text dimColor>The app didn't save this task's conversation.</Text>}
          {blocks.map((block, i) => {
            const first = block[0]
            const at = first?.at ?? 0
            if (first?.kind === 'step') {
              const isOpen = open.includes(at)
              return (
                <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start">
                  <Button key={`run-${at}-${presses}`} label={`${isOpen ? '▾' : '▸'} ${folded(block)}`} plain dimColor onPress={() => fold(at)} />
                  {isOpen
                    ? listed(block).map((line, n) => (
                        <Box key={`step-${i}-${n}`} paddingLeft={2}>
                          <Text wrap="wrap" dimColor={!line.isError} color={line.isError ? 'error' : undefined}>
                            {line.isError ? `${line.text} (failed)` : line.text}
                          </Text>
                        </Box>
                      ))
                    : null}
                  {picturesOfRun(block, at)}
                </Box>
              )
            }
            if (first?.kind === 'said')
              return (
<Markdown key={`talk-${i}`} text={first.text} />
              )
            // A move to another model is one quiet line where it happened, with its time
            if (first?.kind === 'model')
              return (
                <Box key={`talk-${i}`}>
                  <Text dimColor wrap="wrap">{first.text}</Text>
                </Box>
              )
            const text = first?.text ?? ''
            const isLong = text.length > TOLD_CHARS * 2
            const isOpen = open.includes(-at - 1)
            // The long brief the work began with is one quiet row until pressed: "Started from" above already gives the person's words
            if (i === 0 && first?.kind === 'told' && isLong && !isOpen)
              return (
                <Box key={`talk-${i}`} alignItems="flex-start">
                  <Button key={`told-${at}-${presses}`} label="▸ The instructions Claude was given" plain dimColor onPress={() => fold(-at - 1)} />
                </Box>
              )
            return (
              <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start" backgroundColor={FILL} paddingX={2} paddingY={1}>
                {first?.kind === 'steer' ? <Text dimColor>{first.isWaiting ? 'You · not yet answered' : 'You'}</Text> : null}
                <Markdown text={isLong && !isOpen ? cut(text, TOLD_CHARS) : text} />
                {isLong ? <Button key={`told-${at}-${presses}`} label={isOpen ? '▾ Show less' : '▸ Show all'} plain dimColor onPress={() => fold(-at - 1)} /> : null}
              </Box>
            )
          })}
          {!lines && one.answer ? (
<Markdown text={one.answer} />
          ) : null}
        </Box>
      )
    }

    // Another chat's work whose chat cannot be read here (a chat on another Mac, or one its file no longer holds): where it is. Its
    // head has the press that opens that chat
    const theirChat = (one: Todo, c: NonNullable<Todo['chat']>) => (
      <Text dimColor wrap="wrap">{`This task runs in the chat "${chatName(c)}"${c.host ? ` on ${macName(c.host)}` : ''}.${one.status === 'working' ? ' Stop it or change its model there.' : ''}`}</Text>
    )
    // The press on another chat's name that opens it, wherever the app can open that chat (a chat of the app on this Mac, or one Remote
    // Control serves)
    const openTheirs = (one: Todo, c: NonNullable<Todo['chat']>) => {
      const s = otherChats.find(other => other.chat === c.id && other.host === c.host)
      return s && pressOf(s) ? <Button key={`their-chat-${one.id}-${presses}`} label="Open that chat ↗" plain onPress={() => void ((presses += 1), openChat($, s))} /> : null
    }

    // What the work reported as it ended, the first of it, whole on a press
    const resultPart = (one: Todo) => {
      if (one.status === 'working' || !one.answer.trim()) return null
      const whole = one.answer.trim()
      const short = cut(whole, RESULT_SHOWN)
      const isLong = short !== whole
      return part(
        'part-result',
        'Result',
        '',
        <Box flexDirection="column">
          <Markdown text={isLong && !open.includes(OPEN_RESULT) ? short : whole} />
          {isLong ? opener(OPEN_RESULT, open.includes(OPEN_RESULT) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      const parent = one.parentId ? [...all, ...elsewhere, ...helpersThere].find(card => card.id === one.parentId) : undefined
      return (
        <Box key={`todo-${one.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {one.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={LIVE} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{titleOf(one)}</Text>
                {facts(one, true)}
              </Box>
              {parent ? (
                <Box flexDirection="row" alignItems="flex-start">
                  <Button key={`open-parent-${one.id}-${presses}`} label={`↑ A helper of: ${cut(titleOf(parent), Math.max(20, room - 16))}`} plain dimColor hover={{ scope: `parent-${one.id}`, underline: true }} onPress={() => openWork($, parent.id)} />
                </Box>
              ) : null}
              {one.chat ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1}>
                  <Text dimColor wrap="wrap">{`From the chat "${chatName(one.chat)}"${chatSide(one.chat, selfName()) ? `, ${chatSide(one.chat, selfName())}` : ''}`}</Text>
                  {openTheirs(one, one.chat)}
                </Box>
              ) : null}
              {(one.status === 'working' && !one.chat) || left(one) || (one.status === 'stopped' && one.byYou && !one.chat) ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
                  {/* Work the person stopped stays stopped until they start it again from here or ask in a message */}
                  {one.status === 'stopped' && one.byYou && !one.chat ? <Button key={`again-${one.id}-${presses}`} label="Start again" onPress={() => ((presses += 1), void startAgain($, one.id))} /> : null}
                  {left(one) ? <Button key={`artifact-${one.id}-${presses}`} label="Result" onPress={() => void openReport($, left(one)?.id ?? '')} /> : null}
                </Box>
              ) : null}
            </Box>
          </Box>
          {/* What it made, right under its title, while it works and once it is done */}
          {madeNow($, one)?.made.length || madeNow($, one)?.code ? part('part-files', 'Files', '', madeTiles($, table, madeNow($, one) ?? { made: [] }, paneId, `files-${one.id}`, e.surface) ?? <Box />) : null}
          {one.admins?.length || cardNotesOf(one.id, at).length ? (
            <Box key="part-gates" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Waiting for you</Text>
                {adminBlock($, table, one, `gates-big-${one.id}`, at)}
              </Box>
            </Box>
          ) : null}
          {runningOn(one.id).length && !one.chat ? (
            <Box key="part-runs" flexDirection="column" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              {runBlock($, table, one, `runs-big-${one.id}`, at)}
            </Box>
          ) : null}
          {one.ask ? (
            <Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>{needsPerson(one) ? 'Waiting for you' : 'Claude is working on your reply'}</Text>
                {askBlock(one, `ask-big-${one.id}`, true)}
              </Box>
            </Box>
          ) : sentLine(one, at) ? (
            <Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Box flexDirection="column" gap={1} minWidth={0}>
                <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
                {canTakeBack(one, at) ? <Button key={`take-back-big-${one.id}-${heldAnswer(one, at)?.at ?? 0}`} label={`↶ Take back “${cut(heldAnswer(one, at)?.text ?? '', 30)}”`} plain onPress={() => void ((presses += 1), takeBack($, one, heldAnswer(one, at)?.at ?? 0).catch(err => log($, `answer not taken back: ${String(err)}`)))} /> : null}
              </Box>
            </Box>
          ) : null}
          {resultPart(one)}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {endedRunsPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
            ? part('part-chat', 'Conversation', '', theirChat(one, one.chat))
            : part('part-chat', 'Conversation', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading the conversation…</Text>)}
        </Box>
      )
    }

    // The app's own prompt open in a chat, amber at the top of that chat's cards, in plain words: which work asks, what it asks, exactly
    // what (the command, the message), what a yes and a no each do, and Yes and No that answer it while its chat holds it. Not held
    // (a question, a plan, a chat of an older version), it says where to answer it, and a chat of the Claude app on this Mac opens at a
    // press. Another chat's prompt has no Yes or No here: it is answered in that chat, and a press on Open that chat takes the person there
    const promptButtons = (p: Prompt, key: string) => {
      const press = (said: 'yes' | 'no') => () => void (answerPrompt($, p.id, said), redraw($))
      return (
        <Box key={`prompt-buttons-${key}`} flexDirection="row" gap={1}>
          <Button key={`prompt-yes-${key}-${presses}`} label="Yes" variant="primary" onPress={press('yes')} />
          <Button key={`prompt-no-${key}-${presses}`} label="No" onPress={press('no')} />
        </Box>
      )
    }
    // Only this chat's own prompt, while this chat holds it: another chat's is answered in that chat, as no file may answer one
    const isHeldHere = (p: Prompt, c?: Shared) => Boolean(!c && p.isHeld && promptHeld.has(p.id))
    // Drawn as Claude Code draws its permission asks, as the admin gate's are: an outlined box with the kind of ask at its top, never
    // a filled card with an edge as work's cards are
    // On its own work's card it leaves out the work's title, which the card says above it
    const promptCard = (p: Prompt, key: string, where: string, c?: Shared, isOnCard = false) => (
      <Box key={`prompt-${key}`} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
        <Box flexDirection="column">
          <Text dimColor wrap="truncate-end">{`${p.kind === 'question' ? 'Question' : p.kind === 'plan' ? 'Plan' : 'Permission'} · ${isHeldHere(p, c) || !c ? 'waiting for you' : 'waiting in another chat'}`}</Text>
          {isOnCard ? null : <Text bold wrap="truncate-end">{p.title || (c ? 'That chat itself' : 'This chat itself')}</Text>}
          {/* At the top, away from its chat's name: which chat it is */}
          {c ? <Text key={`prompt-${key}-chat`} dimColor wrap="truncate-end">{`In the chat “${chatName(c)}”${c.host ? ` on ${macName(c.host)}` : ''}`}</Text> : null}
          <Text dimColor wrap="wrap">{p.kind === 'question' ? 'Has a question for you' : p.kind === 'plan' ? 'Wants you to approve its plan' : 'Needs your permission'}</Text>
        </Box>
        <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
        {p.detail ? (
          <Box backgroundColor={FILL} paddingLeft={2} paddingRight={1}>
            <Text mono wrap="wrap">{p.detail}</Text>
          </Box>
        ) : null}
        {p.yes || p.no ? (
          <Box flexDirection="column">
            {p.yes ? <Text wrap="wrap">{p.yes}</Text> : null}
            {p.no ? <Text wrap="wrap">{p.no}</Text> : null}
          </Box>
        ) : null}
        {isHeldHere(p, c) ? promptButtons(p, key) : <Text dimColor wrap="wrap">{where}</Text>}
        {c && pressOf(c) && !isHeldHere(p, c) ? (
          <Box flexDirection="row">
            <Button key={`prompt-open-${key}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`)))} />
          </Box>
        ) : null}
      </Box>
    )
    // Where a prompt is answered: in this chat, the box Claude Code shows at its bottom
    const answerHere = (p: Prompt) => (p.kind === 'question' ? 'Pick your answer in the box at the bottom of this chat.' : 'Answer Yes or No in the box at the bottom of this chat.')
    // The same prompt once answered, for a minute after its call ends: what the person said and what is happening now, in the colour
    // of what came of it (purple while it runs, grey once over)
    const saidOf = (p: Prompt) => {
      if (p.answered === 'stopped') return 'It ended before you answered · nothing happened'
      if (p.answered === 'no') return p.kind === 'question' ? 'You skipped it · Claude got no answer and is waiting for you' : p.kind === 'plan' ? 'You said no · Claude keeps planning' : p.title ? "You said no · it didn't run, and Claudopus told Claude" : "You said no · it didn't run, and Claude is waiting for what you say next"
      if (p.kind === 'question') return p.isRunning ? 'You answered · Claude has your answer' : 'You answered · Claude is continuing with your answer'
      if (p.kind === 'plan') return 'You approved the plan · Claude is carrying it out'
      if (p.isCut) return 'You allowed it · it stopped before it finished'
      return p.isRunning ? 'You allowed it · it is running now' : `You allowed it · ${p.done ?? 'it ran and is done'}`
    }
    // Once answered it is a line of what was done, as the gate's notes are: no box, fill or edge
    // On its own work's card, without the work's title
    const answeredCard = (p: Prompt, key: string, c?: Shared, isOnCard = false) =>
      reportLine(table, `answered-${key}`, p.answered !== 'no' && p.answered !== 'stopped' && !p.isCut, saidOf(p), isOnCard ? [p.text] : [p.title || (c ? 'That chat itself' : 'This chat itself'), p.text])

    // The name of a chat above its cards, with its folder and the Mac it runs on when another. Another chat's name opens that chat in
    // the Claude app when pressed, where its link opens here
    const chatHead = (key: string, name: string, side: string, c?: Shared) => {
      const url = c ? pressOf(c) : ''
      const label = <Text bold dimColor wrap="truncate-end">{name}</Text>
      return (
        <Box key={`chat-head-${key}`} flexDirection="column" paddingTop={1} flexShrink={0}>
          {/* One line whatever the name's length: cut short, never wrapped */}
          <Box flexDirection="row" alignItems="flex-start" gap={2} paddingX={2} height={1} overflow="hidden">
            <Box flexGrow={1} flexShrink={1} minWidth={0} height={1} overflow="hidden">
              {c && url ? (
                <Button key={`chat-open-${key}`} plain hover={{ underline: true }} onPress={() => void openChat($, c)}>
                  {label}
                </Button>
              ) : (
                <Box flexShrink={1} minWidth={0} paddingLeft={lead}>{label}</Box>
              )}
            </Box>
            {side ? (
              <Box flexShrink={0}>
                <Text dimColor wrap="truncate-end">{side}</Text>
              </Box>
            ) : null}
          </Box>
        </Box>
      )
    }

    // The newest result a piece of work left, which its open card links to
    const left = (one: Todo) => kept.filter(r => r.agent === one.id).sort((a, b) => b.at - a.at)[0]

    // Work that has ended, under the running cards: one folded row (work that still asks, or still runs something, stays above), so nothing above it moves. Unfolded, the newest first, each a
    // steady row of two lines (what it was, how it ended, its model, how long it took, when) that opens its card as for running work
    // Other chats' ended work folds in here too, once its pause is over; the row then says it holds every chat's
    // Work shown finished only because it left its chat's file is not kept there: its chat said nothing of how it ended
    const endedElsewhere = elsewhere.filter(one => one.status !== 'working' && !one.ask && !lingers(one, at) && !isVanished(one.id))
    // Each other chat's cards under its name: running, asking, or in the pause after ending. A chat with none of these and no prompt
    // is not listed at all, however many are open: the app's own list of chats has them
    const shownOf = (c: Shared) => elsewhere.filter(one => one.chat?.id === c.chat && one.chat.host === c.host && (one.status === 'working' || one.ask || lingers(one, at)))
    const listedChats = otherChats.filter(c => shownOf(c).length || c.prompts?.length || answeredOf(c.answeredPrompts).length)
    const finished = [...own.filter(one => one.status !== 'working' && !isLingering(one, at) && !one.ask && !isLeftStopped(one, at)), ...endedElsewhere].sort((a, b) => b.endedAt - a.endedAt)
    const finishedPart = (isOpen: boolean) =>
      finished.length || endedFlows.length ? (
        <Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button
                key={`finished-fold-${presses}`}
                label={`${isOpen ? '▾' : '▸'} Finished ${finished.length + endedFlows.length}`}
                plain
                hotkey={keyed ? 'f' : undefined}
                onPress={() => void ((presses += 1), isOpen && (foldPress = presses), update($, view, v => ({ ...v, isFinishedOpen: !v.isFinishedOpen })))}
              />
            </Box>
            <Text dimColor>{endedElsewhere.length ? 'all chats' : 'this chat'}</Text>
          </Box>
          {isOpen
            ? [...finished.map(one => ({ at: one.endedAt, card: () => small(one) })), ...endedFlows.map(f => ({ at: f.endedAt, card: () => flowSmall(f) }))].sort((a, b) => b.at - a.at).map(one => one.card())
            : null}
        </Box>
      ) : null

    // A workflow's Details tab: what it is, with Stop; where it started; its stages in order; its rounds, each with its agents and
    // its outcome; one agent's chat at a time, picked from the rounds; and what it returned once it ended
    const flowBig = (f: Flow, picked: FlowAgent | undefined, lines: Line[] | undefined) => {
      const rounds = roundsOf(f)
      const current = stageOf(f)
      const agentRow = (one: FlowAgent) => {
        const isPicked = picked?.id === one.id
        const facts = [modelName(one.model ?? ''), one.status === 'working' ? (f.status === 'working' ? 'working' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ')
        return (
          <Box key={`flow-agent-${one.id}`} flexDirection="row" alignItems="flex-start" gap={1} paddingLeft={2}>
            <Button
              key={`flow-pick-${one.id}-${presses}`}
              label={`${isPicked ? '▾' : '▸'} ${one.label || one.phase || 'helper'}`}
              plain
              dimColor={!isPicked}
              onPress={() => ((presses += 1), flowPicked.set(f.id, one.id), void update($, view, v => ({ ...v })))}
            />
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="wrap">{facts}</Text>
            </Box>
          </Box>
        )
      }
      return (
        <Box key={`flow-${f.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {f.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={FLOW} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{f.title}</Text>
                <Text dimColor wrap="wrap">{flowGlance(f)}</Text>
              </Box>
              <Box flexDirection="column">
                <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                  {squaresRow(f, rounds, `flow-big-squares-${f.id}`)}
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {stateWord(f, rounds)}
                  </Text>
                </Box>
              </Box>
              {f.status === 'working' && f.session === flowMine ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  <Button key={`flow-stop-${f.id}`} label="Stop" onPress={() => void stopFlow($, f.id)} />
                </Box>
              ) : null}
            </Box>
          </Box>
          {f.words || f.task ? askPart({ ...started(f.id, '', f.title, f.words || f.task, f.startedAt) }) : null}
          {part(
            'part-stages',
            'Stages',
            f.name,
            <Box flexDirection="column" gap={1}>
              {f.phases.map((p, i) => {
                const ran = f.agents.filter(one => one.phase === p.title)
                const isNow = p.title === current
                return (
                  <Box key={`flow-phase-${i}`} flexDirection="row" alignItems="flex-start" gap={1}>
                    {isNow ? <Text color={FLOW}>■</Text> : <Text dimColor>{ran.length ? '✓' : '○'}</Text>}
                    <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={isNow ? FLOW : undefined} bold={isNow} dimColor={!isNow}>
                        {p.title}
                      </Text>
                      <Text wrap="wrap" dimColor>
                        {[p.detail, modelName(p.model ?? ''), ran.length ? `${ran.length} ${ran.length === 1 ? 'helper' : 'helpers'}` : ''].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                  </Box>
                )
              })}
            </Box>,
          )}
          {part(
            'part-rounds',
            'Rounds',
            roundsLabel(f, rounds),
            <Box flexDirection="column" gap={1}>
              {rounds.length ? null : <Text dimColor>{f.status === 'working' ? 'The first round is starting.' : 'No helper ran.'}</Text>}
              {rounds.map(r => (
                <Box key={`flow-round-${r.n}`} flexDirection="column">
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {squaresRow(f, [r], `flow-round-squares-${r.n}`, r.n)}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={r.isOpen ? FLOW : undefined} bold={r.isOpen} dimColor={!r.isOpen}>{`Round ${r.n}: ${verdict(r)}`}</Text>
                    </Box>
                  </Box>
                  {r.agents.map(agentRow)}
                  {r.findings.length && r.pass === false ? (
                    <Box flexDirection="column" paddingLeft={4}>
                      {r.findings.map((one, i) => (
                        <Text key={`flow-finding-${r.n}-${i}`} wrap="wrap" dimColor>{`– ${one}`}</Text>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ))}
            </Box>,
          )}
          {picked
            ? part(
                'part-chat',
                `Conversation of the ${picked.label || picked.phase || 'helper'}${rounds.length > 1 ? ` · round ${rounds.find(r => r.agents.some(one => one.id === picked.id))?.n ?? ''}` : ''}`,
                modelName(picked.model ?? ''),
                talk({ ...started(picked.id, '', picked.label, '', picked.at), answer: picked.result ?? '' }, lines, new Map()),
              )
            : null}
          {f.status !== 'working' && f.result ? part('part-result', 'Result', '', <Markdown text={f.result} />) : null}
        </Box>
      )
    }
    if (paneId.startsWith(FLOW_PANE)) {
      if (!flowShown) return <Text dimColor>This workflow is no longer available.</Text>
      const picked = pickedOf(flowShown)
      const lines = picked ? await flowTalkOf($, flowShown, picked).catch(() => undefined) : undefined
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>
      )
    }

    // A Details tab stays, even once its work has ended, until it is closed; work no longer kept says so
    const alone = [...all, ...elsewhere, ...helpersThere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This task is done, or its chat is closed. Open that chat to see it.' : 'This task is no longer available.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    // Another chat's is read from that chat's own file, on this Mac
    if (alone) void (alone.chat ? loadTheirs($, alone) : loadWork($, alone.id)).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = uiOf($, e)
    // A terminal too narrow to dock the panel seats it above the prompt, a few rows tall
    const isInline = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    // Everything that waits on the person, every chat's, together at the top under the header, in the order it came: the oldest
    // first, and what comes later under it, so nothing waiting moves down as more comes (17 Nov, the person: the yellow "jumps
    // around"). A key box or a prompt a task's own command raised is drawn on that task's card; what belongs to no card shown here
    // (a box or a prompt of the chat itself, a gate with no card, another chat's prompt) is a notice of its own among the cards
    const shownIds = new Set(shownWork.map(one => one.id))
    const cardOfAgent = (agent?: string) => {
      const id = agent ? topOf(all, agent) : ''
      return id && shownIds.has(id) ? id : ''
    }
    const keysHeld = e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk))
    onCards = new Map()
    const putOnCard = (card: string, row: { at: number; key: string; what: string; node: JSX.Element }) => void onCards.set(card, [...(onCards.get(card) ?? []), row])
    for (const row of boxRows($, ui, keysHeld, e.surface, one => Boolean(cardOfAgent(one.agent)), true)) putOnCard(cardOfAgent(row.one.agent), { at: row.at, key: `box-${row.one.id}`, what: boxHead(row.one.text), node: row.node })
    // The chat's own prompt to start a task belongs, once answered, to the card that task started: the one its words name
    const startedCard = (p: Waiting) => {
      if (p.agent || (p.tool !== 'Agent' && p.tool !== 'Task') || p.answered === 'no' || p.answered === 'stopped') return ''
      const words = oneLine(p.input?.description ?? '')
      const begun = shownWork.filter(one => !one.chat && oneLine(titleOf(one)) === words && one.startedAt >= p.at - 5000).sort((a, b) => a.startedAt - b.startedAt)
      return begun[0]?.id ?? ''
    }
    doneOnCards = new Map()
    for (const p of promptsAnswered) {
      const card = cardOfAgent(p.agent) || startedCard(p)
      if (card) doneOnCards.set(card, [...(doneOnCards.get(card) ?? []), { at: p.at, key: `answered-${p.id}`, node: answeredCard(p, `this-${p.id}`, undefined, true) }])
    }
    promptsLoose = promptsAnswered.filter(p => !cardOfAgent(p.agent) && !startedCard(p))
    for (const p of waiting.filter(p => cardOfAgent(p.agent))) putOnCard(cardOfAgent(p.agent), { at: p.at, key: `prompt-${p.id}`, what: p.text, node: promptCard(p, `this-${p.id}`, answerHere(p), undefined, true) })
    const notices = [
      // A box that comes while the person types a reply in the terminal leaves the keys with that reply
      ...boxRows($, ui, keysHeld, e.surface, one => !cardOfAgent(one.agent)).map(row => ({ at: row.at, what: boxHead(row.one.text), node: row.node })),
      ...looseGates.map(gate => ({ at: gate.at, what: gateWhat(gate), node: gateRow($, ui, gate, `gate-${gate.id}`, false) })),
      ...waiting.filter(p => !cardOfAgent(p.agent)).map(p => ({ at: p.at, what: p.text, node: promptCard(p, `this-${p.id}`, answerHere(p)) })),
      ...otherChats.flatMap(c => {
        const url = pressOf(c)
        return (c.prompts ?? []).map(p => ({ at: p.at, what: p.text, node: promptCard(p, `${c.host}-${c.chat}-${p.id}`, c.host && !url ? `Answer it in that chat, on ${macName(c.host)}` : c.host ? `Answer it in that chat, which runs on ${macName(c.host)}` : 'Answer it in that chat', c) }))
      }),
    ]
    // A work that waits on the person comes to the top whole, its ask, its gate, its key box or its prompt in it as ever; once a gate
    // is answered, what was done shows in the card, outlined green, and the card stays at the top until that goes
    const isAsking = (one: Todo) => Boolean(one.ask) && !isActingOnReply(one)
    const isWaitingPress = (one: Todo) => one.status === 'working' && Boolean(one.admins?.length)
    const ownCount = (one: Todo) => (one.chat ? 0 : (onCards.get(one.id)?.length ?? 0))
    // Each thing that waits, counted once: a card with a question and a key box waits on two
    const waitsOn = (one: Todo) => (isAsking(one) ? 1 : 0) + (isWaitingPress(one) ? (one.admins ?? []).filter(gate => !gatePressed.has(gate.id)).length : 0) + ownCount(one)
    const isOpen = (one: Todo) => waitsOn(one) > 0
    // An ask answered on its card keeps the card where it was, its answer said in it, for ANSWER_SHOWN: a press or a reply never
    // takes the card from under the person's eyes, as a gate answered on its card does not
    const answeredSince = (one: Todo) => {
      return heldAnswer(one, at)?.at ?? 0
    }
    // An answered card keeps the place its ask had among what waits, so nothing still waiting slides into the spot just pressed
    const answeredPlace = (one: Todo) => (answeredSince(one) ? (sentReplies.get(one.id)?.askAt ?? answeredSince(one)) : 0)
    const placeKey = (one: Todo) => `${one.chat?.host ?? ''}/${one.chat?.id ?? ''}/${one.id}`
    // While anything still waits, a card that waited keeps its place at the top, answered or not: only once nothing waits do the
    // answered ones go back among the rest, so working down the list never moves what is still to answer
    // (for KEPT_MOST at most after a card's own answer, so a request nobody here can answer, another chat's, never pins it for long)
    const isAnyOpen = notices.length > 0 || shownWork.some(isOpen) || listedChats.some(c => shownOf(c).some(isOpen))
    // Something the person can answer here: while it waits, an answered card keeps its place however long; only while all that waits
    // is another chat's does it go back after KEPT_MOST
    const isOpenHere = notices.length > otherChats.reduce((n, c) => n + (c.prompts?.length ?? 0), 0) || shownWork.some(isOpen)
    const isKeptPlace = (one: Todo) => topPlaces.has(placeKey(one)) && (isOpenHere || at - (topClosed.get(placeKey(one)) ?? at) < KEPT_MOST)
    const isWaits = (one: Todo) => isOpen(one) || answeredSince(one) > 0 || (isAnyOpen && isKeptPlace(one))
    // A card that waited and now only says what was done (a gate answered) keeps its place too while it says so: what comes later
    // goes under it, never above
    const isKeptUp = (one: Todo) => isWaits(one) || (!one.chat && cardNotesOf(one.id, at).length > 0 && isKeptPlace(one))
    // Where a card stands among what waits: where it first came, kept for as long as it stays up there
    const cameAt = (one: Todo) => Math.min(isAsking(one) ? (one.ask?.at ?? Infinity) : Infinity, ...(isWaitingPress(one) ? one.admins ?? [] : []).map(gate => gate.at), ...(one.chat ? [] : (onCards.get(one.id) ?? []).map(row => row.at)))
    const placeOf = (one: Todo) => topPlaces.get(placeKey(one)) ?? (Number.isFinite(cameAt(one)) ? cameAt(one) : answeredPlace(one) || at)
    // Just finished: up at the top, right under what waits, the newest first, each for its own two seconds
    const isFinishing = (one: Todo) => !isWaits(one) && isFinishMoment(one)
    const finishFrom = (one: Todo) => (one.chat ? (endSeen.get(`${one.id}:${one.endedAt}`) ?? one.endedAt) : pauseFrom(one))
    // Finished but left something running: after its moment it stays up, under what waits, with its Stop it, never back among the rest
    const isLeftUp = (one: Todo) => !one.chat && one.status !== 'working' && Boolean(one.leftSince) && !isWaits(one) && !isFinishing(one)
    // A command you ran on a press, while it runs or its output waits for its ended task: up with what it is and its press
    const isUp = (one: Todo) => isWaits(one) || isFinishing(one) || isLeftUp(one) || (!one.chat && (cardNotesOf(one.id, at).length > 0 || runningOn(one.id).length > 0))
    const upSince = (one: Todo) => Math.max(...(one.chat ? [] : runningOn(one.id).map(run => run.startedAt ?? 0)), ...(one.chat ? [] : cardNotesOf(one.id, at).map(note => note.at)), 0)
    const askingHere = shownWork.filter(isUp)
    const askingThere = listedChats.flatMap(c => shownOf(c).filter(isUp))
    const askCards = [...askingHere, ...askingThere]
    // The places kept: set as a card comes up among what waits, dropped as it leaves
    if (paneId === LIST) {
      const waitingNow = new Set(askCards.filter(isKeptUp).map(placeKey))
      for (const one of askCards) {
        const key = placeKey(one)
        if (!topPlaces.has(key)) continue
        if (!isOpen(one)) {
          if (!topClosed.has(key)) topClosed.set(key, at)
        } else if (topClosed.has(key)) ((topClosed.get(key) ?? 0) <= cameAt(one) ? topPlaces.set(key, cameAt(one)) : undefined, topClosed.delete(key))
      }
      for (const one of askCards.filter(isWaits)) if (!topPlaces.has(placeKey(one))) topPlaces.set(placeKey(one), placeOf(one))
      for (const key of [...topPlaces.keys()]) if (!waitingNow.has(key)) (topPlaces.delete(key), topClosed.delete(key))
    }
    const restHere = shownWork.filter(one => !isUp(one))
    const restFlows = shownFlows.filter(f => !isFlowMoment(f))
    // Each card keeps the place it began in: work started again (Release it on an ended ask) never moves to the end
    const begun = (one: Todo) => one.begunAt ?? one.startedAt
    // What waits first, notices and cards in the order they came; under it what just finished, the newest first; then cards that only
    // say what was allowed or left something running. A card is drawn when the panel is
    const finishingFlows = shownFlows.filter(isFlowMoment)
    const whatOf = (one: Todo) => (isAsking(one) ? oneLine(one.ask?.text ?? '') : (onCards.get(one.id)?.[0]?.what ?? (one.admins?.[0] ? gateWhat(one.admins[0]) : '')))
    const top = [
      ...notices.map(one => ({ rank: 0, at: one.at, what: one.what, draw: () => one.node })),
      ...askCards.map(one => (isKeptUp(one) ? { rank: 0, at: placeOf(one), what: isOpen(one) ? whatOf(one) : '', draw: () => small(one) } : isFinishing(one) ? { rank: 1, at: -finishFrom(one), what: '', draw: () => small(one) } : { rank: 2, at: -Math.max(upSince(one), isLeftUp(one) ? one.endedAt : 0), what: '', draw: () => small(one) })),
      ...finishingFlows.map(f => ({ rank: 1, at: -pauseFrom(f), what: '', draw: () => flowSmall(f) })),
    ].sort((a, b) => a.rank - b.rank || a.at - b.at)
    const waitsCount = notices.length + askCards.reduce((n, one) => n + waitsOn(one), 0)
    keptUpNow = new Set(askCards.filter(isKeptUp).map(one => one.id))
    // The terminal's keys stay with the ask they were on while it waits
    if (keysAsk && !askingHere.some(one => one.id === keysAsk && isAsking(one))) keysAsk = ''
    // The header says what every card under it says, every chat's: what needs the person, what runs here and in other chats, and
    // work that just finished (happy too for a workflow in its pause whose card turned green: it finished and its last round passed)
    const runningThere = elsewhere.filter(one => one.status === 'working' && !needsPerson(one))
    const head = {
      here: working.filter(one => !needsPerson(one)).length + runningFlows.length,
      there: runningThere.length,
      chats: new Set(runningThere.map(one => `${one.chat?.host}/${one.chat?.id}`)).size,
      // Each thing at the top counts once, as the line above the prompt counts them
      asks: waitsCount,
      isDone: isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(isFlowMoment),
    }
    const mood = headMood(head)
    // A letter for each header button, in the terminal alone, and only while the panel has no password box to type in: there the
    // letters are the person's words, never a press. An ask's reply box takes the keys itself (askFocused)
    const isKeyed = e.surface === 'terminal' && !boxes.length
    keyed = isKeyed
    const versions = alone ? { version: '', installed: '', isWaiting: false } : await versionsOf($)
    // Just moved to a newer version whose changes the person has not seen: one quiet line in the header, with What's new, until closed
    const screen = alone ? undefined : await updateScreen($, ui, versions.version, head.asks, e.surface)
    // A password or key box stays above it: the runner waits on it
    if (paneId === LIST && !alone) {
      // Where this surface's list stands, as the person or a press last moved it (each move draws it again)
      const was = listOffsets.get(e.surface) ?? 0
      listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset))
      const count = waitsCount
      const finishedNow = [...askCards.filter(isFinishing).map(titleOf), ...finishingFlows.map(f => f.title)]
      if (finishedNow.join('\n') !== finishedAtTop.join('\n')) ((finishedAtTop = finishedNow), drawAgain($))
      const first = top.find(one => one.rank === 0 && one.what)?.what ?? ''
      if (count !== waitsAtTop || first !== firstAtTop || (was > 0) !== ((listOffsets.get(e.surface) ?? 0) > 0)) ((waitsAtTop = count), (firstAtTop = first), drawAgain($))
    }
    const updated = alone || !versions.version ? undefined : await updatedPieces($, versions.version)
    // Where updating stands for this chat: a small box under the header's lines, its steps each a press
    const outCard = alone ? null : (await noticeCard($, ui, await noticeNow($, versions.version, versions.installed).catch(() => undefined), versions.version).catch(() => null)) ?? screen ?? null

    // While the person uses the list scrolled down, it is drawn at least as tall as the bottom of what they see, so a card that
    // shrinks under them (their own answer) never snaps the view up. Blank space shows only where a card shrank inside the view, and
    // only until the list is drawn again once they leave it alone. The height the app reports is no guide: it
    // is this drawing's own, held height included, and kept as the most it had ever been it left the list at the length of its
    // longest moment of the chat, blank under three cards (16 Nov, Dima's screenshot). Folding Finished is not held (foldPress)
    const heldRows = paneId === LIST && e.surface === 'desktop' && isInUse(at, e.props.scroll.offset) && presses !== foldPress ? e.props.scroll.offset + e.props.scroll.bodyRows : 0
    return (
      <Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={Math.max(e.props.scroll.bodyRows, heldRows)}>
        {!alone ? (
          // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
          // them, which wraps onto a second row in a narrow pane rather than cutting anything off
          <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                  panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, `Claudopus, updated to ${versions.version}`, $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, waiting for you', happy: 'Claudopus, a task is done', working: 'Claudopus, Claude is working', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                {/* Just moved to a newer version: "Claudopus updated" in blue, then the new version, for the moment */}
                {updated ? (
                  nameLine(ui, updated)
                ) : (
                  <Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                    <Box flexShrink={0}>
                      <Text bold>Claudopus</Text>
                    </Box>
                    {/* The Mac has a newer copy than this chat runs: said beside the version, with what to type to switch to it */}
                    {versions.version ? (
                      <Text key="head-version" dimColor wrap={versions.isWaiting ? 'wrap' : 'truncate-end'}>{`v${versions.version}${versions.isWaiting ? ` · v${versions.installed} is ready: type /reload-plugins to use it` : ''}`}</Text>
                    ) : null}
                  </Box>
                )}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 && chat.window ? `This chat is ${fill(chat.tokens, chat.window)}` : chat.tokens > 0 ? 'This chat has started' : 'This chat has just begun'}</Text>}
              </Box>
            </Box>
            {outCard}
            {/* Wrapped rows keep the same gap as the buttons beside each other; a terminal's gap would be a whole blank line, so it has none */}
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={e.surface === 'terminal' ? 0 : 1}>
              {reportsButton($, ui, kept, isKeyed)}
              {statsButton($, ui, isKeyed)}
              {memoryButton($, ui, isKeyed)}
              {configButton($, ui, isKeyed)}
              {aboutButton($, ui, isKeyed)}
              {isInline && !e.props.isFocused ? <Text key="head-keys-short" dimColor>ctrl+x then Tab to use the keys</Text> : null}
            </Box>
            {/* The terminal reaches a pane from the keys only after ctrl+x Tab, which nothing else tells; once it holds them each
                button above answers its first letter */}
            {e.surface === 'terminal' && (e.props.isFocused || !isInline) ? (
              <Text key="head-keys" dimColor wrap="wrap">
                {!e.props.isFocused ? 'ctrl+x then Tab to use the keys' : [...own, ...elsewhere].some(one => one.ask) ? 'What you type goes in the reply box · Tab leaves it for the keys shown · Esc: back to the chat' : 'Esc: back to the chat'}
              </Text>
            ) : null}
          </Box>
        ) : null}
        {!alone ? top.map(one => one.draw()) : null}
        {!alone ? doneNotesPart(ui, at) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown, in the order it began; what waits on the
              // person is above, at the top. Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (restHere.length || restFlows.length || promptsLoose.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...promptsLoose.map(p => answeredCard(p, `this-${p.id}`)),
              ...[...restHere.map(one => ({ at: begun(one), card: () => small(one) })), ...restFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, with what is left of it once its asks are at the top
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).filter(one => !isUp(one)).sort((a, b) => begun(a) - begun(b))
                const answered = answeredOf(c.answeredPrompts).map(p => answeredCard(p, `${c.host}-${c.chat}-${p.id}`, c))
                return cards.length || answered.length ? [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...answered, ...cards.map(one => small(one))] : []
              }),
            ]}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
    })()
    // A click begun while this drawing was made: the drawing on screen is given instead, so the buttons under the pointer stay the
    // ones the engine holds, and this one is made again once the click is over (holdForPress)
    if (recent && paneId === LIST && isPressHeld(await $.clock.now())) return ((isPressMissed = true), recent as Awaited<ReturnType<typeof next>>)
    // Overtaken by a newer drawing that is already made: not kept, and the newer one is given in its place
    if ((shownKept.get(shownKey) ?? 0) > askedNo && recent !== undefined) return lastShown.get(shownKey) as Awaited<ReturnType<typeof next>>
    shownKept.set(shownKey, askedNo)
    shownSigns.set(shownKey, sign)
    shownAts.set(shownKey, heldAt)
    heldDrawings.set(heldKey, { shape, content, at: heldAt, fresh: freshness, drawing })
    lastShown.set(shownKey, drawing)
    drawnPanes.set(paneId, { shape, content, at: heldAt, side: sideSign() })
    isMade = true
    return drawing
    } finally {
      // (a drawing given again from heldDrawings, or one that threw, counts as none made)
      freshEnds($, shownKey, isMade ? { at: heldAt, ms: Date.now() - madeFrom, fresh: freshness } : undefined)
    }
    } finally {
      if (paneId === LIST) listDrawing -= 1
    }
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}



