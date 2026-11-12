// Config: the texts in force and the settings, kept keys' names, and the Config tab's acts (its drawing is in ../../mods/claudopus/hooks/config.tsx)

// ---- Config: the texts in force and the settings (the tab and its pure parts are in ./config) ----

// The person's own copy of one of the three texts the mod ships (TEXTS in ./config), each written at its own fixed place in the
// memory folder; the Config tab is the only writer, and nothing else is written there
async function writeOwnText($: EngineInterface, memory: string, path: string, text: string) {
  if (path === 'rules/CLAUDE.md') return $.fs.write(`${memory}/rules/CLAUDE.md`, text)
  if (path === 'roles/chat.md') return $.fs.write(`${memory}/roles/chat.md`, text)
  if (path === 'roles/work.md') return $.fs.write(`${memory}/roles/work.md`, text)
  throw new Error(`${path} is not one of the texts the mod ships`)
}
// The text in force: the person's own copy when it holds anything, the shipped one otherwise
async function inForce($: EngineInterface, root: string, memory: string, path: string) {
  const own = memory ? await readOr($, `${memory}/${path}`) : ''
  const shipped = await readOr($, `${root}/${path}`)
  // A copy the same as what shipped is no change of the person's
  // A copy made before an update can lack a place the shipped text now fills (a setting such as the models): it is stale
  const places = (text: string) => new Set(text.match(/\{[a-z]+\}/gi) ?? [])
  const isStale = (own: string) => [...places(shipped)].some(place => !places(own).has(place))
  if (own.trim() && own.trim() !== shipped.trim()) return { text: own, path: `${memory}/${path}`, isOwn: true, isStale: isStale(own) }
  return { text: shipped, path: `${root}/${path}`, isOwn: false, isStale: false }
}

async function readConfig($: EngineInterface, memory: string) {
  return parse(await readOr($, `${memory}/config.json`))
}
// Sets one key, or with undefined puts it back to what shipped; every other key, ones this tab does not know included, is kept
async function setConfig($: EngineInterface, memory: string, key: keyof Config, value: unknown, role?: Role) {
  const path = `${memory}/config.json`
  const text = await readOr($, path)
  const config = (() => {
    try {
      return JSON.parse(text || '{}') as Record<string, unknown>
    } catch {
      return undefined
    }
  })()
  // A file that does not parse is someone's edit under way: it is left as it is
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('config.json does not parse')
  if (key === 'models' && role) {
    const models = { ...((config.models as Record<string, unknown>) ?? {}) }
    if (value === undefined) delete models[role]
    else models[role] = value
    if (Object.keys(models).length) config.models = models
    else delete config.models
  } else if (value === undefined) delete config[key]
  else config[key] = value
  await $.fs.write(`${memory}/config.json`, `${JSON.stringify(config, null, 2)}\n`)
}

