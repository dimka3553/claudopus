// The panel's task list as the person sorts it: a row of filters at its top (All, Waiting for you, Working, Delivered, Finished,
// Starred) with a search by name, every finished task a page at a time, and the stars. Pure: the panel part
// (src/claudopus/panel.tsx) hands it the cards, the results and what each press does, and reads and writes the stars' file
// (~/.claude/claudopus/starred.jsonl, in the memory folder every Claude account on a Mac shares, and carried to the other Macs
// with the results)
import type { ElementTable } from 'claude-code'
import type { Report } from '../types'

type Ui = ElementTable
type JSXEl = ReturnType<Ui['Box']>
type Part = (props: Record<string, unknown>) => JSXEl
type Parts = { Box: Part; Text: Part; Button: Part; Input?: Part }

export type TaskFilter = 'all' | 'you' | 'working' | 'finished' | 'starred'
// The tabs in the order they stand, each with its word: For you is what waits on the person, a question or a result to look at
const TABS: [TaskFilter, string][] = [
  ['all', 'All'],
  ['you', 'For you'],
  ['working', 'Working'],
  ['finished', 'Finished'],
  ['starred', 'Starred'],
]
// What a card is, for the tabs that pick among the cards up: 1 working, 2 waiting for the person, 3 delivered, 0 the rest (stopped,
// failed, interrupted), which only All shows
const KINDS: Partial<Record<TaskFilter, number[]>> = { working: [1], you: [2, 3] }
// A long list shows one page of this many rows at a time, with Newer and Older under it: the panel never holds more than a page,
// as each press of the old Show more added 40 rows until the app refused the whole drawing (28 Nov)
export const TASKS_PAGE = 40
// What the person picked, kept while the mod runs: the tab, whether the search box is open and the words searched for, the row a
// long list's page begins at, and a count of presses that makes each button new after one
const TASKS_START = { filter: 'all' as TaskFilter, isFinding: false, find: '', from: 0 }
export const tasksView = { ...TASKS_START, n: 0 }
// Back to how the list first shows (Refresh above the chat): All, no search, the first page, every button new
export const tasksReset = () => void Object.assign(tasksView, TASKS_START, { n: tasksView.n + 1 })

const isFound = (title: string) => !tasksView.find || title.toLowerCase().includes(tasksView.find.toLowerCase())
// Whether a card up in the panel is drawn under the filter picked and the search
export const taskShows = (kind: number, title: string) => (tasksView.filter === 'all' || Boolean(KINDS[tasksView.filter]?.includes(kind))) && isFound(title)

