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
  `echo "@@SELF@@ $PPID"; echo @@PS@@; ps -axo pid=,ppid=,rss=,time=,comm=; echo @@VM@@; vm_stat; echo @@SYS@@; sysctl -n hw.memsize hw.ncpu; echo @@IO@@; iostat -Id -c 1; echo @@NET@@; netstat -ibn${isTop ? '; echo @@TOP@@; top -l 1 -stats pid,mem' : ''}`
// One look on Linux, all from /proc
export const USAGE_LINUX =
  "echo \"@@SELF@@ $PPID\"; echo @@STAT@@; grep -H '' /proc/[0-9]*/stat 2>/dev/null; echo @@STATM@@; grep -H '' /proc/[0-9]*/statm 2>/dev/null; echo @@SYS@@; getconf PAGESIZE; getconf CLK_TCK; head -n 1 /proc/stat; echo @@MEM@@; cat /proc/meminfo; echo @@DISK@@; cat /proc/diskstats; echo @@NET@@; cat /proc/net/dev"

// A process: its parent, its processor time in seconds, its memory in bytes, its name
export type UsageProc = { pid: string; ppid: string; cpu: number; mem: number; name: string }
// One look's running totals. busy and all are the whole computer's processor seconds where it counts them (Linux); disk and net are
// bytes moved since it started
export type UsageRaw = { at: number; cpu: Record<string, number>; claude: string[]; claudeMem: number; memUsed: number; memTotal: number; ncpu: number; disk: number; net: number; busy?: number; all?: number }
// What the line shows: bytes, parts of the whole processor (0 to 1), bytes a second
export type UsageFigures = { memUsed: number; memTotal: number; memClaude: number; cpu?: number; cpuClaude?: number; disk?: number; net?: number }
// What is kept between looks, in the shared file: the last look, its figures, and top's memory of each process when last asked
export type UsageKept = { at: number; raw: UsageRaw; figures: UsageFigures; footprint?: { at: number; byPid: Record<string, number> } }

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
  // iostat -I: each disk's KB/t, transfers and megabytes since it started
  const ioRow = (s.IO ?? '').split('\n').map(line => line.trim()).filter(line => /^[\d.\s]+$/.test(line) && line).pop() ?? ''
  const disk = ioRow.split(/\s+/).map(Number).filter((_, i) => i % 3 === 2).reduce((sum, mb) => sum + mb * 1024 * 1024, 0)
  // The Mac's own network ports (en*), not the tunnels that carry the same bytes again
  let net = 0
  for (const line of (s.NET ?? '').split('\n')) {
    const t = line.trim().split(/\s+/)
    if (!/^en\d+$/.test(t[0] ?? '') || !(t[2] ?? '').startsWith('<Link')) continue
    const [inAt, outAt] = t.length >= 11 ? [6, 9] : [5, 8]
    net += Number(t[inAt] ?? 0) + Number(t[outAt] ?? 0)
  }
  const claude = claudeOf(procs, (s.SELF ?? '').trim())
  const claudeMem = procs.filter(p => claude.has(p.pid)).reduce((sum, p) => sum + (footprint?.[p.pid] ?? p.mem), 0)
  return { at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed, memTotal, ncpu: ncpu || 1, disk, net }
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
  let disk = 0
  for (const line of (s.DISK ?? '').split('\n')) {
    const f = line.trim().split(/\s+/)
    if (/^(sd[a-z]+|vd[a-z]+|xvd[a-z]+|hd[a-z]+|nvme\d+n\d+|mmcblk\d+)$/.test(f[2] ?? '')) disk += (Number(f[5]) + Number(f[9])) * 512
  }
  // The machine's own ports, not loopback, tunnels or containers' bridges
  let net = 0
  for (const line of (s.NET ?? '').split('\n')) {
    const m = /^\s*([^:\s]+):\s*(.*)$/.exec(line)
    if (!m || /^(lo|tailscale|docker|veth|br-|virbr|wg|tun|tap|cni|flannel|cali|zt)/.test(m[1] ?? '')) continue
    const f = (m[2] ?? '').trim().split(/\s+/).map(Number)
    net += (f[0] ?? 0) + (f[8] ?? 0)
  }
  const claude = claudeOf(procs, (s.SELF ?? '').trim())
  const claudeMem = procs.filter(p => claude.has(p.pid)).reduce((sum, p) => sum + p.mem, 0)
  return { at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed: Math.max(0, memTotal - kb('MemAvailable')), memTotal, ncpu: 1, disk, net, busy, all }
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))
// The figures from two looks: memory from the newer alone, the rest from what moved between them
export const figuresOf = (prev: UsageRaw | undefined, cur: UsageRaw): UsageFigures => {
  const memory = { memUsed: cur.memUsed, memTotal: cur.memTotal, memClaude: Math.min(cur.claudeMem, cur.memUsed || cur.claudeMem) }
  const span = prev ? (cur.at - prev.at) / 1000 : 0
  if (!prev || span < 1 || span * 1000 > USAGE_GAP) return memory
  // Each process's time since the last look; one not there then started since, so all its time is new
  const claude = new Set(cur.claude)
  let used = 0
  let mine = 0
  for (const [pid, t] of Object.entries(cur.cpu)) {
    const was = prev.cpu[pid]
    const d = was === undefined || was > t ? t : t - was
    used += d
    if (claude.has(pid)) mine += d
  }
  const whole = cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? cur.all - prev.all : span * cur.ncpu
  const cpu = cur.busy !== undefined && prev.busy !== undefined && cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? clamp((cur.busy - prev.busy) / whole) : clamp(used / whole)
  return { ...memory, cpu, cpuClaude: Math.min(cpu, clamp(mine / whole)), disk: Math.max(0, cur.disk - prev.disk) / span, net: Math.max(0, cur.net - prev.net) / span }
}

