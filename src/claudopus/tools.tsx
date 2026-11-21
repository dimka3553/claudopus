// The mod's own tools: update, recall, todo, ask and note

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
      // What a chat's helpers and tools brought comes after the chats' own words, notes and results, so it never crowds them out
      .sort((a, b) => Number(a.startsWith('work/')) - Number(b.startsWith('work/')))
    if (!lines.length) return { result: `Nothing in ${dir} mentions "${query}".` }
    const more = lines.length > 40 ? `\n(${lines.length - 40} more lines; narrow the phrase)` : ''

    return { result: `Files are under ${dir}.\n${lines.slice(0, 40).join('\n')}${more}` }
  })

  // The work lists what it sets out to do under its to-do, ticks it, rewords it or marks it dropped. A helper's list is its own,
  // on its own row: never added to the list of the task that started it, whose count is of its own to-dos
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
    }, true)

    return { result: items.map(item => `${item.state === 'done' ? '[x]' : item.state === 'dropped' ? '[dropped]' : item.state === 'doing' ? '[doing]' : '[ ]'} ${item.text}`).join('\n') }
  })

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until they answer or the work clears it
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; details?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown; pictures?: unknown; release?: unknown }
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
    // Every button is an answer that reaches the task: a choice that would only leave the question open is left out, as not
    // pressing does that
    const choices = [...new Set((Array.isArray(input.choices) ? input.choices : []).filter((one): one is string => typeof one === 'string').map(one => oneLine(one).slice(0, 40)).filter(Boolean))].filter(one => !LEAVES_OPEN.test(plainWords(one))).slice(0, 4)
    // Pictures the ask is about, by full path; one that is not a picture file on this Mac is left out
    const givenPics = [...new Set((Array.isArray(input.pictures) ? input.pictures : []).filter((one): one is string => typeof one === 'string').map(one => one.trim()).filter(one => IMAGE.test(one)))].slice(0, 8)
    const pictures: string[] = []
    for (const path of givenPics) if (path.startsWith('/') && (await $.fs.stat(path).catch(() => undefined))?.kind === 'file') pictures.push(path)
    const at = await $.clock.now()
    const before = await read($, todos)
    const was = before.find(one => one.id === topOf(before, e.agentId ?? ''))?.ask
    // A go-ahead for a release: the worktree a press on its first choice allows one release run for (gate.tsx, allowRelease).
    // Only a task's own question with buttons, for a folder that is there
    // An answer to the person's words on a permission of its card, given with no buttons: shown inside that permission, under their
    // words, never as a question of its own, so Allow and Don't allow stay where they were (gate.tsx, wordsOnGate)
    const own = before.find(one => one.id === topOf(before, e.agentId ?? ''))
    const parked = own && !own.chat ? own.admins?.find(gate => gateParked.has(gate.id) && gate.talk?.at(-1)?.by === 'you') : undefined
    const refused = own?.ask?.refused && own.ask.replied ? own.ask : undefined
    if (own && text && !choices.length && (parked || refused)) {
      const answer = { by: 'task' as const, text: cut([asked, given1].filter(Boolean).join('\n\n'), ASK_DETAILS) }
      if (parked) await setGates($, own.id, list => list.map(gate => (gate.id === parked.id ? { ...gate, talk: [...(gate.talk ?? []), answer].slice(-PERMIT_TALK_KEPT) } : gate)))
      else await changeTodos($, list => list.map(one => (one.id === own.id && one.ask && one.ask.at === refused?.at ? { ...one, ask: { ...one.ask, talk: [...(one.ask.talk ?? []), answer].slice(-PERMIT_TALK_KEPT), replied: undefined } } : one)))
      // The block is back with its buttons, so the grey line of what the person wrote goes: the block shows their words
      sentReplies.delete(own.id)
      redraw($)
      await askAloud($, own, text).catch(err => log($, `answer not told: ${String(err)}`))
      return { result: `Shown inside the permission on your card, under ${who()}'s words. It keeps Allow and Don't allow until ${who()} presses one, and that press comes back to you as a message. Don't run it again before then. With nothing else to do, end your step.` }
    }
    const releaseGiven = typeof input.release === 'string' ? input.release.trim() : ''
    const release = releaseGiven.startsWith('/') && choices.length && !before.find(one => one.id === e.agentId)?.parentId && (await $.fs.stat(releaseGiven).catch(() => undefined))?.kind === 'dir' ? releaseGiven : ''
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(release ? { release } : {}), ...(details ? { details } : {}), ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices } : {}), from: e.agentId, ...(pictures.length ? { pictures } : {}), at } : undefined }))
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
    const shown = [command ? `the whole command${command === given0 ? '' : ` (${command})`}, a Copy button${isRunFromAfar ? '' : ' and an Open in Terminal button'}` : copy ? 'a Copy button for the text' : '', `${choices.length ? `the buttons ${choices.join(', ')} and ` : ''}Answer in words`].filter(Boolean).join(' and ')
    const lost = givenPics.length - pictures.length
    // An ask that points at an explanation it does not carry: the person sees the ask before the work's report, so it is said back
    const long = text === asked ? '' : ` The question was longer than one line: the card shows it cut at a word, and it is whole at the top of its details.`
    const tooLong = whole.length > ASK_DETAILS ? ` Its details were longer than ${ASK_DETAILS} letters and were cut at a word: put what matters first.` : ''
    // A go-ahead asked with nothing to decide it on: said back, since ${who()} sees the ask before the report
    // No buttons: said back, as nothing of Claudopus's is added to answer it with
    const plain = choices.length ? '' : ` It has no buttons, so ${who()} can only answer in words: give \`choices\` when a press would answer it.`
    const leftOut = (Array.isArray(input.choices) ? input.choices : []).some(one => typeof one === 'string' && LEAVES_OPEN.test(plainWords(one))) ? ' A choice that only leaves the question open (Not now, Later, Skip, Cancel) was left out: not pressing does that, and every button is an answer.' : ''
    const released = release ? ` A press on ${choices[0]} also allows your next run of the release runner for ${release}, once, with no second question: run it then, in your background.` : releaseGiven ? ' `release` was left out: it needs buttons, and the full path of a folder that is there.' : ''
    const bare = choices.length && !details && !copy ? ` It carries no details: if deciding it needs more than this one line (what goes out, what it changes), ask it again with that in \`details\`; ${who()} sees the ask before your report.` : ''
    const seen = pictures.length ? ` Its ${pictures.length === 1 ? 'picture is' : `${pictures.length} pictures are`} drawn small on the card, each opening large on a press, and the chat shows ${pictures.length === 1 ? 'it' : 'them'} in its next reply.` : ''
    const missing = lost ? ` ${lost} of the pictures given ${lost === 1 ? 'is' : 'are'} no picture file found here, by full path, and ${lost === 1 ? 'was' : 'were'} left out.` : ''
    return { result: `Shown on your card with ${details ? 'what it is about under it, ' : ''}${shown}, and shown in the chat as a notice from the panel${details ? ' with what it is about' : ''}, where ${who()} can answer it too.${seen}${missing}${long}${tooLong}${bare}${plain}${leftOut}${released} It stays until ${who()} answers; the answer comes back to you as a message the moment it is given, at your next step or to you paused. Never wait for it with a command or a timer: with nothing else to do, end your step. Ask again if the answer leaves something waiting. Clear it with empty text only once you have seen it done.${terminal}` }
  })

  // A task hands the person a part of its result that is finished while it goes on with the rest (20 Nov: "allow subagents to have
  // multiple reports and then also to report without finishing a task"): kept as a result of its own, and given to the chat to show
  // as its reply, from the next hook that may send it. Nothing on the card ends: its to-dos, helpers and commands go on
  on('tool.call', { tool: 'mcp__claudopus__report' }, async ($, e) => {
    const text = String((e as unknown as { message?: unknown }).message ?? '').trim()
    if (e.agentId === undefined) return { result: `Only a background task hands in a part of its result; the chat tells ${who()} in its reply.` }
    if (!text) return { result: 'A report needs its text, in `message`.' }
    const card = (await read($, todos)).find(one => one.id === e.agentId)
    if (!card || card.chat || isOff || !dir) return { result: `Not handed in: Claudopus does not follow this task. Put it in your last report instead.` }
    if (card.parentId) return { result: named(PART_FROM_HELPER) }
    if (card.status !== 'working') return { result: 'Not handed in: your task has ended. Hand in your result with SubagentHandback.' }
    await changeTodos($, list => list.map(one => (one.id === card.id ? { ...one, partsForChat: [...(one.partsForChat ?? []), text].slice(-PARTS_KEPT) } : one)))
    await saveReport($, card, text, true).catch(err => log($, `part of ${card.id}'s result not kept: ${String(err)}`))
    submitLater($, named(PART_NOTICE(titleOf(card))), await $.clock.now())
    await log($, `part of ${card.id}'s result taken, for the chat to give now`)
    return { result: named(PART_TAKEN(PART_SENT(titleOf(card)))) }
  })

  // The work writes its own log, on purpose, in plain words: what it starts and what it decides
  on('tool.call', { tool: 'mcp__claudopus__note' }, async ($, e) => {
    const input = e as unknown as { text?: string; decision?: boolean; task?: string; questions?: unknown; choices?: unknown }
    // What its result leaves open, given with its last note: kept for its delivered card, each a line, the newest list in place of the one before
    const asked = Array.isArray(input.questions) ? input.questions.map(one => oneLine(typeof one === 'string' ? one : '').slice(0, QUESTION_CHARS)).filter(Boolean).slice(0, QUESTIONS_KEPT) : undefined
    // (and the buttons that answer them, as an ask's are)
    const answers = [...new Set((Array.isArray(input.choices) ? input.choices : []).filter((one): one is string => typeof one === 'string').map(one => oneLine(one).slice(0, 40)).filter(Boolean))].filter(one => !LEAVES_OPEN.test(plainWords(one))).slice(0, 4)
    const text = oneLine(input.text ?? '').slice(0, NOTE_CHARS)
    if (!text) return { result: 'A note needs its text.' }
    if (e.agentId === undefined) return { result: "Only a background task keeps a log in the panel; the chat has none." }
    const kind: Entry['kind'] = input.decision ? 'decision' : 'note'
    await change($, e.agentId, (one, at) => ({ ...one, entries: [...one.entries, { at, kind, text }].slice(-ENTRIES_KEPT), ...(asked && one.id === e.agentId ? { questions: asked.length ? asked : undefined, questionChoices: asked.length && answers.length ? answers : undefined } : {}) }))
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

