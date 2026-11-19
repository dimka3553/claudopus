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
// Ends waiting to be announced together, and when each was last announced, by id
let ready: { id: string }[] = []
let isSettling = false
const announced = new Map<string, number>()
// Work the person stopped with its Stop button: they saw it end, so it is not announced
const pressed = new Set<string>()
const standing = (status: string, endedAt: number) => (status === 'working' ? 'working' : `${status}:${endedAt}`)

// Looks for work of this chat's that has ended since the last look; helpers are never listed, so never announced
const lookEnds = async ($: EngineInterface) => {
  const mine = await sessionName($)
  // (each as its card shows it: one that handed back while a command or helper of its own still runs has not ended yet, and is
  // announced once that has ended, however long ago its report came)
  const cards = shownAs(await read($, todos)).filter(one => !one.parentId)
  const runs = (await read($, flows)).filter(f => f.session === mine)
  const now = await $.clock.now()
  const all = [...cards.map(one => ({ id: one.id, status: one.status, endedAt: one.endedAt })), ...runs.map(f => ({ id: `flow:${f.id}`, status: f.status, endedAt: f.endedAt }))]
  const was = lastSeen
  lastSeen = new Map(all.map(one => [one.id, standing(one.status, one.endedAt)]))
  if (!was) return
  for (const one of all) {
    const before = was.get(one.id)
    if (one.status === 'working' || before === undefined || before === standing(one.status, one.endedAt) || cutPending.has(one.id)) continue
    if ((now - one.endedAt > STALE_END && before !== 'working') || now - (announced.get(one.id) ?? -Infinity) < AGAIN) continue
    announced.set(one.id, now)
    if (pressed.delete(one.id)) continue
    ready.push({ id: one.id })
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
const readyOf = ({ id }: { id: string }, cards: Todo[], runs: Flow[]) => {
  if (id.startsWith('flow:')) {
    const f = runs.find(one => `flow:${one.id}` === id)
    if (!f) return undefined
    const what = f.status === 'done' ? fewWords(f.result) || 'Done.' : f.status === 'failed' ? 'Failed.' : 'Stopped.'
    return { title: f.title || f.name || 'Workflow', isDone: f.status === 'done', what }
  }
  const kept = cards.find(card => card.id === id)
  if (!kept) return undefined
  // (as its card shows it: one that still waits for a command or helper of its own has not ended, and one that left to-dos is not done)
  const one = shownOne(cards, id) ?? kept
  if (one.status === 'working') return undefined
  const said = [...one.entries].reverse().find(entry => entry.kind === 'note')?.text ?? ''
  const what =
    one.status === 'done'
      ? fewWords(one.answer) || fewWords(said) || 'Done.'
      : one.status === 'failed'
        ? 'Failed.'
        : 'Stopped.'
  if (one.leftOpen) return { title: one.title || 'Task', isDone: false, what: `Not done: ${one.leftOpen === 1 ? 'a to-do is' : `${one.leftOpen} to-dos are`} left.` }
  return { title: one.title || 'Task', isDone: one.status === 'done', what }
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
  // (a task whose result asks something is waiting for the person, not done)
  const isWaiting = (one: (typeof items)[number]) => 'isWaiting' in one && Boolean(one.isWaiting)
  const done = items.filter(one => one.isDone && !isWaiting(one)).length
  const waiting = items.filter(isWaiting).length
  const title = items.length === 1 && first ? first.title : done === items.length ? `${items.length} tasks are done` : waiting ? `${items.length} tasks ended · ${waiting} waiting for you` : `${items.length} tasks ended`
  const text = items.length === 1 && first ? first.what : items.map(one => `${one.title}: ${isWaiting(one) ? 'waiting for you' : one.isDone ? 'done' : one.what.replace(/\.$/, '').toLowerCase()}`).join(' · ').slice(0, 300)
  await alertPerson($, 'ready', title, text, `ready-${ids.map(one => one.id).join('-')}`)
}

// What /claudopus and /servers answer where the screen has nowhere to draw a panel, as a Remote Control chat seen from another device
const nowhere = (panel: string) => `Claudopus can't show the ${panel} panel on this screen. Open it in the Claude app on the Mac this chat runs on.`


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
// A task Claudopus could not reach, that waits for good until someone sends it a message: its card says so, the person hears it as
// a notification, and the chat's model is told, with no line in the chat
const lostToPerson = async ($: EngineInterface, one: Todo, said: string, ask = '') => {
  await stepLine($, one.id, said)
  await aloud($, 'ask', `${titleOf(one)} needs you`, said, `lost-${one.id}`).catch(err => log($, `lost task not told aloud: ${String(err)}`))
  await tellChat($, ask ? `${said} ${ask}` : said)
}
const askAloud = ($: EngineInterface, one: Todo, text: string) => aloud($, 'ask', `${titleOf(one)} has a question for you`, text, `ask-${one.id}`)

// A question on a card nobody has answered is said again, with the "needs you" sound, this long after it was asked, and no more
// after the last. 17 Nov: a sign-in and a go-ahead to push sat unseen for hours, as only the first notification ever went
const REMIND_AT = [15 * 60_000, 60 * 60_000, 4 * 3_600_000, 12 * 3_600_000]
// What waits on the person on a card: its question, or the Allow its commands wait for, its words, and since when: since the question
// came, or since the person's last reply to it that did not settle it. Not on a stopped card
const waitingOnPerson = (one: Todo) =>
  one.status === 'stopped'
    ? undefined
    : one.ask && !isActingOnReply(one) && !one.ask.refused
      ? { text: one.ask.text, at: Math.max(one.ask.at, one.ask.replied?.at ?? 0) }
      : one.admins?.length
        ? {
            text: one.admins.some(a => a.kind === 'release')
              ? 'A release waits for you to allow it on its card.'
              : one.admins.some(a => a.kind === 'file')
                ? 'A change to your file waits for Allow or Deny on its card.'
                : 'An admin command waits for Allow or Deny on its card.',
            at: Math.min(...one.admins.map(a => a.at)),
          }
        : undefined
const remindAsks = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const due: { one: Todo; text: string; at: number; times: number }[] = []
  await changeTodos($, list => {
    due.length = 0
    let isChanged = false
    const next = list.map(one => {
      const waits = one.parentId ? undefined : waitingOnPerson(one)
      if (!waits) return one
      // How many reminders are due by now: one that came due while the chat was closed is said once, never one for each missed
      const times = REMIND_AT.filter(after => now - waits.at >= after).length
      const said = one.reminded?.at === waits.at ? one.reminded.times : 0
      if (times <= said) return one
      isChanged = true
      due.push({ one, ...waits, times })
      return { ...one, reminded: { at: waits.at, times } }
    })
    return isChanged ? next : list
  })
  for (const { one, text, at } of due) {
    await log($, `reminded of what waits on the person on ${one.id}, since ${took(now - at)} ago`)
    await aloud($, 'ask', `${titleOf(one)} still waits for you`, `Waiting ${minutesSaid(Math.round((now - at) / 60_000))} · ${text}`, `remind-${one.id}-${at}-${Math.floor(now / 60_000)}`).catch(err => log($, `reminder not sent: ${String(err)}`))
  }
}

// What the chat's model reads with a message of the person's: what the latest cards show, so it answers how things stand from the
// cards rather than from memory (18 Nov: "I can't see your panel, so I'm guessing which card is which"), sent again only once they
// changed, and what has waited on a card, so its reply names each once an hour at most while nobody answers it, until the last reminder
const ASK_NAMED_AFTER = 5 * 60_000
const ASK_NAMED_EVERY = 60 * 60_000
const ASK_NAMED_MOST = REMIND_AT.at(-1)!
const askNamed = new Map<string, number>()
let cardsSent = ''
const cardsNow = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const list = (await read($, todos)).filter(one => {
    const waits = one.parentId ? undefined : waitingOnPerson(one)
    return !one.parentId && (one.status === 'working' ? true : waits ? now - waits.at < ASK_NAMED_MOST : now - one.endedAt < 30 * 60_000)
  }).slice(-12)
  const facts = list.map(one => {
    const waits = waitingOnPerson(one)
    const items = one.items.filter(item => item.state !== 'dropped')
    const doing = items.find(item => item.state === 'doing')?.text
    const note = [...one.entries].reverse().find(entry => entry.kind === 'note')?.text
    const what = waits
      ? `waiting for {name}: ${cut(oneLine(waits.text), 160)}`
      : one.status === 'working'
        ? `working, ${items.filter(item => item.state === 'done').length} of ${items.length} to-dos done${doing ? `, doing "${cut(doing, 80)}"` : ''}${note ? `, last note "${cut(oneLine(note), 120)}"` : ''}`
        : one.status
    return { one, waits, what, row: `- "${cut(titleOf(one), 80)}" (${one.id}): ${waits ? `${what.replace(/^waiting for \{name\}/, `waiting for {name} for ${minutesSaid(Math.round((now - waits.at) / 60_000))}`)}` : one.status === 'working' ? what : `${what} ${minutesSaid(Math.round((now - one.endedAt) / 60_000))} ago`}` }
  })
  const toName = facts.filter(({ one, waits }) => {
    const key = waits ? `${one.id}:${waits.at}` : ''
    if (!waits || now - waits.at < ASK_NAMED_AFTER || now - (askNamed.get(key) ?? -Infinity) < ASK_NAMED_EVERY) return false
    askNamed.set(key, now)
    return true
  })
  // (sent again only when something on them changed, not their times, or a card is to be named)
  const sign = mark(facts.map(f => `${f.one.id}:${f.what}`).join('\n'))
  if (!toName.length && sign === cardsSent) return ''
  cardsSent = sign
  if (!facts.length) return ''
  const nameThem = toName.length
    ? `\nWaiting on {name} on ${toName.length === 1 ? 'a card' : 'cards'}, unanswered: ${toName.map(({ one }) => `"${cut(titleOf(one), 80)}"`).join(', ')}. Unless your reply is about ${toName.length === 1 ? 'it' : 'them'}, end it with one short line saying which card waits for {name} and what for, so it isn't missed.`
    : ''
  return `What the latest task cards show now, for when {name} asks how things stand: answer from this, not from memory, and leave it out of a reply about something else:\n${facts.map(f => f.row).join('\n')}${nameThem}`
}
