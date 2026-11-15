// The hidden boxes of bin/secret and bin/admin, in every chat: on this Mac's own screen and from another Mac over ssh alike

// The runner leaves a request in boxes/: what it needs, never a value. The panel draws it at its top with a field; what is typed
// there goes from the field straight into this Mac's keychain on security's stdin, under the request's id, where the runner takes it
// and removes it. It never reaches the chat, a notice, the saved words, a file or the log. The chat that asked (the request names it)
// takes the request first; any other chat with a screen after BOX_GRACE. Taking it leaves the .told mark, which tells the runner a
// panel asks: with none in its first seconds, nothing on this Mac draws one (a -p run with no chat open) and it falls back to its own
// The box's wording is the panel's own, made from the request's fields: its kind (admin or secret), the Mac (host) or the key's name
// (name), and why it asks again (again). A request carries no text that is shown: one with any field the panel does not know how to
// word (a host on a key, a name on a password), a kind it does not know or a host or name it would not take, is drawn as nothing;
// any other field is left unread. A planted request so shows only what the runners would ask. This stops slips and common tricks;
// it is no wall against code set on getting round it
type Asked = { id: string; text: string; at: number; chat?: string; command?: string; key?: string; call?: string }
// The Bash calls of this chat that run bin/admin or bin/secret, by call id, with their command: a box is drawn only for a request of
// this chat's own while one of them runs (one sent to the background for BOX_OLD after it began), and says which command asked. A
// request no runner of this chat could have made, however it is worded, is drawn nowhere
const runnerCalls = new Map<string, { command: string; at: number; until: number }>()
const runnerBegun = (id: string, command: string, at: number) => void runnerCalls.set(id, { command, at, until: Infinity })
const runnerEnded = (id: string, isBackground: boolean, at: number) => {
  const one = runnerCalls.get(id)
  if (!one) return
  if (isBackground) runnerCalls.set(id, { ...one, until: one.at + BOX_OLD })
  else runnerCalls.delete(id)
  for (const [key, other] of [...runnerCalls]) if (other.until < at) runnerCalls.delete(key)
}
// The command that asked: the one of this chat's running runners begun last before the request
const runnerOf = (at: number, now: number) => [...runnerCalls].map(([call, one]) => ({ ...one, call })).filter(one => one.until >= now && one.at <= at + BOX_SKEW).sort((a, b) => b.at - a.at)[0]
const BOX_SKEW = 60_000
// What the runners take as a Mac (an ssh host or alias, perhaps with a user) and as a key's name
const BOX_HOST = /^(?:here|[A-Za-z0-9_][A-Za-z0-9._:@-]{0,199})$/
const BOX_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,199}$/
// The public half of the key bin/admin made for one request, as DER in base64: an RSA key of 2048 bits or more
const BOX_KEY = /^MII[A-Za-z0-9+/]{280,1400}={0,2}$/
// The key each request was first seen with: a request whose key changed after that is drawn nowhere, so a key put in its place by
// something else gets nothing typed for the runner
const boxKeys = new Map<string, string>()
// What was typed, sealed to the runner's key (RSA-OAEP, SHA-256) by openssl, which only the runner that asked can open: the value
// on openssl's stdin, the key on a pipe of its own, so neither is ever in a file or a command line but the key, which is public
const SEAL_FOR = 'PATH=/usr/bin:/bin; openssl pkeyutl -encrypt -pubin -keyform DER -inkey <(printf %s "$1" | openssl base64 -d -A) -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | openssl base64 -A'
const sealedFor = async ($: EngineInterface, key: string, value: string) => {
  const r = await $.process.run(['/bin/bash', '-c', SEAL_FOR, 'sh', key], { stdin: value, timeoutMs: 15_000 }).catch(() => undefined)
  const out = r?.exitCode === 0 ? r.stdout.trim() : ''
  return /^[A-Za-z0-9+/]{300,}={0,2}$/.test(out) ? out : ''
}
const BOX_AGAIN: Record<string, string> = {
  refused: 'That password was refused. ',
  short: 'That was shorter than 4 characters. ',
  control: 'That held a line break or another control character. ',
}
// The wording for a request, or undefined for one the panel does not draw
const boxWording = (one: Record<string, unknown>): string | undefined => {
  // A reason it does not know is left out
  const again = typeof one.again === 'string' && Object.hasOwn(BOX_AGAIN, one.again) ? BOX_AGAIN[one.again]! : ''
  if (one.kind === 'admin') {
    // A password is sent only sealed to the key the runner made for this one request: a request with none is drawn nowhere
    if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined || typeof one.key !== 'string' || !BOX_KEY.test(one.key)) return undefined
    const mac = one.host === 'here' ? thisMac() : one.host
    return `${again}Claudopus needs the admin password of ${mac} to run the admin command below. Nothing is kept: it goes only to that command, and the next one asks again.`
  }
  if (one.kind === 'secret') {
    if (one.host !== undefined) return undefined
    // No name: the first box of a key saved by hand asks its name
    if (one.name === undefined) return 'Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.'
    if (typeof one.name !== 'string' || !BOX_NAME.test(one.name)) return undefined
    return `${again}Claudopus needs ${one.name}. It is kept only in ${keptWhere()}, and work uses it by name, hidden in what its commands print.`
  }
  return undefined
}
let boxes: Asked[] = []
// What the person just did with a box or an admin command, shown a minute at the top of the panel where it was: what they did and
// what happens now, so nothing that needed them just vanishes
// A note tied to the call the press let go (`call`) goes once that call ends, never before DONE_LEAST so it can be read, and at
// most DONE_LONGEST while it runs; one with no call is shown DONE_SHOWN
type DoneNote = { id: string; head: string; said: string; what: string; at: number; isOn?: boolean; call?: string; endedAt?: number }
let doneNotes: DoneNote[] = []
const DONE_SHOWN = 60_000
const DONE_LEAST = 15_000
const DONE_LONGEST = 30 * 60_000
const isNoteShown = (one: DoneNote, at: number) =>
  !one.call ? at - one.at < DONE_SHOWN : one.endedAt === undefined ? at - one.at < DONE_LONGEST : at < Math.max(one.endedAt, one.at + DONE_LEAST)
