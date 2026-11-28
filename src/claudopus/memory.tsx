// Memory files in tabs of the mod's own, links to them in the chat's replies, and Config's Memory, which opens the folder

// ---- Memory files in tabs of the mod's own: the app's file pane opens only the session's folders, and it never lets ~/.claude
// in (the app's list of protected places), so a memory path in a reply is the mod's link to answer ----

const MEMORY_PANE = 'memory-'
const MEMORY_PANES = 3
// What a memory path is in a reply: the folder spelled in full or from ~, up to a space, a quote, a bracket, a backtick or markup
const memoryPathIn = () => new RegExp(`(?:${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|~/\\.claude/claudopus)/[^\\s\`()\\[\\]<>"'*|~]+`, 'g')
// (a Windows path from its drive, C:/Users/x, as file:///C:/Users/x)
const memoryHref = (path: string) => `file://${/^[A-Za-z]:\//.test(dir) ? '/' : ''}${encodeURI(path.replace(/^~\/\.claude\/claudopus/, dir))}`
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
  let path = href.replace(/^file:\/\//, '').replace(/^\/(?=[A-Za-z]:\/)/, '')
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
  void comingTab((async () => {
    const report = path.slice(dir.length + 1).match(/^reports\/([^/]+)/)?.[1]
    if (report && (await ownReports($)).some(one => one.id === report)) return openReport($, report)
    const id = memoryPaneOf(path)
    const text = await memoryRead($, path)
    memoryPanes.set(id, path)
    memoryText.set(id, text)
    const open = (await $.ui.panes()).filter(pane => pane.id.startsWith(MEMORY_PANE) && pane.id !== id)
    const closed = open.slice(0, Math.max(0, open.length - (MEMORY_PANES - 1)))
    for (const pane of closed) await $.ui.close({ id: pane.id }).catch(() => undefined)
    // Only the open tabs' files are kept: a tab closed is read again when its link is pressed again
    const left = new Set([id, ...open.filter(pane => !closed.includes(pane)).map(pane => pane.id)])
    for (const one of [...memoryPanes.keys()]) if (!left.has(one)) (memoryPanes.delete(one), memoryText.delete(one))
    const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim()
    // The memory folder itself is named Memory, as in Config; else its heading would read 'claudopus' beside the panel's tab
    await front($, id, path === dir ? 'Memory' : cut(heading || fileName(path), 30))
    redraw($)
  })()).catch(err => log($, `memory file ${path} not opened: ${String(err)}`))
}

// Memory, in Config: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
// A terminal, or a chat run over ssh, has no Finder the person can see: there the folder opens as a tab of the panel, each file a link
const showMemory = async ($: EngineInterface, surface: RenderSurface) => {
  if (isRunFromAfar || surface === 'terminal' || !hasDesktop) return openMemory($, dir)
  const opened = await openOn($, dir)
  if (opened.exitCode !== 0) await log($, `memory folder not opened: ${opened.stderr}`)
}

// ---- Every chat on this Mac in memory: bin/catch-up saves the words of chats no chat saved itself and each chat's work (what its
// helpers were asked and reported, what connected tools returned, the documents it wrote), so recall finds them all.
// Each chat starts it; it keeps its own lock and its own pause between runs, so one runs at a time and no more often than that.
// In a session of its own, so it outlives the chat, at a low priority ----
const CATCH_UP_AFTER = 60_000
const CATCH_UP_EVERY = 10 * 60_000
// Its log is added to, and set aside once it passes a megabyte
const CATCH_UP_LOG = 'd=$1; shift; l="$d/caught/log.txt"; mkdir -p "$d/caught" || exit 1; [ -f "$l" ] && [ "$(wc -c < "$l")" -gt 1000000 ] && mv -f "$l" "$l.old"; '
const CATCH_UP_START = `${CATCH_UP_LOG}nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' nice -n 10 "$@" >> "$l" 2>&1 < /dev/null &`
// (on Windows started apart by PowerShell, as the watcher is: startOnWindows)
const CATCH_UP_WINDOWS = `${CATCH_UP_LOG}exec nice -n 10 "$@" >> "$l" 2>&1 < /dev/null`
// (not started at all while its own stamp says it ran lately: every open chat asked every ten minutes, and each ask started five
// programs that left at once. The stamp is bin/catch-up's own, caught/last-<the start of the projects folder's md5>, good for 540 s)
let catchUpStamp = ''
const startCatchUp = async ($: EngineInterface) => {
  if (!dir) return
  const projects = `${await configDir($)}/projects`
  if (!catchUpStamp) {
    const r = await runOn($, ['/usr/bin/perl', '-MDigest::MD5=md5_hex', '-e', 'print substr(md5_hex($ARGV[0]), 0, 12)', projects]).catch(() => undefined)
    if (r?.exitCode === 0 && /^[0-9a-f]{12}$/.test(r.stdout)) catchUpStamp = `${dir}/caught/last-${r.stdout}`
  }
  const stamp = catchUpStamp ? ((await $.fs.stat(catchUpStamp).catch(() => undefined))?.mtimeMs ?? 0) : 0
  const now = stamp ? await $.clock.now() : 0
  if (stamp && now >= stamp && now - stamp < 540_000) return
  const words = [dir, `${pluginRoot($)}/bin/catch-up`, dir, projects]
  const r = isWindows ? await startOnWindows($, CATCH_UP_WINDOWS, words) : await runOn($, ['/bin/sh', '-c', CATCH_UP_START, 'sh', ...words])
  if (r.exitCode !== 0) await log($, `chats not caught up: ${r.stderr.slice(0, 200)}`)
}

