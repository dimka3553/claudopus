// Work that stops moving: its card says so, the chat is told once, a long step shows on its row, and the log stays plain text
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
test('work and its helpers that get nothing new back for 12 minutes are flagged on the card and told to the chat once; news clears it, and a wait that only prints a new number is no news', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, held, logged, bash, look, stuck, _b, _c, _d, letRelease, _e, _f, letPoll, _g;
    var _this = this;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), clock = _a.clock, held = _a.held, logged = _a.logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'One merger for all pushes', prompt: 'one merger' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Trial work ONE releasing', prompt: 'one', parentAgentId: 'a1', resume: { agentId: 'h1' } }))];
            case 4:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Trial work TWO releasing', prompt: 'two', parentAgentId: 'a1', resume: { agentId: 'h2' } }))];
            case 5:
                _k.sent();
                bash = function (agentId, command, id) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: command }); };
                look = function (fn) { return __awaiter(_this, void 0, void 0, function () {
                    var pane, r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, fn(pane)];
                            case 2:
                                r = _a.sent();
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, r];
                        }
                    });
                }); };
                stuck = function () { return look(function (pane) { return pane.find({ type: 'Text', text: /^Nothing new for / }); }); };
                // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
                return [4 /*yield*/, bash('a1', 'git log', 'p1')];
            case 6:
                // The work waits on its helpers, and they each wait on a start signal only it could give: nothing comes back to any of them
                _k.sent();
                return [4 /*yield*/, bash('h1', 'git status', 'b1')];
            case 7:
                _k.sent();
                return [4 /*yield*/, bash('h2', 'git status', 'b2')];
            case 8:
                _k.sent();
                return [4 /*yield*/, clock.advance(11 * 60000)];
            case 9:
                _k.sent();
                _b = expect;
                return [4 /*yield*/, stuck()];
            case 10:
                _b.apply(void 0, [_k.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2 * 60000)];
            case 11:
                _k.sent();
                _c = expect;
                return [4 /*yield*/, stuck()];
            case 12:
                _c.apply(void 0, [(_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.props.color]).toBe('#E5A50A');
                _d = expect;
                return [4 /*yield*/, stuck()];
            case 13:
                _d.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.text]).toMatch(/^Nothing new for 1[23] min\.$/);
                expect(logged.filter(function (line) { return line.includes('"One merger for all pushes" has had nothing new'); })).toHaveLength(1);
                // Looked at again, nothing more is said
                return [4 /*yield*/, clock.advance(60000)];
            case 14:
                // Looked at again, nothing more is said
                _k.sent();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(1);
                // Something new comes back: the flag goes at the next look
                void bash('h1', 'hold release', 'b3');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('release')];
                    }); }); })];
            case 15:
                letRelease = _k.sent();
                letRelease === null || letRelease === void 0 ? void 0 : letRelease('released Thing 0.1.1');
                _e = expect;
                return [4 /*yield*/, stuck()];
            case 16:
                _e.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(25000)];
            case 17:
                _k.sent();
                _f = expect;
                return [4 /*yield*/, stuck()];
            case 18:
                _f.apply(void 0, [_k.sent()]).toBeUndefined();
                // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again
                void bash('h1', 'hold poll', 'b4');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('poll')];
                    }); }); })];
            case 19:
                letPoll = _k.sent();
                letPoll === null || letPoll === void 0 ? void 0 : letPoll('released Thing 0.1.7');
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 20:
                _k.sent();
                _g = expect;
                return [4 /*yield*/, stuck()];
            case 21:
                _g.apply(void 0, [_k.sent()]).toBeDefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(2);
                return [2 /*return*/];
        }
    });
}); });
test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, held, rows, _b, _c, letSearch, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), clock = _a.clock, held = _a.held;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Lay out the rows', prompt: 'lay out' }))];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } }))];
            case 3:
                _e.sent();
                void $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' });
                rows = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, r, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                                // The command a helper waits on is a row under it, in its own words, after the word that says it is a command
                                // (its name a button, as a press opens its output)
                            ];
                            case 1:
                                pane = _c.sent();
                                _a = [[]];
                                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                            case 2:
                                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 3:
                                r = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true])).filter(function (text) { return /^(Command · hold search|.* running · .*)$/.test(text); });
                                return [4 /*yield*/, pane.unmount()];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, r];
                        }
                    });
                }); };
                return [4 /*yield*/, clock.advance(90000)];
            case 4:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, rows()];
            case 5:
                _b.apply(void 0, [_e.sent()]).toEqual([]);
                return [4 /*yield*/, clock.advance(70000)];
            case 6:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, rows()];
            case 7:
                _c.apply(void 0, [_e.sent()]).toEqual(['Command · hold search']);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('search')];
                    }); }); })];
            case 8:
                letSearch = _e.sent();
                letSearch === null || letSearch === void 0 ? void 0 : letSearch('found it');
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _e.sent();
                _d = expect;
                return [4 /*yield*/, rows()];
            case 10:
                _d.apply(void 0, [_e.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, logged, held, _loop_1, _i, _b, part, look, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                agents = {};
                kinds = { a2: 'general-purpose' };
                _a = world(on, { agents: agents, kinds: kinds }), clock = _a.clock, logged = _a.logged, held = _a.held;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))
                    // Its first run, moving all along, takes longer than the stuck check waits; then it rests
                ];
            case 2:
                _e.sent();
                _loop_1 = function (part) {
                    var letGo;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, clock.advance(5 * 60000)];
                            case 1:
                                _f.sent();
                                void $.tool.call({ tool: 'Bash', tool_use_id: "e-".concat(part), agentId: 'a1', command: "hold ".concat(part) });
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, held.get(part)];
                                    }); }); })];
                            case 2:
                                letGo = _f.sent();
                                letGo === null || letGo === void 0 ? void 0 : letGo("drew the ".concat(part));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = ['left ear', 'right ear', 'lobes'];
                _e.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                part = _b[_i];
                return [5 /*yield**/, _loop_1(part)];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 7:
                _e.sent();
                return [4 /*yield*/, clock.advance(30 * 60000)];
            case 8:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } }))];
            case 9:
                _e.sent();
                return [4 /*yield*/, clock.advance(25000)];
            case 10:
                _e.sent();
                look = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for / })];
                            case 2:
                                r = _a.sent();
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, r];
                        }
                    });
                }); };
                _c = expect;
                return [4 /*yield*/, look()];
            case 11:
                _c.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Bigger now.', durationMs: 1, isAborted: false, turnId: 't1b', reason: 'answer', agentId: 'a1' })
                    // Held on a watch it started after a report as long as one: its card goes on, but it is not stuck
                ];
            case 12:
                _e.sent();
                // Held on a watch it started after a report as long as one: its card goes on, but it is not stuck
                agents.a2 = 'waiting';
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the build', prompt: 'watch' }))];
            case 13:
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: "The build is watched. ".concat('Every check passes and it is pushed. '.repeat(15)), durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })];
            case 14:
                _e.sent();
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 15:
                _e.sent();
                _d = expect;
                return [4 /*yield*/, look()];
            case 16:
                _d.apply(void 0, [_e.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('work asking the person something waits on them and is never flagged', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, logged, pane, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on), clock = _a.clock, logged = _a.logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Release it', prompt: 'release it' }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Not now'] })];
            case 3:
                _c.sent();
                return [4 /*yield*/, clock.advance(30 * 60000)];
            case 4:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                pane = _c.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for / })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(0);
                return [4 /*yield*/, pane.unmount()];
            case 7:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the log is added to, never rewritten whole, and the empty bytes earlier versions left in it are taken out', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, text;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on).files;
                files.set("".concat(MEMORY, "/log.md"), "2026-01-01T00:00:00.000Z start one\0\0\x002026-01-01T00:00:01.000Z start two\n");
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                text = (_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '';
                expect(text).not.toContain('\u0000');
                expect(text.startsWith('2026-01-01T00:00:00.000Z start one2026-01-01T00:00:01.000Z start two\n')).toBe(true);
                expect(text).toMatch(/Z start engine-id in \/repo\n$/);
                return [2 /*return*/];
        }
    });
}); });
