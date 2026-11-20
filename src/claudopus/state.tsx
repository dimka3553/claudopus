// ---- One stage for a task's card ----

// A card stands in one of six stages, and its colour, its line, its place in the panel, the header's counts, the octopus, the
// sound, the notifications and what other chats see all read it here; nothing else decides
// - working (purple): from its start until its result, whether it takes steps or has ended a step with commands or helpers of its
//   own running
// - waiting (amber): only while something of its own waits for the person: a question, a permission, a key or password box, or
//   what its handed-in result still asks of them (a release, a choice), until they reply or mark it done (20 Nov, the person:
//   "'Delivered' should only mean after it's already been deployed or the task has actually completed")
// - delivered (blue): only by handing in its result with nothing left to ask, every to-do ticked or dropped and nothing of its own running; a server
//   it left for the person keeps its row under the card. The result is the person's to look at: a reply puts it back to work
// - done (green): only by the person's Mark as done on a delivered card, which puts it under Finished (19 Nov, the person:
//   "distinguish between something that's completely done, which is something that you can mark as done as a person, and
//   something that's in the intermediate state"). A card that finished before cards stayed up is done, as it was
// - stopped (grey): only by the person's Stop, or the chat's on their word
// - failed (red): it could not go on, and its card says why
type Stage = 'working' | 'waiting' | 'delivered' | 'done' | 'stopped' | 'failed'
type Staged = Pick<Todo, 'status' | 'up' | 'closedAt' | 'questions'> & Parameters<typeof needsPerson>[0]
// Handed in its result, and what the result leaves open for the person is still unanswered: it waits, its questions listed under its
// line with Reply and Mark as done, until a reply puts it back to work or they mark it done
const asksOnResult = (card: Pick<Todo, 'status' | 'up' | 'closedAt' | 'questions'>) => card.status === 'done' && Boolean(card.up) && !card.closedAt && Boolean(card.questions?.length)
const stageOf = (_list: readonly Staged[], card: Staged): Stage => {
  if (card.status === 'failed' || card.status === 'stopped') return card.status
  if (needsPerson(card) || asksOnResult(card)) return 'waiting'
  return card.status === 'done' ? (card.up && !card.closedAt ? 'delivered' : 'done') : 'working'
}
// Just marked done by the person: for its two seconds the card stays where it was, green, before it goes under Finished
// (19 Nov, the person: "Done stays exactly where the delivered was when you mark it as done. It should always play the green
// animation")
// Its two seconds count from the first drawing of the panel made that shows it, never from the press: right after an update the
// panel's drawings came seconds late, so a moment counted from the press was over before any drawing showed it, and the card went straight
// under Finished with no green, no octopus and no sound while the next delivered card, alike, slid into its place: the press seemed
// to do nothing (19 Nov, the person: "I clicked Mark as done two times, and the animation didn't play. The sound didn't play")
// Each press of this load's, until its moment is first drawn (shownAt 0), and from when; one never drawn is over DONE_UNSEEN on
const doneMoments = new Map<string, { pressedAt: number; shownAt: number }>()
const DONE_UNSEEN = 10_000
const isDoneMoment = (one: Pick<Todo, 'id' | 'status' | 'closedAt'>, at: number) => {
  const moment = doneMoments.get(one.id)
  if (one.status !== 'done' || !one.closedAt || !moment || moment.pressedAt !== one.closedAt) return false
  // (a drawing begun before the first one showing it was made, as that very drawing, is in the moment too)
  return at >= moment.pressedAt && (moment.shownAt ? at - moment.shownAt < LINGER : at - moment.pressedAt < DONE_UNSEEN)
}
// Whether it handed in its result: delivered, or marked done by the person
const hasResult = (stage: Stage) => stage === 'delivered' || stage === 'done'
// Each stage in the words a card says it with, and its colour
const STAGE_WORD: Record<Stage, string> = { working: 'Working', waiting: 'Waiting for you', delivered: 'Delivered', done: 'Done', stopped: 'Stopped', failed: 'Failed' }
const stageColor = (stage: Stage) => ({ working: LIVE, waiting: NEEDS, delivered: DELIVERED, done: DONE, stopped: undefined, failed: 'error' })[stage]
// Why a card failed, where it says so
const WHY_NO_RESULT = 'Ended without its result'
const WHY_APP_CLOSED = 'The app closed while it worked'
const WHY_ERROR = 'Ended with an error'
const WHY_FLAGGED = 'Ended by a safety check'

