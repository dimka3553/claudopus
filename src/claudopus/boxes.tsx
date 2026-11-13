// The hidden boxes of bin/secret and bin/admin, in a chat the app runs on another Mac over ssh

// There a box on this Mac's screen is one nobody sees, so the runner leaves a request in boxes/ instead: what it needs, never a
// value. The panel draws it at its top with a field; what is typed there goes from the field straight into this Mac's keychain on
// security's stdin, under the request's id, where the runner takes it and removes it. It never reaches the chat, a notice, the saved
// words, a file or the log. A chat on this Mac's own screen draws none: there the runner shows its own box
type Asked = { id: string; text: string; at: number }
let boxes: Asked[] = []
// What is being typed in each box, only in this code's memory, so a redraw keeps it; gone once it is sent
const boxDrafts = new Map<string, string>()
// A line under a box: what went wrong with what was sent
const boxSaid = new Map<string, string>()
// Sent from here: the box goes at once, before the runner removes its request
const boxSent = new Set<string>()
let boxPresses = 0
const BOX_EVERY = 1000
// A request older than the runner's own wait (900 s) is one whose runner is gone
const BOX_OLD = 16 * 60_000
const BOX_SERVICE = 'claudopus-box'
const BOX_ID = /^[0-9a-f-]{36}$/
const boxesDir = () => `${dir}/boxes`
// In the chat only the name of what is asked, once per box, in whichever chat sees it first
const BOX_TOLD = (text: string) => `${text}\n\nType it in the box at the top of the Claudopus panel. What is typed there goes only into this Mac's keychain, never into this chat.`

const lookBoxes = async ($: EngineInterface) => {
  if (!dir || !isRunFromAfar) return
  const now = await $.clock.now()
  const found: Asked[] = []
  for (const entry of await $.fs.list(boxesDir()).catch(() => [])) {
    const id = entry.name.replace(/\.json$/, '')
    if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id)) continue
    try {
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Partial<Asked>
      if (one.id === id && typeof one.text === 'string' && typeof one.at === 'number' && now - one.at < BOX_OLD) found.push({ id, text: one.text.slice(0, 600), at: one.at })
    } catch {
      // A request being written is read at the next look
    }
  }
  found.sort((a, b) => a.at - b.at)
  for (const one of found) {
    if (boxes.some(b => b.id === one.id)) continue
    // The first chat to make the mark tells it
    const mark = await $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', `${boxesDir()}/${one.id}.told`]).catch(() => ({ exitCode: 1 }))
    if (mark.exitCode === 0) $.ui.log(BOX_TOLD(one.text))
  }
  for (const id of [...boxDrafts.keys(), ...boxSaid.keys()]) if (!found.some(one => one.id === id)) (boxDrafts.delete(id), boxSaid.delete(id))
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  $.ui.invalidate('ui.render')
}

// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  boxDrafts.delete(id)
  if (!value) return
  if (/[\p{Cc}]/u.test(value)) {
    boxSaid.set(id, 'That held a line break or another control character, so it was not sent. Type it again.')
    boxPresses += 1
    return void $.ui.invalidate('ui.render')
  }
  const escaped = value.replace(/[\\"]/g, '\\$&')
  const r = await $.process
    .run(['/usr/bin/security', '-i'], { stdin: `add-generic-password -U -s "${BOX_SERVICE}" -a "${id}" -l "Claudopus box" -w "${escaped}"\n`, timeoutMs: 15_000 })
    .catch(() => ({ exitCode: -1 }))
  boxPresses += 1
  if (r.exitCode !== 0) {
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
  return boxes.map(one => (
    <ui.Box key={`box-${one.id}`} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      <ui.Text dimColor wrap="wrap">What you type here shows as you type it. It goes only into this Mac's keychain, never into the chat.</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input
          key={`box-${one.id}-field-${boxPresses}`}
          placeholder="Type or paste it here"
          value={boxDrafts.get(one.id) ?? ''}
          submitLabel="send"
          autoFocus
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
