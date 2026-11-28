// Task colours and links at the end. Config's Task colours (`taskColours`, on as shipped) puts each chat reply about a task in a
// box of that task's colour, headed by its name (a press opens its Details) and Reply (the box above the chat, to that task), and
// gives its card the same colour dot. Links at the end (`replyLinks`, on as shipped) ends each chat reply with the links it gave,
// each led by where it goes, and lists in a task's Details every link the chat gave about it. Which reply is about which task is
// read from the chat's own transcript (../../mods/claudopus/hooks/colours.ts)

// The two settings as this chat has them, read with the others (loadSettings)
let isColoured = true
let isLinked = true
const EMPTY_COLOURS: ColourIndex = { tasks: {}, replies: {}, texts: {}, rows: {}, said: {} }
let colourIndex: ColourIndex = EMPTY_COLOURS
let colourBuilder: ColourBuilder | undefined
let colourRunning: Promise<void> | undefined
let colourWanted: 'none' | 'more' | 'all' = 'none'
let colourTimer: Timer | undefined
let colourWritten = ''

const colourHex = (slot: number) => PALETTE[slot % PALETTE.length] ?? PALETTE[0]
// The edge of a reply's box that passes on no result: grey, on a light and a dark chat alike
const QUIET_EDGE = '#80808070'
// Each card's colour, kept on the card (Todo.colour): the chat's own cards are given one as they are made, in the same change of
// the list (changeTodos), the one least used by the tasks started just before, so tasks seen together never share one (27 Nov: two
// working cards were both red). Cards made before this came in get theirs at the next change. The list as last given, by id
const cardSlots = new Map<string, number>()
const withColours = (list: Todo[]) => {
  const own = list.filter(one => !one.parentId && !one.chat)
  const fresh = slotsFor(own.map(one => ({ id: one.id, startedAt: one.begunAt ?? one.startedAt, colour: one.colour })))
  const next = Object.keys(fresh).length ? list.map(one => (fresh[one.id] === undefined ? one : { ...one, colour: fresh[one.id] })) : list
  for (const one of next) if (one.colour !== undefined) cardSlots.set(one.id, one.colour)
  return next
}
// The colour of a task of this chat's: its card's, else the one its replies were given; none while colours are off
const taskColour = (id: string) => {
  if (!isColoured) return undefined
  const card = cardSlots.get(id)
  if (card !== undefined) return colourHex(card)
  const slot = colourIndex.tasks[id]?.colour ?? colourBuilder?.colours[id]
  return slot === undefined ? undefined : colourHex(slot)
}
// The links the chat's replies about a task gave, newest first; none while links are off
const taskLinks = ($: EngineInterface, id: string) => {
  if (!isLinked) return []
  // Its Details reads the rows since at most every 10 seconds, so a link given since shows there
  colourSoon($, 10_000, !isColoured)
  return colourIndex.tasks[id]?.links ?? []
}
const isColourRead = () => isColoured || isLinked

