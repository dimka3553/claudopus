// The octopus, the marks of work under way and pictures where the terminal draws them: it has no Svg, so each is a Raster, a box
// of cells that each hold two pixels, one over the other (▀ ▄ █ in one colour over another). Its moving ones are repainted in
// place a few times a second ($.ui.blit), so nothing else is drawn again; the app's own drawing never comes here

// The terminal's own colour, for a see-through pixel: the octopus sits on a dark terminal as on a light one
const TERM_DEFAULT = 0x01000000
type Cells = { columns: number; rows: number; cells: string }

// ---- Cells: pixels two to a cell, packed as the Raster takes them ----

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const toBase64 = (bytes: Uint8Array) => {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = ((bytes[i] ?? 0) << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63) + (i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : '=') + (i + 2 < bytes.length ? B64.charAt(n & 63) : '=')
  }
  return out
}
const fromBase64 = (text: string) => {
  const clean = text.replace(/[^A-Za-z0-9+/]/g, '')
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4))
  let n = 0
  let bits = 0
  let at = 0
  for (const ch of clean) {
    n = (n << 6) | B64.indexOf(ch)
    bits += 6
    if (bits >= 8) {
      bits -= 8
      out[at++] = (n >> bits) & 255
    }
  }
  return out.subarray(0, at)
}
// Cells, row by row, each [glyph, foreground, background] as little-endian 32-bit words
const packed = (words: number[]) => {
  const bytes = new Uint8Array(words.length * 4)
  words.forEach((word, i) => {
    bytes[i * 4] = word & 255
    bytes[i * 4 + 1] = (word >>> 8) & 255
    bytes[i * 4 + 2] = (word >>> 16) & 255
    bytes[i * 4 + 3] = (word >>> 24) & 255
  })
  return toBase64(bytes)
}
// Pixels (a colour 0xRRGGBB each, or -1 where none is) two rows to a cell: the upper half ▀ in the upper pixel's colour over the
// lower one's, or the terminal's own where a half has none
const halfBlocks = (pixels: ArrayLike<number>, width: number, height: number): Cells => {
  const rows = Math.ceil(height / 2)
  const words: number[] = []
  for (let r = 0; r < rows; r += 1)
    for (let c = 0; c < width; c += 1) {
      const top = pixels[2 * r * width + c] ?? -1
      const bottom = 2 * r + 1 < height ? (pixels[(2 * r + 1) * width + c] ?? -1) : -1
      if (top < 0 && bottom < 0) words.push(0x20, TERM_DEFAULT, TERM_DEFAULT)
      else if (top === bottom) words.push(0x2588, top, TERM_DEFAULT)
      else if (bottom < 0) words.push(0x2580, top, TERM_DEFAULT)
      else if (top < 0) words.push(0x2584, bottom, TERM_DEFAULT)
      else words.push(0x2580, top, bottom)
    }
  return { columns: width, rows, cells: packed(words) }
}
// One glyph per cell in one colour, on the terminal's own
const glyphCells = (glyphs: string, color: number): Cells => ({
  columns: [...glyphs].length,
  rows: 1,
  cells: packed([...glyphs].flatMap(ch => [ch === ' ' ? 0x20 : (ch.codePointAt(0) ?? 0x20), ch === ' ' ? TERM_DEFAULT : color, TERM_DEFAULT])),
})
const colorOf = (hex: string) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map(ch => ch + ch).join('') : h.slice(0, 6)
  const n = Number.parseInt(full, 16)
  return Number.isFinite(n) ? n : -1
}

// ---- The octopus's drawings, read from its SVG files: squares of one pixel each, in groups that show and hide in turn ----

