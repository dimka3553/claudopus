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
// Heavy commands wait their turn: a task's browser, build or render that would start while the Mac is busy and another of the
// chat's heavy commands runs waits its turn, shown on its card with its place in the line, and the waiting ones go in the order
// they came once there is room. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once: captures timed out and
// a dev server took 13 s a request; on 15 Nov this Mac's load average reached 204 on 18 cores. What counts as heavy is heavyOf in
// hooks/jobs.ts; the marks are the person's setting (`heavy` in config.json, HEAVY_MODES in hooks/config.tsx)
//
// Nothing waits in a hook or with a sleep: a command that must wait is refused at once with its place in the line, so its work stays
// free to read messages and do other things, and Claudopus starts the work again the moment its turn comes (or after 15 minutes at
// the latest, so nothing waits for good on load the chat's work does not make); the work then sends the same command, which runs
var HEAVY_MOST = 15 * 60000;
// After one is let go, the next waits this long unless few run, so the load of the last shows before another starts
var HEAVY_RAMP = 20000;
// The held calls in the order they came, and the heavy calls let through whose call has not ended, by tool_use_id
var heavyQueue = [];
// Work whose turn came runs its next heavy command at once until then (heavyPass on its card, so a reload keeps it): a turn not
// taken by then goes to the next in line
var HEAVY_PASS = 3 * 60000;
// How many times the first in line was told its turn in vain; after three the chat is told, and the line goes on
var heavyTries = new Map();
// Whether a piece of work waits for a heavy command's turn, its own or a helper's under it: its step's end is no finish then, and
// only its turn starts it again
var isTurnWaited = function (list, id) { return list.some(function (one) { var _a; return (one.id === id || one.parentId === id) && ((_a = one.heldCalls) === null || _a === void 0 ? void 0 : _a.length); }); };
var heavyOpen = new Map();
// The commands judged heavy, as cards keep a background or detached run's command, so one that goes on past its call still counts
var heavySeen = new Set();
var heavyLetAt = 0;
var keptCmd = function (command) { return oneLine(command).slice(0, 400); };
// How many heavy commands of this chat's work run now: calls held open, and runs in the background or detached that go on (never
// another chat's card, which this chat's memory of what is heavy does not cover)
var heavyRunning = function (list, now) {
    return heavyOpen.size + list.filter(function (one) { var _a; return !one.chat && ((_a = one.heavyPass) !== null && _a !== void 0 ? _a : 0) > now; }).length + list.filter(function (one) { return !one.chat; }).reduce(function (n, one) { var _a, _b; return n + __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []), true).filter(function (run) { return run.cmd && heavySeen.has(run.cmd); }).length; }, 0);
};
// Whether the Mac is past the setting's marks: its load average for each core, or its memory in use
var isMacBusy = function (f, mode) {
    return Boolean(f && ((f.load !== undefined && f.loadCores && f.load >= mode.load * f.loadCores) || (f.memTotal > 0 && f.memUsed / f.memTotal >= mode.memory)));
};
// Whether a heavy command may start now: always when none of the chat's runs, so it never waits on load the work does not make;
// never while the Mac is busy; else when few run, or none was let go just now, so the load of the last shows before the next
var heavyRoom = function (list, f, mode, now) {
    var _a;
    if (mode.value === 'never')
        return true;
    var running = heavyRunning(list, now);
    if (!running)
        return true;
    if (isMacBusy(f, mode))
        return false;
    return running < Math.max(2, Math.round(((_a = f === null || f === void 0 ? void 0 : f.loadCores) !== null && _a !== void 0 ? _a : 8) / 4)) || now - heavyLetAt >= HEAVY_RAMP;
};
// How busy the Mac is, in words
var busyWords = function (f) {
    return !f ? 'busy' : [f.load !== undefined && f.loadCores ? "load ".concat(Math.round(f.load), " on ").concat(f.loadCores, " cores") : '', f.memTotal ? "".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB memory in use") : ''].filter(Boolean).join(', ');
};
var placeWords = function (n) { return (n === 1 ? 'next in line' : "".concat(n).concat(n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : n % 10 === 1 && n % 100 !== 11 ? 'st' : 'th', " in line")); };
var HEAVY_HELD = function (what, place, f, isHelper) {
    return "Not run yet: the Mac is busy (".concat(busyWords(f), ") and other heavy commands of Claudopus's tasks run, so this one (\"").concat(what, "\") waits its turn, ").concat(placeWords(place), ". Do other work that does not need it, or end your step").concat(isHelper ? ' without handing back' : '', ": Claudopus starts you again when its turn comes, in 15 minutes at the latest. Then send the same command again.");
};
var HEAVY_LOST = function (title, what) { return "Claudopus couldn't tell the task \"".concat(title, "\" that its command \"").concat(what, "\" can run now. Send the task a message so it carries on."); };
var HEAVY_TURN = function (what, isLate) {
    return isLate
        ? "Your command \"".concat(what, "\" has waited 15 minutes for room on the Mac: send it again now, and it runs whatever the load. If it fails or times out for lack of room, try it again later.")
        : "It is your command's turn: the Mac has room for \"".concat(what, "\" now. Send it again now, and it runs at once.");
};
// Every card's held calls, with their places in the line, kept on the cards so a new copy of the mod takes the line up as it was
var showHeld = function ($) {
    return changeTodos($, function (list) {
        return list.map(function (one) {
            var _a;
            if (one.chat)
                return one;
            var mine = heavyQueue.flatMap(function (call, n) { return (call.agent === one.id ? [{ id: call.id, what: call.what, cmd: call.cmd, at: call.at, place: n + 1 }] : []); });
            if (!mine.length && !one.heldCalls)
                return one;
            if (JSON.stringify(mine) === JSON.stringify((_a = one.heldCalls) !== null && _a !== void 0 ? _a : []))
                return one;
            return __assign(__assign({}, one), { heldCalls: mine.length ? mine : undefined });
        });
    }).then(function () { return redraw($); });
};
// A held row as the card's tree draws it: a wait for its turn, with how it stands
var heldJobs = function (one) { var _a; return ((_a = one.heldCalls) !== null && _a !== void 0 ? _a : []).map(function (call) { return (__assign(__assign({}, jobOf("held-".concat(call.id), call.what, call.cmd, call.at)), { kind: 'wait', waitsFor: "its turn to run ".concat(labelOf(call.what, call.cmd)), target: "Waiting until the Mac is less busy \u00B7 ".concat(placeWords(call.place)) })); }); };
// Whether a piece of work's Bash call runs now or waits its turn: a deny with its place in the line, else the call's id, to take
// out of heavyOpen as the call ends. Nothing waits here: the answer is given at once
var turnHeavy = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var input, command, _a, _b, agent, list, mode, _c, id, cmd, now, pass, waiting, call;
    var _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                input = e;
                command = String((_d = input.command) !== null && _d !== void 0 ? _d : '');
                _a = heavyOf;
                _b = [command];
                return [4 /*yield*/, scriptsRun($, command)];
            case 1:
                if (!_a.apply(void 0, _b.concat([_k.sent()])))
                    return [2 /*return*/, {}];
                agent = (_e = e.agentId) !== null && _e !== void 0 ? _e : '';
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _k.sent();
                if (!list.some(function (one) { return one.id === agent && !one.chat; }))
                    return [2 /*return*/, {}];
                _c = heavyModeOf;
                return [4 /*yield*/, readConfig($, dir)];
            case 3:
                mode = _c.apply(void 0, [_k.sent()]);
                if (mode.value === 'never')
                    return [2 /*return*/, {}];
                id = String((_f = input.tool_use_id) !== null && _f !== void 0 ? _f : '');
                cmd = keptCmd(command);
                heavySeen.add(cmd);
                return [4 /*yield*/, lookUsage($).catch(function () { return undefined; })];
            case 4:
                _k.sent();
                return [4 /*yield*/, $.clock.now()
                    // Work whose turn came runs its next heavy command at once, its place given up
                ];
            case 5:
                now = _k.sent();
                pass = (_g = list.find(function (one) { return one.id === agent; })) === null || _g === void 0 ? void 0 : _g.heavyPass;
                if (!pass) return [3 /*break*/, 7];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (one.id === agent ? __assign(__assign({}, one), { heavyPass: undefined }) : one); }); })];
            case 6:
                _k.sent();
                _k.label = 7;
            case 7:
                waiting = heavyQueue.find(function (one) { return one.agent === agent && one.cmd === cmd; });
                if (!((pass && pass > now) || (!heavyQueue.length && heavyRoom(list, usageNow(now), mode, now)))) return [3 /*break*/, 10];
                if (!waiting) return [3 /*break*/, 9];
                return [4 /*yield*/, leaveLine($, waiting.id)];
            case 8:
                _k.sent();
                _k.label = 9;
            case 9: return [2 /*return*/, (heavyOpen.set(id, agent), (heavyLetAt = now), { id: id })];
            case 10:
                call = waiting !== null && waiting !== void 0 ? waiting : { id: id, agent: agent, what: oneLine(String((_h = input.description) !== null && _h !== void 0 ? _h : '')) || labelOf('', command), cmd: cmd, at: now };
                if (!!waiting) return [3 /*break*/, 13];
                heavyQueue.push(call);
                return [4 /*yield*/, log($, "work ".concat(agent, "'s heavy command waits its turn (").concat(heavyQueue.length, " held, Mac ").concat(busyWords(usageNow(now)), ")"))];
            case 11:
                _k.sent();
                return [4 /*yield*/, showHeld($)];
            case 12:
                _k.sent();
                _k.label = 13;
            case 13: return [2 /*return*/, { deny: HEAVY_HELD(cut(call.what, 120), heavyQueue.indexOf(call) + 1, usageNow(now), Boolean((_j = list.find(function (one) { return one.id === agent; })) === null || _j === void 0 ? void 0 : _j.parentId)) }];
        }
    });
}); };
// A held call taken out of the line
var leaveLine = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                heavyQueue = heavyQueue.filter(function (one) { return one.id !== id; });
                heavyTries.delete(id);
                return [4 /*yield*/, showHeld($)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// As the list is followed: work that stopped or reported leaves the line, and the first in line whose turn has come (room on the
// Mac, or 15 minutes waited) is started again, or told at a step of its own, to send its command again
var lookHeld = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var list, _loop_1, _i, heavyQueue_1, call, first, now, isLate, _a, _b, _c, _d, text, isAtStep, r, _e, _f, tries, card;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (!dir || isOff || !heavyQueue.length)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _j.sent();
                _loop_1 = function (call) {
                    var card_1;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                card_1 = list.find(function (one) { return one.id === call.agent; });
                                if (!(!card_1 || card_1.status !== 'working' || card_1.handedBackAt !== undefined)) return [3 /*break*/, 2];
                                return [4 /*yield*/, leaveLine($, call.id)];
                            case 1:
                                _k.sent();
                                _k.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, heavyQueue_1 = heavyQueue;
                _j.label = 2;
            case 2:
                if (!(_i < heavyQueue_1.length)) return [3 /*break*/, 5];
                call = heavyQueue_1[_i];
                return [5 /*yield**/, _loop_1(call)];
            case 3:
                _j.sent();
                _j.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                first = heavyQueue[0];
                if (!first)
                    return [2 /*return*/];
                return [4 /*yield*/, lookUsage($).catch(function () { return undefined; })];
            case 6:
                _j.sent();
                return [4 /*yield*/, $.clock.now()];
            case 7:
                now = _j.sent();
                if (!list.some(function (one) { return one.heavyPass !== undefined && one.heavyPass <= now; })) return [3 /*break*/, 9];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (one.heavyPass !== undefined && one.heavyPass <= now ? __assign(__assign({}, one), { heavyPass: undefined }) : one); }); })
                    // (those waited past 15 minutes go one at a time too, spaced as a burst is, never all at once)
                ];
            case 8:
                _j.sent();
                _j.label = 9;
            case 9:
                isLate = now - first.at >= HEAVY_MOST && now - heavyLetAt >= HEAVY_RAMP;
                _a = !isLate;
                if (!_a) return [3 /*break*/, 12];
                _b = heavyRoom;
                return [4 /*yield*/, read($, todos)];
            case 10:
                _c = [_j.sent(), usageNow(now)];
                _d = heavyModeOf;
                return [4 /*yield*/, readConfig($, dir)];
            case 11:
                _a = !_b.apply(void 0, _c.concat([_d.apply(void 0, [_j.sent()]), now]));
                _j.label = 12;
            case 12:
                if (_a)
                    return [2 /*return*/];
                text = HEAVY_TURN(cut(first.what, 120), isLate);
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 13:
                isAtStep = ((_g = (_j.sent()).find(function (agent) { return agent.id === first.agent; })) === null || _g === void 0 ? void 0 : _g.status) === 'running';
                if (!isAtStep) return [3 /*break*/, 15];
                return [4 /*yield*/, tell($, first.agent, text).then(function () { return ({ isDelivered: true, reason: '' }); }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
            case 14:
                _e = _j.sent();
                return [3 /*break*/, 20];
            case 15: return [4 /*yield*/, isReplaced($)];
            case 16:
                if (!(_j.sent())) return [3 /*break*/, 17];
                _f = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, sendOwn($, { to: { agentId: first.agent }, text: text }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })
                // Not reached: it stays first in line and is told again at the next look, three times at most, before the chat is told
            ];
            case 18:
                _f = _j.sent();
                _j.label = 19;
            case 19:
                _e = _f;
                _j.label = 20;
            case 20:
                r = _e;
                tries = ((_h = heavyTries.get(first.id)) !== null && _h !== void 0 ? _h : 0) + 1;
                if (!(!r.isDelivered && tries < 3)) return [3 /*break*/, 22];
                heavyTries.set(first.id, tries);
                return [4 /*yield*/, log($, "work ".concat(first.agent, "'s heavy command's turn not told, tried again next look: ").concat(r.reason))];
            case 21: return [2 /*return*/, void (_j.sent())];
            case 22: return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (one.id === first.agent && r.isDelivered ? __assign(__assign({}, one), { heavyPass: now + HEAVY_PASS }) : one); }); })];
            case 23:
                _j.sent();
                return [4 /*yield*/, leaveLine($, first.id)];
            case 24:
                _j.sent();
                heavyLetAt = now;
                if (!(r.isDelivered && !isAtStep)) return [3 /*break*/, 26];
                return [4 /*yield*/, wakeCard($, first.agent)];
            case 25:
                _j.sent();
                _j.label = 26;
            case 26:
                card = list.find(function (one) { return one.id === first.agent; });
                if (!!r.isDelivered) return [3 /*break*/, 28];
                return [4 /*yield*/, (card ? lostToPerson($, card, HEAVY_LOST(titleOf(card), cut(first.what, 120))) : tellChat($, HEAVY_LOST(first.agent, cut(first.what, 120))))];
            case 27:
                _j.sent();
                _j.label = 28;
            case 28: return [4 /*yield*/, log($, "work ".concat(first.agent, "'s heavy command's turn came after ").concat(shortAgo(now - first.at)).concat(isLate ? ', before the Mac had room' : '', ": ").concat(r.isDelivered ? (isAtStep ? 'told' : 'started again') : "not reached (".concat(r.reason, "): the chat is told")))];
            case 29:
                _j.sent();
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// The line as the cards keep it, taken up by a new copy of the mod (a reload), in the order it had; a card's own wait stands
var clearHeld = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var kept;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (heavyQueue.length)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 1:
                kept = (_a.sent()).filter(function (one) { return !one.chat && one.status === 'working'; }).flatMap(function (one) { var _a; return ((_a = one.heldCalls) !== null && _a !== void 0 ? _a : []).map(function (call) { return (__assign(__assign({}, call), { agent: one.id })); }); });
                heavyQueue = kept.sort(function (a, b) { return a.place - b.place; }).map(function (_a) {
                    var id = _a.id, agent = _a.agent, what = _a.what, cmd = _a.cmd, at = _a.at;
                    return ({ id: id, agent: agent, what: what, cmd: cmd, at: at });
                });
                return [4 /*yield*/, showHeld($)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
