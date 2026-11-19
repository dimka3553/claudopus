// What a small fast model makes of a command a task runs: a plain title, its kind, what it does now and, when it failed, why. The
// question it is asked, what in it is hidden first, and how its answer is read. Nothing here touches the engine
// (19 Nov: rows read "Run: score" and "Running", and nobody could tell what the command did or how it stood)
// The model asked: the newest Haiku, as small and fast as a label needs
export const NAMING_MODEL = 'claude-haiku-5-5';
// The kinds a command is said to be, in words at the head of its row
export const NAMED_KINDS = ['test', 'build', 'download', 'upload', 'install', 'cloud job', 'server', 'watch', 'deploy', 'render', 'train', 'check', 'script'];
export const NAMED_WORD = {
    test: 'Test',
    build: 'Build',
    download: 'Download',
    upload: 'Upload',
    install: 'Install',
    'cloud job': 'Cloud job',
    server: 'Server',
    watch: 'Watch',
    deploy: 'Deploy',
    render: 'Render',
    train: 'Train',
    check: 'Check',
    script: 'Script',
};
// The most of each part shown, and the most of the command and log sent
export const TITLE_MOST = 70;
export const NOW_MOST = 60;
export const WHY_MOST = 110;
const CMD_MOST = 1500;
const LOG_MOST = 2500;
export const LOG_SENT = 30;
// ---- Hidden before anything is sent: keys, tokens, passwords, signed links, emails and the person's own name in paths ----
const HIDDEN = '[hidden]';
// Names that say a value is secret, as a variable, a flag, a setting or a field
const SECRET_NAME = String.raw `[A-Za-z0-9_.-]*(?:pass(?:word|wd|phrase)?|secret|token|api[-_]?key|access[-_]?key|account[-_]?key|private[-_]?key|client[-_]?secret|auth(?:orization)?|credentials?|cookie|session[-_]?id|sas|signature|sig|pwd|bearer|connection[-_]?string|key)[A-Za-z0-9_.-]*`;
// Token shapes by their own look, whatever names them
const TOKEN_SHAPES = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g,
    /\bsk-(?:ant-)?[A-Za-z0-9_-]{12,}/g,
    /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{16,}/g,
    /\bgithub_pat_[A-Za-z0-9_]{20,}/g,
    /\bglpat-[A-Za-z0-9_-]{16,}/g,
    /\bxox[abprs]-[A-Za-z0-9-]{8,}/g,
    /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
    /\bAIza[0-9A-Za-z_-]{30,}/g,
    /\bhf_[A-Za-z0-9]{20,}/g,
    /\bnpm_[A-Za-z0-9]{30,}/g,
    /\b(?:pk|rk|sk)_(?:live|test)_[A-Za-z0-9]{16,}/g,
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
];
export const redacted = (text) => {
    let t = text;
    for (const shape of TOKEN_SHAPES)
        t = t.replace(shape, HIDDEN);
    t = t
        // a header that carries a login: Authorization: Bearer …, a cookie
        .replace(/\b(authorization|proxy-authorization|cookie|set-cookie|x-api-key|api-key|x-auth-token)\s*:\s*[^\n"']+/gi, `$1: ${HIDDEN}`)
        .replace(/\b(bearer|basic|token)\s+(?=[^\s]*\d)[A-Za-z0-9._~+/=-]{12,}/gi, `$1 ${HIDDEN}`)
        // a login given to a tool as user:password (curl -u, --user)
        .replace(/(\s(?:-u|--user)\s+)("[^"]*:[^"]*"|'[^']*:[^']*'|[^\s:]+:\S+)/g, `$1${HIDDEN}`)
        // a login inside a web address: https://user:password@host
        .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@:]+:[^\s/@]+@/gi, `$1${HIDDEN}@`)
        // a connection string's or a signed link's secret parts: AccountKey=…, sig=…, &token=…
        .replace(new RegExp(String.raw `([?&;\s"']|^)(${SECRET_NAME}|se|sp|sv|st|spr|srt|ss)=([^&;\s"']+)`, 'gi'), (all, lead, name, value) => /^(se|sp|sv|st|spr|srt|ss)$/i.test(name) && !/[?&]/.test(lead) ? all : `${lead}${name}=${value.startsWith('$') && /^\$\{?\w+\}?$/.test(value) ? value : HIDDEN}`)
        // a field: "token": "…", password: …
        .replace(new RegExp(String.raw `(["']?\b${SECRET_NAME}["']?\s*:\s*)("[^"]*"|'[^']*'|[^\s,}]+)`, 'gi'), (all, head, value) => (/^["']?\$\{?\w+\}?["']?$/.test(value) ? all : `${head}${HIDDEN}`))
        // a flag: --password x, --token=x, -p x after a login tool
        .replace(new RegExp(String.raw `(--${SECRET_NAME})(?:=|\s+)("[^"]*"|'[^']*'|[^\s]+)`, 'gi'), (all, flag, value) => (/^["']?\$\{?\w+\}?["']?$/.test(value) ? all : `${flag} ${HIDDEN}`))
        .replace(/\b((?:mysql|psql|sshpass|htpasswd)\b[^\n]*?\s-p)\s*("[^"]*"|'[^']*'|\S+)/g, `$1 ${HIDDEN}`)
        // emails
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[email]')
        // the person's own name, in the folders of their home
        .replace(/(^|[\s"'=:(])\/(?:Users|home)\/[^/\s"']+/g, '$1~')
        // and as the engine writes such a folder into a name: -Users-<name>-Documents
        .replace(/-(Users|home)-[A-Za-z0-9_.]+(?=-)/g, '-$1-~')
        // long strings of letters and digits that read as a key, a hash or an id: a key's value is one
        // (never across a path's slashes: a folder's long name is no key)
        .replace(/(?<![A-Za-z0-9/._~-])(?=[A-Za-z0-9+_=-]{32,})(?=[^\s/]*\d)(?=[^\s/]*[A-Za-z])[A-Za-z0-9+_=-]{32,}/g, HIDDEN);
    return t;
};
// ---- The question ----
export const NAMING_SYSTEM = [
    'You name commands that an AI assistant runs on a computer, for a person who does not read code. The person sees each command as a row in a panel: a title, then a line saying how it stands.',
    'You get the task the command belongs to, the to-do the task is on, the assistant\'s own short label for the command, the folder, the command itself, how it stands and the last lines of its log.',
    'Reply with one JSON object and nothing else, with these fields:',
    '"title": what the command does for the task, in plain everyday words, starting with a verb, at most 9 words, sentence case, no full stop. Say what is done to what, with the numbers that tell it apart (which films, which half). Never a program name, file name, path, flag, setting, variable or code. Bad: "Run: score", "python3 eval.py". Good: "Score smoothed heads against the 47 test films".',
    `"kind": one of ${NAMED_KINDS.map(kind => `"${kind}"`).join(', ')}. "cloud job" is work that runs on another computer (a cloud machine, ssh, a cluster). "watch" only waits for something far away. "script" is anything else.`,
    '"now": what it is doing at this moment, from the log, at most 8 plain words, sentence case, no full stop, such as "Waiting for the cloud machine to start" or "Fitting the heads". No counts, percents or times: those are shown beside it. Empty when the log says nothing of what it does, or when it is starting.',
    '"why": only when it failed: why, in one plain line of at most 14 words, from the log, such as "Ran out of memory while loading the films". Empty otherwise.',
    'Use only what you are given. Some values are shown as [hidden]: never guess them.',
].join('\n');
const clip = (text, most) => (text.length <= most ? text : `${text.slice(0, most)}…`);
const oneLine = (text) => text.replace(/\s+/g, ' ').trim();
export const namingPrompt = (ask) => {
    const lines = (ask.lines ?? []).slice(-LOG_SENT).map(line => clip(line, 300));
    const log = clip(redacted(lines.join('\n')).slice(-LOG_MOST), LOG_MOST);
    const state = { starting: 'just started', running: `running${ask.ran ? ` for ${ask.ran}` : ''}`, finished: `finished${ask.ran ? ` after ${ask.ran}` : ''}`, failed: `failed${ask.ran ? ` after ${ask.ran}` : ''}` }[ask.state];
    return [
        `Task: ${clip(oneLine(redacted(ask.task ?? '')), 200) || '(none)'}`,
        `To-do now: ${clip(oneLine(redacted(ask.todo ?? '')), 200) || '(none)'}`,
        `Label: ${clip(oneLine(redacted(ask.label ?? '')), 200) || '(none)'}`,
        `Folder: ${clip(redacted(ask.folder ?? ''), 200) || '(unknown)'}`,
        `Command:\n${clip(redacted(ask.cmd), CMD_MOST)}`,
        `State: ${state}`,
        `Last lines of its log:\n${log || '(nothing yet)'}`,
    ].join('\n\n');
};
// ---- The answer ----
// A part is shown only when it reads as plain words: no code, paths, settings or anything hidden, one line, cut to its room
const isPlain = (text) => !/[`$<>{}\\|]|\[hidden\]|\[email\]|(?:^|\s)[~.]?\/\S|\S+=\S|\s--?\w|https?:/i.test(text) && /[A-Za-z]{2}/.test(text);
const partOf = (value, most) => {
    if (typeof value !== 'string')
        return undefined;
    const t = oneLine(value).replace(/[.。]+$/, '').replace(/^["']|["']$/g, '').trim();
    if (!t || !isPlain(t))
        return undefined;
    const cut = t.length <= most ? t : `${t.slice(0, most - 1).replace(/\s+\S*$/, '')}…`;
    return cut.charAt(0).toUpperCase() + cut.slice(1);
};
export const namingOf = (reply) => {
    const body = reply.match(/\{[\s\S]*\}/)?.[0];
    if (!body)
        return undefined;
    let got;
    try {
        got = JSON.parse(body);
    }
    catch {
        return undefined;
    }
    if (!got || typeof got !== 'object')
        return undefined;
    const kind = typeof got.kind === 'string' ? NAMED_KINDS.find(one => one === got.kind?.toString().trim().toLowerCase()) : undefined;
    const named = {
        ...(partOf(got.title, TITLE_MOST) ? { title: partOf(got.title, TITLE_MOST) } : {}),
        ...(kind ? { kind: kind } : {}),
        ...(partOf(got.now, NOW_MOST) ? { now: partOf(got.now, NOW_MOST) } : {}),
        ...(partOf(got.why, WHY_MOST) ? { why: partOf(got.why, WHY_MOST) } : {}),
    };
    return Object.keys(named).length ? named : undefined;
};
// What a command is, for the titles kept by it: the same command with the same words in the same folder is named once
export const namingKey = (ask) => `${ask.folder ?? ''}\u0000${ask.label ?? ''}\u0000${ask.cmd}`;
// A row's name with the model's title: its kind in words first, unless the title already starts with it
export const namedHead = (named) => {
    const title = named.title ?? '';
    if (!named.kind)
        return title;
    const word = NAMED_WORD[named.kind];
    return title.toLowerCase().startsWith(word.toLowerCase()) ? title : `${word} · ${title}`;
};