// The results this chat was given to pass on, the newest last: a reply that passes one on, as it came, is about its task
// (`isPart`: a part of its result, handed in by a task still at work)
const givenResults: { id: string; text: string; isPart?: boolean }[] = []
const resultGiven = (id: string, text: string, isPart = false) => {
  givenResults.push({ id, text: text.slice(0, 20_000), isPart })
  givenResults.splice(0, Math.max(0, givenResults.length - 30))
}
// One stretch of a reply: the whole of it, or what stands between two lines of dashes; the task whose result it passes on, if any
type ReplyBit = { text: string; id?: string; isPart: boolean }
const BIT_RULE = /^[ \t]*-{3,}[ \t]*$/m
// The tasks a drawn reply is about: the one whose result it passes on (given this load, or the end report a card keeps), else by
// its row id, else by its words (the desktop app names a reply by its message's id). `bits`: a reply that passes on several results
// at once, a line of dashes between them, as each stretch of it (28 Nov, the person, of two tasks' results in one box under the
// first one's name: "it's confusing because now it's one message in two bits")
const replyTasks = async ($: EngineInterface, requestId: string, text: string) => {
  const cards = (await read($, todos)).filter(one => !one.parentId && !one.chat)
  const finals = [...cards.filter(one => one.answer).map(one => ({ id: one.id, text: one.answer ?? '' })), ...givenResults.filter(one => !one.isPart)]
  const parts = [...cards.flatMap(one => (one.partsGiven ?? []).map(part => ({ id: one.id, text: part }))), ...givenResults.filter(one => one.isPart)]
  const bitOf = (bit: string): ReplyBit => {
    const [last, part] = [passedOn(bit, finals), passedOn(bit, parts)]
    const id = [last, part].find(one => one && cards.some(card => card.id === one))
    return { text: bit, ...(id ? { id } : {}), isPart: Boolean(id) && id !== last }
  }
  const split = text.split(BIT_RULE).map(bit => bit.trim()).filter(Boolean).map(bitOf)
  const found = split.filter(bit => bit.id)
  const bits = found.length > 1 ? split : []
  // (a reply is known by its first words, which run on into the next result where it passes on several: then by its first stretch)
  const whole = [bitOf(text), ...found].find(bit => bit.id)
  if (whole?.id) {
    colourBuilder ??= new ColourBuilder()
    colourBuilder.pick(whole.id)
    return { ids: [whole.id], cards, isResult: true, isPart: whole.isPart, bits }
  }
  return { ids: (colourIndex.replies[requestId] ?? colourIndex.texts[colourTextHash(text)] ?? []).filter(id => colourIndex.tasks[id]), cards, isResult: false, isPart: false, bits }
}
// Result on a reply that passes on a task's result: the whole of it, of which the chat shows only the short result, in a tab of the
// panel (results-tab.tsx); its Details where none is kept yet
const openResultOf = async ($: EngineInterface, id: string) => {
  const kept = (await ownReports($).catch(() => [] as Report[])).find(r => r.agent === id)
  if (kept) openReport($, kept.id)
  else openWork($, id)
}

