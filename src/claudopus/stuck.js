// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, the
// card of work under which nothing new has come back for STUCK_AFTER, and finished work that something it started still holds
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _this = this;
// Nothing new for this long anywhere under a piece of work, while it works, and its card says so and the chat is told once. Above
// the longest one command can run (ten minutes) with a step either side of it, so a single long build or wait is not flagged
var STUCK_AFTER = 12 * 60000;
// One call running this long shows on its row, with its time
var RUNNING_SHOWN = 2 * 60000;
// Lines each agent has seen come back, so a wait that returns what it returned before is no news; kept to this many each
var SEEN_KEPT = 5000;
// Only this many lines of one result are looked at
var LINES_READ = 2000;
// Work whose step ended while all its helpers sit silent: Claudopus checks in after this long, orders it to hand back what it has
// after twice it, and tells the chat it is stuck after three times it, each on time
var HELPER_WAIT_STEP = 12 * 60000;
// A helper's call running this long no longer shows it at work: no command of the engine's runs so long in the foreground
var LIVE_CALL_MOST = 30 * 60000;
// What each agent's last call returned, whole, and when a call last returned something different: a frame count that moves on is
// output that changed, a call that says what the last one said is not
var lastResult = new Map();
var changedAt = new Map();
// The calls running now, by tool_use_id: whose, what, since when
// Work the mod started again after it had stopped mid-step: once only; stuck again, it is only told to the chat
var restartedOnce = new Set();
var inFlight = new Map();
var seenLines = new Map();
// What each agent began last and whether it has ended, in plain words, for the second line of a helper's row. Kept here, not on
// its card, so a call does not write the cards and redraw every panel
var lastCall = new Map();
// A command's own words turned into what it is doing: "Render the song stills" is "Rendering the song stills"
var DOUBLED = new Set(['commit', 'rerun', 'plot', 'crop', 'fit', 'refit', 'format', 'submit', 'omit', 'permit', 'chop', 'prep', 'spin', 'run', 'stop', 'get', 'set', 'put', 'cut', 'plan', 'drop', 'ship', 'scan', 'grab', 'trim', 'zip', 'pin', 'tag', 'map', 'log', 'shut', 'chat', 'swap', 'skip', 'step', 'wrap', 'snap', 'clip', 'dig', 'begin']);
var VERBS = new Set(['run', 'download', 'upload', 'watch', 'serve', 'wait', 'check', 'render', 'build', 'test', 'install', 'fetch', 'copy', 'move', 'make', 'find', 'read', 'write', 'draw', 'train', 'fit', 'compute', 'count', 'convert', 'compress', 'push', 'pull', 'clone', 'deploy', 'start', 'stop', 'open', 'save', 'sync', 'update', 'fix', 'look', 'search', 'list', 'measure', 'compare', 'merge', 'release', 'export', 'import', 'generate', 'create', 'delete', 'remove', 'clean', 'tidy', 'record', 'capture', 'take', 'shoot', 'encode', 'decode', 'transcribe', 'play', 'send', 'load', 'prepare', 'set', 'get', 'sort', 'scan', 'crop', 'resize', 'split', 'join', 'bake', 'solve', 'analyse', 'analyze', 'plot', 'extract', 'unpack', 'pack', 'zip', 'grade', 'score', 'rank', 'evaluate', 'label', 'align', 'compile', 'lint', 'format', 'verify', 'validate', 'probe', 'query', 'print', 'show', 'restart', 'stage', 'commit', 'rebuild', 'retry', 'redo', 'rerun', 'resize', 'collect', 'gather', 'process', 'index', 'upscale', 'mesh', 'paint', 'cut', 'trim', 'publish', 'post', 'preview', 'shrink', 'combine', 'reset', 'apply', 'mark', 'tag', 'map', 'kill', 'begin', 'close', 'add', 'try']);
var doingOf = function (said) {
    var _a;
    var _b = said.trim().split(/\s+/), _c = _b[0], first = _c === void 0 ? '' : _c, rest = _b.slice(1);
    var word = first.toLowerCase();
    if (!VERBS.has(word) || !rest.length)
        return said.trim();
    var ing = DOUBLED.has(word) ? "".concat(word).concat(word.at(-1), "ing") : /[^aeiou]e$/.test(word) && word !== 'be' ? "".concat(word.slice(0, -1), "ing") : /ie$/.test(word) ? "".concat(word.slice(0, -2), "ying") : "".concat(word, "ing");
    return __spreadArray([((_a = ing[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + ing.slice(1)], rest, true).join(' ');
};
// What a call does, in a few plain words; nothing for the mod's own tools and the app's bookkeeping
var callWords = function (tool, input) {
    var _a, _b;
    var said = oneLine(String((_a = input === null || input === void 0 ? void 0 : input.description) !== null && _a !== void 0 ? _a : '')).replace(/\s*\((?:about|under|over|around|up to|~)?\s*[\d.,\-– ]+\s*(?:s|sec|seconds?|m|mins?|minutes?|h|hours?)\)\s*$/i, '').trim();
    if (tool.startsWith(TOOLS) || tool.startsWith(OLD_TOOLS) || ['ToolSearch', 'TodoWrite', 'SubagentHandback', 'ExitPlanMode'].includes(tool))
        return '';
    if (tool === 'Bash')
        return said ? doingOf(said) : 'Running a command';
    if (tool === 'Monitor')
        return said ? "Watching: ".concat(said) : 'Watching for news';
    if (tool === 'Read')
        return 'Reading files';
    if (tool === 'Grep' || tool === 'Glob')
        return 'Searching the files';
    if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return 'Changing files';
    if (tool === 'WebFetch')
        return 'Reading a web page';
    if (tool === 'WebSearch')
        return 'Searching the web';
    if (tool === 'Agent' || tool === 'Task')
        return said ? "Starting the helper \u201C".concat(said, "\u201D") : 'Starting a helper';
    if (tool === 'SendMessage')
        return 'Sending a message';
    if (tool === 'TaskStop' || tool === 'KillShell')
        return 'Stopping a command';
    if (tool === 'TaskOutput' || tool === 'BashOutput')
        return "Reading a command's output";
    if (tool === 'Skill')
        return 'Using a skill';
    if (/chrome|browser|playwright|puppeteer/i.test(tool))
        return 'Using the browser';
    var server = (_b = /^mcp__([^_]+(?:_[^_]+)*)__/.exec(tool)) === null || _b === void 0 ? void 0 : _b[1];
    // (a plugin's server is named once: "mcp__plugin_easel_easel__draw" is easel)
    var words = (server !== null && server !== void 0 ? server : '').replace(/^plugin_/, '').split(/[-_]+/).filter(function (word, n, all) { return word && all.indexOf(word) === n; });
    return words.length ? "Using ".concat(words.join(' ')) : 'Using a tool';
};
// What a helper is doing now: its own latest note where that is newer than its latest action; else the action, with how long it
// has run once that is a minute; between actions, thinking
var helperNow = function (one, at, commands, most) {
    var _a, _b;
    if (commands === void 0) { commands = 0; }
    if (most === void 0) { most = 200; }
    var call = lastCall.get(one.id);
    var note = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer' && entry.text; });
    // The last thing it said, cut so how long it has been quiet always stays in sight
    var last = function (words, tail) { return "Last: ".concat(cut(words, Math.max(8, most - tail.length - 9)), " \u00B7 ").concat(tail); };
    var waits = function (idle) { return "".concat(commands === 1 ? 'Waiting for its command' : 'Waiting for its commands', " \u00B7 ").concat(took(idle)); };
    // (a note that has stood for minutes with nothing since is the last thing it said, or it waits for its commands)
    if (note && (!call || ((_a = note.at) !== null && _a !== void 0 ? _a : 0) >= call.at)) {
        var quiet = at - ((_b = note.at) !== null && _b !== void 0 ? _b : at);
        return quiet < 3 * 60000 ? cut(note.text, most) : commands ? waits(quiet) : last(note.text, "nothing new for ".concat(took(quiet)));
    }
    if (!call)
        return '';
    if (!call.endedAt)
        return at - call.at >= 60000 ? "".concat(cut(call.what, Math.max(8, most - 12)), " \u00B7 ").concat(took(at - call.at)) : cut(call.what, most);
    // Between actions it is thinking; long after its last one, with commands of its own running in the background, it waits for
    // them, as their rows under it show; long after with none, what it did last and how long nothing new has come
    var idle = at - call.endedAt;
    if (idle < 60000)
        return 'Thinking';
    if (commands)
        return waits(idle);
    return idle < 3 * 60000 ? "Thinking \u00B7 ".concat(took(idle)) : last(call.what, "nothing new for ".concat(took(idle)));
};
// What a running call is, in a few words, for its row
var runningWhat = function (tool) {
    return tool === 'Bash' ? 'a command running' : tool === 'Grep' || tool === 'Glob' ? 'a search running' : tool === 'Agent' ? 'a helper running' : "".concat(tool.replace(/^mcp__.*__/, ''), " running");
};
// A result as lines: its text where it has some, else its parts each on a line of their own
var resultLines = function (result) {
    var text = typeof result === 'string'
        ? result
        : Array.isArray(result === null || result === void 0 ? void 0 : result.content)
            ? (result.content.map(function (part) { var _a; return String((_a = part.text) !== null && _a !== void 0 ? _a : ''); }).join('\n'))
            : result && typeof result === 'object'
                ? Object.values(result).map(function (value) { var _a; return (typeof value === 'string' ? value : (_a = JSON.stringify(value)) !== null && _a !== void 0 ? _a : ''); }).join('\n')
                : String(result !== null && result !== void 0 ? result : '');
    // Digits are left out, so a wait that only prints a new time or count says nothing new
    return text.split('\n', LINES_READ).map(function (line) { return line.trim().replace(/\d/g, '#').slice(0, 300); }).filter(Boolean);
};
// The longest-running call of an agent, as its card keeps it
var runningOf = function (agent) {
    var first = __spreadArray([], inFlight.values(), true).filter(function (one) { return one.agent === agent; }).sort(function (a, b) { return a.at - b.at; })[0];
    return first ? __assign({ what: first.what, at: first.at }, (first.cmd ? { cmd: first.cmd, label: first.label } : {})) : undefined;
};
// A card with its running call as it is now, worked out as it is changed, so calls that begin and end together leave it true;
// the list itself when nothing changed
var withRunning = function (list, agent, newAt) {
    var _a, _b;
    var running = runningOf(agent);
    var at = list.findIndex(function (one) { return one.id === agent; });
    var one = list[at];
    if (!one || (((_a = one.running) === null || _a === void 0 ? void 0 : _a.at) === (running === null || running === void 0 ? void 0 : running.at) && ((_b = one.running) === null || _b === void 0 ? void 0 : _b.what) === (running === null || running === void 0 ? void 0 : running.what) && (newAt === undefined || one.newAt === newAt)))
        return list;
    return list.map(function (card, n) { return (n === at ? __assign(__assign({}, card), { running: running, newAt: newAt !== null && newAt !== void 0 ? newAt : card.newAt }) : card); });
};
// A call of a piece of work begins: its card keeps the one it has been running longest
var callBegun = function ($, id, agent, tool, input) { return __awaiter(_this, void 0, void 0, function () {
    var cmd, label, begun, words;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                cmd = tool === 'Bash' ? oneLine(String((_a = input === null || input === void 0 ? void 0 : input.command) !== null && _a !== void 0 ? _a : '')).slice(0, 400) : '';
                label = oneLine(String((_b = input === null || input === void 0 ? void 0 : input.description) !== null && _b !== void 0 ? _b : '') || cmd.split('\n')[0] || '').slice(0, 160);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                begun = _c.sent();
                inFlight.set(id, __assign({ agent: agent, what: runningWhat(tool), at: begun }, (cmd ? { cmd: cmd, label: label } : {})));
                words = callWords(tool, input);
                if (words)
                    lastCall.set(agent, { id: id, what: words, at: begun });
                return [4 /*yield*/, changeTodos($, function (list) { return withRunning(list, agent); })];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
var callEnded = function ($, id, agent, tool, r) { return __awaiter(_this, void 0, void 0, function () {
    var now, last, isNew, whole_1, seen, _i, _a, line;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                inFlight.delete(id);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                last = lastCall.get(agent);
                if ((last === null || last === void 0 ? void 0 : last.id) === id)
                    lastCall.set(agent, __assign(__assign({}, last), { endedAt: now }));
                isNew = false;
                if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
                    whole_1 = (typeof r.result === 'string' ? r.result : JSON.stringify((_b = r.result) !== null && _b !== void 0 ? _b : '')).slice(0, 20000);
                    if (lastResult.get(agent) !== whole_1)
                        (lastResult.set(agent, whole_1), changedAt.set(agent, now));
                    seen = (_c = seenLines.get(agent)) !== null && _c !== void 0 ? _c : new Set();
                    for (_i = 0, _a = resultLines(r.result); _i < _a.length; _i++) {
                        line = _a[_i];
                        if (!seen.has(line))
                            ((isNew = true), seen.add(line));
                    }
                    if (seen.size > SEEN_KEPT)
                        seenLines.set(agent, new Set(__spreadArray([], seen, true).slice(-SEEN_KEPT / 2)));
                    else
                        seenLines.set(agent, seen);
                }
                return [4 /*yield*/, changeTodos($, function (list) { return withRunning(list, agent, isNew ? now : undefined); })];
            case 2:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
// When a helper last showed it was at work: it started, ended (with its result), or a call of its returned something different
var helperMovedAt = function (one) { var _a, _b; return Math.max(one.startedAt, one.endedAt, (_a = one.newAt) !== null && _a !== void 0 ? _a : 0, (_b = changedAt.get(one.id)) !== null && _b !== void 0 ? _b : 0); };
// A helper that sits silent: it is not at work (isBusy), and neither it nor any helper under it has shown it was at work for
// STUCK_AFTER. One rendering in the background, printing a new frame count call after call, or waiting on its own wake_me is at work
var isSilent = function (list, helper, at) {
    return !isBusy(list, helper, at) && __spreadArray([helper], underOf(list, helper.id), true).filter(function (one) { return one.status === 'working'; }).every(function (one) { return at - helperMovedAt(one) >= STUCK_AFTER; });
};
// When a command in the background last printed: as its output last changed, or as it started while it has printed nothing
var printedAt = function (one, b) {
    var _a, _b;
    var seen = (_a = jobLog.get(b.id)) !== null && _a !== void 0 ? _a : (_b = one.seenJobs) === null || _b === void 0 ? void 0 : _b[b.id];
    return (seen === null || seen === void 0 ? void 0 : seen.wroteAt) && !seen.isEmpty ? Math.max(b.at, seen.wroteAt) : b.at;
};
// A wake_me still due: Claudopus starts that work again when it comes, or when its look runs out
var isWakeDue = function (one, at) { return Boolean(one.wakeWhen && at <= one.wakeWhen.until); };
// A helper visibly at work now: it, or one under it, is in a call younger than LIVE_CALL_MOST, has a command of its own in the
// background that printed within LIVE_CALL_MOST, or has a wake_me still due. A watch is no work, nor a command silent that long
// (a hung run, a dev server it left: on 17 Nov one counted as work for good, and its task was never told of)
var isBusy = function (list, helper, at) {
    return __spreadArray([helper], underOf(list, helper.id), true).filter(function (one) { return one.status === 'working'; })
        .some(function (one) {
        var _a, _b;
        var call = runningOf(one.id);
        // (a command Claudopus holds for its turn is at work too: its wait is Claudopus's own)
        return Boolean((call && at - call.at < LIVE_CALL_MOST) || ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch && at - printedAt(one, b) < LIVE_CALL_MOST; })) || isWakeDue(one, at) || ((_b = one.heldCalls) === null || _b === void 0 ? void 0 : _b.length));
    });
};
var runningKids = function (list, id) { return list.filter(function (kid) { return kid.parentId === id && kid.status === 'working'; }); };
// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
var movedAt = function (list, top) { return Math.max.apply(Math, __spreadArray([top], underOf(list, top.id), true).map(function (one) { var _a; return Math.max(one.startedAt, one.endedAt, (_a = one.newAt) !== null && _a !== void 0 ? _a : 0); })); };
// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work waiting on the person is not flagged: asking them something, or stopped
// on the app's own prompt to allow a call; nor work that gave its report and is only held by what it left running
var lookStuck = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, told, _loop_1, _i, told_1, one, _loop_2, _a, _b, one, list, _loop_3, _c, _d, agent, _loop_4, _e, _f, agent;
    var _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _o.sent();
                told = [];
                return [4 /*yield*/, changeTodos($, function (list) {
                        // Told afresh on each run of the change, as it runs again on a list written meanwhile
                        told.length = 0;
                        var isChanged = false;
                        var isPrompted = function (one) { return waiting.some(function (p) { return p.agent && topOf(list, p.agent) === one.id; }); };
                        var next = list.map(function (one) {
                            var _a, _b;
                            if (one.parentId || one.chat)
                                return one;
                            // Work that moved again since the chat was told it is stuck is no longer what the chat was told: flagged and told afresh if it is stuck again
                            if (one.stuckTold !== undefined && movedAt(list, one) > one.stuckTold)
                                ((isChanged = true), (one = __assign(__assign({}, one), { stuckTold: undefined, stuckAt: undefined })));
                            // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
                            var isWaitingOwn = Boolean(one.waitsSince && ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch; })));
                            // Nor work that asked Claudopus to start it again: that look has its own end, which starts it (lookWakes)
                            var isStuck = one.status === 'working' && !one.wakeWhen && !(one.ask && !one.ask.replied) && !((_b = one.admins) === null || _b === void 0 ? void 0 : _b.length) && !__spreadArray([one], underOf(list, one.id), true).some(function (kid) { var _a; return (_a = kid.heldCalls) === null || _a === void 0 ? void 0 : _a.length; }) && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER;
                            if (isStuck && !one.stuckAt)
                                return ((isChanged = true), told.push(one), __assign(__assign({}, one), { stuckAt: movedAt(list, one) }));
                            if (!isStuck && one.stuckAt)
                                return ((isChanged = true), __assign(__assign({}, one), { stuckAt: undefined, stuckTold: undefined }));
                            return one;
                        });
                        return isChanged ? next : list;
                    })
                    // Stuck work the engine no longer runs had stopped mid-step (the app restarted, the Mac slept, its run was cut off): it is
                    // started again at once with a message of the mod's own, rather than waiting for the chat or the person to notice
                ];
            case 2:
                _o.sent();
                _loop_1 = function (one) {
                    var list_1, mins, helpers, isScheduled, engine, status_1, under, isHelped, isWaiting, isStopped, r, _p, _q;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                list_1 = _r.sent();
                                mins = Math.round((now - movedAt(list_1, one)) / 60000);
                                helpers = runningKids(list_1, one.id);
                                isScheduled = ((_g = list_1.find(function (card) { return card.id === one.id; })) === null || _g === void 0 ? void 0 : _g.endedStepAt) !== undefined && helpers.every(function (kid) { return isSilent(list_1, kid, now); });
                                if (helpers.length && (helpers.some(function (kid) { return isBusy(list_1, kid, now); }) || isScheduled))
                                    return [2 /*return*/, "continue"];
                                if (((_h = list_1.find(function (card) { return card.id === one.id; })) === null || _h === void 0 ? void 0 : _h.stuckTold) !== undefined)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, $.agent.list().catch(function () { return undefined; })];
                            case 2:
                                engine = _r.sent();
                                status_1 = (_j = engine === null || engine === void 0 ? void 0 : engine.find(function (agent) { return agent.id === one.id; })) === null || _j === void 0 ? void 0 : _j.status;
                                under = underOf(list_1, one.id).map(function (kid) { return kid.id; });
                                isHelped = Boolean(engine === null || engine === void 0 ? void 0 : engine.some(function (agent) { return (agent.parentId === one.id || under.includes(agent.id)) && WORKING.includes(agent.status); }));
                                isWaiting = WORKING.includes(String(status_1)) || isHelped;
                                isStopped = Boolean(status_1) && !isWaiting && !isHeld(one) && !stoppedHere.has(one.id) && !cutPending.has(one.id) && !((_k = one.ask) === null || _k === void 0 ? void 0 : _k.replied) && !restartedOnce.has(one.id);
                                if (isStopped)
                                    restartedOnce.add(one.id);
                                _q = isStopped;
                                if (!_q) return [3 /*break*/, 4];
                                return [4 /*yield*/, isReplaced($)];
                            case 3:
                                _q = !(_r.sent());
                                _r.label = 4;
                            case 4:
                                if (!_q) return [3 /*break*/, 6];
                                return [4 /*yield*/, sendOwn($, { to: { agentId: one.id }, text: named(RESTARTED_WORK) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 5:
                                _p = _r.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                _p = undefined;
                                _r.label = 7;
                            case 7:
                                r = _p;
                                if (!(r === null || r === void 0 ? void 0 : r.isDelivered)) return [3 /*break*/, 10];
                                return [4 /*yield*/, log($, "work ".concat(one.id, " had stopped mid-step (the engine lists it ").concat(status_1, "): started again"))];
                            case 8:
                                _r.sent();
                                return [4 /*yield*/, tellChat($, named(RESTARTED_IN_CHAT(titleOf(one), mins)))];
                            case 9:
                                _r.sent();
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, tellStuck($, one, mins, now)];
                            case 11:
                                _r.sent();
                                _r.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, told_1 = told;
                _o.label = 3;
            case 3:
                if (!(_i < told_1.length)) return [3 /*break*/, 6];
                one = told_1[_i];
                return [5 /*yield**/, _loop_1(one)];
            case 4:
                _o.sent();
                _o.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                _loop_2 = function (one) {
                    var list_2, helpers, isScheduled;
                    return __generator(this, function (_s) {
                        switch (_s.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                list_2 = _s.sent();
                                helpers = runningKids(list_2, one.id);
                                isScheduled = one.endedStepAt !== undefined && ((_m = (_l = one.helperWait) === null || _l === void 0 ? void 0 : _l.done) !== null && _m !== void 0 ? _m : 0) < 3 && helpers.length > 0 && helpers.every(function (kid) { return isSilent(list_2, kid, now); });
                                if (isScheduled || isHeld(one) || stoppedHere.has(one.id) || pressed.has(one.id))
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, log($, "work ".concat(one.id, " flagged stuck and not yet told of: the chat is told"))];
                            case 2:
                                _s.sent();
                                return [4 /*yield*/, tellStuck($, one, Math.round((now - movedAt(list_2, one)) / 60000), now)];
                            case 3:
                                _s.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a = 0;
                return [4 /*yield*/, read($, todos)];
            case 7:
                _b = (_o.sent()).filter(function (card) { return !card.parentId && !card.chat && card.status === 'working' && card.stuckAt !== undefined && card.stuckTold === undefined && now - card.stuckAt >= STUCK_TOLD_BY; });
                _o.label = 8;
            case 8:
                if (!(_a < _b.length)) return [3 /*break*/, 11];
                one = _b[_a];
                return [5 /*yield**/, _loop_2(one)];
            case 9:
                _o.sent();
                _o.label = 10;
            case 10:
                _a++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, lookHelperWaits($, now)];
            case 12:
                _o.sent();
                return [4 /*yield*/, lookOwnWaits($, now)
                    // What agents that have ended had seen come back is let go
                ];
            case 13:
                _o.sent();
                return [4 /*yield*/, read($, todos)];
            case 14:
                list = _o.sent();
                _loop_3 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        seenLines.delete(agent);
                };
                for (_c = 0, _d = seenLines.keys(); _c < _d.length; _c++) {
                    agent = _d[_c];
                    _loop_3(agent);
                }
                _loop_4 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        (lastResult.delete(agent), changedAt.delete(agent));
                };
                for (_e = 0, _f = __spreadArray([], lastResult.keys(), true); _e < _f.length; _e++) {
                    agent = _f[_e];
                    _loop_4(agent);
                }
                return [2 /*return*/];
        }
    });
}); };
// Work flagged stuck is told to the chat by this long after it stopped moving, at the latest: when the schedule would have told it
var STUCK_TOLD_BY = 3 * HELPER_WAIT_STEP;
// The chat is told work is stuck, and that it may write to it; marked first, so it is told once
var tellStuck = function ($, one, mins, now) { return __awaiter(_this, void 0, void 0, function () {
    var list, said, card;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (card) { return (card.id === one.id ? __assign(__assign({}, card), { stuckTold: now }) : card); }); })];
            case 1:
                _b.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _b.sent();
                said = STUCK_IN_CHAT(titleOf(one), mins, runningKids(list, one.id).some(function (kid) { return isBusy(list, kid, now); }));
                card = (_a = list.find(function (card) { return card.id === one.id; })) !== null && _a !== void 0 ? _a : one;
                return [4 /*yield*/, tellChat($, named("".concat(said, " ").concat(isOwnWaiting(list, card, now) ? STUCK_ASK_LOOKS : STUCK_ASK)))];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// Work whose step ended while all its helpers sit silent follows a fixed schedule from then: at HELPER_WAIT_STEP it is started again
