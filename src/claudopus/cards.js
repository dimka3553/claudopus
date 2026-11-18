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
// What it kept of its own background work goes with it: started again, it keeps what it starts from then
// What the person allowed it under "Ask once per piece of work" ends with it
// A reply its ask was held with has been acted on once the run it started ends: the ask waits on the person again, every answer back
// (what the person allowed it goes once the change that ends it is kept, and not when holdDone keeps it at work)
var ended = function (one, status, at) { var _a, _b, _c, _d; return (__assign(__assign(__assign(__assign({}, one), (((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied) === null || _b === void 0 ? void 0 : _b.isWaking) ? { ask: __assign(__assign({}, one.ask), { replied: { text: one.ask.replied.text, at: one.ask.replied.at } }) } : {})), { status: status, endedAt: at, bg: undefined, leftOwn: status === 'done' && ((_c = one.bg) === null || _c === void 0 ? void 0 : _c.some(function (b) { return !b.isWatch && !isServerRun(b.cmd, b.what); })) ? true : undefined, releasing: status === 'done' && ((_d = one.bg) === null || _d === void 0 ? void 0 : _d.some(function (b) { return isReleaseRun(b.cmd); })) ? { at: at, branch: '', by: 'task' } : one.releasing, waitsSince: undefined }), (status === 'done' ? {} : { wakeWhen: undefined, waitsSet: undefined }))); };
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
var resumed = function (one, at) { var _a, _b, _c, _d, _e; return (__assign(__assign({}, one), { carryOn: ((_a = one.carryOn) === null || _a === void 0 ? void 0 : _a.gaveUp) || one.status === 'done' ? undefined : one.carryOn, byYou: undefined, begunAt: (_b = one.begunAt) !== null && _b !== void 0 ? _b : one.startedAt, ask: ((_d = (_c = one.ask) === null || _c === void 0 ? void 0 : _c.replied) === null || _d === void 0 ? void 0 : _d.isWaking) ? __assign(__assign({}, one.ask), { replied: { text: one.ask.replied.text, at: one.ask.replied.at } }) : one.ask, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, answeredAt: undefined, handedBackAt: undefined, reportAt: undefined, leftSince: undefined, leftOwn: undefined, releasing: ((_e = one.releasing) === null || _e === void 0 ? void 0 : _e.by) === 'task' ? undefined : one.releasing, released: undefined, doneSeen: undefined, stuckAt: undefined, waitsSince: undefined, helperWait: undefined, ownWait: undefined, mayHandBack: undefined, endedStepAt: undefined, stuckTold: undefined, notDone: undefined, closedAt: undefined, newAt: at })); };
// Work that ended a turn while a command it started in the background itself, or a helper of its, still runs, and has not finished:
// a to-do of its is still being done. It is still at work; an answer it handed back on the way is no report. A watch it set is no
// such command: it may run until stopped
var goesOn = function (list, id) {
    var _a;
    var one = list.find(function (card) { return card.id === id; });
    var isRunning = Boolean((_a = one === null || one === void 0 ? void 0 : one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch; })) || list.some(function (kid) { return kid.parentId === id && kid.status === 'working'; });
    return Boolean(one && isRunning && one.items.some(function (item) { return item.state === 'doing'; }));
};
// How work that is stopped ends: done when Claudopus had already received its report and only its own background work held it
// (the chat stops such work once its report is in), stopped otherwise
var stoppedAs = function (one) { return (hasReport(one) ? 'done' : 'stopped'); };
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
var handedBack = new Map();
// Work whose card a handback ended, until it works again: a turn of words alone that what it left running wakes changes nothing
var endedByHandback = new Set();
// Work stopped by the chat or the panel: whatever the engine still lists of it is going, so it is never said to have left something running
var stoppedHere = new Set();
// Work the person stopped, by what it left running detached, until the chat has been told of the stop
var stopLeft = new Map();
// Held stopped by the person: stopped with their own press, and no message of theirs has come since
var isHeld = function (one) { return Boolean((one === null || one === void 0 ? void 0 : one.byYou) && !one.byYou.isLifted); };
// The words a task is named by, to know the same work started afresh under another title
var taskWords = function (text) { var _a; return new Set(((_a = text.toLowerCase().match(/[a-z0-9]+/g)) !== null && _a !== void 0 ? _a : []).filter(function (word) { return word.length > 2 && !['the', 'and', 'for', 'with', 'from', 'that', 'this'].includes(word); })); };
var isSameTask = function (held, title, prompt) {
    var a = taskWords(held.title);
    var b = taskWords(title);
    var shared = __spreadArray([], a, true).filter(function (word) { return b.has(word); }).length;
    // Only the same few words count: titles that share most words can still be other work
    var isNamed = a.size > 0 && shared === a.size && shared === b.size;
    // A brief that carries the message the stopped work was started for is that work again
    var words = held.words.trim();
    var isQuoted = words.length >= 12 && prompt.replace(/\s+/g, ' ').includes(words.replace(/\s+/g, ' ').slice(0, 200));
    return isNamed || isQuoted || prompt.includes(held.id);
};
// A start or a message that would set work the person stopped going again: the stopped work it would wake, or undefined
// `resume` is the agent it resumes or messages; `parent` the work that starts it, '' for the chat
var heldFor = function (list, parent, resume, title, prompt) {
    return resume
        ? // By its id, the start of its id, or its title, as SendMessage takes any of them
            list.find(function (one) { return isHeld(one) && (one.id === resume || (resume.length >= 6 && one.id.startsWith(resume)) || oneLine(one.title).toLowerCase() === oneLine(resume).toLowerCase()); })
        : list.find(function (one) { return isHeld(one) && (one.parentId || '') === parent && isSameTask(one, title, prompt); });
};
// Work that ended with nothing of its own running that the mod or the engine's stop knew of: the engine still listing it as held
// (once, for a whole evening, on nothing any tool showed open) is no sign it left something running
var leftNothing = new Set();
// Nothing of its own runs: no command or watch it started that has not ended, no detached run it is followed on, no helper at work. The engine's list of what is in
// flight as work stops is the whole session's, every other work's too, so it says nothing of this work's own (what it lists that
// this work started is let go of from its card as it ends, at its stop)
var ownsNothing = function (list, id) { var _a, _b, _c, _d; return !((_b = (_a = list.find(function (one) { return one.id === id; })) === null || _a === void 0 ? void 0 : _a.bg) === null || _b === void 0 ? void 0 : _b.length) && !((_d = (_c = list.find(function (one) { return one.id === id; })) === null || _c === void 0 ? void 0 : _c.detached) === null || _d === void 0 ? void 0 : _d.length) && !list.some(function (kid) { return kid.parentId === id && kid.status === 'working'; }); };
// What a task still has to do: its to-dos neither done nor dropped
var openItems = function (one) { var _a; return ((_a = one === null || one === void 0 ? void 0 : one.items) !== null && _a !== void 0 ? _a : []).filter(function (item) { return item.state === 'open' || item.state === 'doing'; }); };
// Words at a step's end are its result only when it handed them back, or wrote them as long as a report with every to-do done: a
// long word of how far it has got, with to-dos still to do, is no result (18 Nov: a task's progress note kept as its result while
// 5 of its 7 to-dos were still to do, its card ended and nothing started it again for three and a half hours)
var isWordsReport = function (one, answer, isHandback) {
    if (isHandback === void 0) { isHandback = false; }
    return isHandback || (answer.trim().length >= REPORT_LEAST && !openItems(one).length);
};
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
        return __spreadArray([__assign(__assign({ one: b.one }, (b.job ? { job: b.job } : {})), { depth: depth, rails: rails, isLast: isLast, hasKids: b.kids.length > 0 })], twigsOf(b.kids, false, depth + 1, __spreadArray(__spreadArray([], rails, true), [!isLast], false)), true);
    });
};
// The lines that join a row to the tree, as text. Each level is two letters wide; a row's own helpers hang from the second
// and as text carried down past a row, as wide as its lines and mark, for each line of its own under it
var railText = function (t) { return "".concat(t.rails.map(function (isOn) { return (isOn ? '│ ' : '  '); }).join('')).concat(t.isLast ? '  ' : '│ ').concat(t.hasKids ? '│ ' : '  ', " "); };
var twigText = function (t) { return "".concat(t.rails.map(function (isOn) { return (isOn ? '│ ' : '  '); }).join('')).concat(t.isLast ? '└─' : '├─').concat(t.hasKids ? '┬─' : '──'); };
// The same lines drawn thin, for a surface that draws, as tall as one line of text: the last row under a parent turns to it in a
// curve, the line ends in a dot in the colour of how the row stands (a ring for the row of those that ended), and a row's own
// helpers hang from that dot. A row at work has a soft ring that grows out of its dot and fades, slowly, again and again
var TWIG_STEP = 18;
var TWIG_ENDED = '#4EBA65';
var TWIG_FAILED = '#E5484D';
var twigWidth = function (t) { return t.rails.length * TWIG_STEP + 36; };
var twigSvg = function (t, line, dot, isMoving, shape) {
    if (isMoving === void 0) { isMoving = false; }
    if (shape === void 0) { shape = 'circle'; }
    var mid = line / 2;
    var x = function (level) { return level * TWIG_STEP + 9; };
    var own = x(t.rails.length);
    var at = own + TWIG_STEP;
    var paths = __spreadArray(__spreadArray(__spreadArray([], t.rails.flatMap(function (isOn, level) { return (isOn ? ["M".concat(x(level), " 0V").concat(line)] : []); }), true), [
        t.isLast ? "M".concat(own, " 0V").concat(mid - 5, "Q").concat(own, " ").concat(mid, " ").concat(own + 5, " ").concat(mid, "H").concat(at - 5) : "M".concat(own, " 0V").concat(line, "M").concat(own, " ").concat(mid, "H").concat(at - 5)
    ], false), (t.hasKids ? ["M".concat(at, " ").concat(mid + 5, "V").concat(line)] : []), true);
    var ring = "<circle cx=\"".concat(at, "\" cy=\"").concat(mid, "\" r=\"3.5\" fill=\"").concat(dot, "\" opacity=\"0\"><animate attributeName=\"r\" values=\"3.5;8\" dur=\"2.4s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"0.7;0\" dur=\"2.4s\" repeatCount=\"indefinite\"/></circle>");
    // A job's mark is its own shape, so only a helper has a round dot
    var shaped = {
        circle: "<circle cx=\"".concat(at, "\" cy=\"").concat(mid, "\" r=\"3.5\" fill=\"").concat(dot, "\"/>"),
        square: "<rect x=\"".concat(at - 3.5, "\" y=\"").concat(mid - 3.5, "\" width=\"7\" height=\"7\" rx=\"1\" fill=\"").concat(dot, "\"/>"),
        diamond: "<path d=\"M".concat(at, " ").concat(mid - 4.5, "L").concat(at + 4.5, " ").concat(mid, "L").concat(at, " ").concat(mid + 4.5, "L").concat(at - 4.5, " ").concat(mid, "Z\" fill=\"").concat(dot, "\"/>"),
        down: "<path d=\"M".concat(at - 4.5, " ").concat(mid - 3.5, "H").concat(at + 4.5, "L").concat(at, " ").concat(mid + 4, "Z\" fill=\"").concat(dot, "\"/>"),
        open: "<path d=\"M".concat(at, " ").concat(mid - 4, "L").concat(at + 4, " ").concat(mid, "L").concat(at, " ").concat(mid + 4, "L").concat(at - 4, " ").concat(mid, "Z\" fill=\"none\" stroke=\"").concat(dot, "\" stroke-width=\"1.5\"/>"),
    }[shape];
    var mark = dot
        ? "".concat(isMoving ? ring : '').concat(shaped)
        : "<circle cx=\"".concat(at, "\" cy=\"").concat(mid, "\" r=\"3\" fill=\"none\" stroke=\"#808080\" stroke-width=\"1.5\"/>");
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(twigWidth(t), "\" height=\"").concat(line, "\" viewBox=\"0 0 ").concat(twigWidth(t), " ").concat(line, "\"><path d=\"").concat(paths.join(''), "\" fill=\"none\" stroke=\"#808080\" stroke-opacity=\"0.7\" stroke-width=\"1.5\"/>").concat(mark, "</svg>");
};
// The same tree's lines carried down past a row, for each line of its own under it: the levels above that go on, its own line when
// rows under the same parent follow, and the line from its dot down to its own rows when it has them (17 Nov that one stopped at
// a helper's second line, so its commands hung from nothing)
var railSvg = function (t, line) {
    var x = function (level) { return level * TWIG_STEP + 9; };
    var paths = __spreadArray(__spreadArray(__spreadArray([], t.rails.flatMap(function (isOn, level) { return (isOn ? ["M".concat(x(level), " 0V").concat(line)] : []); }), true), (t.isLast ? [] : ["M".concat(x(t.rails.length), " 0V").concat(line)]), true), (t.hasKids ? ["M".concat(x(t.rails.length + 1), " 0V").concat(line)] : []), true);
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(twigWidth(t), "\" height=\"").concat(line, "\" viewBox=\"0 0 ").concat(twigWidth(t), " ").concat(line, "\"><path d=\"").concat(paths.join('') || 'M0 0', "\" fill=\"none\" stroke=\"#808080\" stroke-opacity=\"0.7\" stroke-width=\"1.5\"/></svg>");
};
// Work the chat's own record was already looked through for
var helpersChecked = new Set();
// The engine's own list is the truth: work it runs is listed, and work that failed or was stopped ends no turn
var sync = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var listed, live, now, known, _a, isUnseen, rows, _b, ownCalls, _i, live_1, one, unheardEnds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.agent.list().catch(function () { return undefined; })];
            case 1:
                listed = _c.sent();
                live = listed !== null && listed !== void 0 ? listed : [];
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
                if (isUnseen)
                    during('read the chat for its tasks');
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
                unheardEnds = new Set();
                return [4 /*yield*/, changeTodos($, function (list) {
                        var _a, _b, _c, _d, _e;
                        unheardEnds.clear();
                        var cards = new Map(list.map(function (one) { return [one.id, one]; }));
                        var isChanged = false;
                        var _loop_2 = function (one) {
                            var card = cards.get(one.id);
                            var next = !card
                                ? // Work held on background work it left running ended its turn: the mod, had it seen that, would have ended its card
                                    one.status === 'running' || one.status === 'pending'
                                        ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
                                            started(one.id, (_a = one.parentId) !== null && _a !== void 0 ? _a : (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
                                        : undefined
                                : // Work that ended its step to let its helpers work, or for what it asked Claudopus to look for, is still at work: the engine
                                    // lists it as completed, but a helper's result or the thing it waits for starts it again (16 Nov its card vanished meanwhile)
                                    card.status === 'working' && one.status === 'completed' && !handedBack.has(card.id) && card.handedBackAt === undefined && (card.wakeWhen !== undefined || isTurnWaited(list, card.id) || list.some(function (kid) { return kid.parentId === card.id && kid.status === 'working'; }))
                                        ? undefined
                                        : // A task Claudopus starts again to carry on is left to that
                                            card.status === 'working' && card.carryOn && !card.carryOn.gaveUp && card.endedStepAt === card.carryOn.at && (one.status === 'completed' || one.status === 'failed' || one.status === 'idle')
                                                ? undefined
                                                : // A task whose end the mod did not hear may have stopped partway: its last words are read first (below)
                                                    card.status === 'working' && one.status !== 'killed' && (one.status === 'completed' || one.status === 'failed') && !turnEnding.has(card.id) && card.wakeWhen === undefined && !isTurnWaited(list, card.id) && isStoppedShort(card, '') && !carryTaken.has(carryKey(card)) && ownsNothing(list, card.id)
                                                        ? ((unheardEnds.add(card.id)), undefined)
                                                        : card.status === 'working' && (one.status === 'completed' || one.status === 'failed' || one.status === 'killed')
                                                            ? ended(card, one.status === 'failed' ? 'failed' : one.status === 'killed' ? stoppedAs(card) : 'done', now)
                                                            : // A card listed from the engine alone, for work that is only held and has made no step since: its turn had ended
                                                                card.status === 'working' && !card.steps && !card.entries.length && !card.words && one.status === 'idle' && !cutPending.has(card.id)
                                                                    ? ended(card, 'done', now)
                                                                    : // Work that handed in its report with a command of its own left in the background (or its release runner there) is done
                                                                        // once the engine no longer holds it for that, from then, its green moment with it when Claudopus saw it held
                                                                        !card.parentId && card.status === 'done' && (card.leftOwn || ((_b = card.releasing) === null || _b === void 0 ? void 0 : _b.by) === 'task') && (one.status === 'completed' || one.status === 'failed' || one.status === 'killed' || stoppedHere.has(card.id) || leftNothing.has(card.id))
                                                                            ? __assign(__assign(__assign({}, card), { leftSince: undefined, leftOwn: undefined, releasing: ((_c = card.releasing) === null || _c === void 0 ? void 0 : _c.by) === 'task' ? undefined : card.releasing }), (card.leftSince ? { endedAt: now } : {})) : // Work that handed in its report and that the engine still holds on its own background work left something running;
                                                                            // once nothing does, or it was stopped, not
                                                                            !card.parentId && card.status === 'done' && (one.status === 'waiting' && endedByHandback.has(card.id) && !stoppedHere.has(card.id) && !leftNothing.has(card.id)) !== Boolean(card.leftSince)
                                                                                ? __assign(__assign({}, card), { leftSince: card.leftSince ? undefined : now }) : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
                                                                                ? __assign(__assign({}, card), { parentId: '', title: card.title || oneLine(one.description) }) : !card.title && one.description
                                                                                ? __assign(__assign({}, card), { title: oneLine(one.description) }) : undefined;
                            if (next)
                                cards.set(one.id, next);
                            isChanged || (isChanged = Boolean(next));
                        };
                        for (var _i = 0, live_2 = live; _i < live_2.length; _i++) {
                            var one = live_2[_i];
                            _loop_2(one);
                        }
                        var _loop_3 = function (card) {
                            if (listed && (card.leftSince || card.leftOwn || ((_d = card.releasing) === null || _d === void 0 ? void 0 : _d.by) === 'task') && !live.some(function (one) { return one.id === card.id; }))
                                ((isChanged = true), cards.set(card.id, __assign(__assign({}, card), { leftSince: undefined, leftOwn: undefined, releasing: ((_e = card.releasing) === null || _e === void 0 ? void 0 : _e.by) === 'task' ? undefined : card.releasing })));
                        };
                        // Finished work the engine no longer lists has nothing of its own left running
                        for (var _f = 0, _g = cards.values(); _f < _g.length; _f++) {
                            var card = _g[_f];
                            _loop_3(card);
                        }
                        return isChanged ? capped(__spreadArray([], cards.values(), true)) : list;
                    })];
            case 7:
                _c.sent();
                return [4 /*yield*/, carryDue($, now).catch(function (err) { return log($, "carry-on notes not looked at: ".concat(String(err))); })];
            case 8:
                _c.sent();
                if (!unheardEnds.size) return [3 /*break*/, 10];
                return [4 /*yield*/, endedUnheardShort($, unheardEnds, live, now).catch(function (err) { return log($, "ends not heard not looked at: ".concat(String(err))); })];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                if (!listed) return [3 /*break*/, 12];
                return [4 /*yield*/, endUnheard($, live, now).catch(function (err) { return log($, "work that ended unheard not looked for: ".concat(String(err))); })
                    // A go-ahead pressed during a turn whose end only the engine's list showed does its last step now
                ];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12: 
            // A go-ahead pressed during a turn whose end only the engine's list showed does its last step now
            return [4 /*yield*/, stepsAtEnd($).catch(function (err) { return log($, "last step not done: ".concat(String(err))); })
                // A command run on the person's press that a reload left running is followed again by this load
            ];
            case 13:
                // A go-ahead pressed during a turn whose end only the engine's list showed does its last step now
                _c.sent();
                // A command run on the person's press that a reload left running is followed again by this load
                return [4 /*yield*/, followRuns($).catch(function (err) { return log($, "commands run on a press not followed: ".concat(String(err))); })];
            case 14:
                // A command run on the person's press that a reload left running is followed again by this load
                _c.sent();
                return [4 /*yield*/, keepStoppedReports($, now)];
            case 15:
                _c.sent();
                return [4 /*yield*/, lookEnds($)];
            case 16:
                _c.sent();
                return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept for the keeper: ".concat(String(err))); })];
            case 17:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// Tasks the engine lists as ended whose end the mod did not hear (it was reloading): one whose last words are no result is started
// again to carry on, any other ends as the engine says, with its last words
var endedUnheardShort = function ($, ids, live, now) { return __awaiter(_this, void 0, void 0, function () {
    var chat, folder, _a, _loop_4, _i, ids_1, id;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                chat = (_c.sent()).id;
                if (!chat) return [3 /*break*/, 3];
                return [4 /*yield*/, agentsFolder($, chat)];
            case 2:
                _a = _c.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = '';
                _c.label = 4;
            case 4:
                folder = _a;
                _loop_4 = function (id) {
                    var card, f, _d, isReport, how;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                card = (_e.sent()).find(function (one) { return one.id === id; });
                                if (!card || card.status !== 'working' || carryTaken.has(carryKey(card)))
                                    return [2 /*return*/, "continue"];
                                if (!folder) return [3 /*break*/, 3];
                                return [4 /*yield*/, lastWordsOf($, folder, id, now)];
                            case 2:
                                _d = _e.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _d = { at: now, answer: '', isReport: false, isHandback: false, isPressed: false };
                                _e.label = 4;
                            case 4:
                                f = _d;
                                isReport = isWordsReport(card, f.answer, f.isHandback);
                                if (!(!isReport && (f.isPressed || isLetEnd(card)) && isStoppedShort(card, f.answer))) return [3 /*break*/, 6];
                                return [4 /*yield*/, goOn($, id, 'its step ended while Claudopus was away')];
                            case 5:
                                _e.sent();
                                return [2 /*return*/, "continue"];
                            case 6:
                                how = ((_b = live.find(function (one) { return one.id === id; })) === null || _b === void 0 ? void 0 : _b.status) === 'failed' ? 'failed' : 'done';
                                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { var _a, _b; return (one.id === id && one.status === 'working' ? __assign(__assign(__assign(__assign({}, ended(one, how, now)), { answer: f.answer || one.answer }), (isReport ? { answeredAt: (_a = one.answeredAt) !== null && _a !== void 0 ? _a : now } : {})), (f.isHandback || (isReport && !f.isPressed) ? { reportAt: (_b = one.reportAt) !== null && _b !== void 0 ? _b : now } : {})) : one); }); })];
                            case 7:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, ids_1 = ids;
                _c.label = 5;
            case 5:
                if (!(_i < ids_1.length)) return [3 /*break*/, 8];
                id = ids_1[_i];
                return [5 /*yield**/, _loop_4(id)];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}); };
