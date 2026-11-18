// The chat's own life: its start and end, each message and reply, compaction, and what it is told
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
// How full this chat's context is, against the window the app's own panel measures it by
var measure = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var context, window;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.session.usage({ breakdown: 'summary' }).catch(function () { return undefined; })];
            case 1:
                context = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.context;
                window = (_c = (_b = context === null || context === void 0 ? void 0 : context.breakdown) === null || _b === void 0 ? void 0 : _b.rawMaxTokens) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.window;
                return [2 /*return*/, update($, me, function (one) { var _a; return (__assign(__assign({}, one), { tokens: (_a = context === null || context === void 0 ? void 0 : context.tokens) !== null && _a !== void 0 ? _a : one.tokens, window: window !== null && window !== void 0 ? window : one.window })); })];
        }
    });
}); };
// ---- After each reply: the size, the answer, the asks and the title ----
var afterReply = function ($, text, answer) { return __awaiter(_this, void 0, void 0, function () {
    var title, m, isRelay, r, lines, asks, named;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, measure($)];
            case 1:
                _c.sent();
                return [4 /*yield*/, appTitle($)];
            case 2:
                title = _c.sent();
                return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { title: title || one.title })); })
                    // A server is looked for while the chat that started it is still above it
                ];
            case 3:
                m = _c.sent();
                // A server is looked for while the chat that started it is still above it
                return [4 /*yield*/, scanServers($).catch(function (err) { return log($, "servers not read: ".concat(String(err))); })
                    // What Claude answered is kept beside what the person said, so a search finds what happened as well as what was asked
                ];
            case 4:
                // A server is looked for while the chat that started it is still above it
                _c.sent();
                if (!answer.trim()) return [3 /*break*/, 6];
                return [4 /*yield*/, appendWords($, m.id, "### Claude ".concat(new Date().toISOString(), "\n").concat(answer.trim(), "\n\n")).catch(function (err) { return log($, "answer not saved: ".concat(String(err))); })];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                isRelay = !text.trim();
                if (isRelay && answer.trim().length < 200)
                    return [2 /*return*/];
                return [4 /*yield*/, $.model.complete({
                        model: 'sonnet',
                        system: ASKS_SYSTEM,
                        prompt: "Current title: ".concat(m.title || '(none)', "\n\nUser message:\n\"\"\"\n").concat(isRelay ? '(none: this reply relays the result of a background agent)' : clip(text, 3000), "\n\"\"\"\n\nAssistant reply (shortened):\n\"\"\"\n").concat(clip(answer, isRelay ? 1500 : 600), "\n\"\"\""),
                        maxTokens: 500,
                    })];
            case 7:
                r = _c.sent();
                if (!r.isAnswered)
                    return [2 /*return*/];
                lines = r.text.split('\n').map(function (line) { return line.trim(); });
                asks = lines.filter(function (line) { return line.startsWith('- ') || /^did:/i.test(line); });
                if (!asks.length) return [3 /*break*/, 9];
                return [4 /*yield*/, appendAsks($, m.id, "## ".concat(new Date().toISOString(), "\n").concat(asks.join('\n'), "\n\n"))];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                named = (_b = (_a = lines.find(function (line) { return /^title:/i.test(line); })) === null || _a === void 0 ? void 0 : _a.replace(/^title:\s*/i, '').trim()) !== null && _b !== void 0 ? _b : '';
                if (!(named && named !== m.title && named.length <= 80)) return [3 /*break*/, 11];
                return [4 /*yield*/, $.mcp
                        .call('ccd_session_mgmt', 'set_session_title', { session_id: 'self', title: named })
                        .then(function () { return update($, me, function (one) { return (__assign(__assign({}, one), { title: named })); }); })
                        .catch(function () { return undefined; })];
            case 10:
                _c.sent();
                _c.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); };
