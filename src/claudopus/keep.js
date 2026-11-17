// Work that goes on when the chat's process ends: a keeper on this Mac for a chat the app runs from another Mac, the cards of
// work cut off marked so, that work started again by itself, and the person told on their own device
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
// ---- What the keeper reads, and the keeper itself ----
// Its files, one set per chat, under keep/: <chat>.json (the mod's: how many pieces of work are at work, and which),
// <chat>.state (the keeper's: when the process ended, when the chat went on here, when the app took it back), <chat>.log
var keepFile = function (id, kind) {
    if (kind === void 0) { kind = 'json'; }
    return "".concat(dir, "/keep/").concat(id, ".").concat(kind);
};
var keepSign = '';
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which cuts nothing off
var enginePid = '';
var pidOfEngine = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(function () { return undefined; })];
        case 1: return [2 /*return*/, ((_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.stdout) !== null && _b !== void 0 ? _b : '').trim()
            // Kept true as the cards change: the keeper reads it once the chat's process has ended, so it says what was at work then
        ];
    }
}); }); };
// Kept true as the cards change: the keeper reads it once the chat's process has ended, so it says what was at work then
var saveKeep = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, id, title, ids, sign, _b, _c, _d, _e, _f;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                _a = _h.sent(), id = _a.id, title = _a.title;
                if (!id || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 2:
                ids = (_h.sent()).filter(function (one) { return !one.parentId && !one.chat && (one.status === 'working' || lapsed.has(one.id)); }).map(function (one) { return one.id; });
                sign = "".concat(ids.join(','), "|").concat(title);
                if (sign === keepSign)
                    return [2 /*return*/];
                keepSign = sign;
                _c = (_b = $.fs).write;
                _d = [keepFile(id)];
                _f = (_e = JSON).stringify;
                _g = { count: ids.length, ids: ids, title: title, pid: enginePid };
                return [4 /*yield*/, $.clock.now()];
            case 3: return [4 /*yield*/, _c.apply(_b, _d.concat([_f.apply(_e, [(_g.at = _h.sent(), _g)])]))];
            case 4:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); };
// A chat this Mac runs for the app on another Mac lives only as long as the app lets it: the app ends its process when it
// chooses, and the process signs in with the app's sign-in, which lapses while the app is away. So each load starts a keeper,
// in a session of its own so it outlives the process: when the process ends with work at work and the app does not start it
// again within a minute, it starts the chat again here, under this Mac's own sign-in (bin/keep). Not in the copy it starts,
// which Claude Code's own background service keeps, nor in a chat this Mac's own terminal runs
var isKeptCopy = function ($) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, $.env.get('CLAUDE_CODE_SESSION_KIND')];
        case 1: return [2 /*return*/, (_a.sent()) === 'bg'];
    }
}); }); };
var startKeeper = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var _a, script, own, r;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = !dir || !/^[A-Za-z0-9-]{1,80}$/.test(id);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, isKeptCopy($)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                if (_a)
                    return [2 /*return*/];
                script = "nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' \"$1\" \"$PPID\" \"$2\" \"$3\" \"$4\" \"$5\" >/dev/null 2>&1 </dev/null &";
                own = $.plugin.root.includes('/.claude/plugins/cache/') ? '' : $.plugin.root;
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', script, 'sh', "".concat($.plugin.root, "/bin/keep"), id, cwd, dir, own]).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 3:
                r = _b.sent();
                return [4 /*yield*/, log($, r.exitCode === 0 ? "keeper started for ".concat(id) : "keeper not started: ".concat(r.stderr.slice(0, 200)))];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// With the app away its sign-in lapses, and the chat's process, still running, can no longer reach Claude: a turn ends with the
