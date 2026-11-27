import { expect, test } from 'claude-code/testing'

import { commandsOf, paceBatteryRoom, paceLookOf, paceOf, paceReserve, threadsOf } from './pace'

// A Mac's processes as the look lists them: the app, its engine, a terminal's claude, another app, and Claude's commands, with the
// threads ready to run of each (Safari's at full speed)
const lookOf = (cores: number, rows: string[], ready: Record<string, number>, safari: number) =>
  paceLookOf(
    [
      '@@PACE@@ 1423',
      '@@CORES@@',
      String(cores),
      '@@PS@@',
      '    1     0     1 07-00:38:09  37 /sbin/launchd',
      '  852     1   852 01:00:00  47 /Applications/Claude.app/Contents/MacOS/Claude',
      ' 1422   852   852 01:00:00  31 /Applications/Claude.app/Contents/Helpers/disclaimer',
      ' 1423  1422   852 1-01:00:00  31 /Users/sam/Library/Application Support/Claude/claude-code/2.1.328/x/claude.app/Contents/MacOS/claude',
      ' 9000     1  9000 02:00:00  31 /usr/local/bin/claude',
      '  700     1   700 01:00:00  31 /Applications/Safari.app/Contents/MacOS/Safari',
      ' 5000  1423  5000    10:00  31 /bin/zsh',
      ...rows,
      '@@THREADS@@',
      'USER   PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND',
      'sam   700   ??   99.0 S    31T   0:00.00   1:00.00 Safari',
      ...Array.from({ length: safari }, () => '      700         99.0 R    47T   0:00.00   1:00.00 '),
      // a thread of Safari's waiting in the background mode takes no room
      '      700          9.0 R     4    0:00.00   1:00.00 ',
      // nor does a process born after the list of processes was taken
      'sam   7777   ??   99.0 R    31T   0:00.00   0:00.01 python3',
      ...Object.entries(ready).flatMap(([pid, n]) => [`sam ${pid} ?? 99.0 S 31T 0:00.00 1:00.00 python3`, ...Array.from({ length: n }, () => `      ${pid}         99.0 R    31T   0:00.00   1:00.00 `)]),
      '',
    ].join('\n'),
  )

test("Claude's commands are what its engines started and the work they left running, and the oldest run at full speed while their ready threads fit in the cores left after everything else's and a reserve", async () => {
  expect([1, 4, 8, 18].map(paceReserve)).toEqual([1, 1, 2, 2])
  const rows = [
    ' 5001  5000  5000    10:00  31 /usr/bin/python3',
    ' 5002  5000  5000    01:00  31 /usr/bin/python3',
    ' 5003  9000  9000    00:30  31 node',
    // work left running after its shell ended, already waiting in the background mode
    ' 5004     1  4999    00:20   4 ffmpeg',
    // waiting there with nothing to run
    ' 5005  5000  5000    00:10   0 /bin/sleep',
    // something of the person's that lost its parent but leads its own group
    ' 6000     1  6000    05:00  31 /usr/local/bin/blender',
    // a test kit a command started: an engine, and what it starts, are Claude's commands too, never a chat
    ' 5006  5000  5000    00:05  31 /Users/sam/Library/Application Support/Claude/claude-code/2.1.328/x/claude.app/Contents/MacOS/claude',
    ' 5007  5006  5000    00:04  31 /Users/sam/Library/Application Support/Claude/claude-code/2.1.328/x/claude.app/Contents/MacOS/claude',
  ]
  expect(commandsOf(lookOf(10, rows, {}, 0)).map(p => p.pid).sort()).toEqual(['5000', '5001', '5002', '5003', '5004', '5005', '5006', '5007'])
  expect([4, 8, 10, 18].map(paceBatteryRoom)).toEqual([2, 2, 2, 4])
  const cases: { ready: Record<string, number>; safari: number; before?: number; isBattery?: boolean; lower: string[]; lift: string[]; held: number; room: number }[] = [
    // 10 cores less 2: 6, then 4 is past 8; 2 fits; ffmpeg's 3 does not and stays; the sleep counts a thread while it waits, and
    // does not fit either
    { ready: { 5001: 6, 5002: 4, 5003: 2, 5004: 3 }, safari: 0, lower: ['5002'], lift: [], held: 3, room: 8 },
    // with room, what waits comes out, even with nothing ready
    { ready: {}, safari: 0, lower: [], lift: ['5004', '5005'], held: 0, room: 8 },
    // 2, 2, 2 and ffmpeg's 2 fit in 8; the sleep's 1 does not
    { ready: { 5001: 2, 5002: 2, 5003: 2, 5004: 2 }, safari: 0, lower: [], lift: ['5004'], held: 1, room: 8 },
    // Safari's 4 ready at full speed leave 4: the first two, then nothing past them
    { ready: { 5001: 2, 5002: 2, 5003: 2, 5004: 2 }, safari: 4, lower: ['5003'], lift: [], held: 3, room: 4 },
    // a burst this look only, with nothing the look before, holds nothing back
    { ready: { 5001: 2, 5002: 2, 5003: 2, 5004: 2 }, safari: 4, before: 0, lower: [], lift: ['5004'], held: 1, room: 8 },
    // and what was there the look before counts only as far as it still is
    { ready: { 5001: 2, 5002: 2, 5003: 2, 5004: 2 }, safari: 0, before: 6, lower: [], lift: ['5004'], held: 1, room: 8 },
    // the first always runs, even past the room alone; the person's apps can take every core
    { ready: { 5001: 20, 5002: 1 }, safari: 12, lower: ['5002'], lift: [], held: 3, room: 1 },
    // on battery a few cores at most, with room to spare: past the first two threads everything waits, the test kit's files too
    { ready: { 5001: 2, 5002: 2, 5003: 1, 5006: 1, 5007: 2 }, safari: 0, isBattery: true, lower: ['5002', '5003', '5006', '5007'], lift: [], held: 6, room: 2 },
  ]
  for (const one of cases) {
    const paced = paceOf(lookOf(10, rows, one.ready, one.safari), one.before, one.isBattery)
    expect({ lower: paced.lower, lift: paced.lift.sort(), held: paced.held, room: paced.room, others: paced.others }).toEqual({ lower: one.lower, lift: one.lift, held: one.held, room: one.room, others: one.safari })
  }
  expect(threadsOf(['USER   PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND', 'sam   5001   ??   99.0 R    31T   0:00.00   1:00.00 python3', '      5001         99.0 R     4    0:00.00   1:00.00 ', '      5001          0.0 S    31T   0:00.00   0:00.01 ', 'sam   5002   ??    0.0 S     4   0:00.00   0:00.00 python3'].join('\n'))).toEqual({ 5001: { ready: 2, full: 1 }, 5002: { ready: 0, full: 0 } })
})
