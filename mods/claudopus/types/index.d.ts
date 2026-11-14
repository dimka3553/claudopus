// What the mod keeps about this chat
export type Me = {
  // The engine's id: names this chat's files, as its transcript is named
  id: string
  title: string
  tokens: number
  // The person has typed into this session: its own thread hands the work to agents from then on
  isChat: boolean
  // The role text goes out with the next message: at the start and after a compaction
  needsContext: boolean
  // Which version of the role text this chat last received
  roleSent: string
  // The to-do panel has opened by itself once: closed, it stays closed until asked for
  isListOpened: boolean
  // The size of this chat's context window, in tokens; `tokens` is how much of it is used
  window: number
}

// One line of ~/.claude/claudopus/index.md: a subject of work and where it stands
export type Stream = { name: string; repo: string; session: string; state: string; summary: string }

// One line kept under a to-do: where the work said it stood, or what the person said to steer it. The card shows the last of the first kind.
// In the work's chat a steer goes before the line the work wrote next
export type Entry = { at: number; kind: 'note' | 'decision' | 'steer'; text: string; step?: number }

// One thing the work set out to do under its to-do; `doing` is the one it is on now, at most one at a time
export type Item = { text: string; state: 'open' | 'doing' | 'done' | 'dropped' }

// One thing the person asked for: a card in the panel, and the one piece of background work that does it
export type Todo = {
  // The id of the agent that does the work
  id: string
  // The work that started it; empty when this chat's own thread did. Only those are listed
  parentId: string
  // A copy of the chat: it runs on the chat's model, so its window is the chat's
  isFork: boolean
  // How much of its context is used, as its last response counted it; 0 before one came back
  tokens: number
  // The model it runs on, as the engine names it; absent when the mod has not been told
  model?: string
  // The model the person moved it to from its card: each step it sends from then on goes to this one
  chosen?: string
  // The older model, or Haiku, the app sent its steps to, which the mod sent to a model work runs on instead: "Opus 4.8"
  moved?: string
  // How many tool steps it has made
  steps?: number
  // How many of them since it last touched its to-dos or said where it stands
  quiet?: number
  // How many since a steer it has not yet answered with a line saying what it decided; absent when it owes none
  owes?: number
  // The few words the Agent call described the task with
  title: string
  // The message that started it, as the person wrote it
  words: string
  // What the work listed for itself, in the order it did
  items: Item[]
  // Its log, the oldest first
  entries: Entry[]
  // What it reported when it finished: shown where the app has not kept its chat
  answer: string
  // The subject it recorded with the `update` tool; names its report's subject
  subject?: string
  // The report it was started from, by id, when the person's message named one
  from?: string
  // What it recorded with the `waits` tool as waiting on the person; its next report takes them
  waits?: string[]
  // What it needs the person's own hands for now, said with the `ask` tool: what to do, and the exact text to copy for it. Its card
  // stands out with the ask in view until the work clears it or ends
  // `replied`: the person's reply in their own words that did not settle it; the ask stays open while the work acts on it, until a button, the work clearing it or asking again
  // `isCommand`: `copy` is a command the person types in a terminal opened in `cwd`. `choices` are buttons the person answers with, sent back to `from`, the agent that asked (a helper's ask shows on its work's card). `pictures` are the picture files the ask is about, shown with it in the chat. `details` is what the ask is about, in full, shown with it on the card and in the chat
  ask?: { text: string; details?: string; copy?: string; isCommand?: boolean; cwd?: string; choices?: string[]; pictures?: string[]; from?: string; at: number; replied?: { text: string; at: number } }
  // Admin commands it, or a helper of it, wants to run, each held until the person presses Allow or Deny on this card: the Mac
  // (`here` or an ssh host), the exact command, the agent that runs it, and whether Allow covers the whole piece of work
  admins?: { id: string; host: string; command: string; at: number; from?: string; isWork?: boolean }[]
  startedAt: number
  // 0 while it works
  endedAt: number
  // When its turn last ended with its answer, finished, while its own background work still held it; absent once it steps again.
  // Work stopped after that, by the chat, the panel or the engine, had finished: it ends done, not stopped
  answeredAt?: number
  // The call it has been running longest, while one runs: what it is in a few words, and since when
  running?: { what: string; at: number }
  // When something new last came back to it: a result holding a line it had not seen come back before
  newAt?: number
  // Set while nothing new has come back to it or any helper under it for a while: when something last did
  stuckAt?: number
  // Finished work that its own background work still holds: since when the mod has seen it so. Absent once nothing holds it
  leftSince?: number
  // What it started in the background itself that wakes it when it ends (a command, a watch): the engine's task id, what it is
  // in its own words, and since when. Dropped as it ends or is stopped
  bg?: { id: string; what: string; at: number; isWatch?: boolean }[]
  // Work whose turn ended while what it started in the background still runs and that has not finished: since when it has waited
  // so. It is still at work, and its card says what it waits for
  waitsSince?: number
  // Work with helpers running: when the mod last looked in on them, how many ran and how many had shown nothing new for a while
  lookedIn?: { at: number; running: number; quiet: number }
  // A helper whose work was told it has shown nothing new: when it last had, so it is told once each quiet stretch
  quietTold?: number
  // A helper whose work was told it works through in order what could be split
  serialTold?: boolean
  // Only work that is working has a card; one that has ended is kept, so a message to it brings its card back as it was
  status: 'working' | 'done' | 'stopped' | 'failed'
  // Set on a card another chat shares: that chat, the Mac it runs on when another (empty for this one), and the card's own id there.
  // Such a card is shown and answered here; its work is stopped, moved and read in its own chat
  chat?: { id: string; title: string; folder: string; host: string; agent: string }
}

