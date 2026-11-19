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
// Work that ends keeps its ask: what it needs of the person's hands outlives it, and goes only on their answer
// What it kept of its own background work goes with it, but a server a finished task left for the person: its row stays under the
// green card, with its Stop, until it is stopped
// A reply its ask was held with has been acted on once the run it started ends: the ask waits on the person again, every answer back
const ended = (one: Todo, status: Todo['status'], at: number): Todo => {
  const servers = status === 'done' ? (one.bg ?? []).filter(b => isServerRun(b.cmd, b.what)) : []
  return { ...one, ...(one.ask?.replied?.isWaking ? { ask: { ...one.ask, replied: { text: one.ask.replied.text, at: one.ask.replied.at } } } : {}), status, endedAt: at, up: true, why: undefined, bg: servers.length ? servers : undefined }
}
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
const resumed = (one: Todo, at: number): Todo => ({ ...one, byYou: undefined, begunAt: one.begunAt ?? one.startedAt, ask: one.ask?.replied?.isWaking ? { ...one.ask, replied: { text: one.ask.replied.text, at: one.ask.replied.at } } : one.ask, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, why: undefined, reportAt: undefined, stuckAt: undefined, stuckTold: undefined, closedAt: undefined, questions: undefined, newAt: at })
// How work that is stopped ends: done when its result was already received, stopped otherwise
const stoppedAs = (one: Todo): Todo['status'] => (hasReport(one) ? 'done' : 'stopped')
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
const handedBack = new Map<string, string>()
// Work stopped by the chat or the panel
const stoppedHere = new Set<string>()
// Held stopped by the person: stopped with their own press, and no message of theirs has come since
const isHeld = (one: Todo | undefined) => Boolean(one?.byYou && !one.byYou.isLifted)
// The words a task is named by, to know the same work started afresh under another title
const taskWords = (text: string) => new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(word => word.length > 2 && !['the', 'and', 'for', 'with', 'from', 'that', 'this'].includes(word)))
const isSameTask = (held: Todo, title: string, prompt: string) => {
  const a = taskWords(held.title)
  const b = taskWords(title)
  const shared = [...a].filter(word => b.has(word)).length
  // Only the same few words count: titles that share most words can still be other work
  const isNamed = a.size > 0 && shared === a.size && shared === b.size
  // A brief that carries the message the stopped work was started for is that work again
  const words = held.words.trim()
  const isQuoted = words.length >= 12 && prompt.replace(/\s+/g, ' ').includes(words.replace(/\s+/g, ' ').slice(0, 200))
  return isNamed || isQuoted || prompt.includes(held.id)
}
// A start or a message that would set work the person stopped going again: the stopped work it would wake, or undefined
// `resume` is the agent it resumes or messages; `parent` the work that starts it, '' for the chat
const heldFor = (list: Todo[], parent: string, resume: string, title: string, prompt: string) =>
  resume
    ? // By its id, the start of its id, or its title, as SendMessage takes any of them
      list.find(one => isHeld(one) && (one.id === resume || (resume.length >= 6 && one.id.startsWith(resume)) || oneLine(one.title).toLowerCase() === oneLine(resume).toLowerCase()))
    : list.find(one => isHeld(one) && (one.parentId || '') === parent && isSameTask(one, title, prompt))
// What a task still has to do: its to-dos neither done nor dropped
const openItems = (one: Todo | undefined) => (one?.items ?? []).filter(item => item.state === 'open' || item.state === 'doing')

// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
const byEnd = (list: Todo[]) => [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0)
// The list is kept short, at KEPT tasks, by forgetting work that has ended, the oldest first; work under way, and work still
// asking, is never forgotten, and an ended card still up, which the person never dismissed, is forgotten only after every other
// Helpers are not counted: each is kept as long as the work it runs under, and goes with it
const staysUp = (one: Todo) => Boolean(one.up) && !one.parentId && !one.chat && one.status !== 'working' && !one.closedAt
const capped = (list: Todo[]) => {
  const over = list.filter(one => !one.parentId).length - KEPT
  const spare = over > 0 ? list.filter(one => !one.parentId && one.status !== 'working' && !one.ask) : []
  const gone = new Set([...spare.filter(one => !staysUp(one)), ...spare.filter(staysUp)].slice(0, Math.max(0, over)))
  const kept = gone.size ? list.filter(one => !gone.has(one)) : list
  const tops = new Set(kept.filter(one => !one.parentId).map(one => one.id))
  const held = kept.some(one => one.parentId && one.status !== 'working' && !tops.has(topOf(kept, one.id))) ? kept.filter(one => !one.parentId || one.status === 'working' || tops.has(topOf(kept, one.id))) : kept
  // Long work that keeps starting helpers keeps only its newest ended ones; one that still has a helper at work under it stays
  const spent = held.filter(one => one.parentId && one.status !== 'working' && !held.some(kid => kid.parentId === one.id && kid.status === 'working')).sort((a, b) => b.endedAt - a.endedAt).slice(HELPERS_KEPT)
  return spent.length ? held.filter(one => !spent.includes(one)) : held
}
const HELPERS_KEPT = 100

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

// ---- The helpers a piece of work started, and theirs, as a tree under it ----

// What one piece of work started itself, the oldest first
const kidsOf = (list: Todo[], id: string) => list.filter(one => one.parentId === id).sort((a, b) => a.startedAt - b.startedAt)
// Every helper under a piece of work, however deep
const underOf = (list: Todo[], id: string, depth = 1): Todo[] => (depth > TREE_DEEP ? [] : kidsOf(list, id).flatMap(one => [one, ...underOf(list, one.id, depth + 1)]))
const TREE_DEEP = 8
// A branch that is a job its helper (`one`) has running carries the job
type Branch = { one: Todo; kids: Branch[]; job?: Job }
// The helpers under a piece of work that `keep` picks, each with its own; one that is not picked stays while one under it is
const branchesOf = (list: Todo[], id: string, keep: (one: Todo) => boolean, depth = 1): Branch[] =>
  depth > TREE_DEEP ? [] : kidsOf(list, id).map(one => ({ one, kids: branchesOf(list, one.id, keep, depth + 1) })).filter(b => keep(b.one) || b.kids.length > 0)
// One row of the tree: how deep it is, which of the levels above it still have a row to come (their line runs on past it),
// whether it is the last under its parent, and whether rows of its own follow
type Twig = { one?: Todo; job?: Job; depth: number; rails: boolean[]; isLast: boolean; hasKids: boolean }
// The rows in the order they are drawn; `isMore` says a closing row follows the top level's last
const twigsOf = (branches: Branch[], isMore = false, depth = 1, rails: boolean[] = []): Twig[] =>
  branches.flatMap((b, i) => {
    const isLast = i === branches.length - 1 && !isMore
    return [{ one: b.one, ...(b.job ? { job: b.job } : {}), depth, rails, isLast, hasKids: b.kids.length > 0 }, ...twigsOf(b.kids, false, depth + 1, [...rails, !isLast])]
  })
