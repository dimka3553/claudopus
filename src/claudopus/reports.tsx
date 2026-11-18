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
// What the person answered, once nothing in it waits: their one answer, or how many they answered; what the work itself no longer
// records is settled
const answeredOf = (r: Report) => {
  const answered = waitsOf(r).filter(one => one.answer && one.answer !== SETTLED)
  if (isOpenQuestion(r)) return ''
  if (!answered.length) return waitsOf(r).length ? 'no longer waiting' : ''
  const [first] = answered
  return answered.length > 1 ? `you answered ${answered.length} questions` : first?.answer === IN_WORDS ? 'you answered in words' : `you answered “${first?.answer}”`
}
// The answer kept for an item the person's own words answered, one its work said no longer waits, and one a newer result of its
// work took the place of
const IN_WORDS = 'In your words'
const SETTLED = 'Settled'
const REPLACED = 'Replaced'
const MOVED = 'Moved'
// An item as a card keeps it: a plain line, as kept before answers were, is a yes-or-no question
const askedWait = (one: Wait | string): Wait => (typeof one === 'string' ? { text: one } : one)
// The answers an item is answered with on the panel: its own, or Yes and No; then Not now, and Answer in words, which puts a line
// naming it in the chat's box, as no guess from a question's words tells for sure that Yes and No answer it
const ANSWER_IN_WORDS = 'Answer in words'
const answersOf = (wait: Wait) => [...new Set([...(wait.choices?.length ? wait.choices : ['Yes', 'No']), 'Not now', ANSWER_IN_WORDS])]
// How an answered item reads on its result
const answeredWords = (wait: Wait) =>
  wait.answer === SETTLED ? 'no longer waiting' : wait.answer === REPLACED ? 'replaced by a newer result' : wait.answer === MOVED ? 'moved to the newer result' : wait.answer === IN_WORDS ? 'you answered in words' : wait.answer === 'Not now' ? 'you pressed Not now' : `you answered “${wait.answer ?? ''}”`

const byPerson = (wait: Wait) => Boolean(wait.answer) && wait.answer !== SETTLED && wait.answer !== REPLACED && wait.answer !== MOVED
// The same line, case, punctuation and quotes aside: an item that repeats its work's ask word for word is that ask's
const sameLine = (a: string, b: string) => Boolean(plainWords(a)) && plainWords(a) === plainWords(b)
// The results a work left that are still kept
const resultsOfWork = (list: Report[], agent: string) => list.filter(r => r.agent === agent && !r.archived).sort((a, b) => b.at - a.at)
// Gives answers to open items of a result, each change made from what is stored then; how many it answered
const settleWaits = async ($: EngineInterface, r: Report, answerOf: (wait: Wait, index: number) => Partial<Wait> | undefined) => {
  let closed = 0
  if (!waitsOf(r).some((one, index) => !one.answer && answerOf(one, index))) return 0
  await markReport($, r, stored => ({
    waiting: waitsOf(stored).map((one, index) => {
      const answer = one.answer ? undefined : answerOf(one, index)
      return answer ? ((closed += 1), { ...one, ...answer }) : one
    }),
  }))
  return closed
}
// An item a work recorded as the question on its card (`asked`, or the same line as its ask) is tied to that ask by when it was made.
// 16 Nov a release was asked on the card and recorded as waiting a moment later; Release it did the release, and the result went on
// waiting on the person, told to the chat with every message after. Answering that ask by any route answers exactly the items tied to
// it, on the card while the work has not finished and on its results after; the answer taken back opens them again
const tiedTo = (wait: Wait, card: Todo): Wait => {
  // Only an ask open now: one asked later in the same round ties what waits for it as it comes, and an older ask, answered, never does
  const ask = card.ask
  if (wait.ask || !ask || !(wait.isAsked || sameLine(wait.text, ask.text))) return wait
  const { isAsked: _, ...rest } = wait
  return { ...rest, ask: ask.at }
}
const settleAsked = async ($: EngineInterface, agent: string, ask: { text: string; at: number }, said: string) => {
  await changeTodos($, list =>
    list.map(card =>
      card.id !== agent
        ? card
        : {
            ...card,
            ...(card.waits?.length ? { waits: card.waits.map(askedWait).map(one => (one.ask === ask.at && !one.answer ? { ...one, answer: said, byAsk: ask.at } : one)) } : {}),
          },
    ),
  )
  for (const r of resultsOfWork(await loadReports($), agent)) await settleWaits($, r, one => (one.ask === ask.at ? { answer: said, byAsk: ask.at } : undefined))
}
const reopened = (one: Wait | string, at: number) => {
  const wait = askedWait(one)
  if (wait.byAsk !== at) return one
  const { answer: _, byAsk: __, ...rest } = wait
  return rest
}
const unsettleAsked = async ($: EngineInterface, agent: string, at: number) => {
  await changeTodos($, list =>
    list.map(card => (card.id !== agent || !card.waits?.length ? card : { ...card, waits: card.waits.map(one => reopened(one, at)) })),
  )
  for (const r of resultsOfWork(await loadReports($), agent))
    if (waitsOf(r).some(one => one.byAsk === at)) await markReport($, r, stored => ({ waiting: waitsOf(stored).map(one => askedWait(reopened(one, at))) }))
}
// The line "Answer in words" puts in the chat's box: the item by its number, so the words of the question can be anything
const wordsLine = (r: Report, n: number, now: number) => `About question ${n} of the result "${r.title}" (${dated(r.at, now)}), ${reportPath(r)}/report.md: `
// The person's message that carries that line and something typed after it answers that item
const answeredInMessage = async ($: EngineInterface, text: string) => {
  // Each line's own part of the message, from its start to the next such line: a message may answer questions of several results
  const parts = text.split(/(?=About question \d+ of the result )/).flatMap(part => {
    const n = Number(/^About question (\d+) of the result /.exec(part)?.[1] ?? 0)
    return n ? [{ n, part }] : []
  })
  if (!parts.length) return
  for (const r of (await read($, reports)).filter(one => !one.archived && isOpenQuestion(one))) {
    const path = `${reportPath(r)}/report.md: `
    const numbers = parts.filter(({ part }) => part.includes(path) && part.slice(part.indexOf(path) + path.length).trim()).map(({ n }) => n)
    if (numbers.length) await settleWaits($, r, (_, index) => (numbers.includes(index + 1) ? { answer: IN_WORDS } : undefined))
  }
}

