// Task colours: which chat reply is about which task, read from the chat's own transcript, and the links each reply gives.
// Plain code, nothing here touches the engine: the hooks in src/claudopus/colours.tsx feed it rows and draw what it answers.
// Config's Task colours (`taskColours`, on as shipped) draws each reply about a task in a box of its colour; Links at the end
// (`replyLinks`, on as shipped) lists a reply's links at its end and a task's in its Details

import type { SessionMessage, ToolResultSummary, ToolUseSummary } from 'claude-code'

/** A link a reply gave: a sheet, a Notion page, a pull request, a page on this Mac. */
export type TaskLink = {
  url: string
  /** What the reply called it: the link's own text, a Notion page's name, or the words before it. */
  label: string
  /** Where it goes, in a word or two: Notion, GitHub, This Mac, or the site's name. */
  kind: string
}

/** One task the chat talks about, as the transcript tells it. */
export type ColouredTask = {
  /** The task's name: the Agent call's description, else its notification's. */
  title: string
  /** Its place in the palette; steady for the task across chats. */
  colour: number
  /** What its newest notification said: working, finished, waiting, failed, stopped. */
  status: string
  /** The links the chat's replies about it gave, newest first. */
  links: TaskLink[]
}

/** Which task each chat reply is about. */
export type ColourIndex = {
  tasks: Record<string, ColouredTask>
  /** A reply row's id to the ids of its tasks. */
  replies: Record<string, string[]>
  /** A short hash of a reply's text to the ids of its tasks (texts said once). */
  texts: Record<string, string[]>
  /** Each reply's row id, and the hash of its text, to its place in the transcript. */
  rows: Record<string, number>
  /**
   * What the person sent each task, oldest first, each where it falls in the transcript: their chat messages the chat passed on
   * to it or asked about it in, and what they wrote to it on its card. A reply quotes the newest of its task's before it (quoteFor).
   */
  said: Record<string, Said[]>
}

/** A message of the person's to a task, and where it falls in the transcript: after the row `row` counts (a half: between rows). */
export type Said = { row: number; text: string }

/**
 * What the person wrote to a task on its card (its Message box, its answer box, Reply on a chat reply), and where the transcript
 * stood as it went: how many rows it had, and the mark of the last of them (Builder.stamp).
 */
export type CardWords = { id: string; text: string; row: number; mark: string }

/** The message of the person's a reply about a task answers: the newest they sent that task before the reply's row, or before now. */
export const quoteFor = (index: Pick<ColourIndex, 'said'>, id: string, row?: number) =>
  [...(index.said[id] ?? [])].reverse().find(one => row === undefined || one.row <= row)?.text

/** Twelve colours that read on a light and a dark chat alike. */
export const PALETTE = [
  '#E5484D',
  '#EC6A1F',
  '#C99A00',
  '#3E9B4F',
  '#0E9F8E',
  '#0091FF',
  '#6E56CF',
  '#AB4ABA',
  '#D6409F',
  '#8D7A5B',
  '#0797B9',
  '#7A8B2E',
] as const

/** The chat's answer to a notification that needs none; Claudopus hides it. */
export const NO_ANSWER = 'No response requested.'

export type Colours = Record<string, number>

/** The order fresh colours are taken in, each far from those before it: red, blue, green, purple, orange, then the rest. */
const SPREAD = [0, 5, 3, 6, 1, 10, 7, 2, 8, 4, 11, 9]

/**
 * A colour for each card that has none, in the order the cards started: the one least used by the eleven cards started just
 * before it, else of those the one used longest ago, taken far from each other (SPREAD), so any twelve tasks started one after
 * another differ, and two side by side are never red and orange. Only the new ones.
 */
export const slotsFor = (cards: readonly { id: string; startedAt: number; colour?: number }[]) => {
  const fresh: Record<string, number> = {}
  const ordered = [...cards].sort((a, b) => a.startedAt - b.startedAt)
  ordered.forEach((card, at) => {
    if (card.colour !== undefined) return
    const before = ordered.slice(Math.max(0, at - (PALETTE.length - 1)), at).map(one => fresh[one.id] ?? one.colour)
    const uses = PALETTE.map((_, slot) => before.filter(one => one !== undefined && one % PALETTE.length === slot).length)
    const lastAt = PALETTE.map((_, slot) => before.map(one => (one === undefined ? -1 : one % PALETTE.length)).lastIndexOf(slot))
    const fewest = Math.min(...uses)
    const slots = PALETTE.map((_, slot) => slot).filter(slot => uses[slot] === fewest)
    const oldest = Math.min(...slots.map(slot => lastAt[slot] ?? -1))
    fresh[card.id] = SPREAD.find(slot => slots.includes(slot) && (lastAt[slot] ?? -1) === oldest) ?? slots[0] ?? 0
  })
  return fresh
}