// A drawing as the terminal plays it: each picture of it, how long each is shown, and how many times the whole plays (Infinity
// for one that loops); after its last time the last picture stays
type Sprite = { width: number; height: number; frames: number[][]; frameMs: number; loops: number }
const sprites = new Map<string, Sprite | null>()
const attrsOf = (text: string): Record<string, string | undefined> => Object.fromEntries([...text.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1] ?? '', m[2] ?? '']))
const spriteOf = (svg: string): Sprite | null => {
  if (sprites.has(svg)) return sprites.get(svg) ?? null
  type Group = { parent?: Group; fill?: string; vis?: string; anim?: { values: string[]; dur: number; loops: number } }
  const rects: { x: number; y: number; w: number; h: number; fill?: string; group: Group }[] = []
  const root: Group = {}
  const stack: Group[] = [root]
  let view = [0, 0, 0, 0]
  for (const m of svg.matchAll(/<(\/?)(svg|g|rect|animate)\b([^>]*?)(\/?)>/g)) {
    const [, closing, tag, rest = '', selfClosing] = m
    const a = attrsOf(rest)
    const top = stack[stack.length - 1] ?? root
    if (tag === 'svg' && !closing) {
      const box = (a.viewBox ?? '').split(/[\s,]+/).map(Number)
      view = box.length === 4 && box.every(Number.isFinite) ? box : [0, 0, Number(a.width) || 0, Number(a.height) || 0]
      if (a.fill) root.fill = a.fill
    } else if (tag === 'g') {
      if (closing) stack.length > 1 && stack.pop()
      else if (!selfClosing) stack.push({ parent: top, fill: a.fill, vis: a.visibility })
    } else if (tag === 'animate' && a.attributeName === 'visibility' && a.values) {
      const dur = Number.parseFloat(a.dur ?? '1') * (/ms$/.test(a.dur ?? '') ? 1 : 1000)
      top.anim = { values: a.values.split(';').map((one: string) => one.trim()), dur: dur || 1000, loops: a.repeatCount === 'indefinite' ? Infinity : Number(a.repeatCount) || 1 }
    } else if (tag === 'rect') rects.push({ x: Number(a.x) || 0, y: Number(a.y) || 0, w: Number(a.width) || 0, h: Number(a.height) || 0, fill: a.fill, group: top })
  }
  const [vx = 0, vy = 0, width = 0, height = 0] = view.map(Math.round)
  if (!width || !height || !rects.length) return sprites.set(svg, null), null
  const anims: NonNullable<Group['anim']>[] = []
  for (const r of rects) for (let g: Group | undefined = r.group; g; g = g.parent) if (g.anim && !anims.includes(g.anim)) anims.push(g.anim)
  const lead = anims.reduce<(typeof anims)[number] | undefined>((best, one) => (!best || one.values.length > best.values.length ? one : best), undefined)
  const count = lead?.values.length ?? 1
  const shows = (g: Group | undefined, i: number): boolean => {
    if (!g) return true
    const v = g.anim ? g.anim.values[Math.min(g.anim.values.length - 1, Math.floor((i * g.anim.values.length) / count))] : g.vis
    return v !== 'hidden' && shows(g.parent, i)
  }
  const fillOf = (r: (typeof rects)[number]) => {
    if (r.fill) return r.fill
    for (let g: Group | undefined = r.group; g; g = g.parent) if (g.fill) return g.fill
    return '#000000'
  }
  const frames = Array.from({ length: count }, (_, i) => {
    const px = new Array<number>(width * height).fill(-1)
    for (const r of rects) {
      if (!shows(r.group, i)) continue
      const color = colorOf(fillOf(r))
      for (let y = Math.max(r.y, vy); y < Math.min(r.y + r.h, vy + height); y += 1)
        for (let x = Math.max(r.x, vx); x < Math.min(r.x + r.w, vx + width); x += 1) px[(y - vy) * width + (x - vx)] = color
    }
    return px
  })
  const sprite = { width, height, frames, frameMs: lead ? lead.dur / count : 0, loops: lead?.loops ?? 1 }
  sprites.set(svg, sprite)
  return sprite
}
// One picture of a drawing, in the middle of a box of pixels, as cells
const spriteCells = (sprite: Sprite, frame: number, box: { width: number; height: number }) => {
  const px = new Array<number>(box.width * box.height).fill(-1)
  const dx = Math.floor((box.width - sprite.width) / 2)
  const dy = Math.floor((box.height - sprite.height) / 2)
  const from = sprite.frames[frame] ?? sprite.frames[0] ?? []
  for (let y = 0; y < sprite.height; y += 1)
    for (let x = 0; x < sprite.width; x += 1) {
      const at = (y + dy) * box.width + x + dx
      const color = from[y * sprite.width + x] ?? -1
      if (y + dy >= 0 && y + dy < box.height && x + dx >= 0 && x + dx < box.width && color >= 0) px[at] = color
    }
  return halfBlocks(px, box.width, box.height)
}

// ---- What moves: repainted in place a few times a second, each from its own start ----

// A moving Raster drawn somewhere: its pictures (cells each), how long each is shown, how many times they play, how long it has
// played, the picture last painted, and how many repaints in a row the terminal refused (one no longer shown is let go)
type Live = { requestId: string; key: string; frames: string[]; frameMs: number; loops: number; elapsed: number; shown: number; misses: number }
const lives = new Map<string, Live>()
// How often the moving ones are looked at; each is repainted only when its picture changes, a few times a second at most
const LIVE_TICK = 100
let stopLives: Timer | undefined
const frameOf = (one: { frames: unknown[]; frameMs: number; loops: number; elapsed: number }) => {
  if (one.frames.length < 2 || !one.frameMs) return 0
  const i = Math.floor(one.elapsed / one.frameMs)
  return i >= one.frames.length * one.loops ? one.frames.length - 1 : i % one.frames.length
}
const isOver = (one: { frames: unknown[]; frameMs: number; loops: number; elapsed: number }) =>
  one.frames.length < 2 || !one.frameMs || one.elapsed >= one.frames.length * one.loops * one.frameMs
