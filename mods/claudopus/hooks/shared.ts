import type { Link, Prompt, Shared, Todo } from '../types'

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

// Work that ended is shown in other chats' panels too, where it turns happy and folds into Finished as in its own: the newest few
// that ended in the last hours, while its chat is open
export const ENDED_SHARED = 10
export const ENDED_FOR = 12 * 3_600_000
// The work of this chat that other chats show: running work, ended work that still waits on an answer from its buttons, and the
// work that ended lately
export const shareable = (list: readonly Todo[], now = 0): Todo[] =>
  list
    .filter(one => !one.parentId && !one.chat)
    .filter((one, _, all) => one.status === 'working' || Boolean(one.ask?.choices?.length) || (one.endedAt > now - ENDED_FOR && all.filter(other => other.status !== 'working' && other.endedAt > one.endedAt).length < ENDED_SHARED))
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

// The prompts a chat's file carries, as far as they are whole: at most a few, each cut short
const PROMPTS_SHARED = 6
export const promptsOf = (list: unknown): Prompt[] =>
  (Array.isArray(list) ? list : [])
    .filter((one): one is Prompt => Boolean(one && typeof one.id === 'string' && one.id && typeof one.text === 'string' && one.text && typeof one.at === 'number'))
    .filter((one, i, all) => all.findIndex(other => other.id === one.id) === i)
    .slice(0, PROMPTS_SHARED)
    .map(one => ({ id: one.id.slice(0, 80), text: plain(one.text).slice(0, 200), ...(typeof one.title === 'string' && plain(one.title) ? { title: plain(one.title).slice(0, 120) } : {}), at: one.at }))
// Text from another chat's file with no control characters, so nothing in it can move or colour the terminal
const plain = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim()

// A chat's file as read, or nothing when it is no such file, has not been written for too long, or has nothing going on: no work,
// running or ended lately, and no prompt (an open chat with nothing going on is not listed, on any Mac). `now` is the clock of the
// Mac that wrote it, so a Mac whose clock runs apart from this one's is judged by its own
export const sharedOf = (text: string, now: number, host = ''): Shared | undefined => {
  try {
    const one = JSON.parse(text) as Partial<Shared> & { ended?: unknown }
    if (typeof one.chat !== 'string' || !one.chat || typeof one.at !== 'number' || !Array.isArray(one.cards)) return undefined
    if (now - one.at > STALE) return undefined
    // Running work under `cards`, ended work apart under `ended`, so a version that reads `cards` alone never shows ended work as running
    const cards = [...one.cards, ...(Array.isArray(one.ended) ? (one.ended as unknown[]) : [])].filter((card): card is Todo => Boolean(card && typeof card.id === 'string' && card.id && Array.isArray(card.items) && Array.isArray(card.entries)))
    // A chat waiting on its own prompt is listed whether or not it has work
    const prompts = promptsOf(one.prompts)
    if (!cards.length && !prompts.length) return undefined
    const link = linkOf(one.link)
    return { chat: one.chat, title: typeof one.title === 'string' ? one.title : '', folder: typeof one.folder === 'string' ? one.folder : '', host: host || (typeof one.host === 'string' ? one.host : ''), at: one.at, cards, ...(prompts.length ? { prompts } : {}), ...(link ? { link } : {}) }
  } catch {
    return undefined
  }
}

// The chat a file is of, as `host/chat`, while it is open (written within STALE), whether or not it has anything going on
export const openChatOf = (text: string, now: number, host = '') => {
  try {
    const one = JSON.parse(text) as Partial<Shared>
    return typeof one.chat === 'string' && one.chat && typeof one.at === 'number' && now - one.at <= STALE ? `${host || (typeof one.host === 'string' ? one.host : '')}/${one.chat}` : ''
  } catch {
    return ''
  }
}
// The same for each chat of a fetch from another Mac, judged by that Mac's clock
export const fetchedOpen = (text: string, host: string) => {
  const [, ...files] = text.split(`${MARK}\n`)
  const now = clockOf(text)
  return now ? files.map(one => openChatOf(one, now, host)).filter(Boolean) : []
}

// The cards of other chats as this panel lists them: each names its chat, and its id is kept apart from this chat's own
export const REMOTE = 'r-'
// The chat and its Mac in a few letters, so the id stays short enough to name a Details tab whole
const short = (text: string) => [...text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 2_147_483_647, 7).toString(36)
export const remoteId = (s: Shared, id: string) => `${REMOTE}${short(`${s.host}/${s.chat}`)}-${id}`
export const cardsOf = (list: readonly Shared[]): Todo[] =>
  list.flatMap(s => s.cards.map(one => ({ ...one, id: remoteId(s, one.id), chat: { id: s.chat, title: s.title, folder: s.folder, host: s.host, agent: one.id } })))