/** Words too common in task names to tell one task from another. */
const STOP = new Set(
  (
    'task tasks with from into that this then than what when which where make start check test tests ' +
    'update page pages note notes model models network networks baseline round next step steps review ' +
    'runs build chat data faces face photo photos sheet sheets research notion short first final more ' +
    'your their them they have will done only also each again about after before still just like some ' +
    'over here there these those been were being does into onto upon work working fine catch label labels ' +
    'labelling labeling detection detector score scores level levels release retrain train trained training ' +
    'unseen rounds frozen freeze export'
  ).split(' '),
)

const stem = (word: string) => (word.length >= 5 ? word.slice(0, 5) : word)

/** The distinct word stems of a text that can name a task. */
export const stems = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(word => word.length >= 4 && !STOP.has(word))
      .map(stem),
  )

/** A short, steady hash of a reply's text, to find a reply drawn without its row id. */
export const textHash = (text: string) => {
  let hash = 0x811c9dc5
  for (const char of text.replace(/\s+/g, ' ').trim()) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16)
}

export const cut = (text: string, most: number) =>
  text.length > most ? `${text.slice(0, most - 1).trimEnd()}…` : text

const clean = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*`>#]+|(^|\s)_+|_+(\s|$)/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/^\s*(?:[-•]|\d+[.)])\s+/, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s:–—-]+$/, '')
    .trim()

/** Where a link goes, in a word or two. */
export const kindOf = (url: URL) => {
  const host = url.hostname.replace(/^www\./, '')
  if (/(^|\.)notion\.(so|site|com)$/.test(host)) return 'Notion'
  if (host === 'github.com') return 'GitHub'
  if (host === 'linear.app') return 'Linear'
  if (/(^|\.)figma\.com$/.test(host)) return 'Figma'
  if (host === 'docs.google.com' || host === 'drive.google.com') return 'Google'
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return 'This Mac'
  return host
}

/** A Notion page's name, from the words its address carries before the page's id. */
const notionName = (url: URL) => {
  const last = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) ?? '')
  const words = last.replace(/-?[0-9a-f]{32}$/i, '').replace(/-/g, ' ').trim()
  return words.length > 2 ? words : ''
}

/** The links a reply gives, in the order it gives them, each with a name for it. */
export const linksIn = (text: string): TaskLink[] => {
  const found: TaskLink[] = []
  const seen = new Set<string>()
  const lines = text.split('\n')
  lines.forEach((line, at) => {
    const named = new Map<string, string>()
    for (const [, label = '', href = ''] of line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) named.set(href, label)
    for (const [raw] of line.matchAll(/https?:\/\/[^\s<>()\[\]"'`]+/g)) {
      const href = raw.replace(/[.,;:!?*]+$/, '')
      let url: URL
      try {
        url = new URL(href)
      } catch {
        continue
      }
      if (seen.has(url.href)) continue
      seen.add(url.href)
      // The words before it in its own sentence: "The new fit is on the review page at", not the whole line
      const before = clean(line.slice(0, line.indexOf(raw)).replace(/\[[^\]]*$/, '')).split(/(?<=[.!?])\s+/).at(-1) ?? ''
      const above = clean(lines.slice(0, at).reverse().find(one => clean(one)) ?? '')
      const label =
        clean(named.get(href) ?? '') ||
        (kindOf(url) === 'Notion' ? notionName(url) : '') ||
        before ||
        above ||
        url.pathname.split('/').filter(Boolean).at(-1) ||
        url.hostname
      found.push({ url: url.href, label: cut(label, 80), kind: kindOf(url) })
    }
  })
  return found
}

type Notified = { id: string; title: string; status: string }