// Work, or a helper, that ended while the mod was unloaded is never heard to end, and the engine drops it from its list a while
// later: its card would be drawn at work, and warned about as stuck, for good (16 Nov a second look that handed back its report at
// 17:25, while the mod was out from 17:24 to 17:26, was drawn at work for 47 minutes and held its task open). A card at work that
// the engine no longer lists at all and whose saved record says it finished has ended: helpers first, then work with no helper at
// work left and nothing it asked to be started again for. Looked at once a minute for each
// The folder the engine keeps this chat's agents' records in
var agentsFolder = function ($, chat) { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = "".concat;
            return [4 /*yield*/, $.env.get('HOME')];
        case 1: return [2 /*return*/, _a.apply("", [(_b = (_c.sent())) !== null && _b !== void 0 ? _b : '', "/.claude/projects/"]).concat(cwd.replace(/[^a-zA-Z0-9]/g, '-'), "/").concat(chat, "/subagents")
            // An agent's last words from the end of its record: what it handed back, or the text of its last reply, whether that is a report,
            // and when the record was last written
        ];
    }
}); }); };
// An agent's last words from the end of its record: what it handed back, or the text of its last reply, whether that is a report,
// and when the record was last written
var lastWordsOf = function ($, folder, agent, now) { return __awaiter(_this, void 0, void 0, function () {
    var path, stat, at, size, tail, _a, answer, isHandback, isPressed, _i, _b, row, o, blocks;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                path = "".concat(folder, "/agent-").concat(agent, ".jsonl");
                return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
            case 1:
                stat = _g.sent();
                at = (stat === null || stat === void 0 ? void 0 : stat.mtimeMs) || now;
                size = (_c = stat === null || stat === void 0 ? void 0 : stat.size) !== null && _c !== void 0 ? _c : 0;
                if (!(size > 0 && size < 2000000)) return [3 /*break*/, 3];
                return [4 /*yield*/, readOr($, path)];
            case 2:
                _a = _g.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, $.process.run(['tail', '-c', '400000', path]).catch(function () { return undefined; })];
            case 4:
                _a = ((_e = (_d = (_g.sent())) === null || _d === void 0 ? void 0 : _d.stdout) !== null && _e !== void 0 ? _e : '');
                _g.label = 5;
            case 5:
                tail = (_a).split('\n');
                answer = '';
                isHandback = false;
                isPressed = isPressedAtEnd(tail.map(function (row) { return parsedOr(row, {}); }));
                for (_i = 0, _b = tail.reverse(); _i < _b.length; _i++) {
                    row = _b[_i];
                    o = parsedOr(row, {});
                    if (o.type !== 'assistant' || !Array.isArray((_f = o.message) === null || _f === void 0 ? void 0 : _f.content))
                        continue;
                    blocks = o.message.content;
                    isHandback = blocks.some(function (b) { return b.type === 'tool_use' && b.name === 'SubagentHandback'; });
                    answer = blocks.map(function (b) { var _a, _b; return (b.type === 'tool_use' && b.name === 'SubagentHandback' && typeof ((_a = b.input) === null || _a === void 0 ? void 0 : _a.message) === 'string' ? b.input.message : b.type === 'text' ? ((_b = b.text) !== null && _b !== void 0 ? _b : '') : ''); }).join('').trim();
                    // (the line Claudopus answered Claude Code's press with is no words of its own)
                    if (answer === PRESS_ANSWER)
                        answer = '';
                    if (answer)
                        break;
                }
                return [2 /*return*/, { at: at, answer: answer.slice(0, ANSWER_CHARS), isReport: isHandback || answer.length >= REPORT_LEAST, isHandback: isHandback, isPressed: isPressed }];
        }
    });
}); };
var UNHEARD_LOOK = 60000;
var UNHEARD_QUIET = 60000;
var unheardLooked = new Map();
var endUnheard = function ($, live, now) { return __awaiter(_this, void 0, void 0, function () {
    var id, isUnlisted, list, due, folder, finished, _i, due_1, one, meta, _a, _b, _c, _d, endedNow, short, _e, short_1, one, _loop_5, _f, endedNow_1, one;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_g.sent()).id;
                if (!id || !dir)
                    return [2 /*return*/];
                isUnlisted = function (one) { var _a; return one.status === 'working' && !one.chat && !live.some(function (agent) { return agent.id === one.id; }) && !cutPending.has(one.id) && !isHeld(one) && now - Math.max(one.startedAt, (_a = one.newAt) !== null && _a !== void 0 ? _a : 0) >= UNHEARD_QUIET; };
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _g.sent();
                due = list.filter(function (one) { var _a; return isUnlisted(one) && now - ((_a = unheardLooked.get(one.id)) !== null && _a !== void 0 ? _a : -Infinity) >= UNHEARD_LOOK; });
                if (!due.length)
                    return [2 /*return*/];
                return [4 /*yield*/, agentsFolder($, id)];
            case 3:
                folder = _g.sent();
                finished = new Map();
                _i = 0, due_1 = due;
                _g.label = 4;
            case 4:
                if (!(_i < due_1.length)) return [3 /*break*/, 8];
                one = due_1[_i];
                unheardLooked.set(one.id, now);
                _a = parsedOr;
                return [4 /*yield*/, readOr($, "".concat(folder, "/agent-").concat(one.id, ".meta.json"))];
            case 5:
                meta = _a.apply(void 0, [_g.sent(), {}]);
                if (meta.finished !== true)
                    return [3 /*break*/, 7];
                _c = (_b = finished).set;
                _d = [one.id];
                return [4 /*yield*/, lastWordsOf($, folder, one.id, now)];
            case 6:
                _c.apply(_b, _d.concat([_g.sent()]));
                _g.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8:
                if (!finished.size)
                    return [2 /*return*/];
                endedNow = [];
                short = new Set();
                return [4 /*yield*/, changeTodos($, function (all) {
                        short.clear();
                        var gone = new Set();
                        var list = all;
                        var _loop_6 = function (isMoved) {
                            isMoved = false;
                            list = list.map(function (one) {
                                var _a, _b;
                                var f = finished.get(one.id);
                                if (!f || one.status !== 'working' || one.wakeWhen || isTurnWaited(list, one.id) || list.some(function (kid) { return kid.parentId === one.id && (kid.status === 'working' || gone.has(kid.id)); }))
                                    return one;
                                // (a task left stopped partway is started again to carry on, below)
                                if (!one.parentId && !isWordsReport(one, f.answer, f.isHandback) && (f.isPressed || isLetEnd(one)) && isStoppedShort(one, f.answer))
                                    return (short.add(one.id), one);
                                gone.add(one.id);
                                isMoved = true;
                                // (its words count as a report only when it handed one back or wrote one as long, as at a heard end)
                                var isTop = !one.parentId;
                                var answer = f.answer || one.answer;
                                return __assign(__assign(__assign(__assign(__assign({}, ended(one, 'done', isTop ? now : Math.min(f.at, now))), { answer: answer }), (isTop && isWordsReport(one, f.answer, f.isHandback) ? { answeredAt: (_a = one.answeredAt) !== null && _a !== void 0 ? _a : now } : {})), (isTop && (f.isHandback || (isWordsReport(one, f.answer) && !f.isPressed)) ? { reportAt: (_b = one.reportAt) !== null && _b !== void 0 ? _b : now } : {})), { stuckAt: undefined });
                            });
                            out_isMoved_1 = isMoved;
                        };
                        var out_isMoved_1;
                        for (var isMoved = true; isMoved;) {
                            _loop_6(isMoved);
                            isMoved = out_isMoved_1;
                        }
                        endedNow = __spreadArray([], gone, true);
                        return gone.size ? list : all;
                    })];
            case 9:
                _g.sent();
                _e = 0, short_1 = short;
                _g.label = 10;
            case 10:
                if (!(_e < short_1.length)) return [3 /*break*/, 13];
                one = short_1[_e];
                return [4 /*yield*/, goOn($, one, 'its step ended while Claudopus was away')];
            case 11:
                _g.sent();
                _g.label = 12;
            case 12:
                _e++;
                return [3 /*break*/, 10];
            case 13:
                if (!endedNow.length)
                    return [2 /*return*/];
                return [4 /*yield*/, log($, "work that ended while the mod was out ended on its card: ".concat(endedNow.join(', ')))];
            case 14:
                _g.sent();
                _loop_5 = function (one) {
                    var card;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                card = (_h.sent()).find(function (todo) { return todo.id === one; });
                                if (!((card === null || card === void 0 ? void 0 : card.parentId) && card.parentId !== HELPER)) return [3 /*break*/, 3];
                                return [4 /*yield*/, passOnHelper($, one, card.answer, 'done', true).catch(function (err) { return log($, "helper ".concat(one, "'s result not passed on: ").concat(String(err))); })];
                            case 2:
                                _h.sent();
                                _h.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _f = 0, endedNow_1 = endedNow;
                _g.label = 15;
            case 15:
                if (!(_f < endedNow_1.length)) return [3 /*break*/, 18];
                one = endedNow_1[_f];
                return [5 /*yield**/, _loop_5(one)];
            case 16:
                _g.sent();
                _g.label = 17;
            case 17:
                _f++;
                return [3 /*break*/, 15];
            case 18:
                redraw($);
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
            case 4: return [4 /*yield*/, changeTodos($, function (list) {
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
// The person dismisses the card of a task that has ended, whatever it still asks (18 Nov: "Either way, I should have the ability to
// just close it"): it goes under Finished and stays there, kept on the card so a reload keeps it too, and comes back up only when
// the task works again (resumed). Its result stays in Results, where its open questions are still answered
var isDismissed = function (one) { return one.status !== 'working' && Boolean(one.closedAt); };
// The cards pressed Dismiss on whose write has not landed: drawn dismissed from the press itself (asPressed), so a drawing the app
// asks for between the press and the write, which the panel then keeps while the person uses it, never shows it at the top (18 Nov,
// the person: "when I click this, the message should go below the finished")
var dismissedNow = new Set();
var dismiss = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var at;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dismissedNow.add(id);
                return [4 /*yield*/, $.clock.now()
                    // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
                ];
            case 1:
                at = _a.sent();
                // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id && one.status !== 'working' && !one.closedAt ? __assign(__assign({}, one), { closedAt: at, ask: undefined }) : one); }); }).finally(function () { return dismissedNow.delete(id); })];
            case 2:
                // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
                _a.sent();
                redraw($);
                return [4 /*yield*/, saveFinished($).catch(function (err) { return log($, "finished work not kept: ".concat(String(err))); })];
            case 3:
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
    var r, before, card, isYours, under, _i, _a, b, left, _loop_7, at, now;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                if ((_b.sent()).some(function (one) { return one.id === id && one.status === 'working'; }))
                    pressed.add(id);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: id }).catch(function (err) { return ({ deny: String(err) }); })];
            case 2:
                r = _b.sent();
                if (r.deny)
                    return [2 /*return*/, (pressed.delete(id), log($, "work ".concat(id, " not stopped: ").concat(r.deny)))];
                stoppedHere.add(id);
                return [4 /*yield*/, read($, todos)];
            case 3:
                before = _b.sent();
                card = before.find(function (one) { return one.id === id; });
                isYours = Boolean(card && card.status === 'working' && !card.answeredAt);
                under = __spreadArray([card], underOf(before, id), true).filter(function (one) { return Boolean(one); });
                return [4 /*yield*/, stopHelpers($, id)];
            case 4:
                _b.sent();
                if (!isYours) return [3 /*break*/, 8];
                _i = 0, _a = under.flatMap(function (one) { var _a; return (_a = one.bg) !== null && _a !== void 0 ? _a : []; });
                _b.label = 5;
            case 5:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                b = _a[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: b.id }).catch(function () { return undefined; })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                left = isYours ? under.flatMap(function (one) { var _a; return (_a = one.detached) !== null && _a !== void 0 ? _a : []; }).map(function (d) { return "".concat(d.what || cut(d.cmd, 80)).concat(d.pid ? " (process ".concat(d.pid, ")") : '', ", its log ").concat(d.log); }) : [];
                // Answers that were on their way to it before the stop are dropped: none wakes it
                if (isYours) {
                    _loop_7 = function (at) {
                        if (under.some(function (one) { var _a; return one.id === ((_a = wakes[at]) === null || _a === void 0 ? void 0 : _a.target); }))
                            wakes.splice(at, 1);
                    };
                    for (at = wakes.length - 1; at >= 0; at -= 1) {
                        _loop_7(at);
                    }
                }
                return [4 /*yield*/, $.clock.now()
                    // What finished work left running is stopped with it
                ];
            case 9:
                now = _b.sent();
                // What finished work left running is stopped with it
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) {
                            return one.id === id && one.status === 'working'
                                ? __assign(__assign({}, ended(one, stoppedAs(one), now)), (isYours ? { byYou: { at: now }, ask: undefined } : {})) : isYours && one.id !== id && under.some(function (kid) { return kid.id === one.id; }) && one.status !== 'done'
                                ? // Its helpers, stopped with it, are held with it
                                 __assign(__assign({}, (one.status === 'working' ? ended(one, 'stopped', now) : one)), { byYou: { at: now } }) : one.id === id && one.leftSince
                                ? __assign(__assign({}, one), { leftSince: undefined }) : one;
                        });
                    })
                    // A helper stopped so: the work above it is told in its own chat; the chat is told as the engine's notice of the stop comes
                ];
            case 10:
                // What finished work left running is stopped with it
                _b.sent();
                if (!(isYours && (card === null || card === void 0 ? void 0 : card.parentId) && card.parentId !== HELPER)) return [3 /*break*/, 12];
                return [4 /*yield*/, tell($, card.parentId, named(STOPPED_BY_YOU(titleOf(card), id, left)))];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                if (isYours && card && !card.parentId)
                    stopLeft.set(id, left);
                return [4 /*yield*/, keepStoppedReports($, now)];
            case 13:
                _b.sent();
                return [4 /*yield*/, lookEnds($)];
            case 14:
                _b.sent();
                return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept for the keeper: ".concat(String(err))); })];
            case 15:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// Work the person stopped, started again by their press on its card: a message from the panel in their name, which lifts the hold
