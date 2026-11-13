// What every part shares: the panel's names and limits, the state the panel draws from, the settings in force, small text
// helpers, the log and the chat's saved words

// The panel beside the chat: one small card per piece of work under way; pressed, a card shows all its to-dos and its own chat
const LIST = 'claudopus'
const LIST_TITLE = 'Claudopus'
// The panel that lists the servers on this Mac; it opens when asked for
const PANE = 'servers'
const PANE_TITLE = 'Servers'
// The panel an earlier version opened by itself
const OLD_PANE = 'agents'
// Rarely used tools wait behind ToolSearch instead of loading into every chat
const RARE_TOOLS = ['ReportFindings', 'SuggestPluginInstall', 'SuggestSkills', 'SearchPlugins', 'ScheduleWakeup', 'Workflow']
const RARE_SERVERS = ['mcp__Claude_Browser__', 'mcp__Claude_Code_iOS_Simulator__', 'mcp__visualize__']
// What a chat's own thread may call: it starts agents and workflows, and talks to them. An agent may call anything
const OWN = ['Agent', 'Workflow', 'SendMessage', 'ListAgents', 'TaskStop', 'ToolSearch', 'AskUserQuestion', 'SendUserFile', 'ReadNotifications', 'Skill']
// The mod's own tools, as the chat names them; work recorded before the rename called them by the old name
const TOOLS = 'mcp__claudopus__'
const OLD_TOOLS = 'mcp__progress__'
const isTool = (tool: string | undefined, name: string) => tool === `${TOOLS}${name}` || tool === `${OLD_TOOLS}${name}`
const OWN_SERVERS = [TOOLS, 'mcp__ccd_']
// A message longer than this is a dump: the chat keeps the file's path, not the text
const PASTE_CHARS = 12_000
// Pieces of work kept in the list, ended ones included, and lines kept in the log of each
const KEPT = 40
const ENTRIES_KEPT = 200
// How many of the to-dos not yet started an open card lists before "more"
const NEXT_SHOWN = 3
// What else a Details tab can unfold, kept beside its chat's numbers, far from them: the person's words whole, every to-do
// not yet started, and those done or dropped
const OPEN_ASK = -1_000_001
const OPEN_NEXT = -1_000_002
const OPEN_DONE = -1_000_003
// How much of a piece of work's chat the panel draws, the newest: this many lines, and this many characters, which one drawing has room for
const TALK_KEPT = 300
const TALK_CHARS = 40_000
// The most characters the app draws in one tab: it counts every text and every picture's source, and a drawing of more is thrown
// away whole, so the tab keeps its old drawing, or after a switch away and back says "Nothing to show yet". The pictures a tab draws
// keep well under it (262144), with room for its text
const PICTURES_CHARS = 150_000
// How long one message of that chat may be
const SAID_CHARS = 8000
// How much of a long message to the work is drawn before it is opened
const TOLD_CHARS = 300
// How long the line of one tool step may be
const STEP_CHARS = 160
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
const FILL = '#80808024'
// A card's edge shows each to-do as a part of its own up to this many; more are one edge filled as far as they are done
const EDGE_PARTS = 14
// How long a line of the log may be
const NOTE_CHARS = 200
// How much of an answer the panel keeps
const ANSWER_CHARS = 30_000
// While the servers panel is open it looks again this often
const TICK = 3000
// Work that has just ended stays in its place among the running cards this long, in its ended look, before it goes to Finished
const LINGER = 2000
// Work that ended while the mod was reloading, which draws nothing for many seconds, has its pause from the panel's first drawing
// after the load instead (Infinity until then), by `<id>:<endedAt>`: a finish is never over before the panel could show it
const lateFrom = new Map<string, number>()
// Ended work this long before a load may not have been drawn ended at all
const RELOAD_GRACE = 30_000
// When ended work's pause begins
const pauseFrom = (one: { id: string; endedAt: number }) => Math.max(one.endedAt, lateFrom.get(`${one.id}:${one.endedAt}`) ?? 0)
// Whether ended work is still in that pause at a time: a card that ended in the future, as from another clock, is not
const isLingering = (one: { id: string; status: string; endedAt: number }, at: number) => one.status !== 'working' && one.endedAt > 0 && at >= pauseFrom(one) && at - pauseFrom(one) < LINGER
// The moments a pause ends that a redraw is already set for, so each pause gets one
const lingerSet = new Set<string>()
// The engine's list of agents is read again this often, and the minutes move on
const FOLLOW_EVERY = 20_000
// An agent in one of these states, as the engine names them, is still working
const WORKING = ['pending', 'running', 'waiting']
// These listen on a port but serve no pages to open
const NO_PAGES = /^(postgres|redis-server|mysqld|mongod)\b/

