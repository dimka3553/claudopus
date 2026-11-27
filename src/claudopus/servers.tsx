// The servers on this Mac: what listens on which port, from which folder, started by which chat, and the Servers tab

// ---- The servers on this Mac: what listens on which port, from which folder, started by which chat ----

const rows = (text: string) => text.split('\n').filter(Boolean)
// The engine process of a chat, as `ps` names it; the app itself is `Claude`. On Windows the engine is claude.exe and the app Claude.exe
const isEngine = (path: string) => path.endsWith('/MacOS/claude') || /[\\/]claude\.exe$/.test(path)
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

// Windows has no lsof, and Git's ps sees none of its programs: what listens comes from netstat (a TCP row whose far end is 0.0.0.0:0
// or [::]:0 listens, whatever language Windows writes its state in), and every process, with its parent, program and command line,
// from PowerShell. Windows tells no process's folder: a server's is the folder its command line names under the home folder (the
// part before node_modules, else the script's own folder), never one in AppData, where the person's apps live
const WINDOWS_PROCS = "Get-CimInstance Win32_Process | ForEach-Object { '' + $_.ProcessId + [char]9 + $_.ParentProcessId + [char]9 + $_.ExecutablePath + [char]9 + $_.Name + [char]9 + $_.CommandLine }"
const windowsPortsOf = (text: string) => {
  const ports = new Map<number, string[]>()
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*TCP\s+(\S+):(\d+)\s+(?:0\.0\.0\.0|\[::\]):0\s+\S+\s+(\d+)\s*$/i.exec(line)
    const pid = Number(m?.[3] ?? 0)
    if (m && pid > 4 && !ports.get(pid)?.includes(m[2] ?? '')) ports.set(pid, [...(ports.get(pid) ?? []), m[2] ?? ''])
  }
  return ports
}
const windowsProcsOf = (text: string) => {
  const table = new Map<number, { parent: number; path: string; args: string }>()
  for (const line of text.split(/\r?\n/)) {
    const [pid = '', parent = '', path = '', name = '', ...args] = line.split('\t')
    if (/^\d+$/.test(pid)) table.set(Number(pid), { parent: Number(parent) || 0, path: slashed(path || name), args: args.join('\t').trim() })
  }
  return table
}
const windowsFolderOf = (args: string, home: string, scratch: string) => {
  const lower = (one: string) => one.toLowerCase()
  for (const m of args.matchAll(/"([^"]*)"|(\S+)/g)) {
    const word = slashed(m[1] ?? m[2] ?? '')
    if (!/^[A-Za-z]:\//.test(word)) continue
    const inHome = home && lower(word).startsWith(`${lower(home)}/`) && !lower(word).startsWith(`${lower(home)}/appdata/`)
    const inScratch = scratch && lower(word).startsWith(`${lower(scratch)}/`)
    if (!inHome && !inScratch) continue
    // (spelt as the home folder is, as Windows takes either case)
    const whole = inHome ? `${home}${word.slice(home.length)}` : `${scratch}${word.slice(scratch.length)}`
    const [before] = whole.split('/node_modules/')
    return before !== whole ? (before ?? whole) : whole.replace(/\/[^/]*$/, '')
  }
  return ''
}

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
  const commands = new Map<number, string>()
  // Every process with its parent, to find who started a server
  let table = new Map<number, { parent: number; path: string }>()
  // (the engine's own temporary folder, where a chat's scratch folders are)
  const scratchRoot = isWindows ? slashed((await $.env.get('CLAUDE_CODE_TMPDIR').catch(() => undefined)) ?? '').replace(/\/+$/, '') || 'C:/tmp' : ''
  if (isWindows) {
    const procs = windowsProcsOf(await run([...POWERSHELL, WINDOWS_PROCS]))
    table = procs
    for (const [id, one] of procs) {
      if (!ports.has(id)) continue
      commands.set(id, one.args || one.path)
      folders.set(id, windowsFolderOf(one.args, home, scratchRoot))
    }
  } else {
    for (const row of rows(await run(['lsof', '-a', '-d', 'cwd', '-Fpn', '-p', pids]))) {
      if (row.startsWith('p')) pid = Number(row.slice(1))
      else if (row.startsWith('n')) folders.set(pid, row.slice(1))
    }
    for (const row of rows(await run(['ps', '-o', 'pid=,args=', '-p', pids]))) {
      const m = /^\s*(\d+)\s+(.*)$/.exec(row)
      if (m) commands.set(Number(m[1]), m[2] ?? '')
    }
    for (const row of rows(await run(['ps', '-A', '-o', 'pid=,ppid=,comm=']))) {
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

