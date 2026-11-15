// The keys remembered: which keys, tokens and logins the person has given, and where each is kept, by name only, never a value.
// It is made again from each store's own list of names (Claudopus's keychain, the rest of this Mac's keychain, the .env files in each
// subject's folder) and from what SBOS last said it holds, so a key taken out of a store stops being listed. Work reads it in
// keys.md in the memory folder, the Keys button shows it, and work that asks for a key it lists is told where that key is

const KEYS_FILE = 'keys.md'
const KEYS_STATE = 'keys.json'
// How long the local stores' names are trusted before they are read again, for an ask checked against them
const KEYS_MS = 60_000
type KeyStore = 'claudopus' | 'keychain' | 'sbos' | 'env'
// An SBOS secret is a key, a database (used through its `query`) or a login
type SbosKind = 'database' | 'login'
type KeyEntry = { name: string; store: KeyStore; where?: string; label?: string; kind?: SbosKind; isPresent: boolean; added: number; seen: number }
type SbosName = { name: string; label?: string; kind?: SbosKind; isPresent: boolean }
type KeysState = { at: number; sbosAt?: number; entries: KeyEntry[] }
const STORE_NAMES: Record<KeyStore, string> = {
  claudopus: "Claudopus's keychain",
  keychain: "this Mac's keychain",
  sbos: 'SBOS secrets',
  env: 'a .env file',
}
// A name as it is kept: plain marks only, and short, so no text that is not a name can pass for one
const plainName = (text: string) => (/^[\w .:@/+|-]{1,80}$/.test(text) ? text : '')
// The words a key's name is made of, less those every key's name has: ELEVENLABS_API_KEY and elevenlabs-key are both "elevenlabs"
const KEY_WORDS = new Set(['api', 'key', 'keys', 'token', 'tokens', 'secret', 'secrets', 'access', 'password', 'passwd', 'pat', 'auth', 'the'])
const coreOf = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word && !KEY_WORDS.has(word))
const sameKey = (a: string, b: string) => {
  const x = coreOf(a)
  const y = coreOf(b)
  return x.length > 0 && x.length === y.length && x.every(word => y.includes(word))
}
// A keychain entry that is a key someone gave by hand, not an app's own storage: its service names an API, a token or a key, or its
// account is a name such as ELEVENLABS_API_KEY. The mod's own services are read as Claudopus's keychain or not at all
const isKeyEntry = (service: string, account: string) =>
  !service.startsWith('claudopus') &&
  !/safe storage|^com\.apple\.|^apple/i.test(service) &&
  ((/(?:^|[-_ .])(?:api|token|key)s?(?:$|[-_ .])/i.test(service)) || /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/.test(account))
// A variable in a .env file that holds a key, by its name
// (one a web page shows anyway, NEXT_PUBLIC_… or a publishable key, is none)
const isKeyVariable = (name: string) => /(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|_PAT|CREDENTIALS?)(?:_|$)/.test(name) && !/^NEXT_PUBLIC_|PUBLISHABLE/.test(name)
const ENV_NAME = /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/

let keys: KeysState = { at: 0, entries: [] }
const keysRead = async ($: EngineInterface): Promise<KeysState> => {
  try {
    const kept = JSON.parse((await readOr($, `${dir}/${KEYS_STATE}`)) || '{}') as Partial<KeysState>
    return { at: Number(kept.at) || 0, sbosAt: kept.sbosAt, entries: Array.isArray(kept.entries) ? kept.entries : [] }
  } catch {
    return { at: 0, entries: [] }
  }
}