var startAgain = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var one, target, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_e.sent()).find(function (todo) { return todo.id === id; });
                if (!one || one.status !== 'stopped' || !one.byYou)
                    return [2 /*return*/];
                if (!(one.parentId && one.parentId !== HELPER)) return [3 /*break*/, 3];
                _b = "the task \"".concat;
                _c = titleOf;
                return [4 /*yield*/, read($, todos)];
            case 2:
                _a = _b.apply("the task \"", [_c.apply(void 0, [(_d = (_e.sent()).find(function (todo) { return todo.id === one.parentId; })) !== null && _d !== void 0 ? _d : one]), "\" ("]).concat(one.parentId, "), to start again its helper");
                return [3 /*break*/, 4];
            case 3:
                _a = 'the task';
                _e.label = 4;
            case 4:
                target = _a;
                return [4 /*yield*/, sendForPerson($, "From the Claudopus panel: ".concat(who(true), " pressed \"Start again\" on \"").concat(titleOf(one), "\" (").concat(id, "), which they had stopped. Start it again: send ").concat(target, " \"").concat(titleOf(one), "\" (").concat(id, ") a message with SendMessage so it continues from where it stopped."))];
            case 5:
                _e.sent();
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
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (todo) { return (todo.id === id ? __assign(__assign({}, todo), { model: model, chosen: model }) : todo); }); })];
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
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(function (err) { return (log($, "panel not opened with the others: ".concat(String(err))), undefined); })];
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
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(function (err) { return log($, "panel not opened: ".concat(String(err))); })];
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
                sign = ended.map(function (one) { var _a; return [one.id, one.status, one.endedAt, one.items.length, one.entries.length, one.answer.length, one.tokens, one.title, one.byYou ? "".concat(one.byYou.at).concat(one.byYou.isLifted ? 'l' : '') : '', (_a = one.closedAt) !== null && _a !== void 0 ? _a : ''].join(':'); }).join(',');
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
    var id, list, live, home, folder, ids, metas, fresh, found, _loop_8, _i, fresh_1, _a, agentId, meta;
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
                during('read back ended work');
                found = [];
                _loop_8 = function (agentId, meta) {
                    var mtime, path, text, _w, _x, engine, one, first, last, model, tokens, items, entries, _loop_9, _y, _z, row, status_1, err_1;
                    return __generator(this, function (_0) {
                        switch (_0.label) {
                            case 0:
                                _0.trys.push([0, 10, , 12]);
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
                                _loop_9 = function (row) {
                                    var o, at, u, _loop_10, _1, _2, block;
                                    return __generator(this, function (_3) {
                                        switch (_3.label) {
                                            case 0: return [4 /*yield*/, breathe($)];
                                            case 1:
                                                _3.sent();
                                                o = (function () {
                                                    try {
                                                        return JSON.parse(row);
                                                    }
                                                    catch (_a) {
                                                        return undefined;
                                                    }
                                                })();
                                                at = (o === null || o === void 0 ? void 0 : o.timestamp) ? Date.parse(o.timestamp) : 0;
                                                if (!o || !at)
                                                    return [2 /*return*/, "continue"];
                                                first || (first = at);
                                                last = at;
                                                if (o.type !== 'assistant')
                                                    return [2 /*return*/, "continue"];
                                                model = ((_m = o.message) === null || _m === void 0 ? void 0 : _m.model) || model;
                                                u = (_o = o.message) === null || _o === void 0 ? void 0 : _o.usage;
                                                if (u)
                                                    tokens = ((_p = u.input_tokens) !== null && _p !== void 0 ? _p : 0) + ((_q = u.cache_read_input_tokens) !== null && _q !== void 0 ? _q : 0) + ((_r = u.cache_creation_input_tokens) !== null && _r !== void 0 ? _r : 0) + ((_s = u.output_tokens) !== null && _s !== void 0 ? _s : 0);
                                                _loop_10 = function (block) {
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
                                                for (_1 = 0, _2 = Array.isArray((_t = o.message) === null || _t === void 0 ? void 0 : _t.content) ? o.message.content : []; _1 < _2.length; _1++) {
                                                    block = _2[_1];
                                                    _loop_10(block);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _y = 0, _z = text.split('\n');
                                _0.label = 6;
                            case 6:
                                if (!(_y < _z.length)) return [3 /*break*/, 9];
                                row = _z[_y];
                                return [5 /*yield**/, _loop_9(row)];
                            case 7:
                                _0.sent();
                                _0.label = 8;
                            case 8:
                                _y++;
                                return [3 /*break*/, 6];
                            case 9:
                                status_1 = one.status === 'failed' ? 'failed' : one.status === 'killed' ? 'stopped' : 'done';
                                found.push(__assign(__assign({}, started(one.id, '', one.description, '', first || mtime, one.type === 'fork')), { status: status_1, endedAt: last || mtime, model: model, tokens: tokens, items: items, entries: entries.slice(-ENTRIES_KEPT) }));
                                return [3 /*break*/, 12];
                            case 10:
                                err_1 = _0.sent();
                                return [4 /*yield*/, log($, "ended work ".concat(agentId, " not read back: ").concat(String(err_1)))];
                            case 11:
                                _0.sent();
                                return [3 /*break*/, 12];
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, fresh_1 = fresh;
                _v.label = 7;
            case 7:
                if (!(_i < fresh_1.length)) return [3 /*break*/, 10];
                _a = fresh_1[_i], agentId = _a.one, meta = _a.meta;
                return [5 /*yield**/, _loop_8(agentId, meta)];
            case 8:
                _v.sent();
                _v.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                if (!found.length) return [3 /*break*/, 12];
                return [4 /*yield*/, changeTodos($, function (now) { return capped(byEnd(__spreadArray(__spreadArray([], found.filter(function (one) { return !now.some(function (card) { return card.id === one.id && !isBare(card); }); }), true), now.filter(function (card) { return !(isBare(card) && found.some(function (one) { return one.id === card.id; })); }), true))); })];
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
                return [4 /*yield*/, changeTodos($, function (list) {
                        // What it left running is looked at afresh: the record of how it ended does not outlive the load
                        var fresh = kept.filter(function (one) { return one.id && one.status !== 'working' && !list.some(function (card) { return card.id === one.id; }); }).map(function (one) { return (__assign(__assign({}, one), { leftSince: undefined, stuckAt: undefined, bg: undefined, waitsSince: undefined })); });
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
                return [4 /*yield*/, lookJobs($).catch(function (err) { return log($, "jobs not read: ".concat(String(err))); })];
            case 2:
                _b.sent();
                return [4 /*yield*/, lookStuck($).catch(function (err) { return log($, "stuck work not looked for: ".concat(String(err))); })];
            case 3:
                _b.sent();
                return [4 /*yield*/, lookInDue($).catch(function (err) { return log($, "helpers not looked in on: ".concat(String(err))); })];
            case 4:
                _b.sent();
                return [4 /*yield*/, lookHeld($).catch(function (err) { return log($, "held commands not looked at: ".concat(String(err))); })];
            case 5:
                _b.sent();
                return [4 /*yield*/, lookWakes($).catch(function (err) { return log($, "wakes not looked at: ".concat(String(err))); })];
            case 6:
                _b.sent();
                return [4 /*yield*/, saveFinished($).catch(function (err) { return log($, "finished work not kept: ".concat(String(err))); })];
            case 7:
                _b.sent();
                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 8:
                isShown = (_b.sent()).some(function (pane) { return pane.id === LIST; });
                _a = isShown;
                return [4 /*yield*/, read($, paneShown)];
            case 9:
                if (!(_a !== (_b.sent()))) return [3 /*break*/, 11];
                return [4 /*yield*/, update($, paneShown, function () { return isShown; })
                    // Reports another chat kept since are listed here too
                ];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: 
            // Reports another chat kept since are listed here too
            return [4 /*yield*/, loadReports($).catch(function () { return undefined; })];
            case 12:
                // Reports another chat kept since are listed here too
                _b.sent();
                return [2 /*return*/];
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
