// The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var waiting = [];
var asked = [];
var inputKey = function (input) { return JSON.stringify(input !== null && input !== void 0 ? input : null).slice(0, 2000); };
var askedFor = function (agent, tool, input) {
    var _a;
    var same = asked.filter(function (one) { return one.agent === (agent !== null && agent !== void 0 ? agent : '') && one.tool === tool; });
    var one = (_a = same.find(function (other) { return other.input === inputKey(input); })) !== null && _a !== void 0 ? _a : same.at(-1);
    if (one)
        asked = asked.filter(function (other) { return other !== one; });
    return one === null || one === void 0 ? void 0 : one.id;
};
var promptOf = function (tool, input, list) {
    var _a, _b, _c, _d, _e;
    var given = (input && typeof input === 'object' ? input : {});
    var field = function (key) { return (typeof given[key] === 'string' ? oneLine(given[key]) : ''); };
    var whole = function (key, max) { return (typeof given[key] === 'string' ? cut(given[key].trim(), max) : ''); };
    var file = function (path) { var _a; return (_a = path.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : ''; };
    var workNamed = function (id) {
        var _a;
        if (!id)
            return 'another task';
        if (id === 'main' || id === 'parent')
            return 'its chat';
        var card = (_a = list.find(function (one) { return one.id === id; })) !== null && _a !== void 0 ? _a : list.find(function (one) { return id.startsWith(one.id); });
        return card ? "the task \u201C".concat(titleOf(card), "\u201D") : 'another task';
    };
    var allow = function (text, detail, about) {
        if (detail === void 0) { detail = ''; }
        if (about === void 0) { about = ''; }
        return (__assign(__assign({ text: "".concat(text, "?"), kind: 'allow' }, (about ? { about: about } : {})), (detail ? { detail: detail } : {})));
    };
    if (tool === 'Bash' || tool === 'PowerShell')
        return allow('Run this command', whole('command', 400), cut(field('description'), 160));
    if (tool === 'Write')
        return allow("Write the file ".concat(file(field('file_path')) || 'a file'), field('file_path'));
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return allow("Change the file ".concat(file(field('file_path') || field('notebook_path')) || 'a file'), field('file_path') || field('notebook_path'));
    if (tool === 'Read')
        return allow("Read the file ".concat(file(field('file_path')) || 'a file'), field('file_path'));
    if (tool === 'Glob' || tool === 'Grep')
        return allow("Search files for ".concat(cut(field('pattern'), 80) || 'a pattern'), field('path'));
    if (tool === 'WebFetch')
        return allow("Open a web page on ".concat((_b = (_a = field('url').match(/^https?:\/\/([^/?#]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 'the web'), field('url'));
    if (tool === 'WebSearch')
        return allow("Search the web for \u201C".concat(cut(field('query'), 80), "\u201D"));
    if (tool === 'SendMessage') {
        var to = workNamed(field('to'));
        return allow(to === 'its chat' ? 'Send this message to its chat' : "Send this message to ".concat(to), whole('message', 400) || field('summary'));
    }
    if (tool === 'Agent' || tool === 'Task')
        return allow("Start the task \u201C".concat(cut(field('description'), 90) || 'with no title', "\u201D"), whole('prompt', 300));
    if (tool === 'TaskStop')
        return allow("Stop ".concat(workNamed(field('task_id') || field('id'))));
    if (tool === 'Skill')
        return allow("Use the skill \u201C".concat(field('skill') || field('name'), "\u201D"));
    if (tool === 'AskUserQuestion') {
        var first = Array.isArray(given.questions) ? (_c = given.questions[0]) === null || _c === void 0 ? void 0 : _c.question : undefined;
        return { text: typeof first === 'string' && first.trim() ? cut(oneLine(first), 160) : 'It has a question for you', kind: 'question' };
    }
    if (tool === 'ExitPlanMode')
        return { text: 'Approve this plan?', kind: 'plan', detail: whole('plan', 400) };
    var mcp = tool.match(/^mcp__(.+?)__(.+)$/);
    var words = field('description') || field('text') || field('query') || field('title') || field('name') || field('url');
    if (mcp)
        return allow("Use \u201C".concat(((_d = mcp[2]) !== null && _d !== void 0 ? _d : '').replace(/_/g, ' '), "\u201D from ").concat(((_e = mcp[1]) !== null && _e !== void 0 ? _e : '').replace(/^plugin_[^_]+_/, '').replace(/[_-]/g, ' ')), '', cut(words, 300));
    return allow('Use one of its tools', '', cut(words, 160));
};
// The start of a command up to its first quote, `$` or line break, as a running shell shows it whatever the quoting
var snippetOf = function (tool, input) {
    var _a, _b;
    if (tool !== 'Bash')
        return '';
    var head = ((_b = String((_a = input === null || input === void 0 ? void 0 : input.command) !== null && _a !== void 0 ? _a : '').split(/['"\\\n$`]/)[0]) !== null && _b !== void 0 ? _b : '').trimEnd();
    return head.trim().length >= 4 ? head.slice(0, 80) : '';
};
// How many of Claude's shells on this Mac run a command that starts so (the Bash tool runs it as `eval '<command>'`): counted as its
// prompt opens, so only one more than then is this call's
var running = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['ps', '-ww', '-x', '-o', 'args='], { timeoutMs: 5000 })];
            case 1:
                r = _a.sent();
                return [2 /*return*/, r.exitCode === 0 ? r.stdout.split('\n') : undefined];
        }
    });
}); };
var countOf = function (lines, snippet) { return lines.filter(function (line) { return line.includes("eval '".concat(snippet)); }).length; };
var opened = function ($, agent, tool, input) { return __awaiter(_this, void 0, void 0, function () {
    var at, id, list, card, strings, one;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _b.sent();
                id = (_a = askedFor(agent, tool, input)) !== null && _a !== void 0 ? _a : "pr-".concat(at, "-").concat(Math.random().toString(36).slice(2, 8));
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _b.sent();
                card = agent !== undefined ? list.find(function (one) { return one.id === topOf(list, agent); }) : undefined;
                strings = Object.fromEntries(Object.entries(input && typeof input === 'object' ? input : {}).filter(function (_a) {
                    var value = _a[1];
                    return typeof value === 'string';
                }));
                one = __assign(__assign(__assign({ id: id }, promptOf(tool, input, list)), (card ? { title: titleOf(card), card: card.id } : {})), { at: at, tool: tool, agent: agent !== null && agent !== void 0 ? agent : '', snippet: snippetOf(tool, input), input: strings });
                waiting = __spreadArray(__spreadArray([], waiting.filter(function (other) { return other.id !== id; }), true), [one], false);
                redraw($);
                void shareMine($).catch(function () { return undefined; });
                // The count to start from is taken beside the prompt, never in its way
                if (one.snippet)
                    void running($)
                        .then(function (lines) { return void (lines && (waiting = waiting.map(function (other) { return (other.id === id ? __assign(__assign({}, other), { seen: countOf(lines, one.snippet) }) : other); }))); })
                        .catch(function () { return undefined; });
                return [2 /*return*/, id];
        }
    });
}); };
// The app says a prompt is still waiting (its own "needs your permission", a few seconds on): it is told aloud once, as an ask is.
// A prompt answered before that is never told
var tellWaiting = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var due, title, chat, _i, due_1, one;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                due = waiting.filter(function (one) { return !one.isTold; });
                if (!due.length)
                    return [2 /*return*/];
                waiting = waiting.map(function (one) { return (__assign(__assign({}, one), { isTold: true })); });
                return [4 /*yield*/, read($, me)];
            case 1:
                title = (_b.sent()).title;
                chat = title.trim() || cwd.split('/').filter(Boolean).pop() || 'A chat';
                _i = 0, due_1 = due;
                _b.label = 2;
            case 2:
                if (!(_i < due_1.length)) return [3 /*break*/, 5];
                one = due_1[_i];
                return [4 /*yield*/, aloud($, 'prompt', "".concat((_a = one.title) !== null && _a !== void 0 ? _a : chat, " has a question for you"), one.text, "prompt-".concat(one.id)).catch(function (err) { return log($, "prompt not told: ".concat(String(err))); })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
// The prompt of a call goes as its call ends or is seen running: by its id, else the oldest one of the same loop and tool whose id
// was not known. A wait for its press ends with it (promptWaits)
var settle = function ($, id, agent, tool, args) {
    var _a, _b, _c;
    var byTool = function (one) { return one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent !== null && agent !== void 0 ? agent : ''); };
    // The same call as the prompt asked about: every word it asked with is the call's own
    var isSameCall = function (one) { var _a, _b; return Boolean(args) && Object.keys((_a = one.input) !== null && _a !== void 0 ? _a : {}).length > 0 && Object.entries((_b = one.input) !== null && _b !== void 0 ? _b : {}).every(function (_a) {
        var key = _a[0], value = _a[1];
        return (args === null || args === void 0 ? void 0 : args[key]) === value;
    }); };
    var gone = (_a = waiting.find(function (one) { return one.id === id; })) !== null && _a !== void 0 ? _a : (tool ? ((_b = waiting.find(function (one) { return byTool(one) && isSameCall(one); })) !== null && _b !== void 0 ? _b : waiting.find(byTool)) : undefined);
    if (!gone)
        return;
    waiting = waiting.filter(function (one) { return one !== gone; });
    (_c = promptWaits.get(gone.id)) === null || _c === void 0 ? void 0 : _c(undefined);
    redraw($);
    void shareMine($).catch(function () { return undefined; });
};
var IN_HOOK = 'CLAUDOPUS_IN_HOOK';
// Asked of the engine itself: the mod's own hook answers this name (promptHooks), and the engine leaves that hook out exactly
// where it would leave the mod's hooks out of a task started from here
var isInHook = function ($) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, $.env.get('CLAUDOPUS_IN_HOOK').catch(function () { return undefined; })];
        case 1: return [2 /*return*/, (_a.sent()) === 'hook'];
    }
}); }); };
var heldSends = [];
var sendOwnNow = function ($, message) { return __awaiter(_this, void 0, void 0, function () {
    var since;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                since = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, $.session.send(message)];
            case 3: return [2 /*return*/, _a.sent()];
            case 4:
                ownSent($, since);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// `isLater`: asked from a hook the task it starts must keep (a tool call's), it waits for the next hook that may send it, as one
// asked from no hook does
var sendOwn = function ($_1, message_1, isStill_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, message_1, isStill_1], args_1, true), void 0, function ($, message, isStill, isLater) {
        var _a, same, one;
        if (isLater === void 0) { isLater = false; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = !isLater;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, isInHook($)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/, sendOwnNow($, message)
                            // (the same words for the same task wait once: a look that comes round again while they wait joins them)
                        ];
                    same = heldSends.find(function (one) { return one.message.to.agentId === message.to.agentId && one.message.text === message.text; });
                    if (same === null || same === void 0 ? void 0 : same.result)
                        return [2 /*return*/, same.result];
                    one = { message: message, isStill: isStill, resolve: function () { return undefined; }, reject: function () { return undefined; } };
                    one.result = new Promise(function (resolve, reject) { return ((one.resolve = resolve), (one.reject = reject)); });
                    heldSends.push(one);
                    redraw($);
                    void log($, "a message for ".concat(message.to.agentId, " waits for a hook of the mod: sent from here, the task would run unseen by Claudopus"));
                    return [2 /*return*/, one.result];
            }
        });
    });
};
// (never to a task the person stopped while it waited, nor one no longer wanted)
var sendOne = function ($_1, _a) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, _a], args_1, true), void 0, function ($, _b, text) {
        var id, _c, _d, _e;
        var message = _b.message, isStill = _b.isStill, resolve = _b.resolve, reject = _b.reject;
        if (text === void 0) { text = message.text; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    id = message.to.agentId;
                    _c = stoppedHere.has(id);
                    if (_c) return [3 /*break*/, 2];
                    _d = isHeld;
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    _c = _d.apply(void 0, [(_f.sent()).find(function (card) { return card.id === id; })]);
                    _f.label = 2;
                case 2:
                    if (_c)
                        return [2 /*return*/, resolve({ isDelivered: false, reason: 'the person stopped it meanwhile' })];
                    _e = isStill;
                    if (!_e) return [3 /*break*/, 4];
                    return [4 /*yield*/, isStill().catch(function () { return false; })];
                case 3:
                    _e = !(_f.sent());
                    _f.label = 4;
                case 4:
                    if (_e)
                        return [2 /*return*/, resolve({ isDelivered: false, reason: 'no longer wanted by the time it could be sent' })];
                    return [4 /*yield*/, sendOwnNow($, __assign(__assign({}, message), { text: text })).then(resolve, reject)];
                case 5:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Sends what waits, from inside the hook that calls it: a drawing of the bar or the panel, a press, a reply, a change in how full
// the chat is, and a hook kept only for this before each tool call (promptHooks). Never from a tool call's hook, nor from the hooks that hear a turn end or a message come:
// the engine leaves the hook a message is sent from out of the run it starts, and a task must keep those
var isSendingHeld = false;
var sendHeld = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, idle, one;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!heldSends.length || isSendingHeld)
                    return [2 /*return*/];
                isSendingHeld = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, , 14, 15]);
                return [4 /*yield*/, isInHook($)];
            case 2:
                _a = !(_b.sent());
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, isReplaced($)];
            case 3:
                _a = (_b.sent());
                _b.label = 4;
            case 4:
                if (_a)
                    return [2 /*return*/];
                idle = 0;
                _b.label = 5;
            case 5:
                if (!(idle < 4)) return [3 /*break*/, 13];
                one = heldSends.shift();
                _b.label = 6;
            case 6:
                if (!one) return [3 /*break*/, 10];
                idle = 0;
                return [4 /*yield*/, sendOne($, one)];
            case 7:
                _b.sent();
                return [4 /*yield*/, log($, "the message that waited for ".concat(one.message.to.agentId, " went from a hook: its task runs where Claudopus sees it"))];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                one = heldSends.shift();
                return [3 /*break*/, 6];
            case 10: return [4 /*yield*/, $.clock.now().catch(function () { return undefined; })];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                idle += 1;
                return [3 /*break*/, 5];
            case 13: return [3 /*break*/, 15];
            case 14:
                isSendingHeld = false;
                return [7 /*endfinally*/];
            case 15: return [2 /*return*/];
        }
    });
}); };
var ownSent = function ($, since) {
    var own = waiting.filter(function (one) { return one.id.startsWith('toolu_plugin_') && OWN_CALLS.includes(one.tool) && one.at >= since; });
    if (!own.length)
        return;
    waiting = waiting.filter(function (one) { return !own.includes(one); });
    redraw($);
    void shareMine($).catch(function () { return undefined; });
};
// A command allowed starts at once: a process on this Mac running it ends its prompt before the command itself ends
var isLooking = false;
var lookForStarted = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var sought, lines, _i, sought_1, one;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sought = waiting.filter(function (one) { return one.snippet && one.seen !== undefined; });
                if (!sought.length || isLooking)
                    return [2 /*return*/];
                isLooking = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, , 3, 4]);
                return [4 /*yield*/, running($)];
            case 2:
                lines = _b.sent();
                if (!lines)
                    return [2 /*return*/];
                for (_i = 0, sought_1 = sought; _i < sought_1.length; _i++) {
                    one = sought_1[_i];
                    if (countOf(lines, one.snippet) > ((_a = one.seen) !== null && _a !== void 0 ? _a : 0))
                        settle($, one.id);
                }
                return [3 /*break*/, 4];
            case 3:
                isLooking = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// What each held prompt's wait ends with: Allow or Don't allow pressed on its block, or nothing as its call ended first
