// Claude's commands take their turn on the processor, so the person always has room on their own Mac however many chats and tasks
// run. Each look counts the threads ready to run at full speed that are not Claude's commands (the person's apps, the system, the
// chats themselves); Claude's commands, oldest first, run at full speed while their own ready threads fit in the cores left after
// those and a reserve (paceReserve); the newer ones beyond wait in the Mac's background mode, where they still move on what nothing
// else wants, and come back to full speed, oldest first, as room comes. Nothing here touches a command's text, the engine or the app.
//
// Measured on an 18-core Mac on 21 Nov, with 54 busy programs beside one normal program standing for the person's: a lower priority
// (nice, even 20) changed nothing, the normal program still got about a quarter of a core; the background mode (taskpolicy -b) gave
// it the whole core, but work in that mode ran at about a quarter of its speed even with cores to spare, and the utility clamp at
// about half. So only what does not fit waits in that mode, and the rest runs as it always did. Counting only Claude's own threads
// against all cores but two left the person's program half a core: the system and the apps had 7 to 20 threads ready of their own

// How often the processes are looked at, by one chat for every chat on the Mac
export const PACE_EVERY = 5_000
// The cores kept free beyond what the person's apps and the system use now: two on a Mac of eight cores or more, else one
export const paceReserve = (cores: number) => (cores >= 8 ? 2 : 1)
// On battery, the most threads of Claude's commands that run at full speed at once, oldest first; the rest wait in the background
// mode, which on a Mac runs them on its efficiency cores. On 27 Nov two tasks' test runs, about 28 processes at once, had the Mac
// draw 50 to 60 W on its battery
export const paceBatteryRoom = (cores: number) => Math.max(2, Math.floor(cores / 4))
// The chat's own engine and the look's own shell; the cores, unless $1 gives them (they never change, so they are asked for
// once); and every process with its state, parent, group, age, priority and program
export const PACE_LOOK = `echo "@@PACE@@ $PPID $$"; [ -n "$1" ] || { echo @@CORES@@; sysctl -n hw.ncpu; }; echo @@PS@@; ps -A -o stat=,pid=,ppid=,pgid=,etime=,pri=,comm=`
// Every thread ready to run, with its priority (only those: all of a Mac's threads are thousands of lines, and listing them is
// the heaviest part of a look): asked for only when the processes leave something to decide (paceNeedsThreads)
export const PACE_THREADS = `echo "@@PACE@@ $PPID"; echo @@THREADS@@; ps -M -A -c | awk '($1 ~ /^[0-9]+$/ && $3 ~ /^R/) || ($1 !~ /^[0-9]+$/ && $5 ~ /^R/)'`
// The background mode on for those in $1, and off for those in $2 (spaces between); a process gone meanwhile is passed over
export const PACE_SET = 'for p in $1; do taskpolicy -b -p "$p" 2>/dev/null; done; for p in $2; do taskpolicy -B -p "$p" 2>/dev/null; done; true'
// A process or thread in the background mode runs at a priority of 4 or lower; one that is only busy stays far above it
const LOW_PRI = 4

// (isIdle: its state says none of its threads runs or is ready to)
export type PaceProc = { pid: string; ppid: string; pgid: string; age: number; pri: number; name: string; isIdle?: true }
// Each process's threads ready to run: all of them, and those at full speed (above the background mode)
export type PaceThreads = Record<string, { ready: number; full: number }>
export type PaceLook = { self: string; own?: string; cores: number; procs: PaceProc[]; threads: PaceThreads }

// ps's elapsed time, [[days-]hours:]minutes:seconds
const ageOf = (time: string) => {
  const [days, rest = ''] = time.includes('-') ? time.split('-') : ['0', time]
  return Number(days) * 86400 + rest.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
}
// ps -M: a process's first line names its user, its other threads start with its number; R is running or ready to run, and the
// priority may carry a letter (31T)
export const threadsOf = (text: string): PaceThreads => {
  const by: PaceThreads = {}
  for (const line of text.split('\n')) {
    const f = line.trim().split(/\s+/)
    const [pid, state, pri] = /^\d+$/.test(f[0] ?? '') ? [f[0], f[2], f[3]] : [f[1], f[4], f[5]]
    if (!pid || !/^\d+$/.test(pid)) continue
    const one = (by[pid] ??= { ready: 0, full: 0 })
    if (!/^R/.test(state ?? '')) continue
    one.ready += 1
    if (parseInt(pri ?? '0', 10) > LOW_PRI) one.full += 1
  }
  return by
}
export const paceLookOf = (text: string): PaceLook => {
  const part = (name: string) => text.split(`@@${name}@@`)[1]?.split(/^@@[A-Z]+@@/m)[0] ?? ''
  const [, self = '', own] = /^@@PACE@@ (\d+)(?: (\d+))?/m.exec(text) ?? []
  const cores = Number(part('CORES').trim()) || 0
  const procs = part('PS').split('\n').flatMap(line => {
    const m = /^\s*(?:([A-Za-z+<>]+)\s+)?(\d+)\s+(\d+)\s+(\d+)\s+([\d:-]+)\s+(\d+)\s+(.*)$/.exec(line)
    return m ? [{ pid: m[2] ?? '', ppid: m[3] ?? '', pgid: m[4] ?? '', age: ageOf(m[5] ?? '0'), pri: Number(m[6]), name: (m[7] ?? '').trim(), ...(m[1] && !m[1].startsWith('R') ? { isIdle: true as const } : {}) }] : []
  })
  return { self, ...(own ? { own } : {}), cores, procs, threads: threadsOf(part('THREADS')) }
}

