import type { Shared, Todo } from '../types'

// ---- Every chat's work in every panel: each chat keeps its running work in a small file of its own, the others read it ----
// ~/.claude/claudopus/live/<chat id>.json, written only by that chat; an answer to one of its asks from another chat's panel is
// left for it in live/answers/<chat id>/, which it reads and acts on as if pressed in its own panel

export const LIVE_DIR = 'live'
export const ANSWERS = 'answers'
// The other Macs' files, as last fetched, one per Mac: live/macs/<host>.json, shared by every chat on this Mac
export const MACS = 'macs'
// A chat with work running writes its file again at least this often, so a file not written for STALE has lost its chat: it was
// closed, it crashed, or its Mac is asleep or gone. Its work then shows nowhere, never as running for ever
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

// A chat's file as read, or nothing when it is no such file, has no work, or has not been written for too long. `now` is the clock
// of the Mac that wrote it, so a Mac whose clock runs apart from this one's is judged by its own
export const sharedOf = (text: string, now: number, host = ''): Shared | undefined => {
  try {
    const one = JSON.parse(text) as Partial<Shared>
    if (typeof one.chat !== 'string' || !one.chat || typeof one.at !== 'number' || !Array.isArray(one.cards)) return undefined
    if (now - one.at > STALE || !one.cards.length) return undefined
    const cards = one.cards.filter((card): card is Todo => Boolean(card && typeof card.id === 'string' && card.id && Array.isArray(card.items) && Array.isArray(card.entries)))
    if (!cards.length) return undefined
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

// The other chats in the order the panel shows them: those that wait on the person first, then the one whose work began first
export const ordered = (list: readonly Shared[]) =>
  [...list].sort((a, b) => Number(b.cards.some(one => one.ask)) - Number(a.cards.some(one => one.ask)) || Math.min(...a.cards.map(one => one.startedAt)) - Math.min(...b.cards.map(one => one.startedAt)))

// What a chat is called above its cards: its title, else its folder's name, and the Mac it runs on when that is another
export const chatName = (c: { title: string; folder: string }) => c.title.trim() || c.folder.split('/').filter(Boolean).pop() || 'Another chat'
export const chatSide = (c: { folder: string; host: string }) => [c.folder.split('/').filter(Boolean).pop() ?? '', c.host ? `on ${c.host}` : ''].filter(Boolean).join(' · ')

// One answer left for another chat: the card by its own id there, what was pressed or written, and the ask it answers
export type Answer = { card: string; choice: string; isReply: boolean; ask: string; at: number }
export const answerOf = (text: string): Answer | undefined => {
  try {
    const one = JSON.parse(text) as Partial<Answer>
    return typeof one.card === 'string' && typeof one.choice === 'string' && one.choice.trim() ? { card: one.card, choice: one.choice, isReply: Boolean(one.isReply), ask: typeof one.ask === 'string' ? one.ask : '', at: Number(one.at) || 0 } : undefined
  } catch {
    return undefined
  }
}

// What one fetch of another Mac answers: its clock, then each chat's file, each on one line. Lines that are not a file are left out
export const MARK = '---claudopus-live---'
export const fetchedOf = (text: string, host: string): Shared[] => {
  const [clock = '', ...files] = text.split(`${MARK}\n`)
  const now = Number(clock.trim()) * 1000
  if (!now) return []
  return files.map(one => sharedOf(one, now, host)).filter((one): one is Shared => one !== undefined)
}
// The command that fetches it, run on that Mac over ssh: its clock in seconds, then every chat file there written in the last day
export const FETCH = `date +%s; for f in $(find ~/.claude/claudopus/${LIVE_DIR} -maxdepth 1 -name '*.json' -mtime -1 2>/dev/null); do echo '${MARK}'; tr -d '\\n' < "$f"; echo; done`
// A Mac named in config.json `macs`, as ssh takes it: user@host, or a Host line of ~/.ssh/config. Nothing else is run
export const isMac = (one: unknown): one is string => typeof one === 'string' && /^[A-Za-z0-9_.-]+(@[A-Za-z0-9_.-]+)?$/.test(one) && !one.startsWith('-')
export const macName = (one: string) => (one.split('@').pop() ?? one).split('.')[0] ?? one