// The person's messages in the chat, the newest last, those sent while the chat was at work among them: the transcript keeps no row
// of those, so which task each went to is read from what the chat passed on (Builder.index). Kept as each is sent (chat.tsx), and
// read back from what they said in this chat once a load, from words/<chat>.said.md
const HEARD_KEPT = 40
let personHeard: string[] = []
let isHeardRead = false
const heardSaid = (text: string) => {
  const words = personWords(text)
  if (words) personHeard = [...personHeard, words].slice(-HEARD_KEPT)
}
const readHeard = async ($: EngineInterface) => {
  if (isHeardRead || !dir) return
  isHeardRead = true
  const { id } = await read($, me)
  const text = id ? await readOr($, `${dir}/words/${id}.said.md`) : ''
  // Each message under its own `## <time>` line; the newest of the file, then what came since it was read
  const kept = text.slice(-60_000).split(/^## \S+.*$/m).slice(1).map(one => personWords(one)).filter(Boolean)
  personHeard = [...kept, ...personHeard].slice(-HEARD_KEPT)
}
// What the person wrote to each of this chat's tasks on their cards, as the transcript reader takes it
const cardWords = (list: readonly Todo[]): CardWords[] => list.flatMap(one => (one.parentId || one.chat ? [] : (one.written ?? []).map(w => ({ id: one.id, ...w }))))
// A message written on a card is kept with where the transcript stands as it goes, read to its end first, so a reply that comes
// after it, and only such a reply, quotes it (27 Nov: a result quoted a chat message of the day's, not what was written on its card)
const WRITTEN_KEPT = 6
const writtenOnCard = async ($: EngineInterface, id: string, text: string) => {
  if (!isColoured || !text.trim()) return
  await colourBuild($, false)
  const at = colourBuilder?.stamp()
  if (!at) return
  await changeTodos($, list => list.map(one => (one.id === id ? { ...one, written: [...(one.written ?? []), { text: text.trim(), ...at }].slice(-WRITTEN_KEPT) } : one)))
  await colourBuild($, false)
}

// One pass: reads the rows not yet read (every row the first time) and keeps what it found, redrawing when that changed
const colourPass = async ($: EngineInterface, isWhole: boolean) => {
  const every = await $.session.messages().catch(() => [])
  const rows = Array.isArray(every) ? every : []
  let builder = colourBuilder
  // Read afresh the first time, when asked, and when the transcript is shorter than what was read (a compaction)
  if (!builder || isWhole || rows.length < builder.read) builder = new ColourBuilder(builder?.colours ?? {})
  const fresh = rows.slice(builder.read)
  colourBuilder = builder
  builder.ingest(fresh)
  await readHeard($).catch(err => log($, `messages said not read back: ${String(err)}`))
  const value = builder.index({ cards: cardWords(await read($, todos)), heard: personHeard })
  const json = JSON.stringify(value)
  if (json === colourWritten) return
  colourWritten = json
  colourIndex = value
  redraw($)
}
// Passes run one at a time; a call while one runs asks for one more after it
const colourBuild = ($: EngineInterface, isWhole: boolean) => {
  if (!isColourRead()) return Promise.resolve()
  if (colourRunning) {
    colourWanted = isWhole || colourWanted === 'all' ? 'all' : 'more'
    return colourRunning
  }
  colourRunning = (async () => {
    let next: 'none' | 'more' | 'all' = isWhole ? 'all' : 'more'
    while (next !== 'none') {
      colourWanted = 'none'
      await colourPass($, next === 'all')
      next = colourWanted as 'none' | 'more' | 'all'
    }
  })()
    .catch(err => log($, `replies not sorted by task: ${String(err)}`))
    .finally(() => {
      colourRunning = undefined
    })
  return colourRunning
}
// A pass soon, asked by a drawing that may show what the last pass did not read: a reply it knows nothing of, a task's Details. At
// most one waits, and none starts within `gap` of the last, so a tab drawn every second reads the transcript only now and then.
// (Not on each new row: Claude Code's hook for that runs on every row of every task, and held each of them up.)
// Each pass is given the whole chat, copied to this code: once COLOUR_LONG rows are read none starts within COLOUR_GAP of the last
// (a reply as it is written is a new text at every drawing), and the last one asked still gets its pass when that is over. An ask
// that knows of no new row (`isNew` false: Details while colours are on, where each new reply asks for itself) reads once in
// COLOUR_IDLE at most
const COLOUR_LONG = 400
const COLOUR_GAP = 3_000
const COLOUR_IDLE = 60_000
let colourPassAt = 0
let colourNews = 0
let colourRead = 0
let colourGap = Infinity
const colourAsked = new Set<string>()
const colourSoon = ($: EngineInterface, gap = 400, isNew = true) => {
  if (!isColourRead()) return
  if (isNew) colourNews += 1
  colourGap = Math.min(colourGap, gap)
  if (colourTimer) return
  const look = (wait: number) => {
    colourTimer = $.clock.after(wait, () => {
      colourTimer = undefined
      void $.clock.now().then(now => {
        const isFresh = colourNews !== colourRead
        const least = Math.max(colourGap, isFresh ? ((colourBuilder?.read ?? 0) > COLOUR_LONG ? COLOUR_GAP : 0) : COLOUR_IDLE)
        const since = now - colourPassAt
        if (since >= 0 && since < least) return isFresh && least <= COLOUR_GAP && !colourTimer ? look(least - since) : void (colourGap = Infinity)
        ;[colourPassAt, colourRead, colourGap] = [now, colourNews, Infinity]
        return colourBuild($, false)
      })
    })
  }
  look(400)
}

// Reply on a reply's box opens the box above the chat, to that task: its answer box while it asks something, else the box Message
// opens on its card, else the box that continues from its result. Only the terminal, whose bar has no box, opens its Details
const replyToTask = async ($: EngineInterface, id: string, surface: string) => {
  if (surface === 'terminal') return openWork($, id)
  const one = (await read($, todos)).find(card => card.id === id)
  if (one?.ask && needsPerson(one)) return openBar($, { kind: 'answer', id, one }, surface)
  if (one && canChange(one)) return openBar($, { kind: 'change', id }, surface)
  const kept = (await ownReports($)).find(r => r.agent === id)
  if (kept) return openBar($, { kind: 'continue', id: kept.id }, surface)
  openWork($, id)
}

// What you wrote to a task, quoted small under its name in each reply about it, so you remember what you asked: about three lines
// (its first three, at most QUOTE_CHARS, as small letters run about 80 to a line in a narrow chat), and View more for the rest. A box of
// three rows would hold four lines of small letters: rows are the body text's. Its press is kept for the reply it was made on
const quotesOpen = new Set<string>()
const QUOTE_LINES = 3
const QUOTE_CHARS = 240
const quoteShort = (words: string) => cut(words.split('\n').slice(0, QUOTE_LINES).join('\n'), QUOTE_CHARS)
const quoteOf = ($: EngineInterface, ui: Ui, key: string, words: string) => {
  const short = quoteShort(words)
  const isLong = short !== words
  const isOpen = quotesOpen.has(key)
  return (
    <ui.Box key={`quote-${key}`} flexDirection="column">
      <ui.Text key="quote-words" size="footnote" dimColor wrap="wrap">{`“${isLong && !isOpen ? `${short.replace(/\s*…$/, '')}…` : words}”`}</ui.Text>
      {isLong ? (
        <ui.Button
          key={`quote-more-${key}-${presses}`}
          label={isOpen ? 'View less' : 'View more'}
          plain
          dimColor
          onPress={() => {
            presses += 1
            if (isOpen) quotesOpen.delete(key)
            else quotesOpen.add(key)
            redraw($)
          }}
        />
      ) : null}
    </ui.Box>
  )
}

// A list of links, one a line, each led by where it goes
// (a page served on this computer is named as this computer is: This PC on Windows)
const linkList = (links: readonly TaskLink[]) => links.map(link => `- **${link.kind === 'This Mac' ? `T${thisMac().slice(1)}` : link.kind}** · [${link.label.replace(/[[\]]/g, '')}](${link.url})`).join('\n')

// What waits for the person on a card and is answered with a button: its questions and permissions, never a password, a key or
// the disk
const pressNeeds = ($: EngineInterface, card: Todo, surface: string, now: number) =>
  needsOf($, asPressed(card), surface, now).filter(need => (need.kind === 'permission' || need.kind === 'question') && !need.isActing && need.buttons.some(button => !button.isOpener))
// Said in the chat already, by Claudopus or the chat, each by its block and when it was asked: said once
const waitsSaid = new Set<string>()
// One asked longer ago than this is no news: after an update of the mod, what has waited for hours is not said again
const WAITS_FRESH = 15 * 60_000
// The line for each card of this chat's that asks the person something not yet said in the chat, for a turn only a paused
// task's notice started (work.tsx); nothing when there is none
const waitsToSay = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const lines: string[] = []
  for (const card of (await read($, todos)).filter(one => !one.parentId && !one.chat)) {
    const needs = pressNeeds($, card, '', now)
    if (!needs.some(need => !waitsSaid.has(`${need.id}:${need.at}`) && now - need.at < WAITS_FRESH)) continue
    for (const need of needs) waitsSaid.add(`${need.id}:${need.at}`)
    lines.push(WAITS_LINE(titleOf(card)))
  }
  if (lines.length) await log($, `said in the chat, with no model asked, what waits for ${who()}: ${lines.length === 1 ? 'one card' : `${lines.length} cards`}`)
  return [...new Set(lines)].join('\n\n')
}
// A reply that holds such a line: each is taken out of its words and drawn under them as its card's question with its buttons,
// the very block its card has, and once that is answered as one grey line (memory.tsx draws the two). Nothing for a reply with
// no such line
const waitsIn = async ($: EngineInterface, e: { requestId: string; surface: string; props: { text: string } }, ui: Ui) => {
  const lines = e.props.text.split('\n')
  if (!dir || isOff || !lines.some(line => WAITS_TITLE.test(line.trim()))) return undefined
  const cards = (await read($, todos)).filter(one => !one.parentId && !one.chat)
  const now = await $.clock.now()
  const { Box, Button, Text } = ui
  const blocks: JSX.Element[] = []
  const held: string[] = []
  for (const line of lines) {
    const title = WAITS_TITLE.exec(line.trim())?.[1]
    // The card of that name that asks something, else the newest of that name; a line that names no card stays words
    const named = title === undefined ? [] : cards.filter(one => titleOf(one) === title)
    const card = named.find(one => pressNeeds($, one, e.surface, now).length) ?? named.at(-1)
    if (title === undefined || !card) {
      held.push(line)
      continue
    }
    const needs = pressNeeds($, card, e.surface, now)
    for (const need of needs) waitsSaid.add(`${need.id}:${need.at}`)
    const n = blocks.length
    blocks.push(
      <Box key={`waits-${n}`} flexDirection="column" gap={1}>
        <Box key="waits-head" flexDirection="row">
          <Text color={taskColour(card.id) ?? NEEDS}>● </Text>
          <Button key={`waits-open-${card.id}-${presses}`} plain hover={{ scope: `waits-open-${n}-${card.id}`, underline: true }} onPress={() => openWork($, card.id)}>
            <Text bold>{cut(title, 60)}</Text>
          </Button>
        </Box>
        {needs.length ? needs.map(need => needBlock($, ui, need, { surface: e.surface })) : <Text key={`waits-done-${n}`} dimColor>✓ Answered</Text>}
      </Box>,
    )
  }
  return blocks.length ? { rest: held.join('\n').trim(), blocks } : undefined
}

