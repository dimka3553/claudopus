// How Claude uses this computer, for the line above the prompt: memory in use and Claude's part of it, how busy the processor is
// and Claude's part of that, and how fast the disk and the network move. One cheap shell look every few seconds, shared by every
// chat on the computer through a small file; the figures come from two looks in a row. Nothing here touches the engine

// How often the computer is looked at, and how often (on a Mac) top is asked for each process's own memory, which costs about half
// a second of the processor where ps costs a hundredth
export const USAGE_EVERY = 5_000
export const FOOTPRINT_EVERY = 60_000
// Two looks further apart than this give no rates
const USAGE_GAP = 120_000
// Memory past this part of the whole turns amber
export const MEMORY_WARN = 0.9

// One look on a Mac: the engine's own process, every process with its parent, memory and processor time, the memory as Activity
// Monitor counts it, the disks' and the network's running totals, and now and then top's own memory of each process
export const usageMac = (isTop: boolean) =>
  `echo "@@SELF@@ $PPID"; echo @@PS@@; ps -axo pid=,ppid=,rss=,time=,comm=; echo @@VM@@; vm_stat; echo @@SYS@@; sysctl -n hw.memsize hw.ncpu; echo @@IO@@; iostat -Id -c 1; echo @@NET@@; netstat -ibn; echo @@GPU@@; ioreg -r -d 1 -w 0 -c IOAccelerator | grep -oE '"(Device Utilization %|In use system memory)"=[0-9]+'; echo @@BATT@@; pmset -g batt${isTop ? '; echo @@TOP@@; top -l 1 -stats pid,mem' : ''}`
// One look on Linux, from /proc and /sys, and nvidia-smi where the machine has one (bounded, as a GPU with no driver kept loaded is slow
// to answer). A graphics card asleep (its display device, not its sound) is left asleep: then there is no GPU figure. Files are read by
// the shell itself, so the look starts no process per device
export const USAGE_LINUX =
  "echo \"@@SELF@@ $PPID\"; echo @@STAT@@; grep -H '' /proc/[0-9]*/stat 2>/dev/null; echo @@STATM@@; grep -H '' /proc/[0-9]*/statm 2>/dev/null; echo @@SYS@@; getconf PAGESIZE; getconf CLK_TCK; head -n 1 /proc/stat; echo @@MEM@@; cat /proc/meminfo; echo @@DISK@@; cat /proc/diskstats; echo @@NET@@; cat /proc/net/dev; echo @@GPU@@; asleep=; for d in /sys/bus/pci/devices/*; do c=; v=; p=; { read c < $d/class; } 2>/dev/null; case \"$c\" in 0x03*) { read v < $d/vendor; read p < $d/power/runtime_status; } 2>/dev/null; case \"$v\" in 0x10de|0x1002) [ \"$p\" = suspended ] && asleep=1;; esac;; esac; done; if [ -n \"$asleep\" ]; then :; elif command -v nvidia-smi >/dev/null 2>&1; then timeout 2 nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits 2>/dev/null; else cat /sys/class/drm/card*/device/gpu_busy_percent 2>/dev/null; fi; echo @@BATT@@; grep -H '' /sys/class/power_supply/*/type /sys/class/power_supply/*/scope /sys/class/power_supply/*/capacity /sys/class/power_supply/*/status 2>/dev/null; true"

