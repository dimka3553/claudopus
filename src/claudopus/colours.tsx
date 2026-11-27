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
  colourSoon($, 10_000)
  return colourIndex.tasks[id]?.links ?? []
}
const isColourRead = () => isColoured || isLinked

// The results this chat was given to pass on, the newest last: a reply that passes one on, as it came, is about its task
const givenResults: { id: string; text: string }[] = []
const resultGiven = (id: string, text: string) => {
  givenResults.push({ id, text: text.slice(0, 20_000) })
  givenResults.splice(0, Math.max(0, givenResults.length - 30))
}
// The tasks a drawn reply is about: the one whose result it passes on (given this load, or the end report a card keeps), else by
// its row id, else by its words (the desktop app names a reply by its message's id)
const replyTasks = async ($: EngineInterface, requestId: string, text: string) => {
  const cards = (await read($, todos)).filter(one => !one.parentId && !one.chat)
  const passed = passedOn(text, [...cards.filter(one => one.answer).map(one => ({ id: one.id, text: one.answer ?? '' })), ...givenResults])
  if (passed && cards.some(one => one.id === passed)) {
    colourBuilder ??= new ColourBuilder()
    colourBuilder.pick(passed)
    return { ids: [passed], cards }
  }
  return { ids: (colourIndex.replies[requestId] ?? colourIndex.texts[colourTextHash(text)] ?? []).filter(id => colourIndex.tasks[id]), cards }
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
let colourPassAt = 0
const colourAsked = new Set<string>()
const colourSoon = ($: EngineInterface, gap = 400) => {
  if (colourTimer || !isColourRead()) return
  colourTimer = $.clock.after(400, () => {
    colourTimer = undefined
    void $.clock.now().then(now => {
      if (now - colourPassAt < gap) return
      colourPassAt = now
      return colourBuild($, false)
    })
  })
}

// Reply on a reply's box opens the box above the chat, to that task: its answer box while it asks something, else the box Message
// opens on its card, else the box that continues from its result. Only the terminal, whose bar has no box, opens its Details
const replyToTask = async ($: EngineInterface, id: string, surface: string) => {
  if (surface === 'terminal') return openWork($, id)
  const one = (await read($, todos)).find(card => card.id === id)
  if (one?.ask && needsPerson(one)) return openBar($, { kind: 'answer', id, one }, surface)
  if (one && canChange(one)) return openBar($, { kind: 'change', id }, surface)
  const kept = (await read($, reports)).find(r => r.agent === id)
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
const linkList = (links: readonly TaskLink[]) => links.map(link => `- **${link.kind}** · [${link.label.replace(/[[\]]/g, '')}](${link.url})`).join('\n')

// A chat reply as drawn, with its task's box around it while colours are on and its links at its end while links are on
const withTaskBox = async ($: EngineInterface, e: { requestId: string; surface: string; props: { text: string; isSummary?: boolean } }, reply: JSX.Element, ui: Ui) => {
  if (e.props.isSummary || e.props.text.trim() === NO_ANSWER) return reply
  const given = isLinked ? replyLinksIn(e.props.text) : []
  const { ids, cards } = isColoured ? await replyTasks($, e.requestId, e.props.text) : { ids: [] as string[], cards: [] as Todo[] }
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
  return (
    <Box key={`task-box-${mark(e.requestId)}`} flexDirection="column" borderStyle="round" borderColor={colourOfTask(first)} paddingX={1} gap={1}>
      <Box key="task-box-head" flexDirection="row" flexWrap="wrap" columnGap={2}>
        {ids.map(id => {
          return (
            <Box key={`task-${id}`} flexDirection="row" columnGap={2}>
              {/* The dot outside the button, as the app draws a button's words in its own colour */}
              <Box key={`task-name-${id}`} flexDirection="row">
                <Text color={colourOfTask(id)}>● </Text>
                <Button key={`task-open-${id}-${presses}`} plain hover={{ scope: `task-open-${id}`, underline: true }} onPress={() => openWork($, id)}>
                  <Text bold>{cut(titleOfTask(id), 60)}</Text>
                </Button>
              </Box>
              <Button key={`task-reply-${id}-${presses}`} label="Reply" plain dimColor hover={{ scope: `task-reply-${id}`, underline: true }} onPress={press => void replyToTask($, id, press.surface).catch(err => log($, `reply box not opened: ${String(err)}`))} />
            </Box>
          )
        })}
      </Box>
      {(() => {
        // The person's message this reply answers: the newest they sent its task before it, in the chat or on its card, else the
        // one that started it. A reply not read yet, as it comes, is the newest of all
        const row = colourIndex.rows[e.requestId] ?? colourIndex.rows[hash]
        const words = (quoteFor(colourIndex, first, row) ?? cards.find(one => one.id === first)?.words ?? '').trim()
        return words ? quoteOf($, ui, `${mark(e.requestId)}-${first}`, words) : null
      })()}
      {reply}
      {links}
    </Box>
  )
}

