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
test('with no second check called for, as Claudopus starts, a commit is told nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the chin', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the chin' }))];
            case 3:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Bash', input: { command: 'git commit -m "Chin"' } }]))];
            case 4:
                _a.apply(void 0, [_b.sent()]).toBe('');
                return [2 /*return*/];
        }
    });
}); });
test('a step is told when it started a helper alone, held only to-dos, or, where a second check is set, made a commit with no second look started; one that sends calls together is told nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                files = world(on).files;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ lean: { second: 'beyond' } }));
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
test('a helper that gave its result in words and left only a server going for the person is done: its task is pressed for its report as before; one that gave words while following a run of its own is still at work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, stepped, press, _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                agents = {};
                talk = [];
                stepped = world(on, { agents: agents, talk: talk }).stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'build the site' }))];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Serve the site', prompt: 'serve', parentAgentId: 'a1' }))];
            case 3:
                _b.sent();
                Object.assign(agents, { a1: 'running', a2: 'running' });
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'v2', agentId: 'a2', command: 'hold serve', description: 'Serve the site on port 3000', run_in_background: true })];
            case 4:
                _b.sent();
                agents.a2 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: "The site is up on port 3000. ".concat('Every page loads and the forms send. '.repeat(15)), durationMs: 1, isAborted: false, turnId: 'e-a2', reason: 'answer', agentId: 'a2' })];
            case 5:
                _b.sent();
                agents.a1 = 'completed';
                press = function () { return __awaiter(_this, void 0, void 0, function () {
                    var before, _a, _b, _c, chunk, e_1_1;
                    var _d, e_1, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'The site is served.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' });
                                before = stepped.length;
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 12]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: 'p', index: 1, model: 'm', messageCount: 2, agentId: 'a1' }));
                                _g.label = 2;
                            case 2: return [4 /*yield*/, _b.next()];
                            case 3:
                                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                _f = _c.value;
                                _a = false;
                                chunk = _f;
                                void chunk;
                                _g.label = 4;
                            case 4:
                                _a = true;
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 12];
                            case 6:
                                e_1_1 = _g.sent();
                                e_1 = { error: e_1_1 };
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
                                if (e_1) throw e_1.error;
                                return [7 /*endfinally*/];
                            case 11: return [7 /*endfinally*/];
                            case 12: return [2 /*return*/, stepped.length - before];
                        }
                    });
                }); };
                _a = expect;
                return [4 /*yield*/, press()];
            case 6:
                _a.apply(void 0, [_b.sent()]).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test("a helper pressed for its report while a helper of its own runs is answered with the line the app hides, and when it then ends, that line is never passed on to its task as its result", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, _a, resumed, stepped, before, said, _b, _c, _d, chunk, e_2_1, _e;
    var _this = this;
    var _f, e_2, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                agents = {};
                talk = [];
                _a = world(on, { agents: agents, talk: talk }), resumed = _a.resumed, stepped = _a.stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'rebuild the head' }))];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fit the CT scans', prompt: 'ct', parentAgentId: 'a1' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the fits', prompt: 'draw', parentAgentId: 'a2' }))];
            case 4:
                _j.sent();
                Object.assign(agents, { a1: 'running', a2: 'running', a3: 'running' });
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: 'e-a1', reason: 'answer', agentId: 'a1' })];
            case 5:
                _j.sent();
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Fits are done; drawing them.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' });
                before = stepped.length;
                said = [];
                _j.label = 6;
            case 6:
                _j.trys.push([6, 11, 12, 17]);
                _b = true, _c = __asyncValues($.turn.step({ turnId: 'p', index: 1, model: 'm', messageCount: 2, agentId: 'a2' }));
                _j.label = 7;
            case 7: return [4 /*yield*/, _c.next()];
            case 8:
                if (!(_d = _j.sent(), _f = _d.done, !_f)) return [3 /*break*/, 10];
                _h = _d.value;
                _b = false;
                chunk = _h;
                if (chunk.kind === 'text')
                    said.push(chunk.text);
                _j.label = 9;
            case 9:
                _b = true;
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 17];
            case 11:
                e_2_1 = _j.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 17];
            case 12:
                _j.trys.push([12, , 15, 16]);
                if (!(!_b && !_f && (_g = _c.return))) return [3 /*break*/, 14];
                return [4 /*yield*/, _g.call(_c)];
            case 13:
                _j.sent();
                _j.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 16: return [7 /*endfinally*/];
            case 17:
                expect([stepped.length - before, said]).toEqual([0, ['<system-reminder>Waiting on my own work, which starts me again.</system-reminder>']]);
                // Its own helper ends, and so does it, its last words the line: its task is started with its words before it, never the line
                agents.a3 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 'e-a3', reason: 'answer', agentId: 'a3' })];
            case 18:
                _j.sent();
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: said[0], durationMs: 1, isAborted: false, turnId: 'e-a2', reason: 'answer', agentId: 'a2' })];
            case 19:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.some(function (line) { return line.startsWith('a1:'); }) || undefined];
                    }); }); })];
            case 20:
                _e.apply(void 0, [_j.sent()]).toBe(true);
                expect(resumed.filter(function (line) { return line.startsWith('a1:') && line.includes('Waiting on my own work'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("work never waits for its helpers: it is told it may end its step, it is let go when it does, and a helper's result that the engine hands the chat is passed on to it, which starts it again; a report handed back while helpers run is still held", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, unresumable, ended, _a, stopped, resumed, appended, submitted, clock, stepped, atHandback, resumedAtHandback, files, told, _b, stop, _c, handback, press, QUIET, _d, _e, waits, RESULT, endedNotice, asNotice, toldOfWait, quietTurn, answeredQuietly, alone, _f, _g, mixed, warned, _h, midTurn, _j, _k, gone, _l, _m, _o, _p, _q, _, e_3_1, list, texts, coming, passed, beforeNose, _r, _s, _t, _u, _, e_4_1, _v, atBrowEnd, handbackOf, asPeer, brow, _w, _x, _y, _z, _0, _1, words, _2, _3, notPassed, _4, lip, _5, _6, _7;
    var _this = this;
    var _8, e_3, _9, _10, _11, e_4, _12, _13;
    return __generator(this, function (_14) {
        switch (_14.label) {
            case 0:
                agents = {};
                talk = [];
                unresumable = new Set();
                ended = new Set();
                _a = world(on, { agents: agents, talk: talk, unresumable: unresumable, ended: ended }), stopped = _a.stopped, resumed = _a.resumed, appended = _a.appended, submitted = _a.submitted, clock = _a.clock, stepped = _a.stepped, atHandback = _a.atHandback, resumedAtHandback = _a.resumedAtHandback, files = _a.files;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _14.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _14.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _14.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _14.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' }))];
            case 5:
                _14.sent();
                agents.a1 = 'running';
                agents.a2 = 'running';
                agents.a3 = 'running';
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))];
            case 6:
                told = _14.sent();
                expect(told).toContain('each result comes to you as a message when it ends, even after you end your step');
                expect(told).not.toMatch(/bin\/helpers/);
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))];
            case 7:
                _b.apply(void 0, [_14.sent()]).toBe('');
                stop = function () { return $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }); };
                _c = expect;
                return [4 /*yield*/, stop()];
            case 8:
                _c.apply(void 0, [(_14.sent()).block]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' })];
            case 9:
                handback = (_14.sent());
                expect(handback.deny).toContain("Don't hand back your report yet");
                expect(handback.deny).not.toMatch(/bin\/helpers|Bash command|TaskStop/);
                // While it is at a step of its own the engine hands it the result itself: nothing is passed on
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 10:
                _14.sent();
                expect(resumed.filter(function (one) { return one.startsWith('a1:'); })).toEqual([]);
                // Its step ended, the engine lists it as done; the second helper's result is passed on and starts it again, and the chat is told
                agents.a1 = 'completed';
                // The helper still drawing ends a step of its own with a long word of how it stands, held on its render in the background: it has
                // not handed back
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r3', agentId: 'a3', command: 'hold render', description: 'Render the nose', run_in_background: true })];
            case 11:
                // The helper still drawing ends a step of its own with a long word of how it stands, held on its render in the background: it has
                // not handed back
                _14.sent();
                agents.a3 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: "Drawing the nose. ".concat('The render runs on and wakes me when it ends. '.repeat(15)), durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' })
                    // The engine, which does not count its helpers as its own at work, presses it for its report as it ends its step: answered with no
                    // model and a line the app draws as nothing in a task's chat, it ends its step again (16 Nov: five tasks, pressed and refused at
                    // their report, were told to the chat as ended; 17 Nov: the old line, said three times at each step's end, filled the task's chat).
                    // Nor does a long word of how things stand send it to the model while a helper runs, nor a helper that said a long word itself
                ];
            case 12:
                _14.sent();
                press = function (text) { return __awaiter(_this, void 0, void 0, function () {
                    var before, said, _a, _b, _c, chunk, e_5_1;
                    var _d, e_5, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: text }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' });
                                before = stepped.length;
                                said = [];
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 12]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: 'h1p', index: 1, model: 'm', messageCount: 2, agentId: 'a1' }));
                                _g.label = 2;
                            case 2: return [4 /*yield*/, _b.next()];
                            case 3:
                                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                _f = _c.value;
                                _a = false;
                                chunk = _f;
                                if (chunk.kind === 'text')
                                    said.push(chunk.text);
                                _g.label = 4;
                            case 4:
                                _a = true;
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 12];
                            case 6:
                                e_5_1 = _g.sent();
                                e_5 = { error: e_5_1 };
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
                                if (e_5) throw e_5.error;
                                return [7 /*endfinally*/];
                            case 11: return [7 /*endfinally*/];
                            case 12: return [2 /*return*/, [stepped.length - before, said]];
                        }
                    });
                }); };
                QUIET = '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>';
                _d = expect;
                return [4 /*yield*/, press('Waiting for the drawing.')];
            case 13:
                _d.apply(void 0, [_14.sent()]).toEqual([0, [QUIET]]);
                _e = expect;
                return [4 /*yield*/, press("The nose code is read. ".concat('The drawing helper still runs its render. '.repeat(15)))];
            case 14:
                _e.apply(void 0, [_14.sent()]).toEqual([0, [QUIET]]);
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' })
                    // The engine then tells the chat it ended without its report. Claudopus adds no note of its own, which would ride into a later
                    // turn of the chat's; at rest, the chat takes the notice as a prompt of its own, which is left out (16 Nov evening: 67 of 152 turns)
                    // (saying that Claudopus starts it again should that wait run out, never that it may not be written to)
                ];
            case 15:
                _14.sent();
                waits = /^From Claudopus: the task ".*" ended its step without its report because it waits for a helper it started\.[\s\S]*do not message it for one: Claudopus starts it again if that wait runs out or its helpers go quiet, and tells you if it is stuck\. Do not tell .+ it stopped\./;
                RESULT = 'The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.';
                endedNotice = function (id, result) {
                    if (result === void 0) { result = RESULT; }
                    return "<task-notification>\n<task-id>".concat(id, "</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/tasks/").concat(id, ".output</output-file>\n<status>completed</status>\n<summary>Agent \"Fix the nose\" finished</summary>\n<note>A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>\n<result>").concat(result, "\n</result>\n<usage><subagent_tokens>9</subagent_tokens><tool_uses>1</tool_uses><duration_ms>9</duration_ms></usage>\n</task-notification>");
                };
                asNotice = function (text) { return $.prompt.submit({ text: text, wait: false, origin: { kind: 'task-notification' } }); };
                toldOfWait = function (texts) { return (texts !== null && texts !== void 0 ? texts : []).flatMap(function (text) { return text.split('\n\n'); }).filter(function (one) { return waits.test(one); }).length; };
                return [4 /*yield*/, clock.advance(1000)];
            case 16:
                _14.sent();
                expect(appended.filter(function (one) { return /ended its step without its report/.test(one); })).toEqual([]);
                quietTurn = 0;
                answeredQuietly = function (text) { return __awaiter(_this, void 0, void 0, function () {
                    var turnId, asked, said, _a, _b, _c, chunk, e_6_1;
                    var _d, e_6, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                turnId = "notice-".concat(++quietTurn);
                                return [4 /*yield*/, $.turn.start({ text: text, turnId: turnId })];
                            case 1:
                                _g.sent();
                                asked = stepped.length;
                                said = [];
                                _g.label = 2;
                            case 2:
                                _g.trys.push([2, 7, 8, 13]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: turnId, index: 0, model: 'm', messageCount: 2 }));
                                _g.label = 3;
                            case 3: return [4 /*yield*/, _b.next()];
                            case 4:
                                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                                _f = _c.value;
                                _a = false;
                                chunk = _f;
                                if (chunk.kind === 'text')
                                    said.push(chunk.text);
                                _g.label = 5;
                            case 5:
                                _a = true;
                                return [3 /*break*/, 3];
                            case 6: return [3 /*break*/, 13];
                            case 7:
                                e_6_1 = _g.sent();
                                e_6 = { error: e_6_1 };
                                return [3 /*break*/, 13];
                            case 8:
                                _g.trys.push([8, , 11, 12]);
                                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                                return [4 /*yield*/, _e.call(_b)];
                            case 9:
                                _g.sent();
                                _g.label = 10;
                            case 10: return [3 /*break*/, 12];
                            case 11:
                                if (e_6) throw e_6.error;
                                return [7 /*endfinally*/];
                            case 12: return [7 /*endfinally*/];
                            case 13: return [2 /*return*/, stepped.length === asked && said.join('') === 'No response requested.'];
                        }
                    });
                }); };
                return [4 /*yield*/, asNotice(endedNotice('a1'))];
            case 17:
                alone = _14.sent();
                _f = expect;
                _g = [alone.drop, toldOfWait(alone.context)];
                return [4 /*yield*/, answeredQuietly(endedNotice('a1'))];
            case 18:
                _f.apply(void 0, [_g.concat([_14.sent()])]).toEqual([undefined, 1, true]);
                return [4 /*yield*/, asNotice("".concat(endedNotice('a1'), "\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command \"Build\" completed (exit code 0)</summary>\n</task-notification>"))];
            case 19:
                mixed = _14.sent();
                return [4 /*yield*/, asNotice(endedNotice('a1', "SECURITY WARNING: This subagent performed actions that may violate security policy. Reason: [Data Exfiltration]. Review the subagent's actions carefully before acting on its output.\n\n".concat(RESULT)))];
            case 20:
                warned = _14.sent();
                expect([mixed.drop, toldOfWait(mixed.context), warned.drop, toldOfWait(warned.context)]).toEqual([undefined, 1, undefined, 1]);
                _h = expect;
                return [4 /*yield*/, answeredQuietly(endedNotice('a1'))];
            case 21:
                _h.apply(void 0, [_14.sent()]).toBe(false);
                return [4 /*yield*/, $.prompt.submit({ text: endedNotice('a1'), wait: false, turnId: 'chat1', origin: { kind: 'task-notification' } })];
            case 22:
                midTurn = (_14.sent());
                _j = expect;
                _k = [midTurn.drop, toldOfWait(midTurn.context)];
                return [4 /*yield*/, answeredQuietly(endedNotice('a1'))];
            case 23:
                _j.apply(void 0, [_k.concat([_14.sent()])]).toEqual([undefined, 1, true]);
                // A helper the engine no longer lists at work, its card left behind, is no wait: the notice reaches the chat as it is
                agents.a3 = 'completed';
                return [4 /*yield*/, asNotice(endedNotice('a1'))];
            case 24:
                gone = _14.sent();
                _l = expect;
                _m = [gone.drop, toldOfWait(gone.context)];
                return [4 /*yield*/, answeredQuietly(endedNotice('a1'))];
            case 25:
                _l.apply(void 0, [_m.concat([_14.sent()])]).toEqual([undefined, 0, false]);
                agents.a3 = 'running';
                // A step of its own and another pause: still no note of Claudopus's own in the chat
                talk.splice(0, talk.length, { role: 'user', content: 'Carry on.' });
                _14.label = 26;
            case 26:
                _14.trys.push([26, 31, 32, 37]);
                _o = true, _p = __asyncValues($.turn.step({ turnId: 'h1c', index: 1, model: 'm', messageCount: 1, agentId: 'a1' }));
                _14.label = 27;
            case 27: return [4 /*yield*/, _p.next()];
            case 28:
                if (!(_q = _14.sent(), _8 = _q.done, !_8)) return [3 /*break*/, 30];
                _10 = _q.value;
                _o = false;
                _ = _10;
                void _;
                _14.label = 29;
            case 29:
                _o = true;
                return [3 /*break*/, 27];
            case 30: return [3 /*break*/, 37];
            case 31:
                e_3_1 = _14.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 37];
            case 32:
                _14.trys.push([32, , 35, 36]);
                if (!(!_o && !_8 && (_9 = _p.return))) return [3 /*break*/, 34];
                return [4 /*yield*/, _9.call(_p)];
            case 33:
                _14.sent();
                _14.label = 34;
            case 34: return [3 /*break*/, 36];
            case 35:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 36: return [7 /*endfinally*/];
            case 37: return [4 /*yield*/, $.turn.complete({ answer: 'Waiting again.', durationMs: 1, isAborted: false, turnId: 'h1c', reason: 'answer', agentId: 'a1' })];
            case 38:
                _14.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 39:
                _14.sent();
                expect(appended.filter(function (one) { return /ended its step without its report/.test(one); })).toEqual([]);
                // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
                return [4 /*yield*/, clock.advance(25000)];
            case 40:
                // and its card stays at work with its helper under it, though the engine lists it as completed (16 Nov it vanished meanwhile)
                _14.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 41:
                list = _14.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 42:
                texts = (_14.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, list.unmount()];
            case 43:
                _14.sent();
                expect(texts).toContain('1 task working');
                expect(texts).toContain('Fix the nose');
                agents.a3 = 'completed';
                coming = function (helper) { return function (one) { return one === "a1: From Claudopus: your helper \"".concat(helper, "\" is handing you its report now. It comes as a message of its own right after this one: read it there."); }; };
                passed = function (helper) { return function (one) { return new RegExp("^undefined: From Claudopus: the result of the helper \"".concat(helper, "\" reached this chat because the task \".*\" had ended its step")).test(one); }; };
                beforeNose = resumed.length;
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.' })
                    // (before the hand-back reaches Claude Code, which hands the report to the task only while it is at work)
                ];
            case 44:
                _14.sent();
                // (before the hand-back reaches Claude Code, which hands the report to the task only while it is at work)
                expect(resumed.slice(beforeNose, resumedAtHandback.at(-1)).filter(coming('Draw the nose'))).toHaveLength(1);
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' })];
            case 45:
                _14.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 46:
                _14.sent();
                expect(resumed.filter(function (one) { return one.startsWith('a1: From Claudopus: your helper "Draw the nose" has finished'); })).toEqual([]);
                expect(appended.filter(passed('Draw the nose'))).toEqual([]);
                // A helper the engine still lists as running as its turn ends has its result passed on once the engine lists it as ended
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw', parentAgentId: 'a1' }))];
            case 47:
                // A helper the engine still lists as running as its turn ends has its result passed on once the engine lists it as ended
                _14.sent();
                agents.a4 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4', reason: 'answer', agentId: 'a4' })];
            case 48:
                _14.sent();
                agents.a4 = 'completed';
                return [4 /*yield*/, clock.advance(2000)];
            case 49:
                _14.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one.startsWith('a1: From Claudopus: your helper "Draw the chin" has finished') && one.endsWith('The chin is drawn.'); })];
                    }); }); })];
            case 50:
                _r.apply(void 0, [_14.sent()]).toBeDefined();
                expect(appended.filter(passed('Draw the chin'))).toHaveLength(1);
                // The same result ended again as failed is not passed on a second time
                return [4 /*yield*/, $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4b', reason: 'error', agentId: 'a4' })];
            case 51:
                // The same result ended again as failed is not passed on a second time
                _14.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 52:
                _14.sent();
                expect(resumed.filter(function (one) { return one.startsWith('a1: From Claudopus: your helper "Draw the chin"'); })).toHaveLength(1);
                // Sent a message, it takes a step and ends again with the same words: that is a result of its own, passed on again
                talk.splice(0, talk.length, { role: 'user', content: 'Draw it once more.' });
                _14.label = 53;
            case 53:
                _14.trys.push([53, 58, 59, 64]);
                _s = true, _t = __asyncValues($.turn.step({ turnId: 'h4c', index: 1, model: 'm', messageCount: 1, agentId: 'a4' }));
                _14.label = 54;
            case 54: return [4 /*yield*/, _t.next()];
            case 55:
                if (!(_u = _14.sent(), _11 = _u.done, !_11)) return [3 /*break*/, 57];
                _13 = _u.value;
                _s = false;
                _ = _13;
                void _;
                _14.label = 56;
            case 56:
                _s = true;
                return [3 /*break*/, 54];
            case 57: return [3 /*break*/, 64];
            case 58:
                e_4_1 = _14.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 64];
            case 59:
                _14.trys.push([59, , 62, 63]);
                if (!(!_s && !_11 && (_12 = _t.return))) return [3 /*break*/, 61];
                return [4 /*yield*/, _12.call(_t)];
            case 60:
                _14.sent();
                _14.label = 61;
            case 61: return [3 /*break*/, 63];
            case 62:
                if (e_4) throw e_4.error;
                return [7 /*endfinally*/];
            case 63: return [7 /*endfinally*/];
            case 64: return [4 /*yield*/, $.turn.complete({ answer: 'The chin is drawn.', durationMs: 1, isAborted: false, turnId: 'h4c', reason: 'answer', agentId: 'a4' })];
            case 65:
                _14.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 66:
                _14.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.filter(function (one) { return one.startsWith('a1: From Claudopus: your helper "Draw the chin"'); }).length === 2 || undefined];
                    }); }); })];
            case 67:
                _v.apply(void 0, [_14.sent()]).toBe(true);
                // One that cannot be passed on leaves the chat told to send it on itself
                agents.a1 = 'completed';
                unresumable.add('a1');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the brow', prompt: 'draw', parentAgentId: 'a1' }))];
            case 68:
                _14.sent();
                agents.a5 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb5', agentId: 'a5', message: 'The brow is drawn.' })];
            case 69:
                _14.sent();
                atBrowEnd = appended.length;
                // Its task could not be started, so the chat gets the hand-back: the chat is told as it goes through, before the helper's turn
                // ends, as the chat's turn starts with the hand-back (16 Nov: its turn began before a note written later, and it sent it on by hand)
                expect(appended.slice(atHandback.at(-1), atBrowEnd).filter(passed('Draw the brow'))).toHaveLength(1);
                handbackOf = function (id, report) { return "<agent-message from=\"".concat(id, "\">\n[Subagent hand-back] The text below is the final report of a subagent this session delegated to. The report follows:\n  ").concat(report, "\n</agent-message>"); };
                asPeer = function (text) { return $.prompt.submit({ text: text, wait: false, origin: { kind: 'peer' } }); };
                brow = handbackOf('a5', 'The brow is drawn.');
                // While the engine lists the task at work it may hand the task the result itself, so Claudopus may not pass it on: the chat's turn
                agents.a1 = 'waiting';
                _w = expect;
                return [4 /*yield*/, asPeer(brow)];
            case 70:
                _x = [(_14.sent()).drop];
                return [4 /*yield*/, answeredQuietly(brow)];
            case 71:
                _w.apply(void 0, [_x.concat([_14.sent()])]).toEqual([undefined, false]);
                agents.a1 = 'completed';
                _y = expect;
                return [4 /*yield*/, asPeer(brow)];
            case 72:
                _z = [(_14.sent()).drop];
                return [4 /*yield*/, answeredQuietly(brow)];
            case 73:
                _y.apply(void 0, [_z.concat([_14.sent()])]).toEqual([undefined, true]);
                _0 = expect;
                return [4 /*yield*/, asPeer(brow)];
            case 74:
                _1 = [(_14.sent()).drop];
                return [4 /*yield*/, answeredQuietly(brow)];
            case 75:
                _0.apply(void 0, [_1.concat([_14.sent()])]).toEqual([undefined, false]);
                words = '<agent-message from="a5">\nThe brow is drawn.\n</agent-message>';
                _2 = expect;
                return [4 /*yield*/, asPeer(words)];
            case 76:
                _3 = [(_14.sent()).drop];
                return [4 /*yield*/, answeredQuietly(words)];
            case 77:
                _2.apply(void 0, [_3.concat([_14.sent()])]).toEqual([undefined, false]);
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h5', reason: 'answer', agentId: 'a5' })
                    // (sent as Claudopus's own message, which gives the chat a turn: a row written as the helper's turn ended sat unread)
                ];
            case 78:
                _14.sent();
                notPassed = function (helper, then) { return new RegExp("^From Claudopus: the result of the helper \"".concat(helper, "\" reached this chat, and Claudopus did not pass it on to the task \".*\" \\(id a1\\): ").concat(then)); };
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.find(function (one) { return notPassed('Draw the brow', 'no such agent\\. Send the result on to that task yourself: SendMessage to a1, with the result as it reached you\\.').test(one); })];
                    }); }); })];
            case 79:
                _4.apply(void 0, [_14.sent()]).toBeDefined();
                unresumable.delete('a1');
                // A hand-back Claude Code refuses leaves no note
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lip', prompt: 'draw', parentAgentId: 'a1' }))];
            case 80:
                // A hand-back Claude Code refuses leaves no note
                _14.sent();
                agents.a6 = 'running';
                files.set('refuse', 'SubagentHandback');
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6', agentId: 'a6', message: 'The lip is drawn.' })];
            case 81:
                _14.sent();
                files.delete('refuse');
                expect(appended.filter(passed('Draw the lip'))).toEqual([]);
                // and the task started for it is told nothing comes
                expect(resumed.filter(coming('Draw the lip'))).toHaveLength(1);
                expect(resumed.at(-1)).toMatch(/^a1: From Claudopus: the report of your helper "Draw the lip" did not come after all: Claude Code refused it\./);
                // and so is it when Claude Code refuses it with a plain result, and the result is passed on as the helper's turn ends
                files.set('handback-not-sent', '1');
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6n', agentId: 'a6', message: 'The lip is drawn.' })];
            case 82:
                _14.sent();
                files.delete('handback-not-sent');
                expect(resumed.filter(function (one) { return one.includes('the report of your helper "Draw the lip" did not come after all'); })).toHaveLength(2);
                // Should the chat get a hand-back all the same, its task started for it, Claudopus passes it on: here the task cannot be written
                // to, so the chat is told to send it on, with the task's id
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6b', agentId: 'a6', message: 'The lip is drawn.' })];
            case 83:
                // Should the chat get a hand-back all the same, its task started for it, Claudopus passes it on: here the task cannot be written
                // to, so the chat is told to send it on, with the task's id
                _14.sent();
                expect(resumed.filter(coming('Draw the lip'))).toHaveLength(3);
                lip = handbackOf('a6', 'The lip is drawn.');
                _5 = expect;
                return [4 /*yield*/, asPeer(lip)];
            case 84:
                _6 = [(_14.sent()).drop];
                return [4 /*yield*/, answeredQuietly(lip)];
            case 85:
                _5.apply(void 0, [_6.concat([_14.sent()])]).toEqual([undefined, true]);
                agents.a1 = 'running';
                ended.add('a1');
                agents.a6 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h6', reason: 'answer', agentId: 'a6' })];
            case 86:
                _14.sent();
                _7 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.find(function (one) { return notPassed('Draw the lip', 'no running loop\\. Send the result on to that task yourself: SendMessage to a1').test(one); })];
                    }); }); })];
            case 87:
                _7.apply(void 0, [_14.sent()]).toBeDefined();
                ended.delete('a1');
                agents.a1 = 'completed';
                // Stopped from its card or by the chat, the work's running helpers are stopped with it; one whose hand-back went to the task, as it
                // was started for it, leaves nothing for the chat
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a1' }))];
            case 88:
                // Stopped from its card or by the chat, the work's running helpers are stopped with it; one whose hand-back went to the task, as it
                // was started for it, leaves nothing for the chat
                _14.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb7', agentId: 'a7', message: 'The ear is drawn.' })];
            case 89:
                _14.sent();
                expect(appended.filter(passed('Draw the ear'))).toEqual([]);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 90:
                _14.sent();
                expect(stopped).toEqual(expect.arrayContaining(['a1', 'a7']));
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h7', reason: 'answer', agentId: 'a7' })];
            case 91:
                _14.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 92:
                _14.sent();
                expect(submitted.filter(function (one) { return one.includes('"Draw the ear"'); })).toEqual([]);
                expect(appended.filter(function (one) { return one.includes('Claudopus did not pass it on'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("what nothing of the work's own makes, a file, a line in it, a page or a time, Claudopus looks for when asked and starts the work again once it is there, or once the longest look (15 min unless given, at most an hour, always) runs out, though the engine lists it as ended; a look that ran out has it hand back what it has, which goes through while a helper runs, and the same file, line or page is not looked for again; a helper's result that comes after is told to the chat as late; work never reached is told to the chat; its card says nothing of when it is started again; a helper hands back instead", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, unresumable, _a, clock, files, resumed, logged, appended, submitted, notified, r, lines, _b, _c, _d, _e, _f, _g, _h, _j, late, lateSaid, _k, _l, _m, chunk, e_7_1, _o, _p, _q, _r, _s, _t;
    var _this = this;
    var _u, e_7, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                agents = {};
                unresumable = new Set();
                _a = world(on, { agents: agents, unresumable: unresumable }), clock = _a.clock, files = _a.files, resumed = _a.resumed, logged = _a.logged, appended = _a.appended, submitted = _a.submitted, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _x.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'wait for the deploy', wait: false, origin: composer })];
            case 2:
                _x.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the deploy', prompt: 'check' }))];
            case 3:
                _x.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the build log', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _x.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the test log', prompt: 'read', parentAgentId: 'a1' }))];
            case 5:
                _x.sent();
                agents.a1 = 'completed';
                agents.a2 = 'running';
                agents.a3 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w1', agentId: 'a1', what: 'the deploy marker', file: '/w/deployed.flag' })];
            case 6:
                r = (_x.sent());
                expect(r.result).toContain('End your step now');
                expect(r.result).toContain('after 15 min with word that it never came');
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
                // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w2', agentId: 'a2', what: 'the build to finish', file: '/w/build.log', text: 'BUILD DONE' })];
            case 7:
                // A helper that ended its step would have ended: it hands back what it waits for, and its task asks
                _b.apply(void 0, [(_x.sent()).result]).toContain('hand back your result now');
                return [4 /*yield*/, clock.advance(40000)];
            case 8:
                _x.sent();
                expect(resumed.filter(function (one) { return /^a[12]: /.test(one); })).toEqual([]);
                // Its card says nothing of when Claudopus starts it again (18 Nov)
                _c = expect;
                return [4 /*yield*/, lines()];
            case 9:
                // Its card says nothing of when Claudopus starts it again (18 Nov)
                _c.apply(void 0, [(_x.sent()).some(function (text) { return /starts Claude again|the deploy marker/.test(text !== null && text !== void 0 ? text : ''); })]).toBe(false);
                // There: the work its step had ended, which the engine lists as ended, is started again
                files.set('/w/deployed.flag', '');
                return [4 /*yield*/, clock.advance(40000)];
            case 10:
                _x.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: what you asked to be started again for is there: the deploy marker. Carry on from it.'; })];
                    }); }); })];
            case 11:
                _d.apply(void 0, [_x.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, lines()];
                            case 1: return [2 /*return*/, !(_a.sent()).some(function (text) { return text.includes('Claudopus starts Claude again'); }) || undefined];
                        }
                    }); }); })];
            case 12:
                _e.apply(void 0, [_x.sent()]).toBe(true);
                // A time only, and a file that never comes: started when the time comes, or told it never came
                agents.a1 = 'completed';
                _f = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3l', agentId: 'a1', what: 'a look much later', minutes: 500 })];
            case 13:
                _f.apply(void 0, [(_x.sent()).result]).toContain('in 60 min (at most 60 min).');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w3', agentId: 'a1', what: 'a look at the queue again', minutes: 2 })];
            case 14:
                _x.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 15:
                _x.sent();
                expect(resumed.filter(function (one) { return one.includes('a look at the queue again'); })).toEqual([]);
                return [4 /*yield*/, clock.advance(100000)];
            case 16:
                _x.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: the time you asked for has come: a look at the queue again. Carry on.'; })];
                    }); }); })];
            case 17:
                _g.apply(void 0, [_x.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4', agentId: 'a1', what: 'the results file', file: '/w/never.json', minutes: 1 })];
            case 18:
                _x.sent();
                return [4 /*yield*/, clock.advance(100000)];
            case 19:
                _x.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: From Claudopus: the results file was still not there after 1 min of looking, and Claudopus will not look for it again. Hand back your report now with what you have, saying what never came and why; it goes through even while helpers run.'; })];
                    }); }); })];
            case 20:
                _h.apply(void 0, [_x.sent()]).toBeDefined();
                // Told to hand back, its report goes through though its helpers run, and those at work are not stopped. One that handed back just
                // before, which the chat was told is passed on, ends after it: the chat is told in its place that it was not; one that hands back
                // after reaches the chat, which is told it came late. Each as Claudopus's own message, which gives the chat a turn
                agents.a2 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-a2', agentId: 'a2', message: 'The build log ends at step 9.' })
                    // (its task, whose step had ended, is started first, so the engine hands it the report, and the chat hears nothing of it)
                ];
            case 21:
                _x.sent();
                // (its task, whose step had ended, is started first, so the engine hands it the report, and the chat hears nothing of it)
                expect(resumed.filter(function (one) { return one.startsWith('a1: From Claudopus: your helper "Read the build log" is handing you its report now.'); })).toHaveLength(1);
                expect(appended.filter(function (one) { return one.includes('reached this chat because the task'); })).toEqual([]);
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-miss', agentId: 'a1', message: 'The results file never came.' })];
            case 22:
                _j.apply(void 0, [(_x.sent()).deny]).toBeUndefined();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h-a2', reason: 'answer', agentId: 'a2' })];
            case 23:
                _x.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 24:
                _x.sent();
                expect(submitted.filter(function (one) { return one.startsWith('From Claudopus, in place of its word'); })).toEqual([]);
                agents.a3 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-a3', agentId: 'a3', message: 'The test log is clean.' })
                    // Its hand-back reaches the chat, which is the one to act on it: the model's turn
                ];
            case 25:
                _x.sent();
                late = '<agent-message from="a3">\n[Subagent hand-back] The report follows:\n  The test log is clean.\n</agent-message>';
                return [4 /*yield*/, $.prompt.submit({ text: late, wait: false, origin: { kind: 'peer' } })];
            case 26:
                _x.sent();
                return [4 /*yield*/, $.turn.start({ text: late, turnId: 'late' })];
            case 27:
                _x.sent();
                lateSaid = [];
                _x.label = 28;
            case 28:
                _x.trys.push([28, 33, 34, 39]);
                _k = true, _l = __asyncValues($.turn.step({ turnId: 'late', index: 0, model: 'm', messageCount: 2 }));
                _x.label = 29;
            case 29: return [4 /*yield*/, _l.next()];
            case 30:
                if (!(_m = _x.sent(), _u = _m.done, !_u)) return [3 /*break*/, 32];
                _w = _m.value;
                _k = false;
                chunk = _w;
                if (chunk.kind === 'text')
                    lateSaid.push(chunk.text);
                _x.label = 31;
            case 31:
                _k = true;
                return [3 /*break*/, 29];
            case 32: return [3 /*break*/, 39];
            case 33:
                e_7_1 = _x.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 39];
            case 34:
                _x.trys.push([34, , 37, 38]);
                if (!(!_k && !_u && (_v = _l.return))) return [3 /*break*/, 36];
                return [4 /*yield*/, _v.call(_l)];
            case 35:
                _x.sent();
                _x.label = 36;
            case 36: return [3 /*break*/, 38];
            case 37:
                if (e_7) throw e_7.error;
                return [7 /*endfinally*/];
            case 38: return [7 /*endfinally*/];
            case 39:
                expect(lateSaid.join('')).not.toBe('No response requested.');
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h-a3', reason: 'answer', agentId: 'a3' })];
            case 40:
                _x.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.find(function (one) { return /^From Claudopus: the result of the helper "[^"]+" came after the task "[^"]+" handed back what it had, so it reached this chat\./.test(one); })];
                    }); }); })];
            case 41:
                _o.apply(void 0, [_x.sent()]).toBeDefined();
                expect(submitted.filter(function (one) { return one.includes('handed back what it had'); })).toHaveLength(1);
                expect(appended.filter(function (one) { return one.includes('reached this chat because the task'); })).toEqual([]);
                expect(appended.filter(function (one) { return one.includes('handed back what it had'); })).toEqual([]);
                expect(resumed.filter(function (one) { return one.startsWith('a1: From Claudopus: your helper') && one.includes('has finished'); })).toEqual([]);
                // The same file looked for again is refused, whatever its words; another is looked for
                agents.a1 = 'completed';
                _p = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4c', agentId: 'a1', what: 'the results, once more', file: '/w/never.json', minutes: 1 })];
            case 42:
                _p.apply(void 0, [(_x.sent()).result]).toContain('Refused by Claudopus: the look for the results file ran out already');
                _q = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w4d', agentId: 'a1', what: 'the results file', file: '/w/second.json', minutes: 1 })];
            case 43:
                _q.apply(void 0, [(_x.sent()).result]).toContain('End your step now');
                // Work that cannot be started again for what came would wait for good: the chat is told
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the queue', prompt: 'watch' }))];
            case 44:
                // Work that cannot be started again for what came would wait for good: the chat is told
                _x.sent();
                agents.a4 = 'completed';
                unresumable.add('a4');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w7', agentId: 'a4', what: 'the queue to drain', minutes: 1 })];
            case 45:
                _x.sent();
                return [4 /*yield*/, clock.advance(120000)];
            case 46:
                _x.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: Claudopus could not start "Watch the queue" again for what it waited on: the queue to drain.'); })];
                    }); }); })];
            case 47:
                _r.apply(void 0, [_x.sent()]).toBeDefined();
                expect(logged.filter(function (line) { return line.includes('Watch the queue'); })).toEqual([]);
                // Only the person can send it a message: its card says so, and they hear it as a notification
                expect(notified.some(function (line) { return line.startsWith('Watch the queue needs you | Claudopus could not start'); })).toBe(true);
                // Nothing to look for is said back, and the chat has no card to be started from
                _s = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w5', agentId: 'a1', what: 'something' })];
            case 48:
                // Nothing to look for is said back, and the chat has no card to be started from
                _s.apply(void 0, [(_x.sent()).result]).toContain('Name a file, a page, or the minutes');
                _t = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w6', what: 'x', minutes: 1 })];
            case 49:
                _t.apply(void 0, [(_x.sent()).result]).toContain('Only a background task');
                return [2 /*return*/];
        }
    });
}); });
test('a helper quiet for five minutes is named to its work once, and its card never says so: a helper at work is a row of its own', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, appended, pane, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), clock = _a.clock, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 4:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 5:
                _d.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 6:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /looked in on|helper running/ })];
            case 7:
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 8:
                _d.sent();
                expect(appended.filter(function (line) { return line.startsWith('a1: Your helper "Read the nose code" (a2) has shown nothing new'); })).toHaveLength(1);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /shown nothing new|told to check/ })];
            case 9:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 10:
                _d.sent();
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