/** The subagent notifications a user row carries, each with its task's name and how it ended. */
export const notificationsIn = (text: string): Notified[] => {
  const found: Notified[] = []
  for (const [, body = ''] of text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g)) {
    const id = /<task-id>\s*([^<\s]+)\s*<\/task-id>/.exec(body)?.[1]
    const summary = /<summary>([\s\S]*?)<\/summary>/.exec(body)?.[1]?.trim() ?? ''
    const named = /^Agent "([\s\S]+)"\s*([\s\S]*)$/.exec(summary)
    if (!id || !named) continue
    const rest = (named[2] ?? '').toLowerCase()
    const status = rest.includes('waiting')
      ? 'waiting'
      : rest.startsWith('finished') || rest.startsWith('completed')
        ? 'finished'
        : rest.includes('fail')
          ? 'failed'
          : rest.includes('stop') || rest.includes('kill')
            ? 'stopped'
            : 'finished'
    found.push({ id, title: named[1] ?? '', status })
  }
  return found
}

/** A message a task sent the chat itself ("Another Claude session sent a message"). */
export const peerIn = (text: string): { id: string; title?: string } | undefined => {
  const id = /<agent-message from="([^"]+)"/.exec(text)?.[1]
  if (!id) return undefined
  return { id, title: /The task "([^"]+)"/.exec(text)?.[1] }
}

