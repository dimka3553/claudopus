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
// As a turn ends the engine may still list its run as running for a moment: it is looked at again this long after
var HELD_LOOK = 1500;
// The notices with nothing new let in since the chat's last turn started, each whole; the turns to answer with no model
var quietHeld = new Set();
var quietTurns = new Set();
// A turn of a task or helper ends (chatHooks' turn.complete). A turn that ends is a pause, not the end: a task ends only by
// handing in its result, which made its card done as the hand-back went through (workHooks' tool.call). Stopped, its card is
// stopped; ended by an error, it failed and says so. Any other stays at work: Claude Code starts its next step when a command or
// a helper of its own ends, or when the person's answer or words reach it. A run that is over with nothing of its own running and
// nothing waiting for the person is ended by lookOver
var agentTurnEnded = function ($, e, id, done) { return __awaiter(_this, void 0, void 0, function () {
    var now, said, answer, isHanded, how, look, _a;
    var _this = this;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()
                // A turn that handed in its result and says nothing after has that result as its answer; the line Claude Code's press was
                // answered with is no answer of its own (its card keeps what it said before)
            ];
            case 1:
                now = _e.sent();
                said = ((_b = e.answer) !== null && _b !== void 0 ? _b : '').trim();
                answer = ((said === PRESS_ANSWER ? '' : said) || handedBack.get(id) || '').slice(0, ANSWER_CHARS);
                isHanded = handedBack.delete(id);
                how = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done';
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) {
                            // (a task whose result went through is done already, and one ended meanwhile stays as it ended)
                            if (one.id !== id || one.status !== 'working')
                                return one;
                            // (stopped for a message the person sent with Stop and send, which starts it again: it stays at work)
                            if (how === 'stopped' && interrupting.has(id))
                                return one;
                            if (how === 'stopped')
                                return ended(one, stoppedAs(one), now);
                            if (how === 'failed')
                                return __assign(__assign({}, ended(one, 'failed', now)), { answer: answer || one.answer, why: WHY_ERROR });
                            // A helper's hand-back ends it: its result went to its task
                            if (isHanded && one.parentId)
                                return __assign(__assign({}, ended(one, 'done', now)), { answer: answer || one.answer });
                            return answer ? __assign(__assign({}, one), { answer: answer }) : one;
                        });
                    })
                    // Its run may be over: with nothing of its own running and nothing waiting for the person, it is (lookOver), now or once the
                    // engine no longer lists it as running
                ];
            case 2:
                _e.sent();
                look = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = lookOver;
                            _b = [$];
                            return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                        case 1:
                            _b = _b.concat([_c.sent()]);
                            return [4 /*yield*/, $.clock.now()];
                        case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), id]))];
                    }
                }); }); };
                if (!(how === 'done')) return [3 /*break*/, 4];
                return [4 /*yield*/, look().catch(function (err) { return log($, "work ".concat(id, " not looked at as its turn ended: ").concat(String(err))); })];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                _a = how === 'done';
                if (!_a) return [3 /*break*/, 6];
                return [4 /*yield*/, read($, todos)];
            case 5:
                _a = ((_c = (_e.sent()).find(function (one) { return one.id === id; })) === null || _c === void 0 ? void 0 : _c.status) === 'working';
                _e.label = 6;
            case 6:
                if (_a)
                    $.clock.after(HELD_LOOK, function () { return void look().catch(function (err) { return log($, "work ".concat(id, " not looked at again: ").concat(String(err))); }); });
                return [4 /*yield*/, lookEnds($)
                    // A reply it never read goes to the chat; work still at work reads it at its next step
                ];
            case 7:
                _e.sent();
                return [4 /*yield*/, read($, todos)];
            case 8:
                if (!(((_d = (_e.sent()).find(function (one) { return one.id === id; })) === null || _d === void 0 ? void 0 : _d.status) !== 'working')) return [3 /*break*/, 10];
                return [4 /*yield*/, replyUnread($, id).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10:
                if (!wakes.length) return [3 /*break*/, 12];
                return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept: ".concat(String(err))); })];
            case 13:
                _e.sent();
                return [2 /*return*/, done];
        }
    });
}); };
// The tasks and helpers whose turn's end is being taken up now: the list's look leaves them to it
var turnEnding = new Set();
var RULES_KEPT_FOR = 30 * 24 * 3600000;
var RULES_CHAT = /^[A-Za-z0-9_-]{1,80}$/;
var rulesDir = function () { return "".concat(dir, "/live/rules"); };
var rulesKept;
var rulesKeeping = Promise.resolve();
var keptRule = function ($, key, make) {
    // One at a time, so two requests of a chat never keep two texts
    var run = rulesKeeping.then(function () { return __awaiter(_this, void 0, void 0, function () {
        var id, text, kept, value, held, made;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, $.session.id()];
                case 1:
                    id = _b.sent();
                    if (!dir || !RULES_CHAT.test(id))
                        return [2 /*return*/, make()];
                    if (!((rulesKept === null || rulesKept === void 0 ? void 0 : rulesKept.id) !== id)) return [3 /*break*/, 3];
                    return [4 /*yield*/, readOr($, "".concat(rulesDir(), "/").concat(id, ".json"))];
                case 2:
                    text = _b.sent();
                    kept = {};
                    try {
                        value = JSON.parse(text || '{}');
                        if (value && typeof value === 'object' && !Array.isArray(value))
                            kept = value;
                    }
                    catch (_c) {
                        // A file that does not parse keeps nothing: the texts are made again, once
                    }
                    rulesKept = { id: id, kept: kept };
                    _b.label = 3;
                case 3:
                    held = rulesKept.kept[key];
                    if (held !== undefined)
                        return [2 /*return*/, held];
                    return [4 /*yield*/, make()];
                case 4:
                    made = _b.sent();
                    rulesKept = { id: id, kept: __assign(__assign({}, rulesKept.kept), (_a = {}, _a[key] = made, _a)) };
                    return [4 /*yield*/, $.fs.write("".concat(rulesDir(), "/").concat(id, ".json"), JSON.stringify(rulesKept.kept))];
                case 5:
                    _b.sent();
                    return [2 /*return*/, made];
            }
        });
    }); });
    rulesKeeping = run.catch(function () { return undefined; });
    return run;
};
// As a chat loads: its own kept rules count as used now, and those of chats not opened for a month go
var tidyKeptRules = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var now, _i, _a, entry, path, text;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _b.sent();
                _i = 0;
                return [4 /*yield*/, $.fs.list(rulesDir()).catch(function () { return []; })];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                entry = _a[_i];
                if (entry.kind !== 'file' || !entry.name.endsWith('.json'))
                    return [3 /*break*/, 8];
                path = "".concat(rulesDir(), "/").concat(entry.name);
                if (!(entry.name === "".concat(id, ".json"))) return [3 /*break*/, 6];
                return [4 /*yield*/, readOr($, path)];
            case 4:
                text = _b.sent();
                if (!text) return [3 /*break*/, 6];
                return [4 /*yield*/, $.fs.write(path, text)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                if (!(entry.name !== "".concat(id, ".json") && entry.mtimeMs && now - entry.mtimeMs > RULES_KEPT_FOR)) return [3 /*break*/, 8];
                return [4 /*yield*/, $.process.run(['rm', '-f', path]).catch(function () { return undefined; })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/];
        }
    });
}); };
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
                    return [4 /*yield*/, clearGates($).catch(function (err) { return log($, "admin holds not cleared: ".concat(String(err))); })
                        // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    ];
                case 17:
                    _w.sent();
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    return [4 /*yield*/, closeUndrawn($)];
                case 18:
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    _w.sent();
                    $.clock.after(3000, function () { return closeUndrawn($); });
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    return [4 /*yield*/, watchLoaded($).catch(function (err) { return log($, "tabs not watched: ".concat(String(err))); })
                        // The engine's id names this chat's files, as its transcript is named
                    ];
                case 19:
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    _w.sent();
                    return [4 /*yield*/, $.session.id()];
                case 20:
                    id = _w.sent();
                    heldChat = id;
                    return [4 /*yield*/, appTitle($)
                        // The first load of a session sends the role text; a reload keeps what stands
                    ];
                case 21:
                    title = _w.sent();
                    // The first load of a session sends the role text; a reload keeps what stands
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { id: id, title: title !== null && title !== void 0 ? title : m.title, needsContext: m.id === id ? m.needsContext : true })); })];
                case 22:
                    // The first load of a session sends the role text; a reload keeps what stands
                    _w.sent();
                    return [4 /*yield*/, tidyKeptRules($, id).catch(function (err) { return log($, "kept rules not tidied: ".concat(String(err))); })
                        // What was at work when this chat's process last ended is read before this load writes its own: it ended with that process
                    ];
                case 23:
                    _w.sent();
                    // What was at work when this chat's process last ended is read before this load writes its own: it ended with that process
                    return [4 /*yield*/, noteClosed($, id).catch(function (err) { return log($, "work the app closed on not looked for: ".concat(String(err))); })
                        // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                        // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    ];
                case 24:
                    // What was at work when this chat's process last ended is read before this load writes its own: it ended with that process
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
                                    questions: { type: 'array', items: { type: 'string' }, description: named('Only with your last note before you hand in, and only when your result leaves something open that {name} may want to decide on seeing it: each as one short plain question. Your delivered card lists them, and {name} answers them all in one reply, which starts you again. Never what holds you up: that is a question you ask before you finish') },
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
                            description: named("For background tasks: when a step needs {name}'s own hands or go-ahead now (a code to paste, a box to fill, a key or button to press, an approval), puts your question at the top of the panel on your card and in the chat as a notice; {Name} answers with one of the buttons you give in `choices`, or in their own words. {Name} sees it before your report, so it must carry everything needed to decide and never point at an explanation elsewhere. It stays until answered, even after you finish; the answer arrives as a message at your next step, or starts you again. Meanwhile continue with what does not depend on it, or end your step saying what you are waiting for. Ask again if the answer leaves something open; call it with empty `text` only once you have seen it done. Never open a terminal for a command yourself."),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
                                    details: { type: 'string', description: 'What it is about, in full: what changes, what it costs, what is not done. Short plain lines and "- " lists with a blank line after, no tables or bold: the card is narrow and the chat shows plain text' },
                                    copy: { type: 'string', description: 'Only text they must paste elsewhere, such as a one-time code or a link' },
                                    choices: { type: 'array', items: { type: 'string' }, description: 'The buttons to answer with, in your words for this question, such as Approve and Keep it: give them, as none are added. Every button is an answer that reaches you and carries you on: never Not now, Later, Skip or Cancel, which are left out, as {name} leaves a question open by not pressing. Answer in words is always there' },
                                    command: { type: 'string', description: 'A command only they can run, never one you can run yourself: one line, whole, shown with a Copy button' },
                                    cwd: { type: 'string', description: 'The full path of the folder the command runs in, when it has relative paths' },
                                    pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the pictures the question is about, shown with it on the card and in the chat' },
                                    release: { type: 'string', description: 'Only when you ask for the go-ahead to release, with the single choice Release it: the full path of your worktree. That press reaches you as the answer and allows your next run of the release runner from that folder, once, with no second question' },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 30:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'claudopus', description: "Open the Claudopus panel: this chat's tasks, questions and results" })];
                case 31:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'servers', description: 'Open the Servers panel: the servers running on this Mac, a link to each and the chat that started it' })];
                case 32:
                    _w.sent();
                    void $.ui.close({ id: OLD_PANE }).catch(function () { return undefined; });
                    return [4 /*yield*/, $.fs.exists("".concat(dir, "/index.md"))];
                case 33:
                    isNew = !(_w.sent());
                    if (!isNew) return [3 /*break*/, 35];
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/index.md"), INDEX_HEAD)];
                case 34:
                    _w.sent();
                    _w.label = 35;
                case 35: return [4 /*yield*/, settleWelcome($, isNew, id).catch(function (err) { return log($, "welcome not settled: ".concat(String(err))); })];
                case 36:
                    _w.sent();
                    return [4 /*yield*/, measure($).catch(function () { return undefined; })];
                case 37:
                    _w.sent();
                    during('load: read finished work');
                    return [4 /*yield*/, loadFinished($).catch(function (err) { return log($, "finished work not read: ".concat(String(err))); })];
                case 38:
                    _w.sent();
                    void recoverEnded($).catch(function (err) { return log($, "ended work not read back: ".concat(String(err))); });
                    during('load: sync the memory');
                    return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 39:
                    _w.sent();
                    during('load: read the results');
                    return [4 /*yield*/, loadReports($).catch(function () { return undefined; })
                        // What the person had typed into a reply box before a reload of the mod is in its box again
                    ];
                case 40:
                    _w.sent();
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    return [4 /*yield*/, readDrafts($).catch(function () { return undefined; })
                        // Work that is running when the chat loads brings the panel up, if it has never opened
                        // and comes back after a reload of the mod (which closes it) if it was open or work is running
                        // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
                    ];
                case 41:
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    _w.sent();
                    return [4 /*yield*/, read($, todos)];
                case 42:
                    isRunning = (_w.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                    panelSeen = '';
                    return [4 /*yield*/, followPanel($).catch(function () { return undefined; })];
                case 43:
                    choice = _w.sent();
                    if (!(!choice && (isRunning || isWelcomeOpen))) return [3 /*break*/, 45];
                    return [4 /*yield*/, openList($)];
                case 44:
                    _w.sent();
                    _w.label = 45;
                case 45:
                    _g = !choice;
                    if (!_g) return [3 /*break*/, 47];
                    return [4 /*yield*/, read($, paneShown)];
                case 46:
                    _g = ((_w.sent()) || isRunning);
                    _w.label = 47;
                case 47:
                    _f = _g;
                    if (!_f) return [3 /*break*/, 49];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 48:
                    _f = !(_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 49;
                case 49:
                    if (!_f) return [3 /*break*/, 51];
                    return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(function (err) { return log($, "panel not opened again: ".concat(String(err))); })
                        // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
                        // open in every chat from now on
                    ];
                case 50:
                    _w.sent();
                    _w.label = 51;
                case 51:
                    _h = !choice;
                    if (!_h) return [3 /*break*/, 53];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 52:
                    _h = (_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 53;
                case 53:
                    if (!_h) return [3 /*break*/, 55];
                    return [4 /*yield*/, choosePanel($, true)];
                case 54:
                    _w.sent();
                    _w.label = 55;
                case 55:
                    everyLoad($, PANEL_EVERY, function () { return followPanel($).catch(function (err) { return log($, "panel not followed: ".concat(String(err))); }); });
                    everyLoad($, FOLLOW_EVERY, function () { return follow($).catch(function (err) { return log($, "work not followed: ".concat(String(err))); }); });
                    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
                    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
                    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
                    lingerSet.clear();
                    return [4 /*yield*/, $.clock.now()
                        // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
                    ];
                case 56:
                    now = _w.sent();
                    return [4 /*yield*/, read($, lastDrawn)];
                case 57:
                    last = _w.sent();
                    lateFrom.clear();
                    _j = 0;
                    _l = [[]];
                    return [4 /*yield*/, read($, flows)];
                case 58:
                    _m = [__spreadArray.apply(void 0, _l.concat([(_w.sent()), true]))];
                    return [4 /*yield*/, read($, todos)];
                case 59:
                    _k = __spreadArray.apply(void 0, _m.concat([(_w.sent()).filter(function (card) { return !card.parentId; }), true]));
                    _w.label = 60;
                case 60:
                    if (!(_j < _k.length)) return [3 /*break*/, 62];
                    one = _k[_j];
                    if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE)
                        lateFrom.set("".concat(one.id, ":").concat(one.endedAt), Infinity);
                    _w.label = 61;
                case 61:
                    _j++;
                    return [3 /*break*/, 60];
                case 62:
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
                case 63:
                    _w.sent();
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return fetchMacs($).catch(function (err) { return log($, "other Macs not fetched: ".concat(String(err))); }); });
                    _o = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 64:
                    isRunFromAfar = _o.apply(void 0, [_w.sent()]);
                    // Every chat has a watcher that brings Claudopus back should Claude switch it off
                    return [4 /*yield*/, startReviver($, id).catch(function (err) { return log($, "the watcher that brings Claudopus back was not started: ".concat(String(err))); })];
                case 65:
                    // Every chat has a watcher that brings Claudopus back should Claude switch it off
                    _w.sent();
                    if (macs.length)
                        everyLoad($, OPEN_EVERY, function () { return takeOpens($).catch(function (err) { return log($, "presses on other Macs not taken: ".concat(String(err))); }); });
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return syncResults($).catch(function (err) { return log($, "results not made the same: ".concat(String(err))); }); });
                    // What no chat on this Mac saved itself, caught up into memory a minute after the load and then every while
                    afterLoad($, CATCH_UP_AFTER, function () { return startCatchUp($).catch(function (err) { return log($, "chats not caught up: ".concat(String(err))); }); });
                    everyLoad($, CATCH_UP_EVERY, function () { return startCatchUp($).catch(function (err) { return log($, "chats not caught up: ".concat(String(err))); }); });
                    return [4 /*yield*/, shareMine($).catch(function () { return undefined; })];
                case 66:
                    _w.sent();
                    return [4 /*yield*/, readAnswers($).catch(function () { return undefined; })];
                case 67:
                    _w.sent();
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })
                        // The workflows kept, read back, and followed while they run
                    ];
                case 68:
                    _w.sent();
                    // The workflows kept, read back, and followed while they run
                    return [4 /*yield*/, knowSession($)];
                case 69:
                    // The workflows kept, read back, and followed while they run
                    _w.sent();
                    during('load: read back workflows');
                    return [4 /*yield*/, loadFlows($).catch(function (err) { return log($, "workflows not read back: ".concat(String(err))); })];
                case 70:
                    _w.sent();
                    everyLoad($, FLOW_EVERY, function () { return followFlows($).catch(function (err) { return log($, "workflows not followed: ".concat(String(err))); }); });
                    // Every hour one chat looks at the version page, and only looks: an update is installed, and a chat reloaded to it, only by a press
                    afterLoad($, UPDATE_AFTER, function () { return void lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    everyLoad($, UPDATE_LOOK, function () { return lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    if (!isRunFromAfar) return [3 /*break*/, 72];
                    return [4 /*yield*/, holdOldCopies($).catch(function () { return undefined; })];
                case 71:
                    _w.sent();
                    everyLoad($, HOLD_EVERY, function () { return holdOldCopies($).catch(function (err) { return log($, "old copies not held: ".concat(String(err))); }); });
                    _w.label = 72;
                case 72: return [4 /*yield*/, tidyLog($)];
                case 73:
                    _w.sent();
                    return [4 /*yield*/, log($, "start ".concat(id, " in ").concat(e.cwd).concat(isOff ? ' (handing over is off)' : ''))
                        // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    ];
                case 74:
                    _w.sent();
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    return [4 /*yield*/, takeCharge($)
                        // A move to a newer version has its moment begin now that the load has started whole
                    ];
                case 75:
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    _w.sent();
                    // A move to a newer version has its moment begin now that the load has started whole
                    return [4 /*yield*/, readyUpdated($).catch(function () { return undefined; })];
                case 76:
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
        var e, ids_1, reports_1, cards, atWork, quiet, held_2, ended_1, _i, _a, one, isPressed, isPerson, from, _b, _c, context, _d, stillHeld, board, text, m, role, subjects, told, _e, _f, _g, _h, _j, stamp, path, how;
        var _this = this;
        var _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    e = given;
                    return [4 /*yield*/, holdTest($)
                        // The texts a message is answered with are the ones known: a change made since is put back first
                    ];
                case 1:
                    _r.sent();
                    if (!dir) return [3 /*break*/, 3];
                    return [4 /*yield*/, personCheck($).catch(function (err) { return log($, "files not compared as a message came: ".concat(String(err))); })
                        // The notice that a workflow ended ends its card
                    ];
                case 2:
                    _r.sent();
                    _r.label = 3;
                case 3:
                    if (!(dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 5];
                    return [4 /*yield*/, flowEnded($, e.text).catch(function (err) { return log($, "workflow end not read: ".concat(String(err))); })
                        // The engine's notice that work the person stopped has ended says it was stopped "by Claude": the chat is told it was them
                    ];
                case 4:
                    _r.sent();
                    _r.label = 5;
                case 5:
                    if (!(dir && !isOff && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 10];
                    ids_1 = __spreadArray([], e.text.matchAll(/<task-id>([^<]+)<\/task-id>/g), true).map(function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ''; });
                    return [4 /*yield*/, reportsFor($, ids_1)];
                case 6:
                    reports_1 = _r.sent();
                    if (reports_1.length)
                        e = __assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_k = e.context) !== null && _k !== void 0 ? _k : []), true), reports_1, true) });
                    return [4 /*yield*/, read($, todos)
                        // (nor is such a notice of a helper: its result goes to its task, taken at its hand-back, and is never the chat's)
                    ];
                case 7:
                    cards = _r.sent();
                    atWork = new Set(cards.filter(function (one) { return !one.chat && (one.parentId ? one.parentId !== HELPER || one.tookReport : one.status === 'working'); }).map(function (one) { return one.id; }));
                    quiet = quietNotices(e.text, atWork, new Set(cards.filter(function (one) { return one.reportGiven && !reports_1.length; }).map(function (one) { return one.id; })));
                    held_2 = cards.filter(function (one) { return !one.parentId && isHeld(one) && ids_1.includes(one.id); });
                    if (held_2.length)
                        return [2 /*return*/, next(__assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_l = e.context) !== null && _l !== void 0 ? _l : []), true), held_2.map(function (one) { return named(STOPPED_BY_YOU(titleOf(one), one.id)); }), true) }))
                            // The chat's own command ended: how it ended and its last lines go with the notice
                        ];
                    return [4 /*yield*/, chatCommandEnded($, e.text).catch(function () { return []; })];
                case 8:
                    ended_1 = _r.sent();
                    if (ended_1.length)
                        return [2 /*return*/, next(__assign(__assign({}, e), { context: __spreadArray(__spreadArray([], ((_m = e.context) !== null && _m !== void 0 ? _m : []), true), ended_1, true) }))
                            // Notices with nothing new (a report already given, a task that paused) cost the chat no turn of the model's: a turn made of
                            // nothing else is answered with no model (turn.start below, workHooks' turn.step), and one that comes while the chat is at
                            // work goes into that turn, or makes such a turn should that turn end first. None is dropped, which Claude Code shows as a
                            // warning card
                        ];
                    if (!(quiet.isQuiet && !reports_1.length)) return [3 /*break*/, 10];
                    for (_i = 0, _a = noticesOf(e.text); _i < _a.length; _i++) {
                        one = _a[_i];
                        quietHeld.add(one);
                    }
                    return [4 /*yield*/, log($, quiet.isRepeat ? 'let in the notice that repeats a report already given, with no turn of the model\'s' : 'let in notices with nothing new, with no turn of the model\'s: tasks that paused')];
                case 9:
                    _r.sent();
                    return [2 /*return*/, next(e)];
                case 10:
                    if (e.isMeta || e.command || !dir)
                        return [2 /*return*/, next(e)
                            // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
                        ];
                    isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text);
                    isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed;
                    if (!!isPerson) return [3 /*break*/, 14];
                    from = programFrom(e.origin);
                    if (!from) return [3 /*break*/, 13];
                    _b = appendWords;
                    _c = [$];
                    return [4 /*yield*/, read($, me)];
                case 11: return [4 /*yield*/, _b.apply(void 0, _c.concat([(_r.sent()).id, "## ".concat(new Date().toISOString(), " (").concat(from, ")\n").concat(e.text, "\n\n")])).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 12:
                    _r.sent();
                    _r.label = 13;
                case 13: return [2 /*return*/, next(e)];
                case 14:
                    _d = [__spreadArray([], ((_o = e.context) !== null && _o !== void 0 ? _o : []), true)];
                    return [4 /*yield*/, reportsFor($)];
                case 15:
                    context = __spreadArray.apply(void 0, _d.concat([(_r.sent()), true]));
                    return [4 /*yield*/, read($, todos)];
                case 16:
                    stillHeld = (_r.sent()).filter(function (one) { return isHeld(one) && !one.parentId; });
                    return [4 /*yield*/, read($, todos)];
                case 17:
                    if (!(_r.sent()).some(isHeld)) return [3 /*break*/, 19];
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (isHeld(one) && one.byYou ? __assign(__assign({}, one), { byYou: __assign(__assign({}, one.byYou), { isLifted: true }) }) : one); }); })];
                case 18:
                    _r.sent();
                    if (stillHeld.length)
                        context.push(named(STOPPED_EARLIER(stillHeld.map(function (one) { return "\"".concat(titleOf(one), "\" (").concat(one.id, ")"); }))));
                    _r.label = 19;
                case 19:
                    if (!!isOff) return [3 /*break*/, 21];
                    return [4 /*yield*/, cardsNow($).catch(function (err) { return (void log($, "cards not told to the chat: ".concat(String(err))), ''); })];
                case 20:
                    board = _r.sent();
                    if (board)
                        context.push(named(board));
                    _r.label = 21;
                case 21:
                    text = e.text;
                    return [4 /*yield*/, read($, me)];
                case 22:
                    m = _r.sent();
                    if (!!isOff) return [3 /*break*/, 31];
                    return [4 /*yield*/, keptRule($, 'role', function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = named;
                                    _b = fillModels;
                                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/chat.md')];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.apply(void 0, [(_c.sent()).text, models, lean])])];
                            }
                        }); }); })];
                case 23:
                    role = _r.sent();
                    if (!(!m.isChat || m.needsContext)) return [3 /*break*/, 25];
                    return [4 /*yield*/, readIndex($)];
                case 24:
                    subjects = (_r.sent()).map(function (s) { return "- ".concat([s.name, s.repo, s.session, s.state, s.summary, "streams/".concat(slug(s.name), ".md")].join(' | ')); }).join('\n');
                    context.push("".concat(role, "\nThis chat's saved words: ").concat(dir, "/words/").concat(m.id, ".md\nTopics so far (name | folder | session | state | summary | its notes, under ").concat(dir, "):\n").concat(subjects || '(none yet)'));
                    _r.label = 25;
                case 25:
                    _e = reportsTold;
                    return [4 /*yield*/, read($, reports)];
                case 26:
                    _f = [_r.sent()];
                    return [4 /*yield*/, $.clock.now()];
                case 27:
                    told = _e.apply(void 0, _f.concat([_r.sent()]));
                    _h = (_g = context).push;
                    _j = "".concat;
                    return [4 /*yield*/, keptRule($, 'each', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, BRIEF];
                        }); }); })];
                case 28:
                    _h.apply(_g, [_j.apply("", [_r.sent()]).concat(told ? "\n".concat(told) : '')]);
                    return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isChat: true, needsContext: false })); })];
                case 29:
                    _r.sent();
                    if (!(text.length > PASTE_CHARS)) return [3 /*break*/, 31];
                    stamp = new Date().toISOString().replaceAll(':', '-');
                    path = "".concat(dir, "/pastes/").concat(stamp, ".md");
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/pastes/").concat(stamp, ".md"), hideKeys(text))];
                case 30:
                    _r.sent();
                    text = "".concat(text.slice(0, 600), "\n\n[").concat(text.length - 1200, " characters pasted here were saved to ").concat(path, " and left out of this chat]\n\n").concat(text.slice(-600));
                    context.push(PASTED);
                    _r.label = 31;
                case 31:
                    said = text;
                    heard = __spreadArray(__spreadArray([], heard, true), [text], false);
                    return [4 /*yield*/, read($, reports)];
                case 32:
                    // A message that names a report starts work from it: that work's own report is kept linked to it
                    fromReport = (_q = (_p = (_r.sent()).find(function (r) { return text.includes("".concat(reportPath(r), "/")) || text.includes("reports/".concat(r.id)); })) === null || _p === void 0 ? void 0 : _p.id) !== null && _q !== void 0 ? _q : '';
                    how = "".concat(e.turnId ? ' (sent while Claude was working)' : '').concat(e.origin.kind === 'bridge' ? ' (from the phone)' : '').concat(isPressed ? ' (pressed or replied in the panel)' : '');
                    return [4 /*yield*/, appendWords($, m.id, "## ".concat(new Date().toISOString()).concat(how, "\n").concat(text, "\n\n")).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 33:
                    _r.sent();
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
                        return [2 /*return*/, done];
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 7];
                    id = e.agentId;
                    turnEnding.add(id);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, , 6, 7]);
                    return [4 /*yield*/, agentTurnEnded($, e, id, done)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    turnEnding.delete(id);
                    return [7 /*endfinally*/];
                case 7:
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
        var isChat, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read($, me)];
                case 1:
                    isChat = (_a.sent()).isChat && !isOff;
                    return [4 /*yield*/, next(__assign(__assign({}, e), { instructions: [e.instructions, KEEP, e.agentId !== undefined && dir && !isOff ? KEEP_RULES : '', isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') }))];
                case 2:
                    r = _a.sent();
                    if (!(e.agentId === undefined && e.trigger !== 'precompute')) return [3 /*break*/, 4];
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { needsContext: true })); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, r];
            }
        });
    }); });
    // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
    // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
    // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there. They are the ones the chat
    // started with (keptRule), for the chat and its tasks alike: this event does not say whose conversation it is
    on('prompt.context', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, files, _a, path, content, others, at, isAfar, _b, ours;
        var _this = this;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _d.sent();
                    files = (_c = r.instructionFiles) !== null && _c !== void 0 ? _c : e.instructionFiles;
                    return [4 /*yield*/, keptRule($, 'principles', function () { return __awaiter(_this, void 0, void 0, function () {
                            var now;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')];
                                    case 1:
                                        now = _a.sent();
                                        return [2 /*return*/, { path: now.path, content: now.text }];
                                }
                            });
                        }); })];
                case 2:
                    _a = _d.sent(), path = _a.path, content = _a.content;
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
