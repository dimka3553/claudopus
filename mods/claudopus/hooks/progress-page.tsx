// The Progress tab's drawing: one month at a time, a square for each result by area and day under the north star, each area's row under its goal, and an area's own page with its next
// steps and timeline. Pure: register.tsx's progress-tab part reads the progress folder and the pictures, and hands them here
import type { ElementTable } from 'claude-code'

type Ui = ElementTable
type JSXEl = ReturnType<Ui['Box']>
// The parts this page draws with, by the props it gives them: checked against the engine's whole table of every part's props, the
// type check of the mod ran past its memory
type Part = (props: Record<string, unknown>) => JSXEl
type Parts = { Box: Part; Text: Part; Button: Part }
// The shapes of the progress folder (progress.tsx in the parts keeps the same)
export type PageNext = { id: string; text: string; state: 'open' | 'done' | 'aside'; at: string }
export type PageArea = { id: string; name: string; goal: string; aim: string; next: PageNext[] }
export type PageEntry = { task: string; title: string; at: string; kind: 'milestone' | 'task' | 'aside'; outcome: string; report: string; pictures: string[]; live: string; reason: string }
export type PagePicture = { star: { text: string }; goals: { id: string; name: string }[] }
const LIVE = '#8A63F0'
const FILL = '#80808024'
const cutTo = (text: string, most: number) => (text.length <= most ? text : `${text.slice(0, most - 1).trimEnd()}…`)
export const GOAL_COLORS = ['#3FB8AF', '#5B8DEF', '#D9775B', '#C86FB0', '#B59A6E', '#7FA650', '#E0A43A', '#5FA8D3']
export const OTHER_GOAL = { id: '', name: 'Other', color: '#808080' }
export const P_GREEN = '#5CB85C'
export const P_ASIDE = '#a8a397'
export const P_DIM = '#9b9a93'
export const P_RAIL = '#80808050'
export const P_FONT = 'font-family="system-ui,-apple-system,sans-serif"'
export const DAY_MS = 86_400_000
export const xmlSafe = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const svgDoc = (w: number, h: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
export const n1 = (n: number) => String(Math.round(n * 10) / 10)
export const atOf = (at: string) => {
  const ms = Date.parse(at)
  return Number.isFinite(ms) ? ms : 0
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// The day as the panel writes it, "26 Nov", with the year when it is not this one
export const dayOf = (ms: number, now: number) => {
  if (!ms) return ''
  const d = new Date(ms)
  return `${d.getDate()} ${MONTHS[d.getMonth()] ?? ''}${d.getFullYear() === new Date(now).getFullYear() ? '' : ` ${d.getFullYear()}`}`
}

// ---- What the page reads ----
export type ProgressGoal = { id: string; name: string; color: string }
export type AreaFigures = { done: number; aside: number; next: number; month: number; days: number[]; live: boolean }
// How many days back the chart can reach: half a year
export const CHART_DAYS = 182
export type ProgressData = { star: string; goals: ProgressGoal[]; areas: PageArea[]; entries: Map<string, PageEntry[]>; working: Set<string>; sorting?: { left: number; total: number }; since?: number }
// While past results are still being sorted into areas, how far it has got; nothing once only a few new events wait
export const sortingSaid = (sorting: { left: number; total: number } | undefined) => {
  if (!sorting || sorting.left < 3) return ''
  const { left, total } = sorting
  return total >= left ? `Sorting your past results into areas: ${total - left} of ${total} done. This page fills in as it goes.` : `Sorting your results into areas: ${left} left. This page fills in as it goes.`
}
// What is done, set aside and next in an area: a milestone or a next step ticked is done; a set-aside result or step is aside; an
// open step is next. With the tasks of the last 30 days, the tasks of each of the last CHART_DAYS days (oldest first, today last), and
// whether one runs now
export const figuresOf = (area: PageArea, entries: PageEntry[], working: Set<string>, now: number): AreaFigures => {
  const days = Array.from({ length: CHART_DAYS }, () => 0)
  const today = new Date(now)
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  let month = 0
  for (const one of entries) {
    const age = now - atOf(one.at)
    if (!atOf(one.at) || age < 0) continue
    if (age < 30 * DAY_MS) month += 1
    const back = atOf(one.at) >= midnight ? 0 : Math.ceil((midnight - atOf(one.at)) / DAY_MS)
    if (back < CHART_DAYS) days[CHART_DAYS - 1 - back] = (days[CHART_DAYS - 1 - back] ?? 0) + 1
  }
  return {
    done: entries.filter(one => one.kind === 'milestone').length + area.next.filter(n => n.state === 'done').length,
    aside: entries.filter(one => one.kind === 'aside').length + area.next.filter(n => n.state === 'aside').length,
    next: area.next.filter(n => n.state === 'open').length,
    month,
    days,
    live: entries.some(one => one.task && working.has(one.task)),
  }
}
// The goals with a colour each, in the picture's order
export const goalsOf = (picture: PagePicture): ProgressGoal[] => picture.goals.map((goal, i) => ({ id: goal.id, name: goal.name, color: GOAL_COLORS[i % GOAL_COLORS.length] ?? OTHER_GOAL.color }))
export const goalOf = (data: ProgressData, area: PageArea) => data.goals.find(goal => goal.id && goal.id === area.goal) ?? OTHER_GOAL
// The areas under each goal, goals in order and Other last, each goal only where it has an area
export const grouped = (data: ProgressData) => {
  const groups = [...data.goals, OTHER_GOAL].map(goal => ({ goal, areas: data.areas.filter(area => goalOf(data, area) === goal) }))
  return groups.filter(group => group.areas.length)
}

// ---- The chart: one month, a small square for each result, a row for each goal and a column for each day ----
export type ChartArea = { id: string; name: string; color: string; goal: string } & AreaFigures
export const countsSaid = (f: { done: number; aside: number; next: number }) => [`${f.done} done`, f.aside ? `${f.aside} aside` : '', `${f.next} next`].filter(Boolean).join(', ')
// Words wrapped to lines of at most `most` letters
export const wrapped = (text: string, most: number) => {
  const lines: string[] = []
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines.at(-1)
    if (last !== undefined && `${last} ${word}`.length <= most) lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines
}
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// A month `back` months before this one, as the page names it: "November 2026"
export const monthSaid = (now: number, back: number) => {
  const d = new Date(new Date(now).getFullYear(), new Date(now).getMonth() - back, 1)
  return `${MONTHS_FULL[d.getMonth()] ?? ''} ${d.getFullYear()}`
}
// How many months the chart can show: this one, and each before it back to the first with a result (at most CHART_DAYS back)
export const chartMonths = (areas: { days: number[] }[], now: number) => {
  const first = Math.min(CHART_DAYS - 1, ...areas.map(area => area.days.findIndex(n => n > 0)).filter(i => i >= 0))
  const today = new Date(now)
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (CHART_DAYS - 1 - first))
  return (today.getFullYear() - day.getFullYear()) * 12 + today.getMonth() - day.getMonth() + 1
}
// The month `back` months before this one: its first day, and for each of its days its place in an area's days (today the last of
// them), out of their reach for a day to come or too long ago
export const monthOf = (now: number, back: number) => {
  const today = new Date(now)
  const first = new Date(today.getFullYear(), today.getMonth() - back, 1)
  const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const daysAgo = (day: number) => Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(first.getFullYear(), first.getMonth(), day)) / DAY_MS)
  return { first, next: new Date(first.getFullYear(), first.getMonth() + 1, 1), cells: Array.from({ length: daysIn }, (_, d) => CHART_DAYS - 1 - daysAgo(d + 1)) }
}
// An area's results on each day of that month, and all of them
export const monthCounts = (days: number[], now: number, back: number) => {
  const counts = monthOf(now, back).cells.map(i => (i >= 0 && i < CHART_DAYS ? (days[i] ?? 0) : 0))
  return { counts, total: counts.reduce((s, n) => s + n, 0) }
}
// The most areas a month's chart gives a row of their own; the rest share one
export const CHART_ROWS_MOST = 7
// The chart as one Svg, `width` wide: the north star on top, then one month, `back` months before this one. Its rows are what was
// worked on that month, so each month has its own: the areas with a result in it, the one with the most first, each a row of the
// month's days with a day's results as squares stacked from the row's line, in its goal's colour, and its results of the month at
// the right. A square is one result, or more in a busy month; `since`, when Claudopus came in, is a line across the rows in its month
export const chartOf = (star: string, areas: ChartArea[], width: number, now: number, since = 0, back = 0) => {
  const isWide = width >= 560
  const quoted = star.trim() ? `“${star.trim().replace(/^["“]+|["”]+$/g, '')}”` : ''
  const starSize = isWide ? 14 : 12.5
  // The north star on one line, or two of about the same length
  const fits = Math.floor((width - 16) / (starSize * 0.53))
  const words = quoted.split(' ')
  const splits = words.slice(1).map((_, i) => [words.slice(0, i + 1).join(' '), words.slice(i + 1).join(' ')])
  const even = splits.reduce((best, two) => (Math.max(...two.map(l => l.length)) < Math.max(...best.map(l => l.length)) ? two : best), [quoted, ''])
  const starLines = !quoted ? [] : quoted.length <= fits ? [quoted] : Math.max(...even.map(l => l.length)) <= fits ? even : wrapped(quoted, fits).slice(0, 2)
  const today = new Date(now)
  const { first, cells } = monthOf(now, back)
  const todayCell = back === 0 ? today.getDate() - 1 : -1
  const busy = areas
    .map(area => ({ name: area.name, color: area.color, ...monthCounts(area.days, now, back), live: back === 0 && area.live }))
    .filter(row => row.total > 0)
    .sort((a, b) => b.total - a.total)
  const rest = busy.length > CHART_ROWS_MOST + 1 ? busy.slice(CHART_ROWS_MOST) : []
  const more = { name: `${rest.length} more areas`, color: OTHER_GOAL.color, counts: cells.map((_, i) => rest.reduce((s, row) => s + (row.counts[i] ?? 0), 0)), total: rest.reduce((s, row) => s + row.total, 0), live: false }
  const rowsOf = rest.length ? [...busy.slice(0, CHART_ROWS_MOST), more] : busy
  const left = isWide ? 160 : 8
  const right = isWide ? 56 : 44
  const colW = (width - left - right) / cells.length
  const sq = isWide ? 4 : 3
  const gap = isWide ? 1.2 : 0.9
  const step = sq + gap
  const per = Math.max(1, Math.floor((colW - 2) / step))
  // A square stands for more results once the busiest day would stand taller than this many rows of them
  const tallest = Math.max(1, ...rowsOf.flatMap(row => row.counts))
  const unit = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find(u => Math.ceil(tallest / u) <= per * 24) ?? 1000
  const sinceDay = new Date(since)
  const sinceCell = since > 0 && sinceDay.getFullYear() === first.getFullYear() && sinceDay.getMonth() === first.getMonth() ? sinceDay.getDate() - 1 : -1
  const sinceX = sinceCell >= 0 ? left + colW * sinceCell : 0
  const parts: string[] = []
  starLines.forEach((line, i) => parts.push(`<text x="${n1(width / 2)}" y="${n1(starSize * 1.05 + i * starSize * 1.3)}" text-anchor="middle" ${P_FONT} font-size="${starSize}" font-style="italic" fill="currentColor">${xmlSafe(line)}</text>`))
  const top = (starLines.length ? starLines.length * starSize * 1.3 + 14 : 4) + (sinceX ? 14 : 0)
  const nameSize = isWide ? 12.5 : 11
  const nameMost = Math.max(6, Math.floor((left - 14) / (nameSize * 0.55)))
  const label = monthSaid(now, back)
  const said: string[] = []
  let y = top
  for (const row of rowsOf) {
    const body = Math.max(isWide ? 22 : 10, Math.max(1, ...row.counts.map(n => Math.ceil(Math.ceil(n / unit) / per))) * step)
    const base = y + (isWide ? 0 : 15) + body
    const mid = base - body / 2 + 4.5
    const name = xmlSafe(isWide ? cutTo(row.name, nameMost) : row.name)
    const look = row.live ? `fill="${LIVE}" font-weight="600"` : row === more ? `fill="${P_DIM}"` : 'fill="currentColor"'
    parts.push(isWide ? `<text x="${left - 12}" y="${n1(mid)}" text-anchor="end" ${P_FONT} font-size="${nameSize}" ${look}>${name}</text>` : `<text x="${left}" y="${n1(y + 11)}" ${P_FONT} font-size="${nameSize}" ${look}>${name}</text>`)
    parts.push(`<path d="M${left} ${n1(base + 1)}H${n1(width - right)}" stroke="${P_RAIL}" stroke-opacity="0.7"/>`)
    const squares: string[] = []
    row.counts.forEach((count, i) => {
      const x = left + colW * i + (colW - (per * step - gap)) / 2
      for (let k = 0; k < Math.ceil(count / unit); k++) squares.push(`M${n1(x + (k % per) * step)} ${n1(base - (Math.floor(k / per) + 1) * step + gap)}h${sq}v${sq}h-${sq}z`)
    })
    if (squares.length) parts.push(`<path d="${squares.join('')}" fill="${row.color}"/>`)
    parts.push(`<text x="${n1(width - right + 10)}" y="${n1(mid)}" ${P_FONT} font-size="${nameSize}" font-weight="600" fill="${P_GREEN}">${row.total}</text>`)
    said.push(`${row.name}: ${row.total === 1 ? '1 result' : `${row.total} results`}${row.live ? ', working now' : ''}.`)
    y = base + (isWide ? 14 : 12)
  }
  // A month nothing is kept from says so, on a row's line
  if (!rowsOf.length) {
    parts.push(`<text x="${n1((left + width - right) / 2)}" y="${n1(top + 16)}" text-anchor="middle" ${P_FONT} font-size="${nameSize}" fill="${P_DIM}">Nothing is kept from ${label}</text>`)
    parts.push(`<path d="M${left} ${n1(top + 27)}H${n1(width - right)}" stroke="${P_RAIL}" stroke-opacity="0.7"/>`)
    y = top + 40
  }
  // Where Claudopus came in: a line across the rows, named above them
  if (sinceX) {
    parts.push(`<path d="M${n1(sinceX)} ${n1(top - 4)}V${n1(y - 8)}" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="3 3"/>`)
    parts.push(`<text x="${n1(Math.min(width - right - 30, Math.max(left + 30, sinceX)))}" y="${n1(top - 7)}" text-anchor="middle" ${P_FONT} font-size="10.5" fill="${P_DIM}">Claudopus</text>`)
  }
  // Under the rows: the month's first day and each seventh after it, clear of today, and today in this month
  const keyH = unit > 1 ? 14 : 0
  const H = Math.ceil(y + 16 + keyH)
  const cellX = (i: number) => left + colW * i + colW / 2
  for (let i = 0; i < cells.length; i += 7)
    if (todayCell < 0 || Math.abs(cellX(i) - cellX(todayCell)) > 40) parts.push(`<text x="${n1(Math.max(cellX(i), left + 12))}" y="${H - 5 - keyH}" text-anchor="middle" ${P_FONT} font-size="10.5" fill="${P_DIM}">${i ? i + 1 : `1 ${MONTHS[first.getMonth()] ?? ''}`}</text>`)
  if (todayCell >= 0) parts.push(`<text x="${n1(Math.min(cellX(todayCell), width - right))}" y="${H - 5 - keyH}" text-anchor="middle" ${P_FONT} font-size="10.5" fill="currentColor">today</text>`)
  if (unit > 1) parts.push(`<rect x="${left}" y="${H - 11}" width="${sq + 1}" height="${sq + 1}" fill="${P_DIM}"/><text x="${left + sq + 6}" y="${H - 5}" ${P_FONT} font-size="10.5" fill="${P_DIM}">${unit} results</text>`)
  const alt = cutTo([quoted, rowsOf.length ? `Results a day in ${label}, the area with the most first.` : `Nothing is kept from ${label}.`, unit > 1 ? `Each square is ${unit} results.` : '', sinceX ? `Claudopus came in on ${dayOf(since, now)}.` : '', ...said, ...areas.map(area => `${area.name}: ${countsSaid(area)}${area.live ? ', working now' : ''}.`)].filter(Boolean).join(' '), 900)
  return { source: svgDoc(width, H, parts.join('')), width, height: H, alt, label }
}

