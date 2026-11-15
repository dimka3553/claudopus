import { expect, test } from 'claude-code/testing'

import { batteryOfLinux, batteryOfMac, gpuOf, leftText, claudeOf, figuresOf, footprintOf, gbText, isMemoryHigh, keptOf, meterOf, nextKept, pctText, rateText, rawOfLinux, rawOfMac, secondsOfTime, usageMac, usageSvg, USAGE_AMBER, USAGE_PURPLE } from './usage'

const GiB = 1024 ** 3
// A figure to six places, as two sums of tenths rarely meet exactly
const near = (n: number | undefined) => Math.round((n ?? NaN) * 1e6) / 1e6
// A Mac's look, as its commands print it: the app, a chat's engine under it, a command that chat started, and another app
const macLook = (o: { appCpu: string; shellCpu: string; otherCpu: string; disk: string; inBytes: number; outBytes: number; anon?: number; top?: string }) =>
  [
    '@@SELF@@ 1423',
    '@@PS@@',
    '    1     0  20000   1:00.00 /sbin/launchd',
    `  852     1 686704   ${o.appCpu} /Applications/Claude.app/Contents/MacOS/Claude`,
    '  932   852 1247440   0:10.00 /Applications/Claude.app/Contents/Frameworks/Claude Helper (Renderer).app/Contents/MacOS/Claude Helper (Renderer)',
    ' 1422   852    640   0:00.00 /Applications/Claude.app/Contents/Helpers/disclaimer',
    ' 1423  1422 1745264  29:03.86 /Users/sam/Library/Application Support/Claude/claude-code/2.1.325/x/claude.app/Contents/MacOS/claude',
    ` 5000  1423  52000   ${o.shellCpu} /bin/zsh`,
    `  700     1 400000   ${o.otherCpu} /Applications/Safari.app/Contents/MacOS/Safari`,
    '@@VM@@',
    'Mach Virtual Memory Statistics: (page size of 16384 bytes)',
    'Pages wired down:                             207303.',
    'Pages purgeable:                               42324.',
    `Anonymous pages:                             ${o.anon ?? 1583261}.`,
    'Pages occupied by compressor:                 125152.',
    '@@SYS@@',
    '68719476736',
    '10',
    '@@IO@@',
    '              disk0               disk4 ',
    '    KB/t xfrs   MB     KB/t xfrs   MB ',
    `   19.03 42547108 ${o.disk}   10.00 100 1.00 `,
    '@@NET@@',
    'Name       Mtu   Network       Address            Ipkts Ierrs     Ibytes    Opkts Oerrs     Obytes  Coll',
    'lo0        16384 <Link#1>                         25664     0    7582357    25664     0    7582357     0',
    'utun0      1380  <Link#18>                            0     0     900000        4     0     900000     0',
    `en0        1500  <Link#15>   02:00:00:00:00:01 14440816     0 ${o.inBytes} 21265608     0 ${o.outBytes}     0`,
    'en0        1500  fe80::1     fe80:15::1        14440816     - 99999999999 21265608     - 99999999999     -',
    ...(o.top ? ['@@TOP@@', 'Processes: 845 total', '', 'PID    MEM', o.top] : []),
    '',
  ].join('\n')

test('a Mac is read as Activity Monitor reads it: memory used, Claude the app with its chats and all they started', async () => {
  expect(usageMac(false)).not.toContain('top')
  expect(usageMac(true)).toContain('top -l 1 -stats pid,mem')
  expect(near(secondsOfTime('29:03.86'))).toBe(1743.86)
  expect(secondsOfTime('1-00:00:01')).toBe(86401)
  const raw = rawOfMac(macLook({ appCpu: '0:10.00', shellCpu: '0:00.00', otherCpu: '0:00.00', disk: '1000.00', inBytes: 1_000_000, outBytes: 2_000_000 }), 0)
  // App memory (anonymous less purgeable), wired and compressed, of 64 GB
  expect(raw?.memTotal).toBe(64 * GiB)
  expect(gbText(raw?.memUsed ?? 0)).toBe('29')
  expect(raw?.memUsed).toBe((1583261 - 42324 + 207303 + 125152) * 16384)
  // The app, its helper, its chat's engine and the shell that chat started; not Safari, not launchd
  expect(raw?.claude.sort()).toEqual(['1422', '1423', '5000', '852', '932'])
  // Only the Mac's own port counts, not the tunnel that carries the same bytes again
  expect(raw?.net).toEqual({ en0: 3_000_000 })
  expect(raw?.disk).toEqual({ disk0: 1000 * 1024 * 1024, disk4: 1024 * 1024 })
  // top's own memory of a process, where it was asked, in place of its resident memory
  expect(footprintOf('PID    MEM\n932    1097M\n1423   625M+\n852    435M-\n5000   1.5G\n')).toEqual({ '932': 1097 * 1024 ** 2, '1423': 625 * 1024 ** 2, '852': 435 * 1024 ** 2, '5000': 1.5 * GiB })
  const withTop = rawOfMac(macLook({ appCpu: '0:10.00', shellCpu: '0:00.00', otherCpu: '0:00.00', disk: '1000.00', inBytes: 0, outBytes: 0 }), 0, { '852': GiB, '932': GiB, '1422': 0, '1423': GiB })
  // The shell top had not seen counts by its resident memory
  expect(withTop?.claudeMem).toBe(3 * GiB + 52000 * 1024)
})