// The other chats in the order the panel shows them: those that wait on the person first (an open prompt, which holds its chat up,
// before an ask), then the one whose running work began first, then the open chats with none running, by name
const firstStart = (s: Shared) => {
  const running = s.cards.filter(one => one.status === 'working' || one.ask)
  return running.length ? Math.min(...running.map(one => one.startedAt)) : Number.MAX_SAFE_INTEGER
}
const waits = (s: Shared) => (s.prompts?.length ? 2 : s.cards.some(one => one.ask) ? 1 : 0)
export const ordered = (list: readonly Shared[]) =>
  [...list].sort((a, b) => waits(b) - waits(a) || firstStart(a) - firstStart(b) || chatName(a).localeCompare(chatName(b)))

// What a chat is called above its cards: its title, else its folder's name, and the Mac it runs on when that is another
export const chatName = (c: { title: string; folder: string }) => c.title.trim() || c.folder.split('/').filter(Boolean).pop() || 'Another chat'
// Its folder, unless the name already is the folder, and the Mac it runs on when another
// (`self` names this Mac, for a chat of this Mac once other Macs' chats are listed beside it)
export const chatSide = (c: { title: string; folder: string; host: string }, self = '') => {
  const folder = c.folder.split('/').filter(Boolean).pop() ?? ''
  return [folder === chatName(c) ? '' : folder, c.host ? `on ${macName(c.host)}` : self ? `on ${self}` : ''].filter(Boolean).join(' · ')
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
    .map(one => sharedOf(one, now, host))
    .filter((one): one is Shared => one !== undefined)
    .map(one => ({ ...one, at: moved(one.at), cards: one.cards.map(card => ({ ...card, startedAt: moved(card.startedAt), endedAt: moved(card.endedAt) })), ...(one.prompts ? { prompts: one.prompts.map(p => ({ ...p, at: moved(p.at) })) } : {}) }))
}

// ---- The same trip the other way: a Mac that reaches another over ssh hands it its own chats, so that Mac's panels list them with
// no ssh back and no setting there. It lands there as live/pushed/<this Mac>.json, in the fetch's own form under one line saying who
// handed it and what it calls the Mac it handed it to; an answer pressed there for one of these chats waits in
// live/outbox/<this Mac>/ until the next trip carries it here, and is put away there on the trip after ----
export const PUSHED = 'pushed'
export const OUTBOX = 'outbox'
export const ANSWER_MARK = '---claudopus-answer---'
// A Mac's name as it is handed over and shown: small letters, digits and dashes
export const isKey = (one: unknown): one is string => typeof one === 'string' && /^[a-z0-9][a-z0-9-]{0,62}$/.test(one)
export const keyOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 63)
// An answer's file name, as answerElsewhere makes it
export const isAnswerName = (one: string) => /^\d+-[a-z0-9]+\.json$/.test(one)
// What this Mac hands over: who it is and what it calls that Mac, its clock in seconds, then each of its chats' files on one line
export const pushOf = (from: string, you: string, now: number, files: readonly string[]) =>
  `${JSON.stringify({ from, you })}\n${Math.floor(now / 1000)}\n${files.map(one => `${MARK}\n${one.replace(/\n/g, '')}\n`).join('')}`