/** Words as compared: no marks, one space, lower case. */
const plain = (text: string) => text.replace(/[*_`#>\[\]()|]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()

/**
 * The task whose result a reply passes on: the chat is told to pass a task's result on as it came, so the reply's start is in
 * it. The newest result given first; none for a reply too short to tell.
 */
export const passedOn = (reply: string, results: readonly { id: string; text: string }[]) => {
  const start = plain(reply).slice(0, 120)
  if (start.length < 40) return undefined
  return [...results].reverse().find(one => plain(one.text).includes(start))?.id
}

/** A row's own id, where the transcript gives one. */
const idOf = (row: SessionMessage) => {
  const id = (row as { uuid?: unknown }).uuid
  return typeof id === 'string' && id ? id : undefined
}

/** A row's mark: a short hash of who wrote it, its words and the tools it called or answered, to find the row again. */
const markOf = (row: SessionMessage) =>
  textHash(`${row.role}\n${row.text ?? ''}\n${(row.toolUses ?? []).map(use => use.tool_use_id).join(' ')}\n${(row.toolResults ?? []).map(result => result.tool_use_id).join(' ')}`)

/** The person's own words in a message of theirs, without what the app or a mod put beside them. */
export const personWords = (text: string) =>
  text
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<(command-[a-z]+|local-command-[a-z]+)>[\s\S]*?<\/\1>/g, '')
    // Text the person pasted is theirs: its words stay, the app's marks around it go
    .replace(/<\/?pasted_content[^>]*>/g, '')
    .trim()
    // Words written on a result go to the chat after the result they continue from: the words alone are theirs
    .replace(/^Continue from the result "[^\n]*?" \([^)\n]*\), [^\n]*?\/report\.md: /, '')

// Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
const STRETCH = 40
const wordsOnly = (text: string) => ` ${text.toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `
/** Whether a message the chat sent carries the person's words: whole when short, else a stretch of STRETCH letters of them. */
export const carries = (message: string, words: string) => {
  const m = wordsOnly(message)
  const w = wordsOnly(words)
  if (!w.trim()) return false
  if (w.length <= STRETCH) return m.includes(w)
  const starts = [0, ...[...w].flatMap((c, i) => (c === ' ' ? [i + 1] : []))].filter(i => i + STRETCH <= w.length)
  return starts.some(i => m.includes(w.slice(i, i + STRETCH)))
}

/** A user row that only reminds the model of something: it opens no turn. */
const isReminder = (text: string) =>
  text.trimStart().startsWith('<system-reminder>') && !text.includes('<task-notification>')

const agentIdOf = (result: unknown, text: string | undefined) => {
  if (result && typeof result === 'object' && 'agentId' in result) {
    const id = (result as { agentId?: unknown }).agentId
    if (typeof id === 'string' && id) return id
  }
  return /agentId:\s*([A-Za-z0-9_-]+)/.exec(text ?? '')?.[1]
}

type Reply = { uuid?: string; row: number; text: string; stems?: Set<string>; links?: TaskLink[] }
/** What the chat sent a task, and in which row: an Agent call's prompt, a SendMessage's message, nothing for a TaskStop. */
type Route = { id: string; row: number; text: string }
/** A turn's tasks: those whose notification or message opened it, and those the chat acted on in it, and how. */
type Turn = { opening: string; notified: string[]; acted: string[]; routes: Route[]; hasPrompt: boolean; prompt: string; promptRow: number; replies: Reply[] }
type Known = { title: string; rank: number; status: string }

/**
 * Walks the transcript once, oldest first, and then each new row as it comes.
 *
 * A turn opens on a user row that follows the chat's own words: the person's
 * message, a task's notification, or a message a task sent. Rows of the same
 * turn share its tasks: the notified or messaging task, and every task the
 * chat started (Agent), wrote to (SendMessage) or stopped in it; where the
 * person's own message is in the turn, the tasks the chat acted on win over a
 * notification that came in beside it. A turn with none of those (the person
 * asking about a result) goes to the task whose name its words share,
 * counting the task of the reply before it.
 */
export class Builder {
  readonly colours: Colours
  coloursChanged = false
  /** How many of the transcript's rows it has read: the next pass reads only those after them. */
  read = 0
  private readonly known = new Map<string, Known>()
  private readonly names = new Map<string, string>()
  private readonly launches = new Map<string, { title: string; name?: string; turn: Turn; row: number; text: string }>()
  /** Each row's mark, to find again where a message on a card fell after a compaction or a reload (stamp, place). */
  private readonly marks: string[] = []
  private readonly turns: Turn[] = []
  private turn: Turn | undefined
  private saidLast = false

  constructor(colours: Colours = {}) {
    this.colours = { ...colours }
  }

  ingest(rows: readonly SessionMessage[]) {
    for (const row of rows) {
      const at = this.read
      this.read += 1
      this.marks.push(markOf(row))
      if (row.role === 'user') this.user(row, at)
      else this.assistant(row, at)
    }
  }

  /** Where the transcript stands now, as read: for a message the person writes on a card. */
  stamp(): Pick<CardWords, 'row' | 'mark'> {
    return { row: this.read, mark: this.marks[this.read - 1] ?? '' }
  }

  /** The place of a message on a card among the rows: after the row it was stamped at, found by its mark; before them all, gone. */
  private place(one: Pick<CardWords, 'row' | 'mark'>) {
    if (one.row > 0 && this.marks[one.row - 1] === one.mark) return one.row - 0.5
    const at = one.mark ? this.marks.lastIndexOf(one.mark) : -1
    return at >= 0 ? at + 0.5 : -1
  }

  private open() {
    if (!this.turn) {
      this.turn = { opening: '', notified: [], acted: [], routes: [], hasPrompt: false, prompt: '', promptRow: 0, replies: [] }
      this.turns.push(this.turn)
    }
    return this.turn
  }

  private know(id: string, title: string | undefined, rank: number, status?: string) {
    const was = this.known.get(id) ?? { title: '', rank: 0, status: 'working' }
    const named = title?.replace(/\s+/g, ' ').trim()
    this.known.set(id, {
      title: named && rank >= was.rank ? named : was.title,
      rank: named && rank >= was.rank ? rank : was.rank,
      status: status ?? was.status,
    })
  }

  private join(ids: string[], id: string) {
    if (!ids.includes(id)) ids.push(id)
  }

  private user(row: SessionMessage, at: number) {
    for (const result of row.toolResults ?? []) this.answered(result)
    const text = row.text ?? ''
    if (!text.trim() || isReminder(text)) return
    if (this.saidLast) this.turn = undefined
    this.saidLast = false
    const turn = this.open()
    turn.opening = `${turn.opening}\n${text.slice(0, 4000)}`
    const notified = notificationsIn(text)
    for (const one of notified) {
      this.know(one.id, one.title, 2, one.status)
      this.join(turn.notified, one.id)
    }
    const peer = peerIn(text)
    if (peer && (peer.title || this.known.has(peer.id))) {
      this.know(peer.id, peer.title, 1)
      this.join(turn.notified, peer.id)
    }
    if (!notified.length && !peer) {
      turn.hasPrompt = true
      // The person's own words, the newest of the turn: what its replies answer
      const words = personWords(text)
      if (words) (turn.prompt = words), (turn.promptRow = at)
    }
  }

  private assistant(row: SessionMessage, at: number) {
    this.saidLast = true
    const turn = this.open()
    if ((row.text ?? '').trim()) turn.replies.push({ uuid: idOf(row), row: at, text: row.text ?? '' })
    for (const use of row.toolUses ?? []) this.used(use, turn, at)
    // The chat's answer to a notice that needs none closes that turn: what it says next, with no message of the person's between
    // (a task's own message to the chat is not always in the rows it is given), is a turn of its own, never the noticed task's
    if ((row.text ?? '').trim() === NO_ANSWER) this.turn = undefined
  }

  private used(use: ToolUseSummary, turn: Turn, row: number) {
    const input = use.input ?? {}
    if (use.tool === 'Agent') {
      const title = typeof input.description === 'string' ? input.description : ''
      const name = typeof input.name === 'string' ? input.name : undefined
      const text = typeof input.prompt === 'string' ? input.prompt : ''
      const id = use.agentId ?? agentIdOf(use.result, use.text)
      if (id) this.started(id, title, name, turn, row, text)
      else this.launches.set(use.tool_use_id, { title, name, turn, row, text })
      return
    }
    const to =
      use.tool === 'SendMessage' ? input.to : use.tool === 'TaskStop' ? (input.task_id ?? input.shell_id) : undefined
    if (typeof to !== 'string' || !to) return
    const id = this.names.get(to) ?? to
    if (this.known.has(id) || /^a[0-9a-f]{12,}$/.test(id)) {
      if (!this.known.has(id)) this.know(id, undefined, 0)
      this.join(turn.acted, id)
      turn.routes.push({ id, row, text: use.tool === 'SendMessage' && typeof input.message === 'string' ? input.message : '' })
    }
  }

  private answered(result: ToolResultSummary) {
    const launch = this.launches.get(result.tool_use_id)
    if (!launch) return
    this.launches.delete(result.tool_use_id)
    const id = agentIdOf(result.result, result.text)
    if (id) this.started(id, launch.title, launch.name, launch.turn, launch.row, launch.text)
  }

  private started(id: string, title: string, name: string | undefined, turn: Turn, row: number, text: string) {
    this.know(id, title, 3)
    if (name) this.names.set(name, id)
    this.join(turn.acted, id)
    turn.routes.push({ id, row, text })
  }

  /** The task's stored colour, or for a new one the colour least used by the tasks active beside it. */
  private colourOf(id: string, beside: readonly string[]) {
    const stored = this.colours[id]
    if (stored !== undefined) return stored % PALETTE.length
    const uses = PALETTE.map(() => 0)
    for (const one of beside) {
      const slot = this.colours[one]
      if (slot !== undefined) uses[slot % PALETTE.length] = (uses[slot % PALETTE.length] ?? 0) + 1
    }
    const fewest = Math.min(...uses)
    const slot = Math.max(0, uses.indexOf(fewest))
    this.colours[id] = slot
    this.coloursChanged = true
    return slot
  }

  /** The colour of a task found some other way (a result the chat passed on): its own, else the one least used of late. */
  pick(id: string) {
    return this.colourOf(id, Object.keys(this.colours).slice(-12))
  }

  /**
   * Which task each reply is about, as the drawing reads it. `cards`: what the person wrote to tasks on their cards; `heard`: the
   * person's chat messages, the newest last, those sent while the chat was at work among them (the transcript has no row of theirs)
   */
  index({ cards = [], heard = [] }: { cards?: readonly CardWords[]; heard?: readonly string[] } = {}): ColourIndex {
    const named = [...this.known].filter(([, one]) => one.title)
    const owners = new Map<string, number>()
    const wordsOf = new Map<string, Set<string>>()
    for (const [id, one] of named) {
      const words = stems(one.title)
      wordsOf.set(id, words)
      for (const word of words) owners.set(word, (owners.get(word) ?? 0) + 1)
    }
    // How strongly a text names a task: each of its name's words the text has,
    // a word shared by several tasks' names counting for less.
    const names = (id: string, have: Set<string>) => {
      let score = 0
      for (const word of wordsOf.get(id) ?? []) if (have.has(word)) score += 1 / (owners.get(word) ?? 1)
      return score
    }
    const stemsOf = (reply: Reply) => (reply.stems ??= stems(reply.text))
    const titled = (ids: readonly string[]) => ids.filter(id => this.known.get(id)?.title)

    const replies: Record<string, string[]> = {}
    const texts: Record<string, string[]> = {}
    const clashed = new Set<string>()
    const links = new Map<string, TaskLink[]>()
    const seen = new Map<string, number>()
    const colours = new Map<string, number>()
    let before: string[] = []
    // What the person sent each task, as the transcript and their cards tell it
    const said = new Map<string, Said[]>()
    const sayTo = (id: string, row: number, text: string) => said.set(id, [...(said.get(id) ?? []), { row, text }])
    const rows: Record<string, number> = {}
    const heardWords = heard.map(personWords).filter(Boolean)

    this.turns.forEach((turn, at) => {
      const replied = turn.replies.filter(reply => reply.text.trim() !== NO_ANSWER)
      const acted = titled(turn.acted)
      const notified = titled(turn.notified)
      // The person's own message with tasks the chat acted on: a notification that came in
      // beside it counts only where a reply names that task.
      const base = turn.hasPrompt && acted.length ? acted : [...new Set([...notified, ...acted])]
      const aside = turn.hasPrompt && acted.length ? notified.filter(id => !acted.includes(id)) : []
      let guessed: string[] = []
      if (!base.length && replied.length) {
        const have = stems(turn.opening)
        for (const reply of replied) for (const word of stemsOf(reply)) have.add(word)
        const scored = named
          .map(([id]) => ({ id, score: names(id, have) + (before.length === 1 && before[0] === id ? 1 : 0) }))
          .sort((a, b) => b.score - a.score)
        const [best, second] = scored
        if (best && best.score >= 1.5 && (!second || second.score < best.score)) guessed = [best.id]
      }
      const ids = base.length ? base : guessed
      if (turn.prompt) {
        // The person's message goes to the tasks the chat acted on in its turn, and where some of what the chat sent carries their
        // words, to those alone: a message they sent while the chat was at work was passed on to another task in the same turn
        // (27 Nov: a result quoted "Why was there only one Don't Allow button", which had gone to the task that fixes that button)
        const carriers = turn.hasPrompt && acted.length ? [...new Set(turn.routes.filter(route => acted.includes(route.id) && carries(route.text, turn.prompt)).map(route => route.id))] : []
        for (const id of carriers.length ? carriers : ids) sayTo(id, turn.promptRow, turn.prompt)
      }
      // A message of theirs that came while the chat was at work goes to the task the chat passed it on to, from that row
      for (const route of turn.routes) {
        if (!this.known.get(route.id)?.title || !route.text) continue
        const theirs = heardWords.findLast(words => wordsOnly(words) !== wordsOnly(turn.prompt) && carries(route.text, words))
        if (theirs) sayTo(route.id, route.row, theirs)
      }
      for (const reply of replied) {
        let mine = ids
        if (ids.length > 1) {
          // A reply that names some of its turn's tasks and not the rest is about those.
          const naming = ids.filter(id => names(id, stemsOf(reply)) > 0)
          if (naming.length && naming.length < ids.length) mine = naming
        }
        const extra = aside.filter(id => names(id, stemsOf(reply)) >= 1)
        if (extra.length) mine = [...mine, ...extra]
        const hash = textHash(reply.text)
        // Its place, for the message it answers: the newest its task was sent before it (quoteFor)
        if (reply.uuid) rows[reply.uuid] = reply.row
        rows[hash] = reply.row
        if (!mine.length) continue
        if (reply.uuid) replies[reply.uuid] = mine
        if (!clashed.has(hash)) {
          const was = texts[hash]
          if (was && was.join() !== mine.join()) {
            delete texts[hash]
            clashed.add(hash)
          } else texts[hash] = mine
        }
        for (const id of mine) {
          if (!colours.has(id)) {
            const beside = [...seen].filter(([one, last]) => one !== id && last >= at - 40).map(([one]) => one)
            colours.set(id, this.colourOf(id, beside))
          }
          seen.set(id, at)
          const given = (reply.links ??= linksIn(reply.text))
          if (given.length) links.set(id, [...(links.get(id) ?? []), ...given])
        }
      }
      if (replied.length) before = ids
    })
    // What the person wrote on a card, where it fell among the rows
    for (const one of cards) if (one.text.trim()) sayTo(one.id, this.place(one), one.text.trim())

    const tasks: Record<string, ColouredTask> = {}
    for (const [id, colour] of colours) {
      const one = this.known.get(id)
      if (!one) continue
      const newest: TaskLink[] = []
      for (const link of [...(links.get(id) ?? [])].reverse()) {
        if (newest.length < 12 && !newest.some(kept => kept.url === link.url)) newest.push(link)
      }
      tasks[id] = { title: one.title, colour, status: one.status, links: newest }
    }
    // Each task's, in the order they came, the newest dozen
    const sent = Object.fromEntries([...said].map(([id, list]) => [id, [...list].sort((a, b) => a.row - b.row).slice(-12)]))
    return { tasks, replies, texts, rows, said: sent }
  }
}
