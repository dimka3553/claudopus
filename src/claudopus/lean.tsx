// Smaller starts and the chat's quicker ways: the mod's own kinds of agent, each with only the tools its work takes, the models they
// run on, the single command the chat runs itself, the copy of the chat for a small job, and the repeated notice left out

// What every kind of the mod's agents is told before its task, in place of the engine's own agent prompt
const AGENT_HEAD =
  'You are an agent of Claude Code, working in the background on a task you are given. Use the tools you have to do it fully: no more than it asks, and not half done. Read files you know you need yourself; send calls that need nothing from each other together. Paths you give are absolute. When you are done, give your report: what was done, what you found, and what is not done or not checked, short, with the file paths that matter. Use no emojis.'
// The panel's tools, which work keeps its card with, and the handback its report goes through. Each kind told to call `wake_me`
// rather than wait has it: a task and a quick task to be started again, a helper to be told to hand back what it waits for instead
const PANEL_TOOLS = ['mcp__claudopus__todo', 'mcp__claudopus__note', 'mcp__claudopus__ask', 'mcp__claudopus__waits', 'mcp__claudopus__update', 'mcp__claudopus__recall', 'mcp__claudopus__wake_me']
const READ_TOOLS = ['Read', 'Grep', 'Glob', 'Bash', 'WebFetch', 'WebSearch', 'ToolSearch', 'SubagentHandback']
// ToolSearch loads the ones among these the engine holds back until asked (Monitor, SendMessage, TaskStop and the like)
const WORK_TOOLS = ['Bash', 'Read', 'Edit', 'Write', 'Grep', 'Glob', 'NotebookEdit', 'Agent', 'SendMessage', 'TaskStop', 'Monitor', 'WebFetch', 'WebSearch', 'ToolSearch', 'SubagentHandback', ...PANEL_TOOLS]
// The kinds, by their short name: the engine names each `claudopus:<name>`
const KINDS = {
  task: { description: 'A background task the chat starts: builds, fixes, researches, releases. Starts with only its working tools.', tools: WORK_TOOLS, prompt: AGENT_HEAD },
  quick: {
    description: 'A small fresh task of a few steps: a push and a look at the build, a merge, a quick look-up. Starts small.',
    tools: WORK_TOOLS,
    prompt: `${AGENT_HEAD}\nThis is a small job: do it in as few steps as it takes.`,
  },
  helper: { description: "A task's helper that builds a part beside others, on the task's own model.", tools: WORK_TOOLS.filter(one => one !== 'mcp__claudopus__update' && one !== 'mcp__claudopus__waits'), prompt: AGENT_HEAD },
  reader: {
    description: "A task's helper that only searches and reads, and reports what it concluded.",
    tools: READ_TOOLS,
    prompt: `${AGENT_HEAD}\nYou only search and read: you change no file. Run only commands that read (git log, ls, a search). Report what you concluded and where, not the files themselves.`,
  },
  check: {
    description: 'A second agent that did not build the work, and looks for what is wrong with it before the person sees it.',
    tools: [...READ_TOOLS.filter(one => one !== 'SubagentHandback'), 'Agent', 'SendMessage', 'TaskStop', 'Monitor', 'mcp__claudopus__todo', 'mcp__claudopus__note', 'mcp__claudopus__ask', 'SubagentHandback'],
    prompt: `${AGENT_HEAD}\nYou check work someone else built: look for what is wrong with it, from the change itself (the diff) and the pictures you are given, which you look at. You fix nothing. Report each fault you find with where it is and why it is wrong, most serious first, and say plainly what you did not check.`,
  },
} as const
type Kind = keyof typeof KINDS
const KIND_OF = (type: string): Kind | undefined => {
  const name = /^claudopus:(\w+)$/.exec(type)?.[1]
  return name && name in KINDS ? (name as Kind) : undefined
}
// Registered as the session starts; a failure is logged, and the chat's rules still name `general-purpose` for what needs everything
const registerKinds = async ($: EngineInterface) => {
  for (const [name, kind] of Object.entries(KINDS))
    await $.agent
      .register({ name, description: kind.description, prompt: kind.prompt, tools: kind.tools })
      .then(r => log($, `agent kind ${(r as { agent?: string }).agent ?? name} registered`))
      .catch(err => log($, `agent kind ${name} not registered: ${String(err)}`))
}
// What a start of one of the mod's kinds becomes under the settings: everything for all of them when Tasks start with Everything; a
// reader on Sonnet, or on its parent's model; a check on a model never weaker than what built it, the strongest when chosen
const kindStart = (e: { subagentType?: string; model?: string; parentModel?: string; fork: boolean; workflow?: unknown; resume?: unknown }): { subagentType?: string; model?: string } => {
  if (e.fork || e.workflow || e.resume) return {}
  const kind = KIND_OF(e.subagentType ?? '')
  if (!kind) return {}
  const type = lean.start === 'all' ? { subagentType: 'general-purpose' } : {}
  const parent = rightModel(String(e.parentModel ?? '')) ?? String(e.parentModel ?? '')
  if (kind === 'reader') return { ...type, model: lean.readers === 'own' ? parent || undefined : modelsIn(models, lean).legwork }
  if (kind === 'check') {
    if (lean.checker === 'strongest') return { ...type, model: newestModel('Fable') ?? 'fable' }
    const asked = (e.model ?? '').trim()
    const least = rankOf(parent) >= RANK.Opus! ? parent : (newestModel('Opus') ?? 'opus')
    return { ...type, model: asked && asked !== 'inherit' && rankOf(rightModel(asked) ?? asked) >= rankOf(least) ? asked : least }
  }
  if (kind === 'quick') return { ...type, model: e.model?.trim() || quickModel(models, lean) }
  return type
}

