"use strict";
// Clear names for the commands a task runs, from Sonnet: as a command starts, as its log moves and as it ends, the
// model is asked what it does in plain words, what kind it is, what it does now and, when it failed, why. Asked in the background,
// never holding the panel, and remembered: a title once for each command, the same command run again named with no call. Where
// the model gives no answer, a row keeps the name it had before (hooks/naming.ts holds the question, what is hidden first and how
// the answer is read)
// When each command was last asked about, the log it was asked about, how many times, and whether about its end, by its id
const namingAsked = new Map();
// Titles kept by what the command is (its line, words and folder), the newest last
const titlesKept = new Map();
const TITLES_KEPT = 300;
// What the model said each running command does now, by its id
const namedNow = new Map();
// The commands asked about now, and how many may be at once
const namingNow = new Set();
const NAMING_AT_ONCE = 4;
// A running command is asked again only as its log moves, at most this often, and at most this many times in all (its end is
// asked about once more): about half an hour of a long command's lines
const NAMING_EVERY = 90000;
const NAMING_TIMES = 20;
// After an error from the model it is not asked again for a while; where the engine refuses the call, for longer
let namingOffUntil = 0;
const NAMING_REST = 5 * 60000;
const NAMING_REFUSED_REST = 30 * 60000;
// The folder a command runs in: the one its line moves to first, else the chat's
const folderOf = (cmd) => cmd.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)/)?.[1]?.replace(/^["']|["']$/g, '') || cwd;
// One question to the model; nothing when it gave no answer that reads
const askNaming = async ($, ask) => {
    const now = await $.clock.now();
    if (now < namingOffUntil)
        return undefined;
    const r = await $.model
        .complete({ model: NAMING_MODEL, system: NAMING_SYSTEM, prompt: namingPrompt(ask), maxTokens: 600, effort: 'low', timeoutMs: 20000 })
        .catch(err => {
        namingOffUntil = now + NAMING_REFUSED_REST;
        void log($, `commands not named: ${String(err)}`);
        return undefined;
    });
    if (!r)
        return undefined;
    if (!r.isAnswered) {
        if (r.reason === 'api-error')
            namingOffUntil = now + NAMING_REST;
        return undefined;
    }
    return namingOf(r.text);
};
// What came back is kept on the command's own entry, running or ended, so its card, Details, its log tab and another chat's panel
// all read it: its title and kind once, why at its end. What it does now stays in memory, read afresh as its log moves
const keepNaming = async ($, id, key, named, isEnd) => {
    if (!named)
        return;
    if (named.title) {
        titlesKept.delete(key);
        titlesKept.set(key, { title: named.title, ...(named.kind ? { kind: named.kind } : {}) });
        for (const old of titlesKept.keys())
            if (titlesKept.size > TITLES_KEPT)
                titlesKept.delete(old);
    }
    if (named.now && !isEnd)
        namedNow.set(id, named.now);
    const title = named.title ? { title: named.title, ...(named.kind ? { kind: named.kind } : {}) } : {};
    await changeTodos($, list => {
        let isChanged = false;
        const next = list.map(one => {
            const bg = one.bg?.map(b => (b.id === id && title.title && !b.named?.title ? ((isChanged = true), { ...b, named: title }) : b));
            const endedRuns = one.endedRuns?.map(r => {
                if (r.id !== id)
                    return r;
                const both = { ...(r.named?.title ? {} : title), ...(r.how === 'failed' && named.why && !r.named?.why ? { why: named.why } : {}) };
                return Object.keys(both).length ? ((isChanged = true), { ...r, named: { ...r.named, ...both } }) : r;
            });
            return bg === one.bg && endedRuns === one.endedRuns ? one : { ...one, ...(bg ? { bg } : {}), ...(endedRuns ? { endedRuns } : {}) };
        });
        return isChanged ? next : list;
    });
    outputMoved = true;
};
// Looked at with the commands' output (lookJobs): each command of this chat's tasks that needs it is asked about, in the
// background. A title once, as it starts or the first time it is seen; what it does now as its log moves; why as it fails.
// `texts`: what each wrote, as just read; `endedAs`: how those that ended did
const nameJobs = async ($, list, texts, endedAs) => {
    const now = await $.clock.now();
    if (now < namingOffUntil)
        return;
    for (const id of namingAsked.keys())
        if (!list.some(one => one.bg?.some(b => b.id === id) || one.endedRuns?.some(r => r.id === id)))
            (namingAsked.delete(id), namedNow.delete(id));
    for (const id of namedNow.keys())
        if (!list.some(one => one.bg?.some(b => b.id === id)))
            namedNow.delete(id);
    for (const one of list) {
        if (one.chat)
            continue;
        for (const b of one.bg ?? []) {
            if (namingNow.size >= NAMING_AT_ONCE)
                return;
            if (namingNow.has(b.id))
                continue;
            const cmd = b.cmd ?? b.what;
            const folder = folderOf(cmd);
            const key = namingKey({ cmd, label: b.what, folder });
            const end = endedAs[b.id];
            const how = typeof end === 'string' ? end : end?.how;
            const isFailed = how === 'failed';
            const lines = logLines(texts[b.id] ?? '').slice(-LOG_SENT);
            const sign = lines.join('\n');
            const was = namingAsked.get(b.id);
            // The same command named before keeps that title, with no call
            const kept = titlesKept.get(key);
            if (kept && !b.named?.title)
                void keepNaming($, b.id, key, kept, false).catch(err => log($, `a command's name not kept: ${String(err)}`));
            const hasTitle = Boolean(b.named?.title || kept);
            const isDue = !was || now - was.at >= NAMING_EVERY;
            const needs = isFailed ? !was?.isEnd : how ? !hasTitle && isDue : (!hasTitle && isDue) || (Boolean(sign) && sign !== was?.sign && isDue && (was?.times ?? 0) < NAMING_TIMES);
            if (!needs)
                continue;
            namingAsked.set(b.id, { at: now, sign, times: (was?.times ?? 0) + 1, ...(how ? { isEnd: true } : {}) });
            namingNow.add(b.id);
            const ask = {
                task: titleOf(list.find(card => card.id === topOf(list, one.id)) ?? one),
                todo: one.items?.find(item => item.state === 'doing')?.text,
                label: b.what,
                folder,
                cmd,
                state: isFailed ? 'failed' : how ? 'finished' : sign ? 'running' : 'starting',
                ran: took(((typeof end === 'object' && end.at) || now) - b.at),
                lines,
            };
            void askNaming($, ask)
                .then(named => keepNaming($, b.id, key, named, Boolean(how)))
                .catch(err => log($, `a command not named: ${String(err)}`))
                .finally(() => namingNow.delete(b.id));
        }
    }
};
