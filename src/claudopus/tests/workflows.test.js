// Workflows: the blue card
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
var _this = this;
// A workflow as its script's meta names it: two stages, the maker's and the checker's
var ROUNDS = "export const meta = {\n  name: 'rounds',\n  description: 'A maker builds it, a separate checker holds it to the bar',\n  phases: [\n    { title: 'Make', detail: 'the maker builds it', model: 'opus' },\n    { title: 'Check', detail: 'the checker tests it against the bar', model: 'opus' },\n  ],\n}\nphase('Make')";
var journal = function () {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    return lines.map(function (one) { return JSON.stringify(one); }).join('\n');
};
test('a workflow the chat starts is one blue card: how many agents, its rounds as squares with the step being run, the last round checked, nothing cut at any width, and Details with each round and agent chat; ended, it is under Finished', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, tabs, clock, played, notified, call, _b, _c, _d, _, e_1_1, pane, _e, _f, _g, _h, _j, _k, alts, first, _l, _m, _o, _p, _q, narrow, _r, words, _s, _t, _u, tab, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, octopus, _11, _12, _13, _14, _15;
    var _this = this;
    var _16, e_1, _17, _18;
    var _19, _20, _21, _22;
    return __generator(this, function (_23) {
        switch (_23.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'], art: true }), files = _a.files, tabs = _a.tabs, clock = _a.clock, played = _a.played, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _23.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the roman numerals right', wait: false, origin: composer })
                    // The chat's own thread starts it: a workflow is delegation, as an agent is
                ];
            case 2:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Workflow', tool_use_id: 'w1', script: ROUNDS, args: { title: 'Roman numerals', task: 'Write to_roman.', bar: 'Every case holds.', folder: '/repo', cap: 3 } })];
            case 3:
                call = _23.sent();
                expect(call.deny).toBeUndefined();
                // Its agents belong to its card, each with the model it was asked for
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 1 } }))];
            case 4:
                // Its agents belong to its card, each with the model it was asked for
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'checker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 2 } }))];
            case 5:
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'maker', model: 'opus', prompt: 'p', workflow: { runId: 'wf_1', agentIndex: 3 } }))];
            case 6:
                _23.sent();
                _23.label = 7;
            case 7:
                _23.trys.push([7, 12, 13, 18]);
                _b = true, _c = __asyncValues($.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' }));
                _23.label = 8;
            case 8: return [4 /*yield*/, _c.next()];
            case 9:
                if (!(_d = _23.sent(), _16 = _d.done, !_16)) return [3 /*break*/, 11];
                _18 = _d.value;
                _b = false;
                _ = _18;
                void _;
                _23.label = 10;
            case 10:
                _b = true;
                return [3 /*break*/, 8];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_1_1 = _23.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 13:
                _23.trys.push([13, , 16, 17]);
                if (!(!_b && !_16 && (_17 = _c.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _17.call(_c)];
            case 14:
                _23.sent();
                _23.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18:
                files.set('/t/wf_1/journal.jsonl', journal({ type: 'launched' }, { type: 'started', agentId: 'a1', label: 'maker', phase: 'Make' }, { type: 'result', agentId: 'a1', result: 'Wrote roman.py.' }, { type: 'started', agentId: 'a2', label: 'checker', phase: 'Check' }, { type: 'result', agentId: 'a2', result: { pass: false, why: 'to_roman(True) is not refused', findings: ['to_roman(True) returns I'] } }, { type: 'started', agentId: 'a3', label: 'maker', phase: 'Make' }));
                // The maker's chat, as its transcript keeps it: what it was told and wrote, never its thinking
                files.set('/t/wf_1/agent-a3.jsonl', journal({ type: 'user', message: { role: 'user', content: 'Fix what the checker found.' } }, { type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'SECRET THOUGHT' }, { type: 'text', text: 'Booleans are refused now.' }] } }));
                return [4 /*yield*/, clock.advance(2000)];
            case 19:
                _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // One card for the run, none for its agents
                ];
            case 20:
                pane = _23.sent();
                // One card for the run, none for its agents
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ type: 'Text', text: /^Roman numerals$/ })];
                    }); }); })];
            case 21:
                // One card for the run, none for its agents
                _e.apply(void 0, [_23.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, keyed(pane, 'open-a1')];
            case 22:
                _f.apply(void 0, [_23.sent()]).toBeUndefined();
                // Built as every card is: the title opens Details and Stop sits at its right end; where it stands, as a card's facts line says it
                _g = expect;
                return [4 /*yield*/, keyed(pane, 'flow-open-wf_1')];
            case 23:
                // Built as every card is: the title opens Details and Stop sits at its right end; where it stands, as a card's facts line says it
                _g.apply(void 0, [_23.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'flow-stop-wf_1' })];
            case 24:
                _h.apply(void 0, [(_19 = (_23.sent())) === null || _19 === void 0 ? void 0 : _19.props.plain]).toBe(true);
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Opus 5\.5 · 3 agents · round 2 of 3 · \d+s$/ })];
            case 25:
                _j.apply(void 0, [_23.sent()]).toBeDefined();
                // The bar it is held to, under it
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Every case holds\.$/ })];
            case 26:
                // The bar it is held to, under it
                _k.apply(void 0, [_23.sent()]).toBeDefined();
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 27:
                alts = (_23.sent()).map(function (one) { return String(one.props.alt); }).filter(function (alt) { return /^round \d/.test(alt); });
                expect(alts).toEqual(['round 1: done, failed', 'round 2: running, waiting', 'round 3: waiting, waiting']);
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 28:
                first = (_23.sent()).find(function (one) { return one.props.alt === 'round 1: done, failed'; });
                expect(String(first === null || first === void 0 ? void 0 : first.props.source)).toContain('#E5534B');
                // What round 1's check found, with how many; who is at work in round 2, in blue beside the moving dots; round 3 runs if needed
                _l = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 found · to_roman\(True\) is not refused$/ })];
            case 29:
                // What round 1's check found, with how many; who is at work in round 2, in blue beside the moving dots; round 3 runs if needed
                _l.apply(void 0, [_23.sent()]).toBeDefined();
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Maker fixing what the check found$/ })];
            case 30:
                _m.apply(void 0, [(_20 = (_23.sent())) === null || _20 === void 0 ? void 0 : _20.props.color]).toBe('#4E93EF');
                _o = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 31:
                _o.apply(void 0, [(_23.sent()).some(function (one) { return one.props.alt === 'Being done now' && String(one.props.source).includes('#4E93EF'); })]).toBe(true);
                _p = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^if needed$/ })];
            case 32:
                _p.apply(void 0, [_23.sent()]).toBeDefined();
                // No boxed Details button and no round count at the bottom: the card's own parts say it
                _q = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 33:
                // No boxed Details button and no round count at the bottom: the card's own parts say it
                _q.apply(void 0, [(_23.sent()).filter(function (one) { return one.props.label === 'Details'; })]).toEqual([]);
                // On a narrow panel the rounds keep their rows
                return [4 /*yield*/, pane.unmount()];
            case 34:
                // On a narrow panel the rounds keep their rows
                _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 16 }), surface: 'desktop' }))];
            case 35:
                narrow = _23.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, narrow.find({ type: 'Text', text: /^Roman numerals$/ })];
                    }); }); })];
            case 36:
                _23.sent();
                _r = expect;
                return [4 /*yield*/, narrow.find({ type: 'Text', text: /^Maker fixing what the check found$/ })];
            case 37:
                _r.apply(void 0, [_23.sent()]).toBeDefined();
                return [4 /*yield*/, narrow.unmount()];
            case 38:
                _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A surface that draws no pictures has the squares as letters, a round's pair on its row
                ];
            case 39:
                pane = _23.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 40:
                words = _23.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, words.find({ type: 'Text', text: /^Roman numerals$/ })];
                    }); }); })];
            case 41:
                _23.sent();
                _s = expect;
                return [4 /*yield*/, words.findAll({ type: 'Text', text: /^[■□]$/ })];
            case 42:
                _s.apply(void 0, [(_23.sent()).map(function (one) { return one.text; }).join('')]).toBe('■■■□□□');
                return [4 /*yield*/, words.unmount()];
            case 43:
                _23.sent();
                _t = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Working on 1 thing$/ })];
            case 44:
                _t.apply(void 0, [_23.sent()]).toBeDefined();
                // Kept in a file of its own, for the chat that started this session
                expect(JSON.parse((_21 = files.get("".concat(MEMORY, "/flows/wf_1.json"))) !== null && _21 !== void 0 ? _21 : '{}').session).toBe('local_1');
                // Details: a tab of its own in front, with its stages, its rounds and the maker's chat
                return [4 /*yield*/, pressed(pane, 'flow-open-wf_1')];
            case 45:
                // Details: a tab of its own in front, with its stages, its rounds and the maker's chat
                _23.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.includes('flow-wf_1: Roman numerals') || undefined];
                    }); }); })];
            case 46:
                _u.apply(void 0, [_23.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'flow-wf_1', surface: 'desktop' }))];
            case 47:
                tab = _23.sent();
                _v = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^the checker tests it against the bar · Opus 5.5 · 1 agent$/ })];
            case 48:
                _v.apply(void 0, [_23.sent()]).toBeDefined();
                _w = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Round 1: failed: to_roman\(True\) is not refused$/ })];
            case 49:
                _w.apply(void 0, [_23.sent()]).toBeDefined();
                // Each failed round lists what the checker found, and each round has its own squares
                _x = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^– to_roman\(True\) returns I$/ })];
            case 50:
                // Each failed round lists what the checker found, and each round has its own squares
                _x.apply(void 0, [_23.sent()]).toBeDefined();
                _y = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 51:
                _y.apply(void 0, [(_23.sent()).map(function (one) { return one.props.alt; })]).toEqual(['round 1: done, failed; round 2: running, waiting', 'round 1: done, failed', 'round 2: running, waiting']);
                _z = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Chat of the maker, round 2$/ })];
            case 52:
                _z.apply(void 0, [_23.sent()]).toBeDefined();
                _0 = expect;
                return [4 /*yield*/, tab.find({ type: 'Markdown', text: /Booleans are refused now/ })];
            case 53:
                _0.apply(void 0, [_23.sent()]).toBeDefined();
                _1 = expect;
                _3 = (_2 = JSON).stringify;
                return [4 /*yield*/, tab.findAll({ type: 'Markdown' })];
            case 54:
                _1.apply(void 0, [_3.apply(_2, [_23.sent()])]).not.toContain('SECRET');
                // Another agent's chat is a press away
                return [4 /*yield*/, pressed(tab, 'flow-pick-a2')];
            case 55:
                // Another agent's chat is a press away
                _23.sent();
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tab.find({ type: 'Text', text: /^Chat of the checker, round 1$/ })];
                    }); }); })];
            case 56:
                _4.apply(void 0, [_23.sent()]).toBeDefined();
                return [4 /*yield*/, tab.unmount()
                    // The notice that it ended ends its card: it leaves the running cards and is under Finished
                ];
            case 57:
                _23.sent();
                // The notice that it ended ends its card: it leaves the running cards and is under Finished
                return [4 /*yield*/, $.prompt.submit({ text: '<task-notification><task-id>wt1</task-id><status>completed</status><result>passed in 2 rounds</result></task-notification>', wait: false, origin: { kind: 'task-notification' } })];
            case 58:
                // The notice that it ended ends its card: it leaves the running cards and is under Finished
                _23.sent();
                _5 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /^Just finished$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 59:
                _5.apply(void 0, [_23.sent()]).toBe(true);
                // For two seconds it stays where it was, green, with no Stop, and nothing is under Finished yet
                _6 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Roman numerals$/ })];
            case 60:
                // For two seconds it stays where it was, green, with no Stop, and nothing is under Finished yet
                _6.apply(void 0, [_23.sent()]).toBeDefined();
                _7 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 61:
                _7.apply(void 0, [(_23.sent()).filter(function (b) { return b.props.backgroundColor === 'success'; }).length]).toBe(1);
                _8 = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'flow-stop-wf_1' })];
            case 62:
                _8.apply(void 0, [_23.sent()]).toBeUndefined();
                // Its last line says how it ended, from what the run returned when its last round has no verdict; a round it did not need says so
                _9 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^✓ Passed in round 2 of 3$/ })];
            case 63:
                // Its last line says how it ended, from what the run returned when its last round has no verdict; a round it did not need says so
                _9.apply(void 0, [_23.sent()]).toBeDefined();
                _10 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^not needed$/ })];
            case 64:
                _10.apply(void 0, [_23.sent()]).toBeDefined();
                octopus = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return String(one.props.alt); }).find(function (alt) { return /^Claudopus/.test(alt); })];
                    }
                }); }); };
                _11 = expect;
                return [4 /*yield*/, octopus()];
            case 65:
                _11.apply(void 0, [_23.sent()]).toBe('Claudopus, work finished');
                _12 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 66:
                _12.apply(void 0, [(_23.sent()).some(function (b) { return /Finished/.test(String(b.props.label)); })]).toBe(false);
                return [4 /*yield*/, clock.advance(2100)];
            case 67:
                _23.sent();
                _13 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Roman numerals$/ })];
            case 68:
                _13.apply(void 0, [_23.sent()]).toBeUndefined();
                _14 = expect;
                return [4 /*yield*/, octopus()];
            case 69:
                _14.apply(void 0, [_23.sent()]).toBe('Claudopus');
                return [4 /*yield*/, pressed(pane, 'finished-fold')];
            case 70:
                _23.sent();
                _15 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ type: 'Text', text: /^Finished · (Opus 5\.5 · )?(\d agents · )?round 2 of 3/ })];
                    }); }); })];
            case 71:
                _15.apply(void 0, [_23.sent()]).toBeDefined();
                expect(JSON.parse((_22 = files.get("".concat(MEMORY, "/flows/wf_1.json"))) !== null && _22 !== void 0 ? _22 : '{}').result).toBe('passed in 2 rounds');
                // Its end was heard and told, as a piece of work's is
                expect(played).toEqual(['sounds/ready.wav']);
                expect(notified).toEqual(['Roman numerals | passed in 2 rounds']);
                return [4 /*yield*/, pane.unmount()];
            case 72:
                _23.sent();
                return [2 /*return*/];
        }
    });
}); });
