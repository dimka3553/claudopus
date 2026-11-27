// How Claude uses this computer, for the line above the prompt: memory in use and Claude's part of it, how busy the processor is
// and Claude's part of that, and how fast the disk and the network move. One cheap shell look every few seconds, shared by every
// chat on the computer through a small file; the figures come from two looks in a row. Nothing here touches the engine

// How often the computer is looked at, and how often (on a Mac) top is asked for each process's own memory, which costs about half
// a second of the processor where ps costs a hundredth
export const USAGE_EVERY = 5_000
export const FOOTPRINT_EVERY = 60_000
// On battery, less often: the whole look costs about 0.4 s of the processor and top 2.6 s on a Mac with many processes (27 Nov),
// a sixth of a core while work ran, measured with the Mac drawing 50 to 60 W on battery
export const USAGE_BATTERY_EVERY = 15_000
export const FOOTPRINT_BATTERY_EVERY = 5 * 60_000
// Two looks further apart than this give no rates
const USAGE_GAP = 120_000
// Memory past this part of the whole turns amber
export const MEMORY_WARN = 0.9

// (a lean look, isMore false, leaves out what only the figures' cards show or what moves slowly, each a process or several: the
// battery and the power, each process's network, disk and energy; nextKept keeps those from the last look that had them. `sys` is
// the memory and the cores as an earlier look told them, which never change, in place of asking again)
// One look on a Mac: the engine's own process, every process with its parent, memory and processor time, the memory as Activity
// Monitor counts it, the disks' and the network's running totals, and now and then top's own memory of each process
export const usageMac = (isTop: boolean, isMore = true, sys = '') =>
  `echo "@@SELF@@ $PPID"; echo @@PS@@; ps -axo pid=,ppid=,rss=,time=,pgid=,comm=; echo @@VM@@; vm_stat; echo @@SYS@@; ${sys ? `echo ${sys}` : 'sysctl -n hw.memsize hw.ncpu'}; echo @@LOAD@@; sysctl -n vm.loadavg; echo @@IO@@; iostat -Id -c 1; echo @@NET@@; netstat -ibn; echo @@GPU@@; ioreg -r -d 1 -w 0 -c IOAccelerator | grep -oE '"(Device Utilization %|In use system memory)"=[0-9]+'${isMore ? `; echo @@BATT@@; pmset -g batt; echo @@POWER@@; ioreg -rn AppleSmartBattery -w0 | grep -oE '"(SystemLoad|SystemPowerIn|Voltage|InstantAmperage|Watts)" ?= ?[0-9]+'` : ''}; echo @@GPUP@@; ioreg -r -c AGXDeviceUserClient -l -w0 | grep -E '"AppUsage"|"IOUserClientCreator"'${isMore ? `; echo @@NETP@@; nettop -n -P -L 1 -x -J bytes_in,bytes_out 2>/dev/null; echo @@RU@@; ${USAGE_RU}` : '; echo @@LEAN@@'}${isTop ? '; echo @@TOP@@; top -l 1 -stats pid,mem' : ''}`
// Each process's disk bytes read and written and the energy its processors used (nanojoules), as the Mac keeps them for Activity
// Monitor: libproc's proc_pid_rusage, through the system's Python, and only where the developer tools are there, as without them
// /usr/bin/python3 asks to install them. A process of another user gives nothing. Then the whole processors' and the graphics
// processor's energy since the Mac started, in nanojoules, from IOReport's Energy Model (what powermetrics reads, with no admin):
// a line "E <processors> <graphics>", none on a Mac without it. The two cost a few hundredths of a second together
const USAGE_RU =
  `xcode-select -p >/dev/null 2>&1 && /usr/bin/python3 -I -c 'import ctypes as c\nL=c.CDLL("/usr/lib/libproc.dylib");P=(c.c_int*8192)();k=L.proc_listallpids(P,c.sizeof(P));B=(c.c_uint64*60)()\nfor p in P[:k]:\n if p>0 and L.proc_pid_rusage(p,6,B)==0:print(p,B[18],B[19],B[42])\ntry:\n V=c.c_void_p;I=c.CDLL("/usr/lib/libIOReport.dylib");F=c.CDLL("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation")\n for f,r,a in ((F.CFStringCreateWithCString,V,[V,c.c_char_p,c.c_uint32]),(F.CFDictionaryGetValue,V,[V,V]),(F.CFArrayGetCount,c.c_long,[V]),(F.CFArrayGetValueAtIndex,V,[V,c.c_long]),(F.CFStringGetCString,c.c_bool,[V,c.c_char_p,c.c_long,c.c_uint32]),(I.IOReportCopyChannelsInGroup,V,[V,V,c.c_uint64,c.c_uint64,c.c_uint64]),(I.IOReportCreateSubscription,V,[V,V,c.POINTER(V),c.c_uint64,V]),(I.IOReportCreateSamples,V,[V,V,V]),(I.IOReportChannelGetChannelName,V,[V]),(I.IOReportChannelGetUnitLabel,V,[V]),(I.IOReportSimpleGetIntegerValue,c.c_int64,[V,c.c_int32])):f.restype=r;f.argtypes=a\n S=lambda t:F.CFStringCreateWithCString(None,t,134217984)\n def T(r):\n  b=c.create_string_buffer(64);F.CFStringGetCString(r,b,64,134217984);return b.value.decode()\n h=I.IOReportCopyChannelsInGroup(S(b"Energy Model"),None,0,0,0);d=V();a=F.CFDictionaryGetValue(I.IOReportCreateSamples(I.IOReportCreateSubscription(None,h,c.byref(d),0,None),h,None),S(b"IOReportChannels"));E={}\n for i in range(F.CFArrayGetCount(a)):\n  x=F.CFArrayGetValueAtIndex(a,i);E[T(I.IOReportChannelGetChannelName(x))]=I.IOReportSimpleGetIntegerValue(x,0)*{"mJ":10**6,"uJ":10**3,"nJ":1}.get(T(I.IOReportChannelGetUnitLabel(x)),0)\n if E.get("CPU Energy",0)>0 and "GPU Energy" in E:print("E",E["CPU Energy"],E["GPU Energy"])\nexcept Exception:pass' 2>/dev/null`