test('the figures come from two looks five seconds apart: the processor as a part of all its cores, Claude part of it, speeds a second', async () => {
  const first = nextKept(undefined, macLook({ appCpu: '0:10.00', shellCpu: '0:00.00', otherCpu: '0:00.00', disk: '1000.00', inBytes: 1_000_000, outBytes: 0, top: '852    435M' }), 0, false)
  // Memory is known at once; the rest only once there is a look before
  expect(first?.figures.cpu).toBeUndefined()
  expect(first?.footprint?.byPid).toEqual({ '852': 435 * 1024 ** 2 })
  const second = nextKept(first, macLook({ appCpu: '0:20.00', shellCpu: '0:05.00', otherCpu: '0:15.00', disk: '1050.00', inBytes: 6_000_000, outBytes: 5_000_000 }), 5000, false)
  const f = second?.figures
  // 10 cores for 5 s are 50 s; Claude used 15 of them (app 10, its shell 5), Safari 15
  expect(near(f?.cpu)).toBe(0.6)
  expect(near(f?.cpuClaude)).toBe(0.3)
  expect(near(f?.disk)).toBe((50 * 1024 * 1024) / 5)
  expect(f?.net).toBe(2_000_000)
  // top's memory is kept from the look before, for a minute
  expect(second?.footprint?.at).toBe(0)
  // A look too long after the last gives memory alone
  expect(nextKept(first, macLook({ appCpu: '0:20.00', shellCpu: '0:05.00', otherCpu: '0:15.00', disk: '1050.00', inBytes: 0, outBytes: 0 }), 600_000, false)?.figures.cpu).toBeUndefined()
  // A disk plugged in between two looks brings no speed of its own, and one taken out hides none of the others'
  const one = { at: 0, cpu: {}, claude: [], claudeMem: 0, memUsed: 1, memTotal: 2, ncpu: 1, disk: { disk0: 100 }, net: { en0: 0 } }
  expect(figuresOf(one, { ...one, at: 1000, disk: { disk0: 150, disk6: 9e12 } }).disk).toBe(50)
  expect(figuresOf({ ...one, disk: { disk0: 100, disk6: 9e12 } }, { ...one, at: 1000, disk: { disk0: 150 } }).disk).toBe(50)
  // top is asked once a minute whether or not it answers
  expect(nextKept(first, macLook({ appCpu: '0:20.00', shellCpu: '0:05.00', otherCpu: '0:15.00', disk: '1050.00', inBytes: 0, outBytes: 0 }), 5000, false, true)?.topAt).toBe(5000)
  expect(second?.topAt).toBeUndefined()
  // A process that started between the looks counts all its time; one whose number came back with less time is new too
  const a = { at: 0, cpu: { '1': 100 }, claude: ['1'], claudeMem: 0, memUsed: 1, memTotal: 2, ncpu: 2, disk: {}, net: {} }
  expect(near(figuresOf(a, { ...a, at: 10_000, cpu: { '1': 2, '2': 4 } }).cpu)).toBe(0.3)
  expect(near(figuresOf(a, { ...a, at: 10_000, cpu: { '1': 2, '2': 4 } }).cpuClaude)).toBe(0.1)
  // The shared file is read back as it was written, and anything else is no state
  expect(near(keptOf(JSON.stringify(second))?.figures.cpu)).toBe(0.6)
  expect(keptOf('{"at":1}')).toBeUndefined()
  // A file left by the version that kept one total for all disks is no state
  expect(keptOf(JSON.stringify({ ...second, raw: { ...second?.raw, disk: 5 } }))).toBeUndefined()
  expect(keptOf('not json')).toBeUndefined()
})