const gists = new Map<string, string>()
// A file a report names is a path inside its own folder: never absolute, never one that climbs out with .., whoever wrote it (a
// report another Mac handed over included)
const isInside = (file: unknown): file is string =>
  typeof file === 'string' && Boolean(file) && !file.startsWith('/') && !file.startsWith('~') && !file.includes('\0') && file.split('/').every(part => part !== '..' && part !== '')
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
      found.push({ ...one, subject: one.subject || one.title, gist: (one.agent && gists.get(one.id)) || one.gist || '', files: Array.isArray(one.files) ? one.files.filter(isInside) : [] })
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
  const waits = (one.waits ?? []).map(askedWait)
  const isKept = waits.length > 0 || text.trim().length >= REPORT_LEAST || namedPaths(text).some(path => PICTURE.test(path))
  // A round done that leaves a newer result, or that said what still waits, takes the place of what its earlier results waited on:
  // each call of the tool lists everything still waiting. One that failed or was stopped changes nothing
  const kept = await loadReports($)
  const marked = mark(text)
  // The same report again is no newer result: what the round recorded goes on that one
  const same = kept.find(r => r.agent === one.id && r.mark === marked)
  // Only a round that said what still waits takes the place of what its earlier results waited on, once done: each call of the tool
  // lists everything still waiting. A round that never called it, or that failed or was stopped, changes nothing
  if (one.waitsSet) {
    const isNewer = isKept && !same
    for (const r of resultsOfWork(kept, one.id).filter(r => r.id !== same?.id)) await settleWaits($, r, () => ({ answer: isNewer || same ? REPLACED : SETTLED }))
    if (same) await markReport($, same, stored => ({ waiting: [...waitsOf(stored).filter(byPerson), ...waits.map(({ isAsked: _, ...wait }) => wait)] }))
    await changeTodos($, list => list.map(todo => (todo.id === one.id ? { ...todo, waitsSet: undefined, ...(same ? { waits: undefined } : {}) } : todo)))
  }
  if (!isKept || same) return
  // A newer result of a round that never said what waits takes over what its earlier results still waited on, ties and all, so the
  // newest result, the one the list and the chat read, holds every open question; the earlier ones say they were moved there
  const moved = one.waitsSet ? [] : resultsOfWork(kept, one.id).flatMap(r => openWaits(r))
  if (moved.length) for (const r of resultsOfWork(kept, one.id)) await settleWaits($, r, () => ({ answer: MOVED }))
  const waiting = [...waits.map(({ isAsked: _, ...wait }) => wait), ...moved].filter((wait, n, all) => all.findIndex(other => other.text === wait.text) === n)
  const at = await $.clock.now()
  const title = cut(one.title || quoted(one.words, 60) || 'Report', 70)
  const stamp = new Date(at).toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')
  const base = `${stamp}-${slug(title).slice(0, 40) || 'report'}`
  // A third round of one work within the same minute takes a number, so it never writes over the second
  const ids = [base, `${base}-${slug(one.id).slice(0, 8)}`, ...[2, 3, 4, 5, 6, 7, 8, 9].map(n => `${base}-${slug(one.id).slice(0, 8)}-${n}`)]
  const id = ids.find(name => !kept.some(r => r.id === name)) ?? `${base}-${mark(one.id + String(at)).replace(/\D/g, '').slice(-8)}`
  const into = `${reportsDir()}/${id}`
  const chat = await read($, me)
  // (with the to-dos its task left not done that it does not name itself)
  await $.fs.write(`${dir}/reports/${id}/report.md`, `${text.trim()}${notDoneLines(one, text)}\n`)
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
    // What its task made, listed now and kept with it, so its tiles are there once the task's card is gone
    ...(await madeBy($, one.wrote ?? [], text, one.begunAt ?? one.startedAt)
      .then(made => ({ made }))
      .catch(err => (void log($, `files of report ${id} not listed: ${String(err)}`), {}))),
    agent: one.id,
    mark: marked,
    // What waits on the person is what the work recorded with the `waits` tool, wherever in the report it is
    ...(waiting.length ? { waiting } : {}),
    ...(one.from ? { from: one.from } : {}),
  }
  await $.fs.write(`${dir}/reports/${id}/meta.json`, `${JSON.stringify(report, null, 2)}\n`)
  // Its report holds them now: the work's next round records what still waits afresh
  if (one.waits?.length) await changeTodos($, list => list.map(card => (card.id === one.id ? { ...card, waits: undefined } : card)))
  await loadReports($)
}

