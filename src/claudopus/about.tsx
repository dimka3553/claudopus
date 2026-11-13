// The About tab: what Claudopus is, its version and the app's, the site and the code

// About: what Claudopus is, its version and the app's, the site, the code and its licence
const ABOUT_PANE = 'about'
const ABOUT_TITLE = 'About'
const SITE = 'https://claudopus.ai'
const REPO = 'https://github.com/dimka3553/claudopus'
// Each opening of About is a new drawing of the octopus, so it waves once each time and then rests
let aboutOpens = 0
const openAbout = async ($: EngineInterface) => {
  presses += 1
  aboutOpens += 1
  await front($, ABOUT_PANE, ABOUT_TITLE)
}
const aboutButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="about-button" flexShrink={0}>
    <ui.Button key={`about-open-${presses}`} label="About" onPress={() => void openAbout($).catch(err => log($, `about not opened: ${String(err)}`))} />
  </ui.Box>
)
// The version this chat loaded, read once from its own copy, so a chat on an older copy shows its own number; and a newer one the
// Mac updated itself to while this chat runs the one it loaded
let loadedVersion: Promise<string> | undefined
const versionsOf = async ($: EngineInterface) => {
  loadedVersion ??= readOr($, `${$.plugin.root}/.claude-plugin/plugin.json`).then(manifest => {
    try {
      return String(JSON.parse(manifest).version ?? '')
    } catch {
      return ''
    }
  })
  const version = await loadedVersion
  // A read that failed is tried again on the next drawing
  if (!version) loadedVersion = undefined
  // The Mac's installed version is Claude Code's own record, read each time: update.json says only what the last look found
  const installed = await installedNow($).catch(() => '')
  return { version, installed, isWaiting: Boolean(version && installed && isNewer(installed, version)) }
}
const aboutView = async ($: EngineInterface, ui: Ui) => {
  const { Box, Link, Text } = ui
  const app = await (async () => (await $.session.version()).version)().catch(() => '')
  const { version, installed, isWaiting } = await versionsOf($)
  const line = (key: string, name: string, body: JSX.Element) => (
    <Box key={key} flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
      <Box width={9} flexShrink={0}>
        <Text dimColor>{name}</Text>
      </Box>
      <Box flexGrow={1} flexShrink={1} minWidth={0}>
        {body}
      </Box>
    </Box>
  )
  return (
    <Box key="about" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="about-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, `about-mark-${aboutOpens}`, 'wave', HEAD_MARK, 'Claudopus waving')}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold>Claudopus</Text>
          <Text dimColor wrap="wrap">{[version ? `Version ${version}` : '', isWaiting ? `${installed} is installed, new chats use it` : '', app ? `Claude Code ${app}` : ''].filter(Boolean).join(' · ') || 'A mod for Claude Code'}</Text>
        </Box>
      </Box>
      {band(
        ui,
        'about-what',
        'What it does',
        '',
        <Box flexDirection="column" gap={1}>
          <Text wrap="wrap">Every chat hands each of your messages to an agent that works in the background, so the chat stays small and free to talk.</Text>
          <Text wrap="wrap">This panel shows each piece of work as a card with its to-dos. What finished work leaves is kept under Results.</Text>
          <Text wrap="wrap">Your words, the subjects you work on and every result are kept as plain files under Memory. Stats adds up what the work cost and the time it saved.</Text>
        </Box>,
      )}
      {band(
        ui,
        'about-links',
        'Links',
        '',
        <Box flexDirection="column" gap={1}>
          {line('about-site', 'Website', <Text><Link href={SITE} label="claudopus.ai" /></Text>)}
          {line(
            'about-repo',
            'GitHub',
            <Box flexDirection="column">
              <Text><Link href={REPO} label="dimka3553/claudopus" /></Text>
              <Text dimColor wrap="wrap">If Claudopus helps you, a star on GitHub helps others find it.</Text>
            </Box>,
          )}
          {line('about-licence', 'Licence', <Text><Link href={`${REPO}/blob/main/LICENSE`} label="MIT" /></Text>)}
        </Box>,
      )}
    </Box>
  )
}
