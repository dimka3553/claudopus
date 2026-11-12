// The cards: one per piece of background work, its states from start to finish, the panel's open or closed choice, and
// finished work kept and recovered

// ---- The to-dos: one per piece of background work, as the panel lists them ----

const started = (id: string, parentId: string, title: string, words: string, at: number, isFork = false): Todo => ({
  id,
  parentId,
  isFork,
  tokens: 0,
  title: oneLine(title),
  words: words.trim(),
  items: [],
  entries: [],
  answer: '',
  startedAt: at,
  endedAt: 0,
  status: 'working',
})
// Work that ends needs nothing more of the person's hands: its ask goes with it, unless it waits on an answer from its buttons
const ended = (one: Todo, status: Todo['status'], at: number): Todo => ({ ...one, status, endedAt: at, ask: one.ask?.choices?.length ? one.ask : undefined })
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
const resumed = (one: Todo, at: number): Todo => ({ ...one, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, answeredAt: undefined })
// How work that is stopped ends: done when its turn had already ended with its report and only its own background work held it
// (the chat stops such work once its report is in), stopped otherwise
const stoppedAs = (one: Todo): Todo['status'] => (one.answeredAt ? 'done' : 'stopped')
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
const handedBack = new Map<string, string>()
// Work stopped after its report, so ended done just now, keeps that report for good, as work that finished outright does
const keepStoppedReports = async ($: EngineInterface, now: number) => {
  for (const card of (await read($, todos)).filter(one => !one.parentId && one.status === 'done' && one.answeredAt && one.endedAt === now && one.answer.trim()))
    $.clock.after(5, () => void saveReport($, card, card.answer).catch(err => log($, `report of ${card.id} not kept: ${String(err)}`)))
}

// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
const byEnd = (list: Todo[]) => [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0)
// The list is kept short by forgetting work that has ended, the oldest first; work under way is never forgotten
const capped = (list: Todo[]) => {
  let over = list.length - KEPT
  return over > 0 ? list.filter(one => one.status === 'working' || (over -= 1) < 0) : list
}

// Stands for the work that started a helper when the engine does not say which it was
const HELPER = 'helper'

// The to-do a piece of work belongs to: its own, or the one of the work that started it
const topOf = (list: Todo[], id: string) => {
  let at = id
  for (let hops = 0; hops < 10; hops += 1) {
    const one = list.find(todo => todo.id === at)
    if (!one?.parentId) return at
    at = one.parentId
  }
  return at
}

// Work the chat's own record was already looked through for
const helpersChecked = new Set<string>()
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
const sync = async ($: EngineInterface) => {
  const live = await $.agent.list().catch(() => [])
  const now = await $.clock.now()
  // Work the mod never saw start (it was running when the mod was installed or renamed) that no loop is said to have started:
  // the chat's own Agent calls tell a piece of work from a helper whose start the engine did not record
  // A card taken for a helper that way is looked at again
  const known = new Map((await read($, todos)).map(one => [one.id, one.parentId] as const))
  const isUnseen = live.some(
    one => (!known.has(one.id) || known.get(one.id) === HELPER) && !helpersChecked.has(one.id) && (one.status === 'running' || one.status === 'pending') && !one.parentId && one.type !== 'fork',
  )
  const rows = isUnseen ? await $.session.messages().catch(() => []) : []
  const ownCalls = new Set(
    (Array.isArray(rows) ? rows : []).flatMap(row => (row.toolUses ?? []).filter(use => use.tool === 'Agent').map(use => String(use.input?.description ?? ''))).filter(Boolean),
  )
  // The chat is read once for each such work, not at every look
  if (isUnseen) for (const one of live) if (!one.parentId) helpersChecked.add(one.id)
  await update($, todos, list => {
    const cards = new Map(list.map(one => [one.id, one] as const))
    let isChanged = false
    for (const one of live) {
      const card = cards.get(one.id)
      const next: Todo | undefined = !card
        ? // Work held on background work it left running ended its turn: the mod, had it seen that, would have ended its card
          one.status === 'running' || one.status === 'pending'
          ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
            started(one.id, one.parentId ?? (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
          : undefined
        : card.status === 'working' && (one.status === 'completed' || one.status === 'failed' || one.status === 'killed')
          ? ended(card, one.status === 'failed' ? 'failed' : one.status === 'killed' ? stoppedAs(card) : 'done', now)
          : // A card listed from the engine alone, for work that is only held and has made no step since: its turn had ended
            card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle'
            ? ended(card, 'done', now)
          : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
            ? { ...card, parentId: '', title: card.title || oneLine(one.description) }
            : !card.title && one.description
              ? { ...card, title: oneLine(one.description) }
              : undefined
      if (next) cards.set(one.id, next)
      isChanged ||= Boolean(next)
    }
    return isChanged ? capped([...cards.values()]) : list
  })
  await keepStoppedReports($, now)
  await lookEnds($)
}

// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
const change = async ($: EngineInterface, agentId: string, fn: (one: Todo, at: number) => Todo) => {
  const now = await $.clock.now()
  if (!(await read($, todos)).some(one => one.id === agentId)) await sync($)
  await update($, todos, list => {
    const id = topOf(list, agentId)
    return list.map(one => (one.id === id ? fn(one, now) : one))
  })
  // Work that was running before the panel had ever opened brings it up with its first line
  await openList($)
}

// Writes a line into a piece of work's own chat, which it reads at its next step
const tell = ($: EngineInterface, id: string, text: string) =>
  $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] }, agentId: id }).catch(async err => void (await log($, `work ${id} not told: ${String(err)}`)))

