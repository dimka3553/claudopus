// claudopus.ai/leaderboard/<name>: the leaderboard page with link-preview tags made for that person, so a link sent anywhere shows
// their picture (their figures, and their timeline when public) and a line of their stats. The page itself is leaderboard.html as is
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const LB_URL = 'https://wezffxcyofkyhoowwjwi.supabase.co'
const LB_KEY = 'sb_publishable_uUNtBu-IkFqW09L45yy4ig_Ap9KqT-U'
const SITE = 'https://www.claudopus.ai'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const num = v => (typeof v === 'number' && isFinite(v) ? v : 0)
// Days, hours and minutes: 9d 0h 18m
const hours = ms => {
  const m = Math.round(ms / 60000), d = Math.floor(m / 1440), h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0')
  return d ? `${d}d ${h}h ${mm}m` : h ? `${h}h ${mm}m` : `${m}m`
}
let page
const pageOf = async () => {
  if (page) return page
  try {
    page = readFileSync(join(process.cwd(), 'leaderboard.html'), 'utf8')
  } catch {
    page = await (await fetch(`${SITE}/leaderboard.html`)).text()
  }
  return page
}

// The person, or null when they are not on the board, or undefined when the board could not be asked (tried twice, 4 s each)
const lookUp = async name => {
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(`${LB_URL}/rest/v1/rpc/lb_person`, { method: 'POST', headers: { apikey: LB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_name: name }), signal: AbortSignal.timeout(4000) })
      if (r.ok) return await r.json()
    } catch {}
  }
  return undefined
}

export default async function handler(req, res) {
  const name = String(req.query.name ?? '').slice(0, 40)
  const html = await pageOf()
  const ok = /^[A-Za-z0-9_-]{3,20}$/.test(name)
  const person = ok ? await lookUp(name) : null
  let out = html
  const set = (attr, key, value) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`)
    out = re.test(out) ? out.replace(re, `<meta ${attr}="${key}" content="${esc(value)}">`) : out.replace('</head>', `<meta ${attr}="${key}" content="${esc(value)}">\n</head>`)
  }
  // A person's link always previews as that person: when the board could not be asked, their name, picture and a plain line,
  // never the board's own tags, which would read as the whole board
  if (person || (ok && person === undefined)) {
    const who = person ? person.name : name
    const title = `${who} on the Claudopus leaderboard`
    let said = `${who}'s Claudopus stats: how long their Claude tasks worked, and how many ran at once.`
    if (person) {
      const f = person.stats?.d7 ?? {}
      const times = num(f.clock) > 0 ? `${(num(f.work) / num(f.clock)).toFixed(2)}×` : ''
      const rank = person.ranks?.d7 ? `#${person.ranks.d7} of ${num(person.total)} this week. ` : ''
      said = `${rank}${hours(num(f.work))} of work in ${hours(num(f.clock))} on the clock${times ? `: ${times}` : ''}.`
    }
    const url = `${SITE}/leaderboard/${encodeURIComponent(who)}`
    // The picture's address changes when their figures do, so apps that keep a picture by its address fetch the new one
    const image = `${SITE}/og/leaderboard/${encodeURIComponent(who)}${person?.updated_at ? `?v=${encodeURIComponent(Date.parse(person.updated_at) || person.updated_at)}` : ''}`
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    out = out.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(url)}">`)
    set('name', 'description', said)
    set('property', 'og:title', title)
    set('property', 'og:description', said)
    set('property', 'og:url', url)
    set('property', 'og:image', image)
    set('property', 'og:image:alt', `${who}'s Claudopus stats: ${said}`)
    set('name', 'twitter:title', title)
    set('name', 'twitter:description', said)
    set('name', 'twitter:image', image)
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Short-lived and never served stale, so a preview app is not handed an older copy; not kept at all when the board was not reached
  res.setHeader('Cache-Control', person === undefined ? 'no-store' : 'public, max-age=0, s-maxage=60, must-revalidate')
  res.status(200).send(out)
}