// ---- The single command the chat runs itself ----

// The longest a command the chat runs may take: it is stopped then
const CHAT_COMMAND_MS = 10 * 60_000
// How many of its last lines come back with its end
const CHAT_TAIL = 3
// A command the chat may run itself: one command, with nothing joined to it or sent into a file
const isOneCommand = (command: string) => {
  const text = command.trim()
  if (!text || /\n/.test(text)) return false
  // anywhere, quoted or not: no command run inside it (a shell runs $( ) and backticks in double quotes too); outside quotes: no
  // joining, piping or sending into a file
  if (/`|\$\(|<\(|>\(/.test(text)) return false
  const bare = text.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, '""')
  return shellWords(text).length === 1 && !/[;&|<>]/.test(bare)
}
// What the chat's own command may not be: a file read or search, which the chat does with Read, Grep and Glob, one that names a saved
// paste (the agent that needs it reads it), and a runner of the mod's (an admin command, a key, a release), which a task runs
// It changes no file: only git's and gh's looks and a push or fetch, and a few that only say how things stand. Anything else (a
// script, a deploy, a file moved or removed, a merge, a pull) goes to a task
const CHAT_GIT = ['push', 'fetch', 'status', 'log', 'diff', 'show', 'branch', 'remote', 'rev-parse', 'ls-remote', 'describe', 'shortlog', 'blame']
const CHAT_GH = ['view', 'list', 'status', 'checks', 'diff']
const CHAT_LOOKS = ['ls', 'pwd', 'date', 'uptime', 'whoami', 'hostname', 'df', 'sw_vers', 'uname', 'which']
const isChatRunnable = (command: string, branch = '') => {
  if (!isOneCommand(command) || RUNNER_NAMED.test(command) || /claudopus\/p\W?stes|\bpastes\b/.test(command)) return false
  // nothing the shell fills in or spreads out: no variables, braces, globs, escapes, home or history
  if (/[$\\{}*?[\]~!]/.test(command)) return false
  const words = shellWords(command)[0] ?? []
  const head = words[0] ?? ''
  const rest = words.slice(2)
  if (head === 'git') {
    // the verb straight after git: no -c, -C or --config-env before it, which set what git runs
    const verb = words[1] ?? ''
    if (!CHAT_GIT.includes(verb) || rest.some(one => /^--(?:output|exec|upload-pack|receive-pack|config-env|push-option|ext-diff|textconv)\b|^-o$/.test(one))) return false
    // git branch only lists; git remote only shows
    if (verb === 'branch' && rest.some(one => !/^(?:-a|-r|-v|-vv|--all|--remotes|--list|--show-current|--merged|--no-merged|--contains)$/.test(one))) return false
    if (verb === 'remote' && !(rest.length === 0 || (rest.length === 1 && rest[0] === '-v') || (['get-url', 'show'].includes(rest[0] ?? '') && rest.length === 2))) return false
    // a push or fetch of plain names only: no refspec, no force, delete, all or mirror, and never from main itself
    if (verb === 'push' || verb === 'fetch') {
      if (rest.some(one => one.includes(':') || /^\+/.test(one) || /^-/.test(one) && !/^(?:-u|--set-upstream|-q|--quiet|--prune|-p|--tags)$/.test(one))) return false
      if (verb === 'push' && (!branch || /^(?:main|master|HEAD)$/.test(branch) || rest.some(one => /^(?:main|master|HEAD|@)$/.test(one) || /^--tags$/.test(one)))) return false
    }
    return true
  }
  if (head === 'gh') return ['pr', 'run', 'issue', 'release', 'repo', 'workflow'].includes(words[1] ?? '') && CHAT_GH.includes(words[2] ?? '') && !words.some(one => /^--(?:web|output)\b|^-w$/.test(one))
  return CHAT_LOOKS.includes(head)
}
const NOT_ONE_COMMAND =
  'Not run: the chat runs only a single command with nothing joined to it (no `&&`, `;`, `|`, `>`, `$( )` or backticks), and only one that changes no file: a push, a fetch, or a look with git or gh. Start a task for anything else.'
// The chat's own commands under way, by their background id: when each started and what it was
const chatCommands = new Map<string, { at: number; command: string; description: string }>()
// The background id a command sent to the background answers with, as the engine writes it
const backgroundIdOf = (result: unknown): string => {
  const r = result as { backgroundTaskId?: unknown } | undefined
  if (typeof r?.backgroundTaskId === 'string') return r.backgroundTaskId
  return /\bID:\s*([\w-]+)/.exec(typeof result === 'string' ? result : JSON.stringify(result ?? ''))?.[1] ?? ''
}
// Started by the chat: in the background, stopped by Claudopus at its limit
const chatCommandStarted = async ($: EngineInterface, call: { command?: unknown; description?: unknown }, result: unknown) => {
  const id = backgroundIdOf(result)
  if (!id) return
  chatCommands.set(id, { at: await $.clock.now(), command: String(call.command ?? ''), description: String(call.description ?? '') })
  await log($, `the chat's own command started in the background (${id})`)
  afterLoad($, CHAT_COMMAND_MS, () => {
    if (!chatCommands.has(id)) return
    void $.tool
      .call({ tool: 'TaskStop', task_id: id } as never)
      .then(() => log($, `the chat's own command ${id} stopped at its 10-minute limit`))
      .catch(() => undefined)
  })
}
// What the chat is told as its command ends: how it ended and its last lines, so it reads no output file
const chatCommandEnded = async ($: EngineInterface, text: string): Promise<string[]> => {
  const told: string[] = []
  for (const m of text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g)) {
    const body = m[1] ?? ''
    const id = /<task-id>([^<]+)<\/task-id>/.exec(body)?.[1] ?? ''
    const run = chatCommands.get(id)
    if (!run) continue
    chatCommands.delete(id)
    const file = /<output-file>([^<]+)<\/output-file>/.exec(body)?.[1] ?? ''
    const status = /<status>([^<]+)<\/status>/.exec(body)?.[1] ?? ''
    const summary = /<summary>([^<]+)<\/summary>/.exec(body)?.[1] ?? ''
    const raw = file ? (await readOr($, file)).replace(/\s+$/, '').split('\n').slice(-CHAT_TAIL).join('\n') : ''
    // with every kept key hidden, as in any tool's answer; withheld when that could not be checked
    if (raw) await knowKept($, true)
    const hidden = raw ? await hiddenJson($, JSON.stringify(raw)) : JSON.stringify('')
    const lines = hidden === undefined ? ["(withheld: Claudopus couldn't check them for saved keys)"] : [String(JSON.parse(hidden))]
    const isLate = (await $.clock.now()) - run.at >= CHAT_COMMAND_MS
    told.push(`Your command "${run.description || cut(oneLine(run.command), 80)}" ${isLate ? 'was stopped at its 10-minute limit' : `ended (${summary || status})`}. Its last lines:\n${lines.join('\n') || '(nothing printed)'}\nTell ${who()} from this; do not read its output file.`)
  }
  return told
}