// ---- Stars. A star is one line of the file, and the file is only added to: the task's newest line says whether it is starred, and
// what it was when last seen (its name, its state, its result, its chat), so it stays listed after it is finished, dismissed, put
// away or its chat is gone. Two Macs make theirs the same by putting both files' lines together ----
export type Star = { id: string; on: boolean; at: number; title: string; state: string; report?: string; chat?: string; ended?: number }
export const STARS_FILE = 'starred.jsonl'
// The file as last read, what its size and time were then, and each task's newest line
export const stars = { text: '', seen: '', list: new Map<string, Star>() }
const isStar = (one: unknown): one is Star => {
  const s = one as Star
  return Boolean(s) && typeof s.id === 'string' && typeof s.on === 'boolean' && typeof s.at === 'number' && typeof s.title === 'string' && typeof s.state === 'string'
}
// Takes the file's text: true when it differs from what was read last
export const starsTook = (text: string) => {
  if (text === stars.text) return false
  const list = new Map<string, Star>()
  for (const line of text.split('\n')) {
    try {
      const one: unknown = JSON.parse(line)
      if (isStar(one) && !((list.get(one.id)?.at ?? -1) > one.at)) list.set(one.id, one)
    } catch {
      // a line cut short by a write under way, or none
    }
  }
  stars.text = text
  stars.list = list
  return true
}
export const isStarred = (id: string) => stars.list.get(id)?.on === true
export const starLine = (s: Star) => `${JSON.stringify(s)}\n`
// What a task is now, for its star: the line to add when it is starred and its name, state or result moved since, else ''
export type StarSeen = Omit<Star, 'on' | 'at'>
export const starMoved = (s: StarSeen, at: number) => {
  const was = stars.list.get(s.id)
  return was?.on && (was.title !== s.title || was.state !== s.state || (was.report ?? '') !== (s.report ?? '')) ? starLine({ ...was, ...s, on: true, at }) : ''
}
// Both Macs' lines together, this one's first: undefined when the other adds none
export const starsUnion = (mine: string, theirs: string) => {
  const lines = new Set(mine.split('\n').filter(Boolean))
  const before = lines.size
  for (const line of theirs.split('\n')) if (line.startsWith('{"id":')) lines.add(line)
  return lines.size > before ? `${[...lines].join('\n')}\n` : undefined
}
// One trip to the other Mac: this Mac's lines go in on stdin and are added there to its own, each once, and its file as it then
// stands comes back
export const STARS_TRIP = `sh -c 'f=$HOME/.claude/claudopus/${STARS_FILE}; mkdir -p "\${f%/*}" && t=$f.$$ && cat > "$t" && touch "$f" && cat "$f" "$t" | awk "NF && !s[\\$0]++" > "$t.u" && mv -f "$t.u" "$f"; rm -f "$t" "$t.u"; cat "$f"'`

// ---- The rows of a list: a card the panel draws (`draw`), or a task no card is kept for, drawn here from its result or its star ----
export type TaskItem = { at: number; id: string; title: string; draw?: () => JSXEl | null; line?: string; report?: string }
// The newest result of each task, a row each, but for the tasks whose cards are listed and those still up among the cards (`up`); a
// result no task wrote is a row of its own.
// Made again only when the results or the cards listed change, never for a drawing alone; the cards, a few, are put in among them
let made: { reports: readonly Report[]; cards: string; items: TaskItem[] } | undefined
export const finishedOf = (cards: TaskItem[], reports: readonly Report[], up: string[] = []) => {
  const key = [...cards.map(one => one.id), '|', ...up].join(',')
  if (made?.reports !== reports || made.cards !== key) {
    const seen = new Set([...cards.map(one => one.id), ...up])
    const rows: TaskItem[] = []
    for (const r of [...reports].sort((a, b) => b.at - a.at)) {
      const id = r.agent || r.id
      if (seen.has(id)) continue
      seen.add(id)
      rows.push({ at: r.at, id, title: r.title, report: r.id, line: r.chat })
    }
    made = { reports, cards: key, items: rows }
  }
  const [mine, rows] = [[...cards].sort((a, b) => b.at - a.at), made.items]
  const all: TaskItem[] = []
  for (let i = 0, j = 0; i < mine.length || j < rows.length; ) {
    const [a, b] = [mine[i], rows[j]]
    if (a && (!b || a.at >= b.at)) (all.push(a), (i += 1))
    else if (b) (all.push(b), (j += 1))
  }
  return all
}
// What a row's star keeps: what the task's star already says, else the row as it stands
export const rowStar = (one: TaskItem): StarSeen => {
  const was = stars.list.get(one.id)
  return { id: one.id, title: one.title, state: was?.state ?? '', report: one.report ?? was?.report, chat: was ? was.chat : one.line, ended: was?.ended ?? one.at }
}
export const starredCount = () => [...stars.list.values()].filter(s => s.on).length
// Every task starred: its card when it is kept, else its row as its star last saw it, with its result when this Mac has it
export const starredOf = (cards: TaskItem[], reports: readonly Report[]) =>
  [...stars.list.values()]
    .filter(s => s.on)
    .map(s => {
      const card = cards.find(one => one.id === s.id)
      if (card) return card
      const r = reports.find(one => one.agent === s.id) ?? reports.find(one => one.id === s.report)
      return { at: r?.at ?? s.ended ?? s.at, id: s.id, title: s.title, report: r?.id, line: [s.state, s.chat].filter(Boolean).join(' · ') }
    })
    .sort((a, b) => b.at - a.at)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const two = (n: number) => String(n).padStart(2, '0')
