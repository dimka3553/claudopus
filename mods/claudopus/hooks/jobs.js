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
exports.leftName = exports.memOf = exports.leftoversOf = exports.shellsOf = exports.isPausedProc = exports.heldShellOf = exports.treeOf = exports.procsOf = exports.PS_COLUMNS = exports.foldJobs = exports.watcherOf = exports.ownWaitOf = exports.waitOf = exports.commandName = exports.labelOf = exports.isWaitOnly = exports.isPid = exports.pidOf = exports.detachedOf = exports.latestOf = exports.tailOf = exports.OUTPUT_LINES = exports.leftSeconds = exports.expiresIn = exports.isOutputEnded = exports.endOf = exports.progressOf = exports.leftText = exports.reportsOf = exports.plainOf = exports.PLAIN_MOST = exports.portOf = exports.jobKindOf = exports.isKindSaid = exports.describedOf = exports.DOWNLOAD_CMD = exports.SERVER_CMD = exports.JOB_UNREAD = exports.SILENT_WARN = exports.SILENT_AFTER = exports.JOB_QUIET = exports.JOB_SHAPE = exports.JOB_HEAD = exports.JOB_WORD = exports.JOB_GLYPH = exports.JOB_COLOR = exports.JOB_TAIL = exports.JOBS_SHOWN = exports.JOB_NEWS = exports.JOB_LOOK = void 0;
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
// A run that has given no word this long says so on its row, in amber, as its work is told to look at it then: work is told to give
// word at least every 10 seconds, but tests, builds and installs go quiet for tens of seconds and are fine, and a count of seconds
// before then only says what any glance at a still percent says (16 Nov: "nothing printed for 5 seconds, 10 seconds" was useless)
exports.SILENT_AFTER = 60000;
exports.SILENT_WARN = 60000;
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
// The one shape a run's second line has, for every run however it was started: how far it is (a count of how many, a percent, a
// size of a size, its speed, time left), a few plain words of what it does now, and when it last gave a sign of life, at most
// PLAIN_MOST characters of words. Never shown: paths, file names, web addresses, clock times and dates, codes in brackets, state
// words, ids, settings (key=value), sizes that say nothing of how far (memory), program names, and any line that names a
// password, key or token. A raw line that is not plain words once those are taken out is not shown at all
exports.PLAIN_MOST = 60;
// A line that names a password, key, token, code or login, says who is signed in, or echoes what was typed at a prompt is never
// shown, not even in part
var SECRETISH = /\b(pass(?:word|phrase|wd|code)?s?|secrets?|tokens?|api[-_ ]?keys?|keys?|bearer|authori[sz]ation|credentials?|codes?|pins?|verification|verify|otp|2fa|mfa|ssh-(?:rsa|ed25519)|log(?:s|ging|ged)?[ -]?in|sign(?:s|ing|ed)?[ -]?in|authenticat\w*|user ?names?|accounts?|e-?mail)\b|\b(?:sk|pk|ghp|gho|xox[abp])[-_][A-Za-z0-9]{8,}|\S@\S|\(\w*\):\s*\S|[?:]\s*$/i;
var PROGRAMS = /\b(?:curl|wget|python3?(?:\.\d+)?|node|npm|npx|pnpm|yarn|pip3?|git|az|aws|gcloud|gsutil|azcopy|rsync|scp|ssh|bash|zsh|sh|sudo|docker|kubectl|make|tar|unzip|ffmpeg|brew|uv|conda|apt(?:-get)?)\b:?/gi;
var FILES = /\b[\w.-]+\.(?:py|sh|js|mjs|ts|tsx|json|jsonl|log|txt|csv|tsv|zip|tar|gz|tgz|png|jpe?g|webp|gif|mp4|nii|dcm|ply|obj|stl|pkl|pt|pth|ckpt|safetensors|bin|h5|npz|npy|ya?ml|toml|md|html|out|err|lock|rs|go|java|c|cpp|h)\b/gi;
// A line that is a command or a build step, not news of how a run goes
// (case counts: a log's "[run 11:27:50]" is no Docker RUN)
var COMMANDISH = /^\s*(?:\$|>|#\d+\s|[Ss]tep \d+\/\d+\s*:)|\bRUN\s|\s-{1,2}[a-z][\w-]*(?:\s|$)|^\s*at\s+\S+\s+\(|^\s*File\s|\bthrow\b|^\s*\^\s*$/;
// A single word that is technical whatever the line: one with a path's, a name's or a setting's marks in it (/ \ @ < > { } | :: _),
// a flag, a number with points (a version, an address), a short hash, a word of letters and numbers joined by - or .
var isTechWord = function (word) {
    return /[/\\@<>{}|^`$]|::|_/.test(word) ||
        /^-/.test(word) ||
        /^\(?v?\d+(?:\.\d+){2,}/.test(word) ||
        /^\d{1,3}(?:\.\d{1,3}){3}/.test(word) ||
        /^[\w-]+(?:\.[\w-]+)+$/.test(word.replace(/[.,;:!?)]+$/, '')) && /[a-z]{2,}$/i.test(word.replace(/[.,;:!?)]+$/, '')) ||
        (/^[0-9a-f]{7,}$/i.test(word) && /\d/.test(word) && /[a-f]/i.test(word)) ||
        (/\d/.test(word) && /[A-Za-z]/.test(word) && /[-.]/.test(word.replace(/[.,;:!?)]+$/, ''))) ||
        word.length >= 24 ||
        (word.length >= 12 && /\d/.test(word) && /[A-Za-z]/.test(word)) ||
        /^E[A-Z]{3,}$/.test(word) ||
        /^:\d+/.test(word) ||
        /^[^\w·…%]+$/.test(word);
};
var STOP = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'onto', 'that', 'this', 'its', 'now', 'all', 'are', 'was', 'has', 'have', 'been', 'being', 'then', 'still', 'run', 'running']);
var stem = function (word) { return word.toLowerCase().slice(0, 4); };
var plainOf = function (line, title) {
    var _a, _b, _c;
    if (title === void 0) { title = ''; }
    if (!line || SECRETISH.test(line) || COMMANDISH.test(line))
        return '';
    var t = line.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/^.*?\bprogress:\s*/i, '');
    t = t
        // web addresses, paths (Windows' too) and file names
        .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, ' ')
        .replace(/\b[A-Za-z]:\\\S*/g, ' ')
        .replace(/(^|[\s'"(=:,])(?:~|\.{1,2})?\/[^\s'",)]*/g, '$1 ')
        .replace(FILES, ' ')
        // a state said as a setting (Status: Running), an npm or log marker
        .replace(/\b(?:status|state|phase)\s*:\s*\w+/gi, ' ')
        .replace(/\bERR!/g, ' ')
        // anything in square brackets (a log's time or level, an error number), a single word in round ones (a state: (Running))
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/\(\s*[\w-]+\s*\)/g, ' ')
        // dates and clock times
        .replace(/\b\d{4}-\d\d-\d\d(?:[T ]\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:?\d\d)?)?\b/g, ' ')
        .replace(/\b\d{1,2}:\d\d(?::\d\d(?:\.\d+)?)?\b/g, ' ')
        // a log's level at its head
        .replace(/^\s*(?:INFO|DEBUG|TRACE|NOTICE|VERBOSE)\b:?/i, ' ')
        // an error's own program name said as the word error (FileNotFoundError: → error:)
        .replace(/\b[A-Z]\w*(?:Error|Exception)\b:?/g, 'error:')
        // settings, ids and codes: key=value, long hex or mixed strings, error names in capitals (ENOENT), line numbers
        .replace(/\S+=\S*/g, ' ')
        .replace(/\b[0-9a-f]{8,}(?:-[0-9a-f]{4,})*\b/gi, ' ')
        .replace(/\bline \d+\b/gi, ' ')
        // sizes alone, which say nothing of how far (how far is said from the numbers, not from these words)
        .replace(new RegExp(String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(d[d,]*(?:.d+)?)s?(?:[KMGTP]i?B|bytes?)\b(?:/s)?"], ["(\\d[\\d,]*(?:\\.\\d+)?)\\s?(?:[KMGTP]i?B|bytes?)\\b(?:\\/s)?"]))), 'gi'), ' ')
        .replace(PROGRAMS, ' ')
        // quotes, then a word at a time: technical words go (one at a time, so no long word is tried again and again)
        .replace(/["'`]/g, ' ')
        .replace(/\S+/g, function (word) { return (isTechWord(word) ? ' ' : word); })
        .replace(/\(\s*\)/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/([,;:])(?=[,;:.])/g, '')
        .replace(/^[\s,.;:!?·|>#*=+~\-"'`]+|[\s,;:|>#*=+~\-"'`]+$/g, '')
        .trim();
    var words = (_a = t.match(/[A-Za-z]{2,}/g)) !== null && _a !== void 0 ? _a : [];
    var letters = ((_b = t.match(/[A-Za-z]/g)) !== null && _b !== void 0 ? _b : []).length;
    if (words.length < 2 || letters < t.replace(/\s/g, '').length * 0.6)
        return '';
    // Words that only say again what its name says are no news
    var named = new Set(((_c = title.match(/[A-Za-z]{3,}/g)) !== null && _c !== void 0 ? _c : []).map(stem));
    var own = words.filter(function (word) { return word.length >= 3 && !STOP.has(word.toLowerCase()); });
    // Words that only name what is counted (epoch 3 step) are said by the count already
    if (!own.some(function (word) { return !COUNTED.test(word); }))
        return '';
    if (title && own.every(function (word) { return named.has(stem(word)) || /^(wait(s|ing)?|for|until)$/i.test(word); }))
        return '';
    if (t.length <= exports.PLAIN_MOST)
        return t;
    var cut = t.slice(0, exports.PLAIN_MOST - 1);
    return "".concat(cut.slice(0, cut.lastIndexOf(' ') > 30 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:]+$/, ''), "\u2026");
};
exports.plainOf = plainOf;
// A long command that would give no word of how far it is: a wait loop, or a script of the work's own (a file it runs, as read),
// run in the background, detached, or said to take a minute or more, that prints no progress line and runs no tool with a meter of
// its own. '' for any other: a short one, one that reports, or a program whose words the mod reads as they come (its row then
// says when it last gave a sign of life). The mod's own runners report for themselves
var METER = /\b(?:curl|wget|rsync|azcopy|pip3?|git\s+clone|hf\s+download|huggingface-cli|tqdm|rich\.progress|aria2c|docker\s+pull)\b/;
var SILENCED = /\bcurl\b[^|;&\n]*\s(?:-[a-zA-Z]*s[a-zA-Z]*|--silent)\b|\bwget\b[^|;&\n]*\s(?:-q\b|--quiet\b|-[a-zA-Z]*q[a-zA-Z]*O\b)|\btqdm\([^)\n]*disable\s*=\s*True/;
// A line it prints that the card reads as how far it is: a count of a total (`{i}/{n}`, `$i/$n`, `%d/%d`) or a percent
var PRINTS_COUNT = /\b(?:print|echo|printf|log\w*|console\.log|write)\b[^\n]*(?:\{[^}\n]*\}\s*\/\s*\{|\$\{?\w+\}?\s*\/\s*\$|%[ds]\s*\/\s*%[ds]|\{[^}\n]*:\.?\d*%\}|%%)/;
// The word progress, once what only turns it off is taken out (# no progress bar, --no-progress, progress_bar=False)
var saysProgress = function (text) { return /\bprogress\b/i.test(text.replace(/\bno[-_ ]progress[\w-]*|progress[-_ ]?bar\s*=\s*(?:False|off|0|None)\b/gi, ' ')); };
var reportsOf = function (command, description, isBackground, scripts, timeoutMs) {
    var _a;
    if (timeoutMs === void 0) { timeoutMs = 0; }
    if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(command))
        return '';
    var said = (0, exports.describedOf)(description);
    // A server or a watch never says how far it is: its row says when it was last asked or its last event
    if (said.kind === 'server' || said.kind === 'watch' || exports.SERVER_CMD.test(command))
        return '';
    var isDetached = Boolean((0, exports.detachedOf)(command));
    var isLongSaid = ((_a = said.expect) !== null && _a !== void 0 ? _a : 0) >= 60000 || timeoutMs > 2 * 60000;
    var all = __spreadArray([command], scripts, true);
    if (all.some(saysProgress))
        return '';
    // A wait loop sent off or held open for long: every loop that sleeps between its tries
    if ((isBackground || isDetached || isLongSaid) && /\b(?:until|while|for)\b[\s\S]*?\bdo\b[\s\S]*?\bsleep\b/.test(command))
        return 'wait';
    // A script of its own said to take a minute or more, or started detached (sent to the background alone it may be short)
    if (!(isDetached || isLongSaid) || !scripts.length)
        return '';
    return all.some(function (text) { return (METER.test(text) && !SILENCED.test(text)) || PRINTS_COUNT.test(text); }) ? '' : 'script';
};
exports.reportsOf = reportsOf;
// The plain words after the numbers of a work's own progress line, without the time left it gives (said on its own)
var ownWords = function (rest) {
    return (0, exports.plainOf)(rest.replace(new RegExp(String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject([",?s*\beta:?s*", "|,?s*\b", "s*(?:left|remaining|to go)\b"], [",?\\s*\\beta:?\\s*", "|,?\\s*\\b", "\\s*(?:left|remaining|to go)\\b"])), TIME, TIME), 'gi'), ' ').replace(/^\s*(?:[KMGTP]i?B|B|bytes?)\b/i, ' ')) || undefined;
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
var TIME = String.raw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["(d+(?::dd){1,2}|(?:d+(?:.d+)?s?(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])s*){1,3})"], ["(\\d+(?::\\d\\d){1,2}|(?:\\d+(?:\\.\\d+)?\\s?(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])\\s*){1,3})"])));
var leftOf = function (line) {
    var _a, _b, _c, _d, _e;
    var m = (_d = (_c = (_b = (_a = line.match(new RegExp(String.raw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\beta:?s*", ""], ["\\beta:?\\s*", ""])), TIME), 'i'))) !== null && _a !== void 0 ? _a : line.match(new RegExp(String.raw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\b", "s*(?:left|remaining|to go)\b"], ["\\b", "\\s*(?:left|remaining|to go)\\b"])), TIME), 'i'))) !== null && _b !== void 0 ? _b : line.match(/<(\d+(?::\d\d){1,2})[,\]]/)) !== null && _c !== void 0 ? _c : line.match(/^\s*\d[\d,]*\s+\d{1,3}%\s+[\d.]+[kKMGT]?B\/s\s+(\d+:\d\d:\d\d)/)) !== null && _d !== void 0 ? _d : line.match(/^\s*\d+K\s+[.\s]+\s\d{1,3}%\s+[\d.]+[KMG]\s+((?:\d+[hms])+)\s*$/);
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
var SIZE = String.raw(templateObject_7 || (templateObject_7 = __makeTemplateObject(["(d[d,]*(?:.d+)?)s?([KMGTP]i?B|[KMGTP](?![a-z])|B\b|bytes?\b)"], ["(\\d[\\d,]*(?:\\.\\d+)?)\\s?([KMGTP]i?B|[KMGTP](?![a-z])|B\\b|bytes?\\b)"])));
var RATE = new RegExp(String.raw(templateObject_8 || (templateObject_8 = __makeTemplateObject(["(d+(?:.d+)?)s?([KMGTP]i?B|[KMGTP]i?b|B|[KMGTP])(?:ps|/s)\b"], ["(\\d+(?:\\.\\d+)?)\\s?([KMGTP]i?B|[KMGTP]i?b|B|[KMGTP])(?:ps|/s)\\b"]))), 'i');
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
    // The work's own line: progress: done/total [unit] [words], or progress: N%, anywhere on a line (after a log's time or level)
    var own = ownOf(line);
    if (own !== undefined) {
        var rest = own;
        var pct = rest.match(/^(\d+(?:\.\d+)?)\s?%/);
        if (pct && Number(pct[1]) <= 100)
            return { pct: pctText(Number(pct[1])), isOwn: true, words: ownWords(rest.slice(pct[0].length)) };
        // done/total with a unit after the total or after both: 3/6 steps, 4.2/10 GB, 4.2 GB / 10 GB, 4.2GB/10GB
        var m = rest.match(/^(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?\s*(?:\/|of)\s*(\d[\d,]*(?:\.\d+)?)\s*([A-Za-z]+)?/);
        if (m) {
            // Its own numbers and unit, as written; a word after the total is its unit only when it is a size or a thing counted
            var _6 = m[1], a = _6 === void 0 ? '' : _6, _7 = m[2], u1 = _7 === void 0 ? '' : _7, _8 = m[3], b = _8 === void 0 ? '' : _8, _9 = m[4], u2 = _9 === void 0 ? '' : _9;
            var na = Number(a.replace(/,/g, ''));
            var nb = Number(b.replace(/,/g, ''));
            var isSizeUnit = function (u) { return /^([KMGTP]i?B|B|bytes?)$/i.test(u); };
            var unit = isSizeUnit(u2) ? u2 : isSizeUnit(u1) ? u1 : u2 && !u1 && (COUNTED.test(u2) || /^[a-z]{3,}s$/i.test(u2)) ? u2 : '';
            var isSize = isSizeUnit(unit);
            if (nb > 0 && na <= nb)
                return { done: isSize ? "".concat(a, " ").concat(unit) : countText(na), total: "".concat(isSize ? b : countText(nb)).concat(unit ? " ".concat(unit) : ''), pct: percentOf(na, nb), rate: rateOf(rest), isOwn: true, words: ownWords(rest.slice(m[0].length)) };
        }
        // A count with no end known, as a wait counts its tries: progress: 7 tries waiting for the deploy
        var so = rest.match(/^(\d[\d,]*)\s+([a-z]{3,})\b/i);
        if (so)
            return { done: "".concat(countText(Number((_a = so[1]) === null || _a === void 0 ? void 0 : _a.replace(/,/g, ''))), " ").concat((_b = so[2]) === null || _b === void 0 ? void 0 : _b.toLowerCase()), isOwn: true, words: ownWords(rest.slice(so[0].length)) };
    }
    // curl's meter: % Total % Received % Xferd Average-speeds Times Current-speed, sizes in 1024s
    var curl = line.match(/^\s*(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+\d{1,3}\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+[-\d:]+\s+[-\d:]+\s+([-\d:]+)\s+(\d[\d.]*[kMGTP]?)\s*$/);
    if (curl) {
        var _10 = curl[2], total = _10 === void 0 ? '' : _10, _11 = curl[3], pct = _11 === void 0 ? '' : _11, _12 = curl[4], done = _12 === void 0 ? '' : _12, _13 = curl[5], timeLeft = _13 === void 0 ? '' : _13, _14 = curl[6], speed = _14 === void 0 ? '' : _14;
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
        return { done: sizeText({ bytes: Number(dots[1]) * 1024, base: 1024 }), pct: "".concat(dots[2], "%"), rate: "".concat(sizeText((_f = sizeOf((_d = (_c = dots[3]) === null || _c === void 0 ? void 0 : _c.slice(0, -1)) !== null && _d !== void 0 ? _d : '0', (_e = dots[3]) === null || _e === void 0 ? void 0 : _e.slice(-1))) !== null && _f !== void 0 ? _f : { bytes: 0, base: 1024 }), "/s"), wget: true };
    // wget, bar style: big.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 55s
    var wget = line.match(/\s(\d{1,3})%\[[=> ]*\]\s+([\d.,]+)([KMGT]?)\s+([\d.]+\s?[KMG]?B\/s)/);
    if (wget)
        return { done: sizeText((_h = sizeOf((_g = wget[2]) !== null && _g !== void 0 ? _g : '0', wget[3])) !== null && _h !== void 0 ? _h : { bytes: 0, base: 1024 }), pct: "".concat(wget[1], "%"), rate: rateOf((_j = wget[4]) !== null && _j !== void 0 ? _j : '', 1024), wget: true };
    // rsync: 1,234,567,890  45%   10.21MB/s    0:00:55
    var rsync = line.match(/^\s*(\d[\d,]*)\s+(\d{1,3})%\s+([\d.]+[kKMGT]?B\/s)\s+\d+:\d\d:\d\d/);
    if (rsync)
        return { done: sizeText({ bytes: Number((_k = rsync[1]) === null || _k === void 0 ? void 0 : _k.replace(/,/g, '')), base: 1000 }), pct: "".concat(rsync[2], "%"), rate: rateOf((_l = rsync[3]) !== null && _l !== void 0 ? _l : '') };
    var seen = pctOf(line);
    var pctSeen = seen && !SCORE.test(line.slice(0, line.indexOf(seen))) ? seen : undefined;
    var hasBar = /[█▉▊▋▌▍▎▏░▒▓━]|#{3,}|\[[=#>.\s-]{3,}\]/.test(line);
    // A count right after a bar is the bar's own (tqdm: 45%|████| 450/1000)
    var barCount = line.match(/%\|(?:[^|]{0,80}\|)?\s*(\d[\d,]*)\/(\d[\d,]*)\b/);
    // A size done of a size in all (tqdm, pip, aws, gsutil, docker, hf): 1.41G/3.00G, 460.1/1024.0 MB, 460.0 MiB/  1.0 GiB, where a
    // percent, a bar or a speed says it moves and it is not how full a memory or a disk is
    var sizes = (_m = line.match(new RegExp(String.raw(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", "s*(?:/|of)s*", ""], ["", "\\s*(?:\\/|of)\\s*", ""])), SIZE, SIZE)))) !== null && _m !== void 0 ? _m : line.match(new RegExp(String.raw(templateObject_10 || (templateObject_10 = __makeTemplateObject(["(d[d,]*(?:.d+)?)()s*/s*", ""], ["(\\d[\\d,]*(?:\\.\\d+)?)()\\s*\\/\\s*", ""])), SIZE)));
    var ahead = line.slice(0, (_o = sizes === null || sizes === void 0 ? void 0 : sizes.index) !== null && _o !== void 0 ? _o : 0);
    var isCountAhead = __spreadArray([], ahead.matchAll(/(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b/g), true).some(function (m) { return COUNTED.test(ahead.slice(0, m.index)); });
    if (sizes && (pctSeen || hasBar || RATE.test(line)) && !HELD.test(ahead) && !isCountAhead) {
        var _15 = sizes[1], a = _15 === void 0 ? '' : _15, _16 = sizes[2], ua = _16 === void 0 ? '' : _16, _17 = sizes[3], b = _17 === void 0 ? '' : _17, _18 = sizes[4], ub = _18 === void 0 ? '' : _18;
        var d = sizeOf(a, ua || ub, 1000);
        var t = sizeOf(b, ub, 1000);
        if (d && t && t.bytes > 0 && d.bytes <= t.bytes * 1.001)
            return { done: sizeText(d), total: sizeText(t), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(d.bytes, t.bytes), rate: rateOf(line.slice(((_p = sizes.index) !== null && _p !== void 0 ? _p : 0) + sizes[0].length)) };
    }
    if (barCount) {
        var a = Number((_q = barCount[1]) === null || _q === void 0 ? void 0 : _q.replace(/,/g, ''));
        var b = Number((_r = barCount[2]) === null || _r === void 0 ? void 0 : _r.replace(/,/g, ''));
        if (b > 0 && a <= b)
            return { done: countText(a), total: countText(b), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // A count toward a total, said whole in brackets ([4/6], (450/1000)), right after what it counts (frame 81/120), or right beside
    // its percent
    var count = line.match(/(?:^|[\s[(:#])(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b(?![/.:]\d)/);
    // (none on a line whose percent is a score: accuracy 95% on 1000/1000 samples)
    if (count && !(seen && !pctSeen)) {
        var before = line.slice(0, ((_s = count.index) !== null && _s !== void 0 ? _s : 0) + (count[0].match(/^[\s[(:#]/) ? 1 : 0));
        var after = line.slice(((_t = count.index) !== null && _t !== void 0 ? _t : 0) + count[0].length);
        var a = Number((_u = count[1]) === null || _u === void 0 ? void 0 : _u.replace(/,/g, ''));
        var b = Number((_v = count[2]) === null || _v === void 0 ? void 0 : _v.replace(/,/g, ''));
        var isBracketed = /[[(]\s*$/.test(before) && /^\s*[\])]/.test(after);
        var around = line.slice(Math.max(0, ((_w = count.index) !== null && _w !== void 0 ? _w : 0) - 12), ((_x = count.index) !== null && _x !== void 0 ? _x : 0) + count[0].length + 12);
        var isBeside = Boolean(pctSeen) && !around.includes('|') && pctOf(around) === pctSeen;
        // or with what it counts after it (Copied 3/6 files), or a bar of brackets after it (Keras: 450/1000 [=====>....])
        var isProgress = isBracketed || isBeside || COUNTED.test(before) || /^\s*(steps?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|fits?)\b/i.test(after) || /^\s*\[[=>.#\s-]{4,}\]/.test(after);
        // with what it counts, said after the count or before it (Processed 9 of 20 files, frame 81/120)
        var unit = (_1 = (_z = (_y = after.match(/^\s*([a-z]{3,}s)\b/i)) === null || _y === void 0 ? void 0 : _y[1]) !== null && _z !== void 0 ? _z : (_0 = before.match(/\b([a-z]{3,}s)\s*[:#]?\s*$/i)) === null || _0 === void 0 ? void 0 : _0[1]) !== null && _1 !== void 0 ? _1 : '';
        // (or said once before it, as a log says step 1200/5000)
        var one = (_3 = (_2 = before.match(/\b([a-z]{3,})\s*[:#]?\s*$/i)) === null || _2 === void 0 ? void 0 : _2[1]) !== null && _3 !== void 0 ? _3 : '';
        var named_1 = unit && COUNTED.test(unit) ? " ".concat(unit.toLowerCase()) : one && !one.endsWith('s') && COUNTED.test("".concat(one, "s")) ? " ".concat(one.toLowerCase(), "s") : '';
        if (isProgress && b > 0 && a <= b)
            return { done: countText(a), total: "".concat(countText(b)).concat(named_1), pct: isBeside ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // Else a percent alone, with any size it says is done (git: Receiving objects: 45% (450/1000), 460.00 MiB | 10.20 MiB/s)
    if (pctSeen) {
        var size = line.match(new RegExp(String.raw(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", "(?!s?/s|ps)"], ["", "(?!\\s?/s|ps)"])), SIZE)));
        var d = size && /[KMGTP]/i.test((_4 = size[2]) !== null && _4 !== void 0 ? _4 : '') ? sizeOf((_5 = size[1]) !== null && _5 !== void 0 ? _5 : '', size[2]) : undefined;
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
            return tidy(__assign(__assign({}, own), { rate: undefined, left: undefined, words: undefined, isEarlier: true }));
    }
    return {};
};
exports.progressOf = progressOf;
var endOf = function (text) {
    var _a, _b;
    var exit = text.match(/\[exited with code ([^\]\n]*)\]\s*$/);
    if (exit)
        return ((_a = exit[1]) === null || _a === void 0 ? void 0 : _a.trim()) === '0' ? { how: 'finished' } : { how: 'failed', code: ((_b = exit[1]) !== null && _b !== void 0 ? _b : '').trim() };
    return /(^|\n)\[killed\]\s*$/.test(text) ? { how: 'killed' } : undefined;
};
exports.endOf = endOf;
var isOutputEnded = function (text) { return Boolean((0, exports.endOf)(text)); };
exports.isOutputEnded = isOutputEnded;
// How long a watch runs before the engine ends it, as the engine said when it started it ("expires in 30m"), in ms
var expiresIn = function (said) {
    var _a;
    var m = said.match(/expires in ((?:\d+(?:\.\d+)?\s?(?:h|m|s)\s*){1,3})/i);
    var seconds = m ? secondsIn(((_a = m[1]) !== null && _a !== void 0 ? _a : '').trim()) : undefined;
    return seconds ? seconds * 1000 : undefined;
};
exports.expiresIn = expiresIn;
// The seconds a run's time left says, as leftText wrote it (`1h 05m left`, `55s left`)
var leftSeconds = function (left) { return (left ? secondsIn(left.replace(/\s*left$/, '').trim()) : undefined); };
exports.leftSeconds = leftSeconds;
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
// The steps a command that only waits is made of: looking, counting, printing and sleeping (each step as split below, a test's or a
// loop's own condition taken as a step of its own)
var LOOKS = /^(?:(?:for|done|fi|break|continue|sleep|wait|kill\s+-0|kill\s+-s\s+0|pgrep|ps|seq|test|\[\[?|\]\]?|:|true|false|exit|date|tail|head|grep|egrep|rg|ls|cat|echo|printf|cut|wc|stat|du|sort|uniq|awk|sed(?!.*\s-i)|jq|cd|pwd|tr)(?:\s|$)|[A-Za-z_]\w*=\S*$|[A-Za-z_]\w*\s*[-+*/%<>]=?\s*\w+$|\d+$|\(+$)/;
// A pgrep's pattern, as plain words: the longest run of it with no pattern signs, so nothing the work wrote is run as a pattern
var pgrepWords = function (pattern) { return pattern.split(/[.*+?^${}()|[\]\\]+/).reduce(function (a, b) { return (b.trim().length > a.length ? b.trim() : a); }, ''); };
// A command whose only job is to wait for a run of the same work to end: the run it waits on, by its process (kill -0, ps -p, wait)
// or by a pgrep that waits for it to be gone. A run that ends wakes the work that started it, so such a wait only holds the next
// step back until its loop comes round (16 Nov: an upload left detached was waited on by five waits in a row, the card saying 40%
// done while it read 100%). A wait for a line in a log, a port or a file is let through: what it waits for comes while the run goes
var ownWaitOf = function (cmd, runs) {
    if (!runs.length)
        return undefined;
    var text = cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&]+)\s*(?:&&|;)\s*/, '');
    // It waits: a loop that sleeps between its tries, or the shell's own wait on a process
    // (found word by word in order, never by one pattern that tries every split of a long script)
    var after = function (from, word) {
        var m = word.exec(text.slice(from));
        return m ? from + m.index + m[0].length : -1;
    };
    var isLoop = [/\b(?:for|while|until)\b/, /\bdo\b/, /\bsleep\s+[\d.]+/, /\bdone\b/].reduce(function (from, word) { return (from < 0 ? -1 : after(from, word)); }, 0) >= 0;
    var isWait = /(?:^|[;&|]\s*)wait\s+\d+\s*(?:$|[;&|])/.test(text);
    if (!isLoop && !isWait)
        return undefined;
    // and does nothing else: no step of its own does work, writes a file, or is sent off on its own
    if (/(?:^|[^>&0-9])>>?\s*(?!\/dev\/null\b|&)\S/.test(unquoted(text)))
        return undefined;
    var steps = unquoted(text)
        .split(/\s*(?:;|&&?|\|\|?|\n|\$\(\(?|\)\)?|`)\s*/)
        .map(function (step) { return step.trim().replace(/^(?:(?:do|then|else|elif|if|while|until|!)\s+)+/, '').replace(/\s*\d?>+\s*\S+/g, '').trim(); })
        .filter(function (step) { return step && !/^(?:do|then|else)$/.test(step); });
    if (!steps.every(function (step) { return LOOKS.test(step); }))
        return undefined;
    // A loop that also waits for a line, a file or an answer waits for what comes while the run goes: its process is only its guard
    var loopText = unquoted(text.slice(0, text.lastIndexOf('done') + 4));
    var isOnlyProcess = !/(?:^|[\s;&|(!])(?:grep|egrep|rg|test|\[\[?|stat|ls|curl|wget|nc|find)\s/.test(loopText);
    var pids = new Set(__spreadArray([], (isOnlyProcess ? text : '').matchAll(/\b(?:kill\s+(?:-0|-s\s+0)|ps\s+(?:-\w+\s+)*-p|wait)\s+(\d+)/g), true).map(function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ''; }));
    // (a pgrep that waits while it finds the run, or until it no longer does; its options that take a value are passed over, and
    // a pattern too short to name one run counts for none)
    var ends = __spreadArray([], text.matchAll(/\b(?:while|until\s+!)\s*pgrep\s+((?:-[uUgGPstF]\s+\S+\s+|-\w+\s+)*)("[^"]+"|'[^']+'|[^\s;&|)]+)/g), true).map(function (m) { var _a; return pgrepWords(((_a = m[2]) !== null && _a !== void 0 ? _a : '').replace(/^["']|["']$/g, '')); })
        .filter(function (words) { return words.length >= 8; });
    return runs.find(function (run) { return (run.pid && pids.has(run.pid)) || ends.some(function (words) { return run.cmd.includes(words); }); });
};
exports.ownWaitOf = ownWaitOf;
// A command made only of what reads and sifts another's output (tail, grep and their kind): left going, it only watches a run and
// ends with nothing. `isFollow` when it follows a file as it grows, so it never ends of itself (16 Nov: pairs of "tail pic_eyes.log"
// and "ugrep wrote" stood silent for an hour and a half under a card and two finished helpers, long after what they watched)
var FILTER = /^(?:\S*\/)?(?:tail|grep|egrep|fgrep|ugrep|rg|awk|sed|cut|tr|head|cat|uniq)\b/;
var watcherOf = function (cmd) {
    var _a, _b;
    if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(cmd))
        return undefined;
    var text = unquoted(cmd.replace(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&]+)\s*(?:&&|;)\s*/, ''));
    // (one that writes a file makes something)
    if (/(?:^|[^>&0-9])>>?\s*(?!\/dev\/null\b|&)\S/.test(text))
        return undefined;
    var steps = text
        .split(/\s*(?:\|\|?|;|&&?)\s*/)
        .map(function (step) { return step.trim().replace(/\s*\d?>+\s*\S+/g, '').replace(/^(?:(?:nohup|setsid|stdbuf\s+-oL)\s+)+/, ''); })
        .filter(Boolean);
    if (!steps.length || !steps.every(function (step) { return FILTER.test(step) && !/\bsed\b.*\s-i\b/.test(step); }))
        return undefined;
    var isFollow = function (step) { return /^(?:\S*\/)?tail\b.*\s(?:-\w*[fF]\w*|--follow\S*)(?:\s|$)/.test(step); };
    // It watches only when it follows a file as it grows, or is a lone grep that sifts what is piped to it: its pattern and nothing
    // more, with only options that change how it matches or prints (a search of a folder, of files or by a file of patterns is work)
    var first = (_a = steps[0]) !== null && _a !== void 0 ? _a : '';
    if (isFollow(first))
        return { isFollow: true };
    var words = first.split(/\s+/).slice(1);
    var isLoneGrep = steps.length === 1 && /^(?:\S*\/)?u?grep$|^(?:\S*\/)?[ef]grep$/.test((_b = first.split(/\s+/)[0]) !== null && _b !== void 0 ? _b : '') && words.every(function (word) { return !word.startsWith('-') || /^-(?:-line-buffered|-color(?:=\w+)?|[EFiovwxH]+)$/.test(word); }) && words.filter(function (word) { return !word.startsWith('-'); }).length === 1;
    return isLoneGrep ? { isFollow: false } : undefined;
};
exports.watcherOf = watcherOf;
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
exports.PS_COLUMNS = 'pid=,ppid=,pgid=,stat=,etime=,rss=,command=';
var procsOf = function (text, now) {
    return text.split('\n').flatMap(function (line) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var full = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+((?:\d+-)?[\d:]+)\s+(\d+)\s+(.*)$/);
        if (full)
            return [{ pid: (_a = full[1]) !== null && _a !== void 0 ? _a : '', ppid: (_b = full[2]) !== null && _b !== void 0 ? _b : '', pgid: (_c = full[3]) !== null && _c !== void 0 ? _c : '', stat: (_d = full[4]) !== null && _d !== void 0 ? _d : '', startAt: now - secondsOf((_e = full[5]) !== null && _e !== void 0 ? _e : '0') * 1000, rss: Number((_f = full[6]) !== null && _f !== void 0 ? _f : 0), command: (_g = full[7]) !== null && _g !== void 0 ? _g : '' }];
        var m = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+((?:\d+-)?[\d:]+)\s+(.*)$/);
        return m ? [{ pid: (_h = m[1]) !== null && _h !== void 0 ? _h : '', ppid: (_j = m[2]) !== null && _j !== void 0 ? _j : '', stat: (_k = m[3]) !== null && _k !== void 0 ? _k : '', startAt: now - secondsOf((_l = m[4]) !== null && _l !== void 0 ? _l : '0') * 1000, command: (_m = m[5]) !== null && _m !== void 0 ? _m : '' }] : [];
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
// Process numbers wrap round past this on macOS
var PID_MOST = 99999;
var inSpan = function (pid, span) { return (span.to >= span.from ? pid > span.from && pid < span.to : pid > span.from || (pid < span.to && pid <= PID_MOST)); };
// The system's own programs, which launchd starts in sessions of their own whenever it likes, are never a command's
var SYSTEM_PROG = /^(\/System\/|\/usr\/libexec\/|\/usr\/sbin\/|\/sbin\/|\/Library\/Apple\/|\/Applications\/|\/Library\/Application Support\/)/;
// What each command left running: the topmost of each group whose shell has gone (or a session it started of its own), with all it
// started under it; never one already followed (`known`), nor what runs under one
// A process counts only when it started while its command ran (or, for one sent to the background, after it began): app helpers
// orphaned long ago keep a dead leader's group, and process numbers come round again within minutes, so a number alone proves
// nothing (a second look on 15 Nov found Claude, Telegram and Discord helpers 20 hours old claimed by a fresh command)
var leftoversOf = function (procs, spans, known, open) {
    if (known === void 0) { known = new Set(); }
    if (open === void 0) { open = []; }
    if (!spans.length)
        return [];
    var pids = new Set(procs.map(function (p) { return p.pid; }));
    var byPid = new Map(procs.map(function (p) { return [p.pid, p]; }));
    // The groups of runs already followed: the rest of a pipeline sent off with `& echo $!` is that run's
    var knownGroups = new Set(procs.filter(function (p) { return known.has(p.pid) && p.pgid; }).map(function (p) { return p.pgid; }));
    var isTimely = function (p, s) { return p.startAt >= s.at - 2000 && (s.until === undefined || p.startAt <= s.until + 2000); };
    // One a command still running may have started waits for that command to end
    // (numbers handed out after it, counted round the wrap)
    var after = function (n, from) { return (n - from + PID_MOST + 1) % (PID_MOST + 1); };
    var isOpenOnes = function (n, p) { return open.some(function (o) { return after(n, o.from) > 0 && after(n, o.from) < 50000 && p.startAt >= o.at - 2000; }); };
    // A process under one already followed is that one's
    var isUnderKnown = function (p) {
        for (var at = p, n = 0; at && n < 64; at = byPid.get(at.ppid), n++)
            if (known.has(at.pid))
                return true;
        return false;
    };
    // The command a number was handed out under; where two ran at once, the one whose words the process holds, else the newest
    var spanOf = function (pid, p, isOwnSession) {
        var fits = spans.filter(function (s) { return inSpan(pid, s) && isTimely(p, s); });
        if (fits.length <= 1)
            return fits[0];
        // A group's leader is its command's own shell, handed its number just after that command's first one: the command whose first
        // number is nearest below is it. A session of its own goes by the words it holds first
        var worded = isOwnSession ? fits.filter(function (s) { return fragmentsOf(s.cmd).some(function (word) { var _a; return p.command.includes((_a = word.split('/').at(-1)) !== null && _a !== void 0 ? _a : word); }); }) : [];
        return (worded.length ? worded : fits).reduce(function (a, b) { return (after(pid, b.from) < after(pid, a.from) ? b : a); });
    };
    var out = [];
    for (var _i = 0, procs_1 = procs; _i < procs_1.length; _i++) {
        var p = procs_1[_i];
        if (p.ppid !== '1' || !p.pgid || known.has(p.pid) || knownGroups.has(p.pgid) || isUnderKnown(p))
            continue;
        var isOwnSession = p.pgid === p.pid;
        if (isOwnSession ? SYSTEM_PROG.test(p.command) : pids.has(p.pgid))
            continue;
        var n = Number(isOwnSession ? p.pid : p.pgid);
        if (isOpenOnes(n, p))
            continue;
        var span = spanOf(n, p, isOwnSession);
        if (span)
            out.push({ span: span.id, top: p, tree: (0, exports.treeOf)(procs, p.pid) });
    }
    return out;
};
exports.leftoversOf = leftoversOf;
// The memory a process and all it started hold, in words (`7.1 GB`); undefined where ps gave none
var memOf = function (tree) {
    var kb = tree.reduce(function (sum, p) { var _a; return sum + ((_a = p.rss) !== null && _a !== void 0 ? _a : 0); }, 0);
    if (!kb)
        return undefined;
    return kb >= 1024 * 1024 ? "".concat((kb / 1024 / 1024).toFixed(1), " GB") : "".concat(Math.max(1, Math.round(kb / 1024)), " MB");
};
exports.memOf = memOf;
// A left run's name when one command left several: its program, its script and the words after it, as `Run python fig4.py page 3`
var leftName = function (command) {
    var words = command.trim().split(/\s+/);
    var at = words.findIndex(function (word) { return /\.(py|sh|js|mjs|ts|rb|pl|R|jl)$/.test(word); });
    var name = (at >= 0 ? __spreadArray([(0, exports.commandName)(command)], words.slice(at + 1, at + 7), true) : [(0, exports.commandName)(command)]).join(' ').trim();
    return "Run ".concat(name.replace(/^Python\b/, 'python')).slice(0, 120);
};
exports.leftName = leftName;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
