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
// What the prompt asks, in its own few words: a command's description, the file, the site, the question
var promptText = function (tool, input) {
    var _a, _b, _c, _d, _e;
    var given = (input && typeof input === 'object' ? input : {});
    var field = function (key) { return (typeof given[key] === 'string' ? oneLine(given[key]) : ''); };
    var file = function (path) { var _a; return (_a = path.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : ''; };
    if (tool === 'Bash' || tool === 'PowerShell')
        return "Allow a command: ".concat(cut(field('description') || field('command'), 90) || 'one with no words');
    if (tool === 'Write')
        return "Allow writing ".concat(file(field('file_path')) || 'a file');
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return "Allow editing ".concat(file(field('file_path') || field('notebook_path')) || 'a file');
    if (tool === 'WebFetch')
        return "Allow opening ".concat((_b = (_a = field('url').match(/^https?:\/\/([^/?#]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 'a web page');
    if (tool === 'WebSearch')
        return "Allow a web search: ".concat(cut(field('query'), 80));
    if (tool === 'AskUserQuestion') {
        var first = Array.isArray(given.questions) ? (_c = given.questions[0]) === null || _c === void 0 ? void 0 : _c.question : undefined;
        return typeof first === 'string' && first.trim() ? "Answer a question: ".concat(cut(oneLine(first), 90)) : 'Answer a question';
    }
    if (tool === 'ExitPlanMode')
        return 'Approve a plan';
    var mcp = tool.match(/^mcp__(.+?)__(.+)$/);
    if (mcp)
        return "Allow ".concat(((_d = mcp[2]) !== null && _d !== void 0 ? _d : '').replace(/_/g, ' '), " (").concat(((_e = mcp[1]) !== null && _e !== void 0 ? _e : '').replace(/^plugin_[^_]+_/, ''), ")");
    return "Allow ".concat(tool);
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
    var at, id, list, card, one;
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
                one = __assign(__assign({ id: id, text: promptText(tool, input) }, (card ? { title: titleOf(card) } : {})), { at: at, tool: tool, agent: agent !== null && agent !== void 0 ? agent : '', snippet: snippetOf(tool, input) });
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
                return [4 /*yield*/, aloud($, 'prompt', "".concat((_a = one.title) !== null && _a !== void 0 ? _a : chat, " needs your OK"), one.text, "prompt-".concat(one.id)).catch(function (err) { return log($, "prompt not told: ".concat(String(err))); })];
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
// The prompt of a call goes: by its id, else the oldest one of the same loop and tool whose id was not known
var settle = function ($, id, agent, tool) {
    var exact = waiting.find(function (one) { return one.id === id; });
    var gone = exact !== null && exact !== void 0 ? exact : (tool ? waiting.find(function (one) { return one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent !== null && agent !== void 0 ? agent : ''); }) : undefined);
    if (!gone)
        return;
    waiting = waiting.filter(function (one) { return one !== gone; });
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
var promptHooks = function (on) {
    // A prompt the app is about to put to the person shows amber in every panel; the mod passes the request on untouched and never
    // answers it. A settings hook that answered it put nothing to the person
    on('tool.check', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _b.sent();
                    if (r.decision === 'ask' && e.tool_use_id && e.approver) {
                        asked = __spreadArray(__spreadArray([], asked.filter(function (one) { return one.id !== e.tool_use_id; }), true), [{ agent: (_a = e.agentId) !== null && _a !== void 0 ? _a : '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }], false).slice(-50);
                    }
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('classic.PermissionRequest', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, r;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(dir && !isEnded)) return [3 /*break*/, 2];
                    return [4 /*yield*/, opened($, e.agent_id, e.tool_name, e.tool_input).catch(function (err) { return (void log($, "prompt not shown: ".concat(String(err))), ''); })];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = '';
                    _b.label = 3;
                case 3:
                    id = _a;
                    return [4 /*yield*/, next(e)];
                case 4:
                    r = _b.sent();
                    if (id && (r === null || r === void 0 ? void 0 : r.decision))
                        settle($, id);
                    return [2 /*return*/, r];
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
