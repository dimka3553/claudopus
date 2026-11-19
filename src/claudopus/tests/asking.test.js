// The asking card: an ask, its Copy, buttons and reply box
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
// What a key's block and a password's block ask, and where each says it goes
var GITHUB_ASKED = "GITHUB_TOKEN is needed to run this task's command.";
var KEY_GOES = "It goes only into this Mac's keychain.";
var ADMIN_ASKED = "This Mac's password is needed to run this as admin.";
var ADMIN_GOES = 'It goes only to this command and is never saved.';
var AMBER = '#E5A50A';
var PURPLE = '#8A63F0';
// The one box above the chat as the bar draws it: its heading line, its one field by what it asks for, what Enter does, and
// its buttons
var oneBox = function (bar) { return __awaiter(_this, void 0, void 0, function () {
    var texts;
    var _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, bar.findAll({ type: 'Text' })];
            case 1:
                texts = (_d.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                _a = {
                    head: (_b = texts.find(function (text) { return text.startsWith('↳'); })) !== null && _b !== void 0 ? _b : ''
                };
                return [4 /*yield*/, bar.findAll({ type: 'Input' })];
            case 2:
                _a.fields = (_d.sent()).map(function (one) { return one.props.placeholder; }),
                    _a.enter = (_c = texts.find(function (text) { return /^Enter sends|carries the task on|Goes only to/.test(text); })) !== null && _c !== void 0 ? _c : '';
                return [4 /*yield*/, bar.findAll({ type: 'Button' })];
            case 3: return [2 /*return*/, (_a.buttons = (_d.sent()).map(function (one) { return String(one.props.label); }).filter(function (label) { return ['Send', 'Close', 'Cancel'].includes(label); }),
                    _a)];
        }
    });
}); };
// (no line under the box says what Enter does)
var SENDS = '';
var SENDS_KEY = '';
// An answer in words on the desktop: Answer in words on the card's block opens the one box above the chat, and what is sent
// from it is the answer. Gives the box it was typed in
var inWords = function (pane, bar, card, text) { return __awaiter(_this, void 0, void 0, function () {
    var open, box;
    var _this = this;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return new RegExp("^ask-".concat(card, "-inbar-\\d+$")).test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); })];
            case 1:
                open = _c.sent();
                return [4 /*yield*/, pane.press({ key: (_a = open === null || open === void 0 ? void 0 : open.key) !== null && _a !== void 0 ? _a : '' })];
            case 2:
                _c.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("band-".concat(card, "-reply-answer-")); })];
                        }
                    }); }); })];
            case 3:
                box = _c.sent();
                return [4 /*yield*/, bar.input({ key: (_b = box === null || box === void 0 ? void 0 : box.key) !== null && _b !== void 0 ? _b : '', text: text })];
            case 4:
                _c.sent();
                return [2 /*return*/, box];
        }
    });
}); };
// The buttons of a card's question, in the order drawn
var askButtons = function (pane, card) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("ask-".concat(card, "-")); }).map(function (one) { return String(one.props.label); })];
    }
}); }); };
test('work that needs the person\'s hands asks: its card stands out first with the question in its block, the text to paste with its Copy, and only the answers the task gave, with Answer in words after them; what is typed goes in the one box above the chat, and each answer goes back to the work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var ended, _a, played, notified, appended, terminals, submitted, resumed, shown, files, clip, filled, list, bar, asked, titles, _b, question, _c, _d, _e, _f, ears, _g, _h, _j, _k, goAhead, _l, approve, _m, _o, _p, _q, _r, _s, box, _t, askFields, _i, _u, pane, _v, toWork, waiting, _loop_1, _w, _x, pane, _y, _z, _0, _1, _, e_1_1, _2, _3, _4, _5, _6, again, done, _7, _8, _9, _10, _11, _12, box3, _13, _14, _15, _16, hrefs, _17, _18, _19, told, _20, openedBefore, openIn, opened, home, _21, before2, _22, _23, second, _24, _25, _26;
    var _27, _28, _29;
    var _this = this;
    var _30, e_1, _31, _32;
    var _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55;
    return __generator(this, function (_56) {
        switch (_56.label) {
            case 0:
                ended = new Set();
                _a = world(on, { ended: ended }), played = _a.played, notified = _a.notified, appended = _a.appended, terminals = _a.terminals, submitted = _a.submitted, resumed = _a.resumed, shown = _a.shown, files = _a.files;
                clip = [];
                on('ui.copy', function (_, e) { return (clip.push(e.text), { value: { isCopied: true } }); });
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _56.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })];
            case 2:
                _56.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _56.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _56.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                bar = _56.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 6:
                _56.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'Paste this code on the GitHub page that opened.', copy: 'ABCD-1234' })];
            case 7:
                asked = _56.sent();
                expect(asked.result).toContain('Shown on your card with a Copy button for the text and Answer in words');
                // No button is added to a question: the work is told it has none
                expect(asked.result).toContain('It has no buttons');
                expect(played.length).toBeGreaterThan(0);
                expect(notified).toContain('Check the ears has a question for you | Paste this code on the GitHub page that opened.');
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 8:
                titles = (_56.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; });
                expect(titles.indexOf('Check the ears')).toBeGreaterThan(-1);
                expect(titles.indexOf('Check the ears')).toBeLessThan(titles.indexOf('Hide the repo'));
                // Its block: a dim label of its kind, then the question in amber, bold
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Question' })];
            case 9:
                // Its block: a dim label of its kind, then the question in amber, bold
                _b.apply(void 0, [(_33 = (_56.sent())) === null || _33 === void 0 ? void 0 : _33.props.dimColor]).toBe(true);
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' })];
            case 10:
                question = _56.sent();
                expect([question === null || question === void 0 ? void 0 : question.props.color, question === null || question === void 0 ? void 0 : question.props.bold]).toEqual([AMBER, true]);
                // Nothing to press but its Copy and Answer in words, and nothing is typed inside the panel
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a2')];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Answer in words') ? askButtons(list, 'a2') : undefined)];
                        }
                    }); }); })];
            case 11:
                // Nothing to press but its Copy and Answer in words, and nothing is typed inside the panel
                _c.apply(void 0, [_56.sent()]).toEqual(['Copy', 'Answer in words']);
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 12:
                _d.apply(void 0, [_56.sent()]).toEqual([]);
                // The code is shown with one Copy button, which puts it on the clipboard and says so
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'ABCD-1234' })];
            case 13:
                // The code is shown with one Copy button, which puts it on the clipboard and says so
                _e.apply(void 0, [(_34 = (_56.sent())) === null || _34 === void 0 ? void 0 : _34.props.mono]).toBe(true);
                return [4 /*yield*/, pressed(list, 'ask-a2-copy')];
            case 14:
                _56.sent();
                expect(clip).toEqual(['ABCD-1234']);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '✓ Copied'; })];
                        }
                    }); }); })];
            case 15:
                _f.apply(void 0, [(_56.sent())]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', surface: 'desktop' }))];
            case 16:
                ears = _56.sent();
                _g = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' })];
            case 17:
                _g.apply(void 0, [(_35 = (_56.sent())) === null || _35 === void 0 ? void 0 : _35.props.color]).toBe(AMBER);
                _h = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Question' })];
            case 18:
                _h.apply(void 0, [_56.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: '' })];
            case 19:
                _56.sent();
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'ABCD-1234' })];
            case 20:
                _j.apply(void 0, [_56.sent()]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Question' })];
            case 21:
                _k.apply(void 0, [_56.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'May I delete the old repo?', choices: ['Approve', 'Not now', 'Keep it'] })];
            case 22:
                goAhead = _56.sent();
                expect(goAhead.result).toContain('the buttons Approve, Keep it and Answer in words');
                expect(goAhead.result).toContain('A choice that only leaves the question open (Not now, Later, Skip, Cancel) was left out');
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(ears, 'a2')];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? askButtons(ears, 'a2') : undefined)];
                        }
                    }); }); })];
            case 23:
                _l.apply(void 0, [_56.sent()]).toEqual(['Approve', 'Keep it', 'Answer in words']);
                return [4 /*yield*/, ears.findAll({ type: 'Button' })];
            case 24:
                approve = (_56.sent()).find(function (b) { return b.props.label === 'Approve'; });
                return [4 /*yield*/, ears.press({ key: (_36 = approve === null || approve === void 0 ? void 0 : approve.key) !== null && _36 !== void 0 ? _36 : '' })];
            case 25:
                _56.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Approve"'); })];
                    }); }); })];
            case 26:
                _m.apply(void 0, [_56.sent()]).toContain('May I delete the old repo?');
                _o = expect;
                return [4 /*yield*/, askButtons(list, 'a2')];
            case 27:
                _o.apply(void 0, [_56.sent()]).toEqual([]);
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Approve”' })];
                    }); }); })];
            case 28:
                _p.apply(void 0, [(_37 = (_56.sent())) === null || _37 === void 0 ? void 0 : _37.props.dimColor]).toBe(true);
                // Or an answer in the person's own words: Answer in words opens the one box above the chat, never one in the panel or Details.
                // One that is none of the ask's buttons, such as a question back, does not settle it: the ask stays with the reply under it
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted'] })];
            case 29:
                // Or an answer in the person's own words: Answer in words opens the one box above the chat, never one in the panel or Details.
                // One that is none of the ask's buttons, such as a question back, does not settle it: the ask stays with the reply under it
                _56.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a2')];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? askButtons(list, 'a2') : undefined)];
                        }
                    }); }); })];
            case 30:
                _q.apply(void 0, [_56.sent()]).toEqual(['Submitted', 'Answer in words']);
                _s = (_r = list).press;
                _27 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 31: return [4 /*yield*/, _s.apply(_r, [(_27.key = (_39 = (_38 = (_56.sent()).find(function (b) { return b.props.label === 'Answer in words'; })) === null || _38 === void 0 ? void 0 : _38.key) !== null && _39 !== void 0 ? _39 : '', _27)])];
            case 32:
                _56.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('band-a2-reply-answer-'); })];
                        }
                    }); }); })];
            case 33:
                box = _56.sent();
                _t = expect;
                return [4 /*yield*/, oneBox(bar)];
            case 34:
                _t.apply(void 0, [_56.sent()]).toEqual({ head: '↳ Your answer to “Check the ears”', fields: ['Type your answer'], enter: SENDS, buttons: ['Send', 'Close'] });
                askFields = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return !/^details-.*-reply-change-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                _i = 0, _u = [list, ears];
                _56.label = 35;
            case 35:
                if (!(_i < _u.length)) return [3 /*break*/, 38];
                pane = _u[_i];
                _v = expect;
                return [4 /*yield*/, askFields(pane)];
            case 36:
                _v.apply(void 0, [_56.sent()]).toEqual([]);
                _56.label = 37;
            case 37:
                _i++;
                return [3 /*break*/, 35];
            case 38: return [4 /*yield*/, bar.input({ key: (_40 = box === null || box === void 0 ? void 0 : box.key) !== null && _40 !== void 0 ? _40 : '', text: 'Where do I do that?' })];
            case 39:
                _56.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('Where do I do that?'); })];
                    }); }); })];
            case 40:
                toWork = (_41 = (_56.sent())) !== null && _41 !== void 0 ? _41 : '';
                expect(toWork).toContain('Submit it to the plugin directory.');
                expect(toWork).toContain('does not settle your question by itself');
                waiting = '✓ You answered “Where do I do that?”';
                _loop_1 = function (pane) {
                    var _57, _58, _59, _60;
                    return __generator(this, function (_61) {
                        switch (_61.label) {
                            case 0:
                                _57 = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, pane.find({ type: 'Text', text: waiting })];
                                    }); }); })];
                            case 1:
                                _57.apply(void 0, [(_42 = (_61.sent())) === null || _42 === void 0 ? void 0 : _42.props.dimColor]).toBe(true);
                                _58 = expect;
                                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Submit it to the plugin directory.' })];
                            case 2:
                                _58.apply(void 0, [(_43 = (_61.sent())) === null || _43 === void 0 ? void 0 : _43.props.color]).toBe(pane === list ? undefined : PURPLE);
                                _59 = expect;
                                return [4 /*yield*/, askButtons(pane, 'a2')];
                            case 3:
                                _59.apply(void 0, [_61.sent()]).toEqual([]);
                                _60 = expect;
                                return [4 /*yield*/, askFields(pane)];
                            case 4:
                                _60.apply(void 0, [_61.sent()]).toEqual([]);
                                return [2 /*return*/];
                        }
                    });
                };
                _w = 0, _x = [list, ears];
                _56.label = 41;
            case 41:
                if (!(_w < _x.length)) return [3 /*break*/, 44];
                pane = _x[_w];
                return [5 /*yield**/, _loop_1(pane)];
            case 42:
                _56.sent();
                _56.label = 43;
            case 43:
                _w++;
                return [3 /*break*/, 41];
            case 44:
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 45:
                _y.apply(void 0, [_56.sent()]).toBe(true);
                _56.label = 46;
            case 46:
                _56.trys.push([46, 51, 52, 57]);
                _z = true, _0 = __asyncValues($.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' }));
                _56.label = 47;
            case 47: return [4 /*yield*/, _0.next()];
            case 48:
                if (!(_1 = _56.sent(), _30 = _1.done, !_30)) return [3 /*break*/, 50];
                _32 = _1.value;
                _z = false;
                _ = _32;
                void _;
                _56.label = 49;
            case 49:
                _z = true;
                return [3 /*break*/, 47];
            case 50: return [3 /*break*/, 57];
            case 51:
                e_1_1 = _56.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 57];
            case 52:
                _56.trys.push([52, , 55, 56]);
                if (!(!_z && !_30 && (_31 = _0.return))) return [3 /*break*/, 54];
                return [4 /*yield*/, _31.call(_0)];
            case 53:
                _56.sent();
                _56.label = 54;
            case 54: return [3 /*break*/, 56];
            case 55:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 56: return [7 /*endfinally*/];
            case 57:
                _2 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: waiting })];
            case 58:
                _2.apply(void 0, [_56.sent()]).toBeDefined();
                // The work asks again: amber again, with its answers back and an empty box
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5b', agentId: 'a2', text: 'It is under Manage, then Submit new. Done?', choices: ['Done'] })];
            case 59:
                // The work asks again: amber again, with its answers back and an empty box
                _56.sent();
                _3 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })];
            case 60:
                _3.apply(void 0, [(_44 = (_56.sent())) === null || _44 === void 0 ? void 0 : _44.props.color]).toBe(AMBER);
                _4 = expect;
                return [4 /*yield*/, askButtons(list, 'a2')];
            case 61:
                _4.apply(void 0, [_56.sent()]).toEqual(['Done', 'Answer in words']);
                _6 = (_5 = list).press;
                _28 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 62: return [4 /*yield*/, _6.apply(_5, [(_28.key = (_46 = (_45 = (_56.sent()).find(function (b) { return b.props.label === 'Answer in words'; })) === null || _45 === void 0 ? void 0 : _45.key) !== null && _46 !== void 0 ? _46 : '', _28)])];
            case 63:
                _56.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('band-a2-reply-answer-'); })];
                        }
                    }); }); })];
            case 64:
                again = _56.sent();
                expect(again === null || again === void 0 ? void 0 : again.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                expect((_47 = again === null || again === void 0 ? void 0 : again.props.value) !== null && _47 !== void 0 ? _47 : '').toBe('');
                // Half a reply typed, then Done pressed twice: the answer goes once, the box goes with it, and the half reply is not left for
                // the next ask
                return [4 /*yield*/, bar.input({ key: (_48 = again === null || again === void 0 ? void 0 : again.key) !== null && _48 !== void 0 ? _48 : '', text: 'Not y', kind: 'change' })];
            case 65:
                // Half a reply typed, then Done pressed twice: the answer goes once, the box goes with it, and the half reply is not left for
                // the next ask
                _56.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 66:
                done = (_50 = (_49 = (_56.sent()).find(function (b) { return b.props.label === 'Done'; })) === null || _49 === void 0 ? void 0 : _49.key) !== null && _50 !== void 0 ? _50 : '';
                return [4 /*yield*/, Promise.all([list.press({ key: done }), list.press({ key: done }).catch(function () { return undefined; })])];
            case 67:
                _56.sent();
                _7 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Done"'); })];
                    }); }); })];
            case 68:
                _7.apply(void 0, [_56.sent()]).toContain('Submit new. Done?');
                expect(appended.filter(function (line) { return line.startsWith('a2: ') && line.includes('"Done"'); })).toHaveLength(1);
                _8 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 69:
                _8.apply(void 0, [_56.sent()]).toBe(true);
                _9 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Done”' })];
                    }); }); })];
            case 70:
                _9.apply(void 0, [_56.sent()]).toBeDefined();
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 71:
                _10.apply(void 0, [_56.sent()]).toBe(true);
                // The work writes a line: it is back under its title
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I submitted it.' })];
            case 72:
                // The work writes a line: it is back under its title
                _56.sent();
                _11 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'I submitted it.' })];
                    }); }); })];
            case 73:
                _11.apply(void 0, [_56.sent()]).toBeDefined();
                // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' })];
            case 74:
                // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
                _56.sent();
                ended.add('a2');
                _12 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a2')];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? askButtons(list, 'a2') : undefined)];
                        }
                    }); }); })];
            case 75:
                _12.apply(void 0, [_56.sent()]).toEqual(['Answer in words']);
                return [4 /*yield*/, inWords(list, bar, 'a2', 'claudopus')];
            case 76:
                box3 = _56.sent();
                expect((_51 = box3 === null || box3 === void 0 ? void 0 : box3.props.value) !== null && _51 !== void 0 ? _51 : '').toBe('');
                _13 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: claudopus'); })];
                    }); }); })];
            case 77:
                _13.apply(void 0, [_56.sent()]).toContain('Continue the task with this answer');
                expect(submitted.some(function (line) { return line.includes('claudopus'); })).toBe(false);
                _14 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “claudopus”' })];
                    }); }); })];
            case 78:
                _14.apply(void 0, [_56.sent()]).toBeDefined();
                _15 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Tell me the repo name.' })];
            case 79:
                _15.apply(void 0, [_56.sent()]).toBeUndefined();
                // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: 'Open the plugin directory and submit the form.', copy: 'Open the plugin directory page and fill in the form with the details' })];
            case 80:
                // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
                _56.sent();
                _16 = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 81:
                _16.apply(void 0, [(_56.sent()).some(function (b) { return b.props.label === 'Copy'; })]).toBe(false);
                // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k7', agentId: 'a2', text: 'Open https://claude.ai/directory/manage, press Submit new, and paste the repository.', copy: 'https://github.com/dimka3553/claudopus' })];
            case 82:
                // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
                _56.sent();
                hrefs = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Link' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.props.href; })];
                    }
                }); }); };
                _17 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, hrefs(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('https://claude.ai/directory/manage') ? true : undefined)];
                        }
                    }); }); })];
            case 83:
                _17.apply(void 0, [_56.sent()]).toBe(true);
                _18 = expect;
                return [4 /*yield*/, hrefs(list)];
            case 84:
                _18.apply(void 0, [_56.sent()]).toContain('https://github.com/dimka3553/claudopus');
                _19 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, hrefs(ears)];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('https://claude.ai/directory/manage') ? true : undefined)];
                        }
                    }); }); })];
            case 85:
                _19.apply(void 0, [_56.sent()]).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub.', command: "gh auth login --hostname 'github.com'", cwd: '/repo/site' })];
            case 86:
                told = _56.sent();
                expect(told.result).not.toContain('mcp__terminal__open_terminal_tab');
                expect(told.result).toContain('Do not open a terminal for it');
                _20 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login --hostname 'github.com'" })];
            case 87:
                _20.apply(void 0, [(_52 = (_56.sent())) === null || _52 === void 0 ? void 0 : _52.props.mono]).toBe(true);
                expect(terminals).toEqual([]);
                openedBefore = shown.length;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 88:
                openIn = (_56.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; });
                expect(openIn).toBeDefined();
                expect(shown.length).toBe(openedBefore);
                // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
                return [4 /*yield*/, list.press({ key: (_53 = openIn === null || openIn === void 0 ? void 0 : openIn.key) !== null && _53 !== void 0 ? _53 : '' })];
            case 89:
                // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
                _56.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.slice(openedBefore).find(function (argv) { return String(argv[1]).endsWith('/open.command'); })];
                    }); }); })];
            case 90:
                opened = _56.sent();
                home = String(opened === null || opened === void 0 ? void 0 : opened[1]).replace(/\/open\.command$/, '');
                expect(files.get("".concat(home, "/command.txt"))).toBe("cd '/repo/site' && gh auth login --hostname 'github.com'");
                expect(files.get("".concat(home, "/.zshrc"))).toContain('print -rz -- "$(<"$_claudopus_here/command.txt")"');
                expect(files.get("".concat(home, "/.zshrc"))).toContain("cd '/repo/site'");
                expect(files.get("".concat(home, "/open.command"))).toContain('exec /bin/zsh -i');
                // Their own history file, and their own start files where their .zshenv moves them
                expect(files.get("".concat(home, "/.zshrc"))).toContain('HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"');
                expect(files.get("".concat(home, "/.zshenv"))).toContain('_CLAUDOPUS_DOT="$ZDOTDIR"');
                _21 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '✓ Typed, not run yet'; })];
                        }
                    }); }); })];
            case 91:
                _21.apply(void 0, [_56.sent()]).toBeDefined();
                expect(terminals).toEqual([]);
                // A folder with a quote in its name is quoted whole
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a2', text: 'Run it here.', command: 'make', cwd: "/repo/it's here" })];
            case 92:
                // A folder with a quote in its name is quoted whole
                _56.sent();
                before2 = shown.length;
                _23 = (_22 = list).press;
                _29 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 93: return [4 /*yield*/, _23.apply(_22, [(_29.key = (_55 = (_54 = (_56.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; })) === null || _54 === void 0 ? void 0 : _54.key) !== null && _55 !== void 0 ? _55 : '', _29)])];
            case 94:
                _56.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.slice(before2).find(function (argv) { return String(argv[1]).endsWith('/open.command'); })];
                    }); }); })];
            case 95:
                second = _56.sent();
                expect(files.get(String(second === null || second === void 0 ? void 0 : second[1]))).toContain("cd '/repo/it'\\''s here'");
                // A reply written into work that then ends without another step was never read: it starts the work again
                ended.delete('a2');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main'] })];
            case 96:
                _56.sent();
                return [4 /*yield*/, inWords(ears, bar, 'a2', 'main')];
            case 97:
                _56.sent();
                _24 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main”' })];
                    }); }); })];
            case 98:
                _24.apply(void 0, [_56.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' })];
            case 99:
                _56.sent();
                _25 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('you ended before reading it: main'); })];
                    }); }); })];
            case 100:
                _25.apply(void 0, [_56.sent()]).toContain('Which branch?');
                expect(submitted.some(function (line) { return line.includes('Which branch?'); })).toBe(false);
                _26 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main”' })];
                    }); }); })];
            case 101:
                _26.apply(void 0, [_56.sent()]).toBeDefined();
                // Nothing was ever put into the chat's own box
                expect(filled).toEqual([]);
                return [4 /*yield*/, Promise.all([list.unmount(), ears.unmount(), bar.unmount()])];
            case 102:
                _56.sent();
                return [2 /*return*/];
        }
    });
}); });
test('while the person types into an ask the panel holds its drawing whole, as other cards move, start and finish around it: the 15 Nov panel that jumped to its bottom and flickered with every letter typed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _loop_2, _i, _a, surface;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Keep digging for head CTs', prompt: 'dig' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which source next?', details: 'A long explanation.\n\n- one\n- two\n- three', choices: ['Kaggle', 'TCIA'] })];
            case 5:
                _j.sent();
                _loop_2 = function (surface) {
                    var list, ears, drawing, box, _k, before, beforeDetails, _l, _m, _o, text, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
                    var _z;
                    return __generator(this, function (_0) {
                        switch (_0.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
                            case 1:
                                list = _0.sent();
                                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: surface }))];
                            case 2:
                                ears = _0.sent();
                                return [4 /*yield*/, clock.advance(2000)];
                            case 3:
                                _0.sent();
                                drawing = function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            _b = (_a = JSON).stringify;
                                            _c = [[]];
                                            return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                                        case 1:
                                            _d = [__spreadArray.apply(void 0, _c.concat([(_e.sent()).map(function (one) { return one.text; }), true]))];
                                            return [4 /*yield*/, pane.findAll({ type: 'Input' })];
                                        case 2: return [2 /*return*/, _b.apply(_a, [__spreadArray.apply(void 0, _d.concat([(_e.sent()).map(function (one) { return [one.key, one.props.value]; }), true]))])];
                                    }
                                }); }); };
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 4:
                                box = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                                expect(box).toBeDefined();
                                return [4 /*yield*/, drawing(list)];
                            case 5:
                                _l = [_0.sent()];
                                return [4 /*yield*/, drawing(ears)];
                            case 6:
                                _k = _l.concat([_0.sent()]), before = _k[0], beforeDetails = _k[1];
                                _m = 0, _o = ['N', 'No', 'Non', 'Non-A'];
                                _0.label = 7;
                            case 7:
                                if (!(_m < _o.length)) return [3 /*break*/, 10];
                                text = _o[_m];
                                return [4 /*yield*/, list.input({ key: (_b = box === null || box === void 0 ? void 0 : box.key) !== null && _b !== void 0 ? _b : '', text: text, kind: 'change' })];
                            case 8:
                                _0.sent();
                                _0.label = 9;
                            case 9:
                                _m++;
                                return [3 /*break*/, 7];
                            case 10:
                                _p = expect;
                                return [4 /*yield*/, drawing(list)];
                            case 11:
                                _p.apply(void 0, [_0.sent()]).toBe(before);
                                // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "n-".concat(surface), agentId: 'a2', text: "I am measuring the left ear on the ".concat(surface, ".") })];
                            case 12:
                                // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
                                _0.sent();
                                return [4 /*yield*/, clock.advance(3000)];
                            case 13:
                                _0.sent();
                                return [4 /*yield*/, list.input({ key: (_c = box === null || box === void 0 ? void 0 : box.key) !== null && _c !== void 0 ? _c : '', text: 'Non-Asian', kind: 'change' })];
                            case 14:
                                _0.sent();
                                _q = expect;
                                return [4 /*yield*/, drawing(list)];
                            case 15:
                                _q.apply(void 0, [_0.sent()]).toBe(before);
                                _r = expect;
                                return [4 /*yield*/, drawing(ears)];
                            case 16:
                                _r.apply(void 0, [_0.sent()]).toBe(beforeDetails);
                                // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
                                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Find more scans ".concat(surface), prompt: 'more' }))];
                            case 17:
                                // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
                                _0.sent();
                                _s = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "Find more scans ".concat(surface) })];
                                    }); }); })];
                            case 18:
                                _s.apply(void 0, [_0.sent()]).toBeDefined();
                                _t = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 19:
                                _t.apply(void 0, [(_d = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _d === void 0 ? void 0 : _d.props.value]).toBe('');
                                // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
                                return [4 /*yield*/, clock.advance(31000)];
                            case 20:
                                // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
                                _0.sent();
                                _u = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "I am measuring the left ear on the ".concat(surface, ".") })];
                                    }); }); })];
                            case 21:
                                _u.apply(void 0, [_0.sent()]).toBeDefined();
                                _v = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 22:
                                _v.apply(void 0, [(_e = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _e === void 0 ? void 0 : _e.props.value]).toBe('Non-Asian');
                                // A press is the person's own move: it lets the panel go at once
                                return [4 /*yield*/, list.input({ key: (_f = box === null || box === void 0 ? void 0 : box.key) !== null && _f !== void 0 ? _f : '', text: 'Non-Asian heads', kind: 'change' })];
                            case 23:
                                // A press is the person's own move: it lets the panel go at once
                                _0.sent();
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "m-".concat(surface), agentId: 'a2', text: "Both ears done on the ".concat(surface, ".") })];
                            case 24:
                                _0.sent();
                                _x = (_w = list).press;
                                _z = {};
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 25: return [4 /*yield*/, _x.apply(_w, [(_z.key = (_h = (_g = (_0.sent()).find(function (b) { return b.props.label === 'TCIA'; })) === null || _g === void 0 ? void 0 : _g.key) !== null && _h !== void 0 ? _h : '', _z)])];
                            case 26:
                                _0.sent();
                                _y = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "Both ears done on the ".concat(surface, ".") })];
                                    }); }); })];
                            case 27:
                                _y.apply(void 0, [_0.sent()]).toBeDefined();
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(surface), agentId: 'a1', text: 'Which source next?', choices: ['Kaggle', 'TCIA'] })];
                            case 28:
                                _0.sent();
                                return [4 /*yield*/, Promise.all([list.unmount(), ears.unmount()])];
                            case 29:
                                _0.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ['desktop', 'terminal'];
                _j.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                surface = _a[_i];
                return [5 /*yield**/, _loop_2(surface)];
            case 7:
                _j.sent();
                _j.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/];
        }
    });
}); });
test('while drawings of the panel are slow, as under seven tasks and their commands, one drawn afresh moments ago is given again as it was, buttons and all, until the gap is over, so a click amid a stream of changes names a button still there; a quick drawing and a press are drawn at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, slow, list, _a, _b, keys, before, _i, _c, n, _d, _e, _f, _g, _h, DOWN, TOP, pane, viewAt, shown, made, _j, _k, where, _l, _m;
    var _this = this;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                clock = world(on).clock;
                slow = { isOn: false, n: 0 };
                on('session.model', function () {
                    slow.n += 1;
                    var until = Date.now() + (slow.isOn ? 300 : 0);
                    while (Date.now() < until)
                        ;
                    return { value: 'claude-opus-5-5' };
                });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'ears' }))];
            case 3:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _o.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // Quick drawings: every change is drawn at once
                ];
            case 5:
                _o.sent();
                // Quick drawings: every change is drawn at once
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'q0', agentId: 'a2', text: 'Quick step of the ears.' })];
            case 6:
                // Quick drawings: every change is drawn at once
                _o.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Quick step of the ears.' })];
                    }); }); })];
            case 7:
                _a.apply(void 0, [_o.sent()]).toBeDefined();
                slow.isOn = true;
                return [4 /*yield*/, clock.advance(2000)];
            case 8:
                _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f0', agentId: 'a2', text: 'Step 0 of the ears.' })];
            case 9:
                _o.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Step 0 of the ears.' })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [_o.sent()]).toBeDefined();
                keys = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return b.key; }).join(' ')];
                    }
                }); }); };
                return [4 /*yield*/, keys()
                    // Work writing faster than a drawing reaches the app: each ask for the panel within the gap gets the drawing on screen
                ];
            case 11:
                before = _o.sent();
                _i = 0, _c = [1, 2];
                _o.label = 12;
            case 12:
                if (!(_i < _c.length)) return [3 /*break*/, 17];
                n = _c[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "f".concat(n), agentId: 'a2', text: "Step ".concat(n, " of the ears.") })];
            case 13:
                _o.sent();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Step 0 of the ears.' })];
            case 14:
                _d.apply(void 0, [_o.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, keys()];
            case 15:
                _e.apply(void 0, [_o.sent()]).toBe(before);
                _o.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 12];
            case 17: 
            // The gap over, it is drawn afresh by itself, with the newest line
            return [4 /*yield*/, clock.advance(1500)];
            case 18:
                // The gap over, it is drawn afresh by itself, with the newest line
                _o.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Step 2 of the ears.' })];
                    }); }); })];
            case 19:
                _f.apply(void 0, [_o.sent()]).toBeDefined();
                // A press of the person's is drawn at once, whatever the gap
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f3', agentId: 'a2', text: 'Step 3 of the ears.' })];
            case 20:
                // A press of the person's is drawn at once, whatever the gap
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Find more scans', prompt: 'more' }))];
            case 21:
                _o.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Find more scans' })];
            case 22:
                _g.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(list, 'stats-open')];
            case 23:
                _o.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Find more scans' })];
                    }); }); })];
            case 24:
                _h.apply(void 0, [_o.sent()]).toBeDefined();
                DOWN = __assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 6, bodyRows: 20 } }), surface: 'desktop' });
                TOP = __assign(__assign({}, LIST), { surface: 'desktop' });
                pane = list;
                viewAt = function (where) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.unmount()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, $.ui.mount(where)];
                        case 2: return [2 /*return*/, ((pane = _a.sent()))];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(5000)];
            case 25:
                _o.sent();
                return [4 /*yield*/, viewAt(DOWN)];
            case 26:
                _o.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 27:
                shown = (_o.sent()).map(function (b) { return b.key; }).join(' ');
                made = slow.n;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f4', agentId: 'a2', text: 'Step 4 of the ears.' })];
            case 28:
                _o.sent();
                _j = 0, _k = [TOP, DOWN, TOP, DOWN];
                _o.label = 29;
            case 29:
                if (!(_j < _k.length)) return [3 /*break*/, 33];
                where = _k[_j];
                return [4 /*yield*/, viewAt(where)];
            case 30:
                _o.sent();
                _l = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 31:
                _l.apply(void 0, [(_o.sent()).map(function (b) { return b.key; }).join(' ')]).toBe(shown);
                _o.label = 32;
            case 32:
                _j++;
                return [3 /*break*/, 29];
            case 33:
                // (the new line, a call of the mod's own, drawn once at the first ask; the view's moves after it, none)
                expect(slow.n - made).toBe(1);
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Step 4 of the ears.' })];
            case 34:
                _m.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, pane.unmount()];
            case 35:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test('two asks for the panel or the bar that come together, as from two windows of a chat or the engine\'s push beside the mod\'s, ask for it again only for a drawing made afresh that the engine dropped, and that ask is given it as made: they never overtake each other without end, each drawing a new pane under the pointer whose hover goes out', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, list, bar, recorded, redraws, before, _b, _c, _d, from, after, bars;
    var _this = this;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _f.sent();
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 4:
                bar = _f.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 5:
                _f.sent();
                recorded = function () { return __awaiter(_this, void 0, void 0, function () {
                    var path;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, clock.advance(2100)];
                            case 1:
                                _b.sent();
                                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                                return [2 /*return*/, ((_a = files.get(path !== null && path !== void 0 ? path : '')) !== null && _a !== void 0 ? _a : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); })];
                        }
                    });
                }); };
                redraws = function (lines) { return lines.filter(function (one) { return one.ev === 'redraw-all'; }).length; };
                // Nothing new since the last drawing: both asks are given the panel as it was, and nothing asks for it again
                return [4 /*yield*/, list.redraw()];
            case 6:
                // Nothing new since the last drawing: both asks are given the panel as it was, and nothing asks for it again
                _f.sent();
                _b = redraws;
                return [4 /*yield*/, recorded()];
            case 7:
                before = _b.apply(void 0, [_f.sent()]);
                return [4 /*yield*/, Promise.all([list.redraw(), list.redraw()])];
            case 8:
                _f.sent();
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(function () { return done(); }, 300); })];
            case 9:
                _f.sent();
                _c = expect;
                _d = redraws;
                return [4 /*yield*/, recorded()];
            case 10:
                _c.apply(void 0, [_d.apply(void 0, [_f.sent()])]).toBe(before);
                return [4 /*yield*/, recorded()];
            case 11:
                from = (_f.sent()).length;
                return [4 /*yield*/, Promise.all([bar.redraw(), bar.redraw()])];
            case 12:
                _f.sent();
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(function () { return done(); }, 300); })];
            case 13:
                _f.sent();
                return [4 /*yield*/, recorded()];
            case 14:
                after = (_f.sent()).slice(from);
                bars = after.filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; });
                expect(bars.filter(function (one) { return !one.held; }).length).toBe(1);
                expect((_e = bars.at(-1)) === null || _e === void 0 ? void 0 : _e.held).toBe(true);
                expect(redraws(after)).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('the bar above the prompt on the desktop, drawn as often as the panel under load, is given again as it was for a second after each drawing made afresh, and a tab of the mod\'s through a click on its buttons, so a click names one still there; both are then drawn afresh by themselves', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, slow, list, bar, _i, _b, _, path, renders, looked, config, says, _c, reset, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                slow = { isOn: false };
                on('session.model', function () {
                    var until = Date.now() + (slow.isOn ? 300 : 0);
                    while (Date.now() < until)
                        ;
                    return { value: 'claude-opus-5-5' };
                });
                // (written before the chat starts, as the person's own settings: one written after is not believed)
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _h.sent();
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 4:
                bar = _h.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 5:
                _h.sent();
                slow.isOn = true;
                return [4 /*yield*/, list.redraw()];
            case 6:
                _h.sent();
                slow.isOn = false;
                return [4 /*yield*/, bar.redraw()
                    // Asked for again and again within the second: the drawing on screen each time
                ];
            case 7:
                _h.sent();
                _i = 0, _b = [1, 2, 3];
                _h.label = 8;
            case 8:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                _ = _b[_i];
                return [4 /*yield*/, bar.redraw()];
            case 9:
                _h.sent();
                _h.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, clock.advance(1500)];
            case 12:
                _h.sent();
                return [4 /*yield*/, bar.redraw()];
            case 13:
                _h.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 14:
                _h.sent();
                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                renders = ((_g = files.get(path !== null && path !== void 0 ? path : '')) !== null && _g !== void 0 ? _g : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); }).filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; });
                expect(renders.filter(function (one) { return one.held; }).length).toBeGreaterThanOrEqual(3);
                // and once the second is over, drawn afresh
                expect(renders.some(function (one, n) { var _a; return n > 0 && ((_a = renders[n - 1]) === null || _a === void 0 ? void 0 : _a.held) && !one.held; })).toBe(true);
                return [4 /*yield*/, bar.unmount()
                    // So is a tab of the mod's, Settings here, which every drawing of the panel draws again too (16 Nov: its Reset pressed, never
                    // reaching the mod). What it shows of the last look for an update tells a drawing made afresh from one given again
                ];
            case 15:
                _h.sent();
                looked = function (min) { return files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: clock.now() - min * 60000, version: '0.0.1', result: 'seen' })); };
                looked(5);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 16:
                config = _h.sent();
                says = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, config.redraw()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, config.findAll({ type: 'Text' })];
                            case 2: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).map(function (text) { var _a; return (_a = /Last checked (\d+m) ago/.exec(text)) === null || _a === void 0 ? void 0 : _a[1]; }).find(Boolean)];
                        }
                    });
                }); };
                _c = expect;
                return [4 /*yield*/, says()];
            case 17:
                _c.apply(void 0, [_h.sent()]).toBe('5m');
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 18:
                reset = (_h.sent()).find(function (one) { return one.props.label === 'Reset'; });
                expect(reset).toBeDefined();
                return [4 /*yield*/, $.ui.focus({ component: 'Pane', requestId: 'config', plugin: 'claudopus', element: reset === null || reset === void 0 ? void 0 : reset.key, isHeld: true, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 19:
                _h.sent();
                looked(20);
                return [4 /*yield*/, clock.advance(1200)];
            case 20:
                _h.sent();
                _d = expect;
                return [4 /*yield*/, says()];
            case 21:
                _d.apply(void 0, [_h.sent()]).toBe('5m');
                _e = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 22:
                _e.apply(void 0, [(_h.sent()).some(function (one) { return one.key === (reset === null || reset === void 0 ? void 0 : reset.key); })]).toBe(true);
                // and once the click is over, drawn afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                // and once the click is over, drawn afresh
                _h.sent();
                _f = expect;
                return [4 /*yield*/, says()];
            case 24:
                _f.apply(void 0, [_h.sent()]).toBe('20m');
                return [4 /*yield*/, config.unmount()];
            case 25:
                _h.sent();
                return [4 /*yield*/, list.unmount()];
            case 26:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
test("while the person types into a card's reply box the list's running times stand still, and move again once they stop", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, time, before, box, _a, _b, _c;
    var _this = this;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' })];
            case 4:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _f.sent();
                time = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).find(function (text) { return /\d+s$/.test(text !== null && text !== void 0 ? text : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(2000)];
            case 6:
                _f.sent();
                return [4 /*yield*/, time()];
            case 7:
                before = _f.sent();
                expect(before).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 8:
                box = (_f.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_d = box === null || box === void 0 ? void 0 : box.key) !== null && _d !== void 0 ? _d : '', text: 'The le', kind: 'change' })];
            case 9:
                _f.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 10:
                _f.sent();
                _a = expect;
                return [4 /*yield*/, time()];
            case 11:
                _a.apply(void 0, [_f.sent()]).toBe(before);
                // Typing stopped for half a minute: the times move again, and the draft is still in the box
                return [4 /*yield*/, clock.advance(31000)];
            case 12:
                // Typing stopped for half a minute: the times move again, and the draft is still in the box
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, time()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== before ? true : undefined)];
                        }
                    }); }); })];
            case 13:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 14:
                _c.apply(void 0, [(_e = (_f.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _e === void 0 ? void 0 : _e.props.value]).toBe('The le');
                return [4 /*yield*/, list.unmount()];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a button the panel draws again with the same key and the same look keeps the number the engine gave it, though the panel was drawn anew around it, so a click on the drawing still on screen names a button the engine still holds', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var list, numbers, first, bar, _a, second, _b, third, kept;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // Each drawn button's number, by its key: the number a click names, which the engine drops with the drawing it was made in
                ];
            case 2:
                list = _c.sent();
                numbers = function () { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                found = new Map();
                                walk = function (node) {
                                    var _a, _b;
                                    if (Array.isArray(node))
                                        return void node.forEach(walk);
                                    if (!node || typeof node !== 'object')
                                        return;
                                    var one = node;
                                    if (one.type === 'Button' && ((_a = one.props) === null || _a === void 0 ? void 0 : _a.key) && ((_b = one.press) === null || _b === void 0 ? void 0 : _b.handle) !== undefined)
                                        found.set(one.props.key, one.press.handle);
                                    walk(one.children);
                                };
                                _a = walk;
                                return [4 /*yield*/, list.drawn()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                return [4 /*yield*/, numbers()];
            case 3:
                first = _c.sent();
                bar = __spreadArray([], first.keys(), true).filter(function (key) { return /^(stats|config|about|memory)-open-\d+$/.test(key); });
                expect(bar.length).toBe(4);
                // A task starts: its card is drawn, so the whole panel is made anew, every button in it handed to the engine again
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 4:
                // A task starts: its card is drawn, so the whole panel is made anew, every button in it handed to the engine again
                _c.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Fix the nose' })];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, numbers()];
            case 6:
                second = _c.sent();
                expect(__spreadArray([], second.keys(), true).some(function (key) { return /^open-a1-\d+$/.test(key); })).toBe(true);
                // The bar's buttons look as they did: each has the number it had, so a click on the drawing before still lands
                expect(bar.map(function (key) { return [key, second.get(key)]; })).toEqual(bar.map(function (key) { return [key, first.get(key)]; }));
                // and again as the task writes a line, its card's own buttons too
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the nose.' })];
            case 7:
                // and again as the task writes a line, its card's own buttons too
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Looking at the nose.' })];
                    }); }); })];
            case 8:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, numbers()];
            case 9:
                third = _c.sent();
                kept = __spreadArray([], second.keys(), true).filter(function (key) { return third.has(key); });
                expect(kept.length).toBeGreaterThanOrEqual(bar.length + 1);
                expect(kept.map(function (key) { return [key, third.get(key)]; })).toEqual(kept.map(function (key) { return [key, second.get(key)]; }));
                return [4 /*yield*/, list.unmount()];
            case 10:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('with work running and nobody typing, the panel is drawn again at once for anything new, but for its running times alone only every ten seconds, so a button under the pointer keeps its hover and takes its click', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, texts, before, _a, _b, _c, after, _d, _e, _f, _g, _h, shut, _j;
    var _k;
    var _this = this;
    var _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the chin', prompt: 'chin' }))];
            case 4:
                _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I go on?', choices: ['Approve'] })];
            case 5:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 6:
                list = _o.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).stringify;
                            return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (one) { return one.text; })])];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _o.sent();
                return [4 /*yield*/, texts()];
            case 8:
                before = _o.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 9:
                _o.sent();
                _a = expect;
                return [4 /*yield*/, texts()];
            case 10:
                _a.apply(void 0, [_o.sent()]).toBe(before);
                // Work writes a line: drawn at once. The card that waits says so with its block alone, with no line of what it last did
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'I measured the right ear.' })];
            case 11:
                // Work writes a line: drawn at once. The card that waits says so with its block alone, with no line of what it last did
                _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I am looking at the chin.' })];
            case 12:
                _o.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'I am looking at the chin.' })];
                    }); }); })];
            case 13:
                _b.apply(void 0, [_o.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'I measured the right ear.' })];
            case 14:
                _c.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, texts()];
            case 15:
                after = _o.sent();
                return [4 /*yield*/, clock.advance(11000)];
            case 16:
                _o.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== after ? true : undefined)];
                        }
                    }); }); })];
            case 17:
                _d.apply(void 0, [_o.sent()]).toBe(true);
                _f = (_e = list).press;
                _k = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18: 
            // A press shows what it did at once
            return [4 /*yield*/, _f.apply(_e, [(_k.key = (_m = (_l = (_o.sent()).find(function (b) { return b.props.label === 'Approve'; })) === null || _l === void 0 ? void 0 : _l.key) !== null && _m !== void 0 ? _m : '', _k)])];
            case 19:
                // A press shows what it did at once
                _o.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'May I go on?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 20:
                _g.apply(void 0, [_o.sent()]).toBe(true);
                // and so does one that only opens a part of the panel, Finished, with work ended and other work running
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the nose', prompt: 'nose' }))];
            case 21:
                // and so does one that only opens a part of the panel, Finished, with work ended and other work running
                _o.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Nose checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' })];
            case 22:
                _o.sent();
                return [4 /*yield*/, clock.advance(12000)
                    // (an ended card stays up until it is dismissed: dismissed, it is the one under Finished)
                ];
            case 23:
                _o.sent();
                // (an ended card stays up until it is dismissed: dismissed, it is the one under Finished)
                return [4 /*yield*/, pressed(list, 'dismiss-a3')];
            case 24:
                // (an ended card stays up until it is dismissed: dismissed, it is the one under Finished)
                _o.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 25:
                _o.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'finished-fold')];
                    }); }); })];
            case 26:
                _h.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, texts()];
            case 27:
                shut = _o.sent();
                return [4 /*yield*/, pressed(list, 'finished-fold')];
            case 28:
                _o.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== shut ? true : undefined)];
                        }
                    }); }); })];
            case 29:
                _j.apply(void 0, [_o.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 30:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a key box keeps what is typed in it without drawing it back, and holds the panel while it is typed into', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, files, id, list, field, before, _b, _c, _d, _e, _f, _g;
    var _this = this;
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'get the data', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Get the data', prompt: 'data' }))];
            case 3:
                _j.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret SAMPLE_USER here fetch' }));
                id = '3f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'SAMPLE_USER', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-field")); })];
                        }
                    }); }); })];
            case 6:
                field = _j.sent();
                expect(field).toBeDefined();
                if (!field)
                    return [2 /*return*/];
                // The surface keeps the letters itself: the box is drawn with no value, so a drawing never puts older letters over newer ones
                expect(field.props.value).toBeUndefined();
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                before = _c.apply(_b, [(_j.sent()).map(function (one) { return one.text; })]);
                return [4 /*yield*/, list.input({ key: (_h = field.key) !== null && _h !== void 0 ? _h : '', text: 'made-up-na', kind: 'change' })];
            case 8:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am waiting for the made-up name.' })];
            case 9:
                _j.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 10:
                _j.sent();
                _d = expect;
                _f = (_e = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 11:
                _d.apply(void 0, [_f.apply(_e, [(_j.sent()).map(function (one) { return one.text; })])]).toBe(before);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 12:
                _g.apply(void 0, [(_j.sent()).find(function (one) { return one.key === field.key; })]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 13:
                _j.sent();
                return [4 /*yield*/, settle()];
            case 14:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an ask outlives the work that made it: amber after the work ends, with the buttons the work gave it and none added, until the person answers', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, submitted, resumed, clock, list, bar, _b, _c, _d, _e, _f, _g, _h;
    var _j;
    var _this = this;
    var _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _a = world(on), submitted = _a.submitted, resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                bar = _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run this to restart that chat yourself.', command: 'ssh m4 tmux respawn-pane -k -t claude', choices: ['Done'] })
                    // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                ];
            case 6:
                _o.sent();
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'I could not restart it; the command is on your card.' })];
            case 7:
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                _o.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })
                    // Long after it finished, the ask is still there, amber, with its own Done, its buttons for the command and Answer in words;
                    // though the work has ended, its card has no Message while it asks; Dismiss puts it away, as on any ended card
                ];
            case 8:
                _o.sent();
                // Long after it finished, the ask is still there, amber, with its own Done, its buttons for the command and Answer in words;
                // though the work has ended, its card has no Message while it asks; Dismiss puts it away, as on any ended card
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 9:
                // Long after it finished, the ask is still there, amber, with its own Done, its buttons for the command and Answer in words;
                // though the work has ended, its card has no Message while it asks; Dismiss puts it away, as on any ended card
                _o.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [(_k = (_o.sent())) === null || _k === void 0 ? void 0 : _k.props.color]).toBe(AMBER);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a1')];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Answer in words') ? askButtons(list, 'a1') : undefined)];
                        }
                    }); }); })];
            case 11:
                _c.apply(void 0, [_o.sent()]).toEqual(['Copy', 'Open in Terminal', 'Done', 'Answer in words']);
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 12:
                _d.apply(void 0, [(_o.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return ['Dismiss', 'Message', 'Not now'].includes(label); })]).toEqual(['Dismiss']);
                _f = (_e = list).press;
                _j = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 13: 
            // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
            return [4 /*yield*/, _f.apply(_e, [(_j.key = (_m = (_l = (_o.sent()).find(function (b) { return b.props.label === 'Done'; })) === null || _l === void 0 ? void 0 : _l.key) !== null && _m !== void 0 ? _m : '', _j)])];
            case 14:
                // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
                _o.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Done"') && line.includes('Run this to restart that chat yourself.'); })];
                    }); }); })];
            case 15:
                _g.apply(void 0, [_o.sent()]).toBeDefined();
                expect(submitted.some(function (line) { return line.includes('Run this to restart'); })).toBe(false);
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 16:
                _h.apply(void 0, [_o.sent()]).toBe(true);
                return [4 /*yield*/, Promise.all([list.unmount(), bar.unmount()])];
            case 17:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a press on one ended work\'s ask leaves the other asks\' buttons where they were: the 14 Nov "Release it" pressed from a phone right after another card\'s, on the keys it last drew, which ran nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, clock, list, _i, _b, _c, id, text, drawn, linux, azure, _d, _e, _f;
    var _this = this;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two releases', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Linux support', prompt: 'linux' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Azure route', prompt: 'azure' }))];
            case 4:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _j.sent();
                _i = 0, _b = [['a1', 'Release Linux support?'], ['a2', 'Release the Azure route?']];
                _j.label = 6;
            case 6:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                _c = _b[_i], id = _c[0], text = _c[1];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(id), agentId: id, text: text, choices: ['Release it'] })
                    // (each hands in its result with the question still open: that, not its turn's end, ends a task)
                ];
            case 7:
                _j.sent();
                // (each hands in its result with the question still open: that, not its turn's end, ends a task)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: "h-".concat(id), agentId: id, message: 'Waits for your Release it.' })];
            case 8:
                // (each hands in its result with the question still open: that, not its turn's end, ends a task)
                _j.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: "turn-".concat(id), reason: 'answer', agentId: id })];
            case 9:
                _j.sent();
                _j.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 6];
            case 11: return [4 /*yield*/, clock.advance(60000)
                // The keys as the late surface last drew them, both cards amber with their buttons
            ];
            case 12:
                _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var releases;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                case 1:
                                    releases = (_a.sent()).filter(function (b) { return b.props.label === 'Release it'; });
                                    return [2 /*return*/, releases.length === 2 ? releases.map(function (b) { var _a; return (_a = b.key) !== null && _a !== void 0 ? _a : ''; }) : undefined];
                            }
                        });
                    }); })];
            case 13:
                drawn = _j.sent();
                linux = (_g = drawn === null || drawn === void 0 ? void 0 : drawn.find(function (key) { return key.startsWith('ask-a1-'); })) !== null && _g !== void 0 ? _g : '';
                azure = (_h = drawn === null || drawn === void 0 ? void 0 : drawn.find(function (key) { return key.startsWith('ask-a2-'); })) !== null && _h !== void 0 ? _h : '';
                expect(linux && azure).toBeTruthy();
                return [4 /*yield*/, list.press({ key: linux })];
            case 14:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 15:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
                return [4 /*yield*/, list.press({ key: azure }).catch(function () { return undefined; })];
            case 16:
                // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('pressed "Release it"') && line.includes('Release the Azure route?'); })];
                    }); }); })];
            case 17:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Release the Azure route?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 18:
                _f.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 19:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
