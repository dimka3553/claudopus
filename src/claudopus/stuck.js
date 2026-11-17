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
// Work the mod started again after it had stopped mid-step: once only; stuck again, it is only told to the chat
var restartedOnce = new Set();
var inFlight = new Map();
var seenLines = new Map();
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
                return [4 /*yield*/, changeTodos($, function (list) { return withRunning(list, agent); })];
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
                return [4 /*yield*/, changeTodos($, function (list) { return withRunning(list, agent, isNew ? now : undefined); })];
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
    var now, told, engine, _a, _loop_1, _i, told_1, one, list, _loop_2, _b, _c, agent;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _f.sent();
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
                    })
                    // Stuck work the engine no longer runs had stopped mid-step (the app restarted, the Mac slept, its run was cut off): it is
                    // started again at once with a message of the mod's own, rather than waiting for the chat or the person to notice
                ];
            case 2:
                _f.sent();
                if (!told.length) return [3 /*break*/, 4];
                return [4 /*yield*/, $.agent.list().catch(function () { return undefined; })];
            case 3:
                _a = _f.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = undefined;
                _f.label = 5;
            case 5:
                engine = _a;
                _loop_1 = function (one) {
                    var mins, _g, _h, _j, _k, status_1, helpers, _l, isWaiting, isStopped, r, _m, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                _h = (_g = Math).round;
                                _j = now;
                                _k = movedAt;
                                return [4 /*yield*/, read($, todos)];
                            case 1:
                                mins = _h.apply(_g, [(_j - _k.apply(void 0, [_p.sent(), one])) / 60000]);
                                status_1 = (_d = engine === null || engine === void 0 ? void 0 : engine.find(function (agent) { return agent.id === one.id; })) === null || _d === void 0 ? void 0 : _d.status;
                                _l = underOf;
                                return [4 /*yield*/, read($, todos)];
                            case 2:
                                helpers = _l.apply(void 0, [_p.sent(), one.id]).map(function (kid) { return kid.id; });
                                isWaiting = WORKING.includes(String(status_1)) || Boolean(engine === null || engine === void 0 ? void 0 : engine.some(function (agent) { return (agent.parentId === one.id || helpers.includes(agent.id)) && WORKING.includes(agent.status); }));
                                isStopped = Boolean(status_1) && !isWaiting && !isHeld(one) && !stoppedHere.has(one.id) && !cutPending.has(one.id) && !((_e = one.ask) === null || _e === void 0 ? void 0 : _e.replied) && !restartedOnce.has(one.id);
                                if (isStopped)
                                    restartedOnce.add(one.id);
                                _o = isStopped;
                                if (!_o) return [3 /*break*/, 4];
                                return [4 /*yield*/, isReplaced($)];
                            case 3:
                                _o = !(_p.sent());
                                _p.label = 4;
                            case 4:
                                if (!_o) return [3 /*break*/, 6];
                                return [4 /*yield*/, sendOwn($, { to: { agentId: one.id }, text: named(RESTARTED_WORK) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 5:
                                _m = _p.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                _m = undefined;
                                _p.label = 7;
                            case 7:
                                r = _m;
                                if (!(r === null || r === void 0 ? void 0 : r.isDelivered)) return [3 /*break*/, 10];
                                return [4 /*yield*/, log($, "work ".concat(one.id, " had stopped mid-step (the engine lists it ").concat(status_1, "): started again"))];
                            case 8:
                                _p.sent();
                                return [4 /*yield*/, sayInChat($, named(RESTARTED_IN_CHAT(titleOf(one), mins)))];
                            case 9:
                                _p.sent();
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, sayInChat($, named(STUCK_IN_CHAT(titleOf(one), mins)))];
                            case 11:
                                _p.sent();
                                _p.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, told_1 = told;
                _f.label = 6;
            case 6:
                if (!(_i < told_1.length)) return [3 /*break*/, 9];
                one = told_1[_i];
                return [5 /*yield**/, _loop_1(one)];
            case 7:
                _f.sent();
                _f.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, read($, todos)];
            case 10:
                list = _f.sent();
                _loop_2 = function (agent) {
                    if (!list.some(function (one) { return one.id === agent && one.status === 'working'; }))
                        seenLines.delete(agent);
                };
                for (_b = 0, _c = seenLines.keys(); _b < _c.length; _b++) {
                    agent = _c[_b];
                    _loop_2(agent);
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
        ? helpers.every(isLong) ? " ".concat(helpers.length === 1 ? 'Its helper is still' : helpers.length === 2 ? 'Both helpers are still' : "All ".concat(helpers.length, " helpers are still"), " waiting.") : ''
        : isLong(one) ? " One step has been running for ".concat(took(at - ((_b = (_a = one.running) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : at)), ".") : '';
    return "No progress for ".concat(mins, " min.").concat(tail);
};
// A row's running call, with its time, once it has run RUNNING_SHOWN
var runningLine = function (one, at) { return (one.status === 'working' && one.running && at - one.running.at >= RUNNING_SHOWN ? "".concat(one.running.what, " \u00B7 ").concat(took(at - one.running.at)) : ''); };
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
var endedWord = function (run) { return (run.how === 'failed' ? "failed".concat(run.code ? " (exit code ".concat(run.code, ")") : '') : run.how === 'stopped' ? 'stopped' : run.how); };
// The closing row under a card: how many helpers and runs have ended, then how many of the runs did not finish well, in words
var endedSummary = function (helpers, runs) {
    var n = function (count, word) { return "".concat(count, " ").concat(word).concat(count === 1 ? '' : 's'); };
    var head = helpers && runs.length ? "".concat(n(helpers, 'helper'), " and ").concat(n(runs.length, 'command'), " ended") : helpers ? "".concat(n(helpers, 'helper'), " ended") : "".concat(n(runs.length, 'command'), " ended");
    var bad = ['failed', 'killed', 'timed out'].flatMap(function (how) {
        var count = runs.filter(function (r) { return r.how === how; }).length;
        return count ? ["".concat(count, " ").concat(how)] : [];
    });
    return bad.length ? "".concat(head, " \u00B7 ").concat(bad.join(', ')) : head;
};
// The runs a card has had end, kept so its summary row and Details can say how each ended
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
        return "Still working: Claude is waiting for a background command".concat(more, " to finish");
    return "Still working: Claude is waiting for a background command".concat(more, " to finish, running ").concat(took(at - first.at)).concat(first.what ? ": ".concat(cut(first.what, 90)) : '');
};
// What finished work left running says on its card
var leftLine = function (one, at) { return (one.leftSince && one.status !== 'working' ? "Claude left something running in the background, ".concat(took(at - one.leftSince)) : ''); };
