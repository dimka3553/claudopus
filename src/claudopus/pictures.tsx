// Pictures a piece of work made, drawn in its chat where it made them

// ---- Pictures a piece of work made, drawn in its chat where it made them ----

// How many of a chat's newest pictures are drawn small; older ones are a row that opens them. The small copy's widest side
const CHAT_THUMBS = 6
// The most pictures one chat shows
const PICS_LISTED = 40
const CHAT_THUMB_SIZES = ['360', '280']
// How tall an upright small copy is drawn at most, in the panel's pixels: a tall screenshot is drawn narrower, not longer
const PIC_TALL = 200
// The most characters a picture drawn as it is, an SVG of the work's own, may have
const SVG_CHARS = 100_000
type Pic = { name: string; path: string; thumb: Thumb; isGone?: boolean; big?: Thumb }
// The pictures pressed to be seen large, by path, and the large copies made
const bigPics = new Set<string>()
const bigs = new Map<string, Thumb>()
// A large copy: the panel's width at most, kept under what one drawing part takes
const BIG_SIZES = ['1200', '960', '720', '540']
const BIG_CHARS = 120_000
const bigOf = async ($: EngineInterface, path: string): Promise<Thumb> => {
  const stat = await $.fs.stat(path).catch(() => undefined)
  if (!stat) return null
  const id = `${path}:${stat.mtimeMs}`
  if (bigs.has(id)) return bigs.get(id) ?? null
  let big: Thumb = null
  if (/\.svg$/i.test(path)) {
    const text = stat.size <= SVG_CHARS ? await readOr($, path) : ''
    const from = text.indexOf('<svg')
    big = from >= 0 ? { source: text.slice(from), width: 0, height: 0 } : null
  } else if (RASTER.test(path)) {
    const to = `${dir}/thumbs/${slug(path).slice(-60)}-${mark(path).replace(':', '-')}-${Math.round(stat.mtimeMs)}-big.jpg`
    await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
    for (const size of BIG_SIZES) {
      if (!(await $.fs.exists(to)) || ((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) * 1.37 > BIG_CHARS)
        await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', path, '--out', to])
      else break
    }
    try {
      const bytes = (await $.fs.read(to, { as: 'bytes' })) as { base64: string }
      const sized = (await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', to])).stdout
      const width = Number(/pixelWidth:\s*(\d+)/.exec(sized)?.[1] ?? 0)
      const height = Number(/pixelHeight:\s*(\d+)/.exec(sized)?.[1] ?? 0)
      if (width && height && bytes.base64.length < BIG_CHARS)
        big = { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="data:image/jpeg;base64,${bytes.base64}" width="${width}" height="${height}"/></svg>`, width, height }
    } catch {
      big = null
    }
  }
  bigs.set(id, big)
  return big
}
const pics = new Map<string, Pic | null>()
const PICS_HELD = 60
let isThumbsCleared = false
// Each Details tab's pictures by step number, as last looked for, by the work
const shots = new Map<string, { key: string; shots: Map<number, Pic[]> }>()
// One picture as the chat shows it: where it is now (the copy a report kept, once the temporary file is gone) and its small copy.
// Nothing for a file a command only named that was there before the work began
const picOf = async ($: EngineInterface, given: string, one: Todo, isSeen: boolean, kept: Report[], isDrawn: boolean): Promise<Pic | null> => {
  const asked = given.startsWith('/') ? given : `${cwd}/${given}`
  const stat = await $.fs.stat(asked).catch(() => undefined)
  const copy = kept.filter(r => r.agent === one.id).flatMap(r => r.files.filter(file => fileName(file) === fileName(asked)).map(file => `${reportPath(r)}/${file}`))[0]
  if (!stat || stat.kind !== 'file') return copy && !isSeen ? picOf($, copy, one, false, [], isDrawn) : isSeen ? null : { name: fileName(asked), path: '', thumb: null, isGone: true }
  if (isSeen && stat.mtimeMs < one.startedAt - 5000) return null
  const id = `${asked}:${stat.mtimeMs}:${isDrawn}`
  if (pics.has(id)) return pics.get(id) ?? null
  let thumb: Thumb = null
  if (isDrawn && /\.svg$/i.test(asked) && stat.size <= SVG_CHARS) {
    const text = await readOr($, asked)
    const from = text.indexOf('<svg')
    if (from >= 0) thumb = { source: text.slice(from), width: 0, height: 0 }
  } else if (isDrawn && RASTER.test(asked)) {
    const to = `${dir}/thumbs/${slug(asked).slice(-60)}-${mark(asked).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
    if (!(await $.fs.exists(to))) {
      await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
      for (const size of CHAT_THUMB_SIZES) {
        await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '60', asked, '--out', to])
        if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= THUMB_BYTES) break
      }
    }
    thumb = await thumbOf($, to)
  }
  const pic = { name: fileName(asked), path: asked, thumb }
  // Only the pictures looked at lately are held
  if (pics.size >= PICS_HELD) pics.delete(pics.keys().next().value ?? '')
  pics.set(id, pic)
  return pic
}
// The pictures of a chat's shown lines, each at the last step that made it, by that step's number; the newest few drawn small
const picturesIn = async ($: EngineInterface, lines: Line[], one: Todo, kept: Report[], canDraw: boolean) => {
  // Small copies not looked at for two weeks are cleared, once a load
  if (!isThumbsCleared) {
    isThumbsCleared = true
    await $.process.run(['find', `${dir}/thumbs`, '-name', '*.jpg', '-mtime', '+14', '-delete']).catch(() => undefined)
  }
  const last = new Map<string, { at: number; isSeen: boolean }>()
  // Steps are numbered as the chat numbers them, and only the lines it shows count
  let uses = 0
  for (const line of newest(lines.map(one => ({ ...one, at: one.isUse ? (uses += 1) : uses }))))
    for (const [list, isSeen] of [
      [line.pictures ?? [], false],
      [line.seen ?? [], true],
    ] as const)
      for (const path of list) {
        // A picture made again is placed at its newest step
        const was = last.get(path)
        last.delete(path)
        last.set(path, { at: line.at ?? 0, isSeen: isSeen && was?.isSeen !== false })
      }
  // The newest pictures alone are looked at: a chat that made very many keeps its last ones
  const order = [...last.entries()].slice(-PICS_LISTED)
  const byStep = new Map<number, Pic[]>()
  let drawnCount = 0
  for (const [path, { at, isSeen }] of order.reverse()) {
    const pic = await picOf($, path, one, isSeen, kept, canDraw && drawnCount < CHAT_THUMBS).catch(() => null)
    if (!pic) continue
    if (pic.thumb) drawnCount += 1
    byStep.set(at, [pic, ...(byStep.get(at) ?? [])])
  }
  return byStep
}
// Reads a work's chat, and finds the pictures it made, for its Details tab, then draws the tab again. Called from the drawing, it
// runs after it: the chat is read again when the work has made a step, ended a response, been steered or ended, and its pictures
// looked for again when its chat or the reports change. One read of a work runs at a time; the next drawing reads what came since
const loading = new Set<string>()
// A chat the app would not give is asked for again after this long, at the tab's next drawing, never sooner
const RETRY_READ = 15_000
const loadWork = async ($: EngineInterface, id: string) => {
  if (loading.has(id)) return
  loading.add(id)
  let isChanged = false
  try {
    const one = (await read($, todos)).find(card => card.id === id)
    if (!one) return
    const key = [one.id, one.steps, one.tokens, one.entries.length, one.status].join(':')
    const kept = await read($, reports)
    const shotsKey = `${key}:${kept.length}`
    const now = await $.clock.now()
    const was = talks.get(id)
    if (was?.key !== key || (!was.lines && now - (was.at ?? 0) >= RETRY_READ)) {
      const rows = await $.session.messages({ agentId: id }).catch(() => undefined)
      talks.set(id, { key, lines: Array.isArray(rows) ? withSteers(talkOf(rows), one.entries) : undefined, at: now })
      isChanged = true
    }
    const lines = talks.get(id)?.lines
    if (lines && shots.get(id)?.key !== shotsKey) {
      shots.set(id, { key: shotsKey, shots: await picturesIn($, lines, one, kept, true).catch(() => new Map<number, Pic[]>()) })
      isChanged = true
    }
  } catch (err) {
    // Whatever went wrong, the tab stops saying it is reading, and says the chat is not to be had
    if (!talks.has(id)) talks.set(id, { key: '', lines: undefined, at: await $.clock.now().catch(() => 0) })
    isChanged = true
    await log($, `chat of ${id} not read: ${String(err)}`).catch(() => undefined)
  } finally {
    loading.delete(id)
  }
  // Drawn again only when something new was read, so a drawing that finds nothing new ends there
  if (isChanged) redraw($)
}
