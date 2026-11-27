// Progress, the part that needs no engine: the shapes of the files in the memory folder's progress/, how each is read back whole
// whatever was written, what the indexer asks the model and how its answer is applied. src/claudopus/progress.tsx reads and writes
// the files, keeps the queue and runs the indexer; the Progress tab draws from them

// The north star and the goals, each in the person's own words with the day they were said
export type ProgressPicture = { star: { text: string; said: string }; goals: { id: string; name: string; words: string; said: string }[]; updated: string }
// One step of an area: a plain sentence of what will exist when it is done, open, done, or set aside
export type ProgressNext = { id: string; text: string; state: 'open' | 'done' | 'aside'; at: string }
// An area of work: under a goal (its id, or '' for none), one plain line of what it is for (`next`, steps once kept, is only read back as it was); `topics`, the
// memory's topics its results were recorded under, newest first
export type ProgressArea = { id: string; name: string; goal: string; aim: string; next: ProgressNext[]; updated: string; topics?: string[] }
// One piece of work in an area: the task (its agent id), its result (reports/<report>/report.md, '' while the task is at work or
// when it left none), what it was and came to, its pictures (copies in its result's folder, by full path), where it went live, and
// why it was set aside
export type ProgressEntry = {
  task: string
  title: string
  at: string
  kind: 'milestone' | 'task' | 'aside'
  outcome: string
  report: string
  pictures: string[]
  live: string
  reason: string
}
// One event waiting in progress/queue to be indexed
export type ProgressEvent = {
  // (a chat: one from before Claudopus came in, read from its saved words)
  kind: 'start' | 'result' | 'said' | 'answer' | 'aside' | 'chat'
  at: number
  chat: string
  task?: string
  report?: string
  title?: string
  files?: string[]
  // A result's topic in the memory's index, the one its task recorded with update
  topic?: string
  text: string
  tries?: number
  isBackfill?: boolean
  // A result read in again only to be counted: it makes its entry and changes nothing else
  isEntryOnly?: boolean
}

const isText = (value: unknown): value is string => typeof value === 'string'
const textOr = (value: unknown, or = '') => (isText(value) ? value : or)
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()
const cut = (text: string, most: number) => {
  const end = text.lastIndexOf(' ', most)
  return text.length <= most ? text : `${text.slice(0, end > most / 2 ? end : most)} …`
}
const byNewest = (a: ProgressEntry, b: ProgressEntry) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0)
const parsedOr = (text: string): unknown => {
  try {
    return text.trim() ? (JSON.parse(text) as unknown) : undefined
  } catch {
    return undefined
  }
}

// ---- The files read back: whatever is in them, only what has the right shape ----