// When it ended, as every date is written: 11 Nov, 14:20 (and the year, for one of another year)
export const whenOf = (at: number, now: number) => {
  const [d, n] = [new Date(at), new Date(now)]
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${d.getFullYear() !== n.getFullYear() ? ` ${d.getFullYear()}` : ''}, ${two(d.getHours())}:${two(d.getMinutes())}`
}

export type TasksActs = { redraw: () => void; star: (item: TaskItem) => void; open: (report: string) => void; typing: () => void; typed: () => void }
const pressed = (acts: TasksActs, change: () => void) => () => ((tasksView.n += 1), change(), acts.redraw())

// The star at a card's or a row's top right: hollow, or filled once pressed
export const starButton = (ui: Ui, id: string, onPress: () => void) => {
  const { Box, Button } = ui as unknown as Parts
  const on = isStarred(id)
  return (
    <Box key={`star-${id}`} flexShrink={0}>
      <Button key={`star-${id}-${tasksView.n * 2 + (on ? 1 : 0)}`} label={on ? '★' : '☆'} plain dimColor={!on} hover={{ scope: `star-${id}`, underline: true }} onPress={() => ((tasksView.n += 1), onPress())} />
    </Box>
  )
}

// The tabs under the header, one row on the panel's ground with a hairline under it (two in a narrow pane), the one picked bright
// with a bar under its word; how many each holds beside it once there are any, but Finished, whose list says it
const LINE = 0.1
export const tasksBar = (ui: Ui, counts: Partial<Record<TaskFilter, number>>, surface: string, acts: TasksActs) => {
  const { Box, Button } = ui as unknown as Parts
  const isDesk = surface !== 'terminal'
  return (
    <Box key="tasks-bar" flexDirection="column" paddingX={2} flexShrink={0}>
      <Box flexDirection="row" flexWrap="wrap" alignItems="flex-end" columnGap={1} rowGap={isDesk ? 1 : 0}>
        {TABS.map(([filter, word]) => {
          const isOn = tasksView.filter === filter
          const n = filter === 'finished' ? 0 : (counts[filter] ?? 0)
          return (
            <Box key={`tab-${filter}`} flexDirection="column" flexShrink={0}>
              <Button key={`tasks-${filter}-${tasksView.n}`} label={`${word}${n ? ` ${n.toLocaleString('en-US')}` : ''}`} plain {...(isOn ? {} : { dimColor: true, hover: { scope: `tasks-${filter}`, underline: true } })} onPress={pressed(acts, () => ((tasksView.filter = filter), (tasksView.from = 0)))} />
              {isDesk ? <Box height={LINE * 2} backgroundColor={isOn ? '#e8e6dc' : undefined} /> : null}
            </Box>
          )
        })}
      </Box>
      {isDesk ? <Box height={LINE} backgroundColor="#80808040" /> : null}
    </Box>
  )
}

// A list with its heading: Finished (folded at the panel's bottom under All, open as its own tab) or Starred. Its rows the newest
// first, a page at a time (fewer on a pane drawn with less in it, `most`), then Newer and Older with where the page stands
export type ListLook = { head: string; side?: string; surface: string; most?: number; isOpen: boolean; fold?: () => void; hotkey?: string; now: number; fill: string; lead: number | string; empty: string }
export const tasksList = (ui: Ui, items: TaskItem[], look: ListLook, acts: TasksActs) => {
  const { Box, Button, Input, Text } = ui as unknown as Parts
  // Search, at the heading's right, opens a box under it for a name, which every list and card then answers (on the desktop: a
  // terminal has no box to type in here)
  const canFind = Boolean(Input) && look.surface !== 'terminal'
  const isFinding = tasksView.isFinding || Boolean(tasksView.find)
  const shown = tasksView.find ? items.filter(one => isFound(one.title)) : items
  const most = look.most ?? TASKS_PAGE
  const from = Math.max(0, Math.min(tasksView.from, Math.floor(Math.max(0, shown.length - 1) / most) * most))
  const page = look.isOpen ? shown.slice(from, from + most) : []
  const head = `${look.head} ${shown.length.toLocaleString('en-US')}`
  const row = (one: TaskItem) => (
    <Box key={`task-row-${one.id}`} flexDirection="row" alignItems="flex-start" gap={1} backgroundColor={look.fill} paddingX={2} paddingY={1} flexShrink={0}>
      <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
        {one.report ? (
          <Button key={`task-row-open-${one.id}-${tasksView.n}`} plain hover={{ scope: `task-row-${one.id}`, underline: true }} onPress={() => acts.open(one.report ?? '')}>
            <Text bold wrap="truncate-end">{one.title}</Text>
          </Button>
        ) : (
          <Box paddingLeft={look.lead}>
            <Text bold wrap="truncate-end">{one.title}</Text>
          </Box>
        )}
        <Box paddingLeft={look.lead}>
          <Text dimColor wrap="truncate-end">{[one.line, whenOf(one.at, look.now)].filter(Boolean).join(' · ')}</Text>
        </Box>
      </Box>
      {starButton(ui, one.id, () => acts.star(one))}
    </Box>
  )
  return (
    <Box key={`tasks-list-${look.head}`} flexDirection="column" gap={1} flexShrink={0}>
      <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={look.fill} paddingX={2} paddingY={1}>
        <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
          {look.fold ? <Button key={`finished-fold-${tasksView.n}`} label={`${look.isOpen ? '▾' : '▸'} ${head}`} plain hotkey={look.hotkey} onPress={pressed(acts, look.fold)} /> : <Text bold>{head}</Text>}
        </Box>
        {look.side ? <Text dimColor>{look.side}</Text> : null}
        {canFind ? <Button key={`tasks-find-${tasksView.n}`} label={isFinding ? 'Close' : 'Search'} plain dimColor hover={{ scope: 'tasks-find', underline: true }} onPress={pressed(acts, () => ((tasksView.isFinding = !isFinding), (tasksView.find = ''), (tasksView.from = 0)))} /> : null}
      </Box>
      {canFind && isFinding && Input ? (
        <Box paddingX={2}>
          <Input key={`tasks-box-${tasksView.n}`} value={tasksView.find} placeholder="Search tasks by name" submitLabel="Search" autoFocus onInput={acts.typing} onSubmit={(value: string) => (acts.typed(), pressed(acts, () => ((tasksView.find = value.trim()), (tasksView.from = 0)))())} />
        </Box>
      ) : null}
      {page.map(one => (one.draw ? one.draw() : row(one)))}
      {look.isOpen && !shown.length ? (
        <Box paddingX={2}>
          <Text dimColor wrap="wrap">{tasksView.find ? `No task named “${tasksView.find}” here.` : look.empty}</Text>
        </Box>
      ) : null}
      {shown.length > page.length && page.length ? (
        <Box flexDirection="row" alignItems="center" columnGap={2} paddingX={2}>
          {from > 0 ? <Button key={`tasks-newer-${tasksView.n}`} label="Newer" plain dimColor hover={{ scope: 'tasks-newer', underline: true }} onPress={pressed(acts, () => (tasksView.from = Math.max(0, from - most)))} /> : null}
          <Text dimColor>{`${(from + 1).toLocaleString('en-US')}–${(from + page.length).toLocaleString('en-US')} of ${shown.length.toLocaleString('en-US')}`}</Text>
          {from + page.length < shown.length ? <Button key={`tasks-older-${tasksView.n}`} label="Older" plain dimColor hover={{ scope: 'tasks-older', underline: true }} onPress={pressed(acts, () => (tasksView.from = from + most))} /> : null}
        </Box>
      ) : null}
    </Box>
  )
}