const me = atom({ plugin: 'claudopus', key: 'me' } as const, { id: '', title: '', tokens: 0, isChat: false, needsContext: false, roleSent: '', isListOpened: false, window: 0 }, { shape: 'me-6' })
const todos = atom({ plugin: 'claudopus', key: 'todos' } as const, [], { shape: 'todos-3' })
const view = atom({ plugin: 'claudopus', key: 'view' } as const, { openId: '' }, { shape: 'view-5' })
const servers = atom({ plugin: 'claudopus', key: 'servers' } as const, [], { shape: 'servers-2' })
// Counts the passes that bring the screen up to date: each one redraws what reads it
const tick = atom({ plugin: 'claudopus', key: 'tick' } as const, 0, { shape: 'tick-1' })
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
// When the panel was last drawn, kept through a reload (drawnNow, written by the timer each second, never read while drawing)
const lastDrawn = atom({ plugin: 'claudopus', key: 'drawn' } as const, 0, { shape: 'drawn-1' })
let drawnNow = 0
const paneShown = atom({ plugin: 'claudopus', key: 'shown' } as const, false, { shape: 'shown-1' })

// The chat of the card that is open, as last read: read again only when that work has moved
// Counts presses in the open card; the card's buttons carry it in their keys. On the desktop app the button last pressed holds the
// focus and is kept in view: every redraw (a new line of the work, the person's own scrolling) pulled the view back to it, most often to
// the bottom of the chat. With a new key after each press the app finds no such button, and the view stays where the person put it
let presses = 0
// Each work's chat as its Details tab last read it, by the work
const talks = new Map<string, { key: string; lines: Line[] | undefined; at?: number }>()
// What each Details tab has unfolded, by the work: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
const folds = new Map<string, number[]>()
// The memory folder, ~/.claude/claudopus; set when the session starts
let dir = ''
// The person's last message, for the pass that runs after the reply
let said = ''
// Each message of the person's in the chat's turn under way: only a message that carries one of them is their steer
let heard: string[] = []
// config.json can switch the handing-over off: every chat then does its own work again
let isOff = false
// config.json can name the person the mod works for; without a name the texts say "the person"
let person = ''
// config.json can say which model does which work; the chat's and the work's rules name them
let models: Models = modelsOf({})
// The settings read again: at a session's start, and after a change in the Config tab
const loadSettings = async ($: EngineInterface) => {
  const config = await readConfig($, dir)
  isOff = config.agents === false
  person = typeof config.name === 'string' ? config.name.trim() : ''
  models = modelsOf(config)
  macs = (Array.isArray((config as { macs?: unknown }).macs) ? ((config as { macs: unknown[] }).macs) : []).filter(isMac).slice(0, 4)
  return config
}
const who = (isStart = false) => person || (isStart ? 'The person' : 'the person')
// A text of the mod's with {name} or {Name} where the person is named
const named = (text: string) => text.replace(/\{name\}/g, who()).replace(/\{Name\}/g, who(true))
// When the servers were last looked up
let scannedAt = 0
// The Agent calls made inside a piece of work, by call id: what such a call starts is that work's helper
const helperCalls = new Map<string, string>()
const clip = (text: string, half: number) =>
  text.length <= half * 2 ? text : `${text.slice(0, half)}\n[...]\n${text.slice(-half)}`
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const oneLine = (text: string) => text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim()
const textOf = (r: McpToolResult) => r.content.map(b => ('text' in b && typeof b.text === 'string' ? b.text : '')).join('')
// How long work has run, to the second: "42s", "12m 08s", "1h 04m 31s". In a chat the app runs on another Mac over ssh, to the
// minute: "<1m", "12m", "1h 04m", and tokens to 10k and context to 5%. There every drawing that changes anything gives each button a
// new handle and lets the old ones go, while the app shows a drawing some time after the engine made it: a click on what it shows
// named a handle already let go, and nothing ran (Claude Code: "no Button of claudopus is held under handle"). A drawing that
// changes nothing keeps its handles. With the panel's text moving each second, about every other click was lost so
const took = (ms: number) => {
  const all = Math.max(0, Math.floor(ms / 1000))
  const [hrs, m, sec] = [Math.floor(all / 3600), Math.floor(all / 60) % 60, all % 60]
  const two = (n: number) => String(n).padStart(2, '0')
  if (isRunFromAfar) return hrs ? `${hrs}h ${two(m)}m` : m ? `${m}m` : '<1m'
  return hrs ? `${hrs}h ${two(m)}m ${two(sec)}s` : m ? `${m}m ${two(sec)}s` : `${sec}s`
}
// A count of tokens as the app writes it
const thousands = (tokens: number) =>
  isRunFromAfar ? (tokens < 10_000 ? '<10k' : `${Math.round(tokens / 10_000) * 10}k`) : `${(tokens / 1000).toFixed(tokens < 100_000 ? 1 : 0)}k`
