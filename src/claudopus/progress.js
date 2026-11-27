"use strict";
// Progress: each task sorted into the area of the person's work it moves on, kept in the memory folder's progress/ by Claudopus
// alone: the picture (the north star and the goals, in the person's own words), the areas, and each area's
// entries, the newest first. The hooks only queue events; the indexer here drains the queue in the background, one chat at a time,
// with one answer of Sonnet's for each. What needs no engine (the files' shapes, the prompts, applying an answer) is in
// mods/claudopus/hooks/progress.ts; the Progress tab draws from the files
// The folder of it all, in the memory folder
const progressDir = () => `${dir}/progress`;
// Counts the changes to progress/ this chat made: each one redraws what reads it (another chat's change is seen as its file moves)
const progressChanged = atom({ plugin: 'claudopus', key: 'progress' }, 0, { shape: 'progress-1' });
// The picture as saved (an empty one when there is none yet), every area in its saved order, and an area's entries, newest first
const readPicture = async ($) => pictureFrom(await readOr($, `${progressDir()}/picture.json`));
const readAreas = async ($) => areasFrom(await readOr($, `${progressDir()}/areas.json`));
const readEntries = async ($, areaId) => (isAreaId(areaId) ? entriesFrom(await readOr($, `${progressDir()}/areas/${areaId}.json`)) : []);
// The areas a task at work now is sorted into: drawn as being built
const areasBeingBuilt = async ($) => {
    const working = new Set((await read($, todos)).filter(one => !one.parentId && !one.chat && one.status === 'working').map(one => one.id));
    const found = new Set();
    if (!working.size)
        return found;
    for (const area of await readAreas($))
        if ((await readEntries($, area.id)).some(entry => entry.task && working.has(entry.task)))
            found.add(area.id);
    return found;
};
// An entry's picture's small copy, as the Results tab makes them (thumbOf draws it)
const entryThumb = (path) => progressThumb(reportsDir(), path);
const SET_ASIDE_TOLD = () => setAsideTold(who(true));
const PROGRESS_LINE = () => progressLine(who(), dir);
// ---- The queue: each hook only adds an event, at once, and never waits for the indexer ----
const queueDir = () => `${progressDir()}/queue`;
// Named by when it happened, so the oldest is drained first (of one moment in this chat, the first queued)
let queued = 0;
const queueName = (at, seq = (queued += 1)) => `${String(at).padStart(15, '0')}-${String(seq % 1e6).padStart(6, '0')}${Math.random().toString(36).slice(2, 6)}.json`;
const queueProgress = async ($, event) => {
    if (!dir || !event.text.trim())
        return;
    const seq = (queued += 1);
    const at = event.at ?? (await $.clock.now());
    const chat = event.chat ?? (await read($, me)).id;
    const one = { ...event, at, chat, text: hideKeys(clip(event.text.trim(), EVENT_CHARS[event.kind] / 2)) };
    await $.fs.write(`${queueDir()}/${queueName(at, seq)}`, `${JSON.stringify(one)}\n`);
    drainSoon($);
};
const queueSoon = ($, event) => void queueProgress($, event).catch(err => log($, `progress event not queued: ${String(err)}`));
// ---- The indexer ----
// How soon after an event it looks, and again after an answer that did not come
const PROGRESS_AFTER = 3000;
const PROGRESS_RETRY = 5 * 60000;
// The first look after a chat loads: half a minute after the catch-up starts, so the two never start in the same moment
const PROGRESS_LOAD_AFTER = 90000;
// An event the model could not answer this many times is dropped, and index.log says so
const PROGRESS_TRIES = 3;
// How many model calls go at once while the history is read in, and how far back it goes
const BACKFILL_AT_ONCE = 16;
const BACKFILL_DAYS = 30;
// The drain's lock is taken over once its maker has been gone this long; the files' lock, held only to write, sooner
const DRAIN_STALE = 10 * 60000;
const FILES_STALE = 30000;
// How often the picture is written again from the person's newest words, and how much of them the model reads
const PICTURE_EVERY = 7 * 86400000;
const PICTURE_READ = 80000;
let drainTimer;
let draining = false;
let pictureTried = false;
const drainSoon = ($, ms = PROGRESS_AFTER) => {
    if (drainTimer)
        return;
    drainTimer = afterLoad($, ms, () => void ((drainTimer = undefined), drainProgress($).catch(err => log($, `progress not indexed: ${String(err)}`))));
};
const indexLog = ($, line) => appendTo($, `${progressDir()}/index.log`, `${new Date().toISOString()} ${oneLine(line).slice(0, 400)}\n`).catch(() => undefined);
// A folder only one chat can make, as shortenPages takes its own, taken over once it is older than `stale`
const takeLock = async ($, name, stale) => {
    const lock = `${dir}/locks/${name}`;
    const now = await $.clock.now();
    const take = () => $.process.run(['/bin/sh', '-c', 'mkdir -p "$(dirname "$1")" && mkdir "$1" 2>/dev/null && printf %s "$2" > "$1/at"', 'sh', lock, String(now)]).then(r => r.exitCode === 0, () => false);
    if (await take())
        return lock;
    if (now - Number((await readOr($, `${lock}/at`)) || now) < stale)
        return '';
    await $.process.run(['rm', '-rf', lock]).catch(() => undefined);
    return (await take()) ? lock : '';
};
const freeLock = ($, lock) => $.process.run(['rm', '-rf', lock]).then(() => undefined, () => undefined);
// Files written under a lock of their name (locks/<name>): one at a time in this chat, and across chats, waiting a moment for
// another chat's write. Every write of progress/'s files goes under locks/progress
const writing = new Map();
const withLock = ($, name, fn) => {
    const run = (writing.get(name) ?? Promise.resolve()).then(async () => {
        let lock = '';
        for (let tries = 0; tries < 20 && !lock; tries += 1) {
            lock = await takeLock($, name, FILES_STALE);
            if (!lock)
                await new Promise(done => $.clock.after(250, () => done(undefined)));
        }
        if (!lock)
            throw new Error(`another chat is writing the files of ${name}`);
        try {
            return await fn();
        }
        finally {
            await freeLock($, lock);
        }
    });
    writing.set(name, run.catch(() => undefined));
    return run;
};
const withProgressFiles = ($, fn) => withLock($, 'progress', fn);
const writeAreas = ($, areas) => $.fs.write(`${progressDir()}/areas.json`, `${JSON.stringify({ areas }, null, 2)}\n`);
const writeEntries = ($, areaId, entries) => $.fs.write(`${progressDir()}/areas/${areaId}.json`, `${JSON.stringify({ entries: entries.slice(0, ENTRIES_MOST) }, null, 2)}\n`);
const progressMoved = ($) => update($, progressChanged, n => n + 1).then(() => redraw($));
const readProgress = async ($) => {
    const areas = await readAreas($);
    const entries = new Map();
    for (const area of areas)
        entries.set(area.id, await readEntries($, area.id));
    return { areas, entries };
};
// A press on Set aside: the task's entries are marked at once, before the model has sorted anything
const markAside = async ($, task) => {
    const isMarked = await withProgressFiles($, async () => {
        let found = false;
        for (const [id, list] of (await readProgress($)).entries)
            if (list.some(e => e.task === task && e.kind !== 'aside'))
                (found = true), await writeEntries($, id, list.map(e => (e.task === task ? { ...e, kind: 'aside', reason: e.reason || `${who(true)} set it aside` } : e)));
        return found;
    });
    if (isMarked)
        await progressMoved($);
};
// One event's answer from the model, or why there is none
const askProgress = async ($, event, picture) => {
    const { areas, entries } = await readProgress($);
    const prompt = progressPrompt(event, picture, areas, entries, await $.clock.now());
    const r = await $.model.complete({ model: 'sonnet', system: PROGRESS_SYSTEM, prompt, maxTokens: 1500, timeoutMs: 120000 }).catch(() => undefined);
    if (!r?.isAnswered)
        return { why: 'no answer' };
    const answer = answerJson(r.text);
    return answer ? { answer } : { why: 'an answer that is not JSON' };
};
// The answer applied to the files as they stand now, under the files' lock
const applyEvent = ($, event, answer, picture) => withProgressFiles($, async () => {
    const { areas, entries } = await readProgress($);
    const done = applyProgress(event, answer, picture, areas, entries, await $.clock.now(), reportsDir(), who(true));
    if (!done.isChanged)
        return done;
    for (const id of done.changedEntries) {
        const list = entries.get(id) ?? [];
        if (!list.length && !done.areas.some(area => area.id === id))
            await $.process.run(['rm', '-f', `${progressDir()}/areas/${id}.json`]).catch(() => undefined);
        else
            await writeEntries($, id, list);
    }
    await writeAreas($, done.areas);
    return done;
});
const readEvent = async ($, name) => {
    const one = answerJson(await readOr($, `${queueDir()}/${name}`));
    return one && typeof one.kind === 'string' && typeof one.text === 'string' && typeof one.at === 'number' ? one : undefined;
};
const dropEvent = ($, name) => $.process.run(['rm', '-f', `${queueDir()}/${name}`]).then(() => undefined, () => undefined);
// What an indexed event keeps up beside progress/: a result's topic gets its state line in the index from the model's answer and,
// at the top of its page, the Latest block of the areas it went into; the person's words go into each area's own log of them
const keepUp = async ($, event, answer, places) => {
    if (event.kind === 'said')
        for (const id of places)
            await appendTo($, `${progressDir()}/areas/${id}.said.md`, saidEntry(event.at, '', event.text));
    const topic = event.kind === 'result' && event.topic ? await topicNamed($, event.topic) : '';
    if (!topic || !places.length)
        return;
    const areas = (await readAreas($)).filter(area => places.includes(area.id)).slice(0, 2);
    const block = latestBlock(await Promise.all(areas.map(async (area) => ({ area, entries: await readEntries($, area.id) }))), reportsDir(), await $.clock.now());
    const state = topicState(answer);
    await withTopics($, async () => {
        const list = await readIndex($);
        const known = list.find(one => slug(one.name) === slug(topic));
        if (!known)
            return;
        if (state && state !== known.state)
            await writeIndex($, list.map(one => (one === known ? { ...one, state } : one)));
        await $.fs.write(pageOf(known.name), withLatest(await readOr($, pageOf(known.name)), block));
    });
};
// The queue drained oldest first by the one chat holding locks/progress-drain; the history read in first, at most BACKFILL_AT_ONCE
// of its events at a time. An answer that does not come leaves its event for a later look
const drainProgress = async ($) => {
    if (!dir || draining)
        return;
    draining = true;
    const lock = await takeLock($, 'progress-drain', DRAIN_STALE).catch(() => '');
    if (!lock)
        return void ((draining = false), drainSoon($, PROGRESS_RETRY));
    let isLate = false;
    try {
        await refreshPicture($).catch(err => indexLog($, `picture not written: ${String(err)}`));
        await tidyIndex($).catch(err => indexLog($, `topics not tidied: ${String(err)}`));
        await recountResults($).catch(err => indexLog($, `results not queued to be counted: ${String(err)}`));
        await backfillProgress($).catch(err => indexLog($, `history not queued: ${String(err)}`));
        await backfillChats($).catch(err => indexLog($, `old chats not queued: ${String(err)}`));
        while (!isLate) {
            const names = (await $.fs.list(queueDir()).catch(() => []))
                .filter(entry => entry.kind === 'file' && entry.name.endsWith('.json'))
                .map(entry => entry.name)
                .sort();
            if (!names.length)
                break;
            // (still drained by this chat: no other takes the lock for an old one's)
            await $.fs.write(`${lock}/at`, String(await $.clock.now())).catch(() => undefined);
            const batch = [];
            for (const name of names.slice(0, BACKFILL_AT_ONCE)) {
                const event = await readEvent($, name);
                if (!event) {
                    await dropEvent($, name);
                    break;
                }
                if (batch.length && !(event.isBackfill && batch[0]?.event.isBackfill))
                    break;
                batch.push({ name, event });
                if (!event.isBackfill)
                    break;
            }
            if (!batch.length)
                continue;
            const picture = await readPicture($);
            const answers = await Promise.all(batch.map(one => askProgress($, one.event, picture)));
            for (const [n, { name, event }] of batch.entries()) {
                const got = answers[n];
                const what = `${event.kind}${event.task ? ` of ${event.task}` : ''}${event.report ? ` (${event.report})` : ''}`;
                if (got?.answer) {
                    const done = await applyEvent($, event, got.answer, picture);
                    await keepUp($, event, got.answer, done.places).catch(err => indexLog($, `${what}: topic not kept up: ${String(err)}`));
                    await dropEvent($, name);
                    await indexLog($, `${what} indexed: ${done.touched.size ? [...done.touched].join(', ') : 'nothing changed'}`);
                    if (done.isChanged)
                        await progressMoved($);
                    continue;
                }
                const tries = (event.tries ?? 0) + 1;
                if (tries >= PROGRESS_TRIES)
                    await dropEvent($, name);
                else
                    await $.fs.write(`${queueDir()}/${name}`, `${JSON.stringify({ ...event, tries })}\n`);
                await indexLog($, `${what} failed: ${got?.why ?? 'no answer'}${tries >= PROGRESS_TRIES ? ', dropped' : ', to try again'}`);
                isLate = true;
            }
        }
    }
    finally {
        await freeLock($, lock);
        draining = false;
    }
    if (isLate)
        drainSoon($, PROGRESS_RETRY);
};
// How far the sorting has got: the events still queued, and how many results the history read in, for the Progress tab
const readSorting = async ($) => {
    const left = (await $.fs.list(queueDir()).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.json')).length;
    const countIn = async (name) => Number((await readOr($, `${progressDir()}/${name}`)).split('\n')[1] ?? 0) || 0;
    const total = (await countIn('backfilled')) + (await countIn('chats-backfilled')) + (await countIn('recounted'));
    return { left, total };
};
// The chats from before Claudopus came in, read in once from their saved words, each as one piece of work in its area, oldest first
const backfillChats = async ($) => {
    if (await $.fs.exists(`${progressDir()}/chats-backfilled`))
        return;
    const before = await installedAt($);
    const now = await $.clock.now();
    const listed = (await $.fs.list(`${dir}/words`).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.md') && !entry.name.endsWith('.said.md'));
    let n = 0;
    for (const entry of listed) {
        const one = chatEventOf(entry.name.replace(/\.md$/, ''), await readOr($, `${dir}/words/${entry.name}`), before);
        if (!one)
            continue;
        await $.fs.write(`${queueDir()}/${queueName(one.at)}`, `${JSON.stringify({ ...one, text: hideKeys(one.text) })}\n`);
        n += 1;
    }
    await $.fs.write(`${progressDir()}/chats-backfilled`, `${new Date(now).toISOString()}\n${n}\n`);
    await indexLog($, `old chats queued: ${n}`);
};
// Results sorted while a task counted once however often it reported: every kept result with no entry of its own is read in again,
// once, only to be counted (isEntryOnly: it makes its entry and changes nothing else). Nothing to do where the history is yet to be read
const recountResults = async ($) => {
    if (await $.fs.exists(`${progressDir()}/recounted`))
        return;
    const now = await $.clock.now();
    const { areas, entries } = await readProgress($);
    const isFresh = (await $.fs.exists(`${progressDir()}/backfill`)) || !((await $.fs.exists(`${progressDir()}/backfilled`)) || areas.length);
    const counted = new Set([...entries.values()].flat().map(e => e.report));
    const missing = isFresh ? [] : (await loadReports($)).filter(r => !counted.has(r.id) && !isScratchTopic(r.folder ?? '')).sort((a, b) => a.at - b.at);
    let n = 0;
    for (const r of missing) {
        const text = (await readOr($, `${reportPath(r)}/report.md`)).trim();
        if (!text)
            continue;
        const one = { kind: 'result', at: r.at, chat: r.chatId ?? '', task: r.agent ?? '', report: r.id, title: r.title, topic: r.subject, files: r.files.filter(file => PICTURE.test(file)), text: hideKeys(clip(text, EVENT_CHARS.result / 2)), isBackfill: true, isEntryOnly: true };
        await $.fs.write(`${queueDir()}/${queueName(r.at)}`, `${JSON.stringify(one)}\n`);
        n += 1;
    }
    await $.fs.write(`${progressDir()}/recounted`, `${new Date(now).toISOString()}\n${n}\n`);
    await indexLog($, `results queued to be counted: ${n}`);
};
// The history read in: every result of the past BACKFILL_DAYS, oldest first, when progress/ has no areas yet or progress/backfill
// asks for it. A result of a test chat, in a temporary folder, is left out
const backfillProgress = async ($) => {
    const isAsked = await $.fs.exists(`${progressDir()}/backfill`);
    if (!isAsked && ((await $.fs.exists(`${progressDir()}/backfilled`)) || (await readAreas($)).length))
        return;
    const now = await $.clock.now();
    const all = (await loadReports($)).filter(r => r.at >= now - BACKFILL_DAYS * 86400000 && !isScratchTopic(r.folder ?? '')).sort((a, b) => a.at - b.at);
    for (const r of all) {
        const text = (await readOr($, `${reportPath(r)}/report.md`)).trim();
        if (!text)
            continue;
        const one = { kind: 'result', at: r.at, chat: r.chatId ?? '', task: r.agent ?? '', report: r.id, title: r.title, topic: r.subject, files: r.files.filter(file => PICTURE.test(file)), text: hideKeys(clip(text, EVENT_CHARS.result / 2)), isBackfill: true };
        await $.fs.write(`${queueDir()}/${queueName(r.at)}`, `${JSON.stringify(one)}\n`);
    }
    // (with how many it queued, which the Progress tab counts down from)
    await $.fs.write(`${progressDir()}/backfilled`, `${new Date(now).toISOString()}\n${all.length}\n`);
    if (isAsked)
        await $.process.run(['rm', '-f', `${progressDir()}/backfill`]).catch(() => undefined);
    await indexLog($, `history queued: ${all.length} results`);
};
// The bigger picture written again once a week, or when there is none, from the one before and the person's messages since: once
// a load at most
const refreshPicture = async ($) => {
    if (pictureTried)
        return;
    pictureTried = true;
    const was = await readPicture($);
    const now = await $.clock.now();
    const updated = Date.parse(was.updated);
    const isKnown = Boolean(was.updated) && Number.isFinite(updated);
    if (isKnown && now - updated < PICTURE_EVERY)
        return;
    const since = isKnown ? updated : now - BACKFILL_DAYS * 86400000;
    const words = [];
    // (a chat's own words alone, where they are kept apart from Claude's replies)
    const listed = (await $.fs.list(`${dir}/words`).catch(() => [])).filter(entry => entry.kind === 'file' && entry.name.endsWith('.md'));
    const names = new Set(listed.map(entry => entry.name));
    for (const entry of listed)
        if (!(!entry.name.endsWith('.said.md') && names.has(entry.name.replace(/\.md$/, '.said.md'))) && !(entry.mtimeMs && entry.mtimeMs < since))
            words.push(...wordsIn(await fileEnd($, `${dir}/words/${entry.name}`), since));
    if (!words.length)
        return;
    words.sort((a, b) => (a.at < b.at ? -1 : 1));
    const r = await $.model.complete({ model: 'sonnet', system: PICTURE_SYSTEM, prompt: picturePrompt(was, words, now, PICTURE_READ), maxTokens: 1500, timeoutMs: 120000 }).catch(() => undefined);
    const picture = pictureOf(r?.isAnswered ? answerJson(r.text) : undefined, now);
    if (!picture)
        return void (await indexLog($, 'picture not written: no answer'));
    await withProgressFiles($, () => $.fs.write(`${progressDir()}/picture.json`, `${JSON.stringify(picture, null, 2)}\n`));
    await indexLog($, `picture written: ${picture.goals.length} goals`);
    await progressMoved($);
};
// What a task starting is told: what was set aside before in the areas its words are about, with why, so that data point is used
const asideTold = async ($, title, prompt) => {
    const { areas, entries } = await readProgress($);
    const lines = asideLines(title, prompt, areas, entries);
    return lines.length ? `What ${who()} set aside before in this area, kept as a data point: do not take it up again unless your instructions ask for it.\n${lines.join('\n')}` : '';
};
