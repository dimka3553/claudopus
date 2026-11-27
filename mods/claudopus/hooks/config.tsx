// Config: everything a person can set, in one place. Three texts ship with the mod (the principles every chat and piece of work
// carries, the chat's rules, the rules every piece of work follows); a copy of one at the same path under the memory folder,
// ~/.claude/claudopus, is the person's own and is used in its place, so an update of the mod, which replaces its own folder, never
// touches it. The settings are config.json in the same folder. Put back removes the person's copy or key, kept beside it as .old
import type { ElementTable } from 'claude-code'

type Ui = ElementTable

export type Text = { key: string; name: string; what: string; path: string }
export const TEXTS: Text[] = [
  { key: 'principles', name: 'Your principles', what: 'How you work. Every chat and task follows them.', path: 'rules/CLAUDE.md' },
  { key: 'chat', name: 'Chat rules', what: 'How a chat starts a task for each of your messages.', path: 'roles/chat.md' },
  { key: 'work', name: 'Task rules', what: 'What Claudopus tells Claude at the start of every task.', path: 'roles/work.md' },
]

// ---- Settings, config.json ----

export const ROLES = [
  { key: 'work', name: 'Most tasks', shipped: 'opus' },
  { key: 'legwork', name: 'Clearly stated tasks', shipped: 'sonnet' },
  { key: 'heavy', name: 'Heavy tasks', shipped: 'fable' },
] as const
export type Role = (typeof ROLES)[number]['key']
export type Models = Record<Role, string>
export const MODEL_NAMES: Record<string, string> = { opus: 'Opus 5.5', sonnet: 'Sonnet 5.5', fable: 'Fable 5.2', haiku: 'Haiku 5.5' }
// `admin`: when the person is asked before an admin command runs: "each" time (as shipped), once for a piece of "work", or "never".
// "work" and "never" count only with `adminSealed`, the seal a press in this tab makes; without it every command asks.
// `updates`: false looks at the version page only when asked (Config's Check now); `updateEvery` how many hours apart the look runs
// otherwise; `skipVersion` a version the person skipped, kept quiet with every older one. None of them installs anything: Download
// and Install are presses in the panel, and nothing here can make them run by themselves
// `adminPassword` is read no more: no admin password is kept
// `askPictures`: true has Claudopus draw a task's question with buttons as one picture, open it on the screen and show it with the
// question; off as shipped
// `taskColours`: false takes away the box of each chat reply about a task, in that task's colour with its name and Reply, and the
// colour dot on its card; on as shipped. `replyLinks`: false takes away the list of a reply's links at its end; on as shipped
export type Config = { name?: string; agents?: boolean; askPictures?: boolean; taskColours?: boolean; replyLinks?: boolean; sound?: boolean; notifications?: boolean; updates?: boolean; updateEvery?: number; skipVersion?: string; models?: Partial<Models>; lean?: Partial<Lean>; heavy?: string; admin?: string; adminSealed?: string; adminPassword?: string }

// When Fable runs and when a second agent checks, each a choice in Config's Tasks band, the shipped one first. `lean` in config.json
// holds only the ones changed; a key of a choice that was taken out (small, quick, start, checker, readers) is read as nothing. A job
// handed to a task goes as written instructions to a fresh one, never a copy of the chat: measured (16 Nov, 108 jobs), that cost least
// and ran as fast or faster at every chat size and model. Who does the work has no choice: every change goes to a task, and a
// `chat` key a config.json still holds from 0.2.201 to 0.2.205 is read as nothing
export const LEAN = [
  { key: 'fable', name: 'Fable 5.2 tasks', what: 'Which tasks run on Fable 5.2.', options: [{ value: 'heavy', label: 'Heavy tasks' }, { value: 'all', label: 'Every task' }, { value: 'named', label: 'Only when I ask' }] },
  { key: 'second', name: 'Second check', what: "When a helper that didn't build the change looks for faults before you see the result.", options: [{ value: 'asked', label: 'Only when I ask' }, { value: 'beyond', label: 'All but small tested fixes' }, { value: 'every', label: 'Every change' }] },
] as const
export type LeanKey = (typeof LEAN)[number]['key']
export type Lean = { [K in (typeof LEAN)[number] as K['key']]: K['options'][number]['value'] }
export const leanOf = (config: Config): Lean =>
  Object.fromEntries(
    LEAN.map(one => {
      const value = (config.lean as Record<string, unknown> | undefined)?.[one.key]
      return [one.key, one.options.some(option => option.value === value) ? value : one.options[0].value]
    }),
  ) as Lean
