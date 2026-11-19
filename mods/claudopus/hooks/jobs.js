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
exports.foldJobs = exports.watcherOf = exports.waitingOf = exports.waitOf = exports.commandName = exports.endedName = exports.labelOf = exports.isWaitOnly = exports.latestOf = exports.tailOf = exports.OUTPUT_LINES = exports.leftSeconds = exports.expiresIn = exports.whyOf = exports.WHY_MOST = exports.logLines = exports.isOutputEnded = exports.endOf = exports.progressOf = exports.leftText = exports.isOwnLongScript = exports.plainOf = exports.PLAIN_MOST = exports.portOf = exports.heavyOf = exports.jobKindOf = exports.isKindSaid = exports.describedOf = exports.DOWNLOAD_CMD = exports.SERVER_CMD = exports.JOB_UNREAD = exports.SILENT_WARN = exports.SILENT_AFTER = exports.JOB_QUIET = exports.JOB_SHAPE = exports.JOB_NOW = exports.JOB_HEAD = exports.JOB_WORD = exports.JOB_GLYPH = exports.JOB_COLOR = exports.JOB_TAIL = exports.JOBS_SHOWN = exports.JOB_NEWS = exports.JOB_LOOK = void 0;
// How often the jobs' output is read, and how often a job that wrote something new counts as news for its card
exports.JOB_LOOK = 5000;
exports.JOB_NEWS = 60000;
// At most this many jobs are rows under one card or helper
exports.JOBS_SHOWN = 4;
// Only the end of each job's output is read
exports.JOB_TAIL = 4000;
// Purple and a round dot are a helper's alone: a job has its own colour and shape, and its kind in words at the head of its row
// (a download and an upload share their blue: the arrow says which way it goes)
// (and a command that runs on another computer is a command's square, hollow: the work is not on this Mac)
exports.JOB_COLOR = { server: '#4EBA65', download: '#5AA7E6', upload: '#5AA7E6', script: '#36B5A8', remote: '#36B5A8', watch: '#9A9A9A' };
exports.JOB_GLYPH = { server: '◆', download: '▼', upload: '▲', script: '■', remote: '□', watch: '◇' };
exports.JOB_WORD = { server: 'Server running', download: 'Downloading', upload: 'Uploading', script: 'Command running', remote: 'Running on another computer', watch: 'Watching' };
exports.JOB_HEAD = { server: 'Server', download: 'Download', upload: 'Upload', script: 'Command', remote: 'Remote command', watch: 'Watch' };
// What a row says while its command gives no plain word of its own: its kind, as a doing word
exports.JOB_NOW = { server: 'Serving', download: 'Downloading', upload: 'Uploading', script: 'Running', remote: 'Running on another computer', watch: 'Watching' };
// Its mark on the tree, drawn: a square, a diamond, a down arrow, an open diamond, never a helper's round dot
exports.JOB_SHAPE = { server: 'diamond', download: 'down', upload: 'up', script: 'square', remote: 'hollow', watch: 'open' };
// A job whose output has not changed for this long says, in amber, that it has gone quiet, and one that has printed nothing at all
// says so: work is told to print progress at least every 10 seconds, so a few minutes of nothing is worth a look
exports.JOB_QUIET = 3 * 60000;
// A run that has given no word this long says so on its row, in amber. Its work is told to look at it after a minute, but on 16 Nov
// 79 runs drew that notice and none was stuck (tests, builds, installs, cloud jobs; one quiet 20 minutes ended well), and a count of
// seconds before then said nothing a still percent does not ("nothing printed for 5 seconds, 10 seconds" was useless)
exports.SILENT_AFTER = 3 * 60000;
exports.SILENT_WARN = 60000;
// A job whose output has not been found this long after it started says so on its row
exports.JOB_UNREAD = 60000;
exports.SERVER_CMD = /\b(http\.server|http-server|uvicorn|gunicorn|hypercorn|flask run|runserver|vite( dev| preview)?|next (dev|start)|(npm|pnpm|yarn|bun) (run )?(dev|start|serve|preview)|rails s(erver)?|jupyter (lab|notebook)|ollama serve|tensorboard|serve -[sl]|python3? -m (http\.server|uvicorn))\b/i;
exports.DOWNLOAD_CMD = /\b(curl|wget|aria2c|huggingface-cli download|hf download|git clone|git lfs (pull|fetch)|rsync|scp|gsutil (-m )?cp|aws s3 (cp|sync)|pip3? install|uv (pip )?(install|sync)|npm (i|install|ci)|pnpm (i|install)|yarn install|brew install|docker pull|yt-dlp|azcopy (copy|cp|sync)|gh release download|gh run download|az storage (blob|file) (download|upload)(-batch)?|python3? -m pip install)\b/i;
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
// nothing from the command: its kind first (Download, Upload, Watch, Serve, Run), then what it does: `Download the CT scans`
var KIND_WORDS = [
    [/^upload\b/i, 'upload'],
    [/^(download|fetch|copy|sync|clone|install)\b/i, 'download'],
    [/^(watch|wait(ing)?|poll(ing)?)\b/i, 'watch'],
    [/^serve\b/i, 'server'],
    // (the plain verb for what a command does says its kind as Run does: its row leads with it, and says Building, Testing while it goes)
    [/^(run|build|test|render|train|deploy|make|convert|compute|fit|check|verify|draw|measure|export|index|compress|extract)\b/i, 'script'],
];
var describedOf = function (what) {
    var _a;
    // (a time in brackets at its end, as descriptions once carried, is no part of what it does: a row never says a guessed time)
    var text = what.replace(new RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["s*((?:about|around|roughly|up to|~)?s*(?:d+(?:.d+)?s*[-\u2013]s*)?", ")s*$"], ["\\s*\\((?:about|around|roughly|up to|~)?\\s*(?:\\d+(?:\\.\\d+)?\\s*[-\u2013]\\s*)?", "\\)\\s*$"])), TIME), 'i'), '').trim();
    return { text: text, kind: (_a = KIND_WORDS.find(function (_a) {
            var re = _a[0];
            return re.test(text);
        })) === null || _a === void 0 ? void 0 : _a[1] };
};
exports.describedOf = describedOf;
// Words that lead a run's own name and say its kind already, so its row does not say it twice
var isKindSaid = function (label) { return KIND_WORDS.some(function (_a) {
    var re = _a[0];
    return re.test(label.trim());
}); };
exports.isKindSaid = isKindSaid;
// A program that only looks at or opens what is on this Mac is never a download, whatever folder it names (find Downloads)
var LOCAL_TOOL = /^(?:\/\S*\/)?(?:find|fd|grep|egrep|rg|ag|ls|cat|head|tail|less|open|mdfind|stat|file|du|wc|sed|awk|sort|tree|cp|mv|rm|mkdir|touch|cd|echo|printf|test|pwd|code|unzip|tar|shasum)\b/;
var isLocalTool = function (step) { return LOCAL_TOOL.test(step); };
// Else, for words written another way or none, its kind is told from its command
// A command whose own program runs the work on another computer (ssh, a cloud job it starts or follows, a cluster's queue) is a
// remote command, whatever verb its words lead with: what it does is not on this Mac
var REMOTE_CMD = /^(?:\S*\/)?(?:ssh\s+(?!-V\b)|az\s+(?:ml\s+job\s+(?:create|stream)|batch\s|vm\s+run-command|container\s+exec|acr\s+build)|gcloud\s+(?:compute\s+ssh|ai\s|run\s+jobs|builds\s+submit|batch\s)|aws\s+(?:batch|sagemaker|ssm\s+start-session)\s|kubectl\s+(?:exec|run)\s|modal\s+run\s|sbatch\b|srun\b)/;
var isRemote = function (cmd) { return stepsOf(cmd).some(function (step) { return REMOTE_CMD.test(step); }); };
var jobKindOf = function (cmd, label) {
    var said = (0, exports.describedOf)(label).kind;
    if (said)
        return said === 'script' && isRemote(cmd) ? 'remote' : said;
    if (exports.SERVER_CMD.test(cmd) || /\bserver\b/i.test(label))
        return 'server';
    if (!CHECKS.test(label.trim()) && (stepsOf(cmd).some(isFetching) || (/\bdownload(?:ing|ed)?\b/i.test(label) && !stepsOf(cmd).every(isLocalTool))))
        return 'download';
    return isRemote(cmd) ? 'remote' : 'script';
};
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
var BROWSER_STEP = /^(?:(?:npx|pnpm(?: exec| dlx)?|yarn|bunx|uvx)\s+(?:-\S+\s+)*)?(?:playwright\b(?!\s+install\b)|puppeteer\b|shot-scraper\b|capture-website\b|pageres\b|wkhtmltoimage\b|chrome-headless-shell\b|(?:chromium(?:-browser)?|google-chrome(?:-stable)?|Google Chrome(?: for Testing| Canary)?|Chromium|Microsoft Edge|Brave Browser)\s.*--(?:headless|screenshot|print-to-pdf|dump-dom)\b)/;
var BROWSER_SCRIPT = /\bfrom\s+['"](?:playwright|@playwright\/test|puppeteer(?:-core)?)['"]|\brequire\(\s*['"](?:playwright|puppeteer(?:-core)?)['"]\s*\)|\bimport\s*\{[^}]*\b(?:chromium|firefox|webkit)\b[^}]*\}\s*from\s*['"][^'"]*playwright[^'"]*['"]|\bfrom\s+playwright\.(?:sync|async)_api\s+import\b|\b(?:chromium|puppeteer)\.launch\(|\bpyppeteer\b|\bselenium\.webdriver\b/;
var BUILD_STEP = /^(?:(?:npx|bunx)\s+)?(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?build\b|next\s+build\b|vite\s+build\b|astro\s+build\b|nuxt\s+build\b|remix\s+build\b|webpack\b|rollup\b|turbo\s+(?:run\s+)?build\b|cargo\s+build\b|xcodebuild\b|swift\s+build\b|go\s+build\b|docker\s+(?:buildx\s+)?build\b|gradlew?\s|mvn\s|make\b(?=.*\s-j)|cmake\s+--build\b|bazel\s+build\b|expo\s+export\b)/;
var RENDER_STEP = /^(?:(?:npx|pnpm(?: exec| dlx)?|bunx)\s+(?:-\S+\s+)*)?(?:ffmpeg\b|remotion\s+render\b|hyperframes\s+render\b|blender\b.*\s(?:-b|--background)\b|manim\b|povray\b)/;
// A script a step runs with an interpreter, for the browser it may drive
// A script a step runs with an interpreter, for the browser it may drive: a file it names, or code given on its own line
var INTERPRETED = /^(?:(?:npx|pnpm\s+(?:exec|dlx)|bunx)\s+(?:-\S+\s+)*)?(?:node|bun|deno(?:\s+run)?|tsx|ts-node|python3?|uv\s+run(?:\s+python3?)?)\b/;
// What never ends to make room is no heavy command, as a server is not: a build or test that watches, a report or test window it
// serves, a recorder of clicks
var ENDLESS = /(?:\s--watch\b|\s-w\b|\s--ui\b|\bserve\b|\bshow-report\b|\bshow-trace\b|\bcodegen\b|\bdev\b)/;
// A look that is over in a moment: a program's version or help, one frame taken out of a video
var MOMENT = /\s(?:-version|-h|-help|--help|-codecs|-formats|-encoders|-decoders|-filters|-frames:v\s+1|-vframes\s+1)\b/;
var MOD_OWN = /(?:^|\/)bin\/release\b|\bguard\.mjs\b|\bplugin\s+(?:test|validate)\b|\bsrc\/claudopus\/build\.mjs\b/;
var heavyOf = function (cmd, scripts) {
    if (scripts === void 0) { scripts = []; }
    // The mod's own runners anywhere in it, by their paths as written: the release runs builds and tests of its own and is never held
    if (MOD_OWN.test(cmd))
        return '';
    // Each step by its own program's name, its folder taken off, quoted, escaped or not: "/Applications/Google Chrome.app/.../Google Chrome" --headless
    var steps = stepsOf(cmd.replace(/\\ /g, '\u0000'))
        .map(function (step) { return step.replace(/^"[^"]*\/([^"/]+)"/, '$1').replace(/^'[^']*\/([^'/]+)'/, '$1').replace(/^[^\s"']*\//, '').replace(/\u0000/g, ' '); })
        .filter(function (step) { return !ENDLESS.test(step) && !MOMENT.test(step); });
    var isBrowserScript = steps.some(function (step) { return INTERPRETED.test(step); }) && __spreadArray([cmd], scripts, true).some(function (text) { return BROWSER_SCRIPT.test(text); });
    if (steps.some(function (step) { return BROWSER_STEP.test(step); }) || isBrowserScript)
        return 'browser';
    if (steps.some(function (step) { return exports.SERVER_CMD.test(step); }))
        return steps.some(function (step) { return RENDER_STEP.test(step); }) ? 'render' : steps.some(function (step) { return BUILD_STEP.test(step) && !exports.SERVER_CMD.test(step); }) ? 'build' : '';
    if (steps.some(function (step) { return RENDER_STEP.test(step); }))
        return 'render';
    if (steps.some(function (step) { return BUILD_STEP.test(step); }))
        return 'build';
    return '';
};
exports.heavyOf = heavyOf;
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
// (a failure's reason is shown as written, so only what names a secret itself is kept out of it)
var SECRETISH_WHY = /\b(pass(?:word|phrase|wd|code)?s?|secrets?|tokens?|api[-_ ]?keys?|bearer|authori[sz]ation|credentials?|otp|2fa|mfa|ssh-(?:rsa|ed25519))\b|\b(?:sk|pk|ghp|gho|xox[abp])[-_][A-Za-z0-9]{8,}/i;
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
// A long command of the work's own script: a file it runs, as read, asked for with a long time limit. False for any other: a short
// one, a watch or a server, or a program that is no script of its own (a long time limit alone says nothing: most such calls are a
// push, a short test or a look). The mod's own runners are never told from here. What the script prints is not looked at
var isOwnLongScript = function (command, description, scripts, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 0; }
    if (/\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(command))
        return false;
    var said = (0, exports.describedOf)(description);
    if (said.kind === 'server' || said.kind === 'watch' || exports.SERVER_CMD.test(command))
        return false;
    return timeoutMs > 2 * 60000 && scripts.length > 0;
};
exports.isOwnLongScript = isOwnLongScript;
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
// A unit of time: a `progress:` line counts things done, never seconds or minutes, and a row ignores one that counts time
var TIME_UNIT = /^(?:s|secs?|seconds?|m|mins?|minutes?|h|hrs?|hours?|ms)$/i;
var ownOf = function (line) {
    var _a;
    var m = line.match(/(?:^|[\s\]|[])progress:\s*(.*)$/i);
    return m && !/\bno\s+progress:/i.test(line) ? ((_a = m[1]) !== null && _a !== void 0 ? _a : '') : undefined;
};
// The progress one line shows, or undefined
var lineProgress = function (line) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
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
            var _7 = m[1], a = _7 === void 0 ? '' : _7, _8 = m[2], u1 = _8 === void 0 ? '' : _8, _9 = m[3], b = _9 === void 0 ? '' : _9, _10 = m[4], u2 = _10 === void 0 ? '' : _10;
            if (TIME_UNIT.test(u1) || TIME_UNIT.test(u2))
                return undefined;
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
        if (so && TIME_UNIT.test((_a = so[2]) !== null && _a !== void 0 ? _a : ''))
            return undefined;
        if (so)
            return { done: "".concat(countText(Number((_b = so[1]) === null || _b === void 0 ? void 0 : _b.replace(/,/g, ''))), " ").concat((_c = so[2]) === null || _c === void 0 ? void 0 : _c.toLowerCase()), isOwn: true, words: ownWords(rest.slice(so[0].length)) };
    }
    // curl's meter: % Total % Received % Xferd Average-speeds Times Current-speed, sizes in 1024s
    var curl = line.match(/^\s*(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+(\d{1,3})\s+(\d[\d.]*[kMGTP]?)\s+\d{1,3}\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+\d[\d.]*[kMGTP]?\s+[-\d:]+\s+[-\d:]+\s+([-\d:]+)\s+(\d[\d.]*[kMGTP]?)\s*$/);
    if (curl) {
        var _11 = curl[2], total = _11 === void 0 ? '' : _11, _12 = curl[3], pct = _12 === void 0 ? '' : _12, _13 = curl[4], done = _13 === void 0 ? '' : _13, _14 = curl[5], timeLeft = _14 === void 0 ? '' : _14, _15 = curl[6], speed = _15 === void 0 ? '' : _15;
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
        return { done: sizeText({ bytes: Number(dots[1]) * 1024, base: 1024 }), pct: "".concat(dots[2], "%"), rate: "".concat(sizeText((_g = sizeOf((_e = (_d = dots[3]) === null || _d === void 0 ? void 0 : _d.slice(0, -1)) !== null && _e !== void 0 ? _e : '0', (_f = dots[3]) === null || _f === void 0 ? void 0 : _f.slice(-1))) !== null && _g !== void 0 ? _g : { bytes: 0, base: 1024 }), "/s"), wget: true };
    // wget, bar style: big.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 55s
    var wget = line.match(/\s(\d{1,3})%\[[=> ]*\]\s+([\d.,]+)([KMGT]?)\s+([\d.]+\s?[KMG]?B\/s)/);
    if (wget)
        return { done: sizeText((_j = sizeOf((_h = wget[2]) !== null && _h !== void 0 ? _h : '0', wget[3])) !== null && _j !== void 0 ? _j : { bytes: 0, base: 1024 }), pct: "".concat(wget[1], "%"), rate: rateOf((_k = wget[4]) !== null && _k !== void 0 ? _k : '', 1024), wget: true };
    // rsync: 1,234,567,890  45%   10.21MB/s    0:00:55
    var rsync = line.match(/^\s*(\d[\d,]*)\s+(\d{1,3})%\s+([\d.]+[kKMGT]?B\/s)\s+\d+:\d\d:\d\d/);
    if (rsync)
        return { done: sizeText({ bytes: Number((_l = rsync[1]) === null || _l === void 0 ? void 0 : _l.replace(/,/g, '')), base: 1000 }), pct: "".concat(rsync[2], "%"), rate: rateOf((_m = rsync[3]) !== null && _m !== void 0 ? _m : '') };
    var seen = pctOf(line);
    var pctSeen = seen && !SCORE.test(line.slice(0, line.indexOf(seen))) ? seen : undefined;
    var hasBar = /[█▉▊▋▌▍▎▏░▒▓━]|#{3,}|\[[=#>.\s-]{3,}\]/.test(line);
    // A count right after a bar is the bar's own (tqdm: 45%|████| 450/1000)
    var barCount = line.match(/%\|(?:[^|]{0,80}\|)?\s*(\d[\d,]*)\/(\d[\d,]*)\b/);
    // A size done of a size in all (tqdm, pip, aws, gsutil, docker, hf): 1.41G/3.00G, 460.1/1024.0 MB, 460.0 MiB/  1.0 GiB, where a
    // percent, a bar or a speed says it moves and it is not how full a memory or a disk is
    var sizes = (_o = line.match(new RegExp(String.raw(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", "s*(?:/|of)s*", ""], ["", "\\s*(?:\\/|of)\\s*", ""])), SIZE, SIZE)))) !== null && _o !== void 0 ? _o : line.match(new RegExp(String.raw(templateObject_10 || (templateObject_10 = __makeTemplateObject(["(d[d,]*(?:.d+)?)()s*/s*", ""], ["(\\d[\\d,]*(?:\\.\\d+)?)()\\s*\\/\\s*", ""])), SIZE)));
    var ahead = line.slice(0, (_p = sizes === null || sizes === void 0 ? void 0 : sizes.index) !== null && _p !== void 0 ? _p : 0);
    var isCountAhead = __spreadArray([], ahead.matchAll(/(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b/g), true).some(function (m) { return COUNTED.test(ahead.slice(0, m.index)); });
    if (sizes && (pctSeen || hasBar || RATE.test(line)) && !HELD.test(ahead) && !isCountAhead) {
        var _16 = sizes[1], a = _16 === void 0 ? '' : _16, _17 = sizes[2], ua = _17 === void 0 ? '' : _17, _18 = sizes[3], b = _18 === void 0 ? '' : _18, _19 = sizes[4], ub = _19 === void 0 ? '' : _19;
        var d = sizeOf(a, ua || ub, 1000);
        var t = sizeOf(b, ub, 1000);
        if (d && t && t.bytes > 0 && d.bytes <= t.bytes * 1.001)
            return { done: sizeText(d), total: sizeText(t), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(d.bytes, t.bytes), rate: rateOf(line.slice(((_q = sizes.index) !== null && _q !== void 0 ? _q : 0) + sizes[0].length)) };
    }
    if (barCount) {
        var a = Number((_r = barCount[1]) === null || _r === void 0 ? void 0 : _r.replace(/,/g, ''));
        var b = Number((_s = barCount[2]) === null || _s === void 0 ? void 0 : _s.replace(/,/g, ''));
        if (b > 0 && a <= b)
            return { done: countText(a), total: countText(b), pct: pctSeen !== null && pctSeen !== void 0 ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // A count toward a total, said whole in brackets ([4/6], (450/1000)), right after what it counts (frame 81/120), or right beside
    // its percent
    var count = line.match(/(?:^|[\s[(:#])(\d[\d,]*)\s?(?:\/|of)\s?(\d[\d,]*)\b(?![/.:]\d)/);
    // (none on a line whose percent is a score: accuracy 95% on 1000/1000 samples)
    if (count && !(seen && !pctSeen)) {
        var before = line.slice(0, ((_t = count.index) !== null && _t !== void 0 ? _t : 0) + (count[0].match(/^[\s[(:#]/) ? 1 : 0));
        var after = line.slice(((_u = count.index) !== null && _u !== void 0 ? _u : 0) + count[0].length);
        var a = Number((_v = count[1]) === null || _v === void 0 ? void 0 : _v.replace(/,/g, ''));
        var b = Number((_w = count[2]) === null || _w === void 0 ? void 0 : _w.replace(/,/g, ''));
        var isBracketed = /[[(]\s*$/.test(before) && /^\s*[\])]/.test(after);
        var around = line.slice(Math.max(0, ((_x = count.index) !== null && _x !== void 0 ? _x : 0) - 12), ((_y = count.index) !== null && _y !== void 0 ? _y : 0) + count[0].length + 12);
        var isBeside = Boolean(pctSeen) && !around.includes('|') && pctOf(around) === pctSeen;
        // or with what it counts after it (Copied 3/6 files), or a bar of brackets after it (Keras: 450/1000 [=====>....])
        var isProgress = isBracketed || isBeside || COUNTED.test(before) || /^\s*(steps?|frames?|epochs?|batch(es)?|files?|items?|chunks?|parts?|samples?|images?|scans?|cases?|jobs?|tasks?|runs?|shards?|pages?|rows?|records?|subjects?|volumes?|layers?|objects?|blobs?|videos?|clips?|meshes|fits?)\b/i.test(after) || /^\s*\[[=>.#\s-]{4,}\]/.test(after);
        // with what it counts, said after the count or before it (Processed 9 of 20 files, frame 81/120)
        var unit = (_2 = (_0 = (_z = after.match(/^\s*([a-z]{3,}s)\b/i)) === null || _z === void 0 ? void 0 : _z[1]) !== null && _0 !== void 0 ? _0 : (_1 = before.match(/\b([a-z]{3,}s)\s*[:#]?\s*$/i)) === null || _1 === void 0 ? void 0 : _1[1]) !== null && _2 !== void 0 ? _2 : '';
        // (or said once before it, as a log says step 1200/5000)
        var one = (_4 = (_3 = before.match(/\b([a-z]{3,})\s*[:#]?\s*$/i)) === null || _3 === void 0 ? void 0 : _3[1]) !== null && _4 !== void 0 ? _4 : '';
        var named_1 = unit && COUNTED.test(unit) ? " ".concat(unit.toLowerCase()) : one && !one.endsWith('s') && COUNTED.test("".concat(one, "s")) ? " ".concat(one.toLowerCase(), "s") : '';
        if (isProgress && b > 0 && a <= b)
            return { done: countText(a), total: "".concat(countText(b)).concat(named_1), pct: isBeside ? pctSeen : percentOf(a, b), rate: rateOf(line) };
    }
    // Else a percent alone, with any size it says is done (git: Receiving objects: 45% (450/1000), 460.00 MiB | 10.20 MiB/s)
    if (pctSeen) {
        var size = line.match(new RegExp(String.raw(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", "(?!s?/s|ps)"], ["", "(?!\\s?/s|ps)"])), SIZE)));
        var d = size && /[KMGTP]/i.test((_5 = size[2]) !== null && _5 !== void 0 ? _5 : '') ? sizeOf((_6 = size[1]) !== null && _6 !== void 0 ? _6 : '', size[2]) : undefined;
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
// A log's lines as its tab shows them: no colour codes, a line redrawn in place as it last stood, and without the engine's own
// last line or the blank lines before it
var logLines = function (text) {
    var _a, _b;
    var lines = text
        .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
        .replace(/\x1b\][^\x07]*\x07/g, '')
        .replace(/\n?\[(?:exited with code [^\]\n]*|killed)\]\s*$/, '')
        .split('\n')
        .map(function (line) { var _a; return ((_a = line.split('\r').filter(function (part) { return part.trim(); }).at(-1)) !== null && _a !== void 0 ? _a : '').replace(/\s+$/, ''); });
    while (lines.length && !((_a = lines.at(-1)) === null || _a === void 0 ? void 0 : _a.trim()))
        lines.pop();
    while (lines.length && !((_b = lines[0]) === null || _b === void 0 ? void 0 : _b.trim()))
        lines.shift();
    return lines;
};
exports.logLines = logLines;
// Why a command failed, from the end of its output: the last line that names an error, or else the last line it wrote, as it
// wrote it and cut short. Nothing for a line that names a password, key or login, or where it wrote nothing
var FAULT = /\b(?:error|errno|exception|traceback|fatal|failed|failure|cannot|can't|couldn't|could not|unable|denied|refused|not found|no such|missing|invalid|unexpected|timed? ?out|killed|out of memory|oom|panic|abort(?:ed)?|segmentation)\b/i;
exports.WHY_MOST = 120;
var whyOf = function (text) {
    var _a, _b;
    var lines = text
        .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
        .replace(/\[exited with code [^\]\n]*\]\s*$/, '')
        .split('\n')
        .map(function (line) { var _a; return ((_a = line.split('\r').map(function (part) { return part.trim(); }).filter(Boolean).at(-1)) !== null && _a !== void 0 ? _a : '').replace(/\s+/g, ' '); })
        .filter(function (line) { return /[A-Za-z]{3}/.test(line); })
        .slice(-12);
    // (a traceback's own heading, or a line that only points at code, says nothing of why)
    var said = lines.filter(function (line) { return !/^Traceback \(most recent call last\)|^\s*at\s+\S+\s+\(|^File "|^\^+$/.test(line); });
    var line = (_b = (_a = __spreadArray([], said, true).reverse().find(function (one) { return FAULT.test(one); })) !== null && _a !== void 0 ? _a : said.at(-1)) !== null && _b !== void 0 ? _b : '';
    if (!line || SECRETISH_WHY.test(line))
        return '';
    return line.length > exports.WHY_MOST ? "".concat(line.slice(0, exports.WHY_MOST - 1).replace(/\s+\S*$/, ''), "\u2026") : line;
};
exports.whyOf = whyOf;
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
// An ended command's name: its own words whole, as its row had them while it ran, or what it ran in a few words where it gave
// none. One kept without its command has only `what`, its words or else the head of its shell line: words stay as they are, and
// only what reads as a shell line is named by what it runs (19 Nov: every kept name was read as a shell line, so "Testing the card
// tests" stood as "Testing the" and "Run the full check" as "Run the")
var SHELLISH = /&&|\|\||[;|$=<>`]|\s-{1,2}\w|(?:^|\s)(?:\.{0,2}|~)\/\S|^(?:cd|until|while|for|if|export|source|bash|sh|zsh|python3?|node|npm|npx|pnpm|git|curl|az|ssh)\s/;
var endedName = function (what, cmd) {
    var words = (0, exports.describedOf)(what).text;
    if (cmd === null || cmd === void 0 ? void 0 : cmd.trim())
        return (0, exports.labelOf)(words, cmd) || 'A command';
    return (SHELLISH.test(words) ? (0, exports.commandName)(words) : words) || words || 'A command';
};
exports.endedName = endedName;
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
// What only looks at how something stands, counts or prints: a step made of these does no work
var LOOKS = /^(?:\S*\/)?(?:for|while|until|select|if|elif|then|else|fi|do|done|case|esac|break|continue|sleep|wait|kill\s+-(?:0|s\s+0)|pgrep|pidof|ps|lsof|seq|test|\[\[?|\]\]?|:|true|false|exit|return|date|tail|head|grep|egrep|fgrep|ugrep|rg|ls|cat|echo|printf|cut|wc|stat|du|df|sort|uniq|awk|sed(?!.*\s-i)|jq|cd|pwd|tr|find|file|nc|ping|host|dig|nvidia-smi|squeue|qstat|sacct|expr|bc|basename|dirname|realpath|readlink|let|read|local|export|set|shift|osascript\s+-e\s+""|(?:ba|z|da)?sh(?:\s+-\w+)*(?:\s+"")?|ssh\s(?:[^"]*\s)?"")(?:\s|$)|^curl\s(?![^]*?(?:\s-[a-zA-Z]*[oOTd]\b|\s-X\s*(?:POST|PUT|PATCH|DELETE)|--(?:output|upload-file|data\S*|form|remote-name)\b))|^[A-Za-z_]\w*=\S*$|^[A-Za-z_]\w*\s*(?:[-+*/%<>]=?|\+\+|--)\s*\w*$|^\d+$|^!$/;
// Programs that only report how a job elsewhere stands (a run on GitHub, a cloud job, a container)
var STATUS = /^(?:\S*\/)?(?:gh\s+(?:run|pr|api|workflow)\s+(?:view|list|checks|status|get|\S+\/)|gh\s+api|az\s+.*\b(?:show|list|status)\b|aws\s+.*\b(?:describe|get|list)\b|gcloud\s+.*\b(?:describe|list)\b|kubectl\s+(?:get|describe|logs)|docker\s+(?:ps|inspect|logs)|git\s+(?:status|log|ls-remote|fetch|rev-parse))\b/;
// Tools made to wait for something, as the program of a step
var WAITERS = /^(?:\S*\/)?(?:watch|inotifywait|fswatch|wait4path|wait-on)(?:\s+(?!-(?:-version|-help|h|v)\b)|$)|^(?:npx\s+(?:-y\s+)?)?wait-on\b|^(?:\S*\/)?gh\s+(?:run\s+watch|pr\s+checks\b.*--watch)|^(?:\S*\/)?(?:kubectl|docker)\s+wait\b|^(?:\S*\/)?kubectl\s+rollout\s+status\b|^(?:\S*\/)?(?:az|aws)\s+(?:\S+\s+)*wait\b|^(?:\S*\/)?caffeinate\s+(?:-\w+\s+)*-[wt]\b|^(?:\S*\/)?g?timeout\s+\S+\s+(?:\S*\/)?tail\s.*-[fF]|^(?:\S*\/)?less\s+\+F|^(?:\S*\/)?curl\s.*--retry-(?:all-errors|connrefused)|^(?:\S*\/)?wget\s.*(?:--retry-connrefused|--waitretry)/;
// A log followed until one line comes, by any program that follows one: a wait for that line
var FOLLOW_UNTIL = /(?:\btail\b[^|;&]*\s(?:-\w*[fF]\w*|--follow\S*)|\b(?:docker|kubectl)\s+(?:\S+\s+)*logs\b[^|;&]*\s(?:-f|--follow)\b|\bjournalctl\b[^|;&]*\s(?:-f|--follow)\b)(?:[^;&|]|\d?>&\d?|&>)*\|\s*(?:(?:\S*\/)?(?:grep|egrep|ugrep|rg)\b[^|;&]*\s(?:-\w*[mq]|--max-count|--quiet)|(?:awk|gawk)\b[^|;&]*\bexit\b|sed\b[^|;&]*\bq\b|while\s+read\b[^]*\bbreak\b)/;
// The code a command hands an interpreter: the shell's own line with every quoted word and here-document blanked, and each script
// it gives a shell, Python, Node, Perl or Ruby inline (-c, -e, a here-document, ssh's remote command, a script it writes and runs
// in the same command), so words quoted for show never count
var INTERPRETER = /(?:^|[\s;&|(])(?:\S*\/)?(?:(?:ba|z|da)?sh|python\d?(?:\.\d+)?|node|perl|ruby|ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+\S+)(?:\s+-\w+)*\s*$/;
var escaped = function (text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
var codesOf = function (cmd, depth) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (depth === void 0) { depth = 0; }
    var inline = [];
    var written = [];
    var shell = '';
    var i = 0;
    while (i < cmd.length) {
        var c = (_a = cmd[i]) !== null && _a !== void 0 ? _a : '';
        // A here-document: its body is code when what reads it is an interpreter, or a file the command then runs
        var here = c === '<' ? /^<<-?\s*(['"]?)(\w+)\1[^\n]*\n/.exec(cmd.slice(i)) : null;
        if (here) {
            var end = cmd.indexOf("\n".concat(here[2]), i + here[0].length);
            var body = cmd.slice(i + here[0].length, end < 0 ? cmd.length : end);
            var line = ((_b = shell.slice(-300).split('\n').at(-1)) !== null && _b !== void 0 ? _b : '') + ((_c = here[0].split('\n')[0]) !== null && _c !== void 0 ? _c : '').replace(/^<<-?\s*(['"]?)\w+\1/, '');
            var into = /(?:\bcat|\btee(?:\s+-a)?)\s*(?:>>?\s*)?([^\s<>]+)\s*$|\bcat\s+>>?\s*([^\s<>]+)/.exec(line);
            if (INTERPRETER.test(line.replace(/\s+-\s*$/, '')) || /(?:python\d?(?:\.\d+)?|node|perl|ruby|(?:ba|z)?sh)(?:\s+-\w+)*\s+-\s*$/.test(line))
                inline.push(body);
            else if (into)
                written.push({ file: ((_e = (_d = into[1]) !== null && _d !== void 0 ? _d : into[2]) !== null && _e !== void 0 ? _e : '').replace(/^["']|["']$/g, ''), body: body });
            shell += ' "" \n';
            i = end < 0 ? cmd.length : end + ((_g = (_f = here[2]) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) + 1;
            continue;
        }
        if (c === "'" || c === '"') {
            var j = i + 1;
            while (j < cmd.length && cmd[j] !== c)
                j += cmd[j] === '\\' && c === '"' ? 2 : 1;
            var body = cmd.slice(i + 1, j);
            // Code when it follows -c or -e of an interpreter (-lc, -xc alike), or is ssh's remote command
            var before = body.trim().length > 2 ? shell.slice(-300).replace(/\s+$/, '') : '';
            if (before && (/(?:^|[\s;&|(])eval$/.test(before) || /(?:^|[\s;&|(])(?:\S*\/)?(?:(?:ba|z|da)?sh|python\d?(?:\.\d+)?|node|perl|ruby|osascript)(?:\s+-\w+)*\s+-\w*[ce]$/.test(before) || /(?:^|[\s;&|(])ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+[^\s-]\S*$/.test(before)))
                inline.push(body);
            shell += '""';
            i = j + 1;
            continue;
        }
        shell += c;
        i += 1;
    }
    // A script it wrote here and runs here is read as it was written
    for (var _i = 0, written_1 = written; _i < written_1.length; _i++) {
        var one = written_1[_i];
        if (one.file && new RegExp("(?:^|[\\s;&|(])(?:(?:\\S*\\/)?(?:python\\d?(?:\\.\\d+)?|node|perl|ruby|(?:ba|z)?sh|\\.)\\s+)?".concat(escaped(one.file), "(?:\\s|$)")).test(shell.replace(/(?:cat|tee)[^\n]*""/g, '')))
            inline.push(one.body);
    }
    // A shell inside a shell is read as one, once more
    var nested = depth < 3 ? inline.filter(function (code) { return !/\b(?:import|def|const|let|var|require|print|use|setTimeout|setInterval|delay|until\s+-e)\b|=>|\w\.\w+\(/.test(code); }).map(function (code) { return codesOf(code, depth + 1); }) : [];
    return { shell: __spreadArray([shell], nested.map(function (one) { return one.shell; }), true).join('\n'), inline: __spreadArray(__spreadArray([], inline, true), nested.flatMap(function (one) { return one.inline; }), true) };
};
// A time to sleep, in seconds, as a shell's sleep or read -t, or a script's sleep or timer writes it; one given by a variable or a
// sum counts as long
var sleepSeconds = function (amount, unit) {
    var _a;
    if (unit === void 0) { unit = ''; }
    return (/^\d+(?:\.\d+)?(?:e\d+)?$/.test(amount) ? Number(amount) * ((_a = { m: 60, h: 3600, d: 86400 }[unit]) !== null && _a !== void 0 ? _a : 1) : Infinity);
};
var LONGEST_SLEEP = 5;
var SLEEPS = /(?:^|[\s;&|({])(?:(?:env|command|exec|nice|xargs(?:\s+-\S+)*)\s+)?(?:\S*\/)?(?:g?sleep|read\s+(?:-\w+\s+)*-t|delay)\s+(\$\(\([^)]*\)\)|\$\{?\w+\}?|""|\d+(?:\.\d+)?(?:e\d+)?|infinity)([smhd]?)(?=\s|$|[;&|)}])|(?:^|[\s;&|(])xargs(?:\s+-\S+)*\s+(?:\S*\/)?g?sleep\b()/g;
// Each step of a shell line: what its loop or test words lead and what runs inside $( ) or ` `, each its own step
var shellSteps = function (shell) {
    return shell
        .split(/\s*(?:;|&&?|\|\|?|\n|\$\(\(?|\)\)?|`|(?<=^|\s)[{}](?=\s|$))\s*/)
        .map(function (step) { return step.trim().replace(/^\(+\s*/, '').replace(/^(?:(?:do|then|else|elif|if|while|until|repeat\s+\S+|!|time|nohup|env|command|exec|nice(?:\s+-n\s+\S+)?|caffeinate(?:\s+-\w+)*|g?timeout\s+\S+)\s+)+/, '').replace(/\s*\d?>+&?\s*\S+/g, '').replace(/\s*<\s*\S+/g, '').trim(); })
        .filter(function (step) { return step && !/^(?:do|then|else|done|fi|esac|\(|\)|\{|\}|repeat\s+\S+)$/.test(step) && !/^(?:function\s+)?\w+\s*\(\)?$/.test(step); });
};
// A script that loops on a sleep until something is there or so: a file, a process, a page's answer, a line in a file
var POLLS_FOR = /\b(?:exists|isfile|is_file|existsSync|accessSync|pid_exists|status_code|getcode|File\.exist)\b|\bpoll\(\)|os\.kill\([^)]*,\s*0\)|\bin\s+open\(|\.read\(\)\.(?:count|find)\(|\s-e\s+["'$\/]/;
var waitingOf = function (cmd, scripts, options) {
    var _a, _b;
    if (scripts === void 0) { scripts = []; }
    if (options === void 0) { options = {}; }
    // The wait the old rules gave for helpers, as the program run
    if (/^\s*['"]?[^'"\s]*\/bin\/helpers['"]?(?:\s|$)/.test(cmd))
        return 'helpers';
    // (a very long command is read only so far, so no command can hold the mod up)
    var _c = codesOf(cmd.slice(0, 10000)), shell = _c.shell, inline = _c.inline;
    var steps = shellSteps(shell);
    if (steps.some(function (step) { return WAITERS.test(step); }))
        return 'tool';
    // A log followed and nothing else, under a time limit, only passes that time
    if (steps.length === 1 && /^(?:\S*\/)?g?timeout\s/.test(shell.trim()) && /^(?:\S*\/)?tail\b.*\s-\w*[fF]/.test((_a = steps[0]) !== null && _a !== void 0 ? _a : ''))
        return 'tool';
    if ((FOLLOW_UNTIL.test(shell) || FOLLOW_UNTIL.test(cmd.slice(0, 10000))) && !/(?:^|[\s;&|(])g?timeout\s+(?:[1-9]|10)s?\s/.test(shell))
        return 'tool';
    // The shell's own wait on something started before this command
    if (steps.some(function (step) { return /^wait\s+(?:-n\s+)?(?:\d+|\$[\w{!]+|%\S*)/.test(step); }) && !/(?<![>&])&(?![>&])/.test((_b = shell.split(/(?:^|[\s;&|(])wait\s/)[0]) !== null && _b !== void 0 ? _b : ''))
        return 'process';
    // A script inline, or a short one of its own the command runs, that loops on a sleep until something is there or so
    var isWaitScript = function (code) {
        return /\b(?:time\.sleep|asyncio\.sleep|sleep)\b|setTimeout\(|setInterval\(/.test(code) &&
            /\b(?:while|until)\b|\bfor\b[^]*\b(?:break|return|exit)\b|setInterval\(|\biter\(lambda/.test(code) &&
            POLLS_FOR.test(code) &&
            !/\bopen\([^)]*['"][wa]b?['"]|\.write(?:_text|_bytes)?\(|\bsave(?:fig)?\(|\bsubprocess\b|\bos\.system\(|\brequests\.(?:post|put|delete)\(|\bwriteFile|\bspawn\(|\bexec(?:Sync)?\(|\bshutil\.|\bupload/.test(code);
    };
    var sleepsIn = function (text) { return __spreadArray([], text.matchAll(SLEEPS), true).map(function (m) { var _a; return sleepSeconds((_a = m[1]) !== null && _a !== void 0 ? _a : 'unknown', m[2]); }); };
    var sleeps = sleepsIn(shell);
    // A script inline that only imports, sleeps, prints or looks counts as looking; so does a call of a function defined here
    var isTrivial = function (code) {
        return code
            .replace(/(["'])(?:(?!\1)[^\\\n]|\\.)*\1/g, '""')
            .split(/[\n;]+/)
            .every(function (part) { return /^\s*(?:$|#|import\b|from\s+\S+\s+import\b|(?:time\.|asyncio\.)?sleep\b|await\b|asyncio\.run\b|print\b|pass\b|console\.log\b|setTimeout\b|\[?\s*time\.sleep\b|delay\b)/.test(part) || POLLS_FOR.test(part); });
    };
    var isInlineLook = function (step) { return /^(?:\S*\/)?(?:(?:uv|poetry)\s+run\s+)?(?:python\d?(?:\.\d+)?|node|perl|ruby|osascript)(?:\s+-\w+)*\s+(?:-\w*[ce]\s+""|-|"")$/.test(step) && inline.every(function (code) { return isTrivial(code) || isWaitScript(code); }); };
    var functions = __spreadArray([], shell.matchAll(/(?:^|[\s;&|])(?:function\s+)?(\w+)\s*\(\)\s*\{/g), true).map(function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ''; });
    var isLook = function (step) { var _a, _b; return isInlineLook(step) || ((function (rest) { return rest !== undefined && isLook(rest); })((_a = /^(?:\S*\/)?ssh(?:\s+-[ioplFJLRDWbcemOQSw]\s+\S+|\s+-\w+)*\s+[^\s-]\S*\s+(\S.*)$/.exec(step)) === null || _a === void 0 ? void 0 : _a[1])) || functions.includes((_b = step.split(/\s+/)[0]) !== null && _b !== void 0 ? _b : '') || /^[\d\s*+\-/%()]+$/.test(step) || /^eval\s+""$/.test(step) || /^xargs\s+(?:-\S+\s+)*(?:\S*\/)?g?sleep\b/.test(step) || /^(?:tee|exec)(?:\s|$)/.test(step) || LOOKS.test(step) || STATUS.test(step) || WAITERS.test(step) || /^(?:\S*\/)?(?:caffeinate|delay|osascript\s+-e\s+"")(?:\s|$)/.test(step); };
    var isOnlyLooks = steps.every(isLook);
    // A loop that sleeps between its tries and ends when what it looks for is so (a while or until, a for that breaks or exits, zsh's
    // repeat), its every step only looking: what it waits for is a command, a file, a line or a page. A loop that never ends is a
    // watch, let through only as a Monitor watch, whose every line it is told
    var isPolling = function (text) { return /\b(?:while|until)\b/.test(text) || (/\b(?:for|repeat)\b/.test(text) && /\b(?:break|exit|return)\b/.test(text)); };
    var isForever = /\bwhile\s+(?:true|:|\[\s*1\s*\])\s*;?\s*(?:do\b|\{)/.test(shell) && !/\b(?:break|exit|return)\b/.test(shell);
    var isShellLoop = /(?:^|[\s;&|(])(?:while|until|for|repeat)\s[^]*?(?:\bdo\b|\{)/.test(shell);
    if (isShellLoop && !(isForever && options.isWatch)) {
        // (a loop that only looks and has nothing to do between its looks spins: a wait all the same)
        var isSpin = !sleeps.length && /\bdo\s*(?::|true)?\s*;?\s*done\b/.test(shell);
        if ((sleeps.length || isSpin) && isOnlyLooks && (isPolling(shell) || sleeps.reduce(function (a, b) { return a + b; }, 0) > LONGEST_SLEEP || /\bfor\s+\w+\s+in\s+(?:\$\(seq|\{\d+\.\.\d+\})/.test(shell)))
            return 'loop';
    }
    // A time: sleeps longer than a few seconds in all, outside a loop, in a command that does nothing but look (a sleep inside real
    // work, as a server comes up or a recording runs its length, is that work's own)
    var loopless = function (text) { return text.replace(/\bdo\b[^]*\bdone\b/g, ' '); };
    var codeSleeps = inline
        .filter(function (code) { return !/^\s*(?:while|for)\b|;\s*(?:while|for)\b/m.test(code); })
        .flatMap(function (code) { return __spreadArray([], code.replace(/(["'])(?:(?!\1)[^\\\n]|\\.)*\1/g, '""').matchAll(/\b(?:time\.)?sleep\(?\s*(\d+(?:\.\d+)?)\s*\)?|\bdelay\s+(\d+(?:\.\d+)?)|setTimeout\([^]{0,200}?,\s*(\d+)\s*\)/g), true).map(function (m) { var _a; return (m[1] ? Number(m[1]) : m[2] ? Number(m[2]) : Number((_a = m[3]) !== null && _a !== void 0 ? _a : 0) / 1000); }); });
    if (isOnlyLooks && __spreadArray(__spreadArray([], sleepsIn(loopless(shell)), true), codeSleeps, true).reduce(function (a, b) { return a + b; }, 0) > LONGEST_SLEEP)
        return 'time';
    if (inline.some(isWaitScript))
        return 'loop';
    if (scripts.some(function (text) { return text.split('\n').filter(function (line) { return line.trim() && !/^\s*#/.test(line); }).length <= 30 && (isWaitScript(text) || (0, exports.waitingOf)(text.replace(/^#![^\n]*\n/, '')) === 'loop'); }))
        return 'loop';
    return undefined;
};
exports.waitingOf = waitingOf;
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
// Jobs alike (the same kind, words and command) are one row that says how many they are, from the first one's start; the newest
// one's output stands for them
var foldJobs = function (jobs) {
    var _a;
    var keyOf = function (job) { return "".concat(job.kind, "|").concat(job.label, "|").concat(job.cmd); };
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
        return __assign(__assign(__assign({}, newest), { at: Math.min.apply(Math, group.map(function (job) { return job.at; })), count: group.length }), (wrote.length ? { wroteAt: Math.max.apply(Math, wrote) } : {}));
    });
};
exports.foldJobs = foldJobs;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
