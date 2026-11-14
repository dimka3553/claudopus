// Work that is ready or needs the person: a short sound and a notification

// ---- Work that is ready: a short sound and a notification ----

// The sound, a file of the mod's: two soft rising notes, 0.75 s, made by mockups/claudopus-sound/ready.py
const READY_SOUND = 'sounds/ready.wav'
// Ends this close together are one sound and one notification
const SETTLE = 800
// Work that ends again this soon after it was announced is not announced again
const AGAIN = 10_000
// An end the mod learns of this long after it happened, as work read back after a restart, is not announced
const STALE_END = 60_000
// How each card and workflow of this chat's stood when last looked at, by id. Unset until the first look after the mod loads,
// which only takes note, so a reload announces nothing
let lastSeen: Map<string, string> | undefined
// Ends waiting to be announced together, with what waited on the person as the end was seen (its report takes that over soon
// after), and when each was last announced, by id
let ready: { id: string; waits?: string[] }[] = []
let isSettling = false
const announced = new Map<string, number>()
// Work the person stopped with its Stop button: they saw it end, so it is not announced
const pressed = new Set<string>()
const standing = (status: string, endedAt: number) => (status === 'working' ? 'working' : `${status}:${endedAt}`)

// Looks for work of this chat's that has ended since the last look; helpers are never listed, so never announced
const lookEnds = async ($: EngineInterface) => {
  const mine = await sessionName($)
  const cards = (await read($, todos)).filter(one => !one.parentId)
  const runs = (await read($, flows)).filter(f => f.session === mine)
  const now = await $.clock.now()
  const all = [...cards.map(one => ({ id: one.id, status: one.status, endedAt: one.endedAt, waits: one.waits })), ...runs.map(f => ({ id: `flow:${f.id}`, status: f.status, endedAt: f.endedAt, waits: undefined as string[] | undefined }))]
  const was = lastSeen
  lastSeen = new Map(all.map(one => [one.id, standing(one.status, one.endedAt)]))
  if (!was) return
  for (const one of all) {
    const before = was.get(one.id)
    if (one.status === 'working' || before === undefined || before === standing(one.status, one.endedAt) || cutPending.has(one.id)) continue
    if (now - one.endedAt > STALE_END || now - (announced.get(one.id) ?? -Infinity) < AGAIN) continue
    announced.set(one.id, now)
    if (pressed.delete(one.id)) continue
    ready.push({ id: one.id, waits: one.waits })
  }
  if (ready.length && !isSettling) {
    isSettling = true
    $.clock.after(SETTLE, () => void announce($).catch(err => log($, `ready not announced: ${String(err)}`)))
  }
}

