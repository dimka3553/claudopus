// Work that runs its helpers beside it: a helper runs in the background, its task ends its step and stays at work while one works,
// their results reach it through Claude Code alone, a task is told at the step when it could have sent calls together, and Claude
// Code's press for a report is answered with no model only where it can bring nothing
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
test("pressed by Claude Code for its report, a task is answered with no model, by the line the app hides, only when its report was already taken or it ended its step with a question or a permission open; while a helper or a command of its own works, and once a message starts it again, the press is a step of the model's", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, stepped, QUIET, PRESS, step, pressedFor, MODEL, HIDDEN, _a, _b, _c, _d, asked, list, dontAllow, _e, _f, _g, _h, handed, handBack, _j, _k, _l, _m;
    var _o;
    var _this = this;
    var _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                agents = {};
                talk = [];
                stepped = world(on, { agents: agents, talk: talk }).stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'mend the face', wait: false, origin: composer })];
            case 2:
                _s.sent();
                QUIET = '<system-reminder>Waiting for an answer.</system-reminder>';
                PRESS = '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.';
                step = function (agentId, rows) { return __awaiter(_this, void 0, void 0, function () {
                    var before, said, _a, _b, _c, chunk, e_1_1;
                    var _d, e_1, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                talk.splice.apply(talk, __spreadArray([0, talk.length], rows, false));
                                before = stepped.length;
                                said = [];
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 12]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: "p-".concat(agentId), index: 1, model: 'm', messageCount: 2, agentId: agentId }));
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
                            case 12: return [2 /*return*/, [stepped.length - before, said]];
                        }
                    });
                }); };
                pressedFor = function (agentId, words) { return step(agentId, [{ role: 'assistant', content: [{ type: 'text', text: words }] }, { role: 'user', content: PRESS }]); };
                MODEL = [1, ['Looking at the nose.']];
                HIDDEN = [0, [QUIET]];
                // A helper of its own at work: the model's step, whether it said a few words or many (the model hands in, carries on or ends its
                // step; Claudopus says nothing in its place)
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                // A helper of its own at work: the model's step, whether it said a few words or many (the model hands in, carries on or ends its
                // step; Claudopus says nothing in its place)
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _s.sent();
                Object.assign(agents, { a1: 'completed', a2: 'running' });
                _a = expect;
                return [4 /*yield*/, pressedFor('a1', 'Waiting for my helper.')];
            case 5:
                _a.apply(void 0, [_s.sent()]).toEqual(MODEL);
                _b = expect;
                return [4 /*yield*/, pressedFor('a1', "The nose code is being read. ".concat('The helper still reads it. '.repeat(15)))];
            case 6:
                _b.apply(void 0, [_s.sent()]).toEqual(MODEL);
                // A command of its own in the background: the model's step
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the ears', prompt: 'render the ears' }))];
            case 7:
                // A command of its own in the background: the model's step
                _s.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r3', agentId: 'a3', command: 'hold render', description: 'Render the ears', run_in_background: true })];
            case 8:
                _s.sent();
                _c = expect;
                return [4 /*yield*/, pressedFor('a3', 'The render runs.')];
            case 9:
                _c.apply(void 0, [_s.sent()]).toEqual(MODEL);
                // A question open for the person: it can give no report, so the press costs no model and draws nothing
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 10:
                // A question open for the person: it can give no report, so the press costs no model and draws nothing
                _s.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'May I delete the old repo?', choices: ['Approve', 'Keep it'] })];
            case 11:
                _s.sent();
                _d = expect;
                return [4 /*yield*/, pressedFor('a4', 'I asked whether the old repo may go.')];
            case 12:
                _d.apply(void 0, [_s.sent()]).toEqual(HIDDEN);
                // A permission open for the person, on a command of its own: the same
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Clean the build', prompt: 'clean up the build' }))];
            case 13:
                // A permission open for the person, on a command of its own: the same
                _s.sent();
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a5' });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 14:
                list = _s.sent();
                dontAllow = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === "Don't allow"; })];
                    }
                }); }); };
                _e = expect;
                return [4 /*yield*/, until(dontAllow)];
            case 15:
                _e.apply(void 0, [_s.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, pressedFor('a5', 'The build folder is next.')];
            case 16:
                _f.apply(void 0, [_s.sent()]).toEqual(HIDDEN);
                _h = (_g = list).press;
                _o = {};
                return [4 /*yield*/, dontAllow()];
            case 17: return [4 /*yield*/, _h.apply(_g, [(_o.key = (_q = (_p = (_s.sent())) === null || _p === void 0 ? void 0 : _p.key) !== null && _q !== void 0 ? _q : '', _o)])];
            case 18:
                _s.sent();
                return [4 /*yield*/, asked];
            case 19:
                _s.sent();
                return [4 /*yield*/, list.unmount()
                    // Its report taken at its hand-back: the step after the hand-back's own result, and each press after it, cost no model
                ];
            case 20:
                _s.sent();
                // Its report taken at its hand-back: the step after the hand-back's own result, and each press after it, cost no model
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 21:
                // Its report taken at its hand-back: the step after the hand-back's own result, and each press after it, cost no model
                _s.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb6', agentId: 'a6', message: 'Both eyes are drawn.' })];
            case 22:
                handed = (_s.sent());
                expect([handed.deny, (_r = handed.result) === null || _r === void 0 ? void 0 : _r.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')]);
                handBack = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb6', name: 'SubagentHandback', input: { message: 'Both eyes are drawn.' } }] };
                _j = expect;
                return [4 /*yield*/, step('a6', [handBack, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb6', content: 'Report delivered.' }] }])];
            case 23:
                _j.apply(void 0, [_s.sent()]).toEqual(HIDDEN);
                _k = expect;
                return [4 /*yield*/, step('a6', [handBack, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb6', content: 'Report delivered.' }, { type: 'text', text: PRESS }] }])];
            case 24:
                _k.apply(void 0, [_s.sent()]).toEqual(HIDDEN);
                // A message starts it again: a step of its own, and a press after that is the model's too, as its next report is not yet taken
                _l = expect;
                return [4 /*yield*/, step('a6', [handBack, { role: 'user', content: 'Make the left eye bigger.' }])];
            case 25:
                // A message starts it again: a step of its own, and a press after that is the model's too, as its next report is not yet taken
                _l.apply(void 0, [_s.sent()]).toEqual(MODEL);
                _m = expect;
                return [4 /*yield*/, pressedFor('a6', 'The left eye is bigger.')];
            case 26:
                _m.apply(void 0, [_s.sent()]).toEqual(MODEL);
                return [2 /*return*/];
        }
    });
}); });
test("a task that ends its step while its helpers work stays at work, and nothing of Claudopus starts it again or looks in on it: told once that their results come by themselves, it is let go as it stops with a to-do open, may not hand in its result while one works, and each helper's result, in words or handed in, reaches it through Claude Code alone; the chat's turn for the notice of its pause is answered with no model; with its helpers ended its own result goes through and its card is done; stopped by the chat, the helpers a task has at work are stopped with it", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, talk, _a, stopped, resumed, appended, submitted, sent, clock, stepped, files, stop, _b, told, _c, _d, early, fromClaudopus, RESULT, endedNotice, asNotice, quietTurn, answeredQuietly, alone, _e, _f, mixed, _g, _h, list, texts, helperOpen, ownList, _j, before, handed, pressedAfter, askedBefore, _k, _l, _m, chunk, e_2_1, helperNotice, _o, _p, late, _q, _r;
    var _this = this;
    var _s, e_2, _t, _u;
    var _v, _w, _x, _y;
    return __generator(this, function (_z) {
        switch (_z.label) {
            case 0:
                agents = {};
                talk = [];
                _a = world(on, { agents: agents, talk: talk }), stopped = _a.stopped, resumed = _a.resumed, appended = _a.appended, submitted = _a.submitted, sent = _a.sent, clock = _a.clock, stepped = _a.stepped, files = _a.files;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _z.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _z.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _z.sent();
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Mend the nose' })];
            case 4:
                _z.sent();
                stop = function () { return $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }); };
                // With a to-do open and nothing of its own running it may not stop
                _b = expect;
                return [4 /*yield*/, stop()];
            case 5:
                // With a to-do open and nothing of its own running it may not stop
                _b.apply(void 0, [(_z.sent()).block]).toContain('You may not stop here');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 6:
                _z.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' }))];
            case 7:
                _z.sent();
                Object.assign(agents, { a2: 'running', a3: 'running' });
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))];
            case 8:
                told = _z.sent();
                expect(told).toContain('each result comes to you as a message when it ends, even after you end your step');
                _c = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))];
            case 9:
                _c.apply(void 0, [_z.sent()]).toBe('');
                // It ends its step while both work, the to-do still open: let go
                _d = expect;
                return [4 /*yield*/, stop()];
            case 10:
                // It ends its step while both work, the to-do still open: let go
                _d.apply(void 0, [(_z.sent()).block]).toBeUndefined();
                // Its result would leave theirs to the chat: refused while one works, with no command to wait with
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd2', agentId: 'a1', item: 'Mend the nose', state: 'done' })];
            case 11:
                // Its result would leave theirs to the chat: refused while one works, with no command to wait with
                _z.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' })];
            case 12:
                early = (_z.sent());
                expect(early.deny).toContain('Not handed in: 2 helpers of yours are still at work: "Read the nose code"; "Draw the nose"');
                expect(early.deny).not.toMatch(/bin\/helpers|Bash command|TaskStop/);
                fromClaudopus = function () { return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], resumed, true), appended.filter(function (one) { return /^(a1|undefined): /.test(one); }), true), submitted.filter(function (one) { return !one.startsWith('<task-notification>'); }), true), sent, true); };
                // The first helper ends in words, and the task ends its step: Claude Code lists it as over, and its card stays at work
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 13:
                _z.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for the drawing.', durationMs: 1, isAborted: false, turnId: 'h1', reason: 'answer', agentId: 'a1' })
                    // Claude Code then tells the chat it ended without its report. The chat hears nothing more of the pause: the notice is let in,
                    // never dropped (a warning card), with no word of Claudopus's beside it, and its turn is answered with no model (16 Nov evening:
                    // 67 of 152 turns of the chat's were such notices)
                ];
            case 14:
                _z.sent();
                RESULT = 'The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.';
                endedNotice = function (id) {
                    return "<task-notification>\n<task-id>".concat(id, "</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/tasks/").concat(id, ".output</output-file>\n<status>completed</status>\n<summary>Agent \"Fix the nose\" finished</summary>\n<note>A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>\n<result>").concat(RESULT, "\n</result>\n<usage><subagent_tokens>9</subagent_tokens><tool_uses>1</tool_uses><duration_ms>9</duration_ms></usage>\n</task-notification>");
                };
                asNotice = function (text) { return $.prompt.submit({ text: text, wait: false, origin: { kind: 'task-notification' } }); };
                quietTurn = 0;
                answeredQuietly = function (text) { return __awaiter(_this, void 0, void 0, function () {
                    var turnId, asked, said, _a, _b, _c, chunk, e_3_1;
                    var _d, e_3, _e, _f;
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
                                e_3_1 = _g.sent();
                                e_3 = { error: e_3_1 };
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
                                if (e_3) throw e_3.error;
                                return [7 /*endfinally*/];
                            case 12: return [7 /*endfinally*/];
                            case 13: return [2 /*return*/, stepped.length === asked && said.join('') === 'No response requested.'];
                        }
                    });
                }); };
                return [4 /*yield*/, asNotice(endedNotice('a1'))];
            case 15:
                alone = _z.sent();
                _e = expect;
                _f = [alone.drop, (_v = alone.context) !== null && _v !== void 0 ? _v : []];
                return [4 /*yield*/, answeredQuietly(endedNotice('a1'))];
            case 16:
                _e.apply(void 0, [_f.concat([_z.sent()])]).toEqual([undefined, [], true]);
                mixed = "".concat(endedNotice('a1'), "\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command \"Build\" completed (exit code 0)</summary>\n</task-notification>");
                _g = expect;
                return [4 /*yield*/, asNotice(mixed)];
            case 17:
                _h = [(_z.sent()).drop];
                return [4 /*yield*/, answeredQuietly(mixed)];
            case 18:
                _g.apply(void 0, [_h.concat([_z.sent()])]).toEqual([undefined, false]);
                // Its helper draws on for forty minutes, past every time Claudopus once looked in at (5, 12, 24 and 36 minutes): the task is
                // not started, written to or named to the chat, and its card says Working, nothing of the pause or of a quiet helper
                return [4 /*yield*/, clock.advance(40 * 60000)];
            case 19:
                // Its helper draws on for forty minutes, past every time Claudopus once looked in at (5, 12, 24 and 36 minutes): the task is
                // not started, written to or named to the chat, and its card says Working, nothing of the pause or of a quiet helper
                _z.sent();
                expect(fromClaudopus()).toEqual([]);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 20:
                list = _z.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 21:
                texts = (_z.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(texts).toContain('1 working');
                expect(texts).toContain('Fix the nose');
                expect(texts.filter(function (text) { return /looked in on|shown nothing new|Nothing new|told to check|starts Claude again|stuck/i.test(text); })).toEqual([]);
                // The second helper hands in its result. It goes only to the task that started it, never into the chat (Claude Code draws a
                // hand-back it delivers as a box in the chat, where it doubled the task's own words): Claudopus answers the hand-back itself,
                // so Claude Code delivers nothing, and gives the result to the task once, as its helper's, by the helper's title
                // (the engine here would answer "Nothing was sent": that answer is never seen, as the hand-back never reaches it)
                files.set('handback-not-sent', '1');
                // (to-dos of its own are its own: they hold its own hand-back, and are never on the list of the task that started it)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd3', agentId: 'a3', item: 'Draw at every size' })];
            case 22:
                // (to-dos of its own are its own: they hold its own hand-back, and are never on the list of the task that started it)
                _z.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3a', agentId: 'a3', message: 'Half drawn.' })];
            case 23:
                helperOpen = (_z.sent());
                expect(helperOpen.deny).toContain('"Draw at every size"');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd4', agentId: 'a3', item: 'Draw at every size', state: 'done' })];
            case 24:
                ownList = (_z.sent());
                expect(ownList.result).toBe('[x] Draw at every size');
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd5', agentId: 'a1', item: 'Mend the nose', state: 'done' })];
            case 25:
                _j.apply(void 0, [(_z.sent()).result]).toBe('[x] Mend the nose');
                before = { resumed: resumed.length, submitted: submitted.length, appended: appended.length };
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb3', agentId: 'a3', message: 'The nose is drawn at every size.\nSee nose.svg.' })];
            case 26:
                handed = (_z.sent());
                expect([handed.deny, (_w = handed.result) === null || _w === void 0 ? void 0 : _w.message]).toEqual([undefined, expect.stringContaining('Report delivered to the task that started you')]);
                files.delete('handback-not-sent');
                // Never sent from the tool call's own hook, which the task it starts must keep: the hand-back is answered at once, and the
                // result goes to the task from the next hook that may send it (here a measure)
                expect(resumed.slice(before.resumed)).toEqual([]);
                return [4 /*yield*/, clock.advance(1000)];
            case 27:
                _z.sent();
                expect(resumed.slice(before.resumed)).toEqual([expect.stringMatching(/^a1: From Claudopus: your helper "Draw the nose" \(a3\) has finished, and its result follows\.[\s\S]*\n  The nose is drawn at every size\.\n  See nose\.svg\.$/)]);
                pressedAfter = [];
                askedBefore = stepped.length;
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'hb3', name: 'SubagentHandback', input: {} }] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb3', content: 'ok' }] });
                _z.label = 28;
            case 28:
                _z.trys.push([28, 33, 34, 39]);
                _k = true, _l = __asyncValues($.turn.step({ turnId: 'h3p', index: 0, model: 'm', messageCount: 2, agentId: 'a3' }));
                _z.label = 29;
            case 29: return [4 /*yield*/, _l.next()];
            case 30:
                if (!(_m = _z.sent(), _s = _m.done, !_s)) return [3 /*break*/, 32];
                _u = _m.value;
                _k = false;
                chunk = _u;
                if (chunk.kind === 'text')
                    pressedAfter.push(chunk.text);
                _z.label = 31;
            case 31:
                _k = true;
                return [3 /*break*/, 29];
            case 32: return [3 /*break*/, 39];
            case 33:
                e_2_1 = _z.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 39];
            case 34:
                _z.trys.push([34, , 37, 38]);
                if (!(!_k && !_s && (_t = _l.return))) return [3 /*break*/, 36];
                return [4 /*yield*/, _t.call(_l)];
            case 35:
                _z.sent();
                _z.label = 36;
            case 36: return [3 /*break*/, 38];
            case 37:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 38: return [7 /*endfinally*/];
            case 39:
                expect([pressedAfter.join(''), stepped.length]).toEqual(['<system-reminder>Waiting for an answer.</system-reminder>', askedBefore]);
                talk.splice(0, talk.length);
                agents.a3 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'h3', reason: 'answer', agentId: 'a3' })
                    // Claude Code's notice to the chat that the helper ended without its report is nothing of the chat's: no word, no model
                ];
            case 40:
                _z.sent();
                helperNotice = endedNotice('a3');
                _o = expect;
                return [4 /*yield*/, asNotice(helperNotice)];
            case 41:
                _p = [(_x = (_z.sent()).context) !== null && _x !== void 0 ? _x : []];
                return [4 /*yield*/, answeredQuietly(helperNotice)];
            case 42:
                _o.apply(void 0, [_p.concat([_z.sent()])]).toEqual([[], true]);
                return [4 /*yield*/, clock.advance(60000)
                    // The task got it exactly once, and nothing reached the chat's own thread: no prompt to the chat, no line written into it
                ];
            case 43:
                _z.sent();
                // The task got it exactly once, and nothing reached the chat's own thread: no prompt to the chat, no line written into it
                expect(resumed.slice(before.resumed)).toHaveLength(1);
                expect(submitted.slice(before.submitted).filter(function (one) { return !one.startsWith('<task-notification>'); })).toEqual([]);
                expect(appended.slice(before.appended).filter(function (one) { return /^(a1|undefined): /.test(one); })).toEqual([]);
                // With both ended, its own result goes through, and its card is done
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: 'The nose is fixed.' })];
            case 44:
                late = (_z.sent());
                expect([late.deny, (_y = late.result) === null || _y === void 0 ? void 0 : _y.message]).toEqual([undefined, expect.stringContaining('Report delivered to your caller')]);
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '◐ Delivered' })];
                    }); }); })];
            case 45:
                _q.apply(void 0, [_z.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '1 working' })];
            case 46:
                _r.apply(void 0, [_z.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()
                    // Stopped by the chat, a task's helpers at work are stopped with it
                ];
            case 47:
                _z.sent();
                // Stopped by the chat, a task's helpers at work are stopped with it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the ears', prompt: 'fix the ears' }))];
            case 48:
                // Stopped by the chat, a task's helpers at work are stopped with it
                _z.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ear', prompt: 'draw', parentAgentId: 'a4' }))];
            case 49:
                _z.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a4' })];
            case 50:
                _z.sent();
                expect(stopped).toEqual(expect.arrayContaining(['a4', 'a5']));
                return [2 /*return*/];
        }
    });
}); });
test('a task keeps the rules it was started with: a compaction is told to keep them, and neither it nor rules changed since tell the task anything at its next step; the next task starts with the new rules', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, compacts, reads, _b, _c, config, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, compacts = _a.compacts;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the eyes', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'draw them' }))];
            case 3:
                _f.sent();
                expect(prompts[0]).toContain('WORK ROLE');
                reads = [{ tool: 'Read', input: { file_path: '/repo/a' } }, { tool: 'Read', input: { file_path: '/repo/b' } }];
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', reads))];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBe('');
                return [4 /*yield*/, $.session.compact({ trigger: 'auto', agentId: 'a1', messages: [{ role: 'user', text: 'one', toolUses: [] }] })];
            case 5:
                _f.sent();
                expect(compacts[0]).toContain('Keep, word for word, the rules that came after your instructions');
                _c = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', reads))];
            case 6:
                _c.apply(void 0, [_f.sent()]).toBe('');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 7:
                config = _f.sent();
                return [4 /*yield*/, moreShown(config)];
            case 8:
                _f.sent();
                return [4 /*yield*/, pressed(config, 'config-text-work-edit')];
            case 9:
                _f.sent();
                return [4 /*yield*/, config.input({ key: 'config-text-work-input', text: '- Every run says how far it is.' })];
            case 10:
                _f.sent();
                expect(files.get("".concat(MEMORY, "/roles/work.md"))).toBe('- Every run says how far it is.\n');
                return [4 /*yield*/, config.unmount()];
            case 11:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', reads))];
            case 12:
                _d.apply(void 0, [_f.sent()]).toBe('');
                expect((_e = files.get("".concat(MEMORY, "/log.md"))) !== null && _e !== void 0 ? _e : '').not.toContain('handed its rules again');
                // and a task started now gets them
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'draw the nose' }))];
            case 13:
                // and a task started now gets them
                _f.sent();
                expect(prompts.at(-1)).toContain('Every run says how far it is.');
                expect(prompts.at(-1)).not.toContain('WORK ROLE');
                return [2 /*return*/];
        }
    });
}); });
