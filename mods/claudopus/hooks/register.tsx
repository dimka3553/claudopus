// Made by src/claudopus/build.mjs from the parts in src/claudopus: change them there and build again, never this file. It is the hooks module hooks.json names.
import { atom, read, update } from 'claude-code'
import type { ElementTable, EngineInterface, McpToolResult, On, RasterProps, Register, RenderSurface, Timer, ToolCallInput, ToolCallResult, SessionMessage, ToolUseSummary } from 'claude-code'
import type { Entry, Flow, FlowAgent, Item, Link, Me, Prompt, Report, Server, Shared, Stream, Todo, Wait } from '../types'
import { capOf, doing, endOf, firstFit, fitWords, FLOW, FLOW_PANE, flowPaneOf, journalOf, metaOf, roundsOf, rowsOf, SQUARE_COLOR, SQUARE_GLYPH, squaresBefore, squaresKept, squaresOf, squaresSvg, squaresWidth, stageOf, titleOfFlow, withJournal } from './flows'
import type { Round } from './flows'
import { CACHE_V, GAP, held, memoryHeld, parsed, READ_EVERY, reading, statsView, SUM_JQ, svgFits, view as statsShown } from './stats'
import type { Cache, FileSum, Meta, MemoryPart, Run, Scope } from './stats'
import { broughtBackBy, isResultId, marksOf, merged, markThere, parsedMeta, PLACE, PULL, pullThere, PUSH, PUSH_THERE, rehome, RESULTS_A_TRIP, RESULTS_EVERY, RESULTS_LOOK, resultsOf } from './results'
import { ANSWER_KEPT, ANSWERS, answerOf, APP_ID, BEAT, BRIDGE_ID, remoteId, cardsOf, helpersOf, chatName, chatSide, clockOf, FETCH_EVERY, fetchedOf, fetchedOpen, openChatOf, headLine, headMood, isKey, isMac, keyOf, linkOf, LIVE_DIR, LOOK_EVERY, OPEN_EVERY, openTake, opensOf, MACS, macName, openUrl, ordered, OUTBOX, PUSHED, pushHead, pushOf, shareable, shareableHelpers, sharedOf, signOf, STALE, trip, tripOf, OFF_LOOK, offOf, APP_LOG_LOOK, stuckOf } from './shared'
import type { Answer, Off } from './shared'
import { configView, editing, fillModels, modelsOf, modelsShort, parse, TEXTS } from './config'
import type { Config, ConfigShown, Models, Role } from './config'
import type { Fail, LookIo, Notice, Published, Source, Steps } from './update'
import { copyOf, download, FAILS, folderMarketplace, folderReady, install, installedFrom, isNewer, isUpdateDue, isVersion, lookEveryOf, LOOK_EVERY_HOURS, missedOn, noticeOf, publishedOf, RELOAD_AGAIN, RELOAD_EVERY, scopeOf, sizeText, stampOf, stepsOf, UPDATE_AFTER, UPDATE_LOOK, updatedArt, updatedFrom, updatedLook, UPDATED_FOR, UPDATED_LATE, UPDATED_SAYS, VERSION_PAGE, VERSION_WAIT, versionOnPage } from './update'
import { changelogOf, fitted, isScreenDue, missedOf, previousOf, seenIn, TAB_BUDGET } from './changelog'
import type { Version } from './changelog'
import { tabMoveQueue } from './tabmoves'
import { detachedOf, DOWNLOAD_CMD, describedOf, endOf as runEndOf, expiresIn, leftSeconds, foldJobs, heldShellOf, isKindSaid, isPausedProc, isPid, isWaitOnly, labelOf, leftText as timeLeftText, JOB_COLOR, JOB_GLYPH, JOB_HEAD, JOB_SHAPE, JOB_LOOK, JOB_NEWS, JOB_QUIET, JOB_TAIL, JOB_UNREAD, JOB_WORD, jobKindOf, JOBS_SHOWN, latestOf, tailOf, OUTPUT_LINES, pidOf, portOf, procsOf, SERVER_CMD, shellsOf, treeOf, waitOf } from './jobs'
import { leftoversOf, memOf, leftName, PS_COLUMNS, plainOf, reportsOf, SILENT_AFTER, SILENT_WARN } from './jobs'
import { ownWaitOf, watcherOf } from './jobs'
import type { OpenCall, OwnRun, Proc, Span } from './jobs'
import type { Job, JobKind } from './jobs'
import type { TabMove } from './tabmoves'
import { batteryShown, batterySvg, FOOTPRINT_EVERY, gbText, isBatteryLow, isMemoryHigh, keptOf, leftText, meterOf, nextKept, pctText, rateText, USAGE_AMBER, USAGE_EVERY, USAGE_LINUX, USAGE_PURPLE, usageMac, usageSvg } from './usage'
import type { UsageTop, UsageBattery, UsageFigures, UsageKept } from './usage'

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
// What a chat's own thread may call to hand work over: it starts agents and workflows, and talks to them. An agent may call anything
const OWN = ['Agent', 'Workflow', 'SendMessage', 'ListAgents', 'TaskStop', 'ToolSearch', 'AskUserQuestion', 'SendUserFile', 'ReadNotifications', 'Skill']
// And what it reads with, to answer a question a few files answer: none of them changes a file or runs a command
const READS = ['Read', 'Grep', 'Glob']
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
// What else a Details tab can unfold, kept beside its chat's numbers, far from them: the person's words whole, every to-do
// not yet started, and those done or dropped
const OPEN_ASK = -1_000_001
const OPEN_DONE = -1_000_003
const OPEN_RESULT = -1_000_004
// Under a command's row in Details, its last lines sit on a darker ground, as a terminal's
const OUTPUT_FILL = '#0000003D'
// How much of what work reported at its end its Details shows before Show all
const RESULT_SHOWN = 600
// Past this many done to-dos, Details folds them into one row
const DONE_FOLDED = 8
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
// Work acting on the person's reply in their own words to an ask it keeps open: at work, drawn in the work's purple, its question
// with the reply under it and nothing to press or type, as the person has answered. So from the moment the reply is sent: ended
// work being started again with it (isWaking), and another chat's work until its own chat has taken the reply (actingOn). Only
// once it stops again with the ask open does it wait on the person, with every answer back
const isActingOnReply = (one: { id?: string; status: string; ask?: { at?: number; replied?: { isWaking?: boolean } } }) =>
  Boolean(one.ask) && ((Boolean(one.ask?.replied) && (one.status === 'working' || Boolean(one.ask?.replied?.isWaking))) || actingOn.has(`${one.id}:${one.ask?.at}`))
// An admin command held for the person's press needs them whatever else the work does
const needsPerson = (one: { id?: string; status: string; ask?: { at?: number; replied?: { isWaking?: boolean } }; admins?: unknown[] }) => Boolean(one.admins?.length) || (Boolean(one.ask) && !isActingOnReply(one))
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
// When the figures above the prompt last changed: the band redraws on that alone, never each second, since each redraw of it closes
// and opens again a hover card the pointer rests on, and can leave one open after the pointer has gone on to the next figure
const figuresAt = atom({ plugin: 'claudopus', key: 'figures' } as const, 0, { shape: 'figures-1' })
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
// When the panel was last drawn, kept through a reload (drawnNow, written by the timer each second, never read while drawing)
const lastDrawn = atom({ plugin: 'claudopus', key: 'drawn' } as const, 0, { shape: 'drawn-1' })
let drawnNow = 0
// When the list was last given an older drawing again (held), and last drawn afresh: work that ended between the two was not seen
let listHeldAt = 0
let listFreshAt = 0
// The titles of work in its moment at the top, as last drawn: the line above the prompt points at them when the list is scrolled away
let finishedAtTop: string[] = []
// The list of work is written only when it changes. Each write of a value the panel or Details read draws them again, and the app
// builds a pane it is asked to draw whole afresh, even when it shows the same: the element under the pointer loses its hover look,
// and a press on a button of the drawing replaced meanwhile reaches nothing. The list was written over with the same list every
// few seconds while work ran (15 Nov, a minute of running work: seven writes, none of them a change). Should another write land
// between the look and the write, the change is made again on what that write left
const changeTodos = async ($: EngineInterface, fn: (list: Todo[]) => Todo[]) => {
  const now = await read($, todos)
  const before = JSON.stringify(now)
  const next = fn(now)
  if (JSON.stringify(next) === before) return now
  return update($, todos, list => (JSON.stringify(list) === before ? next : fn(list)))
}
const paneShown = atom({ plugin: 'claudopus', key: 'shown' } as const, false, { shape: 'shown-1' })
// What the person has typed into an ask's reply box and not sent, by the work, kept through a reload of the mod (drafts, written as
// they type, read back once as the mod loads, never while drawing). A key box's letters are never kept: its surface holds them
const draftsKept = atom({ plugin: 'claudopus', key: 'drafts' } as const, {}, { shape: 'drafts-1' })
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
// An ask's answer buttons keep one key for as long as the ask stands, never the count of presses: a surface that draws late, as a
// phone over the remote connection, still shows the keys of the last drawing, and a press on a key the panel no longer holds ran
// nothing (14 Nov: "Release it" pressed on one card right after another card's went nowhere). Their buttons go with the ask, so none
// is left holding the focus. The admin command's Allow and Deny keep theirs the same way. A new load gives them new keys, as presses
// does for the rest
let loadMark = 0
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
  // A change to the person's settings or texts made while no chat watched is put back before anything reads them
  if (dir) await personCheck($).catch(err => log($, `files not compared as the mod loads: ${String(err)}`))
  const config = await readConfig($, dir)
  isOff = config.agents === false
  // Admin passwords an earlier version kept leave the keychain as the mod loads: none is kept any more
  void forgetKeptPasswords($).catch(() => undefined)
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
  const m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(id.toLowerCase())
  return m?.[1] ? `${m[1].charAt(0).toUpperCase()}${m[1].slice(1)}${m[2] ? ` ${m[2]}${m[3] ? `.${m[3]}` : ''}` : ''}` : ''
}
// The models the person can move running work to from its card, by the id each step is sent with, the newest of each family. Never
// Haiku. These are the least the mod knows: a newer id the engine starts work on or answers from takes its family's place (seeModel)
const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2']
// The newest Haiku, for the settings that name Haiku for a kind of work, raised the same way
const HAIKU = ['claude-haiku-5-5']
// A version as numbers; an id that leads with a date or an old numbering ("claude-3-5-sonnet-20241022") reads as none
const versionOf = (id: string): [number, number] | undefined => {
  const [major = 0, minor = 0] = (modelName(id).split(' ')[1] ?? '').split('.').map(Number)
  return major && major <= 99 ? [major, minor] : undefined
}
const isBelow = (a: [number, number], b: [number, number]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])
// The newest model of a family, by the id each step is sent with: Haiku's place is Sonnet's
const newestModel = (family: string) => MODELS.find(one => modelName(one).startsWith(family === 'Haiku' ? 'Sonnet' : family))
// A model the engine resolved or answered from: one newer than its family's newest takes its place, so what counts as older follows
// the newest the engine offers and never goes stale
const seeModel = (id: string) => {
  const family = modelName(id).split(' ')[0] ?? ''
  const version = versionOf(id)
  const list = family === 'Haiku' ? HAIKU : MODELS
  const at = list.findIndex(one => modelName(one).startsWith(`${family} `))
  const top = at >= 0 ? versionOf(list[at]!) : undefined
  if (!version || !top || !isBelow(top, version)) return
  list[at] = `claude-${family.toLowerCase()}-${version[0]}${version[1] ? `-${version[1]}` : ''}`
}
// The model a step or start is sent to in place of one no work runs on: an older version than its family's newest goes to that
// newest, and Haiku to the newest Sonnet. Nothing for a model work may run on: the newest or a newer version, a name with no
// version, which the app reads as the newest, and Haiku when the settings name it for a kind of work
const rightModel = (id: string): string | undefined => {
  const [family = '', version = ''] = modelName(id).split(' ')
  if (!family) return undefined
  const isHaikuNamed = family === 'Haiku' && Object.values(models).includes('haiku')
  if (family === 'Haiku' && !isHaikuNamed) return newestModel('Sonnet')
  if (!version) return undefined
  const newest = isHaikuNamed ? HAIKU[0] : newestModel(family)
  const top = versionOf(newest ?? '')
  const mine = versionOf(id)
  const isOlder = !mine || (top !== undefined && isBelow(mine, top))
  return isOlder ? newest : undefined
}
// How strong a model is, for a check never weaker than what it checks
const RANK: Record<string, number> = { Haiku: 0, Sonnet: 1, Opus: 2, Fable: 3 }
// `opusplan` runs on Sonnet outside plan mode, so it counts as Sonnet
const rankOf = (id: string) => (/opusplan/i.test(id) ? RANK.Sonnet! : (RANK[modelName(id).split(' ')[0] ?? ''] ?? -1))
// A helper that looks over what was built, by its few words: a checking word, then what was built ("Review my PR", "Test the fix"),
// or a look that is only ever a check ("Sanity check", "What is wrong with the build"). Legwork that names checking something else
// ("Check the Stripe balance", "Review the docs", "Check the PR status") is not one
const CHECKS = /\b(second look|another look|look(s|ing)? (over|for)|(re-?|double[- ]?|spot[- ]?|sanity[- ]?)?check(s|ing|ed|er)?|(code )?review(s|ing|ed|er)?|audit(s|ing|or)?|verif(y|ies|ying|ication|ied)|validat(e|es|ing|ion)|critique|proofread|inspect(s|ing|ion)?|test(s|ing)?|qa|find|hunt(s|ing)?)\b.*\b(page|fix|fixes|fixed|change|changes|build|built|work|diff|pr|code|branch|commit|result|results|report|output|mod|app|feature|design|claims|draft|holes|bugs|faults|what was built)\b/i
const ONLY_CHECKS = /\b(second look|sanity check|spot[- ]?check|what is wrong|is wrong with)\b|^(checker|reviewer|auditor|code review)\b/i
const NOT_CHECKS = /\b(status|comments?|balance|quota|usage|logs?)\b/i
const isChecker = (description: string) => ONLY_CHECKS.test(description) || (CHECKS.test(description) && !NOT_CHECKS.test(description))
// Work a safety check flagged whose next steps the app would send to an older model: it is ended with this report instead, so its
// parent starts what is left again on a current model. The steps of it answered so
const FLAGGED = (on: string) =>
  `Stopped by Claudopus: a safety check flagged this agent's last message, and the app would have continued it on ${modelName(on) || on}, an older model Claudopus doesn't run tasks on, so nothing after the flag was done. Start what is left again on the current model, leaving out what was flagged.`
const flaggedSteps = new Map<string, number>()
// Work a safety check flagged once: its steps on an older model are never sent to a newer one, whatever it was started on
const flaggedOnce = new Set<string>()
// The model an agent is started on in place of the one asked, or why it is not started; nothing when it may start as asked
const startModel = (e: { model?: string; parentModel?: string; parentAgentId?: string; description?: string; fork: boolean; workflow?: unknown }): { model?: string; deny?: string } => {
  const parentModel = String(e.parentModel ?? '')
  // A copy runs on its parent's model, which no hook changes
  if (e.fork) return rightModel(parentModel) ? { deny: WRONG_MODEL(parentModel) } : {}
  const asked = (e.model ?? '').trim()
  const parent = rightModel(parentModel) ?? parentModel
  // An alias or `inherit` the engine resolves to the newest, or the parent's; an older id or Haiku goes to its family's newest
  let model = asked && asked !== 'inherit' ? (rightModel(asked) ?? '') : rightModel(parentModel) && (!asked || asked === 'inherit') ? parent : ''
  // A check of what was built never runs weaker than what started it, nor below Opus
  if (isChecker(e.description ?? '')) {
    const runs = model || (asked && asked !== 'inherit' ? asked : parent)
    const least = rankOf(parent) >= RANK.Opus! ? parent : (newestModel('Opus') ?? 'opus')
    if (rankOf(runs) < rankOf(least)) model = least
  }
  return model ? { model } : {}
}
// The model each agent started on, as the engine resolved it: a step on Haiku of one that started there is its own kind's, not the app's move
const startedOn = new Map<string, string>()
// The work and helpers whose steps the app sent to such a model, each said in the log once
const sentElsewhere = new Set<string>()
// What a fork is answered when the model it would copy is such a model
const WRONG_MODEL = (named: string) =>
  `Claudopus doesn't run tasks on ${modelName(named) || named}. Start a fresh agent and name the model by its alias: ${modelsShort(models)}. Never an older version${Object.values(models).includes('haiku') ? '' : ', never Haiku'}.`
// The line written into a piece of work's own chat when the person moves it to another model; the panel draws it as a line of its own
const MODEL_HEAD = 'Model changed to '
const MODEL_LINE = /^Model changed to (.+?) at (\d{1,2}:\d{2})\./
const movedTo = (name: string, at: number) => {
  const d = new Date(at)
  return `${MODEL_HEAD}${name} at ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}. ${who(true)} chose it in the panel: your next steps run on ${name}.`
}

const readOr = ($: EngineInterface, path: string) =>
  $.fs.read(path).catch(() => '').then(text => (listDrawing > 0 && isWatched(path, text) && !drawnFiles.has(path) && drawnFiles.set(path, text), text))
// While the panel is drawn, the files its drawing reads, as read then: looked at again each second, so a change in one draws it
// again (calmLook), as nothing else would
let listDrawing = 0
// Another hook may read while the panel is drawn: what grows as work runs (transcripts, logs, other chats' live files, words, asks,
// keep files) and anything large is never watched, so it cannot draw the panel again each second
const isWatched = (path: string, text: string) => text.length < 64_000 && !/\.jsonl$|\/log\.md$|\/live\/|\/words\/|\/asks\/|\/keep\/|\/helpers\//.test(path)
const drawnFiles = new Map<string, string>()
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
  if (e.surface !== 'terminal') return ui
  const marked = { ...ui, Box: termBox(ui.Box), isTerminal: true }
  return marked
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

// ---- Which system this chat runs on ----
// Linux, as uname says once at the chat's start (chat.tsx), else a Mac: what only a Mac has (its keychain, Finder and Preview,
// Terminal, sips, its own notifications) takes Linux's own way there, or says plainly that it is not there. `hasDesktop` is a
// Linux desktop session the person sees (DISPLAY or WAYLAND_DISPLAY): without one, as in a terminal over SSH, nothing opens a window
let isLinux = false
let hasDesktop = true
// Where bin/keyring keeps its files on Linux, ~/.local/share/claudopus/keyring (never under $XDG_DATA_HOME, which a caller sets),
// and where earlier versions kept them when XDG_DATA_HOME was set, guarded the same (the mod moves them home as it loads)
let keyringRoot = ''
let keyringOldRoot = ''
const knowSystem = async ($: EngineInterface) => {
  const r = await $.process.run(['uname', '-s'], { timeoutMs: 5_000 }).catch(() => undefined)
  isLinux = r?.exitCode === 0 && r.stdout.trim() === 'Linux'
  hasDesktop = !isLinux || Boolean((await $.env.get('DISPLAY')) || (await $.env.get('WAYLAND_DISPLAY')))
  const data = (await $.env.get('XDG_DATA_HOME')) ?? ''
  keyringRoot = `${(await $.env.get('HOME')) ?? ''}/.local/share/claudopus/keyring`
  keyringOldRoot = data.startsWith('/') ? `${data}/claudopus/keyring` : ''
}
// How this computer is named in what the person reads
const thisMac = () => (isLinux ? 'this machine' : 'this Mac')
const keptWhere = () => (isLinux ? 'a file on this machine that only you can read' : "this Mac's keychain")
// A file, folder or link opened as the person's own system opens it: `open` on a Mac, xdg-open on a Linux desktop. Linux without
// a desktop has nothing to open it on, and says so as a failed run does
const openOn = async ($: EngineInterface, target: string, isText = false) => {
  if (!isLinux) return $.process.run(isText ? ['open', '-t', target] : ['open', target]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (!hasDesktop) return { exitCode: 1, stderr: 'no desktop on this machine to open it on' }
  return $.process.run(['xdg-open', target]).catch(err => ({ exitCode: 1, stderr: String(err) }))
}
// macOS's sips on a Mac; on Linux bin/sips, which answers the same calls with ImageMagick and fails, drawing no small copy, without it
const sips = ($: EngineInterface) => (isLinux ? `${$.plugin.root}/bin/sips` : 'sips')

// The panel's recorder: what happens in the real panel, written to a file, for finding faults only the app shows (the panel
// thrown to its end while the person types, 15 Nov). Off unless the file record-panel.on is in the memory folder; then each chat
// that loads the mod writes, for RECORD_FOR, one line per event to panel-record/<chat>-<start>.jsonl and removes the switch:
// every drawing of the panel and what asked for it, where its window stood, which element holds the focus, the cards in their
// order, scrolls and who asked for them, presses, and the person's typing as a count by box. Never a value typed into a box:
// an input's text, a reply's, a key's, is not read, and an element's key is kept only in the mod's own shape of keys
const RECORD_FOR = 180_000
const RECORD_SWITCH = 'record-panel.on'
const RECORD_FRESH = 60_000
let recording: { path: string; until: number; lines: string[]; written: number; started: number } | undefined
let recordLooked = 0
let typedCount = new Map<string, number>()
// Only the shape of a key the mod draws (letters, digits and - _ : . |, at most 96): anything else is kept as its length
const keyShown = (key: unknown) => (typeof key === 'string' && /^[\w\-:.|]{1,96}$/.test(key) ? key : typeof key === 'string' ? `<${key.length}>` : undefined)
// Whether to record now: the switch is looked for at most every 2 s; found, recording starts and the switch goes
const isRecording = async ($: EngineInterface) => {
  const at = await $.clock.now()
  if (recording) {
    if (at < recording.until) return true
    await recordFlush($)
    recording = undefined
    return false
  }
  if (!dir || at - recordLooked < 2000) return false
  recordLooked = at
  const on = `${dir}/${RECORD_SWITCH}`
  const stat = await $.fs.stat(on).catch(() => undefined)
  if (!stat) return false
  // A switch left from long ago, its removal failed or its chat gone, starts nothing: it goes
  if (at - stat.mtimeMs > RECORD_FRESH) return void (await $.process.run(['rm', '-f', on]).catch(() => undefined)), false
  const chat = (await $.session.id().catch(() => '')).slice(0, 8) || 'chat'
  recording = { path: `${dir}/panel-record/${chat}-${new Date(at).toISOString().replace(/[:.]/g, '-')}.jsonl`, until: at + RECORD_FOR, lines: [], written: 0, started: at }
  typedCount = new Map()
  // The switch stays for the other chats to see for a few seconds, then goes, so a recording never runs on by itself
  $.clock.after(6000, () => void $.process.run(['rm', '-f', on]).catch(() => undefined))
  const manifest = await readOr($, `${$.plugin.root}/.claude-plugin/plugin.json`)
  const flushing = () => $.clock.after(2000, () => void (recording ? recordFlush($).then(() => (recording && ((void isRecording($)), flushing()))) : undefined))
  flushing()
  await recordLine($, { ev: 'start', version: /"version": *"([^"]+)"/.exec(manifest)?.[1] ?? '', root: $.plugin.root.split('/').slice(-3).join('/') })
  return true
}
// One event, with its time from the start
const recordLine = async ($: EngineInterface, event: Record<string, unknown>) => {
  if (!recording) return
  recording.lines.push(JSON.stringify({ t: (await $.clock.now()) - recording.started, ...event }))
  if (recording.lines.length - recording.written > 40) await recordFlush($)
}
const recordFlush = async ($: EngineInterface) => {
  if (!recording || recording.written === recording.lines.length) return
  recording.written = recording.lines.length
  await $.fs.write(recording.path, `${recording.lines.join('\n')}\n`).catch(() => undefined)
}
// An event, when recording: called from the mod's own redraws and scrolls with what asked for it
const recordEvent = ($: EngineInterface, ev: string, extra: Record<string, unknown> = {}) => {
  if (!recording) return
  void $.clock.now().then(at => void (recording && at < recording.until && recordLine($, { ev, ...extra, from: callerOf() })))
}
// Where in the mod a call came from: the function names on the way, from the stack, without paths
const callerOf = () =>
  (new Error().stack ?? '')
    .split('\n')
    .slice(3, 7)
    .map(line => line.trim().replace(/^at /, '').replace(/\(.*[/\\]([^/\\]+)\)$/, '($1)').replace(/ \(.*\)$/, m => (m.length > 40 ? '' : m)))
    .filter(line => line && !line.startsWith('async') && !line.includes('node:'))
    .join(' < ')
    .slice(0, 200)
// What a drawing holds, as far as scroll and focus go: its keyed elements in order (keys only), inputs and where they sit
const drawingShape = (drawing: unknown) => {
  const keys: string[] = []
  let nodes = 0
  const inputs: { key: string | undefined; before: number }[] = []
  const walk = (node: unknown, depth: number) => {
    if (!node || typeof node !== 'object' || nodes > 5000) return
    if (Array.isArray(node)) return void node.forEach(child => walk(child, depth))
    const el = node as { type?: unknown; key?: unknown; props?: Record<string, unknown>; children?: unknown }
    if (!el.props && el.key === undefined) return
    nodes += 1
    const type = typeof el.type === 'string' ? el.type : typeof el.type === 'function' ? (el.type as { name?: string }).name ?? '' : ''
    const key = keyShown(el.key ?? el.props?.key)
    if (/Input/i.test(type) || /-reply-|-field/.test(key ?? '')) inputs.push({ key, before: nodes })
    if (key && depth <= 6) keys.push(key)
    walk(el.children ?? el.props?.children, depth + 1)
  }
  walk(drawing, 0)
  return { nodes, inputs, keys: keys.slice(0, 120), sign: [...keys.join(',')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36) }
}
const recordDrawn = new Map<string, unknown>()
const lastSign = new Map<string, string>()
const recorderHooks = (on: On) => {
  // The bar above the prompt, where the reply box is drawn: each drawing, whether it was the one held, and the boxes in it
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const began = await $.clock.now()
    const r = await next(e)
    const isSame = recordDrawn.get('bar') === r
    recordDrawn.set('bar', r)
    const shape = drawingShape(r)
    await recordLine($, { ev: 'render', component: e.component, id: e.requestId, surface: e.surface, offset: e.props.scroll.offset, rows: e.props.scroll.bodyRows, collapsed: e.props.isCollapsed, ms: (await $.clock.now()) - began, held: isSame, typing: isTyping, nodes: shape.nodes, inputs: shape.inputs, sign: shape.sign })
    return r
  })
  on('ui.scroll', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (await isRecording($)) await recordLine($, { ev: 'scroll', id: e.requestId, site: 'bar', origin: e.origin.kind === 'plugin' ? `plugin:${e.origin.name}` : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })
    return next(e)
  })
  on('ui.input', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (await isRecording($)) {
      const key = keyShown(e.element) ?? ''
      typedCount.set(key, (typedCount.get(key) ?? 0) + 1)
      await recordLine($, { ev: 'input', id: e.requestId, site: 'bar', element: key, kind: e.kind, count: typedCount.get(key) })
    }
    return next(e)
  })
  on('ui.press', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    await recordLine($, { ev: 'press', id: e.requestId, site: 'bar', element: keyShown(e.element) })
    const r = await next(e)
    await recordLine($, { ev: 'pressed', site: 'bar', element: keyShown(r.element) })
    return r
  })
  on('ui.render', { component: 'Pane', requestId: LIST }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const id = e.requestId ?? ''
    const began = await $.clock.now()
    const r = await next(e)
    const props = e.props as { scroll?: { offset: number; bodyRows: number }; isFocused?: boolean; placement?: string; bodyColumns?: number }
    const isSame = recordDrawn.get(id) === r
    recordDrawn.set(id, r)
    const shape = e.component === 'Pane' ? drawingShape(r) : undefined
    const moved = shape && lastSign.get(id) !== shape.sign
    if (shape) lastSign.set(id, shape.sign)
    await recordLine($, {
      ev: 'render', component: e.component, id, surface: e.surface, offset: props.scroll?.offset, rows: props.scroll?.bodyRows, cols: props.bodyColumns, focused: props.isFocused,
      placement: props.placement, ms: (await $.clock.now()) - began, held: isSame, typing: isTyping, nodes: shape?.nodes, inputs: shape?.inputs, sign: shape?.sign, keys: moved ? shape?.keys : undefined,
    })
    return r
  })
  on('ui.scroll', { requestId: LIST }, async ($, e, next) => {
    if (await isRecording($)) await recordLine($, { ev: 'scroll', id: e.requestId, origin: e.origin.kind === 'plugin' ? `plugin:${e.origin.name}` : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })
    return next(e)
  })
  // Every site's focus moves, the panel's and the rest (a press that takes the focus out of the panel), and what came of each
  // (by site kind: the panel's own hook in commands.tsx is the one without a matcher, and the engine allows one)
  on('ui.focus', { component: 'Pane' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const r = await next(e)
    await recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })
    return r
  })
  on('ui.focus', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    const r = await next(e)
    await recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })
    return r
  })
  // Typing as a count by box: the value is never read
  on('ui.input', { requestId: LIST }, async ($, e, next) => {
    // A key box's typing is not recorded at all, not even as a count: a password's length is the password's
    if (!/^box-.*-field/.test(e.element) && (await isRecording($))) {
      const key = keyShown(e.element) ?? ''
      typedCount.set(key, (typedCount.get(key) ?? 0) + 1)
      await recordLine($, { ev: 'input', id: e.requestId, element: key, kind: e.kind, count: typedCount.get(key) })
    }
    return next(e)
  })
  // A press, and whether it reached its button: an element the drawing no longer holds runs nothing
  on('ui.press', { requestId: LIST }, async ($, e, next) => {
    if (!(await isRecording($))) return next(e)
    await recordLine($, { ev: 'press', id: e.requestId, element: keyShown(e.element) })
    const r = await next(e)
    await recordLine($, { ev: 'pressed', element: keyShown(r.element) })
    return r
  })
}

// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders

// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
const BRIEF =
  'Answer a question that a few reads settle here, with Read, Grep and Glob. For anything that changes a file, runs a command or takes more than a few reads: answer this message in one line and, in the same turn, start a fresh agent: Agent, subagent_type "general-purpose", the model the rule names, and the task\'s instructions as the prompt. Only a message that changes what a listed task is already doing (a change, an answer Claude is waiting for, a stop) goes to that task with SendMessage, in their words. A fault, a question or a new request gets its own agent, even when it is about the same code or card as a running task.'
const REFUSED =
  'This chat\'s own thread only reads (Read, Grep, Glob); it changes no file and runs no command. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and the task\'s instructions as the prompt.'
const NO_COPY = () =>
  `Claudopus never starts a task as a copy of this chat. Start a fresh agent instead: subagent_type "general-purpose", the model named (${modelsShort(models)}), and the task's instructions as the prompt.`
// A command that would print a password or key the keychain keeps (on Linux, the files bin/keyring keeps). Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
const KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b|\bkeyring['"]?\s+get\b|claudopus\/keyring\b/
const NO_READ = 'A saved key or password is never read or printed. Use it as an environment variable through the secret runner the task rules name; it hides the value in anything the command prints.'
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
      else if (c === '\\' && quote === '"' && i + 1 < command.length && '$`"\\\n'.includes(command[i + 1]!)) word = (word ?? '') + command[++i]
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
        // a flag and, for those that take one, its value: env -u NAME, -C dir, -S text, -P path; sudo -u user and the like
        while (i < words.length && words[i]!.startsWith('-')) i += (head === 'env' && /^-[uCSP]$/.test(words[i]!)) || (head === 'sudo' && /^-[ugCchpUrtD]$/.test(words[i]!)) ? 2 : 1
        while (head === 'env' && i < words.length && /^\w+=/.test(words[i]!)) if (/^RELEASE_PUSH=/.test(words[i++]!)) return true
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
// The boxes of the password and key runners are theirs alone: work never writes into their folder, ~/.claude/claudopus/boxes, nor
// reads their keychain service, claudopus-box. A command is read as the shell splits it, in small letters (this Mac's files take any),
// with each simple {a,b} tried each way, then as words split at any sign a path or a program joins words with; a word counts when it
// is the name itself or a pattern (*, ?, [...]) that matches it, and a lone * matches nothing, so a folder listed whole is not taken
// for the boxes. The folder is .claude (or the setting that moves it) followed by claudopus (a cd between them aside), then boxes; the
// service is claudopus-box with security (or a program's keychain library). A command that only reads and writes nothing (a search, a
// listing, git and gh, which a commit message naming the folder runs through) counts only for what it sends into a file with >.
// Setting the runners' own folder by hand counts too. This stops slips and common tricks: a name pieced together as the command runs,
// a link made to the folder, or a script run some other way gets past it, so it is no wall
const BOX_READERS = ['rg', 'grep', 'egrep', 'fgrep', 'ls', 'du', 'git', 'gh', 'wc', 'head', 'tail', 'less', 'file', 'stat', 'tree']
const BOX_WRAPPERS = ['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'nice', 'timeout', 'xargs', 'caffeinate']
// Where a command's own words start, past settings and what runs a command it is handed
const commandAt = (words: string[]) => {
  let i = 0
  for (;;) {
    while (i < words.length && /^\w+=/.test(words[i]!)) i++
    const head = (words[i] ?? '').split('/').pop() ?? ''
    if (!BOX_WRAPPERS.includes(head)) return i
    i++
    // its own flags and numbers (nice's -n 5, timeout's duration), and the value sudo's -u and the like take
    while (i < words.length && (words[i]!.startsWith('-') || /^\d[\d.]*[smhd]?$/.test(words[i]!))) i += head === 'sudo' && /^-[ugCchpUrt]$/.test(words[i]!) ? 2 : 1
  }
}
const BOX_WORDS = (text: string) => text.replace(/["'\\`]/g, '').split(/[^a-z0-9._*?[\]-]+/).filter(Boolean)
const wordIs = (word: string, name: string) => {
  // A list's brackets around a word, as a program's code writes it, are not part of it
  const bare = word.replace(/^\[+(?=[^\]]*$)/, '').replace(/(?<=^[^[]*)\]+$/, '')
  if (word === name || bare === name) return true
  if (!/[*?[]/.test(bare) || /^[*?]+$/.test(bare)) return false
  try {
    return new RegExp(`^${bare.replace(/[.+^${}()|\\-]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/\[!/g, '[^')}$`).test(name)
  } catch {
    return false
  }
}
const namesBoxes = (text: string): boolean => {
  const words = BOX_WORDS(text)
  const has = (name: string) => words.some(word => wordIs(word, name))
  const isFolder = words.some((word, i) => {
    if (!wordIs(word, '.claude') && word !== 'claude_config_dir') return false
    // claudopus within a few words after it (a cd, or a command started there, between them), then boxes
    const j = words.slice(i + 1, i + 6).findIndex(one => wordIs(one, 'claudopus'))
    return j >= 0 && words.slice(i + 2 + j).some(one => wordIs(one, 'boxes'))
  })
  return isFolder || (has('claudopus-box') && (has('security') || has('keyring') || has('ksecattrservice')))
}
const touchesBoxes = (text: string): boolean => {
  if (/\bCLAUDOPUS_BOX(?:ES|_TAKEN)\b/.test(text)) return true
  const kept = shellWords(text.toLowerCase())
    .map(words => {
      const part = words.join(' ')
      if (!BOX_READERS.includes((words[commandAt(words)] ?? '').split('/').pop() ?? '')) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return [0, 1, 2, 3].some(k => namesBoxes(k ? kept.replace(/\{([^{}]*,[^{}]*)\}/g, (_, alts: string) => alts.split(',')[k - 1] ?? '') : kept))
}
// A file a command runs, against the folder it runs in (a cd in it moves that): the first word of each of its commands when it is a
// path, what a shell, source or another language's program is handed to run or reads on its stdin, and a file cat pipes into a
// shell. The system's own programs are not read
const RUNNERS = ['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish', 'source', '.', 'python', 'python3', 'node', 'bun', 'deno', 'perl', 'ruby', 'php', 'osascript', 'swift', 'tsx', 'ts-node']
const filesRun = (command: string, home: string, from: string): string[] => {
  let folder = from
  const found: string[] = []
  const parts = shellWords(command)
  parts.forEach((words, n) => {
    const i = commandAt(words)
    const head = words[i] ?? ''
    const name = head.split('/').pop() ?? ''
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) return void (folder = pathOf(words[i + 1]!, home, folder))
    const take = (path: string) => found.push(pathOf(path, home, folder))
    if (RUNNERS.includes(name) || /^python3(?:\.\d+)?$/.test(name)) {
      const rest = words.slice(i + 1).filter(word => word !== 'run')
      const fed = rest.findIndex(word => word.startsWith('<'))
      if (fed >= 0) take(rest[fed] === '<' ? (rest[fed + 1] ?? '') : rest[fed]!.slice(1))
      const at = rest.findIndex(word => !word.startsWith('-') && !word.startsWith('<'))
      // A program handed its code inline (-c, -e) is read as part of the command already
      if (at >= 0 && !rest.slice(0, at).some(flag => /^-[cem]$/.test(flag))) take(rest[at]!)
      // a shell's -c is a command of its own, whose files are looked for the same way
      if (['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish'].includes(name) && at >= 0 && rest[at - 1] === '-c') found.push(...filesRun(rest[at]!, home, folder))
      // Nothing to run named: what it reads is what the command before it gives, such as a file cat prints
      const before = parts[n - 1] ?? []
      if (at < 0 && fed < 0 && (before[commandAt(before)] ?? '').split('/').pop() === 'cat') for (const one of before.slice(commandAt(before) + 1)) if (!one.startsWith('-')) take(one)
      return
    }
    if (head.includes('/') && !/^\/(?:usr|bin|sbin|System|Library\/Apple)\//.test(head)) take(head)
  })
  return found
}
// A path as written, with ~ and $HOME read and . and .. taken out, against the folder given
const pathOf = (path: string, home: string, folder: string) => {
  const full = path.replace(/^(?:~|\$HOME|\$\{HOME\})(?=\/|$)/, home)
  const parts: string[] = []
  for (const part of (full.startsWith('/') ? full : `${folder}/${full}`).split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return `/${parts.join('/')}`
}
// Files of the memory folder that only the mod writes: what chats share and answer one another through (live/), the update's lock
// and stamps, the reloads' marks; and the person's own settings and texts there (config.json, rules/, roles/), which work changes only
// with Edit or Write, so its card shows the change and waits for their press. A command is read as the boxes' guard reads it: a
// command that only reads counts only for what it sends into a file with >; this stops slips and common tricks, as that guard does
const MEMORY_READERS = [...BOX_READERS, 'cat', 'jq', 'diff', 'cmp', 'shasum', 'sha256sum', 'md5', 'md5sum']
const MEMORY_OWN = ['live', 'keys.md', 'keys.json', 'update.lock', 'update.json', 'update-folder.json', 'update-seen.json', 'reloads']
const MEMORY_PERSON = ['config.json', 'rules', 'roles']
const namesMemory = (text: string, names: readonly string[]) => {
  const words = BOX_WORDS(text)
  return words.some((word, i) => {
    if (!wordIs(word, '.claude') && word !== 'claude_config_dir') return false
    const j = words.slice(i + 1, i + 6).findIndex(one => wordIs(one, 'claudopus'))
    return j >= 0 && words.slice(i + 2 + j, i + 6 + j).some(one => names.some(name => wordIs(one, name)))
  })
}
const writesMemory = (text: string, names: readonly string[]): boolean => {
  const kept = shellWords(text.toLowerCase())
    .map(words => {
      const part = words.join(' ')
      if (!MEMORY_READERS.includes((words[commandAt(words)] ?? '').split('/').pop() ?? '')) return part
      return part.includes('>') ? part.slice(part.indexOf('>')) : ''
    })
    .join('\n')
  return namesMemory(kept, names) || (names === MEMORY_PERSON && /\brelease\.local\b/.test(kept))
}
const NO_MEMORY =
  "Only Claudopus writes the files chats share and answer one another through, and the update's own files: Claude never writes them with any tool."
const NO_MEMORY_BASH = () =>
  named("Claude changes {name}'s own settings and texts (config.json, the rules and roles in the memory folder, a repo's release.local) only with the Edit or Write tool, never with a command, so the change shows on the task's card and waits for {name} to press.")
const NO_BOXES =
  'Only the password and key runners use their boxes: Claude never writes into their folder or reads their keychain entries. Ask for a password only through the admin runner, and for a key only through the secret runner the task rules name.'
const NO_PUSH = 'Claude never pushes or merges to main itself, so two tasks never release at once: commit on your own branch and run the release runner the task rules name, from your worktree.'
// How long the names of kept keys are trusted before they are asked again
const SECRETS_MS = 60_000
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
const workHead = () => `What follows is what Claudopus tells Claude in every task started from a chat for ${person ? `${person}, the person` : 'the person'} you work for.`
const PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.'
const KEEP =
  "Keep every request the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output."
const KEEP_AGENTS = 'Keep the name or id of each background agent, with its topic and how far it has got.'
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
const PANEL_RULE =
  '{Name} follows this task in a panel beside the chat, as a card with its to-dos. Keep the card up to date as you work: with the `todo` tool (mcp__claudopus__todo), list what you set out to do, mark the one you are on, tick what is done and drop what a change of direction left behind; with the `note` tool (mcp__claudopus__note), say in one short line how far you have got whenever that changes. A message from {name} changes the to-dos first. Write these for someone who does not read code: say what each step is for, speak to {name} as "you", and use no file names, commands or code. When a step needs {name}\'s own hands or go-ahead, say so right away with the `ask` tool (mcp__claudopus__ask). If a panel tool replies that no hook answered it, the panel did not get it: continue without it for notes and to-dos, but for a question, end your turn right away with a report whose first line is the question.'
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
const AFAR_RULE =
  "## This chat runs on another Mac\n\n- I work from my own device and can't see this Mac's screen. Anything that needs my hands, I do from my own device: a sign-in by device code, or a link that works when I open it on my device. Never a browser, window, dialog or keychain prompt on this Mac, and nothing I would need to see its screen for. Give me a command only I can run in full, with its folder and full paths, so I can run it as it is in my own SSH session to this Mac; never open a terminal on this Mac for it."
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
const ASK_IN_CHAT = (title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  [
    `"${title}" has a question for you: ${ask.text}`,
    // The chat's notice is plain text: Markdown's marks for bold would show as they are
    ask.details ? `What it is about:\n${ask.details.replaceAll('**', '')}` : '',
    `Answers: ${answers.join(' · ')}, or reply in your own words, here or on its card.`,
    ask.copy ? `${ask.isCommand ? 'The command to type' : 'The text to paste'}: ${ask.copy}` : '',
    ask.pictures?.length ? `Pictures: ${ask.pictures.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
const ASK_RELAY = (id: string, title: string, ask: NonNullable<Todo['ask']>, answers: string[]) =>
  `In the background task "${title}", Claude asked {name} a question. {Name} sees it on the task's card and in this chat as a Claudopus notice, which you do not see: ${ask.text} (answers: ${answers.join(' · ')}${ask.details ? `; what it is about, which {name} sees in full with it on the card and in the notice: ${ask.details.length > DETAILS_IN_RELAY ? `${cut(ask.details, DETAILS_IN_RELAY)} (the rest is on the card)` : ask.details}` : ''}${ask.copy ? `; ${ask.isCommand ? 'the command to type' : 'the text to paste'}: ${ask.copy}` : ''}${ask.pictures?.length ? `; pictures: ${ask.pictures.join(', ')}` : ''}). {Name} already has it: do not pass it on${ask.details ? ' and do not repeat what it is about; at most say in one line that it is on the card' : ''}, do not answer it yourself, and do not start a task for it${ask.pictures?.length ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : ''}. When {name} answers it in this chat, send their words to that task with SendMessage to "${id}", in their words; its card then stops showing the question.`
// What the chat is told when an ask it was sent is answered on the card, or the work no longer needs it. The person sees the
// notice (isYou) and the chat's model reads it with the person named
const ASK_ANSWERED = (title: string, said: string, isYou = false) =>
  isYou ? `✓ You answered "${title}" on its card: ${said}. Claude has your answer.` : `✓ {Name} answered "${title}" on its card: ${said}. Claude already has the answer from the card, so it needs no second copy.`
// What the chat is told when it sends work an answer of the person's that reached it from the card a moment ago
const ANSWER_ALREADY_SENT = (said: string) => `Not sent: "${said}" is the answer {name} gave on that task's card. Claude already has it from there and has asked nothing since, so a second copy would only start it again. If {name} means those words for something new, send them with what they are for.`
// How long an answer given on the card counts as the one the chat would send again
const ANSWER_ECHO = 60 * 60_000
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
const ASK_REPLIED = (title: string, said: string, isYou = false) =>
  isYou
    ? `✓ You replied to "${title}" on its card: ${said}. Claude is working on it now, and will ask again if it still needs you.`
    : `✓ {Name} replied to "${title}" on its card: ${said}. Claude is working on it now, and will ask again if it still needs {name}.`
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
const REPLY_HOLDS = `That reply does not settle your question by itself: act on it. Their card shows your question with their reply under it, and nothing more to press or type while you work on it. Once it is settled, clear it with the \`ask\` tool and empty \`text\`; if it still needs them after you have done what they said, ask it again, which brings back its answers.`
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
const RESUMED_BY_ANSWER = `You had finished; this answer starts you again. Continue the task with it, then end with your report as before.`
// What the chat's model reads, and the person sees as a notice (isYou), when that work could not be started again with the answer
const ANSWER_FOR_CHAT = (title: string, asked: string, said: string, isYou = false) =>
  isYou
    ? `You answered, on its card, the question Claude asked in "${title}" after it finished (${asked}): ${said}. Claudopus couldn't start that task again, so your answer goes with your next message here.`
    : `{Name} answered, on its card, the question Claude asked in "${title}" after it finished (${asked}): ${said}. Claudopus couldn't start that task again, so the answer waits here for {name}'s next message.`
const ANSWER_FOR_CHAT_RELAY = `With {name}'s next message here, continue that task with this answer, as you would with their own words, alongside whatever that message asks.`
const ASK_CLEARED = (title: string) => `Claude no longer needs an answer for "${title}".`
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
const ANSWERED_IN_CHAT = (asked: string, words: string, isHeld = false, isWhole = true) =>
  `The message sent to you just now that carries {name}'s words "${words}" is {name}'s own reply, typed by them in the chat, to your question: "${asked}".${isWhole ? '' : ' Only those words are theirs: the chat wrote anything else in that message, not {name}.'} ${isHeld ? REPLY_HOLDS : 'Their card no longer shows the question.'} If it answers your question, take it as their answer and continue, and ask again if it leaves something open. If it asks for something else, decide whether it is more for this task, a new task to hand back with the \`note\` tool and its \`task\`, or a change in how you work, and say with the \`note\` tool what you did with it.`
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
const STEER = (words: string, isWhole = true) =>
  `${theirsAre(words, isWhole)} Stop: take no other step until you have thought about it. Decide which of three it is. More for this task: add it to your to-do list. A new task of its own: do not do it; hand it back with the \`note\` tool, with its \`task\` set to the request in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the \`note\` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and continue. Call it {name}'s message, by no other name.`
// Whose a message is that carries the person's words: the whole of it theirs only when it is their words and nothing more; else only
// the words quoted are theirs, and the rest is the chat's own, which carries none of their say
const theirsAre = (words: string, isWhole: boolean) =>
  isWhole
    ? `The message sent to you just now that carries {name}'s words "${words}" is from {name}, in their own words, typed by them in the chat.`
    : `The message sent to you just now carries {name}'s words "${words}", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, and none of it is {name}'s.`
// What the work is told when it has gone on after a steer without saying what it decided
// What work that had ended is told of the person's words that started it again: whose they are, nothing more
const WOKE = (words: string, isWhole = true) =>
  isWhole
    ? `The message that started you again, carrying {name}'s words "${words}", is from {name}, in their own words, typed by them in the chat.`
    : `The message that started you again carries {name}'s words "${words}", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, not {name}.`
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
const FROM = (sender: string, start: string) =>
  `The message sent to you just now that begins "${start}" is from ${sender}, not from {name}: that one is not theirs. Take it as ${sender}'s and continue; a message that carries {name}'s own words stays theirs.`
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
const STRETCH = 40
// Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
const wordsOnly = (text: string) => ` ${flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `
const carries = (message: string, words: string) => {
  const m = wordsOnly(message)
  const w = wordsOnly(words)
  if (!w.trim()) return false
  if (w.length <= STRETCH) return m.includes(w)
  const starts = [0, ...[...w].flatMap((c, i) => (c === ' ' ? [i + 1] : []))].filter(i => i + STRETCH <= w.length)
  return starts.some(i => m.includes(w.slice(i, i + STRETCH)))
}
// A message that is the person's words and nothing more, word for word: at most their name before them ("Sam: …", "Sam says …")
const isTheirsWhole = (message: string, words: string) => {
  const m = wordsOnly(message)
  const w = wordsOnly(words)
  if (!w.trim() || !m.includes(w)) return false
  const rest = m.replace(w, ' ').trim()
  const name = wordsOnly(who()).trim()
  return !rest || [name, `${name} says`, `${name} said`, `${name} wrote`].includes(rest)
}
const OWED =
  'A message from {name} is waiting for your decision, and you have kept working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.'
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
const drifted = (steps: number) =>
  `You have taken ${steps} steps since you last touched your to-dos or said how far you have got. In your next step, send the to-do calls that bring the list up to date (tick what is done, mark the one you are on as doing, add what you took on) and a \`note\` saying how far you have got, together with your next working call in that same step, never in a step of their own. If all of it is already up to date, continue.`
// The chat is told once when nothing new has come back under a piece of work for a while
const STUCK_IN_CHAT = (title: string, mins: number) =>
  `"${title}" hasn't made progress for ${mins} minutes: nothing new has come back to Claude or its helpers. It may be stuck waiting for something. Its card shows how far it has got.`
// A task that had stopped partway through a step without a report, restarted by Claudopus: what Claude is told, and what the chat is told
const RESTARTED_WORK = `From Claudopus, not {name}: you stopped partway through a step without a report (the app restarted, the Mac slept or a command was interrupted). First check what you already have, then continue from where you were; a command or helper you started may still be running, or may need starting again.`
const RESTARTED_IN_CHAT = (title: string, mins: number) =>
  `"${title}" had stopped partway through a step ${mins} minutes ago without a report, so Claudopus restarted it. Its card shows how far it has got.`
// Work the person stopped with their own press on Stop: what the chat, or the work above a helper, is told, as the engine's notice
// of the stop says only that it was stopped "by Claude"; what a call that would start it again is refused with; what their next
// message carries while some is stopped so. `left` lists what it started detached that goes on running
const STOPPED_BY_YOU = (title: string, id: string, left: string[] = []) =>
  `{Name} stopped "${title}" (${id}) with Stop on its card. {Name} stopped this, not you: do not restart it, message it or start the same task again unless {name} asks.${left.length ? ` Still running, because it was started detached: ${left.join('; ')}.` : ''} Do not mention the stop unless {name} asks.`
const STOPPED_REFUSED = (title: string) =>
  `Refused by Claudopus: {name} stopped "${title}" with Stop on its card. {Name} stopped this; do not restart it, message it or start the same task again unless {name} asks for that in a new message. Do not try another way.`
const STOPPED_EARLIER = (titles: string[]) =>
  `{Name} stopped ${titles.length === 1 ? 'this' : 'these'} earlier with Stop on ${titles.length === 1 ? 'its card' : 'their cards'}: ${titles.join('; ')}. Start ${titles.length === 1 ? 'it' : 'one'} again, message it or start the same task afresh only if this message asks for that.`
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
const OWED_AFTER = 2
const QUIET_STEPS = 12
const ASKS_SYSTEM = `You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.
First, one line per distinct thing the user asked for in this message, asides included. Each starts with "- ", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not a request: write no line for it. With no user message there are no such lines.
Then, when the reply reports a result, a finding or a decision, one line "did: <what was done or found, in at most 25 words, with the names and numbers that matter>". A reply that only acknowledges gets no such line.
Last, one line "title: <title>". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.`

// Config: the texts in force and the settings, kept keys' names, and the Config tab's acts (its drawing is in ../../mods/claudopus/hooks/config.tsx)

// ---- Config: the texts in force and the settings (the tab and its pure parts are in ./config) ----

// The person's own copy of one of the three texts the mod ships (TEXTS in ./config), each written at its own fixed place in the
// memory folder; the Config tab is the only writer, and nothing else is written there
async function writeOwnText($: EngineInterface, memory: string, path: string, text: string) {
  await personWrote($, memory, path, text)
  if (path === 'rules/CLAUDE.md') return $.fs.write(`${memory}/rules/CLAUDE.md`, text)
  if (path === 'roles/chat.md') return $.fs.write(`${memory}/roles/chat.md`, text)
  if (path === 'roles/work.md') return $.fs.write(`${memory}/roles/work.md`, text)
  throw new Error(`${path} is not one of the texts Claudopus ships`)
}
// The text in force: the person's own copy when it holds anything, the shipped one otherwise
async function inForce($: EngineInterface, root: string, memory: string, path: string) {
  // What is read is what is known: a change made since is never read, and is put back
  const own = memory ? await personText($, memory, path) : ''
  const shipped = await readOr($, `${root}/${path}`)
  // A copy the same as what shipped is no change of the person's
  // A copy made before an update can lack a place the shipped text now fills (a setting such as the models): it is stale
  const places = (text: string) => new Set(text.match(/\{[a-z]+\}/gi) ?? [])
  const isStale = (own: string) => [...places(shipped)].some(place => !places(own).has(place))
  if (own.trim() && own.trim() !== shipped.trim()) return { text: own, path: `${memory}/${path}`, isOwn: true, isStale: isStale(own) }
  return { text: shipped, path: `${root}/${path}`, isOwn: false, isStale: false }
}

async function readConfig($: EngineInterface, memory: string) {
  return parse(await personText($, memory, 'config.json'))
}
// Sets one key, or with undefined puts it back to what shipped; every other key, ones this tab does not know included, is kept
async function setConfig($: EngineInterface, memory: string, key: keyof Config, value: unknown, role?: Role) {
  // A change is made on what is known, never on a copy changed since
  const path = `${memory}/config.json`
  const text = await personText($, memory, 'config.json')
  const config = (() => {
    try {
      return JSON.parse(text || '{}') as Record<string, unknown>
    } catch {
      return undefined
    }
  })()
  // A file that does not parse is someone's edit under way: it is left as it is
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('config.json is not valid JSON')
  if (key === 'models' && role) {
    const models = { ...((config.models as Record<string, unknown>) ?? {}) }
    if (value === undefined) delete models[role]
    else models[role] = value
    if (Object.keys(models).length) config.models = models
    else delete config.models
  } else if (value === undefined) delete config[key]
  else config[key] = value
  await personWrote($, memory, 'config.json', `${JSON.stringify(config, null, 2)}\n`)
  await $.fs.write(`${memory}/config.json`, `${JSON.stringify(config, null, 2)}\n`)
}

async function openedInEditor($: EngineInterface, path: string) {
  // The text editor the Mac opens .md files in; elsewhere the desktop's own opener
  const r = await openOn($, path, true)
  return r.exitCode === 0 ? '' : r.stderr || 'no editor opened'
}
// Edit: the person's own copy, made from the shipped text the first time, opened in their editor
async function editText($: EngineInterface, root: string, memory: string, path: string) {
  const own = `${memory}/${path}`
  if (!(await personText($, memory, path)).trim()) await writeOwnText($, memory, path, await readOr($, `${root}/${path}`))
  return openedInEditor($, own)
}
// Put back: the person's copy moves aside as .old, and the shipped text is in force again
async function putBack($: EngineInterface, memory: string, path: string) {
  const own = `${memory}/${path}`
  // Each copy put back is kept under a name of its own, so a second Reset never loses the first
  const at = new Date(await $.clock.now()).toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  await personWrote($, memory, path, null)
  const r = await $.process.run(['mv', '-n', own, `${own}.${at}.old`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return r.exitCode === 0 ? '' : r.stderr || 'could not be undone'
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
let secrets = { at: -SECRETS_MS, names: [] as string[], isAdminKept: false }
// The names of the kept keys, and whether an admin password is kept, read again at most every SECRETS_MS (and with each use of a
// runner): a list that cannot be read keeps what was known before, so hiding never stops on a failure
const knowKept = async ($: EngineInterface, isNow = false) => {
  const now = await $.clock.now()
  if (now - secrets.at < SECRETS_MS && !isNow) return secrets
  const listed = await $.process.run([`${$.plugin.root}/bin/secret`, '--list']).catch(() => undefined)
  const admins = await $.process.run([`${$.plugin.root}/bin/keyring`, 'list', 'claudopus-admin']).catch(() => undefined)
  if (listed?.exitCode === 0) secrets = { at: now, names: listed.stdout.split('\n').filter(Boolean), isAdminKept: admins?.exitCode === 0 ? Boolean(admins.stdout.trim()) : secrets.isAdminKept }
  return secrets
}
// A JSON text with every kept value hidden inside its strings, kept admin passwords too; undefined when it could not be checked
const hiddenJson = async ($: EngineInterface, text: string) => {
  const { names, isAdminKept } = await knowKept($)
  if (!names.length && !isAdminKept) return text
  const hidden = await $.process.run([`${$.plugin.root}/bin/secret`, '--hide', '--json', ...names], { stdin: text }).catch(() => undefined)
  return hidden && hidden.exitCode === 0 && !hidden.isStdoutTruncated && hidden.stdout.trim() ? hidden.stdout : undefined
}
async function hideKept($: EngineInterface, e: ToolCallInput, r: ToolCallResult): Promise<ToolCallResult> {
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  if (r.deny || OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return r
  const { names, isAdminKept } = await knowKept($, command.includes('bin/secret') || command.includes('bin/admin'))
  if (!names.length && !isAdminKept) return r
  try {
    const text = JSON.stringify({ result: r.result, context: r.context })
    const hidden = await hiddenJson($, text)
    if (hidden === undefined) throw new Error('not hidden')
    if (hidden === text) return r
    const swapped = JSON.parse(hidden) as { result: typeof r.result; context: typeof r.context }
    return { ...r, result: swapped.result, context: swapped.context } as ToolCallResult
  } catch {
    return { deny: `${e.tool} ran, but Claudopus withheld its output because it couldn't check it for saved keys.` }
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
// Check now as it stands in this chat: under way, and what the last press found, kept until the next press
const updateCheck = { isChecking: false, said: '', isError: false }
const configShown = async ($: EngineInterface): Promise<ConfigShown> => ({
  version: (await versionsOf($).catch(() => ({ version: '' }))).version,
  check: { ...updateCheck },
  updates: await (async () => {
    const known = await knowSource($).catch(() => undefined)
    const stamp = stampOf(await readOr($, lookedPath()))
    return {
      where: known ? `${known.where}${known.cannot ? `. ${known.cannot.why.replace(/^./, c => c.toUpperCase())}` : ''}` : '',
      lookedAt: stamp?.at ?? 0,
      seen: isVersion(stamp?.version) ? stamp.version : '',
      now: await $.clock.now(),
    }
  })(),
  texts: await Promise.all(
    TEXTS.map(async text => {
      const { isOwn, isStale, path, text: body } = await inForce($, $.plugin.root, dir, text.path)
      return { text, isOwn, isStale, path, body }
    }),
  ),
  config: await readConfig($, dir),
  gate: await (async () => {
    const [gate, kept] = [await gateOf($), await validAllowed($)]
    return { mode: gate.mode, unsealed: gate.unsealed, allowed: kept.valid.map(({ host, command }) => ({ host, command })), unsealedAllowed: kept.unsealed, isAfar: isRunFromAfar, isLinux }
  })(),
  // A config.json that does not read is said at once: until it is fixed every setting is as shipped
  failed:
    configFailed ||
    (await readOr($, `${dir}/config.json`).then(text => {
      try {
        JSON.parse(text || '{}')
        return ''
      } catch {
        return `${dir}/config.json is not valid JSON, so Claudopus uses the default for every setting. Fix it or delete it.`
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
    }),
  // Admin commands: each choice is sealed as it is made, and one that takes something back makes every earlier seal void
  gateMode: (mode: 'each' | 'work' | 'never') => configAct($, 'Not saved', () => regate($, { mode })),
  gateRemove: (host: string, command: string) => configAct($, 'Not removed', () => regate($, { remove: { host, command } })),
  // How often the look runs, or only at Check now: one choice, written as the two keys
  lookEvery: (hours: number) =>
    configAct($, 'Not saved', async () => {
      await setConfig($, dir, 'updates', hours ? undefined : false)
      await setConfig($, dir, 'updateEvery', hours && hours !== 1 ? hours : undefined)
    }),
  // A press while a check runs does nothing: the tab shows it checking. It only looks; the panel offers what it found
  check: () => {
    if (updateCheck.isChecking) return
    presses += 1
    Object.assign(updateCheck, { isChecking: true, said: '', isError: false })
    redraw($)
    void checkNow($)
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
// What the person allowed it under "Ask once per piece of work" ends with it
// A reply its ask was held with has been acted on once the run it started ends: the ask waits on the person again, every answer back
const ended = (one: Todo, status: Todo['status'], at: number): Todo => (workAllowed.delete(one.id), { ...one, ...(one.ask?.replied?.isWaking ? { ask: { ...one.ask, replied: { text: one.ask.replied.text, at: one.ask.replied.at } } } : {}), status, endedAt: at, bg: undefined, waitsSince: undefined })
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
const resumed = (one: Todo, at: number): Todo => ({ ...one, byYou: undefined, begunAt: one.begunAt ?? one.startedAt, ask: one.ask?.replied?.isWaking ? { ...one.ask, replied: { text: one.ask.replied.text, at: one.ask.replied.at } } : one.ask, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, answeredAt: undefined, handedBackAt: undefined, leftSince: undefined, stuckAt: undefined, waitsSince: undefined, newAt: at })
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
// Work the person stopped, by what it left running detached, until the chat has been told of the stop
const stopLeft = new Map<string, string[]>()
// Held stopped by the person: stopped with their own press, and no message of theirs has come since
const isHeld = (one: Todo | undefined) => Boolean(one?.byYou && !one.byYou.isLifted)
// The words a task is named by, to know the same work started afresh under another title
const taskWords = (text: string) => new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(word => word.length > 2 && !['the', 'and', 'for', 'with', 'from', 'that', 'this'].includes(word)))
const isSameTask = (held: Todo, title: string, prompt: string) => {
  const a = taskWords(held.title)
  const b = taskWords(title)
  const shared = [...a].filter(word => b.has(word)).length
  // Only the same few words count: titles that share most words can still be other work
  const isNamed = a.size > 0 && shared === a.size && shared === b.size
  // A brief that carries the message the stopped work was started for is that work again
  const words = held.words.trim()
  const isQuoted = words.length >= 12 && prompt.replace(/\s+/g, ' ').includes(words.replace(/\s+/g, ' ').slice(0, 200))
  return isNamed || isQuoted || prompt.includes(held.id)
}
// A start or a message that would set work the person stopped going again: the stopped work it would wake, or undefined
// `resume` is the agent it resumes or messages; `parent` the work that starts it, '' for the chat
const heldFor = (list: Todo[], parent: string, resume: string, title: string, prompt: string) =>
  resume
    ? // By its id, the start of its id, or its title, as SendMessage takes any of them
      list.find(one => isHeld(one) && (one.id === resume || (resume.length >= 6 && one.id.startsWith(resume)) || oneLine(one.title).toLowerCase() === oneLine(resume).toLowerCase()))
    : list.find(one => isHeld(one) && (one.parentId || '') === parent && isSameTask(one, title, prompt))
// Work that ended with nothing of its own running that the mod or the engine's stop knew of: the engine still listing it as held
// (once, for a whole evening, on nothing any tool showed open) is no sign it left something running
const leftNothing = new Set<string>()
// Nothing of its own runs: no command or watch it started that has not ended, no detached run it is followed on, no helper at work. The engine's list of what is in
// flight as work stops is the whole session's, every other work's too, so it says nothing of this work's own (what it lists that
// this work started is let go of from its card as it ends, at its stop)
const ownsNothing = (list: Todo[], id: string) => !list.find(one => one.id === id)?.bg?.length && !list.find(one => one.id === id)?.detached?.length && !list.some(kid => kid.parentId === id && kid.status === 'working')
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
// A branch that is a job its helper (`one`) has running carries the job
type Branch = { one: Todo; kids: Branch[]; job?: Job }
// The helpers under a piece of work that `keep` picks, each with its own; one that is not picked stays while one under it is
const branchesOf = (list: Todo[], id: string, keep: (one: Todo) => boolean, depth = 1): Branch[] =>
  depth > TREE_DEEP ? [] : kidsOf(list, id).map(one => ({ one, kids: branchesOf(list, one.id, keep, depth + 1) })).filter(b => keep(b.one) || b.kids.length > 0)
// One row of the tree: how deep it is, which of the levels above it still have a row to come (their line runs on past it),
// whether it is the last under its parent, and whether rows of its own follow
type Twig = { one?: Todo; job?: Job; depth: number; rails: boolean[]; isLast: boolean; hasKids: boolean }
// The rows in the order they are drawn; `isMore` says a closing row follows the top level's last
const twigsOf = (branches: Branch[], isMore = false, depth = 1, rails: boolean[] = []): Twig[] =>
  branches.flatMap((b, i) => {
    const isLast = i === branches.length - 1 && !isMore
    return [{ one: b.one, ...(b.job ? { job: b.job } : {}), depth, rails, isLast, hasKids: b.kids.length > 0 }, ...twigsOf(b.kids, false, depth + 1, [...rails, !isLast])]
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
const twigSvg = (t: Twig, line: number, dot: string, isMoving = false, shape: 'circle' | 'square' | 'diamond' | 'down' | 'open' = 'circle') => {
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
  // A job's mark is its own shape, so only a helper has a round dot
  const shaped = {
    circle: `<circle cx="${at}" cy="${mid}" r="3.5" fill="${dot}"/>`,
    square: `<rect x="${at - 3.5}" y="${mid - 3.5}" width="7" height="7" rx="1" fill="${dot}"/>`,
    diamond: `<path d="M${at} ${mid - 4.5}L${at + 4.5} ${mid}L${at} ${mid + 4.5}L${at - 4.5} ${mid}Z" fill="${dot}"/>`,
    down: `<path d="M${at - 4.5} ${mid - 3.5}H${at + 4.5}L${at} ${mid + 4}Z" fill="${dot}"/>`,
    open: `<path d="M${at} ${mid - 4}L${at + 4} ${mid}L${at} ${mid + 4}L${at - 4} ${mid}Z" fill="none" stroke="${dot}" stroke-width="1.5"/>`,
  }[shape]
  const mark = dot
    ? `${isMoving ? ring : ''}${shaped}`
    : `<circle cx="${at}" cy="${mid}" r="3" fill="none" stroke="#808080" stroke-width="1.5"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${twigWidth(t)}" height="${line}" viewBox="0 0 ${twigWidth(t)} ${line}"><path d="${paths.join('')}" fill="none" stroke="#808080" stroke-opacity="0.7" stroke-width="1.5"/>${mark}</svg>`
}

// The same tree's lines carried down past a row, for a second line of its own: the levels above that go on, and its own line when
// rows under the same parent follow
const railSvg = (t: Twig, line: number) => {
  const x = (level: number) => level * TWIG_STEP + 9
  const paths = [...t.rails.flatMap((isOn, level) => (isOn ? [`M${x(level)} 0V${line}`] : [])), ...(t.isLast ? [] : [`M${x(t.rails.length)} 0V${line}`])]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${twigWidth(t)}" height="${line}" viewBox="0 0 ${twigWidth(t)} ${line}"><path d="${paths.join('') || 'M0 0'}" fill="none" stroke="#808080" stroke-opacity="0.7" stroke-width="1.5"/></svg>`
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
  await changeTodos($, list => {
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
            card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle' && !cutPending.has(card.id)
            ? ended(card, 'done', now)
          : // Work that handed in its report and that the engine still holds on its own background work left something running;
            // once nothing does, or it was stopped, not
            !card.parentId && card.status === 'done' && (one.status === 'waiting' && endedByHandback.has(card.id) && !stoppedHere.has(card.id) && !leftNothing.has(card.id)) !== Boolean(card.leftSince)
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
  await saveKeep($).catch(err => log($, `work at work not kept for the keeper: ${String(err)}`))
}

// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
const change = async ($: EngineInterface, agentId: string, fn: (one: Todo, at: number) => Todo) => {
  const now = await $.clock.now()
  if (!(await read($, todos)).some(one => one.id === agentId)) await sync($)
  await changeTodos($, list => {
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
  const before = await read($, todos)
  const card = before.find(one => one.id === id)
  // A press on Stop is the person's own stop, kept on the card so a reload keeps it too: what was already finished stays finished
  const isYours = Boolean(card && card.status === 'working' && !card.answeredAt)
  // Its helpers and the commands it, or they, started in the background end with it; what it started detached goes on and is named
  const under = [card, ...underOf(before, id)].filter((one): one is Todo => Boolean(one))
  await stopHelpers($, id)
  if (isYours) for (const b of under.flatMap(one => one.bg ?? [])) await $.tool.call({ tool: 'TaskStop', task_id: b.id }).catch(() => undefined)
  const left = isYours ? under.flatMap(one => one.detached ?? []).map(d => `${d.what || cut(d.cmd, 80)}${d.pid ? ` (process ${d.pid})` : ''}, its log ${d.log}`) : []
  // Answers that were on their way to it before the stop are dropped: none wakes it
  if (isYours) for (let at = wakes.length - 1; at >= 0; at -= 1) if (under.some(one => one.id === wakes[at]?.target)) wakes.splice(at, 1)
  const now = await $.clock.now()
  // What finished work left running is stopped with it
  await changeTodos($, list =>
    list.map(one =>
      one.id === id && one.status === 'working'
        ? { ...ended(one, stoppedAs(one), now), ...(isYours ? { byYou: { at: now }, ask: undefined } : {}) }
        : isYours && one.id !== id && under.some(kid => kid.id === one.id) && one.status !== 'done'
          ? // Its helpers, stopped with it, are held with it
            { ...(one.status === 'working' ? ended(one, 'stopped', now) : one), byYou: { at: now } }
        : one.id === id && one.leftSince
          ? { ...one, leftSince: undefined }
          : one,
    ),
  )
  // A helper stopped so: the work above it is told in its own chat; the chat is told as the engine's notice of the stop comes
  if (isYours && card?.parentId && card.parentId !== HELPER) await tell($, card.parentId, named(STOPPED_BY_YOU(titleOf(card), id, left)))
  if (isYours && card && !card.parentId) stopLeft.set(id, left)
  await keepStoppedReports($, now)
  await lookEnds($)
}

// Work the person stopped, started again by their press on its card: a message from the panel in their name, which lifts the hold
const startAgain = async ($: EngineInterface, id: string) => {
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || one.status !== 'stopped' || !one.byYou) return
  const target = one.parentId && one.parentId !== HELPER ? `the task "${titleOf((await read($, todos)).find(todo => todo.id === one.parentId) ?? one)}" (${one.parentId}), to start again its helper` : 'the task'
  await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "Start again" on "${titleOf(one)}" (${id}), which they had stopped. Start it again: send ${target} "${titleOf(one)}" (${id}) a message with SendMessage so it continues from where it stopped.`)
}

// Moves running work to another model: its card names it at once, each step it sends from now on goes to it, and the work is
// told in its own chat, where the panel shows the change as a line of its own
const choose = async ($: EngineInterface, id: string, model: string) => {
  await update($, view, v => ({ ...v, picking: '' }))
  const one = (await read($, todos)).find(todo => todo.id === id)
  if (!one || one.status !== 'working' || modelName(one.chosen ?? one.model ?? '') === modelName(model)) return
  await changeTodos($, list => list.map(todo => (todo.id === id ? { ...todo, model, chosen: model } : todo)))
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
  const sign = ended.map(one => [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title, one.byYou ? `${one.byYou.at}${one.byYou.isLifted ? 'l' : ''}` : ''].join(':')).join(',')
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
    await changeTodos($, now => capped(byEnd([...found.filter(one => !now.some(card => card.id === one.id && !isBare(card))), ...now.filter(card => !(isBare(card) && found.some(one => one.id === card.id)))])))
}

// What was kept comes back into the list when the chat loads, below anything the list already holds
const loadFinished = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id) return
  const kept = JSON.parse((await readOr($, finishedPath(id))) || '[]') as Todo[]
  if (!Array.isArray(kept) || !kept.length) return
  await changeTodos($, list => {
    // What it left running is looked at afresh: the record of how it ended does not outlive the load
    const fresh = kept.filter(one => one.id && one.status !== 'working' && !list.some(card => card.id === one.id)).map(one => ({ ...one, leftSince: undefined, stuckAt: undefined, bg: undefined, waitsSince: undefined }))
    return fresh.length ? capped(byEnd([...fresh, ...list])) : list
  })
}

const follow = async ($: EngineInterface) => {
  await sync($)
  await lookJobs($).catch(err => log($, `jobs not read: ${String(err)}`))
  await lookStuck($).catch(err => log($, `stuck work not looked for: ${String(err)}`))
  await lookInDue($).catch(err => log($, `helpers not looked in on: ${String(err)}`))
  await writeRolls($).catch(err => log($, `helpers not written: ${String(err)}`))
  await saveFinished($).catch(err => log($, `finished work not kept: ${String(err)}`))
  const isShown = (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST)
  if (isShown !== (await read($, paneShown))) await update($, paneShown, () => isShown)
  // Reports another chat kept since are listed here too
  await loadReports($).catch(() => undefined)
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
const titleOf = (one: Todo) => one.title || quoted(one.words, 60) || 'Background task'
const openWork = ($: EngineInterface, id: string) => {
  presses += 1
  void comingTab((async () => {
    const there = await read($, others)
    const one = [...(await read($, todos)), ...cardsOf(there), ...helpersOf(there)].find(card => card.id === id)
    if (!one) return
    // A tab opened afresh starts folded; one already open keeps what was unfolded in it
    if (!(await $.ui.panes()).some(pane => pane.id === workPaneOf(id))) (folds.delete(id), pictureIn.delete(workPaneOf(id)))
    await front($, workPaneOf(id), cut(titleOf(one), 30))
    // The pressed card's button gets a new name, so the app does not hold the list where that button was
    redraw($)
  })()).catch(err => log($, `details of ${id} not opened: ${String(err)}`))
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
  // Its own value, which only the Servers tab reads: the panel is not drawn again with it
  await update($, servers, list => [...list])
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
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

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
// A file a report names is a path inside its own folder: never absolute, never one that climbs out with .., whoever wrote it (a
// report another Mac handed over included)
const isInside = (file: unknown): file is string =>
  typeof file === 'string' && Boolean(file) && !file.startsWith('/') && !file.startsWith('~') && !file.includes('\0') && file.split('/').every(part => part !== '..' && part !== '')
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
      found.push({ ...one, subject: one.subject || one.title, gist: (one.agent && gists.get(one.id)) || one.gist || '', files: Array.isArray(one.files) ? one.files.filter(isInside) : [] })
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
  if (one.waits?.length) await changeTodos($, list => list.map(card => (card.id === one.id ? { ...card, waits: undefined } : card)))
  await loadReports($)
}

// The small copy of a picture the panel draws, kept beside the report
const thumbPath = (r: Report, file: string) => `${reportPath(r)}/thumbs/${file.replaceAll('/', '--')}.jpg`
// A picture is read only where it really is inside its report's folder: no link along its path leads anywhere else
const INSIDE = 'f=$1; d=$(cd -P "$2" 2>/dev/null && pwd) || exit 1; p=$(cd -P "$(dirname "$f")" 2>/dev/null && pwd) || exit 1; [ ! -L "$f" ] && [ -f "$f" ] || exit 1; case "$p/" in "$d"/*) exit 0 ;; esac; exit 1'
const makeThumbs = async ($: EngineInterface, r: Report) => {
  for (const file of r.files.filter(one => RASTER.test(one) && isInside(one))) {
    const to = thumbPath(r, file)
    if (await $.fs.exists(to)) continue
    if ((await $.process.run(['sh', '-c', INSIDE, 'sh', `${reportPath(r)}/${file}`, reportPath(r)]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) continue
    await $.process.run(['mkdir', '-p', `${reportPath(r)}/thumbs`])
    for (const size of THUMB_SIZES) {
      await $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', `${reportPath(r)}/${file}`, '--out', to])
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
    const sized = (await $.process.run([sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', path])).stdout
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
    ? `Results saved (what finished tasks left for ${who()} to read or act on), newest first (title · topic · when · its file${list.some(waits) ? ' · what in it is waiting on them' : ''}):\n${list
        .slice(0, REPORTS_TOLD)
        .map(r => `- ${[cut(r.title, 70), cut(r.subject, 40), `${dated(r.at, now)} (${ago(r.at, now)})`, `${reportPath(r)}/report.md`, waits(r) ? `waiting on: ${openWaits(r).map(one => cut(one.text, 120)).join(' / ')}` : ''].filter(Boolean).join(' · ')}`)
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
    'Last, record each stream found as a topic with the `update` tool (its name, folder, state and summary, and its section as `brief`), and list the topics you found in a few lines.',
  ].join(' ')
const indexOldChats = async ($: EngineInterface) => {
  await closeWelcome($)
  await sendForPerson($, indexAsk($.plugin.root))
}
const welcomeCard = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="welcome" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Text bold wrap="wrap">Welcome to Claudopus</ui.Text>
    <ui.Text wrap="wrap">Each message you send in a chat starts a background task, and its card shows here while it runs.</ui.Text>
    <ui.Text wrap="wrap">Closed this panel? Type /claudopus to bring it back.</ui.Text>
    <ui.Text bold wrap="wrap">Bring in your old chats</ui.Text>
    <ui.Text wrap="wrap">Claudopus can read your past Claude Code chats on {thisMac()} into its memory, so it knows what you were working on. It runs as a background task and takes a few minutes.</ui.Text>
    <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
      <ui.Button key={`welcome-index-${presses}`} label="Index my old chats" onPress={() => void indexOldChats($).catch(err => log($, `old chats not indexed: ${String(err)}`))} />
      <ui.Button key={`welcome-later-${presses}`} label="Not now" plain dimColor onPress={() => void closeWelcome($).catch(err => log($, `welcome not put away: ${String(err)}`))} />
    </ui.Box>
  </ui.Box>
)

// The Results tab and each result's own tab: the list, a result drawn whole, put away and brought back

// Puts a line naming the report in the chat's box, for the person to finish and send; where there is no box, nothing is sent for them
const carryOn = async ($: EngineInterface, r: Report, now: number) => {
  const text = `Continue from the result "${r.title}" (${dated(r.at, now)}), ${reportPath(r)}/report.md: `
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
  if (said !== 'Not now') await sendForPerson($, `From the Claudopus panel: ${who(true)} pressed "${said}" to answer the question in the result "${r.title}" (${dated(r.at, now)}): ${wait.text}\nThe result: ${reportPath(r)}/report.md`)
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
// A number for what one pane's drawing shows, for its buttons' keys: it moves each time that drawing differs from the one before
const drawings = new Map<string, { look: string; n: number }>()
const drawingMark = (pane: string, shown: unknown[]) => {
  const look = JSON.stringify(shown)
  const was = drawings.get(pane)
  if (was?.look === look) return String(was.n)
  // The first number of a load starts past any key an earlier load drew, so a pane that stayed up across a reload is taken afresh
  const n = (was?.n ?? presses * 1000) + 1
  drawings.set(pane, { look, n })
  return String(n)
}
const redraw = ($: EngineInterface) => drawAgain($)
// Opens a pane from a press, in front: the app leaves a pane already open where it is, behind another tab, so one open but not
// shown is opened again
// The tabs as the engine lists them, one word each: id, then s shown, f holding the keyboard, p drawn, for the log
const rosterOf = (panes: readonly { id: string; isShown: boolean; isFocused: boolean; isPlaced: boolean }[]) =>
  panes.map(pane => `${pane.id}:${pane.isShown ? 's' : ''}${pane.isFocused ? 'f' : ''}${pane.isPlaced ? 'p' : ''}`).join(' ') || 'none'
// A button's onPress runs with the handle of the drawing it sits in, which the engine never counts as the person asking: a narrow
// terminal (under 144 columns, a phone over ssh) left every tab a press opened undrawn, and the panel, opened again to take back the
// keys, vanished with it. So while a press of the mod's in the terminal is answered, a tab move is handed to that press's own
// `ui.press` hook (tabHooks), whose handle the engine counts as the person's, and done there
const tabMoves = tabMoveQueue()
const comingTab = (opening: Promise<void>) => tabMoves.coming(opening)
const front = async ($: EngineInterface, id: string, title: string) => {
  if (tabMoves.isPressing()) return tabMoves.handOver({ kind: 'front', id, title })
  await frontAsked($, id, title)
}
// What a press's hook does with a move handed over, by its own handle
const runTabMove = ($: EngineInterface, move: TabMove) => (move.kind === 'front' ? frontAsked($, move.id, move.title) : backAsked($, move.id))
const frontAsked = async ($: EngineInterface, id: string, title: string) => {
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
  void watchTabs($, [id], 'it opened').catch(() => undefined)
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
  void comingTab((async () => {
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
  })()).catch(err => log($, `report ${id} not opened: ${String(err)}`))
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
const openReports = ($: EngineInterface) => {
  presses += 1
  return comingTab(
    (async () => {
      reportsListed = (await read($, reports)).map(r => r.id)
      redraw($)
      await front($, REPORTS_PANE, REPORTS_TITLE)
    })(),
  )
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
const reportsView = ($: EngineInterface, ui: Ui, all: Report[], now: number, line: number, height = 0) => {
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
  // The app keeps each button it drew by its key, with the handle of its first drawing; the engine gives every button a new handle
  // whenever anything in the drawing changes (a result arriving, a fold, a time). A key that stayed then pressed a dead handle and
  // nothing opened, press after press. So every key here carries a mark of what the drawing shows, which moves whenever it changes
  const gen = drawingMark(REPORTS_PANE, [presses, line, height, fresh, isEarlierOpen, isArchivedOpen, 'isTerminal' in ui, ...[waiting, recent, earlier, gone].map(group => group.map(entry => (entry[0] ? `${entry[0].id}|${entry[0].title}|${when(entry[0].at, now)}` : '')))])
  const fold = (key: string, label: string, isOpen: boolean, onPress: () => void) => (
    <Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" alignItems="flex-start" flexShrink={0}>
      {/* In the rows' title column */}
      <Box width={1} flexShrink={0} />
      <Button key={`${key}-${gen}`} label={`${isOpen ? '▾' : '▸'} ${label}`} plain dimColor onPress={() => void ((presses += 1), onPress(), redraw($))} />
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
            <Button key={`report-${r.id}-${gen}`} label={cut(r.title, line - (digit ? 25 : 22))} plain hotkey={digit} onPress={() => openReport($, r.id)} />
          </Box>
        </Box>
        <Box width={6} flexShrink={0} justifyContent="flex-end">
          <Text dimColor>{when(r.at, now)}</Text>
        </Box>
        <Button key={`archive-${r.id}-${gen}`} label="Archive" plain dimColor onPress={() => archiveReport($, r, true)} />
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
        {fresh ? <Button key={`reports-fresh-${gen}`} label={`Show ${fresh} new`} onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
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
                      <Button key={`report-${r.id}-${gen}`} label={cut(r.title, line - 24)} plain dimColor onPress={() => openReport($, r.id)} />
                    </Box>
                    <Box width={6} flexShrink={0} justifyContent="flex-end">
                      <Text dimColor>{when(r.at, now)}</Text>
                    </Box>
                    <Button key={`unarchive-${r.id}-${gen}`} label="Bring back" plain onPress={() => archiveReport($, r, false)} />
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
const reportShown = ($: EngineInterface, ui: Ui, r: Report, text: string, list: Report[], now: number, at: number, thumb: Thumb, height = 0) => {
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
  // As in the list: each key carries a mark of what this drawing shows, so the app never keeps a button whose handle is gone
  const gen = drawingMark(pane, [presses, height, r, mark(text), at, thumb?.source.length ?? 0, ...pictures.map(one => pictureSaid.get(one.path) ?? null), dated(r.at, now), 'isTerminal' in ui, ...kin.map(one => `${one.id}|${one.title}|${dated(one.at, now)}|${how(one)}`)])
  const show = (to: number) => void ((presses += 1), pictureAt.set(pane, to), redraw($))
  return (
    <Box key={`report-${r.id}`} flexDirection="column" gap={1} flexGrow={1}>
      {/* Archive at the head's right: pressed, the tab closes; one archived says so, with Bring back */}
      <Box key="report-head" flexDirection="row" alignItems="flex-start" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold wrap="wrap">{r.title}</Text>
          <Text dimColor wrap="wrap">{[dated(r.at, now), r.subject && slug(r.subject) !== slug(r.title) ? r.subject : '', r.archived ? 'archived' : answeredOf(r)].filter(Boolean).join(' · ')}</Text>
        </Box>
        <Button key={`report-archive-${gen}`} label={r.archived ? 'Bring back' : 'Archive'} onPress={() => archiveReport($, r, !r.archived)} />
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
                        <Button key={`report-say-${index}-${said}-${gen}`} label={said} onPress={() => void ((presses += 1), answerWait($, r, index, said, now).catch(err => log($, `answer not kept: ${String(err)}`)))} />
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
                    <Button key={`report-pic-open-${n}-${gen}`} label={one.file} plain hotkey={n < 9 ? String(n + 1) : undefined} onPress={press => void showPicture($, one.path, '', '', press.surface)} />
                    {pictureSaidRow($, ui, `report-pic-said-${n}-${gen}`, one.path)}
                  </Box>
                ))}
                <Text dimColor wrap="wrap">{termFrom ? 'Press a picture to send it to the device you’re using' : 'Press a picture to open it'}</Text>
              </Box>
            ) : (
            <Box flexDirection="column" gap={1}>
              {thumb && table.Svg ? <table.Svg key={`report-picture-${r.id}-${at}`} source={thumb.source} alt={pictures[at]?.file ?? 'Picture'} /> : null}
              {/* Shown here, never handed to another app: that would take the person out of Claude and switch their desktop. Where the
                  picture cannot be drawn, its path is given as text */}
              <Text dimColor wrap="wrap">{thumb && table.Svg ? (pictures[at]?.file ?? '') : (pictures[at]?.path ?? '')}</Text>
              {pictures.length > 1 ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="center" gap={1}>
                  <Button key={`report-prev-${gen}`} label="‹ Previous" onPress={() => show((at + pictures.length - 1) % pictures.length)} />
                  <Button key={`report-next-${gen}`} label="Next ›" onPress={() => show((at + 1) % pictures.length)} />
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
        'Continue',
        '',
        <Box flexDirection="column" alignItems="flex-start" gap={1}>
          <Text dimColor wrap="wrap">Claudopus puts a line naming this result in the chat's box, for you to finish and send.</Text>
          <Button key={`report-carry-${gen}`} label="Continue from this" onPress={() => void ((presses += 1), redraw($), carryOn($, r, now))} />
          {kin.length ? (
            <Box flexDirection="column" alignItems="flex-start">
              {kin.map(one => (
                <Button key={`report-kin-${one.id}-${gen}`} label={[dated(one.at, now), one.title, how(one)].filter(Boolean).join(' · ')} plain dimColor onPress={() => openReport($, one.id)} />
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
  void comingTab((async () => {
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
  })()).catch(err => log($, `memory file ${path} not opened: ${String(err)}`))
}

// Memory: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
// A terminal, or a chat run over ssh, has no Finder the person can see: there the folder opens as a tab of the panel, each file a link
const showMemory = async ($: EngineInterface, surface: RenderSurface) => {
  if (isRunFromAfar || surface === 'terminal' || !hasDesktop) return openMemory($, dir)
  const opened = await openOn($, dir)
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
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

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
      return { id: f.id, kind: (meta.spawnDepth ?? 1) > 1 ? 'helper' : 'work', parent: meta.parentAgentId ?? '', title: meta.description ?? 'Background task', isFinished: Boolean(meta.finished), sum }
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
    held.set(scope, { runs: was?.runs ?? [], at: now, error: String(err).includes('jq') ? `Stats reads Claude’s records with jq, and jq was not found on ${thisMac()}.` : `Claudopus couldn’t read the records: ${String(err)}` })
  } finally {
    reading.delete(scope)
    drawAgain($)
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
    { name: 'Topics', count: subjects, bytes: kb.get('index.md') ?? 0 },
    { name: 'Topic notes', count: (await names('streams')).length, bytes: kb.get('streams') ?? 0 },
    { name: 'Your words, by chat', count: (await names('words')).length, bytes: kb.get('words') ?? 0 },
    { name: 'Questions and answers, by chat', count: (await names('asks')).length, bytes: kb.get('asks') ?? 0 },
    { name: 'Results', count: reports.filter(e => e.kind === 'dir').length, bytes: kb.get('reports') ?? 0 },
    { name: 'Finished tasks, by chat', count: (await names('finished')).length, bytes: kb.get('finished') ?? 0 },
    { name: 'Workflows', count: (await names('flows')).length, bytes: kb.get('flows') ?? 0 },
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
          <Text dimColor wrap="wrap">{[version ? `Version ${version}` : '', isWaiting ? `${installed} ready, type /reload-plugins` : '', app ? `Claude Code ${app}` : ''].filter(Boolean).join(' · ') || 'A mod for Claude Code'}</Text>
        </Box>
      </Box>
      {band(
        ui,
        'about-what',
        'What it does',
        '',
        <Box flexDirection="column" gap={1}>
          <Text wrap="wrap">Each message you send in a chat starts a task that Claude does in the background, so the chat stays small and free for your next message.</Text>
          <Text wrap="wrap">This panel shows each task as a card with its to-dos. When a task finishes, Claudopus saves what it found under Results.</Text>
          <Text wrap="wrap">Claudopus saves your words, the topics you work on and every result as plain files under Memory. Stats adds up what your tasks cost and the time they saved.</Text>
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
const termDots = (ui: Ui, $: EngineInterface, requestId: string, key: string, color = LIVE) =>
  liveRaster(ui, $, requestId, key, DOT_FRAMES.map(one => glyphCells(one, colorOf(color))), 300, Infinity, Date.now() % 1200)
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
  if (surface === 'terminal' && (termFrom || isRunFromAfar || !hasDesktop)) return sendPicture($, path)
  if (isRunFromAfar) return showPictureIn($, path, pane, row)
  const opened = await openOn($, path)
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
  const say = (text: string, copy?: string) => (pictureSaid.size > 100 && pictureSaid.clear(), pictureSaid.set(path, { text, copy }), drawAgain($))
  // A terminal with no word of where it is watched from: where the picture is, and no more
  if (!termFrom) return say(`It is at ${path} on ${thisMac()}`)
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
  drawAgain($)
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
  drawAgain($)
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
  const got = await $.process.run([sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'hasAlpha', path]).catch(() => ({ exitCode: 1, stdout: '' }))
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
      const sized = await $.process.run([sips($), '--resampleWidth', String(most), '-s', 'format', 'png', path, '--out', wide]).catch(() => ({ exitCode: 1 }))
      if (sized.exitCode !== 0) continue
      const tall = Number(/pixelHeight:\s*(\d+)/.exec((await $.process.run([sips($), '-g', 'pixelHeight', wide]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
      if (!tall) continue
      // sips crops only a band that neither starts at the top nor reaches the bottom (one that does comes out centred, or whole),
      // so the picture is given a row above and below first, and each band is cut one row down
      const padded = await $.process.run([sips($), '--padToHeightWidth', String(tall + 2), String(most), wide]).catch(() => ({ exitCode: 1 }))
      if (padded.exitCode !== 0) continue
      const bands: string[] = []
      let band = Math.min(tall, 400)
      let total = 0
      let isTooMany = false
      for (let y = 0; y < tall; ) {
        const rows = Math.min(band, tall - y)
        const out = `${base}-band.${format === 'png' ? 'png' : 'jpg'}`
        await $.process.run([sips($), '-c', String(rows), String(most), '--cropOffset', String(y + 1), '0', '-s', 'format', format, ...(format === 'jpeg' ? ['-s', 'formatOptions', String(quality)] : []), wide, '--out', out])
        const cutTo = Number(/pixelHeight:\s*(\d+)/.exec((await $.process.run([sips($), '-g', 'pixelHeight', out]).catch(() => ({ stdout: '' }))).stdout)?.[1] ?? 0)
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
          drawAgain($)
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
  if (!stat || stat.kind !== 'file') return said('This picture is no longer available.')
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
        await $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '60', asked, '--out', to])
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

// Another chat's work keeps its chat in that chat's transcript on this Mac, which the engine gives this chat no rows of: it is read
// from its file, the end of it, in the same rows. A chat on another Mac is not read: its Details says where it is
const THEIR_TAIL = 800_000
const SAFE_ID = /^[A-Za-z0-9_-]{1,80}$/
// A transcript's lines as the engine's rows: what the work was told, what it wrote, each tool step with what came back
const rowsOfTranscript = (text: string): SessionMessage[] => {
  const rows: SessionMessage[] = []
  const uses = new Map<string, ToolUseSummary>()
  const textOf = (content: unknown) =>
    typeof content === 'string' ? content : Array.isArray(content) ? content.flatMap(block => (block && typeof block === 'object' && (block as { type?: unknown }).type === 'text' && typeof (block as { text?: unknown }).text === 'string' ? [(block as { text: string }).text] : [])).join('\n') : ''
  for (const line of text.split('\n')) {
    if (!line.startsWith('{')) continue
    let entry: { type?: unknown; isMeta?: unknown; message?: { content?: unknown } }
    try {
      entry = JSON.parse(line) as typeof entry
    } catch {
      continue
    }
    const content = entry.message?.content
    if (entry.type === 'assistant') {
      const toolUses = (Array.isArray(content) ? content : []).flatMap((block): ToolUseSummary[] => {
        const b = block as { type?: unknown; id?: unknown; name?: unknown; input?: unknown }
        if (b?.type !== 'tool_use' || typeof b.id !== 'string' || typeof b.name !== 'string') return []
        const use: ToolUseSummary = { tool_use_id: b.id, tool: b.name, input: b.input && typeof b.input === 'object' ? (b.input as Record<string, unknown>) : {} }
        uses.set(b.id, use)
        return [use]
      })
      rows.push({ role: 'assistant', text: textOf(content), toolUses } as SessionMessage)
    } else if (entry.type === 'user' && entry.isMeta !== true) {
      // What came back to a tool step goes with that step; the rest is what the work was told
      for (const block of Array.isArray(content) ? content : []) {
        const b = block as { type?: unknown; tool_use_id?: unknown; content?: unknown; is_error?: unknown }
        const use = b?.type === 'tool_result' && typeof b.tool_use_id === 'string' ? uses.get(b.tool_use_id) : undefined
        if (use) Object.assign(use, { text: textOf(b.content), ...(b.is_error === true ? { isError: true } : {}) })
      }
      const said = textOf(content)
      if (said) rows.push({ role: 'user', text: said, toolUses: [] } as unknown as SessionMessage)
    }
  }
  return rows
}
const loadTheirs = async ($: EngineInterface, one: Todo) => {
  const c = one.chat
  const id = one.id
  if (!c || c.host || !SAFE_ID.test(c.id) || !SAFE_ID.test(c.agent ?? '') || loading.has(id)) return
  loading.add(id)
  let isChanged = false
  try {
    // Read again when it has made a step, said where it is, or ended: not as its context grows
    const key = [one.steps ?? 0, one.entries.at(-1)?.text ?? '', one.status, one.items.length, one.endedAt].join(':')
    const now = await $.clock.now()
    const was = talks.get(id)
    if (was?.key === key && (was.lines || now - (was.at ?? 0) < RETRY_READ)) return
    const home = (await $.env.get('HOME')) ?? ''
    // Its folder named as the engine names its projects, and failing that any project that holds that chat
    const slug = c.folder.replace(/[^A-Za-z0-9]/g, '-')
    const name = `${c.id}/subagents/agent-${c.agent}.jsonl`
    const r = await $.process
      .run(['sh', '-c', 'for f in "$1/$2/$3" "$1"/*/"$3"; do [ -f "$f" ] && { tail -c "$4" "$f"; exit 0; }; done; exit 1', 'sh', `${home}/.claude/projects`, slug, name, String(THEIR_TAIL)], { timeoutMs: 5000 })
      .catch(() => undefined)
    const rows = r?.exitCode === 0 ? rowsOfTranscript(r.stdout) : undefined
    talks.set(id, { key, lines: rows?.length ? withSteers(talkOf(rows), one.entries) : undefined, at: now })
    isChanged = true
  } catch (err) {
    if (!talks.has(id)) talks.set(id, { key: '', lines: undefined, at: await $.clock.now().catch(() => 0) })
    isChanged = true
    await log($, `chat of ${id} not read: ${String(err)}`).catch(() => undefined)
  } finally {
    loading.delete(id)
  }
  if (isChanged) redraw($)
}

// The pictures an ask is about, drawn small on its card under what it is about, so the person decides there without waiting for
// the chat to send them (14 Nov: a card asked to pick one of four designs, and the designs came only later, in the chat). Each
// small copy is smaller than a chat's: a card's pictures are drawn in the list, beside every other card, and the list is one drawing
// Each is made twice as wide as it is drawn, so its words stay readable on a sharp screen: smaller files first by a lower quality,
// then by a narrower copy
const ASK_THUMB_SIZES: [string, string][] = [
  ['600', '45'],
  ['600', '35'],
  ['480', '40'],
  ['360', '40'],
]
const ASK_THUMB_BYTES = 25_000
// How wide an ask's small picture is drawn at most, and how tall, in the panel's pixels
const ASK_PIC_WIDE = 300
const ASK_PIC_TALL = 240
const sizedAskPic = (width: number, height: number) => {
  const scale = Math.min(1, ASK_PIC_WIDE / width, ASK_PIC_TALL / height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}
// The most characters every ask's small pictures together take in one drawing; one past that is a row that opens it
const ASK_PICS_CHARS = 140_000
// Each ask's pictures as last made, by the work, its ask and its pictures; made out of the drawing, which is drawn again once they are
const askPics = new Map<string, Pic[]>()
const askLoading = new Set<string>()
const askPicsKey = (one: Todo) => `${one.id}:${one.ask?.at ?? 0}:${(one.ask?.pictures ?? []).join('|')}`
const askPicOf = async ($: EngineInterface, path: string): Promise<Pic | null> => {
  const stat = await $.fs.stat(path).catch(() => undefined)
  // A picture not on this Mac (an ask of a chat on another Mac names its own files) is left out
  if (!stat || stat.kind !== 'file') return null
  let thumb: Thumb = null
  if (/\.svg$/i.test(path) && stat.size <= SVG_CHARS) {
    const text = await readOr($, path)
    const from = text.indexOf('<svg')
    if (from >= 0) {
      // Its own size, from its width and height or its viewBox, so it is drawn within the card like any other
      const head = /<svg[^>]*>/i.exec(text.slice(from))?.[0] ?? ''
      const box = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(head)
      // Both from its width and height, else both from its viewBox: one of each could be in different units
      const given = [/\swidth="([\d.]+)(px)?"/i.exec(head)?.[1], /\sheight="([\d.]+)(px)?"/i.exec(head)?.[1]]
      const [width, height] = (given[0] && given[1] ? given : [box?.[1], box?.[2]]).map(one => Number(one ?? 0))
      thumb = { source: text.slice(from), width: width && height ? width : 0, height: width && height ? height : 0 }
    }
  } else if (RASTER.test(path)) {
    const to = `${dir}/thumbs/ask-${slug(path).slice(-60)}-${mark(path).replace(':', '-')}-${Math.round(stat.mtimeMs)}.jpg`
    if (!(await $.fs.exists(to))) {
      await $.process.run(['mkdir', '-p', `${dir}/thumbs`])
      for (const [size, quality] of ASK_THUMB_SIZES) {
        await $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, path, '--out', to])
        if (((await $.fs.stat(to).catch(() => undefined))?.size ?? Infinity) <= ASK_THUMB_BYTES) break
      }
    }
    thumb = await thumbOf($, to)
  }
  return { name: fileName(path), path, thumb }
}
// What a card draws: its ask's pictures as made, or nothing yet while they are made
const askPicturesOf = ($: EngineInterface, one: Todo): Pic[] | undefined => {
  if (!one.ask?.pictures?.length) return []
  const key = askPicsKey(one)
  if (askPics.has(key)) return askPics.get(key)
  if (!askLoading.has(key)) {
    askLoading.add(key)
    const paths = [...one.ask.pictures]
    void (async () => {
      const made: Pic[] = []
      for (const path of paths) {
        const pic = await askPicOf($, path).catch(() => null)
        if (pic) made.push(pic)
      }
      if (askPics.size >= 60) askPics.delete(askPics.keys().next().value ?? '')
      askPics.set(key, made)
    })()
      .catch(err => log($, `pictures of an ask not made: ${String(err)}`))
      .finally(() => (askLoading.delete(key), redraw($)))
  }
  return undefined
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
  const bar = args && typeof args === 'object' && typeof (args as { bar?: unknown }).bar === 'string' ? String((args as { bar: string }).bar).replace(/\s+/g, ' ').trim() : ''
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
    ...(bar ? { bar: bar.slice(0, 1000) } : {}),
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
  void comingTab((async () => {
    const f = (await read($, flows)).find(one => one.id === id)
    if (!f) return
    if (!(await $.ui.panes()).some(pane => pane.id === flowPaneOf(id))) (flowPicked.delete(id), pictureIn.delete(flowPaneOf(id)))
    await front($, flowPaneOf(id), cut(f.title, 30))
    redraw($)
  })()).catch(err => log($, `workflow ${id} not opened: ${String(err)}`))
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
    if (one.status === 'working' || before === undefined || before === standing(one.status, one.endedAt) || cutPending.has(one.id)) continue
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
    const what = f.status === 'done' ? fewWords(f.result) || 'Finished.' : f.status === 'failed' ? 'Failed with an error.' : 'Stopped.'
    return { title: f.title || f.name || 'Workflow', isDone: f.status === 'done', what }
  }
  const one = cards.find(card => card.id === id)
  if (!one) return undefined
  const waits = one.waits ?? seen ?? []
  const said = [...one.entries].reverse().find(entry => entry.kind === 'note')?.text ?? ''
  const what =
    one.status === 'done'
      ? waits.length
        ? `Waiting for ${who()}: ${fewWords(waits[0] ?? '')}${waits.length > 1 ? ` (and ${waits.length - 1} more)` : ''}`
        : fewWords(one.answer) || fewWords(said) || 'Finished.'
      : one.status === 'failed'
        ? 'Failed with an error.'
        : 'Stopped.'
  return { title: one.title || 'Task', isDone: one.status === 'done', what }
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
  const title = items.length === 1 && first ? first.title : done === items.length ? `${items.length} tasks are done` : `${items.length} tasks ended`
  const text = items.length === 1 && first ? first.what : items.map(one => `${one.title}: ${one.isDone ? 'done' : one.what.replace(/\.$/, '').toLowerCase()}`).join(' · ').slice(0, 300)
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
    return amber.exitCode === 0 && asks?.chime === true && !isLinux
  }
  // Claudopus Asks turned off in System Settings, or it failed: the purple Claudopus, without the sound
  const own = await run([])
  const tried = amber ? `Claudopus Asks said ${amber.exitCode}; ` : ''
  if (own.exitCode === 0 || own.exitCode === 5) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}${own.exitCode === 0 ? 'notified through Claudopus' : 'macOS asked to allow Claudopus'}`)
    return false
  }
  // Linux: bin/notify was the desktop's own notification, and with no desktop there is none; the panel and the terminal show it
  if (isLinux) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}${own.exitCode === 3 ? 'no desktop notification on this machine' : `notify-send said ${own.exitCode}`}`)
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
const askAloud = ($: EngineInterface, one: Todo, text: string) => aloud($, 'ask', `${titleOf(one)} has a question for you`, text, `ask-${one.id}`)

// Updates as the person asks for them. A look only reads the version page on claudopus.ai, on its own as often as Config says or
// only at Config's Check now, and the panel's header then says a newer version is out, quietly, in one small box. Each step is a
// press: Download fetches the release and checks it is what the release published, Install puts it in place (Claude Code's own
// steps for an installed copy). A chat run from a folder of the code has one press, Update, for both: the fetch, its check, then a
// fast-forward only once the check holds. Then the header says, beside the version, to type /reload-plugins, which switches the
// chat. Not now and Skip this version keep it quiet.
// The pure parts are in hooks/update.ts

// ---- One at a time, under a lock the other chats see ----

// A look and each step run one at a time, under a lock the other chats see; the look keeps what it saw in update-seen.json (a
// version number only), the steps where they stand in update-steps.json
let isUpdating = false
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-step is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
const UPDATE_BUSY = 'busy' as const
const LOCK_SKEW = 60_000
const underUpdateLock = async <T,>($: EngineInterface, act: () => Promise<T>): Promise<T | typeof UPDATE_BUSY> => {
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  if (!(await take())) {
    const now = await $.clock.now()
    const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
    // A lock dated ahead of this Mac's clock, past what two chats' clocks can differ by, was never taken by a chat here: it is stale
    if (now - at < UPDATE_LOOK && at - now <= LOCK_SKEW) return UPDATE_BUSY
    const seen = await readOr($, lock)
    const aside = `${lock}.${token.split(' ')[1]}`
    if ((await $.process.run(['mv', lock, aside]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) return UPDATE_BUSY
    // Another chat took the stale lock over in between: what was moved is its fresh lock, put back where it was
    if ((await readOr($, aside)) !== seen) return ((await $.process.run(['mv', '-n', aside, lock]).catch(() => undefined)), UPDATE_BUSY)
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
// The Mac, as one step needs it
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
  wait: ms => new Promise<void>(done => void $.clock.after(ms, done)),
})
// Claude Code's own program: the one the app names, else the first on the PATH, else where its installer puts it, as a terminal started without a login shell
// (seen on Linux, in tmux started over ssh) has no ~/.local/bin on its PATH, else claude on the PATH
const engineOf = async ($: EngineInterface) => {
  const named = await $.env.get('CLAUDE_CODE_EXECPATH')
  if (named) return named
  // The PATH first, as the shell would find it, so an install by npm or another copy earlier on it is still the one used
  const onPath = ((await $.env.get('PATH')) ?? '').split(':').filter(one => one.startsWith('/')).map(one => `${one.replace(/\/+$/, '')}/claude`)
  for (const one of [...onPath, `${(await $.env.get('HOME')) ?? ''}/.local/bin/claude`, '/opt/homebrew/bin/claude', '/usr/local/bin/claude', '/usr/bin/claude'])
    if (one.startsWith('/') && (await $.fs.exists(one).catch(() => false))) return one
  return 'claude'
}

// ---- Looking: the version page only ----

// What the last look saw, a version number and when, shared by every chat; and the page itself as this chat last read it, kept in
// this chat only, as the lines of what is new are shown from it and never from a file any program could write
const lookedPath = () => `${dir}/update-seen.json`
let pageRead: { page: Published; at: number } | undefined
const PAGE_AGAIN = 10 * 60_000
let pageAsked = 0
// One read of the page; a page with no fingerprint is no release a download can be checked against, and is read as none
const readPage = async ($: EngineInterface): Promise<{ page?: Published; why: string }> => {
  const answer = await lookIo($).page()
  const page = answer.ok ? publishedOf(answer.text) : undefined
  if (page) pageRead = { page, at: await $.clock.now() }
  return { page, why: page ? '' : answer.ok ? (versionOnPage(answer.text) ? FAILS.unchecked : 'claudopus.ai named no version') : answer.status ? `claudopus.ai answered ${answer.status}` : 'claudopus.ai did not answer' }
}
// The page, read now under the lock, its version kept for every chat
const lookOnly = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const before = stampOf(await readOr($, lookedPath()))
  const { page, why } = await readPage($)
  await $.fs.write(lookedPath(), JSON.stringify({ at: now, version: page?.version ?? before?.version ?? '', result: page ? 'seen' : `version page not read: ${why}` }))
  if (page) redraw($)
  return { page, why }
}
// The look on its own, as often as Config says; Only when I ask reads nothing
const lookForNew = async ($: EngineInterface) => {
  if (isUpdating || !dir) return
  const config = await readConfig($, dir)
  if (config.updates === false) return
  const every = lookEveryOf(config.updateEvery)
  if (!isUpdateDue(stampOf(await readOr($, lookedPath())), await $.clock.now(), every)) return
  isUpdating = true
  try {
    await underUpdateLock($, async () => {
      // Another chat may have looked between this chat's reading and its lock, or the person turned the look off meanwhile
      const again = await readConfig($, dir)
      if (!isUpdateDue(stampOf(await readOr($, lookedPath())), await $.clock.now(), lookEveryOf(again.updateEvery)) || again.updates === false) return
      await lookOnly($)
    })
  } finally {
    isUpdating = false
  }
}
// Config's Check now: the page read now, whatever the setting; it only looks, and the panel offers what it found
const checkNow = async ($: EngineInterface): Promise<{ text: string; isError: boolean }> => {
  if (!dir) return { text: "Couldn't check: Claudopus has no memory folder in this chat.", isError: true }
  const loaded = (await versionsOf($)).version
  for (let tries = 0; tries < 20; tries++) {
    if (!isUpdating) {
      isUpdating = true
      try {
        const got = await underUpdateLock($, () => lookOnly($))
        if (got !== UPDATE_BUSY) {
          await log($, `Claudopus looked for a new version from Config: ${got.page?.version ?? got.why}`)
          if (!got.page) return { text: `Couldn't check: ${got.why}. Try again later.`, isError: true }
          await knowSource($, true)
          return loaded && isNewer(got.page.version, loaded) ? { text: `v${got.page.version} is out. You can update from the panel.`, isError: false } : { text: `You're on the newest version (v${got.page.version}).`, isError: false }
        }
      } finally {
        isUpdating = false
      }
    }
    await new Promise<void>(done => void $.clock.after(3000, done))
  }
  return { text: "Couldn't check: another chat's update did not finish. Try again later.", isError: true }
}
// A chat whose panel shows a newer version than any page it has read reads the page itself once, for that version's lines, at most
// every PAGE_AGAIN; never while the look is set to only when asked, when only a press reads it
const pageFor = async ($: EngineInterface, version: string) => {
  if (pageRead && !isNewer(version, pageRead.page.version)) return pageRead.page
  const now = await $.clock.now()
  if (now - pageAsked < PAGE_AGAIN || (await readConfig($, dir)).updates === false) return pageRead?.page
  pageAsked = now
  void readPage($).then(({ page }) => page && redraw($)).catch(() => undefined)
  return pageRead?.page
}

// ---- Where this chat's copy comes from ----

// Known once a load and again at each look and step: where this chat's copy comes from, and, for a set-up a release never reaches,
// what it is and why
let sourceKnown: { src: Source; cannot?: { what: string; why: string }; where: string } | undefined
const knowSource = async ($: EngineInterface, isAgain = false) => {
  if (sourceKnown && !isAgain) return sourceKnown
  const root = $.plugin.root.replace(/\/+$/, '')
  const from = installedFrom(root)
  const io = lookIo($)
  const plugins = from?.plugins ?? dir.replace(/\/claudopus$/, '/plugins')
  const known = await readOr($, `${plugins}/known_marketplaces.json`)
  const entryOf = (name: string) => {
    try {
      return (JSON.parse(known) as Record<string, { source?: { source?: string; path?: string; repo?: string }; installLocation?: string }>)?.[name]
    } catch {
      return undefined
    }
  }
  const installed = await readOr($, `${plugins}/installed_plugins.json`)
  const done = (one: NonNullable<typeof sourceKnown>) => (sourceKnown = one)
  if (from) {
    const entry = entryOf(from.marketplace)
    const scope = scopeOf(installed, `${from.plugin}@${from.marketplace}`, root) ?? scopeOf(installed, `${from.plugin}@${from.marketplace}`, copyOf(installed, `${from.plugin}@${from.marketplace}`, root, cwd)?.installPath ?? root)
    const record = { plugins: from.plugins, marketplace: from.marketplace, plugin: from.plugin, scope }
    if (entry?.source?.source === 'directory' && typeof entry.source.path === 'string') {
      const repo = entry.source.path.replace(/\/+$/, '')
      const ready = await folderReady(io, repo)
      return done({
        src: { kind: 'folder', repo, sub: 'mods/claudopus', runs: 'copy', record },
        cannot: ready.ok ? undefined : { what: `Claude Code's copy is made from ${ready.what}`, why: ready.why },
        where: ready.ok ? "Claude Code's installed copy, made from Claudopus's released code on this Mac" : `Claude Code's installed copy, made from ${ready.what}`,
      })
    }
    const location = typeof entry?.installLocation === 'string' ? entry.installLocation.replace(/\/+$/, '') : ''
    const isGit = location && (await $.fs.exists(`${location}/.git`).catch(() => false))
    const subOf = async () => {
      try {
        const market = JSON.parse(await readOr($, `${location}/.claude-plugin/marketplace.json`)) as { plugins?: { name?: string; source?: unknown }[] }
        const source = market.plugins?.find(one => one.name === from.plugin)?.source
        return typeof source === 'string' && /^\.\/[\w./-]+$/.test(source) && !source.includes('..') ? source.slice(2).replace(/\/+$/, '') : ''
      } catch {
        return ''
      }
    }
    const path = isGit ? await subOf() : ''
    if (isGit && path) return done({ src: { kind: 'clone', repo: location, sub: path, ...record }, where: "Claude Code's installed copy" })
    return done({ src: { kind: 'none', why: 'its marketplace is not one Claudopus can check a download in' }, cannot: { what: 'This chat runs a copy of Claudopus installed another way', why: 'update it with /plugin in Claude Code' }, where: "Claude Code's installed copy" })
  }
  // Run from a folder of the code: the folder is what a release has to reach
  const top = (await io.run(['git', '-C', root, 'rev-parse', '--show-toplevel'], 20_000).catch(() => ({ exitCode: 1, stdout: '', stderr: '' }))).stdout.trim()
  const ready = top ? await folderReady(io, top) : ({ ok: false, what: "Claudopus code that Update can't change", why: "it isn't Claudopus's released code" } as const)
  const marketplace = folderMarketplace(known, root)
  const scopes = (() => {
    try {
      return ((JSON.parse(installed)?.plugins?.[`claudopus@${marketplace}`] ?? []) as { scope?: unknown }[]).map(one => one?.scope)
    } catch {
      return []
    }
  })()
  const scope = scopes.includes('user') ? 'user' : (scopes.find(one => typeof one === 'string' && /^(user|project|local)$/.test(one)) as string | undefined)
  const sub = top && root.startsWith(`${top}/`) ? root.slice(top.length + 1) : 'mods/claudopus'
  return done({
    src: { kind: 'folder', repo: top || root, sub, runs: 'folder', ...(marketplace && scope ? { record: { plugins, marketplace, plugin: 'claudopus', scope } } : {}) },
    cannot: ready.ok ? undefined : { what: `This chat runs ${ready.what}`, why: ready.why },
    where: ready.ok ? "Claudopus's released code on this Mac" : ready.what,
  })
}

// ---- The steps ----

const stepsPath = () => `${dir}/update-steps.json`
const laterPath = () => `${dir}/update-later.json`
// Not now keeps a version quiet for this long
const LATER_FOR = 24 * 3_600_000
const writeSteps = ($: EngineInterface, steps: Steps) => $.fs.write(stepsPath(), JSON.stringify(steps))
// What the last step in this chat said beyond its kind of failure, kept in this chat only
const stepSaid = { version: '', detail: '', dirty: false }
let isStepping = false
// The press found another chat at a step: said for a moment in this chat
let busyAt = 0
const atStep = async ($: EngineInterface, act: () => Promise<void>) => {
  if (isStepping || isUpdating || !dir) return
  isStepping = true
  isUpdating = true
  redraw($)
  try {
    const got = await underUpdateLock($, act)
    if (got === UPDATE_BUSY) busyAt = await $.clock.now()
  } catch (err) {
    await log($, `update step failed: ${String(err)}`)
  } finally {
    isStepping = false
    isUpdating = false
    redraw($)
  }
}
// A chat run from Claudopus's own checkout: Download and Install are one press, Update (the fetch, its check against the release,
// then the fast-forward, under the one lock); an installed copy keeps them as two
const isOnePress = (src: Source) => src.kind === 'folder' && src.runs === 'folder'
// The page read again at each press: a step is checked only against what claudopus.ai says now, never against a kept file
const freshPage = async ($: EngineInterface, version: string, step: 'download' | 'install', now: number) => {
  const { page } = await readPage($)
  if (!page) await writeSteps($, { version, stage: 'failed', fail: 'page', step, at: now })
  return page
}
// Download, pressed for the version the notice showed: the newest the page names now is what is fetched
let downloadProgress: { version: string; pct: number; got: number; phase: string } | undefined
// What the download's last drawing showed, and when
const progressDrawn = { shown: '', phase: '', at: 0 }
// Update's press, from its fetch to the end of its move: the panel says Updating throughout, and offers no press in between
let isUpdatePress = false
// A press while only a look runs (the timed one, or Config's Check now) waits for the look to end, then acts: before, it did nothing
const afterLook = ($: EngineInterface, act: () => void) =>
  void (async () => {
    for (const end = (await $.clock.now()) + 30_000; isUpdating && !isStepping && (await $.clock.now()) < end; ) await new Promise<void>(done => void $.clock.after(250, done))
    if (!isUpdating && !isStepping) act()
  })()
const downloadPress = ($: EngineInterface, version: string) => {
  if (isUpdating && !isStepping) return afterLook($, () => downloadPress($, version))
  presses += 1
  // A press while a step runs does nothing, as atStep would, and leaves the flag to the press that set it
  if (isStepping || isUpdating) return
  // Update's move, once its fetch was checked: each half takes the lock on its own, as two presses did, so neither holds it longer
  let next: { version: string; commit: string } | undefined
  isUpdatePress = true
  void atStep($, async () => {
    const now = await $.clock.now()
    const { src } = await knowSource($, true)
    if (src.kind === 'none') return
    const page = await freshPage($, version, 'download', now)
    if (!page) return
    const loaded = (await versionsOf($)).version
    // The page names no newer version than this chat runs (the notice came from a look that is out of date, or a planted file): the
    // look's record is set right, and nothing is fetched
    if (!loaded || !isNewer(page.version, loaded)) return void (await $.fs.write(lookedPath(), JSON.stringify({ at: now, version: page.version, result: 'seen' })))
    Object.assign(stepSaid, { version: page.version, detail: '', dirty: false })
    await writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at: now, from: loaded })
    let wrote = 0
    const got = await download(lookIo($), src, page, `${dir}/update-progress.txt`, async p => {
      downloadProgress = { version: page.version, ...p }
      const at = await $.clock.now()
      if (at - wrote >= 1000) ((wrote = at), await writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at, pct: p.pct, got: p.got, from: loaded }))
      // Each drawing makes the panel's buttons new, and a click on one just replaced is lost: the figures move every 2 s, and not
      // while the person is using the panel, unless the download moves to its next phase
      const shown = `${Math.round(p.pct)}|${p.got ? sizeText(p.got) : ''}|${p.phase}`
      const isPhase = p.phase !== progressDrawn.phase
      if (shown !== progressDrawn.shown && (isPhase || (at - progressDrawn.at >= 2000 && at - engagedAt >= ENGAGED))) {
        Object.assign(progressDrawn, { shown, phase: p.phase, at })
        redraw($)
      }
    })
    downloadProgress = undefined
    const at = await $.clock.now()
    heldChecked.clear()
    if (got.ok) {
      await writeSteps($, { version: page.version, stage: 'downloaded', step: 'download', commit: got.commit, tree: page.tree, at, from: loaded })
      // Update's second half: the fetch was checked against the release, and the move reads the page and checks it again
      if (isOnePress(src)) next = { version: page.version, commit: got.commit }
    } else {
      // What git or GitHub said is kept in the log only: the panel shows what failed in its own words
      if (got.detail) await log($, `Claudopus ${page.version} download failed (${got.fail}): ${got.detail}`)
      await writeSteps($, { version: page.version, stage: 'failed', step: 'download', fail: got.fail, at, from: loaded })
    }
  })
    .then(() => (next ? atStep($, () => installStep($, next!.version, next!.commit)) : undefined))
    .finally(() => ((isUpdatePress = false), redraw($)))
}
// Install, pressed for the download the notice showed: checked against the page read now, then put in place
const installPress = ($: EngineInterface, version: string, commit: string) => {
  if (isUpdating && !isStepping) return afterLook($, () => installPress($, version, commit))
  presses += 1
  void atStep($, () => installStep($, version, commit))
}
// Install itself, run under the lock: at Install's press, or as Update's second half
const installStep = async ($: EngineInterface, version: string, commit: string) => {
  const now = await $.clock.now()
  const { src } = await knowSource($, true)
  if (src.kind === 'none') return
  const page = await freshPage($, version, 'install', now)
  if (!page) return
  const loaded = (await versionsOf($)).version
  if (page.version !== version) return void (await writeSteps($, { version, stage: 'failed', step: 'install', fail: 'newer-out', at: now, from: loaded }))
  await writeSteps($, { version, stage: 'installing', step: 'install', commit, tree: page.tree, at: now, from: loaded })
  // A long install keeps its step alive for the other chats
  let isOn = true
  const beat = (): unknown =>
    $.clock.after(20_000, () => void (isOn && $.clock.now().then(at => writeSteps($, { version, stage: 'installing', step: 'install', commit, tree: page.tree, at, from: loaded })).then(() => isOn && beat())))
  beat()
  const got = await install(lookIo($), src, page, commit, await engineOf($)).finally(() => (isOn = false))
  const at = await $.clock.now()
  Object.assign(stepSaid, { version, detail: '', dirty: got.ok && got.dirty })
  if (!got.ok && got.detail) await log($, `Claudopus ${version} install failed (${got.fail}): ${got.detail}`)
  await writeSteps($, got.ok ? { version, stage: 'installed', step: 'install', commit, tree: page.tree, at, from: loaded } : { version, stage: 'failed', step: 'install', fail: got.fail, commit, at, from: loaded })
}
// Not now: quiet for a day, for this version; Skip this version: quiet until a newer one, kept as the person's own setting
const laterPress = async ($: EngineInterface, version: string) => {
  presses += 1
  await $.fs.write(laterPath(), JSON.stringify({ version, until: (await $.clock.now()) + LATER_FOR }))
  redraw($)
}
const skipPress = async ($: EngineInterface, version: string) => {
  presses += 1
  await setConfig($, dir, 'skipVersion', version)
  // What Check now said last is about the version just skipped
  Object.assign(updateCheck, { said: '', isError: false })
  await loadSettings($)
  redraw($)
}

// ---- The notice ----

// What this chat found of each download it was told of, by commit and tree, so the check runs once
const heldChecked = new Map<string, boolean>()
const isDownloadHeld = async ($: EngineInterface, src: Source, steps: Steps) => {
  if (src.kind === 'none' || !steps.commit || !steps.tree) return false
  // Checked against what this chat read on the page itself, never only against what the file says the tree is
  const page = pageRead?.page ?? (await pageFor($, steps.version))
  if (!page || page.version !== steps.version || page.tree !== steps.tree) return false
  const key = `${src.repo}|${steps.commit}|${steps.tree}`
  const known = heldChecked.get(key)
  if (known !== undefined) return known
  const git = (args: string[]) => $.process.run(['env', 'GIT_TERMINAL_PROMPT=0', 'git', '-C', src.repo, ...args], { timeoutMs: 20_000 }).catch(() => ({ exitCode: 1, stdout: '' }))
  const held = (await git(['rev-parse', '--verify', '-q', 'refs/claudopus/update^{commit}'])).stdout.trim()
  const tree = held === steps.commit ? (await git(['rev-parse', '--verify', '-q', `${steps.commit}:${src.sub}`])).stdout.trim() : ''
  const isHeld = tree === steps.tree
  heldChecked.set(key, isHeld)
  return isHeld
}

// Where updating stands for this chat, from what is true now
const noticeNow = async ($: EngineInterface, loaded: string, installed: string): Promise<Notice | undefined> => {
  if (!dir || !loaded) return undefined
  const config = await readConfig($, dir)
  const seen = stampOf(await readOr($, lookedPath()))?.version ?? ''
  const laterText = await readOr($, laterPath())
  const later = () => {
    try {
      const v = JSON.parse(laterText) as { version?: unknown; until?: unknown }
      return isVersion(v?.version) && typeof v.until === 'number' ? { version: v.version, until: v.until } : undefined
    } catch {
      return undefined
    }
  }
  const known = await knowSource($)
  const steps = stepsOf(await readOr($, stepsPath()))
  return noticeOf({
    loaded,
    installed,
    seen: isVersion(seen) ? seen : '',
    // A download is said to be checked only once this chat has seen it so: its repo's download ref holds that commit, whose mod folder
    // is the tree the steps name, and the page this chat read names it too
    steps: steps?.stage === 'downloaded' && !(await isDownloadHeld($, known.src, steps)) ? undefined : steps,
    page: pageRead?.page,
    skipped: isVersion(config.skipVersion) ? config.skipVersion : undefined,
    later: later(),
    cannot: known.cannot,
    now: await $.clock.now(),
  })
}

// Where updating stands, as far as the panel's drawing changes with it: a step, a look, a press put off or skipped, what the Mac has,
// the seen record of the note after a move, and this chat's own progress and presses, so a held drawing is never shown past it
const updateShape = async ($: EngineInterface) =>
  dir
    ? JSON.stringify([
        await readOr($, lookedPath()),
        await readOr($, stepsPath()),
        await readOr($, laterPath()),
        await readOr($, `${dir}/seen.json`),
        (await readConfig($, dir)).skipVersion ?? '',
        await installedNow($).catch(() => ''),
        pageRead?.page.version ?? '',
        downloadProgress ? Math.round(downloadProgress.pct) : -1,
        isStepping,
        busyAt,
      ])
    : ''

// The notice: a small grey outlined box in the header, under the version this chat runs, never a demand as the amber boxes are.
// What is out and, in a line, what is new; the steps and where they stand; the one press that comes next, Not now and Skip. A chat
// run from Claudopus's own checkout has one, Update, and is told nothing of where it loads from (Config says)
const NOTICE_EDGE = '#80808070'
// The last step, switching this chat, is no press: the header says to type /reload-plugins
const STEPS = ['Download', 'Install'] as const
// Why Update could not update this chat, where Update's own words differ from FAILS'
const ONE_PRESS_FAILS: Partial<Record<Fail, string>> = {
  'newer-out': 'a newer version came out while Claudopus was updating',
  gone: 'the new version is no longer there',
}
const noticeCard = async ($: EngineInterface, ui: Ui, n: Notice | undefined, loaded: string) => {
  const now = await $.clock.now()
  const busy = now - busyAt < 10_000 ? <ui.Text key="update-busy" dimColor wrap="wrap">Another chat is updating Claudopus. Try again in a moment.</ui.Text> : null
  if (!n) return null
  const known = await knowSource($)
  const { src } = known
  const isOne = isOnePress(src)
  // A copy Claude Code installs from Claudopus's code on this Mac keeps Download and Install, in the same words as any installed copy
  // Update is one press: it has no steps to show
  const track = (at: number) =>
    isOne ? null : (
    <ui.Text key="update-track" dimColor wrap="truncate-end">
      {STEPS.map((one, i) => `${i < at ? '✓' : i === at ? '●' : '○'} ${one}`).join('   ')}
    </ui.Text>
  )
  const quiet = (key: string, version: string, withSkip = true) => [
    <ui.Button key={`update-later-${key}-${presses}`} label="Not now" plain dimColor onPress={() => void laterPress($, version).catch(err => log($, `update not put off: ${String(err)}`))} />,
    withSkip ? <ui.Button key={`update-skip-${key}-${presses}`} label="Skip this version" plain dimColor onPress={() => void skipPress($, version).catch(err => log($, `version not skipped: ${String(err)}`))} /> : null,
  ]
  const box = (key: string, lines: (JSX.Element | null)[], buttons: (JSX.Element | null)[]) => (
    <ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      {lines.filter(Boolean)}
      {buttons.some(Boolean) ? (
        <ui.Box key={`update-${key}-buttons`} flexDirection="row" flexWrap="wrap" columnGap={2} alignItems="center">
          {buttons.filter(Boolean)}
        </ui.Box>
      ) : null}
      {busy}
    </ui.Box>
  )
  const title = (text: string, side = '') => (
    <ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
      <ui.Box flexShrink={0}>
        <ui.Text>{text}</ui.Text>
      </ui.Box>
      {side ? <ui.Text dimColor wrap="truncate-end">{side}</ui.Text> : null}
    </ui.Box>
  )
  const line = (key: string, text: string, color?: string) => (
    <ui.Text key={`update-${key}`} dimColor={!color} color={color} wrap="wrap">
      {text}
    </ui.Text>
  )
  const v = n.version
  // Update's press between its fetch and its move: still updating
  if (isOne && (n.kind === 'installing' || (n.kind === 'downloaded' && (isStepping || isUpdatePress)))) return box('installing', [title(`Updating Claudopus ${v}…`), track(0)], [])
  // A fetch checked earlier, left by a copy before Update was one press, is offered as any version out: its Update moves it forward,
  // after checking it once more
  if (n.kind === 'available' || n.kind === 'cannot' || (isOne && n.kind === 'downloaded')) {
    const page = await pageFor($, v)
    const missed = page && page.version === v ? missedOn(page, loaded) : []
    const newest = missed[0]
    const more = missed.reduce((sum, one) => sum + 1 + one.more, 0) - 1
    const count = n.kind === 'available' ? n.count : missed.length || 1
    const what = newest?.line ? `${newest.line}${more > 0 ? ` · and ${more} more ${more === 1 ? 'change' : 'changes'}` : ''}` : ''
    const head = title(`Claudopus ${v} is out`, count > 1 ? `· ${count} versions since v${loaded}` : '')
    if (n.kind === 'cannot') return box('cannot', [head, line('why', `${n.what}: ${n.why}.`)], quiet('cannot', v))
    return box(
      'available',
      [head, what ? line('what', what) : null],
      [
        n.kind === 'downloaded' ? (
          <ui.Button key={`update-install-${presses}`} label="Update" onPress={() => installPress($, v, n.commit)} />
        ) : (
          <ui.Button key={`update-download-${presses}`} label={isOne ? 'Update' : page?.size ? `Download · ${sizeText(page.size)}` : 'Download'} onPress={() => downloadPress($, v)} />
        ),
        ...quiet(n.kind, v),
      ],
    )
  }
  if (n.kind === 'downloading') {
    const live = downloadProgress?.version === v ? downloadProgress : undefined
    const pct = live?.pct ?? n.pct
    const got = live?.got ?? n.got
    const said = live?.phase === 'checking' ? 'checking it against what the release published' : [pct !== undefined ? `${Math.round(pct)}%` : '', got ? sizeText(got) : '', live?.phase === 'resolving' ? 'unpacking' : ''].filter(Boolean).join(' · ')
    return box('downloading', [title(`${isOne ? 'Updating' : 'Downloading'} Claudopus ${v}…`, said ? `· ${said}` : ''), track(0)], [])
  }
  if (n.kind === 'downloaded') {
    const replaces = `Claudopus checked it against the release. Install replaces v${loaded}, and new chats start on v${v}.`
    return box(
      'downloaded',
      [title(`Claudopus ${v} downloaded`), line('replaces', replaces), track(1)],
      [<ui.Button key={`update-install-${presses}`} label="Install" onPress={() => installPress($, v, n.commit)} />, ...quiet('downloaded', v, false)],
    )
  }
  if (n.kind === 'installing') return box('installing', [title(`Installing Claudopus ${v}…`), track(1)], [])
  // The Mac has it and this chat still runs the older one: the header says so beside the version, and to type /reload-plugins
  if (n.kind === 'reload') return null
  // A step that failed: what failed, and that what this chat runs is as it was
  const detail = ''
  const which = isOne ? 'update' : n.step === 'download' ? 'download' : 'install'
  const why = (isOne ? ONE_PRESS_FAILS[n.fail] : undefined) ?? FAILS[n.fail]
  const kept =
    n.fail === 'installed-mismatch'
      ? `New chats keep v${loaded}.`
      : n.fail === 'kept-copy'
        ? `This chat still runs v${loaded}.`
        : `Nothing changed: this chat still runs v${loaded}.`
  return box(
    'failed',
    [title(`Couldn't ${which} Claudopus ${v}`), line('why', `${why.replace(/^./, c => c.toUpperCase())}${detail}. ${kept}`)],
    [<ui.Button key={`update-again-${presses}`} label="Try again" onPress={() => downloadPress($, v)} />, ...quiet('failed', v)],
  )
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; for a copy
// run from a folder of its code, the version that folder has now, which a reload loads
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) {
    // Only a main checkout (its .git a folder, not a worktree's file) follows its folder: a worktree's version rises as work merges
    // main or a release numbers it, mid-build, and a chat loaded from it is reloaded by hand
    const root = $.plugin.root.replace(/\/+$/, '')
    if (!(await readOr($, `${root}/../../.git/HEAD`)).trim()) return undefined
    const version = versionOnPage(await readOr($, `${root}/.claude-plugin/plugin.json`))
    return version ? { version, installPath: root } : undefined
  }
  const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
  const id = `${from.plugin}@${from.marketplace}`
  return copyOf(installed, id, $.plugin.root, cwd)
}

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
  drawAgain($)
}
// The first sentence of a change, short: up to its first full stop, colon or semicolon, cut at a word near 110 characters
const firstClause = (text: string) => {
  const plain = text.replace(/`/g, '').replace(/\s+/g, ' ').trim()
  const first = /^(.{20,}?[.;:])(\s|$)/.exec(plain)?.[1] ?? plain
  if (first.length <= 110) return first.replace(/[.;:]$/, '')
  // Too long: up to its last comma that fits, else the words that fit
  const comma = first.slice(0, 110).lastIndexOf(',')
  return comma > 40 ? first.slice(0, comma) : `${first.slice(0, 107).replace(/\s+\S*$/, '')}…`
}
// The note a chat shows once it moved to a newer version whose changes the person has not seen on this Mac: one quiet box in the
// header, where the update's steps were, saying what it moved from and how many versions that covers, with What's new (the
// Changelog tab) and Close, which marks it seen for every chat. Nothing in a copy a newer load of this chat replaced
const updateScreen = async ($: EngineInterface, ui: Ui, loaded: string, _asks: number, _surface?: string) => {
  if (!dir || !loaded) return undefined
  const seen = seenIn(await readOr($, seenPath()))
  if (!isScreenDue(loaded, seen) || (await read($, ranVersion)) !== loaded) return undefined
  const { shown, left } = missedOf(await versionsLogged($), seen, loaded)
  // The sound plays once for the version on this Mac
  if (screenSounded !== loaded) void playUpdated($, (screenSounded = loaded))
  const count = shown.length + left
  return (
    <ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      <ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
        <ui.Box flexShrink={0}>
          <ui.Text color={FLOW}>{`Updated to Claudopus ${loaded}`}</ui.Text>
        </ui.Box>
        <ui.Text dimColor wrap="truncate-end">{`· from v${seen}${count > 1 ? `, ${count} versions` : ''}`}</ui.Text>
      </ui.Box>
      {shown[0]?.changes[0] ? <ui.Text key="update-what" dimColor wrap="wrap">{firstClause(shown[0].changes[0])}</ui.Text> : null}
      <ui.Box key="update-done-buttons" flexDirection="row" flexWrap="wrap" columnGap={2}>
        <ui.Button key={`update-new-${presses}`} label="What's new" onPress={() => void ((presses += 1), closeScreen($, loaded).then(() => openChangelog($))).catch(err => log($, `changelog not opened: ${String(err)}`))} />
        <ui.Button key={`update-close-${presses}`} label="Close" plain dimColor onPress={() => void closeScreen($, loaded).catch(err => log($, `update note not closed: ${String(err)}`))} />
      </ui.Box>
    </ui.Box>
  )
}

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
// Linux has no Terminal app to type it into, so there the card gives the command to copy only
const canOpenTerminal = (one: Todo) => Boolean(one.ask?.isCommand && one.ask.copy) && !one.chat?.host && !isRunFromAfar && !isLinux
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
// What the person has typed into a reply box and not sent, by the work and the ask it was typed for (draftOf), so a redraw keeps it
// and a newer ask of the same work starts with an empty box
const drafts = new Map<string, string>()
const draftOf = (id: string, ask: NonNullable<Todo['ask']>) => `${id}|${askMark(ask)}`
// Whether the person has typed something not sent into a work's reply box
const hasDraft = (id: string) => [...drafts].some(([key, value]) => key.startsWith(`${id}|`) && Boolean(value))
// While the person types into a reply box or a key box the panel and every Details tab hold their drawing whole. The app builds a
// pane afresh at each drawing, the box in it too: a pane drawn every few seconds under the person's typing flickered the box's ring,
// put older letters over newer ones, and, as Markdown came or went above, threw the panel to its bottom, out of the person's reach
// (15 Nov, typing an answer while other work ran; measured on the app's own drawing, headless). Each letter typed, or the box taking
// the focus, holds it for TYPING more; sending, any press, or the focus leaving the boxes lets it go. The desktop app's reply box is
// in the bar above the prompt (repliesInBar), which is held the same way while it is typed in
const TYPING = 30_000
let typing = 0
let isTyping = false
// Not typing, a pane is drawn again at once for anything new in what it shows, but for its running times alone at most every CALM:
// each drawing is a new pane under the pointer, which lost its hover, and a click whose press and release fell on two drawings did
// nothing (15 Nov: Approve took several clicks)
const CALM = 10_000
// The last drawing of each pane on each surface and size: what it showed in shape (paneShape) and in full (paneContent), when, and
// which call for a drawing of the mod's own it answered (freshness)
const heldDrawings = new Map<string, { shape: string; content: string; at: number; fresh: number; drawing: unknown }>()
// Counts the mod's own calls for a drawing: a press, a reply, a picture made, a box that came. Each one is drawn at once
let freshness = 0
const drawAgain = ($: EngineInterface) => {
  freshness += 1
  void drawFresh($)
}
// The text each reply box was last drawn with: while the person types it is drawn with that again, never with the letters as they
// arrive, so a drawing never puts older letters over the newer ones the box already holds
const drawnDrafts = new Map<string, string>()
const draftShown = (id: string, ask: NonNullable<Todo['ask']>) => draftDrawn(draftOf(id, ask))
const draftDrawn = (key: string) => {
  if (isTyping && drawnDrafts.has(key)) return drawnDrafts.get(key) ?? ''
  const value = drafts.get(key) ?? ''
  drawnDrafts.set(key, value)
  return value
}
// What a pane shows, as far as it moves while the person types: work that starts, finishes, asks, waits on an admin command, is cut
// or stuck, or leaves after its pause, here or in another chat; workflows; boxes, gates and prompts that come or go; a Details
// tab's own to-dos
const paneShape = async ($: EngineInterface, paneId: string) => {
  const at = await $.clock.now()
  const card = (one: Todo) => [one.id, one.status, one.ask?.at ?? 0, one.ask?.replied?.at ?? 0, one.parentId ?? '', lingers(one, at), (one.admins ?? []).map(gate => gate.id), one.leftSince ?? 0, one.cutAt ?? 0, one.stuckAt ?? 0, one.waitsSince ?? 0, one.running?.at ?? 0, jobsOf(one, at).length]
  const own = await read($, todos)
  const chats = await read($, others)
  const theirs = [cardsOf(chats).map(card), helpersOf(chats).map(card), chats.map(c => [c.host, c.chat, c.prompts?.length ?? 0, c.answeredPrompts?.length ?? 0])]
  const flowsNow = (await read($, flows)).map(f => [f.id, f.status, isLingering(f, at), f.agents.length])
  const mine = paneId === LIST ? null : own.find(other => paneId.endsWith(other.id))?.items.map(item => item.state)
  return JSON.stringify([own.map(card), theirs, flowsNow, [...lastRunning.keys()], boxes.map(one => one.id), [...boxSaid.keys()], looseGates.map(one => one.id), mine, paneId === LIST ? await updateShape($) : '', [...gatePressed.keys()], [...askPressed], [...barBoxes], replyTo, replyMark])
}
// and in full, but for what moves on its own as work runs: its running times, its tokens, its commands and their output, which are
// drawn again at most every CALM
const calmCard = (one: Todo) => {
  const { tokens: _tokens, running: _running, newAt: _newAt, bg: _bg, seenJobs: _seen, detached: _detached, lookedIn: _looked, ...rest } = one as Todo & Record<string, unknown>
  return rest
}
const paneContent = async ($: EngineInterface) => JSON.stringify([await read($, view), { ...(await read($, me)), tokens: 0 }, (await read($, reports)).length, (await read($, todos)).map(calmCard), (await read($, others)).map(c => ({ ...c, at: 0, cards: c.cards.map(calmCard), helpers: c.helpers?.map(calmCard) })), await read($, flows), boxes, [...boxSaid], looseGates])
const holdTimes = ($: EngineInterface) => {
  if (!isTyping) recordEvent($, 'hold')
  const made = (typing += 1)
  isTyping = true
  $.clock.after(TYPING, () => void (typing === made && ((isTyping = false), drawAgain($))))
}
const freeTimes = ($: EngineInterface) => {
  const wasHeld = isTyping
  if (wasHeld) recordEvent($, 'let-go')
  typing += 1
  isTyping = false
  if (wasHeld) drawAgain($)
}
// Every pane of the mod's is drawn again, from the values as they are now
const drawFresh = async ($: EngineInterface) => (recordEvent($, 'redraw-all'), $.ui.invalidate('ui.render'))
// What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
const drawnPanes = new Map<string, { shape: string; content: string; at: number; side: string }>()
// What the panel shows from the mod's own memory rather than its values: what the app's prompts, the admin and file gates, the boxes,
// pictures, the update and the presses hold. A change in it draws the panel again within a second
const sideSign = () =>
  JSON.stringify([
    waiting.map(one => [one.agent, one.tool, one.seen ?? 0, one.isPressedNo ?? false]), asked.length, answeredPrompts.length, [...promptSaid], [...promptHeld],
    [...gateHeld], [...gateSaid.keys()], looseGates.map(one => one.id), [...undoneOffers.keys()], boxes.map(one => one.id), doneNotes.length, [...boxSaid], [...boxSent], boxPresses,
    [...pictureIn.keys()], isUpdating, updatedMoment ?? null, presses, loadMark, freshness,
  ])
// While the person uses the panel (scrolls it, moves the focus in it, presses in it, or types) its running times stand still: they
// move again ENGAGED after the person's last move
const ENGAGED = 15_000
let engagedAt = 0
// A click is the focus moving onto a button, then the press: a drawing between them is a new button under the pointer, and the
// click did nothing (16 Nov, recorded: the update note's What's new took several clicks while other chats' writes drew the panel
// twice a second). From the person's focus on one of the panel's buttons until its press, or PRESS_HOLD, the panel is drawn as it
// last was, but for the mod's own calls for a drawing (a box, an ask, a press: freshness), which come at once. Only on the desktop
// surface: in the terminal a press is one key, and the arrows moving the focus would hold the panel still. A drawing asked for
// meanwhile is made once the hold ends
const PRESS_HOLD = 2000
let pressFrom = 0
let pressFresh = 0
let isPressMissed = false
const holdForPress = async ($: EngineInterface) => {
  const at = (pressFrom = await $.clock.now())
  pressFresh = freshness
  $.clock.after(PRESS_HOLD + 20, () => void (pressFrom === at && ((pressFrom = 0), isPressMissed && ((isPressMissed = false), drawAgain($)))))
}
const isPressHeld = (at: number) => pressFrom > 0 && at - pressFrom < PRESS_HOLD && pressFresh === freshness
let calmAt = 0
const engage = async ($: EngineInterface) => void (engagedAt = await $.clock.now())
// Each second: anything new the panel shows draws it again by itself, as the values it read are written; its running times alone
// draw it again only every CALM while work moves, and not while the person uses it
const calmLook = async ($: EngineInterface, isMoving: boolean) => {
  const now = await $.clock.now()
  const list = drawnPanes.get(LIST) ?? { shape: '', content: '', at: 0, side: sideSign() }
  // What the mod holds in memory, or a file the panel read, changed: drawn again at once, as anything new is
  const side = sideSign()
  let isNew = !isTyping && list.side !== side
  for (const [path, text] of isTyping ? [] : drawnFiles) {
    const now = await readOr($, path)
    if (now !== text) (drawnFiles.set(path, now), (isNew = true))
  }
  // Asked for once: a panel the app does not draw just then is not asked for again each second
  if (isNew) return void ((list.side = side), drawAgain($), (list.side = sideSign()))
  // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
  // every CALM too, not each second
  if (!isMoving || isTyping || now - engagedAt < ENGAGED || now - Math.max(list.at, calmAt) < CALM) return
  calmAt = now
  await writeHeldOthers($)
  recordEvent($, 'redraw-calm')
  $.ui.invalidate('ui.render')
}
// Whether an element of the mod's is a box the person types into: an ask's reply box or a key box
const isTypedBox = (element: string | undefined) => /-reply-|^box-.*-field/.test(element ?? '')
// Kept through a reload of the mod, and read back as it loads; drafts for work no longer kept go then
const keepDraft = ($: EngineInterface, key: string, value: string | undefined) =>
  void update($, draftsKept, kept => {
    const next = { ...(kept as Record<string, string>) }
    if (value) next[key] = value
    else delete next[key]
    return next
  }).catch(() => undefined)
// A work's drafts go once its ask is answered
const dropDrafts = ($: EngineInterface, id: string) => {
  for (const key of [...drafts.keys()]) if (key.startsWith(`${id}|`)) drafts.delete(key)
  void update($, draftsKept, kept => Object.fromEntries(Object.entries(kept as Record<string, string>).filter(([key]) => !key.startsWith(`${id}|`)))).catch(() => undefined)
}
const readDrafts = async ($: EngineInterface) => {
  const kept = ((await read($, draftsKept).catch(() => ({}))) ?? {}) as Record<string, string>
  const ids = new Set((await read($, todos)).map(one => one.id))
  const live = Object.entries(kept).filter(([key, value]) => typeof value === 'string' && ids.has(key.split('|')[0] ?? ''))
  for (const [key, value] of live) if (!drafts.has(key)) drafts.set(key, value)
  if (live.length !== Object.keys(kept).length) await update($, draftsKept, () => Object.fromEntries(live))
}
// The last answer given to each work's ask, shown on its card for a while after: sent to the work (which reads a message only at
// its next step, so it says so until that step starts), read by it, or sent to the chat when the work had ended
type Sent = { text: string; ask: string; to: 'sending' | 'work' | 'read' | 'chat' | 'other' | 'lost' | 'failed'; at: number; line?: string; isHeld?: boolean; isCard?: boolean; askAt?: number }
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
const lineOf = (one: Todo) => { const last = [...one.entries].reverse().find(entry => entry.kind !== 'steer'); return last ? `${last.at}:${last.text}` : '' }
// How long the card says what was answered, unless the work writes a newer line first
const ANSWER_SHOWN = 60_000
// The answers every ask offers when the work gave none of its own
const DEFAULT_ANSWERS = ['Done', 'Not now']
// An ask's question is one line of at most ASK_TEXT letters; what it is about, its details, is kept whole up to ASK_DETAILS
const ASK_TEXT = 300
const ASK_DETAILS = 12_000
// Words by which an ask points at an explanation somewhere else (the chat, a report, a message still to come), never at something
// shown, such as a code on a page or a picture
const POINTS_AWAY = /\b(?:as (?:i |we )?(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|agreed|said)|(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|said|wrote) (?:in (?:the|my|this) (?:chat|report|message|result|explanation)|above|below|earlier|before)|(?:see|per) (?:my|the) (?:report|last message|explanation|message above)|in my (?:report|last message)|(?:the )?(?:differences|changes) (?:above|below|i listed)|see (?:above|below)\b)|\(see (?:above|below)\)/i
// How much of what an ask is about the small card shows; Details shows it whole, as does the chat's notice
const DETAILS_ON_CARD = 1500
// How much of it the row the chat's model reads carries: the person has it whole, and the chat stays small
const DETAILS_IN_RELAY = 2000
const sentReplies = new Map<string, Sent>()
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
const pending = new Map<string, string>()
// Asks of another chat's work replied to here in words that hold them, by work and when it asked: acted on from the moment the reply
// is left, until that chat's own file carries the reply
const actingOn = new Map<string, string>()
// The asks of this chat's work already answered, by work and when it asked
const answeredAsks = new Set<string>()
// When the ask each work last had answered and cleared was asked, so a reply in words left after a press reaches only that ask
const answeredAt = new Map<string, number>()
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
// The asks a press answered, by card, as `${at}:${text}`: the panel draws the card answered from the press itself, its buttons and box
// gone in the press's own drawing, before the answer is written; the mark goes once the card's file no longer carries the ask
const askPressed = new Map<string, string>()
// A card as the panel draws it: an ask or a gate already pressed is not drawn as still waiting
const asPressed = (one: Todo): Todo => {
  const isAnswered = Boolean(one.ask && askPressed.get(one.id) === `${one.ask.at}:${one.ask.text}`)
  const admins = one.admins?.filter(gate => !gatePressed.has(gate.id))
  if (!isAnswered && admins?.length === one.admins?.length) return one
  return { ...one, ask: isAnswered ? undefined : one.ask, admins: admins?.length ? admins : undefined }
}
// Where a reply in words is typed. The desktop app keeps moving a pane's window back to a box that holds the cursor inside it, many
// times a second, and reports each move as the person's own scroll (found live, 15 Nov: stuck at the box while typing, a bounce
// once the moves were refused). A pane has no part that stays still, so on a surface whose bar above the prompt takes a box
// (barBoxes: the bar was drawn there with an Input in its table) an ask's reply box is drawn in that bar, a site of its own that the
// pane's scrolling does not reach, and never in the pane. It is there only once the person asks for it: the card's answers end
// with "Reply in your own words", which opens the box in the bar for that card, and Close takes it away again (16 Nov: a box
// always in the bar looked bad, and the person asked for it as one of the options)
// A bar the person folded shows nothing of the mod's, and one of the app's surveys takes its place: neither takes the box, and the
// card has its own again, so a reply in words can always be typed somewhere
const barBoxes = new Set<string>()
const repliesInBar = (surface: string) => barBoxes.has(surface)
// When the bar's box last took the cursor or a letter, 0 once the cursor is known to have left it or its reply was sent: the bar
// holds its drawing that long (band.tsx, barHeld). The app may say nothing when the cursor leaves for the chat's own box, so the
// hold ends by itself BAR_BOX_HELD after the last sign of it
let barBoxAt = 0
const BAR_BOX_HELD = 300_000
const isBarBox = (element: string | undefined) => /^band-.*-reply-/.test(element ?? '')
// The card whose reply box is open in the bar, none when it is closed: opened by the card's "Reply in your own words", closed by
// Close (on the card or in the bar), by the reply sent, by the card answered, or by the bar folding. One box at a time: opened on
// another card it is that card's, and what was half typed is kept for the card it was typed for. Nothing but the person closes or
// moves it while the card asks: when the work puts a new question in place of the one it was opened on (replyMark), the box stays
// as it is, with what is typed in it, and what is sent from it answers the question the work asks then (16 Nov, the person:
// "it should just allow me to keep typing until I myself either close it or open the new question")
let replyTo = ''
let replyMark = ''
const isReplyOpen = (one: Todo) => Boolean(replyTo && one.id === replyTo && one.ask)
// The open box's own name and what is typed in it, the same through a new question of its work
const barBoxKey = (id: string) => `band-${id}-reply-${replies.get(id) ?? 0}-${replyMark}`
const barDraft = (id: string) => `${id}|${replyMark}`
// This chat's cards that wait for an answer
const asksForBar = (cards: Todo[]) => cards.filter(one => !one.parentId && !one.chat && Boolean(asPressed(one).ask) && !isActingOnReply(one))
const barTarget = (cards: Todo[]) => (replyTo ? asksForBar(cards).find(isReplyOpen) : undefined)
// The bar's own id on each surface, as its drawing is asked for: where the cursor is put when the box opens
const barIds = new Map<string, string>()
// What was typed in the bar's box is its card's: when the work has since put a new question in place of the one the box was
// opened on, the words are shown under that question too, in the box as it is opened again and in the card's own box when the
// bar folds. Only the words of the box the person last had open for that card (barLeft), never those of an older question
const barLeft = new Map<string, string>()
const carryDraft = ($: EngineInterface, one: Todo, from: string | undefined) => {
  if (!one.ask || !from) return
  const to = draftOf(one.id, one.ask)
  const typed = drafts.get(from)
  if (from === to || !typed || drafts.get(to)) return
  drafts.set(to, typed)
  keepDraft($, to, typed)
  drafts.delete(from)
  keepDraft($, from, undefined)
}
// A reply sent from the bar's box answers what its card asks as it is sent: the box may have been drawn for an earlier question.
// On its way from the press itself, as an answer from the card is (answersOnWay)
const sendFromBar = ($: EngineInterface, id: string, value: string) => {
  const run = (async () => {
    const one = (await read($, todos)).find(card => card.id === id)
    if (one?.ask && value.trim()) await answerAsk($, one, value, true)
  })()
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(() => undefined)
  return run
}
// Opens the bar's reply box for a card, or closes it. Opening it, the cursor is asked into the box: the app gives it only where
// the bar already holds the keys, so where it does not the person clicks the box
const openReply = ($: EngineInterface, one: Todo | undefined, surface: string) => {
  if (replyTo) barLeft.set(replyTo, barDraft(replyTo))
  if (one) (carryDraft($, one, barLeft.get(one.id)), barLeft.delete(one.id))
  replyTo = one?.ask ? one.id : ''
  replyMark = one?.ask ? askMark(one.ask) : ''
  barBoxAt = 0
  presses += 1
  redraw($)
  const ask = one?.ask
  const bar = barIds.get(surface)
  if (!one || !ask || !bar) return
  void $.ui
    .focus({ requestId: bar, key: barBoxKey(one.id) })
    .then(r => recordEvent($, 'focus-call', { deny: r.deny ?? null }))
    .catch(err => recordEvent($, 'focus-call', { failed: String(err).slice(0, 80) }))
}
const answerNow = async ($: EngineInterface, one: Todo, choice: string, isReply = false) => {
  // Another chat's ask is answered only in that chat: no file carries an answer to it, from this Mac or another
  if (one.chat) return
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
  // Answered in the press's own drawing, before anything is awaited: what was pressed, on its way
  const mark = `${ask.at}:${ask.text}`
  askPressed.set(one.id, mark)
  // Its reply box in the bar goes with the answer, and is closed when the same work asks again
  if (replyTo === one.id) ((replyTo = ''), (replyMark = ''), (barBoxAt = 0))
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at: Infinity, line, isCard: true, askAt: ask.at })
  if (isReply) freeTimes($)
  redraw($)
  let isCleared = false
  let steerAt = 0
  try {
    const at = await $.clock.now()
    steerAt = at
    // Set afresh on each run of the change, as it runs again on a list written meanwhile
    await changeTodos($, list =>
      ((isCleared = false), list).map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isCleared = true), { ...card, ask: undefined, entries: [...card.entries, { at, kind: 'steer' as const, text: isReply ? said : `${said} — to: ${ask.text}` }].slice(-ENTRIES_KEPT) }) : card)),
    )
    if (askPressed.get(one.id) === mark) askPressed.delete(one.id)
    // The work has since asked something else, or it was answered elsewhere: nothing went, and the card shows what it carries now
    if (!isCleared) return void (sentReplies.get(one.id)?.to === 'sending' && sentReplies.delete(one.id), redraw($))
    await answerCleared($, one, ask, said, isReply, target, at, line)
  } catch (err) {
    // It did not reach the work: the card says so, and its buttons come back to be pressed again, with nothing of the answer left
    if (askPressed.get(one.id) === mark) askPressed.delete(one.id)
    answeredAsks.delete(asked)
    if (answeredAt.get(one.id) === ask.at) answeredAt.delete(one.id)
    if (pending.get(target) === one.id) pending.delete(target)
    const isBack = !isCleared || (await changeTodos($, list => list.map(card => (card.id === one.id && !card.ask ? { ...card, ask, entries: card.entries.filter(entry => !(entry.kind === 'steer' && entry.at === steerAt)) } : card))).then(() => true).catch(() => false))
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'failed', at: await $.clock.now().catch(() => 0), line, isCard: true, askAt: ask.at })
    // and when even that could not be written, the chat is told, so the ask is not lost unseen
    if (!isBack) $.ui.log(`Your answer “${cut(said, 120)}” to "${titleOf(one)}" (${ask.text}) didn't reach Claude, and the question couldn't be put back on its card. Type your answer in this chat instead.`)
    redraw($)
    throw err
  }
}
// The rest of an answer once its ask is cleared from the card's file: to the work, or to wake it
const answerCleared = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, isReply: boolean, target: string, at: number, line: string) => {
  answeredAt.set(one.id, ask.at)
  dropDrafts($, one.id)
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at, line, isCard: true, askAt: ask.at })
  redraw($)
  // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  const working = (await read($, todos)).find(card => card.id === one.id)?.status === 'working'
  const to = isReply ? `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}` : `${who(true)} pressed "${said}" in answer to your question: ${ask.text}`
  // Work whose run ended a moment ago refuses the line: the chat, which carries it on, gets it instead
  // Marked on its way once written, so a step that began before it never counts as reading it
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) {
    writtenIn($, target, one.id)
    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line, isCard: true, askAt: ask.at })
    redraw($)
  } else await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line, isCard: true, askAt: ask.at })
  // Said in the chat only once the answer is on its way
  void askGone($, one, said)
}
// A reply in the person's own words that does not settle the ask: the ask stays on the card, its question with the reply under it,
// and the work is told so; its card stays among the running cards while the work acts on it. The person has answered, so its
// buttons and box go at once, and come back only when the work asks again, or ends with the ask still open
const holdAsk = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, target: string) => {
  // The same words twice at once count once; typed again later, after an earlier reply, they go again
  const key = `${one.id}:${ask.at}:${ask.text}:reply:${ask.replied?.at ?? ''}:${said}`
  if (answeredAsks.has(key)) return
  answeredAsks.add(key)
  const at = await $.clock.now()
  let isHeld = false
  // Acted on from now while the work is started again with it; never on a card no run of its own will end
  const listed = await read($, todos)
  const isWaking = listed.find(card => card.id === one.id)?.status !== 'working' && listed.find(card => card.id === target)?.status !== 'working'
  await changeTodos($, list =>
    ((isHeld = false), list).map(card => (card.id === one.id && card.ask?.at === ask.at && card.ask.text === ask.text ? ((isHeld = true), { ...card, ask: { ...card.ask, replied: { text: said, at, ...(isWaking ? { isWaking } : {}) } }, entries: [...card.entries, { at, kind: 'steer' as const, text: said }].slice(-ENTRIES_KEPT) }) : card)),
  )
  if (!isHeld) return
  // The box goes with the buttons, as after a press; what was typed in it is not kept for the next ask
  dropDrafts($, one.id)
  // A new box, empty, whenever it comes back: the surface keeps what was typed in a box it finds again by its key
  replies.set(one.id, (replies.get(one.id) ?? 0) + 1)
  freeTimes($)
  const line = lineOf(one)
  sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at, line, isCard: true, askAt: ask.at })
  redraw($)
  // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
  $.clock.after(ANSWER_SHOWN + 50, () => drawAgain($))
  // Said in the chat once; the ask is then done with there, so the work asking again is sent to the chat afresh
  if (inChat.has(one.id)) (inChat.delete(one.id), void sayInChat($, named(ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`)), ASK_REPLIED(titleOf(one), `“${cut(said, 120)}”`, true)))
  const working = (await read($, todos)).find(card => card.id === target)?.status === 'working'
  const to = `${who(true)} replied to your question ("${ask.text}"), in their own words: ${said}\n${named(REPLY_HOLDS)}`
  const told = working ? await tell($, target, to) : undefined
  if (told && !told.deny) return void (writtenIn($, target, one.id), redraw($))
  await toEnded($, one, target, `${to}\n${RESUMED_BY_ANSWER}`, { text: said, ask: ask.text, at, line, isCard: true, askAt: ask.at })
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
  // A reply that holds its ask is acted on from now: no answers on the card while its work is started again with it
  await changeTodos($, list => list.map(card => (card.id === one.id && card.ask?.replied?.text === sent.text && !card.ask.replied.isWaking && card.status !== 'working' ? { ...card, ask: { ...card.ask, replied: { ...card.ask.replied, isWaking: true } } } : card)))
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
  // Work the person stopped is not woken by an answer that was on its way
  if (isHeld((await read($, todos)).find(one => one.id === wake.target))) return void (await log($, `work ${wake.target} not started again with an answer: the person stopped it`))
  const r = (await isReplaced($))
    ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' }
    : await sendOwn($, { to: { agentId: wake.target }, text: wake.text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
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
const writtenIn = ($: EngineInterface, target: string, card: string) => {
  pending.set(target, card)
  void replyWaiting($, target)
  for (const key of startedBy) if (key.startsWith(`${card}:`)) startedBy.delete(key)
}
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
const wakeCard = async ($: EngineInterface, target: string) => {
  const now = await $.clock.now()
  let isWoken = false
  await changeTodos($, list => ((isWoken = false), list).map(card => (card.id !== target || card.status === 'working' ? card : ((isWoken = true), resumed(card, now)))))
  if (isWoken) endedByHandback.delete(target)
}
const wakeFailed = async ($: EngineInterface, { target, answers }: (typeof wakes)[number], reason: string) => {
  if (answers.some(({ one }) => pending.get(target) === one.id)) pending.delete(target)
  await log($, `work ${target} not started again with an answer: ${reason}`)
  // An ask its reply held waits on the person again, every answer back
  const ids = new Set(answers.map(({ one }) => one.id))
  await changeTodos($, list => list.map(card => (ids.has(card.id) && card.ask?.replied?.isWaking ? { ...card, ask: { ...card.ask, replied: { text: card.ask.replied.text, at: card.ask.replied.at } } } : card)))
  for (const { one, sent } of answers) {
    sentReplies.set(one.id, { ...sent, to: 'chat' })
    const said = named(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text))
    $.ui.log(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text, true))
    await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: `${said}\n${named(ANSWER_FOR_CHAT_RELAY)}` }] } }).catch(err => log($, `chat not told of an answer: ${String(err)}`))
  }
  redraw($)
}
// Every ask of this chat's work is also sent into the chat, as a message from the mod, with its answers and pictures: the chat
// shows it to the person, and an answer they type there goes to the work as a press on the card does. Kept by card, so an ask
// answered or withdrawn on the card is said in the chat too, and the same ask is never sent twice
const inChat = new Map<string, string>()
const askKey = (ask: NonNullable<Todo['ask']>) => JSON.stringify([ask.text, ask.details ?? '', ask.choices ?? [], ask.pictures ?? [], ask.copy ?? ''])
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
  for (const line of surfaces.length && surfaces.every(s => s === 'terminal') ? notice.split('\n').filter(line => line.trim()) : [notice]) $.ui.log(line)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(err => (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, `chat not told of an ask: ${String(err)}`)))
}
// A line in the chat the person sees (the mod's notice, which the model never reads) and its model reads (a row the person does not
// see), sent with no turn of its own. The notice is the mod's log line: the desktop app leaves out a system row the mod appends
const sayInChat = async ($: EngineInterface, text: string, shown = text) => {
  $.ui.log(shown)
  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } }).catch(err => log($, `chat not told: ${String(err)}`))
}
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
const askGone = async ($: EngineInterface, one: Todo, said?: string) => {
  if (!inChat.has(one.id)) return
  inChat.delete(one.id)
  await sayInChat($, named(said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`)), said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), `“${cut(said, 120)}”`, true))
}
// The person's answer typed in the chat, passed on by the chat to the work: once on its way the card stops asking and says what was
// answered, and a helper that asked is told too when the chat sent it to the work it helps; refused, the ask stays to be answered
const answeredInChat = async ($: EngineInterface, a: { card: Todo; ask: NonNullable<Todo['ask']>; key: string; words: string; at: number }, to: string, isSent: boolean) => {
  if (!isSent) return void answeredAsks.delete(a.key)
  // Words that do not settle an ask with buttons of its own leave it open, as a reply on the card does; a later answer still counts
  const isHeld = !settles(a.ask, a.words, true)
  // Either way the ask is done with in the chat: the work asking again is sent to it afresh
  if (isHeld) answeredAsks.delete(a.key)
  inChat.delete(a.card.id)
  await changeTodos($, all => all.map(one => (one.id === a.card.id && one.ask?.at === a.ask.at && one.ask.text === a.ask.text ? { ...one, ask: isHeld ? { ...one.ask, replied: { text: a.words, at: a.at, ...(one.status === 'working' ? {} : { isWaking: true }) } } : undefined } : one)))
  dropDrafts($, a.card.id)
  sentReplies.set(a.card.id, { text: a.words, ask: a.ask.text, to: 'work', at: a.at, line: lineOf(a.card) })
  writtenIn($, to, a.card.id)
  const helper = a.ask.from && a.ask.from !== to ? (await read($, todos)).find(one => one.id === a.ask.from && one.status === 'working') : undefined
  if (helper) await tell($, helper.id, `${who(true)} answered your question ("${a.ask.text}") in the chat, in their own words: ${a.words}`)
  redraw($)
}
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
const replyAfter = async ($: EngineInterface, one: Todo, said: string, asked: string) => {
  const told = one.status === 'working' ? await tell($, one.id, `${who(true)} added, in their own words, to their answer to your question ("${asked}"): ${said}`) : undefined
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
// The person's words written into work under way are marked beside the file its wait on helpers reads, so that wait comes back at
// once and the work reads them; the mark goes at the work's next step, which reads them
const replyMarked = new Set<string>()
// (a mark an earlier copy of the mod left, before a reload, is looked for once at each work's first step here)
const replyLooked = new Set<string>()
const replyWaiting = async ($: EngineInterface, agentId: string) => {
  if (!dir) return
  const at = await $.clock.now()
  await $.fs.write(`${rollPath(agentId)}.reply`, `${at}\n`).catch(err => log($, `reply mark for ${agentId} not written: ${String(err)}`))
  replyMarked.add(agentId)
}
const replyTaken = async ($: EngineInterface, agentId: string) => {
  if (!dir) return
  const isFirst = !replyLooked.has(agentId)
  replyLooked.add(agentId)
  if (!replyMarked.delete(agentId) && !(isFirst && (await readOr($, `${rollPath(agentId)}.reply`)).trim())) return
  await $.fs.write(`${rollPath(agentId)}.reply`, '').catch(() => undefined)
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
  await toEnded($, one, agentId, `${who(true)} ${isHeld ? 'replied to' : 'answered'} your question ("${sent.ask}"), and you ended before reading it: ${sent.text}${isHeld ? `\n${named(REPLY_HOLDS)}` : ''}\n${RESUMED_BY_ANSWER}`, sent)
}
// An answer given on the card in the last ANSWER_SHOWN: the card stays where it was meanwhile (answeredSince), and says it
const heldAnswer = (one: Todo, now: number) => {
  const sent = one.chat ? undefined : sentReplies.get(one.id)
  return sent?.isCard && sent.to !== 'lost' && now - sent.at < ANSWER_SHOWN ? sent : undefined
}
// A reply written into work while one of its calls is held open is read only when that call ends: the card names it and how long it
// has run, so a wait is never taken for a reply lost
const waitsBehind = (one: Todo, at: number, now: number) => {
  // the call held open by the very work the reply was written into (the helper that asked, or the work), while it is unread
  const target = [...pending].find(([, card]) => card === one.id)?.[0]
  const running = target !== undefined && one.status === 'working' ? runningOf(target) : undefined
  if (!running || running.at > at) return ''
  const name = running.label ? `“${cut(describedOf(running.label).text || running.label, 50)}”` : running.what.replace(/ running$/, '')
  return `waiting: Claude will see it when ${name} ends (running ${took(now - running.at)})`
}
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
const sentLine = (one: Todo, now: number) => {
  const sent = sentReplies.get(one.id)
  // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
  const replied = one.ask?.replied
  if (replied && !(sent && sent.ask === one.ask?.text && (sent.text === replied.text || sent.isHeld))) return `✓ You replied “${cut(replied.text, 60)}”${isActingOnReply(one) ? ' · Claude is working on it' : '; Claude still has this question'}`
  if (!sent) return ''
  if (sent.to === 'failed') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}” didn't reach Claude. Press it again` : ''
  if (sent.to === 'lost') return one.ask?.text === sent.ask ? `Not sent: “${cut(sent.text, 60)}”. That Mac couldn't be reached; answer it in its own chat` : ''
  const newer = lineOf(one) !== sent.line
  const isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || one.ask.replied?.text === sent.text))
  if ((one.ask && !isHeld) || (!isHeld && (newer || now - sent.at > ANSWER_SHOWN))) return ''
  const how = {
    sending: 'Sending to Claude…',
    work: waitsBehind(one, sent.at, now) || 'Claude will see this after its current step',
    read: 'Claude has read it',
    chat: 'left in the chat, which continues the task',
    other: `sent to the chat "${cut(one.chat ? chatName(one.chat) : 'it runs in', 40)}", whose task will see it after its current step`,
  }[sent.to]
  if (isHeld) return `✓ You replied “${cut(sent.text, 60)}” · ${sent.to === 'read' ? (one.status === 'working' ? 'Claude is working on it' : 'Claude has read it') : how}${isActingOnReply(one) ? '' : '; Claude still has this question'}`
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
// The same without how its jobs and helpers move, which alone writes the file at most every LOOK_EVERY
let sharedCore = ''
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
  const list = await read($, todos)
  // Each card and helper carries how its jobs stand, as this chat reads them, so another chat's Details shows them as this one does
  const withSeen = (one: Todo): Todo => {
    const seen = Object.fromEntries(
      [...(one.bg ?? []), ...(one.detached ?? [])].flatMap(job => {
        const s = jobLog.get(job.id)
        return s ? [[job.id, { latest: s.latest, ...(s.pct ? { pct: s.pct } : {}), ...(s.done ? { done: s.done } : {}), ...(s.total ? { total: s.total } : {}), ...(s.wroteAt ? { wroteAt: s.wroteAt } : {}), ...(s.tail?.length ? { tail: s.tail } : {}), ...(s.words ? { words: s.words } : {}), ...(s.isOwn ? { isOwn: true } : {}), ...(s.isEarlier ? { isEarlier: true } : {}), ...(s.isEmpty ? { isEmpty: true } : {}), ...(s.target ? { target: s.target } : {}) }]] : []
      }),
    )
    return Object.keys(seen).length ? { ...one, seenJobs: seen } : one
  }
  const cards = shareable(list, now).map(withSeen)
  const helpers = shareableHelpers(list, cards).map(withSeen)
  const jobsSign = [...cards, ...helpers].map(one => Object.values(one.seenJobs ?? {}).map(s => `${s.latest}:${s.tail?.at(-1) ?? ''}:${Math.floor((s.wroteAt ?? 0) / 30_000)}:${s.target ?? ''}`).join('|')).join(' ')
  const shareOf = ({ tool: _tool, agent: _agent, snippet: _snippet, seen: _seen, isTold: _told, input: _input, ...p }: Waiting): Prompt => p
  const prompts: Prompt[] = waiting.map(shareOf)
  // Answered prompts go apart, so a chat of an older version, which reads only `prompts`, never shows one as still open
  const answeredNow: Prompt[] = answeredShown(now).map(shareOf)
  // Helpers are signed by what their Details shows, not by the context they hold, which moves at every step
  const helpersSign = JSON.stringify(helpers.map(one => [one.id, one.status, one.items, one.entries.at(-1)?.text ?? '']))
  const core = `${title}\n${JSON.stringify(myLink ?? null)}\n${signOf(cards)}\n${prompts.map(one => one.id).join(' ')}\n${answeredNow.map(one => `${one.id}:${one.answered}:${one.isRunning ? 1 : 0}`).join(' ')}`
  const sign = `${core}\n${helpersSign}\n${jobsSign}`
  if (sign === sharedSign && now - sharedAt < BEAT) return
  if (core === sharedCore && now - sharedAt < LOOK_EVERY) return
  const s: Shared = { chat: id, title, folder: cwd, host: '', at: now, cards, ...(helpers.length ? { helpers } : {}), ...(prompts.length ? { prompts } : {}), ...(answeredNow.length ? { answeredPrompts: answeredNow } : {}), ...(myLink ? { link: myLink } : {}) }
  // Ended work is written apart, under `ended`: a chat still running a version from before ended work was shared reads `cards` only,
  // and would show what is there as running for good
  const isLive = (one: Todo) => one.status === 'working' || Boolean(one.ask)
  const ended = cards.filter(one => !isLive(one))
  // Every kept key and admin password is hidden in it, as in what a tool answers; a file that could not be checked is not written
  const text = await hiddenJson($, JSON.stringify({ ...s, cards: cards.filter(isLive), ...(ended.length ? { ended } : {}) }))
  if (text === undefined) return void log($, "this chat's file not shared: it could not be checked for kept keys")
  await $.fs.write(ownLive(id), text)
  sharedSign = sign
  sharedCore = core
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
  const seen = endSeen.get(`${one.id}:${one.endedAt}`) ?? 0
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
  for (const s of found) for (const card of s.cards.filter(one => one.status === 'working')) lastRunning.set(remoteId(s, card.id), { chat: chatKey(s), card, at: now, of: { ...s, cards: [], prompts: undefined, answeredPrompts: undefined } })
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
      // By its end too: work that ends, goes on and ends again between two reads has a moment for each end
      const key = `${remoteId(s, card.id)}:${card.endedAt}`
      ids.add(key)
      if (endSeen.has(key)) continue
      const isNew = now - card.endedAt < SEEN_ENDING
      endSeen.set(key, isNew ? now : 0)
      if (isNew) $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
    }
  for (const key of [...endSeen.keys()]) if (!ids.has(key)) endSeen.delete(key)
  const isAppChanged = found.some(s => s.host) && (await readAppIds($, now).catch(err => (void log($, `app's chats not listed: ${String(err)}`), false)))
  const next = ordered(found)
  const was = await read($, others)
  if (JSON.stringify(next) === JSON.stringify(was)) {
    othersHeld = undefined
    if (`${isMulti()}:${selfName()}` !== wasSelf || isAppChanged || isOffChanged) redraw($)
  } else if (calmOthers(next) !== calmOthers(was) || next.some(s => now - (was.find(w => w.host === s.host && w.chat === s.chat)?.at ?? 0) > STALE / 2)) {
    othersHeld = undefined
    await update($, others, () => next)
  } else othersHeld = next
}
// Other chats' work as the panel shows it, but for what moves by itself as it runs (their beats, times, tokens and output): a change
// in only that is not written at once, as each write draws the panel afresh under the pointer. It is held here and written with the
// panel's running times (calmLook), and at the latest once a chat's beat is half way to being taken for gone
let othersHeld: Shared[] | undefined
const calmOthers = (list: Shared[]) => JSON.stringify(list.map(c => ({ ...c, at: 0, cards: c.cards.map(calmCard), helpers: c.helpers?.map(calmCard) })))
const writeHeldOthers = async ($: EngineInterface) => {
  const held = othersHeld
  othersHeld = undefined
  if (held) await update($, others, () => held)
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
  const r = await openOn($, url)
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

// A file left for another chat (a request to open it), written under another name and then renamed, so it is never read half-written
const answeredHere = new Set<string>()
const leaveHere = ($: EngineInterface, folder: string, name: string, body: unknown) =>
  $.fs
    .write(`${liveDir()}/${folder}/${name}.part`, JSON.stringify(body))
    .then(() => $.process.run(['mv', '-f', `${liveDir()}/${folder}/${name}.part`, `${liveDir()}/${folder}/${name}.json`]))
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
// An answer some file leaves for this chat's work, from another chat's panel here or carried from another Mac, answers nothing: a file
// carries no proof of who wrote it, and anything running as the person on this Mac, or on a Mac named under macs, can write one. An
// ask (as a prompt of Claude Code's) is answered only in its own chat, by a press or a reply in that chat's own panel, which is in this
// code's memory. A file left there (by a version before this one) is put away unread, and said in the log
const readAnswers = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const folder = `${liveDir()}/${ANSWERS}/${id}`
  const all = (await $.fs.list(folder).catch(() => [])).filter(entry => entry.name.endsWith('.json') || entry.name.endsWith('.part'))
  if (!all.length) return
  for (const entry of all) await $.process.run(['rm', '-f', `${folder}/${entry.name}`]).catch(() => undefined)
  await log($, `${all.length === 1 ? 'an answer' : `${all.length} answers`} left in a file put away unread: an ask is answered only in its own chat`)
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
  const r = await $.process.run(isLinux ? ['hostname', '-s'] : ['scutil', '--get', 'LocalHostName'], { timeoutMs: 5_000 }).catch(() => ({ exitCode: -1, stdout: '' }))
  localName = keyOf(r.exitCode === 0 ? r.stdout.trim() : '') || 'mac'
  return localName
}
// What a trip leaves in this Mac's copy: the fetch, when it was fetched and last tried, the answers it carried (put away there on
// the next trip) and the names of those carried lately, so an answer carried twice is left for its chat once
type Fetched = { mac: string; text: string; fetchedAt: number; triedAt: number; acks?: string[]; seen?: string[] }
// This Mac's own chats' files, as handed to the other Macs: those written in the last three minutes, never another Mac's copies
const ownFiles = async ($: EngineInterface, now: number) => {
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && !(entry.mtimeMs && now - entry.mtimeMs > 180_000))
  return (await Promise.all(listed.map(entry => readOr($, `${liveDir()}/${entry.name}`)))).filter(text => text.trim().startsWith('{')).map(forOtherMac)
}
// What leaves this Mac for another: a chat's file less every command and text that work runs or sends. Gone are the text an ask
// gives to paste (a code, a token or a command), the command or text a prompt shows whole and the words of its line that came from
// the command, the command a card shows running, sent to the background or detached (and the log it writes), and the command, change
// or release an admin, file or release press is asked for: a card there says what kind of thing waits, and what it is in the work's
// own words where it gave some, never the command. All of it stays on this Mac's own cards and in its chats
const AS_COMMAND = 'a command'
const forOtherMac = (text: string) => {
  try {
    const one = JSON.parse(text) as { cards?: unknown; ended?: unknown; prompts?: unknown; answeredPrompts?: unknown }
    type Run = { what?: unknown; cmd?: unknown; label?: unknown; log?: unknown; pid?: unknown }
    // The work's own words for what runs, never a line of the command itself
    const said = (run: Run) => {
      const what = typeof run.what === 'string' ? run.what : ''
      const cmd = typeof run.cmd === 'string' ? run.cmd : ''
      const label = typeof run.label === 'string' ? run.label : ''
      const first = cmd.split('\n')[0]?.trim() ?? ''
      const isCommand = !what || (first && (first.startsWith(what.trim()) || what.trim().startsWith(first.slice(0, 40)) || cmd.includes(what.trim())))
      return isCommand ? label && !cmd.includes(label) ? label : AS_COMMAND : what
    }
    const run = (r: unknown) => {
      if (!r || typeof r !== 'object') return r
      const { cmd: _cmd, label: _label, log: _log, pid: _pid, ...rest } = r as Run & Record<string, unknown>
      return 'cmd' in (r as object) ? { ...rest, what: said(r as Run), ...('log' in (r as object) ? { cmd: '', log: '' } : {}) } : rest
    }
    const card = (c: unknown) => {
      if (!c || typeof c !== 'object') return c
      const t = c as Record<string, unknown> & { ask?: Record<string, unknown>; running?: unknown; bg?: unknown; detached?: unknown; admins?: unknown }
      const ask = t.ask ? (({ copy: _copy, ...rest }) => rest)(t.ask) : undefined
      return {
        ...t,
        ...(t.ask ? { ask } : {}),
        ...(t.running ? { running: run(t.running) } : {}),
        ...(Array.isArray(t.bg) ? { bg: t.bg.map(run) } : {}),
        ...(Array.isArray(t.detached) ? { detached: t.detached.map(run) } : {}),
        ...(Array.isArray(t.admins) ? { admins: t.admins.map(g => (g && typeof g === 'object' ? { ...(g as object), command: '' } : g)) } : {}),
      }
    }
    const prompt = (p: unknown) => {
      if (!p || typeof p !== 'object') return p
      const { detail: _detail, ...rest } = p as { detail?: unknown; text?: unknown; kind?: unknown }
      // "Run a command: <its words>": only the kind of thing it asks, as the words after it may be the command
      return typeof rest.text === 'string' && rest.kind === 'allow' ? { ...rest, text: rest.text.split(': ')[0] } : rest
    }
    const each = (list: unknown, fn: (one: unknown) => unknown) => (Array.isArray(list) ? list.map(fn) : list)
    return JSON.stringify({ ...one, cards: each(one.cards, card), ended: each(one.ended, card), prompts: each(one.prompts, prompt), answeredPrompts: each(one.answeredPrompts, prompt) })
  } catch {
    return text
  }
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
      // An answer carried back from that Mac answers nothing here: an ask is answered only in its own chat, and that Mac (or anything
      // that can write its outbox) proves nothing of who pressed it. Each is only put away there, on the next trip
      const names = carried.map(one => one.name)
      if (names.some(name => !kept.seen.includes(name))) await log($, `answers carried from ${mac} put away unread: an ask is answered only in its own chat`)
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
    ...offChats.map(one => `“${offName(one)}”${one.host ? ` on ${macName(one.host)}` : ' on this Mac'} runs without Claudopus: its tasks, questions and results don't reach any panel. A chat started after the app is reopened has it.`),
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
      if (card.ask && Math.abs(now - card.ask.at) < AFAR_FRESH) await tellOnce($, `ask-${id}-${card.ask.at}`, () => aloud($, 'ask', `${titleOf(card)} has a question for you`, `${card.ask?.text ?? ''} · ${where}`, `ask-${id}`, opens))
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
// The box's wording is the panel's own, made from the request's fields: its kind (admin or secret), the Mac (host) or the key's name
// (name), and why it asks again (again). A request carries no text that is shown: one with any field the panel does not know how to
// word (a host on a key, a name on a password), a kind it does not know or a host or name it would not take, is drawn as nothing;
// any other field is left unread. A planted request so shows only what the runners would ask. This stops slips and common tricks;
// it is no wall against code set on getting round it
type Asked = { id: string; text: string; at: number; chat?: string; command?: string; key?: string; call?: string }
// The Bash calls of this chat that run bin/admin or bin/secret, by call id, with their command: a box is drawn only for a request of
// this chat's own while one of them runs (one sent to the background for BOX_OLD after it began), and says which command asked. A
// request no runner of this chat could have made, however it is worded, is drawn nowhere
const runnerCalls = new Map<string, { command: string; at: number; until: number }>()
const runnerBegun = (id: string, command: string, at: number) => void runnerCalls.set(id, { command, at, until: Infinity })
const runnerEnded = (id: string, isBackground: boolean, at: number) => {
  const one = runnerCalls.get(id)
  if (!one) return
  if (isBackground) runnerCalls.set(id, { ...one, until: one.at + BOX_OLD })
  else runnerCalls.delete(id)
  for (const [key, other] of [...runnerCalls]) if (other.until < at) runnerCalls.delete(key)
}
// The command that asked: the one of this chat's running runners begun last before the request
const runnerOf = (at: number, now: number) => [...runnerCalls].map(([call, one]) => ({ ...one, call })).filter(one => one.until >= now && one.at <= at + BOX_SKEW).sort((a, b) => b.at - a.at)[0]
const BOX_SKEW = 60_000
// What the runners take as a Mac (an ssh host or alias, perhaps with a user) and as a key's name
const BOX_HOST = /^(?:here|[A-Za-z0-9_][A-Za-z0-9._:@-]{0,199})$/
const BOX_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,199}$/
// The public half of the key bin/admin made for one request, as DER in base64: an RSA key of 2048 bits or more
const BOX_KEY = /^MII[A-Za-z0-9+/]{280,1400}={0,2}$/
// The key each request was first seen with: a request whose key changed after that is drawn nowhere, so a key put in its place by
// something else gets nothing typed for the runner
const boxKeys = new Map<string, string>()
// What was typed, sealed to the runner's key (RSA-OAEP, SHA-256) by openssl, which only the runner that asked can open: the value
// on openssl's stdin, the key on a pipe of its own, so neither is ever in a file or a command line but the key, which is public
const SEAL_FOR = 'PATH=/usr/bin:/bin; openssl pkeyutl -encrypt -pubin -keyform DER -inkey <(printf %s "$1" | openssl base64 -d -A) -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | openssl base64 -A'
const sealedFor = async ($: EngineInterface, key: string, value: string) => {
  const r = await $.process.run(['/bin/bash', '-c', SEAL_FOR, 'sh', key], { stdin: value, timeoutMs: 15_000 }).catch(() => undefined)
  const out = r?.exitCode === 0 ? r.stdout.trim() : ''
  return /^[A-Za-z0-9+/]{300,}={0,2}$/.test(out) ? out : ''
}
const BOX_AGAIN: Record<string, string> = {
  refused: 'That password was refused. ',
  short: 'That was shorter than 4 characters. ',
  control: 'That held a line break or another control character. ',
}
// The wording for a request, or undefined for one the panel does not draw
const boxWording = (one: Record<string, unknown>): string | undefined => {
  // A reason it does not know is left out
  const again = typeof one.again === 'string' && Object.hasOwn(BOX_AGAIN, one.again) ? BOX_AGAIN[one.again]! : ''
  if (one.kind === 'admin') {
    // A password is sent only sealed to the key the runner made for this one request: a request with none is drawn nowhere
    if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined || typeof one.key !== 'string' || !BOX_KEY.test(one.key)) return undefined
    const mac = one.host === 'here' ? thisMac() : one.host
    return `${again}Claudopus needs the admin password of ${mac} to run the admin command below. Nothing is saved: it goes only to that command, and the next one asks again.`
  }
  if (one.kind === 'secret') {
    if (one.host !== undefined) return undefined
    // No name: the first box of a key saved by hand asks its name
    if (one.name === undefined) return 'Name of the key to save, such as GITHUB_TOKEN. Claude will use it by this name.'
    if (typeof one.name !== 'string' || !BOX_NAME.test(one.name)) return undefined
    return `${again}Claudopus needs ${one.name}. It is saved only in ${keptWhere()}. Claude uses it by name, and it is hidden in anything a command prints.`
  }
  return undefined
}
let boxes: Asked[] = []
// What the person just did with a box or an admin command, shown a minute at the top of the panel where it was: what they did and
// what happens now, so nothing that needed them just vanishes
// A note tied to the call the press let go (`call`) goes once that call ends, never before DONE_LEAST so it can be read, and at
// most DONE_LONGEST while it runs; one with no call is shown DONE_SHOWN
// `card`: the work whose card held the gate; the note is drawn in that card, not at the top
type DoneNote = { id: string; head: string; said: string; what: string; at: number; isOn?: boolean; call?: string; endedAt?: number; card?: string }
let doneNotes: DoneNote[] = []
const DONE_SHOWN = 60_000
const DONE_LEAST = 15_000
const DONE_LONGEST = 30 * 60_000
const isNoteShown = (one: DoneNote, at: number) =>
  !one.call ? at - one.at < DONE_SHOWN : one.endedAt === undefined ? at - one.at < DONE_LONGEST : at < Math.max(one.endedAt, one.at + DONE_LEAST)
// The calls that have ended, so a note made after its call ended (a runner sent to the background) is over from the start
const callsEnded = new Set<string>()
const noteDone = async ($: EngineInterface, note: Omit<DoneNote, 'at'>) => {
  // Drawn from the press itself: in the list before anything is awaited, shown until the clock dates it a moment later
  doneNotes = [...doneNotes.filter(one => one.id !== note.id), { ...note, at: Infinity }]
  drawAgain($)
  const at = await $.clock.now()
  const made = { ...note, at, ...(note.call && note.endedAt === undefined && callsEnded.has(note.call) ? { endedAt: at } : {}) }
  doneNotes = [...doneNotes.filter(one => one.id !== note.id && isNoteShown(one, at)), made].slice(-6)
  drawAgain($)
  // Drawn again as its time ends, so it goes with nothing else to redraw the panel
  $.clock.after((!made.call ? DONE_SHOWN : made.endedAt !== undefined ? DONE_LEAST : DONE_LONGEST) + 100, () => drawAgain($))
}
// The call a note tells of has ended: what it said is over, so the note goes (after DONE_LEAST from its press)
const noteCallEnded = async ($: EngineInterface, call: string) => {
  callsEnded.add(call)
  if (callsEnded.size > 200) callsEnded.delete(callsEnded.values().next().value ?? '')
  if (!doneNotes.some(one => one.call === call && one.endedAt === undefined)) return
  const at = await $.clock.now()
  doneNotes = doneNotes.map(one => (one.call === call && one.endedAt === undefined ? { ...one, endedAt: at } : one))
  drawAgain($)
  const last = Math.max(...doneNotes.filter(one => one.call === call).map(one => one.at + DONE_LEAST))
  $.clock.after(Math.max(0, last - at) + 100, () => drawAgain($))
}
// What was done is a line, as Claude Code reports a call's result under it: a mark and the words, with no box, fill or edge, so it is
// never taken for a card of work. Green once allowed or given, grey once refused or cancelled
const reportLine = (ui: Ui, key: string, isOn: boolean, said: string, lines: string[]) => (
  <ui.Box key={key} flexDirection="row" gap={1} paddingX={2} flexShrink={0}>
    <ui.Text color={isOn ? DONE : undefined} dimColor={!isOn}>{isOn ? '✓' : '✕'}</ui.Text>
    <ui.Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
      <ui.Text wrap="wrap">{said}</ui.Text>
      {lines.filter(Boolean).map((line, n) => <ui.Text key={`${key}-${n}`} dimColor wrap="truncate-end">{line}</ui.Text>)}
    </ui.Box>
  </ui.Box>
)
const doneNotesPart = (ui: Ui, at: number) =>
  doneNotes.filter(one => !one.card && isNoteShown(one, at)).map(one => reportLine(ui, `done-${one.id}`, Boolean(one.isOn), one.said, [one.head, one.what]))
// What was done with a gate on a work's card, in that card where the amber box was: the same outlined box, green once allowed, grey
// once refused, saying what was allowed, until its note goes
const cardNotesOf = (card: string, at: number) => doneNotes.filter(one => one.card === card && isNoteShown(one, at))
const cardNotesPart = (ui: Ui, card: string, at: number) =>
  cardNotesOf(card, at).map(one => (
    <ui.Box key={`done-${one.id}`} flexDirection="column" borderStyle="round" borderColor={one.isOn ? DONE : '#808080'} paddingX={1} flexShrink={0}>
      <ui.Text wrap="truncate-end" dimColor>{`${one.head} · ${one.isOn ? 'allowed' : 'refused'}`}</ui.Text>
      <ui.Box flexDirection="row" gap={1}>
        <ui.Text color={one.isOn ? DONE : undefined} dimColor={!one.isOn}>{one.isOn ? '✓' : '✕'}</ui.Text>
        <ui.Box flexShrink={1} minWidth={0}>
          <ui.Text wrap="wrap" color={one.isOn ? DONE : undefined} bold={one.isOn}>{one.said}</ui.Text>
        </ui.Box>
      </ui.Box>
      {one.what ? <ui.Text key={`done-${one.id}-what`} dimColor wrap="truncate-end">{one.what}</ui.Text> : null}
    </ui.Box>
  ))
// What a box asks for, in a few words, for its note once answered
const boxHead = (text: string) => {
  const name = text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)?.[1]
  const mac = text.match(/admin password of (.+?) to run/)?.[1]
  return mac ? `The admin password of ${mac}` : name ? `The key ${name}` : 'A key to save'
}
// What is typed in a box is kept by the surface alone, never here or drawn back: a drawing that carried it put older letters over
// newer ones. Each try that left the box to be typed again gives its field a new key, so the field starts empty
const boxTries = new Map<string, number>()
// The boxes something is typed in, unsent, so an ask's reply box does not take the keys from them
const boxTyped = new Set<string>()
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
const BOX_TOLD = (text: string) => `${text} Click in the box at the top of the Claudopus panel and type it there, never in this chat's prompt (/claudopus opens the panel). What is typed in the box goes only into ${keptWhere()}.`
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
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Record<string, unknown>
      const text = one && typeof one === 'object' ? boxWording(one) : undefined
      // Only this chat's own request, dated no later than now, while a runner of this chat's that could have made it runs
      const runner = typeof one.at === 'number' ? runnerOf(one.at, now) : undefined
      const key = typeof one.key === 'string' ? one.key : undefined
      if (key && !boxKeys.has(id)) boxKeys.set(id, key)
      const isKeySame = !key || boxKeys.get(id) === key
      if (one.id === id && text && isKeySame && typeof one.at === 'number' && now - one.at < BOX_OLD && one.at - now <= BOX_SKEW && one.chat === boxChat && boxChat && runner) found.push({ id, text, at: one.at, chat: one.chat, command: runner.command, call: runner.call, ...(one.kind === 'admin' && key ? { key } : {}) })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      // and a value typed into it meanwhile leaves the keychain with it
      else if (typeof one.at === 'number' && (now - one.at >= BOX_OLD || one.at - now > BOX_SKEW)) {
        await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`]).catch(() => undefined)
        await boxKeyring($, 'delete', id)
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
  for (const id of boxKeys.keys()) if (!entries.some(entry => entry.name === `${id}.json`)) boxKeys.delete(id)
  for (const id of [...boxTries.keys(), ...boxSaid.keys(), ...boxTyped]) if (!found.some(one => one.id === id)) (boxTries.delete(id), boxSaid.delete(id), boxTyped.delete(id))
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  drawAgain($)
}

// A box's entry in the keychain: on Linux bin/keyring, which keeps it in a file only this user reads; on a Mac security itself,
// which sendBox calls as before for set and has, so only delete goes through here
const boxKeyring = ($: EngineInterface, what: 'set' | 'has' | 'delete', id: string, stdin?: string) =>
  isLinux
    ? $.process.run([`${$.plugin.root}/bin/keyring`, what, BOX_SERVICE, id, ...(what === 'set' ? ['Claudopus box'] : [])], { stdin, timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
    : what === 'delete'
      ? $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
      : Promise.resolve({ exitCode: -1 })
// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  if (!value) return
  const refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? `That was longer than ${BOX_LONGEST} characters, so it wasn't sent.` : /[^\x20-\x7E]/.test(value) ? "That held a line break, a curly quote or another character outside plain letters, digits and signs, so it wasn't sent. Type it again." : ''
  if (refused) {
    boxSaid.set(id, refused)
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const request = `${boxesDir()}/${id}.json`
  // A runner that has stopped, or a box answered in another chat, takes nothing: its value would stay in the keychain
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id, 'It was no longer waiting · nothing was saved'))
  // An admin password goes only sealed to its runner's key: what sits in the keychain a moment is of no use to anything else
  const asked = boxes.find(other => other.id === id)
  const sent = asked?.key ? await sealedFor($, asked.key, value) : value
  if (!sent) {
    boxSaid.set(id, "It could not be secured for the command that asked, so it wasn't sent.")
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const escaped = sent.replace(/[\\"]/g, '\\$&')
  const r = isLinux
    ? await boxKeyring($, 'set', id, `${sent}\n`)
    : await $.process
        .run(['/usr/bin/security', '-i'], { stdin: `add-generic-password -U -s "${BOX_SERVICE}" -a "${id}" -l "Claudopus box" -w "${escaped}"\n`, timeoutMs: 15_000 })
        .catch(() => ({ exitCode: -1 }))
  // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
  const isKept = r.exitCode === 0 && (isLinux ? await boxKeyring($, 'has', id) : await $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))).exitCode === 0
  // and one whose runner stopped meanwhile is taken out again
  if (isKept && !(await $.fs.exists(request).catch(() => false))) await boxKeyring($, 'delete', id)
  boxPresses += 1
  boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
  if (!isKept) {
    boxSaid.set(id, `It could not be put in ${keptWhere()}. Try again.`)
    await log($, `box ${id} not kept: security ended ${r.exitCode}`)
  } else {
    boxSent.add(id)
    boxSaid.delete(id)
    const one = boxes.find(other => other.id === id)
    boxes = boxes.filter(other => other.id !== id)
    if (one) await noteDone($, { id: `box-${id}`, ...(one.call ? { call: one.call } : {}), head: boxHead(one.text), said: one.key ? 'You gave it · it went only to the command that asked, which continues now' : `You gave it · it is in ${keptWhere()}, and the command that asked for it continues now`, what: '', isOn: true })
    await log($, `box ${id} sent to the keychain`)
  }
  drawAgain($)
}
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string, said = 'You cancelled · nothing was saved, and what asked for it stops without it') => {
  boxSent.add(id)
  const one = boxes.find(other => other.id === id)
  boxes = boxes.filter(other => other.id !== id)
  // The box goes in the press's own drawing, before its request is removed
  drawAgain($)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  // Cancelled, nothing more comes of it: it is over at once
  if (one) await noteDone($, { id: `box-${id}`, ...(one.call ? { call: one.call, endedAt: 0 } : {}), head: boxHead(one.text), said, what: '' })
  drawAgain($)
}

// Each box with when it was asked, so the panel puts it among what waits on the person, the newest first
const boxRows = ($: EngineInterface, ui: Ui, isKeysHeld = false) => {
  if (!boxes.length || !('Input' in ui)) return []
  // This chat's own first request holds the keys, so a value typed for the notice it told goes to its own box, wherever it is drawn
  const shown = [...boxes.filter(one => one.chat === boxChat), ...boxes.filter(one => one.chat !== boxChat)]
  return shown.map((one, n) => ({ at: one.at, node: (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
      <ui.Text dimColor wrap="truncate-end">{`${one.key ? 'Admin password' : 'Key'} · waits for you to type it`}</ui.Text>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      {one.command ? <ui.Text dimColor wrap="wrap">{`Asked by this chat's command: ${cut(oneLine(one.command), 200)}`}</ui.Text> : null}
      <ui.Text dimColor wrap="wrap">{one.key ? 'What you type here shows as you type it. It goes only to the command that asked, locked to that command, never into a chat, and is not saved.' : `What you type here shows as you type it. It goes only into ${keptWhere()}, never into a chat.`}</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxTries.get(one.id) ?? 0}`}
          placeholder="Type or paste it here"
          submitLabel="send"
          autoFocus={n === 0 && !isKeysHeld ? true : undefined}
          onInput={value => void ((value ? boxTyped.add(one.id) : boxTyped.delete(one.id)), holdTimes($))}
          onSubmit={value => void (boxTyped.delete(one.id), freeTimes($), sendBox($, one.id, value).catch(() => log($, `box ${one.id} not sent`)))}
        />
      </ui.Box>
      {boxSaid.get(one.id) ? <ui.Text key={`box-${one.id}-said`} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      <ui.Box flexDirection="row">
        <ui.Button key={`box-${one.id}-cancel-${boxPresses}`} label="Cancel" plain onPress={() => void cancelBox($, one.id)} />
      </ui.Box>
    </ui.Box>
  ) }))
}

// The admin gate: an admin command (bin/admin) waits for the person's press on its work's card before it runs

// config.json's "admin" says when the person is asked: "each" (as shipped) before every admin command, "work" once for a piece of
// work and its helpers until it ends, "never" not at all, as before the gate. The tool.call hook holds a Bash call that runs
// bin/admin and its work's card shows the exact command and the Mac, with Allow once, Always allow this command and Deny. The answer
// is a press in this chat's own panel, kept only in this code's memory: no file, message or typed reply allows anything.
// What a press allows reaches bin/admin as a grant: a file naming the Mac and the exact command, sealed with a key kept in this Mac's
// keychain (GATE_SERVICE). bin/admin runs a command only with a grant whose seal is right, and takes it once, so an admin command
// that reaches it some other way (a script, another spelling of its path, a command built by the shell) is refused there. The
// commands always allowed (admin-allowed.json) and a "work" or "never" in config.json count only with the same seal, which only a
// press in Config or on a card makes; whatever takes one back makes a new key, so an old seal put back counts for nothing.
// The seal is as strong as the keychain: what runs as the person and reads the keychain can make one. So a seal never stands in for
// the password: no admin password is kept anywhere, and bin/admin runs nothing as admin until the person types it for that very
// command, into macOS's own box (which names the command) or the panel's box (sealed to that one run). A forged seal spares only
// the card's press, never the password, and there is no kept password to read.
// The same press gates two more things work could do in the person's place: a release to a repo's main branch (bin/release takes a
// grant as bin/admin does) and a change to the person's own settings and texts in the memory folder (config.json, rules/, roles/)
type Gate = NonNullable<Todo['admins']>[number]
type GateSaid = 'once' | 'always' | 'deny'
type AdminCall = { host: string; command: string }
const GATE_SERVICE = 'claudopus-admin-gate'
// The gates this copy of the mod holds a call for, and what was pressed for each: both only in memory
const gateHeld = new Set<string>()
const gateSaid = new Map<string, GateSaid>()
// A gate of the chat's own thread, which has no card (a chat that does its own work): drawn at the top of the panel
let looseGates: Gate[] = []
// The pieces of work allowed under "work", by card: taken out as the work ends (ended, in cards), so one that comes back asks again
const workAllowed = new Set<string>()
const GATE_DENIED = (gate?: Pick<Gate, 'kind'>) =>
  named(`Refused by {name}: {name} pressed Deny on this ${gate?.kind === 'release' ? "release, so nothing was released. Don't try to release it another way" : gate?.kind === 'file' ? "change, so the file was not changed. Don't try to change it another way" : "admin command, so it didn't run. Don't try to run it another way"}. Continue without it, or say what it is needed for and ask again.`)
const gateThing = (gate?: Pick<Gate, 'kind'>) => (gate?.kind === 'release' ? 'This release did not run' : gate?.kind === 'file' ? 'This change was not made' : 'This admin command did not run')
const GATE_GONE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: the wait for {name} to allow it was interrupted. Run it again if it is still needed.`)
const GATE_LATE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: {name} didn't answer in time. Run it again when it is needed, and Claudopus will ask {name} again.`)
const GATE_BLIND = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: Claudopus asks {name} first, on a card in its panel, and this chat has no panel open.`)
const GATE_UNSEALED = () => `This admin command did not run: Claudopus could not secure what was allowed in ${keptWhere()}. Run it again.`
const NO_GATE_TOUCH = () =>
  named('Claude never reads or writes the list of admin commands {name} always allows, what {name} allowed, or the key that locks them. Only {name} adds to them, with a press on a card or in Config.')

// What a gate asks, in words, by its kind
const gateWhat = (gate: Gate) =>
  gate.isUndone ? (gate.isOutside ? `Something other than Claudopus changed ${gate.host}, and the change was undone` : `A command changed ${gate.host}, and the change was undone`) : gate.kind === 'release' ? `Wants to release ${gate.host} to its main branch` : gate.kind === 'file' ? `Wants to change ${gate.host}` : `Wants to run an admin command on ${gate.host === 'here' ? thisMac() : gate.host}`

// The admin commands a Bash command runs, as the shell splits it: bin/admin by any spelling of its path, after what runs a
// command it is handed, and inside a shell's -c or an eval. What the shell would build (a variable, a substitution) is read as
// written, so the grant names what was shown and bin/admin refuses what differs
const isAdminPath = (word: string, root: string, name = 'admin') => {
  const parts: string[] = []
  for (const part of word.split('/')) {
    if (part === '..' && parts.length && parts.at(-1) !== '..' && parts.at(-1) !== '') parts.pop()
    else if (part !== '.' && (part !== '' || !parts.length)) parts.push(part)
  }
  const path = parts.join('/')
  // Reached from its own folder, by the mod's own path, or by a path that names the mod or is filled in by the shell: another
  // tool that happens to be called admin is none of this
  return path === name || path === `bin/${name}` || (path.endsWith(`/bin/${name}`) && (path === `${root}/bin/${name}` || /claudopus/i.test(path) || path.includes('$')))
}
const adminCalls = (command: string, root: string, depth = 0): AdminCall[] => {
  if (depth > 4) return []
  return shellWords(command).flatMap(words => {
    let i = 0
    for (;;) {
      while (i < words.length && /^\w+=/.test(words[i]!)) i++
      const head = (words[i] ?? '').split('/').pop() ?? ''
      if (!['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'builtin', 'timeout', 'caffeinate', 'nice', 'if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{'].includes(head)) break
      i++
      while (i < words.length && (words[i]!.startsWith('-') || (head === 'sudo' && words[i - 1] === '-u') || /^\d+[smhd]?$/.test(words[i]!) || (head === 'env' && /^\w+=/.test(words[i]!)))) i++
    }
    const tool = (words[i] ?? '').split('/').pop() ?? ''
    if (tool === 'eval') return adminCalls(words.slice(i + 1).join(' '), root, depth + 1)
    if (tool === 'bash' || tool === 'sh' || tool === 'zsh') {
      const c = words.findIndex((one, n) => n > i && /^-[a-z]*c$/.test(one))
      if (c > 0) return adminCalls(words[c + 1] ?? '', root, depth + 1)
      // A shell handed the runner as a script
      i++
      while (i < words.length && words[i]!.startsWith('-')) i++
    }
    if (!isAdminPath(words[i] ?? '', root)) return []
    const [host = '', run = ''] = [words[i + 1], words[i + 2]]
    return !host || !run || host.startsWith('-') || run === '--forget' ? [] : [{ host, command: run }]
  })
}

// One seal for each message: its HMAC under the key in this Mac's keychain, which never leaves that shell. "make" makes the key when
// there is none, "new" makes a new one, so every seal of the old one is void
const SEAL = `set -u
PATH=/usr/bin:/bin
mode=$1
shift
# The kept copy of the person's settings and texts has a key of its own ("known"), so its being there says a copy was made here
acct=seal
case $mode in known-*) acct=known; mode=\${mode#known-} ;; esac
if [ -x /usr/bin/security ]; then
  key() { /usr/bin/security find-generic-password -s ${GATE_SERVICE} -a "$acct" -w 2>/dev/null; }
  keep() { printf 'add-generic-password -U -s "${GATE_SERVICE}" -a "%s" -l "Claudopus admin gate" -w "%s"\\n' "$acct" "$1" | /usr/bin/security -i >/dev/null 2>&1; }
else
  # Linux: where bin/keyring keeps it, a file only this user reads, under the home folder (never XDG_DATA_HOME)
  d=$HOME/.local/share
  f=$d/claudopus/keyring/${GATE_SERVICE}
  key() { [ -f "$f/$acct" ] && cat "$f/$acct" 2>/dev/null; }
  keep() { (umask 077; mkdir -p "$f" && chmod 700 "$d/claudopus" "$d/claudopus/keyring" "$f" && printf '%s' "$1" >"$f/.$acct.new" && mv -f "$f/.$acct.new" "$f/$acct"); }
fi
k=$(key)
if [ "$mode" = has ]; then [ -n "$k" ] && exit 0; exit 3; fi
if [ "$mode" = new ] || { [ -z "$k" ] && [ "$mode" = make ]; }; then
  k=$(/usr/bin/openssl rand -hex 32 2>/dev/null || od -An -tx1 -N32 /dev/urandom | tr -d ' \\n') || exit 1
  [ \${#k} = 64 ] || exit 1
  keep "$k"
  [ "$(key)" = "$k" ] || exit 1
fi
[ -n "$k" ] || exit 3
for m in "$@"; do
  printf '%s\\n%s' "$k" "$m" | /usr/bin/perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m // "", $k), "\\n"' || exit 1
done`
const sealed = async ($: EngineInterface, mode: 'read' | 'make' | 'new' | 'known-read' | 'known-make', messages: string[]) => {
  const r = await $.process.run(['/bin/sh', '-c', SEAL, 'sh', mode, ...messages], { timeoutMs: 20_000 }).catch(() => undefined)
  const lines = r?.exitCode === 0 ? r.stdout.split('\n').filter(Boolean) : undefined
  return lines && lines.length === messages.length && lines.every(line => /^[0-9a-f]{64}$/.test(line)) ? lines : undefined
}

// What is in force: "work" or "never" only as Config sealed it, every command asked otherwise
const gateOf = async ($: EngineInterface) => {
  const config = await readConfig($, dir)
  const said: 'each' | 'work' | 'never' = config.admin === 'work' || config.admin === 'never' ? config.admin : 'each'
  if (said === 'each') return { mode: 'each' as const, unsealed: '' }
  const seal = (await sealed($, 'read', [`mode\n${said}`]))?.[0]
  const isSealed = Boolean(seal) && seal === config.adminSealed
  return { mode: isSealed ? said : ('each' as const), unsealed: isSealed ? '' : said }
}

// The commands always allowed, by Mac: admin-allowed.json, { "<mac>": [{ command, seal, at }] }. One whose seal is not right
// allows nothing
type Allowed = AdminCall & { seal: string; at: number }
const allowedPath = () => `${dir}/admin-allowed.json`
const allowMessage = (one: AdminCall) => `allow\n${one.host}\n${one.command}`
const readAllowed = async ($: EngineInterface): Promise<Allowed[]> => {
  try {
    const kept = JSON.parse((await personText($, dir, 'admin-allowed.json')) || '{}') as Record<string, unknown>
    return Object.entries(kept).flatMap(([host, list]) =>
      (Array.isArray(list) ? list : []).flatMap(one => {
        const { command, seal, at } = (one ?? {}) as { command?: unknown; seal?: unknown; at?: unknown }
        return typeof command === 'string' && typeof seal === 'string' ? [{ host, command, seal, at: typeof at === 'number' ? at : 0 }] : []
      }),
    )
  } catch {
    return []
  }
}
const writeAllowed = ($: EngineInterface, list: Allowed[]) => {
  const kept: Record<string, { command: string; seal: string; at: number }[]> = {}
  for (const { host, command, seal, at } of list) (kept[host] ??= []).push({ command, seal, at })
  const text = `${JSON.stringify(kept, null, 2)}\n`
  return personWrote($, dir, 'admin-allowed.json', text).then(() => $.fs.write(allowedPath(), text))
}
// Read once for each state of the file: the Config tab draws the list often
let allowedRead = { key: '', valid: [] as Allowed[], unsealed: 0 }
const validAllowed = async ($: EngineInterface) => {
  const all = await readAllowed($)
  if (!all.length) return { valid: [] as Allowed[], unsealed: 0 }
  const key = JSON.stringify(all)
  if (allowedRead.key === key) return allowedRead
  const seals = await sealed($, 'read', all.map(allowMessage))
  const valid = all.filter((one, n) => seals?.[n] === one.seal)
  allowedRead = { key, valid, unsealed: all.length - valid.length }
  return allowedRead
}
const isAllowed = async ($: EngineInterface, call: AdminCall) => {
  const entry = (await readAllowed($)).find(one => one.host === call.host && one.command === call.command)
  return Boolean(entry) && (await sealed($, 'read', [allowMessage(call)]))?.[0] === entry?.seal
}
const allowAlways = async ($: EngineInterface, call: AdminCall) => {
  const seal = (await sealed($, 'make', [allowMessage(call)]))?.[0]
  if (!seal) throw new Error(`the seal could not be made in ${keptWhere()}`)
  const at = await $.clock.now()
  allowedRead = { key: '', valid: [], unsealed: 0 }
  await writeAllowed($, [...(await readAllowed($)).filter(one => one.host !== call.host || one.command !== call.command), { ...call, seal, at }])
}
// A change that takes something back (another setting, a command removed): what stays is sealed again under a new key, so no seal
// made before counts, whoever kept a copy of it
const regate = async ($: EngineInterface, change: { mode?: 'each' | 'work' | 'never'; remove?: AdminCall }) => {
  const { valid } = await validAllowed($)
  const kept = change.remove ? valid.filter(one => one.host !== change.remove?.host || one.command !== change.remove.command) : valid
  const mode = change.mode ?? (await gateOf($)).mode
  const seals = await sealed($, 'new', [...kept.map(allowMessage), ...(mode === 'each' ? [] : [`mode\n${mode}`])])
  if (!seals) throw new Error(`the seal could not be made in ${keptWhere()}`)
  allowedRead = { key: '', valid: [], unsealed: 0 }
  await writeAllowed($, kept.map((one, n) => ({ ...one, seal: seals[n] ?? '' })))
  await setConfig($, dir, 'admin', mode === 'each' ? undefined : mode)
  await setConfig($, dir, 'adminSealed', mode === 'each' ? undefined : seals[kept.length])
  if (change.mode) workAllowed.clear()
}
// No admin password is kept: every one an earlier version kept leaves the keychain (on Linux, bin/keyring's folder) as the mod
// loads, with the "Let macOS ask" mark kept beside the gate's key and config.json's adminPassword, which no longer choose anything
const FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; /usr/bin/security delete-generic-password -s claudopus-admin-gate -a password >/dev/null 2>&1; else d=$HOME/.local/share; o=${XDG_DATA_HOME:-}; case $o in /*) [ "$o" != "$d" ] && [ -d "$o/claudopus/keyring" ] && [ ! -e "$d/claudopus/keyring" ] && mkdir -p "$d/claudopus" && chmod 700 "$d/claudopus" && mv "$o/claudopus/keyring" "$d/claudopus/keyring" ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; rm -f "$d/claudopus/keyring/claudopus-admin-gate/password"; fi; exit 0'
let isKeptForgotten = false
const forgetKeptPasswords = async ($: EngineInterface) => {
  if (isKeptForgotten || !dir) return
  isKeptForgotten = true
  await $.process.run(['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30_000 }).catch(err => log($, `kept admin passwords not forgotten: ${String(err)}`))
  if ((await readConfig($, dir)).adminPassword !== undefined) await setConfig($, dir, 'adminPassword', undefined).catch(() => undefined)
}

// What a press allowed, for bin/admin to take once: the Mac and the exact command, sealed. One nothing took goes as its call ends
const grantsDir = () => `${dir}/admin-grants`
// A release's grant is sealed under a word of its own, so neither runner ever takes the other's
const issueGrant = async ($: EngineInterface, id: string, call: AdminCall, word: 'grant' | 'release-grant' = 'grant') => {
  const at = await $.clock.now()
  const name = `${id.replace(/[^A-Za-z0-9_-]/g, '')}-${at}`
  const seal = (await sealed($, 'make', [`${word}\n${name}\n${at}\n${call.host}\n${call.command}`]))?.[0]
  if (!seal) return ''
  // Grants a call sent to the background never took are cleared as the next one is made
  await $.process.run(['/usr/bin/find', grantsDir(), '-type', 'f', '-mmin', '+10', '-delete'], { timeoutMs: 10_000 }).catch(() => undefined)
  await $.fs.write(`${grantsDir()}/${name}.json`, JSON.stringify({ id: name, host: call.host, command: call.command, at, seal }))
  return name
}
const dropGrants = async ($: EngineInterface, names: string[]) => {
  for (const name of names) await $.process.run(['rm', '-f', `${grantsDir()}/${name}.json`]).catch(() => undefined)
}

// A tool call that would read or write the list, the grants or the key itself
// A command is read as written and again with its quotes and backslashes taken out, so `-"w"` or `claudopus-admin-"gate"` is read as
// the shell reads it. Any command that names the keychain's admin services (the gate's key and what Config chose, and the kept admin
// passwords) with security or the keyring runner counts, whatever it does with them
const unquoted = (command: string) => command.replace(/["'\\]/g, '')
// The runners find their key, grants and settings under the home folder, and release asks for a press only inside Claude Code: a
// command that names one and sets another home or data folder, or takes Claude Code's mark away, would have it read the caller's own
// (its comment lines left out, so a test script that makes a home of its own and only names a runner in a comment is not refused)
const RUNNER_NAMED = /\bbin\/(?:admin|secret|release|keyring)(?![\w.-])/
const RUNNER_MOVED = /(?:^|[\s;&|(`'"])(?:HOME|XDG_DATA_HOME|CLAUDECODE)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:HOME|XDG_DATA_HOME|CLAUDECODE)\b|\benv\b[^;&|\n]*\s(?:-u\s*|--unset[= ])CLAUDECODE\b|\benv\b[^;&|\n]*\s-i\b|\benv(?:\s+-\w+)*\s+-(?=\s|$)|\bexec\s+-\w*c/
// The release runs as itself (#!/bin/bash -p: no startup file, no functions from the environment), so what its shell runs, the
// GitHub checks' verdict among it, is its own: a command that names it and sets what a shell or git reads first (a startup file,
// functions, options, the PATH, git's settings), sources a script first, or starts it through a shell of its own choosing, is refused
const RELEASE_NAMED = /\bbin\/release(?![\w.-])/
const RELEASE_MOVED =
  /(?:^|[\s;&|(`'"])(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+|BASH_FUNC_\S+)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+)\b|\b(?:export|declare|typeset)\s+(?:-\w+\s+)*-\w*f|(?:^|[;&|(]\s*)(?:source|\.)\s|\b(?:ba|z|da|k|c|tc|fi)?sh\s+(?:-\S+\s+)*\S*bin\/release(?![\w.-])/
const movesRunner = (command: string) =>
  [command, unquoted(command)].map(one => one.replace(/^\s*#.*$/gm, '')).some(one => (RUNNER_NAMED.test(one) && RUNNER_MOVED.test(one)) || (RELEASE_NAMED.test(one) && RELEASE_MOVED.test(one)))
const NO_RUNNER_MOVED =
  "This command didn't run: Claudopus's runners (bin/admin, bin/secret, bin/release, bin/keyring) run with the home folder and the environment variables Claude Code gave the shell, so a command that sets HOME or XDG_DATA_HOME for one, or removes CLAUDECODE, is refused, and so is one that sets the PATH, BASH_ENV, shell options or git's settings for bin/release, sources a script before it, or starts it through a shell. Run the runner as it is."
const touchesGate = (e: ToolCallInput) => {
  if (e.tool === 'Bash') {
    const command = String((e as { command?: unknown }).command ?? '')
    return [command, unquoted(command)].some(one => /claudopus\/admin-(?:allowed\.json|grants|known\.json)\b/.test(one) || (/\b(?:security|keyring)\b/.test(one) && /claudopus-admin\b/.test(one)))
  }
  const path = String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? '')
  return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && /\/claudopus\/admin-(?:allowed\.json$|known\.json$|grants(?:\/|$))/.test(path)
}

const setGates = async ($: EngineInterface, top: string, fn: (list: Gate[]) => Gate[]) => {
  if (!top) looseGates = fn(looseGates)
  else await changeTodos($, list => list.map(one => (one.id !== top ? one : { ...one, admins: fn(one.admins ?? []).length ? fn(one.admins ?? []) : undefined })))
  redraw($)
}
// No hold outlives the copy of the mod that made it: a card that still shows one as a chat starts is cleared
const clearGates = async ($: EngineInterface) => {
  looseGates = looseGates.filter(one => gateHeld.has(one.id))
  if ((await read($, todos)).some(one => one.admins?.some(gate => !gateHeld.has(gate.id))))
    await changeTodos($, list => list.map(one => (one.admins ? { ...one, admins: one.admins.filter(gate => gateHeld.has(gate.id)).length ? one.admins.filter(gate => gateHeld.has(gate.id)) : undefined } : one)))
}
// Holds the call until the person presses. A hook's own time is bounded, and time spent in a call on the engine is not counted:
// the wait is a one-second sleep run by the engine, again and again, the press read from memory between them
const holdGate = async ($: EngineInterface, next: { signal?: AbortSignal; budget?: { remainingMs: number } }, gate: Gate, top: string): Promise<GateSaid | 'gone' | 'late' | 'blind'> => {
  if (!(await $.session.surfaces().catch(() => [])).length) return 'blind'
  gateHeld.add(gate.id)
  // A gate held afresh waits for a press of its own: a mark an earlier one of the same id left never hides it
  gatePressed.delete(gate.id)
  await setGates($, top, list => [...list.filter(one => one.id !== gate.id), gate])
  await openList($).catch(() => undefined)
  const card = top ? (await read($, todos)).find(one => one.id === top) : undefined
  const text = `${gateWhat(gate)}: ${cut(oneLine(gate.command), 200)}`
  await (card ? askAloud($, card, text) : aloud($, 'ask', gate.kind === 'release' ? 'A release needs you' : gate.kind === 'file' ? 'A change to your settings needs you' : 'An admin command needs you', text, `gate-${gate.id}`)).catch(err => log($, `admin command not told: ${String(err)}`))
  $.ui.log(
    `${card ? `The task "${titleOf(card)}"` : 'This chat'} ${gateWhat(gate).replace(/^Wants/, 'wants')}: ${cut(oneLine(gate.command), 300)} · Press ${gate.kind ? 'Allow once or Deny' : `${gate.isWork ? 'Allow for this task' : 'Allow once'}, Always allow this command or Deny`} ${card ? 'on its card' : 'at the top'} in the Claudopus panel (/claudopus opens it). Nothing typed in the chat allows it.`,
  )
  let said: GateSaid | 'gone' | 'late' | undefined
  try {
    for (;;) {
      said = gateSaid.get(gate.id)
      if (said) break
      if (next.signal?.aborted || (await isReplaced($))) said = 'gone'
      else if ((next.budget?.remainingMs ?? Infinity) < 1500) said = 'late'
      if (said) break
      await $.process.run(['/bin/sleep', '1'], { timeoutMs: 10_000 }).catch(() => undefined)
    }
  } finally {
    gateHeld.delete(gate.id)
    gateSaid.delete(gate.id)
    await setGates($, top, list => list.filter(one => one.id !== gate.id)).catch(() => undefined)
  }
  // A press the wait did not take (it stopped waiting as the press came) is said as such where its note was
  const pressed = gatePressed.get(gate.id)
  gatePressed.delete(gate.id)
  if (pressed && pressed !== said) await gateNoteFailed($, gate, top, `It had stopped waiting when you pressed · ${gate.kind === 'release' ? 'nothing was released' : gate.kind === 'file' ? 'nothing was changed' : 'it did not run'}`)
  await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: ${said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'denied' : 'not answered'}`)
  return said
}
// What a gate's note heads with: the kind of thing it let through, and where
const gateHead = (gate: Gate) => (gate.kind === 'release' ? `Release of ${gate.branch ?? gate.host} into ${gate.host}` : gate.kind === 'file' ? `Change to ${gate.host}` : `Admin command on ${gate.host === 'here' ? thisMac() : gate.host}`)
const gateWhatLine = (gate: Gate) => (gate.kind === 'release' && gate.folder ? `from ${shortPath(gate.folder)}` : gate.kind === 'file' ? '' : cut(oneLine(gate.command), 200))
// The gates pressed and not yet let go by their wait, with what was pressed: the panel draws each answered from the press itself,
// before the wait (a one-second sleep the engine runs) reads it, which kept the amber box and its buttons up to a second after the
// press (15 Nov). Only the first press counts: a second, on a drawing a moment old, sends nothing
const gatePressed = new Map<string, GateSaid>()
// What a gate's note says when what it said was allowed did not come about, in the same place, grey: never a false "allowed"
const gateNoteFailed = ($: EngineInterface, gate: Gate, card: string, said: string) =>
  doneNotes.some(one => one.id === `gate-${gate.id}`)
    ? noteDone($, { id: `gate-${gate.id}`, ...(gate.call ? { call: gate.call } : {}), ...(card ? { card } : {}), endedAt: 0, head: gateHead(gate), said, what: gateWhatLine(gate), isOn: false }).catch(() => undefined)
    : Promise.resolve()
// A call refused after a press, by another of its commands denied or not let through: nothing in it runs, so a gate of it already
// allowed says so in grey, never green
const callRefused = async ($: EngineInterface, call: string) => {
  for (const one of doneNotes.filter(note => note.call === call && note.isOn && note.id.startsWith('gate-'))) {
    const { at: _at, ...rest } = one
    await noteDone($, { ...rest, endedAt: 0, isOn: false, said: 'It did not run: another part of the same command was refused, so nothing in it ran' }).catch(() => undefined)
  }
}
// `card` names the work whose card the gate is on: what was done is said in that card, where the gate was
const answerGate = ($: EngineInterface, gate: Gate, said: GateSaid, card = '') => {
  presses += 1
  const id = gate.id
  // A put-back goes from the panel in the press's own drawing too, and comes back only if it could not be answered
  if (gate.isUndone) {
    if (gatePressed.has(id)) return
    gatePressed.set(id, said)
    redraw($)
    return void answerUndone($, gate, said)
      .catch(err => log($, `undone change not answered: ${String(err)}`))
      .finally(() => (gatePressed.delete(id), redraw($)))
  }
  if (gateHeld.has(id) && !gatePressed.has(id)) {
    gatePressed.set(id, said)
    gateSaid.set(id, said)
    void noteDone($, {
      id: `gate-${id}`,
      ...(gate.call ? { call: gate.call } : {}),
      ...(card ? { card } : {}),
      // Refused, nothing runs: what it says is over at once
      ...(said === 'deny' ? { endedAt: 0 } : {}),
      head: gateHead(gate),
      said:
        said === 'deny'
          ? `You denied it · ${gate.kind === 'release' ? 'nothing was released' : gate.kind === 'file' ? 'nothing was changed' : "it didn't run"}, and Claudopus told Claude`
          : gate.kind
            ? `You allowed it once · ${gate.kind === 'release' ? 'it releases now' : 'the change is made now'}`
            : said === 'always'
            ? 'You always allow this command · it runs now, and will not ask again'
            : gate.isWork
              ? "You allowed this task's admin commands · it runs now"
              : 'You allowed it once · it runs now',
      what: gateWhatLine(gate),
      isOn: said !== 'deny',
    }).catch(() => undefined)
  }
  redraw($)
}

// Before a Bash call runs: each admin command in it is allowed already (never asked, this work allowed, the command always
// allowed) or waits for the press; allowed, it gets its grant. Refused, the call does not run
const gateAdmin = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = adminCalls(String((e as { command?: unknown }).command ?? ''), $.plugin.root)
  if (!calls.length || !dir) return { grants: [] }
  const gate = await gateOf($)
  if (gate.mode === 'never') return { grants: [] }
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    // "Once per piece of work" is for work with a card, which ends; the chat's own thread never does, so there each command asks
    const isWork = gate.mode === 'work' && Boolean(card)
    const isCovered = (isWork && workAllowed.has(top)) || (await isAllowed($, call))
    if (!isCovered) {
      const said = await holdGate($, next, { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}), ...(isWork ? { isWork: true } : {}) }, card ? top : '')
      if (said !== 'once' && said !== 'always') {
        await dropGrants($, grants)
        return { deny: said === 'deny' ? GATE_DENIED() : said === 'late' ? GATE_LATE() : said === 'blind' ? GATE_BLIND() : GATE_GONE(), grants: [] }
      }
      if (said === 'always')
        await allowAlways($, call).catch(async err => {
          await log($, `admin command not always allowed: ${String(err)}`)
          const gate = { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: 0 }
          if (doneNotes.some(one => one.id === `gate-${gate.id}`)) await noteDone($, { id: `gate-${gate.id}`, call: e.tool_use_id, ...(card ? { card: top } : {}), head: gateHead(gate), said: "You allowed it once · it runs now, but it couldn't be saved as always allowed", what: gateWhatLine(gate), isOn: true })
        })
      if (isWork) workAllowed.add(top)
    }
    const grant = await issueGrant($, `${e.tool_use_id}-${n}`, call)
    if (!grant) {
      await gateNoteFailed($, { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: 0 }, card ? top : '', "It could not be secured · it didn't run, and Claudopus told Claude")
      await dropGrants($, grants)
      return { deny: GATE_UNSEALED(), grants: [] }
    }
    grants.push(grant)
  }
  return { grants }
}

// A release to main waits for the person's press on its card, as an admin command does, whatever Config says of admin commands: the
// release runner named by any spelling of its path, from the folder the command runs it in (a cd before it moves that). Allowed, it gets
// a grant naming that worktree and its branch, which bin/release takes once; its --status asks nothing
type ReleaseCall = { folder: string; branch: string }
// The runner's own arguments, as the shell hands them: a redirection (`> log`, `2>log`, `>>log`, `<in`) and what it names are the
// shell's, never a branch. Read otherwise, `release > log` asked to release a branch called ">", whose grant the runner (on its
// own branch) refused, so the work ran it again and the person was asked twice
const releaseArgs = (words: string[]) => {
  const args: string[] = []
  for (let n = 0; n < words.length; n++) {
    const word = words[n]!
    if (/^\d*(?:>>?|<<?|>\||<>)$/.test(word)) {
      n++
      continue
    }
    if (/^\d*[<>]/.test(word)) continue
    const cut = word.search(/[<>]/)
    if (cut >= 0) {
      if (cut > 0) args.push(word.slice(0, cut))
      // `branch>log` hands the branch and sends what it prints to log; `branch> log` names the log in the next word
      if (/[<>]$/.test(word)) n++
      continue
    }
    args.push(word)
  }
  return args
}
const releaseCalls = (command: string, root: string, from: string): ReleaseCall[] => {
  let folder = from
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const found: ReleaseCall[] = []
  for (const said of shellWords(command)) {
    // `release>log` is the runner and a redirection, as the shell reads it: the runner's own word alone is split
    const words = said.flatMap(word => {
      const cut = word.search(/[<>]/)
      return cut > 0 && isAdminPath(word.slice(0, cut), root, 'release') ? [word.slice(0, cut), word.slice(cut)] : [word]
    })
    const i = commandAt(words)
    const name = (words[i] ?? '').split('/').pop() ?? ''
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) {
      folder = pathOf(words[i + 1]!, home, folder)
      continue
    }
    // Run by a shell handed it as a script, or by itself
    const at = ['bash', 'sh', 'zsh'].includes(name) ? i + 1 + words.slice(i + 1).findIndex(one => !one.startsWith('-')) : i
    if (at < i || !isAdminPath(words[at] ?? '', root, 'release')) continue
    const args = releaseArgs(words.slice(at + 1))
    if (args[0] === '--status') continue
    const rest = args[0] === '-m' ? args.slice(2) : args
    found.push({ folder, branch: rest[0] ?? '' })
  }
  return found
}
const gateRelease = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = releaseCalls(String((e as { command?: unknown }).command ?? ''), $.plugin.root, cwd || dir.replace(/\/\.claude\/claudopus$/, ''))
  if (!calls.length || !dir) return { grants: [] }
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    const git = (args: string[]) => $.process.run(['git', '-C', call.folder, ...args], { timeoutMs: 15_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '')
    const repo = await git(['rev-parse', '--show-toplevel'])
    const branch = call.branch || (await git(['rev-parse', '--abbrev-ref', 'HEAD']))
    // Not a repo, or no branch: the runner itself says what is wrong, and it releases nothing without a grant
    if (!repo || !branch || branch === 'HEAD') continue
    const id = `${e.tool_use_id}-r${n}`
    // Named by the repo itself, not the worktree's folder: a worktree's git folder is inside the repo's own
    const common = await git(['rev-parse', '--path-format=absolute', '--git-common-dir'])
    const name = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo
    const said = await holdGate($, next, { id, call: e.tool_use_id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
    if (said !== 'once') {
      await dropGrants($, grants)
      const gate = { kind: 'release' as const }
      return { deny: said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate), grants: [] }
    }
    const grant = await issueGrant($, id, { host: 'release', command: `${repo}\n${branch}` }, 'release-grant')
    if (!grant) {
      await gateNoteFailed($, { id, call: e.tool_use_id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at: 0 }, card ? top : '', 'It could not be secured · nothing was released, and Claudopus told Claude')
      await dropGrants($, grants)
      return { deny: GATE_UNSEALED(), grants: [] }
    }
    grants.push(grant)
  }
  return { grants }
}
// The person's own settings and texts in the memory folder: config.json (the admin gate's mode, the Macs reached, the name every
// text uses) and their copies of the rules and roles every chat and work runs on. Config's own acts write them without a tool call;
// work's Write or Edit there waits for the person's press on its card, showing the file and the change
const ownFileOf = (path: string) => {
  if (!dir) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const full = pathOf(path, home, cwd || home)
  const memory = dir.toLowerCase()
  const lower = full.toLowerCase()
  if (lower === `${memory}/config.json`) return 'your Claudopus settings (config.json)'
  if (lower === `${memory}/rules` || lower.startsWith(`${memory}/rules/`)) return `your rules (${full.slice(dir.length + 1)})`
  if (lower === `${memory}/roles` || lower.startsWith(`${memory}/roles/`)) return `your role text (${full.slice(dir.length + 1)})`
  // A repo's release.local, which its release runner reads as this Mac's own settings
  if (/\/\.git\/release\.local$/.test(full)) return `this Mac's release settings (${full})`
  return ''
}
const FILE_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']
const gateOwnFile = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<string> => {
  if (!FILE_TOOLS.includes(e.tool)) return ''
  const input = e as { file_path?: unknown; notebook_path?: unknown; content?: unknown; new_string?: unknown; old_string?: unknown; edits?: unknown; new_source?: unknown }
  const file = ownFileOf(String(input.file_path ?? input.notebook_path ?? ''))
  if (!file) return ''
  const change =
    typeof input.content === 'string'
      ? input.content
      : typeof input.new_string === 'string'
        ? `${typeof input.old_string === 'string' && input.old_string ? `In place of:\n${input.old_string}\n\nIt writes:\n` : ''}${input.new_string}`
        : Array.isArray(input.edits)
          ? input.edits.map(one => String((one as { new_string?: unknown })?.new_string ?? '')).join('\n…\n')
          : String(input.new_source ?? '')
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const said = await holdGate($, next, { id: `${e.tool_use_id}-f`, call: e.tool_use_id, kind: 'file', host: file, command: cut(change, 2000), at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
  const gate = { kind: 'file' as const }
  return said === 'once' ? '' : said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate)
}

// What a command did to them: a command can write the person's own settings and texts, and the commands always allowed, in ways no
// reading of its text finds (a path built from variables, a program's own code, a process left running that writes later), so they
// are judged by what is in them. What each one last held as the mod or the person put it there is kept in admin-known.json, sealed
// with the gate's key as the always-allowed list is, which work never reads or writes. Every chat compares the files with it as the
// mod loads, as a message of the person's comes, as each tool call begins, as each command ends, and before the mod reads one of
// them (the texts a chat or work is told, the settings the gate and Config read). One that differs is put back as it was, whatever
// changed it and whenever, what it held is kept beside it as <file>.<time>.put-back, and a change to the settings or texts is
// shown on a card, the work's when a command of its made it, where Allow makes it again. A kept copy that is missing, or whose seal
// is not right, is never taken as what they hold: each of them there is moves aside to its .put-back copy, and is offered on a card.
// What this does not stop: a program running as the person that reads the gate's key (F-007) and seals a copy of its own
const PERSON_FILES = ['config.json', 'rules/CLAUDE.md', 'roles/chat.md', 'roles/work.md', 'admin-allowed.json']
const knownPath = () => `${dir}/admin-known.json`
const knownMessage = (files: Record<string, string | null>, count: number) => `known\n${count}\n${JSON.stringify(files)}`
// A file's text, null when there is none, undefined when it could not be read (then it is left alone)
const personRead = async ($: EngineInterface, name: string): Promise<string | null | undefined> => {
  const path = `${dir}/${name}`
  const isThere = await $.fs.exists(path).catch(() => undefined)
  if (isThere === undefined) return undefined
  return isThere ? $.fs.read(path).catch(() => undefined) : null
}
const personNow = async ($: EngineInterface) => {
  const now = new Map<string, string | null>()
  for (const name of PERSON_FILES) {
    const text = await personRead($, name)
    if (text !== undefined) now.set(name, text)
  }
  return now
}
// What this chat last found sealed, or sealed itself: the kept copy is checked again only when its text changed. A copy this chat
// took before and that was replaced since (an older copy put back) is not taken again; each carries a count one past the one before
let knownSeen: { text: string; files: Map<string, string | null>; count: number } | undefined
const knownPast = new Set<string>()
// The last read could not be checked (the keychain did not answer): not the same as a seal that is wrong
let isKnownUnsure = false
// What each file is known to hold: undefined when no sealed copy is there (missing, changed by hand, or never made)
const knownRead = async ($: EngineInterface): Promise<Map<string, string | null> | undefined> => {
  isKnownUnsure = false
  const text = await $.fs.read(knownPath()).catch(() => '')
  if (knownSeen && knownSeen.text === text) return new Map(knownSeen.files)
  if (knownPast.has(text)) return undefined
  try {
    const kept = JSON.parse(text) as { files?: Record<string, unknown>; count?: unknown; seal?: unknown }
    const files = Object.fromEntries(Object.entries(kept.files ?? {}).filter(([name, one]) => PERSON_FILES.includes(name) && (one === null || typeof one === 'string'))) as Record<string, string | null>
    const count = typeof kept.count === 'number' && Number.isSafeInteger(kept.count) ? kept.count : -1
    if (typeof kept.seal !== 'string') return undefined
    const seal = (await sealed($, 'known-read', [knownMessage(files, count)]))?.[0]
    if (seal === undefined) isKnownUnsure = true
    if (seal !== kept.seal) return undefined
    if (knownSeen) knownPast.add(knownSeen.text)
    knownSeen = { text, files: new Map(Object.entries(files)), count }
    return new Map(knownSeen.files)
  } catch {
    return undefined
  }
}
// Whether the kept copy's own key is there: 'no' only when the keychain answered that it is not, 'error' when it did not answer
const knownKey = async ($: EngineInterface): Promise<'yes' | 'no' | 'error'> => {
  const r = await $.process.run(['/bin/sh', '-c', SEAL, 'sh', 'known-has'], { timeoutMs: 20_000 }).catch(() => undefined)
  return r?.exitCode === 0 ? 'yes' : r?.exitCode === 3 ? 'no' : 'error'
}
// Said once in a chat, at the top of the panel: while the key cannot be made or read, a change made outside Claudopus is not caught
let isKnownWarned = false
const knownWarn = ($: EngineInterface, why: string) => {
  void log($, `the kept copy of the settings and texts is not in force: ${why}`)
  if (isKnownWarned) return
  isKnownWarned = true
  $.ui.log(`Claudopus could not use its key in ${keptWhere()} (${why}), so a change made to your settings, principles or rules outside Claudopus is not undone in this chat until it can. Unlock the keychain, or start a new chat once it is unlocked.`)
}
const knownWrite = async ($: EngineInterface, known: Map<string, string | null>, after: number) => {
  const files = Object.fromEntries(known)
  const count = after + 1
  const seal = (await sealed($, 'known-make', [knownMessage(files, count)]))?.[0]
  if (!seal) {
    knownWarn($, 'it could not be secured')
    throw new Error(`the kept copy could not be sealed in ${keptWhere()}`)
  }
  const text = `${JSON.stringify({ files, count, seal }, null, 2)}\n`
  // Written beside it and moved into place, so no chat ever reads half of it
  const aside = `${knownPath()}.${count}-${Math.random().toString(36).slice(2)}.new`
  await $.fs.write(aside, text)
  const moved = await $.process.run(['mv', '-f', aside, knownPath()], { timeoutMs: 10_000 }).catch(() => undefined)
  if (moved?.exitCode !== 0) await $.fs.write(knownPath(), text)
  if (knownSeen) knownPast.add(knownSeen.text)
  knownSeen = { text, files: new Map(known), count }
}
// One chat's changes to it at a time, so two never lose each other's
let knownQueue: Promise<unknown> = Promise.resolve()
const knownSet = ($: EngineInterface, change: (known: Map<string, string | null>) => void) => {
  const step = knownQueue.then(async () => {
    // A copy that is not sealed right is built on what this chat last knew, never on what it says
    const known = (await knownRead($)) ?? new Map(knownSeen?.files ?? [])
    change(known)
    await knownWrite($, known, knownSeen?.count ?? 0)
  })
  knownQueue = step.catch(() => undefined)
  return step
}
// The mod wrote one of them itself: that is what it holds now. Kept before the file is written, so no chat takes the write for
// someone else's
const personWrote = async ($: EngineInterface, memory: string, name: string, text: string | null) => {
  if (!dir || memory !== dir || !PERSON_FILES.includes(name)) return
  await knownSet($, known => void known.set(name, text))
}
// Put back as it was; what it held is kept beside it, so nothing the person wrote is ever lost, whatever is pressed
const personPut = async ($: EngineInterface, name: string, text: string | null, is: string | null) => {
  if (is !== null) {
    const at = new Date(await $.clock.now()).toISOString().slice(0, 23).replace(/[-:]/g, '').replace('T', '-').replace('.', '')
    await $.fs.write(`${dir}/${name}.${at}${Math.random().toString(36).slice(2, 6)}.put-back`, is).catch(() => undefined)
  }
  // Taken away first, so a link put in its place is replaced, never written through
  await $.process.run(['rm', '-f', `${dir}/${name}`], { timeoutMs: 10_000 }).catch(() => undefined)
  if (text !== null) await $.fs.write(`${dir}/${name}`, text)
}
// The files compared with what they are known to hold: what differs is put back and offered on a card. `by` is the call whose
// command just ended, when one did; a change found as a call begins, or as the mod loads, is offered at the top of the panel
let personChecking: Promise<string[]> | undefined
const personCheck = async ($: EngineInterface, by?: ToolCallInput): Promise<string[]> => {
  if (!dir) return []
  // One look at a time in a chat: one asked for while another runs waits for it, then looks again
  while (personChecking) await personChecking.catch(() => undefined)
  const look = personLook($, by)
  personChecking = look
  try {
    return await look
  } finally {
    personChecking = undefined
  }
}
const personLook = async ($: EngineInterface, by?: ToolCallInput): Promise<string[]> => {
  await knownQueue
  let sealedKnown = await knownRead($)
  // Not checked, as the keychain did not answer: a chat that knows what they hold leaves them for the next look, and reads what it
  // knows meanwhile; one that knows nothing yet says so below
  if (!sealedKnown && isKnownUnsure && knownSeen) {
    knownWarn($, 'the keychain did not answer')
    return []
  }
  // No sealed copy, and this Mac never made one (no key of its own): the first load of a version that keeps one, and what is there
  // is the person's
  const key = !sealedKnown && !knownSeen ? await knownKey($) : 'yes'
  // Not sealed right as this chat first looks, where a key is: once more a moment later, as another chat may be writing it just now
  if (!sealedKnown && !knownSeen && key === 'yes') {
    await $.clock.sleep(300)
    sealedKnown = await knownRead($)
  }
  const now = await personNow($)
  // The keychain did not answer (locked, or refusing): nothing can be told apart, so the files are left as they are, and said
  if (key === 'error') {
    knownWarn($, 'the keychain did not answer')
    return []
  }
  if (key === 'no') {
    await knownSet($, kept => {
      kept.clear()
      for (const name of PERSON_FILES) if (now.has(name)) kept.set(name, now.get(name) ?? null)
    })
    await log($, 'what the settings and texts hold is kept from now on')
    return []
  }
  // No sealed copy where one was made: what this chat last knew, else (as the mod loads) shipped settings and texts, each own one
  // moved aside and offered, so a copy taken away or rewritten never decides what is in force
  const known = sealedKnown ?? (knownSeen ? new Map(knownSeen.files) : new Map<string, string | null>())
  if (!sealedKnown) await log($, knownSeen ? 'the kept copy of the settings and texts was changed or taken away: made again from what this chat knew' : 'the kept copy of the settings and texts is not sealed right: each own one is offered on a card')
  const undone: string[] = []
  for (const [name, is] of now) {
    if (personWriting.has(name)) continue
    const was = known.has(name) ? (known.get(name) ?? null) : null
    if (is === was) continue
    // The always-allowed list holds nothing its seals do not allow: one there as the copy is first made is kept
    if (name === 'admin-allowed.json' && !known.has(name)) {
      known.set(name, is)
      continue
    }
    await personPut($, name, was, is)
    undone.push(name)
    await log($, `${name} was changed outside Claudopus${by ? ' by a command' : ''}, and put back`)
    // Offered before the look ends, so the card is there once the call or the load that found it goes on (left to run on its own, a
    // slow Mac drew it late, and one begun under an earlier load could land after the next load's and take its card away)
    if (name !== 'admin-allowed.json') await offerUndone($, by, name, is).catch(err => log($, `change to ${name} not offered: ${String(err)}`))
  }
  for (const name of PERSON_FILES) if (now.has(name) && !known.has(name)) known.set(name, null)
  if (!sealedKnown) {
    for (const name of undone) known.set(name, known.get(name) ?? null)
    await knownSet($, kept => {
      kept.clear()
      for (const [name, text] of known) kept.set(name, text)
    }).catch(err => log($, `the kept copy not sealed: ${String(err)}`))
  }
  return undone
}
// One of them as the mod reads it: what it is known to hold, never a change made since, which a look puts back. A file that is not
// one of them, or a memory folder other than this chat's, is read as it is
const personText = async ($: EngineInterface, memory: string, name: string): Promise<string> => {
  const is = await readOr($, `${memory}/${name}`)
  if (!dir || memory !== dir || !PERSON_FILES.includes(name) || personWriting.has(name)) return is
  // A kept copy changed since this chat last looked (another chat's press, or anyone's write) has its seal checked first; one not
  // sealed right counts for nothing, and what this chat last knew is read
  const known = (await knownRead($).catch(() => undefined)) ?? knownSeen?.files
  if (!known) {
    void personCheck($).catch(() => undefined)
    return is
  }
  if (!known.has(name)) return is
  const was = known.get(name) ?? ''
  if (was === is) return is
  void personCheck($).catch(() => undefined)
  return was
}
// The one of these an Edit or Write call names, if any
const personNamed = (e: ToolCallInput) => {
  if (!dir) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const full = pathOf(String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? ''), home, cwd || home)
  return PERSON_FILES.find(one => full.toLowerCase() === `${dir}/${one}`.toLowerCase()) ?? ''
}
// The ones an Edit or Write the person allowed is writing now, in this chat: not compared until it is done
const personWriting = new Set<string>()
// What an allowed Write or Edit leaves in a file that held `before`: undefined when that cannot be worked out
const personMeant = (e: ToolCallInput, before: string | null | undefined): string | undefined => {
  const input = e as { content?: unknown; old_string?: unknown; new_string?: unknown; replace_all?: unknown; edits?: unknown }
  if (e.tool === 'Write') return typeof input.content === 'string' ? input.content : undefined
  const edit = (text: string | undefined, one: { old_string?: unknown; new_string?: unknown; replace_all?: unknown }) => {
    if (text === undefined || typeof one.old_string !== 'string' || typeof one.new_string !== 'string') return undefined
    if (one.old_string === '') return text === '' ? one.new_string : undefined
    if (!text.includes(one.old_string)) return undefined
    return one.replace_all ? text.split(one.old_string).join(one.new_string) : text.replace(one.old_string, () => String(one.new_string))
  }
  if (e.tool === 'Edit') return edit(before ?? undefined, input)
  if ((e.tool as string) === 'MultiEdit' && Array.isArray(input.edits)) return input.edits.reduce<string | undefined>((text, one) => edit(text, (one ?? {}) as never), before ?? undefined)
  return undefined
}
// A file of these that Edit or Write changed, as the person allowed: what it holds now is the person's, when it is what the call
// meant to write. Anything else (a program writing in the same moment) is left for the next look to put back and offer
const personSeen = async ($: EngineInterface, e: ToolCallInput, before?: string | null) => {
  if (!dir || !FILE_TOOLS.includes(e.tool)) return
  const name = personNamed(e)
  if (!name) return
  const text = await personRead($, name)
  if (text === undefined) return
  if (text !== personMeant(e, before)) return void log($, `${name} after an allowed ${e.tool} is not what it wrote: left for the look to put back`)
  await personWrote($, dir, name, text)
}
const PERSON_UNDONE = (names: string[]) =>
  named(`This command changed ${names.join(', ')} in {name}'s memory folder, and the change was undone: {name}'s own settings and texts are changed only with the Edit or Write tool, which waits for {name}'s press on the task's card. Don't try to change them another way.`)
// The change undone, on the card of the work whose command made it, else at the top: Allow makes it again. One card for each file:
// a later change to it replaces the one shown
const offerUndone = async ($: EngineInterface, by: ToolCallInput | undefined, name: string, text: string | null) => {
  const list = await read($, todos)
  const top = by?.agentId === undefined ? '' : topOf(list, by.agentId)
  const card = list.find(one => one.id === top)
  const what = name === 'config.json' ? 'your Claudopus settings (config.json)' : name.startsWith('rules/') ? `your rules (${name})` : `your role text (${name})`
  const at = await $.clock.now()
  const id = `${by ? by.tool_use_id : `seen${at.toString(36)}`}-u-${name.replace(/[^A-Za-z0-9]/g, '')}`
  for (const [other, offer] of undoneOffers) {
    if (offer.name !== name) continue
    undoneOffers.delete(other)
    gateHeld.delete(other)
    await setGates($, offer.top, gates => gates.filter(one => one.id !== other))
  }
  // Nothing waits on it: the card offers it until pressed, and the press itself makes the change again
  undoneOffers.set(id, { name, text, top: card ? top : '' })
  gateHeld.add(id)
  gatePressed.delete(id)
  await setGates($, card ? top : '', gates => [...gates.filter(one => one.id !== id), { id, kind: 'file', isUndone: true, ...(by ? {} : { isOutside: true }), host: what, command: cut(text ?? '(the file taken away)', 2000), at, ...(by?.agentId ? { from: by.agentId } : {}) }])
  await openList($).catch(() => undefined)
  $.ui.log(`${card ? `A command of the task "${titleOf(card)}" changed` : by ? 'A command changed' : 'Something outside Claudopus changed'} ${what}, and the change was undone · Press Allow once ${card ? 'on its card' : 'at the top'} in the Claudopus panel to make the change again, or Deny.`)
}
const undoneOffers = new Map<string, { name: string; text: string | null; top: string }>()
const answerUndone = async ($: EngineInterface, gate: Gate, said: GateSaid) => {
  const offer = undoneOffers.get(gate.id)
  undoneOffers.delete(gate.id)
  gateHeld.delete(gate.id)
  const list = await read($, todos)
  await setGates($, list.some(one => one.admins?.some(g => g.id === gate.id)) ? (list.find(one => one.admins?.some(g => g.id === gate.id))?.id ?? '') : '', gates => gates.filter(one => one.id !== gate.id))
  if (said !== 'once' || !offer || !dir) return log($, `change to ${gate.host}: left undone`)
  await personWrote($, dir, offer.name, offer.text)
  await personPut($, offer.name, offer.text, null)
  await log($, `change to ${gate.host}: made again, as allowed`)
}

// On the card: what it wants to run, whole, and the three presses. Another chat's panel shows it with no buttons: only the chat
// that holds the call allows it
// Drawn as Claude Code draws its own permission asks: an outlined box with the kind of ask at its top, never a filled card with an
// edge as work's cards are, so an ask is not taken for one more piece of work
const gateKind = (gate: Gate) => (gate.isUndone ? 'Undone' : gate.kind === 'release' ? 'Release' : gate.kind === 'file' ? 'Change to your files' : 'Admin command')
const gateRow = ($: EngineInterface, ui: Ui, gate: Gate, key: string, isElsewhere: boolean, card = '') => (
  <ui.Box key={key} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
    <ui.Text wrap="truncate-end" dimColor>{`${gateKind(gate)} · ${gateHeld.has(gate.id) && !isElsewhere ? (gate.isUndone ? 'yours to decide' : 'waits for your press') : isElsewhere ? 'asked in another chat' : 'no longer waits'}`}</ui.Text>
    <ui.Text wrap="wrap" color={NEEDS} bold>{gateWhat(gate)}</ui.Text>
    {gate.kind === 'release' && gate.folder ? (
      <ui.Box flexDirection="column">
        <ui.Text wrap="truncate-end">{`Branch ${gate.branch ?? ''}`}</ui.Text>
        <ui.Text dimColor wrap="truncate-start">{`from ${shortPath(gate.folder)}`}</ui.Text>
      </ui.Box>
    ) : gate.command ? (
      <ui.Box backgroundColor={FILL} paddingLeft={2}>
        <ui.Text mono wrap="wrap">{gate.command}</ui.Text>
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">What it is is shown only on its own Mac.</ui.Text>
    )}
    <ui.Text wrap="wrap">
      {gate.kind === 'release'
        ? 'Allow: this branch is merged into main, checked and pushed, with its version and tag. Deny: nothing is released, and Claudopus tells Claude.'
        : gate.isUndone && gate.isOutside
          ? 'It changed while no command of a task was running: by you in an editor, or by a program a command left running. Claude changes this file only with Edit or Write, which ask you first, so the change was undone. Allow: the change is made again, as shown (if you made it yourself, allow it). Deny: the file stays as it was. Either way what it held is saved beside it as a .put-back copy.'
          : gate.isUndone
          ? 'Claude changes this file only with Edit or Write, which ask you first, so what a command wrote to it was undone. Allow: the change is made again, as it was written (if you made it yourself, allow it). Deny: the file stays as it was. Either way what it held is saved beside it as a .put-back copy.'
          : gate.kind === 'file'
          ? 'Allow: the change is made to this file of yours. Deny: the file stays as it is, and Claudopus tells Claude.'
          : `Allow: it runs with admin rights${gate.isWork ? ', and this task runs its next admin commands without asking' : ''}. Deny: it doesn't run, and Claudopus tells Claude.`}
    </ui.Text>
    {gateHeld.has(gate.id) && !isElsewhere ? (
      <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
        <ui.Button key={`${key}-once-${loadMark}`} label={gate.isWork ? 'Allow for this task' : 'Allow once'} onPress={() => answerGate($, gate, 'once', card)} />
        {gate.kind ? null : <ui.Button key={`${key}-always-${loadMark}`} label="Always allow this command" onPress={() => answerGate($, gate, 'always', card)} />}
        <ui.Button key={`${key}-deny-${loadMark}`} label="Deny" onPress={() => answerGate($, gate, 'deny', card)} />
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">{isElsewhere ? 'Allow or deny it on its card in its own chat.' : 'It no longer waits.'}</ui.Text>
    )}
  </ui.Box>
)
// The gates on a work's card, and once one is answered, what was done in the same place, outlined green (grey once refused)
const adminBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string, at: number) =>
  one.admins?.some(gate => !gatePressed.has(gate.id)) || cardNotesOf(one.id, at).length ? (
    <ui.Box key={key} flexDirection="column" gap={1}>
      {(one.admins ?? []).filter(gate => !gatePressed.has(gate.id)).map(gate => gateRow($, ui, gate, `gate-${gate.id}`, Boolean(one.chat), one.chat ? '' : one.id))}
      {cardNotesPart(ui, one.id, at)}
    </ui.Box>
  ) : null
// A gate with no card, at the top of the panel
const gatesPart = ($: EngineInterface, ui: Ui) => looseGates.filter(gate => !gatePressed.has(gate.id)).map(gate => gateRow($, ui, gate, `gate-${gate.id}`, false))
// A path in one line: the home folder as ~, and the middle left out past `room` characters, keeping its last folders
const shortPath = (path: string, room = 44) => {
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const p = home && (path === home || path.startsWith(`${home}/`)) ? `~${path.slice(home.length)}` : path
  if (p.length <= room) return p
  const parts = p.split('/')
  for (let keep = parts.length - 2; keep >= 1; keep--) {
    const short = `${parts[0]}/…/${parts.slice(-keep).join('/')}`
    if (short.length <= room) return short
  }
  return `…/${parts.at(-1) ?? ''}`
}

// The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel

// ---- The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel ----
// The engine raises PermissionRequest as it puts a prompt to the person, and says nothing of the answer but a refusal: an allowed
// call just runs and ends. So a prompt goes when its call ends (refused, interrupted or run), when the terminal draws its running
// pill, or, for a command, as soon as a process running it is seen on this Mac. A prompt to allow a call is also answered by a press
// on its card: the engine runs its PermissionRequest hooks beside its own box, and the first answer, the box's or the hook's, stands
// `isPressedNo` marks one refused by a press on its card: if Claude Code's own box had answered first and the call goes on, its end
// says so in place of the press
type Waiting = Prompt & { tool: string; agent: string; snippet: string; seen?: number; isTold?: boolean; input?: Record<string, string>; isPressedNo?: boolean }
let waiting: Waiting[] = []
// The tool calls whose permission check asked, newest last, so the prompt that follows is known by its call's id: the one of the same
// loop, tool and input, else the newest of the same loop and tool
type AskedCall = { agent: string; tool: string; input: string; id: string }
let asked: AskedCall[] = []
const inputKey = (input: unknown) => JSON.stringify(input ?? null).slice(0, 2000)
const askedFor = (agent: string | undefined, tool: string, input: unknown) => {
  const same = asked.filter(one => one.agent === (agent ?? '') && one.tool === tool)
  const one = same.find(other => other.input === inputKey(input)) ?? same.at(-1)
  if (one) asked = asked.filter(other => other !== one)
  return one?.id
}
// What the prompt asks, in plain words and never a tool's own name: what is asked, exactly what (the command, the message, the page),
// and what a yes and a no each do. A message names the task it goes to, by its card
type Asks = Pick<Prompt, 'text' | 'kind' | 'detail' | 'yes' | 'no' | 'done'>
const NO_SKIPS = "No: it doesn't run, and the chat waits for what you say next."
const NO_TOLD = "No: it doesn't run, and Claudopus tells Claude you said no."
const promptOf = (tool: string, input: unknown, list: Todo[], isWork = false): Asks => {
  const given = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const field = (key: string) => (typeof given[key] === 'string' ? oneLine(given[key] as string) : '')
  const whole = (key: string, max: number) => (typeof given[key] === 'string' ? cut((given[key] as string).trim(), max) : '')
  const file = (path: string) => path.split('/').filter(Boolean).pop() ?? ''
  const workNamed = (id: string) => {
    if (!id) return 'another task'
    if (id === 'main' || id === 'parent') return 'its chat'
    const card = list.find(one => one.id === id) ?? list.find(one => id.startsWith(one.id))
    return card ? `the task “${titleOf(card)}”` : 'another task'
  }
  const allow = (text: string, yes: string, detail = '', no = isWork ? NO_TOLD : NO_SKIPS): Asks => ({ text, kind: 'allow', ...(detail ? { detail } : {}), yes: `Yes: ${yes}`, no })
  if (tool === 'Bash' || tool === 'PowerShell')
    return allow(`Run a command: ${cut(field('description'), 90) || cut(field('command'), 90) || 'no description'}`, 'the command runs on its Mac.', whole('command', 400))
  if (tool === 'Write') return allow(`Write the file ${file(field('file_path')) || 'a file'}`, 'the file is saved, replacing any file of that name.', field('file_path'))
  if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
    return allow(`Change the file ${file(field('file_path') || field('notebook_path')) || 'a file'}`, 'the change is made to the file.', field('file_path') || field('notebook_path'))
  if (tool === 'Read') return allow(`Read the file ${file(field('file_path')) || 'a file'}`, 'Claude reads the file; nothing is changed.', field('file_path'))
  if (tool === 'Glob' || tool === 'Grep') return allow(`Search files for ${cut(field('pattern'), 80) || 'a pattern'}`, 'Claude searches; nothing is changed.', field('path'))
  if (tool === 'WebFetch') return allow(`Open a web page on ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'the web'}`, 'Claude reads the page; nothing is sent but the address.', field('url'))
  if (tool === 'WebSearch') return allow(`Search the web for “${cut(field('query'), 80)}”`, 'Claude searches the web and reads the results.')
  if (tool === 'SendMessage') {
    const to = workNamed(field('to'))
    return {
      ...allow(
        to === 'its chat' ? 'Pass a message back to its chat' : `Pass a message to ${to}`,
        to === 'its chat' ? 'its chat gets the message.' : 'that task gets the message and acts on it.',
        whole('message', 400) || field('summary'),
        isWork ? "No: it isn't sent, and Claudopus tells Claude you said no." : "No: it isn't sent, and the chat waits for what you say next.",
      ),
      done: 'it was sent',
    }
  }
  if (tool === 'Agent' || tool === 'Task')
    return { ...allow(`Start a background task: ${cut(field('description'), 90) || 'with no title'}`, 'it starts in the background and gets a card here.', whole('prompt', 300), isWork ? NO_TOLD : "No: it isn't started, and the chat waits for what you say next."), done: 'it was started' }
  if (tool === 'TaskStop')
    return { ...allow(`Stop ${workNamed(field('task_id') || field('id'))}`, 'that task is stopped where it is.', '', isWork ? 'No: that task keeps running, and Claudopus tells Claude you said no.' : 'No: that task keeps running, and the chat waits for what you say next.'), done: 'it was stopped' }
  if (tool === 'Skill') return allow(`Use the skill “${field('skill') || field('name')}”`, 'Claude loads those instructions and follows them.')
  if (tool === 'AskUserQuestion') {
    const first = Array.isArray(given.questions) ? (given.questions[0] as { question?: unknown } | undefined)?.question : undefined
    return {
      text: typeof first === 'string' && first.trim() ? `Answer a question: ${cut(oneLine(first), 120)}` : 'Answer a question',
      kind: 'question',
      yes: 'Pick an answer: it goes back and Claude continues with it.',
      no: 'Skip it: no answer goes back, and Claude waits for what you say next.',
    }
  }
  if (tool === 'ExitPlanMode')
    return { text: 'Approve a plan', kind: 'plan', detail: whole('plan', 400), yes: 'Yes: Claude starts doing what the plan says.', no: 'No: Claude keeps planning; say what to change.' }
  const mcp = tool.match(/^mcp__(.+?)__(.+)$/)
  const words = field('description') || field('text') || field('query') || field('title') || field('name') || field('url')
  if (mcp) return allow(`Use “${(mcp[2] ?? '').replace(/_/g, ' ')}” from ${(mcp[1] ?? '').replace(/^plugin_[^_]+_/, '').replace(/[_-]/g, ' ')}`, 'that action runs.', cut(words, 300))
  return allow(words ? `Use a tool: ${cut(words, 90)}` : 'Use one of its tools', 'that tool runs.', '')
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
  const strings = Object.fromEntries(Object.entries(input && typeof input === 'object' ? input : {}).filter(([, value]) => typeof value === 'string')) as Record<string, string>
  const one: Waiting = { id, ...promptOf(tool, input, list, Boolean(agent)), ...(card ? { title: titleOf(card) } : {}), at, tool, agent: agent ?? '', snippet: snippetOf(tool, input), input: strings }
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
// The prompt of a call goes: by its id, else the oldest one of the same loop and tool whose id was not known. With what came of it,
// it stays, answered: allowed and running, then ended (allowed and run, refused, or ended before an answer) for PROMPT_SHOWN more.
// Without (a settings hook answered it), it goes at once: nothing was put to the person
type Outcome = 'running' | 'ran' | 'no' | 'stopped'
let answeredPrompts: Waiting[] = []
const PROMPT_SHOWN = 15_000
// An allowed call whose end is never seen is taken as over this long after it was seen running, so nothing stays purple for good
const RUNNING_LONGEST = 15 * 60_000
const answeredShown = (at: number) => answeredPrompts.filter(one => (one.endedAt ? at - one.endedAt < PROMPT_SHOWN : at - one.at < RUNNING_LONGEST))
const settle = ($: EngineInterface, id: string, agent?: string, tool?: string, outcome?: Outcome, args?: Record<string, unknown>) => {
  const byTool = (one: Waiting) => one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent ?? '')
  // The same call as the prompt asked about: every word it asked with is the call's own
  const isSameCall = (one: Waiting) => Boolean(args) && Object.keys(one.input ?? {}).length > 0 && Object.entries(one.input ?? {}).every(([key, value]) => args?.[key] === value)
  // Its own id first, open or answered; only then the oldest open one of the same loop and tool whose id was not known. That one says
  // what came of it only when the call asked with the very same words; else it may be another call's, and it goes with no word
  const exact = waiting.find(one => one.id === id)
  const isOpen = (one: Waiting) => !one.endedAt || one.isPressedNo
  let was = exact ? undefined : answeredPrompts.find(one => one.id === id && isOpen(one))
  const sameOpen = exact || was || !tool ? undefined : waiting.find(one => byTool(one) && isSameCall(one))
  // One answered on its card, whose id was not known, is the same call only when it asked with the very same words, and only when no
  // open prompt did
  if (!exact && !was && !sameOpen && tool) was = answeredPrompts.find(one => isOpen(one) && (one.isRunning || one.isPressedNo) && byTool(one) && isSameCall(one))
  const guessed = exact || was || !tool ? undefined : (sameOpen ?? waiting.find(byTool))
  const gone = exact ?? guessed
  if (!gone && !was) return
  if (gone) waiting = waiting.filter(one => one !== gone)
  const before = exact ?? was ?? (guessed && isSameCall(guessed) ? guessed : undefined)
  if (outcome && before) {
    void $.clock.now().then(now => {
      const isEnd = outcome !== 'running'
      // A no pressed on the card stands unless the call went on: then Claude Code's own box had said yes first
      if (before.isPressedNo && outcome !== 'running' && outcome !== 'ran') return
      const wasAllowed = before.answered === 'yes'
      const answered: Prompt['answered'] = outcome === 'no' ? 'no' : outcome === 'stopped' && !wasAllowed ? 'stopped' : 'yes'
      const { isHeld: _held, isPressedNo: _pressed, ...base } = before
      const after: Waiting = { ...base, ...(outcome === 'no' && pressedNo.has(before.id) ? { isPressedNo: true } : {}), answered, isRunning: !isEnd, ...(isEnd ? { endedAt: now } : { at: now }), ...(outcome === 'stopped' && wasAllowed ? { isCut: true } : {}) }
      answeredPrompts = [...answeredShown(now).filter(one => one.id !== before.id), after].slice(-10)
      redraw($)
      void shareMine($).catch(() => undefined)
      $.clock.after((isEnd ? PROMPT_SHOWN : RUNNING_LONGEST) + 100, () => (redraw($), void shareMine($).catch(() => undefined)))
    })
  }
  redraw($)
  void shareMine($).catch(() => undefined)
}
// What came of a call, as it ended: the person said no, it ended before it ran (interrupted, timed out, the turn or session ended), or
// it ran. The engine says most endings in words, in the result or its text, often with isError
const REFUSED_WORDS = /doesn't want to proceed|tool use was rejected|user (denied|rejected)|permission to use .{1,80} (has been|was) denied/i
const NOT_RUN_WORDS = /\[(tool call (not|did not) complete|request interrupted)|interrupted by user|the (turn|session) (was )?ended|approval request expired/i
const outcomeOf = (r: { deny?: unknown; result?: unknown; text?: unknown; isError?: unknown } | undefined): Outcome => {
  if (!r) return 'stopped'
  // Only a call that did not end well is read for words: a command that ran may print anything
  if (!r.deny && !r.isError && typeof r.result !== 'string') return 'ran'
  const words = [typeof r.deny === 'string' ? r.deny : '', typeof r.text === 'string' ? r.text : '', typeof r.result === 'string' ? r.result : JSON.stringify(r.result ?? '').slice(0, 2000)].join('\n')
  if (REFUSED_WORDS.test(words)) return 'no'
  if (NOT_RUN_WORDS.test(words)) return 'stopped'
  if (r.deny) return 'no'
  return r.isError ? 'stopped' : 'ran'
}
// The mod's own message, once on its way: a prompt it raised that no hook of the mod saw (one of its own tools, by a plugin's call
// id) is over with it
// The mod's own message to work: a prompt it raises is over once it is on its way
const sendOwn = async ($: EngineInterface, message: { to: { agentId: string }; text: string }) => {
  const since = await $.clock.now()
  try {
    return await $.session.send(message)
  } finally {
    ownSent($, since)
  }
}
const ownSent = ($: EngineInterface, since: number) => {
  const own = waiting.filter(one => one.id.startsWith('toolu_plugin_') && OWN_CALLS.includes(one.tool) && one.at >= since)
  if (!own.length) return
  waiting = waiting.filter(one => !own.includes(one))
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
    for (const one of sought) if (countOf(lines, one.snippet) > (one.seen ?? 0)) settle($, one.id, undefined, undefined, 'running')
  } finally {
    isLooking = false
  }
}

// A press on a prompt's card, by the prompt's id, read by its hold between two looks; the prompts held now
const promptSaid = new Map<string, 'yes' | 'no'>()
const promptHeld = new Set<string>()
const pressedNo = new Set<string>()
// The longest a prompt waits for a press: past it the hook hands the prompt back to whatever else answers it
const HOLD_LONGEST = 10 * 60_000
const PRESSED_NO = "The person said no to this on its card in the Claudopus panel. It didn't run. Wait for what they say next."
const PRESSED_NO_WORK = "The person said no to this on its card in the Claudopus panel. It didn't run: don't try it another way; continue without it."
const markHeld = ($: EngineInterface, id: string, isHeld: boolean) => {
  waiting = waiting.map(one => (one.id !== id ? one : isHeld ? { ...one, isHeld: true } : (({ isHeld: _held, ...rest }) => rest)(one)))
  redraw($)
  void shareMine($).catch(() => undefined)
}
// Holds the prompt until a press on its card, its call ends (the box was answered), the engine gives up on the hook, or this copy of
// the mod is replaced. As the admin gate does, the wait is a one-second sleep run by the engine, whose time the hook's own budget
// does not count. Its buttons show only while it is held. Claude Code's box answers beside it, and that answer is seen only as the
// call runs or ends; a press after it changes nothing, and the card then says what the call did
const holdPrompt = async ($: EngineInterface, next: { signal?: AbortSignal; budget?: { remainingMs: number } }, id: string): Promise<'yes' | 'no' | undefined> => {
  const since = await $.clock.now()
  promptHeld.add(id)
  markHeld($, id, true)
  let said: 'yes' | 'no' | undefined
  try {
    for (;;) {
      said = promptSaid.get(id)
      if (said) break
      if (!waiting.some(one => one.id === id) || next.signal?.aborted || (next.budget?.remainingMs ?? Infinity) < 1500 || (await isReplaced($))) break
      if ((await $.clock.now()) - since > HOLD_LONGEST) break
      await $.process.run(['/bin/sleep', '1'], { timeoutMs: 10_000 }).catch(() => undefined)
    }
  } finally {
    promptHeld.delete(id)
    promptSaid.delete(id)
    if (waiting.some(one => one.id === id)) markHeld($, id, false)
  }
  return said
}
// A press on Yes or No on its card in this chat's own panel, the only answer the mod gives: the prompt is answered at once and its card says so, as one answered in the box
const answerPrompt = ($: EngineInterface, id: string, said: 'yes' | 'no') => {
  presses += 1
  if (!promptHeld.has(id) || promptSaid.has(id)) return false
  const one = waiting.find(other => other.id === id)
  if (!one) return false
  promptSaid.set(id, said)
  if (said === 'no') pressedNo.add(id)
  settle($, id, one.agent || undefined, one.tool, said === 'yes' ? 'running' : 'no')
  return true
}

// Work an allowed Agent call started: its prompt was answered, so it leaves the amber and its buttons go
const agentStarted = ($: EngineInterface, toolUseId: string | undefined) => {
  if (toolUseId && waiting.some(one => one.id === toolUseId)) settle($, toolUseId, undefined, undefined, 'running')
}

const OWN_CALLS = ['SendMessage', 'TaskStop']
const isOwnCall = (next: { origin?: { plugin?: string } }) => next.origin?.plugin === 'claudopus'

const promptHooks = (on: On) => {

  // A prompt the app is about to put to the person shows amber in every panel. The mod answers only two kinds itself: its own messages
  // and Stops below, and a prompt the person answers with Yes or No on its card in this chat's own panel (PermissionRequest). A
  // settings hook that answered it put nothing to the person
  on('tool.check', async ($, e, next) => {
    // The mod's own calls carry out what the person already chose: their reply passed on to work, a Stop they pressed. The engine
    // would put each to them again as "Allow SendMessage", a prompt that says nothing of what it is, and no hook of the mod sees that
    // call end, so it never left the panel. Only these two tools, and only the mod's own calls of them, are allowed here
    const r = await next(e)
    // Only an ask becomes an allow: a rule or hook of the person's that refuses it still does
    if (r.decision === 'ask' && OWN_CALLS.includes(e.tool) && e.tool_use_id && isOwnCall(next as { origin?: { plugin?: string } })) return { ...r, decision: 'allow' }
    if (r.decision === 'ask' && e.tool_use_id && e.approver) {
      asked = [...asked.filter(one => one.id !== e.tool_use_id), { agent: e.agentId ?? '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }].slice(-50)
    }
    return r
  })
  on('classic.PermissionRequest', async ($, e, next) => {
    const id = dir && !isEnded ? await opened($, e.agent_id, e.tool_name, e.tool_input).catch(err => (void log($, `prompt not shown: ${String(err)}`), '')) : ''
    const r = await next(e)
    if (id && r?.decision) {
      settle($, id)
      return r
    }
    // A call to allow waits for a press on its card while the person can see one; a question or a plan is the person's own box's
    const one = waiting.find(other => other.id === id)
    if (!one || one.kind !== 'allow' || !(await $.session.surfaces().catch(() => [])).length) return r
    const said = await holdPrompt($, next, id)
    if (!said) return r
    if (said === 'yes') return { ...r, decision: { behavior: 'allow' } }
    // No from the chat's own thread stops its turn, as the box's No does; Claude is told, and continues without it
    return { ...r, decision: { behavior: 'deny', message: one.agent ? PRESSED_NO_WORK : PRESSED_NO, ...(one.agent ? {} : { interrupt: true }) } }
  })
  on('classic.Notification', async ($, e, next) => {
    if (e.notification_type === 'permission_prompt' && waiting.length) await tellWaiting($).catch(err => log($, `prompt not told: ${String(err)}`))
    return next(e)
  })
  // It goes as its call ends (refused, interrupted, or allowed and run: the main tool.call hook below), or as the terminal draws its
  // running pill
  on('ui.render', { component: 'ToolProgress' }, async ($, e, next) => {
    const id = e.props.tool_use_id
    if (waiting.some(one => one.id === id)) void Promise.resolve().then(() => settle($, id, undefined, undefined, 'running'))
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


// Work the engine still listed as running as its turn ended is looked at again this long after: one whose run was over by then is
// listed as completed, and the look ends its card (sync) and passes on a reply it never read, as the turn's end would have
const HELD_LOOK = 1500
const heldLook = async ($: EngineInterface, id: string) => {
  await sync($)
  // Listed as idle, or no longer listed, its run is over too: nothing holds it
  const listed = (await $.agent.list().catch(() => undefined))?.find(one => one.id === id)?.status
  if (listed === 'idle' || listed === undefined) {
    const now = await $.clock.now()
    await changeTodos($, list => list.map(one => (one.id === id && one.status === 'working' ? ended(one, 'done', now) : one)))
  }
  if ((await read($, todos)).find(one => one.id === id)?.status === 'working') return
  await replyUnread($, id)
  if (wakes.length) await sendWakes($)
}
const chatHooks = (on: On) => {
  on('session.start', async ($, e, next) => {
    await knowSystem($).catch(() => undefined)
    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
    lastSeen = undefined
    // and reads its own copy's version again
    loadedVersion = undefined
    // and takes nothing it knew of the person's settings and texts as sealed: the kept copy is checked again
    knownSeen = undefined
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
    if ((await $.ui.panes().catch(() => [])).length) (loadMark = presses = 1 + ((await $.clock.now()) % 1_000_000_000) * 1000), (freshness += 1)
    await loadSettings($)
    await clearGates($).catch(err => log($, `admin holds not cleared: ${String(err)}`))
    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
    await closeUndrawn($)
    $.clock.after(3000, () => closeUndrawn($))
    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
    await watchLoaded($).catch(err => log($, `tabs not watched: ${String(err)}`))

    // The engine's id names this chat's files, as its transcript is named
    const id = await $.session.id()
    const title = await appTitle($)
    // The first load of a session sends the role text; a reload keeps what stands
    await update($, me, m => ({ ...m, id, title: title ?? m.title, needsContext: m.id ? m.needsContext : true }))
    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
    await noteCut($, id).catch(err => log($, `cut-off work not looked for: ${String(err)}`))
    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
    await readOthers($).catch(() => undefined)
    keysOnStart($)

    await $.tool.register({
      name: 'update',
      description: 'Records a topic in the memory index: creates it, or changes the fields given. `brief` replaces the whole page of notes on it: read it first and keep what other tasks wrote.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          repo: { type: 'string', description: 'The folder the task happens in' },
          state: { type: 'string', description: 'How far it has got, in at most six words; start with "done" once it is pushed or deployed. Put detail in `brief`' },
          summary: { type: 'string', description: 'One line on what the topic is for' },
          brief: { type: 'string' },
        },
        required: ['name'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'recall',
      description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, topic notes, pastes, and the results finished tasks left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'todo',
      description:
        named('For background tasks: keeps the to-dos on your card in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks the one you are doing, ticks it done or drops it; `was` gives its earlier wording when you reword it.'),
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
        named('For background tasks: says how far you have got, on your card, replacing the line before. Write it when you start and whenever that changes: what is done and what you are doing, in one plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: that request in one line. The chat starts it as a task of its own') },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'ask',
      description: named(
        "For background tasks: when a step needs {name}'s own hands or go-ahead now (a code to paste, a box to fill, a key or button to press, an approval), puts your question at the top of the panel on your card and in the chat as a notice; {Name} answers with a button or in their own words. {Name} sees it before your report, so it must carry everything needed to decide and never point at an explanation elsewhere. It stays until answered, even after you finish; the answer arrives as a message at your next step, or starts you again. Meanwhile continue with what does not depend on it, or end your step saying what you are waiting for. Ask again if the answer leaves something open; call it with empty `text` only once you have seen it done. Never open a terminal for a command yourself.",
      ),
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
          details: { type: 'string', description: 'What it is about, in full: what changes, what it costs, what is not done. Short plain lines and "- " lists with a blank line after, no tables or bold: the card is narrow and the chat shows plain text' },
          copy: { type: 'string', description: 'Only text they must paste elsewhere, such as a one-time code or a link' },
          choices: { type: 'array', items: { type: 'string' }, description: 'Buttons to answer with, such as Approve and Not now (Done and Not now when left out)' },
          command: { type: 'string', description: 'A command only they can run, never one you can run yourself: one line, whole, shown with a Copy button' },
          cwd: { type: 'string', description: 'The full path of the folder the command runs in, when it has relative paths' },
          pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the pictures the question is about, shown with it on the card and in the chat' },
        },
        required: ['text'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'waits',
      description: named(
        "For background tasks, before you finish: records what in your report waits on {name}, each as one short line {name} can answer yes or no. The panel shows each with Yes / No / Not now. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. It replaces what was recorded before; do not call it when nothing waits.",
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
    // What the person had typed into a reply box before a reload of the mod is in its box again
    await readDrafts($).catch(() => undefined)
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
      await watchFront($).catch(err => log($, `tab in front not watched: ${String(err)}`))
      if (seconds % 2 === 0) await lookForStarted($).catch(err => log($, `running commands not looked at: ${String(err)}`))
      if ((seconds += 1) % (LOOK_EVERY / 1000) === 0) {
        await readAnswers($).catch(err => log($, `answers from other chats not read: ${String(err)}`))
        await readOthers($).catch(err => log($, `other chats not read: ${String(err)}`))
      }
      const isFlowing = (await read($, flows)).some(f => f.status === 'working')
      // Held while the person types into a reply box (holdTimes)
      // A pane held while only its running times moved is drawn again once CALM is over (heldDrawings)
      const calmNow = await $.clock.now()
      const isMoving = isFlowing || (await read($, todos)).some(one => !one.parentId && one.status === 'working') || (await read($, others)).some(c => c.cards.some(card => card.status === 'working'))
      // A drawing of a size or tab no longer drawn is let go after a minute: it would only be drawn afresh
      if (!isTyping) for (const [key, held] of heldDrawings) if (calmNow - held.at >= 60_000) heldDrawings.delete(key)
      // The mod alone says when its panes are drawn again, and only when what they show has moved (calmLook)
      await calmLook($, isMoving).catch(err => log($, `panes not looked at: ${String(err)}`))
      // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
      if ((await read($, todos)).some(one => !one.parentId && one.status === 'working')) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))
      // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
      const now = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos))].filter(card => isLingering(card, now))) {
        const key = `${one.id}:${one.endedAt}`
        if (lingerSet.has(key)) continue
        lingerSet.add(key)
        $.clock.after(pauseFrom(one) + LINGER - now + 20, () => void ((lingerSet.delete(key), drawAgain($), update($, tick, n => n + 1))))
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
    // A chat the app runs from another Mac has a keeper on this one, which goes on with its work should the app end its process
    if (isRunFromAfar) await startKeeper($, id).catch(err => log($, `keeper not started: ${String(err)}`))
    if (macs.length) everyLoad($, OPEN_EVERY, () => takeOpens($).catch(err => log($, `presses on other Macs not taken: ${String(err)}`)))
    if (macs.length) everyLoad($, FETCH_EVERY, () => syncResults($).catch(err => log($, `results not made the same: ${String(err)}`)))
    await shareMine($).catch(() => undefined)
    await readAnswers($).catch(() => undefined)
    await readOthers($).catch(() => undefined)
    // The workflows kept, read back, and followed while they run
    await knowSession($)
    await loadFlows($).catch(err => log($, `workflows not read back: ${String(err)}`))
    everyLoad($, FLOW_EVERY, () => followFlows($).catch(err => log($, `workflows not followed: ${String(err)}`)))
    // Every hour one chat looks at the version page, and only looks: an update is installed, and a chat reloaded to it, only by a press
    afterLoad($, UPDATE_AFTER, () => void lookForNew($).catch(err => log($, `update not looked for: ${String(err)}`)))
    everyLoad($, UPDATE_LOOK, () => lookForNew($).catch(err => log($, `update not looked for: ${String(err)}`)))
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
    // The texts a message is answered with are the ones known: a change made since is put back first
    if (dir) await personCheck($).catch(err => log($, `files not compared as a message came: ${String(err)}`))
    if (wakes.length) await sendWakes($).catch(err => log($, `answer not sent: ${String(err)}`))
    // The notice that a workflow ended ends its card
    if (dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) await flowEnded($, e.text).catch(err => log($, `workflow end not read: ${String(err)}`))
    // The engine's notice that work the person stopped has ended says it was stopped "by Claude": the chat is told it was them
    if (dir && !isOff && e.origin.kind === 'task-notification' && e.text.includes('<task-notification')) {
      const ids = [...e.text.matchAll(/<task-id>([^<]+)<\/task-id>/g)].map(m => m[1] ?? '')
      const held = (await read($, todos)).filter(one => !one.parentId && isHeld(one) && ids.includes(one.id))
      if (held.length) {
        const told = held.map(one => named(STOPPED_BY_YOU(titleOf(one), one.id, stopLeft.get(one.id) ?? [])))
        for (const one of held) stopLeft.delete(one.id)
        return next({ ...e, context: [...(e.context ?? []), ...told] })
      }
    }
    if (e.isMeta || e.command || !dir) return next(e)
    // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
    const isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text)
    const isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed
    if (!isPerson) return next(e)
    const context = [...(e.context ?? [])]
    // Their message lifts the hold on work they stopped: the chat is reminded it was stopped, and starts it again only if asked
    const stillHeld = (await read($, todos)).filter(one => isHeld(one) && !one.parentId)
    if ((await read($, todos)).some(isHeld)) {
      await changeTodos($, list => list.map(one => (isHeld(one) && one.byYou ? { ...one, byYou: { ...one.byYou, isLifted: true } } : one)))
      if (stillHeld.length) context.push(named(STOPPED_EARLIER(stillHeld.map(one => `"${titleOf(one)}" (${one.id})`))))
    }
    let text = e.text
    const m = await read($, me)

    if (!isOff) {
      // The role goes out with the person's first message, after a compaction, and again when its text has changed
      const role = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/chat.md')).text, models))
      const roleSent = mark(role)
      if (!m.isChat || m.needsContext || roleSent !== m.roleSent) {
        // Each subject with the path of its brief, so a brief for work on it can name that path without a search
        const subjects = (await readIndex($)).map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary, `streams/${slug(s.name)}.md`].join(' | ')}`).join('\n')
        context.push(`${role}\nThis chat's saved words: ${dir}/words/${m.id}.md\nTopics so far (name | folder | session | state | summary | its notes, under ${dir}):\n${subjects || '(none yet)'}`)
      }
      // How full each piece of work is, so a steer for one that is nearly full goes to a fresh agent instead
      const sizes = (await read($, todos))
        .filter(one => !one.parentId && one.tokens > 0)
        .slice(-8)
        .map(one => `${one.title || 'task'} (${one.id}) ${one.isFork && m.window ? `${Math.round((one.tokens / m.window) * 100)}%` : thousands(one.tokens)}`)
      const told = reportsTold(await read($, reports), await $.clock.now())
      context.push(`${BRIEF}${sizes.length ? `\nHow full each task's context is: ${sizes.join('; ')}.` : ''}${told ? `\n${told}` : ''}`)
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
    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
    await lapsedSignIn($, e).catch(err => log($, `lapsed sign-in not handed over: ${String(err)}`))
    if (e.agentId !== undefined) {
      const id = e.agentId
      const now = await $.clock.now()
      // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer
      const answer = ((e.answer ?? '').trim() || handedBack.get(id) || '').slice(0, ANSWER_CHARS)
      // Held: the engine keeps it for what it left running, and lists it as waiting. As a turn ends the engine may still list it as
      // running for a moment, held or not: taken as held then, and looked at again shortly (heldLook)
      const listed = (await $.agent.list().catch(() => [])).find(one => one.id === id)?.status
      const isHeld = listed === 'waiting' || listed === 'running'
      if (listed === 'running') $.clock.after(HELD_LOOK, () => void heldLook($, id).catch(err => log($, `work ${id} not looked at again: ${String(err)}`)))
      const how: Todo['status'] = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done'
      // Held only by its own background work, a turn that ends with its report has finished the work: by SubagentHandback, or a
      // reply as long as a report. A short line such as "started it in the background" has not, nor work that waits on its helpers
      // Held on a command or watch of its own that wakes it as it ends, with a to-do of its still being done, it has not finished:
      // what it hands back on the way (an answer to a question while it waits) is no report, and its card stays at work
      const isGoingOn = how === 'done' && isHeld && goesOn(await read($, todos), id)
      const isReport = how === 'done' && isHeld && !isGoingOn && (handedBack.has(id) || answer.length >= REPORT_LEAST)
      // A report in words, with nothing of its own running, has finished the work as a handback does: the engine may hold it on what
      // no tool shows open, and the chat need not stop it. Its card ends with its clock, and an ask it leaves stays to be answered
      const isIdleReport = isReport && ownsNothing(await read($, todos), id)
      // SubagentHandback ends the work's run: its card ends done with its report, though what it left running in the background (a
      // server, a watch, a helper) goes on and is not stopped. Should that wake the work, its next step brings the card back
      const isHandedBack = how === 'done' && (handedBack.has(id) || isIdleReport) && !isGoingOn
      if (isHandedBack) (ownsNothing(await read($, todos), id) ? leftNothing.add(id) : leftNothing.delete(id))
      handedBack.delete(id)
      if (isHandedBack) endedByHandback.add(id)
      if (isHandedBack) await changeTodos($, list => list.map(one => (one.id === id ? { ...one, handedBackAt: now } : one)))
      // Work nothing holds any more has nothing of its own left running in the background
      if (!isHeld) await changeTodos($, list => (list.some(one => one.id === id && one.bg) ? list.map(one => (one.id === id ? { ...one, bg: undefined, waitsSince: undefined } : one)) : list))
      await changeTodos($, list => {
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
      // A helper that has ended lets the work waiting on it go at once, not at the next look round
      if (card?.parentId && card.status !== 'working') await writeRolls($, true).catch(err => log($, `helpers not written: ${String(err)}`))
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
    // A piece of work compacted loses the rules it was handed after its brief: it is handed them again at its next step
    const agent = e.agentId
    if (agent !== undefined && e.trigger !== 'precompute' && dir) await changeTodos($, list => (list.some(one => one.id === agent && !one.parentId) ? list.map(one => (one.id === agent ? { ...one, rulesDue: true } : one)) : list))

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
// Work the mod started again after it had stopped mid-step: once only; stuck again, it is only told to the chat
const restartedOnce = new Set<string>()
const inFlight = new Map<string, { agent: string; what: string; at: number; cmd?: string; label?: string }>()
const seenLines = new Map<string, Set<string>>()

// What a running call is, in a few words, for its row
const runningWhat = (tool: string) =>
  tool === 'Bash' ? 'a command running' : tool === 'Grep' || tool === 'Glob' ? 'a search running' : tool === 'Agent' ? 'a helper running' : `${tool.replace(/^mcp__.*__/, '')} running`

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
  return first ? { what: first.what, at: first.at, ...(first.cmd ? { cmd: first.cmd, label: first.label } : {}) } : undefined
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
const callBegun = async ($: EngineInterface, id: string, agent: string, tool: string, input?: { command?: unknown; description?: unknown }) => {
  // A command keeps itself and its own words for itself, so its row can say which
  const cmd = tool === 'Bash' ? oneLine(String(input?.command ?? '')).slice(0, 400) : ''
  const label = oneLine(String(input?.description ?? '') || cmd.split('\n')[0] || '').slice(0, 160)
  inFlight.set(id, { agent, what: runningWhat(tool), at: await $.clock.now(), ...(cmd ? { cmd, label } : {}) })
  await changeTodos($, list => withRunning(list, agent))
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
  await changeTodos($, list => withRunning(list, agent, isNew ? now : undefined))
}

// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
const movedAt = (list: Todo[], top: Todo) => Math.max(...[top, ...underOf(list, top.id)].map(one => Math.max(one.startedAt, one.endedAt, one.newAt ?? 0)))

// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work waiting on the person is not flagged: asking them something, or stopped
// on the app's own prompt to allow a call; nor work that gave its report and is only held by what it left running
const lookStuck = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const told: Todo[] = []
  await changeTodos($, list => {
    // Told afresh on each run of the change, as it runs again on a list written meanwhile
    told.length = 0
    let isChanged = false
    const isPrompted = (one: Todo) => waiting.some(p => p.agent && topOf(list, p.agent) === one.id)
    const next = list.map(one => {
      if (one.parentId || one.chat) return one
      // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
      const isWaitingOwn = Boolean(one.waitsSince && one.bg?.some(b => !b.isWatch))
      const isStuck = one.status === 'working' && !(one.ask && !one.ask.replied) && !one.admins?.length && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER
      if (isStuck && !one.stuckAt) return ((isChanged = true), told.push(one), { ...one, stuckAt: movedAt(list, one) })
      if (!isStuck && one.stuckAt) return ((isChanged = true), { ...one, stuckAt: undefined })
      return one
    })
    return isChanged ? next : list
  })
  // Stuck work the engine no longer runs had stopped mid-step (the app restarted, the Mac slept, its run was cut off): it is
  // started again at once with a message of the mod's own, rather than waiting for the chat or the person to notice
  const engine = told.length ? await $.agent.list().catch(() => undefined) : undefined
  for (const one of told) {
    const mins = Math.round((now - movedAt(await read($, todos), one)) / 60_000)
    const status = engine?.find(agent => agent.id === one.id)?.status
    // Not work that only waits: on a helper the engine still runs, or on background work it holds
    const helpers = underOf(await read($, todos), one.id).map(kid => kid.id)
    const isWaiting =
      WORKING.includes(String(status)) || Boolean(engine?.some(agent => (agent.parentId === one.id || helpers.includes(agent.id)) && WORKING.includes(agent.status)))
    // Only work the engine lists as no longer running: work it does not list at all is only flagged. Not work cut off by a
    // restart that the mod brings back itself, nor work just answered on its card, nor work started so once already
    const isStopped =
      Boolean(status) && !isWaiting && !isHeld(one) && !stoppedHere.has(one.id) && !cutPending.has(one.id) && !one.ask?.replied && !restartedOnce.has(one.id)
    if (isStopped) restartedOnce.add(one.id)
    const r = isStopped && !(await isReplaced($)) ? await sendOwn($, { to: { agentId: one.id }, text: named(RESTARTED_WORK) }).catch(err => ({ isDelivered: false as const, reason: String(err) })) : undefined
    if (r?.isDelivered) {
      await log($, `work ${one.id} had stopped mid-step (the engine lists it ${status}): started again`)
      await sayInChat($, named(RESTARTED_IN_CHAT(titleOf(one), mins)))
    } else await sayInChat($, named(STUCK_IN_CHAT(titleOf(one), mins)))
  }
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
    ? helpers.every(isLong) ? ` ${helpers.length === 1 ? 'Its helper is still' : helpers.length === 2 ? 'Both helpers are still' : `All ${helpers.length} helpers are still`} waiting.` : ''
    : isLong(one) ? ` One step has been running for ${took(at - (one.running?.at ?? at))}.` : ''
  return `No progress for ${mins} min.${tail}`
}

// A row's running call, with its time, once it has run RUNNING_SHOWN
const runningLine = (one: Todo, at: number) => (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? `${one.running.what} · ${took(at - one.running.at)}` : '')

// ---- What work started in the background itself, which wakes it as it ends ----

const BG_KEPT = 20
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response wakes nothing and is not kept
const keepBackground = async ($: EngineInterface, agent: string, call: { tool: string; description?: unknown; command?: unknown; task_id?: unknown; shell_id?: unknown; timeout_ms?: unknown; persistent?: unknown }, result: unknown) => {
  if (call.tool === 'TaskStop' || call.tool === 'KillShell') return dropBackground($, [String(call.task_id ?? call.shell_id ?? '')], 'stopped')
  const r = (result && typeof result === 'object' ? result : {}) as { backgroundTaskId?: unknown; taskId?: unknown; backgroundEndsWithFinalResponse?: unknown }
  // A command the engine ends with the work's final response wakes nothing and is not kept (the engine does not always say that
  // one it keeps wakes its owner, so its silence is no sign)
  const id = call.tool === 'Bash' ? r.backgroundTaskId : call.tool === 'Monitor' ? r.taskId : undefined
  if (typeof id !== 'string' || !id || r.backgroundEndsWithFinalResponse) return
  const what = oneLine(String(call.description ?? '') || String(call.command ?? '').split('\n')[0] || '').slice(0, 160)
  const cmd = oneLine(String(call.command ?? '')).slice(0, 400)
  const now = await $.clock.now()
  // A watch ends at the time limit the engine said as it started it ("expires in 30m"), or else the one it was given where that is
  // within the engine's own 30 minutes; one kept for good has none
  const said = typeof result === 'string' ? result : JSON.stringify(result ?? '')
  const told = (result && typeof result === 'object' ? result : {}) as { timeoutMs?: unknown; persistent?: unknown }
  const isForGood = [call.persistent, told.persistent].some(p => p === true || p === 'true')
  const limit = call.tool !== 'Monitor' || isForGood ? undefined : Number(told.timeoutMs) > 0 ? Math.min(Number(told.timeoutMs), WATCH_MOST) : (expiresIn(said) ?? (Number(call.timeout_ms) > 0 ? Math.min(Number(call.timeout_ms), WATCH_MOST) : undefined))
  await changeTodos($, list =>
    list.map(one => (one.id === agent ? { ...one, bg: [...(one.bg ?? []).filter(b => b.id !== id), { id, what, at: now, ...(cmd ? { cmd } : {}), ...(call.tool === 'Monitor' ? { isWatch: true } : {}), ...(limit ? { expiresAt: now + limit } : {}) }].slice(-BG_KEPT) } : one)),
  )
}
// The longest the engine lets a watch run before it ends it
const WATCH_MOST = 30 * 60_000
type EndedRun = NonNullable<Todo['endedRuns']>[number]
// How a run ended, said plainly: on its card's summary and in Details
const endedWord = (run: Pick<EndedRun, 'how' | 'code'>) => (run.how === 'failed' ? `failed${run.code ? ` (exit code ${run.code})` : ''}` : run.how === 'stopped' ? 'stopped' : run.how)
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
const endedSummary = (helpers: number, runs: Pick<EndedRun, 'how'>[]) => {
  const n = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
  const head = helpers && runs.length ? `${n(helpers, 'helper')} and ${n(runs.length, 'command')} ended` : helpers ? `${n(helpers, 'helper')} ended` : `${n(runs.length, 'command')} ended`
  const bad = (['failed', 'killed', 'timed out'] as const).flatMap(how => {
    const count = runs.filter(r => r.how === how).length
    return count ? [`${count} ${how}`] : []
  })
  return bad.length ? `${head} · ${bad.join(', ')}` : head
}
// The runs a card has had end, kept so its summary row and Details can say how each ended
const keepEnded = (one: Todo, runs: EndedRun[]) => (runs.length ? { endedRuns: [...(one.endedRuns ?? []).filter(r => !runs.some(n => n.id === r.id)), ...runs].slice(-BG_KEPT) } : {})
// Background work that has ended or was stopped leaves every card that kept it at once, and is kept as ended with how it ended
// (by its id, or one word for them all), so the card's summary counts it
type EndAs = EndedRun['how'] | { how: EndedRun['how']; code?: string; at?: number }
const dropBackground = async ($: EngineInterface, ids: string[], how: EndAs | Record<string, EndAs> = 'ended') => {
  const now = await $.clock.now()
  const endOfId = (id: string) => {
    const one = typeof how === 'string' || 'how' in how ? (how as EndAs) : ((how as Record<string, EndAs>)[id] ?? 'ended')
    return typeof one === 'string' ? { how: one } : one
  }
  return changeTodos($, list => {
    const isGone = (id: string) => ids.includes(id)
    if (!list.some(one => one.bg?.some(b => isGone(b.id)))) return list
    return list.map(one => {
      const bg = one.bg?.filter(b => !isGone(b.id))
      if (bg?.length === one.bg?.length) return one
      const runs = (one.bg ?? []).filter(b => isGone(b.id)).map(b => {
        const end = endOfId(b.id)
        // It ended when its output last changed, where that is known, else as it was seen gone. A watch the engine killed at the
        // time limit it set ran out of time (within a tenth of its limit, at most a minute, as its limit is counted from when the mod saw it start); one killed
        // before it was killed
        const endedAt = end.at && end.at >= b.at && end.at <= now ? end.at : now
        const how = end.how === 'killed' && b.expiresAt && endedAt >= b.expiresAt - Math.min(60_000, (b.expiresAt - b.at) / 10) ? 'timed out' : end.how
        return { id: b.id, what: b.what, at: b.at, endedAt, how, ...(end.code ? { code: end.code } : {}) } as EndedRun
      })
      return { ...one, bg: bg?.length ? bg : undefined, waitsSince: bg?.some(b => !b.isWatch) ? one.waitsSince : undefined, ...keepEnded(one, runs) }
    })
  })
}

// What work still at work says on its card while it waits for a command of its own: which, and how long it has run; only that it
// waits when the command has its own row on the card's tree
const waitLine = (one: Todo, at: number, isShort = false) => {
  const commands = (one.bg ?? []).filter(b => !b.isWatch)
  // The newest command it started, the one it is most likely on now
  const first = commands.at(-1)
  if (one.status !== 'working' || !one.waitsSince || one.answeredAt || !first) return ''
  const more = commands.length > 1 ? ` and ${commands.length - 1} more` : ''
  if (isShort) return `Still working: Claude is waiting for a background command${more} to finish`
  return `Still working: Claude is waiting for a background command${more} to finish, running ${took(at - first.at)}${first.what ? `: ${cut(first.what, 90)}` : ''}`
}

// What finished work left running says on its card
const leftLine = (one: Todo, at: number) => (one.leftSince && one.status !== 'working' ? `Claude left something running in the background, ${took(at - one.leftSince)}` : '')

// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote

// What kinds of job there are, how each is told and how its latest line is read are in hooks/jobs.ts

// What each job wrote last, by its task id: its latest line, when its output last changed, whether its processes are paused,
// and for a wait, how what it waits for stands
type Seen = { latest: string; mem?: string; isUntold?: boolean; tail?: string[]; pct?: string; done?: string; total?: string; rate?: string; left?: string; isEarlier?: boolean; isOwn?: boolean; words?: string; isEmpty?: boolean; port?: string; wroteAt?: number; isPaused?: boolean; target?: string }
const jobLog = new Map<string, Seen>()
// When each card was last told that one of its jobs wrote something new
const jobNews = new Map<string, number>()
let jobsLookedAt = 0
// The processes on this Mac, looked at less often than the outputs; and how many looks in a row found no shell for a command
let jobProcs: Proc[] = []
let jobProcsAt = 0
const JOB_PS = 15_000
// How long past its time limit a watch is still waited for to say it ended, before it counts as ended anyway
const WATCH_GRACE = 2 * 60_000
const shellMissed = new Map<string, number>()
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
let tasksDir = ''
let tasksOf = ''
let tasksMissedAt = 0
// The output a command held open writes while it runs, by its row's id: the engine writes it to a file of its own in the tasks
// folder and names it only once the command ends or goes to the background, so it is found as the file its shell writes to
const callFiles = new Map<string, { file: string; at: number }>()
// The file each row's output was last read from, by its id, so a press on the row can show it whole
const jobFiles = new Map<string, string>()
// A command held open is a row of its own once it has run this long, so no command runs past ten seconds without a line that
// says how it goes (it was two minutes, and on 16 Nov commands ran for minutes with nothing on their card)
const ROW_SHOWN = 10_000

// A job as its row shows it, from its command and words: a command that only waits is a wait, with what it waits for
const jobOf = (id: string, what: string, cmd: string, at: number, isWatch = false, theirs?: Seen): Job => {
  const seen = jobLog.get(id) ?? theirs
  const wait = isWatch ? undefined : waitOf(cmd)
  const said = describedOf(what)
  const kind: JobKind = isWatch ? 'watch' : (said.kind ?? (wait ? 'wait' : jobKindOf(cmd, what)))
  const label = labelOf(said.text || cmd, cmd)
  return { id, label, isNamed: Boolean(what) && label !== labelOf('', cmd), cmd, kind, at, ...(said.expect ? { expect: said.expect, expectText: said.expectText } : {}), ...(seen ?? {}), ...(wait ? { waitsFor: wait.what, ...(wait.file ? { waitFile: wait.file } : {}) } : {}), port: portOf(cmd) ?? seen?.port }
}
// The jobs a card has running: what it sent to the background, and a command it has waited on a while; jobs alike are one
const jobsOf = (one: Todo, at: number): Job[] =>
  foldJobs([
    ...(one.bg ?? []).map(b => jobOf(b.id, b.what, b.cmd ?? b.what, b.at, b.isWatch, one.seenJobs?.[b.id])),
    ...(one.detached ?? []).map(d => jobOf(d.id, d.what, d.cmd, d.at, false, one.seenJobs?.[d.id])),
    ...(one.status === 'working' && one.running?.cmd && at - one.running.at >= ROW_SHOWN
      ? [jobOf(`call-${one.id}`, one.running.label ?? '', one.running.cmd, one.running.at)]
      : []),
  ])

// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for; a wait's own "Wait" is not said
// twice
const jobHead = (job: Job) => {
  if (job.id.startsWith('more-')) return job.label
  const kind = `${JOB_HEAD[job.kind]}${job.kind === 'server' && job.port ? ` :${job.port}` : ''}${job.count && job.count > 1 ? ` ×${job.count}` : ''}`
  // Its own words alone when they say its kind already (Download the CT scans, Wait for the deploy)
  if (job.isNamed && isKindSaid(job.label)) return `${job.label}${job.kind === 'server' && job.port && !job.label.includes(job.port) ? ` :${job.port}` : ''}${job.count && job.count > 1 ? ` ×${job.count}` : ''}`
  // A wait leads with what it waits for, its own words after
  const label = job.kind === 'wait' ? (job.waitsFor ?? job.label.replace(/^wait(s|ing)?\s+/i, '')) : job.label
  return `${kind} · ${label}`
}

// Where this chat's background output is written: the engine's tasks folder under its own temporary folder, named by the chat
const findTasks = async ($: EngineInterface) => {
  const sid = await $.session.id().catch(() => '')
  if (!sid) return ''
  const r = await $.process
    .run(['sh', '-c', 'for d in /private/tmp/claude-*/*/"$1"/tasks /tmp/claude-*/*/"$1"/tasks "${TMPDIR%/}"/claude-*/*/"$1"/tasks; do [ -d "$d" ] && { echo "$d"; exit 0; }; done; exit 1', 'sh', sid], { timeoutMs: 5000 })
    .catch(() => undefined)
  return r?.exitCode === 0 ? r.stdout.trim().split('\n')[0] ?? '' : ''
}

// A command the work started detached is kept by its card with the log it writes and its process; a leading `cd`, or else the
// work's own folder, is where a log named without a folder is
const keepDetached = async ($: EngineInterface, agent: string, call: { tool: string; command?: unknown; description?: unknown; tool_use_id?: unknown }, result: unknown) => {
  if (call.tool !== 'Bash') return
  const command = String(call.command ?? '')
  const found = detachedOf(command)
  if (!found) return
  // A log named without a folder is the leading `cd`'s, or else the chat's folder's when it is there (a helper's own folder is
  // not known); the process is the one `echo $!` printed. Without both it is not followed, so nothing stays on a card for ever
  const here = await $.session.cwd()
  const base = found.cd ? (found.cd.startsWith('/') ? found.cd : `${here}/${found.cd}`) : here
  const logFile = found.log.startsWith('/') || found.log.startsWith('~/') ? found.log : `${base}/${found.log}`
  if (!found.cd && !found.log.startsWith('/') && !found.log.startsWith('~/') && !(await $.fs.exists(logFile).catch(() => false))) return
  // Only a command that printed its process with `echo $!` is followed by it: any other number it printed is no process
  const pid = /\$!/.test(command) ? pidOf(String((result as { stdout?: unknown } | undefined)?.stdout ?? '')) : undefined
  if (!pid) return
  const what = oneLine(String(call.description ?? '') || found.core).slice(0, 160)
  const now = await $.clock.now()
  const id = `detached-${String(call.tool_use_id ?? now)}`
  await changeTodos($, list =>
    list.map(one => (one.id === agent ? { ...one, detached: [...(one.detached ?? []), { id, what, at: now, cmd: oneLine(command).slice(0, 400), log: logFile, pid }].slice(-BG_KEPT) } : one)),
  )
}

// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news, so a long server or download that keeps writing does not read as stuck
const lookJobs = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - jobsLookedAt < JOB_LOOK) return
  jobsLookedAt = now
  const list = await read($, todos)
  // Held open: a command a card has waited on long enough to be a row of its own
  const held = list.flatMap(one => (one.status === 'working' && one.running?.cmd && now - one.running.at >= ROW_SHOWN ? [{ owner: one.id, id: `call-${one.id}`, cmd: one.running.cmd, at: one.running.at }] : []))
  // A row's command that changed (another held call of the same card ran longest) starts afresh
  for (const [id, was] of callFiles) if (!held.some(h => h.id === id && h.at === was.at)) (callFiles.delete(id), jobLog.delete(id), silentTold.delete(id))
  const owned = [
    // A watch's output is its events, read as any other
    ...list.flatMap(one => (one.bg ?? []).map(b => ({ owner: one.id, id: b.id, file: '', pid: undefined as string | undefined }))),
    ...list.flatMap(one => (one.detached ?? []).map(d => ({ owner: one.id, id: d.id, file: d.log, pid: d.pid, isUntold: Boolean(d.isLeft && !d.log) }))),
    ...held.flatMap(h => (callFiles.get(h.id) ? [{ owner: h.owner, id: h.id, file: callFiles.get(h.id)?.file ?? '', pid: undefined as string | undefined }] : [])),
  ]
  for (const id of jobLog.keys()) if (!owned.some(o => o.id === id) && !held.some(h => h.id === id)) jobLog.delete(id)
  for (const owner of jobNews.keys()) if (!owned.some(o => o.owner === owner)) jobNews.delete(owner)
  for (const id of shellMissed.keys()) if (!owned.some(o => o.id === id)) shellMissed.delete(id)
  // A held-open command's shell, once the processes have been listed, and the file it writes to: only one in a tasks folder
  const unfound = held.filter(h => !callFiles.has(h.id))
  if (unfound.length && jobProcs.length) {
    const pids = unfound.flatMap(h => {
      const pid = heldShellOf(jobProcs, h.cmd, h.at)
      return pid ? [{ id: h.id, pid, at: h.at }] : []
    })
    if (pids.length) {
      const fd = await $.process
        .run(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh', ...pids.map(p => p.pid)], { timeoutMs: 5000 })
        .catch(() => undefined)
      for (const line of fd?.stdout.split('\n') ?? []) {
        const [pid = '', ...path] = line.split(' ')
        const file = path.join(' ').trim()
        const one = pids.find(p => p.pid === pid)
        if (one && /\/tasks\/[\w-]+\.output$/.test(file)) callFiles.set(one.id, { file, at: one.at })
      }
    }
  }
  await pruneSpans($, now)
  if (!owned.length && !unfound.length && !spans.length) return
  const sid = await $.session.id().catch(() => '')
  if (sid !== tasksOf) ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0))
  if (owned.some(o => !o.file) && !tasksDir && now - tasksMissedAt >= JOB_NEWS) {
    tasksDir = await findTasks($)
    if (!tasksDir) tasksMissedAt = now
  }
  const asked = owned.filter(o => !('isUntold' in o && o.isUntold) && (o.file || tasksDir))
  const files = asked.map(o => o.file || `${tasksDir}/${o.id}.output`)
  jobFiles.clear()
  asked.forEach((o, n) => jobFiles.set(o.id, files[n] ?? ''))
  // The files the waits poll, to tell whether what they wait for still moves
  const waits = list.flatMap(one => [...(one.bg ?? []).filter(b => !b.isWatch), ...(one.detached ?? [])].flatMap(j => {
    const wait = waitOf(j.cmd ?? '')
    return wait ? [{ id: j.id, wait }] : []
  }))
  const targets = waits.flatMap(w => (w.wait.file ? [w.wait.file] : []))
  // (sooner while a command held open is not yet found, so its row reads its output within seconds)
  const isPs = now - jobProcsAt >= JOB_PS || (unfound.length > 0 && now - jobProcsAt >= JOB_LOOK)
  // One kept before process numbers were checked, such as 000, is never asked after: it counts as ended, and leaves its card
  const pids = owned.flatMap(o => (o.pid && isPid(o.pid) ? [o.pid] : []))
  // One go: the end of each output with when it last changed, when each polled file last changed, which detached processes still
  // run, and now and then every process with its state
  const mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)'
  const home = 'case $f in "~/"*) f="$HOME/${f#\\~/}";; esac'
  const script = `n=$1; shift; i=0; for f; do i=$((i+1)); o=$f; ${home}; ${mtime}; if [ $i -le $n ]; then printf '\\n@@JOB@@ %s %s\\n' "$m" "$f"; tail -c ${JOB_TAIL} "$f" 2>/dev/null; else printf '\\n@@AT@@ %s %s' "$m" "$o"; fi; done; printf '\\n@@ALIVE@@'; for p in ${pids.map(p => p.replace(/\D/g, '')).join(' ')}; do kill -0 "$p" 2>/dev/null && printf ' %s' "$p"; done; printf '\\n'${isPs ? `; printf '@@PS@@\\n'; ps -axww -o ${PS_COLUMNS}` : ''}`
  const r = await $.process.run(['sh', '-c', script, 'sh', String(files.length), ...files, ...targets], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r) return
  const [body = '', tail = ''] = r.stdout.split('\n@@ALIVE@@')
  const [aliveText = '', psText] = tail.split('@@PS@@\n')
  // ps gives each process's age: its start is that age before ps answered, not before this look began (on a slow Mac the look can
  // start well before its ps runs, and every shell then seemed to start earlier than it did, too early to be the command held open)
  if (psText !== undefined) ((jobProcs = procsOf(psText, await $.clock.now())), (jobProcsAt = now))
  // What a command left going, however it was started, becomes a run of its card as soon as the processes show it
  if (psText !== undefined && spans.length) await adoptLeft($, jobProcs, now).catch(err => log($, `left runs not followed: ${String(err)}`))
  const alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean))
  const changed = new Map([...body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g)].map(m => [m[2] ?? '', Number(m[1]) * 1000]))
  // A detached job whose process ended leaves its card, kept as ended (how its process ended is not known)
  const gone = owned.filter(o => o.pid && !alive.has(o.pid)).map(o => o.id)
  if (gone.length && /@@ALIVE@@/.test(r.stdout)) {
    const runsOf = (one: Todo) => (one.detached ?? []).filter(d => gone.includes(d.id)).map(d => ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'ended' as const }))
    // (what this look took off its card: a run another look or a stop already took off is not woken for again)
    const taken = new Map<string, NonNullable<Todo['detached']>>()
    await changeTodos($, cards =>
      cards.map(one => {
        const ended = (one.detached ?? []).filter(d => gone.includes(d.id))
        if (!ended.length) return one
        // (one being stopped now is told by its stop, read here as the run leaves its card)
        taken.set(one.id, ended.filter(d => !stoppingJobs.has(d.id)))
        const left = (one.detached ?? []).filter(d => !gone.includes(d.id))
        return { ...one, detached: left.length ? left : undefined, ...keepEnded(one, runsOf(one)) }
      }),
    )
    void drawFresh($)
    // The engine wakes work only for what it sent to the background itself: the work is woken here the moment a run it left
    // detached ends, so it carries on at once and never waits on it. Not work the person stopped, a run they or the work stopped
    // itself, a server, nor work that has handed back its report; one message for the runs of a card that ended together
    const fresh = await read($, todos)
    for (const [id, ended] of taken) {
      const runs = ended.filter(d => !stoppingJobs.has(d.id) && !killedByWork.has(d.id) && !SERVER_CMD.test(d.cmd) && describedOf(d.what).kind !== 'server')
      if (runs.length) void wakeForRun($, fresh.find(one => one.id === id), runs).catch(err => log($, `work ${id} not woken as its run ended: ${String(err)}`))
    }
    for (const id of gone) killedByWork.delete(id)
  }
  // Each background command's shell, found by its words among the engine's shells: paused when any of its processes is, and gone
  // when no shell has been found for it twice in a row while others were (so a way of running the engine has not changed), as one the engine never said ended (only once a minute has passed)
  const bgs = list.flatMap(one => (one.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, cmd: b.cmd ?? '', at: b.at })))
  const shells = jobProcs.length ? shellsOf(jobProcs, bgs) : new Map<string, string | true | null>()
  const states = new Map<string, boolean>()
  for (const [id, pid] of shells) {
    if (typeof pid === 'string') states.set(id, treeOf(jobProcs, pid).some(isPausedProc))
    if (pid) shellMissed.delete(id)
    else if (psText !== undefined && [...shells.values()].some(Boolean)) shellMissed.set(id, (shellMissed.get(id) ?? 0) + 1)
  }
  for (const o of owned) if (o.pid) states.set(o.id, treeOf(jobProcs, o.pid).some(isPausedProc))
  const ended = bgs.filter(b => (shellMissed.get(b.id) ?? 0) >= 2 && now - b.at >= 60_000).map(b => b.id)
  // How each ended, where its output says: finished, failed with its code, or killed
  const endedAs: Record<string, EndAs> = {}
  // A watch well past the time limit the engine set it has ended, whether or not its last line was read
  for (const one of list) for (const b of one.bg ?? []) if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE && !ended.includes(b.id)) (ended.push(b.id), (endedAs[b.id] = 'timed out'))
  // How what each wait waits for stands: a run it waits on paused or gone, a file it polls still for long
  const targetOf = (wait: NonNullable<ReturnType<typeof waitOf>>) => {
    const runs = wait.pattern
      ? jobProcs.filter(p => isLike(p.command, wait.pattern ?? '') && !/shell-snapshots\/snapshot-/.test(p.command) && !/^(\S*\/)?pgrep\s/.test(p.command))
      : wait.pid
        ? jobProcs.filter(p => p.pid === wait.pid)
        : undefined
    if (runs && jobProcs.length) {
      if (!runs.length) return wait.isStart ? '' : 'what it waits for has ended'
      if (runs.some(p => treeOf(jobProcs, p.pid).some(isPausedProc))) return 'what it waits for is paused'
    }
    const at = wait.file ? changed.get(wait.file) : undefined
    return at && now - at >= JOB_QUIET ? `what it waits on has not changed for ${shortAgo(now - at)}` : ''
  }
  const parts = body.split(/\n@@JOB@@ ([^\n]*)\n/)
  let isChanged = false
  const moved = new Set<string>()
  for (let n = 1; n + 1 < parts.length; n += 2) {
    // The outputs come back in the order they were asked for, each after when it last changed
    const job = asked[(n - 1) / 2]
    const id = job?.id ?? ''
    const text = (parts[n + 1] ?? '').split('\n@@AT@@ ')[0] ?? ''
    const m = Number(parts[n]?.split(' ')[0] ?? 0) * 1000
    // One that ended, by the engine's last line on its output, and when: as that output last changed
    const end = job?.pid ? undefined : runEndOf(text)
    if (end) (ended.includes(id) || ended.push(id), (endedAs[id] = { ...end, ...(m ? { at: m } : {}) }))
    // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote (on
    // 15 Nov such rows read "updated 9m ago" for runs that sent all they printed elsewhere)
    const seen = { ...latestOf(text), ...(m && !text.trim() ? { isEmpty: true } : {}) }
    const was = jobLog.get(id)
    const wait = waits.find(w => w.id === id)
    // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
    const kept = !seen.pct && !seen.done && was?.isOwn ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {}
    const next: Seen = { ...seen, ...memSeen(job?.pid), tail: tailOf(text), ...kept, ...(m ? { wroteAt: m } : {}), ...(states.has(id) ? { isPaused: states.get(id) } : was?.isPaused ? { isPaused: true } : {}), ...(wait ? { target: targetOf(wait.wait) } : {}) }
    const isSame = was?.latest === next.latest && was?.words === next.words && was?.pct === next.pct && was?.done === next.done && was?.total === next.total && was?.rate === next.rate && was?.left === next.left && was?.isEmpty === next.isEmpty && was?.isEarlier === next.isEarlier && was?.wroteAt === next.wroteAt && was?.isPaused === next.isPaused && was?.target === next.target && was?.tail?.join('\n') === next.tail?.join('\n')
    // Memory alone moving (a MB or so at each look) is kept for the next drawing, never a reason to draw the panel afresh under the pointer
    if (isSame) {
      if (was?.mem !== next.mem) jobLog.set(id, next)
      continue
    }
    jobLog.set(id, next)
    isChanged = true
    const owner = job?.owner
    if (seen.latest && owner && was && was.latest !== seen.latest && now - (jobNews.get(owner) ?? 0) >= JOB_NEWS) moved.add(owner)
  }
  // A left run whose output goes nowhere it can be read runs with no progress given, with its memory
  for (const o of owned) {
    if (!('isUntold' in o && o.isUntold) || gone.includes(o.id)) continue
    const was = jobLog.get(o.id)
    const next: Seen = { latest: '', isUntold: true, ...memSeen(o.pid), ...(states.has(o.id) ? { isPaused: states.get(o.id) } : {}) }
    if (was?.isUntold && was.isPaused === next.isPaused) {
      if (was.mem !== next.mem) jobLog.set(o.id, next)
      continue
    }
    jobLog.set(o.id, next)
    isChanged = true
  }
  // A background command that has ended, by the engine's last line on its output or as no shell runs it, leaves its card
  if (ended.length) {
    await dropBackground($, ended, endedAs)
    for (const id of ended) (jobLog.delete(id), shellMissed.delete(id))
    isChanged = true
  }
  // (not waited for: a work's chat may take its time to take a line, and the look goes on meanwhile)
  void tellSilent($, list, now).catch(err => log($, `silent runs not told: ${String(err)}`))
  void endWatchers($, await read($, todos), now).catch(err => log($, `watchers not stopped: ${String(err)}`))
  for (const owner of moved) jobNews.set(owner, now)
  if (moved.size) await changeTodos($, cards => cards.map(one => (moved.has(one.id) ? { ...one, newAt: now } : one)))
  if (isChanged) void drawFresh($)
}

// The memory a followed process and all it started hold, as the processes were last listed
const memSeen = (pid?: string) => {
  const mem = pid && jobProcs.length ? memOf(treeOf(jobProcs, pid)) : undefined
  return mem ? { mem } : {}
}

// Each piece of work's commands, by the process numbers handed out while each ran, kept a while so what one leaves going is
// found when the processes show it: at once for a command that has ended, later for one sent to the background whose shell ends
// A command that has ended is looked at once more after a while; one sent to the background until a little after it ends
type KeptSpan = Span & { agent: string; what: string; bgId?: string }
let spans: KeptSpan[] = []
const SPANS_KEPT = 300
const SPAN_KEPT_FOR = 2 * 60_000
// The commands of work still running, by their call, and every process already made a run, so none is added twice
const openCalls = new Map<string, OpenCall>()
const adopted = new Set<string>()
const pruneSpans = async ($: EngineInterface, now: number) => {
  // One sent to the background is open until its row has left every card
  const list = spans.some(s => s.bgId && s.until === undefined) ? await read($, todos) : []
  spans = spans.map(s => (s.bgId && s.until === undefined && !list.some(one => one.bg?.some(b => b.id === s.bgId)) ? { ...s, until: now } : s))
  if (spans.some(s => s.until !== undefined && now - s.until > SPAN_KEPT_FOR)) spans = spans.filter(s => s.until === undefined || now - s.until <= SPAN_KEPT_FOR)
}
// The newest process number on this Mac, as a shell started now is handed it; 0 where it cannot be told
const pidNow = async ($: EngineInterface) => {
  const r = await $.process.run(['sh', '-c', 'echo $$ # pid now'], { timeoutMs: 3000 }).catch(() => undefined)
  const n = Number(r?.stdout.trim())
  return Number.isInteger(n) && n > 1 ? n : 0
}
// A piece of work's Bash call has ended (or gone to the background): kept by the numbers handed out while it ran, and what a
// command that has ended left going is followed at once
const keepSpan = async ($: EngineInterface, agent: string, call: { tool: string; command?: unknown; description?: unknown; tool_use_id?: unknown; run_in_background?: unknown }, from: number, at: number, result?: unknown) => {
  if (call.tool !== 'Bash' || !from) return
  const to = await pidNow($)
  openCalls.delete(String(call.tool_use_id ?? ''))
  if (!to) return
  const now = await $.clock.now()
  const command = String(call.command ?? '')
  // Started on another Mac over ssh, what it leaves runs there
  if (/^\s*(\S*\/)?ssh\b/.test(command)) return
  const bgId = (result as { backgroundTaskId?: unknown } | undefined)?.backgroundTaskId
  const isBackground = Boolean(call.run_in_background) && typeof bgId === 'string'
  const span: KeptSpan = { id: String(call.tool_use_id ?? now), agent, what: oneLine(String(call.description ?? '')).slice(0, 160), cmd: oneLine(command).slice(0, 400), from, to, at, endAt: now, ...(isBackground ? { bgId: String(bgId) } : { until: now }) }
  spans = [...spans.filter(s => s.id !== span.id), span].slice(-SPANS_KEPT)
  if (call.run_in_background) return
  const r = await $.process.run(['sh', '-c', `printf '@@LEFT@@\\n'; ps -axww -o ${PS_COLUMNS}`], { timeoutMs: 5000 }).catch(() => undefined)
  if (!r || r.exitCode !== 0 || !r.stdout.includes('@@LEFT@@')) return
  const procs = procsOf(r.stdout.split('@@LEFT@@\n')[1] ?? '', now)
  // Among every command kept, so a run held back while another ran goes to its own
  await adoptLeft($, procs, now)
}
// What commands left going becomes runs on their cards: each topmost process, with its command's words when it left one, else
// its own program and script; its log where its output goes to a file, so its progress line is read as any other
const adoptLeft = async ($: EngineInterface, procs: Proc[], now: number, only?: KeptSpan[]) => {
  const list = await read($, todos)
  // A process number gone from the list may be handed out again: it no longer stands for a run made already
  for (const pid of adopted) if (!procs.some(p => p.pid === pid)) adopted.delete(pid)
  const known = new Set([...adopted, ...list.flatMap(one => (one.detached ?? []).flatMap(d => (d.pid ? [d.pid] : [])))])
  const left = leftoversOf(procs, only ?? spans, known, [...openCalls.values()])
  if (!left.length) return
  const fd = await $.process
    .run(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh', ...left.map(l => l.top.pid)], { timeoutMs: 5000 })
    .catch(() => undefined)
  const logs = new Map((fd?.stdout.split('\n') ?? []).map(line => [line.split(' ')[0] ?? '', line.split(' ').slice(1).join(' ').trim()]))
  const added = new Map<string, NonNullable<Todo['detached']>>()
  for (const one of left) {
    const span = spans.find(s => s.id === one.span) ?? only?.find(s => s.id === one.span)
    if (!span || !list.some(card => card.id === span.agent)) continue
    const file = logs.get(one.top.pid) ?? ''
    const log = file.startsWith('/') && !file.startsWith('/dev/') ? file : ''
    const several = left.filter(l => l.span === one.span).length > 1
    const what = several || !span.what ? leftName(one.top.command) : span.what
    adopted.add(one.top.pid)
    added.set(span.agent, [...(added.get(span.agent) ?? []), { id: `left-${one.top.pid}-${span.id}`, what, at: Math.min(now, Math.max(span.at, one.top.startAt)), cmd: oneLine(one.top.command).slice(0, 400), log, pid: one.top.pid, isLeft: true }])
  }
  if (!added.size) return
  await changeTodos($, cards => cards.map(one => (added.has(one.id) ? { ...one, detached: [...(one.detached ?? []).filter(d => !added.get(one.id)?.some(a => a.id === d.id)), ...(added.get(one.id) ?? [])].slice(-BG_KEPT) } : one)))
  for (const [agent, runs] of added) await log($, `work ${agent} left ${runs.length} run(s) going: ${runs.map(r => r.what).join(' / ').slice(0, 160)}`)
  jobsLookedAt = 0
  void drawFresh($)
}

// A short time since, for a row's side: seconds, minutes, or hours and minutes
const shortAgo = (ms: number) => {
  const all = Math.max(0, Math.floor(ms / 1000))
  return all < 60 ? `${all}s` : all < 3600 ? `${Math.floor(all / 60)}m` : `${Math.floor(all / 3600)}h ${String(Math.floor(all / 60) % 60).padStart(2, '0')}m`
}
// A process's command against a pattern as pgrep -f reads it: a regular expression, or the words themselves when it is none
const isLike = (command: string, pattern: string) => {
  try {
    return new RegExp(pattern).test(command)
  } catch {
    return command.includes(pattern)
  }
}

// A press on Stop on a run's row ends it: a command sent to the background is stopped as the engine stops one, a command started
// detached or left going has its process and all it started ended, a command held open has its shell's processes ended (the work's
// call then comes back with it ended). The work is told in its own chat that the person stopped it as stuck, and what to do next.
// On this Mac only, as the processes are this Mac's
const canStopJob = (job: Job) => !isRunFromAfar && !job.id.startsWith('more-')
const stoppingJobs = new Set<string>()
const RUN_STOPPED = (what: string, silent: string) =>
  silent
    ? `${who(true)} stopped your command "${what}" from the panel because it looked stuck: it had printed nothing for ${silent}. A command must never be stuck or silent. Don't start it again as it was: find out why it stalled, make it print a plain \`progress:\` line at least every 10 seconds, and start it again only if it is still needed.`
    : `${who(true)} stopped your command "${what}" from the panel. Don't start it again unless ${who()} asks for it. Continue without it, or ask them if you need it.`
const stopJob = async ($: EngineInterface, owner: string, job: Job) => {
  if (!canStopJob(job) || stoppingJobs.has(job.id)) return
  stoppingJobs.add(job.id)
  presses += 1
  drawAgain($)
  try {
    await stopping($, owner, job)
  } finally {
    stoppingJobs.delete(job.id)
    presses += 1
    jobsLookedAt = 0
    void drawFresh($)
  }
}
// A run that only watches (a tail or grep left going) outlives what it watches once no run of its work, the work above it or the
// helpers under that one still goes, or once its work has ended: it is stopped then, and its work told while it is at work
const WATCHER_STOPPED = (what: string) => `Your run "${what}" only watched runs that have all ended, so it was stopped. Do not start a run that only watches another: you are woken the moment a run of yours ends.`
const watchersTried = new Set<string>()
const endWatchers = async ($: EngineInterface, list: Todo[], now: number) => {
  const runsOf = (one: Todo) => [...(one.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, cmd: b.cmd ?? '' })), ...(one.detached ?? []).map(d => ({ id: d.id, cmd: d.cmd }))]
  for (const one of list) {
    if (one.chat) continue
    const watchers = runsOf(one).filter(run => watcherOf(run.cmd) && !stoppingJobs.has(run.id) && !watchersTried.has(run.id))
    if (!watchers.length) continue
    const top = topOf(list, one.id)
    const tree = [list.find(card => card.id === top), ...underOf(list, top)].filter((card): card is Todo => Boolean(card))
    const isWatched = tree.some(card => card.status === 'working' && (runsOf(card).some(run => !watcherOf(run.cmd)) || (card.running?.cmd !== undefined && !watcherOf(card.running.cmd)) || (card.id !== one.id && card.parentId !== undefined)))
    if (one.status === 'working' && isWatched) continue
    for (const run of watchers) {
      const job = jobsOf(one, now).find(j => j.id === run.id) ?? jobsOf({ ...one, bg: one.bg?.filter(b => b.id === run.id), detached: one.detached?.filter(d => d.id === run.id), running: undefined }, now)[0]
      if (!job || now - job.at < 60_000) continue
      // (tried once: one that cannot be stopped is left to its row's Stop run)
      watchersTried.add(job.id)
      stoppingJobs.add(job.id)
      try {
        await stopping($, one.id, job, one.status === 'working' ? WATCHER_STOPPED(job.label) : '')
      } finally {
        stoppingJobs.delete(job.id)
      }
      await log($, `run ${job.id} of work ${one.id} stopped: it only watched runs that have ended`)
    }
  }
}
// (`said`: what the work is told instead of the person's stop, nothing when empty)
const stopping = async ($: EngineInterface, owner: string, job: Job, said?: string) => {
  const now = await $.clock.now()
  const list = await read($, todos)
  const card = list.find(one => one.id === owner)
  const bg = card?.bg?.find(b => b.id === job.id)
  const detached = card?.detached?.find(d => d.id === job.id)
  // The processes to end: the detached one's, or the held shell's, with every process under them
  const procs = jobProcs.length ? jobProcs : procsOf((await $.process.run(['ps', '-axww', '-o', PS_COLUMNS], { timeoutMs: 5000 }).catch(() => ({ stdout: '' }))).stdout, now)
  // A background command's own shell, found as the look finds it, so it is ended even where the engine does not stop it
  const bgShell = bg && !bg.isWatch && procs.length ? shellsOf(procs, [{ id: bg.id, cmd: bg.cmd ?? '', at: bg.at }]).get(bg.id) : undefined
  const top = detached?.pid ?? (typeof bgShell === 'string' ? bgShell : undefined) ?? (job.id.startsWith('call-') && card?.running?.cmd ? heldShellOf(procs, card.running.cmd, card.running.at) : undefined)
  // (the top one itself even where the processes could not be listed)
  const pids = top ? [...new Set([top, ...treeOf(procs, top).map(p => p.pid)])].filter(isPid) : []
  let isStopped = false
  if (bg) {
    const r = await $.tool.call({ tool: 'TaskStop', task_id: bg.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `run ${bg.id} not stopped by the engine: ${String((r as { deny?: unknown }).deny)}`)
    else isStopped = true
  }
  // Asked to end, then made to a moment later if it has not
  if (pids.length) {
    const r = await $.process.run(['sh', '-c', 'kill -TERM "$@" 2>/dev/null; sleep 2; for p; do kill -0 "$p" 2>/dev/null && kill -KILL "$p" 2>/dev/null; done; for p; do kill -0 "$p" 2>/dev/null && exit 1; done; exit 0', 'sh', ...pids], { timeoutMs: 10_000 }).catch(err => ({ exitCode: 1, stderr: String(err) }))
    if (r.exitCode === 0) isStopped = true
    else await log($, `run ${job.id} not wholly stopped: ${String((r as { stderr?: unknown }).stderr ?? '').trim().slice(0, 160)}`)
  }
  // Nothing found to stop: nothing is said to have stopped, and the row stays as it is
  if (!isStopped) return void (await log($, `run ${job.id} of work ${owner} could not be stopped: nothing of it was found`))
  if (bg) await dropBackground($, [bg.id], 'stopped')
  if (detached) {
    await changeTodos($, cards => cards.map(one => (one.id === owner && one.detached?.some(d => d.id === job.id) ? { ...one, detached: one.detached.filter(d => d.id !== job.id).length ? one.detached.filter(d => d.id !== job.id) : undefined, ...keepEnded(one, [{ id: detached.id, what: detached.what, at: detached.at, endedAt: now, how: 'stopped' }]) } : one)))
  }
  const silent = job.wroteAt && !job.isEmpty ? now - job.wroteAt : now - job.at
  if (said === undefined) void tell($, owner, RUN_STOPPED(job.label, silent >= SILENT_WARN ? shortAgo(silent) : ''))
  else if (said) void tell($, owner, said)
  jobLog.delete(job.id)
  silentTold.delete(job.id)
  if (said !== undefined) return
  await log($, `the person stopped run ${job.id} of work ${owner}${pids.length ? ` (${pids.length} processes)` : ''}`)
  jobLog.delete(job.id)
  silentTold.delete(job.id)
}

// A run of a piece of work that has given no word for a minute is named to that work once, in its own chat: a run is never to be
// stuck or silent, so it stops it or makes it report. Not a server or a watch, which speak only when there is something to say
const RUN_ENDED = (what: string, log: string) =>
  `Your run "${what}" has ended. Look at how it ended${log ? ` in its log, ${log},` : ''} and carry on with the next step now.`
const RUNS_ENDED = (whats: string[]) => `Your runs ${whats.map(what => `"${what}"`).join(', ')} have ended. Look at how each ended in its log and carry on with the next step now.`
const RUN_SILENT_TOLD = 60_000
const silentTold = new Set<string>()
const RUN_SILENT = (what: string, silent: string) =>
  `Your command "${what}" has printed nothing for ${silent}. Look at it now: if it is stuck, stop it (TaskStop for a background command, kill for a detached one) and find out why; if it is still working, let it finish, and make what you run next print a plain \`progress:\` line at least every 10 seconds.`
const tellSilent = async ($: EngineInterface, list: Todo[], now: number) => {
  for (const one of list) {
    if (one.status !== 'working') continue
    for (const job of jobsOf(one, now)) {
      // (not one paused, one whose output cannot be read, or the mod's own runners, which say how they go themselves)
      if (job.kind === 'server' || job.kind === 'watch' || job.id.startsWith('more-') || silentTold.has(job.id) || job.isPaused || job.isUntold || /\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(job.cmd)) continue
      if (!job.wroteAt) continue
      const silent = job.isEmpty ? now - job.at : now - job.wroteAt
      if (silent < RUN_SILENT_TOLD) continue
      silentTold.add(job.id)
      void tell($, one.id, RUN_SILENT(job.label, shortAgo(silent)))
      await log($, `work ${one.id} told its run ${job.id} has been silent ${shortAgo(silent)}`)
    }
  }
  // (a run that speaks again may be named again when it next goes silent)
  for (const id of silentTold) if (jobLog.get(id)?.wroteAt && now - (jobLog.get(id)?.wroteAt ?? 0) < RUN_SILENT_TOLD) silentTold.delete(id)
}

// The runs a card has going that end of themselves, as a wait for one names it: a background command, or one left detached by its
// process (not a server, which is not waited on to end)
const ownRunsOf = (one: Todo | undefined): OwnRun[] =>
  [...(one?.bg ?? []).filter(b => !b.isWatch).map(b => ({ id: b.id, what: b.what, cmd: b.cmd ?? '' })), ...(one?.detached ?? []).map(d => ({ id: d.id, what: d.what, cmd: d.cmd, ...(d.pid ? { pid: d.pid } : {}) }))].filter(
    run => !SERVER_CMD.test(run.cmd) && describedOf(run.what).kind !== 'server',
  )
// The detached runs a piece of work stopped itself with a kill naming its process: their end wakes no one
const killedByWork = new Set<string>()
const noteKills = (one: Todo | undefined, command: string) => {
  for (const d of one?.detached ?? []) if (d.pid && new RegExp(`\\b(?:kill|pkill)\\b(?![^;&|]*-0\\b)[^;&|]*\\b${d.pid}\\b`).test(command)) killedByWork.add(d.id)
}
// A work whose run left detached has ended: told in its chat while it is at a step, and started again with a message once its step
// has ended (its turn over, its card finished or waiting on the engine), as an answer of the person's starts it
const wakeForRun = async ($: EngineInterface, one: Todo | undefined, runs: NonNullable<Todo['detached']>) => {
  const first = runs[0]
  if (!one || !first || isHeld(one) || one.status === 'stopped' || one.status === 'failed' || (one.status === 'done' && (one.handedBackAt !== undefined || endedByHandback.has(one.id) || one.endedAt < first.at))) return
  const text = runs.length === 1 ? RUN_ENDED(runWords(first.what, first.cmd), first.log) : RUNS_ENDED(runs.map(d => runWords(d.what, d.cmd)))
  if (one.status === 'working' && !one.waitsSince) {
    await tell($, one.id, text)
    return void (await log($, `work ${one.id} told ${runs.length} run(s) of it ended`))
  }
  const r = (await isReplaced($)) ? { isDelivered: false as const, reason: 'this copy of the mod was replaced by a reload' } : await sendOwn($, { to: { agentId: one.id }, text }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
  if (!r.isDelivered) return void (await log($, `work ${one.id} not started again as its runs ended: ${r.reason}`))
  await wakeCard($, one.id)
  await log($, `work ${one.id} started again as ${runs.length} run(s) of it ended`)
}
// A run in its own words, without the time it was given when it began
const runWords = (what: string, cmd = '') => labelOf(what, cmd).replace(/\s*\((?:about|under|over|around|up to|~)?\s*[\d.,\-– ]+\s*(?:s|sec|seconds?|m|mins?|minutes?|h|hours?)\)\s*$/i, '').trim()

// How a run ended, said after its words
const RUN_ENDED_AS: Record<EndedRun['how'], string> = { finished: 'has finished', failed: 'failed', killed: 'was stopped', stopped: 'was stopped', 'timed out': 'ran out of time', ended: 'has ended' }

// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
const canOpenJob = (job: Job) => Boolean(jobFiles.get(job.id)) && !isRunFromAfar && !isLinux
const openJobOutput = async ($: EngineInterface, job: Job) => {
  const file = jobFiles.get(job.id)
  // A press moves the buttons' keys, so the panel does not keep pulling back to this row
  presses += 1
  drawAgain($)
  if (!file || !canOpenJob(job)) return
  const at = await $.clock.now()
  const base = `${dir}/terminal`
  const home = `${base}/output-${slug(job.id) || 'job'}-${at}`
  const path = file.startsWith('~/') ? `"$HOME"/${zshQuoted(file.slice(2))}` : zshQuoted(file)
  const script = ['#!/bin/zsh', `print -r -- $'\\e[2m'${zshQuoted(`${job.label} · ${file}`)}$'\\e[0m'`, `[[ -e ${path} ]] || print -r -- 'No output yet. This window shows it as soon as the command prints something.'`, `exec tail -n 1000 -F ${path}`, ''].join('\n')
  await $.fs.write(`${home}/output.command`, script)
  const ready = await $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  const r = ready.exitCode === 0 ? await $.process.run(['open', `${home}/output.command`]).catch(err => ({ exitCode: 1, stderr: String(err) })) : ready
  if (r.exitCode !== 0) void log($, `output not opened: ${r.stderr.trim().slice(0, 160)}`)
}

// Steps that could have gone out together: after each step of work, a line in its next request when the step shows a pattern that
// costs time (a helper started alone, a run of single lookups, long runs of one kind one after another, a step of only to-dos, a
// commit with no second look started), and a regular look at the helpers a piece of work has running

// The calls that keep the card and the memory: they ride along with a work call and are never a step's work
const BOOK = ['todo', 'note', 'update', 'waits', 'recall', 'ask']
const isBook = (tool: string) => BOOK.some(name => isTool(tool, name)) || tool === 'ToolSearch' || tool === 'TodoWrite'
// A lookup: a read of one file or one search, which a step can send several of at once
const LOOKUP_TOOLS = ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch']
const LOOKUP_COMMAND = /^\s*(?:cd \S+ && )?(?:cat|head|tail|less|wc|ls|rg|grep|find|sed -n|jq|git (?:-C \S+ )?(?:log|show|diff|status|blame|grep))\b/
const isLookup = (tool: string, input: unknown) =>
  LOOKUP_TOOLS.includes(tool) || (tool === 'Bash' && !(input as { run_in_background?: unknown })?.run_in_background && LOOKUP_COMMAND.test(String((input as { command?: unknown })?.command ?? '')))
// The wait for helpers, which is no run of its own
const WAIT_RUN = /\/bin\/helpers['"]? /
// A commit: what a second look, pictures and docs can start from
const COMMIT = /\bgit (?:-C \S+ )?commit\b/
// A helper that looks for what is wrong: a second look
const CHECKER = /\b(check|checks|review|second look|look for what|what is wrong|verify|audit)\b/i
// Single lookups in a row before a line says to send them together
const LOOKUPS_IN_A_ROW = 3
// A run this long is a long one; two of one kind in a row, each alone in its step, could have run side by side
const LONG_RUN = 60_000
// The most lines of each kind one agent is told
const LINES_EACH = 2

// What a step sends back, in the words the work reads
const HELPER_ALONE =
  'That step started one helper and nothing else. The helper runs in the background and its result comes to you when it ends, so continue now with what needs nothing from it. Next time, send in the same step every call that needs nothing from the helper: other helpers, your own part, the second look, notes.'
const LOOKUP_RUN = (n: number) =>
  `The last ${n} steps each held one lookup. Send the lookups you already know you need together in one step. When you need only the conclusion of reading or searching across many files, send that to a helper, which keeps your context small. Read a single file you know yourself.`
const SERIAL_RUNS = (what: string) =>
  `Two long commands of one kind (${what}) ran one after the other, each alone in its step. When they don't depend on each other, run them side by side: each in its own throwaway chat, worktree, terminal session or background command, or each as a helper, all started in one step.`
const BOOK_ALONE =
  'That step held only to-do and note calls. They cost a turn of their own: send them in the same step as your next working call.'
const LOOK_NOW =
  'You committed. The second look, the pictures and the docs need nothing more than this: start them now, as helpers in the same step as your next calls, not after the rest is done.'

// Per agent: its single lookups in a row, the last long run's kind, and how many of each line it was told
const stepsSeen = new Map<string, { lookups: number; lastRun?: string; told: Record<string, number>; checkerAt?: number; steps: number; singles: number }>()
// When each call began, by call id, to tell a long run
const callStarts = new Map<string, number>()
const STEPS_KEPT = 400
const callStarted = (id: string, at: number) => {
  callStarts.set(id, at)
  if (callStarts.size > 2000) callStarts.delete(callStarts.keys().next().value ?? '')
}

// The kind of a long command: its first two words, a test run or a capture alike
const kindOf = (command: string) => oneLine(command.replace(/^\s*cd \S+ && /, '')).split(' ').slice(0, 2).join(' ')

// What one step of an agent tells it, in the order the patterns are looked at; at most LINES_EACH of each kind per agent
const stepLines = (agent: string, calls: { tool: string; input: unknown; tookMs: number }[], wait = '', isTop = true) => {
  const seen = stepsSeen.get(agent) ?? { lookups: 0, told: {}, steps: 0, singles: 0 }
  if (!stepsSeen.has(agent) && stepsSeen.size >= STEPS_KEPT) stepsSeen.delete(stepsSeen.keys().next().value ?? '')
  stepsSeen.set(agent, seen)
  const lines: string[] = []
  const say = (kind: string, line: string) => {
    if ((seen.told[kind] ?? 0) >= LINES_EACH) return
    seen.told[kind] = (seen.told[kind] ?? 0) + 1
    lines.push(line)
  }
  const work = calls.filter(one => !isBook(one.tool))
  seen.steps += 1
  if (work.length === 1) seen.singles += 1
  if (!work.length) {
    if (calls.every(one => isTool(one.tool, 'todo') || isTool(one.tool, 'note') || one.tool === 'TodoWrite')) say('book', BOOK_ALONE)
    return lines
  }
  const helpers = work.filter(one => one.tool === 'Agent')
  if (helpers.some(one => CHECKER.test(String((one.input as { description?: unknown })?.description ?? '')))) seen.checkerAt = seen.steps
  if (work.length === 1 && helpers.length === 1) say('alone', HELPER_ALONE)
  if (helpers.length && wait && !seen.told.started) say('started', HELPERS_STARTED(wait))
  // Single lookups in a row
  seen.lookups = work.length === 1 && isLookup(work[0]!.tool, work[0]!.input) ? seen.lookups + 1 : 0
  if (seen.lookups >= LOOKUPS_IN_A_ROW) {
    say('lookups', LOOKUP_RUN(seen.lookups))
    seen.lookups = 0
  }
  // Long runs of one kind, each alone in its step
  const one = work.length === 1 ? work[0] : undefined
  const command = one?.tool === 'Bash' ? String((one.input as { command?: unknown })?.command ?? '') : ''
  const kind = one && command && one.tookMs >= LONG_RUN && !isLookup(one.tool, one.input) && !WAIT_RUN.test(command) ? kindOf(command) : ''
  if (kind && seen.lastRun === kind) say('serial', SERIAL_RUNS(kind))
  seen.lastRun = kind || (one ? undefined : seen.lastRun)
  // A commit with no second look started
  if (isTop && seen.checkerAt === undefined && work.some(call => call.tool === 'Bash' && COMMIT.test(String((call.input as { command?: unknown })?.command ?? '')))) say('look', LOOK_NOW)
  return lines
}

// ---- Looking in on running helpers ----

// How often a piece of work with helpers running is looked at, and how long a helper may show nothing new before it is named
const LOOK_IN_EVERY = 60_000
const HELPER_QUIET = 5 * 60_000
// What Claude is told of a helper that has shown nothing new
const QUIET_HELPER = (title: string, id: string, mins: number, running: string) =>
  `Your helper "${title}" (${id}) has shown nothing new for ${mins} minutes${running ? `; ${running}` : ''}. Look at what it is doing now: send it a short question with SendMessage, which it sees after its current step; if it is stuck, stop it with TaskStop and start a narrower one in its place. If it does one at a time what could be split up, start helpers for the other parts beside it.`
// What it is told of a helper that keeps taking single steps in order
const SERIAL_HELPER = (title: string, id: string, steps: number) =>
  `Your helper "${title}" (${id}) has taken ${steps} steps, nearly all of one call each: it does one at a time what could be split up. If its parts don't depend on each other, start helpers for the rest beside it, or tell it with SendMessage to send its calls together.`
// A helper this many steps in, with this share of single-call steps, is working in order
const SERIAL_STEPS = 20
const SERIAL_SHARE = 0.85

// Looked at every LOOK_IN_EVERY while work runs: each running helper that has shown nothing new for HELPER_QUIET, and each that
// works in order, is named to the work that started it, once each stretch, and its card says when it was looked at and what of
const lookInOnHelpers = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const list = await read($, todos)
  const told: { to: string; line: string }[] = []
  const looked = new Map<string, { at: number; running: number; quiet: number }>()
  for (const helper of list) {
    if (!helper.parentId || helper.status !== 'working' || helper.chat) continue
    const parent = list.find(one => one.id === helper.parentId)
    if (!parent || parent.status !== 'working') continue
    const sum = looked.get(parent.id) ?? { at: now, running: 0, quiet: 0 }
    sum.running += 1
    const last = Math.max(helper.startedAt, helper.newAt ?? 0)
    const isQuiet = now - last >= HELPER_QUIET
    if (isQuiet) sum.quiet += 1
    looked.set(parent.id, sum)
    // Once for each quiet stretch: a helper that shows something new and goes quiet again is named again
    if (isQuiet && helper.quietTold !== last) {
      const running = helper.running ? `${helper.running.what} for ${took(now - helper.running.at)}` : ''
      told.push({ to: parent.id, line: QUIET_HELPER(titleOf(helper), helper.id, Math.round((now - last) / 60_000), running) })
      await changeTodos($, all => all.map(one => (one.id === helper.id ? { ...one, quietTold: last } : one)))
    }
    const seen = stepsSeen.get(helper.id)
    if (seen && seen.steps >= SERIAL_STEPS && seen.singles / seen.steps >= SERIAL_SHARE && !helper.serialTold) {
      told.push({ to: parent.id, line: SERIAL_HELPER(titleOf(helper), helper.id, seen.steps) })
      await changeTodos($, all => all.map(one => (one.id === helper.id ? { ...one, serialTold: true } : one)))
    }
  }
  // Each card with helpers running keeps when they were last looked at and how many were quiet; one with none running keeps nothing
  await changeTodos($, all => {
    const changed = all.some(one => (looked.get(one.id)?.quiet ?? -1) !== (one.lookedIn?.quiet ?? -1) || (looked.get(one.id)?.running ?? -1) !== (one.lookedIn?.running ?? -1))
    return changed || looked.size ? all.map(one => ({ ...one, lookedIn: looked.get(one.id) ?? (one.lookedIn && one.status === 'working' ? undefined : one.lookedIn) })) : all
  })
  for (const one of told) {
    // Work that ended its turn to wait for its helpers is woken by the line; work under way reads it at its next step
    const parent = list.find(todo => todo.id === one.to)
    if (parent?.waitsSince) await sendOwn($, { to: { agentId: one.to }, text: one.line }).catch(err => log($, `work ${one.to} not told of its helper: ${String(err)}`))
    else await tell($, one.to, one.line)
  }
}

// The list is followed every FOLLOW_EVERY; helpers are looked in on every LOOK_IN_EVERY of it
let lookedInAt = 0
const lookInDue = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now - lookedInAt < LOOK_IN_EVERY) return
  lookedInAt = now
  await lookInOnHelpers($)
}

// What a card with helpers running says under its line: only how many have gone quiet, as those at work are rows on its tree
const lookedInLine = (one: Todo, at: number) => {
  const l = one.lookedIn
  // Helpers at work are rows on its tree already; only one gone quiet is said, as the work was told of it
  if (!l || one.status !== 'working' || !l.running || !l.quiet) return ''
  return `${l.quiet === 1 ? '1 helper' : `${l.quiet} helpers`} quiet for ${HELPER_QUIET / 60_000}+ min, Claudopus told Claude`
}

const stepHooks = (on: On) => {
  // After each step of a piece of work or a helper: the patterns its calls show, as lines in its next request
  on('classic.PostToolBatch', async ($, e, next) => {
    const r = await next(e)
    const agent = (e as { agent_id?: string }).agent_id
    if (!agent || !dir || isOff) return r
    const now = await $.clock.now()
    const calls = e.tool_calls.map(call => ({ tool: call.tool_name, input: call.tool_input, tookMs: now - (callStarts.get(call.tool_use_id) ?? now) }))
    for (const call of e.tool_calls) callStarts.delete(call.tool_use_id)
    const card = (await read($, todos)).find(one => one.id === agent)
    const again = await rulesAgain($, agent).catch(err => (void log($, `rules not handed again: ${String(err)}`), ''))
    const lines = [...stepLines(agent, calls, waitCommand($, agent), !card?.parentId), ...(again ? [again] : [])]
    if (!lines.length) return r
    await log($, `work ${agent} told of its step: ${lines.map(line => line.slice(0, 40)).join(' / ')}`)
    return { ...r, additionalContext: [...(r.additionalContext ?? []), ...lines] }
  })
}

// ---- Helpers run in the background, and their work waits for them only when it has nothing else ----

// How long one wait for helpers lasts before it comes back with how each is doing: the steady look-in
const HELPERS_WAIT = 110_000
// How many times a piece of work that tries to end while its helpers run is held back in one stretch, before it is let go
const HELD_AT_STOP = 6
const heldAtStop = new Map<string, number>()

// The helpers an agent started that are still at work
const runningHelpers = (list: Todo[], id: string) => list.filter(one => one.parentId === id && one.status === 'working' && !one.answeredAt)
// One line per helper, for the work that started it: what, how long, its steps, when it last showed something new, what it runs now
const helperRoll = (list: Todo[], id: string, at: number) =>
  list
    .filter(one => one.parentId === id)
    .filter(one => one.status === 'working' || at - one.endedAt < HELPERS_WAIT * 2)
    .map(one => {
      const last = Math.max(one.startedAt, one.newAt ?? 0)
      const state = one.status === 'working' ? `running ${took(at - one.startedAt)}, ${one.steps ?? 0} steps${one.running ? `, now ${one.running.what} for ${took(at - one.running.at)}` : ''}${at - last >= HELPER_QUIET ? ' (nothing new for 5+ minutes: check it, message it with SendMessage, or stop it with TaskStop and start a narrower one)' : ''}` : `ended (${one.status})`
      return `- "${titleOf(one)}" (${one.id}): ${state}`
    })
    .join('\n')
// The command the work waits for its helpers with: a Bash call of its own, so no hook waits
const waitCommand = ($: EngineInterface, agent: string) => `'${$.plugin.root}/bin/helpers' '${rollPath(agent)}'`
const WAIT_HOW = (command: string) => `When you have nothing else to do, wait for them with this Bash command (timeout 600000): ${command} . It comes back as soon as one ends, or after about two minutes with how each is doing.`
const HELD_AT_END = (n: number, command: string) =>
  `You have ${n === 1 ? 'a helper' : `${n} helpers`} still running in the background. Do not finish yet: ${n === 1 ? 'its result' : 'their results'} would reach the chat instead of you. Continue with what needs nothing from ${n === 1 ? 'it' : 'them'}, or wait with this Bash command (timeout 600000): ${command} ; stop one you no longer need with TaskStop.`
const HELPERS_STARTED = (command: string) => `Your helpers run in the background: each call came back at once and each result comes to you as a message when it ends. Continue now with your own part. ${WAIT_HOW(command)}`

// The file each piece of work with helpers waits on: its first line the helpers it has running and those of them gone quiet, then
// how each is doing
const rollPath = (agent: string) => `${dir}/helpers/${agent}.txt`
const rollsWritten = new Map<string, { head: string; at: number }>()
const writeRolls = async ($: EngineInterface, isNow = false) => {
  const list = await read($, todos)
  const now = await $.clock.now()
  const parents = new Set(list.filter(one => one.parentId && (one.status === 'working' || now - one.endedAt < HELPERS_WAIT * 2)).map(one => one.parentId))
  for (const id of parents) {
    const parent = list.find(one => one.id === id)
    if (!parent || parent.status !== 'working') continue
    // A helper that goes quiet changes the line too, so a work waiting on its helpers hears of it at once, not after its wait
    const running = runningHelpers(list, id)
    const quiet = running.filter(one => now - Math.max(one.startedAt, one.newAt ?? 0) >= HELPER_QUIET)
    const head = `running: ${running.map(one => one.id).join(',')}${quiet.length ? ` quiet: ${quiet.map(one => one.id).join(',')}` : ''}`
    const last = rollsWritten.get(id)
    if (!isNow && last && last.head === head && now - last.at < 60_000) continue
    rollsWritten.set(id, { head, at: now })
    await $.fs.write(rollPath(id), `${head}\n${helperRoll(list, id, now)}\n`).catch(err => log($, `helpers of ${id} not written: ${String(err)}`))
  }
}

// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
const isHelperSpawn = (e: { parentAgentId?: string; workflow?: unknown; resume?: unknown; fork: boolean; isTeammate?: true; background: boolean }) =>
  Boolean(e.parentAgentId) && !flowAgents.has(e.parentAgentId ?? '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir)

// Work that ends its turn while its helpers run is held back, so their results come to it and not to the chat
const holdAtStop = async ($: EngineInterface, agent: string, at: 'stop' | 'handback'): Promise<string> => {
  if (!dir || isOff || flowAgents.has(agent)) return ''
  // Its report went through: what ends after it is no longer held
  if (at === 'stop' && handedBack.has(agent)) return ''
  const running = runningHelpers(await read($, todos), agent).length
  const key = `${agent} ${at}`
  if (!running) return (heldAtStop.delete(key), '')
  const held = heldAtStop.get(key) ?? 0
  if (held >= HELD_AT_STOP) return ''
  heldAtStop.set(key, held + 1)
  await log($, `work ${agent} held at its ${at === 'stop' ? 'end' : 'report'}: ${running} helpers run`)
  await writeRolls($, true)
  return HELD_AT_END(running, waitCommand($, agent))
}

// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending, their
// results reaching the chat
const stopHelpers = async ($: EngineInterface, id: string) => {
  const list = await read($, todos)
  for (const one of underOf(list, id).filter(kid => kid.status === 'working')) {
    const r = await $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(err => ({ deny: String(err) }))
    if ((r as { deny?: unknown }).deny) await log($, `helper ${one.id} of ${id} not stopped: ${String((r as { deny?: unknown }).deny)}`)
  }
}

// Work that goes on when the chat's process ends: a keeper on this Mac for a chat the app runs from another Mac, the cards of
// work cut off marked so, that work started again by itself, and the person told on their own device

// ---- What the keeper reads, and the keeper itself ----

// Its files, one set per chat, under keep/: <chat>.json (the mod's: how many pieces of work are at work, and which),
// <chat>.state (the keeper's: when the process ended, when the chat went on here, when the app took it back), <chat>.log
const keepFile = (id: string, kind = 'json') => `${dir}/keep/${id}.${kind}`
let keepSign = ''
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which cuts nothing off
let enginePid = ''
const pidOfEngine = async ($: EngineInterface) => ((await $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(() => undefined))?.stdout ?? '').trim()
// Kept true as the cards change: the keeper reads it once the chat's process has ended, so it says what was at work then
const saveKeep = async ($: EngineInterface) => {
  const { id, title } = await read($, me)
  if (!id || !dir) return
  const ids = (await read($, todos)).filter(one => !one.parentId && !one.chat && (one.status === 'working' || lapsed.has(one.id))).map(one => one.id)
  const sign = `${ids.join(',')}|${title}`
  if (sign === keepSign) return
  keepSign = sign
  await $.fs.write(keepFile(id), JSON.stringify({ count: ids.length, ids, title, pid: enginePid, at: await $.clock.now() }))
}

// A chat this Mac runs for the app on another Mac lives only as long as the app lets it: the app ends its process when it
// chooses, and the process signs in with the app's sign-in, which lapses while the app is away. So each load starts a keeper,
// in a session of its own so it outlives the process: when the process ends with work at work and the app does not start it
// again within a minute, it starts the chat again here, under this Mac's own sign-in (bin/keep). Not in the copy it starts,
// which Claude Code's own background service keeps, nor in a chat this Mac's own terminal runs
const isKeptCopy = async ($: EngineInterface) => (await $.env.get('CLAUDE_CODE_SESSION_KIND')) === 'bg'
const startKeeper = async ($: EngineInterface, id: string) => {
  if (!dir || !/^[A-Za-z0-9-]{1,80}$/.test(id) || (await isKeptCopy($))) return
  // $PPID is the chat's process, which runs this shell; perl's setsid takes the keeper out of its process group, which the
  // app ends with the process
  const script = `nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$1" "$PPID" "$2" "$3" "$4" "$5" >/dev/null 2>&1 </dev/null &`
  // The mod's own folder goes to the copy whole: a folder it is loaded from may have spaces in its path, which ps would split
  const own = $.plugin.root.includes('/.claude/plugins/cache/') ? '' : $.plugin.root
  const r = await $.process.run(['/bin/sh', '-c', script, 'sh', `${$.plugin.root}/bin/keep`, id, cwd, dir, own]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  await log($, r.exitCode === 0 ? `keeper started for ${id}` : `keeper not started: ${r.stderr.slice(0, 200)}`)
}

// With the app away its sign-in lapses, and the chat's process, still running, can no longer reach Claude: a turn ends with the
// API saying so. The keeper is asked to end the process then, which hands the chat to this Mac's own sign-in at once (bin/keep
// ends it on <chat>.handover); the work that failed so is counted as at work, to be started again there
// Only the API's own words for a lapsed sign-in, and only twice within a few minutes: one helper's refusal is no lapse
const SIGNIN_LAPSED = /API Error: 401\b[\s\S]{0,400}(authentication_error|OAuth token has expired|OAuth token revoked|invalid authentication credentials)/i
const LAPSED_AGAIN = 10 * 60_000
const lapsed = new Set<string>()
let lapsedAt: number[] = []
const lapsedSignIn = async ($: EngineInterface, e: { agentId?: string; reason: string; answer: string }) => {
  if (!isRunFromAfar || e.reason !== 'error' || !SIGNIN_LAPSED.test(e.answer) || (await isKeptCopy($))) return false
  const { id } = await read($, me)
  if (!id || !dir) return false
  const now = await $.clock.now()
  if (e.agentId) lapsed.add(e.agentId)
  lapsedAt = [...lapsedAt.filter(at => now - at < LAPSED_AGAIN), now]
  if (lapsedAt.length < 2) return void log($, `a turn ended with a lapsed sign-in${e.agentId ? ` (work ${e.agentId})` : ''}; handed over if another does`)
  keepSign = ''
  await saveKeep($)
  // The keeper acts only on an ask naming the process it watches
  await $.fs.write(keepFile(id, 'handover'), enginePid)
  await log($, `the sign-in the app lent this chat lapsed${e.agentId ? ` (work ${e.agentId})` : ''}: the keeper is asked to hand the chat to this Mac`)
  return true
}

// ---- Work cut off: marked, started again, said ----

// How long after the chat starts its cut-off work is looked at: by then Claude Code has started again what it starts itself
const CUT_LOOK = 30_000
// Work cut off longer ago than this is not started again
const CUT_OLD = 24 * 3600_000
type KeepState = { cutAt?: number; movedAt?: number; backAt?: number; copy?: string }
const parsedOr = <T,>(text: string, or: T): T => {
  try {
    return text ? (JSON.parse(text) as T) : or
  } catch {
    return or
  }
}
// What was at work when the chat's process last ended, read as it starts again, before this load writes its own; when the
// keeper saw that process end (or stopped its copy for the app); and what a load of the mod already did about that cut
type CutHandled = { at?: number; pid?: string; isDone?: boolean }
const readCut = async ($: EngineInterface, id: string) => {
  const was = parsedOr<{ ids?: unknown }>(await readOr($, keepFile(id)), {})
  const state = parsedOr<KeepState>(await readOr($, keepFile(id, 'state')), {})
  const handled = parsedOr<CutHandled>(await readOr($, keepFile(id, 'cut')), {})
  const ids = Array.isArray(was.ids) ? was.ids.filter((one): one is string => typeof one === 'string' && /^[\w-]{1,80}$/.test(one)) : []
  // The copy stopped for the app is a cut of its own: its work is started again in the app's chat
  const cutAt = typeof state.backAt === 'number' ? state.backAt : typeof state.cutAt === 'number' ? state.cutAt : 0
  return { ids, cutAt, state, handled }
}
// Cut-off work not yet looked at again: Claude Code may be starting it again, so it is neither ended nor announced meanwhile
const cutPending = new Set<string>()
const markCut = ($: EngineInterface, id: string, handled: CutHandled) => $.fs.write(keepFile(id, 'cut'), JSON.stringify(handled)).catch(err => log($, `cut-off work not noted: ${String(err)}`))
// The words the work is started again with
const CUT_TELL = (cutAt: number, here: boolean) =>
  `From Claudopus, not {name}: this chat's process was ended at ${hhmm(cutAt)} while you were working, not by {name}, and the chat has started again${here ? ' on this Mac by itself, under its own sign-in' : ''}. Continue from where you were: first check what you already have and whether a command you started is still running (a detached one keeps running), then continue with your to-dos.`
const hhmm = (at: number) => new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// As the chat starts: only a cut the keeper saw counts (a chat with no keeper, or one quit before any, starts nothing again),
// once, by the first process to start after it; a reload of the mod in that process before it was done takes it up again
const noteCut = async ($: EngineInterface, id: string) => {
  keepSign = ''
  if (!dir) return
  enginePid = await pidOfEngine($)
  const cut = await readCut($, id)
  if (!cut.ids.length || !cut.cutAt) return
  if (cut.handled.at === cut.cutAt && cut.handled.isDone) return
  const now = await $.clock.now()
  if (now - cut.cutAt > CUT_OLD) return void log($, `work cut off at ${hhmm(cut.cutAt)} is too old to start again: ${cut.ids.join(', ')}`)
  const isCopy = await isKeptCopy($)
  await markCut($, id, { at: cut.cutAt, pid: enginePid, isDone: false })
  for (const one of cut.ids) cutPending.add(one)
  await log($, `work cut off at ${hhmm(cut.cutAt)}${isCopy ? ', the chat going on here as a copy' : ''}: ${cut.ids.join(', ')}`)
  $.clock.after(CUT_LOOK, () => void bringBack($, id, cut.ids, cut.cutAt, isCopy).catch(err => log($, `cut-off work not started again: ${String(err)}`)))
}

// Each piece of cut-off work: one Claude Code started again by itself is marked; one the person stopped since is left; any other
// is sent a message, which starts it again; one that cannot be is marked cut off and left ended. Then one notice for all of them
const bringBack = async ($: EngineInterface, id: string, ids: string[], cutAt: number, isCopy: boolean) => {
  const handled = parsedOr<CutHandled>(await readOr($, keepFile(id, 'cut')), {})
  if (handled.at === cutAt && handled.isDone) return
  await markCut($, id, { at: cutAt, pid: enginePid, isDone: true })
  for (const one of ids) cutPending.delete(one)
  await sync($).catch(() => undefined)
  const live = await $.agent.list().catch(() => [])
  const back: string[] = []
  const lost: string[] = []
  const heldNow = await read($, todos)
  for (const one of ids.filter(one => !stoppedHere.has(one) && !isHeld(heldNow.find(card => card.id === one)))) {
    const isLive = live.some(agent => agent.id === one && WORKING.includes(agent.status))
    const r = isLive ? { isDelivered: true as const } : await $.session.send({ to: { agentId: one }, text: named(CUT_TELL(cutAt, isCopy)) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    ;(r.isDelivered ? back : lost).push(one)
    if (!r.isDelivered) await log($, `cut-off work ${one} not started again: ${r.reason}`)
  }
  if (!back.length && !lost.length) return
  const now = await $.clock.now()
  await changeTodos($, list => {
    const known = new Set(list.map(one => one.id))
    const added = [...back, ...lost].filter(one => !known.has(one)).map(one => ({ ...started(one, '', '', '', cutAt), status: 'stopped' as const, endedAt: cutAt }))
    return [...list, ...added].map(one =>
      back.includes(one.id) ? { ...(one.status === 'working' ? one : resumed(one, now)), parentId: '', cutAt, backAt: now } : lost.includes(one.id) ? { ...(one.status === 'working' ? ended(one, 'stopped', cutAt) : one), parentId: '', cutAt, backAt: undefined } : one,
    )
  })
  await saveKeep($)
  redraw($)
  const cards = await read($, todos)
  const titled = (one: string) => `"${titleOf(cards.find(card => card.id === one) ?? started(one, '', '', '', cutAt))}"`
  const where = isCopy ? 'on this Mac by itself' : 'again'
  const text = [
    back.length ? `${back.length === 1 ? `${titled(back[0] ?? '')} was interrupted at ${hhmm(cutAt)} and has been running ${where}` : `${back.length} tasks were interrupted at ${hhmm(cutAt)} and have been running ${where}`} since ${hhmm(now)}.` : '',
    lost.length ? `${lost.length === 1 ? titled(lost[0] ?? '') : `${lost.length} tasks`} interrupted at ${hhmm(cutAt)} couldn't be restarted.` : '',
  ]
    .filter(Boolean)
    .join(' ')
  $.ui.log(text)
  await tellDevice($, text)
}

// The person is told on their own device: Claude Code's push to the Claude app on their phone, where Remote Control reaches it;
// and the notification this Mac's chats raise
const tellDevice = async ($: EngineInterface, text: string) => {
  const pushed = await $.tool.call({ tool: 'PushNotification', message: text.slice(0, 199) } as never).catch(err => ({ deny: String(err) }))
  await log($, `cut-off notice pushed: ${JSON.stringify(pushed).slice(0, 200)}`)
  await alertPerson($, 'cut', 'Task interrupted and restarted', text, `cut-${Math.round((await $.clock.now()) / 60_000)}`)
}

// The line on a card of cut-off work: when, and whether it goes on again
const cutLine = (one: Todo) =>
  one.cutAt ? (one.backAt ? `Interrupted at ${hhmm(one.cutAt)} because the chat's process ended; running again since ${hhmm(one.backAt)}.` : `Interrupted at ${hhmm(one.cutAt)} because the chat's process ended; it couldn't be restarted.`) : ''

// The keys remembered: which keys, tokens and logins the person has given, and where each is kept, by name only, never a value.
// It is made again from each store's own list of names (Claudopus's keychain, the rest of this Mac's keychain, the .env files in each
// subject's folder) and from what SBOS last said it holds, so a key taken out of a store stops being listed. Work reads it in
// keys.md in the memory folder before asking for one, and work that asks for a key it lists is told where that key is

const KEYS_FILE = 'keys.md'
const KEYS_STATE = 'keys.json'
// How long the local stores' names are trusted before they are read again, for an ask checked against them
const KEYS_MS = 60_000
type KeyStore = 'claudopus' | 'keychain' | 'sbos' | 'env'
// An SBOS secret is a key, a database (used through its `query`) or a login
type SbosKind = 'database' | 'login'
type KeyEntry = { name: string; store: KeyStore; where?: string; label?: string; kind?: SbosKind; isPresent: boolean; added: number; seen: number }
type SbosName = { name: string; label?: string; kind?: SbosKind; isPresent: boolean }
type KeysState = { at: number; sbosAt?: number; entries: KeyEntry[] }
const STORE_NAMES: Record<KeyStore, string> = {
  claudopus: "Claudopus's keychain",
  keychain: "this Mac's keychain",
  sbos: 'SBOS secrets',
  env: 'a .env file',
}
// A name as it is kept: plain marks only, and short, so no text that is not a name can pass for one
const plainName = (text: string) => (/^[\w .:@/+|-]{1,80}$/.test(text) ? text : '')
// The words a key's name is made of, less those every key's name has: ELEVENLABS_API_KEY and elevenlabs-key are both "elevenlabs"
const KEY_WORDS = new Set(['api', 'key', 'keys', 'token', 'tokens', 'secret', 'secrets', 'access', 'password', 'passwd', 'pat', 'auth', 'the'])
const coreOf = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word && !KEY_WORDS.has(word))
const sameKey = (a: string, b: string) => {
  const x = coreOf(a)
  const y = coreOf(b)
  return x.length > 0 && x.length === y.length && x.every(word => y.includes(word))
}
// A keychain entry that is a key someone gave by hand, not an app's own storage: its service names an API, a token or a key, or its
// account is a name such as ELEVENLABS_API_KEY. The mod's own services are read as Claudopus's keychain or not at all
const isKeyEntry = (service: string, account: string) =>
  !service.startsWith('claudopus') &&
  !/safe storage|^com\.apple\.|^apple/i.test(service) &&
  ((/(?:^|[-_ .])(?:api|token|key)s?(?:$|[-_ .])/i.test(service)) || /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/.test(account))
// A variable in a .env file that holds a key, by its name
// (one a web page shows anyway, NEXT_PUBLIC_… or a publishable key, is none)
const isKeyVariable = (name: string) => /(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|_PAT|CREDENTIALS?)(?:_|$)/.test(name) && !/^NEXT_PUBLIC_|PUBLISHABLE/.test(name)
const ENV_NAME = /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/

let keys: KeysState = { at: 0, entries: [] }
const keysRead = async ($: EngineInterface): Promise<KeysState> => {
  try {
    const kept = JSON.parse((await readOr($, `${dir}/${KEYS_STATE}`)) || '{}') as Partial<KeysState>
    return { at: Number(kept.at) || 0, sbosAt: kept.sbosAt, entries: Array.isArray(kept.entries) ? kept.entries : [] }
  } catch {
    return { at: 0, entries: [] }
  }
}

// The names each local store lists now; undefined for a store that could not be read, so what was known of it stays. Claudopus's
// keychain is read from the same listing as the rest, which fails as a whole when the keychain does not answer, so a locked keychain
// never reads as an empty one
const localNames = async ($: EngineInterface) => {
  const all = await $.process.run([`${$.plugin.root}/bin/keyring`, 'entries']).catch(() => undefined)
  const pairs = all?.exitCode === 0 && !all.isStdoutTruncated ? all.stdout.split('\n').filter(Boolean).map(line => line.split('\t')) : undefined
  const claudopus = pairs?.filter(([service]) => service === 'claudopus-secret').map(([, account = '']) => plainName(account)).filter(Boolean)
  // Another app's account is shown only when it is a name such as ELEVENLABS_API_KEY: any other account (an email, an id, a token
  // pasted there by mistake) stays out of the list
  const keychain = pairs
    ?.filter(([service = '', account = '']) => isKeyEntry(service, account))
    .map(([service = '', account = '']) => ({ name: plainName(ENV_NAME.test(account) ? account : service), where: plainName(ENV_NAME.test(account) ? `${service} / ${account}` : service) }))
    .filter(one => one.name && one.where)
  // The top of each subject's folder: its .env files (plain files only), read for the names before each = and nothing after it
  const env: { name: string; where: string }[] = []
  const folders = [...new Set((await readIndex($).catch(() => [] as Stream[])).map(one => one.repo).filter(one => one.startsWith('/')))]
  for (const folder of folders) {
    const files = (await $.fs.list(folder).catch(() => [])).filter(one => one.kind === 'file' && !one.isLink).map(one => one.name).filter(name => /^\.env(?:\.[\w-]+)?$/.test(name) && !/\.(?:example|sample|template|dist)$/.test(name))
    for (const file of files) {
      const r = await $.process.run(['/usr/bin/grep', '-ohE', '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=', `${folder}/${file}`]).catch(() => undefined)
      for (const line of (r?.stdout ?? '').split('\n')) {
        const name = line.replace(/^\s*(?:export\s+)?/, '').replace(/\s*=$/, '')
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && isKeyVariable(name)) env.push({ name, where: `${folder}/${file}` })
      }
    }
  }
  return { claudopus, keychain, env }
}

// The list made again: each local store as it lists its names now, SBOS as it last said; what a store no longer lists goes
const refreshKeys = async ($: EngineInterface, sbos?: SbosName[], isListed = true) => {
  if (!dir) return keys
  const now = await $.clock.now()
  const before = await keysRead($)
  const { claudopus, keychain, env } = await localNames($)
  const old = (store: KeyStore, name: string, where?: string) => before.entries.find(one => one.store === store && one.name === name && one.where === where)
  const made = (store: KeyStore, name: string, extra: Partial<KeyEntry> = {}): KeyEntry => ({ name, store, ...extra, isPresent: extra.isPresent ?? true, added: old(store, name, extra.where)?.added ?? now, seen: extra.isPresent === false ? (old(store, name, extra.where)?.seen ?? 0) : now })
  const kept = (store: KeyStore, fresh: KeyEntry[] | undefined) => fresh ?? before.entries.filter(one => one.store === store)
  const entries = [
    ...kept('claudopus', claudopus?.map(name => made('claudopus', name))),
    ...kept('keychain', keychain?.map(one => made('keychain', one.name, { where: one.where }))),
    ...env.map(one => made('env', one.name, { where: one.where })),
    ...kept('sbos', sbos?.map(one => made('sbos', one.name, { label: one.label, kind: one.kind, isPresent: one.isPresent }))),
  ]
  // Every kept value is hidden in each name, place and label as it came, before anything is cut or changed, so no part of one can be
  // left: the texts alone go through, as one list of strings, so a value that is also a number or a word of the list's own shape changes
  // nothing else. The list is made from what was hidden, and nothing is written when it could not be checked
  const texts = entries.flatMap(one => [one.name, one.where ?? '', one.label ?? ''])
  const back = await keysHidden($, JSON.stringify(texts))
  let hidden: string[] | undefined
  try {
    hidden = back === undefined ? undefined : (JSON.parse(back) as string[])
  } catch {}
  if (!Array.isArray(hidden) || hidden.length !== texts.length || hidden.some(one => typeof one !== 'string')) return (await log($, 'the list of keys was not written: it could not be checked for kept values'), keys)
  const seen = hidden
  keys = {
    at: now,
    sbosAt: sbos && isListed ? now : before.sbosAt,
    entries: entries.map((one, i) => ({ ...one, name: seen[i * 3] ?? '', ...(one.where ? { where: seen[i * 3 + 1] } : {}), ...(one.label ? { label: seen[i * 3 + 2] } : {}) })),
  }
  await $.fs.write(`${dir}/${KEYS_STATE}`, `${JSON.stringify(keys, null, 2)}\n`)
  await $.fs.write(`${dir}/${KEYS_FILE}`, keysText($.plugin.root, keys))
  return keys
}
// The text with every kept value hidden, as bin/secret hides a command's output; undefined when it could not be checked
const keysHidden = async ($: EngineInterface, text: string) => {
  const r = await $.process.run([`${$.plugin.root}/bin/secret`, '--hide', '--json'], { stdin: text }).catch(() => undefined)
  return r && r.exitCode === 0 && !r.isStdoutTruncated && r.stdout.trim() ? r.stdout : undefined
}
const keysFresh = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (!keys.at) keys = await keysRead($)
  return now - keys.at < KEYS_MS ? keys : refreshKeys($)
}

const dayOf = (at: number) => (at ? new Date(at).toISOString().slice(0, 10) : '')
// How work uses a key, by its store's own route; the value never passes through the work
const routeOf = (root: string, one: KeyEntry) =>
  one.store === 'claudopus'
    ? `\`${root}/bin/secret ${one.name} here '<command using $${one.name}>'\``
    : one.store === 'sbos' && one.kind === 'database'
      ? `SBOS's \`query\` and \`tables\` with db ${one.name}`
      : one.store === 'sbos' && one.kind === 'login'
        ? 'a login kept in SBOS: its page there says how it is used'
    : one.store === 'sbos'
      ? one.isPresent
        ? `SBOS by its name: \`send_with_secret\` with {{secret:${one.name}}}, or \`secret_link\` for a command`
        : `asked in SBOS but never put in: ask for it in the secret runner instead`
      : one.store === 'keychain'
        ? `kept by another app (${one.where}): a task cannot use it; {name} can paste it into Claudopus's keychain once`
        : `in ${one.where}, which that project's own scripts load`
const keysText = (root: string, state: KeysState) => {
  const rows = [...state.entries]
    .sort((a, b) => Number(b.isPresent) - Number(a.isPresent) || a.store.localeCompare(b.store) || a.name.localeCompare(b.name))
    .map(one => `| ${one.name} | ${one.label ? oneLine(one.label).replace(/\|/g, '/').slice(0, 80) : ''} | ${STORE_NAMES[one.store]} | ${one.isPresent ? 'present' : 'asked, not given'} | ${dayOf(one.added)} | ${dayOf(one.seen)} | ${named(routeOf(root, one)).replace(/\|/g, '/')} |`)
  return [
    '# Keys',
    '',
    `The keys, tokens and logins ${who()} has given, by name and where each is kept: never a value. Made again from each store's own list of names on ${dayOf(state.at)}; SBOS's as it last listed them${state.sbosAt ? ` on ${dayOf(state.sbosAt)}` : ' (not yet listed: call its `secrets`)'}. A key taken out of a store goes from here.`,
    '',
    '| Name | For | Store | State | Added | Last seen | How a task uses it |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n')
}

// SBOS's answer to `secrets`: its list of names, whose state says whether each was put in. Only the names, what each is for and that
// state are taken; anything else in it is left
const sbosListed = (result: unknown) => {
  const texts: string[] = []
  const walk = (x: unknown) => (typeof x === 'string' ? texts.push(x) : Array.isArray(x) ? x.forEach(walk) : x && typeof x === 'object' ? Object.values(x).forEach(walk) : undefined)
  walk(result)
  for (const text of texts) {
    try {
      const list = JSON.parse(text) as unknown
      if (!Array.isArray(list)) continue
      return list
        .filter((one): one is { name: string; label?: unknown; put_in?: unknown; database?: unknown; login?: unknown } => Boolean(one) && typeof one === 'object' && typeof (one as { name?: unknown }).name === 'string')
        // the label as it came, uncut (one too long to hide whole is left out): it is cut only once every kept value in it is hidden
        .map((one): SbosName => ({ name: plainName(one.name), label: typeof one.label === 'string' && one.label.length <= 2000 ? one.label : undefined, ...(one.database === true ? { kind: 'database' as const } : one.login ? { kind: 'login' as const } : {}), isPresent: one.put_in === true }))
        .filter(one => one.name)
    } catch {}
  }
  return undefined
}

// The key an ask is for, when the list says it is kept where work can use it: what the ask is told back, or ''
// A database in SBOS is no key anyone pastes, so it is never what an ask is for
const usable = (one: KeyEntry) => one.isPresent && one.kind !== 'database' && (one.store === 'claudopus' || one.store === 'sbos')
const KEY_KEPT = (root: string, one: KeyEntry, asked: string, again: string) =>
  named(
    `Not asked: {name} gave this key already. ${asked === one.name ? one.name : `"${asked}" is ${one.name}`}, kept in ${STORE_NAMES[one.store]}${one.seen ? ` and last seen there ${dayOf(one.seen)}` : ''}. Use it through ${routeOf(root, one)}. ${again} The list of keys is ${dir}/${KEYS_FILE}.`,
  )
// Asked again on purpose: the ask names the kept key exactly, as it is written, and says why it does not do
const AGAIN_IN = (one: KeyEntry, field: string) => `If it no longer works, ask again with its name, ${one.name}, written as it is here, and why it does not do, in \`${field}\`.`
const AGAIN_FORGET = (root: string, one: KeyEntry) => `If it no longer works, take it out first with \`${root}/bin/secret ${one.name} --forget\`; the next run asks for it.`
// A name written whole in a text, as it is: not inside another word
const namesWhole = (text: string, name: string) => new RegExp(`(?:^|[^A-Za-z0-9_-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^A-Za-z0-9_-])`).test(text)
// The kept key a text asks for: its whole name in it, in any case and with any dashes, or the words of its name in their order right
// before a word for a key ("your ElevenLabs API key"), so "the Stripe webhook secret" or "the GitHub login email" is no ask for
// STRIPE_SECRET_KEY or github-token. The key whose name has the most words found wins
const askedIn = (text: string, listed: KeyEntry[]) => {
  const flat = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `
  return listed
    .map(one => ({ one, core: coreOf(one.name), whole: flat.includes(` ${one.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `) }))
    .filter(({ core, whole }) => whole || (core.length > 0 && new RegExp(` ${core.join(' ')}(?: (?:api|access|secret|auth|personal))* (?:key|token|secret|password|pat|credentials?)s? `).test(flat)))
    .sort((a, b) => b.core.length - a.core.length)[0]?.one
}
// The secret runner's calls in a text, by any path to it (bin/secret, ./secret from its folder, a doubled slash), each with the names
// it takes and what it does with them; the word secret alone, as in a commit message or kubectl's, is none
const SECRET_RUNS = /\/secret['"]?\s+['"]?([A-Za-z_][A-Za-z0-9_,]*)['"]?\s+['"]?(--add|--forget|[^\s'"-][^\s'"]*)/g
const keyAsked = async ($: EngineInterface, e: { tool: string }): Promise<string> => {
  if (!dir) return ''
  const input = e as { command?: unknown; name?: unknown; text?: unknown; copy?: unknown; details?: unknown; for?: unknown; agent?: unknown }
  const root = $.plugin.root
  const listed = async () => (await keysFresh($)).entries.filter(usable)
  if (e.tool === 'mcp__sbos__ask_secret') {
    // One asked for an autonomous agent of SBOS's is its own: the list holds the person's
    if (typeof input.agent === 'string' && input.agent) return ''
    const name = String(input.name ?? '')
    const one = (await listed()).find(entry => entry.name === name || sameKey(entry.name, name))
    return one && !namesWhole(String(input.for ?? ''), one.name) ? KEY_KEPT(root, one, name, AGAIN_IN(one, 'for')) : ''
  }
  if (e.tool === `${TOOLS}ask`) {
    // What the ask tells the person to do (a word for a key, and a kept key's name or every word of it), or, when it asks them to
    // paste or type something, what it is about
    const said = `${String(input.text ?? '')} ${String(input.copy ?? '')}`
    const about = String(input.details ?? '')
    if (!/\b(?:key|token|password|secret|credentials?|login)s?\b/i.test(said) && !/[A-Z0-9]_[A-Z0-9]/.test(said)) return ''
    const fresh = await listed()
    const one = askedIn(said, fresh) ?? (/\b(?:paste|type|enter|give|send|add|put)\b/i.test(said) ? askedIn(about, fresh) : undefined)
    return one && !namesWhole(about, one.name) ? KEY_KEPT(root, one, one.name, AGAIN_IN(one, 'details')) : ''
  }
  if (e.tool !== 'Bash') return ''
  // The secret runner asked for a key under a name Claudopus's keychain does not keep while it keeps the same key under another, or
  // asked to take a kept one in again: in the command, read as written and unquoted, and in each script it runs
  const command = String(input.command ?? '')
  const texts = [command, unquoted(command), ...(await scriptsRun($, command))]
  // A command that runs no secret runner leaves the stores unread
  if (!texts.some(text => [...text.matchAll(SECRET_RUNS)].length)) return ''
  const mine = (await listed()).filter(entry => entry.store === 'claudopus')
  for (const text of texts) {
    for (const run of text.matchAll(SECRET_RUNS)) {
      // a forget asks for nothing
      if (run[2] === '--forget') continue
      for (const name of (run[1] ?? '').split(',').filter(Boolean)) {
        const kept = mine.find(entry => entry.name === name)
        if (kept && run[2] === '--add') return KEY_KEPT(root, kept, name, AGAIN_FORGET(root, kept))
        if (kept) continue
        const one = mine.find(entry => sameKey(entry.name, name))
        if (one) return KEY_KEPT(root, one, name, AGAIN_FORGET(root, one))
      }
    }
  }
  return ''
}

// What a call changed in a store: a key given or forgotten through the secret runner, or SBOS's list of names, makes the list again.
// Run as each call ends, by the work's own hook on every call
const keysLearn = async ($: EngineInterface, e: { tool: string }, r: { deny?: unknown; isError?: unknown; result?: unknown }) => {
  if (!dir || r.deny) return
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  const isOwnAgent = !(e as { agent?: unknown }).agent
  if (e.tool === 'mcp__sbos__secrets' && isOwnAgent && !r.isError) {
    const listed = sbosListed(r.result)
    if (listed) await refreshKeys($, listed)
  } else if (/^mcp__sbos__(?:ask_secret|forget_secret)$/.test(e.tool) && isOwnAgent && !r.isError) {
    // An ask leaves a name not put in yet, and a forget takes it out, until SBOS's next list
    const name = plainName(String((e as { name?: unknown }).name ?? ''))
    const label = (e as { label?: unknown }).label
    const all = (await keysRead($)).entries.filter(one => one.store === 'sbos')
    const was = all.find(one => one.name === name)
    const sbos: SbosName[] = all.filter(one => one.name !== name).map(one => ({ name: one.name, label: one.label, kind: one.kind, isPresent: one.isPresent }))
    // one SBOS already holds stays as it is
    if (e.tool.endsWith('ask_secret') && name) sbos.push(was ? { name, label: was.label, kind: was.kind, isPresent: was.isPresent } : { name, label: typeof label === 'string' && label.length <= 2000 ? label : undefined, isPresent: false })
    await refreshKeys($, sbos, false)
  } else if ([...command.matchAll(SECRET_RUNS)].length) await refreshKeys($)
}
// As a chat starts, a list that is missing or a day old is made again a little later, so work that reads it finds one
const KEYS_DAY = 24 * 60 * 60_000
const keysOnStart = ($: EngineInterface) =>
  $.clock.after(10_000, () =>
    void (async () => {
      const kept = await keysRead($)
      if ((await $.clock.now()) - kept.at >= KEYS_DAY || !(await readOr($, `${dir}/${KEYS_FILE}`))) await refreshKeys($)
    })().catch(err => log($, `keys not made again: ${String(err)}`)),
  )

// Work starting and running: the chat's own thread kept to reading and handing work over, how full the chat is, each step of work, and new
// work's card

// A call that writes into the runners' boxes folder or reads their keychain service: a command that names them, a file it runs that
// does, or a file written or edited there. The runners themselves, the mod's own bin/admin and bin/secret, are what may
const isBoxesTouched = async ($: EngineInterface, e: { tool: string }): Promise<boolean> => {
  if (!dir) return false
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) {
    // in small letters, as this Mac's files take any; and a runner of the mod's planted where its copies are let through unread
    const path = pathOf(String(input.file_path ?? input.notebook_path ?? ''), home, cwd || home).toLowerCase()
    const boxes = boxesDir().toLowerCase()
    return path === boxes || path.startsWith(`${boxes}/`) || path.startsWith(`${home.toLowerCase()}/.claude/plugins/cache/claudopus/`)
  }
  if (e.tool !== 'Bash') return false
  const command = String(input.command ?? '')
  if (touchesBoxes(command)) return true
  for (const text of await scriptsRun($, command)) if (touchesBoxes(text)) return true
  return false
}
// A piece of work reads a message only between its calls, so a command it holds open keeps the person's reply from it until the
// command ends (16 Nov: a reply waited 8 minutes behind a 9-minute wait for the person). One that may run past this long, by the
// time limit it asks for or the time its words give it, goes to the background instead: the work is told when it ends, and reads a
// reply at once meanwhile. Not the mod's own waits on helpers (which come back when a reply waits), a password or a key
const HELD_LONGEST = 2 * 60_000
const isLongHeld = (call: { tool: string; command?: unknown; description?: unknown; timeout?: unknown; run_in_background?: unknown }) =>
  call.tool === 'Bash' &&
  !call.run_in_background &&
  !/\bbin\/(?:helpers|admin|secret)\b|(?:^|[\s;&|(])\.\/(?:helpers|admin|secret)\b/.test(String(call.command ?? '')) &&
  // A launcher that leaves its runs going and comes back is followed by what it started while it ran, so it is left as it is
  !/\b(?:nohup|setsid|disown)\b|(?<![&>|])&(?![&>])/.test(String(call.command ?? '')) &&
  (Number(call.timeout ?? 0) > HELD_LONGEST || (/^\s*(?:wait|watch|poll)(?:ing)?\b/i.test(String(call.description ?? '')) && (describedOf(String(call.description ?? '')).expect ?? 0) >= HELD_LONGEST))
// A wait for the person themselves, by the words the work gives its command: there is no time to give them. Their answer to an ask
// comes as a message the moment they give it and starts the work then, however long it takes, so the work ends its step instead
const isPersonWait = (call: { tool: string; command?: unknown; description?: unknown }, name: string) => {
  const them = `you${name ? `|${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` : ''}`
  return (
    call.tool === 'Bash' &&
    !/\bbin\/(?:helpers|admin|secret|release)\b/.test(String(call.command ?? '')) &&
    new RegExp(String.raw`^\s*(?:wait|watch|poll)(?:ing)?\s+(?:for|until|on)\s+(?:(?:${them})\b(?!')|(?:your|(?:${them})'s)\s+(?:answer|reply|response|press|go-ahead|yes|try|decision|word)s?(?=\s*(?:$|[(.,;:]|(?:to|on|about|before)\b)))`, 'i').test(String(call.description ?? ''))
  )
}
const asksNow = (list: Todo[], agent: string) => {
  const top = topOf(list, agent)
  return list.some(one => (one.id === agent || one.id === top) && Boolean(one.ask) && !one.ask?.replied)
}
const NO_PERSON_WAIT = (name: string) =>
  `Not run: this command waits for ${name}, and a wait with a time limit gives them one. Don't wait for ${name} with a command at all. End your step now: your question stays on the card for as long as it takes, and ${name}'s answer starts you again the moment they give it. Anything you need to see of what they did (a recording, a file, a page), look at once their answer has come.`
const NO_PROGRESS_WAIT =
  'Not run: this wait would print nothing to show how it is going. Make it print a plain line at each try and at least every 10 seconds, such as `n=$((n+1)); echo "progress: $n/40 tries waiting for the deploy"` inside its loop, then start it again.'
const NO_PROGRESS_SCRIPT =
  'Not run: this long command would print nothing to show how far it has got. Make its script print, flushed right away, a plain line `progress: <done>/<total> <unit> <what>` at each step and at least every 10 seconds, such as `print(f"progress: {i}/{n} scans sorting", flush=True)` in Python or `echo "progress: $i/$n scans sorting"` in a shell, with no paths, file names or codes in it, then start it again.'
const NO_OWN_WAIT = (what: string) =>
  `Not run: this only waits for your own command "${what}" to end, and you are woken the moment it ends, so carry on with what needs nothing from it or end your step now.`
const NO_FOLLOW =
  'Not run: this only follows a log and would never end, so read the log once when you need it (tail -n 20); you are woken the moment your command ends.'
const MOVED_BACK = (name: string) =>
  `Claudopus started this command in the background instead of holding it open, because it may run for minutes. ${name}'s replies reach you while it runs. Claudopus will tell you when it ends; its output is in the file named above. Continue with what needs nothing from it, or end your step. Never wait for ${name}'s own answer with a command: it comes to you as a message.`

// The files a command runs, as filesRun finds them, each read (the first megabyte): the mod's own runners (bin/admin, bin/secret,
// bin/release, bin/keyring) are let through unread
const scriptsRun = async ($: EngineInterface, command: string) => {
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const root = $.plugin.root
  const texts: string[] = []
  for (const path of filesRun(command, home, cwd || home)) {
    const runner = /\/bin\/(admin|secret|release|keyring)$/.exec(path)?.[1]
    if (runner && (path === `${root}/bin/${runner}` || new RegExp(`^${home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.claude/plugins/cache/claudopus/claudopus/[^/]+/bin/(?:admin|secret|release|keyring)$`).test(path))) continue
    const text = (await readOr($, path)).slice(0, 1_000_000)
    if (runner && text && text === (await readOr($, `${root}/bin/${runner}`))) continue
    if (text) texts.push(text)
  }
  return texts
}
// A command, or a script it runs, that would print a kept key or password: read as written and with its quotes taken out
const readsKept = async ($: EngineInterface, command: string) =>
  [command, unquoted(command)].some(one => KEYCHAIN_READ.test(one)) || (await scriptsRun($, command)).some(text => KEYCHAIN_READ.test(text) || KEYCHAIN_READ.test(unquoted(text)))
// A tool call that writes a file of the memory folder only the mod writes (refused outright), or the person's own settings and texts
// by a command (refused: work changes those with Edit or Write, which wait for the person's press)
const writesOwnFiles = async ($: EngineInterface, e: { tool: string }): Promise<string> => {
  if (!dir) return ''
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown }
  if (e.tool === 'Bash') {
    // The command as written and unquoted, and each script it runs
    const command = String(input.command ?? '')
    const texts = [command, ...(await scriptsRun($, command))].flatMap(one => [one, unquoted(one)])
    if (texts.some(one => writesMemory(one, MEMORY_OWN))) return NO_MEMORY
    if (texts.some(one => writesMemory(one, MEMORY_PERSON))) return NO_MEMORY_BASH()
    return ''
  }
  if (!['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const path = pathOf(String(input.file_path ?? input.notebook_path ?? ''), home, cwd || home).toLowerCase()
  const memory = dir.toLowerCase()
  return MEMORY_OWN.some(name => path === `${memory}/${name}` || path.startsWith(`${memory}/${name}/`)) ? NO_MEMORY : ''
}

// bin/keyring and its store, the runners' alone: on a Mac a way into the keychain, on Linux files that hold every kept password and
// key, the boxes' answers and the admin gate's key. A command that names the keyring runner or the store's folder (bin/keyring,
// keyring/…, "keyring"), and any tool that reads, searches or writes a path in that folder, or searches a folder of yours it is in,
// is refused. Commands that only name the word, such as `pip install keyring`, are refused with it. This stops slips and common
// tricks, as the boxes' guard does; it is no wall
const KEYRING_WORD = /(?:^|[\s'"=/;&|(`$])keyring(?:$|[\s'"/;&|)`])/i
const KEYRING_PATH = /claudopus\/keyring(?:\/|\b)|\.local\/share\/claudopus\b/i
const touchesKeyring = (e: { tool: string }) => {
  const input = e as { command?: unknown; file_path?: unknown; notebook_path?: unknown; path?: unknown; pattern?: unknown; glob?: unknown }
  if (e.tool === 'Bash') {
    const command = String(input.command ?? '')
    // git and gh alone may name the word, so a commit message or a pull request can; never the store's folder
    return KEYRING_PATH.test(command) || (KEYRING_WORD.test(command) && !/^\s*(?:git|gh)\s[^;&|`$<>]*$/.test(command))
  }
  if (!['Read', 'Grep', 'Glob', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) return false
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const roots = [keyringRoot, keyringOldRoot, `${home}/.local/share/claudopus/keyring`].filter(Boolean).map(one => one.toLowerCase())
  const isSearch = e.tool === 'Grep' || e.tool === 'Glob'
  if (isSearch && [input.pattern, input.glob].some(one => typeof one === 'string' && KEYRING_WORD.test(` ${one} `))) return true
  return [input.file_path, input.notebook_path, input.path, input.pattern, input.glob].some(one => {
    if (typeof one !== 'string' || !one) return false
    if (KEYRING_PATH.test(one)) return true
    const path = pathOf(one, home, cwd || home).toLowerCase().replace(/\/+$/, '')
    // A search from a folder of yours above the store reaches into it (ripgrep passes over hidden folders only from above your home)
    return roots.some(root => path === root || path.startsWith(`${root}/`) || (isSearch && path.length > home.length && root.startsWith(`${path}/`)))
  })
}

// The rules every piece of work a chat starts is handed after its brief, as they stand now: where the chat's words are, the work's
// own rules, and its panel's
const workRules = async ($: EngineInterface) => {
  const work = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/work.md')).text, models)).replace(/\{admin\}/g, `${$.plugin.root}/bin/admin`).replace(/\{secret\}/g, `${$.plugin.root}/bin/secret`).replace(/\{release\}/g, `${$.plugin.root}/bin/release`).trim()
  const words = `- The chat's saved words, ${who()}'s messages word for word: ${dir}/words/${(await read($, me)).id}.md`
  return `${workHead()}\n${words}\n${work}\n\n${named(PANEL_RULE)}`
}
// Work its rules no longer reach is handed them again at its next step: work started before they changed, and work whose context
// was compacted, which keeps only a summary of its brief (on 15 Nov work compacted after two hours kept "long ones detached with
// nohup" and lost the rest, then started 8 drawings at once on this Mac that its card never showed)
const rulesAgain = async ($: EngineInterface, agent: string) => {
  const card = (await read($, todos)).find(one => one.id === agent)
  if (!card || card.parentId || !(await read($, me)).isChat) return ''
  const rules = await workRules($)
  if (!card.rulesDue && card.rulesSent === hashOf(rules)) return ''
  await changeTodos($, list => list.map(one => (one.id === agent ? { ...one, rulesSent: hashOf(rules), rulesDue: undefined } : one)))
  await log($, `work ${agent} handed its rules again${card.rulesDue ? ' after a compaction' : ' as they changed'}`)
  return `${card.rulesDue ? 'Your context was compacted, and the rules you were handed at the start are no longer in it.' : 'The rules every task follows have changed since you started.'} These are the rules now; they replace any earlier copy.\n\n${rules}`
}

const workHooks = (on: On) => {

  // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
  on('tool.call', async ($, e, raw) => {
    // A prompt the call raised goes as the call ends: refused, interrupted, or allowed and run
    const run = async (call: typeof e) => {
      // What work runs, and what comes back of it, tells the stuck check whether it moves
      const isWatched = e.agentId !== undefined && Boolean(dir)
      if (isWatched) await callBegun($, e.tool_use_id, e.agentId ?? '', e.tool, e as never).catch(err => log($, `call not followed: ${String(err)}`))
      if (isWatched) callStarted(e.tool_use_id, await $.clock.now())
      let r: Awaited<ReturnType<typeof raw>> | undefined
      // The person's own files are compared with what they are known to hold as every call begins, and as a command ends: a change
      // is put back, and the work is told of what its command changed
      const isPersonWatched = e.tool === 'Bash' && Boolean(dir)
      const writes = FILE_TOOLS.includes(e.tool) ? personNamed(e) : ''
      if (dir) await personCheck($).catch(err => log($, `files not compared before a call: ${String(err)}`))
      const before = writes ? await personRead($, writes).catch(() => undefined) : undefined
      if (writes) personWriting.add(writes)
      let isPersonEnded = false
      try {
        r = await raw(call)
        if (isPersonWatched) {
          isPersonEnded = true
          const undone = await personCheck($, e).catch(() => [] as string[])
          if (undone.length && !r.deny) r = { ...r, context: [...(r.context ?? []), PERSON_UNDONE(undone)] } as typeof r
        }
        if (!r.deny) await personSeen($, e, before).catch(() => undefined)
        return r
      } finally {
        if (writes) personWriting.delete(writes)
        if (isPersonWatched && !isPersonEnded) await personCheck($, e).catch(() => undefined)
        if (isWatched) await callEnded($, e.tool_use_id, e.agentId ?? '', e.tool, r as never).catch(err => log($, `call end not followed: ${String(err)}`))
        asked = asked.filter(one => one.id !== e.tool_use_id)
        settle($, e.tool_use_id, e.agentId, e.tool, outcomeOf(r as never), e as never)
        // A grant its admin command did not take goes with the call; one sent to the background takes its own in its own time
        if (grants.length && !(call as { run_in_background?: unknown }).run_in_background) await dropGrants($, grants).catch(() => undefined)
        runnerEnded(e.tool_use_id, Boolean((call as { run_in_background?: unknown }).run_in_background), await $.clock.now())
        // A note of what the person allowed for this call goes as it ends
        await noteCallEnded($, e.tool_use_id).catch(() => undefined)
      }
    }
    let grants: string[] = []
    if (await isBoxesTouched($, e)) {
      await log($, `refused ${e.tool} touching the password and key boxes`)
      return { deny: NO_BOXES }
    }
    if ((e.tool === 'Bash' && (await readsKept($, String((e as { command?: unknown }).command ?? '')))) || touchesKeyring(e)) {
      await log($, 'refused a command that reads the keychain')
      return { deny: NO_READ }
    }
    // An ask for a key the list of keys has is told where that key is
    const keyKept = await keyAsked($, e).catch(() => '')
    if (keyKept) {
      await log($, `refused an ask for a key the list of keys has (${e.tool})`)
      return { deny: keyKept }
    }
    const ownFiles = await writesOwnFiles($, e)
    if (ownFiles) {
      await log($, `refused ${e.tool} writing the memory folder's own files`)
      return { deny: ownFiles }
    }
    // (only while it, or the work it helps, has a question of its own open to the person: a wait said for them then is that)
    if (dir && !isOff && e.agentId !== undefined && isPersonWait(e as never, who()) && asksNow(await read($, todos), e.agentId)) {
      await log($, `refused work ${e.agentId}'s wait for the person: ${oneLine(String((e as { description?: unknown }).description ?? '')).slice(0, 80)}`)
      return { deny: NO_PERSON_WAIT(who()) }
    }
    // A run of its own ending wakes the work (the engine tells it of a background command, the mod of one left detached), so a
    // command that only waits for one to end is not started: it would hold the next step back until its loop came round
    if (dir && !isOff && e.agentId !== undefined && (e.tool === 'Bash' || e.tool === 'Monitor')) {
      const command = String((e as { command?: unknown }).command ?? '')
      const card = (await read($, todos)).find(one => one.id === e.agentId)
      const waited = ownWaitOf(command, ownRunsOf(card))
      if (waited) {
        await log($, `refused work ${e.agentId}'s wait on its own run ${waited.id}`)
        return { deny: NO_OWN_WAIT(runWords(waited.what, waited.cmd)) }
      }
      // A tail that follows a log never ends of itself and tells the work nothing as it runs: it only outlives what it watches
      // (a Monitor watch is told each line as it comes, so it says something; a Bash call's output is read only as it ends)
      if (e.tool === 'Bash' && watcherOf(command)?.isFollow && !/\|\s*(?:\S*\/)?(?:grep|egrep|ugrep|rg)\b[^|]*\s-(?:\w*[mq]\w*)\b|\|\s*sed\b[^|]*\/q\b/.test(command)) {
        await log($, `refused work ${e.agentId}'s command that only follows a log`)
        return { deny: NO_FOLLOW }
      }
      noteKills(card, command)
    }
    // Every run says how it goes at least every 10 seconds: a long wait or script of the work's own that would say nothing is not
    // started, and the work is told in one sentence how to make it report
    if (dir && !isOff && e.agentId !== undefined && e.tool === 'Bash') {
      const command = String((e as { command?: unknown }).command ?? '')
      const silent = reportsOf(command, String((e as { description?: unknown }).description ?? ''), Boolean((e as { run_in_background?: unknown }).run_in_background), await scriptsRun($, command), Number((e as { timeout?: unknown }).timeout ?? 0))
      if (silent) {
        await log($, `refused work ${e.agentId}'s ${silent === 'wait' ? 'wait' : 'long script'} that gives no progress`)
        return { deny: silent === 'wait' ? NO_PROGRESS_WAIT : NO_PROGRESS_SCRIPT }
      }
    }
    // Main is reached only through the release runner, which takes its turn, so two pieces of work never release at once
    if (e.tool === 'Bash' && pushesMain(String((e as { command?: unknown }).command ?? ''))) {
      await log($, 'refused a command that pushes or merges to main itself')
      return { deny: `${NO_PUSH} It is ${$.plugin.root}/bin/release.` }
    }
    // The list of admin commands always allowed, and what seals it, are the person's alone
    if (touchesGate(e) || (e.tool === 'Bash' && (await scriptsRun($, String((e as { command?: unknown }).command ?? ''))).some(text => touchesGate({ ...e, command: text } as never)))) {
      await log($, `refused ${e.tool} on the admin gate's own files`)
      return { deny: NO_GATE_TOUCH() }
    }
    if (e.tool === 'Bash' && [String((e as { command?: unknown }).command ?? ''), ...(await scriptsRun($, String((e as { command?: unknown }).command ?? '')))].some(movesRunner)) {
      await log($, `refused ${e.tool} running a runner of the mod with another home or without Claude Code's mark`)
      return { deny: NO_RUNNER_MOVED }
    }
    // An admin command waits for the person's press on its card, unless they chose never to be asked; a release always does, and so
    // does a change to the person's own settings and texts. Never for a call the chat's own thread is refused below: nothing is asked
    // or granted for a call that does not run
    const isRefusedHere = e.agentId === undefined && !isOff && Boolean(dir) && (await read($, me)).isChat && !OWN.includes(e.tool) && !OWN_SERVERS.some(prefix => e.tool.startsWith(prefix)) && !READS.includes(e.tool)
    if (e.tool === 'Bash' && !isRefusedHere) {
      const gated = await gateAdmin($, e, raw as never)
      // A call refused after a press (another of its commands denied, a grant not sealed) ends here: its note goes with it
      if (gated.deny) return (await callRefused($, e.tool_use_id), await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: gated.deny })
      grants = gated.grants
      const released = await gateRelease($, e, raw as never)
      if (released.deny) {
        await dropGrants($, grants)
        await callRefused($, e.tool_use_id)
        await noteCallEnded($, e.tool_use_id).catch(() => undefined)
        return { deny: released.deny }
      }
      grants = [...grants, ...released.grants]
      // A command that runs a runner may ask for a password or key in a box: the box is drawn only while one runs
      if ([String((e as { command?: unknown }).command ?? ''), ...(await scriptsRun($, String((e as { command?: unknown }).command ?? '')))].some(text => /\bbin\/(?:admin|secret)\b/.test(text))) runnerBegun(e.tool_use_id, String((e as { command?: unknown }).command ?? ''), await $.clock.now())
    }
    if (!isRefusedHere) {
      const fileSaid = await gateOwnFile($, e, raw as never)
      if (fileSaid) return (await dropGrants($, grants), await callRefused($, e.tool_use_id), await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: fileSaid })
    }
    // Work sent a message works again once the message is on its way: what it reported before no longer makes a stop a finish
    let woken = ''
    const next = async (asked: typeof e) => {
      const isMovedBack = Boolean(dir) && !isOff && e.agentId !== undefined && isLongHeld(asked as never)
      const call = isMovedBack ? ({ ...asked, run_in_background: true } as typeof e) : asked
      if (isMovedBack) await log($, `work ${e.agentId}'s long command started in the background: ${oneLine(String((asked as { description?: unknown }).description ?? '')).slice(0, 80)}`)
      // A piece of work's command is known by the process numbers handed out while it runs, so what it leaves going is found
      const isSpanned = Boolean(dir) && !isOff && e.agentId !== undefined && call.tool === 'Bash'
      const spanAt = isSpanned ? await $.clock.now() : 0
      const from = isSpanned ? await pidNow($) : 0
      if (from) openCalls.set(String(call.tool_use_id ?? ''), { from, at: spanAt })
      const r = await run(call).finally(() => openCalls.delete(String(call.tool_use_id ?? '')))
      if (woken && !r.deny && !r.isError) await changeTodos($, list => list.map(one => (one.id === woken && one.answeredAt ? { ...one, answeredAt: undefined } : one)))
      // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
      if (woken && !r.deny && !r.isError) await wakeCard($, woken)
      if (dir && e.agentId !== undefined && !r.deny && !r.isError) await keepBackground($, e.agentId, call as never, r.result).catch(err => log($, `background work not followed: ${String(err)}`))
      if (dir && e.agentId !== undefined && !r.deny && !r.isError && !(call as { run_in_background?: unknown }).run_in_background) await keepDetached($, e.agentId, call as never, r.result).catch(err => log($, `detached work not followed: ${String(err)}`))
      // (one that failed may still have left something going)
      if (from && e.agentId !== undefined && !r.deny) await keepSpan($, e.agentId, call as never, from, spanAt, r.result).catch(err => log($, `left runs not looked for: ${String(err)}`))
      await keysLearn($, call, r).catch(err => log($, `keys not made again: ${String(err)}`))
      const shown = await hideKept($, call, r)
      return isMovedBack && !shown.deny && !shown.isError ? ({ ...shown, context: [...((shown as { context?: string[] }).context ?? []), MOVED_BACK(who())] } as typeof shown) : shown
    }
    // Work the person stopped is not set going again, by the chat or by the work above a helper of it: no message to it, no resume,
    // no fresh agent for the same task, until their next message
    if (dir && !isOff && (e.tool === 'SendMessage' || e.tool === 'Agent')) {
      const call = e as unknown as { to?: unknown; resume?: unknown; description?: unknown; prompt?: unknown; subagent_type?: unknown }
      const resume = e.tool === 'SendMessage' ? String(call.to ?? '') : String(call.resume ?? '')
      const held = heldFor(await read($, todos), e.agentId ?? '', resume, String(call.description ?? ''), String(call.prompt ?? ''))
      if (held) {
        await log($, `refused ${e.tool} that would set going again ${held.id}, which the person stopped`)
        return { deny: named(STOPPED_REFUSED(titleOf(held))) }
      }
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
    let isWhole = false
    if (dir && e.tool === 'SendMessage') {
      const to = String((e as { to?: unknown }).to ?? '')
      message = String((e as { message?: unknown }).message ?? '')
      const theirs = e.agentId === undefined ? heard.findLast(one => carries(message, one)) : undefined
      words = theirs ? quoted(theirs, 600) : ''
      // Their words and nothing more: else only the words quoted are told as theirs, and the rest as the chat's
      isWhole = Boolean(theirs) && isTheirsWhole(message, theirs ?? '')
      const now = await $.clock.now()
      const list = await read($, todos)
      const target = to ? (list.find(one => one.id === to) ?? list.find(one => to.startsWith(one.id))) : undefined
      // The chat passing on an answer the person gave on the card, which reached the work from there already, sends nothing: a
      // second copy started work that had ended again, with nothing to do but say it was done
      const given = target && e.agentId === undefined ? sentReplies.get(target.id) : undefined
      // Only the very words given on the card, to work that has asked nothing since: words for a newer question still go
      const isRepeat = Boolean(given?.isCard && (given.to === 'work' || given.to === 'read') && now - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text))
      if (given && target && isRepeat && !(target.ask && target.ask.at > given.at)) {
        await log($, `refused a second copy of an answer to ${target.id}`)
        return { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }
      }
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
                  ? 'the task that started you'
                  : `the task${title(sender)}`
        }
        await changeTodos($, list =>
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
        await changeTodos($, list =>
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
      if (words && !sent.deny && !sent.isError) await replyWaiting($, steered)
      // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
      // message of its own instead, read once it reaches it
      // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
      // chat's own note that landed after the person's words once marked their words as not theirs
      const line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole))
      if (!sent.deny) void tell($, steered, line).then(r => (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line }).catch(err => log($, `work ${steered} not told: ${String(err)}`)) : undefined))
      return sent
    }
    // A report handed back is kept as the turn's answer only once the handback went through: refused, the work carries on
    if (e.agentId !== undefined && String(e.tool) === 'SubagentHandback') {
      const hold = await holdAtStop($, e.agentId, 'handback').catch(() => '')
      if (hold) return { deny: hold }
      const r = await next(e)
      if (!r.deny && !r.isError) handedBack.set(e.agentId, String((e as { message?: unknown }).message ?? '').trim())
      return r
    }
    // No agent, the chat's or a work's helper, is started on an older model or on Haiku: one named so starts on its family's newest
    // (Haiku's is Sonnet), by its alias, which the Agent tool takes
    const askedModel = !isOff && e.tool === 'Agent' && (e as { subagent_type?: unknown }).subagent_type !== 'fork' ? String((e as { model?: unknown }).model ?? '') : ''
    const better = askedModel ? rightModel(askedModel) : undefined
    if (better) {
      const alias = (modelName(better).split(' ')[0] ?? '').toLowerCase()
      await log($, `an Agent call on ${modelName(askedModel)} starts on ${modelName(better)}`)
      return next({ ...e, model: alias } as typeof e)
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
        await stopHelpers($, stopId)
        await dropBackground($, [stopId], 'stopped')
        const now = await $.clock.now()
        await changeTodos($, list => list.map(one => (one.id === stopId && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now) : one.id === stopId && one.leftSince ? { ...one, leftSince: undefined } : one)))
        await keepStoppedReports($, now)
        await lookEnds($)
      }
      return r
    }
    if (OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return next(e)
    // The chat reads for itself: a kept report to answer from, or the few files a question needs. A saved paste stays out of it:
    // the agent that needs it reads it
    const readPath = String((e as { file_path?: unknown; path?: unknown }).file_path ?? (e as { path?: unknown }).path ?? '')
    const isPaste = Boolean(dir) && (readPath === `${dir}/pastes` || readPath.startsWith(`${dir}/pastes/`))
    if (READS.includes(e.tool) && !isPaste) return next(e)
    await log($, `refused ${e.tool} in a chat's own thread`)
    if (grants.length) await dropGrants($, grants).catch(() => undefined)

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
    if (id !== undefined) (replyRead($, id), await replyTaken($, id).catch(() => undefined))
    // Work that takes a step again after its report is working again: stopped from now, it is stopped
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.answeredAt)) await changeTodos($, list => list.map(one => (one.id === id ? { ...one, answeredAt: undefined } : one)))
    const chosen = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id)?.chosen : undefined
    // A step the app sends to an older model or to Haiku after its safeguards flag a message is not moved back past the flag: the
    // work is ended there with a report that says so (FLAGGED), so its parent starts what is left again on a current model. An agent
    // that started on an older model or on Haiku itself (its own kind's model, or an alias the settings point at an older version)
    // has its steps go to that family's newest, or to the model the person picked. An agent whose start the mod did not see is left
    // where the app sent it, and its card says so
    // What it started on and whether it was flagged, kept in its card too so a reload of the mod forgets neither
    const card = id !== undefined && dir ? (await read($, todos)).find(one => one.id === id) : undefined
    const own = id !== undefined ? (startedOn.get(id) ?? card?.startedOn) : undefined
    const isOwnOlder = id !== undefined && !flaggedOnce.has(id) && !card?.flagged && own !== undefined && Boolean(rightModel(own)) && modelName(own) === modelName(e.model)
    const isMovedByApp = id !== undefined && !isOff && Boolean(rightModel(e.model)) && !isOwnOlder
    if (isMovedByApp && own !== undefined && id !== undefined) {
      const n = (flaggedSteps.get(id) ?? 0) + 1
      flaggedSteps.set(id, n)
      flaggedOnce.add(id)
      if (n === 1) await log($, `work ${id} was flagged and the app would send it to ${modelName(e.model)}: it is ended with a report instead`)
      if (dir) {
        await changeTodos($, list => list.map(one => (one.id === id ? { ...one, flagged: modelName(e.model), moved: undefined } : one)))
        await stopHelpers($, id).catch(() => undefined)
      }
      // Its report goes back through the handback tool; where that does not end it, a plain last answer, and past a few the work is
      // stopped as a press on Stop would
      if (n > 3) void $.tool.call({ tool: 'TaskStop', task_id: id }).catch(() => undefined)
      const text = FLAGGED(e.model)
      if (n === 1) {
        const call = `toolu_flagged_${id}`
        yield { kind: 'tool', index: 0, id: call, name: 'SubagentHandback' }
        yield { kind: 'input', index: 0, json: JSON.stringify({ message: text }) }
        yield { kind: 'stop', stopReason: 'tool_use', usage: null }
        return { turnId: e.turnId, index: e.index, answer: '', toolUses: [{ name: 'SubagentHandback', input: { message: text } }], stopReason: 'tool_use', usage: null }
      }
      yield { kind: 'text', index: 0, text }
      yield { kind: 'stop', stopReason: 'end_turn', usage: null }
      return { turnId: e.turnId, index: e.index, answer: text, toolUses: [], stopReason: 'end_turn', usage: null }
    }
    const instead = id !== undefined && !isOff && !isMovedByApp && !chosen ? rightModel(e.model) : undefined
    if (id !== undefined && (isMovedByApp || instead) && !sentElsewhere.has(`${id} ${e.model}`)) {
      sentElsewhere.add(`${id} ${e.model}`)
      await log($, `work ${id} was sent to ${modelName(e.model)} by the app: ${instead ? `its steps go to ${modelName(instead)}` : 'its steps stay there'}`)
    }
    // The card says so only while it holds: not once the app sends its steps to a right model again
    const moved = isMovedByApp ? modelName(e.model) : undefined
    if (id !== undefined && dir && (await read($, todos)).some(one => one.id === id && one.moved !== moved)) await changeTodos($, list => list.map(one => (one.id === id ? { ...one, moved } : one)))
    // A pick the engine has since passed is its family's newest
    const pick = chosen ? (rightModel(chosen) ?? chosen) : undefined
    const to = pick && !isMovedByApp && modelName(pick) !== modelName(e.model) ? pick : instead
    const r = yield* next(to ? { ...e, model: to } : e)
    const tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0
    const model = (r.usage as { model?: string } | undefined)?.model
    if (model) seeModel(model)
    if (id !== undefined && tokens && flowAgents.has(id)) await flowStep($, id, tokens, model).catch(() => undefined)
    if (id !== undefined && tokens && dir) await changeTodos($, list => list.map(one => (one.id === id ? { ...one, tokens, model: one.chosen ?? (modelName(model ?? '') ? model : one.model) } : one)))

    return r
  })

  // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
  on('classic.SubagentStop', async ($, e, next) => {
    const r = await next(e)
    const hold = r.block ? '' : await holdAtStop($, e.agent_id, 'stop').catch(() => '')
    if (hold) return { ...r, block: hold }
    const live = e.background_tasks
    if (dir && Array.isArray(live)) {
      const ids = new Set(live.map(one => one.id))
      const gone = ((await read($, todos)).find(one => one.id === e.agent_id)?.bg ?? []).filter(b => !ids.has(b.id)).map(b => b.id)
      if (gone.length) await dropBackground($, gone).catch(err => log($, `ended background work not let go: ${String(err)}`))
    }
    return r
  })

  on('agent.spawn', async ($, asked, next) => {
    agentStarted($, asked.tool_use_id)
    // Nothing starts again work the person stopped, whoever asks: the chat, a work, or the mod's own wakes and carrying on
    if (dir && !isOff && !asked.workflow) {
      const held = heldFor(await read($, todos), asked.parentAgentId ?? helperCalls.get(asked.tool_use_id) ?? '', asked.resume?.agentId ?? '', asked.description ?? '', asked.resume ? '' : (asked.prompt ?? ''))
      if (held) {
        await log($, `refused to start again ${held.id}, which the person stopped`)
        return { deny: named(STOPPED_REFUSED(titleOf(held))) }
      }
    }
    // Every agent starts on a current model: one named an older model or Haiku on its family's newest, a copy of an agent on an
    // older model not at all, and one left to its parent's model, when that is older, on that family's newest. A check of what was
    // built, by a helper or a workflow's agent, runs on a model never weaker than its parent's, and at least on Opus
    const start = isOff || asked.resume ? undefined : startModel(asked)
    if (start?.deny) {
      await log($, `refused a copy of an agent on ${modelName(String(asked.parentModel ?? ''))}`)
      return { deny: start.deny }
    }
    if (start?.model) await log($, `${asked.workflow ? 'a workflow agent' : 'an agent'} asked to run on ${modelName(asked.model ?? '') || `its parent's ${modelName(String(asked.parentModel ?? '')) || 'model'}`} starts on ${modelName(start.model)}`)
    const e = start?.model ? { ...asked, model: start.model } : asked
    // An agent a workflow's script starts belongs to its run's blue card, not a card of its own
    if (e.workflow) {
      const r = await next(e)
      if (r.model) seeModel(r.model)
      if (r.agentId && r.model && !e.resume) startedOn.set(r.agentId, r.model)
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
    const rules = isTold ? await workRules($) : ''
    const isBackground = isHelperSpawn(e)
    const r = await next(isTold ? { ...e, prompt: `${e.prompt}\n\n${rules}` } : isBackground ? { ...e, background: true } : e)
    if (isBackground && r.agentId) await log($, `helper ${r.agentId} of ${e.parentAgentId} runs in the background`)
    if (r.model) seeModel(r.model)
    // A resumed agent keeps the model it first started on, or none: the model it resumes on may be one the app moved it to after a flag. A
    // flagged one goes on to its next report afresh
    if (r.agentId && r.model && !e.resume) startedOn.set(r.agentId, r.model)
    if (r.agentId && e.resume) flaggedSteps.delete(r.agentId)
    if (!dir || !r.agentId) return r
    const id = r.agentId
    endedByHandback.delete(id)
    const now = await $.clock.now()
    // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
    // several, or one on something else, only reads them
    const named1 = isOwn && !fromReport && !e.resume ? (await read($, reports)).filter(one => e.prompt.includes(`reports/${one.id}/`) || e.prompt.endsWith(`reports/${one.id}`)) : []
    const goesOn = named1.length === 1 && named1[0] && [...aboutWords(named1[0].title)].some(word => aboutWords(e.description ?? '').has(word)) ? named1[0].id : ''
    const from = fromReport || goesOn
    await changeTodos($, list => {
      const old = list.find(one => one.id === id)
      // Its title is the few words the task was given; under it, the person's message as they wrote it
      const fresh = { ...started(id, parentId, e.description ?? '', isOwn ? said : '', now, e.fork), ...(isOwn && from ? { from } : {}) }
      return capped([...list.filter(one => one.id !== id), { ...(old ? resumed(old, now) : fresh), model: old?.chosen ?? r.model, startedOn: old?.startedOn ?? (e.resume ? undefined : r.model), ...(rules ? { rulesSent: hashOf(rules) } : {}) }])
    })
    if (isOwn) await openList($)
    if (!isOwn) await writeRolls($, true).catch(err => log($, `helpers not written: ${String(err)}`))
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

  // A box the person moves the focus into holds the panel's drawing, so nothing is drawn under them as they start typing; the focus
  // moved by them anywhere else, or out of the pane, lets it go
  on('ui.focus', async ($, e, next) => {
    // The bar holds its drawing for as long as its reply box has the cursor (band.tsx), however the cursor came there: by the
    // person's click in the box, as the box takes it when they click into the bar (autoFocus), or by the mod's own call
    const isInBarBox = e.plugin === 'claudopus' && isBarBox(e.element)
    if (isInBarBox) barBoxAt = await $.clock.now()
    if (e.origin.kind === 'person' && (e.plugin === 'claudopus' || e.plugin === undefined)) {
      // A press begins with the focus moving onto the button: from then the panel holds still for it (engage)
      if (e.plugin === 'claudopus') await engage($)
      // A button the person put the focus on holds the panel's drawing until it is pressed (PRESS_HOLD)
      if (e.plugin === 'claudopus' && isTypedBox(e.element)) holdTimes($)
      else freeTimes($)
      // after the let-go above, whose own drawing would end the hold
      if (e.plugin === 'claudopus' && e.requestId === LIST && listSurface === 'desktop' && !isTypedBox(e.element)) await holdForPress($)
      else pressFrom = 0
      if (!isInBarBox) barBoxAt = 0
    }
    return next(e)
  })
  // The person scrolling the panel or a Details tab is using it: what moves on its own waits (engage)
  on('ui.scroll', async ($, e, next) => {
    if (e.origin.kind === 'person' && (e.requestId === LIST || e.requestId.startsWith(WORK_PANE) || e.requestId.startsWith(FLOW_PANE))) await engage($)
    // Every move is let through as it comes. The app's own moves back to a box that holds the cursor in a pane arrive here as the
    // person's, already drawn: refusing them only undid each one a moment later, a bounce worse than the pull (0.2.135, taken out).
    // The reply box is drawn in the bar above the prompt instead, where there is nothing to pull (asking.tsx, repliesInBar)
    return next(e)
  }).catch(($, e, next) => next(e))
  // A pick of the person's in the mod's panes is their own move, as a press is (tabHooks): the drawing is let go before it acts
  on('ui.select', { plugin: 'claudopus' }, async ($, e, next) => (freeTimes($), next(e)))
  // Closed by the person's own hand, it closes in every chat and stays closed until asked for; a close of the mod's own is no choice
  on('ui.close', async ($, e, next) => {
    const r = await next(e)
    // The list closed, by anyone: nothing of where it stood is kept, so the line above the prompt no longer points into it
    if (e.id === LIST) (listOffsets.clear(), drawAgain($))
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
    if (!input.name?.trim()) return { result: 'A topic needs a name.' }
    const saved = await saveStream($, input.name, { repo: input.repo, state: input.state?.slice(0, 60), summary: input.summary })
    // The subject a piece of work recorded names the subject of its report
    if (e.agentId !== undefined) await change($, e.agentId, one => ({ ...one, subject: saved.name }))
    const path = `${dir}/streams/${slug(saved.name)}.md`
    if (input.brief?.trim()) await $.fs.write(`${dir}/streams/${slug(saved.name)}.md`, `${input.brief.trim()}\n`)

    return { result: `- ${[saved.name, saved.repo, saved.session, saved.state, saved.summary].join(' | ')}\nNotes: ${path}${input.brief?.trim() ? ' (rewritten)' : ''}` }
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
    if (e.agentId === undefined) return { result: "Only a background task has a to-do in the panel; the chat has none." }
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
    if (e.agentId === undefined) return { result: "Only a background task leaves a result; the chat has none." }
    // A helper's answer is no report: the work it answers to records what waits
    if ((await read($, todos)).find(one => one.id === e.agentId)?.parentId) return { result: 'A helper records nothing here: say what waits in your answer, and the task that started you records it.' }
    const items = [...new Set((Array.isArray(input.items) ? input.items : []).filter((one): one is string => typeof one === 'string').map(one => cut(oneLine(one), 200)).filter(Boolean))].slice(0, 12)
    await change($, e.agentId, one => ({ ...one, waits: items.length ? items : undefined }))
    return { result: items.length ? `Recorded ${items.length} waiting on ${who()}; the panel shows them with your result.` : `Nothing waits on ${who()}.` }
  })

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until they answer or the work clears it
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; details?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown; pictures?: unknown }
    if (e.agentId === undefined) return { result: `Only a background task asks through the panel; the chat asks ${who()} in its reply.` }
    // The question is one line; what it is about goes with it, whole, so the person never answers an ask whose reason has not reached
    // them yet (a report reaches the chat only after the work ends). A question too long for one line is cut at a word on the card and
    // kept whole at the top of its details
    const asked = oneLine(typeof input.text === 'string' ? input.text : '')
    const text = asked.length > ASK_TEXT ? cut(asked, ASK_TEXT) : asked
    const given1 = (typeof input.details === 'string' ? input.details : '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
    const whole = [text === asked ? '' : asked, given1].filter(Boolean).join('\n\n')
    const details = whole.length > ASK_DETAILS ? cut(whole, ASK_DETAILS) : whole
    // An ask that points at an explanation it does not carry is not shown: the person would see it before that explanation reaches them
    if (!given1 && POINTS_AWAY.test(asked)) return { result: `Not shown: the question points at an explanation it doesn't carry, and ${who()} sees a question before your report, which reaches them only after you finish. Ask it again with that explanation, in full, in \`details\`.` }
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
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(details ? { details } : {}), ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices, from: e.agentId } : {}), ...(pictures.length ? { pictures } : {}), at } : undefined }))
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, e.agentId ?? ''))
    if (!text) {
      if (card && was) await askGone($, card)
      return { result: 'Cleared: your card no longer has a question.' }
    }
    // The same ask said again is not told again
    if (card && was?.text !== text) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
    if (card) await askInChat($, card)
    // A command for the person opens in a terminal only on their press of the card's button: nothing opens by itself
    const terminal = command ? (isRunFromAfar ? ` ${who(true)} is on another device: they type it in their own session to this Mac, and nothing opens a terminal here.` : isLinux ? ` Do not open a terminal for it: on Linux the card gives it with a Copy button, and ${who()} runs it in a terminal of their own.` : ` Do not open a terminal for it: the card's Open in Terminal button opens one with the command typed when ${who()} presses it.`) : ''
    const shown = [command ? `the whole command${command === given0 ? '' : ` (${command})`}, a Copy button${isRunFromAfar ? '' : ' and an Open in Terminal button'}` : copy ? 'a Copy button for the text' : '', `the buttons ${(choices.length ? choices : DEFAULT_ANSWERS).join(', ')} and a box for a reply in their own words`].filter(Boolean).join(' and ')
    const lost = givenPics.length - pictures.length
    // An ask that points at an explanation it does not carry: the person sees the ask before the work's report, so it is said back
    const long = text === asked ? '' : ` The question was longer than one line: the card shows it cut at a word, and it is whole at the top of its details.`
    const tooLong = whole.length > ASK_DETAILS ? ` Its details were longer than ${ASK_DETAILS} letters and were cut at a word: put what matters first.` : ''
    // A go-ahead asked with nothing to decide it on: said back, since ${who()} sees the ask before the report
    const bare = choices.length && !details && !copy ? ` It carries no details: if deciding it needs more than this one line (what goes out, what it changes), ask it again with that in \`details\`; ${who()} sees the ask before your report.` : ''
    const seen = pictures.length ? ` Its ${pictures.length === 1 ? 'picture is' : `${pictures.length} pictures are`} drawn small on the card, each opening large on a press, and the chat shows ${pictures.length === 1 ? 'it' : 'them'} in its next reply.` : ''
    const missing = lost ? ` ${lost} of the pictures given ${lost === 1 ? 'is' : 'are'} no picture file found here, by full path, and ${lost === 1 ? 'was' : 'were'} left out.` : ''
    return { result: `Shown on your card with ${details ? 'what it is about under it, ' : ''}${shown}, and shown in the chat as a notice from the panel${details ? ' with what it is about' : ''}, where ${who()} can answer it too.${seen}${missing}${long}${tooLong}${bare} It stays until ${who()} answers, even after you finish; an answer comes back to you as a message the moment it is given, and starts you again if you have finished. Never wait for it with a command or a timer: with nothing else to do, end your step. Ask again if the answer leaves something waiting. Clear it with empty text only once you have seen it done.${terminal}` }
  })

  // The work writes its own log, on purpose, in plain words: what it starts and what it decides
  on('tool.call', { tool: 'mcp__claudopus__note' }, async ($, e) => {
    const input = e as unknown as { text?: string; decision?: boolean; task?: string }
    const text = oneLine(input.text ?? '').slice(0, NOTE_CHARS)
    if (!text) return { result: 'A note needs its text.' }
    if (e.agentId === undefined) return { result: "Only a background task keeps a log in the panel; the chat has none." }
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
    const handed = `A message from ${who()} to the task "${card?.title || 'in the background'}" is a new task of its own, not part of that task, and that task hasn't done it. Start it as its own background task: ${task}${words ? `\n${who(true)}'s words: “${words}”` : ''}`

    return { result: `Noted. Hand the task to the chat now: call SendMessage (load it with ToolSearch if needed) with to "main" and this message, exactly:\n${handed}\nThen continue your own task; don't do that new one here.` }
  })

}

// How Claude uses this computer, for the line above the prompt: looked at every few seconds while work runs, shared by every chat
// through one small file, so a computer with many chats open still looks once. The measuring and the drawings are in hooks/usage.ts

let usageKept: UsageKept | undefined
let usageBusy = false
// When this chat last tried a look, whether or not it gave figures: a look that fails waits as long as one that works
let usageTriedAt = 0
// When this chat last asked top, whether or not the look came back: top costs half a second of the processor
let usageTopTriedAt = 0
let usageFile = ''
// The shared file, in the person's own temporary folder (on Linux, their cache folder: /tmp is everyone's)
const usagePathOf = async ($: EngineInterface) => {
  if (usageFile) return usageFile
  const tmp = isLinux ? '' : ((await $.env.get('TMPDIR')) ?? '').replace(/\/+$/, '')
  const home = (await $.env.get('HOME')) ?? ''
  usageFile = tmp ? `${tmp}/claudopus-usage.json` : `${home}/.cache/claudopus-usage.json`
  return usageFile
}

// One look when the last is due: a fresh one another chat left is taken as it is, and a chat that is looking says so first in a
// small file beside it, so chats that fall due together look once
const lookUsage = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const isFresh = (at: number) => now >= at && now - at < USAGE_EVERY - 500
  if (usageBusy || isFresh(usageTriedAt) || (usageKept && isFresh(usageKept.at))) return
  usageBusy = true
  usageTriedAt = now
  try {
    const path = await usagePathOf($)
    const shared = keptOf(await $.fs.read(path).catch(() => ''))
    if (shared && isFresh(shared.at)) return void (await keepUsage($, shared))
    const taking = Number(await $.fs.read(`${path}.taking`).catch(() => '0'))
    if (taking && now >= taking && now - taking < USAGE_EVERY / 2) return
    await $.fs.write(`${path}.taking`, String(now)).catch(() => undefined)
    const base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept
    // top, the costly part, at most once a minute, answered or not
    const topAt = Math.max(base?.topAt ?? 0, usageTopTriedAt)
    const isTop = !isLinux && (!topAt || now < topAt || now - topAt >= FOOTPRINT_EVERY)
    if (isTop) usageTopTriedAt = now
    const r = await $.process.run(['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: 5000 }).catch(() => undefined)
    const kept = r?.stdout ? nextKept(base, r.stdout, now, isLinux, isTop) : undefined
    if (!kept) return
    await keepUsage($, kept)
    await $.fs.write(path, JSON.stringify(kept)).catch(() => undefined)
  } finally {
    usageBusy = false
  }
}
// New figures are kept, and the band that shows them redraws
const keepUsage = async ($: EngineInterface, kept: UsageKept) => {
  const isNew = kept.at !== usageKept?.at
  usageKept = kept
  if (isNew) await update($, figuresAt, () => kept.at)
}
// The figures to show, when a look has been had lately
const usageNow = (now: number) => (usageKept && now - usageKept.at < USAGE_EVERY * 6 ? usageKept.figures : undefined)

// What each figure says in words, for a reader that cannot see the drawings
const usageWords = (f: UsageFigures) => ({
  memory: `Memory: ${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB in use, Claude ${gbText(f.memClaude)} GB`,
  cpu: f.cpu === undefined ? '' : `Processor: ${pctText(f.cpu)}% busy, Claude ${pctText(f.cpuClaude ?? 0)}% of the whole`,
  disk: f.disk === undefined ? '' : `Disk: ${rateText(f.disk).join(' ')} read and written`,
  net: f.net === undefined ? '' : `Network: ${rateText(f.net).join(' ')} in and out`,
  gpu: f.gpu === undefined ? '' : `Graphics processor: ${pctText(f.gpu)}% busy${f.gpuClaude !== undefined ? `, Claude ${pctText(f.gpuClaude)}% of the whole` : ''}`,
  battery: f.battery ? `Battery: ${f.battery.pct}%, ${batteryWords(f.battery)}` : '',
})
// Each takes the battery as the bar shows it, so a charge the system calls full or empty has no time beside it
const batteryWords = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery' ? (b.left ? `${leftText(b.left)} left` : 'on battery') : b.state === 'charging' ? (b.left ? `charging, ${leftText(b.left)} to full` : b.finishing ? 'finishing charge' : 'charging') : b.state === 'plugged' ? 'on power' : 'its state not said'
// What follows the charge: the time left, the time to full, "finishing" once the system calls it full and still tops it up, or
// nothing on power and while the system still estimates
const batteryAfter = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'plugged' || b.state === 'unknown' ? '' : b.left ? ` ${leftText(b.left)}${b.state === 'charging' ? ' to full' : ' left'}` : b.state === 'charging' && b.finishing && b.pct >= 100 ? ' finishing' : ''

// The battery's state in full, for the line of more: a time only where the bar shows one, and what the system said in its place
const batteryNote = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'battery'
    ? b.left ? `on battery, ${leftText(b.left)} left as the system estimates it` : read.left ? 'on battery, at 0% as the system gives it' : 'on battery, the system is still estimating the time left'
    : b.state === 'charging'
      ? b.left ? `charging, ${leftText(b.left)} to full` : b.pct >= 100 ? (b.finishing ? 'finishing the charge: the system calls it full and still tops it up' : 'charging: the system calls it full') : 'charging, the time to full still being estimated'
      : b.state === 'unknown' ? 'the system does not say whether it charges' : b.pct >= 100 ? 'fully charged, on power' : 'on power, not charging'

// More of each figure, for a pointer resting on it: a heading with the figure in full, then rows of a name and its value (Claude's
// part, the parts of a speed, who uses the most), and for the battery its state in words. Only what the looks gave: a part that is
// not known is left out
type UsageCard = { title: string; value: string; note?: string; rows: [string, string][]; most?: [string, string][] }
const usageCards = (f: UsageFigures): Record<string, UsageCard | undefined> => {
  const most = (top: UsageTop | undefined, text: (n: number) => string) => (top?.length ? top.map(([name, n]): [string, string] => [name, text(n)]) : undefined)
  const b = f.battery
  return {
    memory: { title: 'Memory', value: `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB`, rows: [['Claude and what it started', `${gbText(f.memClaude)} GB`]], most: most(f.memTop, n => `${gbText(n)} GB`) },
    cpu: f.cpu === undefined ? undefined : {
      title: 'Processor',
      value: `${pctText(f.cpu)}% busy`,
      rows: [...(f.ncpu && f.ncpu > 1 ? [['Cores', `${f.ncpu}`] as [string, string]] : []), ['Claude and what it started', `${pctText(f.cpuClaude ?? 0)}%`]],
      most: most(f.cpuTop, n => `${pctText(n)}%`),
    },
    // Busy is time at work at any speed, so a busy graphics processor can draw little; drawing the screen is macOS's own
    // (WindowServer), for every app's window, Claude's too, so it is no one's part. The card is its rows alone, with no words under
    // them on what they cover
    gpu: f.gpu === undefined ? undefined : {
      title: 'Graphics processor',
      value: `${pctText(f.gpu)}% busy`,
      rows: [
        ...(f.gpuClaude !== undefined ? [['Claude and what it started', `${pctText(f.gpuClaude)}%`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Drawing', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.gpuMem !== undefined ? [['Graphics memory in use', f.gpuMemTotal ? `${gbText(f.gpuMem)} of ${gbText(f.gpuMemTotal)} GB` : `${gbText(f.gpuMem)} GB`] as [string, string]] : []),
      ],
      most: most(f.gpuTop?.map(([name, n]): [string, number] => [name === 'WindowServer' ? 'macOS drawing the screen' : name, n]), n => `${pctText(n)}%`),
    },
    battery: !b ? undefined : {
      title: 'Battery',
      value: `${batteryShown(b).pct}%`,
      note: upperFirst(batteryNote(b)),
      // The strain on it: what the whole Mac draws, the processors and the graphics processor each, and Claude's part of each. The
      // Mac counts each process's own processor energy, not its graphics power: Claude's graphics is its share of the graphics
      // processor's time times what that draws, and says it is estimated. The screen, memory and storage are no one's part
      rows: [
        ...(f.watts !== undefined ? [['The whole Mac draws', `${wattText(f.watts)} W`] as [string, string]] : []),
        ...(f.wattsCpu !== undefined ? [['Processors, every program', `${wattText(f.wattsCpu)} W`] as [string, string]] : []),
        ...(f.wattsClaude !== undefined ? [["Claude's own processes", `${wattText(f.wattsClaude)} W`] as [string, string]] : []),
        ...(f.wattsGpu !== undefined ? [['Graphics, every program', `${wattText(f.wattsGpu)} W`] as [string, string]] : []),
        ...(f.wattsGpuClaude !== undefined ? [['Claude of that, estimated', `${wattText(f.wattsGpuClaude)} W`] as [string, string]] : []),
      ],
    },
    disk: f.disk === undefined ? undefined : {
      title: 'Disk, read and write',
      value: rateText(f.disk).join(' '),
      rows: f.diskClaude !== undefined ? [['Claude and what it runs', rateFine(Math.min(f.diskClaude, f.disk))]] : [],
    },
    net: f.net === undefined ? undefined : {
      title: 'Network',
      value: rateText(f.net).join(' '),
      rows: [
        ...(f.netIn !== undefined && f.netOut !== undefined ? [['Download', rateFine(f.netIn)], ['Upload', rateFine(f.netOut)]] as [string, string][] : []),
        // Claude's own, never past the Mac's: nettop counts every interface, tunnels and loopback too, where the totals count the Mac's ports
        ...(f.netInClaude !== undefined && f.netOutClaude !== undefined ? [['Claude downloading', rateFine(f.netIn !== undefined ? Math.min(f.netInClaude, f.netIn) : f.netInClaude)], ['Claude uploading', rateFine(f.netOut !== undefined ? Math.min(f.netOutClaude, f.netOut) : f.netOutClaude)]] as [string, string][] : []),
      ],
    },
  }
}
// A speed in a card, where there is room for small ones: KB/s below a megabyte a second, so an API's trickle does not read 0
const rateFine = (perSecond: number) => (perSecond < 1024 * 1024 ? `${Math.round(perSecond / 1024)} KB/s` : rateText(perSecond).join(' '))
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
// Watts, whole from ten up, a tenth below
const wattText = (w: number) => (w >= 10 ? `${Math.round(w)}` : `${Math.round(w * 10) / 10}`)
// A figure's card: one Box placed absolutely and drawn hidden inside the figure's keyed Box, which the desktop app lifts over the
// chat as its own floating card above the figure, kept in the window and shifted sideways at its edges, so showing it moves nothing
// in the chat or the bar (in the bar's column it took room: the chat was pushed up and sprang back, and a tall card hid the figures).
// What it says is shown by the figure's hover group, which the pointer lights and puts out at once, so as the pointer goes on to
// the next figure this card's words are gone before the next card shows, though the app keeps the lifted card itself a moment for
// a pointer on its way into it
const usageCardDrawn = (ui: Ui, key: string, card: UsageCard) => {
  const { Box, Text } = ui
  const row = (name: string, value: string, n: number, kind: string) => (
    <Box key={`${key}-${kind}-${n}`} flexDirection="row" justifyContent="space-between" gap={3}>
      <Text dimColor wrap="truncate-end">{name}</Text>
      <Text wrap="truncate-end">{value}</Text>
    </Box>
  )
  return (
    // No key and no hover group of its own: the app lifts only a hidden absolute Box shown by the hover of its keyed Box
    <Box position="absolute" top={-1} left={0} display="none" hover={{ display: 'flex' }} flexDirection="column">
      <Box key={`${key}-card`} display="none" hover={{ scope: key, display: 'flex' }} flexDirection="column" gap={1}>
        <Box key={`${key}-card-head`} flexDirection="row" justifyContent="space-between" gap={3}>
          <Text bold>{card.title}</Text>
          <Text bold>{card.value}</Text>
        </Box>
        {card.note ? <Text key={`${key}-card-note`} dimColor>{card.note}</Text> : null}
        {card.rows.length ? <Box key={`${key}-card-rows`} flexDirection="column">{card.rows.map(([name, value], n) => row(name, value, n, 'row'))}</Box> : null}
        {card.most?.length ? (
          <Box key={`${key}-card-most`} flexDirection="column">
            <Text dimColor>Using the most</Text>
            {card.most.map(([name, value], n) => row(name, value, n, 'most'))}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

// The desktop app draws the bar anew whenever anything in it changes (new figures, the work under it, the octopus), and shows again
// each lifted card whose figure's place (its count among the keyed Boxes drawn) held a card that was up as the old drawing went: so
// a card the pointer had just left stayed up with nothing under the pointer to put it away, and one shown again before its words
// were lit was placed too low, over the figures. A run of hidden keyed Boxes before the figures, there in every other drawing, moves every figure past the places the last drawing had, more than all the keyed Boxes of the figures and
// their cards, so no card is shown again but the one under the pointer, which the app measures whole
const USAGE_SPACERS = 120
let usageSpaced = false
const usageSpacersDrawn = (ui: Ui) => {
  const { Box, Text } = ui
  usageSpaced = !usageSpaced
  return usageSpaced ? (
    <Box display="none">
      {Array.from({ length: USAGE_SPACERS }, (_, n) => (
        <Box key={`usage-spacer-${n}`}>
          <Text> </Text>
        </Box>
      ))}
    </Box>
  ) : null
}

// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network. The pointer resting on a figure lights its group: a faint fill under it, and its card above
const usageDrawn = (ui: Ui, f: UsageFigures) => {
  const table = ui as Ui & { Svg?: (props: { key?: string; source: string; alt: string; width?: number; height?: number }) => JSX.Element }
  const { Box, Text } = ui
  if (!table.Svg) return null
  const Svg = table.Svg
  const isHigh = isMemoryHigh(f)
  const words = usageWords(f)
  const cards = usageCards(f)
  const one = (key: string, card: UsageCard | undefined, svg: { source: string; width: number; height: number }, alt: string, value: string, unit: string, color?: string) => (
    // A member of a group must change how it looks, or the desktop app never wires it to the pointer: hence the fill
    <Box key={`usage-${key}`} flexDirection="row" flexShrink={0} alignItems="center" hover={{ scope: `usage-${key}`, backgroundColor: FILL }}>
      <Svg key={`usage-${key}-${svg.source.length}-${hashOf(svg.source)}`} source={svg.source} alt={alt} width={svg.width} height={svg.height} />
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
      {card ? usageCardDrawn(ui, `usage-${key}`, card) : null}
    </Box>
  )
  return [
    one('memory', cards.memory, usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
    f.cpu === undefined ? null : one('cpu', cards.cpu, usageSvg('cpu', { claude: f.cpuClaude ?? 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
    f.gpu === undefined ? null : one('gpu', cards.gpu, usageSvg('gpu', { claude: f.gpuClaude ?? 0, used: f.gpu }), words.gpu, pctText(f.gpu), '%'),
    f.battery ? one('battery', cards.battery, batterySvg(f.battery), words.battery, `${f.battery.pct}`, `%${batteryAfter(f.battery)}`, isBatteryLow(f.battery) ? USAGE_AMBER : undefined) : null,
    f.disk === undefined ? null : one('disk', cards.disk, usageSvg('disk'), words.disk, rateText(f.disk)[0], ` ${rateText(f.disk)[1]}`),
    f.net === undefined ? null : one('net', cards.net, usageSvg('net'), words.net, rateText(f.net)[0], ` ${rateText(f.net)[1]}`),
  ]
}
// The line as text, for the terminal, in a phone's 50 columns with the octopus: a word for each, units cut to G and M/s, and three-cell meters with Claude's cells purple
const USAGE_CELLS = 3
// Given the room, a figure that does not fit is left out whole, never cut in the middle: the network first, then the disk, then the
// graphics processor, so memory, the processor and the battery stay
const usageText = (ui: Ui, f: UsageFigures, room = Infinity) => {
  const { Text } = ui
  const rate = (n: number) => rateText(n).join('').replace('B/s', '/s')
  const widths = {
    gpu: f.gpu === undefined ? 0 : ` gpu${'▱'.repeat(USAGE_CELLS)} ${pctText(f.gpu)}%`.length,
    disk: f.disk === undefined ? 0 : ` disk ${rate(f.disk)}`.length,
    net: f.net === undefined ? 0 : ` net ${rate(f.net)}`.length,
  }
  let width = `mem${'▱'.repeat(USAGE_CELLS)} ${gbText(f.memUsed)}G`.length + (f.cpu === undefined ? 0 : ` cpu${'▱'.repeat(USAGE_CELLS)} ${pctText(f.cpu)}%`.length) + (f.battery ? batteryAfterText(f.battery).length + ` bat ${f.battery.pct}%`.length : 0) + widths.gpu + widths.disk + widths.net
  const shown = { gpu: true, disk: true, net: true }
  for (const one of ['net', 'disk', 'gpu'] as const) if (width > room && widths[one]) (shown[one] = false), (width -= widths[one])
  const isHigh = isMemoryHigh(f)
  const meter = (claude: number, used: number, color?: string) => {
    const { mine, rest } = meterOf(claude, used, USAGE_CELLS)
    return [
      <Text key="mine" color={USAGE_PURPLE}>{'▰'.repeat(mine)}</Text>,
      <Text key="rest" color={color} dimColor={!color}>{'▰'.repeat(rest)}</Text>,
      <Text key="free" dimColor>{'▱'.repeat(USAGE_CELLS - mine - rest)}</Text>,
    ]
  }
  const amber = isHigh ? USAGE_AMBER : undefined
  return (
    <Text wrap="truncate-end">
      <Text color={amber} dimColor={!amber}>mem</Text>
      {meter(f.memClaude / f.memTotal, f.memUsed / f.memTotal, amber)}
      <Text color={amber}>{` ${gbText(f.memUsed)}`}</Text>
      <Text color={amber} dimColor={!amber}>G</Text>
      {f.cpu === undefined ? null : [<Text key="c" dimColor>{' cpu'}</Text>, ...meter(f.cpuClaude ?? 0, f.cpu), <Text key="cv">{` ${pctText(f.cpu)}`}</Text>, <Text key="cu" dimColor>%</Text>]}
      {f.gpu === undefined || !shown.gpu ? null : [<Text key="g" dimColor>{' gpu'}</Text>, ...meter(f.gpuClaude ?? 0, f.gpu), <Text key="gv">{` ${pctText(f.gpu)}`}</Text>, <Text key="gu" dimColor>%</Text>]}
      {f.battery ? batteryText(ui, f.battery) : null}
      {f.disk === undefined || !shown.disk ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1].replace('B/s', '/s')}</Text>]}
      {f.net === undefined || !shown.net ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1].replace('B/s', '/s')}</Text>]}
    </Text>
  )
}
// The battery in words, short: "bat 85% 4:12" on battery, "bat 62% ↑1:05" charging (↑ and the time to full), "bat 100% finishing"
// while the system calls it full and still tops it up, "bat 100% ac" on power
const batteryText = (ui: Ui, b: UsageBattery) => {
  const { Text } = ui
  const low = isBatteryLow(b) ? USAGE_AMBER : undefined
  const after = batteryAfterText(b)
  return [
    <Text key="b" color={low} dimColor={!low}>{' bat '}</Text>,
    <Text key="bv" color={low}>{`${b.pct}`}</Text>,
    <Text key="bu" color={low} dimColor={!low}>%</Text>,
    after ? <Text key="ba" color={b.state === 'charging' ? USAGE_PURPLE : low} dimColor={!low && b.state !== 'charging'}>{after}</Text> : null,
  ]
}
const batteryAfterText = (read: UsageBattery, b = batteryShown(read)) =>
  b.state === 'plugged' ? ' ac' : b.state === 'charging' ? (!b.left && b.finishing && b.pct >= 100 ? ' finishing' : ` ↑${b.left ? leftText(b.left) : ''}`) : b.left ? ` ${leftText(b.left)}` : ''
// A short mark of a drawing, so a new drawing is a new picture to the app
const hashOf = (text: string) => {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

// Above the prompt: the small octopus while work runs, and how Claude uses this computer

// The answer picked above the prompt by its number, and how long the pick waits for the same number again
let bandPick: { id: string; n: number } | undefined
const BAND_PICK = 6000
// Above the prompt, which never scrolls: once the list is scrolled away from its top, how many things wait there for the person.
// Pressed, it takes the list back to its top; nothing else moves the list
// Work that just finished, in its moment at the top, is pointed at the same way, in green, under what waits
const waitMarker = async ($: EngineInterface, ui: Ui, surface: string) =>
  (waitsAtTop > 0 || finishedAtTop.length > 0) && (listOffsets.get(surface) ?? 0) > 0 && (await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced) ? (
    <ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden">
      <ui.Button
        key={`band-waits-${presses}`}
        plain
        hover={{ scope: 'band-waits', underline: true }}
        onPress={() => ((presses += 1), void (recordEvent($, 'scroll-call', { to: 'start' }), $.ui.scroll({ in: LIST, to: 'start', block: 'start' })).catch(() => undefined))}
      >
        {waitsAtTop > 0 ? (
          <ui.Text color={NEEDS} bold wrap="truncate-end">{`↑ ${waitsAtTop === 1 ? '1 thing is' : `${waitsAtTop} things are`} waiting for you at the top of the panel${finishedAtTop.length ? ` · ${finishedAtTop.length} just finished` : ''}`}</ui.Text>
        ) : (
          <ui.Text color={DONE} bold wrap="truncate-end">{`↑ ${finishedAtTop.length === 1 ? `${finishedAtTop[0]} finished` : `${finishedAtTop.length} just finished`}, at the top of the panel`}</ui.Text>
        )}
      </ui.Button>
    </ui.Box>
  ) : null
// The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: one row, the work the reply goes
// to, the box, and Close, which takes the row away again with what was typed kept for its card. Nothing in the row follows the
// panel's scrolling. The box is the card's own: the same answer, and the same box through a new question of its work, until the
// person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
const barReply = ($: EngineInterface, ui: Ui, one: Todo) => {
  const draft = barDraft(one.id)
  return (
    <ui.Box key="band-reply" flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
      <ui.Box flexShrink={1} minWidth={0}>
        <ui.Text color={NEEDS} bold wrap="truncate-end">{`↳ Your reply to “${cut(titleOf(one), 40)}”`}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (
        <ui.Box flexShrink={0}>
          <ui.Input
            key={barBoxKey(one.id)}
            placeholder="Type your reply"
            value={draftDrawn(draft)}
            submitLabel="send"
            autoFocus
            onInput={value => void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($), $.clock.now().then(at => (barBoxAt = at)))}
            onSubmit={value => void ((barBoxAt = 0), dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), sendFromBar($, one.id, value).catch(err => log($, `reply not sent: ${String(err)}`)))}
          />
        </ui.Box>
      ) : null}
      <ui.Box flexShrink={0}>
        <ui.Button key={`band-reply-close-${presses}`} label="Close" onPress={press => openReply($, undefined, press.surface)} />
      </ui.Box>
    </ui.Box>
  )
}
// The bar as last drawn on each surface while a reply box was in it: while the person types, and for as long as the box holds the
// cursor (barBoxAt), it is drawn as it was, whole, but for a change in what it holds, as a pane is (heldDrawings): each drawing is
// a new box under the cursor, its ring drawn again and a selection or a half-composed letter lost
const barHeld = new Map<string, { shape: string; drawing: unknown }>()
// When this surface's bar last asked for the cards to be drawn again as its box came or went: at most once a second, so two
// windows of one chat that differ never ask in turn without end
let barFlipAt = 0
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
const BAND_TERM_MARK = 3
const bandHooks = (on: On) => {

  // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // Whether this surface's bar takes the reply box, and whether it shows just now: the cards draw their asks by it (repliesInBar)
    // While one of the app's surveys holds the bar the box has no place in it, and the card has its own again
    // Folded by the person, nothing of the bar is on screen: the card has its own box then too
    const canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed
    if (e.requestId) barIds.set(e.surface, e.requestId)
    const cards = await read($, todos)
    const flipAt = await $.clock.now()
    if (canBox !== barBoxes.has(e.surface)) {
      if (canBox) barBoxes.add(e.surface)
      else barBoxes.delete(e.surface)
      // A box open in a bar that can no longer show it is closed, and stays closed when the bar is back; what was half typed in
      // it is drawn in the card's own box, and nothing is held as typed in any more
      const open = canBox ? undefined : cards.find(one => one.id === replyTo)
      if (open) (carryDraft($, open, barDraft(open.id)), freeTimes($))
      if (!canBox) ((replyTo = ''), (replyMark = ''), barHeld.delete(e.surface))
      barBoxAt = 0
      // Only a card that asks is drawn differently for it
      if (asksForBar(cards).length && flipAt - barFlipAt >= 1000) ((barFlipAt = flipAt), drawAgain($))
    }
    if (e.props.hasSurvey) return next(e)
    const working = cards.filter(one => !one.parentId && one.status === 'working')
    // Work that just finished makes the octopus happy for its pause, the band staying that long even when nothing else runs;
    // the redraw set for the pause's end is read so the band leaves or goes back to work then
    const happy = isHappy(cards, await $.clock.now())
    if (happy) await read($, tick)
    const ui = uiOf($, e)
    const { Box, Button, Text } = ui

    // In the terminal the panel is out of the keys' reach until ctrl+x Tab, and a narrow one seats no panel until it is asked for:
    // there what needs the person is said here, this chat's own (another chat's ask is answered in its chat), under the name of the work that asks, whole, with its answers
    // numbered. A bare digit typed in an empty prompt presses a band's Button, so the person answers from where they already are.
    // A message may begin with a digit too, so one press only picks the answer and says so; the same digit again sends it
    if (e.surface === 'terminal') {
      // What waits on the person comes before an ask whose work is acting on their reply, which is drawn in the work's purple
      const asking = [...cards.filter(one => !one.parentId && one.ask)].sort((a, b) => Number(needsPerson(b)) - Number(needsPerson(a)))
      const [first] = asking
      const ask = first?.ask
      if (first && ask) {
        const answers = (ask.choices?.length ? ask.choices : DEFAULT_ANSWERS).slice(0, 9)
        const id = `${first.id}:${ask.at}`
        const picked = bandPick?.id === id ? bandPick.n : -1
        const press = (n: number, choice: string) => {
          if (picked === n) return (bandPick = undefined), void answerAsk($, first, choice).catch(err => log($, `answer not sent: ${String(err)}`))
          const pick = (bandPick = { id, n })
          ;(recordEvent($, 'redraw-band'), $.ui.invalidate('ui.render'))
          // Left alone, the pick is let go
          $.clock.after(BAND_PICK, () => void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))))
        }
        return (
          <Box flexDirection="column">
            {await waitMarker($, ui, e.surface)}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first) ? 'Claudopus, something needs you' : 'Claudopus is working on your reply', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{`${titleOf(first)}: `}</Text>
                  <Text color={needsPerson(first) ? NEEDS : LIVE} bold>{cut(oneLine(ask.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {/* Acted on after the person's reply in words: that reply, and nothing to press */}
            {isActingOnReply(first) ? (
              <Text key="band-ask-replied" dimColor wrap="truncate-end">{`    ${sentLine(first, await $.clock.now()) || `✓ You replied “${cut(ask.replied?.text ?? '', 60)}”`}`}</Text>
            ) : (
              <Box flexDirection="column">
                {/* The chat's notice with what it is about went only to the chat that started the work */}
                {ask.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first) ? '    The details are in the chat above and on its card' : '    The details are on its card'}</Text> : null}
                {ask.copy ? <Text key="band-ask-copy" wrap="truncate-end">{`    ${oneLine(ask.copy)}`}</Text> : null}
                <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                  {answers.map((choice, n) => (
                    <Button key={`band-ask-${first.id}-${ask.at}-${n}`} label={choice} plain hotkey={String(n + 1)} onPress={() => press(n, choice)} />
                  ))}
                  <Text dimColor={picked < 0} color={picked < 0 ? undefined : needsPerson(first) ? NEEDS : LIVE}>
                    {picked >= 0 ? `Press ${picked + 1} again to answer “${answers[picked] ?? ''}”` : `press its number twice in the empty prompt${asking.filter(needsPerson).length > Number(needsPerson(first)) ? ` · ${asking.filter(needsPerson).length - Number(needsPerson(first))} more waiting` : ''} · /claudopus to reply in words`}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        )
      }
    }
    // The reply box the person opened from a card, while that card still asks; its ask answered or gone, the box goes with it
    const target = canBox ? barTarget(cards) : undefined
    if (replyTo && canBox && !target) ((replyTo = ''), (replyMark = ''))
    if (target?.ask) {
      // Drawn as it was while the box is typed in or holds the cursor: only the card it is for draws it anew, so neither the panel
      // scrolled under the cursor nor work starting or ending puts a new box under it. The row takes the place of the figures
      // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
      const shape = barBoxKey(target.id)
      const held = barHeld.get(e.surface)
      if ((isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD)) && held?.shape === shape) return held.drawing as Awaited<ReturnType<typeof next>>
      // What waits at the top of a panel scrolled away is still pointed at, as the bar is drawn; not while the box is held
      const marker = await waitMarker($, ui, e.surface)
      const reply = barReply($, ui, target)
      const drawing = marker ? (
        <Box flexDirection="column">
          {marker}
          {reply}
        </Box>
      ) : (
        reply
      )
      barHeld.set(e.surface, { shape, drawing })
      return drawing
    }
    barHeld.delete(e.surface)
    if (!working.length && !happy) return (await waitMarker($, ui, e.surface)) ?? next(e)
    // A narrow terminal seats no panel until it is asked for: the band says how
    const isPanelAway = e.surface === 'terminal' && !(await $.ui.panes().catch(() => [])).some(pane => pane.id === LIST && pane.isPlaced)

    // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
    // network's speed, looked at every few seconds while work runs. New figures redraw it
    await read($, figuresAt)
    const figures = usageNow(await $.clock.now())
    if (!figures) void lookUsage($).catch(err => log($, `usage not looked at: ${String(err)}`))

    const marker = await waitMarker($, ui, e.surface)
    const drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null
    const drawing = (spacers: JSX.Element | null) => {
      const row = (
        <Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, task finished' : 'Claudopus, working', $, { surface: e.surface, requestId: e.requestId }) ?? <Text dimColor>•••</Text>}
          {spacers}
          {figures ? (drawn ?? <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
          {/* The figures fill a phone's terminal: the hint shows until they come */}
          {isPanelAway && !figures ? (
            <Box flexShrink={0}>
              <Text dimColor>· /claudopus shows the panel</Text>
            </Box>
          ) : null}
        </Box>
      )
      // Where the figures are drawn, a pointer resting on one shows its card floating over the chat above them, taking no room
      return marker ? (
        <Box flexDirection="column">
          {marker}
          {row}
        </Box>
      ) : (
        row
      )
    }
    // Where the app lifts the figures' cards, each drawing moves them past the places they had in the last
    return drawing(drawn ? usageSpacersDrawn(ui) : null)
  })

}

// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them

// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
// Handed to the press's own hook while one is answered (front), so a narrow terminal draws the panel opened again
const backToPanel = async ($: EngineInterface, id: string) => {
  if (tabMoves.isPressing()) return tabMoves.handOver({ kind: 'back', id })
  await backAsked($, id)
}
const backAsked = async ($: EngineInterface, id: string) => {
  await $.ui.close({ id }).catch(() => undefined)
  await $.ui.close({ id: LIST }).catch(() => undefined)
  await $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })
}
// The ask whose reply box holds the terminal's keys in the list: kept on it while it waits, so an ask that comes in above it never
// takes the keys from what the person is typing
let keysAsk = ''
// Where the list's window starts on each surface, as last drawn: above the prompt says what waits at the top once it is out of sight
// (waitMarker). Forgotten when the list is closed
const listOffsets = new Map<string, number>()
// How many things wait on the person at the top of the list, as last drawn
let waitsAtTop = 0
// The last drawing made of each pane on each surface, what a press under way keeps on screen (isPressHeld)
const lastShown = new Map<string, unknown>()
// The surface the list was last drawn on: the focus says none, and only the desktop's clicks are held for (isPressHeld)
let listSurface = ''
const panelHooks = (on: On) => {

  // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
  // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const id = e.requestId ?? ''
    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
    await noteTabAsked($, id)
    const isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(start => id.startsWith(start))
    if (e.surface !== 'terminal' || !isTab) return next(e)
    const { Box, Button, Text } = uiOf($, e)
    const body = await next({ ...e, props: { ...e.props, scroll: { ...e.props.scroll, bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) } } } as typeof e)
    return (
      <Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Close" plain hotkey="x" onPress={() => void backToPanel($, id).catch(err => log($, `not back to the panel: ${String(err)}`))} />
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={() => void openReports($).catch(err => log($, `reports not opened: ${String(err)}`))} /> : null}
          <Text dimColor wrap="truncate-end">{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x Tab for keys'}</Text>
        </Box>
        {body}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
  // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    const paneId = e.requestId ?? ''
    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE)) return next(e)
    if (paneId === LIST) ((listDrawing += 1), (listSurface = e.surface))
    try {
    // While the person types into a box the pane is drawn as it last was, whole, but for a change in its shape; not typing, as it last
    // was while only its running times moved, for CALM at most (heldDrawings)
    const heldKey = `${paneId}|${e.surface}|${e.props.placement ?? ''}|${e.props.scroll.bodyRows}|${(e.props as { bodyColumns?: number }).bodyColumns ?? ''}|${e.props.isFocused ? 1 : 0}|${e.props.scroll.offset > 0 ? 1 : 0}`
    const heldAt = await $.clock.now()
    if (paneId === LIST) drawnNow = heldAt
    const shape = await paneShape($, paneId)
    const content = await paneContent($)
    const held = heldDrawings.get(heldKey)
    // A press under way: the drawing on screen, the one last made for this pane on this surface, focused or not
    // (of this size and place: a pane resized or scrolled meanwhile is drawn afresh)
    const shownKey = heldKey.replace(/\|[01]\|([01])$/, '|$1')
    const shown = paneId === LIST && isPressHeld(heldAt) ? lastShown.get(shownKey) : undefined
    if (shown) return ((listHeldAt = heldAt), (isPressMissed = true), shown as Awaited<ReturnType<typeof next>>)
    if (held && held.shape === shape && (isTyping || (held.fresh === freshness && held.content === content && heldAt - held.at < CALM))) return ((paneId === LIST && (listHeldAt = heldAt)), held.drawing as Awaited<ReturnType<typeof next>>)
    if (paneId === LIST) drawnFiles.clear()
    // Read only for a drawing made afresh, so the running times alone ask for one again only once CALM is over (chatHooks)
    if (paneId === LIST) await read($, tick)
    const drawing = await (async () => {
    const { Box, Button, Markdown, Text } = uiOf($, e)
    // A picture pressed open large in this Details tab is drawn over it, with a row back above and below it
    const large = pictureIn.get(paneId)
    if (large) {
      const back = (key: string) => <Button key={`${key}-${presses}`} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={() => ((presses += 1), pictureBack($, paneId))} />
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
      $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1)))
    }
    const { isFinishedOpen = false } = await read($, view)
    // Work that ended while the list was held (an older drawing given again) was not seen ended: its moment at the top begins with
    // this drawing, the first to show it, never before
    if (paneId === LIST) {
      const from = await $.clock.now()
      for (const one of [...(await read($, flows)), ...(await read($, todos)).filter(card => !card.parentId)]) {
        const key = `${one.id}:${one.endedAt}`
        if (one.status !== 'working' && one.endedAt > listFreshAt && one.endedAt < listHeldAt && !lateFrom.has(key) && from - one.endedAt < RELOAD_GRACE * 2)
          (lateFrom.set(key, from), $.clock.after(LINGER + 20, () => void (drawAgain($), update($, tick, n => n + 1))))
      }
      listFreshAt = from
    }
    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
    // A card whose ask or gate was just pressed is drawn answered, from the press itself (asPressed)
    const all = (await read($, todos)).map(asPressed)
    const own = all.filter(one => !one.parentId)
    // The work of the other chats, by chat; an ask answered here leaves its card at once
    const otherChats = await read($, others)
    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
    for (const one of cardsOf(otherChats)) if (one.ask?.replied && actingOn.get(`${one.id}:${one.ask.at}`) === one.ask.replied.text) actingOn.delete(`${one.id}:${one.ask.at}`)
    const elsewhere = cardsOf(otherChats).map(one => (one.ask && answeredHere.has(`${one.id}:${one.ask.at}`) ? { ...one, ask: undefined } : one))
    // Their helpers, which only a Details tab lists
    const helpersThere = helpersOf(otherChats)
    const chat = await read($, me)
    const at = await $.clock.now()
    // Prompts answered here and in other chats, for a minute after their call ended
    const answeredOf = (list: Prompt[] | undefined) => (list ?? []).filter(p => !p.endedAt || at - p.endedAt < PROMPT_SHOWN)
    const promptsAnswered = answeredShown(at)
    const working = own.filter(one => one.status === 'working').sort((a, b) => a.startedAt - b.startedAt)
    // The running cards, with work that has just ended kept in its place for its pause; the header counts only work under way
    const shownWork = own.filter(one => one.status === 'working' || isLingering(one, at) || one.ask || one.admins?.length || one.leftSince || (one.cutAt && !one.backAt && at - one.cutAt < CUT_OLD))
    // A piece of work's context window is this chat's when it runs on this chat's model, as a copy of the chat always does.
    // On another model it is not known, and the card gives the tokens alone. The time comes last, so its ticking moves nothing else
    const ours = modelName(await $.session.model().catch(() => ''))
    const windowOf = (one: Todo) => (!one.chat && (one.isFork || (ours && modelName(one.model ?? '') === ours)) ? chat.window : 0)
    // Work that finished, in its moment: for its two seconds it is at the top under all that waits on the person, outlined green;
    // then it goes under Finished. Work stopped or stopped by an error is not: it pauses in its place, in its own look
    // In the few rows above the prompt a narrow terminal gives the panel, the outline would take two of them
    const isAbovePrompt = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    const isFinishMoment = (one: Todo) => one.status === 'done' && !one.ask && lingers(one, at)
    const isFlowMoment = (f: Flow) => f.status === 'done' && isLingering(f, at) && flowPassed(f, roundsOf(f)) !== false
    // Work under way says nothing of its state: the moving dots do
    const stood: Record<Todo['status'], string> = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'Failed with an error' }
    // Work the app sent to an older model says so, and which one; work that answers from one all the same says so
    const offModel = (one: Todo) => (one.flagged ? `ended after a safety flag, so it doesn't continue on ${one.flagged}` : one.moved ? `moved to ${one.moved} by the app` : rightModel(one.model ?? '') ? "Claudopus doesn't run tasks on this model" : '')
    const glance = (one: Todo, count = '') =>
      [one.ask && one.status === 'done' && !isActingOnReply(one) ? 'Waits for your answer' : one.status === 'stopped' && one.byYou ? 'Stopped by you' : stood[isActingOnReply(one) ? 'working' : one.status], modelName(one.model ?? ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ')
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
      const rest = [offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ')
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
    // While it works, a run of its own that ended after that line is said in its place, so a line written while the run went ("about
    // 40% done") never stands beside a row that has ended (16 Nov), until the work writes again; not while it asks the person something
    const now = (one: Todo) => {
      const entry = [...one.entries].reverse().find(one => one.kind !== 'steer')
      const runs = one.status === 'working' && !one.ask ? (one.endedRuns ?? []).filter(r => r.endedAt > (entry?.at ?? 0) && r.how !== 'timed out' && String(r.what ?? "").trim()) : []
      const run = runs.length === 1 ? runs[0] : undefined
      return run ? `${runWords(String(run.what))} ${RUN_ENDED_AS[run.how]}` : runs.length ? `${runs.length} runs have ended` : (entry?.text ?? '')
    }

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
          <table.Svg key={key} source={LIVE_DOTS} alt="Working now" width={22} height={LINE} isInteractive />
        </Box>
      ) : (
        (e.surface === 'terminal' ? termDots(table, $, paneId, key) : null) ?? <Text color={LIVE}>▸</Text>
      )

    // What a piece of work needs the person's hands for now, in its colour, with the exact text to copy beside one Copy button, then
    // the same three ways to answer on every ask, on the small card as in Details: the work's own buttons, or Done and Not now when
    // it gave none, and a box for a reply in the person's own words, which the desktop app has in the bar above the prompt and
    // not on the card (repliesInBar). The list's times stand still while the person types (holdTimes)
    // In the terminal the first ask's reply box holds the keys as the panel takes them: what is typed then is the person's words,
    // never a button's letter, and Tab leaves it for the buttons and their keys
    let askFocused = false
    // The small pictures every ask in this drawing draws, in characters: together they stay under ASK_PICS_CHARS, and in Details under
    // what the app draws in one tab beside the chat's own small pictures; one past that is a row that opens it
    let askChars = 0
    const askPictures = (one: Todo, key: string, isWhole: boolean) => {
      const paths = one.ask?.pictures ?? []
      if (!paths.length) return null
      // An ask of a chat on another Mac names that Mac's files, which are not here: a file at the same path here is another picture
      if (one.chat?.host) return <Text key={`${key}-pics`} dimColor wrap="wrap">{`Its ${paths.length === 1 ? 'picture is' : `${paths.length} pictures are`} on the Mac that chat runs on, and shown in that chat.`}</Text>
      const drawing = uiOf($, e)
      const canDraw = e.surface !== 'terminal' && 'Svg' in drawing
      // The terminal draws no picture: a row each that opens it, with no small copy made
      const made = canDraw ? askPicturesOf($, one) : paths.map(path => ({ name: fileName(path), path, thumb: null }) as Pic)
      if (!made) return <Text key={`${key}-pics`} dimColor>Making its pictures small…</Text>
      if (!made.length) return null
      // In Details the chat's own small pictures are drawn too: all of them together stay near what that tab keeps for pictures
      const chatChars = isWhole ? [...(shots.get(one.id)?.shots.values() ?? [])].flat().reduce((sum, pic) => sum + (pic.thumb?.source.length ?? 0), 0) : 0
      const most = isWhole ? Math.min(ASK_PICS_CHARS, PICTURES_CHARS + 30_000 - chatChars) : ASK_PICS_CHARS
      return (
        <Box key={`${key}-pics`} flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1} width="100%">
          {made.map((pic, n) => {
            const isDrawn = canDraw && pic.thumb !== null && askChars + pic.thumb.source.length <= most
            if (isDrawn && pic.thumb) askChars += pic.thumb.source.length
            const row = `${key}-pic-${n}`
            // Drawn at most ASK_PIC_WIDE across, from a copy up to twice as wide, so two sit side by side on a wide sidebar
            const size = pic.thumb && pic.thumb.width && pic.thumb.height ? sizedAskPic(pic.thumb.width, pic.thumb.height) : undefined
            return (
              <Box key={row} flexDirection="column" alignItems="flex-start" flexShrink={1} minWidth={0}>
                {isDrawn && pic.thumb && 'Svg' in drawing ? (
                  <drawing.Svg
                    key={`${row}-svg`}
                    source={pic.thumb.source}
                    alt={`Picture: ${pic.name}`}
                    {...(size ?? {})}
                  />
                ) : null}
                <Button
                  key={`${row}-open-${presses}`}
                  label={`⤢ ${isDrawn ? 'Open large' : 'Open'}: ${cut(pic.name, Math.max(12, room - 14))}`}
                  plain
                  onPress={press => ((presses += 1), redraw($), void showPicture($, pic.path, paneId, row, press.surface))}
                />
                {e.surface === 'terminal' ? pictureSaidRow($, drawing, `${row}-said`, pic.path) : null}
              </Box>
            )
          })}
        </Box>
      )
    }
    const askBlock = (one: Todo, key: string, isWhole = false) => {
      const ask = one.ask
      if (!ask) return null
      const answers = ask.choices?.length ? ask.choices : DEFAULT_ANSWERS
      const lost = sentLine(one, at)
      // Answered in the person's own words and acted on: its question, with their reply under it, and nothing to press or type
      if (isActingOnReply(one))
        return (
          <Box key={key} flexDirection="column" gap={1}>
            <Text wrap="wrap" color={LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
            {lost ? <Text key={`${key}-sent`} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
          </Box>
        )
      return (
        <Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={needsPerson(one) ? NEEDS : LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), `${key}-text`, ask.text)}</Text>
          {/* What the ask is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
          {ask.details ? (
            <Box key={`${key}-details`} flexDirection="column" minWidth={0}>
              <Markdown text={isWhole || ask.details.length <= DETAILS_ON_CARD ? ask.details : `${cut(ask.details, DETAILS_ON_CARD)}\n\nThe rest is in its Details.`} />
            </Box>
          ) : null}
          {/* The pictures it is about, each drawn small with a row that opens it large, so it is decided here */}
          {askPictures(one, key, isWhole)}
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
          {/* Another chat's ask is answered only in its own chat: no file carries an answer there */}
          {one.chat ? (
            <Text key={`${key}-elsewhere`} dimColor wrap="wrap">{`Answer it in its own chat, “${one.chat.title || 'another chat'}”${one.chat.host ? `, on ${one.chat.host}` : ''}.`}</Text>
          ) : null}
          {one.chat ? null : (
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map((choice, n) => (
              <Button key={`${key}-choice-${n}-${askMark(ask)}-${loadMark}`} label={choice} onPress={() => void ((presses += 1), answerAsk($, one, choice).catch(err => log($, `answer not sent: ${String(err)}`)))} />
            ))}
            {/* Where the bar above the prompt holds the reply box, the last answer opens it there for this card, and closes it again */}
            {'Input' in table && repliesInBar(e.surface) ? (
              isReplyOpen(one) ? (
                <Button key={`${key}-inbar-close-${presses}`} label="Close the reply box" onPress={press => openReply($, undefined, press.surface)} />
              ) : (
                <Button key={`${key}-inbar-${presses}`} label="Reply in your own words" onPress={press => openReply($, one, press.surface)} />
              )
            ) : null}
          </Box>
          )}
          {/* Where the bar above the prompt holds the reply box, the card has none: a box typed in here is what the app drags the
              panel to. Once opened it says where to type: the app puts the cursor there only on the person's own click */}
          {'Input' in table && !one.chat && repliesInBar(e.surface) ? (
            isReplyOpen(one) ? (
              <Text key={`${key}-inbar`} dimColor wrap="wrap">✎ Type it in the box above the chat</Text>
            ) : null
          ) : 'Input' in table && !one.chat ? (
            <Box width="100%" flexDirection="column">
              <table.Input
                key={`${key}-reply-${replies.get(one.id) ?? 0}-${askMark(ask)}`}
                autoFocus={e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : undefined}
                placeholder="Or reply in your own words"
                value={draftShown(one.id, ask)}
                submitLabel="send"
                onInput={value => void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($))}
                onSubmit={value => void (dropDrafts($, one.id), replies.set(one.id, (replies.get(one.id) ?? 0) + 1), freeTimes($), value.trim() ? answerAsk($, one, value, true).catch(err => log($, `reply not sent: ${String(err)}`)) : undefined)}
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
    // One row under the facts while the work runs: the to-do being done, or the next when none is, numbered done + 1 of all kept,
    // which is how far along it is (the edge's lighter part), not its place in the Details list
    const stepLine = (one: Todo, kept: Item[], done: number) => {
      if (one.status !== 'working' || one.chat) return null
      const doing = kept.find(item => item.state === 'doing')
      const named = doing ?? kept.find(item => item.state === 'open')
      if (!kept.length) return null
      // Every step ticked while it still runs: said in the same row, so the card keeps its height until it ends
      if (!named)
        return (
          <Box key={`step-${one.id}`} height={1} overflow="hidden" paddingLeft={lead}>
            <Text dimColor wrap="truncate-end">{`All ${kept.length} steps done`}</Text>
          </Box>
        )
      return (
        <Box key={`step-${one.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          <Box flexShrink={0}>
            <Text dimColor>{`${doing ? 'Step' : 'Next, step'} ${done + 1} of ${kept.length} ·`}</Text>
          </Box>
          <Box flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end" dimColor={!doing}>{named.text}</Text>
          </Box>
        </Box>
      )
    }
    const small = (one: Todo) => {
      // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
      // A card in its moment at the top is not numbered, so the others keep their numbers through it
      if (!isFinishMoment(one)) cardNo += 1
      const digit = keyed && cardNo <= 9 && !isFinishMoment(one) ? String(cardNo) : undefined
      const kept = one.items.filter(item => item.state !== 'dropped')
      const done = kept.filter(item => item.state === 'done').length
      const tree = treeUnder(one)
      const scope = `card-${one.id}`
      // Just finished, in its moment at the top: outlined in the green of what is done, as an allowed notice is
      const isMoment = isFinishMoment(one) && !isAbovePrompt
      return (
        <Box key={`todo-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isMoment ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
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
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead) */}
            {one.ask ? (
              <Box key={`ask-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {askBlock(one, `ask-${one.id}`)}
              </Box>
            ) : null}
            {one.admins?.length || cardNotesOf(one.id, at).length ? (
              <Box key={`gate-lead-${one.id}`} flexDirection="column" paddingLeft={lead}>
                {adminBlock($, table, one, `gates-${one.id}`, at)}
              </Box>
            ) : null}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (
              <Box key={`stuck-${one.id}`} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>
            ) : null}
            {/* Cut off as the chat's process ended: when, and since when it goes on again; amber when it could not be started again */}
            {cutLine(one) && !one.chat ? (
              <Box key={`cut-${one.id}`} paddingLeft={lead}>
                <Text color={one.backAt ? undefined : NEEDS} dimColor={Boolean(one.backAt)} wrap="wrap">{cutLine(one)}</Text>
              </Box>
            ) : null}
            {/* Still at work, waiting for a command of its own it started in the background: that it waits, the command itself
                being a row on its tree */}
            {waitLine(one, at) ? (
              <Box key={`wait-${one.id}`} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at, jobsOf(one, at).length > 0)}</Text>
              </Box>
            ) : null}
            {/* Its helpers gone quiet, in amber: those at work are rows on its tree */}
            {lookedInLine(one, at) && !one.chat ? (
              <Box key={`looked-${one.id}`} paddingLeft={lead}>
                <Text dimColor={!one.lookedIn?.quiet} color={one.lookedIn?.quiet ? NEEDS : undefined} wrap="wrap">{lookedInLine(one, at)}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live(`live-${one.id}`) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (
                  <Text wrap="truncate-end" color={one.status === 'done' ? DONE : one.status === 'failed' ? 'error' : undefined} dimColor={one.status !== 'done' && one.status !== 'failed'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? '✕ Failed with an error' : one.byYou ? 'Stopped by you' : 'Stopped'}
                  </Text>
                ) : (
                  <Box flexDirection="column" minWidth={0}>
                    <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || needsPerson(one)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : "Claude hasn't said what it's doing")}</Text>
                    {/* Held where it was after an answer, once a newer line of the work's took the answer's place: why it is still up there */}
                    {!one.ask && !sentLine(one, at) && heldAnswer(one, at) ? <Text key={`held-answer-${one.id}`} dimColor wrap="truncate-end">{`✓ You answered “${cut(heldAnswer(one, at)?.text ?? '', 60)}”`}</Text> : null}
                  </Box>
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
      // An error that stopped it is said in red, on its edge too
      if (one.status === 'failed') return <Box width={1} flexShrink={0} backgroundColor="error" />
      if (one.status !== 'working' && one.status !== 'done') return <Box width={1} flexShrink={0} />
      if (needsPerson(one) || one.status === 'done' || !count || e.surface === 'terminal') return <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : one.status === 'working' || isActingOnReply(one) ? LIVE : DONE} />
      const shade = (n: number) => (n < done ? LIVE : n === done && isDoing ? `${LIVE}AD` : `${LIVE}5C`)
      return count > EDGE_PARTS ? (
        <Box key={`edge-${one.id}`} width={1} flexShrink={0} flexDirection="column">
          {/* Too many to-dos for a part each: one bar in the same three shades, done, the one being done, and what is left */}
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE} /> : null}
          {isDoing && count > done ? <Box key="doing" flexGrow={1} backgroundColor={`${LIVE}AD`} /> : null}
          {count - done - (isDoing ? 1 : 0) > 0 ? <Box key="left" flexGrow={count - done - (isDoing ? 1 : 0)} backgroundColor={`${LIVE}5C`} /> : null}
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
            alt={status ? { working: 'Working', done: 'Finished', failed: 'Failed with an error', stopped: 'Stopped' }[status] : 'Ended'}
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
      // (a command it waits on has its own row under it instead)
      const busy = one.running?.cmd ? '' : [runningLine(one, at), runningLine(one, at).replace(/^.* running · /, 'running · ')].find(text => text && width - text.length >= 12)
      const side = busy ? busy : [[model, one.tokens ? thousands(one.tokens) : '', time], [model, time], [time]].map(parts => parts.filter(Boolean).join(' · ')).find(text => width - text.length >= 12) ?? time
      return twigRowOf(t, `${scope}-${one.id}`, cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, () => openWork($, one.id), one.status)
    }
    // In a small card: the helpers at work now or just ended, and any that one of those runs under; the rest are one closing
    // row, laid out as the others, that says how many have ended and opens the card's Details, where every helper is listed
    // A job on the tree: its line ends in a dot in the colour of its kind (green a server, blue a download, purple a script),
    // with a ring while it runs; then what it is, the latest line it wrote, dim, and its percent and time last
    const jobLines = (t: Twig, key: string, job: Job) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={twigSvg(t, LINE, JOB_COLOR[job.kind], !job.isPaused && job.kind !== 'wait' && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive />
        </Box>
      ) : (
        <Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
        </Box>
      )
    // Under its name, the tree's lines carried down past it, as wide as its own lines and mark, so its second line starts under its
    // name. The app drops a picture with no words for it, and the line then started at the card's edge, left of the tree
    const jobRails = (t: Twig, key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={railSvg(t, LINE)} alt={t.isLast ? 'Last row' : 'More rows below'} width={twigWidth(t)} height={LINE} />
        </Box>
      ) : (
        <Box key={key} flexShrink={0}>
          <Text dimColor>{`${t.rails.map(isOn => (isOn ? '│ ' : '  ')).join('')}${t.isLast ? '  ' : '│ '}   `}</Text>
        </Box>
      )
    // How it stands, its second line, so a glance tells whether it moves and how far it is: how much of how much, its percent,
    // speed and time left as the run printed them, or worked out from its percent where it says none; then paused, a wait's target,
    // a watch's last event, nothing printed since it began, or quiet for minutes (in amber). A run that prints says nothing of when:
    // its line is read every few seconds, so what it says is now
    // a run whose own progress line gives its percent but no time left has one worked out from how long it has run, marked as a
    // guess: only the work's own line, which counts the whole run (a tool's bar starts again at each epoch, package or phase),
    // only while that line is the latest, and never for a wait, whose count is how long it is willing to wait
    const guessLeft = (job: Job, ran: number) => {
      const share = Number.parseFloat(job.pct ?? '') / 100
      return !job.left && job.isOwn && !job.isEarlier && job.kind !== 'wait' && share >= 0.01 && share < 1 && ran >= 20_000 ? timeLeftText((ran / 1000) * ((1 - share) / share)) : undefined
    }
    // Its time, and how long it said it should take. Once past that, the figure it said no longer holds: where the run says how
    // long it has left as it prints now (or its percent gives one), the time so far and that left make a fresh expectation;
    // otherwise its row says plainly that it is past the time it was expected to take, in amber. Nothing is made up
    const jobTime = (job: Job, ran: number) => {
      if (!job.expectText || !job.expect) return { time: took(ran), isPast: false }
      if (ran <= job.expect) return { time: `${took(ran)} of ~${job.expectText}`, isPast: false }
      const isFresh = !job.isPaused && Boolean(job.wroteAt) && at - (job.wroteAt ?? 0) < 60_000
      // the time left is as of when it was printed, so it adds to the time it had run then
      const printedAt = Math.min(ran, Math.max(0, (job.wroteAt ?? 0) - job.at))
      const left = isFresh ? leftSeconds(job.left ?? guessLeft(job, printedAt)) : undefined
      const fresh = left ? timeLeftText(Math.max(ran / 1000, printedAt / 1000 + left))?.replace(/ left$/, '') : undefined
      return fresh ? { time: `${took(ran)} of ~${fresh}`, isPast: false } : { time: `${took(ran)} · past ~${job.expectText}`, isPast: true }
    }
    // Every run's second line has the one shape plainOf describes: how far, a few plain words, and its sign of life, which changes
    // as time goes so the line never stands still while the run goes on. Nothing raw is shown: a line that is not plain words is
    // left out, and a run that has given no word says so and for how long, in amber past a few minutes
    const jobStand = (job: Job, width: number) => {
      const pct = job.pct ? [job.pct] : []
      const quiet = job.wroteAt && !job.isEmpty ? at - job.wroteAt : undefined
      const ran = at - job.at
      // (to ten seconds past a minute, so the line moves at each drawing however long it has been)
      const ago = (ms: number) => {
        const all = Math.max(0, Math.floor(ms / 1000))
        return all < 60 || all >= 3600 ? shortAgo(ms) : `${Math.floor(all / 60)}m ${String(Math.floor((all % 60) / 10) * 10).padStart(2, '0')}s`
      }
      const [state, short, isWarn]: [string, string, boolean] =
        job.isPaused ? ['paused', 'paused', true]
        : job.target ? [job.target, job.target.replace(/^what it waits (?:for|on) (?:is|has) /, '').replace(/^not changed for /, 'still for '), true]
        // A server or a watch speaks only when there is something to say, so its quiet is no fault
        : job.kind === 'server' ? ['serving', 'serving', false]
        : job.kind === 'watch' ? ['watching', 'watching', false]
        // Any other run gives word at least every 10 seconds: past that it is silent, and from a minute that is a fault, in amber.
        // While it gives word nothing is said of when (a run is never to be anything but active)
        // (one whose output has not been read yet is not known to be silent until a minute has passed)
        : quiet === undefined && !job.isEmpty && ran < SILENT_WARN ? ['', '', false]
        : (quiet ?? ran) >= SILENT_AFTER ?[`nothing printed for ${ago(quiet ?? ran)}`, `nothing printed ${ago(quiet ?? ran)}`, (quiet ?? ran) >= SILENT_WARN]
        : ['', '', false]
      const warn = isWarn
      // its speed and time left only while it prints: a minute old, they are no longer how it goes
      const isFresh = quiet !== undefined && quiet < SILENT_AFTER
      const guess = guessLeft(job, ran)
      const left = isFresh ? (job.left ? [job.left] : guess ? [`~${guess}`] : []) : []
      const rate = job.rate && isFresh ? [job.rate] : []
      const full = job.done ? [job.total ? `${job.done} of ${job.total}` : job.done] : []
      const compact = job.done ? [job.total ? `${job.done}/${job.total}` : job.done] : []
      // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
      const bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? [`${job.done}/${job.total.split(' ')[0]}`] : compact
      // The memory it holds only where it is a gigabyte or more, said as memory, as it counts against what this Mac may hold; a few
      // megabytes say nothing to a person (16 Nov a row led with "35 MB"), and it goes first when the line has no room
      const mem = job.mem && /\b[GT]B\b/.test(job.mem) ? [`${job.mem} memory`] : []
      const far = firstFit([[...full, ...pct, ...rate, ...left, state, ...mem], [...full, ...pct, ...left, short, ...mem], [...compact, ...pct, ...left, short, ...mem], [...full, ...pct, ...rate, ...left, state], [...full, ...pct, ...rate, ...left, short], [...full, ...pct, ...left, short], [...compact, ...pct, ...left, short], ...(left.length ? [[...compact, ...left, short], [...compact, ...left], [...bare, ...left]] : []), [...compact, ...pct, short], [...compact, ...pct], [...bare, ...pct], [...pct, short], [short]], width)
      // Its own plain words go before its sign of life, cut to the room left; a watch's are its last event
      // (none once it has been quiet for minutes: they would be old news)
      const words = warn ? '' : plainOf(job.isOwn && !job.isEarlier ? job.words : job.latest, `${job.label} ${job.waitsFor ?? ''}`)
      const parts = far ? far.split(' · ') : []
      const end = state && (parts.at(-1) === state || parts.at(-1) === short) ? parts.length - 1 : parts.length
      const room = width - far.length - (far ? 3 : 0)
      const said = words && room >= 12 ? (words.length <= room ? words : `${words.slice(0, room - 1).replace(/\s+\S*$/, '')}…`) : ''
      const text = said ? [...parts.slice(0, end), said, ...parts.slice(end)].join(' · ') : far
      // A run that gives word but says nothing plain of how far it is or what it does: that it is at work, and its kind's word
      return { text: text || (job.kind === 'wait' ? 'waiting' : job.kind === 'download' ? 'downloading' : 'working'), isWarn: warn }
    }
    // A job's two lines: what it is, in the work's own words, with its time; and under it how it stands, then the latest line it
    // printed where that is not the progress already said
    const jobRow = (t: Twig, scope: string) => {
      const job = t.job
      if (!job) return null
      const key = `${scope}-job-${job.id}`
      const width = perRow - 4 - t.depth * 2
      const ran = at - job.at
      const { time, isPast: isLong } = jobTime(job, ran)
      // Stop, at its end, where it can be stopped from here: it ends the run and tells the work it was stuck
      const owner = t.one?.id ?? ''
      // (not on a row too narrow to say how far it is beside it; Details, wider, has it)
      const isStoppable = Boolean(owner) && canStopJob(job) && !job.id.startsWith('more-') && width >= 44
      const name = cut(jobHead(job), Math.max(12, width - time.length - 1))
      const head = (
        <Box key={`twig-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {jobLines(t, `twig-lines-${key}`, job)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {/* A press shows its output whole in a Terminal window, where this Mac can open one */}
            {canOpenJob(job) ? (
              <Button key={`output-${key}-${presses}`} label={name} plain hover={{ scope: `twig-${key}`, underline: true }} onPress={() => void openJobOutput($, job).catch(err => log($, `output not opened: ${String(err)}`))} />
            ) : (
              <Text wrap="truncate-end">{name}</Text>
            )}
          </Box>
          <Box flexShrink={0}>
            <Text dimColor={!isLong} color={isLong ? NEEDS : undefined}>{time}</Text>
          </Box>
        </Box>
      )
      if (job.id.startsWith('more-')) return head
      // (Stop sits at the end of its second line, under its time, so its name keeps its room)
      const stopButton = isStoppable ? (
        <Box key={`stop-box-${key}`} flexShrink={0}>
          <Button key={`stop-${key}-${presses}`} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain hover={{ scope: `stop-${key}`, underline: true }} onPress={() => void stopJob($, owner, job).catch(err => log($, `run not stopped: ${String(err)}`))} />
        </Box>
      ) : null
      const { text: stand, isWarn } = jobStand(job, width - (isStoppable ? 10 : 0))
      // Its percent, in blue, where the line says it as a part of its own
      const pctAt = job.pct && !isWarn ? (stand.startsWith(`${job.pct} · `) || stand === job.pct ? 0 : stand.includes(` · ${job.pct}`) ? stand.indexOf(` · ${job.pct}`) + 3 : -1) : -1
      // (its plain words are in the line itself, which every run has)
      const detail = ''
      return (
        <Box key={`job-${key}`} flexDirection="column" flexShrink={0}>
          {head}
          <Box key={`stand-${key}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {jobRails(t, `rails-${key}`)}
            {/* (on a desktop by the step a plain Button pads a run's name with, where its name is one, so the two start in one column) */}
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={canOpenJob(job) ? lead : 0}>
              {pctAt >= 0 && job.pct ? (
                <Box flexDirection="row" flexShrink={0}>
                  {pctAt > 0 ? <Text dimColor>{stand.slice(0, pctAt)}</Text> : null}
                  <Text color={JOB_COLOR.download}>{job.pct}</Text>
                  <Text dimColor>{stand.slice(pctAt + job.pct.length)}</Text>
                </Box>
              ) : stand ? (
                <Box flexShrink={0}>
                  <Text color={isWarn ? NEEDS : undefined} dimColor={!isWarn}>{stand}</Text>
                </Box>
              ) : null}
              {detail ? (
                <Box flexShrink={1000} minWidth={0}>
                  <Text dimColor wrap="truncate-end">{stand ? ` · ${detail}` : detail}</Text>
                </Box>
              ) : null}
            </Box>
            {stopButton}
          </Box>
        </Box>
      )
    }
    // Each branch with the jobs its helper has running first, under it, as the card's own come first under the card
    // At most JOBS_SHOWN each, the newest; the rest one row that says how many more run and opens the card's Details
    // In Details every one is shown
    const jobBranches = (card: Todo, isAll = false): Branch[] => {
      const jobs = jobsOf(card, at)
      if (isAll || jobs.length <= JOBS_SHOWN) return jobs.map(job => ({ one: card, job, kids: [] }))
      const more = jobs.length - JOBS_SHOWN + 1
      const shown = jobs.slice(-(JOBS_SHOWN - 1))
      const rest: Job = { id: `more-${card.id}`, label: `${jobs.slice(0, more).reduce((n, job) => n + (job.count ?? 1), 0)} more commands`, cmd: '', kind: 'watch', at: Math.min(...jobs.slice(0, more).map(job => job.at)) }
      return [...shown, rest].map(job => ({ one: card, job, kids: [] }))
    }
    const withJobs = (branches: Branch[], isAll = false): Branch[] =>
      branches.map(b => (b.job ? b : { ...b, kids: [...jobBranches(b.one, isAll), ...withJobs(b.kids, isAll)] }))
    const rowOf = (t: Twig) => (t.job ? jobRow(t, 'list') : twigRow(t, 'list'))
    // In a small card: what it has running, then the helpers at work now or just ended, and any that one of those runs under; the
    // rest are one closing row, laid out as the others, that says how many have ended and opens the card's Details, where every
    // helper is listed. A helper that ended with a job still running stays for it
    // The runs that ended under a card: its own and its helpers', oldest first
    const endedRunsOf = (one: Todo, list = all) => [one, ...underOf(list, one.id)].flatMap(kid => kid.endedRuns ?? []).sort((a, b) => a.endedAt - b.endedAt)
    // Runs that ended leave the tree at once; the closing row counts them with the helpers that ended, and says how many of them
    // failed, were killed or ran out of time, so nothing goes without a trace
    const treeUnder = (one: Todo) => {
      const under = underOf(all, one.id)
      const own = jobBranches(one)
      const runs = endedRunsOf(one, one.chat ? helpersThere : all)
      if (!under.length && !own.length && !runs.length) return []
      const branches = [...own, ...withJobs(branchesOf(all, one.id, kid => kid.status === 'working' || isLingering(kid, at) || jobsOf(kid, at).length > 0))]
      const twigs = twigsOf(branches, true)
      const rest = under.length - twigs.filter(t => !t.job).length
      if (!rest && !runs.length) return twigsOf(branches).map(rowOf)
      const closing: Twig = { depth: 1, rails: [], isLast: true, hasKids: false }
      return [...twigs.map(rowOf), twigRowOf(closing, `rest-${one.id}`, endedSummary(rest, runs), true, '', () => openWork($, one.id))]
    }

    // ---- A workflow's card, in blue: its stages in order with the one being run, who is in it, and its rounds ----
    const flowMine = await sessionName($)
    const flowList = (await read($, flows)).filter(f => isFlowShown(f, flowMine))
    const runningFlows = flowList.filter(f => f.status === 'working')
    const shownFlows = flowList.filter(f => f.status === 'working' || isLingering(f, at))
    const endedFlows = flowList.filter(f => f.status !== 'working' && !isLingering(f, at))
    const flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(f => flowPaneOf(f.id) === paneId) : undefined
    const flowTokens = (f: Flow) => f.agents.reduce((sum, one) => sum + (one.tokens ?? 0), 0)
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
      if ('Svg' in table && e.surface !== 'terminal') {
        // One drawing holds so many squares: a long run draws its last rounds, after how many came before
        const kept = squaresKept(groups)
        const said = kept.groups.map((g, i) => `round ${first + kept.earlier + i}: ${g.join(', ')}`).join('; ')
        const source = squaresSvg(kept.groups, LINE)
        return (
          <Box key={key} flexDirection="row" gap={1} alignItems="center" flexShrink={0}>
            {squaresBefore(kept) ? <Text key={`${key}-earlier`} dimColor>{`${squaresBefore(kept)} ·`}</Text> : null}
            {svgFits(source) ? <table.Svg key={`${key}-svg`} source={source} alt={said} width={squaresWidth(kept.groups)} height={LINE} isInteractive /> : <Text key={`${key}-too-big`} dimColor>{`${groups.length} rounds`}</Text>}
          </Box>
        )
      }
      return (
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
    // The small card, built as every other card is: its title, which opens its Details, with Stop at the far end of that row; where
    // it stands; the bar it is held to; then a row per round up to the cap, each led by its own squares, one per step, and saying
    // what came of it: the round at work has the moving dots and who is at work, a checked round what its check found, a round not
    // run yet that it runs only if needed. Once it ended, how it ended takes the place of the moving dots
    const flowModel = (f: Flow) => modelName(f.agents.find(one => one.model)?.model ?? f.phases.find(one => one.model)?.model ?? '')
    // As a card's facts line: every part, cut at its end on a narrow panel as a card's is
    const flowFacts = (f: Flow, rounds: Round[]) => {
      const time = took((f.endedAt || at) - f.startedAt)
      const round = rounds.length && f.cap ? `round ${rounds.length} of ${f.cap}` : rounds.length ? `round ${rounds.length}` : ''
      return [stood[f.status], flowModel(f), agentsWord(f.agents.length), round, time].filter(Boolean).join(' · ')
    }
    // Who is at work in a round, in plain words: the rounds script's maker and checker by name, any other stage by its own
    const atWork = (f: Flow, r: Round) => {
      const one = [...r.agents].reverse().find(agent => agent.status === 'working')
      const phase = one?.phase || stageOf(f)
      if (!one) return 'between steps'
      if (phase === 'Make') return r.n === 1 ? 'Maker building it' : 'Maker fixing what the check found'
      if (phase === 'Check') return 'Checker testing it'
      return doing(phase || 'Working')
    }
    const flowDots = (key: string) =>
      'Svg' in table && e.surface !== 'terminal' ? (
        <Box key={key} flexShrink={0}>
          <table.Svg key={`${key}-svg`} source={dots(FLOW, LINE)} alt="Working now" width={22} height={LINE} isInteractive />
        </Box>
      ) : e.surface === 'terminal' ? (
        (termDots(table, $, paneId, key, FLOW) ?? <Text key={key} color={FLOW}>▸</Text>)
      ) : (
        <Text key={key} color={FLOW}>▸</Text>
      )
    const roundRow = (f: Flow, rounds: Round[], n: number, isPassed: boolean) => {
      const r = rounds[n - 1]
      const key = `flow-round-${f.id}-${n}`
      const label = (color: string | undefined, isDim = false) => (
        <Box key={`${key}-label`} flexShrink={0}>
          <Text color={color} dimColor={isDim}>{`Round ${n}`}</Text>
        </Box>
      )
      const row = (parts: unknown[]) => (
        <Box key={key} flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {squaresRow(f, r ? [r] : [], `${key}-squares`, n)}
          {parts as never}
        </Box>
      )
      if (!r && n === 1 && f.status === 'working') return row([label(FLOW), flowDots(`${key}-dots`), <Text key={`${key}-why`} color={FLOW} wrap="truncate-end">Starting</Text>])
      if (!r) return row([label(undefined, true), <Text key={`${key}-why`} dimColor wrap="truncate-end">{isPassed ? 'not needed' : f.status === 'working' ? 'if needed' : 'not run'}</Text>])
      if (r.isOpen)
        return row([
          label(FLOW),
          f.status === 'working' ? flowDots(`${key}-dots`) : null,
          <Box key={`${key}-what`} flexShrink={1} minWidth={0}>
            <Text color={FLOW} wrap="truncate-end">{atWork(f, r)}</Text>
          </Box>,
        ])
      const cutShort = r.pass === undefined && !r.why && r.agents.some(one => one.status !== 'done')
      const why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : cutShort ? (f.status === 'failed' ? 'failed with an error' : 'stopped') : 'ended')).replace(/[.。]+$/, '')
      const found = r.pass === false && r.findings.length ? `${r.findings.length} found · ` : ''
      return row([
        label(r.pass ? DONE : undefined),
        <Box key={`${key}-why`} flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{r.pass ? `passed · ${why}` : `${found}${why}`}</Text>
        </Box>,
      ])
    }
    // Whether a run passed: its last round's verdict, else what the run itself returned
    const flowPassed = (f: Flow, rounds: Round[]) => {
      const pass = rounds.at(-1)?.pass
      if (pass !== undefined) return pass
      if (/"passed"\s*:\s*false|\bnot passed\b/i.test(f.result)) return false
      if (/"passed"\s*:\s*true|\bpassed\b/i.test(f.result)) return true
      return undefined
    }
    // How it ended, as its last line; a stopped run's facts line already says it was stopped
    const flowEnd = (f: Flow, rounds: Round[]) => {
      if (f.status !== 'done') return null
      const n = rounds.length
      const pass = flowPassed(f, rounds)
      const of = f.cap ? ` of ${f.cap}` : ''
      const said = pass === true ? `✓ Passed in round ${n}${of}` : pass === false ? `Not passed after ${n}${of} ${(f.cap ?? n) === 1 ? 'round' : 'rounds'}` : '✓ Finished'
      return (
        <Box key={`flow-end-${f.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          {pass === false ? <Text color="error">✕</Text> : null}
          <Text color={pass === false ? undefined : DONE} wrap="truncate-end">{said}</Text>
        </Box>
      )
    }
    const flowSmall = (f: Flow) => {
      const rounds = roundsOf(f)
      const count = Math.max(rounds.length, f.cap ?? 0)
      const isPassed = f.status === 'done' && flowPassed(f, rounds) === true
      const scope = `flow-${f.id}`
      return (
        <Box key={`flow-${f.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isFlowMoment(f) && !isAbovePrompt ? { borderStyle: 'round' as const, borderColor: DONE } : {})}>
          {/* Blue while it runs, green only when it finished and its last round did not fail */}
          {f.status === 'working' || (f.status === 'done' && flowPassed(f, rounds) !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE} /> : <Box width={1} flexShrink={0} />}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={`flow-open-${f.id}-${presses}`} plain hover={{ scope, underline: true }} onPress={() => openFlow($, f.id)}>
                    <Text bold wrap="truncate-end">{f.title}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1} />
                {f.status === 'working' && f.session === flowMine ? (
                  <Box flexShrink={0}>
                    <Button key={`flow-stop-${f.id}`} label="Stop" plain dimColor hover={{ scope: `flow-stop-${f.id}`, underline: true }} onPress={() => void stopFlow($, f.id)} />
                  </Box>
                ) : null}
              </Box>
              <Box paddingLeft={lead}>
                <Text dimColor wrap="truncate-end">{flowFacts(f, rounds)}</Text>
              </Box>
            </Box>
            {f.bar ? (
              <Box flexDirection="row" gap={1} height={2} overflow="hidden" paddingLeft={lead}>
                <Box flexShrink={0}>
                  <Text dimColor>Test to pass ·</Text>
                </Box>
                <Box flexShrink={1} minWidth={0}>
                  <Text dimColor wrap="wrap">{cut(f.bar, Math.max(20, room - 12))}</Text>
                </Box>
              </Box>
            ) : null}
            <Box flexDirection="column" paddingLeft={lead}>
              {Array.from({ length: Math.max(1, count) }, (_, i) => roundRow(f, rounds, i + 1, isPassed))}
            </Box>
            {flowEnd(f, rounds)}
          </Box>
        </Box>
      )
    }

    // The work this Details tab is for, if it is one; a workflow's tab folds each of its agents' chats apart
    const flowOpen = flowShown ? pickedOf(flowShown) : undefined
    const workId = paneId === LIST ? '' : flowShown ? `${flowShown.id}:${flowOpen?.id ?? ''}` : ([...all, ...elsewhere, ...helpersThere].find(one => workPaneOf(one.id) === paneId)?.id ?? '')
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
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="truncate-end">{side}</Text>
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

    // The to-dos, every one in the order the work listed them: done ticked, the one being done bright with the dots and where the
    // work says it is under it, the rest dim, dropped struck through. Many done fold into one row that opens them. Orange is the
    // header's alone
    const todoPart = (one: Todo) => {
      const isWorking = one.status === 'working'
      const done = one.items.filter(item => item.state === 'done').length
      const kept = one.items.filter(item => item.state !== 'dropped').length
      const where = isWorking ? now(one) : ''
      const hasDoing = one.items.some(item => item.state === 'doing')
      const isFolded = done > DONE_FOLDED && !open.includes(OPEN_DONE)
      if (!one.items.length && !where) return null
      let isWhereSaid = false
      return part(
        'part-todos',
        'To-dos',
        kept ? `${done} of ${kept} done` : '',
        <Box flexDirection="column">
          {done > DONE_FOLDED ? opener(OPEN_DONE, isFolded ? `${done} done` : 'Hide the done ones') : null}
          {one.items.map((item, i) => {
            if (item.state === 'done' && isFolded) return null
            if (item.state === 'doing') {
              const under = !isWhereSaid && where ? cut(where, room) : ''
              isWhereSaid = true
              return row(`todo-${i}`, isWorking ? live(`live-doing-${i}`) : <Text dimColor>○</Text>, item, under)
            }
            const mark = item.state === 'done' ? <Text color="success" dimColor>✓</Text> : <Text dimColor>{item.state === 'dropped' ? '✕' : '○'}</Text>
            return row(`todo-${i}`, mark, item)
          })}
          {!hasDoing && where ? (
            <Box key="where" flexDirection="row" alignItems="flex-start" gap={1}>
              {live('live-where')}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="wrap">{cut(where, room)}</Text>
              </Box>
            </Box>
          ) : null}
        </Box>,
      )
    }
    // In Details: what the work has running, then every helper it started, and theirs, at work or ended, each with what it has
    // running under it, as the same tree as on its card, every job shown; each helper opens its own Details, which shows its own
    // Under a helper at work, the step it is on and where it says it is; under a job, the last lines its output ends with, as a
    // terminal shows them. Both sit where the row's name starts; one that ended has nothing under it
    const underTwig = (t: Twig) => {
      const pad = t.depth * 2 + 4
      if (t.job) {
        // (its row says it in plain words, so the last line is here as it was printed too)
        const tail = t.job.id.startsWith('more-') ? [] : (t.job.tail ?? []).slice(-OUTPUT_LINES)
        if (!tail.length) return null
        return (
          <Box key={`tail-${t.job.id}`} flexDirection="row" paddingLeft={pad} flexShrink={0}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={OUTPUT_FILL}>
              {tail.map((line, n) => (
                <Text key={`tail-${t.job?.id}-${n}`} dimColor wrap="truncate-end">
                  {line}
                </Text>
              ))}
            </Box>
          </Box>
        )
      }
      const kid = t.one
      if (!kid || kid.status !== 'working') return null
      const kept = kid.items.filter(item => item.state !== 'dropped')
      const doing = kept.findIndex(item => item.state === 'doing')
      const lines = [doing >= 0 ? `Step ${doing + 1} of ${kept.length} · ${kept[doing]?.text ?? ''}` : '', now(kid)].filter(Boolean)
      if (!lines.length) return null
      return (
        <Box key={`under-${kid.id}`} flexDirection="column" paddingLeft={pad} flexShrink={0}>
          {lines.map((line, n) => (
            <Text key={`under-${kid.id}-${n}`} dimColor wrap="truncate-end">
              {line}
            </Text>
          ))}
        </Box>
      )
    }
    const helpersPart = (one: Todo) => {
      // Another chat's work has its helpers from that chat's file
      const list = one.chat ? helpersThere : all
      const under = underOf(list, one.id)
      const branches = [...jobBranches(one, true), ...withJobs(branchesOf(list, one.id, () => true), true)]
      const jobs = [one, ...under].reduce((n, kid) => n + jobsOf(kid, at).reduce((sum, job) => sum + (job.count ?? 1), 0), 0)
      if (!under.length && !jobs) return null
      const running = under.filter(kid => kid.status === 'working').length
      // Beside the jobs, the helpers are named, so neither count reads as the other's
      const helpers = running === under.length ? `${running} ${running === 1 ? 'helper' : 'helpers'} working` : running ? `${running} of ${under.length} helpers working` : `${under.length} ${under.length === 1 ? 'helper' : 'helpers'}`
      const side = [jobs ? `${jobs} ${jobs === 1 ? 'command' : 'commands'} running` : '', under.length ? helpers : ''].filter(Boolean).join(' · ')
      return part(
        'part-helpers',
        !jobs ? 'Helpers' : under.length ? 'Helpers and commands' : 'Running',
        side,
        <Box flexDirection="column">{twigsOf(branches).flatMap(t => [t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)])}</Box>,
      )
    }
    // In Details, under what runs: every run that has ended, the newest first, each with how it ended in plain words, how long it
    // ran and when it ended; one that failed, was killed or ran out of time in amber
    const endedRunsPart = (one: Todo) => {
      const runs = endedRunsOf(one, one.chat ? helpersThere : all).reverse()
      if (!runs.length) return null
      const isBad = (run: (typeof runs)[number]) => run.how === 'failed' || run.how === 'killed' || run.how === 'timed out'
      const bad = runs.filter(isBad).length
      return part(
        'part-ended-runs',
        'Commands ended',
        `${runs.length} ${runs.length === 1 ? 'command' : 'commands'}${bad ? ` · ${bad} did not finish` : ''}`,
        <Box flexDirection="column">
          {runs.map(run => (
            <Box key={`ended-${run.id}`} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{describedOf(run.what).text || run.what || 'A command'}</Text>
              </Box>
              <Box flexShrink={0}>
                <Text dimColor={!isBad(run)} color={isBad(run) ? NEEDS : undefined}>{`${endedWord(run)} after ${took(run.endedAt - run.at)} · ${shortAgo(at - run.endedAt)} ago`}</Text>
              </Box>
            </Box>
          ))}
        </Box>,
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
                  <Text dimColor wrap="wrap">{`Picture: ${pic.name} · no longer available`}</Text>
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
          {lines ? null : <Text dimColor>The app didn't save this task's conversation.</Text>}
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
                  <Button key={`told-${at}-${presses}`} label="▸ The instructions Claude was given" plain dimColor onPress={() => fold(-at - 1)} />
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

    // Another chat's work whose chat cannot be read here (a chat on another Mac, or one its file no longer holds): where it is. Its
    // head has the press that opens that chat
    const theirChat = (one: Todo, c: NonNullable<Todo['chat']>) => (
      <Text dimColor wrap="wrap">{`This task runs in the chat "${chatName(c)}"${c.host ? ` on ${macName(c.host)}` : ''}.${one.status === 'working' ? ' Stop it or change its model there.' : ''}`}</Text>
    )
    // The press on another chat's name that opens it, wherever the app can open that chat (a chat of the app on this Mac, or one Remote
    // Control serves)
    const openTheirs = (one: Todo, c: NonNullable<Todo['chat']>) => {
      const s = otherChats.find(other => other.chat === c.id && other.host === c.host)
      return s && pressOf(s) ? <Button key={`their-chat-${one.id}-${presses}`} label="Open that chat ↗" plain onPress={() => void ((presses += 1), openChat($, s))} /> : null
    }

    // What the work reported as it ended, the first of it, whole on a press
    const resultPart = (one: Todo) => {
      if (one.status === 'working' || !one.answer.trim()) return null
      const whole = one.answer.trim()
      const short = cut(whole, RESULT_SHOWN)
      const isLong = short !== whole
      return part(
        'part-result',
        'Result',
        '',
        <Box flexDirection="column">
          <Markdown text={isLong && !open.includes(OPEN_RESULT) ? short : whole} />
          {isLong ? opener(OPEN_RESULT, open.includes(OPEN_RESULT) ? 'Show less' : 'Show all') : null}
        </Box>,
      )
    }

    // The big card, in parts that stand apart: what the work is, with its buttons; where it started; its to-dos; its chat. The
    // buttons sit at the top, above a chat of any length
    const big = (one: Todo, lines: Line[] | undefined) => {
      const showing = lines ? newest(lines).length : 0
      const parent = one.parentId ? [...all, ...elsewhere, ...helpersThere].find(card => card.id === one.parentId) : undefined
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
              {one.chat ? (
                <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1}>
                  <Text dimColor wrap="wrap">{`From the chat "${chatName(one.chat)}"${chatSide(one.chat, selfName()) ? `, ${chatSide(one.chat, selfName())}` : ''}`}</Text>
                  {openTheirs(one, one.chat)}
                </Box>
              ) : null}
              {(one.status === 'working' && !one.chat) || left(one) || (one.status === 'stopped' && one.byYou && !one.chat) ? (
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={`stop-${one.id}`} label="Stop" onPress={() => void stop($, one.id)} /> : null}
                  {/* Work the person stopped stays stopped until they start it again from here or ask in a message */}
                  {one.status === 'stopped' && one.byYou && !one.chat ? <Button key={`again-${one.id}-${presses}`} label="Start again" onPress={() => ((presses += 1), void startAgain($, one.id))} /> : null}
                  {left(one) ? <Button key={`artifact-${one.id}-${presses}`} label="Its result" onPress={() => void openReport($, left(one)?.id ?? '')} /> : null}
                </Box>
              ) : null}
            </Box>
          </Box>
          {one.admins?.length || cardNotesOf(one.id, at).length ? (
            <Box key="part-gates" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {adminBlock($, table, one, `gates-big-${one.id}`, at)}
              </Box>
            </Box>
          ) : null}
          {one.ask ? (
            <Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE} />
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>{needsPerson(one) ? 'Needs you now' : 'Claude is working on your reply'}</Text>
                {askBlock(one, `ask-big-${one.id}`, true)}
              </Box>
            </Box>
          ) : sentLine(one, at) ? (
            <Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>
          ) : null}
          {resultPart(one)}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {endedRunsPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
            ? part('part-chat', 'Conversation', '', theirChat(one, one.chat))
            : part('part-chat', 'Conversation', lines && showing < lines.length ? `last ${showing} lines` : '', talks.has(one.id) ? talk(one, lines, shots.get(one.id)?.shots ?? new Map()) : <Text dimColor>Reading the conversation…</Text>)}
        </Box>
      )
    }

    // The app's own prompt open in a chat, amber at the top of that chat's cards, in plain words: which work asks, what it asks, exactly
    // what (the command, the message), what a yes and a no each do, and Yes and No that answer it while its chat holds it. Not held
    // (a question, a plan, a chat of an older version), it says where to answer it, and a chat of the Claude app on this Mac opens at a
    // press. Another chat's prompt has no Yes or No here: it is answered in that chat, and a press on Open that chat takes the person there
    const promptButtons = (p: Prompt, key: string) => {
      const press = (said: 'yes' | 'no') => () => void (answerPrompt($, p.id, said), redraw($))
      return (
        <Box key={`prompt-buttons-${key}`} flexDirection="row" gap={1}>
          <Button key={`prompt-yes-${key}-${presses}`} label="Yes" onPress={press('yes')} />
          <Button key={`prompt-no-${key}-${presses}`} label="No" onPress={press('no')} />
        </Box>
      )
    }
    // Only this chat's own prompt, while this chat holds it: another chat's is answered in that chat, as no file may answer one
    const isHeldHere = (p: Prompt, c?: Shared) => Boolean(!c && p.isHeld && promptHeld.has(p.id))
    // Drawn as Claude Code draws its permission asks, as the admin gate's are: an outlined box with the kind of ask at its top, never
    // a filled card with an edge as work's cards are
    const promptCard = (p: Prompt, key: string, where: string, c?: Shared) => (
      <Box key={`prompt-${key}`} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
        <Box flexDirection="column">
          <Text dimColor wrap="truncate-end">{`${p.kind === 'question' ? 'Question' : p.kind === 'plan' ? 'Plan' : 'Permission'} · ${isHeldHere(p, c) || !c ? 'waits for your answer' : 'asked in another chat'}`}</Text>
          <Text bold wrap="truncate-end">{p.title || (c ? 'That chat itself' : 'This chat itself')}</Text>
          {/* At the top, away from its chat's name: which chat it is */}
          {c ? <Text key={`prompt-${key}-chat`} dimColor wrap="truncate-end">{`In the chat “${chatName(c)}”${c.host ? ` on ${macName(c.host)}` : ''}`}</Text> : null}
          <Text dimColor wrap="wrap">{p.kind === 'question' ? 'Has a question for you' : p.kind === 'plan' ? 'Wants you to approve its plan' : 'Needs your permission'}</Text>
        </Box>
        <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
        {p.detail ? (
          <Box backgroundColor={FILL} paddingLeft={2} paddingRight={1}>
            <Text mono wrap="wrap">{p.detail}</Text>
          </Box>
        ) : null}
        {p.yes || p.no ? (
          <Box flexDirection="column">
            {p.yes ? <Text wrap="wrap">{p.yes}</Text> : null}
            {p.no ? <Text wrap="wrap">{p.no}</Text> : null}
          </Box>
        ) : null}
        {isHeldHere(p, c) ? promptButtons(p, key) : <Text dimColor wrap="wrap">{where}</Text>}
        {c && pressOf(c) && !isHeldHere(p, c) ? (
          <Box flexDirection="row">
            <Button key={`prompt-open-${key}-${presses}`} label="Open that chat" onPress={() => void ((presses += 1), openChat($, c).catch(err => log($, `chat not opened: ${String(err)}`)))} />
          </Box>
        ) : null}
      </Box>
    )
    // Where a prompt is answered: in this chat, the box Claude Code shows at its bottom
    const answerHere = (p: Prompt) => (p.kind === 'question' ? 'Pick your answer in the box at the bottom of this chat.' : 'Answer Yes or No in the box at the bottom of this chat.')
    // The same prompt once answered, for a minute after its call ends: what the person said and what is happening now, in the colour
    // of what came of it (purple while it runs, grey once over)
    const saidOf = (p: Prompt) => {
      if (p.answered === 'stopped') return 'It ended before you answered · nothing happened'
      if (p.answered === 'no') return p.kind === 'question' ? 'You skipped it · Claude got no answer and is waiting for you' : p.kind === 'plan' ? 'You said no · Claude keeps planning' : p.title ? "You said no · it didn't run, and Claudopus told Claude" : "You said no · it didn't run, and Claude is waiting for what you say next"
      if (p.kind === 'question') return p.isRunning ? 'You answered · Claude is taking your answer' : 'You answered · Claude is continuing with your answer'
      if (p.kind === 'plan') return 'You approved the plan · Claude is carrying it out'
      if (p.isCut) return 'You allowed it · it was stopped before it finished'
      return p.isRunning ? 'You allowed it · it is running now' : `You allowed it · ${p.done ?? 'it ran and is done'}`
    }
    // Once answered it is a line of what was done, as the gate's notes are: no box, fill or edge
    const answeredCard = (p: Prompt, key: string, c?: Shared) =>
      reportLine(table, `answered-${key}`, p.answered !== 'no' && p.answered !== 'stopped' && !p.isCut, saidOf(p), [p.title || (c ? 'That chat itself' : 'This chat itself'), p.text])

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
    const listedChats = otherChats.filter(c => shownOf(c).length || c.prompts?.length || answeredOf(c.answeredPrompts).length)
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
        const facts = [modelName(one.model ?? ''), one.tokens ? `context ${thousands(one.tokens)}` : '', one.status === 'working' ? (f.status === 'working' ? 'working' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ')
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
                `Conversation of the ${picked.label || picked.phase || 'agent'}${rounds.length > 1 ? `, round ${rounds.find(r => r.agents.some(one => one.id === picked.id))?.n ?? ''}` : ''}`,
                modelName(picked.model ?? ''),
                talk({ ...started(picked.id, '', picked.label, '', picked.at), answer: picked.result ?? '' }, lines, new Map()),
              )
            : null}
          {f.status !== 'working' && f.result ? part('part-result', 'What it returned', '', <Markdown text={f.result} />) : null}
        </Box>
      )
    }
    if (paneId.startsWith(FLOW_PANE)) {
      if (!flowShown) return <Text dimColor>This workflow is no longer available.</Text>
      const picked = pickedOf(flowShown)
      const lines = picked ? await flowTalkOf($, flowShown, picked).catch(() => undefined) : undefined
      return (
        <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>
      )
    }

    // A Details tab stays, even once its work has ended, until it is closed; work no longer kept says so
    const alone = [...all, ...elsewhere, ...helpersThere].find(one => one.id === workId)
    if (paneId !== LIST && !alone) return <Text dimColor>{paneId.startsWith(`${WORK_PANE}r-`) ? 'This task has finished, or its chat is closed. Open that chat to see it.' : 'This task is no longer available.'}</Text>
    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
    // read, and a drawing that waits on it is never shown
    // Another chat's is read from that chat's own file, on this Mac
    if (alone) void (alone.chat ? loadTheirs($, alone) : loadWork($, alone.id)).catch(() => undefined)
    const talked = alone ? talks.get(alone.id) : undefined
    // The reports kept, in every chat: on this pane only the button that opens their own
    const kept = await read($, reports)
    const ui = uiOf($, e)
    // A terminal too narrow to dock the panel seats it above the prompt, a few rows tall
    const isInline = e.surface === 'terminal' && (e.props as { placement?: string }).placement === 'inline'
    // Everything that waits on the person, every chat's, together at the top under the header and the newest first: the notices
    // (password and key boxes, gates, Claude Code's own prompts), then the cards of work that asked. Each stays until answered, and
    // then leaves the top; a card goes back to its own place among the rest, which keep their order
    const notices = [
      // A box that comes while the person types a reply in the terminal leaves the keys with that reply
      ...boxRows($, ui, e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk))),
      ...looseGates.map(gate => ({ at: gate.at, node: gateRow($, ui, gate, `gate-${gate.id}`, false) })),
      ...waiting.map(p => ({ at: p.at, node: promptCard(p, `this-${p.id}`, answerHere(p)) })),
      ...otherChats.flatMap(c => {
        const url = pressOf(c)
        return (c.prompts ?? []).map(p => ({ at: p.at, node: promptCard(p, `${c.host}-${c.chat}-${p.id}`, c.host && !url ? `Answer it in that chat, on ${macName(c.host)}` : c.host ? `Answer it in that chat, which runs on ${macName(c.host)}` : 'Answer it in that chat', c) }))
      }),
    ]
    // A work that waits on the person comes to the top whole, its ask or its gate in it as ever; once a gate is answered, what was
    // done shows in the card, outlined green, and the card stays at the top until that goes
    const isAsking = (one: Todo) => Boolean(one.ask) && !isActingOnReply(one)
    const isWaitingPress = (one: Todo) => one.status === 'working' && Boolean(one.admins?.length)
    // An ask answered on its card keeps the card where it was, its answer said in it, for ANSWER_SHOWN: a press or a reply never
    // takes the card from under the person's eyes, as a gate answered on its card does not
    const answeredSince = (one: Todo) => {
      return heldAnswer(one, at)?.at ?? 0
    }
    // An answered card keeps the place its ask had among what waits, so nothing still waiting slides into the spot just pressed
    const answeredPlace = (one: Todo) => (answeredSince(one) ? (sentReplies.get(one.id)?.askAt ?? answeredSince(one)) : 0)
    const isWaits = (one: Todo) => isAsking(one) || isWaitingPress(one) || answeredSince(one) > 0
    // Just finished: up at the top, right under what waits, the newest first, each for its own two seconds
    const isFinishing = (one: Todo) => !isWaits(one) && isFinishMoment(one)
    const finishFrom = (one: Todo) => (one.chat ? (endSeen.get(`${one.id}:${one.endedAt}`) ?? one.endedAt) : pauseFrom(one))
    // Finished but left something running: after its moment it stays up, under what waits, with its Stop it, never back among the rest
    const isLeftUp = (one: Todo) => !one.chat && one.status !== 'working' && Boolean(one.leftSince) && !isWaits(one) && !isFinishing(one)
    const isUp = (one: Todo) => isWaits(one) || isFinishing(one) || isLeftUp(one) || (!one.chat && cardNotesOf(one.id, at).length > 0)
    const upSince = (one: Todo) => Math.max(isAsking(one) ? (one.ask?.at ?? 0) : 0, ...(isWaitingPress(one) ? one.admins ?? [] : []).map(gate => gate.at), ...(one.chat ? [] : cardNotesOf(one.id, at).map(note => note.at)), answeredPlace(one))
    const askingHere = shownWork.filter(isUp)
    const askingThere = listedChats.flatMap(c => shownOf(c).filter(isUp))
    const askCards = [...askingHere, ...askingThere].sort((a, b) => upSince(b) - upSince(a))
    const restHere = shownWork.filter(one => !isUp(one))
    const restFlows = shownFlows.filter(f => !isFlowMoment(f))
    // Each card keeps the place it began in: work started again (Release it on an ended ask) never moves to the end
    const begun = (one: Todo) => one.begunAt ?? one.startedAt
    // Notices and whole cards in one order, the newest first; a card that only says what was allowed comes under all that still
    // waits. A card is drawn when the panel is
    const finishingFlows = shownFlows.filter(isFlowMoment)
    const top = [
      ...notices.map(one => ({ at: one.at, draw: () => one.node })),
      ...askCards.map(one => ({ at: isWaits(one) ? upSince(one) : isFinishing(one) ? finishFrom(one) - 1e14 : Math.max(upSince(one), isLeftUp(one) ? one.endedAt : 0) - 1e15, draw: () => small(one) })),
      ...finishingFlows.map(f => ({ at: pauseFrom(f) - 1e14, draw: () => flowSmall(f) })),
    ].sort((a, b) => b.at - a.at)
    const waitsCount = notices.length + askCards.filter(one => isAsking(one) || isWaitingPress(one)).length
    // The terminal's keys stay with the ask they were on while it waits
    if (keysAsk && !askingHere.some(one => one.id === keysAsk && isAsking(one))) keysAsk = ''
    // The header says what every card under it says, every chat's: what needs the person, what runs here and in other chats, and
    // work that just finished (happy too for a workflow in its pause whose card turned green: it finished and its last round passed)
    const runningThere = elsewhere.filter(one => one.status === 'working' && !needsPerson(one))
    const head = {
      here: working.filter(one => !needsPerson(one)).length + runningFlows.length,
      there: runningThere.length,
      chats: new Set(runningThere.map(one => `${one.chat?.host}/${one.chat?.id}`)).size,
      // Each thing at the top counts once, as the line above the prompt counts them
      asks: waitsCount,
      isDone: isHappy(own, at) || elsewhere.some(one => one.status === 'done' && lingers(one, at)) || flowList.some(isFlowMoment),
    }
    const mood = headMood(head)
    // A letter for each header button, in the terminal alone, and only while the panel has no password box to type in: there the
    // letters are the person's words, never a press. An ask's reply box takes the keys itself (askFocused)
    const isKeyed = e.surface === 'terminal' && !boxes.length
    keyed = isKeyed
    const versions = alone ? { version: '', installed: '', isWaiting: false } : await versionsOf($)
    // Just moved to a newer version whose changes the person has not seen: one quiet line in the header, with What's new, until closed
    const screen = alone ? undefined : await updateScreen($, ui, versions.version, head.asks, e.surface)
    // A password or key box stays above it: the runner waits on it
    if (paneId === LIST && !alone) {
      // Where this surface's list stands, as the person or a press last moved it (each move draws it again)
      const was = listOffsets.get(e.surface) ?? 0
      listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset))
      const count = waitsCount
      const finishedNow = [...askCards.filter(isFinishing).map(titleOf), ...finishingFlows.map(f => f.title)]
      if (finishedNow.join('\n') !== finishedAtTop.join('\n')) ((finishedAtTop = finishedNow), drawAgain($))
      if (count !== waitsAtTop || (was > 0) !== ((listOffsets.get(e.surface) ?? 0) > 0)) ((waitsAtTop = count), drawAgain($))
    }
    const updated = alone || !versions.version ? undefined : await updatedPieces($, versions.version)
    // Where updating stands for this chat: a small box under the header's lines, its steps each a press
    const outCard = alone ? null : (await noticeCard($, ui, await noticeNow($, versions.version, versions.installed).catch(() => undefined), versions.version).catch(() => null)) ?? screen ?? null

    return (
      <Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
          // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
          // them, which wraps onto a second row in a narrow pane rather than cutting anything off
          <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                  panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, `Claudopus, updated to ${versions.version}`, $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, something needs you', happy: 'Claudopus, task finished', working: 'Claudopus, working', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
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
                    {/* The Mac has a newer copy than this chat runs: said beside the version, with what to type to switch to it */}
                    {versions.version ? (
                      <Text key="head-version" dimColor wrap={versions.isWaiting ? 'wrap' : 'truncate-end'}>{`v${versions.version}${versions.isWaiting ? ` · v${versions.installed} ready, type /reload-plugins` : ''}`}</Text>
                    ) : null}
                  </Box>
                )}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? `This chat: ${fill(chat.tokens, chat.window)}` : 'This chat: just begun'}</Text>}
              </Box>
            </Box>
            {outCard}
            {/* Wrapped rows keep the same gap as the buttons beside each other; a terminal's gap would be a whole blank line, so it has none */}
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={e.surface === 'terminal' ? 0 : 1}>
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
        {!alone ? top.map(one => one.draw()) : null}
        {!alone ? doneNotesPart(ui, at) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
          ? big(alone, talked?.lines)
          : [
              // This chat's work first, named as this chat's once another chat's is shown, in the order it began; what waits on the
              // person is above, at the top. Beside other Macs' chats it is named with nothing running too, and every chat says which Mac it is on
              ...(listedChats.length && (restHere.length || restFlows.length || promptsAnswered.length) ? [chatHead('this', 'This chat', selfName() ? `on ${selfName()}` : '')] : []),
              ...promptsAnswered.map(p => answeredCard(p, `this-${p.id}`)),
              ...[...restHere.map(one => ({ at: begun(one), card: () => small(one) })), ...restFlows.map(f => ({ at: f.startedAt, card: () => flowSmall(f) }))].sort((a, b) => a.at - b.at).map(one => one.card()),
              // Then each other chat under its name, with what is left of it once its asks are at the top
              ...listedChats.flatMap(c => {
                const cards = shownOf(c).filter(one => !isUp(one)).sort((a, b) => begun(a) - begun(b))
                const answered = answeredOf(c.answeredPrompts).map(p => answeredCard(p, `${c.host}-${c.chat}-${p.id}`, c))
                return cards.length || answered.length ? [chatHead(`${c.host}-${c.chat}`, chatName(c), chatSide(c, selfName()), c), ...answered, ...cards.map(one => small(one))] : []
              }),
            ]}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1} /> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>
    )
    })()
    heldDrawings.set(heldKey, { shape, content, at: heldAt, fresh: freshness, drawing })
    lastShown.set(heldKey.replace(/\|[01]\|([01])$/, '|$1'), drawing)
    drawnPanes.set(paneId, { shape, content, at: heldAt, side: sideSign() })
    return drawing
    } finally {
      if (paneId === LIST) listDrawing -= 1
    }
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}

// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own

const tabHooks = (on: On) => {

  // In a chat the app runs on another Mac over ssh, every press that reaches the engine is one line in the log: which button, how long
  // since the panel was last drawn, and the tabs as the engine lists them, so a press that did nothing shows whether it arrived at all
  on('ui.press', async ($, e, next) => {
    if (isRunFromAfar && e.plugin === 'claudopus') await log($, `press ${e.element} in ${e.requestId} (${e.surface}), panel drawn ${drawnNow ? (await $.clock.now()) - drawnNow : -1} ms ago; tabs ${rosterOf(await $.ui.panes().catch(() => []))}`)
    // In the terminal a tab the press opens or closes is opened or closed here, by this hook's handle (tabmoves.ts)
    // A press is the person's own move: a panel held while they type is let go before the press acts, so what it does shows
    if (e.plugin === 'claudopus') ((pressFrom = 0), freeTimes($), (freshness += 1), await engage($))
    const isTerminal = e.plugin === 'claudopus' && e.surface === 'terminal'
    if (isTerminal) tabMoves.begin()
    let r: Awaited<ReturnType<typeof next>>
    try {
      r = await next(e)
    } finally {
      if (isTerminal) await tabMoves.finish(move => runTabMove($, move), ms => $.clock.sleep(ms))
    }
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
        {reportsView($, uiOf($, e), kept, await $.clock.now(), line, e.props.scroll.bodyRows)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
  on('ui.render', { component: 'Pane', requestId: STATS_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    void statsRead($, statsShown.scope).catch(() => undefined)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {statsView(() => drawAgain($), uiOf($, e), await $.clock.now(), scope => void statsRead($, scope).catch(() => undefined), e.surface, e.props.bodyColumns * 7.4 - 32)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // About, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, async ($, e) => {
    const ui = uiOf($, e)
    return (
      <ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {configView(ui, await configShown($), configActs($), band, presses, dir)}
      </ui.Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await aboutView($, uiOf($, e), e.surface)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // The changelog, in a pane of its own
  on('ui.render', { component: 'Pane', requestId: CHANGELOG_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await changelogView($, uiOf($, e), e.surface)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // A picture opened large, in a chat the app runs on another Mac over ssh
  on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, async ($, e) => {
    const { Box } = uiOf($, e)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {await pictureView($, e)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

  // A report opened as a pane of its own, named after it
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith('report-')) return next(e)
    const { Box, Text } = uiOf($, e)
    const kept = await read($, reports)
    const r = kept.find(one => paneOf(one) === e.requestId)
    if (!r) return <Text dimColor>This result is no longer available.</Text>
    if (!reportText.has(r.id)) reportText.set(r.id, await readOr($, `${reportPath(r)}/report.md`))
    const at = Math.min(Math.max(0, pictureAt.get(paneOf(r)) ?? 0), Math.max(0, r.files.length - 1))
    const file = r.files[at] ?? ''
    const picture = e.surface === 'terminal' ? null : RASTER.test(file) ? await thumbOf($, thumbPath(r, file)) : /\.svg$/i.test(file) ? await svgOf($, `${reportPath(r)}/${file}`) : null
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {reportShown($, uiOf($, e), r, reportText.get(r.id) || 'This result has no text.', kept, await $.clock.now(), at, picture, e.props.scroll.bodyRows)}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}


// ---- Tabs the app would leave saying "Nothing to show yet" ----

// The app asks a tab for its drawing once, as it shows it, and again only when told the drawing changed. One ask that comes back
// empty (the chat could not be reached that moment, or the drawing failed) leaves the tab empty until then, and a tab that reads
// nothing that changes, as Stats, About or a result, is never told. So each ask is noted, and a tab open but not asked for since it
// opened, since this code loaded, or since it came in front, is drawn again after 2, 6, 15 and 40 seconds until it is asked for. A
// redraw tells the app to ask every tab it shows, so it reaches one the engine has never drawn as well
const TAB_CHECKS = [2_000, 6_000, 15_000, 40_000]
const tabAsked = new Map<string, number>()
const tabFails = new Map<string, number[]>()
let tabInFront = ''
const noteTabAsked = async ($: EngineInterface, id: string | undefined) => {
  if (id) tabAsked.set(id, await $.clock.now())
}
// `since`: how long before now an ask already counts, for a tab seen in front a moment after the app asked for it
const watchTabs = async ($: EngineInterface, ids: string[], why: string, since = 0) => {
  if (!ids.length) return
  const from = (await $.clock.now()) - since
  for (const wait of TAB_CHECKS)
    $.clock.after(wait, async () => {
      const open = new Set((await $.ui.panes().catch(() => [])).map(pane => pane.id))
      const empty = ids.filter(id => open.has(id) && (tabAsked.get(id) ?? 0) < from)
      if (!empty.length) return
      drawAgain($)
      if (wait === TAB_CHECKS.at(-1)) await log($, `tab ${empty.join(', ')} not asked for in ${wait / 1000}s after ${why}: drawn again`)
    })
}
// As this code loads: the tab in front where the engine says which it is, else every tab open (a tab behind the others is never
// asked for, so it costs four redraws and no more)
const watchLoaded = async ($: EngineInterface) => {
  const panes = await $.ui.panes().catch(() => [])
  const shown = panes.filter(pane => pane.isShown)
  // the tab in front is watched here, not again by the first look each second
  tabInFront = shown[0]?.id ?? ''
  await watchTabs($, (shown.length ? shown : panes).map(pane => pane.id), 'this code loaded')
}
// Each second: a tab the person brought in front
const watchFront = async ($: EngineInterface) => {
  const front = (await $.ui.panes().catch(() => [])).find(pane => pane.isShown)?.id ?? ''
  if (front === tabInFront) return
  tabInFront = front
  if (front) await watchTabs($, [front], 'it came in front', 2_000)
}
// A tab whose drawing failed shows why, in place of nothing, and is asked for again in a few seconds: three times a minute at most
const tabFailed = async ($: EngineInterface, e: Parameters<EngineInterface['ui']['resolve']>[0] & { requestId?: string }, error: { kind: string; message?: string } | undefined) => {
  const id = e.requestId ?? ''
  const now = await $.clock.now()
  const fails = [...(tabFails.get(id) ?? []).filter(at => now - at < 60_000), now]
  tabFails.set(id, fails)
  const why = error?.kind === 'timeout' ? 'It took too long to draw.' : (error?.message ?? '').replace(/^\w*Error:\s*/, '') || 'No reason was given.'
  await log($, `tab ${id} not drawn (${error?.kind ?? 'unknown'}): ${why}`)
  const isAgain = fails.length < 3
  if (isAgain) await watchTabs($, [id], 'its drawing failed')
  const { Box, Text } = uiOf($, e)
  return (
    <Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>
      <Text bold>Claudopus couldn't draw this tab</Text>
      <Text dimColor wrap="wrap">{cut(why, 300)}</Text>
      <Text dimColor wrap="wrap">{isAgain ? 'Trying again in a few seconds.' : 'It failed three times in a minute. Open it again to try once more.'}</Text>
    </Box>
  )
}

// The hooks module's entry: the hooks of each part, in the order the engine runs them. The parts are the files beside it,
// each named for its job; build.mjs joins them into mods/claudopus/hooks/register.tsx, the one file the mod loads

export const register: Register = on => {
  recorderHooks(on)
  chatHooks(on)
  promptHooks(on)
  workHooks(on)
  stepHooks(on)
  commandHooks(on)
  toolHooks(on)
  bandHooks(on)
  panelHooks(on)
  tabHooks(on)
  memoryHooks(on)
  serversTabHooks(on)
  workflowHooks(on)
}
