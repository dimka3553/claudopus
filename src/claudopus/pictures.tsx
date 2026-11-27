// Pictures a piece of work made, drawn in its chat where it made them

// ---- Pictures a piece of work made, drawn in its chat where it made them ----

// How many of a chat's newest pictures are drawn small; older ones are a row that opens them. The small copy's widest side
const CHAT_THUMBS = 6
// The most pictures one chat shows
const PICS_LISTED = 40
const CHAT_THUMB_SIZES = ['360', '280']
// How tall an upright small copy is drawn at most, in the panel's pixels: a tall screenshot is drawn narrower, not longer
const PIC_TALL = 200
// The most characters a picture drawn as it is, an SVG of the work's own, may have
const SVG_CHARS = 100_000
type Pic = { name: string; path: string; thumb: Thumb; isGone?: boolean }
// A press opens the picture whole in the Mac's own viewer (Preview for a photo or screenshot), a window of its own as large as the
// screen allows, which can go full screen and closes as any window does: the panel is only a sidebar wide. A chat the app runs on
// another Mac over ssh has its engine, and so `open`, on this Mac, where nobody looks: Preview opened on its screen (seen on the
// M4). There the picture is drawn large in the Details tab it was pressed in, which the app draws on the screen the person is at,
// over its Details, with a row back to them: no tab is opened, closed or opened again. 0.2.46 to 0.2.50 opened a picture tab of its
// own, which from a Details tab closed the tab pressed in and opened it again so it let go of the keyboard: that tab came back drawn
// afresh, its chat at its end and slow to scroll, and the picture's tab stayed behind it (seen on 0.2.49 in a helper's Details)
const showPicture = async ($: EngineInterface, path: string, pane: string, row: string, surface?: RenderSurface) => {
  if (surface === 'terminal' && (termFrom || isRunFromAfar || !hasDesktop)) return sendPicture($, path)
  if (isRunFromAfar) return showPictureIn($, path, pane, row)
  const opened = await openOn($, path)
  if (opened.exitCode !== 0) await log($, `picture ${path} not opened: ${opened.stderr}`)
}
// A terminal draws no picture worth looking at (a few blurred pixels a cell), so there a picture is a row that is pressed: on the
// Mac the person is at it opens in the Mac's own viewer, as above. In a terminal reached over ssh the person is at another
// device, where nothing here can open a window: the picture is sent to that device, by Tailscale's file sending when both are on
// one tailnet (it lands in its Downloads), else the row gives the one command that fetches and opens it there. Set as the chat
// starts from SSH_CONNECTION: the device the terminal is watched from, and this Mac as that device reaches it
let termFrom = ''
let termHere = ''
let termPort = ''
// What the last press on a picture came to, by its path, said under its row
const pictureSaid = new Map<string, { text: string; copy?: string }>()
const TAILSCALES = ['tailscale', '/Applications/Tailscale.app/Contents/MacOS/Tailscale', 'C:/Program Files/Tailscale/tailscale.exe']
const shQuoted = (text: string) => `'${text.replaceAll("'", "'\\''")}'`
const sendPicture = async ($: EngineInterface, path: string) => {
  const say = (text: string, copy?: string) => (pictureSaid.size > 100 && pictureSaid.clear(), pictureSaid.set(path, { text, copy }), drawAgain($))
  // A terminal with no word of where it is watched from: where the picture is, and no more
  if (!termFrom) return say(`It’s at ${path} on ${thisMac()}.`)
  say('Sending it to your device…')
  for (const bin of TAILSCALES) {
    const targets = await runOn($, [bin, 'file', 'cp', '--targets'], { timeoutMs: 8_000 }).catch(() => undefined)
    if (!targets || targets.exitCode !== 0) continue
    // Each line a device: its address, its name, and a word when it is not reachable now
    const [, name = '', ...state] = targets.stdout.split('\n').map(line => line.trim().split(/\s+/)).find(parts => parts[0] === termFrom) ?? []
    if (!name || state.join(' ').startsWith('offline')) break
    const sent = await runOn($, [bin, 'file', 'cp', path, `${termFrom}:`], { timeoutMs: 60_000 }).catch(err => ({ exitCode: 1, stderr: String(err) }))
    if (sent.exitCode === 0) return say(`✓ Claudopus sent it to ${name} with Tailscale. It’s in Downloads there.`)
    await log($, `picture ${path} not sent to ${termFrom}: ${sent.stderr}`)
    break
  }
  // (Windows names the person in USERNAME)
  const user = (isWindows ? await $.env.get('USERNAME') : await $.env.get('USER')) ?? ''
  const port = termPort && termPort !== '22' ? `-P ${termPort} ` : ''
  const command = `scp ${port}${shQuoted(`${user ? `${user}@` : ''}${termHere.includes(':') ? `[${termHere}]` : termHere}:${path}`)} ~/Downloads/ && open ~/Downloads/${shQuoted(fileName(path))}`
  say(`Run this on ${isWindows ? 'your device' : 'your Mac'} to open it there:`, command)
}
// Under a picture's row in the terminal: what its press came to, with the command to copy when there is one
const pictureSaidRow = ($: EngineInterface, ui: Ui, key: string, path: string) => {
  const said = pictureSaid.get(path)
  if (!said) return null
  return (
    <ui.Box key={key} flexDirection="column" paddingLeft={3}>
      <ui.Text dimColor wrap="wrap">{said.text}</ui.Text>
      {said.copy ? <ui.Text wrap="wrap">{said.copy}</ui.Text> : null}
      {said.copy ? <ui.Button key={`${key}-copy`} label="Copy the command" plain onPress={press => void $.ui.copy({ text: said.copy ?? '', surface: press.surface }).catch(err => log($, `copy not made: ${String(err)}`))} /> : null}
    </ui.Box>
  )
}
// The picture tab of 0.2.46 to 0.2.50: one still open after an update says that pictures open in Details now
const PICTURE_PANE = 'picture'
const pictureShown = ''
// The picture each Details tab draws large over its Details, by the tab, and the row it was pressed on, which Back brings into view
const pictureIn = new Map<string, { path: string; row: string }>()
const showPictureIn = async ($: EngineInterface, path: string, pane: string, row: string) => {
  pictureIn.set(pane, { path, row })
  // One that could not be made is tried again on a new press
  for (const [id, one] of larges) if (!one && id.startsWith(`${path}:`)) larges.delete(id)
  drawAgain($)
  // To its top, now and again once the picture is likely drawn in place of the Details
  await $.ui.scroll({ in: pane, to: 'start', block: 'start' }).catch(() => undefined)
  $.clock.after(150, () => void $.ui.scroll({ in: pane, to: 'start', block: 'start' }).catch(() => undefined))
}
// Brings a row into view once it is drawn: a redraw over ssh can take a while to reach the app, so a row not drawn yet is tried again
const scrollTo = ($: EngineInterface, pane: string, key: string, tries: number) =>
  $.clock.after(150, async () => {
    if (pictureIn.has(pane)) return
    const moved = await $.ui.scroll({ in: pane, to: { key }, block: 'center' }).catch(err => ({ deny: String(err) }))
    if (moved && 'deny' in moved && moved.deny && tries > 1) scrollTo($, pane, key, tries - 1)
  })
