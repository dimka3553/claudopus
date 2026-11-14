// Work that goes on when the chat's process ends: a keeper on this Mac for a chat the app runs from another Mac, the cards of
// work cut off marked so, that work started again by itself, and the person told on their own device

// ---- What the keeper reads, and the keeper itself ----

// Its files, one set per chat, under keep/: <chat>.json (the mod's: how many pieces of work are at work, and which),
// <chat>.state (the keeper's: when the process ended, when the chat went on here, when the app took it back), <chat>.log
const keepFile = (id: string, kind = 'json') => `${dir}/keep/${id}.${kind}`
let keepSign = ''
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which cuts nothing off
let enginePid = ''
const pidOfEngine = async ($: EngineInterface) => ((await $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(() => undefined))?.stdout ?? '').trim()
// Kept true as the cards change: the keeper reads it once the chat's process has ended, so it says what was at work then
const saveKeep = async ($: EngineInterface) => {
  const { id, title } = await read($, me)
  if (!id || !dir) return
  const ids = (await read($, todos)).filter(one => !one.parentId && !one.chat && one.status === 'working').map(one => one.id)
  const sign = `${ids.join(',')}|${title}`
  if (sign === keepSign) return
  keepSign = sign
  await $.fs.write(keepFile(id), JSON.stringify({ count: ids.length, ids, title, pid: enginePid, at: await $.clock.now() }))
}

