// The Progress tab: one month of each goal's results as squares under the north star at the top, each area as a row under its goal, and an area's own page with its
// timeline. Read from the progress folder (progress.tsx) and drawn by mods/claudopus/hooks/progress-page.tsx

const PROGRESS_PANE = 'progress'
const PROGRESS_TITLE = 'Progress'
// What the page reads, with the results its entries came with
type ProgressRead = ProgressData & { reports: Map<string, Report> }
// A picture of an entry: its result and its small copy, where it is a picture inside its result's folder the panel can draw
type ProgressRef = ProgressPictureRef & { report: Report; thumb: string }
const progressPictures = (data: ProgressRead, entry: ProgressEntry): ProgressRef[] =>
  entry.pictures.flatMap(path => {
    const r = data.reports.get(path.startsWith(`${reportsDir()}/`) ? (path.slice(reportsDir().length + 1).split('/')[0] ?? '') : entry.report)
    const full = !r ? '' : path.startsWith('/') ? path : `${reportPath(r)}/${path}`
    const thumb = full && RASTER.test(full) && isInside(full.slice(reportPath(r as Report).length + 1)) ? entryThumb(full) : ''
    return r && thumb ? [{ key: full, report: r, thumb }] : []
  })

const progressRead = async ($: EngineInterface): Promise<ProgressRead> => {
  const [picture, areas, kept, cards, sorting, since] = await Promise.all([readPicture($), readAreas($), read($, reports), read($, todos), readSorting($), installedAt($)])
  const entries = new Map(await Promise.all(areas.map(async area => [area.id, await readEntries($, area.id)] as const)))
  return {
    star: picture.star.text,
    goals: goalsOf(picture),
    areas,
    entries,
    // (a task of this chat at work, as areasBeingBuilt counts them)
    working: new Set(cards.filter(card => !card.parentId && !card.chat && card.status === 'working').map(card => card.id)),
    reports: new Map(kept.map(r => [r.id, r])),
    sorting,
    since,
  }
}
// The small copy a row shows, made once from the result's own (makeThumbs): about 4,000 characters, where that one is 40,000
const thumbsAsked = new Set<string>()
const smallThumbOf = async ($: EngineInterface, ref: ProgressRef): Promise<ProgressThumb> => {
  const small = ref.thumb.replace(/\.jpg$/, '.small.jpg')
  if (await $.fs.exists(small)) return thumbOf($, small)
  if (!(await $.fs.exists(ref.thumb))) return (askThumbs($, ref.report), null)
  await $.process.run([sips($), '-Z', '160', '-s', 'format', 'jpeg', '-s', 'formatOptions', '50', ref.thumb, '--out', small]).catch(() => undefined)
  return (await $.fs.exists(small)) ? thumbOf($, small) : null
}
const largeThumbOf = async ($: EngineInterface, ref: ProgressRef): Promise<ProgressThumb> => ((await $.fs.exists(ref.thumb)) ? thumbOf($, ref.thumb) : (askThumbs($, ref.report), null))
// A result whose small copies were never made has them made once, then the page is drawn again
const askThumbs = ($: EngineInterface, r: Report) => {
  if (thumbsAsked.has(r.id)) return
  thumbsAsked.add(r.id)
  void makeThumbs($, r)
    .then(() => drawAgain($))
    .catch(err => log($, `small copies of report ${r.id} not made: ${String(err)}`))
}
// The pictures one drawing will want, loaded before it is made
const picturesWanted = (data: ProgressRead, now: number) => {
  const first = (list: ProgressEntry[]) => list.map(one => progressPictures(data, one)[0]).filter((ref): ref is ProgressRef => Boolean(ref))
  const area = data.areas.find(one => one.id === progressView.area)
  // (the chart of every area holds no pictures)
  if (!area) return { small: [], large: [] }
  const entries = data.entries.get(area.id) ?? []
  const days = daysOf(entries, data.working, now).slice(0, progressView.daysShown)
  return { small: progressView.drawer === 'pictures' ? entries.flatMap(one => progressPictures(data, one)).slice(0, 24) : [], large: first(days.flatMap(d => [...d.asides, ...d.milestones])).slice(0, progressView.pictures) }
}