export const pushHead = (text: string): { from: string; you: string } | undefined => {
  try {
    const one = JSON.parse(text.slice(0, Math.max(0, text.indexOf('\n')))) as { from?: unknown; you?: unknown }
    return isKey(one.from) ? { from: one.from, you: isKey(one.you) ? one.you : '' } : undefined
  } catch {
    return undefined
  }
}
// The command of one trip, run there by sh: leave what this Mac hands over, put away the answers the last trip carried and any
// older than an hour, then its clock in seconds and the chats there running without Claudopus, then every chat file there written
// in the last three minutes, followed by the answers waiting for this Mac
export const trip = (from: string, acks: readonly string[]) => {
  const out = `$L/${OUTBOX}/${from}`
  const put = acks.filter(isAnswerName)
  return `sh -c 'L=$HOME/.claude/claudopus/${LIVE_DIR}; mkdir -p $L/${PUSHED} ${out}; cat > $L/${PUSHED}/${from}.$$.part && mv -f $L/${PUSHED}/${from}.$$.part $L/${PUSHED}/${from}.json; cd ${out} && { ${put.length ? `rm -f ${put.join(' ')}; ` : ''}find . -name "*.json" -mmin +60 -exec rm -f {} +; }; cd; date +%s; ${OFF_LOOK} for f in $(find $L -maxdepth 1 -name "*.json" -mmin -3 2>/dev/null); do echo ${MARK}; tr -d "\\n" < "$f"; echo; done; for f in $(find ${out} -maxdepth 1 -name "*.json" 2>/dev/null); do echo ${ANSWER_MARK}; basename "$f"; tr -d "\\n" < "$f"; echo; done'`
}
// ---- Chats running without Claudopus. The Claude app runs a chat on another Mac over SSH with that Mac's own install, unless it
// decided once that the install "didn't load there": from then until the app quits it hands every new chat there its own copy,
// which leaves out the hooks folder, so in that chat no Claudopus code runs at all (no panel, tools, rules or shared file) ----
// The look, run by sh, with no single quote so a trip can carry it: each engine on this Mac started with a --plugin-dir that is a
// Claudopus with no hooks/hooks.json, as `off <chat id> <its title file>`; `new` for an engine that names no chat
export const OFF_LOOK = `set -f; ps -axww -o args= 2>/dev/null | grep -e "--plugin-dir" | sed "s/--plugin-dir /--plugin-dir=/g" | while read -r a; do for w in $a; do case $w in --plugin-dir=/*) d=\${w#--plugin-dir=}; if grep -qs "\\"name\\": *\\"claudopus\\"" "$d/.claude-plugin/plugin.json" && [ ! -e "$d/hooks/hooks.json" ]; then s=new; for v in $a; do case $v in --resume=*) s=\${v#--resume=};; --session-id=*) s=\${v#--session-id=};; esac; done; set +f; t=$(cat $HOME/.claude/projects/*/"$s"/custom-title.json 2>/dev/null | head -c 400 | tr -d "\\n"); set -f; echo "off $s $t"; fi;; esac; done; done; set +f;`
// A chat running without Claudopus: its id (or `new`) and its title, as its Mac has it
export type Off = { chat: string; title: string }
export const offOf = (text: string): Off[] => {
  const [head = ''] = text.split(`${MARK}\n`)
  const found = head.split('\n').flatMap(line => {
    const m = /^off ([A-Za-z0-9_-]{1,80}) ?(.*)$/.exec(line.trim())
    if (!m) return []
    let title = ''
    try {
      const t = (JSON.parse(m[2] || '{}') as { customTitle?: unknown }).customTitle
      title = typeof t === 'string' ? plain(t).slice(0, 120) : ''
    } catch {
      title = ''
    }
    return [{ chat: m[1] ?? '', title }]
  })
  return found.filter((one, i) => found.findIndex(other => other.chat === one.chat) === i)
}
// The app's own log on this Mac: the last time it started, or decided a Mac's own install didn't load there. The decision holds,
// in the app's memory only, until the app is quit, so the last of the two says whether it holds now
export const APP_LOG_LOOK = `cd "$HOME/Library/Logs/Claude" 2>/dev/null && cat main1.log main.log 2>/dev/null | grep -a -E "\\[info\\] Starting app|own install did not load there" | tail -1`
// When the app decided it, by its log's own clock, or '' while it does not hold
export const stuckOf = (text: string) => {
  const line = text.trim().split('\n').at(-1) ?? ''
  return /did not load there/.test(line) ? (/^(\d{4}-\d\d-\d\d \d\d:\d\d)/.exec(line)?.[1] ?? 'earlier') : ''
}

// One answer waiting there, with the chat here it is for
export type Carried = { name: string; chat: string; answer: Answer }
// What a trip answers: the fetch, as fetchedOf reads it, and the answers it carried back
export const tripOf = (text: string): { text: string; carried: Carried[] } => {
  const [fetched = '', ...rest] = text.split(`${ANSWER_MARK}\n`)
  const carried = rest.flatMap(part => {
    const [name = '', body = ''] = part.split('\n')
    const answer = answerOf(body)
    let chat = ''
    try {
      chat = String((JSON.parse(body) as { chat?: unknown }).chat ?? '')
    } catch {
      chat = ''
    }
    return isAnswerName(name) && answer && /^[A-Za-z0-9_-]+$/.test(chat) ? [{ name, chat, answer }] : []
  })
  return { text: fetched, carried }
}
// ---- A press on a chat's name in a chat another Mac's Claude app runs here over SSH: that app, and the screen the person looks
// at, are on the other Mac, so the press is left in live/outbox/<that Mac>/ as o-<time>-<id>.json, which that Mac takes within
// OPEN_EVERY and opens there with what its own app holds. One pressed more than OPEN_KEPT before it is taken is dropped, not opened late ----
export const OPEN_EVERY = 2_000
export const OPEN_KEPT = 30_000
export const OPEN_MARK = '---claudopus-open---'
// The command that takes them there, run by sh: its clock in seconds, then each press, every file moved aside before it is read so
// two chats taking at once never take one twice
export const openTake = (from: string) =>
  `sh -c 'cd $HOME/.claude/claudopus/${LIVE_DIR}/${OUTBOX}/${from} 2>/dev/null || exit 0; find . -name "o-*" -mmin +60 -exec rm -f {} + 2>/dev/null; date +%s; for f in o-*.json; do [ -f "$f" ] && mv "$f" "$f.$$" 2>/dev/null && { echo ${OPEN_MARK}; tr -d "\\n" < "$f.$$"; echo; rm -f "$f.$$"; }; done'`