// The names each local store lists now; undefined for a store that could not be read, so what was known of it stays. Claudopus's
// keychain is read from the same listing as the rest, which fails as a whole when the keychain does not answer, so a locked keychain
// never reads as an empty one
const localNames = async ($: EngineInterface) => {
  const all = await $.process.run([`${$.plugin.root}/bin/keyring`, 'entries']).catch(() => undefined)
  const pairs = all?.exitCode === 0 && !all.isStdoutTruncated ? all.stdout.split('\n').filter(Boolean).map(line => line.split('\t')) : undefined
  const claudopus = pairs?.filter(([service]) => service === 'claudopus-secret').map(([, account = '']) => plainName(account)).filter(Boolean)
  // Another app's account is shown only when it is a name such as ELEVENLABS_API_KEY: any other account (an email, an id, a token
  // pasted there by mistake) stays out of the list
  const keychain = pairs
    ?.filter(([service = '', account = '']) => isKeyEntry(service, account))
    .map(([service = '', account = '']) => ({ name: plainName(ENV_NAME.test(account) ? account : service), where: plainName(ENV_NAME.test(account) ? `${service} / ${account}` : service) }))
    .filter(one => one.name && one.where)
  // The top of each subject's folder: its .env files (plain files only), read for the names before each = and nothing after it
  const env: { name: string; where: string }[] = []
  const folders = [...new Set((await readIndex($).catch(() => [] as Stream[])).map(one => one.repo).filter(one => one.startsWith('/')))]
  for (const folder of folders) {
    const files = (await $.fs.list(folder).catch(() => [])).filter(one => one.kind === 'file' && !one.isLink).map(one => one.name).filter(name => /^\.env(?:\.[\w-]+)?$/.test(name) && !/\.(?:example|sample|template|dist)$/.test(name))
    for (const file of files) {
      const r = await $.process.run(['/usr/bin/grep', '-ohE', '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=', `${folder}/${file}`]).catch(() => undefined)
      for (const line of (r?.stdout ?? '').split('\n')) {
        const name = line.replace(/^\s*(?:export\s+)?/, '').replace(/\s*=$/, '')
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && isKeyVariable(name)) env.push({ name, where: `${folder}/${file}` })
      }
    }
  }
  return { claudopus, keychain, env }
}

// The list made again: each local store as it lists its names now, SBOS as it last said; what a store no longer lists goes
const refreshKeys = async ($: EngineInterface, sbos?: SbosName[], isListed = true) => {
  if (!dir) return keys
  const now = await $.clock.now()
  const before = await keysRead($)
  const { claudopus, keychain, env } = await localNames($)
  const old = (store: KeyStore, name: string, where?: string) => before.entries.find(one => one.store === store && one.name === name && one.where === where)
  const made = (store: KeyStore, name: string, extra: Partial<KeyEntry> = {}): KeyEntry => ({ name, store, ...extra, isPresent: extra.isPresent ?? true, added: old(store, name, extra.where)?.added ?? now, seen: extra.isPresent === false ? (old(store, name, extra.where)?.seen ?? 0) : now })
  const kept = (store: KeyStore, fresh: KeyEntry[] | undefined) => fresh ?? before.entries.filter(one => one.store === store)
  const entries = [
    ...kept('claudopus', claudopus?.map(name => made('claudopus', name))),
    ...kept('keychain', keychain?.map(one => made('keychain', one.name, { where: one.where }))),
    ...env.map(one => made('env', one.name, { where: one.where })),
    ...kept('sbos', sbos?.map(one => made('sbos', one.name, { label: one.label, kind: one.kind, isPresent: one.isPresent }))),
  ]
  // Every kept value is hidden in the names and labels as they came, before anything is cut or changed, so no part of one can be
  // left; the text is made from what was hidden, and nothing is written when it could not be checked
  const state = await keysHidden($, `${JSON.stringify({ at: now, sbosAt: sbos && isListed ? now : before.sbosAt, entries }, null, 2)}\n`)
  let hidden: KeysState | undefined
  try {
    hidden = state === undefined ? undefined : (JSON.parse(state) as KeysState)
  } catch {}
  if (state === undefined || !hidden || !Array.isArray(hidden.entries)) return (await log($, 'the list of keys was not written: it could not be checked for kept values'), keys)
  keys = hidden
  await $.fs.write(`${dir}/${KEYS_STATE}`, state)
  await $.fs.write(`${dir}/${KEYS_FILE}`, keysText($.plugin.root, keys))
  return keys
}
// The text with every kept value hidden, as bin/secret hides a command's output; undefined when it could not be checked
const keysHidden = async ($: EngineInterface, text: string) => {
  const r = await $.process.run([`${$.plugin.root}/bin/secret`, '--hide'], { stdin: text }).catch(() => undefined)
  return r && r.exitCode === 0 && !r.isStdoutTruncated && r.stdout.trim() ? r.stdout : undefined
}
const keysFresh = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (!keys.at) keys = await keysRead($)
  return now - keys.at < KEYS_MS ? keys : refreshKeys($)
}

