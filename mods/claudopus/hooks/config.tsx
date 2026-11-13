// Config: everything a person can set, in one place. Three texts ship with the mod (the principles every chat and piece of work
// carries, the chat's rules, the rules every piece of work follows); a copy of one at the same path under the memory folder,
// ~/.claude/claudopus, is the person's own and is used in its place, so an update of the mod, which replaces its own folder, never
// touches it. The settings are config.json in the same folder. Put back removes the person's copy or key, kept beside it as .old
import type { ElementTable } from 'claude-code'

type Ui = ElementTable

export type Text = { key: string; name: string; what: string; path: string }
export const TEXTS: Text[] = [
  { key: 'principles', name: 'Principles', what: 'How you work: every chat and every piece of work carries them.', path: 'rules/CLAUDE.md' },
  { key: 'chat', name: "The chat's rules", what: 'How a chat hands each of your messages to background work.', path: 'roles/chat.md' },
  { key: 'work', name: 'Work rules', what: 'What every piece of background work is told as it starts.', path: 'roles/work.md' },
]

// ---- Settings, config.json ----

export const ROLES = [
  { key: 'work', name: 'Most work', shipped: 'opus' },
  { key: 'legwork', name: 'Long legwork', shipped: 'sonnet' },
  { key: 'heavy', name: 'Heavy work', shipped: 'fable' },
] as const
export type Role = (typeof ROLES)[number]['key']
export type Models = Record<Role, string>
export const MODEL_NAMES: Record<string, string> = { opus: 'Opus 5.5', sonnet: 'Sonnet 5.5', fable: 'Fable 5.2', haiku: 'Haiku 5.5' }
export type Config = { name?: string; agents?: boolean; sound?: boolean; notifications?: boolean; updates?: boolean; models?: Partial<Models> }

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
// A check of finished work runs on a model at least as strong as the one that built it: most work's, or heavy work's for work built
// on that, and never long legwork's unless legwork runs on one of those
const checkers = (m: Models) => `${name(m.work)}, \`model: "${m.work}"\`, or ${name(m.heavy)}, \`model: "${m.heavy}"\`, when what it checks was built on ${name(m.heavy)}`
const notLegwork = (m: Models) => (m.legwork !== m.work && m.legwork !== m.heavy ? `, so never on ${name(m.legwork)}` : '')
const checkRule = (m: Models) => `Work that checks or verifies what was built runs on ${checkers(m)}: never on a model weaker than the one that built it${notLegwork(m)}.`
// The chat's rule for which model each piece of work runs on, from the settings
export const modelsRule = (m: Models) =>
  `Most work runs on ${name(m.work)}, \`model: "${m.work}"\`. Long legwork such as indexing runs on ${name(m.legwork)}, \`model: "${m.legwork}"\`. ${name(m.heavy)}, \`model: "${m.heavy}"\`, is only for heavy or really complicated work. ${checkRule(m)}${noHaiku(m) ? ' Never Haiku.' : ''}`
// The same said short, as the chat is reminded when it tried to copy itself
export const modelsShort = (m: Models) => `"${m.work}" for most work, "${m.legwork}" for long legwork, "${m.heavy}" only for heavy or really complicated work, "${m.work}" or "${m.heavy}" for checking what was built, never weaker than what built it`
export const fillModels = (text: string, m: Models) =>
  text
    .replace(/\{models\}/g, modelsRule(m))
    .replace(/\{helpers\}/g, `${name(m.legwork)}${noHaiku(m) ? ', never Haiku' : ''}`)
    .replace(/\{checker\}/g, `${checkers(m)}: never on a model weaker than the one that built what it checks${notLegwork(m)}`)

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

// ---- The tab ----

// The text being edited in the tab, and what the person has typed so far, so a redraw keeps it
export const editing = { key: '', draft: '' }

export type ConfigShown = { texts: { text: Text; isOwn: boolean; isStale: boolean; path: string; body: string }[]; config: Config; failed: string }
export type ConfigActs = {
  edit: (text: Text, body: string) => void
  open: (text: Text) => void
  save: (text: Text, body: string) => void
  cancel: () => void
  putBack: (text: Text) => void
  set: (key: keyof Config, value: unknown, role?: Role) => void
}
type Band = (ui: Ui, key: string, name: string, side: string, body: JSX.Element) => JSX.Element
const SEGMENT = '#80808050'
const FILL = '#80808024'

export function configView(ui: Ui, shown: ConfigShown, acts: ConfigActs, band: Band, presses: number, memory: string) {
  const { Box, Button, Input, Select, Text } = ui
  const { config } = shown
  const models = modelsOf(config)
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
  // On and Off side by side, the one in force filled
  const onOff = (key: 'agents' | 'sound' | 'notifications' | 'updates') => {
    const isOn = config[key] !== false
    return (
      <Box key={`config-${key}-switch`} flexDirection="row" flexShrink={0} backgroundColor={FILL} height={1}>
        {[true, false].map(value => (
          <Box key={`config-${key}-${value ? 'on' : 'off'}`} width={5} height={1} justifyContent="center" alignItems="center" flexShrink={0} backgroundColor={isOn === value ? SEGMENT : undefined}>
            {isOn === value ? <Text bold>{value ? 'On' : 'Off'}</Text> : <Button key={`config-${key}-${value ? 'on' : 'off'}-${presses}`} label={value ? 'On' : 'Off'} plain dimColor onPress={() => acts.set(key, value ? undefined : false)} />}
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
          'What the chat and the work call you. Read when a chat starts.',
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
        'Work',
        '',
        <Box flexDirection="column" gap={1}>
          {toggle('agents', 'Background work', 'Each message is handed to work in the background. Off, every chat does its own work. Read when a chat starts.')}
          {ROLES.map(one =>
            item(
              `config-model-${one.key}`,
              one.name,
              one.key === 'work' ? 'The model most work runs on.' : one.key === 'legwork' ? 'Long, simple work such as indexing. Helpers run on it too, but a check of finished work never does.' : 'Only heavy or really complicated work.',
              <Select key={`config-model-${one.key}-pick`} options={choices} value={models[one.key]} onSelect={value => acts.set('models', value === one.shipped ? undefined : value, one.key)} />,
              models[one.key] !== one.shipped,
              () => acts.set('models', undefined, one.key),
            ),
          )}
        </Box>,
      )}
      {band(
        ui,
        'config-ready',
        'When work is ready',
        '',
        <Box flexDirection="column" gap={1}>
          {toggle('sound', 'Sound', 'A short chime.')}
          {toggle('notifications', 'Notifications', 'A notification naming the work, also when it stopped or failed.')}
        </Box>,
      )}
      {band(
        ui,
        'config-updates',
        'Updates',
        '',
        toggle(
          'updates',
          'Automatic updates',
          'Every few hours Claudopus installs its newest release, and chats you start after that use it. Off, it stays on the version you have until you update it yourself.',
        ),
      )}
      {shown.failed ? (
        <Box key="config-failed" paddingX={2} flexShrink={0}>
          <Text color="error" wrap="wrap">{shown.failed}</Text>
        </Box>
      ) : null}
    </Box>
  )
}