// A process: its parent, its processor time in seconds, its memory in bytes, its name
export type UsageProc = { pid: string; ppid: string; cpu: number; mem: number; name: string }
// One look's running totals. busy and all are the whole computer's processor seconds where it counts them (Linux); disk and net are
// bytes moved since it started, by each disk and port, so one that comes or goes between looks moves no speed
// The battery as the system reports it: its charge in percent, whether it runs on it, charges, or sits on power, and the time left
// (to empty on battery, to full while charging) in minutes, only when the system gives one
export type UsageBattery = { pct: number; state: 'battery' | 'charging' | 'plugged' | 'unknown'; left?: number }
// The programs that use the most, by name, for the detail a pointer on a figure shows: [name, bytes] or [name, part of the processor]
export type UsageTop = [string, number][]
export type UsageRaw = { names?: Record<string, string>; memTop?: UsageTop; gpuMem?: number; gpuMemTotal?: number; netIn?: number; netOut?: number; gpu?: number; battery?: UsageBattery; at: number; cpu: Record<string, number>; claude: string[]; claudeMem: number; memUsed: number; memTotal: number; ncpu: number; disk: Record<string, number>; net: Record<string, number>; busy?: number; all?: number }
// What the line shows: bytes, parts of the whole processor (0 to 1), bytes a second
export type UsageFigures = { memTop?: UsageTop; cpuTop?: UsageTop; gpuMem?: number; gpuMemTotal?: number; netIn?: number; netOut?: number; disks?: string[]; ports?: string[]; ncpu?: number; gpu?: number; battery?: UsageBattery; memUsed: number; memTotal: number; memClaude: number; cpu?: number; cpuClaude?: number; disk?: number; net?: number }
// What is kept between looks, in the shared file: the last look, its figures, top's memory of each process when last had, and when
// top was last asked, whether or not it answered
export type UsageKept = { at: number; raw: UsageRaw; figures: UsageFigures; footprint?: { at: number; byPid: Record<string, number> }; topAt?: number }

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const sectionsOf = (text: string) => {
  const out: Record<string, string> = {}
  for (const part of text.split(/^@@(?=[A-Z]+@@)/m).slice(1)) {
    const m = /^([A-Z]+)@@ ?([^\n]*)\n?([\s\S]*)$/.exec(part)
    if (m) out[m[1] ?? ''] = m[1] === 'SELF' ? (m[2] ?? '') : `${m[2] ?? ''}${m[2] ? '\n' : ''}${m[3] ?? ''}`
  }
  return out
}
// ps's processor time, [days-][hours:]minutes:seconds.hundredths
export const secondsOfTime = (time: string) => {
  const [days, rest = ''] = time.includes('-') ? time.split('-') : ['0', time]
  return Number(days) * 86400 + rest.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
}
// Claude: the app, every claude chat, the engine this runs in, and everything they started
const isClaudeName = (name: string) => /^claude$/i.test(name.split('/').pop() ?? '')
export const claudeOf = (procs: UsageProc[], self: string) => {
  const found = new Set(procs.filter(p => p.pid === self || isClaudeName(p.name)).map(p => p.pid))
  const children = new Map<string, string[]>()
  for (const p of procs) children.set(p.ppid, [...(children.get(p.ppid) ?? []), p.pid])
  const queue = [...found]
  for (let n = 0; n < queue.length; n++) for (const child of children.get(queue[n] ?? '') ?? []) if (!found.has(child)) (found.add(child), queue.push(child))
  return found
}
const sizeOf = (amount: string, unit: string) => Number(amount) * ({ B: 1, K: 1024, M: 1024 ** 2, G: 1024 ** 3, T: 1024 ** 4 }[unit] ?? 1)
// top's memory column: 1097M, 625M+, 12K-
export const footprintOf = (text: string) => {
  const byPid: Record<string, number> = {}
  for (const m of text.matchAll(/^\s*(\d+)\s+([\d.]+)([BKMGT])[+-]?\s*$/gm)) byPid[m[1] ?? ''] = sizeOf(m[2] ?? '0', m[3] ?? 'B')
  return byPid
}

