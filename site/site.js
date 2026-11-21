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
        ['Move the docs', 'Waiting for you', 'ask'], ['Run the tests', '31 of 42 tests'], ['Tidy the emails', 'To-do 2 of 3'],
        ['Find the leak', 'To-do 1 of 3'], ['Review the code', 'Reading files'], ['Update the docs', 'To-do 3 of 5'],
        ['Speed up export', 'To-do 2 of 4'], ['Release notes', '✓ Done', 'done'],
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
        octo.draw({ t, yaw, pitch, zoom: 1.05, color: mood, look: [px, py] })
        const w = stage.clientWidth, h = stage.clientHeight
        // each card sits at its arm's tip; the far ones are smaller and dimmer
        const spots = octo.tips.map((p, i) => {
          const el = tips[i], front = p.near >= 1, s = Math.max(0.6, Math.min(1.1, 1 + (p.near - 1) * 1.6))
          return { el, front, s, bw: el.offsetWidth * s, bh: el.offsetHeight * s, x: p.x * w, y: p.y * h }
        })
        const fronts = spots.filter(a => a.front), backs = spots.filter(a => !a.front)
        // the head is the middle of the stage: a card over it is moved out to the nearer side
        for (const a of fronts) { const off = a.x - w / 2, clear = w * 0.2 + a.bw / 2; if (Math.abs(off) < clear && Math.abs(a.y - h * 0.42) < h * 0.19) a.x = w / 2 + (off < 0 ? -clear : clear) }
        // the cards of each kind are then moved apart, so none covers another
        for (const group of [fronts, backs]) for (let pass = 0; pass < 4; pass++) for (const a of group) for (const b of group) {
          if (a === b || a.y > b.y) continue
          const dx = (a.bw + b.bw) / 2 + 6 - Math.abs(a.x - b.x), dy = (a.bh + b.bh) / 2 + 6 - (b.y - a.y)
          if (dx > 0 && dy > 0) { a.y -= dy / 2; b.y += dy / 2 }
        }
        // no card leaves the stage, so none lies over the words beside it or is cut by the window
        for (const a of spots) { a.x = Math.max(a.bw / 2, Math.min(w - a.bw / 2, a.x)); a.y = Math.max(a.bh / 2, Math.min(h - a.bh / 2, a.y)) }
        // a far card shows only on a stage wide enough to read it, where it stands clear of the head and of the cards in front
        const over = (a, b, gap) => Math.abs(a.x - b.x) < (a.bw + b.bw) / 2 + gap && Math.abs(a.y - b.y) < (a.bh + b.bh) / 2 + gap
        const head = { x: w / 2, y: h * 0.44, bw: w * 0.42, bh: h * 0.46 }
        for (const a of spots) {
          a.el.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px) scale(${a.s.toFixed(3)})`
          a.el.style.zIndex = a.front ? 3 : 2
          a.el.style.filter = a.front ? '' : 'brightness(.55)'
          a.el.style.opacity = a.front || (w >= 520 && !over(a, head, 0) && !fronts.some(b => over(a, b, 4))) ? 1 : 0
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