// The chats those presses name, each once, as far as they were pressed within OPEN_KEPT by that Mac's clock
export const opensOf = (text: string): string[] => {
  const [head = '', ...parts] = text.split(`${OPEN_MARK}\n`)
  const now = Number([...head.split('\n')].reverse().find(line => /^\d{9,}$/.test(line.trim()))?.trim() ?? 0) * 1000
  if (!now) return []
  const chats = parts.flatMap(part => {
    try {
      const one = JSON.parse(part.split('\n')[0] ?? '') as { chat?: unknown; at?: unknown }
      const at = Number(one.at) || 0
      return typeof one.chat === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(one.chat) && Math.abs(now - at) <= OPEN_KEPT ? [one.chat] : []
    } catch {
      return []
    }
  })
  return [...new Set(chats)]
}

// That Mac's clock as the head of a fetch gives it, in ms
export const clockOf = (text: string) => {
  const [head = ''] = text.split(`${MARK}\n`)
  return Number([...head.split('\n')].reverse().find(line => /^\d{9,}$/.test(line.trim()))?.trim() ?? 0) * 1000
}

// A Mac named in config.json `macs`, as ssh takes it: user@host, or a Host line of ~/.ssh/config. Nothing else is run
export const isMac = (one: unknown): one is string => typeof one === 'string' && /^[A-Za-z0-9_][A-Za-z0-9_.-]*(@[A-Za-z0-9_][A-Za-z0-9_.-]*)?$/.test(one)
export const macName = (one: string) => (one.split('@').pop() ?? one).split('.')[0] ?? one

// ---- The link a press on a chat's name opens ----

// The ids the Claude app takes, as it checks them: a Remote Control or cloud session, and its own session on this Mac
export const BRIDGE_ID = /^(cse|session)_[A-Za-z0-9_-]{1,80}$/
export const APP_ID = /^local_[A-Za-z0-9-]{1,64}$/
export const linkOf = (one: unknown): Link | undefined => {
  // A chat on a version before names were pressed gives the app's own link whole
  if (typeof one === 'string') {
    const app = /^claude:\/\/code\/continue\?session=(local_[A-Za-z0-9-]{1,64})$/.exec(one)?.[1] ?? ''
    return app ? { bridge: '', app } : undefined
  }
  if (!one || typeof one !== 'object') return undefined
  const l = one as Partial<Record<keyof Link, unknown>>
  const link = { bridge: typeof l.bridge === 'string' && BRIDGE_ID.test(l.bridge) ? l.bridge : '', app: typeof l.app === 'string' && APP_ID.test(l.app) ? l.app : '' }
  return link.bridge || link.app ? link : undefined
}
// What a press on a chat's name opens in the Claude app. The app's own id first whenever this Mac's app holds that chat (`held`): one
// of this Mac's, or one it runs on another Mac over SSH, which it lists in its own sidebar. Else its Remote Control session, which the
// app opens from any Mac; else, for a chat of this Mac, the app's id it shares. A chat of another Mac's own app with Remote Control off
// has nothing this Mac can open
export const openUrl = (c: { host: string; link?: Link }, held = '') => {
  const app = APP_ID.test(held) ? held : !c.host ? (c.link?.app ?? '') : ''
  return app ? `claude://code/continue?session=${app}` : c.link?.bridge ? `claude://code/${c.link.bridge}` : ''
}

// The panel's header: one line for everything the panel shows, every chat's, so it never says less than the cards under it.
// What needs the person comes first; then what runs, here, in other chats, or both; then what just finished; else nothing
export type Head = { here: number; there: number; chats: number; asks: number; isDone: boolean }
const things = (n: number) => (n === 1 ? '1 thing' : `${n} things`)
export const headLine = ({ here, there, chats, asks, isDone }: Head) => {
  const running = here + there
  if (asks) return `${things(asks)} ${asks === 1 ? 'needs' : 'need'} you${running ? `, ${running} running` : ''}`
  const others = chats === 1 ? '1 other chat' : `${chats} other chats`
  if (here && there) return `Working on ${things(running)} here and in ${others}`
  if (there) return `Working on ${things(there)} in ${chats === 1 ? 'another chat' : others}`
  if (here) return `Working on ${things(here)}`
  return isDone ? 'Just finished' : 'Nothing is running'
}
// The octopus beside it: happy for the moment work finishes, whatever else goes on, so no finish passes unseen; else amber while
// anything needs the person, at work while anything runs, resting only when nothing goes on anywhere
export const headMood = ({ here, there, asks, isDone }: Head) => (isDone ? 'happy' : asks ? 'asking' : here + there ? 'working' : 'mark')