test('Linux is read from /proc: the processor from its own counts, memory as available says, whole disks and real ports only', async () => {
  const look = (o: { claudeTicks: number; otherTicks: number; idle: number; busy: number; sectors: number; rx: number }) =>
    [
      '@@SELF@@ 300',
      '@@STAT@@',
      `/proc/1/stat:1 (systemd) S 0 1 1 0 -1 4194560 0 0 0 0 100 50 0 0 20 0 1 0 1 1000 2000 0`,
      `/proc/300/stat:300 (claude) S 1 300 300 0 -1 4194560 0 0 0 0 ${o.claudeTicks} 0 0 0 20 0 1 0 1 1000 2000 0`,
      `/proc/301/stat:301 (python3 (x)) R 300 300 300 0 -1 4194560 0 0 0 0 ${o.claudeTicks} 0 0 0 20 0 1 0 1 1000 2000 0`,
      `/proc/400/stat:400 (postgres) S 1 400 400 0 -1 4194560 0 0 0 0 ${o.otherTicks} 0 0 0 20 0 1 0 1 1000 2000 0`,
      '@@STATM@@',
      '/proc/300/statm:100000 50000 10000 1 0 1 0',
      '/proc/301/statm:100000 30000 5000 1 0 1 0',
      '/proc/400/statm:100000 90000 1000 1 0 1 0',
      '@@SYS@@',
      '4096',
      '100',
      `cpu  ${o.busy} 0 0 ${o.idle} 0 0 0 0 0 0`,
      '@@MEM@@',
      'MemTotal:       16000000 kB',
      'MemFree:         1000000 kB',
      'MemAvailable:    6000000 kB',
      '@@DISK@@',
      `   8       0 sda 100 0 ${o.sectors} 0 50 0 ${o.sectors} 0 0 0 0`,
      `   8       1 sda1 100 0 ${o.sectors} 0 50 0 ${o.sectors} 0 0 0 0`,
      `   7       0 loop0 100 0 99999 0 50 0 99999 0 0 0 0`,
      '@@NET@@',
      'Inter-|   Receive                                                |  Transmit',
      ' face |bytes    packets errs drop fifo frame compressed multicast|bytes    packets errs drop fifo colls carrier compressed',
      `    lo: 999999 1 0 0 0 0 0 0 999999 1 0 0 0 0 0 0`,
      `  eth0: ${o.rx} 1 0 0 0 0 0 0 1000 1 0 0 0 0 0 0`,
      `tailscale0: 777777 1 0 0 0 0 0 0 777777 1 0 0 0 0 0 0`,
      '',
    ].join('\n')
  const a = rawOfLinux(look({ claudeTicks: 100, otherTicks: 100, idle: 1000, busy: 1000, sectors: 1000, rx: 1000 }), 0)
  expect(a?.claude.sort()).toEqual(['300', '301'])
  expect(a?.memUsed).toBe(10_000_000 * 1024)
  // Each of Claude's processes counts its resident memory less what it shares
  expect(a?.claudeMem).toBe((40000 + 25000) * 4096)
  const b = rawOfLinux(look({ claudeTicks: 200, otherTicks: 300, idle: 1400, busy: 1600, sectors: 3000, rx: 11000 }), 2000)
  const f = figuresOf(a, b!)
  // 1000 ticks passed on all cores, 600 busy; Claude's two processes 200 of them
  expect(near(f.cpu)).toBe(0.6)
  expect(near(f.cpuClaude)).toBe(0.2)
  expect(f.disk).toBe((2000 + 2000) * 512 / 2)
  expect(f.net).toBe(5000)
})