const tickLives = ($: EngineInterface) => {
  for (const [id, one] of lives) {
    one.elapsed += LIVE_TICK
    const frame = frameOf(one)
    const over = isOver(one)
    if (frame === one.shown) {
      if (over) lives.delete(id)
      continue
    }
    one.shown = frame
    void $.ui
      .blit({ requestId: one.requestId, key: one.key, cells: one.frames[frame] ?? '' })
      .then(said => {
        const denied = Boolean(said && 'deny' in said && said.deny)
        one.misses = denied ? one.misses + 1 : 0
        if ((denied && one.misses >= 3) || over) lives.get(id) === one && lives.delete(id)
      })
      .catch(() => lives.get(id) === one && lives.delete(id))
  }
  if (!lives.size && stopLives) stopLives = (stopLives.cancel(), undefined)
}
// A Raster that plays its pictures from the moment given: drawn at the picture of now, then repainted in place as it moves on
const liveRaster = (
  ui: Ui,
  $: EngineInterface | undefined,
  requestId: string | undefined,
  key: string,
  frames: Cells[],
  frameMs: number,
  loops: number,
  elapsed: number,
) => {
  const table = ui as Ui & { Raster?: (props: RasterProps) => JSX.Element }
  if (!table.Raster || !frames.length) return null
  const one = { frames, frameMs, loops, elapsed: Math.max(0, elapsed) }
  const frame = frameOf(one)
  const id = `${requestId}\n${key}`
  // A site is given only with the engine that repaints it
  if (requestId && !isOver(one)) {
    lives.set(id, { requestId, key, frames: frames.map(f => f.cells), frameMs, loops, elapsed: one.elapsed, shown: frame, misses: 0 })
    if (!stopLives) stopLives = $!.clock.every(LIVE_TICK, () => tickLives($!))
  } else lives.delete(id)
  const cells = frames[frame] ?? frames[0]
  if (!cells) return null
  return <table.Raster key={key} columns={cells.columns} rows={cells.rows} cells={cells.cells} />
}

// ---- The octopus in the terminal ----

