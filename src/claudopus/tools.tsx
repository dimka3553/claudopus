// The mod's own tools: update, recall, todo, waits, ask and note

const toolHooks = (on: On) => {

  on('tool.call', { tool: 'mcp__claudopus__update' }, async ($, e) => {
    const input = e as unknown as { name?: string; repo?: string; state?: string; summary?: string; brief?: string }
    if (!input.name?.trim()) return { result: 'A subject needs a name.' }
    const saved = await saveStream($, input.name, { repo: input.repo, state: input.state?.slice(0, 60), summary: input.summary })
    // The subject a piece of work recorded names the subject of its report
    if (e.agentId !== undefined) await change($, e.agentId, one => ({ ...one, subject: saved.name }))
    const path = `${dir}/streams/${slug(saved.name)}.md`
    if (input.brief?.trim()) await $.fs.write(`${dir}/streams/${slug(saved.name)}.md`, `${input.brief.trim()}\n`)

    return { result: `- ${[saved.name, saved.repo, saved.session, saved.state, saved.summary].join(' | ')}\nBrief: ${path}${input.brief?.trim() ? ' (rewritten)' : ''}` }
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
    if (e.agentId === undefined) return { result: "Only background work has a to-do in the panel; a chat's own thread has none." }
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
    if (e.agentId === undefined) return { result: "Only background work leaves a result; a chat's own thread has none." }
    // A helper's answer is no report: the work it answers to records what waits
    if ((await read($, todos)).find(one => one.id === e.agentId)?.parentId) return { result: 'A helper records nothing here: say what waits in your answer, and the work that started you records it.' }
    const items = [...new Set((Array.isArray(input.items) ? input.items : []).filter((one): one is string => typeof one === 'string').map(one => cut(oneLine(one), 200)).filter(Boolean))].slice(0, 12)
    await change($, e.agentId, one => ({ ...one, waits: items.length ? items : undefined }))
    return { result: items.length ? `Recorded ${items.length} waiting on ${who()}; the panel shows them with your result.` : `Nothing waits on ${who()}.` }
  })

  // Work that needs the person's hands now: its card stands out with the ask and its Copy, until it is cleared or the work ends
  on('tool.call', { tool: 'mcp__claudopus__ask' }, async ($, e) => {
    const input = e as unknown as { text?: unknown; copy?: unknown; choices?: unknown; command?: unknown; cwd?: unknown }
    if (e.agentId === undefined) return { result: `Only background work asks through the panel; a chat's own thread asks ${who()} in its reply.` }
    const text = oneLine(typeof input.text === 'string' ? input.text : '').slice(0, 300)
    const command = oneLine(typeof input.command === 'string' ? input.command : '').slice(0, 1000)
    // Copy is for text pasted elsewhere: a sentence of instructions, or the ask's own words, gets none
    const given = (typeof input.copy === 'string' ? input.copy : '').trim().slice(0, 4000)
    const isProse = given.split(/\s+/).length > 8 && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(given) && !/[\/=_$`@]|https?:/.test(given)
    const copy = command || (isProse || flat(text).includes(flat(given)) ? '' : given)
    const folder = typeof input.cwd === 'string' && input.cwd.startsWith('/') ? input.cwd : cwd
    const choices = [...new Set((Array.isArray(input.choices) ? input.choices : []).filter((one): one is string => typeof one === 'string').map(one => oneLine(one).slice(0, 40)).filter(Boolean))].slice(0, 4)
    const at = await $.clock.now()
    const before = await read($, todos)
    const was = before.find(one => one.id === topOf(before, e.agentId ?? ''))?.ask
    await change($, e.agentId, one => ({ ...one, ask: text ? { text, ...(copy ? { copy } : {}), ...(command ? { isCommand: true, cwd: folder } : {}), ...(choices.length ? { choices, from: e.agentId } : {}), at } : undefined }))
    if (!text) return { result: 'Cleared: your card no longer asks for anything.' }
    const list = await read($, todos)
    const card = list.find(one => one.id === topOf(list, e.agentId ?? ''))
    // The same ask said again is not told again
    if (card && was?.text !== text) await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`))
    // A command for the person gets a terminal at once, so they type it there without looking for one. The app runs its terminal
    // tools only for Claude, never for a plugin's own code, so the work opens it
    const terminal = command ? ` Now open a terminal for it yourself, at once: mcp__terminal__open_terminal_tab with cwd "${folder}" and a short title; never type or run the command in it.` : ''
    const shown = [command ? 'the command with a Copy button' : copy ? 'a Copy button for the text' : '', `the buttons ${(choices.length ? choices : DEFAULT_ANSWERS).join(', ')} and a box for a reply in their own words`].filter(Boolean).join(' and ')
    return { result: `Shown on your card with ${shown}, and ${who()} was told. Any answer clears the ask and comes back to you as a message; ask again if it leaves something waiting. Clear it with empty text once it is done.${terminal}` }
  })

  // The work writes its own log, on purpose, in plain words: what it starts and what it decides
  on('tool.call', { tool: 'mcp__claudopus__note' }, async ($, e) => {
    const input = e as unknown as { text?: string; decision?: boolean; task?: string }
    const text = oneLine(input.text ?? '').slice(0, NOTE_CHARS)
    if (!text) return { result: 'A note needs its text.' }
    if (e.agentId === undefined) return { result: "Only background work keeps a log in the panel; a chat's own thread has none." }
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
    const handed = `A message from ${who()} to the work "${card?.title || 'in the background'}" is a new task of its own, not part of that work, and the work has not done it. Start it as its own piece of work: ${task}${words ? `\n${who(true)}'s words: “${words}”` : ''}`

    return { result: `Noted. Hand the task to the chat now: call SendMessage (load it with ToolSearch if needed) with to "main" and this message, exactly:\n${handed}\nThen carry on with your own work; do not do that task here.` }
  })

}