// The go-ahead for a release is one press: the task asks with its worktree, and Release it is the permission for its release run
test('Release it on a go-ahead asked with its worktree reaches the task as its answer and lets that card\'s next release run for that folder through with no second question, once: a second run is asked on the card', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, files, appended, bash, holding, grants, wake, clock, gateButton, RELEASE, asked, _b, _c, _d, told, _e, _f, first, run, _g, _h, _j, early, _k, second, _l, _m, _o, _p, _q, _r, _s;
    var _t, _u;
    var _this = this;
    var _v, _w, _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _3.sent(), list = _a.list, files = _a.files, appended = _a.appended, bash = _a.bash, holding = _a.holding, grants = _a.grants, wake = _a.wake, clock = _a.clock;
                gateButton = function (start) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith(start); })];
                    }
                }); }); };
                files.set('/repo/wt/.release', 'mods/claudopus/bin/release');
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-nose');
                RELEASE = 'hold xr1; /plug/claudopus/bin/release';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the nose fix?', details: 'It straightens the nose.', choices: ['Release it'], release: '/repo/wt' })];
            case 2:
                asked = _3.sent();
                expect(asked.result).toContain('A press on Release it also allows your next run of the release runner for /repo/wt, once, with no second question');
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a1')];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? askButtons(list, 'a1') : undefined)];
                        }
                    }); }); })];
            case 3:
                _b.apply(void 0, [_3.sent()]).toEqual(['Release it']);
                _d = (_c = list).press;
                _t = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 4: 
            // The press is the task's answer, with what it allows; it has no way back
            return [4 /*yield*/, _d.apply(_c, [(_t.key = (_w = (_v = (_3.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _v === void 0 ? void 0 : _v.key) !== null && _w !== void 0 ? _w : '', _t)])];
            case 5:
                // The press is the task's answer, with what it allows; it has no way back
                _3.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it" in answer to your question: Release the nose fix?'); })];
                    }); }); })];
            case 6:
                told = (_x = (_3.sent())) !== null && _x !== void 0 ? _x : '';
                expect(told).toContain('That press is the permission for the release: your next run of the release runner for /repo/wt goes through once, within the hour, with nothing more asked.');
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Release it”' })];
                    }); }); })];
            case 7:
                _e.apply(void 0, [(_y = (_3.sent())) === null || _y === void 0 ? void 0 : _y.props.dimColor]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                _f.apply(void 0, [(_3.sent()).some(function (b) { return b.props.label === 'Take back'; })]).toBe(false);
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('release of fix-nose from /repo/wt allowed once for a1');
                first = bash('r1', RELEASE);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, holding.get(RELEASE.slice(5))];
                    }); }); })];
            case 9:
                run = _3.sent();
                expect(grants().map(function (path) { var _a; return (function (_a) {
                    var host = _a.host, command = _a.command;
                    return [host, command];
                })(JSON.parse((_a = files.get(path)) !== null && _a !== void 0 ? _a : '{}')); })).toEqual([['release', '/repo/wt\nfix-nose']]);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 10:
                _g.apply(void 0, [(_3.sent()).some(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('gate-'); })]).toBe(false);
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 11:
                _h.apply(void 0, [_3.sent()]).toBeUndefined();
                run === null || run === void 0 ? void 0 : run('released');
                _j = expect;
                return [4 /*yield*/, first];
            case 12:
                _j.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                // A task runs its release in its own background, and its card is never Done while that runs: its hand-in is refused until the
                // release has ended (18 Nov, the person: "Until it's done releasing, it's not done")
                return [4 /*yield*/, bash('bgr', 'hold release-in-the-background', 'a1', { description: 'Release fix-nose', run_in_background: true })];
            case 13:
                // A task runs its release in its own background, and its card is never Done while that runs: its hand-in is refused until the
                // release has ended (18 Nov, the person: "Until it's done releasing, it's not done")
                _3.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-early', agentId: 'a1', message: 'Released.' })];
            case 14:
                early = (_3.sent());
                expect(early.deny).toContain('Not handed in: a command of yours still runs');
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^◐ Delivered/ })];
            case 15:
                _k.apply(void 0, [_3.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 'bgr-s', agentId: 'a1', task_id: 'bg-bgr' })
                    // Once: the same card's next release run is asked as any release nobody pressed for
                ];
            case 16:
                _3.sent();
                // Once: the same card's next release run is asked as any release nobody pressed for
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                // Once: the same card's next release run is asked as any release nobody pressed for
                _3.sent();
                second = bash('r2', 'hold xr2; /plug/claudopus/bin/release');
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, gateButton('gate-r2-r0-once-')];
                    }); }); })];
            case 18:
                _l.apply(void 0, [_3.sent()]).toBeDefined();
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 19:
                _m.apply(void 0, [(_z = (_3.sent())) === null || _z === void 0 ? void 0 : _z.props.dimColor]).toBe(true);
                _o = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Release fix-nose to main?' })];
            case 20:
                _o.apply(void 0, [(_0 = (_3.sent())) === null || _0 === void 0 ? void 0 : _0.props.color]).toBe(AMBER);
                _p = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 21:
                _p.apply(void 0, [(_3.sent()).filter(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('gate-r2-r0-'); }).map(function (b) { return b.props.label; })]).toEqual(['Allow', "Don't allow"]);
                _r = (_q = list).press;
                _u = {};
                return [4 /*yield*/, gateButton('gate-r2-r0-deny-')];
            case 22: return [4 /*yield*/, _r.apply(_q, [(_u.key = (_2 = (_1 = (_3.sent())) === null || _1 === void 0 ? void 0 : _1.key) !== null && _2 !== void 0 ? _2 : '', _u)])];
            case 23:
                _3.sent();
                wake();
                _s = expect;
                return [4 /*yield*/, second];
            case 24:
                _s.apply(void 0, [(_3.sent()).deny]).toBeDefined();
                expect(holding.has('xr2; /plug/claudopus/bin/release')).toBe(false);
                return [4 /*yield*/, list.unmount()];
            case 25:
                _3.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a reply in words that does not settle an ask keeps it, and the card active, with nothing to press while the work acts on it, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, clock, list, bar, typed, ASK, texts, labels, isFinished, _b, _c, box, told, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, back, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    var _13;
    var _this = this;
    var _14, _15, _16, _17, _18, _19, _20, _21, _22;
    return __generator(this, function (_23) {
        switch (_23.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _23.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'second round of terminal fixes', wait: false, origin: composer })];
            case 2:
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Terminal look, second round', prompt: 'second round of terminal fixes' }))];
            case 3:
                _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                bar = _23.sent();
                typed = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1:
                            _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()), true]))];
                            return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                        case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()), true])).length];
                    }
                }); }); };
                ASK = 'Release the second round of terminal fixes?';
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; })];
                    }
                }); }); };
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                isFinished = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, labels()];
                        case 1:
                            _a = (_b.sent()).some(function (label) { return label.includes('Finished'); });
                            if (_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, texts()];
                        case 2:
                            _a = (_b.sent()).some(function (text) { return text.startsWith('Finished'); });
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                }); }); };
                // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it'] })];
            case 6:
                // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release it? (Answer: Release it.) Built, tested and checked; nothing is released.' })];
            case 7:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 8:
                _23.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 9:
                _23.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: ASK })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [_23.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a1')];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Answer in words') ? askButtons(list, 'a1') : undefined)];
                        }
                    }); }); })];
            case 11:
                _c.apply(void 0, [_23.sent()]).toEqual(['Release it', 'Answer in words']);
                return [4 /*yield*/, inWords(list, bar, 'a1', 'Show me images first.')];
            case 12:
                box = _23.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('in their own words: Show me images first.'); })];
                    }); }); })];
            case 13:
                told = (_14 = (_23.sent())) !== null && _14 !== void 0 ? _14 : '';
                expect(told).toContain('does not settle your question by itself');
                expect(told).toContain('Continue the task with this answer');
                // The card stays among the running cards, at work, its question folded to the reply in one grey line, and nothing to press or
                // type; nothing is under Finished
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Show me images first.”' })];
                    }); }); })];
            case 14:
                // The card stays among the running cards, at work, its question folded to the reply in one grey line, and nothing to press or
                // type; nothing is under Finished
                _d.apply(void 0, [(_15 = (_23.sent())) === null || _15 === void 0 ? void 0 : _15.props.dimColor]).toBe(true);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 15:
                _e.apply(void 0, [_23.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, askButtons(list, 'a1')];
            case 16:
                _f.apply(void 0, [_23.sent()]).toEqual([]);
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, typed()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _g.apply(void 0, [_23.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 18:
                if (!((_16 = (_23.sent())) !== null && _16 !== void 0)) return [3 /*break*/, 19];
                _j = _16;
                return [3 /*break*/, 22];
            case 19:
                _l = (_k = JSON).stringify;
                _m = [[]];
                return [4 /*yield*/, labels()];
            case 20:
                _o = [__spreadArray.apply(void 0, _m.concat([(_23.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 21:
                _j = _l.apply(_k, [__spreadArray.apply(void 0, _o.concat([(_23.sent()), true]))]);
                _23.label = 22;
            case 22:
                _h.apply(void 0, [_j]).toBe(true);
                // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
                // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
                // time with the same reply
                return [4 /*yield*/, $.turn.complete({ answer: 'Release it? (Answer: Release it.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 23:
                // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
                // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
                // time with the same reply
                _23.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 24:
                _23.sent();
                _p = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 25:
                _p.apply(void 0, [(_17 = (_23.sent())) === null || _17 === void 0 ? void 0 : _17.props.color]).toBe(AMBER);
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, askButtons(list, 'a1')];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Answer in words') ? askButtons(list, 'a1') : undefined)];
                        }
                    }); }); })];
            case 26:
                _q.apply(void 0, [_23.sent()]).toEqual(['Release it', 'Answer in words']);
                // with the reply still said under it, as one that left it open
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ You answered “Show me images first.” · the question is still open' })];
            case 27:
                // with the reply still said under it, as one that left it open
                _r.apply(void 0, [_23.sent()]).toBeDefined();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 28:
                if (!((_18 = (_23.sent())) !== null && _18 !== void 0)) return [3 /*break*/, 29];
                _t = _18;
                return [3 /*break*/, 32];
            case 29:
                _v = (_u = JSON).stringify;
                _w = [[]];
                return [4 /*yield*/, labels()];
            case 30:
                _x = [__spreadArray.apply(void 0, _w.concat([(_23.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 31:
                _t = _v.apply(_u, [__spreadArray.apply(void 0, _x.concat([(_23.sent()), true]))]);
                _23.label = 32;
            case 32:
                _s.apply(void 0, [_t]).toBe(true);
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toHaveLength(1);
                return [4 /*yield*/, inWords(list, bar, 'a1', 'And the narrow window too, please.')];
            case 33:
                back = _23.sent();
                expect(back === null || back === void 0 ? void 0 : back.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                expect((_19 = back === null || back === void 0 ? void 0 : back.props.value) !== null && _19 !== void 0 ? _19 : '').toBe('');
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('the narrow window too'); })];
                    }); }); })];
            case 34:
                _y.apply(void 0, [_23.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Here is the narrow window.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' })];
            case 35:
                _23.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 36:
                _23.sent();
                _z = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 37:
                _z.apply(void 0, [_23.sent()]).toBeDefined();
                _1 = (_0 = list).press;
                _13 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 38: return [4 /*yield*/, _1.apply(_0, [(_13.key = (_21 = (_20 = (_23.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _20 === void 0 ? void 0 : _20.key) !== null && _21 !== void 0 ? _21 : '', _13)])];
            case 39:
                _23.sent();
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 40:
                _2.apply(void 0, [_23.sent()]).toBeDefined();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 41:
                _3.apply(void 0, [_23.sent()]).toBe(true);
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 42:
                if (!((_22 = (_23.sent())) !== null && _22 !== void 0)) return [3 /*break*/, 43];
                _5 = _22;
                return [3 /*break*/, 46];
            case 43:
                _7 = (_6 = JSON).stringify;
                _8 = [[]];
                return [4 /*yield*/, labels()];
            case 44:
                _9 = [__spreadArray.apply(void 0, _8.concat([(_23.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 45:
                _5 = _7.apply(_6, [__spreadArray.apply(void 0, _9.concat([(_23.sent()), true]))]);
                _23.label = 46;
            case 46:
                _4.apply(void 0, [_5]).toBe(true);
                return [4 /*yield*/, $.turn.complete({ answer: 'Released as 0.2.77.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' })];
            case 47:
                _23.sent();
                return [4 /*yield*/, clock.advance(60000)
                    // Done, it stays among the cards, saying so, until the person dismisses it: only then is it under Finished
                ];
            case 48:
                _23.sent();
                // Done, it stays among the cards, saying so, until the person dismisses it: only then is it under Finished
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^◐ Delivered/ })];
                    }); }); })];
            case 49:
                // Done, it stays among the cards, saying so, until the person dismisses it: only then is it under Finished
                _10.apply(void 0, [_23.sent()]).toBeDefined();
                _11 = expect;
                return [4 /*yield*/, isFinished()];
            case 50:
                _11.apply(void 0, [_23.sent()]).toBe(false);
                return [4 /*yield*/, pressed(list, 'dismiss-a1')];
            case 51:
                _23.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 52:
                _23.sent();
                _12 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 53:
                _12.apply(void 0, [_23.sent()]).toBe(true);
                return [4 /*yield*/, Promise.all([list.unmount(), bar.unmount()])];
            case 54:
                _23.sent();
                return [2 /*return*/];
        }
    });
}); });
test('once the person has answered, by a button or in their own words, the question is gone from the card at once, one grey line of the answer in its place that opens Details, where both are whole; a press holds the rows the question took for a moment; the same ask asked again comes back fresh, in the panel and the chat: the 14 Nov "I would say maybe stop it" to "Should I stop the depth job?", and the 19 Nov "no need to keep showing the question"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, logged, clock, opened, list, bar, ASK, DETAILS, inputs, labels, WHOLE, relays, _b, _c, REPLY, box, _d, _e, _f, said, _g, _h, _j, details, _k, _l, toChat, _m, _o, _p, _q, _r, again, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, pressedThere, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
    var _15, _16;
    var _this = this;
    var _17, _18, _19, _20, _21, _22, _23, _24, _25, _26;
    return __generator(this, function (_27) {
        switch (_27.label) {
            case 0:
                _a = world(on), appended = _a.appended, logged = _a.logged, clock = _a.clock, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _27.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'why the M4 is stuck', wait: false, origin: composer })];
            case 2:
                _27.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Why the M4 is stuck', prompt: 'why the M4 is stuck' }))];
            case 3:
                _27.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _27.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                bar = _27.sent();
                ASK = 'Should I stop the depth job on your other Mac?';
                DETAILS = 'Your other Mac is using 42 of its 44 GB of swap.';
                inputs = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1:
                            _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()), true]))];
                            return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                        case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()), true]))];
                    }
                }); }); };
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, askButtons(list, 'a1')];
                }); }); };
                WHOLE = ['Stop it', 'Leave it running', 'Answer in words'];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] })];
            case 6:
                _27.sent();
                relays = function () { return appended.filter(function (line) { return line.startsWith('undefined: In the background task') && line.includes(ASK); }).length; };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, relays() || undefined];
                    }); }); })];
            case 7:
                _b.apply(void 0, [_27.sent()]).toBe(1);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 3 ? labels() : undefined)];
                        }
                    }); }); })];
            case 8:
                _c.apply(void 0, [_27.sent()]).toEqual(WHOLE);
                REPLY = 'I would say maybe stop it and then tell it to release it, once the swap is under 10 GB';
                return [4 /*yield*/, inWords(list, bar, 'a1', REPLY)];
            case 9:
                box = _27.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('maybe stop it'); })];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_27.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_27.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: DETAILS })];
            case 12:
                _f.apply(void 0, [_27.sent()]).toBeUndefined();
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You answered “I would say maybe stop it/ })];
            case 13:
                said = _27.sent();
                expect([said === null || said === void 0 ? void 0 : said.text, said === null || said === void 0 ? void 0 : said.props.dimColor, said === null || said === void 0 ? void 0 : said.props.wrap]).toEqual(['✓ You answered “I would say maybe stop it and then tell it to release it, …”', true, 'truncate-end']);
                _g = expect;
                return [4 /*yield*/, labels()];
            case 14:
                _g.apply(void 0, [_27.sent()]).toEqual([]);
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 15:
                _h.apply(void 0, [_27.sent()]).toBe(true);
                return [4 /*yield*/, pressed(list, 'answered-a1')];
            case 16:
                _27.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 17:
                _j.apply(void 0, [_27.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 18:
                details = _27.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, details.find({ type: 'Text', text: ASK })];
                    }); }); })];
            case 19:
                _k.apply(void 0, [(_17 = (_27.sent())) === null || _17 === void 0 ? void 0 : _17.props.color]).toBe(PURPLE);
                _l = expect;
                return [4 /*yield*/, details.find({ type: 'Text', text: "\u2713 You answered \u201C".concat(REPLY, "\u201D") })];
            case 20:
                _l.apply(void 0, [_27.sent()]).toBeDefined();
                return [4 /*yield*/, details.unmount()
                    // The chat's model is told it acts on the reply, not that it still asks; the person, who replied on the card, is not shown it
                ];
            case 21:
                _27.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ✓ The person replied to "Why the M4 is stuck"'); })];
                    }); }); })];
            case 22:
                toChat = (_18 = (_27.sent())) !== null && _18 !== void 0 ? _18 : '';
                expect(toChat).toContain('will ask again if it still needs the person');
                expect(toChat).not.toContain('It still asks');
                expect(logged.filter(function (line) { return line.startsWith('✓'); })).toEqual([]);
                // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
                _27.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] })];
            case 24:
                _27.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color) === '#E5A50A' ? true : undefined)];
                        }
                    }); }); })];
            case 25:
                _m.apply(void 0, [_27.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 3 ? labels() : undefined)];
                        }
                    }); }); })];
            case 26:
                _o.apply(void 0, [_27.sent()]).toEqual(WHOLE);
                _p = expect;
                return [4 /*yield*/, inputs()];
            case 27:
                _p.apply(void 0, [_27.sent()]).toEqual([]);
                _r = (_q = list).press;
                _15 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 28: return [4 /*yield*/, _r.apply(_q, [(_15.key = (_20 = (_19 = (_27.sent()).find(function (b) { return b.props.label === 'Answer in words'; })) === null || _19 === void 0 ? void 0 : _19.key) !== null && _20 !== void 0 ? _20 : '', _15)])];
            case 29:
                _27.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 30:
                again = _27.sent();
                expect((_21 = again === null || again === void 0 ? void 0 : again.props.value) !== null && _21 !== void 0 ? _21 : '').toBe('');
                expect(again === null || again === void 0 ? void 0 : again.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                _s = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 31:
                _s.apply(void 0, [_27.sent()]).toBeUndefined();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (relays() === 2 ? true : undefined)];
                    }); }); })];
            case 32:
                _t.apply(void 0, [_27.sent()]).toBe(true);
                _v = (_u = list).press;
                _16 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 33: 
            // A button pressed: the ask goes whole, nothing left to press or type. Its grey line stands where the question stood, over the
            // rows the question took, held so nothing below moves up under the pointer, until they close up a moment later
            return [4 /*yield*/, _v.apply(_u, [(_16.key = (_23 = (_22 = (_27.sent()).find(function (b) { return b.props.label === 'Stop it'; })) === null || _22 === void 0 ? void 0 : _22.key) !== null && _23 !== void 0 ? _23 : '', _16)])];
            case 34:
                // A button pressed: the ask goes whole, nothing left to press or type. Its grey line stands where the question stood, over the
                // rows the question took, held so nothing below moves up under the pointer, until they close up a moment later
                _27.sent();
                _w = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Stop it"'); })];
                    }); }); })];
            case 35:
                _w.apply(void 0, [_27.sent()]).toBeDefined();
                _x = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 36:
                _x.apply(void 0, [_27.sent()]).toBe(true);
                _y = expect;
                return [4 /*yield*/, labels()];
            case 37:
                _y.apply(void 0, [_27.sent()]).toEqual([]);
                _z = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 38:
                _z.apply(void 0, [_27.sent()]).toBe(true);
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Stop it”' })];
                    }); }); })];
            case 39:
                _0.apply(void 0, [(_24 = (_27.sent())) === null || _24 === void 0 ? void 0 : _24.props.dimColor]).toBe(true);
                _1 = expect;
                _2 = Number;
                return [4 /*yield*/, list.find({ type: 'Box', key: 'fold-a1' })];
            case 40:
                _1.apply(void 0, [_2.apply(void 0, [(_26 = (_25 = (_27.sent())) === null || _25 === void 0 ? void 0 : _25.props.height) !== null && _26 !== void 0 ? _26 : 0])]).toBeGreaterThan(3);
                return [4 /*yield*/, clock.advance(3100)];
            case 41:
                _27.sent();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Box', key: 'fold-a1' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 42:
                _3.apply(void 0, [_27.sent()]).toBe(true);
                _4 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ You answered “Stop it”' })];
            case 43:
                _4.apply(void 0, [_27.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 44:
                pressedThere = _27.sent();
                _5 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pressedThere.find({ type: 'Text', text: ASK })];
                    }); }); })];
            case 45:
                _5.apply(void 0, [_27.sent()]).toBeDefined();
                _6 = expect;
                return [4 /*yield*/, pressedThere.find({ type: 'Markdown', text: DETAILS })];
            case 46:
                _6.apply(void 0, [_27.sent()]).toBeDefined();
                return [4 /*yield*/, pressedThere.unmount()
                    // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
                ];
            case 47:
                _27.sent();
                // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 48:
                // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
                _27.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] })];
            case 49:
                _27.sent();
                _7 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (relays() === 3 ? true : undefined)];
                    }); }); })];
            case 50:
                _7.apply(void 0, [_27.sent()]).toBe(true);
                return [4 /*yield*/, $.prompt.submit({ text: 'Show me the swap first', wait: false, origin: composer })];
            case 51:
                _27.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their reply: “Show me the swap first”' })];
            case 52:
                _27.sent();
                _8 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Show me the swap first”' })];
                    }); }); })];
            case 53:
                _8.apply(void 0, [_27.sent()]).toBeDefined();
                _9 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 54:
                _9.apply(void 0, [_27.sent()]).toBeUndefined();
                _10 = expect;
                return [4 /*yield*/, labels()];
            case 55:
                _10.apply(void 0, [_27.sent()]).toEqual([]);
                _11 = expect;
                return [4 /*yield*/, inputs()];
            case 56:
                _11.apply(void 0, [_27.sent()]).toEqual([]);
                return [4 /*yield*/, clock.advance(1000)];
            case 57:
                _27.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Leave it running'] })];
            case 58:
                _27.sent();
                _12 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (relays() === 4 ? true : undefined)];
                    }); }); })];
            case 59:
                _12.apply(void 0, [_27.sent()]).toBe(true);
                _13 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 3 ? labels() : undefined)];
                        }
                    }); }); })];
            case 60:
                _13.apply(void 0, [_27.sent()]).toEqual(WHOLE);
                _14 = expect;
                return [4 /*yield*/, inputs()];
            case 61:
                _14.apply(void 0, [_27.sent()]).toEqual([]);
                return [4 /*yield*/, Promise.all([list.unmount(), bar.unmount()])];
            case 62:
                _27.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a button answer pressed by mistake is taken back from its card while the card says it: the question comes back with its buttons, the work is told not to act on it, and the next press answers; gone once the work asks again: the 16 Nov press that landed on an answer while reaching for the picture', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, clock, list, ASK, labels, press, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, stale, _o, _p, _q;
    var _this = this;
    var _r, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                _a = world(on), appended = _a.appended, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _u.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Make the banner', prompt: 'banner' }))];
            case 2:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _u.sent();
                ASK = 'Use banner 5 on your page?';
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                press = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = list).press;
                                _c = {};
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent()).find(function (b) { return String(b.props.label) === label; })) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Use it', 'Keep banner 4'] })];
            case 4:
                _u.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Keep banner 4') ? true : undefined)];
                        }
                    }); }); })];
            case 5:
                _b.apply(void 0, [_u.sent()]).toBe(true);
                return [4 /*yield*/, press('Keep banner 4')];
            case 6:
                _u.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Keep banner 4"'); })];
                    }); }); })];
            case 7:
                _c.apply(void 0, [_u.sent()]).toBeDefined();
                // Beside the one grey line of what was pressed
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Take back') ? true : undefined)];
                        }
                    }); }); })];
            case 8:
                // Beside the one grey line of what was pressed
                _d.apply(void 0, [_u.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ You answered “Keep banner 4”' })];
            case 9:
                _e.apply(void 0, [_u.sent()]).toBeDefined();
                return [4 /*yield*/, press('Take back')];
            case 10:
                _u.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('took back their answer "Keep banner 4"'); })];
                    }); }); })];
            case 11:
                _f.apply(void 0, [_u.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Use it') ? true : undefined)];
                        }
                    }); }); })];
            case 12:
                _g.apply(void 0, [_u.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, labels()];
            case 13:
                _h.apply(void 0, [_u.sent()]).not.toContain('Take back');
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 14:
                _j.apply(void 0, [(_r = (_u.sent())) === null || _r === void 0 ? void 0 : _r.props.color]).toBe(AMBER);
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 15:
                _k.apply(void 0, [_u.sent()]).toBeUndefined();
                // Answered again, it goes as any answer
                return [4 /*yield*/, press('Use it')];
            case 16:
                // Answered again, it goes as any answer
                _u.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Use it"'); })];
                    }); }); })];
            case 17:
                _l.apply(void 0, [_u.sent()]).toBeDefined();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Take back') ? true : undefined)];
                        }
                    }); }); })];
            case 18:
                _m.apply(void 0, [_u.sent()]).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 19:
                stale = (_t = (_s = (_u.sent()).find(function (b) { return String(b.props.label) === 'Take back'; })) === null || _s === void 0 ? void 0 : _s.key) !== null && _t !== void 0 ? _t : '';
                expect(stale).not.toBe('');
                return [4 /*yield*/, clock.advance(1000)];
            case 20:
                _u.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Upload it now?', choices: ['Upload'] })];
            case 21:
                _u.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Upload') ? true : undefined)];
                        }
                    }); }); })];
            case 22:
                _o.apply(void 0, [_u.sent()]).toBe(true);
                _p = expect;
                return [4 /*yield*/, labels()];
            case 23:
                _p.apply(void 0, [_u.sent()]).not.toContain('Take back');
                return [4 /*yield*/, list.press({ key: stale }).catch(function () { return undefined; })];
            case 24:
                _u.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 25:
                _u.sent();
                expect(appended.some(function (line) { return line.includes('took back their answer "Use it"'); })).toBe(false);
                _q = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Upload it now?' })];
            case 26:
                _q.apply(void 0, [_u.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 27:
                _u.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with no buttons, its question folded to the reply on the card and whole in Details and the terminal\'s band; stopped again it is amber with them: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, resumed, clock, ASK, isPurple, desk, details, edges, inTerminal, look, before, _b, _c, _d, acting, _e, _f, now, _i, _g, labels, _h, _j, held, _k, after, _l, _m, _o, _p, labels, _q, _r, _s, _t, _u, released, _v, _w, _x, _y, _z, _0, pane;
    var _1;
    var _this = this;
    var _2, _3;
    return __generator(this, function (_4) {
        switch (_4.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _4.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'clip wallet versus affiliate', wait: false, origin: composer })];
            case 2:
                _4.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Clipify affiliate versus clip wallet', prompt: 'clip wallet versus affiliate' }))];
            case 3:
                _4.sent();
                ASK = 'Release PR 54 to production?';
                isPurple = function (colour) { return /^#(8A63F0|6E3CFF)/i.test(String(colour)); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                desk = _4.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))
                    // The edge of the card beside its title, in each drawing: amber, purple or green
                ];
            case 5:
                details = _4.sent();
                edges = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return b.props.backgroundColor; }).filter(function (c) { return c === AMBER || isPurple(c); })
                            // The terminal's panel and band are drawn afresh for each look, as a terminal draws them
                        ];
                    }
                }); }); };
                inTerminal = function (of, read) { return __awaiter(_this, void 0, void 0, function () {
                    var pane, got;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, of), { surface: 'terminal' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, read(pane)];
                            case 2:
                                got = _a.sent();
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, got];
                        }
                    });
                }); };
                look = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    var _b;
                    var _this = this;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = {};
                                return [4 /*yield*/, desk.find({ type: 'Text', text: ASK })];
                            case 1:
                                _b.desk = (_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.props.color;
                                return [4 /*yield*/, inTerminal(LIST, function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: ASK })];
                                            case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color];
                                        }
                                    }); }); })];
                            case 2:
                                _b.term = _d.sent();
                                return [4 /*yield*/, inTerminal(BAND, function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (t) { return t.text === ASK && t.props.color; })) === null || _a === void 0 ? void 0 : _a.props.color];
                                        }
                                    }); }); })];
                            case 3:
                                // The band's ask is a line of its own inside the line that names the work
                                _b.band = _d.sent();
                                return [4 /*yield*/, edges(desk)];
                            case 4:
                                _b.deskEdges = _d.sent();
                                return [4 /*yield*/, inTerminal(LIST, edges)];
                            case 5:
                                _b.termEdges = _d.sent();
                                return [4 /*yield*/, desk.findAll({ type: 'Button' })];
                            case 6:
                                _a = [_d.sent()];
                                return [4 /*yield*/, inTerminal(LIST, function (pane) { return pane.findAll({ type: 'Button' }); })];
                            case 7:
                                _a = _a.concat([_d.sent()]);
                                return [4 /*yield*/, inTerminal(BAND, function (pane) { return pane.findAll({ type: 'Button' }); })];
                            case 8:
                                _b.buttons = _a.concat([_d.sent()]).map(function (all) { return all.map(function (b) { return b.props.label; }); });
                                return [4 /*yield*/, details.find({ type: 'Text', text: ASK }).then(function (q) { return (!q ? 'none' : q.props.color === AMBER ? 'needs' : isPurple(q.props.color) ? 'acting' : 'other'); })];
                            case 9: return [2 /*return*/, (
                                // Its Details: the question's block in amber while it waits on the person, in purple while the work acts on their reply
                                _b.heading = _d.sent(),
                                    _b)];
                        }
                    });
                }); };
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it'] })
                    // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                ];
            case 6:
                _4.sent();
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release PR 54 to production? (Answers: Release it / Not now.)' })];
            case 7:
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                _4.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 8:
                _4.sent();
                return [4 /*yield*/, clock.advance(60000)
                    // Before the reply: it waits on the person, amber everywhere
                ];
            case 9:
                _4.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && l.deskEdges.includes(AMBER) && l.termEdges.includes(AMBER) ? l : undefined];
                            }
                        });
                    }); })];
            case 10:
                before = _4.sent();
                _b = expect;
                if (!(before !== null && before !== void 0)) return [3 /*break*/, 11];
                _c = before;
                return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, look()];
            case 12:
                _c = (_4.sent());
                _4.label = 13;
            case 13:
                _b.apply(void 0, [_c]).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' });
                // The reply in words, typed in the terminal's panel, where the bar above the prompt draws no field and the block has the one
                // field itself, with no Answer in words to press. It starts the work again: purple while it acts on it, its question still
                // there and nothing to press, in the panel, in Details, in the terminal's panel and in its band
                return [4 /*yield*/, inTerminal(LIST, function (pane) { return __awaiter(_this, void 0, void 0, function () {
                        var fields, _a;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, pane.findAll({ type: 'Input' })];
                                case 1:
                                    fields = (_d.sent()).filter(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                                    expect(fields.map(function (one) { return [one.props.placeholder, one.props.rows]; })).toEqual([['Answer in words', undefined]]);
                                    _a = expect;
                                    return [4 /*yield*/, askButtons(pane, 'a1')];
                                case 2:
                                    _a.apply(void 0, [_d.sent()]).toEqual(['Release it']);
                                    return [4 /*yield*/, pane.input({ key: (_c = (_b = fields[0]) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : '', text: 'Explain to me the exact differences first.' })];
                                case 3:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 14:
                // The reply in words, typed in the terminal's panel, where the bar above the prompt draws no field and the block has the one
                // field itself, with no Answer in words to press. It starts the work again: purple while it acts on it, its question still
                // there and nothing to press, in the panel, in Details, in the terminal's panel and in its band
                _4.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('Explain to me the exact differences first.'); })];
                    }); }); })];
            case 15:
                _d.apply(void 0, [_4.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.desk === undefined && l.term === undefined && isPurple(l.band) && l.heading === 'acting' && l.deskEdges.some(isPurple) ? l : undefined];
                            }
                        });
                    }); })];
            case 16:
                acting = _4.sent();
                _e = expect;
                if (!(acting !== null && acting !== void 0)) return [3 /*break*/, 17];
                _f = acting;
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, look()];
            case 18:
                _f = (_4.sent());
                _4.label = 19;
            case 19:
                _e.apply(void 0, [_f]).toMatchObject({ desk: undefined, term: undefined, heading: 'acting' });
                return [4 /*yield*/, look()];
            case 20:
                now = _4.sent();
                expect(now.deskEdges.filter(function (c) { return c === AMBER; })).toEqual([]);
                expect(now.termEdges.filter(function (c) { return c === AMBER; })).toEqual([]);
                expect(now.deskEdges.some(isPurple)).toBe(true);
                expect(now.termEdges.some(isPurple)).toBe(true);
                for (_i = 0, _g = now.buttons; _i < _g.length; _i++) {
                    labels = _g[_i];
                    expect(labels.filter(function (label) { return label === 'Release it' || label === 'Answer in words'; })).toEqual([]);
                }
                _h = expect;
                return [4 /*yield*/, details.findAll({ type: 'Button' })];
            case 21:
                _h.apply(void 0, [(_4.sent()).some(function (b) { return b.props.label === 'Release it'; })]).toBe(false);
                // (nothing to type for the question: the box at the bottom of Details is the task's own message box)
                _j = expect;
                return [4 /*yield*/, details.findAll({ type: 'Input' })];
            case 22:
                // (nothing to type for the question: the box at the bottom of Details is the task's own message box)
                _j.apply(void 0, [(_4.sent()).some(function (one) { var _a, _b; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : '') && !/^details-.*-reply-change-/.test((_b = one.key) !== null && _b !== void 0 ? _b : ''); })]).toBe(false);
                // Its turn ends while a command it started in the background still runs, the engine listing it as running: it has not stopped,
                // and stays purple
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Writing up the differences.', durationMs: 1, isAborted: false, turnId: 'turn-2a', reason: 'answer', agentId: 'a1' })];
            case 23:
                _4.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 24:
                _4.sent();
                return [4 /*yield*/, look()];
            case 25:
                held = _4.sent();
                expect([held.desk, held.term, isPurple(held.band), held.heading]).toEqual([undefined, undefined, true, 'acting']);
                agents.a1 = 'completed';
                // The header counts it as running, not as needing the person
                _k = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^1 (task )?working/ })];
            case 26:
                // The header counts it as running, not as needing the person
                _k.apply(void 0, [_4.sent()]).toBeDefined();
                // It stops again with the ask still open, the engine listing it as running for a moment as its turn ends: amber again a moment
                // later, once the engine lists its run as over
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Release PR 54 to production? (Answer: Release it.) The differences are…', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })
                    // Listed as idle after, as the engine lists some ended work
                ];
            case 27:
                _4.sent();
                // Listed as idle after, as the engine lists some ended work
                agents.a1 = 'idle';
                return [4 /*yield*/, clock.advance(2000)];
            case 28:
                _4.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && !l.deskEdges.some(isPurple) && !l.termEdges.some(isPurple) ? l : undefined];
                            }
                        });
                    }); })];
            case 29:
                after = _4.sent();
                _l = expect;
                if (!(after !== null && after !== void 0)) return [3 /*break*/, 30];
                _m = after;
                return [3 /*break*/, 32];
            case 30: return [4 /*yield*/, look()];
            case 31:
                _m = (_4.sent());
                _4.label = 32;
            case 32:
                _l.apply(void 0, [_m]).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' });
                _o = 0;
                return [4 /*yield*/, look()];
            case 33:
                _p = (_4.sent()).buttons;
                _4.label = 34;
            case 34:
                if (!(_o < _p.length)) return [3 /*break*/, 36];
                labels = _p[_o];
                expect(labels).toEqual(expect.arrayContaining(['Release it']));
                _4.label = 35;
            case 35:
                _o++;
                return [3 /*break*/, 34];
            case 36:
                _q = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^1 waiting for you/ })];
            case 37:
                _q.apply(void 0, [_4.sent()]).toBeDefined();
                _s = (_r = desk).press;
                _1 = {};
                return [4 /*yield*/, desk.findAll({ type: 'Button' })];
            case 38: 
            // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
            return [4 /*yield*/, _s.apply(_r, [(_1.key = (_3 = (_2 = (_4.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _2 === void 0 ? void 0 : _2.key) !== null && _3 !== void 0 ? _3 : '', _1)])];
            case 39:
                // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
                _4.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 40:
                _t.apply(void 0, [_4.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 41:
                _u.apply(void 0, [_4.sent()]).toBe(true);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.deskEdges.some(isPurple) && !l.deskEdges.includes(AMBER) && l.termEdges.some(isPurple) && !l.termEdges.includes(AMBER) ? l : undefined];
                            }
                        });
                    }); })];
            case 42:
                released = _4.sent();
                _v = expect;
                if (!(released !== null && released !== void 0)) return [3 /*break*/, 43];
                _w = released;
                return [3 /*break*/, 45];
            case 43: return [4 /*yield*/, look()];
            case 44:
                _w = (_4.sent());
                _4.label = 45;
            case 45:
                _v.apply(void 0, [_w]).toMatchObject({ desk: undefined });
                // (Details keeps the question just answered, with the answer under it, in neither amber nor purple)
                expect(released === null || released === void 0 ? void 0 : released.heading).toBe('other');
                // Releasing in the background, its turn ends with the engine still holding it: at work, purple, until it is done
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Releasing in the background.', durationMs: 1, isAborted: false, turnId: 'turn-3a', reason: 'answer', agentId: 'a1' })];
            case 46:
                _4.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 47:
                _4.sent();
                _x = expect;
                return [4 /*yield*/, edges(desk)];
            case 48:
                _x.apply(void 0, [(_4.sent()).some(isPurple)]).toBe(true);
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Released PR 54.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' })];
            case 49:
                _4.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 50:
                _4.sent();
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, edges(desk)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(isPurple) ? undefined : true)];
                        }
                    }); }); })];
            case 51:
                _y.apply(void 0, [_4.sent()]).toBe(true);
                _z = 0, _0 = [desk, details];
                _4.label = 52;
            case 52:
                if (!(_z < _0.length)) return [3 /*break*/, 55];
                pane = _0[_z];
                return [4 /*yield*/, pane.unmount()];
            case 53:
                _4.sent();
                _4.label = 54;
            case 54:
                _z++;
                return [3 /*break*/, 52];
            case 55: return [2 /*return*/];
        }
    });
}); });
test('every ask also shows in the chat as the mod\'s notice, never as the person\'s message, with its answers and pictures; an answer typed there reaches the work and the card stops asking', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, submitted, logged, files, clock, list, asked, relay, _b, _c, _d, _e, _f, _g, _h, _j;
    var _k;
    var _this = this;
    var _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _a = world(on), appended = _a.appended, submitted = _a.submitted, logged = _a.logged, files = _a.files, clock = _a.clock;
                files.set('/w/shots/a.png', 'png');
                files.set('/w/shots/b.png', 'png');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw the logo', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw the logo', prompt: 'redraw the logo' }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png', '/w/shots/gone.png', 'rel.png'] })];
            case 5:
                asked = _p.sent();
                expect(String(asked.result)).toContain('shown in the chat as a notice from the panel');
                expect(String(asked.result)).toContain('Its 2 pictures are drawn small on the card');
                expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here');
                // The chat shows nothing of the ask, which is on its card, and never a prompt in the person's place (18 Nov: a line in the chat
                // for every ask was among "these fucking shits within the chat"); its model reads the ask, and how to pass an answer on, in a row
                // the person does not see
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                // The chat shows nothing of the ask, which is on its card, and never a prompt in the person's place (18 Nov: a line in the chat
                // for every ask was among "these fucking shits within the chat"); its model reads the ask, and how to pass an answer on, in a row
                // the person does not see
                _p.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: In the background task "Redraw the logo", Claude asked the person'); })];
                    }); }); })];
            case 7:
                relay = (_l = (_p.sent())) !== null && _l !== void 0 ? _l : '';
                expect(submitted.some(function (line) { return line.includes('Which logo do you want?'); })).toBe(false);
                expect(logged.some(function (line) { return line.includes('Which logo do you want?'); })).toBe(false);
                expect(relay).toContain('Which logo do you want? (buttons: A · B; pictures: /w/shots/a.png, /w/shots/b.png)');
                expect(relay).toContain('do not pass it on');
                expect(relay).toContain('SendUserFile');
                // Pictures sent as "proactive" did not show in the chat; "normal" ones did
                expect(relay).toContain('status "normal"');
                expect(relay).not.toContain('proactive');
                expect(relay).toContain('SendMessage to "a1"');
                // The same ask said again is not sent again
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png'] })];
            case 8:
                // The same ask said again is not sent again
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 9:
                _p.sent();
                expect(appended.filter(function (line) { return line.includes('Claude asked the person') && line.includes('Which logo do you want?'); })).toHaveLength(1);
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                return [4 /*yield*/, $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })];
            case 10:
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' })];
            case 11:
                _p.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Which logo do you want?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_p.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your question: \"Which logo do you want?\""); })];
                    }); }); })];
            case 13:
                _c.apply(void 0, [_p.sent()]).toBeDefined();
                expect(appended.some(function (line) { return line.includes('Decide which of three it is'); })).toBe(false);
                // A press on the card no longer counts for that ask
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 14:
                // A press on the card no longer counts for that ask
                _d.apply(void 0, [(_p.sent()).find(function (b) { return b.props.label === 'B'; })]).toBeUndefined();
                // An ask answered on the card, or withdrawn by the work, is told to the chat's model alone: the card shows it
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push'] })];
            case 15:
                // An ask answered on the card, or withdrawn by the work, is told to the chat's model alone: the card shows it
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 16:
                _p.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.some(function (line) { return line.includes('Claude asked the person') && line.includes('May I push it?'); }) || undefined];
                    }); }); })];
            case 17:
                _e.apply(void 0, [_p.sent()]).toBe(true);
                _g = (_f = list).press;
                _k = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18: return [4 /*yield*/, _g.apply(_f, [(_k.key = (_o = (_m = (_p.sent()).find(function (b) { return b.props.label === 'Push'; })) === null || _m === void 0 ? void 0 : _m.key) !== null && _o !== void 0 ? _o : '', _k)])];
            case 19:
                _p.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ✓ The person answered "Redraw the logo" on its card: “Push”'); })];
                    }); }); })];
            case 20:
                _h.apply(void 0, [_p.sent()]).toBeDefined();
                expect(logged.some(function (line) { return line.startsWith('✓'); })).toBe(false);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' })];
            case 21:
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 22:
                _p.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.some(function (line) { return line.includes('Claude asked the person') && line.includes('Sign in to Vercel.'); }) || undefined];
                    }); }); })];
            case 23:
                _j.apply(void 0, [_p.sent()]).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' })];
            case 24:
                _p.sent();
                expect(appended.some(function (line) { return line === 'undefined: Claude took back its question in "Redraw the logo". You don\'t need to answer it.'; })).toBe(true);
                expect(logged.some(function (line) { return line.startsWith('Claude took back its question'); })).toBe(false);
                expect(submitted).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 25:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an ask carries what it is about, whole, on the small card, in Details and in the chat: the 13 Nov "Release PR 54, with the exact differences as explained in the chat?" asked before its explanation arrived', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, logged, clock, notified, list, away, _b, _i, _c, text, _d, _e, _f, _g, text, _h, _j, bare, differences, asked, _k, big, _l, band, _m, relay, _o, _p, _q, _r, long, cutShort, _s, question, many, _t, _u, longRelay;
    var _v;
    var _this = this;
    var _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                _a = world(on), appended = _a.appended, logged = _a.logged, clock = _a.clock, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _0.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the wallet', wait: false, origin: composer })];
            case 2:
                _0.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the wallet', prompt: 'fix the wallet' }))];
            case 3:
                _0.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // What happened: the ask pointed at an explanation that reached the person only with the report, after the work ended. Now it is
                    // not shown at all: no card, no sound, no notice
                ];
            case 4:
                list = _0.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it'] })];
            case 5:
                away = _0.sent();
                expect(String(away.result)).toContain('Not shown: the question points at an explanation');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Release PR 54/ })];
            case 6:
                _b.apply(void 0, [_0.sent()]).toBeUndefined();
                expect(notified.some(function (line) { return line.includes('Release PR 54'); })).toBe(false);
                _i = 0, _c = ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?'];
                _0.label = 7;
            case 7:
                if (!(_i < _c.length)) return [3 /*break*/, 10];
                text = _c[_i];
                _d = expect;
                _e = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text, choices: ['Release it'] })];
            case 8:
                _d.apply(void 0, [_e.apply(void 0, [(_0.sent()).result])]).toContain('Not shown');
                _0.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                _f = 0, _g = ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?'];
                _0.label = 11;
            case 11:
                if (!(_f < _g.length)) return [3 /*break*/, 14];
                text = _g[_f];
                _h = expect;
                _j = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text })];
            case 12:
                _h.apply(void 0, [_j.apply(void 0, [(_0.sent()).result])]).toContain('Shown on your card');
                _0.label = 13;
            case 13:
                _f++;
                return [3 /*break*/, 11];
            case 14: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it'] })];
            case 15:
                bare = _0.sent();
                expect(String(bare.result)).toContain('It carries no details');
                differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it'] })];
            case 16:
                asked = _0.sent();
                expect(String(asked.result)).toContain('what it is about under it');
                expect(String(asked.result)).not.toContain('carries no details');
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 17:
                _k.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 18:
                big = _0.sent();
                _l = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: differences })];
            case 19:
                _l.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 20:
                band = _0.sent();
                _m = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /^The details are on its card · / })];
            case 21:
                _m.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()
                    // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                ];
            case 22:
                _0.sent();
                // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                return [4 /*yield*/, clock.advance(10)];
            case 23:
                // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                _0.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], appended, true).reverse().find(function (line) { return line.startsWith('undefined: In the background task "Fix the wallet", Claude asked the person') && line.includes('Release PR 54 to production?'); })];
                    }); }); })];
            case 24:
                relay = (_w = (_0.sent())) !== null && _w !== void 0 ? _w : '';
                expect(logged.some(function (line) { return line.includes('Release PR 54 to production?'); })).toBe(false);
                expect(relay).toContain("what it is about, which the person sees in full with it on the card: ".concat(differences));
                // The chat is told not to say it again: the person has just read it
                expect(relay).toContain('do not repeat what it is about');
                _p = (_o = list).press;
                _v = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 25: 
            // A pressed answer still matches the ask that carries details
            return [4 /*yield*/, _p.apply(_o, [(_v.key = (_y = (_x = (_0.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _x === void 0 ? void 0 : _x.key) !== null && _y !== void 0 ? _y : '', _v)])];
            case 26:
                // A pressed answer still matches the ask that carries details
                _0.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?'); })];
                    }); }); })];
            case 27:
                _q.apply(void 0, [_0.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 28:
                _r.apply(void 0, [_0.sent()]).toBeUndefined();
                long = "Release it? ".concat('The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)).trim();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it'] })];
            case 29:
                cutShort = _0.sent();
                expect(String(cutShort.result)).toContain('whole at the top of its details');
                _s = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: long })];
            case 30:
                _s.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, big.findAll({ type: 'Text' })];
            case 31:
                question = (_0.sent()).find(function (one) { return one.props.bold && String(one.text).startsWith('Release it? The refund rule'); });
                expect(question).toBeDefined();
                expect(String(question === null || question === void 0 ? void 0 : question.text).length).toBeLessThanOrEqual(302);
                expect(String(question === null || question === void 0 ? void 0 : question.text)).toMatch(/[a-z.] …$/);
                many = Array.from({ length: 120 }, function (_, n) { return "- Line ".concat(n + 1, " of what changes on the payout screens."); }).join('\n');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it'] })];
            case 32:
                _0.sent();
                _t = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: many })];
            case 33:
                _t.apply(void 0, [_0.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })];
            case 34:
                _u.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(10)];
            case 35:
                _0.sent();
                expect(logged.some(function (line) { return line.includes('Line 120 of what changes') || line.includes('Release the payout screens?'); })).toBe(false);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], appended, true).reverse().find(function (line) { return line.includes('Release the payout screens?') && line.includes('asked the person'); })];
                    }); }); })];
            case 36:
                longRelay = (_z = (_0.sent())) !== null && _z !== void 0 ? _z : '';
                expect(longRelay).toContain('(the rest is on the card)');
                expect(longRelay).not.toContain('Line 120 of what changes');
                return [4 /*yield*/, big.unmount()];
            case 37:
                _0.sent();
                return [4 /*yield*/, list.unmount()];
            case 38:
                _0.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an answer to ended work that cannot be started again is left in the chat as the mod\'s notice and a row its model reads, never in the person\'s place', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, submitted, logged, appended, list, _b, _c, _d, _e, _f;
    var _g;
    var _this = this;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on, { unresumable: new Set(['a1']) }), submitted = _a.submitted, logged = _a.logged, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'pick a colour', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Pick a colour', prompt: 'pick a colour' }))];
            case 3:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _l.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Red or blue?', choices: ['Red', 'Blue'] })
                    // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                ];
            case 5:
                _l.sent();
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Waiting on your colour.' })];
            case 6:
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                _l.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 7:
                _l.sent();
                _c = (_b = list).press;
                _g = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Blue'; })];
                        }
                    }); }); })];
            case 8: return [4 /*yield*/, _c.apply(_b, [(_g.key = (_j = (_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.key) !== null && _j !== void 0 ? _j : '', _g)])];
            case 9:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('Your answer “Blue” to “Pick a colour” (Red or blue?)'); })];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_l.sent()]).toContain("couldn't reach its task. It goes with your next message here.");
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ') && line.includes('The answer could not reach that task'); })];
                    }); }); })];
            case 11:
                _e.apply(void 0, [_l.sent()]).toContain('(Red or blue?): Blue.');
                expect(submitted.some(function (line) { return line.includes('Blue'); })).toBe(false);
                // The card says so in its one grey line
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "✓ You answered “Blue” · it couldn't reach the task, so it goes with your next message" })];
                    }); }); })];
            case 12:
                // The card says so in its one grey line
                _f.apply(void 0, [(_k = (_l.sent())) === null || _k === void 0 ? void 0 : _k.props.dimColor]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 13:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in a chat the app runs on another Mac over ssh, a key the runners need is typed in the box above the chat and goes only into the keychain; a password or key the person refuses goes with one grey line', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, id, list, bar, boxButton, field, _b, _c, _d, _e, _f, _g, _h, value, _j, _k, _l, _m, _o, third, _p, _q, curly, before, _r, again, other, cancel, _s, _t, _u, PRESSED, _v, _w;
    var _x, _y, _z;
    var _this = this;
    var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    return __generator(this, function (_13) {
        switch (_13.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _13.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 2:
                _13.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _13.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 4:
                bar = _13.sent();
                boxButton = function (box, what) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                    case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(box, "-").concat(what, "-")); })];
                                }
                            }); }); })];
                    });
                }); };
                field = function (box) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                                    case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("band-".concat(box, "-reply-")); })];
                                }
                            }); }); })];
                    });
                }); };
                return [4 /*yield*/, clock.advance(1000)
                    // The chat is told only the name, and where to type it
                ];
            case 5:
                _13.sent();
                // The chat is told only the name, and where to type it
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('GITHUB_TOKEN'); })];
                    }); }); })];
            case 6:
                // The chat is told only the name, and where to type it
                _b.apply(void 0, [_13.sent()]).toBe("".concat(GITHUB_ASKED, " Press Paste it on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself. Or answer in words, such as where it already is."));
                // Its block: the dim label of its kind, what is asked in amber, and where it goes; nothing is typed in the panel
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
                    }); }); })];
            case 7:
                // Its block: the dim label of its kind, what is asked in amber, and where it goes; nothing is typed in the panel
                _c.apply(void 0, [(_0 = (_13.sent())) === null || _0 === void 0 ? void 0 : _0.props.color]).toBe(AMBER);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Key' })];
            case 8:
                _d.apply(void 0, [(_1 = (_13.sent())) === null || _1 === void 0 ? void 0 : _1.props.dimColor]).toBe(true);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: KEY_GOES })];
            case 9:
                _e.apply(void 0, [_13.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 10:
                _f.apply(void 0, [_13.sent()]).toEqual([]);
                _h = (_g = list).press;
                _x = {};
                return [4 /*yield*/, boxButton(id, 'paste')];
            case 11: return [4 /*yield*/, _h.apply(_g, [(_x.key = (_3 = (_2 = (_13.sent())) === null || _2 === void 0 ? void 0 : _2.key) !== null && _3 !== void 0 ? _3 : '', _x)])];
            case 12:
                _13.sent();
                value = 'ghp_s3cret"with\\quote';
                _k = (_j = bar).input;
                _y = {};
                return [4 /*yield*/, field(id)];
            case 13: return [4 /*yield*/, _k.apply(_j, [(_y.key = (_5 = (_4 = (_13.sent())) === null || _4 === void 0 ? void 0 : _4.key) !== null && _5 !== void 0 ? _5 : '', _y.text = value, _y)])
                // It goes to the keychain under the box's id, escaped for security's own reading, and the block goes, one grey line in its place
            ];
            case 14:
                _13.sent();
                // It goes to the keychain under the box's id, escaped for security's own reading, and the block goes, one grey line in its place
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(id); })];
                    }); }); })];
            case 15:
                // It goes to the keychain under the box's id, escaped for security's own reading, and the block goes, one grey line in its place
                _l.apply(void 0, [_13.sent()]).toBe("add-generic-password -U -s \"claudopus-box\" -a \"".concat(id, "\" -l \"Claudopus box\" -w \"ghp_s3cret\\\"with\\\\quote\"\n"));
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 16:
                _m.apply(void 0, [_13.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You gave GITHUB_TOKEN' })];
                    }); }); })];
            case 17:
                _o.apply(void 0, [(_6 = (_13.sent())) === null || _6 === void 0 ? void 0 : _6.props.dimColor]).toBe(true);
                // Nowhere else: not the chat, its saved words, the log or any file
                expect(logged.some(function (line) { return line.includes('s3cret'); })).toBe(false);
                expect(__spreadArray([], files.values(), true).some(function (text) { return text.includes('s3cret'); })).toBe(false);
                third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(third, ".json"), JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 18:
                _13.sent();
                _q = (_p = list).press;
                _z = {};
                return [4 /*yield*/, boxButton(third, 'paste')];
            case 19: return [4 /*yield*/, _q.apply(_p, [(_z.key = (_8 = (_7 = (_13.sent())) === null || _7 === void 0 ? void 0 : _7.key) !== null && _8 !== void 0 ? _8 : '', _z)])];
            case 20:
                _13.sent();
                return [4 /*yield*/, field(third)];
            case 21:
                curly = _13.sent();
                before = keychain.length;
                return [4 /*yield*/, bar.input({ key: (_9 = curly === null || curly === void 0 ? void 0 : curly.key) !== null && _9 !== void 0 ? _9 : '', text: 'it’s-mine' })];
            case 22:
                _13.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('That has a line break, a curly quote'); })];
                        }
                    }); }); })];
            case 23:
                _r.apply(void 0, [_13.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("band-".concat(third, "-reply-")) && one.key !== (curly === null || curly === void 0 ? void 0 : curly.key); })];
                        }
                    }); }); })];
            case 24:
                again = _13.sent();
                expect(again).toBeDefined();
                files.delete("".concat(MEMORY, "/boxes/").concat(third, ".json"));
                return [4 /*yield*/, bar.input({ key: (_10 = again === null || again === void 0 ? void 0 : again.key) !== null && _10 !== void 0 ? _10 : '', text: 'plain-value-1234' })];
            case 25:
                _13.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 26:
                _13.sent();
                expect(keychain.length).toBe(before);
                other = '1f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(other, ".json"), JSON.stringify({ id: other, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 27:
                _13.sent();
                return [4 /*yield*/, boxButton(other, 'cancel')];
            case 28:
                cancel = _13.sent();
                expect(cancel === null || cancel === void 0 ? void 0 : cancel.props.label).toBe("Don't allow");
                _s = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ADMIN_ASKED })];
            case 29:
                _s.apply(void 0, [_13.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_11 = cancel === null || cancel === void 0 ? void 0 : cancel.key) !== null && _11 !== void 0 ? _11 : '' })];
            case 30:
                _13.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (files.has("".concat(MEMORY, "/boxes/").concat(other, ".json")) ? undefined : true)];
                    }); }); })];
            case 31:
                _t.apply(void 0, [_13.sent()]).toBe(true);
                // Its block goes at once, and one grey line says what was pressed, for a minute
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ADMIN_ASKED })];
            case 32:
                // Its block goes at once, and one grey line says what was pressed, for a minute
                _u.apply(void 0, [_13.sent()]).toBeUndefined();
                PRESSED = /^✓ You pressed “Don.t allow”$/;
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: PRESSED })];
                    }); }); })];
            case 33:
                _v.apply(void 0, [(_12 = (_13.sent())) === null || _12 === void 0 ? void 0 : _12.props.dimColor]).toBe(true);
                return [4 /*yield*/, clock.advance(61000)];
            case 34:
                _13.sent();
                _w = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: PRESSED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 35:
                _w.apply(void 0, [_13.sent()]).toBe(true);
                return [4 /*yield*/, Promise.all([list.unmount(), bar.unmount()])];
            case 36:
                _13.sent();
                return [4 /*yield*/, settle()];
            case 37:
                _13.sent();
                return [2 /*return*/];
        }
    });
}); });
test("where the bar above the prompt takes a box, a key or a password has no field in the panel, whose window the app drags to a field that holds the cursor: Paste it, Type it or Answer in words opens the one box in the bar; the key goes only to the keychain, a password only sealed to the command that asked, words only to that command, and words that look like the key itself are held until the person says which", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, filled, list, bar, fieldsIn, labelled, press, boxButtons, ask, key, _b, order, _c, _d, _e, pasted, _f, _g, _h, _j, _k, _l, said, words, _m, kept, _o, _p, _q, _r, slip, slipped, _s, _t, admin, _u, _v, _w, _x, _y, typedIn, _z, _0, _1;
    var _this = this;
    var _2, _3, _4, _5, _6, _7, _8;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _9.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })];
            case 2:
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Deploy the site', prompt: 'deploy it' }))];
            case 3:
                _9.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                // Another task's runner, begun later, for another key: the box for GITHUB_TOKEN is still the first task's
                return [4 /*yield*/, clock.advance(500)];
            case 4:
                // Another task's runner, begun later, for another key: the box for GITHUB_TOKEN is still the first task's
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sign the build', prompt: 'sign it' }))];
            case 5:
                _9.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-2', agentId: 'a2', command: 'hold /plug/claudopus/bin/secret SIGNING_KEY here sign' }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 6:
                list = _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 7:
                bar = _9.sent();
                fieldsIn = function (site, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').includes(id); })];
                    }
                }); }); };
                labelled = function (site, label) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.props.label === label; })];
                    }
                }); }); };
                press = function (site, label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _this = this;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = site).press;
                                _c = {};
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, labelled(site, label)];
                                            case 1: return [2 /*return*/, (_a.sent())[0]];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])
                                // The buttons of a box's block, in the order drawn
                            ];
                        }
                    });
                }); };
                boxButtons = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-")); }).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                ask = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                            return [4 /*yield*/, clock.advance(1000)];
                        case 1: return [2 /*return*/, (_a.sent())
                            // The key: no field in the panel; Paste it, Don't give it and Answer in words
                        ];
                    }
                }); }); };
                key = '0a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(key)];
            case 8:
                _9.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_9.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                order = (_9.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(order.indexOf('Deploy the site')).toBeGreaterThan(-1);
                expect(order.indexOf('Deploy the site')).toBeLessThan(order.indexOf(GITHUB_ASKED));
                expect(order.indexOf(GITHUB_ASKED)).toBeLessThan(order.indexOf('Sign the build'));
                expect(order.find(function (one) { return /waiting for you/.test(one); })).toMatch(/^1 /);
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 11:
                _c.apply(void 0, [(_9.sent()).some(function (one) { return one.props.width === 1 && one.props.backgroundColor === AMBER; })]).toBe(true);
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxButtons(key)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 3 ? boxButtons(key) : undefined)];
                        }
                    }); }); })];
            case 12:
                _d.apply(void 0, [_9.sent()]).toEqual(['Paste it', "Don't give it", 'Answer in words']);
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 13:
                _e.apply(void 0, [_9.sent()]).toEqual([]);
                // Paste it opens the one box above the chat, named for the key and its task; the block offers to close it
                return [4 /*yield*/, press(list, 'Paste it')];
            case 14:
                // Paste it opens the one box above the chat, named for the key and its task; the block offers to close it
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, key)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 15:
                pasted = _9.sent();
                _f = expect;
                return [4 /*yield*/, oneBox(bar)];
            case 16:
                _f.apply(void 0, [_9.sent()]).toEqual({ head: '↳ GITHUB_TOKEN for “Deploy the site”', fields: ['Paste it here'], enter: SENDS_KEY, buttons: ['Send', 'Close'] });
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxButtons(key)];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Close') ? boxButtons(key) : undefined)];
                        }
                    }); }); })];
            case 17:
                _g.apply(void 0, [_9.sent()]).toEqual(['Close', "Don't give it"]);
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 18:
                _h.apply(void 0, [_9.sent()]).toEqual([]);
                return [4 /*yield*/, bar.input({ key: (_2 = pasted === null || pasted === void 0 ? void 0 : pasted.key) !== null && _2 !== void 0 ? _2 : '', text: 'ghp_kept0nlyInKeychain' })];
            case 19:
                _9.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(key); })];
                    }); }); })];
            case 20:
                _j.apply(void 0, [_9.sent()]).toContain('-w "ghp_kept0nlyInKeychain"');
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, key)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 21:
                _k.apply(void 0, [_9.sent()]).toBe(true);
                expect(files.has("".concat(MEMORY, "/boxes/").concat(key, ".reply"))).toBe(false);
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You gave GITHUB_TOKEN' })];
                    }); }); })];
            case 22:
                _l.apply(void 0, [(_3 = (_9.sent())) === null || _3 === void 0 ? void 0 : _3.props.dimColor]).toBe(true);
                said = '1a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(said)];
            case 23:
                _9.sent();
                return [4 /*yield*/, press(list, 'Answer in words')];
            case 24:
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, said)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 25:
                words = _9.sent();
                _m = expect;
                return [4 /*yield*/, oneBox(bar)];
            case 26:
                _m.apply(void 0, [_9.sent()]).toEqual({ head: '↳ Your answer in place of GITHUB_TOKEN', fields: ['Type your answer'], enter: SENDS_KEY, buttons: ['Send', 'Close'] });
                // The one box is four lines whatever it is for, and has no small send button the app draws for a submitLabel
                expect([pasted === null || pasted === void 0 ? void 0 : pasted.props.rows, words === null || words === void 0 ? void 0 : words.props.rows]).toEqual([4, 4]);
                expect([pasted, words].some(function (one) { var _a; return 'submitLabel' in ((_a = one === null || one === void 0 ? void 0 : one.props) !== null && _a !== void 0 ? _a : {}); })).toBe(false);
                kept = keychain.length;
                // Sent with the row's Send, the big button first, Close the small one after it
                _o = expect;
                return [4 /*yield*/, bar.findAll({ type: 'Button' })];
            case 27:
                // Sent with the row's Send, the big button first, Close the small one after it
                _o.apply(void 0, [(_9.sent()).filter(function (b) { return ['Send', 'Close'].includes(String(b.props.label)); }).map(function (b) { var _a, _b; return [b.props.label, (_a = b.props.variant) !== null && _a !== void 0 ? _a : null, (_b = b.props.plain) !== null && _b !== void 0 ? _b : null]; })]).toEqual([['Send', 'primary', null], ['Close', null, true]]);
                return [4 /*yield*/, bar.input({ key: (_4 = words === null || words === void 0 ? void 0 : words.key) !== null && _4 !== void 0 ? _4 : '', text: 'It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too', kind: 'change' })];
            case 28:
                _9.sent();
                return [4 /*yield*/, press(bar, 'Send')];
            case 29:
                _9.sent();
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get("".concat(MEMORY, "/boxes/").concat(said, ".reply"))];
                    }); }); })];
            case 30:
                _p.apply(void 0, [_9.sent()]).toBe('The person answered in the Claudopus panel instead of giving GITHUB_TOKEN, in their own words: It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too\n');
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (files.has("".concat(MEMORY, "/boxes/").concat(said, ".json")) ? undefined : true)];
                    }); }); })];
            case 31:
                _q.apply(void 0, [_9.sent()]).toBe(true);
                expect(keychain.length).toBe(kept);
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^✓ You answered “It is already in / })];
                    }); }); })];
            case 32:
                _r.apply(void 0, [(_5 = (_9.sent())) === null || _5 === void 0 ? void 0 : _5.props.dimColor]).toBe(true);
                slip = '2a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(slip)];
            case 33:
                _9.sent();
                return [4 /*yield*/, press(list, 'Answer in words')];
            case 34:
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, slip)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 35:
                slipped = _9.sent();
                return [4 /*yield*/, bar.input({ key: (_6 = slipped === null || slipped === void 0 ? void 0 : slipped.key) !== null && _6 !== void 0 ? _6 : '', text: 'here: ghp_A1b2C3d4E5f6G7h8I9j0' })];
            case 36:
                _9.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('That looks like the key itself'); })];
                        }
                    }); }); })];
            case 37:
                _s.apply(void 0, [_9.sent()]).toBeDefined();
                expect(files.has("".concat(MEMORY, "/boxes/").concat(slip, ".reply"))).toBe(false);
                expect(logged.some(function (line) { return line.includes('A1b2C3'); })).toBe(false);
                return [4 /*yield*/, press(bar, 'Save as the key')];
            case 38:
                _9.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(slip); })];
                    }); }); })];
            case 39:
                _t.apply(void 0, [_9.sent()]).toContain('-w "ghp_A1b2C3d4E5f6G7h8I9j0"');
                expect(files.has("".concat(MEMORY, "/boxes/").concat(slip, ".reply"))).toBe(false);
                admin = '3a1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(admin, ".json"), JSON.stringify({ id: admin, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 40:
                _9.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxButtons(admin)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? boxButtons(admin) : undefined)];
                        }
                    }); }); })];
            case 41:
                _u.apply(void 0, [_9.sent()]).toEqual(['Type it', "Don't allow"]);
                _v = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ADMIN_ASKED })];
            case 42:
                _v.apply(void 0, [(_7 = (_9.sent())) === null || _7 === void 0 ? void 0 : _7.props.color]).toBe(AMBER);
                _w = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 43:
                _w.apply(void 0, [(_9.sent()).some(function (one) { var _a; return /^Password( · |$)/.test(String((_a = one.text) !== null && _a !== void 0 ? _a : '')) && one.props.dimColor; })]).toBe(true);
                _x = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: ADMIN_GOES })];
            case 44:
                _x.apply(void 0, [_9.sent()]).toBeDefined();
                _y = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 45:
                _y.apply(void 0, [_9.sent()]).toEqual([]);
                return [4 /*yield*/, press(list, 'Type it')];
            case 46:
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, admin)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 47:
                typedIn = _9.sent();
                _z = expect;
                return [4 /*yield*/, oneBox(bar)];
            case 48:
                _z.apply(void 0, [_9.sent()]).toEqual({ head: expect.stringMatching(/^↳ This Mac's password/), fields: ['Type it here'], enter: SENDS_KEY, buttons: ['Send', 'Close'] });
                return [4 /*yield*/, bar.input({ key: (_8 = typedIn === null || typedIn === void 0 ? void 0 : typedIn.key) !== null && _8 !== void 0 ? _8 : '', text: 'made-up-passw0rd' })];
            case 49:
                _9.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(admin); })];
                    }); }); })];
            case 50:
                _0.apply(void 0, [_9.sent()]).toContain("-w \"".concat(boxSealed(BOX_PUBLIC, 'made-up-passw0rd'), "\""));
                expect(keychain.some(function (one) { return one.includes('made-up-passw0rd'); })).toBe(false);
                _1 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You gave the password' })];
                    }); }); })];
            case 51:
                _1.apply(void 0, [_9.sent()]).toBeDefined();
                // Nothing was ever put into the chat's own box
                expect(filled).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 52:
                _9.sent();
                return [4 /*yield*/, bar.unmount()];
            case 53:
                _9.sent();
                return [4 /*yield*/, settle()];
            case 54:
                _9.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a chat on this Mac\'s own screen is told of a key and its panel opened the same way; in the terminal, where the bar above the prompt draws no field, the key\'s block has the one field itself, which Answer in words turns to words and back', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, opened, id, list, _b, fields, buttons, _c, _d, _e, _f, _g, _h, _j, _k, field, _l;
    var _m, _o;
    var _this = this;
    var _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 1:
                _v.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 2:
                list = _v.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _v.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('GITHUB_TOKEN'); })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_v.sent()]).toContain('Press Paste it on it in the Claudopus panel');
                // The chat takes the request, which tells the runner a panel asks, and brings the panel up with the field ready
                expect(opened.filter(function (one) { return one === 'claudopus'; }).length).toBeGreaterThan(0);
                fields = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-field")); })];
                    }
                }); }); };
                buttons = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-")); })];
                    }
                }); }); };
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fields()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? fields() : undefined)];
                        }
                    }); }); })];
            case 5:
                _c.apply(void 0, [(_p = (_v.sent())) === null || _p === void 0 ? void 0 : _p.map(function (one) { return one.props.placeholder; })]).toEqual(['Paste it here']);
                _d = expect;
                return [4 /*yield*/, buttons()];
            case 6:
                _d.apply(void 0, [(_v.sent()).map(function (b) { return b.props.label; })]).toEqual(["Don't give it", 'Answer in words']);
                _f = (_e = list).press;
                _m = {};
                return [4 /*yield*/, buttons()];
            case 7: 
            // Answer in words turns the one field to words, and Paste it turns it back
            return [4 /*yield*/, _f.apply(_e, [(_m.key = (_r = (_q = (_v.sent())[1]) === null || _q === void 0 ? void 0 : _q.key) !== null && _r !== void 0 ? _r : '', _m)])];
            case 8:
                // Answer in words turns the one field to words, and Paste it turns it back
                _v.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, fields()];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.placeholder) === 'Type your answer' ? true : undefined)];
                        }
                    }); }); })];
            case 9:
                _g.apply(void 0, [_v.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, buttons()];
            case 10:
                _h.apply(void 0, [(_v.sent()).map(function (b) { return b.props.label; })]).toEqual(["Don't give it", 'Paste it']);
                _k = (_j = list).press;
                _o = {};
                return [4 /*yield*/, buttons()];
            case 11: return [4 /*yield*/, _k.apply(_j, [(_o.key = (_t = (_s = (_v.sent())[1]) === null || _s === void 0 ? void 0 : _s.key) !== null && _t !== void 0 ? _t : '', _o)])];
            case 12:
                _v.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fields()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.props.placeholder === 'Paste it here'; })];
                        }
                    }); }); })];
            case 13:
                field = _v.sent();
                return [4 /*yield*/, list.input({ key: (_u = field === null || field === void 0 ? void 0 : field.key) !== null && _u !== void 0 ? _u : '', text: 'made-up-local-k3y' })];
            case 14:
                _v.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(id); })];
                    }); }); })];
            case 15:
                _l.apply(void 0, [_v.sent()]).toContain('-w "made-up-local-k3y"');
                expect(logged.some(function (line) { return line.includes('local-k3y'); })).toBe(false);
                expect(__spreadArray([], files.values(), true).some(function (text) { return text.includes('local-k3y'); })).toBe(false);
                return [4 /*yield*/, list.unmount()];
            case 16:
                _v.sent();
                return [4 /*yield*/, settle()];
            case 17:
                _v.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a request of another chat's, or of this chat's with no runner of its own running, is drawn nowhere here; this chat's own while its runner runs is drawn", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, clock, list, older, mine, drawn, _b, _c, _d, _e, _f, _g;
    var _this = this;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _h.sent();
                older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98';
                mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(older, ".json"), JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1700000000000 }));
                files.set("".concat(MEMORY, "/boxes/").concat(mine, ".json"), JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000500 }));
                return [4 /*yield*/, clock.advance(7000)
                    // The blocks drawn, each by the start of its request's id
                ];
            case 3:
                _h.sent();
                drawn = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return /^box-.*-cancel-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); }).map(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').slice(4, 6); })
                            // No runner of this chat's runs: neither is drawn, nor told
                        ];
                    }
                }); }); };
                // No runner of this chat's runs: neither is drawn, nor told
                _b = expect;
                return [4 /*yield*/, drawn()];
            case 4:
                // No runner of this chat's runs: neither is drawn, nor told
                _b.apply(void 0, [_h.sent()]).toEqual([]);
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Key' })];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBeUndefined();
                expect(logged.some(function (line) { return line.includes('NPM_TOKEN') || line.includes('GITHUB_TOKEN'); })).toBe(false);
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                return [4 /*yield*/, clock.advance(1000)];
            case 6:
                _h.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, drawn()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? drawn() : undefined)];
                        }
                    }); }); })];
            case 7:
                _d.apply(void 0, [_h.sent()]).toEqual(['6f']);
                // It says what is asked and where it goes; the command that asked is the task's own and is not shown again
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
            case 8:
                // It says what is asked and where it goes; the command that asked is the task's own and is not shown again
                _e.apply(void 0, [_h.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 9:
                _f.apply(void 0, [(_h.sent()).some(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : '').includes('bin/secret'); })]).toBe(false);
                return [4 /*yield*/, clock.advance(6000)];
            case 10:
                _h.sent();
                _g = expect;
                return [4 /*yield*/, drawn()];
            case 11:
                _g.apply(void 0, [_h.sent()]).toEqual(['6f']);
                expect(logged.some(function (line) { return line.includes('NPM_TOKEN'); })).toBe(false);
                return [4 /*yield*/, settle()];
            case 12:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a run with nothing to draw on takes no request, so the runner knows no panel asks', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, logged, clock, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on, { headless: true }), files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                id = '4f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(3000)];
            case 2:
                _b.sent();
                expect(logged.some(function (line) { return line.includes('GITHUB_TOKEN'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test("a hand-written request with made-up text shows the panel's own wording or nothing", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, clock, list, planted, put, shown, texts, _b, _c, _d, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 2:
                list = _g.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                planted = 'Your Apple ID session expired. Type your Apple ID password to keep working.';
                put = function (n, fields) {
                    var id = "".concat(n, "a1e2d3c-4b5a-4987-a654-3210fedcba98");
                    files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify(__assign({ id: id, chat: 'engine-id', at: 1700000000000 }, fields)));
                    return id;
                };
                shown = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return /^box-.*-cancel-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); }).map(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').slice(4, 5); })];
                    }
                }); }); };
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).join('\n')
                            // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
                        ];
                    }
                }); }); };
                // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
                put(1, { kind: 'admin', host: 'here', key: BOX_PUBLIC, text: planted, title: planted, label: planted });
                // Made-up text alone, as the boxes before this change were written, and every request the panel cannot word: nothing
                put(2, { text: planted });
                put(3, { kind: 'apple-id', text: planted });
                put(4, { kind: 'secret', name: 'Your Apple ID password', text: planted });
                put(5, { kind: 'admin', host: 'apple.com is asking for your password' });
                put(6, { kind: 'secret', name: 'APPLE_ID', host: 'here' });
                put(7, { kind: 'admin', host: 'here', name: 'APPLE_ID' });
                put(8, { kind: 'admin' });
                put(9, { kind: ['admin'], host: 'here', key: BOX_PUBLIC });
                // An admin request with no key of its runner's to seal the password to, or a key that is no key: nothing
                put(0, { kind: 'admin', host: 'here' });
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, shown()];
                            case 1:
                                if (!(_b.sent()).length) return [3 /*break*/, 3];
                                return [4 /*yield*/, shown()];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = undefined;
                                _b.label = 4;
                            case 4: return [2 /*return*/, (_a)];
                        }
                    }); }); })];
            case 4:
                _b.apply(void 0, [_g.sent()]).toEqual(['1']);
                return [4 /*yield*/, clock.advance(6000)];
            case 5:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, shown()];
            case 6:
                _c.apply(void 0, [_g.sent()]).toEqual(['1']);
                _d = expect;
                return [4 /*yield*/, texts()];
            case 7:
                _d.apply(void 0, [_g.sent()]).toContain(ADMIN_ASKED);
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
            case 8:
                _e.apply(void 0, [(_g.sent()).map(function (one) { return one.text; })]).toEqual([ADMIN_GOES]);
                _f = expect;
                return [4 /*yield*/, texts()];
            case 9:
                _f.apply(void 0, [_g.sent()]).not.toContain('Apple');
                expect(logged.some(function (line) { return line.includes('Apple'); })).toBe(false);
                // The notice in the chat is the panel's wording too
                expect(logged.find(function (line) { return line.includes("This Mac's password"); })).toBe("".concat(ADMIN_ASKED, " Press Type it on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself."));
                return [4 /*yield*/, settle()];
            case 10:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a block words what the runners ask from the fields of the request: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first; each kind with its own label and buttons', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, clock, list, bar, put, blocks, KEY_BUTTONS, _b, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 3:
                bar = _e.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                put = function (n, fields) {
                    var id = "".concat(n, "b1e2d3c-4b5a-4987-a654-3210fedcba98");
                    files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify(__assign({ id: id, chat: 'engine-id', at: 1700000000000 + n }, fields)));
                };
                put(1, { kind: 'secret', name: 'GITHUB_TOKEN' });
                put(2, { kind: 'admin', host: 'dima@m4.local', key: BOX_PUBLIC, again: 'refused' });
                put(3, { kind: 'secret', name: 'NPM_TOKEN', again: 'short' });
                put(4, { kind: 'secret', name: 'OPENAI_KEY', again: 'Type your Apple ID password' });
                put(5, { kind: 'secret' });
                return [4 /*yield*/, clock.advance(1000)
                    // Each block as drawn, in the order asked: its label, what it asks, where that goes, and its buttons
                ];
            case 4:
                _e.sent();
                blocks = function () { return __awaiter(_this, void 0, void 0, function () {
                    var texts, goes, buttons, labels, asks;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1:
                                texts = (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
                            case 2:
                                goes = (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 3:
                                buttons = (_a.sent()).filter(function (b) { var _a; return /^box-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); });
                                labels = texts.filter(function (one) { return /^(Key|Password)( · |$)/.test(one); }).map(function (one) { return one.split(' · ')[0]; });
                                asks = texts.filter(function (one) { return / is needed to run | should the key be saved /.test(one); });
                                return [2 /*return*/, [1, 2, 3, 4, 5].map(function (n, i) { return [labels[i], asks[i], goes[i], buttons.filter(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(n, "b1e")); }).map(function (b) { return String(b.props.label); })]; })];
                        }
                    });
                }); };
                KEY_BUTTONS = ['Paste it', "Don't give it", 'Answer in words'];
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, blocks()];
                            case 1: return [2 /*return*/, ((_a.sent()).every(function (one) { return one[3].length >= 2; }) ? blocks() : undefined)];
                        }
                    }); }); })];
            case 5:
                _b.apply(void 0, [_e.sent()]).toEqual([
                    ['Key', GITHUB_ASKED, KEY_GOES, KEY_BUTTONS],
                    ['Password', 'That password was wrong. The password of dima@m4.local is needed to run this as admin.', ADMIN_GOES, ['Type it', "Don't allow"]],
                    ['Key', "That was shorter than 4 characters. NPM_TOKEN is needed to run this task's command.", KEY_GOES, KEY_BUTTONS],
                    // A reason it does not know is left out
                    ['Key', "OPENAI_KEY is needed to run this task's command.", KEY_GOES, KEY_BUTTONS],
                    ['Key', 'Which name should the key be saved under, such as GITHUB_TOKEN?', 'Commands use the key by this name.', ['Type it', "Don't give it", 'Answer in words']],
                ]);
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 6:
                _c.apply(void 0, [(_e.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).join('\n')]).not.toContain('Apple');
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 7:
                _d.apply(void 0, [_e.sent()]).toEqual([]);
                return [4 /*yield*/, Promise.all([list.unmount(), bar.unmount()])];
            case 8:
                _e.sent();
                return [4 /*yield*/, settle()];
            case 9:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a copy a reload replaced wakes no work: its timers stop, an answer left for its work stays for the copy in charge, and a press it still gets goes to the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, appended, files, clock, isNewer, list, at, approve, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, appended = _a.appended, files = _a.files, clock = _a.clock;
                isNewer = false;
                on('state.get', function (_, e, next) { return (e.key === 'load' && isNewer ? { value: { value: "".concat('9'.repeat(15), "-a-newer-load"), version: 99 } } : next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve'] })
                    // (ended work: it hands in its result with the question still open)
                ];
            case 5:
                _d.sent();
                // (ended work: it hands in its result with the question still open)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'It waits on your go-ahead.' })];
            case 6:
                // (ended work: it hands in its result with the question still open)
                _d.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 7:
                _d.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
                ];
            case 8:
                _d.sent();
                // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
                isNewer = true;
                at = 1700000002000;
                files.set("".concat(MEMORY, "/live/answers/engine-id/0-a.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I restart it?', askAt: at - 2000, at: at }));
                return [4 /*yield*/, clock.advance(10000)
                    // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
                ];
            case 9:
                _d.sent();
                // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
                expect(__spreadArray(['by its timers'], resumed.filter(function (line) { return line.startsWith('a1: '); }), true)).toEqual(['by its timers']);
                expect(files.has("".concat(MEMORY, "/live/answers/engine-id/0-a.json"))).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 10:
                approve = (_c = (_d.sent()).find(function (b) { return b.props.label === 'Approve'; })) === null || _c === void 0 ? void 0 : _c.key;
                expect(approve).toBeDefined();
                if (!approve) return [3 /*break*/, 13];
                return [4 /*yield*/, list.press({ key: approve })];
            case 11:
                _d.sent();
                expect(__spreadArray(['by a press'], resumed.filter(function (line) { return line.startsWith('a1: '); }), true)).toEqual(['by a press']);
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.includes('Approve') && line.includes('May I restart it?'); })];
                    }); }); })];
            case 12:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _d.label = 13;
            case 13: return [4 /*yield*/, list.unmount()];
            case 14:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('F-013 · an answer another chat left in a file for ended work wakes nothing: it is put away unread, and only a press in this chat answers', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, files, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve'] })
                    // (ended work: it hands in its result with the question still open)
                ];
            case 4:
                _b.sent();
                // (ended work: it hands in its result with the question still open)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'It waits on your go-ahead.' })];
            case 5:
                // (ended work: it hands in its result with the question still open)
                _b.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 6:
                _b.sent();
                files.set("".concat(MEMORY, "/live/answers/engine-id/0-a.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', askAt: 1700000000000, at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(6000)];
            case 7:
                _b.sent();
                expect(files.has("".concat(MEMORY, "/live/answers/engine-id/0-a.json"))).toBe(false);
                return [4 /*yield*/, $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })];
            case 8:
                _b.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 9:
                _b.sent();
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toEqual([]);
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('put away unread');
                return [2 /*return*/];
        }
    });
}); });
test('in a chat run from another Mac a command for the person is given whole, with its folder, and nothing offers to open a terminal here', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, terminals, shown, list, bare, _b, told, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), terminals = _a.terminals, shown = _a.shown;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'sign me in', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sign in', prompt: 'sign me in' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A relative path with no folder named is not shown: it would be typed somewhere else, where it does not exist
                ];
            case 4:
                list = _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run the release.', command: 'mods/claudopus/bin/release' })];
            case 5:
                bare = _f.sent();
                expect(String(bare.result)).toContain('Not shown');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run the release.' })];
            case 6:
                _b.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Sign in to GitHub.', command: 'gh auth login', cwd: '/repo/site' })];
            case 7:
                told = _f.sent();
                expect(String(told.result)).toContain("cd '/repo/site' && gh auth login");
                expect(String(told.result)).not.toContain('Open in Terminal');
                expect(String(told.result)).toContain('nothing opens a terminal here');
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login" })];
            case 8:
                _c.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.props.mono]).toBe(true);
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                _d.apply(void 0, [(_f.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; })]).toBeUndefined();
                expect(terminals).toEqual([]);
                expect(shown.some(function (argv) { return String(argv[1]).endsWith('/open.command'); })).toBe(false);
                return [4 /*yield*/, list.unmount()];
            case 10:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