// Each drawing turned to cells once, by its source and the box it is drawn in
const spriteFrames = new Map<string, Cells[]>()
const framesOf = (source: string, box: { width: number; height: number }) => {
  const id = `${box.width}x${box.height}:${source}`
  const known = spriteFrames.get(id)
  if (known) return known
  const sprite = spriteOf(source)
  const frames = sprite ? sprite.frames.map((_, i) => spriteCells(sprite, i, box)) : []
  if (spriteFrames.size > 40) spriteFrames.clear()
  spriteFrames.set(id, frames)
  return frames
}
// Where each moment of the octopus began, by its mark, so a redraw draws the picture of now and the animation goes on from there
const momentStarts = new Map<string, number>()
// The band's octopus, one line tall: three cells of braille dots, each 2 by 4, a tiny octopus of 6 by 4 dots. At work its arms
// paddle; happy, it lifts them, then rests
const TINY: Record<'working' | 'happy', string[][]> = {
  working: [
    ['.####.', '#.##.#', '######', '#.#.#.'],
    ['.####.', '#.##.#', '######', '.#.#.#'],
  ],
  happy: [
    ['#.##.#', '##..##', '.####.', '.#..#.'],
    ['.####.', '#.##.#', '######', '#.#.#.'],
  ],
}
const brailleOf = (rows: string[]) => {
  let out = ''
  const bits = [
    [0x01, 0x08],
    [0x02, 0x10],
    [0x04, 0x20],
    [0x40, 0x80],
  ]
  for (let c = 0; c < (rows[0]?.length ?? 0); c += 2) {
    let n = 0
    for (let y = 0; y < 4; y += 1) for (let x = 0; x < 2; x += 1) if (rows[y]?.[c + x] === '#') n |= bits[y]?.[x] ?? 0
    out += String.fromCodePoint(0x2800 + n)
  }
  return out
}
// How big the octopus is in each place, in pixels (two to a cell, upright): the header's and About's fit the waving octopus,
// whose arms reach wider than the others', so the words beside it never move; the update screen's is the big jumping one
const TERM_HEAD = { width: 18, height: 18 }
const TERM_UPDATE = { width: 24, height: 22 }
// Which drawing the terminal draws in a place: the header's are the small octopus (the computers of the working one need more
// cells than a header has), the update screen's the big one; the band's is the tiny one
const termOctopus = (ui: Ui, key: string, art: keyof typeof ART, size: number, alt: string, $?: EngineInterface, requestId?: string) => {
  if (!('Raster' in ui)) return null
  const { Box } = ui
  const mark = momentOf(key, art)
  const now = Date.now()
  if (!momentStarts.has(mark)) {
    if (momentStarts.size > 200) momentStarts.clear()
    momentStarts.set(mark, now)
  }
  const elapsed = now - (momentStarts.get(mark) ?? now)
  if (size <= BAND_MARK) {
    const tiny = art === 'happySmall' || art === 'happy' ? TINY.happy : TINY.working
    const color = art === 'happySmall' || art === 'happy' ? colorOf('#4EBA65') : colorOf(LIVE)
    const frames = tiny.map(rows => glyphCells(brailleOf(rows), color))
    // Happy lifts its arms four times over the finish's two seconds, then rests; at work it paddles on
    const loops = tiny === TINY.happy ? 4 : Infinity
    return (
      <Box key={key} flexShrink={0}>
        {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, tiny === TINY.happy ? 250 : 300, loops, elapsed)}
      </Box>
    )
  }
  const small: Partial<Record<keyof typeof ART, string>> = {
    mark: ART.mark,
    working: ART.workingSmall,
    workingSmall: ART.workingSmall,
    happy: ART.happySmall,
    happySmall: ART.happySmall,
    wave: ART.wave,
    asking: ART.asking,
    updated: ART.happySmall ? updatedArt(ART.happySmall, FLOW) : '',
  }
  const isBig = size > HEAD_MARK
  const source = isBig ? ART[art] : small[art] || ART[art]
  const sprite = source ? spriteOf(source) : null
  if (!sprite) return null
  const frames = framesOf(source, isBig ? TERM_UPDATE : TERM_HEAD)
  return (
    <Box key={key} flexShrink={0}>
      {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, sprite.frameMs, sprite.loops, elapsed)}
    </Box>
  )
}

// ---- The marks of work under way, in the terminal ----

// A card's three dots, a brighter one passing along them as the app's pulse does; still once the work is not at work
const DOT_FRAMES = ['●•·', '•●•', '·•●', '•·•']
const termDots = (ui: Ui, $: EngineInterface, requestId: string, key: string) =>
  liveRaster(ui, $, requestId, key, DOT_FRAMES.map(one => glyphCells(one, colorOf(LIVE))), 300, Infinity, Date.now() % 1200)
// A helper at work: its dot with a ring that grows out of it and fades
const RING_FRAMES = ['●', '◉', '◎', '○']
const termRing = (ui: Ui, $: EngineInterface, requestId: string, key: string) =>
  liveRaster(ui, $, requestId, key, RING_FRAMES.map(one => glyphCells(one, colorOf(LIVE))), 350, Infinity, Date.now() % 1400)

// ---- Pictures in the terminal: a small copy of a few pixels per cell, in its colours ----

