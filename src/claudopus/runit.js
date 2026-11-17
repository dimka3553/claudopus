"use strict";
// ---- A command Claude Code refused a task, run on the person's own press ----
// Claude Code's auto mode refuses some of a background task's commands outright (an unpack of an app, a Claude Code session driven
// for a test, a look at a site's name servers: three on 17 Nov), and the person then pasted the command into their own terminal
// and told the chat. The card that says so shows the command whole, where it runs and for how long at most, and a Run it button:
// the person's press, and only that press, has Claudopus run that very command once, as a command they type would run (bin/run-it),
// and sends the task what it printed. Nothing about the task's own calls changes: the refused call stays refused, no permission or
// setting is touched, and the task is never let run anything itself. (A "Run it once" button that let the refused call through on a
// press was dropped on 17 Nov for exactly that: it moved Claude Code's decision.)
// What may be run is kept in the mod's own state by the hook that saw Claude Code's refusal, never taken from the card: the button
// shows only for that command, on the notice it was put up with, and goes with the press
const RUN_IT = 'Run it';
// A command longer than this is not offered: it could not be read on the card before pressing
const RUN_TEXT_MOST = 4000;
// Nor one holding a character that is drawn otherwise than the shell reads it, or not at all: a control character but a line break
// or tab, a direction mark or override, a zero-width or invisible one, a tag character
const RUN_UNSEEN = new RegExp('[\\u0000-\\u0008\\u000B-\\u001F\\u007F-\\u009F\\u00AD\\u034F\\u115F\\u1160\\u180E\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u206F\\u2800\\u3164\\uFEFF\\uFFA0\\uFFF9-\\uFFFB\\u{1D173}-\\u{1D17A}\\u{E0000}-\\u{E007F}]', 'u');
// The longest a command runs once pressed: one Claude would have held open, at most its own timeout or ten minutes; one it would
// have sent to the background, an hour. Then Claudopus stops it, and the task gets what it printed by then
const RUN_LIMIT = 10 * 60000;
const RUN_LIMIT_BACKGROUND = 60 * 60000;
// How often a running one is looked at, and how much of its output the task is sent in the message (the whole is in its file)
const RUN_LOOK = 5000;
const RUN_TAIL_LINES = 30;
const RUN_TAIL_CHARS = 4000;
// Offers never pressed, ended runs, and their output files are let go after a day; a run under way is always kept
const RUN_KEPT = 24 * 60 * 60000;
const RUNS_KEPT = 40;
const RUN_END = /claudopus-exit (\d+)( stopped)?\s*$/;
// Every offer and run, kept across reloads in the mod's state; drawn from `runList`, its copy as last written or read
const runs = atom({ plugin: 'claudopus', key: 'runs' }, [], { shape: 'runs-1' });
let runList = [];
const saveRuns = async ($, fn) => {
    const now = await $.clock.now();
    runList = await update($, runs, list => {
        const next = fn(list);
        const live = (one) => Boolean(one.startedAt && !one.endedAt);
        const kept = next.filter(one => !live(one) && now - (one.endedAt ?? one.startedAt ?? one.askAt) < RUN_KEPT).slice(-RUNS_KEPT);
        return next.filter(one => live(one) || kept.includes(one));
    });
    redraw($);
    return runList;
};
const isSameRun = (one, other) => one.card === other.card && one.askAt === other.askAt;
// The command its card's notice offers, not yet pressed: only the one Claudopus kept as Claude Code refused it, on that same notice
const offeredRun = (one) => {
    const ask = one.ask;
    if (!ask?.refused || one.chat || !ask.copy)
        return undefined;
    return runList.find(run => isSameRun(run, { card: one.id, askAt: ask.at }) && run.command === ask.copy && !run.startedAt);
};
// The runs on a card under way, and those ended whose output waits to start their ended task again
const runningOn = (card) => runList.filter(run => run.card === card && run.startedAt && (!run.endedAt || isRunWaking(run)));
// The ones the person stopped, for this load (the stop is also written in its output)
const runStopped = new Set();
const runKey = (run) => `${run.card}:${run.askAt}`;
// The presses this load took, so two at once run it once, and the ask a press cleared that starts its run (answerCleared)
const runPressed = new Set();
const runAsked = new Map();
// Ended runs whose output waits to start their ended task again, at the next hook of this chat (or the person's press of Send it
// now): kept with the run (`waiting`) until the wake that carries it is sent (runsSent), and queued by this load in `runWaking`
const runWaking = new Set();
const isRunWaking = (run) => Boolean(run.waiting);
// Queues what waits, for a run this load has not queued yet (after a reload too)
const queueWaiting = async ($) => {
    for (const run of runList.filter(one => one.waiting)) {
        const key = runKey(run);
        if (runWaking.has(key) || !run.waiting)
            continue;
        const card = (await read($, todos)).find(one => one.id === run.card);
        if (!card || isHeld(card)) {
            await saveRuns($, list => list.map(one => (isSameRun(one, run) ? { ...one, waiting: undefined } : one)));
            if (card)
                await stepLine($, run.card, `Claude was not sent what your command printed: you stopped the task. It is in ${run.log ?? 'its output file'}`);
            continue;
        }
        runWaking.add(key);
        const target = run.waiting.target;
        await toEnded($, card, target, `${run.waiting.text}\n${RESUMED_BY_ANSWER}`, { text: RUN_IT, ask: `the command Claude Code refused (${cut(run.description || run.command, 60)})`, at: run.endedAt ?? 0, line: lineOf(card), isCard: true, askAt: run.askAt }, true);
        const wake = wakes.find(w => w.target === target && w.isHookOnly);
        if (wake)
            wake.runs = [...(wake.runs ?? []), key];
    }
};
// The wake that carried what runs printed has gone: sent, not sent as the person stopped the task, or not delivered (the chat is
// then given it, wakeFailed). Each run stops waiting, and its card says what became of it
const runsSent = async ($, wake, how) => {
    const keys = wake.runs ?? [];
    if (!keys.length)
        return;
    const done = runList.filter(run => keys.includes(runKey(run)) && run.waiting);
    await saveRuns($, list => list.map(one => (keys.includes(runKey(one)) ? { ...one, waiting: undefined } : one)));
    for (const run of done) {
        runWaking.delete(runKey(run));
        if (how === 'held')
            await stepLine($, run.card, `Claude was not sent what your command printed: you stopped the task. It is in ${run.log ?? 'its output file'}`);
        if (how === 'failed')
            await stepLine($, run.card, `What your command printed couldn't start Claude again, so it went to the chat. It is in ${run.log ?? 'its output file'}`);
    }
};
const limitText = (ms) => (ms >= 60 * 60000 ? `${Math.round(ms / 3600000)} hour${ms >= 2 * 3600000 ? 's' : ''}` : `${Math.max(1, Math.round(ms / 60000))} min`);
// What a refused call may be offered as: a command of the Bash tool, short enough to read and drawn as it runs, with the folder it
// runs in (the chat's, where a task's commands start) and its limit
const runnableOf = (tool, call) => {
    const command = typeof call.command === 'string' ? call.command.trim() : '';
    if (tool !== 'Bash' || !command || command.length > RUN_TEXT_MOST || RUN_UNSEEN.test(command))
        return undefined;
    const asked = typeof call.timeout === 'number' && call.timeout > 0 ? Math.min(call.timeout, RUN_LIMIT) : RUN_LIMIT;
    const limitMs = call.run_in_background === true ? RUN_LIMIT_BACKGROUND : asked;
    return { command, cwd: cwd || dir.replace(/\/\.claude\/claudopus$/, ''), limitMs, description: typeof call.description === 'string' ? oneLine(call.description) : '' };
};
// Kept as its notice goes up on the card, by the hook that saw Claude Code refuse it; output files over a day old go meanwhile
const offerRun = async ($, card, from, askAt, runnable) => {
    await saveRuns($, list => [...list.filter(one => !isSameRun(one, { card, askAt })), { card, from, askAt, ...runnable }]);
    if (dir)
        void $.process.run(['find', `${dir}/runs`, '-type', 'f', '-name', '*.log', '-mtime', '+1', '-delete'], { timeoutMs: 15000 }).catch(() => undefined);
};
// What the card and the chat say of it before the press (where and for how long are said under the command: runWhere)
const runDetails = () => `${RUN_IT}: Claudopus runs exactly the command below, once, as yours, and sends the task what it printed. Nothing else changes: Claude Code still decides each of the task's own calls. ${CARRY_ON}: it doesn't run, and the task goes on without it.`;
// The Run it press on the card in this chat's own panel: the one way a run starts. The notice is answered first, as any press
// answers it; only once it has been cleared does the command start (answerCleared calls startRun). A press whose answer could not
// be written leaves the button to be pressed again
const runIt = async ($, one) => {
    presses += 1;
    const run = offeredRun(one);
    if (!run || runPressed.has(runKey(run)))
        return;
    runPressed.add(runKey(run));
    runAsked.set(one.id, run);
    try {
        await answerAsk($, one, RUN_IT);
    }
    finally {
        runAsked.delete(one.id);
        if (!runList.find(other => isSameRun(other, run))?.startedAt)
            runPressed.delete(runKey(run));
    }
};
// Started once its notice is cleared, on that press; whatever goes wrong is said on the card, and the task is told
const startRun = async ($, one, run) => {
    const at = await $.clock.now();
    const logFile = `${dir}/runs/${slug(one.id) || 'work'}-${at}.log`;
    const target = run.from || one.id;
    const isLogged = await $.fs.write(logFile, '').then(() => true).catch(() => false);
    const r = isLogged
        ? await $.process.run([`${$.plugin.root}/bin/run-it`, 'start', run.command, logFile, run.cwd], { cwd: run.cwd, timeoutMs: 15000 }).catch(err => ({ exitCode: 1, stdout: '', stderr: String(err) }))
        : { exitCode: 1, stdout: '', stderr: 'its output file could not be made' };
    const pid = r.exitCode === 0 ? /^(\d+)\s*$/.exec(r.stdout.trim())?.[1] : undefined;
    if (!pid) {
        const why = cut(oneLine(r.stderr), 100) || 'no reason given';
        await log($, `run of the refused command for ${one.id} not started: ${why}`);
        await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, endedAt: at, end: 'lost' } : other)));
        await stepLine($, one.id, `Your command didn't start: Claudopus could not start it (${why})`);
        await deliverRun($, one.id, target, run, named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, but Claudopus could not start it (${why}), so it did not run. What Claude Code refused stays refused: do not do it yourself. Carry on without it, and say in your report what was left out.`), at);
        return;
    }
    await saveRuns($, list => list.map(other => (isSameRun(other, run) ? { ...other, startedAt: at, log: logFile, pid } : other)));
    await log($, `refused command for ${one.id} run on ${who()}'s press, in ${run.cwd}`);
    const card = (await read($, todos)).find(other => other.id === target);
    const stops = run.limitMs >= RUN_LIMIT_BACKGROUND ? `It is stopped after ${limitText(run.limitMs)} if it is still running then.` : `It is stopped after ${limitText(run.limitMs)} at most.`;
    if (card?.status === 'working')
        await tell($, target, named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus is running it for them now, exactly as shown, in ${run.cwd}. What it prints goes to ${logFile}, which you can read as it runs; when it ends, its last lines come to you as a message. ${stops} Do not run it yourself; carry on with what does not need it, or end your step.`));
    followRun($, { ...run, startedAt: at, log: logFile, pid });
};
// Each run under way is looked at every RUN_LOOK by this load, a reload's own load taking over the ones it finds (followRuns)
const followed = new Set();
const followRuns = async ($) => {
    runList = await read($, runs);
    for (const run of runList)
        if (run.startedAt && !run.endedAt && run.log && run.pid)
            followRun($, run);
    await queueWaiting($);
};
const followRun = ($, run) => {
    const key = runKey(run);
    if (followed.has(key))
        return;
    followed.add(key);
    let isLooking = false;
    const timer = everyLoad($, RUN_LOOK, () => {
        if (isLooking)
            return;
        isLooking = true;
        void lookRun($, run)
            .then(isEnded => isEnded && (timer.cancel(), followed.delete(key)))
            .catch(err => log($, `run of ${run.card} not followed: ${String(err)}`))
            .finally(() => (isLooking = false));
    });
};
// Its output's end: what it printed, and how it ended once it has (stopped, when the stop wrote so)
const runOutputOf = (text) => {
    const end = RUN_END.exec(text);
    const lines = text.replace(RUN_END, '').replace(/\s+$/, '').split('\n');
    return { exit: end ? Number(end[1]) : undefined, isStopped: Boolean(end?.[2]), lines };
};
const lookRun = async ($, run) => {
    const now = runList.find(one => isSameRun(one, run)) ?? run;
    if (now.endedAt || !run.log || !run.pid || !run.startedAt)
        return true;
    during('look at a command run on a press');
    const out = runOutputOf(await fileEnd($, run.log, 64000));
    // Nothing is drawn again for a look: the card shows only that it runs, and its time moves with the panel's calm drawings (calmLook).
    // A drawing at each look, every 5 s and through the person's use of the panel, rebuilt the whole panel in the app, which flashed
    // (17 Nov, Dima's screenshot); its end is drawn at once (saveRuns)
    const at = await $.clock.now();
    const stopped = (isStopped) => (isStopped || runStopped.has(runKey(run)) ? 'stopped' : 'exited');
    if (out.exit !== undefined)
        return void (await endRun($, run, stopped(out.isStopped), out.exit, out.lines)), true;
    if (at - run.startedAt > run.limitMs) {
        await stopProcess($, run);
        return void (await endRun($, run, 'limit', undefined, runOutputOf(await fileEnd($, run.log, 64000)).lines)), true;
    }
    // Gone without writing its end (stopped from outside, or the Mac restarted): said so, with what it printed
    const alive = await $.process.run([`${$.plugin.root}/bin/run-it`, 'alive', run.pid, run.log], { timeoutMs: 10000 }).catch(() => undefined);
    if (alive && alive.exitCode !== 0) {
        const late = runOutputOf(await fileEnd($, run.log, 64000));
        return void (await endRun($, run, late.exit !== undefined ? stopped(late.isStopped) : runStopped.has(runKey(run)) ? 'stopped' : 'lost', late.exit, late.lines)), true;
    }
    return false;
};
const stopProcess = ($, run) => run.pid && run.log ? $.process.run([`${$.plugin.root}/bin/run-it`, 'stop', run.pid, run.log], { timeoutMs: 15000 }).catch(err => log($, `run of ${run.card} not stopped: ${String(err)}`)) : Promise.resolve();
// The person's Stop on its row
const stopRun = async ($, run) => {
    presses += 1;
    if (runStopped.has(runKey(run)))
        return;
    runStopped.add(runKey(run));
    redraw($);
    await stopProcess($, run);
};
// What the task is sent: written in while it runs; else it is started again with it from the next hook of this chat (a prompt, a
// turn's end, a press), never from a timer, where work started again runs with the mod's hooks skipped. Its card shows meanwhile
// that the output waits, with a press that sends it at once. Says whether it was sent now, waits, or is not sent (a stopped task)
const deliverRun = async ($, cardId, target, run, text, at) => {
    const card = (await read($, todos)).find(one => one.id === cardId);
    if (!card)
        return 'held';
    const isWorking = (await read($, todos)).find(one => one.id === target)?.status === 'working';
    const told = isWorking ? await tell($, target, text) : undefined;
    if (told && !told.deny)
        return 'sent';
    // A task the person stopped is not started again: what it printed stays in its file
    if (isHeld(card))
        return 'held';
    await saveRuns($, list => list.map(one => (isSameRun(one, run) ? { ...one, waiting: { target, text } } : one)));
    await queueWaiting($);
    return 'waits';
};
// Its end: kept, sent to the task, and said on the card
const endRun = async ($, run, end, exit, lines) => {
    const at = await $.clock.now();
    let isFirst = false;
    const last = oneLine(lines.filter(line => line.trim()).at(-1) ?? '').slice(0, 300);
    await saveRuns($, list => ((isFirst = false), list).map(one => (isSameRun(one, run) && !one.endedAt ? ((isFirst = true), { ...one, endedAt: at, end, ...(exit === undefined ? {} : { exit }), ...(last ? { last } : {}) }) : one)));
    if (!isFirst)
        return;
    runStopped.delete(runKey(run));
    const ran = took(at - (run.startedAt ?? at));
    const how = {
        exited: exit === 0 ? `ended well after ${ran}` : `ended with exit ${exit} after ${ran}`,
        limit: `was stopped by Claudopus at its limit of ${limitText(run.limitMs)}`,
        stopped: `was stopped by {name} after ${ran}`,
        lost: `stopped after ${ran} without saying how it ended`,
    }[end];
    const tail = cut(lines.slice(-RUN_TAIL_LINES).join('\n'), RUN_TAIL_CHARS);
    await log($, `refused command for ${run.card} run on ${who()}'s press ${named(how)}`);
    const text = named(`{Name} pressed "${RUN_IT}" on your card for the command Claude Code refused, and Claudopus ran it for them, exactly as shown, once, in ${run.cwd}:\n${run.command}\nIt ${how}. Its whole output is in ${run.log}; ${tail ? `its last lines:\n${tail}` : 'it printed nothing.'}\nThat ran on {name}'s own press, as theirs: it is no permission. Claude Code still decides each call of yours, so do not run it, or another way to the same end, yourself. Use what it printed; if you need it run again, ask {name} with the command.`);
    const sent = await deliverRun($, run.card, run.from || run.card, run, text, at);
    const said = { sent: 'Claude was sent what it printed', waits: 'its output waits for Claude above', held: `you stopped the task, so Claude was not sent it; it is in ${run.log}` }[sent];
    await stepLine($, run.card, `The command you ran ${how.replace(/\{name\}/g, 'you')}; ${said}`);
};
// On the card, before the press: where it runs and for how long at most, under the command; then the button
const runWhere = (ui, one, key) => {
    const run = offeredRun(one);
    return run ? <ui.Text key={`${key}-where`} dimColor wrap="wrap">{`Runs in ${shortPath(run.cwd, 60)}, as a command you type would, for at most ${limitText(run.limitMs)}`}</ui.Text> : null;
};
const runButton = ($, ui, one, key) => offeredRun(one) ? <ui.Button key={`${key}-run-${one.ask?.at ?? 0}-${loadMark}`} label={RUN_IT} onPress={() => void runIt($, one).catch(err => log($, `refused command not run: ${String(err)}`))}/> : null;
// While it runs: one quiet line, how long it has run, and Stop it; the command itself is not shown again, the person saw it before
// pressing (17 Nov). Once it has ended with its output waiting for its ended task: that, and a press that sends it now (its own hook
// sends what waits: tabs.tsx)
const runBlock = ($, ui, one, key, at) => {
    const list = one.chat ? [] : runningOn(one.id);
    if (!list.length)
        return null;
    return (<ui.Box key={key} flexDirection="column">
      {list.map(run => {
            const isStopping = runStopped.has(runKey(run));
            const isEnded = Boolean(run.endedAt);
            const said = isEnded ? 'Your command ended · its output waits for Claude' : isStopping ? 'Stopping your command' : `Running your command · ${took(at - (run.startedAt ?? at))}`;
            return (<ui.Box key={`${key}-${run.askAt}`} flexDirection="row" gap={1} height={1} overflow="hidden">
            <ui.Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
              <ui.Text dimColor wrap="truncate-end">{said}</ui.Text>
            </ui.Box>
            {isEnded ? (<ui.Box flexShrink={0}>
                <ui.Button key={`${key}-${run.askAt}-send-${loadMark}`} label="Send it now" plain hover={{ scope: `${key}-${run.askAt}-send`, underline: true }} onPress={() => ((presses += 1), redraw($))}/>
              </ui.Box>) : isStopping ? null : (<ui.Box flexShrink={0}>
                <ui.Button key={`${key}-${run.askAt}-stop-${loadMark}`} label="Stop it" plain dimColor hover={{ scope: `${key}-${run.askAt}-stop`, underline: true }} onPress={() => void stopRun($, run).catch(err => log($, `run not stopped: ${String(err)}`))}/>
              </ui.Box>)}
          </ui.Box>);
        })}
    </ui.Box>);
};
