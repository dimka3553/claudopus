// The cards: one per piece of background work, its states from start to finish, the panel's open or closed choice, and
// finished work kept and recovered
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
// ---- The to-dos: one per piece of background work, as the panel lists them ----
var started = function (id, parentId, title, words, at, isFork) {
    if (isFork === void 0) { isFork = false; }
    return ({
        id: id,
        parentId: parentId,
        isFork: isFork,
        tokens: 0,
        title: oneLine(title),
        words: words.trim(),
        items: [],
        entries: [],
        answer: '',
        startedAt: at,
        endedAt: 0,
        status: 'working',
    });
};
// Work that ends keeps its ask: what it needs of the person's hands outlives it, and goes only on their answer
var ended = function (one, status, at) { return (__assign(__assign({}, one), { status: status, endedAt: at })); };
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
var resumed = function (one, at) { return (__assign(__assign({}, one), { status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, answeredAt: undefined })); };
// How work that is stopped ends: done when its turn had already ended with its report and only its own background work held it
// (the chat stops such work once its report is in), stopped otherwise
var stoppedAs = function (one) { return (one.answeredAt ? 'done' : 'stopped'); };
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
var handedBack = new Map();
// Work stopped after its report, so ended done just now, keeps that report for good, as work that finished outright does
var keepStoppedReports = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, _a, card;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _loop_1 = function (card) {
                    $.clock.after(5, function () { return void saveReport($, card, card.answer).catch(function (err) { return log($, "report of ".concat(card.id, " not kept: ").concat(String(err))); }); });
                };
                _i = 0;
                return [4 /*yield*/, read($, todos)];
            case 1:
                _a = (_b.sent()).filter(function (one) { return !one.parentId && one.status === 'done' && one.answeredAt && one.endedAt === now && one.answer.trim(); });
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                card = _a[_i];
                _loop_1(card);
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
var byEnd = function (list) { return __spreadArray([], list, true).sort(function (a, b) { return (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0; }); };
// The list is kept short by forgetting work that has ended, the oldest first; work under way, and work still asking, is never forgotten
// Helpers are not counted: each is kept as long as the work it runs under, and goes with it
var capped = function (list) {
    var over = list.filter(function (one) { return !one.parentId; }).length - KEPT;
    var kept = over > 0 ? list.filter(function (one) { return Boolean(one.parentId) || one.status === 'working' || Boolean(one.ask) || (over -= 1) < 0; }) : list;
    var tops = new Set(kept.filter(function (one) { return !one.parentId; }).map(function (one) { return one.id; }));
    var held = kept.some(function (one) { return one.parentId && one.status !== 'working' && !tops.has(topOf(kept, one.id)); }) ? kept.filter(function (one) { return !one.parentId || one.status === 'working' || tops.has(topOf(kept, one.id)); }) : kept;
    // Long work that keeps starting helpers keeps only its newest ended ones; one that still has a helper at work under it stays
    var spent = held.filter(function (one) { return one.parentId && one.status !== 'working' && !held.some(function (kid) { return kid.parentId === one.id && kid.status === 'working'; }); }).sort(function (a, b) { return b.endedAt - a.endedAt; }).slice(HELPERS_KEPT);
    return spent.length ? held.filter(function (one) { return !spent.includes(one); }) : held;
};
var HELPERS_KEPT = 100;
// Stands for the work that started a helper when the engine does not say which it was
var HELPER = 'helper';
// The to-do a piece of work belongs to: its own, or the one of the work that started it
var topOf = function (list, id) {
    var at = id;
    for (var hops = 0; hops < 10; hops += 1) {
        var one = list.find(function (todo) { return todo.id === at; });
        if (!(one === null || one === void 0 ? void 0 : one.parentId))
            return at;
        at = one.parentId;
    }
    return at;
};
// ---- The helpers a piece of work started, and theirs, as a tree under it ----
// What one piece of work started itself, the oldest first
var kidsOf = function (list, id) { return list.filter(function (one) { return one.parentId === id; }).sort(function (a, b) { return a.startedAt - b.startedAt; }); };
// Every helper under a piece of work, however deep
var underOf = function (list, id, depth) {
    if (depth === void 0) { depth = 1; }
    return (depth > TREE_DEEP ? [] : kidsOf(list, id).flatMap(function (one) { return __spreadArray([one], underOf(list, one.id, depth + 1), true); }));
};
var TREE_DEEP = 8;
// The helpers under a piece of work that `keep` picks, each with its own; one that is not picked stays while one under it is
var branchesOf = function (list, id, keep, depth) {
    if (depth === void 0) { depth = 1; }
    return depth > TREE_DEEP ? [] : kidsOf(list, id).map(function (one) { return ({ one: one, kids: branchesOf(list, one.id, keep, depth + 1) }); }).filter(function (b) { return keep(b.one) || b.kids.length > 0; });
};
// The rows in the order they are drawn; `isMore` says a closing row follows the top level's last
var twigsOf = function (branches, isMore, depth, rails) {
    if (isMore === void 0) { isMore = false; }
    if (depth === void 0) { depth = 1; }
    if (rails === void 0) { rails = []; }
    return branches.flatMap(function (b, i) {
        var isLast = i === branches.length - 1 && !isMore;
        return __spreadArray([{ one: b.one, depth: depth, rails: rails, isLast: isLast, hasKids: b.kids.length > 0 }], twigsOf(b.kids, false, depth + 1, __spreadArray(__spreadArray([], rails, true), [!isLast], false)), true);
    });
};
// The lines that join a row to the tree, as text. Each level is two letters wide; a row's own helpers hang from the second
var twigText = function (t) { return "".concat(t.rails.map(function (isOn) { return (isOn ? '│ ' : '  '); }).join('')).concat(t.isLast ? '└─' : '├─').concat(t.hasKids ? '┬─' : '──'); };
// The same lines drawn thin, for a surface that draws, as tall as one line of text: the last row under a parent turns to it in a
// curve, the line ends in a dot in the colour of how the row stands (a ring for the row of those that ended), and a row's own
// helpers hang from that dot. A row at work has a soft ring that grows out of its dot and fades, slowly, again and again
var TWIG_STEP = 18;
var TWIG_ENDED = '#4EBA65';
var TWIG_FAILED = '#E5484D';
var twigWidth = function (t) { return t.rails.length * TWIG_STEP + 36; };
var twigSvg = function (t, line, dot, isMoving) {
    if (isMoving === void 0) { isMoving = false; }
    var mid = line / 2;
    var x = function (level) { return level * TWIG_STEP + 9; };
    var own = x(t.rails.length);
    var at = own + TWIG_STEP;
    var paths = __spreadArray(__spreadArray(__spreadArray([], t.rails.flatMap(function (isOn, level) { return (isOn ? ["M".concat(x(level), " 0V").concat(line)] : []); }), true), [
        t.isLast ? "M".concat(own, " 0V").concat(mid - 5, "Q").concat(own, " ").concat(mid, " ").concat(own + 5, " ").concat(mid, "H").concat(at - 5) : "M".concat(own, " 0V").concat(line, "M").concat(own, " ").concat(mid, "H").concat(at - 5)
    ], false), (t.hasKids ? ["M".concat(at, " ").concat(mid + 5, "V").concat(line)] : []), true);
    var ring = "<circle cx=\"".concat(at, "\" cy=\"").concat(mid, "\" r=\"3.5\" fill=\"").concat(dot, "\" opacity=\"0\"><animate attributeName=\"r\" values=\"3.5;8\" dur=\"2.4s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"0.7;0\" dur=\"2.4s\" repeatCount=\"indefinite\"/></circle>");
    var mark = dot
        ? "".concat(isMoving ? ring : '', "<circle cx=\"").concat(at, "\" cy=\"").concat(mid, "\" r=\"3.5\" fill=\"").concat(dot, "\"/>")
        : "<circle cx=\"".concat(at, "\" cy=\"").concat(mid, "\" r=\"3\" fill=\"none\" stroke=\"#808080\" stroke-width=\"1.5\"/>");
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(twigWidth(t), "\" height=\"").concat(line, "\" viewBox=\"0 0 ").concat(twigWidth(t), " ").concat(line, "\"><path d=\"").concat(paths.join(''), "\" fill=\"none\" stroke=\"#808080\" stroke-opacity=\"0.7\" stroke-width=\"1.5\"/>").concat(mark, "</svg>");
};
// Work the chat's own record was already looked through for
var helpersChecked = new Set();
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
var sync = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var live, now, known, _a, isUnseen, rows, _b, ownCalls, _i, live_1, one;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 1:
                live = _c.sent();
                return [4 /*yield*/, $.clock.now()
                    // Work the mod never saw start (it was running when the mod was installed or renamed) that no loop is said to have started:
                    // the chat's own Agent calls tell a piece of work from a helper whose start the engine did not record
                    // A card taken for a helper that way is looked at again
                ];
            case 2:
                now = _c.sent();
                _a = Map.bind;
                return [4 /*yield*/, read($, todos)];
            case 3:
                known = new (_a.apply(Map, [void 0, (_c.sent()).map(function (one) { return [one.id, one.parentId]; })]))();
                isUnseen = live.some(function (one) { return (!known.has(one.id) || known.get(one.id) === HELPER) && !helpersChecked.has(one.id) && (one.status === 'running' || one.status === 'pending') && !one.parentId && one.type !== 'fork'; });
                if (!isUnseen) return [3 /*break*/, 5];
                return [4 /*yield*/, $.session.messages().catch(function () { return []; })];
            case 4:
                _b = _c.sent();
                return [3 /*break*/, 6];
            case 5:
                _b = [];
                _c.label = 6;
            case 6:
                rows = _b;
                ownCalls = new Set((Array.isArray(rows) ? rows : []).flatMap(function (row) { var _a; return ((_a = row.toolUses) !== null && _a !== void 0 ? _a : []).filter(function (use) { return use.tool === 'Agent'; }).map(function (use) { var _a, _b; return String((_b = (_a = use.input) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : ''); }); }).filter(Boolean));
                // The chat is read once for each such work, not at every look
                if (isUnseen)
                    for (_i = 0, live_1 = live; _i < live_1.length; _i++) {
                        one = live_1[_i];
                        if (!one.parentId)
                            helpersChecked.add(one.id);
                    }
                return [4 /*yield*/, update($, todos, function (list) {
                        var _a;
                        var cards = new Map(list.map(function (one) { return [one.id, one]; }));
                        var isChanged = false;
                        for (var _i = 0, live_2 = live; _i < live_2.length; _i++) {
                            var one = live_2[_i];
                            var card = cards.get(one.id);
                            var next = !card
                                ? // Work held on background work it left running ended its turn: the mod, had it seen that, would have ended its card
                                    one.status === 'running' || one.status === 'pending'
                                        ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
                                            started(one.id, (_a = one.parentId) !== null && _a !== void 0 ? _a : (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
                                        : undefined
                                : card.status === 'working' && (one.status === 'completed' || one.status === 'failed' || one.status === 'killed')
                                    ? ended(card, one.status === 'failed' ? 'failed' : one.status === 'killed' ? stoppedAs(card) : 'done', now)
                                    : // A card listed from the engine alone, for work that is only held and has made no step since: its turn had ended
                                        card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle'
                                            ? ended(card, 'done', now)
                                            : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
                                                ? __assign(__assign({}, card), { parentId: '', title: card.title || oneLine(one.description) }) : !card.title && one.description
                                                ? __assign(__assign({}, card), { title: oneLine(one.description) }) : undefined;
                            if (next)
                                cards.set(one.id, next);
                            isChanged || (isChanged = Boolean(next));
                        }
                        return isChanged ? capped(__spreadArray([], cards.values(), true)) : list;
                    })];
            case 7:
                _c.sent();
                return [4 /*yield*/, keepStoppedReports($, now)];
            case 8:
                _c.sent();
                return [4 /*yield*/, lookEnds($)];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
var change = function ($, agentId, fn) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                if (!!(_a.sent()).some(function (one) { return one.id === agentId; })) return [3 /*break*/, 4];
                return [4 /*yield*/, sync($)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, update($, todos, function (list) {
                    var id = topOf(list, agentId);
                    return list.map(function (one) { return (one.id === id ? fn(one, now) : one); });
                })
                // Work that was running before the panel had ever opened brings it up with its first line
            ];
            case 5:
                _a.sent();
                // Work that was running before the panel had ever opened brings it up with its first line
                return [4 /*yield*/, openList($)];
            case 6:
                // Work that was running before the panel had ever opened brings it up with its first line
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Writes a line into a piece of work's own chat, which it reads at its next step
var tell = function ($, id, text) {
    return $.session.append({ message: { type: 'user', content: [{ type: 'text', text: text }] }, agentId: id }).catch(function (err) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, log($, "work ".concat(id, " not told: ").concat(String(err)))];
            case 1: return [2 /*return*/, void (_a.sent())];
        }
    }); }); });
};
var stop = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var r, now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                if ((_a.sent()).some(function (one) { return one.id === id && one.status === 'working'; }))
                    pressed.add(id);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: id }).catch(function (err) { return ({ deny: String(err) }); })];
            case 2:
                r = _a.sent();
                if (r.deny)
                    return [2 /*return*/, (pressed.delete(id), log($, "work ".concat(id, " not stopped: ").concat(r.deny)))];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _a.sent();
                return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === id && one.status === 'working' ? ended(one, stoppedAs(one), now) : one); }); })];
            case 4:
                _a.sent();
                return [4 /*yield*/, keepStoppedReports($, now)];
            case 5:
                _a.sent();
                return [4 /*yield*/, lookEnds($)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Moves running work to another model: its card names it at once, each step it sends from now on goes to it, and the work is
// told in its own chat, where the panel shows the change as a line of its own
var choose = function ($, id, model) { return __awaiter(_this, void 0, void 0, function () {
    var one, _a, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, update($, view, function (v) { return (__assign(__assign({}, v), { picking: '' })); })];
            case 1:
                _g.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                one = (_g.sent()).find(function (todo) { return todo.id === id; });
                if (!one || one.status !== 'working' || modelName((_f = (_e = one.chosen) !== null && _e !== void 0 ? _e : one.model) !== null && _f !== void 0 ? _f : '') === modelName(model))
                    return [2 /*return*/];
                return [4 /*yield*/, update($, todos, function (list) { return list.map(function (todo) { return (todo.id === id ? __assign(__assign({}, todo), { model: model, chosen: model }) : todo); }); })];
            case 3:
                _g.sent();
                _a = tell;
                _b = [$, id];
                _c = movedTo;
                _d = [modelName(model)];
                return [4 /*yield*/, $.clock.now()];
            case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply(void 0, _d.concat([_g.sent()]))]))];
            case 5:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
