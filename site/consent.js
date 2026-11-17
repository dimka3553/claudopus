// claudopus.ai: the cookie choice, and Microsoft Clarity only after Accept. Its own styles come with it, so any page that has the
// design system's tokens can load it with one script line. Decline, or no choice yet, loads nothing from Clarity.
(() => {
  const CLARITY = 'zf37u6fd0e'
  const KEY = 'claudopus-cookies'
  // each copy key counts as its own event in Clarity, named by the line it copies
  const COPY = {
    '/plugin marketplace add dimka3553/claudopus': 'copy_marketplace_add',
    '/plugin install claudopus@claudopus': 'copy_install',
    '/claudopus': 'copy_open_panel',
    'claude plugin marketplace add dimka3553/claudopus': 'copy_terminal_marketplace_add',
    'claude plugin install claudopus@claudopus': 'copy_terminal_install',
  }

  const load = () => { try { return localStorage.getItem(KEY) } catch { return null } }
  const save = value => { try { localStorage.setItem(KEY, value) } catch {} }
  let choice = load()

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
  const stop = () => {
    if (!window.clarity) return
    clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' })
    clarity('consent', false)
  }
  const count = name => { if (choice === 'accept' && window.clarity) clarity('event', name) }

  document.addEventListener('click', e => {
    const copy = e.target.closest?.('[data-copy]')
    if (copy) { count(COPY[copy.dataset.copy] || 'copy_other'); return }
    const link = e.target.closest?.('a[href]')
    if (link && /^https:\/\/github\.com\//.test(link.href)) count('click_github')
  }, true)

  // ---- the banner ----
  const style = document.createElement('style')
  style.textContent = `
.cookies{position:fixed;z-index:50;left:var(--s6);bottom:var(--s6);max-width:400px;display:grid;gap:var(--s3);padding:var(--s4);
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
  box.innerHTML = '<p><b>May we count visits?</b> With your yes, Microsoft Clarity records clicks, scrolling and which commands you copy, and sets cookies. <a href="privacy.html">Privacy</a></p>'
    + '<div class="row"><button type="button" class="yes">Accept</button><button type="button" class="no">Decline</button></div>'
  box.hidden = true
  const show = () => { box.hidden = false; box.querySelector('.yes').focus({ preventScroll: true }) }
  const decide = value => {
    const was = choice
    choice = value; save(value); box.hidden = true
    if (value === 'accept') start(); else if (was === 'accept') stop()
    document.dispatchEvent(new CustomEvent('cookies', { detail: value }))
  }
  box.querySelector('.yes').addEventListener('click', () => decide('accept'))
  box.querySelector('.no').addEventListener('click', () => decide('decline'))
  document.addEventListener('click', e => { if (e.target.closest?.('[data-cookies]')) { e.preventDefault(); show() } })
  window.claudopusCookies = { get: () => choice, set: decide, show }

  const ready = () => { document.body.append(box); if (choice === 'accept') start(); else if (choice !== 'decline') box.hidden = false }
  if (document.body) ready(); else document.addEventListener('DOMContentLoaded', ready)
})()
