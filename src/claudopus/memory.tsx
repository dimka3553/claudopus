// Memory files in tabs of the mod's own, links to them in the chat's replies, and the Memory button

// ---- Memory files in tabs of the mod's own: the app's file pane opens only the session's folders, and it never lets ~/.claude
// in (the app's list of protected places), so a memory path in a reply is the mod's link to answer ----

const MEMORY_PANE = 'memory-'
const MEMORY_PANES = 3
// What a memory path is in a reply: the folder spelled in full or from ~, up to a space, a quote, a bracket, a backtick or markup
const memoryPathIn = () => new RegExp(`(?:${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|~/\\.claude/claudopus)/[^\\s\`()\\[\\]<>"'*|~]+`, 'g')
const memoryHref = (path: string) => `file://${encodeURI(path.replace(/^~\/\.claude\/claudopus/, dir))}`
// A reply's memory paths made links of the mod's: a link to one, a code span that is one path and a bare path. Other code stays as
// it is, a fence still open to the end too
const memoryLinked = (text: string) => {
  const hrefs: string[] = []
  // A path's line and column (a.md:12) are not the file's
  const at = (path: string) => {
    const href = memoryHref(path.replace(/(?::\d+){1,2}$/, ''))
    if (!hrefs.includes(href) && href.length <= 2048) hrefs.push(href)
    return href
  }
  const path = memoryPathIn().source
  const whole = new RegExp(`^${path}$`)
  const one = new RegExp(`\\[([^\\]]*)\\]\\((${path})\\)|(^|[^\\w/(\\[])(${path})`, 'g')
  const linked = text
    .split(/(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`[^`\n]*`)/)
    .map((part, i) => {
      if (i % 2) return part.length > 2 && part.startsWith('`') && !part.startsWith('``') && whole.test(part.slice(1, -1)) ? `[${part}](${at(part.slice(1, -1))})` : part
      return part.replace(one, (all, label: string | undefined, linkTo: string | undefined, lead: string | undefined, bare: string | undefined) => {
        if (linkTo) return `[${label}](${at(linkTo)})`
        if (!bare) return all
        // A sentence's last mark is not the path's
        const tail = bare.match(/[.,;:!?_]+$/)?.[0] ?? ''
        const clean = bare.slice(0, bare.length - tail.length)
        return `${lead}[${clean}](${at(clean)})${tail}`
      })
    })
    .join('')
  return { text: linked, hrefs }
}
// Which memory file a pressed link is, or '' for any other link
const memoryPressed = (href: string) => {
  let path = href.replace(/^file:\/\//, '')
  try {
    path = decodeURI(path)
  } catch {}
  path = path.replace(/^~\/\.claude\/claudopus/, dir)
  return dir && path.startsWith(`${dir}/`) && !path.split('/').includes('..') ? path : ''
}
const memoryPaneOf = (path: string) => {
  // Two paths that spell alike once cleaned are told apart by a mark of the whole path
  const id = `${MEMORY_PANE}${path.slice(dir.length + 1).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 44)}`
  return `${id}-${mark(path).replace(/\D/g, '').slice(-12)}`
}
// The file each memory tab shows, by its tab, and what it held when it was opened
const memoryPanes = new Map<string, string>()
const memoryText = new Map<string, string>()
// What a memory path holds: a file's text, or a folder's entries as links; '' when it is not there
const memoryRead = async ($: EngineInterface, path: string) => {
  const text = await $.fs.read(path).catch(() => undefined)
  if (text !== undefined) return text
  const entries = await $.fs.list(path).catch(() => [])
  return entries.length ? `# ${fileName(path)}\n\n${entries.map(one => `- [${one.name}](${memoryHref(`${path}/${one.name}`)})`).join('\n')}\n` : ''
}
// A memory link pressed: a result's own path opens that result's tab, any other file a tab of its own, named after its heading
const openMemory = ($: EngineInterface, path: string) => {
  presses += 1
  void (async () => {
    const report = path.slice(dir.length + 1).match(/^reports\/([^/]+)/)?.[1]
    if (report && (await read($, reports)).some(one => one.id === report)) return openReport($, report)
    const id = memoryPaneOf(path)
    const text = await memoryRead($, path)
    memoryPanes.set(id, path)
    memoryText.set(id, text)
    const open = (await $.ui.panes()).filter(pane => pane.id.startsWith(MEMORY_PANE) && pane.id !== id)
    for (const pane of open.slice(0, Math.max(0, open.length - (MEMORY_PANES - 1)))) await $.ui.close({ id: pane.id }).catch(() => undefined)
    const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim()
    await front($, id, cut(heading || fileName(path), 30))
    redraw($)
  })().catch(err => log($, `memory file ${path} not opened: ${String(err)}`))
}

// Memory: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
const showMemory = async ($: EngineInterface) => {
  const opened = await $.process.run(['open', dir]).catch(err => ({ exitCode: 1, stderr: String(err) }))
  if (opened.exitCode !== 0) await log($, `memory folder not opened: ${opened.stderr}`)
}
const memoryButton = ($: EngineInterface, ui: Ui) => (
  <ui.Box key="memory-button" flexShrink={0}>
    <ui.Button key={`memory-open-${presses}`} label="Memory" onPress={() => void showMemory($).catch(err => log($, `memory folder not opened: ${String(err)}`))} />
  </ui.Box>
)

const memoryHooks = (on: On) => {

  // A reply that names a memory file: its links to memory open the mod's tab, since the app's file pane refuses ~/.claude. The
  // terminal opens such a path itself, so it keeps its own drawing
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface === 'terminal' || !dir || e.props.isSummary || !memoryPathIn().test(e.props.text)) return next(e)
    const { text, hrefs } = memoryLinked(e.props.text)
    if (!hrefs.length) return next(e)
    const { Markdown } = $.ui.resolve(e)
    return (
      <Markdown
        key={`memory-reply-${mark(e.requestId)}`}
        text={text}
        pressableLinks={hrefs.slice(0, 256)}
        onLinkPress={link => {
          const path = memoryPressed(link.href)
          if (path) openMemory($, path)
        }}
      />
    )
  })

  // A memory file opened as a tab of its own; the links in it to other memory files open there too
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith(MEMORY_PANE)) return next(e)
    const { Box, Markdown, Text } = $.ui.resolve(e)
    const path = memoryPanes.get(e.requestId)
    if (!path) return <Text dimColor>Press the link in the chat again to open this file.</Text>
    const held = memoryText.get(e.requestId) ?? ''
    const { text, hrefs } = memoryLinked(held.length > REPORT_CHARS ? `${held.slice(0, REPORT_CHARS)}\n\n…` : held)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        <Text dimColor wrap="wrap">{path}</Text>
        {held ? (
          <Markdown
            key={`memory-text-${e.requestId}`}
            text={text}
            pressableLinks={hrefs.slice(0, 256)}
            onLinkPress={link => {
              const to = memoryPressed(link.href)
              if (to) openMemory($, to)
            }}
          />
        ) : (
          <Text dimColor>This file is not there any more.</Text>
        )}
      </Box>
    )
  })

}

