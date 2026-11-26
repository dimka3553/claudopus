// The Progress tab's drawing: the wheel of the bigger picture, each area's row under its goal, and an area's own page with its next
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
export type AreaFigures = { done: number; aside: number; next: number; month: number; weeks: number[]; live: boolean }
export type ProgressData = { star: string; goals: ProgressGoal[]; areas: PageArea[]; entries: Map<string, PageEntry[]>; working: Set<string> }
// What is done, set aside and next in an area: a milestone or a next step ticked is done; a set-aside result or step is aside; an
// open step is next. With the tasks of the last 30 days, the last 8 weeks' tasks a week (oldest first), and whether one runs now
export const figuresOf = (area: PageArea, entries: PageEntry[], working: Set<string>, now: number): AreaFigures => {
  const weeks = [0, 0, 0, 0, 0, 0, 0, 0]
  let month = 0
  for (const one of entries) {
    const age = now - atOf(one.at)
    if (!atOf(one.at) || age < 0) continue
    if (age < 30 * DAY_MS) month += 1
    const week = Math.floor(age / (7 * DAY_MS))
    if (week < 8) weeks[7 - week] = (weeks[7 - week] ?? 0) + 1
  }
  return {
    done: entries.filter(one => one.kind === 'milestone').length + area.next.filter(n => n.state === 'done').length,
    aside: entries.filter(one => one.kind === 'aside').length + area.next.filter(n => n.state === 'aside').length,
    next: area.next.filter(n => n.state === 'open').length,
    month,
    weeks,
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

// ---- The wheel: the north star in the centre, a ring of goals, a ring of areas under them, a band of their last 8 weeks ----
export type WheelArea = { id: string; name: string; color: string; goal: string } & AreaFigures
// Where a point at radius r and angle deg (0 at the top, clockwise) lies
export const polarOf = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}
export const sectorOf = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) => {
  const end = Math.min(a1, a0 + 359.9)
  const big = end - a0 > 180 ? 1 : 0
  const [p, q, s, t] = [polarOf(cx, cy, r1, a0), polarOf(cx, cy, r1, end), polarOf(cx, cy, r0, end), polarOf(cx, cy, r0, a0)]
  return `M${n1(p[0])} ${n1(p[1])}A${n1(r1)} ${n1(r1)} 0 ${big} 1 ${n1(q[0])} ${n1(q[1])}L${n1(s[0])} ${n1(s[1])}A${n1(r0)} ${n1(r0)} 0 ${big} 0 ${n1(t[0])} ${n1(t[1])}Z`
}
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
export const countsSaid = (f: { done: number; aside: number; next: number }) => [`${f.done} done`, f.aside ? `${f.aside} aside` : '', `${f.next} next`].filter(Boolean).join(', ')
// The wheel as one Svg, `width` wide: its source, size and words for a screen reader
export const wheelOf = (star: string, goals: ProgressGoal[], areas: WheelArea[], width: number) => {
  const isWide = width >= 560
  const room = isWide ? 150 : 88
  const R = Math.max(80, Math.min(isWide ? 168 : 120, Math.floor((width - 2 * room) / 2)))
  const top = isWide ? 30 : 24
  const H = 2 * R + 2 * top
  const cx = width / 2
  const cy = top + R
  const [rC, g0, g1, a0r, a1r, b0, b1] = [R * 0.47, R * 0.5, R * 0.59, R * 0.615, R * 0.85, R * 0.875, R]
  const order = [...goals, OTHER_GOAL].flatMap(goal => areas.filter(area => area.goal === goal.id))
  const used = [...goals, OTHER_GOAL].filter(goal => order.some(area => area.goal === goal.id))
  const total = order.reduce((sum, area) => sum + area.month, 0)
  const base = Math.max(1, total * 0.03)
  const [gapArea, gapGoal] = [order.length > 1 ? 1.2 : 0, used.length > 1 ? 3.2 : order.length > 1 ? 1.2 : 0]
  const free = 360 - used.length * gapGoal - Math.max(0, order.length - used.length) * gapArea
  const weight = order.reduce((sum, area) => sum + area.month + base, 0)
  // Each area's span, goal by goal, from the top clockwise
  let at = gapGoal / 2
  const spans = new Map<string, [number, number]>()
  for (const goal of used) {
    const mine = order.filter(area => area.goal === goal.id)
    mine.forEach((area, i) => {
      const span = (free * (area.month + base)) / weight
      spans.set(area.id, [at, at + span])
      at += span + (i < mine.length - 1 ? gapArea : gapGoal)
    })
  }
  const parts: string[] = []
  const defs = `<defs><pattern id="pw-aside" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="4" fill="${P_ASIDE}"/></pattern><filter id="pw-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${isWide ? 4 : 3}"/></filter><radialGradient id="pw-core"><stop offset="0" stop-color="#8080801f"/><stop offset="1" stop-color="#8080800a"/></radialGradient></defs>`
  // The centre, and a faint ring under the band
  parts.push(`<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(rC)}" fill="url(#pw-core)"/>`, `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(b0)}" fill="none" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`)
  // The goals' ring: each goal's arc as wide as its areas', so as this month's tasks
  for (const goal of used) {
    const mine = order.filter(area => area.goal === goal.id).map(area => spans.get(area.id) ?? [0, 0])
    const [s, e] = [mine[0]?.[0] ?? 0, mine.at(-1)?.[1] ?? 0]
    parts.push(`<path d="${sectorOf(cx, cy, g0, g1, s, e)}" fill="${goal.color}"/>`)
  }
  // The areas being built now glow purple beneath their arc
  for (const area of order.filter(one => one.live)) {
    const [s, e] = spans.get(area.id) ?? [0, 0]
    parts.push(`<path d="${sectorOf(cx, cy, a0r - 1, b1 + 3, s - 0.4, e + 0.4)}" fill="${LIVE}" fill-opacity="0.45" filter="url(#pw-glow)"/>`)
  }
  // The areas' ring: done in green from the start of the arc, then set aside hatched, then what is next in the goal's colour, faint
  for (const area of order) {
    const [s, e] = spans.get(area.id) ?? [0, 0]
    const color = goals.find(goal => goal.id === area.goal)?.color ?? OTHER_GOAL.color
    const all = area.done + area.aside + area.next
    parts.push(`<path d="${sectorOf(cx, cy, a0r, a1r, s, e)}" fill="${color}" fill-opacity="0.24"/>`)
    if (all) {
      const [d, a] = [((e - s) * area.done) / all, ((e - s) * area.aside) / all]
      if (d > 0.05) parts.push(`<path d="${sectorOf(cx, cy, a0r, a1r, s, s + d)}" fill="${P_GREEN}"/>`)
      if (a > 0.05) parts.push(`<path d="${sectorOf(cx, cy, a0r, a1r, s + d, s + d + a)}" fill="url(#pw-aside)"/>`)
    }
    if (area.live) parts.push(`<path d="${sectorOf(cx, cy, a0r, a1r, s, e)}" fill="none" stroke="${LIVE}" stroke-width="1.6"/>`)
  }
  // The band: each area's tasks a week over the last 8 weeks, a small range of hills along its arc
  const most = Math.max(1, ...order.flatMap(area => area.weeks))
  for (const area of order) {
    if (!area.weeks.some(Boolean)) continue
    const [s, e] = spans.get(area.id) ?? [0, 0]
    const color = goals.find(goal => goal.id === area.goal)?.color ?? OTHER_GOAL.color
    const knots = [[s, 0], ...area.weeks.map((v, i) => [s + ((e - s) * (i + 0.5)) / 8, Math.sqrt(v / most)]), [e, 0]] as [number, number][]
    const points: string[] = []
    for (let i = 0; i < knots.length - 1; i++) {
      const [p0, p1, p2, p3] = [knots[Math.max(0, i - 1)], knots[i], knots[i + 1], knots[Math.min(knots.length - 1, i + 2)]] as [[number, number], [number, number], [number, number], [number, number]]
      for (let k = 0; k < 6; k++) {
        const t = k / 6
        const v = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t * t * t)
        const [x, y] = polarOf(cx, cy, b0 + (b1 - b0) * Math.max(0, Math.min(1, v)), p1[0] + (p2[0] - p1[0]) * t)
        points.push(`${n1(x)} ${n1(y)}`)
      }
    }
    const [ex, ey] = polarOf(cx, cy, b0, e)
    const [sx, sy] = polarOf(cx, cy, b0, s)
    parts.push(`<path d="M${n1(sx)} ${n1(sy)}L${points.join('L')}L${n1(ex)} ${n1(ey)}A${n1(b0)} ${n1(b0)} 0 ${e - s > 180 ? 1 : 0} 0 ${n1(sx)} ${n1(sy)}Z" fill="${color}" fill-opacity="0.62"/>`)
  }
  // Each area's name in a column beside the wheel, on its side, pushed apart so none meet, a line to its arc; the smallest go
  // first where there is no room for all
  const lh = isWide ? 30 : 15
  const nameSize = isWide ? 12.5 : 10.5
  for (const side of [1, -1]) {
    const mid = (area: WheelArea) => {
      const [s, e] = spans.get(area.id) ?? [0, 0]
      return (s + e) / 2
    }
    const x = cx + side * (R + (isWide ? 22 : 14))
    const fits = Math.max(4, Math.floor((side > 0 ? width - x - 2 : x - 2) / (nameSize * 0.56)))
    // A narrow wheel's long name takes two lines, cut short past them
    const linesOf = (name: string) => {
      if (isWide || name.length <= fits) return [name.length > fits ? `${name.slice(0, fits - 1).trimEnd()}…` : name]
      const [one = '', ...rest] = wrapped(name, fits)
      const two = rest.join(' ')
      return [one.length > fits ? `${one.slice(0, fits - 1)}…` : one, two.length > fits ? `${two.slice(0, fits - 1).trimEnd()}…` : two].filter(Boolean)
    }
    const heightOf = (area: WheelArea) => (isWide ? lh : linesOf(area.name).length * 12.5 + 3)
    let mine = order.filter(area => (Math.sin((mid(area) * Math.PI) / 180) >= 0 ? 1 : -1) === side)
    while (mine.reduce((sum, area) => sum + heightOf(area), 0) > H - 8) {
      const least = mine.reduce((a, b) => (b.month < a.month ? b : a))
      mine = mine.filter(area => area !== least)
    }
    const placed = mine.map(area => ({ area, h: heightOf(area), y: cy - (R + 12) * Math.cos((mid(area) * Math.PI) / 180) })).sort((a, b) => a.y - b.y)
    placed.forEach((one, i) => {
      const before = placed[i - 1]
      one.y = Math.max(one.y, before ? before.y + (before.h + one.h) / 2 : one.h / 2 + 2)
    })
    for (let i = placed.length - 1; i >= 0; i--) {
      const [one, after] = [placed[i], placed[i + 1]]
      if (one) one.y = Math.min(one.y, after ? after.y - (after.h + one.h) / 2 : H - one.h / 2 - 2)
    }
    for (const { area, y } of placed) {
      const color = goals.find(goal => goal.id === area.goal)?.color ?? OTHER_GOAL.color
      const [px, py] = polarOf(cx, cy, b1 + 2, mid(area))
      const [qx, qy] = polarOf(cx, cy, b1 + 7, mid(area))
      parts.push(`<path d="M${n1(px)} ${n1(py)}L${n1(qx)} ${n1(qy)}L${n1(x - side * 4)} ${n1(isWide ? y - 6 : y)}" fill="none" stroke="${color}" stroke-opacity="0.8" stroke-width="1"/>`)
      const lines = linesOf(area.name)
      const anchor = side > 0 ? 'start' : 'end'
      const look = area.live ? `fill="${LIVE}" font-weight="600"` : 'fill="currentColor"'
      if (!isWide) {
        lines.forEach((line, i) => parts.push(`<text x="${n1(x)}" y="${n1(y + 3.8 + (i - (lines.length - 1) / 2) * 12.5)}" text-anchor="${anchor}" ${P_FONT} font-size="${nameSize}" ${look}>${xmlSafe(line)}</text>`))
        continue
      }
      parts.push(`<text x="${n1(x)}" y="${n1(y - 2)}" text-anchor="${anchor}" ${P_FONT} font-size="${nameSize}" ${look}>${xmlSafe(lines[0] ?? '')}</text>`)
      const counts = [`<tspan fill="${P_GREEN}">${area.done} done</tspan>`, area.aside ? `<tspan fill="${P_ASIDE}">${area.aside} aside</tspan>` : '', `<tspan fill="${P_DIM}">${area.next} next</tspan>`].filter(Boolean)
      parts.push(`<text x="${n1(x)}" y="${n1(y + 11.5)}" text-anchor="${anchor}" ${P_FONT} font-size="10.5" fill="${P_DIM}">${counts.join(`<tspan fill="${P_DIM}"> · </tspan>`)}</text>`)
    }
  }
  // The north star in the centre, as large as fits, and what is done and next over every area beneath it
  const sums = order.reduce((s, a) => ({ done: s.done + a.done, aside: s.aside + a.aside, next: s.next + a.next }), { done: 0, aside: 0, next: 0 })
  const sumsSize = isWide ? 11.5 : 9.5
  const quoted = star.trim() ? `“${star.trim().replace(/^["“]+|["”]+$/g, '')}”` : ''
  let size = isWide ? 15 : 11.5
  let lines = wrapped(quoted, Math.floor((rC * 1.6) / (size * 0.52)))
  while (quoted && size > 8 && lines.length * size * 1.22 > rC * 1.25) {
    size -= 0.5
    lines = wrapped(quoted, Math.floor((rC * 1.6) / (size * 0.52)))
  }
  const block = (quoted ? lines.length * size * 1.22 : 0) + sumsSize * 1.6
  let y = cy - block / 2 + size * 0.9
  for (const line of quoted ? lines : []) {
    parts.push(`<text x="${n1(cx)}" y="${n1(y)}" text-anchor="middle" ${P_FONT} font-size="${n1(size)}" fill="currentColor">${xmlSafe(line)}</text>`)
    y += size * 1.22
  }
  // (set aside only where the line fits inside the centre)
  const isAsideSaid = sums.aside > 0 && countsSaid(sums).replace(/,/g, ' ·').length * sumsSize * 0.56 < rC * 1.7
  const sumsParts = [`<tspan fill="${P_GREEN}">${sums.done} done</tspan>`, isAsideSaid ? `<tspan fill="${P_ASIDE}">${sums.aside} aside</tspan>` : '', `<tspan fill="${P_DIM}">${sums.next} next</tspan>`].filter(Boolean)
  parts.push(`<text x="${n1(cx)}" y="${n1(y + sumsSize * (quoted ? 0.55 : 0.3))}" text-anchor="middle" ${P_FONT} font-size="${sumsSize}" fill="${P_DIM}">${sumsParts.join(' · ')}</text>`)
  const shares = used.map(goal => `${goal.name} ${total ? Math.round((100 * order.filter(a => a.goal === goal.id).reduce((s, a) => s + a.month, 0)) / total) : 0}%`)
  const alt = cutTo([quoted, `Goals by this month's tasks: ${shares.join(', ')}.`, ...order.map(area => `${area.name}: ${countsSaid(area)}${area.live ? ', working now' : ''}.`)].filter(Boolean).join(' '), 900)
  return { source: svgDoc(width, H, defs + parts.join('')), width, height: H, alt }
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
export const progressView = { area: '', isOtherOpen: false, days: new Set<string>(), asides: new Set<string>(), daysShown: 5, drawer: '', pictures: PROGRESS_PICTURES_MOST, drawerMost: 60 }
// Pictures, then rows of a drawer, then days taken out, one at a time, while a drawing would not fit (drawingFits)
export function fewerProgress() {
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

// ---- The overview: the wheel, then each goal's areas as rows ----
export const progressOverview = (ui: Ui, data: ProgressData, look: ProgressLook) => {
  const { Box, Text, Button } = ui as unknown as Parts
  const Svg = (ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSXEl }).Svg
  const isWide = look.width >= 560
  const figures = new Map(data.areas.map(area => [area.id, figuresOf(area, data.entries.get(area.id) ?? [], data.working, look.now)]))
  if (!data.areas.length)
    return (
      <Box key="progress-empty" flexDirection="column" gap={1} paddingX={1}>
        <Text bold>Nothing is sorted yet</Text>
        <Text dimColor wrap="wrap">Claudopus sorts each task into its area as it finishes, and shows here what each area has done and what comes next.</Text>
      </Box>
    )
  const wheelAreas: WheelArea[] = data.areas.map(area => ({ id: area.id, name: area.name, color: goalOf(data, area).color, goal: goalOf(data, area).id, ...(figures.get(area.id) as AreaFigures) }))
  const wheel = wheelOf(data.star, data.goals, wheelAreas, Math.floor(look.width))
  const month = wheelAreas.reduce((sum, area) => sum + area.month, 0)
  const groups = grouped(data)
  const tw = isWide ? 64 : 52
  const th = isWide ? 48 : 39
  const row = (area: PageArea) => {
    const f = figures.get(area.id) as AreaFigures
    const entries = data.entries.get(area.id) ?? []
    const live = f.live ? entries.find(one => one.task && data.working.has(one.task)) : undefined
    const newest = live ?? entries[0]
    const best = entries.map(one => look.pictures(one)[0]).find(Boolean)
    const thumb = best ? look.small(best) : null
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
              {!isWide && Svg ? <Box paddingTop={0.5}><Svg source={barOf(`n-${area.id}`, f, barWidth)} alt={countsSaid(f)} width={barWidth} height={30} /></Box> : null}
              {!Svg ? <Text dimColor>{countsSaid(f)}</Text> : null}
            </Box>
            {isWide && Svg ? <Box flexShrink={0} paddingLeft={1}><Svg source={barOf(`w-${area.id}`, f, 150)} alt={countsSaid(f)} width={150} height={30} /></Box> : null}
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
        {Svg ? <Svg key="progress-wheel" source={wheel.source} alt={wheel.alt} width={wheel.width} height={wheel.height} /> : data.star ? <Text wrap="wrap">{`“${data.star}”`}</Text> : null}
        <Box key="progress-legend" flexDirection="row" flexWrap="wrap" columnGap={2.5} rowGap={0} justifyContent="center">
          {groups.map(({ goal, areas }) => (
            <Box key={`progress-legend-${goal.id || 'other'}`} flexDirection="row" gap={0.75} alignItems="center" flexShrink={0}>
              {Svg ? <Svg source={dotOf(goal.color)} alt="" width={8} height={20} /> : null}
              <Text>{goal.name}</Text>
              {month ? <Text dimColor>{`${Math.round((100 * areas.reduce((sum, area) => sum + (figures.get(area.id)?.month ?? 0), 0)) / month)}%`}</Text> : null}
            </Box>
          ))}
        </Box>
        {month ? (
          <Box key="progress-caption" flexDirection="row" justifyContent="center">
            <Text dimColor>{'Tasks in the last 30 days · outer band: 8 weeks'}</Text>
          </Box>
        ) : null}
      </Box>
      {groups.map(({ goal, areas }) =>
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