// A chat this Mac runs for the app on another Mac lives only as long as the app lets it: the app ends its process when it
// chooses, and the process signs in with the app's sign-in, which lapses while the app is away. So each load starts a keeper,
// in a session of its own so it outlives the process: when the process ends with work at work and the app does not start it
// again within a minute, it starts the chat again here, under this Mac's own sign-in (bin/keep). Not in the copy it starts,
// which Claude Code's own background service keeps, nor in a chat this Mac's own terminal runs
const isKeptCopy = async ($: EngineInterface) => (await $.env.get('CLAUDE_CODE_SESSION_KIND')) === 'bg'
const startKeeper = async ($: EngineInterface, id: string) => {
  if (!dir || !/^[A-Za-z0-9-]{1,80}$/.test(id) || (await isKeptCopy($))) return
  // $PPID is the chat's process, which runs this shell; perl's setsid takes the keeper out of its process group, which the
  // app ends with the process
  const script = `nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$1" "$PPID" "$2" "$3" "$4" >/dev/null 2>&1 </dev/null &`
  const r = await $.process.run(['/bin/sh', '-c', script, 'sh', `${$.plugin.root}/bin/keep`, id, cwd, dir]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  await log($, r.exitCode === 0 ? `keeper started for ${id}` : `keeper not started: ${r.stderr.slice(0, 200)}`)
}

// ---- Work cut off: marked, started again, said ----

// How long after the chat starts its cut-off work is looked at: by then Claude Code has started again what it starts itself
const CUT_LOOK = 30_000
// Work cut off longer ago than this is not started again
const CUT_OLD = 24 * 3600_000
type KeepState = { cutAt?: number; movedAt?: number; backAt?: number; copy?: string }
const parsedOr = <T,>(text: string, or: T): T => {
  try {
    return text ? (JSON.parse(text) as T) : or
  } catch {
    return or
  }
}
// What was at work when the chat's process last ended, read as it starts again, before this load writes its own
const readCut = async ($: EngineInterface, id: string) => {
  const was = parsedOr<{ ids?: unknown; at?: unknown; pid?: unknown }>(await readOr($, keepFile(id)), {})
  const state = parsedOr<KeepState>(await readOr($, keepFile(id, 'state')), {})
  const ids = Array.isArray(was.ids) ? was.ids.filter((one): one is string => typeof one === 'string' && /^[\w-]{1,80}$/.test(one)) : []
  return { ids, at: typeof was.at === 'number' ? was.at : 0, pid: typeof was.pid === 'string' ? was.pid : '', state }
}
// The words the work is started again with
const CUT_TELL = (cutAt: number, here: boolean) =>
  `From Claudopus, not {name}: this chat's process was ended at ${hhmm(cutAt)} while you were at work, not by {name}, and the chat has started again${here ? ' on this Mac by itself, under its own sign-in' : ''}. Carry on from where you were: first check what you already have, and whether a command you started still runs (one started detached goes on), then go on with your to-dos.`
const hhmm = (at: number) => new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// As the chat starts in a new process: work that was at work when the last one ended was cut off, though Claude Code may have
// started it again already. A reload of the mod in the same process changes nothing
const noteCut = async ($: EngineInterface, id: string) => {
  keepSign = ''
  if (!dir) return
  enginePid = await pidOfEngine($)
  const cut = await readCut($, id)
  if (!cut.ids.length || cut.pid === enginePid) return
  const now = await $.clock.now()
  const cutAt = cut.state.cutAt && cut.state.cutAt >= cut.at - 60_000 ? cut.state.cutAt : now
  if (now - cutAt > CUT_OLD) return void log($, `work cut off at ${hhmm(cutAt)} is too old to start again: ${cut.ids.join(', ')}`)
  const isCopy = await isKeptCopy($)
  await log($, `work cut off at ${hhmm(cutAt)}${isCopy ? ', the chat going on here as a copy' : ''}: ${cut.ids.join(', ')}`)
  $.clock.after(CUT_LOOK, () => void bringBack($, cut.ids, cutAt, isCopy).catch(err => log($, `cut-off work not started again: ${String(err)}`)))
}

// Each piece of cut-off work: one Claude Code started again by itself is marked; any other is sent a message, which starts it
// again; one that cannot be is marked cut off and left ended. Then one notice for all of them
const bringBack = async ($: EngineInterface, ids: string[], cutAt: number, isCopy: boolean) => {
  await sync($).catch(() => undefined)
  const live = await $.agent.list().catch(() => [])
  const back: string[] = []
  const lost: string[] = []
  for (const one of ids) {
    const isLive = live.some(agent => agent.id === one && WORKING.includes(agent.status))
    const r = isLive ? { isDelivered: true as const } : await $.session.send({ to: { agentId: one }, text: named(CUT_TELL(cutAt, isCopy)) }).catch(err => ({ isDelivered: false as const, reason: String(err) }))
    ;(r.isDelivered ? back : lost).push(one)
    if (!r.isDelivered) await log($, `cut-off work ${one} not started again: ${r.reason}`)
  }
  const now = await $.clock.now()
  await update($, todos, list => {
    const known = new Set(list.map(one => one.id))
    const added = ids.filter(one => !known.has(one)).map(one => ({ ...started(one, '', '', '', cutAt), status: 'stopped' as const, endedAt: cutAt }))
    return [...list, ...added].map(one =>
      back.includes(one.id) ? { ...(one.status === 'working' ? one : resumed(one, now)), parentId: '', cutAt, backAt: now } : lost.includes(one.id) ? { ...(one.status === 'working' ? ended(one, 'stopped', cutAt) : one), parentId: '', cutAt, backAt: undefined } : one,
    )
  })
  await saveKeep($)
  redraw($)
  const titles = (await read($, todos)).filter(one => ids.includes(one.id)).map(one => titleOf(one))
  const where = isCopy ? 'on this Mac by itself' : 'again'
  const text = [
    back.length ? `${back.length === 1 ? `"${titles[ids.indexOf(back[0] ?? '')] ?? 'Work'}" was cut off at ${hhmm(cutAt)} and goes` : `${back.length} pieces of work were cut off at ${hhmm(cutAt)} and go`} on ${where} since ${hhmm(now)}.` : '',
    lost.length ? `${lost.length === 1 ? 'One piece of work' : `${lost.length} pieces of work`} cut off at ${hhmm(cutAt)} could not be started again.` : '',
  ]
    .filter(Boolean)
    .join(' ')
  $.ui.log(text)
  await tellDevice($, text)
}

// The person is told on their own device: Claude Code's push to the Claude app on their phone, where Remote Control reaches it;
// and the notification this Mac's chats raise
const tellDevice = async ($: EngineInterface, text: string) => {
  const pushed = await $.tool.call({ tool: 'PushNotification', message: text.slice(0, 199) } as never).catch(err => ({ deny: String(err) }))
  await log($, `cut-off notice pushed: ${JSON.stringify(pushed).slice(0, 200)}`)
  await alertPerson($, 'cut', 'Work cut off and started again', text, `cut-${Math.round((await $.clock.now()) / 60_000)}`)
}

// The line on a card of cut-off work: when, and whether it goes on again
const cutLine = (one: Todo) =>
  one.cutAt ? (one.backAt ? `Cut off at ${hhmm(one.cutAt)} as the chat's process ended; going on again since ${hhmm(one.backAt)}.` : `Cut off at ${hhmm(one.cutAt)} as the chat's process ended; it could not be started again.`) : ''
