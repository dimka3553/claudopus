import type { Shared, Todo } from '../types'

// ---- Every chat's work in every panel: each chat keeps its running work in a small file of its own, the others read it ----
// ~/.claude/claudopus/live/<chat id>.json, written only by that chat; an answer to one of its asks from another chat's panel is
// left for it in live/answers/<chat id>/, which it reads and acts on as if pressed in its own panel

export const LIVE_DIR = 'live'
export const ANSWERS = 'answers'
// The other Macs' files, as last fetched, one per Mac: live/macs/<host>.json, shared by every chat on this Mac
export const MACS = 'macs'
// Every open chat writes its file again at least this often, work or none, so a file not written for STALE has lost its chat: it
// was closed, it crashed, or its Mac is asleep or gone. It then shows nowhere, and its work never as running for ever
export const BEAT = 20_000
export const STALE = 90_000
// Other chats' files are read this often; the other Macs' fetched this often, by whichever chat on this Mac comes first
export const LOOK_EVERY = 5_000
export const FETCH_EVERY = 10_000
// What one card carries to other chats: enough for its small card and its Details, not its whole log
const ITEMS_SHARED = 30
const WORDS_SHARED = 1200

// The work of this chat that other chats show: running work, and ended work that still waits on an answer from its buttons
export const shareable = (list: readonly Todo[]): Todo[] =>
  list
    .filter(one => !one.parentId && !one.chat && (one.status === 'working' || Boolean(one.ask?.choices?.length)))
    .map(one => ({
      ...one,
      words: one.words.slice(0, WORDS_SHARED),
      items: one.items.slice(-ITEMS_SHARED),
      entries: [...one.entries].reverse().filter(entry => entry.kind !== 'steer').slice(0, 1),
      answer: '',
    }))

// What tells one shared state from another, the running times aside: a file is written again when it changes or its beat is due
export const signOf = (cards: readonly Todo[]) =>
  JSON.stringify(cards.map(one => [one.id, one.status, one.title, one.model, one.tokens, one.items, one.entries.at(-1)?.text ?? '', one.ask?.text ?? '', one.ask?.at ?? 0, one.ask?.copy ?? '', one.ask?.choices ?? []]))

// A chat's file as read, or nothing when it is no such file, has not been written for too long, or has no work and `isIdleKept` is
// not set (a chat of this Mac with no work is not listed; one of another Mac is, so its open chats show). `now` is the clock of the
// Mac that wrote it, so a Mac whose clock runs apart from this one's is judged by its own
export const sharedOf = (text: string, now: number, host = '', isIdleKept = false): Shared | undefined => {
  try {
    const one = JSON.parse(text) as Partial<Shared>
    if (typeof one.chat !== 'string' || !one.chat || typeof one.at !== 'number' || !Array.isArray(one.cards)) return undefined
    if (now - one.at > STALE) return undefined
    const cards = one.cards.filter((card): card is Todo => Boolean(card && typeof card.id === 'string' && card.id && Array.isArray(card.items) && Array.isArray(card.entries)))
    if (!cards.length && !isIdleKept) return undefined
    return { chat: one.chat, title: typeof one.title === 'string' ? one.title : '', folder: typeof one.folder === 'string' ? one.folder : '', host: host || (typeof one.host === 'string' ? one.host : ''), at: one.at, cards }
  } catch {
    return undefined
  }
}

// The cards of other chats as this panel lists them: each names its chat, and its id is kept apart from this chat's own
export const REMOTE = 'r-'
// The chat and its Mac in a few letters, so the id stays short enough to name a Details tab whole
const short = (text: string) => [...text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 2_147_483_647, 7).toString(36)
export const remoteId = (s: Shared, id: string) => `${REMOTE}${short(`${s.host}/${s.chat}`)}-${id}`
export const cardsOf = (list: readonly Shared[]): Todo[] =>
  list.flatMap(s => s.cards.map(one => ({ ...one, id: remoteId(s, one.id), chat: { id: s.chat, title: s.title, folder: s.folder, host: s.host, agent: one.id } })))

