// The panel's recorder: what happens in the real panel, written to a file, for finding faults only the app shows (the panel
// thrown to its end while the person types, 15 Nov). Off unless the file record-panel.on is in the memory folder; then each chat
// that loads the mod writes, for RECORD_FOR, one line per event to panel-record/<chat>-<start>.jsonl and removes the switch:
// every drawing of the panel and what asked for it, where its window stood, which element holds the focus, the cards in their
// order, scrolls and who asked for them, presses, and the person's typing as a count by box. Never a value typed into a box:
// an input's text, a reply's, a key's, is not read, and an element's key is kept only in the mod's own shape of keys
const RECORD_FOR = 180_000
const RECORD_SWITCH = 'record-panel.on'
const RECORD_FRESH = 60_000
// Set only while a recording asked for it: the pull back to a typed box let through (commands.tsx)
let isPullGuardOff = false
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
    await recordFlush($)
    recording = undefined
    isPullGuardOff = false
    isScrollHoldOff = false
    return false
  }
  if (!dir || at - recordLooked < 2000) return false
  recordLooked = at
  const on = `${dir}/${RECORD_SWITCH}`
  const stat = await $.fs.stat(on).catch(() => undefined)
  if (!stat) return false
  // A switch left from long ago, its removal failed or its chat gone, starts nothing: it goes
  if (at - stat.mtimeMs > RECORD_FRESH) return void (await $.process.run(['rm', '-f', on]).catch(() => undefined)), false
  // A switch that says "unguarded" records with the pull back let through, to compare with and without it
  const said = await readOr($, on)
  isPullGuardOff = /unguarded/.test(said)
  isScrollHoldOff = /unheld/.test(said)
  const chat = (await $.session.id().catch(() => '')).slice(0, 8) || 'chat'
  recording = { path: `${dir}/panel-record/${chat}-${new Date(at).toISOString().replace(/[:.]/g, '-')}.jsonl`, until: at + RECORD_FOR, lines: [], written: 0, started: at }
  typedCount = new Map()
  // The switch stays for the other chats to see for a few seconds, then goes, so a recording never runs on by itself
  $.clock.after(6000, () => void $.process.run(['rm', '-f', on]).catch(() => undefined))
  const manifest = await readOr($, `${$.plugin.root}/.claude-plugin/plugin.json`)
  const flushing = () => $.clock.after(2000, () => void (recording ? recordFlush($).then(() => (recording && ((void isRecording($)), flushing()))) : undefined))
  flushing()
  await recordLine($, { ev: 'start', isPullGuardOff, isScrollHoldOff, version: /"version": *"([^"]+)"/.exec(manifest)?.[1] ?? '', root: $.plugin.root.split('/').slice(-3).join('/') })
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
  // Every pane of the mod's, its tabs too, so a scroll on Results, Memory or Keys is seen as one on the list is
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!isModPane(e.requestId ?? '') || !(await isRecording($))) return next(e)
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
  // and what the move's answer gave back: an offset in it is one the app writes into the pane's scroll itself
  on('ui.scroll', { component: 'Pane' }, async ($, e, next) => {
    if (!isModPane(e.requestId) || !(await isRecording($))) return next(e)
    const r = await next(e)
    await recordLine($, { ev: 'scroll', id: e.requestId, origin: e.origin.kind === 'plugin' ? `plugin:${e.origin.name}` : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows, answer: (r as { offset?: number })?.offset, followEnd: (r as { followEnd?: boolean })?.followEnd })
    return r
  })
  on('ui.focus', { plugin: 'claudopus' }, async ($, e, next) => {
    if (isModPane(e.requestId) && await isRecording($)) await recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element) })
    return next(e)
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
  on('ui.press', { plugin: 'claudopus' }, async ($, e, next) => {
    if (isModPane(e.requestId) && await isRecording($)) await recordLine($, { ev: 'press', id: e.requestId, element: keyShown(e.element) })
    return next(e)
  })
}