const memoryHooks = (on: On) => {

  // A reply as the chat shows it. One that names a memory file: its links to memory open the mod's tab, since the app's file pane refuses ~/.claude. The
  // terminal opens such a path itself, so it keeps its own drawing
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    // The line that ends a turn the chat had nothing to say in (a paused task's notice, NO_ANSWER) is drawn as nothing
    if (!isOff && !e.props.isSummary && e.props.text.trim() === NO_ANSWER) {
      const { Box } = uiOf($, e)
      return <Box key={`quiet-${mark(e.requestId)}`} />
    }
    // Every reply then goes in its task's box, with its links at its end, as the person's settings have it (colours.tsx)
    const drawn = async (e: Parameters<typeof next>[0]) => {
      if (e.surface === 'terminal' || !dir || e.props.isSummary || !memoryPathIn().test(e.props.text)) return withTaskBox($, e, await next(e), uiOf($, e))
      const { text, hrefs } = memoryLinked(e.props.text)
      if (!hrefs.length) return withTaskBox($, e, await next(e), uiOf($, e))
      const { Markdown } = uiOf($, e)
      return withTaskBox($, e, (
        <Markdown
          key={`memory-reply-${mark(e.requestId)}`}
          text={text}
          pressableLinks={hrefs.slice(0, 256)}
          onLinkPress={link => {
            const path = memoryPressed(link.href)
            if (path) openMemory($, path)
          }}
        />
      ), uiOf($, e))
    }
    // A reply that says a card waits for the person has that card's question, with its buttons, under what else it says
    const waits = e.props.isSummary ? undefined : await waitsIn($, e, uiOf($, e)).catch(err => (void log($, `what waits not drawn in the chat: ${String(err)}`), undefined))
    if (!waits) return drawn(e)
    const { Box } = uiOf($, e)
    return (
      <Box key={`waits-${mark(e.requestId)}`} flexDirection="column" gap={1}>
        {waits.rest ? await drawn({ ...e, props: { ...e.props, text: waits.rest } }) : null}
        {waits.blocks}
      </Box>
    )
  })

  // A memory file opened as a tab of its own; the links in it to other memory files open there too
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (!e.requestId?.startsWith(MEMORY_PANE)) return next(e)
    const { Box, Button, Markdown, Text } = uiOf($, e)
    const path = memoryPanes.get(e.requestId)
    if (!path) return <Text dimColor>Press the link in the chat again to open this file.</Text>
    const held = memoryText.get(e.requestId) ?? ''
    const { text, hrefs } = memoryLinked(held.length > REPORT_CHARS ? `${held.slice(0, REPORT_CHARS)}\n\n…` : held)
    return (
      <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        <Text dimColor wrap="wrap">{path}</Text>
        {held && e.surface === 'terminal' ? (
          // The terminal writes each link's whole address beside its words, and the keys cannot reach a link: there the words stand
          // alone and each file linked is a button under the text, which Tab reaches
          <Box key="memory-terminal" flexDirection="column" gap={1}>
            {/^# [^\n]*\n\n(- \[[^\]]*\]\([^)]*\)\n?)+$/.test(held.trim() + '\n') ? null : <Markdown key={`memory-text-${e.requestId}`} text={text.replace(/\[([^\]]*)\]\((?:file:\/\/)?[^)]*\)/g, '$1')} />}
            {(() => {
              // Every memory file the text names, by a link of its own or by its path, once each
              const named = [...new Set([...[...held.matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1] ?? ''), ...hrefs].map(href => memoryPressed(href)).filter(Boolean))].slice(0, 200)
              return named.length ? (
                <Box key="memory-links" flexDirection="column">
                  {named.map(to => <Button key={`memory-link-${to}`} label={to.slice(dir.length + 1)} plain onPress={() => openMemory($, to)} />)}
                </Box>
              ) : null
            })()}
          </Box>
        ) : held ? (
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
          <Text dimColor>This file is no longer available.</Text>
        )}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}

