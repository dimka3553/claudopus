// What a task made, as things the person presses to open: on its card a row of small items, in its Details and in its result
// tiles side by side

// ---- What a task made ----

// Each kind of file a tile is drawn for: how it is told by its name, its word for one and for several, and its badge
const MADE_KINDS: { kind: MadeKind; test: RegExp; one: string; many: string; badge: string; color: string }[] = [
  { kind: 'picture', test: /\.(png|jpe?g|gif|webp|svg|heic|heif|tiff?|bmp)$/i, one: 'picture', many: 'pictures', badge: 'IMG', color: '#3A78C9' },
  { kind: 'video', test: /\.(mp4|mov|webm|m4v|mkv|avi)$/i, one: 'video', many: 'videos', badge: 'VID', color: '#8B5CF6' },
  { kind: 'pdf', test: /\.pdf$/i, one: 'PDF', many: 'PDFs', badge: 'PDF', color: '#D0473E' },
  { kind: 'sheet', test: /\.(xlsx?|csv|numbers)$/i, one: 'spreadsheet', many: 'spreadsheets', badge: 'XLS', color: '#23955A' },
  { kind: 'doc', test: /\.(docx?|pages|pptx?|key|md|txt|html?)$/i, one: 'document', many: 'documents', badge: 'DOC', color: '#6B6A65' },
  { kind: 'file', test: /^/, one: 'file', many: 'files', badge: '', color: '#6B6A65' },
]
const madeKind = (path: string) => MADE_KINDS.find(one => one.test.test(path)) ?? MADE_KINDS[MADE_KINDS.length - 1]!
const madeKindOf = (kind: MadeKind) => MADE_KINDS.find(one => one.kind === kind) ?? MADE_KINDS[MADE_KINDS.length - 1]!
// A document that is plain text is code when it sits in a repo and the result does not name it
const TEXT_DOC = /\.(md|txt|html?|csv)$/i
// The most paths a task's card keeps of what its steps wrote or named, and the most looked at when its files are listed
const WROTE_KEPT = 300
const MADE_LOOKED = 300
// The most things a card's row names before "and N more", and the most tiles a Files part draws before the same
const CHIPS_MOST = 8
const TILES_MOST = 24
// The most small copies one Files part has made: the first tiles only, the rest keep their icon
const FACES_MOST = 12
// A tile's picture in the panel's pixels, and the most characters every tile's small copy together takes in one drawing
const TILE_W = 112
const TILE_H = 84
// How a tile is laid in the pane: its box in columns, and its picture drawn a little smaller than it is made, so three sit side by
// side in a narrow pane with a gap between
const TILE_COLUMNS = 11
const TILE_SHOWN_W = 96
const TILE_SHOWN_H = 72
const TILE_CHARS = 90_000
const TILE_THUMB_BYTES = 7_000
// A small copy's own size: one and a half times the tile's
const FACE_W = 168
const FACE_H = 126

// The paths one tool call writes or names: the file a file tool is given, and in a command the files of a kind a tile is drawn for
const wroteBy = (e: { tool: string }) => {
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return [slashed(String(input.file_path ?? input.notebook_path ?? ''))].filter(isAbsPath)
  if (e.tool === 'Bash') return namedPaths(String(input.command ?? '')).filter(path => madeKind(path).kind !== 'file' && !TEXT_DOC.test(path))
  return []
}
// A task's card with what this call writes added to what it has written, each path once, the newest kept
const withWrote = (one: Todo, e: { tool: string }): Todo => {
  const paths = wroteBy(e).filter(path => !(one.wrote ?? []).includes(path))
  return paths.length ? { ...one, wrote: [...(one.wrote ?? []), ...paths].slice(-WROTE_KEPT) } : one
}

// The repo a folder is in, by the folder: looked up once
const repoOf = new Map<string, string>()
const repoTop = async ($: EngineInterface, folder: string) => {
  if (repoOf.has(folder)) return repoOf.get(folder) ?? ''
  const r = await runOn($, ['git', '-C', folder, 'rev-parse', '--show-toplevel'], { timeoutMs: 4000 }).catch(() => undefined)
  const top = r?.exitCode === 0 ? slashed(r.stdout.trim()) : ''
  if (repoOf.size > 200) repoOf.clear()
  repoOf.set(folder, top)
  return top
}
// How many lines a task added to and took from the files it changed in one repo, against the repo as it stood when the task began:
// only the files it wrote itself are counted, so what a merge brought in is left out. A file new since then counts every line, as
// does every file of a repo with no commit from before the task (one it made); a file it deleted is no longer there to count
const COUNT_LINES =
  'cd "$1" || exit 1; since=$2; shift 2; base=$(git rev-list -1 --before="$since" HEAD 2>/dev/null); [ -n "$base" ] || base=4b825dc642cb6eb9a060e54bf8d69288fbee4904; for f in "$@"; do if git cat-file -e "$base:$f" 2>/dev/null; then git diff --numstat "$base" -- "$f"; elif [ -f "$f" ]; then printf \'%s\\t0\\t%s\\tnew\\n\' "$(grep -c \'\' "$f")" "$f"; fi; done'
