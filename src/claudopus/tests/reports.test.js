// Results: kept, listed, opened, answered, put away and brought back, and rounds of one work
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
test('finished work leaves a report for good: its pictures copied, listed under Reports, opened, answered, and named to the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, submitted, clock, copied, opened, resumed, appended, filled, _b, report, _c, metaPath, folder, meta, pane, _d, _e, _f, _g, asking, _h, _j, _k, _l, _m, _o, _p, list, _q, _r, _s, _t, _u, _v, _w, id, one, heads, _x, _y, _z, _0, _1, answers, doneCards, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, next, _18, _19, finishedCount, cards, _20, before, _21, _22, _23, _24, _25, _26, _27, after, _28, _29, _30, _31, _32, _33, _34, _35, kept, typed, words, _36, _37, _38, _39, _40, _41;
    var _this = this;
    var _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59;
    return __generator(this, function (_60) {
        switch (_60.label) {
            case 0:
                _a = world(on), files = _a.files, submitted = _a.submitted, clock = _a.clock, copied = _a.copied, opened = _a.opened, resumed = _a.resumed, appended = _a.appended;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG');
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ lean: { chat: 'tasks' } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _60.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })];
            case 2:
                _60.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Weekly revenue', prompt: 'how is revenue doing' }))
                    // A helper's answer is no report
                ];
            case 3:
                _60.sent();
                // A helper's answer is no report
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' })
                    // A helper records nothing over the work it answers to
                ];
            case 4:
                // A helper's answer is no report
                _60.sent();
                // A helper records nothing over the work it answers to
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', items: ['Count again?'], agentId: 'a2' })];
            case 5:
                // A helper records nothing over the work it answers to
                _b.apply(void 0, [(_60.sent()).result]).toContain('A helper records nothing');
                return [4 /*yield*/, $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })];
            case 6:
                _60.sent();
                report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.';
                // What waits on the person is what the work recorded, wherever it is in the report, not its last line
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?', 'Post it in the channel too?'], agentId: 'a1' })];
            case 7:
                // What waits on the person is what the work recorded, wherever it is in the report, not its last line
                _c.apply(void 0, [(_60.sent()).result]).toContain('Recorded 2');
                // A helper records nothing over the work it answers to
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 8:
                // A helper records nothing over the work it answers to
                _60.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 9:
                _60.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (path) { return path.startsWith("".concat(MEMORY, "/reports/")) && path.endsWith('/meta.json'); })];
                    }); }); })];
            case 10:
                metaPath = _60.sent();
                folder = (metaPath !== null && metaPath !== void 0 ? metaPath : '').replace('/meta.json', '');
                expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/);
                expect(files.get("".concat(folder, "/report.md"))).toBe("".concat(report, "\n"));
                expect(copied).toEqual(["".concat(folder, "/revenue.png")]);
                meta = JSON.parse((_42 = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _42 !== void 0 ? _42 : '{}');
                expect(meta.title).toBe('Weekly revenue');
                expect(meta.files).toEqual(['revenue.png']);
                expect(meta.waiting).toEqual([{ text: 'Shall I send it to the team?' }, { text: 'Post it in the channel too?' }]);
                expect(meta.question).toBeUndefined();
                expect(meta.gist).toBe('Revenue rose 12% this week to $4,210.');
                expect(meta.folder).toBe('/repo');
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                // A short answer with no picture is a confirmation, not a report
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save a rule', prompt: 'save it' }))];
            case 11:
                // A short answer with no picture is a confirmation, not a report
                _60.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })];
            case 12:
                _60.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 13:
                _60.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                // The same report again is not kept twice
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 14:
                // The same report again is not kept twice
                _60.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 15:
                _60.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                ];
            case 16:
                pane = _60.sent();
                // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 17:
                // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                _d.apply(void 0, [_60.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 18:
                _e.apply(void 0, [(_43 = (_60.sent())) === null || _43 === void 0 ? void 0 : _43.props.label]).toBe('Results 1');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^●$/ })];
            case 19:
                _f.apply(void 0, [_60.sent()]).toBeUndefined();
                // A finished task whose result asks something more is done, in green: its card stays at the top, never under Finished, with
                // the first question and its answers, until it is answered or dismissed, and the header counts each question
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^2 questions waiting for you/ })];
            case 20:
                // A finished task whose result asks something more is done, in green: its card stays at the top, never under Finished, with
                // the first question and its answers, until it is answered or dismissed, and the header counts each question
                _g.apply(void 0, [_60.sent()]).toBeDefined();
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Result ready · Shall I send it to the team?' })];
            case 21:
                asking = _60.sent();
                expect([asking === null || asking === void 0 ? void 0 : asking.props.color, asking === null || asking === void 0 ? void 0 : asking.props.bold]).toEqual([undefined, true]);
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Waiting for you · / })];
            case 22:
                _h.apply(void 0, [_60.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Done · / })];
            case 23:
                _j.apply(void 0, [_60.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 24:
                _k.apply(void 0, [(_60.sent()).filter(function (b) { return b.props.backgroundColor === '#E5A50A'; }).length]).toBe(0);
                _l = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 25:
                _l.apply(void 0, [(_60.sent()).filter(function (b) { var _a; return /^result-ask-a1-say-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); }).map(function (b) { return b.props.label; })]).toEqual(['Yes', 'No', 'Not now', 'Answer in words']);
                _m = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 26:
                _m.apply(void 0, [(_44 = (_60.sent()).find(function (b) { var _a; return /^result-ask-a1-more-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })) === null || _44 === void 0 ? void 0 : _44.props.label]).toBe('Result');
                _o = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '1 more question' })];
            case 27:
                _o.apply(void 0, [_60.sent()]).toBeDefined();
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                return [4 /*yield*/, pressed(pane, 'reports-open')];
            case 28:
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                _60.sent();
                expect(opened).toContain('reports');
                _p = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 29:
                _p.apply(void 0, [_60.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 30:
                list = _60.sent();
                _q = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Results$/ })];
            case 31:
                _q.apply(void 0, [(_45 = (_60.sent())) === null || _45 === void 0 ? void 0 : _45.props.bold]).toBe(true);
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 32:
                _r.apply(void 0, [(_46 = (_60.sent())) === null || _46 === void 0 ? void 0 : _46.props.bold]).toBe(true);
                // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
                _s = expect;
                return [4 /*yield*/, keyed(list, "report-".concat(folder.split('/').pop()))];
            case 33:
                // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
                _s.apply(void 0, [(_47 = (_60.sent())) === null || _47 === void 0 ? void 0 : _47.props.label]).toBe('Weekly revenue');
                _t = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^\d\d:\d\d$/ })];
            case 34:
                _t.apply(void 0, [_60.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^●$/ })];
            case 35:
                _u.apply(void 0, [_60.sent()]).toBeUndefined();
                _v = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Revenue rose/ })];
            case 36:
                _v.apply(void 0, [_60.sent()]).toBeUndefined();
                _w = expect;
                return [4 /*yield*/, keyed(list, "archive-".concat(folder.split('/').pop()))];
            case 37:
                _w.apply(void 0, [(_48 = (_60.sent())) === null || _48 === void 0 ? void 0 : _48.props.label]).toBe('Archive');
                // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
                return [4 /*yield*/, pressed(list, "report-".concat(folder.split('/').pop()))];
            case 38:
                // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
                _60.sent();
                id = "report-".concat(folder.split('/').pop());
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes(id) || undefined];
                    }); }); })];
            case 39:
                _60.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Weekly revenue', bodyColumns: 80 }), surface: 'desktop' }))];
            case 40:
                one = _60.sent();
                return [4 /*yield*/, one.findAll({ type: 'Text' })];
            case 41:
                heads = (_60.sent()).filter(function (text) { return text.props.bold; }).map(function (text) { return text.text; });
                // What its task made is right under its title, as tiles; its pictures are among them, so no Pictures part repeats them
                expect(heads).toEqual(['Weekly revenue', 'Files', 'Waiting for you', 'Summary', 'In full', 'Follow-up']);
                _x = expect;
                return [4 /*yield*/, one.findAll({ type: 'Svg' })];
            case 42:
                _x.apply(void 0, [(_60.sent()).map(function (svg) { return String(svg.props.alt); })]).toContain('revenue');
                _y = expect;
                return [4 /*yield*/, one.find({ type: 'Markdown', text: /Revenue rose 12%/ })];
            case 43:
                _y.apply(void 0, [(_49 = (_60.sent())) === null || _49 === void 0 ? void 0 : _49.props.text]).toBe("".concat(report, "\n"));
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _z = expect;
                return [4 /*yield*/, keyed(one, 'report-page')];
            case 44:
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _z.apply(void 0, [_60.sent()]).toBeUndefined();
                _0 = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: "".concat(folder, "/revenue.png") })];
            case 45:
                _0.apply(void 0, [_60.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(one, 'report-carry')];
            case 46:
                _60.sent();
                expect(filled[0]).toContain("".concat(folder, "/report.md"));
                // Each waiting item has its own answers; answering one clears that one alone
                _1 = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: 'Post it in the channel too?' })];
            case 47:
                // Each waiting item has its own answers; answering one clears that one alone
                _1.apply(void 0, [_60.sent()]).toBeDefined();
                answers = function () { return resumed.filter(function (line) { return line.includes('to answer a question in your result'); }); };
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 48:
                doneCards = (_60.sent()).filter(function (text) { var _a; return /^Done · /.test((_a = text.text) !== null && _a !== void 0 ? _a : ''); }).length;
                return [4 /*yield*/, pressed(one, 'report-say-0-Yes')];
            case 49:
                _60.sent();
                expect(answers()).toHaveLength(1);
                expect(answers()[0]).toMatch(/^a1: The person pressed "Yes" to answer a question in your result "Weekly revenue" \(.*\/report\.md\): Shall I send it to the team\?\n1 other question of that result still waits for them/);
                expect(answers()[0]).toContain('this answer starts you again');
                expect(answers()[0]).not.toMatch(/\b(me|my)\b/);
                expect(submitted).toHaveLength(0);
                expect(appended.filter(function (line) { return line.includes('answered a question in the result "Weekly revenue"'); })).toEqual([expect.stringContaining('Its task has the answer and carries on with it itself')]);
                // Its card is at work at once: Stop, no question, no longer Done
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 50:
                // Its card is at work at once: Stop, no question, no longer Done
                _2.apply(void 0, [_60.sent()]).toBeDefined();
                _3 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Result ready/ })];
            case 51:
                _3.apply(void 0, [_60.sent()]).toBeUndefined();
                _4 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 task working/ })];
            case 52:
                _4.apply(void 0, [_60.sent()]).toBeDefined();
                _5 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 53:
                _5.apply(void 0, [(_60.sent()).filter(function (text) { var _a; return /^Done · /.test((_a = text.text) !== null && _a !== void 0 ? _a : ''); })]).toHaveLength(doneCards - 1);
                _6 = expect;
                return [4 /*yield*/, keyed(pane, 'dismiss-a1')];
            case 54:
                _6.apply(void 0, [_60.sent()]).toBeUndefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                        return [2 /*return*/, (((_c = (_b = JSON.parse((_a = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _a !== void 0 ? _a : '{}').waiting) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.answer) ? true : undefined)];
                    }); }); })
                    // It ends again with the other question still open: it waits for the person again
                ];
            case 55:
                _60.sent();
                // It ends again with the other question still open: it waits for the person again
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't4', reason: 'answer' })];
            case 56:
                // It ends again with the other question still open: it waits for the person again
                _60.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 57:
                _60.sent();
                expect(JSON.parse((_50 = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _50 !== void 0 ? _50 : '{}').waiting).toEqual([{ text: 'Shall I send it to the team?', answer: 'Yes' }, { text: 'Post it in the channel too?' }]);
                _7 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 58:
                _7.apply(void 0, [_60.sent()]).toBeDefined();
                _8 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, one.find({ type: 'Text', text: /^Shall I send it to the team\?$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 59:
                _8.apply(void 0, [_60.sent()]).toBe(true);
                _9 = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: 'Post it in the channel too?' })];
            case 60:
                _9.apply(void 0, [_60.sent()]).toBeDefined();
                // The card goes on to the next question, the last one
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: 'Result ready · Post it in the channel too?' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 61:
                // The card goes on to the next question, the last one
                _10.apply(void 0, [_60.sent()]).toBeDefined();
                _11 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 question waiting for you/ })];
            case 62:
                _11.apply(void 0, [_60.sent()]).toBeDefined();
                _12 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 63:
                _12.apply(void 0, [(_60.sent()).some(function (b) { var _a; return /^result-ask-a1-more-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                // Not now clears the other and sends nothing
                return [4 /*yield*/, pressed(one, 'report-say-1-Not now')];
            case 64:
                // Not now clears the other and sends nothing
                _60.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                        return [2 /*return*/, (((_c = (_b = JSON.parse((_a = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _a !== void 0 ? _a : '{}').waiting) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.answer) ? true : undefined)];
                    }); }); })];
            case 65:
                _60.sent();
                expect(submitted).toHaveLength(0);
                expect(answers()).toHaveLength(1);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 66:
                _60.sent();
                _13 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 67:
                _13.apply(void 0, [_60.sent()]).toBeUndefined();
                _14 = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 68:
                _14.apply(void 0, [_60.sent()]).toBeUndefined();
                // Nothing open, the card waits on nothing: the header and its line say so, and it is done
                _15 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /^Result ready/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 69:
                // Nothing open, the card waits on nothing: the header and its line say so, and it is done
                _15.apply(void 0, [_60.sent()]).toBe(true);
                _16 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /waiting for you/i })];
            case 70:
                _16.apply(void 0, [_60.sent()]).toBeUndefined();
                _17 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Done · / })];
            case 71:
                _17.apply(void 0, [_60.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })];
            case 72:
                next = _60.sent();
                expect((_51 = next.context) === null || _51 === void 0 ? void 0 : _51.join('\n')).toContain('Results saved');
                expect((_52 = next.context) === null || _52 === void 0 ? void 0 : _52.join('\n')).toContain("".concat(folder, "/report.md"));
                _18 = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: "".concat(folder, "/report.md") })];
            case 73:
                _18.apply(void 0, [(_60.sent()).deny]).toBeUndefined();
                _19 = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: "cat ".concat(folder, "/report.md") })];
            case 74:
                _19.apply(void 0, [(_60.sent()).deny]).toContain('Start a fresh agent');
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
            case 75:
                _60.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w4', items: ['Which opening should go out?'], agentId: 'a4' })];
            case 76:
                _60.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a4', answer: 'Three openings are cut, A, B and C. Nothing is posted until one is picked.', durationMs: 1, isAborted: false, turnId: 't5', reason: 'answer' })];
            case 77:
                _60.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 78:
                _60.sent();
                return [4 /*yield*/, pane.unmount()];
            case 79:
                _60.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 80:
                cards = _60.sent();
                _20 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: 'Result ready · Which opening should go out?' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 81:
                _20.apply(void 0, [_60.sent()]).toBeDefined();
                // (the two that ended before it are under Finished once their two seconds are over)
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === 2 ? true : undefined)];
                        }
                    }); }); })];
            case 82:
                // (the two that ended before it are under Finished once their two seconds are over)
                _60.sent();
                return [4 /*yield*/, finishedCount()];
            case 83:
                before = _60.sent();
                expect(before).toBe(2);
                _21 = expect;
                return [4 /*yield*/, keyed(cards, 'dismiss-a4')];
            case 84:
                _21.apply(void 0, [(_53 = (_60.sent())) === null || _53 === void 0 ? void 0 : _53.props.label]).toBe('Dismiss');
                return [4 /*yield*/, pressed(cards, 'dismiss-a4')];
            case 85:
                _60.sent();
                _22 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: /^Result ready/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 86:
                _22.apply(void 0, [_60.sent()]).toBe(true);
                _23 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === before + 1 ? true : undefined)];
                        }
                    }); }); })];
            case 87:
                _23.apply(void 0, [_60.sent()]).toBe(true);
                _24 = expect;
                return [4 /*yield*/, cards.find({ type: 'Text', text: /waiting for you/i })];
            case 88:
                _24.apply(void 0, [_60.sent()]).toBeUndefined();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save another rule', prompt: 'save it' }))];
            case 89:
                _60.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a5', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't6', reason: 'answer' })];
            case 90:
                _60.sent();
                _25 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: '✓ Done' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 91:
                _25.apply(void 0, [_60.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(cards, 'dismiss-a5')];
            case 92:
                _60.sent();
                _26 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cards.find({ type: 'Text', text: '✓ Done' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 93:
                _26.apply(void 0, [_60.sent()]).toBe(true);
                _27 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, finishedCount()];
                            case 1: return [2 /*return*/, ((_a.sent()) === before + 2 ? true : undefined)];
                        }
                    }); }); })];
            case 94:
                _27.apply(void 0, [_60.sent()]).toBe(true);
                // A redraw later, and a reload of the cards: both still under Finished, nothing back at the top
                return [4 /*yield*/, clock.advance(30000)];
            case 95:
                // A redraw later, and a reload of the cards: both still under Finished, nothing back at the top
                _60.sent();
                return [4 /*yield*/, cards.unmount()];
            case 96:
                _60.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 97:
                _60.sent();
                return [4 /*yield*/, clock.advance(30000)];
            case 98:
                _60.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 99:
                after = _60.sent();
                _28 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: /^Result ready/ })];
            case 100:
                _28.apply(void 0, [_60.sent()]).toBeUndefined();
                _29 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: /waiting for you/i })];
            case 101:
                _29.apply(void 0, [_60.sent()]).toBeUndefined();
                _30 = expect;
                _31 = Number;
                _33 = (_32 = /Finished (\d+)/).exec;
                _34 = String;
                return [4 /*yield*/, keyed(after, 'finished-fold')];
            case 102:
                _30.apply(void 0, [_31.apply(void 0, [(_55 = _33.apply(_32, [_34.apply(void 0, [(_54 = (_60.sent())) === null || _54 === void 0 ? void 0 : _54.props.label])])) === null || _55 === void 0 ? void 0 : _55[1]])]).toBe(before + 2);
                _35 = expect;
                return [4 /*yield*/, after.findAll({ type: 'Button' })];
            case 103:
                _35.apply(void 0, [(_60.sent()).some(function (b) { var _a; return /^dismiss-/.test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                kept = __spreadArray([], files.keys(), true).find(function (path) { return path.includes('pick-an-opening') && path.endsWith('/meta.json'); });
                expect(JSON.parse((_56 = files.get(kept !== null && kept !== void 0 ? kept : '')) !== null && _56 !== void 0 ? _56 : '{}').waiting).toEqual([{ text: 'Which opening should go out?' }]);
                return [4 /*yield*/, $.prompt.submit({ text: "About question 1 of the result \"Pick an opening\" (15 Nov, 02:13), ".concat((kept !== null && kept !== void 0 ? kept : '').replace('/meta.json', ''), "/report.md: B, with the louder music"), wait: false, origin: composer })];
            case 104:
                typed = _60.sent();
                expect((_57 = typed.context) === null || _57 === void 0 ? void 0 : _57.join('\n')).toContain('Claudopus sent this answer of the person\'s to the task that asked ("Pick an opening"), which carries on with it itself');
                return [4 /*yield*/, clock.advance(5000)];
            case 105:
                _60.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a4: ') && line.includes('answered, in their own words, a question in your result "Pick an opening"'); })];
                    }); }); })];
            case 106:
                words = _60.sent();
                expect(words).toContain('Which opening should go out?\nTheir answer: B, with the louder music');
                _36 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, after.find({ type: 'Button', key: 'stop-a4' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 107:
                _36.apply(void 0, [_60.sent()]).toBeDefined();
                _37 = expect;
                _38 = Number;
                _40 = (_39 = /Finished (\d+)/).exec;
                _41 = String;
                return [4 /*yield*/, keyed(after, 'finished-fold')];
            case 108:
                _37.apply(void 0, [_38.apply(void 0, [(_59 = _40.apply(_39, [_41.apply(void 0, [(_58 = (_60.sent())) === null || _58 === void 0 ? void 0 : _58.props.label])])) === null || _59 === void 0 ? void 0 : _59[1]])]).toBe(before + 1);
                return [2 /*return*/];
        }
    });
}); });
test('work started from a report keeps its own report linked to it, beside the older one on the same subject', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, opened, old, metas, fresh, list, rows, _b, _c, _d, _e, newest, id, one, kin;
    var _this = this;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, opened = _a.opened;
                old = { id: '20261101-0900-revenue', title: 'Revenue', subject: 'Revenue', at: 1600000000000, chat: 'c', chatId: 'c', folder: '/repo', gist: 'Revenue was flat.', files: [], agent: '' };
                files.set("".concat(MEMORY, "/reports/").concat(old.id, "/meta.json"), JSON.stringify(old));
                files.set("".concat(MEMORY, "/reports/").concat(old.id, "/report.md"), 'Revenue was flat.\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: "Carry on from the report \"Revenue\", ".concat(MEMORY, "/reports/").concat(old.id, "/report.md: look again"), wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Revenue again', prompt: 'look again' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 'u1', name: 'Revenue', repo: '/shop', agentId: 'a1' })];
            case 4:
                _k.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: "Revenue rose 5% since the last look.\n\n".concat('Each week is in the table. '.repeat(30)), durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 5:
                _k.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            all = __spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); });
                            return [2 /*return*/, all.length === 2 ? all : undefined];
                        });
                    }); })];
            case 7:
                metas = _k.sent();
                fresh = JSON.parse((_g = files.get((_f = (metas !== null && metas !== void 0 ? metas : []).find(function (path) { return !path.includes(old.id); })) !== null && _f !== void 0 ? _f : '')) !== null && _g !== void 0 ? _g : '{}');
                expect(fresh.from).toBe(old.id);
                expect(fresh.subject).toBe('Revenue');
                // Filed under the subject's own folder, not the chat's
                expect(fresh.folder).toBe('/shop');
                expect(fresh.question).toBeUndefined();
                // The older one is kept as it was
                expect(files.get("".concat(MEMORY, "/reports/").concat(old.id, "/report.md"))).toBe('Revenue was flat.\n');
                // The same work reporting again, and the report it started from, are one row: the newest
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: "Revenue rose 6% once the refunds are counted.\n\n".concat('Refunds are in the table. '.repeat(30)), durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 8:
                // The same work reporting again, and the report it started from, are one row: the newest
                _k.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 9:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); }).length === 3 ? true : undefined)];
                    }); }); })];
            case 10:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 11:
                list = _k.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 12:
                rows = (_k.sent()).filter(function (one) { var _a; return /^report-\d{8}/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect(rows.map(function (one) { return one.props.label; })).toEqual(['Revenue again']);
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Results$/ })];
            case 13:
                _b.apply(void 0, [(_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.props.bold]).toBe(true);
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^1$/ })];
            case 14:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                // No subject heading, no line under the row, no fold of rounds in the list
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 15:
                // No subject heading, no line under the row, no fold of rounds in the list
                _d.apply(void 0, [(_k.sent()).filter(function (text) { return text.text === 'Revenue' || /Revenue rose/.test(text.text); })]).toHaveLength(0);
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 16:
                _e.apply(void 0, [(_k.sent()).some(function (one) { var _a; return /^rounds-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 17:
                newest = (_k.sent()).filter(function (one) { var _a; return /^report-\d{8}/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })[0];
                return [4 /*yield*/, list.press({ key: (_j = newest === null || newest === void 0 ? void 0 : newest.key) !== null && _j !== void 0 ? _j : '' })];
            case 18:
                _k.sent();
                id = "report-".concat(String(newest === null || newest === void 0 ? void 0 : newest.key).replace(/^report-/, '').replace(/-\d+$/, ''));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes(id) || undefined];
                    }); }); })];
            case 19:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Revenue again', bodyColumns: 80 }), surface: 'desktop' }))];
            case 20:
                one = _k.sent();
                return [4 /*yield*/, one.findAll({ type: 'Button' })];
            case 21:
                kin = (_k.sent()).map(function (button) { return String(button.props.label); });
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
test('an older report waits by its one question, a report that only ends with a question waits on nothing, and the chat is told each open item', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, base, reps, _i, reps_1, r, list, _a, _b, _c, told;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                files = world(on).files;
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '' };
                reps = [
                    __assign(__assign({}, base), { id: 'old', title: 'Old', at: 1600000000000, gist: 'Old one.', question: 'Ship the old one?' }),
                    __assign(__assign({}, base), { id: 'two', title: 'Two', at: 1600000100000, gist: 'Two things.', waiting: [{ text: 'Delete the folder?', answer: 'No' }, { text: 'Make it public?' }] }),
                    __assign(__assign({}, base), { id: 'ends', title: 'Ends', at: 1600000200000, gist: 'Ends asking.' }),
                ];
                for (_i = 0, reps_1 = reps; _i < reps_1.length; _i++) {
                    r = reps_1[_i];
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/meta.json"), JSON.stringify(r));
                    files.set("".concat(MEMORY, "/reports/").concat(r.id, "/report.md"), "".concat(r.gist, "\n\nShall I go on?\n"));
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _f.sent();
                _a = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^3$/ })];
            case 3:
                _a.apply(void 0, [_f.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^2$/ })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits', wait: false, origin: composer })];
            case 6:
                told = (_e = (_d = (_f.sent()).context) === null || _d === void 0 ? void 0 : _d.join('\n')) !== null && _e !== void 0 ? _e : '';
                expect(told).toContain('waiting on: (1) Ship the old one?');
                expect(told).toContain('waiting on: (2) Make it public?');
                expect(told).not.toContain('Delete the folder?');
                expect(told).not.toContain('Shall I go on?');
                return [2 /*return*/];
        }
    });
}); });
test('a report handed back asking the person something it never recorded as waiting is refused once, so its card can show it waits; one that recorded it, or asks only in code, goes through', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var handback, cases, _i, _a, _b, n, one, id, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make three videos', wait: false, origin: composer })];
            case 2:
                _f.sent();
                handback = function (agentId, message) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: "h-".concat(agentId), agentId: agentId, message: message })];
                        case 1: return [2 /*return*/, (_a.sent()).deny];
                    }
                }); }); };
                cases = [
                    // 18 Nov: the question was the report's first line, and nothing was recorded
                    { title: 'Three openings', message: 'Which opening should go out: A, B or C? Nothing is posted until you pick one.', refused: true },
                    { title: 'Life cycle', message: 'The picture is redrawn.\n\n**Waiting on you**\n- Yes or no to building it.', refused: true },
                    { title: 'Headed', message: 'Pushed.\n\n## Waiting on you\n- Yes or no to releasing it.', refused: true },
                    { title: 'Short', message: '1. Ship it to `main`?', refused: true },
                    { title: 'Recorded', message: 'Which opening should go out: A, B or C?', waits: ['Which opening should go out?'], refused: false },
                    { title: 'Nothing waits', message: 'Should the chat say more? It did not, so I left it.', waits: [], refused: false },
                    { title: 'Only code', message: 'The check `a?.b` and "Is it done?" are fixed. Pushed.', refused: false },
                    { title: 'Headings and tables', message: '## Why did it fail?\nIt timed out.\n\n| Passes? | Yes |\n\n    if (a ? b : c) return', refused: false },
                    // An agent with no waits tool is never told to call it
                    { title: 'Second look', message: 'Shall I look at the terminal too? I did not.', kind: 'claudopus:check', refused: false },
                ];
                _i = 0, _a = cases.entries();
                _f.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                _b = _a[_i], n = _b[0], one = _b[1];
                id = "a".concat(n + 1);
                return [4 /*yield*/, $.agent.spawn(__assign(__assign(__assign({}, spawn), { description: one.title, prompt: one.title }), (one.kind ? { subagentType: one.kind } : {})))];
            case 4:
                _f.sent();
                if (!one.waits) return [3 /*break*/, 6];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: "w-".concat(id), items: one.waits, agentId: id })];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6:
                _c = expect;
                _d = [one.title];
                return [4 /*yield*/, handback(id, one.message)];
            case 7:
                _c.apply(void 0, [_d.concat([_f.sent()])]).toEqual([one.title, one.refused ? expect.stringContaining('Not sent: your report asks') : undefined]);
                if (!one.refused) return [3 /*break*/, 9];
                _e = expect;
                return [4 /*yield*/, handback(id, one.message)];
            case 8:
                _e.apply(void 0, [_f.sent()]).toBeUndefined();
                _f.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10: return [2 /*return*/];
        }
    });
}); });
test('a result archived with one press leaves the list, its tab, the count and the note, waits on nothing, keeps its text, and comes back from the folded Archived row', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, closed, base, reps, _i, reps_2, r, pane, list, _b, _c, tab, _d, _e, _f, _g, _h, told, _j, _k, _l, _m, _o, _p, old, _q, _r, d, later, _s;
    var _this = this;
    var _t, _u, _v, _w, _x, _y, _z, _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
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
                _2.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _2.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 3:
                list = _2.sent();
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^3$/ })];
            case 4:
                _b.apply(void 0, [_2.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
            case 5:
                _c.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-b', surface: 'desktop' }))];
            case 6:
                tab = _2.sent();
                return [4 /*yield*/, pressed(tab, 'report-archive')];
            case 7:
                _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, closed.includes('report-b') || undefined];
                    }); }); })];
            case 8:
                _2.sent();
                expect(JSON.parse((_t = files.get("".concat(MEMORY, "/reports/b/meta.json"))) !== null && _t !== void 0 ? _t : '{}').archived).toBe(1700000000000);
                expect(files.get("".concat(MEMORY, "/reports/b/report.md"))).toBe('A bot wave.\n');
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^2$/ })];
                    }); }); })];
            case 9:
                _d.apply(void 0, [_2.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 10:
                _e.apply(void 0, [(_u = (_2.sent())) === null || _u === void 0 ? void 0 : _u.props.label]).toBe('Results 2');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '●' })];
            case 11:
                _f.apply(void 0, [_2.sent()]).toBeUndefined();
                // From its row: every round of that work goes
                return [4 /*yield*/, pressed(list, 'archive-a1')];
            case 12:
                // From its row: every round of that work goes
                _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/reports/a0/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived ? true : undefined)];
                    }); }); })];
            case 13:
                _2.sent();
                expect(JSON.parse((_v = files.get("".concat(MEMORY, "/reports/a1/meta.json"))) !== null && _v !== void 0 ? _v : '{}').archived).toBeDefined();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^1$/ })];
                    }); }); })];
            case 14:
                _g.apply(void 0, [_2.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, keyed(list, 'report-a1')];
            case 15:
                _h.apply(void 0, [_2.sent()]).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what is new', wait: false, origin: composer })];
            case 16:
                told = (_x = (_w = (_2.sent()).context) === null || _w === void 0 ? void 0 : _w.join('\n')) !== null && _x !== void 0 ? _x : '';
                expect(told).toContain('reports/c/report.md');
                expect(told).not.toContain('reports/b/');
                expect(told).not.toContain('reports/a1/');
                expect(told).not.toContain('Block them?');
                // The way back: one folded row, unfolded to each with Bring back
                _j = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 17:
                // The way back: one folded row, unfolded to each with Bring back
                _j.apply(void 0, [(_y = (_2.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('▸ Archived 2');
                _k = expect;
                return [4 /*yield*/, keyed(list, 'unarchive-b')];
            case 18:
                _k.apply(void 0, [_2.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(list, 'archived-fold')];
            case 19:
                _2.sent();
                _l = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 20:
                _l.apply(void 0, [(_z = (_2.sent())) === null || _z === void 0 ? void 0 : _z.props.label]).toBe('▾ Archived 2');
                return [4 /*yield*/, pressed(list, 'unarchive-b')];
            case 21:
                _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/reports/b/meta.json"))) !== null && _a !== void 0 ? _a : '{}').archived ? undefined : true)];
                    }); }); })];
            case 22:
                _2.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^Waiting for you$/ })];
                    }); }); })];
            case 23:
                _m.apply(void 0, [_2.sent()]).toBeDefined();
                _o = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^2$/ })];
            case 24:
                _o.apply(void 0, [_2.sent()]).toBeDefined();
                _p = expect;
                return [4 /*yield*/, keyed(list, 'archived-fold')];
            case 25:
                _p.apply(void 0, [(_0 = (_2.sent())) === null || _0 === void 0 ? void 0 : _0.props.label]).toBe('▾ Archived 1');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-a1', surface: 'desktop' }))];
            case 26:
                old = _2.sent();
                _q = expect;
                return [4 /*yield*/, keyed(old, 'report-archive')];
            case 27:
                _q.apply(void 0, [(_1 = (_2.sent())) === null || _1 === void 0 ? void 0 : _1.props.label]).toBe('Bring back');
                _r = expect;
                return [4 /*yield*/, old.find({ type: 'Text', text: /· archived$/ })];
            case 28:
                _r.apply(void 0, [_2.sent()]).toBeDefined();
                // One that came after the list was opened, archived and brought back, is listed in its place
                return [4 /*yield*/, pressed(pane, 'reports-open')];
            case 29:
                // One that came after the list was opened, archived and brought back, is listed in its place
                _2.sent();
                d = __assign(__assign({}, base), { id: 'd', title: 'Later', subject: 'Later', at: 1600000400000, gist: 'Came later.', agent: '' });
                files.set("".concat(MEMORY, "/reports/d/meta.json"), JSON.stringify(d));
                files.set("".concat(MEMORY, "/reports/d/report.md"), 'Came later.\n');
                return [4 /*yield*/, pressed(old, 'report-archive')];
            case 30:
                _2.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-d', surface: 'desktop' }))];
            case 31:
                later = _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(later, 'report-archive')];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.label) === 'Archive' ? true : undefined)];
                        }
                    }); }); })];
            case 32:
                _2.sent();
                return [4 /*yield*/, pressed(later, 'report-archive')];
            case 33:
                _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'unarchive-d')];
                    }); }); })];
            case 34:
                _2.sent();
                return [4 /*yield*/, pressed(list, 'unarchive-d')];
            case 35:
                _2.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'report-d')];
                    }); }); })];
            case 36:
                _s.apply(void 0, [_2.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('the results list is one line a row: what waits first, the five newest, the rest folded, rounds of one work as one row, archived and told as one', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                _b.apply(void 0, [(_p.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; })]).toEqual(['Results', 'Waiting for you', 'Newest']);
                _c = expect;
                return [4 /*yield*/, titles()];
            case 5:
                _c.apply(void 0, [_p.sent()]).toEqual(['Video third cut', 'Panel change 0', 'Panel change 1', 'Panel change 2', 'Panel change 3', 'Panel change 4']);
                // Nothing under a title: no finding, no subject, no line saying it waits, no mark; the time, Archive
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /long line|waiting on you|Claude workflow/ })];
            case 6:
                // Nothing under a title: no finding, no subject, no line saying it waits, no mark; the time, Archive
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
                expect(heights).toEqual([1, 1, 1, 1, 1, 1]);
                // The rest is one row that unfolds
                _f = expect;
                return [4 /*yield*/, keyed(list, 'earlier-fold')];
            case 9:
                // The rest is one row that unfolds
                _f.apply(void 0, [(_k = (_p.sent())) === null || _k === void 0 ? void 0 : _k.props.label]).toBe('▸ Earlier 4');
                return [4 /*yield*/, pressed(list, 'earlier-fold')];
            case 10:
                _p.sent();
                _g = expect;
                return [4 /*yield*/, titles()];
            case 11:
                _g.apply(void 0, [(_p.sent()).slice(6)]).toEqual(['Panel change 5', 'Panel change 6', 'Panel change 7', 'Old-chat index: second']);
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits', wait: false, origin: composer })];
            case 12:
                told = (_m = (_l = (_p.sent()).context) === null || _l === void 0 ? void 0 : _l.join('\n')) !== null && _m !== void 0 ? _m : '';
                expect(told).toContain('Keep the third cut?');
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
    var _a, files, clock, opened, base, put, list, keys, first, _b, _c, after, _d, _e, tab, _f, tabKeys, _g, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
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
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Results', bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _j.sent();
                keys = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return String(one.key); })];
                    }
                }); }); };
                return [4 /*yield*/, keys()];
            case 3:
                first = _j.sent();
                expect(first.some(function (key) { return /^report-bucket-\d+$/.test(key); })).toBe(true);
                // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
                return [4 /*yield*/, clock.advance(5000)];
            case 4:
                // Drawn again with nothing changed: the same keys, so the handles the app holds stay good
                _j.sent();
                _b = expect;
                return [4 /*yield*/, keys()];
            case 5:
                _b.apply(void 0, [_j.sent()]).toEqual(first);
                // A result arriving from another chat changes the drawing: no key stays, so the app takes every button afresh
                put({ id: 'fresh', title: 'Something new', at: 1700000000000 });
                // (a search of the memory reads the results again, as the panel's own look does)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'found' })];
            case 6:
                // (a search of the memory reads the results again, as the panel's own look does)
                _j.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return /^report-fresh-\d+$/.test(String(one.key)); }) || undefined)];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, keys()];
            case 8:
                after = _j.sent();
                expect(after.filter(function (key) { return first.includes(key); })).toEqual([]);
                // and a press on either named result opens it, drawn
                return [4 /*yield*/, pressed(list, 'report-bucket')];
            case 9:
                // and a press on either named result opens it, drawn
                _j.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('report-bucket') || undefined];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, pressed(list, 'report-header')];
            case 11:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('report-header') || undefined];
                    }); }); })];
            case 12:
                _e.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'report-header', props: __assign(__assign({}, LIST.props), { title: 'Rethink the panel header', bodyColumns: 80 }), surface: 'desktop' }))];
            case 13:
                tab = _j.sent();
                _f = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Rethink the panel header$/ })];
            case 14:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 15:
                tabKeys = (_j.sent()).map(function (one) { return String(one.key); });
                // The result's own tab follows the same rule: answered on another Mac, it changes with no press here, and every key moves
                put({ id: 'header', title: 'Rethink the panel header', at: 1699000100000, waiting: [{ text: 'Reopen the M4 chat?', answer: 'Not now' }] });
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't2', query: 'found' })];
            case 16:
                _j.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tab.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one.props.label === 'Yes'; }) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _g.apply(void 0, [_j.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 18:
                _h.apply(void 0, [(_j.sent()).map(function (one) { return String(one.key); }).filter(function (key) { return tabKeys.includes(key); })]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("what a result waits on is answered however the person answers it, and only that: the ask on its card it repeats, a newer result of its work, the chat by number, their message by number", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, metaOf, answers, reportOf, base, _b, fix, box, _c, _d, _e, _f, _g, _, e_1_1, guide, _h, _j, _k, _, e_2_1, _l, second, _m, told, marked, line, _o, _p, after;
    var _this = this;
    var _q, e_1, _r, _s, _t, e_2, _u, _v;
    var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
    return __generator(this, function (_8) {
        switch (_8.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                metaOf = function (id) { var _a; return JSON.parse((_a = files.get("".concat(MEMORY, "/reports/").concat(id, "/meta.json"))) !== null && _a !== void 0 ? _a : '{}'); };
                answers = function (id) { var _a; return (_a = metaOf(id).waiting) === null || _a === void 0 ? void 0 : _a.map(function (one) { var _a; return [one.text, (_a = one.answer) !== null && _a !== void 0 ? _a : '']; }); };
                reportOf = function (slugged_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([slugged_1], args_1, true), void 0, function (slugged, after) {
                        var _this = this;
                        var _a, _b;
                        if (after === void 0) { after = ''; }
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, __spreadArray([], files.keys(), true).filter(function (one) { return new RegExp("reports/\\d{8}-\\d{4}-".concat(slugged, "[^/]*/meta\\.json$")).test(one); }).find(function (one) { return one !== after; })];
                                    }); }); })];
                                case 1: return [2 /*return*/, (_b = ((_a = (_c.sent())) !== null && _a !== void 0 ? _a : '').split('/').at(-2)) !== null && _b !== void 0 ? _b : ''];
                            }
                        });
                    });
                };
                base = { subject: 'S', chat: 'c', chatId: 'c', folder: '/repo', files: [], agent: '', gist: 'Three things.' };
                files.set("".concat(MEMORY, "/reports/three/meta.json"), JSON.stringify(__assign(__assign({}, base), { id: 'three', title: 'Three', at: 1600000100000, waiting: [{ text: 'Delete the folder?' }, { text: 'Make it public?' }, { text: 'Rename it to "Shared"?' }] })));
                files.set("".concat(MEMORY, "/reports/three/report.md"), 'Three things.\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _8.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'release it', wait: false, origin: composer })
                    // 16 Nov: the work asked on its card and recorded the same go-ahead as waiting a moment later, in other words, marked as that ask
                ];
            case 2:
                _8.sent();
                // 16 Nov: the work asked on its card and recorded the same go-ahead as waiting a moment later, in other words, marked as that ask
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Waits fix', prompt: 'build it' }))];
            case 3:
                // 16 Nov: the work asked on its card and recorded the same go-ahead as waiting a moment later, in other words, marked as that ask
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release 0.2.168?' })];
            case 4:
                _8.sent();
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a1', items: [{ text: 'Release 0.2.168 with the waits fix?', asked: true }, 'Shall I redraw its icon?'] })];
            case 5:
                _b.apply(void 0, [(_8.sent()).result]).toContain('One is the question on your card');
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: 'Built the waits fix.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
                    // The same line as its ask is that ask's without the mark; a question that only shares its words is another question
                ];
            case 6:
                _8.sent();
                // The same line as its ask is that ask's without the mark; a question that only shares its words is another question
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Key box', prompt: 'build it' }))];
            case 7:
                // The same line as its ask is that ask's without the mark; a question that only shares its words is another question
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release the new key box?' })];
            case 8:
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', agentId: 'a2', items: ['release the new key box', 'Should the new key box replace the old one in Settings?'] })];
            case 9:
                _8.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a2', answer: 'Built the key box.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 10:
                _8.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 11:
                _8.sent();
                return [4 /*yield*/, reportOf('waits-fix')];
            case 12:
                fix = _8.sent();
                return [4 /*yield*/, reportOf('key-box')
                    // The person answers each ask in the chat: exactly the item tied to it is answered
                ];
            case 13:
                box = _8.sent();
                // The person answers each ask in the chat: exactly the item tied to it is answered
                return [4 /*yield*/, $.prompt.submit({ text: 'yes, release both', wait: false, origin: composer })];
            case 14:
                // The person answers each ask in the chat: exactly the item tied to it is answered
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “yes, release both”' })];
            case 15:
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a2', message: 'Sam: “yes, release both”' })];
            case 16:
                _8.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = (_a = metaOf(fix).waiting) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.answer];
                    }); }); })];
            case 17:
                _c.apply(void 0, [_8.sent()]).toBe('In your words');
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = (_a = metaOf(box).waiting) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.answer];
                    }); }); })];
            case 18:
                _d.apply(void 0, [_8.sent()]).toBe('In your words');
                return [4 /*yield*/, clock.advance(10)];
            case 19:
                _8.sent();
                expect((_w = answers(fix)) === null || _w === void 0 ? void 0 : _w[1]).toEqual(['Shall I redraw its icon?', '']);
                expect((_x = answers(box)) === null || _x === void 0 ? void 0 : _x[1]).toEqual(['Should the new key box replace the old one in Settings?', '']);
                // A newer result of a round that never said what waits leaves what the earlier one waited on
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2b', to: 'a2', message: 'Sam: “and a short guide”' })];
            case 20:
                // A newer result of a round that never said what waits leaves what the earlier one waited on
                _8.sent();
                _8.label = 21;
            case 21:
                _8.trys.push([21, 26, 27, 32]);
                _e = true, _f = __asyncValues($.turn.step({ turnId: 't2b', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' }));
                _8.label = 22;
            case 22: return [4 /*yield*/, _f.next()];
            case 23:
                if (!(_g = _8.sent(), _q = _g.done, !_q)) return [3 /*break*/, 25];
                _s = _g.value;
                _e = false;
                _ = _s;
                void _;
                _8.label = 24;
            case 24:
                _e = true;
                return [3 /*break*/, 22];
            case 25: return [3 /*break*/, 32];
            case 26:
                e_1_1 = _8.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 32];
            case 27:
                _8.trys.push([27, , 30, 31]);
                if (!(!_e && !_q && (_r = _f.return))) return [3 /*break*/, 29];
                return [4 /*yield*/, _r.call(_f)];
            case 28:
                _8.sent();
                _8.label = 29;
            case 29: return [3 /*break*/, 31];
            case 30:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 31: return [7 /*endfinally*/];
            case 32: return [4 /*yield*/, $.turn.complete({ agentId: 'a2', answer: "The guide is written.\n\n".concat('Each step is in the guide. '.repeat(30)), durationMs: 1, isAborted: false, turnId: 't2b', reason: 'answer' })];
            case 33:
                _8.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 34:
                _8.sent();
                return [4 /*yield*/, reportOf('key-box', "".concat(MEMORY, "/reports/").concat(box, "/meta.json"))];
            case 35:
                guide = _8.sent();
                expect(answers(guide)).toEqual([['Should the new key box replace the old one in Settings?', '']]);
                expect((_y = answers(box)) === null || _y === void 0 ? void 0 : _y[1]).toEqual(['Should the new key box replace the old one in Settings?', 'Moved']);
                // Started again, the work lists what waits now: its newer result takes the place of what the earlier one waited on. A question
                // marked as the card's, with no ask open now, is tied to no older ask, answered or not
                return [4 /*yield*/, $.prompt.submit({ text: 'add a dark mode too', wait: false, origin: composer })];
            case 36:
                // Started again, the work lists what waits now: its newer result takes the place of what the earlier one waited on. A question
                // marked as the card's, with no ask open now, is tied to no older ask, answered or not
                _8.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a1', message: 'Sam: “add a dark mode too”' })];
            case 37:
                _8.sent();
                _8.label = 38;
            case 38:
                _8.trys.push([38, 43, 44, 49]);
                _h = true, _j = __asyncValues($.turn.step({ turnId: 't3', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _8.label = 39;
            case 39: return [4 /*yield*/, _j.next()];
            case 40:
                if (!(_k = _8.sent(), _t = _k.done, !_t)) return [3 /*break*/, 42];
                _v = _k.value;
                _h = false;
                _ = _v;
                void _;
                _8.label = 41;
            case 41:
                _h = true;
                return [3 /*break*/, 39];
            case 42: return [3 /*break*/, 49];
            case 43:
                e_2_1 = _8.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 49];
            case 44:
                _8.trys.push([44, , 47, 48]);
                if (!(!_h && !_t && (_u = _j.return))) return [3 /*break*/, 46];
                return [4 /*yield*/, _u.call(_j)];
            case 45:
                _8.sent();
                _8.label = 46;
            case 46: return [3 /*break*/, 48];
            case 47:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 48: return [7 /*endfinally*/];
            case 49:
                _l = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w3', agentId: 'a1', items: ['Shall I turn the dark mode on for everyone?', { text: 'Release 0.2.168 to everyone?', asked: true }] })];
            case 50:
                _l.apply(void 0, [(_8.sent()).result]).toContain('replaces what your earlier results waited on');
                expect((_z = answers(fix)) === null || _z === void 0 ? void 0 : _z[1]).toEqual(['Shall I redraw its icon?', '']);
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: 'Added a dark mode.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })];
            case 51:
                _8.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 52:
                _8.sent();
                return [4 /*yield*/, reportOf('waits-fix', "".concat(MEMORY, "/reports/").concat(fix, "/meta.json"))];
            case 53:
                second = _8.sent();
                expect(answers(second)).toEqual([['Shall I turn the dark mode on for everyone?', ''], ['Release 0.2.168 to everyone?', '']]);
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = (_a = metaOf(fix).waiting) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.answer];
                    }); }); })];
            case 54:
                _m.apply(void 0, [_8.sent()]).toBe('Replaced');
                return [4 /*yield*/, $.prompt.submit({ text: 'delete it, and the name is fine', wait: false, origin: composer })];
            case 55:
                told = (_1 = (_0 = (_8.sent()).context) === null || _0 === void 0 ? void 0 : _0.join('\n')) !== null && _1 !== void 0 ? _1 : '';
                expect(told).toContain('waiting on: (1) Delete the folder? (2) Make it public? (3) Rename it to "Shared"?');
                expect(told).toContain('the numbers of the questions they answered as `answered`');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w5', result: "".concat(MEMORY, "/reports/three/report.md"), answered: [1, 3, 7] })];
            case 56:
                marked = (_8.sent()).result;
                expect(marked).toBe('"Three": 2 answered in the person\'s words; still waiting: (2) Make it public? Not an open question there, so not marked: 7.');
                expect(answers('three')).toEqual([['Delete the folder?', 'In your words'], ['Make it public?', ''], ['Rename it to "Shared"?', 'In your words']]);
                line = "About question 2 of the result \"Three\" (14 Sep 2020, 12:28), ".concat(MEMORY, "/reports/three/report.md: ");
                return [4 /*yield*/, $.prompt.submit({ text: line, wait: false, origin: composer })];
            case 57:
                _8.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 58:
                _8.sent();
                expect((_3 = (_2 = metaOf('three').waiting) === null || _2 === void 0 ? void 0 : _2[1]) === null || _3 === void 0 ? void 0 : _3.answer).toBeUndefined();
                // One message may carry lines for several results: each counts only within its own part
                return [4 /*yield*/, $.prompt.submit({ text: "About question 1 of the result \"Waits fix\" (15 Nov, 02:13), ".concat(MEMORY, "/reports/").concat(second, "/report.md: yes\n").concat(line, "not yet"), wait: false, origin: composer })];
            case 59:
                // One message may carry lines for several results: each counts only within its own part
                _8.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = (_a = metaOf('three').waiting) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.answer];
                    }); }); })];
            case 60:
                _o.apply(void 0, [_8.sent()]).toBe('In your words');
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = (_a = metaOf(second).waiting) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.answer];
                    }); }); })];
            case 61:
                _p.apply(void 0, [_8.sent()]).toBe('In your words');
                expect((_5 = (_4 = metaOf(second).waiting) === null || _4 === void 0 ? void 0 : _4[1]) === null || _5 === void 0 ? void 0 : _5.answer).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits now', wait: false, origin: composer })];
            case 62:
                after = (_7 = (_6 = (_8.sent()).context) === null || _6 === void 0 ? void 0 : _6.join('\n')) !== null && _7 !== void 0 ? _7 : '';
                expect(after).toContain('waiting on: (2) Release 0.2.168 to everyone?');
                expect(after).toContain('waiting on: (1) Should the new key box replace the old one in Settings?');
                expect(after).not.toContain('Make it public?');
                expect(after).not.toContain('redraw its icon');
                return [2 /*return*/];
        }
    });
}); });
test('an answer taken back from the card opens again the question its work recorded for it; words that are none of its buttons answer it, and it goes on to its result answered', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, appended, list, labels, press, _b, _c, _d, _e, _f, _g, _, e_3_1, path, waiting;
    var _this = this;
    var _h, e_3, _j, _k;
    var _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Make the banner', prompt: 'banner' }))];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _m.sent();
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
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent()).find(function (b) { return String(b.props.label) === label; })) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])
                                // Recorded as the card's question before the work asks it: tied to the ask once it comes
                            ];
                        }
                    });
                }); };
                // Recorded as the card's question before the work asks it: tied to the ask once it comes
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a1', items: [{ text: 'Shall I use banner 5 on your page?', asked: true }, 'Shall I make the banner taller?'] })];
            case 4:
                // Recorded as the card's question before the work asks it: tied to the ask once it comes
                _m.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Use banner 5 on your page?', choices: ['Use it', 'Not now'] })];
            case 5:
                _m.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Use it') ? true : undefined)];
                        }
                    }); }); })];
            case 6:
                _b.apply(void 0, [_m.sent()]).toBe(true);
                return [4 /*yield*/, press('Use it')];
            case 7:
                _m.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('↶ Take back “Use it”') ? true : undefined)];
                        }
                    }); }); })];
            case 8:
                _c.apply(void 0, [_m.sent()]).toBe(true);
                return [4 /*yield*/, press('↶ Take back “Use it”')];
            case 9:
                _m.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('took back their answer "Use it"'); })];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_m.sent()]).toBeDefined();
                // Back on the card, the ask is answered in words that are none of its buttons: it stays while the work acts on them, and the
                // question its work recorded for it is answered in their words, also once the work clears the ask
                return [4 /*yield*/, $.prompt.submit({ text: 'only once it is bigger', wait: false, origin: composer })];
            case 11:
                // Back on the card, the ask is answered in words that are none of its buttons: it stays while the work acts on them, and the
                // question its work recorded for it is answered in their words, also once the work clears the ask
                _m.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “only once it is bigger”' })];
            case 12:
                _m.sent();
                _m.label = 13;
            case 13:
                _m.trys.push([13, 18, 19, 24]);
                _e = true, _f = __asyncValues($.turn.step({ turnId: 't1', index: 1, model: 'claude-opus-5-5', messageCount: 3, agentId: 'a1' }));
                _m.label = 14;
            case 14: return [4 /*yield*/, _f.next()];
            case 15:
                if (!(_g = _m.sent(), _h = _g.done, !_h)) return [3 /*break*/, 17];
                _k = _g.value;
                _e = false;
                _ = _k;
                void _;
                _m.label = 16;
            case 16:
                _e = true;
                return [3 /*break*/, 14];
            case 17: return [3 /*break*/, 24];
            case 18:
                e_3_1 = _m.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 24];
            case 19:
                _m.trys.push([19, , 22, 23]);
                if (!(!_e && !_h && (_j = _f.return))) return [3 /*break*/, 21];
                return [4 /*yield*/, _j.call(_f)];
            case 20:
                _m.sent();
                _m.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 23: return [7 /*endfinally*/];
            case 24: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })];
            case 25:
                _m.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: 'The banner is ready.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 26:
                _m.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 27:
                _m.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (one) { return /reports\/\d{8}-\d{4}-make-the-banner\/meta\.json$/.test(one); })];
                    }); }); })];
            case 28:
                path = _m.sent();
                waiting = JSON.parse((_l = files.get(path !== null && path !== void 0 ? path : '')) !== null && _l !== void 0 ? _l : '{}').waiting;
                expect(waiting === null || waiting === void 0 ? void 0 : waiting.map(function (one) { var _a; return [one.text, (_a = one.answer) !== null && _a !== void 0 ? _a : '']; })).toEqual([['Shall I use banner 5 on your page?', 'In your words'], ['Shall I make the banner taller?', '']]);
                return [4 /*yield*/, list.unmount()];
            case 29:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); });