// The calls that have ended, so a note made after its call ended (a runner sent to the background) is over from the start
const callsEnded = new Set<string>()
const noteDone = async ($: EngineInterface, note: Omit<DoneNote, 'at'>) => {
  const at = await $.clock.now()
  const made = { ...note, at, ...(note.call && note.endedAt === undefined && callsEnded.has(note.call) ? { endedAt: at } : {}) }
  doneNotes = [...doneNotes.filter(one => one.id !== note.id && isNoteShown(one, at)), made].slice(-6)
  drawAgain($)
  // Drawn again as its time ends, so it goes with nothing else to redraw the panel
  $.clock.after((!made.call ? DONE_SHOWN : made.endedAt !== undefined ? DONE_LEAST : DONE_LONGEST) + 100, () => drawAgain($))
}
// The call a note tells of has ended: what it said is over, so the note goes (after DONE_LEAST from its press)
const noteCallEnded = async ($: EngineInterface, call: string) => {
  callsEnded.add(call)
  if (callsEnded.size > 200) callsEnded.delete(callsEnded.values().next().value ?? '')
  if (!doneNotes.some(one => one.call === call && one.endedAt === undefined)) return
  const at = await $.clock.now()
  doneNotes = doneNotes.map(one => (one.call === call && one.endedAt === undefined ? { ...one, endedAt: at } : one))
  drawAgain($)
  const last = Math.max(...doneNotes.filter(one => one.call === call).map(one => one.at + DONE_LEAST))
  $.clock.after(Math.max(0, last - at) + 100, () => drawAgain($))
}
// What was done is a line, as Claude Code reports a call's result under it: a mark and the words, with no box, fill or edge, so it is
// never taken for a card of work. Green once allowed or given, grey once refused or cancelled
const reportLine = (ui: Ui, key: string, isOn: boolean, said: string, lines: string[]) => (
  <ui.Box key={key} flexDirection="row" gap={1} paddingX={2} flexShrink={0}>
    <ui.Text color={isOn ? DONE : undefined} dimColor={!isOn}>{isOn ? '✓' : '✕'}</ui.Text>
    <ui.Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
      <ui.Text wrap="wrap">{said}</ui.Text>
      {lines.filter(Boolean).map((line, n) => <ui.Text key={`${key}-${n}`} dimColor wrap="truncate-end">{line}</ui.Text>)}
    </ui.Box>
  </ui.Box>
)
const doneNotesPart = (ui: Ui, at: number) =>
  doneNotes.filter(one => isNoteShown(one, at)).map(one => reportLine(ui, `done-${one.id}`, Boolean(one.isOn), one.said, [one.head, one.what]))