// Each file listed, the most changed first, its counts kept with the whole
const codeOf = async ($: EngineInterface, byTop: Map<string, string[]>, since: number): Promise<CodeMade | undefined> => {
  const files: CodeFile[] = []
  for (const [top, paths] of byTop) {
    const r = await runOn($, ['sh', '-c', COUNT_LINES, 'sh', top, String(Math.floor(since / 1000)), ...paths.map(path => path.slice(top.length + 1))], { timeoutMs: 8000 }).catch(() => undefined)
    if (r?.exitCode !== 0) continue
    for (const line of rows(r.stdout)) {
      const [added = '', taken = '', inRepo = '', isNew = ''] = line.split('\t')
      if (!/^(\d+|-)$/.test(added) || !inRepo) continue
      files.push({ path: `${top}/${inRepo}`, inRepo, plus: Number(added) || 0, minus: Number(taken) || 0, ...(isNew === 'new' ? { isNew: true } : {}) })
    }
  }
  if (!files.length) return undefined
  files.sort((a, b) => b.plus + b.minus - (a.plus + a.minus))
  return { count: files.length, plus: files.reduce((sum, one) => sum + one.plus, 0), minus: files.reduce((sum, one) => sum + one.minus, 0), files, since: Math.floor(since / 1000) }
}
// Links a result names on a line that says it made or put them up, and those whose shape says something was put up (a pull request,
// an issue, a release, a published page) wherever they stand. A page it only cites is no thing it made
const MADE_LINK_LINE = /\b(made|added|created|published|deployed|live|online|posted|uploaded|opened|pushed|report|pull request|PR|release[sd]?)\b/i
const MADE_LINK = /^https?:\/\/(www\.)?(github\.com\/[^/\s]+\/[^/\s]+\/(pull|issues|releases)\/|gitlab\.com\/\S+\/-\/(merge_requests|issues)\/|claude\.ai\/(public\/)?artifacts?\/)/i
const LINK = /https?:\/\/[^\s`'"()<>[\]{}|,;*\\]+/g
const LINKS_MOST = 30
const linksOf = (text: string) => (text.match(LINK) ?? []).map(link => link.replace(/[.:!?]+$/, ''))
// (an address with a query or under /api/ is one to try, such as a flaw shown live, never a page put up)
const isPlainPage = (link: string) => !/\?|\/api\//.test(link.replace(/^https?:\/\/[^/]+/, ''))
// (the line's words without its links say it: a cited page whose address has "releases" in it is still only cited)
const linksIn = (text: string) => [...new Set(text.split('\n').flatMap(line => linksOf(line).filter(link => MADE_LINK.test(link) || (MADE_LINK_LINE.test(line.replace(LINK, ' ')) && isPlainPage(link)))))].slice(0, LINKS_MOST)
// A Claude artifact, published from Claude Code: shown by its title, and opened in the app's own artifact pane
const ARTIFACT = /^https?:\/\/claude\.ai\/(public\/)?artifacts?\//i
const isLink = (said: string) => /^https?:\/\//.test(said)
const linkName = (link: string) => {
  const [host = '', ...rest] = link.replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/\/$/, '').split('/')
  // A pull request or an issue by its repo and number, "clipify #70", as it is spoken of; a published page as one
  if (/^(www\.)?(github|gitlab)\.com$/.test(host) && /^(pull|issues|merge_requests)$/.test(rest.at(-2) ?? '') && /^\d+$/.test(rest.at(-1) ?? '')) return `${rest.at(-3) === '-' ? rest.at(-4) : rest[1]} #${rest.at(-1)}`
  const last = rest.at(-1) ?? ''
  // "os.example.com/reports/362" is "os report 362": the site's first word, the kind of page in the singular, and the page
  const kind = rest.length > 1 ? (rest.at(-2) ?? '').replace(/(?<=\w{3})s$/, '') : ''
  return last ? `${host.replace(/^www\./, '').split('.')[0]} ${kind ? `${kind} ` : ''}${last}`.slice(0, 40) : host.replace(/^www\./, '')
}
// What a task's words name as made: a result's files and links, and of the words a step ends with only its links
const saidIn = (text: string, isResult: boolean) => [...(isResult ? namedPaths(text) : []), ...linksIn(text)]
const SAID_KEPT = 300
const withSaid = (one: Todo, found: string[]): Todo => {
  const said = [...new Set([...(one.said ?? []), ...found])].slice(-SAID_KEPT)
  return said.length === (one.said ?? []).length && said.every((item, n) => item === one.said?.[n]) ? one : { ...one, said }
}
// Every change to the cards keeps what each new answer of a task's names, on its card and its task's (a helper's result is what its
// task made too): the answer is replaced at each step's end and each result, so what an earlier one named is never lost
const saidKept = (before: Todo[], next: Todo[]) => {
  const was = new Map(before.map(one => [one.id, one]))
  const found = new Map<string, string[]>()
  for (const one of next) {
    if (one.chat || !one.answer.trim() || one.answer === was.get(one.id)?.answer) continue
    const named = saidIn(one.answer, one.status !== 'working')
    if (named.length) for (const id of new Set([one.id, topOf(next, one.id)])) found.set(id, [...(found.get(id) ?? []), ...named])
  }
  return found.size ? next.map(one => (found.has(one.id) ? withSaid(one, found.get(one.id) ?? []) : one)) : next
}
// A command that opens a pull request, a release or a page prints where it is: kept as what its task made, which a result that names
// it only by its number ("pull request #284") would leave out
const PUTS_UP = /\b(gh\s+(pr|release|gist)\s+create|glab\s+mr\s+create)\b/
// A Claude artifact the Artifact tool published (never one it only read or listed) keeps the title it was published under, or else
// its file's name
const linksPutUp = (e: { tool: string }, r: { deny?: unknown; isError?: unknown; result?: unknown }): { links: string[]; titles: Record<string, string> } => {
  const none = { links: [], titles: {} }
  if (r.deny || r.isError) return none
  const input = e as { command?: unknown; action?: unknown; file_path?: unknown }
  const isArtifact = /artifact/i.test(e.tool)
  if (isArtifact ? /^(read|list|get|view|delete|comments?)$/i.test(String(input.action ?? '')) : !(e.tool === 'Bash' && PUTS_UP.test(String(input.command ?? '')))) return none
  const links = [...new Set(linksOf(JSON.stringify(r.result ?? '')).filter(link => MADE_LINK.test(link)))]
  const given = r.result && typeof r.result === 'object' ? (r.result as { title?: unknown; url?: unknown }) : {}
  const file = typeof input.file_path === 'string' && input.file_path ? bareName(fileName(input.file_path)).replace(/[-_]+/g, ' ') : ''
  const title = oneLine(String(given.title ?? '')) || file
  const titles = Object.fromEntries(isArtifact && title ? links.filter(link => ARTIFACT.test(link)).map(link => [link, cut(title, 60)]) : [])
  return { links, titles }
}
const keepPutUp = async ($: EngineInterface, id: string, put: { links: string[]; titles: Record<string, string> }) => {
  if (!put.links.length) return
  const titled = (one: Todo) => (Object.keys(put.titles).length ? { ...one, titles: { ...(one.titles ?? {}), ...put.titles } } : one)
  await changeTodos($, list => list.map(one => (one.id === id || one.id === topOf(list, id) ? titled(withSaid(one, put.links)) : one)))
}
// What a task made: the files its steps wrote or its commands named that were made since it began, and the files and links its
// results name (`said`, from every one it gave, and `answer`) that are there. A picture, video, PDF, spreadsheet or document is a
// thing of its own, as is any file a result names; the other files it wrote inside a repo are its code, counted and never listed
const madeBy = async ($: EngineInterface, wrote: string[], answer: string, since: number, isDated = true, said: string[] = [], titles: Record<string, string> = {}): Promise<FilesMade> => {
  const named = [...new Set([...said.filter(one => !isLink(one)), ...namedPaths(answer)])]
  const made: Made[] = []
  const byTop = new Map<string, string[]>()
  const seen = new Set<string>()
  // What the result names first, then the newest of what its steps wrote, things of their own before code, so a long task's last
  // pictures are never left past the most looked at
  const isThing = (path: string) => madeKind(path).kind !== 'file' && !TEXT_DOC.test(path)
  const newest = [...wrote].reverse()
  for (const given of [...named, ...newest.filter(isThing), ...newest.filter(path => !isThing(path))].slice(0, MADE_LOOKED)) {
    const path = given.replace(/^\/private(?=\/(tmp|var)\/)/, '')
    if (seen.has(path)) continue
    seen.add(path)
    const isNamed = named.includes(given)
    const stat = await $.fs.stat(path).catch(() => undefined)
    // A file a result names is shown however old, as the result points the person to it (27 Nov: a board made by the task's first
    // step and named again in its last was missing); one only a step wrote or a command named must be new since the task began
    if (!stat || stat.kind !== 'file' || (isDated && !isNamed && stat.mtimeMs < since - 5000)) continue
    const kind = madeKind(path).kind
    // A file with no kind of its own (code) is counted in its repo, even one the result names; outside a repo, a named one is a thing
    const top = kind === 'file' || (TEXT_DOC.test(path) && !isNamed) ? await repoTop($, path.slice(0, path.lastIndexOf('/'))) : ''
    if (top && path.startsWith(`${top}/`)) {
      byTop.set(top, [...(byTop.get(top) ?? []), path])
      continue
    }
    if ((kind !== 'file' && !TEXT_DOC.test(path)) || isNamed) {
      // What a step only wrote into a temporary folder or Claudopus's own memory is its scratch, not what it made
      if (!isNamed && (TEMP.test(path) || (dir && path.startsWith(`${dir}/`)))) continue
      made.push({ path, name: fileName(path), kind, at: Math.round(stat.mtimeMs) })
    }
  }
  // Shown in the order they were named and written, the oldest first
  const order = new Map<string, number>()
  for (const [n, given] of [...named, ...wrote].entries()) if (!order.has(given.replace(/^\/private(?=\/(tmp|var)\/)/, ''))) order.set(given.replace(/^\/private(?=\/(tmp|var)\/)/, ''), n)
  made.sort((a, b) => (order.get(a.path) ?? 0) - (order.get(b.path) ?? 0))
  for (const link of [...new Set([...said.filter(isLink), ...linksIn(answer)])]) made.push(ARTIFACT.test(link) ? { path: link, name: titles[link] ?? 'Claude artifact', kind: 'artifact' } : { path: link, name: linkName(link), kind: 'link' })
  const code = byTop.size ? await codeOf($, byTop, since).catch(() => undefined) : undefined
  return { made, ...(code ? { code } : {}) }
}
// What a task made in its whole life: listed now, with what it was listed with before (kept on its card and with each result it
// gave) that the listing no longer finds. A thing of its own or a link stays; a changed file stays only once it is gone (its
// worktree taken away once merged), with the lines it was counted with, as one still there that is no longer changed is not
const listMade = async ($: EngineInterface, one: Todo, answer: string): Promise<FilesMade> => {
  const now = await madeBy($, one.wrote ?? [], answer, one.begunAt ?? one.startedAt, true, one.said ?? [], one.titles ?? {})
  const earlier = [one.made, ...(await ownReports($)).filter(r => r.agent === one.id && r.made).map(r => r.made)].filter((files): files is FilesMade => Boolean(files))
  if (!earlier.length) return now
  const paths = new Set(now.made.map(made => made.path))
  // (an artifact listed before as a plain link is one now, with its title)
  const kept = earlier
    .flatMap(files => files.made)
    .filter(made => !paths.has(made.path) && (paths.add(made.path), true))
    .map(made => (made.kind === 'link' && ARTIFACT.test(made.path) ? { ...made, kind: 'artifact' as const, name: one.titles?.[made.path] ?? 'Claude artifact' } : made))
  const counted = new Set((now.code?.files ?? []).map(file => file.path))
  const gone: CodeFile[] = []
  for (const file of earlier.flatMap(files => files.code?.files ?? [])) {
    if (counted.has(file.path)) continue
    counted.add(file.path)
    if (!(await $.fs.exists(file.path).catch(() => true))) gone.push(file)
  }
  const files = [...(now.code?.files ?? []), ...gone].sort((a, b) => b.plus + b.minus - (a.plus + a.minus))
  const since = now.code?.since ?? earlier.find(files => files.code?.since)?.code?.since
  const code: CodeMade | undefined = files.length ? { count: files.length, plus: files.reduce((sum, file) => sum + file.plus, 0), minus: files.reduce((sum, file) => sum + file.minus, 0), files, ...(since ? { since } : {}) } : now.code
  // Links last, as a listing has them
  const all = [...now.made, ...kept]
  return { made: [...all.filter(made => made.kind !== 'link'), ...all.filter(made => made.kind === 'link')], ...(code ? { code } : {}) }
}
// What a card draws: its task's files as last listed, and listed again, out of the drawing, once it has made a step since (a file a
// step writes is there only after the step), at most every MADE_AGAIN while it works, and once it ends. The listings take turns, so a
// panel opened on many cards lists them one after another. What a listing found is kept on the card, so it is drawn at once after a
// reload and nothing it once listed is lost
const MADE_AGAIN = 20_000
const MADE_HOLD = 15_000
// What a listing shows: nothing at all is the same as not listed yet
const shownOf = (files?: FilesMade) => (files && (files.made.length || files.code) ? JSON.stringify(files) : '')
const madeOf = new Map<string, { key: string; at: number; files: FilesMade }>()
const madeLoading = new Set<string>()
let madeTurn: Promise<unknown> = Promise.resolve()
const madeNow = ($: EngineInterface, one: Todo): FilesMade | undefined => {
  if (one.chat) return undefined
  // While it works a helper's edits change no count of the task's own, so time is part of what is listed
  const key = `${one.steps ?? 0}:${(one.wrote ?? []).length}:${(one.said ?? []).length}:${one.answer.length}:${one.status}:${one.status === 'working' ? Math.floor(Date.now() / MADE_AGAIN) : ''}`
  const was = madeOf.get(one.id)
  const isDue = !was || (was.key !== key && (one.status !== 'working' || Date.now() - was.at >= MADE_AGAIN))
  if (isDue && !madeLoading.has(one.id) && ((one.wrote ?? []).length || (one.said ?? []).length || one.made || one.answer)) {
    madeLoading.add(one.id)
    // (the words a step ends with name no file as made: only a result does, and each one's is in `said`)
    const run = madeTurn.then(() => listMade($, one, one.status === 'working' ? '' : one.answer))
    // A listing that never ends (a file on a volume that does not answer) holds the others up no longer than MADE_HOLD
    madeTurn = Promise.race([run.catch(() => undefined), $.clock.sleep(MADE_HOLD)])
    let isNew = false
    void run
      .then(async files => {
        if (madeOf.size > 200) madeOf.delete(madeOf.keys().next().value ?? '')
        isNew = shownOf(files) !== shownOf(madeOf.get(one.id)?.files ?? one.made)
        madeOf.set(one.id, { key, at: Date.now(), files })
        if (shownOf(files) && shownOf(files) !== shownOf(one.made)) await changeTodos($, list => list.map(card => (card.id === one.id ? { ...card, made: files } : card)))
      })
      .catch(err => log($, `files of ${one.id} not listed: ${String(err)}`))
      // The panel is drawn again only when what it shows changed
      .finally(() => (madeLoading.delete(one.id), isNew ? redraw($) : undefined))
  }
  return was?.files ?? one.made
}
// What a result's pane draws: what its task made, kept with the result when it was saved. One saved before that is listed once, out
// of the drawing (which writes nothing), from its task's card while that is kept and else from the paths its text names. A picture
// the result kept a copy of stands in for one that is no longer where it was
const madeOfOld = new Map<string, FilesMade>()
const madeOfReport = ($: EngineInterface, r: Report, text: string): FilesMade => {
  const files = r.made ?? madeOfOld.get(r.id)
  if (!files && !madeLoading.has(r.id)) {
    madeLoading.add(r.id)
    void (async () => {
      const one = (await read($, todos)).find(card => card.id === r.agent)
      const listed = await madeBy($, one?.wrote ?? [], text, one ? (one.begunAt ?? one.startedAt) : 0, Boolean(one), one?.said ?? [], one?.titles ?? {}).catch(() => ({ made: [] }))
      if (madeOfOld.size > 200) madeOfOld.delete(madeOfOld.keys().next().value ?? '')
      madeOfOld.set(r.id, listed)
    })()
      .catch(err => log($, `files of result ${r.id} not listed: ${String(err)}`))
      .finally(() => (madeLoading.delete(r.id), redraw($)))
  }
  const made = files?.made ?? []
  const names = new Set(made.map(one => one.name))
  const copies = r.files.filter(file => isInside(file) && !names.has(fileName(file))).map(file => ({ path: `${reportPath(r)}/${file}`, name: fileName(file), kind: madeKind(file).kind }))
  return { ...(files ?? {}), made: [...made, ...copies] }
}

