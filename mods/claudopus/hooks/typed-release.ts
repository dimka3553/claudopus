// A message the person typed in the chat while a release waits for their go-ahead, read more widely than a short answer
// (src/claudopus/typed.tsx): it counts when it plainly tells to release, by a verb of releasing or by yes-words alone; never when it
// is a question, and never when a word holds it back. Which release it is for, and what the chat's model is told. Pure: kept out of
// the joined hooks file, which the engine reads only up to 1 MB (28 Nov: a release waited on its card far down the panel while the
// person typed "push all so I can test", "release it and switch now so I can test", "OK to all go push it" and "is now all
// pushed?"; none counted, each went on to the task, nothing was pushed and nothing said why)

// Up to this, one line, a message may be a go-ahead
export const TYPED_WIDEST = 120
// Up to this, a message about releasing that gave no go-ahead is told to the chat as that
export const TYPED_TALK = 300
const words = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const RELEASE_PHRASE = /\b(?:put it live|go live)\b/g
const RELEASE_VERB = new Set(['push', 'release', 'ship', 'deploy', 'publish', 'merge'])
const RELEASE_TALK = /\b(?:push|pushed|release|released|ship|deploy|deployed|publish|merge|live)\b/
const YES_PHRASE = /\b(?:go ahead|do it)\b/g
const YES_WORD = new Set(['yes', 'yeah', 'yep', 'yup', 'ok', 'okay', 'sure', 'go', 'approved', 'approve', 'allow', 'confirm', 'confirmed', 'proceed'])
const ALL_WORD = new Set(['all', 'everything', 'both'])
// Words around a task's name that are not of it, as for a short answer
const FILLER = new Set(['it', 'this', 'that', 'one', 'now', 'please', 'pls', 'the', 'task', 'card', 'for', 'on', 'to', 'in', 'of', 'thanks', 'thank', 'you', 'i', 'me', 'we', 'us', 'them', 'a', 'an', 'live', 'out', 'up', 'main', 'master', 'through', 'ahead', 'just', 'change', 'fix', 'branch'])
// Words after which a message says more than its go-ahead
const JOINER = new Set(['and', 'so', 'then', 'because', 'but', 'as', 'plus', 'also'])
const QUESTION_START = /^(?:is|are|was|were|did|does|do|has|have|can|could|should|would|why|what|when|how|where|who|which)\b/
const HOLD_WORD = /\b(?:not|never|no|nope|wait|hold|stop|cancel|before|until|unless|after|first|later|yet|if|once|when|instead|without|dont|cant|wont|cannot)\b/

