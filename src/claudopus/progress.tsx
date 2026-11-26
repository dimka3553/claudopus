// Progress: each piece of work sorted into the area it moves on, kept in the memory folder's progress/ by Claudopus alone. The
// picture (the north star and the goals, in the person's own words), the areas with their next steps, and each area's entries, the
// newest first. The Progress tab draws from these files; the indexer here keeps them up to date in the background

// The north star and the goals, each in the person's own words with the day they were said
type ProgressPicture = { star: { text: string; said: string }; goals: { id: string; name: string; words: string; said: string }[]; updated: string }
// One step of an area: a plain sentence of what will exist when it is done, open, done, or set aside
type ProgressNext = { id: string; text: string; state: 'open' | 'done' | 'aside'; at: string }
// An area of work: under a goal (its id, or '' for none), one plain line of what it is for, and its next steps
type ProgressArea = { id: string; name: string; goal: string; aim: string; next: ProgressNext[]; updated: string }
// One piece of work in an area: the task (its agent id), its result (reports/<report>/report.md), what it was and came to
type ProgressEntry = {
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

// The folder of it all, in the memory folder
const progressDir = () => `${dir}/progress`
// Counts the changes to progress/: each one redraws what reads it
const progressChanged = atom({ plugin: 'claudopus', key: 'progress' } as const, 0, { shape: 'progress-1' })

const isText = (value: unknown): value is string => typeof value === 'string'
const textOr = (value: unknown, or = '') => (isText(value) ? value : or)
const readJson = async ($: EngineInterface, path: string): Promise<unknown> => {
  const text = await readOr($, path)
  if (!text.trim()) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}
const nextOf = (value: unknown): ProgressNext | undefined => {
  const one = value as Partial<ProgressNext> | undefined
  if (!one || !isText(one.id) || !isText(one.text) || !one.text.trim()) return undefined
  const state = one.state === 'done' || one.state === 'aside' ? one.state : 'open'
  return { id: one.id, text: one.text, state, at: textOr(one.at) }
}
const areaOf = (value: unknown): ProgressArea | undefined => {
  const one = value as Partial<ProgressArea> | undefined
  if (!one || !isText(one.id) || !one.id || !isText(one.name) || !one.name.trim()) return undefined
  const next = (Array.isArray(one.next) ? one.next : []).map(nextOf).filter((n): n is ProgressNext => Boolean(n))
  return { id: one.id, name: one.name, goal: textOr(one.goal), aim: textOr(one.aim), next, updated: textOr(one.updated) }
}
const entryOf = (value: unknown): ProgressEntry | undefined => {
  const one = value as Partial<ProgressEntry> | undefined
  if (!one || !isText(one.title) || !one.title.trim()) return undefined
  const kind = one.kind === 'milestone' || one.kind === 'aside' ? one.kind : 'task'
  const pictures = (Array.isArray(one.pictures) ? one.pictures : []).filter(isText)
  return {
    task: textOr(one.task),
    title: one.title,
    at: textOr(one.at),
    kind,
    outcome: textOr(one.outcome),
    report: textOr(one.report),
    pictures,
    live: textOr(one.live),
    reason: textOr(one.reason),
  }
}
const EMPTY_PICTURE: ProgressPicture = { star: { text: '', said: '' }, goals: [], updated: '' }
// The picture as saved; an empty one when there is none yet
const readPicture = async ($: EngineInterface): Promise<ProgressPicture> => {
  const raw = (await readJson($, `${progressDir()}/picture.json`)) as Partial<ProgressPicture> | undefined
  if (!raw || typeof raw !== 'object') return EMPTY_PICTURE
  const star = raw.star && typeof raw.star === 'object' ? { text: textOr(raw.star.text), said: textOr(raw.star.said) } : EMPTY_PICTURE.star
  const goals = (Array.isArray(raw.goals) ? raw.goals : [])
    .filter(goal => goal && isText(goal.id) && goal.id && isText(goal.name) && goal.name.trim())
    .map(goal => ({ id: goal.id, name: goal.name, words: textOr(goal.words), said: textOr(goal.said) }))
  return { star, goals, updated: textOr(raw.updated) }
}
// Every area as saved, in its saved order
const readAreas = async ($: EngineInterface): Promise<ProgressArea[]> => {
  const raw = (await readJson($, `${progressDir()}/areas.json`)) as { areas?: unknown } | undefined
  return (Array.isArray(raw?.areas) ? raw.areas : []).map(areaOf).filter((a): a is ProgressArea => Boolean(a))
}
// An area's ids are made by Claudopus, of letters, digits and dashes: anything else names no file of it
const isAreaId = (id: string) => /^[a-z0-9][a-z0-9-]{0,63}$/.test(id)
// An area's entries, the newest first
const readEntries = async ($: EngineInterface, areaId: string): Promise<ProgressEntry[]> => {
  if (!isAreaId(areaId)) return []
  const raw = (await readJson($, `${progressDir()}/areas/${areaId}.json`)) as { entries?: unknown } | undefined
  return (Array.isArray(raw?.entries) ? raw.entries : [])
    .map(entryOf)
    .filter((e): e is ProgressEntry => Boolean(e))
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
}
