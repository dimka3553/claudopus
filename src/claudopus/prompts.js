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
var NO_SKIPS = "No: it doesn't run, and the chat waits for what you say next.";
var NO_TOLD = "No: it doesn't run, and Claudopus tells Claude you said no.";
var promptOf = function (tool, input, list, isWork) {
    var _a, _b, _c, _d, _e;
    if (isWork === void 0) { isWork = false; }
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
    var allow = function (text, yes, detail, no) {
        if (detail === void 0) { detail = ''; }
        if (no === void 0) { no = isWork ? NO_TOLD : NO_SKIPS; }
        return (__assign(__assign({ text: text, kind: 'allow' }, (detail ? { detail: detail } : {})), { yes: "Yes: ".concat(yes), no: no }));
    };
    if (tool === 'Bash' || tool === 'PowerShell')
        return allow("Run a command: ".concat(cut(field('description'), 90) || cut(field('command'), 90) || 'no description'), 'the command runs on its Mac.', whole('command', 400));
    if (tool === 'Write')
        return allow("Write the file ".concat(file(field('file_path')) || 'a file'), 'Claude saves the file, replacing any file of that name.', field('file_path'));
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return allow("Change the file ".concat(file(field('file_path') || field('notebook_path')) || 'a file'), 'Claude changes the file.', field('file_path') || field('notebook_path'));
    if (tool === 'Read')
        return allow("Read the file ".concat(file(field('file_path')) || 'a file'), 'Claude reads the file and changes nothing.', field('file_path'));
    if (tool === 'Glob' || tool === 'Grep')
        return allow("Search files for ".concat(cut(field('pattern'), 80) || 'a pattern'), 'Claude searches and changes nothing.', field('path'));
    if (tool === 'WebFetch')
        return allow("Open a web page on ".concat((_b = (_a = field('url').match(/^https?:\/\/([^/?#]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 'the web'), 'Claude reads the page and sends nothing but its address.', field('url'));
    if (tool === 'WebSearch')
        return allow("Search the web for \u201C".concat(cut(field('query'), 80), "\u201D"), 'Claude searches the web and reads the results.');
    if (tool === 'SendMessage') {
        var to = workNamed(field('to'));
        return __assign(__assign({}, allow(to === 'its chat' ? 'Send a message to its chat' : "Send a message to ".concat(to), to === 'its chat' ? 'its chat gets the message.' : 'that task gets the message and acts on it.', whole('message', 400) || field('summary'), isWork ? "No: it isn't sent, and Claudopus tells Claude you said no." : "No: it isn't sent, and the chat waits for what you say next.")), { done: 'Claude sent it' });
    }
    if (tool === 'Agent' || tool === 'Task')
        return __assign(__assign({}, allow("Start a task: ".concat(cut(field('description'), 90) || 'with no title'), 'the task starts in the background and gets a card here.', whole('prompt', 300), isWork ? NO_TOLD : "No: it doesn't start, and the chat waits for what you say next.")), { done: 'Claude started it' });
    if (tool === 'TaskStop')
        return __assign(__assign({}, allow("Stop ".concat(workNamed(field('task_id') || field('id'))), 'that task stops where it is.', '', isWork ? 'No: that task keeps running, and Claudopus tells Claude you said no.' : 'No: that task keeps running, and the chat waits for what you say next.')), { done: 'Claude stopped it' });
    if (tool === 'Skill')
        return allow("Use the skill \u201C".concat(field('skill') || field('name'), "\u201D"), 'Claude loads those instructions and follows them.');
    if (tool === 'AskUserQuestion') {
        var first = Array.isArray(given.questions) ? (_c = given.questions[0]) === null || _c === void 0 ? void 0 : _c.question : undefined;
        return {
            text: typeof first === 'string' && first.trim() ? "Answer a question: ".concat(cut(oneLine(first), 120)) : 'Answer a question',
            kind: 'question',
            yes: 'Pick an answer: Claude gets it and carries on.',
            no: 'Skip it: Claude gets no answer and waits for what you say next.',
        };
    }
    if (tool === 'ExitPlanMode')
        return { text: 'Approve a plan', kind: 'plan', detail: whole('plan', 400), yes: 'Yes: Claude starts doing what the plan says.', no: 'No: Claude keeps planning. Say what to change.' };
    var mcp = tool.match(/^mcp__(.+?)__(.+)$/);
    var words = field('description') || field('text') || field('query') || field('title') || field('name') || field('url');
    if (mcp)
        return allow("Use \u201C".concat(((_d = mcp[2]) !== null && _d !== void 0 ? _d : '').replace(/_/g, ' '), "\u201D from ").concat(((_e = mcp[1]) !== null && _e !== void 0 ? _e : '').replace(/^plugin_[^_]+_/, '').replace(/[_-]/g, ' ')), 'that action runs.', cut(words, 300));
    return allow(words ? "Use a tool: ".concat(cut(words, 90)) : 'Use one of its tools', 'that tool runs.', '');
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
                one = __assign(__assign(__assign({ id: id }, promptOf(tool, input, list, Boolean(agent))), (card ? { title: titleOf(card) } : {})), { at: at, tool: tool, agent: agent !== null && agent !== void 0 ? agent : '', snippet: snippetOf(tool, input), input: strings });
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
var answeredPrompts = [];
var PROMPT_SHOWN = 15000;
// An allowed call whose end is never seen is taken as over this long after it was seen running, so nothing stays purple for good
var RUNNING_LONGEST = 15 * 60000;
var answeredShown = function (at) { return answeredPrompts.filter(function (one) { return (one.endedAt ? at - one.endedAt < PROMPT_SHOWN : at - one.at < RUNNING_LONGEST); }); };
var settle = function ($, id, agent, tool, outcome, args) {
    var _a;
    var byTool = function (one) { return one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent !== null && agent !== void 0 ? agent : ''); };
    // The same call as the prompt asked about: every word it asked with is the call's own
    var isSameCall = function (one) { var _a, _b; return Boolean(args) && Object.keys((_a = one.input) !== null && _a !== void 0 ? _a : {}).length > 0 && Object.entries((_b = one.input) !== null && _b !== void 0 ? _b : {}).every(function (_a) {
        var key = _a[0], value = _a[1];
        return (args === null || args === void 0 ? void 0 : args[key]) === value;
    }); };
    // Its own id first, open or answered; only then the oldest open one of the same loop and tool whose id was not known. That one says
    // what came of it only when the call asked with the very same words; else it may be another call's, and it goes with no word
    var exact = waiting.find(function (one) { return one.id === id; });
    var isOpen = function (one) { return !one.endedAt || one.isPressedNo; };
    var was = exact ? undefined : answeredPrompts.find(function (one) { return one.id === id && isOpen(one); });
    var sameOpen = exact || was || !tool ? undefined : waiting.find(function (one) { return byTool(one) && isSameCall(one); });
    // One answered on its card, whose id was not known, is the same call only when it asked with the very same words, and only when no
    // open prompt did
    if (!exact && !was && !sameOpen && tool)
        was = answeredPrompts.find(function (one) { return isOpen(one) && (one.isRunning || one.isPressedNo) && byTool(one) && isSameCall(one); });
    var guessed = exact || was || !tool ? undefined : (sameOpen !== null && sameOpen !== void 0 ? sameOpen : waiting.find(byTool));
    var gone = exact !== null && exact !== void 0 ? exact : guessed;
    if (!gone && !was)
        return;
    if (gone)
        waiting = waiting.filter(function (one) { return one !== gone; });
    var before = (_a = exact !== null && exact !== void 0 ? exact : was) !== null && _a !== void 0 ? _a : (guessed && isSameCall(guessed) ? guessed : undefined);
    if (outcome && before) {
        void $.clock.now().then(function (now) {
            var isEnd = outcome !== 'running';
            // A no pressed on the card stands unless the call went on: then Claude Code's own box had said yes first
            if (before.isPressedNo && outcome !== 'running' && outcome !== 'ran')
                return;
            var wasAllowed = before.answered === 'yes';
            var answered = outcome === 'no' ? 'no' : outcome === 'stopped' && !wasAllowed ? 'stopped' : 'yes';
            var _held = before.isHeld, _pressed = before.isPressedNo, base = __rest(before, ["isHeld", "isPressedNo"]);
            var after = __assign(__assign(__assign(__assign(__assign({}, base), (outcome === 'no' && pressedNo.has(before.id) ? { isPressedNo: true } : {})), { answered: answered, isRunning: !isEnd }), (isEnd ? { endedAt: now } : { at: now })), (outcome === 'stopped' && wasAllowed ? { isCut: true } : {}));
            answeredPrompts = __spreadArray(__spreadArray([], answeredShown(now).filter(function (one) { return one.id !== before.id; }), true), [after], false).slice(-10);
            redraw($);
            void shareMine($).catch(function () { return undefined; });
            $.clock.after((isEnd ? PROMPT_SHOWN : RUNNING_LONGEST) + 100, function () { return (redraw($), void shareMine($).catch(function () { return undefined; })); });
        });
    }
    redraw($);
    void shareMine($).catch(function () { return undefined; });
};
// What came of a call, as it ended: the person said no, it ended before it ran (interrupted, timed out, the turn or session ended), or
// it ran. The engine says most endings in words, in the result or its text, often with isError
var REFUSED_WORDS = /doesn't want to proceed|tool use was rejected|user (denied|rejected)|permission to use .{1,80} (has been|was) denied/i;
var NOT_RUN_WORDS = /\[(tool call (not|did not) complete|request interrupted)|interrupted by user|the (turn|session) (was )?ended|approval request expired/i;
var outcomeOf = function (r) {
    var _a;
    if (!r)
        return 'stopped';
    // Only a call that did not end well is read for words: a command that ran may print anything
    if (!r.deny && !r.isError && typeof r.result !== 'string')
        return 'ran';
    var words = [typeof r.deny === 'string' ? r.deny : '', typeof r.text === 'string' ? r.text : '', typeof r.result === 'string' ? r.result : JSON.stringify((_a = r.result) !== null && _a !== void 0 ? _a : '').slice(0, 2000)].join('\n');
    if (REFUSED_WORDS.test(words))
        return 'no';
    if (NOT_RUN_WORDS.test(words))
        return 'stopped';
    if (r.deny)
        return 'no';
    return r.isError ? 'stopped' : 'ran';
};
var IN_HOOK = 'CLAUDOPUS_IN_HOOK';
var HOOK_WAIT = 60000;
var UNSEEN_RUN = "From Claudopus: this message starts you where Claudopus cannot see you, as nothing of its own ran for a minute to send it from. In this run its panel tools (todo, note, ask, wake_me, waits) do not answer, and nothing starts you again once your step ends. So do not end your step to wait for anything: do what you can now, then hand back your report with SubagentHandback, saying what is left.";
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
var sendOwn = function ($, message, isStill) { return __awaiter(_this, void 0, void 0, function () {
    var same, one;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, isInHook($)];
            case 1:
                if (_a.sent())
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
                $.clock.after(HOOK_WAIT, function () {
                    var at = heldSends.indexOf(one);
                    if (at < 0)
                        return;
                    heldSends.splice(at, 1);
                    // (a copy of the mod a reload replaced sends nothing: the copy in charge takes its tasks up)
                    void isReplaced($).then(function (isOld) {
                        if (isOld)
                            return one.resolve({ isDelivered: false, reason: 'this copy of the mod was replaced by a reload' });
                        void log($, "the message for ".concat(message.to.agentId, " goes from a timer after all: no hook of the mod came in ").concat(HOOK_WAIT / 1000, " s, so its task runs unseen and is told so"));
                        void sendOne($, one, "".concat(message.text, "\n\n").concat(UNSEEN_RUN));
                    });
                });
                return [2 /*return*/, one.result];
        }
    });
}); };
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
                        settle($, one.id, undefined, undefined, 'running');
                }
                return [3 /*break*/, 4];
            case 3:
                isLooking = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// A press on a prompt's card, by the prompt's id, read by its hold between two looks; the prompts held now
var promptSaid = new Map();
var promptHeld = new Set();
var pressedNo = new Set();
// The longest a prompt waits for a press: past it the hook hands the prompt back to whatever else answers it
var HOLD_LONGEST = 10 * 60000;
var PRESSED_NO = "The person said no to this on its card in the Claudopus panel. It didn't run. Wait for what they say next.";
var PRESSED_NO_WORK = "The person said no to this on its card in the Claudopus panel. It didn't run: don't try it another way; continue without it.";
var markHeld = function ($, id, isHeld) {
    waiting = waiting.map(function (one) { return (one.id !== id ? one : isHeld ? __assign(__assign({}, one), { isHeld: true }) : (function (_a) {
        var _held = _a.isHeld, rest = __rest(_a, ["isHeld"]);
        return rest;
    })(one)); });
    redraw($);
    void shareMine($).catch(function () { return undefined; });
};
// Holds the prompt until a press on its card, its call ends (the box was answered), the engine gives up on the hook, or this copy of
// the mod is replaced. As the admin gate does, the wait is a one-second sleep run by the engine, whose time the hook's own budget
// does not count. Its buttons show only while it is held. Claude Code's box answers beside it, and that answer is seen only as the
// call runs or ends; a press after it changes nothing, and the card then says what the call did
var holdPrompt = function ($, next, id) { return __awaiter(_this, void 0, void 0, function () {
    var since, said, _a;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                since = _e.sent();
                promptHeld.add(id);
                markHeld($, id, true);
                _e.label = 2;
            case 2:
                _e.trys.push([2, , 10, 11]);
                _e.label = 3;
            case 3:
                said = promptSaid.get(id);
                if (said)
                    return [3 /*break*/, 9];
                _a = !waiting.some(function (one) { return one.id === id; }) || ((_b = next.signal) === null || _b === void 0 ? void 0 : _b.aborted) || ((_d = (_c = next.budget) === null || _c === void 0 ? void 0 : _c.remainingMs) !== null && _d !== void 0 ? _d : Infinity) < 1500;
                if (_a) return [3 /*break*/, 5];
                return [4 /*yield*/, isReplaced($)];
            case 4:
                _a = (_e.sent());
                _e.label = 5;
            case 5:
                if (_a)
                    return [3 /*break*/, 9];
                return [4 /*yield*/, $.clock.now()];
            case 6:
                if ((_e.sent()) - since > HOLD_LONGEST)
                    return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['/bin/sleep', '1'], { timeoutMs: 10000 }).catch(function () { return undefined; })];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8: return [3 /*break*/, 3];
            case 9: return [3 /*break*/, 11];
            case 10:
                promptHeld.delete(id);
                promptSaid.delete(id);
                if (waiting.some(function (one) { return one.id === id; }))
                    markHeld($, id, false);
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/, said];
        }
    });
}); };
// A press on Yes or No on its card in this chat's own panel, the only answer the mod gives: the prompt is answered at once and its card says so, as one answered in the box
var answerPrompt = function ($, id, said) {
    presses += 1;
    if (!promptHeld.has(id) || promptSaid.has(id))
        return false;
    var one = waiting.find(function (other) { return other.id === id; });
    if (!one)
        return false;
    promptSaid.set(id, said);
    if (said === 'no')
        pressedNo.add(id);
    settle($, id, one.agent || undefined, one.tool, said === 'yes' ? 'running' : 'no');
    return true;
};
// Work an allowed Agent call started: its prompt was answered, so it leaves the amber and its buttons go
var agentStarted = function ($, toolUseId) {
    if (toolUseId && waiting.some(function (one) { return one.id === toolUseId; }))
        settle($, toolUseId, undefined, undefined, 'running');
};
// ---- A call Claude Code refused a background task with no prompt for the person: a notice on the task's card ----
// A background task or helper has no box of the app's own: Claude Code's auto mode, its safety checks, or a call that needs a person
// in a run nobody can be asked in refuse the call outright, and no PermissionRequest is raised for it (16 Nov: 47 refusals that
// way, none put to the person). Its task's card says what was refused and why, and that the task carries on without it. Claudopus
// never lets a refused call through, and nothing it says invites the task to reach what was refused another way
var CARRY_ON = 'Carry on without it';
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
    var refusal, list, top, own, what, who, text, runnable, details, at, isPut, command, card;
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
                what = promptOf(tool, call, list, true);
                who = (own === null || own === void 0 ? void 0 : own.parentId) ? "a helper of this task (\"".concat(titleOf(own), "\")") : 'this task';
                text = cut("Claude Code blocked ".concat(who, ": ").concat(what.text, "."), ASK_TEXT);
                runnable = runnableOf(tool, call);
                details = [
                    what.detail && !runnable ? "What it is: ".concat(what.detail) : '',
                    "Why: ".concat(refusal.who).concat(refusal.reason ? " (".concat(refusal.reason, ")") : '', "."),
                    runnable ? runDetails() : "Claude carries on without it and won't try another way.",
                ]
                    .filter(Boolean)
                    .join('\n\n');
                return [4 /*yield*/, $.clock.now()
                    // A question waiting on the person, there already or put up meanwhile, is never replaced: the refusal is in the task's own result
                ];
            case 2:
                at = _a.sent();
                isPut = false;
                command = runnable ? { copy: runnable.command, isCommand: true, cwd: runnable.cwd } : {};
                return [4 /*yield*/, change($, agent, function (one) { return ((isPut = !one.ask), one.ask ? one : __assign(__assign({}, one), { ask: __assign(__assign({ text: text, details: details }, command), { choices: [CARRY_ON], from: agent, at: at, refused: true }) })); })];
            case 3:
                _a.sent();
                if (!!isPut) return [3 /*break*/, 5];
                return [4 /*yield*/, log($, "refusal of ".concat(tool, " for ").concat(agent, " not put on its card: its card asks something already"))];
            case 4: return [2 /*return*/, void (_a.sent())];
            case 5:
                if (!runnable) return [3 /*break*/, 7];
                return [4 /*yield*/, offerRun($, top.id, agent, at, runnable)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [4 /*yield*/, log($, "refusal of ".concat(tool, " for ").concat(agent, " put to the person on its card"))];
            case 8:
                _a.sent();
                return [4 /*yield*/, read($, todos)];
            case 9:
                card = (_a.sent()).find(function (one) { return one.id === top.id; });
                if (!card) return [3 /*break*/, 11];
                return [4 /*yield*/, askAloud($, card, text).catch(function (err) { return log($, "ask not told: ".concat(String(err))); })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                if (!card) return [3 /*break*/, 13];
                return [4 /*yield*/, askInChat($, card).catch(function (err) { return log($, "ask not shown in the chat: ".concat(String(err))); })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
// What the task is told of the person's answer to that card: what was refused stays refused
var REFUSAL_ANSWERED = function (asked, said, isReply) {
    return "".concat(isReply ? "".concat(who(true), " replied, in their own words, to the notice that Claude Code refused your call (\"").concat(asked, "\"): ").concat(said) : "".concat(who(true), " saw the notice that Claude Code refused your call (\"").concat(asked, "\")."), " What Claude Code refused stays refused: do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.");
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
                void Promise.resolve().then(function () { return settle($, id, undefined, undefined, 'running'); });
            return [2 /*return*/, next(e)];
        });
    }); });
};