// A picture's cells for a width of cells, made once out of the drawing by sips as an uncompressed bitmap (BMP) and read here; the
// drawing is made again once they are. One that cannot be made is kept as such until its file changes
const termPictures = new Map<string, Cells | null>()
const termMaking = new Set<string>()
// How many rows a picture is at most, so a tall one is narrower, not longer
const TERM_PIC_ROWS = 36
// The pixels of a BMP sips wrote: 24 or 32 bits a pixel, rows from the bottom up or the top down; a pixel mostly see-through is none
const bmpPixels = (bytes: Uint8Array) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (bytes.length < 54 || view.getUint16(0, true) !== 0x4d42) return null
  const start = view.getUint32(10, true)
  const header = view.getUint32(14, true)
  const width = view.getInt32(18, true)
  const signed = view.getInt32(22, true)
  const bpp = view.getUint16(28, true)
  const compression = view.getUint32(30, true)
  if (width <= 0 || !signed || (bpp !== 24 && bpp !== 32) || (compression !== 0 && compression !== 3)) return null
  const height = Math.abs(signed)
  const masks =
    compression === 3 && header >= 56
      ? [view.getUint32(54, true), view.getUint32(58, true), view.getUint32(62, true), view.getUint32(66, true)]
      : compression === 3
        ? [view.getUint32(54, true), view.getUint32(58, true), view.getUint32(62, true), 0]
        : bpp === 32
          ? [0x00ff0000, 0x0000ff00, 0x000000ff, 0]
          : [0, 0, 0, 0]
  const channel = (value: number, mask: number) => {
    if (!mask) return 255
    let shift = 0
    while (!((mask >>> shift) & 1)) shift += 1
    const max = mask >>> shift
    return Math.round((((value & mask) >>> shift) * 255) / max)
  }
  const stride = Math.ceil((width * bpp) / 32) * 4
  const px = new Array<number>(width * height).fill(-1)
  for (let y = 0; y < height; y += 1) {
    const row = start + (signed > 0 ? height - 1 - y : y) * stride
    for (let x = 0; x < width; x += 1) {
      const at = row + (x * bpp) / 8
      if (at + bpp / 8 > bytes.length) return null
      let r: number
      let g: number
      let b: number
      let alpha = 255
      if (bpp === 24) [b, g, r] = [bytes[at] ?? 0, bytes[at + 1] ?? 0, bytes[at + 2] ?? 0]
      else {
        const v = view.getUint32(at, true)
        const [mr = 0, mg = 0, mb = 0, ma = 0] = masks
        r = channel(v, mr)
        g = channel(v, mg)
        b = channel(v, mb)
        alpha = ma ? channel(v, ma) : 255
      }
      px[y * width + x] = alpha < 128 ? -1 : (r << 16) | (g << 8) | b
    }
  }
  return { width, height, px }
}
const makeTermPicture = async ($: EngineInterface, path: string, columns: number): Promise<Cells | null> => {
  const said = (await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path]).catch(() => ({ stdout: '' }))).stdout
  const width = Number(/pixelWidth:\s*(\d+)/.exec(said)?.[1] ?? 0)
  const height = Number(/pixelHeight:\s*(\d+)/.exec(said)?.[1] ?? 0)
  if (!width || !height) return null
  // Pixels as wide as the cells, as many down as keep its shape (a cell is two pixels tall), a tall one narrowed to fit
  let w = Math.max(1, Math.min(columns, width))
  let h = Math.max(1, Math.round((w * height) / width))
  if (h > TERM_PIC_ROWS * 2) (h = TERM_PIC_ROWS * 2), (w = Math.max(1, Math.round((h * width) / height)))
  const out = `${dir}/thumbs/term-${Math.random().toString(36).slice(2, 10)}.bmp`
  try {
    await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
    const made = await $.process.run(['sips', '-z', String(h), String(w), '-s', 'format', 'bmp', path, '--out', out])
    if (made.exitCode !== 0) return null
    const read = (await $.fs.read(out, { as: 'bytes' })) as { base64: string }
    const pic = bmpPixels(fromBase64(read.base64))
    return pic ? halfBlocks(pic.px, pic.width, pic.height) : null
  } finally {
    await $.process.run(['rm', '-f', out]).catch(() => undefined)
  }
}
// The cells of a picture as wide as the cells given, else nothing yet (being made) or null (it cannot be)
const termPictureOf = async ($: EngineInterface, path: string, columns: number): Promise<Cells | null | undefined> => {
  const stat = await $.fs.stat(path).catch(() => undefined)
  if (!stat || stat.kind !== 'file') return null
  return termPictureNow($, path, columns, String(stat.mtimeMs))
}
// The same for a drawing that cannot wait, by a mark of the file's version it was given: what is made, or it is begun
const termPictureNow = ($: EngineInterface, path: string, columns: number, version: string): Cells | null | undefined => {
  const id = `${path}:${version}:${columns}`
  if (termPictures.has(id)) return termPictures.get(id) ?? null
  if (!termMaking.has(id)) {
    termMaking.add(id)
    // Made from a timer, not from the drawing: what a drawing starts is cut off once it is drawn again
    $.clock.after(0, () =>
      void makeTermPicture($, path, columns)
        .catch(err => (void log($, `terminal picture of ${path} not made: ${String(err)}`), null))
        .then(cells => {
          if (termPictures.size >= 30) termPictures.delete(termPictures.keys().next().value ?? '')
          termPictures.set(id, cells)
          termMaking.delete(id)
          $.ui.invalidate('ui.render')
        }),
    )
  }
  return undefined
}
// A picture's cells drawn, or a dim line while they are made
const termPicture = (ui: Ui, key: string, cells: Cells | null | undefined, alt: string) => {
  const table = ui as Ui & { Raster?: (props: RasterProps) => JSX.Element }
  if (!table.Raster || cells === null) return null
  if (!cells) return <ui.Text key={key} dimColor>{`${alt} · drawing it…`}</ui.Text>
  return <table.Raster key={key} columns={cells.columns} rows={cells.rows} cells={cells.cells} />
}
