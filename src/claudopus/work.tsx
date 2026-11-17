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
// command ends (16 Nov: a reply waited 8 minutes behind a 9-minute wait for the person). One known to run past this long, by the
// time its words give it, or a build, render, browser run or download that asks for a longer time limit, is refused with the same
// call to send in the background: the work is told when it ends, and reads a reply at once meanwhile. A long time limit alone says
// nothing (16-17 Nov: most were a push, a short test or a look), so any other runs as sent. Never turned to the background by the
// mod: auto mode reviews a call as the model writes it, and refuses one a hook has changed since (16-17 Nov: 484 calls). Not the
// mod's own runners: its waits on helpers (which come back when a reply waits), a release, a password or a key
const HELD_LONGEST = 2 * 60_000
const isLongHeld = (call: { tool: string; command?: unknown; description?: unknown; timeout?: unknown; run_in_background?: unknown }) => {
  const command = String(call.command ?? '')
  const description = String(call.description ?? '')
  return (
    call.tool === 'Bash' &&
    !call.run_in_background &&
    !/\bbin\/(?:helpers|admin|secret|release)\b|(?:^|[\s;&|(])\.\/(?:helpers|admin|secret|release)\b/.test(command) &&
    // A launcher that leaves its runs going and comes back is followed by what it started while it ran, so it is left as it is
    !/\b(?:nohup|setsid|disown)\b|(?<![&>|])&(?![&>])/.test(command) &&
    ((describedOf(description).expect ?? 0) >= HELD_LONGEST || (Number(call.timeout ?? 0) > HELD_LONGEST && (Boolean(heavyOf(command)) || jobKindOf(command, description) === 'download')))
  )
}
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
// The note the engine adds when work ends its step without its report, and what such a step says instead while the work's own
// detached command runs or it waits to be woken: what it said before was no report (a report goes on to the engine's press)
const HANDBACK_PRESS = '[handback-send-enforce]'
const LEFT_AT_WORK = "My command is still running. Claudopus starts me again when it's done, and I'll send my result then."
const isPressedForReport = async ($: EngineInterface, id: string) => {
  const talk = await $.session.messages({ as: 'api', agentId: id }).catch(() => [])
  if (!Array.isArray(talk)) return false
  const textOf = (m: unknown) => {
    const content = (m as { content?: unknown } | undefined)?.content
    return typeof content === 'string' ? content : Array.isArray(content) ? content.map(b => (b && typeof b === 'object' && (b as { type?: unknown }).type === 'text' ? String((b as { text?: unknown }).text ?? '') : '')).join('\n') : ''
  }
  const last = talk.at(-1) as { role?: unknown } | undefined
  if (last?.role !== 'user' || !textOf(last).includes(HANDBACK_PRESS)) return false
  const said = [...talk].reverse().find(m => (m as { role?: unknown }).role === 'assistant')
  return textOf(said).trim().length < REPORT_LEAST
}
// What a command that only waits is told instead, by what it waits for
const NO_WAIT = (kind: WaitKind, isHelper = false) =>
  `Not run: this command only waits${kind === 'helpers' ? ' for your helpers' : kind === 'time' ? ' for time to pass' : ''}, and nothing you start may only wait. ${
    kind === 'helpers'
      ? 'Each helper\'s result comes to you as a message, even after you end your step: carry on with what needs nothing from them, or end your step now.'
      : 'Your own commands, in the background or detached, wake you the moment they end, and each helper\'s result comes to you as a message: carry on with what needs nothing from them, or end your step now. ' + (isHelper ? 'For a file, a page or a time that nothing of yours makes, hand back what you found and what you wait for: the task that started you asks Claudopus to wake it.' : 'For a file, a page or a time that nothing of yours makes, call the `wake_me` tool and end your step: Claudopus wakes you when it is there.') + ' To try something again that failed, run it again yourself.'
  }`
const NO_FOLLOW =
  'Not run: this only follows a log and would never end, so read the log once when you need it (tail -n 20); you are woken the moment your command ends.'
const SEND_BACKGROUND = (name: string) =>
  `Not run: this command may run for minutes, and held open it keeps ${name}'s replies from you until it ends. Send the same call again with \`run_in_background: true\` and nothing else changed: Claudopus tells you when it ends, and ${name}'s replies reach you while it runs. Never wait for ${name}'s own answer with a command: it comes to you as a message.`
// The chat's own command, which runs only in the background
const CHAT_SEND_BACKGROUND = 'Not run: the chat runs its own command only in the background. Send the same call again with `run_in_background: true` and nothing else changed.'

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
  const work = named(fillModels((await inForce($, $.plugin.root, dir, 'roles/work.md')).text, models, lean)).replace(/\{admin\}/g, `${$.plugin.root}/bin/admin`).replace(/\{secret\}/g, `${$.plugin.root}/bin/secret`).replace(/\{release\}/g, `${$.plugin.root}/bin/release`).trim()
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
  return `${card.rulesDue ? 'Your context was compacted, and the rules you were handed at the start are no longer in it.' : 'The rules every task follows have changed since you started.'} These are the rules now; they replace any earlier copy.\n\n${rules}${card.scratch ? `\n${SCRATCH_LINE(card.scratch)}` : ''}`
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
        // A call Claude Code refused a task with no prompt is put to the person on its card
        if (e.agentId !== undefined) void refusedByClaudeCode($, e.agentId, e.tool, e as never, r as never).catch(err => log($, `refusal not put to the person: ${String(err)}`))
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
    // A task's write that crosses the files of another task of this chat still at work (crossing.tsx)
    const crossed = await crossingOf($, e).catch(async err => (await log($, `crossing not looked at: ${String(err)}`), {} as Awaited<ReturnType<typeof crossingOf>>))
    if (crossed.deny) {
      await log($, `refused work ${e.agentId}'s ${e.tool} that crosses another task's files`)
      return { deny: crossed.deny }
    }
    // (only while it, or the work it helps, has a question of its own open to the person: a wait said for them then is that)
    if (dir && !isOff && e.agentId !== undefined && isPersonWait(e as never, who()) && asksNow(await read($, todos), e.agentId)) {
      await log($, `refused work ${e.agentId}'s wait for the person: ${oneLine(String((e as { description?: unknown }).description ?? '')).slice(0, 80)}`)
      return { deny: NO_PERSON_WAIT(who()) }
    }
    // Nothing a piece of work or a helper starts may only wait, whatever shape its loop takes: its own commands and helpers wake it
    // as they end, and Claudopus wakes it for a file, a page or a time nothing of its own makes (wake_me)
    if (dir && !isOff && e.agentId !== undefined && (e.tool === 'Bash' || e.tool === 'Monitor')) {
      const command = String((e as { command?: unknown }).command ?? '')
      const card = (await read($, todos)).find(one => one.id === e.agentId)
      const waits = waitingOf(command, await scriptsRun($, command), { isWatch: e.tool === 'Monitor' })
      if (waits) {
        await log($, `refused ${card?.parentId ? 'helper' : 'work'} ${e.agentId}'s command that only waits (${waits})`)
        return { deny: NO_WAIT(waits, Boolean(card?.parentId)) }
      }
      // A tail that follows a log never ends of itself and tells the work nothing as it runs: it only outlives what it watches
      // (a Monitor watch is told each line as it comes, so it says something; a Bash call's output is read only as it ends)
      if (e.tool === 'Bash' && watcherOf(command)?.isFollow) {
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
    const isChatHere = e.agentId === undefined && !isOff && Boolean(dir) && (await read($, me)).isChat
    // A single command the chat runs itself: one command and nothing joined to it
    const chatCommand = isChatHere && e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
    if (chatCommand && !isOneCommand(chatCommand) && !RUNNER_NAMED.test(chatCommand)) {
      await log($, "refused a chat's own command that is more than one command")
      return { deny: NOT_ONE_COMMAND }
    }
    // The branch a push would go from, which is never main
    const pushFrom = /^\s*git\s+push\b/.test(chatCommand) ? await $.process.run(['git', '-C', cwd || '.', 'rev-parse', '--abbrev-ref', 'HEAD'], { timeoutMs: 10_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '') : ''
    const isChatCommand = Boolean(chatCommand) && isChatRunnable(chatCommand, pushFrom) && !(await scriptsRun($, chatCommand)).some(text => RUNNER_NAMED.test(text))
    const isRefusedHere = isChatHere && !isChatCommand && !OWN.includes(e.tool) && !OWN_SERVERS.some(prefix => e.tool.startsWith(prefix)) && !READS.includes(e.tool) && !isPaneShow(e)
    // A call is never changed on its way: auto mode reviews it as written and refuses one a hook has changed since, so one that must
    // run in the background is refused with the same call to send that way, and the call sent again is reviewed as it runs
    if (dir && !isOff && e.agentId !== undefined && isLongHeld(e as never)) {
      await log($, `refused work ${e.agentId}'s long command held open: ${oneLine(String((e as { description?: unknown }).description ?? '')).slice(0, 80)}`)
      return { deny: SEND_BACKGROUND(who()) }
    }
    if (isChatCommand && !(e as { run_in_background?: unknown }).run_in_background) {
      await log($, "refused the chat's own command held open")
      return { deny: CHAT_SEND_BACKGROUND }
    }
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
      if ([String((e as { command?: unknown }).command ?? ''), ...(await scriptsRun($, String((e as { command?: unknown }).command ?? '')))].some(text => /\bbin\/(?:admin|secret)\b/.test(text))) runnerBegun(e.tool_use_id, String((e as { command?: unknown }).command ?? ''), await $.clock.now(), e.agentId)
    }
    if (!isRefusedHere) {
      const fileSaid = await gateOwnFile($, e, raw as never)
      if (fileSaid) return (await dropGrants($, grants), await callRefused($, e.tool_use_id), await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: fileSaid })
    }
    // Work sent a message works again once the message is on its way: what it reported before no longer makes a stop a finish
    let woken = ''
    // A heavy command of a piece of work waits its turn while the Mac is busy: refused at once with its place in the line, and its
    // work started again when its turn comes
    const next = async (asked: typeof e) => {
      // (never one the person has just allowed as admin or as a release: what they allowed lasts two minutes)
      const held = dir && !isOff && e.agentId !== undefined && asked.tool === 'Bash' && !grants.length ? await turnHeavy($, asked) : {}
      if (held.deny) return (await noteCallEnded($, e.tool_use_id).catch(() => undefined), { deny: held.deny } as Awaited<ReturnType<typeof raw>>)
      try {
        return await nextHere(asked)
      } finally {
        if (held.id) heavyOpen.delete(held.id)
      }
    }
    const nextHere = async (asked: typeof e) => {
      const call = asked
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
      // What it wrote is kept as it ends, and what crossed another task's is told then
      const broke = r.deny ? '' : await crossEnded($, e as never, crossed, r.result, Boolean(r.isError)).catch(() => '')
      const crossing = r.deny ? [] : [r.isError && e.tool !== 'Bash' ? '' : (crossed.context ?? ''), broke].filter(Boolean)
      const told = crossing.length && !shown.deny ? ({ ...shown, context: [...((shown as { context?: string[] }).context ?? []), ...crossing] } as typeof shown) : shown
      return told
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
    // No agent, the chat's or a work's helper, starts on an older model or on Haiku: agent.spawn starts one named so on its family's
    // newest, which leaves the Agent call as written (auto mode refuses a call a hook changed after it reviewed it, never a start)
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
      handedBackLetGo.delete(id)
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
            const base = { ...(one.status === 'working' ? one : resumed(one, now)), steps: (one.steps ?? 0) + 1, answeredAt: undefined, waitsSince: undefined, endedStepAt: undefined }
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
      const line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole))
      if (!sent.deny) void tell($, steered, line).then(r => (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line }).catch(err => log($, `work ${steered} not told: ${String(err)}`)) : undefined))
      return sent
    }
    // A report handed back is kept as the turn's answer only once the handback went through: refused, the work carries on
    if (e.agentId !== undefined && String(e.tool) === 'SubagentHandback') {
      const hold = await holdAtHandback($, e.agentId).catch(() => '')
      if (hold) return { deny: hold }
      const isLetGoNow = isLetGo(await read($, todos), e.agentId)
      // The engine hands the hand-back on as it goes through: the chat may be given it from now (isQuietHandback)
      handingBack.add(e.agentId)
      // A helper's task that has ended its step is started first, so the engine hands the result to it, not to the chat (wakeForHandback)
      await wakeForHandback($, e.agentId).catch(err => log($, `task not started for its helper's hand-back: ${String(err)}`))
      const r = await next(e)
      // Claude Code may also refuse it with a plain result ("Nothing was sent: ..."): the task started for it hears nothing comes, and
      // the result is passed on as the helper's turn ends, as before
      const isNotSent = Boolean(r.deny || r.isError) || (r.result as { success?: unknown } | undefined)?.success === false
      if (isNotSent && wokenFor.delete(e.agentId)) await handbackRefused($, e.agentId).catch(err => log($, `task not told its helper's hand-back was refused: ${String(err)}`))
      if (r.deny || r.isError) handingBack.delete(e.agentId)
      if (!r.deny && !r.isError) handedBack.set(e.agentId, String((e as { message?: unknown }).message ?? '').trim())
      // A helper whose work has ended its step hands its result to the chat: the chat is told once the hand-back went through, before
      // the helper's turn ends, so its turn starts knowing; a refused hand-back leaves no note
      if (!r.deny && !r.isError) await noteHandback($, e.agentId).catch(err => log($, `chat not told of a helper's hand-back: ${String(err)}`))
      // The helpers it was let hand back over that sit silent end with its report; those at work go on, their results reaching the chat
      if (!r.deny && !r.isError && isLetGoNow) handedBackLetGo.add(e.agentId)
      if (!r.deny && !r.isError && isLetGoNow) await stopHelpers($, e.agentId, true).catch(err => log($, `helpers of ${e.agentId} not stopped: ${String(err)}`))
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
        await stopHelpers($, stopId)
        await dropBackground($, [stopId], 'stopped')
        const now = await $.clock.now()
        await changeTodos($, list => list.map(one => (one.id === stopId && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now) : one.id === stopId && one.leftSince ? { ...one, leftSince: undefined } : one)))
        await keepStoppedReports($, now)
        await lookEnds($)
      }
      return r
    }
    if (OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix)) || isPaneShow(e)) return next(e)
    // The chat's single command always runs in the background, so no command holds the chat; Claudopus stops it at its limit
    if (isChatCommand) {
      const r = await next(e)
      if (!r.deny && !r.isError) await chatCommandStarted($, e as never, r.result).catch(err => log($, `the chat's command not followed: ${String(err)}`))
      return r
    }
    // The chat reads for itself: a kept report to answer from, or the few files a question needs. A saved paste stays out of it:
    // the agent that needs it reads it
    const readPath = String((e as { file_path?: unknown; path?: unknown }).file_path ?? (e as { path?: unknown }).path ?? '')
    const isPaste = Boolean(dir) && (readPath === `${dir}/pastes` || readPath.startsWith(`${dir}/pastes/`))
    if (READS.includes(e.tool) && !isPaste) return next(e)
    await log($, `refused ${e.tool} in a chat's own thread`)
    if (grants.length) await dropGrants($, grants).catch(() => undefined)
    // An open, a curl or a preview not in the shape the chat runs is told that shape, so it can be run that way or go to a task
    const kind = e.tool === 'Bash' ? (shellWords(chatCommand)[0]?.[0] ?? '') : (/__(preview_start)$/.exec(e.tool)?.[1] ?? '')
    const shape = Object.hasOwn(CHAT_SHAPES, kind) ? CHAT_SHAPES[kind] : ''
    return { deny: shape ? `${REFUSED} ${shape}` : REFUSED }
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
    // The chat's turn that only a notice with nothing new started ends with Claude Code's own line for a turn with nothing to say
    // (chatHooks' prompt.submit and turn.start), with no model asked
    if (e.agentId === undefined && e.index === 0 && quietTurns.has(e.turnId)) {
      yield { kind: 'text', index: 0, text: NO_ANSWER }
      yield { kind: 'stop', stopReason: 'end_turn', usage: null }
      return { turnId: e.turnId, index: e.index, answer: NO_ANSWER, toolUses: [], stopReason: 'end_turn', usage: null }
    }
    const id = e.agentId
    if (id !== undefined) replyRead($, id)
    // A helper started again ends again with a result of its own, passed on even if its words are the same, or none; a hand-back
    // of its earlier run no prompt of the chat's came for is forgotten
    if (id !== undefined) (passedOn.delete(id), handingBack.delete(id))
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
    // The engine presses work that ends its step without its report, while it sees nothing of the work's own at work: a command
    // the work started detached, what it asked Claudopus to wake it for, or its helpers, which run in the background and whose
    // results start it again, it does not see (16 Nov: 30 presses in 25 minutes ended a task early; five tasks waiting on a second
    // look were each pressed and refused at their report). That press is answered here with no model, so the work ends its step and
    // is started again when that is done
    const helpers = id !== undefined && card && !isOff && card.handedBackAt === undefined ? runningHelpers(await read($, todos), id).length : 0
    if (id !== undefined && card && !isOff && card.handedBackAt === undefined && (card.detached?.length || card.wakeWhen || isTurnWaited(await read($, todos), id) || helpers) && (await isPressedForReport($, id))) {
      await log($, `work ${id} pressed by the engine for its report while ${card.detached?.length ? 'its own detached command runs' : helpers ? `${plural(helpers, 'a helper', 'helpers')} of its own ${helpers === 1 ? 'runs' : 'run'}` : 'it waits to be woken'}: let it end its step`)
      yield { kind: 'text', index: 0, text: LEFT_AT_WORK }
      yield { kind: 'stop', stopReason: 'end_turn', usage: null }
      return { turnId: e.turnId, index: e.index, answer: LEFT_AT_WORK, toolUses: [], stopReason: 'end_turn', usage: null }
    }
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
    // One of the mod's own kinds starts with only its tools, on the model its kind runs on
    const kinded = isOff ? {} : kindStart(asked)
    if (kinded.subagentType || kinded.model) await log($, `an agent of kind ${asked.subagentType} starts${kinded.subagentType ? ` as ${kinded.subagentType}` : ''}${kinded.model ? ` on ${modelName(kinded.model) || kinded.model}` : ''}`)
    const start = isOff || asked.resume ? undefined : startModel({ ...asked, ...kinded })
    if (start?.deny) {
      await log($, `refused a copy of an agent on ${modelName(String(asked.parentModel ?? ''))}`)
      return { deny: start.deny }
    }
    if (start?.model) await log($, `${asked.workflow ? 'a workflow agent' : 'an agent'} asked to run on ${modelName(asked.model ?? '') || `its parent's ${modelName(String(asked.parentModel ?? '')) || 'model'}`} starts on ${modelName(start.model)}`)
    const e = { ...asked, ...kinded, ...(start?.model ? { model: start.model } : {}) }
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
    // and a scratch folder of its own in the chat's scratchpad, which every task of the chat shares
    const scratch = isTold ? scratchName(await read($, todos), e.description ?? '', await $.clock.now()) : ''
    const isBackground = isHelperSpawn(e)
    const r = await next(isTold ? { ...e, prompt: `${e.prompt}\n\n${rules}\n${SCRATCH_LINE(scratch)}` } : isBackground ? { ...e, background: true } : e)
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
      return capped([...list.filter(one => one.id !== id), { ...(old ? resumed(old, now) : fresh), model: old?.chosen ?? r.model, startedOn: old?.startedOn ?? (e.resume ? undefined : r.model), ...(rules ? { rulesSent: hashOf(rules) } : {}), ...(old?.scratch || scratch ? { scratch: old?.scratch || scratch } : {}) }])
    })
    if (isOwn) await openList($)
    await sync($).catch(() => undefined)

    return r
  })

}

