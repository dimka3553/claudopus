// claudopus.ai/leaderboard/<name>: the leaderboard page with link-preview tags made for that person, so a link sent anywhere shows
// their picture (their figures, and their timeline when public) and a line of their stats. The page itself is leaderboard.html as is
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const LB_URL = 'https://wezffxcyofkyhoowwjwi.supabase.co'
const LB_KEY = 'sb_publishable_uUNtBu-IkFqW09L45yy4ig_Ap9KqT-U'
const SITE = 'https://www.claudopus.ai'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const num = v => (typeof v === 'number' && isFinite(v) ? v : 0)
const hours = ms => {
  const m = Math.round(ms / 60000)
  return m < 60 ? `${m}m` : `${Math.floor(m / 60).toLocaleString('en-US')}h`
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

export default async function handler(req, res) {
  const name = String(req.query.name ?? '').slice(0, 40)
  const html = await pageOf()
  let person = null
  if (/^[A-Za-z0-9_-]{3,20}$/.test(name)) {
    const r = await fetch(`${LB_URL}/rest/v1/rpc/lb_person`, { method: 'POST', headers: { apikey: LB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_name: name }) }).catch(() => null)
    person = r && r.ok ? await r.json().catch(() => null) : null
  }
  let out = html
  if (person) {
    const f = person.stats?.d7 ?? {}
    const times = num(f.clock) > 0 ? `${(num(f.work) / num(f.clock)).toFixed(2)}×` : ''
    const title = `${person.name} on the Claudopus leaderboard`
    const rank = person.ranks?.d7 ? `#${person.ranks.d7} of ${num(person.total)} this week. ` : ''
    const said = `${rank}${hours(num(f.work))} of work done in ${hours(num(f.clock))} on the clock${times ? `: ${times}` : ''}.`
    const url = `${SITE}/leaderboard/${encodeURIComponent(person.name)}`
    const image = `${SITE}/og/leaderboard/${encodeURIComponent(person.name)}`
    const set = (attr, key, value) => {
      const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`)
      out = re.test(out) ? out.replace(re, `<meta ${attr}="${key}" content="${esc(value)}">`) : out.replace('</head>', `<meta ${attr}="${key}" content="${esc(value)}">\n</head>`)
    }
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    set('name', 'description', said)
    set('property', 'og:title', title)
    set('property', 'og:description', said)
    set('property', 'og:url', url)
    set('property', 'og:image', image)
    set('property', 'og:image:alt', `${person.name}'s Claudopus stats: ${said}`)
    set('name', 'twitter:title', title)
    set('name', 'twitter:description', said)
    set('name', 'twitter:image', image)
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=120, stale-while-revalidate=600')
  res.status(200).send(out)
}