// The lines that join a row to the tree, as text. Each level is two letters wide; a row's own helpers hang from the second
// and as text carried down past a row, as wide as its lines and mark, for each line of its own under it
const railText = (t: Twig) => `${t.rails.map(isOn => (isOn ? '│ ' : '  ')).join('')}${t.isLast ? '  ' : '│ '}${t.hasKids ? '│ ' : '  '} `
const twigText = (t: Twig) => `${t.rails.map(isOn => (isOn ? '│ ' : '  ')).join('')}${t.isLast ? '└─' : '├─'}${t.hasKids ? '┬─' : '──'}`
// The same lines drawn thin, for a surface that draws, as tall as one line of text: the last row under a parent turns to it in a
// curve, the line ends in a dot in the colour of how the row stands (a ring for the row of those that ended), and a row's own
// helpers hang from that dot. A row at work has a soft ring that grows out of its dot and fades, slowly, again and again
const TWIG_STEP = 18
const TWIG_ENDED = '#4EBA65'
const TWIG_FAILED = '#E5484D'
const twigWidth = (t: Twig) => t.rails.length * TWIG_STEP + 36
const twigSvg = (t: Twig, line: number, dot: string, isMoving = false, shape: 'circle' | 'square' | 'diamond' | 'down' | 'up' | 'open' = 'circle') => {
  const mid = line / 2
  const x = (level: number) => level * TWIG_STEP + 9
  const own = x(t.rails.length)
  const at = own + TWIG_STEP
  const paths = [
    ...t.rails.flatMap((isOn, level) => (isOn ? [`M${x(level)} 0V${line}`] : [])),
    t.isLast ? `M${own} 0V${mid - 5}Q${own} ${mid} ${own + 5} ${mid}H${at - 5}` : `M${own} 0V${line}M${own} ${mid}H${at - 5}`,
    ...(t.hasKids ? [`M${at} ${mid + 5}V${line}`] : []),
  ]
  const ring = `<circle cx="${at}" cy="${mid}" r="3.5" fill="${dot}" opacity="0"><animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite"/></circle>`
  // A job's mark is its own shape, so only a helper has a round dot
  const shaped = {
    circle: `<circle cx="${at}" cy="${mid}" r="3.5" fill="${dot}"/>`,
    square: `<rect x="${at - 3.5}" y="${mid - 3.5}" width="7" height="7" rx="1" fill="${dot}"/>`,
    diamond: `<path d="M${at} ${mid - 4.5}L${at + 4.5} ${mid}L${at} ${mid + 4.5}L${at - 4.5} ${mid}Z" fill="${dot}"/>`,
    down: `<path d="M${at - 4.5} ${mid - 3.5}H${at + 4.5}L${at} ${mid + 4}Z" fill="${dot}"/>`,
    up: `<path d="M${at - 4.5} ${mid + 3.5}H${at + 4.5}L${at} ${mid - 4}Z" fill="${dot}"/>`,
    open: `<path d="M${at} ${mid - 4}L${at + 4} ${mid}L${at} ${mid + 4}L${at - 4} ${mid}Z" fill="none" stroke="${dot}" stroke-width="1.5"/>`,
  }[shape]
  const mark = dot
    ? `${isMoving ? ring : ''}${shaped}`
    : `<circle cx="${at}" cy="${mid}" r="3" fill="none" stroke="#808080" stroke-width="1.5"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${twigWidth(t)}" height="${line}" viewBox="0 0 ${twigWidth(t)} ${line}"><path d="${paths.join('')}" fill="none" stroke="#808080" stroke-opacity="0.7" stroke-width="1.5"/>${mark}</svg>`
}

// The same tree's lines carried down past a row, for each line of its own under it: the levels above that go on, its own line when
// rows under the same parent follow, and the line from its dot down to its own rows when it has them (17 Nov that one stopped at
// a helper's second line, so its commands hung from nothing)
const railSvg = (t: Twig, line: number) => {
  const x = (level: number) => level * TWIG_STEP + 9
  const paths = [
    ...t.rails.flatMap((isOn, level) => (isOn ? [`M${x(level)} 0V${line}`] : [])),
    ...(t.isLast ? [] : [`M${x(t.rails.length)} 0V${line}`]),
    ...(t.hasKids ? [`M${x(t.rails.length + 1)} 0V${line}`] : []),
  ]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${twigWidth(t)}" height="${line}" viewBox="0 0 ${twigWidth(t)} ${line}"><path d="${paths.join('') || 'M0 0'}" fill="none" stroke="#808080" stroke-opacity="0.7" stroke-width="1.5"/></svg>`
}

