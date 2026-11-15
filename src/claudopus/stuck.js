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
// The calls running now, by tool_use_id: whose, what, since when
var inFlight = new Map();
var seenLines = new Map();
// What a running call is, in a few words, for its row
var runningWhat = function (tool) {
    return tool === 'Bash' ? 'one command running' : tool === 'Grep' || tool === 'Glob' ? 'one search running' : tool === 'Agent' ? 'its helper running' : "".concat(tool.replace(/^mcp__.*__/, ''), " running");
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
    var cmd, label, _a, _b, _c;
    var _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                cmd = tool === 'Bash' ? oneLine(String((_e = input === null || input === void 0 ? void 0 : input.command) !== null && _e !== void 0 ? _e : '')).slice(0, 400) : '';
                label = oneLine(String((_f = input === null || input === void 0 ? void 0 : input.description) !== null && _f !== void 0 ? _f : '') || cmd.split('\n')[0] || '').slice(0, 160);
                _b = (_a = inFlight).set;
                _c = [id];
                _d = { agent: agent, what: runningWhat(tool) };
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _b.apply(_a, _c.concat([__assign.apply(void 0, [(_d.at = _g.sent(), _d), (cmd ? { cmd: cmd, label: label } : {})])]));
                return [4 /*yield*/, update($, todos, function (list) { return withRunning(list, agent); })];
            case 2:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
// A call of a piece of work ended with what it returned: a line its agent had not seen come back before is news. The mod's own
// tools say back what they were given, so they bring none
var callEnded = function ($, id, agent, tool, r) { return __awaiter(_this, void 0, void 0, function () {
    var now, isNew, seen, _i, _a, line;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                inFlight.delete(id);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _c.sent();
                isNew = false;
                if (r && !r.deny && !tool.startsWith(TOOLS) && !tool.startsWith(OLD_TOOLS)) {
                    seen = (_b = seenLines.get(agent)) !== null && _b !== void 0 ? _b : new Set();
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
                return [4 /*yield*/, update($, todos, function (list) { return withRunning(list, agent, isNew ? now : undefined); })];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// When something last moved under a piece of work: it or a helper started, ended, or had something new come back
var movedAt = function (list, top) { return Math.max.apply(Math, __spreadArray([top], underOf(list, top.id), true).map(function (one) { var _a; return Math.max(one.startedAt, one.endedAt, (_a = one.newAt) !== null && _a !== void 0 ? _a : 0); })); };
// Looked at as the list is followed: work under which nothing new has come back for STUCK_AFTER is flagged on its card, and the
// chat is told once; it clears when something does. Work waiting on the person is not flagged: asking them something, or stopped
// on the app's own prompt to allow a call; nor work that gave its report and is only held by what it left running
var lookStuck = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, told, _i, told_1, one, _a, _b, _c, _d, _e, _f, _g, _h, _j, list, _loop_1, _k, _l, agent;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _m.sent();
                told = [];
                return [4 /*yield*/, update($, todos, function (list) {
                        var isChanged = false;
                        var isPrompted = function (one) { return waiting.some(function (p) { return p.agent && topOf(list, p.agent) === one.id; }); };
                        var next = list.map(function (one) {
                            var _a, _b;
                            if (one.parentId || one.chat)
                                return one;
                            // Nor work that waits for a command of its own it started in the background: a long copy is not stuck
                            var isWaitingOwn = Boolean(one.waitsSince && ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch; })));
                            var isStuck = one.status === 'working' && !(one.ask && !one.ask.replied) && !((_b = one.admins) === null || _b === void 0 ? void 0 : _b.length) && !one.answeredAt && !isWaitingOwn && !isPrompted(one) && now - movedAt(list, one) >= STUCK_AFTER;
                            if (isStuck && !one.stuckAt)
                                return ((isChanged = true), told.push(one), __assign(__assign({}, one), { stuckAt: movedAt(list, one) }));
                            if (!isStuck && one.stuckAt)
                                return ((isChanged = true), __assign(__assign({}, one), { stuckAt: undefined }));
                            return one;
                        });
                        return isChanged ? next : list;
                    })];
            case 2:
                _m.sent();
                _i = 0, told_1 = told;
                _m.label = 3;
            case 3:
                if (!(_i < told_1.length)) return [3 /*break*/, 7];
                one = told_1[_i];
                _a = sayInChat;
                _b = [$];
                _c = named;
                _d = STUCK_IN_CHAT;
                _e = [titleOf(one)];
                _g = (_f = Math).round;
                _h = now;
                _j = movedAt;
                return [4 /*yield*/, read($, todos)];
            case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply(void 0, [_d.apply(void 0, _e.concat([_g.apply(_f, [(_h - _j.apply(void 0, [_m.sent(), one])) / 60000])]))])]))
                // What agents that have ended had seen come back is let go
            ];
            case 5:
                _m.sent();
                _m.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, read($, todos)];
            case 8:
                list = _m.sent();
                _loop_1 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        seenLines.delete(agent);
                };
                for (_k = 0, _l = seenLines.keys(); _k < _l.length; _k++) {
                    agent = _l[_k];
                    _loop_1(agent);
                }
                return [2 /*return*/];
        }
    });
}); };
// What a stuck card says above its line: how long nothing new has come back, and whether its helpers, or it, sit in a long call
var stuckLine = function (list, one, at) {
    var _a, _b;
    if (!one.stuckAt)
        return '';
    var mins = Math.max(1, Math.round((at - one.stuckAt) / 60000));
    var isLong = function (kid) { return Boolean(kid.running && at - kid.running.at >= RUNNING_SHOWN); };
    var helpers = underOf(list, one.id).filter(function (kid) { return kid.status === 'working'; });
    var tail = helpers.length
        ? helpers.every(isLong) ? " ".concat(helpers.length === 1 ? 'Its helper keeps' : helpers.length === 2 ? 'Both helpers keep' : "All ".concat(helpers.length, " helpers keep"), " waiting.") : ''
        : isLong(one) ? " One call has run ".concat(took(at - ((_b = (_a = one.running) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : at)), ".") : '';
    return "Nothing new for ".concat(mins, " min.").concat(tail);
};
// A row's running call, with its time, once it has run RUNNING_SHOWN
var runningLine = function (one, at) { return (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? "".concat(one.running.what, " \u00B7 ").concat(took(at - one.running.at)) : ''); };
// ---- What work started in the background itself, which wakes it as it ends ----
var BG_KEPT = 20;
// A command it sent to the background, or a watch it set, is kept by its card with its task id and its own words for it; one it
// stops goes. A command the engine ends with its final response wakes nothing and is not kept
var keepBackground = function ($, agent, call, result) { return __awaiter(_this, void 0, void 0, function () {
    var r, id, what, cmd, now;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (call.tool === 'TaskStop' || call.tool === 'KillShell')
                    return [2 /*return*/, dropBackground($, [String((_b = (_a = call.task_id) !== null && _a !== void 0 ? _a : call.shell_id) !== null && _b !== void 0 ? _b : '')])];
                r = (result && typeof result === 'object' ? result : {});
                id = call.tool === 'Bash' ? r.backgroundTaskId : call.tool === 'Monitor' ? r.taskId : undefined;
                if (typeof id !== 'string' || !id || r.backgroundEndsWithFinalResponse)
                    return [2 /*return*/];
                what = oneLine(String((_c = call.description) !== null && _c !== void 0 ? _c : '') || String((_d = call.command) !== null && _d !== void 0 ? _d : '').split('\n')[0] || '').slice(0, 160);
                cmd = oneLine(String((_e = call.command) !== null && _e !== void 0 ? _e : '')).slice(0, 400);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _f.sent();
                return [4 /*yield*/, update($, todos, function (list) {
                        return list.map(function (one) { var _a; return (one.id === agent ? __assign(__assign({}, one), { bg: __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return b.id !== id; }), true), [__assign(__assign({ id: id, what: what, at: now }, (cmd ? { cmd: cmd } : {})), (call.tool === 'Monitor' ? { isWatch: true } : {}))], false).slice(-BG_KEPT) }) : one); });
                    })];
            case 2:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// Background work that has ended or was stopped leaves every card that kept it
