// claudopus.ai: the cookie choice, and Microsoft Clarity. Its own styles come with it, so any page that has the design system's
// tokens can load it with one script line. Where the visitor's country asks for a yes first (api/consent.js says), the banner
// shows and only Accept loads Clarity; Decline, or no choice yet, loads nothing from it. Elsewhere no banner shows and Clarity
// loads, until the footer's Cookies link is used to decline.
(() => {
  const CLARITY = 'zf37u6fd0e'
  const KEY = 'claudopus-cookies'
  // each copy key counts as its own event in Clarity, named by the line it copies
  const COPY = {
    '/plugin marketplace add dimka3553/claudopus': 'copy_marketplace_add',
    '/plugin install claudopus@claudopus': 'copy_install',
    '/claudopus': 'copy_open_panel',
    'curl -fsSL https://www.claudopus.ai/install.sh | sh': 'copy_install_line',
  }

  const load = () => { try { return localStorage.getItem(KEY) } catch { return null } }
  const save = value => { try { localStorage.setItem(KEY, value) } catch {} }
  let choice = load()
  // whether this visitor must say yes first: null until api/consent answers, kept for the visit
  let ask = null
  try { const kept = sessionStorage.getItem(KEY + '-ask'); if (kept) ask = kept === 'yes' } catch {}
  const allowed = () => choice === 'accept' || (choice === null && ask === false)

  const start = () => {
    if (!window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y)
      })(window, document, 'clarity', 'script', CLARITY)
    }
    clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })
  }
  // a loaded Clarity keeps sending in its no-consent mode, so after its cookies are dropped the page loads again without it
  const stop = () => {
    if (!window.clarity) return
    clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' })
    clarity('consent', false)
    location.reload()
  }
  const count = name => { if (allowed() && window.clarity) clarity('event', name) }

  const pressed = e => {
    const copy = e.type === 'click' && e.target.closest?.('[data-copy]')
    if (copy) { count(COPY[copy.dataset.copy] || 'copy_other'); return }
    const link = e.target.closest?.('a[href]')
    if (link && /^https:\/\/github\.com\//.test(link.href)) count('click_github')
  }
  document.addEventListener('click', pressed, true)
  document.addEventListener('auxclick', e => { if (e.button === 1) pressed(e) }, true)

  // ---- the banner ----
  const style = document.createElement('style')
  style.textContent = `
.cookies{position:fixed;z-index:50;right:var(--s6);bottom:var(--s6);max-width:400px;display:grid;gap:var(--s3);padding:var(--s4);
  background:var(--raised);color:var(--ink);font:400 var(--t-small)/1.45 var(--sans);box-shadow:inset 0 0 0 1px var(--line);
  --n:var(--cell);clip-path:polygon(var(--n) 0,calc(100% - var(--n)) 0,calc(100% - var(--n)) var(--n),100% var(--n),100% calc(100% - var(--n)),calc(100% - var(--n)) calc(100% - var(--n)),calc(100% - var(--n)) 100%,var(--n) 100%,var(--n) calc(100% - var(--n)),0 calc(100% - var(--n)),0 var(--n),var(--n) var(--n))}
.cookies[hidden]{display:none}
.cookies p{margin:0;color:var(--soft)}
.cookies p b{color:var(--ink);font-weight:700}
.cookies .row{display:flex;gap:var(--s2)}
.cookies button{flex:1;min-height:44px;padding:0 var(--s4);border:0;font:600 var(--t-small)/1 var(--sans);cursor:pointer;
  --n:var(--cell);clip-path:polygon(var(--n) 0,calc(100% - var(--n)) 0,calc(100% - var(--n)) var(--n),100% var(--n),100% calc(100% - var(--n)),calc(100% - var(--n)) calc(100% - var(--n)),calc(100% - var(--n)) 100%,var(--n) 100%,var(--n) calc(100% - var(--n)),0 calc(100% - var(--n)),0 var(--n),var(--n) var(--n))}
.cookies .yes{background:var(--purple);color:var(--on-purple)}
.cookies .yes:hover{background:var(--purple-lift)}
.cookies .no{background:var(--line);color:var(--ink)}
.cookies .no:hover{background:var(--faint)}
.cookies button:focus-visible{outline:2px solid var(--purple-ink);outline-offset:-4px}
@media (max-width:640px){.cookies{left:var(--s4);right:var(--s4);bottom:var(--s4);max-width:none}}`
  document.head.append(style)

  const box = document.createElement('div')
  box.className = 'cookies'
  box.setAttribute('role', 'region')
  box.setAttribute('aria-label', 'Cookies')
  box.innerHTML = '<p><b>Accept cookies?</b> They let Microsoft Clarity show us how the site is used. <a href="privacy.html">Privacy</a></p>'
    + '<div class="row"><button type="button" class="yes">Accept</button><button type="button" class="no">Decline</button></div>'
  box.hidden = true
  // while it shows, the page gets room below its end, so the banner never covers the footer
  const room = () => { document.body.style.paddingBottom = box.hidden ? '' : box.offsetHeight + 32 + 'px' }
  addEventListener('resize', room, { passive: true })
  let opener = null
  const show = from => { opener = from || null; box.hidden = false; room(); box.querySelector('.yes').focus({ preventScroll: true }) }
  const decide = value => {
    choice = value; save(value); box.hidden = true; room()
    opener?.focus({ preventScroll: true }); opener = null
    if (value === 'accept') start(); else stop()
    document.dispatchEvent(new CustomEvent('cookies', { detail: value }))
  }
  box.querySelector('.yes').addEventListener('click', () => decide('accept'))
  box.querySelector('.no').addEventListener('click', () => decide('decline'))
  document.addEventListener('click', e => { const link = e.target.closest?.('[data-cookies]'); if (link) { e.preventDefault(); show(link) } })
  box.addEventListener('keydown', e => { if (e.key === 'Escape' && (choice || ask === false)) { box.hidden = true; room(); opener?.focus({ preventScroll: true }); opener = null } })
  window.claudopusCookies = { get: () => choice, asks: () => ask, set: decide, show: () => show() }

  const where = async () => {
    if (ask === null) {
      try {
        const r = await fetch('/api/consent', { cache: 'no-store' })
        ask = r.ok ? (await r.json()).ask !== false : true
      } catch { ask = true }
      try { sessionStorage.setItem(KEY + '-ask', ask ? 'yes' : 'no') } catch {}
    }
    if (choice !== null) return
    if (ask) { box.hidden = false; room() } else start()
    document.dispatchEvent(new CustomEvent('cookies', { detail: null }))
  }
  const ready = () => { document.body.append(box); if (choice === 'accept') start(); else if (choice !== 'decline') where() }
  if (document.body) ready(); else document.addEventListener('DOMContentLoaded', ready)
})()
