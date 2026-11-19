// The chat's process: what is at work is kept beside it, so a card found at work after the process was replaced says that the app
// closed while it worked; and the watcher that brings Claudopus back should Claude switch it off

// keep/<chat>.json: the chat's process and what is at work in it, kept true as the cards change
const keepFile = (id: string, kind = 'json') => `${dir}/keep/${id}.${kind}`
let keepSign = ''
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which ends nothing
let enginePid = ''
const pidOfEngine = async ($: EngineInterface) => ((await $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(() => undefined))?.stdout ?? '').trim()
const saveKeep = async ($: EngineInterface) => {
  const { id } = await read($, me)
  if (!id || !dir) return
  const list = await read($, todos)
  const atWork = list.filter(one => !one.chat && one.status === 'working')
  // (each task with its title, so a card the new process does not have comes back under its own name)
  const titles = Object.fromEntries(atWork.filter(one => !one.parentId).map(one => [one.id, oneLine(one.title).slice(0, 200)]))
  const sign = `${atWork.map(one => one.id).join(',')}|${Object.values(titles).join('|')}`
  if (sign === keepSign) return
  keepSign = sign
  await $.fs.write(keepFile(id), JSON.stringify({ ids: atWork.map(one => one.id), titles, pid: enginePid, at: await $.clock.now() }))
}
const parsedOr = <T,>(text: string, or: T): T => {
  try {
    return text ? (JSON.parse(text) as T) : or
  } catch {
    return or
  }
}
// As the chat starts: a command lasts only while the app is open, so what was at work when the chat's process was replaced (the app
// quit, restarted or dropped the chat) ended with it. Its card says so, Failed with why, and nothing starts it again by itself:
// the person's Start again does. What Claude Code itself runs again in the new process is at work
const noteClosed = async ($: EngineInterface, id: string) => {
  keepSign = ''
  if (!dir) return
  enginePid = await pidOfEngine($)
  const was = parsedOr<{ ids?: unknown; titles?: unknown; pid?: unknown }>(await readOr($, keepFile(id)), {})
  const wasPid = typeof was.pid === 'string' ? was.pid : ''
  if (!/^\d+$/.test(wasPid) || !/^\d+$/.test(enginePid) || wasPid === enginePid) return
  const isId = (one: unknown): one is string => typeof one === 'string' && /^[\w-]{1,80}$/.test(one)
  const titles = Object.fromEntries(Object.entries(was.titles && typeof was.titles === 'object' ? (was.titles as Record<string, unknown>) : {}).filter((pair): pair is [string, string] => isId(pair[0]) && typeof pair[1] === 'string'))
  const live = await $.agent.list().catch(() => [])
  const isLive = (one: string) => live.some(agent => agent.id === one && WORKING.includes(agent.status))
  const now = await $.clock.now()
  const closed: string[] = []
  await changeTodos($, list => {
    closed.length = 0
    const known = new Set(list.map(one => one.id))
    const added = Object.keys(titles).filter(one => !known.has(one) && !isLive(one)).map(one => started(one, '', titles[one] ?? '', '', now))
    return [...list, ...added].map(one => (one.chat || one.status !== 'working' || isLive(one.id) ? one : (closed.push(one.id), { ...ended(one, 'failed', now), why: WHY_APP_CLOSED, bg: undefined })))
  })
  if (closed.length) await log($, `the chat's process was replaced (${wasPid} to ${enginePid}) while work was at work: ${closed.join(', ')} ended with it`)
}


// ---- Back by itself after Claude switches it off ----