const stop = async ($: EngineInterface, id: string) => {
  if ((await read($, todos)).some(one => one.id === id && one.status === 'working')) pressed.add(id)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: id }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (pressed.delete(id), log($, `work ${id} not stopped: ${r.deny}`))
  const now = await $.clock.now()
  await update($, todos, list => list.map(one => (one.id === id && one.status === 'working' ? ended(one, stoppedAs(one), now) : one)))
  await keepStoppedReports($, now)
  await lookEnds($)
}

// Moves running work to another model: its card names it at once, each step it sends from now on goes to it, and the work is
// told in its own chat, where the panel shows the change as a line of its own
const choose = async ($: EngineInterface, id: string, model: string) => {
  await update($, view, v => ({ ...v, picking: '' }))
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || one.status !== 'working' || modelName(one.chosen ?? one.model ?? '') === modelName(model)) return
  await update($, todos, list => list.map(todo => (todo.id === id ? { ...todo, model, chosen: model } : todo)))
  await tell($, id, movedTo(modelName(model), await $.clock.now()))
}

// One panel for every chat on this Mac: each chat in the app runs on its own, so whether the person last opened or closed it is
// kept in panel.json, and every chat follows it within PANEL_EVERY: opened in one chat, it is open in each chat they go to;
// closed by hand in one, it closes in all and stays closed until asked for. Until they first choose, each chat goes on as before
type PanelChoice = { isOpen: boolean; at: number }
const PANEL_EVERY = 2000
// The choice this chat last followed, as its time and whether it was open; a new load follows it afresh
let panelSeen = ''
const seenOf = (one: PanelChoice) => `${one.at}:${one.isOpen}`
const readPanel = ($: EngineInterface) =>
  readOr($, `${dir}/panel.json`)
    .then(text => (text ? (JSON.parse(text) as PanelChoice) : undefined))
    .then(one => (typeof one?.isOpen === 'boolean' && typeof one.at === 'number' ? one : undefined))
    .catch(() => undefined)
const choosePanel = async ($: EngineInterface, isOpen: boolean) => {
  // Kept later than any choice already there, so every chat sees it as new even when two come within one tick of the clock
  const at = Math.max(await $.clock.now(), ((await readPanel($))?.at ?? 0) + 1)
  panelSeen = seenOf({ isOpen, at })
  await $.fs.write(`${dir}/panel.json`, JSON.stringify({ isOpen, at })).catch(err => log($, `panel choice not kept: ${String(err)}`))
}
// Brings this chat's panel in line with the last choice, once per choice. A pane opened where nothing draws it yet stays open and
// is drawn once a screen that can attaches; an open the engine refused is tried again at the next look
const followPanel = async ($: EngineInterface) => {
  if (!dir) return undefined
  const choice = await readPanel($)
  if (!choice || seenOf(choice) === panelSeen) return choice
  const isOpen = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (choice.isOpen && !isOpen) {
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE }).catch(err => (log($, `panel not opened with the others: ${String(err)}`), undefined))
    if (!opened) return choice
    await update($, me, one => ({ ...one, isListOpened: true }))
    await update($, paneShown, () => true)
  }
  if (!choice.isOpen && isOpen) await $.ui.close({ id: LIST }).catch(() => undefined)
  panelSeen = seenOf(choice)
  return choice
}

