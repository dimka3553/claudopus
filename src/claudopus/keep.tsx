// The chat's process and its ledger: every task of the chat is written to disk as it changes, so a task found at work after the
// process was replaced (the app quit, restarted or dropped the chat) is known to have been cut off, and carried on from what was
// written; and the watcher that brings Claudopus back should Claude switch it off

// ---- The ledger: every task of this chat, on disk, as it changes ----

// ledger/<chat>.json: the chat (its folder, its process, its link) and each of its tasks a person may still look at, whole: at work,
// waiting, delivered, stopped, failed or cut off, until dismissed or marked done, with its helpers at work. ledger/<chat>/<task>.brief.md
// holds the instructions a task was started with, and <task>.carry.md what a fresh task is told to carry it on. Written on every change
// of the cards (changeTodos), one write at a time, the file whole under another name and then moved, so a quit or a crash mid-write
// leaves the last whole one. keep/<chat>.json, which kept only the ids, titles and process, is read once for a chat that has no ledger
const LEDGER_DIR = 'ledger'
const ledgerFile = (chat: string) => `${dir}/${LEDGER_DIR}/${chat}.json`
const ledgerPart = (chat: string, task: string, kind: 'brief' | 'carry') => `${dir}/${LEDGER_DIR}/${chat}/${task}.${kind}.md`
const keepFile = (id: string, kind = 'json') => `${dir}/keep/${id}.${kind}`
type LedgerTask = { id: string; title: string; state: Stage; note: string; transcript: string; card: Todo }
type Ledger = { chat: string; title: string; folder: string; pid: string; savedAt: number; link?: Link; from?: string; tasks: LedgerTask[] }
// What a card is kept with: all but what moves at every step and what a load reads afresh (its commands and their output)
const LEDGER_ENTRIES = 30
const ledgerCard = (one: Todo): Todo => {
  const { running: _running, bg: _bg, seenJobs: _seen, endedRuns: _runs, newAt: _new, stuckAt: _stuck, stuckTold: _told, quiet: _quiet, owes: _owes, steps: _steps, tokens: _tokens, made: _made, ...kept } = one
  return { ...kept, tokens: 0, entries: one.entries.slice(-LEDGER_ENTRIES), answer: one.answer.slice(0, 4000) }
}
// The tasks the ledger holds: each one the panel still shows, and the helpers at work under them
const ledgerTasks = (list: Todo[]) => {
  const tops = list.filter(one => !one.chat && !one.parentId && (one.status === 'working' || !one.closedAt) && (one.status === 'working' || one.up))
  const ids = new Set(tops.map(one => one.id))
  return [...tops, ...list.filter(one => !one.chat && one.parentId && one.status === 'working' && ids.has(topOf(list, one.id)))]
}
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which ends nothing
let enginePid = ''
const pidOfEngine = async ($: EngineInterface) => ((await $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(() => undefined))?.stdout ?? '').trim()
// Written only once this load has read what the last process left (noteClosed), so a load never writes over it before it is read
let isLedgerRead = false
let ledgerSign = ''
// The chat whose ledger folder this load has made
let ledgerMade = ''
const saveLedger = async ($: EngineInterface) => {
  const { id, title } = await read($, me)
  if (!id || !dir || !isLedgerRead || !SAFE_CHAT.test(id)) return
  const list = await ownCards($)
  const agents = await agentsFolder($, id)
  const tasks = await Promise.all(ledgerTasks(list).map(async one => ({ id: one.id, title: titleOf(one), state: stageOf(list, one), note: ownNote(one)?.text ?? '', transcript: `${one.chatWas ? await agentsFolder($, one.chatWas) : agents}/agent-${one.id}.jsonl`, card: ledgerCard(one) })))
  const body = { chat: id, title, folder: cwd, pid: enginePid, ...(chatFrom ? { from: chatFrom } : {}), ...(myLink ? { link: myLink } : {}), tasks }
  const sign = JSON.stringify(body)
  if (sign === ledgerSign) return
  const path = ledgerFile(id)
  const ledger: Ledger = { ...body, savedAt: await $.clock.now() }
  if (ledgerMade !== id) (await $.process.run(['mkdir', '-p', `${dir}/${LEDGER_DIR}/${id}`]), (ledgerMade = id))
  await $.fs.write(`${path}.part`, JSON.stringify(ledger, null, 1))
  const r = await $.process.run(['mv', '-f', `${path}.part`, path])
  if (r.exitCode !== 0) throw new Error(`ledger not moved into place: ${r.stderr.slice(0, 200)}`)
  ledgerSign = sign
}
// One write at a time; a change made while one is written is written after it
// and at most one every LEDGER_GAP: the list changes at every call of every task, and each save builds the whole ledger to see
// whether it differs (27 Nov: as costly as the change itself). A change that comes sooner is saved when the gap is over, so a quit
// or a crash loses at most that long
const LEDGER_GAP = 2000
let isLedgerBusy = false
let isLedgerDue = false
let ledgerAt = 0
const saveLedgerSoon = ($: EngineInterface) => {
  if (isLedgerBusy) return void (isLedgerDue = true)
  isLedgerBusy = true
  void (async () => {
    try {
      do {
        const wait = isTimed ? ledgerAt + LEDGER_GAP - Date.now() : 0
        if (wait > 0) await new Promise<void>(done => void $.clock.after(wait, done))
        isLedgerDue = false
        ledgerAt = Date.now()
        await saveLedger($).catch(err => log($, `ledger not written: ${String(err)}`))
      } while (isLedgerDue)
    } finally {
      isLedgerBusy = false
    }
  })()
}
const saveKeep = async ($: EngineInterface) => saveLedger($)
const parsedOr = <T,>(text: string, or: T): T => {
  try {
    return text ? (JSON.parse(text) as T) : or
  } catch {
    return or
  }
}
const isTaskId = (one: unknown): one is string => typeof one === 'string' && /^[\w-]{1,80}$/.test(one)
const isKeptCard = (one: unknown): one is Todo => {
  const card = one as Partial<Todo> | undefined
  return Boolean(card) && isTaskId(card?.id) && typeof card?.title === 'string' && Array.isArray(card?.items) && Array.isArray(card?.entries) && typeof card?.status === 'string'
}
// The cards a ledger holds, read as cards; an older chat's keep file gives each task at work its title alone
const keptCards = (text: string, now: number): { pid: string; cards: Todo[]; savedAt: number } => {
  const was = parsedOr<Partial<Ledger> & { ids?: unknown; titles?: unknown; at?: unknown }>(text, {})
  const pid = typeof was.pid === 'string' ? was.pid : ''
  const savedAt = Number(was.savedAt ?? was.at) || 0
  if (Array.isArray(was.tasks)) return { pid, savedAt, cards: was.tasks.map(one => (one as Partial<LedgerTask>)?.card).filter(isKeptCard) }
  const titles = Object.entries(was.titles && typeof was.titles === 'object' ? (was.titles as Record<string, unknown>) : {}).filter((pair): pair is [string, string] => isTaskId(pair[0]) && typeof pair[1] === 'string')
  return { pid, savedAt, cards: titles.map(([id, title]) => started(id, '', title, '', now)) }
}
// A task the app's close cut off: its run is gone, and its card says so until the person carries it on or dismisses it. What it
// asked the person stays on it, and an answer carries it on (toEnded)
const QUIT_WINDOW = 60_000
const cutOff = (one: Todo, now: number): Todo => ({ ...ended(one, 'failed', now), why: WHY_APP_CLOSED, running: undefined })
const isInterrupted = (one: Pick<Todo, 'status' | 'why'>) => one.status === 'failed' && one.why === WHY_APP_CLOSED
// As the chat starts: a command lasts only while the app is open, so what was at work when the chat's process was replaced ended
// with it. Its card comes back from the ledger, whole, as cut off: nothing starts it again by itself, the person's Carry on does.
// What Claude Code itself runs again in the new process is at work, and what had ended stays as it ended: a task the person or the
// chat stopped stays stopped
const noteClosed = async ($: EngineInterface, id: string) => {
  ledgerSign = ''
  if (!dir) return void (isLedgerRead = true)
  try {
    enginePid = await pidOfEngine($)
    const now = await $.clock.now()
    const ledger = SAFE_CHAT.test(id) ? await readOr($, ledgerFile(id)) : ''
    const { pid: wasPid, cards: kept, savedAt } = keptCards(ledger || (await readOr($, keepFile(id))), now)
    if (!/^\d+$/.test(wasPid) || !/^\d+$/.test(enginePid) || wasPid === enginePid) return
    // A task stopped by no one here as that process ended (its ledger's last write, or its end as the chat said it) was stopped by
    // the app's quit: cut off too
    const endedThen = Number((await readOr($, keepFile(id, 'ended'))).split('\t')[1] ?? 0) * 1000
    const lastAt = Math.max(savedAt, endedThen)
    const isQuitStop = (one: Todo) => one.status === 'stopped' && Boolean(one.stoppedUnasked) && !one.byYou && !hasReport(one) && lastAt > 0 && one.endedAt >= lastAt - QUIT_WINDOW
    const live = await $.agent.list().catch(() => [])
    const isLive = (one: string) => live.some(agent => agent.id === one && WORKING.includes(agent.status))
    const closed: string[] = []
    await changeTodos($, list => {
      closed.length = 0
      const known = new Set(list.map(one => one.id))
      // (a card the new process does not have comes back as the ledger kept it, with what a load reads afresh left out)
      const added = kept.filter(one => !known.has(one.id)).map(one => ({ ...one, bg: undefined, running: undefined, stuckAt: undefined }))
      return capped([...list, ...added]).map(one => (one.chat || !(one.status === 'working' || isQuitStop(one)) || isLive(one.id) ? one : (closed.push(one.id), cutOff(one, now))))
    })
    if (closed.length) await log($, `the chat's process was replaced (${wasPid} to ${enginePid}) while work was at work: ${closed.join(', ')} ended with it`)
  } finally {
    isLedgerRead = true
  }
}