// An area's ids are made by Claudopus, of letters, digits and dashes: anything else names no file of it
export const isAreaId = (id: string) => /^[a-z0-9][a-z0-9-]{0,63}$/.test(id)
const nextOf = (value: unknown): ProgressNext | undefined => {
  const one = value as Partial<ProgressNext> | undefined
  if (!one || !isText(one.id) || !isText(one.text) || !one.text.trim()) return undefined
  return { id: one.id, text: one.text, state: one.state === 'done' || one.state === 'aside' ? one.state : 'open', at: textOr(one.at) }
}
const areaOf = (value: unknown): ProgressArea | undefined => {
  const one = value as Partial<ProgressArea> | undefined
  if (!one || !isText(one.id) || !isAreaId(one.id) || !isText(one.name) || !one.name.trim()) return undefined
  const next = (Array.isArray(one.next) ? one.next : []).map(nextOf).filter((n): n is ProgressNext => Boolean(n))
  const topics = (Array.isArray(one.topics) ? one.topics : []).filter(isText)
  return { id: one.id, name: one.name, goal: textOr(one.goal), aim: textOr(one.aim), next, updated: textOr(one.updated), ...(topics.length ? { topics } : {}) }
}
const entryOf = (value: unknown): ProgressEntry | undefined => {
  const one = value as Partial<ProgressEntry> | undefined
  if (!one || !isText(one.title) || !one.title.trim()) return undefined
  return {
    task: textOr(one.task),
    title: one.title,
    at: textOr(one.at),
    kind: one.kind === 'milestone' || one.kind === 'aside' ? one.kind : 'task',
    outcome: textOr(one.outcome),
    report: textOr(one.report),
    pictures: (Array.isArray(one.pictures) ? one.pictures : []).filter(isText),
    live: textOr(one.live),
    reason: textOr(one.reason),
  }
}
// picture.json, areas.json and areas/<id>.json as their text reads; an empty picture, no areas, no entries when there is none
export const pictureFrom = (text: string): ProgressPicture => {
  const raw = parsedOr(text) as Partial<ProgressPicture> | undefined
  const star = raw?.star && typeof raw.star === 'object' ? { text: textOr(raw.star.text), said: textOr(raw.star.said) } : { text: '', said: '' }
  const goals = (Array.isArray(raw?.goals) ? raw.goals : [])
    .filter(goal => goal && isText(goal.id) && goal.id && isText(goal.name) && goal.name.trim())
    .map(goal => ({ id: goal.id, name: goal.name, words: textOr(goal.words), said: textOr(goal.said) }))
  return { star, goals, updated: textOr(raw?.updated) }
}
export const areasFrom = (text: string): ProgressArea[] => {
  const raw = parsedOr(text) as { areas?: unknown } | undefined
  return (Array.isArray(raw?.areas) ? raw.areas : []).map(areaOf).filter((a): a is ProgressArea => Boolean(a))
}
export const entriesFrom = (text: string): ProgressEntry[] => {
  const raw = parsedOr(text) as { entries?: unknown } | undefined
  return (Array.isArray(raw?.entries) ? raw.entries : []).map(entryOf).filter((e): e is ProgressEntry => Boolean(e)).sort(byNewest)
}
// An entry's picture is a copy in its result's folder; its small copy is the one the Results tab draws
export const progressThumb = (reportsDir: string, path: string) => {
  const inside = path.startsWith(`${reportsDir}/`) ? path.slice(reportsDir.length + 1) : ''
  const [id = '', ...file] = inside.split('/')
  return id && file.length ? `${reportsDir}/${id}/thumbs/${file.join('/').replaceAll('/', '--')}.jpg` : ''
}

// ---- Set aside: the button every question of a task has beside its own, the person's own choice to drop it and keep it as a
// data point. Nothing else ever sets work aside: a task that waits on nothing is never taken for set aside ----

export const SET_ASIDE = 'Set aside'
export const PICK_UP_AGAIN = 'Pick up again'
const plainWords = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
// A question's buttons with Set aside after the task's own, once
export const withSetAside = (choices: string[]) => (choices.some(choice => plainWords(choice) === plainWords(SET_ASIDE)) ? choices : [...choices, SET_ASIDE])
// What the task hears of the press
export const setAsideTold = (Name: string) => `Set aside: ${Name} set this aside, to keep as a data point. Do not continue it or ask about it again; record it as set aside.`
// What the chat is sent for Pick up again on a set-aside entry, as the person's own message naming its result
export const pickUpText = (entry: ProgressEntry, reportsDir: string) => `${PICK_UP_AGAIN}: ${entry.title}${entry.report ? ` (${reportsDir}/${entry.report}/report.md)` : ''}`
// What the chat is told of progress/ with its role, so a question of how some work stands is answered from it
export const progressLine = (name: string, dir: string) =>
  `Progress of ${name}'s work, kept by Claudopus: ${dir}/progress/areas.json (each area and what it is for) and ${dir}/progress/areas/<area id>.json (what each task in it came to, newest first, with its date and result).`

