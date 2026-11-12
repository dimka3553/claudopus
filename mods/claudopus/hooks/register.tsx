import { atom, read, update } from 'claude-code'
import type { ElementTable, EngineInterface, McpToolResult, Register, RenderSurface, ToolCallInput, ToolCallResult, SessionMessage, ToolUseSummary } from 'claude-code'

import type { Entry, Flow, FlowAgent, Item, Link, Me, Report, Said, Server, Shared, Stream, Todo, Wait } from '../types'
import { capOf, doing, endOf, firstFit, fitWords, FLOW, FLOW_PANE, flowPaneOf, journalOf, metaOf, roundsOf, rowsOf, SQUARE_COLOR, SQUARE_GLYPH, squaresOf, squaresSvg, squaresWidth, stageOf, titleOfFlow, withJournal } from './flows'
import type { Round } from './flows'
import { CACHE_V, GAP, held, memoryHeld, parsed, READ_EVERY, reading, statsView, SUM_JQ, view as statsShown } from './stats'
import type { Cache, FileSum, Meta, MemoryPart, Run, Scope } from './stats'
import { ANSWER_KEPT, ANSWERS, answerOf, APP_ID, BEAT, BRIDGE_ID, remoteId, cardsOf, chatName, chatSide, clockOf, FETCH_EVERY, fetchedOf, isKey, isMac, keyOf, lastSaid, LAST_CHARS, LIVE_DIR, LOOK_EVERY, MACS, macName, openUrl, ordered, OUTBOX, PUSHED, pushHead, pushOf, shareable, sharedOf, signOf, STALE, trip, tripOf } from './shared'
import type { Answer } from './shared'
import { configView, editing, fillModels, modelsOf, modelsShort, parse, TEXTS } from './config'
import type { Config, ConfigShown, Models, Role } from './config'

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
// How long one message of that chat may be
const SAID_CHARS = 8000
// How much of a long message to the work is drawn before it is opened
const TOLD_CHARS = 300
// How long the line of one tool step may be
const STEP_CHARS = 160
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
const FILL = '#80808024'
// How long a line of the log may be
const NOTE_CHARS = 200
// How much of an answer the panel keeps
const ANSWER_CHARS = 30_000
// While the servers panel is open it looks again this often
const TICK = 3000
// Work that has just ended stays in its place among the running cards this long, in its ended look, before it goes to Finished
const LINGER = 2000
// Whether ended work is still in that pause at a time: a card that ended in the future, as from another clock, is not
const isLingering = (one: { status: string; endedAt: number }, at: number) => one.status !== 'working' && one.endedAt > 0 && at >= one.endedAt && at - one.endedAt < LINGER
// The moments a pause ends that a redraw is already set for, so each pause gets one
const lingerSet = new Set<string>()
// The engine's list of agents is read again this often, and the minutes move on
const FOLLOW_EVERY = 20_000
// An agent in one of these states, as the engine names them, is still working
const WORKING = ['pending', 'running', 'waiting']
// These listen on a port but serve no pages to open
const NO_PAGES = /^(postgres|redis-server|mysqld|mongod)\b/

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'Answer this message in one line and start a fresh agent for it in the same turn: Agent, subagent_type "general-purpose", the model the rule names, and a brief as the prompt (their words as they said them, what it is about in two or three lines, the folder, the subject by name with its brief and any result by path, what done looks like). A message about work already listed goes to the agent that has that work instead, with SendMessage, in their words.'
const REFUSED =
  'This chat\'s own thread does no work itself. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and a brief as the prompt.'
const NO_COPY = () =>
  `Work is never started as a copy of this chat. Start a fresh agent instead: subagent_type "general-purpose", the model named (${modelsShort(models)}), and a brief as the prompt.`
// A command that would print a password or key the keychain keeps. Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_SECRET_(?:SERVICE|ASK)\b/
const NO_READ = 'A kept key or password is never read or printed. Use it as an environment variable through the secret runner the work rules name; it hides the value from what the command prints.'
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
  '{Name} follows this work in a panel beside the chat, as a card with its to-dos. Keep it true as you work. With the `todo` tool (mcp__claudopus__todo), list each thing you set out to do, mark the one you are on as doing, tick it when it is done, and mark it dropped when the direction changes. With the `note` tool (mcp__claudopus__note), say in one short line where the work stands now, and say it again whenever that has changed. A message from {name} changes the to-dos first. These lines are shown to {name}, so speak to them as "you", in the first person, and write for someone who does not read code: the purpose, with no file names, commands or code. When a step needs {name}\'s own hands or go-ahead now (a code to paste, a box to fill, a key to press, an approval), say so at once with the `ask` tool (mcp__claudopus__ask): what to do in `text`, the exact text to copy in `copy`, buttons to answer with in `choices`, a command for {name} to type in `command`, then open a terminal for it with mcp__terminal__open_terminal_tab; clear it with empty `text` once it is done.'
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER =
  'The message sent to you just now is from {name}, in their words, sent while you work. Stop: take no other step until you have thought about it. Decide which of three it is. More for this work: add it to your to-do list. A new task of its own: do not do it; hand it back with the `note` tool, its `task` set to the ask in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the `note` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and carry on. Call it {name}\'s message, by no other name.'
