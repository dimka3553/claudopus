// The hidden boxes of bin/secret and bin/admin, in every chat: on this Mac's own screen and from another Mac over ssh alike

// The runner leaves a request in boxes/: what it needs, never a value. The panel draws it as a block on its task's card (at its top
// when no task's command asked), and what is typed for it, in the box above the chat, goes straight into this Mac's keychain on
// security's stdin, under the request's id, where the runner takes it
// and removes it. It never reaches the chat, a notice, the saved words, a file or the log. The chat that asked (the request names it)
// takes the request first; any other chat with a screen after BOX_GRACE. Taking it leaves the .told mark, which tells the runner a
// panel asks: with none in its first seconds, nothing on this Mac draws one (a -p run with no chat open) and it falls back to its own
// The box's wording is the panel's own, made from the request's fields: its kind (admin or secret), the Mac (host) or the key's name
// (name), and why it asks again (again). A request carries no text that is shown: one with any field the panel does not know how to
// word (a host on a key, a name on a password), a kind it does not know or a host or name it would not take, is drawn as nothing;
// any other field is left unread. A planted request so shows only what the runners would ask. This stops slips and common tricks;
// it is no wall against code set on getting round it
// agent: the task whose command asked; card: that task's card, where the block is drawn. kind: a password (an admin command's, of
// the Mac `host`) or a key (`name`, none for the box that asks a key's name). text asks in one line, details says where it goes
// isOwn: a task's own question for a key (the ask tool's `key`, kept on its card as keyAsk), drawn as its key's box at once with no
// runner waiting: what is pasted is saved by the panel itself under the key's name, replacing a saved one, and the task is told
type Asked = { id: string; kind: 'password' | 'key'; name?: string; host?: string; text: string; details: string; at: number; chat?: string; command?: string; key?: string; call?: string; agent?: string; card?: string; isOwn?: boolean }
// The Bash calls of this chat that run bin/admin or bin/secret, by call id, with their command: a box is drawn only for a request of
// this chat's own while one of them runs (one sent to the background for BOX_OLD after it began), and says which command asked. A
// request no runner of this chat could have made, however it is worded, is drawn nowhere
const runnerCalls = new Map<string, { command: string; at: number; until: number; agent?: string }>()
const runnerBegun = (id: string, command: string, at: number, agent?: string) => void runnerCalls.set(id, { command, at, until: Infinity, ...(agent ? { agent } : {}) })
const runnerEnded = (id: string, isBackground: boolean, at: number) => {
  const one = runnerCalls.get(id)
  if (!one) return
  if (isBackground) runnerCalls.set(id, { ...one, until: one.at + BOX_OLD })
  else runnerCalls.delete(id)
  for (const [key, other] of [...runnerCalls]) if (other.until < at) runnerCalls.delete(key)
}
// The command that asked: the one of this chat's running runners begun last before the request
const runnerOf = (at: number, now: number) => [...runnerCalls].map(([call, one]) => ({ ...one, call })).filter(one => one.until >= now && one.at <= at + BOX_SKEW).sort((a, b) => b.at - a.at)[0]
// The runner that made a request, for the card its box goes on: of those that could have, the ones whose command names the same
// runner (and, for a key, the same key); only when exactly one does is its task known, else the box is no card's (17 Nov, second
// look: the latest runner was taken, and a box went on another task's card)
// Once known, a box's task is kept by its id, so a runner begun later never takes the box off its card (boxAgents). A runner whose
// command names neither runner reached it through a script, and could have made either kind
const boxAgents = new Map<string, string>()
const runnerFor = (one: Record<string, unknown>, at: number, now: number): { call: string; command: string; agent?: string } | undefined => {
  const runner = runnerOf(at, now)
  if (!runner) return undefined
  const kept = typeof one.id === 'string' ? boxAgents.get(one.id) : undefined
  if (kept) return { call: runner.call, command: runner.command, agent: kept }
  const live = [...runnerCalls].map(([call, other]) => ({ ...other, call })).filter(other => other.until >= now && other.at <= at + BOX_SKEW)
  const isScript = (command: string) => !/\bbin\/(?:admin|secret)\b/.test(command)
  const same = live.filter(other => isScript(other.command) || (one.kind === 'admin' ? /\bbin\/admin\b/.test(other.command) : /\bbin\/secret\b/.test(other.command) && (typeof one.name !== 'string' || other.command.includes(one.name))))
  const [only] = same
  if (same.length === 1 && only) {
    if (only.agent && typeof one.id === 'string') boxAgents.set(one.id, only.agent)
    return only
  }
  return { call: runner.call, command: runner.command }
}
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
  refused: 'That password was wrong. ',
  short: 'That was shorter than 4 characters. ',
  control: 'That had a line break or another special character. ',
}
// The wording for a request, or undefined for one the panel does not draw
const boxWording = (one: Record<string, unknown>): Pick<Asked, 'kind' | 'name' | 'host' | 'text' | 'details'> | undefined => {
  // A reason it does not know is left out
  const again = typeof one.again === 'string' && Object.hasOwn(BOX_AGAIN, one.again) ? BOX_AGAIN[one.again]! : ''
  if (one.kind === 'admin') {
    // A password is sent only sealed to the key the runner made for this one request: a request with none is drawn nowhere
    if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined || typeof one.key !== 'string' || !BOX_KEY.test(one.key)) return undefined
    const mac = one.host === 'here' ? "This Mac's password" : `The password of ${one.host}`
    return { kind: 'password', host: one.host, text: `${again}${mac} is needed to run this as admin.`, details: 'It goes only to this command and is never saved.' }
  }
  if (one.kind === 'secret') {
    if (one.host !== undefined) return undefined
    // No name: the first box of a key saved by hand asks its name
    if (one.name === undefined) return { kind: 'key', text: 'Which name should the key be saved under, such as GITHUB_TOKEN?', details: 'Commands use the key by this name.' }
    if (typeof one.name !== 'string' || !BOX_NAME.test(one.name)) return undefined
    return { kind: 'key', name: one.name, text: `${again}${one.name} is needed to run this task's command.`, details: `It goes only into ${keptWhere()}.` }
  }
  return undefined
}
let boxes: Asked[] = []
// What is typed in a box is kept by the surface alone, never here or drawn back: a drawing that carried it put older letters over
// newer ones. Each try that left the box to be typed again gives its field a new key, so the field starts empty
const boxTries = new Map<string, number>()
// The boxes something is typed in, unsent, so an ask's reply box does not take the keys from them
const boxTyped = new Set<string>()
// What is typed for a box in the box above the chat while it is open, only so its Send button can send it: never written
// anywhere, and gone once it is sent, closed or the box moves
const barKeyTyped = new Map<string, string>()
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
const BOX_TOLD = (one: Pick<Asked, 'kind' | 'text'>) => `${one.text} Press ${one.kind === 'password' ? TYPE_IT : PASTE_IT} on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself${one.kind === 'password' ? '' : ". Or answer in words, such as where it already is"}.`
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
  const cards = await read($, todos)
  for (const entry of entries) {
    // A mark left after its request went (a chat that marked it as the runner ended) goes too
    const marked = entry.name.replace(/\.told$/, '')
    // and a response its runner never took, once that runner has had its moment to take it
    const answered = entry.name.replace(/\.reply$/, '')
    if (entry.name.endsWith('.reply') && BOX_ID.test(answered) && !entries.some(other => other.name === `${answered}.json`) && now - (boxRepliedAt.get(answered) ?? 0) > BOX_REPLY_TAKEN) (boxRepliedAt.delete(answered), await $.process.run(['rm', '-f', `${boxesDir()}/${entry.name}`]).catch(() => undefined))
    if (entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(other => other.name === `${marked}.json`)) await $.process.run(['rm', '-f', `${boxesDir()}/${entry.name}`]).catch(() => undefined)
    const id = entry.name.replace(/\.json$/, '')
    if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id)) continue
    try {
      const one = JSON.parse(await readOr($, `${boxesDir()}/${entry.name}`)) as Record<string, unknown>
      const words = one && typeof one === 'object' ? boxWording(one) : undefined
      // Only this chat's own request, dated no later than now, while a runner of this chat's that could have made it runs
      const runner = typeof one.at === 'number' ? runnerFor(one, one.at, now) : undefined
      const key = typeof one.key === 'string' ? one.key : undefined
      if (key && !boxKeys.has(id)) boxKeys.set(id, key)
      const isKeySame = !key || boxKeys.get(id) === key
      // (on the card of the task whose command asked, while this chat keeps one for it)
      const card = runner?.agent ? cards.find(other => other.id === topOf(cards, runner.agent ?? ''))?.id : undefined
      if (one.id === id && words && isKeySame && typeof one.at === 'number' && now - one.at < BOX_OLD && one.at - now <= BOX_SKEW && one.chat === boxChat && boxChat && runner) found.push({ id, ...words, at: one.at, chat: one.chat, command: runner.command, call: runner.call, ...(runner.agent ? { agent: runner.agent } : {}), ...(card ? { card } : {}), ...(one.kind === 'admin' && key ? { key } : {}) })
      // A runner killed outright leaves its request: it goes once it is stale, with its mark
      // and a value typed into it meanwhile leaves the keychain with it
      else if (typeof one.at === 'number' && (now - one.at >= BOX_OLD || one.at - now > BOX_SKEW)) {
        await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`, `${boxesDir()}/${id}.told`, `${boxesDir()}/${id}.reply`]).catch(() => undefined)
        await boxKeyring($, 'delete', id)
      }
    } catch {
      // A request being written is read at the next look
    }
  }
  // Each task's own question for a key, on its card, while it is not answered
  for (const card of cards) for (const ask of keyAsksOf(card)) {
    const id = ownBoxId(card.id, ask.at)
    if (!card.chat && !boxSent.has(id)) found.push({ id, kind: 'key', name: ask.name, text: ask.text, details: ask.details, at: ask.at, chat: boxChat, agent: ask.from, card: card.id, isOwn: true })
  }
  found.sort((a, b) => a.at - b.at)
  for (const one of found) {
    if (boxTold.has(one.id)) continue
    // Another chat's request waits for that chat a moment (and every request does, in a chat that cannot read its own id)
    if (one.chat !== undefined && one.chat !== boxChat && now - one.at < BOX_GRACE) continue
    boxTold.add(one.id)
    // The first chat to make the mark brings its panel up with the field ready to type in (focus is given only over an empty
    // prompt), and tells it. A panel that cannot be drawn here gives the mark back, so another chat or the runner's own box asks
    // (a task's own question for a key has no runner to tell, and its card is this chat's alone)
    const mark = one.isOwn ? { exitCode: 0 } : await $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', `${boxesDir()}/${one.id}.told`]).catch(() => ({ exitCode: 1 }))
    if (mark.exitCode !== 0) continue
    const opened = await $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(err => (log($, `panel not opened for a box: ${String(err)}`), undefined))
    if (!opened?.isPlaced) {
      if (!one.isOwn) await $.process.run(['rm', '-f', `${boxesDir()}/${one.id}.told`]).catch(() => undefined)
      await log($, `box ${one.id} given back: the panel is not drawn here${opened && !opened.isPlaced ? ` (${opened.reason})` : ''}`)
      continue
    }
    $.ui.log(BOX_TOLD(one))
  }
  for (const id of boxTold) if (!found.some(one => one.id === id)) boxTold.delete(id)
  for (const id of boxKeys.keys()) if (!entries.some(entry => entry.name === `${id}.json`)) boxKeys.delete(id)
  for (const id of [...boxTries.keys(), ...boxSaid.keys(), ...boxTyped, ...boxModes.keys(), ...boxHeldReply.keys()]) if (!found.some(one => one.id === id)) (boxTries.delete(id), boxSaid.delete(id), boxTyped.delete(id), barKeyTyped.delete(id), boxModes.delete(id), boxHeldReply.delete(id))
  if (barOpen && isBoxKind(barOpen.kind) && !found.some(one => one.id === barOpen?.id)) closeBarOf(barOpen.id)
  if (JSON.stringify(found) === JSON.stringify(boxes)) return
  boxes = found
  drawAgain($)
}

// A box's entry in the keychain: on Linux bin/keyring, which keeps it in a file only this user reads; on a Mac security itself,
// which sendBox calls as before for set and has, so only delete goes through here
const boxKeyring = async ($: EngineInterface, what: 'set' | 'has' | 'delete', id: string, stdin?: string) =>
  !(await hasKeychain($))
    ? { exitCode: -1 }
    : isLinux
    ? $.process.run([`${$.plugin.root}/bin/keyring`, what, BOX_SERVICE, id, ...(what === 'set' ? ['Claudopus box'] : [])], { stdin, timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
    : what === 'delete'
      ? $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
      : Promise.resolve({ exitCode: -1 })
// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
const sendBox = async ($: EngineInterface, id: string, value: string) => {
  if (!value) return
  const refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? `That's longer than ${BOX_LONGEST} characters, so it wasn't sent.` : /[^\x20-\x7E]/.test(value) ? "That has a line break, a curly quote or another special character, so it wasn't sent. Type it again." : ''
  if (refused) {
    boxSaid.set(id, refused)
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const own = boxes.find(other => other.id === id && other.isOwn)
  if (own) return void (await keepOwnKey($, own, value))
  const request = `${boxesDir()}/${id}.json`
  // A runner that has stopped, or a box answered in another chat, takes nothing: its value would stay in the keychain
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id, 'the command had stopped waiting, so nothing was saved'))
  // An admin password goes only sealed to its runner's key: what sits in the keychain a moment is of no use to anything else
  const asked = boxes.find(other => other.id === id)
  const sent = asked?.key ? await sealedFor($, asked.key, value) : value
  if (!sent) {
    boxSaid.set(id, "It couldn't be encrypted for the command that asked, so it wasn't sent.")
    boxPresses += 1
    boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
    return void drawAgain($)
  }
  const escaped = sent.replace(/[\\"]/g, '\\$&')
  const r = !(await hasKeychain($))
    ? { exitCode: -1 }
    : isLinux
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
    boxSaid.set(id, `It couldn't be saved in ${keptWhere()}. Try again.`)
    await log($, `box ${id} not kept: security ended ${r.exitCode}`)
  } else {
    boxSent.add(id)
    boxSaid.delete(id)
    boxHeldReply.delete(id)
    closeBarOf(id)
    const one = boxes.find(other => other.id === id)
    boxes = boxes.filter(other => other.id !== id)
    if (one) pressedLine($, one.card ?? '', '', '', one.kind === 'password' ? 'You gave the password' : one.name ? `You gave ${one.name}` : 'You named the key')
    await log($, `box ${id} sent to the keychain`)
  }
  drawAgain($)
}
// The box of a task's own question for a key
const ownBoxId = (card: string, at: number) => `key-${card}-${at}`
// A key pasted in a task's own box: saved under its name as the secret runner keeps one (bin/keyring, replacing a saved one), and
// the task told it can run its command now
const SHORTEST_KEY = 4
const keepOwnKey = async ($: EngineInterface, one: Asked, value: string) => {
  const id = one.id
  const name = one.name ?? ''
  boxPresses += 1
  boxTries.set(id, (boxTries.get(id) ?? 0) + 1)
  if (value.length < SHORTEST_KEY) return void (boxSaid.set(id, `That was shorter than ${SHORTEST_KEY} characters. Paste the whole key.`), drawAgain($))
  const r = await $.process.run([`${$.plugin.root}/bin/keyring`, 'set', 'claudopus-secret', name, `Claudopus: ${name}`], { stdin: `${value}\n`, timeoutMs: 15_000 }).catch(() => ({ exitCode: -1 }))
  if (r.exitCode !== 0) {
    boxSaid.set(id, `It couldn't be saved in ${keptWhere()}. Try again.`)
    await log($, `key ${name} not kept from its box: the keychain ended ${r.exitCode}`)
    return void drawAgain($)
  }
  boxSent.add(id)
  boxSaid.delete(id)
  boxHeldReply.delete(id)
  closeBarOf(id)
  boxes = boxes.filter(other => other.id !== id)
  pressedLine($, one.card ?? '', '', '', `You gave ${name}`)
  drawAgain($)
  await log($, `key ${name} saved from the box on ${one.card}`)
  await refreshKeys($).catch(err => log($, `keys not made again: ${String(err)}`))
  await ownKeyDone($, one, named(KEY_GIVEN($.plugin.root, name)), `You gave ${name}`)
}
// A task's own key question answered: gone from its card, and its task told what was done
const ownKeyDone = async ($: EngineInterface, one: Asked, text: string, label: string) => {
  const card = one.card ?? ''
  await changeTodos($, list => list.map(other => (other.id === card && keyAsksOf(other).some(ask => ownBoxId(card, ask.at) === one.id) ? withKeyAsks(other, keyAsksOf(other).filter(ask => ownBoxId(card, ask.at) !== one.id)) : other)))
  await toTask($, card, one.agent ?? card, text, label, one.text).catch(err => log($, `task not told of its key: ${String(err)}`))
}
const KEY_GIVEN = (root: string, name: string) => `{Name} pasted ${name} in its box on your card, and it is saved in Claudopus's keychain. Use it now through \`${root}/bin/secret ${name} here '<command using $${name}>'\`.`
const KEY_NOT_GIVEN = (name: string) => `{Name} pressed Don't give it on your question for ${name}, so it was not given.`
const KEY_ANSWERED = (name: string, said: string) => `{Name} answered your question for ${name} in their own words instead of giving it: ${said}`
// Don't allow, or Don't give it: the request goes, and the runner, finding it gone, ends as when a box is cancelled
const cancelBox = async ($: EngineInterface, id: string, said = '') => {
  boxSent.add(id)
  barKeyTyped.delete(id)
  const one = boxes.find(other => other.id === id)
  if (one?.isOwn) {
    boxes = boxes.filter(other => other.id !== id)
    closeBarOf(id)
    boxHeldReply.delete(id)
    pressedLine($, one.card ?? '', DONT_GIVE, said)
    drawAgain($)
    return void (await ownKeyDone($, one, named(KEY_NOT_GIVEN(one.name ?? '')), DONT_GIVE))
  }
  boxes = boxes.filter(other => other.id !== id)
  closeBarOf(id)
  boxHeldReply.delete(id)
  // The block goes in the press's own drawing, before its request is removed, and one grey line says what was pressed
  if (one) pressedLine($, one.card ?? '', one.kind === 'password' ? DONT_ALLOW : DONT_GIVE, said)
  drawAgain($)
  await $.process.run(['rm', '-f', `${boxesDir()}/${id}.json`]).catch(() => undefined)
  drawAgain($)
}

