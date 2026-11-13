// The Results tab and each result's own tab: the list, a result drawn whole, put away and brought back

// Puts a line naming the report in the chat's box, for the person to finish and send; where there is no box, nothing is sent for them
const carryOn = async ($: EngineInterface, r: Report, now: number) => {
  const text = `Carry on from the result "${r.title}" (${dated(r.at, now)}), ${reportPath(r)}/report.md: `
  // What the person had typed stays: the line goes after it
  const typed = (await $.prompt.read().catch(() => ({ text: '' }))).text
  const filled = await $.prompt.fill(typed.trim() ? { text: `\n${text}`, mode: 'append' } : { text, mode: 'replace' }).catch(() => ({ isFilled: false }))
  if (!filled.isFilled) await log($, 'the chat box was not filled from a report')
}
// The person's answer to one thing a report waits on them for: Yes and No go to the chat as their message; Not now sets it aside.
// It clears that one alone
const answering = new Set<string>()
const answerWait = async ($: EngineInterface, r: Report, index: number, said: 'Yes' | 'No' | 'Not now', now: number) => {
  const wait = waitsOf(r)[index]
  // A second press before the answer is kept sends nothing more
  if (!wait || wait.answer || answering.has(`${r.id}:${index}`)) return
  answering.add(`${r.id}:${index}`)
  if (said !== 'Not now') await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "${said}" in answer to what the result "${r.title}" (${dated(r.at, now)}) waits on them for: ${wait.text}\nThe result: ${reportPath(r)}/report.md`)
  // Not now kept nowhere can be pressed again; a Yes or No already sent is not sent twice
  await markReport($, r, stored => ({ waiting: waitsOf(stored).map((one, at) => (at === index ? { ...one, answer: said } : one)) })).catch(err => {
    if (said === 'Not now') answering.delete(`${r.id}:${index}`)
    throw err
  })
}
// ---- Reports in panes of their own: the list as "Reports", and each report opened as a pane titled with its name ----

// The list's pane; a report's pane is named after the report. At most this many reports are open as panes: opening one more
// closes the one opened longest ago
const REPORTS_PANE = 'reports'
const REPORTS_TITLE = 'Results'
const REPORT_PANES = 3
// A pane's id is at most 64 letters, digits, '_' and '-': a longer one keeps its head and a mark of the whole, so two never meet
const paneOf = (r: Report) => {
  const id = `report-${r.id.replace(/[^A-Za-z0-9_-]/g, '-')}`
  return id.length <= 64 ? id : `${id.slice(0, 52)}-${mark(r.id).replace(/\D/g, '').slice(-11)}`
}
// Which picture each open report shows, by its pane
const pictureAt = new Map<string, number>()
const redraw = ($: EngineInterface) => $.ui.invalidate('ui.render')
// Opens a pane from a press, in front: the app leaves a pane already open where it is, behind another tab, so one open but not
// shown is opened again
// The tabs as the engine lists them, one word each: id, then s shown, f holding the keyboard, p drawn, for the log
const rosterOf = (panes: { id: string; isShown: boolean; isFocused: boolean; isPlaced: boolean }[]) =>
  panes.map(pane => `${pane.id}:${pane.isShown ? 's' : ''}${pane.isFocused ? 'f' : ''}${pane.isPlaced ? 'p' : ''}`).join(' ') || 'none'
const front = async ($: EngineInterface, id: string, title: string) => {
  const shown = async () => Boolean((await $.ui.panes()).find(pane => pane.id === id)?.isShown)
  // A press inside a tab gives that tab the keyboard, and the engine never shows a new tab over the one holding it: it waits on
  // the screen to honour the open's focus, which a screen with a turn running or text in the box refuses (seen every press in a
  // chat the app runs on another Mac over ssh). The tab holding the keyboard is closed and opened again first, so it lets go.
  // The new tab opens behind it before that, so the sidebar always holds a tab: with none open it slid shut and open again
  // In a chat the app runs on another Mac over ssh the engine has no surface to ask ("no-surface"): it lists the open tabs but
  // says of none that it is shown, drawn or holding the keyboard, though the app draws them and one does hold it. There every
  // other tab of the mod may be the one pressed in, so each is closed and opened again, in the order they stand. Elsewhere a
  // roster that says nothing has nothing drawn, and is left alone
  const before = await $.ui.panes()
  const isBlind = isRunFromAfar && before.length > 0 && !before.some(pane => pane.isPlaced || pane.isShown || pane.isFocused)
  const holding = before.filter(pane => (isBlind || pane.isFocused) && pane.id !== id)
  if (isBlind) await log($, `front ${id}: the engine says no tab is shown or holding the keyboard; ${holding.length} other tabs closed and opened again first`)
  if (holding.length && !(await $.ui.panes()).some(pane => pane.id === id)) await $.ui.open({ id, title })
  for (const held of holding) {
    await $.ui.close({ id: held.id }).catch(() => undefined)
    await $.ui.open({ id: held.id, title: held.title }).catch(err => log($, `${held.id} not opened again: ${String(err)}`))
  }
  // A tab open behind another is not shown, and opening it again would leave it behind: it is closed and opened again, which
  // brings it to the front (seen in the app on a press of Results and of one result)
  const was = (await $.ui.panes()).find(pane => pane.id === id)
  if (was && !was.isShown) await $.ui.close({ id }).catch(() => undefined)
  const opened = await $.ui.open({ id, title, focus: true })
  if (isRunFromAfar) await log($, `front ${id}: ${holding.length} let go first; opened ${opened.isPlaced ? 'drawn' : `undrawn (${opened.reason})`}; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
  // The pane pressed in stays in front while its press runs: once it has run, the new pane is opened again, which brings it forward
  // Only where the surface says which pane it shows: a chat the app runs on another Mac over ssh says none is shown, ever, and there
  // this open from a timer, which no press asked for, left a tab the mod never drew in place of the one drawn (seen on the M4)
  if (!(await shown()))
    $.clock.after(150, async () => {
      const panes = await $.ui.panes()
      const mine = panes.find(pane => pane.id === id)
      // Closed by the person meanwhile, already in front, or a screen that says nothing of what it shows: left as it is
      if (!mine || mine.isShown || !panes.some(pane => pane.isShown)) return
      await $.ui.close({ id }).catch(() => undefined)
      await $.ui.open({ id, title, focus: true })
      const now = (await $.ui.panes()).find(pane => pane.id === id)
      await log($, `front ${id} again: shown ${Boolean(now?.isShown)}, drawn ${Boolean(now?.isPlaced)}`)
    })
}
// A tab of the mod's own, other than the list, that is open and not drawn was left by an open no press asked for: it is closed, so
// the person never looks at an empty tab, and a press opens it again, drawn. Run as the mod loads and as the session starts
// Only while a surface places this chat's panes (one of them is drawn): with none attached every pane waits undrawn, rightly
const closeUndrawn = async ($: EngineInterface) => {
  const panes = await $.ui.panes().catch(() => [])
  if (!panes.some(pane => pane.isPlaced)) return
  for (const pane of panes) {
    if (pane.id === LIST || pane.isPlaced) continue
    // Read again just before: a press meanwhile may have opened it afresh, drawn
    if ((await $.ui.panes().catch(() => [])).find(one => one.id === pane.id)?.isPlaced !== false) continue
    await $.ui.close({ id: pane.id }).catch(() => undefined)
    await log($, `undrawn tab ${pane.id} closed`)
  }
}
// A picture that is an SVG of the work's own is drawn as it is, when it is small enough to draw
const svgOf = async ($: EngineInterface, path: string): Promise<Thumb> => {
  const text = await readOr($, path)
  return text.includes('<svg') && text.length <= SVG_CHARS ? { source: text, width: 0, height: 0 } : null
}