// What a box asks for, in a few words, for its note once answered
const boxHead = (text: string) => {
  const name = text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)?.[1]
  const mac = text.match(/admin password of (.+?) to run/)?.[1]
  return mac ? `The admin password of ${mac}` : name ? `The key ${name}` : 'A key to save'
}
// What is typed in a box is kept by the surface alone, never here or drawn back: a drawing that carried it put older letters over
// newer ones. Each try that left the box to be typed again gives its field a new key, so the field starts empty
const boxTries = new Map<string, number>()
// A line under a box: what went wrong with what was sent
const boxSaid = new Map<string, string>()
// Sent from here: the box goes at once, before the runner removes its request
const boxSent = new Set<string>()
let boxPresses = 0
// A request older than the runner's own wait there (590 s, under the longest a Bash call may run) is one whose runner is gone
const BOX_OLD = 11 * 60_000
// What security reads as one line (it cuts a line at about 4095, seen), and gives back as typed: plain printable characters (others it
// prints as hex). The longest value, escaped, leaves room for the rest of the line
const BOX_LONGEST = 3800
const BOX_SERVICE = 'claudopus-box'
const BOX_ID = /^[0-9a-f-]{36}$/
const boxesDir = () => `${dir}/boxes`
// Another chat's request is left to it this long, so its own chat tells it, when that chat is open
const BOX_GRACE = 5000
// In the chat only the name of what is asked, once per box, in the chat that asked or else whichever chat sees it first
const BOX_TOLD = (text: string) => `${text} Click in the box at the top of the Claudopus panel and type it there, never in this chat's prompt (/claudopus opens the panel). What is typed in the box goes only into ${keptWhere()}.`
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID, read at each look (a /clear can change it)
let boxChat = ''
// Requests this chat has told or seen told
const boxTold = new Set<string>()