const openProgress = async ($: EngineInterface) => {
  presses += 1
  progressView.area = ''
  drawAgain($)
  await front($, PROGRESS_PANE, PROGRESS_TITLE)
}
const progressButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="progress-button" flexShrink={0}>
    <ui.Button key={`progress-open-${presses}`} label="Progress" hotkey={isKeyed ? 'p' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openProgress($).catch(err => log($, `progress not opened: ${String(err)}`))} />
  </ui.Box>
)
// What a press does, then the page drawn again. Pick up again sends the chat
// the person's words naming the result set aside, as a message on a result does
const progressActs = ($: EngineInterface): ProgressActs => {
  const again = () => ((presses += 1), drawAgain($))
  const flip = (set: Set<string>, key: string) => (set.has(key) ? set.delete(key) : set.add(key))
  return {
    open: area => ((progressView.area = area), (progressView.daysShown = 5), (progressView.drawer = ''), (progressView.pictures = PROGRESS_PICTURES_MOST), again()),
    back: () => ((progressView.area = ''), (progressView.pictures = PROGRESS_PICTURES_MOST), again()),
    all: () => ((progressView.isAllOpen = !progressView.isAllOpen), again()),
    month: by => ((progressView.month = Math.max(0, progressView.month + by)), again()),
    day: key => (flip(progressView.days, key), again()),
    pickUp: entry => void sendForPerson($, pickUpText(entry as ProgressEntry, reportsDir())).catch(err => log($, `not picked up again: ${String(err)}`)),
    result: id => openReport($, id),
    more: () => ((progressView.daysShown += 5), (progressView.pictures = PROGRESS_PICTURES_MOST), again()),
    drawer: name => ((progressView.drawer = progressView.drawer === name ? '' : name), (progressView.drawerMost = 60), again()),
    drawerMore: () => ((progressView.drawerMost += 60), again()),
  }
}
// The tab's drawing, `width` pixels wide; pictures, then rows, are taken out until it fits what the app draws (drawingFits)
const progressTab = async ($: EngineInterface, ui: Ui, width: number, rows: number) => {
  const data = await progressRead($)
  const changed = await read($, progressChanged)
  const now = await $.clock.now()
  if (progressView.area && !data.areas.some(area => area.id === progressView.area)) progressView.area = ''
  const wanted = picturesWanted(data, now)
  const small = new Map<string, ProgressThumb>()
  const large = new Map<string, ProgressThumb>()
  if (!('isTerminal' in ui)) {
    for (const ref of wanted.small) small.set(ref.key, await smallThumbOf($, ref).catch(() => null))
    for (const ref of wanted.large) large.set(ref.key, await largeThumbOf($, ref).catch(() => null))
  }
  const acts = progressActs($)
  const drawn = () => {
    const look: ProgressLook = {
      width,
      now,
      gen: drawingMark(PROGRESS_PANE, [presses, changed, width, progressView.area, progressView.month, progressView.isAllOpen, progressView.daysShown, progressView.drawer, progressView.drawerMost, progressView.pictures, [...progressView.days], 'isTerminal' in ui]),
      pictures: entry => progressPictures(data, entry as ProgressEntry),
      hasResult: entry => Boolean(entry.report && data.reports.has(entry.report)),
      small: ref => small.get(ref.key) ?? null,
      large: ref => large.get(ref.key) ?? null,
      acts,
    }
    const area = data.areas.find(one => one.id === progressView.area)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={rows} paddingBottom={2}>
        {area ? progressArea(ui, data, area, look) : progressOverview(ui, data, look)}
      </ui.Box>
    )
  }
  let drawing = drawn()
  while (!drawingFits(drawing) && fewerProgress()) drawing = drawn()
  return drawing
}
