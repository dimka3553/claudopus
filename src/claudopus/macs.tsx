// The other Macs over ssh: their chats fetched, and the same results on every Mac

// The other Macs config.json names under `macs`, as ssh reaches them; none for a person with one Mac. Each is known by the name
// config.json gives it, and shown by the first part of its host name
let macs: string[] = []
const macPath = (mac: string) => `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.json`
// One connection to each Mac is kept open a minute after its last use and shared by every chat here, so a trip costs a fraction
// of a second rather than a new login each time, and a name pressed on that Mac opens here within moments. A connection gone dead,
// as after sleep, is dropped within ten seconds and the next call logs in afresh
const ssh = (mac: string, command: string) => ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=5', '-o', 'ControlMaster=auto', '-o', 'ControlPath=/tmp/claudopus-%i-%C', '-o', 'ControlPersist=60', '-o', 'ServerAliveInterval=5', '-o', 'ServerAliveCountMax=2', '--', mac, command]
// This Mac's own name, as its Sharing settings give it, read once: what it is called on the Macs it hands its chats to
let localName = ''
const knowLocalName = async ($: EngineInterface) => {
  if (localName) return localName
  const r = await runOn($, isLinux ? ['hostname', '-s'] : ['scutil', '--get', 'LocalHostName'], { timeoutMs: 5_000 }).catch(() => ({ exitCode: -1, stdout: '' }))
  localName = keyOf(r.exitCode === 0 ? r.stdout.trim() : '') || 'mac'
  return localName
}
// What a trip leaves in this Mac's copy: the fetch, when it was fetched and last tried, the answers it carried (put away there on
// the next trip) and the names of those carried lately, so an answer carried twice is left for its chat once
type Fetched = { mac: string; text: string; fetchedAt: number; triedAt: number; acks?: string[]; seen?: string[] }
// This Mac's own chats' files, as handed to the other Macs: those written in the last three minutes, never another Mac's copies
const ownFiles = async ($: EngineInterface, now: number) => {
  const listed = (await $.fs.list(liveDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json') && !(entry.mtimeMs && now - entry.mtimeMs > 180_000))
  return (await Promise.all(listed.map(entry => readOr($, `${liveDir()}/${entry.name}`)))).filter(text => text.trim().startsWith('{')).map(forOtherMac)
}
// What leaves this Mac for another: a chat's file less every command and text that work runs or sends. Gone are the text an ask
// gives to paste (a code, a token or a command), the command or text a prompt shows whole and the words of its line that came from
// the command, the command a card shows running, sent to the background or detached (and the log it writes), and the command, change
// or release an admin, file or release press is asked for: a card there says what kind of thing waits, and what it is in the work's
// own words where it gave some, never the command. All of it stays on this Mac's own cards and in its chats
const AS_COMMAND = 'a command'
const forOtherMac = (text: string) => {
  try {
    const one = JSON.parse(text) as { cards?: unknown; ended?: unknown; prompts?: unknown }
    type Run = { what?: unknown; cmd?: unknown; label?: unknown; log?: unknown; pid?: unknown }
    // The work's own words for what runs, never a line of the command itself
    const said = (run: Run) => {
      const what = typeof run.what === 'string' ? run.what : ''
      const cmd = typeof run.cmd === 'string' ? run.cmd : ''
      const label = typeof run.label === 'string' ? run.label : ''
      const first = cmd.split('\n')[0]?.trim() ?? ''
      const isCommand = !what || (first && (first.startsWith(what.trim()) || what.trim().startsWith(first.slice(0, 40)) || cmd.includes(what.trim())))
      return isCommand ? label && !cmd.includes(label) ? label : AS_COMMAND : what
    }
    const run = (r: unknown) => {
      if (!r || typeof r !== 'object') return r
      const { cmd: _cmd, label: _label, log: _log, pid: _pid, ...rest } = r as Run & Record<string, unknown>
      return 'cmd' in (r as object) ? { ...rest, what: said(r as Run), ...('log' in (r as object) ? { cmd: '', log: '' } : {}) } : rest
    }
    const card = (c: unknown) => {
      if (!c || typeof c !== 'object') return c
      const t = c as Record<string, unknown> & { ask?: Record<string, unknown>; running?: unknown; bg?: unknown; detached?: unknown; admins?: unknown }
      const ask = t.ask ? (({ copy: _copy, ...rest }) => rest)(t.ask) : undefined
      return {
        ...t,
        ...(t.ask ? { ask } : {}),
        ...(t.running ? { running: run(t.running) } : {}),
        ...(Array.isArray(t.bg) ? { bg: t.bg.map(run) } : {}),
        ...(Array.isArray(t.detached) ? { detached: t.detached.map(run) } : {}),
        ...(Array.isArray(t.admins) ? { admins: t.admins.map(g => (g && typeof g === 'object' ? { ...(g as object), command: '' } : g)) } : {}),
      }
    }
    const prompt = (p: unknown) => {
      if (!p || typeof p !== 'object') return p
      const { detail: _detail, ...rest } = p as { detail?: unknown; text?: unknown; kind?: unknown }
      // "Run a command: <its words>": only the kind of thing it asks, as the words after it may be the command
      return typeof rest.text === 'string' && rest.kind === 'allow' ? { ...rest, text: rest.text.split(': ')[0] } : rest
    }
    const each = (list: unknown, fn: (one: unknown) => unknown) => (Array.isArray(list) ? list.map(fn) : list)
    return JSON.stringify({ ...one, cards: each(one.cards, card), ended: each(one.ended, card), prompts: each(one.prompts, prompt) })
  } catch {
    return text
  }
}
// Each other Mac is reached by whichever chat here finds its copy older than FETCH_EVERY: one trip for every chat on this Mac. A trip
// hands that Mac this Mac's chats, brings back its chats and the answers pressed there for this Mac's chats. What a trip that failed
// leaves is the copy before it, which goes stale on its own
let isFetching = false
const fetchMacs = async ($: EngineInterface) => {
  if (isFetching) return
  isFetching = true
  try {
    const from = await knowLocalName($)
    for (const mac of macs) {
      const now = await $.clock.now()
      const was = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
      if (now - Math.max(was.fetchedAt ?? 0, was.triedAt ?? 0) < FETCH_EVERY) continue
      const kept = { mac, text: was.text ?? '', fetchedAt: was.fetchedAt ?? 0, acks: was.acks ?? [], seen: was.seen ?? [] }
      await $.fs.write(macPath(mac), JSON.stringify({ ...kept, triedAt: now }))
      const push = pushOf(from, keyOf(macName(mac)), now, await ownFiles($, now))
      const r = await runOn($, ssh(mac, trip(from, kept.acks)), { stdin: push, timeoutMs: 15_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }))
      if (r.exitCode !== 0 || !r.stdout.includes('\n')) {
        // Said once when the Mac stops answering, not at every try
        if ((was.fetchedAt ?? 0) >= (was.triedAt ?? 0)) await log($, `chats on ${mac} not fetched: ${r.stderr.trim().slice(0, 160)}`)
        continue
      }
      const fetchedAt = await $.clock.now()
      const { text, carried } = tripOf(r.stdout)
      // An answer carried back from that Mac answers nothing here: an ask is answered only in its own chat, and that Mac (or anything
      // that can write its outbox) proves nothing of who pressed it. Each is only put away there, on the next trip
      const names = carried.map(one => one.name)
      if (names.some(name => !kept.seen.includes(name))) await log($, `answers carried from ${mac} put away unread: an ask is answered only in its own chat`)
      await $.fs.write(macPath(mac), JSON.stringify({ mac, text, fetchedAt, triedAt: now, acks: names, seen: [...new Set([...kept.seen, ...names])].slice(-200) }))
    }
  } finally {
    isFetching = false
  }
}

// The results of each other Mac made the same as this one's, at most every RESULTS_EVERY, by whichever chat here comes first: what
// that Mac lacks is handed to it, what this one lacks is brought here, and the marks of a result both have are made the same on both.
// A result is moved into place only whole and only where none has its name; nothing is deleted
const resultsPath = (mac: string) => `${liveDir()}/${MACS}/${mac.replace(/[^A-Za-z0-9_.-]/g, '-')}.results.json`
// What one sync with a Mac leaves: when, and each result both have that was put away then, with when
type Synced = { syncedAt?: number; triedAt?: number; archived?: Record<string, number>; tried?: Record<string, number> }
let isSyncing = false
const syncResults = async ($: EngineInterface) => {
  if (isSyncing) return
  isSyncing = true
  try {
    let isTried = false
    for (const mac of macs) {
      const now = await $.clock.now()
      const was = JSON.parse((await readOr($, resultsPath(mac))) || '{}') as Synced
      if (now - Math.max(was.syncedAt ?? 0, was.triedAt ?? 0) < RESULTS_EVERY) continue
      isTried = true
      await $.fs.write(resultsPath(mac), JSON.stringify({ ...was, triedAt: now }))
      const staging = `${reportsDir()}/_sync/${now}-${Math.random().toString(36).slice(2, 8)}`
      try {
        await syncWith($, mac, was, now, staging)
      } finally {
        await runOn($, ['rm', '-rf', staging, `${staging}-out`]).catch(() => undefined)
      }
    }
    // What a sync cut off left of its own folders goes after an hour; nothing else there is ever touched
    if (isTried) await runOn($, ['find', `${reportsDir()}/_sync`, '-mindepth', '1', '-maxdepth', '1', '-mmin', '+60', '-exec', 'rm', '-rf', '{}', '+']).catch(() => undefined)
  } finally {
    isSyncing = false
  }
}
// The results missing on one side that one trip takes: those tried longest ago first, never tried before all, so results that keep
// failing, or that the other Mac keeps leaving out, take turns with the rest and never hold them back
const aTrip = (ids: string[], tried: Record<string, number> = {}) =>
  ids.map((id, i) => ({ id, i, at: tried[id] ?? 0 })).sort((a, b) => a.at - b.at || a.i - b.i).slice(0, RESULTS_A_TRIP).map(one => one.id)
const syncWith = async ($: EngineInterface, mac: string, was: Synced, now: number, staging: string) => {
  const home = dir.slice(0, -'/.claude/claudopus'.length)
  const looked = await runOn($, ssh(mac, RESULTS_LOOK), { timeoutMs: 60_000 }).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err), isStdoutTruncated: false }))
  // A list cut short is no list: what it leaves out would look missing there
  const theirs = looked.exitCode === 0 && !looked.isStdoutTruncated ? resultsOf(looked.stdout) : undefined
  if (!theirs) {
    if ((was.syncedAt ?? 0) >= (was.triedAt ?? 0)) await log($, `results on ${mac} not looked at: ${looked.isStdoutTruncated ? 'its list was cut short' : looked.stderr.trim().slice(0, 160)}`)
    return
  }
  // This Mac's results as they stand: each folder with its meta.json, by name
  const mine = new Map<string, string>()
  for (const entry of await $.fs.list(reportsDir()).catch(() => [])) {
    if (entry.kind !== 'dir' || !isResultId(entry.name)) continue
    const text = await readOr($, `${reportsDir()}/${entry.name}/meta.json`)
    if (text.trim().startsWith('{')) mine.set(entry.name, text)
  }
  let changed = 0
  // Brought here one at a time, each into a folder of its own first, its paths moved onto this Mac's home, then into place whole:
  // one whose stream was cut short is left out, and brought on a later trip
  const missingHere = [...theirs.results.keys()].filter(id => !mine.has(id))
  const missingThere = [...mine.keys()].filter(id => !theirs.results.has(id))
  const wanted = aTrip(missingHere, was.tried)
  for (const id of wanted) {
    const into = `${staging}/${id}`
    await runOn($, ['mkdir', '-p', into])
    const r = await runOn($, ['bash', '-c', PULL, 'bash', into, mac, pullThere([id])], { timeoutMs: 300_000 }).catch(err => ({ exitCode: -1, stderr: String(err) }))
    // Its stream ends with an empty _end, so one cut between two files is known as cut
    const isWhole = r.exitCode === 0 && (await $.fs.exists(`${into}/_end`).catch(() => false))
    if (!isWhole || (parsedMeta(await readOr($, `${into}/${id}/meta.json`)) as { id?: unknown }).id !== id) {
      await log($, `result ${id} from ${mac} not brought: ${r.exitCode !== 0 ? r.stderr.trim().slice(0, 160) : 'it came cut short'}`)
      continue
    }
    for (const file of ['meta.json', 'report.md']) {
      const text = await readOr($, `${into}/${id}/${file}`)
      if (text) await $.fs.write(`${into}/${id}/${file}`, rehome(text, theirs.home, home))
    }
    const moved = await runOn($, ['sh', '-c', PLACE, 'sh', `${into}/${id}`, `${reportsDir()}/${id}`, `${reportsDir()}/_sync/claim-${id}`]).catch(() => ({ exitCode: -1 }))
    if (moved.exitCode === 0) changed += 1
  }
  // Handed there: copied aside here with its paths moved onto that Mac's home, then sent in one stream, put in place there only
  // once the whole stream is in
  const handed = aTrip(missingThere, was.tried)
  if (handed.length) {
    const out = `${staging}-out`
    await runOn($, ['mkdir', '-p', out])
    const ready: string[] = []
    for (const id of handed) {
      if ((await runOn($, ['cp', '-Rp', `${reportsDir()}/${id}`, `${out}/${id}`]).catch(() => ({ exitCode: -1 }))).exitCode !== 0) continue
      for (const file of ['meta.json', 'report.md']) {
        const text = await readOr($, `${out}/${id}/${file}`)
        if (text) await $.fs.write(`${out}/${id}/${file}`, rehome(text, home, theirs.home))
      }
      ready.push(id)
    }
    const r = ready.length ? await runOn($, ['bash', '-c', PUSH, 'bash', out, mac, PUSH_THERE, ...ready], { timeoutMs: 300_000 }).catch(err => ({ exitCode: -1, stderr: String(err) })) : { exitCode: 0, stderr: '' }
    if (r.exitCode !== 0) await log($, `results not handed to ${mac}: ${r.stderr.trim().slice(0, 160)}`)
  }
  // What the person did to a result both have: the later of put away and brought back, every answer, on both. Each side is written
  // only when it differs; there only when unchanged since it was read
  let marked = 0
  const archived: Record<string, number> = {}
  for (const [id, there] of theirs.results) {
    const here = mine.get(id)
    if (!here) continue
    const wasArchived = was.archived?.[id] ?? 0
    const theirsNow = broughtBackBy(parsedMeta(there.text), wasArchived)
    const mineNow = broughtBackBy(parsedMeta(here), wasArchived)
    const target = marksOf(mineNow, theirsNow)
    // Its archive is kept as made the same only once both sides hold it; else what was kept before stands
    let isSame = marked < RESULTS_A_TRIP
    if (marked < RESULTS_A_TRIP) {
      if (merged(here, theirsNow, wasArchived)) {
        const ok = await markReport($, { id } as Report, stored => marksOf(broughtBackBy(stored, wasArchived), theirsNow)).then(() => true, err => (void log($, `result ${id} not marked from ${mac}: ${String(err)}`), false))
        ;(isSame &&= ok), (changed += 1), (marked += 1)
      }
      const theirsNext = merged(there.text, mineNow, wasArchived)
      if (theirsNext) {
        const r = await runOn($, ssh(mac, markThere(id, there.sum)), { stdin: theirsNext, timeoutMs: 15_000 }).catch(err => ({ exitCode: -1, stderr: String(err) }))
        if (r.exitCode !== 0) await log($, `result ${id} not marked on ${mac}: ${r.exitCode === 3 ? 'changed there since' : r.stderr.trim().slice(0, 160)}`)
        ;(isSame &&= r.exitCode === 0), (marked += 1)
      }
    }
    const kept = isSame ? (target.archived ?? 0) : wasArchived
    if (kept) archived[id] = kept
  }
  if (changed) await loadReports($)
  // When each result still missing on either side was last tried; one that has come across is dropped from it the next trip
  const tried: Record<string, number> = {}
  for (const id of [...missingHere, ...missingThere]) if (was.tried?.[id]) tried[id] = was.tried[id]
  for (const id of [...wanted, ...handed]) tried[id] = now
  await $.fs.write(resultsPath(mac), JSON.stringify({ syncedAt: await $.clock.now(), triedAt: now, brought: wanted.length, handed: handed.length, marked, archived, tried }))
  if (wanted.length || handed.length || marked) await log($, `results with ${mac}: ${wanted.length} brought, ${handed.length} handed, ${marked} marked`)
}

// The Macs that handed this one their chats lately, by the name each gave, and what the freshest called this Mac: its name here once
// other Macs' chats are listed beside its own
const pushedFrom = new Set<string>()
