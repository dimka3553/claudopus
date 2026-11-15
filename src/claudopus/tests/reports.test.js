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
    var _a, files, submitted, clock, copied, opened, filled, _b, report, _c, metaPath, folder, meta, pane, _d, _e, _f, _g, list, _h, _j, _k, _l, _m, _o, _p, id, one, heads, _q, _r, _s, _t, _u, _v, _w, _x, next, _y, _z;
    var _this = this;
    var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
    return __generator(this, function (_10) {
        switch (_10.label) {
            case 0:
                _a = world(on), files = _a.files, submitted = _a.submitted, clock = _a.clock, copied = _a.copied, opened = _a.opened;
                filled = [];
                on('prompt.fill', function (_, e) { return (filled.push(e.text), { isFilled: true }); });
                files.set('/private/tmp/s/scratchpad/revenue.png', 'PNG');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _10.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'how is revenue doing', wait: false, origin: composer })];
            case 2:
                _10.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Weekly revenue', prompt: 'how is revenue doing' }))
                    // A helper's answer is no report
                ];
            case 3:
                _10.sent();
                // A helper's answer is no report
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count invoices', prompt: 'count', parentAgentId: 'a1' })
                    // A helper records nothing over the work it answers to
                ];
            case 4:
                // A helper's answer is no report
                _10.sent();
                // A helper records nothing over the work it answers to
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', items: ['Count again?'], agentId: 'a2' })];
            case 5:
                // A helper records nothing over the work it answers to
                _b.apply(void 0, [(_10.sent()).result]).toContain('A helper records nothing');
                return [4 /*yield*/, $.turn.complete({ agentId: 'a2', answer: 'There are 12 invoices.', durationMs: 1, isAborted: false, turnId: 't0', reason: 'answer' })];
            case 6:
                _10.sent();
                report = 'Revenue rose 12% this week to $4,210.\n\nThe chart: /private/tmp/s/scratchpad/revenue.png\n\nNot done:\n- Sending it to the team needs your go-ahead.\n- The refunds are not checked.';
                // What waits on the person is what the work recorded, wherever it is in the report, not its last line
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', items: ['Shall I send it to the team?', 'Post it in the channel too?'], agentId: 'a1' })];
            case 7:
                // What waits on the person is what the work recorded, wherever it is in the report, not its last line
                _c.apply(void 0, [(_10.sent()).result]).toContain('Recorded 2');
                // A helper records nothing over the work it answers to
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })];
            case 8:
                // A helper records nothing over the work it answers to
                _10.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 9:
                _10.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (path) { return path.startsWith("".concat(MEMORY, "/reports/")) && path.endsWith('/meta.json'); })];
                    }); }); })];
            case 10:
                metaPath = _10.sent();
                folder = (metaPath !== null && metaPath !== void 0 ? metaPath : '').replace('/meta.json', '');
                expect(folder).toMatch(/reports\/\d{8}-\d{4}-weekly-revenue$/);
                expect(files.get("".concat(folder, "/report.md"))).toBe("".concat(report, "\n"));
                expect(copied).toEqual(["".concat(folder, "/revenue.png")]);
                meta = JSON.parse((_0 = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _0 !== void 0 ? _0 : '{}');
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
                _10.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The rule is saved.', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer' })];
            case 12:
                _10.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 13:
                _10.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                // The same report again is not kept twice
                return [4 /*yield*/, $.turn.complete({ agentId: 'a1', answer: report, durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer' })];
            case 14:
                // The same report again is not kept twice
                _10.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 15:
                _10.sent();
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/meta.json'); })).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                ];
            case 16:
                pane = _10.sent();
                // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 17:
                // On the Claudopus pane the reports are one small button, with no mark: the list's first group says what waits
                _d.apply(void 0, [_10.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'reports-open')];
            case 18:
                _e.apply(void 0, [(_1 = (_10.sent())) === null || _1 === void 0 ? void 0 : _1.props.label]).toBe('Results 1');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^●$/ })];
            case 19:
                _f.apply(void 0, [_10.sent()]).toBeUndefined();
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                return [4 /*yield*/, pressed(pane, 'reports-open')];
            case 20:
                // Pressed, it opens the list as a pane of its own; the Claudopus pane stays as it was
                _10.sent();
                expect(opened).toContain('reports');
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Results$/ })];
            case 21:
                _g.apply(void 0, [_10.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'reports', props: __assign(__assign({}, LIST.props), { title: 'Reports', bodyColumns: 80 }), surface: 'desktop' }))];
            case 22:
                list = _10.sent();
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Results$/ })];
            case 23:
                _h.apply(void 0, [(_2 = (_10.sent())) === null || _2 === void 0 ? void 0 : _2.props.bold]).toBe(true);
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
            case 24:
                _j.apply(void 0, [(_3 = (_10.sent())) === null || _3 === void 0 ? void 0 : _3.props.bold]).toBe(true);
                // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
                _k = expect;
                return [4 /*yield*/, keyed(list, "report-".concat(folder.split('/').pop()))];
            case 25:
                // One line a row: its title, when, and Archive; nothing under it, and no mark: its group says it waits
                _k.apply(void 0, [(_4 = (_10.sent())) === null || _4 === void 0 ? void 0 : _4.props.label]).toBe('Weekly revenue');
                _l = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^\d\d:\d\d$/ })];
            case 26:
                _l.apply(void 0, [_10.sent()]).toBeDefined();
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^●$/ })];
            case 27:
                _m.apply(void 0, [_10.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Revenue rose/ })];
            case 28:
                _o.apply(void 0, [_10.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, keyed(list, "archive-".concat(folder.split('/').pop()))];
            case 29:
                _p.apply(void 0, [(_5 = (_10.sent())) === null || _5 === void 0 ? void 0 : _5.props.label]).toBe('Archive');
                // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
                return [4 /*yield*/, pressed(list, "report-".concat(folder.split('/').pop()))];
            case 30:
                // A report opens as a pane of its own, named after it: the question first, then the finding, the pictures, the report, carry on
                _10.sent();
                id = "report-".concat(folder.split('/').pop());
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes(id) || undefined];
                    }); }); })];
            case 31:
                _10.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: id, props: __assign(__assign({}, LIST.props), { title: 'Weekly revenue', bodyColumns: 80 }), surface: 'desktop' }))];
            case 32:
                one = _10.sent();
                return [4 /*yield*/, one.findAll({ type: 'Text' })];
            case 33:
                heads = (_10.sent()).filter(function (text) { return text.props.bold; }).map(function (text) { return text.text; });
                expect(heads).toEqual(['Weekly revenue', 'Waiting on you', 'Finding', 'Pictures', 'In full', 'Carry on']);
                _q = expect;
                return [4 /*yield*/, one.find({ type: 'Markdown', text: /Revenue rose 12%/ })];
            case 34:
                _q.apply(void 0, [(_6 = (_10.sent())) === null || _6 === void 0 ? void 0 : _6.props.text]).toBe("".concat(report, "\n"));
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _r = expect;
                return [4 /*yield*/, keyed(one, 'report-page')];
            case 35:
                // Its picture is shown in the pane, never handed to another app: where it cannot be drawn, its path is given as text
                _r.apply(void 0, [_10.sent()]).toBeUndefined();
                _s = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: "".concat(folder, "/revenue.png") })];
            case 36:
                _s.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(one, 'report-carry')];
            case 37:
                _10.sent();
                expect(filled[0]).toContain("".concat(folder, "/report.md"));
                // Each waiting item has its own answers; answering one clears that one alone
                _t = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: 'Post it in the channel too?' })];
            case 38:
                // Each waiting item has its own answers; answering one clears that one alone
                _t.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(one, 'report-say-0-Yes')];
            case 39:
                _10.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.length > 0 || undefined];
                    }); }); })];
            case 40:
                _10.sent();
                expect(submitted[0]).toContain('From the Claudopus panel: The person pressed "Yes" in answer to what the result "Weekly revenue"');
                expect(submitted[0]).not.toMatch(/\b(me|my)\b/);
                expect(submitted[0]).toContain('Shall I send it to the team?');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                        return [2 /*return*/, (((_c = (_b = JSON.parse((_a = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _a !== void 0 ? _a : '{}').waiting) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.answer) ? true : undefined)];
                    }); }); })];
            case 41:
                _10.sent();
                expect(JSON.parse((_7 = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _7 !== void 0 ? _7 : '{}').waiting).toEqual([{ text: 'Shall I send it to the team?', answer: 'Yes' }, { text: 'Post it in the channel too?' }]);
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
            case 42:
                _u.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, one.find({ type: 'Text', text: 'Shall I send it to the team?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 43:
                _10.sent();
                _v = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: 'Post it in the channel too?' })];
            case 44:
                _v.apply(void 0, [_10.sent()]).toBeDefined();
                // Not now clears the other and sends nothing
                return [4 /*yield*/, pressed(one, 'report-say-1-Not now')];
            case 45:
                // Not now clears the other and sends nothing
                _10.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                        return [2 /*return*/, (((_c = (_b = JSON.parse((_a = files.get(metaPath !== null && metaPath !== void 0 ? metaPath : '')) !== null && _a !== void 0 ? _a : '{}').waiting) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.answer) ? true : undefined)];
                    }); }); })];
            case 46:
                _10.sent();
                expect(submitted).toHaveLength(1);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 47:
                _10.sent();
                _w = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
            case 48:
                _w.apply(void 0, [_10.sent()]).toBeUndefined();
                _x = expect;
                return [4 /*yield*/, one.find({ type: 'Text', text: /^Waiting on you$/ })];
            case 49:
                _x.apply(void 0, [_10.sent()]).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what was revenue again', wait: false, origin: composer })];
            case 50:
                next = _10.sent();
                expect((_8 = next.context) === null || _8 === void 0 ? void 0 : _8.join('\n')).toContain('Results kept');
                expect((_9 = next.context) === null || _9 === void 0 ? void 0 : _9.join('\n')).toContain("".concat(folder, "/report.md"));
                _y = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: "".concat(folder, "/report.md") })];
            case 51:
                _y.apply(void 0, [(_10.sent()).deny]).toBeUndefined();
                _z = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r2', command: "cat ".concat(folder, "/report.md") })];
            case 52:
                _z.apply(void 0, [(_10.sent()).deny]).toContain('Start a fresh agent');
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
                expect(kin.some(function (label) { return label.includes('Revenue · this started from it'); })).toBe(true);
                expect(kin.some(function (label) { return label.includes('Revenue again · earlier round'); })).toBe(true);
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
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^2$/ })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'what waits', wait: false, origin: composer })];
            case 6:
                told = (_e = (_d = (_f.sent()).context) === null || _d === void 0 ? void 0 : _d.join('\n')) !== null && _e !== void 0 ? _e : '';
                expect(told).toContain('waits on: Ship the old one?');
                expect(told).toContain('waits on: Make it public?');
                expect(told).not.toContain('Delete the folder?');
                expect(told).not.toContain('Shall I go on?');
                return [2 /*return*/];
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
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
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
                        return [2 /*return*/, list.find({ type: 'Text', text: /^Waiting on you$/ })];
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
                _b.apply(void 0, [(_p.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; })]).toEqual(['Results', 'Waiting on you', 'Recent']);
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
                expect(kin.some(function (label) { return label.includes('Video second cut · this started from it'); })).toBe(true);
                expect(kin.some(function (label) { return label.includes('Explainer video · earlier round'); })).toBe(true);
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
