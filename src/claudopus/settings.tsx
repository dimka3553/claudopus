// Config: the texts in force and the settings, kept keys' names, and the Config tab's acts (its drawing is in ../../mods/claudopus/hooks/config.tsx)

// ---- Config: the texts in force and the settings (the tab and its pure parts are in ./config) ----

// The person's own copy of one of the three texts the mod ships (TEXTS in ./config), each written at its own fixed place in the
// memory folder; the Config tab is the only writer, and nothing else is written there
async function writeOwnText($: EngineInterface, memory: string, path: string, text: string) {
  await personWrote($, memory, path, text)
  if (path === 'rules/CLAUDE.md') return $.fs.write(`${memory}/rules/CLAUDE.md`, text)
  if (path === 'roles/chat.md') return $.fs.write(`${memory}/roles/chat.md`, text)
  if (path === 'roles/work.md') return $.fs.write(`${memory}/roles/work.md`, text)
  throw new Error(`${path} isn't one of Claudopus's rules files`)
}
// The text in force: the person's own copy when it holds anything, the shipped one otherwise
async function inForce($: EngineInterface, root: string, memory: string, path: string) {
  // What is read is what is known: a change made since is never read, and is put back
  const own = memory ? await personText($, memory, path) : ''
  const shipped = await readOr($, `${root}/${path}`)
  // A copy the same as what shipped is no change of the person's
  // A copy made before an update can lack a place the shipped text now fills (a setting such as the models): it is stale
  const places = (text: string) => new Set(text.match(/\{[a-z]+\}/gi) ?? [])
  const isStale = (own: string) => [...places(shipped)].some(place => !places(own).has(place))
  if (own.trim() && own.trim() !== shipped.trim()) return { text: own, path: `${memory}/${path}`, isOwn: true, isStale: isStale(own) }
  return { text: shipped, path: `${root}/${path}`, isOwn: false, isStale: false }
}

async function readConfig($: EngineInterface, memory: string) {
  return parse(await personText($, memory, 'config.json'))
}
// Sets one key, or with undefined puts it back to what shipped; every other key, ones this tab does not know included, is kept
async function setConfig($: EngineInterface, memory: string, key: keyof Config, value: unknown, role?: Role | LeanKey) {
  // A change is made on what is known, never on a copy changed since
  const path = `${memory}/config.json`
  const text = await personText($, memory, 'config.json')
  const config = (() => {
    try {
      return JSON.parse(text || '{}') as Record<string, unknown>
    } catch {
      return undefined
    }
  })()
  // A file that does not parse is someone's edit under way: it is left as it is
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error("Claudopus can't read config.json")
  // A `chat` choice of 0.2.201 to 0.2.205, when the chat could do short requests itself, is read as nothing and goes at the next save
  const old = config.lean
  if (old && typeof old === 'object' && !Array.isArray(old) && 'chat' in old) {
    const { chat: _gone, ...rest } = old as Record<string, unknown>
    if (Object.keys(rest).length) config.lean = rest
    else delete config.lean
  }
  if ((key === 'models' || key === 'lean') && role) {
    const models = { ...((config[key] as Record<string, unknown>) ?? {}) }
    if (value === undefined) delete models[role]
    else models[role] = value
    if (Object.keys(models).length) config[key] = models
    else delete config[key]
  } else if (value === undefined) delete config[key]
  else config[key] = value
  await personWrote($, memory, 'config.json', `${JSON.stringify(config, null, 2)}\n`)
  await $.fs.write(`${memory}/config.json`, `${JSON.stringify(config, null, 2)}\n`)
}

