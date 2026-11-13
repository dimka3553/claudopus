// The Results tab and each result's own tab: the list, a result drawn whole, put away and brought back
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
// Puts a line naming the report in the chat's box, for the person to finish and send; where there is no box, nothing is sent for them
var carryOn = function ($, r, now) { return __awaiter(_this, void 0, void 0, function () {
    var text, typed, filled;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = "Carry on from the result \"".concat(r.title, "\" (").concat(dated(r.at, now), "), ").concat(reportPath(r), "/report.md: ");
                return [4 /*yield*/, $.prompt.read().catch(function () { return ({ text: '' }); })];
            case 1:
                typed = (_a.sent()).text;
                return [4 /*yield*/, $.prompt.fill(typed.trim() ? { text: "\n".concat(text), mode: 'append' } : { text: text, mode: 'replace' }).catch(function () { return ({ isFilled: false }); })];
            case 2:
                filled = _a.sent();
                if (!!filled.isFilled) return [3 /*break*/, 4];
                return [4 /*yield*/, log($, 'the chat box was not filled from a report')];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// The person's answer to one thing a report waits on them for: Yes and No go to the chat as their message; Not now sets it aside.
// It clears that one alone
var answering = new Set();
var answerWait = function ($, r, index, said, now) { return __awaiter(_this, void 0, void 0, function () {
    var wait;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wait = waitsOf(r)[index];
                // A second press before the answer is kept sends nothing more
                if (!wait || wait.answer || answering.has("".concat(r.id, ":").concat(index)))
                    return [2 /*return*/];
                answering.add("".concat(r.id, ":").concat(index));
                if (!(said !== 'Not now')) return [3 /*break*/, 2];
                return [4 /*yield*/, sendForPerson($, "From the Claudopus panel: ".concat(who(true), " pressed \"").concat(said, "\" in answer to what the result \"").concat(r.title, "\" (").concat(dated(r.at, now), ") waits on them for: ").concat(wait.text, "\nThe result: ").concat(reportPath(r), "/report.md"))
                    // Not now kept nowhere can be pressed again; a Yes or No already sent is not sent twice
                ];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: 
            // Not now kept nowhere can be pressed again; a Yes or No already sent is not sent twice
            return [4 /*yield*/, markReport($, r, function (stored) { return ({ waiting: waitsOf(stored).map(function (one, at) { return (at === index ? __assign(__assign({}, one), { answer: said }) : one); }) }); }).catch(function (err) {
                    if (said === 'Not now')
                        answering.delete("".concat(r.id, ":").concat(index));
                    throw err;
                })];
            case 3:
                // Not now kept nowhere can be pressed again; a Yes or No already sent is not sent twice
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// ---- Reports in panes of their own: the list as "Reports", and each report opened as a pane titled with its name ----
// The list's pane; a report's pane is named after the report. At most this many reports are open as panes: opening one more
// closes the one opened longest ago
var REPORTS_PANE = 'reports';
var REPORTS_TITLE = 'Results';
var REPORT_PANES = 3;
// A pane's id is at most 64 letters, digits, '_' and '-': a longer one keeps its head and a mark of the whole, so two never meet
var paneOf = function (r) {
    var id = "report-".concat(r.id.replace(/[^A-Za-z0-9_-]/g, '-'));
    return id.length <= 64 ? id : "".concat(id.slice(0, 52), "-").concat(mark(r.id).replace(/\D/g, '').slice(-11));
};
// Which picture each open report shows, by its pane
var pictureAt = new Map();
var redraw = function ($) { return $.ui.invalidate('ui.render'); };
// Opens a pane from a press, in front: the app leaves a pane already open where it is, behind another tab, so one open but not
// shown is opened again
var front = function ($, id, title) { return __awaiter(_this, void 0, void 0, function () {
    var shown, holding, _a, _loop_1, _i, holding_1, held_1, was;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                shown = function () { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = Boolean;
                            return [4 /*yield*/, $.ui.panes()];
                        case 1: return [2 /*return*/, _a.apply(void 0, [(_b = (_c.sent()).find(function (pane) { return pane.id === id; })) === null || _b === void 0 ? void 0 : _b.isShown])
                            // A press inside a tab gives that tab the keyboard, and the engine never shows a new tab over the one holding it: it waits on
                            // the screen to honour the open's focus, which a screen with a turn running or text in the box refuses (seen every press in a
                            // chat the app runs on another Mac over ssh). The tab holding the keyboard is closed and opened again first, so it lets go.
                            // The new tab opens behind it before that, so the sidebar always holds a tab: with none open it slid shut and open again
                        ];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.panes()];
            case 1:
                holding = (_b.sent()).filter(function (pane) { return pane.isFocused && pane.id !== id; });
                _a = holding.length;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, $.ui.panes()];
            case 2:
                _a = !(_b.sent()).some(function (pane) { return pane.id === id; });
                _b.label = 3;
            case 3:
                if (!_a) return [3 /*break*/, 5];
                return [4 /*yield*/, $.ui.open({ id: id, title: title })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _loop_1 = function (held_1) {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.close({ id: held_1.id }).catch(function () { return undefined; })];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, $.ui.open({ id: held_1.id, title: held_1.title }).catch(function (err) { return log($, "".concat(held_1.id, " not opened again: ").concat(String(err))); })];
                            case 2:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, holding_1 = holding;
                _b.label = 6;
            case 6:
                if (!(_i < holding_1.length)) return [3 /*break*/, 9];
                held_1 = holding_1[_i];
                return [5 /*yield**/, _loop_1(held_1)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, $.ui.panes()];
            case 10:
                was = (_b.sent()).find(function (pane) { return pane.id === id; });
                if (!(was && !was.isShown)) return [3 /*break*/, 12];
                return [4 /*yield*/, $.ui.close({ id: id }).catch(function () { return undefined; })];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12: return [4 /*yield*/, $.ui.open({ id: id, title: title, focus: true })
                // The pane pressed in stays in front while its press runs: once it has run, the new pane is opened again, which brings it forward
                // Only where the surface says which pane it shows: a chat the app runs on another Mac over ssh says none is shown, ever, and there
                // this open from a timer, which no press asked for, left a tab the mod never drew in place of the one drawn (seen on the M4)
            ];
            case 13:
                _b.sent();
                return [4 /*yield*/, shown()];
            case 14:
                // The pane pressed in stays in front while its press runs: once it has run, the new pane is opened again, which brings it forward
                // Only where the surface says which pane it shows: a chat the app runs on another Mac over ssh says none is shown, ever, and there
                // this open from a timer, which no press asked for, left a tab the mod never drew in place of the one drawn (seen on the M4)
                if (!(_b.sent()))
                    $.clock.after(150, function () { return __awaiter(_this, void 0, void 0, function () {
                        var panes, mine, now;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.ui.panes()];
                                case 1:
                                    panes = _a.sent();
                                    mine = panes.find(function (pane) { return pane.id === id; });
                                    // Closed by the person meanwhile, already in front, or a screen that says nothing of what it shows: left as it is
                                    if (!mine || mine.isShown || !panes.some(function (pane) { return pane.isShown; }))
                                        return [2 /*return*/];
                                    return [4 /*yield*/, $.ui.close({ id: id }).catch(function () { return undefined; })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, $.ui.open({ id: id, title: title, focus: true })];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, $.ui.panes()];
                                case 4:
                                    now = (_a.sent()).find(function (pane) { return pane.id === id; });
                                    return [4 /*yield*/, log($, "front ".concat(id, " again: shown ").concat(Boolean(now === null || now === void 0 ? void 0 : now.isShown), ", drawn ").concat(Boolean(now === null || now === void 0 ? void 0 : now.isPlaced)))];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                return [2 /*return*/];
        }
    });
}); };
// A tab of the mod's own, other than the list, that is open and not drawn was left by an open no press asked for: it is closed, so
// the person never looks at an empty tab, and a press opens it again, drawn. Run as the mod loads and as the session starts
// Only while a surface places this chat's panes (one of them is drawn): with none attached every pane waits undrawn, rightly
var closeUndrawn = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var panes, _loop_2, _i, panes_1, pane;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 1:
                panes = _b.sent();
                if (!panes.some(function (pane) { return pane.isPlaced; }))
                    return [2 /*return*/];
                _loop_2 = function (pane) {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (pane.id === LIST || pane.isPlaced)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                            case 1:
                                // Read again just before: a press meanwhile may have opened it afresh, drawn
                                if (((_a = (_c.sent()).find(function (one) { return one.id === pane.id; })) === null || _a === void 0 ? void 0 : _a.isPlaced) !== false)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, $.ui.close({ id: pane.id }).catch(function () { return undefined; })];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, log($, "undrawn tab ".concat(pane.id, " closed"))];
                            case 3:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, panes_1 = panes;
                _b.label = 2;
            case 2:
                if (!(_i < panes_1.length)) return [3 /*break*/, 5];
                pane = panes_1[_i];
                return [5 /*yield**/, _loop_2(pane)];
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
// A picture that is an SVG of the work's own is drawn as it is, when it is small enough to draw
var svgOf = function ($, path) { return __awaiter(_this, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readOr($, path)];
            case 1:
                text = _a.sent();
                return [2 /*return*/, text.includes('<svg') && text.length <= SVG_CHARS ? { source: text, width: 0, height: 0 } : null];
        }
    });
}); };
var openReport = function ($, id) {
    presses += 1;
    void (function () { return __awaiter(_this, void 0, void 0, function () {
        var r, open, _i, _a, pane, kept, now;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, read($, reports)];
                case 1:
                    r = (_b.sent()).find(function (one) { return one.id === id; });
                    if (!r)
                        return [2 /*return*/];
                    // A report brought in by hand gets its small copies when it is first opened
                    return [4 /*yield*/, makeThumbs($, r).catch(function (err) { return log($, "small copies of report ".concat(id, " not made: ").concat(String(err))); })];
                case 2:
                    // A report brought in by hand gets its small copies when it is first opened
                    _b.sent();
                    return [4 /*yield*/, $.ui.panes()];
                case 3:
                    open = (_b.sent()).filter(function (pane) { return pane.id.startsWith('report-') && pane.id !== paneOf(r); });
                    _i = 0, _a = open.slice(0, Math.max(0, open.length - (REPORT_PANES - 1)));
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    pane = _a[_i];
                    return [4 /*yield*/, $.ui.close({ id: pane.id }).catch(function () { return undefined; })
                        // Its tab is named after it; rounds of one piece of work, which share a name, by their time too
                    ];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, read($, reports)];
                case 8:
                    kept = _b.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 9:
                    now = _b.sent();
                    return [4 /*yield*/, front($, paneOf(r), kept.some(function (one) { return one.id !== r.id && one.title === r.title; }) ? "".concat(cut(r.title, 22), " \u00B7 ").concat(time(r.at, now)) : cut(r.title, 30))
                        // The pressed row gets a new name, so the app does not hold the list where that button was
                    ];
                case 10:
                    _b.sent();
                    // The pressed row gets a new name, so the app does not hold the list where that button was
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })().catch(function (err) { return log($, "report ".concat(id, " not opened: ").concat(String(err))); });
};
// Puts a result away, or brings it back: its entry, every round of its work, leaves the list and the chat's note, nothing in it
// waits, and its open tabs close. The mark is kept beside each report; nothing is deleted or rewritten
var archiving = new Set();
var archiveReport = function ($, r, isArchived) {
    var entry = r.agent || r.id;
    if (archiving.has(entry))
        return;
    archiving.add(entry);
    presses += 1;
    void (function () { return __awaiter(_this, void 0, void 0, function () {
        var kept, rounds, now, _loop_3, _i, rounds_1, one, tabs_1, _a, _b, pane;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, read($, reports)];
                case 1:
                    kept = (_d.sent()).filter(function (one) { return Boolean(one.archived) !== isArchived; });
                    rounds = (_c = entriesOf(kept).find(function (entry) { return entry.some(function (one) { return one.id === r.id; }); })) !== null && _c !== void 0 ? _c : [];
                    return [4 /*yield*/, $.clock.now()
                        // Each round is marked even when another's mark fails, so the press leaves as little half done as it can
                        // Brought back keeps when, so another Mac that has it put away follows the later of the two
                    ];
                case 2:
                    now = _d.sent();
                    _loop_3 = function (one) {
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, markReport($, one, isArchived ? { archived: now } : { archived: undefined, broughtBack: now }).catch(function (err) { return log($, "result ".concat(one.id, " not ").concat(isArchived ? 'archived' : 'brought back', ": ").concat(String(err))); })
                                    // One brought back is listed in its place, even one that came after the list was opened
                                ];
                                case 1:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, rounds_1 = rounds;
                    _d.label = 3;
                case 3:
                    if (!(_i < rounds_1.length)) return [3 /*break*/, 6];
                    one = rounds_1[_i];
                    return [5 /*yield**/, _loop_3(one)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // One brought back is listed in its place, even one that came after the list was opened
                    if (!isArchived && reportsListed.length)
                        reportsListed = __spreadArray([], new Set(__spreadArray(__spreadArray([], reportsListed, true), rounds.map(function (one) { return one.id; }), true)), true);
                    if (!isArchived) return [3 /*break*/, 11];
                    tabs_1 = new Set(rounds.map(paneOf));
                    _a = 0;
                    return [4 /*yield*/, $.ui.panes()];
                case 7:
                    _b = (_d.sent()).filter(function (one) { return tabs_1.has(one.id); });
                    _d.label = 8;
                case 8:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    pane = _b[_a];
                    return [4 /*yield*/, $.ui.close({ id: pane.id }).catch(function () { return undefined; })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/];
            }
        });
    }); })()
        .catch(function (err) { return log($, "result ".concat(r.id, " not ").concat(isArchived ? 'archived' : 'brought back', ": ").concat(String(err))); })
        .finally(function () { return (archiving.delete(entry), redraw($)); });
};
// The reports shown when the list was last opened from the Claudopus pane. One that arrives while the person reads the list waits,
// counted in its heading, so no row moves under the pointer
var reportsListed = [];
// A subject in letters the slug drops stands alone, by its id
var subjectOf = function (r) { return slug(r.subject || r.title) || r.id; };
// One entry per piece of work, its newest report first and its earlier rounds after it. Rounds of one work are: the same work
// reporting again; work started from a report (its `from`); and reports on one subject whose titles lead with that subject. A report
// brought in by hand is an entry of its own unless one of these joins it
var entriesOf = function (list) {
    var head = new Map(list.map(function (r) { return [r.id, r.id]; }));
    var find = function (id) {
        var _a;
        var up = (_a = head.get(id)) !== null && _a !== void 0 ? _a : id;
        return up === id ? id : find(up);
    };
    var join = function (a, b) {
        var _a = [find(a), find(b)], x = _a[0], y = _a[1];
        if (x !== y)
            head.set(x, y);
    };
    var firsts = new Map();
    var by = function (key, r) { return (firsts.has(key) ? join(r.id, firsts.get(key)) : firsts.set(key, r.id)); };
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var r = list_1[_i];
        if (r.agent)
            by("agent:".concat(r.agent), r);
        if (r.from && head.has(r.from))
            join(r.id, r.from);
        var subject = slug(r.subject);
        if (subject && (slug(r.title) === subject || slug(r.title).startsWith("".concat(subject, "-"))))
            by("subject:".concat(subject), r);
    }
    return __spreadArray([], list.reduce(function (all, r) { var _a; return all.set(find(r.id), __spreadArray(__spreadArray([], ((_a = all.get(find(r.id))) !== null && _a !== void 0 ? _a : []), true), [r], false)); }, new Map()).values(), true);
};
// What a report waits on now: an earlier round's open items were asked again, or not, by its newest round
var newestOf = function (list) { return new Set(entriesOf(list).map(function (entry) { var _a; return (_a = entry[0]) === null || _a === void 0 ? void 0 : _a.id; })); };
// Words that say what a piece of work is about, for telling whether a brief that names a report goes on with that work
var aboutWords = function (text) { return new Set(slug(text).split('-').filter(function (word) { return word.length >= 4 && !['with', 'from', 'that', 'this', 'into', 'your', 'what', 'when', 'work'].includes(word); })); };
var openReports = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                return [4 /*yield*/, read($, reports)];
            case 1:
                reportsListed = (_a.sent()).map(function (r) { return r.id; });
                redraw($);
                return [4 /*yield*/, front($, REPORTS_PANE, REPORTS_TITLE)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var day = function (at, now) { var _a; return (_a = dated(at, now).split(',')[0]) !== null && _a !== void 0 ? _a : ''; };
var time = function (at, now) { var _a; return (day(at, now) === day(now, now) ? ((_a = dated(at, now).split(', ')[1]) !== null && _a !== void 0 ? _a : '') : dated(at, now)); };
// On the Claudopus pane the reports are one small button. It sits on the line above the cards, beside the chat's own size, so
// nothing below it moves when a report arrives
var reportsButton = function ($, ui, all) {
    var Box = ui.Box, Button = ui.Button;
    var list = all.filter(function (r) { return !r.archived; });
    if (!list.length)
        return null;
    return (<Box key="reports-button" flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <Button key={"reports-open-".concat(presses)} label={"Results ".concat(entriesOf(list).length)} onPress={function () { return void openReports($).catch(function (err) { return log($, "reports not opened: ".concat(String(err))); }); }}/>
    </Box>);
};
// The list, one line a row: the title, when, and Archive at its right, a mark while it waits on the person. First what waits on
// the person, then the few newest, then the rest folded into one row, "Earlier N", and those put away into "Archived N". Rounds of
// one work are one row, its newest; the earlier rounds are listed inside its tab
var RECENT = 5;
var isEarlierOpen = false;
var isArchivedOpen = false;
// When, as short as it fits its place: the time today, the day this year, the year before that
var when = function (at, now) { return (day(at, now) === day(now, now) ? time(at, now) : new Date(at).getFullYear() === new Date(now).getFullYear() ? day(at, now) : String(new Date(at).getFullYear())); };
var reportsView = function ($, ui, all, now, line) {
    var Box = ui.Box, Button = ui.Button, Text = ui.Text;
    var list = all.filter(function (r) { return !r.archived; });
    var gone = entriesOf(all.filter(function (r) { return r.archived; }));
    // A new round of an entry already listed shows in its place; a new entry waits
    var shown = reportsListed.length ? entriesOf(list).filter(function (entry) { return entry.some(function (r) { return reportsListed.includes(r.id); }); }).flat() : list;
    var entries = entriesOf(shown);
    var fresh = entriesOf(list).length - entries.length;
    var waiting = entries.filter(function (entry) { return isOpenQuestion(entry[0]); });
    var rest = entries.filter(function (entry) { return !isOpenQuestion(entry[0]); });
    var _a = [rest.slice(0, RECENT), rest.slice(RECENT)], recent = _a[0], earlier = _a[1];
    var fold = function (key, label, isOpen, onPress) { return (<Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" alignItems="flex-start" flexShrink={0}>
      {/* In the rows' title column */}
      <Box width={1} flexShrink={0}/>
      <Button key={"".concat(key, "-").concat(presses)} label={"".concat(isOpen ? '▾' : '▸', " ").concat(label)} plain dimColor onPress={function () { return void ((presses += 1), onPress(), redraw($)); }}/>
    </Box>); };
    // One row, one line: the title pressed opens it; when and Archive sit at the right, the same width on every row
    var row = function (entry) {
        var r = entry[0];
        if (!r)
            return null;
        return (<Box key={"entry-".concat(r.id)} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
        <Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} flexShrink={1} minWidth={0}>
          {/* In the column the folded rows' labels start in */}
          <Box width={1} flexShrink={0}/>
          <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
            <Button key={"report-".concat(r.id, "-").concat(presses)} label={cut(r.title, line - 22)} plain onPress={function () { return openReport($, r.id); }}/>
          </Box>
        </Box>
        <Box width={6} flexShrink={0} justifyContent="flex-end">
          <Text dimColor>{when(r.at, now)}</Text>
        </Box>
        <Button key={"archive-".concat(r.id, "-").concat(presses)} label="Archive" plain dimColor onPress={function () { return archiveReport($, r, true); }}/>
      </Box>);
    };
    var rows = function (group) { return (<Box flexDirection="column" flexShrink={0}>
      {group.map(row)}
    </Box>); };
    return (<Box key="reports" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="reports-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" alignItems="center" gap={1}>
          <Text bold>Results</Text>
          <Text dimColor>{"".concat(entries.length)}</Text>
        </Box>
        {fresh ? <Button key={"reports-fresh-".concat(presses)} label={"Show ".concat(fresh, " new")} onPress={function () { return void openReports($).catch(function (err) { return log($, "reports not opened: ".concat(String(err))); }); }}/> : null}
      </Box>
      {!shown.length && !gone.length ? <Text dimColor>Nothing yet.</Text> : null}
      {waiting.length ? band(ui, 'reports-waiting', 'Waiting on you', "".concat(waiting.length), rows(waiting)) : null}
      {recent.length ? band(ui, 'reports-recent', waiting.length ? 'Recent' : 'Newest', '', rows(recent)) : null}
      {earlier.length || gone.length ? (<Box key="reports-folded" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
          {earlier.length ? fold('earlier-fold', "Earlier ".concat(earlier.length), isEarlierOpen, function () { return (isEarlierOpen = !isEarlierOpen); }) : null}
          {earlier.length && isEarlierOpen ? rows(earlier) : null}
          {gone.length ? fold('archived-fold', "Archived ".concat(gone.length), isArchivedOpen, function () { return (isArchivedOpen = !isArchivedOpen); }) : null}
          {gone.length && isArchivedOpen
                ? gone.map(function (entry) {
                    var r = entry[0];
                    if (!r)
                        return null;
                    return (<Box key={"archived-".concat(r.id)} flexDirection="row" alignItems="center" gap={2} height={1} overflow="hidden" flexShrink={0}>
                    <Box flexDirection="row" gap={1} flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
                      <Box width={1} flexShrink={0}/>
                      <Button key={"report-".concat(r.id, "-").concat(presses)} label={cut(r.title, line - 24)} plain dimColor onPress={function () { return openReport($, r.id); }}/>
                    </Box>
                    <Box width={6} flexShrink={0} justifyContent="flex-end">
                      <Text dimColor>{when(r.at, now)}</Text>
                    </Box>
                    <Button key={"unarchive-".concat(r.id, "-").concat(presses)} label="Bring back" plain onPress={function () { return archiveReport($, r, false); }}/>
                  </Box>);
                })
                : null}
        </Box>) : null}
    </Box>);
};
var reportShown = function ($, ui, r, text, list, now, at, thumb) {
    var _a, _b, _c, _d, _e, _f, _g;
    var Box = ui.Box, Button = ui.Button, Markdown = ui.Markdown, Text = ui.Text;
    var table = ui;
    // The other rounds of its work first, as the list shows them as one row; then what it started from or started, and the subject's others
    var rounds = ((_a = entriesOf(list.filter(function (one) { return Boolean(one.archived) === Boolean(r.archived); })).find(function (entry) { return entry.some(function (one) { return one.id === r.id; }); })) !== null && _a !== void 0 ? _a : []).filter(function (one) { return one.id !== r.id; });
    var others = list.filter(function (one) { return one.id !== r.id && !rounds.includes(one) && (one.id === r.from || one.from === r.id || subjectOf(one) === subjectOf(r)); });
    var kin = __spreadArray(__spreadArray([], rounds, true), others.slice(0, Math.max(0, 8 - rounds.length)), true);
    var pictures = r.files.map(function (file) { return ({ file: file, path: "".concat(reportPath(r), "/").concat(file), href: "file://".concat(encodeURI("".concat(reportPath(r), "/").concat(file))) }); });
    var how = function (one) {
        return [one.id === r.from ? 'this started from it' : one.from === r.id ? 'started from this' : rounds.includes(one) ? (one.at < r.at ? 'earlier round' : 'later round') : '', one.archived ? 'archived' : ''].filter(Boolean).join(' · ');
    };
    var pane = paneOf(r);
    var show = function (to) { return void ((presses += 1), pictureAt.set(pane, to), redraw($)); };
    return (<Box key={"report-".concat(r.id)} flexDirection="column" gap={1} flexGrow={1}>
      {/* Archive at the head's right: pressed, the tab closes; one archived says so, with Bring back */}
      <Box key="report-head" flexDirection="row" alignItems="flex-start" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold wrap="wrap">{r.title}</Text>
          <Text dimColor wrap="wrap">{[dated(r.at, now), r.subject && slug(r.subject) !== slug(r.title) ? r.subject : '', r.archived ? 'archived' : answeredOf(r)].filter(Boolean).join(' · ')}</Text>
        </Box>
        <Button key={"report-archive-".concat(presses)} label={r.archived ? 'Bring back' : 'Archive'} onPress={function () { return archiveReport($, r, !r.archived); }}/>
      </Box>
      {isOpenQuestion(r)
            ? band(ui, 'report-ask', 'Waiting on you', openWaits(r).length > 1 ? "".concat(openWaits(r).length) : '', 
            // Each thing it waits on with its own answers; one answered leaves the others
            <Box flexDirection="column" gap={2}>
              {waitsOf(r).map(function (wait, index) {
                    return wait.answer ? null : (<Box key={"report-wait-".concat(index)} flexDirection="column" gap={1}>
                    <Text wrap="wrap">{wait.text}</Text>
                    <Box flexDirection="row" flexWrap="wrap" gap={1}>
                      {['Yes', 'No', 'Not now'].map(function (said) { return (<Button key={"report-say-".concat(index, "-").concat(said, "-").concat(presses)} label={said} onPress={function () { return void ((presses += 1), answerWait($, r, index, said, now).catch(function (err) { return log($, "answer not kept: ".concat(String(err))); })); }}/>); })}
                    </Box>
                  </Box>);
                })}
            </Box>)
            : null}
      {r.gist
            ? band(ui, 'report-finding', 'Finding', '', <Text wrap="wrap">{r.gist}</Text>)
            : null}
      {pictures.length
            ? band(ui, 'report-pictures', 'Pictures', pictures.length > 1 ? "".concat(at + 1, " of ").concat(pictures.length) : '', <Box flexDirection="column" gap={1}>
              {thumb && table.Svg ? <table.Svg key={"report-picture-".concat(r.id, "-").concat(at)} source={thumb.source} alt={(_c = (_b = pictures[at]) === null || _b === void 0 ? void 0 : _b.file) !== null && _c !== void 0 ? _c : 'Picture'}/> : null}
              {/* Shown here, never handed to another app: that would take the person out of Claude and switch their desktop. Where the
                    picture cannot be drawn, its path is given as text */}
              <Text dimColor wrap="wrap">{thumb && table.Svg ? ((_e = (_d = pictures[at]) === null || _d === void 0 ? void 0 : _d.file) !== null && _e !== void 0 ? _e : '') : ((_g = (_f = pictures[at]) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '')}</Text>
              {pictures.length > 1 ? (<Box flexDirection="row" flexWrap="wrap" alignItems="center" gap={1}>
                  <Button key={"report-prev-".concat(presses)} label="‹ Previous" onPress={function () { return show((at + pictures.length - 1) % pictures.length); }}/>
                  <Button key={"report-next-".concat(presses)} label="Next ›" onPress={function () { return show((at + 1) % pictures.length); }}/>
                </Box>) : null}
            </Box>)
            : null}
      {band(ui, 'report-text', 'In full', '', 
        // A link it names never leaves the app: one of its pictures is shown above, anything else stays as text
        <Markdown key={"report-text-".concat(r.id)} text={text.length > REPORT_CHARS ? "".concat(text.slice(0, REPORT_CHARS), "\n\n\u2026") : text} onLinkPress={function (link) {
                var to = pictures.findIndex(function (one) { return link.href.endsWith("/".concat(fileName(one.file))) || link.href === one.path; });
                if (to >= 0)
                    show(to);
            }}/>)}
      {band(ui, 'report-carry', 'Carry on', '', <Box flexDirection="column" alignItems="flex-start" gap={1}>
          <Text dimColor wrap="wrap">Puts a line naming this result in the chat's box, for you to finish and send.</Text>
          <Button key={"report-carry-".concat(presses)} label="Carry on from this" onPress={function () { return void ((presses += 1), redraw($), carryOn($, r, now)); }}/>
          {kin.length ? (<Box flexDirection="column" alignItems="flex-start">
              {kin.map(function (one) { return (<Button key={"report-kin-".concat(one.id, "-").concat(presses)} label={[dated(one.at, now), one.title, how(one)].filter(Boolean).join(' · ')} plain dimColor onPress={function () { return openReport($, one.id); }}/>); })}
            </Box>) : null}
        </Box>)}
    </Box>);
};
