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

// What a task made: a file or link of its own, by its kind (with the file's time when it was listed), and its code as a count of
// files and lines
export type MadeKind = 'picture' | 'video' | 'pdf' | 'sheet' | 'doc' | 'file' | 'link'
export type Made = { path: string; name: string; kind: MadeKind; at?: number }
export type CodeMade = { count: number; plus: number; minus: number }
export type FilesMade = { made: Made[]; code?: CodeMade }

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
  // The older model the app would have carried it on after a safety check flagged a message, which it was ended rather than run on
  flagged?: string
  // The model the engine first started it on, kept across reloads: a resume may come back on the model the app moved it to
  startedOn?: string
  // How many tool steps it has made
  steps?: number
  // The files its steps wrote, and the pictures, videos and documents its commands named: what it may have made
  wrote?: string[]
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
  // What it needs the person's own hands for now, said with the `ask` tool: what to do, and the exact text to copy for it. Its card
  // stands out with the ask in view until the work clears it or ends
  // `replied`: the person's reply in their own words that did not settle it; the ask stays while the work acts on it, with nothing to press or type, until the work clears it or asks again, or ends with it open, when every answer is back. `isWaking`: the work had ended and is being started again with the reply
  // `isCommand`: `copy` is a command the person types in a terminal opened in `cwd`. `choices` are buttons the person answers with, sent back to `from`, the agent that asked (a helper's ask shows on its work's card). `pictures` are the picture files the ask is about, shown with it in the chat. `details` is what the ask is about, in full, shown with it on the card and in the chat. `release`: the worktree folder a press on its first choice allows one release run for. `refused`: Claudopus's notice of a call Claude Code refused, whose answer tells the work to carry on without it and never starts ended work again
  ask?: { text: string; details?: string; release?: string; copy?: string; isCommand?: boolean; cwd?: string; choices?: string[]; pictures?: string[]; from?: string; at: number; refused?: boolean; replied?: { text: string; at: number; isWaking?: boolean } }
  // Admin commands it, or a helper of it, wants to run, each held until the person presses Allow or Deny on this card: the Mac
  // (`here` or an ssh host), the exact command, the agent that runs it, and whether Allow covers the whole piece of work
  // What waits for the person's press: an admin command, a release to main ('release'), or a change to a file of theirs ('file')
  // `isUndone`: a file of theirs a command changed, put back as it was (`isOutside`: found changed between commands, by an editor or a program left running); Allow makes the change again
  admins?: { id: string; host: string; command: string; at: number; from?: string; isWork?: boolean; kind?: 'release' | 'file'; isUndone?: boolean; isOutside?: boolean; call?: string; folder?: string; branch?: string }[]
  startedAt: number
  // When it first began, kept when it is started again (whose startedAt moves on so its time runs on): the cards keep their places by it
  begunAt?: number
  // 0 while it works
  endedAt: number
  // When its turn last ended with its answer, finished, while its own background work still held it; absent once it steps again.
  // Work stopped after that, by the chat, the panel or the engine, had finished: it ends done, not stopped
  answeredAt?: number
  // When its turn last ended by handing back its report: it has finished for good, so nothing it left running wakes it again
  handedBackAt?: number
  // When Claudopus received its report, handed back with SubagentHandback, as its turn ended: the one thing that makes it done
  reportAt?: number
  // The report Claudopus took from its hand-back, until the chat is given it with Claude Code's notice that the task ended; then
  // `reportGiven`, so a later notice of the same end repeats nothing, until a message starts it again
  reportForChat?: string
  reportGiven?: true
  // The hand-back call whose report Claudopus took, until the task takes a step of its own: what comes next is that call's result,
  // or Claude Code's press for a report it did not see delivered, answered with no model
  tookReport?: string
  // The call it has been running longest, while one runs: what it is in a few words, since when, and for a command, the command
  // and its own words for it
  running?: { what: string; at: number; cmd?: string; label?: string }
  // When something new last came back to it: a result holding a line it had not seen come back before
  newAt?: number
  // Set while nothing new has come back to it or any helper under it for a while: when something last did
  stuckAt?: number
  // The chat was told it is stuck (Claudopus's word that it made no progress, or that it did not hand back what it has): when.
  // Once per time it is flagged stuck
  stuckTold?: number
  // Finished work that its own background work still holds: since when the mod has seen it so. Absent once nothing holds it
  leftSince?: number
  // Kept as a card ends done: a command of its own that ends by itself was still in the background then, so while Claude Code
  // holds its run for it (leftSince) the card is shown waiting for its command, not Done
  leftOwn?: boolean
  // Only on a card as it is shown, never kept (shownAs): when a card kept as done ended, while something of its own still runs and
  // it is shown at work; and how many to-dos a card kept as done left, shown as not done
  wasDone?: number
  leftOpen?: number
  // When Claudopus saw it end done, under the rule that a card with to-dos left is not done: a card that ended before that rule
  // was kept, or ended where Claudopus never saw it, reads as it did then. Absent once it works again
  doneSeen?: number
  // What it started in the background itself that wakes it when it ends (a command, a watch): the engine's task id, what it is
  // in its own words, and since when, with the command itself. Dropped as it ends or is stopped
  bg?: { id: string; what: string; at: number; isWatch?: boolean; cmd?: string; expiresAt?: number }[]
  // What it ran in the background or detached that has ended, newest last: its words, when it began and ended, and how it ended
  // (finished, failed with its exit code, killed, timed out at the engine's limit, stopped by the work, or ended as far as the mod
  // can tell). Its card sums these up in a row, and Details lists them
  endedRuns?: { id: string; what: string; at: number; endedAt: number; how: 'finished' | 'failed' | 'killed' | 'timed out' | 'stopped' | 'ended'; code?: string; count?: number }[]
  // In another chat's file only: how each of its jobs stands as that chat last read it (its latest line, how far, its last lines),
  // by the job's id, so its Details shows them as that chat's own does
  seenJobs?: Record<string, { latest: string; pct?: string; done?: string; total?: string; wroteAt?: number; tail?: string[]; words?: string; isOwn?: boolean; isEarlier?: boolean; isEmpty?: boolean; target?: string }>
  // What it started detached (with nohup or setsid, its output to a log): its own words for it, since when, the command, the log
  // it writes and its process, while that runs. Kept past its end, as such a job outlives it
  // A run a command left going however it was started (a launcher's children, a job sent off with &, a pool), found by the
  // process group its command's shell led: `isLeft`, with its log only where its output goes to a file, and `from` the background
  // command that left it, when one did
  // The rules it was last handed after its brief, by their text's hash, and whether a compaction has taken them from its context
  rulesSent?: string
  rulesDue?: boolean
  // Its own folder in the chat's scratchpad, by name, which its rules name
  scratch?: string
  detached?: { id: string; what: string; at: number; cmd: string; log: string; pid?: string; isLeft?: boolean; from?: string }[]
  // Its heavy commands (a browser it drives, a build, a render) that wait their turn while the Mac is busy: the call, its own words,
  // the command, since when, and its place in the line of every piece of work's held commands
  heldCalls?: { id: string; what: string; cmd: string; at: number; place: number }[]
  // Its heavy command's turn came: until when its next heavy command runs at once
  heavyPass?: number
  // Work whose turn ended while what it started in the background still runs and that has not finished: since when it has waited
  // so. It is still at work, and its card says what it waits for
  waitsSince?: number
  // What it asked Claudopus to start it again for (wake_me), in place of a command that only waits: in its own words, a file to
  // appear, a line in that file, a page that answers, or only a time; when it asked, and the latest it is looked for
  wakeWhen?: { what: string; file?: string; text?: string; url?: string; at: number; until: number }
  // What it was last woken for when that look ran out, by its file, line and page: a look for the same again is refused
  wakeMissed?: { key: string; what: string }
  // When its step last ended with helpers of its still running; absent while it takes a step
  endedStepAt?: number
  // Its step ended while all its helpers sit silent: since when, and how many of the steps Claudopus takes on a fixed schedule are
  // done (1 a check-in at 12 minutes, 2 the order to hand back at 24, 3 the chat told it is stuck at 36). Starts over only when a
  // helper hands back a result or prints something new. `at`: when the last step was taken; steps come at least 12 minutes apart
  helperWait?: { from: number; done: number; at?: number }
  // Work whose step ended to wait with no helper at work (on its own command, a watch, or nothing Claudopus can see) and that nothing
  // started again: how many times Claudopus started it to look at what it waits on (`done`), when it last did (`at`), and what it
  // waited on then (`key`: its to-dos done, its commands ended and running), which starts the count over when it moves
  ownWait?: { key: string; done: number; at: number }
  // How many reminders Claudopus sent of what waits on the person on it (its question, or the Allow its commands wait for), waiting since `at`
  reminded?: { at: number; times: number }
  // Claudopus told it to hand back what it has (its wait ran out, or its helpers sat silent): since when. Its report goes through
  // while helpers run, until it hands back
  mayHandBack?: number
  // Work cut off as the chat's process ended, not stopped by anyone: when, and when it went on again; `backAt` is absent while it
  // could not be started again
  cutAt?: number
  backAt?: number
  // Work that stopped partway, with no report, no question for the person and nothing of its own that starts it again, that
  // Claudopus started again with a note to carry on: how many times in a row with little done between, how many in all, when
  // last, and its step count then; `gaveUp` when it stopped so too often, or could not be started again, and was left stopped
  carryOn?: { tries: number; total: number; at: number; steps: number; gaveUp?: number; isLost?: boolean }
  // How many times Claudopus kept it from ending its step while its to-dos were not done: in a row with no call between (`tries`,
  // its step count then `steps`), and in all since it last ticked a to-do (`total`, with how many were done then `done`)
  keptOn?: { tries: number; steps: number; total: number; done: number }
  // The to-dos not done it was told of when its report was refused, joined, and how many times its report was refused with them
  toldOpen?: { key: string; times: number }
  // When the person dismissed its card: it is under Finished, whatever it still asks, until the task works again
  closedAt?: number
  // The kind of agent it was started as (claudopus:task, general-purpose, fork…), when the chat started it
  kind?: string
  // The to-dos it handed back its report with still not done: shown on its card and added to its result
  notDone?: string[]
  // Work with helpers running: when the mod last looked in on them, how many ran and how many had shown nothing new for a while
  lookedIn?: { at: number; running: number; quiet: number }
  // A helper whose work was told it has shown nothing new: when it last had, so it is told once each quiet stretch
  quietTold?: number
  // A helper whose work was told it works through in order what could be split
  serialTold?: boolean
  // Stopped by the person's own press on Stop, on its card or a helper's: when. Until `isLifted`, set by their next message, the chat
  // or the work above it may not start it again, message it or start the same work afresh, and nothing of the mod's wakes it
  byYou?: { at: number; isLifted?: boolean }
  // Only work that is working has a card; one that has ended is kept, so a message to it brings its card back as it was
  status: 'working' | 'done' | 'stopped' | 'failed'
  // Set on a card another chat shares: that chat, the Mac it runs on when another (empty for this one), and the card's own id there.
  // Such a card is shown and answered here; its work is stopped, moved and read in its own chat
  chat?: { id: string; title: string; folder: string; host: string; agent: string }
}

