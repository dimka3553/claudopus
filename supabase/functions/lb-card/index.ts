// The leaderboard's link previews: a 1200×630 picture of the board's top five (no name), or of one person (?name=): their hours of
// work, time on the clock, efficiency, favourite model, API cost and tasks, and, when their stats are public, their timeline
// as Stats draws it, with no task names. claudopus.ai/og/leaderboard.png and /og/leaderboard/<name> are rewrites to here
import React from 'https://esm.sh/react@18.2.0'
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts'

const h = React.createElement
const API = Deno.env.get('SUPABASE_URL') ?? ''
const KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const RANGES: Record<string, string> = { today: 'Today', d7: 'Last 7 days', d30: 'Last 30 days', all: 'All time' }
const BG = '#111111', RAISED = '#1C1C1E', INK = '#F4F4F0', SOFT = '#9A9A9A', PURPLE = '#8A63F0'

const call = async (fn: string, args: Record<string, unknown>) => {
  const r = await fetch(`${API}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
  return r.ok ? r.json() : null
}
let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] | undefined
const loadFonts = async () =>
  (fonts ??= await Promise.all(
    ([[400, 'regular'], [700, '700']] as const).map(async ([weight, file]) => ({
      name: 'Inter',
      weight,
      style: 'normal' as const,
      data: await (await fetch(`https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-${file === 'regular' ? 400 : 700}-normal.woff`)).arrayBuffer(),
    })),
  ))
// The 3D octopus, as the site keeps it; else as the repo has it (main, or the branch that added it, before its release)
const OCTOPUS = ['https://www.claudopus.ai/og-octopus.png', 'https://raw.githubusercontent.com/dimka3553/claudopus/main/site/og-octopus.png', 'https://raw.githubusercontent.com/dimka3553/claudopus/leaderboard-cards/site/og-octopus.png']
let octopus: string | null | undefined
const loadOctopus = async () => {
  if (octopus !== undefined) return octopus
  for (const url of OCTOPUS) {
    const r = await fetch(url).catch(() => null)
    if (r && r.ok && (r.headers.get('content-type') ?? '').startsWith('image/')) return (octopus = url)
  }
  return (octopus = null)
}

const num = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : 0)
// Days, hours and minutes: 9d 0h 18m
const hours = (ms: number) => {
  const m = Math.round(ms / 60000), d = Math.floor(m / 1440), h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0')
  return d ? `${d}d ${h}h ${mm}m` : h ? `${h}h ${mm}m` : `${m}m`
}
const money = (d: number) => (d >= 100 ? `$${Math.round(d).toLocaleString('en-US')}` : `$${d.toFixed(2)}`)
const times = (f: Record<string, unknown>) => (num(f.clock) > 0 ? `${(num(f.work) / num(f.clock)).toFixed(2)}×` : '–')
const modelName = (id: unknown) => {
  const m = /(fable|mythos|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(String(id ?? '').toLowerCase())
  return m ? `${m[1][0].toUpperCase()}${m[1].slice(1)}${m[2] ? ` ${m[2]}${m[3] ? `.${m[3]}` : ''}` : ''}` : '–'
}
const COLORS: [RegExp, string][] = [[/opus/, '#8A63F0'], [/sonnet/, '#2FA39A'], [/fable|mythos/, '#D0479A'], [/haiku/, '#7F8C9E']]
const colorOf = (id: string) => COLORS.find(([re]) => re.test(id))?.[1] ?? '#9A9A9A'
const rangeFrom = (rg: string, now: number) => (rg === 'today' ? now - 86_400_000 : rg === 'd7' ? now - 7 * 86_400_000 : rg === 'd30' ? now - 30 * 86_400_000 : 0)

// The timeline as bars: the same rows and squeezed axis as Stats and the person's page
const timelineBars = (line: any, rg: string, W: number, H: number) => {
  if (!line || !Array.isArray(line.pieces)) return []
  const base = num(line.base), models: unknown[] = Array.isArray(line.models) ? line.models : [], from = rangeFrom(rg, Date.now())
  const pieces = (line.pieces as unknown[])
    .map(bars => (Array.isArray(bars) ? bars : []).map((b: any) => {
      const a = base + num(b?.[0]) * 60000
      return { a: Math.max(a, from), z: a + Math.max(1, num(b?.[1])) * 60000, m: String(models[num(b?.[2])] ?? '') }
    }).filter(b => b.z > b.a))
    .filter(bars => bars.length)
  if (!pieces.length) return []
  const ends: number[] = []
  const lane = pieces.map(bars => {
    const i = ends.findIndex(end => end <= bars[0].a), at = i < 0 ? ends.length : i
    ends[at] = bars[bars.length - 1].z
    return at
  })
  const busy: [number, number][] = []
  for (const [a, z] of pieces.flat().map(b => [b.a, b.z] as [number, number]).sort((x, y) => x[0] - y[0])) {
    const last = busy[busy.length - 1]
    if (last && a <= last[1] + 30 * 60000) last[1] = Math.max(last[1], z)
    else busy.push([a, z])
  }
  const gap = busy.length > 1 ? Math.min(10, (W * 0.25) / (busy.length - 1)) : 0, room = W - gap * (busy.length - 1)
  const total = busy.reduce((n, [a, z]) => n + (z - a), 0) || 1
  let x = 0
  const parts = busy.map(([a, z]) => { const p = { a, z, x, w: ((z - a) / total) * room }; x += p.w + gap; return p })
  const at = (t: number) => { const p = parts.find(p => p.z >= t) ?? parts[parts.length - 1]; return p.x + (Math.min(Math.max(t, p.a), p.z) - p.a) * (p.w / Math.max(1, p.z - p.a)) }
  const step = Math.min(14, H / ends.length), tall = Math.max(1, step * 0.75)
  return pieces.flatMap((bars, i) => bars.map(b => ({ x: at(b.a), w: Math.max(2, at(b.z) - at(b.a)), y: lane[i] * step, h: tall, c: colorOf(b.m) }))).slice(0, 2500)
}

const frame = (children: unknown[], octo: string | null) =>
  h('div', { style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: BG, color: INK, fontFamily: 'Inter', padding: '56px 64px', position: 'relative' } },
    octo ? h('img', { src: octo, width: 230, height: 230, style: { position: 'absolute', right: 44, top: 22 } }) : null,
    h('div', { style: { display: 'flex', alignItems: 'center', fontSize: 26, color: SOFT } }, h('span', { style: { color: PURPLE, fontWeight: 700, marginRight: 12 } }, 'Claudopus'), 'leaderboard · claudopus.ai'),
    ...children)

const stat = (value: string, label: string, big = true) =>
  h('div', { style: { display: 'flex', flexDirection: 'column', marginRight: 56 } },
    h('div', { style: { fontSize: big ? 64 : 36, fontWeight: 700, letterSpacing: -1 } }, value),
    h('div', { style: { fontSize: 22, color: SOFT, marginTop: 4 } }, label))

const personCard = (p: any, rg: string, octo: string | null) => {
  const f = p.stats?.[rg] ?? {}
  const rank = p.ranks?.[rg] ? `#${p.ranks[rg]} of ${num(p.total)}` : 'Not ranked'
  const bars = p.is_public ? timelineBars(p.timeline, rg, 1072, 150) : []
  return frame([
    h('div', { style: { display: 'flex', alignItems: 'baseline', marginTop: 26 } },
      h('div', { style: { fontSize: 84, fontWeight: 700, letterSpacing: -2 } }, String(p.name ?? '').slice(0, 20)),
      h('div', { style: { fontSize: 30, color: PURPLE, fontWeight: 700, marginLeft: 24 } }, `${rank} · ${RANGES[rg]}`)),
    h('div', { style: { display: 'flex', marginTop: 22 } }, stat(hours(num(f.work)), 'time of work'), stat(hours(num(f.clock)), 'time on the clock'), stat(times(f), 'efficiency')),
    h('div', { style: { display: 'flex', marginTop: 18, fontSize: 26, color: SOFT } },
      h('span', { style: { color: INK, fontWeight: 700, marginRight: 8 } }, modelName(p.model?.[rg])), 'favourite model ·',
      h('span', { style: { color: INK, fontWeight: 700, margin: '0 8px' } }, money(num(f.cost))), 'API cost ·',
      h('span', { style: { color: INK, fontWeight: 700, margin: '0 8px' } }, num(f.tasks).toLocaleString('en-US')), 'tasks'),
    bars.length
      ? h('div', { style: { display: 'flex', position: 'relative', width: 1072, height: 150, marginTop: 'auto', background: RAISED } },
          ...bars.map(b => h('div', { style: { position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, background: b.c } })))
      : h('div', { style: { display: 'flex', marginTop: 'auto', fontSize: 24, color: SOFT } }, p.is_public ? 'No tasks in this range yet.' : `${p.name} keeps the rest of their stats private.`),
  ], octo)
}

const boardCard = (rows: any[], rg: string, octo: string | null) =>
  frame([
    h('div', { style: { display: 'flex', fontSize: 72, fontWeight: 700, letterSpacing: -2, marginTop: 22 } }, 'Who got the most done'),
    h('div', { style: { display: 'flex', fontSize: 28, color: SOFT, marginTop: 6 } }, `${RANGES[rg]} · by how long their Claude tasks worked`),
    h('div', { style: { display: 'flex', flexDirection: 'column', marginTop: 30 } },
      ...(rows.length ? rows.slice(0, 5) : [null]).map((r: any) =>
        r
          ? h('div', { style: { display: 'flex', alignItems: 'center', fontSize: 30, padding: '10px 0', borderTop: '1px solid #2A2A2A' } },
              h('div', { style: { width: 60, color: PURPLE, fontWeight: 700 } }, String(r.rank)),
              h('div', { style: { width: 330, fontWeight: 700 } }, String(r.name ?? '').slice(0, 20)),
              h('div', { style: { width: 230 } }, hours(num(r.f?.work))),
              h('div', { style: { width: 160, color: SOFT } }, times(r.f ?? {})),
              h('div', { style: { color: SOFT } }, modelName(r.model)))
          : h('div', { style: { display: 'flex', fontSize: 30, color: SOFT } }, 'Nobody has joined yet. Be the first.'))),
  ], octo)

Deno.serve(async req => {
  const url = new URL(req.url)
  const name = (url.searchParams.get('name') ?? '').replace(/\.png$/i, '')
  const rg = RANGES[url.searchParams.get('range') ?? ''] ? (url.searchParams.get('range') as string) : 'd7'
  const [font, octo] = await Promise.all([loadFonts(), loadOctopus()])
  const body = name
    ? await call('lb_person', { p_name: name }).then(p => (p ? personCard(p, rg, octo) : boardCard([], rg, octo)))
    : boardCard((await call('lb_board', { p_range: rg, p_sort: 'work' })) ?? [], rg, octo)
  return new ImageResponse(body as any, { width: 1200, height: 630, fonts: font, headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } })
})