var dropBackground = function ($, ids) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, update($, todos, function (list) {
                var isGone = function (id) { return ids.includes(id); };
                if (!list.some(function (one) { var _a; return (_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return isGone(b.id); }); }))
                    return list;
                return list.map(function (one) {
                    var _a, _b;
                    var bg = (_a = one.bg) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return !isGone(b.id); });
                    return (bg === null || bg === void 0 ? void 0 : bg.length) === ((_b = one.bg) === null || _b === void 0 ? void 0 : _b.length) ? one : __assign(__assign({}, one), { bg: (bg === null || bg === void 0 ? void 0 : bg.length) ? bg : undefined, waitsSince: (bg === null || bg === void 0 ? void 0 : bg.some(function (b) { return !b.isWatch; })) ? one.waitsSince : undefined });
                });
            })
            // What work still at work says on its card while it waits for a command of its own: which, and how long it has run; only that it
            // waits when the command has its own row on the card's tree
        ];
    });
}); };
// What work still at work says on its card while it waits for a command of its own: which, and how long it has run; only that it
// waits when the command has its own row on the card's tree
var waitLine = function (one, at, isShort) {
    var _a;
    if (isShort === void 0) { isShort = false; }
    var commands = ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; });
    // The newest command it started, the one it is most likely on now
    var first = commands.at(-1);
    if (one.status !== 'working' || !one.waitsSince || one.answeredAt || !first)
        return '';
    var more = commands.length > 1 ? " and ".concat(commands.length - 1, " more") : '';
    if (isShort)
        return "Still at work: it waits for its background command".concat(more, " to finish");
    return "Still at work: it waits for its background command".concat(more, " to finish, running ").concat(took(at - first.at)).concat(first.what ? ": ".concat(cut(first.what, 90)) : '');
};
// What finished work left running says on its card
var leftLine = function (one, at) { return (one.leftSince && one.status !== 'working' ? "It left something running in the background, ".concat(took(at - one.leftSince)) : ''); };