// The small copy of a picture the panel draws, kept beside the report
const thumbPath = (r: Report, file: string) => `${reportPath(r)}/thumbs/${file.replaceAll('/', '--')}.jpg`
// A picture is read only where it really is inside its report's folder: no link along its path leads anywhere else
const INSIDE = 'f=$1; d=$(cd -P "$2" 2>/dev/null && pwd) || exit 1; p=$(cd -P "$(dirname "$f")" 2>/dev/null && pwd) || exit 1; [ ! -L "$f" ] && [ -f "$f" ] || exit 1; case "$p/" in "$d"/*) exit 0 ;; esac; exit 1'
const makeThumbs = async ($: EngineInterface, r: Report) => {
  for (const file of r.files.filter(one => RASTER.test(one) && isInside(one))) {
    const to = thumbPath(r, file)
    if (await $.fs.exists(to)) continue
    if ((await $.process.run(['sh', '-c', INSIDE, 'sh', `${reportPath(r)}/${file}`, reportPath(r)]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) continue
    await $.process.run(['mkdir', '-p', `${reportPath(r)}/thumbs`])
    for (const size of THUMB_SIZES) {
      await $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', `${reportPath(r)}/${file}`, '--out', to])
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
    const sized = (await $.process.run([sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', path])).stdout
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
    ? `Results saved (what finished tasks left for ${who()} to read or act on), newest first (title · topic · when · its file${list.some(waits) ? ' · what in it is waiting on them' : ''}):\n${list
        .slice(0, REPORTS_TOLD)
        .map(r => `- ${[cut(r.title, 70), cut(r.subject, 40), `${dated(r.at, now)} (${ago(r.at, now)})`, `${reportPath(r)}/report.md`, waits(r) ? `waiting on: ${waitsOf(r).flatMap((one, n) => (one.answer ? [] : [`(${n + 1}) ${one.text}`])).join(' ')}` : ''].filter(Boolean).join(' · ')}`)
        .join('\n')}${list.slice(0, REPORTS_TOLD).some(waits) ? `\nOnce ${who()}'s own words have answered what one waits on, call \`waits\` with its report.md path as \`result\` and the numbers of the questions they answered as \`answered\`.` : ''}`
    : ''
}

// Sends the chat a message from the panel about what the person pressed or replied there: it starts work as a message of
// theirs does, framed by the engine as the mod's and worded as the panel's, never as words the person typed
const sendForPerson = async ($: EngineInterface, text: string) => {
  sentForPerson.add(text)
  await $.prompt.submit({ text }).catch(err => log($, `message from a report not sent: ${String(err)}`))
}