// How busy the graphics processor is, 0 to 1: a Mac's busiest accelerator, a Linux machine's GPUs on average. None when none answers
export const gpuOf = (text: string, isLinux: boolean) => {
  const values = (isLinux ? [...text.matchAll(/^\s*(\d+(?:\.\d+)?)\s*(?:,[^\n]*)?$/gm)] : [...text.matchAll(/"Device Utilization %"=(\d+)/g)]).map(m => Number(m[1]))
  if (!values.length) return undefined
  return clamp((isLinux ? values.reduce((a, b) => a + b, 0) / values.length : Math.max(...values)) / 100)
}
// The graphics processor's memory in bytes: a Mac's in use (it shares the Mac's memory, so there is no whole), a Linux machine's
// GPUs used of their whole (nvidia-smi gives megabytes)
export const gpuMemOf = (text: string, isLinux: boolean): { used: number; total?: number } | undefined => {
  if (!isLinux) {
    const m = /"In use system memory"=(\d+)/.exec(text)
    return m ? { used: Number(m[1]) } : undefined
  }
  const rows = [...text.matchAll(/^\s*\d+(?:\.\d+)?\s*,\s*(\d+)\s*,\s*(\d+)\s*$/gm)]
  return rows.length ? { used: rows.reduce((a, m) => a + Number(m[1]) * 2 ** 20, 0), total: rows.reduce((a, m) => a + Number(m[2]) * 2 ** 20, 0) } : undefined
}
// A program's name as a person knows it: the app a process belongs to, else the command's own name; Claude's in one name
export const appOf = (name: string) => {
  const app = /([^/]+)\.app\//.exec(name)?.[1]
  const own = app ?? name.split('/').pop() ?? name
  // Claude Code's own engine is kept under its version's number (claude/versions/2.1.325); Linux names a process by that bare number
  return /^claude$/i.test(own) || /\/claude\/versions\/[^/]+$/.test(name) || /^\d+\.\d+\.\d+$/.test(name) ? 'Claude' : own
}
// The programs that use the most, each app's processes together, largest first
export const topOf = (amounts: [string, number][], count = 3): UsageTop => {
  const by = new Map<string, number>()
  for (const [name, n] of amounts) by.set(appOf(name), (by.get(appOf(name)) ?? 0) + n)
  return [...by.entries()].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, count)
}
// pmset -g batt: only the Mac's own battery (InternalBattery), never a UPS a desktop is plugged into. The time is taken only as
// pmset says it, never while it is still estimating, and not once the battery is charged
export const batteryOfMac = (text: string): UsageBattery | undefined => {
  const m = /-InternalBattery-\d+[^\n]*?(\d+)%;\s*([^;\n]+);\s*([^\n]*)/.exec(text)
  if (!m || /present:\s*false/.test(m[3] ?? '')) return undefined
  const pct = Number(m[1])
  const said = (m[2] ?? '').trim().toLowerCase()
  // A wording not known here is told by where the power comes from, and is none when that is not said either
  const from = /Now drawing from '([^']+)'/.exec(text)?.[1] ?? ''
  const state = said === 'discharging' ? 'battery' : said === 'charging' || said === 'finishing charge' ? 'charging' : said === 'charged' || said === 'ac attached' ? 'plugged' : from === 'Battery Power' ? 'battery' : from === 'AC Power' ? 'plugged' : 'unknown'
  const t = /(\d+):(\d\d) remaining/.exec(m[3] ?? '')
  const left = t && (state === 'battery' || state === 'charging') ? Number(t[1]) * 60 + Number(t[2]) : 0
  return { pct, state, ...(left > 0 ? { left } : {}) }
}
// /sys/class/power_supply: a supply of type Battery that powers the machine (not a mouse's, whose scope is Device). Linux gives
// no time left of its own, so none is shown
export const batteryOfLinux = (text: string): UsageBattery | undefined => {
  const by = new Map<string, Record<string, string>>()
  for (const m of text.matchAll(/^\/sys\/class\/power_supply\/([^/]+)\/(type|scope|capacity|status):(.*)$/gm)) by.set(m[1] ?? '', { ...(by.get(m[1] ?? '') ?? {}), [m[2] ?? '']: (m[3] ?? '').trim() })
  const all = [...by.values()].filter(b => b.type === 'Battery' && b.scope !== 'Device' && /^\d+$/.test(b.capacity ?? ''))
  if (!all.length) return undefined
  // Two batteries (some laptops have them) read as one: their charge on average, discharging or charging if either is
  const pct = Math.round(all.reduce((sum, b) => sum + Number(b.capacity), 0) / all.length)
  const has = (status: string) => all.some(b => b.status === status)
  const state = has('Discharging') ? 'battery' : has('Charging') ? 'charging' : all.every(b => b.status === 'Full' || b.status === 'Not charging') ? 'plugged' : 'unknown'
  return { pct, state }
}

