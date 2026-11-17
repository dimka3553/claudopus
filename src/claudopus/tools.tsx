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

  // A file, a page or a time nothing of the work's own makes is looked for by Claudopus, which starts the work again when it is
  // there: no command of the work's ever only waits (lookWakes)
  on('tool.call', { tool: 'mcp__claudopus__wake_me' }, async ($, e) => {
    const input = e as unknown as { what?: unknown; file?: unknown; text?: unknown; url?: unknown; minutes?: unknown }
    if (e.agentId === undefined) return { result: 'Only a background task is started again this way; the chat is started by the next message.' }
    // A helper that ends its step has ended: it hands back what it found and what it waits for, and its task asks to be woken
    if (!(await read($, todos)).some(one => one.id === e.agentId)) await sync($)
    if ((await read($, todos)).find(one => one.id === e.agentId)?.parentId) return { result: 'A helper is not started again this way: hand back your result now, saying what you were waiting for, and the task that started you asks Claudopus to wake it.' }
    const what = cut(oneLine(String(input.what ?? '')), 80)
    if (!what) return { result: 'Say in a few words what you wait for.' }
    const file = typeof input.file === 'string' && input.file.trim() ? input.file.trim() : undefined
    const url = typeof input.url === 'string' && /^https?:\/\/\S+$/.test(input.url.trim()) ? input.url.trim() : undefined
    const text = file && typeof input.text === 'string' && input.text.trim() ? input.text.trim().slice(0, 200) : undefined
    if (typeof input.url === 'string' && input.url.trim() && !url) return { result: 'A page is named by its whole web address, starting http:// or https://.' }
    if (file && !file.startsWith('/') && !file.startsWith('~/')) return { result: 'Name the file by its full path.' }
    const minutes = Math.min(WAKE_MOST, Math.max(0.25, Number(input.minutes) > 0 ? Number(input.minutes) : file || url ? WAKE_LONGEST : 0))
    if (!file && !url && !(Number(input.minutes) > 0)) return { result: 'Name a file, a page, or the minutes after which to start you again.' }
    // Two looks in a row that ran out: what it waits on is not coming, and it hands back what it has
    if (((await read($, todos)).find(one => one.id === e.agentId)?.wakeMisses ?? 0) >= WAKE_MISSES_MOST)
      return { result: 'Refused by Claudopus: the last two looks ran out with what you waited on never there. Hand back your report now with what you have, saying what never came and why.' }
    const at = await $.clock.now()
    // (its own card: a helper's is its own, not its work's)
    const agent = e.agentId
    if (!(await read($, todos)).some(one => one.id === agent)) await sync($)
    let isCard = false
    await changeTodos($, list => list.map(one => (one.id === agent ? ((isCard = true), { ...one, wakeWhen: { what, ...(file ? { file } : {}), ...(text ? { text } : {}), ...(url ? { url } : {}), at, until: at + minutes * 60_000 } }) : one)))
    if (!isCard) return { result: 'Claudopus has no card for you here, so it cannot start you again: carry on with what you can do now.' }
    redraw($)
    return { result: `Claudopus looks ${file ? `for ${text ? `"${text}" in ` : ''}${file}` : url ? `at ${url}` : `at the clock`} and starts you again ${file || url ? `the moment it is there, or after ${Math.round(minutes)} min with word that it never came` : `in ${Math.round(minutes)} min`}. End your step now, or carry on with what needs nothing from it.` }
  })

  // The work says what in its report waits on the person: it knows best. Its next report takes them, one item each. Each is a yes-or-no
  // question, or names its own answers: 16 Nov "settled by hand, or left behind?" came with Yes / No / Not now, which cannot answer it
  on('tool.call', { tool: 'mcp__claudopus__waits' }, async ($, e) => {
    const input = e as unknown as { items?: unknown; result?: unknown }
    const asked: Wait[] = (Array.isArray(input.items) ? input.items : []).flatMap(one => {
      const item = typeof one === 'string' ? { text: one } : one && typeof one === 'object' ? (one as { text?: unknown; choices?: unknown }) : {}
      const text = typeof item.text === 'string' ? cut(oneLine(item.text), 200) : ''
      const choices = Array.isArray(item.choices) ? [...new Set(item.choices.filter((c): c is string => typeof c === 'string').map(c => cut(oneLine(c), 40)).filter(c => c && plainWords(c) !== 'not now'))].slice(0, 4) : undefined
      return text ? [{ text, ...(choices ? { choices } : {}) }] : []
    })
    const items = asked.filter((one, n) => asked.findIndex(other => other.text === one.text) === n).slice(0, 12)
    // The chat records, for a result, what of it the person's own words left waiting: the rest is answered
    if (e.agentId === undefined) {
      const given = typeof input.result === 'string' ? input.result.trim() : ''
      if (!given) return { result: `Only a background task records what its result waits on. In the chat, name the result as \`result\` (its report.md path) once ${who()}'s own words have answered what it waits on.` }
      const list = await loadReports($)
      const found = list.find(r => given.includes(`${reportPath(r)}/`) || given === reportPath(r) || given === r.id) ?? list.find(r => slug(r.title) === slug(given))
      // The newest round of its work, which says what waits now
      const r = found ? ((entriesOf(list.filter(one => !one.archived)).find(entry => entry.some(one => one.id === found.id)) ?? [])[0] ?? found) : undefined
      if (!r) return { result: `No result is "${cut(given, 120)}": give its report.md path from the results list.` }
      const answered = await settleWaits($, r, one => (items.some(kept => kept.text === one.text || likeness(kept.text, one.text) > 0) ? undefined : IN_WORDS))
      redraw($)
      const left = openWaits((await read($, reports)).find(one => one.id === r.id) ?? r).length
      return { result: `"${r.title}": ${answered ? `${answered} answered in ${who()}'s words` : 'nothing more answered'}; ${left ? `${left} still waiting` : 'nothing waits on them now'}.` }
    }
    // A helper's answer is no report: the work it answers to records what waits
    if ((await read($, todos)).find(one => one.id === e.agentId)?.parentId) return { result: 'A helper records nothing here: say what waits in your answer, and the task that started you records it.' }
    // Refused when its words say for sure that it is not yes or no and it names no answers: the work words it again or names them
    const unfit = items.find(one => !one.choices && notYesNo(one.text))
    if (unfit) return { result: `Nothing recorded: "${unfit.text}" ${notYesNo(unfit.text)}, and the panel answers it only with Yes, No or Not now. Give it its answers in \`choices\`, a few words each (the ways it offers), or [] when only words answer it; or put it as one yes-or-no question.` }
    await change($, e.agentId, one => ({ ...one, waits: items.length ? items : undefined }))
    // What it recorded before, on the result it left, is replaced too: an item it no longer records waits no more
    const r = newestOfWork(await loadReports($), e.agentId)
    const settled = r ? await settleWaits($, r, one => (items.some(kept => kept.text === one.text) ? undefined : SETTLED)) : 0
    redraw($)
    const before = settled ? ` ${settled === 1 ? 'One item' : `${settled} items`} recorded before no longer wait${settled === 1 ? 's' : ''}.` : ''
    return { result: items.length ? `Recorded ${items.length} waiting on ${who()}; the panel shows them with your result.${before}` : `Nothing waits on ${who()}.${before}` }
  })

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until they answer or the work clears it
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; details?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown; pictures?: unknown; last_step?: unknown; folder?: unknown }
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
    // The step a go-ahead finishes with, which Claudopus does on the first choice without starting the task again: only a task's own
    // ask with buttons, in a folder that is there
    const stepGiven = typeof input.last_step === 'string' ? oneLine(input.last_step).slice(0, 400) : ''
    const stepFolder = typeof input.folder === 'string' ? input.folder.trim() : ''
    const isStepped = Boolean(stepGiven && choices.length && stepFolder.startsWith('/') && !before.find(one => one.id === e.agentId)?.parentId && (await $.fs.stat(stepFolder).catch(() => undefined))?.kind === 'dir')
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(isStepped ? { lastStep: stepGiven, folder: stepFolder } : {}), ...(details ? { details } : {}), ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices, from: e.agentId } : {}), ...(pictures.length ? { pictures } : {}), at } : undefined }))
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