// The panel opens by itself with a chat's first piece of work; closed, it stays closed until asked for
const openList = async ($: EngineInterface) => {
  if ((await read($, me)).isListOpened) return
  // Closed by hand in any chat, it stays closed in every chat; opened, it is open in all of them already
  const choice = await readPanel($)
  if (choice && !choice.isOpen) return
  if (!choice) await choosePanel($, true)
  await update($, me, one => ({ ...one, isListOpened: true }))
  await update($, paneShown, () => true)
  await $.ui.open({ id: LIST, title: LIST_TITLE }).catch(err => log($, `panel not opened: ${String(err)}`))
}

// Keeps the list true while work runs: the engine's list, and the minutes
// Work that has ended, kept on disk for good, one file per chat (finished/<chat id>.json): the Finished list survives a
// reload and a restart of the app. Its chat is the engine's own record of the work, read again when it is opened
const finishedPath = (chatId: string) => `${dir}/finished/${chatId}.json`
let finishedSaved = ''
const saveFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  const ended = (await read($, todos)).filter(one => !one.parentId && one.status !== 'working')
  const sign = ended.map(one => [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title].join(':')).join(',')
  if (!id || !dir || !ended.length || sign === finishedSaved) return
  const old = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  const kept = [...old.filter(one => !ended.some(card => card.id === one.id)), ...ended].sort((a, b) => a.endedAt - b.endedAt).slice(-KEPT)
  await $.fs.write(`${dir}/finished/${id}.json`, JSON.stringify(kept))
  finishedSaved = sign
}
// Work that ended before the mod kept it (before a rename, or before this list was kept) is read back from the app's own record
// of this chat's agents: its times, model, size, its to-dos and its last line about itself, from its saved transcript. Only work
// the chat's own thread started; what the person's words were for it is not recovered
const isBare = (card: Todo) => card.status !== 'working' && card.endedAt === card.startedAt && !card.model
const recoverEnded = async ($: EngineInterface) => {
  const { id } = await read($, me)
  const list = await read($, todos)
  if (!id) return
  // The engine lists only the work of its own process; the transcripts of the rest are in the chat's folder, one per agent
  const live = await $.agent.list().catch(() => [])
  const home = (await $.env.get('HOME')) ?? ''
  const folder = `${home}/.claude/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}/${id}/subagents`
  type Meta = { description?: string; agentType?: string; finished?: boolean; spawnDepth?: number }
  const ids = (await $.fs.list(folder).catch(() => [])).map(entry => /^agent-(\w+)\.meta\.json$/.exec(entry.name)?.[1] ?? '').filter(Boolean)
  // Only the work this chat's own thread started (its helpers are a level deeper), the newest first
  const metas = await Promise.all(
    ids.map(async one => ({
      one,
      meta: JSON.parse((await readOr($, `${folder}/agent-${one}.meta.json`)) || '{}') as Meta,
      at: (await $.fs.stat(`${folder}/agent-${one}.jsonl`).catch(() => undefined))?.mtimeMs ?? 0,
    })),
  )
  // The newest few, so a chat with a long past is read once and never again: what is read back is kept with the rest
  const fresh = metas
    .filter(({ meta }) => meta.spawnDepth === 1)
    .sort((a, b) => b.at - a.at)
    .slice(0, KEPT)
    .filter(({ one }) => !list.some(card => card.id === one && !isBare(card)) && !live.some(agent => agent.id === one && WORKING.includes(agent.status)))
  if (!fresh.length) return
  const found: Todo[] = []
  for (const { one: agentId, meta } of fresh) {
    try {
      const mtime = (await $.fs.stat(`${folder}/agent-${agentId}.jsonl`).catch(() => undefined))?.mtimeMs ?? 0
      // A transcript too long to read still gives a card: its name, how it ended and when
      const path = `${folder}/agent-${agentId}.jsonl`
      // One too long to read whole is read from its first line and its last few megabytes: its early to-dos may be missed
      const text =
        (await readOr($, path)) ||
        [
          (await $.process.run(['head', '-n', '1', path]).catch(() => undefined))?.stdout ?? '',
          ((await $.process.run(['tail', '-c', '3000000', path]).catch(() => undefined))?.stdout ?? '').split('\n').slice(1).join('\n'),
        ].join('\n')
      const engine = live.find(agent => agent.id === agentId)
      const one = { id: agentId, description: meta.description ?? '', type: meta.agentType ?? '', status: engine?.status ?? (meta.finished ? 'completed' : 'killed') }
      let first = 0
      let last = 0
      let model = ''
      let tokens = 0
      let items: Item[] = []
      const entries: Entry[] = []
      for (const row of text.split('\n')) {
        const o = (() => {
          try {
            return JSON.parse(row) as { timestamp?: string; type?: string; message?: { model?: string; usage?: Record<string, number>; content?: unknown } }
          } catch {
            return undefined
          }
        })()
        const at = o?.timestamp ? Date.parse(o.timestamp) : 0
        if (!o || !at) continue
        first ||= at
        last = at
        if (o.type !== 'assistant') continue
        model = o.message?.model || model
        const u = o.message?.usage
        if (u) tokens = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.output_tokens ?? 0)
        for (const block of Array.isArray(o.message?.content) ? (o.message.content as { type?: string; name?: string; input?: Record<string, string> }[]) : []) {
          if (block.type !== 'tool_use' || !block.name) continue
          const input = block.input ?? {}
          if (isTool(block.name, 'note') && typeof input.text === 'string') entries.push({ at, kind: 'note', text: oneLine(input.text).slice(0, NOTE_CHARS) })
          if (isTool(block.name, 'todo') && typeof input.item === 'string') {
            const text = oneLine(input.item).slice(0, 200)
            const state = (['open', 'doing', 'done', 'dropped'] as const).find(s => s === input.state)
            const old = slug(typeof input.was === 'string' && input.was.trim() ? input.was : text)
            items = items.some(item => slug(item.text) === old) ? items.map(item => (slug(item.text) === old ? { text, state: state ?? item.state } : item)) : [...items, { text, state: state ?? 'open' }]
          }
        }
      }
      const status: Todo['status'] = one.status === 'failed' ? 'failed' : one.status === 'killed' ? 'stopped' : 'done'
      found.push({ ...started(one.id, '', one.description, '', first || mtime, one.type === 'fork'), status, endedAt: last || mtime, model, tokens, items, entries: entries.slice(-ENTRIES_KEPT) })
    } catch (err) {
      await log($, `ended work ${agentId} not read back: ${String(err)}`)
    }
  }
  // A card read back bare by an earlier version, with no times or model, is replaced
  if (found.length)
    await update($, todos, now => capped(byEnd([...found.filter(one => !now.some(card => card.id === one.id && !isBare(card))), ...now.filter(card => !(isBare(card) && found.some(one => one.id === card.id)))])))
}

