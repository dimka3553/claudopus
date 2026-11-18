// What a task made, as things the person presses to open: on its card a row of small items, in its Details and in its result
// tiles side by side

// ---- What a task made ----

// Each kind of file a tile is drawn for: how it is told by its name, its word for one and for several, and its badge
const MADE_KINDS: { kind: MadeKind; test: RegExp; one: string; many: string; badge: string; color: string }[] = [
  { kind: 'picture', test: /\.(png|jpe?g|gif|webp|svg|heic)$/i, one: 'picture', many: 'pictures', badge: 'IMG', color: '#3A78C9' },
  { kind: 'video', test: /\.(mp4|mov|webm|m4v)$/i, one: 'video', many: 'videos', badge: 'VID', color: '#8B5CF6' },
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
const MADE_LOOKED = 150
// The most things a card's row names before "and N more", and the most tiles a Files part draws before the same
const CHIPS_MOST = 6
const TILES_MOST = 24
// The most small copies one Files part has made: the first tiles only, the rest keep their icon
const FACES_MOST = 12
// A tile's picture in the panel's pixels, and the most characters every tile's small copy together takes in one drawing
const TILE_W = 112
const TILE_H = 84
const TILE_CHARS = 60_000
const TILE_THUMB_BYTES = 9_000

// The paths one tool call writes or names: the file a file tool is given, and in a command the files of a kind a tile is drawn for
const wroteBy = (e: { tool: string }) => {
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return [String(input.file_path ?? input.notebook_path ?? '')].filter(path => path.startsWith('/'))
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
  const r = await $.process.run(['git', '-C', folder, 'rev-parse', '--show-toplevel'], { timeoutMs: 4000 }).catch(() => undefined)
  const top = r?.exitCode === 0 ? r.stdout.trim() : ''
  if (repoOf.size > 200) repoOf.clear()
  repoOf.set(folder, top)
  return top
}
// How many lines a task added to and took from the files it changed in one repo, against the repo as it stood when the task began:
// only the files it wrote itself are counted, so what a merge brought in is left out. A file new since then counts every line
const COUNT_LINES =
  'cd "$1" || exit 1; since=$2; shift 2; base=$(git rev-list -1 --before="$since" HEAD 2>/dev/null); [ -n "$base" ] || base=$(git rev-parse HEAD 2>/dev/null) || exit 1; for f in "$@"; do if git cat-file -e "$base:$f" 2>/dev/null; then git diff --numstat "$base" -- "$f"; elif [ -f "$f" ]; then printf \'%s\\t0\\t%s\\n\' "$(grep -c \'\' "$f")" "$f"; fi; done'
const codeOf = async ($: EngineInterface, byTop: Map<string, string[]>, since: number): Promise<CodeMade | undefined> => {
  let count = 0
  let plus = 0
  let minus = 0
  for (const [top, paths] of byTop) {
    const r = await $.process.run(['sh', '-c', COUNT_LINES, 'sh', top, String(Math.floor(since / 1000)), ...paths.map(path => path.slice(top.length + 1))], { timeoutMs: 8000 }).catch(() => undefined)
    if (r?.exitCode !== 0) continue
    for (const line of rows(r.stdout)) {
      const [added = '', taken = ''] = line.split('\t')
      if (!/^(\d+|-)$/.test(added)) continue
      count += 1
      plus += Number(added) || 0
      minus += Number(taken) || 0
    }
  }
  return count ? { count, plus, minus } : undefined
}
// Links a result names, the first few: a page it put online, a report it added
const linksIn = (text: string) => [...new Set((text.match(/https?:\/\/[^\s`'"()<>[\]{}|,;*]+/g) ?? []).map(link => link.replace(/[.:!?]+$/, '')))].slice(0, 3)
const linkName = (link: string) => {
  const [host = '', ...rest] = link.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')
  const last = rest.at(-1) ?? ''
  return last ? `${host.replace(/^www\./, '').split('.')[0]} ${rest.length > 1 ? `${rest.at(-2)} ` : ''}${last}`.slice(0, 40) : host.replace(/^www\./, '')
}
// What a task made: the files its steps wrote or its commands named, and the files and links its result names, that are there and
// were made since it began. A picture, video, PDF, spreadsheet or document is a thing of its own, as is any file the result names;
// the other files it wrote inside a repo are its code, counted and never listed
const madeBy = async ($: EngineInterface, wrote: string[], answer: string, since: number, isDated = true): Promise<FilesMade> => {
  const named = namedPaths(answer)
  const made: Made[] = []
  const byTop = new Map<string, string[]>()
  const seen = new Set<string>()
  for (const given of [...named, ...wrote].slice(0, MADE_LOOKED)) {
    const path = given.replace(/^\/private(?=\/(tmp|var)\/)/, '')
    if (seen.has(path)) continue
    seen.add(path)
    const isNamed = named.includes(given)
    const stat = await $.fs.stat(path).catch(() => undefined)
    if (!stat || stat.kind !== 'file' || (isDated && stat.mtimeMs < since - 5000)) continue
    const kind = madeKind(path).kind
    const isOwn = kind !== 'file' && !(TEXT_DOC.test(path) && !isNamed)
    if (isOwn || isNamed) {
      // What a step only wrote into a temporary folder or Claudopus's own memory is its scratch, not what it made
      if (!isNamed && (TEMP.test(path) || (dir && path.startsWith(`${dir}/`)))) continue
      made.push({ path, name: fileName(path), kind })
      continue
    }
    const top = await repoTop($, path.slice(0, path.lastIndexOf('/')))
    if (top && path.startsWith(`${top}/`)) byTop.set(top, [...(byTop.get(top) ?? []), path])
  }
  for (const link of linksIn(answer)) made.push({ path: link, name: linkName(link), kind: 'link' })
  const code = byTop.size ? await codeOf($, byTop, since).catch(() => undefined) : undefined
  return { made, ...(code ? { code } : {}) }
}
// What a card draws: its task's files as last listed, and listed again, out of the drawing, once it has written more or ended
const madeOf = new Map<string, { key: string; files: FilesMade }>()
const madeLoading = new Set<string>()
const madeNow = ($: EngineInterface, one: Todo): FilesMade | undefined => {
  if (one.chat) return undefined
  const key = `${(one.wrote ?? []).length}:${one.answer.length}:${one.status}`
  const was = madeOf.get(one.id)
  if (was?.key !== key && !madeLoading.has(one.id) && ((one.wrote ?? []).length || one.answer)) {
    madeLoading.add(one.id)
    void madeBy($, one.wrote ?? [], one.status === 'working' ? '' : one.answer, one.begunAt ?? one.startedAt)
      .then(files => {
        if (madeOf.size > 200) madeOf.delete(madeOf.keys().next().value ?? '')
        madeOf.set(one.id, { key, files })
      })
      .catch(err => log($, `files of ${one.id} not listed: ${String(err)}`))
      .finally(() => (madeLoading.delete(one.id), redraw($)))
  }
  return was?.files
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
      const listed = await madeBy($, one?.wrote ?? [], text, one ? (one.begunAt ?? one.startedAt) : 0, Boolean(one)).catch(() => ({ made: [] }))
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
let qlMade = 0
const makeFace = async ($: EngineInterface, one: Made): Promise<Face> => {
  if (one.kind === 'link' || one.kind === 'file' || /\.svg$/i.test(one.path)) return null
  const stat = await $.fs.stat(one.path).catch(() => undefined)
  if (!stat || stat.kind !== 'file') return null
  const to = `${dir}/thumbs/tile-${slug(one.path).slice(-60)}-${mark(one.path).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
  if (!(await $.fs.exists(to))) {
    await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
    let from = one.path
    let scratch = ''
    if (one.kind !== 'picture' && one.kind !== 'pdf') {
      // Quick Look is the Mac's own: elsewhere the tile keeps its icon
      if (isLinux) return null
      scratch = `${dir}/thumbs/ql-${Math.round(await $.clock.now())}-${(qlMade += 1)}`
      await $.process.run(['mkdir', '-p', scratch])
      await $.process.run(['qlmanage', '-t', '-s', '320', '-o', scratch, one.path], { timeoutMs: 15_000 }).catch(() => undefined)
      from = `${scratch}/${fileName(one.path)}.png`
      if (!(await $.fs.exists(from))) return (await $.process.run(['rm', '-rf', scratch]).catch(() => undefined), null)
    }
    for (const [size, quality] of [['240', '50'], ['240', '35'], ['180', '40']] as const) {
      await $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, from, '--out', to], { timeoutMs: 15_000 }).catch(() => undefined)
      if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= TILE_THUMB_BYTES) break
    }
    if (scratch) await $.process.run(['rm', '-rf', scratch]).catch(() => undefined)
  }
  const read = (await $.fs.read(to, { as: 'bytes' }).catch(() => undefined)) as { base64: string } | undefined
  return read?.base64 && read.base64.length < TILE_THUMB_BYTES * 2 ? { base64: read.base64 } : null
}
// The small copies as made so far; the missing ones are made out of the drawing, one after another, and the drawing drawn again
const facesNow = ($: EngineInterface, list: Made[]) => {
  const missing = list.filter(one => !faces.has(one.path) && !facesLoading.has(one.path))
  if (missing.length) {
    for (const one of missing) facesLoading.add(one.path)
    void (async () => {
      for (const one of missing) {
        const face = await makeFace($, one).catch(() => null)
        if (faces.size > 300) faces.delete(faces.keys().next().value ?? '')
        faces.set(one.path, face)
        facesLoading.delete(one.path)
      }
    })()
      .catch(err => log($, `small copies of files not made: ${String(err)}`))
      .finally(() => (missing.forEach(one => facesLoading.delete(one.path)), redraw($)))
  }
  return faces
}

// ---- How they are drawn ----

const SVG_FONT = 'font-family="-apple-system,Helvetica,sans-serif"'
// A page with its kind on it, a link, a branch: what a file is, drawn small
const pageIcon = (badge: string, color: string) =>
  `<path d="M4.5 1.5h13l7 7v21a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-27a1 1 0 0 1 1-1z" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><path d="M17.5 1.5v7h7" fill="none" stroke="#9a9890" stroke-width="1.2"/>${badge ? `<rect x="1" y="15" width="${badge.length > 3 ? 22 : 19}" height="10" rx="2" fill="${color}"/><text x="${badge.length > 3 ? 12 : 10.5}" y="22.6" font-size="7" ${SVG_FONT} font-weight="700" fill="#fff" text-anchor="middle">${badge}</text>` : ''}`
const LINK_ICON = '<rect x="2.5" y="4.5" width="23" height="23" rx="5" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><path d="M11 13.5h-1.5a3.5 3.5 0 0 0 0 7H11M17 13.5h1.5a3.5 3.5 0 0 1 0 7H17M11.5 17h5" fill="none" stroke="#C9A7FF" stroke-width="1.6" stroke-linecap="round"/>'
const CODE_ICON = '<circle cx="9" cy="8" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="9" cy="24" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="19" cy="12" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><path d="M9 10.6v10.8M19 14.6c0 4-10 3-10 6.8" fill="none" stroke="#9a9890" stroke-width="1.5"/>'
const iconOf = (kind: MadeKind | 'code') => (kind === 'code' ? CODE_ICON : kind === 'link' ? LINK_ICON : pageIcon(madeKindOf(kind).badge, madeKindOf(kind).color))
const svgOfIcon = (kind: MadeKind | 'code', width: number, height: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 28 32">${iconOf(kind)}</svg>`
const tileSvg = (inner: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">${inner}</svg>`
// A small copy cut to its place from its top, with rounded corners
const tilePicture = (face: { base64: string }, x: number, y: number, w: number, h: number) =>
  `<clipPath id="c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath><g clip-path="url(#c)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/><image href="data:image/jpeg;base64,${face.base64}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMin slice"/></g><rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="4" fill="none" stroke="#ffffff30"/>`
const tilePlay = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="12" fill="#000a"/><path d="M${cx - 4} ${cy - 6}l10 6-10 6z" fill="#fff"/>`
const tileBadge = (kind: MadeKind) => {
  const { badge, color } = madeKindOf(kind)
  return kind === 'pdf' || kind === 'sheet' || kind === 'doc' ? `<rect x="4" y="${TILE_H - 17}" width="${badge.length * 6 + 8}" height="13" rx="3" fill="${color}"/><text x="8" y="${TILE_H - 7.5}" font-size="8.5" ${SVG_FONT} font-weight="700" fill="#fff">${badge}</text>` : ''
}
const tileIcon = (kind: MadeKind | 'code') => `<rect width="${TILE_W}" height="${TILE_H}" rx="4" fill="#ffffff12"/><g transform="translate(${TILE_W / 2 - 17.5} ${TILE_H / 2 - 20}) scale(1.25)">${iconOf(kind)}</g>`
// One file: its small copy filling the tile, with its kind in the corner where the picture alone does not say it; else its icon
const oneTile = (one: Made, face: Face | undefined) => tileSvg(face ? tilePicture(face, 0, 0, TILE_W, TILE_H) + (one.kind === 'video' ? tilePlay(TILE_W / 2, TILE_H / 2) : '') + tileBadge(one.kind) : tileIcon(one.kind))
// Several of a kind: the first one's small copy on two more sheets
const pileTile = (first: Made, face: Face | undefined) =>
  tileSvg(
    `<rect x="8" y="0" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#55554f"/><rect x="4" y="4" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#77766f"/>` +
      (face ? tilePicture(face, 0, 8, TILE_W - 8, TILE_H - 8) + (first.kind === 'video' ? tilePlay((TILE_W - 8) / 2, 8 + (TILE_H - 8) / 2) : '') : `<rect x="0" y="8" width="${TILE_W - 8}" height="${TILE_H - 8}" rx="4" fill="#3b3b39" stroke="#ffffff30"/><g transform="translate(${(TILE_W - 8) / 2 - 17.5} ${8 + (TILE_H - 8) / 2 - 20}) scale(1.25)">${iconOf(first.kind)}</g>`),
  )
// Code: how many lines were added and taken away
const codeTile = (code: CodeMade) =>
  tileSvg(
    `<rect width="${TILE_W}" height="${TILE_H}" rx="4" fill="#ffffff12"/><text x="${TILE_W / 2}" y="${TILE_H / 2 - 3}" font-size="15" ${SVG_FONT} font-weight="600" fill="#57AB5A" text-anchor="middle">+${code.plus.toLocaleString('en-US')}</text><text x="${TILE_W / 2}" y="${TILE_H / 2 + 16}" font-size="15" ${SVG_FONT} font-weight="600" fill="#E5534B" text-anchor="middle">−${code.minus.toLocaleString('en-US')}</text>`,
  )

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
  const skip = sharedStart(files.made.filter(one => one.kind !== 'link').map(one => bareName(one.name)))
  const nameOf = (one: Made) => (one.kind === 'link' ? one.name : bareName(one.name).slice(skip) || bareName(one.name))
  const kinds: MadeKind[] = [...MADE_KINDS.map(one => one.kind), 'link']
  return kinds.flatMap(kind => {
    const list = files.made.filter(one => one.kind === kind)
    if (kind !== 'link' && list.length >= 3 && !opened(kind)) return [{ key: `pile-${kind}`, label: `${list.length} ${madeKindOf(kind).many}`, kind, files: list }]
    return list.map((one, n) => ({ key: `${kind}-${n}`, label: nameOf(one), kind, files: [one] }))
  })
}
const countWord = (code: CodeMade) => `${code.count.toLocaleString('en-US')} code ${code.count === 1 ? 'file' : 'files'}`
// Opens what was pressed where the person is: a picture as the chat's pictures open, any other file or a link as the system opens it
const openMade = async ($: EngineInterface, one: Made, pane: string, row: string, surface?: RenderSurface) => {
  if (one.kind === 'picture') return showPicture($, one.path, pane, row, surface)
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
  const icon = (kind: MadeKind | 'code', at: string) => (table.Svg && !('isTerminal' in ui) ? <table.Svg key={`${at}-icon`} source={svgOfIcon(kind, 18, 20)} alt="" width={18} height={20} /> : null)
  return (
    <Box key={key} flexDirection="row" flexWrap="wrap" columnGap={2} rowGap={0}>
      {shown.map(thing => (
        <Box key={`${key}-${thing.key}`} flexDirection="row" alignItems="center" flexShrink={0} height={1} overflow="hidden">
          {icon(thing.kind, `${key}-${thing.key}`)}
          <Button
            key={`${key}-${thing.key}-open-${presses}`}
            label={`${cut(thing.label, 18)}${thing.kind === 'link' ? ' ↗' : ''}`}
            plain
            onPress={press => void ((presses += 1), thing.files.length > 1 ? onOpenWork() : thing.files[0] ? openMade($, thing.files[0], '', '', press.surface) : undefined)}
          />
        </Box>
      ))}
      {things.length > shown.length ? <Text key={`${key}-more`} dimColor>{`and ${things.length - shown.length} more`}</Text> : null}
      {files.code ? (
        <Box key={`${key}-code`} flexDirection="row" alignItems="center" gap={1} flexShrink={0} height={1} overflow="hidden">
          {icon('code', `${key}-code`)}
          <Text>{countWord(files.code)}</Text>
          <Text color="success">{`+${files.code.plus.toLocaleString('en-US')}`}</Text>
          {files.code.minus ? <Text color="error">{`−${files.code.minus.toLocaleString('en-US')}`}</Text> : null}
        </Box>
      ) : null}
    </Box>
  )
}
// In a task's Details and in its result: the same things as tiles side by side, a small copy and a name each, each a press. A
// stack opens out into a tile for each of its files. Where no picture can be drawn, a row each
const madeTiles = ($: EngineInterface, ui: Ui, files: FilesMade, pane: string, key: string, surface?: RenderSurface) => {
  if (!files.made.length && !files.code) return null
  const { Box, Button, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const canDraw = Boolean(table.Svg) && surface !== 'terminal' && !('isTerminal' in ui)
  const things = thingsOf(files, kind => openPiles.has(`${pane}:${kind}`))
  const shown = things.slice(0, TILES_MOST)
  const made = canDraw ? facesNow($, shown.slice(0, FACES_MOST).flatMap(thing => thing.files.slice(0, 1))) : faces
  let chars = 0
  const faceOf = (one: Made | undefined) => {
    const face = one ? made.get(one.path) : undefined
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
            <Box key={row} flexDirection="column" alignItems="flex-start" width={canDraw ? 12 : undefined} flexShrink={0}>
              {canDraw && table.Svg ? <table.Svg key={`${row}-svg`} source={thing.files.length > 1 ? pileTile(thing.files[0]!, faceOf(thing.files[0])) : oneTile(thing.files[0]!, faceOf(thing.files[0]))} alt={thing.label} width={TILE_W} height={TILE_H} /> : null}
              <Button key={`${row}-open-${presses}`} label={cut(thing.label, canDraw ? 13 : 60)} plain onPress={press(thing, row)} />
            </Box>
          )
        })}
        {files.code ? (
          <Box key={`${key}-code`} flexDirection="column" alignItems="flex-start" width={canDraw ? 12 : undefined} flexShrink={0}>
            {canDraw && table.Svg ? <table.Svg key={`${key}-code-svg`} source={codeTile(files.code)} alt={countWord(files.code)} width={TILE_W} height={TILE_H} /> : null}
            <Text dimColor wrap="truncate-end">{canDraw ? countWord(files.code) : `${countWord(files.code)} · +${files.code.plus.toLocaleString('en-US')} −${files.code.minus.toLocaleString('en-US')}`}</Text>
          </Box>
        ) : null}
      </Box>
      {things.length > shown.length ? <Text dimColor>{`and ${things.length - shown.length} more`}</Text> : null}
      {fewer.length ? (
        <Box alignItems="flex-start">
          <Button key={`${key}-fewer-${presses}`} label="Show fewer" plain dimColor onPress={() => void ((presses += 1), fewer.forEach(kind => openPiles.delete(`${pane}:${kind}`)), redraw($))} />
        </Box>
      ) : null}
    </Box>
  )
}
