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
                _g.apply(void 0, [_h.sent()]).toContain('Two long runs of one kind (npm test)');
                return [2 /*return*/];
        }
    });
}); });
test('the work waits for its helpers with a command of its own: a file it waits on names the helpers running and how each is doing, and changes as one ends', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, files, roll, told, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' }))];
            case 5:
                _c.sent();
                roll = function () { var _a; return (_a = files.get("".concat(MEMORY, "/helpers/a1.txt"))) !== null && _a !== void 0 ? _a : ''; };
                expect(roll().split('\n')[0]).toBe('running: a2,a3');
                expect(roll()).toContain('"Read the nose code" (a2): running');
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'Read the nose code' } }, { tool: 'Agent', input: { description: 'Draw the nose' } }]))];
            case 6:
                told = _c.sent();
                expect(told).toContain('Your helpers run in the background');
                expect(told).toMatch(/bin\/helpers' '\/home\/sam\/\.claude\/claudopus\/helpers\/a1\.txt'/);
                _b = expect;
                return [4 /*yield*/, toldOf(batch($, 'a1', [{ tool: 'Agent', input: { description: 'A third' } }, { tool: 'Read' }]))];
            case 7:
                _b.apply(void 0, [_c.sent()]).toBe('');
                // Five minutes with nothing new from either: the line names them as quiet, so a wait on it comes back
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 8:
                // Five minutes with nothing new from either: the line names them as quiet, so a wait on it comes back
                _c.sent();
                expect(roll().split('\n')[0]).toBe('running: a2,a3 quiet: a2,a3');
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 9:
                _c.sent();
                return [4 /*yield*/, clock.advance(21000)];
            case 10:
                _c.sent();
                expect(roll().split('\n')[0]).toBe('running: a3 quiet: a3');
                expect(roll()).toContain('"Read the nose code" (a2): ended');
                return [2 /*return*/];
        }
    });
}); });
test('work that tries to end while a helper of its runs is held back, and lets go once it has ended', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, clock, stop, _a, handback, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                agents = {};
                clock = world(on, { agents: agents }).clock;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the nose code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _c.sent();
                stop = function () { return $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }); };
                _a = expect;
                return [4 /*yield*/, stop()];
            case 5:
                _a.apply(void 0, [(_c.sent()).block]).toContain('a helper still running in the background');
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Fixed.' })];
            case 6:
                handback = _c.sent();
                expect(String(handback.deny)).toContain('Do not finish yet');
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'nose.ts', durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 7:
                _c.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 8:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, stop()];
            case 9:
                _b.apply(void 0, [(_c.sent()).block]).toBeUndefined();
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 helper quiet for 5\+ min, the work was told$/ })];
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
test('a helper that already answered holds nothing, a report given lets the end go, and work stopped takes its running helpers with it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, stopped, stop, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                agents = {};
                stopped = world(on, { agents: agents }).stopped;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix it' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Serve the page', prompt: 'serve', parentAgentId: 'a1' }))];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw', parentAgentId: 'a1' }))];
            case 5:
                _b.sent();
                stop = function () { return $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }); };
                // The server helper answered and left its server running: it still works, but holds nothing; the other still does
                agents.a2 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: "The page is served on port 3100, and it keeps running for you to look at. ".concat('It shows the nose as drawn, at every size. '.repeat(14)), durationMs: 1, isAborted: false, turnId: 'h2', reason: 'answer', agentId: 'a2' })];
            case 6:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, stop()];
            case 7:
                _a.apply(void 0, [(_b.sent()).block]).toContain('a helper still running');
                // Stopped from its card or by the chat, the work's running helpers are stopped with it
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 8:
                // Stopped from its card or by the chat, the work's running helpers are stopped with it
                _b.sent();
                expect(stopped).toEqual(expect.arrayContaining(['a1', 'a3']));
                return [2 /*return*/];
        }
    });
}); });
