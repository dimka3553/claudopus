// The hidden boxes of bin/secret and bin/admin, in every chat: on this Mac's own screen and from another Mac over ssh alike

// The runner leaves a request in boxes/: what it needs, never a value. The panel draws it at its top with a field; what is typed
// there goes from the field straight into this Mac's keychain on security's stdin, under the request's id, where the runner takes it
// and removes it. It never reaches the chat, a notice, the saved words, a file or the log. The chat that asked (the request names it)
// takes the request first; any other chat with a screen after BOX_GRACE. Taking it leaves the .told mark, which tells the runner a
// panel asks: with none in its first seconds, nothing on this Mac draws one (a -p run with no chat open) and it falls back to its own
type Asked = { id: string; text: string; at: number; chat?: string }
let boxes: Asked[] = []
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
const BOX_TOLD = (text: string) => `${text} Type it in the box at the top of the Claudopus panel (/claudopus opens it). What is typed there goes only into this Mac's keychain, never into a chat.`
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID
let boxChat = ''
// Requests this chat has told or seen told
const boxTold = new Set<string>()

const lookBoxes = async ($: EngineInterface) => {
  if (!dir) return
  // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
  if (!(await $.session.surfaces().catch(() => [])).length) return
  boxChat ||= await $.session.id().catch(() => '')
  const now = await $.clock.now()
  const found: Asked[] = []
  for (const entry of await $.fs.list(boxesDir()).catch(() => [])) {
    const id = entry.name.replace(/\.json$/, '')
    if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id)) continue
    try {
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Partial<Asked>
      if (one.id === id && typeof one.text === 'string' && typeof one.at === 'number' && now - one.at < BOX_OLD) found.push({ id, text: one.text.slice(0, 600), at: one.at, chat: typeof one.chat === 'string' ? one.chat : undefined })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      else if (typeof one.at === 'number' && now - one.at >= BOX_OLD) await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`]).catch(() => undefined)
    } catch {
      // A request being written is read at the next look
    }
  }
  found.sort((a, b) => a.at - b.at)
  for (const one of found) {
    if (boxTold.has(one.id)) continue
    // Another chat's request waits for that chat a moment
    if (one.chat && boxChat && one.chat !== boxChat && now - one.at < BOX_GRACE) continue
    boxTold.add(one.id)
    // The first chat to make the mark tells it, and brings its panel up with the field ready to type in
    const mark = await $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', `${boxesDir()}/${one.id}.told`]).catch(() => ({ exitCode: 1 }))
    if (mark.exitCode !== 0) continue
    $.ui.log(BOX_TOLD(one.text))
    await $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(err => log($, `panel not opened for a box: ${String(err)}`))
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
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id))
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
    boxes = boxes.filter(one => one.id !== id)
    await log($, `box ${id} sent to the keychain`)
  }
  $.ui.invalidate('ui.render')
}
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string) => {
  boxDrafts.delete(id)
  boxSent.add(id)
  boxes = boxes.filter(one => one.id !== id)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  $.ui.invalidate('ui.render')
}

const boxesPart = ($: EngineInterface, ui: Ui) => {
  if (!boxes.length || !('Input' in ui)) return null
  return boxes.map((one, n) => (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      <ui.Text dimColor wrap="wrap">What you type here shows as you type it, on your screen only. It goes only into this Mac's keychain, never into a chat.</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxPresses}`}
          placeholder="Type or paste it here"
          value={boxDrafts.get(one.id) ?? ''}
          submitLabel="send"
          autoFocus={n === 0}
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