// What the work is told when it has gone on after a steer without saying what it decided
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string) =>
  `The message sent to you just now is from ${sender}, not from {name}: it is not theirs. Take it as ${sender}'s and carry on.`
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
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not an ask: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words.`

const me = atom({ plugin: 'claudopus', key: 'me' } as const, { id: '', title: '', tokens: 0, isChat: false, needsContext: false, roleSent: '', isListOpened: false, window: 0 }, { shape: 'me-6' })
const todos = atom({ plugin: 'claudopus', key: 'todos' } as const, [], { shape: 'todos-3' })
const view = atom({ plugin: 'claudopus', key: 'view' } as const, { openId: '' }, { shape: 'view-5' })
const servers = atom({ plugin: 'claudopus', key: 'servers' } as const, [], { shape: 'servers-2' })
// Counts the passes that bring the screen up to date: each one redraws what reads it
const tick = atom({ plugin: 'claudopus', key: 'tick' } as const, 0, { shape: 'tick-1' })
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
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
// How long work has run, to the second: "42s", "12m 08s", "1h 04m 31s"
const took = (ms: number) => {
  const all = Math.max(0, Math.floor(ms / 1000))
  const [hrs, m, sec] = [Math.floor(all / 3600), Math.floor(all / 60) % 60, all % 60]
  const two = (n: number) => String(n).padStart(2, '0')
  return hrs ? `${hrs}h ${two(m)}m ${two(sec)}s` : m ? `${m}m ${two(sec)}s` : `${sec}s`
}
// A count of tokens as the app writes it
const thousands = (tokens: number) => `${(tokens / 1000).toFixed(tokens < 100_000 ? 1 : 0)}k`
// How full a context window is: the share when the window is known, and the tokens
const fill = (tokens: number, window: number) => (window ? `${Math.round((tokens / window) * 100)}% · ${thousands(tokens)} of ${thousands(window)}` : thousands(tokens))
// The same for a piece of work, short enough for its status line
const share = (tokens: number, window: number) => (window ? `context ${Math.round((tokens / window) * 100)}% (${thousands(tokens)})` : `context ${thousands(tokens)}`)

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
// Work that ends needs nothing more of the person's hands: its ask goes with it, unless it waits on an answer from its buttons
const ended = (one: Todo, status: Todo['status'], at: number): Todo => ({ ...one, status, endedAt: at, ask: one.ask?.choices?.length ? one.ask : undefined })
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
const resumed = (one: Todo, at: number): Todo => ({ ...one, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0 })

// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
const byEnd = (list: Todo[]) => [...list].sort((a, b) => (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0)
// The list is kept short by forgetting work that has ended, the oldest first; work under way is never forgotten
const capped = (list: Todo[]) => {
  let over = list.length - KEPT
  return over > 0 ? list.filter(one => one.status === 'working' || (over -= 1) < 0) : list
}

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

// Work the chat's own record was already looked through for
const helpersChecked = new Set<string>()
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
const sync = async ($: EngineInterface) => {
  const live = await $.agent.list().catch(() => [])
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
          ? ended(card, one.status === 'failed' ? 'failed' : one.status === 'killed' ? 'stopped' : 'done', now)
          : // A card listed from the engine alone, for work that is only held and has made no step since: its turn had ended
            card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle'
            ? ended(card, 'done', now)
          : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
            ? { ...card, parentId: '', title: card.title || oneLine(one.description) }
            : !card.title && one.description
              ? { ...card, title: oneLine(one.description) }
              : undefined
      if (next) cards.set(one.id, next)
      isChanged ||= Boolean(next)
    }
    return isChanged ? capped([...cards.values()]) : list
  })
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
  const now = await $.clock.now()
  await update($, todos, list => list.map(one => (one.id === id && one.status === 'working' ? ended(one, 'stopped', now) : one)))
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
// Whether the row that holds the open chats with nothing going on is unfolded: kept in folds.json, so every chat's panel shows it
// as the person last left it; each chat reads it again at its next look
let isQuietOpen = false
const readFolds = async ($: EngineInterface) => {
  const text = await readOr($, `${dir}/folds.json`).catch(() => '')
  const isOpen = (() => {
    try {
      return (JSON.parse(text || '{}') as { isQuietOpen?: unknown }).isQuietOpen === true
    } catch {
      return false
    }
  })()
  if (isOpen !== isQuietOpen) ((isQuietOpen = isOpen), redraw($))
}
const foldQuiet = async ($: EngineInterface) => {
  isQuietOpen = !isQuietOpen
  presses += 1
  redraw($)
  await $.fs.write(`${dir}/folds.json`, JSON.stringify({ isQuietOpen })).catch(err => log($, `fold not kept: ${String(err)}`))
}
// Brings this chat's panel in line with the last choice, once per choice. A pane opened where nothing draws it yet stays open and
// is drawn once a screen that can attaches; an open the engine refused is tried again at the next look
const followPanel = async ($: EngineInterface) => {
  if (!dir) return undefined
  await readFolds($)
  const choice = await readPanel($)
  if (!choice || seenOf(choice) === panelSeen) return choice
  const isOpen = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (choice.isOpen && !isOpen) {
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE }).catch(err => (log($, `panel not opened with the others: ${String(err)}`), undefined))
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
  await $.ui.open({ id: LIST, title: LIST_TITLE }).catch(err => log($, `panel not opened: ${String(err)}`))
}

// Keeps the list true while work runs: the engine's list, and the minutes
// Work that has ended, kept on disk for good, one file per chat (finished/<chat id>.json): the Finished list survives a
// reload and a restart of the app. Its chat is the engine's own record of the work, read again when it is opened
const finishedPath = (chatId: string) => `${dir}/finished/${chatId}.json`
let finishedSaved = ''
const saveFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  const ended = (await read($, todos)).filter(one => !one.parentId && one.status !== 'working')
  const sign = ended.map(one => [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title].join(':')).join(',')
  if (!id || !dir || !ended.length || sign === finishedSaved) return
  const old = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  const kept = [...old.filter(one => !ended.some(card => card.id === one.id)), ...ended].sort((a, b) => a.endedAt - b.endedAt).slice(-KEPT)
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
    const fresh = kept.filter(one => one.id && one.status !== 'working' && !list.some(card => card.id === one.id))
    return fresh.length ? capped(byEnd([...fresh, ...list])) : list
  })
}

const follow = async ($: EngineInterface) => {
  await sync($)
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
    await sayMine($, 'reply', answer)
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

const showFile = async ($: EngineInterface, path: string) => {
  const opened = await $.process.run(['open', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (opened.exitCode !== 0) await log($, `picture not opened: ${opened.stderr}`)
}
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
const front = async ($: EngineInterface, id: string, title: string) => {
  const shown = async () => Boolean((await $.ui.panes()).find(pane => pane.id === id)?.isShown)
  // A tab open behind another is not shown, and opening it again would leave it behind: it is closed and opened again, which
  // brings it to the front (seen in the app on a press of Results and of one result)
  const was = (await $.ui.panes()).find(pane => pane.id === id)
  if (was && !was.isShown) await $.ui.close({ id }).catch(() => undefined)
  await $.ui.open({ id, title, focus: true })
  // The pane pressed in stays in front while its press runs: once it has run, the new pane is opened again, which brings it forward
  if (!(await shown()))
    $.clock.after(150, async () => {
      if (await shown()) return
      await $.ui.close({ id }).catch(() => undefined)
      await $.ui.open({ id, title, focus: true })
      await log($, `front ${id} again: shown ${await shown()}`)
    })
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
    for (const one of rounds) await markReport($, one, { archived: isArchived ? now : undefined }).catch(err => log($, `result ${one.id} not ${isArchived ? 'archived' : 'brought back'}: ${String(err)}`))
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
    await front($, id, cut(heading || fileName(path), 30))
    redraw($)
  })().catch(err => log($, `memory file ${path} not opened: ${String(err)}`))
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
    if (!(await $.ui.panes()).some(pane => pane.id === workPaneOf(id))) folds.delete(id)
    await front($, workPaneOf(id), cut(titleOf(one), 30))
    // The pressed card's button gets a new name, so the app does not hold the list where that button was
    redraw($)
  })().catch(err => log($, `details of ${id} not opened: ${String(err)}`))
}

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
const reportsButton = ($: EngineInterface, ui: Ui, all: Report[]) => {
  const { Box, Button } = ui
  const list = all.filter(r => !r.archived)
  if (!list.length) return null
  return (
    <Box key="reports-button" flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <Button key={`reports-open-${presses}`} label={`Results ${entriesOf(list).length}`} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} />
    </Box>
  )
}

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
const statsButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="stats-button" flexShrink={0}>
    <ui.Button key={`stats-open-${presses}`} label="Stats" onPress={() => void openStats($).catch(err => log($, `stats not opened: ${String(err)}`))} />
  </ui.Box>
)

// Memory: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
const showMemory = async ($: EngineInterface) => {
  const opened = await $.process.run(['open', dir]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (opened.exitCode !== 0) await log($, `memory folder not opened: ${opened.stderr}`)
}
const memoryButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="memory-button" flexShrink={0}>
    <ui.Button key={`memory-open-${presses}`} label="Memory" onPress={() => void showMemory($).catch(err => log($, `memory folder not opened: ${String(err)}`))} />
  </ui.Box>
)

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
const aboutButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="about-button" flexShrink={0}>
    <ui.Button key={`about-open-${presses}`} label="About" onPress={() => void openAbout($).catch(err => log($, `about not opened: ${String(err)}`))} />
  </ui.Box>
)
// Config: each thing the person can set, what is in force, and a way to change it or put it back to what shipped
const CONFIG_PANE = 'config'
const CONFIG_TITLE = 'Config'
let configFailed = ''
const openConfig = async ($: EngineInterface) => {
  presses += 1
  configFailed = ''
  await front($, CONFIG_PANE, CONFIG_TITLE)
}
const configButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="config-button" flexShrink={0}>
    <ui.Button key={`config-open-${presses}`} label="Config" onPress={() => void openConfig($).catch(err => log($, `config not opened: ${String(err)}`))} />
  </ui.Box>
)
const configShown = async ($: EngineInterface): Promise<ConfigShown> => ({
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
  set: (key: Parameters<typeof setConfig>[2], value: unknown, role?: Parameters<typeof setConfig>[4]) => configAct($, 'Not saved', () => setConfig($, dir, key, value, role)),
})
const aboutView = async ($: EngineInterface, ui: Ui) => {
  const { Box, Link, Text } = ui
  const manifest = await readOr($, `${$.plugin.root}/.claude-plugin/plugin.json`)
  const version = (() => {
    try {
      return String(JSON.parse(manifest).version ?? '')
    } catch {
      return ''
    }
  })()
  const app = await (async () => (await $.session.version()).version)().catch(() => '')
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
        {octopus(ui, `about-mark-${aboutOpens}`, 'wave', HEAD_MARK, 'Claudopus waving')}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold>Claudopus</Text>
          <Text dimColor wrap="wrap">{[version ? `Version ${version}` : '', app ? `Claude Code ${app}` : ''].filter(Boolean).join(' · ') || 'A mod for Claude Code'}</Text>
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
  const row = (entry: Report[]) => {
    const r = entry[0]
    if (!r) return null
    return (
      <Box key={`entry-${r.id}`} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
        <Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} flexShrink={1} minWidth={0}>
          {/* In the column the folded rows' labels start in */}
          <Box width={1} flexShrink={0} />
          <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
            <Button key={`report-${r.id}-${presses}`} label={cut(r.title, line - 22)} plain onPress={() => openReport($, r.id)} />
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
            pictures.length > 1 ? `${at + 1} of ${pictures.length}` : '',
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
            </Box>,
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
const ART = { mark: '', working: '', workingSmall: '', happy: '', happySmall: '', wave: '' }
const ART_FILES: Record<keyof typeof ART, string> = { mark: 'mark.svg', working: 'working.svg', workingSmall: 'working-small.svg', happy: 'happy.svg', happySmall: 'happy-small.svg', wave: 'wave.svg' }
// Whether the octopus is happy at a time: work of this chat's that finished, not stopped or failed, is in its pause. A new drawing
// starts its animation, so it plays from the first finish and holds its last picture through any finish that follows in the pause
const isHappy = (cards: { parentId?: string; status: string; endedAt: number }[], at: number) =>
  cards.some(one => !one.parentId && one.status === 'done' && isLingering(one, at))
// How big the octopus is drawn in the panel's header and in the line above the prompt, in the app's pixels
const HEAD_MARK = 48
const BAND_MARK = 16
const octopus = (ui: Ui, key: string, art: keyof typeof ART, size: number, alt: string) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number; isInteractive?: boolean }) => JSX.Element }
  const { Box } = ui
  const source = ART[art]
  return source && table.Svg ? (
    <Box key={key} flexShrink={0}>
      <table.Svg key={`${key}-${art}`} source={source} alt={alt} width={size} height={size} isInteractive={art !== 'mark'} />
    </Box>
  ) : null
}

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
type Pic = { name: string; path: string; thumb: Thumb; isGone?: boolean; big?: Thumb }
// The pictures pressed to be seen large, by path, and the large copies made
const bigPics = new Set<string>()
const bigs = new Map<string, Thumb>()
// A large copy: the panel's width at most, kept under what one drawing part takes
const BIG_SIZES = ['1200', '960', '720', '540']
const BIG_CHARS = 120_000
const bigOf = async ($: EngineInterface, path: string): Promise<Thumb> => {
  const stat = await $.fs.stat(path).catch(() => undefined)
  if (!stat) return null
  const id = `${path}:${stat.mtimeMs}`
  if (bigs.has(id)) return bigs.get(id) ?? null
  let big: Thumb = null
  if (/\.svg$/i.test(path)) {
    const text = stat.size <= SVG_CHARS ? await readOr($, path) : ''
    const from = text.indexOf('<svg')
    big = from >= 0 ? { source: text.slice(from), width: 0, height: 0 } : null
  } else if (RASTER.test(path)) {
    const to = `${dir}/thumbs/${slug(path).slice(-60)}-${mark(path).replace(':', '-')}-${Math.round(stat.mtimeMs)}-big.jpg`
    await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
    for (const size of BIG_SIZES) {
      if (!(await $.fs.exists(to)) || ((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) * 1.37 > BIG_CHARS)
        await $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', path, '--out', to])
      else break
    }
    try {
      const bytes = (await $.fs.read(to, { as: 'bytes' })) as { base64: string }
      const sized = (await $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', to])).stdout
      const width = Number(/pixelWidth:\s*(\d+)/.exec(sized)?.[1] ?? 0)
      const height = Number(/pixelHeight:\s*(\d+)/.exec(sized)?.[1] ?? 0)
      if (width && height && bytes.base64.length < BIG_CHARS)
        big = { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="data:image/jpeg;base64,${bytes.base64}" width="${width}" height="${height}"/></svg>`, width, height }
    } catch {
      big = null
    }
  }
  bigs.set(id, big)
  return big
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
  for (const [path, { at, isSeen }] of order.reverse()) {
    const pic = await picOf($, path, one, isSeen, kept, canDraw && drawnCount < CHAT_THUMBS).catch(() => null)
    if (!pic) continue
    if (pic.thumb) drawnCount += 1
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
    if (!(await $.ui.panes()).some(pane => pane.id === flowPaneOf(id))) flowPicked.delete(id)
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
// chat; else, where Claudopus may not notify, macOS's plain one. `what` names it in the log
const alertPerson = async ($: EngineInterface, what: string, title: string, text: string, key: string) => {
  const sent = await $.ui.notify(text, { title, key: key.slice(0, 200) }).catch(err => ({ isSent: false as const, reason: String(err) }))
  if (sent.isSent || sent.reason === 'disabled' || sent.reason === 'refused') return void log($, `${what}: ${title} — ${sent.isSent ? `notified through ${sent.channel}` : `not notified (${sent.reason})`}`)
  // The desktop app takes no notification from a mod yet (no-surface): Claudopus.app raises it. 0 shown, 5 macOS is asking the
  // person to allow Claudopus and it is shown once they do
  const own = await $.process
    .run([`${$.plugin.root}/bin/notify`, '--title', title, '--text', text, ...(await clickOf($)), '--key', key.slice(0, 200)])
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
  if (own.exitCode === 0 || own.exitCode === 5) return void log($, `${what}: ${title} — app said ${sent.reason}; ${own.exitCode === 0 ? 'notified through Claudopus' : 'macOS asked to allow Claudopus'}`)
  // Claudopus notifications turned off in System Settings, or it failed: macOS's plain notification. Elsewhere osascript is
  // missing and nothing is shown
  const mac = await $.process
    .run(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', title, text])
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
  void log($, `${what}: ${title} — app said ${sent.reason}; Claudopus said ${own.exitCode}; ${mac.exitCode === 0 ? 'notified through macOS' : `macOS notification failed: ${mac.stderr.slice(0, 120)}`}`)
}

// Work that needs the person's hands says so at once: the panel comes up with its card standing out, a chime unless config.json
// turned sound off, and a notification unless it turned those off
const askAloud = async ($: EngineInterface, one: Todo, text: string) => {
  let config: { sound?: unknown; notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves both on
  }
  if (config.sound !== false) void $.audio.play({ asset: READY_SOUND }).catch(err => log($, `ask sound not played: ${String(err)}`))
  if (config.notifications !== false) await alertPerson($, 'ask', `${titleOf(one)} needs you`, text, `ask-${one.id}`)
}

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

// The person's answer to an ask's buttons: to work under way, a message it reads at its next step; to work that has ended, a
// message to the chat, which carries the work on. Either way the ask goes, and the answer is kept on the card as the person's
// A reply in the person's own words goes the same way, and leaves the ask in place for the work to clear or ask again: a question
// back ("where do I do that?") does not answer it
const replies = new Map<string, number>()
// What the person has typed into a reply box and not sent, by the work, so a redraw keeps it
const drafts = new Map<string, string>()
// The last reply sent from each work's box, shown under it while the same ask stands: sent to the work (which reads a message
// only at its next step, so it says so until that step starts), read by it, or sent to the chat when the work had ended
type Sent = { text: string; ask: string; to: 'work' | 'read' | 'chat' | 'other' | 'lost' }
const sentReplies = new Map<string, Sent>()
// A reply on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
const pending = new Map<string, string>()
const answerAsk = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  if (one.chat) return answerElsewhere($, one, choice, isReply)
  const ask = one.ask
  const said = choice.trim()
  if (!ask || !said) return
  const target = ask.from ?? one.id
  // The box clears and says it is sent before anything is written: nothing the panel does is waited on
  if (isReply) {
    replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: one.status === 'working' ? 'work' : 'chat' })
    redraw($)
  }
  const at = await $.clock.now()
  await update($, todos, list =>
    list.map(card => (card.id === one.id ? { ...card, ask: isReply ? card.ask : undefined, entries: [...card.entries, { at, kind: 'steer' as const, text: isReply ? said : `${said} — to: ${ask.text}` }].slice(-ENTRIES_KEPT) } : card)),
  )
  redraw($)
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your ask ("${ask.text}"): ${said}` : `${who(true)} pressed "${said}" in answer to your ask: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (isReply && (pending.set(target, one.id), sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work' }), redraw($)))
  if (isReply) (sentReplies.set(one.id, { text: said, ask: ask.text, to: 'chat' }), redraw($))
  await sendForPerson($, isReply ? `From the Claudopus panel: ${who(true)} replied to what the work "${titleOf(one)}" asked before it ended (${ask.text}):\n${said}` : `From the Claudopus panel: ${who(true)} pressed "${said}" in answer to what the work "${titleOf(one)}" asked before it ended: ${ask.text}`)
}
// The work a reply was written into starts its next step: that step reads it
const replyRead = ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  if (sent?.to === 'work') (sentReplies.set(card, { ...sent, to: 'read' }), redraw($))
}
// Work whose run ended with a reply written in but never read leaves it to the chat, which carries the work on
const replyUnread = async ($: EngineInterface, agentId: string) => {
  const card = pending.get(agentId)
  if (card === undefined) return
  pending.delete(agentId)
  const sent = sentReplies.get(card)
  const one = (await read($, todos)).find(todo => todo.id === card)
  if (sent?.to !== 'work' || !one) return
  sentReplies.set(card, { ...sent, to: 'chat' })
  redraw($)
  await sendForPerson($, `From the Claudopus panel: ${who(true)} replied to what the work "${titleOf(one)}" asked, and it ended before reading the reply (${sent.ask}):\n${sent.text}`)
}
// What the box says of the reply last sent from it, while the ask it answered stands
const sentLine = (one: Todo) => {
  const sent = sentReplies.get(one.id)
  if (!sent || sent.ask !== one.ask?.text) return ''
  const how = {
    work: 'the work reads it at its next step, once what it is doing now ends',
    read: 'read by the work',
    chat: 'sent to the chat, which carries the work on',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose work reads it at its next step`,
    lost: 'not sent: that Mac could not be reached. Answer it in its own chat',
  }[sent.to]
  return `✓ Sent: “${cut(sent.text, 80)}” · ${how}`
}

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
// What was last said in this chat, which the panels show as the pointer rests on its name: kept as the person writes and Claude
// answers, and read back from its saved words as it loads
let mySaid: Said | undefined
const sayMine = async ($: EngineInterface, part: 'you' | 'reply', text: string) => {
  const said = text.trim().slice(0, LAST_CHARS[part])
  if (!said) return
  const at = await $.clock.now()
  const was = mySaid ?? { you: '', youAt: 0, reply: '', replyAt: 0 }
  mySaid = part === 'you' ? { ...was, you: said, youAt: at } : { ...was, reply: said, replyAt: at }
}
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
  const sign = `${title}\n${JSON.stringify([mySaid ?? null, myLink ?? null])}\n${signOf(cards)}`
  if (sign === sharedSign && now - sharedAt < BEAT) return
  const s: Shared = { chat: id, title, folder: cwd, host: '', at: now, cards, ...(mySaid ? { said: mySaid } : {}), ...(myLink ? { link: myLink } : {}) }
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

// The other Macs config.json names under `macs`, as ssh reaches them; none for a person with one Mac. Each is known by the name
// config.json gives it, and shown by the first part of its host name
let macs: string[] = []
const macPath = (mac: string) => `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.json`
const ssh = (mac: string, command: string) => ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=5', '--', mac, command]
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

// The Macs that handed this one their chats lately, by the name each gave, and what the freshest called this Mac: its name here once
// other Macs' chats are listed beside its own
const pushedFrom = new Set<string>()
let pushedYou = ''
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
// The files of other chats, as last read, by name: a file is read again only when it changed
const liveRead = new Map<string, { key: string; text: string }>()
const readOthers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const now = await $.clock.now()
  const wasSelf = `${isMulti()}:${selfName()}`
  // What other Macs handed this one: a copy not handed again for STALE (that Mac asleep or its chats closed) says nothing now
  const pushed: Shared[] = []
  // Gathered apart and put in place at the end, so what this Mac knows of them holds while they are read
  const from = new Set<string>()
  let you = ''
  let youAt = 0
  for (const entry of (await $.fs.list(`${liveDir()}/${PUSHED}`).catch(() => [])).filter(one => one.kind === 'file' && one.name.endsWith('.json'))) {
    const at = entry.mtimeMs || now
    if (now - at > STALE) continue
    const text = await readOr($, `${liveDir()}/${PUSHED}/${entry.name}`)
    const head = pushHead(text)
    if (!head || `${head.from}.json` !== entry.name) continue
    from.add(head.from)
    if (head.you && at >= youAt) (you = head.you, (youAt = at))
    pushed.push(...fetchedOf(text, head.from, at))
  }
  pushedFrom.clear()
  for (const one of from) pushedFrom.add(one)
  pushedYou = you
  if (macs.length) await knowLocalName($)
  const found: Shared[] = []
  // The chats open on this Mac, work or none
  const here = new Set<string>([id])
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== `${id}.json`)
  for (const name of [...liveRead.keys()]) if (!listed.some(entry => entry.name === name)) liveRead.delete(name)
  for (const entry of listed) {
    // A file not written for longer than STALE is a chat gone silent: not read at all
    if (entry.mtimeMs && now - entry.mtimeMs > STALE) continue
    const key = `${entry.mtimeMs}:${entry.size}`
    const was = liveRead.get(entry.name)
    const text = was && entry.mtimeMs && was.key === key ? was.text : await readOr($, `${liveDir()}/${entry.name}`)
    const one = sharedOf(text, now, '', true)
    // A file caught half-written is read again at the next look, not kept as read
    if (one) liveRead.set(entry.name, { key, text })
    else liveRead.delete(entry.name)
    if (one) here.add(one.chat)
    // A chat of this Mac with no work is listed only beside other Macs' chats, so every Mac's panel lists the same open chats
    if (one && one.chat !== id && (one.cards.length || isMulti())) found.push(one)
  }
  for (const mac of macs) {
    const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
    // A copy not fetched again for STALE says nothing of that Mac now
    if (!f.text || now - (f.fetchedAt ?? 0) > STALE) continue
    // A Mac named that is this one shows its chats once, as this Mac's
    for (const one of fetchedOf(f.text, mac, f.fetchedAt)) if (!here.has(one.chat)) (here.add(one.chat), found.push(one))
  }
  // A chat both fetched and handed over, as when two Macs each name the other, is listed once, as fetched
  for (const one of pushed) if (!here.has(one.chat)) (here.add(one.chat), found.push(one))
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
  const next = ordered(found)
  if (JSON.stringify(next) !== JSON.stringify(await read($, others))) await update($, others, () => next)
  else if (`${isMulti()}:${selfName()}` !== wasSelf) redraw($)
}

// A press on another chat's name: that chat in the Claude app, as a notification's click opens this one. Nothing else is run
const openChat = async ($: EngineInterface, c: Shared) => {
  const url = openUrl(c)
  if (!url) return
  const r = await $.process.run(['open', url]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  await log($, `chat ${c.chat}${c.host ? ` on ${c.host}` : ''} ${r.exitCode === 0 ? `opened: ${url}` : `not opened: ${r.stderr.trim().slice(0, 160)}`}`)
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
  if (isReply) replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  else answeredHere.add(`${one.id}:${ask.at}`)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'other' })
  redraw($)
  const at = await $.clock.now()
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
    answeredHere.delete(`${one.id}:${ask.at}`)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'lost' })
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
    if (!answer || !card?.ask || now - answer.at > ANSWER_KEPT || (!answer.isReply && !isSame)) {
      await log($, `answer from another chat dropped: ${!answer ? 'unreadable' : now - answer.at > ANSWER_KEPT ? 'it waited too long' : `its ask is gone from ${answer.card}`}`)
      continue
    }
    await answerAsk($, card, answer.choice, answer.isReply)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    const begun = await next(e)
    const home = (await $.env.get('HOME')) ?? ''
    dir = `${home}/.claude/claudopus`
    for (const [art, file] of Object.entries(ART_FILES) as [keyof typeof ART, string][]) {
      const text = await readOr($, `${$.plugin.root}/art/${file}`)
      ART[art] = text.slice(Math.max(0, text.indexOf('<svg')))
    }
    cwd = e.cwd
    await loadSettings($)

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id ? m.needsContext : true }))

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
        "For background work: when a step needs {name}'s own hands now (a code to paste, a box to fill, a key or a button to press), says so on your card, which stands out at the top of the panel with the ask in view and a Copy button for the exact text, and tells {name}. `text` says what to do, in one plain line; `copy` is only for text {name} must paste somewhere else (a one-time code, a token name, a link to open), never the instructions themselves; `choices` are buttons {name} answers with, such as Approve and Not now, for a go-ahead you need; `command` is a command {name} types themselves: the answer tells you to open a terminal for it with the terminal tools. The answer pressed arrives as a message at your next step; carry on meanwhile with what does not depend on it, or end saying what you wait for, and the answer comes back through the chat. Call it again with empty `text` once it is done; without choices it also goes when you finish.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          copy: { type: 'string', description: 'Only text they must paste somewhere else, such as a one-time code or a link; leave it out when they only read or press something' },
          choices: { type: 'array', items: { type: 'string' }, description: 'Answers to press, such as Approve and Not now; the one pressed comes back to you as a message' },
          command: { type: 'string', description: 'A command for them to type themselves, one line, shown with a Copy button; then open a terminal for it with mcp__terminal__open_terminal_tab' },
          cwd: { type: 'string', description: 'The folder the command runs in, a full path; the chat\'s folder when left out' },
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
      await $.ui.open({ id: LIST, title: LIST_TITLE }).catch(err => log($, `panel not opened again: ${String(err)}`))
    // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
    // open in every chat from now on
    if (!choice && (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)) await choosePanel($, true)
    $.clock.every(PANEL_EVERY, () => followPanel($).catch(err => log($, `panel not followed: ${String(err)}`)))
    $.clock.every(FOLLOW_EVERY, () => follow($).catch(err => log($, `work not followed: ${String(err)}`)))
    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
    lingerSet.clear()
    let seconds = 0
    $.clock.every(1000, async () => {
      await shareMine($).catch(err => log($, `work not shared: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      if (isFlowing || (await read($, todos)).some(one => !one.parentId && one.status === 'working') || (await read($, others)).some(c => c.cards.length)) await update($, tick, n => n + 1)
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)].filter(card => isLingering(card, now))) {
        const key = `${one.id}:${one.endedAt}`
        if (lingerSet.has(key)) continue
        lingerSet.add(key)
        $.clock.after(one.endedAt + LINGER - now + 20, () => void ((lingerSet.delete(key), update($, tick, n => n + 1))))
      }
    })
    $.clock.every(TICK, () => refresh($).catch(err => log($, `servers not looked at again: ${String(err)}`)))
    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
    sharedSign = ''
    isEnded = false
    linkReadAt = 0
    mySaid = lastSaid(await readOr($, `${dir}/words/${id}.md`).catch(() => ''))
    await unshare($, true).catch(() => undefined)
    if (macs.length) $.clock.every(FETCH_EVERY, () => fetchMacs($).catch(err => log($, `other Macs not fetched: ${String(err)}`)))
    await shareMine($).catch(() => undefined)
    await readAnswers($).catch(() => undefined)
    await readOthers($).catch(() => undefined)
    // The workflows kept, read back, and followed while they run
    await knowSession($)
    await loadFlows($).catch(err => log($, `workflows not read back: ${String(err)}`))
    $.clock.every(FLOW_EVERY, () => followFlows($).catch(err => log($, `workflows not followed: ${String(err)}`)))
    await log($, `start ${id} in ${e.cwd}${isOff ? ' (handing over is off)' : ''}`)

    return begun
  })

  // A chat that ends removes its file, so the other panels drop its work at once
  on('session.end', async ($, e, next) => {
    isEnded = true
    await unshare($).catch(() => undefined)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
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
    await sayMine($, 'you', text)
    // A message that names a report starts work from it: that work's own report is kept linked to it
    fromReport = (await read($, reports)).find(r => text.includes(`${reportPath(r)}/`) || text.includes(`reports/${r.id}`))?.id ?? ''
    const how = `${e.turnId ? ' (sent while Claude was working)' : ''}${e.origin.kind === 'bridge' ? ' (from the phone)' : ''}${isPressed ? ' (pressed or replied in the panel)' : ''}`
    await appendWords($, m.id, `## ${new Date().toISOString()}${how}\n${text}\n\n`).catch(err => log($, `message not saved: ${String(err)}`))

    return next(context.length ? { ...e, text, context } : { ...e, text })
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (!dir) return done
    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
    // One that only waits for its helpers goes on working
    if (e.agentId !== undefined) {
      const id = e.agentId
      const now = await $.clock.now()
      const answer = (e.answer ?? '').trim().slice(0, ANSWER_CHARS)
      const isHeld = (await $.agent.list().catch(() => [])).some(one => one.id === id && one.status === 'waiting')
      const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
      await update($, todos, list => {
        const isWaiting = how === 'done' && (isHeld || list.some(one => one.parentId === id && one.status === 'working'))
        return list.map(one => (one.id !== id ? one : isWaiting ? { ...one, answer: answer || one.answer } : { ...ended(one, how, now), answer: answer || one.answer }))
      })
      await lookEnds($)
      // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
      if ((await read($, todos)).find(one => one.id === id)?.status !== 'working') await replyUnread($, id).catch(err => log($, `reply not passed on: ${String(err)}`))
      // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report
      const card = (await read($, todos)).find(one => one.id === id)
      const report = (e.answer ?? '').trim()
      if (card && !card.parentId && card.status === 'done' && report) {
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
  // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice
  on('prompt.context', async ($, e, next) => {
    const r = await next(e)
    const files = r.instructionFiles ?? e.instructionFiles
    // The person's own copy in the memory folder when there is one, the shipped principles otherwise
    const { path, text: content } = await inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')
    if (!files || !content.trim()) return r
    const others = files.filter(one => one.content.trim() !== content.trim())
    const at = others.findIndex(one => one.kind !== 'managed')
    const ours = { path, kind: 'user' as const, content }

    return { ...r, instructionFiles: at < 0 ? [...others, ours] : [...others.slice(0, at), ours, ...others.slice(at)] }
  })

  on('tool.describe', async (_, e, next) => {
    const r = await next(e)
    const isRare = RARE_TOOLS.includes(e.tool) || RARE_SERVERS.some(prefix => e.tool.startsWith(prefix))

    return isRare ? { ...r, isDeferred: true } : r
  })

  // A chat's own thread starts agents and talks to them; the work runs in the agents, which carry an agent id
  on('tool.call', async ($, e, run) => {
    if (e.tool === 'Bash' && KEYCHAIN_READ.test(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that reads the keychain')
      return { deny: NO_READ }
    }
    const next = async (call: typeof e) => hideKept($, call, await run(call))
    // A message of the person's that the chat's own thread passes on to work under way is a steer: that work is told so, and owes
    // a line saying what it decided. It is kept by the card in their words. Any other message to work under way, a helper's reply,
    // one between pieces of work or the chat's own note, is told as its sender's
    let steered = ''
    let from = ''
    if (dir && e.tool === 'SendMessage') {
      const to = String((e as { to?: unknown }).to ?? '')
      const message = String((e as { message?: unknown }).message ?? '')
      const theirs = e.agentId === undefined ? heard.findLast(one => carries(message, one)) : undefined
      const words = theirs ? quoted(theirs, 600) : ''
      const now = await $.clock.now()
      const list = await read($, todos)
      const target = to ? (list.find(one => one.id === to) ?? list.find(one => to.startsWith(one.id))) : undefined
      if (target) {
        const isSteer = target.status === 'working' && Boolean(words)
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
        if (isSteer || from) steered = target.id
      }
    }
    if (e.agentId !== undefined) {
      const id = e.agentId
      // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
      if (e.tool === 'Agent') helperCalls.set(e.tool_use_id, id)
      // Work that calls a tool is working: a card that had ended is back. Its steps are counted: to place a steer among them,
      // to see that a steer got its decision, and to see that its to-dos are still being kept
      if (dir) {
        const now = await $.clock.now()
        const isKeeping = isTool(e.tool, 'todo') || isTool(e.tool, 'note')
        let nudge = ''
        await update($, todos, list =>
          list.map(one => {
            if (one.id !== id) return one
            const base = { ...(one.status === 'working' ? one : resumed(one, now)), steps: (one.steps ?? 0) + 1 }
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
      if (!sent.deny) void tell($, steered, named(from ? FROM(from) : STEER))
      return sent
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
    if (OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return next(e)
    // The chat reads a kept report itself, to answer from it
    const readPath = String((e as { file_path?: unknown }).file_path ?? '')
    if (e.tool === 'Read' && readPath.startsWith(`${reportsDir()}/`) && !readPath.split('/').includes('..')) return next(e)
    await log($, `refused ${e.tool} in a chat's own thread`)

    return { deny: REFUSED }
  })

  // How full this chat's context is, as the app counts it, each time it moves
  on('session.measure', async ($, e, next) => {
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
    const chosen = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id)?.chosen : undefined
    const r = yield* next(chosen && modelName(chosen) !== modelName(e.model) ? { ...e, model: chosen } : e)
    const tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0
    const model = (r.usage as { model?: string } | undefined)?.model
    if (id !== undefined && tokens && flowAgents.has(id)) await flowStep($, id, tokens, model).catch(() => undefined)
    if (id !== undefined && tokens && dir) await update($, todos, list => list.map(one => (one.id === id ? { ...one, tokens, model: one.chosen ?? (modelName(model ?? '') ? model : one.model) } : one)))

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
    const work = isTold ? named(fillModels((await inForce($, $.plugin.root, dir, 'roles/work.md')).text, models)).replace(/\{admin\}/g, `${$.plugin.root}/bin/admin`).replace(/\{secret\}/g, `${$.plugin.root}/bin/secret`).trim() : ''
    const words = isTold ? `- The chat's saved words, ${who()}'s messages word for word: ${dir}/words/${(await read($, me)).id}.md` : ''
    const r = await next(isTold ? { ...e, prompt: `${e.prompt}\n\n${workHead()}\n${words}\n${work}\n\n${named(PANEL_RULE)}` } : e)
    if (!dir || !r.agentId) return r
    const id = r.agentId
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

  on('command.run', { command: 'claudopus' }, async $ => {
    await update($, me, one => ({ ...one, isListOpened: true }))
    await update($, paneShown, () => true)
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE })
    // Asked for where it can be drawn, it is open in every chat from now on
    if (opened.isPlaced) await choosePanel($, true)

    return { text: opened.isPlaced ? 'Claudopus panel opened.' : nowhere('Claudopus') }
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

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until it is cleared or the work ends
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown }
    if (e.agentId === undefined) return { result: `Only background work asks through the panel; a chat's own thread asks ${who()} in its reply.` }
    const text = oneLine(typeof input.text === 'string' ? input.text : '').slice(0, 300)
    const command = oneLine(typeof input.command === 'string' ? input.command : '').slice(0, 1000)
    // Copy is for text pasted elsewhere: a sentence of instructions, or the ask's own words, gets none
    const given = (typeof input.copy === 'string' ? input.copy : '').trim().slice(0, 4000)
    const isProse = given.split(/\s+/).length > 8 && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(given) && !/[\/=_$`@]|https?:/.test(given)
    const copy = command || (isProse || flat(text).includes(flat(given)) ? '' : given)
    const folder = typeof input.cwd === 'string' && input.cwd.startsWith('/') ? input.cwd : cwd
    const choices = [...new Set((Array.isArray(input.choices) ? input.choices : []).filter((one): one is string => typeof one === 'string').map(one => oneLine(one).slice(0, 40)).filter(Boolean))].slice(0, 4)
    const at = await $.clock.now()
    const before = await read($, todos)
    const was = before.find(one => one.id === topOf(before, e.agentId ?? ''))?.ask
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices, from: e.agentId } : {}), at } : undefined }))
    if (!text) return { result: 'Cleared: your card no longer asks for anything.' }
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, e.agentId ?? ''))
    // The same ask said again is not told again
    if (card && was?.text !== text) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
    // A command for the person gets a terminal at once, so they type it there without looking for one. The app runs its terminal
    // tools only for Claude, never for a plugin's own code, so the work opens it
    const terminal = command ? ` Now open a terminal for it yourself, at once: mcp__terminal__open_terminal_tab with cwd "${folder}" and a short title; never type or run the command in it.` : ''
    const shown = [command ? 'the command with a Copy button' : copy ? 'a Copy button for the text' : '', choices.length ? `the buttons ${choices.join(', ')}; the one pressed comes back to you as a message` : ''].filter(Boolean).join(' and ') || 'nothing to copy or press'
    return { result: `Shown on your card with ${shown}, and ${who()} was told. Clear it with empty text once it is done.${terminal}` }
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

  // Above the prompt, while work runs: a small mark that it does, and nothing of what it is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const cards = await read($, todos)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    if (!working.length && !happy) return next(e)

    const ui = $.ui.resolve(e)
    const { Box, Text } = ui

    // What the work that last said something is doing, in a few whole words: the to-do it is on (a to-do is written in a few
    // words), else its title. Never cut with an ellipsis: the band is one line
    const latest = (one: Todo) => [...one.entries].reverse().find(entry => entry.kind !== 'steer')
    const [lead] = [...working].sort((a, b) => (latest(b)?.at ?? b.startedAt) - (latest(a)?.at ?? a.startedAt))
    const doing = lead ? lead.items.find(item => item.state === 'doing')?.text || lead.title || 'Working' : '✓ Finished'
    const others = working.length - 1

    return (
      <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work') ?? <Text dimColor>•••</Text>}
        <Box flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{oneLine(doing)}</Text>
        </Box>
        {others > 0 ? (
          <Box flexShrink={0}>
            <Text dimColor>{`· +${others} more`}</Text>
          </Box>
        ) : null}
      </Box>
    )
  })

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    const { Box, Button, Markdown, Text } = $.ui.resolve(e)
    // The list's running times move each second; a Details tab is drawn again only when its work moves
    if (paneId === LIST) await read($, tick)
    const { isFinishedOpen = false } = await read($, view)
    const own = (await read($, todos)).filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    const chat = await read($, me)
    const at = await $.clock.now()
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask)
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of the chat always does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' }
    const glance = (one: Todo) =>
      [stood[one.status], modelName(one.model ?? ''), one.tokens ? share(one.tokens, windowOf(one)) : '', took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
    // The same line on running work, whose model's name is a control: dim like the rest, underlined under the pointer. Pressed,
    // the line becomes the three models, the one it runs on ticked; a press on one moves the work to it and closes the choice
    const { picking = '' } = await read($, view)
    const facts = (one: Todo, isWhole: boolean) => {
      const name = modelName(one.model ?? '')
      // Another chat's work is moved to another model in that chat
      if (one.status !== 'working' || !name || one.chat) return <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one)}</Text>
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
      const rest = [one.tokens ? share(one.tokens, windowOf(one)) : '', took(at - one.startedAt)].filter(Boolean).join(' · ')
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

    const table = $.ui.resolve(e)
    // How much text two rows of a small card hold: the pane's cells less the card's bar, padding and dots. The app's letters are
    // narrower than a cell, the terminal's are one each
    const room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)))
    // Three moving dots: beside the line a small card gives, and beside the to-do being done on the big one
    const live = (key: string) =>
      'Svg' in table ? (
        <Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Being done now" width={22} height={LINE} isInteractive />
        </Box>
      ) : (
        <Text color={LIVE}>▸</Text>
      )

    // What a piece of work needs the person's hands for now, in its colour, with the exact text to copy beside one Copy button
    // On the small card: what to do, the text to paste with its Copy on a filled row of its own, then one row of answers ending in
    // Reply, which opens its Details. The reply box is in Details alone: the list redraws each second, and a text box there lost its
    // place and threw the panel to the bottom while the person typed
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      const answers = ask.choices ?? []
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
          {isWhole && 'Input' in table ? (
            <Box width="100%" flexDirection="column">
            <table.Input
              key={`${key}-reply-${replies.get(one.id) ?? 0}`}
              placeholder="Reply in your own words"
              value={drafts.get(one.id) ?? ''}
              submitLabel="send"
              onInput={value => void drafts.set(one.id, value)}
              onSubmit={value => void (drafts.delete(one.id), answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)))}
            />
            </Box>
          ) : null}
          {/* The reply last sent, on the card and under the box: that it went, and whether the work has read it yet */}
          {sentLine(one) ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{sentLine(one)}</Text> : null}
          {answers.length || !isWhole ? (
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              {answers.map((choice, n) => (
                <Button key={`${key}-choice-${n}-${presses}`} label={choice} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
              ))}
              {isWhole ? null : <Button key={`${key}-reply-open-${presses}`} label="Reply…" plain dimColor onPress={() => openWork($, one.id)} />}
            </Box>
          ) : null}
        </Box>
      )
    }

    // The small card: a title, where it stands, the line the work last wrote beside the three dots, and how many to-dos are done.
    // Each part has a fixed number of rows and is clipped to them, so a card never changes height as the work goes
    const small = (one: Todo) => {
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {/* Purple while it works, green once it finished; work stopped or stopped by an error has no mark */}
          {/* Amber while it needs the person's hands */}
          {one.status === 'working' || one.status === 'done' ? <Box width={1} flexShrink={0} backgroundColor={one.ask ? NEEDS : one.status === 'working' ? LIVE : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Text bold wrap="truncate-end">{titleOf(one)}</Text>
              {facts(one, false)}
            </Box>
            {one.ask ? askBlock(one, `ask-${one.id}`) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden">
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {lingers(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : undefined} dimColor={one.status !== 'done'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? 'Stopped by an error' : 'Stopped'}
                  </Text>
                ) : (
                  <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || Boolean(one.ask)}>{cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>
                )}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Button key={`open-${one.id}-${presses}`} label="Details" onPress={() => openWork($, one.id)} />
              {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
              <Box flexGrow={1} />
              {kept.length > 0 ? (
                <Box flexShrink={0}>
                  <Text dimColor>{`${done} of ${kept.length} done`}</Text>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      )
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const flowTokens = (f: Flow) => f.agents.reduce((sum, one) => sum + (one.tokens ?? 0), 0)
    // How many letters one row of a small card holds, and a bold one: the card's two-row room halved
    const perRow = Math.max(24, Math.floor(room / 2))
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
            <Box flexDirection="column">
              <Box height={1} overflow="hidden">
                <Text bold>{fitWords(f.title, boldRow)}</Text>
              </Box>
              <Box height={1} overflow="hidden">
                <Text dimColor>{flowGlance(f, perRow)}</Text>
              </Box>
            </Box>
            <Box flexDirection="column">
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
            <Box flexDirection="row" alignItems="center" gap={1}>
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
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...own, ...elsewhere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
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

    // The work's own chat, drawn as the app draws a chat, the oldest first: what it was told in a filled block, what it wrote as
    // text, and each run of tool steps folded into one quiet row that opens on a press. A long message to it is folded too
    const talk = (one: Todo, lines: Line[] | undefined, shots: Map<number, Pic[]>) => {
      // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
      // a row under it that shows it large in place, with where it is; one that is gone is named. Nothing leaves the app
      const isBig = (pic: Pic) => bigPics.has(pic.path)
      const drawing = $.ui.resolve(e)
      const picturesOfRun = (block: Line[], at: number) => {
        const made = block.flatMap(line => shots.get(line.at ?? -1) ?? [])
        if (!made.length) return null
        return (
          <Box key={`pics-${at}`} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map((pic, n) => (
              <Box key={`pic-${at}-${n}`} flexDirection="column" alignItems="flex-start" width="100%">
                {isBig(pic) && pic.big && 'Svg' in drawing ? (
                  <drawing.Svg key={`pic-big-${at}-${n}`} source={pic.big.source} alt={`Picture: ${pic.name}`} />
                ) : pic.thumb && 'Svg' in drawing ? (
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
                    label={`${isBig(pic) ? '▾' : '▸'} Picture: ${cut(pic.name, Math.max(12, room - 11))}`}
                    plain
                    onPress={() => {
                      presses += 1
                      if (!bigPics.delete(pic.path)) bigPics.add(pic.path)
                      // Its large copy is made after the press, never while drawing, and drawn once made
                      if (isBig(pic) && !pic.big && e.surface !== 'terminal')
                        void bigOf($, pic.path)
                          .then(made => ((pic.big = made), redraw($)))
                          .catch(() => undefined)
                      void update($, view, v => ({ ...v }))
                    }}
                  />
                )}
                {isBig(pic) ? <Text dimColor wrap="wrap">{pic.path}</Text> : null}
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

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      return (
        <Box key={`todo-${one.id}`} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {one.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={LIVE} /> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{titleOf(one)}</Text>
                {facts(one, true)}
              </Box>
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
          ) : null}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {one.chat
            ? part('part-chat', 'Its chat', '', <Text dimColor wrap="wrap">{`Its chat is shown in the panel of the chat "${chatName(one.chat)}", which runs it. Stop it or move it to another model there.`}</Text>)
            : part('part-chat', 'Its chat', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>
      )
    }

    // The name of a chat above its cards, with its folder and the Mac it runs on when another. Another chat's name opens that chat in
    // the Claude app when pressed, and with the pointer resting on it shows under it what was last said there: the person's last
    // message and Claude's last answer, the older first, and what a press opens. Drawn hidden and shown by the surface as the pointer
    // moves, so nothing crosses to the mod and the cards beneath move down only while it rests there
    const chatHead = (key: string, name: string, side: string, c?: Shared) => {
      const url = c ? openUrl(c) : ''
      const said = c?.said
      const lines = said ? [...(said.you ? [{ who: 'You', text: said.you, at: said.youAt }] : []), ...(said.reply ? [{ who: 'Claude', text: said.reply, at: said.replyAt }] : [])].sort((a, b) => a.at - b.at) : []
      const label = <Text bold dimColor wrap="truncate-end">{name}</Text>
      return (
        <Box key={`chat-head-${key}`} flexDirection="column" paddingTop={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="flex-end" gap={2} paddingX={2}>
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              {c && url ? (
                <Button key={`chat-open-${key}`} plain hover={{ underline: true }} onPress={() => void openChat($, c)}>
                  {label}
                </Button>
              ) : (
                label
              )}
            </Box>
            {side ? (
              <Box flexShrink={0}>
                <Text dimColor wrap="truncate-end">{side}</Text>
              </Box>
            ) : null}
          </Box>
          {c ? (
            <Box display="none" hover={{ display: 'flex' }} flexDirection="column" gap={1} marginTop={1} marginX={2} paddingX={1} paddingY={1} backgroundColor={FILL}>
              {lines.length ? null : <Text dimColor wrap="wrap">Nothing said in this chat yet.</Text>}
              {lines.map(line => (
                <Box key={`chat-peek-${key}-${line.who}`} flexDirection="column">
                  <Text dimColor wrap="truncate-end">{line.at ? `${line.who} · ${ago(line.at, at)}` : line.who}</Text>
                  <Text wrap="wrap">{cut(oneLine(line.text), line.who === 'Claude' ? 240 : 160)}</Text>
                </Box>
              ))}
              <Text dimColor wrap="wrap">
                {url
                  ? c.host
                    ? `Press the name to open this chat in the Claude app here, through Remote Control.`
                    : 'Press the name to open this chat in the Claude app.'
                  : c.host
                    ? `Opens only on ${macName(c.host)}: Remote Control is off in this chat.`
                    : 'Opens only where it runs: it is not a chat of the Claude app and Remote Control is off.'}
              </Text>
            </Box>
          ) : null}
        </Box>
      )
    }

    // The newest result a piece of work left, which its open card links to
    const left = (one: Todo) => kept.filter(r => r.agent === one.id).sort((a, b) => b.at - a.at)[0]

    // Work that has ended, under the running cards: one folded row, so nothing above it moves. Unfolded, the newest first, each a
    // steady row of two lines (what it was, how it ended, its model, how long it took, when) that opens its card as for running work
    // Other chats' ended work folds in here too, once its pause is over; the row then says it holds every chat's
    const endedElsewhere = elsewhere.filter(one => one.status !== 'working' && !one.ask && !lingers(one, at))
    // Each other chat's cards under its name: running, asking, or in the pause after ending. A chat with none, when it is another
    // Mac's or beside other Macs' chats, is not listed among them: it is a row inside one folded row at the bottom, "N other chats"
    const shownOf = (c: Shared) => elsewhere.filter(one => one.chat?.id === c.chat && one.chat.host === c.host && (one.status === 'working' || one.ask || lingers(one, at)))
    const listedChats = otherChats.filter(c => shownOf(c).length)
    const quietChats = otherChats.filter(c => !shownOf(c).length && (c.host || isMulti()))
    const finished = [...own.filter(one => one.status !== 'working' && !isLingering(one, at)), ...endedElsewhere].sort((a, b) => b.endedAt - a.endedAt)
    // The open chats with nothing going on, this one too when it has nothing: one folded row, "N other chats", under the cards.
    // Unfolded, each is a row of its name, with its folder and Mac at its right, as the cards' chats are named
    const isSelfQuiet = !shownWork.length && !shownFlows.length && isMulti()
    const quietCount = quietChats.length + (isSelfQuiet && quietChats.length ? 1 : 0)
    const quietPart = () =>
      quietChats.length ? (
        <Box key="quiet" flexDirection="column" flexShrink={0} backgroundColor={FILL} paddingBottom={isQuietOpen ? 1 : 0}>
          <Box flexDirection="row" alignItems="center" gap={2} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button key={`quiet-fold-${presses}`} label={`${isQuietOpen ? '▾' : '▸'} ${quietCount === 1 ? '1 other chat' : `${quietCount} other chats`}`} plain onPress={() => void foldQuiet($)} />
            </Box>
          </Box>
          {isQuietOpen
            ? [
                ...(isSelfQuiet ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
                ...quietChats.map(c => chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c)),
              ]
            : null}
        </Box>
      ) : null
    const finishedPart = (isOpen: boolean) =>
      finished.length || endedFlows.length ? (
        <Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button
                key={`finished-fold-${presses}`}
                label={`${isOpen ? '▾' : '▸'} Finished ${finished.length + endedFlows.length}`}
                plain
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
    const alone = [...own, ...elsewhere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    if (alone && !alone.chat) void loadWork($, alone.id).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = $.ui.resolve(e)

    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
          // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
          // them, which wraps onto a second row in a narrow pane rather than cutting anything off
          <Box key="head" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Happy too for a workflow in its pause whose card turned green: it finished and its last round did not fail */}
              {isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(f => f.status === 'done' && isLingering(f, at) && roundsOf(f).at(-1)?.pass !== false)
                ? octopus(ui, 'head-mark', 'happy', HEAD_MARK, 'Claudopus, work finished')
                : octopus(ui, 'head-mark', working.length + runningFlows.length ? 'working' : 'mark', HEAD_MARK, working.length + runningFlows.length ? 'Claudopus at work' : 'Claudopus')}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                <Text bold wrap="truncate-end">Claudopus</Text>
                <Text dimColor wrap="truncate-end">
                  {working.length + runningFlows.length === 0 ? 'Nothing is running' : working.length + runningFlows.length === 1 ? 'Working on 1 thing' : `Working on ${working.length + runningFlows.length} things`}
                </Text>
                {elsewhere.some(one => one.status === 'working') ? (
                  <Text dimColor wrap="truncate-end">{(() => {
                    const running = elsewhere.filter(one => one.status === 'working')
                    const chats = new Set(running.map(one => `${one.chat?.host}/${one.chat?.id}`)).size
                    return `${running.length} more in ${chats === 1 ? '1 other chat' : `${chats} other chats`}`
                  })()}</Text>
                ) : null}
                <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? `This chat: ${fill(chat.tokens, chat.window)}` : 'This chat: just begun'}</Text>
              </Box>
            </Box>
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" gap={1}>
              {reportsButton($, ui, kept)}
              {statsButton($, ui)}
              {memoryButton($, ui)}
              {configButton($, ui)}
              {aboutButton($, ui)}
            </Box>
          </Box>
        ) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown; work that needs the person's hands comes first
              // Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (shownWork.length || shownFlows.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...[...shownWork.map(one => ({ at: one.ask ? -1e15 + one.ask.at : one.startedAt, card: () => small(one) })), ...shownFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, those that wait on the person first
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).sort((a, b) => (a.ask ? -1e15 + a.ask.at : a.startedAt) - (b.ask ? -1e15 + b.ask.at : b.startedAt))
                return [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...cards.map(one => small(one))]
              }),
            ]}
        {/* The other chats' row and the Finished row sit at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length || quietChats.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? quietPart() : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
  })

  // The reports, in a pane of their own
  on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    const kept = await read($, reports)
    // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
    const line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)))
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportsView($, $.ui.resolve(e), kept, await $.clock.now(), line)}
      </Box>
    )
  })

  // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
  on('ui.render', { component: 'Pane', requestId: STATS_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    void statsRead($, statsShown.scope).catch(() => undefined)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {statsView(() => $.ui.invalidate('ui.render'), $.ui.resolve(e), await $.clock.now(), scope => void statsRead($, scope).catch(() => undefined), e.surface, e.props.bodyColumns * 7.4 - 32)}
      </Box>
    )
  })

  // About, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, async ($, e) => {
    const ui = $.ui.resolve(e)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {configView(ui, await configShown($), configActs($), band, presses, dir)}
      </ui.Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, async ($, e) => {
    const { Box } = $.ui.resolve(e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await aboutView($, $.ui.resolve(e))}
      </Box>
    )
  })

  // A report opened as a pane of its own, named after it
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith('report-')) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const kept = await read($, reports)
    const r = kept.find(one => paneOf(one) === e.requestId)
    if (!r) return <Text dimColor>This result is no longer kept.</Text>
    if (!reportText.has(r.id)) reportText.set(r.id, await readOr($, `${reportPath(r)}/report.md`))
    const at = Math.min(Math.max(0, pictureAt.get(paneOf(r)) ?? 0), Math.max(0, r.files.length - 1))
    const file = r.files[at] ?? ''
    const picture = e.surface === 'terminal' ? null : RASTER.test(file) ? await thumbOf($, thumbPath(r, file)) : /\.svg$/i.test(file) ? await svgOf($, `${reportPath(r)}/${file}`) : null
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportShown($, $.ui.resolve(e), r, reportText.get(r.id) || 'This result has no text.', kept, await $.clock.now(), at, picture)}
      </Box>
    )
  })

  // A reply that names a memory file: its links to memory open the mod's tab, since the app's file pane refuses ~/.claude. The
  // terminal opens such a path itself, so it keeps its own drawing
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface === 'terminal' || !dir || e.props.isSummary || !memoryPathIn().test(e.props.text)) return next(e)
    const { text, hrefs } = memoryLinked(e.props.text)
    if (!hrefs.length) return next(e)
    const { Markdown } = $.ui.resolve(e)
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
    const { Box, Markdown, Text } = $.ui.resolve(e)
    const path = memoryPanes.get(e.requestId)
    if (!path) return <Text dimColor>Press the link in the chat again to open this file.</Text>
    const held = memoryText.get(e.requestId) ?? ''
    const { text, hrefs } = memoryLinked(held.length > REPORT_CHARS ? `${held.slice(0, REPORT_CHARS)}\n\n…` : held)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        <Text dimColor wrap="wrap">{path}</Text>
        {held ? (
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

  // The servers panel: one block per server with its link, where it runs and which chat started it; nothing is cut off
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Link, Text } = $.ui.resolve(e)
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

  // A run of the Workflow tool: its card comes up from the call and what the tool answered. The call goes on as made
  on('tool.call', { tool: 'Workflow' }, async ($, e, next) => {
    const r = await next(e)
    const answer = (r.result ?? undefined) as { status?: string; taskId?: string; runId?: string; transcriptDir?: string; scriptPath?: string; workflowName?: string; error?: string } | undefined
    if (!r.deny && !r.isError && answer && !answer.error && answer.status === 'async_launched')
      await flowStarted($, e as unknown as { script?: unknown; scriptPath?: unknown; name?: unknown; args?: unknown }, answer).catch(err => log($, `workflow not followed: ${String(err)}`))
    return r
  })

}