const openReport = ($: EngineInterface, id: string) => {
  presses += 1
  void (async () => {
    const r = (await read($, reports)).find(one => one.id === id)
    if (!r) return
    // A report brought in by hand gets its small copies when it is first opened
    await makeThumbs($, r).catch(err => log($, `small copies of report ${id} not made: ${String(err)}`))
    const open = (await $.ui.panes()).filter(pane => pane.id.startsWith('report-') && pane.id !== paneOf(r))
    for (const pane of open.slice(0, Math.max(0, open.length - (REPORT_PANES - 1)))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    // Its tab is named after it; rounds of one piece of work, which share a name, by their time too
    const kept = await read($, reports)
    const now = await $.clock.now()
    await front($, paneOf(r), kept.some(one => one.id !== r.id && one.title === r.title) ? `${cut(r.title, 22)} · ${time(r.at, now)}` : cut(r.title, 30))
    // The pressed row gets a new name, so the app does not hold the list where that button was
    redraw($)
  })().catch(err => log($, `report ${id} not opened: ${String(err)}`))
}

// Puts a result away, or brings it back: its entry, every round of its work, leaves the list and the chat's note, nothing in it
// waits, and its open tabs close. The mark is kept beside each report; nothing is deleted or rewritten
const archiving = new Set<string>()
const archiveReport = ($: EngineInterface, r: Report, isArchived: boolean) => {
  const entry = r.agent || r.id
  if (archiving.has(entry)) return
  archiving.add(entry)
  presses += 1
  void (async () => {
    // A round already put away keeps when it was; a round that came after is put away with the rest
    const kept = (await read($, reports)).filter(one => Boolean(one.archived) !== isArchived)
    const rounds = entriesOf(kept).find(entry => entry.some(one => one.id === r.id)) ?? []
    const now = await $.clock.now()
    // Each round is marked even when another's mark fails, so the press leaves as little half done as it can
    // Brought back keeps when, so another Mac that has it put away follows the later of the two
    for (const one of rounds) await markReport($, one, isArchived ? { archived: now } : { archived: undefined, broughtBack: now }).catch(err => log($, `result ${one.id} not ${isArchived ? 'archived' : 'brought back'}: ${String(err)}`))
    // One brought back is listed in its place, even one that came after the list was opened
    if (!isArchived && reportsListed.length) reportsListed =[...new Set([...reportsListed, ...rounds.map(one => one.id)])]
    if (isArchived) {
      const tabs = new Set(rounds.map(paneOf))
      for (const pane of (await $.ui.panes()).filter(one => tabs.has(one.id))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    }
  })()
    .catch(err => log($, `result ${r.id} not ${isArchived ? 'archived' : 'brought back'}: ${String(err)}`))
    .finally(() => (archiving.delete(entry), redraw($)))
}

// The reports shown when the list was last opened from the Claudopus pane. One that arrives while the person reads the list waits,
// counted in its heading, so no row moves under the pointer
let reportsListed: string[] = []
// A subject in letters the slug drops stands alone, by its id
const subjectOf = (r: Report) => slug(r.subject || r.title) || r.id
// One entry per piece of work, its newest report first and its earlier rounds after it. Rounds of one work are: the same work
// reporting again; work started from a report (its `from`); and reports on one subject whose titles lead with that subject. A report
// brought in by hand is an entry of its own unless one of these joins it
const entriesOf = (list: Report[]) => {
  const head = new Map(list.map(r => [r.id, r.id]))
  const find = (id: string): string => {
    const up = head.get(id) ?? id
    return up === id ? id : find(up)
  }
  const join = (a: string, b: string) => {
    const [x, y] = [find(a), find(b)]
    if (x !== y) head.set(x, y)
  }
  const firsts = new Map<string, string>()
  const by = (key: string, r: Report) => (firsts.has(key) ? join(r.id, firsts.get(key) as string) : firsts.set(key, r.id))
  for (const r of list) {
    if (r.agent) by(`agent:${r.agent}`, r)
    if (r.from && head.has(r.from)) join(r.id, r.from)
    const subject = slug(r.subject)
    if (subject && (slug(r.title) === subject || slug(r.title).startsWith(`${subject}-`))) by(`subject:${subject}`, r)
  }
  return [...list.reduce((all, r) => all.set(find(r.id), [...(all.get(find(r.id)) ?? []), r]), new Map<string, Report[]>()).values()]
}
// What a report waits on now: an earlier round's open items were asked again, or not, by its newest round
const newestOf = (list: Report[]) => new Set(entriesOf(list).map(entry => entry[0]?.id))
// Words that say what a piece of work is about, for telling whether a brief that names a report goes on with that work
const aboutWords = (text: string) => new Set(slug(text).split('-').filter(word => word.length >= 4 && !['with', 'from', 'that', 'this', 'into', 'your', 'what', 'when', 'work'].includes(word)))
const openReports = async ($: EngineInterface) => {
  presses += 1
  reportsListed = (await read($, reports)).map(r => r.id)
  redraw($)
  await front($, REPORTS_PANE, REPORTS_TITLE)
}
const day = (at: number, now: number) => dated(at, now).split(',')[0] ?? ''
const time = (at: number, now: number) => (day(at, now) === day(now, now) ? (dated(at, now).split(', ')[1] ?? '') : dated(at, now))

// On the Claudopus pane the reports are one small button. It sits on the line above the cards, beside the chat's own size, so
// nothing below it moves when a report arrives
const reportsButton = ($: EngineInterface, ui: Ui, all: Report[]) => {
  const { Box, Button } = ui
  const list = all.filter(r => !r.archived)
  if (!list.length) return null
  return (
    <Box key="reports-button" flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <Button key={`reports-open-${presses}`} label={`Results ${entriesOf(list).length}`} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} />
    </Box>
  )
}

// The list, one line a row: the title, when, and Archive at its right, a mark while it waits on the person. First what waits on
// the person, then the few newest, then the rest folded into one row, "Earlier N", and those put away into "Archived N". Rounds of
// one work are one row, its newest; the earlier rounds are listed inside its tab
const RECENT = 5
let isEarlierOpen = false
let isArchivedOpen = false
// When, as short as it fits its place: the time today, the day this year, the year before that
const when = (at: number, now: number) => (day(at, now) === day(now, now) ? time(at, now) : new Date(at).getFullYear() === new Date(now).getFullYear() ? day(at, now) : String(new Date(at).getFullYear()))
const reportsView = ($: EngineInterface, ui: Ui, all: Report[], now: number, line: number) => {
  const { Box, Button, Text } = ui
  const list = all.filter(r => !r.archived)
  const gone = entriesOf(all.filter(r => r.archived))
  // A new round of an entry already listed shows in its place; a new entry waits
  const shown = reportsListed.length ? entriesOf(list).filter(entry => entry.some(r => reportsListed.includes(r.id))).flat() : list
  const entries = entriesOf(shown)
  const fresh = entriesOf(list).length - entries.length
  const waiting = entries.filter(entry => isOpenQuestion(entry[0] as Report))
  const rest = entries.filter(entry => !isOpenQuestion(entry[0] as Report))
  const [recent, earlier] = [rest.slice(0, RECENT), rest.slice(RECENT)]
  const fold = (key: string, label: string, isOpen: boolean, onPress: () => void) => (
    <Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" alignItems="flex-start" flexShrink={0}>
      {/* In the rows' title column */}
      <Box width={1} flexShrink={0} />
      <Button key={`${key}-${presses}`} label={`${isOpen ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => void ((presses += 1), onPress(), redraw($))} />
    </Box>
  )
  // One row, one line: the title pressed opens it; when and Archive sit at the right, the same width on every row
  const row = (entry: Report[]) => {
    const r = entry[0]
    if (!r) return null
    return (
      <Box key={`entry-${r.id}`} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
        <Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} flexShrink={1} minWidth={0}>
          {/* In the column the folded rows' labels start in */}
          <Box width={1} flexShrink={0} />
          <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
            <Button key={`report-${r.id}-${presses}`} label={cut(r.title, line - 22)} plain onPress={() => openReport($, r.id)} />
          </Box>
        </Box>
        <Box width={6} flexShrink={0} justifyContent="flex-end">
          <Text dimColor>{when(r.at, now)}</Text>
        </Box>
        <Button key={`archive-${r.id}-${presses}`} label="Archive" plain dimColor onPress={() => archiveReport($, r, true)} />
      </Box>
    )
  }
  const rows = (group: Report[][]) => (
    <Box flexDirection="column" flexShrink={0}>
      {group.map(row)}
    </Box>
  )
  return (
    <Box key="reports" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="reports-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" alignItems="center" gap={1}>
          <Text bold>Results</Text>
          <Text dimColor>{`${entries.length}`}</Text>
        </Box>
        {fresh ? <Button key={`reports-fresh-${presses}`} label={`Show ${fresh} new`} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
      </Box>
      {!shown.length && !gone.length ? <Text dimColor>Nothing yet.</Text> : null}
      {waiting.length ? band(ui, 'reports-waiting', 'Waiting on you', `${waiting.length}`, rows(waiting)) : null}
      {recent.length ? band(ui, 'reports-recent', waiting.length ? 'Recent' : 'Newest', '', rows(recent)) : null}
      {earlier.length || gone.length ? (
        <Box key="reports-folded" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
          {earlier.length ? fold('earlier-fold', `Earlier ${earlier.length}`, isEarlierOpen, () => (isEarlierOpen = !isEarlierOpen)) : null}
          {earlier.length && isEarlierOpen ? rows(earlier) : null}
          {gone.length ? fold('archived-fold', `Archived ${gone.length}`, isArchivedOpen, () => (isArchivedOpen = !isArchivedOpen)) : null}
          {gone.length && isArchivedOpen
            ? gone.map(entry => {
                const r = entry[0]
                if (!r) return null
                return (
                  <Box key={`archived-${r.id}`} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
                    <Box flexDirection="row" gap={1} flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
                      <Box width={1} flexShrink={0} />
                      <Button key={`report-${r.id}-${presses}`} label={cut(r.title, line - 24)} plain dimColor onPress={() => openReport($, r.id)} />
                    </Box>
                    <Box width={6} flexShrink={0} justifyContent="flex-end">
                      <Text dimColor>{when(r.at, now)}</Text>
                    </Box>
                    <Button key={`unarchive-${r.id}-${presses}`} label="Bring back" plain onPress={() => archiveReport($, r, false)} />
                  </Box>
                )
              })
            : null}
        </Box>
      ) : null}
    </Box>
  )
}

// A report opened in its own pane: what it is and when; the question it waits on, with its answers; what it found; its pictures,
// with the one press that opens them all; the report itself; then how to carry on from it, and the other rounds of its work
type Thumb = { source: string; width: number; height: number } | null
const reportShown = ($: EngineInterface, ui: Ui, r: Report, text: string, list: Report[], now: number, at: number, thumb: Thumb) => {
  const { Box, Button, Markdown, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  // The other rounds of its work first, as the list shows them as one row; then what it started from or started, and the subject's others
  const rounds = (entriesOf(list.filter(one => Boolean(one.archived) === Boolean(r.archived))).find(entry => entry.some(one => one.id === r.id)) ?? []).filter(one => one.id !== r.id)
  const others = list.filter(one => one.id !== r.id && !rounds.includes(one) && (one.id === r.from || one.from === r.id || subjectOf(one) === subjectOf(r)))
  const kin = [...rounds, ...others.slice(0, Math.max(0, 8 - rounds.length))]
  const pictures = r.files.map(file => ({ file, path: `${reportPath(r)}/${file}`, href: `file://${encodeURI(`${reportPath(r)}/${file}`)}` }))
  const how = (one: Report) =>
    [one.id === r.from ? 'this started from it' : one.from === r.id ? 'started from this' : rounds.includes(one) ? (one.at < r.at ? 'earlier round' : 'later round') : '', one.archived ? 'archived' : ''].filter(Boolean).join(' · ')
  const pane = paneOf(r)
  const show = (to: number) => void ((presses += 1), pictureAt.set(pane, to), redraw($))
  return (
    <Box key={`report-${r.id}`} flexDirection="column" gap={1} flexGrow={1}>
      {/* Archive at the head's right: pressed, the tab closes; one archived says so, with Bring back */}
      <Box key="report-head" flexDirection="row" alignItems="flex-start" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold wrap="wrap">{r.title}</Text>
          <Text dimColor wrap="wrap">{[dated(r.at, now), r.subject && slug(r.subject) !== slug(r.title) ? r.subject : '', r.archived ? 'archived' : answeredOf(r)].filter(Boolean).join(' · ')}</Text>
        </Box>
        <Button key={`report-archive-${presses}`} label={r.archived ? 'Bring back' : 'Archive'} onPress={() => archiveReport($, r, !r.archived)} />
      </Box>
      {isOpenQuestion(r)
        ? band(
            ui,
            'report-ask',
            'Waiting on you',
            openWaits(r).length > 1 ? `${openWaits(r).length}` : '',
            // Each thing it waits on with its own answers; one answered leaves the others
            <Box flexDirection="column" gap={2}>
              {waitsOf(r).map((wait, index) =>
                wait.answer ? null : (
                  <Box key={`report-wait-${index}`} flexDirection="column" gap={1}>
                    <Text wrap="wrap">{wait.text}</Text>
                    <Box flexDirection="row" flexWrap="wrap" gap={1}>
                      {(['Yes', 'No', 'Not now'] as const).map(said => (
                        <Button key={`report-say-${index}-${said}-${presses}`} label={said} onPress={() => void ((presses += 1), answerWait($, r, index, said, now).catch(err => log($, `answer not kept: ${String(err)}`)))} />
                      ))}
                    </Box>
                  </Box>
                ),
              )}
            </Box>,
          )
        : null}
      {r.gist
        ? band(
            ui,
            'report-finding',
            'Finding',
            '',
            <Text wrap="wrap">{r.gist}</Text>,
          )
        : null}
      {pictures.length
        ? band(
            ui,
            'report-pictures',
            'Pictures',
            pictures.length > 1 ? `${at + 1} of ${pictures.length}` : '',
            <Box flexDirection="column" gap={1}>
              {thumb && table.Svg ? <table.Svg key={`report-picture-${r.id}-${at}`} source={thumb.source} alt={pictures[at]?.file ?? 'Picture'} /> : null}
              {/* Shown here, never handed to another app: that would take the person out of Claude and switch their desktop. Where the
                  picture cannot be drawn, its path is given as text */}
              <Text dimColor wrap="wrap">{thumb && table.Svg ? (pictures[at]?.file ?? '') : (pictures[at]?.path ?? '')}</Text>
              {pictures.length > 1 ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="center" gap={1}>
                  <Button key={`report-prev-${presses}`} label="‹ Previous" onPress={() => show((at + pictures.length - 1) % pictures.length)} />
                  <Button key={`report-next-${presses}`} label="Next ›" onPress={() => show((at + 1) % pictures.length)} />
                </Box>
              ) : null}
            </Box>,
          )
        : null}
      {band(
        ui,
        'report-text',
        'In full',
        '',
        // A link it names never leaves the app: one of its pictures is shown above, anything else stays as text
        <Markdown
            key={`report-text-${r.id}`}
            text={text.length > REPORT_CHARS ? `${text.slice(0, REPORT_CHARS)}\n\n…` : text}
            onLinkPress={link => {
              const to = pictures.findIndex(one => link.href.endsWith(`/${fileName(one.file)}`) || link.href === one.path)
              if (to >= 0) show(to)
            }}
          />,
      )}
      {band(
        ui,
        'report-carry',
        'Carry on',
        '',
        <Box flexDirection="column" alignItems="flex-start" gap={1}>
          <Text dimColor wrap="wrap">Puts a line naming this result in the chat's box, for you to finish and send.</Text>
          <Button key={`report-carry-${presses}`} label="Carry on from this" onPress={() => void ((presses += 1), redraw($), carryOn($, r, now))} />
          {kin.length ? (
            <Box flexDirection="column" alignItems="flex-start">
              {kin.map(one => (
                <Button key={`report-kin-${one.id}-${presses}`} label={[dated(one.at, now), one.title, how(one)].filter(Boolean).join(' · ')} plain dimColor onPress={() => openReport($, one.id)} />
              ))}
            </Box>
          ) : null}
        </Box>,
      )}
    </Box>
  )
}