// ---- Their small copies ----

// A tile's small copy: the picture itself, a PDF's first page, and on a Mac what Quick Look draws of a video, a spreadsheet or a
// document. Made once for a file as it stands, kept with the other small copies, and cleared with them when not looked at
type Face = { base64: string } | null
const faces = new Map<string, Face>()
const facesLoading = new Set<string>()
// A file's small copy is known by the file as it stands: written again, it is made again
const faceKey = (one: Made) => `${one.path}:${one.at ?? 0}`
// How many small copies have been made, which a drawing's keys carry
let facesMade = 0
let qlMade = 0
const makeFace = async ($: EngineInterface, one: Made): Promise<Face> => {
  if (one.kind === 'link' || one.kind === 'artifact' || one.kind === 'file' || /\.svg$/i.test(one.path)) return null
  const stat = await $.fs.stat(one.path).catch(() => undefined)
  if (!stat || stat.kind !== 'file') return null
  const to = `${dir}/thumbs/tile-${slug(one.path).slice(-60)}-${mark(one.path).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
  if (!(await $.fs.exists(to))) {
    await runOn($, ['mkdir', '-p', `${dir}/thumbs`])
    let from = one.path
    let scratch = ''
    // Plain text has no picture worth a tile (Quick Look draws its lines too small to read): it keeps its icon
    if (TEXT_DOC.test(one.path) && !/\.html?$/i.test(one.path)) return null
    if (one.kind !== 'picture' && one.kind !== 'pdf') {
      // Quick Look is the Mac's own: elsewhere the tile keeps its icon
      if (isLinux || isWindows) return null
      scratch = `${dir}/thumbs/ql-${Math.round(await $.clock.now())}-${(qlMade += 1)}`
      await runOn($, ['mkdir', '-p', scratch])
      await runOn($, ['qlmanage', '-t', '-s', '320', '-o', scratch, one.path], { timeoutMs: 15_000 }).catch(() => undefined)
      from = `${scratch}/${fileName(one.path)}.png`
      if (!(await $.fs.exists(from))) return (await runOn($, ['rm', '-rf', scratch]).catch(() => undefined), null)
    }
    // Only what the tile shows is kept: a page or a tall picture is cut to the tile's shape from its top, at one and a half times the
    // tile's size, so a dozen of them fit in one drawing
    const said = (await runOn($, [sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', from], { timeoutMs: 15_000 }).catch(() => undefined))?.stdout ?? ''
    const [width = 0, height = 0] = [/pixelWidth: (\d+)/, /pixelHeight: (\d+)/].map(re => Number(re.exec(said)?.[1] ?? 0))
    const isTall = width > 0 && height / width > FACE_H / FACE_W
    const mid = `${to}.png`
    if (isTall) await runOn($, [sips($), '--resampleWidth', String(FACE_W), '-s', 'format', 'png', from, '--out', mid], { timeoutMs: 15_000 }).catch(() => undefined)
    for (const quality of ['50', '35', '20']) {
      await runOn(
        $,
        isTall ? [sips($), '-c', String(FACE_H), String(FACE_W), '--cropOffset', '0', '0', '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, mid, '--out', to] : [sips($), '-Z', String(FACE_W), '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, from, '--out', to],
        { timeoutMs: 15_000 },
      ).catch(() => undefined)
      if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= TILE_THUMB_BYTES) break
    }
    await runOn($, ['rm', '-rf', mid, ...(scratch ? [scratch] : [])]).catch(() => undefined)
  }
  const read = (await $.fs.read(to, { as: 'bytes' }).catch(() => undefined)) as { base64: string } | undefined
  return read?.base64 && read.base64.length < TILE_THUMB_BYTES * 2 ? { base64: read.base64 } : null
}
// The small copies as made so far; the missing ones are made out of the drawing, one after another, and the drawing drawn again
const facesNow = ($: EngineInterface, list: Made[]) => {
  const missing = list.filter(one => !faces.has(faceKey(one)) && !facesLoading.has(faceKey(one)))
  if (missing.length) {
    for (const one of missing) facesLoading.add(faceKey(one))
    void (async () => {
      for (const one of missing) {
        const face = await makeFace($, one).catch(() => null)
        if (faces.size > 300) faces.delete(faces.keys().next().value ?? '')
        faces.set(faceKey(one), face)
        facesMade += 1
        facesLoading.delete(faceKey(one))
      }
    })()
      .catch(err => log($, `small copies of files not made: ${String(err)}`))
      .finally(() => (missing.forEach(one => facesLoading.delete(faceKey(one))), redraw($)))
  }
  return faces
}

// ---- How they are drawn ----

const SVG_FONT = 'font-family="-apple-system,Helvetica,sans-serif"'
// A page with its kind on it, a link, a branch: what a file is, drawn small
const pageIcon = (badge: string, color: string) =>
  `<path d="M4.5 1.5h13l7 7v21a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-27a1 1 0 0 1 1-1z" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><path d="M17.5 1.5v7h7" fill="none" stroke="#9a9890" stroke-width="1.2"/>${badge ? `<rect x="1" y="15" width="${badge.length > 3 ? 22 : 19}" height="10" rx="2" fill="${color}"/><text x="${badge.length > 3 ? 12 : 10.5}" y="22.6" font-size="7" ${SVG_FONT} font-weight="700" fill="#fff" text-anchor="middle">${badge}</text>` : ''}`
// A file of no kind of its own shows its ending on its page, such as JSON
const endingOf = (path = '') => (/\.([a-z0-9]{1,4})$/i.exec(path)?.[1] ?? '').toUpperCase()
// A file of code shows its ending in its language's colour
const ENDING_COLORS: Record<string, string> = { TS: '#3178C6', TSX: '#3178C6', JS: '#B8A11E', JSX: '#B8A11E', MJS: '#B8A11E', PY: '#3572A5', SH: '#4E9A2A', JSON: '#8A7A2E', CSS: '#663399', HTML: '#D24E2B', MD: '#6B6A65', SWIFT: '#E0583A', GO: '#00879A', RS: '#B7410E', RB: '#B22222', C: '#555BA8', H: '#555BA8', CPP: '#555BA8', ZIP: '#8A6D3B', MP3: '#C2416B', WAV: '#C2416B', M4A: '#C2416B' }
const iconOf = (kind: MadeKind | 'code', path?: string) =>
  kind === 'code' ? CODE_ICON : kind === 'link' ? LINK_ICON : kind === 'artifact' ? ARTIFACT_ICON : pageIcon(kind === 'file' ? endingOf(path) : madeKindOf(kind).badge, kind === 'file' ? (ENDING_COLORS[endingOf(path)] ?? madeKindOf(kind).color) : madeKindOf(kind).color)
const svgOfIcon = (kind: MadeKind | 'code', width: number, height: number, path?: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 28 32">${iconOf(kind, path)}</svg>`
const tileSvg = (inner: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">${inner}</svg>`
// A small copy cut to its place from its top, with rounded corners; each tile's cut has a name of its own, should the app draw them
// in one page
const clipId = (one: Made) => `t${mark(one.path).replace(':', '-')}`
const tilePicture = (face: { base64: string }, x: number, y: number, w: number, h: number, id: string) =>
  `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/><image href="data:image/jpeg;base64,${face.base64}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMin slice"/></g><rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="4" fill="none" stroke="#ffffff30"/>`
const tilePlay = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="12" fill="#000a"/><path d="M${cx - 4} ${cy - 6}l10 6-10 6z" fill="#fff"/>`
const tileBadge = (kind: MadeKind) => {
  const { badge, color } = madeKindOf(kind)
  return kind === 'pdf' || kind === 'sheet' || kind === 'doc' ? `<rect x="4" y="${TILE_H - 17}" width="${badge.length * 6 + 8}" height="13" rx="3" fill="${color}"/><text x="8" y="${TILE_H - 7.5}" font-size="8.5" ${SVG_FONT} font-weight="700" fill="#fff">${badge}</text>` : ''
}
const tileIcon = (kind: MadeKind | 'code', path?: string) => `<rect width="${TILE_W}" height="${TILE_H}" rx="4" fill="#ffffff12"/><g transform="translate(${TILE_W / 2 - 17.5} ${TILE_H / 2 - 20}) scale(1.25)">${iconOf(kind, path)}</g>`
// One file: its small copy filling the tile, with its kind in the corner where the picture alone does not say it; else its icon
const oneTile = (one: Made, face: Face | undefined) => tileSvg(face ? tilePicture(face, 0, 0, TILE_W, TILE_H, clipId(one)) + (one.kind === 'video' ? tilePlay(TILE_W / 2, TILE_H / 2) : '') + tileBadge(one.kind) : tileIcon(one.kind, one.path))
// Several of a kind: the first one's small copy on two more sheets
const pileTile = (first: Made, face: Face | undefined) =>
  tileSvg(
    `<rect x="8" y="0" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#55554f"/><rect x="4" y="4" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#77766f"/>` +
      (face ? tilePicture(face, 0, 8, TILE_W - 8, TILE_H - 8, clipId(first)) + (first.kind === 'video' ? tilePlay((TILE_W - 8) / 2, 8 + (TILE_H - 8) / 2) : '') : `<rect x="0" y="8" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#3b3b39" stroke="#ffffff30"/><g transform="translate(${(TILE_W - 8) / 2 - 17.5} ${8 + (TILE_H - 8) / 2 - 20}) scale(1.25)">${iconOf(first.kind, first.path)}</g>`),
  )
// A changed file's size of change: a bar as long as its lines changed against the most changed file listed with it (by the square
// root, so a small edit beside a large one still shows), green for the lines added and red for those removed, on a faint track
const BAR_W = 64
const BAR_H = 8
const BAR_CELLS = 6
const ADDED = '#57AB5A'
const REMOVED = '#E5534B'
const barShare = (one: CodeFile, most: number) => (most > 0 ? Math.sqrt((one.plus + one.minus) / most) : 0)
const barSvg = (one: CodeFile, most: number) => {
  const long = one.plus + one.minus ? Math.max(4, Math.round(BAR_W * barShare(one, most))) : 0
  const green = one.plus + one.minus ? Math.round((long * one.plus) / (one.plus + one.minus)) : 0
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BAR_W}" height="${BAR_H}" viewBox="0 0 ${BAR_W} ${BAR_H}"><rect width="${BAR_W}" height="${BAR_H}" rx="2" fill="#ffffff14"/>${green ? `<rect width="${green}" height="${BAR_H}" rx="2" fill="${ADDED}"/>` : ''}${long - green ? `<rect x="${green}" width="${long - green}" height="${BAR_H}" rx="2" fill="${REMOVED}"/>` : ''}</svg>`
}
// The same in a terminal, as cells: added, removed, then the track
const barCells = (one: CodeFile, most: number) => {
  const long = one.plus + one.minus ? Math.max(1, Math.round(BAR_CELLS * barShare(one, most))) : 0
  const green = one.plus + one.minus ? Math.round((long * one.plus) / (one.plus + one.minus)) : 0
  return { green: '■'.repeat(green), red: '■'.repeat(long - green), rest: '·'.repeat(BAR_CELLS - long) }
}
const linesWord = (one: { plus: number; minus: number }) => `${one.plus.toLocaleString('en-US')} added, ${one.minus.toLocaleString('en-US')} removed`