// ---- What the indexer asks: one answer of the model's for each event, given the picture, the areas and their newest entries ----

export const PROGRESS_SYSTEM = `You keep a map of one person's work for a page that shows, at a glance, what was done in each area of it. You are given the person's north star and goals, the areas so far, the newest entries of each, and one event: a task starting, a task's result, a chat from before Claudopus came in, a message the person wrote, an answer the person gave to a task's question, or the person pressing Set aside on a question. Reply with one JSON object and nothing else:
{"areas": ["<area id>", ...], "newArea": {"name": "...", "goal": "<goal id or empty>", "aim": "..."}, "state": "...", "entry": {"title": "...", "kind": "milestone" | "task", "outcome": "...", "live": "<web address where it went live, or empty>", "pictures": ["<path>", ...]}, "aside": {"task": "<task id>", "reason": "..."}, "rename": [{"id": "<area id>", "name": "...", "aim": "..."}], "merge": [{"from": "<area id>", "into": "<area id>"}]}
Leave out every key that does not apply.
Rules:
- "areas": the smallest existing area that covers the whole of the work; several only when it truly spans them. Make a "newArea" only for a new direction that no area covers; its name is 1 to 3 plain words, its aim one plain line, its goal the id of the goal it serves or empty.
- "entry", for a task's start or result, or a chat from before Claudopus: "title" at most 8 plain words of what came out of it (such as "Lawyer brief and evidence pack ready"), never the task's own title or instructions repeated; "outcome" at most 14 plain words of what came of it. No code, file names, paths, versions, ids or model names. "kind" is "milestone" only when something shipped, went live or a clear finding came out; otherwise "task". "pictures": only paths from the result's own pictures, the one or two that show it best.
- "state", for a result: at most 6 plain words of where this line of work stands now, starting with "done" once it shipped or went live.
- "aside" (a task set aside): only when the person's own words or press set that task aside; the reason in their words, short.
- "rename" and "merge": only when the person's words ask for it.
- Never write that anything waits on the person or is theirs to do. Plain everyday words throughout.`

export const PICTURE_SYSTEM = `You keep the bigger picture of one person's work: their north star (the one thing all of it is for) and their goals (2 to 6), with the date each rests on. Take each from what they said they want, in their own words where they said it. Where they never said a goal or a north star outright, work it out from what their messages keep aiming at and asking for, in plain words close to theirs, dated by the newest message it rests on. You are given the picture so far and the person's own messages. Change it only where their words changed it: a goal they named, dropped or reworded, work that now plainly aims somewhere new, or a new north star. Keep each unchanged goal's id. Reply with one JSON object and nothing else:
{"star": {"text": "<at most 16 words>", "said": "<YYYY-MM-DD>"}, "goals": [{"id": "<short id of lowercase letters and dashes>", "name": "<1 to 4 words>", "words": "<their words, or what their messages show, at most 30 words>", "said": "<YYYY-MM-DD>"}]}
No code, file names or ids in the words. Nothing their messages do not bear out: with nothing to go on, give the picture back as it was.`

// How much of each event the model reads
export const EVENT_CHARS: Record<ProgressEvent['kind'], number> = { start: 4000, result: 8000, said: 3000, answer: 2000, aside: 2000, chat: 6000 }
// The most each area keeps
export const ENTRIES_MOST = 3000

