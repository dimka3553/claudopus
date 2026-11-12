// The header's art: the octopus at rest, working, happy and asking, and the dots of a card's state

// The height of one line of the app's text, in its pixels: a mark drawn this tall with its shape in the middle sits on the first line of the text beside it
const LINE = 20
// Three dots that pulse while work runs, for a surface that can draw them
const dots = (color: string, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="${height}" viewBox="0 0 22 ${height}">${[0, 1, 2]
    .map(
      i =>
        `<circle cx="${3 + i * 8}" cy="${height / 2}" r="2.5" fill="${color}"><animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')}</svg>`
// Claudopus purple, the colour of work that is under way: Claude is orange, its opposite purple
const LIVE = '#8A63F0'
// Work that needs the person's hands now: its card's bar and its ask
const NEEDS = '#E5A50A'
const LIVE_DOTS = dots(LIVE, LINE)
// The mark of work that finished
const DONE = 'success'
// The octopus: resting, working at its computers (drawn from 32 px up), and lifting its arms (for 16 to 24 px). Each is an SVG
// file of the mod's, art/<name>.svg, read when the session starts: a drawing is swapped by replacing its file. Happy is the
// octopus in the finished green, bouncing with its arms up once over the two seconds finished work pauses, then still
// Asking is the wave in the amber of work that needs the person: it waves once as something starts to wait, then rests amber
const ART = { mark: '', working: '', workingSmall: '', happy: '', happySmall: '', wave: '', asking: '' }
const ART_FILES: Record<Exclude<keyof typeof ART, 'asking'>, string> = { mark: 'mark.svg', working: 'working.svg', workingSmall: 'working-small.svg', happy: 'happy.svg', happySmall: 'happy-small.svg', wave: 'wave.svg' }
// Whether the octopus is happy at a time: work of this chat's that finished, not stopped or failed, is in its pause. A new drawing
// starts its animation, so it plays from the first finish and holds its last picture through any finish that follows in the pause
const isHappy = (cards: { id: string; parentId?: string; status: string; endedAt: number }[], at: number) =>
  cards.some(one => !one.parentId && one.status === 'done' && isLingering(one, at))
// How big the octopus is drawn in the panel's header and in the line above the prompt, in the app's pixels
const HEAD_MARK = 48
const BAND_MARK = 16
// The app draws an Svg as a picture and keeps a picture it drew before, animation and all: the same drawing shown again starts
// where its last showing ended, at rest, so a second finish would stay still. Each time a place turns to a drawing, that drawing
// is marked with the moment and so is new to the app, and plays from its start; it keeps that mark while it stays, so a redraw
// does not restart it; a happy octopus not drawn for a while, as in a closed panel, starts a new moment. The mark holds this run's own
// letters, so a drawing of another chat's panel is never the same either
const moments = new Map<string, { art: keyof typeof ART; mark: string; at: number }>()
const MOMENT_GAP = 5000
// The happy drawings last only a finish's short pause, so one drawn again after a gap is a new finish and plays anew; the wave
// rests on its last picture for as long as something waits, and plays again only when the octopus turns to it anew
const ONCE = new Set<keyof typeof ART>(['happy', 'happySmall'])
const RUN_MARK = Math.random().toString(36).slice(2, 8)
let momentCount = 0
const momentOf = (key: string, art: keyof typeof ART) => {
  const was = moments.get(key)
  const at = Date.now()
  if (was?.art === art && (at - was.at < MOMENT_GAP || !ONCE.has(art))) return (was.at = at), was.mark
  momentCount += 1
  const mark = `${RUN_MARK}-${momentCount}`
  // Each opening of About is a place of its own; the openings before it are gone
  if (key.startsWith('about-mark-')) for (const one of moments.keys()) if (one.startsWith('about-mark-')) moments.delete(one)
  moments.set(key, { art, mark, at })
  return mark
}
const octopus = (ui: Ui, key: string, art: keyof typeof ART, size: number, alt: string) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number; isInteractive?: boolean }) => JSX.Element }
  const { Box } = ui
  const source = ART[art]
  if (!source || !table.Svg) return null
  const mark = momentOf(key, art)
  return (
    <Box key={key} flexShrink={0}>
      <table.Svg key={`${key}-${art}-${mark}`} source={source.replace('<svg', `<svg data-moment="${mark}"`)} alt={alt} width={size} height={size} isInteractive={art !== 'mark'} />
    </Box>
  )
}
