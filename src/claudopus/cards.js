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
// What it kept of its own background work goes with it, but a server a finished task left for the person: its row stays under the
// green card, with its Stop, until it is stopped
// A reply its ask was held with has been acted on once the run it started ends: the ask waits on the person again, every answer back
var ended = function (one, status, at) {
    var _a, _b, _c;
    var servers = status === 'done' ? ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return isServerRun(b.cmd, b.what); }) : [];
    return __assign(__assign(__assign({}, one), (((_c = (_b = one.ask) === null || _b === void 0 ? void 0 : _b.replied) === null || _c === void 0 ? void 0 : _c.isWaking) ? { ask: __assign(__assign({}, one.ask), { replied: { text: one.ask.replied.text, at: one.ask.replied.at } }) } : {})), { status: status, endedAt: at, up: true, why: undefined, bg: servers.length ? servers : undefined });
};
// Work that is sent a message goes on under its id: its card is back as it was, and the time it lay ended is not counted as work
var resumed = function (one, at) { var _a, _b, _c; return (__assign(__assign({}, one), { byYou: undefined, begunAt: (_a = one.begunAt) !== null && _a !== void 0 ? _a : one.startedAt, ask: ((_c = (_b = one.ask) === null || _b === void 0 ? void 0 : _b.replied) === null || _c === void 0 ? void 0 : _c.isWaking) ? __assign(__assign({}, one.ask), { replied: { text: one.ask.replied.text, at: one.ask.replied.at } }) : one.ask, status: 'working', startedAt: one.endedAt ? at - (one.endedAt - one.startedAt) : one.startedAt || at, endedAt: 0, why: undefined, reportAt: undefined, stuckAt: undefined, stuckTold: undefined, closedAt: undefined, questions: undefined, newAt: at })); };
// How work that is stopped ends: done when its result was already received, stopped otherwise
var stoppedAs = function (one) { return (hasReport(one) ? 'done' : 'stopped'); };
// Work that called SubagentHandback in the turn now ending: what it ends that turn with is its report
var handedBack = new Map();
// Work stopped by the chat or the panel
var stoppedHere = new Set();
// When each task was last asked to say on its card what it does now (NOTE_STALE), for this load
var noteAsked = new Map();
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
// What a task still has to do: its to-dos neither done nor dropped
var openItems = function (one) { var _a; return ((_a = one === null || one === void 0 ? void 0 : one.items) !== null && _a !== void 0 ? _a : []).filter(function (item) { return item.state === 'open' || item.state === 'doing'; }); };
// Work that has ended, the oldest first, then work under way: what `capped` forgets first comes first
var byEnd = function (list) { return __spreadArray([], list, true).sort(function (a, b) { return (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt) || 0; }); };
// The list is kept short, at KEPT tasks, by forgetting work that has ended, the oldest first; work under way, and work still
// asking, is never forgotten, and an ended card still up, which the person never dismissed, is forgotten only after every other
// Helpers are not counted: each is kept as long as the work it runs under, and goes with it
var staysUp = function (one) { return Boolean(one.up) && !one.parentId && !one.chat && one.status !== 'working' && !one.closedAt; };
var capped = function (list) {
    var over = list.filter(function (one) { return !one.parentId; }).length - KEPT;
    var spare = over > 0 ? list.filter(function (one) { return !one.parentId && one.status !== 'working' && !one.ask; }) : [];
    var gone = new Set(__spreadArray(__spreadArray([], spare.filter(function (one) { return !staysUp(one); }), true), spare.filter(staysUp), true).slice(0, Math.max(0, over)));
    var kept = gone.size ? list.filter(function (one) { return !gone.has(one); }) : list;
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
        return __spreadArray([__assign(__assign(__assign(__assign({ one: b.one }, (b.job ? { job: b.job } : {})), (b.run ? { run: b.run } : {})), (b.ended ? { ended: b.ended } : {})), { depth: depth, rails: rails, isLast: isLast, hasKids: b.kids.length > 0 })], twigsOf(b.kids, false, depth + 1, __spreadArray(__spreadArray([], rails, true), [!isLast], false)), true);
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
        hollow: "<rect x=\"".concat(at - 3.25, "\" y=\"").concat(mid - 3.25, "\" width=\"6.5\" height=\"6.5\" rx=\"1\" fill=\"none\" stroke=\"").concat(dot, "\" stroke-width=\"1.5\"/>"),
        up: "<path d=\"M".concat(at - 4.5, " ").concat(mid + 3.5, "H").concat(at + 4.5, "L").concat(at, " ").concat(mid - 4, "Z\" fill=\"").concat(dot, "\"/>"),
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
    var listed, live, now, known, _a, isUnseen, rows, _b, ownCalls, _i, live_1, one;
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
                return [4 /*yield*/, changeTodos($, function (list) {
                        var _a;
                        var cards = new Map(list.map(function (one) { return [one.id, one]; }));
                        var isChanged = false;
                        for (var _i = 0, live_2 = live; _i < live_2.length; _i++) {
                            var one = live_2[_i];
                            var card = cards.get(one.id);
                            var next = !card
                                ? one.status === 'running' || one.status === 'pending'
                                    ? // Work the mod never saw start: a copy of the chat was started for a message of the person's, anything else is some work's helper
                                        started(one.id, (_a = one.parentId) !== null && _a !== void 0 ? _a : (one.type === 'fork' || ownCalls.has(one.description) ? '' : HELPER), one.description, '', now, one.type === 'fork')
                                    : undefined
                                : // Stopped from outside Claudopus, as by the app's own stop
                                    card.status === 'working' && one.status === 'killed'
                                        ? ended(card, stoppedAs(card), now)
                                        : card.parentId === HELPER && !one.parentId && ownCalls.has(one.description)
                                            ? __assign(__assign({}, card), { parentId: '', title: card.title || oneLine(one.description) }) : !card.title && one.description
                                            ? __assign(__assign({}, card), { title: oneLine(one.description) }) : undefined;
                            if (next)
                                cards.set(one.id, next);
                            isChanged || (isChanged = Boolean(next));
                        }
                        return isChanged ? capped(__spreadArray([], cards.values(), true)) : list;
                    })
                    // A run Claude Code lists as over, or no longer lists, whose card is still at work
                ];
            case 7:
                _c.sent();
                if (!listed) return [3 /*break*/, 9];
                return [4 /*yield*/, lookOver($, live, now).catch(function (err) { return log($, "runs that are over not looked at: ".concat(String(err))); })
                    // A command run on the person's press that a reload left running is followed again by this load
                ];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9: 
            // A command run on the person's press that a reload left running is followed again by this load
            return [4 /*yield*/, followRuns($).catch(function (err) { return log($, "commands run on a press not followed: ".concat(String(err))); })];
            case 10:
                // A command run on the person's press that a reload left running is followed again by this load
                _c.sent();
                return [4 /*yield*/, lookEnds($)];
            case 11:
                _c.sent();
                return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept: ".concat(String(err))); })];
            case 12:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// The folder the engine keeps this chat's agents' records in
var agentsFolder = function ($, chat) { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = "".concat;
            return [4 /*yield*/, $.env.get('HOME')];
        case 1: return [2 /*return*/, _a.apply("", [(_b = (_c.sent())) !== null && _b !== void 0 ? _b : '', "/.claude/projects/"]).concat(cwd.replace(/[^a-zA-Z0-9]/g, '-'), "/").concat(chat, "/subagents")
            // An agent's last words from the end of its record: what it handed in, or the text of its last reply, whether Claude Code pressed
            // it for a report after them, and when the record was last written
        ];
    }
}); }); };
// An agent's last words from the end of its record: what it handed in, or the text of its last reply, whether Claude Code pressed
// it for a report after them, and when the record was last written
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
                    // (the line Claude Code's press was answered with is no words of its own)
                    if (answer === PRESS_ANSWER)
                        answer = '';
                    if (answer)
                        break;
                }
                return [2 /*return*/, { at: at, answer: answer.slice(0, ANSWER_CHARS), isHandback: isHandback, isPressed: isPressed }];
        }
    });
}); };
// ---- A run that is over while its card is still at work ----
// A task pauses by ending its step, and Claude Code starts its next step when a command or a helper of its own ends, or when the
// person's answer or words reach it: its card stays at work meanwhile. A run is over for good only when nothing of its own runs
// and nothing on its card waits for the person. Then its card ends: done when its result was received (handed in while Claudopus
// was away, or its last words where Claude Code never pressed it for a hand-back, so took them as its result), and failed
// otherwise, saying it ended without its result. A helper's card ends done either way: its words went to its task
// A run only the list shows as over is given OVER_GRACE first, as Claude Code may be about to start its next step (a helper's
// result on its way to it); one not listed at all must have been quiet for UNHEARD_QUIET, its record saying it finished
var OVER_GRACE = 30000;
var UNHEARD_QUIET = 60000;
var overSince = new Map();
var lookOver = function ($_1, live_3, now_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, live_3, now_1], args_1, true), void 0, function ($, live, now, heard) {
        var chat, list, statusOf, isOver, _loop_1, _a, _b, id, folder, _c, depth, endedNow, _loop_2, _d, _e, one, _f, endedNow_1, id;
        var _g, _h;
        if (heard === void 0) { heard = ''; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, read($, me)];
                case 1:
                    chat = (_j.sent()).id;
                    if (!dir || isOff)
                        return [2 /*return*/];
                    return [4 /*yield*/, read($, todos)];
                case 2:
                    list = _j.sent();
                    statusOf = function (one) { var _a; return (_a = live.find(function (agent) { return agent.id === one.id; })) === null || _a === void 0 ? void 0 : _a.status; };
                    isOver = function (one) { return one.status === 'working' && !one.chat && (one.id === heard || !turnEnding.has(one.id)) && !WORKING.includes(String(statusOf(one))) && statusOf(one) !== 'killed' && !ownsWork(list, one) && !needsPerson(one) && !waiting.some(function (p) { return p.agent === one.id; }); };
                    _loop_1 = function (id) {
                        if (!list.some(function (one) { return one.id === id && isOver(one); }))
                            overSince.delete(id);
                    };
                    for (_a = 0, _b = __spreadArray([], overSince.keys(), true); _a < _b.length; _a++) {
                        id = _b[_a];
                        _loop_1(id);
                    }
                    if (!chat) return [3 /*break*/, 4];
                    return [4 /*yield*/, agentsFolder($, chat)];
                case 3:
                    _c = _j.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = '';
                    _j.label = 5;
                case 5:
                    folder = _c;
                    depth = function (one) { return (one.parentId ? 1 : 0); };
                    endedNow = [];
                    _loop_2 = function (one) {
                        var isListed, since, isHeard, _k, _l, _m, words, _o, isFailed, answer, isReceived, card;
                        var _p;
                        return __generator(this, function (_q) {
                            switch (_q.label) {
                                case 0:
                                    isListed = statusOf(one) !== undefined;
                                    if (one.id !== heard) {
                                        since = (_g = overSince.get(one.id)) !== null && _g !== void 0 ? _g : now;
                                        overSince.set(one.id, since);
                                        if (isListed ? now - since < OVER_GRACE : now - Math.max(one.startedAt, (_h = one.newAt) !== null && _h !== void 0 ? _h : 0) < UNHEARD_QUIET)
                                            return [2 /*return*/, "continue"];
                                    }
                                    isHeard = one.id === heard;
                                    _k = !isListed && !isHeard;
                                    if (!_k) return [3 /*break*/, 4];
                                    _l = parsedOr;
                                    if (!folder) return [3 /*break*/, 2];
                                    return [4 /*yield*/, readOr($, "".concat(folder, "/agent-").concat(one.id, ".meta.json"))];
                                case 1:
                                    _m = _q.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _m = '';
                                    _q.label = 3;
                                case 3:
                                    _k = _l.apply(void 0, [_m, {}]).finished !== true;
                                    _q.label = 4;
                                case 4:
                                    if (_k)
                                        return [2 /*return*/, "continue"];
                                    if (!(isListed || isHeard)) return [3 /*break*/, 6];
                                    _p = { answer: '', isHandback: false };
                                    return [4 /*yield*/, isUnpressed($, one.id)];
                                case 5:
                                    _o = (_p.isPressed = !(_q.sent()), _p.at = now, _p);
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, lastWordsOf($, folder, one.id, now)];
                                case 7:
                                    _o = _q.sent();
                                    _q.label = 8;
                                case 8:
                                    words = _o;
                                    isFailed = statusOf(one) === 'failed';
                                    answer = words.answer || one.answer;
                                    isReceived = !isFailed && (words.isHandback || (!words.isPressed && Boolean(answer.trim())));
                                    return [4 /*yield*/, changeTodos($, function (all) {
                                            return all.map(function (card) {
                                                if (card.id !== one.id || card.status !== 'working' || ownsWork(all, card) || needsPerson(card))
                                                    return card;
                                                endedNow.push(card.id);
                                                if (card.parentId)
                                                    return __assign(__assign(__assign({}, ended(card, isFailed ? 'failed' : 'done', Math.min(words.at, now))), { answer: answer }), (isFailed ? { why: WHY_ERROR } : {}));
                                                return isReceived ? __assign(__assign({}, ended(card, 'done', now)), { answer: answer, reportAt: now }) : __assign(__assign({}, ended(card, 'failed', now)), { answer: answer, why: isFailed ? WHY_ERROR : WHY_NO_RESULT });
                                            });
                                        })];
                                case 9:
                                    _q.sent();
                                    overSince.delete(one.id);
                                    return [4 /*yield*/, read($, todos)];
                                case 10:
                                    card = (_q.sent()).find(function (c) { return c.id === one.id; });
                                    if (card && !card.parentId && card.status === 'done' && card.answer.trim())
                                        $.clock.after(5, function () { return void saveReport($, card, card.answer).catch(function (err) { return log($, "report of ".concat(card.id, " not kept: ").concat(String(err))); }); });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, _e = list.filter(isOver).sort(function (a, b) { return depth(b) - depth(a); });
                    _j.label = 6;
                case 6:
                    if (!(_d < _e.length)) return [3 /*break*/, 9];
                    one = _e[_d];
                    return [5 /*yield**/, _loop_2(one)];
                case 7:
                    _j.sent();
                    _j.label = 8;
                case 8:
                    _d++;
                    return [3 /*break*/, 6];
                case 9:
                    if (!endedNow.length)
                        return [2 /*return*/];
                    _f = 0, endedNow_1 = endedNow;
                    _j.label = 10;
                case 10:
                    if (!(_f < endedNow_1.length)) return [3 /*break*/, 13];
                    id = endedNow_1[_f];
                    if (!(id !== heard)) return [3 /*break*/, 12];
                    return [4 /*yield*/, replyUnread($, id).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })];
                case 11:
                    _j.sent();
                    _j.label = 12;
                case 12:
                    _f++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, log($, "runs that were over ended on their cards: ".concat(endedNow.join(', ')))];
                case 14:
                    _j.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 15:
                    _j.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    });
};
// Changes the to-do a piece of work belongs to; work the mod never saw start is looked up first, and a helper of unknown work changes nothing
// (`isOwn`: a helper's own card where it has one, as for its to-dos, which are never the task's above it)
var change = function ($_1, agentId_1, fn_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, agentId_1, fn_1], args_1, true), void 0, function ($, agentId, fn, isOwn) {
        var now;
        if (isOwn === void 0) { isOwn = false; }
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
                        var id = isOwn && list.some(function (one) { return one.id === agentId; }) ? agentId : topOf(list, agentId);
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
    });
};
// The person dismisses the card of a task that has ended, whatever it still asks (18 Nov: "Either way, I should have the ability to
// just close it"): it goes under Finished and stays there, kept on the card so a reload keeps it too, and comes back up only when
// the task works again (resumed). Its result stays in Results, where its open questions are still answered
var isDismissed = function (one) { return one.status !== 'working' && Boolean(one.closedAt); };
// The cards pressed Dismiss on whose write has not landed: drawn dismissed from the press itself (asPressed), so a drawing the app
// asks for between the press and the write, which the panel then keeps while the person uses it, never shows it at the top (18 Nov,
// the person: "when I click this, the message should go below the finished")
var dismissedNow = new Map();
var dismiss = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var at, card;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()
                // (a second press on a card already marked, as a double click or a press on a drawing from before, changes nothing)
            ];
            case 1:
                at = _a.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                card = (_a.sent()).find(function (one) { return one.id === id; });
                if (!card || card.status === 'working' || card.closedAt || dismissedNow.has(id))
                    return [2 /*return*/];
                dismissedNow.set(id, at);
                doneMoments.set(id, { pressedAt: at, shownAt: 0 });
                redraw($);
                // Its moment never drawn, as in a panel closed meanwhile, it is drawn again under Finished
                $.clock.after(DONE_UNSEEN + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); });
                // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id && one.status !== 'working' && !one.closedAt ? __assign(__assign({}, one), { closedAt: at, ask: undefined }) : one); }); }).finally(function () { return dismissedNow.delete(id); })];
            case 3:
                // (dismissed, it is done with: a question of its own on the card goes with it, and it is drawn at once, before it is kept)
                _a.sent();
                redraw($);
                return [4 /*yield*/, saveFinished($).catch(function (err) { return log($, "finished work not kept: ".concat(String(err))); })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The panel's first drawing made that shows a card marked done begins its moment: its two seconds, the happy octopus and the sound
// start together, as the person sees it, and it is drawn again under Finished once they are over
var beginDoneMoment = function ($, one, at) {
    var moment = doneMoments.get(one.id);
    if (!moment || moment.shownAt || !isDoneMoment(one, at))
        return;
    moment.shownAt = at;
    $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); });
    void playDone($);
    // (how long the person waited for it, so a slow panel shows in the log)
    void log($, "marked done: drawn green ".concat(at - moment.pressedAt, " ms after the press"));
};
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
    var r, before, card, isYours, under, _i, _a, b, _loop_3, at, now;
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
                isYours = Boolean(card && card.status === 'working');
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
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: b.id }).catch(function () { return undefined; })
                    // Answers that were on their way to it before the stop are dropped: none wakes it
                ];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                // Answers that were on their way to it before the stop are dropped: none wakes it
                if (isYours) {
                    _loop_3 = function (at) {
                        if (under.some(function (one) { var _a; return one.id === ((_a = wakes[at]) === null || _a === void 0 ? void 0 : _a.target); }))
                            wakes.splice(at, 1);
                    };
                    for (at = wakes.length - 1; at >= 0; at -= 1) {
                        _loop_3(at);
                    }
                }
                return [4 /*yield*/, $.clock.now()];
            case 9:
                now = _b.sent();
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) {
                            return one.id === id && one.status === 'working'
                                ? __assign(__assign({}, ended(one, stoppedAs(one), now)), (isYours ? { byYou: { at: now }, ask: undefined } : {})) : isYours && one.id !== id && under.some(function (kid) { return kid.id === one.id; }) && one.status !== 'done'
                                ? // Its helpers, stopped with it, are held with it
                                 __assign(__assign({}, (one.status === 'working' ? ended(one, 'stopped', now) : one)), { byYou: { at: now } }) : one;
                        });
                    })
                    // A helper stopped so: the work above it is told in its own chat; the chat is told as the engine's notice of the stop comes
                ];
            case 10:
                _b.sent();
                if (!(isYours && (card === null || card === void 0 ? void 0 : card.parentId) && card.parentId !== HELPER)) return [3 /*break*/, 12];
                return [4 /*yield*/, tell($, card.parentId, named(STOPPED_BY_YOU(titleOf(card), id)))];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12: return [4 /*yield*/, lookEnds($)];
            case 13:
                _b.sent();
                return [4 /*yield*/, saveKeep($).catch(function (err) { return log($, "work at work not kept: ".concat(String(err))); })];
            case 14:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// A task the person stopped, or one that failed, started again by their press on its card: a message from the panel in their