// The bytes in and out by themselves, over the same ports the speed counts
const netSplitOf = (text: string, isLinux: boolean) => {
  let netIn = 0
  let netOut = 0
  for (const line of text.split('\n')) {
    if (isLinux) {
      const m = /^\s*([^:\s]+):\s*(.*)$/.exec(line)
      if (!m || /^(lo|tailscale|docker|veth|br-|virbr|vnet|vmnet|lxc|podman|wg|tun|tap|ip6tnl|cni|flannel|cali|zt)/.test(m[1] ?? '')) continue
      const f = (m[2] ?? '').trim().split(/\s+/).map(Number)
      netIn += f[0] ?? 0
      netOut += f[8] ?? 0
    } else {
      const t = line.trim().split(/\s+/)
      if (!/^en\d+$/.test(t[0] ?? '') || !(t[2] ?? '').startsWith('<Link')) continue
      const [inAt, outAt] = t.length >= 11 ? [6, 9] : [5, 8]
      netIn += Number(t[inAt] ?? 0)
      netOut += Number(t[outAt] ?? 0)
    }
  }
  return { netIn, netOut }
}

// A Mac's look as running totals; Claude's memory is top's where it has the process, else its resident memory
export const rawOfMac = (text: string, at: number, footprint?: Record<string, number>): UsageRaw | undefined => {
  const s = sectionsOf(text)
  const procs = (s.PS ?? '').split('\n').flatMap(line => {
    const m = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+([\d:.-]+)\s+(.*)$/.exec(line)
    return m ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', mem: Number(m[3]) * 1024, cpu: secondsOfTime(m[4] ?? '0'), name: (m[5] ?? '').trim() }] : []
  })
  const vm = s.VM ?? ''
  const page = Number(/page size of (\d+) bytes/.exec(vm)?.[1] ?? 4096)
  const pages = (label: string) => Number(new RegExp(`^${label}:\\s+(\\d+)`, 'm').exec(vm)?.[1] ?? 0)
  const [memTotal = 0, ncpu = 1] = (s.SYS ?? '').trim().split(/\s+/).map(Number)
  if (!procs.length || !memTotal) return undefined
  // As Activity Monitor's Memory Used: app memory, wired and compressed
  const memUsed = Math.max(0, pages('Anonymous pages') - pages('Pages purgeable') + pages('Pages wired down') + pages('Pages occupied by compressor')) * page
  // iostat -I: the disks by name, then each one's KB/t, transfers and megabytes since it started
  const ioLines = (s.IO ?? '').split('\n').map(line => line.trim())
  const names = (ioLines.find(line => /^disk\d/.test(line)) ?? '').split(/\s+/)
  const ioRow = ioLines.filter(line => /^[\d.\s]+$/.test(line) && line).pop() ?? ''
  const disk: Record<string, number> = {}
  ioRow.split(/\s+/).map(Number).forEach((mb, i) => void (i % 3 === 2 && (disk[names[(i - 2) / 3] ?? `disk-${i}`] = mb * 1024 * 1024)))
  // The Mac's own network ports (en*), not the tunnels that carry the same bytes again
  const net: Record<string, number> = {}
  for (const line of (s.NET ?? '').split('\n')) {
    const t = line.trim().split(/\s+/)
    if (!/^en\d+$/.test(t[0] ?? '') || !(t[2] ?? '').startsWith('<Link')) continue
    const [inAt, outAt] = t.length >= 11 ? [6, 9] : [5, 8]
    net[t[0] ?? ''] = Number(t[inAt] ?? 0) + Number(t[outAt] ?? 0)
  }
  const claude = claudeOf(procs, (s.SELF ?? '').trim())
  const claudeMem = procs.filter(p => claude.has(p.pid)).reduce((sum, p) => sum + (footprint?.[p.pid] ?? p.mem), 0)
  const gpu = gpuOf(s.GPU ?? '', false)
  const gpuMem = gpuMemOf(s.GPU ?? '', false)
  const battery = batteryOfMac(s.BATT ?? '')
  const memTop = topOf(procs.map(p => [p.name, footprint?.[p.pid] ?? p.mem]))
  return { names: Object.fromEntries(procs.map(p => [p.pid, p.name])), memTop, ...(gpuMem ? { gpuMem: gpuMem.used } : {}), ...netSplitOf(s.NET ?? '', false), at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed, memTotal, ncpu: ncpu || 1, disk, net, ...(gpu !== undefined ? { gpu } : {}), ...(battery ? { battery } : {}) }
}

