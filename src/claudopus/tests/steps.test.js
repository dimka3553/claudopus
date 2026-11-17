// Work that runs its helpers beside it: a helper runs in the background, the work waits for it only when it has nothing else, is
// held back from ending while one runs, is told at the step when it could have sent calls together, and is told of a quiet helper
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
// One step of an agent as the engine reports it after its calls ended
var batch = function ($, agent, calls) {
    return $.classic.PostToolBatch({
        hook_event_name: 'PostToolBatch',
        agent_id: agent,
        tool_calls: calls.map(function (one, n) { var _a, _b; return ({ tool_name: one.tool, tool_input: (_a = one.input) !== null && _a !== void 0 ? _a : {}, tool_use_id: (_b = one.id) !== null && _b !== void 0 ? _b : "".concat(agent, "-").concat(one.tool, "-").concat(n) }); }),
    });
};
var toldOf = function (r) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0: return [4 /*yield*/, r];
        case 1: return [2 /*return*/, ((_a = (_b.sent()).additionalContext) !== null && _a !== void 0 ? _a : []).join('\n')];
    }
}); }); };
test("a helper a piece of work starts runs in the background, while the chat's own work is started as it asked", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var backgrounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                backgrounds = world(on).backgrounds;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { background: false, prompt: 'fix it' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { background: false, description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { background: false, description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a2' }))];
            case 5:
                _a.sent();
                expect(backgrounds).toEqual([false, true, true]);
                return [2 /*return*/];
        }
    });
}); });
test('a step is told when it started a helper alone, held only to-dos, or made a commit with no second look started; one that sends calls together is told nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _h.sent();
                _a = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }]))];
            case 4:
                _a.apply(void 0, [_h.sent()]).toContain('started one helper and nothing else');
                // Sent with other calls, a helper is no line
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read' } }, { tool: 'Agent', input: { description: 'Draw' } }, { tool: 'mcp__claudopus__note' }]))];
            case 5:
                // Sent with other calls, a helper is no line
                _b.apply(void 0, [_h.sent()]).toBe('');
                _c = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'mcp__claudopus__todo' }, { tool: 'mcp__claudopus__note' }]))];
            case 6:
                _c.apply(void 0, [_h.sent()]).toContain('only to-do and note calls');
                _d = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Nose"' } }]))];
            case 7:
                _d.apply(void 0, [_h.sent()]).toContain('start them now');
                // Each kind of line is said at most twice to one agent
                return [4 /*yield*/, batch($, 'a1', [{ tool: 'Agent', input: { description: 'One more' } }])];
            case 8:
                // Each kind of line is said at most twice to one agent
                _h.sent();
                _e = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'And another' } }]))];
            case 9:
                _e.apply(void 0, [_h.sent()]).toBe('');
                // A commit after a second look was started says nothing of it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the ears' }))];
            case 10:
                // A commit after a second look was started says nothing of it
                _h.sent();
                return [4 /*yield*/, batch($, 'a2', [{ tool: 'Agent', input: { description: 'Second look at the ears' } }, { tool: 'Read', input: { file_path: '/repo/a' } }])];
            case 11:
                _h.sent();
                _f = expect;
                return [4 /*yield*/, toldOf(batch($, 'a2', [{ tool: 'Bash', input: { command: 'git -C /repo commit -m "Ears"' } }]))];
            case 12:
                _f.apply(void 0, [_h.sent()]).toBe('');
                // The chat's own thread is never told
                _g = expect;
                return [4 /*yield*/, toldOf(batch($, undefined, [{ tool: 'Agent' }]))];
            case 13:
                // The chat's own thread is never told
                _g.apply(void 0, [_h.sent()]).toBe('');
                return [2 /*return*/];
        }
    });
}); });
test('three single lookups in a row are told to go together or to a helper; two long runs of one kind in a row, to run side by side', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, held, _b, _c, _d, _e, run, _f, _g;
    var _this = this;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), clock = _a.clock, held = _a.held;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }]))];
            case 4:
                _b.apply(void 0, [_h.sent()]).toBe('');
                _c = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'rg nose /repo' } }]))];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBe('');
                _d = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Grep', input: { pattern: 'ear' } }]))];
            case 6:
                _d.apply(void 0, [_h.sent()]).toContain('The last 3 steps each held one lookup');
                // A step of two lookups breaks the run
                return [4 /*yield*/, batch($, 'a1', [{ tool: 'Read' }, { tool: 'Read' }])];
            case 7:
                // A step of two lookups breaks the run
                _h.sent();
                _e = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read' }]))];
            case 8:
                _e.apply(void 0, [_h.sent()]).toBe('');
                run = function (id, command) { return __awaiter(_this, void 0, void 0, function () {
                    var call;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: "hold ".concat(id) });
                                return [4 /*yield*/, clock.advance(90000)];
                            case 1:
                                _b.sent();
                                (_a = held.get(id)) === null || _a === void 0 ? void 0 : _a('ok');
                                return [4 /*yield*/, call];
                            case 2:
                                _b.sent();
                                return [2 /*return*/, toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: command }, id: id }]))];
                        }
                    });
                }); };
                _f = expect;
                return [4 /*yield*/, run('t1', 'npm test -- nose')];
            case 9:
                _f.apply(void 0, [_h.sent()]).toBe('');
                _g = expect;
                return [4 /*yield*/, run('t2', 'npm test -- ears')];
            case 10:
                _g.apply(void 0, [_h.sent()]).toContain('Two long commands of one kind (npm test)');
                return [2 /*return*/];
        }
    });
}); });
test("work never waits for its helpers: it is told it may end its step, it is let go when it does, and a helper's result that the engine hands the chat is passed on to it, which starts it again; a report handed back while helpers run is still held", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, _a, stopped, resumed, appended, clock, stepped, told, _b, stop, _c, handback, before, said, _d, _e, _f, chunk, e_1_1, waits, _g, step, _h, list, texts, _j, _k;
    var _this = this;
    var _l, e_1, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                agents = {};
                talk = [];
                _a = world(on, { agents: agents, talk: talk }), stopped = _a.stopped, resumed = _a.resumed, appended = _a.appended, clock = _a.clock, stepped = _a.stepped;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' }))];
            case 5:
                _p.sent();
                agents.a1 = 'running';
                agents.a2 = 'running';
                agents.a3 = 'running';
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))];
            case 6:
                told = _p.sent();
                expect(told).toContain('each result comes to you as a message when it ends, even after you end your step');
                expect(told).not.toMatch(/bin\/helpers/);
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))];
            case 7:
                _b.apply(void 0, [_p.sent()]).toBe('');
                stop = function () { return $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }); };
                _c = expect;
                return [4 /*yield*/, stop()];
            case 8:
                _c.apply(void 0, [(_p.sent()).block]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' })];
            case 9:
                handback = (_p.sent());
                expect(handback.deny).toContain("Don't hand back your report yet");
                expect(handback.deny).not.toMatch(/bin\/helpers|Bash command|TaskStop/);
                // While it is at a step of its own the engine hands it the result itself: nothing is passed on
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 10:
                _p.sent();
                expect(resumed.filter(function (one) { return one.startsWith('a1:'); })).toEqual([]);
                // Its step ended, the engine lists it as done; the second helper's result is passed on and starts it again, and the chat is told
                agents.a1 = 'completed';
                // The engine, which does not count its helpers as its own at work, presses it for its report as it ends its step: answered with no
                // model, it ends its step again (16 Nov: five tasks, pressed and refused at their report, were told to the chat as ended)
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Waiting for the drawing.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' });
                before = stepped.length;
                said = [];
                _p.label = 11;
            case 11:
                _p.trys.push([11, 16, 17, 22]);
                _d = true, _e = __asyncValues($.turn.step({ turnId: 'h1p', index: 1, model: 'm', messageCount: 2, agentId: 'a1' }));
                _p.label = 12;
            case 12: return [4 /*yield*/, _e.next()];
            case 13:
                if (!(_f = _p.sent(), _l = _f.done, !_l)) return [3 /*break*/, 15];
                _o = _f.value;
                _d = false;
                chunk = _o;
                if (chunk.kind === 'text')
                    said.push(chunk.text);
                _p.label = 14;
            case 14:
                _d = true;
                return [3 /*break*/, 12];
            case 15: return [3 /*break*/, 22];
            case 16:
                e_1_1 = _p.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 22];
            case 17:
                _p.trys.push([17, , 20, 21]);
                if (!(!_d && !_l && (_m = _e.return))) return [3 /*break*/, 19];
                return [4 /*yield*/, _m.call(_e)];
            case 18:
                _p.sent();
                _p.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 21: return [7 /*endfinally*/];
            case 22:
                expect([stepped.length - before, said]).toEqual([0, ['My own work is still going; I am started again when it is done, and give my report then.']]);
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' })
                    // and the chat, which the engine tells it ended without its report, is told once it waits for its helper and is not to be asked
                ];
            case 23:
                _p.sent();
                waits = /^undefined: From Claudopus: the task ".*" ended its step without its report because it waits for a helper it started\..*Do not send it a message asking for its report/;
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return waits.test(one); })];
                    }); }); })];
            case 24:
                _g.apply(void 0, [_p.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Still waiting.', durationMs: 1, isAborted: false, turnId: 'h1b', reason: 'answer', agentId: 'a1' })];
            case 25:
                _p.sent();
                expect(appended.filter(function (one) { return waits.test(one); })).toHaveLength(1);
                step = function (turnId) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c, _, e_2_1;
                    var _d, e_2, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                talk.splice(0, talk.length, { role: 'user', content: 'Carry on.' });
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 12]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: turnId, index: 1, model: 'm', messageCount: 1, agentId: 'a1' }));
                                _g.label = 2;
                            case 2: return [4 /*yield*/, _b.next()];
                            case 3:
                                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                _f = _c.value;
                                _a = false;
                                _ = _f;
                                void _;
                                _g.label = 4;
                            case 4:
                                _a = true;
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 12];
                            case 6:
                                e_2_1 = _g.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 12];
                            case 7:
                                _g.trys.push([7, , 10, 11]);
                                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                return [4 /*yield*/, _e.call(_b)];
                            case 8:
                                _g.sent();
                                _g.label = 9;
                            case 9: return [3 /*break*/, 11];
                            case 10:
                                if (e_2) throw e_2.error;
                                return [7 /*endfinally*/];
                            case 11: return [7 /*endfinally*/];
                            case 12: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, step('h1c')];
            case 26:
                _p.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting again.', durationMs: 1, isAborted: false, turnId: 'h1c', reason: 'answer', agentId: 'a1' })];
            case 27:
                _p.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (appended.filter(function (one) { return waits.test(one); }).length === 2) || undefined];
                    }); }); })];
            case 28:
                _h.apply(void 0, [_p.sent()]).toBe(true);
                return [4 /*yield*/, step('h1d')];
            case 29:
                _p.sent();
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on the build too.', durationMs: 1, isAborted: false, turnId: 'h1d', reason: 'answer', agentId: 'a1' })];
            case 30:
                _p.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 31:
                _p.sent();
                expect(appended.filter(function (one) { return waits.test(one); })).toHaveLength(2);
                agents.a1 = 'completed';
                // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
                return [4 /*yield*/, clock.advance(25000)];
            case 32:
                // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 33:
                list = _p.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 34:
                texts = (_p.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, list.unmount()];
            case 35:
                _p.sent();
                expect(texts).toContain('Working on 1 thing');
                expect(texts).toContain('Fix the nose');
                agents.a3 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.' })];
            case 36:
                _p.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' })];
            case 37:
                _p.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one.startsWith('a1: From Claudopus: your helper "Draw the nose" has finished') && one.endsWith('The nose is drawn at every size.'); })];
                    }); }); })];
            case 38:
                _j.apply(void 0, [_p.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return /^undefined: From Claudopus: the result of the helper "Draw the nose" reached this chat because the task ".*" had ended its step/.test(one); })];
                    }); }); })];
            case 39:
                _k.apply(void 0, [_p.sent()]).toBeDefined();
                // Stopped from its card or by the chat, the work's running helpers are stopped with it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a1' }))];
            case 40:
                // Stopped from its card or by the chat, the work's running helpers are stopped with it
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 41:
                _p.sent();
                expect(stopped).toEqual(expect.arrayContaining(['a1', 'a4']));
                return [2 /*return*/];
        }
    });
}); });
test("what nothing of the work's own makes, a file, a line in it, a page or a time, Claudopus looks for when asked and starts the work again once it is there, or once the longest look runs out, though the engine lists it as ended; the card says so in place of a command that would wait; a helper hands back instead", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, files, resumed, r, lines, _b, _c, _d, _e, _f, _g, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), clock = _a.clock, files = _a.files, resumed = _a.resumed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'wait for the deploy', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the deploy', prompt: 'check' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the build log', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _k.sent();
                agents.a1 = 'completed';
                agents.a2 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w1', agentId: 'a1', what: 'the deploy marker', file: '/w/deployed.flag' })];
            case 5:
                r = (_k.sent());
                expect(r.result).toContain('End your step now');
                lines = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, texts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
                            case 1:
                                list = _a.sent();
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                texts = (_a.sent()).map(function (one) { return one.text; });
                                return [4 /*yield*/, list.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, texts];
                        }
                    });
                }); };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, lines()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return text === 'Claudopus starts Claude again when this is there: the deploy marker'; })];
                        }
                    }); }); })];
            case 6:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w2', agentId: 'a2', what: 'the build to finish', file: '/w/build.log', text: 'BUILD DONE' })];
            case 7:
                // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
                _c.apply(void 0, [(_k.sent()).result]).toContain('hand back your result now');
                return [4 /*yield*/, clock.advance(40000)];
            case 8:
                _k.sent();
                expect(resumed.filter(function (one) { return /^a[12]: /.test(one); })).toEqual([]);
                // There: the work its step had ended, which the engine lists as ended, is started again
                files.set('/w/deployed.flag', '');
                return [4 /*yield*/, clock.advance(40000)];
            case 9:
                _k.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: what you asked to be started again for is there: the deploy marker. Carry on from it.'; })];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, lines()];
                            case 1: return [2 /*return*/, !(_a.sent()).some(function (text) { return text.startsWith('Claudopus starts Claude again'); }) || undefined];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_k.sent()]).toBe(true);
                // A time only, and a file that never comes: started when the time comes, or told it never came
                agents.a1 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3', agentId: 'a1', what: 'a look at the queue again', minutes: 2 })];
            case 12:
                _k.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 13:
                _k.sent();
                expect(resumed.filter(function (one) { return one.includes('a look at the queue again'); })).toEqual([]);
                return [4 /*yield*/, clock.advance(100000)];
            case 14:
                _k.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: the time you asked for has come: a look at the queue again. Carry on.'; })];
                    }); }); })];
            case 15:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4', agentId: 'a1', what: 'the results file', file: '/w/never.json', minutes: 1 })];
            case 16:
                _k.sent();
                return [4 /*yield*/, clock.advance(100000)];
            case 17:
                _k.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: the results file was still not there after 1 min of looking. Find out why before you look again.'; })];
                    }); }); })];
            case 18:
                _g.apply(void 0, [_k.sent()]).toBeDefined();
                // Nothing to look for is said back, and the chat has no card to be started from
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w5', agentId: 'a1', what: 'something' })];
            case 19:
                // Nothing to look for is said back, and the chat has no card to be started from
                _h.apply(void 0, [(_k.sent()).result]).toContain('Name a file, a page, or the minutes');
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w6', what: 'x', minutes: 1 })];
            case 20:
                _j.apply(void 0, [(_k.sent()).result]).toContain('Only a background task');
                return [2 /*return*/];
        }
    });
}); });
test('a helper quiet for five minutes is named to its work once, and the card says so only then: a helper at work is a row of its own', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, appended, pane, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), clock = _a.clock, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 5:
                _e.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 6:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /looked in on|helper running/ })];
            case 7:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 8:
                _e.sent();
                expect(appended.filter(function (line) { return line.startsWith('a1: Your helper "Read the nose code" (a2) has shown nothing new'); })).toHaveLength(1);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 helper quiet for 5\+ min, Claudopus told Claude$/ })];
            case 9:
                _c.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBeDefined();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 10:
                _e.sent();
                expect(appended.filter(function (line) { return line.includes('has shown nothing new'); })).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