// Work the engine still listed as running as its turn ended is looked at again this long after: one whose run was over by then is
// listed as completed, and the look ends its card (sync) and passes on a reply it never read, as the turn's end would have
var HELD_LOOK = 1500;
var heldLook = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var wasWorking, listed, now_1, one, isShort, _a, _b, _c, _d, _e, card;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                wasWorking = ((_f = (_k.sent()).find(function (one) { return one.id === id; })) === null || _f === void 0 ? void 0 : _f.status) === 'working';
                return [4 /*yield*/, sync($)
                    // Listed as idle, or no longer listed, its run is over too: nothing holds it
                ];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.list().catch(function () { return undefined; })];
            case 3:
                listed = (_h = (_g = (_k.sent())) === null || _g === void 0 ? void 0 : _g.find(function (one) { return one.id === id; })) === null || _h === void 0 ? void 0 : _h.status;
                if (!(listed === 'idle' || listed === undefined)) return [3 /*break*/, 15];
                return [4 /*yield*/, $.clock.now()
                    // (a task left stopped partway is started again to carry on, not ended)
                ];
            case 4:
                now_1 = _k.sent();
                return [4 /*yield*/, read($, todos)];
            case 5:
                one = (_k.sent()).find(function (card) { return card.id === id; });
                _c = (one === null || one === void 0 ? void 0 : one.status) === 'working' && isStoppedShort(one, '');
                if (!_c) return [3 /*break*/, 7];
                _d = ownsNothing;
                return [4 /*yield*/, read($, todos)];
            case 6:
                _c = _d.apply(void 0, [_k.sent(), id]);
                _k.label = 7;
            case 7:
                _b = _c && !one.wakeWhen;
                if (!_b) return [3 /*break*/, 9];
                _e = isTurnWaited;
                return [4 /*yield*/, read($, todos)];
            case 8:
                _b = !_e.apply(void 0, [_k.sent(), id]);
                _k.label = 9;
            case 9:
                _a = _b;
                if (!_a) return [3 /*break*/, 11];
                return [4 /*yield*/, pressedAtEnd($, id)];
            case 10:
                _a = (_k.sent());
                _k.label = 11;
            case 11:
                isShort = _a;
                if (!isShort) return [3 /*break*/, 13];
                return [4 /*yield*/, goOn($, id, 'its step ended', true)];
            case 12:
                _k.sent();
                return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id && one.status === 'working' ? ended(one, 'done', now_1) : one); }); })];
            case 14:
                _k.sent();
                _k.label = 15;
            case 15: return [4 /*yield*/, read($, todos)];
            case 16:
                card = (_k.sent()).find(function (one) { return one.id === id; });
                if ((card === null || card === void 0 ? void 0 : card.status) === 'working')
                    return [2 /*return*/];
                return [4 /*yield*/, replyUnread($, id)];
            case 17:
                _k.sent();
                if (!wakes.length) return [3 /*break*/, 19];
                return [4 /*yield*/, sendWakes($)
                    // A helper the engine still listed as running as its turn ended, ended now: its result is passed on as at a heard end. Read as at
                    // work before the look, as the look itself ends it; one the look for work that ended unheard passed on is not passed on again
                    // (passOnHelper)
                ];
            case 18:
                _k.sent();
                _k.label = 19;
            case 19:
                if (!(wasWorking && (card === null || card === void 0 ? void 0 : card.parentId) && card.parentId !== HELPER)) return [3 /*break*/, 21];
                return [4 /*yield*/, passOnHelper($, id, (_j = card.answer) !== null && _j !== void 0 ? _j : '', card.status)];
            case 20:
                _k.sent();
                _k.label = 21;
            case 21: return [2 /*return*/];
        }
    });
}); };
// The notices with nothing new let in since the chat's last turn started, each whole; the turns to answer with no model
var quietHeld = new Set();
var quietTurns = new Set();
// A turn of a task or helper ends: its card follows what it ended with (chatHooks' turn.complete)
var agentTurnEnded = function ($, e, id, done) { return __awaiter(_this, void 0, void 0, function () {
    var now, said, answer, listed, isHeld, how, isOwnResult, _a, _b, isGoingOn, _c, _d, isReport, _e, _f, _g, isIdleReport, _h, _j, isTop, isHandedBack, _k, isReceived, isShortHow, mayBeShort, _l, _m, _o, isCarried, card, report;
    var _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0: return [4 /*yield*/, $.clock.now()
                // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer; the line
                // Claudopus answered Claude Code's press with is no answer of its own (its card keeps what it said before)
            ];
            case 1:
                now = _u.sent();
                said = ((_p = e.answer) !== null && _p !== void 0 ? _p : '').trim();
                answer = ((said === PRESS_ANSWER ? '' : said) || handedBack.get(id) || '').slice(0, ANSWER_CHARS);
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 2:
                listed = (_q = (_u.sent()).find(function (one) { return one.id === id; })) === null || _q === void 0 ? void 0 : _q.status;
                isHeld = listed === 'waiting' || listed === 'running';
                if (listed === 'running')
                    $.clock.after(HELD_LOOK, function () { return void heldLook($, id).catch(function (err) { return log($, "work ".concat(id, " not looked at again: ").concat(String(err))); }); });
                how = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done';
                _b = how === 'done';
                if (!_b) return [3 /*break*/, 4];
                return [4 /*yield*/, read($, todos)];
            case 3:
                _b = !((_r = (_u.sent()).find(function (one) { return one.id === id; })) === null || _r === void 0 ? void 0 : _r.parentId);
                _u.label = 4;
            case 4:
                _a = _b;
                if (!_a) return [3 /*break*/, 6];
                return [4 /*yield*/, isUnpressed($, id)];
            case 5:
                _a = (_u.sent());
                _u.label = 6;
            case 6:
                isOwnResult = _a;
                _c = how === 'done' && isHeld;
                if (!_c) return [3 /*break*/, 8];
                _d = goesOn;
                return [4 /*yield*/, read($, todos)];
            case 7:
                _c = _d.apply(void 0, [_u.sent(), id]);
                _u.label = 8;
            case 8:
                isGoingOn = _c;
                _e = how === 'done' && isHeld && !isGoingOn;
                if (!_e) return [3 /*break*/, 11];
                _f = handedBack.has(id);
                if (_f) return [3 /*break*/, 10];
                _g = isWordsReport;
                return [4 /*yield*/, read($, todos)];
            case 9:
                _f = _g.apply(void 0, [(_u.sent()).find(function (one) { return one.id === id; }), answer]);
                _u.label = 10;
            case 10:
                _e = (_f);
                _u.label = 11;
            case 11:
                isReport = _e;
                _h = isReport;
                if (!_h) return [3 /*break*/, 13];
                _j = ownsNothing;
                return [4 /*yield*/, read($, todos)];
            case 12:
                _h = _j.apply(void 0, [_u.sent(), id]);
                _u.label = 13;
            case 13:
                isIdleReport = _h;
                return [4 /*yield*/, read($, todos)];
            case 14:
                isTop = !((_s = (_u.sent()).find(function (one) { return one.id === id; })) === null || _s === void 0 ? void 0 : _s.parentId);
                isHandedBack = how === 'done' && (handedBack.has(id) || (isIdleReport && (isOwnResult || !isTop))) && !isGoingOn;
                if (!isHandedBack) return [3 /*break*/, 16];
                _k = ownsNothing;
                return [4 /*yield*/, read($, todos)];
            case 15:
                (_k.apply(void 0, [_u.sent(), id]) ? leftNothing.add(id) : leftNothing.delete(id));
                _u.label = 16;
            case 16:
                isReceived = isHandedBack && isTop;
                handedBack.delete(id);
                if (isHandedBack)
                    endedByHandback.add(id);
                if (!isHandedBack) return [3 /*break*/, 18];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign(__assign({}, one), { handedBackAt: now, wakeWhen: undefined }), (isReceived ? { reportAt: now } : {})) : one); }); })
                    // Work nothing holds any more has nothing of its own left running in the background
                ];
            case 17:
                _u.sent();
                _u.label = 18;
            case 18:
                if (!!isHeld) return [3 /*break*/, 20];
                return [4 /*yield*/, changeTodos($, function (list) { return (list.some(function (one) { return one.id === id && one.bg; }) ? list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { bg: undefined, waitsSince: undefined }) : one); }) : list); })
                    // A task of this chat's whose step ended with no result, no question and nothing of its own that starts it again is not
                    // finished: it stays at work, and Claudopus starts it again to carry on (carryOn). Not one that was stopped, nor one refused
                ];
            case 19:
                _u.sent();
                _u.label = 20;
            case 20:
                isShortHow = how === 'done' || (how === 'failed' && e.reason === 'error');
                _m = isShortHow && !isHandedBack;
                if (!_m) return [3 /*break*/, 22];
                _o = isStoppedShort;
                return [4 /*yield*/, read($, todos)];
            case 21:
                _m = _o.apply(void 0, [(_u.sent()).find(function (one) { return one.id === id; }), answer]);
                _u.label = 22;
            case 22:
                _l = _m;
                if (!_l) return [3 /*break*/, 24];
                return [4 /*yield*/, pressedAtEnd($, id)];
            case 23:
                _l = (_u.sent());
                _u.label = 24;
            case 24:
                mayBeShort = _l;
                isCarried = false;
                return [4 /*yield*/, changeTodos($, function (list) {
                        isCarried = false;
                        // (or for what it asked Claudopus to start it again for)
                        // (or for a command of its own that ends and starts it again, detached or left going: wakesOf)
                        var self = list.find(function (one) { return one.id === id; });
                        var isWaiting = how === 'done' && !isHandedBack && (isHeld || isTurnWaited(list, id) || list.some(function (one) { return (one.parentId === id && one.status === 'working') || (one.id === id && one.wakeWhen !== undefined); }) || Boolean(self && !self.parentId && wakesOf(list, self).isAny));
                        // What it waits on of its own, since when: the card says so, and a long wait for it is not taken for being stuck
                        // Work that gave its report waits on nothing it means to finish
                        var waitsSince = function (one) { var _a, _b; return (isHeld && !isReport && ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch; })) ? ((_b = one.waitsSince) !== null && _b !== void 0 ? _b : now) : undefined); };
                        // An aborted turn's own text is not kept over the report the work gave before it was stopped
                        return list.map(function (one) {
                            var _a;
                            return one.id !== id
                                ? one
                                : // Work that had ended, woken by what it left running, that ends a turn of words alone has not worked again: it stays
                                    // as it ended, with its report, and is not announced a second time
                                    one.status !== 'working' && how === 'done' && !isHandedBack && endedByHandback.has(id)
                                        ? one
                                        : isWaiting
                                            ? __assign(__assign({}, one), { answer: answer || one.answer, answeredAt: isReport ? now : one.answeredAt, waitsSince: waitsSince(one), endedStepAt: now }) : how === 'stopped'
                                            ? one.status === 'working'
                                                ? ended(one, stoppedAs(one), now)
                                                : one
                                            : mayBeShort && one.status === 'working' && isStoppedShort(one, answer)
                                                ? ((isCarried = true), __assign(__assign({}, one), { answer: answer || one.answer }))
                                                : __assign(__assign(__assign({}, ended(one, how, now)), { answer: answer || one.answer }), (isOwnResult && !one.parentId ? { reportAt: (_a = one.reportAt) !== null && _a !== void 0 ? _a : now } : {}));
                        });
                    })];
            case 25:
                _u.sent();
                if (!isCarried) return [3 /*break*/, 27];
                return [4 /*yield*/, goOn($, id, e.reason === 'error' ? 'its step failed' : 'its step ended', true)];
            case 26:
                _u.sent();
                _u.label = 27;
            case 27:
                if (!(how === 'stopped')) return [3 /*break*/, 29];
                return [4 /*yield*/, keepStoppedReports($, now)];
            case 28:
                _u.sent();
                _u.label = 29;
            case 29: return [4 /*yield*/, lookEnds($)
                // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
            ];
            case 30:
                _u.sent();
                return [4 /*yield*/, read($, todos)];
            case 31:
                if (!(((_t = (_u.sent()).find(function (one) { return one.id === id; })) === null || _t === void 0 ? void 0 : _t.status) !== 'working')) return [3 /*break*/, 33];
                return [4 /*yield*/, replyUnread($, id).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })
                    // A go-ahead pressed during this turn does its last step now, before the wakes go, so its small task starts from this hook
                ];
            case 32:
                _u.sent();
                _u.label = 33;
            case 33: 
            // A go-ahead pressed during this turn does its last step now, before the wakes go, so its small task starts from this hook
            return [4 /*yield*/, stepsAtEnd($).catch(function (err) { return log($, "last step not done: ".concat(String(err))); })];
            case 34:
                // A go-ahead pressed during this turn does its last step now, before the wakes go, so its small task starts from this hook
                _u.sent();
                if (!wakes.length) return [3 /*break*/, 36];
                return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })
                    // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
                    // held on its own background work leaves it once it ends (keepStoppedReports)
                ];
            case 35:
                _u.sent();
                _u.label = 36;
            case 36: return [4 /*yield*/, read($, todos)];
            case 37:
                card = (_u.sent()).find(function (one) { return one.id === id; });
                report = (said === PRESS_ANSWER ? '' : said) || answer;
                if (!((card === null || card === void 0 ? void 0 : card.parentId) && card.status !== 'working')) return [3 /*break*/, 39];
                return [4 /*yield*/, passOnHelper($, id, report, card.status).catch(function (err) { return log($, "helper's result not passed on: ".concat(String(err))); })
                    // One that handed back while a command or helper of its own still runs stays at work on its card, but its hand-back reached the
                    // chat, which was told it is passed on: it is passed on now
                ];
            case 38:
                _u.sent();
                return [3 /*break*/, 41];
            case 39:
                if (!((card === null || card === void 0 ? void 0 : card.parentId) && notedAtHandback.has(id))) return [3 /*break*/, 41];
                return [4 /*yield*/, passOnHelper($, id, report, 'done').catch(function (err) { return log($, "helper's result not passed on: ".concat(String(err))); })];
            case 40:
                _u.sent();
                _u.label = 41;
            case 41:
                if (card && !card.parentId && card.status === 'done' && card.endedAt === now && how === 'done' && report) {
                    $.clock.after(5, function () { return void saveReport($, card, report).catch(function (err) { return log($, "report of ".concat(id, " not kept: ").concat(String(err))); }); });
                }
                // What is at work is kept for a restart at once: a task that just finished is never brought back by a quit seconds later
                return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept for the keeper: ".concat(String(err))); })];
            case 42:
                // What is at work is kept for a restart at once: a task that just finished is never brought back by a quit seconds later
                _u.sent();
                return [2 /*return*/, done];
        }
    });
}); };
// The tasks and helpers whose turn's end is being taken up now: the list's look leaves them to it
var turnEnding = new Set();
var chatHooks = function (on) {
    on('session.start', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var begun, home, _a, _b, _i, _c, _d, art, file, text, _e, id, title, isNew, isRunning, choice, _f, _g, _h, now, last, _j, _k, _l, _m, one, seconds, _o;
        var _p, _q, _r, _s;
        var _this = this;
        var _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, knowSystem($).catch(function () { return undefined; })
                    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
                ];
                case 1:
                    _w.sent();
                    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
                    lastSeen = undefined;
                    // and reads its own copy's version again
                    loadedVersion = undefined;
                    // and takes nothing it knew of the person's settings and texts as sealed: the kept copy is checked again
                    knownSeen = undefined;
                    return [4 /*yield*/, next(e)];
                case 2:
                    begun = _w.sent();
                    return [4 /*yield*/, $.env.get('HOME')];
                case 3:
                    home = (_t = (_w.sent())) !== null && _t !== void 0 ? _t : '';
                    dir = "".concat(home, "/.claude/claudopus");
                    // How late the mod's own timer comes: behind, it does less until it has caught up (lookHold). From the start of the load, so a
                    // long hold in the load's own reads is logged with them too
                    holdAt = 0;
                    return [4 /*yield*/, $.env.get('CLAUDOPUS_TIMING')];
                case 4:
                    // (not in the test kit, whose clock a test moves by hours at once: there only a test that asks for it has it)
                    isTimed = (_w.sent()) !== 'test';
                    if (isTimed)
                        everyLoad($, HOLD_LOOK, function () { return lookHold($); });
                    // The mod's own kinds of agent, each starting with only the tools its work takes
                    void registerKinds($);
                    _b = (_a = /truecolor|24bit/i).test;
                    return [4 /*yield*/, $.env.get('COLORTERM')];
                case 5:
                    termLive = _b.apply(_a, [(_u = (_w.sent())) !== null && _u !== void 0 ? _u : '']) ? LIVE : DEEP_LIVE;
                    return [4 /*yield*/, $.env.get('SSH_CONNECTION')];
                case 6:
                    _p = ((_v = (_w.sent())) !== null && _v !== void 0 ? _v : '').trim().split(/\s+/), _q = _p[0], termFrom = _q === void 0 ? '' : _q, _r = _p[2], termHere = _r === void 0 ? '' : _r, _s = _p[3], termPort = _s === void 0 ? '' : _s;
                    _i = 0, _c = Object.entries(ART_FILES);
                    _w.label = 7;
                case 7:
                    if (!(_i < _c.length)) return [3 /*break*/, 10];
                    _d = _c[_i], art = _d[0], file = _d[1];
                    return [4 /*yield*/, readOr($, "".concat($.plugin.root, "/art/").concat(file))];
                case 8:
                    text = _w.sent();
                    ART[art] = text.slice(Math.max(0, text.indexOf('<svg')));
                    _w.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    ART.asking = ART.wave.replaceAll('#8A63F0', NEEDS);
                    ART.updated = updatedArt(ART.happy, FLOW);
                    // A load that moved this chat to a newer version has the header say so, once its octopus is read
                    return [4 /*yield*/, noteLoaded($).catch(function (err) { return log($, "version moved not looked at: ".concat(String(err))); })
                        // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    ];
                case 11:
                    // A load that moved this chat to a newer version has the header say so, once its octopus is read
                    _w.sent();
                    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    return [4 /*yield*/, noteSeen($).catch(function (err) { return log($, "changes seen not noted: ".concat(String(err))); })];
                case 12:
                    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    _w.sent();
                    cwd = e.cwd;
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 13:
                    if (!(_w.sent()).length) return [3 /*break*/, 15];
                    _e = 1;
                    return [4 /*yield*/, $.clock.now()];
                case 14:
                    (loadMark = presses = _e + ((_w.sent()) % 1000000000) * 1000), (freshness += 1);
                    _w.label = 15;
                case 15:
                    (freshDrawn.clear(), freshDue.clear(), freshUnderWay.clear(), (pressedAt = 0), (engagedAt = 0));
                    return [4 /*yield*/, loadSettings($)];
                case 16:
                    _w.sent();
                    return [4 /*yield*/, clearGates($).catch(function (err) { return log($, "admin holds not cleared: ".concat(String(err))); })];
                case 17:
                    _w.sent();
                    return [4 /*yield*/, clearHeld($).catch(function (err) { return log($, "held commands not cleared: ".concat(String(err))); })
                        // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    ];
                case 18:
                    _w.sent();
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    return [4 /*yield*/, closeUndrawn($)];
                case 19:
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    _w.sent();
                    $.clock.after(3000, function () { return closeUndrawn($); });
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    return [4 /*yield*/, watchLoaded($).catch(function (err) { return log($, "tabs not watched: ".concat(String(err))); })
                        // The engine's id names this chat's files, as its transcript is named
                    ];
                case 20:
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    _w.sent();
                    return [4 /*yield*/, $.session.id()];
                case 21:
                    id = _w.sent();
                    heldChat = id;
                    return [4 /*yield*/, appTitle($)
                        // The first load of a session sends the role text; a reload keeps what stands
                    ];
                case 22:
                    title = _w.sent();
                    // The first load of a session sends the role text; a reload keeps what stands
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { id: id, title: title !== null && title !== void 0 ? title : m.title, needsContext: m.id ? m.needsContext : true })); })
                        // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    ];
                case 23:
                    // The first load of a session sends the role text; a reload keeps what stands
                    _w.sent();
                    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    return [4 /*yield*/, noteCut($, id).catch(function (err) { return log($, "cut-off work not looked for: ".concat(String(err))); })
                        // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                        // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    ];
                case 24:
                    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    _w.sent();
                    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    during('load: read the other chats');
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })];
                case 25:
                    _w.sent();
                    keysOnStart($);
                    return [4 /*yield*/, $.tool.register({
                            name: 'update',
                            description: 'Records a topic in the memory index: creates it, or changes the fields given. `brief` replaces the whole page of notes on it: read it first and keep what other tasks wrote.',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    repo: { type: 'string', description: 'The folder the task happens in' },
                                    state: { type: 'string', description: 'How far it has got, in at most six words; start with "done" once it is pushed or deployed. Put detail in `brief`' },
                                    summary: { type: 'string', description: 'One line on what the topic is for' },
                                    brief: { type: 'string' },
                                },
                                required: ['name'],
                            },
                            isDeferred: false,
                        })];
                case 26:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'recall',
                            description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, topic notes, pastes, and the results finished tasks left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
                            inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
                            isDeferred: false,
                        })];
                case 27:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'todo',
                            description: named('For background tasks: keeps the to-dos on your card in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks the one you are doing, ticks it done or drops it; `was` gives its earlier wording when you reword it.'),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    item: { type: 'string', description: named('The to-do in a few plain words, as {name} would say it') },
                                    state: { type: 'string', enum: ['open', 'doing', 'done', 'dropped'] },
                                    was: { type: 'string', description: 'The earlier wording of an item that is being reworded' },
                                },
                                required: ['item'],
                            },
                            isDeferred: false,
                        })];
                case 28:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'note',
                            description: named('For background tasks: says how far you have got, on your card, replacing the line before. Write it when you start and whenever that changes: what is done and what you are doing, in one plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string' },
                                    task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: that request in one line. The chat starts it as a task of its own') },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 29:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'ask',
                            description: named("For background tasks: when a step needs {name}'s own hands or go-ahead now (a code to paste, a box to fill, a key or button to press, an approval), puts your question at the top of the panel on your card and in the chat as a notice; {Name} answers with a button or in their own words. {Name} sees it before your report, so it must carry everything needed to decide and never point at an explanation elsewhere. It stays until answered, even after you finish; the answer arrives as a message at your next step, or starts you again. Meanwhile continue with what does not depend on it, or end your step saying what you are waiting for. Ask again if the answer leaves something open; call it with empty `text` only once you have seen it done. Never open a terminal for a command yourself."),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
                                    details: { type: 'string', description: 'What it is about, in full: what changes, what it costs, what is not done. Short plain lines and "- " lists with a blank line after, no tables or bold: the card is narrow and the chat shows plain text' },
                                    copy: { type: 'string', description: 'Only text they must paste elsewhere, such as a one-time code or a link' },
                                    choices: { type: 'array', items: { type: 'string' }, description: 'Buttons to answer with, such as Approve and Not now (Done and Not now when left out)' },
                                    command: { type: 'string', description: 'A command only they can run, never one you can run yourself: one line, whole, shown with a Copy button' },
                                    cwd: { type: 'string', description: 'The full path of the folder the command runs in, when it has relative paths' },
                                    pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the pictures the question is about, shown with it on the card and in the chat' },
                                    last_step: { type: 'string', description: 'For a go-ahead to finish (the first choice, such as Release it): what you would do on it, in one sentence for this repo, or `release` for the release runner. Claudopus does it on the press without starting you again' },
                                    folder: { type: 'string', description: 'With last_step: the full path of your worktree, where it is done' },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 30:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'wake_me',
                            description: named('For a file, a page or a time that nothing of yours makes (a file another program writes, a page that comes up, a moment to look again): Claudopus looks for it and starts you again the moment it is there, so you end your step instead of waiting with a command. Your own commands, in the background or detached, and your helpers wake you by themselves: never use this for them. Name a file, a line in it, a page, or only minutes; Claudopus looks for at most an hour, and not again for the same once a look ran out. A new call replaces the last one.'),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    what: { type: 'string', description: 'What you wait for, in a few plain words read at a glance on your card' },
                                    file: { type: 'string', description: 'The full path of a file to appear (with `text`, a file to hold that text)' },
                                    text: { type: 'string', description: 'A line of text to appear in `file`' },
                                    url: { type: 'string', description: 'A page to answer without an error' },
                                    minutes: { type: 'number', description: 'With nothing else: start you after this many minutes. With a file or page: the longest to look, after which you are started with word that it never came (15 when left out, at most 60). Should it never come, you are started again and hand back what you have' },
                                },
                                required: ['what'],
                            },
                            isDeferred: false,
                        })];
                case 31:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'waits',
                            description: named("For background tasks, before you finish: records what in your report waits on {name}, each as one short question. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. Each call lists everything still waiting: once you finish, it replaces what your earlier results waited on, and [] says nothing does. The panel answers each with Yes / No, or the answers you name in `choices` when it is not yes or no, and always with Not now and Answer in words. Mark a question you also asked on your card with the `ask` tool with `asked: true`: answering it there answers it here. In the chat: once {name}'s own words have answered what a result waits on, call it with that result's report.md path as `result` and the numbers of the questions they answered as `answered`."),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    items: {
                                        type: 'array',
                                        items: {
                                            anyOf: [
                                                { type: 'string', description: 'A yes-or-no question of at most 140 characters, in plain words, speaking to them as "you"' },
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        text: { type: 'string', description: 'The question, at most 140 characters, in plain words, speaking to them as "you"' },
                                                        choices: { type: 'array', items: { type: 'string' }, description: 'Its answers when it is not yes or no, a few words each (at most 4)' },
                                                        asked: { type: 'boolean', description: 'true when it is the question you asked on your card with the `ask` tool' },
                                                    },
                                                    required: ['text'],
                                                },
                                            ],
                                        },
                                    },
                                    answered: { type: 'array', items: { type: 'number' }, description: named("Only in the chat: the numbers of the result's questions {name}'s words answered") },
                                    result: { type: 'string', description: named("Only in the chat: the report.md path of the result whose questions {name}'s words answered") },
                                },
                                required: [],
                            },
                            isDeferred: false,
                        })];
                case 32:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'claudopus', description: "Open the Claudopus panel: this chat's tasks, questions and results" })];
                case 33:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'servers', description: 'Open the Servers panel: the servers running on this Mac, a link to each and the chat that started it' })];
                case 34:
                    _w.sent();
                    void $.ui.close({ id: OLD_PANE }).catch(function () { return undefined; });
                    return [4 /*yield*/, $.fs.exists("".concat(dir, "/index.md"))];
                case 35:
                    isNew = !(_w.sent());
                    if (!isNew) return [3 /*break*/, 37];
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/index.md"), INDEX_HEAD)];
                case 36:
                    _w.sent();
                    _w.label = 37;
                case 37: return [4 /*yield*/, settleWelcome($, isNew, id).catch(function (err) { return log($, "welcome not settled: ".concat(String(err))); })];
                case 38:
                    _w.sent();
                    return [4 /*yield*/, measure($).catch(function () { return undefined; })];
                case 39:
                    _w.sent();
                    during('load: read finished work');
                    return [4 /*yield*/, loadFinished($).catch(function (err) { return log($, "finished work not read: ".concat(String(err))); })];
                case 40:
                    _w.sent();
                    void recoverEnded($).catch(function (err) { return log($, "ended work not read back: ".concat(String(err))); });
                    during('load: sync the memory');
                    return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 41:
                    _w.sent();
                    during('load: read the results');
                    return [4 /*yield*/, loadReports($).catch(function () { return undefined; })
                        // What the person had typed into a reply box before a reload of the mod is in its box again
                    ];
                case 42:
                    _w.sent();
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    return [4 /*yield*/, readDrafts($).catch(function () { return undefined; })
                        // Work that is running when the chat loads brings the panel up, if it has never opened
                        // and comes back after a reload of the mod (which closes it) if it was open or work is running
                        // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
                    ];
                case 43:
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    _w.sent();
                    return [4 /*yield*/, read($, todos)];
                case 44:
                    isRunning = (_w.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                    panelSeen = '';
                    return [4 /*yield*/, followPanel($).catch(function () { return undefined; })];
                case 45:
                    choice = _w.sent();
                    if (!(!choice && (isRunning || isWelcomeOpen))) return [3 /*break*/, 47];
                    return [4 /*yield*/, openList($)];
                case 46:
                    _w.sent();
                    _w.label = 47;
                case 47:
                    _g = !choice;
                    if (!_g) return [3 /*break*/, 49];
                    return [4 /*yield*/, read($, paneShown)];
                case 48:
                    _g = ((_w.sent()) || isRunning);
                    _w.label = 49;
                case 49:
                    _f = _g;
                    if (!_f) return [3 /*break*/, 51];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 50:
                    _f = !(_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 51;
                case 51:
                    if (!_f) return [3 /*break*/, 53];
                    return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(function (err) { return log($, "panel not opened again: ".concat(String(err))); })
                        // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
                        // open in every chat from now on
                    ];
                case 52:
                    _w.sent();
                    _w.label = 53;
                case 53:
                    _h = !choice;
                    if (!_h) return [3 /*break*/, 55];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 54:
                    _h = (_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 55;
                case 55:
                    if (!_h) return [3 /*break*/, 57];
                    return [4 /*yield*/, choosePanel($, true)];
                case 56:
                    _w.sent();
                    _w.label = 57;
                case 57:
                    everyLoad($, PANEL_EVERY, function () { return followPanel($).catch(function (err) { return log($, "panel not followed: ".concat(String(err))); }); });
                    everyLoad($, FOLLOW_EVERY, function () { return follow($).catch(function (err) { return log($, "work not followed: ".concat(String(err))); }); });
                    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
                    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
                    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
                    lingerSet.clear();
                    return [4 /*yield*/, $.clock.now()
                        // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
                    ];
                case 58:
                    now = _w.sent();
                    return [4 /*yield*/, read($, lastDrawn)];
                case 59:
                    last = _w.sent();
                    lateFrom.clear();
                    _j = 0;
                    _l = [[]];
                    return [4 /*yield*/, read($, flows)];
                case 60:
                    _m = [__spreadArray.apply(void 0, _l.concat([(_w.sent()), true]))];
                    return [4 /*yield*/, read($, todos)];
                case 61:
                    _k = __spreadArray.apply(void 0, _m.concat([(_w.sent()).filter(function (card) { return !card.parentId; }), true]));
                    _w.label = 62;
                case 62:
                    if (!(_j < _k.length)) return [3 /*break*/, 64];
                    one = _k[_j];
                    if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE)
                        lateFrom.set("".concat(one.id, ":").concat(one.endedAt), Infinity);
                    _w.label = 63;
                case 63:
                    _j++;
                    return [3 /*break*/, 62];
                case 64:
                    seconds = 0;
                    everyLoad($, 1000, function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, isFlowing, calmNow, isMoving, _b, _c, _i, heldDrawings_1, _d, key, held_1, _e, now, _loop_1, _f, _g, _h, _j, one;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    _a = drawnNow;
                                    return [4 /*yield*/, read($, lastDrawn)];
                                case 1:
                                    if (!(_a > (_k.sent()))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, update($, lastDrawn, function () { return drawnNow; })];
                                case 2:
                                    _k.sent();
                                    _k.label = 3;
                                case 3: return [4 /*yield*/, shareMine($).catch(function (err) { return log($, "work not shared: ".concat(String(err))); })
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                ];
                                case 4:
                                    _k.sent();
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                    return [4 /*yield*/, lookBoxes($).catch(function (err) { return log($, "boxes not looked at: ".concat(String(err))); })];
                                case 5:
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                    _k.sent();
                                    return [4 /*yield*/, watchFront($).catch(function (err) { return log($, "tab in front not watched: ".concat(String(err))); })
                                        // A bar with a box open reads no cards while it is drawn: what it shows of them is looked at here
                                    ];
                                case 6:
                                    _k.sent();
                                    // A bar with a box open reads no cards while it is drawn: what it shows of them is looked at here
                                    return [4 /*yield*/, lookBar($).catch(function (err) { return log($, "bar not looked at: ".concat(String(err))); })
                                        // While a command has a row, its output is read every few seconds (lookJobs keeps to JOB_LOOK), not only as the list is followed
                                        // every 20: a download rewriting its percent each second sat still for 20 seconds and read "nothing printed for 15s" (16 Nov)
                                    ];
                                case 7:
                                    // A bar with a box open reads no cards while it is drawn: what it shows of them is looked at here
                                    _k.sent();
                                    // While a command has a row, its output is read every few seconds (lookJobs keeps to JOB_LOOK), not only as the list is followed
                                    // every 20: a download rewriting its percent each second sat still for 20 seconds and read "nothing printed for 15s" (16 Nov)
                                    if (jobLog.size)
                                        void lookJobs($).catch(function (err) { return log($, "jobs not read: ".concat(String(err))); });
                                    if (!(seconds % 60 === 30)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, remindAsks($).catch(function (err) { return log($, "questions not reminded of: ".concat(String(err))); })];
                                case 8:
                                    _k.sent();
                                    _k.label = 9;
                                case 9:
                                    if (!(seconds % 2 === 0)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, lookForStarted($).catch(function (err) { return log($, "running commands not looked at: ".concat(String(err))); })];
                                case 10:
                                    _k.sent();
                                    _k.label = 11;
                                case 11:
                                    if (!((seconds += 1) % (LOOK_EVERY / 1000) === 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, readAnswers($).catch(function (err) { return log($, "answers from other chats not read: ".concat(String(err))); })];
                                case 12:
                                    _k.sent();
                                    if (!!isBehind()) return [3 /*break*/, 14];
                                    return [4 /*yield*/, readOthers($).catch(function (err) { return log($, "other chats not read: ".concat(String(err))); })];
                                case 13:
                                    _k.sent();
                                    _k.label = 14;
                                case 14: return [4 /*yield*/, read($, flows)];
                                case 15:
                                    isFlowing = (_k.sent()).some(function (f) { return f.status === 'working'; });
                                    return [4 /*yield*/, $.clock.now()
                                        // (a command run on the person's press too, whose running time its card shows after its task has ended)
                                    ];
                                case 16:
                                    calmNow = _k.sent();
                                    _c = isFlowing || runList.some(function (run) { return Boolean(run.startedAt && !run.endedAt); });
                                    if (_c) return [3 /*break*/, 18];
                                    return [4 /*yield*/, read($, todos)];
                                case 17:
                                    _c = (_k.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                                    _k.label = 18;
                                case 18:
                                    _b = _c;
                                    if (_b) return [3 /*break*/, 20];
                                    return [4 /*yield*/, read($, others)];
                                case 19:
                                    _b = (_k.sent()).some(function (c) { return c.cards.some(function (card) { return card.status === 'working'; }); });
                                    _k.label = 20;
                                case 20:
                                    isMoving = _b;
                                    // A drawing of a size or tab no longer drawn is let go after a minute: it would only be drawn afresh
                                    if (!isTyping)
                                        for (_i = 0, heldDrawings_1 = heldDrawings; _i < heldDrawings_1.length; _i++) {
                                            _d = heldDrawings_1[_i], key = _d[0], held_1 = _d[1];
                                            if (calmNow - held_1.at >= 60000)
                                                heldDrawings.delete(key);
                                        }
                                    if (!!isBehind()) return [3 /*break*/, 22];
                                    return [4 /*yield*/, calmLook($, isMoving).catch(function (err) { return log($, "panes not looked at: ".concat(String(err))); })
                                        // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
                                    ];
                                case 21:
                                    _k.sent();
                                    _k.label = 22;
                                case 22:
                                    _e = !isBehind();
                                    if (!_e) return [3 /*break*/, 24];
                                    return [4 /*yield*/, read($, todos)];
                                case 23:
                                    _e = (_k.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                                    _k.label = 24;
                                case 24:
                                    // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
                                    if (_e)
                                        void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                                    return [4 /*yield*/, $.clock.now()];
                                case 25:
                                    now = _k.sent();
                                    _loop_1 = function (one) {
                                        var key = "".concat(one.id, ":").concat(one.endedAt);
                                        if (lingerSet.has(key))
                                            return "continue";
                                        lingerSet.add(key);
                                        $.clock.after(pauseFrom(one) + LINGER - now + 20, function () { return void ((lingerSet.delete(key), drawAgain($), update($, tick, function (n) { return n + 1; }))); });
                                    };
                                    _f = 0;
                                    _h = [[]];
                                    return [4 /*yield*/, read($, flows)];
                                case 26:
                                    _j = [__spreadArray.apply(void 0, _h.concat([(_k.sent()), true]))];
                                    return [4 /*yield*/, read($, todos)];
                                case 27:
                                    _g = __spreadArray.apply(void 0, _j.concat([(_k.sent()), true])).filter(function (card) { return isLingering(card, now); });
                                    _k.label = 28;
                                case 28:
                                    if (!(_f < _g.length)) return [3 /*break*/, 30];
                                    one = _g[_f];
                                    _loop_1(one);
                                    _k.label = 29;
                                case 29:
                                    _f++;
                                    return [3 /*break*/, 28];
                                case 30: return [2 /*return*/];
                            }
                        });
                    }); });
                    everyLoad($, TICK, function () { return refresh($).catch(function (err) { return log($, "servers not looked at again: ".concat(String(err))); }); });
                    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
                    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
                    sharedSign = '';
                    isEnded = false;
                    linkReadAt = 0;
                    // A load starts with no prompt open: one a reload cut off has no call left to end it
                    waiting = [];
                    asked = [];
                    return [4 /*yield*/, unshare($, true).catch(function () { return undefined; })];
                case 65:
                    _w.sent();
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return fetchMacs($).catch(function (err) { return log($, "other Macs not fetched: ".concat(String(err))); }); });
                    _o = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 66:
                    isRunFromAfar = _o.apply(void 0, [_w.sent()]);
                    if (!isRunFromAfar) return [3 /*break*/, 68];
                    return [4 /*yield*/, startKeeper($, id).catch(function (err) { return log($, "keeper not started: ".concat(String(err))); })
                        // and every chat a watcher that brings Claudopus back should Claude switch it off
                    ];
                case 67:
                    _w.sent();
                    _w.label = 68;
                case 68: 
                // and every chat a watcher that brings Claudopus back should Claude switch it off
                return [4 /*yield*/, startReviver($, id).catch(function (err) { return log($, "the watcher that brings Claudopus back was not started: ".concat(String(err))); })];
                case 69:
                    // and every chat a watcher that brings Claudopus back should Claude switch it off
                    _w.sent();
                    if (macs.length)
                        everyLoad($, OPEN_EVERY, function () { return takeOpens($).catch(function (err) { return log($, "presses on other Macs not taken: ".concat(String(err))); }); });
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return syncResults($).catch(function (err) { return log($, "results not made the same: ".concat(String(err))); }); });
                    // What no chat on this Mac saved itself, caught up into memory a minute after the load and then every while
                    afterLoad($, CATCH_UP_AFTER, function () { return startCatchUp($).catch(function (err) { return log($, "chats not caught up: ".concat(String(err))); }); });
                    everyLoad($, CATCH_UP_EVERY, function () { return startCatchUp($).catch(function (err) { return log($, "chats not caught up: ".concat(String(err))); }); });
                    return [4 /*yield*/, shareMine($).catch(function () { return undefined; })];
                case 70:
                    _w.sent();
                    return [4 /*yield*/, readAnswers($).catch(function () { return undefined; })];
                case 71:
                    _w.sent();
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })
                        // The workflows kept, read back, and followed while they run
                    ];
                case 72:
                    _w.sent();
                    // The workflows kept, read back, and followed while they run
                    return [4 /*yield*/, knowSession($)];
                case 73:
                    // The workflows kept, read back, and followed while they run
                    _w.sent();
                    during('load: read back workflows');
                    return [4 /*yield*/, loadFlows($).catch(function (err) { return log($, "workflows not read back: ".concat(String(err))); })];
                case 74:
                    _w.sent();
                    everyLoad($, FLOW_EVERY, function () { return followFlows($).catch(function (err) { return log($, "workflows not followed: ".concat(String(err))); }); });
                    // Every hour one chat looks at the version page, and only looks: an update is installed, and a chat reloaded to it, only by a press
                    afterLoad($, UPDATE_AFTER, function () { return void lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    everyLoad($, UPDATE_LOOK, function () { return lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    if (!isRunFromAfar) return [3 /*break*/, 76];
                    return [4 /*yield*/, holdOldCopies($).catch(function () { return undefined; })];
                case 75:
                    _w.sent();
                    everyLoad($, HOLD_EVERY, function () { return holdOldCopies($).catch(function (err) { return log($, "old copies not held: ".concat(String(err))); }); });
                    _w.label = 76;
                case 76: return [4 /*yield*/, tidyLog($)];
                case 77:
                    _w.sent();
                    return [4 /*yield*/, log($, "start ".concat(id, " in ").concat(e.cwd).concat(isOff ? ' (handing over is off)' : ''))
                        // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    ];
                case 78:
                    _w.sent();
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    return [4 /*yield*/, takeCharge($)
                        // A move to a newer version has its moment begin now that the load has started whole
                    ];
                case 79:
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    _w.sent();
                    // A move to a newer version has its moment begin now that the load has started whole
                    return [4 /*yield*/, readyUpdated($).catch(function () { return undefined; })];
                case 80:
                    // A move to a newer version has its moment begin now that the load has started whole
                    _w.sent();
                    return [2 /*return*/, begun];
            }
        });
    }); });
    // The setting that brings Claudopus back is its own: never shown in /config
    on('config.describe', function ($, e, next) { return next(e.key === REVIVED_KEY ? __assign(__assign({}, e), { isHidden: true }) : e); });
    // A chat that ends removes its file, so the other panels drop its work at once
    on('session.end', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    isEnded = true;
                    _a = endBeat;
                    _b = [$];
                    return [4 /*yield*/, read($, me)];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.sent()).id])).catch(function () { return undefined; })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, unshare($).catch(function () { return undefined; })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('prompt.submit', function ($, given, next) { return __awaiter(_this, void 0, void 0, function () {
        var e, waitingWork_1, ids_1, reports_1, quiet, _a, _b, _c, waits, held_3, told, _i, held_2, one, ended_1, _d, _e, one, isPressed, isPerson, from, _f, _g, context, _h, stillHeld, board, text, m, role, _j, _k, roleSent_1, subjects, sizes, told, _l, _m, stamp, path, _o, _p, _q, how;
        var _r, _s, _t, _u, _v, _w, _x, _y;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    e = given;
                    return [4 /*yield*/, holdTest($)
                        // The texts a message is answered with are the ones known: a change made since is put back first
                    ];
                case 1:
                    _z.sent();
                    if (!dir) return [3 /*break*/, 3];
                    return [4 /*yield*/, personCheck($).catch(function (err) { return log($, "files not compared as a message came: ".concat(String(err))); })];
                case 2:
                    _z.sent();
                    _z.label = 3;
                case 3:
                    if (!wakes.length) return [3 /*break*/, 5];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })
                        // The notice that a workflow ended ends its card
                    ];
                case 4:
                    _z.sent();
                    _z.label = 5;
                case 5:
                    if (!(dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 7];
                    return [4 /*yield*/, flowEnded($, e.text).catch(function (err) { return log($, "workflow end not read: ".concat(String(err))); })
                        // The engine's notice that work the person stopped has ended says it was stopped "by Claude": the chat is told it was them
                    ];
                case 6:
                    _z.sent();
                    _z.label = 7;
                case 7:
                    if (!(dir && !isOff && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 15];
                    return [4 /*yield*/, waitingNow($)];
                case 8:
                    waitingWork_1 = _z.sent();
                    ids_1 = __spreadArray([], e.text.matchAll(/<task-id>([^<]+)<\/task-id>/g), true).map(function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ''; });
                    return [4 /*yield*/, reportsFor($, ids_1)];
                case 9:
                    reports_1 = _z.sent();
                    if (reports_1.length)
                        e = __assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_r = e.context) !== null && _r !== void 0 ? _r : []), true), reports_1, true) });
                    _a = quietNotices;
                    _b = [e.text, new Set(waitingWork_1.keys())];
                    _c = Set.bind;
                    return [4 /*yield*/, read($, todos)];
                case 10:
                    quiet = _a.apply(void 0, _b.concat([new (_c.apply(Set, [void 0, (_z.sent()).filter(function (one) { return one.reportGiven && !reports_1.length; }).map(function (one) { return one.id; })]))()]));
                    waits = quiet.waits.map(function (id) { return waitsText(waitingWork_1.get(id)); });
                    return [4 /*yield*/, read($, todos)];
                case 11:
                    held_3 = (_z.sent()).filter(function (one) { return !one.parentId && isHeld(one) && ids_1.includes(one.id); });
                    if (held_3.length) {
                        told = held_3.map(function (one) { var _a; return named(STOPPED_BY_YOU(titleOf(one), one.id, (_a = stopLeft.get(one.id)) !== null && _a !== void 0 ? _a : [])); });
                        for (_i = 0, held_2 = held_3; _i < held_2.length; _i++) {
                            one = held_2[_i];
                            stopLeft.delete(one.id);
                        }
                        return [2 /*return*/, next(__assign(__assign({}, e), { context: __spreadArray(__spreadArray(__spreadArray([], ((_s = e.context) !== null && _s !== void 0 ? _s : []), true), told, true), waits, true) }))];
                    }
                    return [4 /*yield*/, chatCommandEnded($, e.text).catch(function () { return []; })];
                case 12:
                    ended_1 = _z.sent();
                    if (ended_1.length)
                        return [2 /*return*/, next(__assign(__assign({}, e), { context: __spreadArray(__spreadArray(__spreadArray([], ((_t = e.context) !== null && _t !== void 0 ? _t : []), true), ended_1, true), waits, true) }))
                            // Notices with nothing new (a report already given, a task still at work) cost the chat no turn of the model's: a turn made of
                            // nothing else is answered with no model (turn.start below, workHooks' turn.step), and one that comes while the chat is at
                            // work goes into that turn, or makes such a turn should that turn end first. None is dropped, which Claude Code shows as a
                            // warning card. The word that a task still waits goes with it, so the chat, reading it later, does not take the task for ended
                        ];
                    if (!(quiet.isQuiet && !reports_1.length)) return [3 /*break*/, 14];
                    for (_d = 0, _e = noticesOf(e.text); _d < _e.length; _d++) {
                        one = _e[_d];
                        quietHeld.add(one);
                    }
                    return [4 /*yield*/, log($, quiet.isRepeat ? 'let in the notice that repeats a report already given, with no turn of the model\'s' : 'let in notices with nothing new, with no turn of the model\'s: tasks still at work')];
                case 13:
                    _z.sent();
                    return [2 /*return*/, next(waits.length ? __assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_u = e.context) !== null && _u !== void 0 ? _u : []), true), waits, true) }) : e)];
                case 14:
                    if (waits.length)
                        return [2 /*return*/, next(__assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_v = e.context) !== null && _v !== void 0 ? _v : []), true), waits, true) }))];
                    _z.label = 15;
                case 15: return [4 /*yield*/, isQuietHandback($, e.origin, e.text).catch(function (err) { return (void log($, "hand-back not looked at: ".concat(String(err))), false); })];
                case 16:
                    if (!_z.sent()) return [3 /*break*/, 18];
                    quietHeld.add(e.text);
                    return [4 /*yield*/, log($, 'let in a helper\'s result that Claudopus passes on to its task, with no turn of the model\'s')];
                case 17:
                    _z.sent();
                    return [2 /*return*/, next(e)];
                case 18:
                    if (e.isMeta || e.command || !dir)
                        return [2 /*return*/, next(e)
                            // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
                        ];
                    isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text);
                    isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed;
                    if (!!isPerson) return [3 /*break*/, 22];
                    from = programFrom(e.origin);
                    if (!from) return [3 /*break*/, 21];
                    _f = appendWords;
                    _g = [$];
                    return [4 /*yield*/, read($, me)];
                case 19: return [4 /*yield*/, _f.apply(void 0, _g.concat([(_z.sent()).id, "## ".concat(new Date().toISOString(), " (").concat(from, ")\n").concat(e.text, "\n\n")])).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 20:
                    _z.sent();
                    _z.label = 21;
                case 21: return [2 /*return*/, next(e)];
                case 22:
                    _h = [__spreadArray([], ((_w = e.context) !== null && _w !== void 0 ? _w : []), true)];
                    return [4 /*yield*/, reportsFor($)];
                case 23:
                    context = __spreadArray.apply(void 0, _h.concat([(_z.sent()), true]));
                    return [4 /*yield*/, read($, todos)];
                case 24:
                    stillHeld = (_z.sent()).filter(function (one) { return isHeld(one) && !one.parentId; });
                    return [4 /*yield*/, read($, todos)];
                case 25:
                    if (!(_z.sent()).some(isHeld)) return [3 /*break*/, 27];
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (isHeld(one) && one.byYou ? __assign(__assign({}, one), { byYou: __assign(__assign({}, one.byYou), { isLifted: true }) }) : one); }); })];
                case 26:
                    _z.sent();
                    if (stillHeld.length)
                        context.push(named(STOPPED_EARLIER(stillHeld.map(function (one) { return "\"".concat(titleOf(one), "\" (").concat(one.id, ")"); }))));
                    _z.label = 27;
                case 27:
                    if (!!isOff) return [3 /*break*/, 29];
                    return [4 /*yield*/, cardsNow($).catch(function (err) { return (void log($, "cards not told to the chat: ".concat(String(err))), ''); })];
                case 28:
                    board = _z.sent();
                    if (board)
                        context.push(named(board));
                    _z.label = 29;
                case 29:
                    text = e.text;
                    return [4 /*yield*/, read($, me)];
                case 30:
                    m = _z.sent();
                    if (!!isOff) return [3 /*break*/, 39];
                    _j = named;
                    _k = fillModels;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/chat.md')];
                case 31:
                    role = _j.apply(void 0, [_k.apply(void 0, [(_z.sent()).text, models, lean])]);
                    roleSent_1 = mark(role);
                    if (!(!m.isChat || m.needsContext || roleSent_1 !== m.roleSent)) return [3 /*break*/, 33];
                    return [4 /*yield*/, readIndex($)];
                case 32:
                    subjects = (_z.sent()).map(function (s) { return "- ".concat([s.name, s.repo, s.session, s.state, s.summary, "streams/".concat(slug(s.name), ".md")].join(' | ')); }).join('\n');
                    context.push("".concat(role, "\nThis chat's saved words: ").concat(dir, "/words/").concat(m.id, ".md\nTopics so far (name | folder | session | state | summary | its notes, under ").concat(dir, "):\n").concat(subjects || '(none yet)'));
                    _z.label = 33;
                case 33: return [4 /*yield*/, read($, todos)];
                case 34:
                    sizes = (_z.sent())
                        .filter(function (one) { return !one.parentId && one.tokens > 0; })
                        .slice(-8)
                        .map(function (one) { return "".concat(one.title || 'task', " (").concat(one.id, ") ").concat(one.isFork && m.window ? "".concat(Math.round((one.tokens / m.window) * 100), "%") : thousands(one.tokens)); });
                    _l = reportsTold;
                    return [4 /*yield*/, read($, reports)];
                case 35:
                    _m = [_z.sent()];
                    return [4 /*yield*/, $.clock.now()];
                case 36:
                    told = _l.apply(void 0, _m.concat([_z.sent()]));
                    context.push("".concat(briefNow()).concat(sizes.length ? "\nHow full each task's context is: ".concat(sizes.join('; '), ".") : '').concat(told ? "\n".concat(told) : ''));
                    return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isChat: true, needsContext: false, roleSent: roleSent_1 })); })];
                case 37:
                    _z.sent();
                    if (!(text.length > PASTE_CHARS)) return [3 /*break*/, 39];
                    stamp = new Date().toISOString().replaceAll(':', '-');
                    path = "".concat(dir, "/pastes/").concat(stamp, ".md");
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/pastes/").concat(stamp, ".md"), hideKeys(text))];
                case 38:
                    _z.sent();
                    text = "".concat(text.slice(0, 600), "\n\n[").concat(text.length - 1200, " characters pasted here were saved to ").concat(path, " and left out of this chat]\n\n").concat(text.slice(-600));
                    context.push(pastedNow());
                    _z.label = 39;
                case 39:
                    said = text;
                    heard = __spreadArray(__spreadArray([], heard, true), [text], false);
                    return [4 /*yield*/, read($, reports)];
                case 40:
                    // A message that names a report starts work from it: that work's own report is kept linked to it
                    fromReport = (_y = (_x = (_z.sent()).find(function (r) { return text.includes("".concat(reportPath(r), "/")) || text.includes("reports/".concat(r.id)); })) === null || _x === void 0 ? void 0 : _x.id) !== null && _y !== void 0 ? _y : '';
                    _p = 
                    // One that names a result and quotes what in it waits answers that, as "Answer in words" on the result starts it
                    // (and goes to the task that asked, which carries on with it: the chat is told so with the message)
                    (_o = context.push).apply;
                    _q = [
                        // One that names a result and quotes what in it waits answers that, as "Answer in words" on the result starts it
                        // (and goes to the task that asked, which carries on with it: the chat is told so with the message)
                        context];
                    return [4 /*yield*/, answeredInMessage($, text).catch(function (err) { return (void log($, "results answered in words not marked: ".concat(String(err))), []); })];
                case 41:
                    // One that names a result and quotes what in it waits answers that, as "Answer in words" on the result starts it
                    // (and goes to the task that asked, which carries on with it: the chat is told so with the message)
                    _p.apply(_o, _q.concat([(_z.sent())]));
                    how = "".concat(e.turnId ? ' (sent while Claude was working)' : '').concat(e.origin.kind === 'bridge' ? ' (from the phone)' : '').concat(isPressed ? ' (pressed or replied in the panel)' : '');
                    return [4 /*yield*/, appendWords($, m.id, "## ".concat(new Date().toISOString()).concat(how, "\n").concat(text, "\n\n")).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 42:
                    _z.sent();
                    return [2 /*return*/, next(context.length ? __assign(__assign({}, e), { text: text, context: context }) : __assign(__assign({}, e), { text: text }))];
            }
        });
    }); });
    // A turn of the chat's made only of quiet notices (above) is known as it starts; its first step is answered with Claude Code's own
    // line for a turn with nothing to say (workHooks' turn.step, the module's one), so no model is asked. A turn that brings anything
    // more, the person's words or a notice with news, is the model's
    on('turn.start', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var started;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    started = _a.sent();
                    if (e.agentId === undefined && quietHeld.size) {
                        if (isQuietTurn(e.text, quietHeld))
                            quietTurns.add(e.turnId);
                        quietHeld.clear();
                    }
                    return [2 /*return*/, started];
            }
        });
    }); });
    on('turn.complete', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var done, id, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)
                    // An answer waiting to start ended work again goes from inside this hook, at the end of any turn, the chat's own too (sendWakes)
                ];
                case 1:
                    done = _a.sent();
                    if (!(wakes.length && e.agentId === undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!dir)
                        return [2 /*return*/, done
                            // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                            // One that only waits for its helpers goes on working
                            // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                        ];
                    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                    // One that only waits for its helpers goes on working
                    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                    return [4 /*yield*/, lapsedSignIn($, e).catch(function (err) { return log($, "lapsed sign-in not handed over: ".concat(String(err))); })];
                case 4:
                    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                    // One that only waits for its helpers goes on working
                    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                    _a.sent();
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 8];
                    id = e.agentId;
                    turnEnding.add(id);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, , 7, 8]);
                    return [4 /*yield*/, agentTurnEnded($, e, id, done)];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    turnEnding.delete(id);
                    return [7 /*endfinally*/];
                case 8:
                    // A turn answered with no model is no reply: nothing is saved or logged for it
                    if (quietTurns.delete(e.turnId))
                        return [2 /*return*/, done];
                    text = said;
                    said = '';
                    heard = [];
                    // Off the turn's clock, so the reply is never held up
                    $.clock.after(5, function () { var _a; return void afterReply($, text, (_a = e.answer) !== null && _a !== void 0 ? _a : '').catch(function (err) { return log($, "pass after reply failed: ".concat(String(err))); }); });
                    return [2 /*return*/, done];
            }
        });
    }); });
    // A compaction keeps what the person asked for, and the role text goes out again after it
    on('session.compact', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var isChat, r, agent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read($, me)];
                case 1:
                    isChat = (_a.sent()).isChat && !isOff;
                    return [4 /*yield*/, next(__assign(__assign({}, e), { instructions: [e.instructions, KEEP, isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') }))];
                case 2:
                    r = _a.sent();
                    if (!(e.agentId === undefined && e.trigger !== 'precompute')) return [3 /*break*/, 4];
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { needsContext: true })); })
                        // A piece of work compacted loses the rules it was handed after its brief: it is handed them again at its next step
                    ];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    agent = e.agentId;
                    if (!(agent !== undefined && e.trigger !== 'precompute' && dir)) return [3 /*break*/, 6];
                    return [4 /*yield*/, changeTodos($, function (list) { return (list.some(function (one) { return one.id === agent && !one.parentId; }) ? list.map(function (one) { return (one.id === agent ? __assign(__assign({}, one), { rulesDue: true }) : one); }) : list); })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, r];
            }
        });
    }); });
    // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
    // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
    // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there
    on('prompt.context', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, files, _a, path, content, others, at, isAfar, _b, ours;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _d.sent();
                    files = (_c = r.instructionFiles) !== null && _c !== void 0 ? _c : e.instructionFiles;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')];
                case 2:
                    _a = _d.sent(), path = _a.path, content = _a.text;
                    if (!files || !content.trim())
                        return [2 /*return*/, r
                            // Another copy of the mod loaded beside this one sends the same principles, with the rule for afar after them or not
                        ];
                    others = files.filter(function (one) { return !one.content.trim().startsWith(content.trim()); });
                    at = others.findIndex(function (one) { return one.kind !== 'managed'; });
                    _b = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 3:
                    isAfar = _b.apply(void 0, [_d.sent()]);
                    ours = { path: path, kind: 'user', content: isAfar ? "".concat(content.trimEnd(), "\n\n").concat(named(AFAR_RULE), "\n") : content };
                    return [2 /*return*/, __assign(__assign({}, r), { instructionFiles: at < 0 ? __spreadArray(__spreadArray([], others, true), [ours], false) : __spreadArray(__spreadArray(__spreadArray([], others.slice(0, at), true), [ours], false), others.slice(at), true) })];
            }
        });
    }); });
    on('tool.describe', function (_, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, isRare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _a.sent();
                    isRare = RARE_TOOLS.includes(e.tool) || RARE_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); });
                    return [2 /*return*/, isRare ? __assign(__assign({}, r), { isDeferred: true }) : r];
            }
        });
    }); });
};
