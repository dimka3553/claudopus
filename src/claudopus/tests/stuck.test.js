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
    var _a, keep, settle, clock, held, logged, resumed, appended, bash, look, stuck, _b, _c, _d, letRelease, _e, _f, letPoll, _g;
    var _this = this;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held, logged = _a.logged, resumed = _a.resumed, appended = _a.appended;
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
                stuck = function () { return look(function (pane) { return pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ }); }); };
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
                _d.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.text]).toMatch(/^Nothing new for 1[23]m\.$/);
                // Said to the chat's model alone: the card shows it, and the chat shows nothing of a task's but its own words (18 Nov)
                expect(logged.filter(function (line) { return line.includes('Nothing new from'); })).toEqual([]);
                expect(appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).filter(function (line) { return line.includes("Nothing new from \"One merger for all pushes\""); })).toHaveLength(1);
                // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
                expect(appended.filter(function (line) { return line.includes("Nothing new from \"One merger for all pushes\"") && line.includes('you may send it a message asking what it waits on'); })).toHaveLength(1);
                expect(logged.filter(function (line) { return line.includes('you may send it a message'); })).toEqual([]);
                // Looked at again, nothing more is said
                return [4 /*yield*/, clock.advance(60000)];
            case 14:
                // Looked at again, nothing more is said
                _k.sent();
                expect(appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).filter(function (line) { return line.includes('Nothing new from'); })).toHaveLength(1);
                // Something new comes back: the flag goes at the next look
                void keep(bash('h1', 'hold release', 'b3'));
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
                void keep(bash('h1', 'hold poll', 'b4'));
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
                expect(appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).filter(function (line) { return line.includes('Nothing new from'); })).toHaveLength(2);
                expect(resumed.filter(function (line) { return line.includes('stopped partway through'); })).toEqual([]);
                return [4 /*yield*/, settle()];
            case 22:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('stuck work the engine no longer runs had stopped partway through: the mod starts it again at once and tells the chat; work whose step ended while all its helpers sit silent is, on a fixed schedule, started again to check on them at 12 minutes and to hand back what it has at 24, and the chat is told plainly at 36; its report then goes through, the silent helpers stopped; helpers at work, rendering in the background or printing a moving frame count, are left alone', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var all, agents, kinds, _a, keep, settle, clock, held, logged, resumed, stopped, appended, submitted, bash, _i, _b, id, ends, _c, _d, id, frame, frames, nudges, _e, _f, _g, pane, texts, _h;
    var _this = this;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                all = { a1: 'idle', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running', a7: 'running' };
                agents = {};
                kinds = Object.fromEntries(Object.keys(all).map(function (id) { return [id, 'general-purpose']; }));
                _a = world(on, { agents: agents, kinds: kinds, parents: { a3: 'a2', a5: 'a4', a7: 'a6' }, jobs: { output: function () { return 'rendering frames\n'; }, wroteAt: function (file) { return (file.endsWith('/bg-r-a5.output') ? clock.now() - 60000 : 0); } } }), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held, logged = _a.logged, resumed = _a.resumed, stopped = _a.stopped, appended = _a.appended, submitted = _a.submitted;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fit the video', prompt: 'fit' }))];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lids', prompt: 'lids' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the lids', prompt: 'render', parentAgentId: 'a2' }))];
            case 4:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Film the town', prompt: 'film' }))];
            case 5:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the town', prompt: 'render', parentAgentId: 'a4' }))];
            case 6:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Score the faces', prompt: 'score' }))];
            case 7:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Score each frame', prompt: 'frames', parentAgentId: 'a6' }))];
            case 8:
                _k.sent();
                Object.assign(agents, all);
                bash = function (agentId, command, id) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: command }); };
                _i = 0, _b = ['a1', 'a2', 'a3', 'a4', 'a6'];
                _k.label = 9;
            case 9:
                if (!(_i < _b.length)) return [3 /*break*/, 12];
                id = _b[_i];
                return [4 /*yield*/, bash(id, 'git status', "s-".concat(id))
                    // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints a new frame count
                ];
            case 10:
                _k.sent();
                _k.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12: 
            // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints a new frame count
            return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r-a5', agentId: 'a5', command: 'hold render', description: 'Render the town (about 2 h)', run_in_background: true })
                // The three tasks end their steps to wait for their helpers
            ];
            case 13:
                // a5 renders in a command of its own in the background; a7 runs a call every few minutes that prints a new frame count
                _k.sent();
                ends = function (id, turnId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                agents[id] = 'completed';
                                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: id })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                _c = 0, _d = ['a2', 'a4', 'a6'];
                _k.label = 14;
            case 14:
                if (!(_c < _d.length)) return [3 /*break*/, 17];
                id = _d[_c];
                return [4 /*yield*/, ends(id, "e-".concat(id))];
            case 15:
                _k.sent();
                _k.label = 16;
            case 16:
                _c++;
                return [3 /*break*/, 14];
            case 17:
                frame = 0;
                frames = function (minutes) { return __awaiter(_this, void 0, void 0, function () {
                    var at, letFrame;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                at = 0;
                                _a.label = 1;
                            case 1:
                                if (!(at < minutes)) return [3 /*break*/, 5];
                                void keep(bash('a7', 'hold frame', "f-".concat((frame += 1))));
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, held.get('frame')];
                                    }); }); })];
                            case 2:
                                letFrame = _a.sent();
                                held.delete('frame');
                                letFrame === null || letFrame === void 0 ? void 0 : letFrame("frame ".concat(frame * 100, "/9000"));
                                return [4 /*yield*/, clock.advance(4 * 60000)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                at += 4;
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, frames(13)];
            case 18:
                _k.sent();
                expect(resumed.filter(function (line) { return line.includes('stopped partway through'); })).toHaveLength(1);
                // Told to the chat's model, not shown: the card says so
                expect(appended.filter(function (line) { return line.includes('"Fit the video" stopped partway') && line.includes('started it again'); })).toHaveLength(1);
                expect(logged.filter(function (line) { return line.includes('stopped partway'); })).toEqual([]);
                nudges = function (id) {
                    if (id === void 0) { id = 'a2'; }
                    return resumed.filter(function (line) { return line.startsWith("".concat(id, ": From Claudopus:")) && line.includes('helpers'); });
                };
                expect(nudges()).toHaveLength(1);
                expect(nudges()[0]).toMatch(/^a2: From Claudopus: nothing new has come back from your helpers for 1[2-6] min while your step had ended: "[^"]+" \(a3\)\. Ask each with SendMessage/);
                expect(appended.filter(function (line) { return line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('Claudopus started Claude again and asked it to check on them.'); })).toHaveLength(1);
                // Until then it may not hand back while its helper runs
                _e = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-early', agentId: 'a2', message: 'Lids drawn.' })];
            case 19:
                // Until then it may not hand back while its helper runs
                _e.apply(void 0, [(_k.sent()).deny]).toContain("Don't hand back your report yet");
                // It asks its helper, which never answers, and ends its step again: a step and a message start nothing over
                agents.a2 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-a2', agentId: 'a2', to: 'a3', message: 'What are you doing?' })];
            case 20:
                _k.sent();
                return [4 /*yield*/, ends('a2', 'e-a2b')];
            case 21:
                _k.sent();
                return [4 /*yield*/, bash('a1', 'git status', 's-a1-again')];
            case 22:
                _k.sent();
                return [4 /*yield*/, frames(13)];
            case 23:
                _k.sent();
                expect(resumed.filter(function (line) { return line.includes('stopped partway through'); })).toHaveLength(1);
                // 24 minutes on: started again, once, to hand back what it has; a message from the chat then takes nothing back
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, nudges().length === 2 || undefined];
                    }); }); })];
            case 24:
                // 24 minutes on: started again, once, to hand back what it has; a message from the chat then takes nothing back
                _f.apply(void 0, [_k.sent()]).toBe(true);
                expect(nudges()[1]).toContain('hand back your report now with what you have');
                expect(appended.filter(function (line) { return line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"') && line.endsWith('asked it to send what it has now.'); })).toHaveLength(1);
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm-chat', to: 'a2', message: 'Carry on.' })];
            case 25:
                _k.sent();
                agents.a2 = 'completed';
                // 36 minutes on, still not handed back: no third start; the chat is told plainly it is stuck and may write to it, and the card says so
                return [4 /*yield*/, frames(13)];
            case 26:
                // 36 minutes on, still not handed back: no third start; the chat is told plainly it is stuck and may write to it, and the card says so
                _k.sent();
                expect(nudges()).toHaveLength(2);
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).find(function (line) { return line.startsWith('"Draw the lids" is stuck: nothing new from its helpers'); })];
                    }); }); })];
            case 27:
                _g.apply(void 0, [_k.sent()]).toBeDefined();
                expect(logged.filter(function (line) { return line.includes('"Draw the lids" is stuck'); })).toEqual([]);
                expect(appended.filter(function (line) { return line.includes('"Draw the lids" is stuck') && line.includes('you may send it a message'); })).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 28:
                pane = _k.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 29:
                texts = (_k.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; });
                return [4 /*yield*/, pane.unmount()
                    // The card says it is stuck, in amber, and nothing of what Claudopus did about it (18 Nov)
                ];
            case 30:
                _k.sent();
                // The card says it is stuck, in amber, and nothing of what Claudopus did about it (18 Nov)
                expect(texts.some(function (text) { return /^Nothing new for \d+m\./.test(text); })).toBe(true);
                expect(texts.some(function (text) { return /Claudopus asked|told the chat/.test(text); })).toBe(false);
                // Helpers at work are never taken for silent: their tasks are not started again, and its card says nothing of their work;
                // with nothing new coming back, the chat is told once that its helpers still run something
                expect([nudges('a4'), nudges('a6')]).toEqual([[], []]);
                expect(appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).filter(function (line) { return line.includes('"Film the town"'); })).toEqual([expect.stringMatching(/^Nothing new from "Film the town" for 3\dm, though its helpers are still running something\./)]);
                expect(texts.filter(function (text) { return text === 'Waiting for its helpers'; })).toEqual([]);
                // Its report goes through while its helpers run: the silent one is stopped with it, those at work never are
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb-late', agentId: 'a2', message: 'Lids drawn; rendering never ended.' })];
            case 31:
                // Its report goes through while its helpers run: the silent one is stopped with it, those at work never are
                _h.apply(void 0, [(_k.sent()).deny]).toBeUndefined();
                expect(stopped).toContain('a3');
                expect(stopped.filter(function (id) { return id === 'a5' || id === 'a7'; })).toEqual([]);
                // The helper Claudopus stopped tells the chat nothing as it ends, though it ends with words
                return [4 /*yield*/, $.turn.complete({ answer: 'Half the lids rendered.', durationMs: 1, isAborted: false, turnId: 'e-a3', reason: 'answer', agentId: 'a3' })];
            case 32:
                // The helper Claudopus stopped tells the chat nothing as it ends, though it ends with words
                _k.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 33:
                _k.sent();
                expect(__spreadArray(__spreadArray([], appended, true), submitted, true).filter(function (line) { return line.includes('came after the task'); })).toEqual([]);
                (_j = held.get('render')) === null || _j === void 0 ? void 0 : _j('done');
                return [4 /*yield*/, settle()];
            case 34:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the schedule for silent helpers keeps its time: each step comes though the last never reached the task, and a bare call or a message does not start it over; a helper printing something different does, and the leave to hand back already given stays', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, unresumable, _a, keep, settle, clock, held, logged, resumed, appended, _i, _b, id, said, _c, letFrame, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                agents = {};
                kinds = { a1: 'general-purpose', a2: 'general-purpose' };
                unresumable = new Set(['a1']);
                _a = world(on, { agents: agents, kinds: kinds, parents: { a2: 'a1' }, unresumable: unresumable }), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held, logged = _a.logged, resumed = _a.resumed, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lids', prompt: 'lids' }))];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' }))];
            case 3:
                _f.sent();
                Object.assign(agents, { a1: 'running', a2: 'running' });
                _i = 0, _b = ['a1', 'a2'];
                _f.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                id = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "s-".concat(id), agentId: id, command: 'git status' })];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: 'e1', reason: 'answer', agentId: 'a1' })];
            case 8:
                _f.sent();
                said = function () { return appended.filter(function (line) { return line.startsWith('undefined: Nothing new from the helpers of "Draw the lids"'); }); };
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 9:
                _f.sent();
                expect(said()).toHaveLength(1);
                expect(resumed.filter(function (line) { return line.startsWith('a1:'); })).toEqual([]);
                // A call that says what it said before, and a message from the chat, start nothing over: the order to hand back comes at 24
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n-a2', agentId: 'a2', command: 'git status' })];
            case 10:
                // A call that says what it said before, and a message from the chat, start nothing over: the order to hand back comes at 24
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'How is it going?' })];
            case 11:
                _f.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, clock.advance(12 * 60000)];
            case 12:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, said().length === 2 || undefined];
                    }); }); })];
            case 13:
                _c.apply(void 0, [_f.sent()]).toBe(true);
                expect(said()[1]).toContain('asked it to send what it has now');
                // The helper prints something different: the schedule starts over, its check-in 12 minutes on, and the leave stays
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'a2', command: 'hold frame' }));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('frame')];
                    }); }); })];
            case 14:
                letFrame = _f.sent();
                letFrame === null || letFrame === void 0 ? void 0 : letFrame('frame 100/9000');
                return [4 /*yield*/, clock.advance(11 * 60000)];
            case 15:
                _f.sent();
                expect(said()).toHaveLength(2);
                return [4 /*yield*/, clock.advance(2 * 60000)];
            case 16:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, said().length === 3 || undefined];
                    }); }); })];
            case 17:
                _d.apply(void 0, [_f.sent()]).toBe(true);
                expect(said()[2]).toContain('asked it to check on them');
                _e = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: 'Lids drawn.' })];
            case 18:
                _e.apply(void 0, [(_f.sent()).deny]).toBeUndefined();
                return [4 /*yield*/, settle()];
            case 19:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test("helpers are not taken for silent while their own record shows calls returning something new that Claudopus did not see, or a command in the background still printing; a record of calls that say the same again, of Claudopus's own tools, of refused calls or of messages to the helper is no news, and the check-ins and the word to the chat still come (17 Nov: a task was started again three times to check on helpers that were mid-step)", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, resumed, appended, files, _i, _b, id, nudges, record, rows, write, returned, called, output, m, m, m, word, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                agents = {};
                kinds = { a1: 'general-purpose', a2: 'general-purpose' };
                _a = world(on, { agents: agents, kinds: kinds, parents: { a2: 'a1' } }), clock = _a.clock, resumed = _a.resumed, appended = _a.appended, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Rebuild the head model', prompt: 'rebuild' }))];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fit the CT scans', prompt: 'ct', parentAgentId: 'a1' }))];
            case 3:
                _e.sent();
                Object.assign(agents, { a1: 'running', a2: 'running' });
                _i = 0, _b = ['a1', 'a2'];
                _e.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                id = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "s-".concat(id), agentId: id, command: 'git status' })];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'A helper is fitting; I continue when it reports.', durationMs: 1, isAborted: false, turnId: 'e-a1', reason: 'answer', agentId: 'a1' })];
            case 8:
                _e.sent();
                nudges = function () { return resumed.filter(function (line) { return line.startsWith('a1: From Claudopus: nothing new has come back from your helpers'); }); };
                record = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents/agent-a2.jsonl");
                rows = ['{"type":"system"}'];
                write = function (row) { return (rows.push(JSON.stringify(__assign(__assign({}, row), { timestamp: new Date(clock.now()).toISOString() }))), files.set(record, rows.join('\n')), files.set("mtime:".concat(record), String(clock.now()))); };
                returned = function (text) { return write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't', content: text }] } }); };
                called = function (id, name, text) { return (write({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id: id, name: name, input: {} }] } }), write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text }] } })); };
                output = '/tmp/claude-1/x/tasks/bfollow.output';
                returned('Command running in background with ID: bfollow. Output is being written to: /tmp/claude-1/x/tasks/bfollow.output. You will be notified when it completes.');
                files.set(output, 'progress: 1/40 heads fitting');
                m = 1;
                _e.label = 9;
            case 9:
                if (!(m <= 20)) return [3 /*break*/, 12];
                files.set("mtime:".concat(output), String(clock.now()));
                return [4 /*yield*/, clock.advance(60000)];
            case 10:
                (_e.sent());
                _e.label = 11;
            case 11:
                m++;
                return [3 /*break*/, 9];
            case 12:
                expect(nudges()).toEqual([]);
                write({ type: 'user', message: { role: 'user', content: '<task-notification>\n<task-id>bfollow</task-id>\n<status>completed</status>\n</task-notification>' } });
                m = 1;
                _e.label = 13;
            case 13:
                if (!(m <= 30)) return [3 /*break*/, 16];
                returned("fitted head ".concat(['one', 'two', 'three', 'four', 'five', 'six'][m % 6], " of the batch, file ").concat(m, ".npz"));
                return [4 /*yield*/, clock.advance(60000)];
            case 14:
                (_e.sent());
                _e.label = 15;
            case 15:
                m++;
                return [3 /*break*/, 13];
            case 16:
                expect(nudges()).toEqual([]);
                m = 1;
                _e.label = 17;
            case 17:
                if (!(m <= 40)) return [3 /*break*/, 20];
                word = ['still', 'fitting', 'waiting', 'looking'][m % 4];
                returned('Running');
                write({ type: 'user', message: { role: 'user', content: 'From Claudopus: a note' } });
                called("n".concat(m), 'mcp__claudopus__note', "Noted: ".concat(word));
                write({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: "x".concat(m), content: "Not run: ".concat(word), is_error: true }] } });
                return [4 /*yield*/, clock.advance(60000)];
            case 18:
                _e.sent();
                _e.label = 19;
            case 19:
                m++;
                return [3 /*break*/, 17];
            case 20:
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, nudges().length >= 2 || undefined];
                    }); }); })];
            case 21:
                _c.apply(void 0, [_e.sent()]).toBe(true);
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.some(function (line) { return line.includes('"Rebuild the head model" is stuck'); }) || undefined];
                    }); }); })];
            case 22:
                _d.apply(void 0, [_e.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test("a helper's command in the background is work only while it prints, for at most 30 minutes after its last line, and a task waiting on its own wake_me beside its helpers is not nudged; work flagged stuck is told to the chat once by 36 minutes whatever its helpers look like, and the word that it waits then says the chat may write to it", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var all, agents, kinds, printed, _a, clock, resumed, appended, _i, _b, id, _c, _d, _e, id, nudges, told, minutes, notice, r, waits;
    var _this = this;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                all = { a1: 'running', a2: 'running', a3: 'running', a4: 'running', a5: 'running', a6: 'running' };
                agents = {};
                kinds = Object.fromEntries(Object.keys(all).map(function (id) { return [id, 'general-purpose']; }));
                printed = {};
                _a = world(on, { agents: agents, kinds: kinds, parents: { a2: 'a1', a4: 'a3', a6: 'a5' }, jobs: { output: function () { return 'listening on :3000\n'; }, wroteAt: function (file) { var _a, _b; return (_b = printed[((_a = file.split('/').pop()) !== null && _a !== void 0 ? _a : '').replace(/\.output$/, '')]) !== null && _b !== void 0 ? _b : 0; } } }), clock = _a.clock, resumed = _a.resumed, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Serve the site', prompt: 'serve' }))];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Start the server', prompt: 'start', parentAgentId: 'a1' }))];
            case 3:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the app', prompt: 'check' }))];
            case 4:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the app log', prompt: 'read', parentAgentId: 'a3' }))];
            case 5:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Run the dev site', prompt: 'run' }))];
            case 6:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the dev site', prompt: 'watch', parentAgentId: 'a5' }))];
            case 7:
                _g.sent();
                Object.assign(agents, all);
                _i = 0, _b = Object.keys(all);
                _g.label = 8;
            case 8:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                id = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "s-".concat(id), agentId: id, command: 'git status' })
                    // a2 starts a server that prints once and then hangs silent; a6 one that prints all the time
                ];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11: 
            // a2 starts a server that prints once and then hangs silent; a6 one that prints all the time
            return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'v-a2', agentId: 'a2', command: 'hold serve', description: 'Start the server', run_in_background: true })];
            case 12:
                // a2 starts a server that prints once and then hangs silent; a6 one that prints all the time
                _g.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'v-a6', agentId: 'a6', command: 'hold watch', description: 'Serve the dev site', run_in_background: true })];
            case 13:
                _g.sent();
                printed['bg-v-a2'] = clock.now();
                // a3 asks to be started again in an hour, beside its helper
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__wake_me', tool_use_id: 'w-a3', agentId: 'a3', what: 'the app to come up', minutes: 60 })];
            case 14:
                // a3 asks to be started again in an hour, beside its helper
                _c.apply(void 0, [(_g.sent()).result]).toContain('in 60 min');
                _d = 0, _e = ['a1', 'a3', 'a5'];
                _g.label = 15;
            case 15:
                if (!(_d < _e.length)) return [3 /*break*/, 18];
                id = _e[_d];
                agents[id] = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: "e-".concat(id), reason: 'answer', agentId: id })];
            case 16:
                _g.sent();
                _g.label = 17;
            case 17:
                _d++;
                return [3 /*break*/, 15];
            case 18:
                nudges = function (id) { return resumed.filter(function (line) { return line.startsWith("".concat(id, ": From Claudopus:")) && line.includes('helpers'); }); };
                told = function () { return appended.filter(function (line) { return line.includes('Nothing new from "Run the dev site"') && line.includes('you may send it a message'); }); };
                minutes = function (n) { return __awaiter(_this, void 0, void 0, function () {
                    var at;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                at = 0;
                                _a.label = 1;
                            case 1:
                                if (!(at < n)) return [3 /*break*/, 4];
                                (printed['bg-v-a6'] = clock.now());
                                return [4 /*yield*/, clock.advance(60000)];
                            case 2:
                                (_a.sent());
                                _a.label = 3;
                            case 3:
                                at += 1;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // 25 minutes on: the server that last printed 25 minutes ago is still work, and the task waiting on its own wake_me is not nudged
                return [4 /*yield*/, minutes(25)];
            case 19:
                // 25 minutes on: the server that last printed 25 minutes ago is still work, and the task waiting on its own wake_me is not nudged
                _g.sent();
                expect([nudges('a1'), nudges('a3'), nudges('a5'), told()]).toEqual([[], [], [], []]);
                // 30 minutes after its last line it is silent: its task is checked on, and ordered to hand back only 12 minutes after that
                return [4 /*yield*/, minutes(7)];
            case 20:
                // 30 minutes after its last line it is silent: its task is checked on, and ordered to hand back only 12 minutes after that
                _g.sent();
                expect(nudges('a1')).toHaveLength(1);
                return [4 /*yield*/, minutes(6)];
            case 21:
                _g.sent();
                expect(nudges('a1')).toHaveLength(1);
                // The task whose helper prints all along, with nothing new coming back, is told to the chat once by 36 minutes
                expect(told()).toHaveLength(1);
                return [4 /*yield*/, minutes(8)];
            case 22:
                _g.sent();
                expect(nudges('a1')).toHaveLength(2);
                expect([told().length, nudges('a3'), nudges('a5')]).toEqual([1, [], []]);
                notice = "<task-notification>\n<task-id>a5</task-id>\n<status>completed</status>\n<summary>Agent \"Run the dev site\" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command \"Build\" completed (exit code 0)</summary>\n</task-notification>";
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 23:
                r = (_g.sent());
                waits = ((_f = r.context) !== null && _f !== void 0 ? _f : []).filter(function (text) { return text.includes('"Run the dev site" ended its step without its report'); });
                expect(waits).toHaveLength(1);
                expect(waits[0]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a5)');
                expect(waits[0]).not.toContain('do not message it');
                return [2 /*return*/];
        }
    });
}); });
test('the word that the chat was told a task is stuck lasts only until it or its helpers move again: a task held off the stuck flag by a command of its own, told of at the end of the schedule, moves, and the word that it waits says again not to message it', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, keep, clock, held, appended, _i, _b, id, ends, at, waitsWord, _c, letLook, after;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                agents = {};
                kinds = { a1: 'general-purpose', a2: 'general-purpose' };
                _a = world(on, { agents: agents, kinds: kinds, parents: { a2: 'a1' } }), keep = _a.keep, clock = _a.clock, held = _a.held, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Upload the lids', prompt: 'upload' }))];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the lids', prompt: 'render', parentAgentId: 'a1' }))];
            case 3:
                _d.sent();
                Object.assign(agents, { a1: 'running', a2: 'running' });
                _i = 0, _b = ['a1', 'a2'];
                _d.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                id = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "s-".concat(id), agentId: id, command: 'git status' })
                    // Its own upload runs in the background, so it is never flagged stuck; its helper sits silent
                ];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: 
            // Its own upload runs in the background, so it is never flagged stuck; its helper sits silent
            return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'u-a1', agentId: 'a1', command: 'hold upload', description: 'Upload the lids', run_in_background: true })
                // (the engine holds it for its upload as its step ends, and lists it as completed after)
            ];
            case 8:
                // Its own upload runs in the background, so it is never flagged stuck; its helper sits silent
                _d.sent();
                ends = function (turnId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                agents.a1 = 'running';
                                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for my helper.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: 'a1' })];
                            case 1:
                                _a.sent();
                                agents.a1 = 'completed';
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, ends('e1')];
            case 9:
                _d.sent();
                at = 0;
                _d.label = 10;
            case 10:
                if (!(at < 38)) return [3 /*break*/, 13];
                return [4 /*yield*/, clock.advance(60000)];
            case 11:
                _d.sent();
                _d.label = 12;
            case 12:
                at += 1;
                return [3 /*break*/, 10];
            case 13:
                expect(appended.filter(function (line) { return line.includes('"Upload the lids" is stuck'); })).toHaveLength(1);
                expect(appended.filter(function (line) { return line.includes('Nothing new from "Upload the lids"'); })).toEqual([]);
                waitsWord = function () { return __awaiter(_this, void 0, void 0, function () {
                    var notice, r;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                notice = "<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent \"Upload the lids\" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback.\n</result>\n</task-notification>\n<task-notification>\n<task-id>bx1</task-id>\n<status>completed</status>\n<summary>Background command \"Build\" completed (exit code 0)</summary>\n</task-notification>";
                                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
                            case 1:
                                r = (_b.sent());
                                return [2 /*return*/, ((_a = r.context) !== null && _a !== void 0 ? _a : []).filter(function (text) { return text.includes('"Upload the lids" ended its step without its report'); })];
                        }
                    });
                }); };
                _c = expect;
                return [4 /*yield*/, waitsWord()];
            case 14:
                _c.apply(void 0, [(_d.sent())[0]]).toContain('Claudopus told you it is stuck, so you may message it (SendMessage to a1)');
                // It moves by itself: something new comes back to it, and it ends its step again
                agents.a1 = 'running';
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'l-a1', agentId: 'a1', command: 'hold look' }));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('look')];
                    }); }); })];
            case 15:
                letLook = _d.sent();
                letLook === null || letLook === void 0 ? void 0 : letLook('the upload is at 80 percent');
                return [4 /*yield*/, ends('e2')];
            case 16:
                _d.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 17:
                _d.sent();
                return [4 /*yield*/, waitsWord()];
            case 18:
                after = _d.sent();
                expect(after).toHaveLength(1);
                expect(after[0]).toContain('do not message it for one');
                expect(after[0]).not.toContain('Claudopus told you it is stuck');
                return [2 /*return*/];
        }
    });
}); });
test('a task whose step ended to wait on its own command, with nothing starting it again, is started to look at it after the command\'s own time, then after an hour, two and every four; the chat says so and its card does not, and a command that ends counts afresh', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, held, appended, resumed, ends, looks, minutes, line, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, kinds: { a1: 'general-purpose' } }), clock = _a.clock, held = _a.held, appended = _a.appended, resumed = _a.resumed;
                // (Claude Code's own answer to its stop hook)
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Rebuild the head model', prompt: 'rebuild' }))];
            case 2:
                _d.sent();
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd1', agentId: 'a1', item: 'Fit our head to every scan', state: 'doing' })];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's-a1', agentId: 'a1', command: 'git status' })
                    // 18 Nov: it waits on cloud jobs that never start, and nothing ever starts it again
                ];
            case 4:
                _d.sent();
                // 18 Nov: it waits on cloud jobs that never start, and nothing ever starts it again
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w-a1', agentId: 'a1', command: 'hold jobs', description: 'Wait for the cloud jobs (about 40 min)', run_in_background: true })];
            case 5:
                // 18 Nov: it waits on cloud jobs that never start, and nothing ever starts it again
                _d.sent();
                ends = function (turnId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                agents.a1 = 'running';
                                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on my own work, which starts me again.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: 'a1' })
                                    // (the engine lists a task held by its own command as waiting)
                                ];
                            case 1:
                                _a.sent();
                                // (the engine lists a task held by its own command as waiting)
                                agents.a1 = 'waiting';
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, ends('e1')];
            case 6:
                _d.sent();
                looks = function () { return resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not the person: you ended your step'); }); };
                minutes = function (n) { return __awaiter(_this, void 0, void 0, function () {
                    var at;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                at = 0;
                                _a.label = 1;
                            case 1:
                                if (!(at < n)) return [3 /*break*/, 4];
                                return [4 /*yield*/, clock.advance(60000)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                at += 1;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // Not before its command's own 40 minutes and ten more
                return [4 /*yield*/, minutes(48)];
            case 7:
                // Not before its command's own 40 minutes and ten more
                _d.sent();
                expect(looks()).toEqual([]);
                return [4 /*yield*/, minutes(3)];
            case 8:
                _d.sent();
                expect(looks()).toHaveLength(1);
                expect(looks()[0]).toMatch(/you ended your step 5\dm ago to wait for your command "Wait for the cloud jobs \(about 40 min\)", running 5\dm/);
                expect(looks()[0]).toContain("If it is stuck, or waits on something that won't come");
                expect(appended.filter(function (line) { return line.includes('Nothing new from "Rebuild the head model" for 5') && line.endsWith('Claudopus started Claude again to check on what it waits for.'); })).toHaveLength(1);
                line = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, r;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 90 }), surface: 'desktop' }))];
                            case 1:
                                pane = _b.sent();
                                return [4 /*yield*/, pane.find({ type: 'Text', text: /asked Claude to check/ })];
                            case 2:
                                r = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text;
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _b.sent();
                                return [2 /*return*/, r];
                        }
                    });
                }); };
                // It looks, finds it still going and ends its step again: the next look is an hour after that, the one after two hours
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l-a1', agentId: 'a1', command: 'git log' })];
            case 9:
                _d.sent();
                return [4 /*yield*/, ends('e2')];
            case 10:
                _d.sent();
                return [4 /*yield*/, minutes(2)
                    // Its card says nothing of the look (18 Nov)
                ];
            case 11:
                _d.sent();
                // Its card says nothing of the look (18 Nov)
                _b = expect;
                return [4 /*yield*/, line()];
            case 12:
                // Its card says nothing of the look (18 Nov)
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, minutes(57)];
            case 13:
                _d.sent();
                expect(looks()).toHaveLength(1);
                return [4 /*yield*/, minutes(2)];
            case 14:
                _d.sent();
                expect(looks()).toHaveLength(2);
                return [4 /*yield*/, minutes(110)];
            case 15:
                _d.sent();
                expect(looks()).toHaveLength(2);
                return [4 /*yield*/, minutes(12)];
            case 16:
                _d.sent();
                expect(looks()).toHaveLength(3);
                // It stops its wait and starts it again: that is no news, and the next look keeps its four hours
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 'x-a1', agentId: 'a1', task_id: 'bg-w-a1' })];
            case 17:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w2-a1', agentId: 'a1', command: 'hold jobs', description: 'Wait for the cloud jobs again', run_in_background: true })];
            case 18:
                _d.sent();
                return [4 /*yield*/, ends('e3')];
            case 19:
                _d.sent();
                return [4 /*yield*/, minutes(40)];
            case 20:
                _d.sent();
                expect(looks()).toHaveLength(3);
                // Its command ends of itself, as Claude Code says at its next step's end: the count starts over, at half an hour
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w3-a1', agentId: 'a1', command: 'hold more', description: 'Wait for the second jobs', run_in_background: true })];
            case 21:
                _d.sent();
                return [4 /*yield*/, $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [{ id: 'bg-w3-a1' }] })];
            case 22:
                _d.sent();
                return [4 /*yield*/, ends('e4')];
            case 23:
                _d.sent();
                return [4 /*yield*/, minutes(29)];
            case 24:
                _d.sent();
                expect(looks()).toHaveLength(3);
                return [4 /*yield*/, minutes(3)];
            case 25:
                _d.sent();
                expect(looks()).toHaveLength(4);
                // Waiting on the person, it is never looked in on
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'The share is full. May I raise its size?', choices: ['Raise it', 'Not now'] })];
            case 26:
                _d.sent();
                return [4 /*yield*/, ends('e5')
                    // (past the hour after which its next look would have come)
                ];
            case 27:
                _d.sent();
                // (past the hour after which its next look would have come)
                return [4 /*yield*/, minutes(70)];
            case 28:
                // (past the hour after which its next look would have come)
                _d.sent();
                expect(looks()).toHaveLength(4);
                (_c = held.get('more')) === null || _c === void 0 ? void 0 : _c('done');
                return [2 /*return*/];
        }
    });
}); });
test('a step that runs for minutes says so on its row, with its time, and the flag names what keeps waiting', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, held, rows, _b, _c, letSearch, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Lay out the rows', prompt: 'lay out' }))];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'How the app draws panes', prompt: 'look', parentAgentId: 'a1', resume: { agentId: 'h1' } }))];
            case 3:
                _e.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search' }));
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
                // (a row from ten seconds on: it was two minutes, and commands ran with nothing shown)
                return [4 /*yield*/, clock.advance(5000)];
            case 4:
                // (a row from ten seconds on: it was two minutes, and commands ran with nothing shown)
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
                return [4 /*yield*/, settle()];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work sent a message after a long rest, and work only held by what it left running after its report, are not flagged', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, keep, settle, clock, logged, held, _loop_1, _i, _b, part, look, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                agents = {};
                kinds = { a2: 'general-purpose' };
                _a = world(on, { agents: agents, kinds: kinds }), keep = _a.keep, settle = _a.settle, clock = _a.clock, logged = _a.logged, held = _a.held;
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
                                void keep($.tool.call({ tool: 'Bash', tool_use_id: "e-".concat(part), agentId: 'a1', command: "hold ".concat(part) }));
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
                                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })];
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
                expect(logged.filter(function (line) { return line.includes('Nothing new from'); })).toEqual([]);
                return [4 /*yield*/, settle()];
            case 17:
                _e.sent();
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('Nothing new from'); })).toHaveLength(0);
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
test('a task Claude Code pressed for its report that ended its step with none, asking nothing and with nothing that starts it again, is started again to carry on and its card stays at work, saying nothing of it; stopped so again and again with little done between, it is left stopped with one line on its card; a task asking you something, one stopped, and one never pressed for a report end as before, and long words after the press are no result', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, PRESS, pressed, talk, _a, clock, resumed, appended, _i, _b, title, ends, lines, carried, _c, _d, id, _e, _f, _g, n, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                agents = {};
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                pressed = [{ role: 'assistant', content: [{ type: 'text', text: 'Waiting for the build.' }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>' }] }];
                talk = __spreadArray([], pressed, true);
                _a = world(on, { agents: agents, talk: talk }), clock = _a.clock, resumed = _a.resumed, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                _i = 0, _b = ['Paint the skin', 'Ask about the logo', 'Draw the banner', 'Write the notes', 'Sort the frames', 'Label the frames'];
                _k.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                title = _b[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: title, prompt: title }))];
            case 3:
                _k.sent();
                _k.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] })];
            case 6:
                _k.sent();
                ends = function (id_1, answer_1, n_1) {
                    var args_1 = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        args_1[_i - 3] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([id_1, answer_1, n_1], args_1, true), void 0, function (id, answer, n, isAborted) {
                        if (isAborted === void 0) { isAborted = false; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    agents[id] = 'completed';
                                    return [4 /*yield*/, $.turn.complete({ answer: answer, durationMs: 1, isAborted: isAborted, turnId: "t-".concat(id, "-").concat(n), reason: 'answer', agentId: id })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                lines = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, found;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /^Stopped partway / })];
                            case 2:
                                found = (_a.sent()).map(function (one) { var _a; return ({ text: (_a = one.text) === null || _a === void 0 ? void 0 : _a.replace(/\d\d:\d\d/g, 'hh:mm'), color: one.props.color }); });
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                carried = function (id) { return resumed.filter(function (line) { return line.startsWith("".concat(id, ": From Claudopus, not ")) && line.includes('left stopped partway. Carry on from where you were'); }); };
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a1', command: 'git status' })];
            case 7:
                _k.sent();
                return [4 /*yield*/, ends('a1', 'Waiting for the build.', 1)];
            case 8:
                _k.sent();
                _c = 0, _d = ['a2', 'a4'];
                _k.label = 9;
            case 9:
                if (!(_c < _d.length)) return [3 /*break*/, 12];
                id = _d[_c];
                return [4 /*yield*/, ends(id, 'Waiting for my answer.', 1)];
            case 10:
                _k.sent();
                _k.label = 11;
            case 11:
                _c++;
                return [3 /*break*/, 9];
            case 12: return [4 /*yield*/, ends('a3', 'Waiting for the build.', 1, true)];
            case 13:
                _k.sent();
                return [4 /*yield*/, ends('a4', "Done. ".concat('Every banner is drawn and checked. '.repeat(20)), 2)
                    // Started again a moment later, not at once: the engine closes the run first
                ];
            case 14:
                _k.sent();
                // Started again a moment later, not at once: the engine closes the run first
                expect(carried('a1')).toHaveLength(0);
                return [4 /*yield*/, clock.advance(6000)];
            case 15:
                _k.sent();
                expect(carried('a1')).toHaveLength(1);
                expect(resumed.filter(function (line) { return /^a[23]: /.test(line); })).toEqual([]);
                // Long words after Claude Code's press are no result either, as Claude Code itself says it ended without one: it is started again
                expect(carried('a4')).toHaveLength(1);
                // It hands back its result: done. While Claudopus starts a task again its card says nothing of it (18 Nov)
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h4', agentId: 'a4', message: "Done. ".concat('Every banner is drawn and checked. '.repeat(20)) })];
            case 16:
                // It hands back its result: done. While Claudopus starts a task again its card says nothing of it (18 Nov)
                _k.sent();
                return [4 /*yield*/, ends('a4', '', 3)];
            case 17:
                _k.sent();
                _e = expect;
                return [4 /*yield*/, lines()];
            case 18:
                _e.apply(void 0, [_k.sent()]).toEqual([]);
                // The chat's model is told only once Claudopus gives up; a run that ended with its words as its result, never pressed, ends as before
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Sorted.' }] });
                return [4 /*yield*/, ends('a5', 'Sorted.', 1)];
            case 19:
                _k.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 20:
                _k.sent();
                expect(resumed.filter(function (line) { return line.startsWith('a5: '); })).toEqual([]);
                talk.splice.apply(talk, __spreadArray([0, talk.length], pressed, false));
                _f = 0, _g = [2, 3, 4];
                _k.label = 21;
            case 21:
                if (!(_f < _g.length)) return [3 /*break*/, 25];
                n = _g[_f];
                return [4 /*yield*/, ends('a1', 'Waiting for the build.', n)];
            case 22:
                _k.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 23:
                _k.sent();
                _k.label = 24;
            case 24:
                _f++;
                return [3 /*break*/, 21];
            case 25:
                expect(carried('a1')).toHaveLength(3);
                _h = expect;
                return [4 /*yield*/, lines()];
            case 26:
                _h.apply(void 0, [_k.sent()]).toEqual([{ text: 'Stopped partway 4 times without a result · Claudopus stopped starting it again · send it a message to carry on', color: '#E5A50A' }]);
                expect(appended.filter(function (line) { return line.includes('"Paint the skin" (a1) keeps stopping partway'); })).toHaveLength(1);
                return [4 /*yield*/, ends('a1', 'Waiting for the build.', 5)];
            case 27:
                _k.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 28:
                _k.sent();
                expect(carried('a1')).toHaveLength(3);
                // Sent a message, as its card says, it works again and gives its result: the amber line goes, and it ends under Finished
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's9', agentId: 'a1', command: 'git status' })];
            case 29:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h9', agentId: 'a1', message: "Painted. ".concat('Every patch is gone. '.repeat(30)) })];
            case 30:
                _k.sent();
                return [4 /*yield*/, ends('a1', "Painted. ".concat('Every patch is gone. '.repeat(30)), 6)];
            case 31:
                _k.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 32:
                _k.sent();
                _j = expect;
                return [4 /*yield*/, lines()];
            case 33:
                _j.apply(void 0, [_k.sent()]).toEqual([]);
                // One whose run ended where Claudopus heard nothing of it (no hook of the mod ran for it), a to-do of its still to do, is never
                // done on Claude Code's word: it is started again to do it and hand back
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'Sorted.' }] });
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'd6', agentId: 'a6', item: 'Label each frame', state: 'doing' })];
            case 34:
                _k.sent();
                agents.a6 = 'completed';
                return [4 /*yield*/, clock.advance(30000)];
            case 35:
                _k.sent();
                expect(resumed.filter(function (line) { return line.startsWith('a6: From Claudopus, not ') && line.includes('Still to do on your card: "Label each frame"'); }).length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('a task that asked "Shall I build this?", was told Build it, and ended its step partway with nothing of its own running is started again where Claudopus still sees it: never from a timer, where its run would go unseen, its panel tools unanswered and its end unheard; its card is done only once it hands back the build (18 Nov: started again from a timer, the task ran unseen, was asked for its result until its run ended, and its card showed done with no build and no report)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, PRESS, talk, pressedAfter, unseen, _a, clock, resumed, notified, call, ends, texts, isDone, carried, told, list, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l;
    var _this = this;
    var _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                agents = { a1: 'running' };
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                talk = [];
                pressedAfter = function (words) { return talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: words }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: words }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: words }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: words }] }); };
                unseen = [];
                _a = world(on, { agents: agents, talk: talk, unseen: unseen }), clock = _a.clock, resumed = _a.resumed, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'design one final layout for what tasks make', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Design one final layout', prompt: 'design it' }))];
            case 3:
                _p.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                ends = function (answer, turn) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (agents.a1 = 'completed');
                            return [4 /*yield*/, $.turn.complete({ answer: answer, durationMs: 1, isAborted: false, turnId: turn, reason: 'answer', agentId: 'a1' })];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                texts = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, found;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                            case 2:
                                found = (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; });
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                isDone = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, texts()];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (text) { return text === '✓ Done' || /^Done · /.test(text); })];
                    }
                }); }); };
                carried = function () { return resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not ') && line.includes('left stopped partway. Carry on from where you were'); }); };
                // It draws the design, asks whether to build it, and hands back its design report: done, with its question on its card
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Draw the one final design', state: 'done' })];
            case 4:
                // It draws the design, asks whether to build it, and hands back its design report: done, with its question on its card
                _p.sent();
                return [4 /*yield*/, call('mcp__claudopus__ask', 'k1', { text: 'Shall I build this Files design?', choices: ['Build it', 'Not now'] })];
            case 5:
                _p.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The design is stripped down to tiles side by side. Nothing is built yet: it waits for your yes.' })];
            case 6:
                _p.sent();
                return [4 /*yield*/, ends('', 'd1')];
            case 7:
                _p.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 8:
                _p.sent();
                told = notified.length;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 9:
                list = _p.sent();
                _c = (_b = list).press;
                _l = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Build it'; })];
                        }
                    }); }); })];
            case 10: return [4 /*yield*/, _c.apply(_b, [(_l.key = (_o = (_m = (_p.sent())) === null || _m === void 0 ? void 0 : _m.key) !== null && _o !== void 0 ? _o : '', _l)])];
            case 11:
                _p.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Build it"'); })];
                    }); }); })];
            case 12:
                _d.apply(void 0, [_p.sent()]).toContain('You had finished; this answer starts you again');
                return [4 /*yield*/, list.unmount()];
            case 13:
                _p.sent();
                expect({ unseen: unseen, at: 'after the press' }).toEqual({ unseen: [], at: 'after the press' });
                // It builds, then ends its step saying its tests run, when nothing of its own runs; Claude Code asks it three times for its result
                agents.a1 = 'running';
                return [4 /*yield*/, call('mcp__claudopus__ask', 'k2', { text: '' })];
            case 14:
                _p.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Build the Files tiles into the panel', state: 'doing' })];
            case 15:
                _p.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'git status', description: 'Run a look at what the build changed' })];
            case 16:
                _p.sent();
                pressedAfter('The tests for the changed areas are running, and they start me again when they end.');
                return [4 /*yield*/, ends('The tests for the changed areas are running, and they start me again when they end.', 'b1')];
            case 17:
                _p.sent();
                _e = expect;
                return [4 /*yield*/, isDone()];
            case 18:
                _e.apply(void 0, [_p.sent()]).toBe(false);
                // A moment later Claudopus starts it again to carry on. The moment is a timer's: from there the task would run with every hook
                // of the mod left out, so the message waits for a hook, and goes from the panel's next drawing
                return [4 /*yield*/, clock.advance(6000)];
            case 19:
                // A moment later Claudopus starts it again to carry on. The moment is a timer's: from there the task would run with every hook
                // of the mod left out, so the message waits for a hook, and goes from the panel's next drawing
                _p.sent();
                _f = expect;
                return [4 /*yield*/, isDone()];
            case 20:
                _f.apply(void 0, [_p.sent()]).toBe(false);
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (carried().length ? carried() : undefined)];
                    }); }); })];
            case 21:
                _g.apply(void 0, [_p.sent()]).toHaveLength(1);
                expect({ unseen: unseen, at: 'after the carry-on' }).toEqual({ unseen: [], at: 'after the carry-on' });
                // Started again where Claudopus sees it, its note reaches its card and Claude Code's next requests for its result find it
                // waiting on a command of its own; started unseen (before), none of its calls reached Claudopus, its run ended on those
                // requests, and only the engine's list said it was over
                agents.a1 = 'running';
                return [4 /*yield*/, clock.advance(25000)];
            case 22:
                _p.sent();
                if (!!unseen.includes('a1')) return [3 /*break*/, 24];
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'The test run was cut off, so I have started it again.' })];
            case 23:
                _p.sent();
                _p.label = 24;
            case 24:
                if (!!unseen.includes('a1')) return [3 /*break*/, 26];
                _h = expect;
                return [4 /*yield*/, texts()];
            case 25:
                _h.apply(void 0, [(_p.sent()).some(function (text) { return text.includes('The test run was cut off'); })]).toBe(true);
                _p.label = 26;
            case 26:
                pressedAfter("I'm holding the report until the tests finish; their end starts me again.");
                if (!unseen.includes('a1')) return [3 /*break*/, 28];
                (agents.a1 = 'completed');
                return [4 /*yield*/, $.prompt.submit({ text: '<task-notification>\n<task-id>a1</task-id>\n<status>completed</status>\n<summary>Agent "Design one final layout" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.\n</result>\n</task-notification>', wait: false, origin: { kind: 'task-notification' } })];
            case 27:
                (_p.sent());
                return [3 /*break*/, 30];
            case 28: return [4 /*yield*/, ends("I'm holding the report until the tests finish; their end starts me again.", 'b2')];
            case 29:
                _p.sent();
                _p.label = 30;
            case 30: return [4 /*yield*/, clock.advance(25000)];
            case 31:
                _p.sent();
                return [4 /*yield*/, clock.advance(6000)
                    // Either way no card is done and nobody is told it is ready before the build is handed back
                ];
            case 32:
                _p.sent();
                // Either way no card is done and nobody is told it is ready before the build is handed back
                _j = expect;
                return [4 /*yield*/, isDone()];
            case 33:
                // Either way no card is done and nobody is told it is ready before the build is handed back
                _j.apply(void 0, [_p.sent()]).toBe(false);
                expect(notified).toHaveLength(told);
                expect({ unseen: unseen, at: 'at the end of its run' }).toEqual({ unseen: [], at: 'at the end of its run' });
                // It hands back the build: only now is it done, with the build as its result
                agents.a1 = 'running';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't3', { item: 'Build the Files tiles into the panel', state: 'done' })];
            case 34:
                _p.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h2', { message: 'The Files tiles are built into the panel and pushed on their own branch.' })];
            case 35:
                _p.sent();
                return [4 /*yield*/, ends('', 'b3')];
            case 36:
                _p.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isDone()];
                            case 1: return [2 /*return*/, ((_a.sent()) || undefined)];
                        }
                    }); }); })];
            case 37:
                _k.apply(void 0, [_p.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(3000)];
            case 38:
                _p.sent();
                expect(notified.slice(told).map(function (line) { return line.split(' | ')[1]; })).toEqual(['The Files tiles are built into the panel and pushed on their own branch.']);
                return [2 /*return*/];
        }
    });
}); });
test('with no hook of the mod to send it from for a minute (no panel or bar drawn, nothing at work in the chat), the message that starts a task again goes from the timer after all, and tells the task it runs unseen: to finish without the panel and hand back, not to end its step and wait', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, PRESS, talk, unseen, _a, clock, resumed, carried, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                agents = { a1: 'running' };
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                talk = [{ role: 'assistant', content: [{ type: 'text', text: 'Waiting for the build.' }] }, PRESS, { role: 'assistant', content: [{ type: 'text', text: 'Waiting for the build.' }] }];
                unseen = [];
                _a = world(on, { agents: agents, talk: talk, unseen: unseen }), clock = _a.clock, resumed = _a.resumed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Paint the skin', prompt: 'paint it' }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a1', command: 'git status' })];
            case 3:
                _c.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for the build.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 4:
                _c.sent();
                carried = function () { return resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not ') && line.includes('left stopped partway. Carry on from where you were'); }); };
                // The moment to start it again comes, and half a minute more, with no hook: nothing is sent from the timer
                return [4 /*yield*/, clock.advance(6000)];
            case 5:
                // The moment to start it again comes, and half a minute more, with no hook: nothing is sent from the timer
                _c.sent();
                return [4 /*yield*/, clock.advance(30000)];
            case 6:
                _c.sent();
                expect(carried()).toEqual([]);
                // A minute on, still none: it goes after all, once, and says where the task now runs
                return [4 /*yield*/, clock.advance(40000)];
            case 7:
                // A minute on, still none: it goes after all, once, and says where the task now runs
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (carried().length ? carried() : undefined)];
                    }); }); })];
            case 8:
                _b.apply(void 0, [_c.sent()]).toHaveLength(1);
                expect(carried()[0]).toContain('this message starts you where Claudopus cannot see you');
                expect(carried()[0]).toContain('do not end your step to wait for anything');
                expect(unseen).toEqual(['a1']);
                return [2 /*return*/];
        }
    });
}); });
test("a task ending its step with to-dos still to do and nothing of its own running goes on in the same run, told what is left, and its long word of how far it has got is never its result; with a helper at work it may end its step; kept three times in a row with no call between, it is let end; its report with to-dos still to do is refused until it says what is not done or sends it a third time, then goes through with them shown as not done on its card, in its result and to the chat, never on a task waiting on your answer", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, PRESS, talk, _a, clock, resumed, appended, files, call, _i, _b, item, stop, kept, _c, _d, _e, _f, poll, _g, _h, _j, progress, _k, _l, reports, _m, REPORT, handback, _o, _p, _q, _r, _s, pane, fold, line, _t, _u, shown, _v, _w;
    var _this = this;
    var _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                agents = {};
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                talk = [];
                _a = world(on, { agents: agents, talk: talk }), clock = _a.clock, resumed = _a.resumed, appended = _a.appended, files = _a.files;
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Rebuild the head model', prompt: 'rebuild' }))];
            case 2:
                _y.sent();
                agents.a1 = 'running';
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                _i = 0, _b = ['Fit every scan', 'Draw new beside old', 'Second look', 'Check the licences'];
                _y.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                return [4 /*yield*/, call('todo', { item: item })];
            case 4:
                _y.sent();
                _y.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, call('todo', { item: 'Fit every scan', state: 'done' })];
            case 7:
                _y.sent();
                stop = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, $.classic.SubagentStop({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] })];
                        case 1: return [2 /*return*/, ((_a = (_b.sent())) !== null && _a !== void 0 ? _a : {}).block
                            // 18 Nov: it started its pictures detached with no `echo $!` after them, which failed at once, and ended its step with a long word
                            // of how far it had got: kept as its result, its card ended at 1 of 3 and nothing started it again for three and a half hours
                        ];
                    }
                }); }); };
                // 18 Nov: it started its pictures detached with no `echo $!` after them, which failed at once, and ended its step with a long word
                // of how far it had got: kept as its result, its card ended at 1 of 3 and nothing started it again for three and a half hours
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'for p in a b; do nohup python3 pictures.py "$p" > pic.log 2>&1 & done; echo started', description: 'Run: draw the heads (about 5 min)' })
                    // Claude Code presses it for its report at the same moment: told that press doesn't apply yet, and how to wait
                ];
            case 8:
                // 18 Nov: it started its pictures detached with no `echo $!` after them, which failed at once, and ended its step with a long word
                // of how far it had got: kept as its result, its card ended at 1 of 3 and nothing started it again for three and a half hours
                _y.sent();
                // Claude Code presses it for its report at the same moment: told that press doesn't apply yet, and how to wait
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'I continue when the pictures end.' }] }, PRESS);
                return [4 /*yield*/, stop()];
            case 9:
                kept = _y.sent();
                expect(kept).toContain('don\'t end here, your task isn\'t finished. Still to do: "Draw new beside old"; "Second look"; "Check the licences".');
                expect(kept).toContain("Claude Code's note that your report has not been delivered doesn't apply yet");
                expect(kept).toContain('look at its log');
                expect(kept).toContain('call wake_me for a file, a page or a time, then end your step');
                // Kept three times in a row with no call of its own between, it is let end its step; a call counts from one again
                _c = expect;
                _d = Boolean;
                return [4 /*yield*/, stop()];
            case 10:
                _e = [_d.apply(void 0, [_y.sent()])];
                _f = Boolean;
                return [4 /*yield*/, stop()];
            case 11:
                _e = _e.concat([_f.apply(void 0, [_y.sent()])]);
                return [4 /*yield*/, stop()];
            case 12:
                // Kept three times in a row with no call of its own between, it is let end its step; a call counts from one again
                _c.apply(void 0, [_e.concat([_y.sent()])]).toEqual([true, true, undefined]);
                poll = function (n) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "p".concat(n), agentId: 'a1', command: 'tail -n 5 pic.log' })];
                        case 1:
                            _b.sent();
                            _a = Boolean;
                            return [4 /*yield*/, stop()];
                        case 2: return [2 /*return*/, (_a.apply(void 0, [_b.sent()]))];
                    }
                }); }); };
                _g = expect;
                return [4 /*yield*/, poll(1)];
            case 13:
                _h = [_y.sent()];
                return [4 /*yield*/, poll(2)];
            case 14:
                _h = _h.concat([_y.sent()]);
                return [4 /*yield*/, poll(3)];
            case 15:
                _g.apply(void 0, [_h.concat([_y.sent()])]).toEqual([true, true, false]);
                // A to-do ticked counts from one again
                return [4 /*yield*/, call('todo', { item: 'Check the licences', state: 'done' })];
            case 16:
                // A to-do ticked counts from one again
                _y.sent();
                _j = expect;
                return [4 /*yield*/, poll(4)];
            case 17:
                _j.apply(void 0, [_y.sent()]).toBe(true);
                progress = "The final tests are done. ".concat('I am now drawing the kept-aside heads and continue when they end. '.repeat(10));
                // (let end past the limit, Claude Code has used up its presses: its words end the run with no press after them)
                _k = expect;
                return [4 /*yield*/, poll(5)];
            case 18:
                _l = [_y.sent()];
                return [4 /*yield*/, poll(6)];
            case 19:
                _l = _l.concat([_y.sent()]);
                return [4 /*yield*/, poll(7)];
            case 20:
                _l = _l.concat([_y.sent()]);
                return [4 /*yield*/, poll(8)];
            case 21:
                _l = _l.concat([_y.sent()]);
                return [4 /*yield*/, poll(9)];
            case 22:
                _l = _l.concat([_y.sent()]);
                return [4 /*yield*/, poll(10)];
            case 23:
                // (let end past the limit, Claude Code has used up its presses: its words end the run with no press after them)
                _k.apply(void 0, [_l.concat([_y.sent()])]).toEqual([true, true, true, true, true, false]);
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'p10', name: 'Bash', input: {} }] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'p10', content: 'ok' }] }, { role: 'assistant', content: [{ type: 'text', text: progress }] });
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: progress, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 24:
                _y.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 25:
                _y.sent();
                reports = function () { return __spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/report.md'); }); };
                expect(reports()).toEqual([]);
                expect(resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'); })).toHaveLength(1);
                // With a helper of its own at work it may end its step: the helper's result starts it again
                agents.a1 = 'running';
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the heads', prompt: 'draw', parentAgentId: 'a1' }))];
            case 26:
                _y.sent();
                agents.a2 = 'running';
                _m = expect;
                return [4 /*yield*/, stop()];
            case 27:
                _m.apply(void 0, [_y.sent()]).toBeUndefined();
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })
                    // Its report with to-dos still to do is refused, naming them; with one ticked, refused again for the one left; the same again
                    // goes through
                    // (a result as long as one Claudopus keeps)
                ];
            case 28:
                _y.sent();
                REPORT = "The new model is nearer on unseen heads.".concat(' Each head kept aside is closer behind the ear.'.repeat(12));
                handback = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h', agentId: 'a1', message: REPORT })];
                        case 1: return [2 /*return*/, (_a.sent()).deny];
                    }
                }); }); };
                _o = expect;
                return [4 /*yield*/, handback()];
            case 29:
                _o.apply(void 0, [_y.sent()]).toContain('Not sent: 2 of your to-dos are still to do: "Draw new beside old"; "Second look".');
                return [4 /*yield*/, call('todo', { item: 'Draw new beside old', state: 'done' })
                    // Sent again only because Claude Code pressed for it, saying nothing of what is not done: refused again; a third time, it goes
                    // through whatever it says
                ];
            case 30:
                _y.sent();
                // Sent again only because Claude Code pressed for it, saying nothing of what is not done: refused again; a third time, it goes
                // through whatever it says
                _p = expect;
                return [4 /*yield*/, handback()];
            case 31:
                // Sent again only because Claude Code pressed for it, saying nothing of what is not done: refused again; a third time, it goes
                // through whatever it says
                _p.apply(void 0, [_y.sent()]).toContain('Not sent: a to-do of yours is still to do: "Second look".');
                _q = expect;
                return [4 /*yield*/, handback()];
            case 32:
                _q.apply(void 0, [_y.sent()]).toContain('Not sent: a to-do of yours is still to do: "Second look".');
                _r = expect;
                return [4 /*yield*/, handback()];
            case 33:
                _r.apply(void 0, [_y.sent()]).toBeUndefined();
                expect(appended.filter(function (line) { return line.includes('sent its result with a to-do not done: "Second look"'); })).toHaveLength(1);
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer', agentId: 'a1' })];
            case 34:
                _y.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 35:
                _y.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, reports().length || undefined];
                    }); }); })];
            case 36:
                _s.apply(void 0, [_y.sent()]).toBe(1);
                expect(files.get((_x = reports()[0]) !== null && _x !== void 0 ? _x : '')).toBe("".concat(REPORT, "\n\nNot done:\n- Second look\n"));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 37:
                pane = _y.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })];
                        }
                    }); }); })];
            case 38:
                fold = _y.sent();
                if (!fold) return [3 /*break*/, 40];
                return [4 /*yield*/, pane.press({ key: String(fold.key) })];
            case 39:
                _y.sent();
                _y.label = 40;
            case 40: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /^Not done · Second/ })];
                        case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                    }
                }); }); })];
            case 41:
                line = _y.sent();
                expect([line === null || line === void 0 ? void 0 : line.text, line === null || line === void 0 ? void 0 : line.props.color]).toEqual(['Not done · Second look', '#E5A50A']);
                // With a to-do left it is not done: its card never says Done
                _t = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 42:
                // With a to-do left it is not done: its card never says Done
                _t.apply(void 0, [(_y.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (text) { return text === '✓ Done' || /^Done · /.test(text); })]).toEqual([]);
                _u = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 43:
                _u.apply(void 0, [(_y.sent()).some(function (one) { var _a; return /^Not done · \d/.test(String((_a = one.text) !== null && _a !== void 0 ? _a : '')); })]).toBe(true);
                return [4 /*yield*/, pane.unmount()
                    // A task waiting on your answer with to-dos still to do is no task left undone
                ];
            case 44:
                _y.sent();
                // A task waiting on your answer with to-dos still to do is no task left undone
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Pick the skin tone', prompt: 'pick' }))];
            case 45:
                // A task waiting on your answer with to-dos still to do is no task left undone
                _y.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'q1', agentId: 'a3', item: 'Paint the chosen tone' })];
            case 46:
                _y.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'q2', agentId: 'a3', text: 'Which tone?', choices: ['Warm', 'Cool'] })];
            case 47:
                _y.sent();
                agents.a3 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for your pick.', durationMs: 1, isAborted: false, turnId: 't4', reason: 'answer', agentId: 'a3' })];
            case 48:
                _y.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 49:
                shown = _y.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).stringify;
                                return [4 /*yield*/, shown.drawn()];
                            case 1: return [2 /*return*/, (_b.apply(_a, [_c.sent()]).includes('Which tone?') ? true : undefined)];
                        }
                    }); }); })];
            case 50:
                _v.apply(void 0, [_y.sent()]).toBe(true);
                _w = expect;
                return [4 /*yield*/, shown.findAll({ type: 'Text', text: /^Not done · Second/ })];
            case 51:
                _w.apply(void 0, [(_y.sent()).map(function (one) { return one.text; })]).toEqual(['Not done · Second look']);
                return [4 /*yield*/, shown.unmount()];
            case 52:
                _y.sent();
                return [2 /*return*/];
        }
    });
}); });