// ---- The copy of the chat for a small job ----

// A copy takes about this many steps before it hands what is left to a fresh task
const FORK_STEPS = 10
// What a copy is told as it starts: it is a task now, with the rules every task follows, and how long it may go
const FORK_HEAD = () =>
  named(`You are a copy of the chat, started for one small job: you are now a background task, not the chat. The chat's rules for what it may run do not apply to you; the rules for every task below do. You start no helpers and message no other task. Do the job in at most about ${FORK_STEPS} steps. If it needs more, hand what is left to a fresh task with the \`note\` tool and its \`task\` (the chat starts it), and end with your report.`)
const FORK_PAST = () =>
  named(`Not run: this copy of the chat has taken its ${FORK_STEPS} steps. Hand what is left to a fresh task now: call the \`note\` tool with \`task\` set to what is left, in one line with the folder and what done looks like, send the message it gives you to the chat, then end with your report of what you did and what you handed on.`)
const FORK_ALONE = () => named('Not run: a copy of the chat does its small job itself, with no helper and no other task. If the job needs more, hand what is left to a fresh task with the `note` tool and its `task`, send the message it gives you to the chat, and end with your report.')
// The tools a copy past its steps may still call: the ones that hand on what is left and end it
const FORK_ENDING = ['mcp__claudopus__note', 'mcp__claudopus__todo', 'mcp__claudopus__waits', 'mcp__claudopus__update', 'SubagentHandback', 'ToolSearch']
// and SendMessage to the chat alone, which the note's hand-on goes through
const isForkEnding = (e: { tool: string; to?: unknown }) => FORK_ENDING.includes(e.tool) || (e.tool === 'SendMessage' && String(e.to ?? '') === 'main')