// API saying so. The keeper is asked to end the process then, which hands the chat to this Mac's own sign-in at once (bin/keep
// ends it on <chat>.handover); the work that failed so is counted as at work, to be started again there
// Only the API's own words for a lapsed sign-in, and only twice within a few minutes: one helper's refusal is no lapse
var SIGNIN_LAPSED = /API Error: 401\b[\s\S]{0,400}(authentication_error|OAuth token has expired|OAuth token revoked|invalid authentication credentials)/i;
var LAPSED_AGAIN = 10 * 60000;
var lapsed = new Set();
var lapsedAt = [];
var lapsedSignIn = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var _a, id, now;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = !isRunFromAfar || e.reason !== 'error' || !SIGNIN_LAPSED.test(e.answer);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, isKeptCopy($)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                if (_a)
                    return [2 /*return*/, false];
                return [4 /*yield*/, read($, me)];
            case 3:
                id = (_b.sent()).id;
                if (!id || !dir)
                    return [2 /*return*/, false];
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _b.sent();
                if (e.agentId)
                    lapsed.add(e.agentId);
                lapsedAt = __spreadArray(__spreadArray([], lapsedAt.filter(function (at) { return now - at < LAPSED_AGAIN; }), true), [now], false);
                if (lapsedAt.length < 2)
                    return [2 /*return*/, void log($, "a turn ended with a lapsed sign-in".concat(e.agentId ? " (work ".concat(e.agentId, ")") : '', "; handed over if another does"))];
                keepSign = '';
                return [4 /*yield*/, saveKeep($)
                    // The keeper acts only on an ask naming the process it watches
                ];
            case 5:
                _b.sent();
                // The keeper acts only on an ask naming the process it watches
                return [4 /*yield*/, $.fs.write(keepFile(id, 'handover'), enginePid)];
            case 6:
                // The keeper acts only on an ask naming the process it watches
                _b.sent();
                return [4 /*yield*/, log($, "the sign-in the app lent this chat lapsed".concat(e.agentId ? " (work ".concat(e.agentId, ")") : '', ": the keeper is asked to hand the chat to this Mac"))];
            case 7:
                _b.sent();
                return [2 /*return*/, true];
        }
    });
}); };
// ---- Work cut off: marked, started again, said ----
// How long after the chat starts its cut-off work is looked at: by then Claude Code has started again what it starts itself
var CUT_LOOK = 30000;
// Work cut off longer ago than this is not started again
var CUT_OLD = 24 * 3600000;
var parsedOr = function (text, or) {
    try {
        return text ? JSON.parse(text) : or;
    }
    catch (_a) {
        return or;
    }
};
var readCut = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var was, _a, state, _b, handled, _c, ids, cutAt;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = parsedOr;
                return [4 /*yield*/, readOr($, keepFile(id))];
            case 1:
                was = _a.apply(void 0, [_d.sent(), {}]);
                _b = parsedOr;
                return [4 /*yield*/, readOr($, keepFile(id, 'state'))];
            case 2:
                state = _b.apply(void 0, [_d.sent(), {}]);
                _c = parsedOr;
                return [4 /*yield*/, readOr($, keepFile(id, 'cut'))];
            case 3:
                handled = _c.apply(void 0, [_d.sent(), {}]);
                ids = Array.isArray(was.ids) ? was.ids.filter(function (one) { return typeof one === 'string' && /^[\w-]{1,80}$/.test(one); }) : [];
                cutAt = typeof state.backAt === 'number' ? state.backAt : typeof state.cutAt === 'number' ? state.cutAt : 0;
                return [2 /*return*/, { ids: ids, cutAt: cutAt, state: state, handled: handled }];
        }
    });
}); };
// Cut-off work not yet looked at again: Claude Code may be starting it again, so it is neither ended nor announced meanwhile
var cutPending = new Set();
var markCut = function ($, id, handled) { return $.fs.write(keepFile(id, 'cut'), JSON.stringify(handled)).catch(function (err) { return log($, "cut-off work not noted: ".concat(String(err))); }); };
// The words the work is started again with
var CUT_TELL = function (cutAt, here) {
    return "From Claudopus, not {name}: this chat's process was ended at ".concat(hhmm(cutAt), " while you were working, not by {name}, and the chat has started again").concat(here ? ' on this Mac by itself, under its own sign-in' : '', ". Continue from where you were: first check what you already have and whether a command you started is still running (a detached one keeps running), then continue with your to-dos.");
};
var hhmm = function (at) { return new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };
// As the chat starts: only a cut the keeper saw counts (a chat with no keeper, or one quit before any, starts nothing again),
// once, by the first process to start after it; a reload of the mod in that process before it was done takes it up again
var noteCut = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var cut, now, isCopy, _i, _a, one;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                keepSign = '';
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, pidOfEngine($)];
            case 1:
                enginePid = _b.sent();
                return [4 /*yield*/, readCut($, id)];
            case 2:
                cut = _b.sent();
                if (!cut.ids.length || !cut.cutAt)
                    return [2 /*return*/];
                if (cut.handled.at === cut.cutAt && cut.handled.isDone)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _b.sent();
                if (now - cut.cutAt > CUT_OLD)
                    return [2 /*return*/, void log($, "work cut off at ".concat(hhmm(cut.cutAt), " is too old to start again: ").concat(cut.ids.join(', ')))];
                return [4 /*yield*/, isKeptCopy($)];
            case 4:
                isCopy = _b.sent();
                return [4 /*yield*/, markCut($, id, { at: cut.cutAt, pid: enginePid, isDone: false })];
            case 5:
                _b.sent();
                for (_i = 0, _a = cut.ids; _i < _a.length; _i++) {
                    one = _a[_i];
                    cutPending.add(one);
                }
                return [4 /*yield*/, log($, "work cut off at ".concat(hhmm(cut.cutAt)).concat(isCopy ? ', the chat going on here as a copy' : '', ": ").concat(cut.ids.join(', ')))];
            case 6:
                _b.sent();
                $.clock.after(CUT_LOOK, function () { return void bringBack($, id, cut.ids, cut.cutAt, isCopy).catch(function (err) { return log($, "cut-off work not started again: ".concat(String(err))); }); });
                return [2 /*return*/];
        }
    });
}); };
// Each piece of cut-off work: one Claude Code started again by itself is marked; one the person stopped since is left; any other
// is sent a message, which starts it again; one that cannot be is marked cut off and left ended. Then one notice for all of them
var bringBack = function ($, id, ids, cutAt, isCopy) { return __awaiter(_this, void 0, void 0, function () {
    var handled, _a, _i, ids_1, one, live, back, lost, heldNow, _loop_1, _b, _c, one, now, cards, titled, where, text;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = parsedOr;
                return [4 /*yield*/, readOr($, keepFile(id, 'cut'))];
            case 1:
                handled = _a.apply(void 0, [_f.sent(), {}]);
                if (handled.at === cutAt && handled.isDone)
                    return [2 /*return*/];
                return [4 /*yield*/, markCut($, id, { at: cutAt, pid: enginePid, isDone: true })];
            case 2:
                _f.sent();
                for (_i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    one = ids_1[_i];
                    cutPending.delete(one);
                }
                return [4 /*yield*/, sync($).catch(function () { return undefined; })];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 4:
                live = _f.sent();
                back = [];
                lost = [];
                return [4 /*yield*/, read($, todos)];
            case 5:
                heldNow = _f.sent();
                _loop_1 = function (one) {
                    var isLive, r, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                isLive = live.some(function (agent) { return agent.id === one && WORKING.includes(agent.status); });
                                if (!isLive) return [3 /*break*/, 1];
                                _g = { isDelivered: true };
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, $.session.send({ to: { agentId: one }, text: named(CUT_TELL(cutAt, isCopy)) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 2:
                                _g = _h.sent();
                                _h.label = 3;
                            case 3:
                                r = _g;
                                (r.isDelivered ? back : lost).push(one);
                                if (!!r.isDelivered) return [3 /*break*/, 5];
                                return [4 /*yield*/, log($, "cut-off work ".concat(one, " not started again: ").concat(r.reason))];
                            case 4:
                                _h.sent();
                                _h.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                };
                _b = 0, _c = ids.filter(function (one) { return !stoppedHere.has(one) && !isHeld(heldNow.find(function (card) { return card.id === one; })); });
                _f.label = 6;
            case 6:
                if (!(_b < _c.length)) return [3 /*break*/, 9];
                one = _c[_b];
                return [5 /*yield**/, _loop_1(one)];
            case 7:
                _f.sent();
                _f.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 6];
            case 9:
                if (!back.length && !lost.length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 10:
                now = _f.sent();
                return [4 /*yield*/, changeTodos($, function (list) {
                        var known = new Set(list.map(function (one) { return one.id; }));
                        var added = __spreadArray(__spreadArray([], back, true), lost, true).filter(function (one) { return !known.has(one); }).map(function (one) { return (__assign(__assign({}, started(one, '', '', '', cutAt)), { status: 'stopped', endedAt: cutAt })); });
                        return __spreadArray(__spreadArray([], list, true), added, true).map(function (one) {
                            return back.includes(one.id) ? __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now))), { parentId: '', cutAt: cutAt, backAt: now }) : lost.includes(one.id) ? __assign(__assign({}, (one.status === 'working' ? ended(one, 'stopped', cutAt) : one)), { parentId: '', cutAt: cutAt, backAt: undefined }) : one;
                        });
                    })];
            case 11:
                _f.sent();
                return [4 /*yield*/, saveKeep($)];
            case 12:
                _f.sent();
                redraw($);
                return [4 /*yield*/, read($, todos)];
            case 13:
                cards = _f.sent();
                titled = function (one) { var _a; return "\"".concat(titleOf((_a = cards.find(function (card) { return card.id === one; })) !== null && _a !== void 0 ? _a : started(one, '', '', '', cutAt)), "\""); };
                where = isCopy ? 'on this Mac by itself' : 'again';
                text = [
                    back.length ? "".concat(back.length === 1 ? "".concat(titled((_d = back[0]) !== null && _d !== void 0 ? _d : ''), " was interrupted at ").concat(hhmm(cutAt), " and has been running ").concat(where) : "".concat(back.length, " tasks were interrupted at ").concat(hhmm(cutAt), " and have been running ").concat(where), " since ").concat(hhmm(now), ".") : '',
                    lost.length ? "".concat(lost.length === 1 ? titled((_e = lost[0]) !== null && _e !== void 0 ? _e : '') : "".concat(lost.length, " tasks"), " interrupted at ").concat(hhmm(cutAt), " couldn't be restarted.") : '',
                ]
                    .filter(Boolean)
                    .join(' ');
                $.ui.log(text);
                return [4 /*yield*/, tellDevice($, text)];
            case 14:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// The person is told on their own device: Claude Code's push to the Claude app on their phone, where Remote Control reaches it;
// and the notification this Mac's chats raise
var tellDevice = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var pushed, _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.tool.call({ tool: 'PushNotification', message: text.slice(0, 199) }).catch(function (err) { return ({ deny: String(err) }); })];
            case 1:
                pushed = _f.sent();
                return [4 /*yield*/, log($, "cut-off notice pushed: ".concat(JSON.stringify(pushed).slice(0, 200)))];
            case 2:
                _f.sent();
                _a = alertPerson;
                _b = [$, 'cut', 'Task interrupted and restarted', text];
                _c = "cut-".concat;
                _e = (_d = Math).round;
                return [4 /*yield*/, $.clock.now()];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply("cut-", [_e.apply(_d, [(_f.sent()) / 60000])])]))];
            case 4:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// The line on a card of cut-off work: when, and whether it goes on again