// Work the chat's own record was already looked through for
const helpersChecked = new Set<string>()
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
const sync = async ($: EngineInterface) => {
  const listed = await $.agent.list().catch(() => undefined)
  const live = listed ?? []
  const now = await $.clock.now()
  // Work the mod never saw start (it was running when the mod was installed or renamed) that no loop is said to have started:
  // the chat's own Agent calls tell a piece of work from a helper whose start the engine did not record
  // A card taken for a helper that way is looked at again
  const known = new Map((await read($, todos)).map(one => [one.id, one.parentId] as const))
  const isUnseen = live.some(
    one => (!known.has(one.id) || known.get(one.id) === HELPER) && !helpersChecked.has(one.id) && (one.status === 'running' || one.status === 'pending') && !one.parentId && one.type !== 'fork',
  )
  if (isUnseen) during('read the chat for its tasks')
  const rows = isUnseen ? await $.session.messages().catch(() => []) : []
  const ownCalls = new Set(
    (Array.isArray(rows) ? rows : []).flatMap(row => (row.toolUses ?? []).filter(use => use.tool === 'Agent').map(use => String(use.input?.description ?? ''))).filter(Boolean),
  )
  // The chat is read once for each such work, not at every look
  if (isUnseen) for (const one of live) if (!one.parentId) helpersChecked.add(one.id)
  await changeTodos($, list => {
    const cards = new Map(list.map(one => [one.id, one] as const))
    let isChanged = false
    for (const one of live) {
      const card = cards.get(one.id)
      const next: Todo | undefined = !card
        ? one.status === 'running' || one.status === 'pending'
          ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
            started(one.id, one.parentId ?? (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
          : undefined
        : // Stopped from outside Claudopus, as by the app's own stop
          card.status === 'working' && one.status === 'killed'
          ? ended(card, stoppedAs(card), now)
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
  // A run Claude Code lists as over, or no longer lists, whose card is still at work
  if (listed) await lookOver($, live, now).catch(err => log($, `runs that are over not looked at: ${String(err)}`))
  // A command run on the person's press that a reload left running is followed again by this load
  await followRuns($).catch(err => log($, `commands run on a press not followed: ${String(err)}`))
  await lookEnds($)
  await saveKeep($).catch(err => log($, `work at work not kept: ${String(err)}`))
}

// The folder the engine keeps this chat's agents' records in
const agentsFolder = async ($: EngineInterface, chat: string) => `${(await $.env.get('HOME')) ?? ''}/.claude/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}/${chat}/subagents`
// An agent's last words from the end of its record: what it handed in, or the text of its last reply, whether Claude Code pressed
// it for a report after them, and when the record was last written
const lastWordsOf = async ($: EngineInterface, folder: string, agent: string, now: number) => {
  const path = `${folder}/agent-${agent}.jsonl`
  const stat = await $.fs.stat(path).catch(() => undefined)
  const at = stat?.mtimeMs || now
  const size = stat?.size ?? 0
  const tail = (size > 0 && size < 2_000_000 ? await readOr($, path) : ((await $.process.run(['tail', '-c', '400000', path]).catch(() => undefined))?.stdout ?? '')).split('\n')
  let answer = ''
  let isHandback = false
  const isPressed = isPressedAtEnd(tail.map(row => parsedOr<unknown>(row, {})))
  for (const row of tail.reverse()) {
    const o = parsedOr<{ type?: string; message?: { content?: unknown } }>(row, {})
    if (o.type !== 'assistant' || !Array.isArray(o.message?.content)) continue
    const blocks = o.message.content as { type?: string; name?: string; text?: string; input?: { message?: unknown } }[]
    isHandback = blocks.some(b => b.type === 'tool_use' && b.name === 'SubagentHandback')
    answer = blocks.map(b => (b.type === 'tool_use' && b.name === 'SubagentHandback' && typeof b.input?.message === 'string' ? b.input.message : b.type === 'text' ? (b.text ?? '') : '')).join('').trim()
    // (the line Claude Code's press was answered with is no words of its own)
    if (answer === PRESS_ANSWER) answer = ''
    if (answer) break
  }
  return { at, answer: answer.slice(0, ANSWER_CHARS), isHandback, isPressed }
}
// ---- A run that is over while its card is still at work ----

// A task pauses by ending its step, and Claude Code starts its next step when a command or a helper of its own ends, or when the
// person's answer or words reach it: its card stays at work meanwhile. A run is over for good only when nothing of its own runs
// and nothing on its card waits for the person. Then its card ends: done when its result was received (handed in while Claudopus
// was away, or its last words where Claude Code never pressed it for a hand-back, so took them as its result), and failed
// otherwise, saying it ended without its result. A helper's card ends done either way: its words went to its task
// A run only the list shows as over is given OVER_GRACE first, as Claude Code may be about to start its next step (a helper's
// result on its way to it); one not listed at all must have been quiet for UNHEARD_QUIET, its record saying it finished
const OVER_GRACE = 30_000
const UNHEARD_QUIET = 60_000
const overSince = new Map<string, number>()
const lookOver = async ($: EngineInterface, live: { id: string; status: string }[], now: number, heard = '') => {
  const { id: chat } = await read($, me)
  if (!dir || isOff) return
  const list = await read($, todos)
  const statusOf = (one: Todo) => live.find(agent => agent.id === one.id)?.status
  const isOver = (one: Todo) => one.status === 'working' && !one.chat && (one.id === heard || !turnEnding.has(one.id)) && !WORKING.includes(String(statusOf(one))) && statusOf(one) !== 'killed' && !ownsWork(list, one) && !needsPerson(one) && !waiting.some(p => p.agent === one.id)
  for (const id of [...overSince.keys()]) if (!list.some(one => one.id === id && isOver(one))) overSince.delete(id)
  const folder = chat ? await agentsFolder($, chat) : ''
  // The deepest first, so a task whose last helper ends in this look is looked at with it ended
  const depth = (one: Todo) => (one.parentId ? 1 : 0)
  const endedNow: string[] = []
  for (const one of list.filter(isOver).sort((a, b) => depth(b) - depth(a))) {
    const isListed = statusOf(one) !== undefined
    if (one.id !== heard) {
      const since = overSince.get(one.id) ?? now
      overSince.set(one.id, since)
      if (isListed ? now - since < OVER_GRACE : now - Math.max(one.startedAt, one.newAt ?? 0) < UNHEARD_QUIET) continue
    }
    // One no longer listed is over only when its own record says it finished
    // (one whose turn's end was just heard is over by that)
    const isHeard = one.id === heard
    if (!isListed && !isHeard && parsedOr<{ finished?: boolean }>(folder ? await readOr($, `${folder}/agent-${one.id}.meta.json`) : '', {}).finished !== true) continue
    const words = isListed || isHeard ? { answer: '', isHandback: false, isPressed: !(await isUnpressed($, one.id)), at: now } : await lastWordsOf($, folder, one.id, now)
    const isFailed = statusOf(one) === 'failed'
    const answer = words.answer || one.answer
    // Received: handed in, or its last words where Claude Code pressed for no hand-back
    const isReceived = !isFailed && (words.isHandback || (!words.isPressed && Boolean(answer.trim())))
    await changeTodos($, all =>
      all.map(card => {
        if (card.id !== one.id || card.status !== 'working' || ownsWork(all, card) || needsPerson(card)) return card
        endedNow.push(card.id)
        if (card.parentId) return { ...ended(card, isFailed ? 'failed' : 'done', Math.min(words.at, now)), answer, ...(isFailed ? { why: WHY_ERROR } : {}) }
        return isReceived ? { ...ended(card, 'done', now), answer, reportAt: now } : { ...ended(card, 'failed', now), answer, why: isFailed ? WHY_ERROR : WHY_NO_RESULT }
      }),
    )
    overSince.delete(one.id)
    const card = (await read($, todos)).find(c => c.id === one.id)
    if (card && !card.parentId && card.status === 'done' && card.answer.trim()) $.clock.after(5, () => void saveReport($, card, card.answer).catch(err => log($, `report of ${card.id} not kept: ${String(err)}`)))
  }
  if (!endedNow.length) return
  for (const id of endedNow) if (id !== heard) await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
  await log($, `runs that were over ended on their cards: ${endedNow.join(', ')}`)
  await lookEnds($)
  redraw($)
}

// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
// (`isOwn`: a helper's own card where it has one, as for its to-dos, which are never the task's above it)
const change = async ($: EngineInterface, agentId: string, fn: (one: Todo, at: number) => Todo, isOwn = false) => {
  const now = await $.clock.now()
  if (!(await read($, todos)).some(one => one.id === agentId)) await sync($)
  await changeTodos($, list => {
    const id = isOwn && list.some(one => one.id === agentId) ? agentId : topOf(list, agentId)
    return list.map(one => (one.id === id ? fn(one, now) : one))
  })
  // Work that was running before the panel had ever opened brings it up with its first line
  await openList($)
}

// The person dismisses the card of a task that has ended, whatever it still asks (18 Nov: "Either way, I should have the ability to
// just close it"): it goes under Finished and stays there, kept on the card so a reload keeps it too, and comes back up only when
// the task works again (resumed). Its result stays in Results, where its open questions are still answered
const isDismissed = (one: Todo) => one.status !== 'working' && Boolean(one.closedAt)
// The cards pressed Dismiss on whose write has not landed: drawn dismissed from the press itself (asPressed), so a drawing the app
// asks for between the press and the write, which the panel then keeps while the person uses it, never shows it at the top (18 Nov,
// the person: "when I click this, the message should go below the finished")
const dismissedNow = new Map<string, number>()
const dismiss = async ($: EngineInterface, id: string) => {
  // (marked from the press's own time, so the card's green moment is drawn from the press itself, in the place it stood)
  const at = await $.clock.now()
  dismissedNow.set(id, at)
  redraw($)
  // Its moment over, it is drawn again, under Finished
  $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
  // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
  await changeTodos($, list => list.map(one => (one.id === id && one.status !== 'working' && !one.closedAt ? { ...one, closedAt: at, ask: undefined } : one))).finally(() => dismissedNow.delete(id))
  redraw($)
  await saveFinished($).catch(err => log($, `finished work not kept: ${String(err)}`))
}
// Writes a line into a piece of work's own chat, which it reads at its next step
const tell = ($: EngineInterface, id: string, text: string) =>
  $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] }, agentId: id }).catch(async err => void (await log($, `work ${id} not told: ${String(err)}`)))

const stop = async ($: EngineInterface, id: string) => {
  if ((await read($, todos)).some(one => one.id === id && one.status === 'working')) pressed.add(id)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: id }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (pressed.delete(id), log($, `work ${id} not stopped: ${r.deny}`))
  stoppedHere.add(id)
  const before = await read($, todos)
  const card = before.find(one => one.id === id)
  // A press on Stop is the person's own stop, kept on the card so a reload keeps it too: what was already finished stays finished
  const isYours = Boolean(card && card.status === 'working')
  // Its helpers and the commands it, or they, started in the background end with it
  const under = [card, ...underOf(before, id)].filter((one): one is Todo => Boolean(one))
  await stopHelpers($, id)
  if (isYours) for (const b of under.flatMap(one => one.bg ?? [])) await $.tool.call({ tool: 'TaskStop', task_id: b.id }).catch(() => undefined)
  // Answers that were on their way to it before the stop are dropped: none wakes it
  if (isYours) for (let at = wakes.length - 1; at >= 0; at -= 1) if (under.some(one => one.id === wakes[at]?.target)) wakes.splice(at, 1)
  const now = await $.clock.now()
  await changeTodos($, list =>
    list.map(one =>
      one.id === id && one.status === 'working'
        ? { ...ended(one, stoppedAs(one), now), ...(isYours ? { byYou: { at: now }, ask: undefined } : {}) }
        : isYours && one.id !== id && under.some(kid => kid.id === one.id) && one.status !== 'done'
          ? // Its helpers, stopped with it, are held with it
            { ...(one.status === 'working' ? ended(one, 'stopped', now) : one), byYou: { at: now } }
          : one,
    ),
  )
  // A helper stopped so: the work above it is told in its own chat; the chat is told as the engine's notice of the stop comes
  if (isYours && card?.parentId && card.parentId !== HELPER) await tell($, card.parentId, named(STOPPED_BY_YOU(titleOf(card), id)))
  await lookEnds($)
  await saveKeep($).catch(err => log($, `work at work not kept: ${String(err)}`))
}