// to check on them, at twice it to hand back what it has (its report then goes through while they run), at three times it the chat
// is told plainly that it is stuck and may write to it. Each step comes on time whether or not the last reached it; the schedule
// starts over only when a helper hands back a result or prints something different (16 Nov: tasks sat for hours on helpers, the chat
// told only that they might be stuck). Only working cards: one that has finished is left as it is
var lookHelperWaits = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var due, _loop_5, _i, due_1, _a, id, step, mins;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                due = [];
                return [4 /*yield*/, changeTodos($, function (list) {
                        due.length = 0;
                        var isChanged = false;
                        var next = list.map(function (one) {
                            var _a;
                            if (one.parentId || one.chat || one.status !== 'working' || one.handedBackAt !== undefined)
                                return one;
                            var helpers = runningKids(list, one.id);
                            if (!helpers.length)
                                return one.helperWait ? ((isChanged = true), __assign(__assign({}, one), { helperWait: undefined })) : one;
                            // Since when: its step's end, or the latest a helper of its showed it was at work, whichever is later
                            var moved = Math.max.apply(Math, __spreadArray([0], underOf(list, one.id).map(helperMovedAt), false));
                            var wait = one.helperWait;
                            if (wait && moved > wait.from)
                                wait = undefined;
                            if (!wait && one.endedStepAt !== undefined)
                                wait = { from: Math.max(one.endedStepAt, moved), done: 0 };
                            if (wait !== one.helperWait)
                                ((isChanged = true), (one = __assign(__assign({}, one), { helperWait: wait })));
                            // A step is due once its time has come, its step has ended, every helper sits silent and it waits on no wake_me of its own; and
                            // HELPER_WAIT_STEP after the last, so steps a helper at work held back come one by one
                            if (wait && wait.done < 3 && now - wait.from >= HELPER_WAIT_STEP * (wait.done + 1) && now - ((_a = wait.at) !== null && _a !== void 0 ? _a : 0) >= HELPER_WAIT_STEP && one.endedStepAt !== undefined && !isWakeDue(one, now) && helpers.every(function (kid) { return isSilent(list, kid, now); }))
                                due.push({ id: one.id, step: wait.done + 1, mins: Math.round((now - wait.from) / 60000) });
                            return one;
                        });
                        return isChanged ? next : list;
                    })];
            case 1:
                _g.sent();
                _loop_5 = function (id, step, mins) {
                    var list, one, _h, _j, _k, _l, _m, from, _o, changed, printed, fresh, card, line, r;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                list = _p.sent();
                                one = list.find(function (card) { return card.id === id; });
                                _h = !one || isHeld(one) || stoppedHere.has(id) || pressed.has(id);
                                if (_h) return [3 /*break*/, 3];
                                return [4 /*yield*/, isReplaced($)];
                            case 2:
                                _h = (_p.sent());
                                _p.label = 3;
                            case 3:
                                if (_h)
                                    return [2 /*return*/, "continue"];
                                _j = step < 3;
                                if (!_j) return [3 /*break*/, 5];
                                _l = (_k = WORKING).includes;
                                _m = String;
                                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                            case 4:
                                _j = _l.apply(_k, [_m.apply(void 0, [(_b = (_p.sent()).find(function (agent) { return agent.id === id; })) === null || _b === void 0 ? void 0 : _b.status])]);
                                _p.label = 5;
                            case 5:
                                // (read right before: work at a step of its own again is not sent one, and the step waits for its step to end)
                                if (_j)
                                    return [2 /*return*/, "continue"];
                                from = (_e = (_d = (_c = list.find(function (card) { return card.id === id; })) === null || _c === void 0 ? void 0 : _c.helperWait) === null || _d === void 0 ? void 0 : _d.from) !== null && _e !== void 0 ? _e : now;
                                return [4 /*yield*/, helpersRecord($, list, id)
                                    // One whose record shows a command in the background still going that printed within LIVE_CALL_MOST is at work, as isBusy has
                                    // it: the step waits
                                ];
                            case 6:
                                _o = _p.sent(), changed = _o.changed, printed = _o.printed;
                                // One whose record shows a command in the background still going that printed within LIVE_CALL_MOST is at work, as isBusy has
                                // it: the step waits
                                if (printed && now - printed < LIVE_CALL_MOST)
                                    return [2 /*return*/, "continue"];
                                if (!(changed > from)) return [3 /*break*/, 9];
                                return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (card) { return (card.id === id && card.helperWait ? __assign(__assign({}, card), { helperWait: { from: changed, done: 0 } }) : card); }); })];
                            case 7:
                                _p.sent();
                                return [4 /*yield*/, log($, "work ".concat(id, " waits on helpers, one of which had a call return something new ").concat(took(now - changed), " ago that Claudopus had not seen: not started again"))];
                            case 8:
                                _p.sent();
                                return [2 /*return*/, "continue"];
                            case 9: return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (card) { var _a, _b; return (card.id === id && card.helperWait ? __assign(__assign(__assign(__assign({}, card), { helperWait: __assign(__assign({}, card.helperWait), { done: step, at: now }) }), (step === 2 ? { mayHandBack: (_a = card.mayHandBack) !== null && _a !== void 0 ? _a : now } : {})), (step === 3 ? { stuckTold: (_b = card.stuckTold) !== null && _b !== void 0 ? _b : now } : {})) : card); }); })];
                            case 10:
                                _p.sent();
                                if (!(step === 3)) return [3 /*break*/, 14];
                                // The chat already told it is stuck is not told again
                                if (one.stuckTold !== undefined)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, log($, "work ".concat(id, " still stuck ").concat(mins, " min on silent helpers after Claudopus asked it to hand back: the chat is told"))];
                            case 11:
                                _p.sent();
                                return [4 /*yield*/, read($, todos)];
                            case 12:
                                fresh = _p.sent();
                                card = (_f = fresh.find(function (c) { return c.id === id; })) !== null && _f !== void 0 ? _f : one;
                                return [4 /*yield*/, tellChat($, named("".concat(GAVE_UP_IN_CHAT(titleOf(one), mins), " ").concat(isOwnWaiting(fresh, card, now) ? STUCK_ASK_LOOKS : STUCK_ASK)))];
                            case 13:
                                _p.sent();
                                return [2 /*return*/, "continue"];
                            case 14:
                                line = (step === 2 ? HELPERS_STILL_SILENT : HELPERS_SILENT)(mins, silentHelpers(list, id, now));
                                return [4 /*yield*/, sendOwn($, { to: { agentId: id }, text: line }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 15:
                                r = _p.sent();
                                return [4 /*yield*/, log($, "work ".concat(id, " waits on helpers silent for ").concat(mins, " min: ").concat(r.isDelivered ? 'started again' : "not reached (".concat(r.reason, ")"), " to ").concat(step === 2 ? 'hand back what it has' : 'check on them'))];
                            case 16:
                                _p.sent();
                                return [4 /*yield*/, tellChat($, named(NUDGED_IN_CHAT(titleOf(one), mins, step === 2)))];
                            case 17:
                                _p.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, due_1 = due;
                _g.label = 2;
            case 2:
                if (!(_i < due_1.length)) return [3 /*break*/, 5];
                _a = due_1[_i], id = _a.id, step = _a.step, mins = _a.mins;
                return [5 /*yield**/, _loop_5(id, step, mins)];
            case 3:
                _g.sent();
                _g.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
// What the engine's own record of each helper at work under a piece of work shows, for when its calls passed Claudopus by (17 Nov:
// a task was started again three times to check on helpers that were mid-step or following their runs, Claudopus having seen
// nothing of them): when a call last returned something different from the call before it, by the same rule as for the calls
// Claudopus sees (callEnded: its own tools and refused calls bring no news, nor do messages to the helper or notices), and when a
// command it sent to the background that has not ended last printed. 0 for each when nothing can be read
var helpersRecord = function ($, list, id) { return __awaiter(_this, void 0, void 0, function () {
    var session, seen, folder, _i, _a, kid, path, tail, tools, runs_1, before, _b, _c, row, o, at, content, text, _d, _e, ended_1, _f, _g, part, _h, _j, ended_2, tool, said_1, started_1, _k, _l, run, wrote;
    var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                session = (_3.sent()).id;
                seen = { changed: 0, printed: 0 };
                if (!session || !cwd)
                    return [2 /*return*/, seen];
                return [4 /*yield*/, agentsFolder($, session)];
            case 2:
                folder = _3.sent();
                _i = 0, _a = underOf(list, id).filter(function (one) { return one.status === 'working'; });
                _3.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                kid = _a[_i];
                path = "".concat(folder, "/agent-").concat(kid.id, ".jsonl");
                return [4 /*yield*/, $.process.run(['tail', '-c', '400000', path]).catch(function () { return undefined; })];
            case 4:
                tail = (_o = (_m = (_3.sent())) === null || _m === void 0 ? void 0 : _m.stdout) !== null && _o !== void 0 ? _o : '';
                tools = new Map();
                runs_1 = new Map();
                before = void 0;
                for (_b = 0, _c = tail.split('\n'); _b < _c.length; _b++) {
                    row = _c[_b];
                    o = parsedOr(row, {});
                    at = Date.parse((_p = o.timestamp) !== null && _p !== void 0 ? _p : '') || 0;
                    content = (_q = o.message) === null || _q === void 0 ? void 0 : _q.content;
                    text = typeof content === 'string' ? content : '';
                    // A notice that a command in the background ended: it no longer runs
                    for (_d = 0, _e = text.matchAll(/<task-id>(\w+)<\/task-id>/g); _d < _e.length; _d++) {
                        ended_1 = _e[_d];
                        runs_1.delete((_r = ended_1[1]) !== null && _r !== void 0 ? _r : '');
                    }
                    if (!Array.isArray(content))
                        continue;
                    for (_f = 0, _g = content; _f < _g.length; _f++) {
                        part = _g[_f];
                        if (o.type === 'assistant' && part.type === 'tool_use')
                            tools.set((_s = part.id) !== null && _s !== void 0 ? _s : '', (_t = part.name) !== null && _t !== void 0 ? _t : '');
                        if (o.type !== 'user' || part.type !== 'tool_result')
                            continue;
                        for (_h = 0, _j = JSON.stringify((_u = part.content) !== null && _u !== void 0 ? _u : '').matchAll(/<task-id>(\w+)<\/task-id>/g); _h < _j.length; _h++) {
                            ended_2 = _j[_h];
                            runs_1.delete((_v = ended_2[1]) !== null && _v !== void 0 ? _v : '');
                        }
                        tool = (_x = tools.get((_w = part.tool_use_id) !== null && _w !== void 0 ? _w : '')) !== null && _x !== void 0 ? _x : '';
                        if (part.is_error || tool.startsWith(TOOLS) || tool.startsWith(OLD_TOOLS))
                            continue;
                        said_1 = resultLines(part.content).join('\n');
                        started_1 = /Command running in background with ID: (\w+)\. Output is being written to: (\S+?\.output)/.exec(JSON.stringify((_y = part.content) !== null && _y !== void 0 ? _y : ''));
                        if (started_1)
                            runs_1.set((_z = started_1[1]) !== null && _z !== void 0 ? _z : '', { output: (_0 = started_1[2]) !== null && _0 !== void 0 ? _0 : '', at: at });
                        if (before !== undefined && said_1 !== before && at > seen.changed)
                            seen.changed = at;
                        before = said_1;
                    }
                }
                _k = 0, _l = runs_1.values();
                _3.label = 5;
            case 5:
                if (!(_k < _l.length)) return [3 /*break*/, 8];
                run = _l[_k];
                return [4 /*yield*/, $.fs.stat(run.output).catch(function () { return undefined; })];
            case 6:
                wrote = (_2 = (_1 = (_3.sent())) === null || _1 === void 0 ? void 0 : _1.mtimeMs) !== null && _2 !== void 0 ? _2 : 0;
                seen.printed = Math.max(seen.printed, wrote || run.at);
                _3.label = 7;
            case 7:
                _k++;
                return [3 /*break*/, 5];
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/, seen];
        }
    });
}); };
// Work whose step ended to wait with no helper at work, on a command of its own, a watch, or nothing Claudopus can see, is started
// again to look at what it waits on when nothing started it for this long: the first look no sooner than its newest command's own
// expected time and ten minutes more, then each after twice the last gap, and from four hours on every four hours. It counts afresh
// once a to-do is ticked or a command ends. 18 Nov: three tasks sat four to five hours on cloud jobs that never started, flagged and
// never looked at, until the person asked
var OWN_WAIT_GAPS = [30 * 60000, 60 * 60000, 2 * 3600000, 4 * 3600000];
var ownWaitGap = function (done) { return OWN_WAIT_GAPS[Math.min(done, OWN_WAIT_GAPS.length - 1)]; };
// What it has got done, so a wait that moved starts the count over: a to-do ticked, or a command that ended of itself. Not a command
// it stopped or started, as a task that starts its wait afresh at each look would be looked in on every half hour for good
var ownWaitKey = function (one) { var _a; return "".concat(one.items.filter(function (item) { return item.state === 'done'; }).length, ":").concat(((_a = one.endedRuns) !== null && _a !== void 0 ? _a : []).filter(function (run) { return run.how === 'finished' || run.how === 'failed' || run.how === 'ended'; }).reduce(function (sum, run) { var _a; return sum + ((_a = run.count) !== null && _a !== void 0 ? _a : 1); }, 0)); };
// What it waits on, in words for its look-in: its commands, each with how long it has run
var ownWaitWhat = function (list, one, at) {
    var _a, _b;
    var helpers = runningKids(list, one.id).length ? "your helpers, which have shown nothing new: ".concat(silentHelpers(list, one.id, at)) : '';
    var commands = __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { return ({ what: b.what, at: b.at, isWatch: b.isWatch }); }), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []).filter(function (d) { return !d.isLeft; }).map(function (d) { return ({ what: d.what, at: d.at, isWatch: false }); }), true);
    if (!commands.length)
        return helpers || 'something Claudopus can see nothing of (no command or helper of yours runs)';
    return __spreadArray([helpers], commands.map(function (c) { return "".concat(c.isWatch ? 'your watch' : 'your command', " \"").concat(cut(oneLine(c.what || 'with no description'), 80), "\", running ").concat(minutesSaid(Math.round((at - c.at) / 60000))); }), true).filter(Boolean).join('; ');
};
var isOwnWaiting = function (list, one, at) { var _a, _b, _c, _d; return !one.parentId && !one.chat && one.status === 'working' && one.endedStepAt !== undefined && one.handedBackAt === undefined && one.answeredAt === undefined && (!runningKids(list, one.id).length || (((_b = (_a = one.helperWait) === null || _a === void 0 ? void 0 : _a.done) !== null && _b !== void 0 ? _b : 0) >= 3 && runningKids(list, one.id).every(function (kid) { return isSilent(list, kid, at); }))) && !isWakeDue(one, at) && !(one.ask && !one.ask.replied) && !((_c = one.admins) === null || _c === void 0 ? void 0 : _c.length) && !((_d = one.heldCalls) === null || _d === void 0 ? void 0 : _d.length) && !isHeld(one); };
var lookOwnWaits = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var due, _loop_6, _i, due_2, _a, id, mins, done;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                due = [];
                return [4 /*yield*/, changeTodos($, function (list) {
                        due.length = 0;
                        var isChanged = false;
                        var next = list.map(function (one) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            if (!isOwnWaiting(list, one, now))
                                return one;
                            var key = ownWaitKey(one);
                            // (after the helpers' schedule ran out, counted from its last step)
                            var wait = ((_a = one.ownWait) === null || _a === void 0 ? void 0 : _a.key) === key ? one.ownWait : { key: key, done: 0, at: (_c = (_b = one.helperWait) === null || _b === void 0 ? void 0 : _b.at) !== null && _c !== void 0 ? _c : 0 };
                            if (wait !== one.ownWait)
                                ((isChanged = true), (one = __assign(__assign({}, one), { ownWait: wait })));
                            // (the first look waits out the newest command's own expected time)
                            var newest = ((_d = one.bg) !== null && _d !== void 0 ? _d : []).filter(function (b) { return !b.isWatch; }).at(-1);
                            var isPastOwnTime = wait.done > 0 || !newest || now - newest.at >= ((_e = describedOf(newest.what).expect) !== null && _e !== void 0 ? _e : 0) + 10 * 60000;
                            var gap = ownWaitGap(wait.done);
                            if (isPastOwnTime && now - ((_f = one.endedStepAt) !== null && _f !== void 0 ? _f : now) >= gap && now - wait.at >= gap)
                                due.push({ id: one.id, mins: Math.round((now - ((_g = one.endedStepAt) !== null && _g !== void 0 ? _g : now)) / 60000), done: wait.done });
                            return one;
                        });
                        return isChanged ? next : list;
                    })];
            case 1:
                _c.sent();
                _loop_6 = function (id, mins, done) {
                    var _d, status_2, _e, one, r, _f, _g, _h, _j, _k, _l;
                    var _m;
                    return __generator(this, function (_o) {
                        switch (_o.label) {
                            case 0:
                                _d = cutPending.has(id) || stoppedHere.has(id) || pressed.has(id);
                                if (_d) return [3 /*break*/, 2];
                                return [4 /*yield*/, isReplaced($)];
                            case 1:
                                _d = (_o.sent());
                                _o.label = 2;
                            case 2:
                                // (not a task cut off as the chat's process ended, which Claudopus brings back itself and tells of the cut; nor one at a step of its own)
                                if (_d)
                                    return [2 /*return*/, "continue"];
                                _e = String;
                                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                            case 3:
                                status_2 = _e.apply(void 0, [(_b = (_o.sent()).find(function (agent) { return agent.id === id; })) === null || _b === void 0 ? void 0 : _b.status]);
                                if (status_2 === 'running' || status_2 === 'pending')
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, changeTodos($, function (all) {
                                        one = all.find(function (card) { var _a; return card.id === id && ((_a = card.ownWait) === null || _a === void 0 ? void 0 : _a.done) === done && isOwnWaiting(all, card, now); });
                                        return one ? all.map(function (card) { return (card.id === id && card.ownWait ? __assign(__assign({}, card), { ownWait: __assign(__assign({}, card.ownWait), { at: now }) }) : card); }) : all;
                                    })];
                            case 4:
                                _o.sent();
                                if (!one)
                                    return [2 /*return*/, "continue"];
                                _f = sendOwn;
                                _g = [$];
                                _m = { to: { agentId: id } };
                                _h = named;
                                _j = OWN_WAIT_LOOK;
                                _k = [mins];
                                _l = ownWaitWhat;
                                return [4 /*yield*/, read($, todos)];
                            case 5: return [4 /*yield*/, _f.apply(void 0, _g.concat([(_m.text = _h.apply(void 0, [_j.apply(void 0, _k.concat([_l.apply(void 0, [_o.sent(), one, now])]))]), _m)])).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 6:
                                r = _o.sent();
                                return [4 /*yield*/, log($, "work ".concat(id, " waited ").concat(mins, " min with nothing to start it again: ").concat(r.isDelivered ? 'started again' : "not reached (".concat(r.reason, "), tried again after the same gap"), " to look at what it waits on"))];
                            case 7:
                                _o.sent();
                                if (!r.isDelivered)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (card) { return (card.id === id && card.ownWait ? __assign(__assign({}, card), { ownWait: __assign(__assign({}, card.ownWait), { done: card.ownWait.done + 1 }) }) : card); }); })];
                            case 8:
                                _o.sent();
                                return [4 /*yield*/, tellChat($, named(OWN_WAIT_IN_CHAT(titleOf(one), mins)))];
                            case 9:
                                _o.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, due_2 = due;
                _c.label = 2;
            case 2:
                if (!(_i < due_2.length)) return [3 /*break*/, 5];
                _a = due_2[_i], id = _a.id, mins = _a.mins, done = _a.done;
                return [5 /*yield**/, _loop_6(id, mins, done)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
// The helpers a piece of work waits on, each by its title and id with what it runs and for how long, for its nudge
var silentHelpers = function (list, id, at) {
    return list
        .filter(function (kid) { return kid.parentId === id && kid.status === 'working'; })
        .map(function (kid) { return "\"".concat(titleOf(kid), "\" (").concat(kid.id, ")").concat(kid.running ? ", ".concat(kid.running.what, " for ").concat(took(at - kid.running.at)) : ''); })
        .join('; ');
};
// What a stuck card says above its line: how long nothing new has come back, and whether its helpers, or it, sit in a long call;
// nothing while a helper of its is at work. What Claudopus did about it is told to Claude and the chat, never said on the card
var stuckLine = function (list, one, at) {
    var _a, _b;
    if (!one.stuckAt)
        return '';
    var mins = Math.max(1, Math.round((at - one.stuckAt) / 60000));
    // A helper at work (a render in the background, a long call, output that changes) is no sign that nothing moves
    if (runningKids(list, one.id).some(function (kid) { return isBusy(list, kid, at); }))
        return '';
    var isLong = function (kid) { return Boolean(kid.running && at - kid.running.at >= RUNNING_SHOWN); };
    var helpers = underOf(list, one.id).filter(function (kid) { return kid.status === 'working'; });
    var tail = helpers.length
        ? helpers.every(isLong) ? " ".concat(helpers.length === 1 ? 'Its helper is still' : helpers.length === 2 ? 'Both helpers are still' : "All ".concat(helpers.length, " helpers are still"), " waiting.") : ''
        : isLong(one) ? " One action has been running for ".concat(took(at - ((_b = (_a = one.running) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : at)), ".") : '';
    return "Nothing new for ".concat(mins, "m.").concat(tail);
};
// ---- What work started in the background itself, which wakes it as it ends ----
var BG_KEPT = 20;
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response wakes nothing and is not kept
var keepBackground = function ($, agent, call, result) { return __awaiter(_this, void 0, void 0, function () {
    var r, id, what, cmd, now, said, told, isForGood, limit;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (call.tool === 'TaskStop' || call.tool === 'KillShell')
                    return [2 /*return*/, dropBackground($, [String((_b = (_a = call.task_id) !== null && _a !== void 0 ? _a : call.shell_id) !== null && _b !== void 0 ? _b : '')], 'stopped')];
                r = (result && typeof result === 'object' ? result : {});
                id = call.tool === 'Bash' ? r.backgroundTaskId : call.tool === 'Monitor' ? r.taskId : undefined;
                if (typeof id !== 'string' || !id || r.backgroundEndsWithFinalResponse)
                    return [2 /*return*/];
                what = oneLine(String((_c = call.description) !== null && _c !== void 0 ? _c : '') || String((_d = call.command) !== null && _d !== void 0 ? _d : '').split('\n')[0] || '').slice(0, 160);
                cmd = oneLine(String((_e = call.command) !== null && _e !== void 0 ? _e : '')).slice(0, 400);
                return [4 /*yield*/, $.clock.now()
                    // A watch ends at the time limit the engine said as it started it ("expires in 30m"), or else the one it was given where that is
                    // within the engine's own 30 minutes; one kept for good has none
                ];
            case 1:
                now = _g.sent();
                said = typeof result === 'string' ? result : JSON.stringify(result !== null && result !== void 0 ? result : '');
                told = (result && typeof result === 'object' ? result : {});
                isForGood = [call.persistent, told.persistent].some(function (p) { return p === true || p === 'true'; });
                limit = call.tool !== 'Monitor' || isForGood ? undefined : Number(told.timeoutMs) > 0 ? Math.min(Number(told.timeoutMs), WATCH_MOST) : ((_f = expiresIn(said)) !== null && _f !== void 0 ? _f : (Number(call.timeout_ms) > 0 ? Math.min(Number(call.timeout_ms), WATCH_MOST) : undefined));
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) { var _a; return (one.id === agent ? __assign(__assign({}, one), { bg: __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return b.id !== id; }), true), [__assign(__assign(__assign({ id: id, what: what, at: now }, (cmd ? { cmd: cmd } : {})), (call.tool === 'Monitor' ? { isWatch: true } : {})), (limit ? { expiresAt: now + limit } : {}))], false).slice(-BG_KEPT) }) : one); });
                    })];
            case 2:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