// A file's name as a tile says it: without its ending, and without the start that the task's file names share, which says nothing
const sharedStart = (names: string[]) => {
  if (names.length < 2) return 0
  let n = 0
  while (names.every(name => name[n] !== undefined && name[n] === names[0]?.[n])) n += 1
  const cut = (names[0] ?? '').slice(0, n).search(/[-_ ][^-_ ]*$/)
  return cut < 0 ? 0 : cut + 1
}
const bareName = (name: string) => name.replace(/\.[a-z0-9]+$/i, '')
// What a task made as the things drawn for it: a file of its own, or three or more of a kind as one; the kinds in the order of
// MADE_KINDS, links last
type Thing = { key: string; label: string; kind: MadeKind; files: Made[] }
const thingsOf = (files: FilesMade, opened: (kind: MadeKind) => boolean): Thing[] => {
  const isPage = (one: { kind: MadeKind }) => one.kind === 'link' || one.kind === 'artifact'
  const skip = sharedStart(files.made.filter(one => !isPage(one)).map(one => bareName(one.name)))
  const nameOf = (one: Made) => (isPage(one) ? one.name : bareName(one.name).slice(skip) || bareName(one.name))
  // (the artifacts it published first: what it made for the person to open)
  const kinds: MadeKind[] = ['artifact', ...MADE_KINDS.map(one => one.kind), 'link']
  return kinds.flatMap(kind => {
    const list = files.made.filter(one => one.kind === kind)
    if (!isPage({ kind }) && list.length >= 3 && !opened(kind)) return [{ key: `pile-${kind}`, label: `${list.length} ${madeKindOf(kind).many}`, kind, files: list }]
    return list.map((one, n) => ({ key: `${kind}-${n}`, label: nameOf(one), kind, files: [one] }))
  })
}
// A name too long for its place keeps its start and its end, which is what tells two apart: "vat-li…country", "os re…t 362"
const middleCut = (text: string, most: number) => (text.length <= most ? text : `${text.slice(0, Math.ceil((most - 1) / 2))}…${text.slice(text.length - Math.floor((most - 1) / 2))}`)
const countWord = (code: CodeMade) => `${code.count.toLocaleString('en-US')} changed ${code.count === 1 ? 'file' : 'files'}`
// The files a task changed in a repo, by kind: its code, then its documents (plain text such as Markdown), each the most changed first
const CODE_KINDS = [
  { kind: 'code', title: 'Code', test: (one: CodeFile) => !TEXT_DOC.test(one.path) },
  { kind: 'docs', title: 'Documents', test: (one: CodeFile) => TEXT_DOC.test(one.path) },
]
// The most files listed before "Show all"
const CHANGED_MOST = 8
// Files by the folder they are in inside the repo, the folder of the most changed first, as they stand in the list; one at the
// repo's top is under the repo's own name
const foldersOf = (list: CodeFile[]) => {
  const by = new Map<string, CodeFile[]>()
  for (const one of list) {
    const folder = one.inRepo.includes('/') ? one.inRepo.slice(0, one.inRepo.lastIndexOf('/')) : fileName(one.path.slice(0, one.path.length - one.inRepo.length - 1))
    by.set(folder, [...(by.get(folder) ?? []), one])
  }
  return [...by.entries()]
}
// Opens what was pressed where the person is: a picture as the chat's pictures open, any other file or a link as the system opens it
// An artifact opens in the app's own artifact pane beside the chat, which shows the artifacts this chat's tasks published; where the
// app won't show it (the terminal, or a pane it refuses), in the browser
const openMade = async ($: EngineInterface, one: Made, pane: string, row: string, surface?: RenderSurface) => {
  if (one.kind === 'picture') return showPicture($, one.path, pane, row, surface)
  if (one.kind === 'artifact' && surface !== 'terminal') {
    const shown = await $.mcp.call('ccd_view', 'show_pane', { pane: 'artifact' }).catch(err => ({ isError: true, content: [{ type: 'text', text: String(err) }] }))
    if (!shown.isError) return
    await log($, `artifact not shown in the app's pane, opened in the browser: ${cut(shown.content.map(said => ('text' in said ? String(said.text) : '')).join(' '), 160)}`)
  }
  const opened = await openOn($, one.path)
  if (opened.exitCode !== 0) await log($, `${one.path} not opened: ${opened.stderr}`)
}
// The stacks opened out, by the pane and the kind
const openPiles = new Set<string>()