const dayOf = (at: number) => (at ? new Date(at).toISOString().slice(0, 10) : '')
// How work uses a key, by its store's own route; the value never passes through the work
const routeOf = (root: string, one: KeyEntry) =>
  one.store === 'claudopus'
    ? `\`${root}/bin/secret ${one.name} here '<command using $${one.name}>'\``
    : one.store === 'sbos' && one.kind === 'database'
      ? `SBOS's \`query\` and \`tables\` with db ${one.name}`
      : one.store === 'sbos' && one.kind === 'login'
        ? 'a login kept in SBOS: its page there says how it is used'
    : one.store === 'sbos'
      ? one.isPresent
        ? `SBOS by its name: \`send_with_secret\` with {{secret:${one.name}}}, or \`secret_link\` for a command`
        : `asked in SBOS but never put in: ask for it in the secret runner instead`
      : one.store === 'keychain'
        ? `kept by another app (${one.where}): work cannot use it; {name} can paste it into Claudopus's keychain once`
        : `in ${one.where}, which that project's own scripts load`
const keysText = (root: string, state: KeysState) => {
  const rows = [...state.entries]
    .sort((a, b) => Number(b.isPresent) - Number(a.isPresent) || a.store.localeCompare(b.store) || a.name.localeCompare(b.name))
    .map(one => `| ${one.name} | ${one.label ? oneLine(one.label).replace(/\|/g, '/').slice(0, 80) : ''} | ${STORE_NAMES[one.store]} | ${one.isPresent ? 'present' : 'asked, not given'} | ${dayOf(one.added)} | ${dayOf(one.seen)} | ${named(routeOf(root, one)).replace(/\|/g, '/')} |`)
  return [
    '# Keys',
    '',
    `The keys, tokens and logins ${who()} has given, by name and where each is kept: never a value. Made again from each store's own list of names on ${dayOf(state.at)}; SBOS's as it last listed them${state.sbosAt ? ` on ${dayOf(state.sbosAt)}` : ' (not yet listed: call its `secrets`)'}. A key taken out of a store goes from here.`,
    '',
    '| Name | For | Store | State | Added | Last seen | How work uses it |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n')
}

// SBOS's answer to `secrets`: its list of names, whose state says whether each was put in. Only the names, what each is for and that
// state are taken; anything else in it is left
const sbosListed = (result: unknown) => {
  const texts: string[] = []
  const walk = (x: unknown) => (typeof x === 'string' ? texts.push(x) : Array.isArray(x) ? x.forEach(walk) : x && typeof x === 'object' ? Object.values(x).forEach(walk) : undefined)
  walk(result)
  for (const text of texts) {
    try {
      const list = JSON.parse(text) as unknown
      if (!Array.isArray(list)) continue
      return list
        .filter((one): one is { name: string; label?: unknown; put_in?: unknown; database?: unknown; login?: unknown } => Boolean(one) && typeof one === 'object' && typeof (one as { name?: unknown }).name === 'string')
        // the label as it came, uncut: it is cut only once every kept value in it is hidden
        .map((one): SbosName => ({ name: plainName(one.name), label: typeof one.label === 'string' ? one.label.slice(0, 2000) : undefined, ...(one.database === true ? { kind: 'database' as const } : one.login ? { kind: 'login' as const } : {}), isPresent: one.put_in === true }))
        .filter(one => one.name)
    } catch {}
  }
  return undefined
}

