// claudopus.ai/leaderboard: the board, and one person's stats at /leaderboard/<name>. Plain script, no build step.
const LB_URL = 'https://wezffxcyofkyhoowwjwi.supabase.co'
const LB_KEY = 'sb_publishable_uUNtBu-IkFqW09L45yy4ig_Ap9KqT-U'

;(() => {
  const $ = s => document.querySelector(s)
  const q = new URLSearchParams(location.search)
  const RANGES = { today: 'Today', d7: '7 days', d30: '30 days', all: 'All time' }
  const SORTS = { work: 'Time of work', clock: 'Time on the clock', efficiency: 'Efficiency', tokens: 'Tokens', cost: 'API cost' }
  const EVERY = 30000

  // the name comes from the path (/leaderboard/dima), or from ?u= where the page is opened as leaderboard.html
  const pretty = !/\.html$/.test(location.pathname)
  const fromPath = (location.pathname.match(/^\/leaderboard\/([^/]+)\/?$/) || [])[1]
  const who = (() => { try { return decodeURIComponent(fromPath || q.get('u') || '') } catch { return '' } })()
  let range = RANGES[q.get('range')] ? q.get('range') : 'd7'
  let sort = SORTS[q.get('sort')] ? q.get('sort') : 'work'
  const link = (path, u) => {
    const a = new URLSearchParams(u)
    if (range !== 'd7') a.set('range', range)
    if (q.get('mock')) a.set('mock', q.get('mock')) // the local fake set carries on from page to page
    const s = a.toString()
    return path + (s ? '?' + s : '')
  }
  const personLink = name => pretty ? link('/leaderboard/' + encodeURIComponent(name)) : link('/leaderboard.html', { u: name })
  const boardLink = () => link(pretty ? '/leaderboard' : '/leaderboard.html')

  // ---- how figures are written ----
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
  // Days, hours and minutes: 9d 0h 18m, 5h 03m, 45m
  const hours = ms => {
    const m = Math.round((ms || 0) / 60000), d = Math.floor(m / 1440), h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0')
    return d ? d + 'd ' + h + 'h ' + mm + 'm' : h ? h + 'h ' + mm + 'm' : m + 'm'
  }
  const span = ms => (ms || 0) < 60000 ? Math.round((ms || 0) / 1000) + 's' : hours(ms)
  const tokens = n => {
    n = n || 0
    for (const [v, u] of [[1e9, 'B'], [1e6, 'M'], [1e3, 'k']]) if (n >= v) { const x = n / v; return (x < 100 ? +x.toFixed(1) : Math.round(x)) + u }
    return String(Math.round(n))
  }
  const money = d => (d || 0) >= 100 ? '$' + Math.round(d).toLocaleString('en-US') : '$' + (d || 0).toFixed(2)
  const eff = f => f && f.clock > 0 ? (f.work / f.clock).toFixed(2) + '×' : '–'
  const pct = (a, b) => b > 0 ? Math.round(a / b * 100) + '%' : '–'
  const count = n => (n || 0).toLocaleString('en-US')
  const ago = iso => {
    const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000))
    if (!isFinite(s)) return ''
    return s < 60 ? s + 's ago' : s < 3600 ? Math.floor(s / 60) + 'm ago' : s < 86400 ? Math.floor(s / 3600) + 'h ago' : Math.floor(s / 86400) + 'd ago'
  }
  // the same rule as the mod: the family and its version from the id, claude-opus-5-5 is Opus 5.5
  const modelName = id => {
    const m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(String(id).toLowerCase())
    return m ? m[1][0].toUpperCase() + m[1].slice(1) + (m[2] ? ' ' + m[2] + (m[3] ? '.' + m[3] : '') : '') : String(id)
  }

  // ---- the timeline, as Stats draws it in Claudopus: a row for each task and helper at work at once, each stretch in its model's colour, quiet
  // gaps over half an hour squeezed to a narrow break. It never names a task: the board is sent stretches and models only ----
  const COLORS = [[/opus/, '#8A63F0'], [/sonnet/, '#2FA39A'], [/fable|mythos/, '#D0479A'], [/haiku/, '#7F8C9E']]
  const colorOf = id => (COLORS.find(([re]) => re.test(String(id))) || [0, '#9A9A9A'])[1]
  const MIN = 60000, BREAK = 30 * MIN
  const rangeFrom = (rg, now) => rg === 'today' ? new Date(new Date(now).setHours(0, 0, 0, 0)).getTime() : rg === 'd7' ? now - 7 * 864e5 : rg === 'd30' ? now - 30 * 864e5 : 0
  const when = t => new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const timelineHtml = (line, rg) => {
    if (!line || !Array.isArray(line.pieces)) return ''
    const base = Number(line.base) || 0, models = Array.isArray(line.models) ? line.models : [], from = rangeFrom(rg, Date.now())
    // Each task's stretches in this range, as times
    const pieces = line.pieces.map(bars => (Array.isArray(bars) ? bars : []).map(b => {
      const a = base + (Number(b[0]) || 0) * MIN
      return { a: Math.max(a, from), z: a + Math.max(1, Number(b[1]) || 1) * MIN, m: String(models[Number(b[2])] ?? '') }
    }).filter(b => b.z > b.a)).filter(bars => bars.length)
    if (!pieces.length) return `<section class="lb-block lb-line"><h2>Timeline</h2><p class="soft">No tasks in this range.</p></section>`
    // Rows: each task or helper in the first row free by its start, so the rows count those at work at once
    const ends = [], lane = pieces.map(bars => {
      const a = bars[0].a, i = ends.findIndex(end => end <= a), at = i < 0 ? ends.length : i
      ends[at] = bars[bars.length - 1].z
      return at
    })
    // The axis: busy stretches joined across gaps under half an hour, each gap over it a narrow break
    const spans = pieces.flat().map(b => [b.a, b.z]).sort((x, y) => x[0] - y[0])
    const busy = []
    for (const [a, z] of spans) { const last = busy[busy.length - 1]; if (last && a <= last[1] + BREAK) last[1] = Math.max(last[1], z); else busy.push([a, z]) }
    const W = 1000, gap = busy.length > 1 ? Math.min(14, (W * 0.25) / (busy.length - 1)) : 0, room = W - gap * (busy.length - 1)
    const total = busy.reduce((n, [a, z]) => n + (z - a), 0) || 1
    let x = 0
    const parts = busy.map(([a, z]) => { const p = { a, z, x, w: (z - a) / total * room }; x += p.w + gap; return p })
    const at = t => { const p = parts.find(p => p.z >= t) || parts[parts.length - 1]; return p.x + (Math.min(Math.max(t, p.a), p.z) - p.a) * (p.w / Math.max(1, p.z - p.a)) }
    const rows = ends.length, step = Math.min(11, 120 / rows), tall = step * 0.73
    const bars = pieces.flatMap((bs, i) => bs.map(b => {
      const bx = at(b.a), bw = Math.max(1.5, at(b.z) - bx)
      return `<rect x="${bx.toFixed(1)}" y="${(lane[i] * step).toFixed(1)}" width="${bw.toFixed(1)}" height="${tall.toFixed(1)}" fill="${colorOf(b.m)}"><title>${esc(modelName(b.m) || 'Task')} · ${when(b.a)} to ${when(b.z)} · ${hours(b.z - b.a)}</title></rect>`
    })).join('')
    const ticks = gap >= 3 ? parts.slice(1).map(p => `<path d="M${(p.x - gap / 2).toFixed(1)} 122v6" stroke="currentColor" stroke-dasharray="2 2"/>`).join('') : ''
    const used = [...new Set(pieces.flat().map(b => b.m).filter(Boolean))]
    return `<section class="lb-block lb-line"><div class="lb-line-head"><h2>Timeline</h2><span class="soft">Up to ${rows} at work at once</span></div>
<svg class="lb-timeline" viewBox="0 0 ${W} 130" preserveAspectRatio="none" role="img" aria-label="${pieces.length} tasks and helpers on a timeline">${bars}${ticks}</svg>
<div class="lb-line-axis soft"><span>${when(parts[0].a)}</span><span>${when(parts[parts.length - 1].z)}</span></div>
<ul class="lb-line-legend">${used.map(m => `<li><i style="background:${colorOf(m)}"></i>${esc(modelName(m))}</li>`).join('')}</ul></section>`
  }

  // ---- the data: Supabase, or a small fake set on this computer with ?mock=1 ----
  const local = ['localhost', '127.0.0.1'].includes(location.hostname)
  const mock = local && q.get('mock') ? q.get('mock') : ''
  const call = async (fn, args) => {
    if (mock) return fake(fn, args)
    const res = await fetch(LB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: LB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
    if (!res.ok) throw new Error(fn + ' ' + res.status)
    return res.json()
  }

  // ---- the page ----
  const view = $('#lb-view'), status = $('#lb-status'), title = $('#lb-title'), lead = $('#lb-lead')
  let shown = '', stamp = '', failed = false, last = 0, busy = false, lastP = null, had = false

  const paintStatus = () => {
    status.textContent = failed ? 'Couldn\'t reach the leaderboard. Trying again in 30 seconds.' : stamp ? 'Updated ' + ago(stamp) : ''
    status.classList.toggle('is-trouble', failed)
  }
  const paint = html => { if (html !== shown) { view.innerHTML = html; shown = html } }
  const paintRange = () => document.querySelectorAll('#lb-range button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.range === range)))

  const tile = (label, value, note) => `<li><span class="lb-label">${label}</span><b>${value}</b>${note ? `<span class="note">${note}</span>` : ''}</li>`

  const board = rows => {
    title.textContent = 'Leaderboard'
    lead.hidden = false
    document.title = 'Claudopus leaderboard: how long Claude tasks worked'
    if (!rows.length) return `<div class="lb-empty"><h2>Nobody has joined yet.</h2><p class="soft">Be the first: <a href="#join">here is how to join</a>.</p></div>`
    const total = rows[0].total || rows.length
    const head = (key, label) => key
      ? `<th class="num" aria-sort="${sort === key ? 'descending' : 'none'}"><button type="button" data-sort="${key}"${sort === key ? ' class="is-on"' : ''}>${label}</button></th>`
      : `<th class="num">${label}</th>`
    const body = rows.map(r => {
      const f = r.f || {}
      const name = r.is_public
        ? `<a href="${esc(personLink(r.name))}">${esc(r.name)}</a>`
        : `${esc(r.name)} <span class="lb-private">private</span>`
      return `<tr><td class="lb-rank">${r.rank}</td><td class="lb-who">${name}</td><td class="num">${hours(f.work)}</td><td class="num">${hours(f.clock)}</td><td class="num">${eff(f)}</td><td>${r.model ? esc(modelName(r.model)) : '–'}</td><td class="num">${tokens(f.tokens)}</td><td class="num">${money(f.cost)}</td><td class="num">${count(f.tasks)}</td></tr>`
    }).join('')
    return `<div class="lb-scroll"><table class="lb-table"><thead><tr><th>#</th><th>Username</th>${head('work', 'Time of work')}${head('clock', 'Time on the clock')}${head('efficiency', 'Efficiency')}<th>Favourite model</th>${head('tokens', 'Tokens')}${head('cost', 'API cost')}<th class="num">Tasks done</th></tr></thead><tbody>${body}</tbody></table></div>
<p class="lb-count">${total === 1 ? '1 person' : count(total) + ' people'} on the board</p>
<ul class="lb-notes note"><li>Time of work: how long Claude's tasks and their helpers worked, each added up.</li><li>Efficiency: how much work got done for each hour on the clock.</li><li>Favourite model: the model that used the most tokens.</li><li>API cost: what the same use would cost at Anthropic's list prices.</li></ul>`
  }

  const person = p => {
    lead.hidden = true
    if (!p) {
      title.textContent = who
      document.title = 'Claudopus leaderboard'
      return `<div class="lb-empty"><h2>Nobody on the board is called ${esc(who)}.</h2><p><a href="${esc(boardLink())}">See the leaderboard</a></p></div>`
    }
    title.textContent = p.name
    document.title = p.name + ' on the Claudopus leaderboard'
    const s = (p.stats || {})[range] || {}, r = (p.ranks || {})[range]
    const rank = `<p class="lb-rankline">${r ? '#' + r + ' of ' + count(p.total) : 'Not ranked'} · ${RANGES[range]}</p>`
    const tiles = `<ul class="lb-tiles">${[
      tile('Time of work', hours(s.work)),
      tile('Time on the clock', hours(s.clock)),
      tile('Efficiency', eff(s), 'How much work got done for each hour on the clock.'),
      tile('Favourite model', p.model && p.model[range] ? esc(modelName(p.model[range])) : '–', 'The model that used the most tokens.'),
      tile('API cost', money(s.cost), 'What the same use would cost at Anthropic\'s list prices.'),
      tile('Tasks done', count(s.tasks)),
    ].join('')}</ul>`
    const back = `<p class="lb-back"><a href="${esc(boardLink())}">Back to the leaderboard</a></p>`
    if (!p.is_public) return rank + tiles + (p.timeline ? timelineHtml(p.timeline, range) : '') + `<p class="lb-private-line soft">${esc(p.name)} keeps the rest of their stats private.</p>` + back
    const all = s.tokens || ((s.read || 0) + (s.write || 0) + (s.input || 0) + (s.output || 0))
    const parts = [['read', 'Cache reads', s.read], ['write', 'Cache writes', s.write], ['input', 'Fresh input', s.input], ['output', 'Output', s.output]]
    const bar = `<div class="lb-stack" role="img" aria-label="${parts.map(([, l, v]) => l + ' ' + pct(v || 0, all)).join(', ')}">${parts.map(([k, , v]) => all && v ? `<i class="lb-${k}" style="width:${(v / all * 100).toFixed(2)}%"></i>` : '').join('')}</div>`
    const legend = `<ul class="lb-legend">${parts.map(([k, l, v]) => `<li><i class="lb-${k}"></i><span>${l}</span><b>${pct(v || 0, all)}</b><span class="soft">${tokens(v)}</span></li>`).join('')}</ul>`
    const models = (s.models || []).slice().sort((a, b) => b[1] - a[1])
    const modelRows = models.length
      ? `<table class="lb-models"><thead><tr><th>Model</th><th class="num">Tokens</th><th class="num">API cost</th></tr></thead><tbody>${models.map(([id, t, c]) => `<tr><td>${esc(modelName(id))}</td><td class="num">${tokens(t)}</td><td class="num">${money(c)}</td></tr>`).join('')}</tbody></table>`
      : `<p class="soft">No models used in this range.</p>`
    const work = `<dl class="lb-work">${[
      ['Messages', count(s.messages)], ['To-dos done', count(s.todos)], ['Workflows', count(s.flows)],
      ['Most at work at once', count(s.most)], ['Average time per task', s.tasks ? span(s.per_task) : '–'],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`
    return rank + tiles + timelineHtml(p.timeline, range) + `<div class="lb-blocks">
<section class="lb-block"><h2>Tokens</h2>${bar}${legend}</section>
<section class="lb-block"><h2>Models</h2>${modelRows}</section>
<section class="lb-block"><h2>Work</h2>${work}</section>
</div>` + back
  }

  const load = async () => {
    if (busy) return
    busy = true; last = Date.now()
    try {
      if (who) {
        const p = await call('lb_person', { p_name: who })
        lastP = p; had = true; paint(person(p)); stamp = p ? p.updated_at : ''
      } else {
        const rows = await call('lb_board', { p_range: range, p_sort: sort })
        paint(board(rows || []))
        stamp = (rows || []).reduce((m, r) => !m || Date.parse(r.updated_at) > Date.parse(m) ? r.updated_at : m, '')
      }
      failed = false
    } catch { failed = true }
    busy = false; view.classList.remove('is-loading'); paintStatus()
  }

  const keep = () => {
    const u = new URLSearchParams(location.search)
    range === 'd7' ? u.delete('range') : u.set('range', range)
    sort === 'work' || who ? u.delete('sort') : u.set('sort', sort)
    const s = u.toString()
    history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash)
  }

  $('#lb-range').addEventListener('click', e => {
    const b = e.target.closest('button[data-range]')
    if (!b || b.dataset.range === range) return
    range = b.dataset.range; keep(); paintRange()
    if (who) { if (had) paint(person(lastP)); return } // a person's ranges all come in one answer
    view.classList.add('is-loading'); load()
  })
  view.addEventListener('click', e => {
    const b = e.target.closest('button[data-sort]')
    if (!b || b.dataset.sort === sort) return
    sort = b.dataset.sort; keep(); view.classList.add('is-loading'); load()
  })

  paintRange(); load()
  setInterval(() => { if (document.visibilityState === 'visible') load() }, EVERY)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - last >= EVERY) load() })
  setInterval(() => { if (document.visibilityState === 'visible') paintStatus() }, 1000)

  // ---- the fake set, only on this computer with ?mock=1 (?mock=empty, ?mock=fail) ----
  function fake(fn, args) {
    if (mock === 'fail') return Promise.reject(new Error('mock'))
    const H = 3600000, now = Date.now()
    const people = mock === 'empty' ? [] : [
      ['dima', true, 412, 138, 4.1e9, 2210], ['mira_k', true, 388, 120, 3.6e9, 1984], ['octavia', false, 301, 140, 2.9e9, 1502],
      ['jonas', true, 260, 101, 2.2e9, 1210], ['sam-builds', true, 233, 96, 1.9e9, 1100], ['lena', false, 190, 88, 1.4e9, 860],
      ['k.tanaka', true, 151, 70, 1.1e9, 640], ['ravi', true, 122, 61, 8.4e8, 512], ['noor', true, 96, 50, 6.2e8, 403],
      ['paulo', false, 61, 40, 3.1e8, 220], ['wen', true, 33, 21, 1.2e8, 98], ['ada', true, 12, 9, 3.4e7, 31],
    ].map(([name, pub, w, c, t, k], i) => ({ name, pub, w, c, t, k, at: new Date(now - (i * 7 + 12) * 1000).toISOString() }))
    const scale = { today: 0.05, d7: 0.3, d30: 0.8, all: 1 }
    const stats = (p, rg, full) => {
      const x = scale[rg] * (p.name === 'mira_k' && rg === 'today' ? 1.6 : 1), t = p.t * x
      const s = { work: p.w * H * x, clock: p.c * H * x, tokens: t, read: t * 0.91, write: t * 0.05, input: t * 0.01, output: t * 0.03, cost: t / 1e6 * 1.9, tasks: Math.round(p.k * x), messages: Math.round(p.k * x * 2.4) }
      if (full) Object.assign(s, { models: [['claude-opus-5-5', t * 0.78, s.cost * 0.86], ['claude-sonnet-5-5', t * 0.2, s.cost * 0.12], ['claude-fable-5-2', t * 0.02, s.cost * 0.02]], todos: Math.round(s.tasks * 3.1), flows: Math.round(s.tasks * 0.08), most: 9, per_task: s.work / Math.max(1, s.tasks) })
      return s
    }
    const fakeLine = () => {
      const base = Math.floor((now - 23 * 864e5) / 6e4) * 6e4, pieces = []
      for (let i = 0; i < 260; i++) { const a = Math.floor(i / 260 * 23 * 1440) + (i % 7) * 9; pieces.push([[a, 5 + (i * 37) % 70, i % 5 ? 0 : i % 2 ? 1 : 2]].concat(i % 3 ? [] : [[a + 90, 10 + i % 30, 0]])) }
      return { base, models: ['claude-opus-5-5', 'claude-fable-5-2', 'claude-sonnet-5-5'], pieces }
    }
    const key = { work: s => s.work, clock: s => s.clock, efficiency: s => s.clock ? s.work / s.clock : 0, tokens: s => s.tokens, cost: s => s.cost }
    const ranked = (rg, by) => people.map(p => ({ p, s: stats(p, rg) })).sort((a, b) => key[by](b.s) - key[by](a.s))
    if (fn === 'lb_board') return Promise.resolve(ranked(args.p_range, args.p_sort).slice(0, 10).map(({ p, s }, i) => ({ rank: i + 1, name: p.name, is_public: p.pub, updated_at: p.at, total: people.length, model: i % 3 ? 'claude-opus-5-5' : 'claude-fable-5-2', f: s })))
    const p = people.find(p => p.name === args.p_name)
    if (!p) return Promise.resolve(null)
    const ranks = {}, st = {}
    for (const rg of Object.keys(scale)) { ranks[rg] = ranked(rg, 'work').findIndex(x => x.p === p) + 1; st[rg] = stats(p, rg, p.pub) }
    return Promise.resolve({ name: p.name, is_public: p.pub, joined_at: new Date(now - 40 * 864e5).toISOString(), updated_at: p.at, total: people.length, ranks, stats: st, timeline: p.pub ? fakeLine() : undefined, model: { today: 'claude-opus-5-5', d7: 'claude-opus-5-5', d30: 'claude-opus-5-5', all: 'claude-opus-5-5' } })
  }
})()
