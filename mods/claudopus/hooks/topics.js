// The memory's topics kept up by Claudopus, the part that needs no engine: the Latest block at the top of a topic's page, a history
// grown too long split, the person's own words kept apart, the topic list tidied, what changed since a chat last saw the lists, and
// how recall matches and ranks lines. src/claudopus reads and writes the files, under their locks
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const oneLine = (text) => text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim();
const cut = (text, most) => {
    const end = text.lastIndexOf(' ', most);
    return text.length <= most ? text : `${text.slice(0, end > most / 2 ? end : most)} …`;
};
// ---- The Latest block: at the top of a topic's page, below its title, made from its areas' newest entries and next steps each
// time a result is indexed, and put in place of the one before, so the page's state is current however old its prose is ----
export const LATEST_START = '<!-- Latest: kept by Claudopus from each result; the rest of the page is the tasks\' -->';
export const LATEST_END = '<!-- End of Latest -->';
export const LATEST_ENTRIES = 5;
const LATEST = new RegExp(`${LATEST_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${LATEST_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n*`);
export const latestBlock = (areas, reportsDir, now) => [
    LATEST_START,
    `## Latest (${new Date(now).toISOString().slice(0, 10)})`,
    ...areas.flatMap(({ area, entries }) => [
        `- ${area.name}${area.aim ? `: ${area.aim}` : ''}`,
        ...entries
            .slice(0, LATEST_ENTRIES)
            .map(e => `  - ${e.at.slice(0, 10)} ${e.title}${e.outcome ? `: ${e.outcome}` : ''}${e.kind === 'aside' ? ` (set aside${e.reason ? `: ${e.reason}` : ''})` : ''}${e.report ? ` · ${reportsDir}/${e.report}/report.md` : ''}`),
    ]),
    LATEST_END,
].join('\n');
// The page without its block, and with the block given in its place: after the page's title when it starts with one, else at its top
export const withoutLatest = (page) => page.replace(LATEST, '');
export const latestIn = (page) => LATEST.exec(page)?.[0]?.trimEnd() ?? '';
export const withLatest = (page, block) => {
    const rest = withoutLatest(page);
    const title = /^# [^\n]*\n+/.exec(rest)?.[0] ?? '';
    return `${title}${block}\n\n${rest.slice(title.length)}`.replace(/\n*$/, '\n');
};
// ---- A history past HISTORY_MOST: its older half, at an entry's start, goes to a file of its own, once, and a line at the top of
// the history points to it (and to each one before it) ----
export const HISTORY_MOST = 200000;
const POINTER = 'Older entries: ';
export const splitHistory = (text, older, most = HISTORY_MOST) => {
    if (text.length <= most)
        return undefined;
    const head = (/^(?:Older entries: [^\n]*\n)+\n*/.exec(text)?.[0] ?? '');
    const starts = [...text.slice(head.length).matchAll(/(?:^|\n)(?=## \d{4}-\d\d-\d\d)/g)].map(m => head.length + (m.index ?? 0) + (m[0].length ? 1 : 0));
    const half = head.length + (text.length - head.length) / 2;
    const at = starts.filter(n => n > head.length).sort((a, b) => Math.abs(a - half) - Math.abs(b - half))[0];
    if (!at)
        return undefined;
    const moved = text.slice(head.length, at);
    const last = [...moved.matchAll(/^## (\d{4}-\d\d-\d\d)/gm)].at(-1)?.[1] ?? '';
    return { moved, kept: `${head.replace(/\n*$/, '\n')}${POINTER}${older}${last ? ` (up to ${last})` : ''}\n\n${text.slice(at)}`.replace(/^\n+/, '') };
};
// ---- The person's own words, kept apart from Claude's replies: a chat's (words/<chat>.said.md) and an area's (progress/areas/<id>.said.md) ----
// A message as it is kept: dated, a long paste as its first lines and the path of the whole of it
export const saidEntry = (at, how, text, paste = '') => `## ${new Date(at).toISOString()}${how}\n${paste ? `${text.slice(0, 600).trimEnd()}\n[the whole paste: ${paste}]` : text.trim()}\n\n`;
// ---- The topic list tidied once a day: a topic named by its slug takes its page's title, an empty summary its page's first line ----
export const pageTitle = (page) => oneLine(/^# (.+)$/m.exec(withoutLatest(page))?.[1] ?? '').replace(/[*_`]/g, '');
const pageLine = (page) => oneLine(withoutLatest(page)
    .split('\n')
    .map(line => line.replace(/^[-*>\s]+/, '').replace(/[*_`]/g, '').trim())
    .find(line => line && !line.startsWith('#') && !line.startsWith('<!--') && !/^[\w ]{1,20}:$/.test(line)) ?? '');
export const tidyTopics = (list, pages) => {
    const renames = [];
    const taken = new Set(list.map(one => slug(one.name)));
    const tidied = list.map(one => {
        const page = pages.get(one.name) ?? '';
        let next = one;
        const title = cut(pageTitle(page), 60);
        if (one.name === slug(one.name) && title && slug(title) !== one.name && !taken.has(slug(title))) {
            taken.add(slug(title));
            renames.push({ from: one.name, to: title });
            next = { ...next, name: title };
        }
        if (!one.summary.trim() && pageLine(page))
            next = { ...next, summary: cut(pageLine(page), 120) };
        return next;
    });
    return { list: tidied, renames, isChanged: tidied.some((one, n) => one !== list[n]) };
};
// The topics a chat is given: one done for DONE_QUIET with no change to its page or history is only named on one line
export const DONE_QUIET = 14 * 86400000;
export const topicsShown = (list, changedAt, now) => {
    const isDone = (one) => /^done\b/i.test(one.state.trim()) && now - (changedAt.get(one.name) ?? 0) >= DONE_QUIET;
    return { shown: list.filter(one => !isDone(one)), done: list.filter(isDone).map(one => one.name) };
};
// ---- What changed in the topic list and the areas since a chat last saw them: each as a key of its name and state, so the keys
// not seen then are what is new or changed ----
export const listKeys = (topics, areas) => [...topics.map(one => `t:${slug(one.name)}|${one.state}`), ...areas.map(one => `a:${one.id}|${one.updated}`)];
export const listChanges = (topics, areas, seen) => {
    const was = new Set(seen);
    const known = new Set(seen.map(key => key.split('|')[0]));
    const name = (key, label) => `${label}${known.has(key) ? '' : ' (new)'}`;
    const changedTopics = topics.filter(one => !was.has(`t:${slug(one.name)}|${one.state}`)).map(one => name(`t:${slug(one.name)}`, `${one.name}${one.state ? ` (${cut(one.state, 40)})` : ''}`));
    const changedAreas = areas.filter(one => !was.has(`a:${one.id}|${one.updated}`)).map(one => name(`a:${one.id}`, one.name));
    if (!changedTopics.length && !changedAreas.length)
        return '';
    return cut([changedTopics.length ? `topics ${changedTopics.join(', ')}` : '', changedAreas.length ? `areas ${changedAreas.join(', ')}` : ''].filter(Boolean).join('; '), 500);
};
// ---- recall: a phrase found whole, or else each of its words, in any order on one line, by a simple stem (a plural's s, -ing,
// -ed), with no regard to case ----
export const stemOf = (word) => {
    const w = word.toLowerCase();
    const bare = w.length > 5 && w.endsWith('ing') ? w.slice(0, -3)
        : w.length > 4 && w.endsWith('ied') ? w.slice(0, -3)
            : w.length > 4 && w.endsWith('ies') ? w.slice(0, -3)
                : w.length > 4 && w.endsWith('ed') ? w.slice(0, -2)
                    : w.length > 4 && /(?:s|x|z|ch|sh)es$/.test(w) ? w.slice(0, -2)
                        : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1)
                            : w;
    if (bare.length < 3)
        return w;
    // (running and stopped come to run and stop)
    return bare.length > 3 && /([b-df-hj-np-tv-z])\1$/.test(bare) && bare !== w ? bare.slice(0, -1) : bare;
};
export const recallStems = (query) => [...new Set(query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(one => one.length > 1).map(stemOf))];
export const holdsStems = (line, stems) => {
    const low = line.toLowerCase();
    return stems.every(stem => low.includes(stem));
};