// The longest the engine lets a watch run before it ends it
var WATCH_MOST = 30 * 60000;
// How a run ended, said plainly: on its card's summary and in Details
var endedWord = function (run) { var _a; return (_a = ({ finished: 'done', failed: 'failed', killed: 'stopped', stopped: 'stopped', 'timed out': 'ran out of time', ended: 'ended' })[run.how]) !== null && _a !== void 0 ? _a : run.how; };
// The same with how long it ran, as a line of its own: "Done in 1m 05s", "Failed after 2m 05s"
var endedLine = function (run, ran) { var _a; return run.how === 'finished' ? "Done in ".concat(ran) : "".concat((_a = { failed: 'Failed', killed: 'Stopped', stopped: 'Stopped', 'timed out': 'Ran out of time', ended: 'Ended' }[run.how]) !== null && _a !== void 0 ? _a : 'Ended', " after ").concat(ran); };
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
var endedSummary = function (helpers, runs) {
    var n = function (count, word) { return "".concat(count, " ").concat(word).concat(count === 1 ? '' : 's'); };
    var head = helpers && runs.length ? "".concat(n(helpers, 'helper'), " and ").concat(n(runs.length, 'command'), " ended") : helpers ? "".concat(n(helpers, 'helper'), " ended") : "".concat(n(runs.length, 'command'), " ended");
    var bad = ['failed', 'killed', 'timed out'].flatMap(function (how) {
        var count = runs.filter(function (r) { return r.how === how; }).length;
        return count ? ["".concat(count, " ").concat(endedWord({ how: how }))] : [];
    });
    return bad.length ? "".concat(head, " \u00B7 ").concat(bad.join(', ')) : head;
};
// The runs a card has had end, kept so its summary row and Details can say how each ended. What one command left going and ended
// in one go is one run, with how many programs it was (17 Nov: twelve rows of "Run Google Chrome" for one test's browser)
var keepEnded = function (one, runs) {
    var _a;
    if (!runs.length)
        return {};
    // (one row however each program ended: the latest end says how the command ended)
    var keyOf = function (run) { return (leftCommandOf(run.id) ? "".concat(leftCommandOf(run.id), "|").concat(run.what) : ''); };
    // (joined with the programs of the same command that ended earlier, in another look, so it stays one row)
    var kept = ((_a = one.endedRuns) !== null && _a !== void 0 ? _a : []).filter(function (r) { return !runs.some(function (n) { return n.id === r.id; }); });
    var joined = runs.reduce(function (all, run) {
        var same = keyOf(run) ? all.find(function (r) { return keyOf(r) === keyOf(run); }) : undefined;
        if (!same)
            return __spreadArray(__spreadArray([], all, true), [run], false);
        return all.map(function (r) { var _a, _b; return (r === same ? __assign(__assign(__assign(__assign({}, r), { at: Math.min(r.at, run.at), endedAt: Math.max(r.endedAt, run.endedAt), how: run.endedAt >= r.endedAt ? run.how : r.how }), (run.endedAt >= r.endedAt ? (run.code ? { code: run.code } : { code: undefined }) : {})), { count: ((_a = r.count) !== null && _a !== void 0 ? _a : 1) + ((_b = run.count) !== null && _b !== void 0 ? _b : 1) }) : r); });
    }, kept);
    // (the newest end goes last, as the list is kept in the order runs ended)
    return { endedRuns: __spreadArray(__spreadArray([], joined.filter(function (r) { return !runs.some(function (n) { return keyOf(n) && keyOf(n) === keyOf(r); }) && !runs.some(function (n) { return n.id === r.id; }); }), true), joined.filter(function (r) { return runs.some(function (n) { return (keyOf(n) && keyOf(n) === keyOf(r)) || n.id === r.id; }); }), true).slice(-BG_KEPT) };
};
var dropBackground = function ($_1, ids_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, ids_1], args_1, true), void 0, function ($, ids, how) {
        var now, endOfId;
        if (how === void 0) { how = 'ended'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.clock.now()];
                case 1:
                    now = _a.sent();
                    endOfId = function (id) {
                        var _a;
                        var one = typeof how === 'string' || 'how' in how ? how : ((_a = how[id]) !== null && _a !== void 0 ? _a : 'ended');
                        return typeof one === 'string' ? { how: one } : one;
                    };
                    return [2 /*return*/, changeTodos($, function (list) {
                            var isGone = function (id) { return ids.includes(id); };
                            if (!list.some(function (one) { var _a; return (_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return isGone(b.id); }); }))
                                return list;
                            return list.map(function (one) {
                                var _a, _b, _c;
                                var bg = (_a = one.bg) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return !isGone(b.id); });
                                if ((bg === null || bg === void 0 ? void 0 : bg.length) === ((_b = one.bg) === null || _b === void 0 ? void 0 : _b.length))
                                    return one;
                                var runs = ((_c = one.bg) !== null && _c !== void 0 ? _c : []).filter(function (b) { return isGone(b.id); }).map(function (b) {
                                    var end = endOfId(b.id);
                                    // It ended when its output last changed, where that is known, else as it was seen gone. A watch the engine killed at the
                                    // time limit it set ran out of time (within a tenth of its limit, at most a minute, as its limit is counted from when the mod saw it start); one killed
                                    // before it was killed
                                    var endedAt = end.at && end.at >= b.at && end.at <= now ? end.at : now;
                                    var how = end.how === 'killed' && b.expiresAt && endedAt >= b.expiresAt - Math.min(60000, (b.expiresAt - b.at) / 10) ? 'timed out' : end.how;
                                    return __assign({ id: b.id, what: b.what, at: b.at, endedAt: endedAt, how: how }, (end.code ? { code: end.code } : {}));
                                });
                                return __assign(__assign(__assign({}, one), { bg: (bg === null || bg === void 0 ? void 0 : bg.length) ? bg : undefined, waitsSince: (bg === null || bg === void 0 ? void 0 : bg.some(function (b) { return !b.isWatch; })) ? one.waitsSince : undefined }), keepEnded(one, runs));
                            });
                        })];
            }
        });
    });
};
// What finished work left running says on its card
var leftLine = function (one, at) { return (one.leftSince && one.status !== 'working' ? "A command Claude started is still running \u00B7 ".concat(took(at - one.leftSince)) : ''); };
// ---- Work that stops partway: started again until it gives its result or asks the person ----
// A task whose step ends with no result, no question for the person and nothing of its own that starts it again is left stopped
// partway: Claude Code ends it, says to the chat that it "ended without delivering a report", and nothing wakes it (17 Nov: tasks
// sat for half an hour and more until the chat or the person noticed). Claudopus starts it again with a note to carry on, a moment
// after its step ends, for as long as its runs get something done. One that stops so this many times in a row with little done
// between, or this many times in all, is left stopped, and its card says so in one line
var CARRY_TRIES = 3;
var CARRY_MOST = 8;
// Steps of a run that count as getting something done: the tries count again from one after it
var CARRY_PROGRESS = 5;
// How long after its step ends it is started again: the engine closes the run first, and a result or a message that comes for it
// meanwhile starts it by itself
var CARRY_AFTER = 5000;
// The card's line that Claudopus started it again shows this long after
var CARRY_SHOWN = 10 * 60000;
// A task whose stop was taken up already, by its id and its step count then: the turn's end, the list's look and the look for work
// that ended unheard may each come to the same stop
var carryTaken = new Set();
// The stops a note was sent for, by the task and when it stopped: one note each, whichever load sends it
var carrySent = new Set();
// A note due that no load sent (the mod reloaded during the wait): sent by the list's look once the wait is well over
var carryDue = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, one;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _i = 0;
                return [4 /*yield*/, read($, todos)];
            case 1:
                _a = (_e.sent()).filter(function (card) { return card.status === 'working' && card.carryOn && !card.carryOn.gaveUp && card.endedStepAt === card.carryOn.at && now - card.carryOn.at >= CARRY_AFTER * 4; });
                _e.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                one = _a[_i];
                if (!(!carrySent.has("".concat(one.id, ":").concat((_b = one.carryOn) === null || _b === void 0 ? void 0 : _b.at)) && !carrying.has(one.id))) return [3 /*break*/, 4];
                return [4 /*yield*/, carryNow($, one.id, (_d = (_c = one.carryOn) === null || _c === void 0 ? void 0 : _c.at) !== null && _d !== void 0 ? _d : 0)];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