// `counts`: a go-ahead. `hasVerb`: it says to release, not only yes. `isAll`: for every release that waits. `name`: the words that
// may name its task. `more`: every word not of the go-ahead. `isTalk`: about releasing, taken or not
export type ReleaseReading = { counts: boolean; hasVerb: boolean; isAll: boolean; name: string[]; more: string[]; isTalk: boolean }
export const releaseReading = (typed: string): ReleaseReading => {
  const plain = words(typed)
  const isQuestion = typed.includes('?') || (QUESTION_START.test(plain) && !/^do it\b/.test(plain))
  const isHeld = HOLD_WORD.test(plain) || /n['’]t\b/.test(typed.toLowerCase())
  let hasVerb = false
  let hasYes = false
  const tokens = plain
    .replace(RELEASE_PHRASE, () => ((hasVerb = true), ' '))
    .replace(YES_PHRASE, () => ((hasYes = true), ' '))
    .split(' ')
    .filter(Boolean)
  for (const word of tokens) ((hasVerb ||= RELEASE_VERB.has(word)), (hasYes ||= YES_WORD.has(word)))
  const isGo = (word: string) => RELEASE_VERB.has(word) || YES_WORD.has(word) || ALL_WORD.has(word) || FILLER.has(word)
  const joined = tokens.findIndex(word => JOINER.has(word))
  // (the words before any that adds more, that are not of the go-ahead)
  const name = (joined < 0 ? tokens : tokens.slice(0, joined)).filter(word => !isGo(word))
  const more = tokens.filter(word => !isGo(word))
  const isLine = !/\n/.test(typed) && typed.length <= TYPED_WIDEST
  // Yes-words alone count only with nothing more than what may name the task
  const counts = isLine && !isQuestion && !isHeld && (hasVerb || (hasYes && more.length === name.length))
  return { counts, hasVerb, isAll: tokens.some(word => ALL_WORD.has(word)), name, more, isTalk: RELEASE_TALK.test(plain) }
}

// Which waiting releases a go-ahead is for: every one with "all", the one task its words name, else the only one; `unsure` when it
// fits several, which the chat asks about. `more`: the words left that say more than the go-ahead
export const chooseReleases = <T extends { title: string }>(reading: ReleaseReading, waits: T[]): { chosen: T[]; more: string[]; unsure?: T[] } => {
  if (reading.isAll) return { chosen: waits, more: reading.more }
  const named = reading.name.length ? waits.filter(one => Boolean(one.title) && reading.name.every(word => words(one.title).split(' ').includes(word))) : []
  const tasks = new Set(named.map(one => one.title))
  if (tasks.size > 1) return { chosen: [], more: [], unsure: named }
  const last = named[named.length - 1]
  if (last) return { chosen: [last], more: reading.more.filter(word => !reading.name.includes(word)) }
  // (words left that name no waiting task: no go-ahead, as "the push notifications look good" is talk of something else)
  if (reading.name.length) return { chosen: [], more: [] }
  if (waits.length === 1) return { chosen: waits, more: reading.more }
  return { chosen: [], more: [], unsure: waits }
}

// What the chat's model is told. `{name}` and `{Name}` are filled in where they are used
// A go-ahead taken: which card it pressed, and, when the message says more, that the rest may go to the task as the person's words
export const TYPED_GO_AHEAD = (typed: string, pressed: { label: string; where: string; asked: string }[], isMore: boolean) =>
  `From Claudopus: {Name}'s message "${typed}" is their go-ahead, taken as their press on ${pressed.map(one => `"${one.label}" on ${one.where} question: ${one.asked}`).join(' and on ')} Claudopus gave it there just as their press on the card would, and the card shows it. ${
    isMore
      ? "Reply in one short line saying which card it answered. The message says more than the go-ahead: if it asks for anything beyond the release, send those words to that task once, as {name}'s words, and nothing else of it."
      : 'Reply in one short line saying which card it answered, and do nothing else for this message: send it to no task.'
  }`
export const TYPED_WHICH_RELEASE = (typed: string, waits: string[]) =>
  `From Claudopus: {Name}'s message "${typed}" released nothing, as more than one release waits for their go-ahead: ${waits.join(', ')}. Ask in one short line which one, by a word of its name, such as "release <name>", or "release all" for every one, and do nothing else for this message.`
// About releasing, with no go-ahead, while one waits: the chat says first that nothing is pushed yet
export const TYPED_NOT_GIVEN = (typed: string, waits: { what: string; label: string }[]) => {
  const [first] = waits
  return waits.length === 1 && first
    ? `From Claudopus: the release of ${first.what} waits for {name}'s go-ahead, and their message "${typed}" did not give it. If the message is about that release, begin your reply with one short line saying it is not pushed yet and waits for their yes, which they give by typing yes in the chat or pressing ${first.label} above the chat, then answer the rest of the message; if it is about something else, say nothing of the release. A message of yours to the task approves nothing.`
    : `From Claudopus: the releases of ${waits.map(one => one.what).join(', ')} wait for {name}'s go-ahead, and their message "${typed}" did not give it. If the message is about them, begin your reply with one short line saying none is pushed yet and each waits for their yes, which they give by typing "release all" or "release <a word of its name>" in the chat, or pressing ${first?.label ?? 'Allow'} above the chat or on its card. Then answer the rest of the message. A message of yours to a task approves nothing.`
}
