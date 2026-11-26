// The mod's own tools: update, recall, todo, ask and note

// What recall gives: at most this many lines, and this many from any one file
const RECALL_LINES = 40
const RECALL_PER_FILE = 6
const recallRank = (file: string) =>
  file.startsWith('streams/') ? (file.endsWith('.log.md') ? 1 : 0)
  : file.startsWith('reports/') ? 2
  : file.startsWith('words/') || file.startsWith('asks/') ? 3
  : file.startsWith('work/') ? 5
  : file.startsWith('notes/') ? 6
  : 4

const toolHooks = (on: On) => {

  on('tool.call', { tool: 'mcp__claudopus__update' }, async ($, e) => {
    const input = e as unknown as { name?: string; repo?: string; state?: string; summary?: string; brief?: string; add?: string }
    if (!input.name?.trim()) return { result: 'A topic needs a name.' }
    // A test's or a scratch folder's topic is kept out of the index every chat is given
    const known = (await readIndex($)).find(one => slug(one.name) === slug(input.name ?? ''))
    if (isScratchTopic(input.repo?.trim() || known?.repo || '')) return { result: named(`Not recorded: ${input.repo?.trim() || known?.repo} is a test or scratch folder, and topics are for {name}'s own work.`) }
    const brief = input.brief?.trim() ?? ''
    const added = input.add?.trim() ?? ''
    const isLong = brief.length > PAGE_CHARS
    const saved = await saveStream($, input.name, { repo: input.repo, state: input.state?.slice(0, 60), summary: input.summary })
    // The subject a piece of work recorded names the subject of its report
    if (e.agentId !== undefined) await change($, e.agentId, one => ({ ...one, subject: saved.name }))
    const page = pageOf(saved.name)
    if (added) {
      const card = e.agentId === undefined ? undefined : (await read($, todos)).find(one => one.id === e.agentId)
      await appendTo($, historyOf(saved.name), historyEntry(await $.clock.now(), card ? titleOf(card) : 'The chat', added))
    }
    if (brief && !isLong) await $.fs.write(page, `${hideKeys(brief)}\n`)
    // A page grown past its limit by hand is made short in the background, the whole of it kept in the history
    void shortenPage($, saved.name).catch(err => log($, `page of ${saved.name} not made short: ${String(err)}`))
    const said = [
      added ? `History: ${historyOf(saved.name)} (added to)` : '',
      `Page: ${page}${brief && !isLong ? ' (rewritten)' : ''}`,
      isLong ? `The page was not rewritten: \`brief\` was ${brief.length} characters, over the ${PAGE_CHARS} a page holds. Keep the page to what a fresh task needs first (where things are, where each line of work stands, what is decided, what is open) and put the detail in \`add\`.` : '',
    ].filter(Boolean)
    return { result: `- ${[saved.name, saved.repo, saved.session, saved.state, saved.summary].join(' | ')}\n${said.join('\n')}` }
  })

  on('tool.call', { tool: 'mcp__claudopus__recall' }, async ($, e) => {
    const query = (e as unknown as { query?: string }).query?.trim() ?? ''
    if (!query) return { result: 'Nothing to search for.' }
    const grep = async (phrase: string) => (await $.process.run(['grep', '-rniF', '--include=*.md', '-e', phrase, dir])).stdout.split('\n').filter(Boolean)
    // The phrase as given; when nothing holds it whole, the lines that hold each of its words, in any order
    const words = [...new Set(query.toLowerCase().split(/\s+/).filter(one => one.length > 1))]
    let found = await grep(query)
    const isLoose = !found.length && words.length > 1
    if (isLoose) {
      const longest = [...words].sort((a, b) => b.length - a.length)[0] ?? query
      found = (await grep(longest)).filter(line => words.every(one => line.slice(line.indexOf(':', dir.length + 1)).toLowerCase().includes(one)))
    }
    // A result the person put away is still found, marked, so it is answered from only when they name it
    const archived = new Set((await loadReports($).catch(() => [] as Report[])).filter(one => one.archived).map(one => one.id))
    const seen = new Set<string>()
    const perFile = new Map<string, number>()
    const lines = found
      .map(line => line.replace(`${dir}/`, ''))
      .map(line => ({ line, file: line.slice(0, line.indexOf(':')) }))
      // Topic pages first, then their histories, the results newest first, the chats' words, the rest; what a chat's helpers and
      // tools brought and the notes come last, so they never crowd out the rest
      .sort((a, b) => recallRank(a.file) - recallRank(b.file) || (a.file.startsWith('reports/') && b.file.startsWith('reports/') ? b.file.localeCompare(a.file) : 0))
      // The same line in several files (a result handed in again, a message quoted back) is given once, from where it ranks first;
      // and no file gives more than RECALL_PER_FILE lines, so one long file never fills the answer
      .filter(({ line, file }) => {
        const said = flat(line.slice(line.indexOf(':', file.length + 1) + 1))
        if (seen.has(said)) return false
        seen.add(said)
        perFile.set(file, (perFile.get(file) ?? 0) + 1)
        return (perFile.get(file) ?? 0) <= RECALL_PER_FILE
      })
      .map(({ line, file }) => (archived.has(file.match(/^reports\/([^/]+)\//)?.[1] ?? '') ? `[archived] ${line}` : line).slice(0, 240))
    if (!lines.length) return { result: `Nothing in ${dir} mentions "${query}"${words.length > 1 ? ', nor holds all its words on one line' : ''}.` }
    const more = lines.length > RECALL_LINES ? `\n(${lines.length - RECALL_LINES} more lines; narrow the phrase)` : ''
    const loose = isLoose ? `No line holds "${query}" as written; these hold each of its words.\n` : ''
    return { result: `${loose}Files are under ${dir}.\n${lines.slice(0, RECALL_LINES).join('\n')}${more}` }
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
    const input = e as unknown as { text?: unknown; details?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown; pictures?: unknown; release?: unknown; key?: unknown; from?: unknown }
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
    // A question for a key is its key's box, with the question and where to get it, on the card at once: nothing to run or press first
    // (21 Nov: the Sentry key was asked for three times, and the person never saw a place to paste it)
    const keyName = typeof input.key === 'string' ? input.key.trim() : ''
    if (keyName && asked) {
      if (!isKeyName(keyName)) return { result: 'Not shown: `key` is the name the key is saved under: letters, digits and _, starting with a letter, such as SENTRY_READ_TOKEN.' }
      const from = (typeof input.from === 'string' ? input.from : '').replace(/\r\n?/g, '\n').trim()
      if (!from) return { result: named('Not shown: say in `from` where {name} gets the key: the full link of the page and what to press there, so the box can tell them.') }
      const saved = (await refreshKeys($).catch(() => keys)).entries.filter(one => one.store === 'claudopus' && one.isPresent)
      const same = saved.find(one => one.name === keyName)
      const like = same ? undefined : saved.find(one => sameKey(one.name, keyName))
      const about = cut(keyAskDetails([text === asked ? '' : asked, given1].filter(Boolean).join('\n\n'), from, keyName, same, like), ASK_DETAILS)
      const keyAt = await $.clock.now()
      // (beside the task's other questions for keys: the same key asked again takes the place of its earlier question)
      await change($, e.agentId, one => withKeyAsks(one, [...keyAsksOf(one).filter(other => other.name !== keyName), { name: keyName, text, details: about, from: e.agentId ?? '', at: keyAt }]))
      const cards = await read($, todos)
      const card = cards.find(one => one.id === topOf(cards, e.agentId ?? ''))
      await lookBoxes($).catch(err => log($, `boxes not looked at: ${String(err)}`))
      if (card) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
      await log($, `key ${keyName} asked for with its box on ${card?.id ?? e.agentId}`)
      return { result: named(KEY_ASK_SHOWN($.plugin.root, keyName, Boolean(same), like?.name)) }
    }
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
    // A question with buttons is one picture, made once, when the person wants it and the task gave none: the question said again
    // keeps the picture it had. One that can't be made leaves the question as text
    const isSameAsk = Boolean(was && was.text === text && JSON.stringify(was.choices ?? []) === JSON.stringify(choices))
    const wantsPicture = Boolean(text && choices.length) && (await wantsQuestionPictures($).catch(() => false))
    let drawn = ''
    if (wantsPicture && !pictures.length) {
      if (isSameAsk && was?.pictures?.length) pictures.push(...was.pictures)
      else {
        const top = before.find(one => one.id === topOf(before, e.agentId ?? ''))
        drawn = await questionPicture($, top?.id ?? e.agentId, top ? titleOf(top) : 'Background task', asked, given1, choices, at)
        if (drawn) pictures.push(drawn)
      }
    }
    // A go-ahead for a release: the worktree a press on its first choice allows one release run for (gate.tsx, allowRelease).
    // Only a task's own question with buttons, for a folder that is there
    // An answer to the person's words on a permission of its card, given with no buttons: shown inside that permission, under their
    // words, never as a question of its own, so Allow and Don't allow stay where they were (gate.tsx, wordsOnGate)
    const own = before.find(one => one.id === topOf(before, e.agentId ?? ''))
    const parked = own && !own.chat ? own.admins?.find(gate => gateParked.has(gate.id) && gate.talk?.at(-1)?.by === 'you') : undefined
    const refused = own ? asksOf(own).findLast(ask => ask.refused && ask.replied) : undefined
    if (own && text && !choices.length && (parked || refused)) {
      const answer = { by: 'task' as const, text: cut([asked, given1].filter(Boolean).join('\n\n'), ASK_DETAILS) }
      if (parked) await setGates($, own.id, list => list.map(gate => (gate.id === parked.id ? { ...gate, talk: [...(gate.talk ?? []), answer].slice(-PERMIT_TALK_KEPT) } : gate)))
      else if (refused) await changeTodos($, list => list.map(one => (one.id === own.id ? mapAsk(one, refused, ask => ({ ...ask, talk: [...(ask.talk ?? []), answer].slice(-PERMIT_TALK_KEPT), replied: undefined })) : one)))
      // The block is back with its buttons, so the grey line of what the person wrote goes: the block shows their words
      sentReplies.delete(own.id)
      redraw($)
      await askAloud($, own, text).catch(err => log($, `answer not told: ${String(err)}`))
      return { result: `Shown inside the permission on your card, under ${who()}'s words. It keeps Allow and Don't allow until ${who()} presses one, and that press comes back to you as a message. Don't run it again before then. With nothing else to do, end your step.` }
    }
    const releaseGiven = typeof input.release === 'string' ? input.release.trim() : ''
    const release = releaseGiven.startsWith('/') && choices.length && !before.find(one => one.id === e.agentId)?.parentId && (await $.fs.stat(releaseGiven).catch(() => undefined))?.kind === 'dir' ? releaseGiven : ''
    // A new question goes beside every other one still open on the card, each answered on its own. Only the asker's own earlier
    // question it now asks again takes its place: the same words, one the person replied to in words (asked again once acted on), or
    // what its result asked. Empty text clears the asker's own questions, never a helper's or its task's
    const asker = e.agentId
    const isOwnAsk = (one: Todo, ask: Ask) => (ask.from ?? one.id) === asker
    let cleared: Ask[] = []
    await change($, asker, one => {
      if (!text) return ((cleared = asksOf(one).filter(ask => isOwnAsk(one, ask))), withAsks(one, asksOf(one).filter(ask => !isOwnAsk(one, ask))))
      const kept = asksOf(one).filter(ask => !ask.isResult && !(isOwnAsk(one, ask) && (ask.text === text || (ask.replied && !ask.refused))))
      return withAsks(one, [...kept, { text, ...(release ? { release } : {}), ...(details ? { details } : {}), ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices } : {}), from: asker, ...(pictures.length ? { pictures } : {}), at }])
    })
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, asker))
    if (!text) {
      if (card && keyAsksOf(card).some(ask => ask.from === asker)) await changeTodos($, all => all.map(one => (one.id === card.id ? withKeyAsks(one, keyAsksOf(one).filter(ask => ask.from !== asker)) : one)))
      if (card) for (const ask of cleared) await askGone($, card, undefined, ask)
      return { result: cleared.length > 1 ? `Cleared: your card no longer has your ${cleared.length} questions.` : 'Cleared: your card no longer has a question.' }
    }
    // The same ask said again is not told again
    if (card && was?.text !== text) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
    // Its picture opens on the person's screen as the question comes, once
    if (wantsPicture && !isSameAsk && pictures[0]) await openQuestionPicture($, pictures[0])
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
    const released = release ? ` A press on ${choices[0]} also allows your runs of the release runner for ${release} until one has gone out, with no second question: run it then, in your background.` : releaseGiven ? ' `release` was left out: it needs buttons, and the full path of a folder that is there.' : ''
    const bare = choices.length && !details && !copy ? ` It carries no details: if deciding it needs more than this one line (what goes out, what it changes), ask it again with that in \`details\`; ${who()} sees the ask before your report.` : ''
    const seen = drawn ? ` Claudopus drew your question and its buttons as one picture, opened it on ${who()}'s screen, and shows it with the question on your card and in the chat: make no picture of it yourself.` : pictures.length ? ` Its ${pictures.length === 1 ? 'picture is' : `${pictures.length} pictures are`} drawn small on the card, each opening large on a press, and the chat shows ${pictures.length === 1 ? 'it' : 'them'} in its next reply.` : ''
    // Questions asked before it and still open stay beside it: said back, so the task neither asks them again nor thinks them gone
    const open = card ? asksOf(card).length : 1
    const beside = open > 1 ? ` Your card now holds ${open} open questions, this one with the ${open - 1 === 1 ? 'one' : `${open - 1}`} asked before it, each with its own answer, which comes to you naming its question. Put what belongs together into one question, and don't ask again one that is still open.` : ''
    const missing = lost ? ` ${lost} of the pictures given ${lost === 1 ? 'is' : 'are'} no picture file found here, by full path, and ${lost === 1 ? 'was' : 'were'} left out.` : ''
    return { result: `Shown on your card with ${details ? 'what it is about under it, ' : ''}${shown}, and shown in the chat as a notice from the panel${details ? ' with what it is about' : ''}, where ${who()} can answer it too.${seen}${missing}${long}${tooLong}${bare}${plain}${leftOut}${released}${beside} It stays until ${who()} answers; the answer comes back to you as a message the moment it is given, at your next step or to you paused. Never wait for it with a command or a timer: with nothing else to do, end your step. Ask again if the answer leaves something waiting. Clear it with empty text only once you have seen it done.${terminal}` }
  })

  // A task hands the person a part of its result that is finished while it goes on with the rest (20 Nov: "allow subagents to have
  // multiple reports and then also to report without finishing a task"): kept as a result of its own, and given to the chat with the
  // message the task sends it (PART_TAKEN), or with any message or notice that comes first. Claudopus submits nothing for it, as
  // Claude Code draws a plugin's message as the person's own (21 Nov: "This still gets sent as me"). Nothing on the card ends
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