// The other chats in the order the panel shows them: those that wait on the person first, then the one whose work began first, then
// the open chats of other Macs with no work, by name
const firstStart = (s: Shared) => (s.cards.length ? Math.min(...s.cards.map(one => one.startedAt)) : Number.MAX_SAFE_INTEGER)
export const ordered = (list: readonly Shared[]) =>
  [...list].sort((a, b) => Number(b.cards.some(one => one.ask)) - Number(a.cards.some(one => one.ask)) || firstStart(a) - firstStart(b) || chatName(a).localeCompare(chatName(b)))

// What a chat is called above its cards: its title, else its folder's name, and the Mac it runs on when that is another
export const chatName = (c: { title: string; folder: string }) => c.title.trim() || c.folder.split('/').filter(Boolean).pop() || 'Another chat'
// Its folder, unless the name already is the folder, and the Mac it runs on when another
export const chatSide = (c: { title: string; folder: string; host: string }) => {
  const folder = c.folder.split('/').filter(Boolean).pop() ?? ''
  return [folder === chatName(c) ? '' : folder, c.host ? `on ${macName(c.host)}` : ''].filter(Boolean).join(' · ')
}

// One answer left for another chat: the card by its own id there, what was pressed or written, and the ask it answers, by its
// words and the moment it was asked by that chat's clock. `at` is when it was pressed, by the clock of the Mac it was pressed on
export type Answer = { card: string; choice: string; isReply: boolean; ask: string; askAt: number; at: number }
// An answer that waited longer than this, as for a chat that was closed and opened again much later, is dropped, not acted on
export const ANSWER_KEPT = 10 * 60_000
export const answerOf = (text: string): Answer | undefined => {
  try {
    const one = JSON.parse(text) as Partial<Answer>
    return typeof one.card === 'string' && typeof one.choice === 'string' && one.choice.trim() ? { card: one.card, choice: one.choice, isReply: Boolean(one.isReply), ask: typeof one.ask === 'string' ? one.ask : '', askAt: Number(one.askAt) || 0, at: Number(one.at) || 0 } : undefined
  } catch {
    return undefined
  }
}

// What one fetch of another Mac answers: its clock, then each chat's file, each on one line. Lines that are not a file are left out
export const MARK = '---claudopus-live---'
// That Mac's times are moved onto this one's clock by how far apart the two were at the fetch, so running times and order hold
export const fetchedOf = (text: string, host: string, fetchedAt = 0): Shared[] => {
  const [head = '', ...files] = text.split(`${MARK}\n`)
  // Its clock is the last line of digits before the first file: a login banner above it is passed over
  const now = Number([...head.split('\n')].reverse().find(line => /^\d{9,}$/.test(line.trim()))?.trim() ?? 0) * 1000
  if (!now) return []
  const shift = fetchedAt ? fetchedAt - now : 0
  const moved = (at: number) => (at ? at + shift : at)
  return files
    .map(one => sharedOf(one, now, host, true))
    .filter((one): one is Shared => one !== undefined)
    .map(one => ({ ...one, at: moved(one.at), cards: one.cards.map(card => ({ ...card, startedAt: moved(card.startedAt), endedAt: moved(card.endedAt) })) }))
}
// The command that fetches it, run on that Mac over ssh by sh whatever its login shell: its clock in seconds, then every chat file
// there written in the last three minutes (an older one is stale anyway)
export const FETCH = `sh -c 'date +%s; for f in $(find ~/.claude/claudopus/${LIVE_DIR} -maxdepth 1 -name "*.json" -mmin -3 2>/dev/null); do echo ${MARK}; tr -d "\\n" < "$f"; echo; done'`
// A Mac named in config.json `macs`, as ssh takes it: user@host, or a Host line of ~/.ssh/config. Nothing else is run
export const isMac = (one: unknown): one is string => typeof one === 'string' && /^[A-Za-z0-9_][A-Za-z0-9_.-]*(@[A-Za-z0-9_][A-Za-z0-9_.-]*)?$/.test(one)
export const macName = (one: string) => (one.split('@').pop() ?? one).split('.')[0] ?? one
