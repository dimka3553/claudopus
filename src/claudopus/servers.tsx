// The servers on this Mac: what listens on which port, from which folder, started by which chat, and the Servers tab

// ---- The servers on this Mac: what listens on which port, from which folder, started by which chat ----

const rows = (text: string) => text.split('\n').filter(Boolean)
// The engine process of a chat, as `ps` names it; the app itself is `Claude`
const isEngine = (path: string) => path.endsWith('/MacOS/claude')
// "node /long/path/.bin/next dev" reads as "node next dev"
const short = (args: string) =>
  args
    .split(' ')
    .map(part => (part.startsWith('/') ? (part.split('/').pop() ?? part) : part))
    .join(' ')
    .slice(0, 50)

const scanServers = async ($: EngineInterface) => {
  scannedAt = Date.now()
  const home = (await $.env.get('HOME')) ?? ''
  const run = async (argv: string[]) => (await $.process.run(argv).catch(() => undefined))?.stdout ?? ''

  // lsof -F prints one field a line: p<pid>, then n<address:port> for each socket of that process
  const ports = new Map<number, string[]>()
  let pid = 0
  for (const row of rows(await run(['lsof', '-nP', '-iTCP', '-sTCP:LISTEN', '-Fpn']))) {
    if (row.startsWith('p')) pid = Number(row.slice(1))
    const port = row.startsWith('n') ? row.slice(row.lastIndexOf(':') + 1) : ''
    if (port && !ports.get(pid)?.includes(port)) ports.set(pid, [...(ports.get(pid) ?? []), port])
  }
  if (!ports.size) return update($, servers, () => [])
  const pids = [...ports.keys()].join(',')

  const folders = new Map<number, string>()
  for (const row of rows(await run(['lsof', '-a', '-d', 'cwd', '-Fpn', '-p', pids]))) {
    if (row.startsWith('p')) pid = Number(row.slice(1))
    else if (row.startsWith('n')) folders.set(pid, row.slice(1))
  }
  const commands = new Map<number, string>()
  for (const row of rows(await run(['ps', '-o', 'pid=,args=', '-p', pids]))) {
    const m = /^\s*(\d+)\s+(.*)$/.exec(row)
    if (m) commands.set(Number(m[1]), m[2] ?? '')
  }
  // Every process with its parent, to find who started a server
  const table = new Map<number, { parent: number; path: string }>()
  for (const row of rows(await run(['ps', '-A', '-o', 'pid=,ppid=,comm=']))) {
    const m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(row)
    if (m) table.set(Number(m[1]), { parent: Number(m[2]), path: m[3] ?? '' })
  }
  // The nearest process above this one that the test accepts; 0 for none
  const above = (from: number, test: (path: string) => boolean) => {
    let at = table.get(from)?.parent ?? 0
    for (let hops = 0; at > 1 && hops < 15; hops += 1) {
      const one = table.get(at)
      if (!one) return 0
      if (test(one.path)) return at
      at = one.parent
    }
    return 0
  }

  // The chats open now, named by their engine process and by their session id
  const chats = new Map<string, string>()
  for (const entry of await $.fs.list(`${home}/.claude/sessions`).catch(() => [])) {
    if (!entry.name.endsWith('.json')) continue
    const one = JSON.parse((await readOr($, `${home}/.claude/sessions/${entry.name}`)) || '{}') as { pid?: number; sessionId?: string; name?: string; cwd?: string }
    const name = one.name || (one.cwd ?? '').split('/').pop() || 'unnamed'
    if (one.pid) chats.set(String(one.pid), name)
    if (one.sessionId) chats.set(one.sessionId, name)
  }
  // A server outlives the chat process that started it and then has no parent: what was seen while it had one is kept
  const seen = JSON.parse((await readOr($, `${dir}/servers.json`)) || '{}') as Record<string, string>
  const kept: Record<string, string> = {}

  const found: Server[] = []
  for (const [id, list] of ports) {
    const folder = folders.get(id) ?? ''
    const isScratch = folder.startsWith('/private/tmp/') || folder.startsWith('/tmp/')
    // A server of mine runs from one of my folders or a chat's scratch folder; the apps and the chats themselves listen too
    if (!(folder.startsWith(`${home}/`) || isScratch) || folder.startsWith(`${home}/Library`) || isEngine(table.get(id)?.path ?? '')) continue
    const port = list[0] ?? ''
    // The chat is the engine process above it, or the one whose scratch folder it runs in
    const chat = chats.get(String(above(id, isEngine))) ?? chats.get(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.exec(folder)?.[0] ?? '') ?? seen[`${id}:${port}`]
    if (chat) kept[`${id}:${port}`] = chat
    const command = short(commands.get(id) ?? table.get(id)?.path ?? '')
    const hasPages = !NO_PAGES.test(command)
    const place = isScratch ? (folder.split('/').pop() ?? '') : folder.replace(`${home}/Documents/GitHub/`, '').replace(`${home}/`, '~/')
    found.push({
      pid: id,
      port,
      url: hasPages ? `http://localhost:${port}` : '',
      about: [hasPages ? '' : command.split(' ')[0], place, chat].filter(Boolean).join(' · '),
    })
  }
  found.sort((a, b) => Number(a.port) - Number(b.port))
  if (JSON.stringify(kept) !== JSON.stringify(seen)) await $.fs.write(`${dir}/servers.json`, JSON.stringify(kept))
  await update($, servers, () => found)
}

// Looks at the servers again while their panel is open; each pass redraws it
const refresh = async ($: EngineInterface) => {
  const open = await $.ui.panes().catch(() => [])
  if (!open.some(one => one.id === PANE && one.isShown)) return
  await scanServers($)
  await update($, tick, n => n + 1)
}

const stopServer = async ($: EngineInterface, pid: number) => {
  await $.process.run(['kill', String(pid)]).catch(err => log($, `server ${pid} not stopped: ${String(err)}`))
  await $.clock.sleep(700)
  await scanServers($)
}

const serversTabHooks = (on: On) => {

  // The servers panel: one block per server with its link, where it runs and which chat started it; nothing is cut off
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Link, Text } = $.ui.resolve(e)
    if (!scannedAt) await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    await read($, tick)
    const found = await read($, servers)

    return (
      <Box flexDirection="column" gap={1}>
        {found.length === 0 && <Text dimColor>Nothing is listening from your folders.</Text>}
        {found.map(one => (
          <Box key={`server-${one.pid}`} flexDirection="row" alignItems="flex-start" gap={1}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text wrap="wrap">{one.url ? <Link href={one.url} label={`localhost:${one.port}`} /> : `Port ${one.port}`}</Text>
              <Text dimColor wrap="wrap">{one.about}</Text>
            </Box>
            <Box flexShrink={0}>
              <Button key={`kill-${one.pid}`} label="■" onPress={() => void stopServer($, one.pid)} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  })

}

