"use strict";
// Heavy commands wait their turn: a task's browser, build or render that would start while the Mac is busy and another of the
// chat's heavy commands runs is refused, with why and what it waits for. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once: captures timed out and
// a dev server took 13 s a request; on 15 Nov this Mac's load average reached 204 on 18 cores. What counts as heavy is heavyOf in
// hooks/jobs.ts; the marks are the person's setting (`heavy` in config.json, HEAVY_MODES in hooks/config.tsx)
//
// Nothing waits in a hook, with a sleep or on a timer: a command that must wait is refused at once with why and what it waits
// for, and its task decides what to do meanwhile and when to send it again
// After one is let go, the next waits this long unless few run, so the load of the last shows before another starts
const HEAVY_RAMP = 20000;
// The heavy calls let through whose call has not ended, by tool_use_id
const heavyOpen = new Map();
// The commands judged heavy, as cards keep a background or detached run's command, so one that goes on past its call still counts
const heavySeen = new Set();
let heavyLetAt = 0;
const keptCmd = (command) => oneLine(command).slice(0, 400);
// The heavy commands of this chat's work that run now: calls held open, and those in the background that go on (never another
// chat's card, which this chat's memory of what is heavy does not cover), each in its own words
const heavyRuns = (list) => list.filter(one => !one.chat).flatMap(one => (one.bg ?? []).filter(run => run.cmd && heavySeen.has(run.cmd)).map(run => runWords(run.what, run.cmd)));
const heavyRunning = (list) => heavyOpen.size + heavyRuns(list).length;
// Whether the Mac is past the setting's marks: its load average for each core, or its memory in use
const isMacBusy = (f, mode) => Boolean(f && ((f.load !== undefined && f.loadCores && f.load >= mode.load * f.loadCores) || (f.memTotal > 0 && f.memUsed / f.memTotal >= mode.memory)));
// Whether a heavy command may start now: always when none of the chat's runs, so it never waits on load the work does not make;
// never while the Mac is busy; else when few run, or none was let go just now, so the load of the last shows before the next
const heavyRoom = (list, f, mode, now) => {
    if (mode.value === 'never')
        return true;
    const running = heavyRunning(list);
    if (!running)
        return true;
    if (isMacBusy(f, mode))
        return false;
    return running < Math.max(2, Math.round((f?.loadCores ?? 8) / 4)) || now - heavyLetAt >= HEAVY_RAMP;
};
// How busy the Mac is, in words
const busyWords = (f) => !f ? 'busy' : [f.load !== undefined && f.loadCores ? `load ${Math.round(f.load)} on ${f.loadCores} cores` : '', f.memTotal ? `${gbText(f.memUsed)} of ${gbText(f.memTotal)} GB memory in use` : ''].filter(Boolean).join(', ');
const HEAVY_HELD = (what, f, running, open) => `Not run: the Mac is busy (${busyWords(f)}), and "${what}" is a heavy command, so it waits for ${[...running.map(one => `"${one}"`), ...(open ? [open === 1 ? 'a heavy command now running' : `${open} heavy commands now running`] : [])].join(', ') || 'the Mac to have room'} to end. Do what does not need it, and send the same command again once one of those has ended, or the Mac has room.`;
// Whether a piece of work's Bash call runs now or must wait its turn: a deny that says why and what it waits for, else the
// call's id, to take out of heavyOpen as the call ends. Nothing waits here: the answer is given at once, and nothing sends it later
const turnHeavy = async ($, e) => {
    const input = e;
    const command = String(input.command ?? '');
    if (!heavyOf(command, await scriptsRun($, command)))
        return {};
    const agent = e.agentId ?? '';
    const list = await read($, todos);
    if (!list.some(one => one.id === agent && !one.chat))
        return {};
    const mode = heavyModeOf(await readConfig($, dir));
    if (mode.value === 'never')
        return {};
    const id = String(input.tool_use_id ?? '');
    heavySeen.add(keptCmd(command));
    await lookUsage($).catch(() => undefined);
    const now = await $.clock.now();
    if (heavyRoom(list, usageNow(now), mode, now))
        return (heavyOpen.set(id, agent), (heavyLetAt = now), { id });
    await log($, `work ${agent}'s heavy command refused while the Mac is busy (${busyWords(usageNow(now))})`);
    return { deny: HEAVY_HELD(cut(oneLine(String(input.description ?? '')) || labelOf('', command), 120), usageNow(now), heavyRuns(list), heavyOpen.size) };
};