// A Linux look: processes from /proc/<pid>/stat (Claude's memory is each process's resident memory less what it shares)
export const rawOfLinux = (text: string, at: number): UsageRaw | undefined => {
  const s = sectionsOf(text)
  const [page = 4096, tck = 100] = (s.SYS ?? '').split('\n').slice(0, 2).map(Number)
  const cpuLine = (s.SYS ?? '').split('\n').find(line => line.startsWith('cpu ')) ?? ''
  const ticks = cpuLine.trim().split(/\s+/).slice(1).map(Number)
  const all = ticks.slice(0, 8).reduce((a, b) => a + b, 0) / tck
  const busy = all - ((ticks[3] ?? 0) + (ticks[4] ?? 0)) / tck
  const statm = new Map<string, number>()
  for (const m of (s.STATM ?? '').matchAll(/^\/proc\/(\d+)\/statm:\d+\s+(\d+)\s+(\d+)/gm)) statm.set(m[1] ?? '', Math.max(0, Number(m[2]) - Number(m[3])) * page)
  const procs = (s.STAT ?? '').split('\n').flatMap(line => {
    const m = /^\/proc\/(\d+)\/stat:\d+ \((.*)\) (.*)$/.exec(line)
    if (!m) return []
    const f = (m[3] ?? '').split(' ')
    return [{ pid: m[1] ?? '', ppid: f[1] ?? '', cpu: (Number(f[11]) + Number(f[12])) / tck, mem: statm.get(m[1] ?? '') ?? Number(f[21] ?? 0) * page, name: m[2] ?? '' }]
  })
  const kb = (label: string) => Number(new RegExp(`^${label}:\\s+(\\d+)`, 'm').exec(s.MEM ?? '')?.[1] ?? 0) * 1024
  const memTotal = kb('MemTotal')
  if (!procs.length || !memTotal) return undefined
  // Whole disks only, not their partitions: 512-byte sectors read and written
  const disk: Record<string, number> = {}
  for (const line of (s.DISK ?? '').split('\n')) {
    const f = line.trim().split(/\s+/)
    if (/^(sd[a-z]+|vd[a-z]+|xvd[a-z]+|hd[a-z]+|nvme\d+n\d+|mmcblk\d+)$/.test(f[2] ?? '')) disk[f[2] ?? ''] = (Number(f[5]) + Number(f[9])) * 512
  }
  // The machine's own ports, not loopback, tunnels or containers' bridges
  const net: Record<string, number> = {}
  for (const line of (s.NET ?? '').split('\n')) {
    const m = /^\s*([^:\s]+):\s*(.*)$/.exec(line)
    if (!m || /^(lo|tailscale|docker|veth|br-|virbr|vnet|vmnet|lxc|podman|wg|tun|tap|ip6tnl|cni|flannel|cali|zt)/.test(m[1] ?? '')) continue
    const f = (m[2] ?? '').trim().split(/\s+/).map(Number)
    net[m[1] ?? ''] = (f[0] ?? 0) + (f[8] ?? 0)
  }
  const claude = claudeOf(procs, (s.SELF ?? '').trim())
  const claudeMem = procs.filter(p => claude.has(p.pid)).reduce((sum, p) => sum + p.mem, 0)
  const gpu = gpuOf(s.GPU ?? '', true)
  const gpuMem = gpuMemOf(s.GPU ?? '', true)
  const battery = batteryOfLinux(s.BATT ?? '')
  const memTop = topOf(procs.map(p => [p.name, p.mem]))
  return { names: Object.fromEntries(procs.map(p => [p.pid, p.name])), memTop, ...(gpuMem ? { gpuMem: gpuMem.used, ...(gpuMem.total ? { gpuMemTotal: gpuMem.total } : {}) } : {}), ...netSplitOf(s.NET ?? '', true), at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed: Math.max(0, memTotal - kb('MemAvailable')), memTotal, ncpu: 1, disk, net, busy, all, ...(gpu !== undefined ? { gpu } : {}), ...(battery ? { battery } : {}) }
}