const pictureBack = ($: EngineInterface, pane: string) => {
  const was = pictureIn.get(pane)
  pictureIn.delete(pane)
  drawAgain($)
  // Once the Details are drawn again, the picture's row is brought into view, where the person was
  if (was?.row) scrollTo($, pane, was.row, 6)
}
// The large copy the tab draws, as wide as a wide sidebar on a sharp screen. An Svg carries at most 131072 characters, too few for
// a large screenshot to stay readable, so the copy is cut into bands across, each an Svg of its own drawn under the one before.
// The whole copy fits in one drawing the app accepts (262144 characters): a size that needs more gives way to a lower JPEG quality,
// then a narrower one. 0.2.46 to 0.2.55 let it reach 600000, which the app threw away, so the tab stayed on "Making a large copy"
// and went blank once left and come back to. A picture with see-through parts keeps them as PNG, else JPEG
const LARGE_SIZES: [number, number][] = [
  [2000, 70],
  [1400, 70],
  [1400, 55],
  [1000, 70],
  [1000, 55],
  [800, 60],
  [600, 60],
]
const LARGE_CHARS = 130_000
const LARGE_TOTAL = 200_000
type Large = { bands: string[]; width: number; height: number } | null
const larges = new Map<string, Large>()
const making = new Map<string, Promise<Large>>()
let largeMade = 0
const makeLarge = async ($: EngineInterface, path: string, size: number): Promise<Large> => {
  if (/\.svg$/i.test(path)) {
    if (size > LARGE_CHARS * 2) return null
    const text = await readOr($, path)
    const from = text.indexOf('<svg')
    return from >= 0 && text.length - from <= LARGE_CHARS ? { bands: [text.slice(from)], width: 0, height: 0 } : null
  }
  if (!RASTER.test(path)) return null
  const got = await runOn($, [sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'hasAlpha', path]).catch(() => ({ exitCode: 1, stdout: '' }))
  const width = Number(/pixelWidth:\s*(\d+)/.exec(got.stdout)?.[1] ?? 0)
  const height = Number(/pixelHeight:\s*(\d+)/.exec(got.stdout)?.[1] ?? 0)
  if (!width || !height) return null
  // A picture with see-through parts is tried as PNG first, which keeps them, then as JPEG, which a window screenshot's shadow
  // edges need to fit
  const formats = /hasAlpha:\s*yes/.test(got.stdout) ? (['png', 'jpeg'] as const) : (['jpeg'] as const)
  largeMade += 1
  const base = `${dir}/thumbs/large-${Math.round(await $.clock.now())}-${largeMade}`
  await runOn($, ['mkdir', '-p', `${dir}/thumbs`])
  try {
    // Each size once: a picture narrower than a width is taken at its own width
    const sizes = [...new Map(LARGE_SIZES.map(([w, quality]) => [`${Math.min(w, width)}:${quality}`, [Math.min(w, width), quality] as const])).values()]
    for (const format of formats)
    for (const [most, quality] of format === 'png' ? [...new Map(sizes.map(([w]) => [w, [w, 0] as const])).values()] : sizes) {
      // The picture at this width, then cut into bands down it, each as tall as fits
      const wide = `${base}-${most}.png`
      const sized = await runOn($, [sips($), '--resampleWidth', String(most), '-s', 'format', 'png', path, '--out', wide]).catch(() => ({ exitCode: 1 }))
      if (sized.exitCode !== 0) continue
      const tall = Number(/pixelHeight:\s*(\d+)/.exec((await runOn($, [sips($), '-g', 'pixelHeight', wide]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
      if (!tall) continue
      // sips crops only a band that neither starts at the top nor reaches the bottom (one that does comes out centred, or whole),
      // so the picture is given a row above and below first, and each band is cut one row down
      const padded = await runOn($, [sips($), '--padToHeightWidth', String(tall + 2), String(most), wide]).catch(() => ({ exitCode: 1 }))
      if (padded.exitCode !== 0) continue
      const bands: string[] = []
      let band = Math.min(tall, 400)
      let total = 0
      let isTooMany = false
      for (let y = 0; y < tall; ) {
        const rows = Math.min(band, tall - y)
        const out = `${base}-band.${format === 'png' ? 'png' : 'jpg'}`
        await runOn($, [sips($), '-c', String(rows), String(most), '--cropOffset', String(y + 1), '0', '-s', 'format', format, ...(format === 'jpeg' ? ['-s', 'formatOptions', String(quality)] : []), wide, '--out', out])
        const cutTo = Number(/pixelHeight:\s*(\d+)/.exec((await runOn($, [sips($), '-g', 'pixelHeight', out]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
        const read = cutTo === rows ? ((await $.fs.read(out, { as: 'bytes' }).catch(() => undefined)) as { base64: string } | undefined) : undefined
        const source = read ? `<svg xmlns="http://www.w3.org/2000/svg" width="${most}" height="${rows}" viewBox="0 0 ${most} ${rows}"><image href="data:image/${format};base64,${read.base64}" width="${most}" height="${rows}"/></svg>` : ''
        if (!source) break
        if (source.length > LARGE_CHARS) {
          if (rows <= 16) break
          band = Math.max(16, Math.floor((rows * LARGE_CHARS * 0.9) / source.length))
          continue
        }
        // The whole copy, this band too, fits in one drawing, else this size is too large
        total += source.length
        if (total > LARGE_TOTAL) {
          isTooMany = true
          break
        }
        bands.push(source)
        y += rows
      }
      if (!isTooMany && bands.length) {
        const whole = bands.reduce((sum, one) => sum + Number(/height="(\d+)"/.exec(one)?.[1] ?? 0), 0)
        if (whole >= tall) return { bands, width, height }
      }
    }
    return null
  } finally {
    await runOn($, ['sh', '-c', 'rm -f "$1"-*', 'sh', base]).catch(() => undefined)
  }
}
// The large copy as made, else nothing yet: it is made once, out of the drawing, which is drawn again when it is ready. One that
// cannot be made is kept as such, so it is not tried again at every drawing, only at the next press of its row
const largeOf = ($: EngineInterface, path: string, id: string): Large | undefined => {
  if (larges.has(id)) return larges.get(id) ?? null
  if (!making.has(id))
    making.set(
      id,
      makeLarge($, path, Number(id.split(':').pop()) || 0)
        .catch(err => (void log($, `large copy of ${path} not made: ${String(err)}`), null))
        .then(one => {
          if (larges.size >= 6) larges.delete(larges.keys().next().value ?? '')
          larges.set(id, one)
          making.delete(id)
          drawAgain($)
          return one
        }),
    )
  return undefined
}
// What the tab draws: the picture as wide as the tab, its name and size, and how to see it larger
const pictureView = async ($: EngineInterface, e: Parameters<EngineInterface['ui']['resolve']>[0], path = pictureShown) => {
  const ui = uiOf($, e)
  if (!path) return <ui.Text dimColor>Pictures now open in the Details tab where you press them. You can close this tab.</ui.Text>
  const name = fileName(path)
  const stat = await $.fs.stat(path).catch(() => undefined)
  const said = (text: string) => (
    <ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Text dimColor wrap="wrap">{text}</ui.Text>
    </ui.Box>
  )
  if (!stat || stat.kind !== 'file') return said('This picture is no longer available.')
  if (e.surface === 'terminal') {
    // The terminal draws no picture: a row that opens it where the person is, and what that came to
    return (
      <ui.Box flexDirection="column" width="100%">
        <ui.Button key={`large-open-${path}`} label={`Open ${name}`} plain hotkey="o" onPress={press => void showPicture($, path, '', '', press.surface)} />
        {pictureSaidRow($, ui, 'large-said', path)}
      </ui.Box>
    )
  }
  if (!('Svg' in ui)) return said(`This screen can’t show pictures. It’s at ${path}.`)
  const large = largeOf($, path, `${path}:${stat.mtimeMs}:${stat.size}`)
  if (large === undefined) return said('Making a large copy…')
  if (!large) return said(`Claudopus couldn’t show this picture. Press its row to try again. It’s at ${path}.`)
  return (
    <ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Box flexDirection="column" width="100%">
        {large.bands.map((band, n) => (
          <ui.Svg key={`large-${n}`} source={band} alt={`Picture: ${name}${large.bands.length > 1 ? `, part ${n + 1} of ${large.bands.length}` : ''}`} />
        ))}
      </ui.Box>
      <ui.Text dimColor wrap="wrap">{`${large.width ? `${large.width} × ${large.height} · ` : ''}drag the sidebar's edge to make it wider`}</ui.Text>
    </ui.Box>
  )
}
const pics = new Map<string, Pic | null>()
const PICS_HELD = 60
let isThumbsCleared = false
// Each Details tab's pictures by step number, as last looked for, by the work
const shots = new Map<string, { key: string; shots: Map<number, Pic[]> }>()
// One picture as the chat shows it: where it is now (the copy a report kept, once the temporary file is gone) and its small copy.
// Nothing for a file a command only named that was there before the work began
const picOf = async ($: EngineInterface, given: string, one: Todo, isSeen: boolean, kept: Report[], isDrawn: boolean): Promise<Pic | null> => {
  const asked = isAbsPath(given) ? slashed(given) : `${cwd}/${given}`
  const stat = await $.fs.stat(asked).catch(() => undefined)
  const copy = kept.filter(r => r.agent === one.id).flatMap(r => r.files.filter(file => fileName(file) === fileName(asked)).map(file => `${reportPath(r)}/${file}`))[0]
  if (!stat || stat.kind !== 'file') return copy && !isSeen ? picOf($, copy, one, false, [], isDrawn) : isSeen ? null : { name: fileName(asked), path: '', thumb: null, isGone: true }
  if (isSeen && stat.mtimeMs < one.startedAt - 5000) return null
  const id = `${asked}:${stat.mtimeMs}:${isDrawn}`
  if (pics.has(id)) return pics.get(id) ?? null
  let thumb: Thumb = null
  if (isDrawn && /\.svg$/i.test(asked) && stat.size <= SVG_CHARS) {
    const text = await readOr($, asked)
    const from = text.indexOf('<svg')
    if (from >= 0) thumb = { source: text.slice(from), width: 0, height: 0 }
  } else if (isDrawn && RASTER.test(asked)) {
    const to = `${dir}/thumbs/${slug(asked).slice(-60)}-${mark(asked).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
    if (!(await $.fs.exists(to))) {
      await runOn($, ['mkdir', '-p', `${dir}/thumbs`])
      for (const size of CHAT_THUMB_SIZES) {
        await runOn($, [sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '60', asked, '--out', to])
        if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= THUMB_BYTES) break
      }
    }
    thumb = await thumbOf($, to)
  }
  const pic = { name: fileName(asked), path: asked, thumb }
  // Only the pictures looked at lately are held
  if (pics.size >= PICS_HELD) pics.delete(pics.keys().next().value ?? '')
  pics.set(id, pic)
  return pic
}
// The pictures of a chat's shown lines, each at the last step that made it, by that step's number; the newest few drawn small
const picturesIn = async ($: EngineInterface, lines: Line[], one: Todo, kept: Report[], canDraw: boolean) => {
  // Small copies not looked at for two weeks are cleared, once a load
  if (!isThumbsCleared) {
    isThumbsCleared = true
    await runOn($, ['find', `${dir}/thumbs`, '-name', '*.jpg', '-mtime', '+14', '-delete']).catch(() => undefined)
  }
  const last = new Map<string, { at: number; isSeen: boolean }>()
  // Steps are numbered as the chat numbers them, and only the lines it shows count
  let uses = 0
  for (const line of newest(lines.map(one => ({ ...one, at: one.isUse ? (uses += 1) : uses }))))
    for (const [list, isSeen] of [
      [line.pictures ?? [], false],
      [line.seen ?? [], true],
    ] as const)
      for (const path of list) {
        // A picture made again is placed at its newest step
        const was = last.get(path)
        last.delete(path)
        last.set(path, { at: line.at ?? 0, isSeen: isSeen && was?.isSeen !== false })
      }
  // The newest pictures alone are looked at: a chat that made very many keeps its last ones
  const order = [...last.entries()].slice(-PICS_LISTED)
  const byStep = new Map<number, Pic[]>()
  let drawnCount = 0
  // The small copies together keep the tab's drawing under what the app accepts; one past that is a row that opens it
  let drawnChars = 0
  for (const [path, { at, isSeen }] of order.reverse()) {
    const found = await picOf($, path, one, isSeen, kept, canDraw && drawnCount < CHAT_THUMBS).catch(() => null)
    if (!found) continue
    const pic = found.thumb && drawnChars + found.thumb.source.length > PICTURES_CHARS ? { ...found, thumb: null } : found
    if (pic.thumb) (drawnCount += 1), (drawnChars += pic.thumb.source.length)
    byStep.set(at, [pic, ...(byStep.get(at) ?? [])])
  }
  return byStep
}
// Reads a work's chat, and finds the pictures it made, for its Details tab, then draws the tab again. Called from the drawing, it
// runs after it: the chat is read again when the work has made a step, ended a response, been steered or ended, and its pictures
// looked for again when its chat or the reports change. One read of a work runs at a time; the next drawing reads what came since
const loading = new Set<string>()
// A chat the app would not give is asked for again after this long, at the tab's next drawing, never sooner
const RETRY_READ = 15_000
const loadWork = async ($: EngineInterface, id: string) => {
  if (loading.has(id)) return
  loading.add(id)
  let isChanged = false
  try {
    const one = (await read($, todos)).find(card => card.id === id)
    if (!one) return
    const mark = talkMarks.get(id) ?? 0
    const key = [one.id, one.steps, one.tokens, one.entries.length, one.entries.filter(entry => entry.readAt).length, one.status, mark].join(':')
    const kept = await read($, reports)
    const shotsKey = `${key}:${kept.length}`
    const now = await $.clock.now()
    const was = talks.get(id)
    if (was?.key !== key || (!was.lines && now - (was.at ?? 0) >= RETRY_READ)) {
      during('read a task for its Details')
      const rows = await $.session.messages({ agentId: id }).catch(() => undefined)
      talks.set(id, { key, lines: Array.isArray(rows) ? withSteers(talkOf(rows), one.entries) : undefined, at: now })
      if (Array.isArray(rows)) liveCaughtUp(id, mark, now)
      isChanged = true
    }
    const lines = talks.get(id)?.lines
    if (lines && shots.get(id)?.key !== shotsKey) {
      shots.set(id, { key: shotsKey, shots: await picturesIn($, lines, one, kept, true).catch(() => new Map<number, Pic[]>()) })
      isChanged = true
    }
  } catch (err) {
    // Whatever went wrong, the tab stops saying it is reading, and says the chat is not to be had
    if (!talks.has(id)) talks.set(id, { key: '', lines: undefined, at: await $.clock.now().catch(() => 0) })
    isChanged = true
    await log($, `chat of ${id} not read: ${String(err)}`).catch(() => undefined)
  } finally {
    loading.delete(id)
  }
  // Drawn again only when something new was read, so a drawing that finds nothing new ends there
  if (isChanged) redraw($)
}

// Another chat's work keeps its chat in that chat's transcript on this Mac, which the engine gives this chat no rows of: it is read
// from its file, the end of it, in the same rows. A chat on another Mac is not read: its Details says where it is
const THEIR_TAIL = 800_000
const SAFE_ID = /^[A-Za-z0-9_-]{1,80}$/
// A transcript's lines as the engine's rows: what the work was told, what it wrote, each tool step with what came back
const rowsOfTranscript = (text: string): SessionMessage[] => {
  const rows: SessionMessage[] = []
  const uses = new Map<string, ToolUseSummary>()
  const textOf = (content: unknown) =>
    typeof content === 'string' ? content : Array.isArray(content) ? content.flatMap(block => (block && typeof block === 'object' && (block as { type?: unknown }).type === 'text' && typeof (block as { text?: unknown }).text === 'string' ? [(block as { text: string }).text] : [])).join('\n') : ''
  for (const line of text.split('\n')) {
    if (!line.startsWith('{')) continue
    let entry: { type?: unknown; isMeta?: unknown; message?: { content?: unknown } }
    try {
      entry = JSON.parse(line) as typeof entry
    } catch {
      continue
    }
    const content = entry.message?.content
    if (entry.type === 'assistant') {
      const toolUses = (Array.isArray(content) ? content : []).flatMap((block): ToolUseSummary[] => {
        const b = block as { type?: unknown; id?: unknown; name?: unknown; input?: unknown }
        if (b?.type !== 'tool_use' || typeof b.id !== 'string' || typeof b.name !== 'string') return []
        const use: ToolUseSummary = { tool_use_id: b.id, tool: b.name, input: b.input && typeof b.input === 'object' ? (b.input as Record<string, unknown>) : {} }
        uses.set(b.id, use)
        return [use]
      })
      rows.push({ role: 'assistant', text: textOf(content), toolUses } as SessionMessage)
    } else if (entry.type === 'user' && entry.isMeta !== true) {
      // What came back to a tool step goes with that step; the rest is what the work was told
      for (const block of Array.isArray(content) ? content : []) {
        const b = block as { type?: unknown; tool_use_id?: unknown; content?: unknown; is_error?: unknown }
        const use = b?.type === 'tool_result' && typeof b.tool_use_id === 'string' ? uses.get(b.tool_use_id) : undefined
        if (use) Object.assign(use, { text: textOf(b.content), ...(b.is_error === true ? { isError: true } : {}) })
      }
      const said = textOf(content)
      if (said) rows.push({ role: 'user', text: said, toolUses: [] } as unknown as SessionMessage)
    }
  }
  return rows
}
const loadTheirs = async ($: EngineInterface, one: Todo) => {
  const c = one.chat
  const id = one.id
  if (!c || c.host || !SAFE_ID.test(c.id) || !SAFE_ID.test(c.agent ?? '') || loading.has(id)) return
  loading.add(id)
  let isChanged = false
  try {
    // Read again when it has made a step, said where it is, or ended: not as its context grows
    const key = [one.steps ?? 0, one.entries.at(-1)?.text ?? '', one.entries.filter(entry => entry.readAt).length, one.status, one.items.length, one.endedAt].join(':')
    const now = await $.clock.now()
    const was = talks.get(id)
    if (was?.key === key && (was.lines || now - (was.at ?? 0) < RETRY_READ)) return
    const projects = `${claudeDir || (await configDir($))}/projects`
    // Its folder named as the engine names its projects, and failing that any project that holds that chat
    const slug = c.folder.replace(/[^A-Za-z0-9]/g, '-')
    const name = `${c.id}/subagents/agent-${c.agent}.jsonl`
    during("read another chat's task")
    const r = await runOn($, ['sh', '-c', 'for f in "$1/$2/$3" "$1"/*/"$3"; do [ -f "$f" ] && { tail -c "$4" "$f"; exit 0; }; done; exit 1', 'sh', projects, slug, name, String(THEIR_TAIL)], { timeoutMs: 5000 })
      .catch(() => undefined)
    const rows = r?.exitCode === 0 ? rowsOfTranscript(r.stdout) : undefined
    talks.set(id, { key, lines: rows?.length ? withSteers(talkOf(rows), one.entries) : undefined, at: now })
    isChanged = true
  } catch (err) {
    if (!talks.has(id)) talks.set(id, { key: '', lines: undefined, at: await $.clock.now().catch(() => 0) })
    isChanged = true
    await log($, `chat of ${id} not read: ${String(err)}`).catch(() => undefined)
  } finally {
    loading.delete(id)
  }
  if (isChanged) redraw($)
}

// The pictures an ask is about, drawn small on its card under what it is about, so the person decides there without waiting for
// the chat to send them (14 Nov: a card asked to pick one of four designs, and the designs came only later, in the chat). Each
// small copy is smaller than a chat's: a card's pictures are drawn in the list, beside every other card, and the list is one drawing
// Each is made twice as wide as it is drawn, so its words stay readable on a sharp screen: smaller files first by a lower quality,
// then by a narrower copy
const ASK_THUMB_SIZES: [string, string][] = [
  ['600', '45'],
  ['600', '35'],
  ['480', '40'],
  ['360', '40'],
]
const ASK_THUMB_BYTES = 25_000
// How wide an ask's small picture is drawn at most, and how tall, in the panel's pixels
const ASK_PIC_WIDE = 300
const ASK_PIC_TALL = 240
const sizedAskPic = (width: number, height: number) => {
  const scale = Math.min(1, ASK_PIC_WIDE / width, ASK_PIC_TALL / height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}
// The most characters every ask's small pictures together take in one drawing; one past that is a row that opens it
const ASK_PICS_CHARS = 140_000
// Each ask's pictures as last made, by the work, its ask and its pictures; made out of the drawing, which is drawn again once they are
const askPics = new Map<string, Pic[]>()
const askLoading = new Set<string>()
const askPicsKey = (one: Todo) => `${one.id}:${one.ask?.at ?? 0}:${(one.ask?.pictures ?? []).join('|')}`
const askPicOf = async ($: EngineInterface, path: string): Promise<Pic | null> => {
  const stat = await $.fs.stat(path).catch(() => undefined)
  // A picture not on this Mac (an ask of a chat on another Mac names its own files) is left out
  if (!stat || stat.kind !== 'file') return null
  let thumb: Thumb = null
  if (/\.svg$/i.test(path) && stat.size <= SVG_CHARS) {
    const text = await readOr($, path)
    const from = text.indexOf('<svg')
    if (from >= 0) {
      // Its own size, from its width and height or its viewBox, so it is drawn within the card like any other
      const head = /<svg[^>]*>/i.exec(text.slice(from))?.[0] ?? ''
      const box = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(head)
      // Both from its width and height, else both from its viewBox: one of each could be in different units
      const given = [/\swidth="([\d.]+)(px)?"/i.exec(head)?.[1], /\sheight="([\d.]+)(px)?"/i.exec(head)?.[1]]
      const [width, height] = (given[0] && given[1] ? given : [box?.[1], box?.[2]]).map(one => Number(one ?? 0))
      thumb = { source: text.slice(from), width: width && height ? width : 0, height: width && height ? height : 0 }
    }
  } else if (RASTER.test(path)) {
    const to = `${dir}/thumbs/ask-${slug(path).slice(-60)}-${mark(path).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
    if (!(await $.fs.exists(to))) {
      await runOn($, ['mkdir', '-p', `${dir}/thumbs`])
      for (const [size, quality] of ASK_THUMB_SIZES) {
        await runOn($, [sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, path, '--out', to])
        if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= ASK_THUMB_BYTES) break
      }
    }
    thumb = await thumbOf($, to)
  }
  return { name: fileName(path), path, thumb }
}
// What a card draws: its ask's pictures as made, or nothing yet while they are made
const askPicturesOf = ($: EngineInterface, one: Todo): Pic[] | undefined => {
  if (!one.ask?.pictures?.length) return []
  const key = askPicsKey(one)
  if (askPics.has(key)) return askPics.get(key)
  if (!askLoading.has(key)) {
    askLoading.add(key)
    const paths = [...one.ask.pictures]
    void (async () => {
      const made: Pic[] = []
      for (const path of paths) {
        const pic = await askPicOf($, path).catch(() => null)
        if (pic) made.push(pic)
      }
      if (askPics.size >= 60) askPics.delete(askPics.keys().next().value ?? '')
      askPics.set(key, made)
    })()
      .catch(err => log($, `pictures of an ask not made: ${String(err)}`))
      .finally(() => (askLoading.delete(key), redraw($)))
  }
  return undefined
}

// ---- A picture of each question with buttons (Config's Pictures of questions, off as it comes) ----

// A task's question with buttons is drawn by Claudopus as one picture: the question, what it is about, and each button as a box of
// its own with what the task said of it. It is made once, as the question comes, opened on the person's screen, and kept with the
// question, so the card and the chat show it with the question (24 Nov, the person: "a picture for every question that has options
// ... built in, ideally as a setting"; tasks were left to remember it). A question for a key or password has none, and one whose
// picture can't be made is asked as text alone
const QUESTION_W = 1200
const QUESTION_PAD = 56
const QUESTION_FONT = "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
// About how wide a letter is, as a share of its size: lines are broken by it, as an SVG breaks none itself
const LETTER_W = 0.5
const wrapped = (text: string, size: number, width: number, most: number) => {
  const per = Math.max(8, Math.floor(width / (size * LETTER_W)))
  const lines: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word
      if (next.length <= per) line = next
      else {
        if (line) lines.push(line)
        line = word.length > per ? `${word.slice(0, per - 1)}…` : word
      }
    }
    lines.push(line)
  }
  while (lines.length && !lines.at(-1)?.trim()) lines.pop()
  return lines.length > most ? [...lines.slice(0, most - 1), `${(lines[most - 1] ?? '').replace(/\s*\S*$/, '')} …`] : lines
}
// What the task said of each button in what the question is about: a line that begins with the button's words ("- Release it: …"),
// taken out of the rest
const choiceSaid = (details: string, choices: string[]) => {
  const lines = details.split('\n')
  const said = choices.map(choice => {
    const words = choice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const at = lines.findIndex(line => new RegExp(`^\\s*(?:[-*•]|\\d+[.)])?\\s*[*_"“']*${words}[*_"”']*\\s*(?:[:—–]|-\\s)\\s*(.+)$`, 'i').test(line))
    if (at < 0) return ''
    const [, text = ''] = new RegExp(`^\\s*(?:[-*•]|\\d+[.)])?\\s*[*_"“']*${words}[*_"”']*\\s*(?:[:—–]|-\\s)\\s*(.+)$`, 'i').exec(lines[at] ?? '') ?? []
    lines[at] = '\u0000'
    return text.trim().replace(/^\w/, c => c.toUpperCase())
  })
  return { said, rest: lines.filter(line => line !== '\u0000').join('\n').replace(/\n{3,}/g, '\n\n').trim() }
}
const questionSvg = (title: string, text: string, details: string, choices: string[]) => {
  const inner = QUESTION_W - QUESTION_PAD * 2
  const { said, rest } = choiceSaid(details, choices)
  const cols = choices.length === 3 ? 3 : choices.length >= 2 ? 2 : 1
  const gap = 24
  const boxW = (inner - gap * (cols - 1)) / cols
  const parts: string[] = []
  let y = QUESTION_PAD
  const line = (words: string, size: number, color: string, x: number, weight = 400) => {
    y += Math.round(size * 1.35)
    parts.push(`<text x="${x}" y="${y}" font-family="${QUESTION_FONT}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(words)}</text>`)
  }
  line(cut(`Question · ${title}`, 90), 22, '#a8a6a0', QUESTION_PAD)
  y += 10
  for (const one of wrapped(text, 40, inner, 4)) line(one, 40, '#f5a524', QUESTION_PAD, 600)
  if (rest) {
    y += 14
    for (const one of wrapped(rest, 24, inner, 12)) line(one, 24, '#d6d4ca', QUESTION_PAD)
  }
  y += 36
  // The buttons, a box each, in rows of `cols`
  for (let row = 0; row < choices.length; row += cols) {
    const inRow = choices.slice(row, row + cols)
    const bodies = inRow.map((choice, n) => ({ choice, n: row + n, lines: wrapped(said[row + n] ?? '', 22, boxW - 48, 8), head: wrapped(choice, 30, boxW - 104, 2) }))
    const boxH = Math.max(...bodies.map(one => 40 + one.head.length * 40 + (one.lines.length ? 14 + one.lines.length * 30 : 0) + 28))
    bodies.forEach((one, n) => {
      const x = QUESTION_PAD + n * (boxW + gap)
      parts.push(`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="16" fill="#34332f" stroke="#55534c" stroke-width="2"/>`)
      parts.push(`<circle cx="${x + 46}" cy="${y + 54}" r="22" fill="#f5a524"/><text x="${x + 46}" y="${y + 63}" text-anchor="middle" font-family="${QUESTION_FONT}" font-size="26" font-weight="700" fill="#262624">${one.n + 1}</text>`)
      one.head.forEach((words, k) => parts.push(`<text x="${x + 84}" y="${y + 64 + k * 40}" font-family="${QUESTION_FONT}" font-size="30" font-weight="600" fill="#f0eee6">${escapeXml(words)}</text>`))
      one.lines.forEach((words, k) => parts.push(`<text x="${x + 24}" y="${y + 40 + one.head.length * 40 + 14 + 24 + k * 30}" font-family="${QUESTION_FONT}" font-size="22" fill="#c9c7bd">${escapeXml(words)}</text>`))
    })
    y += boxH + gap
  }
  y += 8
  line('Press a button on the card, or answer in your own words.', 22, '#a8a6a0', QUESTION_PAD)
  const height = Math.ceil(y + QUESTION_PAD - 12)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${QUESTION_W}" height="${height}" viewBox="0 0 ${QUESTION_W} ${height}"><rect width="${QUESTION_W}" height="${height}" fill="#262624"/>${parts.join('')}</svg>`
}
// Where the pictures of questions are kept: the person's own memory folder
const questionsDir = () => `${dir}/questions`
// Whether the person wants them: Config's Pictures of questions, off as it comes (25 Nov, the person: "off by default")
const wantsQuestionPictures = async ($: EngineInterface) => Boolean(dir) && (await readConfig($, dir)).askPictures === true
// Makes the picture of one question, as a PNG; nothing when it can't be made, and the question goes as text alone
const questionPicture = async ($: EngineInterface, id: string, title: string, text: string, details: string, choices: string[], at: number) => {
  if (!dir || !choices.length) return ''
  const base = `${questionsDir()}/${id.replace(/[^A-Za-z0-9_-]/g, '-')}-${at}`
  try {
    await runOn($, ['mkdir', '-p', questionsDir()])
    await $.fs.write(`${base}.svg`, questionSvg(title, text, details, choices))
    const r = await runOn($, [sips($), '-s', 'format', 'png', `${base}.svg`, '--out', `${base}.png`], { timeoutMs: 20_000 })
    await runOn($, ['rm', '-f', `${base}.svg`]).catch(() => undefined)
    if (r.exitCode !== 0 || (await $.fs.stat(`${base}.png`).catch(() => undefined))?.kind !== 'file') return void (await log($, `picture of a question not made: ${oneLine(r.stderr ?? '').slice(0, 160)}`)), ''
    return `${base}.png`
  } catch (err) {
    await log($, `picture of a question not made: ${String(err)}`)
    return ''
  }
}
// The question's picture opened on the person's screen, once, as it comes: nowhere when the chat is run from another device
const openQuestionPicture = async ($: EngineInterface, path: string) => {
  if (isRunFromAfar || !path) return
  const r = await openOn($, path)
  if (r.exitCode !== 0) await log($, `picture of a question not opened: ${oneLine(r.stderr ?? '').slice(0, 160)}`)
}