export const LEAN_SHIPPED = leanOf({})
export const ADMIN_MODES = [
  { value: 'each', label: 'Ask each time' },
  { value: 'work', label: 'Ask once per task' },
  { value: 'never', label: 'Never ask' },
] as const
export type AdminMode = (typeof ADMIN_MODES)[number]['value']
// `heavy`: when a task's new heavy command (a browser it drives, a build, a render) waits its turn: past each mark the Mac counts as
// busy, by its load average for each core and its memory in use; "never" runs every one at once, as before. A command is held only
// while a heavy command of the chat's work runs, so it waits on something that ends
export const HEAVY_MODES = [
  { value: 'busy', label: 'When the Mac is busy', load: 1.5, memory: 0.9 },
  { value: 'overloaded', label: 'When the Mac is very busy', load: 3, memory: 0.95 },
  { value: 'never', label: 'Never', load: Infinity, memory: Infinity },
] as const
export type HeavyMode = (typeof HEAVY_MODES)[number]
export const heavyModeOf = (config: Config): HeavyMode => HEAVY_MODES.find(one => one.value === config.heavy) ?? HEAVY_MODES[0]

export const parse = (text: string): Config => {
  try {
    const value = JSON.parse(text || '{}') as unknown
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Config) : {}
  } catch {
    // A config.json being edited is read as empty: everything as shipped
    return {}
  }
}
export const modelsOf = (config: Config): Models => {
  const named = (role: Role, shipped: string) => {
    const value = config.models?.[role]
    return typeof value === 'string' && MODEL_NAMES[value] ? value : shipped
  }
  return Object.fromEntries(ROLES.map(one => [one.key, named(one.key, one.shipped)])) as Models
}

// ---- The texts' places for the models ----