const dayOf = (at: number) => new Date(at).toISOString().slice(0, 10)
// A line of the model's in plain words: no code, paths, file names or versions, at most so many words and characters
const plainLine = (value: unknown, words: number, chars: number) =>
  isText(value)
    ? cut(
        oneLine(value.replace(/`/g, ''))
          .split(' ')
          .filter(word => !/[/\\]|\.(?:tsx?|jsx?|json|md|py|sh|html?|css)\b|^v?\d+\.\d+(?:\.\d+)?$/.test(word))
          .slice(0, words)
          .join(' '),
        chars,
      )
    : ''
const idsIn = (value: unknown) => (Array.isArray(value) ? value.filter(isText) : [])
// A step whose words mostly match an open step's says the same: three quarters of the shorter one's words, a plural's s aside
export const topicState = (answer: Record<string, unknown>) => plainLine(answer.state, 6, 60)
// The model's answer as JSON, whatever is around it; nothing for any other answer
export const answerJson = (text: string): Record<string, unknown> | undefined => {
  const from = text.indexOf('{')
  const to = text.lastIndexOf('}')
  if (from < 0 || to < from) return undefined
  const parsed = parsedOr(text.slice(from, to + 1))
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : undefined
}

export const progressPrompt = (event: ProgressEvent, picture: ProgressPicture, areas: ProgressArea[], entries: Map<string, ProgressEntry[]>, now: number) => {
  const goals = picture.goals.map(goal => `- ${goal.id}: ${goal.name} (${goal.words})`).join('\n')
  const shown = areas
    .map(area => {
      const newest = (entries.get(area.id) ?? [])
        .slice(0, 3)
        .map(e => `    - ${e.at.slice(0, 10)} ${e.kind}${e.task ? ` (task ${e.task})` : ''}: ${e.title}${e.outcome ? ` · ${e.outcome}` : ''}${e.reason ? ` · set aside: ${e.reason}` : ''}`)
        .join('\n')
      return `- ${area.id}: ${area.name}${area.goal ? ` (goal ${area.goal})` : ''} · ${area.aim}\n  Newest entries:\n${newest || '    (none)'}`
    })
    .join('\n')
  const placed = event.task ? [...entries].filter(([, list]) => list.some(e => e.task === event.task)).map(([id]) => id) : []
  const titled = event.title ? `, titled "${event.title}"` : ''
  const what =
    event.kind === 'start' ? `A task starts (task ${event.task}). Its title and instructions:`
    : event.kind === 'result' ? `A task's result${event.task ? ` (task ${event.task})` : ''}${titled}${event.files?.length ? `. Its pictures: ${event.files.join(', ')}` : ''}. The result:`
    : event.kind === 'chat' ? `A chat from before Claudopus came in${titled}: the person's messages, then the last reply. The chat:`
    : event.kind === 'said' ? 'The person wrote in a chat:'
    : event.kind === 'answer' ? `The person answered a question of a task (task ${event.task})${titled}:`
    : `The person pressed Set aside on a question of a task (task ${event.task})${titled}:`
  return [
    `Today: ${dayOf(now)}. The event happened ${dayOf(event.at)}.`,
    `North star: ${picture.star.text || '(not known yet)'}`,
    `Goals:\n${goals || '(none yet)'}`,
    `Areas:\n${shown || '(none yet)'}`,
    placed.length ? `This task is already in: ${placed.join(', ')}` : '',
    `${what}\n"""\n${event.text}\n"""`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

// The model's answer applied to the areas and every area's entries (changed in place, by area). What only the person's own words
// or press may do (set work aside, rename, merge) is taken only from their message, answer or press. `reportsDir`: where
// results are; `Name`: the person, for the reason of a press
export const applyProgress = (event: ProgressEvent, answer: Record<string, unknown>, picture: ProgressPicture, given: ProgressArea[], entries: Map<string, ProgressEntry[]>, now: number, reportsDir: string, Name: string) => {
  const at = new Date(now).toISOString()
  const happened = new Date(event.at).toISOString()
  const isPersons = event.kind === 'said' || event.kind === 'answer' || event.kind === 'aside'
  let areas = given.map(area => ({ ...area, next: [...area.next] }))
  const touched = new Set<string>()
  const changedEntries = new Set<string>()
  const mark = (id: string) => (touched.add(id), changedEntries.add(id))
  const goalIds = new Set(picture.goals.map(goal => goal.id))
  // Renames and merges first, so the rest names the areas as they now stand
  if (isPersons) {
    for (const one of Array.isArray(answer.rename) ? answer.rename : []) {
      const r = one as { id?: unknown; name?: unknown; aim?: unknown }
      const name = plainLine(r.name, 4, 40)
      areas = areas.map(area => (area.id === r.id && name ? (touched.add(area.id), { ...area, name, aim: plainLine(r.aim, 24, 160) || area.aim }) : area))
    }
    for (const one of Array.isArray(answer.merge) ? answer.merge : []) {
      const m = one as { from?: unknown; into?: unknown }
      const from = areas.find(area => area.id === m.from)
      const into = areas.find(area => area.id === m.into)
      if (!from || !into || from === into) continue
      areas = areas.filter(area => area !== from).map(area => (area === into ? { ...area, next: [...area.next, ...from.next] } : area))
      const kept = entries.get(into.id) ?? []
      entries.set(into.id, [...kept, ...(entries.get(from.id) ?? []).filter(e => !kept.some(o => o.task && o.task === e.task))].sort(byNewest))
      entries.set(from.id, [])
      mark(into.id)
      changedEntries.add(from.id)
    }
  }
  const known = new Set(areas.map(area => area.id))
  const picked = [...new Set(idsIn(answer.areas).filter(id => known.has(id)))]
  // A new area, unless one of that name is there already (answers made at once may name the same new direction)
  const made = answer.newArea as { name?: unknown; goal?: unknown; aim?: unknown } | undefined
  const madeName = plainLine(made?.name, 4, 40)
  if (madeName) {
    const base = slug(madeName).slice(0, 40) || 'area'
    const same = areas.find(area => slug(area.name) === slug(madeName) || area.id === base)
    if (same) {
      if (!picked.includes(same.id)) picked.push(same.id)
    } else {
      let id = base
      for (let n = 2; known.has(id); n += 1) id = `${base.slice(0, 36)}-${n}`
      known.add(id)
      areas.push({ id, name: madeName, goal: isText(made?.goal) && goalIds.has(made.goal) ? made.goal : '', aim: plainLine(made?.aim, 24, 160), next: [], updated: at })
      picked.push(id)
      touched.add(id)
    }
  }
  // The entry of a task's start, result or set-aside press, in each area it belongs to
  // Every result is an entry of its own: it takes the place of its task's start and of itself sorted before, never of the task's
  // other results, so a task that reports many times counts each time
  const isOfTask = (e: ProgressEntry) => Boolean(event.task) && e.task === event.task
  const isOfEvent = (e: ProgressEntry) => (event.kind === 'result' && event.report ? e.report === event.report || (isOfTask(e) && !e.report) : event.task ? isOfTask(e) : Boolean(event.report) && e.report === event.report)
  const before = [...entries].flatMap(([id, list]) => list.filter(isOfEvent).map(e => ({ id, e })))
  const ofTask = [...entries].flatMap(([id, list]) => list.filter(e => isOfTask(e) || isOfEvent(e)).map(e => ({ id, e })))
  const wasAside = ofTask.find(one => one.e.kind === 'aside')?.e
  const answered = (answer.entry ?? {}) as { title?: unknown; kind?: unknown; outcome?: unknown; live?: unknown; pictures?: unknown }
  const places = picked.length ? picked : [...new Set(ofTask.map(one => one.id))].filter(id => known.has(id))
  const title = plainLine(answered.title, 8, 60) || plainLine(event.title, 8, 60) || 'A task'
  const put = (id: string, entry: ProgressEntry) => {
    entries.set(id, [entry, ...(entries.get(id) ?? []).filter(e => !isOfEvent(e))].sort(byNewest))
    mark(id)
  }
  if (event.kind === 'start' && event.task)
    for (const id of places) if (!(entries.get(id) ?? []).some(isOfEvent)) put(id, { task: event.task, title, at: happened, kind: 'task', outcome: '', report: '', pictures: [], live: '', reason: '' })
  if (event.kind === 'result' || event.kind === 'chat') {
    const files = new Set((event.files ?? []).map(file => `${reportsDir}/${event.report}/${file}`))
    // (a path from a drive, C:\x or C:/x, with forward slashes, as the mod keeps paths)
    const pictures = idsIn(answered.pictures)
      .map(path => (/^[A-Za-z]:[\\/]/.test(path) ? path.replace(/\\/g, '/') : path))
      .map(path => (path.startsWith('/') || /^[A-Za-z]:\//.test(path) ? path : `${reportsDir}/${event.report}/${path}`))
      .filter(path => files.has(path))
      .slice(0, 4)
    const live = isText(answered.live) && /^https?:\/\/\S+$/.test(answered.live.trim()) ? answered.live.trim() : ''
    const kind: ProgressEntry['kind'] = wasAside ? 'aside' : answered.kind === 'milestone' ? 'milestone' : 'task'
    const entry: ProgressEntry = { task: event.task ?? '', title, at: happened, kind, outcome: plainLine(answered.outcome, 14, 110), report: event.report ?? '', pictures, live, reason: wasAside?.reason ?? '' }
    // (it takes the place of the task's start and earlier result in each area; a start's guess the result does not bear out goes)
    for (const id of places) put(id, entry)
    for (const { id, e } of before) if (!places.includes(id) && !e.report) (entries.set(id, (entries.get(id) ?? []).filter(o => o !== e)), mark(id))
  }
  // Set aside: by the person's press, or their words naming a task
  const named = answer.aside as { task?: unknown; reason?: unknown } | undefined
  const asideTask = event.kind === 'aside' ? (event.task ?? '') : isPersons && isText(named?.task) ? named.task : ''
  if (asideTask) {
    const reason = plainLine(named?.reason, 20, 140) || `${Name} set it aside`
    let isMarked = false
    for (const [id, list] of entries) {
      if (!list.some(e => e.task === asideTask)) continue
      entries.set(id, list.map(e => (e.task === asideTask ? ((isMarked = true), { ...e, kind: 'aside' as const, reason: e.kind === 'aside' && e.reason && !named?.reason ? e.reason : reason }) : e)))
      mark(id)
    }
    if (!isMarked && event.kind === 'aside') for (const id of places) put(id, { task: asideTask, title, at: happened, kind: 'aside', outcome: '', report: '', pictures: [], live: '', reason })
  }
  if (event.kind === 'result' && event.topic && !event.isEntryOnly) {
    const topic = event.topic
    areas = areas.map(area => (places.includes(area.id) && area.topics?.[0] !== topic ? (touched.add(area.id), { ...area, topics: [topic, ...(area.topics ?? []).filter(one => one !== topic)].slice(0, 5) }) : area))
  }
  areas = areas.map(area => (touched.has(area.id) ? { ...area, updated: at } : area))
  return { areas, changedEntries, touched, places, isChanged: touched.size > 0 || changedEntries.size > 0 }
}

// ---- The bigger picture, from the person's own messages ----

// The person's own messages in a chat's saved words since a time: each headed "## <time>", with only the marks of their own words
// after it (a program's, a schedule's or a channel's message is no one's words), Claude's answers headed "### Claude" left out
export const wordsIn = (text: string, since: number) => {
  const found: { at: string; text: string }[] = []
  for (const part of text.split(/\n(?=#{2,3} )/)) {
    const m = /^## (\d{4}-\d\d-\d\dT[\d:.]+Z)((?: \((?:sent while Claude was working|from the phone|pressed or replied in the panel)\))*)\n([\s\S]*)$/.exec(part.trim())
    if (m?.[1] && m[3]?.trim() && Date.parse(m[1]) >= since) found.push({ at: m[1], text: m[3].trim() })
  }
  return found
}
// A chat from before Claudopus came in (`before`), as the event that puts it into its area: from its saved words, the person's
// messages and the last reply, dated by its first message; nothing for a chat with no message of theirs, or one begun since
export const chatEventOf = (id: string, text: string, before: number): ProgressEvent | undefined => {
  const mine = wordsIn(text, 0)
  const first = mine[0]
  if (!first || !(Date.parse(first.at) < before)) return undefined
  const replies = [...text.matchAll(/(?:^|\n)### Claude [^\n]*\n([\s\S]*?)(?=\n#{2,3} |$)/g)].map(m => (m[1] ?? '').trim()).filter(Boolean)
  const said = mine.map(one => `- ${oneLine(one.text).slice(0, 300)}`).join('\n').slice(0, 2200)
  const reply = oneLine(replies.at(-1) ?? '').slice(0, 700)
  return { kind: 'chat', at: Date.parse(first.at), chat: id, task: `chat-${id}`, title: oneLine(first.text).slice(0, 80), text: `${said}${reply ? `\n\nLast reply: ${reply}` : ''}`, isBackfill: true }
}
// What the model is asked for the picture, and its answer as a picture; nothing for an answer that is not one
export const picturePrompt = (was: ProgressPicture, words: { at: string; text: string }[], now: number, most: number) =>
  `Today: ${dayOf(now)}\n\nThe picture so far:\n${JSON.stringify({ star: was.star, goals: was.goals })}\n\nThe person's messages, oldest first:\n"""\n${words
    .map(one => `[${one.at.slice(0, 10)}] ${oneLine(one.text).slice(0, 1500)}`)
    .join('\n')
    .slice(-most)}\n"""`
export const pictureOf = (answer: Record<string, unknown> | undefined, now: number): ProgressPicture | undefined => {
  const star = answer?.star as { text?: unknown; said?: unknown } | undefined
  if (!answer || !isText(star?.text)) return undefined
  const goals = (Array.isArray(answer.goals) ? answer.goals : [])
    .map(one => one as { id?: unknown; name?: unknown; words?: unknown; said?: unknown })
    .map(goal => ({ id: slug(textOr(goal.id) || textOr(goal.name)).slice(0, 40), name: plainLine(goal.name, 4, 40), words: oneLine(textOr(goal.words)).slice(0, 240), said: textOr(goal.said).slice(0, 10) }))
    .filter((goal, n, all) => goal.id && goal.name && all.findIndex(other => other.id === goal.id) === n)
    .slice(0, 6)
  return { star: { text: oneLine(star.text).slice(0, 160), said: textOr(star.said).slice(0, 10) }, goals, updated: new Date(now).toISOString() }
}

// ---- What a task starting is told: what was set aside before in the areas its words are about, with why, so that data point is
// used. Found by the words its title and instructions share with each area's name, aim and newest titles ----

const aboutWords = (text: string) => new Set(slug(text).split('-').filter(word => word.length >= 4 && !['with', 'from', 'that', 'this', 'into', 'your', 'what', 'when', 'work'].includes(word)))
export const asideLines = (title: string, prompt: string, areas: ProgressArea[], entries: Map<string, ProgressEntry[]>) => {
  const words = aboutWords(`${title} ${prompt.slice(0, 3000)}`)
  const lines: string[] = []
  for (const area of areas) {
    const list = entries.get(area.id) ?? []
    const asides = list.filter(e => e.kind === 'aside')
    if (!asides.length) continue
    const shared = [...aboutWords(`${area.name} ${area.aim} ${list.slice(0, 20).map(e => e.title).join(' ')}`)].filter(word => words.has(word))
    if (shared.length < 2) continue
    lines.push(...asides.slice(0, 4).map(e => `- In ${area.name}: "${e.title}" (${e.at.slice(0, 10)}), set aside: ${e.reason || 'no reason given'}`))
  }
  return lines.slice(0, 8)
}