test("every question of a result can be answered in words beside its own answers or Yes and No; Not now and No stay in view with what was said", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, opened, filled, items, _b, path, id, list, one, labels, _c, _d, _e, _f, line, _g, _h, _j;
    var _this = this;
    var _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, opened = _a.opened;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'plan the coupon move', wait: false, origin: composer })];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Coupon move', prompt: 'plan the coupon move' }))];
            case 3:
                _m.sent();
                items = ['Should Claude use Muse or Gemini?', { text: 'Should the 11 codes be settled by hand, or left behind?', choices: ['By hand', 'Leave them', 'Not now'] }, 'Which page is the complaint about?', 'Shall I release it?', { text: 'Shall I ship it?', choices: [] }, { text: 'Shall I tag it?', choices: ['Not now'] }];
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a1', items: items })];
            case 4:
                _b.apply(void 0, [(_m.sent()).result]).toContain('Recorded 6');
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: 'The move is planned.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 5:
                _m.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                _m.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (one) { return /reports\/\d{8}-\d{4}-coupon-move\/meta\.json$/.test(one); })];
                    }); }); })];
            case 7:
                path = _m.sent();
                id = (_k = (path !== null && path !== void 0 ? path : '').split('/').at(-2)) !== null && _k !== void 0 ? _k : '';
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 8:
                list = _m.sent();
                return [4 /*yield*/, pressed(list, "report-".concat(id))];
            case 9:
                _m.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes("report-".concat(id)) || undefined];
                    }); }); })];
            case 10:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: "report-".concat(id), props: __assign(__assign({}, LIST.props), { title: 'Coupon move', bodyColumns: 80 }), surface: 'desktop' }))];
            case 11:
                one = _m.sent();
                labels = function (index) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, one.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { var _a; return new RegExp("^report-say-".concat(index, "-")).test((_a = b.key) !== null && _a !== void 0 ? _a : ''); }).map(function (b) { return b.props.label; })];
                    }
                }); }); };
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels(0)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? labels(0) : undefined)];
                        }
                    }); }); })];
            case 12:
                _c.apply(void 0, [_m.sent()]).toEqual(['Yes', 'No', 'Not now', 'Answer in words']);
                _d = expect;
                return [4 /*yield*/, labels(1)];
            case 13:
                _d.apply(void 0, [_m.sent()]).toEqual(['By hand', 'Leave them', 'Not now', 'Answer in words']);
                // No answers of its own named is a yes-or-no question
                _e = expect;
                return [4 /*yield*/, labels(4)];
            case 14:
                // No answers of its own named is a yes-or-no question
                _e.apply(void 0, [_m.sent()]).toEqual(['Yes', 'No', 'Not now', 'Answer in words']);
                _f = expect;
                return [4 /*yield*/, labels(5)];
            case 15:
                _f.apply(void 0, [_m.sent()]).toEqual(['Yes', 'No', 'Not now', 'Answer in words']);
                // Answer in words puts a line naming it by its number in the chat's box; sent with the person's words, it answers it
                return [4 /*yield*/, pressed(one, 'report-say-2-Answer in words')];
            case 16:
                // Answer in words puts a line naming it by its number in the chat's box; sent with the person's words, it answers it
                _m.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, filled.find(function (text) { return text.includes('About question 3 of the result'); })];
                    }); }); })];
            case 17:
                line = (_l = (_m.sent())) !== null && _l !== void 0 ? _l : '';
                expect(line).toContain("".concat(MEMORY, "/reports/").concat(id, "/report.md"));
                return [4 /*yield*/, $.prompt.submit({ text: "".concat(line, "the pricing page"), wait: false, origin: composer })];
            case 18:
                _m.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, one.find({ type: 'Text', text: 'Which page is the complaint about? · you answered in words' })];
                    }); }); })];
            case 19:
                _g.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(one, 'report-say-3-Not now')];
            case 20:
                _m.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, one.find({ type: 'Text', text: 'Shall I release it? · you pressed Not now' })];
                    }); }); })];
            case 21:
                _h.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(one, 'report-say-0-No')];
            case 22:
                _m.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, one.find({ type: 'Text', text: 'Should Claude use Muse or Gemini? · you answered “No”' })];
                    }); }); })];
            case 23:
                _j.apply(void 0, [_m.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
