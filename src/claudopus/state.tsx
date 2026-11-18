// ---- One state for a task's card: done only once its report is in ----

// A task of this chat's stands in one of these, and its card, the panel's counts, the chat's notes and the results list all go by it:
// - working: taking steps, or ended a step that Claudopus starts again (carrying it on)
// - waiting-you: a question or an Allow of its waits on its card for the person
// - waiting-own: its step ended while something of its own runs that starts it again when it ends: a command in the background or
//   detached, a helper at work, a watch, what it asked Claudopus to wake it for, or a heavy command held for its turn
// - done: it handed back its report with SubagentHandback, and Claudopus received it as its report (or, in a run Claude Code never
//   pressed for a hand-back, its last words were taken as its result). Nothing else makes it done: not its commands or helpers
//   ending, not its step ending, not the engine listing its run as over, not words written after Claude Code pressed for its report
// - stopped or failed: the person or the chat stopped it, Claudopus gave up starting it again, or its run failed
// (18 Nov: a site-building task's card showed done for half an hour with 4 of 7 to-dos left, and no report ever came. A preview
// server it left running counted as work that would start it again, so nothing kept it going, and as its run ended the card ended done)
type TaskState = 'working' | 'waiting-you' | 'waiting-own' | 'done' | 'stopped' | 'failed'

// A server runs until it is stopped: it never ends by itself, so it never starts the work that left it again
const isServerRun = (cmd: string | undefined, what: string) => SERVER_CMD.test(cmd ?? '') || describedOf(what).kind === 'server'
// What of its own starts the work again by itself once its step has ended: its commands in the background or detached that end
// (a watch counts, as its lines reach it; a server does not), its helpers at work, and what it asked Claudopus to wake it for or a
// heavy command held for its turn
const wakesOf = (list: Todo[], card: Todo) => {
  const runs = [...(card.bg ?? []).filter(b => !isServerRun(b.cmd, b.what)), ...(card.detached ?? []).filter(d => !isServerRun(d.cmd, d.what))]
  const helpers = runningHelpers(list, card.id).length
  const isWoken = card.wakeWhen !== undefined || isTurnWaited(list, card.id)
  return { runs, helpers, isWoken, isAny: runs.length > 0 || helpers > 0 || isWoken }
}
// Whether Claude Code took the run's last words as its result: it never pressed it for a hand-back. Its messages unread, it may
// have been pressed, so it has not
const isUnpressed = async ($: EngineInterface, id: string) => {
  const rows = await $.session.messages({ as: 'api', agentId: id }).catch(() => undefined)
  return Array.isArray(rows) && !isPressedAtEnd(rows) && !isLetEnd((await read($, todos)).find(one => one.id === id))
}
// Claudopus received its report: it handed it back with SubagentHandback (or its unpressed run ended with it), and its turn ended
// with that report as its result
const hasReport = (one: Todo | undefined) => one?.reportAt !== undefined
// The one place a task's state is read from
const stateOf = (list: Todo[], one: Todo): TaskState => {
  if (one.status === 'done' || one.status === 'stopped' || one.status === 'failed') return one.status
  if (needsPerson(one)) return 'waiting-you'
  return one.endedStepAt !== undefined && wakesOf(list, one).isAny ? 'waiting-own' : 'working'
}
// What a task's card line says while it waits on its own work, by what it waits for; '' in any other state
const ownWorkWords = (list: Todo[], one: Todo) => {
  if (stateOf(list, one) !== 'waiting-own') return ''
  const { runs, helpers } = wakesOf(list, one)
  const what = [runs.length ? (runs.length === 1 ? 'its command' : 'its commands') : '', helpers ? (helpers === 1 ? 'its helper' : 'its helpers') : ''].filter(Boolean).join(' and ')
  return what ? `Waiting for ${what}` : 'Waiting to be started again'
}

// Every change to the cards goes through here: a task's card that would end done without its report stays at work, as it was before
// the change, its step ended. Any path that ends a card (the end of its turn, the engine's list, a look after a reload) is held to it
// The ids held so, for Claudopus to start each again that nothing of its own starts (doneHeld)
const holdDone = (before: Todo[], next: Todo[], now: number) => {
  const held: string[] = []
  if (isOff) return { list: next, held }
  const was = new Map(before.map(one => [one.id, one]))
  const list = next.map(one => {
    if (one.parentId || one.chat || one.status !== 'done' || hasReport(one)) return one
    // (only a card at work: one read back from the chat's records ended before Claudopus kept it, as its records say)
    const old = was.get(one.id)
    if (old?.status !== 'working') return one
    held.push(one.id)
    const base = old
    return { ...base, status: 'working' as const, endedAt: 0, answer: one.answer || base.answer, answeredAt: undefined, endedStepAt: base.endedStepAt ?? now }
  })
  return { list, held }
}
// Cards held from ending done without their report: one that waits on its own work waits; any other is started again to carry on,
// as a task stopped partway is, until it hands back its report or Claudopus gives up and ends it stopped
const doneHeld = async ($: EngineInterface, ids: string[]) => {
  for (const id of ids) {
    const list = await read($, todos)
    const one = list.find(card => card.id === id)
    if (!one || one.status !== 'working') continue
    // (a run Claude Code never pressed for a hand-back ended with its last words as its result: it is done with them)
    if (await isUnpressed($, id)) {
      const now = await $.clock.now()
      await changeTodos($, cards => cards.map(card => (card.id === id && card.status === 'working' ? { ...ended(card, 'done', now), reportAt: now } : card)))
      await lookEnds($)
      continue
    }
    if (wakesOf(list, one).isAny) {
      await log($, `work ${id} would have ended done without its report: it waits on its own work`)
      continue
    }
    if (!isStoppedShort(one, '')) {
      await log($, `work ${id} would have ended done without its report: kept at work`)
      continue
    }
    await log($, `work ${id} would have ended done without its report: started again to carry on`)
    await goOn($, id, 'its card would have ended done without its report')
  }
}
