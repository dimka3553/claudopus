// Results: kept, listed, opened, changed, put away and brought back, and rounds of one work
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
test('finished work leaves a result for good that asks nothing: its pictures copied, listed under Results, opened, changed from the one box above the chat by its own task, named to the chat, and its card dismissed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, submitted, clock, copied, opened, resumed, kindTools, isWriteHeld, writeHeld, filled, _b, report, metaPath, folder, meta, bar, pane, _c, _d, _e, _f, _g, _h, _j, _k, _l, list, _m, _o, _p, _q, _r, _s, _t, id, one, heads, _u, _v, _w, _x, _y, inputsOf, barLabels, _z, _0, _1, head, _2, field, moreFields, _3, _4, _5, _6, _7, _8, again, changes, _9, _10, _11, _12, _13, termed, _14, own, _15, next, _16, _17, finishedCount, cards, _18, _19, _20, _i, _21, id_1, before, _22, _23, _24, _25, _26, _27, _28, used, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, after, _41, _42, _43, _44, _45, _46, _47, _48;
    var _49;
    var _this = this;
    var _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70;
    return __generator(this, function (_71) {
        switch (_71.label) {
            case 0:
                _a = world(on), files = _a.files, submitted = _a.submitted, clock = _a.clock, copied = _a.copied, opened = _a.opened, resumed = _a.resumed, kindTools = _a.kindTools;
                isWriteHeld = false;
                on('state.set', function (_, e, next) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(isWriteHeld && e.key === 'todos')) return [3 /*break*/, 2];
                                (isWriteHeld = false);
                                return [4 /*yield*/, new Promise(function (go) { return (writeHeld = go); })];
                            case 1:
                                (_a.sent());
                                _a.label = 2;
                            case 2: return [2 /*return*/, next(e)];
                        }
                    });
                }); });
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _71.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })];
            case 2:
                _71.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Weekly revenue', prompt: 'how is revenue doing' }))
                    // A helper's answer is no report
                ];
            case 3:
                _71.sent();
                // A helper's answer is no report
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' })];
            case 4:
                // A helper's answer is no report
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })
                    // No kind of task has a tool that records questions for its result: a task asks on its card, before it finishes
                ];
            case 5:
                _71.sent();
                // No kind of task has a tool that records questions for its result: a task asks on its card, before it finishes
                expect(Object.keys(kindTools).filter(function (kind) { var _a; return (_a = kindTools[kind]) === null || _a === void 0 ? void 0 : _a.includes('mcp__claudopus__ask'); }).length).toBeGreaterThan(0);
                expect(Object.values(kindTools).flat().filter(function (tool) { return /waits/.test(tool); })).toEqual([]);
                // and a call to the old one is no tool of the mod's: the engine's own answer comes back, and nothing is kept with the result
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?'], agentId: 'a1' })];
            case 6:
                // and a call to the old one is no tool of the mod's: the engine's own answer comes back, and nothing is kept with the result
                _b.apply(void 0, [(_71.sent()).result]).toBe('ran');
                report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.\n\nShall I send it to the team?';
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 7:
                _71.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 8:
                _71.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (path) { return path.startsWith("".concat(MEMORY, "/reports/")) && path.endsWith('/meta.json'); })];
                    }); }); })];
            case 9:
                metaPath = _71.sent();
                folder = (metaPath !== null && metaPath !== void 0 ? metaPath : '').replace('/meta.json', '');
                expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/);
                expect(files.get("".concat(folder, "/report.md"))).toBe("".concat(report, "\n"));
                expect(copied).toEqual(["".concat(folder, "/revenue.png")]);
                meta = JSON.parse((_50 = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _50 !== void 0 ? _50 : '{}');
                expect(meta.title).toBe('Weekly revenue');
                expect(meta.files).toEqual(['revenue.png']);
                // A question in its text is text: the result keeps no list of what waits
                expect(meta.waiting).toBeUndefined();
                expect(meta.question).toBeUndefined();
                expect(meta.gist).toBe('Revenue rose 12% this week to $4,210.');
                expect(meta.folder).toBe('/repo');
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                // A short answer with no picture is a confirmation, not a report
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save a rule', prompt: 'save it' }))];
            case 10:
                // A short answer with no picture is a confirmation, not a report
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })];
            case 11:
                _71.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 12:
                _71.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                // The same report again is not kept twice
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 13:
                // The same report again is not kept twice
                _71.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 14:
                _71.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 15:
                bar = _71.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // On the Claudopus pane the reports are one small button, with no mark
                ];
            case 16:
                pane = _71.sent();
                // On the Claudopus pane the reports are one small button, with no mark
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 17:
                // On the Claudopus pane the reports are one small button, with no mark
                _c.apply(void 0, [_71.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 18:
                _d.apply(void 0, [(_51 = (_71.sent())) === null || _51 === void 0 ? void 0 : _51.props.label]).toBe('Results 1');
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^●$/ })];
            case 19:
                _e.apply(void 0, [_71.sent()]).toBeUndefined();
                // Its task is done, in green, and waits for nobody: no question from its result on the card, nothing to press for one, and the
                // header counts nothing as waiting
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 20:
                // Its task is done, in green, and waits for nobody: no question from its result on the card, nothing to press for one, and the
                // header counts nothing as waiting
                _f.apply(void 0, [_71.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /waiting for you/i })];
            case 21:
                _g.apply(void 0, [_71.sent()]).toBeUndefined();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Result ready|Shall I send it to the team/ })];
            case 22:
                _h.apply(void 0, [_71.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 23:
                _j.apply(void 0, [(_71.sent()).filter(function (b) { return b.props.backgroundColor === '#E5A50A'; }).length]).toBe(0);
                _k = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 24:
                _k.apply(void 0, [(_71.sent()).filter(function (b) { var _a; return /^result-ask-/.test((_a = b.key) !== null && _a !== void 0 ? _a : '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)); })]).toEqual([]);
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                return [4 /*yield*/, pressed(pane, 'reports-open')];
            case 25:
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                _71.sent();
                expect(opened).toContain('reports');
                _l = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 26:
                _l.apply(void 0, [_71.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 27:
                list = _71.sent();
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Results$/ })];
            case 28:
                _m.apply(void 0, [(_52 = (_71.sent())) === null || _52 === void 0 ? void 0 : _52.props.bold]).toBe(true);
                _o = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 29:
                _o.apply(void 0, [_71.sent()]).toBeUndefined();
                // One line a row: its title, when, and Archive; nothing under it, and no mark
                _p = expect;
                return [4 /*yield*/, keyed(list, "report-".concat(folder.split('/').pop()))];
            case 30:
                // One line a row: its title, when, and Archive; nothing under it, and no mark
                _p.apply(void 0, [(_53 = (_71.sent())) === null || _53 === void 0 ? void 0 : _53.props.label]).toBe('Weekly revenue');
                _q = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^\d\d:\d\d$/ })];
            case 31:
                _q.apply(void 0, [_71.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^●$/ })];
            case 32:
                _r.apply(void 0, [_71.sent()]).toBeUndefined();
                _s = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Revenue rose/ })];
            case 33:
                _s.apply(void 0, [_71.sent()]).toBeUndefined();
                _t = expect;
                return [4 /*yield*/, keyed(list, "archive-".concat(folder.split('/').pop()))];
            case 34:
                _t.apply(void 0, [(_54 = (_71.sent())) === null || _54 === void 0 ? void 0 : _54.props.label]).toBe('Archive');
                // A report opens as a pane of its own, named after it: what its task made, the finding, the report, how to go on from it
                return [4 /*yield*/, pressed(list, "report-".concat(folder.split('/').pop()))];
            case 35:
                // A report opens as a pane of its own, named after it: what its task made, the finding, the report, how to go on from it
                _71.sent();
                id = "report-".concat(folder.split('/').pop());
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes(id) || undefined];
                    }); }); })];
            case 36:
                _71.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Weekly revenue', bodyColumns: 80 }), surface: 'desktop' }))];
            case 37:
                one = _71.sent();
                return [4 /*yield*/, one.findAll({ type: 'Text' })];
            case 38:
                heads = (_71.sent()).filter(function (text) { return text.props.bold; }).map(function (text) { return text.text; });
                // What its task made is right under its title, as tiles; its pictures are among them, so no Pictures part repeats them. Nothing
                // in it waits: no part of questions, and no answer to press
                expect(heads).toEqual(['Weekly revenue', 'Files', 'Summary', 'In full', 'Follow-up']);
                _u = expect;
                return [4 /*yield*/, one.findAll({ type: 'Button' })];
            case 39:
                _u.apply(void 0, [(_71.sent()).filter(function (b) { var _a; return /^report-say-/.test((_a = b.key) !== null && _a !== void 0 ? _a : '') || ['Yes', 'No', 'Not now', 'Answer in words'].includes(String(b.props.label)); })]).toEqual([]);
                _v = expect;
                return [4 /*yield*/, one.findAll({ type: 'Svg' })];
            case 40:
                _v.apply(void 0, [(_71.sent()).map(function (svg) { return String(svg.props.alt); })]).toContain('revenue');
                _w = expect;
                return [4 /*yield*/, one.find({ type: 'Markdown', text: /Revenue rose 12%/ })];
            case 41:
                _w.apply(void 0, [(_55 = (_71.sent())) === null || _55 === void 0 ? void 0 : _55.props.text]).toBe("".concat(report, "\n"));
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _x = expect;
                return [4 /*yield*/, keyed(one, 'report-page')];
            case 42:
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _x.apply(void 0, [_71.sent()]).toBeUndefined();
                _y = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: "".concat(folder, "/revenue.png") })];
            case 43:
                _y.apply(void 0, [_71.sent()]).toBeUndefined();
                inputsOf = function (site) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                barLabels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bar.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                _z = expect;
                return [4 /*yield*/, keyed(one, 'report-carry')];
            case 44:
                _z.apply(void 0, [(_56 = (_71.sent())) === null || _56 === void 0 ? void 0 : _56.props.label]).toBe('Message');
                _0 = expect;
                return [4 /*yield*/, inputsOf(one)];
            case 45:
                _0.apply(void 0, [_71.sent()]).toEqual([]);
                _1 = expect;
                return [4 /*yield*/, inputsOf(bar)];
            case 46:
                _1.apply(void 0, [_71.sent()]).toEqual([]);
                return [4 /*yield*/, pressed(one, 'report-carry')];
            case 47:
                _71.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, bar.find({ type: 'Text', text: /^↳ Message to/ })];
                    }); }); })];
            case 48:
                head = _71.sent();
                expect(head === null || head === void 0 ? void 0 : head.text).toBe('↳ Message to “Weekly revenue”');
                return [4 /*yield*/, inputsOf(bar)];
            case 49:
                _2 = _71.sent(), field = _2[0], moreFields = _2.slice(1);
                expect(moreFields).toEqual([]);
                expect(field === null || field === void 0 ? void 0 : field.props.placeholder).toBe('Type your message');
                _3 = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: /^Enter sends/ })];
            case 50:
                _3.apply(void 0, [_71.sent()]).toBeUndefined();
                _4 = expect;
                return [4 /*yield*/, barLabels()];
            case 51:
                _4.apply(void 0, [(_71.sent()).filter(function (label) { return label === 'Send' || label === 'Close'; })]).toEqual(['Send', 'Close']);
                _5 = expect;
                return [4 /*yield*/, inputsOf(one)];
            case 52:
                _5.apply(void 0, [_71.sent()]).toEqual([]);
                // (the button that opened it closes it again; opened once more, it is there as before)
                _6 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(one, 'report-carry')];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === 'Close' ? true : undefined)];
                        }
                    }); }); })];
            case 53:
                // (the button that opened it closes it again; opened once more, it is there as before)
                _6.apply(void 0, [_71.sent()]).toBe(true);
                return [4 /*yield*/, pressed(one, 'report-carry')];
            case 54:
                _71.sent();
                _7 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputsOf(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 55:
                _7.apply(void 0, [_71.sent()]).toBe(true);
                _8 = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: /^↳ Message to/ })];
            case 56:
                _8.apply(void 0, [_71.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(one, 'report-carry')];
            case 57:
                _71.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputsOf(bar)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })
                    // What is sent from it goes to the result's own task, whose card is still there to carry on from: it is started again with the
                    // person's words from the press's own hook (the clock has not moved), the chat is asked nothing, and the box goes
                ];
            case 58:
                again = _71.sent();
                changes = function () { return resumed.filter(function (line) { return line.startsWith('a1: ') && line.includes('wrote to you from the card'); }); };
                return [4 /*yield*/, bar.input({ key: (_57 = again === null || again === void 0 ? void 0 : again.key) !== null && _57 !== void 0 ? _57 : '', text: 'send it to the team' })];
            case 59:
                _71.sent();
                _9 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, changes()[0]];
                    }); }); })];
            case 60:
                _9.apply(void 0, [_71.sent()]).toContain('in their own words: send it to the team\n');
                expect(changes()).toHaveLength(1);
                expect(submitted).toEqual([]);
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputsOf(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 61:
                _10.apply(void 0, [_71.sent()]).toBe(true);
                // Its card is at work again at once, with Stop, and nothing waits
                _11 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 62:
                // Its card is at work again at once, with Stop, and nothing waits
                _11.apply(void 0, [_71.sent()]).toBeDefined();
                _12 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /waiting for you/i })];
            case 63:
                _12.apply(void 0, [_71.sent()]).toBeUndefined();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4', reason: 'answer' })];
            case 64:
                _71.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 65:
                _71.sent();
                _13 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(one, 'report-carry')];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === 'Message' ? true : undefined)];
                        }
                    }); }); })];
            case 66:
                _13.apply(void 0, [_71.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Weekly revenue', bodyColumns: 80 }), surface: 'terminal' }))];
            case 67:
                termed = _71.sent();
                _14 = expect;
                return [4 /*yield*/, keyed(termed, 'report-carry')];
            case 68:
                _14.apply(void 0, [_71.sent()]).toBeUndefined();
                return [4 /*yield*/, inputsOf(termed)];
            case 69:
                own = (_71.sent()).filter(function (input) { var _a; return /^report-carry-reply-/.test((_a = input.key) !== null && _a !== void 0 ? _a : ''); });
                expect(own.map(function (input) { return input.props.placeholder; })).toEqual(['Type your message']);
                return [4 /*yield*/, termed.input({ key: (_59 = (_58 = own[0]) === null || _58 === void 0 ? void 0 : _58.key) !== null && _59 !== void 0 ? _59 : '', text: 'check the refunds' })];
            case 70:
                _71.sent();
                _15 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, changes()[1]];
                    }); }); })];
            case 71:
                _15.apply(void 0, [_71.sent()]).toContain('in their own words: check the refunds\n');
                return [4 /*yield*/, termed.unmount()];
            case 72:
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4b', reason: 'answer' })];
            case 73:
                _71.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 74:
                _71.sent();
                expect(submitted).toEqual([]);
                expect(filled).toEqual([]);
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                return [4 /*yield*/, bar.unmount()
                    // The chat is told of the reports with each message, and reads one itself to answer from it
                ];
            case 75:
                _71.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })];
            case 76:
                next = _71.sent();
                expect((_60 = next.context) === null || _60 === void 0 ? void 0 : _60.join('\n')).toContain('Results saved');
                expect((_61 = next.context) === null || _61 === void 0 ? void 0 : _61.join('\n')).toContain("".concat(folder, "/report.md"));
                expect((_62 = next.context) === null || _62 === void 0 ? void 0 : _62.join('\n')).not.toContain('waiting on');
                _16 = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: "".concat(folder, "/report.md") })];
            case 77:
                _16.apply(void 0, [(_71.sent()).deny]).toBeUndefined();
                _17 = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: "cat ".concat(folder, "/report.md") })];
            case 78:
                _17.apply(void 0, [(_71.sent()).deny]).toContain('Start a fresh agent');
                finishedCount = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; var _e, _f, _g; return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _a = Number;
                            _c = (_b = /Finished (\d+)/).exec;
                            _d = String;
                            return [4 /*yield*/, keyed(cards, 'finished-fold')];
                        case 1: return [2 /*return*/, _a.apply(void 0, [(_g = (_f = _c.apply(_b, [_d.apply(void 0, [(_e = (_h.sent())) === null || _e === void 0 ? void 0 : _e.props.label])])) === null || _f === void 0 ? void 0 : _f[1]) !== null && _g !== void 0 ? _g : 0])];
                    }
                }); }); };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Pick an opening', prompt: 'pick an opening' }))];
            case 79:
                _71.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Which opening should go out?', choices: ['A', 'B', 'C'] })
                    // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                ];
            case 80:
                _71.sent();
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h4', agentId: 'a4', message: 'Three openings are cut, A, B and C. Nothing is posted until one is picked.' })];
            case 81:
                // (it hands in its result with the question still open: that, not its turn's end, ends a task)
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a4', answer: '', durationMs: 1, isAborted: false, turnId: 't5', reason: 'answer' })];
            case 82:
                _71.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 83:
                _71.sent();
                return [4 /*yield*/, pane.unmount()];
            case 84:
                _71.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 85:
                cards = _71.sent();
                _18 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: 'Which opening should go out?' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 86:
                _18.apply(void 0, [(_63 = (_71.sent())) === null || _63 === void 0 ? void 0 : _63.props.color]).toBe('#E5A50A');
                _19 = expect;
                return [4 /*yield*/, cards.find({ type: 'Text', text: /^1 .*waiting for you/ })];
            case 87:
                _19.apply(void 0, [_71.sent()]).toBeDefined();
                // (the two that ended before it stay up, with nothing under Finished, until each is dismissed)
                _20 = expect;
                return [4 /*yield*/, finishedCount()];
            case 88:
                // (the two that ended before it stay up, with nothing under Finished, until each is dismissed)
                _20.apply(void 0, [_71.sent()]).toBe(0);
                _i = 0, _21 = ['a1', 'a3'];
                _71.label = 89;
            case 89:
                if (!(_i < _21.length)) return [3 /*break*/, 92];
                id_1 = _21[_i];
                return [4 /*yield*/, pressed(cards, "dismiss-".concat(id_1))];
            case 90:
                _71.sent();
                _71.label = 91;
            case 91:
                _i++;
                return [3 /*break*/, 89];
            case 92: return [4 /*yield*/, clock.advance(2100)];
            case 93:
                _71.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === 2 ? true : undefined)];
                        }
                    }); }); })];
            case 94:
                _71.sent();
                return [4 /*yield*/, finishedCount()];
            case 95:
                before = _71.sent();
                expect(before).toBe(2);
                _22 = expect;
                return [4 /*yield*/, keyed(cards, 'dismiss-a4')];
            case 96:
                _22.apply(void 0, [(_64 = (_71.sent())) === null || _64 === void 0 ? void 0 : _64.props.label]).toBe('Dismiss');
                return [4 /*yield*/, pressed(cards, 'dismiss-a4')];
            case 97:
                _71.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 98:
                _71.sent();
                _23 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: 'Which opening should go out?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 99:
                _23.apply(void 0, [_71.sent()]).toBe(true);
                _24 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === before + 1 ? true : undefined)];
                        }
                    }); }); })];
            case 100:
                _24.apply(void 0, [_71.sent()]).toBe(true);
                _25 = expect;
                return [4 /*yield*/, cards.find({ type: 'Text', text: /waiting for you/i })];
            case 101:
                _25.apply(void 0, [_71.sent()]).toBeUndefined();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save another rule', prompt: 'save it' }))];
            case 102:
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a5', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't6', reason: 'answer' })];
            case 103:
                _71.sent();
                _26 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: '◐ Delivered' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 104:
                _26.apply(void 0, [_71.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(cards, 'dismiss-a5')];
            case 105:
                _71.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 106:
                _71.sent();
                _27 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: '◐ Delivered' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 107:
                _27.apply(void 0, [_71.sent()]).toBe(true);
                _28 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === before + 2 ? true : undefined)];
                        }
                    }); }); })];
            case 108:
                _28.apply(void 0, [_71.sent()]).toBe(true);
                // And while the person uses the panel scrolled down, where the drawing on screen is kept while they move: the card dismissed is
                // under Finished in the drawing right after the press, not once they have left the panel alone (18 Nov, the person: "when I
                // click this, the message should go below the finished")
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save a third rule', prompt: 'save it' }))];
            case 109:
                // And while the person uses the panel scrolled down, where the drawing on screen is kept while they move: the card dismissed is
                // under Finished in the drawing right after the press, not once they have left the panel alone (18 Nov, the person: "when I
                // click this, the message should go below the finished")
                _71.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a6', answer: 'The third rule is saved.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer' })];
            case 110:
                _71.sent();
                return [4 /*yield*/, cards.unmount()];
            case 111:
                _71.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80, scroll: { offset: 20, bodyRows: 50 } }), surface: 'desktop' }))];
            case 112:
                used = _71.sent();
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 113:
                _71.sent();
                _29 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(used, 'dismiss-a6')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 114:
                _29.apply(void 0, [_71.sent()]).toBeDefined();
                // (the press's write of the cards is slow, as in the app under load: the app draws the panel again before it lands)
                isWriteHeld = true;
                _31 = (_30 = used).press;
                _49 = {};
                _32 = String;
                return [4 /*yield*/, keyed(used, 'dismiss-a6')];
            case 115: return [4 /*yield*/, _31.apply(_30, [(_49.key = _32.apply(void 0, [(_65 = (_71.sent())) === null || _65 === void 0 ? void 0 : _65.key]), _49)])];
            case 116:
                _71.sent();
                return [4 /*yield*/, used.findAll({ type: 'Text' })
                    // (drawn at once as marked done: green where it stood, its presses gone)
                ];
            case 117:
                _71.sent();
                // (drawn at once as marked done: green where it stood, its presses gone)
                _33 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, used.find({ type: 'Text', text: '✓ Done' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 118:
                // (drawn at once as marked done: green where it stood, its presses gone)
                _33.apply(void 0, [(_66 = (_71.sent())) === null || _66 === void 0 ? void 0 : _66.props.color]).toBe('success');
                _34 = expect;
                return [4 /*yield*/, keyed(used, 'dismiss-a6')];
            case 119:
                _34.apply(void 0, [_71.sent()]).toBeUndefined();
                writeHeld === null || writeHeld === void 0 ? void 0 : writeHeld();
                // (green where it stood for its two seconds, then under Finished, in the drawing kept while they use the panel too)
                return [4 /*yield*/, clock.advance(2200)];
            case 120:
                // (green where it stood for its two seconds, then under Finished, in the drawing kept while they use the panel too)
                _71.sent();
                _35 = expect;
                return [4 /*yield*/, keyed(used, 'dismiss-a6')];
            case 121:
                _35.apply(void 0, [_71.sent()]).toBeUndefined();
                _36 = expect;
                _37 = Number;
                _39 = (_38 = /Finished (\d+)/).exec;
                _40 = String;
                return [4 /*yield*/, keyed(used, 'finished-fold')];
            case 122:
                _36.apply(void 0, [_37.apply(void 0, [(_68 = _39.apply(_38, [_40.apply(void 0, [(_67 = (_71.sent())) === null || _67 === void 0 ? void 0 : _67.props.label])])) === null || _68 === void 0 ? void 0 : _68[1]])]).toBe(before + 3);
                return [4 /*yield*/, used.unmount()
                    // A redraw later, and a reload of the cards: all still under Finished, nothing back at the top
                ];
            case 123:
                _71.sent();
                // A redraw later, and a reload of the cards: all still under Finished, nothing back at the top
                return [4 /*yield*/, clock.advance(30000)];
            case 124:
                // A redraw later, and a reload of the cards: all still under Finished, nothing back at the top
                _71.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 125:
                _71.sent();
                return [4 /*yield*/, clock.advance(30000)];
            case 126:
                _71.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 127:
                after = _71.sent();
                _41 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: /^Result ready/ })];
            case 128:
                _41.apply(void 0, [_71.sent()]).toBeUndefined();
                _42 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: /waiting for you/i })];
            case 129:
                _42.apply(void 0, [_71.sent()]).toBeUndefined();
                _43 = expect;
                _44 = Number;
                _46 = (_45 = /Finished (\d+)/).exec;
                _47 = String;
                return [4 /*yield*/, keyed(after, 'finished-fold')];
            case 130:
                _43.apply(void 0, [_44.apply(void 0, [(_70 = _46.apply(_45, [_47.apply(void 0, [(_69 = (_71.sent())) === null || _69 === void 0 ? void 0 : _69.props.label])])) === null || _70 === void 0 ? void 0 : _70[1]])]).toBe(before + 3);
                _48 = expect;
                return [4 /*yield*/, after.findAll({ type: 'Button' })];
            case 131:
                _48.apply(void 0, [(_71.sent()).some(function (b) { var _a; return /^dismiss-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('work started from a report keeps its own report linked to it, beside the older one on the same subject', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, opened, old, metas, fresh, _b, _c, _d, _, e_1_1, list, rows, _e, _f, _g, _h, newest, id, one, kin;
    var _this = this;
    var _j, e_1, _k, _l;
    var _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, opened = _a.opened;
                old = { id: '20261101-0900-revenue', title: 'Revenue', subject: 'Revenue', at: 1600000000000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Revenue was flat.', files: [], agent: '' };
                files.set("".concat(MEMORY, "/reports/").concat(old.id, "/meta.json"), JSON.stringify(old));
                files.set("".concat(MEMORY, "/reports/").concat(old.id, "/report.md"), 'Revenue was flat.\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                return [4 /*yield*/, $.prompt.submit({ text: "Carry on from the report \"Revenue\", ".concat(MEMORY, "/reports/").concat(old.id, "/report.md: look again"), wait: false, origin: composer })];
            case 2:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Revenue again', prompt: 'look again' }))];
            case 3:
                _r.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 'u1', name: 'Revenue', repo: '/shop', agentId: 'a1' })];
            case 4:
                _r.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: "Revenue rose 5% since the last look.\n\n".concat('Each week is in the table. '.repeat(30)), durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 5:
                _r.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                _r.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            all = __spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); });
                            return [2 /*return*/, all.length === 2 ? all : undefined];
                        });
                    }); })];
            case 7:
                metas = _r.sent();
                fresh = JSON.parse((_o = files.get((_m = (metas !== null && metas !== void 0 ? metas : []).find(function (path) { return !path.includes(old.id); })) !== null && _m !== void 0 ? _m : '')) !== null && _o !== void 0 ? _o : '{}');
                expect(fresh.from).toBe(old.id);
                expect(fresh.subject).toBe('Revenue');
                // Filed under the subject's own folder, not the chat's
                expect(fresh.folder).toBe('/shop');
                expect(fresh.question).toBeUndefined();
                // The older one is kept as it was
                expect(files.get("".concat(MEMORY, "/reports/").concat(old.id, "/report.md"))).toBe('Revenue was flat.\n');
                // The same work reporting again, and the report it started from, are one row: the newest (the person's words start it again:
                // a task that is done reports again only from a run of its own)
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “count the refunds too”' })];
            case 8:
                // The same work reporting again, and the report it started from, are one row: the newest (the person's words start it again:
                // a task that is done reports again only from a run of its own)
                _r.sent();
                _r.label = 9;
            case 9:
                _r.trys.push([9, 14, 15, 20]);
                _b = true, _c = __asyncValues($.turn.step({ turnId: 't2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _r.label = 10;
            case 10: return [4 /*yield*/, _c.next()];
            case 11:
                if (!(_d = _r.sent(), _j = _d.done, !_j)) return [3 /*break*/, 13];
                _l = _d.value;
                _b = false;
                _ = _l;
                void _;
                _r.label = 12;
            case 12:
                _b = true;
                return [3 /*break*/, 10];
            case 13: return [3 /*break*/, 20];
            case 14:
                e_1_1 = _r.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 20];
            case 15:
                _r.trys.push([15, , 18, 19]);
                if (!(!_b && !_j && (_k = _c.return))) return [3 /*break*/, 17];
                return [4 /*yield*/, _k.call(_c)];
            case 16:
                _r.sent();
                _r.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 19: return [7 /*endfinally*/];
            case 20: return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: "Revenue rose 6% once the refunds are counted.\n\n".concat('Refunds are in the table. '.repeat(30)), durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 21:
                _r.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 22:
                _r.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); }).length === 3 ? true : undefined)];
                    }); }); })];
            case 23:
                _r.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 24:
                list = _r.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 25:
                rows = (_r.sent()).filter(function (one) { var _a; return /^report-\d{8}/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect(rows.map(function (one) { return one.props.label; })).toEqual(['Revenue again']);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Results$/ })];
            case 26:
                _e.apply(void 0, [(_p = (_r.sent())) === null || _p === void 0 ? void 0 : _p.props.bold]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^1$/ })];
            case 27:
                _f.apply(void 0, [_r.sent()]).toBeDefined();
                // No subject heading, no line under the row, no fold of rounds in the list
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 28:
                // No subject heading, no line under the row, no fold of rounds in the list
                _g.apply(void 0, [(_r.sent()).filter(function (text) { return text.text === 'Revenue' || /Revenue rose/.test(text.text); })]).toHaveLength(0);
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 29:
                _h.apply(void 0, [(_r.sent()).some(function (one) { var _a; return /^rounds-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 30:
                newest = (_r.sent()).filter(function (one) { var _a; return /^report-\d{8}/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })[0];
                return [4 /*yield*/, list.press({ key: (_q = newest === null || newest === void 0 ? void 0 : newest.key) !== null && _q !== void 0 ? _q : '' })];
            case 31:
                _r.sent();
                id = "report-".concat(String(newest === null || newest === void 0 ? void 0 : newest.key).replace(/^report-/, '').replace(/-\d+$/, ''));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes(id) || undefined];
                    }); }); })];
            case 32:
                _r.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Revenue again', bodyColumns: 80 }), surface: 'desktop' }))];
            case 33:
                one = _r.sent();
                return [4 /*yield*/, one.findAll({ type: 'Button' })];
            case 34:
                kin = (_r.sent()).map(function (button) { return String(button.props.label); });
                expect(kin.some(function (label) { return label.includes('Revenue · this result came from it'); })).toBe(true);
                expect(kin.some(function (label) { return label.includes('Revenue again · earlier result'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a report opened when three are open closes the one opened longest ago', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, opened, closed, r, list;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on, { panes: ['claudopus', 'report-a', 'reports', 'report-b', 'report-c'] }), files = _a.files, opened = _a.opened, closed = _a.closed;
                r = { id: 'd', title: 'Fourth', subject: 'Fourth', at: 1600000000000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'It was found.', files: [], agent: '' };
                files.set("".concat(MEMORY, "/reports/d/meta.json"), JSON.stringify(r));
                files.set("".concat(MEMORY, "/reports/d/report.md"), 'It was found.\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _b.sent();
                return [4 /*yield*/, pressed(list, 'report-d')];
            case 3:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('report-d') || undefined];
                    }); }); })];
            case 4:
                _b.sent();
                expect(closed.filter(function (id) { return id.startsWith('report-'); })).toEqual(['report-a']);
                return [2 /*return*/];
        }
    });
}); });
test('a result saved earlier that lists questions shows them as plain text under Questions it left, with nothing to press; the list has no group of what waits, the chat is told of no question, and a change asked of it goes as the person\'s message', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, submitted, resumed, filled, base, reps, _i, reps_1, r, pane, _b, _c, list, _d, _e, _f, cases, bar, _g, cases_1, one, tab_1, texts, _h, _j, tab, _k, field, _l, told;
    var _this = this;
    var _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                _a = world(on), files = _a.files, submitted = _a.submitted, resumed = _a.resumed;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' };
                reps = [
                    __assign(__assign({}, base), { id: 'old', title: 'Old', at: 1600000000000, gist: 'Old one.', question: 'Ship the old one?' }),
                    __assign(__assign({}, base), { id: 'two', title: 'Two', at: 1600000100000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?', choices: ['Public', 'Private'] }] }),
                    __assign(__assign({}, base), { id: 'ends', title: 'Ends', at: 1600000200000, gist: 'Ends asking.' }),
                ];
                for (_i = 0, reps_1 = reps; _i < reps_1.length; _i++) {
                    r = reps_1[_i];
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(r));
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), "".concat(r.gist, "\n\nShall I go on?\n"));
                }
                return [4 /*yield*/, $.session.start(start)
                    // The panel counts none of them as waiting
                ];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                pane = _s.sent();
                _b = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 3:
                _b.apply(void 0, [(_m = (_s.sent())) === null || _m === void 0 ? void 0 : _m.props.label]).toBe('Results 3');
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /waiting for you/i })];
            case 4:
                _c.apply(void 0, [_s.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()
                    // The list is newest first, whatever a result lists
                ];
            case 5:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 6:
                list = _s.sent();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^3$/ })];
            case 7:
                _d.apply(void 0, [_s.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 8:
                _e.apply(void 0, [_s.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                _f.apply(void 0, [(_s.sent()).filter(function (one) { var _a; return /^report-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); }).map(function (one) { return one.props.label; })]).toEqual(['Ends', 'Two', 'Old']);
                cases = [
                    { id: 'old', heads: ['Old', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Ship the old one?'] },
                    { id: 'two', heads: ['Two', 'Questions it left', 'Summary', 'In full', 'Follow-up'], left: ['Delete the folder?', 'Make it public?'] },
                    { id: 'ends', heads: ['Ends', 'Summary', 'In full', 'Follow-up'], left: [] },
                ];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 10:
                bar = _s.sent();
                _g = 0, cases_1 = cases;
                _s.label = 11;
            case 11:
                if (!(_g < cases_1.length)) return [3 /*break*/, 17];
                one = cases_1[_g];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: "report-".concat(one.id), props: __assign(__assign({}, LIST.props), { title: one.id, bodyColumns: 80 }), surface: 'desktop' }))];
            case 12:
                tab_1 = _s.sent();
                return [4 /*yield*/, tab_1.findAll({ type: 'Text' })];
            case 13:
                texts = _s.sent();
                expect([one.id, texts.filter(function (text) { return text.props.bold; }).map(function (text) { return text.text; })]).toEqual([one.id, one.heads]);
                expect([one.id, texts.filter(function (text) { return /\?$/.test(String(text.text)); }).map(function (text) { return [text.text, text.props.dimColor, text.props.color]; })]).toEqual([one.id, one.left.map(function (text) { return [text, true, undefined]; })]);
                _h = expect;
                _j = [one.id];
                return [4 /*yield*/, tab_1.findAll({ type: 'Button' })];
            case 14:
                _h.apply(void 0, [_j.concat([(_s.sent()).map(function (button) { return String(button.props.label); }).filter(function (label) { return !/ · /.test(label); })])]).toEqual([one.id, ['Archive', 'Message']]);
                return [4 /*yield*/, tab_1.unmount()];
            case 15:
                _s.sent();
                _s.label = 16;
            case 16:
                _g++;
                return [3 /*break*/, 11];
            case 17: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-old', props: __assign(__assign({}, LIST.props), { title: 'Old', bodyColumns: 80 }), surface: 'desktop' }))];
            case 18:
                tab = _s.sent();
                return [4 /*yield*/, pressed(tab, 'report-carry')];
            case 19:
                _s.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, bar.find({ type: 'Text', text: /^↳ Message to/ })];
                    }); }); })];
            case 20:
                _k.apply(void 0, [(_o = (_s.sent())) === null || _o === void 0 ? void 0 : _o.text]).toBe('↳ Message to “Old”');
                return [4 /*yield*/, bar.findAll({ type: 'Input' })];
            case 21:
                field = (_s.sent())[0];
                return [4 /*yield*/, bar.input({ key: (_p = field === null || field === void 0 ? void 0 : field.key) !== null && _p !== void 0 ? _p : '', text: 'ship it after all' })];
            case 22:
                _s.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted[0]];
                    }); }); })];
            case 23:
                _l.apply(void 0, [_s.sent()]).toMatch(new RegExp("^Continue from the result \"Old\" \\(13 Sep 2020, \\d\\d:26\\), ".concat(MEMORY, "/reports/old/report\\.md: ship it after all$")));
                expect(submitted).toHaveLength(1);
                expect(resumed).toEqual([]);
                expect(filled).toEqual([]);
                return [4 /*yield*/, tab.unmount()];
            case 24:
                _s.sent();
                return [4 /*yield*/, bar.unmount()];
            case 25:
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits', wait: false, origin: composer })];
            case 26:
                told = (_r = (_q = (_s.sent()).context) === null || _q === void 0 ? void 0 : _q.join('\n')) !== null && _r !== void 0 ? _r : '';
                expect(told).toContain('reports/old/report.md');
                expect(told).not.toContain('waiting on');
                expect(told).not.toContain('Ship the old one?');
                expect(told).not.toContain('Make it public?');
                expect(told).not.toContain('Shall I go on?');
                return [2 /*return*/];
        }
    });
}); });
test('a result archived with one press leaves the list, its tab, the count and the note, keeps its text, and comes back from the folded Archived row', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, closed, base, reps, _i, reps_2, r, pane, list, _b, tab, _c, _d, _e, _f, _g, told, _h, _j, _k, _l, _m, _o, old, _p, _q, d, later, _r;
    var _this = this;
    var _s, _t, _u, _v, _w, _x, _y, _z, _0;
    return __generator(this, function (_1) {
        switch (_1.label) {
            case 0:
                _a = world(on, { panes: ['claudopus', 'reports', 'report-b'] }), files = _a.files, closed = _a.closed;
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [] };
                reps = [
                    __assign(__assign({}, base), { id: 'a0', title: 'Revenue', at: 1600000000000, gist: 'Revenue was flat.', agent: 'w1' }),
                    __assign(__assign({}, base), { id: 'a1', title: 'Revenue', at: 1600000100000, gist: 'Revenue rose.', agent: 'w1' }),
                    __assign(__assign({}, base), { id: 'b', title: 'Bots', subject: 'Bots', at: 1600000200000, gist: 'A bot wave.', agent: '', waiting: [{ text: 'Block them?' }] }),
                    __assign(__assign({}, base), { id: 'c', title: 'Kept', subject: 'Kept', at: 1600000300000, gist: 'Still here.', agent: '' }),
                ];
                for (_i = 0, reps_2 = reps; _i < reps_2.length; _i++) {
                    r = reps_2[_i];
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(r));
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), "".concat(r.gist, "\n"));
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _1.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _1.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 3:
                list = _1.sent();
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^3$/ })];
            case 4:
                _b.apply(void 0, [_1.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-b', surface: 'desktop' }))];
            case 5:
                tab = _1.sent();
                return [4 /*yield*/, pressed(tab, 'report-archive')];
            case 6:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, closed.includes('report-b') || undefined];
                    }); }); })];
            case 7:
                _1.sent();
                expect(JSON.parse((_s = files.get("".concat(MEMORY, "/reports/b/meta.json"))) !== null && _s !== void 0 ? _s : '{}').archived).toBe(1700000000000);
                expect(files.get("".concat(MEMORY, "/reports/b/report.md"))).toBe('A bot wave.\n');
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^2$/ })];
                    }); }); })];
            case 8:
                _c.apply(void 0, [_1.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 9:
                _d.apply(void 0, [(_t = (_1.sent())) === null || _t === void 0 ? void 0 : _t.props.label]).toBe('Results 2');
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '●' })];
            case 10:
                _e.apply(void 0, [_1.sent()]).toBeUndefined();
                // From its row: every round of that work goes
                return [4 /*yield*/, pressed(list, 'archive-a1')];
            case 11:
                // From its row: every round of that work goes
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/reports/a0/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived ? true : undefined)];
                    }); }); })];
            case 12:
                _1.sent();
                expect(JSON.parse((_u = files.get("".concat(MEMORY, "/reports/a1/meta.json"))) !== null && _u !== void 0 ? _u : '{}').archived).toBeDefined();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^1$/ })];
                    }); }); })];
            case 13:
                _f.apply(void 0, [_1.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, keyed(list, 'report-a1')];
            case 14:
                _g.apply(void 0, [_1.sent()]).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what is new', wait: false, origin: composer })];
            case 15:
                told = (_w = (_v = (_1.sent()).context) === null || _v === void 0 ? void 0 : _v.join('\n')) !== null && _w !== void 0 ? _w : '';
                expect(told).toContain('reports/c/report.md');
                expect(told).not.toContain('reports/b/');
                expect(told).not.toContain('reports/a1/');
                expect(told).not.toContain('Block them?');
                // The way back: one folded row, unfolded to each with Bring back
                _h = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 16:
                // The way back: one folded row, unfolded to each with Bring back
                _h.apply(void 0, [(_x = (_1.sent())) === null || _x === void 0 ? void 0 : _x.props.label]).toBe('▸ Archived 2');
                _j = expect;
                return [4 /*yield*/, keyed(list, 'unarchive-b')];
            case 17:
                _j.apply(void 0, [_1.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(list, 'archived-fold')];
            case 18:
                _1.sent();
                _k = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 19:
                _k.apply(void 0, [(_y = (_1.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('▾ Archived 2');
                return [4 /*yield*/, pressed(list, 'unarchive-b')];
            case 20:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/reports/b/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived ? undefined : true)];
                    }); }); })];
            case 21:
                _1.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^2$/ })];
                    }); }); })];
            case 22:
                _l.apply(void 0, [_1.sent()]).toBeDefined();
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 23:
                _m.apply(void 0, [_1.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 24:
                _o.apply(void 0, [(_z = (_1.sent())) === null || _z === void 0 ? void 0 : _z.props.label]).toBe('▾ Archived 1');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-a1', surface: 'desktop' }))];
            case 25:
                old = _1.sent();
                _p = expect;
                return [4 /*yield*/, keyed(old, 'report-archive')];
            case 26:
                _p.apply(void 0, [(_0 = (_1.sent())) === null || _0 === void 0 ? void 0 : _0.props.label]).toBe('Bring back');
                _q = expect;
                return [4 /*yield*/, old.find({ type: 'Text', text: /· archived$/ })];
            case 27:
                _q.apply(void 0, [_1.sent()]).toBeDefined();
                // One that came after the list was opened, archived and brought back, is listed in its place
                return [4 /*yield*/, pressed(pane, 'reports-open')];
            case 28:
                // One that came after the list was opened, archived and brought back, is listed in its place
                _1.sent();
                d = __assign(__assign({}, base), { id: 'd', title: 'Later', subject: 'Later', at: 1600000400000, gist: 'Came later.', agent: '' });
                files.set("".concat(MEMORY, "/reports/d/meta.json"), JSON.stringify(d));
                files.set("".concat(MEMORY, "/reports/d/report.md"), 'Came later.\n');
                return [4 /*yield*/, pressed(old, 'report-archive')];
            case 29:
                _1.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-d', surface: 'desktop' }))];
            case 30:
                later = _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(later, 'report-archive')];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === 'Archive' ? true : undefined)];
                        }
                    }); }); })];
            case 31:
                _1.sent();
                return [4 /*yield*/, pressed(later, 'report-archive')];
            case 32:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'unarchive-d')];
                    }); }); })];
            case 33:
                _1.sent();
                return [4 /*yield*/, pressed(list, 'unarchive-d')];
            case 34:
                _1.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'report-d')];
                    }); }); })];
            case 35:
                _r.apply(void 0, [_1.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('the results list is one line a row, newest first with no group of what waits: the five newest, the rest folded, rounds of one work as one row, archived and told as one', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, base, at, reps, _i, reps_3, r, list, titles, _a, _b, _c, _d, _e, rowBoxes, heights, walk, _f, _g, told, tab, kin, _h, _j;
    var _this = this;
    var _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                files = world(on, { panes: ['claudopus', 'reports'] }).files;
                base = { chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'A long line that no row shows.' };
                at = function (n) { return 1700000000000 - n * 60000; };
                reps = __spreadArray([
                    __assign(__assign({}, base), { id: 'v1', title: 'Explainer video', subject: 'Claude workflow', at: at(60), agent: 'w1', waiting: [{ text: 'Keep the first cut?' }] }),
                    __assign(__assign({}, base), { id: 'v2', title: 'Video second cut', subject: 'Claude workflow', at: at(40), agent: 'w2', from: 'v1', waiting: [{ text: 'Keep the second cut?' }] }),
                    __assign(__assign({}, base), { id: 'v3', title: 'Video third cut', subject: 'Claude workflow', at: at(20), agent: 'w3', from: 'v2', waiting: [{ text: 'Keep the third cut?' }] }),
                    __assign(__assign({}, base), { id: 'i1', title: 'Old-chat index: first', subject: 'Old-chat index', at: at(300), agent: 'w4' }),
                    __assign(__assign({}, base), { id: 'i2', title: 'Old-chat index: second', subject: 'Old-chat index', at: at(290), agent: 'w5' })
                ], Array.from({ length: 8 }, function (_, n) { return (__assign(__assign({}, base), { id: "p".concat(n), title: "Panel change ".concat(n), subject: 'Claude workflow', at: at(100 + n), agent: "x".concat(n) })); }), true);
                for (_i = 0, reps_3 = reps; _i < reps_3.length; _i++) {
                    r = reps_3[_i];
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(r));
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), "".concat(r.gist, "\n"));
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Results', bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _p.sent();
                titles = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return /^report-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); }).map(function (one) { return String(one.props.label); })
                            // 13 reports are 10 rows: the video one, the index one, eight panel changes
                        ];
                    }
                }); }); };
                // 13 reports are 10 rows: the video one, the index one, eight panel changes
                _a = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^10$/ })];
            case 3:
                // 13 reports are 10 rows: the video one, the index one, eight panel changes
                _a.apply(void 0, [_p.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 4:
                _b.apply(void 0, [(_p.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; })]).toEqual(['Results', 'Newest']);
                _c = expect;
                return [4 /*yield*/, titles()];
            case 5:
                _c.apply(void 0, [_p.sent()]).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3']);
                // Nothing under a title: no finding, no subject, no question it lists, no mark; the time, Archive
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /long line|waiting|Keep the|Claude workflow/ })];
            case 6:
                // Nothing under a title: no finding, no subject, no question it lists, no mark; the time, Archive
                _d.apply(void 0, [_p.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text', text: /^●$/ })];
            case 7:
                _e.apply(void 0, [(_p.sent()).length]).toBe(0);
                return [4 /*yield*/, list.drawn()];
            case 8:
                rowBoxes = (_p.sent());
                heights = [];
                walk = function (n) {
                    var _a, _b, _c, _d;
                    var one = n;
                    if ((_b = (_a = one === null || one === void 0 ? void 0 : one.props) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.startsWith('entry-'))
                        heights.push((_c = one.props.height) !== null && _c !== void 0 ? _c : 0);
                    for (var _i = 0, _e = (_d = one === null || one === void 0 ? void 0 : one.children) !== null && _d !== void 0 ? _d : []; _i < _e.length; _i++) {
                        var child = _e[_i];
                        walk(child);
                    }
                };
                walk(rowBoxes);
                expect(heights).toEqual([1, 1, 1, 1, 1]);
                // The rest is one row that unfolds
                _f = expect;
                return [4 /*yield*/, keyed(list, 'earlier-fold')];
            case 9:
                // The rest is one row that unfolds
                _f.apply(void 0, [(_k = (_p.sent())) === null || _k === void 0 ? void 0 : _k.props.label]).toBe('▸ Earlier 5');
                return [4 /*yield*/, pressed(list, 'earlier-fold')];
            case 10:
                _p.sent();
                _g = expect;
                return [4 /*yield*/, titles()];
            case 11:
                _g.apply(void 0, [(_p.sent()).slice(5)]).toEqual(['Panel change 4', 'Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second']);
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits', wait: false, origin: composer })];
            case 12:
                told = (_m = (_l = (_p.sent()).context) === null || _l === void 0 ? void 0 : _l.join('\n')) !== null && _m !== void 0 ? _m : '';
                expect(told).toContain('reports/v3/report.md');
                expect(told).not.toContain('Keep the third cut?');
                expect(told).not.toContain('Keep the first cut?');
                expect(told).not.toContain('Keep the second cut?');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-v3', surface: 'desktop' }))];
            case 13:
                tab = _p.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 14:
                kin = (_p.sent()).map(function (one) { return String(one.props.label); });
                expect(kin.some(function (label) { return label.includes('Video second cut · this result came from it'); })).toBe(true);
                expect(kin.some(function (label) { return label.includes('Explainer video · earlier result'); })).toBe(true);
                // Archived from its row, every round goes
                return [4 /*yield*/, pressed(list, 'archive-v3')];
            case 15:
                // Archived from its row, every round goes
                _p.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/reports/v1/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived ? true : undefined)];
                    }); }); })];
            case 16:
                _p.sent();
                expect(['v1', 'v2', 'v3'].map(function (id) { var _a; return Boolean(JSON.parse((_a = files.get("".concat(MEMORY, "/reports/").concat(id, "/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived); })).toEqual([true, true, true]);
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'archived-fold')];
                    }); }); })];
            case 17:
                _h.apply(void 0, [_p.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 18:
                _j.apply(void 0, [(_o = (_p.sent())) === null || _o === void 0 ? void 0 : _o.props.label]).toBe('▸ Archived 1');
                return [2 /*return*/];
        }
    });
}); });
test('work whose brief names one result on what it is about is a round of that work; one naming several, or one on something else, is not', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, base, _i, _b, r, _c, _d, id, metas;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], gist: 'Done.', agent: 'w0' };
                for (_i = 0, _b = [__assign(__assign({}, base), { id: '20261111-1853-explainer-video', title: 'Claudopus explainer video', at: 1 }), __assign(__assign({}, base), { id: '20261111-1700-logo', title: 'Draw the logo', at: 2 })]; _i < _b.length; _i++) {
                    r = _b[_i];
                    (files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(r)), files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), "Done.\n"));
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the video clearer', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Video second cut', prompt: "Start from ".concat(MEMORY, "/reports/20261111-1853-explainer-video/report.md") }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the panel', prompt: "Start from ".concat(MEMORY, "/reports/20261111-1853-explainer-video/report.md") }))];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Video and logo', prompt: "Read ".concat(MEMORY, "/reports/20261111-1853-explainer-video/report.md and ").concat(MEMORY, "/reports/20261111-1700-logo/report.md") }))];
            case 5:
                _e.sent();
                _c = 0, _d = ['a1', 'a2', 'a3'];
                _e.label = 6;
            case 6:
                if (!(_c < _d.length)) return [3 /*break*/, 9];
                id = _d[_c];
                return [4 /*yield*/, $.turn.complete({ agentId: id, answer: "Finished ".concat(id, ".\n\n").concat('It is in the table. '.repeat(30)), durationMs: 1, isAborted: false, turnId: "t-".concat(id), reason: 'answer' })];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, clock.advance(10)];
            case 10:
                _e.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            all = __spreadArray([], files.entries(), true).filter(function (_a) {
                                var path = _a[0];
                                return path.endsWith('/meta.json');
                            }).map(function (_a) {
                                var text = _a[1];
                                return JSON.parse(text);
                            });
                            return [2 /*return*/, all.length === 5 ? all : undefined];
                        });
                    }); })];
            case 11:
                metas = _e.sent();
                expect(['a1', 'a2', 'a3'].map(function (id) { var _a, _b; return (_b = (_a = metas === null || metas === void 0 ? void 0 : metas.find(function (one) { return one.agent === id; })) === null || _a === void 0 ? void 0 : _a.from) !== null && _b !== void 0 ? _b : ''; })).toEqual(['20261111-1853-explainer-video', '', '']);
                return [2 /*return*/];
        }
    });
}); });
test('every button of the results list and of a result takes a new key whenever its drawing changes, and keeps it while nothing does, so the app never presses a handle that is gone', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, opened, base, put, list, keys, first, _b, _c, after, _d, _e, tab, _f, tabKeys, _g, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on, { panes: ['claudopus', 'reports'] }), files = _a.files, clock = _a.clock, opened = _a.opened;
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' };
                put = function (r) {
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(__assign(__assign(__assign({}, base), { gist: 'It was found.' }), r)));
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), 'It was found, and it is written here in full.\n');
                };
                put({ id: 'bucket', title: 'FaceIQ bucket migration plan', at: 1699000000000, waiting: [{ text: 'Start step 0?' }] });
                put({ id: 'header', title: 'Rethink the panel header', at: 1699000100000, waiting: [{ text: 'Reopen the M4 chat?' }] });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Results', bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _k.sent();
                keys = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return String(one.key); })];
                    }
                }); }); };
                return [4 /*yield*/, keys()];
            case 3:
                first = _k.sent();
                expect(first.some(function (key) { return /^report-bucket-\d+$/.test(key); })).toBe(true);
                // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
                return [4 /*yield*/, clock.advance(5000)];
            case 4:
                // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
                _k.sent();
                _b = expect;
                return [4 /*yield*/, keys()];
            case 5:
                _b.apply(void 0, [_k.sent()]).toEqual(first);
                // A result arriving from another chat changes the drawing: no key stays, so the app takes every button afresh
                put({ id: 'fresh', title: 'Something new', at: 1700000000000 });
                // (a search of the memory reads the results again, as the panel's own look does)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'found' })];
            case 6:
                // (a search of the memory reads the results again, as the panel's own look does)
                _k.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return /^report-fresh-\d+$/.test(String(one.key)); }) || undefined)];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, keys()];
            case 8:
                after = _k.sent();
                expect(after.filter(function (key) { return first.includes(key); })).toEqual([]);
                // and a press on either named result opens it, drawn
                return [4 /*yield*/, pressed(list, 'report-bucket')];
            case 9:
                // and a press on either named result opens it, drawn
                _k.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('report-bucket') || undefined];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, pressed(list, 'report-header')];
            case 11:
                _k.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('report-header') || undefined];
                    }); }); })];
            case 12:
                _e.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-header', props: __assign(__assign({}, LIST.props), { title: 'Rethink the panel header', bodyColumns: 80 }), surface: 'desktop' }))];
            case 13:
                tab = _k.sent();
                _f = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Rethink the panel header$/ })];
            case 14:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 15:
                tabKeys = (_k.sent()).map(function (one) { return String(one.key); });
                // The result's own tab follows the same rule: changed on another Mac, it changes with no press here, and every key moves
                _g = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })];
            case 16:
                // The result's own tab follows the same rule: changed on another Mac, it changes with no press here, and every key moves
                _g.apply(void 0, [_k.sent()]).toBeDefined();
                put({ id: 'header', title: 'Rethink the panel header', at: 1699000100000, waiting: [] });
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't2', query: 'found' })];
            case 17:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tab.find({ type: 'Text', text: 'Reopen the M4 chat?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 18:
                _h.apply(void 0, [_k.sent()]).toBe(true);
                _j = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 19:
                _j.apply(void 0, [(_k.sent()).map(function (one) { return String(one.key); }).filter(function (key) { return tabKeys.includes(key); })]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