// The key an ask is for, when the list says it is kept where work can use it: what the ask is told back, or ''
// A database in SBOS is no key anyone pastes, so it is never what an ask is for
const usable = (one: KeyEntry) => one.isPresent && one.kind !== 'database' && (one.store === 'claudopus' || one.store === 'sbos')
const KEY_KEPT = (root: string, one: KeyEntry, asked: string, again: string) =>
  named(
    `Not asked: {name} gave this key already. ${asked === one.name ? one.name : `"${asked}" is ${one.name}`}, kept in ${STORE_NAMES[one.store]}${one.seen ? ` and last seen there ${dayOf(one.seen)}` : ''}. Use it through ${routeOf(root, one)}. ${again} The list of keys is ${dir}/${KEYS_FILE}.`,
  )
// Asked again on purpose: the ask names the kept key exactly, as it is written, and says why it does not do
const AGAIN_IN = (one: KeyEntry, field: string) => `If it no longer works, ask again with its name, ${one.name}, written as it is here, and why it does not do, in \`${field}\`.`
const AGAIN_FORGET = (root: string, one: KeyEntry) => `If it no longer works, take it out first with \`${root}/bin/secret ${one.name} --forget\`; the next run asks for it.`
// A name written whole in a text, as it is: not inside another word
const namesWhole = (text: string, name: string) => new RegExp(`(?:^|[^A-Za-z0-9_-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^A-Za-z0-9_-])`).test(text)
// The kept key a text asks for: its whole name in it, in any case and with any dashes, or every word of its name there as whole words.
// The key whose name has the most words found wins, so "the Kaggle username" is KAGGLE_USERNAME, not KAGGLE_KEY
const askedIn = (text: string, listed: KeyEntry[]) => {
  const flat = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `
  const words = new Set(flat.split(' ').filter(Boolean))
  return listed
    .map(one => ({ one, core: coreOf(one.name), whole: flat.includes(` ${one.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `) }))
    .filter(({ core, whole }) => whole || (core.length > 0 && core.every(word => words.has(word))))
    .sort((a, b) => b.core.length - a.core.length)[0]?.one
}
// The secret runner's calls in a text, by any path to it (bin/secret, ./secret from its folder, a doubled slash), each with the names
// it takes and what it does with them
const SECRET_RUNS = /(?:^|[\s/;&|('"=`])secret['"]?\s+['"]?([A-Za-z_][A-Za-z0-9_,]*)['"]?\s+['"]?(--add|[^\s'"-][^\s'"]*)/g
const keyAsked = async ($: EngineInterface, e: { tool: string }): Promise<string> => {
  if (!dir) return ''
  const input = e as { command?: unknown; name?: unknown; text?: unknown; copy?: unknown; details?: unknown; for?: unknown; agent?: unknown }
  const root = $.plugin.root
  const listed = async () => (await keysFresh($)).entries.filter(usable)
  if (e.tool === 'mcp__sbos__ask_secret') {
    // One asked for an autonomous agent of SBOS's is its own: the list holds the person's
    if (typeof input.agent === 'string' && input.agent) return ''
    const name = String(input.name ?? '')
    const one = (await listed()).find(entry => entry.name === name || sameKey(entry.name, name))
    return one && !namesWhole(String(input.for ?? ''), one.name) ? KEY_KEPT(root, one, name, AGAIN_IN(one, 'for')) : ''
  }
  if (e.tool === `${TOOLS}ask`) {
    // What the ask tells the person to do (a word for a key, and a kept key's name or every word of it), or, when it asks them to
    // paste or type something, what it is about
    const said = `${String(input.text ?? '')} ${String(input.copy ?? '')}`
    const about = String(input.details ?? '')
    if (!/\b(?:key|token|password|secret|credentials?|login)s?\b/i.test(said) && !/[A-Z0-9]_[A-Z0-9]/.test(said)) return ''
    const fresh = await listed()
    const one = askedIn(said, fresh) ?? (/\b(?:paste|type|enter|give|send|add|put)\b/i.test(said) ? askedIn(about, fresh) : undefined)
    return one && !namesWhole(about, one.name) ? KEY_KEPT(root, one, one.name, AGAIN_IN(one, 'details')) : ''
  }
  if (e.tool !== 'Bash') return ''
  // The secret runner asked for a key under a name Claudopus's keychain does not keep while it keeps the same key under another, or
  // asked to take a kept one in again: in the command, read as written and unquoted, and in each script it runs
  const command = String(input.command ?? '')
  const texts = [command, unquoted(command), ...(await scriptsRun($, command))]
  // A command that runs no secret runner leaves the stores unread
  if (!texts.some(text => [...text.matchAll(SECRET_RUNS)].length)) return ''
  const mine = (await listed()).filter(entry => entry.store === 'claudopus')
  for (const text of texts) {
    for (const run of text.matchAll(SECRET_RUNS)) {
      for (const name of (run[1] ?? '').split(',').filter(Boolean)) {
        const kept = mine.find(entry => entry.name === name)
        if (kept && run[2] === '--add') return KEY_KEPT(root, kept, name, AGAIN_FORGET(root, kept))
        if (kept) continue
        const one = mine.find(entry => sameKey(entry.name, name))
        if (one) return KEY_KEPT(root, one, name, AGAIN_FORGET(root, one))
      }
    }
  }
  return ''
}

