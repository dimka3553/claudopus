// The panel's recorder: what happens in the real panel, written to a file, for finding faults only the app shows (the panel
// thrown to its end while the person types, 15 Nov). Off unless the file record-panel.on is in the memory folder; then each chat
// that loads the mod writes, for RECORD_FOR, one line per event to panel-record/<chat>-<start>.jsonl and removes the switch:
// every drawing of the panel and what asked for it, where its window stood, which element holds the focus, the cards in their
// order, scrolls and who asked for them, presses, and the person's typing as a count by box. Never a value typed into a box:
// an input's text, a reply's, a key's, is not read, and an element's key is kept only in the mod's own shape of keys
const RECORD_FOR = 180_000
const RECORD_SWITCH = 'record-panel.on'
const RECORD_FRESH = 60_000
let recording: { path: string; until: number; lines: string[]; written: number; started: number } | undefined
let recordLooked = 0
let typedCount = new Map<string, number>()
// Only the shape of a key the mod draws (letters, digits and - _ : . |, at most 96): anything else is kept as its length
const keyShown = (key: unknown) => (typeof key === 'string' && /^[\w\-:.|]{1,96}$/.test(key) ? key : typeof key === 'string' ? `<${key.length}>` : undefined)
// Whether to record now: the switch is looked for at most every 2 s; found, recording starts and the switch goes
const isRecording = async ($: EngineInterface) => {
  const at = await $.clock.now()
  if (recording) {
    if (at < recording.until) return true
    recording.lines.push(JSON.stringify({ t: at - recording.started, ev: 'runs', times: [...runTimes].map(([name, [n, ms]]) => [name, n, Math.round(ms)]).sort((a, b) => Number(b[2]) - Number(a[2])) }))
    runTimes.clear()
    await recordFlush($)
    recording = undefined
    return false
  }
  if (!dir || at - recordLooked < 2000) return false
  recordLooked = at
  const on = `${dir}/${RECORD_SWITCH}`
  const stat = await $.fs.stat(on).catch(() => undefined)
  if (!stat) return false
  // A switch left from long ago, its removal failed or its chat gone, starts nothing: it goes
  if (at - stat.mtimeMs > RECORD_FRESH) return void (await runOn($, ['rm', '-f', on]).catch(() => undefined)), false
  const chat = (await $.session.id().catch(() => '')).slice(0, 8) || 'chat'
  recording = { path: `${dir}/panel-record/${chat}-${new Date(at).toISOString().replace(/[:.]/g, '-')}.jsonl`, until: at + RECORD_FOR, lines: [], written: 0, started: at }
  typedCount = new Map()
  // The switch stays for the other chats to see for a few seconds, then goes, so a recording never runs on by itself
  $.clock.after(6000, () => void runOn($, ['rm', '-f', on]).catch(() => undefined))
  const manifest = await readOr($, `${pluginRoot($)}/.claude-plugin/plugin.json`)
  const flushing = () => $.clock.after(2000, () => void (recording ? recordFlush($).then(() => (recording && ((void isRecording($)), flushing()))) : undefined))
  flushing()
  await recordLine($, { ev: 'start', version: /"version": *"([^"]+)"/.exec(manifest)?.[1] ?? '', root: pluginRoot($).split('/').slice(-3).join('/') })
  return true
}
// One event, with its time from the start
const recordLine = async ($: EngineInterface, event: Record<string, unknown>) => {
  if (!recording) return
  recording.lines.push(JSON.stringify({ t: (await $.clock.now()) - recording.started, ...event }))
  if (recording.lines.length - recording.written > 40) await recordFlush($)
}
const recordFlush = async ($: EngineInterface) => {
  if (!recording || recording.written === recording.lines.length) return
  recording.written = recording.lines.length
  await $.fs.write(recording.path, `${recording.lines.join('\n')}\n`).catch(() => undefined)
}
// An event, when recording: called from the mod's own redraws and scrolls with what asked for it
const recordEvent = ($: EngineInterface, ev: string, extra: Record<string, unknown> = {}) => {
  if (!recording) return
  void $.clock.now().then(at => void (recording && at < recording.until && recordLine($, { ev, ...extra, from: callerOf() })))
}
// Where in the mod a call came from: the function names on the way, from the stack, without paths
const callerOf = () =>
  (new Error().stack ?? '')
    .split('\n')
    .slice(3, 7)
    .map(line => line.trim().replace(/^at /, '').replace(/\(.*[/\\]([^/\\]+)\)$/, '($1)').replace(/ \(.*\)$/, m => (m.length > 40 ? '' : m)))
    .filter(line => line && !line.startsWith('async') && !line.includes('node:'))
    .join(' < ')
    .slice(0, 200)