// How full a context window is: the share when the window is known, and the tokens
const fill = (tokens: number, window: number) => (window ? `${percent(tokens, window)}% · ${thousands(tokens)} of ${thousands(window)}` : thousands(tokens))
// The same for a piece of work, short enough for its status line
const percent = (tokens: number, window: number) => (isRunFromAfar ? Math.floor((tokens / window) * 20) * 5 : Math.round((tokens / window) * 100))
const share = (tokens: number, window: number) => (window ? `context ${percent(tokens, window)}% (${thousands(tokens)})` : `context ${thousands(tokens)}`)

// A model's name as the app writes it, from its id or alias: "Opus 5.5". Nothing for a name it cannot read
const modelName = (id: string) => {
  const m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:-(\d{1,2}))?(?!\d))?/.exec(id.toLowerCase())
  return m?.[1] ? `${m[1].charAt(0).toUpperCase()}${m[1].slice(1)}${m[2] ? ` ${m[2]}${m[3] ? `.${m[3]}` : ''}` : ''}` : ''
}
// The models the person can move running work to from its card, by the id each step is sent with. Never Haiku
const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2']
// The line written into a piece of work's own chat when the person moves it to another model; the panel draws it as a line of its own
const MODEL_HEAD = 'Model changed to '
const MODEL_LINE = /^Model changed to (.+?) at (\d{1,2}:\d{2})\./
const movedTo = (name: string, at: number) => {
  const d = new Date(at)
  return `${MODEL_HEAD}${name} at ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}. ${who(true)} chose it in the panel: your next steps run on ${name}.`
}

const readOr = ($: EngineInterface, path: string) => $.fs.read(path).catch(() => '')
// Every file the mod writes is in its memory folder, ~/.claude/claudopus, each call naming its folder and kind of file
// One line in ~/.claude/claudopus/log.md: each session's start, and anything that failed
const log = async ($: EngineInterface, line: string) =>
  $.fs.write(`${dir}/log.md`, `${await readOr($, `${dir}/log.md`)}${new Date().toISOString()} ${line.replace(/\s+/g, ' ').slice(0, 400)}\n`).catch(() => undefined)
// A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end
const appendWords = async ($: EngineInterface, chatId: string, text: string) => $.fs.write(`${dir}/words/${chatId}.md`, `${await readOr($, `${dir}/words/${chatId}.md`)}${text}`)
// A chat's asks and answers, asks/<chat id>.md, added to the end
const appendAsks = async ($: EngineInterface, chatId: string, text: string) => $.fs.write(`${dir}/asks/${chatId}.md`, `${await readOr($, `${dir}/asks/${chatId}.md`)}${text}`)

type Ui = ElementTable
// One part of a report's view or of the list: a filled block with a bold heading and, at its right, a dim count
const band = (ui: Ui, key: string, name: string, side: string, body: JSX.Element) => (
  <ui.Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Box flexDirection="row" alignItems="flex-start" gap={2}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text bold wrap="wrap">{name}</ui.Text>
      </ui.Box>
      {side ? (
        <ui.Box flexShrink={0}>
          <ui.Text dimColor>{side}</ui.Text>
        </ui.Box>
      ) : null}
    </ui.Box>
    {body}
  </ui.Box>
)
