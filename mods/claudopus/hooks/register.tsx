// Made by src/claudopus/build.mjs from the parts in src/claudopus: change them there and build again, never this file. It is the hooks module hooks.json names.
import { atom, read, update } from 'claude-code'
import type { ElementTable, EngineInterface, McpToolResult, On, RasterProps, Register, RenderSurface, Timer, ToolCallInput, ToolCallResult, SessionMessage, ToolUseSummary } from 'claude-code'
import type { Entry, Flow, FlowAgent, Item, Link, Me, Prompt, Report, Server, Shared, Stream, Todo, Wait } from '../types'
import { capOf, doing, endOf, firstFit, fitWords, FLOW, FLOW_PANE, flowPaneOf, journalOf, metaOf, roundsOf, rowsOf, SQUARE_COLOR, SQUARE_GLYPH, squaresOf, squaresSvg, squaresWidth, stageOf, titleOfFlow, withJournal } from './flows'
import type { Round } from './flows'
import { CACHE_V, GAP, held, memoryHeld, parsed, READ_EVERY, reading, statsView, SUM_JQ, view as statsShown } from './stats'
import type { Cache, FileSum, Meta, MemoryPart, Run, Scope } from './stats'
import { broughtBackBy, isResultId, marksOf, merged, markThere, parsedMeta, PLACE, PULL, pullThere, PUSH, PUSH_THERE, rehome, RESULTS_A_TRIP, RESULTS_EVERY, RESULTS_LOOK, resultsOf } from './results'
import { ANSWER_KEPT, ANSWERS, answerOf, APP_ID, BEAT, BRIDGE_ID, remoteId, cardsOf, chatName, chatSide, clockOf, FETCH_EVERY, fetchedOf, fetchedOpen, openChatOf, headLine, headMood, isKey, isMac, keyOf, linkOf, LIVE_DIR, LOOK_EVERY, OPEN_EVERY, openTake, opensOf, MACS, macName, openUrl, ordered, OUTBOX, PUSHED, pushHead, pushOf, shareable, sharedOf, signOf, STALE, trip, tripOf, OFF_LOOK, offOf, APP_LOG_LOOK, stuckOf } from './shared'
import type { Answer, Off } from './shared'
import { configView, editing, fillModels, modelsOf, modelsShort, parse, TEXTS } from './config'
import type { Config, ConfigShown, Models, Role } from './config'
import type { LookIo } from './update'
import { checkSaid, copyOf, folderSaid, installedFrom, isNewer, isReloadDue, isUpdateDue, lookOnce, RELOAD_AGAIN, RELOAD_EVERY, stampOf, UPDATE_AFTER, UPDATE_LOOK, updatedArt, updatedFrom, updatedLook, UPDATED_FOR, UPDATED_LATE, UPDATED_SAYS, VERSION_PAGE, VERSION_WAIT, versionOnPage } from './update'
import { changelogOf, fitted, isScreenDue, missedOf, previousOf, seenIn, TAB_BUDGET } from './changelog'
import type { Version } from './changelog'

// What every part shares: the panel's names and limits, the state the panel draws from, the settings in force, small text
// helpers, the log and the chat's saved words

// The panel beside the chat: one small card per piece of work under way; pressed, a card shows all its to-dos and its own chat
const LIST = 'claudopus'
const LIST_TITLE = 'Claudopus'
// How many rows the panel asks for when a narrow terminal seats it above the prompt, where it fits its cards up to what the screen
// spares; left to itself it takes a third of the screen, which the header fills before any card
const PANEL_ROWS = 24
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
// Each load of this code in a chat, first or a reload, is told by a mark of its own, kept in the session's state as the load now in
// charge. A /reload-plugins starts the new copy but leaves the old copy's timers running in the same chat, and work an old copy wakes
// with $.session.send runs under that copy, whose hooks the engine no longer calls: every panel tool of that work answered "no
// tool.call hook answered". So a copy whose mark is no longer the one in charge stops its timers and does nothing more
// Marks order by when the load began, so a slow start of an older copy never takes charge back from a newer one
const thisLoad = `${String(Date.now()).padStart(15, '0')}-${Math.random().toString(36).slice(2)}`
const loadNow = { plugin: 'claudopus', key: 'load' } as const
// A copy whose own mark could not be written never takes another's for its own replacement
let isMarked = false
// Written only over the mark it read, so of two loads marking at once the newer one's stands
const takeCharge = async ($: EngineInterface) => {
  for (let tries = 0; tries < 3; tries += 1) {
    const was = await $.state.get(loadNow).catch(() => undefined)
    if (typeof was?.value === 'string' && was.value > thisLoad) return void (isMarked = true)
    const r = await $.state.set(loadNow, thisLoad, was ? { ifVersion: was.version } : undefined).catch(err => (log($, `load not marked: ${String(err)}`), undefined))
    if (!r) return void (isMarked = false)
    if (r.isSet) return void (isMarked = true)
  }
  isMarked = false
}
let isLeft = false
const isReplaced = async ($: EngineInterface) => {
  if (isLeft) return true
  if (!isMarked) return false
  const now = (await $.state.get(loadNow).catch(() => undefined))?.value
  if (typeof now === 'string' && now > thisLoad) isLeft = true
  return isLeft
}
// A timer of this load: it stops for good the first time it fires after a newer load took charge
const everyLoad = ($: EngineInterface, ms: number, fn: () => unknown) => {
  const timer = $.clock.every(ms, () => void isReplaced($).then(left => (left ? timer.cancel() : fn())))
  return timer
}
// and one that fires once, unless a newer load took charge before it does
const afterLoad = ($: EngineInterface, ms: number, fn: () => unknown) => $.clock.after(ms, () => void isReplaced($).then(left => (left ? undefined : fn())))

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
// Added to its end, never read and written back whole: every chat on this Mac writes here, and two rewriting it at once left runs of
// empty bytes in it, which make grep take the log for binary and find nothing. Where the shell cannot add it, it is written whole
const log = async ($: EngineInterface, line: string) => {
  const text = `${new Date().toISOString()} ${line.replace(/\s+/g, ' ').slice(0, 400)}\n`
  const r = await $.process.run(['sh', '-c', 'printf %s "$2" >> "$1"', 'sh', `${dir}/log.md`, text]).catch(() => undefined)
  if (r?.exitCode !== 0) await $.fs.write(`${dir}/log.md`, `${await readOr($, `${dir}/log.md`)}${text}`).catch(() => undefined)
}
// The empty bytes earlier versions left in the log are taken out once, as a chat starts
const tidyLog = async ($: EngineInterface) => {
  const text = await readOr($, `${dir}/log.md`)
  if (text.includes('\u0000')) await $.fs.write(`${dir}/log.md`, text.replaceAll('\u0000', '')).catch(() => undefined)
}
// A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end
const appendWords = async ($: EngineInterface, chatId: string, text: string) => $.fs.write(`${dir}/words/${chatId}.md`, `${await readOr($, `${dir}/words/${chatId}.md`)}${text}`)
// A chat's asks and answers, asks/<chat id>.md, added to the end
const appendAsks = async ($: EngineInterface, chatId: string, text: string) => $.fs.write(`${dir}/asks/${chatId}.md`, `${await readOr($, `${dir}/asks/${chatId}.md`)}${text}`)

type Ui = ElementTable
// A colour with a see-through part, #RRGGBBAA, and how much of it shows (0 to 255)
const alphaOf = (color: unknown) => (typeof color === 'string' && /^#[0-9a-f]{8}$/i.test(color) ? parseInt(color.slice(7), 16) : 255)
// The terminal has no see-through colour: it paints the app's faint grey tint (FILL) as a solid mid-grey bar that buries dim text,
// darker than the text around it on a light theme. There a faint tint is left out with the padding that only framed it, and a
// stronger one (a picked segment, the edge's part still to do) becomes the theme's own subtle grey, which follows dark and light
const TERM_SOLID = 'subtle'
type BoxArgs = Parameters<Ui['Box']>[0]
// The work's purple on a card's edge in the terminal. A terminal of 256 colours (over ssh, where COLORTERM is not sent) rounds a
// Box's colour to its palette, which makes #8A63F0 a lavender (141), while the octopus's cells take the nearest colour, a deep
// purple (99); there the edge is given a purple that rounds to 99 too. Set as the session starts
const DEEP_LIVE = '#6E3CFF'
let termLive = ''
const termBox = (Box: Ui['Box']) => (props: BoxArgs) => {
  const alpha = alphaOf(props.backgroundColor)
  if (props.backgroundColor === LIVE) return Box({ ...props, backgroundColor: termLive || LIVE })
  if (alpha === 255) return Box(props)
  const { backgroundColor: _tint, paddingY, paddingTop, paddingBottom, ...rest } = props
  const isFrame = alpha < 0x40
  const framed = isFrame ? {} : { paddingY, paddingTop, paddingBottom }
  return Box({ ...rest, ...framed, ...(isFrame ? {} : { backgroundColor: TERM_SOLID }) } as BoxArgs)
}
// The element table a drawing uses: the surface's own, with the terminal's Box taking the app's tints as above and a mark
// (isTerminal) the views in other files read, which are handed the table alone
const uiOf = <E extends Parameters<EngineInterface['ui']['resolve']>[0]>($: EngineInterface, e: E): Ui => {
  const ui = $.ui.resolve(e) as Ui
  return e.surface === 'terminal' ? ({ ...ui, Box: termBox(ui.Box), isTerminal: true } as Ui) : ui
}
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

// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'Answer this message in one line and start a fresh agent for it in the same turn: Agent, subagent_type "general-purpose", the model the rule names, and a brief as the prompt (their words as they said them, what it is about in two or three lines, the folder, the subject by name with its brief and any result by path, what done looks like). Only a message that steers what listed work is already doing (a change to what it builds, an answer it waits for, a stop) goes to that work instead, with SendMessage, in their words. A fault, a question or a new ask gets its own agent even when it is about the same area, code or card as running work, so it never waits behind it; when in doubt, its own agent.'
const REFUSED =
  'This chat\'s own thread does no work itself. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and a brief as the prompt.'
const NO_COPY = () =>
  `Work is never started as a copy of this chat. Start a fresh agent instead: subagent_type "general-purpose", the model named (${modelsShort(models)}), and a brief as the prompt.`
// A command that would print a password or key the keychain keeps. Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b/
const NO_READ = 'A kept key or password is never read or printed. Use it as an environment variable through the secret runner the work rules name; it hides the value from what the command prints.'
// A push or merge to main or master by hand: git's own push naming main or master, a push that skips the repo's hooks, the release
// runner's own pass given by hand, or a pull request merged on GitHub. The command is read as the shell splits it, so words inside
// quotes, a commit message's, never count
const shellWords = (command: string) => {
  const parts: string[][] = [[]]
  let word: string | undefined
  let quote = ''
  const end = () => (word !== undefined && parts[parts.length - 1]!.push(word), (word = undefined))
  for (let i = 0; i < command.length; i++) {
    const c = command[i]!
    if (quote) {
      if (c === quote) quote = ''
      else if (c === '\\' && quote === '"' && i + 1 < command.length) word += command[++i]
      else word += c
    } else if (c === "'" || c === '"') (quote = c), (word ??= '')
    else if (c === '\\' && i + 1 < command.length) word = (word ?? '') + command[++i]
    else if (/[;&|\n()`]/.test(c)) end(), parts.push([])
    else if (/\s/.test(c)) end()
    else word = (word ?? '') + c
  }
  end()
  return parts.filter(one => one.length)
}
const pushesMain = (command: string): boolean =>
  shellWords(command).some(words => {
    let i = 0
    // What runs a command it is handed: env and its settings, command, sudo, nohup, time, exec, and a shell's -c
    for (;;) {
      while (i < words.length && /^\w+=/.test(words[i]!)) if (/^RELEASE_PUSH=/.test(words[i++]!)) return true
      const head = (words[i] ?? '').split('/').pop() ?? ''
      if (['env', 'command', 'sudo', 'nohup', 'time', 'exec'].includes(head)) {
        i++
        while (i < words.length && words[i]!.startsWith('-')) i++
      } else break
    }
    const tool = (words[i] ?? '').split('/').pop()
    if ((tool === 'bash' || tool === 'sh' || tool === 'zsh') && words[i + 1] === '-c') return pushesMain(words[i + 2] ?? '')
    if (tool === 'gh') return (words[i + 1] === 'pr' && words[i + 2] === 'merge') || (words[i + 1] === 'api' && words.slice(i + 2).some(one => /\/pulls\/\d+\/merge\b/.test(one)))
    if (tool !== 'git') return false
    i++
    while (i < words.length && words[i]!.startsWith('-')) i += /^-[Cc]$/.test(words[i]!) ? 2 : 1
    if (words[i] !== 'push') return false
    const args = words.slice(i + 1)
    if (args.includes('--no-verify')) return true
    return args.filter(one => !one.startsWith('-') || one.startsWith('--repo=')).map(one => one.replace(/^--repo=.*/, 'REMOTE')).slice(args.some(one => one.startsWith('--repo=')) ? 0 : 1).some(one => /^\+?(?:[^:]*:)?(?:refs\/heads\/)?(?:main|master)$/.test(one))
  })
const NO_PUSH = 'Work never pushes or merges to main itself, so two pieces of work never release at once: commit on your own branch and run the release runner the work rules name, from your worktree.'
// How long the names of kept keys are trusted before they are asked again
const SECRETS_MS = 60_000
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
const workHead = () => `What follows is told to every piece of work started from a chat for ${person ? `${person}, the person` : 'the person'} you work for.`
const PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.'
const KEEP =
  "Keep every ask the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output."
const KEEP_AGENTS = 'Keep the name or id of each background agent with its subject and where it stands.'
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
const PANEL_RULE =
  '{Name} follows this work in a panel beside the chat, as a card with its to-dos. Keep it true as you work. With the `todo` tool (mcp__claudopus__todo), list each thing you set out to do, mark the one you are on as doing, tick it when it is done, and mark it dropped when the direction changes. With the `note` tool (mcp__claudopus__note), say in one short line where the work stands now, and say it again whenever that has changed. A message from {name} changes the to-dos first. These lines are shown to {name}, so speak to them as "you", in the first person, and write for someone who does not read code: the purpose, with no file names, commands or code. When a step needs {name}\'s own hands or go-ahead now (a code to paste, a box to fill, a key to press, an approval), say so at once with the `ask` tool (mcp__claudopus__ask): what to do in `text`, the exact text to copy in `copy`, buttons to answer with in `choices`, the full paths of any pictures it is about in `pictures`, a command only {name} can run, never one you can run yourself, in `command` with its folder in `cwd` (open no terminal for it yourself); clear it with empty `text` once you have seen it done. If a panel tool answers that no hook answered it, the panel did not get it: carry on without the panel for notes and to-dos, but for an ask end your turn at once with a report whose first line is the ask, so the chat puts it to {name}.'
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
const AFAR_RULE =
  "## This chat runs on another Mac\n\n- I work from my own device and cannot see this Mac's screen. Anything that needs my hands is done from my own device: a sign-in by device code or a link that works opened on my device, never a browser, window, dialog or keychain prompt on this Mac, and nothing that needs seeing its screen. A command only I can run is given whole, with its folder and full paths, to run as it is in my own SSH session to this Mac; nothing opens a terminal on this Mac for it."
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
const ASK_IN_CHAT = (title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  [
    `The work "${title}" needs {name}: ${ask.text}`,
    `Answers: ${answers.join(' · ')}, or a reply in {name}'s own words, here or on its card.`,
    ask.copy ? `${ask.isCommand ? 'The command to type' : 'The text to paste'}: ${ask.copy}` : '',
    ask.pictures?.length ? `Pictures: ${ask.pictures.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  `The background work "${title}" asked {name}, on its card and in this chat as a notice from the Claudopus panel that {name} sees and you do not: ${ask.text} (answers: ${answers.join(' · ')}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} has it already: do not pass it on, do not answer it yourself, and start no work for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that work with SendMessage to "${id}", in their words; its card then stops asking.`
// What the chat is told when an ask it was sent is answered on the card, or the work no longer needs it
const ASK_ANSWERED = (title: string, said: string) => `✓ {Name} answered the work "${title}" on its card: ${said}. It no longer asks.`
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
const ASK_REPLIED = (title: string, said: string) => `✓ {Name} replied to the work "${title}" on its card: ${said}. It still asks, while it acts on that.`
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
const REPLY_HOLDS = `That reply does not settle your ask, so it stays open on {name}'s card while you act on it. Once it is settled, clear it with the \`ask\` tool and empty \`text\`; if it still waits after you have done what they said, ask it again.`
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
const RESUMED_BY_ANSWER = `You had ended; this answer starts you again. Carry the work on with it, then end with your report as before.`
// What the chat's model reads, and the person sees as a notice, when that work could not be started again with the answer
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string) => `{Name} answered on its card what the work "${title}" asked after it ended (${asked}): ${said}. That work could not be started again, so the answer waits here for {name}'s next message.`
const ANSWER_FOR_CHAT_RELAY = `With {name}'s next message here, carry that work on with this answer as you would with their own words, beside whatever that message asks.`
const ASK_CLEARED = (title: string) => `The work "${title}" no longer asks {name} anything.`
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
const ANSWERED_IN_CHAT = (asked: string, words: string, isHeld = false) =>
  `The message sent to you just now that carries {name}'s words "${words}" is {name}'s own reply, typed by them in the chat, to your ask: "${asked}". ${isHeld ? REPLY_HOLDS : 'Their card no longer asks it.'} If it answers the ask, take it as their answer and carry on, and ask again if it leaves something waiting. If it asks for something else, it is a steer: decide whether it is more for this work, a new task to hand back with the \`note\` tool and its \`task\`, or a change in how you work, and say with the \`note\` tool what you did with it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER = (words: string) =>
  `The message sent to you just now that carries {name}'s words "${words}" is from {name}, in their own words, typed by them in the chat. Stop: take no other step until you have thought about it. Decide which of three it is. More for this work: add it to your to-do list. A new task of its own: do not do it; hand it back with the \`note\` tool, its \`task\` set to the ask in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the \`note\` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and carry on. Call it {name}'s message, by no other name.`
// What the work is told when it has gone on after a steer without saying what it decided
// What work that had ended is told of the person's words that started it again: whose they are, nothing more
const WOKE = (words: string) => `The message that started you again, carrying {name}'s words "${words}", is from {name}, in their own words, typed by them in the chat.`
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string, start: string) =>
  `The message sent to you just now that begins "${start}" is from ${sender}, not from {name}: that one is not theirs. Take it as ${sender}'s and carry on; a message that carries {name}'s own words stays theirs.`
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
const STRETCH = 40
const carries = (message: string, words: string) => {
  // Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
  const plain = (text: string) => ` ${flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `
  const m = plain(message)
  const w = plain(words)
  if (!w.trim()) return false
  if (w.length <= STRETCH) return m.includes(w)
  const starts = [0, ...[...w].flatMap((c, i) => (c === ' ' ? [i + 1] : []))].filter(i => i + STRETCH <= w.length)
  return starts.some(i => m.includes(w.slice(i, i + STRETCH)))
}
const OWED =
  'A message from {name} is waiting for your decision, and you have gone on working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.'
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
const drifted = (steps: number) =>
  `You have taken ${steps} steps since you last touched your to-dos or said where the work stands. Look at your to-do list now: tick what is done, mark the one you are on as doing, add what you took on, and say where the work stands with the \`note\` tool. If all of it is already true, carry on.`
// The chat is told once when nothing new has come back under a piece of work for a while
const STUCK_IN_CHAT = (title: string, mins: number) =>
  `"${title}" has had nothing new come back to it or its helpers for ${mins} minutes: it may be stuck waiting on something that will not come. Its card shows where it stands.`
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not an ask: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.`

// Config: the texts in force and the settings, kept keys' names, and the Config tab's acts (its drawing is in ../../mods/claudopus/hooks/config.tsx)

// ---- Config: the texts in force and the settings (the tab and its pure parts are in ./config) ----

// The person's own copy of one of the three texts the mod ships (TEXTS in ./config), each written at its own fixed place in the
// memory folder; the Config tab is the only writer, and nothing else is written there
async function writeOwnText($: EngineInterface, memory: string, path: string, text: string) {
  if (path === 'rules/CLAUDE.md') return $.fs.write(`${memory}/rules/CLAUDE.md`, text)
  if (path === 'roles/chat.md') return $.fs.write(`${memory}/roles/chat.md`, text)
  if (path === 'roles/work.md') return $.fs.write(`${memory}/roles/work.md`, text)
  throw new Error(`${path} is not one of the texts the mod ships`)
}
// The text in force: the person's own copy when it holds anything, the shipped one otherwise
async function inForce($: EngineInterface, root: string, memory: string, path: string) {
  const own = memory ? await readOr($, `${memory}/${path}`) : ''
  const shipped = await readOr($, `${root}/${path}`)
  // A copy the same as what shipped is no change of the person's
  // A copy made before an update can lack a place the shipped text now fills (a setting such as the models): it is stale
  const places = (text: string) => new Set(text.match(/\{[a-z]+\}/gi) ?? [])
  const isStale = (own: string) => [...places(shipped)].some(place => !places(own).has(place))
  if (own.trim() && own.trim() !== shipped.trim()) return { text: own, path: `${memory}/${path}`, isOwn: true, isStale: isStale(own) }
  return { text: shipped, path: `${root}/${path}`, isOwn: false, isStale: false }
}

async function readConfig($: EngineInterface, memory: string) {
  return parse(await readOr($, `${memory}/config.json`))
}
// Sets one key, or with undefined puts it back to what shipped; every other key, ones this tab does not know included, is kept
async function setConfig($: EngineInterface, memory: string, key: keyof Config, value: unknown, role?: Role) {
  const path = `${memory}/config.json`
  const text = await readOr($, path)
  const config = (() => {
    try {
      return JSON.parse(text || '{}') as Record<string, unknown>
    } catch {
      return undefined
    }
  })()
  // A file that does not parse is someone's edit under way: it is left as it is
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('config.json does not parse')
  if (key === 'models' && role) {
    const models = { ...((config.models as Record<string, unknown>) ?? {}) }
    if (value === undefined) delete models[role]
    else models[role] = value
    if (Object.keys(models).length) config.models = models
    else delete config.models
  } else if (value === undefined) delete config[key]
  else config[key] = value
  await $.fs.write(`${memory}/config.json`, `${JSON.stringify(config, null, 2)}\n`)
}

async function openedInEditor($: EngineInterface, path: string) {
  // The text editor the Mac opens .md files in; elsewhere the desktop's own opener
  const mac = await $.process.run(['open', '-t', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (mac.exitCode === 0) return ''
  const other = await $.process.run(['xdg-open', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return other.exitCode === 0 ? '' : mac.stderr || other.stderr || 'no editor opened'
}
// Edit: the person's own copy, made from the shipped text the first time, opened in their editor
async function editText($: EngineInterface, root: string, memory: string, path: string) {
  const own = `${memory}/${path}`
  if (!(await readOr($, own)).trim()) await writeOwnText($, memory, path, await readOr($, `${root}/${path}`))
  return openedInEditor($, own)
}
// Put back: the person's copy moves aside as .old, and the shipped text is in force again
async function putBack($: EngineInterface, memory: string, path: string) {
  const own = `${memory}/${path}`
  // Each copy put back is kept under a name of its own, so a second Reset never loses the first
  const at = new Date(await $.clock.now()).toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  const r = await $.process.run(['mv', '-n', own, `${own}.${at}.old`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return r.exitCode === 0 ? '' : r.stderr || 'not put back'
}

// Save: what the person wrote in the tab becomes their own copy
async function saveText($: EngineInterface, root: string, memory: string, path: string, text: string) {
  // Saved as it shipped, it is no copy of the person's: the shipped text stays in force through updates
  if (text.trim() === (await readOr($, `${root}/${path}`)).trim()) return (await readOr($, `${memory}/${path}`)) ? putBack($, memory, path) : ''
  await writeOwnText($, memory, path, text.endsWith('\n') ? text : `${text}\n`)
  return ''
}

// Kept keys stay out of every chat: a command that would read one from the keychain is refused, and once any key is kept, what a
// tool answers comes back with every kept value hidden. The values never reach the mod: `bin/secret --hide` swaps them in a pipe
let secrets = { at: -SECRETS_MS, names: [] as string[] }
async function hideKept($: EngineInterface, e: ToolCallInput, r: ToolCallResult): Promise<ToolCallResult> {
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  if (r.deny || OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return r
  const runner = `${$.plugin.root}/bin/secret`
  const now = await $.clock.now()
  if (now - secrets.at >= SECRETS_MS || command.includes('bin/secret')) {
    // A list that cannot be read keeps the names known before, so hiding never stops on a failure
    const listed = await $.process.run([runner, '--list']).catch(() => undefined)
    if (listed?.exitCode === 0) secrets = { at: now, names: listed.stdout.split('\n').filter(Boolean) }
  }
  if (!secrets.names.length) return r
  try {
    const text = JSON.stringify({ result: r.result, context: r.context })
    const hidden = await $.process.run([runner, '--hide', '--json', ...secrets.names], { stdin: text })
    if (hidden.exitCode !== 0 || hidden.isStdoutTruncated) throw new Error('not hidden')
    if (hidden.stdout === text) return r
    const swapped = JSON.parse(hidden?.stdout ?? '') as { result: typeof r.result; context: typeof r.context }
    return { ...r, result: swapped.result, context: swapped.context } as ToolCallResult
  } catch {
    return { deny: `${e.tool} ran, and what it answered was withheld: it could not be checked for kept keys.` }
  }
}
// Config: each thing the person can set, what is in force, and a way to change it or put it back to what shipped
const CONFIG_PANE = 'config'
const CONFIG_TITLE = 'Config'
let configFailed = ''
const openConfig = async ($: EngineInterface) => {
  presses += 1
  configFailed = ''
  await front($, CONFIG_PANE, CONFIG_TITLE)
}
const configButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="config-button" flexShrink={0}>
    <ui.Button key={`config-open-${presses}`} label="Config" hotkey={isKeyed ? 'c' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openConfig($).catch(err => log($, `config not opened: ${String(err)}`))} />
  </ui.Box>
)
// Check for updates as it stands in this chat: under way, and what the last press found, kept until the next press
const updateCheck = { isChecking: false, said: '', isError: false }
const configShown = async ($: EngineInterface): Promise<ConfigShown> => ({
  version: (await versionsOf($).catch(() => ({ version: '' }))).version,
  check: { ...updateCheck },
  texts: await Promise.all(
    TEXTS.map(async text => {
      const { isOwn, isStale, path, text: body } = await inForce($, $.plugin.root, dir, text.path)
      return { text, isOwn, isStale, path, body }
    }),
  ),
  config: await readConfig($, dir),
  // A config.json that does not read is said at once: until it is fixed every setting is as shipped
  failed:
    configFailed ||
    (await readOr($, `${dir}/config.json`).then(text => {
      try {
        JSON.parse(text || '{}')
        return ''
      } catch {
        return `${dir}/config.json does not read as JSON, so every setting is as shipped. Fix it or remove it.`
      }
    })),
})
// Each act says what failed under the tab, logs it, and reads the settings again so the chat goes on with what is in force
const configAct = ($: EngineInterface, what: string, act: () => Promise<string | void>) => {
  presses += 1
  void act()
    .then(failed => {
      configFailed = failed ? `${what}: ${failed}` : ''
    })
    .catch(err => {
      configFailed = `${what}: ${String(err instanceof Error ? err.message : err)}`
    })
    .then(async () => {
      if (configFailed) await log($, `config: ${configFailed}`)
      await loadSettings($)
      redraw($)
    })
}
const configActs = ($: EngineInterface) => ({
  open: (text: (typeof TEXTS)[number]) => configAct($, `${text.name} not opened`, () => editText($, $.plugin.root, dir, text.path)),
  // Edit opens the text in the tab itself; Save makes it the person's own copy
  edit: (text: (typeof TEXTS)[number], body: string) => configAct($, '', async () => void Object.assign(editing, { key: text.key, draft: body })),
  save: (text: (typeof TEXTS)[number], body: string) =>
    configAct($, `${text.name} not saved`, async () => {
      const failed = body.trim() ? await saveText($, $.plugin.root, dir, text.path, body) : 'the text was empty, so nothing changed'
      Object.assign(editing, { key: '', draft: '' })
      return failed
    }),
  cancel: () => configAct($, '', async () => void Object.assign(editing, { key: '', draft: '' })),
  putBack: (text: (typeof TEXTS)[number]) => configAct($, `${text.name} not reset`, () => putBack($, dir, text.path)),
  set: (key: Parameters<typeof setConfig>[2], value: unknown, role?: Parameters<typeof setConfig>[4]) =>
    configAct($, 'Not saved', async () => {
      await setConfig($, dir, key, value, role)
      // Automatic updates turned back on look at once when a look is due, not at the next quarter hour
      if (key === 'updates' && value === undefined) void selfUpdate($).catch(err => log($, `update not looked for: ${String(err)}`))
    }),
  // A press while a check runs does nothing: the tab shows it checking
  check: () => {
    if (updateCheck.isChecking) return
    presses += 1
    Object.assign(updateCheck, { isChecking: true, said: '', isError: false })
    redraw($)
    void checkForUpdates($)
      .catch(err => ({ text: `Couldn't check: ${String(err instanceof Error ? err.message : err).slice(0, 160)}`, isError: true }))
      .then(said => {
        Object.assign(updateCheck, { isChecking: false, said: said.text, isError: said.isError })
        presses += 1
        redraw($)
      })
  },
})

// The index: one line per subject, and the subject's brief

// ---- The index: one line per subject, "- name | repo | session | state | summary" ----

const INDEX_HEAD = '# Streams\n\nname | repo | session | state | summary\n\n'

const parseIndex = (text: string): Stream[] =>
  text
    .split('\n')
    .filter(line => line.startsWith('- '))
    .map(line => {
      const [name = '', repo = '', session = '', state = '', ...rest] = line.slice(2).split(' | ')
      return { name: name.trim(), repo: repo.trim(), session: session.trim(), state: state.trim(), summary: rest.join(' | ').trim() }
    })

const indexLines = (list: Stream[]) => list.map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary].join(' | ')}`).join('\n')

const readIndex = async ($: EngineInterface) => parseIndex(await readOr($, `${dir}/index.md`))

// Creates the subject or changes the fields given
const saveStream = async ($: EngineInterface, name: string, patch: Partial<Stream>) => {
  const list = await readIndex($)
  const old = list.find(s => slug(s.name) === slug(name))
  const given = Object.fromEntries(Object.entries(patch).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, oneLine(String(value))]))
  const next: Stream = { name: oneLine(name), repo: '', session: '', state: '', summary: '', ...old, ...given }
  await $.fs.write(`${dir}/index.md`, `${INDEX_HEAD}${indexLines(old ? list.map(s => (s === old ? next : s)) : [...list, next])}\n`)
  return next
}

// This session's title as the app knows it; nothing outside the desktop app, or before the app's tools connect
const appTitle = async ($: EngineInterface) => {
  try {
    return (JSON.parse(textOf(await $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' }))) as { title?: string }).title
  } catch {
    return undefined
  }
}

// Tells one version of the role text from another
const mark = (text: string) => `${text.length}:${[...text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 1_000_003, 7)}`

// The cards: one per piece of background work, its states from start to finish, the panel's open or closed choice, and
// finished work kept and recovered

// ---- The to-dos: one per piece of background work, as the panel lists them ----

const started = (id: string, parentId: string, title: string, words: string, at: number, isFork = false): Todo => ({
  id,
  parentId,
  isFork,
  tokens: 0,
  title: oneLine(title),
  words: words.trim(),
  items: [],
  entries: [],
  answer: '',
  startedAt: at,
  endedAt: 0,
  status: 'working',
})
// Work that ends keeps its ask: what it needs of the person's hands outlives it, and goes only on their answer
// What it kept of its own background work goes with it: started again, it keeps what it starts from then
const ended = (one: Todo, status: Todo['status'], at: number): Todo => ({ ...one, status, endedAt: at, bg: undefined, waitsSince: undefined })
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
const resumed = (one: Todo, at: number): Todo => ({ ...one, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, answeredAt: undefined, leftSince: undefined, stuckAt: undefined, waitsSince: undefined, newAt: at })
// Work that ended a turn while a command it started in the background itself, or a helper of its, still runs, and has not finished:
// a to-do of its is still being done. It is still at work; an answer it handed back on the way is no report. A watch it set is no
// such command: it may run until stopped
const goesOn = (list: Todo[], id: string) => {
  const one = list.find(card => card.id === id)
  const isRunning = Boolean(one?.bg?.some(b => !b.isWatch)) || list.some(kid => kid.parentId === id && kid.status === 'working')
  return Boolean(one && isRunning && one.items.some(item => item.state === 'doing'))
}
// How work that is stopped ends: done when its turn had already ended with its report and only its own background work held it
// (the chat stops such work once its report is in), stopped otherwise
const stoppedAs = (one: Todo): Todo['status'] => (one.answeredAt ? 'done' : 'stopped')
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
const handedBack = new Map<string, string>()
// Work whose card a handback ended, until it works again: a turn of words alone that what it left running wakes changes nothing
const endedByHandback = new Set<string>()
// Work stopped by the chat or the panel: whatever the engine still lists of it is going, so it is never said to have left something running
const stoppedHere = new Set<string>()
// Work stopped after its report, so ended done just now, keeps that report for good, as work that finished outright does
const keepStoppedReports = async ($: EngineInterface, now: number) => {
  for (const card of (await read($, todos)).filter(one => !one.parentId && one.status === 'done' && one.answeredAt && one.endedAt === now && one.answer.trim()))
    $.clock.after(5, () => void saveReport($, card, card.answer).catch(err => log($, `report of ${card.id} not kept: ${String(err)}`)))
}

// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
const byEnd = (list: Todo[]) => [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0)
// The list is kept short by forgetting work that has ended, the oldest first; work under way, and work still asking, is never forgotten
// Helpers are not counted: each is kept as long as the work it runs under, and goes with it
const capped = (list: Todo[]) => {
  let over = list.filter(one => !one.parentId).length - KEPT
  const kept = over > 0 ? list.filter(one => Boolean(one.parentId) || one.status === 'working' || Boolean(one.ask) || (over -= 1) < 0) : list
  const tops = new Set(kept.filter(one => !one.parentId).map(one => one.id))
  const held = kept.some(one => one.parentId && one.status !== 'working' && !tops.has(topOf(kept, one.id))) ? kept.filter(one => !one.parentId || one.status === 'working' || tops.has(topOf(kept, one.id))) : kept
  // Long work that keeps starting helpers keeps only its newest ended ones; one that still has a helper at work under it stays
  const spent = held.filter(one => one.parentId && one.status !== 'working' && !held.some(kid => kid.parentId === one.id && kid.status === 'working')).sort((a, b) => b.endedAt - a.endedAt).slice(HELPERS_KEPT)
  return spent.length ? held.filter(one => !spent.includes(one)) : held
}
const HELPERS_KEPT = 100

// Stands for the work that started a helper when the engine does not say which it was
const HELPER = 'helper'

// The to-do a piece of work belongs to: its own, or the one of the work that started it
const topOf = (list: Todo[], id: string) => {
  let at = id
  for (let hops = 0; hops < 10; hops += 1) {
    const one = list.find(todo => todo.id === at)
    if (!one?.parentId) return at
    at = one.parentId
  }
  return at
}

// ---- The helpers a piece of work started, and theirs, as a tree under it ----

// What one piece of work started itself, the oldest first
const kidsOf = (list: Todo[], id: string) => list.filter(one => one.parentId === id).sort((a, b) => a.startedAt - b.startedAt)
// Every helper under a piece of work, however deep
const underOf = (list: Todo[], id: string, depth = 1): Todo[] => (depth > TREE_DEEP ? [] : kidsOf(list, id).flatMap(one => [one, ...underOf(list, one.id, depth + 1)]))
const TREE_DEEP = 8
type Branch = { one: Todo; kids: Branch[] }
// The helpers under a piece of work that `keep` picks, each with its own; one that is not picked stays while one under it is
const branchesOf = (list: Todo[], id: string, keep: (one: Todo) => boolean, depth = 1): Branch[] =>
  depth > TREE_DEEP ? [] : kidsOf(list, id).map(one => ({ one, kids: branchesOf(list, one.id, keep, depth + 1) })).filter(b => keep(b.one) || b.kids.length > 0)
// One row of the tree: how deep it is, which of the levels above it still have a row to come (their line runs on past it),
// whether it is the last under its parent, and whether rows of its own follow
type Twig = { one?: Todo; depth: number; rails: boolean[]; isLast: boolean; hasKids: boolean }
// The rows in the order they are drawn; `isMore` says a closing row follows the top level's last
const twigsOf = (branches: Branch[], isMore = false, depth = 1, rails: boolean[] = []): Twig[] =>
  branches.flatMap((b, i) => {
    const isLast = i === branches.length - 1 && !isMore
    return [{ one: b.one, depth, rails, isLast, hasKids: b.kids.length > 0 }, ...twigsOf(b.kids, false, depth + 1, [...rails, !isLast])]
  })
// The lines that join a row to the tree, as text. Each level is two letters wide; a row's own helpers hang from the second
const twigText = (t: Twig) => `${t.rails.map(isOn => (isOn ? '│ ' : '  ')).join('')}${t.isLast ? '└─' : '├─'}${t.hasKids ? '┬─' : '──'}`
// The same lines drawn thin, for a surface that draws, as tall as one line of text: the last row under a parent turns to it in a
// curve, the line ends in a dot in the colour of how the row stands (a ring for the row of those that ended), and a row's own
// helpers hang from that dot. A row at work has a soft ring that grows out of its dot and fades, slowly, again and again
const TWIG_STEP = 18
const TWIG_ENDED = '#4EBA65'
const TWIG_FAILED = '#E5484D'
const twigWidth = (t: Twig) => t.rails.length * TWIG_STEP + 36
const twigSvg = (t: Twig, line: number, dot: string, isMoving = false) => {
  const mid = line / 2
  const x = (level: number) => level * TWIG_STEP + 9
  const own = x(t.rails.length)
  const at = own + TWIG_STEP
  const paths = [
    ...t.rails.flatMap((isOn, level) => (isOn ? [`M${x(level)} 0V${line}`] : [])),
    t.isLast ? `M${own} 0V${mid - 5}Q${own} ${mid} ${own + 5} ${mid}H${at - 5}` : `M${own} 0V${line}M${own} ${mid}H${at - 5}`,
    ...(t.hasKids ? [`M${at} ${mid + 5}V${line}`] : []),
  ]
  const ring = `<circle cx="${at}" cy="${mid}" r="3.5" fill="${dot}" opacity="0"><animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite"/></circle>`
  const mark = dot
    ? `${isMoving ? ring : ''}<circle cx="${at}" cy="${mid}" r="3.5" fill="${dot}"/>`
    : `<circle cx="${at}" cy="${mid}" r="3" fill="none" stroke="#808080" stroke-width="1.5"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${twigWidth(t)}" height="${line}" viewBox="0 0 ${twigWidth(t)} ${line}"><path d="${paths.join('')}" fill="none" stroke="#808080" stroke-opacity="0.7" stroke-width="1.5"/>${mark}</svg>`
}

// Work the chat's own record was already looked through for
const helpersChecked = new Set<string>()
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
const sync = async ($: EngineInterface) => {
  const listed = await $.agent.list().catch(() => undefined)
  const live = listed ?? []
  const now = await $.clock.now()
  // Work the mod never saw start (it was running when the mod was installed or renamed) that no loop is said to have started:
  // the chat's own Agent calls tell a piece of work from a helper whose start the engine did not record
  // A card taken for a helper that way is looked at again
  const known = new Map((await read($, todos)).map(one => [one.id, one.parentId] as const))
  const isUnseen = live.some(
    one => (!known.has(one.id) || known.get(one.id) === HELPER) && !helpersChecked.has(one.id) && (one.status === 'running' || one.status === 'pending') && !one.parentId && one.type !== 'fork',
  )
  const rows = isUnseen ? await $.session.messages().catch(() => []) : []
  const ownCalls = new Set(
    (Array.isArray(rows) ? rows : []).flatMap(row => (row.toolUses ?? []).filter(use => use.tool === 'Agent').map(use => String(use.input?.description ?? ''))).filter(Boolean),
  )
  // The chat is read once for each such work, not at every look
  if (isUnseen) for (const one of live) if (!one.parentId) helpersChecked.add(one.id)
  await update($, todos, list => {
    const cards = new Map(list.map(one => [one.id, one] as const))
    let isChanged = false
    for (const one of live) {
      const card = cards.get(one.id)
      const next: Todo | undefined = !card
        ? // Work held on background work it left running ended its turn: the mod, had it seen that, would have ended its card
          one.status === 'running' || one.status === 'pending'
          ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
            started(one.id, one.parentId ?? (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
          : undefined
        : card.status === 'working' && (one.status === 'completed' || one.status === 'failed' || one.status === 'killed')
          ? ended(card, one.status === 'failed' ? 'failed' : one.status === 'killed' ? stoppedAs(card) : 'done', now)
          : // A card listed from the engine alone, for work that is only held and has made no step since: its turn had ended
            card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle'
            ? ended(card, 'done', now)
          : // Work that handed in its report and that the engine still holds on its own background work left something running;
            // once nothing does, or it was stopped, not
            !card.parentId && card.status === 'done' && (one.status === 'waiting' && endedByHandback.has(card.id) && !stoppedHere.has(card.id)) !== Boolean(card.leftSince)
            ? { ...card, leftSince: card.leftSince ? undefined : now }
          : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
            ? { ...card, parentId: '', title: card.title || oneLine(one.description) }
            : !card.title && one.description
              ? { ...card, title: oneLine(one.description) }
              : undefined
      if (next) cards.set(one.id, next)
      isChanged ||= Boolean(next)
    }
    // Finished work the engine no longer lists has nothing of its own left running
    for (const card of cards.values()) if (listed && card.leftSince && !live.some(one => one.id === card.id)) ((isChanged = true), cards.set(card.id, { ...card, leftSince: undefined }))
    return isChanged ? capped([...cards.values()]) : list
  })
  await keepStoppedReports($, now)
  await lookEnds($)
}

// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
const change = async ($: EngineInterface, agentId: string, fn: (one: Todo, at: number) => Todo) => {
  const now = await $.clock.now()
  if (!(await read($, todos)).some(one => one.id === agentId)) await sync($)
  await update($, todos, list => {
    const id = topOf(list, agentId)
    return list.map(one => (one.id === id ? fn(one, now) : one))
  })
  // Work that was running before the panel had ever opened brings it up with its first line
  await openList($)
}

// Writes a line into a piece of work's own chat, which it reads at its next step
const tell = ($: EngineInterface, id: string, text: string) =>
  $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] }, agentId: id }).catch(async err => void (await log($, `work ${id} not told: ${String(err)}`)))

const stop = async ($: EngineInterface, id: string) => {
  if ((await read($, todos)).some(one => one.id === id && one.status === 'working')) pressed.add(id)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: id }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (pressed.delete(id), log($, `work ${id} not stopped: ${r.deny}`))
  stoppedHere.add(id)
  const now = await $.clock.now()
  // What finished work left running is stopped with it
  await update($, todos, list => list.map(one => (one.id === id && one.status === 'working' ? ended(one, stoppedAs(one), now) : one.id === id && one.leftSince ? { ...one, leftSince: undefined } : one)))
  await keepStoppedReports($, now)
  await lookEnds($)
}

// Moves running work to another model: its card names it at once, each step it sends from now on goes to it, and the work is
// told in its own chat, where the panel shows the change as a line of its own
const choose = async ($: EngineInterface, id: string, model: string) => {
  await update($, view, v => ({ ...v, picking: '' }))
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || one.status !== 'working' || modelName(one.chosen ?? one.model ?? '') === modelName(model)) return
  await update($, todos, list => list.map(todo => (todo.id === id ? { ...todo, model, chosen: model } : todo)))
  await tell($, id, movedTo(modelName(model), await $.clock.now()))
}

// One panel for every chat on this Mac: each chat in the app runs on its own, so whether the person last opened or closed it is
// kept in panel.json, and every chat follows it within PANEL_EVERY: opened in one chat, it is open in each chat they go to;
// closed by hand in one, it closes in all and stays closed until asked for. Until they first choose, each chat goes on as before
type PanelChoice = { isOpen: boolean; at: number }
const PANEL_EVERY = 2000
// The choice this chat last followed, as its time and whether it was open; a new load follows it afresh
let panelSeen = ''
const seenOf = (one: PanelChoice) => `${one.at}:${one.isOpen}`
const readPanel = ($: EngineInterface) =>
  readOr($, `${dir}/panel.json`)
    .then(text => (text ? (JSON.parse(text) as PanelChoice) : undefined))
    .then(one => (typeof one?.isOpen === 'boolean' && typeof one.at === 'number' ? one : undefined))
    .catch(() => undefined)
const choosePanel = async ($: EngineInterface, isOpen: boolean) => {
  // Kept later than any choice already there, so every chat sees it as new even when two come within one tick of the clock
  const at = Math.max(await $.clock.now(), ((await readPanel($))?.at ?? 0) + 1)
  panelSeen = seenOf({ isOpen, at })
  await $.fs.write(`${dir}/panel.json`, JSON.stringify({ isOpen, at })).catch(err => log($, `panel choice not kept: ${String(err)}`))
}
// Brings this chat's panel in line with the last choice, once per choice. A pane opened where nothing draws it yet stays open and
// is drawn once a screen that can attaches; an open the engine refused is tried again at the next look
const followPanel = async ($: EngineInterface) => {
  if (!dir) return undefined
  const choice = await readPanel($)
  if (!choice || seenOf(choice) === panelSeen) return choice
  const isOpen = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (choice.isOpen && !isOpen) {
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => (log($, `panel not opened with the others: ${String(err)}`), undefined))
    if (!opened) return choice
    await update($, me, one => ({ ...one, isListOpened: true }))
    await update($, paneShown, () => true)
  }
  if (!choice.isOpen && isOpen) await $.ui.close({ id: LIST }).catch(() => undefined)
  panelSeen = seenOf(choice)
  return choice
}

// The panel opens by itself with a chat's first piece of work; closed, it stays closed until asked for
const openList = async ($: EngineInterface) => {
  if ((await read($, me)).isListOpened) return
  // Closed by hand in any chat, it stays closed in every chat; opened, it is open in all of them already
  const choice = await readPanel($)
  if (choice && !choice.isOpen) return
  if (!choice) await choosePanel($, true)
  await update($, me, one => ({ ...one, isListOpened: true }))
  await update($, paneShown, () => true)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened: ${String(err)}`))
}

// Keeps the list true while work runs: the engine's list, and the minutes
// Work that has ended, kept on disk for good, one file per chat (finished/<chat id>.json): the Finished list survives a
// reload and a restart of the app. Its chat is the engine's own record of the work, read again when it is opened
const finishedPath = (chatId: string) => `${dir}/finished/${chatId}.json`
let finishedSaved = ''
const saveFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  // Its helpers are kept with it, so its Details still lists them after a reload
  const all = await read($, todos)
  const ended = all.filter(one => one.status !== 'working' && (!one.parentId || all.some(top => top.id === topOf(all, one.id) && !top.parentId && top.status !== 'working')))
  const sign = ended.map(one => [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title].join(':')).join(',')
  if (!id || !dir || !ended.length || sign === finishedSaved) return
  const old = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  const kept = capped([...old.filter(one => !ended.some(card => card.id === one.id)), ...ended].sort((a, b) => a.endedAt - b.endedAt))
  await $.fs.write(`${dir}/finished/${id}.json`, JSON.stringify(kept))
  finishedSaved = sign
}
// Work that ended before the mod kept it (before a rename, or before this list was kept) is read back from the app's own record
// of this chat's agents: its times, model, size, its to-dos and its last line about itself, from its saved transcript. Only work
// the chat's own thread started; what the person's words were for it is not recovered
const isBare = (card: Todo) => card.status !== 'working' && card.endedAt === card.startedAt && !card.model
const recoverEnded = async ($: EngineInterface) => {
  const { id } = await read($, me)
  const list = await read($, todos)
  if (!id) return
  // The engine lists only the work of its own process; the transcripts of the rest are in the chat's folder, one per agent
  const live = await $.agent.list().catch(() => [])
  const home = (await $.env.get('HOME')) ?? ''
  const folder = `${home}/.claude/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}/${id}/subagents`
  type Meta = { description?: string; agentType?: string; finished?: boolean; spawnDepth?: number }
  const ids = (await $.fs.list(folder).catch(() => [])).map(entry => /^agent-(\w+)\.meta\.json$/.exec(entry.name)?.[1] ?? '').filter(Boolean)
  // Only the work this chat's own thread started (its helpers are a level deeper), the newest first
  const metas = await Promise.all(
    ids.map(async one => ({
      one,
      meta: JSON.parse((await readOr($, `${folder}/agent-${one}.meta.json`)) || '{}') as Meta,
      at: (await $.fs.stat(`${folder}/agent-${one}.jsonl`).catch(() => undefined))?.mtimeMs ?? 0,
    })),
  )
  // The newest few, so a chat with a long past is read once and never again: what is read back is kept with the rest
  const fresh = metas
    .filter(({ meta }) => meta.spawnDepth === 1)
    .sort((a, b) => b.at - a.at)
    .slice(0, KEPT)
    .filter(({ one }) => !list.some(card => card.id === one && !isBare(card)) && !live.some(agent => agent.id === one && WORKING.includes(agent.status)))
  if (!fresh.length) return
  const found: Todo[] = []
  for (const { one: agentId, meta } of fresh) {
    try {
      const mtime = (await $.fs.stat(`${folder}/agent-${agentId}.jsonl`).catch(() => undefined))?.mtimeMs ?? 0
      // A transcript too long to read still gives a card: its name, how it ended and when
      const path = `${folder}/agent-${agentId}.jsonl`
      // One too long to read whole is read from its first line and its last few megabytes: its early to-dos may be missed
      const text =
        (await readOr($, path)) ||
        [
          (await $.process.run(['head', '-n', '1', path]).catch(() => undefined))?.stdout ?? '',
          ((await $.process.run(['tail', '-c', '3000000', path]).catch(() => undefined))?.stdout ?? '').split('\n').slice(1).join('\n'),
        ].join('\n')
      const engine = live.find(agent => agent.id === agentId)
      const one = { id: agentId, description: meta.description ?? '', type: meta.agentType ?? '', status: engine?.status ?? (meta.finished ? 'completed' : 'killed') }
      let first = 0
      let last = 0
      let model = ''
      let tokens = 0
      let items: Item[] = []
      const entries: Entry[] = []
      for (const row of text.split('\n')) {
        const o = (() => {
          try {
            return JSON.parse(row) as { timestamp?: string; type?: string; message?: { model?: string; usage?: Record<string, number>; content?: unknown } }
          } catch {
            return undefined
          }
        })()
        const at = o?.timestamp ? Date.parse(o.timestamp) : 0
        if (!o || !at) continue
        first ||= at
        last = at
        if (o.type !== 'assistant') continue
        model = o.message?.model || model
        const u = o.message?.usage
        if (u) tokens = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.output_tokens ?? 0)
        for (const block of Array.isArray(o.message?.content) ? (o.message.content as { type?: string; name?: string; input?: Record<string, string> }[]) : []) {
          if (block.type !== 'tool_use' || !block.name) continue
          const input = block.input ?? {}
          if (isTool(block.name, 'note') && typeof input.text === 'string') entries.push({ at, kind: 'note', text: oneLine(input.text).slice(0, NOTE_CHARS) })
          if (isTool(block.name, 'todo') && typeof input.item === 'string') {
            const text = oneLine(input.item).slice(0, 200)
            const state = (['open', 'doing', 'done', 'dropped'] as const).find(s => s === input.state)
            const old = slug(typeof input.was === 'string' && input.was.trim() ? input.was : text)
            items = items.some(item => slug(item.text) === old) ? items.map(item => (slug(item.text) === old ? { text, state: state ?? item.state } : item)) : [...items, { text, state: state ?? 'open' }]
          }
        }
      }
      const status: Todo['status'] = one.status === 'failed' ? 'failed' : one.status === 'killed' ? 'stopped' : 'done'
      found.push({ ...started(one.id, '', one.description, '', first || mtime, one.type === 'fork'), status, endedAt: last || mtime, model, tokens, items, entries: entries.slice(-ENTRIES_KEPT) })
    } catch (err) {
      await log($, `ended work ${agentId} not read back: ${String(err)}`)
    }
  }
  // A card read back bare by an earlier version, with no times or model, is replaced
  if (found.length)
    await update($, todos, now => capped(byEnd([...found.filter(one => !now.some(card => card.id === one.id && !isBare(card))), ...now.filter(card => !(isBare(card) && found.some(one => one.id === card.id)))])))
}

// What was kept comes back into the list when the chat loads, below anything the list already holds
const loadFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id) return
  const kept = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  if (!Array.isArray(kept) || !kept.length) return
  await update($, todos, list => {
    // What it left running is looked at afresh: the record of how it ended does not outlive the load
    const fresh = kept.filter(one => one.id && one.status !== 'working' && !list.some(card => card.id === one.id)).map(one => ({ ...one, leftSince: undefined, stuckAt: undefined, bg: undefined, waitsSince: undefined }))
    return fresh.length ? capped(byEnd([...fresh, ...list])) : list
  })
}

const follow = async ($: EngineInterface) => {
  await sync($)
  await lookStuck($).catch(err => log($, `stuck work not looked for: ${String(err)}`))
  await saveFinished($).catch(err => log($, `finished work not kept: ${String(err)}`))
  const isShown = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (isShown !== (await read($, paneShown))) await update($, paneShown, () => isShown)
  // Reports another chat kept since are listed here too
  await loadReports($).catch(() => undefined)
  if ((await read($, todos)).some(one => !one.parentId && one.status === 'working')) await update($, tick, n => n + 1)
}

// A message as the panel quotes it: whole when short, else its first sentences
const quoted = (text: string, most: number) => {
  // The app wraps a pasted message in a tag of its own, which is no part of what the person said
  const flat = oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' '))
  if (flat.length <= most) return flat
  const head = flat.slice(0, most)
  const end = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '))
  return end > most / 3 ? `${head.slice(0, end + 1)} …` : `${head.slice(0, head.lastIndexOf(' '))} …`
}

// A line cut to what a small card has room for, at the end of a word
const cut = (text: string, most: number) => {
  const end = text.lastIndexOf(' ', most)
  return text.length <= most ? text : `${text.slice(0, end > most / 2 ? end : most)} …`
}

// Each web address in a text as a link to press, the rest as it stands: only an address whole in `whole` is linked, so one a
// small card cut short is never a link to half an address
const URL_IN = /https?:\/\/[^\s<>()"'`…]*[^\s<>()"'`….,;:!?]/g
const withLinks = (Link: ElementTable['Link'], text: string, key: string, whole = text) => {
  const full = new Set(whole.match(URL_IN) ?? [])
  const parts: (string | JSX.Element)[] = []
  let at = 0
  for (const m of text.matchAll(URL_IN)) {
    const end = (m.index ?? 0) + m[0].length
    if (!full.has(m[0]) || /[^\s<>()"'`.,;:!?]/.test(text[end] ?? ' ')) continue
    parts.push(text.slice(at, m.index), <Link key={`${key}-${parts.length}`} href={m[0]} />)
    at = end
  }
  parts.push(text.slice(at))
  return parts.filter(part => part !== '')
}

// A piece of work's own chat, read for its Details tab: what it was told, what it wrote, each tool step; and opening that tab

// ---- A piece of work's own chat: what it was told, what it wrote, and each tool step, in order ----

// One line of that chat as the panel draws it: a message to the work, the work's own words, or one tool step
// `pictures` are the picture files a step wrote or sent; `seen` the ones a command only named, kept if made since the work began
type Line = {
  kind: 'told' | 'steer' | 'said' | 'step' | 'model'
  text: string
  isError?: boolean
  isUse?: boolean
  tool?: string
  at?: number
  name?: string
  covers?: string
  isWaiting?: boolean
  pictures?: string[]
  seen?: string[]
}
// A picture a step can make, by its name
const IMAGE = /\.(png|jpe?g|gif|webp|svg)$/i
// The most picture files one command may name and still be taken to have made them
const SEEN_MOST = 4
// The pictures one tool step made: a file it wrote or sent, and the picture files its command or output names or that it looked
// at, which count when made since the work began (a work looks at what it rendered)
const picturesOf = (use: ToolUseSummary) => {
  const input = use.input ?? {}
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  if (use.isError) return { pictures: [], seen: [] }
  // One file as /tmp and /private/tmp alike
  const same = (path: string) => path.replace(/^\/private(?=\/(tmp|var)\/)/, '')
  const sent = use.tool === 'SendUserFile' && Array.isArray(input.files) ? input.files.filter((one): one is string => typeof one === 'string') : []
  const written = ['Write', 'Edit'].includes(use.tool) ? [given('file_path')] : []
  const named = use.tool === 'Bash' ? namedPaths(`${given('command')}\n${use.text ?? ''}`) : use.tool === 'Read' ? [given('file_path')] : []
  // A command that lists a folder of pictures made none of them: past a few, it names none
  const seen = [...new Set(named.filter(one => IMAGE.test(one)).map(same))]
  return { pictures: [...new Set([...written, ...sent].filter(one => IMAGE.test(one)).map(same))], seen: seen.length > SEEN_MOST ? [] : seen }
}

// A tool's name as a person reads it: the last part of a connector's tool, in words
const toolName = (tool: string) => (tool.startsWith('mcp__') ? (tool.split('__').pop() ?? tool).replaceAll('_', ' ') : tool)
const fileName = (path: string) => path.split('/').pop() ?? path
// What a tool step was for: the call's own description where it has one, else what it was pointed at
const aim = (input: Record<string, unknown>) => {
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  const path = given('file_path') || given('path') || given('notebook_path')
  return given('description') || (path && fileName(path)) || given('pattern') || given('query') || given('url') || given('skill') || given('command') || given('prompt') || given('message') || ''
}
// One tool step as one short line. What the work wrote for the person through a tool is its own words, not a step
const stepOf = (use: ToolUseSummary): Line => {
  const input = use.input ?? {}
  const given = (key: string) => (typeof input[key] === 'string' ? String(input[key]) : '')
  if (isTool(use.tool, 'note')) return { kind: 'said', text: given('text'), isUse: true }
  if (use.tool === 'SubagentHandback') return { kind: 'said', text: whole(given('message')), isUse: true }
  if (use.tool === 'Agent') return { kind: 'step', text: `Started a helper: ${given('description') || 'no name'}`, isError: use.isError, isUse: true, tool: use.tool, name: given('description') }
  const file = given('file_path') || given('notebook_path')
  const text =
    isTool(use.tool, 'todo')
      ? `${{ doing: 'Started on', done: 'Ticked', dropped: 'Dropped' }[given('state')] ?? 'To-do'}: ${given('item')}`
      : given('description')
        ? oneLine(given('description'))
        : file
          ? `${toolName(use.tool)} ${fileName(file)}`
          : [toolName(use.tool), oneLine(aim(input))].filter(Boolean).join(': ')
  const { pictures, seen } = picturesOf(use)
  return {
    kind: 'step',
    text: text.length > STEP_CHARS ? `${text.slice(0, STEP_CHARS)} …` : text,
    isError: use.isError,
    isUse: true,
    tool: use.tool,
    ...(pictures.length ? { pictures } : {}),
    ...(seen.length ? { seen } : {}),
  }
}
// The steps of an opened run as it lists them: helpers started one after another are one line, named by what their names share
const listed = (steps: Line[]) =>
  steps.reduce<Line[]>((all, line) => {
    const last = all.at(-1)
    if (line.tool !== 'Agent' || last?.tool !== 'Agent' || line.isError || last.isError) return [...all, { ...line, covers: line.name }]
    const names = [...(last.covers ?? '').split('\n'), line.name ?? '']
    const first = names[0] ?? ''
    const end = names.at(-1) ?? ''
    let same = 0
    while (same < first.length && names.every(name => name[same] === first[same])) same += 1
    const text = same >= 6 ? `Started ${names.length} helpers: ${first} to ${end.slice(same) || end}` : `Started ${names.length} helpers: ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''}`
    return [...all.slice(0, -1), { ...last, text, covers: names.join('\n') }]
  }, [])
// A message as the chat draws it: whole, unless it is too long for one drawing
const whole = (text: string) => (text.length > SAID_CHARS ? `${text.slice(0, SAID_CHARS)}\n\n…` : text)
// What the app adds around a message for the model alone is no part of the chat
const bare = (text: string) =>
  whole(
    (text.replace(/<system-reminder[^>]*>[\s\S]*?<\/system-reminder[^>]*>/g, '').split(workHead())[0] ?? '')
      .replace(PANEL_RULE, '')
      .trim(),
  )
// The chat of a piece of work as lines. The rows the engine gives hold each message's text and its tool calls, and no thinking
const talkOf = (rows: readonly SessionMessage[]): Line[] =>
  rows.flatMap((row): Line[] => {
    const text = bare(row.text)
    const moved = row.role === 'user' ? MODEL_LINE.exec(text) : null
    if (moved) return [{ kind: 'model', text: `${MODEL_HEAD}${moved[1]} · ${moved[2]}` }]
    if (row.role === 'user') return text ? [{ kind: 'told', text }] : []
    return [...(text ? [{ kind: 'said' as const, text }] : []), ...row.toolUses.map(stepOf)]
  })
// A run of tool steps in a few words, as the app's own chat folds one: "Ran 3 commands, read 2 files"
const folded = (steps: Line[]) => {
  const count = (tools: string[]) => steps.filter(line => tools.includes(line.tool ?? '')).length
  const some = (n: number, did: string, thing: string) => (n ? `${did} ${n} ${thing}${n === 1 ? '' : 's'}` : '')
  const known = ['Bash', 'Read', 'Edit', 'Write', 'NotebookEdit', 'Grep', 'Glob', 'Agent', `${TOOLS}todo`, `${OLD_TOOLS}todo`]
  const parts = [
    some(count(['Bash']), 'ran', 'command'),
    some(count(['Read']), 'read', 'file'),
    some(count(['Edit', 'Write', 'NotebookEdit']), 'edited', 'file'),
    some(count(['Grep', 'Glob']), 'made', 'search'),
    some(count(['Agent']), 'started', 'helper'),
    count([`${TOOLS}todo`, `${OLD_TOOLS}todo`]) ? 'updated its to-dos' : '',
    some(steps.filter(line => !known.includes(line.tool ?? '')).length, 'took', 'other step'),
    steps.some(line => line.isError) ? `${steps.filter(line => line.isError).length} failed` : '',
  ]
    .filter(Boolean)
    .join(', ')
  return `${parts.charAt(0).toUpperCase()}${parts.slice(1)}`
}
// A message as it is compared: on one line, without quote marks or the app's own tags
const flat = (text: string) => oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' ')).replace(/["“”]/g, '')
// Each steer of the person's is shown once, in their words, where it arrived. One sent to work that had stopped is a message in the rows
// the engine gives: it takes that message's place. One sent to work under way is in no row: it goes before what the work did
// about it, its to-dos and the line it then wrote. One the work has written nothing since is last, and is waiting
const withSteers = (lines: Line[], entries: Entry[]): Line[] => {
  const all = [...lines]
  let from = 1
  entries.forEach((entry, i) => {
    if (entry.kind !== 'steer') return
    const text = oneLine(entry.text.replace(/<\/?pasted_content[^>]*>/g, ' '))
    const head = flat(text).slice(0, 40)
    const sent = all.findIndex((line, n) => n > 0 && flat(line.covers ?? (line.kind === 'told' ? line.text : '')).includes(head))
    if (sent >= 0) {
      const covers = all[sent]?.covers ?? all[sent]?.text ?? ''
      const isFirst = all[sent]?.kind === 'told'
      let at = sent
      while (!isFirst && all[at + 1]?.covers === covers) at += 1
      all.splice(isFirst ? sent : at + 1, isFirst ? 1 : 0, { kind: 'steer', text, covers })
      from = Math.max(from, at + 1)
      return
    }
    const later = entries.slice(i + 1).filter(one => one.kind !== 'steer').map(one => one.text)
    let at = all.findIndex((line, n) => n >= from && line.kind === 'said' && later.includes(oneLine(line.text).slice(0, NOTE_CHARS)))
    while (at > from && isTool(all[at - 1]?.tool, 'todo')) at -= 1
    all.splice(at < 0 ? all.length : at, 0, { kind: 'steer', text, isWaiting: later.length === 0 })
    from = at < 0 ? all.length : at + 1
  })
  return all
}
// The newest lines of a chat that one drawing has room for
const newest = (lines: Line[]) => {
  let room = TALK_CHARS
  const from = lines.findLastIndex((line, i) => i < lines.length - TALK_KEPT || (room -= line.text.length) < 0)
  return lines.slice(from + 1)
}

// A piece of work's Details is a tab of its own, named after the work, beside the list, as a result is: closing it leaves the
// list as it was. A press on Details for work whose tab is open brings that tab to the front
const WORK_PANE = 'work-'
const workPaneOf = (id: string) => `${WORK_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64)
const titleOf = (one: Todo) => one.title || quoted(one.words, 60) || 'Background work'
const openWork = ($: EngineInterface, id: string) => {
  presses += 1
  void (async () => {
    const one = [...(await read($, todos)), ...cardsOf(await read($, others))].find(card => card.id === id)
    if (!one) return
    // A tab opened afresh starts folded; one already open keeps what was unfolded in it
    if (!(await $.ui.panes()).some(pane => pane.id === workPaneOf(id))) (folds.delete(id), pictureIn.delete(workPaneOf(id)))
    await front($, workPaneOf(id), cut(titleOf(one), 30))
    // The pressed card's button gets a new name, so the app does not hold the list where that button was
    redraw($)
  })().catch(err => log($, `details of ${id} not opened: ${String(err)}`))
}

// The servers on this Mac: what listens on which port, from which folder, started by which chat, and the Servers tab

// ---- The servers on this Mac: what listens on which port, from which folder, started by which chat ----

const rows = (text: string) => text.split('\n').filter(Boolean)
// The engine process of a chat, as `ps` names it; the app itself is `Claude`
const isEngine = (path: string) => path.endsWith('/MacOS/claude')
// "node /long/path/.bin/next dev" reads as "node next dev"
const short = (args: string) =>
  args
    .split(' ')
    .map(part => (part.startsWith('/') ? (part.split('/').pop() ?? part) : part))
    .join(' ')
    .slice(0, 50)

const scanServers = async ($: EngineInterface) => {
  scannedAt = Date.now()
  const home = (await $.env.get('HOME')) ?? ''
  const run = async (argv: string[]) => (await $.process.run(argv).catch(() => undefined))?.stdout ?? ''

  // lsof -F prints one field a line: p<pid>, then n<address:port> for each socket of that process
  const ports = new Map<number, string[]>()
  let pid = 0
  for (const row of rows(await run(['lsof', '-nP', '-iTCP', '-sTCP:LISTEN', '-Fpn']))) {
    if (row.startsWith('p')) pid = Number(row.slice(1))
    const port = row.startsWith('n') ? row.slice(row.lastIndexOf(':') + 1) : ''
    if (port && !ports.get(pid)?.includes(port)) ports.set(pid, [...(ports.get(pid) ?? []), port])
  }
  if (!ports.size) return update($, servers, () => [])
  const pids = [...ports.keys()].join(',')

  const folders = new Map<number, string>()
  for (const row of rows(await run(['lsof', '-a', '-d', 'cwd', '-Fpn', '-p', pids]))) {
    if (row.startsWith('p')) pid = Number(row.slice(1))
    else if (row.startsWith('n')) folders.set(pid, row.slice(1))
  }
  const commands = new Map<number, string>()
  for (const row of rows(await run(['ps', '-o', 'pid=,args=', '-p', pids]))) {
    const m = /^\s*(\d+)\s+(.*)$/.exec(row)
    if (m) commands.set(Number(m[1]), m[2] ?? '')
  }
  // Every process with its parent, to find who started a server
  const table = new Map<number, { parent: number; path: string }>()
  for (const row of rows(await run(['ps', '-A', '-o', 'pid=,ppid=,comm=']))) {
    const m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(row)
    if (m) table.set(Number(m[1]), { parent: Number(m[2]), path: m[3] ?? '' })
  }
  // The nearest process above this one that the test accepts; 0 for none
  const above = (from: number, test: (path: string) => boolean) => {
    let at = table.get(from)?.parent ?? 0
    for (let hops = 0; at > 1 && hops < 15; hops += 1) {
      const one = table.get(at)
      if (!one) return 0
      if (test(one.path)) return at
      at = one.parent
    }
    return 0
  }

  // The chats open now, named by their engine process and by their session id
  const chats = new Map<string, string>()
  for (const entry of await $.fs.list(`${home}/.claude/sessions`).catch(() => [])) {
    if (!entry.name.endsWith('.json')) continue
    const one = JSON.parse((await readOr($, `${home}/.claude/sessions/${entry.name}`)) || '{}') as { pid?: number; sessionId?: string; name?: string; cwd?: string }
    const name = one.name || (one.cwd ?? '').split('/').pop() || 'unnamed'
    if (one.pid) chats.set(String(one.pid), name)
    if (one.sessionId) chats.set(one.sessionId, name)
  }
  // A server outlives the chat process that started it and then has no parent: what was seen while it had one is kept
  const seen = JSON.parse((await readOr($, `${dir}/servers.json`)) || '{}') as Record<string, string>
  const kept: Record<string, string> = {}

  const found: Server[] = []
  for (const [id, list] of ports) {
    const folder = folders.get(id) ?? ''
    const isScratch = folder.startsWith('/private/tmp/') || folder.startsWith('/tmp/')
    // A server of mine runs from one of my folders or a chat's scratch folder; the apps and the chats themselves listen too
    if (!(folder.startsWith(`${home}/`) || isScratch) || folder.startsWith(`${home}/Library`) || isEngine(table.get(id)?.path ?? '')) continue
    const port = list[0] ?? ''
    // The chat is the engine process above it, or the one whose scratch folder it runs in
    const chat = chats.get(String(above(id, isEngine))) ?? chats.get(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.exec(folder)?.[0] ?? '') ?? seen[`${id}:${port}`]
    if (chat) kept[`${id}:${port}`] = chat
    const command = short(commands.get(id) ?? table.get(id)?.path ?? '')
    const hasPages = !NO_PAGES.test(command)
    const place = isScratch ? (folder.split('/').pop() ?? '') : folder.replace(`${home}/Documents/GitHub/`, '').replace(`${home}/`, '~/')
    found.push({
      pid: id,
      port,
      url: hasPages ? `http://localhost:${port}` : '',
      about: [hasPages ? '' : command.split(' ')[0], place, chat].filter(Boolean).join(' · '),
    })
  }
  found.sort((a, b) => Number(a.port) - Number(b.port))
  if (JSON.stringify(kept) !== JSON.stringify(seen)) await $.fs.write(`${dir}/servers.json`, JSON.stringify(kept))
  await update($, servers, () => found)
}

// Looks at the servers again while their panel is open; each pass redraws it
const refresh = async ($: EngineInterface) => {
  const open = await $.ui.panes().catch(() => [])
  if (!open.some(one => one.id === PANE && one.isShown)) return
  await scanServers($)
  await update($, tick, n => n + 1)
}

const stopServer = async ($: EngineInterface, pid: number) => {
  await $.process.run(['kill', String(pid)]).catch(err => log($, `server ${pid} not stopped: ${String(err)}`))
  await $.clock.sleep(700)
  await scanServers($)
}

const serversTabHooks = (on: On) => {

  // The servers panel: one block per server with its link, where it runs and which chat started it; nothing is cut off
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Link, Text } = uiOf($, e)
    if (!scannedAt) await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    await read($, tick)
    const found = await read($, servers)

    return (
      <Box flexDirection="column" gap={1}>
        {found.length === 0 && <Text dimColor>Nothing is listening from your folders.</Text>}
        {found.map(one => (
          <Box key={`server-${one.pid}`} flexDirection="row" alignItems="flex-start" gap={1}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text wrap="wrap">{one.url ? <Link href={one.url} label={`localhost:${one.port}`} /> : `Port ${one.port}`}</Text>
              <Text dimColor wrap="wrap">{one.about}</Text>
            </Box>
            <Box flexShrink={0}>
              <Button key={`kill-${one.pid}`} label="■" onPress={() => void stopServer($, one.pid)} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  })

}

// Results: what each finished piece of work reported, kept for good with copies of the pictures it named

// ---- Reports: what each finished piece of work reported, kept for good with copies of the pictures it named ----
// One folder each under ~/.claude/claudopus/reports: report.md, the text as the work wrote it and never rewritten; meta.json; the
// copies. A later look at the same subject is a new report beside the older one

// How many subjects the panel lists before "more", and at most after it; how many reports the chat is told of with each message
const REPORTS_TOLD = 8
// What a report may name that is copied in beside it: pictures and pages, never data
const PICTURE = /\.(png|jpe?g|gif|webp|svg|pdf|html?)$/i
// A folder a report names is copied, its pictures alone, only from where files are temporary
const TEMP = /^\/(private\/)?(tmp|var\/folders)\//
// The most copies one report keeps, and how much of its text one drawing shows
const COPIES_KEPT = 40
const REPORT_CHARS = 40_000
// A shorter answer with no picture is a confirmation, not a report worth coming back to
const REPORT_LEAST = 500
// The panel draws a picture as a small copy inside an Svg, one at a time: one drawing holds 100,000 characters
const THUMB_BYTES = 36_000
const THUMB_SIZES = ['640', '480', '360']
const RASTER = /\.(png|jpe?g|gif|webp)$/i
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const reports = atom({ plugin: 'claudopus', key: 'reports' } as const, [], { shape: 'reports-1' })
// The text of each report open in a pane, as read when it opened: a report is never rewritten
const reportText = new Map<string, string>()
// The folder this session started in
let cwd = ''
// A report the person's last message named: the work it starts was started from that report
let fromReport = ''
// What the mod itself sent the chat for the person, from a press on a report: it goes on as the person's own message
const sentForPerson = new Set<string>()

const reportsDir = () => `${dir}/reports`
const reportPath = (r: Report) => `${reportsDir()}/${r.id}`
const two = (n: number) => String(n).padStart(2, '0')
// When a report was written, as a person writes it: "11 Nov, 14:20", with the year when it is not this one
const dated = (at: number, now: number) => {
  const d = new Date(at)
  const year = d.getFullYear() === new Date(now).getFullYear() ? '' : ` ${d.getFullYear()}`
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${year}, ${two(d.getHours())}:${two(d.getMinutes())}`
}
// How old it is, in the largest unit that fits
const ago = (at: number, now: number) => {
  const minutes = Math.floor(Math.max(0, now - at) / 60_000)
  const [hours, days] = [Math.floor(minutes / 60), Math.floor(minutes / 1440)]
  return minutes < 1 ? 'just now' : minutes < 60 ? `${minutes}m ago` : hours < 24 ? `${hours}h ago` : days < 60 ? `${days}d ago` : `${Math.floor(days / 30)} months ago`
}
// What a report leaves waiting on the person: what its work recorded, or an older report's one question
const waitsOf = (r: Report): Wait[] => r.waiting ?? (r.question ? [{ text: r.question, ...(r.answer ? { answer: r.answer } : {}) }] : [])
// One put away waits on nothing; brought back, what was open waits again
const openWaits = (r: Report) => (r.archived ? [] : waitsOf(r).filter(one => !one.answer))
const isOpenQuestion = (r: Report) => openWaits(r).length > 0
// What the person answered, once nothing in it waits: their one answer, or how many they answered
const answeredOf = (r: Report) => {
  const answered = waitsOf(r).filter(one => one.answer)
  return isOpenQuestion(r) || !answered.length ? '' : answered.length === 1 ? `you answered ${answered[0]?.answer}` : `you answered ${answered.length}`
}

const gists = new Map<string, string>()
const loadReports = async ($: EngineInterface) => {
  const found: Report[] = []
  for (const entry of await $.fs.list(reportsDir()).catch(() => [])) {
    if (entry.kind !== 'dir' || entry.name.startsWith('_')) continue
    try {
      const one = JSON.parse(await readOr($, `${reportsDir()}/${entry.name}/meta.json`)) as Report
      if (one.id !== entry.name || !one.title) continue
      // A report a piece of work wrote has its finding read again from its text, once a load, as the finding is now found;
      // one brought in by hand keeps the finding written for it
      if (one.agent && !gists.has(one.id)) gists.set(one.id, gistOf(await readOr($, `${reportsDir()}/${entry.name}/report.md`), one.title) || one.gist)
      found.push({ ...one, subject: one.subject || one.title, gist: (one.agent && gists.get(one.id)) || one.gist || '', files: Array.isArray(one.files) ? one.files : [] })
    } catch {
      // A folder without its meta.json is not a report yet
    }
  }
  found.sort((a, b) => b.at - a.at)
  if (JSON.stringify(found) !== JSON.stringify(await read($, reports))) await update($, reports, () => found)
  return found
}

// The absolute paths a report names, as written, without the punctuation after them
const namedPaths = (text: string) => [...new Set((text.match(/\/(?:Users|private|tmp|var)\/[^\s`'"()<>[\]{}|,;*]+/g) ?? []).map(path => path.replace(/[.:!?]+$/, '').replace(/\/$/, '')))]
// What a report found, in plain words: its first sentences that say something. A heading, a path, a line that only leads in to
// what follows ("Here is the sheet:", "The answer is back. As it came:") or repeats the title says nothing
const gistOf = (text: string, title = '') => {
  const lead = /^(here is|here are|here's|as it came)\b|\b(is|are) back\b[^.]{0,30}\.?$/i
  // Its sentences paragraph by paragraph; the finding is taken from the first paragraph that says something, so the list or
  // table after it is never glued on
  const paragraphs = text.split(/\n\s*\n/).map(part =>
    part
      .split('\n')
      .filter(line => !/^\s*(#|```|\|)/.test(line) && !/^\s*\/\S+$/.test(line.trim()) && !/^\s*(?:[-*]|\d+\.)\s/.test(line))
      .map(line => oneLine(line.replace(/[*_`>]/g, '')))
      .filter(line => line.length > 20 && slug(line) !== slug(title))
      .flatMap(line => line.split(/(?<=[.!?:])\s+(?=[A-Z0-9“"])/))
      // A short line that ends in a colon only leads in to what follows; a long one says something
      .filter(one => !(one.trim().endsWith(':') && one.trim().length < 40))
      .map(one => one.trim().replace(/:$/, '.'))
      .filter(one => one.length > 12 && !one.endsWith('?') && !lead.test(one) && !namedPaths(one).length && /[.!)”"]$/.test(one)),
  )
  let found = ''
  for (const one of paragraphs.find(part => part.length) ?? []) {
    if (found && found.length + one.length > 200) break
    found = found ? `${found} ${one}` : one
  }
  return found
}

// Copies the pictures and pages a report names into its folder: a file wherever it is, and from a temporary folder it names,
// that folder's pictures. Answers the copies by their path in the folder
const copyNamed = async ($: EngineInterface, text: string, into: string) => {
  const copies: string[] = []
  const copy = async (from: string, name: string) => {
    if (copies.length >= COPIES_KEPT || copies.includes(name)) return
    const to = `${into}/${name}`
    await $.process.run(['mkdir', '-p', to.slice(0, to.lastIndexOf('/'))])
    if ((await $.process.run(['cp', '-p', from, to])).exitCode === 0) copies.push(name)
  }
  for (const path of namedPaths(text)) {
    const stat = await $.fs.stat(path).catch(() => undefined)
    if (stat?.kind === 'file' && PICTURE.test(path)) await copy(path, fileName(path))
    else if (stat?.kind === 'dir' && TEMP.test(path) && path.includes('/scratchpad/')) {
      const r = await $.process.run(['find', path, '-maxdepth', '2', '-type', 'f'])
      for (const file of rows(r.stdout).filter(one => PICTURE.test(one)).sort()) await copy(file, `${fileName(path)}/${file.slice(path.length + 1)}`)
    }
  }
  return copies
}

// Keeps what a finished piece of work reported, once
const saveReport = async ($: EngineInterface, card: Todo, text: string) => {
  // What the work recorded as waiting is read as it stands now; a short answer that leaves something waiting is still kept
  const one = (await read($, todos)).find(todo => todo.id === card.id) ?? card
  if (!one.waits?.length && text.trim().length < REPORT_LEAST && !namedPaths(text).some(path => PICTURE.test(path))) return
  const kept = await loadReports($)
  const marked = mark(text)
  if (kept.some(r => r.agent === one.id && r.mark === marked)) return
  const at = await $.clock.now()
  const title = cut(one.title || quoted(one.words, 60) || 'Report', 70)
  const stamp = new Date(at).toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')
  const base = `${stamp}-${slug(title).slice(0, 40) || 'report'}`
  const id = kept.some(r => r.id === base) ? `${base}-${slug(one.id).slice(0, 8)}` : base
  const into = `${reportsDir()}/${id}`
  const chat = await read($, me)
  await $.fs.write(`${dir}/reports/${id}/report.md`, `${text.trim()}\n`)
  const files = await copyNamed($, text, into).catch(err => (void log($, `pictures of report ${id} not copied: ${String(err)}`), [] as string[]))
  await makeThumbs($, { id, files } as Report).catch(err => log($, `small copies of report ${id} not made: ${String(err)}`))
  const report: Report = {
    id,
    title,
    subject: oneLine(one.subject || title),
    at,
    chat: chat.title,
    chatId: chat.id,
    // The folder of the subject the work recorded, which need not be the chat's own
    folder: [(await readIndex($)).find(s => one.subject && slug(s.name) === slug(one.subject))?.repo ?? ''].find(repo => repo.startsWith('/')) ?? cwd,
    gist: gistOf(text, title),
    files,
    agent: one.id,
    mark: marked,
    // What waits on the person is what the work recorded with the `waits` tool, wherever in the report it is
    ...(one.waits?.length ? { waiting: one.waits.map(wait => ({ text: wait })) } : {}),
    ...(one.from ? { from: one.from } : {}),
  }
  await $.fs.write(`${dir}/reports/${id}/meta.json`, `${JSON.stringify(report, null, 2)}\n`)
  // Its report holds them now: the work's next round records what still waits afresh
  if (one.waits?.length) await update($, todos, list => list.map(card => (card.id === one.id ? { ...card, waits: undefined } : card)))
  await loadReports($)
}

// The small copy of a picture the panel draws, kept beside the report
const thumbPath = (r: Report, file: string) => `${reportPath(r)}/thumbs/${file.replaceAll('/', '--')}.jpg`
const makeThumbs = async ($: EngineInterface, r: Report) => {
  for (const file of r.files.filter(one => RASTER.test(one))) {
    const to = thumbPath(r, file)
    if (await $.fs.exists(to)) continue
    await $.process.run(['mkdir', '-p', `${reportPath(r)}/thumbs`])
    for (const size of THUMB_SIZES) {
      await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', `${reportPath(r)}/${file}`, '--out', to])
      if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= THUMB_BYTES) break
    }
  }
}
// A small copy as an Svg the panel can draw, with its size; nothing for one too big or missing
const drawn = new Map<string, { source: string; width: number; height: number } | null>()
const thumbOf = async ($: EngineInterface, path: string) => {
  if (drawn.has(path)) return drawn.get(path) ?? null
  let one: { source: string; width: number; height: number } | null = null
  try {
    const read = (await $.fs.read(path, { as: 'bytes' })) as { base64: string }
    const sized = (await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path])).stdout
    const width = Number(/pixelWidth:\s*(\d+)/.exec(sized)?.[1] ?? 0)
    const height = Number(/pixelHeight:\s*(\d+)/.exec(sized)?.[1] ?? 0)
    if (width && height && read.base64.length < 50_000) {
      one = {
        source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="data:image/jpeg;base64,${read.base64}" width="${width}" height="${height}"/></svg>`,
        width,
        height,
      }
    }
  } catch {
    one = null
  }
  // One not there yet is looked for again at the next drawing
  if (one) drawn.set(path, one)
  return one
}

// Changes what is kept beside a report, never its text
// One change at a time, each made from what is stored then, so two answers close together both stay
let marking: Promise<unknown> = Promise.resolve()
const markReport = ($: EngineInterface, r: Report, patch: Partial<Report> | ((stored: Report) => Partial<Report>)) => {
  const run = marking.then(async () => {
    const stored = { ...r, ...(JSON.parse((await readOr($, `${reportPath(r)}/meta.json`)) || '{}') as Partial<Report>) }
    await $.fs.write(`${dir}/reports/${r.id}/meta.json`, `${JSON.stringify({ ...stored, ...(typeof patch === 'function' ? patch(stored) : patch) }, null, 2)}\n`)
    await loadReports($)
  })
  marking = run.catch(() => undefined)
  return run
}

// What the chat is told of with each message: the newest reports, so a question one answers is answered from it. One put away is
// left out, and an earlier round's open items are its newest round's to ask again
const reportsTold = (all: Report[], now: number, list = all.filter(r => !r.archived), newest = newestOf(list)) => {
  const waits = (r: Report) => newest.has(r.id) && isOpenQuestion(r)
  return list.length
    ? `Results kept (what finished work left for ${who()} to read or act on), newest first (title · subject · when · its file${list.some(waits) ? ' · what in it waits on them' : ''}):\n${list
        .slice(0, REPORTS_TOLD)
        .map(r => `- ${[cut(r.title, 70), cut(r.subject, 40), `${dated(r.at, now)} (${ago(r.at, now)})`, `${reportPath(r)}/report.md`, waits(r) ? `waits on: ${openWaits(r).map(one => cut(one.text, 120)).join(' / ')}` : ''].filter(Boolean).join(' · ')}`)
        .join('\n')}`
    : ''
}

// Sends the chat a message from the panel about what the person pressed or replied there: it starts work as a message of
// theirs does, framed by the engine as the mod's and worded as the panel's, never as words the person typed
const sendForPerson = async ($: EngineInterface, text: string) => {
  sentForPerson.add(text)
  await $.prompt.submit({ text }).catch(err => log($, `message from a report not sent: ${String(err)}`))
}

// First run: the welcome at the top of the panel, and indexing old chats

// ---- First run: a welcome at the top of the panel, once, for someone the mod has never set up ----

// welcome.json in the memory folder: the session the welcome first showed in, and whether it still shows
type Welcome = { shownIn: string; isOpen: boolean }
let isWelcomeOpen = false
// Decided at a session's start: a new person (no index.md yet) gets the welcome, which stays through reloads of that session
// and is put away when the next session starts or a button on it is pressed; anyone already set up never sees it
const welcomeAt = (isNew: boolean, stored: Welcome | undefined, sessionId: string): Welcome | undefined => {
  if (isNew) return { shownIn: sessionId, isOpen: true }
  if (!stored?.isOpen) return stored
  return stored.shownIn === sessionId ? stored : { ...stored, isOpen: false }
}
const readWelcome = ($: EngineInterface) =>
  readOr($, `${dir}/welcome.json`)
    .then(text => (text ? (JSON.parse(text) as Welcome) : undefined))
    .catch(() => undefined)
const settleWelcome = async ($: EngineInterface, isNew: boolean, sessionId: string) => {
  const stored = await readWelcome($)
  const next = welcomeAt(isNew, stored, sessionId)
  if (next && JSON.stringify(next) !== JSON.stringify(stored)) await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify(next)}\n`)
  isWelcomeOpen = Boolean(next?.isOpen)
}
const closeWelcome = async ($: EngineInterface) => {
  isWelcomeOpen = false
  presses += 1
  const stored = await readWelcome($)
  await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify({ shownIn: stored?.shownIn ?? '', isOpen: false })}\n`)
  await redraw($)
}
// What the chat is sent when the person presses Index my old chats: the two onboarding steps the mod ships, then the subjects recorded
const indexAsk = (root: string) =>
  [
    'Index my old chats (pressed in the Claudopus panel).',
    `Run python3 "${root}/onboard/extract.py" "${dir}/onboard": it saves each past chat's messages under ${dir}/words and writes digests of them, one or more per project, into ${dir}/onboard.`,
    'If python3 is missing (macOS asks to install the Command Line Tools), say so with the command xcode-select --install and stop.',
    `Then for each digest file it wrote, have a helper follow ${root}/onboard/reader.md on it, writing its streams to ${dir}/onboard/streams/<the digest's file name>.`,
    'Last, record each stream found as a subject with the `update` tool (its name, folder, state and summary, and its section as the brief), and report the subjects found in a few lines.',
  ].join(' ')
const indexOldChats = async ($: EngineInterface) => {
  await closeWelcome($)
  await sendForPerson($, indexAsk($.plugin.root))
}
const welcomeCard = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="welcome" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Text bold wrap="wrap">Welcome to Claudopus</ui.Text>
    <ui.Text wrap="wrap">Each message you send in a chat goes to background work, and its card shows here while it runs.</ui.Text>
    <ui.Text wrap="wrap">Closed this panel? Type /claudopus to bring it back.</ui.Text>
    <ui.Text bold wrap="wrap">Bring in your old chats</ui.Text>
    <ui.Text wrap="wrap">Claudopus can read your past Claude Code chats on this Mac into its memory, so it knows what you were working on. It runs as background work and takes a few minutes.</ui.Text>
    <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
      <ui.Button key={`welcome-index-${presses}`} label="Index my old chats" onPress={() => void indexOldChats($).catch(err => log($, `old chats not indexed: ${String(err)}`))} />
      <ui.Button key={`welcome-later-${presses}`} label="Not now" plain dimColor onPress={() => void closeWelcome($).catch(err => log($, `welcome not put away: ${String(err)}`))} />
    </ui.Box>
  </ui.Box>
)

// The Results tab and each result's own tab: the list, a result drawn whole, put away and brought back

// Puts a line naming the report in the chat's box, for the person to finish and send; where there is no box, nothing is sent for them
const carryOn = async ($: EngineInterface, r: Report, now: number) => {
  const text = `Carry on from the result "${r.title}" (${dated(r.at, now)}), ${reportPath(r)}/report.md: `
  // What the person had typed stays: the line goes after it
  const typed = (await $.prompt.read().catch(() => ({ text: '' }))).text
  const filled = await $.prompt.fill(typed.trim() ? { text: `\n${text}`, mode: 'append' } : { text, mode: 'replace' }).catch(() => ({ isFilled: false }))
  if (!filled.isFilled) await log($, 'the chat box was not filled from a report')
}
// The person's answer to one thing a report waits on them for: Yes and No go to the chat as their message; Not now sets it aside.
// It clears that one alone
const answering = new Set<string>()
const answerWait = async ($: EngineInterface, r: Report, index: number, said: 'Yes' | 'No' | 'Not now', now: number) => {
  const wait = waitsOf(r)[index]
  // A second press before the answer is kept sends nothing more
  if (!wait || wait.answer || answering.has(`${r.id}:${index}`)) return
  answering.add(`${r.id}:${index}`)
  if (said !== 'Not now') await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "${said}" in answer to what the result "${r.title}" (${dated(r.at, now)}) waits on them for: ${wait.text}\nThe result: ${reportPath(r)}/report.md`)
  // Not now kept nowhere can be pressed again; a Yes or No already sent is not sent twice
  await markReport($, r, stored => ({ waiting: waitsOf(stored).map((one, at) => (at === index ? { ...one, answer: said } : one)) })).catch(err => {
    if (said === 'Not now') answering.delete(`${r.id}:${index}`)
    throw err
  })
}
// ---- Reports in panes of their own: the list as "Reports", and each report opened as a pane titled with its name ----

// The list's pane; a report's pane is named after the report. At most this many reports are open as panes: opening one more
// closes the one opened longest ago
const REPORTS_PANE = 'reports'
const REPORTS_TITLE = 'Results'
const REPORT_PANES = 3
// A pane's id is at most 64 letters, digits, '_' and '-': a longer one keeps its head and a mark of the whole, so two never meet
const paneOf = (r: Report) => {
  const id = `report-${r.id.replace(/[^A-Za-z0-9_-]/g, '-')}`
  return id.length <= 64 ? id : `${id.slice(0, 52)}-${mark(r.id).replace(/\D/g, '').slice(-11)}`
}
// Which picture each open report shows, by its pane
const pictureAt = new Map<string, number>()
const redraw = ($: EngineInterface) => $.ui.invalidate('ui.render')
// Opens a pane from a press, in front: the app leaves a pane already open where it is, behind another tab, so one open but not
// shown is opened again
// The tabs as the engine lists them, one word each: id, then s shown, f holding the keyboard, p drawn, for the log
const rosterOf = (panes: { id: string; isShown: boolean; isFocused: boolean; isPlaced: boolean }[]) =>
  panes.map(pane => `${pane.id}:${pane.isShown ? 's' : ''}${pane.isFocused ? 'f' : ''}${pane.isPlaced ? 'p' : ''}`).join(' ') || 'none'
const front = async ($: EngineInterface, id: string, title: string) => {
  const shown = async () => Boolean((await $.ui.panes()).find(pane => pane.id === id)?.isShown)
  // A press inside a tab gives that tab the keyboard, and the engine never shows a new tab over the one holding it: it waits on
  // the screen to honour the open's focus, which a screen with a turn running or text in the box refuses (seen every press in a
  // chat the app runs on another Mac over ssh). The tab holding the keyboard is closed and opened again first, so it lets go.
  // The new tab opens behind it before that, so the sidebar always holds a tab: with none open it slid shut and open again
  // In a chat the app runs on another Mac over ssh the engine has no surface to ask ("no-surface"): it lists the open tabs but
  // says of none that it is shown, drawn or holding the keyboard, though the app draws them and one does hold it. There every
  // other tab of the mod may be the one pressed in, so each is closed and opened again, in the order they stand. Elsewhere a
  // roster that says nothing has nothing drawn, and is left alone
  const before = await $.ui.panes()
  // A terminal has one narrow row of tabs: every press opening a tab of its own crowded it past reading, and the panel, closed and
  // opened again to let go of the keys, moved along it. There the panel stays first and one other tab is open beside it at a time
  const surfaces = await $.session.surfaces().catch(() => [])
  if (surfaces.length && surfaces.every(one => one === 'terminal')) {
    for (const pane of before) if (pane.id !== LIST && pane.id !== id) await $.ui.close({ id: pane.id }).catch(() => undefined)
    const list = before.find(pane => pane.id === LIST)
    const was = before.find(pane => pane.id === id)
    if (list?.isFocused || (was && !was.isShown)) {
      if (was) await $.ui.close({ id }).catch(() => undefined)
      if (list?.isFocused) {
        await $.ui.close({ id: LIST }).catch(() => undefined)
        await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened again: ${String(err)}`))
      }
    }
    await $.ui.open({ id, title, focus: true })
    return
  }
  const isBlind = isRunFromAfar && before.length > 0 && !before.some(pane => pane.isPlaced || pane.isShown || pane.isFocused)
  const holding = before.filter(pane => (isBlind || pane.isFocused) && pane.id !== id)
  if (isBlind) await log($, `front ${id}: the engine says no tab is shown or holding the keyboard; ${holding.length} other tabs closed and opened again first`)
  if (holding.length && !(await $.ui.panes()).some(pane => pane.id === id)) await $.ui.open({ id, title })
  for (const held of holding) {
    await $.ui.close({ id: held.id }).catch(() => undefined)
    await $.ui.open({ id: held.id, title: held.title }).catch(err => log($, `${held.id} not opened again: ${String(err)}`))
  }
  // A tab open behind another is not shown, and opening it again would leave it behind: it is closed and opened again, which
  // brings it to the front (seen in the app on a press of Results and of one result)
  const was = (await $.ui.panes()).find(pane => pane.id === id)
  if (was && !was.isShown) await $.ui.close({ id }).catch(() => undefined)
  const opened = await $.ui.open({ id, title, focus: true })
  if (isRunFromAfar) await log($, `front ${id}: ${holding.length} let go first; opened ${opened.isPlaced ? 'drawn' : `undrawn (${opened.reason})`}; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
  // The pane pressed in stays in front while its press runs: once it has run, the new pane is opened again, which brings it forward
  // Only where the surface says which pane it shows: a chat the app runs on another Mac over ssh says none is shown, ever, and there
  // this open from a timer, which no press asked for, left a tab the mod never drew in place of the one drawn (seen on the M4)
  if (!(await shown()))
    $.clock.after(150, async () => {
      const panes = await $.ui.panes()
      const mine = panes.find(pane => pane.id === id)
      // Closed by the person meanwhile, already in front, or a screen that says nothing of what it shows: left as it is
      if (!mine || mine.isShown || !panes.some(pane => pane.isShown)) return
      await $.ui.close({ id }).catch(() => undefined)
      await $.ui.open({ id, title, focus: true })
      const now = (await $.ui.panes()).find(pane => pane.id === id)
      await log($, `front ${id} again: shown ${Boolean(now?.isShown)}, drawn ${Boolean(now?.isPlaced)}`)
    })
}
// A tab of the mod's own, other than the list, that is open and not drawn was left by an open no press asked for: it is closed, so
// the person never looks at an empty tab, and a press opens it again, drawn. Run as the mod loads and as the session starts
// Only while a surface places this chat's panes (one of them is drawn): with none attached every pane waits undrawn, rightly
const closeUndrawn = async ($: EngineInterface) => {
  const panes = await $.ui.panes().catch(() => [])
  if (!panes.some(pane => pane.isPlaced)) return
  for (const pane of panes) {
    if (pane.id === LIST || pane.isPlaced) continue
    // Read again just before: a press meanwhile may have opened it afresh, drawn
    if ((await $.ui.panes().catch(() => [])).find(one => one.id === pane.id)?.isPlaced !== false) continue
    await $.ui.close({ id: pane.id }).catch(() => undefined)
    await log($, `undrawn tab ${pane.id} closed`)
  }
}
// A picture that is an SVG of the work's own is drawn as it is, when it is small enough to draw
const svgOf = async ($: EngineInterface, path: string): Promise<Thumb> => {
  const text = await readOr($, path)
  return text.includes('<svg') && text.length <= SVG_CHARS ? { source: text, width: 0, height: 0 } : null
}

const openReport = ($: EngineInterface, id: string) => {
  presses += 1
  void (async () => {
    const r = (await read($, reports)).find(one => one.id === id)
    if (!r) return
    // A report brought in by hand gets its small copies when it is first opened
    await makeThumbs($, r).catch(err => log($, `small copies of report ${id} not made: ${String(err)}`))
    const open = (await $.ui.panes()).filter(pane => pane.id.startsWith('report-') && pane.id !== paneOf(r))
    for (const pane of open.slice(0, Math.max(0, open.length - (REPORT_PANES - 1)))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    // Its tab is named after it; rounds of one piece of work, which share a name, by their time too
    const kept = await read($, reports)
    const now = await $.clock.now()
    await front($, paneOf(r), kept.some(one => one.id !== r.id && one.title === r.title) ? `${cut(r.title, 22)} · ${time(r.at, now)}` : cut(r.title, 30))
    // The pressed row gets a new name, so the app does not hold the list where that button was
    redraw($)
  })().catch(err => log($, `report ${id} not opened: ${String(err)}`))
}

// Puts a result away, or brings it back: its entry, every round of its work, leaves the list and the chat's note, nothing in it
// waits, and its open tabs close. The mark is kept beside each report; nothing is deleted or rewritten
const archiving = new Set<string>()
const archiveReport = ($: EngineInterface, r: Report, isArchived: boolean) => {
  const entry = r.agent || r.id
  if (archiving.has(entry)) return
  archiving.add(entry)
  presses += 1
  void (async () => {
    // A round already put away keeps when it was; a round that came after is put away with the rest
    const kept = (await read($, reports)).filter(one => Boolean(one.archived) !== isArchived)
    const rounds = entriesOf(kept).find(entry => entry.some(one => one.id === r.id)) ?? []
    const now = await $.clock.now()
    // Each round is marked even when another's mark fails, so the press leaves as little half done as it can
    // Brought back keeps when, so another Mac that has it put away follows the later of the two
    for (const one of rounds) await markReport($, one, isArchived ? { archived: now } : { archived: undefined, broughtBack: now }).catch(err => log($, `result ${one.id} not ${isArchived ? 'archived' : 'brought back'}: ${String(err)}`))
    // One brought back is listed in its place, even one that came after the list was opened
    if (!isArchived && reportsListed.length) reportsListed =[...new Set([...reportsListed, ...rounds.map(one => one.id)])]
    if (isArchived) {
      const tabs = new Set(rounds.map(paneOf))
      for (const pane of (await $.ui.panes()).filter(one => tabs.has(one.id))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    }
  })()
    .catch(err => log($, `result ${r.id} not ${isArchived ? 'archived' : 'brought back'}: ${String(err)}`))
    .finally(() => (archiving.delete(entry), redraw($)))
}

// The reports shown when the list was last opened from the Claudopus pane. One that arrives while the person reads the list waits,
// counted in its heading, so no row moves under the pointer
let reportsListed: string[] = []
// A subject in letters the slug drops stands alone, by its id
const subjectOf = (r: Report) => slug(r.subject || r.title) || r.id
// One entry per piece of work, its newest report first and its earlier rounds after it. Rounds of one work are: the same work
// reporting again; work started from a report (its `from`); and reports on one subject whose titles lead with that subject. A report
// brought in by hand is an entry of its own unless one of these joins it
const entriesOf = (list: Report[]) => {
  const head = new Map(list.map(r => [r.id, r.id]))
  const find = (id: string): string => {
    const up = head.get(id) ?? id
    return up === id ? id : find(up)
  }
  const join = (a: string, b: string) => {
    const [x, y] = [find(a), find(b)]
    if (x !== y) head.set(x, y)
  }
  const firsts = new Map<string, string>()
  const by = (key: string, r: Report) => (firsts.has(key) ? join(r.id, firsts.get(key) as string) : firsts.set(key, r.id))
  for (const r of list) {
    if (r.agent) by(`agent:${r.agent}`, r)
    if (r.from && head.has(r.from)) join(r.id, r.from)
    const subject = slug(r.subject)
    if (subject && (slug(r.title) === subject || slug(r.title).startsWith(`${subject}-`))) by(`subject:${subject}`, r)
  }
  return [...list.reduce((all, r) => all.set(find(r.id), [...(all.get(find(r.id)) ?? []), r]), new Map<string, Report[]>()).values()]
}
// What a report waits on now: an earlier round's open items were asked again, or not, by its newest round
const newestOf = (list: Report[]) => new Set(entriesOf(list).map(entry => entry[0]?.id))
// Words that say what a piece of work is about, for telling whether a brief that names a report goes on with that work
const aboutWords = (text: string) => new Set(slug(text).split('-').filter(word => word.length >= 4 && !['with', 'from', 'that', 'this', 'into', 'your', 'what', 'when', 'work'].includes(word)))
const openReports = async ($: EngineInterface) => {
  presses += 1
  reportsListed = (await read($, reports)).map(r => r.id)
  redraw($)
  await front($, REPORTS_PANE, REPORTS_TITLE)
}
const day = (at: number, now: number) => dated(at, now).split(',')[0] ?? ''
const time = (at: number, now: number) => (day(at, now) === day(now, now) ? (dated(at, now).split(', ')[1] ?? '') : dated(at, now))

// On the Claudopus pane the reports are one small button. It sits on the line above the cards, beside the chat's own size, so
// nothing below it moves when a report arrives
const reportsButton = ($: EngineInterface, ui: Ui, all: Report[], isKeyed = false) => {
  const { Box, Button } = ui
  const list = all.filter(r => !r.archived)
  if (!list.length) return null
  return (
    <Box key="reports-button" flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <Button key={`reports-open-${presses}`} label={`Results ${entriesOf(list).length}`} hotkey={isKeyed ? 'r' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} />
    </Box>
  )
}

// The list, one line a row: the title, when, and Archive at its right, a mark while it waits on the person. First what waits on
// the person, then the few newest, then the rest folded into one row, "Earlier N", and those put away into "Archived N". Rounds of
// one work are one row, its newest; the earlier rounds are listed inside its tab
const RECENT = 5
let isEarlierOpen = false
let isArchivedOpen = false
// When, as short as it fits its place: the time today, the day this year, the year before that
const when = (at: number, now: number) => (day(at, now) === day(now, now) ? time(at, now) : new Date(at).getFullYear() === new Date(now).getFullYear() ? day(at, now) : String(new Date(at).getFullYear()))
const reportsView = ($: EngineInterface, ui: Ui, all: Report[], now: number, line: number) => {
  const { Box, Button, Text } = ui
  const list = all.filter(r => !r.archived)
  const gone = entriesOf(all.filter(r => r.archived))
  // A new round of an entry already listed shows in its place; a new entry waits
  const shown = reportsListed.length ? entriesOf(list).filter(entry => entry.some(r => reportsListed.includes(r.id))).flat() : list
  const entries = entriesOf(shown)
  const fresh = entriesOf(list).length - entries.length
  const waiting = entries.filter(entry => isOpenQuestion(entry[0] as Report))
  const rest = entries.filter(entry => !isOpenQuestion(entry[0] as Report))
  const [recent, earlier] = [rest.slice(0, RECENT), rest.slice(RECENT)]
  const fold = (key: string, label: string, isOpen: boolean, onPress: () => void) => (
    <Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" alignItems="flex-start" flexShrink={0}>
      {/* In the rows' title column */}
      <Box width={1} flexShrink={0} />
      <Button key={`${key}-${presses}`} label={`${isOpen ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => void ((presses += 1), onPress(), redraw($))} />
    </Box>
  )
  // One row, one line: the title pressed opens it; when and Archive sit at the right, the same width on every row
  let rowNo = 0
  const row = (entry: Report[]) => {
    const r = entry[0]
    if (!r) return null
    // In the terminal the first nine rows are numbered, and the number opens the result
    rowNo += 1
    const digit = 'isTerminal' in ui && rowNo <= 9 ? String(rowNo) : undefined
    return (
      <Box key={`entry-${r.id}`} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
        <Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} flexShrink={1} minWidth={0}>
          {/* In the column the folded rows' labels start in */}
          <Box width={1} flexShrink={0} />
          <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
            <Button key={`report-${r.id}-${presses}`} label={cut(r.title, line - (digit ? 25 : 22))} plain hotkey={digit} onPress={() => openReport($, r.id)} />
          </Box>
        </Box>
        <Box width={6} flexShrink={0} justifyContent="flex-end">
          <Text dimColor>{when(r.at, now)}</Text>
        </Box>
        <Button key={`archive-${r.id}-${presses}`} label="Archive" plain dimColor onPress={() => archiveReport($, r, true)} />
      </Box>
    )
  }
  const rows = (group: Report[][]) => (
    <Box flexDirection="column" flexShrink={0}>
      {group.map(row)}
    </Box>
  )
  return (
    <Box key="reports" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="reports-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" alignItems="center" gap={1}>
          <Text bold>Results</Text>
          <Text dimColor>{`${entries.length}`}</Text>
        </Box>
        {fresh ? <Button key={`reports-fresh-${presses}`} label={`Show ${fresh} new`} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
      </Box>
      {!shown.length && !gone.length ? <Text dimColor>Nothing yet.</Text> : null}
      {waiting.length ? band(ui, 'reports-waiting', 'Waiting on you', `${waiting.length}`, rows(waiting)) : null}
      {recent.length ? band(ui, 'reports-recent', waiting.length ? 'Recent' : 'Newest', '', rows(recent)) : null}
      {earlier.length || gone.length ? (
        <Box key="reports-folded" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
          {earlier.length ? fold('earlier-fold', `Earlier ${earlier.length}`, isEarlierOpen, () => (isEarlierOpen = !isEarlierOpen)) : null}
          {earlier.length && isEarlierOpen ? rows(earlier) : null}
          {gone.length ? fold('archived-fold', `Archived ${gone.length}`, isArchivedOpen, () => (isArchivedOpen = !isArchivedOpen)) : null}
          {gone.length && isArchivedOpen
            ? gone.map(entry => {
                const r = entry[0]
                if (!r) return null
                return (
                  <Box key={`archived-${r.id}`} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
                    <Box flexDirection="row" gap={1} flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
                      <Box width={1} flexShrink={0} />
                      <Button key={`report-${r.id}-${presses}`} label={cut(r.title, line - 24)} plain dimColor onPress={() => openReport($, r.id)} />
                    </Box>
                    <Box width={6} flexShrink={0} justifyContent="flex-end">
                      <Text dimColor>{when(r.at, now)}</Text>
                    </Box>
                    <Button key={`unarchive-${r.id}-${presses}`} label="Bring back" plain onPress={() => archiveReport($, r, false)} />
                  </Box>
                )
              })
            : null}
        </Box>
      ) : null}
    </Box>
  )
}

// A report opened in its own pane: what it is and when; the question it waits on, with its answers; what it found; its pictures,
// with the one press that opens them all; the report itself; then how to carry on from it, and the other rounds of its work
type Thumb = { source: string; width: number; height: number } | null
const reportShown = ($: EngineInterface, ui: Ui, r: Report, text: string, list: Report[], now: number, at: number, thumb: Thumb) => {
  const { Box, Button, Markdown, Text } = ui
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  // The other rounds of its work first, as the list shows them as one row; then what it started from or started, and the subject's others
  const rounds = (entriesOf(list.filter(one => Boolean(one.archived) === Boolean(r.archived))).find(entry => entry.some(one => one.id === r.id)) ?? []).filter(one => one.id !== r.id)
  const others = list.filter(one => one.id !== r.id && !rounds.includes(one) && (one.id === r.from || one.from === r.id || subjectOf(one) === subjectOf(r)))
  const kin = [...rounds, ...others.slice(0, Math.max(0, 8 - rounds.length))]
  const pictures = r.files.map(file => ({ file, path: `${reportPath(r)}/${file}`, href: `file://${encodeURI(`${reportPath(r)}/${file}`)}` }))
  const how = (one: Report) =>
    [one.id === r.from ? 'this started from it' : one.from === r.id ? 'started from this' : rounds.includes(one) ? (one.at < r.at ? 'earlier round' : 'later round') : '', one.archived ? 'archived' : ''].filter(Boolean).join(' · ')
  const pane = paneOf(r)
  const show = (to: number) => void ((presses += 1), pictureAt.set(pane, to), redraw($))
  return (
    <Box key={`report-${r.id}`} flexDirection="column" gap={1} flexGrow={1}>
      {/* Archive at the head's right: pressed, the tab closes; one archived says so, with Bring back */}
      <Box key="report-head" flexDirection="row" alignItems="flex-start" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold wrap="wrap">{r.title}</Text>
          <Text dimColor wrap="wrap">{[dated(r.at, now), r.subject && slug(r.subject) !== slug(r.title) ? r.subject : '', r.archived ? 'archived' : answeredOf(r)].filter(Boolean).join(' · ')}</Text>
        </Box>
        <Button key={`report-archive-${presses}`} label={r.archived ? 'Bring back' : 'Archive'} onPress={() => archiveReport($, r, !r.archived)} />
      </Box>
      {isOpenQuestion(r)
        ? band(
            ui,
            'report-ask',
            'Waiting on you',
            openWaits(r).length > 1 ? `${openWaits(r).length}` : '',
            // Each thing it waits on with its own answers; one answered leaves the others
            <Box flexDirection="column" gap={2}>
              {waitsOf(r).map((wait, index) =>
                wait.answer ? null : (
                  <Box key={`report-wait-${index}`} flexDirection="column" gap={1}>
                    <Text wrap="wrap">{wait.text}</Text>
                    <Box flexDirection="row" flexWrap="wrap" gap={1}>
                      {(['Yes', 'No', 'Not now'] as const).map(said => (
                        <Button key={`report-say-${index}-${said}-${presses}`} label={said} onPress={() => void ((presses += 1), answerWait($, r, index, said, now).catch(err => log($, `answer not kept: ${String(err)}`)))} />
                      ))}
                    </Box>
                  </Box>
                ),
              )}
            </Box>,
          )
        : null}
      {r.gist
        ? band(
            ui,
            'report-finding',
            'Finding',
            '',
            <Text wrap="wrap">{r.gist}</Text>,
          )
        : null}
      {pictures.length
        ? band(
            ui,
            'report-pictures',
            'Pictures',
            'isTerminal' in ui ? `${pictures.length}` : pictures.length > 1 ? `${at + 1} of ${pictures.length}` : '',
            'isTerminal' in ui ? (
              // The terminal draws no picture: each is a row, numbered, whose press opens it where the person is
              <Box flexDirection="column">
                {pictures.map((one, n) => (
                  <Box key={`report-pic-${n}`} flexDirection="column">
                    <Button key={`report-pic-open-${n}`} label={one.file} plain hotkey={n < 9 ? String(n + 1) : undefined} onPress={press => void showPicture($, one.path, '', '', press.surface)} />
                    {pictureSaidRow($, ui, `report-pic-said-${n}`, one.path)}
                  </Box>
                ))}
                <Text dimColor wrap="wrap">{termFrom ? 'A press sends the picture to the device you are at' : 'A press opens the picture'}</Text>
              </Box>
            ) : (
            <Box flexDirection="column" gap={1}>
              {thumb && table.Svg ? <table.Svg key={`report-picture-${r.id}-${at}`} source={thumb.source} alt={pictures[at]?.file ?? 'Picture'} /> : null}
              {/* Shown here, never handed to another app: that would take the person out of Claude and switch their desktop. Where the
                  picture cannot be drawn, its path is given as text */}
              <Text dimColor wrap="wrap">{thumb && table.Svg ? (pictures[at]?.file ?? '') : (pictures[at]?.path ?? '')}</Text>
              {pictures.length > 1 ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="center" gap={1}>
                  <Button key={`report-prev-${presses}`} label="‹ Previous" onPress={() => show((at + pictures.length - 1) % pictures.length)} />
                  <Button key={`report-next-${presses}`} label="Next ›" onPress={() => show((at + 1) % pictures.length)} />
                </Box>
              ) : null}
            </Box>
            ),
          )
        : null}
      {band(
        ui,
        'report-text',
        'In full',
        '',
        // A link it names never leaves the app: one of its pictures is shown above, anything else stays as text
        <Markdown
            key={`report-text-${r.id}`}
            text={text.length > REPORT_CHARS ? `${text.slice(0, REPORT_CHARS)}\n\n…` : text}
            onLinkPress={link => {
              const to = pictures.findIndex(one => link.href.endsWith(`/${fileName(one.file)}`) || link.href === one.path)
              if (to >= 0) show(to)
            }}
          />,
      )}
      {band(
        ui,
        'report-carry',
        'Carry on',
        '',
        <Box flexDirection="column" alignItems="flex-start" gap={1}>
          <Text dimColor wrap="wrap">Puts a line naming this result in the chat's box, for you to finish and send.</Text>
          <Button key={`report-carry-${presses}`} label="Carry on from this" onPress={() => void ((presses += 1), redraw($), carryOn($, r, now))} />
          {kin.length ? (
            <Box flexDirection="column" alignItems="flex-start">
              {kin.map(one => (
                <Button key={`report-kin-${one.id}-${presses}`} label={[dated(one.at, now), one.title, how(one)].filter(Boolean).join(' · ')} plain dimColor onPress={() => openReport($, one.id)} />
              ))}
            </Box>
          ) : null}
        </Box>,
      )}
    </Box>
  )
}

// Memory files in tabs of the mod's own, links to them in the chat's replies, and the Memory button

// ---- Memory files in tabs of the mod's own: the app's file pane opens only the session's folders, and it never lets ~/.claude
// in (the app's list of protected places), so a memory path in a reply is the mod's link to answer ----

const MEMORY_PANE = 'memory-'
const MEMORY_PANES = 3
// What a memory path is in a reply: the folder spelled in full or from ~, up to a space, a quote, a bracket, a backtick or markup
const memoryPathIn = () => new RegExp(`(?:${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|~/\\.claude/claudopus)/[^\\s\`()\\[\\]<>"'*|~]+`, 'g')
const memoryHref = (path: string) => `file://${encodeURI(path.replace(/^~\/\.claude\/claudopus/, dir))}`
// A reply's memory paths made links of the mod's: a link to one, a code span that is one path and a bare path. Other code stays as
// it is, a fence still open to the end too
const memoryLinked = (text: string) => {
  const hrefs: string[] = []
  // A path's line and column (a.md:12) are not the file's
  const at = (path: string) => {
    const href = memoryHref(path.replace(/(?::\d+){1,2}$/, ''))
    if (!hrefs.includes(href) && href.length <= 2048) hrefs.push(href)
    return href
  }
  const path = memoryPathIn().source
  const whole = new RegExp(`^${path}$`)
  const one = new RegExp(`\\[([^\\]]*)\\]\\((${path})\\)|(^|[^\\w/(\\[])(${path})`, 'g')
  const linked = text
    .split(/(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`[^`\n]*`)/)
    .map((part, i) => {
      if (i % 2) return part.length > 2 && part.startsWith('`') && !part.startsWith('``') && whole.test(part.slice(1, -1)) ? `[${part}](${at(part.slice(1, -1))})` : part
      return part.replace(one, (all, label: string | undefined, linkTo: string | undefined, lead: string | undefined, bare: string | undefined) => {
        if (linkTo) return `[${label}](${at(linkTo)})`
        if (!bare) return all
        // A sentence's last mark is not the path's
        const tail = bare.match(/[.,;:!?_]+$/)?.[0] ?? ''
        const clean = bare.slice(0, bare.length - tail.length)
        return `${lead}[${clean}](${at(clean)})${tail}`
      })
    })
    .join('')
  return { text: linked, hrefs }
}
// Which memory file a pressed link is, or '' for any other link
const memoryPressed = (href: string) => {
  let path = href.replace(/^file:\/\//, '')
  try {
    path = decodeURI(path)
  } catch {}
  path = path.replace(/^~\/\.claude\/claudopus/, dir)
  return dir && path.startsWith(`${dir}/`) && !path.split('/').includes('..') ? path : ''
}
const memoryPaneOf = (path: string) => {
  // Two paths that spell alike once cleaned are told apart by a mark of the whole path
  const id = `${MEMORY_PANE}${path.slice(dir.length + 1).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 44)}`
  return `${id}-${mark(path).replace(/\D/g, '').slice(-12)}`
}
// The file each memory tab shows, by its tab, and what it held when it was opened
const memoryPanes = new Map<string, string>()
const memoryText = new Map<string, string>()
// What a memory path holds: a file's text, or a folder's entries as links; '' when it is not there
const memoryRead = async ($: EngineInterface, path: string) => {
  const text = await $.fs.read(path).catch(() => undefined)
  if (text !== undefined) return text
  const entries = await $.fs.list(path).catch(() => [])
  return entries.length ? `# ${fileName(path)}\n\n${entries.map(one => `- [${one.name}](${memoryHref(`${path}/${one.name}`)})`).join('\n')}\n` : ''
}
// A memory link pressed: a result's own path opens that result's tab, any other file a tab of its own, named after its heading
const openMemory = ($: EngineInterface, path: string) => {
  presses += 1
  void (async () => {
    const report = path.slice(dir.length + 1).match(/^reports\/([^/]+)/)?.[1]
    if (report && (await read($, reports)).some(one => one.id === report)) return openReport($, report)
    const id = memoryPaneOf(path)
    const text = await memoryRead($, path)
    memoryPanes.set(id, path)
    memoryText.set(id, text)
    const open = (await $.ui.panes()).filter(pane => pane.id.startsWith(MEMORY_PANE) && pane.id !== id)
    for (const pane of open.slice(0, Math.max(0, open.length - (MEMORY_PANES - 1)))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim()
    // The memory folder itself is named Memory, as its button; else its heading would read 'claudopus' beside the panel's tab
    await front($, id, path === dir ? 'Memory' : cut(heading || fileName(path), 30))
    redraw($)
  })().catch(err => log($, `memory file ${path} not opened: ${String(err)}`))
}

// Memory: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
// A terminal, or a chat run over ssh, has no Finder the person can see: there the folder opens as a tab of the panel, each file a link
const showMemory = async ($: EngineInterface, surface: RenderSurface) => {
  if (isRunFromAfar || surface === 'terminal') return openMemory($, dir)
  const opened = await $.process.run(['open', dir]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (opened.exitCode !== 0) await log($, `memory folder not opened: ${opened.stderr}`)
}
const memoryButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="memory-button" flexShrink={0}>
    <ui.Button key={`memory-open-${presses}`} label="Memory" hotkey={isKeyed ? 'm' : undefined} plain={isKeyed ? true : undefined} onPress={press => void showMemory($, press.surface).catch(err => log($, `memory folder not opened: ${String(err)}`))} />
  </ui.Box>
)

const memoryHooks = (on: On) => {

  // A reply that names a memory file: its links to memory open the mod's tab, since the app's file pane refuses ~/.claude. The
  // terminal opens such a path itself, so it keeps its own drawing
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface === 'terminal' || !dir || e.props.isSummary || !memoryPathIn().test(e.props.text)) return next(e)
    const { text, hrefs } = memoryLinked(e.props.text)
    if (!hrefs.length) return next(e)
    const { Markdown } = uiOf($, e)
    return (
      <Markdown
        key={`memory-reply-${mark(e.requestId)}`}
        text={text}
        pressableLinks={hrefs.slice(0, 256)}
        onLinkPress={link => {
          const path = memoryPressed(link.href)
          if (path) openMemory($, path)
        }}
      />
    )
  })

  // A memory file opened as a tab of its own; the links in it to other memory files open there too
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith(MEMORY_PANE)) return next(e)
    const { Box, Button, Markdown, Text } = uiOf($, e)
    const path = memoryPanes.get(e.requestId)
    if (!path) return <Text dimColor>Press the link in the chat again to open this file.</Text>
    const held = memoryText.get(e.requestId) ?? ''
    const { text, hrefs } = memoryLinked(held.length > REPORT_CHARS ? `${held.slice(0, REPORT_CHARS)}\n\n…` : held)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        <Text dimColor wrap="wrap">{path}</Text>
        {held && e.surface === 'terminal' ? (
          // The terminal writes each link's whole address beside its words, and the keys cannot reach a link: there the words stand
          // alone and each file linked is a button under the text, which Tab reaches
          <Box key="memory-terminal" flexDirection="column" gap={1}>
            {/^# [^\n]*\n\n(- \[[^\]]*\]\([^)]*\)\n?)+$/.test(held.trim() + '\n') ? null : <Markdown key={`memory-text-${e.requestId}`} text={text.replace(/\[([^\]]*)\]\((?:file:\/\/)?[^)]*\)/g, '$1')} />}
            {(() => {
              // Every memory file the text names, by a link of its own or by its path, once each
              const named = [...new Set([...[...held.matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1] ?? ''), ...hrefs].map(href => memoryPressed(href)).filter(Boolean))].slice(0, 200)
              return named.length ? (
                <Box key="memory-links" flexDirection="column">
                  {named.map(to => <Button key={`memory-link-${to}`} label={to.slice(dir.length + 1)} plain onPress={() => openMemory($, to)} />)}
                </Box>
              ) : null
            })()}
          </Box>
        ) : held ? (
          <Markdown
            key={`memory-text-${e.requestId}`}
            text={text}
            pressableLinks={hrefs.slice(0, 256)}
            onLinkPress={link => {
              const to = memoryPressed(link.href)
              if (to) openMemory($, to)
            }}
          />
        ) : (
          <Text dimColor>This file is not there any more.</Text>
        )}
      </Box>
    )
  })

}

// Stats: reading Claude's records for the Stats tab (the sums and drawing are in ../../mods/claudopus/hooks/stats.tsx)

// ---- Stats: reading Claude's records (the sums and drawing are in ./stats) ----

let jqPath = ''
async function sumOf($: EngineInterface, path: string): Promise<FileSum> {
  for (const jq of jqPath ? [jqPath] : ['/usr/bin/jq', '/opt/homebrew/bin/jq', '/usr/local/bin/jq', 'jq']) {
    const r = await $.process.run([jq, '-cnR', '--argjson', 'gap', String(GAP), SUM_JQ, path]).catch(() => undefined)
    if (!r || r.exitCode !== 0) continue
    jqPath = jq
    return parsed<FileSum>(r.stdout.trim(), { s: [], u: [], d: [] })
  }
  throw new Error('jq')
}
// Where a chat's records are: its own folder under ~/.claude/projects, found by its id
async function chatFolderOf($: EngineInterface, home: string, chatId: string, known?: string) {
  if (known && (await $.fs.stat(`${known}/${chatId}.jsonl`).catch(() => undefined))) return known
  const root = `${home}/.claude/projects`
  for (const entry of await $.fs.list(root).catch(() => [])) {
    if (entry.kind !== 'dir') continue
    if (await $.fs.stat(`${root}/${entry.name}/${chatId}.jsonl`).catch(() => undefined)) return `${root}/${entry.name}`
  }
  return ''
}
// Every transcript of one chat, summed, with what each was
async function runsOf($: EngineInterface, home: string, memory: string, chatId: string, hint = ''): Promise<Run[]> {
  const cachePath = `${memory}/stats/${chatId}.json`
  const read = parsed<Cache>(await readOr($, cachePath), { files: {} })
  // Sums made by an earlier program are made again
  const cache: Cache = read.v === CACHE_V ? read : { files: {} }
  const folder = await chatFolderOf($, home, chatId, hint || cache.folder)
  if (!folder) return []
  const subs = `${folder}/${chatId}/subagents`
  const flowDirs = (await $.fs.list(`${subs}/workflows`).catch(() => [])).filter(e => e.kind === 'dir').map(e => e.name)
  const listed = [
    ...(await $.fs.list(subs).catch(() => [])).map(e => ({ ...e, dir: subs, flow: '' })),
    ...(await Promise.all(flowDirs.map(async name => (await $.fs.list(`${subs}/workflows/${name}`).catch(() => [])).map(e => ({ ...e, dir: `${subs}/workflows/${name}`, flow: name }))))).flat(),
  ].filter(e => /^agent-\w+\.jsonl$/.test(e.name))
  const chatFile = (await $.fs.list(folder).catch(() => [])).find(e => e.name === `${chatId}.jsonl`)
  const files = [...listed.map(e => ({ path: `${e.dir}/${e.name}`, size: e.size, mtime: e.mtimeMs, flow: e.flow, id: e.name.slice(6, -6) })), ...(chatFile ? [{ path: `${folder}/${chatFile.name}`, size: chatFile.size, mtime: chatFile.mtimeMs, flow: '', id: '' }] : [])]
  const next: Cache = { v: CACHE_V, folder, files: {} }
  let isChanged = folder !== cache.folder
  // A few at a time: each is a process
  for (let at = 0; at < files.length; at += 6)
    await Promise.all(
      files.slice(at, at + 6).map(async f => {
        const was = cache.files[f.path]
        if (was && was.size === f.size && was.mtime === f.mtime) next.files[f.path] = was
        else {
          next.files[f.path] = { size: f.size, mtime: f.mtime, sum: await sumOf($, f.path) }
          isChanged = true
        }
      }),
    )
  if (isChanged || Object.keys(cache.files).length !== files.length) await $.fs.write(`${memory}/stats/${chatId}.json`, JSON.stringify(next)).catch(() => undefined)
  const flowTitle = new Map<string, string>()
  for (const name of flowDirs) flowTitle.set(name, parsed<{ title?: string; name?: string }>(await readOr($, `${memory}/flows/${name}.json`), {}).title || 'Workflow')
  return Promise.all(
    files.map(async (f): Promise<Run> => {
      const sum = next.files[f.path]?.sum ?? { s: [], u: [], d: [] }
      if (!f.id) return { id: chatId, kind: 'chat', parent: '', title: 'This chat', isFinished: false, sum }
      const meta = parsed<Meta>(await readOr($, f.path.replace(/\.jsonl$/, '.meta.json')), {})
      if (f.flow) return { id: f.id, kind: 'flow', parent: f.flow, title: flowTitle.get(f.flow) ?? 'Workflow', isFinished: Boolean(meta.finished) || (sum.s.at(-1)?.[1] ?? 0) < Date.now() - GAP, sum }
      return { id: f.id, kind: (meta.spawnDepth ?? 1) > 1 ? 'helper' : 'work', parent: meta.parentAgentId ?? '', title: meta.description ?? 'Background work', isFinished: Boolean(meta.finished), sum }
    }),
  )
}
// The chats the mod has kept work for (finished/<chat id>.json), and this one
async function chatsKept($: EngineInterface, memory: string, chatId: string) {
  const kept = (await $.fs.list(`${memory}/finished`).catch(() => [])).map(e => /^(.+)\.json$/.exec(e.name)?.[1] ?? '').filter(Boolean)
  return [...new Set([chatId, ...kept])]
}

async function loadStats($: EngineInterface, scope: Scope, home: string, memory: string, chatId: string, hint: string, now: number) {
  if (reading.has(scope) || !chatId) return
  const was = held.get(scope)
  if (was && now - was.at < READ_EVERY) return
  reading.add(scope)
  try {
    await loadMemorySizes($, memory).catch(() => undefined)
    const ids = scope === 'chat' ? [chatId] : await chatsKept($, memory, chatId)
    const runs = (await Promise.all(ids.map(id => runsOf($, home, memory, id, id === chatId ? hint : '')))).flat()
    held.set(scope, { runs, at: now })
  } catch (err) {
    held.set(scope, { runs: was?.runs ?? [], at: now, error: String(err).includes('jq') ? 'Stats reads Claude’s records with jq, and jq was not found on this Mac.' : `The records could not be read: ${String(err)}` })
  } finally {
    reading.delete(scope)
    $.ui.invalidate('ui.render')
  }
}
async function loadMemorySizes($: EngineInterface, memory: string) {
  const names = async (folder: string) => (await $.fs.list(`${memory}/${folder}`).catch(() => [])).filter(e => !e.name.startsWith('.'))
  // Sizes as the disk counts them, the whole of each folder
  const du = await $.process.run(['du', '-skL', ...['index.md', 'streams', 'words', 'asks', 'reports', 'finished', 'flows', 'stats', 'thumbs'].map(one => `${memory}/${one}`)]).catch(() => undefined)
  const kb = new Map((du?.stdout ?? '').split('\n').map(row => row.split('\t')).filter(([n, path]) => n && path).map(([n, path]) => [String(path).slice(memory.length + 1), Number(n) * 1024]))
  const index = await $.fs.read(`${memory}/index.md`).catch(() => '')
  const subjects = index.split('\n').filter(row => row.startsWith('- ')).length
  const reports = await names('reports')
  const parts: MemoryPart[] = [
    { name: 'Subjects', count: subjects, bytes: kb.get('index.md') ?? 0 },
    { name: 'Briefs', count: (await names('streams')).length, bytes: kb.get('streams') ?? 0 },
    { name: 'Your words, by chat', count: (await names('words')).length, bytes: kb.get('words') ?? 0 },
    { name: 'Asks and answers, by chat', count: (await names('asks')).length, bytes: kb.get('asks') ?? 0 },
    { name: 'Results', count: reports.filter(e => e.kind === 'dir').length, bytes: kb.get('reports') ?? 0 },
    { name: 'Finished work, by chat', count: (await names('finished')).length, bytes: kb.get('finished') ?? 0 },
    { name: 'Workflow runs', count: (await names('flows')).length, bytes: kb.get('flows') ?? 0 },
    { name: 'Thumbnails and sums', count: (await names('thumbs')).length + (await names('stats')).length, bytes: (kb.get('thumbs') ?? 0) + (kb.get('stats') ?? 0) },
  ]
  const bytes = [...kb.values()].reduce((sum, n) => sum + n, 0)
  memoryHeld.now = { parts, bytes }
}

// Stats: what the work added up to, in a tab of its own, opened in front like Results
const STATS_PANE = 'stats'
const STATS_TITLE = 'Stats'
const statsRead = async ($: EngineInterface, scope: 'chat' | 'all') => {
  const home = (await $.env.get('HOME')) ?? ''
  const { id } = await read($, me)
  await loadStats($, scope, home, dir, id, `${home}/.claude/projects/${cwd.replace(/[^a-zA-Z0-9]/g, '-')}`, await $.clock.now())
}
const openStats = async ($: EngineInterface) => {
  presses += 1
  void statsRead($, statsShown.scope).catch(err => log($, `stats not read: ${String(err)}`))
  await front($, STATS_PANE, STATS_TITLE)
}
const statsButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="stats-button" flexShrink={0}>
    <ui.Button key={`stats-open-${presses}`} label="Stats" hotkey={isKeyed ? 's' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openStats($).catch(err => log($, `stats not opened: ${String(err)}`))} />
  </ui.Box>
)

// The About tab: what Claudopus is, its version and the app's, the site and the code

// About: what Claudopus is, its version and the app's, the site, the code and its licence
const ABOUT_PANE = 'about'
const ABOUT_TITLE = 'About'
const SITE = 'https://claudopus.ai'
const REPO = 'https://github.com/dimka3553/claudopus'
// Each opening of About is a new drawing of the octopus, so it waves once each time and then rests
let aboutOpens = 0
const openAbout = async ($: EngineInterface) => {
  presses += 1
  aboutOpens += 1
  await front($, ABOUT_PANE, ABOUT_TITLE)
}
const aboutButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="about-button" flexShrink={0}>
    <ui.Button key={`about-open-${presses}`} label="About" hotkey={isKeyed ? 'a' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openAbout($).catch(err => log($, `about not opened: ${String(err)}`))} />
  </ui.Box>
)
// The version this chat loaded, read once from its own copy, so a chat on an older copy shows its own number; and a newer one the
// Mac updated itself to while this chat runs the one it loaded
let loadedVersion: Promise<string> | undefined
const versionsOf = async ($: EngineInterface) => {
  loadedVersion ??= readOr($, `${$.plugin.root}/.claude-plugin/plugin.json`).then(manifest => {
    try {
      return String(JSON.parse(manifest).version ?? '')
    } catch {
      return ''
    }
  })
  const version = await loadedVersion
  // A read that failed is tried again on the next drawing
  if (!version) loadedVersion = undefined
  // The Mac's installed version is Claude Code's own record, read each time: update.json says only what the last look found
  const installed = await installedNow($).catch(() => '')
  return { version, installed, isWaiting: Boolean(version && installed && isNewer(installed, version)) }
}
const aboutView = async ($: EngineInterface, ui: Ui, surface?: string) => {
  const { Box, Link, Text } = ui
  const app = await (async () => (await $.session.version()).version)().catch(() => '')
  const { version, installed, isWaiting } = await versionsOf($)
  const line = (key: string, name: string, body: JSX.Element) => (
    <Box key={key} flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
      <Box width={9} flexShrink={0}>
        <Text dimColor>{name}</Text>
      </Box>
      <Box flexGrow={1} flexShrink={1} minWidth={0}>
        {body}
      </Box>
    </Box>
  )
  return (
    <Box key="about" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="about-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, `about-mark-${aboutOpens}`, 'wave', HEAD_MARK, 'Claudopus waving', $, { surface, requestId: ABOUT_PANE })}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold>Claudopus</Text>
          <Text dimColor wrap="wrap">{[version ? `Version ${version}` : '', isWaiting ? `${installed} is installed, new chats use it` : '', app ? `Claude Code ${app}` : ''].filter(Boolean).join(' · ') || 'A mod for Claude Code'}</Text>
        </Box>
      </Box>
      {band(
        ui,
        'about-what',
        'What it does',
        '',
        <Box flexDirection="column" gap={1}>
          <Text wrap="wrap">Every chat hands each of your messages to an agent that works in the background, so the chat stays small and free to talk.</Text>
          <Text wrap="wrap">This panel shows each piece of work as a card with its to-dos. What finished work leaves is kept under Results.</Text>
          <Text wrap="wrap">Your words, the subjects you work on and every result are kept as plain files under Memory. Stats adds up what the work cost and the time it saved.</Text>
        </Box>,
      )}
      {band(
        ui,
        'about-links',
        'Links',
        '',
        <Box flexDirection="column" gap={1}>
          {line('about-changes', 'Changes', <ui.Button key={`about-changelog-${presses}`} label="Changelog" plain onPress={() => void openChangelog($).catch(err => log($, `changelog not opened: ${String(err)}`))} />)}
          {line('about-site', 'Website', <Text><Link href={SITE} label="claudopus.ai" /></Text>)}
          {line(
            'about-repo',
            'GitHub',
            <Box flexDirection="column">
              <Text><Link href={REPO} label="dimka3553/claudopus" /></Text>
              <Text dimColor wrap="wrap">If Claudopus helps you, a star on GitHub helps others find it.</Text>
            </Box>,
          )}
          {line('about-licence', 'Licence', <Text><Link href={`${REPO}/blob/main/LICENSE`} label="MIT" /></Text>)}
        </Box>,
      )}
    </Box>
  )
}

// The header's art: the octopus at rest, working, happy and asking, and the dots of a card's state

// The height of one line of the app's text, in its pixels: a mark drawn this tall with its shape in the middle sits on the first line of the text beside it
const LINE = 20
// Three dots that pulse while work runs, for a surface that can draw them
const dots = (color: string, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="${height}" viewBox="0 0 22 ${height}">${[0, 1, 2]
    .map(
      i =>
        `<circle cx="${3 + i * 8}" cy="${height / 2}" r="2.5" fill="${color}"><animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')}</svg>`
// Claudopus purple, the colour of work that is under way: Claude is orange, its opposite purple
const LIVE = '#8A63F0'
// Work that needs the person's hands now: its card's bar and its ask
const NEEDS = '#E5A50A'
const LIVE_DOTS = dots(LIVE, LINE)
// The mark of work that finished
const DONE = 'success'
// The octopus: resting, working at its computers (drawn from 32 px up), and lifting its arms (for 16 to 24 px). Each is an SVG
// file of the mod's, art/<name>.svg, read when the session starts: a drawing is swapped by replacing its file. Happy is the
// octopus in the finished green, bouncing with its arms up once over the two seconds finished work pauses, then still
// Asking is the wave in the amber of work that needs the person: it waves once as something starts to wait, then rests amber
// Updated is the happy octopus in the workflow blue, jumping through the moment a chat moves to a newer version
const ART = { mark: '', working: '', workingSmall: '', happy: '', happySmall: '', wave: '', asking: '', updated: '' }
const ART_FILES: Record<Exclude<keyof typeof ART, 'asking' | 'updated'>, string> = { mark: 'mark.svg', working: 'working.svg', workingSmall: 'working-small.svg', happy: 'happy.svg', happySmall: 'happy-small.svg', wave: 'wave.svg' }
// Whether the octopus is happy at a time: work of this chat's that finished, not stopped or failed, is in its pause. A new drawing
// starts its animation, so it plays from the first finish and holds its last picture through any finish that follows in the pause
const isHappy = (cards: { id: string; parentId?: string; status: string; endedAt: number }[], at: number) =>
  cards.some(one => !one.parentId && one.status === 'done' && isLingering(one, at))
// How big the octopus is drawn in the panel's header and in the line above the prompt, in the app's pixels
const HEAD_MARK = 48
const BAND_MARK = 16
// The app draws an Svg as a picture and keeps a picture it drew before, animation and all: the same drawing shown again starts
// where its last showing ended, at rest, so a second finish would stay still. Each time a place turns to a drawing, that drawing
// is marked with the moment and so is new to the app, and plays from its start; it keeps that mark while it stays, so a redraw
// does not restart it; a happy octopus not drawn for a while, as in a closed panel, starts a new moment. The mark holds this run's own
// letters, so a drawing of another chat's panel is never the same either
const moments = new Map<string, { art: keyof typeof ART; mark: string; at: number }>()
const MOMENT_GAP = 5000
// The happy drawings last only a finish's short pause, so one drawn again after a gap is a new finish and plays anew; the wave
// rests on its last picture for as long as something waits, and plays again only when the octopus turns to it anew
const ONCE = new Set<keyof typeof ART>(['happy', 'happySmall', 'updated'])
const RUN_MARK = Math.random().toString(36).slice(2, 8)
let momentCount = 0
const momentOf = (key: string, art: keyof typeof ART) => {
  const was = moments.get(key)
  const at = Date.now()
  // The update screen stays until it is closed: its octopus jumps once as it opens and rests, its drawing kept, so a redraw never
  // makes a new picture of it (a press over ssh on a panel whose drawings changed reached nothing)
  if (was?.art === art && (at - was.at < MOMENT_GAP || !ONCE.has(art) || key === 'update-mark')) return (was.at = at), was.mark
  momentCount += 1
  const mark = `${RUN_MARK}-${momentCount}`
  // Each opening of About is a place of its own; the openings before it are gone
  if (key.startsWith('about-mark-')) for (const one of moments.keys()) if (one.startsWith('about-mark-')) moments.delete(one)
  moments.set(key, { art, mark, at })
  return mark
}
// Where it is drawn, for the terminal, which draws it as cells and repaints them in place as it moves: the engine, the surface and
// the drawing's site
const octopus = (ui: Ui, key: string, art: keyof typeof ART, size: number, alt: string, $?: EngineInterface, at?: { surface?: string; requestId?: string }) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number; isInteractive?: boolean }) => JSX.Element }
  const { Box } = ui
  const source = ART[art]
  if (!source) return null
  // The terminal draws no Svg (its table may name one, drawing nothing): there the octopus is cells
  if (at?.surface === 'terminal') return termOctopus(ui, key, art, size, alt, $, at.requestId)
  if (!table.Svg) return null
  const mark = momentOf(key, art)
  return (
    <Box key={key} flexShrink={0}>
      <table.Svg key={`${key}-${art}-${mark}`} source={source.replace('<svg', `<svg data-moment="${mark}"`)} alt={alt} width={size} height={size} isInteractive={art !== 'mark'} />
    </Box>
  )
}

// The octopus and the marks of work under way where the terminal draws them: it has no Svg, so each is a Raster, a box of cells,
// each a glyph in one colour. Its moving ones are repainted in place a few times a second ($.ui.blit), so nothing else is drawn
// again; the app's own drawing never comes here. Pictures are not drawn in a terminal: a press opens them (pictures)

// The terminal's own colour, for a see-through pixel: the octopus sits on a dark terminal as on a light one
const TERM_DEFAULT = 0x01000000
type Cells = { columns: number; rows: number; cells: string }

// ---- Cells, packed as the Raster takes them ----

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const toBase64 = (bytes: Uint8Array) => {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = ((bytes[i] ?? 0) << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63) + (i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : '=') + (i + 2 < bytes.length ? B64.charAt(n & 63) : '=')
  }
  return out
}
// Cells, row by row, each [glyph, foreground, background] as little-endian 32-bit words
const packed = (words: number[]) => {
  const bytes = new Uint8Array(words.length * 4)
  words.forEach((word, i) => {
    bytes[i * 4] = word & 255
    bytes[i * 4 + 1] = (word >>> 8) & 255
    bytes[i * 4 + 2] = (word >>> 16) & 255
    bytes[i * 4 + 3] = (word >>> 24) & 255
  })
  return toBase64(bytes)
}
// One glyph per cell in one colour, on the terminal's own
const glyphCells = (glyphs: string, color: number): Cells => ({
  columns: [...glyphs].length,
  rows: 1,
  cells: packed([...glyphs].flatMap(ch => [ch === ' ' ? 0x20 : (ch.codePointAt(0) ?? 0x20), ch === ' ' ? TERM_DEFAULT : color, TERM_DEFAULT])),
})
const colorOf = (hex: string) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map(ch => ch + ch).join('') : h.slice(0, 6)
  const n = Number.parseInt(full, 16)
  return Number.isFinite(n) ? n : -1
}

// ---- What moves: repainted in place a few times a second, each from its own start ----

// A moving Raster drawn somewhere: its pictures (cells each), how long each is shown, how many times they play, how long it has
// played, the picture last painted, and how many repaints in a row the terminal refused (one no longer shown is let go)
type Live = { requestId: string; key: string; frames: string[]; frameMs: number; loops: number; elapsed: number; shown: number; misses: number }
const lives = new Map<string, Live>()
// How often the moving ones are looked at; each is repainted only when its picture changes, a few times a second at most
const LIVE_TICK = 100
let stopLives: Timer | undefined
const frameOf = (one: { frames: unknown[]; frameMs: number; loops: number; elapsed: number }) => {
  if (one.frames.length < 2 || !one.frameMs) return 0
  const i = Math.floor(one.elapsed / one.frameMs)
  return i >= one.frames.length * one.loops ? one.frames.length - 1 : i % one.frames.length
}
const isOver = (one: { frames: unknown[]; frameMs: number; loops: number; elapsed: number }) =>
  one.frames.length < 2 || !one.frameMs || one.elapsed >= one.frames.length * one.loops * one.frameMs
const tickLives = ($: EngineInterface) => {
  for (const [id, one] of lives) {
    one.elapsed += LIVE_TICK
    const frame = frameOf(one)
    const over = isOver(one)
    if (frame === one.shown) {
      if (over) lives.delete(id)
      continue
    }
    one.shown = frame
    void $.ui
      .blit({ requestId: one.requestId, key: one.key, cells: one.frames[frame] ?? '' })
      .then(said => {
        const denied = Boolean(said && 'deny' in said && said.deny)
        one.misses = denied ? one.misses + 1 : 0
        if ((denied && one.misses >= 3) || over) lives.get(id) === one && lives.delete(id)
      })
      .catch(() => lives.get(id) === one && lives.delete(id))
  }
  if (!lives.size && stopLives) stopLives = (stopLives.cancel(), undefined)
}
// A Raster that plays its pictures from the moment given: drawn at the picture of now, then repainted in place as it moves on
const liveRaster = (
  ui: Ui,
  $: EngineInterface | undefined,
  requestId: string | undefined,
  key: string,
  frames: Cells[],
  frameMs: number,
  loops: number,
  elapsed: number,
) => {
  const table = ui as Ui & { Raster?: (props: RasterProps) => JSX.Element }
  if (!table.Raster || !frames.length) return null
  const one = { frames, frameMs, loops, elapsed: Math.max(0, elapsed) }
  const frame = frameOf(one)
  const id = `${requestId}\n${key}`
  // A site is given only with the engine that repaints it
  if (requestId && !isOver(one)) {
    lives.set(id, { requestId, key, frames: frames.map(f => f.cells), frameMs, loops, elapsed: one.elapsed, shown: frame, misses: 0 })
    if (!stopLives) stopLives = $!.clock.every(LIVE_TICK, () => tickLives($!))
  } else lives.delete(id)
  const cells = frames[frame] ?? frames[0]
  if (!cells) return null
  return <table.Raster key={key} columns={cells.columns} rows={cells.rows} cells={cells.cells} />
}

// ---- The octopus in the terminal ----

// Where each moment of the octopus began, by its mark, so a redraw draws the picture of now and the animation goes on from there
const momentStarts = new Map<string, number>()
// The band's octopus, one line tall: three cells of braille dots, each 2 by 4, a tiny octopus of 6 by 4 dots. At work its arms
// paddle; happy, it lifts them, then rests
const TINY: Record<'working' | 'happy', string[][]> = {
  working: [
    ['.####.', '#.##.#', '######', '#.#.#.'],
    ['.####.', '#.##.#', '######', '.#.#.#'],
  ],
  happy: [
    ['#.##.#', '##..##', '.####.', '.#..#.'],
    ['.####.', '#.##.#', '######', '#.#.#.'],
  ],
}
const brailleOf = (rows: string[]) => {
  let out = ''
  const bits = [
    [0x01, 0x08],
    [0x02, 0x10],
    [0x04, 0x20],
    [0x40, 0x80],
  ]
  for (let c = 0; c < (rows[0]?.length ?? 0); c += 2) {
    let n = 0
    for (let y = 0; y < 4; y += 1) for (let x = 0; x < 2; x += 1) if (rows[y]?.[c + x] === '#') n |= bits[y]?.[x] ?? 0
    out += String.fromCodePoint(0x2800 + n)
  }
  return out
}
// The terminal's octopus: 14 by 6 pixels, each cell four of them (▘▝▖▗ and their joins) in one colour on the terminal's own, so it
// is three rows tall, the size of Claude Code's own mark beside its three lines. Each picture of it, and how each state plays them
const TERM_OCTO_HEAD = ['...########...', '..##########..', '..##..##..##..', '..##########..']
const TERM_OCTO: Record<string, string[]> = {
  rest: [...TERM_OCTO_HEAD, '..#.#.##.#.#..', '.#..#....#..#.'],
  paddle: [...TERM_OCTO_HEAD, '..#.#.##.#.#..', '..#.#....#.#..'],
  hand: ['...########.#.', '..##########.#', '..##..##..###.', '..##########..', '..#.#.##.#....', '.#..#....#....'],
  cheer: [...TERM_OCTO_HEAD, '.#.#..##..#.#.', '#..#......#..#'],
  wave: ['...########...', '..##########.#', '..##..##..####', '..##########..', '..#.#.##.#....', '.#..#....#....'],
  jump: ['..............', '...########...', '..##########..', '..##..##..##..', '..##########..', '.#.#.#..#.#.#.'],
}
// At work it paddles on; something waiting raises a hand in amber; finished, it cheers in green four times; About waves; just
// updated, it jumps in blue
const TERM_PLAYS: Partial<Record<keyof typeof ART, { frames: string[]; color: string; frameMs: number; loops: number }>> = {
  mark: { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 },
  working: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
  workingSmall: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
  asking: { frames: ['hand', 'rest'], color: NEEDS, frameMs: 600, loops: Infinity },
  happy: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
  happySmall: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
  wave: { frames: ['wave', 'rest'], color: 'live', frameMs: 400, loops: 4 },
  updated: { frames: ['jump', 'rest'], color: '#4E93EF', frameMs: 300, loops: 6 },
}
const QUADS = ' ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█'
const quadCells = (rows: string[], color: number): Cells => {
  const width = Math.ceil((rows[0]?.length ?? 0) / 2)
  const height = Math.ceil(rows.length / 2)
  const on = (x: number, y: number) => (rows[y]?.[x] === '#' ? 1 : 0)
  const words: number[] = []
  for (let r = 0; r < height; r += 1)
    for (let c = 0; c < width; c += 1) {
      const n = on(2 * c, 2 * r) | (on(2 * c + 1, 2 * r) << 1) | (on(2 * c, 2 * r + 1) << 2) | (on(2 * c + 1, 2 * r + 1) << 3)
      words.push(n ? (QUADS.codePointAt(n) ?? 0x20) : 0x20, n ? color : TERM_DEFAULT, TERM_DEFAULT)
    }
  return { columns: width, rows: height, cells: packed(words) }
}
// Twice as large: each pixel two cells wide and one tall, which is square on a terminal
const doubledCells = (rows: string[], color: number): Cells => {
  const width = (rows[0]?.length ?? 0) * 2
  const words: number[] = []
  for (const row of rows) for (const ch of row) for (let i = 0; i < 2; i += 1) words.push(ch === '#' ? 0x2588 : 0x20, ch === '#' ? color : TERM_DEFAULT, TERM_DEFAULT)
  return { columns: width, rows: rows.length, cells: packed(words) }
}
// Which drawing the terminal draws in a place: the band's is the tiny one, every other the small one above
const termOctopus = (ui: Ui, key: string, art: keyof typeof ART, size: number, alt: string, $?: EngineInterface, requestId?: string) => {
  if (!('Raster' in ui)) return null
  const { Box } = ui
  const mark = momentOf(key, art)
  const now = Date.now()
  if (!momentStarts.has(mark)) {
    if (momentStarts.size > 200) momentStarts.clear()
    momentStarts.set(mark, now)
  }
  const elapsed = now - (momentStarts.get(mark) ?? now)
  if (size <= BAND_MARK) {
    const tiny = art === 'happySmall' || art === 'happy' ? TINY.happy : TINY.working
    const color = art === 'happySmall' || art === 'happy' ? colorOf('#4EBA65') : colorOf(art === 'asking' ? NEEDS : LIVE)
    const frames = tiny.map(rows => glyphCells(brailleOf(rows), color))
    // Happy lifts its arms four times over the finish's two seconds, then rests; at work it paddles on
    const loops = tiny === TINY.happy ? 4 : Infinity
    return (
      <Box key={key} flexShrink={0}>
        {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, tiny === TINY.happy ? 250 : 300, loops, elapsed)}
      </Box>
    )
  }
  // Everywhere else the small octopus, three rows tall beside the header's three lines, as big as Claude Code's own mark; on the
  // update screen the same drawing twice as large
  const play = TERM_PLAYS[art] ?? { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 }
  const color = colorOf(play.color === 'live' ? LIVE : play.color)
  const frames = play.frames.map(name => (size > HEAD_MARK ? doubledCells : quadCells)(TERM_OCTO[name] ?? TERM_OCTO_HEAD, color))
  return (
    <Box key={key} flexShrink={0}>
      {liveRaster(ui, $, requestId, `${key}-${art}-${mark}`, frames, play.frameMs, play.loops, elapsed)}
    </Box>
  )
}

// ---- The marks of work under way, in the terminal ----

// A card's three dots, a brighter one passing along them as the app's pulse does; still once the work is not at work
const DOT_FRAMES = ['●•·', '•●•', '·•●', '•·•']
const termDots = (ui: Ui, $: EngineInterface, requestId: string, key: string) =>
  liveRaster(ui, $, requestId, key, DOT_FRAMES.map(one => glyphCells(one, colorOf(LIVE))), 300, Infinity, Date.now() % 1200)
// A helper at work: its dot with a ring that grows out of it and fades
const RING_FRAMES = ['●', '◉', '◎', '○']
const termRing = (ui: Ui, $: EngineInterface, requestId: string, key: string) =>
  liveRaster(ui, $, requestId, key, RING_FRAMES.map(one => glyphCells(one, colorOf(LIVE))), 350, Infinity, Date.now() % 1400)

// Pictures a piece of work made, drawn in its chat where it made them

// ---- Pictures a piece of work made, drawn in its chat where it made them ----

// How many of a chat's newest pictures are drawn small; older ones are a row that opens them. The small copy's widest side
const CHAT_THUMBS = 6
// The most pictures one chat shows
const PICS_LISTED = 40
const CHAT_THUMB_SIZES = ['360', '280']
// How tall an upright small copy is drawn at most, in the panel's pixels: a tall screenshot is drawn narrower, not longer
const PIC_TALL = 200
// The most characters a picture drawn as it is, an SVG of the work's own, may have
const SVG_CHARS = 100_000
type Pic = { name: string; path: string; thumb: Thumb; isGone?: boolean }
// A press opens the picture whole in the Mac's own viewer (Preview for a photo or screenshot), a window of its own as large as the
// screen allows, which can go full screen and closes as any window does: the panel is only a sidebar wide. A chat the app runs on
// another Mac over ssh has its engine, and so `open`, on this Mac, where nobody looks: Preview opened on its screen (seen on the
// M4). There the picture is drawn large in the Details tab it was pressed in, which the app draws on the screen the person is at,
// over its Details, with a row back to them: no tab is opened, closed or opened again. 0.2.46 to 0.2.50 opened a picture tab of its
// own, which from a Details tab closed the tab pressed in and opened it again so it let go of the keyboard: that tab came back drawn
// afresh, its chat at its end and slow to scroll, and the picture's tab stayed behind it (seen on 0.2.49 in a helper's Details)
const showPicture = async ($: EngineInterface, path: string, pane: string, row: string, surface?: RenderSurface) => {
  if (surface === 'terminal' && (termFrom || isRunFromAfar)) return sendPicture($, path)
  if (isRunFromAfar) return showPictureIn($, path, pane, row)
  const opened = await $.process.run(['open', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (opened.exitCode !== 0) await log($, `picture ${path} not opened: ${opened.stderr}`)
}
// A terminal draws no picture worth looking at (a few blurred pixels a cell), so there a picture is a row that is pressed: on the
// Mac the person is at it opens in the Mac's own viewer, as above. In a terminal reached over ssh the person is at another
// device, where nothing here can open a window: the picture is sent to that device, by Tailscale's file sending when both are on
// one tailnet (it lands in its Downloads), else the row gives the one command that fetches and opens it there. Set as the chat
// starts from SSH_CONNECTION: the device the terminal is watched from, and this Mac as that device reaches it
let termFrom = ''
let termHere = ''
let termPort = ''
// What the last press on a picture came to, by its path, said under its row
const pictureSaid = new Map<string, { text: string; copy?: string }>()
const TAILSCALES = ['tailscale', '/Applications/Tailscale.app/Contents/MacOS/Tailscale']
const shQuoted = (text: string) => `'${text.replaceAll("'", "'\\''")}'`
const sendPicture = async ($: EngineInterface, path: string) => {
  const say = (text: string, copy?: string) => (pictureSaid.size > 100 && pictureSaid.clear(), pictureSaid.set(path, { text, copy }), $.ui.invalidate('ui.render'))
  // A terminal with no word of where it is watched from: where the picture is, and no more
  if (!termFrom) return say(`It is at ${path} on this Mac`)
  say('Sending it to your device…')
  for (const bin of TAILSCALES) {
    const targets = await $.process.run([bin, 'file', 'cp', '--targets'], { timeoutMs: 8_000 }).catch(() => undefined)
    if (!targets || targets.exitCode !== 0) continue
    // Each line a device: its address, its name, and a word when it is not reachable now
    const [, name = '', ...state] = targets.stdout.split('\n').map(line => line.trim().split(/\s+/)).find(parts => parts[0] === termFrom) ?? []
    if (!name || state.join(' ').startsWith('offline')) break
    const sent = await $.process.run([bin, 'file', 'cp', path, `${termFrom}:`], { timeoutMs: 60_000 }).catch(err => ({ exitCode: 1, stderr: String(err) }))
    if (sent.exitCode === 0) return say(`✓ Sent to ${name} by Tailscale, which keeps what it is sent in Downloads`)
    await log($, `picture ${path} not sent to ${termFrom}: ${sent.stderr}`)
    break
  }
  const user = (await $.env.get('USER')) ?? ''
  const port = termPort && termPort !== '22' ? `-P ${termPort} ` : ''
  const command = `scp ${port}${shQuoted(`${user ? `${user}@` : ''}${termHere.includes(':') ? `[${termHere}]` : termHere}:${path}`)} ~/Downloads/ && open ~/Downloads/${shQuoted(fileName(path))}`
  say('Run this on your own device (a Mac), and it opens there:', command)
}
// Under a picture's row in the terminal: what its press came to, with the command to copy when there is one
const pictureSaidRow = ($: EngineInterface, ui: Ui, key: string, path: string) => {
  const said = pictureSaid.get(path)
  if (!said) return null
  return (
    <ui.Box key={key} flexDirection="column" paddingLeft={3}>
      <ui.Text dimColor wrap="wrap">{said.text}</ui.Text>
      {said.copy ? <ui.Text wrap="wrap">{said.copy}</ui.Text> : null}
      {said.copy ? <ui.Button key={`${key}-copy`} label="Copy the command" plain onPress={press => void $.ui.copy({ text: said.copy ?? '', surface: press.surface }).catch(err => log($, `copy not made: ${String(err)}`))} /> : null}
    </ui.Box>
  )
}
// The picture tab of 0.2.46 to 0.2.50: one still open after an update says that pictures open in Details now
const PICTURE_PANE = 'picture'
const pictureShown = ''
// The picture each Details tab draws large over its Details, by the tab, and the row it was pressed on, which Back brings into view
const pictureIn = new Map<string, { path: string; row: string }>()
const showPictureIn = async ($: EngineInterface, path: string, pane: string, row: string) => {
  pictureIn.set(pane, { path, row })
  // One that could not be made is tried again on a new press
  for (const [id, one] of larges) if (!one && id.startsWith(`${path}:`)) larges.delete(id)
  $.ui.invalidate('ui.render')
  // To its top, now and again once the picture is likely drawn in place of the Details
  await $.ui.scroll({ in: pane, to: 'start', block: 'start' }).catch(() => undefined)
  $.clock.after(150, () => void $.ui.scroll({ in: pane, to: 'start', block: 'start' }).catch(() => undefined))
}
// Brings a row into view once it is drawn: a redraw over ssh can take a while to reach the app, so a row not drawn yet is tried again
const scrollTo = ($: EngineInterface, pane: string, key: string, tries: number) =>
  $.clock.after(150, async () => {
    if (pictureIn.has(pane)) return
    const moved = await $.ui.scroll({ in: pane, to: { key }, block: 'center' }).catch(err => ({ deny: String(err) }))
    if (moved && 'deny' in moved && moved.deny && tries > 1) scrollTo($, pane, key, tries - 1)
  })
const pictureBack = ($: EngineInterface, pane: string) => {
  const was = pictureIn.get(pane)
  pictureIn.delete(pane)
  $.ui.invalidate('ui.render')
  // Once the Details are drawn again, the picture's row is brought into view, where the person was
  if (was?.row) scrollTo($, pane, was.row, 6)
}
// The large copy the tab draws, as wide as a wide sidebar on a sharp screen. An Svg carries at most 131072 characters, too few for
// a large screenshot to stay readable, so the copy is cut into bands across, each an Svg of its own drawn under the one before.
// The whole copy fits in one drawing the app accepts (262144 characters): a size that needs more gives way to a lower JPEG quality,
// then a narrower one. 0.2.46 to 0.2.55 let it reach 600000, which the app threw away, so the tab stayed on "Making a large copy"
// and went blank once left and come back to. A picture with see-through parts keeps them as PNG, else JPEG
const LARGE_SIZES: [number, number][] = [
  [2000, 70],
  [1400, 70],
  [1400, 55],
  [1000, 70],
  [1000, 55],
  [800, 60],
  [600, 60],
]
const LARGE_CHARS = 130_000
const LARGE_TOTAL = 200_000
type Large = { bands: string[]; width: number; height: number } | null
const larges = new Map<string, Large>()
const making = new Map<string, Promise<Large>>()
let largeMade = 0
const makeLarge = async ($: EngineInterface, path: string, size: number): Promise<Large> => {
  if (/\.svg$/i.test(path)) {
    if (size > LARGE_CHARS * 2) return null
    const text = await readOr($, path)
    const from = text.indexOf('<svg')
    return from >= 0 && text.length - from <= LARGE_CHARS ? { bands: [text.slice(from)], width: 0, height: 0 } : null
  }
  if (!RASTER.test(path)) return null
  const got = await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'hasAlpha', path]).catch(() => ({ exitCode: 1, stdout: '' }))
  const width = Number(/pixelWidth:\s*(\d+)/.exec(got.stdout)?.[1] ?? 0)
  const height = Number(/pixelHeight:\s*(\d+)/.exec(got.stdout)?.[1] ?? 0)
  if (!width || !height) return null
  // A picture with see-through parts is tried as PNG first, which keeps them, then as JPEG, which a window screenshot's shadow
  // edges need to fit
  const formats = /hasAlpha:\s*yes/.test(got.stdout) ? (['png', 'jpeg'] as const) : (['jpeg'] as const)
  largeMade += 1
  const base = `${dir}/thumbs/large-${Math.round(await $.clock.now())}-${largeMade}`
  await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
  try {
    // Each size once: a picture narrower than a width is taken at its own width
    const sizes = [...new Map(LARGE_SIZES.map(([w, quality]) => [`${Math.min(w, width)}:${quality}`, [Math.min(w, width), quality] as const])).values()]
    for (const format of formats)
    for (const [most, quality] of format === 'png' ? [...new Map(sizes.map(([w]) => [w, [w, 0] as const])).values()] : sizes) {
      // The picture at this width, then cut into bands down it, each as tall as fits
      const wide = `${base}-${most}.png`
      const sized = await $.process.run(['sips', '--resampleWidth', String(most), '-s', 'format', 'png', path, '--out', wide]).catch(() => ({ exitCode: 1 }))
      if (sized.exitCode !== 0) continue
      const tall = Number(/pixelHeight:\s*(\d+)/.exec((await $.process.run(['sips', '-g', 'pixelHeight', wide]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
      if (!tall) continue
      // sips crops only a band that neither starts at the top nor reaches the bottom (one that does comes out centred, or whole),
      // so the picture is given a row above and below first, and each band is cut one row down
      const padded = await $.process.run(['sips', '--padToHeightWidth', String(tall + 2), String(most), wide]).catch(() => ({ exitCode: 1 }))
      if (padded.exitCode !== 0) continue
      const bands: string[] = []
      let band = Math.min(tall, 400)
      let total = 0
      let isTooMany = false
      for (let y = 0; y < tall; ) {
        const rows = Math.min(band, tall - y)
        const out = `${base}-band.${format === 'png' ? 'png' : 'jpg'}`
        await $.process.run(['sips', '-c', String(rows), String(most), '--cropOffset', String(y + 1), '0', '-s', 'format', format, ...(format === 'jpeg' ? ['-s', 'formatOptions', String(quality)] : []), wide, '--out', out])
        const cutTo = Number(/pixelHeight:\s*(\d+)/.exec((await $.process.run(['sips', '-g', 'pixelHeight', out]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
        const read = cutTo === rows ? ((await $.fs.read(out, { as: 'bytes' }).catch(() => undefined)) as { base64: string } | undefined) : undefined
        const source = read ? `<svg xmlns="http://www.w3.org/2000/svg" width="${most}" height="${rows}" viewBox="0 0 ${most} ${rows}"><image href="data:image/${format};base64,${read.base64}" width="${most}" height="${rows}"/></svg>` : ''
        if (!source) break
        if (source.length > LARGE_CHARS) {
          if (rows <= 16) break
          band = Math.max(16, Math.floor((rows * LARGE_CHARS * 0.9) / source.length))
          continue
        }
        // The whole copy, this band too, fits in one drawing, else this size is too large
        total += source.length
        if (total > LARGE_TOTAL) {
          isTooMany = true
          break
        }
        bands.push(source)
        y += rows
      }
      if (!isTooMany && bands.length) {
        const whole = bands.reduce((sum, one) => sum + Number(/height="(\d+)"/.exec(one)?.[1] ?? 0), 0)
        if (whole >= tall) return { bands, width, height }
      }
    }
    return null
  } finally {
    await $.process.run(['sh', '-c', 'rm -f "$1"-*', 'sh', base]).catch(() => undefined)
  }
}
// The large copy as made, else nothing yet: it is made once, out of the drawing, which is drawn again when it is ready. One that
// cannot be made is kept as such, so it is not tried again at every drawing, only at the next press of its row
const largeOf = ($: EngineInterface, path: string, id: string): Large | undefined => {
  if (larges.has(id)) return larges.get(id) ?? null
  if (!making.has(id))
    making.set(
      id,
      makeLarge($, path, Number(id.split(':').pop()) || 0)
        .catch(err => (void log($, `large copy of ${path} not made: ${String(err)}`), null))
        .then(one => {
          if (larges.size >= 6) larges.delete(larges.keys().next().value ?? '')
          larges.set(id, one)
          making.delete(id)
          $.ui.invalidate('ui.render')
          return one
        }),
    )
  return undefined
}
// What the tab draws: the picture as wide as the tab, its name and size, and how to see it larger
const pictureView = async ($: EngineInterface, e: Parameters<EngineInterface['ui']['resolve']>[0], path = pictureShown) => {
  const ui = uiOf($, e)
  if (!path) return <ui.Text dimColor>Pictures now open large in the Details tab they are pressed in. This tab can be closed.</ui.Text>
  const name = fileName(path)
  const stat = await $.fs.stat(path).catch(() => undefined)
  const said = (text: string) => (
    <ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Text dimColor wrap="wrap">{text}</ui.Text>
    </ui.Box>
  )
  if (!stat || stat.kind !== 'file') return said('This picture is no longer kept.')
  if (e.surface === 'terminal') {
    // The terminal draws no picture: a row that opens it where the person is, and what that came to
    return (
      <ui.Box flexDirection="column" width="100%">
        <ui.Button key={`large-open-${path}`} label={`Open ${name}`} plain hotkey="o" onPress={press => void showPicture($, path, '', '', press.surface)} />
        {pictureSaidRow($, ui, 'large-said', path)}
      </ui.Box>
    )
  }
  if (!('Svg' in ui)) return said(`This screen cannot draw pictures. It is at ${path}`)
  const large = largeOf($, path, `${path}:${stat.mtimeMs}:${stat.size}`)
  if (large === undefined) return said('Making a large copy…')
  if (!large) return said(`This picture could not be drawn here. Press its row again to try again. It is at ${path}`)
  return (
    <ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Box flexDirection="column" width="100%">
        {large.bands.map((band, n) => (
          <ui.Svg key={`large-${n}`} source={band} alt={`Picture: ${name}${large.bands.length > 1 ? `, part ${n + 1} of ${large.bands.length}` : ''}`} />
        ))}
      </ui.Box>
      <ui.Text dimColor wrap="wrap">{`${large.width ? `${large.width} × ${large.height} · ` : ''}drag the sidebar's edge to make it wider`}</ui.Text>
    </ui.Box>
  )
}
const pics = new Map<string, Pic | null>()
const PICS_HELD = 60
let isThumbsCleared = false
// Each Details tab's pictures by step number, as last looked for, by the work
const shots = new Map<string, { key: string; shots: Map<number, Pic[]> }>()
// One picture as the chat shows it: where it is now (the copy a report kept, once the temporary file is gone) and its small copy.
// Nothing for a file a command only named that was there before the work began
const picOf = async ($: EngineInterface, given: string, one: Todo, isSeen: boolean, kept: Report[], isDrawn: boolean): Promise<Pic | null> => {
  const asked = given.startsWith('/') ? given : `${cwd}/${given}`
  const stat = await $.fs.stat(asked).catch(() => undefined)
  const copy = kept.filter(r => r.agent === one.id).flatMap(r => r.files.filter(file => fileName(file) === fileName(asked)).map(file => `${reportPath(r)}/${file}`))[0]
  if (!stat || stat.kind !== 'file') return copy && !isSeen ? picOf($, copy, one, false, [], isDrawn) : isSeen ? null : { name: fileName(asked), path: '', thumb: null, isGone: true }
  if (isSeen && stat.mtimeMs < one.startedAt - 5000) return null
  const id = `${asked}:${stat.mtimeMs}:${isDrawn}`
  if (pics.has(id)) return pics.get(id) ?? null
  let thumb: Thumb = null
  if (isDrawn && /\.svg$/i.test(asked) && stat.size <= SVG_CHARS) {
    const text = await readOr($, asked)
    const from = text.indexOf('<svg')
    if (from >= 0) thumb = { source: text.slice(from), width: 0, height: 0 }
  } else if (isDrawn && RASTER.test(asked)) {
    const to = `${dir}/thumbs/${slug(asked).slice(-60)}-${mark(asked).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
    if (!(await $.fs.exists(to))) {
      await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
      for (const size of CHAT_THUMB_SIZES) {
        await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '60', asked, '--out', to])
        if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= THUMB_BYTES) break
      }
    }
    thumb = await thumbOf($, to)
  }
  const pic = { name: fileName(asked), path: asked, thumb }
  // Only the pictures looked at lately are held
  if (pics.size >= PICS_HELD) pics.delete(pics.keys().next().value ?? '')
  pics.set(id, pic)
  return pic
}
// The pictures of a chat's shown lines, each at the last step that made it, by that step's number; the newest few drawn small
const picturesIn = async ($: EngineInterface, lines: Line[], one: Todo, kept: Report[], canDraw: boolean) => {
  // Small copies not looked at for two weeks are cleared, once a load
  if (!isThumbsCleared) {
    isThumbsCleared = true
    await $.process.run(['find', `${dir}/thumbs`, '-name', '*.jpg', '-mtime', '+14', '-delete']).catch(() => undefined)
  }
  const last = new Map<string, { at: number; isSeen: boolean }>()
  // Steps are numbered as the chat numbers them, and only the lines it shows count
  let uses = 0
  for (const line of newest(lines.map(one => ({ ...one, at: one.isUse ? (uses += 1) : uses }))))
    for (const [list, isSeen] of [
      [line.pictures ?? [], false],
      [line.seen ?? [], true],
    ] as const)
      for (const path of list) {
        // A picture made again is placed at its newest step
        const was = last.get(path)
        last.delete(path)
        last.set(path, { at: line.at ?? 0, isSeen: isSeen && was?.isSeen !== false })
      }
  // The newest pictures alone are looked at: a chat that made very many keeps its last ones
  const order = [...last.entries()].slice(-PICS_LISTED)
  const byStep = new Map<number, Pic[]>()
  let drawnCount = 0
  // The small copies together keep the tab's drawing under what the app accepts; one past that is a row that opens it
  let drawnChars = 0
  for (const [path, { at, isSeen }] of order.reverse()) {
    const found = await picOf($, path, one, isSeen, kept, canDraw && drawnCount < CHAT_THUMBS).catch(() => null)
    if (!found) continue
    const pic = found.thumb && drawnChars + found.thumb.source.length > PICTURES_CHARS ? { ...found, thumb: null } : found
    if (pic.thumb) (drawnCount += 1), (drawnChars += pic.thumb.source.length)
    byStep.set(at, [pic, ...(byStep.get(at) ?? [])])
  }
  return byStep
}
// Reads a work's chat, and finds the pictures it made, for its Details tab, then draws the tab again. Called from the drawing, it
// runs after it: the chat is read again when the work has made a step, ended a response, been steered or ended, and its pictures
// looked for again when its chat or the reports change. One read of a work runs at a time; the next drawing reads what came since
const loading = new Set<string>()
// A chat the app would not give is asked for again after this long, at the tab's next drawing, never sooner
const RETRY_READ = 15_000
const loadWork = async ($: EngineInterface, id: string) => {
  if (loading.has(id)) return
  loading.add(id)
  let isChanged = false
  try {
    const one = (await read($, todos)).find(card => card.id === id)
    if (!one) return
    const key = [one.id, one.steps, one.tokens, one.entries.length, one.status].join(':')
    const kept = await read($, reports)
    const shotsKey = `${key}:${kept.length}`
    const now = await $.clock.now()
    const was = talks.get(id)
    if (was?.key !== key || (!was.lines && now - (was.at ?? 0) >= RETRY_READ)) {
      const rows = await $.session.messages({ agentId: id }).catch(() => undefined)
      talks.set(id, { key, lines: Array.isArray(rows) ? withSteers(talkOf(rows), one.entries) : undefined, at: now })
      isChanged = true
    }
    const lines = talks.get(id)?.lines
    if (lines && shots.get(id)?.key !== shotsKey) {
      shots.set(id, { key: shotsKey, shots: await picturesIn($, lines, one, kept, true).catch(() => new Map<number, Pic[]>()) })
      isChanged = true
    }
  } catch (err) {
    // Whatever went wrong, the tab stops saying it is reading, and says the chat is not to be had
    if (!talks.has(id)) talks.set(id, { key: '', lines: undefined, at: await $.clock.now().catch(() => 0) })
    isChanged = true
    await log($, `chat of ${id} not read: ${String(err)}`).catch(() => undefined)
  } finally {
    loading.delete(id)
  }
  // Drawn again only when something new was read, so a drawing that finds nothing new ends there
  if (isChanged) redraw($)
}

// Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds

// ---- Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds ----
// Each run is kept by the session that runs it in ~/.claude/claudopus/flows/<run id>.json; the chat that started that session
// reads it from there, so a workflow run in a session of its own shows in the chat's panel too

const flows = atom({ plugin: 'claudopus', key: 'flows' } as const, [], { shape: 'flows-1' })
// The app's ids of this session and of the session that started it. Outside the app there are none, and a run is named by the
// engine's id of this session
let ccd = { id: '', parent: '' }
// A model named by its alias, as a script names it, is the version the panel offers
const fullModel = (id: string) => (/^(opus|sonnet|fable)$/i.test(id.trim()) ? (MODELS.find(one => one.includes(id.trim().toLowerCase())) ?? id) : id)
const sessionName = async ($: EngineInterface) => ccd.id || `engine:${(await read($, me)).id}`
// The agents of each run, by agent id: what their responses report goes to their run
const flowAgents = new Map<string, string>()
// What each run this session runs was when its file was last written
const flowSaved = new Map<string, string>()
const flowsDir = () => `${dir}/flows`
const flowPath = (id: string) => `${flowsDir()}/${id.replace(/[^A-Za-z0-9_-]/g, '-')}.json`
// A running workflow's journal is read this often, and its card's time moves each second
const FLOW_EVERY = 2000
// How many runs the panel keeps, ended ones included; and how many looks pass between two reads of this chat for a run's end
const FLOWS_KEPT = 20
const END_LOOK = 5
// A run of another session whose file has not changed for this long has lost its session; one older than a day is not looked at again
const FLOW_STALE = 30 * 60_000
const FLOW_OLD = 24 * 3600_000
// The agent of each workflow's Details tab whose chat it shows, by the run
const flowPicked = new Map<string, string>()
// Each workflow agent's chat as last read from its transcript, by the agent
const flowTalks = new Map<string, { key: string; lines: Line[] | undefined }>()

const knowSession = async ($: EngineInterface) => {
  try {
    const one = JSON.parse(textOf(await $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' }))) as { sessionId?: string; parentSessionId?: string }
    ccd = { id: one.sessionId ?? '', parent: one.parentSessionId ?? '' }
  } catch {
    // Outside the desktop app a run is this session's alone
  }
}
const isFlowMine = async ($: EngineInterface, f: Flow) => f.session === (await sessionName($))
// A run this panel shows: one this session runs, or one a session this chat started runs
const isFlowShown = (f: Flow, mine: string) => f.session === mine || Boolean(ccd.id && f.parent === ccd.id)

// Writes a run this session runs to its file when it changed
const saveFlow = async ($: EngineInterface, f: Flow) => {
  if (!dir || !(await isFlowMine($, f))) return
  const text = JSON.stringify(f)
  if (flowSaved.get(f.id) === text) return
  await $.fs.write(`${dir}/flows/${f.id.replace(/[^A-Za-z0-9_-]/g, '-')}.json`, `${text}\n`)
  flowSaved.set(f.id, text)
}
const changeFlow = async ($: EngineInterface, id: string, fn: (f: Flow, at: number) => Flow) => {
  const now = await $.clock.now()
  const list = await update($, flows, all => all.map(f => (f.id === id ? fn(f, now) : f)))
  const f = list.find(one => one.id === id)
  if (f) await saveFlow($, f).catch(err => log($, `workflow ${id} not kept: ${String(err)}`))
  await lookEnds($)
}
const keptFlows = (list: Flow[]) => {
  let over = list.length - FLOWS_KEPT
  return over > 0 ? [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt)).filter(f => f.status === 'working' || (over -= 1) < 0) : list
}

// The Workflow tool started a run: its card comes up, from the call's own script and args and what the tool answered
const flowStarted = async ($: EngineInterface, input: { script?: unknown; scriptPath?: unknown; name?: unknown; args?: unknown }, answer: { taskId?: string; runId?: string; transcriptDir?: string; scriptPath?: string; workflowName?: string }) => {
  if (!dir || !answer.runId || !answer.taskId) return
  const path = typeof input.scriptPath === 'string' ? input.scriptPath : answer.scriptPath ?? ''
  const script = typeof input.script === 'string' ? input.script : path ? await readOr($, path) : ''
  const meta = metaOf(script)
  const now = await $.clock.now()
  const args = input.args
  const task = args && typeof args === 'object' && typeof (args as { task?: unknown }).task === 'string' ? String((args as { task: string }).task) : typeof args === 'string' ? args : ''
  const f: Flow = {
    id: answer.runId,
    taskId: answer.taskId,
    title: titleOfFlow(args, { name: meta.name || answer.workflowName || String(input.name ?? ''), description: meta.description }),
    name: meta.name || answer.workflowName || String(input.name ?? ''),
    description: meta.description,
    phases: meta.phases.map(p => (p.model ? { ...p, model: fullModel(p.model) } : p)),
    // The rounds script's own cap: 3 when none is given, at most 5
    ...((capOf(args) ?? (meta.name === 'rounds' ? 3 : undefined)) ? { cap: meta.name === 'rounds' ? Math.min(capOf(args) ?? 3, 5) : capOf(args) } : {}),
    task: task.trim().slice(0, 4000),
    words: said.trim().slice(0, 4000),
    session: await sessionName($),
    parent: ccd.parent,
    transcriptDir: answer.transcriptDir ?? '',
    startedAt: now,
    endedAt: 0,
    status: 'working',
    agents: flowEarly.get(answer.runId) ?? [],
    result: '',
  }
  flowEarly.delete(answer.runId)
  await update($, flows, list => keptFlows([...list.filter(one => one.id !== f.id), f]))
  await saveFlow($, f).catch(err => log($, `workflow ${f.id} not kept: ${String(err)}`))
  await openList($)
}

// The agents that started before their run's card existed, by the run
const flowEarly = new Map<string, FlowAgent[]>()
// An agent the script started: its model now, its label and stage once the journal names them
const flowSpawned = async ($: EngineInterface, runId: string, agentId: string, model: string, label: string) => {
  flowAgents.set(agentId, runId)
  // An agent that starts before the tool has answered with its run waits for the run's card
  if (!(await read($, flows)).some(f => f.id === runId)) {
    const now = await $.clock.now()
    flowEarly.set(runId, [...(flowEarly.get(runId) ?? []).filter(one => one.id !== agentId), { id: agentId, label: label.trim(), phase: '', status: 'working', at: now, model: fullModel(model) || undefined }])
    return
  }
  await changeFlow($, runId, (f, at) => {
    const was = f.agents.find(one => one.id === agentId)
    const agent: FlowAgent = { ...(was ?? { id: agentId, label: label.trim(), phase: '', status: 'working' as const, at }), model: fullModel(model) || was?.model }
    return { ...f, agents: was ? f.agents.map(one => (one.id === agentId ? agent : one)) : [...f.agents, agent] }
  })
}
// A response of a workflow's agent ended: how full its context is, and its model
const flowStep = async ($: EngineInterface, agentId: string, tokens: number, model: string | undefined) => {
  const runId = flowAgents.get(agentId)
  if (!runId) return
  await changeFlow($, runId, f => ({ ...f, agents: f.agents.map(one => (one.id === agentId ? { ...one, tokens, model: modelName(model ?? '') ? model : one.model } : one)) }))
}
// The run ended: how, and what it returned
const flowEnded = async ($: EngineInterface, text: string) => {
  for (const f of (await read($, flows)).filter(one => one.status === 'working')) {
    const end = endOf(text, f.taskId)
    if (!end || !(await isFlowMine($, f))) continue
    await readJournal($, f.id)
    await changeFlow($, f.id, (one, at) => ({ ...one, status: end.status, result: end.result || one.result, endedAt: at }))
  }
}
const stopFlow = async ($: EngineInterface, id: string) => {
  const f = (await read($, flows)).find(one => one.id === id)
  if (!f || f.status !== 'working') return
  pressed.add(`flow:${id}`)
  const r = await $.tool.call({ tool: 'TaskStop', task_id: f.taskId }).catch(err => ({ deny: String(err) }))
  if (r.deny) return (pressed.delete(`flow:${id}`), log($, `workflow ${id} not stopped: ${r.deny}`))
  await changeFlow($, id, (one, at) => ({ ...one, status: 'stopped', endedAt: at }))
}
const readJournal = async ($: EngineInterface, id: string) => {
  const f = (await read($, flows)).find(one => one.id === id)
  if (!f?.transcriptDir) return
  const text = await readOr($, `${f.transcriptDir}/journal.jsonl`)
  if (!text) return
  const now = await $.clock.now()
  await changeFlow($, id, one => withJournal(one, journalOf(text), now))
}
// Keeps the runs true: each running one of this session's is read from its journal, its end looked for in this chat's own record
// (a reload misses the notice as it arrives), and the runs of the sessions this chat started are read from their files
let flowLooks = 0
const followFlows = async ($: EngineInterface) => {
  if (!dir || (!ccd.id && !(await read($, flows)).length)) return
  flowLooks += 1
  const mine = await sessionName($)
  const running = (await read($, flows)).filter(f => f.status === 'working' && f.session === mine)
  for (const f of running) await readJournal($, f.id).catch(err => log($, `journal of ${f.id} not read: ${String(err)}`))
  if (running.length && flowLooks % END_LOOK === 0) {
    const rows = await $.session.messages().catch(() => [])
    for (const row of Array.isArray(rows) ? rows : []) if (row.role === 'user' && row.text.includes('<task-notification')) await flowEnded($, row.text)
  }
  // The runs of other sessions: those this chat started, read again while they run
  if (ccd.id && (flowLooks % END_LOOK === 1 || (await read($, flows)).some(f => f.status === 'working' && f.session !== mine))) {
    const found: Flow[] = []
    const now = await $.clock.now()
    for (const entry of await $.fs.list(flowsDir()).catch(() => [])) {
      if (!entry.name.endsWith('.json')) continue
      const known = (await read($, flows)).find(f => flowPath(f.id).endsWith(`/${entry.name}`))
      if (known && (known.status !== 'working' || known.session === mine)) continue
      // A file not written for a day is an old run, read once at load at most
      const stat = await $.fs.stat(`${flowsDir()}/${entry.name}`).catch(() => undefined)
      if (!known && stat && now - stat.mtimeMs > FLOW_OLD) continue
      try {
        const read1 = JSON.parse(await readOr($, `${flowsDir()}/${entry.name}`)) as Flow
        // A run its session has not written for this long has lost its session: it shows as stopped
        const one = read1.status === 'working' && stat && now - stat.mtimeMs > FLOW_STALE ? { ...read1, status: 'stopped' as const, endedAt: stat.mtimeMs } : read1
        if (one.id && one.parent === ccd.id && one.session !== mine) found.push(one)
      } catch {
        // A file being written is read at the next look
      }
    }
    if (found.length) await update($, flows, list => keptFlows([...list.filter(f => !found.some(one => one.id === f.id)), ...found]))
  }
}
// The runs this session ran before a reload or a restart come back from their files
const loadFlows = async ($: EngineInterface) => {
  const mine = await sessionName($)
  const found: Flow[] = []
  for (const entry of await $.fs.list(flowsDir()).catch(() => [])) {
    if (!entry.name.endsWith('.json')) continue
    try {
      const one = JSON.parse(await readOr($, `${flowsDir()}/${entry.name}`)) as Flow
      if (one.id && isFlowShown(one, mine)) found.push(one)
    } catch {
      // Not a run's file
    }
  }
  for (const f of found) flowSaved.set(f.id, JSON.stringify(f))
  // The agents of the runs still going: their responses go on reaching their card
  for (const f of found) if (f.status === 'working') for (const one of f.agents) flowAgents.set(one.id, f.id)
  if (found.length) await update($, flows, list => keptFlows([...found.filter(one => !list.some(f => f.id === one.id)), ...list]))
}
const openFlow = ($: EngineInterface, id: string) => {
  presses += 1
  void (async () => {
    const f = (await read($, flows)).find(one => one.id === id)
    if (!f) return
    if (!(await $.ui.panes()).some(pane => pane.id === flowPaneOf(id))) (flowPicked.delete(id), pictureIn.delete(flowPaneOf(id)))
    await front($, flowPaneOf(id), cut(f.title, 30))
    redraw($)
  })().catch(err => log($, `workflow ${id} not opened: ${String(err)}`))
}
// The agent whose chat a workflow's Details tab shows: the one pressed, else the one at work, else the last
const pickedOf = (f: Flow) => f.agents.find(one => one.id === flowPicked.get(f.id)) ?? [...f.agents].reverse().find(one => one.status === 'working') ?? f.agents.at(-1)
// A workflow agent's chat, read from its transcript in the run's folder when it has moved
const flowTalkOf = async ($: EngineInterface, f: Flow, agent: FlowAgent) => {
  const key = [agent.id, agent.status, agent.tokens ?? 0].join(':')
  if (flowTalks.get(agent.id)?.key !== key) {
    const text = f.transcriptDir ? await readOr($, `${f.transcriptDir}/agent-${agent.id}.jsonl`) : ''
    flowTalks.set(agent.id, { key, lines: text ? talkOf(rowsOf(text)) : undefined })
  }
  return flowTalks.get(agent.id)?.lines
}

const workflowHooks = (on: On) => {

  // A run of the Workflow tool: its card comes up from the call and what the tool answered. The call goes on as made
  on('tool.call', { tool: 'Workflow' }, async ($, e, next) => {
    const r = await next(e)
    const answer = (r.result ?? undefined) as { status?: string; taskId?: string; runId?: string; transcriptDir?: string; scriptPath?: string; workflowName?: string; error?: string } | undefined
    if (!r.deny && !r.isError && answer && !answer.error && answer.status === 'async_launched')
      await flowStarted($, e as unknown as { script?: unknown; scriptPath?: unknown; name?: unknown; args?: unknown }, answer).catch(err => log($, `workflow not followed: ${String(err)}`))
    return r
  })

}

// Work that is ready or needs the person: a short sound and a notification

// ---- Work that is ready: a short sound and a notification ----

// The sound, a file of the mod's: two soft rising notes, 0.75 s, made by mockups/claudopus-sound/ready.py
const READY_SOUND = 'sounds/ready.wav'
// Ends this close together are one sound and one notification
const SETTLE = 800
// Work that ends again this soon after it was announced is not announced again
const AGAIN = 10_000
// An end the mod learns of this long after it happened, as work read back after a restart, is not announced
const STALE_END = 60_000
// How each card and workflow of this chat's stood when last looked at, by id. Unset until the first look after the mod loads,
// which only takes note, so a reload announces nothing
let lastSeen: Map<string, string> | undefined
// Ends waiting to be announced together, with what waited on the person as the end was seen (its report takes that over soon
// after), and when each was last announced, by id
let ready: { id: string; waits?: string[] }[] = []
let isSettling = false
const announced = new Map<string, number>()
// Work the person stopped with its Stop button: they saw it end, so it is not announced
const pressed = new Set<string>()
const standing = (status: string, endedAt: number) => (status === 'working' ? 'working' : `${status}:${endedAt}`)

// Looks for work of this chat's that has ended since the last look; helpers are never listed, so never announced
const lookEnds = async ($: EngineInterface) => {
  const mine = await sessionName($)
  const cards = (await read($, todos)).filter(one => !one.parentId)
  const runs = (await read($, flows)).filter(f => f.session === mine)
  const now = await $.clock.now()
  const all = [...cards.map(one => ({ id: one.id, status: one.status, endedAt: one.endedAt, waits: one.waits })), ...runs.map(f => ({ id: `flow:${f.id}`, status: f.status, endedAt: f.endedAt, waits: undefined as string[] | undefined }))]
  const was = lastSeen
  lastSeen = new Map(all.map(one => [one.id, standing(one.status, one.endedAt)]))
  if (!was) return
  for (const one of all) {
    const before = was.get(one.id)
    if (one.status === 'working' || before === undefined || before === standing(one.status, one.endedAt)) continue
    if (now - one.endedAt > STALE_END || now - (announced.get(one.id) ?? -Infinity) < AGAIN) continue
    announced.set(one.id, now)
    if (pressed.delete(one.id)) continue
    ready.push({ id: one.id, waits: one.waits })
  }
  if (ready.length && !isSettling) {
    isSettling = true
    $.clock.after(SETTLE, () => void announce($).catch(err => log($, `ready not announced: ${String(err)}`)))
  }
}

// A few words of what work left: the first sentence of what it found, cut short
const fewWords = (text: string) => {
  const found = gistOf(text) || oneLine(text.replace(/[*_`#>]/g, ''))
  const sentence = /^.{12,}?[.!?](?=\s|$)/.exec(found)?.[0] ?? found
  return sentence.length > 140 ? `${sentence.slice(0, 139).trimEnd()}…` : sentence
}

// What one ended piece of work or workflow says in a notification
const readyOf = ({ id, waits: seen }: { id: string; waits?: string[] }, cards: Todo[], runs: Flow[]) => {
  if (id.startsWith('flow:')) {
    const f = runs.find(one => `flow:${one.id}` === id)
    if (!f) return undefined
    const what = f.status === 'done' ? fewWords(f.result) || 'Finished.' : f.status === 'failed' ? 'Stopped by an error.' : 'Stopped.'
    return { title: f.title || f.name || 'Workflow', isDone: f.status === 'done', what }
  }
  const one = cards.find(card => card.id === id)
  if (!one) return undefined
  const waits = one.waits ?? seen ?? []
  const said = [...one.entries].reverse().find(entry => entry.kind === 'note')?.text ?? ''
  const what =
    one.status === 'done'
      ? waits.length
        ? `Waits on ${who()}: ${fewWords(waits[0] ?? '')}${waits.length > 1 ? ` (and ${waits.length - 1} more)` : ''}`
        : fewWords(one.answer) || fewWords(said) || 'Finished.'
      : one.status === 'failed'
        ? 'Stopped by an error.'
        : 'Stopped.'
  return { title: one.title || 'Work', isDone: one.status === 'done', what }
}

// One sound for all that ended together, only when some finished; one notification naming them. config.json switches each off
const announce = async ($: EngineInterface) => {
  isSettling = false
  const ids = ready
  ready = []
  let config: { sound?: unknown; notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves both on
  }
  const cards = await read($, todos)
  const runs = await read($, flows)
  const items = ids.map(one => readyOf(one, cards, runs)).filter(one => one !== undefined)
  if (!items.length) return
  if (config.sound !== false && items.some(one => one.isDone)) void $.audio.play({ asset: READY_SOUND }).catch(err => log($, `ready sound not played: ${String(err)}`))
  if (config.notifications === false) return
  const [first] = items
  const done = items.filter(one => one.isDone).length
  const title = items.length === 1 && first ? first.title : done === items.length ? `${items.length} pieces of work are ready` : `${items.length} pieces of work ended`
  const text = items.length === 1 && first ? first.what : items.map(one => `${one.title}: ${one.isDone ? 'ready' : one.what.replace(/\.$/, '').toLowerCase()}`).join(' · ').slice(0, 300)
  await alertPerson($, 'ready', title, text, `ready-${ids.map(one => one.id).join('-')}`)
}

// What /claudopus and /servers answer where the screen has nowhere to draw a panel, as a Remote Control chat seen from another device
const nowhere = (panel: string) => `The ${panel} panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.`

// The desktop app's own id for the chat this engine runs, which its link `claude://code/continue?session=` opens (read off the
// app: it takes `last` or an id of this shape). Unset in a terminal
const DESKTOP_SESSION = /^local_[A-Za-z0-9-]{1,64}$/

// What a click on a notification opens: this chat in the Claude app, else the app this chat runs in, such as its terminal
const clickOf = async ($: EngineInterface) => {
  const session = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
  if (DESKTOP_SESSION.test(session)) return ['--open', `claude://code/continue?session=${session}`]
  const app = (await $.env.get('__CFBundleIdentifier')) ?? ''
  return /^[A-Za-z0-9.-]{1,200}$/.test(app) ? ['--activate', app] : []
}

// One notification, through the app, else as Claudopus in this Mac's Notification Centre, with its icon, a click opening the
// chat; else, where Claudopus may not notify, macOS's plain one. `what` names it in the log. Work that needs the person (`asks`)
// goes as Claudopus Asks, the amber octopus, and with `chime` its notification carries the "needs you" sound, which macOS plays
// as the person set it for that app and as a Focus allows. Says whether the sound went with the notification. `opens`, a link to
// another chat, is what a click opens instead of this chat; the app's own notification, which opens this chat, is then passed over
const alertPerson = async ($: EngineInterface, what: string, title: string, text: string, key: string, asks?: { chime: boolean }, opens?: string) => {
  const sent = opens !== undefined ? { isSent: false as const, reason: 'another chat' } : await $.ui.notify(text, { title, key: key.slice(0, 200) }).catch(err => ({ isSent: false as const, reason: String(err) }))
  if (sent.isSent || sent.reason === 'disabled' || sent.reason === 'refused') {
    void log($, `${what}: ${title} — ${sent.isSent ? `notified through ${sent.channel}` : `not notified (${sent.reason})`}`)
    return false
  }
  // The desktop app takes no notification from a mod yet (no-surface): Claudopus.app raises it. 0 shown, 5 macOS is asking the
  // person to allow Claudopus and it is shown once they do
  const click = [...(opens ? ['--open', opens] : opens === undefined ? await clickOf($) : []), '--key', key.slice(0, 200)]
  const run = (lead: string[]) => $.process.run([`${$.plugin.root}/bin/notify`, ...lead, '--title', title, '--text', text, ...click]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  const amber = asks ? await run(['--asks', ...(asks.chime ? ['--chime'] : [])]) : undefined
  if (amber && (amber.exitCode === 0 || amber.exitCode === 5)) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${amber.exitCode === 0 ? 'notified through Claudopus Asks' : 'macOS asked to allow Claudopus Asks'}`)
    // Shown now with its sound; one waiting on macOS's question goes without it, so the mod's chime is heard instead
    return amber.exitCode === 0 && asks?.chime === true
  }
  // Claudopus Asks turned off in System Settings, or it failed: the purple Claudopus, without the sound
  const own = await run([])
  const tried = amber ? `Claudopus Asks said ${amber.exitCode}; ` : ''
  if (own.exitCode === 0 || own.exitCode === 5) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}${own.exitCode === 0 ? 'notified through Claudopus' : 'macOS asked to allow Claudopus'}`)
    return false
  }
  // Claudopus notifications turned off in System Settings, or it failed: macOS's plain notification. Elsewhere osascript is
  // missing and nothing is shown
  const mac = await $.process
    .run(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', title, text])
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
  void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}Claudopus said ${own.exitCode}; ${mac.exitCode === 0 ? 'notified through macOS' : `macOS notification failed: ${mac.stderr.slice(0, 120)}`}`)
  return false
}

// The mod's own chime for what needs the person, as bin/notify's for the notification: asks within this long of it are not heard again
const QUIET_CHIME = 5_000
let lastChime = -Infinity
// Work that needs the person's hands says so at once: the panel comes up with its card standing out, and a notification with the
// "needs you" sound. config.json's sound off makes it silent; its notifications off leaves only the mod's own chime. The chime
// plays apart from the notification only where the notification could not carry the sound, so one ask is heard once
const aloud = async ($: EngineInterface, what: string, title: string, text: string, key: string, opens?: string) => {
  let config: { sound?: unknown; notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves both on
  }
  const chime = config.sound !== false
  const isHeard = config.notifications !== false && (await alertPerson($, what, title, text, key, { chime }, opens))
  const now = await $.clock.now()
  if (!chime || isHeard || now - lastChime < QUIET_CHIME) return
  lastChime = now
  void $.audio.play({ asset: READY_SOUND }).catch(err => log($, `ask sound not played: ${String(err)}`))
}
const askAloud = ($: EngineInterface, one: Todo, text: string) => aloud($, 'ask', `${titleOf(one)} needs you`, text, `ask-${one.id}`)

// Claudopus keeps itself up to date: every hour one chat reads the version page on claudopus.ai, and when it names a version other than the one installed runs Claude Code's own update steps for it (the pure parts are in hooks/update.ts)

// ---- Keeping itself up to date (the pure parts are in ./update) ----

// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy not installed from a marketplace (its maker's folder) is never updated
let isUpdating = false
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-look is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
const UPDATE_BUSY = 'busy' as const
const underUpdateLock = async <T,>($: EngineInterface, act: () => Promise<T>): Promise<T | typeof UPDATE_BUSY> => {
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  if (!(await take())) {
    const now = await $.clock.now()
    const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
    if (now - at < UPDATE_LOOK) return UPDATE_BUSY
    const aside = `${lock}.${token.split(' ')[1]}`
    if ((await $.process.run(['mv', lock, aside]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) return UPDATE_BUSY
    await $.process.run(['rm', '-f', aside]).catch(() => undefined)
    if (!(await take())) return UPDATE_BUSY
  }
  try {
    return await act()
  } finally {
    // Only this chat's own lock is removed: one taken over meanwhile is the other chat's
    if ((await readOr($, lock)) === token) await $.process.run(['rm', '-f', lock]).catch(() => undefined)
  }
}
// The Mac, as one look needs it
const lookIo = ($: EngineInterface): LookIo => ({
  read: path => readOr($, path),
  write: (path, text) => $.fs.write(path, text),
  run: (argv, timeoutMs) => $.process.run(argv, { timeoutMs }),
  page: () =>
    Promise.race([
      $.http.fetch(VERSION_PAGE).catch(err => ({ ok: false, status: 0, text: String(err) })),
      new Promise<{ ok: false; status: 0; text: string }>(done => void $.clock.after(VERSION_WAIT, () => done({ ok: false, status: 0, text: 'no answer' }))),
    ]),
  now: () => $.clock.now(),
  log: text => log($, text),
})
const lookAt = async ($: EngineInterface, from: NonNullable<ReturnType<typeof installedFrom>>) =>
  lookOnce(lookIo($), { from, root: $.plugin.root, cwd, engine: (await $.env.get('CLAUDE_CODE_EXECPATH')) || 'claude', stampPath: `${dir}/update.json` })

// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy not installed from a marketplace (its maker's folder) is never updated
const selfUpdate = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from || isUpdating || !dir) return
  // Automatic updates turned off in Config leave the installed version alone
  if ((await readConfig($, dir)).updates === false) return
  const stampPath = `${dir}/update.json`
  if (!isUpdateDue(stampOf(await readOr($, stampPath)), await $.clock.now())) return
  isUpdating = true
  try {
    await underUpdateLock($, async () => {
      // Another chat may have looked between this chat's reading and its lock, and the person may have turned automatic updates
      // off while this chat waited for it
      if (!isUpdateDue(stampOf(await readOr($, stampPath)), await $.clock.now()) || (await readConfig($, dir)).updates === false) return
      await lookAt($, from)
    })
  } finally {
    isUpdating = false
  }
}

// Config's Check for updates: the same look, now, whatever the switch and the hour say. A look already under way here, or another
// chat's, is waited for (CHECK_STEP at a time, up to UPDATE_LOOK, after which a stale lock is taken over), then this one runs, so
// two looks never run at once; it is cheap when the other one already downloaded the newest version
const CHECK_STEP = 3000
const checkForUpdates = async ($: EngineInterface): Promise<{ text: string; isError: boolean }> => {
  const loaded = (await versionsOf($)).version
  const from = installedFrom($.plugin.root)
  if (!dir) return { text: "Couldn't check: Claudopus has no memory folder in this chat.", isError: true }
  if (!from) {
    const page = await lookIo($).page()
    return folderSaid(page.ok ? versionOnPage(page.text) : undefined, loaded)
  }
  const until = (await $.clock.now()) + UPDATE_LOOK + CHECK_STEP
  for (;;) {
    if (!isUpdating) {
      isUpdating = true
      try {
        const look = await underUpdateLock($, () => lookAt($, from))
        if (look !== UPDATE_BUSY) {
          await log($, `Claudopus checked for updates from Config: ${look.kind}${'version' in look && look.version ? ` ${look.version}` : ''}`)
          return checkSaid(look, loaded, isRunFromAfar || isReloadRefused)
        }
      } finally {
        isUpdating = false
      }
    }
    if ((await $.clock.now()) > until) return { text: "Couldn't check: another chat's check did not finish. Try again later.", isError: true }
    await new Promise<void>(done => void $.clock.after(CHECK_STEP, done))
  }
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; nothing
// for a copy run from a folder of its code, which has nothing installed to move to
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) return undefined
  const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
  const id = `${from.plugin}@${from.marketplace}`
  return copyOf(installed, id, $.plugin.root, cwd)
}

// A chat whose copy is older than the one installed loads the new one itself, with Claude Code's own /reload-plugins: the run waits
// until the chat is idle (no turn of its own running), and background work carries on through it. The reload starts this code
// afresh; each ask is kept in reloads/<chat>.json, so a reload that brought back the old copy, or was refused, is not asked again
// for the same version for RELOAD_AGAIN, and a chat never reloads over and over
let reloadAsked = ''
// In a chat the app runs on another Mac over ssh, the engine refuses a /reload-plugins it was not typed in ("isn't available over a
// remote connection in this session"): every one the mod ran there was refused, every one typed was not. There it is not sent, since
// each refusal is a line in the chat, and the header says to type it
let isReloadRefused = false
// A /reload-plugins run from afar loads the new copy but leaves the old one's timers running in the same chat, and copies before
// 0.2.56 send it whatever the connection, each a refused line. They all wait while reloads/<chat>.json names the installed version from under RELOAD_AGAIN ago, so
// in a chat run from afar this copy keeps that mark naming it, looked at every HOLD_EVERY, which is far below their RELOAD_EVERY.
// A copy that a newer load in this chat has replaced (the version this chat ran last is not its own) does nothing, so the holds of
// copies left behind by typed reloads do not pile up
const HOLD_EVERY = 1000
const holdOldCopies = async ($: EngineInterface) => {
  if (!dir) return
  const loaded = (await versionsOf($)).version
  if (!loaded || (await read($, ranVersion)) !== loaded) return
  const copy = await installedCopy($)
  if (!copy?.version) return
  const mark = `${dir}/reloads/${await $.session.id()}.json`
  const before = await readOr($, mark).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const at = typeof before?.at === 'number' ? before.at : 0
  if (before?.version === copy.version && now >= at && now - at < RELOAD_AGAIN / 2) return
  await $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))
}
const reloadToInstalled = async ($: EngineInterface) => {
  if (!dir || reloadAsked || isRunFromAfar) return
  const loaded = (await versionsOf($)).version
  const copy = await installedCopy($)
  if (!loaded || !copy?.version || !isNewer(copy.version, loaded)) return
  const manifest = copy.installPath ? await readOr($, `${copy.installPath}/.claude-plugin/plugin.json`) : ''
  const mark = `${dir}/reloads/${await $.session.id()}.json`
  const before = await readOr($, mark).then(text => {
    try {
      return JSON.parse(text) as { version?: string; at?: number }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  if (!isReloadDue(loaded, copy, manifest, before, now)) return
  reloadAsked = copy.version
  try {
    await $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))
    await log($, `Claudopus ${copy.version} is installed and this chat runs ${loaded}: reloading it`)
    const said = await $.command.run({ command: 'reload-plugins' })
    if (/isn't available/i.test(String((said as { text?: unknown } | undefined)?.text ?? ''))) {
      isReloadRefused = true
      $.ui.invalidate('ui.render')
      await log($, `Claudopus not reloaded to ${copy.version}: the engine refused it over the remote connection; the header says to type /reload-plugins`)
    }
  } catch (err) {
    await log($, `Claudopus not reloaded to ${copy.version}: ${String(err)}`)
  } finally {
    // Settled without this code being replaced (refused, or the old copy came back): the mark decides when to ask again
    reloadAsked = ''
  }
}

// ---- The moment a chat moves to a newer version ----

// The version this chat loaded last, kept through a reload of this code, so the load after it knows what it moved from
const ranVersion = atom({ plugin: 'claudopus', key: 'ran' } as const, '', { shape: 'ran-1' })
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing once
// the load has started whole (isReady), or UPDATED_READY after the load if its start never finishes: in a chat run over ssh the
// start took 6 s, and drawings asked for meanwhile can be dropped as each new change is announced, so a moment begun then could be
// over before one of its drawings arrived. Until then the header is as before, so the octopus's jump and the words keep time
const UPDATED_READY = 15_000
let updatedMoment: { from: string; to: string; loadedAt: number; startedAt: number; isReady: boolean } | undefined
const noteLoaded = async ($: EngineInterface) => {
  updatedMoment = undefined
  const loaded = (await versionsOf($)).version
  if (!loaded) return
  const ran = await read($, ranVersion)
  const mark = await readOr($, `${dir}/reloads/${await $.session.id()}.json`).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; from?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const from = updatedFrom(loaded, ran, mark, now)
  await update($, ranVersion, () => loaded)
  if (!from) return
  updatedMoment = { from, to: loaded, loadedAt: now, startedAt: 0, isReady: false }
  // A panel drawn while this load was still reading has no moment yet: it is drawn again now
  await update($, tick, n => n + 1)
  const moment = updatedMoment
  $.clock.after(UPDATED_READY, () => void (updatedMoment === moment && readyUpdated($)))
  await log($, `Claudopus moved from ${from} to ${loaded} in this chat: the header's octopus turns blue and says so`)
}
// The load has started whole: the moment begins at the next drawing, asked for now
const readyUpdated = async ($: EngineInterface) => {
  if (!updatedMoment || updatedMoment.isReady) return
  updatedMoment.isReady = true
  await update($, tick, n => n + 1)
}
// The sound of the moment, a file of the mod's: three bright rising notes, 0.9 s, made by mockups/claudopus-sound/updated.py
const UPDATED_SOUND = 'sounds/updated.wav'
// The sound plays once for each version on this Mac, however many chats move to it: the first to begin its moment makes the file
// updated/<version> (made only where none is, the shell's noclobber) and plays it; config.json's sound off keeps it silent
const playUpdated = async ($: EngineInterface, version: string) => {
  if (!dir || !/^[0-9A-Za-z.+-]{1,40}$/.test(version)) return
  let config: { sound?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves the sound on
  }
  if (config.sound === false) return
  const played = `${dir}/updated/${version}`
  const made = await $.process
    .run(['sh', '-c', 'mkdir -p "$(dirname "$1")" && set -C && : > "$1"', 'sh', played])
    .catch(() => ({ exitCode: 1 }))
  if (made.exitCode !== 0) return
  // A sound that could not play leaves the version free for the next chat that moves to it
  await $.audio.play({ asset: UPDATED_SOUND }).catch(async err => {
    await $.process.run(['rm', '-f', played]).catch(() => undefined)
    await log($, `updated sound not played: ${String(err)}`)
  })
}
// The moment as it stands now, while it lasts: the name line's pieces in Claudopus's workflow blue, the panel drawing the blue
// octopus beside them. The panel is drawn again only where the look changes, at UPDATED_SAYS and at its end (see UPDATED_SAYS)
const updatedPieces = async ($: EngineInterface, version: string) => {
  const moment = updatedMoment
  if (!moment || moment.to !== version) return undefined
  const now = await $.clock.now()
  // Drawn while the load is still starting: nothing of it yet
  if (!moment.isReady) return undefined
  if (!moment.startedAt) {
    if (now - moment.loadedAt > UPDATED_LATE) return void (updatedMoment = undefined)
    moment.startedAt = now
    void playUpdated($, moment.to)
    for (const at of [UPDATED_SAYS, UPDATED_FOR]) $.clock.after(at + 20, () => void (updatedMoment === moment && update($, tick, n => n + 1)))
  }
  const look = updatedLook(moment.to, now - moment.startedAt)
  if (!look && updatedMoment === moment) updatedMoment = undefined
  return look
}
const nameLine = (ui: Ui, pieces: NonNullable<ReturnType<typeof updatedLook>>) => (
  // "Claudopus" first, then the word or version beside it
  <ui.Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
    {pieces.map((piece, i) => (
      <ui.Box key={`head-name-${i}`} flexDirection="row" flexShrink={i ? 1 : 0} minWidth={0}>
        <ui.Text key={`head-name-${i}-0`} wrap="truncate-end" color={FLOW} bold>
          {piece.text}
        </ui.Text>
      </ui.Box>
    ))}
  </ui.Box>
)

// The changelog: a tab About opens with every version's changes, and the screen a newer version shows over the whole panel with
// the changes the person did not have yet (the pure parts are in hooks/changelog.ts)

const CHANGELOG_PANE = 'changelog'
const CHANGELOG_TITLE = 'Changelog'
const CHANGELOG_PAGE = 'https://claudopus.ai/changelog.html'
// The mod's own copy of CHANGELOG.md, read once a load: it changes only with the mod
let changelogRead: Promise<Version[]> | undefined
const versionsLogged = ($: EngineInterface) => {
  changelogRead ??= readOr($, `${$.plugin.root}/CHANGELOG.md`).then(changelogOf)
  return changelogRead
}
const openChangelog = async ($: EngineInterface) => {
  presses += 1
  await front($, CHANGELOG_PANE, CHANGELOG_TITLE)
}

// One version: its number, its date, and a line for each change
const versionBand = (ui: Ui, key: string, v: Version, side: string) =>
  band(
    ui,
    key,
    `v${v.version}`,
    side,
    <ui.Box flexDirection="column">
      {v.changes.map((one, i) => (
        <ui.Box key={`${key}-${i}`} flexDirection="row" gap={1}>
          <ui.Box flexShrink={0}>
            <ui.Text dimColor>•</ui.Text>
          </ui.Box>
          <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
            <ui.Text wrap="wrap">{one}</ui.Text>
          </ui.Box>
        </ui.Box>
      ))}
    </ui.Box>,
  )
// Older versions a tab left out, with where to read them
const olderLine = (ui: Ui, key: string, left: number, onPress?: () => void) =>
  left ? (
    <ui.Box key={key} flexDirection="row" flexWrap="wrap" gap={1} paddingX={2} flexShrink={0}>
      <ui.Text dimColor>{`${left} earlier ${left === 1 ? 'version' : 'versions'}:`}</ui.Text>
      {onPress ? <ui.Button key={`${key}-open-${presses}`} label="Open the changelog" plain onPress={onPress} /> : <ui.Text><ui.Link href={CHANGELOG_PAGE} label="claudopus.ai/changelog" /></ui.Text>}
    </ui.Box>
  ) : null

// The Changelog tab: every version, newest first, the one this chat runs marked; a very long one ends where the app's limit
// would, the rest on the site
const changelogView = async ($: EngineInterface, ui: Ui, surface?: string) => {
  const versions = await versionsLogged($)
  const { version } = await versionsOf($)
  const { shown, left } = fitted(versions, TAB_BUDGET)
  return (
    <ui.Box key="changelog" flexDirection="column" gap={1} flexGrow={1}>
      <ui.Box key="changelog-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, 'changelog-mark', 'mark', HEAD_MARK, 'Claudopus', $, { surface })}
        <ui.Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <ui.Text bold>Changelog</ui.Text>
          <ui.Text dimColor wrap="wrap">What changed in each version, newest first.</ui.Text>
        </ui.Box>
      </ui.Box>
      {shown.length ? null : <ui.Text dimColor>This copy of Claudopus has no changelog.</ui.Text>}
      {shown.map(v => versionBand(ui, `changelog-${v.version}`, v, [v.date, v.version === version ? 'this chat' : ''].filter(Boolean).join(' · ')))}
      {olderLine(ui, 'changelog-older', left)}
    </ui.Box>
  )
}

// ---- The update screen ----

// seen.json: the newest version whose changes the person has seen on this Mac. A chat that runs a newer one shows them over its
// whole panel until the person closes it there, which writes this version; then no chat on the Mac shows it again
const seenPath = () => `${dir}/seen.json`
const writeSeen = ($: EngineInterface, version: string) => $.fs.write(seenPath(), JSON.stringify({ version }))
// At a load: a Mac with no record yet starts it from the version it ran before, so the first update to a version with this screen
// shows it too: the version this chat just moved from, else the newest older copy Claude Code keeps installed beside this one (a
// chat started fresh on the new version); else from the version loaded, so a first install shows nothing
const noteSeen = async ($: EngineInterface) => {
  if (!dir || seenIn(await readOr($, seenPath()))) return
  const loaded = (await versionsOf($)).version
  if (!loaded) return
  const root = $.plugin.root.replace(/\/+$/, '')
  const copies = installedFrom(root) ? (await $.fs.list(root.slice(0, root.lastIndexOf('/'))).catch(() => [])).map(one => one.name) : []
  const start = (updatedMoment?.to === loaded && updatedMoment.from) || previousOf(copies, loaded) || loaded
  await writeSeen($, start)
  // A panel drawn before the record was written is drawn again, with the screen if it is due
  if (start !== loaded) await update($, tick, n => n + 1)
}
// Closing the screen, at its version or a newer one another chat closed meanwhile
let screenSounded = ''
const closeScreen = async ($: EngineInterface, version: string) => {
  presses += 1
  if (!isNewer(seenIn(await readOr($, seenPath())), version)) await writeSeen($, version)
  $.ui.invalidate('ui.render')
}
// The screen, over the panel: the blue happy octopus jumping, the version moved to, the changes of every version after the one seen
// last, and the way back. Nothing in a copy a newer load of this chat replaced, nor for a version whose changes were seen
const updateScreen = async ($: EngineInterface, ui: Ui, loaded: string, asks: number, surface?: string) => {
  if (!dir || !loaded) return undefined
  const seen = seenIn(await readOr($, seenPath()))
  if (!isScreenDue(loaded, seen) || (await read($, ranVersion)) !== loaded) return undefined
  const { shown, left } = missedOf(await versionsLogged($), seen, loaded)
  // The screen is the moment, bigger: the header's is not played behind it, and the sound plays once for the version on this Mac
  if (updatedMoment) updatedMoment = undefined
  if (screenSounded !== loaded) void playUpdated($, (screenSounded = loaded))
  const back = (key: string) => (
    <ui.Box key={key} flexDirection="row" flexWrap="wrap" gap={1} flexShrink={0}>
      <ui.Button key={`${key}-close-${presses}`} label="Back to the panel" hotkey="b" onPress={() => void closeScreen($, loaded).catch(err => log($, `update screen not closed: ${String(err)}`))} />
      <ui.Button key={`${key}-log-${presses}`} label="Changelog" plain onPress={() => void openChangelog($).catch(err => log($, `changelog not opened: ${String(err)}`))} />
    </ui.Box>
  )
  const count = shown.length + left
  return (
    <ui.Box key="update-screen" flexDirection="column" gap={1} flexGrow={1} {...(surface === 'terminal' ? { width: '100%' } : {})}>
      {/* The terminal leaves a column's rows as wide as what they hold, so there the head is made as wide as the panel to centre in it */}
      <ui.Box key="update-head" flexDirection="column" alignItems="center" gap={1} backgroundColor={FILL} paddingX={2} paddingY={2} flexShrink={0} {...(surface === 'terminal' ? { width: '100%' } : {})}>
        {octopus(ui, 'update-mark', 'updated', UPDATE_MARK, `Claudopus, updated to ${loaded}`, $, { surface, requestId: LIST })}
        <ui.Text bold color={FLOW}>Claudopus updated</ui.Text>
        <ui.Text dimColor wrap="wrap">{`v${seen} → v${loaded}${count > 1 ? ` · ${count} versions` : ''}`}</ui.Text>
      </ui.Box>
      {back('update-top')}
      {asks ? <ui.Text key="update-asks" color={NEEDS} wrap="wrap">{`${asks === 1 ? 'Something needs' : `${asks} things need`} you: go back to the panel to see ${asks === 1 ? 'it' : 'them'}.`}</ui.Text> : null}
      <ui.Text key="update-new" bold>{"What's new"}</ui.Text>
      {shown.length ? null : <ui.Text dimColor>This version has no changes written down.</ui.Text>}
      {shown.map(v => versionBand(ui, `update-${v.version}`, v, v.date))}
      {olderLine(ui, 'update-older', left, () => void openChangelog($).catch(err => log($, `changelog not opened: ${String(err)}`)))}
      {shown.length > 1 ? back('update-bottom') : null}
    </ui.Box>
  )
}
// The octopus on the update screen, twice the header's
const UPDATE_MARK = 96

// The asking card: an ask's text to copy, its buttons and reply box, and the answer reaching the work

// An ask's text put on the clipboard; its button says so for two seconds, and a later copy starts its own two seconds
let copiedKey = ''
let copies = 0
const copyAsk = ($: EngineInterface, id: string, text: string, surface: RenderSurface) =>
  void $.ui
    .copy({ text, surface })
    .then(r => {
      presses += 1
      const made = (copies += 1)
      copiedKey = r.isCopied ? id : ''
      if (!r.isCopied) void log($, `copy not made: ${r.reason}`)
      redraw($)
      $.clock.after(2000, () => void (copies === made && ((copiedKey = ''), redraw($))))
    })
    .catch(err => log($, `copy not made: ${String(err)}`))

// A command to type opens in Terminal only when the person presses its button, typed at the prompt in the folder it is for and never
// run: Return runs it. The app opens its own terminal tabs only for Claude, never for a plugin's own code, so it is the Mac's Terminal.
// A small zsh start folder of its own reads the person's own start files, then types the command with `print -z`; folders an hour
// old are cleared as the next one is made. A chat drawn on another Mac, or work on another Mac, has no button: this Mac is not theirs
let openedKey = ''
let opens = 0
const zshQuoted = (text: string) => `'${text.replaceAll("'", `'\\''`)}'`
const canOpenTerminal = (one: Todo) => Boolean(one.ask?.isCommand && one.ask.copy) && !one.chat?.host && !isRunFromAfar
const terminalFiles = (folder: string, home: string) => ({
  // Their own .zshenv runs first; one that moves ZDOTDIR to their own folder is followed there afterwards, not before ours runs
  '.zshenv': [
    '[[ -f "${_CLAUDOPUS_DOT:-$HOME}/.zshenv" ]] && source "${_CLAUDOPUS_DOT:-$HOME}/.zshenv"',
    `if [[ "$ZDOTDIR" != ${zshQuoted(home)} ]]; then _CLAUDOPUS_DOT="$ZDOTDIR"; ZDOTDIR=${zshQuoted(home)}; fi`,
    '',
  ].join('\n'),
  // Then their own .zshrc, from their own folder, with the history file theirs again (the Mac's /etc/zshrc set it from ours)
  '.zshrc': [
    `_claudopus_here=${zshQuoted(home)}`,
    'if [[ -n "$_CLAUDOPUS_DOT" ]]; then ZDOTDIR="$_CLAUDOPUS_DOT"; else unset ZDOTDIR; fi',
    'unset _CLAUDOPUS_DOT',
    '[[ "$HISTFILE" == "$_claudopus_here"/* ]] && HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"',
    '[[ -f "${ZDOTDIR:-$HOME}/.zshrc" ]] && source "${ZDOTDIR:-$HOME}/.zshrc"',
    `if cd ${zshQuoted(folder)} 2>/dev/null; then`,
    "  print -P '%F{3}Claudopus typed the command below. Press Return to run it.%f'",
    'else',
    `  print -r -- $'\\e[33mClaudopus typed the command below, but its folder was not found:\\e[0m '${zshQuoted(folder)}`,
    'fi',
    'print -rz -- "$(<"$_claudopus_here/command.txt")"',
    'unset _claudopus_here',
    '',
  ].join('\n'),
  // Terminal's own saved sessions are left out of this one window, so its history stays the person's own file
  'open.command': ['#!/bin/zsh', `cd ${zshQuoted(folder)} 2>/dev/null`, 'export _CLAUDOPUS_DOT="${ZDOTDIR-}" SHELL_SESSIONS_DISABLE=1', `ZDOTDIR=${zshQuoted(home)} exec /bin/zsh -i`, ''].join('\n'),
})
const openTerminal = async ($: EngineInterface, one: Todo) => {
  const ask = one.ask
  if (!ask?.copy || !canOpenTerminal(one)) return
  const at = await $.clock.now()
  const made = (opens += 1)
  const base = `${dir}/terminal`
  const home = `${base}/${slug(one.id) || 'work'}-${at}`
  await $.fs.write(`${home}/command.txt`, ask.copy)
  for (const [name, text] of Object.entries(terminalFiles(ask.cwd || cwd, home))) await $.fs.write(`${home}/${name}`, text)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/open.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/open.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  presses += 1
  openedKey = r.exitCode === 0 ? `${one.id}:${ask.at}:${ask.copy}` : ''
  if (r.exitCode !== 0) void log($, `terminal not opened: ${r.stderr.trim().slice(0, 160)}`)
  redraw($)
  $.clock.after(3000, () => void (opens === made && ((openedKey = ''), redraw($))))
}

// The person's answer to an ask, a button pressed or a reply in their own words: to work under way, a message it reads at its next
// step; to work that has ended, a message that starts it again. Either way the ask goes at once, and the card
// says briefly what was answered; the work turns amber again only by asking again
const replies = new Map<string, number>()
// Each ask its own mark, so its reply box is a new one, empty, when the work asks something new, and the same one while it is held
const askMark = (ask: NonNullable<Todo['ask']>) => `${ask.at}-${[...ask.text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36)}`
// What the person has typed into a reply box and not sent, by the work, so a redraw keeps it
const drafts = new Map<string, string>()
// While the person types into a reply box the list's running times stand still: the list is drawn again each second, and a box in
// a list drawn that often lost its place and threw the panel to the bottom. Each letter typed, or the box taking the focus, holds
// the times for TYPING more; sending lets them go
const TYPING = 30_000
let typing = 0
let isTyping = false
const holdTimes = ($: EngineInterface) => {
  const made = (typing += 1)
  isTyping = true
  $.clock.after(TYPING, () => void (typing === made && (isTyping = false)))
}
const freeTimes = () => void ((typing += 1), (isTyping = false))
// The last answer given to each work's ask, shown on its card for a while after: sent to the work (which reads a message only at
// its next step, so it says so until that step starts), read by it, or sent to the chat when the work had ended
type Sent = { text: string; ask: string; to: 'work' | 'read' | 'chat' | 'other' | 'lost'; at: number; line?: string; isHeld?: boolean }
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
const lineOf = (one: Todo) => { const last = [...one.entries].reverse().find(entry => entry.kind !== 'steer'); return last ? `${last.at}:${last.text}` : '' }
// How long the card says what was answered, unless the work writes a newer line first
const ANSWER_SHOWN = 60_000
// The answers every ask offers when the work gave none of its own
const DEFAULT_ANSWERS = ['Done', 'Not now']
const sentReplies = new Map<string, Sent>()
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
const pending = new Map<string, string>()
// The asks of this chat's work already answered, by work and when it asked
const answeredAsks = new Set<string>()
// Answers on their way, so a press hook can wait for the one its press started (a button's handler does not await it)
const answersOnWay = new Set<Promise<unknown>>()
const answerAsk = ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  const run = answerNow($, one, choice, isReply)
  if (one.chat) return run
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
// Whether an answer settles its ask: a press does, and so does a reply to an ask that wanted words (it gave no buttons of its own)
// or one that begins with the words of one of its buttons. Any other reply, such as a request first, leaves the ask open while the work acts on it
const plainWords = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const settles = (ask: NonNullable<Todo['ask']>, said: string, isReply: boolean) =>
  !isReply || !ask.choices?.length || ask.choices.some(choice => plainWords(choice) && `${plainWords(said)} `.startsWith(`${plainWords(choice)} `))
const answerNow = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  if (one.chat) return answerElsewhere($, one, choice, isReply)
  const ask = one.ask
  const said = choice.trim()
  if (!ask || !said) return
  const target = ask.from ?? one.id
  if (!settles(ask, said, isReply)) return holdAsk($, one, ask, said, target)
  // The amber goes and the box clears at once. Only the first answer to the ask it was made for counts: a second press, or a press
  // on an ask the work has since replaced, sends nothing. Marked before anything is awaited, so two presses at once count once
  const asked = `${one.id}:${ask.at}:${ask.text}`
  if (answeredAsks.has(asked)) return
  answeredAsks.add(asked)
  const at = await $.clock.now()
  let isCleared = false
  await update($, todos, list =>
    list.map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isCleared = true), { ...card, ask: undefined, entries: [...card.entries, { at, kind: 'steer' as const, text: isReply ? said : `${said} — to: ${ask.text}` }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isCleared) return
  drafts.delete(one.id)
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  if (isReply) freeTimes()
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line })
  redraw($)
  void askGone($, one, said)
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your ask ("${ask.text}"), in their own words: ${said}` : `${who(true)} pressed "${said}" in answer to your ask: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn(target, one.id), sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line }), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line })
}
// A reply in the person's own words that does not settle the ask: the ask stays open on the card, with the reply under it, and the
// work is told so; its card stays among the running cards while the work acts on it. A button pressed later still answers it
const holdAsk = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, target: string) => {
  // The same words twice at once count once; typed again later, after an earlier reply, they go again
  const key = `${one.id}:${ask.at}:${ask.text}:reply:${ask.replied?.at ?? ''}:${said}`
  if (answeredAsks.has(key)) return
  answeredAsks.add(key)
  const at = await $.clock.now()
  let isHeld = false
  await update($, todos, list =>
    list.map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isHeld = true), { ...card, ask: { ...card.ask, replied: { text: said, at } }, entries: [...card.entries, { at, kind: 'steer' as const, text: said }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isHeld) return
  // The box keeps its place, emptied, so the focus does not fall onto the ask's first button, which a stray key would press
  drafts.delete(one.id)
  freeTimes()
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line })
  redraw($)
  if (inChat.has(one.id)) void sayInChat($, named(ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`)))
  const working = (await read($, todos)).find(card => card.id === target)?.status === 'working'
  const to = `${who(true)} replied to your ask ("${ask.text}"), in their own words: ${said}\n${named(REPLY_HOLDS)}`
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn(target, one.id), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line })
}
// An answer to work that has ended starts that work again with it, as a message to it: the chat then gets the work's report as
// it gets any, and nothing goes into the chat in the person's place.
// The engine runs what a mod sends from outside its hooks (a timer, a button's own handler) under the mod's own origin, and work
// started again that way runs with every hook of the mod skipped: each of its panel tools answered "no tool.call hook answered",
// and its ask never reached the card. So the message waits here and is sent from inside a hook (the press's or the reply's own,
// a prompt, the end of a turn, a change in how full the chat is), where the work it wakes keeps its tools. Not from a tool call's
// hook: the engine leaves the calling hook out of what that call raises, and may of what it starts, and work woken there could miss its own tool calls' hook. One no hook takes within WAKE_WAIT, in a chat where
// nothing runs, is sent from the timer all the same: the work does what it was asked, and its rules have it end with any ask as
// its report's first line when the panel does not answer, which the chat puts to the person. One a copy a reload replaced still
// holds goes to the chat instead: a notice the person sees and a row its model reads, with no turn of its own
const WAKE_WAIT = 4000
// Each wake carries every answer joined into it, so each card's line and the chat's notice are settled for every one
const wakes: { target: string; text: string; answers: { one: Todo; sent: Omit<Sent, 'to'> }[] }[] = []
const toEnded = async ($: EngineInterface, one: Todo, target: string, text: string, sent: Omit<Sent, 'to'>) => {
  // Marked on its way before it is sent, so a run that starts before the send resolves counts as reading it
  pending.set(target, one.id)
  sentReplies.set(one.id, { ...sent, to: 'work' })
  redraw($)
  // One message for a work: a second answer for the same one joins the first
  const same = wakes.find(w => w.target === target)
  if (same) return void ((same.text = `${same.text}\n\n${text}`), same.answers.push({ one, sent }))
  const wake = { target, text, answers: [{ one, sent }] }
  wakes.push(wake)
  void $.clock.after(WAKE_WAIT, () => {
    const at = wakes.indexOf(wake)
    if (at < 0) return
    wakes.splice(at, 1)
    void log($, `work ${target} started again from a timer: no hook of the mod ran within ${WAKE_WAIT / 1000} s, so its panel tools will not answer`)
    void sendWake($, wake)
  })
}
// Sends what waits, from inside the hook that calls it; a press's or a reply's hook first waits for the answer it started
const sendWakes = async ($: EngineInterface, isAnswering = false) => {
  if (isAnswering && answersOnWay.size) await Promise.allSettled([...answersOnWay])
  while (wakes.length) {
    const wake = wakes.shift()
    if (wake) await sendWake($, wake)
  }
}
const sendWake = async ($: EngineInterface, wake: (typeof wakes)[number]) => {
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await $.session.send({ to: { agentId: wake.target }, text: wake.text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return wakeFailed($, wake, r.reason)
  // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
  await wakeCard($, wake.target)
  // Started by the message, the work reads it in the run it starts: that run's end never sends it a second time, even when no hook
  // of the mod saw its steps (a wake from the timer)
  for (const { one, sent } of wake.answers) startedBy.add(`${one.id}:${sent.at}`)
}
// The answers, by card and when given, that started their work again: the run each started reads it
const startedBy = new Set<string>()
// An answer written into work under way, which reads it at a step of its own: an earlier wake's run no longer covers this card
const writtenIn = (target: string, card: string) => {
  pending.set(target, card)
  for (const key of startedBy) if (key.startsWith(`${card}:`)) startedBy.delete(key)
}
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
const wakeCard = async ($: EngineInterface, target: string) => {
  const now = await $.clock.now()
  await update($, todos, list => list.map(card => (card.id !== target || card.status === 'working' ? card : (endedByHandback.delete(target), resumed(card, now)))))
}
const wakeFailed = async ($: EngineInterface, { target, answers }: (typeof wakes)[number], reason: string) => {
  if (answers.some(({ one }) => pending.get(target) === one.id)) pending.delete(target)
  await log($, `work ${target} not started again with an answer: ${reason}`)
  for (const { one, sent } of answers) {
    sentReplies.set(one.id, { ...sent, to: 'chat' })
    const said = named(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text))
    $.ui.log(said)
    await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: `${said}\n${named(ANSWER_FOR_CHAT_RELAY)}` }] } }).catch(err => log($, `chat not told of an answer: ${String(err)}`))
  }
  redraw($)
}
// Every ask of this chat's work is also sent into the chat, as a message from the mod, with its answers and pictures: the chat
// shows it to the person, and an answer they type there goes to the work as a press on the card does. Kept by card, so an ask
// answered or withdrawn on the card is said in the chat too, and the same ask is never sent twice
const inChat = new Map<string, string>()
const askKey = (ask: NonNullable<Todo['ask']>) => JSON.stringify([ask.text, ask.choices ?? [], ask.pictures ?? [], ask.copy ?? ''])
const askInChat = async ($: EngineInterface, one: Todo) => {
  const ask = one.ask
  if (!ask || isOff || !dir || inChat.get(one.id) === askKey(ask)) return
  inChat.set(one.id, askKey(ask))
  const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
  // The person sees the ask as the mod's notice in the chat: a prompt the mod submitted would be drawn by the desktop app as the
  // person's own message, and a chat cannot send itself a message from another session. Its model reads the ask in a row of its
  // own, with how to pass an answer on; neither starts a turn
  // The terminal draws a notice as one line and a line break in it as a broken character: there each line is a notice of its own
  const notice = named(ASK_IN_CHAT(titleOf(one), ask, answers))
  const surfaces = await $.session.surfaces().catch(() => [])
  for (const line of surfaces.length && surfaces.every(s => s === 'terminal') ? notice.split('\n') : [notice]) $.ui.log(line)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(err => (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, `chat not told of an ask: ${String(err)}`)))
}
// A line in the chat the person sees (the mod's notice, which the model never reads) and its model reads (a row the person does not
// see), sent with no turn of its own. The notice is the mod's log line: the desktop app leaves out a system row the mod appends
const sayInChat = async ($: EngineInterface, text: string) => {
  $.ui.log(text)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } }).catch(err => log($, `chat not told: ${String(err)}`))
}
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
const askGone = async ($: EngineInterface, one: Todo, said?: string) => {
  if (!inChat.has(one.id)) return
  inChat.delete(one.id)
  await sayInChat($, named(said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`)))
}
// The person's answer typed in the chat, passed on by the chat to the work: once on its way the card stops asking and says what was
// answered, and a helper that asked is told too when the chat sent it to the work it helps; refused, the ask stays to be answered
const answeredInChat = async ($: EngineInterface, a: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number }, to: string, isSent: boolean) => {
  if (!isSent) return void answeredAsks.delete(a.key)
  // Words that do not settle an ask with buttons of its own leave it open, as a reply on the card does; a later answer still counts
  const isHeld = !settles(a.ask, a.words, true)
  if (isHeld) answeredAsks.delete(a.key)
  else inChat.delete(a.card.id)
  await update($, todos, all => all.map(one => (one.id === a.card.id && one.ask?.at === a.ask.at && one.ask.text === a.ask.text ? { ...one, ask: isHeld ? { ...one.ask, replied: { text: a.words, at: a.at } } : undefined } : one)))
  drafts.delete(a.card.id)
  sentReplies.set(a.card.id, { text: a.words, ask: a.ask.text, to: 'work', at: a.at, line: lineOf(a.card) })
  writtenIn(to, a.card.id)
  const helper = a.ask.from && a.ask.from !== to ? (await read($, todos)).find(one => one.id === a.ask.from && one.status === 'working') : undefined
  if (helper) await tell($, helper.id, `${who(true)} answered your ask ("${a.ask.text}") in the chat, in their own words: ${a.words}`)
  redraw($)
}
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
const replyAfter = async ($: EngineInterface, one: Todo, said: string, asked: string) => {
  const told = one.status === 'working' ? await tell($, one.id, `${who(true)} added, in their own words, to their answer to your ask ("${asked}"): ${said}`) : undefined
  if (told && !told.deny) return
  const at = await $.clock.now()
  await toEnded($, one, one.id, `${who(true)} added, in their own words, to their answer to your ask ("${asked}"): ${said}\n${RESUMED_BY_ANSWER}`, { text: said, ask: asked, at, line: lineOf(one) })
}
// The work an answer was written into starts its next step: that step reads it
const replyRead = ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  if (sent?.to === 'work') (sentReplies.set(card, { ...sent, to: 'read' }), redraw($))
}
// Work whose run ended with an answer written in but never read is started again with it
const replyUnread = async ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined || wakes.some(w => w.target === agentId)) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  // The run that ends was started by the answer itself: it read it
  if (sent && startedBy.delete(`${card}:${sent.at}`)) return void (sent.to === 'work' && (sentReplies.set(card, { ...sent, to: 'read' }), redraw($)))
  const one = (await read($, todos)).find(todo => todo.id === card)
  if (sent?.to !== 'work' || !one) return
  const isHeld = one.ask?.replied?.text === sent.text
  await toEnded($, one, agentId, `${who(true)} ${isHeld ? 'replied to' : 'answered'} your ask ("${sent.ask}"), and you ended before reading it: ${sent.text}${isHeld ? `\n${named(REPLY_HOLDS)}` : ''}\n${RESUMED_BY_ANSWER}`, sent)
}
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
const sentLine = (one: Todo, now: number) => {
  const sent = sentReplies.get(one.id)
  // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
  const replied = one.ask?.replied
  if (replied && !(sent && sent.ask === one.ask?.text && (sent.text === replied.text || sent.isHeld))) return `✓ You replied “${cut(replied.text, 60)}”; it still asks this`
  if (!sent) return ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}”. That Mac could not be reached; answer it in its own chat` : ''
  const newer = lineOf(one) !== sent.line
  const isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || one.ask.replied?.text === sent.text))
  if ((one.ask && !isHeld) || (!isHeld && (newer || now - sent.at > ANSWER_SHOWN))) return ''
  const how = {
    work: 'it reads this at its next step',
    read: 'it has read it',
    chat: 'left in the chat, which carries the work on',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose work reads it at its next step`,
  }[sent.to]
  if (isHeld) return `✓ You replied “${cut(sent.text, 60)}” · ${sent.to === 'read' ? (one.status === 'working' ? 'it is acting on it' : 'it has read it') : how}; it still asks this`
  return `✓ You answered “${cut(sent.text, 60)}” · ${how}`
}

// Every chat's work in every chat's panel: this chat's file, the others' read, chats opened and answered from another chat
// (../../mods/claudopus/hooks/shared.ts says how)

// ---- The work of every chat, in every chat's panel (shared.ts says how) ----

const others = atom({ plugin: 'claudopus', key: 'others' } as const, [], { shape: 'others-1' })
const liveDir = () => `${dir}/${LIVE_DIR}`
// What this chat last wrote to its file and when: written again when it changes or its beat is due, with work or without, so the
// panels of other Macs list it as open. It is removed as the chat ends
let sharedSign = ''
let sharedAt = 0
const ownLive = (id: string) => `${liveDir()}/${id}.json`
// Set as the session ends, so a beat due after it does not write the file again
let isEnded = false
// What opens this chat in the Claude app, read off the engine's own file of this session in ~/.claude/sessions (its Remote Control id
// appears there once Remote Control is on) at most once a beat; the file found is read again alone until it no longer names this chat
let myLink: Link | undefined
let linkReadAt = 0
let linkFile = ''
const readLink = async ($: EngineInterface, id: string): Promise<Link | undefined> => {
  const folder = `${(await $.env.get('HOME')) ?? ''}/.claude/sessions`
  type Entry = { sessionId?: string; hostSessionId?: string; bridgeSessionId?: string; updatedAt?: number }
  const entryOf = async (name: string) => JSON.parse((await readOr($, `${folder}/${name}`)) || '{}') as Entry
  let found = linkFile ? await entryOf(linkFile).catch(() => ({}) as Entry) : ({} as Entry)
  if (found.sessionId !== id) {
    linkFile = ''
    found = {}
    for (const entry of await $.fs.list(folder).catch(() => [])) {
      if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue
      const one = await entryOf(entry.name).catch(() => ({}) as Entry)
      if (one.sessionId === id && (one.updatedAt ?? 0) >= (found.updatedAt ?? 0)) ((found = one), (linkFile = entry.name))
    }
  }
  const host = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
  const bridge = typeof found.bridgeSessionId === 'string' && BRIDGE_ID.test(found.bridgeSessionId) ? found.bridgeSessionId : ''
  const app = APP_ID.test(host) ? host : typeof found.hostSessionId === 'string' && APP_ID.test(found.hostSessionId) ? found.hostSessionId : ''
  return bridge || app ? { bridge, app } : undefined
}
const shareMine = async ($: EngineInterface) => {
  const { id, title } = await read($, me)
  if (!id || !dir || isOff || isEnded) return
  const now = await $.clock.now()
  if (now - linkReadAt >= BEAT) {
    linkReadAt = now
    myLink = await readLink($, id).catch(() => myLink)
  }
  const cards = shareable(await read($, todos), now)
  const prompts: Prompt[] = waiting.map(({ id: one, text, title: from, at }) => ({ id: one, text, ...(from ? { title: from } : {}), at }))
  const sign = `${title}\n${JSON.stringify(myLink ?? null)}\n${signOf(cards)}\n${prompts.map(one => one.id).join(' ')}`
  if (sign === sharedSign && now - sharedAt < BEAT) return
  const s: Shared = { chat: id, title, folder: cwd, host: '', at: now, cards, ...(prompts.length ? { prompts } : {}), ...(myLink ? { link: myLink } : {}) }
  // Ended work is written apart, under `ended`: a chat still running a version from before ended work was shared reads `cards` only,
  // and would show what is there as running for good
  const isLive = (one: Todo) => one.status === 'working' || Boolean(one.ask)
  const ended = cards.filter(one => !isLive(one))
  await $.fs.write(ownLive(id), JSON.stringify({ ...s, cards: cards.filter(isLive), ...(ended.length ? { ended } : {}) }))
  sharedSign = sign
  sharedAt = now
}
// This chat's file goes as its session ends, and when it starts (a file a crash or a reload left behind): the others drop its cards
// at once, not after STALE
const unshare = async ($: EngineInterface, isSure = false) => {
  const { id } = await read($, me)
  if (!id || !dir || (!sharedSign && !isSure)) return
  sharedSign = ''
  if (await $.fs.exists(ownLive(id)).catch(() => false)) await $.process.run(['rm', '-f', ownLive(id)]).catch(() => undefined)
}
let pushedYou = ''
let pushedLatest = ''
// Whether this Mac lists other Macs' chats, and what it calls itself beside them
const isMulti = () => macs.length > 0 || pushedFrom.size > 0
const selfName = () => (isMulti() ? pushedYou || localName : '')

// When this panel saw each of another chat's pieces of work end, by its id here; 0 for one that had ended well before
const endSeen = new Map<string, number>()
const SEEN_ENDING = 60_000
// Whether ended work is in its pause after ending: this chat's from its end, another chat's from when this panel saw it end
const lingers = (one: Todo, at: number) => {
  if (!one.chat) return isLingering(one, at)
  const seen = endSeen.get(one.id) ?? 0
  return one.status !== 'working' && seen > 0 && at >= seen && at - seen < LINGER
}
// Another chat's running work as last read, by its id here, with its chat: a chat on a version from before ended work was shared
// drops a card from its file as the work ends, saying nothing of how. Such a card, gone while its chat is still there, is shown
// finished for its pause, green with the happy octopus as any other finish, and is then gone: what is not known is not kept
const lastRunning = new Map<string, { chat: string; card: Todo; at: number; of: Shared }>()
// The cards shown finished that way, by id here, with when they were seen gone; only for their pause
const vanished = new Map<string, { chat: string; card: Todo; at: number; of: Shared }>()
const isVanished = (id: string) => vanished.has(id)
// The files of other chats, as last read, by name: a file is read again only when it changed
const liveRead = new Map<string, { key: string; text: string }>()
const isWhole = (text: string) => {
  try {
    return Boolean(JSON.parse(text))
  } catch {
    return false
  }
}
const readOthers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const now = await $.clock.now()
  const wasSelf = `${isMulti()}:${selfName()}`
  // What other Macs handed this one: a copy not handed again for STALE (that Mac asleep or its chats closed) says nothing now
  const pushed: Shared[] = []
  // Every chat still open, with or without anything going on, as host/chat
  const open = new Set<string>()
  // Gathered apart and put in place at the end, so what this Mac knows of them holds while they are read
  const from = new Set<string>()
  let you = ''
  let youAt = 0
  let latest = ''
  let latestAt = 0
  for (const entry of (await $.fs.list(`${liveDir()}/${PUSHED}`).catch(() => [])).filter(one => one.kind === 'file' && one.name.endsWith('.json'))) {
    const at = entry.mtimeMs || now
    if (now - at > STALE) continue
    const text = await readOr($, `${liveDir()}/${PUSHED}/${entry.name}`)
    const head = pushHead(text)
    if (!head || `${head.from}.json` !== entry.name) continue
    from.add(head.from)
    if (head.you && at >= youAt) (you = head.you, (youAt = at))
    if (at >= latestAt) (latest = head.from, (latestAt = at))
    pushed.push(...fetchedOf(text, head.from, at))
    for (const one of fetchedOpen(text, head.from)) open.add(one)
  }
  pushedFrom.clear()
  for (const one of from) pushedFrom.add(one)
  pushedYou = you
  pushedLatest = latest
  if (macs.length) await knowLocalName($)
  const found: Shared[] = []
  // The chats open on this Mac with something going on
  const here = new Set<string>([id])
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== `${id}.json`)
  for (const name of [...liveRead.keys()]) if (!listed.some(entry => entry.name === name)) liveRead.delete(name)
  for (const entry of listed) {
    // A file not written for longer than STALE is a chat gone silent: not read at all
    if (entry.mtimeMs && now - entry.mtimeMs > STALE) continue
    const key = `${entry.mtimeMs}:${entry.size}`
    const was = liveRead.get(entry.name)
    const text = was && entry.mtimeMs && was.key === key ? was.text : await readOr($, `${liveDir()}/${entry.name}`)
    const one = sharedOf(text, now)
    // A file caught half-written is read again at the next look, not kept as read; a whole one of a chat with nothing going on is
    // kept as read, so a hundred idle chats are not read again at every look
    if (openChatOf(text, now)) open.add(openChatOf(text, now))
    if (one || isWhole(text)) liveRead.set(entry.name, { key, text })
    else liveRead.delete(entry.name)
    if (one) here.add(one.chat)
    // Only a chat with something going on is read as one: work running or ended lately, or a prompt open
    if (one && one.chat !== id) found.push(one)
  }
  // The chats of the Macs this one reaches, whose asks and finishes are told here
  const fromMacs: Shared[] = []
  for (const mac of macs) {
    const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
    // A copy not fetched again for STALE says nothing of that Mac now
    if (!f.text || now - (f.fetchedAt ?? 0) > STALE) continue
    for (const one of fetchedOpen(f.text, mac)) open.add(one)
    // A Mac named that is this one shows its chats once, as this Mac's
    for (const one of fetchedOf(f.text, mac, f.fetchedAt)) if (!here.has(one.chat)) (here.add(one.chat), found.push(one), fromMacs.push(one))
  }
  await tellAfar($, fromMacs, now).catch(err => log($, `other Macs' asks not told: ${String(err)}`))
  const isOffChanged = await lookAfar($, now).catch(() => false)
  // A chat both fetched and handed over, as when two Macs each name the other, is listed once, as fetched
  for (const one of pushed) if (!here.has(one.chat)) (here.add(one.chat), found.push(one))
  // Work gone from a chat still open, with no word of its end: finished, for its pause. A chat with nothing left going on is not
  // among those found, so it is listed again for that pause from what was last read of it
  const chatKey = (s: { host: string; chat: string }) => `${s.host}/${s.chat}`
  const present = new Map(found.map(s => [chatKey(s), s]))
  for (const [key, was] of [...lastRunning]) {
    if (!open.has(was.chat)) {
      if (now - was.at > STALE) lastRunning.delete(key)
      continue
    }
    lastRunning.delete(key)
    const s = present.get(was.chat)
    // A card gone from its chat's list went with that chat, which is closed: nothing reads an answer left for it, so its ask goes too
    if (!s?.cards.some(card => remoteId(s, card.id) === key) && !vanished.has(key)) vanished.set(key, { chat: was.chat, card: { ...was.card, status: 'done', endedAt: now, ask: undefined }, at: now, of: was.of })
  }
  for (const s of found) for (const card of s.cards.filter(one => one.status === 'working')) lastRunning.set(remoteId(s, card.id), { chat: chatKey(s), card, at: now, of: { ...s, cards: [], prompts: undefined } })
  for (const [key, one] of [...vanished]) {
    const s = present.get(one.chat)
    if (!open.has(one.chat) || now - one.at > LINGER + LOOK_EVERY || s?.cards.some(card => remoteId(s, card.id) === key)) vanished.delete(key)
    else if (s) s.cards = [...s.cards, one.card]
    else {
      const back = { ...one.of, cards: [one.card] }
      found.push(back)
      present.set(one.chat, back)
    }
  }
  // Work of another chat seen ending, by its id here: it turns happy for its pause from when this panel saw it end, as another
  // chat's file reaches here seconds later. Work that ended well before this panel saw it goes to Finished at once
  const ids = new Set<string>()
  for (const s of found)
    for (const card of s.cards.filter(one => one.status !== 'working')) {
      const key = remoteId(s, card.id)
      ids.add(key)
      if (endSeen.has(key)) continue
      const isNew = now - card.endedAt < SEEN_ENDING
      endSeen.set(key, isNew ? now : 0)
      if (isNew) $.clock.after(LINGER + 20, () => void update($, tick, n => n + 1))
    }
  for (const key of [...endSeen.keys()]) if (!ids.has(key)) endSeen.delete(key)
  const isAppChanged = found.some(s => s.host) && (await readAppIds($, now).catch(err => (void log($, `app's chats not listed: ${String(err)}`), false)))
  const next = ordered(found)
  if (JSON.stringify(next) !== JSON.stringify(await read($, others))) await update($, others, () => next)
  else if (`${isMulti()}:${selfName()}` !== wasSelf || isAppChanged || isOffChanged) redraw($)
}

// The chats this Mac's Claude app holds: its session files, one per chat, under
// ~/Library/Application Support/Claude/claude-code-sessions/<account>/<org>/local_….json, each naming the engine's id for that chat
// (`cliSessionId`, the id a chat shares as `chat`). They include the chats it runs on another Mac over SSH, which a press then opens
// by the app's own id as its sidebar does, whatever version of the mod runs there. Listed again at most every half minute; a file is
// read once, as the id it names never changes
const appIds = new Set<string>()
const appOfChat = new Map<string, string>()
const appFiles = new Map<string, string>()
// The title the app gives each chat it holds, by the chat's id, as read with its file
const appTitles = new Map<string, string>()
let appIdsAt = 0
// The app's own id for a chat this Mac's app holds, or ''
const heldApp = (c: Shared) => (c.link?.app && appIds.has(c.link.app) ? c.link.app : (appOfChat.get(c.chat) ?? ''))
// Answers whether what it holds changed, so the names it opens are drawn again
const readAppIds = async ($: EngineInterface, now: number) => {
  if (now - appIdsAt < 30_000) return false
  appIdsAt = now
  const root = `${(await $.env.get('HOME')) ?? ''}/Library/Application Support/Claude/claude-code-sessions`
  const found = new Map<string, string>()
  for (const account of await $.fs.list(root).catch(() => []))
    for (const org of account.kind === 'dir' ? await $.fs.list(`${root}/${account.name}`).catch(() => []) : [])
      for (const one of org.kind === 'dir' ? await $.fs.list(`${root}/${account.name}/${org.name}`).catch(() => []) : []) {
        const app = one.name.replace(/\.json$/, '')
        if (!one.name.endsWith('.json') || !APP_ID.test(app)) continue
        if (!appFiles.has(app)) {
          const text = await readOr($, `${root}/${account.name}/${org.name}/${one.name}`).catch(() => '')
          const chat = (() => {
            try {
              return String((JSON.parse(text) as { cliSessionId?: unknown }).cliSessionId ?? '')
            } catch {
              return ''
            }
          })()
          if (text) appFiles.set(app, /^[A-Za-z0-9_-]{1,80}$/.test(chat) ? chat : '')
          const title = (() => {
            try {
              const t = (JSON.parse(text) as { title?: unknown }).title
              return typeof t === 'string' ? t.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim().slice(0, 120) : ''
            } catch {
              return ''
            }
          })()
          if (text && title && appFiles.get(app)) appTitles.set(appFiles.get(app) ?? '', title)
        }
        found.set(app, appFiles.get(app) ?? '')
      }
  const isSame = found.size === appIds.size && [...found.keys()].every(one => appIds.has(one))
  appIds.clear()
  appOfChat.clear()
  for (const app of [...appFiles.keys()]) if (!found.has(app)) appFiles.delete(app)
  for (const [app, chat] of found) (appIds.add(app), chat && appOfChat.set(chat, app))
  return !isSame
}

// A press on another chat's name: that chat in the Claude app, as a notification's click opens this one. Nothing else is run
// In a chat another Mac's Claude app runs here over SSH the app, and the screen it draws on, are that Mac's: a press is left for
// that Mac (the one that hands its chats here, the freshest of them), which opens the chat there
const openChat = async ($: EngineInterface, c: Shared) => {
  const there = drawnFrom()
  // Never opened on this Mac, whose screen is not the one the press was made on: with no Mac handing its chats here, nowhere
  if (isRunFromAfar && !there) return void log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} not opened: no Mac hands its chats here to open it`)
  if (there) {
    const at = await $.clock.now()
    const r = await leaveHere($, `${OUTBOX}/${there}`, `o-${at}-${Math.random().toString(36).slice(2, 8)}`, { chat: c.chat, at })
    return void log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} ${r.exitCode === 0 ? `left for ${there} to open` : `not left for ${there}: ${r.stderr.trim().slice(0, 160)}`}`)
  }
  const url = openUrl(c, heldApp(c))
  if (url) await openHere($, c, url)
}
const openHere = async ($: EngineInterface, c: { chat: string; host: string }, url: string) => {
  const r = await $.process.run(['open', url]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  await log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} ${r.exitCode === 0 ? `opened: ${url}` : `not opened: ${r.stderr.trim().slice(0, 160)}`}`)
}
// Whether this chat runs here for another Mac's Claude app, over SSH: the app's own runner says so, once, at the start
let isRunFromAfar = false
const drawnFrom = () => (isRunFromAfar ? pushedLatest : '')
// What a press on a name does in this chat: 'there' for that Mac to open, '' for none, else the link opened here
const pressOf = (c: Shared) => (isRunFromAfar ? (pushedLatest ? 'there' : '') : openUrl(c, heldApp(c)))
// The presses left on each Mac named under macs for this one, taken every OPEN_EVERY by whichever chat here comes first, and each
// chat they name opened here as a press here opens it: this chat, another of this Mac's, or one of that Mac's this app holds
let isTaking = false
const takeOpens = async ($: EngineInterface) => {
  if (isTaking) return
  isTaking = true
  try {
    const from = await knowLocalName($)
    for (const mac of macs) {
      const now = await $.clock.now()
      const stamp = `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.opens`
      if (now - (Number(await readOr($, stamp)) || 0) < OPEN_EVERY - 250) continue
      // A Mac that has not answered a trip for STALE, asleep or gone, is not asked every few seconds
      const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
      if (now - (f.fetchedAt ?? 0) > STALE) continue
      await $.fs.write(stamp, String(now))
      const r = await $.process.run(ssh(mac, openTake(from)), { timeoutMs: 8_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
      if (r.exitCode !== 0) continue
      for (const chat of opensOf(r.stdout)) await openTaken($, chat, mac)
    }
  } finally {
    isTaking = false
  }
}
const openTaken = async ($: EngineInterface, chat: string, mac: string) => {
  const { id } = await read($, me)
  if (chat === id) {
    const session = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
    return DESKTOP_SESSION.test(session) ? openHere($, { chat, host: '' }, `claude://code/continue?session=${session}`) : log($, `chat ${chat} pressed on ${mac}: not in the Claude app here`)
  }
  const c = (await read($, others)).find(one => one.chat === chat)
  // A chat of this Mac with nothing going on now still opens by the link its own file shares
  let mine: Link | undefined
  try {
    mine = c ? undefined : linkOf((JSON.parse((await readOr($, `${liveDir()}/${chat}.json`)) || '{}') as { link?: unknown }).link)
  } catch {
    mine = undefined
  }
  const url = c ? openUrl(c, heldApp(c)) : mine ? openUrl({ host: '', link: mine }) : ''
  if (url) await openHere($, c ?? { chat, host: '' }, url)
  else await log($, `chat ${chat} pressed on ${mac}: nothing here opens it`)
}

// An answer pressed here for another chat's work, left for that chat: on this Mac in its folder of answers, on a Mac named under
// macs over ssh, for a chat of a Mac that handed it over in this Mac's outbox for that Mac, which its next trip carries back. Each is
// written under another name and then renamed, so it is never read half-written. The ask leaves this panel at once; that chat's own
// file brings it back if the work asks again, and an answer that could not be left says so and brings the ask back
const answeredHere = new Set<string>()
const leaveHere = ($: EngineInterface, folder: string, name: string, body: unknown) =>
  $.fs
    .write(`${liveDir()}/${folder}/${name}.part`, JSON.stringify(body))
    .then(() => $.process.run(['mv', '-f', `${liveDir()}/${folder}/${name}.part`, `${liveDir()}/${folder}/${name}.json`]))
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
const answerElsewhere = async ($: EngineInterface, one: Todo, choice: string, isReply: boolean) => {
  const ask = one.ask
  const said = choice.trim()
  const chat = one.chat
  if (!ask || !said || !chat || !/^[A-Za-z0-9_-]+$/.test(chat.id)) return
  // A second press on an ask already answered here sends nothing. A reply that does not settle it leaves the ask shown here, as its
  // own chat keeps it open, so a button can still answer it; the same reply sent twice at once counts once
  const isHeld = !settles(ask, said, isReply)
  const mark = isHeld ? `${one.id}:${ask.at}:${ask.replied?.at ?? ''}:${said}` : `${one.id}:${ask.at}`
  if (answeredHere.has(`${one.id}:${ask.at}`) || answeredHere.has(mark)) return
  drafts.delete(one.id)
  if (!isHeld) replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  if (isReply) freeTimes()
  answeredHere.add(mark)
  const at = await $.clock.now()
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'other', at, line: lineOf(one), isHeld })
  redraw($)
  const answer: Answer = { card: chat.agent, choice: said, isReply, ask: ask.text, askAt: ask.at, at }
  const name = `${at}-${Math.random().toString(36).slice(2, 8)}`
  const mac = chat.host ? macs.find(m => m === chat.host) : undefined
  const folder = `${ANSWERS}/${chat.id}`
  const r = !chat.host
    ? await leaveHere($, folder, name, answer)
    : mac
      ? await $.process
          .run(ssh(mac, `d=~/.claude/claudopus/${LIVE_DIR}/${folder} && mkdir -p $d && cat > $d/${name}.part && mv $d/${name}.part $d/${name}.json`), { stdin: JSON.stringify(answer), timeoutMs: 15_000 })
          .catch(err => ({ exitCode: -1, stderr: String(err) }))
      : isKey(chat.host) && pushedFrom.has(chat.host)
        ? await leaveHere($, `${OUTBOX}/${chat.host}`, name, { ...answer, chat: chat.id })
        : { exitCode: -1, stderr: 'that Mac is no longer named in config.json' }
  if (r.exitCode !== 0) {
    answeredHere.delete(mark)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'lost', at, line: lineOf(one) })
    redraw($)
    await log($, `answer for the chat ${chat.id}${chat.host ? ` on ${chat.host}` : ''} not left: ${r.stderr.trim().slice(0, 160)}`)
  }
}
// Answers other chats left for this one's work: each acted on as if pressed here, once, then put away. A press answers the ask it
// was pressed for and no later one, even in the same words; a reply in words goes to the work whatever it asks now; an answer that
// waited past ANSWER_KEPT is dropped
const takenAnswers = new Set<string>()
const readAnswers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const folder = `${liveDir()}/${ANSWERS}/${id}`
  const all = (await $.fs.list(folder).catch(() => [])).filter(entry => entry.name.endsWith('.json'))
  // One taken already and left again, as an answer another Mac's trip carried twice, is put away unread
  for (const entry of all.filter(one => takenAnswers.has(one.name))) await $.process.run(['rm', '-f', `${folder}/${entry.name}`]).catch(() => undefined)
  const entries = all.filter(entry => !takenAnswers.has(entry.name))
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    takenAnswers.add(entry.name)
    const path = `${folder}/${entry.name}`
    const answer = answerOf(await readOr($, path))
    await $.process.run(['rm', '-f', path]).catch(() => undefined)
    const now = await $.clock.now()
    const card = answer ? (await read($, todos)).find(one => one.id === answer.card && !one.parentId) : undefined
    const isSame = Boolean(answer && card?.ask && (answer.askAt ? answer.askAt === card.ask.at : answer.ask === card.ask.text))
    // A reply in words to work whose ask was answered a moment ago, as a second message after a press, still reaches it
    if (answer && card && !card.ask && answer.isReply && now - answer.at <= ANSWER_KEPT) {
      await replyAfter($, card, answer.choice, answer.ask)
      continue
    }
    if (!answer || !card?.ask || now - answer.at > ANSWER_KEPT || (!answer.isReply && !isSame)) {
      await log($, `answer from another chat dropped: ${!answer ? 'unreadable' : now - answer.at > ANSWER_KEPT ? 'it waited too long' : `its ask is gone from ${answer.card}`}`)
      continue
    }
    await answerAsk($, card, answer.choice, answer.isReply)
  }
}

// The other Macs over ssh: their chats fetched, and the same results on every Mac

// The other Macs config.json names under `macs`, as ssh reaches them; none for a person with one Mac. Each is known by the name
// config.json gives it, and shown by the first part of its host name
let macs: string[] = []
const macPath = (mac: string) => `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.json`
// One connection to each Mac is kept open a minute after its last use and shared by every chat here, so a trip costs a fraction
// of a second rather than a new login each time, and a name pressed on that Mac opens here within moments. A connection gone dead,
// as after sleep, is dropped within ten seconds and the next call logs in afresh
const ssh = (mac: string, command: string) => ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=5', '-o', 'ControlMaster=auto', '-o', 'ControlPath=/tmp/claudopus-%i-%C', '-o', 'ControlPersist=60', '-o', 'ServerAliveInterval=5', '-o', 'ServerAliveCountMax=2', '--', mac, command]
// This Mac's own name, as its Sharing settings give it, read once: what it is called on the Macs it hands its chats to
let localName = ''
const knowLocalName = async ($: EngineInterface) => {
  if (localName) return localName
  const r = await $.process.run(['scutil', '--get', 'LocalHostName'], { timeoutMs: 5_000 }).catch(() => ({ exitCode: -1, stdout: '' }))
  localName = keyOf(r.exitCode === 0 ? r.stdout.trim() : '') || 'mac'
  return localName
}
// What a trip leaves in this Mac's copy: the fetch, when it was fetched and last tried, the answers it carried (put away there on
// the next trip) and the names of those carried lately, so an answer carried twice is left for its chat once
type Fetched = { mac: string; text: string; fetchedAt: number; triedAt: number; acks?: string[]; seen?: string[] }
// This Mac's own chats' files, as handed to the other Macs: those written in the last three minutes, never another Mac's copies
const ownFiles = async ($: EngineInterface, now: number) => {
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && !(entry.mtimeMs && now - entry.mtimeMs > 180_000))
  return (await Promise.all(listed.map(entry => readOr($, `${liveDir()}/${entry.name}`)))).filter(text => text.trim().startsWith('{'))
}
// Each other Mac is reached by whichever chat here finds its copy older than FETCH_EVERY: one trip for every chat on this Mac. A trip
// hands that Mac this Mac's chats, brings back its chats and the answers pressed there for this Mac's chats. What a trip that failed
// leaves is the copy before it, which goes stale on its own
let isFetching = false
const fetchMacs = async ($: EngineInterface) => {
  if (isFetching) return
  isFetching = true
  try {
    const from = await knowLocalName($)
    for (const mac of macs) {
      const now = await $.clock.now()
      const was = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
      if (now - Math.max(was.fetchedAt ?? 0, was.triedAt ?? 0) < FETCH_EVERY) continue
      const kept = { mac, text: was.text ?? '', fetchedAt: was.fetchedAt ?? 0, acks: was.acks ?? [], seen: was.seen ?? [] }
      await $.fs.write(macPath(mac), JSON.stringify({ ...kept, triedAt: now }))
      const push = pushOf(from, keyOf(macName(mac)), now, await ownFiles($, now))
      const r = await $.process.run(ssh(mac, trip(from, kept.acks)), { stdin: push, timeoutMs: 15_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
      if (r.exitCode !== 0 || !r.stdout.includes('\n')) {
        // Said once when the Mac stops answering, not at every try
        if ((was.fetchedAt ?? 0) >= (was.triedAt ?? 0)) await log($, `chats on ${mac} not fetched: ${r.stderr.trim().slice(0, 160)}`)
        continue
      }
      const fetchedAt = await $.clock.now()
      const { text, carried } = tripOf(r.stdout)
      // An answer carried back is left for its chat here as one pressed in another chat's panel, its time moved onto this Mac's clock
      const shift = clockOf(text) ? fetchedAt - clockOf(text) : 0
      // Only an answer left here, or left on an earlier trip, is put away there: one that could not be left is carried again
      const names: string[] = []
      for (const one of carried) {
        if (kept.seen.includes(one.name)) {
          names.push(one.name)
          continue
        }
        const path = `${liveDir()}/${ANSWERS}/${one.chat}/${one.name}`
        const r = await $.fs
          .write(`${path}.part`, JSON.stringify({ ...one.answer, at: one.answer.at + shift }))
          .then(() => $.process.run(['mv', '-f', `${path}.part`, path]))
          .catch(err => ({ exitCode: -1, stderr: String(err) }))
        if (r.exitCode === 0) names.push(one.name)
        else await log($, `answer from ${mac} not left: ${r.stderr.trim().slice(0, 160)}`)
      }
      await $.fs.write(macPath(mac), JSON.stringify({ mac, text, fetchedAt, triedAt: now, acks: names, seen: [...new Set([...kept.seen, ...names])].slice(-200) }))
    }
  } finally {
    isFetching = false
  }
}

// The results of each other Mac made the same as this one's, at most every RESULTS_EVERY, by whichever chat here comes first: what
// that Mac lacks is handed to it, what this one lacks is brought here, and the marks of a result both have are made the same on both.
// A result is moved into place only whole and only where none has its name; nothing is deleted
const resultsPath = (mac: string) => `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.results.json`
// What one sync with a Mac leaves: when, and each result both have that was put away then, with when
type Synced = { syncedAt?: number; triedAt?: number; archived?: Record<string, number>; tried?: Record<string, number> }
let isSyncing = false
const syncResults = async ($: EngineInterface) => {
  if (isSyncing) return
  isSyncing = true
  try {
    let isTried = false
    for (const mac of macs) {
      const now = await $.clock.now()
      const was = JSON.parse((await readOr($, resultsPath(mac))) || '{}') as Synced
      if (now - Math.max(was.syncedAt ?? 0, was.triedAt ?? 0) < RESULTS_EVERY) continue
      isTried = true
      await $.fs.write(resultsPath(mac), JSON.stringify({ ...was, triedAt: now }))
      const staging = `${reportsDir()}/_sync/${now}-${Math.random().toString(36).slice(2, 8)}`
      try {
        await syncWith($, mac, was, now, staging)
      } finally {
        await $.process.run(['rm', '-rf', staging, `${staging}-out`]).catch(() => undefined)
      }
    }
    // What a sync cut off left of its own folders goes after an hour; nothing else there is ever touched
    if (isTried) await $.process.run(['find', `${reportsDir()}/_sync`, '-mindepth', '1', '-maxdepth', '1', '-mmin', '+60', '-exec', 'rm', '-rf', '{}', '+']).catch(() => undefined)
  } finally {
    isSyncing = false
  }
}
// The results missing on one side that one trip takes: those tried longest ago first, never tried before all, so results that keep
// failing, or that the other Mac keeps leaving out, take turns with the rest and never hold them back
const aTrip = (ids: string[], tried: Record<string, number> = {}) =>
  ids.map((id, i) => ({ id, i, at: tried[id] ?? 0 })).sort((a, b) => a.at - b.at || a.i - b.i).slice(0, RESULTS_A_TRIP).map(one => one.id)
const syncWith = async ($: EngineInterface, mac: string, was: Synced, now: number, staging: string) => {
  const home = dir.slice(0, -'/.claude/claudopus'.length)
  const looked = await $.process.run(ssh(mac, RESULTS_LOOK), { timeoutMs: 60_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err), isStdoutTruncated: false }))
  // A list cut short is no list: what it leaves out would look missing there
  const theirs = looked.exitCode === 0 && !looked.isStdoutTruncated ? resultsOf(looked.stdout) : undefined
  if (!theirs) {
    if ((was.syncedAt ?? 0) >= (was.triedAt ?? 0)) await log($, `results on ${mac} not looked at: ${looked.isStdoutTruncated ? 'its list was cut short' : looked.stderr.trim().slice(0, 160)}`)
    return
  }
  // This Mac's results as they stand: each folder with its meta.json, by name
  const mine = new Map<string, string>()
  for (const entry of await $.fs.list(reportsDir()).catch(() => [])) {
    if (entry.kind !== 'dir' || !isResultId(entry.name)) continue
    const text = await readOr($, `${reportsDir()}/${entry.name}/meta.json`)
    if (text.trim().startsWith('{')) mine.set(entry.name, text)
  }
  let changed = 0
  // Brought here one at a time, each into a folder of its own first, its paths moved onto this Mac's home, then into place whole:
  // one whose stream was cut short is left out, and brought on a later trip
  const missingHere = [...theirs.results.keys()].filter(id => !mine.has(id))
  const missingThere = [...mine.keys()].filter(id => !theirs.results.has(id))
  const wanted = aTrip(missingHere, was.tried)
  for (const id of wanted) {
    const into = `${staging}/${id}`
    await $.process.run(['mkdir', '-p', into])
    const r = await $.process.run(['bash', '-c', PULL, 'bash', into, mac, pullThere([id])], { timeoutMs: 300_000 }).catch(err => ({ exitCode: -1, stderr: String(err) }))
    // Its stream ends with an empty _end, so one cut between two files is known as cut
    const isWhole = r.exitCode === 0 && (await $.fs.exists(`${into}/_end`).catch(() => false))
    if (!isWhole || (parsedMeta(await readOr($, `${into}/${id}/meta.json`)) as { id?: unknown }).id !== id) {
      await log($, `result ${id} from ${mac} not brought: ${r.exitCode !== 0 ? r.stderr.trim().slice(0, 160) : 'it came cut short'}`)
      continue
    }
    for (const file of ['meta.json', 'report.md']) {
      const text = await readOr($, `${into}/${id}/${file}`)
      if (text) await $.fs.write(`${into}/${id}/${file}`, rehome(text, theirs.home, home))
    }
    const moved = await $.process.run(['sh', '-c', PLACE, 'sh', `${into}/${id}`, `${reportsDir()}/${id}`, `${reportsDir()}/_sync/claim-${id}`]).catch(() => ({ exitCode: -1 }))
    if (moved.exitCode === 0) changed += 1
  }
  // Handed there: copied aside here with its paths moved onto that Mac's home, then sent in one stream, put in place there only
  // once the whole stream is in
  const handed = aTrip(missingThere, was.tried)
  if (handed.length) {
    const out = `${staging}-out`
    await $.process.run(['mkdir', '-p', out])
    const ready: string[] = []
    for (const id of handed) {
      if ((await $.process.run(['cp', '-Rp', `${reportsDir()}/${id}`, `${out}/${id}`]).catch(() => ({ exitCode: -1 }))).exitCode !== 0) continue
      for (const file of ['meta.json', 'report.md']) {
        const text = await readOr($, `${out}/${id}/${file}`)
        if (text) await $.fs.write(`${out}/${id}/${file}`, rehome(text, home, theirs.home))
      }
      ready.push(id)
    }
    const r = ready.length ? await $.process.run(['bash', '-c', PUSH, 'bash', out, mac, PUSH_THERE, ...ready], { timeoutMs: 300_000 }).catch(err => ({ exitCode: -1, stderr: String(err) })) : { exitCode: 0, stderr: '' }
    if (r.exitCode !== 0) await log($, `results not handed to ${mac}: ${r.stderr.trim().slice(0, 160)}`)
  }
  // What the person did to a result both have: the later of put away and brought back, every answer, on both. Each side is written
  // only when it differs; there only when unchanged since it was read
  let marked = 0
  const archived: Record<string, number> = {}
  for (const [id, there] of theirs.results) {
    const here = mine.get(id)
    if (!here) continue
    const wasArchived = was.archived?.[id] ?? 0
    const theirsNow = broughtBackBy(parsedMeta(there.text), wasArchived)
    const mineNow = broughtBackBy(parsedMeta(here), wasArchived)
    const target = marksOf(mineNow, theirsNow)
    // Its archive is kept as made the same only once both sides hold it; else what was kept before stands
    let isSame = marked < RESULTS_A_TRIP
    if (marked < RESULTS_A_TRIP) {
      if (merged(here, theirsNow, wasArchived)) {
        const ok = await markReport($, { id } as Report, stored => marksOf(broughtBackBy(stored, wasArchived), theirsNow)).then(() => true, err => (void log($, `result ${id} not marked from ${mac}: ${String(err)}`), false))
        ;(isSame &&= ok), (changed += 1), (marked += 1)
      }
      const theirsNext = merged(there.text, mineNow, wasArchived)
      if (theirsNext) {
        const r = await $.process.run(ssh(mac, markThere(id, there.sum)), { stdin: theirsNext, timeoutMs: 15_000 }).catch(err => ({ exitCode: -1, stderr: String(err) }))
        if (r.exitCode !== 0) await log($, `result ${id} not marked on ${mac}: ${r.exitCode === 3 ? 'changed there since' : r.stderr.trim().slice(0, 160)}`)
        ;(isSame &&= r.exitCode === 0), (marked += 1)
      }
    }
    const kept = isSame ? (target.archived ?? 0) : wasArchived
    if (kept) archived[id] = kept
  }
  if (changed) await loadReports($)
  // When each result still missing on either side was last tried; one that has come across is dropped from it the next trip
  const tried: Record<string, number> = {}
  for (const id of [...missingHere, ...missingThere]) if (was.tried?.[id]) tried[id] = was.tried[id]
  for (const id of [...wanted, ...handed]) tried[id] = now
  await $.fs.write(resultsPath(mac), JSON.stringify({ syncedAt: await $.clock.now(), triedAt: now, brought: wanted.length, handed: handed.length, marked, archived, tried }))
  if (wanted.length || handed.length || marked) await log($, `results with ${mac}: ${wanted.length} brought, ${handed.length} handed, ${marked} marked`)
}

// The Macs that handed this one their chats lately, by the name each gave, and what the freshest called this Mac: its name here once
// other Macs' chats are listed beside its own
const pushedFrom = new Set<string>()

// What happens in chats this panel cannot see into: chats running without Claudopus, and the asks and finishes of another Mac's chats

// ---- Chats running without Claudopus, on this Mac or a Mac it reaches, and the Claude app's decision that starts new ones so ----

// What was found: the chats by Mac ('' for this one), and when this Mac's app decided a Mac's own install didn't load there ('' when
// it holds no such decision). Looked at every AFAR_EVERY by each chat, as the look is a ps and a grep of one log
let offChats: (Off & { host: string })[] = []
let stuckAt = ''
let afarAt = -Infinity
const AFAR_EVERY = 30_000
// Says whether what was found changed, so the panel is drawn again
const lookAfar = async ($: EngineInterface, now: number) => {
  if (now - afarAt < AFAR_EVERY) return false
  afarAt = now
  const failed = { exitCode: -1, stdout: '' }
  const here = await $.process.run(['sh', '-c', OFF_LOOK], { timeoutMs: 10_000 }).catch(() => failed)
  const app = await $.process.run(['sh', '-c', APP_LOG_LOOK], { timeoutMs: 10_000 }).catch(() => failed)
  const found = here.exitCode === 0 ? offOf(here.stdout).map(one => ({ ...one, host: '' })) : []
  for (const mac of macs) {
    const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
    if (f.text && now - (f.fetchedAt ?? 0) <= STALE) found.push(...offOf(f.text).map(one => ({ ...one, host: mac })))
  }
  if (found.some(one => one.host)) await readAppIds($, now).catch(() => false)
  const stuck = stuckOf(app.stdout)
  const isChanged = JSON.stringify([found, stuck]) !== JSON.stringify([offChats, stuckAt])
  offChats = found
  stuckAt = stuck
  return isChanged
}
// A chat's name for the panel: its own title, else the one this Mac's app gives it, else a word
const offName = (one: Off) => one.title || appTitles.get(one.chat) || (one.chat === 'new' ? 'A chat just started' : 'A chat')

// The warning the panel shows under its header while any of it holds: in those chats nothing of Claudopus runs, so this is the only
// place they are seen, and what cures it
const afarPart = (ui: Ui) => {
  if (!stuckAt && !offChats.length) return null
  const there = macs.length === 1 ? macName(macs[0] ?? '') : 'the Mac it runs chats on over SSH'
  const lines = [
    ...(stuckAt ? [`New chats on ${there} start without Claudopus. This Mac's Claude app decided at ${stuckAt} that Claudopus didn't load there, and since then it gives every new chat there its own copy, which has no Claudopus code: no panel, tools or rules. The app forgets this only when it is quit and opened again.`] : []),
    ...offChats.map(one => `“${offName(one)}”${one.host ? ` on ${macName(one.host)}` : ' on this Mac'} runs without Claudopus: its work, asks and results do not reach any panel. A chat started after the app is reopened has it.`),
  ]
  return (
    <ui.Box key="afar" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{offChats.length === 1 && !stuckAt ? 'Claudopus is off in a chat' : 'Claudopus is off in some chats'}</ui.Text>
      {lines.map((line, i) => (
        <ui.Text key={`afar-${i}`} wrap="wrap">
          {line}
        </ui.Text>
      ))}
    </ui.Box>
  )
}

// ---- Another Mac's chats, told here: their asks, prompts and finishes as a notification on this Mac, where the person is, as that
// Mac's own notifications show only on its own screen. Only for the Macs this one reaches (config.json `macs`); each once, whichever
// chat here sees it first, and only when it is fresh, so a chat that starts tells nothing old ----
const AFAR_FRESH = 3 * 60_000
const toldDir = () => `${liveDir()}/${MACS}/told`
const tellOnce = async ($: EngineInterface, key: string, tell: () => Promise<unknown>) => {
  const path = `${toldDir()}/${key.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 150)}`
  const r = await $.process.run(['sh', '-c', 'mkdir -p "$1" && mkdir "$2" 2>/dev/null', 'sh', toldDir(), path]).catch(() => ({ exitCode: -1 }))
  if (r.exitCode === 0) await tell().catch(err => log($, `${key} not told: ${String(err)}`))
}
let toldSwept = -Infinity
const tellAfar = async ($: EngineInterface, list: readonly Shared[], now: number) => {
  if (!list.length) return
  if (now - toldSwept > 3_600_000) {
    toldSwept = now
    await $.process.run(['find', toldDir(), '-mindepth', '1', '-maxdepth', '1', '-mmin', '+120', '-exec', 'rmdir', '{}', '+']).catch(() => undefined)
  }
  let config: { notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves them on
  }
  for (const s of list) {
    const opens = openUrl(s, heldApp(s))
    const where = `${chatName(s)} on ${macName(s.host)}`
    for (const card of s.cards) {
      const id = remoteId(s, card.id)
      if (card.ask && Math.abs(now - card.ask.at) < AFAR_FRESH) await tellOnce($, `ask-${id}-${card.ask.at}`, () => aloud($, 'ask', `${titleOf(card)} needs you`, `${card.ask?.text ?? ''} · ${where}`, `ask-${id}`, opens))
      if (card.status !== 'working' && card.endedAt && now - card.endedAt < AFAR_FRESH && config.notifications !== false) {
        const item = readyOf({ id: card.id }, [card], [])
        if (item) await tellOnce($, `end-${id}`, () => alertPerson($, 'ready', item.title, `${item.what} · ${where}`, `ready-${id}`, undefined, opens))
      }
    }
    for (const p of s.prompts ?? []) if (Math.abs(now - p.at) < AFAR_FRESH) await tellOnce($, `prompt-${s.host}-${s.chat}-${p.id}`, () => aloud($, 'prompt', `${p.title ?? chatName(s)} needs your OK`, `${p.text} · ${where}`, `prompt-${s.chat}-${p.id}`, opens))
  }
}

// The hidden boxes of bin/secret and bin/admin, in every chat: on this Mac's own screen and from another Mac over ssh alike

// The runner leaves a request in boxes/: what it needs, never a value. The panel draws it at its top with a field; what is typed
// there goes from the field straight into this Mac's keychain on security's stdin, under the request's id, where the runner takes it
// and removes it. It never reaches the chat, a notice, the saved words, a file or the log. The chat that asked (the request names it)
// takes the request first; any other chat with a screen after BOX_GRACE. Taking it leaves the .told mark, which tells the runner a
// panel asks: with none in its first seconds, nothing on this Mac draws one (a -p run with no chat open) and it falls back to its own
type Asked = { id: string; text: string; at: number; chat?: string }
let boxes: Asked[] = []
// What is being typed in each box, only in this code's memory, so a redraw keeps it; gone once it is sent
const boxDrafts = new Map<string, string>()
// A line under a box: what went wrong with what was sent
const boxSaid = new Map<string, string>()
// Sent from here: the box goes at once, before the runner removes its request
const boxSent = new Set<string>()
let boxPresses = 0
// A request older than the runner's own wait there (590 s, under the longest a Bash call may run) is one whose runner is gone
const BOX_OLD = 11 * 60_000
// What security reads as one line (it cuts a line at about 4095, seen), and gives back as typed: plain printable characters (others it
// prints as hex). The longest value, escaped, leaves room for the rest of the line
const BOX_LONGEST = 3800
const BOX_SERVICE = 'claudopus-box'
const BOX_ID = /^[0-9a-f-]{36}$/
const boxesDir = () => `${dir}/boxes`
// Another chat's request is left to it this long, so its own chat tells it, when that chat is open
const BOX_GRACE = 5000
// In the chat only the name of what is asked, once per box, in the chat that asked or else whichever chat sees it first
const BOX_TOLD = (text: string) => `${text} Click in the box at the top of the Claudopus panel and type it there, never in this chat's prompt (/claudopus opens the panel). What is typed in the box goes only into this Mac's keychain.`
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID, read at each look (a /clear can change it)
let boxChat = ''
// Requests this chat has told or seen told
const boxTold = new Set<string>()

const lookBoxes = async ($: EngineInterface) => {
  if (!dir) return
  // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
  if (!(await $.session.surfaces().catch(() => [])).length) return
  boxChat = await $.session.id().catch(() => '')
  const now = await $.clock.now()
  const found: Asked[] = []
  const entries = await $.fs.list(boxesDir()).catch(() => [])
  for (const entry of entries) {
    // A mark left after its request went (a chat that marked it as the runner ended) goes too
    const marked = entry.name.replace(/\.told$/, '')
    if (entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(other => other.name === `${marked}.json`)) await $.process.run(['rm', '-f', `${boxesDir()}/${entry.name}`]).catch(() => undefined)
    const id = entry.name.replace(/\.json$/, '')
    if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id)) continue
    try {
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Partial<Asked>
      if (one.id === id && typeof one.text === 'string' && typeof one.at === 'number' && now - one.at < BOX_OLD) found.push({ id, text: one.text.slice(0, 600), at: one.at, chat: typeof one.chat === 'string' && one.chat ? one.chat : undefined })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      // and a value typed into it meanwhile leaves the keychain with it
      else if (typeof one.at === 'number' && now - one.at >= BOX_OLD) {
        await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`]).catch(() => undefined)
        await $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => undefined)
      }
    } catch {
      // A request being written is read at the next look
    }
  }
  found.sort((a, b) => a.at - b.at)
  for (const one of found) {
    if (boxTold.has(one.id)) continue
    // Another chat's request waits for that chat a moment (and every request does, in a chat that cannot read its own id)
    if (one.chat !== undefined && one.chat !== boxChat && now - one.at < BOX_GRACE) continue
    boxTold.add(one.id)
    // The first chat to make the mark brings its panel up with the field ready to type in (focus is given only over an empty
    // prompt), and tells it. A panel that cannot be drawn here gives the mark back, so another chat or the runner's own box asks
    const mark = await $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', `${boxesDir()}/${one.id}.told`]).catch(() => ({ exitCode: 1 }))
    if (mark.exitCode !== 0) continue
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(err => (log($, `panel not opened for a box: ${String(err)}`), undefined))
    if (!opened?.isPlaced) {
      await $.process.run(['rm', '-f', `${boxesDir()}/${one.id}.told`]).catch(() => undefined)
      await log($, `box ${one.id} given back: the panel is not drawn here${opened && !opened.isPlaced ? ` (${opened.reason})` : ''}`)
      continue
    }
    $.ui.log(BOX_TOLD(one.text))
  }
  for (const id of boxTold) if (!found.some(one => one.id === id)) boxTold.delete(id)
  for (const id of [...boxDrafts.keys(), ...boxSaid.keys()]) if (!found.some(one => one.id === id)) (boxDrafts.delete(id), boxSaid.delete(id))
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  $.ui.invalidate('ui.render')
}

// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  boxDrafts.delete(id)
  if (!value) return
  const refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? `That was longer than ${BOX_LONGEST} characters, so it was not sent.` : /[^\x20-\x7E]/.test(value) ? 'That held a line break, a curly quote or another character outside plain letters, digits and signs, so it was not sent. Type it again.' : ''
  if (refused) {
    boxSaid.set(id, refused)
    boxPresses += 1
    return void $.ui.invalidate('ui.render')
  }
  const request = `${boxesDir()}/${id}.json`
  // A runner that has stopped, or a box answered in another chat, takes nothing: its value would stay in the keychain
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id))
  const escaped = value.replace(/[\\"]/g, '\\$&')
  const r = await $.process
    .run(['/usr/bin/security', '-i'], { stdin: `add-generic-password -U -s "${BOX_SERVICE}" -a "${id}" -l "Claudopus box" -w "${escaped}"\n`, timeoutMs: 15_000 })
    .catch(() => ({ exitCode: -1 }))
  // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
  const isKept = r.exitCode === 0 && (await $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))).exitCode === 0
  // and one whose runner stopped meanwhile is taken out again
  if (isKept && !(await $.fs.exists(request).catch(() => false))) await $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => undefined)
  boxPresses += 1
  if (!isKept) {
    boxSaid.set(id, 'It could not be put in this Mac\'s keychain. Try again.')
    await log($, `box ${id} not kept: security ended ${r.exitCode}`)
  } else {
    boxSent.add(id)
    boxSaid.delete(id)
    boxes = boxes.filter(one => one.id !== id)
    await log($, `box ${id} sent to the keychain`)
  }
  $.ui.invalidate('ui.render')
}
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string) => {
  boxDrafts.delete(id)
  boxSent.add(id)
  boxes = boxes.filter(one => one.id !== id)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  $.ui.invalidate('ui.render')
}

const boxesPart = ($: EngineInterface, ui: Ui) => {
  if (!boxes.length || !('Input' in ui)) return null
  // This chat's own requests first, the first of them with the keys, so a value typed for the notice it told goes to its own box
  const shown = [...boxes.filter(one => one.chat === boxChat), ...boxes.filter(one => one.chat !== boxChat)]
  return shown.map((one, n) => (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      <ui.Text dimColor wrap="wrap">What you type here shows as you type it. It goes only into this Mac's keychain, never into a chat.</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxPresses}`}
          placeholder="Type or paste it here"
          value={boxDrafts.get(one.id) ?? ''}
          submitLabel="send"
          autoFocus={n === 0 ? true : undefined}
          onInput={value => void boxDrafts.set(one.id, value)}
          onSubmit={value => void sendBox($, one.id, value).catch(() => log($, `box ${one.id} not sent`))}
        />
      </ui.Box>
      {boxSaid.get(one.id) ? <ui.Text key={`box-${one.id}-said`} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      <ui.Box flexDirection="row">
        <ui.Button key={`box-${one.id}-cancel-${boxPresses}`} label="Cancel" plain onPress={() => void cancelBox($, one.id)} />
      </ui.Box>
    </ui.Box>
  ))
}

// The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel

// ---- The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel ----
// The engine raises PermissionRequest as it puts a prompt to the person, and says nothing of the answer but a refusal: an allowed
// call just runs and ends. So a prompt goes when its call ends (refused, interrupted or run), when the terminal draws its running
// pill, or, for a command, as soon as a process running it is seen on this Mac. The mod never answers a prompt
type Waiting = Prompt & { tool: string; agent: string; snippet: string; seen?: number; isTold?: boolean }
let waiting: Waiting[] = []
// The tool calls whose permission check asked, newest last, so the prompt that follows is known by its call's id: the one of the same
// loop, tool and input, else the newest of the same loop and tool
type Asked = { agent: string; tool: string; input: string; id: string }
let asked: Asked[] = []
const inputKey = (input: unknown) => JSON.stringify(input ?? null).slice(0, 2000)
const askedFor = (agent: string | undefined, tool: string, input: unknown) => {
  const same = asked.filter(one => one.agent === (agent ?? '') && one.tool === tool)
  const one = same.find(other => other.input === inputKey(input)) ?? same.at(-1)
  if (one) asked = asked.filter(other => other !== one)
  return one?.id
}
// What the prompt asks, in its own few words: a command's description, the file, the site, the question
const promptText = (tool: string, input: unknown) => {
  const given = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const field = (key: string) => (typeof given[key] === 'string' ? oneLine(given[key] as string) : '')
  const file = (path: string) => path.split('/').filter(Boolean).pop() ?? ''
  if (tool === 'Bash' || tool === 'PowerShell') return `Allow a command: ${cut(field('description') || field('command'), 90) || 'one with no words'}`
  if (tool === 'Write') return `Allow writing ${file(field('file_path')) || 'a file'}`
  if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit') return `Allow editing ${file(field('file_path') || field('notebook_path')) || 'a file'}`
  if (tool === 'WebFetch') return `Allow opening ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'a web page'}`
  if (tool === 'WebSearch') return `Allow a web search: ${cut(field('query'), 80)}`
  if (tool === 'AskUserQuestion') {
    const first = Array.isArray(given.questions) ? (given.questions[0] as { question?: unknown } | undefined)?.question : undefined
    return typeof first === 'string' && first.trim() ? `Answer a question: ${cut(oneLine(first), 90)}` : 'Answer a question'
  }
  if (tool === 'ExitPlanMode') return 'Approve a plan'
  const mcp = tool.match(/^mcp__(.+?)__(.+)$/)
  if (mcp) return `Allow ${(mcp[2] ?? '').replace(/_/g, ' ')} (${(mcp[1] ?? '').replace(/^plugin_[^_]+_/, '')})`
  return `Allow ${tool}`
}
// The start of a command up to its first quote, `$` or line break, as a running shell shows it whatever the quoting
const snippetOf = (tool: string, input: unknown) => {
  if (tool !== 'Bash') return ''
  const head = (String((input as { command?: unknown } | undefined)?.command ?? '').split(/['"\\\n$`]/)[0] ?? '').trimEnd()
  return head.trim().length >= 4 ? head.slice(0, 80) : ''
}
// How many of Claude's shells on this Mac run a command that starts so (the Bash tool runs it as `eval '<command>'`): counted as its
// prompt opens, so only one more than then is this call's
const running = async ($: EngineInterface) => {
  const r = await $.process.run(['ps', '-ww', '-x', '-o', 'args='], { timeoutMs: 5000 })
  return r.exitCode === 0 ? r.stdout.split('\n') : undefined
}
const countOf = (lines: string[], snippet: string) => lines.filter(line => line.includes(`eval '${snippet}`)).length
const opened = async ($: EngineInterface, agent: string | undefined, tool: string, input: unknown) => {
  const at = await $.clock.now()
  const id = askedFor(agent, tool, input) ?? `pr-${at}-${Math.random().toString(36).slice(2, 8)}`
  const list = await read($, todos)
  const card = agent !== undefined ? list.find(one => one.id === topOf(list, agent)) : undefined
  const one: Waiting = { id, text: promptText(tool, input), ...(card ? { title: titleOf(card) } : {}), at, tool, agent: agent ?? '', snippet: snippetOf(tool, input) }
  waiting = [...waiting.filter(other => other.id !== id), one]
  redraw($)
  void shareMine($).catch(() => undefined)
  // The count to start from is taken beside the prompt, never in its way
  if (one.snippet)
    void running($)
      .then(lines => void (lines && (waiting = waiting.map(other => (other.id === id ? { ...other, seen: countOf(lines, one.snippet) } : other)))))
      .catch(() => undefined)
  return id
}
// The app says a prompt is still waiting (its own "needs your permission", a few seconds on): it is told aloud once, as an ask is.
// A prompt answered before that is never told
const tellWaiting = async ($: EngineInterface) => {
  const due = waiting.filter(one => !one.isTold)
  if (!due.length) return
  waiting = waiting.map(one => ({ ...one, isTold: true }))
  const { title } = await read($, me)
  const chat = title.trim() || cwd.split('/').filter(Boolean).pop() || 'A chat'
  for (const one of due) await aloud($, 'prompt', `${one.title ?? chat} needs your OK`, one.text, `prompt-${one.id}`).catch(err => log($, `prompt not told: ${String(err)}`))
}
// The prompt of a call goes: by its id, else the oldest one of the same loop and tool whose id was not known
const settle = ($: EngineInterface, id: string, agent?: string, tool?: string) => {
  const exact = waiting.find(one => one.id === id)
  const gone = exact ?? (tool ? waiting.find(one => one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent ?? '')) : undefined)
  if (!gone) return
  waiting = waiting.filter(one => one !== gone)
  redraw($)
  void shareMine($).catch(() => undefined)
}
// A command allowed starts at once: a process on this Mac running it ends its prompt before the command itself ends
let isLooking = false
const lookForStarted = async ($: EngineInterface) => {
  const sought = waiting.filter(one => one.snippet && one.seen !== undefined)
  if (!sought.length || isLooking) return
  isLooking = true
  try {
    const lines = await running($)
    if (!lines) return
    for (const one of sought) if (countOf(lines, one.snippet) > (one.seen ?? 0)) settle($, one.id)
  } finally {
    isLooking = false
  }
}

const promptHooks = (on: On) => {

  // A prompt the app is about to put to the person shows amber in every panel; the mod passes the request on untouched and never
  // answers it. A settings hook that answered it put nothing to the person
  on('tool.check', async ($, e, next) => {
    const r = await next(e)
    if (r.decision === 'ask' && e.tool_use_id && e.approver) {
      asked = [...asked.filter(one => one.id !== e.tool_use_id), { agent: e.agentId ?? '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }].slice(-50)
    }
    return r
  })
  on('classic.PermissionRequest', async ($, e, next) => {
    const id = dir && !isEnded ? await opened($, e.agent_id, e.tool_name, e.tool_input).catch(err => (void log($, `prompt not shown: ${String(err)}`), '')) : ''
    const r = await next(e)
    if (id && r?.decision) settle($, id)
    return r
  })
  on('classic.Notification', async ($, e, next) => {
    if (e.notification_type === 'permission_prompt' && waiting.length) await tellWaiting($).catch(err => log($, `prompt not told: ${String(err)}`))
    return next(e)
  })
  // It goes as its call ends (refused, interrupted, or allowed and run: the main tool.call hook below), or as the terminal draws its
  // running pill
  on('ui.render', { component: 'ToolProgress' }, async ($, e, next) => {
    const id = e.props.tool_use_id
    if (waiting.some(one => one.id === id)) void Promise.resolve().then(() => settle($, id))
    return next(e)
  })

}

// The chat's own life: its start and end, each message and reply, compaction, and what it is told

// How full this chat's context is, against the window the app's own panel measures it by
const measure = async ($: EngineInterface) => {
  const context = (await $.session.usage({ breakdown: 'summary' }).catch(() => undefined))?.context
  const window = context?.breakdown?.rawMaxTokens ?? context?.window
  return update($, me, one => ({ ...one, tokens: context?.tokens ?? one.tokens, window: window ?? one.window }))
}

// ---- After each reply: the size, the answer, the asks and the title ----

const afterReply = async ($: EngineInterface, text: string, answer: string) => {
  await measure($)
  const title = await appTitle($)
  const m = await update($, me, one => ({ ...one, title: title || one.title }))
  // A server is looked for while the chat that started it is still above it
  await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
  // What Claude answered is kept beside what the person said, so a search finds what happened as well as what was asked
  if (answer.trim()) {
    await appendWords($, m.id, `### Claude ${new Date().toISOString()}\n${answer.trim()}\n\n`).catch(err => log($, `answer not saved: ${String(err)}`))
  }
  // A reply with no message of the person's before it relays an agent's result: it is logged when it says something
  const isRelay = !text.trim()
  if (isRelay && answer.trim().length < 200) return

  const r = await $.model.complete({
    model: 'sonnet',
    system: ASKS_SYSTEM,
    prompt: `Current title: ${m.title || '(none)'}\n\nUser message:\n"""\n${isRelay ? '(none: this reply relays the result of a background agent)' : clip(text, 3000)}\n"""\n\nAssistant reply (shortened):\n"""\n${clip(answer, isRelay ? 1500 : 600)}\n"""`,
    maxTokens: 500,
  })
  if (!r.isAnswered) return
  const lines = r.text.split('\n').map(line => line.trim())
  // The index of this chat: what was asked and what came of it, one line each under the time it happened
  const asks = lines.filter(line => line.startsWith('- ') || /^did:/i.test(line))
  if (asks.length) await appendAsks($, m.id, `## ${new Date().toISOString()}\n${asks.join('\n')}\n\n`)
  const named = lines.find(line => /^title:/i.test(line))?.replace(/^title:\s*/i, '').trim() ?? ''
  if (named && named !== m.title && named.length <= 80) {
    await $.mcp
      .call('ccd_session_mgmt', 'set_session_title', { session_id: 'self', title: named })
      .then(() => update($, me, one => ({ ...one, title: named })))
      .catch(() => undefined)
  }
}

const chatHooks = (on: On) => {
  on('session.start', async ($, e, next) => {
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    // and reads its own copy's version again
    loadedVersion = undefined
    const begun = await next(e)
    const home = (await $.env.get('HOME')) ?? ''
    dir = `${home}/.claude/claudopus`
    termLive = /truecolor|24bit/i.test((await $.env.get('COLORTERM')) ?? '') ? LIVE : DEEP_LIVE
    ;[termFrom = '', , termHere = '', termPort = ''] = ((await $.env.get('SSH_CONNECTION')) ?? '').trim().split(/\s+/)
    for (const [art, file] of Object.entries(ART_FILES) as [keyof typeof ART, string][]) {
      const text = await readOr($, `${$.plugin.root}/art/${file}`)
      ART[art] = text.slice(Math.max(0, text.indexOf('<svg')))
    }
    ART.asking = ART.wave.replaceAll('#8A63F0', NEEDS)
    ART.updated = updatedArt(ART.happy, FLOW)
    // A load that moved this chat to a newer version has the header say so, once its octopus is read
    await noteLoaded($).catch(err => log($, `version moved not looked at: ${String(err)}`))
    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
    await noteSeen($).catch(err => log($, `changes seen not noted: ${String(err)}`))
    cwd = e.cwd
    // A reload of this code while its panes stayed up, as in a chat that loads the mod from a folder it watches (the app's chats on
    // another Mac over ssh): the app keeps each button it drew by its key, with the handle of the code now gone, so every press
    // reached nothing. Keys no load before used make it take each button afresh: the moment of the load, with room for a thousand presses
    if ((await $.ui.panes().catch(() => [])).length) presses = 1 + ((await $.clock.now()) % 1_000_000_000) * 1000
    await loadSettings($)
    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
    await closeUndrawn($)
    $.clock.after(3000, () => closeUndrawn($))

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id ? m.needsContext : true }))
    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
    await readOthers($).catch(() => undefined)

    await $.tool.register({
      name: 'update',
      description: 'Records a subject of work in the memory index: creates it, or changes the fields given. `brief` rewrites its one-page brief.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          repo: { type: 'string', description: 'The folder the work happens in' },
          state: { type: 'string', description: 'Where it stands, in at most six words; start with "done" once it is pushed or deployed. Detail goes in the brief' },
          summary: { type: 'string', description: 'One line on what the subject is for' },
          brief: { type: 'string' },
        },
        required: ['name'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'recall',
      description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, subject briefs, pastes, and the results finished work left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'todo',
      description:
        named('For background work: keeps the to-dos under your piece of work in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks it as the one you are doing now, ticks it done or marks it dropped; `was` gives its earlier wording when you reword it. List each thing you set out to do, mark the one you are on as doing, and change the list first when {name} steers.'),
      inputSchema: {
        type: 'object',
        properties: {
          item: { type: 'string', description: named('The to-do in a few plain words, as {name} would say it') },
          state: { type: 'string', enum: ['open', 'doing', 'done', 'dropped'] },
          was: { type: 'string', description: 'The earlier wording of an item that is being reworded' },
        },
        required: ['item'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'note',
      description:
        named('For background work: says where your work stands now, on its card in the panel {name} reads beside the chat. It replaces the line before it. Write it when you start, and again whenever what is true has changed: what is done so far and what you are doing, in one short plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: the ask in one line. The chat starts it as its own piece of work') },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'ask',
      description: named(
        "For background work: when a step needs {name}'s own hands now (a code to paste, a box to fill, a key or a button to press), says so on your card, which stands out at the top of the panel with the ask in view and a Copy button for the exact text, and shows the ask in the chat as a notice, where {name} can answer it too. `text` says what to do, in one plain line; `copy` is only for text {name} must paste somewhere else (a one-time code, a token name, a link to open), never the instructions themselves; `choices` are buttons {name} answers with, such as Approve and Not now, for a go-ahead you need (without them the card offers Done and Not now); {name} can always reply in their own words instead; `pictures` are the picture files the ask is about, such as the options to pick from; `command` is a command only {name} can run, never one you can run yourself: given whole, with its folder in `cwd` or full paths, it is shown with a Copy button and, in a chat on this Mac, a button that opens a terminal with it typed when they press it: open none yourself. The ask stays until {name} answers, even after you finish. An answer clears it and arrives as a message at your next step; carry on meanwhile with what does not depend on it, or end saying what you wait for, and the answer comes back through the chat. Ask again if the answer leaves something waiting. Call it again with empty `text` only once you have seen it done.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          copy: { type: 'string', description: 'Only text they must paste somewhere else, such as a one-time code or a link; leave it out when they only read or press something' },
          choices: { type: 'array', items: { type: 'string' }, description: 'Answers to press, such as Approve and Not now (Done and Not now when left out); the one pressed comes back to you as a message' },
          command: { type: 'string', description: 'A command only they can run, never one you can run yourself, one line, whole: shown with a Copy button, and on this Mac a button that opens a terminal with it typed, never run' },
          cwd: { type: 'string', description: 'The folder the command runs in, a full path; the command is shown starting there. Needed when the command has a relative path' },
          pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the picture files the ask is about, such as the options to pick from; shown with the ask in the chat' },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'waits',
      description: named(
        "For background work, before it finishes: records what in its report waits on {name}, each one short line {name} can answer yes or no. The panel shows each with Yes / No / Not now. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. It replaces what was recorded before; leave it uncalled when nothing waits.",
      ),
      inputSchema: {
        type: 'object',
        properties: { items: { type: 'array', items: { type: 'string' }, description: 'Each a question of at most 140 characters, in plain words, speaking to them as "you"' } },
        required: ['items'],
      },
      isDeferred: false,
    })
    await $.command.register({ name: 'claudopus', description: 'Show the to-dos of this chat: what I asked for, what was done and decided, and each answer' })
    await $.command.register({ name: 'servers', description: 'Show the servers running on this Mac, with a link to each and which chat started it' })
    void $.ui.close({ id: OLD_PANE }).catch(() => undefined)

    // Someone the mod has never set up has no index.md yet: they get the welcome, once
    const isNew = !(await $.fs.exists(`${dir}/index.md`))
    if (isNew) await $.fs.write(`${dir}/index.md`, INDEX_HEAD)
    await settleWelcome($, isNew, id).catch(err => log($, `welcome not settled: ${String(err)}`))
    await measure($).catch(() => undefined)
    await loadFinished($).catch(err => log($, `finished work not read: ${String(err)}`))
    void recoverEnded($).catch(err => log($, `ended work not read back: ${String(err)}`))
    await sync($).catch(() => undefined)
    await loadReports($).catch(() => undefined)
    // Work that is running when the chat loads brings the panel up, if it has never opened
    // and comes back after a reload of the mod (which closes it) if it was open or work is running
    // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
    const isRunning = (await read($, todos)).some(one => !one.parentId && one.status === 'working')
    panelSeen = ''
    const choice = await followPanel($).catch(() => undefined)
    if (!choice && (isRunning || isWelcomeOpen)) await openList($)
    if (!choice && ((await read($, paneShown)) || isRunning) && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST))
      await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(err => log($, `panel not opened again: ${String(err)}`))
    // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
    // open in every chat from now on
    if (!choice && (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)) await choosePanel($, true)
    everyLoad($, PANEL_EVERY, () => followPanel($).catch(err => log($, `panel not followed: ${String(err)}`)))
    everyLoad($, FOLLOW_EVERY, () => follow($).catch(err => log($, `work not followed: ${String(err)}`)))
    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
    lingerSet.clear()
    // Work that ended in the seconds the reload drew nothing has its pause from the panel's next drawing
    {
      const now = await $.clock.now()
      // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
      const last = await read($, lastDrawn)
      lateFrom.clear()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)])
        if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE) lateFrom.set(`${one.id}:${one.endedAt}`, Infinity)
    }
    let seconds = 0
    everyLoad($, 1000, async () => {
      if (drawnNow > (await read($, lastDrawn))) await update($, lastDrawn, () => drawnNow)
      await shareMine($).catch(err => log($, `work not shared: ${String(err)}`))
      // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
      await lookBoxes($).catch(err => log($, `boxes not looked at: ${String(err)}`))
      if (seconds % 2 === 0) await lookForStarted($).catch(err => log($, `running commands not looked at: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      // Held while the person types into a reply box (holdTimes)
      if (!isTyping && (isFlowing || (await read($, todos)).some(one => !one.parentId && one.status === 'working') || (await read($, others)).some(c => c.cards.length))) await update($, tick, n => n + 1)
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)].filter(card => isLingering(card, now))) {
        const key = `${one.id}:${one.endedAt}`
        if (lingerSet.has(key)) continue
        lingerSet.add(key)
        $.clock.after(pauseFrom(one) + LINGER - now + 20, () => void ((lingerSet.delete(key), update($, tick, n => n + 1))))
      }
    })
    everyLoad($, TICK, () => refresh($).catch(err => log($, `servers not looked at again: ${String(err)}`)))
    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
    sharedSign = ''
    isEnded = false
    linkReadAt = 0
    // A load starts with no prompt open: one a reload cut off has no call left to end it
    waiting = []
    asked = []
    await unshare($, true).catch(() => undefined)
    if (macs.length) everyLoad($, FETCH_EVERY, () => fetchMacs($).catch(err => log($, `other Macs not fetched: ${String(err)}`)))
    isRunFromAfar = Boolean(await $.env.get('CLAUDE_SSH_DAEMON_CHILD'))
    if (macs.length) everyLoad($, OPEN_EVERY, () => takeOpens($).catch(err => log($, `presses on other Macs not taken: ${String(err)}`)))
    if (macs.length) everyLoad($, FETCH_EVERY, () => syncResults($).catch(err => log($, `results not made the same: ${String(err)}`)))
    await shareMine($).catch(() => undefined)
    await readAnswers($).catch(() => undefined)
    await readOthers($).catch(() => undefined)
    // The workflows kept, read back, and followed while they run
    await knowSession($)
    await loadFlows($).catch(err => log($, `workflows not read back: ${String(err)}`))
    everyLoad($, FLOW_EVERY, () => followFlows($).catch(err => log($, `workflows not followed: ${String(err)}`)))
    // Claudopus updates itself: a look a little after the chat starts, then whenever one is due
    afterLoad($, UPDATE_AFTER, () => void selfUpdate($).catch(err => log($, `update not looked for: ${String(err)}`)))
    everyLoad($, UPDATE_LOOK, () => selfUpdate($).catch(err => log($, `update not looked for: ${String(err)}`)))
    // and an open chat moves to a newer copy installed while it runs, by itself, once it is idle
    reloadAsked = ''
    everyLoad($, RELOAD_EVERY, () => reloadToInstalled($).catch(err => log($, `reload not looked for: ${String(err)}`)))
    if (isRunFromAfar) {
      await holdOldCopies($).catch(() => undefined)
      everyLoad($, HOLD_EVERY, () => holdOldCopies($).catch(err => log($, `old copies not held: ${String(err)}`)))
    }
    await tidyLog($)
    await log($, `start ${id} in ${e.cwd}${isOff ? ' (handing over is off)' : ''}`)
    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
    await takeCharge($)
    // A move to a newer version has its moment begin now that the load has started whole
    await readyUpdated($).catch(() => undefined)

    return begun
  })

  // A chat that ends removes its file, so the other panels drop its work at once
  on('session.end', async ($, e, next) => {
    isEnded = true
    await unshare($).catch(() => undefined)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    // The notice that a workflow ended ends its card
    if (dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) await flowEnded($, e.text).catch(err => log($, `workflow end not read: ${String(err)}`))
    if (e.isMeta || e.command || !dir) return next(e)
    // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
    const isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text)
    const isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed
    if (!isPerson) return next(e)
    const context = [...(e.context ?? [])]
    let text = e.text
    const m = await read($, me)

    if (!isOff) {
      // The role goes out with the person's first message, after a compaction, and again when its text has changed
      const role = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/chat.md')).text, models))
      const roleSent = mark(role)
      if (!m.isChat || m.needsContext || roleSent !== m.roleSent) {
        // Each subject with the path of its brief, so a brief for work on it can name that path without a search
        const subjects = (await readIndex($)).map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary, `streams/${slug(s.name)}.md`].join(' | ')}`).join('\n')
        context.push(`${role}\nThis chat's saved words: ${dir}/words/${m.id}.md\nSubjects so far (name | folder | session | state | summary | its brief, under ${dir}):\n${subjects || '(none yet)'}`)
      }
      // How full each piece of work is, so a steer for one that is nearly full goes to a fresh agent instead
      const sizes = (await read($, todos))
        .filter(one => !one.parentId && one.tokens > 0)
        .slice(-8)
        .map(one => `${one.title || 'work'} (${one.id}) ${one.isFork && m.window ? `${Math.round((one.tokens / m.window) * 100)}%` : thousands(one.tokens)}`)
      const told = reportsTold(await read($, reports), await $.clock.now())
      context.push(`${BRIEF}${sizes.length ? `\nContext of each piece of work: ${sizes.join('; ')}.` : ''}${told ? `\n${told}` : ''}`)
      await update($, me, one => ({ ...one, isChat: true, needsContext: false, roleSent }))

      if (text.length > PASTE_CHARS) {
        const stamp = new Date().toISOString().replaceAll(':', '-')
        const path = `${dir}/pastes/${stamp}.md`
        await $.fs.write(`${dir}/pastes/${stamp}.md`, text)
        text = `${text.slice(0, 600)}\n\n[${text.length - 1200} characters pasted here were saved to ${path} and left out of this chat]\n\n${text.slice(-600)}`
        context.push(PASTED)
      }
    }

    said = text
    heard = [...heard, text]
    // A message that names a report starts work from it: that work's own report is kept linked to it
    fromReport = (await read($, reports)).find(r => text.includes(`${reportPath(r)}/`) || text.includes(`reports/${r.id}`))?.id ?? ''
    const how = `${e.turnId ? ' (sent while Claude was working)' : ''}${e.origin.kind === 'bridge' ? ' (from the phone)' : ''}${isPressed ? ' (pressed or replied in the panel)' : ''}`
    await appendWords($, m.id, `## ${new Date().toISOString()}${how}\n${text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))

    return next(context.length ? { ...e, text, context } : { ...e, text })
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    // An answer waiting to start ended work again goes from inside this hook, at the end of any turn, the chat's own too (sendWakes)
    if (wakes.length && e.agentId === undefined) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    if (!dir) return done
    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
    // One that only waits for its helpers goes on working
    if (e.agentId !== undefined) {
      const id = e.agentId
      const now = await $.clock.now()
      // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer
      const answer = ((e.answer ?? '').trim() || handedBack.get(id) || '').slice(0, ANSWER_CHARS)
      const isHeld = (await $.agent.list().catch(() => [])).some(one => one.id === id && one.status === 'waiting')
      const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
      // Held only by its own background work, a turn that ends with its report has finished the work: by SubagentHandback, or a
      // reply as long as a report. A short line such as "started it in the background" has not, nor work that waits on its helpers
      // Held on a command or watch of its own that wakes it as it ends, with a to-do of its still being done, it has not finished:
      // what it hands back on the way (an answer to a question while it waits) is no report, and its card stays at work
      const isGoingOn = how === 'done' && isHeld && goesOn(await read($, todos), id)
      const isReport = how === 'done' && isHeld && !isGoingOn && (handedBack.has(id) || answer.length >= REPORT_LEAST)
      // SubagentHandback ends the work's run: its card ends done with its report, though what it left running in the background (a
      // server, a watch, a helper) goes on and is not stopped. Should that wake the work, its next step brings the card back
      const isHandedBack = how === 'done' && handedBack.has(id) && !isGoingOn
      handedBack.delete(id)
      if (isHandedBack) endedByHandback.add(id)
      // Work nothing holds any more has nothing of its own left running in the background
      if (!isHeld) await update($, todos, list => (list.some(one => one.id === id && one.bg) ? list.map(one => (one.id === id ? { ...one, bg: undefined, waitsSince: undefined } : one)) : list))
      await update($, todos, list => {
        const isWaiting = how === 'done' && !isHandedBack && (isHeld || list.some(one => one.parentId === id && one.status === 'working'))
        // What it waits on of its own, since when: the card says so, and a long wait for it is not taken for being stuck
        // Work that gave its report waits on nothing it means to finish
        const waitsSince = (one: Todo) => (isHeld && !isReport && one.bg?.some(b => !b.isWatch) ? (one.waitsSince ?? now) : undefined)
        // An aborted turn's own text is not kept over the report the work gave before it was stopped
        return list.map(one =>
          one.id !== id
            ? one
            : // Work that had ended, woken by what it left running, that ends a turn of words alone has not worked again: it stays
              // as it ended, with its report, and is not announced a second time
              one.status !== 'working' && how === 'done' && !isHandedBack && endedByHandback.has(id)
              ? one
              : isWaiting
              ? { ...one, answer: answer || one.answer, answeredAt: isReport ? now : one.answeredAt, waitsSince: waitsSince(one) }
              : how === 'stopped'
                ? one.status === 'working'
                  ? ended(one, stoppedAs(one), now)
                  : one
                : { ...ended(one, how, now), answer: answer || one.answer },
        )
      })
      if (how === 'stopped') await keepStoppedReports($, now)
      await lookEnds($)
      // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
      if ((await read($, todos)).find(one => one.id === id)?.status !== 'working') await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
      if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
      // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
      // held on its own background work leaves it once it ends (keepStoppedReports)
      const card = (await read($, todos)).find(one => one.id === id)
      const report = (e.answer ?? '').trim() || answer
      if (card && !card.parentId && card.status === 'done' && card.endedAt === now && how === 'done' && report) {
        $.clock.after(5, () => void saveReport($, card, report).catch(err => log($, `report of ${id} not kept: ${String(err)}`)))
      }
      return done
    }
    const text = said
    said = ''
    heard = []
    // Off the turn's clock, so the reply is never held up
    $.clock.after(5, () => void afterReply($, text, e.answer ?? '').catch(err => log($, `pass after reply failed: ${String(err)}`)))

    return done
  })

  // A compaction keeps what the person asked for, and the role text goes out again after it
  on('session.compact', async ($, e, next) => {
    const isChat = (await read($, me)).isChat && !isOff
    const r = await next({ ...e, instructions: [e.instructions, KEEP, isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') })
    if (e.agentId === undefined && e.trigger !== 'precompute') await update($, me, m => ({ ...m, needsContext: true }))

    return r
  })

  // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
  // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
  // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there
  on('prompt.context', async ($, e, next) => {
    const r = await next(e)
    const files = r.instructionFiles ?? e.instructionFiles
    // The person's own copy in the memory folder when there is one, the shipped principles otherwise
    const { path, text: content } = await inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')
    if (!files || !content.trim()) return r
    // Another copy of the mod loaded beside this one sends the same principles, with the rule for afar after them or not
    const others = files.filter(one => !one.content.trim().startsWith(content.trim()))
    const at = others.findIndex(one => one.kind !== 'managed')
    // Read here, not from the flag the chat's start sets, so a context made before that start ends still carries the rule
    const isAfar = Boolean(await $.env.get('CLAUDE_SSH_DAEMON_CHILD'))
    const ours = { path, kind: 'user' as const, content: isAfar ? `${content.trimEnd()}\n\n${named(AFAR_RULE)}\n` : content }

    return { ...r, instructionFiles: at < 0 ? [...others, ours] : [...others.slice(0, at), ours, ...others.slice(at)] }
  })

  on('tool.describe', async (_, e, next) => {
    const r = await next(e)
    const isRare = RARE_TOOLS.includes(e.tool) || RARE_SERVERS.some(prefix => e.tool.startsWith(prefix))

    return isRare ? { ...r, isDeferred: true } : r
  })

}

// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, the
// card of work under which nothing new has come back for STUCK_AFTER, and finished work that something it started still holds

// Nothing new for this long anywhere under a piece of work, while it works, and its card says so and the chat is told once. Above
// the longest one command can run (ten minutes) with a step either side of it, so a single long build or wait is not flagged
const STUCK_AFTER = 12 * 60_000
// One call running this long shows on its row, with its time
const RUNNING_SHOWN = 2 * 60_000
// Lines each agent has seen come back, so a wait that returns what it returned before is no news; kept to this many each
const SEEN_KEPT = 5000
// Only this many lines of one result are looked at
const LINES_READ = 2000

// The calls running now, by tool_use_id: whose, what, since when
const inFlight = new Map<string, { agent: string; what: string; at: number }>()
const seenLines = new Map<string, Set<string>>()

// What a running call is, in a few words, for its row
const runningWhat = (tool: string) =>
  tool === 'Bash' ? 'one command running' : tool === 'Grep' || tool === 'Glob' ? 'one search running' : tool === 'Agent' ? 'its helper running' : `${tool.replace(/^mcp__.*__/, '')} running`

// A result as lines: its text where it has some, else its parts each on a line of their own
const resultLines = (result: unknown): string[] => {
  const text =
    typeof result === 'string'
      ? result
      : Array.isArray((result as { content?: unknown })?.content)
        ? ((result as { content: { text?: unknown }[] }).content.map(part => String(part.text ?? '')).join('\n'))
        : result && typeof result === 'object'
          ? Object.values(result as Record<string, unknown>).map(value => (typeof value === 'string' ? value : JSON.stringify(value) ?? '')).join('\n')
          : String(result ?? '')
  // Digits are left out, so a wait that only prints a new time or count says nothing new
  return text.split('\n', LINES_READ).map(line => line.trim().replace(/\d/g, '#').slice(0, 300)).filter(Boolean)
}

// The longest-running call of an agent, as its card keeps it
const runningOf = (agent: string) => {
  const first = [...inFlight.values()].filter(one => one.agent === agent).sort((a, b) => a.at - b.at)[0]
  return first ? { what: first.what, at: first.at } : undefined
}
// A card with its running call as it is now, worked out as it is changed, so calls that begin and end together leave it true;
// the list itself when nothing changed
const withRunning = (list: Todo[], agent: string, newAt?: number) => {
  const running = runningOf(agent)
  const at = list.findIndex(one => one.id === agent)
  const one = list[at]
  if (!one || (one.running?.at === running?.at && one.running?.what === running?.what && (newAt === undefined || one.newAt === newAt))) return list
  return list.map((card, n) => (n === at ? { ...card, running, newAt: newAt ?? card.newAt } : card))
}

// A call of a piece of work begins: its card keeps the one it has been running longest
const callBegun = async ($: EngineInterface, id: string, agent: string, tool: string) => {
  inFlight.set(id, { agent, what: runningWhat(tool), at: await $.clock.now() })
  await update($, todos, list => withRunning(list, agent))
}

// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
const callEnded = async ($: EngineInterface, id: string, agent: string, tool: string, r: { result?: unknown; deny?: unknown } | undefined) => {
  inFlight.delete(id)
  const now = await $.clock.now()
  let isNew = false
  if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
    const seen = seenLines.get(agent) ?? new Set<string>()
    for (const line of resultLines(r.result)) if (!seen.has(line)) ((isNew = true), seen.add(line))
    if (seen.size > SEEN_KEPT) seenLines.set(agent, new Set([...seen].slice(-SEEN_KEPT / 2)))
    else seenLines.set(agent, seen)
  }
  await update($, todos, list => withRunning(list, agent, isNew ? now : undefined))
}

// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
const movedAt = (list: Todo[], top: Todo) => Math.max(...[top, ...underOf(list, top.id)].map(one => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0)))

// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work waiting on the person is not flagged: asking them something, or stopped
// on the app's own prompt to allow a call; nor work that gave its report and is only held by what it left running
const lookStuck = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const told: Todo[] = []
  await update($, todos, list => {
    let isChanged = false
    const isPrompted = (one: Todo) => waiting.some(p => p.agent && topOf(list, p.agent) === one.id)
    const next = list.map(one => {
      if (one.parentId || one.chat) return one
      // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
      const isWaitingOwn = Boolean(one.waitsSince && one.bg?.some(b => !b.isWatch))
      const isStuck = one.status === 'working' && !(one.ask && !one.ask.replied) && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined })
      return one
    })
    return isChanged ? next : list
  })
  for (const one of told) await sayInChat($, named(STUCK_IN_CHAT(titleOf(one), Math.round((now - movedAt(await read($, todos), one)) / 60_000))))
  // What agents that have ended had seen come back is let go
  const list = await read($, todos)
  for (const agent of seenLines.keys()) if (!list.some(one => one.id === agent && one.status === 'working')) seenLines.delete(agent)
}

// What a stuck card says above its line: how long nothing new has come back, and whether its helpers, or it, sit in a long call
const stuckLine = (list: Todo[], one: Todo, at: number) => {
  if (!one.stuckAt) return ''
  const mins = Math.max(1, Math.round((at - one.stuckAt) / 60_000))
  const isLong = (kid: Todo) => Boolean(kid.running && at - kid.running.at >= RUNNING_SHOWN)
  const helpers = underOf(list, one.id).filter(kid => kid.status === 'working')
  const tail = helpers.length
    ? helpers.every(isLong) ? ` ${helpers.length === 1 ? 'Its helper keeps' : helpers.length === 2 ? 'Both helpers keep' : `All ${helpers.length} helpers keep`} waiting.` : ''
    : isLong(one) ? ` One call has run ${took(at - (one.running?.at ?? at))}.` : ''
  return `Nothing new for ${mins} min.${tail}`
}

// A row's running call, with its time, once it has run RUNNING_SHOWN
const runningLine = (one: Todo, at: number) => (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? `${one.running.what} · ${took(at - one.running.at)}` : '')

// ---- What work started in the background itself, which wakes it as it ends ----

const BG_KEPT = 20
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response wakes nothing and is not kept
const keepBackground = async ($: EngineInterface, agent: string, call: { tool: string; description?: unknown; command?: unknown; task_id?: unknown; shell_id?: unknown }, result: unknown) => {
  if (call.tool === 'TaskStop' || call.tool === 'KillShell') return dropBackground($, [String(call.task_id ?? call.shell_id ?? '')])
  const r = (result && typeof result === 'object' ? result : {}) as { backgroundTaskId?: unknown; taskId?: unknown; backgroundEndsWithFinalResponse?: unknown }
  // A command the engine ends with the work's final response wakes nothing and is not kept (the engine does not always say that
  // one it keeps wakes its owner, so its silence is no sign)
  const id = call.tool === 'Bash' ? r.backgroundTaskId : call.tool === 'Monitor' ? r.taskId : undefined
  if (typeof id !== 'string' || !id || r.backgroundEndsWithFinalResponse) return
  const what = oneLine(String(call.description ?? '') || String(call.command ?? '').split('\n')[0] || '').slice(0, 160)
  const now = await $.clock.now()
  await update($, todos, list =>
    list.map(one => (one.id === agent ? { ...one, bg: [...(one.bg ?? []).filter(b => b.id !== id), { id, what, at: now, ...(call.tool === 'Monitor' ? { isWatch: true } : {}) }].slice(-BG_KEPT) } : one)),
  )
}
// Background work that has ended or was stopped leaves every card that kept it
const dropBackground = async ($: EngineInterface, ids: string[]) =>
  update($, todos, list => {
    const isGone = (id: string) => ids.includes(id)
    if (!list.some(one => one.bg?.some(b => isGone(b.id)))) return list
    return list.map(one => {
      const bg = one.bg?.filter(b => !isGone(b.id))
      return bg?.length === one.bg?.length ? one : { ...one, bg: bg?.length ? bg : undefined, waitsSince: bg?.some(b => !b.isWatch) ? one.waitsSince : undefined }
    })
  })

// What work still at work says on its card while it waits for a command of its own: which, and how long it has run
const waitLine = (one: Todo, at: number) => {
  const commands = (one.bg ?? []).filter(b => !b.isWatch)
  // The newest command it started, the one it is most likely on now
  const first = commands.at(-1)
  if (one.status !== 'working' || !one.waitsSince || one.answeredAt || !first) return ''
  const more = commands.length > 1 ? ` and ${commands.length - 1} more` : ''
  return `Still at work: it waits for its background command${more} to finish, running ${took(at - first.at)}${first.what ? `: ${cut(first.what, 90)}` : ''}`
}

// What finished work left running says on its card
const leftLine = (one: Todo, at: number) => (one.leftSince && one.status !== 'working' ? `It left something running in the background, ${took(at - one.leftSince)}` : '')

// Work starting and running: the chat's own thread kept to handing work over, how full the chat is, each step of work, and new
// work's card

const workHooks = (on: On) => {

  // A chat's own thread starts agents and talks to them; the work runs in the agents, which carry an agent id
  on('tool.call', async ($, e, raw) => {
    // A prompt the call raised goes as the call ends: refused, interrupted, or allowed and run
    const run = async (call: typeof e) => {
      // What work runs, and what comes back of it, tells the stuck check whether it moves
      const isWatched = e.agentId !== undefined && Boolean(dir)
      if (isWatched) await callBegun($, e.tool_use_id, e.agentId ?? '', e.tool).catch(err => log($, `call not followed: ${String(err)}`))
      let r: Awaited<ReturnType<typeof raw>> | undefined
      try {
        r = await raw(call)
        return r
      } finally {
        if (isWatched) await callEnded($, e.tool_use_id, e.agentId ?? '', e.tool, r as never).catch(err => log($, `call end not followed: ${String(err)}`))
        asked = asked.filter(one => one.id !== e.tool_use_id)
        settle($, e.tool_use_id, e.agentId, e.tool)
      }
    }
    if (e.tool === 'Bash' && KEYCHAIN_READ.test(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that reads the keychain')
      return { deny: NO_READ }
    }
    // Main is reached only through the release runner, which takes its turn, so two pieces of work never release at once
    if (e.tool === 'Bash' && pushesMain(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that pushes or merges to main itself')
      return { deny: `${NO_PUSH} It is ${$.plugin.root}/bin/release.` }
    }
    // Work sent a message works again once the message is on its way: what it reported before no longer makes a stop a finish
    let woken = ''
    const next = async (call: typeof e) => {
      const r = await run(call)
      if (woken && !r.deny && !r.isError) await update($, todos, list => list.map(one => (one.id === woken && one.answeredAt ? { ...one, answeredAt: undefined } : one)))
      // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
      if (woken && !r.deny && !r.isError) await wakeCard($, woken)
      if (dir && e.agentId !== undefined && !r.deny && !r.isError) await keepBackground($, e.agentId, call as never, r.result).catch(err => log($, `background work not followed: ${String(err)}`))
      return hideKept($, call, r)
    }
    // A message of the person's that the chat's own thread passes on to work under way is a steer: that work is told so, and owes
    // a line saying what it decided. It is kept by the card in their words. Any other message to work under way, a helper's reply,
    // one between pieces of work or the chat's own note, is told as its sender's
    let steered = ''
    let from = ''
    let answered = ''
    let answer: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number } | undefined
    let message = ''
    let woke = ''
    let words = ''
    if (dir && e.tool === 'SendMessage') {
      const to = String((e as { to?: unknown }).to ?? '')
      message = String((e as { message?: unknown }).message ?? '')
      const theirs = e.agentId === undefined ? heard.findLast(one => carries(message, one)) : undefined
      words = theirs ? quoted(theirs, 600) : ''
      const now = await $.clock.now()
      const list = await read($, todos)
      const target = to ? (list.find(one => one.id === to) ?? list.find(one => to.startsWith(one.id))) : undefined
      // The person's words passed on to work whose card asks them something answer that ask, as a press on the card does: the card's
      // own work, or the helper that asked. Marked at once, so a press on the card at the same moment counts once; undone if refused
      const asking = target && words && e.agentId === undefined ? (list.find(one => one.id === target.id && one.ask) ?? list.find(one => one.ask?.from === target.id)) : undefined
      const asked = asking?.ask ? `${asking.id}:${asking.ask.at}:${asking.ask.text}` : ''
      if (asking?.ask && !answeredAsks.has(asked)) {
        answeredAsks.add(asked)
        answered = asking.ask.text
        answer = { card: asking, ask: asking.ask, key: asked, words, at: now }
      }
      if (target) {
        woken = target.id
        // Their words are theirs whether the work is under way or is started again by them: ended work is told whose they are
        const isSteer = target.status === 'working' && Boolean(words) && !answered
        if (target.status !== 'working' && words && !answered) woke = words
        if (target.status === 'working' && message && !isSteer) {
          const sender = list.find(one => one.id === e.agentId)
          const title = (one?: Todo) => (one?.title ? ` "${cut(oneLine(one.title), 60)}"` : '')
          from =
            e.agentId === undefined
              ? 'the chat'
              : sender?.parentId === target.id
                ? `your helper${title(sender)}`
                : target.parentId === e.agentId
                  ? 'the work that started you'
                  : `the work${title(sender)}`
        }
        await update($, todos, list =>
          list.map(one =>
            one.id !== target.id
              ? one
              : {
                  ...one,
                  owes: isSteer ? 0 : one.owes,
                  entries: words && one.entries.at(-1)?.text !== words ? [...one.entries, { at: now, kind: 'steer' as const, text: words }].slice(-ENTRIES_KEPT) : one.entries,
                },
          ),
        )
        if (isSteer || from || answered || woke) steered = target.id
      }
    }
    if (e.agentId !== undefined) {
      const id = e.agentId
      // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
      if (e.tool === 'Agent') helperCalls.set(e.tool_use_id, id)
      endedByHandback.delete(id)
      stoppedHere.delete(id)
      // Work that calls a tool is working: a card that had ended is back. Its steps are counted: to place a steer among them,
      // to see that a steer got its decision, and to see that its to-dos are still being kept
      if (dir) {
        const now = await $.clock.now()
        const isKeeping = isTool(e.tool, 'todo') || isTool(e.tool, 'note')
        let nudge = ''
        await update($, todos, list =>
          list.map(one => {
            if (one.id !== id) return one
            const base = { ...(one.status === 'working' ? one : resumed(one, now)), steps: (one.steps ?? 0) + 1, answeredAt: undefined, waitsSince: undefined }
            if (isKeeping) return { ...base, quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes }
            const owes = one.owes === undefined ? undefined : one.owes + 1
            const quiet = (one.quiet ?? 0) + 1
            const isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS
            nudge = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : ''
            return { ...base, owes, quiet: isQuiet ? 0 : quiet }
          }),
        )
        if (nudge) void tell($, id, nudge)
      }
    }
    // The steer is sent as it was written; once it is on its way, the work it goes to is told what a steer asks of it
    if (steered) {
      const sent = await next(e)
      if (answer) await answeredInChat($, answer, steered, !sent.deny && !sent.isError)
      // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
      // message of its own instead, read once it reaches it
      // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
      // chat's own note that landed after the person's words once marked their words as not theirs
      const line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true))) : woke ? WOKE(woke) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words))
      if (!sent.deny) void tell($, steered, line).then(r => (!r || r.deny ? $.session.send({ to: { agentId: steered }, text: line }).catch(err => log($, `work ${steered} not told: ${String(err)}`)) : undefined))
      return sent
    }
    // A report handed back is kept as the turn's answer only once the handback went through: refused, the work carries on
    if (e.agentId !== undefined && String(e.tool) === 'SubagentHandback') {
      const r = await next(e)
      if (!r.deny && !r.isError) handedBack.set(e.agentId, String((e as { message?: unknown }).message ?? '').trim())
      return r
    }
    if (e.agentId !== undefined) return next(e)
    if (isOff || !(await read($, me)).isChat) return next(e)
    // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
    if (e.tool === 'Agent') {
      const call = e as unknown as { subagent_type?: unknown; model?: unknown }
      if (call.subagent_type === 'fork' || !String(call.model ?? '').trim()) {
        await log($, `refused an Agent call ${call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'}`)
        return { deny: NO_COPY() }
      }
    }
    // Work the chat stops ends at once, as a press on Stop ends it: done when it had already given its report
    if (e.tool === 'TaskStop' && dir) {
      const r = await next(e)
      const stopId = String((e as { task_id?: unknown }).task_id ?? '')
      if (!r.deny && stopId) {
        stoppedHere.add(stopId)
        await dropBackground($, [stopId])
        const now = await $.clock.now()
        await update($, todos, list => list.map(one => (one.id === stopId && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now) : one.id === stopId && one.leftSince ? { ...one, leftSince: undefined } : one)))
        await keepStoppedReports($, now)
        await lookEnds($)
      }
      return r
    }
    if (OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return next(e)
    // The chat reads a kept report itself, to answer from it
    const readPath = String((e as { file_path?: unknown }).file_path ?? '')
    if (e.tool === 'Read' && readPath.startsWith(`${reportsDir()}/`) && !readPath.split('/').includes('..')) return next(e)
    await log($, `refused ${e.tool} in a chat's own thread`)

    return { deny: REFUSED }
  })

  // How full this chat's context is, as the app counts it, each time it moves
  on('session.measure', async ($, e, next) => {
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    const tokens = e.context.tokens
    if (tokens !== undefined) await update($, me, one => (one.tokens === tokens && one.window ? one : { ...one, tokens, window: one.window || e.context.window }))

    return next(e)
  })

  // How full a piece of work's context is, and which model it runs on: what the API reports when a response of its ends.
  // The response itself passes through untouched and unread; only the count and the model's name are kept
  // Work the person moved to another model sends each step from then on to that model; only the model the request names changes
  on('turn.step', async function* ($, e, next) {
    const id = e.agentId
    if (id !== undefined) replyRead($, id)
    // Work that takes a step again after its report is working again: stopped from now, it is stopped
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.answeredAt)) await update($, todos, list => list.map(one => (one.id === id ? { ...one, answeredAt: undefined } : one)))
    const chosen = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id)?.chosen : undefined
    const r = yield* next(chosen && modelName(chosen) !== modelName(e.model) ? { ...e, model: chosen } : e)
    const tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0
    const model = (r.usage as { model?: string } | undefined)?.model
    if (id !== undefined && tokens && flowAgents.has(id)) await flowStep($, id, tokens, model).catch(() => undefined)
    if (id !== undefined && tokens && dir) await update($, todos, list => list.map(one => (one.id === id ? { ...one, tokens, model: one.chosen ?? (modelName(model ?? '') ? model : one.model) } : one)))

    return r
  })

  // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
  on('classic.SubagentStop', async ($, e, next) => {
    const r = await next(e)
    const live = e.background_tasks
    if (dir && Array.isArray(live)) {
      const ids = new Set(live.map(one => one.id))
      const gone = ((await read($, todos)).find(one => one.id === e.agent_id)?.bg ?? []).filter(b => !ids.has(b.id)).map(b => b.id)
      if (gone.length) await dropBackground($, gone).catch(err => log($, `ended background work not let go: ${String(err)}`))
    }
    return r
  })

  on('agent.spawn', async ($, e, next) => {
    // An agent a workflow's script starts belongs to its run's blue card, not a card of its own
    if (e.workflow) {
      const r = await next(e)
      if (r.agentId && dir) await flowSpawned($, e.workflow.runId, r.agentId, modelName(r.model ?? '') ? r.model : e.model || r.model || '', e.description ?? '').catch(err => log($, `workflow agent not kept: ${String(err)}`))
      return r
    }
    const parentId = e.parentAgentId ?? helperCalls.get(e.tool_use_id) ?? ''
    // Only what the chat's own thread starts is a to-do; what a piece of work starts is its helper
    const isOwn = !parentId
    // Work the chat starts is told to keep its to-do true; one that goes on after a message already knows
    const isTold = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow && (await read($, me)).isChat
    // and is handed, after its brief, the rules every piece of work follows and where the chat's words are, so the brief stays short
    // and where the runner is that does an admin command with a Mac's kept password
    const work = isTold ? named(fillModels((await inForce($, $.plugin.root, dir, 'roles/work.md')).text, models)).replace(/\{admin\}/g, `${$.plugin.root}/bin/admin`).replace(/\{secret\}/g, `${$.plugin.root}/bin/secret`).replace(/\{release\}/g, `${$.plugin.root}/bin/release`).trim() : ''
    const words = isTold ? `- The chat's saved words, ${who()}'s messages word for word: ${dir}/words/${(await read($, me)).id}.md` : ''
    const r = await next(isTold ? { ...e, prompt: `${e.prompt}\n\n${workHead()}\n${words}\n${work}\n\n${named(PANEL_RULE)}` } : e)
    if (!dir || !r.agentId) return r
    const id = r.agentId
    endedByHandback.delete(id)
    const now = await $.clock.now()
    // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
    // several, or one on something else, only reads them
    const named1 = isOwn && !fromReport && !e.resume ? (await read($, reports)).filter(one => e.prompt.includes(`reports/${one.id}/`) || e.prompt.endsWith(`reports/${one.id}`)) : []
    const goesOn = named1.length === 1 && named1[0] && [...aboutWords(named1[0].title)].some(word => aboutWords(e.description ?? '').has(word)) ? named1[0].id : ''
    const from = fromReport || goesOn
    await update($, todos, list => {
      const old = list.find(one => one.id === id)
      // Its title is the few words the task was given; under it, the person's message as they wrote it
      const fresh = { ...started(id, parentId, e.description ?? '', isOwn ? said : '', now, e.fork), ...(isOwn && from ? { from } : {}) }
      return capped([...list.filter(one => one.id !== id), { ...(old ? resumed(old, now) : fresh), model: old?.chosen ?? r.model }])
    })
    if (isOwn) await openList($)
    await sync($).catch(() => undefined)

    return r
  })

}

// The /claudopus and /servers commands, and the panel's focus and close

const commandHooks = (on: On) => {

  on('command.run', { command: 'claudopus' }, async $ => {
    await update($, me, one => ({ ...one, isListOpened: true }))
    await update($, paneShown, () => true)
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS })
    // Asked for where it can be drawn, it is open in every chat from now on
    if (opened.isPlaced) await choosePanel($, true)

    return { text: opened.isPlaced ? 'Claudopus panel opened.' : nowhere('Claudopus') }
  })

  // A reply box the person moves the focus into holds the list's times, so the list is not drawn under them as they start typing
  on('ui.focus', async ($, e, next) => {
    if (e.origin.kind === 'person' && e.plugin === 'claudopus' && /-reply-/.test(e.element ?? '')) holdTimes($)
    return next(e)
  })
  // Closed by the person's own hand, it closes in every chat and stays closed until asked for; a close of the mod's own is no choice
  on('ui.close', async ($, e, next) => {
    const r = await next(e)
    if (e.id === LIST && e.origin.kind === 'person' && dir) await choosePanel($, false)
    return r
  })

  on('command.run', { command: 'servers' }, async $ => {
    await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    const opened = await $.ui.open({ id: PANE, title: PANE_TITLE })

    return { text: opened.isPlaced ? 'Servers panel opened.' : nowhere('Servers') }
  })

}

// The mod's own tools: update, recall, todo, waits, ask and note

const toolHooks = (on: On) => {

  on('tool.call', { tool: 'mcp__claudopus__update' }, async ($, e) => {
    const input = e as unknown as { name?: string; repo?: string; state?: string; summary?: string; brief?: string }
    if (!input.name?.trim()) return { result: 'A subject needs a name.' }
    const saved = await saveStream($, input.name, { repo: input.repo, state: input.state?.slice(0, 60), summary: input.summary })
    // The subject a piece of work recorded names the subject of its report
    if (e.agentId !== undefined) await change($, e.agentId, one => ({ ...one, subject: saved.name }))
    const path = `${dir}/streams/${slug(saved.name)}.md`
    if (input.brief?.trim()) await $.fs.write(`${dir}/streams/${slug(saved.name)}.md`, `${input.brief.trim()}\n`)

    return { result: `- ${[saved.name, saved.repo, saved.session, saved.state, saved.summary].join(' | ')}\nBrief: ${path}${input.brief?.trim() ? ' (rewritten)' : ''}` }
  })

  on('tool.call', { tool: 'mcp__claudopus__recall' }, async ($, e) => {
    const query = (e as unknown as { query?: string }).query?.trim() ?? ''
    if (!query) return { result: 'Nothing to search for.' }
    const r = await $.process.run(['grep', '-rniF', '--include=*.md', '-e', query, dir])
    // A result the person put away is still found, marked, so it is answered from only when they name it
    const archived = new Set((await loadReports($).catch(() => [] as Report[])).filter(one => one.archived).map(one => one.id))
    const lines = r.stdout
      .split('\n')
      .filter(Boolean)
      .map(line => line.replace(`${dir}/`, ''))
      .map(line => (archived.has(line.match(/^reports\/([^/]+)\//)?.[1] ?? '') ? `[archived] ${line}` : line).slice(0, 240))
    if (!lines.length) return { result: `Nothing in ${dir} mentions "${query}".` }
    const more = lines.length > 40 ? `\n(${lines.length - 40} more lines; narrow the phrase)` : ''

    return { result: `Files are under ${dir}.\n${lines.slice(0, 40).join('\n')}${more}` }
  })

  // The work lists what it sets out to do under its to-do, ticks it, rewords it or marks it dropped
  on('tool.call', { tool: 'mcp__claudopus__todo' }, async ($, e) => {
    const input = e as unknown as { item?: string; state?: string; was?: string }
    const text = oneLine(input.item ?? '').slice(0, 200)
    if (!text) return { result: 'A to-do needs its words.' }
    if (e.agentId === undefined) return { result: "Only background work has a to-do in the panel; a chat's own thread has none." }
    const state: Item['state'] | undefined = input.state === 'done' || input.state === 'dropped' || input.state === 'open' || input.state === 'doing' ? input.state : undefined
    const old = slug(input.was?.trim() ? input.was : text)
    let items: Item[] = []
    await change($, e.agentId, one => {
      const isListed = one.items.some(item => slug(item.text) === old)
      const next: Item[] = isListed ? one.items.map(item => (slug(item.text) === old ? { text, state: state ?? item.state } : item)) : [...one.items, { text, state: state ?? 'open' }]
      // One thing is being done at a time: what was being done before waits again
      items = state === 'doing' ? next.map(item => (item.state === 'doing' && item.text !== text ? { ...item, state: 'open' as const } : item)) : next
      return { ...one, items }
    })

    return { result: items.map(item => `${item.state === 'done' ? '[x]' : item.state === 'dropped' ? '[dropped]' : item.state === 'doing' ? '[doing]' : '[ ]'} ${item.text}`).join('\n') }
  })

  // The work says what in its report waits on the person: it knows best. Its next report takes them, one item each
  on('tool.call', { tool: 'mcp__claudopus__waits' }, async ($, e) => {
    const input = e as unknown as { items?: unknown }
    if (e.agentId === undefined) return { result: "Only background work leaves a result; a chat's own thread has none." }
    // A helper's answer is no report: the work it answers to records what waits
    if ((await read($, todos)).find(one => one.id === e.agentId)?.parentId) return { result: 'A helper records nothing here: say what waits in your answer, and the work that started you records it.' }
    const items = [...new Set((Array.isArray(input.items) ? input.items : []).filter((one): one is string => typeof one === 'string').map(one => cut(oneLine(one), 200)).filter(Boolean))].slice(0, 12)
    await change($, e.agentId, one => ({ ...one, waits: items.length ? items : undefined }))
    return { result: items.length ? `Recorded ${items.length} waiting on ${who()}; the panel shows them with your result.` : `Nothing waits on ${who()}.` }
  })

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until they answer or the work clears it
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown; pictures?: unknown }
    if (e.agentId === undefined) return { result: `Only background work asks through the panel; a chat's own thread asks ${who()} in its reply.` }
    const text = oneLine(typeof input.text === 'string' ? input.text : '').slice(0, 300)
    const given0 = oneLine(typeof input.command === 'string' ? input.command : '').slice(0, 1000)
    const hasFolder = typeof input.cwd === 'string' && input.cwd.startsWith('/')
    // A command is given whole, runnable as it is wherever the person types it: it starts in its folder, and one that starts with a
    // path relative to a folder never named is refused, since the person types it somewhere else
    if (given0 && !hasFolder && /^(?:\.{1,2}\/|[\w-][\w.-]*\/)/.test(given0)) {
      return { result: 'Not shown: the command starts with a path relative to a folder it does not name. Give `cwd`, the full path of the folder it runs in, or a full path, so it runs as it is wherever it is typed.' }
    }
    const command = given0 && hasFolder && !/^cd\s/.test(given0) ? `cd ${zshQuoted(String(input.cwd))} && ${given0}` : given0
    // Copy is for text pasted elsewhere: a sentence of instructions, or the ask's own words, gets none
    const given = (typeof input.copy === 'string' ? input.copy : '').trim().slice(0, 4000)
    const isProse = given.split(/\s+/).length > 8 && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(given) && !/[\/=_$`@]|https?:/.test(given)
    const copy = command || (isProse || flat(text).includes(flat(given)) ? '' : given)
    const folder = typeof input.cwd === 'string' && input.cwd.startsWith('/') ? input.cwd : cwd
    const choices = [...new Set((Array.isArray(input.choices) ? input.choices : []).filter((one): one is string => typeof one === 'string').map(one => oneLine(one).slice(0, 40)).filter(Boolean))].slice(0, 4)
    // Pictures the ask is about, by full path; one that is not a picture file on this Mac is left out
    const givenPics = [...new Set((Array.isArray(input.pictures) ? input.pictures : []).filter((one): one is string => typeof one === 'string').map(one => one.trim()).filter(one => IMAGE.test(one)))].slice(0, 8)
    const pictures: string[] = []
    for (const path of givenPics) if (path.startsWith('/') && (await $.fs.stat(path).catch(() => undefined))?.kind === 'file') pictures.push(path)
    const at = await $.clock.now()
    const before = await read($, todos)
    const was = before.find(one => one.id === topOf(before, e.agentId ?? ''))?.ask
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices, from: e.agentId } : {}), ...(pictures.length ? { pictures } : {}), at } : undefined }))
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, e.agentId ?? ''))
    if (!text) {
      if (card && was) await askGone($, card)
      return { result: 'Cleared: your card no longer asks for anything.' }
    }
    // The same ask said again is not told again
    if (card && was?.text !== text) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
    if (card) await askInChat($, card)
    // A command for the person opens in a terminal only on their press of the card's button: nothing opens by itself
    const terminal = command ? (isRunFromAfar ? ` ${who(true)} is on another device: they type it in their own session to this Mac, and nothing opens a terminal here.` : ` Do not open a terminal for it: the card's Open in Terminal button opens one with the command typed when ${who()} presses it.`) : ''
    const shown = [command ? `the whole command${command === given0 ? '' : ` (${command})`}, a Copy button${isRunFromAfar ? '' : ' and an Open in Terminal button'}` : copy ? 'a Copy button for the text' : '', `the buttons ${(choices.length ? choices : DEFAULT_ANSWERS).join(', ')} and a box for a reply in their own words`].filter(Boolean).join(' and ')
    const lost = givenPics.length - pictures.length
    const seen = pictures.length ? ` Its ${pictures.length === 1 ? 'picture is' : `${pictures.length} pictures are`} named with it, and the chat shows ${pictures.length === 1 ? 'it' : 'them'} in its next reply.` : ''
    const missing = lost ? ` ${lost} of the pictures given ${lost === 1 ? 'is' : 'are'} no picture file found here, by full path, and ${lost === 1 ? 'was' : 'were'} left out.` : ''
    return { result: `Shown on your card with ${shown}, and shown in the chat as a notice from the panel, where ${who()} can answer it too.${seen}${missing} It stays until ${who()} answers, even after you finish; an answer comes back to you as a message, and starts you again if you have finished. Ask again if it leaves something waiting. Clear it with empty text only once you have seen it done.${terminal}` }
  })

  // The work writes its own log, on purpose, in plain words: what it starts and what it decides
  on('tool.call', { tool: 'mcp__claudopus__note' }, async ($, e) => {
    const input = e as unknown as { text?: string; decision?: boolean; task?: string }
    const text = oneLine(input.text ?? '').slice(0, NOTE_CHARS)
    if (!text) return { result: 'A note needs its text.' }
    if (e.agentId === undefined) return { result: "Only background work keeps a log in the panel; a chat's own thread has none." }
    const kind: Entry['kind'] = input.decision ? 'decision' : 'note'
    await change($, e.agentId, (one, at) => ({ ...one, entries: [...one.entries, { at, kind, text }].slice(-ENTRIES_KEPT) }))
    // A steer the work found to be a new task of its own goes back to the chat, which starts it. The work sends it itself, as a
    // message to the chat: it arrives as the work's and wakes the chat, where a prompt the mod submitted would show as the person's own.
    // A session cannot send to itself, so the mod cannot send it for the work
    const task = oneLine(input.task ?? '').slice(0, 400)
    if (!task) return { result: 'Noted.' }
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, e.agentId ?? ''))
    const words = [...(card?.entries ?? [])].reverse().find(entry => entry.kind === 'steer')?.text ?? ''
    said = words || task
    const handed = `A message from ${who()} to the work "${card?.title || 'in the background'}" is a new task of its own, not part of that work, and the work has not done it. Start it as its own piece of work: ${task}${words ? `\n${who(true)}'s words: “${words}”` : ''}`

    return { result: `Noted. Hand the task to the chat now: call SendMessage (load it with ToolSearch if needed) with to "main" and this message, exactly:\n${handed}\nThen carry on with your own work; do not do that task here.` }
  })

}

// Above the prompt: the small octopus while work runs

// The answer picked above the prompt by its number, and how long the pick waits for the same number again
let bandPick: { id: string; n: number } | undefined
const BAND_PICK = 6000
const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and nothing of what it is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const cards = await read($, todos)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    const ui = uiOf($, e)
    const { Box, Button, Text } = ui

    // In the terminal the panel is out of the keys' reach until ctrl+x Tab, and a narrow one seats no panel until it is asked for:
    // there what needs the person is said here, every chat's, under the name of the work that asks, whole, with its answers
    // numbered. A bare digit typed in an empty prompt presses a band's Button, so the person answers from where they already are.
    // A message may begin with a digit too, so one press only picks the answer and says so; the same digit again sends it
    if (e.surface === 'terminal') {
      const asking = [...cards.filter(one => !one.parentId && one.ask), ...cardsOf(await read($, others)).filter(one => one.ask && !answeredHere.has(`${one.id}:${one.ask.at}`))]
      const [first] = asking
      const ask = first?.ask
      if (first && ask) {
        const answers = (ask.choices?.length ? ask.choices : DEFAULT_ANSWERS).slice(0, 9)
        const id = `${first.id}:${ask.at}`
        const picked = bandPick?.id === id ? bandPick.n : -1
        const press = (n: number, choice: string) => {
          if (picked === n) return (bandPick = undefined), void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))
          const pick = (bandPick = { id, n })
          $.ui.invalidate('ui.render')
          // Left alone, the pick is let go
          $.clock.after(BAND_PICK, () => void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))))
        }
        return (
          <Box flexDirection="column">
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', 'asking', BAND_MARK, 'Claudopus, something needs you', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{`${titleOf(first)}: `}</Text>
                  <Text color={NEEDS} bold>{cut(oneLine(ask.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {ask.copy ? <Text key="band-ask-copy" wrap="truncate-end">{`    ${oneLine(ask.copy)}`}</Text> : null}
            <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
              {answers.map((choice, n) => (
                <Button key={`band-ask-${first.id}-${ask.at}-${n}`} label={choice} plain hotkey={String(n + 1)} onPress={() => press(n, choice)} />
              ))}
              <Text dimColor={picked < 0} color={picked < 0 ? undefined : NEEDS}>
                {picked >= 0 ? `Press ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `press its number twice in the empty prompt${asking.length > 1 ? ` · ${asking.length - 1} more waiting` : ''} · /claudopus to reply in words`}
              </Text>
            </Box>
          </Box>
        )
      }
    }
    if (!working.length && !happy) return next(e)
    // A narrow terminal seats no panel until it is asked for: the band says how
    const isPanelAway = e.surface === 'terminal' && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)

    // What the work that last said something is doing, in a few whole words: the to-do it is on (a to-do is written in a few
    // words), else its title. Never cut with an ellipsis: the band is one line
    const latest = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')
    const [lead] = [...working].sort((a, b) => (latest(b)?.at ?? b.startedAt) - (latest(a)?.at ?? a.startedAt))
    const doing = lead ? lead.items.find(item => item.state === 'doing')?.text || lead.title || 'Working' : '✓ Finished'
    const more = working.length - 1

    return (
      <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
        <Box flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{oneLine(doing)}</Text>
        </Box>
        {more > 0 ? (
          <Box flexShrink={0}>
            <Text dimColor>{`· +${more} more`}</Text>
          </Box>
        ) : null}
        {isPanelAway ? (
          <Box flexShrink={0}>
            <Text dimColor>· /claudopus shows the panel</Text>
          </Box>
        ) : null}
      </Box>
    )
  })

}

// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them

// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
const backToPanel = async ($: EngineInterface, id: string) => {
  await $.ui.close({ id }).catch(() => undefined)
  await $.ui.close({ id: LIST }).catch(() => undefined)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })
}
const panelHooks = (on: On) => {

  // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
  // tab of the mod's but the panel has a first row whose key, p, closes it and hands the keys back to the panel
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    const isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(start => id.startsWith(start))
    if (e.surface !== 'terminal' || !isTab) return next(e)
    const { Box, Button, Text } = uiOf($, e)
    const body = await next({ ...e, props: { ...e.props, scroll: { ...e.props.scroll, bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) } } } as typeof e)
    return (
      <Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Panel" plain hotkey="p" onPress={() => void backToPanel($, id).catch(err => log($, `not back to the panel: ${String(err)}`))} />
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
          <Text dimColor>{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x Tab for keys'}</Text>
        </Box>
        {body}
      </Box>
    )
  })

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    const { Box, Button, Markdown, Text } = uiOf($, e)
    // A picture pressed open large in this Details tab is drawn over it, with a row back above and below it
    const large = pictureIn.get(paneId)
    if (large) {
      const back = (key: string) => <Button key={`${key}-${presses}`} label="← Back to Details" plain onPress={() => ((presses += 1), pictureBack($, paneId))} />
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {await pictureView($, e, large.path)}
          {back('pic-back-end')}
        </Box>
      )
    }
    // The list's running times move each second; a Details tab is drawn again only when its work moves
    if (paneId === LIST) await read($, tick)
    if (paneId === LIST) drawnNow = await $.clock.now()
    // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
    if (paneId === LIST && [...lateFrom.values()].includes(Infinity)) {
      const from = await $.clock.now()
      // Only while the reload is recent: a panel first opened long after shows no finish of then
      for (const [key, value] of lateFrom) if (value === Infinity) from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key)
      $.clock.after(LINGER + 20, () => void update($, tick, n => n + 1))
    }
    const { isFinishedOpen = false } = await read($, view)
    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
    const all = await read($, todos)
    const own = all.filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    const chat = await read($, me)
    const at = await $.clock.now()
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask || one.leftSince)
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of the chat always does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' }
    const glance = (one: Todo, count = '') =>
      [one.ask && one.status === 'done' ? 'Waits for your answer' : stood[one.status], modelName(one.model ?? ''), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
    // The same line on running work, whose model's name is a control: dim like the rest, underlined under the pointer. Pressed,
    // the line becomes the three models, the one it runs on ticked; a press on one moves the work to it and closes the choice
    const { picking = '' } = await read($, view)
    // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
    // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
    const lead = e.surface === 'terminal' ? 0 : 'xs'
    // On a small card the line also counts its to-dos, before the time
    const facts = (one: Todo, isWhole: boolean, count = '') => {
      const name = modelName(one.model ?? '')
      // Another chat's work is moved to another model in that chat
      if (one.status !== 'working' || !name || one.chat)
        return (
          <Box paddingLeft={isWhole ? 0 : lead}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one, count)}</Text>
          </Box>
        )
      const scope = `model-${one.id}`
      if (picking === one.id)
        return (
          <Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(model => (
              <Button
                key={`pick-${one.id}-${model}-${presses}`}
                label={`${modelName(model) === name ? '✓ ' : ''}${modelName(model)}`}
                plain
                dimColor={modelName(model) !== name}
                hover={{ scope: `${scope}-${model}`, underline: true }}
                onPress={() => ((presses += 1), void choose($, one.id, model))}
              />
            ))}
          </Box>
        )
      const rest = [one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ')
      return (
        <Box flexDirection="row" alignItems="flex-start">
          <Button
            key={`model-${one.id}-${presses}`}
            label={name}
            plain
            dimColor
            hover={{ scope, underline: true }}
            onPress={() => ((presses += 1), void update($, view, v => ({ ...v, picking: one.id })))}
          />
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{` · ${rest}`}</Text>
          </Box>
        </Box>
      )
    }
    // Where a piece of work is: the line it last wrote about itself
    const now = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')?.text ?? ''

    const table = uiOf($, e)
    // How much text two rows of a small card hold: the pane's cells less the card's bar, padding and dots. The app's letters are
    // narrower than a cell, the terminal's are one each
    const room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)))
    // How many letters one row of a small card holds, and a bold one: the card's two-row room halved
    const perRow = Math.max(24, Math.floor(room / 2))
    // Three moving dots: beside the line a small card gives, and beside the to-do being done on the big one
    // A terminal draws no picture, so there the mark is a letter
    const live = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Being done now" width={22} height={LINE} isInteractive />
        </Box>
      ) : (
        (e.surface === 'terminal' ? termDots(table, $, paneId, key) : null) ?? <Text color={LIVE}>▸</Text>
      )

    // What a piece of work needs the person's hands for now, in its colour, with the exact text to copy beside one Copy button, then
    // the same three ways to answer on every ask, on the small card as in Details: the work's own buttons, or Done and Not now when
    // it gave none, and a box for a reply in the person's own words. The list's times stand still while the person types (holdTimes)
    // In the terminal the first ask's reply box holds the keys as the panel takes them: what is typed then is the person's words,
    // never a button's letter, and Tab leaves it for the buttons and their keys
    let askFocused = false
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
      const lost = sentLine(one, at)
      return (
        <Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={NEEDS} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
          {ask.copy ? (
            <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text mono wrap="wrap">{withLinks(table.Link, ask.copy, `${key}-copy`)}</Text>
              </Box>
              <Button key={`ask-${one.id}-copy-${presses}`} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={press => copyAsk($, one.id, ask.copy ?? '', press.surface)} />
            </Box>
          ) : null}
          {/* A command to type: Terminal opens with it typed, not run, only on this press */}
          {canOpenTerminal(one) ? (
            <Box flexDirection="row">
              <Button key={`${key}-terminal-${presses}`} label={openedKey === `${one.id}:${ask.at}:${ask.copy}` ? '✓ Opened in Terminal, typed, not run' : 'Open in Terminal'} onPress={() => void openTerminal($, one).catch(err => log($, `terminal not opened: ${String(err)}`))} />
            </Box>
          ) : null}
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map((choice, n) => (
              <Button key={`${key}-choice-${n}-${presses}`} label={choice} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
            ))}
          </Box>
          {'Input' in table ? (
            <Box width="100%" flexDirection="column">
              <table.Input
                key={`${key}-reply-${replies.get(one.id) ?? 0}-${askMark(ask)}`}
                autoFocus={e.surface === 'terminal' && !askFocused ? ((askFocused = true), true) : undefined}
                placeholder="Or reply in your own words"
                value={drafts.get(one.id) ?? ''}
                submitLabel="send"
                onInput={value => void (drafts.set(one.id, value), holdTimes($))}
                onSubmit={value => void (drafts.delete(one.id), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
              />
            </Box>
          ) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>
      )
    }

    // The small card: its title, which opens its Details, with Stop at the far end of that row; where it stands and how many
    // to-dos are done; the line the work last wrote beside the three dots; its helpers. Each part has a fixed number of rows
    // and is clipped to them, so a card never changes height as the work goes
    let cardNo = 0
    let keyed = false
    const small = (one: Todo) => {
      // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
      cardNo += 1
      const digit = keyed && cardNo <= 9 ? String(cardNo) : undefined
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      const tree = treeUnder(one)
      const scope = `card-${one.id}`
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {edge(one, kept.length, done, kept.some(item => item.state === 'doing'))}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`open-${one.id}-${presses}`} plain hotkey={digit} hover={{ scope, underline: true }} onPress={() => openWork($, one.id)}>
                    <Text bold wrap="truncate-end">{titleOf(one)}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {one.status === 'working' && !one.chat ? (
                  <Box flexShrink={0}>
                    <Button key={`stop-${one.id}`} label="Stop" plain dimColor hover={{ scope: `stop-${one.id}`, underline: true }} onPress={() => void stop($, one.id)} />
                  </Box>
                ) : null}
              </Box>
              {facts(one, false, kept.length > 0 ? `${done} of ${kept.length} done` : '')}
            </Box>
            {/* Every part under the title starts at the title's own left edge (lead) */}
            {one.ask ? (
              <Box key={`ask-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {askBlock(one, `ask-${one.id}`)}
              </Box>
            ) : null}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (
              <Box key={`stuck-${one.id}`} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>
            ) : null}
            {/* Still at work, waiting for a command of its own it started in the background: which, and how long it has run */}
            {waitLine(one, at) ? (
              <Box key={`wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at)}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : undefined} dimColor={one.status !== 'done'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? 'Stopped by an error' : 'Stopped'}
                  </Text>
                ) : (
                  <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || Boolean(one.ask)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>
                )}
              </Box>
            </Box>
            {/* Finished, with something it started still running: what, how long, and a way to stop it */}
            {leftLine(one, at) && !one.chat ? (
              <Box key={`left-${one.id}`} flexDirection="column" gap={1} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{leftLine(one, at)}</Text>
                <Box flexDirection="row">
                  <Button key={`left-stop-${one.id}-${presses}`} label="Stop it" onPress={() => void stop($, one.id)} />
                </Box>
              </Box>
            ) : null}
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={`tree-${one.id}`} flexDirection="column" paddingLeft={lead}>{tree}</Box> : null}
          </Box>
        </Box>
      )
    }
    // The card's coloured edge. Purple while it works, green once it finished, amber while it needs the person's hands; work
    // stopped or stopped by an error has none. While it works the edge is also its to-dos, one part each from the top down:
    // those done bright, the one being done between, the rest a dim tint of the same purple, so the whole edge stays purple.
    // More than EDGE_PARTS to-dos are one edge filled as far as they are done. The parts are boxes that share the card's
    // height, whatever it is; a terminal has no part thinner than a row, so there the edge is whole
    const edge = (one: Todo, count: number, done: number, isDoing: boolean) => {
      if (one.status !== 'working' && one.status !== 'done') return <Box width={1} flexShrink={0} />
      if (one.ask || one.status === 'done' || !count || e.surface === 'terminal') return <Box width={1} flexShrink={0} backgroundColor={one.ask ? NEEDS : one.status === 'working' ? LIVE : DONE} />
      const shade = (n: number) => (n < done ? LIVE : n === done && isDoing ? `${LIVE}AD` : `${LIVE}5C`)
      return count > EDGE_PARTS ? (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column">
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE} /> : null}
          {count > done ? <Box key="left" flexGrow={count - done} backgroundColor={`${LIVE}5C`} /> : null}
        </Box>
      ) : (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column" gap={count > 8 ? 0.2 : 0.3}>
          {Array.from({ length: count }, (_, n) => (
            <Box key={`part-${n}`} flexGrow={1} backgroundColor={shade(n)} />
          ))}
        </Box>
      )
    }

    // ---- The helpers a piece of work started, inside its card as a tree: each one slim row joined to its parent by a line ----
    // A row is a dot at the end of its line, the helper's name, its model, context and time, and a press on the name
    // opens its own Details. The dot is purple while it works, green once it finished, red when an error stopped it, grey when it
    // was stopped; one that ended is dim, and one at work has a ring that slowly grows out of its dot and fades.
    // The lines are drawn as a card's three dots are, which the app is seen to draw
    const twigLines = (t: Twig, key: string, status?: Todo['status']) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg
            key={`${key}-svg`}
            source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')}
            alt={status ? { working: 'At work', done: 'Finished', failed: 'Stopped by an error', stopped: 'Stopped' }[status] : 'Ended'}
            width={twigWidth(t)}
            height={LINE}
            isInteractive
          />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          {status === 'working' && e.surface === 'terminal' && 'Raster' in table ? termRing(table, $, paneId, `${key}-ring`) : <Text color={status === 'working' ? LIVE : status === 'done' ? DONE : status === 'failed' ? 'error' : undefined} dimColor={!status || status === 'stopped'}>
            {status === 'working' ? '●' : status === 'done' ? '✓' : status === 'failed' ? '✕' : status === 'stopped' ? '■' : '○'}
          </Text>}
        </Box>
      )
    // One row of the tree, in the same columns whatever it says: the lines and dot, what a press opens, the time
    const twigRowOf = (t: Twig, key: string, label: string, isDim: boolean, time: string, onPress: () => void, status?: Todo['status']) => (
      <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigLines(t, `twig-lines-${key}`, status)}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Button key={`open-${key}-${presses}`} label={label} plain dimColor={isDim} hover={{ scope: `twig-${key}`, underline: true }} onPress={onPress} />
        </Box>
        {time ? (
          <Box flexShrink={0}>
            <Text dimColor>{time}</Text>
          </Box>
        ) : null}
      </Box>
    )
    const twigRow = (t: Twig, scope: string) => {
      const one = t.one
      if (!one) return null
      // Beside its name: the model it runs on, how much context it holds, and its time last, so the ticking moves nothing else.
      // A narrow panel drops the context, then the model, so the name keeps room to be read
      const time = took((one.endedAt || at) - one.startedAt)
      const model = modelName(one.model ?? '')
      const width = perRow - 4 - t.depth * 2
      // A call it has run for minutes says so in place of the model and context, so a long step does not look like a hang
      const busy = [runningLine(one, at), runningLine(one, at).replace(/^.* running · /, 'running · ')].find(text => text && width - text.length >= 12)
      const side = busy ? busy : [[model, one.tokens ? thousands(one.tokens) : '', time], [model, time], [time]].map(parts => parts.filter(Boolean).join(' · ')).find(text => width - text.length >= 12) ?? time
      return twigRowOf(t, `${scope}-${one.id}`, cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, () => openWork($, one.id), one.status)
    }
    // In a small card: the helpers at work now or just ended, and any that one of those runs under; the rest are one closing
    // row, laid out as the others, that says how many have ended and opens the card's Details, where every helper is listed
    const treeUnder = (one: Todo) => {
      const under = underOf(all, one.id)
      if (!under.length) return []
      const branches = branchesOf(all, one.id, kid => kid.status === 'working' || isLingering(kid, at))
      const twigs = twigsOf(branches, true)
      const rest = under.length - twigs.length
      if (!rest) return twigsOf(branches).map(t => twigRow(t, 'list'))
      const closing: Twig = { depth: 1, rails: [], isLast: true, hasKids: false }
      return [...twigs.map(t => twigRow(t, 'list')), twigRowOf(closing, `rest-${one.id}`, `${rest} ${rest === 1 ? 'helper' : 'helpers'} ended`, true, '', () => openWork($, one.id))]
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const flowTokens = (f: Flow) => f.agents.reduce((sum, one) => sum + (one.tokens ?? 0), 0)
    const boldRow = Math.max(20, Math.floor(perRow * 0.88))
    const agentsWord = (n: number) => `${n} ${n === 1 ? 'agent' : 'agents'}`
    // Where it stands, as Claude's own view of a workflow says it: "Workflow", how many agents it has started, its tokens and time,
    // in as many of those words as the row holds
    const flowGlance = (f: Flow, most = Infinity) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const tokens = flowTokens(f) ? `${thousands(flowTokens(f))} tokens` : ''
      const agents = agentsWord(f.agents.length)
      const head = stood[f.status] ? [stood[f.status], 'Workflow'] : ['Workflow']
      return firstFit([[...head, agents, tokens, time], [...head, agents, time], [head.at(-1) ?? 'Workflow', agents, time], ['Workflow', time]], most)
    }
    const roundsLabel = (f: Flow, rounds: Round[]) => (rounds.length ? `round ${rounds.length}${f.cap ? ` of ${f.cap}` : ''}` : f.cap ? `0 of ${f.cap} rounds` : '')
    const verdict = (r: Round) => (r.isOpen ? (r.phase ? `${doing(r.phase).toLowerCase()} now` : 'starting') : r.pass === true ? `passed${r.why ? `: ${r.why}` : ''}` : r.pass === false ? `failed: ${r.why || 'no reason given'}` : r.why || 'ended')
    // The run as small squares, one per step of each round, grouped by round, as Claude's own view of a workflow draws its agents
    const squaresRow = (f: Flow, rounds: Round[], key: string, first = 1) => {
      const groups = squaresOf(f, rounds)
      if (!groups.length) groups.push(f.phases.length ? f.phases.map(() => 'waiting' as const) : ['waiting'])
      const said = groups.map((g, i) => `round ${first + i}: ${g.join(', ')}`).join('; ')
      return 'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={squaresSvg(groups, LINE)} alt={said} width={squaresWidth(groups)} height={LINE} isInteractive />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" gap={1} flexShrink={0}>
          {groups.map((g, i) => (
            <Box key={`${key}-${i}`} flexDirection="row">
              {g.map((one, j) => (
                <Text key={`${key}-${i}-${j}`} color={one === 'done' || one === 'waiting' ? undefined : SQUARE_COLOR[one]} dimColor={one === 'done' || one === 'waiting'}>
                  {SQUARE_GLYPH[one]}
                </Text>
              ))}
            </Box>
          ))}
        </Box>
      )
    }
    // Beside the squares, in a word or two: the step being run, or how the run ended
    const stateWord = (f: Flow, rounds: Round[]) => {
      const round = rounds.at(-1)
      if (f.status === 'working') {
        const one = round ? [...round.agents].reverse().find(agent => agent.status === 'working') : undefined
        return one ? doing(one.phase || stageOf(f) || 'Working') : round ? 'Between steps' : 'Starting'
      }
      if (f.status === 'stopped') return 'Stopped'
      if (f.status === 'failed') return 'Error'
      return round?.pass === true ? 'Passed' : round?.pass === false ? 'Not passed' : 'Ended'
    }
    // The last round the checker has judged, in a few words: its verdict's mark, its number and what the checker found, or that it passed
    const outcomeRow = (f: Flow, rounds: Round[], most: number) => {
      const r = rounds.filter(one => !one.isOpen && (one.pass !== undefined || one.why)).at(-1)
      if (!r) return <Text dimColor>{fitWords(f.status === 'working' ? 'No round checked yet' : 'No round was checked', most)}</Text>
      // The round's number goes first when the row holds it; the squares above say which round it was when it does not
      const why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : 'ended')).replace(/[.。]+$/, '')
      const whole = `Round ${r.n}: ${why}`
      return (
        <Box flexDirection="row" gap={1}>
          <Text color={r.pass ? DONE : r.pass === false ? 'error' : undefined} dimColor={r.pass === undefined}>
            {r.pass ? '✓' : r.pass === false ? '✕' : '·'}
          </Text>
          <Text dimColor>{whole.length <= most - 2 ? whole : fitWords(why, most - 2)}</Text>
        </Box>
      )
    }

    // The small card, the height of every other card: its title and where it stands; the squares with the step being run beside
    // them, and the last round checked; Details, Stop and the round against the cap. Every line written to fit its row, never cut
    const flowSmall = (f: Flow) => {
      const rounds = roundsOf(f)
      const word = stateWord(f, rounds)
      const groups = squaresOf(f, rounds)
      const squaresLetters = Math.ceil(squaresWidth(groups.length ? groups : [['waiting']]) / 7.5) + 2
      return (
        <Box key={`flow-${f.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {/* Blue while it runs, green only when its last round passed */}
          {f.status === 'working' || (f.status === 'done' && rounds.at(-1)?.pass !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column" paddingLeft={lead}>
              <Box height={1} overflow="hidden">
                <Text bold>{fitWords(f.title, boldRow)}</Text>
              </Box>
              <Box height={1} overflow="hidden">
                <Text dimColor>{flowGlance(f, perRow)}</Text>
              </Box>
            </Box>
            <Box flexDirection="column" paddingLeft={lead}>
              <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                {squaresRow(f, rounds, `flow-squares-${f.id}`)}
                <Text color={f.status === 'working' ? FLOW : word === 'Passed' ? DONE : undefined} dimColor={f.status !== 'working' && word !== 'Passed'}>
                  {fitWords(word, Math.max(6, perRow - squaresLetters))}
                </Text>
              </Box>
              <Box height={1} overflow="hidden">
                {outcomeRow(f, rounds, perRow)}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={1} paddingLeft={lead}>
              <Button key={`flow-open-${f.id}-${presses}`} label="Details" onPress={() => openFlow($, f.id)} />
              {f.status === 'working' && f.session === flowMine ? <Button key={`flow-stop-${f.id}`} label="Stop" onPress={() => void stopFlow($, f.id)} /> : null}
              <Box flexGrow={1} />
              {roundsLabel(f, rounds) ? (
                <Box flexShrink={0}>
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {roundsLabel(f, rounds)}
                  </Text>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      )
    }

    // The work this Details tab is for, if it is one; a workflow's tab folds each of its agents' chats apart
    const flowOpen = flowShown ? pickedOf(flowShown) : undefined
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...all, ...elsewhere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
    // What is unfolded in this tab: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
    const open = folds.get(workId) ?? []
    const fold = (at: number) => {
      presses += 1
      const was = folds.get(workId) ?? []
      folds.set(workId, was.includes(at) ? was.filter(n => n !== at) : [...was, at])
      void update($, view, v => ({ ...v }))
    }

    // One part of the open card: a filled block of its own with a bold heading and, at its right, a dim count. The parts stand apart
    // on the pane's own ground, so where one ends and the next begins is seen at a glance
    const part = (key: string, name: string, side: string, body: JSX.Element) => (
      <Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" alignItems="flex-start" gap={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold dimColor wrap="wrap">{name}</Text>
          </Box>
          {side ? (
            <Box flexShrink={0}>
              <Text dimColor>{side}</Text>
            </Box>
          ) : null}
        </Box>
        {body}
      </Box>
    )
    // One to-do: its mark beside the first line of its text
    // Under the to-do being done, where the work says it is, in the same column as the text. The one being done is the brightest
    // line of the part; the others are dim, so it stands out without a mark of its own
    const row = (key: string, mark: JSX.Element, item: Item, under = '') => (
      <Box key={key} flexDirection="row" alignItems="flex-start" gap={1}>
        {mark}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text wrap="wrap" dimColor={item.state !== 'doing'} strikethrough={item.state === 'dropped'}>
            {item.text}
          </Text>
          {under ? <Text wrap="wrap" dimColor>{under}</Text> : null}
        </Box>
      </Box>
    )
    const opener = (at: number, label: string) => (
      <Box key={`fold-${at}`} alignItems="flex-start">
        <Button key={`fold-${at}-${presses}`} label={`${open.includes(at) ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => fold(at)} />
      </Box>
    )

    // Where it started: the person's words in two rows, whole on a press
    const askPart = (one: Todo) => {
      const whole = quoted(one.words, 1200)
      const short = cut(whole, room)
      const isLong = short !== whole
      return part(
        'part-ask',
        'Started from',
        '',
        <Box flexDirection="column">
          <Text wrap="wrap" dimColor>{`“${isLong && !open.includes(OPEN_ASK) ? short : whole}”`}</Text>
          {isLong ? opener(OPEN_ASK, open.includes(OPEN_ASK) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The to-dos: the one being done first, bright, with the dots and where the work says it is; the next few under it, dim; what
    // is done or dropped folded into one quiet count. Orange is the header's alone
    const todoPart = (one: Todo) => {
      const isWorking = one.status === 'working'
      const doing = one.items.filter(item => item.state === 'doing')
      const waiting = one.items.filter(item => item.state === 'open')
      const done = one.items.filter(item => item.state === 'done')
      const dropped = one.items.filter(item => item.state === 'dropped')
      const kept = one.items.length - dropped.length
      const where = isWorking ? now(one) : ''
      const shownNext = open.includes(OPEN_NEXT) ? waiting : waiting.slice(0, NEXT_SHOWN)
      const settled = [done.length ? `${done.length} done` : '', dropped.length ? `${dropped.length} dropped` : ''].filter(Boolean).join(' · ')
      if (!one.items.length && !where) return null
      return part(
        'part-todos',
        'To-dos',
        kept ? `${done.length} of ${kept} done` : '',
        <Box flexDirection="column" gap={1}>
          {doing.length || where ? (
            <Box key="doing" flexDirection="column">
              <Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
                {doing.length ? (
                  doing.map((item, i) => row(`doing-${i}`, isWorking ? live(`live-doing-${i}`) : <Text dimColor>○</Text>, item, i === 0 && where ? cut(where, room) : ''))
                ) : (
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {live('live-where')}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap">{cut(where, room)}</Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}
          {waiting.length ? (
            <Box key="next" flexDirection="column">
              <Text dimColor>Next</Text>
              {shownNext.map((item, i) => row(`next-${i}`, <Text dimColor>○</Text>, item))}
              {waiting.length > NEXT_SHOWN ? opener(OPEN_NEXT, open.includes(OPEN_NEXT) ? 'Fewer' : `${waiting.length - NEXT_SHOWN} more`) : null}
            </Box>
          ) : null}
          {settled ? (
            <Box key="settled" flexDirection="column">
              {opener(OPEN_DONE, settled)}
              {open.includes(OPEN_DONE)
                ? [...done, ...dropped].map((item, i) =>
                    row(`settled-${i}`, <Text color={item.state === 'done' ? 'success' : undefined} dimColor>{item.state === 'done' ? '✓' : '✕'}</Text>, item),
                  )
                : null}
            </Box>
          ) : null}
        </Box>,
      )
    }

    // In Details: every helper the work started, and theirs, at work or ended, as the same tree; each opens its own Details
    const helpersPart = (one: Todo) => {
      const under = underOf(all, one.id)
      if (!under.length) return null
      const running = under.filter(kid => kid.status === 'working').length
      return part(
        'part-helpers',
        'Helpers',
        running ? `${running} at work · ${under.length} in all` : `${under.length} in all`,
        <Box flexDirection="column">{twigsOf(branchesOf(all, one.id, () => true)).map(t => twigRow(t, 'details'))}</Box>,
      )
    }

    // The work's own chat, drawn as the app draws a chat, the oldest first: what it was told in a filled block, what it wrote as
    // text, and each run of tool steps folded into one quiet row that opens on a press. A long message to it is folded too
    const talk = (one: Todo, lines: Line[] | undefined, shots: Map<number, Pic[]>) => {
      // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
      // a row under it that opens it whole in a window of its own, large enough to look at; one that is gone is named
      const drawing = uiOf($, e)
      const picturesOfRun = (block: Line[], at: number) => {
        const made = block.flatMap(line => shots.get(line.at ?? -1) ?? [])
        if (!made.length) return null
        return (
          <Box key={`pics-${at}`} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map((pic, n) => (
              <Box key={`pic-${at}-${n}`} flexDirection="column" alignItems="flex-start" width="100%">
                {pic.thumb && e.surface !== 'terminal' && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`pic-svg-${at}-${n}`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}
                  />
                ) : null}
                {pic.isGone ? (
                  <Text dimColor wrap="wrap">{`Picture: ${pic.name} · no longer kept`}</Text>
                ) : (
                  <Button
                    key={`pic-open-${at}-${n}-${presses}`}
                    label={`⤢ ${pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                    plain
                    onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, `pic-${at}-${n}`, press.surface))}
                  />
                )}
                {e.surface === 'terminal' && !pic.isGone ? pictureSaidRow($, drawing, `pic-said-${at}-${n}`, pic.path) : null}
              </Box>
            ))}
          </Box>
        )
      }
      // Each line knows how many tool steps came before it: that names a run of steps whatever is drawn above it
      let uses = 0
      const shown = newest((lines ?? []).map(line => ({ ...line, at: line.isUse ? (uses += 1) : uses })))
      const blocks = shown.reduce<Line[][]>((all, line) => {
        const last = all.at(-1)
        return line.kind === 'step' && last?.[0]?.kind === 'step' ? [...all.slice(0, -1), [...last, line]] : [...all, [line]]
      }, [])
      return (
        <Box flexDirection="column" gap={1}>
          {lines ? null : <Text dimColor>The app has not kept the chat of this work.</Text>}
          {blocks.map((block, i) => {
            const first = block[0]
            const at = first?.at ?? 0
            if (first?.kind === 'step') {
              const isOpen = open.includes(at)
              return (
                <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start">
                  <Button key={`run-${at}-${presses}`} label={`${isOpen ? '▾' : '▸'} ${folded(block)}`} plain dimColor onPress={() => fold(at)} />
                  {isOpen
                    ? listed(block).map((line, n) => (
                        <Box key={`step-${i}-${n}`} paddingLeft={2}>
                          <Text wrap="wrap" dimColor={!line.isError} color={line.isError ? 'error' : undefined}>
                            {line.isError ? `${line.text} (failed)` : line.text}
                          </Text>
                        </Box>
                      ))
                    : null}
                  {picturesOfRun(block, at)}
                </Box>
              )
            }
            if (first?.kind === 'said')
              return (
<Markdown key={`talk-${i}`} text={first.text} />
              )
            // A move to another model is one quiet line where it happened, with its time
            if (first?.kind === 'model')
              return (
                <Box key={`talk-${i}`}>
                  <Text dimColor wrap="wrap">{first.text}</Text>
                </Box>
              )
            const text = first?.text ?? ''
            const isLong = text.length > TOLD_CHARS * 2
            const isOpen = open.includes(-at - 1)
            // The long brief the work began with is one quiet row until pressed: "Started from" above already gives the person's words
            if (i === 0 && first?.kind === 'told' && isLong && !isOpen)
              return (
                <Box key={`talk-${i}`} alignItems="flex-start">
                  <Button key={`told-${at}-${presses}`} label="▸ The brief it was given" plain dimColor onPress={() => fold(-at - 1)} />
                </Box>
              )
            return (
              <Box key={`talk-${i}`} flexDirection="column" alignItems="flex-start" backgroundColor={FILL} paddingX={2} paddingY={1}>
                {first?.kind === 'steer' ? <Text dimColor>{first.isWaiting ? 'You · not yet answered' : 'You'}</Text> : null}
                <Markdown text={isLong && !isOpen ? cut(text, TOLD_CHARS) : text} />
                {isLong ? <Button key={`told-${at}-${presses}`} label={isOpen ? '▾ Show less' : '▸ Show all'} plain dimColor onPress={() => fold(-at - 1)} /> : null}
              </Box>
            )
          })}
          {!lines && one.answer ? (
<Markdown text={one.answer} />
          ) : null}
        </Box>
      )
    }

    // Another chat's work: its own chat is in that chat's panel, which one press opens wherever the app can open that chat (a chat of
    // the app on this Mac, or one Remote Control serves); elsewhere it says where to go. Nothing of that chat is read from here
    const theirChat = (one: Todo, c: NonNullable<Todo['chat']>) => {
      const id = one.id
      const s = otherChats.find(one => one.chat === c.id && one.host === c.host)
      const canOpen = Boolean(s && pressOf(s))
      return (
        <Box flexDirection="column" gap={1}>
          <Text dimColor wrap="wrap">{`Its chat is shown in the panel of the chat "${chatName(c)}"${c.host ? ` on ${macName(c.host)}` : ''}, which runs it.${one.status === 'working' ? ' Stop it or move it to another model there.' : ''}`}</Text>
          {s && canOpen ? (
            <Box flexDirection="row">
              <Button key={`their-chat-${id}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, s))} />
            </Box>
          ) : null}
        </Box>
      )
    }

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      const parent = one.parentId ? all.find(card => card.id === one.parentId) : undefined
      return (
        <Box key={`todo-${one.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {one.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={LIVE} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{titleOf(one)}</Text>
                {facts(one, true)}
              </Box>
              {parent ? (
                <Box flexDirection="row" alignItems="flex-start">
                  <Button key={`open-parent-${one.id}-${presses}`} label={`↑ A helper of: ${cut(titleOf(parent), Math.max(20, room - 16))}`} plain dimColor hover={{ scope: `parent-${one.id}`, underline: true }} onPress={() => openWork($, parent.id)} />
                </Box>
              ) : null}
              {one.chat ? <Text dimColor wrap="wrap">{`From the chat "${chatName(one.chat)}"${chatSide(one.chat, selfName()) ? `, ${chatSide(one.chat, selfName())}` : ''}`}</Text> : null}
              {(one.status === 'working' && !one.chat) || left(one) ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
                  {left(one) ? <Button key={`artifact-${one.id}-${presses}`} label="Its result" onPress={() => void openReport($, left(one)?.id ?? '')} /> : null}
                </Box>
              ) : null}
            </Box>
          </Box>
          {one.ask ? (
            <Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {askBlock(one, `ask-big-${one.id}`, true)}
              </Box>
            </Box>
          ) : sentLine(one, at) ? (
            <Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>
          ) : null}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {one.chat
            ? part('part-chat', 'Its chat', '', theirChat(one, one.chat))
            : part('part-chat', 'Its chat', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>
      )
    }

    // The app's own prompt open in a chat, amber at the top of that chat's cards: what it asks in its own few words, the work it came
    // from, and where to answer it. A chat of the Claude app on this Mac opens at a press; the panel answers no prompt itself
    const promptCard = (p: Prompt, key: string, where: string, c?: Shared) => (
      <Box key={`prompt-${key}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
        <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
        <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
          <Box flexDirection="column">
            <Text bold wrap="truncate-end">{p.title || 'Needs your input'}</Text>
            <Text dimColor wrap="truncate-end">{where}</Text>
          </Box>
          <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
          {c ? (
            <Box flexDirection="row">
              <Button key={`prompt-open-${key}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`)))} />
            </Box>
          ) : null}
        </Box>
      </Box>
    )

    // The name of a chat above its cards, with its folder and the Mac it runs on when another. Another chat's name opens that chat in
    // the Claude app when pressed, where its link opens here
    const chatHead = (key: string, name: string, side: string, c?: Shared) => {
      const url = c ? pressOf(c) : ''
      const label = <Text bold dimColor wrap="truncate-end">{name}</Text>
      return (
        <Box key={`chat-head-${key}`} flexDirection="column" paddingTop={1} flexShrink={0}>
          {/* One line whatever the name's length: cut short, never wrapped */}
          <Box flexDirection="row" alignItems="flex-start" gap={2} paddingX={2} height={1} overflow="hidden">
            <Box flexGrow={1} flexShrink={1} minWidth={0} height={1} overflow="hidden">
              {c && url ? (
                <Button key={`chat-open-${key}`} plain hover={{ underline: true }} onPress={() => void openChat($, c)}>
                  {label}
                </Button>
              ) : (
                <Box flexShrink={1} minWidth={0} paddingLeft={lead}>{label}</Box>
              )}
            </Box>
            {side ? (
              <Box flexShrink={0}>
                <Text dimColor wrap="truncate-end">{side}</Text>
              </Box>
            ) : null}
          </Box>
        </Box>
      )
    }

    // The newest result a piece of work left, which its open card links to
    const left = (one: Todo) => kept.filter(r => r.agent === one.id).sort((a, b) => b.at - a.at)[0]

    // Work that has ended, under the running cards: one folded row (work that still asks, or still runs something, stays above), so nothing above it moves. Unfolded, the newest first, each a
    // steady row of two lines (what it was, how it ended, its model, how long it took, when) that opens its card as for running work
    // Other chats' ended work folds in here too, once its pause is over; the row then says it holds every chat's
    // Work shown finished only because it left its chat's file is not kept there: its chat said nothing of how it ended
    const endedElsewhere = elsewhere.filter(one => one.status !== 'working' && !one.ask && !lingers(one, at) && !isVanished(one.id))
    // Each other chat's cards under its name: running, asking, or in the pause after ending. A chat with none of these and no prompt
    // is not listed at all, however many are open: the app's own list of chats has them
    const shownOf = (c: Shared) => elsewhere.filter(one => one.chat?.id === c.chat && one.chat.host === c.host && (one.status === 'working' || one.ask || lingers(one, at)))
    const listedChats = otherChats.filter(c => shownOf(c).length || c.prompts?.length)
    const finished = [...own.filter(one => one.status !== 'working' && !isLingering(one, at) && !one.ask), ...endedElsewhere].sort((a, b) => b.endedAt - a.endedAt)
    const finishedPart = (isOpen: boolean) =>
      finished.length || endedFlows.length ? (
        <Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button
                key={`finished-fold-${presses}`}
                label={`${isOpen ? '▾' : '▸'} Finished ${finished.length + endedFlows.length}`}
                plain
                hotkey={keyed ? 'f' : undefined}
                onPress={() => void ((presses += 1), update($, view, v => ({ ...v, isFinishedOpen: !v.isFinishedOpen })))}
              />
            </Box>
            <Text dimColor>{endedElsewhere.length ? 'all chats' : 'this chat'}</Text>
          </Box>
          {isOpen
            ? [...finished.map(one => ({ at: one.endedAt, card: () => small(one) })), ...endedFlows.map(f => ({ at: f.endedAt, card: () => flowSmall(f) }))].sort((a, b) => b.at - a.at).map(one => one.card())
            : null}
        </Box>
      ) : null

    // A workflow's Details tab: what it is, with Stop; where it started; its stages in order; its rounds, each with its agents and
    // its outcome; one agent's chat at a time, picked from the rounds; and what it returned once it ended
    const flowBig = (f: Flow, picked: FlowAgent | undefined, lines: Line[] | undefined) => {
      const rounds = roundsOf(f)
      const current = stageOf(f)
      const agentRow = (one: FlowAgent) => {
        const isPicked = picked?.id === one.id
        const facts = [modelName(one.model ?? ''), one.tokens ? `context ${thousands(one.tokens)}` : '', one.status === 'working' ? (f.status === 'working' ? 'at work' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ')
        return (
          <Box key={`flow-agent-${one.id}`} flexDirection="row" alignItems="flex-start" gap={1} paddingLeft={2}>
            <Button
              key={`flow-pick-${one.id}-${presses}`}
              label={`${isPicked ? '▾' : '▸'} ${one.label || one.phase || 'agent'}`}
              plain
              dimColor={!isPicked}
              onPress={() => ((presses += 1), flowPicked.set(f.id, one.id), void update($, view, v => ({ ...v })))}
            />
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="wrap">{facts}</Text>
            </Box>
          </Box>
        )
      }
      return (
        <Box key={`flow-${f.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {f.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={FLOW} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{f.title}</Text>
                <Text dimColor wrap="wrap">{flowGlance(f)}</Text>
              </Box>
              <Box flexDirection="column">
                <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                  {squaresRow(f, rounds, `flow-big-squares-${f.id}`)}
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {stateWord(f, rounds)}
                  </Text>
                </Box>
              </Box>
              {f.status === 'working' && f.session === flowMine ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  <Button key={`flow-stop-${f.id}`} label="Stop" onPress={() => void stopFlow($, f.id)} />
                </Box>
              ) : null}
            </Box>
          </Box>
          {f.words || f.task ? askPart({ ...started(f.id, '', f.title, f.words || f.task, f.startedAt) }) : null}
          {part(
            'part-stages',
            'Stages',
            f.name,
            <Box flexDirection="column" gap={1}>
              {f.phases.map((p, i) => {
                const ran = f.agents.filter(one => one.phase === p.title)
                const isNow = p.title === current
                return (
                  <Box key={`flow-phase-${i}`} flexDirection="row" alignItems="flex-start" gap={1}>
                    {isNow ? <Text color={FLOW}>■</Text> : <Text dimColor>{ran.length ? '✓' : '○'}</Text>}
                    <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={isNow ? FLOW : undefined} bold={isNow} dimColor={!isNow}>
                        {p.title}
                      </Text>
                      <Text wrap="wrap" dimColor>
                        {[p.detail, modelName(p.model ?? ''), ran.length ? `${ran.length} ${ran.length === 1 ? 'agent' : 'agents'}` : ''].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                  </Box>
                )
              })}
            </Box>,
          )}
          {part(
            'part-rounds',
            'Rounds',
            roundsLabel(f, rounds),
            <Box flexDirection="column" gap={1}>
              {rounds.length ? null : <Text dimColor>{f.status === 'working' ? 'The first round is starting.' : 'No agent ran.'}</Text>}
              {rounds.map(r => (
                <Box key={`flow-round-${r.n}`} flexDirection="column">
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {squaresRow(f, [r], `flow-round-squares-${r.n}`, r.n)}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={r.isOpen ? FLOW : undefined} bold={r.isOpen} dimColor={!r.isOpen}>{`Round ${r.n}: ${verdict(r)}`}</Text>
                    </Box>
                  </Box>
                  {r.agents.map(agentRow)}
                  {r.findings.length && r.pass === false ? (
                    <Box flexDirection="column" paddingLeft={4}>
                      {r.findings.map((one, i) => (
                        <Text key={`flow-finding-${r.n}-${i}`} wrap="wrap" dimColor>{`– ${one}`}</Text>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ))}
            </Box>,
          )}
          {picked
            ? part(
                'part-chat',
                `Chat of the ${picked.label || picked.phase || 'agent'}${rounds.length > 1 ? `, round ${rounds.find(r => r.agents.some(one => one.id === picked.id))?.n ?? ''}` : ''}`,
                modelName(picked.model ?? ''),
                talk({ ...started(picked.id, '', picked.label, '', picked.at), answer: picked.result ?? '' }, lines, new Map()),
              )
            : null}
          {f.status !== 'working' && f.result ? part('part-result', 'What it returned', '', <Markdown text={f.result} />) : null}
        </Box>
      )
    }
    if (paneId.startsWith(FLOW_PANE)) {
      if (!flowShown) return <Text dimColor>This workflow is no longer kept.</Text>
      const picked = pickedOf(flowShown)
      const lines = picked ? await flowTalkOf($, flowShown, picked).catch(() => undefined) : undefined
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>
      )
    }

    // A Details tab stays, even once its work has ended, until it is closed; work no longer kept says so
    const alone = [...all, ...elsewhere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    if (alone && !alone.chat) void loadWork($, alone.id).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = uiOf($, e)
    // A terminal too narrow to dock the panel seats it above the prompt, a few rows tall
    const isInline = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    // The header says what every card under it says, every chat's: what needs the person, what runs here and in other chats, and
    // work that just finished (happy too for a workflow in its pause whose card turned green: it finished and its last round passed)
    const runningThere = elsewhere.filter(one => one.status === 'working' && !one.ask)
    const head = {
      here: working.filter(one => !one.ask).length + runningFlows.length,
      there: runningThere.length,
      chats: new Set(runningThere.map(one => `${one.chat?.host}/${one.chat?.id}`)).size,
      asks: boxes.length + own.filter(one => one.ask).length + waiting.length + elsewhere.filter(one => one.ask).length + listedChats.reduce((n, c) => n + (c.prompts?.length ?? 0), 0),
      isDone: isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(f => f.status === 'done' && isLingering(f, at) && roundsOf(f).at(-1)?.pass !== false),
    }
    const mood = headMood(head)
    // A letter for each header button, in the terminal alone, and only while the panel has no password box to type in: there the
    // letters are the person's words, never a press. An ask's reply box takes the keys itself (askFocused)
    const isKeyed = e.surface === 'terminal' && !boxes.length
    keyed = isKeyed
    const versions = alone ? { version: '', installed: '', isWaiting: false } : await versionsOf($)
    // A newer version whose changes the person has not seen: its screen covers the whole panel until it is closed, in place of the header's moment
    const screen = alone ? undefined : await updateScreen($, ui, versions.version, head.asks, e.surface)
    // A password or key box stays above it: the runner waits on it
    if (screen) return <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>{boxesPart($, ui)}{screen}</Box>
    const updated = alone || !versions.version ? undefined : await updatedPieces($, versions.version)

    return (
      <Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
          // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
          // them, which wraps onto a second row in a narrow pane rather than cutting anything off
          <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                  panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, `Claudopus, updated to ${versions.version}`, $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, something needs you', happy: 'Claudopus, work finished', working: 'Claudopus at work', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                {/* Just moved to a newer version: "Claudopus updated" in blue, then the new version, for the moment */}
                {updated ? (
                  nameLine(ui, updated)
                ) : (
                  <Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                    <Box flexShrink={0}>
                      <Text bold>Claudopus</Text>
                    </Box>
                    {versions.version ? <Text key="head-version" dimColor wrap="truncate-end">{`v${versions.version}${versions.isWaiting ? ` · v${versions.installed} installed${isRunFromAfar || isReloadRefused ? ', type /reload-plugins' : ''}` : ''}`}</Text> : null}
                  </Box>
                )}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? `This chat: ${fill(chat.tokens, chat.window)}` : 'This chat: just begun'}</Text>}
              </Box>
            </Box>
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={0}>
              {reportsButton($, ui, kept, isKeyed)}
              {statsButton($, ui, isKeyed)}
              {memoryButton($, ui, isKeyed)}
              {configButton($, ui, isKeyed)}
              {aboutButton($, ui, isKeyed)}
              {isInline && !e.props.isFocused ? <Text key="head-keys-short" dimColor>ctrl+x Tab for keys</Text> : null}
            </Box>
            {/* The terminal reaches a pane from the keys only after ctrl+x Tab, which nothing else tells; once it holds them each
                button above answers its first letter */}
            {e.surface === 'terminal' && (e.props.isFocused || !isInline) ? (
              <Text key="head-keys" dimColor wrap="wrap">
                {!e.props.isFocused ? 'ctrl+x Tab for keys' : [...own, ...elsewhere].some(one => one.ask) ? 'What you type goes in the reply box · Tab leaves it for the keys shown · Esc: back to the chat' : 'Esc: back to the chat'}
              </Text>
            ) : null}
          </Box>
        ) : null}
        {!alone ? boxesPart($, ui) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown; work that needs the person's hands comes first
              // Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (shownWork.length || shownFlows.length || waiting.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...waiting.map(p => promptCard(p, `this-${p.id}`, 'Answer it in this chat')),
              ...[...shownWork.map(one => ({ at: one.ask ? -1e15 + one.ask.at : one.startedAt, card: () => small(one) })), ...shownFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, those that wait on the person first
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).sort((a, b) => (a.ask ? -1e15 + a.ask.at : a.startedAt) - (b.ask ? -1e15 + b.ask.at : b.startedAt))
                // Open that chat whenever its link opens here: a chat of this Mac, or one of another Mac with Remote Control on
                // In a chat another Mac's app runs here, that Mac opens it
                const url = pressOf(c)
                const prompts = (c.prompts ?? []).map(p => promptCard(p, `${c.host}-${c.chat}-${p.id}`, c.host && !url ? `Answer it in that chat, on ${macName(c.host)}` : c.host ? `Answer it in that chat, which runs on ${macName(c.host)}` : 'Answer it in that chat', url ? c : undefined))
                return [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...prompts, ...cards.map(one => small(one))]
              }),
            ]}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
  })

}

// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own

const tabHooks = (on: On) => {

  // In a chat the app runs on another Mac over ssh, every press that reaches the engine is one line in the log: which button, how long
  // since the panel was last drawn, and the tabs as the engine lists them, so a press that did nothing shows whether it arrived at all
  on('ui.press', async ($, e, next) => {
    if (isRunFromAfar && e.plugin === 'claudopus') await log($, `press ${e.element} in ${e.requestId} (${e.surface}), panel drawn ${drawnNow ? (await $.clock.now()) - drawnNow : -1} ms ago; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
    const r = await next(e)
    // An answer the press gave to work that had ended starts it again from here, inside the press's own hook (sendWakes)
    if (e.plugin === 'claudopus' && (answersOnWay.size || wakes.length)) await sendWakes($, true).catch(err => log($, `answer not sent: ${String(err)}`))
    return r
  })
  // and so does a reply typed in a card's box
  on('ui.input', async ($, e, next) => {
    const r = await next(e)
    if (e.plugin !== 'claudopus' || e.kind !== 'submit') return r
    // Two replies to ended work went from the timer with no sign of why: each submit says here what it found on its way
    void log($, `reply submitted: ${answersOnWay.size} answer(s) and ${wakes.length} wake(s) on the way`)
    if (answersOnWay.size || wakes.length) await sendWakes($, true).catch(err => log($, `reply not sent: ${String(err)}`))
    return r
  })

  // The reports, in a pane of their own
  on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    const kept = await read($, reports)
    // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
    const line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)))
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportsView($, uiOf($, e), kept, await $.clock.now(), line)}
      </Box>
    )
  })

  // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
  on('ui.render', { component: 'Pane', requestId: STATS_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    void statsRead($, statsShown.scope).catch(() => undefined)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {statsView(() => $.ui.invalidate('ui.render'), uiOf($, e), await $.clock.now(), scope => void statsRead($, scope).catch(() => undefined), e.surface, e.props.bodyColumns * 7.4 - 32)}
      </Box>
    )
  })

  // About, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, async ($, e) => {
    const ui = uiOf($, e)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {configView(ui, await configShown($), configActs($), band, presses, dir)}
      </ui.Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await aboutView($, uiOf($, e), e.surface)}
      </Box>
    )
  })

  // The changelog, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CHANGELOG_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await changelogView($, uiOf($, e), e.surface)}
      </Box>
    )
  })

  // A picture opened large, in a chat the app runs on another Mac over ssh
  on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await pictureView($, e)}
      </Box>
    )
  })

  // A report opened as a pane of its own, named after it
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith('report-')) return next(e)
    const { Box, Text } = uiOf($, e)
    const kept = await read($, reports)
    const r = kept.find(one => paneOf(one) === e.requestId)
    if (!r) return <Text dimColor>This result is no longer kept.</Text>
    if (!reportText.has(r.id)) reportText.set(r.id, await readOr($, `${reportPath(r)}/report.md`))
    const at = Math.min(Math.max(0, pictureAt.get(paneOf(r)) ?? 0), Math.max(0, r.files.length - 1))
    const file = r.files[at] ?? ''
    const picture = e.surface === 'terminal' ? null : RASTER.test(file) ? await thumbOf($, thumbPath(r, file)) : /\.svg$/i.test(file) ? await svgOf($, `${reportPath(r)}/${file}`) : null
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportShown($, uiOf($, e), r, reportText.get(r.id) || 'This result has no text.', kept, await $.clock.now(), at, picture)}
      </Box>
    )
  })

}

// The hooks module's entry: the hooks of each part, in the order the engine runs them. The parts are the files beside it,
// each named for its job; build.mjs joins them into mods/claudopus/hooks/register.tsx, the one file the mod loads

export const register: Register = on => {
  chatHooks(on)
  promptHooks(on)
  workHooks(on)
  commandHooks(on)
  toolHooks(on)
  bandHooks(on)
  panelHooks(on)
  tabHooks(on)
  memoryHooks(on)
  serversTabHooks(on)
  workflowHooks(on)
}
