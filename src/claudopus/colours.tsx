// Task colours and links at the end. Config's Task colours (`taskColours`, off as shipped) puts each chat reply about a task in a
// box of that task's colour, headed by its name (a press opens its Details) and Reply (the box above the chat, to that task), and
// gives its card the same colour dot. Links at the end (`replyLinks`, on as shipped) ends each chat reply with the links it gave,
// each led by where it goes, and lists in a task's Details every link the chat gave about it. Which reply is about which task is
// read from the chat's own transcript (../../mods/claudopus/hooks/colours.ts)

// The two settings as this chat has them, read with the others (loadSettings)
let isColoured = false
let isLinked = true
const EMPTY_COLOURS: ColourIndex = { tasks: {}, replies: {}, texts: {} }
let colourIndex: ColourIndex = EMPTY_COLOURS
let colourBuilder: ColourBuilder | undefined
let colourRunning: Promise<void> | undefined
let colourWanted: 'none' | 'more' | 'all' = 'none'
let colourTimer: Timer | undefined
let colourWritten = ''

const colourHex = (slot: number) => PALETTE[slot % PALETTE.length] ?? PALETTE[0]
// The colour of a task of this chat's, once a reply about it is known; none while colours are off
const taskColour = (id: string) => {
  if (!isColoured) return undefined
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

// The tasks a drawn reply is about: by its row id, else by its words (the desktop app names a reply by its message's id)
const replyTasks = (requestId: string, text: string) =>
  (colourIndex.replies[requestId] ?? colourIndex.texts[colourTextHash(text)] ?? []).filter(id => colourIndex.tasks[id])

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
  const value = builder.index()
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

// Reply on a reply's box: the box above the chat, to that task, where the bar takes one and the task takes a message; its Details
// otherwise, whose message box is at its bottom
const replyToTask = async ($: EngineInterface, id: string, surface: string) => {
  const one = (await read($, todos)).find(card => card.id === id)
  if (one && canChange(one) && repliesInBar(surface)) return openBar($, { kind: 'change', id }, surface)
  openWork($, id)
}

// A list of links, one a line, each led by where it goes
const linkList = (links: readonly TaskLink[]) => links.map(link => `- **${link.kind}** · [${link.label.replace(/[[\]]/g, '')}](${link.url})`).join('\n')

// A chat reply as drawn, with its task's box around it while colours are on and its links at its end while links are on
const withTaskBox = async ($: EngineInterface, e: { requestId: string; surface: string; props: { text: string; isSummary?: boolean } }, reply: JSX.Element, ui: Ui) => {
  if (e.props.isSummary || e.props.text.trim() === NO_ANSWER) return reply
  const given = isLinked ? replyLinksIn(e.props.text) : []
  const ids = isColoured ? replyTasks(e.requestId, e.props.text) : []
  // A reply the last pass did not read: the rows since are read, and it is drawn again in its box
  // (once for each text: a reply about no task stays out of its box, and asks no pass again)
  const hash = colourTextHash(e.props.text)
  if (isColoured && !ids.length && !colourIndex.texts[hash] && !colourAsked.has(hash)) (colourAsked.add(hash), colourSoon($))
  const [first] = ids
  if (!first && !given.length) return reply
  const { Box, Button, Markdown, Text } = ui
  const links = given.length ? (
    <Box key="reply-links" flexDirection="column">
      <Text dimColor>Links</Text>
      <Markdown text={linkList(given)} />
    </Box>
  ) : null
  if (!first)
    return (
      <Box key={`linked-${mark(e.requestId)}`} flexDirection="column" gap={1}>
        {reply}
        {links}
      </Box>
    )
  return (
    <Box key={`task-box-${mark(e.requestId)}`} flexDirection="column" borderStyle="round" borderColor={colourHex(colourIndex.tasks[first]?.colour ?? 0)} paddingX={1} gap={1}>
      <Box key="task-box-head" flexDirection="row" flexWrap="wrap" columnGap={2}>
        {ids.map(id => {
          const task = colourIndex.tasks[id]
          return (
            <Box key={`task-${id}`} flexDirection="row" columnGap={2}>
              {/* The dot outside the button, as the app draws a button's words in its own colour */}
              <Box key={`task-name-${id}`} flexDirection="row">
                <Text color={colourHex(task?.colour ?? 0)}>● </Text>
                <Button key={`task-open-${id}-${presses}`} plain hover={{ scope: `task-open-${id}`, underline: true }} onPress={() => openWork($, id)}>
                  <Text bold>{cut(task?.title ?? 'Task', 60)}</Text>
                </Button>
              </Box>
              <Button key={`task-reply-${id}-${presses}`} label="Reply" plain dimColor hover={{ scope: `task-reply-${id}`, underline: true }} onPress={press => void replyToTask($, id, press.surface).catch(err => log($, `reply box not opened: ${String(err)}`))} />
            </Box>
          )
        })}
      </Box>
      {reply}
      {links}
    </Box>
  )
}