const name = (model: string) => MODEL_NAMES[model] ?? model
const noHaiku = (m: Models) => !Object.values(m).includes('haiku')
// A check of finished work runs on Opus or Fable, never weaker than what built it: most work's model, or heavy work's for work built
// on that, each only when it is Opus or Fable (Opus in its place otherwise), and so never on long legwork's
const STRONG = ['opus', 'fable']
// The models as the settings put them in force: Fable for every task makes it most work's model
export const modelsIn = (m: Models, lean: Lean = LEAN_SHIPPED): Models => (lean.fable === 'all' ? { ...m, work: 'fable', heavy: 'fable' } : m)
const checkWork = (m: Models) => (STRONG.includes(m.work) ? m.work : 'opus')
const checkHeavy = (m: Models) => (STRONG.includes(m.heavy) && m.heavy !== checkWork(m) ? m.heavy : '')
const checkers = (m: Models) =>
  `${name(checkWork(m))}, \`model: "${checkWork(m)}"\`${checkHeavy(m) ? `, or ${name(m.heavy)}, \`model: "${m.heavy}"\`, when what it checks was built on ${name(m.heavy)}` : ''}`
const notLegwork = (m: Models) => (m.legwork !== checkWork(m) && m.legwork !== checkHeavy(m) ? `, so never on ${name(m.legwork)}` : '')
const checkRule = (m: Models) => `Work that checks or verifies what was built runs on ${checkers(m)}: never on a model weaker than the one that built it${notLegwork(m)}.`
// The model a clearly stated job (a quick task, a task's last step) runs on: long legwork's, Fable when every task runs on it
export const clearModel = (m: Models, lean: Lean = LEAN_SHIPPED) => (lean.fable === 'all' ? 'fable' : m.legwork)
// The chat's rule for which model each piece of work runs on, from the settings
export const modelsRule = (m: Models, lean: Lean = LEAN_SHIPPED) => {
  const n = modelsIn(m, lean)
  const heavy =
    lean.fable === 'all'
      ? `Every task runs on ${name(n.work)}, \`model: "${n.work}"\`, unless {name} names another.`
      : lean.fable === 'named' && m.heavy === 'fable'
        ? `${name(m.heavy)}, \`model: "${m.heavy}"\`, runs a task only when {name} asks for it by name.`
        : `${name(m.heavy)}, \`model: "${m.heavy}"\`, is only for heavy or really complicated work.`
  const clear = clearModel(m, lean)
  return `${lean.fable === 'all' ? '' : `Most work runs on ${name(n.work)}, \`model: "${n.work}"\`. `}${clear === n.legwork ? `A clearly stated job, and long legwork such as indexing, runs on ${name(n.legwork)}, \`model: "${n.legwork}"\`.` : `Long legwork such as indexing runs on ${name(n.legwork)}, \`model: "${n.legwork}"\`.`} ${heavy} ${checkRule(n)}${noHaiku(n) ? ' Never Haiku.' : ''} A model is named by these aliases, never by an older version: an agent named an older model starts on its newest.`
}
// The chat's ways of handing work out, the cheapest and fastest measured (16 Nov: 108 jobs, 3 chat sizes and Opus or Fable chats):
// one command the chat runs itself; a clearly stated job as written instructions to a fresh task on the legwork model (Sonnet as
// shipped: least money in all 36 cases, fastest in 32, the other 4 within 9 s, on jobs of up to about 25 steps); judgment work to a
// fresh task on the work model; never a copy of the chat, which cost 1.4 to 5.9 times the Sonnet task and rereads the whole chat at
// every step
export const lanesRule = (m: Models, lean: Lean = LEAN_SHIPPED) => {
  return [
    '- A message that is one command that changes no file (a push, a fetch, or a look with git or gh, such as a status, a log, a pull request or a build\'s checks; `open` of a local server\'s page, a folder, or a picture, PDF, page or text; a `curl -q` status check of a local address): run it yourself with Bash and `run_in_background: true`, as a single command with no `&&`, `;`, `|` or `>`. Claudopus stops it at 10 minutes and gives you how it ended and its last lines; tell {name} from that. Show a local server\'s page in the browser pane yourself with its `preview_start` and a `url` (http://localhost:3000). Anything else goes to a task, quick or full, as the next two lines say: a script, a deploy, a commit, a merge or a pull, anything that edits files, takes more than one step, needs its output read to decide the next step, or may ask for a password.',
    `- A job you can state clearly in a few paragraphs, with no judgment left to make (a change you can describe exactly, a push and a look at the build, a merge, a look-up, a chain of commands): write one line saying what you are now doing about it, and in the same turn start a quick task, the Agent tool with \`subagent_type: "claudopus:quick"\` and \`model: "${clearModel(m, lean)}"\`, which Claudopus keeps whatever model is named; when {name} names a model for the job, start it as a full task on that model instead. Its instructions say what to do, where, what done looks like, and what it needs from this talk, written out; name files rather than copy them in. Then stop; do not wait for it.`,
    `- For every other message, write one line saying what you are now doing about it, and in the same turn start a fresh task: the Agent tool with \`subagent_type: "claudopus:task"\`, the task's instructions as the prompt, and \`model\` as the next rule says. A task that needs a connector, a skill or the browser is started with \`subagent_type: "general-purpose"\` instead. Then stop; do not wait for it.`,
    '- Never start a copy of this chat (`subagent_type: "fork"`): it rereads the whole chat at every step, so it costs several times a fresh task and runs no faster. Claudopus refuses one.',
  ].join('\n')
}
// When a second agent looks for faults, from the settings
const secondRule = (lean: Lean) =>
  lean.second === 'every'
    ? '- Every change gets the second agent before you report; only a lookup that changes nothing goes without, and the report says nobody else checked it.'
    : lean.second === 'asked'
      ? '- No second agent looks unless {name} asks for one; the report says nobody else checked it.'
      : '- A lookup, or a small fix in one area that changes nothing beyond the fault and has a test that fails without it and passes with it, needs no second agent; the report says nobody else checked it.'
// The same said short, as the chat is reminded when it tried to copy itself or named no model
export const modelsShort = (m: Models, lean: Lean = LEAN_SHIPPED) => `"${m.work}" for most work, "${clearModel(m, lean)}" for a clearly stated job (subagent_type "claudopus:quick"), "${m.legwork}" for long legwork, "${m.heavy}" only for heavy or really complicated work, ${checkHeavy(m) ? `"${checkWork(m)}" or "${m.heavy}"` : `"${checkWork(m)}"`} for checking what was built, never weaker than what built it`
// An own copy of the chat's rules made under 0.2.201 to 0.2.205 opens with `{way}`, where those versions said who does the work, and
// lacks the line they told with the lanes: both are filled in as they read before
const OWN_AGENT =
  '- A request that can be done on its own gets its own agent right away, so it never waits behind another task; several unrelated requests in one message get one agent each, started together. A fault, a question or a new request is not part of a running task just because it shares a topic, code or card with it, or may have been caused by it. When in doubt, give it its own agent.'
