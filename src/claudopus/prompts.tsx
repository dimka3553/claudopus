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
  if (tool === 'Write') return allow(`Write the file ${file(field('file_path')) || 'a file'}`, 'Claude saves the file, replacing any file of that name.', field('file_path'))
  if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
    return allow(`Change the file ${file(field('file_path') || field('notebook_path')) || 'a file'}`, 'Claude changes the file.', field('file_path') || field('notebook_path'))
  if (tool === 'Read') return allow(`Read the file ${file(field('file_path')) || 'a file'}`, 'Claude reads the file and changes nothing.', field('file_path'))
  if (tool === 'Glob' || tool === 'Grep') return allow(`Search files for ${cut(field('pattern'), 80) || 'a pattern'}`, 'Claude searches and changes nothing.', field('path'))
  if (tool === 'WebFetch') return allow(`Open a web page on ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'the web'}`, 'Claude reads the page and sends nothing but its address.', field('url'))
  if (tool === 'WebSearch') return allow(`Search the web for “${cut(field('query'), 80)}”`, 'Claude searches the web and reads the results.')
  if (tool === 'SendMessage') {
    const to = workNamed(field('to'))
    return {
      ...allow(
        to === 'its chat' ? 'Send a message to its chat' : `Send a message to ${to}`,
        to === 'its chat' ? 'its chat gets the message.' : 'that task gets the message and acts on it.',
        whole('message', 400) || field('summary'),
        isWork ? "No: it isn't sent, and Claudopus tells Claude you said no." : "No: it isn't sent, and the chat waits for what you say next.",
      ),
      done: 'Claude sent it',
    }
  }
  if (tool === 'Agent' || tool === 'Task')
    return { ...allow(`Start a task: ${cut(field('description'), 90) || 'with no title'}`, 'the task starts in the background and gets a card here.', whole('prompt', 300), isWork ? NO_TOLD : "No: it doesn't start, and the chat waits for what you say next."), done: 'Claude started it' }
  if (tool === 'TaskStop')
    return { ...allow(`Stop ${workNamed(field('task_id') || field('id'))}`, 'that task stops where it is.', '', isWork ? 'No: that task keeps running, and Claudopus tells Claude you said no.' : 'No: that task keeps running, and the chat waits for what you say next.'), done: 'Claude stopped it' }
  if (tool === 'Skill') return allow(`Use the skill “${field('skill') || field('name')}”`, 'Claude loads those instructions and follows them.')
  if (tool === 'AskUserQuestion') {
    const first = Array.isArray(given.questions) ? (given.questions[0] as { question?: unknown } | undefined)?.question : undefined
    return {
      text: typeof first === 'string' && first.trim() ? `Answer a question: ${cut(oneLine(first), 120)}` : 'Answer a question',
      kind: 'question',
      yes: 'Pick an answer: Claude gets it and carries on.',
      no: 'Skip it: Claude gets no answer and waits for what you say next.',
    }
  }
  if (tool === 'ExitPlanMode')
    return { text: 'Approve a plan', kind: 'plan', detail: whole('plan', 400), yes: 'Yes: Claude starts doing what the plan says.', no: 'No: Claude keeps planning. Say what to change.' }
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
  for (const one of due) await aloud($, 'prompt', `${one.title ?? chat} has a question for you`, one.text, `prompt-${one.id}`).catch(err => log($, `prompt not told: ${String(err)}`))
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
// It goes out only from inside one of the mod's hooks. Claude Code marks whatever a mod's code starts with that code's place: from
// inside a hook, only that one hook is left out of what the started task then does; from a timer or a button's own handler, with no
// hook around it, every hook of the mod is left out for the whole run the message starts. A task started so runs unseen: its panel
// tools answer "no tool.call hook answered", Claude Code's requests for its result are not answered for it, its commands and
// helpers are never taken up, and the end of its turn is never heard, so nothing starts it again (18 Nov: a task told to build was
// started again to carry on from a timer, ran unseen, was asked for its result until its run ended, and its card ended done with
// no build and no report). So a message sent from outside a hook waits here for the next hook that may send it, and Claudopus
// asks for a drawing, which is one; its sender waits with it and is told how it went, as from inside a hook. `isStill` says, as
// it goes, whether it is still wanted. With no such hook for HOOK_WAIT (no panel or bar drawn, nothing at work in the chat), it
// goes from the timer after all, saying so to the task, which then finishes without the panel instead of waiting unseen
type SendResult = Awaited<ReturnType<EngineInterface['session']['send']>>
type OwnMessage = { to: { agentId: string }; text: string }
const IN_HOOK = 'CLAUDOPUS_IN_HOOK'
const HOOK_WAIT = 60_000
const UNSEEN_RUN = `From Claudopus: this message starts you where Claudopus cannot see you, as nothing of its own ran for a minute to send it from. In this run its panel tools (todo, note, ask, wake_me, waits) do not answer, and nothing starts you again once your step ends. So do not end your step to wait for anything: do what you can now, then hand back your report with SubagentHandback, saying what is left.`
// Asked of the engine itself: the mod's own hook answers this name (promptHooks), and the engine leaves that hook out exactly
// where it would leave the mod's hooks out of a task started from here
const isInHook = async ($: EngineInterface) => (await $.env.get('CLAUDOPUS_IN_HOOK').catch(() => undefined)) === 'hook'
type HeldSend = { message: OwnMessage; isStill?: () => Promise<boolean>; resolve: (r: SendResult) => void; reject: (err: unknown) => void; result?: Promise<SendResult> }
const heldSends: HeldSend[] = []
const sendOwnNow = async ($: EngineInterface, message: OwnMessage) => {
  const since = await $.clock.now()
  try {
    return await $.session.send(message)
  } finally {
    ownSent($, since)
  }
}
const sendOwn = async ($: EngineInterface, message: OwnMessage, isStill?: () => Promise<boolean>): Promise<SendResult> => {
  if (await isInHook($)) return sendOwnNow($, message)
  // (the same words for the same task wait once: a look that comes round again while they wait joins them)
  const same = heldSends.find(one => one.message.to.agentId === message.to.agentId && one.message.text === message.text)
  if (same?.result) return same.result
  const one: HeldSend = { message, isStill, resolve: () => undefined, reject: () => undefined }
  one.result = new Promise<SendResult>((resolve, reject) => ((one.resolve = resolve), (one.reject = reject)))
  heldSends.push(one)
  redraw($)
  void log($, `a message for ${message.to.agentId} waits for a hook of the mod: sent from here, the task would run unseen by Claudopus`)
  $.clock.after(HOOK_WAIT, () => {
    const at = heldSends.indexOf(one)
    if (at < 0) return
    heldSends.splice(at, 1)
    // (a copy of the mod a reload replaced sends nothing: the copy in charge takes its tasks up)
    void isReplaced($).then(isOld => {
      if (isOld) return one.resolve({ isDelivered: false, reason: 'this copy of the mod was replaced by a reload' } as SendResult)
      void log($, `the message for ${message.to.agentId} goes from a timer after all: no hook of the mod came in ${HOOK_WAIT / 1000} s, so its task runs unseen and is told so`)
      void sendOne($, one, `${message.text}\n\n${UNSEEN_RUN}`)
    })
  })
  return one.result
}
// (never to a task the person stopped while it waited, nor one no longer wanted)
const sendOne = async ($: EngineInterface, { message, isStill, resolve, reject }: HeldSend, text = message.text) => {
  const id = message.to.agentId
  if (stoppedHere.has(id) || isHeld((await read($, todos)).find(card => card.id === id))) return resolve({ isDelivered: false, reason: 'the person stopped it meanwhile' } as SendResult)
  if (isStill && !(await isStill().catch(() => false))) return resolve({ isDelivered: false, reason: 'no longer wanted by the time it could be sent' } as SendResult)
  await sendOwnNow($, { ...message, text }).then(resolve, reject)
}
// Sends what waits, from inside the hook that calls it: a drawing of the bar or the panel, a press, a reply, a change in how full
// the chat is, and a hook kept only for this before each tool call (promptHooks). Never from a tool call's hook, nor from the hooks that hear a turn end or a message come:
// the engine leaves the hook a message is sent from out of the run it starts, and a task must keep those
let isSendingHeld = false
const sendHeld = async ($: EngineInterface) => {
  if (!heldSends.length || isSendingHeld) return
  isSendingHeld = true
  try {
    if (!(await isInHook($)) || (await isReplaced($))) return
    // (a sender told how its message went may send its next, as a row of tasks started again one after another: that goes from
    // this hook too, so the hook stays a moment for it)
    for (let idle = 0; idle < 4; idle += 1) {
      for (let one = heldSends.shift(); one; one = heldSends.shift()) {
        idle = 0
        await sendOne($, one)
        await log($, `the message that waited for ${one.message.to.agentId} went from a hook: its task runs where Claudopus sees it`)
      }
      await $.clock.now().catch(() => undefined)
    }
  } finally {
    isSendingHeld = false
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

// ---- A call Claude Code refused a background task with no prompt for the person: a notice on the task's card ----
// A background task or helper has no box of the app's own: Claude Code's auto mode, its safety checks, or a call that needs a person
// in a run nobody can be asked in refuse the call outright, and no PermissionRequest is raised for it (16 Nov: 47 refusals that
// way, none put to the person). Its task's card says what was refused and why, and that the task carries on without it. Claudopus
// never lets a refused call through, and nothing it says invites the task to reach what was refused another way
const CARRY_ON = 'Carry on without it'
// Claude Code's own refusals, as its result or its deny begins (its texts in 2.1.325), and who refused, for the card
const CC_REFUSALS: [string, string][] = [
  ['Permission for this action was denied by the Claude Code auto mode classifier', "Claude Code's auto mode blocked it"],
  ['Permission for this command was denied by a built-in Claude Code safety check', 'a built-in Claude Code safety check blocked it'],
  ['Permission for this tool use was denied. It requires approval, and this session has no approval surface', "it needs your OK, and Claude Code can't ask you in a background task"],
  ['Permission for this tool use was denied: it requires interactive approval', "it needs your OK, and Claude Code can't ask you in a background task"],
  ['no approval surface in this session', "it needs your OK, and Claude Code can't ask you in a background task"],
  ['nobody can be asked in this headless run', "it needs your OK, and Claude Code can't ask you in a background task"],
]
// A check that gave no verdict is no refusal: Claude may try again as it is
const NO_VERDICT = /gave no verdict|transient failure/i
// Only Claude Code's own refusal counts, never a failing call whose output holds the same words (a search, a test); the reason kept
// is only what Claude Code gave in its "Reason: [...]", never the rest of its words, which are for the model
const refusalOf = (r: { deny?: unknown; result?: unknown; text?: unknown; isError?: unknown } | undefined): { who: string; reason: string } | undefined => {
  if (!r) return undefined
  const said = [r.deny, ...(r.isError ? [r.result, r.text] : [])].map(one => (typeof one === 'string' ? one.trim() : '')).filter(Boolean)
  for (const words of said) {
    const found = CC_REFUSALS.find(([start]) => words.startsWith(start))
    if (!found || NO_VERDICT.test(words)) continue
    const reason = /^[^\n]*?Reason: \[([^\]\n]{1,200})\]/.exec(words)?.[1] ?? ''
    return { who: found[1], reason: cut(oneLine(reason), 120) }
  }
  return undefined
}
const refusedByClaudeCode = async ($: EngineInterface, agent: string, tool: string, call: Record<string, unknown>, r: Parameters<typeof refusalOf>[0]) => {
  const refusal = refusalOf(r)
  if (!refusal || !dir || isOff) return
  const list = await read($, todos)
  const top = list.find(one => one.id === topOf(list, agent))
  const own = list.find(one => one.id === agent)
  if (!top || top.chat) return
  const what = promptOf(tool, call, list, true)
  const who = own?.parentId ? `a helper of this task ("${titleOf(own)}")` : 'this task'
  const text = cut(`Claude Code blocked ${who}: ${what.text}.`, ASK_TEXT)
  // A command is shown whole, to copy or for the person to run on their own press (runit.tsx)
  const runnable = runnableOf(tool, call)
  const details = [
    what.detail && !runnable ? `What it is: ${what.detail}` : '',
    `Why: ${refusal.who}${refusal.reason ? ` (${refusal.reason})` : ''}.`,
    runnable ? runDetails() : "Claude carries on without it and won't try another way.",
  ]
    .filter(Boolean)
    .join('\n\n')
  const at = await $.clock.now()
  // A question waiting on the person, there already or put up meanwhile, is never replaced: the refusal is in the task's own result
  let isPut = false
  const command = runnable ? { copy: runnable.command, isCommand: true, cwd: runnable.cwd } : {}
  await change($, agent, one => ((isPut = !one.ask), one.ask ? one : { ...one, ask: { text, details, ...command, choices: [CARRY_ON], from: agent, at, refused: true } }))
  if (!isPut) return void (await log($, `refusal of ${tool} for ${agent} not put on its card: its card asks something already`))
  if (runnable) await offerRun($, top.id, agent, at, runnable)
  await log($, `refusal of ${tool} for ${agent} put to the person on its card`)
  const card = (await read($, todos)).find(one => one.id === top.id)
  if (card) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
  if (card) await askInChat($, card).catch(err => log($, `ask not shown in the chat: ${String(err)}`))
}
// What the task is told of the person's answer to that card: what was refused stays refused
const REFUSAL_ANSWERED = (asked: string, said: string, isReply: boolean) =>
  `${isReply ? `${who(true)} replied, in their own words, to the notice that Claude Code refused your call ("${asked}"): ${said}` : `${who(true)} saw the notice that Claude Code refused your call ("${asked}").`} What Claude Code refused stays refused: do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.`

const OWN_CALLS = ['SendMessage', 'TaskStop']
const isOwnCall = (next: { origin?: { plugin?: string } }) => next.origin?.plugin === 'claudopus'

const promptHooks = (on: On) => {
  // Answers only where the mod's hooks run for what its code starts here (isInHook)
  on('env.get', ($, e, next) => ((e as unknown as { name?: string }).name === IN_HOOK ? ({ value: 'hook' } as never) : next(e)))
  // A hook that does nothing else, before each tool call of the chat's or of any task's: what waits to start a task again goes from
  // here while anything is at work, and the task it starts loses no hook it needs, as the engine leaves out of its run only the
  // hook the message was sent from (sendHeld)
  on('classic.PreToolUse', async ($, e, next) => {
    if (heldSends.length) await sendHeld($).catch(err => log($, `message not sent: ${String(err)}`))
    return next(e)
  })

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

