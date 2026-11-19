// Work that stops moving: what each piece of work is running now and since when, when something new last came back to it, and the
// card of work under which nothing new has come back for STUCK_AFTER
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
// What each agent's last call returned, whole, and when a call last returned something different: a frame count that moves on is
// output that changed, a call that says what the last one said is not
var lastResult = new Map();
var changedAt = new Map();
// The calls running now, by tool_use_id: whose, what, since when
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
    var note = ownNote(one);
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
var runningKids = function (list, id) { return list.filter(function (kid) { return kid.parentId === id && kid.status === 'working'; }); };
// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
var movedAt = function (list, top) { return Math.max.apply(Math, __spreadArray([top], underOf(list, top.id), true).map(function (one) { var _a; return Math.max(one.startedAt, one.endedAt, (_a = one.newAt) !== null && _a !== void 0 ? _a : 0); })); };
// Looked at as the list is followed: a task at a step under which nothing new has come back for STUCK_AFTER is flagged, and the
// chat is told once; it clears when something does. Not a task that waits for the person, nor one with a command or a helper of
// its own running, which it has every right to wait for however long that lasts
var lookStuck = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, told, _loop_1, _i, told_1, one, list, _loop_2, _a, _b, agent, _loop_3, _c, _d, agent;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _e.sent();
                told = [];
                return [4 /*yield*/, changeTodos($, function (list) {
                        // Told afresh on each run of the change, as it runs again on a list written meanwhile
                        told.length = 0;
                        var isChanged = false;
                        var isPrompted = function (one) { return waiting.some(function (p) { return p.agent && topOf(list, p.agent) === one.id; }); };
                        var next = list.map(function (one) {
                            var _a;
                            if (one.parentId || one.chat)
                                return one;
                            // A task that moved again since the chat was told is no longer what the chat was told: flagged and told afresh if it is stuck again
                            if (one.stuckTold !== undefined && movedAt(list, one) > one.stuckTold)
                                ((isChanged = true), (one = __assign(__assign({}, one), { stuckTold: undefined, stuckAt: undefined })));
                            var isStuck = stageOf(list, one) === 'working' && !one.ask && !((_a = one.bg) === null || _a === void 0 ? void 0 : _a.length) && !runningKids(list, one.id).length && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER;
                            if (isStuck && !one.stuckAt)
                                return ((isChanged = true), told.push(one), __assign(__assign({}, one), { stuckAt: movedAt(list, one) }));
                            if (!isStuck && one.stuckAt)
                                return ((isChanged = true), __assign(__assign({}, one), { stuckAt: undefined, stuckTold: undefined }));
                            return one;
                        });
                        return isChanged ? next : list;
                    })];
            case 2:
                _e.sent();
                _loop_1 = function (one) {
                    var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0: return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (card) { return (card.id === one.id ? __assign(__assign({}, card), { stuckTold: now }) : card); }); })];
                            case 1:
                                _r.sent();
                                _f = tellChat;
                                _g = [$];
                                _h = named;
                                _j = "".concat;
                                _k = STUCK_IN_CHAT;
                                _l = [titleOf(one)];
                                _o = (_m = Math).round;
                                _p = now;
                                _q = movedAt;
                                return [4 /*yield*/, read($, todos)];
                            case 2: return [4 /*yield*/, _f.apply(void 0, _g.concat([_h.apply(void 0, [_j.apply("", [_k.apply(void 0, _l.concat([_o.apply(_m, [(_p - _q.apply(void 0, [_r.sent(), one])) / 60000])])), " "]).concat(STUCK_ASK)])]))];
                            case 3:
                                _r.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, told_1 = told;
                _e.label = 3;
            case 3:
                if (!(_i < told_1.length)) return [3 /*break*/, 6];
                one = told_1[_i];
                return [5 /*yield**/, _loop_1(one)];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, read($, todos)];
            case 7:
                list = _e.sent();
                _loop_2 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        seenLines.delete(agent);
                };
                for (_a = 0, _b = seenLines.keys(); _a < _b.length; _a++) {
                    agent = _b[_a];
                    _loop_2(agent);
                }
                _loop_3 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        (lastResult.delete(agent), changedAt.delete(agent));
                };
                for (_c = 0, _d = __spreadArray([], lastResult.keys(), true); _c < _d.length; _c++) {
                    agent = _d[_c];
                    _loop_3(agent);
                }
                return [2 /*return*/];
        }
    });
}); };
// ---- What a task started in the background itself, as Claude Code tracks it: the only rows its card has ----
var BG_KEPT = 20;
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response is not kept
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
                        return list.map(function (one) { var _a; return (one.id === agent ? __assign(__assign({}, one), { bg: __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return b.id !== id; }), true), [__assign(__assign(__assign({ id: id, what: what, at: now }, (cmd ? { cmd: cmd } : {})), (call.tool === 'Monitor' || waitingOf(cmd) || describedOf(what).kind === 'watch' ? { isWatch: true } : {})), (limit ? { expiresAt: now + limit } : {}))], false).slice(-BG_KEPT) }) : one); });
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
// Those that did not finish well are named, the newest of each kind of end and how many more, so "1 failed" never stands without
// which one (19 Nov "13 commands ended · 1 failed" named nothing); not one that has a row of its own above (`shown`, its id)
// An ended command's name, as its row had it while it ran: its own words, or else what it ran in a few words, never its shell
// line (19 Nov: "cd /Users/…; S=/private/tmp/…" and "until [ -f /private/…" stood as names under Commands ended)
var runLabel = function (run) { var _a; return endedName(String((_a = run.what) !== null && _a !== void 0 ? _a : ''), run.cmd); };
// (counts only, never which: a name on the row was more than it needs, and which one is a press away in Details, 19 Nov;
// `lost`: how many helpers failed, said as helpers so their count is never taken for the commands')
var endedSummary = function (helpers, runs, lost) {
    if (lost === void 0) { lost = 0; }
    var n = function (count, word) { return "".concat(count, " ").concat(word).concat(count === 1 ? '' : 's'); };
    var head = helpers && runs.length ? "".concat(n(helpers, 'helper'), " and ").concat(n(runs.length, 'command'), " ended") : helpers ? "".concat(n(helpers, 'helper'), " ended") : "".concat(n(runs.length, 'command'), " ended");
    var bad = ['failed', 'killed', 'timed out'].flatMap(function (how) {
        var count = runs.filter(function (r) { return r.how === how; }).length;
        return count ? ["".concat(count, " ").concat(endedWord({ how: how }))] : [];
    });
    return __spreadArray(__spreadArray([head], (lost ? ["".concat(n(lost, 'helper'), " failed")] : []), true), (bad.length ? [bad.join(', ')] : []), true).join(' · ');
};
// The runs a card has had end, kept so its summary row and Details can say how each ended, the newest last
var keepEnded = function (one, runs) { var _a; return (runs.length ? { endedRuns: __spreadArray(__spreadArray([], ((_a = one.endedRuns) !== null && _a !== void 0 ? _a : []).filter(function (r) { return !runs.some(function (n) { return n.id === r.id; }); }), true), runs, true).slice(-BG_KEPT) } : {}); };
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
                                    var _a;
                                    var end = endOfId(b.id);
                                    // It ended when its output last changed, where that is known, else as it was seen gone. A watch the engine killed at the
                                    // time limit it set ran out of time (within a tenth of its limit, at most a minute, as its limit is counted from when the mod saw it start); one killed
                                    // before it was killed
                                    var endedAt = end.at && end.at >= b.at && end.at <= now ? end.at : now;
                                    var how = end.how === 'killed' && b.expiresAt && endedAt >= b.expiresAt - Math.min(60000, (b.expiresAt - b.at) / 10) ? 'timed out' : end.how;
                                    // With its kind, for its mark, why it failed, and the file it wrote to, which a press on its name opens
                                    var kind = b.isWatch ? 'watch' : jobKindOf((_a = b.cmd) !== null && _a !== void 0 ? _a : b.what, b.what);
                                    var file = jobFiles.get(b.id);
                                    return __assign(__assign(__assign(__assign(__assign({ id: b.id, what: b.what }, (b.cmd ? { cmd: b.cmd.slice(0, 400) } : {})), { at: b.at, endedAt: endedAt, how: how, kind: kind }), (end.code ? { code: end.code } : {})), (end.why ? { why: end.why } : {})), (file ? { file: file } : {}));
                                });
                                return __assign(__assign(__assign({}, one), { bg: (bg === null || bg === void 0 ? void 0 : bg.length) ? bg : undefined }), keepEnded(one, runs));
                            });
                        })];
            }
        });
    });
};
// ---- One rule against stopping early, and the gate at the hand-back ----
// A task may not stop while to-dos are left, nothing of its own runs and nothing waits for the person: it carries on, asks, or
// hands in its result after dropping what will not be done. Why its stop is refused, or '' to let it stop. Asked inside its own run
// as it stops (the SubagentStop hook), where Claude Code's own `stop_hook_active` keeps it from being asked twice in a row
var stopRefused = function (list, id) {
    var one = list.find(function (card) { return card.id === id; });
    var open = openItems(one);
    if (!one || isOff || !dir || one.parentId || one.chat || one.status !== 'working' || one.flagged || !open.length)
        return '';
    if (isHeld(one) || stoppedHere.has(id) || pressed.has(id) || ownsWork(list, one) || needsPerson(one))
        return '';
    return named(MAY_NOT_STOP(open.map(function (item) { return item.text; })));
};
// Its result handed in: refused, every time, while a to-do is open, a helper of its is at work, or a command of its own that is no
// server still runs. Why, or '' when it goes through
var handbackRefused = function (list, id) {
    var one = list.find(function (card) { return card.id === id; });
    if (!one || isOff || !dir || one.chat || one.flagged || flowAgents.has(id))
        return '';
    var open = openItems(one).map(function (item) { return item.text; });
    if (open.length)
        return named(NOT_HANDED_TODOS(open));
    var helpers = helpersAtWork(list, id).map(titleOf);
    if (helpers.length)
        return named(NOT_HANDED_HELPERS(helpers));
    var runs = ownRuns(one).map(function (b) { return runWords(b.what, b.cmd); });
    return runs.length ? named(NOT_HANDED_RUNS(runs)) : '';
};