// What one chat shares with the panels of the others, in ~/.claude/claudopus/live/<chat id>.json: its running work, and when it last
// said so. `host` is the Mac it was fetched from, empty for this one
export type Shared = { chat: string; title: string; folder: string; host: string; at: number; cards: Todo[]; helpers?: Todo[]; prompts?: Prompt[]; link?: Link }
// What opens a chat in the Claude app: its Remote Control id (session_…), which opens it from any Mac signed in to the same account,
// and the app's own id for it (local_…), which opens it only on the Mac it runs on
export type Link = { bridge: string; app: string }

// The app's own prompt open in a chat and waiting on the person: allow a command or a tool, answer its question, approve its plan.
// `id` is the tool call's, `text` the prompt's own short description, `title` the work it came from when not the chat's own thread,
// `at` when it opened. `link` on Shared opens that chat in the Claude app on its own Mac
// `kind` says what the person does (allow a call, answer a question, approve a plan), `text` asks it in one line, `about` says
// what it is for in the task's words, `detail` is what exactly (the command, the message, the page), shown whole. `isHeld` while the
// chat that raised it waits for a press on its block's Allow or Don't allow, which answers it as Claude Code's own box would.
// `card`: the task's card it is drawn on, when a task of this chat's raised it
export type Prompt = {
  id: string
  text: string
  title?: string
  at: number
  kind?: 'allow' | 'question' | 'plan'
  about?: string
  detail?: string
  isHeld?: boolean
  card?: string
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
  // What its task made, as listed when the result was saved
  made?: FilesMade
  // The work that wrote it; empty for one brought in by hand
  agent: string
  // Tells one text from another, so the same report is not kept twice
  mark?: string
  // The questions a result kept from before lists (`question`: an older one's single question): shown with it as plain text
  waiting?: { text: string }[]
  question?: string
  // The report the work that wrote this one was started from
  from?: string
  // When the person put it away: it leaves the list and the chat's note, and nothing in it waits; its text stays
  archived?: number
  // When they last brought it back: another Mac's marks follow the later of the two
  broughtBack?: number
}