// One look on Linux, from /proc and /sys, and nvidia-smi where the machine has one (bounded, as a GPU with no driver kept loaded is slow
// to answer). A graphics card asleep (its display device, not its sound) is left asleep: then there is no GPU figure. Files are read by
// the shell itself, so the look starts no process per device
export const USAGE_LINUX =
  "echo \"@@SELF@@ $PPID\"; echo @@STAT@@; grep -H '' /proc/[0-9]*/stat 2>/dev/null; echo @@STATM@@; grep -H '' /proc/[0-9]*/statm 2>/dev/null; echo @@SYS@@; getconf PAGESIZE; getconf CLK_TCK; head -n 1 /proc/stat; echo @@LOAD@@; cat /proc/loadavg; getconf _NPROCESSORS_ONLN; echo @@MEM@@; cat /proc/meminfo; echo @@DISK@@; cat /proc/diskstats; echo @@NET@@; cat /proc/net/dev; echo @@GPU@@; asleep=; for d in /sys/bus/pci/devices/*; do c=; v=; p=; { read c < $d/class; } 2>/dev/null; case \"$c\" in 0x03*) { read v < $d/vendor; read p < $d/power/runtime_status; } 2>/dev/null; case \"$v\" in 0x10de|0x1002) [ \"$p\" = suspended ] && asleep=1;; esac;; esac; done; if [ -n \"$asleep\" ]; then :; elif command -v nvidia-smi >/dev/null 2>&1; then timeout 2 nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits 2>/dev/null; else cat /sys/class/drm/card*/device/gpu_busy_percent 2>/dev/null; fi; echo @@BATT@@; grep -H '' /sys/class/power_supply/*/type /sys/class/power_supply/*/scope /sys/class/power_supply/*/capacity /sys/class/power_supply/*/status /sys/class/power_supply/*/power_now /sys/class/power_supply/*/current_now /sys/class/power_supply/*/voltage_now 2>/dev/null; true"

// One look on Windows, by PowerShell, a single call: the engine (the parent of the PowerShell it starts), the memory in kilobytes
// and the logical processors, every process with its parent, its memory in use, its processor time (in tenths of a microsecond) and
// its name, each disk's and network port's bytes moved since Windows started (its performance counters' running totals), and the
// battery, if there is one. Every value is written with no double quote, as the command line carries it to PowerShell whole
export const USAGE_WINDOWS = [
  "$ErrorActionPreference = 'SilentlyContinue'",
  '$p = @(Get-CimInstance Win32_Process)',
  "'@@SELF@@ ' + ($p | Where-Object ProcessId -eq $PID).ParentProcessId",
  "'@@SYS@@'",
  '$o = Get-CimInstance Win32_OperatingSystem',
  "'' + $o.TotalVisibleMemorySize + ' ' + $o.FreePhysicalMemory + ' ' + (Get-CimInstance Win32_ComputerSystem).NumberOfLogicalProcessors",
  "'@@PS@@'",
  "$p | ForEach-Object { '' + $_.ProcessId + ' ' + $_.ParentProcessId + ' ' + $_.WorkingSetSize + ' ' + ($_.KernelModeTime + $_.UserModeTime) + ' ' + $_.Name }",
  "'@@DISK@@'",
  "Get-CimInstance Win32_PerfRawData_PerfDisk_PhysicalDisk | Where-Object Name -ne '_Total' | ForEach-Object { $_.Name + [char]9 + ($_.DiskReadBytesPersec + $_.DiskWriteBytesPersec) }",
  "'@@NET@@'",
  'Get-CimInstance Win32_PerfRawData_Tcpip_NetworkInterface | ForEach-Object { $_.Name + [char]9 + $_.BytesReceivedPersec + [char]9 + $_.BytesSentPersec }',
  "'@@BATT@@'",
  "Get-CimInstance Win32_Battery | ForEach-Object { '' + $_.EstimatedChargeRemaining + ' ' + $_.BatteryStatus + ' ' + $_.EstimatedRunTime }",
].join('; ')