// What was kept comes back into the list when the chat loads, below anything the list already holds
const loadFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id) return
  const kept = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  if (!Array.isArray(kept) || !kept.length) return
  await update($, todos, list => {
    const fresh = kept.filter(one => one.id && one.status !== 'working' && !list.some(card => card.id === one.id))
    return fresh.length ? capped(byEnd([...fresh, ...list])) : list
  })
}

const follow = async ($: EngineInterface) => {
  await sync($)
  await saveFinished($).catch(err => log($, `finished work not kept: ${String(err)}`))
  const isShown = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (isShown !== (await read($, paneShown))) await update($, paneShown, () => isShown)
  // Reports another chat kept since are listed here too
  await loadReports($).catch(() => undefined)
  if ((await read($, todos)).some(one => !one.parentId && one.status === 'working')) await update($, tick, n => n + 1)
}

// A message as the panel quotes it: whole when short, else its first sentences
const quoted = (text: string, most: number) => {
  // The app wraps a pasted message in a tag of its own, which is no part of what the person said
  const flat = oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' '))
  if (flat.length <= most) return flat
  const head = flat.slice(0, most)
  const end = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '))
  return end > most / 3 ? `${head.slice(0, end + 1)} …` : `${head.slice(0, head.lastIndexOf(' '))} …`
}

// A line cut to what a small card has room for, at the end of a word
const cut = (text: string, most: number) => {
  const end = text.lastIndexOf(' ', most)
  return text.length <= most ? text : `${text.slice(0, end > most / 2 ? end : most)} …`
}

// Each web address in a text as a link to press, the rest as it stands: only an address whole in `whole` is linked, so one a
// small card cut short is never a link to half an address
const URL_IN = /https?:\/\/[^\s<>()"'`…]*[^\s<>()"'`….,;:!?]/g
const withLinks = (Link: ElementTable['Link'], text: string, key: string, whole = text) => {
  const full = new Set(whole.match(URL_IN) ?? [])
  const parts: (string | JSX.Element)[] = []
  let at = 0
  for (const m of text.matchAll(URL_IN)) {
    const end = (m.index ?? 0) + m[0].length
    if (!full.has(m[0]) || /[^\s<>()"'`.,;:!?]/.test(text[end] ?? ' ')) continue
    parts.push(text.slice(at, m.index), <Link key={`${key}-${parts.length}`} href={m[0]} />)
    at = end
  }
  parts.push(text.slice(at))
  return parts.filter(part => part !== '')
}