// Bytes moved between two looks by the disks or ports that were in both
const movedOf = (prev: Record<string, number>, cur: Record<string, number>) =>
  Object.entries(cur).reduce((sum, [name, n]) => sum + (typeof prev[name] === 'number' ? Math.max(0, n - (prev[name] ?? 0)) : 0), 0)
// The figures from two looks: memory from the newer alone, the rest from what moved between them
export const figuresOf = (prev: UsageRaw | undefined, cur: UsageRaw): UsageFigures => {
  // Memory, the graphics processor and the battery from the newer look alone
  const memory = {
    memUsed: cur.memUsed,
    memTotal: cur.memTotal,
    memClaude: Math.min(cur.claudeMem, cur.memUsed || cur.claudeMem),
    ncpu: cur.ncpu,
    disks: Object.keys(cur.disk),
    ports: Object.keys(cur.net),
    ...(cur.memTop?.length ? { memTop: cur.memTop } : {}),
    ...(cur.gpu !== undefined ? { gpu: cur.gpu } : {}),
    ...(cur.gpuMem !== undefined ? { gpuMem: cur.gpuMem } : {}),
    ...(cur.gpuMemTotal !== undefined ? { gpuMemTotal: cur.gpuMemTotal } : {}),
    ...(cur.battery ? { battery: cur.battery } : {}),
  }
  const span = prev ? (cur.at - prev.at) / 1000 : 0
  if (!prev || span < 1 || span * 1000 > USAGE_GAP) return memory
  // Each process's time since the last look; one not there then started since, so all its time is new
  const claude = new Set(cur.claude)
  let used = 0
  let mine = 0
  const each: [string, number][] = []
  for (const [pid, t] of Object.entries(cur.cpu)) {
    const was = prev.cpu[pid]
    const d = was === undefined || was > t ? t : t - was
    used += d
    if (claude.has(pid)) mine += d
    if (cur.names?.[pid]) each.push([cur.names[pid] ?? '', d])
  }
  const whole = cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? cur.all - prev.all : span * cur.ncpu
  const cpu = cur.busy !== undefined && prev.busy !== undefined && cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? clamp((cur.busy - prev.busy) / whole) : clamp(used / whole)
  const cpuTop = topOf(each).map(([name, d]): [string, number] => [name, clamp(d / whole)])
  const split = cur.netIn !== undefined && prev.netIn !== undefined && cur.netOut !== undefined && prev.netOut !== undefined && cur.netIn >= prev.netIn && cur.netOut >= prev.netOut
  return {
    ...memory,
    cpu,
    cpuClaude: Math.min(cpu, clamp(mine / whole)),
    ...(cpuTop.length ? { cpuTop } : {}),
    disk: movedOf(prev.disk ?? {}, cur.disk) / span,
    net: movedOf(prev.net ?? {}, cur.net) / span,
    ports: Object.keys(cur.net).filter(name => typeof prev.net?.[name] === 'number' && (cur.net[name] ?? 0) > (prev.net[name] ?? 0)),
    disks: Object.keys(cur.disk).filter(name => typeof prev.disk?.[name] === 'number' && (cur.disk[name] ?? 0) > (prev.disk[name] ?? 0)),
    ...(split ? { netIn: ((cur.netIn ?? 0) - (prev.netIn ?? 0)) / span, netOut: ((cur.netOut ?? 0) - (prev.netOut ?? 0)) / span } : {}),
  }
}

// The next kept state from a look: top's memory kept for a minute, the figures against the look before
export const nextKept = (was: UsageKept | undefined, text: string, at: number, isLinux: boolean, isTop = false): UsageKept | undefined => {
  const top = isLinux ? {} : footprintOf(sectionsOf(text).TOP ?? '')
  const footprint = Object.keys(top).length ? { at, byPid: top } : was?.footprint && at - was.footprint.at < FOOTPRINT_EVERY * 3 ? was.footprint : undefined
  const raw = isLinux ? rawOfLinux(text, at) : rawOfMac(text, at, footprint?.byPid)
  if (!raw) return undefined
  const topAt = isTop ? at : was?.topAt
  const { names: _names, ...kept } = raw
  return { at, raw: kept, figures: figuresOf(was?.raw, raw), ...(footprint ? { footprint } : {}), ...(topAt !== undefined ? { topAt } : {}) }
}
// The shared file's state, when it reads as one
export const keptOf = (text: string): UsageKept | undefined => {
  try {
    const kept = JSON.parse(text) as UsageKept
    return typeof kept?.at === 'number' && kept.raw && typeof kept.raw.disk === 'object' && kept.figures ? kept : undefined
  } catch {
    return undefined
  }
}

