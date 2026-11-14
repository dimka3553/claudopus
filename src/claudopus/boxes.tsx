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
type Asked = { id: string; text: string; at: number; chat?: string }
// What the runners take as a Mac (an ssh host or alias, perhaps with a user) and as a key's name
const BOX_HOST = /^(?:here|[A-Za-z0-9_][A-Za-z0-9._:@-]{0,199})$/
const BOX_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,199}$/
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
    if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined) return undefined
    const mac = one.host === 'here' ? 'this Mac' : one.host
    return `${again}Claudopus needs the admin password of ${mac} to run an admin command. It is kept only in this Mac's keychain, and later admin commands on ${mac} run without asking again until it is forgotten.`
  }
  if (one.kind === 'secret') {
    if (one.host !== undefined) return undefined
    // No name: the first box of a key saved by hand asks its name
    if (one.name === undefined) return 'Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.'
    if (typeof one.name !== 'string' || !BOX_NAME.test(one.name)) return undefined
    return `${again}Claudopus needs ${one.name}. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.`
  }
  return undefined
}
let boxes: Asked[] = []
// What the person just did with a box or an admin command, shown a minute at the top of the panel where it was: what they did and
// what happens now, so nothing that needed them just vanishes
type DoneNote = { id: string; head: string; said: string; what: string; at: number; isOn?: boolean }
let doneNotes: DoneNote[] = []
const DONE_SHOWN = 60_000
const noteDone = async ($: EngineInterface, note: Omit<DoneNote, 'at'>) => {
  const at = await $.clock.now()
  doneNotes = [...doneNotes.filter(one => one.id !== note.id && at - one.at < DONE_SHOWN), { ...note, at }].slice(-6)
  $.ui.invalidate('ui.render')
  // Drawn again as its minute ends, so it goes with nothing else to redraw the panel
  $.clock.after(DONE_SHOWN + 100, () => $.ui.invalidate('ui.render'))
}
const doneNotesPart = (ui: Ui, at: number) =>
  doneNotes
    .filter(one => at - one.at < DONE_SHOWN)
    .map(one => (
      <ui.Box key={`done-${one.id}`} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
        <ui.Box width={1} flexShrink={0} backgroundColor={one.isOn ? LIVE : FILL} />
        <ui.Box flexDirection="column" paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
          <ui.Text bold wrap="truncate-end">{one.head}</ui.Text>
          <ui.Text wrap="wrap" color={one.isOn ? LIVE : undefined} bold={one.isOn}>{one.said}</ui.Text>
          {one.what ? <ui.Text dimColor wrap="wrap">{one.what}</ui.Text> : null}
        </ui.Box>
      </ui.Box>
    ))
// What a box asks for, in a few words, for its note once answered
const boxHead = (text: string) => {
  const name = text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)?.[1]
  const mac = text.match(/admin password of (.+?) to run/)?.[1]
  return mac ? `The admin password of ${mac}` : name ? `The key ${name}` : 'A key to save'
}
// What is being typed in each box, only in this code's memory, so a redraw keeps it; gone once it is sent
const boxDrafts = new Map<string, string>()
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
const BOX_TOLD = (text: string) => `${text} Click in the box at the top of the Claudopus panel and type it there, never in this chat's prompt (/claudopus opens the panel). What is typed in the box goes only into this Mac's keychain.`
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
      if (one.id === id && text && typeof one.at === 'number' && now - one.at < BOX_OLD) found.push({ id, text, at: one.at, chat: typeof one.chat === 'string' && one.chat ? one.chat : undefined })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      // and a value typed into it meanwhile leaves the keychain with it
      else if (typeof one.at === 'number' && now - one.at >= BOX_OLD) {
        await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`]).catch(() => undefined)
        await $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => undefined)
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
  for (const id of [...boxDrafts.keys(), ...boxSaid.keys()]) if (!found.some(one => one.id === id)) (boxDrafts.delete(id), boxSaid.delete(id))
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  $.ui.invalidate('ui.render')
}

// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  boxDrafts.delete(id)
  if (!value) return
  const refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? `That was longer than ${BOX_LONGEST} characters, so it was not sent.` : /[^\x20-\x7E]/.test(value) ? 'That held a line break, a curly quote or another character outside plain letters, digits and signs, so it was not sent. Type it again.' : ''
  if (refused) {
    boxSaid.set(id, refused)
    boxPresses += 1
    return void $.ui.invalidate('ui.render')
  }
  const request = `${boxesDir()}/${id}.json`
  // A runner that has stopped, or a box answered in another chat, takes nothing: its value would stay in the keychain
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id, 'It was no longer waiting · nothing was saved'))
  const escaped = value.replace(/[\\"]/g, '\\$&')
  const r = await $.process
    .run(['/usr/bin/security', '-i'], { stdin: `add-generic-password -U -s "${BOX_SERVICE}" -a "${id}" -l "Claudopus box" -w "${escaped}"\n`, timeoutMs: 15_000 })
    .catch(() => ({ exitCode: -1 }))
  // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
  const isKept = r.exitCode === 0 && (await $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))).exitCode === 0
  // and one whose runner stopped meanwhile is taken out again
  if (isKept && !(await $.fs.exists(request).catch(() => false))) await $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => undefined)
  boxPresses += 1
  if (!isKept) {
    boxSaid.set(id, 'It could not be put in this Mac\'s keychain. Try again.')
    await log($, `box ${id} not kept: security ended ${r.exitCode}`)
  } else {
    boxSent.add(id)
    boxSaid.delete(id)
    const one = boxes.find(other => other.id === id)
    boxes = boxes.filter(other => other.id !== id)
    if (one) await noteDone($, { id: `box-${id}`, head: boxHead(one.text), said: "You gave it · it is in this Mac's keychain, and what asked for it goes on now", what: '', isOn: true })
    await log($, `box ${id} sent to the keychain`)
  }
  $.ui.invalidate('ui.render')
}
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string, said = 'You cancelled · nothing was saved, and what asked for it stops without it') => {
  boxDrafts.delete(id)
  boxSent.add(id)
  const one = boxes.find(other => other.id === id)
  boxes = boxes.filter(other => other.id !== id)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  if (one) await noteDone($, { id: `box-${id}`, head: boxHead(one.text), said, what: '' })
  $.ui.invalidate('ui.render')
}

const boxesPart = ($: EngineInterface, ui: Ui) => {
  if (!boxes.length || !('Input' in ui)) return null
  // This chat's own requests first, the first of them with the keys, so a value typed for the notice it told goes to its own box
  const shown = [...boxes.filter(one => one.chat === boxChat), ...boxes.filter(one => one.chat !== boxChat)]
  return shown.map((one, n) => (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      <ui.Text dimColor wrap="wrap">What you type here shows as you type it. It goes only into this Mac's keychain, never into a chat.</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxPresses}`}
          placeholder="Type or paste it here"
          value={boxDrafts.get(one.id) ?? ''}
          submitLabel="send"
          autoFocus={n === 0 ? true : undefined}
          onInput={value => void boxDrafts.set(one.id, value)}
          onSubmit={value => void sendBox($, one.id, value).catch(() => log($, `box ${one.id} not sent`))}
        />
      </ui.Box>
      {boxSaid.get(one.id) ? <ui.Text key={`box-${one.id}-said`} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      <ui.Box flexDirection="row">
        <ui.Button key={`box-${one.id}-cancel-${boxPresses}`} label="Cancel" plain onPress={() => void cancelBox($, one.id)} />
      </ui.Box>
    </ui.Box>
  ))
}