// ---- A rewind: the chat goes on under a new id ----

// The app's rewind starts the chat again as a copy under a new id (Claude Code's --resume <old> --fork-session), and what Claudopus
// keeps by the chat's id stayed under the old one: on 27 Nov a rewound chat showed none of its cards. Claude Code names the chat a
// copy came from in a derived-from line at the top of its transcript. A copy of a chat no longer running takes over, once, all a
// restart finds: its ledger (tasks then at work cut off, with Carry on), its finished cards, the tasks' instructions, the person's
// words and its helpers' records. A card brought over keeps the chat whose folder holds its transcript (chatWas)
let chatFrom = ''
const fromFile = (id: string) => keepFile(id, 'from')
const transcriptOf = async ($: EngineInterface, id: string) => `${await configDir($)}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}/${id}.jsonl`
// The chat a transcript's head says it was copied from, the nearest of those it names; '' for none
const derivedFrom = (head: string, id: string) => {
  let from = ''
  for (const row of head.split('\n')) {
    if (!row.includes('"derived-from"')) continue
    const o = parsedOr<{ type?: string; sessions?: { id?: unknown; via?: unknown }[] }>(row, {})
    if (o.type !== 'derived-from' || !Array.isArray(o.sessions)) continue
    const before = o.sessions.filter(one => typeof one?.id === 'string' && SAFE_CHAT.test(one.id) && one.id !== id && one.via !== 'background')
    from = String(before.at(-1)?.id ?? from)
  }
  return from
}
// Looked at as the chat loads, and again while its transcript has no message yet: the app starts the copy as it writes it
const FROM_LOOKS = 12
const FROM_EVERY = 5000
const lookRewound = async ($: EngineInterface, id: string, looks = 0): Promise<void> => {
  if (!dir || !SAFE_CHAT.test(id) || (await read($, me)).id !== id) return
  const done = (await readOr($, fromFile(id))).trim()
  if (SAFE_CHAT.test(done)) return void (chatFrom = done)
  const head = (await $.process.run(['head', '-n', '60', await transcriptOf($, id)]).catch(() => undefined))?.stdout ?? ''
  const from = derivedFrom(head, id)
  if (!from && !/"type":"(?:user|assistant)"/.test(head) && looks < FROM_LOOKS) return void $.clock.after(FROM_EVERY, () => void lookRewound($, id, looks + 1).catch(err => log($, `rewind not looked for: ${String(err)}`)))
  if (from) await takeOver($, id, from)
}
const takeOver = async ($: EngineInterface, id: string, from: string) => {
  const ledgerText = await readOr($, ledgerFile(from))
  const { pid, cards: kept, savedAt } = keptCards(ledgerText, await $.clock.now())
  const wasPid = pid || (await readOr($, beatFile(from))).split('\t')[0] || ''
  // A copy of a chat that still runs in its own process is a chat of its own: the first keeps its cards
  if (/^\d+$/.test(wasPid) && wasPid !== enginePid && (await $.process.run(['ps', '-o', 'pid=', '-p', wasPid]).catch(() => undefined))?.stdout.trim().split(/\s+/)[0] === wasPid) return
  const now = await $.clock.now()
  const endedThen = Number((await readOr($, keepFile(from, 'ended'))).split('\t')[1] ?? 0) * 1000
  const lastAt = Math.max(savedAt, endedThen)
  const isQuitStop = (one: Todo) => one.status === 'stopped' && Boolean(one.stoppedUnasked) && !one.byYou && !hasReport(one) && lastAt > 0 && one.endedAt >= lastAt - QUIT_WINDOW
  const isCut = wasPid !== enginePid
  const finished = parsedOr<unknown>(await readOr($, finishedPath(from)), [])
  const ended = (Array.isArray(finished) ? finished : []).filter(isKeptCard).filter(one => one.status !== 'working')
  const mine = (one: Todo): Todo => ({ ...one, chatWas: one.chatWas || from, bg: undefined, running: undefined, stuckAt: undefined })
  const live = await $.agent.list().catch(() => [])
  // (what was at work there ended with its process, as at a restart: noteClosed)
  const isGoneThere = (one: Todo) => isCut && !one.chat && (one.status === 'working' || isQuitStop(one)) && !live.some(agent => agent.id === one.id && WORKING.includes(agent.status))
  const ledgerIds = new Set(kept.map(one => one.id))
  const theirs = new Set([...ledgerIds, ...ended.map(one => one.id)])
  let brought = 0
  await changeTodos($, list => {
    const known = new Set(list.map(one => one.id))
    const fromLedger = kept.filter(one => !known.has(one.id))
    const fromEnded = ended.filter(one => !known.has(one.id) && !ledgerIds.has(one.id))
    brought = fromLedger.length + fromEnded.length
    return capped(byEnd([...fromEnded, ...list, ...fromLedger])).map(one => (theirs.has(one.id) ? mine(ledgerIds.has(one.id) && isGoneThere(one) ? cutOff(one, now) : one) : one))
  })
  // The person's words, the chat's, its asks and its helpers' records: the copy's own come after
  for (const path of [`${dir}/words/${from}.said.md`, `${dir}/words/${from}.md`, `${dir}/asks/${from}.md`, `${dir}/work/${from}.md`]) {
    const was = await readOr($, path)
    const to = path.replace(`/${from}.`, `/${id}.`)
    if (was) await $.fs.write(to, `${was.replace(/\n*$/, '\n\n')}${await readOr($, to)}`)
  }
  // Each task's instructions and what carries it on, where Carry on looks for them
  const parts = (await $.fs.list(`${dir}/${LEDGER_DIR}/${from}`).catch(() => [])).filter(entry => entry.kind === 'file' && /^[\w-]+\.(?:brief|carry)\.md$/.test(entry.name))
  if (parts.length) await $.process.run(['mkdir', '-p', `${dir}/${LEDGER_DIR}/${id}`])
  for (const entry of parts) if (!(await $.fs.exists(`${dir}/${LEDGER_DIR}/${id}/${entry.name}`))) await $.fs.write(`${dir}/${LEDGER_DIR}/${id}/${entry.name}`, await readOr($, `${dir}/${LEDGER_DIR}/${from}/${entry.name}`))
  await $.fs.write(fromFile(id), `${from}\n`)
  chatFrom = from
  saveLedgerSoon($)
  await log($, `this chat goes on from ${from} (a rewind): ${brought} cards brought over`)
  void recoverEnded($).catch(err => log($, `ended work not read back: ${String(err)}`))
}

