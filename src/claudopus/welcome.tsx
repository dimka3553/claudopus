// First run: the welcome at the top of the panel, and indexing old chats

// ---- First run: a welcome at the top of the panel, once, for someone the mod has never set up ----

// welcome.json in the memory folder: the session the welcome first showed in, and whether it still shows
type Welcome = { shownIn: string; isOpen: boolean }
let isWelcomeOpen = false
// Decided at a session's start: a new person (no index.md yet) gets the welcome, which stays through reloads of that session
// and is put away when the next session starts or a button on it is pressed; anyone already set up never sees it
const welcomeAt = (isNew: boolean, stored: Welcome | undefined, sessionId: string): Welcome | undefined => {
  if (isNew) return { shownIn: sessionId, isOpen: true }
  if (!stored?.isOpen) return stored
  return stored.shownIn === sessionId ? stored : { ...stored, isOpen: false }
}
const readWelcome = ($: EngineInterface) =>
  readOr($, `${dir}/welcome.json`)
    .then(text => (text ? (JSON.parse(text) as Welcome) : undefined))
    .catch(() => undefined)
const settleWelcome = async ($: EngineInterface, isNew: boolean, sessionId: string) => {
  const stored = await readWelcome($)
  const next = welcomeAt(isNew, stored, sessionId)
  if (next && JSON.stringify(next) !== JSON.stringify(stored)) await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify(next)}\n`)
  isWelcomeOpen = Boolean(next?.isOpen)
}
const closeWelcome = async ($: EngineInterface) => {
  isWelcomeOpen = false
  presses += 1
  const stored = await readWelcome($)
  await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify({ shownIn: stored?.shownIn ?? '', isOpen: false })}\n`)
  await redraw($)
}
// What the chat is sent when the person presses Index my old chats: the two onboarding steps the mod ships, then the subjects recorded
const indexAsk = (root: string) =>
  [
    'Index my old chats (pressed in the Claudopus panel).',
    `Run python3 "${root}/onboard/extract.py" "${dir}/onboard": it saves each past chat's messages under ${dir}/words and writes digests of them, one or more per project, into ${dir}/onboard.`,
    'If python3 is missing (macOS asks to install the Command Line Tools), say so with the command xcode-select --install and stop.',
    `Then for each digest file it wrote, have a helper follow ${root}/onboard/reader.md on it, writing its streams to ${dir}/onboard/streams/<the digest's file name>.`,
    'Last, record each stream found as a subject with the `update` tool (its name, folder, state and summary, and its section as the brief), and report the subjects found in a few lines.',
  ].join(' ')
const indexOldChats = async ($: EngineInterface) => {
  await closeWelcome($)
  await sendForPerson($, indexAsk($.plugin.root))
}
const welcomeCard = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="welcome" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Text bold wrap="wrap">Welcome to Claudopus</ui.Text>
    <ui.Text wrap="wrap">Each message you send in a chat goes to background work, and its card shows here while it runs.</ui.Text>
    <ui.Text wrap="wrap">Closed this panel? Type /claudopus to bring it back.</ui.Text>
    <ui.Text bold wrap="wrap">Bring in your old chats</ui.Text>
    <ui.Text wrap="wrap">Claudopus can read your past Claude Code chats on {thisMac()} into its memory, so it knows what you were working on. It runs as background work and takes a few minutes.</ui.Text>
    <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
      <ui.Button key={`welcome-index-${presses}`} label="Index my old chats" onPress={() => void indexOldChats($).catch(err => log($, `old chats not indexed: ${String(err)}`))} />
      <ui.Button key={`welcome-later-${presses}`} label="Not now" plain dimColor onPress={() => void closeWelcome($).catch(err => log($, `welcome not put away: ${String(err)}`))} />
    </ui.Box>
  </ui.Box>
)