// A task the person stopped, or one that failed, started again by their press on its card: a message from the panel in their
// name, which lifts the hold. Nothing else starts it again
const startAgain = async ($: EngineInterface, id: string) => {
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || !((one.status === 'stopped' && one.byYou) || one.status === 'failed')) return
  const target = one.parentId && one.parentId !== HELPER ? `the task "${titleOf((await read($, todos)).find(todo => todo.id === one.parentId) ?? one)}" (${one.parentId}), to start again its helper` : 'the task'
  const why = one.status === 'failed' ? `which had failed${one.why ? ` (${one.why.charAt(0).toLowerCase()}${one.why.slice(1)})` : ''}` : 'which they had stopped'
  await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "Start again" on "${titleOf(one)}" (${id}), ${why}. Start it again: send ${target} "${titleOf(one)}" (${id}) a message with SendMessage so it continues from where it stopped.`)
}

// Moves running work to another model: its card names it at once, each step it sends from now on goes to it, and the work is
// told in its own chat, where the panel shows the change as a line of its own
const choose = async ($: EngineInterface, id: string, model: string) => {
  await update($, view, v => ({ ...v, picking: '' }))
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || one.status !== 'working' || modelName(one.chosen ?? one.model ?? '') === modelName(model)) return
  await changeTodos($, list => list.map(todo => (todo.id === id ? { ...todo, model, chosen: model } : todo)))
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
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => (log($, `panel not opened with the others: ${String(err)}`), undefined))
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
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened: ${String(err)}`))
}

