// Results: what each finished piece of work reported, kept for good with copies of the pictures it named
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
// ---- Reports: what each finished piece of work reported, kept for good with copies of the pictures it named ----
// One folder each under ~/.claude/claudopus/reports: report.md, the text as the work wrote it and never rewritten; meta.json; the
// copies. A later look at the same subject is a new report beside the older one
// How many subjects the panel lists before "more", and at most after it; how many reports the chat is told of with each message
var REPORTS_TOLD = 8;
// What a report may name that is copied in beside it: pictures and pages, never data
var PICTURE = /\.(png|jpe?g|gif|webp|svg|pdf|html?)$/i;
// A folder a report names is copied, its pictures alone, only from where files are temporary
var TEMP = /^\/(private\/)?(tmp|var\/folders)\//;
// The most copies one report keeps, and how much of its text one drawing shows
var COPIES_KEPT = 40;
var REPORT_CHARS = 40000;
// A shorter answer with no picture is a confirmation, not a report worth coming back to
var REPORT_LEAST = 500;
// The panel draws a picture as a small copy inside an Svg, one at a time: one drawing holds 100,000 characters
var THUMB_BYTES = 36000;
var THUMB_SIZES = ['640', '480', '360'];
var RASTER = /\.(png|jpe?g|gif|webp)$/i;
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var reports = atom({ plugin: 'claudopus', key: 'reports' }, [], { shape: 'reports-1' });
// The text of each report open in a pane, as read when it opened: a report is never rewritten
var reportText = new Map();
// The folder this session started in
var cwd = '';
// A report the person's last message named: the work it starts was started from that report
var fromReport = '';
// What the mod itself sent the chat for the person, from a press on a report: it goes on as the person's own message
var sentForPerson = new Set();
var reportsDir = function () { return "".concat(dir, "/reports"); };
var reportPath = function (r) { return "".concat(reportsDir(), "/").concat(r.id); };
var two = function (n) { return String(n).padStart(2, '0'); };
// When a report was written, as a person writes it: "11 Nov, 14:20", with the year when it is not this one
var dated = function (at, now) {
    var d = new Date(at);
    var year = d.getFullYear() === new Date(now).getFullYear() ? '' : " ".concat(d.getFullYear());
    return "".concat(d.getDate(), " ").concat(MONTHS[d.getMonth()]).concat(year, ", ").concat(two(d.getHours()), ":").concat(two(d.getMinutes()));
};
// How old it is, in the largest unit that fits
var ago = function (at, now) {
    var minutes = Math.floor(Math.max(0, now - at) / 60000);
    var _a = [Math.floor(minutes / 60), Math.floor(minutes / 1440)], hours = _a[0], days = _a[1];
    return minutes < 1 ? 'just now' : minutes < 60 ? "".concat(minutes, "m ago") : hours < 24 ? "".concat(hours, "h ago") : days < 60 ? "".concat(days, "d ago") : "".concat(Math.floor(days / 30), " months ago");
};
// What a report leaves waiting on the person: what its work recorded, or an older report's one question
var waitsOf = function (r) { var _a; return (_a = r.waiting) !== null && _a !== void 0 ? _a : (r.question ? [__assign({ text: r.question }, (r.answer ? { answer: r.answer } : {}))] : []); };
// One put away waits on nothing; brought back, what was open waits again
var openWaits = function (r) { return (r.archived ? [] : waitsOf(r).filter(function (one) { return !one.answer; })); };
var isOpenQuestion = function (r) { return openWaits(r).length > 0; };
// What the person answered, once nothing in it waits: their one answer, or how many they answered; what the work itself no longer
// records is settled
var answeredOf = function (r) {
    var answered = waitsOf(r).filter(function (one) { return one.answer && one.answer !== SETTLED; });
    if (isOpenQuestion(r))
        return '';
    if (!answered.length)
        return waitsOf(r).length ? 'no longer waiting' : '';
    var first = answered[0];
    return answered.length > 1 ? "you answered ".concat(answered.length, " questions") : (first === null || first === void 0 ? void 0 : first.answer) === IN_WORDS ? 'you answered in words' : "you answered \u201C".concat(first === null || first === void 0 ? void 0 : first.answer, "\u201D");
};
// The answer kept for an item the person's own words answered, one its work said no longer waits, and one a newer result of its
// work took the place of
var IN_WORDS = 'In your words';
var SETTLED = 'Settled';
var REPLACED = 'Replaced';
var MOVED = 'Moved';
// An item as a card keeps it: a plain line, as kept before answers were, is a yes-or-no question
var askedWait = function (one) { return (typeof one === 'string' ? { text: one } : one); };
// The answers an item is answered with on the panel: its own, or Yes and No; then Not now, and Answer in words, which puts a line
// naming it in the chat's box, as no guess from a question's words tells for sure that Yes and No answer it
var ANSWER_IN_WORDS = 'Answer in words';
var answersOf = function (wait) { var _a; return __spreadArray([], new Set(__spreadArray(__spreadArray([], (((_a = wait.choices) === null || _a === void 0 ? void 0 : _a.length) ? wait.choices : ['Yes', 'No']), true), ['Not now', ANSWER_IN_WORDS], false)), true); };
// How an answered item reads on its result
var answeredWords = function (wait) { var _a; return wait.answer === SETTLED ? 'no longer waiting' : wait.answer === REPLACED ? 'replaced by a newer result' : wait.answer === MOVED ? 'moved to the newer result' : wait.answer === IN_WORDS ? 'you answered in words' : wait.answer === 'Not now' ? 'you pressed Not now' : "you answered \u201C".concat((_a = wait.answer) !== null && _a !== void 0 ? _a : '', "\u201D"); };
var byPerson = function (wait) { return Boolean(wait.answer) && wait.answer !== SETTLED && wait.answer !== REPLACED && wait.answer !== MOVED; };
// The same line, case, punctuation and quotes aside: an item that repeats its work's ask word for word is that ask's
var sameLine = function (a, b) { return Boolean(plainWords(a)) && plainWords(a) === plainWords(b); };
// The results a work left that are still kept
var resultsOfWork = function (list, agent) { return list.filter(function (r) { return r.agent === agent && !r.archived; }).sort(function (a, b) { return b.at - a.at; }); };
// Gives answers to open items of a result, each change made from what is stored then; how many it answered
var settleWaits = function ($, r, answerOf) { return __awaiter(_this, void 0, void 0, function () {
    var closed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                closed = 0;
                if (!waitsOf(r).some(function (one, index) { return !one.answer && answerOf(one, index); }))
                    return [2 /*return*/, 0];
                return [4 /*yield*/, markReport($, r, function (stored) { return ({
                        waiting: waitsOf(stored).map(function (one, index) {
                            var answer = one.answer ? undefined : answerOf(one, index);
                            return answer ? ((closed += 1), __assign(__assign({}, one), answer)) : one;
                        }),
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/, closed];
        }
    });
}); };
// An item a work recorded as the question on its card (`asked`, or the same line as its ask) is tied to that ask by when it was made.
// 16 Nov a release was asked on the card and recorded as waiting a moment later; Release it did the release, and the result went on
// waiting on the person, told to the chat with every message after. Answering that ask by any route answers exactly the items tied to
// it, on the card while the work has not finished and on its results after; the answer taken back opens them again
var tiedTo = function (wait, card) {
    // Only an ask open now: one asked later in the same round ties what waits for it as it comes, and an older ask, answered, never does
    var ask = card.ask;
    if (wait.ask || !ask || !(wait.isAsked || sameLine(wait.text, ask.text)))
        return wait;
    var _ = wait.isAsked, rest = __rest(wait, ["isAsked"]);
    return __assign(__assign({}, rest), { ask: ask.at });
};
var settleAsked = function ($, agent, ask, said) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, _b, r;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, changeTodos($, function (list) {
                    return list.map(function (card) {
                        var _a;
                        return card.id !== agent
                            ? card
                            : __assign(__assign({}, card), (((_a = card.waits) === null || _a === void 0 ? void 0 : _a.length) ? { waits: card.waits.map(askedWait).map(function (one) { return (one.ask === ask.at && !one.answer ? __assign(__assign({}, one), { answer: said, byAsk: ask.at }) : one); }) } : {}));
                    });
                })];
            case 1:
                _c.sent();
                _i = 0;
                _b = resultsOfWork;
                return [4 /*yield*/, loadReports($)];
            case 2:
                _a = _b.apply(void 0, [_c.sent(), agent]);
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                r = _a[_i];
                return [4 /*yield*/, settleWaits($, r, function (one) { return (one.ask === ask.at ? { answer: said, byAsk: ask.at } : undefined); })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
var reopened = function (one, at) {
    var wait = askedWait(one);
    if (wait.byAsk !== at)
        return one;
    var _ = wait.answer, __ = wait.byAsk, rest = __rest(wait, ["answer", "byAsk"]);
    return rest;
};
var unsettleAsked = function ($, agent, at) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, _b, r;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, changeTodos($, function (list) {
                    return list.map(function (card) { var _a; return (card.id !== agent || !((_a = card.waits) === null || _a === void 0 ? void 0 : _a.length) ? card : __assign(__assign({}, card), { waits: card.waits.map(function (one) { return reopened(one, at); }) })); });
                })];
            case 1:
                _c.sent();
                _i = 0;
                _b = resultsOfWork;
                return [4 /*yield*/, loadReports($)];
            case 2:
                _a = _b.apply(void 0, [_c.sent(), agent]);
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                r = _a[_i];
                if (!waitsOf(r).some(function (one) { return one.byAsk === at; })) return [3 /*break*/, 5];
                return [4 /*yield*/, markReport($, r, function (stored) { return ({ waiting: waitsOf(stored).map(function (one) { return askedWait(reopened(one, at)); }) }); })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
// The line "Answer in words" puts in the chat's box: the item by its number, so the words of the question can be anything
var wordsLine = function (r, n, now) { return "About question ".concat(n, " of the result \"").concat(r.title, "\" (").concat(dated(r.at, now), "), ").concat(reportPath(r), "/report.md: "); };
// The person's message that carries that line and something typed after it answers that item
var answeredInMessage = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var parts, told, _loop_1, _i, _a, r;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parts = text.split(/(?=About question \d+ of the result )/).flatMap(function (part) {
                    var _a, _b;
                    var n = Number((_b = (_a = /^About question (\d+) of the result /.exec(part)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0);
                    return n ? [{ n: n, part: part }] : [];
                });
                told = [];
                if (!parts.length)
                    return [2 /*return*/, told];
                _loop_1 = function (r) {
                    var path, typed, numbers, card, _d, open_2, _e, _f, _g, open_1, _h, n, words;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                path = "".concat(reportPath(r), "/report.md: ");
                                typed = parts.flatMap(function (_a) {
                                    var n = _a.n, part = _a.part;
                                    return (part.includes(path) && part.slice(part.indexOf(path) + path.length).trim() ? [{ n: n, words: part.slice(part.indexOf(path) + path.length).trim() }] : []);
                                });
                                numbers = typed.map(function (_a) {
                                    var n = _a.n;
                                    return n;
                                });
                                if (!numbers.length)
                                    return [2 /*return*/, "continue"];
                                _d = taskOfResult;
                                return [4 /*yield*/, read($, todos)];
                            case 1:
                                card = _d.apply(void 0, [_j.sent(), r]);
                                open_2 = typed.filter(function (_a) {
                                    var _b;
                                    var n = _a.n;
                                    return waitsOf(r)[n - 1] && !((_b = waitsOf(r)[n - 1]) === null || _b === void 0 ? void 0 : _b.answer);
                                });
                                if (!(card && open_2.length)) return [3 /*break*/, 3];
                                _e = drawWaking;
                                _f = [$, card];
                                return [4 /*yield*/, $.clock.now()];
                            case 2:
                                _e.apply(void 0, _f.concat([_j.sent()]));
                                _j.label = 3;
                            case 3: return [4 /*yield*/, settleWaits($, r, function (_, index) { return (numbers.includes(index + 1) ? { answer: IN_WORDS } : undefined); })];
                            case 4:
                                _j.sent();
                                if (!card || !open_2.length)
                                    return [2 /*return*/, "continue"];
                                _g = 0, open_1 = open_2;
                                _j.label = 5;
                            case 5:
                                if (!(_g < open_1.length)) return [3 /*break*/, 8];
                                _h = open_1[_g], n = _h.n, words = _h.words;
                                return [4 /*yield*/, answerToTask($, card, r, (_b = waitsOf(r)[n - 1]) !== null && _b !== void 0 ? _b : { text: '' }, words, true)];
                            case 6:
                                _j.sent();
                                _j.label = 7;
                            case 7:
                                _g++;
                                return [3 /*break*/, 5];
                            case 8:
                                told.push(named(RESULT_WORDS_SENT(r.title)));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0;
                return [4 /*yield*/, read($, reports)];
            case 1:
                _a = (_c.sent()).filter(function (one) { return !one.archived && isOpenQuestion(one); });
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                r = _a[_i];
                return [5 /*yield**/, _loop_1(r)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, told];
        }
    });
}); };
var gists = new Map();
// A file a report names is a path inside its own folder: never absolute, never one that climbs out with .., whoever wrote it (a
// report another Mac handed over included)
var isInside = function (file) {
    return typeof file === 'string' && Boolean(file) && !file.startsWith('/') && !file.startsWith('~') && !file.includes('\0') && file.split('/').every(function (part) { return part !== '..' && part !== ''; });
};
var loadReports = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var found, _i, _a, entry, one, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                found = [];
                _i = 0;
                return [4 /*yield*/, $.fs.list(reportsDir()).catch(function () { return []; })];
            case 1:
                _a = _m.sent();
                _m.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                entry = _a[_i];
                if (entry.kind !== 'dir' || entry.name.startsWith('_'))
                    return [3 /*break*/, 8];
                _m.label = 3;
            case 3:
                _m.trys.push([3, 7, , 8]);
                _c = (_b = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(reportsDir(), "/").concat(entry.name, "/meta.json"))];
            case 4:
                one = _c.apply(_b, [_m.sent()]);
                if (one.id !== entry.name || !one.title)
                    return [3 /*break*/, 8];
                if (!(one.agent && !gists.has(one.id))) return [3 /*break*/, 6];
                _e = (_d = gists).set;
                _f = [one.id];
                _g = gistOf;
                return [4 /*yield*/, readOr($, "".concat(reportsDir(), "/").concat(entry.name, "/report.md"))];
            case 5:
                _e.apply(_d, _f.concat([_g.apply(void 0, [_m.sent(), one.title]) || one.gist]));
                _m.label = 6;
            case 6:
                found.push(__assign(__assign({}, one), { subject: one.subject || one.title, gist: (one.agent && gists.get(one.id)) || one.gist || '', files: Array.isArray(one.files) ? one.files.filter(isInside) : [] }));
                return [3 /*break*/, 8];
            case 7:
                _h = _m.sent();
                return [3 /*break*/, 8];
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9:
                found.sort(function (a, b) { return b.at - a.at; });
                _j = JSON.stringify(found);
                _l = (_k = JSON).stringify;
                return [4 /*yield*/, read($, reports)];
            case 10:
                if (!(_j !== _l.apply(_k, [_m.sent()]))) return [3 /*break*/, 12];
                return [4 /*yield*/, update($, reports, function () { return found; })];
            case 11:
                _m.sent();
                _m.label = 12;
            case 12: return [2 /*return*/, found];
        }
    });
}); };
// The absolute paths a report names, as written, without the punctuation after them
var namedPaths = function (text) { var _a; return __spreadArray([], new Set(((_a = text.match(/\/(?:Users|private|tmp|var)\/[^\s`'"()<>[\]{}|,;*]+/g)) !== null && _a !== void 0 ? _a : []).map(function (path) { return path.replace(/[.:!?]+$/, '').replace(/\/$/, ''); })), true); };
// What a report found, in plain words: its first sentences that say something. A heading, a path, a line that only leads in to
// what follows ("Here is the sheet:", "The answer is back. As it came:") or repeats the title says nothing
var gistOf = function (text, title) {
    var _a;
    if (title === void 0) { title = ''; }
    var lead = /^(here is|here are|here's|as it came)\b|\b(is|are) back\b[^.]{0,30}\.?$/i;
    // Its sentences paragraph by paragraph; the finding is taken from the first paragraph that says something, so the list or
    // table after it is never glued on
    var paragraphs = text.split(/\n\s*\n/).map(function (part) {
        return part
            .split('\n')
            .filter(function (line) { return !/^\s*(#|```|\|)/.test(line) && !/^\s*\/\S+$/.test(line.trim()) && !/^\s*(?:[-*]|\d+\.)\s/.test(line); })
            .map(function (line) { return oneLine(line.replace(/[*_`>]/g, '')); })
            .filter(function (line) { return line.length > 20 && slug(line) !== slug(title); })
            .flatMap(function (line) { return line.split(/(?<=[.!?:])\s+(?=[A-Z0-9“"])/); })
            // A short line that ends in a colon only leads in to what follows; a long one says something
            .filter(function (one) { return !(one.trim().endsWith(':') && one.trim().length < 40); })
            .map(function (one) { return one.trim().replace(/:$/, '.'); })
            .filter(function (one) { return one.length > 12 && !one.endsWith('?') && !lead.test(one) && !namedPaths(one).length && /[.!)”"]$/.test(one); });
    });
    var found = '';
    for (var _i = 0, _b = (_a = paragraphs.find(function (part) { return part.length; })) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
        var one = _b[_i];
        if (found && found.length + one.length > 200)
            break;
        found = found ? "".concat(found, " ").concat(one) : one;
    }
    return found;
};
// Copies the pictures and pages a report names into its folder: a file wherever it is, and from a temporary folder it names,
// that folder's pictures. Answers the copies by their path in the folder
var copyNamed = function ($, text, into) { return __awaiter(_this, void 0, void 0, function () {
    var copies, copy, _i, _a, path, stat, r, _b, _c, file;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                copies = [];
                copy = function (from, name) { return __awaiter(_this, void 0, void 0, function () {
                    var to;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (copies.length >= COPIES_KEPT || copies.includes(name))
                                    return [2 /*return*/];
                                to = "".concat(into, "/").concat(name);
                                return [4 /*yield*/, $.process.run(['mkdir', '-p', to.slice(0, to.lastIndexOf('/'))])];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, $.process.run(['cp', '-p', from, to])];
                            case 2:
                                if ((_a.sent()).exitCode === 0)
                                    copies.push(name);
                                return [2 /*return*/];
                        }
                    });
                }); };
                _i = 0, _a = namedPaths(text);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                path = _a[_i];
                return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
            case 2:
                stat = _d.sent();
                if (!((stat === null || stat === void 0 ? void 0 : stat.kind) === 'file' && PICTURE.test(path))) return [3 /*break*/, 4];
                return [4 /*yield*/, copy(path, fileName(path))];
            case 3:
                _d.sent();
                return [3 /*break*/, 9];
            case 4:
                if (!((stat === null || stat === void 0 ? void 0 : stat.kind) === 'dir' && TEMP.test(path) && path.includes('/scratchpad/'))) return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['find', path, '-maxdepth', '2', '-type', 'f'])];
            case 5:
                r = _d.sent();
                _b = 0, _c = rows(r.stdout).filter(function (one) { return PICTURE.test(one); }).sort();
                _d.label = 6;
            case 6:
                if (!(_b < _c.length)) return [3 /*break*/, 9];
                file = _c[_b];
                return [4 /*yield*/, copy(file, "".concat(fileName(path), "/").concat(file.slice(path.length + 1)))];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10: return [2 /*return*/, copies];
        }
    });
}); };
// (a question on its card is shown as waiting already)
// A report that asks the person something: a part headed as waiting on them, or a sentence of two words or more ending in a
// question mark, outside code blocks, quotes, headings and tables (list markers left out, inline code read as a word)
var asksInText = function (text) {
    var unfenced = text.replace(/```[\s\S]*?```/g, '');
    if (/^[\s#*_>-]*(waiting (on|for) you|waits (on|for) you)\b/im.test(unfenced))
        return true;
    var prose = unfenced
        .split('\n')
        .filter(function (line) { return !/^(\s{4}|\t)(?!\s*([-*]|\d+\.)\s)/.test(line) && !/^\s*(#|\|)/.test(line); })
        .map(function (line) { return line.replace(/^\s*([-*]|\d+\.)\s+/, ''); })
        .join('\n')
        .replace(/`[^`\n]*`/g, 'code')
        .replace(/"[^"\n]*"|“[^”\n]*”/g, '');
    return /(?:^|[.!:]\s+|\*\*\s*)(?:[^\s.!?:*]+[ \t]+)+[^\s.!?:*]*[A-Za-z0-9)]\?(?=[\s*_)]|$)/m.test(prose);
};
// The kinds of agent that have the waits tool: Claudopus's own tasks, a general one, a copy of the chat
var WAITS_KINDS = new Set(['claudopus:task', 'claudopus:quick', 'general-purpose', 'fork']);
// Its report handed back asking the person something while the task recorded nothing as waiting on them: refused once a round, so
// the question shows on its card as waiting for them, not as done (18 Nov: "Which opening should go out: A, B or C?" was asked only
// in a report's text, and the panel showed nothing waiting). Sent again, it goes through as it is
var unrecordedAtHandback = function ($, id, message) { return __awaiter(_this, void 0, void 0, function () {
    var one;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_b.sent()).find(function (card) { return card.id === id; });
                if (!one || isOff || !dir || one.parentId || one.chat || one.flagged || one.ask || !WAITS_KINDS.has((_a = one.kind) !== null && _a !== void 0 ? _a : '') || one.waitsSet || one.toldWaits === one.startedAt || !asksInText(message))
                    return [2 /*return*/, ''];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === id ? __assign(__assign({}, card), { toldWaits: one.startedAt }) : card); }); })];
            case 2:
                _b.sent();
                return [4 /*yield*/, log($, "work ".concat(id, " handed back a report that asks something with nothing recorded as waiting: refused once"))];
            case 3:
                _b.sent();
                return [2 /*return*/, named(UNRECORDED_WAITS)];
        }
    });
}); };
// What a finished task's results still ask the person: a result with a question open waits for them, it is not done (18 Nov,
// the person: three results asked something and the panel said only "3 tasks working"). In the minute before its result is kept,
// what the task recorded is read from its card (never longer: a result that failed to be kept leaves nothing to answer). A
// question tied to the open ask on its card is that ask's, which the card shows already. A card the person dismissed waits on
// nothing where cards are drawn: its questions are answered in its result
var CARD_WAITS_SHOWN = 60000;
var openResultWaits = function (one, kept, at) {
    var _a;
    if (one.status !== 'done' || one.parentId || one.chat || one.closedAt)
        return [];
    var fromResults = resultsOfWork(kept, one.id).flatMap(function (r) { return waitsOf(r).flatMap(function (wait, index) { return (wait.answer || answering.has("".concat(r.id, ":").concat(index)) ? [] : [{ r: r, wait: wait, index: index }]); }); });
    var fromCard = fromResults.length || at - one.endedAt > CARD_WAITS_SHOWN ? [] : ((_a = one.waits) !== null && _a !== void 0 ? _a : []).map(askedWait).flatMap(function (wait, index) { return (wait.answer ? [] : [{ wait: wait, index: index }]); });
    return __spreadArray(__spreadArray([], fromResults, true), fromCard, true).filter(function (_a) {
        var wait = _a.wait;
        return !one.ask || wait.ask !== one.ask.at;
    });
};
// Keeps what a finished piece of work reported, once
var saveReport = function ($, card, text) { return __awaiter(_this, void 0, void 0, function () {
    var one, waits, isKept, kept, marked, same, isNewer_1, _i, _a, r, moved, _b, _c, r, waiting, at, title, stamp, base, ids, id, into, chat, files, report, _d;
    var _e;
    var _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_f = (_q.sent()).find(function (todo) { return todo.id === card.id; })) !== null && _f !== void 0 ? _f : card;
                waits = ((_g = one.waits) !== null && _g !== void 0 ? _g : []).map(askedWait);
                isKept = waits.length > 0 || text.trim().length >= REPORT_LEAST || namedPaths(text).some(function (path) { return PICTURE.test(path); });
                return [4 /*yield*/, loadReports($)];
            case 2:
                kept = _q.sent();
                marked = mark(text);
                same = kept.find(function (r) { return r.agent === one.id && r.mark === marked; });
                if (!one.waitsSet) return [3 /*break*/, 10];
                isNewer_1 = isKept && !same;
                _i = 0, _a = resultsOfWork(kept, one.id).filter(function (r) { return r.id !== (same === null || same === void 0 ? void 0 : same.id); });
                _q.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                r = _a[_i];
                return [4 /*yield*/, settleWaits($, r, function () { return ({ answer: isNewer_1 || same ? REPLACED : SETTLED }); })];
            case 4:
                _q.sent();
                _q.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!same) return [3 /*break*/, 8];
                return [4 /*yield*/, markReport($, same, function (stored) { return ({ waiting: __spreadArray(__spreadArray([], waitsOf(stored).filter(byPerson), true), waits.map(function (_a) {
                            var _ = _a.isAsked, wait = __rest(_a, ["isAsked"]);
                            return wait;
                        }), true) }); })];
            case 7:
                _q.sent();
                _q.label = 8;
            case 8: return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (todo) { return (todo.id === one.id ? __assign(__assign(__assign({}, todo), { waitsSet: undefined }), (same ? { waits: undefined } : {})) : todo); }); })];
            case 9:
                _q.sent();
                _q.label = 10;
            case 10:
                if (!isKept || same)
                    return [2 /*return*/];
                moved = one.waitsSet ? [] : resultsOfWork(kept, one.id).flatMap(function (r) { return openWaits(r); });
                if (!moved.length) return [3 /*break*/, 14];
                _b = 0, _c = resultsOfWork(kept, one.id);
                _q.label = 11;
            case 11:
                if (!(_b < _c.length)) return [3 /*break*/, 14];
                r = _c[_b];
                return [4 /*yield*/, settleWaits($, r, function () { return ({ answer: MOVED }); })];
            case 12:
                _q.sent();
                _q.label = 13;
            case 13:
                _b++;
                return [3 /*break*/, 11];
            case 14:
                waiting = __spreadArray(__spreadArray([], waits.map(function (_a) {
                    var _ = _a.isAsked, wait = __rest(_a, ["isAsked"]);
                    return wait;
                }), true), moved, true).filter(function (wait, n, all) { return all.findIndex(function (other) { return other.text === wait.text; }) === n; });
                return [4 /*yield*/, $.clock.now()];
            case 15:
                at = _q.sent();
                title = cut(one.title || quoted(one.words, 60) || 'Report', 70);
                stamp = new Date(at).toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
                base = "".concat(stamp, "-").concat(slug(title).slice(0, 40) || 'report');
                ids = __spreadArray([base, "".concat(base, "-").concat(slug(one.id).slice(0, 8))], [2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return "".concat(base, "-").concat(slug(one.id).slice(0, 8), "-").concat(n); }), true);
                id = (_h = ids.find(function (name) { return !kept.some(function (r) { return r.id === name; }); })) !== null && _h !== void 0 ? _h : "".concat(base, "-").concat(mark(one.id + String(at)).replace(/\D/g, '').slice(-8));
                into = "".concat(reportsDir(), "/").concat(id);
                return [4 /*yield*/, read($, me)
                    // (with the to-dos its task left not done that it does not name itself)
                ];
            case 16:
                chat = _q.sent();
                // (with the to-dos its task left not done that it does not name itself)
                return [4 /*yield*/, $.fs.write("".concat(dir, "/reports/").concat(id, "/report.md"), "".concat(text.trim()).concat(notDoneLines(one, text), "\n"))];
            case 17:
                // (with the to-dos its task left not done that it does not name itself)
                _q.sent();
                return [4 /*yield*/, copyNamed($, text, into).catch(function (err) { return (void log($, "pictures of report ".concat(id, " not copied: ").concat(String(err))), []); })];
            case 18:
                files = _q.sent();
                return [4 /*yield*/, makeThumbs($, { id: id, files: files }).catch(function (err) { return log($, "small copies of report ".concat(id, " not made: ").concat(String(err))); })];
            case 19:
                _q.sent();
                _e = { id: id, title: title, subject: oneLine(one.subject || title), at: at, chat: chat.title, chatId: chat.id };
                return [4 /*yield*/, readIndex($)];
            case 20:
                _d = [(
                    // The folder of the subject the work recorded, which need not be the chat's own
                    _e.folder = (_l = [(_k = (_j = (_q.sent()).find(function (s) { return one.subject && slug(s.name) === slug(one.subject); })) === null || _j === void 0 ? void 0 : _j.repo) !== null && _k !== void 0 ? _k : ''].find(function (repo) { return repo.startsWith('/'); })) !== null && _l !== void 0 ? _l : cwd, _e.gist = gistOf(text, title), _e.files = files, _e)];
                return [4 /*yield*/, madeBy($, (_m = one.wrote) !== null && _m !== void 0 ? _m : [], text, (_o = one.begunAt) !== null && _o !== void 0 ? _o : one.startedAt)
                        .then(function (made) { return ({ made: made }); })
                        .catch(function (err) { return (void log($, "files of report ".concat(id, " not listed: ").concat(String(err))), {}); })];
            case 21:
                report = __assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, _d.concat([(_q.sent())])), { agent: one.id, mark: marked }]), (waiting.length ? { waiting: waiting } : {})]), (one.from ? { from: one.from } : {})]);
                return [4 /*yield*/, $.fs.write("".concat(dir, "/reports/").concat(id, "/meta.json"), "".concat(JSON.stringify(report, null, 2), "\n"))
                    // Its report holds them now: the work's next round records what still waits afresh. The list of results is read first, so the
                    // card that shows them never has a moment with neither (a green finish in between)
                ];
            case 22:
                _q.sent();
                // Its report holds them now: the work's next round records what still waits afresh. The list of results is read first, so the
                // card that shows them never has a moment with neither (a green finish in between)
                return [4 /*yield*/, loadReports($)];
            case 23:
                // Its report holds them now: the work's next round records what still waits afresh. The list of results is read first, so the
                // card that shows them never has a moment with neither (a green finish in between)
                _q.sent();
                if (!((_p = one.waits) === null || _p === void 0 ? void 0 : _p.length)) return [3 /*break*/, 25];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === one.id ? __assign(__assign({}, card), { waits: undefined }) : card); }); })];
            case 24:
                _q.sent();
                _q.label = 25;
            case 25: return [2 /*return*/];
        }
    });
}); };
// The small copy of a picture the panel draws, kept beside the report
var thumbPath = function (r, file) { return "".concat(reportPath(r), "/thumbs/").concat(file.replaceAll('/', '--'), ".jpg"); };
// A picture is read only where it really is inside its report's folder: no link along its path leads anywhere else
var INSIDE = 'f=$1; d=$(cd -P "$2" 2>/dev/null && pwd) || exit 1; p=$(cd -P "$(dirname "$f")" 2>/dev/null && pwd) || exit 1; [ ! -L "$f" ] && [ -f "$f" ] || exit 1; case "$p/" in "$d"/*) exit 0 ;; esac; exit 1';
var makeThumbs = function ($, r) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, file, to, _b, THUMB_SIZES_1, size;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _i = 0, _a = r.files.filter(function (one) { return RASTER.test(one) && isInside(one); });
                _e.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                file = _a[_i];
                to = thumbPath(r, file);
                return [4 /*yield*/, $.fs.exists(to)];
            case 2:
                if (_e.sent())
                    return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['sh', '-c', INSIDE, 'sh', "".concat(reportPath(r), "/").concat(file), reportPath(r)]).catch(function () { return ({ exitCode: 1 }); })];
            case 3:
                if ((_e.sent()).exitCode !== 0)
                    return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['mkdir', '-p', "".concat(reportPath(r), "/thumbs")])];
            case 4:
                _e.sent();
                _b = 0, THUMB_SIZES_1 = THUMB_SIZES;
                _e.label = 5;
            case 5:
                if (!(_b < THUMB_SIZES_1.length)) return [3 /*break*/, 9];
                size = THUMB_SIZES_1[_b];
                return [4 /*yield*/, $.process.run([sips($), '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', "".concat(reportPath(r), "/").concat(file), '--out', to])];
            case 6:
                _e.sent();
                return [4 /*yield*/, $.fs.stat(to).catch(function () { return undefined; })];
            case 7:
                if (((_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.size) !== null && _d !== void 0 ? _d : Infinity) <= THUMB_BYTES)
                    return [3 /*break*/, 9];
                _e.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 5];
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10: return [2 /*return*/];
        }
    });
}); };
// A small copy as an Svg the panel can draw, with its size; nothing for one too big or missing
var drawn = new Map();
var thumbOf = function ($, path) { return __awaiter(_this, void 0, void 0, function () {
    var one, read_1, sized, width, height, _a;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (drawn.has(path))
                    return [2 /*return*/, (_b = drawn.get(path)) !== null && _b !== void 0 ? _b : null];
                one = null;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 4, , 5]);
                return [4 /*yield*/, $.fs.read(path, { as: 'bytes' })];
            case 2:
                read_1 = (_g.sent());
                return [4 /*yield*/, $.process.run([sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', path])];
            case 3:
                sized = (_g.sent()).stdout;
                width = Number((_d = (_c = /pixelWidth:\s*(\d+)/.exec(sized)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0);
                height = Number((_f = (_e = /pixelHeight:\s*(\d+)/.exec(sized)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : 0);
                if (width && height && read_1.base64.length < 50000) {
                    one = {
                        source: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(height, "\" viewBox=\"0 0 ").concat(width, " ").concat(height, "\"><image href=\"data:image/jpeg;base64,").concat(read_1.base64, "\" width=\"").concat(width, "\" height=\"").concat(height, "\"/></svg>"),
                        width: width,
                        height: height,
                    };
                }
                return [3 /*break*/, 5];
            case 4:
                _a = _g.sent();
                one = null;
                return [3 /*break*/, 5];
            case 5:
                // One not there yet is looked for again at the next drawing
                if (one)
                    drawn.set(path, one);
                return [2 /*return*/, one];
        }
    });
}); };
// Changes what is kept beside a report, never its text
// One change at a time, each made from what is stored then, so two answers close together both stay
var marking = Promise.resolve();
var markReport = function ($, r, patch) {
    var run = marking.then(function () { return __awaiter(_this, void 0, void 0, function () {
        var stored, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = [__assign({}, r)];
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, readOr($, "".concat(reportPath(r), "/meta.json"))];
                case 1:
                    stored = __assign.apply(void 0, _a.concat([_c.apply(_b, [(_d.sent()) || '{}'])]));
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/reports/").concat(r.id, "/meta.json"), "".concat(JSON.stringify(__assign(__assign({}, stored), (typeof patch === 'function' ? patch(stored) : patch)), null, 2), "\n"))];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, loadReports($)];
                case 3:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    marking = run.catch(function () { return undefined; });
    return run;
};
// What the chat is told of with each message: the newest reports, so a question one answers is answered from it. One put away is
// left out, and an earlier round's open items are its newest round's to ask again
var reportsTold = function (all, now, list, newest) {
    if (list === void 0) { list = all.filter(function (r) { return !r.archived; }); }
    if (newest === void 0) { newest = newestOf(list); }
    var waits = function (r) { return newest.has(r.id) && isOpenQuestion(r); };
    return list.length
        ? "Results saved (what finished tasks left for ".concat(who(), " to read or act on), newest first (title \u00B7 topic \u00B7 when \u00B7 its file").concat(list.some(waits) ? ' · what in it is waiting on them' : '', "):\n").concat(list
            .slice(0, REPORTS_TOLD)
            .map(function (r) { return "- ".concat([cut(r.title, 70), cut(r.subject, 40), "".concat(dated(r.at, now), " (").concat(ago(r.at, now), ")"), "".concat(reportPath(r), "/report.md"), waits(r) ? "waiting on: ".concat(waitsOf(r).flatMap(function (one, n) { return (one.answer ? [] : ["(".concat(n + 1, ") ").concat(one.text)]); }).join(' ')) : ''].filter(Boolean).join(' · ')); })
            .join('\n')).concat(list.slice(0, REPORTS_TOLD).some(waits) ? "\nOnce ".concat(who(), "'s own words have answered what one waits on, call `waits` with its report.md path as `result` and the numbers of the questions they answered as `answered`.") : '')
        : '';
};
// Sends the chat a message from the panel about what the person pressed or replied there: it starts work as a message of
// theirs does, framed by the engine as the mod's and worded as the panel's, never as words the person typed
var sendForPerson = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sentForPerson.add(text);
                return [4 /*yield*/, $.prompt.submit({ text: text }).catch(function (err) { return log($, "message from a report not sent: ".concat(String(err))); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