// ---- Small drawings of the rows ----
export const barOf = (key: string, f: { done: number; aside: number; next: number }, w: number) => {
  const all = f.done + f.aside + f.next || 1
  const [g, a] = [Math.round((w * f.done) / all), Math.round((w * f.aside) / all)]
  const id = `pb-${key.replace(/[^A-Za-z0-9-]/g, '')}`
  return svgDoc(
    w,
    30,
    `<defs><pattern id="${id}-h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="4" fill="${P_ASIDE}"/></pattern><clipPath id="${id}-k"><rect x="0" y="19" width="${w}" height="6" rx="3"/></clipPath></defs>` +
      `<text x="0" y="11" ${P_FONT} font-size="11.5" fill="${P_GREEN}">${f.done} done</text>` +
      (f.aside ? `<text x="${w / 2}" y="11" text-anchor="middle" ${P_FONT} font-size="11.5" fill="${P_ASIDE}">${f.aside} aside</text>` : '') +
      `<text x="${w}" y="11" text-anchor="end" ${P_FONT} font-size="11.5" fill="${P_DIM}">${f.next} next</text>` +
      `<g clip-path="url(#${id}-k)"><rect x="0" y="19" width="${w}" height="6" fill="#80808040"/><rect x="0" y="19" width="${g}" height="6" fill="${P_GREEN}"/>` +
      (f.aside ? `<rect x="${g + 1.5}" y="19" width="${Math.max(0, a - 1.5)}" height="6" fill="url(#${id}-h)"/>` : '') +
      `</g>`,
  )
}
export const dotOf = (color: string, s = 8) => svgDoc(s, 20, `<circle cx="${s / 2}" cy="10" r="${s / 2}" fill="${color}"/>`)
export const chevronOf = (isOpen: boolean) =>
  svgDoc(10, 20, `<path d="${isOpen ? 'M1.5 7.5l3.5 3.5 3.5-3.5' : 'M3.5 6l3.5 4-3.5 4'}" fill="none" stroke="${P_DIM}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`)