// A press on an ask draws the card answered from the press itself: its buttons and box go in the press's own drawing, before the
// answer is written to the card's file or reaches the work
var askScene = function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, hold, fails, list, key, answers;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                w = world(on);
                fails = 0;
                on('state.set', function (_, e, next) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (e.key !== 'todos')
                                    return [2 /*return*/, next(e)
                                        // Refused, as a write another copy beat would be, again and again: the card's file is never written
                                    ];
                                // Refused, as a write another copy beat would be, again and again: the card's file is never written
                                if (fails > 0) {
                                    fails -= 1;
                                    return [2 /*return*/, { value: { isSet: false, version: -1 } }];
                                }
                                if (!hold) return [3 /*break*/, 2];
                                return [4 /*yield*/, hold];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, next(e)];
                        }
                    });
                }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'release it', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Ship the branch', prompt: 'ship it' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the branch?', choices: ['Release it', 'Fix it first'] })];
            case 5:
                _a.sent();
                key = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    var _this = this;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = String;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === label; })];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _a.apply(void 0, [(_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : ''])];
                        }
                    });
                }); };
                answers = function () { return w.appended.filter(function (line) { return line.startsWith('a1: ') && line.includes('in answer to your question'); }); };
                return [2 /*return*/, __assign(__assign({}, w), { list: list, key: key, answers: answers, holdWrites: function (until) { return void (hold = until); }, failWrites: function (n) { return void (fails = n); }, freeWrites: function () { return void (hold = undefined); } })];
        }
    });
}); };
test("a press on an ask shows it answered in the press's own drawing, before the answer is written, with no buttons or box left", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, release, free, pressing, _a, _b, _c, _d, _e, _f, line;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, askScene($, on)];
            case 1:
                s = _h.sent();
                return [4 /*yield*/, s.key('Release it')];
            case 2:
                release = _h.sent();
                free = function () { return undefined; };
                s.holdWrites(new Promise(function (done) { return (free = done); }));
                pressing = s.list.press({ key: release });
                // The card's file is not yet written: the card says what was pressed, and nothing is left to press
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it”' })];
                    }); }); })];
            case 3:
                // The card's file is not yet written: the card says what was pressed, and nothing is left to press
                _a.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.dimColor]).toBe(true);
                _b = expect;
                return [4 /*yield*/, s.list.findAll({ type: 'Button' })];
            case 4:
                _b.apply(void 0, [(_h.sent()).some(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('ask-a1-'); })]).toBe(false);
                _c = expect;
                return [4 /*yield*/, s.list.findAll({ type: 'Input' })];
            case 5:
                _c.apply(void 0, [(_h.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                _d = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: 'Question' })];
            case 6:
                _d.apply(void 0, [_h.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: 'Release the branch?' })];
            case 7:
                _e.apply(void 0, [_h.sent()]).toBeUndefined();
                expect(s.answers()).toEqual([]);
                s.freeWrites();
                free();
                return [4 /*yield*/, pressing];
            case 8:
                _h.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 9:
                _f.apply(void 0, [_h.sent()]).toHaveLength(1);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: /^✓ You answered “Release it”/ })];
                    }); }); })];
            case 10:
                line = _h.sent();
                expect([line === null || line === void 0 ? void 0 : line.text, line === null || line === void 0 ? void 0 : line.props.dimColor, line === null || line === void 0 ? void 0 : line.props.color]).toEqual(['✓ You answered “Release it”', true, undefined]);
                return [2 /*return*/];
        }
    });
}); });
test('an answer that could not be written says so on the card and puts its buttons back; pressed again it goes', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, order, _a, release, _b, _c, _d, again, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, askScene($, on)
                // Another work asks after it: newer, it goes under
            ];
            case 1:
                s = _h.sent();
                // Another work asks after it: newer, it goes under
                return [4 /*yield*/, s.clock.advance(1000)];
            case 2:
                // Another work asks after it: newer, it goes under
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the logo', prompt: 'draw it' }))];
            case 3:
                _h.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] })];
            case 4:
                _h.sent();
                order = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, s.list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).filter(function (text) { return text === 'Which logo?' || text === 'Release the branch?'; })];
                    }
                }); }); };
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 2 ? order() : undefined)];
                        }
                    }); }); })];
            case 5:
                _a.apply(void 0, [_h.sent()]).toEqual(['Release the branch?', 'Which logo?']);
                return [4 /*yield*/, s.key('Release it')];
            case 6:
                release = _h.sent();
                return [4 /*yield*/, s.clock.advance(1000)];
            case 7:
                _h.sent();
                s.failWrites(1000);
                return [4 /*yield*/, s.list.press({ key: release }).catch(function () { return undefined; })];
            case 8:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: "Couldn't send “Release it” · press it again" })];
                    }); }); })];
            case 9:
                _b.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.dimColor]).toBe(true);
                _c = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 10:
                _c.apply(void 0, [_h.sent()]).toBeUndefined();
                expect(s.answers()).toEqual([]);
                // Its ask back, the card keeps its ask's place above the newer one: a failed press never moves it
                _d = expect;
                return [4 /*yield*/, order()];
            case 11:
                // Its ask back, the card keeps its ask's place above the newer one: a failed press never moves it
                _d.apply(void 0, [_h.sent()]).toEqual(['Release the branch?', 'Which logo?']);
                // Its buttons are back, and a press now answers it
                s.failWrites(0);
                return [4 /*yield*/, s.key('Release it')];
            case 12:
                again = _h.sent();
                expect(again).not.toBe('');
                return [4 /*yield*/, s.list.press({ key: again })];
            case 13:
                _h.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 14:
                _e.apply(void 0, [_h.sent()]).toHaveLength(1);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it”' })];
                    }); }); })];
            case 15:
                _f.apply(void 0, [_h.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('two presses on an ask, the second on the drawing before the first was taken, send one answer', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, release, other, free, first, second, third, _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, askScene($, on)];
            case 1:
                s = _b.sent();
                return [4 /*yield*/, s.key('Release it')];
            case 2:
                release = _b.sent();
                return [4 /*yield*/, s.key('Fix it first')];
            case 3:
                other = _b.sent();
                free = function () { return undefined; };
                s.holdWrites(new Promise(function (done) { return (free = done); }));
                first = s.list.press({ key: release });
                second = s.list.press({ key: other }).catch(function () { return undefined; });
                third = s.list.press({ key: release }).catch(function () { return undefined; });
                s.freeWrites();
                free();
                return [4 /*yield*/, Promise.all([first, second, third])];
            case 4:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_b.sent()]).toHaveLength(1);
                expect(s.answers()[0]).toContain('pressed "Release it"');
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 50); })];
            case 6:
                _b.sent();
                expect(s.answers()).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