const WAY = 'This chat changes no file in its own thread, and runs a command only as the rules below allow: every task runs in a background agent, and this thread talks with {name} and reads.'
export const fillModels = (given: string, m: Models, lean: Lean = LEAN_SHIPPED) => {
  const n = modelsIn(m, lean)
  const text = given.includes('{way}') ? given.replace(/\{way\}/g, WAY).replace('{lanes}', `${OWN_AGENT}\n{lanes}`) : given
  return text
    .replace(/\{models\}/g, modelsRule(m, lean))
    .replace(/\{lanes\}/g, lanesRule(m, lean))
    .replace(/\{second\}/g, secondRule(lean))
    .replace(/\{helpers\}/g, `${name(n.legwork)}, \`model: "${n.legwork}"\`${noHaiku(n) ? ', never Haiku' : ''}, and never on an older model`)
    .replace(/\{checker\}/g, `${checkers(n)}: never on a model weaker than the one that built what it checks${notLegwork(n)}`)
}

// ---- The principles as the About tab lists them ----

// Each `## ` part of a rules file with its numbered or bulleted lines, the marks taken off
export const sectionsOf = (text: string) =>
  text
    .split(/^## /m)
    .slice(1)
    .map(part => {
      const [head = '', ...rest] = part.split('\n')
      const lines = rest.map(line => /^(?:\d+\.|[-*])\s+(.*)$/.exec(line.trim())?.[1]).filter((line): line is string => Boolean(line))
      return { title: head.trim(), lines }
    })
    .filter(part => part.lines.length)

// ---- Acts: in ./register, beside the other calls on the engine ----

// How often the look runs, as Config offers it; 0 is only when asked
export const LOOK_CHOICES = [
  { value: '1', label: 'Every hour' },
  { value: '6', label: 'Every 6 hours' },
  { value: '24', label: 'Once a day' },
  { value: '168', label: 'Once a week' },
  { value: '0', label: 'Only when I ask' },
] as const
// How often the look runs, said after "Claudopus looks"
export const lookSaid = (value: string) => (value === '0' ? 'only when you press Check now' : (LOOK_CHOICES.find(one => one.value === value)?.label ?? 'Every hour').replace(/^./, c => c.toLowerCase()))
// Whether version a is newer than version b, by their numbers
export const isNewer = (a: string, b: string) => {
  const parts = (v: string) => v.split('.').map(n => Number.parseInt(n, 10) || 0)
  const [x, y] = [parts(a), parts(b)]
  for (let n = 0; n < Math.max(x.length, y.length); n += 1) if ((x[n] ?? 0) !== (y[n] ?? 0)) return (x[n] ?? 0) > (y[n] ?? 0)
  return false
}
// When a task ends: one choice, written as the two keys `sound` and `notifications`, each on as shipped
export const ALERTS = [
  { value: 'both', label: 'Sound and notification', sound: true, notifications: true },
  { value: 'notice', label: 'Notification only', sound: false, notifications: true },
  { value: 'sound', label: 'Sound only', sound: true, notifications: false },
  { value: 'none', label: 'Nothing', sound: false, notifications: false },
] as const
export const alertsOf = (config: Config) => ALERTS.find(one => one.sound === (config.sound !== false) && one.notifications === (config.notifications !== false)) ?? ALERTS[0]
// Heavy tasks' choice that keeps Fable for when the person names it: `lean.fable` "named" in config.json
export const SAME = 'same'
// The models as Config shows them: Fable for every task (`lean.fable` "all", which only an older Config wrote) is Most tasks on Fable
export const shownModels = (config: Config): Models => {
  const [m, lean] = [modelsOf(config), leanOf(config)]
  return lean.fable === 'all' ? { ...m, work: 'fable', heavy: 'fable' } : lean.fable === 'named' && m.heavy === 'fable' ? { ...m, heavy: SAME } : m
}

// How long ago, in a few words
export const agoText = (ms: number) => (ms < 90_000 ? 'just now' : ms < 90 * 60_000 ? `${Math.round(ms / 60_000)}m ago` : ms < 36 * 3_600_000 ? `${Math.round(ms / 3_600_000)}h ago` : `${Math.round(ms / 86_400_000)}d ago`)

// ---- The tab ----

// The text being edited in the tab, and what the person has typed so far, so a redraw keeps it
export const editing = { key: '', draft: '' }
// Whether Config's More is open: closed as each chat loads
export const configMore = { isOpen: false }

export type ConfigShown = {
  // The version this chat runs, and Check for updates as it stands
  version: string
  check: { isChecking: boolean; said: string; isError: boolean; isOut?: boolean }
  // Where this chat's copy loads from, in words, and when the last look was and what it saw
  updates?: { where: string; lookedAt: number; seen: string; now: number }
  // Where updating stands, drawn by the mod as the panel's header box, with its presses: shown under Check now
  updateBox?: JSX.Element | null
  texts: { text: Text; isOwn: boolean; isStale: boolean; path: string; body: string }[]; config: Config; failed: string
  // Admin commands: what is in force, a "work" or "never" in config.json that no press here sealed, the commands always allowed
  // (and how many in the file carry no seal of this Mac's), and whether this chat is reached from another device
  gate: { mode: AdminMode; unsealed: string; allowed: { host: string; command: string }[]; unsealedAllowed: number; isAfar: boolean; isLinux?: boolean }
}
export type ConfigActs = {
  edit: (text: Text, body: string) => void
  open: (text: Text) => void
  save: (text: Text, body: string) => void
  cancel: () => void
  putBack: (text: Text) => void
  set: (key: keyof Config, value: unknown, role?: Role | LeanKey) => void
  model: (role: Role, value: string) => void
  alerts: (value: (typeof ALERTS)[number]['value']) => void
  more: (isOpen: boolean) => void
  check: () => void
  lookEvery: (hours: number) => void
  gateMode: (mode: AdminMode) => void
  gateRemove: (host: string, command: string) => void
  // Open the memory folder: Finder on the Mac the chat runs on, a tab of the panel in a terminal or over ssh
  memory: (surface: string) => void
}
type Band = (ui: Ui, key: string, name: string, side: string, body: JSX.Element) => JSX.Element
const SEGMENT = '#80808050'
const FILL = '#80808024'

export function configView(ui: Ui, shown: ConfigShown, acts: ConfigActs, band: Band, presses: number, memory: string) {
  const { Box, Button, Input, Select, Text } = ui
  const { config } = shown
  const lean = leanOf(config)
  const reset = (key: string, onPress: () => void) => <Button key={`${key}-back-${presses}`} label="Reset" plain dimColor onPress={onPress} />
  // One setting: its name and what it does on the left, its control on the right, and Reset beside it once it differs from what shipped
  const item = (key: string, label: string, what: string, control: JSX.Element | null, isChanged: boolean, onReset: () => void, below: JSX.Element | null = null) => (
    <Box key={key} flexDirection="column" gap={1} flexShrink={0}>
      <Box flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold wrap="wrap">{label}</Text>
          <Text dimColor wrap="wrap">{what}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
          {isChanged ? reset(key, onReset) : null}
          {control}
        </Box>
      </Box>
      {below}
    </Box>
  )
  // On and Off side by side, the one in force filled. `agents`, `taskColours` and `replyLinks` are on as shipped, so Off is written as
  // false and On takes the key out; `askPictures` is off as shipped, so On is written as true and Off takes the key out
  const onOff = (key: 'agents' | 'askPictures' | 'taskColours' | 'replyLinks') => {
    const isShippedOn = key === 'agents' || key === 'taskColours' || key === 'replyLinks'
    const isOn = isShippedOn ? config[key] !== false : config[key] === true
    const setTo = (value: boolean) => (value === isShippedOn ? undefined : value)
    return (
      // The terminal has no fill to mark the one in force: there it is a filled dot before it, an empty one before the other
      'isTerminal' in ui ? (
        <Box key={`config-${key}-switch`} flexDirection="row" flexShrink={0} gap={2} height={1}>
          {[true, false].map(value =>
            isOn === value ? (
              <Text key={`config-${key}-${value ? 'on' : 'off'}`} bold>{`● ${value ? 'On' : 'Off'}`}</Text>
            ) : (
              <Button key={`config-${key}-${value ? 'on' : 'off'}-${presses}`} label={`○ ${value ? 'On' : 'Off'}`} plain dimColor onPress={() => acts.set(key, setTo(value))} />
            ),
          )}
        </Box>
      ) :
      <Box key={`config-${key}-switch`} flexDirection="row" flexShrink={0} backgroundColor={FILL} height={1}>
        {[true, false].map(value => (
          <Box key={`config-${key}-${value ? 'on' : 'off'}`} width={5} height={1} justifyContent="center" alignItems="center" flexShrink={0} backgroundColor={isOn === value ? SEGMENT : undefined}>
            {isOn === value ? <Text bold>{value ? 'On' : 'Off'}</Text> : <Button key={`config-${key}-${value ? 'on' : 'off'}-${presses}`} label={value ? 'On' : 'Off'} plain dimColor onPress={() => acts.set(key, setTo(value))} />}
          </Box>
        ))}
      </Box>
    )
  }
  const choices = Object.entries(MODEL_NAMES).map(([value, label]) => ({ value, label }))
  const shownM = shownModels(config)
  const alerts = alertsOf(config)
  // Edit opens the text in the tab; Open file, beside Cancel there, opens the person's own copy in their editor instead
  const textItem = ({ text, isOwn, isStale, body }: ConfigShown['texts'][number]) => {
    const isEditing = editing.key === text.key
    return item(
      `config-text-${text.key}`,
      text.name,
      `${text.what}${isOwn ? (isStale ? ' You changed it, and an update since added new parts. Reset brings them in.' : ' You changed it.') : ''}`,
      isEditing ? null : <Button key={`config-text-${text.key}-edit-${presses}`} label="Edit" onPress={() => acts.edit(text, body)} />,
      isOwn && !isEditing,
      () => acts.putBack(text),
      isEditing ? (
        <Box flexDirection="column" gap={1} flexShrink={0}>
          <Input key={`config-text-${text.key}-input`} value={editing.draft} rows={16} submitLabel="Save" autoFocus onInput={value => void (editing.draft = value)} onSubmit={value => acts.save(text, value)} />
          <Box flexDirection="row" gap={2} justifyContent="flex-end" flexShrink={0}>
            <Button key={`config-text-${text.key}-open-${presses}`} label="Open file" plain dimColor onPress={() => acts.open(text)} />
            <Button key={`config-text-${text.key}-cancel-${presses}`} label="Cancel" plain dimColor onPress={acts.cancel} />
          </Box>
        </Box>
      ) : null,
    )
  }
  const [principles, ...rules] = shown.texts
  const modelItem = (role: Role, label: string, what: string, options: { value: string; label: string }[]) => {
    const shipped = ROLES.find(one => one.key === role)?.shipped ?? ''
    return item(
      `config-model-${role}`,
      label,
      what,
      <Select key={`config-model-${role}-pick`} options={options} value={shownM[role]} onSelect={value => acts.model(role, value)} />,
      shownM[role] !== shipped,
      () => acts.model(role, shipped),
    )
  }
  const second = LEAN.find(one => one.key === 'second') ?? LEAN[1]
  // Updates: the version on the band, and what the last look found as the line's name
  const looked = shown.updates?.lookedAt ?? 0
  const seen = shown.updates?.seen ?? ''
  const isOut = Boolean(seen && shown.version && isNewer(seen, shown.version) && seen !== config.skipVersion)
  const lookValue = config.updates === false ? '0' : String(LOOK_CHOICES.some(one => one.value === String(config.updateEvery)) ? config.updateEvery : 1)
  const gate = shown.gate
  const notOurs = gate.unsealedAllowed ? ` ${gate.unsealedAllowed} ${gate.allowed.length ? 'more ' : ''}in the file ${gate.unsealedAllowed === 1 ? "wasn't added here, so it allows" : "weren't added here, so they allow"} nothing.` : ''
  const isMore = configMore.isOpen || rules.some(one => editing.key === one.text.key)
  return (
    <Box key="config" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="config-head" flexDirection="column" paddingX={2} flexShrink={0}>
        <Text dimColor wrap="wrap">Changes reach new chats and new tasks. Reset puts one back to the default.</Text>
      </Box>
      {band(
        ui,
        'config-you',
        'You',
        '',
        <Box flexDirection="column" gap={1}>
          {item(
            'config-name',
            'Your name',
            'What the chat and Claude call you.',
            <Box width={22} flexShrink={0}>
              <Input key="config-name-input" value={typeof config.name === 'string' ? config.name : ''} placeholder="Not set" submitLabel="Save" onSubmit={value => acts.set('name', value.trim() || undefined)} />
            </Box>,
            Boolean(config.name),
            () => acts.set('name', undefined),
          )}
          {principles ? textItem(principles) : null}
          {item(
            'config-alerts',
            'When a task ends',
            'How you hear and see that a task is done, stopped, failed or needs you.',
            <Select key="config-alerts-pick" options={ALERTS.map(one => ({ value: one.value, label: one.label }))} value={alerts.value} onSelect={value => acts.alerts(value as (typeof ALERTS)[number]['value'])} />,
            alerts.value !== ALERTS[0].value,
            () => acts.alerts(ALERTS[0].value),
          )}
          {item(
            'config-memory',
            'Memory',
            'What Claudopus remembers for you, as plain files: your words in each chat, notes on each topic, and every result.',
            <Button key={`config-memory-open-${presses}`} label="Open" onPress={press => acts.memory(press.surface)} />,
            false,
            () => undefined,
          )}
          {item('config-ask-pictures', 'Pictures of questions', "When a task asks you something with buttons, Claudopus draws the question and each button in one picture, opens it on your screen, and shows it with the question on the card and in the chat.", onOff('askPictures'), config.askPictures !== undefined, () => acts.set('askPictures', undefined))}
          {item('config-task-colours', 'Task colours', "Each chat reply about a task sits in a box of that task's colour, headed by its name and Reply. Its card in the panel gets the same colour dot.", onOff('taskColours'), config.taskColours !== undefined, () => acts.set('taskColours', undefined))}
          {item('config-reply-links', 'Links at the end', 'Each chat reply ends with a list of the links it gave, each with where it goes. A task\'s Details lists every link the chat gave about it.', onOff('replyLinks'), config.replyLinks !== undefined, () => acts.set('replyLinks', undefined))}
        </Box>,
      )}
      {band(
        ui,
        'config-work',
        'Tasks',
        '',
        <Box flexDirection="column" gap={1}>
          {modelItem('work', 'Most tasks', 'The model most tasks run on.', choices)}
          {modelItem('legwork', 'Simple tasks', 'Jobs the chat can state exactly, and helpers that only search and read.', choices)}
          {modelItem('heavy', 'Heavy tasks', 'Only heavy or really complicated work. Same as most tasks keeps Fable 5.2 for when you name it.', [...choices, { value: SAME, label: 'Same as most tasks' }])}
          {item(
            `config-lean-${second.key}`,
            second.name,
            "A helper that didn't build the change looks for faults before you see it.",
            <Select key={`config-lean-${second.key}-pick`} options={second.options.map(option => ({ value: option.value, label: option.label }))} value={lean[second.key]} onSelect={value => acts.set('lean', value === LEAN_SHIPPED[second.key] ? undefined : value, second.key)} />,
            lean[second.key] !== LEAN_SHIPPED[second.key],
            () => acts.set('lean', undefined, second.key),
          )}
        </Box>,
      )}
      {band(
        ui,
        'config-updates',
        'Updates',
        shown.version ? `This chat runs v${shown.version}` : '',
        <Box flexDirection="column" gap={1}>
          {item(
            'config-check',
            // A newer version put off with Not now has nothing to press here, so it is not said to be out
            !looked ? 'Not checked yet' : !isOut ? 'Up to date' : shown.updateBox || shown.check.isChecking ? `v${seen} is out` : `You put off v${seen}`,
            [shown.updates?.where ? `It runs from ${shown.updates.where}.` : '', looked ? `Last checked ${agoText((shown.updates?.now ?? 0) - looked)}.` : '', `Claudopus looks ${lookSaid(lookValue)}.`].filter(Boolean).join(' '),
            shown.check.isChecking ? (
              <Text key="config-check-checking" dimColor>Checking…</Text>
            ) : (
              <Button key={`config-check-${presses}`} label="Check now" onPress={acts.check} />
            ),
            false,
            () => undefined,
            // What Check now found, unless that version was skipped since (then the Skipped line says it) or it is a newer version, which the
            // update box below says; then where updating stands, with its presses, right here
            <Box key="config-check-below" flexDirection="column" gap={1} flexShrink={0}>
              {shown.check.said && !(shown.check.isOut && shown.updateBox) && !(config.skipVersion && seen === config.skipVersion) ? (
                <Text key="config-check-said" color={shown.check.isError ? 'error' : undefined} wrap="wrap">{shown.check.said}</Text>
              ) : null}
              {shown.updateBox ?? null}
            </Box>,
          )}
          {typeof config.skipVersion === 'string' && config.skipVersion
            ? item('config-skip', 'Skipped version', `You skipped v${config.skipVersion}. Claudopus shows only versions newer than it.`, <Button key={`config-skip-back-${presses}`} label="Show it again" plain dimColor onPress={() => acts.set('skipVersion', undefined)} />, false, () => undefined)
            : null}
        </Box>,
      )}
      {band(
        ui,
        'config-more',
        'More',
        '',
        <Box flexDirection="column" gap={1}>
          <Box key="config-more-head" flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              <Text dimColor wrap="wrap">{isMore ? 'Settings you rarely change.' : 'Update checks, busy Mac, admin commands, chat and task rules, turning tasks off.'}</Text>
            </Box>
            {isMore ? <Button key={`config-more-hide-${presses}`} label="Hide" plain dimColor onPress={() => acts.more(false)} /> : <Button key={`config-more-show-${presses}`} label="Show" onPress={() => acts.more(true)} />}
          </Box>
          {isMore ? (
            <Box key="config-more-body" flexDirection="column" gap={1}>
              {item(
                'config-look',
                'Update checks',
                'How often Claudopus looks on claudopus.ai for a newer version. Nothing installs until you choose to.',
                <Select key="config-look-pick" options={[...LOOK_CHOICES]} value={lookValue} onSelect={value => acts.lookEvery(Number(value))} />,
                lookValue !== '1',
                () => acts.lookEvery(1),
              )}
              {item(
                'config-heavy',
                'Busy Mac',
                "When the Mac is busy, a task's browser, build or render waits for another to end, at most 15 minutes.",
                <Select key="config-heavy-pick" options={HEAVY_MODES.map(one => ({ value: one.value, label: one.label }))} value={heavyModeOf(config).value} onSelect={value => acts.set('heavy', value === HEAVY_MODES[0].value ? undefined : value)} />,
                heavyModeOf(config).value !== HEAVY_MODES[0].value,
                () => acts.set('heavy', undefined),
              )}
              {item(
                'config-admin-mode',
                'Admin commands',
                `Claude runs one only after you allow it on the task's card, and each asks for your Mac password, which Claudopus never saves. ${gate.allowed.length ? 'These run without asking, exactly as written and only on their Mac.' : 'None is always allowed yet. Press Always allow this command on a card to add one.'}${notOurs}${gate.unsealed ? ` Your settings file says "${gate.unsealed}", but you didn't choose it here, so every command asks.` : ''}`,
                <Select key="config-admin-mode-pick" options={ADMIN_MODES.map(one => ({ value: one.value, label: one.label }))} value={gate.mode} onSelect={value => acts.gateMode(value as AdminMode)} />,
                gate.mode !== 'each' || Boolean(gate.unsealed),
                () => acts.gateMode('each'),
                gate.allowed.length ? (
                  <Box key="config-admin-list" flexDirection="column" gap={1} flexShrink={0}>
                    {gate.allowed.map((one, n) => (
                      <Box key={`config-admin-allowed-${n}`} flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
                        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={FILL} paddingLeft={2}>
                          <Text dimColor wrap="wrap">{one.host === 'here' ? 'This Mac' : one.host}</Text>
                          <Text mono wrap="wrap">{one.command}</Text>
                        </Box>
                        <Button key={`config-admin-remove-${n}-${presses}`} label="Remove" plain dimColor onPress={() => acts.gateRemove(one.host, one.command)} />
                      </Box>
                    ))}
                  </Box>
                ) : null,
              )}
              {rules.map(textItem)}
              {item('config-agents', 'Background tasks', "Each message starts a task that Claude does in the background. Off: the chat does everything itself, from the next chat on.", onOff('agents'), config.agents !== undefined, () => acts.set('agents', undefined))}
              <Text key="config-where" dimColor wrap="wrap">{`Your changes are kept in ${memory.replace(/^\/Users\/[^/]+|^\/home\/[^/]+/, '~')}, so an update never undoes them.`}</Text>
            </Box>
          ) : null}
        </Box>,
      )}
      {shown.failed ? (
        <Box key="config-failed" paddingX={2} flexShrink={0}>
          <Text color="error" wrap="wrap">{shown.failed}</Text>
        </Box>
      ) : null}
    </Box>
  )
}
