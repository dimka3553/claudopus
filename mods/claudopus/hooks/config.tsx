// Config: everything a person can set, in one place. Three texts ship with the mod (the principles every chat and piece of work
// carries, the chat's rules, the rules every piece of work follows); a copy of one at the same path under the memory folder,
// ~/.claude/claudopus, is the person's own and is used in its place, so an update of the mod, which replaces its own folder, never
// touches it. The settings are config.json in the same folder. Put back removes the person's copy or key, kept beside it as .old
import type { ElementTable } from 'claude-code'

type Ui = ElementTable

export type Text = { key: string; name: string; what: string; path: string }
export const TEXTS: Text[] = [
  { key: 'principles', name: 'Principles', what: 'How you work: every chat and every background task follows them.', path: 'rules/CLAUDE.md' },
  { key: 'chat', name: "The chat's rules", what: 'How a chat starts a background task for each of your messages.', path: 'roles/chat.md' },
  { key: 'work', name: 'Task rules', what: 'What Claudopus tells Claude at the start of every background task.', path: 'roles/work.md' },
]

// ---- Settings, config.json ----

export const ROLES = [
  { key: 'work', name: 'Most tasks', shipped: 'opus' },
  { key: 'legwork', name: 'Clear jobs, searching and reading', shipped: 'sonnet' },
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
export type Config = { name?: string; agents?: boolean; sound?: boolean; notifications?: boolean; updates?: boolean; updateEvery?: number; skipVersion?: string; models?: Partial<Models>; lean?: Partial<Lean>; admin?: string; adminSealed?: string; adminPassword?: string }

// When Fable runs and when a second agent checks, each a choice in Config's Tasks band, the shipped one first. `lean` in config.json
// holds only the ones changed; a key of a choice that was taken out (small, quick, start, checker, readers) is read as nothing. How a job
// is handed out has no choice: measured (16 Nov, 108 jobs), written instructions to a fresh task cost least and ran as fast or faster
// than a copy of the chat at every chat size and model, and Sonnet least of all for a clearly stated job
export const LEAN = [
  { key: 'fable', name: 'When to use Fable 5.2', what: 'Which tasks run on Fable 5.2: heavy or really complicated work, every task, or only a task you ask to run on it.', options: [{ value: 'heavy', label: 'Heavy work' }, { value: 'all', label: 'Every task' }, { value: 'named', label: 'Only when I name it' }] },
  { key: 'second', name: 'Second check', what: 'When a second agent, one that did not build it, looks for faults before you see the result. As shipped it looks at every change except a lookup or a small fix that a test proves.', options: [{ value: 'beyond', label: 'All but small tested fixes' }, { value: 'every', label: 'On every change' }, { value: 'asked', label: 'Only when I ask' }] },
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
    '- A message that is one command that changes no file (a push, a fetch, or a look with git or gh, such as a status, a log, a pull request or a build\'s checks): run it yourself with Bash, as a single command with no `&&`, `;`, `|` or `>`. Claudopus starts it in the background with a 10-minute limit and gives you how it ended and its last lines; tell {name} from that. Anything else goes to a task, quick or full, as the next two lines say: a script, a deploy, a commit, a merge or a pull, anything that edits files, takes more than one step, needs its output read to decide the next step, or may ask for a password.',
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
export const fillModels = (text: string, m: Models, lean: Lean = LEAN_SHIPPED) => {
  const n = modelsIn(m, lean)
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
// How long ago, in a few words
export const agoText = (ms: number) => (ms < 90_000 ? 'just now' : ms < 90 * 60_000 ? `${Math.round(ms / 60_000)} min ago` : ms < 36 * 3_600_000 ? `${Math.round(ms / 3_600_000)} h ago` : `${Math.round(ms / 86_400_000)} days ago`)

// ---- The tab ----

// The text being edited in the tab, and what the person has typed so far, so a redraw keeps it
export const editing = { key: '', draft: '' }

export type ConfigShown = {
  // The version this chat runs, and Check for updates as it stands
  version: string
  check: { isChecking: boolean; said: string; isError: boolean }
  // Where this chat's copy loads from, in words, and when the last look was and what it saw
  updates?: { where: string; lookedAt: number; seen: string; now: number }
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
  check: () => void
  lookEvery: (hours: number) => void
  gateMode: (mode: AdminMode) => void
  gateRemove: (host: string, command: string) => void
}
type Band = (ui: Ui, key: string, name: string, side: string, body: JSX.Element) => JSX.Element
const SEGMENT = '#80808050'
const FILL = '#80808024'

export function configView(ui: Ui, shown: ConfigShown, acts: ConfigActs, band: Band, presses: number, memory: string) {
  const { Box, Button, Input, Select, Text } = ui
  const { config } = shown
  const models = modelsOf(config)
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
  // On and Off side by side, the one in force filled; each is on as shipped, so Off is written as false and On takes the key out
  const setTo = (_key: 'agents' | 'sound' | 'notifications' | 'updates', value: boolean) => (value ? undefined : false)
  const onOff = (key: 'agents' | 'sound' | 'notifications' | 'updates') => {
    const isOn = config[key] !== false
    return (
      // The terminal has no fill to mark the one in force: there it is a filled dot before it, an empty one before the other
      'isTerminal' in ui ? (
        <Box key={`config-${key}-switch`} flexDirection="row" flexShrink={0} gap={2} height={1}>
          {[true, false].map(value =>
            isOn === value ? (
              <Text key={`config-${key}-${value ? 'on' : 'off'}`} bold>{`● ${value ? 'On' : 'Off'}`}</Text>
            ) : (
              <Button key={`config-${key}-${value ? 'on' : 'off'}-${presses}`} label={`○ ${value ? 'On' : 'Off'}`} plain dimColor onPress={() => acts.set(key, setTo(key, value))} />
            ),
          )}
        </Box>
      ) :
      <Box key={`config-${key}-switch`} flexDirection="row" flexShrink={0} backgroundColor={FILL} height={1}>
        {[true, false].map(value => (
          <Box key={`config-${key}-${value ? 'on' : 'off'}`} width={5} height={1} justifyContent="center" alignItems="center" flexShrink={0} backgroundColor={isOn === value ? SEGMENT : undefined}>
            {isOn === value ? <Text bold>{value ? 'On' : 'Off'}</Text> : <Button key={`config-${key}-${value ? 'on' : 'off'}-${presses}`} label={value ? 'On' : 'Off'} plain dimColor onPress={() => acts.set(key, setTo(key, value))} />}
          </Box>
        ))}
      </Box>
    )
  }
  const toggle = (key: 'agents' | 'sound' | 'notifications' | 'updates', label: string, what: string) => item(`config-${key}`, label, what, onOff(key), config[key] !== undefined, () => acts.set(key, undefined))
  const choices = Object.entries(MODEL_NAMES).map(([value, label]) => ({ value, label }))
  const textItem = ({ text, isOwn, isStale, body }: ConfigShown['texts'][number]) => {
    const isEditing = editing.key === text.key
    return item(
      `config-text-${text.key}`,
      text.name,
      `${text.what} ${isOwn ? (isStale ? 'Edited by you, before an update added parts yours lacks: Reset takes them in.' : 'Edited by you.') : 'As shipped.'}`,
      isEditing ? null : (
        <Box flexDirection="row" gap={2} flexShrink={0}>
          <Button key={`config-text-${text.key}-open-${presses}`} label="Open file" plain dimColor onPress={() => acts.open(text)} />
          <Button key={`config-text-${text.key}-edit-${presses}`} label="Edit" onPress={() => acts.edit(text, body)} />
        </Box>
      ),
      isOwn && !isEditing,
      () => acts.putBack(text),
      isEditing ? (
        <Box flexDirection="column" gap={1} flexShrink={0}>
          <Input key={`config-text-${text.key}-input`} value={editing.draft} rows={16} submitLabel="save" autoFocus onInput={value => void (editing.draft = value)} onSubmit={value => acts.save(text, value)} />
          <Box flexDirection="row" gap={2} justifyContent="flex-end" flexShrink={0}>
            <Button key={`config-text-${text.key}-cancel-${presses}`} label="Cancel" plain dimColor onPress={acts.cancel} />
          </Box>
        </Box>
      ) : null,
    )
  }
  return (
    <Box key="config" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="config-head" flexDirection="column" paddingX={2} flexShrink={0}>
        <Text dimColor wrap="wrap">{`Your changes are kept in ${memory.replace(/^\/Users\/[^/]+|^\/home\/[^/]+/, '~')}, so updating Claudopus never undoes them. Reset returns one to what shipped.`}</Text>
      </Box>
      {band(ui, 'config-texts', 'Rules', 'read at your next message', <Box flexDirection="column" gap={1}>{shown.texts.map(textItem)}</Box>)}
      {band(
        ui,
        'config-you',
        'You',
        '',
        item(
          'config-name',
          'Your name',
          'What the chat and Claude call you. Read when a chat starts.',
          <Box width={22} flexShrink={0}>
            <Input key="config-name-input" value={typeof config.name === 'string' ? config.name : ''} placeholder="the person" submitLabel="save" onSubmit={value => acts.set('name', value.trim() || undefined)} />
          </Box>,
          Boolean(config.name),
          () => acts.set('name', undefined),
        ),
      )}
      {band(
        ui,
        'config-work',
        'Tasks',
        '',
        <Box flexDirection="column" gap={1}>
          {toggle('agents', 'Background tasks', 'Each message starts a task that Claude does in the background. Off, every chat does the task itself. Read when a chat starts.')}
          {ROLES.map(one =>
            item(
              `config-model-${one.key}`,
              one.name,
              one.key === 'work' ? 'The model most tasks run on.' : one.key === 'legwork' ? 'Jobs the chat can state clearly (a described change, a push, a merge, a look-up), long searching and reading, and helpers that only read. For clearly stated jobs Sonnet was measured the cheapest and about the fastest; they run on Fable instead while every task runs on Fable. A check of a finished task never runs on it.' : 'Only heavy or really complicated work.',
              <Select key={`config-model-${one.key}-pick`} options={choices} value={models[one.key]} onSelect={value => acts.set('models', value === one.shipped ? undefined : value, one.key)} />,
              models[one.key] !== one.shipped,
              () => acts.set('models', undefined, one.key),
            ),
          )}
          {LEAN.map(one =>
            item(
              `config-lean-${one.key}`,
              one.name,
              one.what,
              <Select key={`config-lean-${one.key}-pick`} options={one.options.map(option => ({ value: option.value, label: option.label }))} value={lean[one.key]} onSelect={value => acts.set('lean', value === LEAN_SHIPPED[one.key] ? undefined : value, one.key)} />,
              lean[one.key] !== LEAN_SHIPPED[one.key],
              () => acts.set('lean', undefined, one.key),
            ),
          )}
        </Box>,
      )}
      {band(
        ui,
        'config-admin',
        'Admin commands',
        '',
        <Box flexDirection="column" gap={1}>
          {item(
            'config-admin-mode',
            'Ask before an admin command',
            `Claude runs a command as administrator only after you allow it on the task's card: each time, or once for a task and its helpers until it ends. With Never ask, Claudopus runs them without asking on the card. Whatever you choose, each one also asks for the admin password, which is never saved: macOS asks in its own box on this Mac's screen, and the panel asks over SSH, on Linux or from another device.${shown.gate.unsealed ? ` config.json says "${shown.gate.unsealed}", but it was not chosen here, so every command asks.` : ''}`,
            <Select key="config-admin-mode-pick" options={ADMIN_MODES.map(one => ({ value: one.value, label: one.label }))} value={shown.gate.mode} onSelect={value => acts.gateMode(value as AdminMode)} />,
            shown.gate.mode !== 'each' || Boolean(shown.gate.unsealed),
            () => acts.gateMode('each'),
          )}
          {item(
            'config-admin-allowed',
            'Always allowed',
            shown.gate.allowed.length
              ? `These run without asking, each only as written here and only on its Mac.${shown.gate.unsealedAllowed ? ` ${shown.gate.unsealedAllowed} more in the file ${shown.gate.unsealedAllowed === 1 ? 'was' : 'were'} not added by your press and ${shown.gate.unsealedAllowed === 1 ? 'allows' : 'allow'} nothing.` : ''}`
              : `None yet: Always allow this command on a card adds one.${shown.gate.unsealedAllowed ? ` ${shown.gate.unsealedAllowed} in the file ${shown.gate.unsealedAllowed === 1 ? 'was' : 'were'} not added by your press and ${shown.gate.unsealedAllowed === 1 ? 'allows' : 'allow'} nothing.` : ''}`,
            null,
            false,
            () => undefined,
            shown.gate.allowed.length ? (
              <Box key="config-admin-list" flexDirection="column" gap={1} flexShrink={0}>
                {shown.gate.allowed.map((one, n) => (
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
        </Box>,
      )}
      {band(
        ui,
        'config-ready',
        'When a task is done',
        '',
        <Box flexDirection="column" gap={1}>
          {toggle('sound', 'Sound', 'A short chime.')}
          {toggle('notifications', 'Notifications', 'A notification naming the task, also when it is stopped or fails.')}
        </Box>,
      )}
      {band(
        ui,
        'config-updates',
        'Updates',
        '',
        <Box flexDirection="column" gap={1}>
          {item(
            'config-look',
            'Look for new versions',
            'Reads the version page on claudopus.ai; the panel says when a newer one is out. Nothing downloads or installs until you press it.',
            <Select
              key="config-look-pick"
              options={[...LOOK_CHOICES]}
              value={config.updates === false ? '0' : String(LOOK_CHOICES.some(one => one.value === String(config.updateEvery)) ? config.updateEvery : 1)}
              onSelect={value => acts.lookEvery(Number(value))}
            />,
            config.updates === false || (config.updateEvery !== undefined && config.updateEvery !== 1),
            () => acts.lookEvery(1),
          )}
          {item(
            'config-check',
            shown.version ? `This chat runs v${shown.version}` : 'Check now',
            [
              shown.updates?.where ? `It loads from ${shown.updates.where}.` : '',
              shown.updates?.lookedAt ? `Last looked ${agoText(shown.updates.now - shown.updates.lookedAt)}${shown.updates.seen && !shown.check.said ? `: v${shown.updates.seen} is the newest out` : ''}.` : 'Not looked yet.',
            ]
              .filter(Boolean)
              .join(' '),
            shown.check.isChecking ? (
              <Text key="config-check-checking" dimColor>Checking…</Text>
            ) : (
              <Button key={`config-check-${presses}`} label="Check now" onPress={acts.check} />
            ),
            false,
            () => undefined,
            // What Check now found, unless that version was skipped since: then the Skipped line says it
            shown.check.said && !(config.skipVersion && shown.updates?.seen === config.skipVersion) ? (
              <Text key="config-check-said" color={shown.check.isError ? 'error' : undefined} wrap="wrap">{shown.check.said}</Text>
            ) : null,
          )}
          {typeof config.skipVersion === 'string' && config.skipVersion
            ? item('config-skip', 'Skipped', `You skipped v${config.skipVersion}: it and older ones stay quiet, and a newer one shows.`, <Button key={`config-skip-back-${presses}`} label="Show it again" plain dimColor onPress={() => acts.set('skipVersion', undefined)} />, false, () => undefined)
            : null}
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
