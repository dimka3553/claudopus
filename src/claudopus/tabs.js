// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own
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
var tabHooks = function (on) {
    // In a chat the app runs on another Mac over ssh, every press that reaches the engine is one line in the log: which button, how long
    // since the panel was last drawn, and the tabs as the engine lists them, so a press that did nothing shows whether it arrived at all
    on('ui.press', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, isTerminal, r;
        var _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!(isRunFromAfar && e.plugin === 'claudopus')) return [3 /*break*/, 6];
                    _a = log;
                    _b = [$];
                    _e = (_d = "press ".concat(e.element, " in ").concat(e.requestId, " (").concat(e.surface, "), panel drawn ")).concat;
                    if (!drawnNow) return [3 /*break*/, 2];
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    _f = (_l.sent()) - drawnNow;
                    return [3 /*break*/, 3];
                case 2:
                    _f = -1;
                    _l.label = 3;
                case 3:
                    _g = (_c = _e.apply(_d, [_f, " ms ago; tabs "])).concat;
                    _h = rosterOf;
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_g.apply(_c, [_h.apply(void 0, [_l.sent()])])]))
                    // In every other chat a press that reached its button is one line too, written beside the press and never waited for. The engine
                    // runs this hook only for a button it still holds; a press on a button a newer drawing replaced is dropped before it, and is in
                    // the app's own log instead ("ui_press not handled"), so the two logs together say what share of the person's clicks land
                ];
                case 5:
                    _l.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (e.plugin === 'claudopus')
                        void log($, "press landed: ".concat((_j = keyShown(e.element)) !== null && _j !== void 0 ? _j : '', " in ").concat((_k = keyShown(e.requestId)) !== null && _k !== void 0 ? _k : '', " (").concat(e.surface, ")"));
                    _l.label = 7;
                case 7:
                    if (!(e.plugin === 'claudopus')) return [3 /*break*/, 10];
                    (pressFrom = 0);
                    return [4 /*yield*/, $.clock.now()];
                case 8:
                    (pressedAt = _l.sent()), freeTimes($), (freshness += 1);
                    return [4 /*yield*/, engage($)];
                case 9:
                    (_l.sent());
                    _l.label = 10;
                case 10:
                    isTerminal = e.plugin === 'claudopus' && e.surface === 'terminal';
                    if (isTerminal)
                        tabMoves.begin();
                    _l.label = 11;
                case 11:
                    _l.trys.push([11, , 13, 16]);
                    return [4 /*yield*/, next(e)];
                case 12:
                    r = _l.sent();
                    return [3 /*break*/, 16];
                case 13:
                    if (!isTerminal) return [3 /*break*/, 15];
                    return [4 /*yield*/, tabMoves.finish(function (move) { return runTabMove($, move); }, function (ms) { return $.clock.sleep(ms); })];
                case 14:
                    _l.sent();
                    _l.label = 15;
                case 15: return [7 /*endfinally*/];
                case 16:
                    if (!(e.plugin === 'claudopus' && (answersOnWay.size || wakes.length))) return [3 /*break*/, 18];
                    return [4 /*yield*/, sendWakes($, true).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
                case 17:
                    _l.sent();
                    _l.label = 18;
                case 18:
                    if (!heldSends.length) return [3 /*break*/, 20];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 19:
                    _l.sent();
                    _l.label = 20;
                case 20: return [2 /*return*/, r];
            }
        });
    }); });
    // and so does a reply typed in a card's box
    on('ui.input', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _a.sent();
                    if (e.plugin !== 'claudopus' || e.kind !== 'submit')
                        return [2 /*return*/, r
                            // Two replies to ended work went from the timer with no sign of why: each submit says here what it found on its way
                        ];
                    // Two replies to ended work went from the timer with no sign of why: each submit says here what it found on its way
                    void log($, "reply submitted: ".concat(answersOnWay.size, " answer(s) and ").concat(wakes.length, " wake(s) on the way"));
                    if (!(answersOnWay.size || wakes.length)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sendWakes($, true).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!heldSends.length) return [3 /*break*/, 5];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, r];
            }
        });
    }); });
    // The reports, in a pane of their own
    on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box, kept, line, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Box = uiOf($, e).Box;
                    return [4 /*yield*/, read($, reports)
                        // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
                    ];
                case 1:
                    kept = _c.sent();
                    line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)));
                    _a = reportsView;
                    _b = [$, uiOf($, e), kept];
                    return [4 /*yield*/, $.clock.now()];
                case 2: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([_c.sent(), line, e.props.scroll.bodyRows]))}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
    on('ui.render', { component: 'Pane', requestId: STATS_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Box = uiOf($, e).Box;
                    void statsRead($, statsShown.scope).catch(function () { return undefined; });
                    _a = statsView;
                    _b = [function () { return drawAgain($); }, uiOf($, e)];
                    return [4 /*yield*/, $.clock.now()];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([_c.sent(), function (scope) { return void statsRead($, scope).catch(function () { return undefined; }); }, e.surface, e.props.bodyColumns * 7.4 - 32]))}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // About, in a pane of its own
    on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var ui, _a, _b, _c, _d, _e;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    ui = uiOf($, e);
                    _a = configView;
                    _b = [ui];
                    _c = [{}];
                    return [4 /*yield*/, configShown($)];
                case 1:
                    _d = [__assign.apply(void 0, _c.concat([(_g.sent())]))];
                    _f = {};
                    if (!updateCheck.isChecking) return [3 /*break*/, 2];
                    _e = null;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, configUpdateBox($, ui)];
                case 3:
                    _e = _g.sent();
                    _g.label = 4;
                case 4: return [2 /*return*/, (<ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([__assign.apply(void 0, _d.concat([(_f.updateBox = _e, _f)])), configActs($), band, presses, dir]))}
      </ui.Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Box = uiOf($, e).Box;
                    return [4 /*yield*/, aboutView($, uiOf($, e), e.surface)];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.sent()}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // The changelog, in a pane of its own
    on('ui.render', { component: 'Pane', requestId: CHANGELOG_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Box = uiOf($, e).Box;
                    return [4 /*yield*/, changelogView($, uiOf($, e), e.surface)];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.sent()}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // A picture opened large, in a chat the app runs on another Mac over ssh
    on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Box = uiOf($, e).Box;
                    return [4 /*yield*/, pictureView($, e)];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.sent()}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // A report opened as a pane of its own, named after it
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, Box, Text, kept, r, _b, _c, _d, at, file, picture, _e, _f, _g, _h, _j;
        var _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    if (!((_k = e.requestId) === null || _k === void 0 ? void 0 : _k.startsWith('report-')))
                        return [2 /*return*/, next(e)];
                    _a = uiOf($, e), Box = _a.Box, Text = _a.Text;
                    return [4 /*yield*/, read($, reports)];
                case 1:
                    kept = _p.sent();
                    r = kept.find(function (one) { return paneOf(one) === e.requestId; });
                    if (!r)
                        return [2 /*return*/, <Text dimColor>This result is no longer available.</Text>];
                    if (!!reportText.has(r.id)) return [3 /*break*/, 3];
                    _c = (_b = reportText).set;
                    _d = [r.id];
                    return [4 /*yield*/, readOr($, "".concat(reportPath(r), "/report.md"))];
                case 2:
                    _c.apply(_b, _d.concat([_p.sent()]));
                    _p.label = 3;
                case 3:
                    at = Math.min(Math.max(0, (_l = pictureAt.get(paneOf(r))) !== null && _l !== void 0 ? _l : 0), Math.max(0, r.files.length - 1));
                    file = (_m = r.files[at]) !== null && _m !== void 0 ? _m : '';
                    if (!(e.surface === 'terminal')) return [3 /*break*/, 4];
                    _e = null;
                    return [3 /*break*/, 11];
                case 4:
                    if (!RASTER.test(file)) return [3 /*break*/, 6];
                    return [4 /*yield*/, thumbOf($, thumbPath(r, file))];
                case 5:
                    _f = _p.sent();
                    return [3 /*break*/, 10];
                case 6:
                    if (!/\.svg$/i.test(file)) return [3 /*break*/, 8];
                    return [4 /*yield*/, svgOf($, "".concat(reportPath(r), "/").concat(file))];
                case 7:
                    _g = _p.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _g = null;
                    _p.label = 9;
                case 9:
                    _f = _g;
                    _p.label = 10;
                case 10:
                    _e = _f;
                    _p.label = 11;
                case 11:
                    picture = _e;
                    _h = reportShown;
                    _j = [$, uiOf($, e), r, reportText.get(r.id) || 'This result has no text.', kept];
                    return [4 /*yield*/, $.clock.now()];
                case 12: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_h.apply(void 0, _j.concat([_p.sent(), at, picture, e.props.scroll.bodyRows, e.surface === 'terminal' ? { made: [] } : madeOfReport($, r, (_o = reportText.get(r.id)) !== null && _o !== void 0 ? _o : '')]))}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
};
// ---- Tabs the app would leave saying "Nothing to show yet" ----
// The app asks a tab for its drawing once, as it shows it, and again only when told the drawing changed. One ask that comes back
// empty (the chat could not be reached that moment, or the drawing failed) leaves the tab empty until then, and a tab that reads
// nothing that changes, as Stats, About or a result, is never told. So each ask is noted, and a tab open but not asked for since it
// opened, since this code loaded, or since it came in front, is drawn again after 2, 6, 15 and 40 seconds until it is asked for. A
// redraw tells the app to ask every tab it shows, so it reaches one the engine has never drawn as well
var TAB_CHECKS = [2000, 6000, 15000, 40000];
var tabAsked = new Map();
var tabFails = new Map();
var tabInFront = '';
var noteTabAsked = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!id) return [3 /*break*/, 2];
                _b = (_a = tabAsked).set;
                _c = [id];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _b.apply(_a, _c.concat([_d.sent()]));
                _d.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// `since`: how long before now an ask already counts, for a tab seen in front a moment after the app asked for it