// What one chat shares with the panels of the others, in ~/.claude/claudopus/live/<chat id>.json: its running work, and when it last
// said so. `host` is the Mac it was fetched from, empty for this one
export type Shared = { chat: string; title: string; folder: string; host: string; at: number; cards: Todo[]; prompts?: Prompt[]; answeredPrompts?: Prompt[]; link?: Link }
// What opens a chat in the Claude app: its Remote Control id (session_…), which opens it from any Mac signed in to the same account,
// and the app's own id for it (local_…), which opens it only on the Mac it runs on
export type Link = { bridge: string; app: string }

// The app's own prompt open in a chat and waiting on the person: allow a command or a tool, answer its question, approve its plan.
// `id` is the tool call's, `text` the prompt's own short description, `title` the work it came from when not the chat's own thread,
// `at` when it opened. `link` on Shared opens that chat in the Claude app on its own Mac
// `kind` says what the person does (allow a call, answer a question, approve a plan), `detail` what exactly (the command, the message,
// the page), `yes` and `no` what each answer does. Once answered it moves to Shared's `answeredPrompts`: `answered` is what the person
// did (yes, no, an answer to a question, or nothing as it ended first), `isRunning` while an allowed call still runs, `endedAt` when
// it ended, after which it shows a minute more; `done` how its end is said once allowed ("it was sent"), `isCut` an allowed call
// that was stopped before it finished; `isHeld` while the chat that raised it waits for a press on its card's Yes or No, which
// answers it as Claude Code's own box would
export type Prompt = {
  id: string
  text: string
  title?: string
  at: number
  kind?: 'allow' | 'question' | 'plan'
  detail?: string
  yes?: string
  no?: string
  done?: string
  answered?: 'yes' | 'no' | 'stopped'
  isCut?: boolean
  isRunning?: boolean
  endedAt?: number
  isHeld?: boolean
}

// The card that has the pane to itself, by id; empty while the small cards show
// `open` names what is unfolded in that card's chat: a run of tool steps by the number of steps before it, a long message by that number negated less one
// Reports have panes of their own and are no part of this view
// The card open on its own, what is unfolded in it, and whether the list of work that has ended is unfolded
// `picking` names the running work whose model choice is open on its card
export type View = { openId: string; open?: number[]; isFinishedOpen?: boolean; picking?: string }

// A report a finished piece of work left, kept for good in ~/.claude/claudopus/reports/<id>/: its text as written in report.md,
// this in meta.json, and copies of the pictures it named. A report is a dated snapshot, never rewritten: a later look at the same
// subject is a new report beside it
export type Report = {
  id: string
  title: string
  // What it was about, the same for every look at one subject
  subject: string
  at: number
  // The chat it came from, by title and id
  chat: string
  chatId: string
  // The folder the work was about
  folder: string
  // What it found, in one line
  gist: string
  // The pictures and pages copied in, relative to its folder
  files: string[]
  // The work that wrote it; empty for one brought in by hand
  agent: string
  // Tells one text from another, so the same report is not kept twice
  mark?: string
  // What in it waits on the person, as the work that wrote it recorded: each one short line they answer from the panel
  waiting?: Wait[]
  // An older report's one question and its answer, read as its one waiting item
  question?: string
  answer?: string
  // The report the work that wrote this one was started from
  from?: string
  // When the person put it away: it leaves the list and the chat's note, and nothing in it waits; its text stays
  archived?: number
  // When they last brought it back: another Mac's marks follow the later of the two
  broughtBack?: number
}

// One thing a report leaves for the person to decide or do; open until `answer` is "Yes", "No", or "Not now" for one set aside
export type Wait = { text: string; answer?: string }

// A process on this Mac that listens on a port, started from one of the person's folders
export type Server = {
  pid: number
  port: string
  // The address to open in a browser; empty for one that serves no pages
  url: string
  // Where it runs, and the chat that started it when that is known
  about: string
}

// One stage of a workflow, as its script's meta names it
export type FlowPhase = { title: string; detail?: string; model?: string }

// One agent a workflow's script started: its label and stage from the run's journal, its model and size from its own responses,
// and what it returned: a verdict's pass and why, or its first line
export type FlowAgent = {
  id: string
  label: string
  phase: string
  model?: string
  tokens?: number
  status: 'working' | 'done' | 'failed'
  pass?: boolean
  why?: string
  // A verdict's faults, one line each, as the checker listed them for the maker
  findings?: string[]
  result?: string
  at: number
  endedAt?: number
}

// A run of the Workflow tool, kept by the session that ran it in ~/.claude/claudopus/flows/<run id>.json, so the chat that started
// that session shows it too. Its card is blue
export type Flow = {
  // The run's id (wf_...), and the background task the engine runs it as
  id: string
  taskId: string
  title: string
  // The script's meta: its name, what it does, its stages in order
  name: string
  description: string
  phases: FlowPhase[]
  // The most rounds the args allow; absent when they set none
  cap?: number
  // The task the args gave, and the person's message that started it
  task: string
  words: string
  // The app's id of the session that runs it, and of the session that started that one
  session: string
  parent: string
  // Where the engine writes the run's journal and its agents' transcripts
  transcriptDir: string
  startedAt: number
  endedAt: number
  status: 'working' | 'done' | 'stopped' | 'failed'
  agents: FlowAgent[]
  // What the run returned, as the notice that it ended says it
  result: string
}

declare module 'claude-code' {
  interface PluginState {
    claudopus: { me: Shaped<Me>; todos: Shaped<Todo[]>; view: Shaped<View>; servers: Shaped<Server[]>; tick: Shaped<number>; drawn: Shaped<number>; shown: Shaped<boolean>; reports: Shaped<Report[]>; flows: Shaped<Flow[]>; others: Shaped<Shared[]>; ran: Shaped<string>; load: string }
  }
}