// ---- How the figures read ----
const GB = 1024 ** 3
export const gbText = (bytes: number) => {
  const gb = bytes / GB
  return gb < 10 ? `${gb.toFixed(1).replace(/\.0$/, '')}` : `${Math.round(gb)}`
}
// A speed in the fewest characters, so the line fits a phone: whole MB/s, a tenth under one, GB/s past a thousand megabytes
export const rateText = (perSecond: number): [string, string] => {
  const mb = perSecond / 1e6
  if (mb >= 999.5) return [(mb / 1000).toFixed(1).replace(/\.0$/, ''), 'GB/s']
  if (mb >= 0.95) return [String(Math.round(mb)), 'MB/s']
  return [mb.toFixed(1).replace(/\.0$/, '').replace(/^0\.0$/, '0'), 'MB/s']
}
export const pctText = (part: number) => `${Math.round(part * 100)}`
// Time left as the system says it, hours:minutes
export const leftText = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`
// A battery on its own power at a fifth or less turns amber
export const BATTERY_LOW = 20
export const isBatteryLow = (b: UsageBattery) => b.state === 'battery' && b.pct <= BATTERY_LOW
export const isMemoryHigh = (f: UsageFigures) => f.memTotal > 0 && f.memUsed / f.memTotal > MEMORY_WARN

// A meter's parts in whole steps: Claude's first, then the rest in use; a part that is there is never drawn as none
export const meterOf = (claude: number, used: number, steps: number) => {
  const mine = claude > 0.005 ? Math.max(1, Math.round(clamp(claude) * steps)) : 0
  const all = Math.max(mine, used > 0.005 ? Math.max(1, Math.round(clamp(used) * steps)) : 0)
  return { mine: Math.min(mine, steps), rest: Math.min(all, steps) - Math.min(mine, steps) }
}

// ---- The small drawings, for a surface that draws SVG ----
export const USAGE_PURPLE = '#8A63F0'
export const USAGE_AMBER = '#E5A50A'
export const USAGE_GREY = '#9A9A9A'
// The icons a little lighter than the meters' grey, as the numbers beside them are
const ICON_GREY = '#BDBDBD'
const TRACK = 'rgba(154,154,154,0.28)'
const ICON = 15
const METER_W = 18
const METER_H = 8
const H = 16
const icons: Record<'memory' | 'cpu' | 'gpu' | 'disk' | 'net', (c: string) => string> = {
  // A memory stick: its board with chips and the pins beneath
  memory: c =>
    `<rect x="1" y="4" width="12" height="6" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><rect x="3" y="6" width="2" height="2" fill="${c}"/><rect x="6" y="6" width="2" height="2" fill="${c}"/><rect x="9" y="6" width="2" height="2" fill="${c}"/><path d="M3 10v2M5.5 10v2M8.5 10v2M11 10v2" stroke="${c}" stroke-width="1.2"/>`,
  // A chip with pins on each side
  cpu: c =>
    `<rect x="3.5" y="3.5" width="7" height="7" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><rect x="5.5" y="5.5" width="3" height="3" fill="${c}"/><path d="M5.5 1.5v2M8.5 1.5v2M5.5 10.5v2M8.5 10.5v2M1.5 5.5h2M1.5 8.5h2M10.5 5.5h2M10.5 8.5h2" stroke="${c}" stroke-width="1.2"/>`,
  // A disk drive's stacked platters
  disk: c =>
    `<ellipse cx="7" cy="3.5" rx="5" ry="2" fill="none" stroke="${c}" stroke-width="1.3"/><path d="M2 3.5v7c0 1.1 2.2 2 5 2s5-.9 5-2v-7M2 7c0 1.1 2.2 2 5 2s5-.9 5-2" fill="none" stroke="${c}" stroke-width="1.3"/>`,
  // A graphics card: its board, a fan, and the pins beneath
  gpu: c =>
    `<rect x="1" y="3" width="12" height="7.5" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><circle cx="7" cy="6.75" r="2" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M3 10.5v1.8M5 10.5v1.8M9 10.5v1.8M11 10.5v1.8" stroke="${c}" stroke-width="1.1"/>`,
  // Up and down arrows
  net: c => `<path d="M4.5 12V2M2 4.5L4.5 2L7 4.5M9.5 2v10M7 9.5L9.5 12L12 9.5" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
}
// An icon alone, or with its meter: Claude's part purple, the rest in use grey (amber when memory is near full), the room left faint
export const usageSvg = (icon: keyof typeof icons, meter?: { claude: number; used: number; isHigh?: boolean }) => {
  const color = meter?.isHigh ? USAGE_AMBER : USAGE_GREY
  const iconColor = meter?.isHigh ? USAGE_AMBER : ICON_GREY
  const width = (meter ? ICON + 3 + METER_W : ICON) + 3
  const top = (H - ICON) / 2
  const parts = [`<g transform="translate(0 ${top}) scale(${ICON / 14})">${icons[icon](iconColor)}</g>`]
  if (meter) {
    // Claude's part at least two pixels, so a small one is still seen beside amber
    const parts18 = meterOf(meter.claude, meter.used, METER_W)
    const mine = parts18.mine ? Math.max(2, parts18.mine) : 0
    const rest = Math.max(0, Math.min(METER_W, parts18.mine + parts18.rest, METER_W) - mine)
    const clip = `meter-${icon}`
    const x = ICON + 3
    const y = (H - METER_H) / 2
    parts.push(
      `<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${METER_W}" height="${METER_H}" rx="2"/></clipPath><g clip-path="url(#${clip})"><rect x="${x}" y="${y}" width="${METER_W}" height="${METER_H}" fill="${TRACK}"/>${mine ? `<rect x="${x}" y="${y}" width="${mine}" height="${METER_H}" fill="${USAGE_PURPLE}"/>` : ''}${rest ? `<rect x="${x + mine}" y="${y}" width="${rest}" height="${METER_H}" fill="${color}"/>` : ''}</g>`,
    )
  }
  return { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}">${parts.join('')}</svg>`, width, height: H }
}