// Where a box is typed in: the one box above the chat (band.tsx), opened by the block's Type it, Paste it or Answer in words. Only
// where that bar draws no field (the terminal, a folded bar) does the block keep one field of its own, which Answer in words turns
// from the key to words and back (boxModes).
// Words in place of a key, such as where the key already is, go to the command that asked, which prints them and ends without the
// key (bin/secret, exit 4), so the task that ran it reads them as the command's result
type BoxMode = 'key' | 'reply'
// The mode of a box drawn with its own field, where it differs from the key
const boxModes = new Map<string, BoxMode>()
// A response that looked like a key itself, held a moment so the person decides: sent anyway, kept as the key, or neither
const boxHeldReply = new Map<string, string>()
// When a response was left for its runner, which takes it within a second or two: until BOX_REPLY_TAKEN after, it is never removed
const boxRepliedAt = new Map<string, number>()
const BOX_REPLY_TAKEN = 60_000
// The name a key box asks for, none for the box that asks a key's name
const boxNameOf = (one: Asked) => one.name
const isNameBox = (one: Asked) => one.kind === 'key' && !one.name
// The words of a response that look like a key rather than about one: a word that starts as the distinctive keys and tokens do, a
// short prefix (sk-, npm_) with digits after it, a key shaped as a UUID, a password inside an address, or a long run of letters and
// digits that is no path, address or hyphenated name. Ordinary words, paths and names of settings pass
const KEY_DISTINCT = /^(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_|glpat-|xox[abprs]-|AKIA|ASIA|AIza|ya29\.|eyJ)[A-Za-z0-9_.-]{10,}/
const KEY_SHORT = /^(?:sk|pk|rk|hf|npm|vck)[-_](?=(?:[^\d]*\d){2})[A-Za-z0-9_-]{12,}$/
const KEY_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const KEY_IN_ADDRESS = /^[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s@]+@/i
const keyWords = (text: string) =>
  text
    .split(/\s+/)
    .map(word => word.replace(/^["'`(<]+|["'`)>.,;:!?]+$/g, ''))
    .filter(bare => {
      if (KEY_DISTINCT.test(bare) || KEY_SHORT.test(bare) || KEY_UUID.test(bare) || KEY_IN_ADDRESS.test(bare)) return true
      if (bare.length < 20 || /^(?:\/|~|\.\.?\/)/.test(bare) || /\.[A-Za-z]{1,8}$/.test(bare) || /:\/\/|@/.test(bare) || /^[a-z0-9]+(?:[-_][a-z0-9]+){2,}$/i.test(bare)) return false
      return (/[A-Za-z]/.test(bare) && (bare.match(/\d/g)?.length ?? 0) >= 3) || (bare.length >= 32 && /[a-z]/.test(bare) && /[A-Z]/.test(bare))
    })
const looksLikeKey = (text: string) => keyWords(text).length > 0
const BOX_LOOKS_KEY = (where: string) => `That looks like the key itself. An answer in words is read by the task that asked. Save it as the key to keep it only in ${where}, or send it as an answer anyway.`
// The kinds of the box above the chat that are a password or key box's (asking.tsx, barOpen)
const isBoxKind = (kind: BarKind) => kind === 'key' || kind === 'words' || kind === 'password'
// The box above the chat as a password or key block opens it: for the key or password itself, or for words in place of a key
const barKindOf = (one: Asked, mode: BoxMode): BarKind => (one.kind === 'password' ? 'password' : mode === 'reply' ? 'words' : 'key')
// The person's words in place of the key: left beside the request for its runner, which finds the request gone, prints them and
// ends without the key. Nothing goes to the keychain. Words that look like the key itself are held until the person says which
const sendBoxReply = async ($: EngineInterface, id: string, text: string, isSure = false) => {
  const said = text.trim()
  const one = boxes.find(other => other.id === id)
  if (!said || !one) return
  if (!isSure && looksLikeKey(said)) {
    boxHeldReply.set(id, said)
    boxSaid.set(id, BOX_LOOKS_KEY(keptWhere()))
    boxPresses += 1
    return void drawAgain($)
  }
  boxHeldReply.delete(id)
  if (one.isOwn) {
    boxSent.add(id)
    boxSaid.delete(id)
    boxes = boxes.filter(other => other.id !== id)
    closeBarOf(id)
    pressedLine($, one.card ?? '', '', '', `You answered “${cut(oneLine(said), 60)}”`)
    drawAgain($)
    return void (await ownKeyDone($, one, named(KEY_ANSWERED(one.name ?? '', said)), `You answered “${cut(oneLine(said), 60)}”`))
  }
  const request = `${boxesDir()}/${id}.json`
  if (!(await $.fs.exists(request).catch(() => false))) return void (await cancelBox($, id, "the command had stopped waiting, so your answer wasn't sent"))
  const name = boxNameOf(one)
  const asked = name ? `giving ${name}` : isNameBox(one) ? 'naming a key to save' : 'giving the key'
  const isWritten = await $.fs
    .write(`${boxesDir()}/${id}.reply`, `${who(true)} answered in the Claudopus panel instead of ${asked}, in their own words: ${said}\n`)
    .then(() => true)
    .catch(() => false)
  if (isWritten) boxRepliedAt.set(id, await $.clock.now())
  if (!isWritten) {
    boxSaid.set(id, "Your answer couldn't be passed to the command that asked. Try again.")
    boxPresses += 1
    return void drawAgain($)
  }
  boxSent.add(id)
  boxSaid.delete(id)
  boxes = boxes.filter(other => other.id !== id)
  closeBarOf(id)
  pressedLine($, one.card ?? '', '', '', `You answered “${cut(oneLine(said), 60)}”`)
  drawAgain($)
  await $.process.run(['rm', '-f', request]).catch(() => undefined)
  await log($, `box ${id} answered in words`)
}
// What is typed in a key's field goes by its mode: the key to the keychain, a response to the command that asked
const submitBox = ($: EngineInterface, id: string, mode: BoxMode, value: string) => {
  boxTyped.delete(id)
  barKeyTyped.delete(id)
  freeTimes($)
  barBoxAt = 0
  const run = mode === 'reply' ? sendBoxReply($, id, value) : sendBox($, id, value)
  void run.catch(() => log($, `box ${id} not sent`))
}
// The word of a held response that looked like the key goes to the keychain, never the words around it; with more than one such
// word nobody can tell which is the key, so the key's field opens for it to be pasted alone
const keepHeldAsKey = ($: EngineInterface, id: string, surface: string) => {
  const words = keyWords(boxHeldReply.get(id) ?? '')
  boxHeldReply.delete(id)
  if (words.length === 1) return void sendBox($, id, words[0] ?? '').catch(() => log($, `box ${id} not sent`))
  if (repliesInBar(surface)) openBar($, { kind: 'key', id }, surface)
  else (boxModes.set(id, 'key'), (boxPresses += 1))
  boxSaid.set(id, 'More than one word looks like a key. Paste only the key.')
  drawAgain($)
}
// Under a response held for looking like a key: keep it as the key, or send it as words anyway
const heldReplyButtons = ($: EngineInterface, ui: Ui, id: string, where: string) =>
  boxHeldReply.has(id) ? (
    <ui.Box key={`${where}-${id}-held`} flexDirection="row" gap={1} flexWrap="wrap">
      <ui.Button key={`${where}-${id}-askey-${boxPresses}`} label="Save as the key" onPress={press => keepHeldAsKey($, id, press.surface)} />
      <ui.Button key={`${where}-${id}-anyway-${boxPresses}`} label="Send as answer" plain onPress={() => void sendBoxReply($, id, boxHeldReply.get(id) ?? '', true)} />
    </ui.Box>
  ) : null
