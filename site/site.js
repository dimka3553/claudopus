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
        // the head is the middle of the stage: a card over it is moved out to the nearer side
        for (const a of fronts) { const off = a.x - w / 2, clear = w * 0.17 + a.bw / 2; if (Math.abs(off) < clear && Math.abs(a.y - h * 0.42) < h * 0.16) a.x = w / 2 + (off < 0 ? -clear : clear) }
        for (let pass = 0; pass < 4; pass++) for (const a of fronts) for (const b of fronts) {
          if (a === b || a.y > b.y) continue
          const dx = (a.bw + b.bw) / 2 + 6 - Math.abs(a.x - b.x), dy = (a.bh + b.bh) / 2 + 6 - (b.y - a.y)
          if (dx > 0 && dy > 0) { a.y -= dy / 2; b.y += dy / 2 }
        }
        for (const a of spots) {
          a.el.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px) scale(${a.s.toFixed(3)})`
          a.el.style.zIndex = a.front ? 3 : 0
          a.el.style.opacity = a.front ? 1 : 0
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

  // ---- the first screen's example: what you type in the chat, then the real panel after it, one step at a time ----
  const example = $('#stage')
  if (example) {
    const shots = $$('.stage-shots img', example), keys = $$('.stage-steps button', example)
    const cap = $('.stage-cap', example), typed = $('.typed', example), tap = $('.tap', example)
    let timers = [], auto = !still.matches, inView = false, held = false, due = -1
    const later = (ms, fn) => timers.push(setTimeout(fn, ms))
    const halt = () => { timers.forEach(clearTimeout); timers = []; due = -1 }
    const mark = key => { keys.forEach(k => { k.classList.toggle('is-on', k === key); k.setAttribute('aria-pressed', k === key) }); cap.textContent = key.dataset.cap }
    const show = key => shots.forEach(img => img.classList.toggle('is-on', img.dataset.shot === key.dataset.shot))
    // a step shown at once, as a press on its number asks for, with its words typed out already
    const jump = i => { halt(); typed.textContent = (keys[i].dataset.say || '').split('|').pop(); mark(keys[i]); show(keys[i]) }
    // a step played: its words are typed first, the panel answers, and where you press shows a beat before the next step
    const play = i => {
      halt()
      const key = keys[i], lines = (key.dataset.say || '').split('|').filter(Boolean)
      let at = 0
      mark(key); typed.textContent = ''
      if (!lines.length) show(key)
      lines.forEach((line, n) => {
        for (let c = 1; c <= line.length; c++) later(at += 32, () => { typed.textContent = line.slice(0, c) })
        later(at += 500, () => { typed.textContent = ''; if (n === lines.length - 1) show(key) })
      })
      const [x, y] = (key.dataset.tap || '').split(',').map(Number)
      if (key.dataset.tap) later(at += 3200, () => { tap.style.left = x + '%'; tap.style.top = y + '%'; tap.classList.remove('is-on'); void tap.offsetWidth; tap.classList.add('is-on') })
      later(at += key.dataset.tap ? 700 : 3400, () => { due = (i + 1) % keys.length; if (!held) play(due) })
    }
    // it starts from the step the page shows by itself, so the first thing to move is the panel, not a line typed over it
    const shown = () => Math.max(0, keys.findIndex(k => k.classList.contains('is-on')))
    const go = () => { if (!auto || !inView) halt(); else if (due < 0 && !timers.length) play(shown()) }
    keys.forEach((key, i) => key.addEventListener('click', () => { auto = false; jump(i) }))
    // it waits while the pointer rests on it or a key in it has the focus, then goes on from where it stood
    const hold = on => { held = on; if (!on && auto && due >= 0) play(due) }
    example.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hold(true) })
    example.addEventListener('pointerleave', () => hold(false))
    example.addEventListener('focusin', () => hold(true))
    example.addEventListener('focusout', () => hold(false))
    seen(example, visible => { inView = visible; go() }, 0.3)
    still.addEventListener?.('change', () => { auto = !still.matches; if (auto) go(); else jump(shown()) })
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