// name, which lifts the hold. Nothing else starts it again
var startAgain = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var one, target, _a, _b, _c, why;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_e.sent()).find(function (todo) { return todo.id === id; });
                if (!one || !((one.status === 'stopped' && one.byYou) || one.status === 'failed'))
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
                why = one.status === 'failed' ? "which had failed".concat(one.why ? " (".concat(one.why.charAt(0).toLowerCase()).concat(one.why.slice(1), ")") : '') : 'which they had stopped';
                return [4 /*yield*/, sendForPerson($, "From the Claudopus panel: ".concat(who(true), " pressed \"Start again\" on \"").concat(titleOf(one), "\" (").concat(id, "), ").concat(why, ". Start it again: send ").concat(target, " \"").concat(titleOf(one), "\" (").concat(id, ") a message with SendMessage so it continues from where it stopped."))];
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
    var id, list, live, home, folder, ids, metas, fresh, found, _loop_4, _i, fresh_1, _a, agentId, meta;
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
                _loop_4 = function (agentId, meta) {
                    var mtime, path, text, _w, _x, engine, one, first, last, model, tokens, items, entries, _loop_5, _y, _z, row, status_1, err_1;
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
                                _loop_5 = function (row) {
                                    var o, at, u, _loop_6, _1, _2, block;
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
                                                _loop_6 = function (block) {
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
                                                    _loop_6(block);
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
                                return [5 /*yield**/, _loop_5(row)];
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
                return [5 /*yield**/, _loop_4(agentId, meta)];
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
                        // A command lasts while the app is open: what a finished card had running did not outlive the load
                        var fresh = kept.filter(function (one) { return one.id && one.status !== 'working' && !list.some(function (card) { return card.id === one.id; }); }).map(function (one) { return (__assign(__assign({}, one), { stuckAt: undefined, bg: undefined })); });
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
                return [4 /*yield*/, saveFinished($).catch(function (err) { return log($, "finished work not kept: ".concat(String(err))); })];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 5:
                isShown = (_b.sent()).some(function (pane) { return pane.id === LIST; });
                _a = isShown;
                return [4 /*yield*/, read($, paneShown)];
            case 6:
                if (!(_a !== (_b.sent()))) return [3 /*break*/, 8];
                return [4 /*yield*/, update($, paneShown, function () { return isShown; })
                    // Reports another chat kept since are listed here too
                ];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: 
            // Reports another chat kept since are listed here too
            return [4 /*yield*/, loadReports($).catch(function () { return undefined; })];
            case 9:
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