var promptWaits = new Map();
var promptHeld = new Set();
// The longest a prompt waits for a press: past it the hook hands the prompt back to whatever else answers it
var HOLD_LONGEST = 10 * 60000;
var PRESSED_NO = "The person pressed Don't allow on this in the Claudopus panel. It didn't run. Wait for what they say next.";
var PRESSED_NO_WORK = "The person pressed Don't allow on this in the Claudopus panel. It didn't run: don't try it another way; continue without it.";
var markHeld = function ($, id, isHeld) {
    waiting = waiting.map(function (one) { return (one.id !== id ? one : isHeld ? __assign(__assign({}, one), { isHeld: true }) : (function (_a) {
        var _held = _a.isHeld, rest = __rest(_a, ["isHeld"]);
        return rest;
    })(one)); });
    redraw($);
    void shareMine($).catch(function () { return undefined; });
};
// Holds the prompt until a press on its block, its call ends (Claude Code's own box was answered), the engine gives up on the hook,
// or this copy of the mod is replaced. The wait is a promise the press resolves, as the admin gate's is (heldStep keeps the hook's
// own clock stopped meanwhile). Its buttons show only while it is held
var holdPrompt = function ($, next, id) { return __awaiter(_this, void 0, void 0, function () {
    var isOver, said, end, pressed, stop, _a;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                promptHeld.add(id);
                markHeld($, id, true);
                isOver = false;
                end = function () { return undefined; };
                pressed = new Promise(function (resolve) { return (end = function (one) { return ((isOver = true), (said = one), resolve(one)); }); });
                promptWaits.set(id, end);
                stop = function () { return end(undefined); };
                (_b = next.signal) === null || _b === void 0 ? void 0 : _b.addEventListener('abort', stop, { once: true });
                whenLeft.add(stop);
                $.clock.after(HOLD_LONGEST, stop);
                _f.label = 1;
            case 1:
                _f.trys.push([1, , 7, 8]);
                _f.label = 2;
            case 2:
                if (!!isOver) return [3 /*break*/, 6];
                _a = !waiting.some(function (one) { return one.id === id; }) || ((_c = next.signal) === null || _c === void 0 ? void 0 : _c.aborted) || ((_e = (_d = next.budget) === null || _d === void 0 ? void 0 : _d.remainingMs) !== null && _e !== void 0 ? _e : Infinity) < 1500;
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, isReplaced($)];
            case 3:
                _a = (_f.sent());
                _f.label = 4;
            case 4:
                if (_a)
                    return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.race([pressed, heldStep($)])];
            case 5:
                _f.sent();
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 8];
            case 7:
                whenLeft.delete(stop);
                promptHeld.delete(id);
                if (promptWaits.get(id) === end)
                    promptWaits.delete(id);
                if (waiting.some(function (one) { return one.id === id; }))
                    markHeld($, id, false);
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/, said];
        }
    });
}); };
// A press on Allow or Don't allow on its block in this chat's own panel, the only answer the mod gives: the block goes in the
// press's own drawing, one grey line says what was pressed, and the wait for it ends at once. Only the first press counts
var answerPrompt = function ($, id, said) {
    var _a;
    presses += 1;
    var end = promptWaits.get(id);
    var one = waiting.find(function (other) { return other.id === id; });
    if (!promptHeld.has(id) || !end || !one)
        return false;
    promptWaits.delete(id);
    waiting = waiting.filter(function (other) { return other !== one; });
    pressedLine($, (_a = one.card) !== null && _a !== void 0 ? _a : '', said === 'yes' ? ALLOW : DONT_ALLOW);
    end(said);
    redraw($);
    void shareMine($).catch(function () { return undefined; });
    return true;
};
// Work an allowed Agent call started: its prompt was answered, so it leaves the amber and its buttons go
var agentStarted = function ($, toolUseId) {
    if (toolUseId && waiting.some(function (one) { return one.id === toolUseId; }))
        settle($, toolUseId);
};
// ---- A command Claude Code blocked a background task from running, with no prompt for the person ----
// A background task or helper has no box of the app's own: Claude Code's auto mode, its safety checks, or a call that needs a person
// in a run nobody can be asked in refuse the call outright, and no PermissionRequest is raised for it (16 Nov: 47 refusals that
// way, none put to the person). A command so blocked is asked on its task's card as any permission is: Allow runs that very
// command once, as the person's own (runit.tsx), and Don't allow leaves it. Claudopus never lets the refused call itself through.
// A blocked call that is no command the person could run leaves nothing to decide, so nothing waits for them: the task was told
// by Claude Code and carries on without it
var BLOCKED_ASK = 'Claude Code blocked this command. Run it anyway?';
// Claude Code's own refusals, as its result or its deny begins (its texts in 2.1.325), and who refused, for the card
var CC_REFUSALS = [
    ['Permission for this action was denied by the Claude Code auto mode classifier', "Claude Code's auto mode blocked it"],
    ['Permission for this command was denied by a built-in Claude Code safety check', 'a built-in Claude Code safety check blocked it'],
    ['Permission for this tool use was denied. It requires approval, and this session has no approval surface', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['Permission for this tool use was denied: it requires interactive approval', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['no approval surface in this session', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['nobody can be asked in this headless run', "it needs your OK, and Claude Code can't ask you in a background task"],
];
// A check that gave no verdict is no refusal: Claude may try again as it is
var NO_VERDICT = /gave no verdict|transient failure/i;
// Only Claude Code's own refusal counts, never a failing call whose output holds the same words (a search, a test); the reason kept
// is only what Claude Code gave in its "Reason: [...]", never the rest of its words, which are for the model
var refusalOf = function (r) {
    var _a, _b;
    if (!r)
        return undefined;
    var said = __spreadArray([r.deny], (r.isError ? [r.result, r.text] : []), true).map(function (one) { return (typeof one === 'string' ? one.trim() : ''); }).filter(Boolean);
    var _loop_1 = function (words) {
        var found = CC_REFUSALS.find(function (_a) {
            var start = _a[0];
            return words.startsWith(start);
        });
        if (!found || NO_VERDICT.test(words))
            return "continue";
        var reason = (_b = (_a = /^[^\n]*?Reason: \[([^\]\n]{1,200})\]/.exec(words)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return { value: { who: found[1], reason: cut(oneLine(reason), 120) } };
    };
    for (var _i = 0, said_1 = said; _i < said_1.length; _i++) {
        var words = said_1[_i];
        var state_1 = _loop_1(words);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return undefined;
};
var refusedByClaudeCode = function ($, agent, tool, call, r) { return __awaiter(_this, void 0, void 0, function () {
    var refusal, list, top, own, runnable, details, at, isPut, card;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refusal = refusalOf(r);
                if (!refusal || !dir || isOff)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _a.sent();
                top = list.find(function (one) { return one.id === topOf(list, agent); });
                own = list.find(function (one) { return one.id === agent; });
                if (!top || top.chat)
                    return [2 /*return*/];
                runnable = runnableOf(tool, call);
                if (!!runnable) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "refusal of ".concat(tool, " for ").concat(agent, ": nothing the person could run, so nothing is asked"))];
            case 2: return [2 /*return*/, void (_a.sent())];
            case 3:
                details = [runDetails(runnable, refusal.reason), (own === null || own === void 0 ? void 0 : own.parentId) ? "A helper of this task wanted it: \u201C".concat(titleOf(own), "\u201D.") : ''].filter(Boolean).join('\n\n');
                return [4 /*yield*/, $.clock.now()
                    // A question waiting on the person, there already or put up meanwhile, is never replaced: the refusal is in the task's own result
                ];
            case 4:
                at = _a.sent();
                isPut = false;
                return [4 /*yield*/, change($, agent, function (one) { return ((isPut = !one.ask), one.ask ? one : __assign(__assign({}, one), { ask: { text: BLOCKED_ASK, details: details, copy: runnable.command, isCommand: true, cwd: runnable.cwd, from: agent, at: at, refused: true } })); })];
            case 5:
                _a.sent();
                if (!!isPut) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "refusal of ".concat(tool, " for ").concat(agent, " not put on its card: its card asks something already"))];
            case 6: return [2 /*return*/, void (_a.sent())];
            case 7: return [4 /*yield*/, offerRun($, top.id, agent, at, runnable)];
            case 8:
                _a.sent();
                return [4 /*yield*/, log($, "refusal of ".concat(tool, " for ").concat(agent, " put to the person on its card"))];
            case 9:
                _a.sent();
                return [4 /*yield*/, read($, todos)];
            case 10:
                card = (_a.sent()).find(function (one) { return one.id === top.id; });
                if (!card) return [3 /*break*/, 12];
                return [4 /*yield*/, askAloud($, card, BLOCKED_ASK).catch(function (err) { return log($, "ask not told: ".concat(String(err))); })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                if (!card) return [3 /*break*/, 14];
                return [4 /*yield*/, askInChat($, card).catch(function (err) { return log($, "ask not shown in the chat: ".concat(String(err))); })];
            case 13:
                _a.sent();
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
// What the task is told of the person's answer to that card: what was refused stays refused
var REFUSAL_ANSWERED = function (command, said, isReply) {
    return "".concat(isReply ? "".concat(who(true), " replied, in their own words, when asked whether to run the command Claude Code refused you (").concat(cut(oneLine(command), 200), "): ").concat(said) : "".concat(who(true), " pressed \"").concat(DONT_ALLOW, "\" when asked whether to run the command Claude Code refused you (").concat(cut(oneLine(command), 200), ")."), " What Claude Code refused stays refused: do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.");
};
var OWN_CALLS = ['SendMessage', 'TaskStop'];
var isOwnCall = function (next) { var _a; return ((_a = next.origin) === null || _a === void 0 ? void 0 : _a.plugin) === 'claudopus'; };
var promptHooks = function (on) {
    // Answers only where the mod's hooks run for what its code starts here (isInHook)
    on('env.get', function ($, e, next) { return (e.name === IN_HOOK ? { value: 'hook' } : next(e)); });
    // A hook that does nothing else, before each tool call of the chat's or of any task's: what waits to start a task again goes from
    // here while anything is at work, and the task it starts loses no hook it needs, as the engine leaves out of its run only the
    // hook the message was sent from (sendHeld)
    on('classic.PreToolUse', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!heldSends.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A prompt the app is about to put to the person shows amber in every panel. The mod answers only two kinds itself: its own messages
    // and Stops below, and a prompt the person answers with Yes or No on its card in this chat's own panel (PermissionRequest). A
    // settings hook that answered it put nothing to the person
    on('tool.check', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, next(e)
                    // Only an ask becomes an allow: a rule or hook of the person's that refuses it still does
                ];
                case 1:
                    r = _b.sent();
                    // Only an ask becomes an allow: a rule or hook of the person's that refuses it still does
                    if (r.decision === 'ask' && OWN_CALLS.includes(e.tool) && e.tool_use_id && isOwnCall(next))
                        return [2 /*return*/, __assign(__assign({}, r), { decision: 'allow' })];
                    if (r.decision === 'ask' && e.tool_use_id && e.approver) {
                        asked = __spreadArray(__spreadArray([], asked.filter(function (one) { return one.id !== e.tool_use_id; }), true), [{ agent: (_a = e.agentId) !== null && _a !== void 0 ? _a : '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }], false).slice(-50);
                    }
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('classic.PermissionRequest', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, r, one, _b, said;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(dir && !isEnded)) return [3 /*break*/, 2];
                    return [4 /*yield*/, opened($, e.agent_id, e.tool_name, e.tool_input).catch(function (err) { return (void log($, "prompt not shown: ".concat(String(err))), ''); })];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = '';
                    _c.label = 3;
                case 3:
                    id = _a;
                    return [4 /*yield*/, next(e)];
                case 4:
                    r = _c.sent();
                    if (id && (r === null || r === void 0 ? void 0 : r.decision)) {
                        settle($, id);
                        return [2 /*return*/, r];
                    }
                    one = waiting.find(function (other) { return other.id === id; });
                    _b = !one || one.kind !== 'allow';
                    if (_b) return [3 /*break*/, 6];
                    return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
                case 5:
                    _b = !(_c.sent()).length;
                    _c.label = 6;
                case 6:
                    if (_b)
                        return [2 /*return*/, r];
                    return [4 /*yield*/, holdPrompt($, next, id)];
                case 7:
                    said = _c.sent();
                    if (!said)
                        return [2 /*return*/, r];
                    if (said === 'yes')
                        return [2 /*return*/, __assign(__assign({}, r), { decision: { behavior: 'allow' } })];
                    // No from the chat's own thread stops its turn, as the box's No does; Claude is told, and continues without it
                    return [2 /*return*/, __assign(__assign({}, r), { decision: __assign({ behavior: 'deny', message: one.agent ? PRESSED_NO_WORK : PRESSED_NO }, (one.agent ? {} : { interrupt: true })) })];
            }
        });
    }); });
    on('classic.Notification', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.notification_type === 'permission_prompt' && waiting.length)) return [3 /*break*/, 2];
                    return [4 /*yield*/, tellWaiting($).catch(function (err) { return log($, "prompt not told: ".concat(String(err))); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // It goes as its call ends (refused, interrupted, or allowed and run: the main tool.call hook below), or as the terminal draws its
    // running pill
    on('ui.render', { component: 'ToolProgress' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            id = e.props.tool_use_id;
            if (waiting.some(function (one) { return one.id === id; }))
                void Promise.resolve().then(function () { return settle($, id); });
            return [2 /*return*/, next(e)];
        });
    }); });
};