// A chat reply as drawn, with its task's box around it while colours are on and its links at its end while links are on
const withTaskBox = async ($: EngineInterface, e: { requestId: string; surface: string; props: { text: string; isSummary?: boolean } }, reply: JSX.Element, ui: Ui) => {
  if (e.props.isSummary || e.props.text.trim() === NO_ANSWER) return reply
  const given = isLinked ? replyLinksIn(e.props.text) : []
  const { ids, cards, isResult, isPart, bits } = isColoured ? await replyTasks($, e.requestId, e.props.text) : { ids: [] as string[], cards: [] as Todo[], isResult: false, isPart: false, bits: [] as ReplyBit[] }
  // A reply the last pass did not read: the rows since are read, and it is drawn again in its box, quoting the message it answers.
  // A reply found by the result it passes on too, as the person's newest message to its task may have come since that pass (27 Nov:
  // a result quoted the message before the one it answered). Once for each text: a reply about no task asks no pass again
  const hash = colourTextHash(e.props.text)
  if (isColoured && !colourIndex.texts[hash] && colourIndex.rows[hash] === undefined && !colourAsked.has(hash)) (colourAsked.add(hash), colourSoon($))
  const [first] = ids
  if (!first && !given.length) return reply
  const { Box, Button, Markdown, Text } = ui
  const links = given.length ? (
    <Box key="reply-links" flexDirection="column">
      <Text dimColor>Links</Text>
      <Markdown text={linkList(given)} />
    </Box>
  ) : null
  // A task's colour and name: from what the transcript told, else its card
  const colourOfTask = (id: string) => taskColour(id) ?? colourHex(colourIndex.tasks[id]?.colour ?? colourBuilder?.colours[id] ?? 0)
  const titleOfTask = (id: string) => colourIndex.tasks[id]?.title ?? (() => {
    const card = cards.find(one => one.id === id)
    return card ? titleOf(card) : 'Task'
  })()
  if (!first)
    return (
      <Box key={`linked-${mark(e.requestId)}`} flexDirection="column" gap={1}>
        {reply}
        {links}
      </Box>
    )
  // Colour is a card's own, never the task's, which is only the dot before its name, as on its card (28 Nov, the person: "colors
  // kinda make it confusing maybe only for important bits of text?"; twelve colours of box told nothing of what a reply was)
  // The edge is its task's card's colour, as it stands now: purple at work, amber while it waits for the person, blue delivered,
  // green once marked done, red failed, orange interrupted, grey stopped; with no card, a result's blue, a part's purple, else grey
  // (28 Nov, the person: "I've marked one of them as done, and it's still blue in the chat", then "Purple if it's in progress,
  // Blue if it's delivered, Yellow if it needs you, Green if it's completed ... just make it consistent")
  type Kind = 'result' | 'part' | 'other'
  const edgeOf = (kind: Kind, id?: string) => {
    const card = cards.find(one => one.id === id)
    return (card ? stageColor(stageOf(cards, card)) : kind === 'result' ? DELIVERED : kind === 'part' ? LIVE : undefined) ?? QUIET_EDGE
  }
  // A box's head: its task's dot and name, which opens its Details; on a result, Result, which opens the whole of it; Reply
  // (`tag`: which stretch of the reply it heads, where it has several)
  const headOf = (id: string, kind: Kind, tag = '') => (
    <Box key={`task-${tag}${id}`} flexDirection="row" columnGap={2}>
      {/* The dot outside the button, as the app draws a button's words in its own colour */}
      <Box key={`task-name-${id}`} flexDirection="row">
        <Text color={colourOfTask(id)}>● </Text>
        <Button key={`task-open-${tag}${id}-${presses}`} plain hover={{ scope: `task-open-${tag}${id}`, underline: true }} onPress={() => openWork($, id)}>
          <Text bold>{cut(titleOfTask(id), 60)}</Text>
        </Button>
      </Box>
      {kind === 'part' ? <Text key={`task-part-${id}`} color={edgeOf(kind, id)}>{cards.find(one => one.id === id)?.status === 'working' ? 'Part · still working' : 'Part'}</Text> : null}
      {kind === 'other' ? null : <Button key={`task-result-${tag}${id}-${presses}`} label="Result" plain hover={{ scope: `task-result-${tag}${id}`, underline: true }} onPress={() => void openResultOf($, id).catch(err => log($, `result not opened: ${String(err)}`))} />}
      <Button key={`task-reply-${tag}${id}-${presses}`} label="Reply" plain dimColor hover={{ scope: `task-reply-${tag}${id}`, underline: true }} onPress={press => void replyToTask($, id, press.surface).catch(err => log($, `reply box not opened: ${String(err)}`))} />
    </Box>
  )
  // The person's message a reply about a task answers: the newest they sent that task before it, in the chat or on its card, else
  // the one that started it. A reply not read yet, as it comes, is the newest of all
  const quoteOn = (id: string, tag = '') => {
    const row = colourIndex.rows[e.requestId] ?? colourIndex.rows[hash]
    const words = (quoteFor(colourIndex, id, row) ?? cards.find(one => one.id === id)?.words ?? '').trim()
    return words ? quoteOf($, ui, `${mark(e.requestId)}-${tag}${id}`, words) : null
  }
  // Several results in one reply: each in a box of its own, under its own task's name, with what the chat said around them plain
  if (bits.length)
    return (
      <Box key={`task-boxes-${mark(e.requestId)}`} flexDirection="column" gap={1}>
        {bits.map((bit, n) =>
          bit.id ? (
            <Box key={`task-box-${mark(e.requestId)}-${n}`} flexDirection="column" borderStyle="round" borderColor={edgeOf(bit.isPart ? 'part' : 'result', bit.id)} paddingX={1} gap={1}>
              <Box key="task-box-head" flexDirection="row" flexWrap="wrap" columnGap={2}>
                {headOf(bit.id, bit.isPart ? 'part' : 'result', `${n}-`)}
              </Box>
              {quoteOn(bit.id, `${n}-`)}
              <Markdown key={`task-bit-${n}`} text={bit.text} />
            </Box>
          ) : (
            <Markdown key={`task-bit-${n}`} text={bit.text} />
          ),
        )}
        {links}
      </Box>
    )
  const kind: Kind = isResult ? (isPart ? 'part' : 'result') : 'other'
  return (
    <Box key={`task-box-${mark(e.requestId)}`} flexDirection="column" borderStyle="round" borderColor={edgeOf(kind, first)} paddingX={1} gap={1}>
      <Box key="task-box-head" flexDirection="row" flexWrap="wrap" columnGap={2}>
        {ids.map(id => headOf(id, kind))}
      </Box>
      {quoteOn(first)}
      {reply}
      {links}
    </Box>
  )
}

