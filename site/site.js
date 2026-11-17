// claudopus.ai: what moves on the pages. Every part looks for its own element and does nothing where it is missing.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const still = matchMedia('(prefers-reduced-motion: reduce)')
  const seen = (el, fn, threshold = 0.25) => new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold }).observe(el)

  // The flat octopus drawings are the mod's own. They hold still when motion is not wanted.
  const settle = () => $$('svg.octo').forEach(svg => {
    if (!svg.pauseAnimations) return
    if (still.matches) { svg.pauseAnimations(); svg.setCurrentTime(0) } else svg.unpauseAnimations()
  })
  settle(); still.addEventListener?.('change', settle)
  const cheer = spot => {
    const happy = spot && $('.octo.happy', spot)
    if (!happy) return
    spot.classList.add('is-happy'); happy.setCurrentTime(0)
    clearTimeout(spot.timer)
    spot.timer = setTimeout(() => spot.classList.remove('is-happy'), 2500)
  }

  // ---- the 3D octopus: eight arms, a task on each ----
  const stage = $('#hero3d')
  if (stage && window.createOcto) {
    const canvas = $('canvas', stage), octo = createOcto(canvas)
    if (octo) {
      stage.classList.add('is-3d')
      // arms are numbered round the body; the first and the last face you at rest, so the question and the finish sit there
      const TASKS = [
        ['Move the docs', 'Needs you', 'ask'], ['Run the tests', '1,240 tests'], ['Tidy the emails', 'Step 2 of 3'],
        ['Find the leak', 'Step 1 of 3'], ['Review the code', 'Reading 14 files'], ['Update the docs', 'Step 3 of 5'],
        ['Speed up export', 'Step 2 of 4'], ['Release notes', '✓ Finished', 'done'],
      ]
      const tips = TASKS.map(([title, line, kind]) => {
        const el = document.createElement('div')
        el.className = 'tip' + (kind ? ' ' + kind : '')
        el.setAttribute('aria-hidden', 'true')
        el.innerHTML = '<b></b><span></span>'
        el.firstChild.textContent = title; el.lastChild.textContent = line
        stage.append(el)
        return el
      })
      let px = 0, py = 0, yaw = -0.2, pitch = 0.34, on = false, raf = 0
      const frame = now => {
        const t = now / 1000
        yaw += ((-0.2 + px * 0.5 + Math.sin(t * 0.3) * 0.22) - yaw) * 0.06
        pitch += ((0.34 + py * 0.16) - pitch) * 0.06
        const mood = (t % 16) > 13.5 ? '#4EBA65' : '#8A63F0'
        octo.draw({ t, yaw, pitch, zoom: 0.9, color: mood, look: [px, py] })
        const w = stage.clientWidth, h = stage.clientHeight
        // each card sits at its arm's tip; the ones in front are then moved apart so none covers another
        const spots = octo.tips.map((p, i) => {
          const el = tips[i], front = p.near >= 1, s = Math.max(0.6, Math.min(1.1, 1 + (p.near - 1) * 1.6))
          const bw = el.offsetWidth * s, bh = el.offsetHeight * s
          return { el, front, s, bw, bh, x: Math.max(bw / 2, Math.min(w - bw / 2, p.x * w)), y: p.y * h }
        })
        const fronts = spots.filter(a => a.front)
        for (let pass = 0; pass < 4; pass++) for (const a of fronts) for (const b of fronts) {
          if (a === b || a.y > b.y) continue
          const dx = (a.bw + b.bw) / 2 + 6 - Math.abs(a.x - b.x), dy = (a.bh + b.bh) / 2 + 6 - (b.y - a.y)
          if (dx > 0 && dy > 0) { a.y -= dy / 2; b.y += dy / 2 }
        }
        for (const a of spots) {
          a.el.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px) scale(${a.s.toFixed(3)})`
          a.el.style.zIndex = a.front ? 3 : 0
          a.el.style.opacity = a.front ? 1 : w < 480 ? 0 : 0.4
        }
        if (on && !still.matches) raf = requestAnimationFrame(frame)
      }
      canvas.style.zIndex = 1; canvas.style.pointerEvents = 'none'
      addEventListener('pointermove', e => {
        const box = stage.getBoundingClientRect()
        px = Math.max(-1, Math.min(1, (e.clientX - box.left - box.width / 2) / (innerWidth / 2)))
        py = Math.max(-1, Math.min(1, (e.clientY - box.top - box.height / 2) / (innerHeight / 2)))
      }, { passive: true })
      const go = visible => { on = visible; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(frame) }
      seen(stage, go, 0.05)
      still.addEventListener?.('change', () => go(on))
      frame(still.matches ? 0 : performance.now())
    }
  }

  // ---- the race: both lanes on one clock, so the difference is the picture ----
  const race = $('#race')
  if (race) {
    const lanes = $$('.lane', race).map(el => ({ el, end: Math.max(...$$('.work', el).map(i => +i.style.getPropertyValue('--b'))) }))
    const RUN = 7000, HOLD = 3200
    let start = 0, raf = 0, on = false
    const paint = clock => { race.style.setProperty('--clock', clock.toFixed(2)); lanes.forEach(l => l.el.classList.toggle('is-done', clock >= l.end)) }
    const tick = now => {
      if (!start) start = now
      const at = (now - start) % (RUN + HOLD)
      paint(Math.min(100, at / RUN * 100))
      if (on) raf = requestAnimationFrame(tick)
    }
    race.classList.add('is-live')
    const go = visible => { on = visible && !still.matches; cancelAnimationFrame(raf); if (on) { start = 0; raf = requestAnimationFrame(tick) } else paint(100) }
    seen(race, go, 0.4)
    still.addEventListener?.('change', () => go(true))
    paint(100)
  }

  // ---- the panel drawing: two tasks move on a step, then it starts over ----
  const live = $('#live')
  if (live) {
    const first = Object.fromEntries($$('[data-s]', live).map(el => [el.dataset.s, el.innerHTML]))
    const set = (key, html) => { const el = $(`[data-s="${key}"]`, live); if (el) el.innerHTML = html }
    const story = [
      [2600, () => { set('b-now', '1,240 of 1,240 tests pass; I am reading the three slowest.'); set('b-count', '2 of 3 done'); set('b-step', 'Step 3 of 3 · <b>Report the slow ones</b>') }],
      [2600, () => { set('a-now', 'Rows are streamed now: 6 s for 2 million rows. I am running the export tests.'); set('a-count', '2 of 4 done'); set('a-step', 'Step 3 of 4 · <b>Run the export tests</b>') }],
      [3400, () => { set('a-count', '3 of 4 done'); set('a-step', 'Step 4 of 4 · <b>Have a second Claude check it</b>'); set('a-now', 'The tests pass. A second Claude is looking for what is wrong.') }],
      [4200, () => Object.entries(first).forEach(([key, html]) => set(key, html))],
    ]
    let at = 0, next = 0
    const step = () => { const [wait, act] = story[at]; next = setTimeout(() => { act(); at = (at + 1) % story.length; step() }, wait) }
    const go = visible => { clearTimeout(next); if (visible && !still.matches) step() }
    seen(live, go)
  }

  // ---- the film waits for a press and never starts by itself; chapters jump into it ----
  const film = $('#film'), play = $('#play')
  if (film && play) {
    film.controls = false; play.hidden = false
    const begin = at => { play.hidden = true; film.controls = true; if (at != null) film.currentTime = at; film.focus({ preventScroll: true }); film.play()?.catch(() => {}) }
    play.addEventListener('click', () => begin())
    $$('[data-at]').forEach(b => b.addEventListener('click', () => { film.scrollIntoView({ block: 'center', behavior: still.matches ? 'auto' : 'smooth' }); begin(+b.dataset.at) }))
  }

  // ---- copy buttons ----
  const said = $('#said')
  $$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const text = button.dataset.copy
    let copied = true
    try { await navigator.clipboard.writeText(text) } catch {
      const area = Object.assign(document.createElement('textarea'), { value: text })
      area.style.cssText = 'position:fixed;opacity:0'; document.body.append(area); area.select()
      try { copied = document.execCommand('copy') } catch { copied = false }
      area.remove()
    }
    clearTimeout(button.timer)
    if (!copied) {
      getSelection().selectAllChildren(button.previousElementSibling)
      button.classList.add('is-failed'); if (said) said.textContent = 'It could not be copied. The line is selected, so copy it with your keyboard.'
      button.timer = setTimeout(() => { button.classList.remove('is-failed'); if (said) said.textContent = '' }, 3000)
      return
    }
    button.classList.add('is-copied'); if (said) said.textContent = 'Copied: ' + text
    cheer($('#copy-octo'))
    button.timer = setTimeout(() => { button.classList.remove('is-copied'); if (said) said.textContent = '' }, 2000)
  }))
})()