var PANEL_EVERY = 2000;
// The choice this chat last followed, as its time and whether it was open; a new load follows it afresh
var panelSeen = '';
var seenOf = function (one) { return "".concat(one.at, ":").concat(one.isOpen); };
var readPanel = function ($) {
    return readOr($, "".concat(dir, "/panel.json"))
        .then(function (text) { return (text ? JSON.parse(text) : undefined); })
        .then(function (one) { return (typeof (one === null || one === void 0 ? void 0 : one.isOpen) === 'boolean' && typeof one.at === 'number' ? one : undefined); })
        .catch(function () { return undefined; });
};
var choosePanel = function ($, isOpen) { return __awaiter(_this, void 0, void 0, function () {
    var at, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = Math).max;
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _c = [_f.sent()];
                return [4 /*yield*/, readPanel($)];
            case 2:
                at = _b.apply(_a, _c.concat([((_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.at) !== null && _e !== void 0 ? _e : 0) + 1]));
                panelSeen = seenOf({ isOpen: isOpen, at: at });
                return [4 /*yield*/, $.fs.write("".concat(dir, "/panel.json"), JSON.stringify({ isOpen: isOpen, at: at })).catch(function (err) { return log($, "panel choice not kept: ".concat(String(err))); })];
            case 3:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// Brings this chat's panel in line with the last choice, once per choice. A pane opened where nothing draws it yet stays open and
// is drawn once a screen that can attaches; an open the engine refused is tried again at the next look
var followPanel = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var choice, isOpen, opened_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, readPanel($)];
            case 1:
                choice = _a.sent();
                if (!choice || seenOf(choice) === panelSeen)
                    return [2 /*return*/, choice];
                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 2:
                isOpen = (_a.sent()).some(function (pane) { return pane.id === LIST; });
                if (!(choice.isOpen && !isOpen)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE }).catch(function (err) { return (log($, "panel not opened with the others: ".concat(String(err))), undefined); })];
            case 3:
                opened_1 = _a.sent();
                if (!opened_1)
                    return [2 /*return*/, choice];
                return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isListOpened: true })); })];
            case 4:
                _a.sent();
                return [4 /*yield*/, update($, paneShown, function () { return true; })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!(!choice.isOpen && isOpen)) return [3 /*break*/, 8];
                return [4 /*yield*/, $.ui.close({ id: LIST }).catch(function () { return undefined; })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                panelSeen = seenOf(choice);
                return [2 /*return*/, choice];
        }
    });
}); };
// The panel opens by itself with a chat's first piece of work; closed, it stays closed until asked for
var openList = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var choice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                if ((_a.sent()).isListOpened)
                    return [2 /*return*/];
                return [4 /*yield*/, readPanel($)];
            case 2:
                choice = _a.sent();
                if (choice && !choice.isOpen)
                    return [2 /*return*/];
                if (!!choice) return [3 /*break*/, 4];
                return [4 /*yield*/, choosePanel($, true)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isListOpened: true })); })];
            case 5:
                _a.sent();
                return [4 /*yield*/, update($, paneShown, function () { return true; })];
            case 6:
                _a.sent();
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE }).catch(function (err) { return log($, "panel not opened: ".concat(String(err))); })];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Keeps the list true while work runs: the engine's list, and the minutes
// Work that has ended, kept on disk for good, one file per chat (finished/<chat id>.json): the Finished list survives a
// reload and a restart of the app. Its chat is the engine's own record of the work, read again when it is opened
var finishedPath = function (chatId) { return "".concat(dir, "/finished/").concat(chatId, ".json"); };
var finishedSaved = '';
var saveFinished = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, all, ended, sign, old, _a, _b, kept;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, me)
                // Its helpers are kept with it, so its Details still lists them after a reload
            ];
            case 1:
                id = (_c.sent()).id;
                return [4 /*yield*/, read($, todos)];
            case 2:
                all = _c.sent();
                ended = all.filter(function (one) { return one.status !== 'working' && (!one.parentId || all.some(function (top) { return top.id === topOf(all, one.id) && !top.parentId && top.status !== 'working'; })); });
                sign = ended.map(function (one) { return [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title].join(':'); }).join(',');
                if (!id || !dir || !ended.length || sign === finishedSaved)
                    return [2 /*return*/];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, finishedPath(id))];
            case 3:
                old = _b.apply(_a, [(_c.sent()) || '[]']);
                kept = capped(__spreadArray(__spreadArray([], old.filter(function (one) { return !ended.some(function (card) { return card.id === one.id; }); }), true), ended, true).sort(function (a, b) { return a.endedAt - b.endedAt; }));
                return [4 /*yield*/, $.fs.write("".concat(dir, "/finished/").concat(id, ".json"), JSON.stringify(kept))];
            case 4:
                _c.sent();
                finishedSaved = sign;
                return [2 /*return*/];
        }
    });
}); };
// Work that ended before the mod kept it (before a rename, or before this list was kept) is read back from the app's own record
// of this chat's agents: its times, model, size, its to-dos and its last line about itself, from its saved transcript. Only work
// the chat's own thread started; what the person's words were for it is not recovered
var isBare = function (card) { return card.status !== 'working' && card.endedAt === card.startedAt && !card.model; };
var recoverEnded = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, list, live, home, folder, ids, metas, fresh, found, _loop_2, _i, fresh_1, _a, agentId, meta;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_v.sent()).id;
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _v.sent();
                if (!id)
                    return [2 /*return*/];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 3:
                live = _v.sent();
                return [4 /*yield*/, $.env.get('HOME')];
            case 4:
                home = (_b = (_v.sent())) !== null && _b !== void 0 ? _b : '';
                folder = "".concat(home, "/.claude/projects/").concat(cwd.replace(/[^a-zA-Z0-9]/g, '-'), "/").concat(id, "/subagents");
                return [4 /*yield*/, $.fs.list(folder).catch(function () { return []; })];
            case 5:
                ids = (_v.sent()).map(function (entry) { var _a, _b; return (_b = (_a = /^agent-(\w+)\.meta\.json$/.exec(entry.name)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''; }).filter(Boolean);
                return [4 /*yield*/, Promise.all(ids.map(function (one) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        var _c;
                        var _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _c = {
                                        one: one
                                    };
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, readOr($, "".concat(folder, "/agent-").concat(one, ".meta.json"))];
                                case 1:
                                    _c.meta = _b.apply(_a, [(_f.sent()) || '{}']);
                                    return [4 /*yield*/, $.fs.stat("".concat(folder, "/agent-").concat(one, ".jsonl")).catch(function () { return undefined; })];
                                case 2: return [2 /*return*/, (_c.at = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.mtimeMs) !== null && _e !== void 0 ? _e : 0,
                                        _c)];
                            }
                        });
                    }); }))
                    // The newest few, so a chat with a long past is read once and never again: what is read back is kept with the rest
                ];
            case 6:
                metas = _v.sent();
                fresh = metas
                    .filter(function (_a) {
                    var meta = _a.meta;
                    return meta.spawnDepth === 1;
                })
                    .sort(function (a, b) { return b.at - a.at; })
                    .slice(0, KEPT)
                    .filter(function (_a) {
                    var one = _a.one;
                    return !list.some(function (card) { return card.id === one && !isBare(card); }) && !live.some(function (agent) { return agent.id === one && WORKING.includes(agent.status); });
                });
                if (!fresh.length)
                    return [2 /*return*/];
                found = [];
                _loop_2 = function (agentId, meta) {
                    var mtime, path, text, _w, _x, engine, one, first, last, model, tokens, items, entries, _loop_3, _y, _z, row, status_1, err_1;
                    return __generator(this, function (_0) {
                        switch (_0.label) {
                            case 0:
                                _0.trys.push([0, 6, , 8]);
                                return [4 /*yield*/, $.fs.stat("".concat(folder, "/agent-").concat(agentId, ".jsonl")).catch(function () { return undefined; })];
                            case 1:
                                mtime = (_d = (_c = (_0.sent())) === null || _c === void 0 ? void 0 : _c.mtimeMs) !== null && _d !== void 0 ? _d : 0;
                                path = "".concat(folder, "/agent-").concat(agentId, ".jsonl");
                                return [4 /*yield*/, readOr($, path)];
                            case 2:
                                _w = (_0.sent());
                                if (_w) return [3 /*break*/, 5];
                                return [4 /*yield*/, $.process.run(['head', '-n', '1', path]).catch(function () { return undefined; })];
                            case 3:
                                _x = [
                                    (_f = (_e = (_0.sent())) === null || _e === void 0 ? void 0 : _e.stdout) !== null && _f !== void 0 ? _f : ''
                                ];
                                return [4 /*yield*/, $.process.run(['tail', '-c', '3000000', path]).catch(function () { return undefined; })];
                            case 4:
                                _w = _x.concat([
                                    ((_h = (_g = (_0.sent())) === null || _g === void 0 ? void 0 : _g.stdout) !== null && _h !== void 0 ? _h : '').split('\n').slice(1).join('\n')
                                ]).join('\n');
                                _0.label = 5;
                            case 5:
                                text = _w;
                                engine = live.find(function (agent) { return agent.id === agentId; });
                                one = { id: agentId, description: (_j = meta.description) !== null && _j !== void 0 ? _j : '', type: (_k = meta.agentType) !== null && _k !== void 0 ? _k : '', status: (_l = engine === null || engine === void 0 ? void 0 : engine.status) !== null && _l !== void 0 ? _l : (meta.finished ? 'completed' : 'killed') };
                                first = 0;
                                last = 0;
                                model = '';
                                tokens = 0;
                                items = [];
                                entries = [];
                                _loop_3 = function (row) {
                                    var o = (function () {
                                        try {
                                            return JSON.parse(row);
                                        }
                                        catch (_a) {
                                            return undefined;
                                        }
                                    })();
                                    var at = (o === null || o === void 0 ? void 0 : o.timestamp) ? Date.parse(o.timestamp) : 0;
                                    if (!o || !at)
                                        return "continue";
                                    first || (first = at);
                                    last = at;
                                    if (o.type !== 'assistant')
                                        return "continue";
                                    model = ((_m = o.message) === null || _m === void 0 ? void 0 : _m.model) || model;
                                    var u = (_o = o.message) === null || _o === void 0 ? void 0 : _o.usage;
                                    if (u)
                                        tokens = ((_p = u.input_tokens) !== null && _p !== void 0 ? _p : 0) + ((_q = u.cache_read_input_tokens) !== null && _q !== void 0 ? _q : 0) + ((_r = u.cache_creation_input_tokens) !== null && _r !== void 0 ? _r : 0) + ((_s = u.output_tokens) !== null && _s !== void 0 ? _s : 0);
                                    var _loop_4 = function (block) {
                                        if (block.type !== 'tool_use' || !block.name)
                                            return "continue";
                                        var input = (_u = block.input) !== null && _u !== void 0 ? _u : {};
                                        if (isTool(block.name, 'note') && typeof input.text === 'string')
                                            entries.push({ at: at, kind: 'note', text: oneLine(input.text).slice(0, NOTE_CHARS) });
                                        if (isTool(block.name, 'todo') && typeof input.item === 'string') {
                                            var text_1 = oneLine(input.item).slice(0, 200);
                                            var state_1 = ['open', 'doing', 'done', 'dropped'].find(function (s) { return s === input.state; });
                                            var old_1 = slug(typeof input.was === 'string' && input.was.trim() ? input.was : text_1);
                                            items = items.some(function (item) { return slug(item.text) === old_1; }) ? items.map(function (item) { return (slug(item.text) === old_1 ? { text: text_1, state: state_1 !== null && state_1 !== void 0 ? state_1 : item.state } : item); }) : __spreadArray(__spreadArray([], items, true), [{ text: text_1, state: state_1 !== null && state_1 !== void 0 ? state_1 : 'open' }], false);
                                        }
                                    };
                                    for (var _1 = 0, _2 = Array.isArray((_t = o.message) === null || _t === void 0 ? void 0 : _t.content) ? o.message.content : []; _1 < _2.length; _1++) {
                                        var block = _2[_1];
                                        _loop_4(block);
                                    }
                                };
                                for (_y = 0, _z = text.split('\n'); _y < _z.length; _y++) {
                                    row = _z[_y];
                                    _loop_3(row);
                                }
                                status_1 = one.status === 'failed' ? 'failed' : one.status === 'killed' ? 'stopped' : 'done';
                                found.push(__assign(__assign({}, started(one.id, '', one.description, '', first || mtime, one.type === 'fork')), { status: status_1, endedAt: last || mtime, model: model, tokens: tokens, items: items, entries: entries.slice(-ENTRIES_KEPT) }));
                                return [3 /*break*/, 8];
                            case 6:
                                err_1 = _0.sent();
                                return [4 /*yield*/, log($, "ended work ".concat(agentId, " not read back: ").concat(String(err_1)))];
                            case 7:
                                _0.sent();
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, fresh_1 = fresh;
                _v.label = 7;
            case 7:
                if (!(_i < fresh_1.length)) return [3 /*break*/, 10];
                _a = fresh_1[_i], agentId = _a.one, meta = _a.meta;
                return [5 /*yield**/, _loop_2(agentId, meta)];
            case 8:
                _v.sent();
                _v.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                if (!found.length) return [3 /*break*/, 12];
                return [4 /*yield*/, update($, todos, function (now) { return capped(byEnd(__spreadArray(__spreadArray([], found.filter(function (one) { return !now.some(function (card) { return card.id === one.id && !isBare(card); }); }), true), now.filter(function (card) { return !(isBare(card) && found.some(function (one) { return one.id === card.id; })); }), true))); })];
            case 11:
                _v.sent();
                _v.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); };
// What was kept comes back into the list when the chat loads, below anything the list already holds
var loadFinished = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, kept, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_c.sent()).id;
                if (!id)
                    return [2 /*return*/];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, finishedPath(id))];
            case 2:
                kept = _b.apply(_a, [(_c.sent()) || '[]']);
                if (!Array.isArray(kept) || !kept.length)
                    return [2 /*return*/];
                return [4 /*yield*/, update($, todos, function (list) {
                        var fresh = kept.filter(function (one) { return one.id && one.status !== 'working' && !list.some(function (card) { return card.id === one.id; }); });
                        return fresh.length ? capped(byEnd(__spreadArray(__spreadArray([], fresh, true), list, true))) : list;
                    })];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var follow = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var isShown, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, sync($)];
            case 1:
                _b.sent();
                return [4 /*yield*/, saveFinished($).catch(function (err) { return log($, "finished work not kept: ".concat(String(err))); })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 3:
                isShown = (_b.sent()).some(function (pane) { return pane.id === LIST; });
                _a = isShown;
                return [4 /*yield*/, read($, paneShown)];
            case 4:
                if (!(_a !== (_b.sent()))) return [3 /*break*/, 6];
                return [4 /*yield*/, update($, paneShown, function () { return isShown; })
                    // Reports another chat kept since are listed here too
                ];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: 
            // Reports another chat kept since are listed here too
            return [4 /*yield*/, loadReports($).catch(function () { return undefined; })];
            case 7:
                // Reports another chat kept since are listed here too
                _b.sent();
                return [4 /*yield*/, read($, todos)];
            case 8:
                if (!(_b.sent()).some(function (one) { return !one.parentId && one.status === 'working'; })) return [3 /*break*/, 10];
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
// A message as the panel quotes it: whole when short, else its first sentences
var quoted = function (text, most) {
    // The app wraps a pasted message in a tag of its own, which is no part of what the person said
    var flat = oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' '));
    if (flat.length <= most)
        return flat;
    var head = flat.slice(0, most);
    var end = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '));
    return end > most / 3 ? "".concat(head.slice(0, end + 1), " \u2026") : "".concat(head.slice(0, head.lastIndexOf(' ')), " \u2026");
};
// A line cut to what a small card has room for, at the end of a word
var cut = function (text, most) {
    var end = text.lastIndexOf(' ', most);
    return text.length <= most ? text : "".concat(text.slice(0, end > most / 2 ? end : most), " \u2026");
};
// Each web address in a text as a link to press, the rest as it stands: only an address whole in `whole` is linked, so one a
// small card cut short is never a link to half an address
var URL_IN = /https?:\/\/[^\s<>()"'`…]*[^\s<>()"'`….,;:!?]/g;
var withLinks = function (Link, text, key, whole) {
    var _a, _b, _c;
    if (whole === void 0) { whole = text; }
    var full = new Set((_a = whole.match(URL_IN)) !== null && _a !== void 0 ? _a : []);
    var parts = [];
    var at = 0;
    for (var _i = 0, _d = text.matchAll(URL_IN); _i < _d.length; _i++) {
        var m = _d[_i];
        var end = ((_b = m.index) !== null && _b !== void 0 ? _b : 0) + m[0].length;
        if (!full.has(m[0]) || /[^\s<>()"'`.,;:!?]/.test((_c = text[end]) !== null && _c !== void 0 ? _c : ' '))
            continue;
        parts.push(text.slice(at, m.index), <Link key={"".concat(key, "-").concat(parts.length)} href={m[0]}/>);
        at = end;
    }
    parts.push(text.slice(at));
    return parts.filter(function (part) { return part !== ''; });
};
