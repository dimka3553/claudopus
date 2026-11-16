"use strict";
// Work that goes on when the chat's process ends: a keeper on this Mac for a chat the app runs from another Mac, the cards of
// work cut off marked so, that work started again by itself, and the person told on their own device
// ---- What the keeper reads, and the keeper itself ----
// Its files, one set per chat, under keep/: <chat>.json (the mod's: how many pieces of work are at work, and which),
// <chat>.state (the keeper's: when the process ended, when the chat went on here, when the app took it back), <chat>.log
const keepFile = (id, kind = 'json') => `${dir}/keep/${id}.${kind}`;
let keepSign = '';
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which cuts nothing off
let enginePid = '';
const pidOfEngine = async ($) => ((await $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(() => undefined))?.stdout ?? '').trim();
// Kept true as the cards change: the keeper reads it once the chat's process has ended, so it says what was at work then
const saveKeep = async ($) => {
    const { id, title } = await read($, me);
    if (!id || !dir)
        return;
    const ids = (await read($, todos)).filter(one => !one.parentId && !one.chat && (one.status === 'working' || lapsed.has(one.id))).map(one => one.id);
    const sign = `${ids.join(',')}|${title}`;
    if (sign === keepSign)
        return;
    keepSign = sign;
    await $.fs.write(keepFile(id), JSON.stringify({ count: ids.length, ids, title, pid: enginePid, at: await $.clock.now() }));
};
// A chat this Mac runs for the app on another Mac lives only as long as the app lets it: the app ends its process when it
// chooses, and the process signs in with the app's sign-in, which lapses while the app is away. So each load starts a keeper,
// in a session of its own so it outlives the process: when the process ends with work at work and the app does not start it
// again within a minute, it starts the chat again here, under this Mac's own sign-in (bin/keep). Not in the copy it starts,
// which Claude Code's own background service keeps, nor in a chat this Mac's own terminal runs
const isKeptCopy = async ($) => (await $.env.get('CLAUDE_CODE_SESSION_KIND')) === 'bg';
const startKeeper = async ($, id) => {
    if (!dir || !/^[A-Za-z0-9-]{1,80}$/.test(id) || (await isKeptCopy($)))
        return;
    // $PPID is the chat's process, which runs this shell; perl's setsid takes the keeper out of its process group, which the
    // app ends with the process
    const script = `nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$1" "$PPID" "$2" "$3" "$4" "$5" >/dev/null 2>&1 </dev/null &`;
    // The mod's own folder goes to the copy whole: a folder it is loaded from may have spaces in its path, which ps would split
    const own = $.plugin.root.includes('/.claude/plugins/cache/') ? '' : $.plugin.root;
    const r = await $.process.run(['/bin/sh', '-c', script, 'sh', `${$.plugin.root}/bin/keep`, id, cwd, dir, own]).catch(err => ({ exitCode: -1, stderr: String(err) }));
    await log($, r.exitCode === 0 ? `keeper started for ${id}` : `keeper not started: ${r.stderr.slice(0, 200)}`);
};
// With the app away its sign-in lapses, and the chat's process, still running, can no longer reach Claude: a turn ends with the
// API saying so. The keeper is asked to end the process then, which hands the chat to this Mac's own sign-in at once (bin/keep
// ends it on <chat>.handover); the work that failed so is counted as at work, to be started again there
// Only the API's own words for a lapsed sign-in, and only twice within a few minutes: one helper's refusal is no lapse
const SIGNIN_LAPSED = /API Error: 401\b[\s\S]{0,400}(authentication_error|OAuth token has expired|OAuth token revoked|invalid authentication credentials)/i;
const LAPSED_AGAIN = 10 * 60000;
const lapsed = new Set();
let lapsedAt = [];
const lapsedSignIn = async ($, e) => {
    if (!isRunFromAfar || e.reason !== 'error' || !SIGNIN_LAPSED.test(e.answer) || (await isKeptCopy($)))
        return false;
    const { id } = await read($, me);
    if (!id || !dir)
        return false;
    const now = await $.clock.now();
    if (e.agentId)
        lapsed.add(e.agentId);
    lapsedAt = [...lapsedAt.filter(at => now - at < LAPSED_AGAIN), now];
    if (lapsedAt.length < 2)
        return void log($, `a turn ended with a lapsed sign-in${e.agentId ? ` (work ${e.agentId})` : ''}; handed over if another does`);
    keepSign = '';
    await saveKeep($);
    // The keeper acts only on an ask naming the process it watches
    await $.fs.write(keepFile(id, 'handover'), enginePid);
    await log($, `the sign-in the app lent this chat lapsed${e.agentId ? ` (work ${e.agentId})` : ''}: the keeper is asked to hand the chat to this Mac`);
    return true;
};
// ---- Work cut off: marked, started again, said ----
// How long after the chat starts its cut-off work is looked at: by then Claude Code has started again what it starts itself
const CUT_LOOK = 30000;
// Work cut off longer ago than this is not started again
const CUT_OLD = 24 * 3600000;
const parsedOr = (text, or) => {
    try {
        return text ? JSON.parse(text) : or;
    }
    catch {
        return or;
    }
};
const readCut = async ($, id) => {
    const was = parsedOr(await readOr($, keepFile(id)), {});
    const state = parsedOr(await readOr($, keepFile(id, 'state')), {});
    const handled = parsedOr(await readOr($, keepFile(id, 'cut')), {});
    const ids = Array.isArray(was.ids) ? was.ids.filter((one) => typeof one === 'string' && /^[\w-]{1,80}$/.test(one)) : [];
    // The copy stopped for the app is a cut of its own: its work is started again in the app's chat
    const cutAt = typeof state.backAt === 'number' ? state.backAt : typeof state.cutAt === 'number' ? state.cutAt : 0;
    return { ids, cutAt, state, handled };
};
// Cut-off work not yet looked at again: Claude Code may be starting it again, so it is neither ended nor announced meanwhile
const cutPending = new Set();
const markCut = ($, id, handled) => $.fs.write(keepFile(id, 'cut'), JSON.stringify(handled)).catch(err => log($, `cut-off work not noted: ${String(err)}`));
// The words the work is started again with
const CUT_TELL = (cutAt, here) => `From Claudopus, not {name}: this chat's process was ended at ${hhmm(cutAt)} while you were working, not by {name}, and the chat has started again${here ? ' on this Mac by itself, under its own sign-in' : ''}. Continue from where you were: first check what you already have and whether a command you started is still running (a detached one keeps running), then continue with your to-dos.`;
const hhmm = (at) => new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
// As the chat starts: only a cut the keeper saw counts (a chat with no keeper, or one quit before any, starts nothing again),
// once, by the first process to start after it; a reload of the mod in that process before it was done takes it up again
const noteCut = async ($, id) => {
    keepSign = '';
    if (!dir)
        return;
    enginePid = await pidOfEngine($);
    const cut = await readCut($, id);
    if (!cut.ids.length || !cut.cutAt)
        return;
    if (cut.handled.at === cut.cutAt && cut.handled.isDone)
        return;
    const now = await $.clock.now();
    if (now - cut.cutAt > CUT_OLD)
        return void log($, `work cut off at ${hhmm(cut.cutAt)} is too old to start again: ${cut.ids.join(', ')}`);
    const isCopy = await isKeptCopy($);
    await markCut($, id, { at: cut.cutAt, pid: enginePid, isDone: false });
    for (const one of cut.ids)
        cutPending.add(one);
    await log($, `work cut off at ${hhmm(cut.cutAt)}${isCopy ? ', the chat going on here as a copy' : ''}: ${cut.ids.join(', ')}`);
    $.clock.after(CUT_LOOK, () => void bringBack($, id, cut.ids, cut.cutAt, isCopy).catch(err => log($, `cut-off work not started again: ${String(err)}`)));
};
// Each piece of cut-off work: one Claude Code started again by itself is marked; one the person stopped since is left; any other
// is sent a message, which starts it again; one that cannot be is marked cut off and left ended. Then one notice for all of them
const bringBack = async ($, id, ids, cutAt, isCopy) => {
    const handled = parsedOr(await readOr($, keepFile(id, 'cut')), {});
    if (handled.at === cutAt && handled.isDone)
        return;
    await markCut($, id, { at: cutAt, pid: enginePid, isDone: true });
    for (const one of ids)
        cutPending.delete(one);
    await sync($).catch(() => undefined);
    const live = await $.agent.list().catch(() => []);
    const back = [];
    const lost = [];
    const heldNow = await read($, todos);
    for (const one of ids.filter(one => !stoppedHere.has(one) && !isHeld(heldNow.find(card => card.id === one)))) {
        const isLive = live.some(agent => agent.id === one && WORKING.includes(agent.status));
        const r = isLive ? { isDelivered: true } : await $.session.send({ to: { agentId: one }, text: named(CUT_TELL(cutAt, isCopy)) }).catch(err => ({ isDelivered: false, reason: String(err) }));
        (r.isDelivered ? back : lost).push(one);
        if (!r.isDelivered)
            await log($, `cut-off work ${one} not started again: ${r.reason}`);
    }
    if (!back.length && !lost.length)
        return;
    const now = await $.clock.now();
    await changeTodos($, list => {
        const known = new Set(list.map(one => one.id));
        const added = [...back, ...lost].filter(one => !known.has(one)).map(one => ({ ...started(one, '', '', '', cutAt), status: 'stopped', endedAt: cutAt }));
        return [...list, ...added].map(one => back.includes(one.id) ? { ...(one.status === 'working' ? one : resumed(one, now)), parentId: '', cutAt, backAt: now } : lost.includes(one.id) ? { ...(one.status === 'working' ? ended(one, 'stopped', cutAt) : one), parentId: '', cutAt, backAt: undefined } : one);
    });
    await saveKeep($);
    redraw($);
    const cards = await read($, todos);
    const titled = (one) => `"${titleOf(cards.find(card => card.id === one) ?? started(one, '', '', '', cutAt))}"`;
    const where = isCopy ? 'on this Mac by itself' : 'again';
    const text = [
        back.length ? `${back.length === 1 ? `${titled(back[0] ?? '')} was interrupted at ${hhmm(cutAt)} and has been running ${where}` : `${back.length} tasks were interrupted at ${hhmm(cutAt)} and have been running ${where}`} since ${hhmm(now)}.` : '',
        lost.length ? `${lost.length === 1 ? titled(lost[0] ?? '') : `${lost.length} tasks`} interrupted at ${hhmm(cutAt)} couldn't be restarted.` : '',
    ]
        .filter(Boolean)
        .join(' ');
    $.ui.log(text);
    await tellDevice($, text);
};
// The person is told on their own device: Claude Code's push to the Claude app on their phone, where Remote Control reaches it;
// and the notification this Mac's chats raise
const tellDevice = async ($, text) => {
    const pushed = await $.tool.call({ tool: 'PushNotification', message: text.slice(0, 199) }).catch(err => ({ deny: String(err) }));
    await log($, `cut-off notice pushed: ${JSON.stringify(pushed).slice(0, 200)}`);
    await alertPerson($, 'cut', 'Task interrupted and restarted', text, `cut-${Math.round((await $.clock.now()) / 60000)}`);
};
// The line on a card of cut-off work: when, and whether it goes on again
const cutLine = (one) => one.cutAt ? (one.backAt ? `Interrupted at ${hhmm(one.cutAt)} because the chat's process ended; running again since ${hhmm(one.backAt)}.` : `Interrupted at ${hhmm(one.cutAt)} because the chat's process ended; it couldn't be restarted.`) : '';
