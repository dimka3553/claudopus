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
  // The to-do panel has opened by itself once: closed, it stays closed until asked for
  isListOpened: boolean
  // The size of this chat's context window, in tokens; `tokens` is how much of it is used
  window: number
}

// One line of ~/.claude/claudopus/index.md: a subject of work and where it stands
export type Stream = { name: string; repo: string; session: string; state: string; summary: string }

// One line kept under a to-do: where the work said it stood, or what the person said to steer it, or what became of something
// pressed on its card ('event', Claudopus's words, never the work's). The card's line shows the last the work wrote itself.
// In the work's chat a steer goes before the line the work wrote next
// A message of the person's to the task (a steer from its card or the chat) is followed until the task reads it: `isUnread` from when
// it is sent, then `readAt`, the first model step of the task's that held it; `isNow` when the person stopped the task's step to send it
export type Entry = { at: number; kind: 'note' | 'decision' | 'steer' | 'event'; text: string; step?: number; isUnread?: boolean; readAt?: number; isNow?: boolean }

// One thing the work set out to do under its to-do; `doing` is the one it is on now, at most one at a time
export type Talk = { by: 'you' | 'task'; text: string }
export type Item = { text: string; state: 'open' | 'doing' | 'done' | 'dropped' }

// What a task made: a file or link of its own, by its kind (with the file's time when it was listed), and its code as a count of
// files and lines, with each file it changed in a repo (its path, the part of it inside the repo, the lines added and removed, and
// whether it is new since the task began) and the time it is counted from, in seconds
export type MadeKind = 'picture' | 'video' | 'pdf' | 'sheet' | 'doc' | 'file' | 'link' | 'artifact'
export type Made = { path: string; name: string; kind: MadeKind; at?: number }
export type CodeFile = { path: string; inRepo: string; plus: number; minus: number; isNew?: boolean }
export type CodeMade = { count: number; plus: number; minus: number; files?: CodeFile[]; since?: number }
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
  // The files and links every result of its named, the links every step's words named as made, and the pull requests, releases
  // and pages its commands put up, the oldest first: what it made, kept for its whole life however often it starts again
  said?: string[]
  // The titles the Claude artifacts it published were given, by their link
  titles?: Record<string, string>
  // What it made as last listed, kept with it: a changed file no longer there (in a worktree taken away once merged) stays listed
  made?: FilesMade
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
  // A task's question for a key: drawn as the key's box, with its question, on the card at once (boxes.tsx)
  keyAsk?: { name: string; text: string; details: string; from: string; at: number }
  // The task's earlier questions for a key not answered yet, oldest first: each its own box on the card beside the newest (keyAsk)
  keyAsksBefore?: { name: string; text: string; details: string; from: string; at: number }[]
  ask?: { text: string; details?: string; release?: string; copy?: string; isCommand?: boolean; cwd?: string; choices?: string[]; pictures?: string[]; from?: string; at: number; isResult?: boolean; refused?: boolean; rule?: string; replied?: { text: string; at: number; isWaking?: boolean }; talk?: Talk[] }
  // The questions asked before `ask` that are not answered yet, oldest first: every one stays on the card with its own buttons, box
  // or command until it is answered, and `ask` is always the newest of them (common.tsx, withAsks)
  asksBefore?: NonNullable<Todo['ask']>[]
  // Admin commands it, or a helper of it, wants to run, each held until the person presses Allow or Deny on this card: the Mac
  // (`here` or an ssh host), the exact command, the agent that runs it, and whether Allow covers the whole piece of work
  // What waits for the person's press: an admin command, a release to main ('release'), or a change to a file of theirs ('file')
  // `isUndone`: a file of theirs a command changed, put back as it was (`isOutside`: found changed between commands, by an editor or a program left running); Allow makes the change again
  // `talk`: what the person wrote on it with Answer in words, and the task's answers, the oldest first. A release's `reason` is the task's one line for it (bin/release -m), `commits` the subjects of its branch's commits main lacks, newest first, `more` how many more there are, `files` how many files it changes
  admins?: { id: string; host: string; command: string; at: number; from?: string; isWork?: boolean; kind?: 'release' | 'file'; isUndone?: boolean; isOutside?: boolean; call?: string; folder?: string; branch?: string; talk?: Talk[]; reason?: string; commits?: string[]; more?: number; files?: number }[]
  startedAt: number
  // Its place in the task colours' palette: given once, the colour least used by the tasks started just before it, so tasks seen
  // together differ
  colour?: number
  // When it first began, kept when it is started again (whose startedAt moves on so its time runs on): the cards keep their places by it
  begunAt?: number
  // 0 while it works
  endedAt: number
  // Why it failed, in a few plain words its card says after Failed
  why?: string
  // When its result was received: handed in with SubagentHandback, or its run's last words where Claude Code took those as its
  // result. The one thing that lets its card be done
  reportAt?: number
  // The report Claudopus took from its hand-back, until the chat is given it with Claude Code's notice that the task ended; then
  // `reportGiven`, so a later notice of the same end repeats nothing, until a message starts it again
  reportForChat?: string
  reportGiven?: true
  // The parts of its result it handed in while still at work (the `report` tool), each kept as a result of its own, until the chat
  // is given them with the message Claudopus sends it for them, or with the next message or notice that comes first
  partsForChat?: string[]
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
  // Its tries again after a step stopped by a passing network error, within the last half hour, and while one is due: when, and the
  // error in a few words (retryLater)
  retry?: { tries: number[]; at?: number; why?: string }
  // What it started in the background itself, as Claude Code tracks it (a command, a watch, a server): the engine's task id, what
  // it is in its own words, and since when, with the command itself. Dropped as it ends or is stopped; a server stays under a done card
  // `named`: its title and kind in plain words, as the small model said them (naming.tsx)
  bg?: { id: string; what: string; at: number; isWatch?: boolean; cmd?: string; expiresAt?: number; named?: { title?: string; kind?: string } }[]
  // What it ran in the background that has ended, newest last: its words, when it began and ended, and how it ended
  // (finished, failed with its exit code, killed, timed out at the engine's limit, stopped by the work, or ended as far as the mod
  // can tell). Its card sums these up in a row, and Details lists them
  endedRuns?: { id: string; what: string; at: number; endedAt: number; how: 'finished' | 'failed' | 'killed' | 'timed out' | 'stopped' | 'ended'; code?: string; count?: number; kind?: 'server' | 'download' | 'upload' | 'script' | 'remote' | 'watch'; why?: string; file?: string; cmd?: string; named?: { title?: string; kind?: string; why?: string } }[]
  // In another chat's file only: how each of its jobs stands as that chat last read it (its latest line, how far, its last lines),
  // by the job's id, so its Details shows them as that chat's own does
  seenJobs?: Record<string, { latest: string; pct?: string; done?: string; total?: string; wroteAt?: number; tail?: string[]; words?: string; isOwn?: boolean; isEarlier?: boolean; isEmpty?: boolean; target?: string; now?: string }>
  // Its own folder in the chat's scratchpad, by name, which its rules name
  scratch?: string
  // The worktree its command made (`git worktree add`), and its branch: what a fresh task carrying it on is told is its own
  worktree?: string
  branch?: string
  // Cut off by the app's close and carried on by a fresh task: that task's id. Its card is under Finished from then
  carriedTo?: string
  // Stopped with no Stop of the person's or the chat's, as when the app quits and stops every task: one that stopped so as its
  // chat's process ended is taken for cut off by the next process, never for stopped
  stoppedUnasked?: true
  // How many reminders Claudopus sent of what waits on the person on it (its question, or the Allow its commands wait for), waiting since `at`
  reminded?: { at: number; times: number }
  // When the person dismissed its card: it is under Finished, whatever it still asks, until the task works again
  /** Ended, and kept up among the cards until the person dismisses it: nothing else moves it under Finished */
  up?: true
  closedAt?: number
  // What its result leaves open for the person, a line each, from its last note, and the buttons that answer them: as it hands in its
  // result they become its question (resultAsk), so the card waits for the person as any question does
  questions?: string[]
  questionChoices?: string[]
  // The kind of agent it was started as (claudopus:task, general-purpose, fork…), when the chat started it
  kind?: string
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
export type PressRun = { card: string; from: string; askAt: number; command: string; cwd: string; description: string; limitMs: number; startedAt?: number; log?: string; pid?: string; endedAt?: number; end?: 'exited' | 'limit' | 'stopped' | 'lost'; exit?: number; last?: string; waiting?: { target: string; text: string; isLost?: boolean } }

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
    claudopus: { me: Shaped<Me>; todos: Shaped<Todo[]>; view: Shaped<View>; servers: Shaped<Server[]>; tick: Shaped<number>; figures: Shaped<number>; drawn: Shaped<number>; shown: Shaped<boolean>; reports: Shaped<Report[]>; flows: Shaped<Flow[]>; others: Shaped<Shared[]>; ran: Shaped<string>; drafts: Shaped<Record<string, string>>; runs: Shaped<PressRun[]>; progress: Shaped<number>; listSeen: Shaped<string[]>; load: string }
  }
}
