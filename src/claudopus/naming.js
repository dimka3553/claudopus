// Clear names for the commands a task runs, from a small fast model: as a command starts, as its log moves and as it ends, the
// model is asked what it does in plain words, what kind it is, what it does now and, when it failed, why. Asked in the background,
// never holding the panel, and remembered: a title once for each command, the same command run again named with no call. Where
// the model gives no answer, a row keeps the name it had before (hooks/naming.ts holds the question, what is hidden first and how
// the answer is read)
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
var _this = this;
// When each command was last asked about, the log it was asked about, how many times, and whether about its end, by its id
var namingAsked = new Map();
// Titles kept by what the command is (its line, words and folder), the newest last
var titlesKept = new Map();
var TITLES_KEPT = 300;
// What the model said each running command does now, by its id
var namedNow = new Map();
// The commands asked about now, and how many may be at once
var namingNow = new Set();
var NAMING_AT_ONCE = 4;
// A running command is asked again only as its log moves, at most this often, and at most this many times in all (its end is
// asked about once more): about half an hour of a long command's lines
var NAMING_EVERY = 90000;
var NAMING_TIMES = 20;
// After an error from the model it is not asked again for a while; where the engine refuses the call, for longer
var namingOffUntil = 0;
var NAMING_REST = 5 * 60000;
var NAMING_REFUSED_REST = 30 * 60000;
// The folder a command runs in: the one its line moves to first, else the chat's
var folderOf = function (cmd) { var _a, _b; return ((_b = (_a = cmd.match(/^\s*cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.replace(/^["']|["']$/g, '')) || cwd; };
// One question to the model; nothing when it gave no answer that reads
var askNaming = function ($, ask) { return __awaiter(_this, void 0, void 0, function () {
    var now, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                if (now < namingOffUntil)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, $.model
                        .complete({ model: NAMING_MODEL, system: NAMING_SYSTEM, prompt: namingPrompt(ask), maxTokens: 600, effort: 'low', timeoutMs: 20000 })
                        .catch(function (err) {
                        namingOffUntil = now + NAMING_REFUSED_REST;
                        void log($, "commands not named: ".concat(String(err)));
                        return undefined;
                    })];
            case 2:
                r = _a.sent();
                if (!r)
                    return [2 /*return*/, undefined];
                if (!r.isAnswered) {
                    if (r.reason === 'api-error')
                        namingOffUntil = now + NAMING_REST;
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/, namingOf(r.text)];
        }
    });
}); };
// What came back is kept on the command's own entry, running or ended, so its card, Details, its log tab and another chat's panel
// all read it: its title and kind once, why at its end. What it does now stays in memory, read afresh as its log moves
var keepNaming = function ($, id, key, named, isEnd) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, old, title;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!named)
                    return [2 /*return*/];
                if (named.title) {
                    titlesKept.delete(key);
                    titlesKept.set(key, __assign({ title: named.title }, (named.kind ? { kind: named.kind } : {})));
                    for (_i = 0, _a = titlesKept.keys(); _i < _a.length; _i++) {
                        old = _a[_i];
                        if (titlesKept.size > TITLES_KEPT)
                            titlesKept.delete(old);
                    }
                }
                if (named.now && !isEnd)
                    namedNow.set(id, named.now);
                title = named.title ? __assign({ title: named.title }, (named.kind ? { kind: named.kind } : {})) : {};
                return [4 /*yield*/, changeTodos($, function (list) {
                        var isChanged = false;
                        var next = list.map(function (one) {
                            var _a, _b;
                            var bg = (_a = one.bg) === null || _a === void 0 ? void 0 : _a.map(function (b) { var _a; return (b.id === id && title.title && !((_a = b.named) === null || _a === void 0 ? void 0 : _a.title) ? ((isChanged = true), __assign(__assign({}, b), { named: title })) : b); });
                            var endedRuns = (_b = one.endedRuns) === null || _b === void 0 ? void 0 : _b.map(function (r) {
                                var _a, _b;
                                if (r.id !== id)
                                    return r;
                                var both = __assign(__assign({}, (((_a = r.named) === null || _a === void 0 ? void 0 : _a.title) ? {} : title)), (r.how === 'failed' && named.why && !((_b = r.named) === null || _b === void 0 ? void 0 : _b.why) ? { why: named.why } : {}));
                                return Object.keys(both).length ? ((isChanged = true), __assign(__assign({}, r), { named: __assign(__assign({}, r.named), both) })) : r;
                            });
                            return bg === one.bg && endedRuns === one.endedRuns ? one : __assign(__assign(__assign({}, one), (bg ? { bg: bg } : {})), (endedRuns ? { endedRuns: endedRuns } : {}));
                        });
                        return isChanged ? next : list;
                    })];
            case 1:
                _b.sent();
                outputMoved = true;
                return [2 /*return*/];
        }
    });
}); };
// Looked at with the commands' output (lookJobs): each command of this chat's tasks that needs it is asked about, in the
// background. A title once, as it starts or the first time it is seen; what it does now as its log moves; why as it fails.
// `texts`: what each wrote, as just read; `endedAs`: how those that ended did
var nameJobs = function ($, list, texts, endedAs) { return __awaiter(_this, void 0, void 0, function () {
    var now, _loop_1, _i, _a, id, _loop_2, _b, _c, id, _loop_3, _d, list_1, one, state_1;
    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _q.sent();
                if (now < namingOffUntil)
                    return [2 /*return*/];
                _loop_1 = function (id) {
                    if (!list.some(function (one) { var _a, _b; return ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return b.id === id; })) || ((_b = one.endedRuns) === null || _b === void 0 ? void 0 : _b.some(function (r) { return r.id === id; })); }))
                        (namingAsked.delete(id), namedNow.delete(id));
                };
                for (_i = 0, _a = namingAsked.keys(); _i < _a.length; _i++) {
                    id = _a[_i];
                    _loop_1(id);
                }
                _loop_2 = function (id) {
                    if (!list.some(function (one) { var _a; return (_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return b.id === id; }); }))
                        namedNow.delete(id);
                };
                for (_b = 0, _c = namedNow.keys(); _b < _c.length; _b++) {
                    id = _c[_b];
                    _loop_2(id);
                }
                _loop_3 = function (one) {
                    if (one.chat)
                        return "continue";
                    var _loop_4 = function (b) {
                        if (namingNow.size >= NAMING_AT_ONCE)
                            return { value: void 0 };
                        if (namingNow.has(b.id))
                            return "continue";
                        var cmd = (_f = b.cmd) !== null && _f !== void 0 ? _f : b.what;
                        var folder = folderOf(cmd);
                        var key = namingKey({ cmd: cmd, label: b.what, folder: folder });
                        var end = endedAs[b.id];
                        var how = typeof end === 'string' ? end : end === null || end === void 0 ? void 0 : end.how;
                        var isFailed = how === 'failed';
                        var lines = logLines((_g = texts[b.id]) !== null && _g !== void 0 ? _g : '').slice(-LOG_SENT);
                        var sign = lines.join('\n');
                        var was = namingAsked.get(b.id);
                        // The same command named before keeps that title, with no call
                        var kept = titlesKept.get(key);
                        if (kept && !((_h = b.named) === null || _h === void 0 ? void 0 : _h.title))
                            void keepNaming($, b.id, key, kept, false).catch(function (err) { return log($, "a command's name not kept: ".concat(String(err))); });
                        var hasTitle = Boolean(((_j = b.named) === null || _j === void 0 ? void 0 : _j.title) || kept);
                        var isDue = !was || now - was.at >= NAMING_EVERY;
                        var needs = isFailed ? !(was === null || was === void 0 ? void 0 : was.isEnd) : how ? !hasTitle && isDue : (!hasTitle && isDue) || (Boolean(sign) && sign !== (was === null || was === void 0 ? void 0 : was.sign) && isDue && ((_k = was === null || was === void 0 ? void 0 : was.times) !== null && _k !== void 0 ? _k : 0) < NAMING_TIMES);
                        if (!needs)
                            return "continue";
                        namingAsked.set(b.id, __assign({ at: now, sign: sign, times: ((_l = was === null || was === void 0 ? void 0 : was.times) !== null && _l !== void 0 ? _l : 0) + 1 }, (how ? { isEnd: true } : {})));
                        namingNow.add(b.id);
                        var ask = {
                            task: titleOf((_m = list.find(function (card) { return card.id === topOf(list, one.id); })) !== null && _m !== void 0 ? _m : one),
                            todo: (_p = (_o = one.items) === null || _o === void 0 ? void 0 : _o.find(function (item) { return item.state === 'doing'; })) === null || _p === void 0 ? void 0 : _p.text,
                            label: b.what,
                            folder: folder,
                            cmd: cmd,
                            state: isFailed ? 'failed' : how ? 'finished' : sign ? 'running' : 'starting',
                            ran: took(((typeof end === 'object' && end.at) || now) - b.at),
                            lines: lines,
                        };
                        void askNaming($, ask)
                            .then(function (named) { return keepNaming($, b.id, key, named, Boolean(how)); })
                            .catch(function (err) { return log($, "a command not named: ".concat(String(err))); })
                            .finally(function () { return namingNow.delete(b.id); });
                    };
                    for (var _r = 0, _s = (_e = one.bg) !== null && _e !== void 0 ? _e : []; _r < _s.length; _r++) {
                        var b = _s[_r];
                        var state_2 = _loop_4(b);
                        if (typeof state_2 === "object")
                            return state_2;
                    }
                };
                for (_d = 0, list_1 = list; _d < list_1.length; _d++) {
                    one = list_1[_d];
                    state_1 = _loop_3(one);
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                }
                return [2 /*return*/];
        }
    });
}); };