test('work whose context was compacted is handed its rules again at its next step, once; work started before the rules changed is handed the new ones', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, _a, told, _b, config, changed;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the eyes', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'draw them' }))
                    // Started with the rules: nothing more at its steps
                ];
            case 3:
                _c.sent();
                // Started with the rules: nothing more at its steps
                _a = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))];
            case 4:
                // Started with the rules: nothing more at its steps
                _a.apply(void 0, [_c.sent()]).not.toContain('These are the rules now');
                return [4 /*yield*/, $.session.compact({ trigger: 'auto', agentId: 'a1', messages: [{ role: 'user', text: 'one', toolUses: [] }] })];
            case 5:
                _c.sent();
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))];
            case 6:
                told = _c.sent();
                expect(told).toContain('Your context was compacted');
                expect(told).toContain('What follows is what Claudopus tells Claude in every task');
                expect(told).toContain('Keep the card up to date as you work');
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))];
            case 7:
                _b.apply(void 0, [_c.sent()]).not.toContain('These are the rules now');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 8:
                config = _c.sent();
                return [4 /*yield*/, pressed(config, 'config-text-work-edit')];
            case 9:
                _c.sent();
                return [4 /*yield*/, config.input({ key: 'config-text-work-input', text: '- Every run says how far it is.' })];
            case 10:
                _c.sent();
                expect(files.get("".concat(MEMORY, "/roles/work.md"))).toBe('- Every run says how far it is.\n');
                return [4 /*yield*/, config.unmount()];
            case 11:
                _c.sent();
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }]))];
            case 12:
                changed = _c.sent();
                expect(changed).toContain('have changed since you started');
                expect(changed).toContain('Every run says how far it is.');
                return [2 /*return*/];
        }
    });
}); });