var watchTabs = function ($_1, ids_1, why_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, ids_1, why_1], args_1, true), void 0, function ($, ids, why, since) {
        var from, _loop_1, _a, TAB_CHECKS_1, wait;
        var _this = this;
        if (since === void 0) { since = 0; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!ids.length)
                        return [2 /*return*/];
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    from = (_b.sent()) - since;
                    _loop_1 = function (wait) {
                        $.clock.after(wait, function () { return __awaiter(_this, void 0, void 0, function () {
                            var open, _a, empty;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = Set.bind;
                                        return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                                    case 1:
                                        open = new (_a.apply(Set, [void 0, (_b.sent()).map(function (pane) { return pane.id; })]))();
                                        empty = ids.filter(function (id) { var _a; return open.has(id) && ((_a = tabAsked.get(id)) !== null && _a !== void 0 ? _a : 0) < from; });
                                        if (!empty.length)
                                            return [2 /*return*/];
                                        drawAgain($);
                                        if (!(wait === TAB_CHECKS.at(-1))) return [3 /*break*/, 3];
                                        return [4 /*yield*/, log($, "tab ".concat(empty.join(', '), " not asked for in ").concat(wait / 1000, "s after ").concat(why).concat(heldChat ? " in chat ".concat(heldChat) : '', ": drawn again"))];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    for (_a = 0, TAB_CHECKS_1 = TAB_CHECKS; _a < TAB_CHECKS_1.length; _a++) {
                        wait = TAB_CHECKS_1[_a];
                        _loop_1(wait);
                    }
                    return [2 /*return*/];
            }
        });
    });
};
// As this code loads: the tab in front where the engine says which it is, else every tab open (a tab behind the others is never
// asked for, so it costs four redraws and no more)
var watchLoaded = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var panes, shown;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 1:
                panes = _c.sent();
                shown = panes.filter(function (pane) { return pane.isShown; });
                // the tab in front is watched here, not again by the first look each second
                tabInFront = (_b = (_a = shown[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                return [4 /*yield*/, watchTabs($, (shown.length ? shown : panes).map(function (pane) { return pane.id; }), 'this code loaded')];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// Each second: a tab the person brought in front
var watchFront = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var front;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 1:
                front = (_b = (_a = (_c.sent()).find(function (pane) { return pane.isShown; })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                if (front === tabInFront)
                    return [2 /*return*/];
                tabInFront = front;
                if (!front) return [3 /*break*/, 3];
                return [4 /*yield*/, watchTabs($, [front], 'it came in front', 2000)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// A tab whose drawing failed shows why, in place of nothing, and is asked for again in a few seconds: three times a minute at most
var tabFailed = function ($, e, error) { return __awaiter(_this, void 0, void 0, function () {
    var id, now, fails, why, isAgain, _a, Box, Text;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                id = (_b = e.requestId) !== null && _b !== void 0 ? _b : '';
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _f.sent();
                fails = __spreadArray(__spreadArray([], ((_c = tabFails.get(id)) !== null && _c !== void 0 ? _c : []).filter(function (at) { return now - at < 60000; }), true), [now], false);
                tabFails.set(id, fails);
                why = (error === null || error === void 0 ? void 0 : error.kind) === 'timeout' ? 'It took too long.' : ((_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : '').replace(/^\w*Error:\s*/, '') || 'No reason was given.';
                return [4 /*yield*/, log($, "tab ".concat(id, " not drawn (").concat((_e = error === null || error === void 0 ? void 0 : error.kind) !== null && _e !== void 0 ? _e : 'unknown', "): ").concat(why))];
            case 2:
                _f.sent();
                isAgain = fails.length < 3;
                if (!isAgain) return [3 /*break*/, 4];
                return [4 /*yield*/, watchTabs($, [id], 'its drawing failed')];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                _a = uiOf($, e), Box = _a.Box, Text = _a.Text;
                return [2 /*return*/, (<Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>
      <Text bold>Claudopus couldn't show this tab</Text>
      <Text dimColor wrap="wrap">{cut(why, 300)}</Text>
      <Text dimColor wrap="wrap">{isAgain ? 'Claudopus tries again in a few seconds.' : 'It failed three times in a minute. Open it again to try once more.'}</Text>
    </Box>)];
        }
    });
}); };