async function openedInEditor($: EngineInterface, path: string) {
  // The text editor the Mac opens .md files in; elsewhere the desktop's own opener
  const r = await openOn($, path, true)
  return r.exitCode === 0 ? '' : r.stderr || 'no editor opened it'
}
// Edit: the person's own copy, made from the shipped text the first time, opened in their editor
async function editText($: EngineInterface, root: string, memory: string, path: string) {
  const own = `${memory}/${path}`
  if (!(await personText($, memory, path)).trim()) await writeOwnText($, memory, path, await readOr($, `${root}/${path}`))
  return openedInEditor($, own)
}
// Put back: the person's copy moves aside as .old, and the shipped text is in force again
async function putBack($: EngineInterface, memory: string, path: string) {
  const own = `${memory}/${path}`
  // Each copy put back is kept under a name of its own, so a second Reset never loses the first
  const at = new Date(await $.clock.now()).toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  await personWrote($, memory, path, null)
  const r = await $.process.run(['mv', '-n', own, `${own}.${at}.old`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return r.exitCode === 0 ? '' : r.stderr || "Claudopus couldn't move your copy aside"
}

// Save: what the person wrote in the tab becomes their own copy
async function saveText($: EngineInterface, root: string, memory: string, path: string, text: string) {
  // Saved as it shipped, it is no copy of the person's: the shipped text stays in force through updates
  if (text.trim() === (await readOr($, `${root}/${path}`)).trim()) return (await readOr($, `${memory}/${path}`)) ? putBack($, memory, path) : ''
  await writeOwnText($, memory, path, text.endsWith('\n') ? text : `${text}\n`)
  return ''
}

// Kept keys stay out of every chat: a command that would read one from the keychain is refused, and once any key is kept, what a
// tool answers comes back with every kept value hidden. The values never reach the mod: `bin/secret --hide` swaps them in a pipe
// The names of the kept keys and of the kept admin passwords (undefined while their list could not be read), each value's marks
// by its length in bytes (undefined when they could not be read: then every text goes through the runner), and the last texts the
// runner gave back unchanged
let secrets = { at: -SECRETS_MS, names: [] as string[], admins: undefined as string[] | undefined, marks: undefined as Map<number, number[]> | undefined, same: [] as string[] }
// A mark is a value's length and a hash of its bytes that only `bin/secret --marks` works out, with this load's own random base:
// each byte b in turn, hash = (hash * MARK_BASE + b) % MARK_MOD. A base under 2^21 keeps every step a whole number a double holds,
// and the modulus 2^31 - 1 is taken without a division (the part above 2^31 added to the part below), which is several times faster
const MARK_BASE = 256 + Math.floor(Math.random() * 2_096_896)
const MARK_MOD = 2_147_483_647
const SAME_MAX = 200_000
// The names, read again at most every SECRETS_MS (and with each use of a runner), in one run that lists the keychain once and marks
// each value. A list that cannot be read keeps what was known before, so hiding never stops on a failure
const knowKept = async ($: EngineInterface, isNow = false) => {
  const now = await $.clock.now()
  if (now - secrets.at < SECRETS_MS && !isNow) return secrets
  const run = (argv: string[]) => $.process.run(argv).catch(() => undefined)
  const marked = await run([`${$.plugin.root}/bin/secret`, '--marks', String(MARK_BASE)])
  const lines = marked?.exitCode === 0 && !marked.isStdoutTruncated ? marked.stdout.split('\n').filter(Boolean) : []
  if (lines.at(-1) === 'end') {
    const names: string[] = []
    const admins: string[] = []
    const marks = new Map<number, number[]>()
    let isRead = true
    for (const line of lines.slice(0, -1)) {
      const [kind, one = '', hash = ''] = line.split('\t')
      if (kind === 'name') names.push(one)
      else if (kind === 'admin') admins.push(one)
      else if (kind === 'mark' && /^[1-9]\d*$/.test(one) && /^\d+$/.test(hash)) marks.set(Number(one), [...(marks.get(Number(one)) ?? []), Number(hash)])
      else isRead = false
    }
    if (isRead) return (secrets = { at: now, names, admins, marks, same: [] })
  }
  // No marks (a value that cannot be read, a runner that fails): the names alone, as before, and every text goes through the runner
  const listed = await run([`${$.plugin.root}/bin/secret`, '--list'])
  const admins = await run([`${$.plugin.root}/bin/keyring`, 'list', 'claudopus-admin'])
  if (listed?.exitCode === 0) secrets = { at: now, names: listed.stdout.split('\n').filter(Boolean), admins: admins?.exitCode === 0 ? admins.stdout.split('\n').filter(Boolean) : secrets.admins, marks: undefined, same: [] }
  return secrets
}
// Whether a JSON text may hold a marked value where the runner looks: inside its strings, keys too, as they read once decoded (and
// its numbers as written, which perl takes as text when they are too long for it). Their UTF-8 BYTES are rolled through the marks'
// hash, once for each length: no window matching a mark is proof that no value is there; a match may be chance, and the runner decides
const mayHoldKept = (text: string, marks: Map<number, number[]>) => {
  const parts: string[] = []
  let size = 0
  const walk = (x: unknown) => {
    if (typeof x === 'string' || typeof x === 'number') size += parts[parts.push(String(x)) - 1]!.length * 3 + 1
    else if (Array.isArray(x)) for (const one of x) walk(one)
    else if (x && typeof x === 'object') for (const key of Object.keys(x)) (walk(key), walk((x as Record<string, unknown>)[key]))
  }
  try {
    walk(JSON.parse(text))
  } catch {
    return true
  }
  // (between two strings a byte no UTF-8 text holds, so a window over both matches nothing but by chance)
  const bytes = new Uint8Array(size)
  let n = 0
  for (const s of parts) {
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i)
      if (c < 0x80) {
        bytes[n++] = c
        continue
      }
      const next = c >= 0xd800 && c < 0xdc00 ? s.charCodeAt(i + 1) : 0
      if (c < 0x800) bytes[n++] = 0xc0 | (c >> 6)
      else if (next >= 0xdc00 && next < 0xe000) {
        c = 0x10000 + ((c - 0xd800) << 10) + (next - 0xdc00)
        i++
        bytes[n++] = 0xf0 | (c >> 18)
        bytes[n++] = 0x80 | ((c >> 12) & 63)
        bytes[n++] = 0x80 | ((c >> 6) & 63)
      } else {
        bytes[n++] = 0xe0 | (c >> 12)
        bytes[n++] = 0x80 | ((c >> 6) & 63)
      }
      bytes[n++] = 0x80 | (c & 63)
    }
    bytes[n++] = 0xff
  }
  const gone = new Float64Array(256)
  for (const [length, hashes] of marks) {
    if (length > n) continue
    // What the byte leaving the window takes away, its share base^length, kept as what is added instead
    let top = 1
    let h = 0
    for (let i = 0; i < length; i++) {
      top = (top * MARK_BASE) % MARK_MOD
      h = (h * MARK_BASE + bytes[i]!) % MARK_MOD
    }
    for (let b = 0; b < 256; b++) gone[b] = MARK_MOD - ((b * top) % MARK_MOD)
    const first = hashes[0]
    const isOne = hashes.length === 1
    for (let i = length; ; i++) {
      if (h === first || (!isOne && hashes.includes(h))) return true
      if (i >= n) break
      const x = h * MARK_BASE + bytes[i]! + gone[bytes[i - length]!]!
      const high = Math.floor(x / 2_147_483_648)
      h = x - high * 2_147_483_648 + high
      if (h >= MARK_MOD) h -= MARK_MOD
    }
  }
  return false
}
// A JSON text with every kept value hidden inside its strings, kept admin passwords too; undefined when it could not be checked.
// The runner starts only for a text that may hold a value, and not for one it gave back unchanged since the names were read
const hiddenJson = async ($: EngineInterface, text: string) => {
  const { names, admins, marks, same } = await knowKept($)
  if (!names.length && !admins?.length) return text
  if (same.includes(text) || (marks && !mayHoldKept(text, marks))) return text
  const hidden = await $.process.run([`${$.plugin.root}/bin/secret`, '--hide', '--json', ...(admins ? ['--admins', admins.join(',')] : []), ...names], { stdin: text }).catch(() => undefined)
  if (!hidden || hidden.exitCode !== 0 || hidden.isStdoutTruncated || !hidden.stdout.trim()) return undefined
  if (hidden.stdout === text && text.length <= SAME_MAX && same.push(text) > 8) same.shift()
  return hidden.stdout
}
async function hideKept($: EngineInterface, e: ToolCallInput, r: ToolCallResult): Promise<ToolCallResult> {
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  if (r.deny || OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return r
  const { names, admins } = await knowKept($, command.includes('bin/secret') || command.includes('bin/admin'))
  if (!names.length && !admins?.length) return r
  try {
    const text = JSON.stringify({ result: r.result, context: r.context })
    const hidden = await hiddenJson($, text)
    if (hidden === undefined) throw new Error('not hidden')
    if (hidden === text) return r
    const swapped = JSON.parse(hidden) as { result: typeof r.result; context: typeof r.context }
    return { ...r, result: swapped.result, context: swapped.context } as ToolCallResult
  } catch {
    return { deny: `${e.tool} ran, but Claudopus withheld its output because it couldn't check it for saved keys.` }
  }
}
// Config: each thing the person can set, what is in force, and a way to change it or put it back to what shipped
const CONFIG_PANE = 'config'
const CONFIG_TITLE = 'Config'
let configFailed = ''
const openConfig = async ($: EngineInterface) => {
  presses += 1
  configFailed = ''
  await front($, CONFIG_PANE, CONFIG_TITLE)
}
const configButton = ($: EngineInterface, ui: Ui, isKeyed = false) => (
  <ui.Box key="config-button" flexShrink={0}>
    <ui.Button key={`config-open-${presses}`} label="Config" hotkey={isKeyed ? 'c' : undefined} plain={isKeyed ? true : undefined} onPress={() => void openConfig($).catch(err => log($, `config not opened: ${String(err)}`))} />
  </ui.Box>
)
// Check now as it stands in this chat: under way, and what the last press found, kept until the next press
// (isOut: it found a newer version, which the update box under it then says with its presses)
const updateCheck = { isChecking: false, said: '', isError: false, isOut: false }
const configShown = async ($: EngineInterface): Promise<ConfigShown> => ({
  version: (await versionsOf($).catch(() => ({ version: '' }))).version,
  check: { ...updateCheck },
  updates: await (async () => {
    const known = await knowSource($).catch(() => undefined)
    const stamp = stampOf(await readOr($, lookedPath()))
    return {
      where: known ? `${known.where}${known.cannot ? `. ${known.cannot.why.replace(/^./, c => c.toUpperCase())}` : ''}` : '',
      lookedAt: stamp?.at ?? 0,
      seen: isVersion(stamp?.version) ? stamp.version : '',
      now: await $.clock.now(),
    }
  })(),
  texts: await Promise.all(
    TEXTS.map(async text => {
      const { isOwn, isStale, path, text: body } = await inForce($, $.plugin.root, dir, text.path)
      return { text, isOwn, isStale, path, body }
    }),
  ),
  config: await readConfig($, dir),
  gate: await (async () => {
    const [gate, kept] = [await gateOf($), await validAllowed($)]
    return { mode: gate.mode, unsealed: gate.unsealed, allowed: kept.valid.map(({ host, command }) => ({ host, command })), unsealedAllowed: kept.unsealed, isAfar: isRunFromAfar, isLinux }
  })(),
  // A config.json that does not read is said at once: until it is fixed every setting is as shipped
  failed:
    configFailed ||
    (await readOr($, `${dir}/config.json`).then(text => {
      try {
        JSON.parse(text || '{}')
        return ''
      } catch {
        return `Claudopus can't read ${dir}/config.json, so every setting is at its default. Fix the file or delete it.`
      }
    })),
})
// Each act says what failed under the tab, logs it, and reads the settings again so the chat goes on with what is in force
const configAct = ($: EngineInterface, what: string, act: () => Promise<string | void>) => {
  presses += 1
  void act()
    .then(failed => {
      configFailed = failed ? `${what}: ${failed}${/[.!?]$/.test(failed) ? '' : '.'}` : ''
    })
    .catch(err => {
      configFailed = `${what}: ${String(err instanceof Error ? err.message : err).replace(/([^.!?])$/, '$1.')}`
    })
    .then(async () => {
      if (configFailed) await log($, `config: ${configFailed}`)
      await loadSettings($)
      redraw($)
    })
}
const configActs = ($: EngineInterface) => ({
  // Open file, beside Cancel while a text is edited in the tab: the edit there is left, and the person's own copy opens in their editor
  open: (text: (typeof TEXTS)[number]) =>
    configAct($, `Couldn't open ${text.name}`, async () => {
      Object.assign(editing, { key: '', draft: '' })
      return editText($, $.plugin.root, dir, text.path)
    }),
  // Edit opens the text in the tab itself; Save makes it the person's own copy
  edit: (text: (typeof TEXTS)[number], body: string) => configAct($, '', async () => void Object.assign(editing, { key: text.key, draft: body })),
  save: (text: (typeof TEXTS)[number], body: string) =>
    configAct($, `Couldn't save ${text.name}`, async () => {
      const failed = body.trim() ? await saveText($, $.plugin.root, dir, text.path, body) : 'the text was empty, so nothing changed'
      Object.assign(editing, { key: '', draft: '' })
      return failed
    }),
  cancel: () => configAct($, '', async () => void Object.assign(editing, { key: '', draft: '' })),
  putBack: (text: (typeof TEXTS)[number]) => configAct($, `Couldn't reset ${text.name}`, () => putBack($, dir, text.path)),
  set: (key: Parameters<typeof setConfig>[2], value: unknown, role?: Parameters<typeof setConfig>[4]) =>
    configAct($, "Couldn't save the setting", async () => {
      await setConfig($, dir, key, value, role)
    }),
  // A model as Config shows it: Same as most tasks for heavy work is Fable kept for when the person names it (lean.fable "named"), and
  // any model picked turns an older Config's Fable for every task (lean.fable "all") into Most tasks on Fable, so what runs stays
  model: (role: Role, value: string) =>
    configAct($, "Couldn't save the setting", async () => {
      const fable = leanOf(await readConfig($, dir)).fable
      const shipped = (one: Role) => ROLES.find(r => r.key === one)?.shipped
      if (fable === 'all' && role !== 'work') await setConfig($, dir, 'models', 'fable' === shipped('work') ? undefined : 'fable', 'work')
      if (role === 'heavy' && value === SAME) {
        await setConfig($, dir, 'models', undefined, 'heavy')
        return setConfig($, dir, 'lean', 'named', 'fable')
      }
      await setConfig($, dir, 'models', value === shipped(role) ? undefined : value, role)
      if (fable === 'all' || (fable === 'named' && role === 'heavy')) await setConfig($, dir, 'lean', undefined, 'fable')
    }),
  // When a task ends: one choice, written as the two keys, each on as shipped
  alerts: (value: (typeof ALERTS)[number]['value']) =>
    configAct($, "Couldn't save the setting", async () => {
      const one = ALERTS.find(a => a.value === value) ?? ALERTS[0]
      await setConfig($, dir, 'sound', one.sound ? undefined : false)
      await setConfig($, dir, 'notifications', one.notifications ? undefined : false)
    }),
  more: (isOpen: boolean) => configAct($, '', async () => void (configMore.isOpen = isOpen)),
  // Admin commands: each choice is sealed as it is made, and one that takes something back makes every earlier seal void
  gateMode: (mode: 'each' | 'work' | 'never') => configAct($, "Couldn't save the setting", () => regate($, { mode })),
  gateRemove: (host: string, command: string) => configAct($, "Couldn't remove the command", () => regate($, { remove: { host, command } })),
  memory: (surface: string) => void showMemory($, surface as RenderSurface).catch(err => log($, `memory folder not opened: ${String(err)}`)),
  // How often the look runs, or only at Check now: one choice, written as the two keys
  lookEvery: (hours: number) =>
    configAct($, "Couldn't save the setting", async () => {
      await setConfig($, dir, 'updates', hours ? undefined : false)
      await setConfig($, dir, 'updateEvery', hours && hours !== 1 ? hours : undefined)
    }),
  // A press while a check runs does nothing: the tab shows it checking. It only looks; Config and the panel offer what it found
  check: () => {
    if (updateCheck.isChecking) return
    presses += 1
    Object.assign(updateCheck, { isChecking: true, said: '', isError: false, isOut: false })
    redraw($)
    void checkNow($)
      .catch(err => ({ text: `Couldn't check: ${String(err instanceof Error ? err.message : err).slice(0, 160)}`, isError: true, isOut: false }))
      .then(said => {
        Object.assign(updateCheck, { isChecking: false, said: said.text, isError: said.isError, isOut: Boolean(said.isOut) })
        presses += 1
        redraw($)
      })
  },
})