var carryKey = function (one) { var _a; return "".concat(one.id, ":").concat((_a = one.steps) !== null && _a !== void 0 ? _a : 0); };
// Whether a task whose step just ended was left stopped partway: one of this chat's tasks, whose words are no result, that has not
// handed back or given a result, is not asking the person something or waiting for their Allow, was not stopped or held by them, did
// not end after a safety flag, and was not given up on
var isStoppedShort = function (one, answer) {
    var _a, _b, _c;
    return Boolean(one &&
        !one.parentId &&
        !one.chat &&
        !isWordsReport(one, answer) &&
        one.handedBackAt === undefined &&
        !one.answeredAt &&
        !endedByHandback.has(one.id) &&
        !(one.ask && !one.ask.replied) &&
        !((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) &&
        !isHeld(one) &&
        !stoppedHere.has(one.id) &&
        !pressed.has(one.id) &&
        !one.flagged &&
        !((_b = one.carryOn) === null || _b === void 0 ? void 0 : _b.gaveUp) &&
        // (a command it left detached starts it again as it ends, and Claude Code's press is answered for it with no model; a server
        // never ends, so never starts it again)
        !((_c = one.detached) === null || _c === void 0 ? void 0 : _c.some(function (d) { return !isServerRun(d.cmd, d.what); })));
};
// Whether Claude Code pressed it for its report as its run ended, after its last call: the sign that its words reached no one (the
// chat is told only that it "ended without delivering a report"). A run where the engine asks for no report, as headless ones, ends
// with its words as its result, and is not started again
var isPressedAtEnd = function (rows) {
    if (!Array.isArray(rows))
        return false;
    for (var _i = 0, _a = __spreadArray([], rows, true).reverse(); _i < _a.length; _i++) {
        var row = _a[_i];
        var m = (row && typeof row === 'object' && 'message' in row ? row.message : row);
        var blocks = Array.isArray(m === null || m === void 0 ? void 0 : m.content) ? m.content : [m === null || m === void 0 ? void 0 : m.content];
        var texts = blocks.map(function (b) { var _a; return (typeof b === 'string' ? b : b && typeof b === 'object' ? String((_a = b.text) !== null && _a !== void 0 ? _a : '') + (typeof b.content === 'string' ? String(b.content) : '') : ''); });
        if ((m === null || m === void 0 ? void 0 : m.role) === 'assistant' && blocks.some(function (b) { return b && typeof b === 'object' && b.type === 'tool_use'; }))
            return false;
        if ((m === null || m === void 0 ? void 0 : m.role) === 'user' && texts.some(function (text) { return text.includes(HANDBACK_PRESS); }))
            return true;
    }
    return false;
};
// (or let end past the times Claudopus kept it going: by then Claude Code has used up its own presses, so none follows its words)
var pressedAtEnd = function ($, id) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
    switch (_d.label) {
        case 0:
            _b = isLetEnd;
            return [4 /*yield*/, read($, todos)];
        case 1:
            _a = _b.apply(void 0, [(_d.sent()).find(function (one) { return one.id === id; })]);
            if (_a) return [3 /*break*/, 3];
            _c = isPressedAtEnd;
            return [4 /*yield*/, $.session.messages({ as: 'api', agentId: id }).catch(function () { return []; })];
        case 2:
            _a = _c.apply(void 0, [_d.sent()]);
            _d.label = 3;
        case 3: return [2 /*return*/, _a];
    }
}); }); };
// A task Claudopus let end its step past the times it kept it going, with to-dos still to do: a stop with no result, as one pressed is
var isLetEnd = function (one) { return Boolean((one === null || one === void 0 ? void 0 : one.keptOn) && openItems(one).length && (one.keptOn.tries > KEEP_TRIES || one.keptOn.total > KEEP_MOST)); };
// The next start's count, or the word that it is given up: a run that got something done since the last start counts from one again
var nextCarry = function (one, now) {
    var _a, _b, _c;
    var was = one.carryOn;
    var tries = was && ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) - was.steps < CARRY_PROGRESS ? was.tries + 1 : 1;
    var total = ((_b = was === null || was === void 0 ? void 0 : was.total) !== null && _b !== void 0 ? _b : 0) + 1;
    return __assign({ tries: tries, total: total, at: now, steps: (_c = one.steps) !== null && _c !== void 0 ? _c : 0 }, (tries > CARRY_TRIES || total > CARRY_MOST ? { gaveUp: now } : {}));
};
// Its step ended so: its card stays at work, and a moment later Claudopus starts it again, unless something else did first. Given
// up, its card ends stopped with its line, and the chat's model is told
var carrying = new Set();
// `isHeard`: its turn's end was heard, a stop of its own however few steps it took; a stop only the list's looks found is taken up once
var goOn = function ($_1, id_1, how_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1, how_1], args_1, true), void 0, function ($, id, how, isHeard) {
        if (isHeard === void 0) { isHeard = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dir || isOff || carrying.has(id))
                        return [2 /*return*/];
                    carrying.add(id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, goOnNow($, id, how, isHeard)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    carrying.delete(id);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var goOnNow = function ($, id, how, isHeard) { return __awaiter(_this, void 0, void 0, function () {
    var now, got, next, _a, title;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _b.sent();
                got = {};
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) {
                            if (one.id !== id || (!isHeard && carryTaken.has(carryKey(one))))
                                return one;
                            var next = nextCarry(one, now);
                            (got.next = next), (got.title = titleOf(one));
                            return next.gaveUp ? __assign(__assign({}, ended(one, 'stopped', now)), { carryOn: next }) : __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now))), { carryOn: next, endedStepAt: now });
                        });
                    })];
            case 2:
                _b.sent();
                next = got.next, _a = got.title, title = _a === void 0 ? '' : _a;
                if (!next)
                    return [2 /*return*/];
                carryTaken.add("".concat(id, ":").concat(next.steps));
                redraw($);
                if (!next.gaveUp) return [3 /*break*/, 5];
                return [4 /*yield*/, log($, "work ".concat(id, " stopped partway without a result ").concat(next.tries > CARRY_TRIES ? "".concat(next.tries, " times in a row") : "".concat(next.total, " times"), " (").concat(how, "): not started again"))];
            case 3:
                _b.sent();
                return [4 /*yield*/, tellChat($, named(CARRY_GAVE_UP_IN_CHAT(title, id)))];
            case 4: return [2 /*return*/, void (_b.sent())];
            case 5: return [4 /*yield*/, log($, "work ".concat(id, " stopped partway without a result (").concat(how, "): started again in a moment, ").concat(next.tries, " of ").concat(CARRY_TRIES))];
            case 6:
                _b.sent();
                $.clock.after(CARRY_AFTER, function () { return void carryNow($, id, next.at).catch(function (err) { return log($, "work ".concat(id, " not started again: ").concat(String(err))); }); });
                return [2 /*return*/];
        }
    });
}); };
var carryNow = function ($, id, at) { return __awaiter(_this, void 0, void 0, function () {
    var stillStopped, one, status, isStill, r, now;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                stillStopped = function () { return __awaiter(_this, void 0, void 0, function () {
                    var card, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                card = (_c.sent()).find(function (c) { return c.id === id; });
                                _a = card && card.status === 'working' && ((_b = card.carryOn) === null || _b === void 0 ? void 0 : _b.at) === at && isStoppedShort(card, '');
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, isReplaced($)];
                            case 2:
                                _a = !(_c.sent());
                                _c.label = 3;
                            case 3: return [2 /*return*/, _a ? card : undefined];
                        }
                    });
                }); };
                return [4 /*yield*/, stillStopped()];
            case 1:
                one = _b.sent();
                if (!one)
                    return [2 /*return*/];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 2:
                status = (_a = (_b.sent()).find(function (agent) { return agent.id === id; })) === null || _a === void 0 ? void 0 : _a.status;
                if (!WORKING.includes(String(status))) return [3 /*break*/, 4];
                return [4 /*yield*/, log($, "work ".concat(id, " was at work again before Claudopus started it: no note sent"))];
            case 3: return [2 /*return*/, void (_b.sent())
                // (one ended from outside Claudopus meanwhile, as the app's own stop, is left as it was ended)
            ];
            case 4:
                if (!(status === 'killed')) return [3 /*break*/, 6];
                return [4 /*yield*/, log($, "work ".concat(id, " was stopped before Claudopus started it: no note sent"))];
            case 5: return [2 /*return*/, void (_b.sent())];
            case 6:
                if (carrySent.has("".concat(id, ":").concat(at)))
                    return [2 /*return*/];
                carrySent.add("".concat(id, ":").concat(at));
                isStill = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d, _e; var _f; return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _b = Boolean;
                            return [4 /*yield*/, stillStopped()];
                        case 1:
                            _a = _b.apply(void 0, [_g.sent()]);
                            if (!_a) return [3 /*break*/, 3];
                            _d = (_c = WORKING).includes;
                            _e = String;
                            return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                        case 2:
                            _a = !_d.apply(_c, [_e.apply(void 0, [(_f = (_g.sent()).find(function (agent) { return agent.id === id; })) === null || _f === void 0 ? void 0 : _f.status])]);
                            _g.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                }); }); };
                return [4 /*yield*/, sendOwn($, { to: { agentId: id }, text: named(STOPPED_SHORT_GO_ON + (openItems(one).length ? STILL_TO_DO(openItems(one).map(function (item) { return item.text; })) : '')) }, isStill).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
            case 7:
                r = _b.sent();
                if (!r.isDelivered) return [3 /*break*/, 9];
                return [4 /*yield*/, log($, "work ".concat(id, " started again to carry on"))];
            case 8: return [2 /*return*/, void (_b.sent())
                // (no longer wanted as it went: it had moved on by itself)
            ];
            case 9: return [4 /*yield*/, isStill()];
            case 10:
                if (!!(_b.sent())) return [3 /*break*/, 12];
                return [4 /*yield*/, log($, "work ".concat(id, " moved on before Claudopus started it: no note sent"))];
            case 11: return [2 /*return*/, void (_b.sent())];
            case 12: return [4 /*yield*/, $.clock.now()];
            case 13:
                now = _b.sent();
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { var _a; return (card.id === id && card.status === 'working' ? __assign(__assign({}, ended(card, 'stopped', now)), { carryOn: __assign(__assign({}, ((_a = card.carryOn) !== null && _a !== void 0 ? _a : nextCarry(card, now))), { gaveUp: now, isLost: true }) }) : card); }); })];
            case 14:
                _b.sent();
                redraw($);
                return [4 /*yield*/, log($, "work ".concat(id, " could not be started again to carry on: ").concat(r.reason))];
            case 15:
                _b.sent();
                return [4 /*yield*/, tellChat($, named(CARRY_LOST_IN_CHAT(titleOf(one), id)))];
            case 16:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// ---- A task goes on until its to-dos are done ----
