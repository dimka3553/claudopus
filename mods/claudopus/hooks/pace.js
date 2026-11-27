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
export const PACE_EVERY = 5000;
// The cores kept free beyond what the person's apps and the system use now: two on a Mac of eight cores or more, else one
export const paceReserve = (cores) => (cores >= 8 ? 2 : 1);
// Every process with its parent, group, age, priority and program; every thread ready to run, with its priority (only those: all
// of a Mac's threads are thousands of lines); the cores; and the chat's own engine
export const PACE_LOOK = `echo "@@PACE@@ $PPID"; echo @@CORES@@; sysctl -n hw.ncpu; echo @@PS@@; ps -A -o pid=,ppid=,pgid=,etime=,pri=,comm=; echo @@THREADS@@; ps -M -A -c | awk '($1 ~ /^[0-9]+$/ && $3 ~ /^R/) || ($1 !~ /^[0-9]+$/ && $5 ~ /^R/)'`;
// The background mode on for those in $1, and off for those in $2 (spaces between); a process gone meanwhile is passed over
export const PACE_SET = 'for p in $1; do taskpolicy -b -p "$p" 2>/dev/null; done; for p in $2; do taskpolicy -B -p "$p" 2>/dev/null; done; true';
// A process or thread in the background mode runs at a priority of 4 or lower; one that is only busy stays far above it
const LOW_PRI = 4;
// ps's elapsed time, [[days-]hours:]minutes:seconds
const ageOf = (time) => {
    const [days, rest = ''] = time.includes('-') ? time.split('-') : ['0', time];
    return Number(days) * 86400 + rest.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);
};
// ps -M: a process's first line names its user, its other threads start with its number; R is running or ready to run, and the
// priority may carry a letter (31T)
export const threadsOf = (text) => {
    const by = {};
    for (const line of text.split('\n')) {
        const f = line.trim().split(/\s+/);
        const [pid, state, pri] = /^\d+$/.test(f[0] ?? '') ? [f[0], f[2], f[3]] : [f[1], f[4], f[5]];
        if (!pid || !/^\d+$/.test(pid))
            continue;
        const one = (by[pid] ??= { ready: 0, full: 0 });
        if (!/^R/.test(state ?? ''))
            continue;
        one.ready += 1;
        if (parseInt(pri ?? '0', 10) > LOW_PRI)
            one.full += 1;
    }
    return by;
};
export const paceLookOf = (text) => {
    const part = (name) => text.split(`@@${name}@@`)[1]?.split(/^@@[A-Z]+@@/m)[0] ?? '';
    const self = /^@@PACE@@ (\d+)/m.exec(text)?.[1] ?? '';
    const cores = Number(part('CORES').trim()) || 0;
    const procs = part('PS').split('\n').flatMap(line => {
        const m = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+([\d:-]+)\s+(\d+)\s+(.*)$/.exec(line);
        return m ? [{ pid: m[1] ?? '', ppid: m[2] ?? '', pgid: m[3] ?? '', age: ageOf(m[4] ?? '0'), pri: Number(m[5]), name: (m[6] ?? '').trim() }] : [];
    });
    return { self, cores, procs, threads: threadsOf(part('THREADS')) };
};
// A chat's engine: this chat's own, and every claude on the Mac (the desktop app is Claude, its engines and the terminal's are claude;
// Linux names an engine by its version's number). Never the app, its helpers or anything else of the person's
const isEngine = (p, self) => p.pid === self || (p.name.split('/').pop() ?? '') === 'claude' || /^\d+\.\d+\.\d+$/.test(p.name);
// Work that runs on after the command that started it ended: launchd took it in, and the shell that led its group is gone too
// (as hooks/usage.ts counts it Claude's)
const isLeft = (p, alive) => p.ppid === '1' && p.pgid !== p.pid && !alive.has(p.pgid) && !/^\/System\/|crashpad/i.test(p.name);
// Claude's commands: everything the engines started, and work they left running, never an engine itself
export const commandsOf = (look) => {
    const alive = new Set(look.procs.map(p => p.pid));
    const engines = new Set(look.procs.filter(p => isEngine(p, look.self)).map(p => p.pid));
    const children = new Map();
    for (const p of look.procs)
        children.set(p.ppid, [...(children.get(p.ppid) ?? []), p.pid]);
    const found = new Set();
    const queue = [...engines, ...look.procs.filter(p => isLeft(p, alive)).map(p => (found.add(p.pid), p.pid))];
    for (let n = 0; n < queue.length; n++)
        for (const child of children.get(queue[n] ?? '') ?? [])
            if (!found.has(child) && !engines.has(child))
                (found.add(child), queue.push(child));
    return look.procs.filter(p => found.has(p.pid));
};
// Which commands go into the background mode and which come out of it. The room is the cores less the reserve and less what else is
// ready at full speed, taken as the lower of this look's count and the last one's (`before`): a burst of a moment, which the reserve
// covers, would otherwise hold Claude's work back for a whole look while cores stood idle (seen 21 Nov: counts of 3 to 31 a few
// seconds apart). The oldest commands first run at full speed while their ready threads fit in it (the first always does), the rest
// wait; a command with nothing ready is never held, and one waiting comes back once it fits
export const paceOf = (look, before) => {
    const order = commandsOf(look).sort((a, b) => b.age - a.age || Number(a.pid) - Number(b.pid));
    // (a process the list of processes does not have was born between the two listings: it is not counted, as it may be Claude's)
    const ours = new Set(order.map(p => p.pid));
    const listed = new Set(look.procs.map(p => p.pid));
    const seen = Object.entries(look.threads).reduce((sum, [pid, t]) => sum + (ours.has(pid) || !listed.has(pid) ? 0 : t.full), 0);
    const others = before === undefined ? seen : Math.min(seen, before);
    const room = Math.max(1, look.cores - paceReserve(look.cores) - others);
    const lower = [];
    const lift = [];
    let used = 0;
    for (const p of order) {
        // (one waiting counts at least a thread: a look's chance moment with none of its threads ready must not bring every waiting
        // command back at once, as it did on 21 Nov, 69 at a time)
        const isLow = p.pri <= LOW_PRI;
        const ready = Math.max(look.threads[p.pid]?.ready ?? 0, isLow ? 1 : 0);
        const fits = ready === 0 || used === 0 || used + ready <= room;
        if (fits)
            used += ready;
        if (fits && isLow)
            lift.push(p.pid);
        if (!fits && !isLow)
            lower.push(p.pid);
    }
    const held = order.filter(p => (p.pri <= LOW_PRI && !lift.includes(p.pid)) || lower.includes(p.pid)).length;
    return { lower, lift, held, room, others: seen };
};
