// Results: what each finished piece of work reported, kept for good with copies of the pictures it named

// ---- Reports: what each finished piece of work reported, kept for good with copies of the pictures it named ----
// One folder each under ~/.claude/claudopus/reports: report.md, the text as the work wrote it and never rewritten; meta.json; the
// copies. A later look at the same subject is a new report beside the older one

// How many subjects the panel lists before "more", and at most after it; how many reports the chat is told of with each message
const REPORTS_TOLD = 8
// What a report may name that is copied in beside it: pictures and pages, never data
const PICTURE = /\.(png|jpe?g|gif|webp|svg|pdf|html?)$/i
// A folder a report names is copied, its pictures alone, only from where files are temporary
const TEMP = /^\/(private\/)?(tmp|var\/folders)\//
// The most copies one report keeps, and how much of its text one drawing shows
const COPIES_KEPT = 40
const REPORT_CHARS = 40_000
// A shorter answer with no picture is a confirmation, not a report worth coming back to
const REPORT_LEAST = 500
// The panel draws a picture as a small copy inside an Svg, one at a time: one drawing holds 100,000 characters
const THUMB_BYTES = 36_000
const THUMB_SIZES = ['640', '480', '360']
const RASTER = /\.(png|jpe?g|gif|webp)$/i
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const reports = atom({ plugin: 'claudopus', key: 'reports' } as const, [], { shape: 'reports-1' })
// The text of each report open in a pane, as read when it opened: a report is never rewritten
const reportText = new Map<string, string>()
// The folder this session started in
let cwd = ''
// A report the person's last message named: the work it starts was started from that report
let fromReport = ''
// What the mod itself sent the chat for the person, from a press on a report: it goes on as the person's own message
const sentForPerson = new Set<string>()