// A few words of what work left: the first sentence of what it found, cut short
const fewWords = (text: string) => {
  const found = gistOf(text) || oneLine(text.replace(/[*_`#>]/g, ''))
  const sentence = /^.{12,}?[.!?](?=\s|$)/.exec(found)?.[0] ?? found
  return sentence.length > 140 ? `${sentence.slice(0, 139).trimEnd()}…` : sentence
}

// What one ended piece of work or workflow says in a notification
const readyOf = ({ id, waits: seen }: { id: string; waits?: string[] }, cards: Todo[], runs: Flow[]) => {
  if (id.startsWith('flow:')) {
    const f = runs.find(one => `flow:${one.id}` === id)
    if (!f) return undefined
    const what = f.status === 'done' ? fewWords(f.result) || 'Finished.' : f.status === 'failed' ? 'Stopped by an error.' : 'Stopped.'
    return { title: f.title || f.name || 'Workflow', isDone: f.status === 'done', what }
  }
  const one = cards.find(card => card.id === id)
  if (!one) return undefined
  const waits = one.waits ?? seen ?? []
  const said = [...one.entries].reverse().find(entry => entry.kind === 'note')?.text ?? ''
  const what =
    one.status === 'done'
      ? waits.length
        ? `Waits on ${who()}: ${fewWords(waits[0] ?? '')}${waits.length > 1 ? ` (and ${waits.length - 1} more)` : ''}`
        : fewWords(one.answer) || fewWords(said) || 'Finished.'
      : one.status === 'failed'
        ? 'Stopped by an error.'
        : 'Stopped.'
  return { title: one.title || 'Work', isDone: one.status === 'done', what }
}

// One sound for all that ended together, only when some finished; one notification naming them. config.json switches each off
const announce = async ($: EngineInterface) => {
  isSettling = false
  const ids = ready
  ready = []
  let config: { sound?: unknown; notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves both on
  }
  const cards = await read($, todos)
  const runs = await read($, flows)
  const items = ids.map(one => readyOf(one, cards, runs)).filter(one => one !== undefined)
  if (!items.length) return
  if (config.sound !== false && items.some(one => one.isDone)) void $.audio.play({ asset: READY_SOUND }).catch(err => log($, `ready sound not played: ${String(err)}`))
  if (config.notifications === false) return
  const [first] = items
  const done = items.filter(one => one.isDone).length
  const title = items.length === 1 && first ? first.title : done === items.length ? `${items.length} pieces of work are ready` : `${items.length} pieces of work ended`
  const text = items.length === 1 && first ? first.what : items.map(one => `${one.title}: ${one.isDone ? 'ready' : one.what.replace(/\.$/, '').toLowerCase()}`).join(' · ').slice(0, 300)
  await alertPerson($, 'ready', title, text, `ready-${ids.map(one => one.id).join('-')}`)
}

// What /claudopus and /servers answer where the screen has nowhere to draw a panel, as a Remote Control chat seen from another device
const nowhere = (panel: string) => `The ${panel} panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on.`

// The desktop app's own id for the chat this engine runs, which its link `claude://code/continue?session=` opens (read off the
// app: it takes `last` or an id of this shape). Unset in a terminal
const DESKTOP_SESSION = /^local_[A-Za-z0-9-]{1,64}$/

// What a click on a notification opens: this chat in the Claude app, else the app this chat runs in, such as its terminal
const clickOf = async ($: EngineInterface) => {
  const session = (await $.env.get('CLAUDE_CODE_HOST_SESSION_ID')) ?? ''
  if (DESKTOP_SESSION.test(session)) return ['--open', `claude://code/continue?session=${session}`]
  const app = (await $.env.get('__CFBundleIdentifier')) ?? ''
  return /^[A-Za-z0-9.-]{1,200}$/.test(app) ? ['--activate', app] : []
}

// One notification, through the app, else as Claudopus in this Mac's Notification Centre, with its icon, a click opening the
// chat; else, where Claudopus may not notify, macOS's plain one. `what` names it in the log. Work that needs the person (`asks`)
// goes as Claudopus Asks, the amber octopus, and with `chime` its notification carries the "needs you" sound, which macOS plays
// as the person set it for that app and as a Focus allows. Says whether the sound went with the notification. `opens`, a link to
// another chat, is what a click opens instead of this chat; the app's own notification, which opens this chat, is then passed over
const alertPerson = async ($: EngineInterface, what: string, title: string, text: string, key: string, asks?: { chime: boolean }, opens?: string) => {
  const sent = opens !== undefined ? { isSent: false as const, reason: 'another chat' } : await $.ui.notify(text, { title, key: key.slice(0, 200) }).catch(err => ({ isSent: false as const, reason: String(err) }))
  if (sent.isSent || sent.reason === 'disabled' || sent.reason === 'refused') {
    void log($, `${what}: ${title} — ${sent.isSent ? `notified through ${sent.channel}` : `not notified (${sent.reason})`}`)
    return false
  }
  // The desktop app takes no notification from a mod yet (no-surface): Claudopus.app raises it. 0 shown, 5 macOS is asking the
  // person to allow Claudopus and it is shown once they do
  const click = [...(opens ? ['--open', opens] : opens === undefined ? await clickOf($) : []), '--key', key.slice(0, 200)]
  const run = (lead: string[]) => $.process.run([`${$.plugin.root}/bin/notify`, ...lead, '--title', title, '--text', text, ...click]).catch(err => ({ exitCode: -1, stderr: String(err) }))
  const amber = asks ? await run(['--asks', ...(asks.chime ? ['--chime'] : [])]) : undefined
  if (amber && (amber.exitCode === 0 || amber.exitCode === 5)) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${amber.exitCode === 0 ? 'notified through Claudopus Asks' : 'macOS asked to allow Claudopus Asks'}`)
    // Shown now with its sound; one waiting on macOS's question goes without it, so the mod's chime is heard instead
    return amber.exitCode === 0 && asks?.chime === true && !isLinux
  }
  // Claudopus Asks turned off in System Settings, or it failed: the purple Claudopus, without the sound
  const own = await run([])
  const tried = amber ? `Claudopus Asks said ${amber.exitCode}; ` : ''
  if (own.exitCode === 0 || own.exitCode === 5) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}${own.exitCode === 0 ? 'notified through Claudopus' : 'macOS asked to allow Claudopus'}`)
    return false
  }
  // Linux: bin/notify was the desktop's own notification, and with no desktop there is none; the panel and the terminal show it
  if (isLinux) {
    void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}${own.exitCode === 3 ? 'no desktop notification on this machine' : `notify-send said ${own.exitCode}`}`)
    return false
  }
  // Claudopus notifications turned off in System Settings, or it failed: macOS's plain notification. Elsewhere osascript is
  // missing and nothing is shown
  const mac = await $.process
    .run(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', title, text])
    .catch(err => ({ exitCode: -1, stderr: String(err) }))
  void log($, `${what}: ${title} — app said ${sent.reason}; ${tried}Claudopus said ${own.exitCode}; ${mac.exitCode === 0 ? 'notified through macOS' : `macOS notification failed: ${mac.stderr.slice(0, 120)}`}`)
  return false
}

// The mod's own chime for what needs the person, as bin/notify's for the notification: asks within this long of it are not heard again
const QUIET_CHIME = 5_000
let lastChime = -Infinity
// Work that needs the person's hands says so at once: the panel comes up with its card standing out, and a notification with the
// "needs you" sound. config.json's sound off makes it silent; its notifications off leaves only the mod's own chime. The chime
// plays apart from the notification only where the notification could not carry the sound, so one ask is heard once
const aloud = async ($: EngineInterface, what: string, title: string, text: string, key: string, opens?: string) => {
  let config: { sound?: unknown; notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves both on
  }
  const chime = config.sound !== false
  const isHeard = config.notifications !== false && (await alertPerson($, what, title, text, key, { chime }, opens))
  const now = await $.clock.now()
  if (!chime || isHeard || now - lastChime < QUIET_CHIME) return
  lastChime = now
  void $.audio.play({ asset: READY_SOUND }).catch(err => log($, `ask sound not played: ${String(err)}`))
}
const askAloud = ($: EngineInterface, one: Todo, text: string) => aloud($, 'ask', `${titleOf(one)} needs you`, text, `ask-${one.id}`)
