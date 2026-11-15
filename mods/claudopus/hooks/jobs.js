"use strict";
// The running jobs a piece of work has, told apart and read: a server, a download or a script, from its command or its own words,
// and the latest line it wrote, from the end of its output. Nothing here touches the engine
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shellsOf = exports.isPausedProc = exports.heldShellOf = exports.treeOf = exports.procsOf = exports.foldJobs = exports.waitOf = exports.commandName = exports.labelOf = exports.isWaitOnly = exports.isPid = exports.pidOf = exports.detachedOf = exports.latestOf = exports.tailOf = exports.OUTPUT_LINES = exports.isOutputEnded = exports.progressOf = exports.leftText = exports.portOf = exports.jobKindOf = exports.isKindSaid = exports.describedOf = exports.DOWNLOAD_CMD = exports.SERVER_CMD = exports.JOB_UNREAD = exports.JOB_QUIET = exports.JOB_SHAPE = exports.JOB_HEAD = exports.JOB_WORD = exports.JOB_GLYPH = exports.JOB_COLOR = exports.JOB_TAIL = exports.JOBS_SHOWN = exports.JOB_NEWS = exports.JOB_LOOK = void 0;
// How often the jobs' output is read, and how often a job that wrote something new counts as news for its card
exports.JOB_LOOK = 5000;
exports.JOB_NEWS = 60000;
// At most this many jobs are rows under one card or helper
exports.JOBS_SHOWN = 4;
// Only the end of each job's output is read
exports.JOB_TAIL = 4000;
// Purple and a round dot are a helper's alone: a job has its own colour and shape, and its kind in words at the head of its row
exports.JOB_COLOR = { server: '#4EBA65', download: '#5AA7E6', script: '#36B5A8', watch: '#9A9A9A', wait: '#9A9A9A' };
exports.JOB_GLYPH = { server: '◆', download: '▼', script: '■', watch: '◇', wait: '◇' };
exports.JOB_WORD = { server: 'Server running', download: 'Downloading', script: 'Command running', watch: 'Watching', wait: 'Waiting' };
exports.JOB_HEAD = { server: 'Server', download: 'Download', script: 'Command', watch: 'Watch', wait: 'Wait' };
// Its mark on the tree, drawn: a square, a diamond, a down arrow, an open diamond, never a helper's round dot
exports.JOB_SHAPE = { server: 'diamond', download: 'down', script: 'square', watch: 'open', wait: 'open' };
// A job whose output has not changed for this long says, in amber, that it has gone quiet, and one that has printed nothing at all
// says so: work is told to print progress at least every 10 seconds, so a few minutes of nothing is worth a look
exports.JOB_QUIET = 3 * 60000;
// A job whose output has not been found this long after it started says so on its row
exports.JOB_UNREAD = 60000;
exports.SERVER_CMD = /\b(http\.server|http-server|uvicorn|gunicorn|hypercorn|flask run|runserver|vite( dev| preview)?|next (dev|start)|(npm|pnpm|yarn|bun) (run )?(dev|start|serve|preview)|rails s(erver)?|jupyter (lab|notebook)|ollama serve|tensorboard|serve -[sl]|python3? -m (http\.server|uvicorn))\b/i;
exports.DOWNLOAD_CMD = /\b(curl|wget|aria2c|huggingface-cli download|hf download|git clone|git lfs (pull|fetch)|rsync|scp|gsutil (-m )?cp|aws s3 (cp|sync)|pip3? install|uv (pip )?(install|sync)|npm (i|install|ci)|pnpm (i|install)|yarn install|brew install|docker pull|yt-dlp|azcopy (copy|cp|sync)|az storage (blob|file) (download|upload)(-batch)?|python3? -m pip install)\b/i;
// What kind a job is, from its command, or else its own words for itself
// A download is one whose own program fetches (curl, wget, rsync...), not one that names such a tool as a word to another
// (`vercel curl` reads a page): on 15 Nov "Reload page and check function logs" was called a download for that
// A curl or wget that only reads a page to check it (curl -s ... | grep, wget --spider, wget -O -) is no download: only one that
// keeps what it fetches in a file is (on 15 Nov "Wait for deploy and verify the live pages", a loop of curl -s, was called one).
// Work that says it waits, checks or tests is never a download, whatever it runs
var CHECKS = /^(wait|poll|check|verify|test|watch|confirm|reload|ping|probe|look)\b/i;
var isFetching = function (step) {
    var head = step.replace(/^[^\s/]*\//, '/').replace(/^\/\S*\//, '');
    if (head.search(exports.DOWNLOAD_CMD) !== 0)
        return false;
    if (/^curl\b/.test(head))
        return /\s(-[a-zA-Z]*[oO]\b|-[a-zA-Z]*[oO]\S|--output\b|--remote-name|--output-dir\b)|\s>>?\s*[^&\s]/.test(head);
    if (/^wget\b/.test(head))
        return !/\s--spider\b|\s-[a-zA-Z]*O\s*-(\s|$)|\s-qO-/.test(head);
    return true;
};
// The work's own words for a run, in the one form it is told to write them, so its card reads them as they are and guesses
// nothing from the command: its kind first (Download, Upload, Wait for, Watch, Serve, Run), what it does, and how long it
// should take in brackets: `Download the CT scans (about 3 min)`
var KIND_WORDS = [
    [/^(download|upload|fetch|copy|sync|clone)\b/i, 'download'],
    [/^(wait(ing)?|poll(ing)?)\b/i, 'wait'],
    [/^watch\b/i, 'watch'],
    [/^serve\b/i, 'server'],
    [/^run\b/i, 'script'],
];
var describedOf = function (what) {
    var _a, _b, _c;
    // only a time in the brackets, never a count (about 120 scans): a range is taken at its end (about 2-3 min)
    var m = what.match(new RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["s*((?:about|around|roughly|up to|~)?s*(?:d+(?:.d+)?s*[-\u2013]s*)?", ")s*$"], ["\\s*\\((?:about|around|roughly|up to|~)?\\s*(?:\\d+(?:\\.\\d+)?\\s*[-\u2013]\\s*)?", "\\)\\s*$"])), TIME), 'i'));
    var seconds = m ? secondsIn(((_a = m[1]) !== null && _a !== void 0 ? _a : '').trim()) : undefined;
    var text = m ? what.slice(0, m.index).trim() : what.trim();
    return __assign({ text: text, kind: (_b = KIND_WORDS.find(function (_a) {
            var re = _a[0];
            return re.test(text);
        })) === null || _b === void 0 ? void 0 : _b[1] }, (seconds ? { expect: seconds * 1000, expectText: ((_c = (0, exports.leftText)(seconds)) !== null && _c !== void 0 ? _c : '').replace(/ left$/, '') } : {}));
};
exports.describedOf = describedOf;
// Words that lead a run's own name and say its kind already, so its row does not say it twice
var isKindSaid = function (label) { return KIND_WORDS.some(function (_a) {
    var re = _a[0];
    return re.test(label.trim());
}); };
exports.isKindSaid = isKindSaid;
// Else, for words written another way or none, its kind is told from its command
var jobKindOf = function (cmd, label) { var _a; return (_a = (0, exports.describedOf)(label).kind) !== null && _a !== void 0 ? _a : (exports.SERVER_CMD.test(cmd) || /\bserver\b/i.test(label) ? 'server' : !CHECKS.test(label.trim()) && (stepsOf(cmd).some(isFetching) || /\bdownload/i.test(label)) ? 'download' : 'script'); };
exports.jobKindOf = jobKindOf;
// Each step of a shell line with what only sets it up taken off its head (a variable, env, nohup, time, sudo, exec), never a `cd`
var SETUP = /^(?:(?:[A-Za-z_]\w*=(?:"[^"]*"|'[^']*'|\S*)|env|nohup|setsid|exec|sudo|command|(?:\/usr\/bin\/)?time(?:\s+-\w+)*|timeout\s+\S+|caffeinate(?:\s+-\w+)*)\s+)+/;
var stepsOf = function (cmd) {
    return cmd
        .replace(/"(\\.|[^"\\])*"|'[^']*'/g, function (m) { return m.replace(/[;&|\n]/g, ' '); })
        .split(/\s*(?:&&|\|\||;|\||\n|(?<![>&])&(?![>&]))\s*/)
        .map(function (step) { return step.trim().replace(/^\(+\s*/, '').replace(/^(do|then|else)\s+/, '').replace(SETUP, '').trim(); })
        .filter(Boolean);
};
// The port a server listens on, from its command or what it wrote
var portOf = function (text) { var _a, _b, _c; return (_b = (_a = text.match(/(?:--port[= ]|-p |localhost:|127\.0\.0\.1:|0\.0\.0\.0:|\[::\]:|\bport )(\d{2,5})\b/i)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : (_c = text.match(/http\.server (\d{2,5})\b/)) === null || _c === void 0 ? void 0 : _c[1]; };
exports.portOf = portOf;
// A percent is progress when a bar follows it (tqdm and the like), whatever words the line holds; else the first percent on a line
// right beside a count toward a total. A score, a coverage figure or a table cell is not
var pctOf = function (line) {
    var _a, _b, _c;
    var bar = line.match(/(\d{1,3}(?:\.\d+)?)\s?%\s*(\|[█▉▊▋▌▍▎▏░▒▓#\s]*\||\[[=#>.\s-]*\]|[█▉▊▋▌▍▎▏░▒▓])/);
    if (bar)
        return "".concat(bar[1], "%");
    var before = (_a = line.match(/[█▉▊▋▌▍▎▏░▒▓#━]{4,}\s*(\d{1,3}(?:\.\d+)?)\s?%/)) !== null && _a !== void 0 ? _a : line.match(/\[[#=>.\s-]{4,}\]\s*(\d{1,3}(?:\.\d+)?)\s?%/);
    if (before)
        return pctText(Number(before[1]));
    // make's and pytest's [ 45%] at the head of a line
    var head = line.match(/^\s*\[\s*(\d{1,3})%\]/);
    if (head)
        return "".concat(head[1], "%");
    // Else a percent right beside a count toward a total, either way round
    // (never across a table's cell wall), or a size done of a size in all
    var near = (_c = (_b = line.match(/\b\d+\s?(?:\/|of)\s?\d+\b[^\d|]{0,8}?\b(\d{1,3}(?:\.\d+)?)\s?%/i)) !== null && _b !== void 0 ? _b : line.match(/\b(\d{1,3}(?:\.\d+)?)\s?%[^\d|]{0,8}?\b\d+\s?(?:\/|of)\s?\d+\b/i)) !== null && _c !== void 0 ? _c : line.match(/\d\s?[KMGT]i?B\s+of\s+[\d.]+\s?[KMGT]i?B\s*\((\d{1,3}(?:\.\d+)?)%\)/i);
    return near ? "".concat(near[1], "%") : undefined;
};
// How long a run says it has left, as it says it (eta 55s, eta 0:00:55, [01:18<01:28], 3m left, curl's Time Left), in words; the
// panel works one out from its percent only where the run says none
var secondsIn = function (text) {
    if (/^\d+(:\d\d){1,2}$/.test(text))
        return text.split(':').reduce(function (sum, part) { return sum * 60 + Number(part); }, 0);
    var parts = __spreadArray([], text.matchAll(/(\d+(?:\.\d+)?)\s?(days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])/gi), true);
    return parts.length ? parts.reduce(function (sum, m) { var _a, _b; return sum + Number(m[1]) * ((_b = { d: 86400, h: 3600, m: 60, s: 1 }[((_a = m[2]) !== null && _a !== void 0 ? _a : 's').charAt(0).toLowerCase()]) !== null && _b !== void 0 ? _b : 1); }, 0) : undefined;
};
var leftText = function (seconds) {
    if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0)
        return undefined;
    var all = Math.round(seconds);
    var text = all < 60 ? "".concat(all, "s") : all < 600 ? "".concat(Math.floor(all / 60), "m").concat(all % 60 ? " ".concat(String(all % 60).padStart(2, '0'), "s") : '') : all < 3600 ? "".concat(Math.round(all / 60), "m") : "".concat(Math.floor(Math.round(all / 60) / 60), "h").concat(Math.round(all / 60) % 60 ? " ".concat(String(Math.round(all / 60) % 60).padStart(2, '0'), "m") : '');
    return "".concat(text, " left");
};
exports.leftText = leftText;
var TIME = String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(d+(?::dd){1,2}|(?:d+(?:.d+)?s?(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])s*){1,3})"], ["(\\d+(?::\\d\\d){1,2}|(?:\\d+(?:\\.\\d+)?\\s?(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])\\s*){1,3})"])));
var leftOf = function (line) {
    var _a, _b, _c, _d, _e;
    var m = (_d = (_c = (_b = (_a = line.match(new RegExp(String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\beta:?s*", ""], ["\\beta:?\\s*", ""])), TIME), 'i'))) !== null && _a !== void 0 ? _a : line.match(new RegExp(String.raw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\b", "s*(?:left|remaining|to go)\b"], ["\\b", "\\s*(?:left|remaining|to go)\\b"])), TIME), 'i'))) !== null && _b !== void 0 ? _b : line.match(/<(\d+(?::\d\d){1,2})[,\]]/)) !== null && _c !== void 0 ? _c : line.match(/^\s*\d[\d,]*\s+\d{1,3}%\s+[\d.]+[kKMGT]?B\/s\s+(\d+:\d\d:\d\d)/)) !== null && _d !== void 0 ? _d : line.match(/^\s*\d+K\s+[.\s]+\s\d{1,3}%\s+[\d.]+[KMG]\s+((?:\d+[hms])+)\s*$/);
    return m ? (0, exports.leftText)(secondsIn(((_e = m[1]) !== null && _e !== void 0 ? _e : '').trim())) : undefined;
};
var POWER = { '': 0, B: 0, K: 1, M: 2, G: 3, T: 4, P: 5 };
var sizeOf = function (number, unit, bare) {
    var _a;
    if (unit === void 0) { unit = ''; }
    if (bare === void 0) { bare = 1024; }
    var n = Number(number.replace(/,/g, ''));
    var u = unit.trim();
    var letter = u.charAt(0).toUpperCase();
    if (!Number.isFinite(n) || !(letter in POWER) || (u && !/^([KMGTP](i?B)?|B|bytes?)$/i.test(u)))
        return undefined;
    var base = /i/.test(u) ? 1024 : /^[KMGTP]$/i.test(u) ? bare : 1000;
    return { bytes: n * Math.pow(base, ((_a = POWER[letter]) !== null && _a !== void 0 ? _a : 0)), base: base };
};
// Bytes as a person reads them, in the base they were counted in: 460 MB, 1.4 GB, 12 KB
var sizeText = function (_a) {
    var bytes = _a.bytes, base = _a.base;
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var n = bytes;
    var i = 0;
    while (n >= 1000 && i < units.length - 1)
        ((n /= base), i++);
    return "".concat(n >= 100 || i === 0 ? Math.round(n) : Number(n.toFixed(1)), " ").concat(units[i]);
};
var countText = function (n) { return (Number.isInteger(n) ? n.toLocaleString('en-US') : String(Number(n.toFixed(2)))); };
var pctText = function (n) { return "".concat(Math.min(100, Math.max(0, n)) >= 10 || Number.isInteger(n) ? Math.floor(Math.min(100, n)) : Number(n.toFixed(1)), "%"); };
var percentOf = function (done, total) { return (total > 0 && done <= total ? pctText((done / total) * 100) : undefined); };
// A size with its unit right after (460.0 MiB, 1.41G, 460MB); the unit letter alone counts only where a size is meant
var SIZE = String.raw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["(d[d,]*(?:.d+)?)s?([KMGTP]i?B|[KMGTP](?![a-z])|B\b|bytes?\b)"], ["(\\d[\\d,]*(?:\\.\\d+)?)\\s?([KMGTP]i?B|[KMGTP](?![a-z])|B\\b|bytes?\\b)"])));
var RATE = new RegExp(String.raw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["(d+(?:.d+)?)s?([KMGTP]i?B|[KMGTP]i?b|B|[KMGTP])(?:ps|/s)\b"], ["(\\d+(?:\\.\\d+)?)\\s?([KMGTP]i?B|[KMGTP]i?b|B|[KMGTP])(?:ps|/s)\\b"]))), 'i');
var rateOf = function (line, bare) {
    var _a;
    if (bare === void 0) { bare = 1000; }
    var m = (_a = line.match(RATE)) !== null && _a !== void 0 ? _a : line.match(/(\d+(?:\.\d+)?)\s?(it|items?|files?|frames?|steps?)\/s\b/i);
    if (!m)
        return undefined;
    var _b = m[1], n = _b === void 0 ? '' : _b, _c = m[2], unit = _c === void 0 ? '' : _c;
    if (/^[KMGTP]i?b$/.test(unit))
        return "".concat(n, " ").concat(unit.charAt(0).toUpperCase(), "b/s");
    var size = /^(it|item|file|frame|step)/i.test(unit) ? undefined : sizeOf(n, unit, bare);
    return size ? "".concat(sizeText(size), "/s") : "".concat(n, " ").concat(unit, "/s");
};
// What is counted, said right before its count (frame 81/120, Epoch: 3/10, step #4 of 6)
var COUNTED = /\b(steps?|stages?|phases?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|iter(ation)?s?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|mesh|fits?)\s*[:#]?\s*$/i;
// A size pair that is how full something is, not how far a run is
var HELD = /\b(mem(ory)?|ram|vram|gpu|disk|used|free|avail(able)?|alloc(ated)?|reserved|cache|swap|heap|rss)\b\W*$/i;
// A percent that is a score, not progress
var SCORE = /\b(acc(uracy)?|score|coverage|precision|recall|f1|auc|iou|map|top-?\d|pass(ed)?|win|rate|util(i[sz]ation)?|cpu|gpu|mem(ory)?|load)\b[^%]{0,16}$/i;
// What follows the work's own `progress:` on a line (after a log's time or level), or undefined; "no progress:" is none
var ownOf = function (line) {
    var _a;
    var m = line.match(/(?:^|[\s\]|[])progress:\s*(.*)$/i);
    return m && !/\bno\s+progress:/i.test(line) ? ((_a = m[1]) !== null && _a !== void 0 ? _a : '') : undefined;
};
// The progress one line shows, or undefined
var lineProgress = function (line) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    // The work's own line: progress: done/total [unit] [words], or progress: N%, anywhere on a line (after a log's time or level)
    var own = ownOf(line);
    if (own !== undefined) {
        var rest = own;
        var pct = rest.match(/^(\d+(?:\.\d+)?)\s?%/);
        if (pct && Number(pct[1]) <= 100)
            return { pct: pctText(Number(pct[1])), isOwn: true };
        // done/total with a unit after the total or after both: 3/6 steps, 4.2/10 GB, 4.2 GB / 10 GB, 4.2GB/10GB
        var m = rest.match(/^(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?\s*(?:\/|of)\s*(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?/);
        if (m) {
            // Its own numbers and unit, as written; a word after the total is its unit only when it is a size or a thing counted
            var _2 = m[1], a = _2 === void 0 ? '' : _2, _3 = m[2], u1 = _3 === void 0 ? '' : _3, _4 = m[3], b = _4 === void 0 ? '' : _4, _5 = m[4], u2 = _5 === void 0 ? '' : _5;
            var na = Number(a.replace(/,/g, ''));
            var nb = Number(b.replace(/,/g, ''));
            var isSizeUnit = function (u) { return /^([KMGTP]i?B|B|bytes?)$/i.test(u); };
            var unit = isSizeUnit(u2) ? u2 : isSizeUnit(u1) ? u1 : u2 && !u1 && (COUNTED.test(u2) || /^[a-z]{3,}s$/i.test(u2)) ? u2 : '';
            var isSize = isSizeUnit(unit);
            if (nb > 0 && na <= nb)
                return { done: isSize ? "".concat(a, " ").concat(unit) : countText(na), total: "".concat(isSize ? b : countText(nb)).concat(unit ? " ".concat(unit) : ''), pct: percentOf(na, nb), rate: rateOf(rest), isOwn: true };
        }
    }
    // curl's meter: % Total % Received % Xferd Average-speeds Times Current-speed, sizes in 1024s
    var curl = line.match(/^\s*(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+\d{1,3}\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+[-\d:]+\s+[-\d:]+\s+([-\d:]+)\s+(\d[\d.]*[kMGTP]?)\s*$/);
    if (curl) {
        var _6 = curl[2], total = _6 === void 0 ? '' : _6, _7 = curl[3], pct = _7 === void 0 ? '' : _7, _8 = curl[4], done = _8 === void 0 ? '' : _8, _9 = curl[5], timeLeft = _9 === void 0 ? '' : _9, _10 = curl[6], speed = _10 === void 0 ? '' : _10;
        var of = function (text) { var _a, _b, _c; return (_c = sizeOf(text.replace(/[kMGTP]$/, ''), (_b = (_a = text.match(/[kMGTP]$/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : { bytes: 0, base: 1024 }; };
        var t = of(total);
        return __assign(__assign({ done: sizeText(of(done)) }, (t.bytes > 0 ? { total: sizeText(t), pct: "".concat(pct, "%"), left: /\d/.test(timeLeft) ? (0, exports.leftText)(secondsIn(timeLeft)) : undefined } : {})), { rate: "".concat(sizeText(of(speed)), "/s") });
    }
    // azcopy: 45.2 %, 10 Done, 0 Failed, 90 Pending, 0 Skipped, 100 Total, 2-sec Throughput (Mb/s): 85.3
    var azcopy = line.match(/^\s*(\d+(?:\.\d+)?)\s?%,\s*(\d+) Done,.*?(\d+) Total\b(?:.*Throughput \(Mb\/s\):\s*([\d.]+))?/);
    if (azcopy)
        return __assign({ pct: pctText(Number(azcopy[1])), done: azcopy[2], total: "".concat(azcopy[3], " files") }, (azcopy[4] ? { rate: "".concat(sizeText({ bytes: (Number(azcopy[4]) * 1e6) / 8, base: 1000 }), "/s") } : {}));
    // wget, dot style: 460800K .......... .......... 45% 10.2M 55s
    var dots = line.match(/^\s*(\d+)K\s+[.\s]+\s(\d{1,3})%\s+([\d.]+[KMG])\s/);
    if (dots)
        return { done: sizeText({ bytes: Number(dots[1]) * 1024, base: 1024 }), pct: "".concat(dots[2], "%"), rate: "".concat(sizeText((_d = sizeOf((_b = (_a = dots[3]) === null || _a === void 0 ? void 0 : _a.slice(0, -1)) !== null && _b !== void 0 ? _b : '0', (_c = dots[3]) === null || _c === void 0 ? void 0 : _c.slice(-1))) !== null && _d !== void 0 ? _d : { bytes: 0, base: 1024 }), "/s"), wget: true };
    // wget, bar style: big.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 55s
    var wget = line.match(/\s(\d{1,3})%\[[=> ]*\]\s+([\d.,]+)([KMGT]?)\s+([\d.]+\s?[KMG]?B\/s)/);
    if (wget)
        return { done: sizeText((_f = sizeOf((_e = wget[2]) !== null && _e !== void 0 ? _e : '0', wget[3])) !== null && _f !== void 0 ? _f : { bytes: 0, base: 1024 }), pct: "".concat(wget[1], "%"), rate: rateOf((_g = wget[4]) !== null && _g !== void 0 ? _g : '', 1024), wget: true };
    // rsync: 1,234,567,890  45%   10.21MB/s    0:00:55
    var rsync = line.match(/^\s*(\d[\d,]*)\s+(\d{1,3})%\s+([\d.]+[kKMGT]?B\/s)\s+\d+:\d\d:\d\d/);
    if (rsync)
        return { done: sizeText({ bytes: Number((_h = rsync[1]) === null || _h === void 0 ? void 0 : _h.replace(/,/g, '')), base: 1000 }), pct: "".concat(rsync[2], "%"), rate: rateOf((_j = rsync[3]) !== null && _j !== void 0 ? _j : '') };
    var seen = pctOf(line);
    var pctSeen = seen && !SCORE.test(line.slice(0, line.indexOf(seen))) ? seen : undefined;
    var hasBar = /[█▉▊▋▌▍▎▏░▒▓━]|#{3,}|\[[=#>.\s-]{3,}\]/.test(line);
    // A count right after a bar is the bar's own (tqdm: 45%|████| 450/1000)
    var barCount = line.match(/%\|(?:[^|]{0,80}\|)?\s*(\d[\d,]*)\/(\d[\d,]*)\b/);
    // A size done of a size in all (tqdm, pip, aws, gsutil, docker, hf): 1.41G/3.00G, 460.1/1024.0 MB, 460.0 MiB/  1.0 GiB, where a
    // percent, a bar or a speed says it moves and it is not how full a memory or a disk is
    var sizes = (_k = line.match(new RegExp(String.raw(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", "s*(?:/|of)s*", ""], ["", "\\s*(?:\\/|of)\\s*", ""])), SIZE, SIZE)))) !== null && _k !== void 0 ? _k : line.match(new RegExp(String.raw(templateObject_8 || (templateObject_8 = __makeTemplateObject(["(d[d,]*(?:.d+)?)()s*/s*", ""], ["(\\d[\\d,]*(?:\\.\\d+)?)()\\s*\\/\\s*", ""])), SIZE)));
    var ahead = line.slice(0, (_l = sizes === null || sizes === void 0 ? void 0 : sizes.index) !== null && _l !== void 0 ? _l : 0);
    var isCountAhead = __spreadArray([], ahead.matchAll(/(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b/g), true).some(function (m) { return COUNTED.test(ahead.slice(0, m.index)); });
    if (sizes && (pctSeen || hasBar || RATE.test(line)) && !HELD.test(ahead) && !isCountAhead) {
        var _11 = sizes[1], a = _11 === void 0 ? '' : _11, _12 = sizes[2], ua = _12 === void 0 ? '' : _12, _13 = sizes[3], b = _13 === void 0 ? '' : _13, _14 = sizes[4], ub = _14 === void 0 ? '' : _14;
        var d = sizeOf(a, ua || ub, 1000);
        var t = sizeOf(b, ub, 1000);
        if (d && t && t.bytes > 0 && d.bytes <= t.bytes * 1.001)
            return { done: sizeText(d), total: sizeText(t), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(d.bytes, t.bytes), rate: rateOf(line.slice(((_m = sizes.index) !== null && _m !== void 0 ? _m : 0) + sizes[0].length)) };
    }
    if (barCount) {
        var a = Number((_o = barCount[1]) === null || _o === void 0 ? void 0 : _o.replace(/,/g, ''));
        var b = Number((_p = barCount[2]) === null || _p === void 0 ? void 0 : _p.replace(/,/g, ''));
        if (b > 0 && a <= b)
            return { done: countText(a), total: countText(b), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // A count toward a total, said whole in brackets ([4/6], (450/1000)), right after what it counts (frame 81/120), or right beside
    // its percent
    var count = line.match(/(?:^|[\s[(:#])(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b(?![/.:]\d)/);
    // (none on a line whose percent is a score: accuracy 95% on 1000/1000 samples)
    if (count && !(seen && !pctSeen)) {
        var before = line.slice(0, ((_q = count.index) !== null && _q !== void 0 ? _q : 0) + (count[0].match(/^[\s[(:#]/) ? 1 : 0));
        var after = line.slice(((_r = count.index) !== null && _r !== void 0 ? _r : 0) + count[0].length);
        var a = Number((_s = count[1]) === null || _s === void 0 ? void 0 : _s.replace(/,/g, ''));
        var b = Number((_t = count[2]) === null || _t === void 0 ? void 0 : _t.replace(/,/g, ''));
        var isBracketed = /[[(]\s*$/.test(before) && /^\s*[\])]/.test(after);
        var around = line.slice(Math.max(0, ((_u = count.index) !== null && _u !== void 0 ? _u : 0) - 12), ((_v = count.index) !== null && _v !== void 0 ? _v : 0) + count[0].length + 12);
        var isBeside = Boolean(pctSeen) && !around.includes('|') && pctOf(around) === pctSeen;
        // or with what it counts after it (Copied 3/6 files), or a bar of brackets after it (Keras: 450/1000 [=====>....])
        var isProgress = isBracketed || isBeside || COUNTED.test(before) || /^\s*(steps?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|fits?)\b/i.test(after) || /^\s*\[[=>.#\s-]{4,}\]/.test(after);
        // with what it counts, said after the count or before it (Processed 9 of 20 files, frame 81/120)
        var unit = (_z = (_x = (_w = after.match(/^\s*([a-z]{3,}s)\b/i)) === null || _w === void 0 ? void 0 : _w[1]) !== null && _x !== void 0 ? _x : (_y = before.match(/\b([a-z]{3,}s)\s*[:#]?\s*$/i)) === null || _y === void 0 ? void 0 : _y[1]) !== null && _z !== void 0 ? _z : '';
        var named_1 = unit && COUNTED.test(unit) ? " ".concat(unit.toLowerCase()) : '';
        if (isProgress && b > 0 && a <= b)
            return { done: countText(a), total: "".concat(countText(b)).concat(named_1), pct: isBeside ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // Else a percent alone, with any size it says is done (git: Receiving objects: 45% (450/1000), 460.00 MiB | 10.20 MiB/s)
    if (pctSeen) {
        var size = line.match(new RegExp(String.raw(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", "(?!s?/s|ps)"], ["", "(?!\\s?/s|ps)"])), SIZE)));
        var d = size && /[KMGTP]/i.test((_0 = size[2]) !== null && _0 !== void 0 ? _0 : '') ? sizeOf((_1 = size[1]) !== null && _1 !== void 0 ? _1 : '', size[2]) : undefined;
        return __assign(__assign({ pct: pctSeen }, (d ? { done: sizeText(d) } : {})), { rate: rateOf(line) });
    }
    return undefined;
};
var tidy = function (p) { return Object.fromEntries(Object.entries(p).filter(function (_a) {
    var key = _a[0], v = _a[1];
    return key !== 'wget' && v !== undefined && v !== '';
})); };
// How far a run is, from its last line; or else from the newest of the work's own progress lines a little higher up, which says
// it is earlier than the last line, so the last line is still shown beside it (an error after a download is never hidden). wget's
// total is its Length, said once above its bar
var progressOf = function (lines) {
    var _a, _b;
    var last = (_a = lines.at(-1)) !== null && _a !== void 0 ? _a : '';
    var found = lineProgress(last);
    if (found && (found.pct || found.done)) {
        var length_1 = found.wget && !found.total ? lines.map(function (l) { var _a; return (_a = l.match(/^Length:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean).at(-1) : undefined;
        var left = (_b = found.left) !== null && _b !== void 0 ? _b : (found.pct === '100%' ? undefined : leftOf(last));
        return tidy(__assign(__assign({}, (length_1 && Number(length_1) > 0 ? __assign(__assign({}, found), { total: sizeText({ bytes: Number(length_1), base: 1024 }) }) : found)), { left: left }));
    }
    for (var _i = 0, _c = lines.slice(0, -1).reverse(); _i < _c.length; _i++) {
        var line = _c[_i];
        if (ownOf(line) === undefined)
            continue;
        var own = lineProgress(line);
        if (own && (own.pct || own.done))
            return tidy(__assign(__assign({}, own), { rate: undefined, left: undefined, isEarlier: true }));
    }
    return {};
};
exports.progressOf = progressOf;
// The engine's own last line on the output of a background command that has ended
var isOutputEnded = function (text) { return /\[exited with code [^\]\n]*\]\s*$/.test(text); };
exports.isOutputEnded = isOutputEnded;
// The end of a job's output as its latest line: colours and cursor moves taken out, a line a progress bar rewrites read as it
// stands last, with the last percent in it and any port it named
// The last few lines an output ends with, as a terminal would show them: a line a progress bar rewrote with returns is its last
// state, colours and blank lines are dropped, each line is cut to a row
exports.OUTPUT_LINES = 4;
var tailOf = function (text, most) {
    if (most === void 0) { most = exports.OUTPUT_LINES; }
    return text
        .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
        .replace(/\x1b\][^\x07]*\x07/g, '')
        .split('\n')
        .map(function (line) { var _a; return ((_a = line.split('\r').filter(function (part) { return part.trim(); }).at(-1)) !== null && _a !== void 0 ? _a : '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trimEnd(); })
        .filter(function (line) { return line.trim(); })
        .slice(-most)
        .map(function (line) { return line.slice(0, 200); });
};
exports.tailOf = tailOf;
var latestOf = function (text) {
    var _a;
    var clean = text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07]*\x07/g, '');
    var lines = clean
        .split('\n')
        .map(function (line) { var _a; return (_a = line.split('\r').map(function (part) { return part.trim(); }).filter(Boolean).at(-1)) !== null && _a !== void 0 ? _a : ''; })
        .filter(Boolean);
    var last = (_a = lines.at(-1)) !== null && _a !== void 0 ? _a : '';
    var progress = (0, exports.progressOf)(lines);
    // A web server's access line says only the request and its answer
    var hit = last.match(/"(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) (\S+) HTTP\/[\d.]+" (\d{3})/);
    var line = hit ? "".concat(hit[1], " ").concat(hit[2], " ").concat(hit[3]) : last;
    return __assign(__assign({ latest: line.replace(/\s+/g, ' ').trim().slice(0, 240) }, progress), { port: (0, exports.portOf)(clean) });
};
exports.latestOf = latestOf;
// A command started detached, with nohup or setsid and its output sent to a file: the command itself, the log as written, and the
// folder a leading `cd` moved it to; undefined for any other command
var detachedOf = function (command) {
    var _a, _b, _c, _d, _e, _f;
    // Started on another Mac over ssh, its log and process are there, not here
    if (/^\s*(\S*\/)?ssh\b/.test(command))
        return undefined;
    // nohup or setsid at the head of a command, sent off with a lone &
    if (!/(^|&&|;|\|\||\n)\s*(nohup|setsid)\s/.test(command) || !/(?<![>&<])&(?![&>\d])/.test(command))
        return undefined;
    var written = (_b = (_a = command.match(/(?:^|[^0-9&2])>>?\s*("[^"]+"|'[^']+'|[^\s;&|]+)/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.replace(/^["']|["']$/g, '');
    if (!written || written === '/dev/null')
        return undefined;
    // A log or folder named by a shell variable the command sets itself (S=/tmp/x && nohup ... > $S/run.log) is named whole; one
    // named by any other variable is not followed, as a wrong file would leave its card blank for as long as the run lasts
    var vars = new Map(__spreadArray([], command.matchAll(/(?:^|&&|;|\n)\s*(?:export\s+)?([A-Za-z_]\w*)=("[^"$`]*"|'[^']*'|[^\s;&|$`]+)(?=\s*(?:&&|;|\n))/g), true).map(function (m) { var _a, _b; return [(_a = m[1]) !== null && _a !== void 0 ? _a : '', ((_b = m[2]) !== null && _b !== void 0 ? _b : '').replace(/^["']|["']$/g, '')]; }));
    var expand = function (text) { return text.replace(/\$(?:\{([A-Za-z_]\w*)\}|([A-Za-z_]\w*))/g, function (all, braced, bare) {
        var _a, _b;
        var name = (_a = braced !== null && braced !== void 0 ? braced : bare) !== null && _a !== void 0 ? _a : '';
        return name === 'HOME' ? '~' : ((_b = vars.get(name)) !== null && _b !== void 0 ? _b : all);
    }); };
    var log = expand(written);
    var cd = (_d = (_c = command.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)\s*&&/)) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.replace(/^["']|["']$/g, '');
    if (log.includes('$') || (cd === null || cd === void 0 ? void 0 : cd.includes('$')))
        return undefined;
    var core = ((_f = (_e = command.match(/\b(?:nohup|setsid)\s+(.*?)\s*(?:>|$)/)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : command).trim();
    return { log: log, cd: cd, core: core };
};
exports.detachedOf = detachedOf;
// The process id a detached start printed, as `echo $!` does
// (never 0 or a number with a leading zero: on 15 Nov a curl's "000" in the same output was taken for one, and `kill -0 0` always
// succeeds, so a run long ended stayed on its card for hours)
// Only when it is the one number printed: a status code another command printed beside it could be taken for it
var pidOf = function (stdout) {
    var _a, _b;
    var numbers = stdout.split('\n').filter(function (line) { return /^\s*\d+\s*$/.test(line); });
    return numbers.length === 1 ? (_b = (_a = numbers[0]) === null || _a === void 0 ? void 0 : _a.match(/^\s*([1-9]\d{1,6})\s*$/)) === null || _b === void 0 ? void 0 : _b[1] : undefined;
};
exports.pidOf = pidOf;
var isPid = function (pid) { return /^[1-9]\d{1,6}$/.test(pid); };
exports.isPid = isPid;
// A call that only waits (a sleep, a wait) is no job of its own
var isWaitOnly = function (cmd) { return /^\s*(sleep\s|wait\b|python3? -c ['"]import time; ?time\.sleep)/.test(cmd); };
exports.isWaitOnly = isWaitOnly;
// A job's own words, without the command some descriptions repeat after a colon
// A job the work gave no words to is named by what it runs, in a few words (bash round3b_figs.sh, python rc.py), never by the head
// of its shell line: on 15 Nov a row read "cd /private/tmp/claude-501/-Users ..."
var labelOf = function (what, cmd) {
    var _a, _b;
    var isCommand = !what || (cmd.trim() && cmd.replace(/\s+/g, ' ').trim().startsWith(what.replace(/\s+/g, ' ').trim().slice(0, 40)));
    if (isCommand)
        return (0, exports.commandName)(cmd) || what;
    var head = (_a = what.split(': ')[0]) !== null && _a !== void 0 ? _a : what;
    var first = (_b = cmd.trim().split(/\s+/).find(function (word) { return !/^(cd|&&|nohup|setsid)$/.test(word) && !word.startsWith('/'); })) !== null && _b !== void 0 ? _b : '';
    return head !== what && first && what.slice(head.length + 2).startsWith(first.slice(0, 6)) ? head : what;
};
exports.labelOf = labelOf;
// What a shell line runs, in a few words: its first step that does more than move or set up, as its program and the file or word
// it works on, each without its folders
var LEAD = /^(cd|pushd|popd|export|source|\.|mkdir|set|unset|umask|ulimit|echo|printf|true|sleep|wait|clear)\b/;
var commandName = function (cmd) {
    var _a, _b, _c, _d, _e, _f, _g;
    var steps = stepsOf(cmd).map(function (one) { return one.replace(/^(do|then|else)\s+/, ''); });
    // A loop or test leading the line is named as one, not by its first word
    if (/^(for|while|until|if|select)\b/.test((_a = steps[0]) !== null && _a !== void 0 ? _a : '') && !steps.slice(1).some(function (one) { return !LEAD.test(one) && !/^(for|while|until|if|done|fi|esac)\b/.test(one) && !/^[A-Za-z_]\w*=/.test(one); }))
        return 'a shell loop';
    var step = (_b = steps.find(function (one) { return !LEAD.test(one) && !/^(for|while|until|if|done|fi|esac)\b/.test(one) && !/^[A-Za-z_]\w*=/.test(one); })) !== null && _b !== void 0 ? _b : '';
    var words = ((_c = step.match(/"[^"]*"|'[^']*'|\S+/g)) !== null && _c !== void 0 ? _c : []).map(function (word) { return word.replace(/^["']|["']$/g, ''); });
    // A runner of runners says what it runs: uv run python train.py is python train.py
    while (/^(uv|poetry|pipenv|pdm|hatch|conda|mamba)$/.test((_d = words[0]) !== null && _d !== void 0 ? _d : '') && words.includes('run'))
        words = words.slice(words.indexOf('run') + 1).filter(function (word, n, all) { var _a; return !(n < 2 && (/^-n$|^--name$/.test(word) || /^-n$|^--name$/.test((_a = all[n - 1]) !== null && _a !== void 0 ? _a : ''))); });
    var program = (_f = ((_e = words[0]) !== null && _e !== void 0 ? _e : '').split('/').filter(Boolean).at(-1)) !== null && _f !== void 0 ? _f : '';
    if (!program)
        return '';
    var isRunner = /^(python\d?(\.\d+)?|node|bash|sh|zsh|ruby|perl|deno|bun|uv|npx|Rscript|julia|ssh)$/.test(program);
    // A runner says what it runs; any other program what it works on first, past a folder it is pointed at (git -C <folder>)
    var rest = words.slice(1).filter(function (word, n, all) { var _a; return !(/^-[Cc]$/.test((_a = all[n - 1]) !== null && _a !== void 0 ? _a : '') || /^-[Cc]$/.test(word)); });
    var arg = rest.find(function (word) { return word && !word.startsWith('-') && !/^[<>|&]/.test(word) && !/^\d+>/.test(word) && (!isRunner || !/^(run|exec|-m)$/.test(word)); });
    var short = (_g = (arg !== null && arg !== void 0 ? arg : '').split('/').filter(Boolean).at(-1)) !== null && _g !== void 0 ? _g : '';
    return "".concat(program).concat(short && short.length <= 40 ? " ".concat(short) : '');
};
exports.commandName = commandName;
// A quoted word, blanked so what it holds splits nothing
var unquoted = function (text) { return text.replace(/"(\\.|[^"\\])*"|'[^']*'/g, '""'); };
var LIGHT = /^(date|tail|head|grep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed|jq|true|cd|uptime|pwd)\b/;
var nameOf = function (path) { var _a; return (_a = path.replace(/^["']|["']$/g, '').split('/').filter(Boolean).at(-1)) !== null && _a !== void 0 ? _a : path; };
var waitOf = function (cmd) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    // A leading cd, joined with && or ; (on 15 Nov a wait led by `cd <folder>;` was not known as one)
    var cd = (_b = (_a = cmd.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;]+)\s*(?:&&|;)/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.replace(/^["']|["']$/g, '');
    var body = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;]+)\s*(?:&&|;)\s*/, '').replace(/^\s*end=\$\(\([^;]*\)\);\s*/, '');
    var loop = body.match(/^\s*(until|while)\s+(.+?);\s*do\s+sleep\s+[\d.]+\s*;?\s*done\s*(.*)$/s);
    if (!loop)
        return undefined;
    var word = loop[1], _m = loop[2], cond = _m === void 0 ? '' : _m, _o = loop[3], after = _o === void 0 ? '' : _o;
    // What comes after the loop only reports
    // (a pipe a command's one line shows as " / ")
    var steps = unquoted(after).split(/\s*(?:;|&&|\|\|?|\s\/\s)\s*/).map(function (step) { return step.trim(); }).filter(Boolean);
    if (!steps.every(function (step) { return LIGHT.test(step) || /^\d?>/.test(step); }))
        return undefined;
    var isUntil = word === 'until';
    // A file named from the folder a leading cd moved to is named whole
    var whole = function (path) { return (path.startsWith('/') || path.startsWith('~/') || !cd ? path : "".concat(cd.replace(/\/$/, ''), "/").concat(path)); };
    var grep = cond.match(/\b(?:grep|rg)\s+(?:-\w+\s+)*-\w*q\w*\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)\s+("[^"]+"|'[^']+'|\S+)/);
    if (grep)
        return { what: "".concat((_c = grep[1]) === null || _c === void 0 ? void 0 : _c.replace(/^["']|["']$/g, '').replace(/\\\|/g, ' or '), " in ").concat(nameOf((_d = grep[2]) !== null && _d !== void 0 ? _d : '')), file: whole((_f = (_e = grep[2]) === null || _e === void 0 ? void 0 : _e.replace(/^["']|["']$/g, '')) !== null && _f !== void 0 ? _f : '') };
    var pg = cond.match(/(!\s*)?pgrep\s+(?:-\w+\s+)*("[^"]+"|'[^']+'|\S+)/);
    if (pg) {
        var pattern = (_h = (_g = pg[2]) === null || _g === void 0 ? void 0 : _g.replace(/^["']|["']$/g, '')) !== null && _h !== void 0 ? _h : '';
        var isStart = isUntil !== Boolean(pg[1]);
        return { what: "".concat(pattern, " to ").concat(isStart ? 'start' : 'end'), pattern: pattern, isStart: isStart };
    }
    var kill = cond.match(/(!\s*)?kill\s+-0\s+(\d+)/);
    if (kill)
        return { what: "process ".concat(kill[2], " to end"), pid: kill[2] };
    var file = cond.match(/\[\s+(!\s+)?-[fsed]\s+("[^"]+"|'[^']+'|[^\s\]]+)\s*\]/);
    if (file)
        return { what: nameOf((_j = file[2]) !== null && _j !== void 0 ? _j : ''), file: whole((_l = (_k = file[2]) === null || _k === void 0 ? void 0 : _k.replace(/^["']|["']$/g, '')) !== null && _l !== void 0 ? _l : '') };
    return { what: cond.replace(/\s+/g, ' ').trim().slice(0, 80) };
};
exports.waitOf = waitOf;
// Jobs alike (the same kind, words and command, or the same wait) are one row that says how many they are, from the first one's
// start; the newest one's output stands for them
var foldJobs = function (jobs) {
    var _a;
    var keyOf = function (job) { var _a, _b; return (job.kind === 'wait' ? "wait|".concat(job.label, "|").concat((_a = job.waitsFor) !== null && _a !== void 0 ? _a : '', "|").concat((_b = job.waitFile) !== null && _b !== void 0 ? _b : '') : "".concat(job.kind, "|").concat(job.label, "|").concat(job.cmd)); };
    var groups = new Map();
    for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
        var job = jobs_1[_i];
        groups.set(keyOf(job), __spreadArray(__spreadArray([], ((_a = groups.get(keyOf(job))) !== null && _a !== void 0 ? _a : []), true), [job], false));
    }
    return __spreadArray([], groups.values(), true).map(function (group) {
        var newest = group.reduce(function (a, b) { return (b.at >= a.at ? b : a); });
        if (group.length === 1)
            return newest;
        var wrote = group.flatMap(function (job) { return (job.wroteAt ? [job.wroteAt] : []); });
        return __assign(__assign(__assign({}, newest), { at: Math.min.apply(Math, group.map(function (job) { return job.at; })), count: group.length, isPaused: group.every(function (job) { return job.isPaused; }) }), (wrote.length ? { wroteAt: Math.max.apply(Math, wrote) } : {}));
    });
};
exports.foldJobs = foldJobs;
var secondsOf = function (etime) {
    var _a = etime.includes('-') ? etime.split('-') : ['0', etime], days = _a[0], _b = _a[1], rest = _b === void 0 ? '' : _b;
    return Number(days) * 86400 + rest.split(':').reduce(function (sum, part) { return sum * 60 + Number(part); }, 0);
};
var procsOf = function (text, now) {
    return text.split('\n').flatMap(function (line) {
        var _a, _b, _c, _d, _e;
        var m = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+((?:\d+-)?[\d:]+)\s+(.*)$/);
        return m ? [{ pid: (_a = m[1]) !== null && _a !== void 0 ? _a : '', ppid: (_b = m[2]) !== null && _b !== void 0 ? _b : '', stat: (_c = m[3]) !== null && _c !== void 0 ? _c : '', startAt: now - secondsOf((_d = m[4]) !== null && _d !== void 0 ? _d : '0') * 1000, command: (_e = m[5]) !== null && _e !== void 0 ? _e : '' }] : [];
    });
};
exports.procsOf = procsOf;
// A process and everything it started
var treeOf = function (procs, pid) {
    var top = procs.find(function (p) { return p.pid === pid; });
    if (!top)
        return [];
    var out = [top];
    var _loop_1 = function (n) {
        out.push.apply(out, procs.filter(function (p) { var _a; return p.ppid === ((_a = out[n]) === null || _a === void 0 ? void 0 : _a.pid) && !out.includes(p); }));
    };
    for (var n = 0; n < out.length; n++) {
        _loop_1(n);
    }
    return out;
};
exports.treeOf = treeOf;
// The shell a command held open runs in, found by the command itself as the engine hands it to the shell (eval '...', its own
// quotes written '"'"' and its new lines as ps writes them) and by when it started; undefined when none is. A command's words
// alone are too few to tell most commands by (python3 train.py), so the command is matched whole, from its start
var flat = function (text) { return text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim(); };
var heldShellOf = function (procs, cmd, at) {
    var _a;
    var want = flat(cmd).slice(0, 200);
    if (!want)
        return undefined;
    return (_a = procs
        .filter(function (p) { return /shell-snapshots\/snapshot-/.test(p.command) && p.ppid !== '1' && Math.abs(p.startAt - at) <= 20000; })
        .filter(function (p) {
        var start = p.command.indexOf(" eval '");
        if (start < 0)
            return false;
        var end = p.command.lastIndexOf("' < /dev/null");
        var body = p.command.slice(start + 7, end > start ? end : undefined).replaceAll("'\"'\"'", "'").replaceAll("'\\''", "'").replace(/\\012/g, '\n');
        return flat(body).startsWith(want) || want.startsWith(flat(body).slice(0, 200));
    })
        .sort(function (a, b) { return Math.abs(a.startAt - at) - Math.abs(b.startAt - at); })[0]) === null || _a === void 0 ? void 0 : _a.pid;
};
exports.heldShellOf = heldShellOf;
// Stopped (paused) as ps writes it
var isPausedProc = function (p) { return p.stat.startsWith('T'); };
exports.isPausedProc = isPausedProc;
// The words of a command that stay as they are however the engine quotes it to run it: the longest few, to find its shell by
var fragmentsOf = function (cmd) {
    return __spreadArray([], new Set(cmd.replace(/\s+\S*$/, '').split(/[\s'"\\$`;|&()<>]+/).filter(function (word) { return word.length >= 6 && /^[\w./:=,@%+-]+$/.test(word); })), true).sort(function (a, b) { return b.length - a.length; })
        .slice(0, 3);
};
// The shells the engine runs background commands in, matched to the commands by their words and by when they started: each shell to
// the command kept nearest its start (a command kept as it went to the background may have started up to its time limit before).
// A command left without a shell when some other shell still holds its words is taken as running (true), as is one whose words
// are too few to tell it by (not listed); only one no shell holds is missing (null)
var SHELL_BEFORE = 11 * 60000;
var SHELL_AFTER = 15000;
var shellsOf = function (procs, jobs) {
    var shells = procs.filter(function (p) { return /shell-snapshots\/snapshot-/.test(p.command) && /\beval\b/.test(p.command) && p.ppid !== '1'; });
    var found = new Map();
    var told = jobs.map(function (job) { return ({ job: job, words: fragmentsOf(job.cmd) }); }).filter(function (one) { return one.words.length >= 2; });
    var pairs = told
        .flatMap(function (_a) {
        var job = _a.job, words = _a.words;
        return shells.filter(function (p) { return words.every(function (word) { return p.command.includes(word); }) && p.startAt >= job.at - SHELL_BEFORE && p.startAt <= job.at + SHELL_AFTER; }).map(function (p) { return ({ id: job.id, pid: p.pid, gap: Math.abs(job.at - p.startAt) }); });
    })
        .sort(function (a, b) { return a.gap - b.gap; });
    var taken = new Set();
    for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
        var pair = pairs_1[_i];
        if (!found.has(pair.id) && !taken.has(pair.pid))
            (found.set(pair.id, pair.pid), taken.add(pair.pid));
    }
    var _loop_2 = function (job, words) {
        if (!found.has(job.id))
            found.set(job.id, shells.some(function (p) { return !taken.has(p.pid) && words.every(function (word) { return p.command.includes(word); }); }) ? true : null);
    };
    for (var _a = 0, told_1 = told; _a < told_1.length; _a++) {
        var _b = told_1[_a], job = _b.job, words = _b.words;
        _loop_2(job, words);
    }
    return found;
};
exports.shellsOf = shellsOf;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
