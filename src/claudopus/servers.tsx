// The servers on this Mac: what listens on which port, from which folder, started by which chat, and the Servers tab

// ---- The servers on this Mac: what listens on which port, from which folder, started by which chat ----

const rows = (text: string) => text.split('\n').filter(Boolean)
// The engine process of a chat, as `ps` shows its command (the program's path, then what it was given); the app itself is `Claude`.
// On Windows the engine is claude.exe, its path quoted where it holds a space, and the app Claude.exe
const isEngine = (args: string) => /^(?:(?! -).)*\/MacOS\/claude(?: |$)/.test(args) || /^"?(?:[^"]*[\\/])?claude\.exe"?(?:\s|$)/.test(args)
// "node /long/path/.bin/next dev" reads as "node next dev"; on Windows a word may be quoted for its spaces, and a program's .exe goes
const short = (args: string) =>
  isWindows
    ? [...args.matchAll(/"([^"]*)"|(\S+)/g)]
        .map(m => m[1] ?? m[2] ?? '')
        .map(part => (isAbsPath(part) ? (part.split(/[\\/]/).pop() ?? part).replace(/\.exe$/i, '') : part))
        .join(' ')
        .slice(0, 50)
    : args
        .split(' ')
        .map(part => (part.startsWith('/') ? (part.split('/').pop() ?? part) : part))
        .join(' ')
        .slice(0, 50)


const scanServers = async ($: EngineInterface) => {
  scannedAt = Date.now()
  const home = (await homeFolder($)) ?? ''
  const run = async (argv: string[]) => (await runOn($, argv).catch(() => undefined))?.stdout ?? ''

  // lsof -F prints one field a line: p<pid>, then n<address:port> for each socket of that process
  let ports = new Map<number, string[]>()
  let pid = 0
  if (isWindows) ports = windowsPortsOf(await run(['netstat', '-ano']))
  else
    for (const row of rows(await run(['lsof', '-nP', '-iTCP', '-sTCP:LISTEN', '-Fpn']))) {
      if (row.startsWith('p')) pid = Number(row.slice(1))
      const port = row.startsWith('n') ? row.slice(row.lastIndexOf(':') + 1) : ''
      if (port && !ports.get(pid)?.includes(port)) ports.set(pid, [...(ports.get(pid) ?? []), port])
    }
  if (!ports.size) return update($, servers, () => [])
  const pids = [...ports.keys()].join(',')

  const folders = new Map<number, string>()
  // (the engine's own temporary folder, where a chat's scratch folders are)
  const scratchRoot = isWindows ? slashed((await $.env.get('CLAUDE_CODE_TMPDIR').catch(() => undefined)) ?? '').replace(/\/+$/, '') || 'C:/tmp' : ''
  // Every process with its parent and its command, to find who started a server and what it runs: one list for both
  const table = new Map<number, { parent: number; path: string }>()
  if (isWindows) {
    for (const [id, one] of windowsProcsOf(await run([...POWERSHELL, WINDOWS_PROCS]))) {
      table.set(id, { parent: one.parent, path: one.args || one.path })
      if (ports.has(id)) folders.set(id, windowsFolderOf(one.args, home, scratchRoot))
    }
  } else {
    for (const row of rows(await run(['lsof', '-a', '-d', 'cwd', '-Fpn', '-p', pids]))) {
      if (row.startsWith('p')) pid = Number(row.slice(1))
      else if (row.startsWith('n')) folders.set(pid, row.slice(1))
    }
    for (const row of rows(await run(['ps', '-A', '-o', 'pid=,ppid=,args=']))) {
      const m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(row)
      if (m) table.set(Number(m[1]), { parent: Number(m[2]), path: m[3] ?? '' })
    }
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
  for (const entry of await $.fs.list(`${await configDir($)}/sessions`).catch(() => [])) {
    if (!entry.name.endsWith('.json')) continue
    const one = JSON.parse((await readOr($, `${await configDir($)}/sessions/${entry.name}`)) || '{}') as { pid?: number; sessionId?: string; name?: string; cwd?: string }
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
    const isScratch = folder.startsWith('/private/tmp/') || folder.startsWith('/tmp/') || Boolean(scratchRoot && folder.toLowerCase().startsWith(`${scratchRoot.toLowerCase()}/`))
    // A server of mine runs from one of my folders or a chat's scratch folder; the apps and the chats themselves listen too. On
    // Windows one a chat started counts too, whatever its command line names
    const isChats = isWindows && Boolean(above(id, isEngine))
    if (!(folder.startsWith(`${home}/`) || isScratch || isChats) || folder.startsWith(`${home}/Library`) || isEngine(table.get(id)?.path ?? '')) continue
    const port = list[0] ?? ''
    // The chat is the engine process above it, or the one whose scratch folder it runs in
    const chat = chats.get(String(above(id, isEngine))) ?? chats.get(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.exec(folder)?.[0] ?? '') ?? seen[`${id}:${port}`]
    if (chat) kept[`${id}:${port}`] = chat
    const command = short(table.get(id)?.path ?? '')
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

// Looks at the servers again while their panel is open, every SERVERS_EVERY (and at once as it is shown again); each look redraws it
const SERVERS_EVERY = 10_000
let serversAt = -Infinity
const refresh = async ($: EngineInterface) => {
  const open = await $.ui.panes().catch(() => [])
  if (!open.some(one => one.id === PANE && one.isShown)) return void (serversAt = -Infinity)
  const now = await $.clock.now()
  if (now - serversAt < SERVERS_EVERY - TICK / 2) return
  serversAt = now
  await scanServers($)
  // Its own value, which only the Servers tab reads: the panel is not drawn again with it
  await update($, servers, list => [...list])
}

const stopServer = async ($: EngineInterface, pid: number) => {
  // (on Windows with every process it started: Windows has no gentle stop for a program without a window)
  await runOn($, isWindows ? ['taskkill', '/PID', String(pid), '/T', '/F'] : ['kill', String(pid)]).catch(err => log($, `server ${pid} not stopped: ${String(err)}`))
  await $.clock.sleep(700)
  await scanServers($)
}

const serversTabHooks = (on: On) => {

  // The servers panel: one block per server with its link, where it runs and which chat started it; nothing is cut off
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Link, Text } = uiOf($, e)
    if (!scannedAt) await scanServers($).catch(err => log($, `servers not read: ${String(err)}`))
    await read($, tick)
    const found = await read($, servers)

    return (
      <Box flexDirection="column" gap={1}>
        {found.length === 0 && <Text dimColor>No servers are running from your folders.</Text>}
        {found.map(one => (
          <Box key={`server-${one.pid}`} flexDirection="row" alignItems="flex-start" gap={1}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text wrap="wrap">{one.url ? <Link href={one.url} label={`localhost:${one.port}`} /> : `Serving on port ${one.port}`}</Text>
              <Text dimColor wrap="wrap">{one.about}</Text>
            </Box>
            <Box flexShrink={0}>
              <Button key={`kill-${one.pid}`} label="Stop" onPress={() => void stopServer($, one.pid)} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }).catch(($, e, next) => (next.called ? next(e) : tabFailed($, e, next.error)))

}