const openKeys = ($: EngineInterface) => {
  presses += 1
  void refreshKeys($)
    .then(() => openMemory($, `${dir}/${KEYS_FILE}`))
    .catch(err => log($, `keys not opened: ${String(err)}`))
}
const keysButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="keys-button" flexShrink={0}>
    <ui.Button key={`keys-open-${presses}`} label="Keys" hotkey={isKeyed ? 'k' : undefined} plain={isKeyed ? true : undefined} onPress={() => openKeys($)} />
  </ui.Box>
)

// What a call changed in a store: a key given or forgotten through the secret runner, or SBOS's list of names, makes the list again.
// Run as each call ends, by the work's own hook on every call
const keysLearn = async ($: EngineInterface, e: { tool: string }, r: { deny?: unknown; isError?: unknown; result?: unknown }) => {
  if (!dir || r.deny) return
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  const isOwnAgent = !(e as { agent?: unknown }).agent
  if (e.tool === 'mcp__sbos__secrets' && isOwnAgent && !r.isError) {
    const listed = sbosListed(r.result)
    if (listed) await refreshKeys($, listed)
  } else if (/^mcp__sbos__(?:ask_secret|forget_secret)$/.test(e.tool) && isOwnAgent && !r.isError) {
    // An ask leaves a name not put in yet, and a forget takes it out, until SBOS's next list
    const name = plainName(String((e as { name?: unknown }).name ?? ''))
    const label = (e as { label?: unknown }).label
    const all = (await keysRead($)).entries.filter(one => one.store === 'sbos')
    const was = all.find(one => one.name === name)
    const sbos: SbosName[] = all.filter(one => one.name !== name).map(one => ({ name: one.name, label: one.label, kind: one.kind, isPresent: one.isPresent }))
    // one SBOS already holds stays as it is
    if (e.tool.endsWith('ask_secret') && name) sbos.push(was ? { name, label: was.label, kind: was.kind, isPresent: was.isPresent } : { name, label: typeof label === 'string' ? label.slice(0, 2000) : undefined, isPresent: false })
    await refreshKeys($, sbos, false)
  } else if (/\bbin\/secret\b/.test(command)) await refreshKeys($)
}
