// The keys remembered: which keys, tokens and logins the person has given, and where each is kept, by name only, never a value.
// It is made again from each store's own list of names (Claudopus's keychain, the rest of this Mac's keychain, the .env files in each
// subject's folder) and from what SBOS last said it holds, so a key taken out of a store stops being listed. Work reads it in
// keys.md in the memory folder, the Keys button shows it, and work that asks for a key it lists is told where that key is

const KEYS_FILE = 'keys.md'
const KEYS_STATE = 'keys.json'
// How long the local stores' names are trusted before they are read again, for an ask checked against them
const KEYS_MS = 60_000
type KeyStore = 'claudopus' | 'keychain' | 'sbos' | 'env'
type KeyEntry = { name: string; store: KeyStore; where?: string; label?: string; isPresent: boolean; added: number; seen: number }
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
const isKeyVariable = (name: string) => /(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|_PAT|CREDENTIALS?)(?:_|$)/.test(name)

let keys: KeysState = { at: 0, entries: [] }
const keysRead = async ($: EngineInterface): Promise<KeysState> => {
  try {
    const kept = JSON.parse((await readOr($, `${dir}/${KEYS_STATE}`)) || '{}') as Partial<KeysState>
    return { at: Number(kept.at) || 0, sbosAt: kept.sbosAt, entries: Array.isArray(kept.entries) ? kept.entries : [] }
  } catch {
    return { at: 0, entries: [] }
  }
}

// The names each local store lists now; undefined for a store that could not be read, so what was known of it stays
const localNames = async ($: EngineInterface) => {
  const mod = await $.process.run([`${$.plugin.root}/bin/secret`, '--list']).catch(() => undefined)
  const all = await $.process.run([`${$.plugin.root}/bin/keyring`, 'entries']).catch(() => undefined)
  const claudopus = mod?.exitCode === 0 ? mod.stdout.split('\n').map(one => plainName(one.trim())).filter(Boolean) : undefined
  const keychain =
    all?.exitCode === 0
      ? all.stdout
          .split('\n')
          .map(line => line.split('\t'))
          .filter(([service = '', account = '']) => isKeyEntry(service, account))
          .map(([service = '', account = '']) => ({ name: plainName(/^[A-Z][A-Z0-9_]+$/.test(account) ? account : service), where: plainName(`${service}${account ? ` / ${account}` : ''}`) }))
          .filter(one => one.name)
      : undefined
  // The top of each subject's folder: its .env files, read for the names before each = and nothing after it
  const env: { name: string; where: string }[] = []
  const folders = [...new Set((await readIndex($).catch(() => [] as Stream[])).map(one => one.repo).filter(one => one.startsWith('/')))]
  for (const folder of folders) {
    const files = (await $.fs.list(folder).catch(() => [])).map(one => one.name).filter(name => /^\.env(?:\.[\w-]+)?$/.test(name) && !/\.(?:example|sample|template|dist)$/.test(name))
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
const refreshKeys = async ($: EngineInterface, sbos?: { name: string; label?: string; isPresent: boolean }[], isListed = true) => {
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
    ...kept('sbos', sbos?.map(one => made('sbos', one.name, { label: one.label, isPresent: one.isPresent }))),
  ]
  keys = { at: now, sbosAt: sbos && isListed ? now : before.sbosAt, entries }
  // Written only once every kept value is hidden in it: a name can never carry one there
  const text = await keysHidden($, keysText($.plugin.root, keys))
  const state = await keysHidden($, `${JSON.stringify(keys, null, 2)}\n`)
  if (text === undefined || state === undefined) return (await log($, 'the list of keys was not written: it could not be checked for kept values'), keys)
  await $.fs.write(`${dir}/${KEYS_STATE}`, state)
  await $.fs.write(`${dir}/${KEYS_FILE}`, text)
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
        .filter((one): one is { name: string; label?: unknown; put_in?: unknown } => Boolean(one) && typeof one === 'object' && typeof (one as { name?: unknown }).name === 'string')
        .map(one => ({ name: plainName(one.name), label: typeof one.label === 'string' ? oneLine(one.label).slice(0, 120) : undefined, isPresent: one.put_in === true }))
        .filter(one => one.name)
    } catch {}
  }
  return undefined
}