// A process: its parent, its processor time in seconds, its memory in bytes, its name
export type UsageProc = { pid: string; ppid: string; pgid?: string; cpu: number; mem: number; name: string }
// One look's running totals. busy and all are the whole computer's processor seconds where it counts them (Linux); disk and net are
// bytes moved since it started, by each disk and port, so one that comes or goes between looks moves no speed
// The battery as the system reports it: its charge in percent, whether it runs on it, charges, or sits on power, and the time left
// (to empty on battery, to full while charging) in minutes, only when the system gives one
// finishing: macOS's own "finishing charge", the last topping up it does once it already calls the charge full or nearly
export type UsageBattery = { pct: number; state: 'battery' | 'charging' | 'plugged' | 'unknown'; left?: number; finishing?: true }
// The programs that use the most, by name, for the detail a pointer on a figure shows: [name, bytes] or [name, part of the processor]
export type UsageTop = [string, number][]
export type UsageRaw = { slowAt?: number; load?: number; loadCores?: number; energyAll?: true; cpuNj?: number; gpuNj?: number; gpuNs?: Record<string, number>; netInBy?: Record<string, number>; netOutBy?: Record<string, number>; diskBy?: Record<string, number>; energyBy?: Record<string, number>; watts?: number; battIn?: number; powerIn?: number; adapter?: number; names?: Record<string, string>; memTop?: UsageTop; gpuMem?: number; gpuMemTotal?: number; netIn?: number; netOut?: number; gpu?: number; battery?: UsageBattery; at: number; cpu: Record<string, number>; claude: string[]; claudeMem: number; memUsed: number; memTotal: number; ncpu: number; disk: Record<string, number>; net: Record<string, number>; busy?: number; all?: number }
// What the line shows: bytes, parts of the whole processor (0 to 1), bytes a second
export type UsageFigures = { load?: number; loadCores?: number; gpuTop?: UsageTop; wattsCpu?: number; wattsGpu?: number; wattsGpuClaude?: number; gpuClaude?: number; diskClaude?: number; netInClaude?: number; netOutClaude?: number; wattsClaude?: number; watts?: number; battIn?: number; powerIn?: number; adapter?: number; memTop?: UsageTop; cpuTop?: UsageTop; gpuMem?: number; gpuMemTotal?: number; netIn?: number; netOut?: number; disks?: string[]; ports?: string[]; ncpu?: number; gpu?: number; battery?: UsageBattery; memUsed: number; memTotal: number; memClaude: number; cpu?: number; cpuClaude?: number; disk?: number; net?: number }
// What is kept between looks, in the shared file: the last look, its figures, top's memory of each process when last had, and when
// top was last asked, whether or not it answered
// and the figures of the last minutes, for the cards' charts
export type UsageKept = { at: number; raw: UsageRaw; figures: UsageFigures; footprint?: { at: number; byPid: Record<string, number> }; topAt?: number; history?: UsagePoint[] }
// One look's figures for the charts: each figure with Claude's part of it, where the look gave one. Memory, the processor and the
// graphics processor as parts of the whole, the disk and the network in bytes a second, the power in watts; the battery's charge
export type UsagePoint = { at: number; mem?: [number, number]; cpu?: [number, number]; gpu?: [number, number]; watts?: [number, number]; disk?: [number, number]; net?: [number, number]; batt?: number }
// How far back the charts go
export const HISTORY_SPAN = 10 * 60_000

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
// Claude: the app, every claude chat, the engine this runs in, and everything they started, with work that runs on after the command
// that started it ended (nohup, a script left running): its parent gone, launchd (1) took it in, and its process group's leader, the
// shell that started it, is gone too. A shell in a terminal gives each job its own group, so one left there leads its own group and
// is not taken; an app launchd starts leads its own group too. The system's own and crash reporters left that way are not taken.
// The Mac's own python3 runs from Xcode, under /Applications, so that is not left out
const isClaudeName = (name: string) => /^claude(?:\.exe)?$/i.test(name.split('/').pop() ?? '')
const isLeftWork = (p: UsageProc, alive: Set<string>) => p.ppid === '1' && !!p.pgid && p.pgid !== p.pid && !alive.has(p.pgid) && !/^\/System\/|crashpad/i.test(p.name)
export const claudeOf = (procs: UsageProc[], self: string) => {
  const alive = new Set(procs.map(p => p.pid))
  const found = new Set(procs.filter(p => p.pid === self || isClaudeName(p.name) || isLeftWork(p, alive)).map(p => p.pid))
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
  // (Windows names a process by its program, node.exe: the name without .exe)
  const own = (app ?? name.split('/').pop() ?? name).replace(/\.exe$/i, '')
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
  return { pct, state, ...(left > 0 ? { left } : {}), ...(said === 'finishing charge' ? { finishing: true as const } : {}) }
}
// Whether a look at the power (pmset -g batt on a Mac, power_supply's files on Linux, as the usage look reads them) says the computer
// runs on its battery now: then Claudopus looks at things less often and Claude's commands get fewer cores at full speed
export const isOnBatteryLook = (text: string, isLinux: boolean) => (isLinux ? batteryOfLinux(text) : batteryOfMac(text))?.state === 'battery'
// The battery as the bar shows it: no time beside a charge the system already calls full while it charges, or empty on battery,
// so the figure and the time never contradict each other. The time stays in what was read, for whoever wants it in full
export const batteryShown = (b: UsageBattery): UsageBattery => {
  if (!b.left || !((b.state === 'charging' && b.pct >= 100) || (b.state === 'battery' && b.pct <= 0))) return b
  const { left: _, ...rest } = b
  return rest
}
// /sys/class/power_supply: a supply of type Battery that powers the machine (not a mouse's, whose scope is Device). Linux gives
// no time left of its own, so none is shown
export const batteryOfLinux = (text: string): UsageBattery | undefined => {
  const by = new Map<string, Record<string, string>>()
  for (const m of text.matchAll(/^\/sys\/class\/power_supply\/([^/]+)\/(type|scope|capacity|status):(.*)$/gm)) by.set(m[1] ?? '', { ...(by.get(m[1] ?? '') ?? {}), [m[2] ?? '']: (m[3] ?? '').trim() })
  const all = [...by.values()].filter(b => b.type === 'Battery' && b.scope !== 'Device' && /^\d+$/.test(b.capacity ?? ''))
  if (!all.length) return undefined
  // Two batteries (some laptops have them) read as one: their charge on average, discharging or charging if either is
  // never rounded up to full while one is not, nor down to empty while one is not
  const mean = Math.round(all.reduce((sum, b) => sum + Number(b.capacity), 0) / all.length)
  const pct = Math.max(all.some(b => Number(b.capacity) > 0) ? 1 : 0, Math.min(all.every(b => Number(b.capacity) >= 100) ? 100 : 99, mean))
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

// Each process's own running totals on a Mac, by pid. The graphics processor's busy time in nanoseconds from each Metal client
// (its AppUsage comes before the line naming the process that opened it)
export const gpuTimesOf = (text: string) => {
  const by: Record<string, number> = {}
  let sum = 0
  for (const line of text.split('\n')) {
    if (line.includes('"AppUsage"')) sum = [...line.matchAll(/"accumulatedGPUTime"=(\d+)/g)].reduce((a, m) => a + Number(m[1]), 0)
    const pid = /"IOUserClientCreator" = "pid (\d+),/.exec(line)?.[1]
    if (pid) (by[pid] = (by[pid] ?? 0) + sum), (sum = 0)
  }
  return by
}
// nettop's bytes in and out of each process (name.pid,in,out,)
export const netByOf = (text: string) => {
  const netIn: Record<string, number> = {}
  const netOut: Record<string, number> = {}
  for (const m of text.matchAll(/\.(\d+),(\d+),(\d+),?\s*$/gm)) (netIn[m[1] ?? ''] = Number(m[2])), (netOut[m[1] ?? ''] = Number(m[3]))
  return { netIn, netOut }
}
// proc_pid_rusage's disk bytes (read and written together) and processor energy of each process. The look prints rusage_info_v6's
// 64-bit counts after its 16-byte uuid: ri_diskio_bytesread and ri_diskio_byteswritten at 18 and 19, ri_energy_nj at 42 (41 is ri_pcycles)
export const rusageOf = (text: string) => {
  const disk: Record<string, number> = {}
  const energy: Record<string, number> = {}
  for (const m of text.matchAll(/^(\d+) (\d+) (\d+) (\d+)$/gm)) (disk[m[1] ?? ''] = Number(m[2]) + Number(m[3])), (energy[m[1] ?? ''] = Number(m[4]))
  const whole = /^E (\d+) (\d+)$/m.exec(text)
  return { disk, energy, ...(whole ? { cpuNj: Number(whole[1]), gpuNj: Number(whole[2]) } : {}) }
}
const pick = (by: Record<string, number>, pids: Set<string>) => Object.fromEntries(Object.entries(by).filter(([pid]) => pids.has(pid)))

// A Mac's look as running totals; Claude's memory is top's where it has the process, else its resident memory
export const rawOfMac = (text: string, at: number, footprint?: Record<string, number>): UsageRaw | undefined => {
  const s = sectionsOf(text)
  const procs = (s.PS ?? '').split('\n').flatMap(line => {
    // The process group after the time, where the look asked for it
    const m = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+([\d:.-]+)\s+(?:(\d+)\s+)?(.*)$/.exec(line)
    return m ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', ...(m[5] ? { pgid: m[5] } : {}), mem: Number(m[3]) * 1024, cpu: secondsOfTime(m[4] ?? '0'), name: (m[6] ?? '').trim() }] : []
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
  // Every process's own totals, Claude's picked from them when the figures are made, so one that started between two looks is
  // counted from its start: graphics time, network, disk and processor energy; and the whole Mac's draw
  const gpuNs = gpuTimesOf(s.GPUP ?? '')
  const netBy = netByOf(s.NETP ?? '')
  const ru = rusageOf(s.RU ?? '')
  const power = powerOf(s.POWER ?? '')
  const own = {
    ...(Object.keys(gpuNs).length ? { gpuNs } : {}),
    ...(Object.keys(netBy.netIn).length ? { netInBy: netBy.netIn, netOutBy: netBy.netOut } : {}),
    ...(Object.keys(ru.disk).length ? { diskBy: ru.disk, energyBy: ru.energy } : {}),
    ...(ru.cpuNj !== undefined ? { cpuNj: ru.cpuNj, gpuNj: ru.gpuNj } : {}),
    energyAll: true as const,
    ...power,
  }
  return { ...own, names: Object.fromEntries(procs.map(p => [p.pid, p.name])), memTop, ...(gpuMem ? { gpuMem: gpuMem.used } : {}), ...netSplitOf(s.NET ?? '', false), at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed, memTotal, ncpu: ncpu || 1, ...loadIn(s.LOAD, ncpu || 1), disk, net, ...(gpu !== undefined ? { gpu } : {}), ...(battery ? { battery } : {}) }
}

// The power, from the battery's gauge, in watts: what goes into the battery (below zero, what comes out of it), what the charger
// gives and what it can give, and what the whole Mac draws. The gauge writes signed numbers as unsigned 64-bit ones, so a value below
// zero reads as nearly 2^64: each is read back as signed. The battery's own voltage times its current is what goes in or out, as
// its charge grows by just that (25 Nov: 4.9 A at 11.7 V while charging, where the gauge's system load of 82 W counted the charging
// too, and its battery power said 6 W). So the Mac draws what the charger gives less what goes into the battery, and on battery
// what comes out of it; the system load only where the battery says neither. A draw no Mac makes is no draw at all
const powerOf = (text: string): { watts?: number; battIn?: number; powerIn?: number; adapter?: number } => {
  // The load, power in and the charger's watts are the gauge's telemetry and the charger's details ("Key"=n); the battery's own
  // voltage and current its top-level lines ("Key" = n), as another part of the gauge tells a voltage of its own
  const of = (key: string, sep = '=') => {
    const digits = new RegExp(`"${key}"${sep}(\\d+)`).exec(text)?.[1]
    return digits ? Number(BigInt.asIntN(64, BigInt(digits))) : undefined
  }
  const [load, powerIn, mv, ma, rated] = [of('SystemLoad'), of('SystemPowerIn'), of('Voltage', ' = '), of('InstantAmperage', ' = '), of('Watts')]
  const battIn = mv !== undefined && ma !== undefined ? (mv * ma) / 1e6 : undefined
  const inW = powerIn !== undefined && powerIn > 0 && powerIn <= 2_000_000 ? powerIn / 1000 : undefined
  const mw = battIn !== undefined ? ((inW ?? 0) - battIn) * 1000 : powerIn === undefined ? load : undefined
  const isFine = (w: number | undefined): w is number => w !== undefined && Math.abs(w) <= 2000
  return {
    ...(mw !== undefined && mw > 0 && mw <= 2_000_000 ? { watts: mw / 1000 } : {}),
    ...(isFine(battIn) ? { battIn } : {}),
    ...(inW !== undefined ? { powerIn: inW, ...(rated && rated > 0 && rated <= 2000 ? { adapter: rated } : {}) } : {}),
  }
}

// On Linux, what goes into the batteries (below zero, what comes out): power_now in microwatts, else current_now times
// voltage_now, each as a size, the way given by whether it charges or discharges
const battInOfLinux = (text: string): number | undefined => {
  const by = new Map<string, Record<string, string>>()
  for (const m of text.matchAll(/^\/sys\/class\/power_supply\/([^/]+)\/(type|scope|status|power_now|current_now|voltage_now):(.*)$/gm)) by.set(m[1] ?? '', { ...(by.get(m[1] ?? '') ?? {}), [m[2] ?? '']: (m[3] ?? '').trim() })
  let sum: number | undefined
  for (const b of by.values()) {
    if (b.type !== 'Battery' || b.scope === 'Device' || (b.status !== 'Charging' && b.status !== 'Discharging')) continue
    const w = b.power_now ? Math.abs(Number(b.power_now)) / 1e6 : b.current_now && b.voltage_now ? (Math.abs(Number(b.current_now)) * Math.abs(Number(b.voltage_now))) / 1e12 : NaN
    if (Number.isFinite(w) && w <= 2000) sum = (sum ?? 0) + (b.status === 'Charging' ? w : -w)
  }
  return sum
}

// The load average over the last minute, what the processors have to run or wait to run, and the cores it is shared by: the
// Mac's from sysctl (the cores are the look's own), Linux's from /proc/loadavg with the cores after it
const loadIn = (text: string | undefined, cores?: number): { load?: number; loadCores?: number } => {
  const load = Number(/(\d+(?:[.,]\d+)?)/.exec(text ?? '')?.[1]?.replace(',', '.') ?? NaN)
  const n = cores ?? Number((text ?? '').trim().split('\n')[1] ?? NaN)
  return Number.isFinite(load) && Number.isFinite(n) && n > 0 ? { load, loadCores: n } : {}
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
    return [{ pid: m[1] ?? '', ppid: f[1] ?? '', pgid: f[2] ?? '', cpu: (Number(f[11]) + Number(f[12])) / tck, mem: statm.get(m[1] ?? '') ?? Number(f[21] ?? 0) * page, name: m[2] ?? '' }]
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
  const battIn = battery ? battInOfLinux(s.BATT ?? '') : undefined
  const memTop = topOf(procs.map(p => [p.name, p.mem]))
  return { names: Object.fromEntries(procs.map(p => [p.pid, p.name])), memTop, ...(gpuMem ? { gpuMem: gpuMem.used, ...(gpuMem.total ? { gpuMemTotal: gpuMem.total } : {}) } : {}), ...netSplitOf(s.NET ?? '', true), at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed: Math.max(0, memTotal - kb('MemAvailable')), memTotal, ncpu: 1, ...loadIn(s.LOAD), disk, net, busy, all, ...(gpu !== undefined ? { gpu } : {}), ...(battery ? { battery } : {}), ...(battIn !== undefined ? { battIn } : {}) }
}

// Win32_Battery's state: 1 on battery (4 and 5 low and critically low), 2 on power, 3 full, 6 to 9 charging; its time left in
// minutes, which Windows gives only on battery (71582788 otherwise)
export const batteryOfWindows = (text: string): UsageBattery | undefined => {
  const m = /^(\d+) (\d+) ?(\d*)$/m.exec(text.trim())
  if (!m) return undefined
  const [pct, status, time] = [Number(m[1]), Number(m[2]), Number(m[3] || 0)]
  const state = [1, 4, 5].includes(status) ? 'battery' : [6, 7, 8, 9].includes(status) ? 'charging' : [2, 3].includes(status) ? 'plugged' : 'unknown'
  const left = state === 'battery' && time > 0 && time < 71582788 ? time : 0
  return { pct: Math.min(100, pct), state, ...(left ? { left } : {}) }
}
// A Windows look: no system process's idle time counted as work (Idle, pid 0), and only the machine's own ports, not its virtual
// ones. Processes are named by their program (node.exe), as Windows names them
export const rawOfWindows = (text: string, at: number): UsageRaw | undefined => {
  const s = sectionsOf(text.replace(/\r\n/g, '\n'))
  const [totalKb = 0, freeKb = 0, ncpu = 1] = (s.SYS ?? '').trim().split(/\s+/).map(Number)
  const procs = (s.PS ?? '').split('\n').flatMap(line => {
    const m = /^(\d+) (\d+) (\d+) (\d+) (.+)$/.exec(line.trim())
    return m && m[1] !== '0' ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', mem: Number(m[3]), cpu: Number(m[4]) / 1e7, name: (m[5] ?? '').trim() }] : []
  })
  const memTotal = totalKb * 1024
  if (!procs.length || !memTotal || !Number.isFinite(memTotal)) return undefined
  const disk: Record<string, number> = {}
  for (const line of (s.DISK ?? '').split('\n')) {
    const [name = '', bytes = ''] = line.split('\t')
    if (name.trim() && /^\d+$/.test(bytes.trim())) disk[name.trim()] = Number(bytes)
  }
  const net: Record<string, number> = {}
  let netIn = 0
  let netOut = 0
  for (const line of (s.NET ?? '').split('\n')) {
    const [name = '', got = '', sent = ''] = line.split('\t')
    if (!name.trim() || !/^\d+$/.test(got.trim()) || !/^\d+$/.test(sent.trim()) || /loopback|isatap|teredo|vethernet|hyper-v|virtual|vmware|vpn|tap-|wireguard|tailscale|bluetooth/i.test(name)) continue
    net[name.trim()] = Number(got) + Number(sent)
    netIn += Number(got)
    netOut += Number(sent)
  }
  const claude = claudeOf(procs, (s.SELF ?? '').trim())
  const claudeMem = procs.filter(p => claude.has(p.pid)).reduce((sum, p) => sum + p.mem, 0)
  const battery = batteryOfWindows(s.BATT ?? '')
  const memTop = topOf(procs.map(p => [p.name, p.mem]))
  return { names: Object.fromEntries(procs.map(p => [p.pid, p.name])), memTop, ...(Object.keys(net).length ? { netIn, netOut } : {}), at, cpu: Object.fromEntries(procs.map(p => [p.pid, p.cpu])), claude: [...claude], claudeMem, memUsed: Math.max(0, memTotal - freeKb * 1024), memTotal, ncpu: ncpu || 1, disk, net, ...(battery ? { battery } : {}) }
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
    ...(cur.load !== undefined && cur.loadCores ? { load: cur.load, loadCores: cur.loadCores } : {}),
    disks: Object.keys(cur.disk),
    ports: Object.keys(cur.net),
    ...(cur.memTop?.length ? { memTop: cur.memTop } : {}),
    ...(cur.gpu !== undefined ? { gpu: cur.gpu } : {}),
    ...(cur.gpuMem !== undefined ? { gpuMem: cur.gpuMem } : {}),
    ...(cur.gpuMemTotal !== undefined ? { gpuMemTotal: cur.gpuMemTotal } : {}),
    ...(cur.battery ? { battery: cur.battery } : {}),
    ...(cur.battIn !== undefined ? { battIn: cur.battIn } : {}),
    ...(cur.powerIn !== undefined ? { powerIn: cur.powerIn } : {}),
    ...(cur.adapter !== undefined ? { adapter: cur.adapter } : {}),
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
    // (a look that names no disk or port at all, as Windows' when its counters do not answer, tells no speed rather than none)
    ...(Object.keys(cur.disk).length ? { disk: movedOf(prev.disk ?? {}, cur.disk) / span } : {}),
    ...(Object.keys(cur.net).length ? { net: movedOf(prev.net ?? {}, cur.net) / span } : {}),
    ports: Object.keys(cur.net).filter(name => typeof prev.net?.[name] === 'number' && (cur.net[name] ?? 0) > (prev.net[name] ?? 0)),
    disks: Object.keys(cur.disk).filter(name => typeof prev.disk?.[name] === 'number' && (cur.disk[name] ?? 0) > (prev.disk[name] ?? 0)),
    ...(split ? { netIn: ((cur.netIn ?? 0) - (prev.netIn ?? 0)) / span, netOut: ((cur.netOut ?? 0) - (prev.netOut ?? 0)) / span } : {}),
    ...claudeShareOf(prev, cur, span),
  }
}

// What Claude's processes added between two looks: each one's growth, and all of one that started since, as it was not there to
// be counted before (a number smaller than before is a new process on an old pid). A look from before every process was kept
// held Claude's alone, so against it only what was in both is counted
const grownOne = (was: number | undefined, n: number, isAll: boolean) => (was === undefined ? (isAll ? n : 0) : was > n ? n : n - was)
const grownOf = (prev: Record<string, number>, cur: Record<string, number>, pids: Set<string> | undefined, isAll: boolean) =>
  Object.entries(cur).reduce((sum, [pid, n]) => sum + (pids && !pids.has(pid) ? 0 : grownOne(prev[pid], n, isAll)), 0)

// Claude's part of what moved between two looks, where the Mac told each process's own: of the graphics processor (its share of all
// clients' time, as a part of how busy the device was), its disk and network speeds, and the power its processors drew
// The graphics processor's power is the whole device's: Claude's part of it is an estimate, its share of the busy time times that
// power, and reads as one
const claudeShareOf = (prev: UsageRaw, cur: UsageRaw, span: number): Partial<UsageFigures> => {
  const claude = new Set(cur.claude)
  const isAll = !!prev.energyAll
  const out: Partial<UsageFigures> = {}
  // Graphics clients are counted from their start against an earlier look of either kind, as those always held every process
  let gpuShare: number | undefined
  if (cur.gpuNs && prev.gpuNs && cur.gpu !== undefined) {
    const all = grownOf(prev.gpuNs, cur.gpuNs, undefined, true)
    if (all > 0) {
      gpuShare = Math.min(1, grownOf(prev.gpuNs, cur.gpuNs, claude, true) / all)
      out.gpuClaude = Math.min(cur.gpu, cur.gpu * gpuShare)
      const each = Object.entries(cur.gpuNs).map(([pid, n]): [string, number] => [cur.names?.[pid] ?? '', (cur.gpu ?? 0) * (grownOne(prev.gpuNs?.[pid], n, true) / all)])
      const gpuTop = topOf(each.filter(([name]) => name))
      if (gpuTop.length) out.gpuTop = gpuTop
    }
  }
  if (cur.diskBy && prev.diskBy) out.diskClaude = grownOf(prev.diskBy, cur.diskBy, claude, isAll) / span
  if (cur.netInBy && prev.netInBy && cur.netOutBy && prev.netOutBy) (out.netInClaude = grownOf(prev.netInBy, cur.netInBy, claude, isAll) / span), (out.netOutClaude = grownOf(prev.netOutBy, cur.netOutBy, claude, isAll) / span)
  // A Mac whose processors count no energy (an Intel one) counts none: then nothing is said, not 0 W
  if (cur.energyBy && prev.energyBy && Object.values(cur.energyBy).some(n => n > 0)) out.wattsClaude = grownOf(prev.energyBy, cur.energyBy, claude, isAll) / 1e9 / span
  // The whole processors and graphics processor, from their own counters; Claude's processes never past all of them
  if (cur.cpuNj !== undefined && prev.cpuNj !== undefined && cur.cpuNj >= prev.cpuNj) {
    out.wattsCpu = (cur.cpuNj - prev.cpuNj) / 1e9 / span
    if (out.wattsClaude !== undefined) out.wattsClaude = Math.min(out.wattsClaude, out.wattsCpu)
  }
  if (cur.gpuNj !== undefined && prev.gpuNj !== undefined && cur.gpuNj >= prev.gpuNj) {
    out.wattsGpu = (cur.gpuNj - prev.gpuNj) / 1e9 / span
    if (gpuShare !== undefined) out.wattsGpuClaude = out.wattsGpu * gpuShare
  }
  if (cur.watts !== undefined) out.watts = cur.watts
  return out
}

// What a lean look leaves out: read as it stands, running totals, and the figures made from those totals
const SLOW_NOW = ['battery', 'watts', 'battIn', 'powerIn', 'adapter'] as const
const SLOW_SUMS = ['netInBy', 'netOutBy', 'diskBy', 'energyBy', 'cpuNj', 'gpuNj'] as const
const SLOW_FIGURES = ['diskClaude', 'netInClaude', 'netOutClaude', 'wattsClaude', 'wattsCpu', 'wattsGpu', 'wattsGpuClaude'] as const
const only = <T extends object>(from: T, keys: readonly (keyof T)[]) => Object.fromEntries(keys.flatMap(key => (from[key] !== undefined ? [[key, from[key]]] : []))) as Partial<T>
// The next kept state from a look: top's memory kept until the next top is due, on battery too, the figures against the look before
export const nextKept = (was: UsageKept | undefined, text: string, at: number, isLinux: boolean, isTop = false, isWindows = false): UsageKept | undefined => {
  const s = sectionsOf(text)
  const top = isLinux || isWindows ? {} : footprintOf(s.TOP ?? '')
  const footprint = Object.keys(top).length ? { at, byPid: top } : was?.footprint && at - was.footprint.at < FOOTPRINT_BATTERY_EVERY + FOOTPRINT_EVERY ? was.footprint : undefined
  const raw = isWindows ? rawOfWindows(text, at) : isLinux ? rawOfLinux(text, at) : rawOfMac(text, at, footprint?.byPid)
  if (!raw) return undefined
  const topAt = isTop ? at : was?.topAt
  // A lean look keeps what it left out from the look that last had it (slowAt); the next whole one counts those against that look
  const old = was?.raw
  const isLean = !isLinux && s.LEAN !== undefined
  if (isLean && old) Object.assign(raw, only(old, SLOW_NOW))
  const figures = figuresOf(old, raw)
  if (isLean && old) (Object.assign(figures, only(was?.figures ?? figures, SLOW_FIGURES)), Object.assign(raw, only(old, SLOW_SUMS), { slowAt: old.slowAt ?? old.at }))
  else if (old?.slowAt && old.slowAt < old.at) {
    for (const key of SLOW_FIGURES) delete figures[key]
    const span = (at - old.slowAt) / 1000
    if (figures.cpu !== undefined && span * 1000 <= USAGE_GAP) Object.assign(figures, only(claudeShareOf({ ...old, at: old.slowAt }, raw, span), SLOW_FIGURES))
  }
  const { names: _names, ...kept } = raw
  // The figures of the last minutes, this look's added: the charts need no look of their own
  const history = [...(was?.history ?? []).filter(p => p.at < at && at - p.at <= HISTORY_SPAN), pointOf(figures, at)]
  return { at, raw: kept, figures, ...(footprint ? { footprint } : {}), ...(topAt !== undefined ? { topAt } : {}), history }
}
// The shared file's state, when it reads as one
export const keptOf = (text: string): UsageKept | undefined => {
  try {
    const kept = JSON.parse(text) as UsageKept
    if (!(typeof kept?.at === 'number' && kept.raw && typeof kept.raw.disk === 'object' && kept.figures)) return undefined
    if (kept.history !== undefined && !(Array.isArray(kept.history) && kept.history.every(p => typeof p?.at === 'number'))) delete kept.history
    return kept
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
// Time left as the system says it, in Claudopus's time form: 41m, 1h 05m
export const leftText = (minutes: number) => (minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`)
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

// ---- The charts in the cards ----
const round = (n: number, places: number) => Math.round(n * 10 ** places) / 10 ** places
// One look's point: only what the look gave, rounded so the shared file stays small (ten minutes of looks is a few kilobytes)
export const pointOf = (f: UsageFigures, at: number): UsagePoint => {
  const part = (all: number, claude: number | undefined): [number, number] => [round(clamp(all), 3), round(clamp(Math.min(claude ?? 0, all)), 3)]
  const rate = (all: number, claude: number | undefined): [number, number] => [Math.round(all), Math.round(Math.min(claude ?? 0, all))]
  const claudeW = f.wattsClaude !== undefined ? f.wattsClaude + (f.wattsGpuClaude ?? 0) : undefined
  return {
    at,
    ...(f.memTotal > 0 ? { mem: part(f.memUsed / f.memTotal, f.memClaude / f.memTotal) } : {}),
    ...(f.cpu !== undefined ? { cpu: part(f.cpu, f.cpuClaude) } : {}),
    ...(f.gpu !== undefined ? { gpu: part(f.gpu, f.gpuClaude) } : {}),
    ...(f.watts !== undefined ? { watts: [round(f.watts, 1), round(Math.min(claudeW ?? 0, f.watts), 1)] as [number, number] } : {}),
    ...(f.disk !== undefined ? { disk: rate(f.disk, f.diskClaude) } : {}),
    ...(f.net !== undefined ? { net: rate(f.net, f.netInClaude !== undefined ? (f.netInClaude ?? 0) + (f.netOutClaude ?? 0) : undefined) } : {}),
    ...(f.battery ? { batt: f.battery.pct } : {}),
  }
}
// A chart's size: as wide as a card's rows, two lines high
export const CHART_W = 272
export const CHART_H = 30
// Looks further apart than this leave a gap in the chart: no work ran, so nothing was looked at
const CHART_GAP = 30_000
// The last ten minutes of one figure, the newest at the right: the whole in grey, Claude's part in purple over it, a gap where no
// look was had. top is the chart's full height in the figure's own units. Nothing for fewer than two looks
export const chartSvg = (points: [number, number, number | undefined][], now: number, top: number) => {
  const shown = points.filter(([at]) => at <= now && now - at <= HISTORY_SPAN).sort((a, b) => a[0] - b[0])
  if (shown.length < 2 || !(top > 0)) return undefined
  const x = (at: number) => round(CHART_W - ((now - at) / HISTORY_SPAN) * CHART_W, 1)
  const y = (n: number) => round(CHART_H - 1 - Math.min(1, Math.max(0, n / top)) * (CHART_H - 2), 1)
  const runs: [number, number, number | undefined][][] = []
  for (const p of shown) {
    const run = runs[runs.length - 1]
    const last = run?.[run.length - 1]
    if (run && last && p[0] - last[0] <= CHART_GAP) run.push(p)
    else runs.push([p])
  }
  // A run of one look is a sliver two pixels wide, so a lone look still shows
  const area = (run: [number, number, number | undefined][], at: (p: [number, number, number | undefined]) => number) => {
    const xs = run.length === 1 ? [x(run[0]![0]) - 1, x(run[0]![0]) + 1] : run.map(p => x(p[0]))
    const ys = run.length === 1 ? [y(at(run[0]!)), y(at(run[0]!))] : run.map(p => y(at(p)))
    return `M${xs[0]} ${CHART_H}${xs.map((one, i) => `L${one} ${ys[i]}`).join('')}L${xs[xs.length - 1]} ${CHART_H}Z`
  }
  const hasClaude = shown.some(p => (p[2] ?? 0) > 0)
  const parts = [
    `<rect x="0" y="${CHART_H - 1}" width="${CHART_W}" height="1" fill="${TRACK}"/>`,
    ...runs.map(run => `<path d="${area(run, p => p[1])}" fill="${USAGE_GREY}" fill-opacity="0.45"/>`),
    ...(hasClaude ? runs.map(run => `<path d="${area(run, p => p[2] ?? 0)}" fill="${USAGE_PURPLE}"/>`) : []),
  ]
  return { source: `<svg xmlns="http://www.w3.org/2000/svg" width="${CHART_W}" height="${CHART_H}" viewBox="0 0 ${CHART_W} ${CHART_H}">${parts.join('')}</svg>`, width: CHART_W, height: CHART_H }
}