// Keeps the list true while work runs: the engine's list, and the minutes
// Work that has ended, kept on disk for good, one file per chat (finished/<chat id>.json): the Finished list survives a
// reload and a restart of the app. Its chat is the engine's own record of the work, read again when it is opened
const finishedPath = (chatId: string) => `${dir}/finished/${chatId}.json`
let finishedSaved = ''
const saveFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  // Its helpers are kept with it, so its Details still lists them after a reload
  const all = await read($, todos)
  const ended = all.filter(one => one.status !== 'working' && (!one.parentId || all.some(top => top.id === topOf(all, one.id) && !top.parentId && top.status !== 'working')))
  const sign = ended.map(one => [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title, one.byYou ? `${one.byYou.at}${one.byYou.isLifted ? 'l' : ''}` : '', one.closedAt ?? ''].join(':')).join(',')
  if (!id || !dir || !ended.length || sign === finishedSaved) return
  const old = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  const kept = capped([...old.filter(one => !ended.some(card => card.id === one.id)), ...ended].sort((a, b) => a.endedAt - b.endedAt))
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
  during('read back ended work')
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
        await breathe($)
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
    await changeTodos($, now => capped(byEnd([...found.filter(one => !now.some(card => card.id === one.id && !isBare(card))), ...now.filter(card => !(isBare(card) && found.some(one => one.id === card.id)))])))
}

// What was kept comes back into the list when the chat loads, below anything the list already holds
const loadFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id) return
  const kept = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  if (!Array.isArray(kept) || !kept.length) return
  await changeTodos($, list => {
    // A command lasts while the app is open: what a finished card had running did not outlive the load
    const fresh = kept.filter(one => one.id && one.status !== 'working' && !list.some(card => card.id === one.id)).map(one => ({ ...one, stuckAt: undefined, bg: undefined }))
    return fresh.length ? capped(byEnd([...fresh, ...list])) : list
  })
}

const follow = async ($: EngineInterface) => {
  await sync($)
  await lookJobs($).catch(err => log($, `jobs not read: ${String(err)}`))
  await lookStuck($).catch(err => log($, `stuck work not looked for: ${String(err)}`))
  await saveFinished($).catch(err => log($, `finished work not kept: ${String(err)}`))
  const isShown = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (isShown !== (await read($, paneShown))) await update($, paneShown, () => isShown)
  // Reports another chat kept since are listed here too
  await loadReports($).catch(() => undefined)
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