// What a drawing holds, as far as scroll and focus go: its keyed elements in order (keys only), inputs and where they sit
const drawingShape = (drawing: unknown) => {
  const keys: string[] = []
  let nodes = 0
  const inputs: { key: string | undefined; before: number }[] = []
  const walk = (node: unknown, depth: number) => {
    if (!node || typeof node !== 'object' || nodes > 5000) return
    if (Array.isArray(node)) return void node.forEach(child => walk(child, depth))
    const el = node as { type?: unknown; key?: unknown; props?: Record<string, unknown>; children?: unknown }
    if (!el.props && el.key === undefined) return
    nodes += 1
    const type = typeof el.type === 'string' ? el.type : typeof el.type === 'function' ? (el.type as { name?: string }).name ?? '' : ''
    const key = keyShown(el.key ?? el.props?.key)
    if (/Input/i.test(type) || /-reply-|-field/.test(key ?? '')) inputs.push({ key, before: nodes })
    if (key && depth <= 6) keys.push(key)
    walk(el.children ?? el.props?.children, depth + 1)
  }
  walk(drawing, 0)
  return { nodes, inputs, keys: keys.slice(0, 120), sign: [...keys.join(',')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36) }
}
const recordDrawn = new Map<string, unknown>()
const lastSign = new Map<string, string>()
const recorderHooks = (on: On) => {
  // The bar above the prompt, where the reply box is drawn: each drawing, whether it was the one held, and the boxes in it
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const began = await $.clock.now()
    const r = await next(e)
    const isSame = recordDrawn.get('bar') === r
    recordDrawn.set('bar', r)
    const shape = drawingShape(r)
    await recordLine($, { ev: 'render', component: e.component, id: e.requestId, surface: e.surface, offset: e.props.scroll.offset, rows: e.props.scroll.bodyRows, collapsed: e.props.isCollapsed, ms: (await $.clock.now()) - began, held: isSame, typing: isTyping, nodes: shape.nodes, inputs: shape.inputs, sign: shape.sign })
    return r
  })
  on('ui.scroll', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (await isRecording($)) await recordLine($, { ev: 'scroll', id: e.requestId, site: 'bar', origin: e.origin.kind === 'plugin' ? `plugin:${e.origin.name}` : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })
    return next(e)
  })
  on('ui.input', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (await isRecording($)) {
      const key = keyShown(e.element) ?? ''
      typedCount.set(key, (typedCount.get(key) ?? 0) + 1)
      await recordLine($, { ev: 'input', id: e.requestId, site: 'bar', element: key, kind: e.kind, count: typedCount.get(key) })
    }
    return next(e)
  })
  on('ui.press', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    await recordLine($, { ev: 'press', id: e.requestId, site: 'bar', element: keyShown(e.element) })
    const r = await next(e)
    await recordLine($, { ev: 'pressed', site: 'bar', element: keyShown(r.element) })
    return r
  })
  on('ui.render', { component: 'Pane', requestId: LIST }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const id = e.requestId ?? ''
    const began = await $.clock.now()
    const r = await next(e)
    const props = e.props as { scroll?: { offset: number; bodyRows: number }; isFocused?: boolean; placement?: string; bodyColumns?: number }
    const isSame = recordDrawn.get(id) === r
    recordDrawn.set(id, r)
    const shape = e.component === 'Pane' ? drawingShape(r) : undefined
    const moved = shape && lastSign.get(id) !== shape.sign
    if (shape) lastSign.set(id, shape.sign)
    await recordLine($, {
      ev: 'render', component: e.component, id, surface: e.surface, offset: props.scroll?.offset, rows: props.scroll?.bodyRows, cols: props.bodyColumns, focused: props.isFocused,
      placement: props.placement, ms: (await $.clock.now()) - began, held: isSame, typing: isTyping, nodes: shape?.nodes, inputs: shape?.inputs, sign: shape?.sign, keys: moved ? shape?.keys : undefined,
    })
    return r
  })
  on('ui.scroll', { requestId: LIST }, async ($, e, next) => {
    if (await isRecording($)) await recordLine($, { ev: 'scroll', id: e.requestId, origin: e.origin.kind === 'plugin' ? `plugin:${e.origin.name}` : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })
    return next(e)
  })
  // Every site's focus moves, the panel's and the rest (a press that takes the focus out of the panel), and what came of each
  // (by site kind: the panel's own hook in commands.tsx is the one without a matcher, and the engine allows one)
  on('ui.focus', { component: 'Pane' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const r = await next(e)
    await recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })
    return r
  })
  on('ui.focus', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const r = await next(e)
    await recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })
    return r
  })
  // Typing as a count by box: the value is never read
  on('ui.input', { requestId: LIST }, async ($, e, next) => {
    // A key box's typing is not recorded at all, not even as a count: a password's length is the password's
    if (!/^box-.*-field/.test(e.element) && (await isRecording($))) {
      const key = keyShown(e.element) ?? ''
      typedCount.set(key, (typedCount.get(key) ?? 0) + 1)
      await recordLine($, { ev: 'input', id: e.requestId, element: key, kind: e.kind, count: typedCount.get(key) })
    }
    return next(e)
  })
  // A press, and whether it reached its button: an element the drawing no longer holds runs nothing
  on('ui.press', { requestId: LIST }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    await recordLine($, { ev: 'press', id: e.requestId, element: keyShown(e.element) })
    const r = await next(e)
    await recordLine($, { ev: 'pressed', element: keyShown(r.element) })
    return r
  })
}
