// The changelog: a tab About opens with every version's changes, and the screen a newer version shows over the whole panel with
// the changes the person did not have yet (the pure parts are in hooks/changelog.ts)

const CHANGELOG_PANE = 'changelog'
const CHANGELOG_TITLE = 'Changelog'
const CHANGELOG_PAGE = 'https://claudopus.ai/changelog.html'
// The mod's own copy of CHANGELOG.md, read once a load: it changes only with the mod
let changelogRead: Promise<Version[]> | undefined
const versionsLogged = ($: EngineInterface) => {
  changelogRead ??= readOr($, `${$.plugin.root}/CHANGELOG.md`).then(changelogOf)
  return changelogRead
}
const openChangelog = async ($: EngineInterface) => {
  presses += 1
  await front($, CHANGELOG_PANE, CHANGELOG_TITLE)
}

// One version: its number, its date, and a line for each change
const versionBand = (ui: Ui, key: string, v: Version, side: string) =>
  band(
    ui,
    key,
    `v${v.version}`,
    side,
    <ui.Box flexDirection="column">
      {v.changes.map((one, i) => (
        <ui.Box key={`${key}-${i}`} flexDirection="row" gap={1}>
          <ui.Box flexShrink={0}>
            <ui.Text dimColor>•</ui.Text>
          </ui.Box>
          <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
            <ui.Text wrap="wrap">{one}</ui.Text>
          </ui.Box>
        </ui.Box>
      ))}
    </ui.Box>,
  )
// Older versions a tab left out, with where to read them
const olderLine = (ui: Ui, key: string, left: number, onPress?: () => void) =>
  left ? (
    <ui.Box key={key} flexDirection="row" flexWrap="wrap" gap={1} paddingX={2} flexShrink={0}>
      <ui.Text dimColor>{`${left} earlier ${left === 1 ? 'version' : 'versions'}:`}</ui.Text>
      {onPress ? <ui.Button key={`${key}-open-${presses}`} label="Open the changelog" plain onPress={onPress} /> : <ui.Text><ui.Link href={CHANGELOG_PAGE} label="claudopus.ai/changelog" /></ui.Text>}
    </ui.Box>
  ) : null

// The Changelog tab: every version, newest first, the one this chat runs marked; a very long one ends where the app's limit
// would, the rest on the site
const changelogView = async ($: EngineInterface, ui: Ui, surface?: string) => {
  const versions = await versionsLogged($)
  const { version } = await versionsOf($)
  const { shown, left } = fitted(versions, TAB_BUDGET)
  return (
    <ui.Box key="changelog" flexDirection="column" gap={1} flexGrow={1}>
      <ui.Box key="changelog-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, 'changelog-mark', 'mark', HEAD_MARK, 'Claudopus', $, { surface })}
        <ui.Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <ui.Text bold>Changelog</ui.Text>
          <ui.Text dimColor wrap="wrap">What changed in each version, newest first.</ui.Text>
        </ui.Box>
      </ui.Box>
      {shown.length ? null : <ui.Text dimColor>This copy of Claudopus has no changelog.</ui.Text>}
      {shown.map(v => versionBand(ui, `changelog-${v.version}`, v, [v.date, v.version === version ? 'this chat' : ''].filter(Boolean).join(' · ')))}
      {olderLine(ui, 'changelog-older', left)}
    </ui.Box>
  )
}

// ---- The update screen ----

// seen.json: the newest version whose changes the person has seen on this Mac. A chat that runs a newer one shows them over its
// whole panel until the person closes it there, which writes this version; then no chat on the Mac shows it again
const seenPath = () => `${dir}/seen.json`
const writeSeen = ($: EngineInterface, version: string) => $.fs.write(seenPath(), JSON.stringify({ version }))
// At a load: a Mac with no record yet starts it from the version it ran before, so the first update to a version with this screen
// shows it too: the version this chat just moved from, else the newest older copy Claude Code keeps installed beside this one (a
// chat started fresh on the new version); else from the version loaded, so a first install shows nothing
const noteSeen = async ($: EngineInterface) => {
  if (!dir || seenIn(await readOr($, seenPath()))) return
  const loaded = (await versionsOf($)).version
  if (!loaded) return
  const root = $.plugin.root.replace(/\/+$/, '')
  const copies = installedFrom(root) ? (await $.fs.list(root.slice(0, root.lastIndexOf('/'))).catch(() => [])).map(one => one.name) : []
  const start = (updatedMoment?.to === loaded && updatedMoment.from) || previousOf(copies, loaded) || loaded
  await writeSeen($, start)
  // A panel drawn before the record was written is drawn again, with the screen if it is due
  if (start !== loaded) await update($, tick, n => n + 1)
}
// Closing the screen, at its version or a newer one another chat closed meanwhile
let screenSounded = ''
const closeScreen = async ($: EngineInterface, version: string) => {
  presses += 1
  if (!isNewer(seenIn(await readOr($, seenPath())), version)) await writeSeen($, version)
  drawAgain($)
}
// The note a chat shows once it moved to a newer version whose changes the person has not seen on this Mac: one quiet box in the
// header, where the update's steps were, saying what it moved from and how many versions that covers, with What's new (the
// Changelog tab) and Close, which marks it seen for every chat. Nothing in a copy a newer load of this chat replaced
const updateScreen = async ($: EngineInterface, ui: Ui, loaded: string, _asks: number, _surface?: string) => {
  if (!dir || !loaded) return undefined
  const seen = seenIn(await readOr($, seenPath()))
  if (!isScreenDue(loaded, seen) || (await read($, ranVersion)) !== loaded) return undefined
  const { shown, left } = missedOf(await versionsLogged($), seen, loaded)
  // The sound plays once for the version on this Mac
  if (screenSounded !== loaded) void playUpdated($, (screenSounded = loaded))
  const count = shown.length + left
  return (
    <ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      <ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
        <ui.Box flexShrink={0}>
          <ui.Text color={FLOW}>{`Updated to Claudopus ${loaded}`}</ui.Text>
        </ui.Box>
        <ui.Text dimColor wrap="truncate-end">{`· from v${seen}${count > 1 ? `, ${count} versions` : ''}`}</ui.Text>
      </ui.Box>
      {shown[0]?.changes[0] ? <ui.Text key="update-what" dimColor wrap="wrap">{shown[0].changes[0].length > 140 ? `${shown[0].changes[0].slice(0, 137).replace(/\s+\S*$/, '')}…` : shown[0].changes[0]}</ui.Text> : null}
      <ui.Box key="update-done-buttons" flexDirection="row" flexWrap="wrap" columnGap={2}>
        <ui.Button key={`update-new-${presses}`} label="What's new" onPress={() => void ((presses += 1), closeScreen($, loaded).then(() => openChangelog($))).catch(err => log($, `changelog not opened: ${String(err)}`))} />
        <ui.Button key={`update-close-${presses}`} label="Close" plain dimColor onPress={() => void closeScreen($, loaded).catch(err => log($, `update note not closed: ${String(err)}`))} />
      </ui.Box>
    </ui.Box>
  )
}