// The next kept state from a look: top's memory kept for a minute, the figures against the look before
export const nextKept = (was: UsageKept | undefined, text: string, at: number, isLinux: boolean): UsageKept | undefined => {
  const top = isLinux ? {} : footprintOf(sectionsOf(text).TOP ?? '')
  const footprint = Object.keys(top).length ? { at, byPid: top } : was?.footprint && at - was.footprint.at < FOOTPRINT_EVERY * 3 ? was.footprint : undefined
  const raw = isLinux ? rawOfLinux(text, at) : rawOfMac(text, at, footprint?.byPid)
  if (!raw) return undefined
  return { at, raw, figures: figuresOf(was?.raw, raw), ...(footprint ? { footprint } : {}) }
}
// The shared file's state, when it reads as one
export const keptOf = (text: string): UsageKept | undefined => {
  try {
    const kept = JSON.parse(text) as UsageKept
    return typeof kept?.at === 'number' && kept.raw && kept.figures ? kept : undefined
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
// A speed in the fewest characters: MB/s, a tenth under ten, GB/s past a thousand megabytes
export const rateText = (perSecond: number): [string, string] => {
  const mb = perSecond / 1e6
  if (mb >= 1000) return [(mb / 1000).toFixed(1).replace(/\.0$/, ''), 'GB/s']
  if (mb >= 9.95) return [String(Math.round(mb)), 'MB/s']
  return [mb.toFixed(1).replace(/\.0$/, ''), 'MB/s']
}
export const pctText = (part: number) => `${Math.round(part * 100)}`
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
const TRACK = 'rgba(154,154,154,0.28)'
const ICON = 14
const METER_W = 18
const METER_H = 8
const H = 16
const icons: Record<'memory' | 'cpu' | 'disk' | 'net', (c: string) => string> = {
  // A memory stick: its board with chips and the pins beneath
  memory: c =>
    `<rect x="1" y="4" width="12" height="6" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><rect x="3" y="6" width="2" height="2" fill="${c}"/><rect x="6" y="6" width="2" height="2" fill="${c}"/><rect x="9" y="6" width="2" height="2" fill="${c}"/><path d="M3 10v2M5.5 10v2M8.5 10v2M11 10v2" stroke="${c}" stroke-width="1.2"/>`,
  // A chip with pins on each side
  cpu: c =>
    `<rect x="3.5" y="3.5" width="7" height="7" rx="1" fill="none" stroke="${c}" stroke-width="1.3"/><rect x="5.5" y="5.5" width="3" height="3" fill="${c}"/><path d="M5.5 1.5v2M8.5 1.5v2M5.5 10.5v2M8.5 10.5v2M1.5 5.5h2M1.5 8.5h2M10.5 5.5h2M10.5 8.5h2" stroke="${c}" stroke-width="1.2"/>`,
  // A disk drive's stacked platters
  disk: c =>
    `<ellipse cx="7" cy="3.5" rx="5" ry="2" fill="none" stroke="${c}" stroke-width="1.3"/><path d="M2 3.5v7c0 1.1 2.2 2 5 2s5-.9 5-2v-7M2 7c0 1.1 2.2 2 5 2s5-.9 5-2" fill="none" stroke="${c}" stroke-width="1.3"/>`,
  // Up and down arrows
  net: c => `<path d="M4.5 12V2M2 4.5L4.5 2L7 4.5M9.5 2v10M7 9.5L9.5 12L12 9.5" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
}
// An icon alone, or with its meter: Claude's part purple, the rest in use grey (amber when memory is near full), the room left faint
export const usageSvg = (icon: keyof typeof icons, meter?: { claude: number; used: number; isHigh?: boolean }) => {
  const color = meter?.isHigh ? USAGE_AMBER : USAGE_GREY
  const width = (meter ? ICON + 3 + METER_W : ICON) + 3
  const top = (H - ICON) / 2
  const parts = [`<g transform="translate(0 ${top})">${icons[icon](color)}</g>`]
  if (meter) {
    const { mine, rest } = meterOf(meter.claude, meter.used, METER_W)
    const x = ICON + 3
    const y = (H - METER_H) / 2
    parts.push(
      `<clipPath id="m"><rect x="${x}" y="${y}" width="${METER_W}" height="${METER_H}" rx="2"/></clipPath><g clip-path="url(#m)"><rect x="${x}" y="${y}" width="${METER_W}" height="${METER_H}" fill="${TRACK}"/>${mine ? `<rect x="${x}" y="${y}" width="${mine}" height="${METER_H}" fill="${USAGE_PURPLE}"/>` : ''}${rest ? `<rect x="${x + mine}" y="${y}" width="${rest}" height="${METER_H}" fill="${color}"/>` : ''}</g>`,
    )
  }
  return { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}">${parts.join('')}</svg>`, width, height: H }
}