// What the panel reads, written in a minute, and how many seconds of it the panel was drawn afresh in: each one the app builds whole
// again, under the pointer
var watchWrites = function (on) {
    var writes = {};
    var counting = { isOn: false };
    on('ui.invalidate', function (_, e, next) { var _a; return ((counting.isOn && (writes.invalidate = ((_a = writes.invalidate) !== null && _a !== void 0 ? _a : 0) + 1)), next(e)); });
    on('state.set', function (_, e, next) {
        var _a, _b, _c, _d;
        var key = (_c = (_a = e.key) !== null && _a !== void 0 ? _a : (_b = e.ref) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : Object.keys(e).join(',');
        if (counting.isOn)
            writes[key] = ((_d = writes[key]) !== null && _d !== void 0 ? _d : 0) + 1;
        return next(e);
    });
    return { writes: writes, counting: counting };
};
test('with work running and nothing new, the panel is drawn afresh only every ten seconds and nothing it reads is written over with the same: the 15 Nov hover that flickered each second', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, drawings, i, _b, _c, _d, _e, _f;
    var _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _k.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                _k.sent();
                counting.isOn = true;
                drawings = new Set();
                i = 0;
                _k.label = 6;
            case 6:
                if (!(i < 60)) return [3 /*break*/, 10];
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _k.sent();
                _c = (_b = drawings).add;
                _e = (_d = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 8:
                (_c.apply(_b, [_e.apply(_d, [(_k.sent()).map(function (one) { return one.text; })])]));
                _k.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 6];
            case 10:
                // Nothing the panel reads is written: the times move by the mod's own call, every ten seconds
                expect({ tick: (_g = writes.tick) !== null && _g !== void 0 ? _g : 0, todos: (_h = writes.todos) !== null && _h !== void 0 ? _h : 0 }).toEqual({ tick: 0, todos: 0 });
                expect((_j = writes.invalidate) !== null && _j !== void 0 ? _j : 0).toBeLessThanOrEqual(7);
                expect(drawings.size).toBeLessThanOrEqual(7);
                expect(drawings.size).toBeGreaterThanOrEqual(5);
                // Anything new still shows at once
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' })];
            case 11:
                // Anything new still shows at once
                _k.sent();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'I am looking at the left ear.' })];
            case 12:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 13:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('with nothing running the panel is not drawn again at all, so what is under the pointer stays as it is and a press reaches it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, i;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Ears checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _e.sent();
                return [4 /*yield*/, clock.advance(120000)];
            case 6:
                _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                _e.sent();
                counting.isOn = true;
                i = 0;
                _e.label = 8;
            case 8:
                if (!(i < 60)) return [3 /*break*/, 12];
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                (_e.sent());
                _e.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 8];
            case 12:
                expect((_b = writes.invalidate) !== null && _b !== void 0 ? _b : 0).toBe(0);
                expect({ tick: (_c = writes.tick) !== null && _c !== void 0 ? _c : 0, todos: (_d = writes.todos) !== null && _d !== void 0 ? _d : 0 }).toEqual({ tick: 0, todos: 0 });
                return [4 /*yield*/, list.unmount()];
            case 13:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('while the person uses the panel its running times stand still, and move again once they stop; an ask that comes meanwhile shows at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, title, tall, still, _b, _c, i, _d, _e, _f, _g, _h, asked, _j, _k, _l, _m, _o, _p, _q;
    var _this = this;
    var _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })];
            case 2:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the nose', prompt: 'nose' }))
                    // (scrolled down: at the top only the running times stand still)
                ];
            case 4:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 20, bodyRows: 50 } }), surface: 'desktop' }))
                    // The list was 140 rows long a moment ago, as the app said on a scroll then
                ];
            case 5:
                list = _s.sent();
                // The list was 140 rows long a moment ago, as the app said on a scroll then
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 6:
                // The list was 140 rows long a moment ago, as the app said on a scroll then
                _s.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 7:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })
                    // A press in the panel: drawn once for what it did, then still while the person is at it
                ];
            case 8:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                title = (_s.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('open-'); });
                expect(title).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_r = title === null || title === void 0 ? void 0 : title.key) !== null && _r !== void 0 ? _r : '' })];
            case 10:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })
                    // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                    // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                    // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                ];
            case 11:
                _s.sent();
                // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 20, bodyRows: 50, contentRows: 90, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 12:
                // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                _s.sent();
                tall = function () { return __awaiter(_this, void 0, void 0, function () { var _a; var _b, _c; return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = Number;
                            return [4 /*yield*/, list.find({ type: 'Box' })];
                        case 1: return [2 /*return*/, _a.apply(void 0, [(_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.props.minHeight) !== null && _c !== void 0 ? _c : 0])];
                    }
                }); }); };
                counting.isOn = true;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 13:
                still = _c.apply(_b, [(_s.sent()).map(function (one) { return one.text; })]);
                // Work writes a line and new work starts while the person is at it: nothing above the pointer moves (16 Nov, the button under it
                // moved by up to 184 px as cards grew and shrank)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Halfway through the ears.' })];
            case 14:
                // Work writes a line and new work starts while the person is at it: nothing above the pointer moves (16 Nov, the button under it
                // moved by up to 184 px as cards grew and shrank)
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the chin', prompt: 'chin' }))];
            case 15:
                _s.sent();
                i = 0;
                _s.label = 16;
            case 16:
                if (!(i < 13)) return [3 /*break*/, 20];
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _s.sent();
                _d = expect;
                _f = (_e = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 18:
                (_d.apply(void 0, [_f.apply(_e, [(_s.sent()).map(function (one) { return one.text; })])]).toBe(still));
                _s.label = 19;
            case 19:
                i++;
                return [3 /*break*/, 16];
            case 20: 
            // An ask comes: shown at once all the same
            return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'May I go on?', choices: ['Approve'] })];
            case 21:
                // An ask comes: shown at once all the same
                _s.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'May I go on?' })];
            case 22:
                _g.apply(void 0, [_s.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, tall()];
            case 23:
                _h.apply(void 0, [_s.sent()]).toBe(70);
                _k = (_j = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 24:
                asked = _k.apply(_j, [(_s.sent()).map(function (one) { return one.text; })]);
                return [4 /*yield*/, clock.advance(30000)];
            case 25:
                _s.sent();
                _l = expect;
                _o = (_m = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 26:
                _l.apply(void 0, [_o.apply(_m, [(_s.sent()).map(function (one) { return one.text; })])]).not.toBe(asked);
                // with what came meanwhile, and its own height again
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Check the chin' })];
                    }); }); })];
            case 27:
                // with what came meanwhile, and its own height again
                _p.apply(void 0, [_s.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, tall()];
            case 28:
                _q.apply(void 0, [_s.sent()]).toBe(50);
                return [4 /*yield*/, list.unmount()];
            case 29:
                _s.sent();
                return [2 /*return*/];
        }
    });
}); });
// One line of pictures for a pane: the app asks for the panel with the view at the top and scrolled down in turn as a card changes
// its height, and each once kept a picture of its own age
test('a card never goes back to an older picture once a newer one was shown, however the view moves between the top and scrolled down, and the space its answered question held closes while the person uses it: the 19 Nov card that "went big, then small, then big again" after Release it, and the space after Release it that never closed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, appended, clock, DOWN, TOP, pane, viewAt, card, release, _b, _c, _d, _e, answered, _f, _g, now, _i, _h, where, _j, later, _k, _l, where, _m, STAGES, stageNow, seen, look, _o, _p, _q, i;
    var _r;
    var _this = this;
    var _s, _t, _u, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                _a = world(on), files = _a.files, appended = _a.appended, clock = _a.clock;
                files.set('/repo/wt/.release', 'mods/claudopus/bin/release');
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-nose');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _x.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _x.sent();
                return [4 /*yield*/, $.agent.spawn(__assign({}, spawn))];
            case 3:
                _x.sent();
                DOWN = __assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 6, bodyRows: 20 } }), surface: 'desktop' });
                TOP = __assign(__assign({}, LIST), { surface: 'desktop' });
                return [4 /*yield*/, $.ui.mount(DOWN)
                    // (the app asks for the same pane again with the view elsewhere)
                ];
            case 4:
                pane = _x.sent();
                viewAt = function (where) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.unmount()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, $.ui.mount(where)];
                        case 2: return [2 /*return*/, ((pane = _a.sent()))];
                    }
                }); }); };
                card = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).filter(function (text) { return !/Claudopus|^v\d|chat/.test(text !== null && text !== void 0 ? text : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 6, by: 1, bodyRows: 20, contentRows: 40, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 5:
                _x.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'a1', item: 'Ask you before releasing', state: 'doing' })];
            case 6:
                _x.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Built and tested.' })];
            case 7:
                _x.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the nose fix?', details: 'It straightens the nose.', choices: ['Release it'], release: '/repo/wt' })];
            case 8:
                _x.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Release it'; })];
                        }
                    }); }); })];
            case 9:
                release = _x.sent();
                return [4 /*yield*/, clock.advance(4000)];
            case 10:
                _x.sent();
                return [4 /*yield*/, pane.press({ key: (_s = release === null || release === void 0 ? void 0 : release.key) !== null && _s !== void 0 ? _s : '' })];
            case 11:
                _x.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 12:
                _b.apply(void 0, [_x.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ type: 'Text', text: '✓ You answered “Release it”' })];
                    }); }); })];
            case 13:
                _c.apply(void 0, [_x.sent()]).toBeDefined();
                // with the space the question took held under it for a moment
                _d = expect;
                _e = Number;
                return [4 /*yield*/, pane.find({ type: 'Box', key: 'fold-a1' })];
            case 14:
                // with the space the question took held under it for a moment
                _d.apply(void 0, [_e.apply(void 0, [(_u = (_t = (_x.sent())) === null || _t === void 0 ? void 0 : _t.props.height) !== null && _u !== void 0 ? _u : 0])]).toBeGreaterThan(0);
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                _x.sent();
                return [4 /*yield*/, card()];
            case 16:
                answered = _x.sent();
                expect(answered).toContain('Built and tested.');
                // The task carries on while the person is still at the panel: its last to-do is ticked, so its card gets shorter
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't2', agentId: 'a1', item: 'Ask you before releasing', state: 'done' })];
            case 17:
                // The task carries on while the person is still at the panel: its last to-do is ticked, so its card gets shorter
                _x.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'Releasing the nose fix.' })
                    // Scrolled down and in use, the picture on screen stays as it was
                ];
            case 18:
                _x.sent();
                // Scrolled down and in use, the picture on screen stays as it was
                _f = expect;
                return [4 /*yield*/, card()];
            case 19:
                // Scrolled down and in use, the picture on screen stays as it was
                _f.apply(void 0, [_x.sent()]).toEqual(answered);
                // but for the held space, which closes after its moment while the person still uses the panel (19 Nov: the space after Release it
                // never closed while they moved about the panel)
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 6, by: 1, bodyRows: 20, contentRows: 40, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 20:
                // but for the held space, which closes after its moment while the person still uses the panel (19 Nov: the space after Release it
                // never closed while they moved about the panel)
                _x.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 21:
                _x.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Box', key: 'fold-a1' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 22:
                _g.apply(void 0, [_x.sent()]).toBe(true);
                // The view comes to the top, as when the list gets shorter under it: the card as it is now
                return [4 /*yield*/, viewAt(TOP)];
            case 23:
                // The view comes to the top, as when the list gets shorter under it: the card as it is now
                _x.sent();
                return [4 /*yield*/, card()];
            case 24:
                now = _x.sent();
                expect(now).toContain('Releasing the nose fix.');
                expect(now).not.toContain('Ask you before releasing');
                _i = 0, _h = [DOWN, TOP, DOWN];
                _x.label = 25;
            case 25:
                if (!(_i < _h.length)) return [3 /*break*/, 29];
                where = _h[_i];
                return [4 /*yield*/, viewAt(where)];
            case 26:
                _x.sent();
                _j = expect;
                return [4 /*yield*/, card()];
            case 27:
                (_j.apply(void 0, [_x.sent()]).toEqual(now));
                _x.label = 28;
            case 28:
                _i++;
                return [3 /*break*/, 25];
            case 29: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n3', agentId: 'a1', text: 'Released as 1.2.3' })];
            case 30:
                _x.sent();
                return [4 /*yield*/, viewAt(TOP)];
            case 31:
                _x.sent();
                return [4 /*yield*/, card()];
            case 32:
                later = _x.sent();
                expect(later).toContain('Released as 1.2.3');
                _k = 0, _l = [DOWN, TOP, DOWN];
                _x.label = 33;
            case 33:
                if (!(_k < _l.length)) return [3 /*break*/, 37];
                where = _l[_k];
                return [4 /*yield*/, viewAt(where)];
            case 34:
                _x.sent();
                _m = expect;
                return [4 /*yield*/, card()];
            case 35:
                (_m.apply(void 0, [_x.sent()]).toEqual(later));
                _x.label = 36;
            case 36:
                _k++;
                return [3 /*break*/, 33];
            case 37: 
            // The same through the rest of its life: handed in it is Delivered, Mark as done turns it green where it stands, and it then goes
            // under Finished. Each of those is seen once, in that order, wherever the view is when the panel is asked for
            return [4 /*yield*/, steps($, 1, 'claude-fable-5-2', 'a1')];
            case 38:
                // The same through the rest of its life: handed in it is Delivered, Mark as done turns it green where it stands, and it then goes
                // under Finished. Each of those is seen once, in that order, wherever the view is when the panel is asked for
                _x.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Released as 1.2.3.' })];
            case 39:
                _x.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a1', reason: 'answer', agentId: 'a1' })];
            case 40:
                _x.sent();
                STAGES = ['working', 'delivered', 'done', 'finished'];
                stageNow = function () { return __awaiter(_this, void 0, void 0, function () {
                    var words;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, card()];
                            case 1:
                                words = (_a.sent()).join(' | ');
                                return [2 /*return*/, words.includes('◐ Delivered') ? 'delivered' : words.includes('✓ Done') ? 'done' : words.includes('Releas') ? 'working' : 'finished'];
                        }
                    });
                }); };
                seen = [];
                look = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _i, _a, where, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _i = 0, _a = [TOP, DOWN, TOP, DOWN];
                                _d.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 5];
                                where = _a[_i];
                                return [4 /*yield*/, viewAt(where)];
                            case 2:
                                _d.sent();
                                _c = (_b = seen).push;
                                return [4 /*yield*/, stageNow()];
                            case 3:
                                (_c.apply(_b, [_d.sent()]));
                                _d.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, look()];
            case 41:
                _x.sent();
                expect(seen.at(-1)).toBe('delivered');
                _p = (_o = pane).press;
                _r = {};
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 42: return [4 /*yield*/, _p.apply(_o, [(_r.key = (_w = (_v = (_x.sent()).find(function (b) { return b.props.label === 'Mark as done'; })) === null || _v === void 0 ? void 0 : _v.key) !== null && _w !== void 0 ? _w : '', _r)])];
            case 43:
                _x.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stageNow()];
                            case 1: return [2 /*return*/, ((_a.sent()) === 'done' ? true : undefined)];
                        }
                    }); }); })];
            case 44:
                _q.apply(void 0, [_x.sent()]).toBe(true);
                i = 0;
                _x.label = 45;
            case 45:
                if (!(i < 6)) return [3 /*break*/, 49];
                return [4 /*yield*/, look()];
            case 46:
                _x.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 47:
                (_x.sent());
                _x.label = 48;
            case 48:
                i += 1;
                return [3 /*break*/, 45];
            case 49:
                expect(seen.at(-1)).toBe('finished');
                expect(seen.map(function (stage) { return STAGES.indexOf(stage); })).toEqual(__spreadArray([], seen.map(function (stage) { return STAGES.indexOf(stage); }), true).sort(function (x, y) { return x - y; }));
                expect(__spreadArray([], new Set(seen), true)).toEqual(['delivered', 'done', 'finished']);
                return [4 /*yield*/, pane.unmount()];
            case 50:
                _x.sent();
                return [2 /*return*/];
        }
    });
}); });
test('folding Finished while scrolled down draws one card and the fold at their own height, even after the list was long', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _i, _a, what, _b, _c, n, first, _loop_3, _d, _e, n, _f, list, fold, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var _s, _t;
    var _this = this;
    var _u, _v, _w, _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'five pieces of work', wait: false, origin: composer })];
            case 2:
                _y.sent();
                _i = 0, _a = ['ears', 'nose', 'chin', 'eyes', 'mouth'];
                _y.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                what = _a[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Check the ".concat(what), prompt: what }))];
            case 4:
                _y.sent();
                _y.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                _b = 0, _c = [2, 3, 4, 5];
                _y.label = 7;
            case 7:
                if (!(_b < _c.length)) return [3 /*break*/, 10];
                n = _c[_b];
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: "t".concat(n), reason: 'answer', agentId: "a".concat(n) })];
            case 8:
                _y.sent();
                _y.label = 9;
            case 9:
                _b++;
                return [3 /*break*/, 7];
            case 10: return [4 /*yield*/, clock.advance(2100)
                // (each ended card stays up until the person dismisses it: they dismissed all four)
            ];
            case 11:
                _y.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 12:
                first = _y.sent();
                _loop_3 = function (n) {
                    var _z;
                    return __generator(this, function (_0) {
                        switch (_0.label) {
                            case 0:
                                _z = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(first, "dismiss-a".concat(n))];
                                    }); }); })];
                            case 1:
                                _z.apply(void 0, [_0.sent()]).toBeDefined();
                                return [4 /*yield*/, pressed(first, "dismiss-a".concat(n))];
                            case 2:
                                (_0.sent());
                                return [2 /*return*/];
                        }
                    });
                };
                _d = 0, _e = [2, 3, 4, 5];
                _y.label = 13;
            case 13:
                if (!(_d < _e.length)) return [3 /*break*/, 16];
                n = _e[_d];
                return [5 /*yield**/, _loop_3(n)];
            case 14:
                _y.sent();
                _y.label = 15;
            case 15:
                _d++;
                return [3 /*break*/, 13];
            case 16: return [4 /*yield*/, clock.advance(2100)];
            case 17:
                _y.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, first.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished 4$/.test(String(b.props.label)); })];
                        }
                    }); }); })];
            case 18:
                _f.apply(void 0, [_y.sent()]).toBeDefined();
                return [4 /*yield*/, first.unmount()
                    // (and left the panel alone since: a drawing is held while they use it)
                ];
            case 19:
                _y.sent();
                // (and left the panel alone since: a drawing is held while they use it)
                return [4 /*yield*/, clock.advance(31000)
                    // The person opened Finished, the list ran to 300 rows as the app said, and they scrolled down to its fold, 200 rows in
                ];
            case 20:
                // (and left the panel alone since: a drawing is held while they use it)
                _y.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 200, bodyRows: 50 } }), surface: 'desktop' }))];
            case 21:
                list = _y.sent();
                fold = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished 4$/.test(String(b.props.label)); })];
                    }
                }); }); };
                _h = (_g = list).press;
                _s = {};
                _j = String;
                return [4 /*yield*/, fold()];
            case 22: return [4 /*yield*/, _h.apply(_g, [(_s.key = _j.apply(void 0, [(_u = (_y.sent())) === null || _u === void 0 ? void 0 : _u.key]), _s)])];
            case 23:
                _y.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, fold()];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === '▾ Finished 4' ? true : undefined)];
                        }
                    }); }); })];
            case 24:
                _k.apply(void 0, [_y.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 200, by: 20, bodyRows: 50, contentRows: 300, origin: { kind: 'person' } }).catch(function () { return undefined; })
                    // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
                    // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
                    // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
                ];
            case 25:
                _y.sent();
                _m = (_l = list).press;
                _t = {};
                _o = String;
                return [4 /*yield*/, fold()];
            case 26: 
            // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
            // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
            // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
            return [4 /*yield*/, _m.apply(_l, [(_t.key = _o.apply(void 0, [(_v = (_y.sent())) === null || _v === void 0 ? void 0 : _v.key]), _t)])];
            case 27:
                // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
                // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
                // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
                _y.sent();
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, fold()];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === '▸ Finished 4' ? true : undefined)];
                        }
                    }); }); })];
            case 28:
                _p.apply(void 0, [_y.sent()]).toBe(true);
                _q = expect;
                _r = Number;
                return [4 /*yield*/, list.find({ type: 'Box' })];
            case 29:
                _q.apply(void 0, [_r.apply(void 0, [(_x = (_w = (_y.sent())) === null || _w === void 0 ? void 0 : _w.props.minHeight) !== null && _x !== void 0 ? _x : 0])]).toBe(50);
                return [4 /*yield*/, list.unmount()];
            case 30:
                _y.sent();
                return [2 /*return*/];
        }
    });
}); });
test('with only a Details tab in front, or the Servers tab open, the mod still asks for no more than a drawing every ten seconds', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, clock, _a, writes, counting, list, details, servers, i;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }, { id: 'servers', isShown: true, isPlaced: true }];
                clock = world(on, { live: live }).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _d.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                _d.sent();
                return [4 /*yield*/, list.unmount()];
            case 6:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 7:
                details = _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'servers', props: __assign(__assign({}, LIST.props), { title: 'Servers' }), surface: 'desktop' }))];
            case 8:
                servers = _d.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 9:
                _d.sent();
                counting.isOn = true;
                i = 0;
                _d.label = 10;
            case 10:
                if (!(i < 60)) return [3 /*break*/, 14];
                return [4 /*yield*/, clock.advance(1000)];
            case 11:
                _d.sent();
                return [4 /*yield*/, details.findAll({ type: 'Text' })];
            case 12:
                (_d.sent());
                _d.label = 13;
            case 13:
                i++;
                return [3 /*break*/, 10];
            case 14:
                expect((_b = writes.invalidate) !== null && _b !== void 0 ? _b : 0).toBeLessThanOrEqual(7);
                expect((_c = writes.tick) !== null && _c !== void 0 ? _c : 0).toBe(0);
                return [4 /*yield*/, Promise.all([details.unmount(), servers.unmount()])];
            case 15:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test("the panel's recorder writes nothing unless switched on, and switched on writes the drawings, focus and typing as counts, never a letter typed, and switches itself off", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, list, box, recorded, _b, _c, _d, _e, _i, _f, text_1, _g, _h, path, text, events, _j, _k, typed, bar, barBox, open, _l, _m, _o, typed, _p, _q, second, barEvents, _r, _s, typed;
    var _t, _u, _v, _w;
    var _this = this;
    var _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _9.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' })];
            case 4:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _9.sent();
                box = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                recorded = function () { return __spreadArray([], files.keys(), true).filter(function (path) { return path.includes('/panel-record/'); }); };
                return [4 /*yield*/, clock.advance(3000)];
            case 6:
                _9.sent();
                _c = (_b = list).input;
                _t = {};
                return [4 /*yield*/, box()];
            case 7: return [4 /*yield*/, _c.apply(_b, [(_t.key = (_y = (_x = (_9.sent())) === null || _x === void 0 ? void 0 : _x.key) !== null && _y !== void 0 ? _y : '', _t.text = 'Zebra quartz 7731', _t.kind = 'change', _t)])];
            case 8:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 9:
                _9.sent();
                expect(recorded()).toEqual([]);
                // A switch left from long ago starts nothing, and goes
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                return [4 /*yield*/, clock.advance(3000)];
            case 10:
                _9.sent();
                _e = (_d = list).input;
                _u = {};
                return [4 /*yield*/, box()];
            case 11: return [4 /*yield*/, _e.apply(_d, [(_u.key = (_0 = (_z = (_9.sent())) === null || _z === void 0 ? void 0 : _z.key) !== null && _0 !== void 0 ? _0 : '', _u.text = 'Zebra quartz 7731 more', _u.kind = 'change', _u)])];
            case 12:
                _9.sent();
                return [4 /*yield*/, clock.advance(7000)];
            case 13:
                _9.sent();
                expect(recorded()).toEqual([]);
                expect(files.has("".concat(MEMORY, "/record-panel.on"))).toBe(false);
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(1700000016000));
                return [4 /*yield*/, clock.advance(3000)];
            case 14:
                _9.sent();
                return [4 /*yield*/, box()];
            case 15:
                _9.sent();
                _i = 0, _f = ['Q', 'Qu', 'Quiet lynx 4419'];
                _9.label = 16;
            case 16:
                if (!(_i < _f.length)) return [3 /*break*/, 20];
                text_1 = _f[_i];
                _h = (_g = list).input;
                _v = {};
                return [4 /*yield*/, box()];
            case 17: return [4 /*yield*/, _h.apply(_g, [(_v.key = (_2 = (_1 = (_9.sent())) === null || _1 === void 0 ? void 0 : _1.key) !== null && _2 !== void 0 ? _2 : '', _v.text = text_1, _v.kind = 'change', _v)])];
            case 18:
                _9.sent();
                _9.label = 19;
            case 19:
                _i++;
                return [3 /*break*/, 16];
            case 20: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear.' })];
            case 21:
                _9.sent();
                return [4 /*yield*/, clock.advance(200000)];
            case 22:
                _9.sent();
                return [4 /*yield*/, box()];
            case 23:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 24:
                _9.sent();
                path = recorded()[0];
                text = (_3 = files.get(path !== null && path !== void 0 ? path : '')) !== null && _3 !== void 0 ? _3 : '';
                events = text.trim().split('\n').map(function (line) { return JSON.parse(line); });
                expect(events.some(function (one) { return one.ev === 'render'; })).toBe(true);
                // The reply box is found in the drawing, by its key and where it sits among the drawing's elements
                expect(events.some(function (one) { var _a; return (_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /-reply-/.test(input.key); }); })).toBe(true);
                expect(events.filter(function (one) { return one.ev === 'input'; }).map(function (one) { return one.count; })).toEqual([1, 2, 3]);
                for (_j = 0, _k = ['Quiet', 'lynx', '4419', 'Zebra', 'quartz', '7731', 'Qu"']; _j < _k.length; _j++) {
                    typed = _k[_j];
                    expect(text.includes(typed)).toBe(false);
                }
                expect(files.has("".concat(MEMORY, "/record-panel.on"))).toBe(false);
                // The bar above the prompt, where the desktop's reply box is drawn, is recorded the same way: its drawings with the box in them,
                // typing there as counts, and the panel's drawings beside it, which hold no reply box
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 25:
                bar = _9.sent();
                barBox = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(3000)];
            case 26:
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Answer in words'; })];
                        }
                    }); }); })];
            case 27:
                open = _9.sent();
                return [4 /*yield*/, list.press({ key: (_4 = open === null || open === void 0 ? void 0 : open.key) !== null && _4 !== void 0 ? _4 : '' })];
            case 28:
                _9.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, barBox()];
                    }); }); })];
            case 29:
                _l.apply(void 0, [_9.sent()]).toBeDefined();
                return [4 /*yield*/, box()];
            case 30:
                _9.sent();
                _m = 0, _o = ['M', 'Mo', 'Mossy heron 2203'];
                _9.label = 31;
            case 31:
                if (!(_m < _o.length)) return [3 /*break*/, 35];
                typed = _o[_m];
                _q = (_p = bar).input;
                _w = {};
                return [4 /*yield*/, barBox()];
            case 32: return [4 /*yield*/, _q.apply(_p, [(_w.key = (_6 = (_5 = (_9.sent())) === null || _5 === void 0 ? void 0 : _5.key) !== null && _6 !== void 0 ? _6 : '', _w.text = typed, _w.kind = 'change', _w)])];
            case 33:
                _9.sent();
                _9.label = 34;
            case 34:
                _m++;
                return [3 /*break*/, 31];
            case 35: return [4 /*yield*/, clock.advance(200000)];
            case 36:
                _9.sent();
                return [4 /*yield*/, barBox()];
            case 37:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 38:
                _9.sent();
                second = (_8 = files.get((_7 = recorded().find(function (one) { return one !== path; })) !== null && _7 !== void 0 ? _7 : '')) !== null && _8 !== void 0 ? _8 : '';
                barEvents = second.trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); });
                expect(barEvents.some(function (one) { var _a; return one.ev === 'render' && one.component === 'AbovePrompt' && ((_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /^band-.*-reply-/.test(input.key); })); })).toBe(true);
                expect(barEvents.filter(function (one) { return one.ev === 'input' && one.site === 'bar'; }).map(function (one) { return one.count; })).toEqual([1, 2, 3]);
                expect(barEvents.some(function (one) { var _a; return one.ev === 'render' && one.component === 'Pane' && ((_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /-reply-/.test(input.key); })); })).toBe(false);
                for (_r = 0, _s = ['Mossy', 'heron', '2203']; _r < _s.length; _r++) {
                    typed = _s[_r];
                    expect(second.includes(typed)).toBe(false);
                }
                return [4 /*yield*/, bar.unmount()];
            case 39:
                _9.sent();
                return [4 /*yield*/, list.unmount()];
            case 40:
                _9.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a reply never waits behind a long command: one that may run for minutes is refused with the same call to send in the background, a wait for the person is refused, and a reply given while a short one is held open is taken at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, held, files, list, _i, _b, _c, n, description, r, _d, _e, _f, n, description, wait, _loop_4, _g, _h, _j, id, more, _k, _l, _m, id, more, r, box, _o, _p, _q, _r, _, e_2_1, _s;
    var _this = this;
    var _t, e_2, _u, _v;
    var _w, _x, _y, _z, _0;
    return __generator(this, function (_1) {
        switch (_1.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _1.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'try the reply box', wait: false, origin: composer })];
            case 2:
                _1.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Reply box that never drags the panel', prompt: 'try the reply box' }))];
            case 3:
                _1.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _1.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Try the new reply box and tell me how it feels.', choices: ['It feels right', 'Still wrong'] })
                    // Waits that only mention the person, or come with no question open, are no waits for them
                ];
            case 5:
                _1.sent();
                _i = 0, _b = ['Wait for the preview to come up, then open it for you (30 s)', 'Wait until the page has loaded for you to see', 'Wait for your answer key upload to finish', 'Poll your decision tree training (about 1 min)', 'Wait for your CT scans to download'].entries();
                _1.label = 6;
            case 6:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                _c = _b[_i], n = _c[0], description = _c[1];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "ok".concat(n), agentId: 'a1', command: 'true', description: description })];
            case 7:
                r = (_1.sent());
                expect(r.deny).toBeUndefined();
                _1.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                _d = 0, _e = ['Wait for you to try the panel (up to 9 min)', 'Wait for your reply (up to 9 min)', 'Waiting on your answer to the release'].entries();
                _1.label = 10;
            case 10:
                if (!(_d < _e.length)) return [3 /*break*/, 13];
                _f = _e[_d], n = _f[0], description = _f[1];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "w".concat(n), agentId: 'a1', command: 'hold record', description: description, timeout: 600000 })];
            case 11:
                wait = (_1.sent());
                expect(wait.deny).toContain('End your step now');
                _1.label = 12;
            case 12:
                _d++;
                return [3 /*break*/, 10];
            case 13:
                expect(held.has('record')).toBe(false);
                // A build, render, browser run or download asking for a longer time limit, or a script of its own asking for one, whatever it
                // prints of how far it is (19 Nov: told to print progress before it could start held open, a wait counted seconds), is
                // refused with the same call to send in the background, never changed on its way (auto mode refuses a call a hook changed after it
                // reviewed it: 484 calls on 16-17 Nov); sent so, it runs as written
                files.set('/repo/sort.py', 'for i, f in enumerate(fs):\n  print(f"progress: {i}/{len(fs)} scans", flush=True)\n');
                _loop_4 = function (id, more) {
                    var r, sent;
                    return __generator(this, function (_2) {
                        switch (_2.label) {
                            case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: 'a1' }, more))];
                            case 1:
                                r = (_2.sent());
                                expect([id, r.deny]).toEqual([id, expect.stringContaining('Send the same call again with `run_in_background: true` and nothing else changed')]);
                                expect(r.deny).toContain('replies reach you while it runs');
                                expect(__spreadArray([], held.keys(), true).some(function (key) { return key.startsWith(id); })).toBe(false);
                                return [4 /*yield*/, $.tool.call(__assign(__assign({ tool: 'Bash', tool_use_id: "".concat(id, "b"), agentId: 'a1' }, more), { run_in_background: true }))];
                            case 2:
                                sent = (_2.sent());
                                expect([id, sent.deny, (_w = sent.result) === null || _w === void 0 ? void 0 : _w.backgroundTaskId]).toEqual([id, undefined, "bg-".concat(id, "b")]);
                                return [2 /*return*/];
                        }
                    });
                };
                _g = 0, _h = [['s1', { timeout: 600000, command: 'npm run build', description: 'Run the build' }], ['s5', { timeout: 600000, command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Get the scans' }], ['s7', { timeout: 600000, command: 'python3 /repo/sort.py', description: 'Run the sorting of the scans' }]];
                _1.label = 14;
            case 14:
                if (!(_g < _h.length)) return [3 /*break*/, 17];
                _j = _h[_g], id = _j[0], more = _j[1];
                return [5 /*yield**/, _loop_4(id, more)];
            case 15:
                _1.sent();
                _1.label = 16;
            case 16:
                _g++;
                return [3 /*break*/, 14];
            case 17:
                _k = 0, _l = [['q1', { timeout: 600000, command: 'git push', description: 'Push the branch' }], ['q2', { timeout: 300000, command: 'npm test', description: 'Run the tests' }], ['q3', { timeout: 600000, command: 'rg -n nose /repo', description: 'Look for the nose' }]];
                _1.label = 18;
            case 18:
                if (!(_k < _l.length)) return [3 /*break*/, 21];
                _m = _l[_k], id = _m[0], more = _m[1];
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: 'a1' }, more))];
            case 19:
                r = (_1.sent());
                expect([id, r.deny, (_x = r.result) === null || _x === void 0 ? void 0 : _x.backgroundTaskId]).toEqual([id, undefined, undefined]);
                _1.label = 20;
            case 20:
                _k++;
                return [3 /*break*/, 18];
            case 21:
                // A short one is held open as asked; a reply given meanwhile is taken at once, and the card says it in one grey line
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'hold build', description: 'Run the build' }));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('build')];
                    }); }); })];
            case 22:
                _1.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 23:
                _1.sent();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 24:
                box = (_1.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_y = box === null || box === void 0 ? void 0 : box.key) !== null && _y !== void 0 ? _y : '', text: 'Yep, looks good' })];
            case 25:
                _1.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Yep, looks good”' })];
                    }); }); })];
            case 26:
                _o.apply(void 0, [(_z = (_1.sent())) === null || _z === void 0 ? void 0 : _z.props.dimColor]).toBe(true);
                (_0 = held.get('build')) === null || _0 === void 0 ? void 0 : _0('built');
                _1.label = 27;
            case 27:
                _1.trys.push([27, 32, 33, 38]);
                _p = true, _q = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _1.label = 28;
            case 28: return [4 /*yield*/, _q.next()];
            case 29:
                if (!(_r = _1.sent(), _t = _r.done, !_t)) return [3 /*break*/, 31];
                _v = _r.value;
                _p = false;
                _ = _v;
                void _;
                _1.label = 30;
            case 30:
                _p = true;
                return [3 /*break*/, 28];
            case 31: return [3 /*break*/, 38];
            case 32:
                e_2_1 = _1.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 38];
            case 33:
                _1.trys.push([33, , 36, 37]);
                if (!(!_p && !_t && (_u = _q.return))) return [3 /*break*/, 35];
                return [4 /*yield*/, _u.call(_q)];
            case 34:
                _1.sent();
                _1.label = 35;
            case 35: return [3 /*break*/, 37];
            case 36:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 37: return [7 /*endfinally*/];
            case 38:
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Yep, looks good”' })];
                    }); }); })];
            case 39:
                _s.apply(void 0, [_1.sent()]).toBeDefined();
                return [4 /*yield*/, settle()];
            case 40:
                _1.sent();
                return [2 /*return*/];
        }
    });
}); });
test("where the bar above the prompt takes a box, a card's answers end with Answer in words, which opens the one box in that bar and never in the panel or its Details, whose window the app drags to a box that holds the cursor (15 Nov); Close takes it away with what was typed kept; one box at a time; Message on a Done card opens the same box, and what is sent from it starts that task again; nothing is ever put into the chat's own box", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, clock, files, keep, resumed, stopped, submitted, filled, list, details, boxesIn, says, labelled, OPEN, CLOSE, _b, _c, bar, _d, _e, _f, _g, term, _h, _j, _k, _l, _m, _o, shape, _p, _q, _r, _s, boxNumber, numbered, _t, _u, _v, _w, _x, MARK, isShow, scrolled, _y, _z, _0, _1, barDrawings, growing, drawnBefore, typed, _i, _2, _3, n, line, _4, _5, _6, drawnAfter, _7, _8, n, _9, keyBox, _10, _11, first, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, folded, _54, _55, _56, _57, _58, _59, _60, _61, unfolded, _62, _63, _64, _65, _66, surveyed, _67, again, _68, _69, _70, _71, typedIn, _72, _73, _74, _75, _76, _77, _78, _79, _80, second, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, shut, five, _102, _103, _104, n, text, _105, _106, _107, _108, _109, _110, _111, key, _112, _113, top, _114, _115, changeBox, changes, toldOfChange, wasSubmitted, _116, _117, _118, opened, _119, _120, _121, _122, _123, _124, _125, _126, again2, sentAt, _127, _128, _129, _130, _131, atWork, _132, footOf, _133, _134, _135, view3, viewBox, _136, _137, heads, _138, viewNumber, _139, _140, viewNumbered, _141, _142, n, _143, _144, _145, _146, _147, _148, _149, _150, chips, _151, _152, _153, _154, _155, _156, wasStopped, _157, _158, _159, now, _160, _161, _162, _163, _164, _165, _166;
    var _167, _168, _169, _170, _171, _172, _173, _174, _175, _176, _177, _178, _179, _180, _181, _182, _183, _184, _185, _186, _187, _188, _189, _190, _191, _192, _193, _194, _195, _196, _197, _198, _199;
    var _this = this;
    var _200, _201, _202, _203, _204, _205, _206, _207, _208, _209, _210, _211, _212, _213, _214, _215, _216, _217, _218, _219, _220, _221, _222, _223, _224, _225, _226, _227, _228, _229, _230, _231, _232, _233, _234, _235, _236, _237, _238, _239, _240, _241, _242, _243, _244, _245, _246, _247, _248, _249, _250, _251, _252, _253, _254, _255, _256, _257, _258, _259, _260, _261, _262, _263, _264, _265, _266, _267, _268, _269, _270, _271, _272, _273, _274, _275, _276, _277, _278, _279, _280, _281, _282, _283, _284, _285, _286, _287, _288, _289, _290, _291, _292, _293, _294, _295, _296, _297;
    return __generator(this, function (_298) {
        switch (_298.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), appended = _a.appended, clock = _a.clock, files = _a.files, keep = _a.keep, resumed = _a.resumed, stopped = _a.stopped, submitted = _a.submitted;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _298.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _298.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?', choices: ['Left', 'Right'] })];
            case 4:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                details = _298.sent();
                boxesIn = function (site) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                says = function (site, text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (one) { var _a; return text.test((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                labelled = function (site, label) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.props.label === label; })];
                    }
                }); }); };
                OPEN = 'Answer in words';
                CLOSE = 'Close';
                // A surface whose bar was never drawn keeps the card's own box: a reply in words can always be typed somewhere
                _b = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 7:
                // A surface whose bar was never drawn keeps the card's own box: a reply in words can always be typed somewhere
                _b.apply(void 0, [(_298.sent()).length]).toBe(1);
                _c = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 8:
                _c.apply(void 0, [(_298.sent()).length]).toBe(0);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 9:
                bar = _298.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1:
                                _a = (_b.sent()).length === 0;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(details)];
                            case 2:
                                _a = (_b.sent()).length === 0;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 10:
                _d.apply(void 0, [_298.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 11:
                _e.apply(void 0, [(_298.sent()).length]).toBe(0);
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 12:
                _f.apply(void 0, [(_298.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return ['Left', 'Right', OPEN].includes(label); })]).toEqual(['Left', 'Right', OPEN]);
                _g = expect;
                return [4 /*yield*/, labelled(details, OPEN)];
            case 13:
                _g.apply(void 0, [(_298.sent()).length]).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 14:
                term = _298.sent();
                _h = expect;
                return [4 /*yield*/, boxesIn(term)];
            case 15:
                _h.apply(void 0, [(_298.sent()).length]).toBe(1);
                _j = expect;
                return [4 /*yield*/, labelled(term, OPEN)];
            case 16:
                _j.apply(void 0, [(_298.sent()).length]).toBe(0);
                return [4 /*yield*/, term.unmount()
                    // Pressed: one box, in the bar, under one line that names the work it goes to, with what Enter does, Send and Close; the card
                    // offers to close it
                ];
            case 17:
                _298.sent();
                _l = (_k = list).press;
                _167 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 18: 
            // Pressed: one box, in the bar, under one line that names the work it goes to, with what Enter does, Send and Close; the card
            // offers to close it
            return [4 /*yield*/, _l.apply(_k, [(_167.key = (_201 = (_200 = (_298.sent())[0]) === null || _200 === void 0 ? void 0 : _200.key) !== null && _201 !== void 0 ? _201 : '', _167)])];
            case 19:
                // Pressed: one box, in the bar, under one line that names the work it goes to, with what Enter does, Send and Close; the card
                // offers to close it
                _298.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 20:
                _m.apply(void 0, [_298.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, oneBox(bar)];
            case 21:
                _o.apply(void 0, [_298.sent()]).toEqual({ head: '↳ Your answer to “Check the ears”', fields: ['Type your answer'], enter: SENDS, buttons: ['Send', 'Close'] });
                shape = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bar.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return ['Send', 'Close'].includes(String(b.props.label)); }).map(function (b) { var _a, _b; return [b.props.label, (_a = b.props.variant) !== null && _a !== void 0 ? _a : null, (_b = b.props.plain) !== null && _b !== void 0 ? _b : null]; })];
                    }
                }); }); };
                _p = expect;
                return [4 /*yield*/, shape()];
            case 22:
                _p.apply(void 0, [_298.sent()]).toEqual([['Send', 'primary', null], ['Close', null, true]]);
                // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
                // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
                _q = expect;
                _r = 'submitLabel';
                return [4 /*yield*/, boxesIn(bar)];
            case 23:
                // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
                // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
                _q.apply(void 0, [_r in ((_203 = (_202 = (_298.sent())[0]) === null || _202 === void 0 ? void 0 : _202.props) !== null && _203 !== void 0 ? _203 : {})]).toBe(false);
                // Four lines tall (17 Nov, the person: "the text box is usually very small")
                _s = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 24:
                // Four lines tall (17 Nov, the person: "the text box is usually very small")
                _s.apply(void 0, [(_204 = (_298.sent())[0]) === null || _204 === void 0 ? void 0 : _204.props.rows]).toBe(4);
                boxNumber = function () { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                walk = function (node) {
                                    var _a, _b, _c;
                                    if (Array.isArray(node))
                                        return void node.forEach(walk);
                                    if (!node || typeof node !== 'object')
                                        return;
                                    var one = node;
                                    if (one.type === 'Input' && /-reply-/.test((_b = (_a = one.props) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : ''))
                                        found = (_c = one.press) === null || _c === void 0 ? void 0 : _c.handle;
                                    walk(one.children);
                                };
                                _a = walk;
                                return [4 /*yield*/, bar.drawn()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                return [4 /*yield*/, boxNumber()];
            case 25:
                numbered = _298.sent();
                expect(numbered).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear now' })];
            case 26:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'n2', agentId: 'a1', item: 'Look at the left ear', state: 'doing' })];
            case 27:
                _298.sent();
                return [4 /*yield*/, clock.advance(1500)];
            case 28:
                _298.sent();
                _t = expect;
                return [4 /*yield*/, boxNumber()];
            case 29:
                _t.apply(void 0, [_298.sent()]).toBe(numbered);
                _u = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 30:
                _v = (_298.sent()).length;
                return [4 /*yield*/, boxesIn(details)];
            case 31:
                _u.apply(void 0, [_v + (_298.sent()).length]).toBe(0);
                _w = expect;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 32:
                _w.apply(void 0, [(_298.sent()).length]).toBe(1);
                _x = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 33:
                _x.apply(void 0, [(_298.sent()).length]).toBe(0);
                MARK = /^● 1 waiting for you/;
                isShow = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, labelled(bar, 'Show')];
                        case 1: return [2 /*return*/, (_a.sent()).length > 0];
                    }
                }); }); };
                scrolled = function (offset) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.unmount()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: offset, bodyRows: 20 } }), surface: 'desktop' }))];
                        case 2: return [2 /*return*/, ((list = _a.sent()))];
                    }
                }); }); };
                return [4 /*yield*/, scrolled(40)];
            case 34:
                _298.sent();
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 35:
                _y.apply(void 0, [_298.sent()]).toBe(true);
                _z = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: MARK })];
            case 36:
                _z.apply(void 0, [_298.sent()]).toBeDefined();
                return [4 /*yield*/, scrolled(0)];
            case 37:
                _298.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 38:
                _0.apply(void 0, [_298.sent()]).toBe(true);
                _1 = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: MARK })];
            case 39:
                _1.apply(void 0, [_298.sent()]).toBeDefined();
                // Typed in, line after line, while work runs: the bar is never asked for again until the typing stops. The app builds every
                // drawing it is given anew, the box under the cursor too, whose blue ring then fades in again, so a bar drawn again as the box
                // grew a line, or given again as it was for each redraw that work writing its cards asked for, flashed as the person typed (17 Nov,
                // the person: "it starts jittering and flashing blue, not blue, blue, not blue"). The box stays four lines, its text scrolling
                // within, and the same box
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, clock.advance(2100)];
            case 40:
                _298.sent();
                barDrawings = function () { return __awaiter(_this, void 0, void 0, function () {
                    var path;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, clock.advance(2100)];
                            case 1:
                                _b.sent();
                                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                                return [2 /*return*/, ((_a = files.get(path !== null && path !== void 0 ? path : '')) !== null && _a !== void 0 ? _a : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); }).filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; }).length];
                        }
                    });
                }); };
                return [4 /*yield*/, boxesIn(bar)];
            case 41:
                growing = (_298.sent())[0];
                return [4 /*yield*/, bar.input({ key: (_205 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _205 !== void 0 ? _205 : '', text: 'The left.', kind: 'change' })];
            case 42:
                _298.sent();
                return [4 /*yield*/, barDrawings()];
            case 43:
                drawnBefore = _298.sent();
                typed = 'The left.';
                _i = 0, _2 = ['Then the right.', 'Then both, side by side.', 'a long line that wraps '.repeat(30), 'And the scans.', 'Thanks.'].entries();
                _298.label = 44;
            case 44:
                if (!(_i < _2.length)) return [3 /*break*/, 50];
                _3 = _2[_i], n = _3[0], line = _3[1];
                typed = "".concat(typed, "\n").concat(line);
                return [4 /*yield*/, bar.input({ key: (_206 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _206 !== void 0 ? _206 : '', text: typed, kind: 'change' })];
            case 45:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "t".concat(n), agentId: 'a1', text: "Step ".concat(n, " of the ears") })];
            case 46:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: "u".concat(n), agentId: 'a1', item: "Look at scan ".concat(n), state: 'doing' })];
            case 47:
                _298.sent();
                return [4 /*yield*/, clock.advance(700)];
            case 48:
                _298.sent();
                _298.label = 49;
            case 49:
                _i++;
                return [3 /*break*/, 44];
            case 50:
                _4 = expect;
                return [4 /*yield*/, barDrawings()];
            case 51:
                _4.apply(void 0, [_298.sent()]).toBe(drawnBefore);
                _5 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 52:
                _5.apply(void 0, [(_207 = (_298.sent())[0]) === null || _207 === void 0 ? void 0 : _207.props.rows]).toBe(4);
                _6 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 53:
                _6.apply(void 0, [(_208 = (_298.sent())[0]) === null || _208 === void 0 ? void 0 : _208.key]).toBe(growing === null || growing === void 0 ? void 0 : growing.key);
                // Half a minute after the last letter the hold ends by itself, as the app may say nothing when the cursor leaves: what was put
                // off is drawn then, once. A letter typed holds it again at once
                return [4 /*yield*/, clock.advance(31000)];
            case 54:
                // Half a minute after the last letter the hold ends by itself, as the app may say nothing when the cursor leaves: what was put
                // off is drawn then, once. A letter typed holds it again at once
                _298.sent();
                return [4 /*yield*/, barDrawings()];
            case 55:
                drawnAfter = _298.sent();
                expect(drawnAfter).toBeGreaterThan(drawnBefore);
                return [4 /*yield*/, bar.input({ key: (_209 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _209 !== void 0 ? _209 : '', text: "".concat(typed, " More."), kind: 'change' })];
            case 56:
                _298.sent();
                _7 = 0, _8 = [1, 2, 3];
                _298.label = 57;
            case 57:
                if (!(_7 < _8.length)) return [3 /*break*/, 61];
                n = _8[_7];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "s".concat(n), agentId: 'a1', text: "Later step ".concat(n) })];
            case 58:
                _298.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 59:
                _298.sent();
                _298.label = 60;
            case 60:
                _7++;
                return [3 /*break*/, 57];
            case 61:
                _9 = expect;
                return [4 /*yield*/, barDrawings()];
            case 62:
                _9.apply(void 0, [_298.sent()]).toBe(drawnAfter);
                // What newly waits on the person still shows at once: a key box asked for meanwhile is in the panel within a second or two
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-k', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                keyBox = '7c1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(keyBox, ".json"), JSON.stringify({ id: keyBox, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: clock.now() }));
                return [4 /*yield*/, clock.advance(2000)];
            case 63:
                _298.sent();
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
                    }); }); })];
            case 64:
                _10.apply(void 0, [_298.sent()]).toBeDefined();
                files.delete("".concat(MEMORY, "/boxes/").concat(keyBox, ".json"));
                return [4 /*yield*/, clock.advance(2000)];
            case 65:
                _298.sent();
                _11 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_ASKED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 66:
                _11.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(bar)];
            case 67:
                first = (_298.sent())[0];
                return [4 /*yield*/, bar.input({ key: (_210 = first === null || first === void 0 ? void 0 : first.key) !== null && _210 !== void 0 ? _210 : '', text: 'The left, but ke', kind: 'change' })];
            case 68:
                _298.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 69:
                _298.sent();
                _12 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 70:
                _12.apply(void 0, [(_211 = (_298.sent())[0]) === null || _211 === void 0 ? void 0 : _211.key]).toBe(first === null || first === void 0 ? void 0 : first.key);
                _13 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 71:
                _13.apply(void 0, [(_213 = (_212 = (_298.sent())[0]) === null || _212 === void 0 ? void 0 : _212.props.value) !== null && _213 !== void 0 ? _213 : '']).toBe('');
                // A letter typed holds the bar as drawn for as long as the box may hold the cursor, past the half minute typing holds the
                // panel: the panel scrolled meanwhile draws nothing new under the cursor. Five minutes after the last letter it is drawn again
                return [4 /*yield*/, scrolled(40)];
            case 72:
                // A letter typed holds the bar as drawn for as long as the box may hold the cursor, past the half minute typing holds the
                // panel: the panel scrolled meanwhile draws nothing new under the cursor. Five minutes after the last letter it is drawn again
                _298.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 73:
                _298.sent();
                _14 = expect;
                return [4 /*yield*/, isShow()];
            case 74:
                _14.apply(void 0, [_298.sent()]).toBe(false);
                _15 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 75:
                _15.apply(void 0, [(_214 = (_298.sent())[0]) === null || _214 === void 0 ? void 0 : _214.key]).toBe(first === null || first === void 0 ? void 0 : first.key);
                return [4 /*yield*/, clock.advance(270000)];
            case 76:
                _298.sent();
                return [4 /*yield*/, scrolled(0)];
            case 77:
                _298.sent();
                return [4 /*yield*/, scrolled(40)];
            case 78:
                _298.sent();
                _16 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 79:
                _16.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, scrolled(0)
                    // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
                ];
            case 80:
                _298.sent();
                _18 = (_17 = bar).press;
                _168 = {};
                return [4 /*yield*/, labelled(bar, 'Close')];
            case 81: 
            // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
            return [4 /*yield*/, _18.apply(_17, [(_168.key = (_216 = (_215 = (_298.sent())[0]) === null || _215 === void 0 ? void 0 : _215.key) !== null && _216 !== void 0 ? _216 : '', _168)])];
            case 82:
                // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
                _298.sent();
                _19 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 83:
                _19.apply(void 0, [_298.sent()]).toBe(true);
                _20 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 84:
                _20.apply(void 0, [_298.sent()]).toBe(true);
                _21 = expect;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 85:
                _21.apply(void 0, [(_298.sent()).length]).toBe(0);
                _23 = (_22 = list).press;
                _169 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 86: return [4 /*yield*/, _23.apply(_22, [(_169.key = (_218 = (_217 = (_298.sent())[0]) === null || _217 === void 0 ? void 0 : _217.key) !== null && _218 !== void 0 ? _218 : '', _169)])];
            case 87:
                _298.sent();
                _24 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'The left, but ke' ? true : undefined)];
                        }
                    }); }); })];
            case 88:
                _24.apply(void 0, [_298.sent()]).toBe(true);
                _26 = (_25 = list).press;
                _170 = {};
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 89: 
            // Closed from the card, the same
            return [4 /*yield*/, _26.apply(_25, [(_170.key = (_220 = (_219 = (_298.sent())[0]) === null || _219 === void 0 ? void 0 : _219.key) !== null && _220 !== void 0 ? _220 : '', _170)])];
            case 90:
                // Closed from the card, the same
                _298.sent();
                _27 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 91:
                _27.apply(void 0, [_298.sent()]).toBe(true);
                _29 = (_28 = list).press;
                _171 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 92: return [4 /*yield*/, _29.apply(_28, [(_171.key = (_222 = (_221 = (_298.sent())[0]) === null || _221 === void 0 ? void 0 : _221.key) !== null && _222 !== void 0 ? _222 : '', _171)])];
            case 93:
                _298.sent();
                _30 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 94:
                _30.apply(void 0, [_298.sent()]).toBe(true);
                // A second piece of work asks while the box is open: the box stays the first card's, and the newer card offers its own
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sort the invoices', prompt: 'sort the invoices' }))];
            case 95:
                // A second piece of work asks while the box is open: the box stays the first card's, and the newer card offers its own
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which month?', choices: ['October', 'November'] })];
            case 96:
                _298.sent();
                _31 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1:
                                _a = (_b.sent()).length === 1;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, labelled(list, CLOSE)];
                            case 2:
                                _a = (_b.sent()).length === 1;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 97:
                _31.apply(void 0, [_298.sent()]).toBe(true);
                _32 = expect;
                return [4 /*yield*/, says(bar, /^↳ Your answer to “Check the ears”$/)];
            case 98:
                _32.apply(void 0, [_298.sent()]).toBe(true);
                _34 = (_33 = list).press;
                _172 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 99: 
            // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
            return [4 /*yield*/, _34.apply(_33, [(_172.key = (_224 = (_223 = (_298.sent())[0]) === null || _223 === void 0 ? void 0 : _223.key) !== null && _224 !== void 0 ? _224 : '', _172)])];
            case 100:
                // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
                _298.sent();
                _35 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, says(bar, /^↳ Your answer to “Sort the invoices”$/)];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 101:
                _35.apply(void 0, [_298.sent()]).toBe(true);
                _36 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 102:
                _36.apply(void 0, [(_298.sent()).length]).toBe(1);
                _37 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 103:
                _37.apply(void 0, [(_226 = (_225 = (_298.sent())[0]) === null || _225 === void 0 ? void 0 : _225.props.value) !== null && _226 !== void 0 ? _226 : '']).toBe('');
                _39 = (_38 = list).press;
                _173 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 104: return [4 /*yield*/, _39.apply(_38, [(_173.key = (_228 = (_227 = (_298.sent())[0]) === null || _227 === void 0 ? void 0 : _227.key) !== null && _228 !== void 0 ? _228 : '', _173)])];
            case 105:
                _298.sent();
                _40 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, says(bar, /^↳ Your answer to “Check the ears”$/)];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 106:
                _40.apply(void 0, [_298.sent()]).toBe(true);
                _41 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 107:
                _41.apply(void 0, [(_229 = (_298.sent())[0]) === null || _229 === void 0 ? void 0 : _229.props.value]).toBe('The left, but ke');
                _43 = (_42 = bar).input;
                _174 = {};
                return [4 /*yield*/, boxesIn(bar)];
            case 108: 
            // Sent from the bar with its Send button: it reaches the work in the person's own words, and the box goes with the ask, on to no
            // other card
            return [4 /*yield*/, _43.apply(_42, [(_174.key = (_231 = (_230 = (_298.sent())[0]) === null || _230 === void 0 ? void 0 : _230.key) !== null && _231 !== void 0 ? _231 : '', _174.text = 'The left, but keep the scan', _174.kind = 'change', _174)])];
            case 109:
                // Sent from the bar with its Send button: it reaches the work in the person's own words, and the box goes with the ask, on to no
                // other card
                _298.sent();
                _45 = (_44 = bar).press;
                _175 = {};
                return [4 /*yield*/, labelled(bar, 'Send')];
            case 110: return [4 /*yield*/, _45.apply(_44, [(_175.key = (_233 = (_232 = (_298.sent())[0]) === null || _232 === void 0 ? void 0 : _232.key) !== null && _233 !== void 0 ? _233 : '', _175)])];
            case 111:
                _298.sent();
                _46 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('in their own words: The left, but keep the scan'); })];
                    }); }); })];
            case 112:
                _46.apply(void 0, [_298.sent()]).toBeDefined();
                _47 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 113:
                _47.apply(void 0, [_298.sent()]).toBe(true);
                _48 = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 114:
                _48.apply(void 0, [(_298.sent()).length]).toBe(1);
                _50 = (_49 = list).press;
                _176 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 115: 
            // The bar folded by the person with a reply half typed in it: nothing of the bar is on screen, so the card has its own box
            // again, with what was typed, and offers no box elsewhere
            return [4 /*yield*/, _50.apply(_49, [(_176.key = (_235 = (_234 = (_298.sent())[0]) === null || _234 === void 0 ? void 0 : _234.key) !== null && _235 !== void 0 ? _235 : '', _176)])];
            case 116:
                // The bar folded by the person with a reply half typed in it: nothing of the bar is on screen, so the card has its own box
                // again, with what was typed, and offers no box elsewhere
                _298.sent();
                _51 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 117:
                _51.apply(void 0, [_298.sent()]).toBe(true);
                _53 = (_52 = bar).input;
                _177 = {};
                return [4 /*yield*/, boxesIn(bar)];
            case 118: return [4 /*yield*/, _53.apply(_52, [(_177.key = (_237 = (_236 = (_298.sent())[0]) === null || _236 === void 0 ? void 0 : _236.key) !== null && _237 !== void 0 ? _237 : '', _177.text = 'Nov', _177.kind = 'change', _177)])];
            case 119:
                _298.sent();
                return [4 /*yield*/, bar.unmount()];
            case 120:
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 121:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { isCollapsed: true }), surface: 'desktop' }))];
            case 122:
                folded = _298.sent();
                _54 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 123:
                _54.apply(void 0, [_298.sent()]).toBe(true);
                // The card's own box is the block's one field: a box of lines too, which sends by itself, with no Send button beside it
                _55 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 124:
                // The card's own box is the block's one field: a box of lines too, which sends by itself, with no Send button beside it
                _55.apply(void 0, [(_238 = (_298.sent())[0]) === null || _238 === void 0 ? void 0 : _238.props.rows]).toBe(4);
                _56 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 125:
                _56.apply(void 0, [(_239 = (_298.sent())[0]) === null || _239 === void 0 ? void 0 : _239.props.placeholder]).toBe(OPEN);
                _57 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 126:
                _57.apply(void 0, [(_240 = (_298.sent())[0]) === null || _240 === void 0 ? void 0 : _240.props.submitLabel]).toBe('Send');
                _58 = expect;
                return [4 /*yield*/, labelled(list, 'Send')];
            case 127:
                _58.apply(void 0, [(_298.sent()).length]).toBe(0);
                _59 = expect;
                return [4 /*yield*/, boxesIn(folded)];
            case 128:
                _60 = (_298.sent()).length;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 129:
                _61 = _60 + (_298.sent()).length;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 130:
                _59.apply(void 0, [_61 + (_298.sent()).length]).toBe(0);
                // Unfolded: the box does not open by itself; the card offers it again
                return [4 /*yield*/, folded.unmount()];
            case 131:
                // Unfolded: the box does not open by itself; the card offers it again
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 132:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 133:
                unfolded = _298.sent();
                _62 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1:
                                _a = (_b.sent()).length === 1;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(list)];
                            case 2:
                                _a = (_b.sent()).length === 0;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 134:
                _62.apply(void 0, [_298.sent()]).toBe(true);
                _63 = expect;
                return [4 /*yield*/, boxesIn(unfolded)];
            case 135:
                _63.apply(void 0, [(_298.sent()).length]).toBe(0);
                _65 = (_64 = list).press;
                _178 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 136: 
            // One of the app's surveys in the bar while the box is open: the box has no place there, and the card has its own again, with
            // what was typed
            return [4 /*yield*/, _65.apply(_64, [(_178.key = (_242 = (_241 = (_298.sent())[0]) === null || _241 === void 0 ? void 0 : _241.key) !== null && _242 !== void 0 ? _242 : '', _178)])];
            case 137:
                // One of the app's surveys in the bar while the box is open: the box has no place there, and the card has its own again, with
                // what was typed
                _298.sent();
                _66 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(unfolded)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 138:
                _66.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, unfolded.unmount()];
            case 139:
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 140:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { hasSurvey: true }), surface: 'desktop' }))];
            case 141:
                surveyed = _298.sent();
                _67 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 142:
                _67.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, surveyed.unmount()];
            case 143:
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // The bar back and the box opened, a reply half typed: a new question from the same work leaves the box as it is, the same box
                    // with what was typed. Only the person closes or moves it (16 Nov)
                ];
            case 144:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 145:
                again = _298.sent();
                _68 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 146:
                _68.apply(void 0, [_298.sent()]).toBe(true);
                _70 = (_69 = list).press;
                _179 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 147: return [4 /*yield*/, _70.apply(_69, [(_179.key = (_244 = (_243 = (_298.sent())[0]) === null || _243 === void 0 ? void 0 : _243.key) !== null && _244 !== void 0 ? _244 : '', _179)])];
            case 148:
                _298.sent();
                _71 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 149:
                _71.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(again)];
            case 150:
                typedIn = (_298.sent())[0];
                return [4 /*yield*/, again.input({ key: (_245 = typedIn === null || typedIn === void 0 ? void 0 : typedIn.key) !== null && _245 !== void 0 ? _245 : '', text: 'Nov 20', kind: 'change' })];
            case 151:
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 152:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'Which year?', choices: ['2025', '2026'] })];
            case 153:
                _298.sent();
                _72 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which year?' })];
                    }); }); })];
            case 154:
                _72.apply(void 0, [_298.sent()]).toBeDefined();
                _73 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 155:
                _73.apply(void 0, [(_298.sent()).map(function (one) { return one.key; })]).toEqual([typedIn === null || typedIn === void 0 ? void 0 : typedIn.key]);
                _74 = expect;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 156:
                _74.apply(void 0, [(_298.sent()).length]).toBe(1);
                _76 = (_75 = list).press;
                _180 = {};
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 157: 
            // Closed and opened again under the new question, what was typed is still there
            return [4 /*yield*/, _76.apply(_75, [(_180.key = (_247 = (_246 = (_298.sent())[0]) === null || _246 === void 0 ? void 0 : _246.key) !== null && _247 !== void 0 ? _247 : '', _180)])];
            case 158:
                // Closed and opened again under the new question, what was typed is still there
                _298.sent();
                _77 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 159:
                _77.apply(void 0, [_298.sent()]).toBe(true);
                _79 = (_78 = list).press;
                _181 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 160: return [4 /*yield*/, _79.apply(_78, [(_181.key = (_249 = (_248 = (_298.sent())[0]) === null || _248 === void 0 ? void 0 : _248.key) !== null && _249 !== void 0 ? _249 : '', _181)])];
            case 161:
                _298.sent();
                _80 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov 20' ? true : undefined)];
                        }
                    }); }); })];
            case 162:
                _80.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(again)];
            case 163:
                second = (_298.sent())[0];
                return [4 /*yield*/, again.input({ key: (_250 = second === null || second === void 0 ? void 0 : second.key) !== null && _250 !== void 0 ? _250 : '', text: 'Nov 202', kind: 'change' })];
            case 164:
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 165:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3b', agentId: 'a2', text: 'Which decade?', choices: ['2010s', '2020s'] })];
            case 166:
                _298.sent();
                _81 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which decade?' })];
                    }); }); })];
            case 167:
                _81.apply(void 0, [_298.sent()]).toBeDefined();
                _82 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 168:
                _82.apply(void 0, [(_298.sent()).map(function (one) { return one.key; })]).toEqual([second === null || second === void 0 ? void 0 : second.key]);
                return [4 /*yield*/, again.input({ key: (_251 = second === null || second === void 0 ? void 0 : second.key) !== null && _251 !== void 0 ? _251 : '', text: 'November 2026' })];
            case 169:
                _298.sent();
                _83 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: November 2026'); })];
                    }); }); })];
            case 170:
                _83.apply(void 0, [_298.sent()]).toBeDefined();
                _84 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 171:
                _84.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(2000)];
            case 172:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Which day?', choices: ['Monday', 'Friday'] })];
            case 173:
                _298.sent();
                _85 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 174:
                _85.apply(void 0, [_298.sent()]).toBe(true);
                _86 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 175:
                _87 = (_298.sent()).length;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 176:
                _86.apply(void 0, [_87 + (_298.sent()).length]).toBe(0);
                _89 = (_88 = list).press;
                _182 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 177: 
            // A button pressed on the card with the box open answers it, and the box leaves the bar with the ask
            return [4 /*yield*/, _89.apply(_88, [(_182.key = (_253 = (_252 = (_298.sent())[0]) === null || _252 === void 0 ? void 0 : _252.key) !== null && _253 !== void 0 ? _253 : '', _182)])];
            case 178:
                // A button pressed on the card with the box open answers it, and the box leaves the bar with the ask
                _298.sent();
                _90 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 179:
                _90.apply(void 0, [_298.sent()]).toBe(true);
                _92 = (_91 = list).press;
                _183 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 180: return [4 /*yield*/, _92.apply(_91, [(_183.key = (_255 = (_254 = (_298.sent()).find(function (b) { return b.props.label === 'Monday'; })) === null || _254 === void 0 ? void 0 : _254.key) !== null && _255 !== void 0 ? _255 : '', _183)])];
            case 181:
                _298.sent();
                _93 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Monday"'); })];
                    }); }); })];
            case 182:
                _93.apply(void 0, [_298.sent()]).toBeDefined();
                _94 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 183:
                _94.apply(void 0, [_298.sent()]).toBe(true);
                // The work taking its question back while the box is open and typed in: the box leaves the bar within a second or so, as the bar
                // held for the box is looked at once a second (the same as a card stopped or answered elsewhere)
                return [4 /*yield*/, clock.advance(2000)];
            case 184:
                // The work taking its question back while the box is open and typed in: the box leaves the bar within a second or so, as the bar
                // held for the box is looked at once a second (the same as a card stopped or answered elsewhere)
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Which hour?', choices: ['9', '10'] })];
            case 185:
                _298.sent();
                _95 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 186:
                _95.apply(void 0, [_298.sent()]).toBe(true);
                _97 = (_96 = list).press;
                _184 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 187: return [4 /*yield*/, _97.apply(_96, [(_184.key = (_257 = (_256 = (_298.sent())[0]) === null || _256 === void 0 ? void 0 : _256.key) !== null && _257 !== void 0 ? _257 : '', _184)])];
            case 188:
                _298.sent();
                _98 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 189:
                _98.apply(void 0, [_298.sent()]).toBe(true);
                _100 = (_99 = again).input;
                _185 = {};
                return [4 /*yield*/, boxesIn(again)];
            case 190: return [4 /*yield*/, _100.apply(_99, [(_185.key = (_259 = (_258 = (_298.sent())[0]) === null || _258 === void 0 ? void 0 : _258.key) !== null && _259 !== void 0 ? _259 : '', _185.text = 'Nine', _185.kind = 'change', _185)])];
            case 191:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: '' })];
            case 192:
                _298.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 193:
                _298.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 194:
                _298.sent();
                _101 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 195:
                _101.apply(void 0, [_298.sent()]).toBe(true);
                // The card's own box, the bar folded, stays four lines as it is typed in, and is a new empty one once a reply was sent and the
                // work asks anew
                return [4 /*yield*/, again.unmount()];
            case 196:
                // The card's own box, the bar folded, stays four lines as it is typed in, and is a new empty one once a reply was sent and the
                // work asks anew
                _298.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 197:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { isCollapsed: true }), surface: 'desktop' }))];
            case 198:
                shut = _298.sent();
                five = 'one\ntwo\nthree\nfour\nfive';
                _102 = 0, _103 = [[7, 'Which minute?'], [8, 'Which second?']];
                _298.label = 199;
            case 199:
                if (!(_102 < _103.length)) return [3 /*break*/, 211];
                _104 = _103[_102], n = _104[0], text = _104[1];
                return [4 /*yield*/, clock.advance(2000)];
            case 200:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k".concat(n), agentId: 'a2', text: text, choices: ['Now', 'Later'] })];
            case 201:
                _298.sent();
                _105 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c, _d; return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1:
                                _b = (_e.sent()).length === 1;
                                if (!_b) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(list)];
                            case 2:
                                _b = ((_c = (_e.sent())[0]) === null || _c === void 0 ? void 0 : _c.props.rows) === 4;
                                _e.label = 3;
                            case 3:
                                _a = _b;
                                if (!_a) return [3 /*break*/, 5];
                                return [4 /*yield*/, boxesIn(list)];
                            case 4:
                                _a = !((_d = (_e.sent())[0]) === null || _d === void 0 ? void 0 : _d.props.value);
                                _e.label = 5;
                            case 5: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 202:
                _105.apply(void 0, [_298.sent()]).toBe(true);
                _107 = (_106 = list).input;
                _186 = {};
                return [4 /*yield*/, boxesIn(list)];
            case 203: return [4 /*yield*/, _107.apply(_106, [(_186.key = (_261 = (_260 = (_298.sent())[0]) === null || _260 === void 0 ? void 0 : _260.key) !== null && _261 !== void 0 ? _261 : '', _186.text = five, _186.kind = 'change', _186)])];
            case 204:
                _298.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 205:
                _298.sent();
                _108 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 206:
                _108.apply(void 0, [(_262 = (_298.sent())[0]) === null || _262 === void 0 ? void 0 : _262.props.rows]).toBe(4);
                _110 = (_109 = list).input;
                _187 = {};
                return [4 /*yield*/, boxesIn(list)];
            case 207: return [4 /*yield*/, _110.apply(_109, [(_187.key = (_264 = (_263 = (_298.sent())[0]) === null || _263 === void 0 ? void 0 : _263.key) !== null && _264 !== void 0 ? _264 : '', _187.text = five, _187)])];
            case 208:
                _298.sent();
                _111 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: one\ntwo'); })];
                    }); }); })];
            case 209:
                _111.apply(void 0, [_298.sent()]).toBeDefined();
                _298.label = 210;
            case 210:
                _102++;
                return [3 /*break*/, 199];
            case 211:
                key = function (base) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return new RegExp("^".concat(base, "-\\d+$")).test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Trim the tail', prompt: 'trim the tail' }))];
            case 212:
                _298.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The tail is trimmed.', durationMs: 1, isAborted: false, turnId: 'c1', reason: 'answer' })];
            case 213:
                _298.sent();
                _112 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('dismiss-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 214:
                _112.apply(void 0, [_298.sent()]).toBeDefined();
                _113 = expect;
                return [4 /*yield*/, key('change-a3')];
            case 215:
                _113.apply(void 0, [_298.sent()]).toBeUndefined();
                return [4 /*yield*/, shut.unmount()];
            case 216:
                _298.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 217:
                top = _298.sent();
                _114 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 218:
                _114.apply(void 0, [(_265 = (_298.sent())) === null || _265 === void 0 ? void 0 : _265.props.label]).toBe('Give feedback');
                _115 = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 219:
                _115.apply(void 0, [(_298.sent()).map(function (b) { return String(b.key); }).filter(function (one) { return /^(change|dismiss)-a3-/.test(one); }).map(function (one) { return one.split('-')[0]; })]).toEqual(['change', 'dismiss']);
                changeBox = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, top.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-change-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                changes = function () { return resumed.filter(function (line) { return line.includes('wrote to you from the card'); }); };
                toldOfChange = function () { return appended.filter(function (line) { return line.includes('wrote to the task'); }); };
                wasSubmitted = submitted.length;
                _116 = expect;
                return [4 /*yield*/, changeBox()];
            case 220:
                _116.apply(void 0, [_298.sent()]).toBeUndefined();
                _118 = (_117 = list).press;
                _188 = {};
                return [4 /*yield*/, key('change-a3')];
            case 221: return [4 /*yield*/, _118.apply(_117, [(_188.key = (_267 = (_266 = (_298.sent())) === null || _266 === void 0 ? void 0 : _266.key) !== null && _267 !== void 0 ? _267 : '', _188)])];
            case 222:
                _298.sent();
                return [4 /*yield*/, until(changeBox)];
            case 223:
                opened = _298.sent();
                expect(opened).toBeDefined();
                _119 = expect;
                return [4 /*yield*/, oneBox(top)];
            case 224:
                _119.apply(void 0, [_298.sent()]).toEqual({ head: '↳ Message to “Trim the tail”', fields: ['Type your message'], enter: SENDS, buttons: ['Send', 'Close'] });
                // Close closes it and sends nothing: the card is Done as it was, and the box opened again is empty
                return [4 /*yield*/, top.input({ key: (_268 = opened === null || opened === void 0 ? void 0 : opened.key) !== null && _268 !== void 0 ? _268 : '', text: 'Never mind this', kind: 'change' })];
            case 225:
                // Close closes it and sends nothing: the card is Done as it was, and the box opened again is empty
                _298.sent();
                _121 = (_120 = top).press;
                _189 = {};
                return [4 /*yield*/, labelled(top, CLOSE)];
            case 226: return [4 /*yield*/, _121.apply(_120, [(_189.key = (_270 = (_269 = (_298.sent())[0]) === null || _269 === void 0 ? void 0 : _269.key) !== null && _270 !== void 0 ? _270 : '', _189)])];
            case 227:
                _298.sent();
                _122 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, changeBox()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 228:
                _122.apply(void 0, [_298.sent()]).toBe(true);
                expect(changes()).toHaveLength(0);
                expect(toldOfChange()).toHaveLength(0);
                _123 = expect;
                return [4 /*yield*/, key('stop-a3')];
            case 229:
                if (!((_271 = _298.sent()) !== null && _271 !== void 0)) return [3 /*break*/, 230];
                _124 = _271;
                return [3 /*break*/, 232];
            case 230: return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
            case 231:
                _124 = (_298.sent());
                _298.label = 232;
            case 232:
                _123.apply(void 0, [_124]).toBeUndefined();
                _126 = (_125 = list).press;
                _190 = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 233: return [4 /*yield*/, _126.apply(_125, [(_190.key = (_273 = (_272 = (_298.sent())) === null || _272 === void 0 ? void 0 : _272.key) !== null && _273 !== void 0 ? _273 : '', _190)])];
            case 234:
                _298.sent();
                return [4 /*yield*/, until(changeBox)];
            case 235:
                again2 = _298.sent();
                expect(again2 === null || again2 === void 0 ? void 0 : again2.props.value).toBe('');
                sentAt = clock.now();
                return [4 /*yield*/, top.input({ key: (_274 = again2 === null || again2 === void 0 ? void 0 : again2.key) !== null && _274 !== void 0 ? _274 : '', text: 'Leave the tip longer' })];
            case 236:
                _298.sent();
                expect(clock.now()).toBe(sentAt);
                expect(changes()).toEqual(['a3: The person wrote to you from the card of your finished task, in their own words: Leave the tip longer\nYou had finished. Carry on with their words: tick or add to-dos for what they ask, do it, then hand back again with only what is new.']);
                expect(submitted).toHaveLength(wasSubmitted);
                expect(toldOfChange()).toEqual([expect.stringContaining('wrote to the task "Trim the tail" on its card: “Leave the tip longer”. The task has their words and carries on with them itself: start nothing for it.')]);
                _127 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 237:
                _127.apply(void 0, [_298.sent()]).toBeDefined();
                _128 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, changeBox()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 238:
                _128.apply(void 0, [_298.sent()]).toBe(true);
                // At work, its card keeps Message beside Stop: what is sent goes straight to the task as the person's words, between its steps,
                // and the chat is asked nothing
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'td-a3', agentId: 'a3', item: 'Lengthen the tip', state: 'doing' })];
            case 239:
                // At work, its card keeps Message beside Stop: what is sent goes straight to the task as the person's words, between its steps,
                // and the chat is asked nothing
                _298.sent();
                _129 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 240:
                _129.apply(void 0, [(_275 = (_298.sent())) === null || _275 === void 0 ? void 0 : _275.props.label]).toBe('Message');
                _131 = (_130 = list).press;
                _191 = {};
                return [4 /*yield*/, key('change-a3')];
            case 241: return [4 /*yield*/, _131.apply(_130, [(_191.key = (_277 = (_276 = (_298.sent())) === null || _276 === void 0 ? void 0 : _276.key) !== null && _277 !== void 0 ? _277 : '', _191)])];
            case 242:
                _298.sent();
                return [4 /*yield*/, until(changeBox)];
            case 243:
                atWork = _298.sent();
                _132 = expect;
                return [4 /*yield*/, oneBox(top)];
            case 244:
                _132.apply(void 0, [_298.sent()]).toEqual({ head: '↳ Message to “Trim the tail”', fields: ['Type your message'], enter: SENDS, buttons: ['Send', 'Close'] });
                footOf = function (site, from) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith(from); }).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                _133 = expect;
                return [4 /*yield*/, footOf(top, 'band-box-')];
            case 245:
                _133.apply(void 0, [_298.sent()]).toEqual(['Attach', 'Stop and send', 'Send', 'Close']);
                return [4 /*yield*/, top.input({ key: (_278 = atWork === null || atWork === void 0 ? void 0 : atWork.key) !== null && _278 !== void 0 ? _278 : '', text: 'Keep the tuft' })];
            case 246:
                _298.sent();
                _134 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a3: ') && line.includes('wrote to you from your card, in their own words: Keep the tuft\n'); })];
                    }); }); })];
            case 247:
                _134.apply(void 0, [_298.sent()]).toBeDefined();
                expect(submitted).toHaveLength(wasSubmitted);
                _135 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, changeBox()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 248:
                _135.apply(void 0, [_298.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a3', surface: 'desktop' }))];
            case 249:
                view3 = _298.sent();
                viewBox = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view3.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /^details-a3-reply-change-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                _136 = expect;
                return [4 /*yield*/, until(viewBox)];
            case 250:
                _136.apply(void 0, [(_279 = (_298.sent())) === null || _279 === void 0 ? void 0 : _279.props.placeholder]).toBe('Type your message');
                _137 = expect;
                return [4 /*yield*/, viewBox()];
            case 251:
                _137.apply(void 0, [(_280 = (_298.sent())) === null || _280 === void 0 ? void 0 : _280.props.rows]).toBe(4);
                return [4 /*yield*/, view3.findAll({ type: 'Text' })];
            case 252:
                heads = (_298.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(heads.lastIndexOf('Message')).toBeGreaterThan(heads.indexOf('Conversation'));
                _138 = expect;
                return [4 /*yield*/, footOf(view3, 'details-a3-')];
            case 253:
                _138.apply(void 0, [_298.sent()]).toEqual(['Attach', 'Stop and send', 'Send']);
                viewNumber = function () { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                walk = function (node) {
                                    var _a, _b, _c;
                                    if (Array.isArray(node))
                                        return void node.forEach(walk);
                                    if (!node || typeof node !== 'object')
                                        return;
                                    var one = node;
                                    if (one.type === 'Input' && /^details-a3-reply-/.test((_b = (_a = one.props) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : ''))
                                        found = (_c = one.press) === null || _c === void 0 ? void 0 : _c.handle;
                                    walk(one.children);
                                };
                                _a = walk;
                                return [4 /*yield*/, view3.drawn()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                _140 = (_139 = view3).input;
                _192 = {};
                return [4 /*yield*/, viewBox()];
            case 254: return [4 /*yield*/, _140.apply(_139, [(_192.key = (_282 = (_281 = (_298.sent())) === null || _281 === void 0 ? void 0 : _281.key) !== null && _282 !== void 0 ? _282 : '', _192.text = 'Shorter ears', _192.kind = 'change', _192)])];
            case 255:
                _298.sent();
                return [4 /*yield*/, clock.advance(100)];
            case 256:
                _298.sent();
                return [4 /*yield*/, viewNumber()];
            case 257:
                viewNumbered = _298.sent();
                expect(viewNumbered).toBeDefined();
                _141 = 0, _142 = [1, 2, 3];
                _298.label = 258;
            case 258:
                if (!(_141 < _142.length)) return [3 /*break*/, 263];
                n = _142[_141];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "ve".concat(n), agentId: 'a3', text: "Ear step ".concat(n) })];
            case 259:
                _298.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: "vt".concat(n), agentId: 'a3', item: "Ear to-do ".concat(n), state: 'doing' })];
            case 260:
                _298.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 261:
                _298.sent();
                _298.label = 262;
            case 262:
                _141++;
                return [3 /*break*/, 258];
            case 263:
                _143 = expect;
                return [4 /*yield*/, viewNumber()];
            case 264:
                _143.apply(void 0, [_298.sent()]).toBe(viewNumbered);
                _145 = (_144 = list).press;
                _193 = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 265: 
            // Opened above the chat too, the box holds what was typed in the view
            return [4 /*yield*/, _145.apply(_144, [(_193.key = (_284 = (_283 = (_298.sent())) === null || _283 === void 0 ? void 0 : _283.key) !== null && _284 !== void 0 ? _284 : '', _193)])];
            case 266:
                // Opened above the chat too, the box holds what was typed in the view
                _298.sent();
                _146 = expect;
                return [4 /*yield*/, until(changeBox)];
            case 267:
                _146.apply(void 0, [(_285 = (_298.sent())) === null || _285 === void 0 ? void 0 : _285.props.value]).toBe('Shorter ears');
                _148 = (_147 = top).press;
                _194 = {};
                return [4 /*yield*/, labelled(top, CLOSE)];
            case 268: return [4 /*yield*/, _148.apply(_147, [(_194.key = (_287 = (_286 = (_298.sent())[0]) === null || _286 === void 0 ? void 0 : _286.key) !== null && _287 !== void 0 ? _287 : '', _194)])
                // Attach opens the computer's own file picker; what is picked shows under the box, each taken off with a press on it
            ];
            case 269:
                _298.sent();
                // Attach opens the computer's own file picker; what is picked shows under the box, each taken off with a press on it
                files.set('picker:chosen', '/Users/me/Desktop/ears.png\n/Users/me/Movies/ears.mov\n');
                _150 = (_149 = view3).press;
                _195 = {};
                return [4 /*yield*/, view3.findAll({ type: 'Button' })];
            case 270: return [4 /*yield*/, _150.apply(_149, [(_195.key = (_289 = (_288 = (_298.sent()).find(function (b) { return b.props.label === 'Attach'; })) === null || _288 === void 0 ? void 0 : _288.key) !== null && _289 !== void 0 ? _289 : '', _195)])];
            case 271:
                _298.sent();
                chips = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view3.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return label.startsWith('📎'); })];
                    }
                }); }); };
                _151 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, chips()];
                            case 1:
                                if (!((_b.sent()).length === 2)) return [3 /*break*/, 3];
                                return [4 /*yield*/, chips()];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = undefined;
                                _b.label = 4;
                            case 4: return [2 /*return*/, (_a)];
                        }
                    }); }); })];
            case 272:
                _151.apply(void 0, [_298.sent()]).toEqual(['📎 ears.png ✕', '📎 ears.mov ✕']);
                _153 = (_152 = view3).press;
                _196 = {};
                return [4 /*yield*/, view3.findAll({ type: 'Button' })];
            case 273: return [4 /*yield*/, _153.apply(_152, [(_196.key = (_291 = (_290 = (_298.sent()).find(function (b) { return b.props.label === '📎 ears.mov ✕'; })) === null || _290 === void 0 ? void 0 : _290.key) !== null && _291 !== void 0 ? _291 : '', _196)])];
            case 274:
                _298.sent();
                _154 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, chips()];
                            case 1:
                                if (!((_b.sent()).length === 1)) return [3 /*break*/, 3];
                                return [4 /*yield*/, chips()];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = undefined;
                                _b.label = 4;
                            case 4: return [2 /*return*/, (_a)];
                        }
                    }); }); })];
            case 275:
                _154.apply(void 0, [_298.sent()]).toEqual(['📎 ears.png ✕']);
                // A path dropped or typed into the box, a file on this computer, goes as a file too
                files.set('/Users/me/Desktop/ref shot.mov', 'x');
                _156 = (_155 = view3).input;
                _197 = {};
                return [4 /*yield*/, viewBox()];
            case 276: return [4 /*yield*/, _156.apply(_155, [(_197.key = (_293 = (_292 = (_298.sent())) === null || _292 === void 0 ? void 0 : _292.key) !== null && _293 !== void 0 ? _293 : '', _197.text = 'Shorter ears, like /Users/me/Desktop/ref\\ shot.mov', _197.kind = 'change', _197)])
                // Stop and send stops the task where it is and starts it again with the words and the files, each with how to open it; its card
                // stays at work all along
            ];
            case 277:
                _298.sent();
                wasStopped = stopped.length;
                _158 = (_157 = view3).press;
                _198 = {};
                return [4 /*yield*/, view3.findAll({ type: 'Button' })];
            case 278: return [4 /*yield*/, _158.apply(_157, [(_198.key = (_295 = (_294 = (_298.sent()).find(function (b) { return b.props.label === 'Stop and send'; })) === null || _294 === void 0 ? void 0 : _294.key) !== null && _295 !== void 0 ? _295 : '', _198)])];
            case 279:
                _298.sent();
                _159 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (stopped.length > wasStopped ? stopped.at(-1) : undefined)];
                    }); }); })];
            case 280:
                _159.apply(void 0, [_298.sent()]).toBe('a3');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a3: ') && line.includes('stopped you to write to you from your card'); })];
                    }); }); })];
            case 281:
                now = _298.sent();
                expect(now).toContain('in their own words: Shorter ears, like /Users/me/Desktop/ref\\ shot.mov\n');
                expect(now).toContain('- /Users/me/Desktop/ears.png (open it with Read)');
                expect(now).toContain('- /Users/me/Desktop/ref shot.mov (take stills from it');
                expect(now).not.toContain('ears.mov');
                _160 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 282:
                _160.apply(void 0, [_298.sent()]).toBeDefined();
                _161 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, chips()];
                            case 1:
                                _a = (_c.sent()).length === 0;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, viewBox()];
                            case 2:
                                _a = !((_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.props.value);
                                _c.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 283:
                _161.apply(void 0, [_298.sent()]).toBe(true);
                // It finishes again, and can be asked for a change again
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The tip is longer now.', durationMs: 1, isAborted: false, turnId: 'c2', reason: 'answer' })];
            case 284:
                // It finishes again, and can be asked for a change again
                _298.sent();
                _162 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 285:
                _162.apply(void 0, [_298.sent()]).toBeDefined();
                // Done, its view keeps the box, with only Send: the message starts it again
                _163 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, footOf(view3, 'details-a3-')];
                            case 1: return [2 /*return*/, ((_a.sent()).join() === 'Attach,Send' ? true : undefined)];
                        }
                    }); }); })];
            case 286:
                // Done, its view keeps the box, with only Send: the message starts it again
                _163.apply(void 0, [_298.sent()]).toBe(true);
                _165 = (_164 = view3).input;
                _199 = {};
                return [4 /*yield*/, viewBox()];
            case 287: return [4 /*yield*/, _165.apply(_164, [(_199.key = (_297 = (_296 = (_298.sent())) === null || _296 === void 0 ? void 0 : _296.key) !== null && _297 !== void 0 ? _297 : '', _199.text = 'One more ear', _199)])];
            case 288:
                _298.sent();
                _166 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, changes().find(function (line) { return line.includes('in their own words: One more ear\n'); })];
                    }); }); })];
            case 289:
                _166.apply(void 0, [_298.sent()]).toBeDefined();
                return [4 /*yield*/, view3.unmount()];
            case 290:
                _298.sent();
                expect(filled).toEqual([]);
                return [4 /*yield*/, Promise.all([list.unmount(), details.unmount(), top.unmount()])];
            case 291:
                _298.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a question nobody answers on its card is said again at 15 minutes and an hour, once each, and no more once answered; with each message of the person the chat reads what every card shows and is asked to name the question once an hour', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, notified, clock, reminders, minutes, said, first, _b, _c, list, box;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), notified = _a.notified, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'push the fix', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Push the fix', prompt: 'push it' }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'a1', item: 'Fix the scroll', state: 'done' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't2', agentId: 'a1', item: 'Push it', state: 'doing' })];
            case 5:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Sign in to GitHub in the browser pane.' })];
            case 6:
                _e.sent();
                reminders = function () { return notified.filter(function (line) { return line.startsWith('Push the fix still waits for you | Waiting '); }); };
                minutes = function (n) { return __awaiter(_this, void 0, void 0, function () {
                    var at;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                at = 0;
                                _a.label = 1;
                            case 1:
                                if (!(at < n)) return [3 /*break*/, 4];
                                return [4 /*yield*/, clock.advance(60000)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                at += 1;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // 17 Nov: a sign-in sat unseen for hours, as only the first notification ever went
                return [4 /*yield*/, minutes(14)];
            case 7:
                // 17 Nov: a sign-in sat unseen for hours, as only the first notification ever went
                _e.sent();
                expect(reminders()).toEqual([]);
                return [4 /*yield*/, minutes(2)];
            case 8:
                _e.sent();
                expect(reminders()).toHaveLength(1);
                expect(reminders()[0]).toMatch(/^Push the fix still waits for you \| Waiting 1[56]m · Sign in to GitHub in the browser pane\.$/);
                return [4 /*yield*/, minutes(30)];
            case 9:
                _e.sent();
                expect(reminders()).toHaveLength(1);
                said = function (text) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, $.prompt.submit({ text: text, wait: false, origin: composer })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).context) === null || _a === void 0 ? void 0 : _a.join('\n')) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                return [4 /*yield*/, said('how is it going?')];
            case 10:
                first = _e.sent();
                expect(first).toContain('What the latest task cards show now, for when the person asks how things stand');
                expect(first).toMatch(/- "Push the fix" \(a1\): waiting for the person for 4\dm: Sign in to GitHub in the browser pane\./);
                expect(first).toContain('Waiting on the person on a card, unanswered: "Push the fix". Unless your reply is about it, end it with one short line');
                // Within the hour, with nothing on the cards changed, the chat is not told again
                _b = expect;
                return [4 /*yield*/, said('and the other one?')];
            case 11:
                // Within the hour, with nothing on the cards changed, the chat is not told again
                _b.apply(void 0, [_e.sent()]).not.toContain('What the latest task cards show');
                return [4 /*yield*/, minutes(16)];
            case 12:
                _e.sent();
                expect(reminders()).toHaveLength(2);
                // Answered, it is said no more, and the card reads as at work with its to-dos
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })];
            case 13:
                // Answered, it is said no more, and the card reads as at work with its to-dos
                _e.sent();
                _c = expect;
                return [4 /*yield*/, said('ok')];
            case 14:
                _c.apply(void 0, [_e.sent()]).toMatch(/- "Push the fix" \(a1\): working, 1 of 2 to-dos done, doing "Push it"/);
                return [4 /*yield*/, minutes(200)];
            case 15:
                _e.sent();
                expect(reminders()).toHaveLength(2);
                // A reply in words that does not settle a new question starts its wait afresh: no reminder of the time before the reply
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Push to main or to a branch?', choices: ['Main', 'A branch'] })];
            case 16:
                // A reply in words that does not settle a new question starts its wait afresh: no reminder of the time before the reply
                _e.sent();
                return [4 /*yield*/, minutes(10)];
            case 17:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 18:
                list = _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 19:
                box = (_e.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_d = box === null || box === void 0 ? void 0 : box.key) !== null && _d !== void 0 ? _d : '', text: 'What is the difference?' })];
            case 20:
                _e.sent();
                return [4 /*yield*/, list.unmount()];
            case 21:
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Asked again.', durationMs: 1, isAborted: false, turnId: 'r1', reason: 'answer', agentId: 'a1' })];
            case 22:
                _e.sent();
                return [4 /*yield*/, minutes(8)];
            case 23:
                _e.sent();
                expect(notified.filter(function (line) { return line.includes('Push to main or to a branch?') && line.includes('still waits'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
