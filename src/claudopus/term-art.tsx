// The octopus and the marks of work under way where the terminal draws them: it has no Svg, so each is a Raster, a box of cells,
// each a glyph in one colour. Its moving ones are repainted in place a few times a second ($.ui.blit), so nothing else is drawn
// again; the app's own drawing never comes here. Pictures are not drawn in a terminal: a press opens them (pictures)

// The terminal's own colour, for a see-through pixel: the octopus sits on a dark terminal as on a light one
const TERM_DEFAULT = 0x01000000
type Cells = { columns: number; rows: number; cells: string }

// ---- Cells, packed as the Raster takes them ----

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const toBase64 = (bytes: Uint8Array) => {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = ((bytes[i] ?? 0) << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63) + (i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : '=') + (i + 2 < bytes.length ? B64.charAt(n & 63) : '=')
  }
  return out
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
// The terminal's octopus: 14 by 6 pixels, each cell four of them (▘▝▖▗ and their joins) in one colour on the terminal's own, so it
// is three rows tall, the size of Claude Code's own mark beside its three lines. Each picture of it, and how each state plays them
const TERM_OCTO_HEAD = ['...########...', '..##########..', '..##..##..##..', '..##########..']
const TERM_OCTO: Record<string, string[]> = {
  rest: [...TERM_OCTO_HEAD, '..#.#.##.#.#..', '.#..#....#..#.'],
  paddle: [...TERM_OCTO_HEAD, '..#.#.##.#.#..', '..#.#....#.#..'],
  hand: ['...########.#.', '..##########.#', '..##..##..###.', '..##########..', '..#.#.##.#....', '.#..#....#....'],
  cheer: [...TERM_OCTO_HEAD, '.#.#..##..#.#.', '#..#......#..#'],
  wave: ['...########...', '..##########.#', '..##..##..####', '..##########..', '..#.#.##.#....', '.#..#....#....'],
  jump: ['..............', '...########...', '..##########..', '..##..##..##..', '..##########..', '.#.#.#..#.#.#.'],
}
// At work it paddles on; something waiting raises a hand in amber; finished, it cheers in green four times; About waves; just
// updated, it jumps in blue
const TERM_PLAYS: Partial<Record<keyof typeof ART, { frames: string[]; color: string; frameMs: number; loops: number }>> = {
  mark: { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 },
  working: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
  workingSmall: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
  asking: { frames: ['hand', 'rest'], color: NEEDS, frameMs: 600, loops: Infinity },
  happy: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
  happySmall: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
  wave: { frames: ['wave', 'rest'], color: 'live', frameMs: 400, loops: 4 },
  updated: { frames: ['jump', 'rest'], color: '#4E93EF', frameMs: 300, loops: 6 },
}
const QUADS = ' ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█'
const quadCells = (rows: string[], color: number): Cells => {
  const width = Math.ceil((rows[0]?.length ?? 0) / 2)
  const height = Math.ceil(rows.length / 2)
  const on = (x: number, y: number) => (rows[y]?.[x] === '#' ? 1 : 0)
  const words: number[] = []
  for (let r = 0; r < height; r += 1)
    for (let c = 0; c < width; c += 1) {
      const n = on(2 * c, 2 * r) | (on(2 * c + 1, 2 * r) << 1) | (on(2 * c, 2 * r + 1) << 2) | (on(2 * c + 1, 2 * r + 1) << 3)
      words.push(n ? (QUADS.codePointAt(n) ?? 0x20) : 0x20, n ? color : TERM_DEFAULT, TERM_DEFAULT)
    }
  return { columns: width, rows: height, cells: packed(words) }
}
// Twice as large: each pixel two cells wide and one tall, which is square on a terminal
const doubledCells = (rows: string[], color: number): Cells => {
  const width = (rows[0]?.length ?? 0) * 2
  const words: number[] = []
  for (const row of rows) for (const ch of row) for (let i = 0; i < 2; i += 1) words.push(ch === '#' ? 0x2588 : 0x20, ch === '#' ? color : TERM_DEFAULT, TERM_DEFAULT)
  return { columns: width, rows: rows.length, cells: packed(words) }
}
// Which drawing the terminal draws in a place: the band's is the tiny one, every other the small one above
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
    const color = art === 'happySmall' || art === 'happy' ? colorOf('#4EBA65') : colorOf(art === 'asking' ? NEEDS : LIVE)
    const frames = tiny.map(rows => glyphCells(brailleOf(rows), color))
    // Happy lifts its arms four times over the finish's two seconds, then rests; at work it paddles on
    const loops = tiny === TINY.happy ? 4 : Infinity
    return (
      <Box key={key} flexShrink={0}>
        {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, tiny === TINY.happy ? 250 : 300, loops, elapsed)}
      </Box>
    )
  }
  // Everywhere else the small octopus, three rows tall beside the header's three lines, as big as Claude Code's own mark; on the
  // update screen the same drawing twice as large
  const play = TERM_PLAYS[art] ?? { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 }
  const color = colorOf(play.color === 'live' ? LIVE : play.color)
  const frames = play.frames.map(name => (size > HEAD_MARK ? doubledCells : quadCells)(TERM_OCTO[name] ?? TERM_OCTO_HEAD, color))
  return (
    <Box key={key} flexShrink={0}>
      {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, play.frameMs, play.loops, elapsed)}
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