// The key an ask is for, when the list says it is kept where work can use it: what the ask is told back, or ''
const usable = (one: KeyEntry) => one.isPresent && (one.store === 'claudopus' || one.store === 'sbos')
const KEY_KEPT = (root: string, one: KeyEntry, asked: string) =>
  named(
    `Not asked: {name} gave this key already. ${asked === one.name ? one.name : `"${asked}" is ${one.name}`}, kept in ${STORE_NAMES[one.store]}${one.seen ? ` and last seen there ${dayOf(one.seen)}` : ''}. Use it through ${routeOf(root, one)}. If it no longer works, take it out first (${one.store === 'claudopus' ? `\`${root}/bin/secret ${one.name} --forget\`` : "SBOS's `forget_secret`"}), then ask. The list of keys is ${dir}/${KEYS_FILE}.`,
  )
const keyAsked = async ($: EngineInterface, e: { tool: string }): Promise<string> => {
  if (!dir) return ''
  const input = e as { command?: unknown; name?: unknown; text?: unknown; copy?: unknown; agent?: unknown }
  const root = $.plugin.root
  const listed = async () => (await keysFresh($)).entries.filter(usable)
  if (e.tool === 'mcp__sbos__ask_secret') {
    // One asked for an autonomous agent of SBOS's is its own: the list holds Dima's
    if (typeof input.agent === 'string' && input.agent) return ''
    const name = String(input.name ?? '')
    const one = (await listed()).find(entry => entry.name === name || sameKey(entry.name, name))
    return one ? KEY_KEPT(root, one, name) : ''
  }
  if (e.tool === `${TOOLS}ask`) {
    // What the ask tells the person to do: a key named, or the words of a key's name beside a word for a key
    const said = `${String(input.text ?? '')} ${String(input.copy ?? '')}`
    if (!/\b(?:key|token|password|secret|credentials?|login)s?\b/i.test(said) && !/[A-Z0-9]_[A-Z0-9]/.test(said)) return ''
    const words = new Set(said.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
    const flatSaid = said.toLowerCase().replace(/[-_]/g, ' ')
    const one = (await listed()).find(entry => flatSaid.includes(entry.name.toLowerCase().replace(/[-_]/g, ' ')) || (coreOf(entry.name).length > 0 && coreOf(entry.name).every(word => words.has(word))))
    return one ? KEY_KEPT(root, one, one.name) : ''
  }
  if (e.tool !== 'Bash') return ''
  // The secret runner asked for a key under a name it does not keep, while the list has it under another, or asked to take a kept
  // one in again
  for (const run of String(input.command ?? '').matchAll(/\bbin\/secret['"]?\s+['"]?([A-Za-z_][A-Za-z0-9_,]*)['"]?\s+['"]?(--add|[^\s'"-][^\s'"]*)/g)) {
    const names = (run[1] ?? '').split(',').filter(Boolean)
    const fresh = await listed()
    const mod = fresh.filter(entry => entry.store === 'claudopus').map(entry => entry.name)
    for (const name of names) {
      if (run[2] === '--add' && mod.includes(name)) return KEY_KEPT(root, fresh.find(entry => entry.store === 'claudopus' && entry.name === name)!, name)
      if (mod.includes(name)) continue
      const one = fresh.find(entry => sameKey(entry.name, name))
      if (one) return KEY_KEPT(root, one, name)
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
    const before = (await keysRead($)).entries.filter(one => one.store === 'sbos' && one.name !== name)
    const sbos = [...before.map(one => ({ name: one.name, label: one.label, isPresent: one.isPresent })), ...(e.tool.endsWith('ask_secret') && name ? [{ name, label: typeof label === 'string' ? oneLine(label).slice(0, 120) : undefined, isPresent: false }] : [])]
    await refreshKeys($, sbos, false)
  } else if (/\bbin\/secret\b/.test(command)) await refreshKeys($)
}
