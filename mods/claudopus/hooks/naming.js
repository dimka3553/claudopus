"use strict";
// What a small fast model makes of a command a task runs: a plain title, its kind, what it does now and, when it failed, why. The
// question it is asked, what in it is hidden first, and how its answer is read. Nothing here touches the engine
// (19 Nov: rows read "Run: score" and "Running", and nobody could tell what the command did or how it stood)
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedHead = exports.namingKey = exports.namingOf = exports.namingPrompt = exports.NAMING_SYSTEM = exports.redacted = exports.LOG_SENT = exports.WHY_MOST = exports.NOW_MOST = exports.TITLE_MOST = exports.NAMED_WORD = exports.NAMED_KINDS = exports.NAMING_MODEL = void 0;
// The model asked: the newest Haiku, as small and fast as a label needs
exports.NAMING_MODEL = 'claude-haiku-5-5';
// The kinds a command is said to be, in words at the head of its row
exports.NAMED_KINDS = ['test', 'build', 'download', 'upload', 'install', 'cloud job', 'server', 'watch', 'deploy', 'render', 'train', 'check', 'script'];
exports.NAMED_WORD = {
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
exports.TITLE_MOST = 70;
exports.NOW_MOST = 60;
exports.WHY_MOST = 110;
var CMD_MOST = 1500;
var LOG_MOST = 2500;
exports.LOG_SENT = 30;
// ---- Hidden before anything is sent: keys, tokens, passwords, signed links, emails and the person's own name in paths ----
var HIDDEN = '[hidden]';
// Names that say a value is secret, as a variable, a flag, a setting or a field
var SECRET_NAME = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["[A-Za-z0-9_.-]*(?:pass(?:word|wd|phrase)?|secret|token|api[-_]?key|access[-_]?key|account[-_]?key|private[-_]?key|client[-_]?secret|auth(?:orization)?|credentials?|cookie|session[-_]?id|sas|signature|sig|pwd|bearer|connection[-_]?string|key)[A-Za-z0-9_.-]*"], ["[A-Za-z0-9_.-]*(?:pass(?:word|wd|phrase)?|secret|token|api[-_]?key|access[-_]?key|account[-_]?key|private[-_]?key|client[-_]?secret|auth(?:orization)?|credentials?|cookie|session[-_]?id|sas|signature|sig|pwd|bearer|connection[-_]?string|key)[A-Za-z0-9_.-]*"
    // Token shapes by their own look, whatever names them
])));
// Token shapes by their own look, whatever names them
var TOKEN_SHAPES = [
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
var redacted = function (text) {
    var t = text;
    for (var _i = 0, TOKEN_SHAPES_1 = TOKEN_SHAPES; _i < TOKEN_SHAPES_1.length; _i++) {
        var shape = TOKEN_SHAPES_1[_i];
        t = t.replace(shape, HIDDEN);
    }
    t = t
        // a header that carries a login: Authorization: Bearer …, a cookie
        .replace(/\b(authorization|proxy-authorization|cookie|set-cookie|x-api-key|api-key|x-auth-token)\s*:\s*[^\n"']+/gi, "$1: ".concat(HIDDEN))
        .replace(/\b(bearer|basic|token)\s+(?=[^\s]*\d)[A-Za-z0-9._~+/=-]{12,}/gi, "$1 ".concat(HIDDEN))
        // a login given to a tool as user:password (curl -u, --user)
        .replace(/(\s(?:-u|--user)\s+)("[^"]*:[^"]*"|'[^']*:[^']*'|[^\s:]+:\S+)/g, "$1".concat(HIDDEN))
        // a login inside a web address: https://user:password@host
        .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@:]+:[^\s/@]+@/gi, "$1".concat(HIDDEN, "@"))
        // a connection string's or a signed link's secret parts: AccountKey=…, sig=…, &token=…
        .replace(new RegExp(String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["([?&;s\"']|^)(", "|se|sp|sv|st|spr|srt|ss)=([^&;s\"']+)"], ["([?&;\\s\"']|^)(", "|se|sp|sv|st|spr|srt|ss)=([^&;\\s\"']+)"])), SECRET_NAME), 'gi'), function (all, lead, name, value) {
        return /^(se|sp|sv|st|spr|srt|ss)$/i.test(name) && !/[?&]/.test(lead) ? all : "".concat(lead).concat(name, "=").concat(value.startsWith('$') && /^\$\{?\w+\}?$/.test(value) ? value : HIDDEN);
    })
        // a field: "token": "…", password: …
        .replace(new RegExp(String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["([\"']?\b", "[\"']?s*:s*)(\"[^\"]*\"|'[^']*'|[^s,}]+)"], ["([\"']?\\b", "[\"']?\\s*:\\s*)(\"[^\"]*\"|'[^']*'|[^\\s,}]+)"])), SECRET_NAME), 'gi'), function (all, head, value) { return (/^["']?\$\{?\w+\}?["']?$/.test(value) ? all : "".concat(head).concat(HIDDEN)); })
        // a flag: --password x, --token=x, -p x after a login tool
        .replace(new RegExp(String.raw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["(--", ")(?:=|s+)(\"[^\"]*\"|'[^']*'|[^s]+)"], ["(--", ")(?:=|\\s+)(\"[^\"]*\"|'[^']*'|[^\\s]+)"])), SECRET_NAME), 'gi'), function (all, flag, value) { return (/^["']?\$\{?\w+\}?["']?$/.test(value) ? all : "".concat(flag, " ").concat(HIDDEN)); })
        .replace(/\b((?:mysql|psql|sshpass|htpasswd)\b[^\n]*?\s-p)\s*("[^"]*"|'[^']*'|\S+)/g, "$1 ".concat(HIDDEN))
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
exports.redacted = redacted;
// ---- The question ----
exports.NAMING_SYSTEM = [
    'You name commands that an AI assistant runs on a computer, for a person who does not read code. The person sees each command as a row in a panel: a title, then a line saying how it stands.',
    'You get the task the command belongs to, the to-do the task is on, the assistant\'s own short label for the command, the folder, the command itself, how it stands and the last lines of its log.',
    'Reply with one JSON object and nothing else, with these fields:',
    '"title": what the command does for the task, in plain everyday words, starting with a verb, at most 9 words, sentence case, no full stop. Say what is done to what, with the numbers that tell it apart (which films, which half). Never a program name, file name, path, flag, setting, variable or code. Bad: "Run: score", "python3 eval.py". Good: "Score smoothed heads against the 47 test films".',
    "\"kind\": one of ".concat(exports.NAMED_KINDS.map(function (kind) { return "\"".concat(kind, "\""); }).join(', '), ". \"cloud job\" is work that runs on another computer (a cloud machine, ssh, a cluster). \"watch\" only waits for something far away. \"script\" is anything else."),
    '"now": what it is doing at this moment, from the log, at most 8 plain words, sentence case, no full stop, such as "Waiting for the cloud machine to start" or "Fitting the heads". No counts, percents or times: those are shown beside it. Empty when the log says nothing of what it does, or when it is starting.',
    '"why": only when it failed: why, in one plain line of at most 14 words, from the log, such as "Ran out of memory while loading the films". Empty otherwise.',
    'Use only what you are given. Some values are shown as [hidden]: never guess them.',
].join('\n');
var clip = function (text, most) { return (text.length <= most ? text : "".concat(text.slice(0, most), "\u2026")); };
var oneLine = function (text) { return text.replace(/\s+/g, ' ').trim(); };
var namingPrompt = function (ask) {
    var _a, _b, _c, _d, _e;
    var lines = ((_a = ask.lines) !== null && _a !== void 0 ? _a : []).slice(-exports.LOG_SENT).map(function (line) { return clip(line, 300); });
    var log = clip((0, exports.redacted)(lines.join('\n')).slice(-LOG_MOST), LOG_MOST);
    var state = { starting: 'just started', running: "running".concat(ask.ran ? " for ".concat(ask.ran) : ''), finished: "finished".concat(ask.ran ? " after ".concat(ask.ran) : ''), failed: "failed".concat(ask.ran ? " after ".concat(ask.ran) : '') }[ask.state];
    return [
        "Task: ".concat(clip(oneLine((0, exports.redacted)((_b = ask.task) !== null && _b !== void 0 ? _b : '')), 200) || '(none)'),
        "To-do now: ".concat(clip(oneLine((0, exports.redacted)((_c = ask.todo) !== null && _c !== void 0 ? _c : '')), 200) || '(none)'),
        "Label: ".concat(clip(oneLine((0, exports.redacted)((_d = ask.label) !== null && _d !== void 0 ? _d : '')), 200) || '(none)'),
        "Folder: ".concat(clip((0, exports.redacted)((_e = ask.folder) !== null && _e !== void 0 ? _e : ''), 200) || '(unknown)'),
        "Command:\n".concat(clip((0, exports.redacted)(ask.cmd), CMD_MOST)),
        "State: ".concat(state),
        "Last lines of its log:\n".concat(log || '(nothing yet)'),
    ].join('\n\n');
};
exports.namingPrompt = namingPrompt;
// ---- The answer ----
// A part is shown only when it reads as plain words: no code, paths, settings or anything hidden, one line, cut to its room
var isPlain = function (text) { return !/[`$<>{}\\|]|\[hidden\]|\[email\]|(?:^|\s)[~.]?\/\S|\S+=\S|\s--?\w|https?:/i.test(text) && /[A-Za-z]{2}/.test(text); };
var partOf = function (value, most) {
    if (typeof value !== 'string')
        return undefined;
    var t = oneLine(value).replace(/[.。]+$/, '').replace(/^["']|["']$/g, '').trim();
    if (!t || !isPlain(t))
        return undefined;
    var cut = t.length <= most ? t : "".concat(t.slice(0, most - 1).replace(/\s+\S*$/, ''), "\u2026");
    return cut.charAt(0).toUpperCase() + cut.slice(1);
};
var namingOf = function (reply) {
    var _a;
    var body = (_a = reply.match(/\{[\s\S]*\}/)) === null || _a === void 0 ? void 0 : _a[0];
    if (!body)
        return undefined;
    var got;
    try {
        got = JSON.parse(body);
    }
    catch (_b) {
        return undefined;
    }
    if (!got || typeof got !== 'object')
        return undefined;
    var kind = typeof got.kind === 'string' ? exports.NAMED_KINDS.find(function (one) { var _a; return one === ((_a = got.kind) === null || _a === void 0 ? void 0 : _a.toString().trim().toLowerCase()); }) : undefined;
    var named = __assign(__assign(__assign(__assign({}, (partOf(got.title, exports.TITLE_MOST) ? { title: partOf(got.title, exports.TITLE_MOST) } : {})), (kind ? { kind: kind } : {})), (partOf(got.now, exports.NOW_MOST) ? { now: partOf(got.now, exports.NOW_MOST) } : {})), (partOf(got.why, exports.WHY_MOST) ? { why: partOf(got.why, exports.WHY_MOST) } : {}));
    return Object.keys(named).length ? named : undefined;
};
exports.namingOf = namingOf;
// What a command is, for the titles kept by it: the same command with the same words in the same folder is named once
var namingKey = function (ask) { var _a, _b; return "".concat((_a = ask.folder) !== null && _a !== void 0 ? _a : '', "\0").concat((_b = ask.label) !== null && _b !== void 0 ? _b : '', "\0").concat(ask.cmd); };
exports.namingKey = namingKey;
// A row's name with the model's title: its kind in words first, unless the title already starts with it
var namedHead = function (named) {
    var _a;
    var title = (_a = named.title) !== null && _a !== void 0 ? _a : '';
    if (!named.kind)
        return title;
    var word = exports.NAMED_WORD[named.kind];
    return title.toLowerCase().startsWith(word.toLowerCase()) ? title : "".concat(word, " \u00B7 ").concat(title);
};
exports.namedHead = namedHead;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