export const noPictureOf = (w: number, h: number) =>
  svgDoc(w, h, `<rect width="${w}" height="${h}" rx="5" fill="#80808030"/><circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 5}" fill="none" stroke="${P_DIM}" stroke-width="1.6"/><path d="M${w / 2 - 3.5} ${h / 2}l2.5 2.5 5-5" fill="none" stroke="${P_DIM}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`)
// A picture's small copy cut to w by h with round corners, a count of more in its corner, faded for what was set aside
export const pictureOf = (key: string, href: string, w: number, h: number, more = 0, faded = false) => {
  const id = `pp-${key.replace(/[^A-Za-z0-9-]/g, '')}`
  return svgDoc(
    w,
    h,
    `<defs><clipPath id="${id}"><rect width="${w}" height="${h}" rx="5"/></clipPath></defs><g clip-path="url(#${id})" opacity="${faded ? 0.5 : 1}"><rect width="${w}" height="${h}" fill="#1d1d1b"/><image href="${href}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>` +
      (more ? `<rect x="${w - 34}" y="${h - 24}" width="28" height="18" rx="9" fill="#000000a0"/><text x="${w - 20}" y="${h - 11}" text-anchor="middle" ${P_FONT} font-size="11" fill="#fff">+${more}</text>` : ''),
  )
}
export const TOP_RAIL = `<line x1="7" y1="0" x2="7" y2="6" stroke="${P_RAIL}" stroke-width="1.6"/>`
export const ringOf = (kind: 'done' | 'fold' | 'live' | 'aside' | 'none', isFirst: boolean) =>
  svgDoc(
    14,
    22,
    (isFirst ? '' : TOP_RAIL) +
      (kind === 'done' ? `<circle cx="7" cy="11" r="6" fill="${P_GREEN}"/><path d="M4.3 11.2l1.8 1.8 3.6-3.8" stroke="#1f1e1d" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      : kind === 'live' ? `<circle cx="7" cy="11" r="6" fill="${LIVE}" fill-opacity="0.35"/><circle cx="7" cy="11" r="3.2" fill="${LIVE}"/>`
      : kind === 'aside' ? `<circle cx="7" cy="11" r="5.6" fill="none" stroke="${P_ASIDE}" stroke-width="1.5"/><path d="M5.6 8.8v4.4M8.4 8.8v4.4" stroke="${P_ASIDE}" stroke-width="1.4" stroke-linecap="round"/>`
      : kind === 'fold' ? `<circle cx="7" cy="11" r="3.5" fill="none" stroke="${P_DIM}" stroke-width="1.4"/>`
      : ''),
  )
export const boxOf = (state: 'open' | 'done' | 'aside') =>
  svgDoc(
    16,
    22,
    state === 'done' ? `<rect x="1" y="4" width="14" height="14" rx="3.5" fill="${P_GREEN}"/><path d="M4.5 11.2l2.3 2.3 4.6-4.8" stroke="#1f1e1d" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : state === 'aside' ? `<rect x="1" y="4" width="14" height="14" rx="3.5" fill="none" stroke="#80808080" stroke-width="1.5" stroke-dasharray="2.5 2"/>`
    : `<rect x="1" y="4" width="14" height="14" rx="3.5" fill="none" stroke="${P_DIM}" stroke-width="1.5"/>`,
  )

// ---- What the person has opened on the page ----
// The most pictures one drawing of an area holds at first: each is a small copy of about 40,000 characters, and a drawing holds 230,000
export const PROGRESS_PICTURES_MOST = 4
// The most rows of the overview that show a picture: each is a small copy of about 4,000 characters
export const PROGRESS_THUMBS_MOST = 30
export const progressView = { area: '', month: 0, thumbs: PROGRESS_THUMBS_MOST, isOtherOpen: false, days: new Set<string>(), asides: new Set<string>(), daysShown: 5, drawer: '', pictures: PROGRESS_PICTURES_MOST, drawerMost: 60 }
// Taken out while a drawing would not fit (drawingFits): of every area's rows, their pictures, six at a time; of an area's page,
// pictures, then rows of a drawer, then days, one at a time
export function fewerProgress() {
  // (the overview holds only its rows' pictures to take out)
  if (!progressView.area) return progressView.thumbs > 0 ? ((progressView.thumbs = Math.max(0, progressView.thumbs - 6)), true) : false
  if (progressView.pictures > 0) return ((progressView.pictures -= 1), true)
  if (progressView.drawerMost > 12) return ((progressView.drawerMost = Math.max(12, progressView.drawerMost - 24)), true)
  if (progressView.daysShown > 1) return ((progressView.daysShown -= 1), true)
  return false
}

// A picture of an entry: the report it came with and the file's place in it, where it is a picture the panel can draw
export type ProgressThumb = { source: string; width: number; height: number } | null
export type ProgressPictureRef = { key: string }
export const hrefOf = (thumb: ProgressThumb) => (thumb ? (/href="([^"]+)"/.exec(thumb.source)?.[1] ?? '') : '')

// The acts a press on the page does
export type ProgressActs = {
  open: (area: string) => void
  back: () => void
  other: () => void
  month: (by: number) => void
  day: (key: string) => void
  aside: (key: string) => void
  tick: (area: string, next: string, state: 'open' | 'done') => void
  pickUp: (entry: PageEntry) => void
  result: (report: string) => void
  more: () => void
  drawer: (name: string) => void
  drawerMore: () => void
}
export type ProgressLook = { width: number; now: number; gen: string; pictures: (entry: PageEntry) => ProgressPictureRef[]; hasResult: (entry: PageEntry) => boolean; small: (ref: ProgressPictureRef) => ProgressThumb; large: (ref: ProgressPictureRef) => ProgressThumb; acts: ProgressActs }

// ---- The overview: the tasks chart, then each goal's areas as rows ----
export const progressOverview = (ui: Ui, data: ProgressData, look: ProgressLook) => {
  const { Box, Text, Button } = ui as unknown as Parts
  const Svg = (ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSXEl }).Svg
  const isWide = look.width >= 560
  const figures = new Map(data.areas.map(area => [area.id, figuresOf(area, data.entries.get(area.id) ?? [], data.working, look.now)]))
  if (!data.areas.length)
    return (
      <Box key="progress-empty" flexDirection="column" gap={1} paddingX={1}>
        <Text bold>Nothing is sorted yet</Text>
        <Text dimColor wrap="wrap">{sortingSaid(data.sorting) || 'Claudopus sorts each task into its area as it finishes, and shows here what each area has done and what comes next.'}</Text>
      </Box>
    )
  const chartAreas: ChartArea[] = data.areas.map(area => ({ id: area.id, name: area.name, color: goalOf(data, area).color, goal: goalOf(data, area).id, ...(figures.get(area.id) as AreaFigures) }))
  const months = chartMonths(chartAreas, look.now)
  const back = Math.min(Math.max(0, progressView.month), months - 1)
  const chart = chartOf(data.star, chartAreas, Math.floor(look.width), look.now, data.since ?? 0, back)
  let thumbs = 0
  const groups = grouped(data)
  const tw = isWide ? 64 : 52
  const th = isWide ? 48 : 39
  // An earlier month has its own list under its chart: what was worked on in it, the most first, each with its newest result of
  // that month and how many it had
  const month = monthOf(look.now, back)
  const inMonth = (one: PageEntry) => atOf(one.at) >= month.first.getTime() && atOf(one.at) < month.next.getTime()
  const totalOf = (area: PageArea) => monthCounts((figures.get(area.id) as AreaFigures).days, look.now, back).total
  const row = (area: PageArea) => {
    const f = figures.get(area.id) as AreaFigures
    const entries = back ? (data.entries.get(area.id) ?? []).filter(inMonth) : (data.entries.get(area.id) ?? [])
    const live = f.live ? entries.find(one => one.task && data.working.has(one.task)) : undefined
    const newest = live ?? entries[0]
    const best = entries.map(one => look.pictures(one)[0]).find(Boolean)
    const thumb = best && (thumbs += 1) <= progressView.thumbs ? look.small(best) : null
    const barWidth = isWide ? 150 : Math.max(120, Math.floor(look.width - 16 - tw - 12 - 10 - 12 - 8))
    return (
      <Box key={`progress-row-${area.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          <Box width={0.375} flexShrink={0} backgroundColor={f.live ? LIVE : 'transparent'} />
          <Box flexDirection="row" alignItems="center" gap={isWide ? 2 : 1.5} paddingX={isWide ? 1.5 : 1} paddingY={1} flexGrow={1} minWidth={0}>
            {Svg ? <Box flexShrink={0}>{thumb && hrefOf(thumb) ? <Svg source={pictureOf(`r-${area.id}`, hrefOf(thumb), tw, th)} alt={area.name} width={tw} height={th} /> : <Svg source={noPictureOf(tw, th)} alt="No picture" width={tw} height={th} />}</Box> : null}
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
              <Box flexDirection="row" minWidth={0}>
                <Button key={`progress-area-${area.id}-${look.gen}`} plain hover={{ underline: true }} onPress={() => look.acts.open(area.id)}>
                  <Text bold wrap="truncate-end">{area.name}</Text>
                </Button>
              </Box>
              {newest ? (
                <Box flexDirection="row" gap={1} minWidth={0}>
                  <Box flexShrink={0}>{live ? <Text color={LIVE}>Working</Text> : <Text dimColor>{dayOf(atOf(newest.at), look.now)}</Text>}</Box>
                  <Box flexShrink={1} minWidth={0}>
                    <Text wrap="truncate-end">{newest.title}</Text>
                  </Box>
                </Box>
              ) : null}
              {!back && !isWide && Svg ? <Box paddingTop={0.5}><Svg source={barOf(`n-${area.id}`, f, barWidth)} alt={countsSaid(f)} width={barWidth} height={30} /></Box> : null}
              {!back && !Svg ? <Text dimColor>{countsSaid(f)}</Text> : null}
            </Box>
            {back ? <Box flexShrink={0} paddingLeft={1}><Text color={P_GREEN}>{totalOf(area) === 1 ? '1 result' : `${totalOf(area)} results`}</Text></Box> : null}
            {!back && isWide && Svg ? <Box flexShrink={0} paddingLeft={1}><Svg source={barOf(`w-${area.id}`, f, 150)} alt={countsSaid(f)} width={150} height={30} /></Box> : null}
            <Box flexShrink={0}>
              <Button key={`progress-go-${area.id}-${look.gen}`} label="›" plain dimColor onPress={() => look.acts.open(area.id)} />
            </Box>
          </Box>
      </Box>
    )
  }
  const otherRow = (areas: PageArea[]) => (
    <Box key="progress-other" flexDirection="column" gap={0.5} flexShrink={0}>
        <Box flexDirection="row" backgroundColor={FILL} flexShrink={0} alignItems="center" gap={1.5} paddingX={isWide ? 1.5 : 1} paddingY={1}>
          {Svg ? <Box flexShrink={0}><Svg source={dotOf(OTHER_GOAL.color)} alt="" width={8} height={20} /></Box> : null}
          <Box flexShrink={0}>
            <Button key={`progress-other-${progressView.isOtherOpen ? 'open' : 'shut'}-${look.gen}`} plain hover={{ underline: true }} onPress={look.acts.other}>
              <Text bold>Other</Text>
            </Button>
          </Box>
          <Box flexShrink={1} minWidth={0} flexGrow={1}>
            <Text dimColor wrap="truncate-end">{progressView.isOtherOpen ? '' : areas.map(area => area.name).join(', ')}</Text>
          </Box>
          <Box flexShrink={0}><Text dimColor>{areas.length === 1 ? '1 area' : `${areas.length} areas`}</Text></Box>
          <Box flexShrink={0}>
            <Button key={`progress-other-go-${progressView.isOtherOpen ? 'open' : 'shut'}-${look.gen}`} label={progressView.isOtherOpen ? '⌄' : '›'} plain dimColor onPress={look.acts.other} />
          </Box>
        </Box>
      {progressView.isOtherOpen ? areas.map(row) : null}
    </Box>
  )
  return (
    <Box key="progress-overview" flexDirection="column" gap={2.5}>
      <Box key="progress-top" flexDirection="column" gap={1} flexShrink={0}>
        {sortingSaid(data.sorting) ? <Text key="progress-sorting" dimColor wrap="wrap">{sortingSaid(data.sorting)}</Text> : null}
        {months > 1 ? (
          <Box key="progress-months" flexDirection="row" gap={2} alignItems="center" justifyContent="center" flexShrink={0}>
            {back < months - 1 ? <Button key={`progress-month-earlier-${look.gen}`} label={`‹ ${monthSaid(look.now, back + 1).split(' ')[0]}`} plain dimColor onPress={() => look.acts.month(1)} /> : null}
            <Text bold>{chart.label}</Text>
            {back > 0 ? <Button key={`progress-month-later-${look.gen}`} label={`${monthSaid(look.now, back - 1).split(' ')[0]} ›`} plain dimColor onPress={() => look.acts.month(-1)} /> : null}
          </Box>
        ) : null}
        {Svg ? <Svg key="progress-chart" source={chart.source} alt={chart.alt} width={chart.width} height={chart.height} /> : data.star ? <Text wrap="wrap">{`“${data.star}”`}</Text> : null}
      </Box>
      {back ? (
        <Box key={`progress-month-areas-${back}`} flexDirection="column" gap={0.5} flexShrink={0}>
          {data.areas.filter(area => totalOf(area) > 0).sort((a, b) => totalOf(b) - totalOf(a)).map(row)}
        </Box>
      ) : groups.map(({ goal, areas }) =>
        goal === OTHER_GOAL && groups.length > 1 ? (
          otherRow(areas)
        ) : (
          <Box key={`progress-goal-${goal.id || 'other'}`} flexDirection="column" gap={0.5} flexShrink={0}>
            <Box flexDirection="row" gap={0.75} alignItems="center" paddingLeft={0.5}>
              {Svg ? <Svg source={dotOf(goal.color)} alt="" width={8} height={20} /> : null}
              <Text bold dimColor>{goal.name}</Text>
            </Box>
            {areas.map(row)}
          </Box>
        ),
      )}
    </Box>
  )
}

// ---- An area's own page ----
export type TimelineDay = { day: string; at: number; asides: PageEntry[]; milestones: PageEntry[]; live: PageEntry[]; tasks: PageEntry[] }
export const daysOf = (entries: PageEntry[], working: Set<string>, now: number) => {
  const days: TimelineDay[] = []
  for (const one of entries) {
    const at = atOf(one.at)
    const day = dayOf(at, now) || 'Undated'
    let into = days.at(-1)
    if (!into || into.day !== day) days.push((into = { day, at, asides: [], milestones: [], live: [], tasks: [] }))
    if (one.task && working.has(one.task)) into.live.push(one)
    else if (one.kind === 'aside') into.asides.push(one)
    else if (one.kind === 'milestone') into.milestones.push(one)
    else into.tasks.push(one)
  }
  return days
}
export const progressArea = (ui: Ui, data: ProgressData, area: PageArea, look: ProgressLook) => {
  const { Box, Text, Button } = ui as unknown as Parts
  const Svg = (ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSXEl }).Svg
  const isWide = look.width >= 560
  const entries = data.entries.get(area.id) ?? []
  const f = figuresOf(area, entries, data.working, look.now)
  const goal = goalOf(data, area)
  const days = daysOf(entries, data.working, look.now)
  const shownDays = days.slice(0, progressView.daysShown)
  const earlier = days.slice(progressView.daysShown).reduce((sum, d) => sum + d.asides.length + d.milestones.length + d.live.length + d.tasks.length, 0)
  const PW = Math.floor(isWide ? look.width - 9 * 8 - 16 - 16 : look.width - 16 - 16)
  const PH = isWide ? 150 : 104
  let picturesLeft = progressView.pictures
  const strip = (key: string, entry: PageEntry, faded = false) => {
    const refs = look.pictures(entry)
    if (!refs.length || !Svg) return null
    const first = refs[0] as ProgressPictureRef
    const thumb = picturesLeft > 0 ? look.large(first) : null
    if (!thumb || !hrefOf(thumb)) return <Text dimColor>{refs.length === 1 ? '1 picture' : `${refs.length} pictures`}</Text>
    picturesLeft -= 1
    const aspect = thumb.width && thumb.height ? thumb.width / thumb.height : 1.6
    const w = Math.min(PW, Math.round(aspect * PH))
    const tall = Math.round(w / aspect)
    return <Svg source={pictureOf(key, hrefOf(thumb), w, tall, refs.length - 1, faded)} alt={entry.title} width={w} height={tall} />
  }
  const row = (key: string, date: string | null, mark: string, isLast: boolean, ...content: (JSXEl | null)[]) => (
    <Box key={key} flexDirection="row" flexShrink={0}>
      {isWide ? <Box flexDirection="column" justifyContent="flex-start" width={9} flexShrink={0}>{date ? <Text dimColor>{date}</Text> : null}</Box> : null}
      <Box flexDirection="column" width={2} flexShrink={0} alignItems="center">
        {Svg ? <Box flexShrink={0}><Svg source={mark} alt="" width={14} height={22} /></Box> : null}
        {isLast ? null : <Box width={0.2} flexGrow={1} backgroundColor={P_RAIL} />}
      </Box>
      <Box flexDirection="column" gap={0.75} flexGrow={1} flexShrink={1} minWidth={0} paddingLeft={1} paddingBottom={1.5}>
        {content}
      </Box>
    </Box>
  )
  const titleOf = (key: string, entry: PageEntry, isBold: boolean, dim = false) =>
    look.hasResult(entry) ? (
      <Button key={`progress-result-${key}-${look.gen}`} plain dimColor={dim} hover={{ underline: true }} onPress={() => look.acts.result(entry.report)}>
        <Text bold={isBold} dimColor={dim} wrap="wrap">{entry.title}</Text>
      </Button>
    ) : (
      <Text bold={isBold} dimColor={dim} wrap="wrap">{entry.title}</Text>
    )
  const asideSteps = area.next.filter(n => n.state === 'aside')
  const newestAside = entries.find(one => one.kind === 'aside')
  let isFirst = true
  const timeline: JSXEl[] = []
  for (const d of shownDays) {
    let dateShown = false
    const date = () => (dateShown ? null : ((dateShown = true), d.day))
    const first = () => {
      const was = isFirst
      isFirst = false
      return was
    }
    if (!isWide) timeline.push(row(`progress-day-${d.day}`, null, svgDoc(14, 22, first() ? '' : TOP_RAIL), false, <Text dimColor>{d.day}</Text>))
    d.live.forEach((one, i) =>
      timeline.push(row(`progress-live-${d.day}-${i}`, date(), ringOf('live', first()), false, <Box flexDirection="row" gap={1.25} alignItems="flex-start"><Box flexShrink={1} minWidth={0}><Text bold wrap="wrap">{one.title}</Text></Box><Box flexShrink={0}><Text color={LIVE}>Working</Text></Box></Box>)),
    )
    d.asides.forEach((one, i) => {
      const key = `${d.day}-${i}`
      const isOpen = progressView.asides.has(key)
      const steps = one === newestAside ? asideSteps : []
      timeline.push(
        row(
          `progress-aside-${key}`,
          date(),
          ringOf('aside', first()),
          false,
          <Box flexDirection="row" gap={1.25} alignItems="flex-start">
            <Box flexShrink={1} minWidth={0}>{titleOf(`aside-${key}`, one, false, true)}</Box>
            <Box flexShrink={0}><Text color={P_ASIDE}>set aside</Text></Box>
          </Box>,
          one.reason ? <Text dimColor wrap="wrap">{one.reason}</Text> : null,
          strip(`a-${area.id}-${key}`, one, true),
          <Box flexDirection="row" gap={2} alignItems="center">
            <Button key={`progress-pickup-${key}-${look.gen}`} label="Pick up again" plain onPress={() => look.acts.pickUp(one)} />
            {steps.length ? <Button key={`progress-asidesteps-${key}-${isOpen ? 'open' : 'shut'}-${look.gen}`} label={`${isOpen ? '−' : '+'} ${steps.length} next ${steps.length === 1 ? 'step' : 'steps'} set aside`} plain dimColor onPress={() => look.acts.aside(key)} /> : null}
          </Box>,
          isOpen && steps.length ? (
            <Box flexDirection="column" gap={0.5} paddingLeft={0.5}>
              {steps.map(step => (
                <Box key={`progress-aside-step-${step.id}`} flexDirection="row" gap={1.25}>
                  {Svg ? <Box flexShrink={0}><Svg source={boxOf('aside')} alt="Set aside" width={16} height={22} /></Box> : null}
                  <Box flexShrink={1} minWidth={0}><Text dimColor wrap="wrap">{step.text}</Text></Box>
                </Box>
              ))}
            </Box>
          ) : null,
        ),
      )
    })
    d.milestones.forEach((one, i) =>
      timeline.push(
        row(
          `progress-milestone-${d.day}-${i}`,
          date(),
          ringOf('done', first()),
          false,
          <Box flexDirection="row" gap={1.25} alignItems="flex-start">
            <Box flexShrink={1} minWidth={0}>{titleOf(`m-${d.day}-${i}`, one, true)}</Box>
            {one.live ? <Box flexShrink={0}><Text dimColor>live</Text></Box> : null}
          </Box>,
          one.outcome && one.outcome !== one.title ? <Text dimColor wrap="wrap">{one.outcome}</Text> : null,
          strip(`m-${area.id}-${d.day}-${i}`, one),
        ),
      ),
    )
    if (d.tasks.length) {
      const key = `${area.id}|${d.day}`
      const isOpen = progressView.days.has(key)
      timeline.push(
        row(
          `progress-tasks-${d.day}`,
          date(),
          ringOf('fold', first()),
          false,
          <Box flexDirection="row">
            <Button key={`progress-day-${d.day.replace(/\s/g, '-')}-${isOpen ? 'open' : 'shut'}-${look.gen}`} label={`${isOpen ? '−' : '+'} ${d.tasks.length} ${d.tasks.length === 1 ? 'task' : 'tasks'}`} plain dimColor onPress={() => look.acts.day(key)} />
          </Box>,
          isOpen ? (
            <Box flexDirection="column" gap={0.5} paddingLeft={2}>
              {d.tasks.map((one, i) => (
                <Box key={`progress-task-${d.day}-${i}`} flexDirection="row" gap={1.5}>
                  <Box flexShrink={1} minWidth={0}>{titleOf(`t-${d.day}-${i}`, one, false)}</Box>
                  {one.live ? <Box flexShrink={0}><Text dimColor>live</Text></Box> : null}
                </Box>
              ))}
            </Box>
          ) : null,
        ),
      )
    }
  }
  const oldest = days.at(-1)
  timeline.push(
    earlier && oldest
      ? row(
          'progress-earlier',
          null,
          ringOf('fold', isFirst),
          true,
          <Box flexDirection="row">
            <Button key={`progress-earlier-${progressView.daysShown}-${look.gen}`} label={`+ ${earlier} earlier ${earlier === 1 ? 'task' : 'tasks'}, ${dayOf(oldest.at, look.now)}${days[progressView.daysShown] && days[progressView.daysShown]?.day !== oldest.day ? `–${days[progressView.daysShown]?.day}` : ''}`} plain dimColor onPress={look.acts.more} />
          </Box>,
        )
      : row('progress-end', null, ringOf('none', true), true),
  )
  const label = (text: string) => (
    <Box paddingLeft={0.25} flexShrink={0}>
      <Text bold dimColor>{text}</Text>
    </Box>
  )
  const steps = area.next.filter(n => n.state !== 'aside' || !newestAside)
  const ordered = [...steps.filter(n => n.state === 'open'), ...steps.filter(n => n.state !== 'open')]
  const allPictures = entries.flatMap(one => look.pictures(one).map(ref => ({ ref, entry: one })))
  const drawerButton = (name: string, text: string, count: number) => (
    <Box key={`progress-drawer-${name}`} flexDirection="row" backgroundColor={FILL} paddingX={1.5} paddingY={0.75} gap={1} flexShrink={0} flexGrow={isWide ? 1 : 0} alignItems="center">
      <Button key={`progress-drawer-${name}-${progressView.drawer === name ? 'open' : 'shut'}-${look.gen}`} plain hover={{ underline: true }} onPress={() => look.acts.drawer(name)}>
        <Text>{text}</Text>
        <Text dimColor>{`  ${count}`}</Text>
      </Button>
      <Box flexGrow={1} />
      <Button key={`progress-drawer-go-${name}-${progressView.drawer === name ? 'open' : 'shut'}-${look.gen}`} label={progressView.drawer === name ? '⌄' : '›'} plain dimColor onPress={() => look.acts.drawer(name)} />
    </Box>
  )
  const drawerBody = () => {
    if (progressView.drawer === 'tasks') {
      const list = entries.slice(0, progressView.drawerMost)
      return (
        <Box key="progress-drawer-tasks-body" flexDirection="column" gap={0.5} paddingX={1.5}>
          {list.map((one, i) => (
            <Box key={`progress-all-${i}`} flexDirection="row" gap={1.5}>
              <Box width={isWide ? 9 : 7} flexShrink={0}><Text dimColor>{dayOf(atOf(one.at), look.now)}</Text></Box>
              <Box flexShrink={1} minWidth={0}>{titleOf(`all-${i}`, one, false, one.kind === 'aside')}</Box>
              {one.kind === 'aside' ? <Box flexShrink={0}><Text color={P_ASIDE}>set aside</Text></Box> : one.live ? <Box flexShrink={0}><Text dimColor>live</Text></Box> : null}
            </Box>
          ))}
          {entries.length > list.length ? <Box><Button key={`progress-drawer-more-${progressView.drawerMost}-${look.gen}`} label={`Show ${Math.min(60, entries.length - list.length)} more`} plain dimColor onPress={look.acts.drawerMore} /></Box> : null}
        </Box>
      )
    }
    if (progressView.drawer === 'pictures' && Svg) {
      const [w, tall] = isWide ? [128, 96] : [104, 78]
      const shown = allPictures.slice(0, Math.min(progressView.drawerMost, 24))
      return (
        <Box key="progress-drawer-pictures-body" flexDirection="row" flexWrap="wrap" gap={1} paddingX={0.5}>
          {shown.map(({ ref, entry }, i) => {
            const thumb = look.small(ref)
            return thumb && hrefOf(thumb) ? <Svg key={`progress-pic-${i}`} source={pictureOf(`g-${i}`, hrefOf(thumb), w, tall, 0, entry.kind === 'aside')} alt={entry.title} width={w} height={tall} /> : null
          })}
          {allPictures.length > shown.length ? <Text dimColor>{`${allPictures.length - shown.length} more in the results`}</Text> : null}
        </Box>
      )
    }
    return null
  }
  return (
    <Box key={`progress-area-page-${area.id}`} flexDirection="column" gap={2.5}>
      <Box flexDirection="column" gap={1} flexShrink={0}>
        <Box flexDirection="row" gap={0.75} alignItems="center">
          <Button key={`progress-back-${look.gen}`} label="‹ Progress" plain onPress={look.acts.back} />
          {Svg ? <Svg source={dotOf(goal.color)} alt="" width={8} height={20} /> : null}
          <Text dimColor>{goal.name}</Text>
        </Box>
        <Box flexDirection={isWide ? 'row' : 'column'} gap={isWide ? 3 : 1} alignItems={isWide ? 'flex-end' : 'stretch'}>
          <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold wrap="wrap">{area.name}</Text>
            {area.aim ? <Text dimColor wrap="wrap">{area.aim}</Text> : null}
          </Box>
          <Box flexShrink={0}>{Svg ? <Svg source={barOf(`a-${area.id}`, f, isWide ? 240 : Math.floor(look.width))} alt={countsSaid(f)} width={isWide ? 240 : Math.floor(look.width)} height={30} /> : <Text dimColor>{countsSaid(f)}</Text>}</Box>
        </Box>
      </Box>
      <Box flexDirection="column" gap={1} flexShrink={0}>
        {label('Next')}
        <Box flexDirection="column" gap={0.75} backgroundColor={FILL} paddingX={1.5} paddingY={1.25}>
          {ordered.length ? (
            ordered.map(step =>
              step.state !== 'aside' ? (
                <Box key={`progress-step-${step.id}`} flexDirection="row" gap={1.25} alignItems="flex-start" flexShrink={0}>
                  <Box flexShrink={0}>
                    {step.state === 'open' || !Svg ? <Button key={`progress-box-${step.id}-${step.state}-${look.gen}`} label={step.state === 'open' ? '☐' : '☑'} plain onPress={() => look.acts.tick(area.id, step.id, step.state === 'open' ? 'done' : 'open')} /> : <Svg source={boxOf('done')} alt="Done" width={16} height={22} />}
                  </Box>
                  <Box flexGrow={1} flexShrink={1} minWidth={0}>
                    <Button key={`progress-tick-${step.id}-${step.state}-${look.gen}`} plain dimColor={step.state === 'done'} onPress={() => look.acts.tick(area.id, step.id, step.state === 'open' ? 'done' : 'open')}>
                      <Text dimColor={step.state === 'done'} wrap="wrap">{step.text}</Text>
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box key={`progress-step-${step.id}`} flexDirection="row" gap={1.25} alignItems="flex-start" flexShrink={0}>
                  {Svg ? <Box flexShrink={0}><Svg source={boxOf(step.state)} alt="Set aside" width={16} height={22} /></Box> : <Text dimColor>–</Text>}
                  <Box flexGrow={1} flexShrink={1} minWidth={0}><Text dimColor wrap="wrap">{step.text}</Text></Box>
                </Box>
              ),
            )
          ) : (
            <Text dimColor>None yet</Text>
          )}
        </Box>
      </Box>
      {entries.length ? (
        <Box flexDirection="column" gap={1.25} flexShrink={0}>
          {label('Done')}
          <Box flexDirection="column" flexShrink={0}>{timeline}</Box>
        </Box>
      ) : null}
      {entries.length ? (
        <Box flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection={isWide ? 'row' : 'column'} gap={isWide ? 1 : 0.5} flexShrink={0}>
            {drawerButton('tasks', 'All tasks', entries.length)}
            {allPictures.length ? drawerButton('pictures', 'All pictures', allPictures.length) : null}
          </Box>
          {drawerBody()}
        </Box>
      ) : null}
    </Box>
  )
}