// ---- What a task needs to be carried on ----

// The instructions a task of the chat's own was started with, as the chat wrote them
const saveBrief = async ($: EngineInterface, task: string, prompt: string) => {
  const { id } = await read($, me)
  if (!dir || !SAFE_CHAT.test(id) || !isTaskId(task) || !prompt.trim()) return
  await $.process.run(['mkdir', '-p', `${dir}/${LEDGER_DIR}/${id}`])
  await $.fs.write(ledgerPart(id, task, 'brief'), prompt)
}
// The worktree a task made, as its command made it: `git worktree add [-b <branch>] <path>`, the path as the command gives it or
// under the folder it ran in (`cd <folder> &&`, `git -C <folder>`)
const worktreeOf = (command: string, folder: string) => {
  const m = /(?:^|[;&|(\s])git((?:\s+-C\s+\S+)?)\s+worktree\s+add\s+([^;&|\n]+)/.exec(command)
  if (!m) return undefined
  const words = (m[2] ?? '').trim().split(/\s+/).map(word => word.replace(/^["']|["']$/g, ''))
  let branch = ''
  const plain: string[] = []
  for (let at = 0; at < words.length; at += 1) {
    const word = words[at] ?? ''
    if (word === '-b' || word === '-B') branch = words[(at += 1)] ?? ''
    else if (word === '--reason' || word === '--orphan') at += 1
    else if (!word.startsWith('-')) plain.push(word)
  }
  const [path = ''] = plain
  if (!path) return undefined
  const base = /-C\s+(\S+)/.exec(m[1] ?? '')?.[1] ?? /(?:^|[;&|]\s*)cd\s+("[^"]+"|'[^']+'|\S+)\s*&&[^;]*$/.exec(command.slice(0, m.index + 1))?.[1]?.replace(/^["']|["']$/g, '') ?? folder
  const whole = path.startsWith('/') ? path : path.startsWith('~/') ? path : `${base.replace(/\/$/, '')}/${path}`
  // (what a later step names it by: the folder with no ./ or ../ left in it)
  const parts: string[] = []
  for (const part of whole.split('/')) part === '..' ? parts.pop() : part === '.' || (part === '' && parts.length) ? undefined : parts.push(part)
  return { worktree: parts.join('/') || whole, branch }
}
const noteWorktree = async ($: EngineInterface, agent: string, command: string) => {
  const found = worktreeOf(command, cwd)
  if (!found) return
  await changeTodos($, list => {
    const top = topOf(list, agent)
    return list.map(one => (one.id === top && !one.chat ? { ...one, worktree: found.worktree, ...(found.branch ? { branch: found.branch } : {}) } : one))
  })
}
// What a fresh task is told to carry on a task the app's close cut off: everything the ledger and the task's own record hold
const carryText = async ($: EngineInterface, one: Todo, answer: string) => {
  const { id: chat } = await read($, me)
  const brief = (await readOr($, ledgerPart(chat, one.id, 'brief'))).trim()
  const transcript = `${await agentsFolder($, one.chatWas || chat)}/agent-${one.id}.jsonl`
  const worktree = one.worktree || asksOf(one).findLast(ask => ask.release)?.release || one.admins?.find(gate => gate.folder)?.folder || ''
  const when = (at: number) => new Date(at).toISOString().slice(0, 16).replace('T', ' ')
  const items = one.items.map(item => `- [${item.state}] ${item.text}`)
  const notes = one.entries.slice(-12).map(entry => `- ${when(entry.at)} ${entry.kind === 'steer' ? `${who(true)} said: ` : ''}${entry.text}`)
  return [
    `# Carry on: ${titleOf(one)}`,
    '',
    named(`The Claude app closed while this task worked, at ${when(one.endedAt)} UTC, and its run ended with it. You are a fresh task carrying it on: read this, then go on from where it stopped. Do not do again what it finished; check what it left half done before you build on it.`),
    '',
    `- Task: ${titleOf(one)}, started ${when(one.begunAt ?? one.startedAt)} UTC${one.model ? ` on ${modelName(one.model) || one.model}` : ''} (its id was ${one.id})`,
    `- The chat's folder: ${cwd}`,
    worktree ? `- Its worktree, yours now: ${worktree}${one.branch ? ` on branch ${one.branch}` : ''}. Look at \`git -C ${worktree} status\` and its last commits first.` : '- No worktree was noted for it: its saved transcript names any it made.',
    one.scratch ? `- Its scratch folder: ${one.scratch}` : '',
    `- The saved transcript of the run that was cut off: ${transcript} (one JSON line per message, the newest last: read its end with tail, never the whole file)`,
    one.words ? named(`- {Name}'s message it was started for: ${one.words}`) : '',
    '',
    '## Its instructions',
    brief || 'Not kept: the first line of its saved transcript holds them.',
    '',
    '## Its to-dos when it stopped',
    ...(items.length ? items : ['None were listed.']),
    '',
    '## Its last notes',
    ...(notes.length ? notes : ['None.']),
    ...(one.ask ? ['', named('## What it was asking {name}'), ...asksOf(one).flatMap((ask, n) => [...(n ? [''] : []), ask.text, ...(ask.details ? [ask.details] : [])])] : []),
    ...(answer ? ['', named("## {Name}'s answer"), answer] : []),
    '',
  ]
    .filter(line => line !== undefined)
    .join('\n')
}
const CARRY_PROMPT = (path: string) => `Carry on a task the Claude app's close cut off. Read ${path} first: it holds the task's instructions, its to-dos, its last notes, its worktree and its saved transcript. Then go on from where it stopped.`
// The person's press on Carry on, or their answer to what a cut-off task asked: the chat starts a fresh task told everything the
// ledger holds of it. Its card goes under Finished once the fresh task starts, which takes its place, its to-dos and its notes
const carryOn = async ($: EngineInterface, id: string, answer = '') => {
  const list = await ownCards($)
  const one = list.find(card => card.id === topOf(list, id))
  const { id: chat } = await read($, me)
  if (!one || one.chat || !isInterrupted(one) || !dir || !SAFE_CHAT.test(chat)) return
  const path = ledgerPart(chat, one.id, 'carry')
  await $.process.run(['mkdir', '-p', `${dir}/${LEDGER_DIR}/${chat}`])
  await $.fs.write(path, await carryText($, one, answer))
  const model = modelName(one.model ?? '')
  await log($, `carry on ${one.id}: the chat is asked to start a fresh task from ${path}`)
  await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "Carry on" on "${titleOf(one)}" (${one.id}), which stopped when the Claude app closed${answer ? `, and answered what it asked` : ''}. Its run is gone, so start a fresh task for it now: the Agent tool with subagent_type "${one.kind === 'claudopus:quick' ? 'claudopus:quick' : 'claudopus:task'}"${model ? `, the model it ran on (${model})` : ''}, description "${titleOf(one)}", and as its prompt exactly: ${CARRY_PROMPT(path)}`)
}
// The task a fresh task's instructions carry on, by its id, from the carry file they name
const carriedFrom = (prompt: string) => /\/ledger\/[A-Za-z0-9-]+\/([\w-]+)\.carry\.md/.exec(prompt)?.[1] ?? ''

// ---- Other chats whose process ended with tasks at work ----

// A chat of this Mac that is not open (no fresh file in live/) and whose process is gone, with tasks its ledger kept at work or cut
// off: those tasks are listed under its name, cut off, so the panel shows what every chat had at work after the app comes back. A
// press on the chat's name opens it, where each has Carry on. Ledgers not written for LEDGER_SHOWN are left out
const LEDGER_SHOWN = 3 * 24 * 3_600_000
const ledgersRead = new Map<string, { key: string; ledger: Partial<Ledger> }>()
const pidsSeen = { at: 0, alive: new Set<string>(), asked: '' }
const ledgerOthers = async ($: EngineInterface, me: string, open: Set<string>, now: number): Promise<Shared[]> => {
  if (!dir) return []
  const files = (await $.fs.list(`${dir}/${LEDGER_DIR}`).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== `${me}.json`)
  for (const name of [...ledgersRead.keys()]) if (!files.some(entry => entry.name === name)) ledgersRead.delete(name)
  const found: { ledger: Partial<Ledger>; cards: Todo[] }[] = []
  // (a chat another went on from, by a rewind, is shown in that one: never again under its own name)
  const goneOn = new Set([chatFrom])
  for (const entry of files) {
    if (entry.mtimeMs && now - entry.mtimeMs > LEDGER_SHOWN) continue
    const key = `${entry.mtimeMs}:${entry.size}`
    const was = ledgersRead.get(entry.name)
    const ledger = was?.key === key ? was.ledger : parsedOr<Partial<Ledger>>(await readOr($, `${dir}/${LEDGER_DIR}/${entry.name}`), {})
    ledgersRead.set(entry.name, { key, ledger })
    if (typeof ledger.from === 'string') goneOn.add(ledger.from)
    if (typeof ledger.chat !== 'string' || !SAFE_CHAT.test(ledger.chat) || open.has(`/${ledger.chat}`) || !Array.isArray(ledger.tasks)) continue
    const savedAt = Number(ledger.savedAt) || 0
    const cards = ledger.tasks
      .map(one => (one as Partial<LedgerTask>)?.card)
      .filter(isKeptCard)
      .filter(one => !one.parentId && !one.closedAt && (one.status === 'working' || isInterrupted(one) || (one.status === 'stopped' && Boolean(one.stoppedUnasked) && !one.byYou && one.endedAt >= savedAt - QUIT_WINDOW)))
    if (cards.length) found.push({ ledger, cards })
  }
  for (let at = found.length - 1; at >= 0; at -= 1) if (goneOn.has(String(found[at]?.ledger.chat))) found.splice(at, 1)
  if (!found.length) return []
  // Whether each process still runs, asked of the Mac at most every FOLLOW_EVERY: one that runs may be a chat whose Claudopus Claude
  // switched off, whose tasks still work
  const pids = [...new Set(found.map(one => String(one.ledger.pid ?? '')).filter(pid => /^\d+$/.test(pid)))].sort()
  if (pids.join(',') !== pidsSeen.asked || now - pidsSeen.at > FOLLOW_EVERY) {
    const r = pids.length ? await $.process.run(['ps', '-o', 'pid=', '-p', pids.join(',')]).catch(() => undefined) : undefined
    pidsSeen.alive = new Set((r?.stdout ?? '').split('\n').map(line => line.trim().split(/\s+/)[0] ?? '').filter(pid => pids.includes(pid)))
    pidsSeen.at = now
    pidsSeen.asked = pids.join(',')
  }
  return found
    .filter(({ ledger }) => !pidsSeen.alive.has(String(ledger.pid ?? '')))
    .map(({ ledger, cards }) => ({
      chat: String(ledger.chat),
      title: typeof ledger.title === 'string' ? ledger.title : '',
      folder: typeof ledger.folder === 'string' ? ledger.folder : '',
      host: '',
      at: now,
      cards: cards.map(one => (isInterrupted(one) ? one : cutOff(one, Math.min(now, Number(ledger.savedAt) || now)))).map(one => ({ ...one, bg: undefined, running: undefined })),
      ...(linkOf(ledger.link) ? { link: linkOf(ledger.link) } : {}),
    }))
}


// ---- Back by itself after Claude switches it off ----

// Claude's engine switches off an add-on that held its shared helper for five seconds, and that chat has no Claudopus until the
// person types /reload-plugins. The engine loads an add-on again by itself when one of its own settings changes, so each chat's
// load writes its beat, keep/<chat>.beat naming the chat's process, every BEAT_EVERY, and starts bin/revive, one on the Mac at a
// time, which changes the setting "revived" (plugin.json's userConfig) when a beat goes quiet while its process still runs.
// Changed, it loads Claudopus again in every chat, as an update does
const BEAT_EVERY = 3000
const beatFile = (id: string) => `${dir}/keep/${id}.beat`
const configDir = async ($: EngineInterface) => (await $.env.get('CLAUDE_CONFIG_DIR')) || `${(await $.env.get('HOME')) ?? ''}/.claude`
// The key this copy has in the settings: claudopus@<marketplace> for an installed one, whether Claude Code keeps it in its cache or
// loads it from the marketplace's own folder (a marketplace of a folder on this Mac, as Claudopus's own checkout); claudopus@inline
// for one loaded with --plugin-dir. On 16 Nov this Mac's chats ran from the checkout, and claudopus@inline would have changed nothing
const ownKey = async ($: EngineInterface, configDir: string) => {
  const market = /\/plugins\/cache\/([^/]+)\/claudopus\//.exec($.plugin.root)?.[1]
  if (market && /^[\w.-]+$/.test(market)) return `claudopus@${market}`
  const known = parsedOr<Record<string, { installLocation?: string }>>(await readOr($, `${configDir}/plugins/known_marketplaces.json`), {})
  const name = Object.entries(known).find(([, one]) => typeof one?.installLocation === 'string' && one.installLocation && ($.plugin.root === one.installLocation || $.plugin.root.startsWith(`${one.installLocation.replace(/\/$/, '')}/`)))?.[0]
  return name && /^[\w.-]+$/.test(name) ? `claudopus@${name}` : 'claudopus@inline'
}
let beatLine = ''
const beat = async ($: EngineInterface, id: string) => {
  if (!dir || !beatLine || isEnded) return
  await $.fs.write(beatFile(id), beatLine)
  // The proof that it comes back, for someone who wants to see it: keep/<chat>.hold-test holding this chat's process number, written
  // by hand, makes this chat's Claudopus hold Claude's helper long enough to be switched off, once, in the next drawing of its panel
  // or the next message: the engine switches off only an add-on that holds the helper while one of its hooks is answering, not in a
  // timer of its own (16 Nov trial). It is taken away whatever it holds
  const proof = `${dir}/keep/${id}.hold-test`
  if (!isHoldTestDue && (await $.fs.exists(proof))) {
    const said = (await readOr($, proof)).trim()
    await $.process.run(['rm', '-f', proof])
    if (said !== enginePid) return void log($, "a hold-test file that did not name this chat's process was taken away")
    isHoldTestDue = true
    $.ui.invalidate('ui.render')
  }
}
let isHoldTestDue = false
const holdTest = async ($: EngineInterface) => {
  if (!isHoldTestDue) return
  isHoldTestDue = false
  await log($, "holding Claude's helper on purpose, as keep/<chat>.hold-test asked")
  const end = Date.now() + 10_000
  while (Date.now() < end) Math.sqrt(Date.now())
}
const startReviver = async ($: EngineInterface, id: string) => {
  if (!dir || !SAFE_CHAT.test(id)) return
  if (!enginePid) enginePid = await pidOfEngine($)
  if (!/^\d+$/.test(enginePid)) return
  // A load the setting brought back says so in the log, with how long its chat had gone without it
  const back = (await readOr($, `${dir}/keep/${id}.revived`)).trim().split('\n').at(-1)?.split(' ') ?? []
  const backAt = Number(back[0] ?? 0) * 1000
  if (backAt && (await $.clock.now()) - backAt < 120_000) await log($, `back after Claude switched Claudopus off in this chat (its beat was quiet ${back[1] ?? '?'} s)`)
  const config = await configDir($)
  const settings = `${config}/settings.json`
  if (/[\t\n]/.test(settings)) return
  // and, on a line of its own, the load that writes it: one that beats again after the watcher's change was never off, only slow
  // (bin/revive; a watcher of an older version reads the first line as before)
  beatLine = `${enginePid}\t${await ownKey($, config)}\t${settings}\n${thisLoad}\n`
  await beat($, id)
  everyLoad($, BEAT_EVERY, () => beat($, id).catch(() => undefined))
  // In a session of its own, so it outlives the chat's process; it leaves at once when one of this copy already runs
  const script = `nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$1" "$2" >/dev/null 2>&1 </dev/null &`
  const r = await $.process.run(['/bin/sh', '-c', script, 'sh', `${$.plugin.root}/bin/revive`, dir]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  if (r.exitCode !== 0) await log($, `the watcher that brings Claudopus back was not started: ${r.stderr.slice(0, 200)}`)
}
// A chat that ends leaves no beat behind
const endBeat = async ($: EngineInterface, id: string) => {
  beatLine = ''
  // (the moment it ended, so a restart that follows says when, though the beat is gone)
  if (dir && SAFE_CHAT.test(id) && enginePid) await $.fs.write(`${dir}/keep/${id}.ended`, `${enginePid}\t${Math.round(await $.clock.now())}\n`).catch(() => undefined)
  if (dir && SAFE_CHAT.test(id)) await $.process.run(['rm', '-f', beatFile(id)]).catch(() => undefined)
}
const SAFE_CHAT = /^[A-Za-z0-9-]{1,80}$/

// ---- Tasks keep their prompt cache an hour, as the chat does ----

// With Claude Code's 5 minutes, a task or helper that waits longer on a command or a helper pays to read its whole context again (a
// person's tasks woken after a wait rewrote theirs 82 times, a fifth of what Claudopus cost them). So each chat's start sets
// subagentPromptCacheTtl to "1h" in the person's own settings.json, every other key as it was, as site/install.sh does for an install
// from claudopus.ai, here for one made from the marketplace. A value already there, whatever it is, is the person's and stays; so
// does a file that cannot be read, is not a JSON object, or holds a number of more than 15 digits, which would come back changed
const TASK_CACHE = 'subagentPromptCacheTtl'
const setTaskCache = async ($: EngineInterface) => {
  const settings = `${await configDir($)}/settings.json`
  const isThere = await $.fs.exists(settings).catch(() => true)
  const text = isThere ? await $.fs.read(settings).catch(() => undefined) : ''
  if (text === undefined || /[-:[,\s]\d{16,}|\d\.\d{16,}/.test(text)) return
  const d = parsedOr<unknown>(text.trim() ? text : '{}', undefined)
  if (!d || typeof d !== 'object' || Array.isArray(d) || TASK_CACHE in d) return
  await $.fs.write(settings, `${JSON.stringify({ ...d, [TASK_CACHE]: '1h' }, null, 2)}\n`)
  await log($, `tasks keep their prompt cache an hour: ${TASK_CACHE} set to "1h" in ${settings}`)
}
const REVIVED_KEY = 'claudopus.revived'