// A server runs until it is stopped: it never ends by itself, so a task may finish with one left for the person
// (a build by a tool that also serves, as `vite build`, ends)
const isServerRun = (cmd: string | undefined, what: string) => (SERVER_CMD.test(cmd ?? '') && !/\b(vite|next|nuxt|astro) build\b/.test(cmd ?? '')) || describedOf(what).kind === 'server'
// The commands of its own that end by themselves and still run: every row of its card but a server's
const ownRuns = (card: Todo | undefined) => (card?.bg ?? []).filter(b => !isServerRun(b.cmd, b.what))
// Its helpers at work
const helpersAtWork = (list: Todo[], id: string) => list.filter(one => one.parentId === id && one.status === 'working')
// Whether something of its own runs: a command that ends by itself, or a helper at work
const ownsWork = (list: Todo[], card: Todo) => ownRuns(card).length > 0 || helpersAtWork(list, card.id).length > 0
// Whether Claude Code pressed it for its report as its run ended, after its last call: the sign that its words reached no one (the
// chat is told only that it "ended without delivering a report"). A run where the engine asks for no report, as headless ones, ends
// with its words as its result
const isPressedAtEnd = (rows: unknown) => {
  if (!Array.isArray(rows)) return false
  for (const row of [...rows].reverse()) {
    const m = (row && typeof row === 'object' && 'message' in row ? (row as { message?: unknown }).message : row) as { role?: unknown; content?: unknown } | undefined
    const blocks: unknown[] = Array.isArray(m?.content) ? m.content : [m?.content]
    const texts = blocks.map(b => (typeof b === 'string' ? b : b && typeof b === 'object' ? String((b as { text?: unknown }).text ?? '') + (typeof (b as { content?: unknown }).content === 'string' ? String((b as { content?: unknown }).content) : '') : ''))
    if (m?.role === 'assistant' && blocks.some(b => b && typeof b === 'object' && (b as { type?: unknown }).type === 'tool_use')) return false
    if (m?.role === 'user' && texts.some(text => text.includes(HANDBACK_PRESS))) return true
  }
  return false
}
// Whether Claude Code took the run's last words as its result: it never pressed it for a hand-back. Its messages unread, it may
// have been pressed, so it has not
const isUnpressed = async ($: EngineInterface, id: string) => {
  const rows = await $.session.messages({ as: 'api', agentId: id }).catch(() => undefined)
  return Array.isArray(rows) && !isPressedAtEnd(rows)
}
// Its result was received: handed in with SubagentHandback, or its run's last words where Claude Code took those as its result
const hasReport = (one: Todo | undefined) => one?.reportAt !== undefined

// Every change to the cards goes through here: a task's card cannot be kept as done without its received result, whatever path
// would end it so. It stays as it was before the change
const holdDone = (before: Todo[], next: Todo[]) => {
  if (isOff) return next
  const was = new Map(before.map(one => [one.id, one]))
  return next.map(one => {
    const old = was.get(one.id)
    const isHeld = !one.parentId && !one.chat && one.status === 'done' && !hasReport(one) && old?.status === 'working'
    // (what the person allowed it under "Ask once per piece of work" ends with it, and only once it really ends)
    if (old?.status === 'working' && one.status !== 'working' && !isHeld) (workAllowed.delete(one.id), releaseAllowed.delete(one.id), gateOnce.delete(one.id))
    return isHeld && old ? { ...old, answer: one.answer || old.answer } : one
  })
}