async function openedInEditor($: EngineInterface, path: string) {
  // The text editor the Mac opens .md files in; elsewhere the desktop's own opener
  const mac = await $.process.run(['open', '-t', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (mac.exitCode === 0) return ''
  const other = await $.process.run(['xdg-open', path]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return other.exitCode === 0 ? '' : mac.stderr || other.stderr || 'no editor opened'
}
// Edit: the person's own copy, made from the shipped text the first time, opened in their editor
async function editText($: EngineInterface, root: string, memory: string, path: string) {
  const own = `${memory}/${path}`
  if (!(await readOr($, own)).trim()) await writeOwnText($, memory, path, await readOr($, `${root}/${path}`))
  return openedInEditor($, own)
}
// Put back: the person's copy moves aside as .old, and the shipped text is in force again
async function putBack($: EngineInterface, memory: string, path: string) {
  const own = `${memory}/${path}`
  // Each copy put back is kept under a name of its own, so a second Reset never loses the first
  const at = new Date(await $.clock.now()).toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  const r = await $.process.run(['mv', '-n', own, `${own}.${at}.old`]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  return r.exitCode === 0 ? '' : r.stderr || 'not put back'
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
let secrets = { at: -SECRETS_MS, names: [] as string[] }
async function hideKept($: EngineInterface, e: ToolCallInput, r: ToolCallResult): Promise<ToolCallResult> {
  const command = e.tool === 'Bash' ? String((e as { command?: unknown }).command ?? '') : ''
  if (r.deny || OWN.includes(e.tool) || OWN_SERVERS.some(prefix => e.tool.startsWith(prefix))) return r
  const runner = `${$.plugin.root}/bin/secret`
  const now = await $.clock.now()
  if (now - secrets.at >= SECRETS_MS || command.includes('bin/secret')) {
    // A list that cannot be read keeps the names known before, so hiding never stops on a failure
    const listed = await $.process.run([runner, '--list']).catch(() => undefined)
    if (listed?.exitCode === 0) secrets = { at: now, names: listed.stdout.split('\n').filter(Boolean) }
  }
  if (!secrets.names.length) return r
  try {
    const text = JSON.stringify({ result: r.result, context: r.context })
    const hidden = await $.process.run([runner, '--hide', '--json', ...secrets.names], { stdin: text })
    if (hidden.exitCode !== 0 || hidden.isStdoutTruncated) throw new Error('not hidden')
    if (hidden.stdout === text) return r
    const swapped = JSON.parse(hidden?.stdout ?? '') as { result: typeof r.result; context: typeof r.context }
    return { ...r, result: swapped.result, context: swapped.context } as ToolCallResult
  } catch {
    return { deny: `${e.tool} ran, and what it answered was withheld: it could not be checked for kept keys.` }
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
const configButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="config-button" flexShrink={0}>
    <ui.Button key={`config-open-${presses}`} label="Config" onPress={() => void openConfig($).catch(err => log($, `config not opened: ${String(err)}`))} />
  </ui.Box>
)
const configShown = async ($: EngineInterface): Promise<ConfigShown> => ({
  texts: await Promise.all(
    TEXTS.map(async text => {
      const { isOwn, isStale, path, text: body } = await inForce($, $.plugin.root, dir, text.path)
      return { text, isOwn, isStale, path, body }
    }),
  ),
  config: await readConfig($, dir),
  // A config.json that does not read is said at once: until it is fixed every setting is as shipped
  failed:
    configFailed ||
    (await readOr($, `${dir}/config.json`).then(text => {
      try {
        JSON.parse(text || '{}')
        return ''
      } catch {
        return `${dir}/config.json does not read as JSON, so every setting is as shipped. Fix it or remove it.`
      }
    })),
})
// Each act says what failed under the tab, logs it, and reads the settings again so the chat goes on with what is in force
const configAct = ($: EngineInterface, what: string, act: () => Promise<string | void>) => {
  presses += 1
  void act()
    .then(failed => {
      configFailed = failed ? `${what}: ${failed}` : ''
    })
    .catch(err => {
      configFailed = `${what}: ${String(err instanceof Error ? err.message : err)}`
    })
    .then(async () => {
      if (configFailed) await log($, `config: ${configFailed}`)
      await loadSettings($)
      redraw($)
    })
}
const configActs = ($: EngineInterface) => ({
  open: (text: (typeof TEXTS)[number]) => configAct($, `${text.name} not opened`, () => editText($, $.plugin.root, dir, text.path)),
  // Edit opens the text in the tab itself; Save makes it the person's own copy
  edit: (text: (typeof TEXTS)[number], body: string) => configAct($, '', async () => void Object.assign(editing, { key: text.key, draft: body })),
  save: (text: (typeof TEXTS)[number], body: string) =>
    configAct($, `${text.name} not saved`, async () => {
      const failed = body.trim() ? await saveText($, $.plugin.root, dir, text.path, body) : 'the text was empty, so nothing changed'
      Object.assign(editing, { key: '', draft: '' })
      return failed
    }),
  cancel: () => configAct($, '', async () => void Object.assign(editing, { key: '', draft: '' })),
  putBack: (text: (typeof TEXTS)[number]) => configAct($, `${text.name} not reset`, () => putBack($, dir, text.path)),
  set: (key: Parameters<typeof setConfig>[2], value: unknown, role?: Parameters<typeof setConfig>[4]) => configAct($, 'Not saved', () => setConfig($, dir, key, value, role)),
})
