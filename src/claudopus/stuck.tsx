// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, the
// card of work under which nothing new has come back for STUCK_AFTER, and finished work that something it started still holds

// Nothing new for this long anywhere under a piece of work, while it works, and its card says so and the chat is told once. Above
// the longest one command can run (ten minutes) with a step either side of it, so a single long build or wait is not flagged
const STUCK_AFTER = 12 * 60_000
// One call running this long shows on its row, with its time
const RUNNING_SHOWN = 2 * 60_000
// Lines each agent has seen come back, so a wait that returns what it returned before is no news; kept to this many each
const SEEN_KEPT = 5000

// The calls running now, by tool_use_id: whose, what, since when
const inFlight = new Map<string, { agent: string; what: string; at: number }>()
const seenLines = new Map<string, Set<string>>()

// What a running call is, in a few words, for its row
const runningWhat = (tool: string) =>
  tool === 'Bash' ? 'one command running' : tool === 'Grep' || tool === 'Glob' ? 'one search running' : tool === 'Agent' ? 'waiting on its helper' : tool === 'Monitor' ? 'watching' : `${tool.replace(/^mcp__[^_]+__/, '')} running`

// A result as lines: its text where it has some, else its parts each on a line of their own
const resultLines = (result: unknown): string[] => {
  const text =
    typeof result === 'string'
      ? result
      : Array.isArray((result as { content?: unknown })?.content)
        ? ((result as { content: { text?: unknown }[] }).content.map(part => String(part.text ?? '')).join('\n'))
        : result && typeof result === 'object'
          ? Object.values(result as Record<string, unknown>).map(value => (typeof value === 'string' ? value : JSON.stringify(value) ?? '')).join('\n')
          : String(result ?? '')
  // Digits are left out, so a wait that only prints a new time or count says nothing new
  return text.split('\n').map(line => line.trim().replace(/\d/g, '#').slice(0, 300)).filter(Boolean)
}

// The longest-running call of an agent, as its card keeps it
const runningOf = (agent: string) => [...inFlight.values()].filter(one => one.agent === agent).sort((a, b) => a.at - b.at)[0]

// A call of a piece of work begins: its card keeps the one it has been running longest
const callBegun = async ($: EngineInterface, id: string, agent: string, tool: string) => {
  const now = await $.clock.now()
  inFlight.set(id, { agent, what: runningWhat(tool), at: now })
  const running = runningOf(agent)
  await update($, todos, list => list.map(one => (one.id === agent && one.running?.at !== running?.at ? { ...one, running: running ? { what: running.what, at: running.at } : undefined } : one)))
}

// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
const callEnded = async ($: EngineInterface, id: string, agent: string, tool: string, r: { result?: unknown; deny?: unknown } | undefined) => {
  inFlight.delete(id)
  const now = await $.clock.now()
  let isNew = false
  if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
    const seen = seenLines.get(agent) ?? new Set<string>()
    for (const line of resultLines(r.result)) if (!seen.has(line)) ((isNew = true), seen.add(line))
    if (seen.size > SEEN_KEPT) seenLines.set(agent, new Set([...seen].slice(-SEEN_KEPT)))
    else seenLines.set(agent, seen)
  }
  const running = runningOf(agent)
  await update($, todos, list =>
    list.map(one => (one.id !== agent ? one : { ...one, running: running ? { what: running.what, at: running.at } : undefined, newAt: isNew ? now : one.newAt })),
  )
}

// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
const movedAt = (list: Todo[], top: Todo) => Math.max(...[top, ...underOf(list, top.id)].map(one => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0)))

// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work asking the person something waits on them, and is not flagged
const lookStuck = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const told: Todo[] = []
  await update($, todos, list => {
    let isChanged = false
    const next = list.map(one => {
      if (one.parentId || one.chat) return one
      const isStuck = one.status === 'working' && !one.ask && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined })
      return one
    })
    return isChanged ? next : list
  })
  for (const one of told) await sayInChat($, named(STUCK_IN_CHAT(titleOf(one), Math.round((now - movedAt(await read($, todos), one)) / 60_000))))
}

// What a stuck card says, in place of its line: how long nothing new has come back, and what is running under it
const stuckLine = (list: Todo[], one: Todo, at: number) => {
  if (!one.stuckAt) return ''
  const mins = Math.max(1, Math.round((at - one.stuckAt) / 60_000))
  const helpers = underOf(list, one.id).filter(kid => kid.status === 'working')
  const waiting = helpers.filter(kid => kid.running)
  return `Nothing new for ${mins} min.${helpers.length ? (waiting.length === helpers.length ? ` ${helpers.length === 1 ? 'Its helper keeps' : helpers.length === 2 ? 'Both helpers keep' : `All ${helpers.length} helpers keep`} waiting.` : '') : one.running ? ` It keeps waiting on ${one.running.what.replace(/ running$/, '')}.` : ''}`
}

// A row's running call, with its time, once it has run RUNNING_SHOWN
const runningLine = (one: Todo, at: number) => (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? `${one.running.what} · ${took(at - one.running.at)}` : '')

// What finished work left running says on its card
const leftLine = (one: Todo, at: number) => (one.leftSince && one.status !== 'working' ? `It left something running in the background, ${took(at - one.leftSince)}` : '')