// ---- The repeated notice ----

// The engine's notice that a task stopped after its report came as a message: "it is not repeated here". It woke the chat for a turn
// with nothing new (359 turns over 13-16 Nov), so a notice that says only that, for tasks whose report came, is left out
const isRepeatOnly = (text: string) => {
  const notices = [...text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g)]
  if (!notices.length) return false
  const rest = text.replace(/<task-notification>[\s\S]*?<\/task-notification>/g, '').replace(/\[SYSTEM NOTIFICATION[\s\S]*$/, '').trim()
  return !rest && notices.every(m => /<status>completed<\/status>/.test(m[1] ?? '') && /not repeated here/.test(m[1] ?? ''))
}

// ---- The last step on a go-ahead ----

// A go-ahead to finish (Release it) on work that has ended: its last step is done without starting the work again. A repo with a
// `.release` released by Claudopus itself, with no model, after the same allow box on the card a release always waits for; any other
// step by a small fresh task given the folder, the branch and the step. The work is started again only when the step fails in a way
// that needs what it knows
const RELEASE_STEP = /^\s*(?:release|run (?:the )?release(?: runner)?|(?:cd \S+ && )?\S*bin\/release)\s*\.?\s*$/i
// How often a release Claudopus runs is looked at, and the longest it is waited for
const STEP_LOOK = 10_000
const STEP_LONGEST = 90 * 60_000
const stepLine = async ($: EngineInterface, id: string, text: string) => {
  const at = await $.clock.now()
  await changeTodos($, list => list.map(card => (card.id === id ? { ...card, entries: [...card.entries, { at, kind: 'note' as const, text }].slice(-ENTRIES_KEPT) } : card)))
  redraw($)
}
const lastStep = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string) => {
  const folder = ask.folder ?? ''
  const step = ask.lastStep ?? ''
  const git = (args: string[]) => $.process.run(['git', '-C', folder, ...args], { timeoutMs: 15_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '')
  const repo = await git(['rev-parse', '--show-toplevel'])
  const branch = await git(['rev-parse', '--abbrev-ref', 'HEAD'])
  const wakeText = `${who(true)} pressed "${said}" in answer to your question: ${ask.text}\n${RESUMED_BY_ANSWER}`
  const isFixed = Boolean(repo && branch && branch !== 'HEAD' && RELEASE_STEP.test(step) && (await $.fs.stat(`${repo}/.release`).catch(() => undefined))?.kind === 'file')
  await log($, `last step of ${one.id} on ${who()}'s go-ahead: ${isFixed ? 'the release, run by Claudopus' : 'a small fresh task'}`)
  // held for the person's allow, so never awaited in the press's own hook
  if (isFixed) return void releaseItself($, one, ask, said, repo, branch, wakeText).catch(err => log($, `release of ${one.id} not done: ${String(err)}`))
  const prompt = named(
    `Do the last step of the task "${titleOf(one)}", which {name} just gave the go-ahead for by pressing "${said}" (to: ${ask.text}): ${step}\nWork in ${folder}${branch && branch !== 'HEAD' ? `, on its branch ${branch}` : ''}. It is this one step: do only that, then report in one or two lines what happened. If it fails in a way that needs what the task that built it knows (a merge conflict, a failing check, a question only it can answer), send that task, "${one.id}", a message with SendMessage saying what failed and the last lines of the output, and end; do not fix it yourself.`,
  )
  await stepLine($, one.id, `On your "${said}", a small fresh task does the last step: ${cut(step, 160)}`)
  const wake = { target: one.id, text: wakeText, answers: [], spawn: { prompt, description: `${cut(titleOf(one), 50)}: last step`, subagentType: 'claudopus:quick', model: quickModel(models, lean), cwd: folder } }
  wakes.push(wake)
  void $.clock.after(WAKE_WAIT, () => {
    const at = wakes.indexOf(wake)
    if (at < 0) return
    wakes.splice(at, 1)
    void sendWake($, wake, false)
  })
}
// The release with no model: the card's allow box first, as for any release, then the runner on its own, followed by the mod
const releaseItself = async ($: EngineInterface, one: Todo, ask: NonNullable<Todo['ask']>, said: string, repo: string, branch: string, wakeText: string) => {
  const at = await $.clock.now()
  const common = await $.process.run(['git', '-C', repo, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { timeoutMs: 15_000 }).then(r => r.stdout.trim()).catch(() => '')
  const name = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo
  const id = `step-${one.id}-${at}`
  const gate: Gate = { id, call: id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at, from: one.id }
  await stepLine($, one.id, `On your "${said}", Claudopus releases ${branch} itself once you allow it below`)
  const allowed = await holdGate($, {}, gate, one.id)
  if (allowed !== 'once') return stepLine($, one.id, `Nothing was released: the release was ${allowed === 'deny' ? 'denied' : 'not allowed'}`)
  const logFile = `${dir}/releases/${id}.log`
  const isLogged = await $.fs.write(logFile, '').then(() => true).catch(() => false)
  if (!isLogged) return stepLine($, one.id, 'Nothing was released: Claudopus could not start the release')
  const grant = await issueGrant($, id, { host: 'release', command: `${repo}\n${branch}` }, 'release-grant')
  if (!grant) return stepLine($, one.id, 'Nothing was released: the allow could not be secured')
  // Detached, so it outlives the ten minutes a call of the mod may take; its exit is written as its last line
  const run = await $.process
    .run(['/bin/sh', '-c', 'nohup /bin/sh -c \'"$1" > "$2" 2>&1; echo "claudopus-exit $?" >> "$2"\' sh "$1" "$2" > /dev/null 2>&1 &', 'sh', `${$.plugin.root}/bin/release`, logFile], { cwd: repo, env: { CLAUDECODE: '1' }, timeoutMs: 15_000 })
    .catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (run.exitCode !== 0) {
    await dropGrants($, [grant])
    return stepLine($, one.id, 'Nothing was released: Claudopus could not start the release')
  }
  await log($, `release of ${branch} in ${name} started by Claudopus for ${one.id}`)
  const timer = everyLoad($, STEP_LOOK, () => {
    void (async () => {
      const text = await readOr($, logFile)
      const exit = /claudopus-exit (\d+)\s*$/.exec(text)?.[1]
      const isLate = (await $.clock.now()) - at > STEP_LONGEST
      if (exit === undefined && !isLate) return
      timer.cancel()
      const tail = text.replace(/claudopus-exit \d+\s*$/, '').replace(/\s+$/, '').split('\n').slice(-CHAT_TAIL).join('\n')
      if (exit === '0') {
        await stepLine($, one.id, `Released: ${cut(oneLine(tail.split('\n').at(-1) ?? ''), 160)}`)
        await sayInChat($, named(`Claudopus released "${titleOf(one)}" on {name}'s go-ahead. Its last lines:\n${tail}`), `Released "${titleOf(one)}".`)
        return
      }
      await stepLine($, one.id, `The release ${isLate ? 'has run 90 minutes' : `stopped (exit ${exit})`}: Claude is started again to look at it`)
      await toEnded($, one, one.id, isLate ? `${wakeText}\nClaudopus started the release itself after the go-ahead, and it has run 90 minutes without ending. It may still be running: look at its log, ${logFile}, and at what is running, before anything else; do not start a second release while it runs. Its last lines:\n${tail}` : `${wakeText}\nClaudopus ran the release itself after the go-ahead, and it failed with exit ${exit}. Its log is ${logFile}; its last lines:\n${tail}\nSort out what it needs (exit 2: merge main and keep what both sides meant; exit 3: a build or check failed), then run the release as your rules say.`, { text: said, ask: ask.text, at, line: '', isCard: true, askAt: ask.at })
    })().catch(err => log($, `release of ${one.id} not followed: ${String(err)}`))
  })
}