const lookBoxes = async ($: EngineInterface) => {
  if (!dir) return
  // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
  if (!(await $.session.surfaces().catch(() => [])).length) return
  boxChat = await $.session.id().catch(() => '')
  const now = await $.clock.now()
  const found: Asked[] = []
  const entries = await $.fs.list(boxesDir()).catch(() => [])
  for (const entry of entries) {
    // A mark left after its request went (a chat that marked it as the runner ended) goes too
    const marked = entry.name.replace(/\.told$/, '')
    if (entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(other => other.name === `${marked}.json`)) await $.process.run(['rm', '-f', `${boxesDir()}/${entry.name}`]).catch(() => undefined)
    const id = entry.name.replace(/\.json$/, '')
    if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id)) continue
    try {
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Record<string, unknown>
      const text = one && typeof one === 'object' ? boxWording(one) : undefined
      // Only this chat's own request, dated no later than now, while a runner of this chat's that could have made it runs
      const runner = typeof one.at === 'number' ? runnerOf(one.at, now) : undefined
      const key = typeof one.key === 'string' ? one.key : undefined
      if (key && !boxKeys.has(id)) boxKeys.set(id, key)
      const isKeySame = !key || boxKeys.get(id) === key
      if (one.id === id && text && isKeySame && typeof one.at === 'number' && now - one.at < BOX_OLD && one.at - now <= BOX_SKEW && one.chat === boxChat && boxChat && runner) found.push({ id, text, at: one.at, chat: one.chat, command: runner.command, call: runner.call, ...(one.kind === 'admin' && key ? { key } : {}) })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      // and a value typed into it meanwhile leaves the keychain with it
      else if (typeof one.at === 'number' && (now - one.at >= BOX_OLD || one.at - now > BOX_SKEW)) {
        await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`]).catch(() => undefined)
        await boxKeyring($, 'delete', id)
      }
    } catch {
      // A request being written is read at the next look
    }
  }
  found.sort((a, b) => a.at - b.at)
  for (const one of found) {
    if (boxTold.has(one.id)) continue
    // Another chat's request waits for that chat a moment (and every request does, in a chat that cannot read its own id)
    if (one.chat !== undefined && one.chat !== boxChat && now - one.at < BOX_GRACE) continue
    boxTold.add(one.id)
    // The first chat to make the mark brings its panel up with the field ready to type in (focus is given only over an empty
    // prompt), and tells it. A panel that cannot be drawn here gives the mark back, so another chat or the runner's own box asks
    const mark = await $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', `${boxesDir()}/${one.id}.told`]).catch(() => ({ exitCode: 1 }))
    if (mark.exitCode !== 0) continue
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(err => (log($, `panel not opened for a box: ${String(err)}`), undefined))
    if (!opened?.isPlaced) {
      await $.process.run(['rm', '-f', `${boxesDir()}/${one.id}.told`]).catch(() => undefined)
      await log($, `box ${one.id} given back: the panel is not drawn here${opened && !opened.isPlaced ? ` (${opened.reason})` : ''}`)
      continue
    }
    $.ui.log(BOX_TOLD(one.text))
  }
  for (const id of boxTold) if (!found.some(one => one.id === id)) boxTold.delete(id)
  for (const id of boxKeys.keys()) if (!entries.some(entry => entry.name === `${id}.json`)) boxKeys.delete(id)
  for (const id of [...boxTries.keys(), ...boxSaid.keys()]) if (!found.some(one => one.id === id)) (boxTries.delete(id), boxSaid.delete(id))
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  drawAgain($)
}

// A box's entry in the keychain: on Linux bin/keyring, which keeps it in a file only this user reads; on a Mac security itself,
// which sendBox calls as before for set and has, so only delete goes through here
const boxKeyring = ($: EngineInterface, what: 'set' | 'has' | 'delete', id: string, stdin?: string) =>
  isLinux
    ? $.process.run([`${$.plugin.root}/bin/keyring`, what, BOX_SERVICE, id, ...(what === 'set' ? ['Claudopus box'] : [])], { stdin, timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
    : what === 'delete'
      ? $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
      : Promise.resolve({ exitCode: -1 })
// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  if (!value) return
  const refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? `That was longer than ${BOX_LONGEST} characters, so it was not sent.` : /[^\x20-\x7E]/.test(value) ? 'That held a line break, a curly quote or another character outside plain letters, digits and signs, so it was not sent. Type it again.' : ''
  if (refused) {
    boxSaid.set(id, refused)
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const request = `${boxesDir()}/${id}.json`
  // A runner that has stopped, or a box answered in another chat, takes nothing: its value would stay in the keychain
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id, 'It was no longer waiting · nothing was saved'))
  // An admin password goes only sealed to its runner's key: what sits in the keychain a moment is of no use to anything else
  const asked = boxes.find(other => other.id === id)
  const sent = asked?.key ? await sealedFor($, asked.key, value) : value
  if (!sent) {
    boxSaid.set(id, 'It could not be sealed for the command that asked, so it was not sent.')
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const escaped = sent.replace(/[\\"]/g, '\\$&')
  const r = isLinux
    ? await boxKeyring($, 'set', id, `${sent}\n`)
    : await $.process
        .run(['/usr/bin/security', '-i'], { stdin: `add-generic-password -U -s "${BOX_SERVICE}" -a "${id}" -l "Claudopus box" -w "${escaped}"\n`, timeoutMs: 15_000 })
        .catch(() => ({ exitCode: -1 }))
  // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
  const isKept = r.exitCode === 0 && (isLinux ? await boxKeyring($, 'has', id) : await $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))).exitCode === 0
  // and one whose runner stopped meanwhile is taken out again
  if (isKept && !(await $.fs.exists(request).catch(() => false))) await boxKeyring($, 'delete', id)
  boxPresses += 1
  boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
  if (!isKept) {
    boxSaid.set(id, `It could not be put in ${keptWhere()}. Try again.`)
    await log($, `box ${id} not kept: security ended ${r.exitCode}`)
  } else {
    boxSent.add(id)
    boxSaid.delete(id)
    const one = boxes.find(other => other.id === id)
    boxes = boxes.filter(other => other.id !== id)
    if (one) await noteDone($, { id: `box-${id}`, ...(one.call ? { call: one.call } : {}), head: boxHead(one.text), said: one.key ? 'You gave it · it went only to the command that asked, which goes on now' : `You gave it · it is in ${keptWhere()}, and what asked for it goes on now`, what: '', isOn: true })
    await log($, `box ${id} sent to the keychain`)
  }
  drawAgain($)
}
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string, said = 'You cancelled · nothing was saved, and what asked for it stops without it') => {
  boxSent.add(id)
  const one = boxes.find(other => other.id === id)
  boxes = boxes.filter(other => other.id !== id)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  // Cancelled, nothing more comes of it: it is over at once
  if (one) await noteDone($, { id: `box-${id}`, ...(one.call ? { call: one.call, endedAt: 0 } : {}), head: boxHead(one.text), said, what: '' })
  drawAgain($)
}

const boxesPart = ($: EngineInterface, ui: Ui) => {
  if (!boxes.length || !('Input' in ui)) return null
  // This chat's own requests first, the first of them with the keys, so a value typed for the notice it told goes to its own box
  const shown = [...boxes.filter(one => one.chat === boxChat), ...boxes.filter(one => one.chat !== boxChat)]
  return shown.map((one, n) => (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
      <ui.Text dimColor wrap="truncate-end">{`${one.key ? 'Admin password' : 'Key'} · waits for you to type it`}</ui.Text>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      {one.command ? <ui.Text dimColor wrap="wrap">{`Asked by this chat's command: ${cut(oneLine(one.command), 200)}`}</ui.Text> : null}
      <ui.Text dimColor wrap="wrap">{one.key ? 'What you type here shows as you type it. It goes only to the command that asked, sealed for it, never into a chat, and is not kept.' : `What you type here shows as you type it. It goes only into ${keptWhere()}, never into a chat.`}</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxTries.get(one.id) ?? 0}`}
          placeholder="Type or paste it here"
          submitLabel="send"
          autoFocus={n === 0 ? true : undefined}
          onInput={() => holdTimes($)}
          onSubmit={value => void (freeTimes($), sendBox($, one.id, value).catch(() => log($, `box ${one.id} not sent`)))}
        />
      </ui.Box>
      {boxSaid.get(one.id) ? <ui.Text key={`box-${one.id}-said`} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      <ui.Box flexDirection="row">
        <ui.Button key={`box-${one.id}-cancel-${boxPresses}`} label="Cancel" plain onPress={() => void cancelBox($, one.id)} />
      </ui.Box>
    </ui.Box>
  ))
}