// A task that ends its step with to-dos still to do and nothing of its own running that starts it again would stop there: Claude
// Code presses it three times for its report, and it hands back what it has or nothing (16-17 Nov: since tasks stopped waiting on
// their helpers with a command, 83% of tasks were pressed, 27% handed back with to-dos not done and 8% ended without a result).
// Claudopus keeps such a step from ending, as Claude Code lets a stop hook do: the task goes on in the same run, told what is still
// to do and that nothing of its own would start it again. Kept this many times in a row with no call between, or this many times
// in all with no to-do ticked between (a task polling something Claudopus does not follow), its step ends, and carrying it on
// (above) is the net
var KEEP_TRIES = 3;
var KEEP_MOST = 6;
// Why the task ending its step now should go on instead, or '' to let it end: one of this chat's tasks at work, with to-dos still to
// do, that has not handed back, is not stopped partway for a reason of its own (isStoppedShort: a question for the person, their
// Allow, their stop or hold, a safety flag, a detached command), and has nothing of its own that starts it again: no command in the
// background, no helper at work, nothing it asked Claudopus to wake it for, and no command held for its turn
var keepGoingWhy = function (list, id) {
    var one = list.find(function (card) { return card.id === id; });
    var open = openItems(one);
    if (!one || isOff || !dir || one.status !== 'working' || !open.length || handedBack.has(id) || one.mayHandBack !== undefined)
        return '';
    if (!isStoppedShort(one, '') || wakesOf(list, one).isAny)
        return '';
    return named(KEEP_GOING(open.map(function (item) { return item.text; })));
};
// Its step's end: kept from ending while it should go on, counting the times in a row with no call of its own between
var keepGoing = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var why;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                why = '';
                return [4 /*yield*/, changeTodos($, function (list) {
                        why = keepGoingWhy(list, id);
                        return list.map(function (one) {
                            var _a, _b;
                            if (one.id !== id)
                                return one;
                            if (!why)
                                return one.keptOn ? __assign(__assign({}, one), { keptOn: undefined }) : one;
                            var was = one.keptOn;
                            var done = one.items.filter(function (item) { return item.state === 'done'; }).length;
                            var tries = was && was.steps === ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) ? was.tries + 1 : 1;
                            var total = was && was.done === done ? was.total + 1 : 1;
                            if (tries > KEEP_TRIES || total > KEEP_MOST)
                                why = '';
                            return __assign(__assign({}, one), { keptOn: { tries: tries, steps: (_b = one.steps) !== null && _b !== void 0 ? _b : 0, total: total, done: done } });
                        });
                    })];
            case 1:
                _a.sent();
                if (!why) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "work ".concat(id, " ended its step with to-dos still to do and nothing of its own running: kept going"))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, why];
        }
    });
}); };
// Its report handed back with to-dos not done: refused, with what is still to do. Sent again with the same to-dos still to do, it
// goes through once it says what is not done, or at the third try whatever it says (Claude Code presses for a report at the same
// moment Claudopus keeps a task going, so a report sent only because of that press is refused again), and those to-dos show as not
// done on its card and in its result
var NOT_TICKED_MOST = 2;
var untickedAtHandback = function ($, id, message) { return __awaiter(_this, void 0, void 0, function () {
    var one, open, key, times, says;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_b.sent()).find(function (card) { return card.id === id; });
                open = openItems(one).map(function (item) { return item.text; });
                if (!one || isOff || !dir || one.parentId || one.chat || !open.length || one.flagged)
                    return [2 /*return*/, ''];
                key = open.join('\n');
                times = ((_a = one.toldOpen) === null || _a === void 0 ? void 0 : _a.key) === key ? one.toldOpen.times : 0;
                says = /\bnot done\b/i.test(message);
                if (times >= NOT_TICKED_MOST || (says && (times > 0 || open.every(function (item) { return message.includes(item); }))))
                    return [2 /*return*/, ''];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === id ? __assign(__assign({}, card), { toldOpen: { key: key, times: times + 1 } }) : card); }); })];
            case 2:
                _b.sent();
                return [4 /*yield*/, log($, "work ".concat(id, " handed back with ").concat(open.length, " to-dos still to do: refused once"))];
            case 3:
                _b.sent();
                return [2 /*return*/, named(NOT_TICKED(open))];
        }
    });
}); };
// What it handed back with still to do, kept once its report went through
var keepNotDone = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var one, open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_a.sent()).find(function (card) { return card.id === id; });
                if (!one || one.parentId)
                    return [2 /*return*/];
                open = openItems(one).map(function (item) { return item.text; });
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === id ? __assign(__assign({}, card), { notDone: open.length ? open : undefined, toldOpen: undefined, keptOn: undefined }) : card); }); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The card's line for a task that sent its result with to-dos not done, while it is not at work again or waiting on the person
var notDoneLine = function (one) {
    var _a;
    var left = one.status === 'working' || one.chat || (one.ask && !one.ask.replied) || isReleased(one) ? [] : ((_a = one.notDone) !== null && _a !== void 0 ? _a : []);
    return left.length ? "Not done \u00B7 ".concat(left.join(' · ')) : '';
};
// A result's lines for the to-dos its task left not done and still has not done, when it says nothing of what is not done itself
// (named in its own words, a to-do it left is on its card already)
var notDoneLines = function (one, text) {
    var _a;
    var open = new Set(openItems(one).map(function (item) { return item.text; }));
    var left = /\bnot done\b/i.test(text) ? [] : ((_a = one.notDone) !== null && _a !== void 0 ? _a : []).filter(function (item) { return open.has(item); });
    return left.length ? "\n\nNot done:\n".concat(left.map(function (item) { return "- ".concat(item); }).join('\n')) : '';
};
// A task Claudopus stopped starting again stays in its place, its line in sight, as a task cut off that could not be started again does
var isLeftStopped = function (one, at) { var _a; return Boolean(((_a = one.carryOn) === null || _a === void 0 ? void 0 : _a.gaveUp) && one.status !== 'working' && at - one.carryOn.gaveUp < CUT_OLD); };
// And so does a task that sent its result with to-dos left, shown not done (shownAs): never folded away under Finished at once
var isLeftOpen = function (one, at) { return Boolean(one.leftOpen && !one.chat && at - one.endedAt < CUT_OLD); };
// The line on its card once it was left stopped, in amber; while Claudopus starts it again its card says nothing of it
var carryLine = function (one) {
    var c = one.carryOn;
    if (!(c === null || c === void 0 ? void 0 : c.gaveUp) || one.status === 'working')
        return '';
    return c.isLost ? "Stopped partway at ".concat(hhmm(c.gaveUp), " \u00B7 Claudopus couldn't start it again \u00B7 send it a message to carry on") : "Stopped partway ".concat(c.tries > CARRY_TRIES ? c.tries : c.total, " times without a result \u00B7 Claudopus stopped starting it again \u00B7 send it a message to carry on");
};