test('the figures read short, a meter keeps a small part in sight, and memory past nine tenths turns amber', async () => {
  expect([gbText(3.4 * GiB), gbText(30.2 * GiB), gbText(2 * GiB)]).toEqual(['3.4', '30', '2'])
  expect(rateText(62_400_000)).toEqual(['62', 'MB/s'])
  expect(rateText(1_040_000)).toEqual(['1', 'MB/s'])
  expect(rateText(2_150_000)).toEqual(['2', 'MB/s'])
  expect(rateText(960_000)).toEqual(['1', 'MB/s'])
  expect(rateText(240_000)).toEqual(['0.2', 'MB/s'])
  expect(rateText(20_000)).toEqual(['0', 'MB/s'])
  expect(rateText(999_700_000)).toEqual(['1', 'GB/s'])
  expect(rateText(3_100_000_000)).toEqual(['3.1', 'GB/s'])
  expect(pctText(0.404)).toBe('40')
  // Claude's 3.4 of 64 GB is still one step of eighteen; nothing in use is no step
  expect(meterOf(3.4 / 64, 30 / 64, 18)).toEqual({ mine: 1, rest: 7 })
  expect(meterOf(0, 0, 4)).toEqual({ mine: 0, rest: 0 })
  expect(meterOf(1, 1, 4)).toEqual({ mine: 4, rest: 0 })
  expect(isMemoryHigh({ memUsed: 58 * GiB, memTotal: 64 * GiB, memClaude: 0 })).toBe(true)
  expect(isMemoryHigh({ memUsed: 57 * GiB, memTotal: 64 * GiB, memClaude: 0 })).toBe(false)
  const calm = usageSvg('memory', { claude: 0.05, used: 0.5 })
  expect(calm.source).toContain(USAGE_PURPLE)
  expect(calm.source).not.toContain(USAGE_AMBER)
  expect(usageSvg('memory', { claude: 0.05, used: 0.95, isHigh: true }).source).toContain(USAGE_AMBER)
  expect(usageSvg('net').width).toBeLessThan(calm.width)
})

test('the battery is taken as the system says it: the Mac own battery only, a time only when one is given, a Linux laptop without a time', async () => {
  const mac = (line: string) => `Now drawing from 'Battery Power'\n -InternalBattery-0 (id=22872163)\t${line} present: true\n`
  expect(batteryOfMac(mac('85%; discharging; 4:12 remaining'))).toEqual({ pct: 85, state: 'battery', left: 252 })
  expect(batteryOfMac(mac('85%; discharging; (no estimate)'))).toEqual({ pct: 85, state: 'battery' })
  expect(batteryOfMac(mac('62%; charging; 1:05 remaining'))).toEqual({ pct: 62, state: 'charging', left: 65 })
  expect(batteryOfMac(mac('99%; finishing charge; 0:05 remaining'))).toEqual({ pct: 99, state: 'charging', left: 5 })
  expect(batteryOfMac(mac('100%; charged; 0:00 remaining'))).toEqual({ pct: 100, state: 'plugged' })
  expect(batteryOfMac(mac('80%; AC attached; not charging'))).toEqual({ pct: 80, state: 'plugged' })
  expect(batteryOfMac(mac('0%; charging; (no estimate)'))).toEqual({ pct: 0, state: 'charging' })
  // A desktop: no battery, and a UPS it is plugged into is not its own
  expect(batteryOfMac("Now drawing from 'AC Power'\n")).toBeUndefined()
  expect(batteryOfMac("Now drawing from 'AC Power'\n -CP1500PFCLCDa (id=1)\t100%; charged; 0:00 remaining present: true\n")).toBeUndefined()
  expect(leftText(252)).toBe('4:12')
  expect(leftText(5)).toBe('0:05')
  const sys = (rows: Record<string, Record<string, string>>) => Object.entries(rows).flatMap(([name, f]) => Object.entries(f).map(([k, v]) => `/sys/class/power_supply/${name}/${k}:${v}`)).join('\n')
  expect(batteryOfLinux(sys({ AC: { type: 'Mains' }, BAT0: { type: 'Battery', capacity: '57', status: 'Discharging' } }))).toEqual({ pct: 57, state: 'battery' })
  expect(batteryOfLinux(sys({ BAT1: { type: 'Battery', capacity: '40', status: 'Charging' } }))).toEqual({ pct: 40, state: 'charging' })
  expect(batteryOfLinux(sys({ BAT0: { type: 'Battery', capacity: '100', status: 'Full' } }))).toEqual({ pct: 100, state: 'plugged' })
  // A server, and a wireless mouse's battery
  expect(batteryOfLinux('')).toBeUndefined()
  expect(batteryOfLinux(sys({ 'hidpp_battery_0': { type: 'Battery', scope: 'Device', capacity: '90', status: 'Discharging' } }))).toBeUndefined()
})

test('the graphics processor: the Mac busiest accelerator, Linux GPUs on average, none when nothing answers', async () => {
  expect(gpuOf('"Device Utilization %"=62\n', false)).toBe(0.62)
  expect(gpuOf('', false)).toBeUndefined()
  expect(gpuOf('40\n80\n', true)).toBe(0.6)
  expect(gpuOf('[N/A]\n', true)).toBeUndefined()
  expect(gpuOf('', true)).toBeUndefined()
})