// A command Claude Code refused a task, offered on its card's notice (`askAt`) to run on the person's press: the agent whose call
// it was (`from`), the command whole, the folder it runs in, what the task called it, and the longest it may run. Once pressed:
// when it started, its output file and the process group it runs as; once ended: when, how, and its exit, and while what it
// printed waits to start its ended task again, the task and the message (kept, so a reload sends it still)
export type PressRun = { card: string; from: string; askAt: number; command: string; cwd: string; description: string; limitMs: number; startedAt?: number; log?: string; pid?: string; endedAt?: number; end?: 'exited' | 'limit' | 'stopped' | 'lost'; exit?: number; last?: string; waiting?: { target: string; text: string } }

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
  // The bar the args gave, which says when it passes; absent when they gave none
  bar?: string
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
    claudopus: { me: Shaped<Me>; todos: Shaped<Todo[]>; view: Shaped<View>; servers: Shaped<Server[]>; tick: Shaped<number>; figures: Shaped<number>; drawn: Shaped<number>; shown: Shaped<boolean>; reports: Shaped<Report[]>; flows: Shaped<Flow[]>; others: Shaped<Shared[]>; ran: Shaped<string>; drafts: Shaped<Record<string, string>>; runs: Shaped<PressRun[]>; load: string }
  }
}