// Claude's engine switches off an add-on that held its shared helper for five seconds, and that chat has no Claudopus until the
// person types /reload-plugins. The engine loads an add-on again by itself when one of its own settings changes, so each chat's
// load writes its beat, keep/<chat>.beat naming the chat's process, every BEAT_EVERY, and starts bin/revive, one on the Mac at a
// time, which changes the setting "revived" (plugin.json's userConfig) when a beat goes quiet while its process still runs.
// Changed, it loads Claudopus again in every chat, as an update does
const BEAT_EVERY = 3000
const beatFile = (id: string) => `${dir}/keep/${id}.beat`
const configDir = async ($: EngineInterface) => (await $.env.get('CLAUDE_CONFIG_DIR')) || `${(await $.env.get('HOME')) ?? ''}/.claude`
// The key this copy has in the settings: claudopus@<marketplace> for an installed one, whether Claude Code keeps it in its cache or
// loads it from the marketplace's own folder (a marketplace of a folder on this Mac, as Claudopus's own checkout); claudopus@inline
// for one loaded with --plugin-dir. On 16 Nov this Mac's chats ran from the checkout, and claudopus@inline would have changed nothing
const ownKey = async ($: EngineInterface, configDir: string) => {
  const market = /\/plugins\/cache\/([^/]+)\/claudopus\//.exec($.plugin.root)?.[1]
  if (market && /^[\w.-]+$/.test(market)) return `claudopus@${market}`
  const known = parsedOr<Record<string, { installLocation?: string }>>(await readOr($, `${configDir}/plugins/known_marketplaces.json`), {})
  const name = Object.entries(known).find(([, one]) => typeof one?.installLocation === 'string' && one.installLocation && ($.plugin.root === one.installLocation || $.plugin.root.startsWith(`${one.installLocation.replace(/\/$/, '')}/`)))?.[0]
  return name && /^[\w.-]+$/.test(name) ? `claudopus@${name}` : 'claudopus@inline'
}
let beatLine = ''
const beat = async ($: EngineInterface, id: string) => {
  if (!dir || !beatLine || isEnded) return
  await $.fs.write(beatFile(id), beatLine)
  // The proof that it comes back, for someone who wants to see it: keep/<chat>.hold-test holding this chat's process number, written
  // by hand, makes this chat's Claudopus hold Claude's helper long enough to be switched off, once, in the next drawing of its panel
  // or the next message: the engine switches off only an add-on that holds the helper while one of its hooks is answering, not in a
  // timer of its own (16 Nov trial). It is taken away whatever it holds
  const proof = `${dir}/keep/${id}.hold-test`
  if (!isHoldTestDue && (await $.fs.exists(proof))) {
    const said = (await readOr($, proof)).trim()
    await $.process.run(['rm', '-f', proof])
    if (said !== enginePid) return void log($, "a hold-test file that did not name this chat's process was taken away")
    isHoldTestDue = true
    $.ui.invalidate('ui.render')
  }
}
let isHoldTestDue = false
const holdTest = async ($: EngineInterface) => {
  if (!isHoldTestDue) return
  isHoldTestDue = false
  await log($, "holding Claude's helper on purpose, as keep/<chat>.hold-test asked")
  const end = Date.now() + 10_000
  while (Date.now() < end) Math.sqrt(Date.now())
}
const startReviver = async ($: EngineInterface, id: string) => {
  if (!dir || !SAFE_CHAT.test(id)) return
  if (!enginePid) enginePid = await pidOfEngine($)
  if (!/^\d+$/.test(enginePid)) return
  // A load the setting brought back says so in the log, with how long its chat had gone without it
  const back = (await readOr($, `${dir}/keep/${id}.revived`)).trim().split('\n').at(-1)?.split(' ') ?? []
  const backAt = Number(back[0] ?? 0) * 1000
  if (backAt && (await $.clock.now()) - backAt < 120_000) await log($, `back after Claude switched Claudopus off in this chat (its beat was quiet ${back[1] ?? '?'} s)`)
  const config = await configDir($)
  const settings = `${config}/settings.json`
  if (/[\t\n]/.test(settings)) return
  // and, on a line of its own, the load that writes it: one that beats again after the watcher's change was never off, only slow
  // (bin/revive; a watcher of an older version reads the first line as before)
  beatLine = `${enginePid}\t${await ownKey($, config)}\t${settings}\n${thisLoad}\n`
  await beat($, id)
  everyLoad($, BEAT_EVERY, () => beat($, id).catch(() => undefined))
  // In a session of its own, so it outlives the chat's process; it leaves at once when one of this copy already runs
  const script = `nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$1" "$2" >/dev/null 2>&1 </dev/null &`
  const r = await $.process.run(['/bin/sh', '-c', script, 'sh', `${$.plugin.root}/bin/revive`, dir]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  if (r.exitCode !== 0) await log($, `the watcher that brings Claudopus back was not started: ${r.stderr.slice(0, 200)}`)
}
// A chat that ends leaves no beat behind
const endBeat = async ($: EngineInterface, id: string) => {
  beatLine = ''
  // (the moment it ended, so a restart that follows says when, though the beat is gone)
  if (dir && SAFE_CHAT.test(id) && enginePid) await $.fs.write(`${dir}/keep/${id}.ended`, `${enginePid}\t${Math.round(await $.clock.now())}\n`).catch(() => undefined)
  if (dir && SAFE_CHAT.test(id)) await $.process.run(['rm', '-f', beatFile(id)]).catch(() => undefined)
}
const SAFE_CHAT = /^[A-Za-z0-9-]{1,80}$/
const REVIVED_KEY = 'claudopus.revived'