// On a task's card, under its title: what it made side by side, an icon and a word or two each. A file opens on a press; several
// of a kind open the task. No small copy is made for a card
const madeChips = ($: EngineInterface, ui: Ui, one: Todo, key: string, onOpenWork: () => void) => {
  const files = madeNow($, one)
  if (!files || (!files.made.length && !files.code)) return null
  const { Box, Button, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const things = thingsOf(files, () => false)
  const shown = things.slice(0, CHIPS_MOST)
  // The app draws no picture whose alt is blank, so each icon says its kind
  const icon = (kind: MadeKind | 'code', at: string, path?: string) =>
    table.Svg && !('isTerminal' in ui) ? <table.Svg key={`${at}-icon`} source={svgOfIcon(kind, 18, 20, path)} alt={kind === 'code' ? 'Code' : kind === 'link' ? 'Link' : kind === 'artifact' ? 'Artifact' : madeKindOf(kind).one.replace(/^\w/, c => c.toUpperCase())} width={18} height={20} /> : null
  return (
    <Box key={key} flexDirection="row" flexWrap="wrap" columnGap={2} rowGap={0}>
      {shown.map(thing => (
        <Box key={`${key}-${thing.key}`} flexDirection="row" alignItems="center" flexShrink={0} height={1} overflow="hidden">
          {icon(thing.kind, `${key}-${thing.key}`, thing.files[0]?.path)}
          <Button
            key={`${key}-${thing.key}-open-${presses}`}
            label={`${middleCut(thing.label, thing.kind === 'artifact' ? 26 : 18)}${thing.kind === 'link' ? ' ↗' : ''}`}
            plain
            onPress={press => void ((presses += 1), thing.files.length > 1 ? onOpenWork() : thing.files[0] ? openMade($, thing.files[0], '', '', press.surface) : undefined)}
          />
        </Box>
      ))}
      {/* (the rest are in its Details, which the press opens) */}
      {things.length > shown.length ? <Button key={`${key}-more-${presses}`} label={`${things.length - shown.length} more`} plain dimColor hover={{ underline: true }} onPress={() => void ((presses += 1), onOpenWork())} /> : null}
      {files.code ? (
        <Box key={`${key}-code`} flexDirection="row" alignItems="center" gap={1} flexShrink={0} height={1} overflow="hidden">
          {icon('code', `${key}-code`)}
          <Button key={`${key}-code-open-${presses}`} label={countWord(files.code)} plain hover={{ underline: true }} onPress={() => void ((presses += 1), onOpenWork())} />
          {/* (the counts drawn at the button's size, as in Details) */}
          {table.Svg && !('isTerminal' in ui) ? (
            <table.Svg key={`${key}-code-counts`} source={chipCountsSvg(files.code)} alt={linesWord(files.code)} width={chipCountsW(files.code)} height={LIST_H} />
          ) : (
            [
              <Text key={`${key}-code-plus`} color="success">{`+${files.code.plus.toLocaleString('en-US')}`}</Text>,
              files.code.minus ? <Text key={`${key}-code-minus`} color="error">{`−${files.code.minus.toLocaleString('en-US')}`}</Text> : null,
            ]
          )}
        </Box>
      ) : null}
    </Box>
  )
}
// In a task's Details and in its result: the same things as tiles side by side, a small copy and a name each, each a press. A
// stack opens out into a tile for each of its files. Where no picture can be drawn, a row each
// `gen`, where the pane has one, is the mark of what its drawing shows, which every key carries
// `owner`: the task or the result the files are of, which a file's tab goes back to
// (`isLean`: no small copies on the tiles, in a Details tab drawn with less in it: drawingFits)
const madeTiles = ($: EngineInterface, ui: Ui, files: FilesMade, pane: string, key: string, owner: string, surface?: RenderSurface, gen = '', isLean = false) => {
  if (!files.made.length && !files.code) return null
  const { Box, Button, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const canDraw = Boolean(table.Svg) && surface !== 'terminal' && !('isTerminal' in ui)
  const things = thingsOf(files, kind => openPiles.has(`${pane}:${kind}`))
  const shown = things.slice(0, TILES_MOST)
  const made = isLean ? new Map<string, Face>() : canDraw ? facesNow($, shown.slice(0, FACES_MOST).flatMap(thing => thing.files.slice(0, 1))) : faces
  let chars = 0
  const faceOf = (one: Made | undefined) => {
    const face = one ? made.get(faceKey(one)) : undefined
    if (!face || chars + face.base64.length > TILE_CHARS) return undefined
    chars += face.base64.length
    return face
  }
  const press = (thing: Thing, row: string) => (e: { surface?: RenderSurface }) => {
    presses += 1
    if (thing.files.length > 1) return void (openPiles.add(`${pane}:${thing.kind}`), redraw($))
    if (thing.files[0]) void openMade($, thing.files[0], pane, row, e.surface)
  }
  const fewer = [...new Set(files.made.map(one => one.kind))].filter(kind => openPiles.has(`${pane}:${kind}`) && files.made.filter(one => one.kind === kind).length >= 3)
  return (
    <Box key={key} flexDirection="column" gap={1}>
      <Box flexDirection="row" flexWrap="wrap" columnGap={1} rowGap={1}>
        {shown.map(thing => {
          const row = `${key}-${thing.key}`
          return (
            <Box key={row} flexDirection="column" alignItems="flex-start" width={canDraw ? TILE_COLUMNS : undefined} flexShrink={0}>
              {canDraw && table.Svg ? <table.Svg key={`${row}-svg`} source={thing.files.length > 1 ? pileTile(thing.files[0]!, faceOf(thing.files[0])) : oneTile(thing.files[0]!, faceOf(thing.files[0]))} alt={thing.label} width={TILE_SHOWN_W} height={TILE_SHOWN_H} /> : null}
              <Button key={`${row}-open-${presses}${gen}`} label={canDraw ? middleCut(thing.label, TILE_COLUMNS) : cut(thing.label, 60)} plain onPress={press(thing, row)} />
            </Box>
          )
        })}
      </Box>
      {things.length > shown.length ? <Text dimColor>{`${things.length - shown.length} more`}</Text> : null}
      {fewer.length ? (
        <Box alignItems="flex-start">
          <Button key={`${key}-fewer-${presses}${gen}`} label="Show less" plain dimColor onPress={() => void ((presses += 1), fewer.forEach(kind => openPiles.delete(`${pane}:${kind}`)), redraw($))} />
        </Box>
      ) : null}
      {files.code ? changedList($, ui, files.code, pane, key, canDraw, owner, gen) : null}
    </Box>
  )
}
// Under the tiles, the files the task changed in a repo, by kind: each kind's heading with its counts, then under a line for each
// folder inside the repo a row a file: its icon, its name, then its counts and its bar at the right, which line up down the list.
// The app draws a button's words at 14 pixels and other words at 16, so where it draws pictures every word but a file's name (a
// button) is drawn in a picture at 14, and the list reads at one size. A press on a name shows the file in the app's Files pane. A
// task counted before files were kept has only its counts
const LIST_FONT = 14
const LIST_H = 20
// The counts' picture: `new` for a file the task made, the lines added and removed, each right-aligned in a column of its own, then
// the bar
const COUNTS_W = 200
const countsSvg = (one: { plus: number; minus: number }, bar?: { most: number }, isNew = false, isDim = false) => {
  const y = LIST_H / 2 + LIST_FONT * 0.36
  const text = (x: number, color: string, words: string, anchor = 'end') =>
    `<text x="${x}" y="${y}" font-size="${LIST_FONT}" ${SVG_FONT} fill="${color}" text-anchor="${anchor}">${words}</text>`
  const shown = barSvg({ path: '', inRepo: '', ...one }, bar?.most ?? 0)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${COUNTS_W}" height="${LIST_H}" viewBox="0 0 ${COUNTS_W} ${LIST_H}">${isNew ? text(0, '#9a9890', 'new', 'start') : ''}${text(70, isDim ? '#57AB5A99' : ADDED, `+${one.plus.toLocaleString('en-US')}`)}${text(118, one.minus && !isDim ? REMOVED : '#E5534B80', `−${one.minus.toLocaleString('en-US')}`)}${bar ? `<g transform="translate(${COUNTS_W - BAR_W} ${(LIST_H - BAR_H) / 2})">${shown.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>` : ''}</svg>`
}
// The same counts on a card, side by side from the left, as wide as they are (a figure is about 8.5 pixels at the list's size)
const FIGURE_W = 8.5
const chipCountsW = (one: { plus: number; minus: number }) => Math.ceil((`+${one.plus.toLocaleString('en-US')}`.length + 1 + `−${one.minus.toLocaleString('en-US')}`.length) * FIGURE_W) + 4
const chipCountsSvg = (one: { plus: number; minus: number }) => {
  const plus = `+${one.plus.toLocaleString('en-US')}`
  const y = LIST_H / 2 + LIST_FONT * 0.36
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${chipCountsW(one)}" height="${LIST_H}" viewBox="0 0 ${chipCountsW(one)} ${LIST_H}"><text x="0" y="${y}" font-size="${LIST_FONT}" ${SVG_FONT}><tspan fill="${ADDED}">${plus}</tspan><tspan fill="${one.minus ? REMOVED : '#E5534B80'}" x="${Math.ceil((plus.length + 1) * FIGURE_W)}">−${one.minus.toLocaleString('en-US')}</tspan></text></svg>`
}
// A line of words drawn at the list's size: a kind's heading (its name in white, its count in grey) or a folder (grey)
const wordsSvg = (parts: { words: string; color: string; bold?: boolean }[], width: number) => {
  const y = LIST_H / 2 + LIST_FONT * 0.36
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${LIST_H}" viewBox="0 0 ${width} ${LIST_H}"><text x="0" y="${y}" font-size="${LIST_FONT}" ${SVG_FONT}>${parts.map(part => `<tspan fill="${part.color}"${part.bold ? ' font-weight="600"' : ''}>${escapeXml(part.words)} </tspan>`).join('')}</text></svg>`
}
const escapeXml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// The widths of a folder's line and a kind's heading, in pixels: a folder's 44 characters at most, a heading's few words
const LINE_W = 320
const HEAD_W = 160
const changedList = ($: EngineInterface, ui: Ui, code: CodeMade, pane: string, key: string, canDraw: boolean, owner: string, gen: string) => {
  const { Box, Button, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const Svg = canDraw ? table.Svg : undefined
  const list = code.files ?? []
  const isAll = openPiles.has(`${pane}:code`)
  const most = Math.max(0, ...list.map(one => one.plus + one.minus))
  const groups = CODE_KINDS.map(group => {
    const all = list.filter(group.test)
    return { ...group, all, sum: { plus: all.reduce((n, one) => n + one.plus, 0), minus: all.reduce((n, one) => n + one.minus, 0) } }
  }).filter(group => group.all.length)
  const filesWord = (n: number) => `${n.toLocaleString('en-US')} ${n === 1 ? 'file' : 'files'}`
  // The counts at a row's right: a picture where the app draws them, else words and cells
  const countsOf = (one: { plus: number; minus: number }, at: string, bar?: { most: number }, isNew = false, isDim = false) => {
    if (Svg) return <Svg key={`${at}-counts`} source={countsSvg(one, bar, isNew, isDim)} alt={`${isNew ? 'new, ' : ''}${linesWord(one)}`} width={COUNTS_W} height={LIST_H} />
    const cells = bar ? barCells({ path: '', inRepo: '', ...one }, bar.most) : undefined
    return (
      <Box key={`${at}-counts`} flexDirection="row" gap={1}>
        {isNew ? <Text dimColor>new</Text> : null}
        <Text color="success" dimColor={isDim}>{`+${one.plus.toLocaleString('en-US')}`}</Text>
        <Text color="error" dimColor={isDim || !one.minus}>{`−${one.minus.toLocaleString('en-US')}`}</Text>
        {cells ? (
          <Box flexDirection="row">
            <Text color="success">{cells.green}</Text>
            <Text color="error">{cells.red}</Text>
            <Text dimColor>{cells.rest}</Text>
          </Box>
        ) : null}
      </Box>
    )
  }
  if (!list.length)
    return (
      <Box key={`${key}-code`} flexDirection="row" alignItems="center" gap={1}>
        {Svg ? <Svg key={`${key}-code-word`} source={wordsSvg([{ words: countWord(code), color: '#9a9890' }], HEAD_W)} alt={countWord(code)} width={HEAD_W} height={LIST_H} /> : <Text dimColor>{countWord(code)}</Text>}
        {countsOf(code, `${key}-code`)}
      </Box>
    )
  let left = isAll ? Infinity : CHANGED_MOST
  return (
    <Box key={`${key}-code`} flexDirection="column" gap={1}>
      {groups.map(group => {
        const rows = group.all.slice(0, Math.max(0, left))
        left -= rows.length
        const heading = `${group.title} · ${filesWord(group.all.length)}`
        return (
          <Box key={`${key}-${group.kind}`} flexDirection="column">
            <Box flexDirection="row" alignItems="center" gap={1} minWidth={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0} overflow="hidden">
                {Svg ? (
                  <Svg key={`${key}-${group.kind}-head`} source={wordsSvg([{ words: group.title, color: '#ECEAE3', bold: true }, { words: filesWord(group.all.length), color: '#9a9890' }], HEAD_W)} alt={heading} width={HEAD_W} height={LIST_H} />
                ) : (
                  <Text bold>{heading}</Text>
                )}
              </Box>
              <Box flexShrink={0}>{countsOf(group.sum, `${key}-${group.kind}-sum`, undefined, false, true)}</Box>
            </Box>
            {foldersOf(rows).map(([folder, inFolder]) => (
              <Box key={`${key}-${group.kind}-in-${mark(folder).replace(':', '-')}`} flexDirection="column">
                {Svg ? (
                  <Box minWidth={0} overflow="hidden">
                    <Svg key={`${key}-${group.kind}-folder-${mark(folder).replace(':', '-')}`} source={wordsSvg([{ words: middleCut(folder, 44), color: '#9a9890' }], LINE_W)} alt={folder} width={LINE_W} height={LIST_H} />
                  </Box>
                ) : (
                  <Text dimColor wrap="truncate-end">{folder}</Text>
                )}
                {inFolder.map(one => {
                  const row = `${key}-${group.kind}-${mark(one.path).replace(':', '-')}`
                  return (
                    <Box key={row} flexDirection="row" alignItems="center" gap={1} minWidth={0}>
                      {Svg ? (
                        <Box flexShrink={0}>
                          <Svg key={`${row}-icon`} source={svgOfIcon('file', 16, 18, one.path)} alt={`${endingOf(one.path) || 'Text'} file`} width={16} height={18} />
                        </Box>
                      ) : null}
                      <Box flexGrow={1} flexShrink={1} minWidth={0} overflow="hidden">
                        <Button key={`${row}-open-${presses}${gen}`} label={fileName(one.path)} plain hover={{ underline: true }} onPress={press => void showFile($, one, code.since ?? 0, owner, press.surface)} />
                      </Box>
                      <Box flexShrink={0}>{countsOf(one, row, { most }, Boolean(one.isNew))}</Box>
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>
        )
      })}
      {list.length > CHANGED_MOST ? (
        <Box alignItems="flex-start">
          <Button
            key={`${key}-code-all-${presses}${gen}`}
            label={isAll ? 'Show less' : `Show all ${list.length}`}
            plain
            dimColor
            onPress={() => void ((presses += 1), isAll ? openPiles.delete(`${pane}:code`) : openPiles.add(`${pane}:code`), redraw($))}
          />
        </Box>
      ) : null}
    </Box>
  )
}
// A press on a changed file shows it in the desktop app's own Files pane, beside the chat, through the app's view tool. Where the
// app has no Files pane (the terminal, an app without the tool) or will not show it (a file outside the chat's folders), what changed
// in it opens in a tab of the panel instead
const showFile = async ($: EngineInterface, file: CodeFile, since: number, owner: string, surface?: RenderSurface) => {
  presses += 1
  if (surface !== 'terminal') {
    const shown = await $.mcp.call('ccd_view', 'show_pane', { pane: 'file', path: file.path }).catch(err => ({ isError: true, content: [{ type: 'text', text: String(err) }] }))
    const said = shown.content.map(one => ('text' in one ? String(one.text) : '')).join(' ')
    if (!shown.isError) return
    await log($, `${file.path} not shown in the Files pane, its changes open in a tab: ${cut(said, 160)}`)
  }
  openDiff($, file, since, owner)
}

// ---- What changed in one file, in a tab of the panel ----

// The tab is named after the file: the file's name over its folder and counts, Details (or Result) to go back, Whole file or
// Changes, then what changed, drawn by Claude Code itself as a diff, or the whole file. A file new since the task began is drawn
// whole. The tab finds its file again after a reload in the paths its task wrote, or its result kept
const DIFF_PANE = 'diff-'
// The most characters of a diff or a file one drawing takes (the engine's Code takes 100000 in one drawing)
const DIFF_CHARS = 90_000
const diffPaneOf = (path: string) => `${DIFF_PANE}${mark(path).replace(':', '-')}`
type DiffOf = { file: CodeFile; since: number; owner: string }
const diffs = new Map<string, DiffOf>()
// The tabs showing their whole file rather than what changed
const diffWhole = new Set<string>()
const openDiff = ($: EngineInterface, file: CodeFile, since: number, owner: string) => {
  const id = diffPaneOf(file.path)
  if (diffs.size > 100) diffs.delete(diffs.keys().next().value ?? '')
  diffs.set(id, { file, since, owner })
  void comingTab((async () => {
    await front($, id, cut(fileName(file.path), 30))
    redraw($)
  })()).catch(err => log($, `changes of ${file.path} not opened: ${String(err)}`))
}
// After a reload: the card or the result whose listing holds the file
const diffOf = async ($: EngineInterface, id: string): Promise<DiffOf | undefined> => {
  const known = diffs.get(id)
  if (known) return known
  for (const [owner, kept] of [...madeOf.entries()].map(([one, made]) => [one, made.files] as const).concat([...madeOfOld.entries()])) {
    const file = kept.code?.files?.find(one => diffPaneOf(one.path) === id)
    if (file) return { file, since: kept.code?.since ?? 0, owner }
  }
  for (const r of await ownReports($)) {
    const file = r.made?.code?.files?.find(one => diffPaneOf(one.path) === id)
    if (file) return { file, since: r.made?.code?.since ?? 0, owner: r.id }
  }
  for (const one of await read($, todos)) {
    const path = (one.wrote ?? []).find(path => diffPaneOf(path) === id)
    if (path) return { file: { path, inRepo: '', plus: 0, minus: 0 }, since: Math.floor((one.begunAt ?? one.startedAt) / 1000), owner: one.id }
  }
  return undefined
}
// What changed in the file since the task began, against the repo as it stood then, as unified-diff hunks; a file that was not
// there then, the file itself
const DIFF_OF =
  'cd "$1" || exit 1; f=$3; base=$(git rev-list -1 --before="$2" HEAD 2>/dev/null); [ -n "$base" ] || base=4b825dc642cb6eb9a060e54bf8d69288fbee4904; if git cat-file -e "$base:$f" 2>/dev/null; then git diff --no-color --no-ext-diff -U3 "$base" -- "$f"; else echo NEW; fi; exit 0 # the changes tab'
// A diff cut to fit: whole hunks while they fit, then the part of the next that fits, its header counted again so it still parses
const diffCut = (text: string, most: number) => {
  const lines = text.split('\n')
  const from = lines.findIndex(line => line.startsWith('@@'))
  if (from < 0) return { source: '', isCut: false }
  const out: string[] = []
  let size = 0
  let hunk: { at: number; old: number; now: number; oldFrom: string; nowFrom: string } | undefined
  const close = () => {
    if (hunk) out[hunk.at] = `@@ -${hunk.oldFrom},${hunk.old} +${hunk.nowFrom},${hunk.now} @@`
  }
  for (const line of lines.slice(from)) {
    if (size + line.length + 1 > most) return (close(), { source: out.join('\n'), isCut: true })
    size += line.length + 1
    const head = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line)
    if (head) {
      close()
      hunk = { at: out.length, old: 0, now: 0, oldFrom: head[1] ?? '1', nowFrom: head[2] ?? '1' }
    } else if (hunk && line.startsWith(' ')) ((hunk.old += 1), (hunk.now += 1))
    else if (hunk && line.startsWith('-')) hunk.old += 1
    else if (hunk && line.startsWith('+')) hunk.now += 1
    out.push(line)
  }
  close()
  return { source: out.join('\n').replace(/\n+$/, ''), isCut: false }
}
// What a tab last read, by the tab and the file as it stood, so a redraw reads nothing again
const diffRead = new Map<string, { key: string; text: string; whole: string }>()
const diffView = async ($: EngineInterface, ui: Ui, paneId: string) => {
  const { Box, Button, Text } = ui
  const found = await diffOf($, paneId)
  if (!found) return <Text dimColor>This file is no longer listed.</Text>
  const { file, since, owner } = found
  const stat = await $.fs.stat(file.path).catch(() => undefined)
  const isWhole = diffWhole.has(paneId)
  let got = diffRead.get(paneId)
  const readKey = `${file.path}:${since}:${stat?.mtimeMs ?? 0}`
  if (stat && (!got || got.key !== readKey)) {
    const top = await repoTop($, file.path.slice(0, file.path.lastIndexOf('/')))
    const r = top ? await runOn($, ['sh', '-c', DIFF_OF, 'sh', top, String(since), file.path.slice(top.length + 1)], { timeoutMs: 8000 }).catch(() => undefined) : undefined
    const whole = await $.fs.read(file.path).then(text => String(text), () => '')
    got = { key: readKey, text: r?.exitCode === 0 ? r.stdout : '', whole }
    if (diffRead.size > 20) diffRead.delete(diffRead.keys().next().value ?? '')
    diffRead.set(paneId, got)
  }
  const isNew = got?.text.trim() === 'NEW'
  const diff = diffCut(got?.text ?? '', DIFF_CHARS)
  const showsWhole = isWhole || isNew
  const wholeText = got?.whole ?? ''
  const wholeCut = wholeText.length > DIFF_CHARS ? wholeText.slice(0, wholeText.lastIndexOf('\n', DIFF_CHARS)) : wholeText
  const card = (await read($, todos)).find(one => one.id === owner)
  const result = card ? undefined : (await ownReports($)).find(r => r.id === owner)
  const folder = file.inRepo.includes('/') ? file.inRepo.slice(0, file.inRepo.lastIndexOf('/')) : file.path.slice(0, file.path.lastIndexOf('/'))
  const table = ui as Ui & { Code?: (props: { key?: string; source: string; path?: string; format?: 'source' | 'diff'; startLine?: number; wrap?: 'wrap' | 'truncate-end' }) => JSX.Element }
  const lines = (showsWhole ? wholeCut : diff.source).split('\n')
  const body = !stat ? (
    <Text dimColor wrap="wrap">{"This file isn't here anymore."}</Text>
  ) : showsWhole ? (
    table.Code ? <table.Code key="diff-whole" source={wholeCut} path={file.path} startLine={1} /> : lines.map((line, n) => <Text key={`diff-line-${n}`} wrap="wrap">{line || ' '}</Text>)
  ) : !diff.source ? (
    <Text dimColor wrap="wrap">Nothing in it differs from when the task began.</Text>
  ) : table.Code ? (
    <table.Code key="diff-changes" source={diff.source} path={file.path} format="diff" />
  ) : (
    lines.map((line, n) => <Text key={`diff-line-${n}`} color={line.startsWith('+') ? 'success' : line.startsWith('-') ? 'error' : undefined} dimColor={line.startsWith('@@')} wrap="wrap">{line || ' '}</Text>)
  )
  return (
    <Box key="diff" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="diff-head" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Text bold wrap="wrap">{fileName(file.path)}</Text>
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {folder ? <Text dimColor>{`${folder} ·`}</Text> : null}
          {isNew || file.isNew ? <Text dimColor>new ·</Text> : null}
          {file.inRepo ? <Text color="success">{`+${file.plus.toLocaleString('en-US')}`}</Text> : null}
          {file.inRepo ? <Text color="error" dimColor={!file.minus}>{`−${file.minus.toLocaleString('en-US')}`}</Text> : null}
        </Box>
        {card || result ? <Text dimColor wrap="wrap">{`of the task “${cut(card ? titleOf(card) : (result?.title ?? ''), 40)}”`}</Text> : null}
        <Box flexDirection="row" gap={2} flexShrink={0}>
          {card ? <Button key={`diff-details-${presses}`} label="Details" plain onPress={() => openWork($, card.id)} /> : null}
          {result ? <Button key={`diff-result-${presses}`} label="Result" plain onPress={() => openReport($, result.id)} /> : null}
          {stat && !isNew ? <Button key={`diff-whole-${presses}`} label={isWhole ? 'Changes' : 'Whole file'} plain onPress={() => void ((presses += 1), isWhole ? diffWhole.delete(paneId) : diffWhole.add(paneId), redraw($))} /> : null}
        </Box>
      </Box>
      <Box key="diff-body" flexDirection="column" backgroundColor={OUTPUT_FILL} paddingX={1} paddingY={1} flexShrink={0}>
        {(showsWhole ? wholeCut.length < wholeText.length : diff.isCut) ? <Text dimColor>{`The first ${lines.length.toLocaleString('en-US')} lines`}</Text> : null}
        {body}
      </Box>
    </Box>
  )
}