const reportsDir = () => `${dir}/reports`
const reportPath = (r: Report) => `${reportsDir()}/${r.id}`
const two = (n: number) => String(n).padStart(2, '0')
// When a report was written, as a person writes it: "11 Nov, 14:20", with the year when it is not this one
const dated = (at: number, now: number) => {
  const d = new Date(at)
  const year = d.getFullYear() === new Date(now).getFullYear() ? '' : ` ${d.getFullYear()}`
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${year}, ${two(d.getHours())}:${two(d.getMinutes())}`
}
// How old it is, in the largest unit that fits
const ago = (at: number, now: number) => {
  const minutes = Math.floor(Math.max(0, now - at) / 60_000)
  const [hours, days] = [Math.floor(minutes / 60), Math.floor(minutes / 1440)]
  return minutes < 1 ? 'just now' : minutes < 60 ? `${minutes}m ago` : hours < 24 ? `${hours}h ago` : days < 60 ? `${days}d ago` : `${Math.floor(days / 30)} months ago`
}
// What a report leaves waiting on the person: what its work recorded, or an older report's one question
const waitsOf = (r: Report): Wait[] => r.waiting ?? (r.question ? [{ text: r.question, ...(r.answer ? { answer: r.answer } : {}) }] : [])
// One put away waits on nothing; brought back, what was open waits again
const openWaits = (r: Report) => (r.archived ? [] : waitsOf(r).filter(one => !one.answer))
const isOpenQuestion = (r: Report) => openWaits(r).length > 0
// What the person answered, once nothing in it waits: their one answer, or how many they answered
const answeredOf = (r: Report) => {
  const answered = waitsOf(r).filter(one => one.answer)
  return isOpenQuestion(r) || !answered.length ? '' : answered.length === 1 ? `you answered ${answered[0]?.answer}` : `you answered ${answered.length}`
}

const gists = new Map<string, string>()
const loadReports = async ($: EngineInterface) => {
  const found: Report[] = []
  for (const entry of await $.fs.list(reportsDir()).catch(() => [])) {
    if (entry.kind !== 'dir' || entry.name.startsWith('_')) continue
    try {
      const one = JSON.parse(await readOr($, `${reportsDir()}/${entry.name}/meta.json`)) as Report
      if (one.id !== entry.name || !one.title) continue
      // A report a piece of work wrote has its finding read again from its text, once a load, as the finding is now found;
      // one brought in by hand keeps the finding written for it
      if (one.agent && !gists.has(one.id)) gists.set(one.id, gistOf(await readOr($, `${reportsDir()}/${entry.name}/report.md`), one.title) || one.gist)
      found.push({ ...one, subject: one.subject || one.title, gist: (one.agent && gists.get(one.id)) || one.gist || '', files: Array.isArray(one.files) ? one.files : [] })
    } catch {
      // A folder without its meta.json is not a report yet
    }
  }
  found.sort((a, b) => b.at - a.at)
  if (JSON.stringify(found) !== JSON.stringify(await read($, reports))) await update($, reports, () => found)
  return found
}

// The absolute paths a report names, as written, without the punctuation after them
const namedPaths = (text: string) => [...new Set((text.match(/\/(?:Users|private|tmp|var)\/[^\s`'"()<>[\]{}|,;*]+/g) ?? []).map(path => path.replace(/[.:!?]+$/, '').replace(/\/$/, '')))]
// What a report found, in plain words: its first sentences that say something. A heading, a path, a line that only leads in to
// what follows ("Here is the sheet:", "The answer is back. As it came:") or repeats the title says nothing
const gistOf = (text: string, title = '') => {
  const lead = /^(here is|here are|here's|as it came)\b|\b(is|are) back\b[^.]{0,30}\.?$/i
  // Its sentences paragraph by paragraph; the finding is taken from the first paragraph that says something, so the list or
  // table after it is never glued on
  const paragraphs = text.split(/\n\s*\n/).map(part =>
    part
      .split('\n')
      .filter(line => !/^\s*(#|```|\|)/.test(line) && !/^\s*\/\S+$/.test(line.trim()) && !/^\s*(?:[-*]|\d+\.)\s/.test(line))
      .map(line => oneLine(line.replace(/[*_`>]/g, '')))
      .filter(line => line.length > 20 && slug(line) !== slug(title))
      .flatMap(line => line.split(/(?<=[.!?:])\s+(?=[A-Z0-9“"])/))
      // A short line that ends in a colon only leads in to what follows; a long one says something
      .filter(one => !(one.trim().endsWith(':') && one.trim().length < 40))
      .map(one => one.trim().replace(/:$/, '.'))
      .filter(one => one.length > 12 && !one.endsWith('?') && !lead.test(one) && !namedPaths(one).length && /[.!)”"]$/.test(one)),
  )
  let found = ''
  for (const one of paragraphs.find(part => part.length) ?? []) {
    if (found && found.length + one.length > 200) break
    found = found ? `${found} ${one}` : one
  }
  return found
}

// Copies the pictures and pages a report names into its folder: a file wherever it is, and from a temporary folder it names,
// that folder's pictures. Answers the copies by their path in the folder
const copyNamed = async ($: EngineInterface, text: string, into: string) => {
  const copies: string[] = []
  const copy = async (from: string, name: string) => {
    if (copies.length >= COPIES_KEPT || copies.includes(name)) return
    const to = `${into}/${name}`
    await $.process.run(['mkdir', '-p', to.slice(0, to.lastIndexOf('/'))])
    if ((await $.process.run(['cp', '-p', from, to])).exitCode === 0) copies.push(name)
  }
  for (const path of namedPaths(text)) {
    const stat = await $.fs.stat(path).catch(() => undefined)
    if (stat?.kind === 'file' && PICTURE.test(path)) await copy(path, fileName(path))
    else if (stat?.kind === 'dir' && TEMP.test(path) && path.includes('/scratchpad/')) {
      const r = await $.process.run(['find', path, '-maxdepth', '2', '-type', 'f'])
      for (const file of rows(r.stdout).filter(one => PICTURE.test(one)).sort()) await copy(file, `${fileName(path)}/${file.slice(path.length + 1)}`)
    }
  }
  return copies
}

// Keeps what a finished piece of work reported, once
const saveReport = async ($: EngineInterface, card: Todo, text: string) => {
  // What the work recorded as waiting is read as it stands now; a short answer that leaves something waiting is still kept
  const one = (await read($, todos)).find(todo => todo.id === card.id) ?? card
  if (!one.waits?.length && text.trim().length < REPORT_LEAST && !namedPaths(text).some(path => PICTURE.test(path))) return
  const kept = await loadReports($)
  const marked = mark(text)
  if (kept.some(r => r.agent === one.id && r.mark === marked)) return
  const at = await $.clock.now()
  const title = cut(one.title || quoted(one.words, 60) || 'Report', 70)
  const stamp = new Date(at).toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')
  const base = `${stamp}-${slug(title).slice(0, 40) || 'report'}`
  const id = kept.some(r => r.id === base) ? `${base}-${slug(one.id).slice(0, 8)}` : base
  const into = `${reportsDir()}/${id}`
  const chat = await read($, me)
  await $.fs.write(`${dir}/reports/${id}/report.md`, `${text.trim()}\n`)
  const files = await copyNamed($, text, into).catch(err => (void log($, `pictures of report ${id} not copied: ${String(err)}`), [] as string[]))
  await makeThumbs($, { id, files } as Report).catch(err => log($, `small copies of report ${id} not made: ${String(err)}`))
  const report: Report = {
    id,
    title,
    subject: oneLine(one.subject || title),
    at,
    chat: chat.title,
    chatId: chat.id,
    // The folder of the subject the work recorded, which need not be the chat's own
    folder: [(await readIndex($)).find(s => one.subject && slug(s.name) === slug(one.subject))?.repo ?? ''].find(repo => repo.startsWith('/')) ?? cwd,
    gist: gistOf(text, title),
    files,
    agent: one.id,
    mark: marked,
    // What waits on the person is what the work recorded with the `waits` tool, wherever in the report it is
    ...(one.waits?.length ? { waiting: one.waits.map(wait => ({ text: wait })) } : {}),
    ...(one.from ? { from: one.from } : {}),
  }
  await $.fs.write(`${dir}/reports/${id}/meta.json`, `${JSON.stringify(report, null, 2)}\n`)
  // Its report holds them now: the work's next round records what still waits afresh
  if (one.waits?.length) await update($, todos, list => list.map(card => (card.id === one.id ? { ...card, waits: undefined } : card)))
  await loadReports($)
}

// The small copy of a picture the panel draws, kept beside the report
const thumbPath = (r: Report, file: string) => `${reportPath(r)}/thumbs/${file.replaceAll('/', '--')}.jpg`
const makeThumbs = async ($: EngineInterface, r: Report) => {
  for (const file of r.files.filter(one => RASTER.test(one))) {
    const to = thumbPath(r, file)
    if (await $.fs.exists(to)) continue
    await $.process.run(['mkdir', '-p', `${reportPath(r)}/thumbs`])
    for (const size of THUMB_SIZES) {
      await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', `${reportPath(r)}/${file}`, '--out', to])
      if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= THUMB_BYTES) break
    }
  }
}
// A small copy as an Svg the panel can draw, with its size; nothing for one too big or missing
const drawn = new Map<string, { source: string; width: number; height: number } | null>()
const thumbOf = async ($: EngineInterface, path: string) => {
  if (drawn.has(path)) return drawn.get(path) ?? null
  let one: { source: string; width: number; height: number } | null = null
  try {
    const read = (await $.fs.read(path, { as: 'bytes' })) as { base64: string }
    const sized = (await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path])).stdout
    const width = Number(/pixelWidth:\s*(\d+)/.exec(sized)?.[1] ?? 0)
    const height = Number(/pixelHeight:\s*(\d+)/.exec(sized)?.[1] ?? 0)
    if (width && height && read.base64.length < 50_000) {
      one = {
        source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="data:image/jpeg;base64,${read.base64}" width="${width}" height="${height}"/></svg>`,
        width,
        height,
      }
    }
  } catch {
    one = null
  }
  // One not there yet is looked for again at the next drawing
  if (one) drawn.set(path, one)
  return one
}

// Changes what is kept beside a report, never its text
// One change at a time, each made from what is stored then, so two answers close together both stay
let marking: Promise<unknown> = Promise.resolve()
const markReport = ($: EngineInterface, r: Report, patch: Partial<Report> | ((stored: Report) => Partial<Report>)) => {
  const run = marking.then(async () => {
    const stored = { ...r, ...(JSON.parse((await readOr($, `${reportPath(r)}/meta.json`)) || '{}') as Partial<Report>) }
    await $.fs.write(`${dir}/reports/${r.id}/meta.json`, `${JSON.stringify({ ...stored, ...(typeof patch === 'function' ? patch(stored) : patch) }, null, 2)}\n`)
    await loadReports($)
  })
  marking = run.catch(() => undefined)
  return run
}

// What the chat is told of with each message: the newest reports, so a question one answers is answered from it. One put away is
// left out, and an earlier round's open items are its newest round's to ask again
const reportsTold = (all: Report[], now: number, list = all.filter(r => !r.archived), newest = newestOf(list)) => {
  const waits = (r: Report) => newest.has(r.id) && isOpenQuestion(r)
  return list.length
    ? `Results kept (what finished work left for ${who()} to read or act on), newest first (title · subject · when · its file${list.some(waits) ? ' · what in it waits on them' : ''}):\n${list
        .slice(0, REPORTS_TOLD)
        .map(r => `- ${[cut(r.title, 70), cut(r.subject, 40), `${dated(r.at, now)} (${ago(r.at, now)})`, `${reportPath(r)}/report.md`, waits(r) ? `waits on: ${openWaits(r).map(one => cut(one.text, 120)).join(' / ')}` : ''].filter(Boolean).join(' · ')}`)
        .join('\n')}`
    : ''
}

// Sends the chat a message from the panel about what the person pressed or replied there: it starts work as a message of
// theirs does, framed by the engine as the mod's and worded as the panel's, never as words the person typed
const sendForPerson = async ($: EngineInterface, text: string) => {
  sentForPerson.add(text)
  await $.prompt.submit({ text }).catch(err => log($, `message from a report not sent: ${String(err)}`))
}
