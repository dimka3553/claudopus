// A task runs only what Claude Code tracks: a command that detaches what it starts is refused, a wait is a watch in the background
// with a row of its own, and a server it left for the person stays under its card once it has handed in its result (on 15 Nov a
// launcher started with nohup but no `echo $!` drew 8 pages at once with 56 GB and its card showed no run at all)
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
var leftTexts = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, columns) {
        var list, all, _a, _b;
        if (columns === void 0) { columns = 140; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: columns }), surface: 'terminal' }))];
                case 1:
                    list = _c.sent();
                    _a = [[]];
                    return [4 /*yield*/, list.findAll({ type: 'Text' })];
                case 2:
                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }), true]))];
                    return [4 /*yield*/, list.findAll({ type: 'Button' })];
                case 3:
                    all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                    return [4 /*yield*/, list.unmount()];
                case 4:
                    _c.sent();
                    return [2 /*return*/, all];
            }
        });
    });
};
var leftStart = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the pages', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the pages', prompt: 'draw the pages' }))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var NO_DETACH_SAID = 'Not run: this command detaches what it starts (nohup, setsid, disown or a trailing &)';
test('a command that detaches what it starts, under nohup or setsid, disowned, or sent off with an & with or without echo $!, is refused held open and in the background, told to send the command itself in the background; an && between commands, a redirect with an & in it, an & inside quotes or a here-document and a command for another Mac are not, and nothing detached has a row (17 Nov: detached drawings failed at once, and nothing told their task)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, denied, refused, allowed, said, _i, refused_1, command, _a, _b, passed, _c, allowed_1, command, _d, _e, inBackground, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                world(on, { agents: { a1: 'running' } });
                return [4 /*yield*/, leftStart($)];
            case 1:
                _g.sent();
                n = 0;
                denied = function (command_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([command_1], args_1, true), void 0, function (command, more) {
                        var _a;
                        if (more === void 0) { more = {}; }
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: "d".concat((n += 1)), agentId: 'a1', command: command, description: 'Run the drawing of the pages' }, more))];
                                case 1: return [2 /*return*/, (_a = (_b.sent()).deny) !== null && _a !== void 0 ? _a : ''];
                            }
                        });
                    });
                };
                refused = [
                    'nohup python draw.py > draw.log 2>&1',
                    'cd /w && nohup bash ./poll.sh > poll.log 2>&1 & echo $!',
                    'setsid python draw.py',
                    'python draw.py > draw.log & disown',
                    'python draw.py; disown',
                    'python draw.py &',
                    'python draw.py > draw.log 2>&1 &',
                    'python draw.py & echo $!',
                    'for i in 0 1 2 3; do python batch.py $i > /s/batch_$i.log 2>&1 & done; echo started',
                    'cd /w && (python pool.py > pool.log 2>&1 &)',
                    'python build_scene.py &\nsleep 1; echo started',
                ];
                allowed = [
                    'npm run build && node shot.mjs desktop.png',
                    'python draw.py > draw.log 2>&1',
                    'python draw.py 2>&1 | tail -n 5',
                    'echo "drawing failed" >&2',
                    'python draw.py &> draw.log',
                    'python draw.py &>> draw.log',
                    'echo "drawn & checked"',
                    "git commit -m 'Draw & check the pages'",
                    'grep -c "nohup" notes.md',
                    "cat > run.sh <<'EOF'\npython draw.py &\nEOF",
                    'ssh studio "nohup python draw.py > draw.log 2>&1 &"',
                ];
                said = {};
                _i = 0, refused_1 = refused;
                _g.label = 2;
            case 2:
                if (!(_i < refused_1.length)) return [3 /*break*/, 5];
                command = refused_1[_i];
                _a = said;
                _b = command;
                return [4 /*yield*/, denied(command)];
            case 3:
                _a[_b] = (_g.sent()).slice(0, NO_DETACH_SAID.length);
                _g.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                expect(said).toEqual(Object.fromEntries(refused.map(function (command) { return [command, NO_DETACH_SAID]; })));
                passed = {};
                _c = 0, allowed_1 = allowed;
                _g.label = 6;
            case 6:
                if (!(_c < allowed_1.length)) return [3 /*break*/, 9];
                command = allowed_1[_c];
                _d = passed;
                _e = command;
                return [4 /*yield*/, denied(command)];
            case 7:
                _d[_e] = !(_g.sent()).includes('detaches');
                _g.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9:
                expect(passed).toEqual(Object.fromEntries(allowed.map(function (command) { return [command, true]; })));
                return [4 /*yield*/, denied('nohup python draw.py > draw.log 2>&1 &', { run_in_background: true })];
            case 10:
                inBackground = _g.sent();
                expect(inBackground.startsWith(NO_DETACH_SAID)).toBe(true);
                expect(inBackground).toContain('Send the command itself, without those, with `run_in_background: true`');
                // Nothing it was refused has a row on its card
                _f = expect;
                return [4 /*yield*/, leftTexts($)];
            case 11:
                // Nothing it was refused has a row on its card
                _f.apply(void 0, [(_g.sent()).filter(function (text) { return /Run the drawing of the pages|draw\.py/.test(text); })]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('a wait for something far away is a watch: sent in the background it runs, with a row of kind Watch under its card that asks for no progress line, and a Monitor is one too; held open it is refused and told to send it in the background, and a bare sleep, a wait by the clock, is refused held open and in the background', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, call, WAIT, held, sleeps, passed, _i, _a, _b, n, _c, command, more, _d, _e, _f, _g, rows, later, _h, _j;
    var _this = this;
    var _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                clock = world(on, { agents: { a1: 'running' }, jobs: { output: function () { return ''; }, wroteAt: function () { return 0; } } }).clock;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _m.sent();
                call = function (id, input) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: 'a1' }, input))];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                WAIT = 'until az ml job show -n fit-7 --query status -o tsv | grep -q Completed; do sleep 30; done';
                return [4 /*yield*/, call('w1', { command: WAIT, description: 'Check that the cloud job has ended' })];
            case 2:
                held = (_k = (_m.sent()).deny) !== null && _k !== void 0 ? _k : '';
                expect(held).toContain('Not run: this command only waits, and held open it keeps you from everything else');
                expect(held).toContain('`run_in_background: true`');
                sleeps = [['sleep 300', {}], ['sleep 300', { run_in_background: true }], ['sleep 45 && echo awake', {}], ['sleep 10m', { run_in_background: true }]];
                passed = [];
                _i = 0, _a = sleeps.entries();
                _m.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                _b = _a[_i], n = _b[0], _c = _b[1], command = _c[0], more = _c[1];
                _e = (_d = passed).push;
                return [4 /*yield*/, call("s".concat(n), __assign({ command: command, description: 'Run a pause before the next look' }, more))];
            case 4:
                _e.apply(_d, [((_l = (_m.sent()).deny) !== null && _l !== void 0 ? _l : '').slice(0, 41)]);
                _m.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                expect(passed).toEqual(sleeps.map(function () { return 'Not run: this command only passes time, a'; }));
                _f = expect;
                return [4 /*yield*/, leftTexts($)];
            case 7:
                _f.apply(void 0, [(_m.sent()).filter(function (text) { return /cloud job|pause before/.test(text); })]).toEqual([]);
                // In the background the same wait runs: a watch, though its words do not begin with Watch, and nothing asks it for a progress line
                _g = expect;
                return [4 /*yield*/, call('w2', { command: WAIT, description: 'Check that the cloud job has ended', run_in_background: true, timeout: 600000 })];
            case 8:
                // In the background the same wait runs: a watch, though its words do not begin with Watch, and nothing asks it for a progress line
                _g.apply(void 0, [(_m.sent()).deny]).toBeUndefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.includes('Check that the cloud job has ended'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 9:
                rows = _m.sent();
                expect(rows === null || rows === void 0 ? void 0 : rows.filter(function (text) { return text.includes('Check that the cloud job has ended'); })).toEqual(['Watch · Check that the cloud job has ended']);
                // Silent for minutes, it is watching, never a command that has said nothing or has no progress
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 10:
                // Silent for minutes, it is watching, never a command that has said nothing or has no progress
                _m.sent();
                return [4 /*yield*/, leftTexts($)];
            case 11:
                later = _m.sent();
                expect(later.some(function (text) { return text.startsWith('Watching'); })).toBe(true);
                expect(later.filter(function (text) { return /progress|nothing for|silent|said nothing/i.test(text); })).toEqual([]);
                // A Monitor that waits for the same is a watch too
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: WAIT, description: 'the second cloud job to end', timeout_ms: 600000 })];
            case 12:
                // A Monitor that waits for the same is a watch too
                _h.apply(void 0, [(_m.sent()).deny]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return text.includes('the second cloud job to end'); })];
                        }
                    }); }); })];
            case 13:
                _j.apply(void 0, [_m.sent()]).toBe('Watch · the second cloud job to end');
                return [2 /*return*/];
        }
    });
}); });
test('a task that leaves a preview server going for the person is done only once it hands in its result, the server no bar to that where a command that ends by itself is, and the server keeps its row with its Stop under the done card (18 Nov: a site task\'s card showed done for half an hour, no result ever came)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, resumed, notified, call, isDone, _b, _c, _d, _e, _f, _g, list, _h, _j, _k;
    var _this = this;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                agents = { a1: 'running' };
                _a = world(on, { agents: agents, jobs: { output: function () { return ''; }, wroteAt: function () { return 0; } } }), clock = _a.clock, resumed = _a.resumed, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'build and deploy the site', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Build and deploy the site', prompt: 'build it' }))];
            case 3:
                _l.sent();
                call = function (tool_1, id_1) {
                    var args_1 = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args_1[_i - 2] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([tool_1, id_1], args_1, true), void 0, function (tool, id, input) {
                        if (input === void 0) { input = {}; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input))];
                                case 1: return [2 /*return*/, (_a.sent())];
                            }
                        });
                    });
                };
                isDone = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, leftTexts($)];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (text) { return text === '◐ Delivered' || /^Done · /.test(text); })];
                    }
                }); }); };
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Build the full page', state: 'done' })];
            case 4:
                _l.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Put it live', state: 'doing' })
                    // The server it leaves going is sent to the background as itself, and has its row
                ];
            case 5:
                _l.sent();
                // The server it leaves going is sent to the background as itself, and has its row
                _b = expect;
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npx vite preview --port 4174', description: 'Serve the preview of the page', run_in_background: true })];
            case 6:
                // The server it leaves going is sent to the background as itself, and has its row
                _b.apply(void 0, [(_l.sent()).deny]).toBeUndefined();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text.startsWith('Serve the preview of the page'); }) || undefined)];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [_l.sent()]).toBe(true);
                // Its step ends with words and a to-do open, only the server running: no card is done, nobody is told it is ready, nothing starts it
                return [4 /*yield*/, $.turn.complete({ answer: "Waiting for the checker's report, which is due in the next message.", durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 8:
                // Its step ends with words and a to-do open, only the server running: no card is done, nobody is told it is ready, nothing starts it
                _l.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 9:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, isDone()];
            case 10:
                _d.apply(void 0, [_l.sent()]).toBe(false);
                expect(notified).toEqual([]);
                expect(resumed).toEqual([]);
                // With a command that ends by itself still running, its result is not taken; the server alone is no bar
                return [4 /*yield*/, call('mcp__claudopus__todo', 't3', { item: 'Put it live', state: 'done' })];
            case 11:
                // With a command that ends by itself still running, its result is not taken; the server alone is no bar
                _l.sent();
                return [4 /*yield*/, call('Bash', 'b2', { command: 'hold deploy', description: 'Upload the page to the host', run_in_background: true })];
            case 12:
                _l.sent();
                _e = expect;
                return [4 /*yield*/, call('SubagentHandback', 'hb0', { message: 'The full page is live.' })];
            case 13:
                _e.apply(void 0, [(_l.sent()).deny]).toContain('Not handed in: a command of yours still runs: "');
                return [4 /*yield*/, call('TaskStop', 'x1', { task_id: 'bg-b2' })];
            case 14:
                _l.sent();
                _f = expect;
                return [4 /*yield*/, call('SubagentHandback', 'hb1', { message: 'The full page is live, and its preview is served on port 4174.' })];
            case 15:
                _f.apply(void 0, [(_l.sent()).deny]).toBeUndefined();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })];
            case 16:
                _l.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isDone()];
                            case 1: return [2 /*return*/, ((_a.sent()) || undefined)];
                        }
                    }); }); })];
            case 17:
                _g.apply(void 0, [_l.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(2000)];
            case 18:
                _l.sent();
                expect(notified.map(function (line) { return line.split(' | ')[1]; })).toEqual(['The full page is live, and its preview is served on port 4174.']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 19:
                list = _l.sent();
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 20:
                _j = (_l.sent()).filter(function (b) { return String(b.props.label).startsWith('Serve the preview of the page'); }).length;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 21:
                _h.apply(void 0, [_j + (_l.sent()).filter(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('Serve the preview of the page'); }).length]).toBeGreaterThan(0);
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 22:
                _k.apply(void 0, [(_l.sent()).filter(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); }).length]).toBe(1);
                return [4 /*yield*/, list.unmount()];
            case 23:
                _l.sent();
                expect(resumed).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