// The battery: its body filled to the charge (amber when low), a bolt before it while charging, a plug while it sits on power
export const batterySvg = (b: UsageBattery) => {
  const color = isBatteryLow(b) ? USAGE_AMBER : ICON_GREY
  const mark = b.state === 'charging' || b.state === 'plugged' ? 8 : 0
  const x = mark
  const fill = Math.max(b.pct > 0 ? 1 : 0, Math.round((Math.min(100, Math.max(0, b.pct)) / 100) * 13))
  const bolt = `<path d="M4.2 2.5L1 8.6h2.6L2.8 13.5L6.4 7.2H3.8z" fill="${USAGE_PURPLE}"/>`
  const plug = `<path d="M2.2 3v2.4M4.8 3v2.4" stroke="${ICON_GREY}" stroke-width="1.2" stroke-linecap="round"/><path d="M1 5.4h5v2.2a2.5 2.5 0 0 1-5 0z" fill="${ICON_GREY}"/><path d="M3.5 10v3" stroke="${ICON_GREY}" stroke-width="1.2"/>`
  const width = x + 20 + 3
  const parts = [
    b.state === 'charging' ? bolt : b.state === 'plugged' ? plug : '',
    `<rect x="${x + 0.65}" y="4.15" width="16.7" height="7.7" rx="2" fill="none" stroke="${color}" stroke-width="1.3"/>`,
    `<rect x="${x + 18}" y="6.3" width="1.6" height="3.4" rx="0.6" fill="${color}"/>`,
    fill ? `<rect x="${x + 2.5}" y="6" width="${fill}" height="4" rx="0.8" fill="${color}"/>` : '',
  ]
  return { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}">${parts.join('')}</svg>`, width, height: H }
}