var cutLine = function (one) {
    return one.cutAt ? (one.backAt ? "Interrupted at ".concat(hhmm(one.cutAt), " because the chat's process ended; running again since ").concat(hhmm(one.backAt), ".") : "Interrupted at ".concat(hhmm(one.cutAt), " because the chat's process ended; it couldn't be restarted.")) : '';
};
// ---- Back by itself after Claude switches it off ----
// Claude's engine switches off an add-on that held its shared helper for five seconds, and that chat has no Claudopus until the
// person types /reload-plugins. The engine loads an add-on again by itself when one of its own settings changes, so each chat's
// load writes its beat, keep/<chat>.beat naming the chat's process, every BEAT_EVERY, and starts bin/revive, one on the Mac at a
// time, which changes the setting "revived" (plugin.json's userConfig) when a beat goes quiet while its process still runs.
// Changed, it loads Claudopus again in every chat, as an update does
var BEAT_EVERY = 3000;
var beatFile = function (id) { return "".concat(dir, "/keep/").concat(id, ".beat"); };
var configDir = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c; return __generator(this, function (_d) {
    switch (_d.label) {
        case 0: return [4 /*yield*/, $.env.get('CLAUDE_CONFIG_DIR')];
        case 1:
            _a = (_d.sent());
            if (_a) return [3 /*break*/, 3];
            _b = "".concat;
            return [4 /*yield*/, $.env.get('HOME')];
        case 2:
            _a = _b.apply("", [(_c = (_d.sent())) !== null && _c !== void 0 ? _c : '', "/.claude"]);
            _d.label = 3;
        case 3: return [2 /*return*/, _a];
    }
}); }); };
// The key this copy has in the settings: claudopus@<marketplace> for an installed one, whether Claude Code keeps it in its cache or
// loads it from the marketplace's own folder (a marketplace of a folder on this Mac, as Claudopus's own checkout); claudopus@inline
// for one loaded with --plugin-dir. On 16 Nov this Mac's chats ran from the checkout, and claudopus@inline would have changed nothing
var ownKey = function ($, configDir) { return __awaiter(_this, void 0, void 0, function () {
    var market, known, _a, name;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                market = (_b = /\/plugins\/cache\/([^/]+)\/claudopus\//.exec($.plugin.root)) === null || _b === void 0 ? void 0 : _b[1];
                if (market && /^[\w.-]+$/.test(market))
                    return [2 /*return*/, "claudopus@".concat(market)];
                _a = parsedOr;
                return [4 /*yield*/, readOr($, "".concat(configDir, "/plugins/known_marketplaces.json"))];
            case 1:
                known = _a.apply(void 0, [_d.sent(), {}]);
                name = (_c = Object.entries(known).find(function (_a) {
                    var one = _a[1];
                    return typeof (one === null || one === void 0 ? void 0 : one.installLocation) === 'string' && one.installLocation && ($.plugin.root === one.installLocation || $.plugin.root.startsWith("".concat(one.installLocation.replace(/\/$/, ''), "/")));
                })) === null || _c === void 0 ? void 0 : _c[0];
                return [2 /*return*/, name && /^[\w.-]+$/.test(name) ? "claudopus@".concat(name) : 'claudopus@inline'];
        }
    });
}); };
var beatLine = '';
var beat = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var proof, _a, said_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!dir || !beatLine || isEnded)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write(beatFile(id), beatLine)
                    // The proof that it comes back, for someone who wants to see it: keep/<chat>.hold-test holding this chat's process number, written
                    // by hand, makes this chat's Claudopus hold Claude's helper long enough to be switched off, once, in the next drawing of its panel
                    // or the next message: the engine switches off only an add-on that holds the helper while one of its hooks is answering, not in a
                    // timer of its own (16 Nov trial). It is taken away whatever it holds
                ];
            case 1:
                _b.sent();
                proof = "".concat(dir, "/keep/").concat(id, ".hold-test");
                _a = !isHoldTestDue;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, $.fs.exists(proof)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                if (!_a) return [3 /*break*/, 6];
                return [4 /*yield*/, readOr($, proof)];
            case 4:
                said_1 = (_b.sent()).trim();
                return [4 /*yield*/, $.process.run(['rm', '-f', proof])];
            case 5:
                _b.sent();
                if (said_1 !== enginePid)
                    return [2 /*return*/, void log($, "a hold-test file that did not name this chat's process was taken away")];
                isHoldTestDue = true;
                $.ui.invalidate('ui.render');
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var isHoldTestDue = false;
var holdTest = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isHoldTestDue)
                    return [2 /*return*/];
                isHoldTestDue = false;
                return [4 /*yield*/, log($, "holding Claude's helper on purpose, as keep/<chat>.hold-test asked")];
            case 1:
                _a.sent();
                end = Date.now() + 10000;
                while (Date.now() < end)
                    Math.sqrt(Date.now());
                return [2 /*return*/];
        }
    });
}); };
var startReviver = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var back, backAt, _a, config, settings, _b, _c, script, r;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir || !SAFE_CHAT.test(id))
                    return [2 /*return*/];
                if (!!enginePid) return [3 /*break*/, 2];
                return [4 /*yield*/, pidOfEngine($)];
            case 1:
                enginePid = _h.sent();
                _h.label = 2;
            case 2:
                if (!/^\d+$/.test(enginePid))
                    return [2 /*return*/];
                return [4 /*yield*/, readOr($, "".concat(dir, "/keep/").concat(id, ".revived"))];
            case 3:
                back = (_e = (_d = (_h.sent()).trim().split('\n').at(-1)) === null || _d === void 0 ? void 0 : _d.split(' ')) !== null && _e !== void 0 ? _e : [];
                backAt = Number((_f = back[0]) !== null && _f !== void 0 ? _f : 0) * 1000;
                _a = backAt;
                if (!_a) return [3 /*break*/, 5];
                return [4 /*yield*/, $.clock.now()];
            case 4:
                _a = (_h.sent()) - backAt < 120000;
                _h.label = 5;
            case 5:
                if (!_a) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "back after Claude switched Claudopus off in this chat (its beat was quiet ".concat((_g = back[1]) !== null && _g !== void 0 ? _g : '?', " s)"))];
            case 6:
                _h.sent();
                _h.label = 7;
            case 7: return [4 /*yield*/, configDir($)];
            case 8:
                config = _h.sent();
                settings = "".concat(config, "/settings.json");
                if (/[\t\n]/.test(settings))
                    return [2 /*return*/];
                _c = (_b = "".concat(enginePid, "\t")).concat;
                return [4 /*yield*/, ownKey($, config)];
            case 9:
                beatLine = _c.apply(_b, [_h.sent(), "\t"]).concat(settings, "\n");
                return [4 /*yield*/, beat($, id)];
            case 10:
                _h.sent();
                everyLoad($, BEAT_EVERY, function () { return beat($, id).catch(function () { return undefined; }); });
                script = "nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' \"$1\" \"$2\" >/dev/null 2>&1 </dev/null &";
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', script, 'sh', "".concat($.plugin.root, "/bin/revive"), dir]).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 11:
                r = _h.sent();
                if (!(r.exitCode !== 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, log($, "the watcher that brings Claudopus back was not started: ".concat(r.stderr.slice(0, 200)))];
            case 12:
                _h.sent();
                _h.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
// A chat that ends leaves no beat behind
var endBeat = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                beatLine = '';
                if (!(dir && SAFE_CHAT.test(id))) return [3 /*break*/, 2];
                return [4 /*yield*/, $.process.run(['rm', '-f', beatFile(id)]).catch(function () { return undefined; })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var SAFE_CHAT = /^[A-Za-z0-9-]{1,80}$/;
var REVIVED_KEY = 'claudopus.revived';