// A chat's engine: this chat's own, and every claude on the Mac (the desktop app is Claude, its engines and the terminal's are claude;
// Linux names an engine by its version's number). Never the app, its helpers or anything else of the person's
const isEngine = (p: PaceProc, self: string) => p.pid === self || (p.name.split('/').pop() ?? '') === 'claude' || /^\d+\.\d+\.\d+$/.test(p.name)
// Work that runs on after the command that started it ended: launchd took it in, and the shell that led its group is gone too
// (as hooks/usage.ts counts it Claude's)
const isLeft = (p: PaceProc, alive: Set<string>) => p.ppid === '1' && p.pgid !== p.pid && !alive.has(p.pgid) && !/^\/System\/|crashpad/i.test(p.name)
// Claude's commands: everything the engines started, and work they left running, never a chat's engine itself. An engine one of
// Claude's commands started is a command too, with all it starts: a test kit's `claude plugin test` runs each test file in a claude
// of its own, and on 27 Nov 28 of them ran at full speed, never paced, as each was taken for a chat
export const commandsOf = (look: PaceLook) => {
  const alive = new Set(look.procs.map(p => p.pid))
  const byPid = new Map(look.procs.map(p => [p.pid, p]))
  const named = new Set(look.procs.filter(p => isEngine(p, look.self)).map(p => p.pid))
  const isUnderEngine = (p: PaceProc | undefined) => {
    for (let up = byPid.get(p?.ppid ?? ''), n = 0; up && n < 64; up = byPid.get(up.ppid), n++) if (named.has(up.pid)) return true
    return false
  }
  const engines = new Set([...named].filter(pid => pid === look.self || !isUnderEngine(byPid.get(pid))))
  const children = new Map<string, string[]>()
  for (const p of look.procs) children.set(p.ppid, [...(children.get(p.ppid) ?? []), p.pid])
  const found = new Set<string>()
  const queue = [...engines, ...look.procs.filter(p => isLeft(p, alive)).map(p => (found.add(p.pid), p.pid))]
  for (let n = 0; n < queue.length; n++) for (const child of children.get(queue[n] ?? '') ?? []) if (!found.has(child) && !engines.has(child)) (found.add(child), queue.push(child))
  return look.procs.filter(p => found.has(p.pid))
}

// Whether the threads must be listed to decide. They tell how many threads each command has ready and how many everything else
// has; the first command with any ready always runs at full speed and one with none is never held, so with at most one command
// that may have a thread ready (its state says so, or it waits in the background mode, where it counts as one) the decision is
// the same without them: nothing is held, and one waiting comes back. The look's own shell and ps are not counted
export const paceNeedsThreads = (look: PaceLook) => commandsOf(look).filter(p => !(p.isIdle && p.pri > LOW_PRI) && p.pid !== look.own && p.ppid !== look.own).length > 1

// Which commands go into the background mode and which come out of it. The room is the cores less the reserve and less what else is
// ready at full speed, taken as the lower of this look's count and the last one's (`before`): a burst of a moment, which the reserve
// covers, would otherwise hold Claude's work back for a whole look while cores stood idle (seen 21 Nov: counts of 3 to 31 a few
// seconds apart). The oldest commands first run at full speed while their ready threads fit in it (the first always does), the rest
// wait; a command with nothing ready is never held, and one waiting comes back once it fits. On battery the room is a few cores at most
export const paceOf = (look: PaceLook, before?: number, isBattery = false) => {
  const order = commandsOf(look).sort((a, b) => b.age - a.age || Number(a.pid) - Number(b.pid))
  // (a process the list of processes does not have was born between the two listings: it is not counted, as it may be Claude's)
  const ours = new Set(order.map(p => p.pid))
  const listed = new Set(look.procs.map(p => p.pid))
  const seen = Object.entries(look.threads).reduce((sum, [pid, t]) => sum + (ours.has(pid) || !listed.has(pid) ? 0 : t.full), 0)
  const others = before === undefined ? seen : Math.min(seen, before)
  const room = Math.min(Math.max(1, look.cores - paceReserve(look.cores) - others), isBattery ? paceBatteryRoom(look.cores) : Infinity)
  const lower: string[] = []
  const lift: string[] = []
  let used = 0
  for (const p of order) {
    // (one waiting counts at least a thread: a look's chance moment with none of its threads ready must not bring every waiting
    // command back at once, as it did on 21 Nov, 69 at a time)
    const isLow = p.pri <= LOW_PRI
    const ready = Math.max(look.threads[p.pid]?.ready ?? 0, isLow ? 1 : 0)
    const fits = ready === 0 || used === 0 || used + ready <= room
    if (fits) used += ready
    if (fits && isLow) lift.push(p.pid)
    if (!fits && !isLow) lower.push(p.pid)
  }
  const held = order.filter(p => (p.pri <= LOW_PRI && !lift.includes(p.pid)) || lower.includes(p.pid)).length
  return { lower, lift, held, room, others: seen }
}
