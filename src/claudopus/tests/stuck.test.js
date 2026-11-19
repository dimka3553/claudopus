// Work that stops moving: its card is flagged and the chat told once, and nothing starts it again; the one rule against stopping
// early; a long step shows on its row, and the log stays plain text
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
// A task's card as the chat keeps it
var stuckCard = function (files, id) {
    var _a, _b, _c;
    if (id === void 0) { id = 'a1'; }
    return (_c = ((_b = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}').cards) !== null && _b !== void 0 ? _b : []).find(function (one) { return one.id === id; })) !== null && _c !== void 0 ? _c : {};
};
test('work that gets nothing new back for 12 minutes is flagged on its card and told to the chat once, and nothing starts it again; news clears it, and a wait that only prints a new number is no news', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, held, logged, resumed, appended, files, bash, isFlagged, told, _b, pane, _c, letRelease, _d, letPoll, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held, logged = _a.logged, resumed = _a.resumed, appended = _a.appended, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'one merger for all pushes', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'One merger for all pushes', prompt: 'one merger' }))];
            case 3:
                _f.sent();
                bash = function (agentId, command, id) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: command }); };
                isFlagged = function () { return typeof stuckCard(files).stuckAt === 'number'; };
                told = function () { return appended.filter(function (line) { return line.startsWith('undefined: '); }).map(function (line) { return line.slice(11); }).filter(function (line) { return line.includes('Nothing new from "One merger for all pushes"'); }); };
                // It waits on a start signal nobody gives: nothing comes back to it
                return [4 /*yield*/, bash('a1', 'git log', 'p1')];
            case 4:
                // It waits on a start signal nobody gives: nothing comes back to it
                _f.sent();
                return [4 /*yield*/, clock.advance(11 * 60000)];
            case 5:
                _f.sent();
                expect(isFlagged()).toBe(false);
                return [4 /*yield*/, clock.advance(2 * 60000)];
            case 6:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, isFlagged() || undefined];
                    }); }); })];
            case 7:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                // Said to the chat's model alone, once: the chat shows nothing of a task's but its own words (18 Nov)
                expect(logged.filter(function (line) { return line.includes('Nothing new from'); })).toEqual([]);
                expect(told()).toHaveLength(1);
                expect(told()[0]).toMatch(/^Nothing new from "One merger for all pushes" for 1[23]m\. /);
                // The chat alone reads that it may ask the task what it waits on, as nothing of Claudopus's will
                expect(told()[0]).toContain('Claudopus does nothing more about it: you may send it a message asking what it waits on');
                expect(logged.filter(function (line) { return line.includes('you may send it a message'); })).toEqual([]);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 8:
                pane = _f.sent();
                _c = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 9:
                _c.apply(void 0, [(_f.sent()).filter(function (one) { var _a; return /Nothing new|stuck/i.test(String((_a = one.text) !== null && _a !== void 0 ? _a : '')) || one.props.color === '#E5A50A'; }).map(function (one) { return one.text; })]).toEqual([]);
                return [4 /*yield*/, pane.unmount()];
            case 10:
                _f.sent();
                expect(stuckCard(files).status).toBe('working');
                // Looked at again and again, nothing more is said
                return [4 /*yield*/, clock.advance(60000)];
            case 11:
                // Looked at again and again, nothing more is said
                _f.sent();
                return [4 /*yield*/, clock.advance(30 * 60000)];
            case 12:
                _f.sent();
                expect(told()).toHaveLength(1);
                // Something new comes back: the flag goes at the next look
                void keep(bash('a1', 'hold release', 'b3'));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('release')];
                    }); }); })];
            case 13:
                letRelease = _f.sent();
                letRelease === null || letRelease === void 0 ? void 0 : letRelease('released Thing 0.1.1');
                return [4 /*yield*/, clock.advance(25000)];
            case 14:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, !isFlagged() || undefined];
                    }); }); })];
            case 15:
                _d.apply(void 0, [_f.sent()]).toBe(true);
                // A poll that prints what it printed before, a new count aside, is no news: twelve minutes on it is flagged again, and told again
                void keep(bash('a1', 'hold poll', 'b4'));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('poll')];
                    }); }); })];
            case 16:
                letPoll = _f.sent();
                letPoll === null || letPoll === void 0 ? void 0 : letPoll('released Thing 0.1.7');
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 17:
                _f.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, isFlagged() || undefined];
                    }); }); })];
            case 18:
                _e.apply(void 0, [_f.sent()]).toBe(true);
                expect(appended.filter(function (line) { return line.startsWith('undefined: '); }).filter(function (line) { return line.includes('Nothing new from'); })).toHaveLength(2);
                // Nothing of Claudopus's started it again or sent it a word about it, at any point: at a step of its own it is only asked, as
                // any task is, for a note of what it does now
                expect(resumed).toEqual([]);
                expect(appended.filter(function (line) { return line.startsWith('a1: ') && !line.includes('send a `note` saying in one plain line what you are doing now'); })).toEqual([]);
                return [4 /*yield*/, settle()];
            case 19:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a helper whose step runs for a minute says what it is doing on its row, with its time, and no longer once the step ends', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'h1', command: 'hold search', description: 'Search the app for how it draws panes' }));
                rows = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                            case 2:
                                r = (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (text) { return text.startsWith('Searching the app for how it draws panes'); });
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, r];
                        }
                    });
                }); };
                // In its own words for the command, with no time at first
                return [4 /*yield*/, clock.advance(5000)];
            case 4:
                // In its own words for the command, with no time at first
                _e.sent();
                _b = expect;
                return [4 /*yield*/, rows()];
            case 5:
                _b.apply(void 0, [_e.sent()]).toEqual(['Searching the app for how it draws panes']);
                return [4 /*yield*/, clock.advance(70000)];
            case 6:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, rows()];
            case 7:
                _c.apply(void 0, [_e.sent()]).toEqual(['Searching the app for how it draws panes · 1m 15s']);
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
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rows()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 10:
                _d.apply(void 0, [_e.sent()]).toBe(true);
                return [4 /*yield*/, settle()];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work with a command of its own running in the background, with a helper at work, asking the person something, or sent a message after a long rest is never flagged, however long nothing comes back; a task beside them with none of those is', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, keep, settle, clock, logged, appended, held, files, begin, _loop_1, _i, _b, part, handsIn, _c, _d, _e, n, title, _f, _g, id, _h;
    var _this = this;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, jobs: { output: function () { return 'uploading the lids\n'; }, wroteAt: function () { return 0; } } }), keep = _a.keep, settle = _a.settle, clock = _a.clock, logged = _a.logged, appended = _a.appended, held = _a.held, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                begin = function (id, title) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: title, prompt: title }))];
                        case 1: return [2 /*return*/, (_a.sent(), (agents[id] = 'running'))];
                    }
                }); }); };
                return [4 /*yield*/, begin('a1', 'Draw the ears')
                    // Its first run, moving all along, takes longer than the stuck check waits; then it hands in its result and rests
                ];
            case 2:
                _k.sent();
                _loop_1 = function (part) {
                    var letGo;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, clock.advance(5 * 60000)];
                            case 1:
                                _l.sent();
                                void keep($.tool.call({ tool: 'Bash', tool_use_id: "e-".concat(part), agentId: 'a1', command: "hold ".concat(part) }));
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, held.get(part)];
                                    }); }); })];
                            case 2:
                                letGo = _l.sent();
                                letGo === null || letGo === void 0 ? void 0 : letGo("drew the ".concat(part));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = ['left ear', 'right ear', 'lobes'];
                _k.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                part = _b[_i];
                return [5 /*yield**/, _loop_1(part)];
            case 4:
                _k.sent();
                _k.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                expect(stuckCard(files).stuckAt).toBeUndefined();
                handsIn = function (message, turnId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: "h-".concat(turnId), agentId: 'a1', message: message })];
                            case 1:
                                _a.sent();
                                agents.a1 = 'completed';
                                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: 'a1' })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, handsIn('The ears are drawn.', 't1')];
            case 7:
                _k.sent();
                return [4 /*yield*/, clock.advance(30 * 60000)
                    // Sent a message after its rest, it is at work again, and not stuck at once for the time it rested
                ];
            case 8:
                _k.sent();
                // Sent a message after its rest, it is at work again, and not stuck at once for the time it rested
                agents.a1 = 'running';
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'bigger', resume: { agentId: 'a1' } }))];
            case 9:
                _k.sent();
                return [4 /*yield*/, clock.advance(25000)];
            case 10:
                _k.sent();
                expect(stuckCard(files)).toMatchObject({ status: 'working' });
                expect(stuckCard(files).stuckAt).toBeUndefined();
                return [4 /*yield*/, handsIn('The ears are bigger.', 't1b')
                    // a2 waits on its own upload in the background, a3 on its helper, a4 on the person; a5 on nothing
                ];
            case 11:
                _k.sent();
                _c = 0, _d = ['Upload the lids', 'Draw the lids', 'Release it', 'Sort the frames'].entries();
                _k.label = 12;
            case 12:
                if (!(_c < _d.length)) return [3 /*break*/, 15];
                _e = _d[_c], n = _e[0], title = _e[1];
                return [4 /*yield*/, begin("a".concat(n + 2), title)];
            case 13:
                _k.sent();
                _k.label = 14;
            case 14:
                _c++;
                return [3 /*break*/, 12];
            case 15:
                _f = 0, _g = ['a2', 'a3', 'a4', 'a5'];
                _k.label = 16;
            case 16:
                if (!(_f < _g.length)) return [3 /*break*/, 19];
                id = _g[_f];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "s-".concat(id), agentId: id, command: 'git status' })];
            case 17:
                _k.sent();
                _k.label = 18;
            case 18:
                _f++;
                return [3 /*break*/, 16];
            case 19: return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'u1', agentId: 'a2', command: 'hold upload', description: 'Upload the lids', run_in_background: true })];
            case 20:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Render the lids', prompt: 'render', parentAgentId: 'a3', resume: { agentId: 'h3' } }))];
            case 21:
                _k.sent();
                agents.h3 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release it?', choices: ['Approve', 'Not now'] })];
            case 22:
                _k.sent();
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 23:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, typeof stuckCard(files, 'a5').stuckAt === 'number' || undefined];
                    }); }); })];
            case 24:
                _h.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(30 * 60000)];
            case 25:
                _k.sent();
                expect(Object.fromEntries(['a1', 'a2', 'a3', 'a4'].map(function (id) { return [id, stuckCard(files, id).stuckAt]; }))).toEqual({ a1: undefined, a2: undefined, a3: undefined, a4: undefined });
                expect(appended.filter(function (line) { return line.includes('Nothing new from'); }).map(function (line) { var _a; return (_a = /Nothing new from "([^"]+)"/.exec(line)) === null || _a === void 0 ? void 0 : _a[1]; })).toEqual(['Sort the frames']);
                expect(logged.filter(function (line) { return line.includes('Nothing new from'); })).toEqual([]);
                (_j = held.get('upload')) === null || _j === void 0 ? void 0 : _j('done');
                return [4 /*yield*/, settle()];
            case 26:
                _k.sent();
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
test("a task may not stop with to-dos open, nothing of its own running and nothing waiting for the person: its stop is refused every time, naming them, with no count kept on its card; with a command of its own in the background, a helper at work or a question open, or where Claude Code says the stop follows a refused one, it stops; a server left for the person holds nothing; its result is refused every time while a to-do is open, and goes through once each is ticked or dropped (18 Nov: detached pictures failed at once, its long word of how far it had got was kept as its result, and nothing went on for three and a half hours)", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, resumed, appended, files, n, call, sends, todo, _i, _b, item, stop, STILL, kept, again, k, _c, _d, _e, _f, said, isKept, render, _g, _h, _j, _k, server, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, REPORT, handback, _w, ONE, _x, _y, _z, reports, _0, _1, _2, done, _3, _4, morning, old, back, folded, _5, every, lines;
    var _this = this;
    var _6, _7, _8, _9, _10, _11, _12;
    return __generator(this, function (_13) {
        switch (_13.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, jobs: { output: function () { return ''; }, wroteAt: function () { return 0; } } }), clock = _a.clock, resumed = _a.resumed, appended = _a.appended, files = _a.files;
                // (Claude Code's own answer to its stop hook)
                on('classic.SubagentStop', function () { return ({}); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _13.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Rebuild the head model', prompt: 'rebuild' }))];
            case 2:
                _13.sent();
                agents.a1 = 'running';
                n = 0;
                call = function (tool, input) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: tool, tool_use_id: "c".concat((n += 1)), agentId: 'a1' }, input))];
                        case 1: return [2 /*return*/, (_a.sent())
                            // (a command sent to the background, by the task id the engine gives it)
                        ];
                    }
                }); }); };
                sends = function (command, description) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, call('Bash', { command: command, description: description, run_in_background: true })];
                        case 1: return [2 /*return*/, (_a.sent(), "bg-c".concat(n))];
                    }
                }); }); };
                todo = function (item, state) { return call('mcp__claudopus__todo', __assign({ item: item }, (state ? { state: state } : {}))); };
                _i = 0, _b = ['Fit every scan', 'Draw new beside old', 'Second look', 'Check the licences'];
                _13.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                return [4 /*yield*/, todo(item)];
            case 4:
                _13.sent();
                _13.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, todo('Fit every scan', 'done')
                // (as it stops, Claude Code says what of its background work is still in flight)
            ];
            case 7:
                _13.sent();
                stop = function () {
                    var args_1 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args_1[_i] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (more) {
                        var _a;
                        if (more === void 0) { more = {}; }
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, $.classic.SubagentStop(__assign({ hook_event_name: 'SubagentStop', agent_id: 'a1', background_tasks: [] }, more))];
                                case 1: return [2 /*return*/, ((_a = (_b.sent())) !== null && _a !== void 0 ? _a : {}).block];
                            }
                        });
                    });
                };
                STILL = 'You may not stop here: 3 to-dos are still open ("Draw new beside old"; "Second look"; "Check the licences"), nothing of yours is running and nothing waits for ';
                return [4 /*yield*/, stop()];
            case 8:
                kept = (_6 = (_13.sent())) !== null && _6 !== void 0 ? _6 : '';
                expect(kept.slice(0, STILL.length)).toBe(STILL);
                expect(kept).toContain('or hand in your result with SubagentHandback after dropping what will not be done');
                again = [];
                k = 0;
                _13.label = 9;
            case 9:
                if (!(k < 8)) return [3 /*break*/, 14];
                _c = k % 2;
                if (!_c) return [3 /*break*/, 11];
                return [4 /*yield*/, call('Bash', { command: 'tail -n 5 pic.log' })];
            case 10:
                _c = (_13.sent());
                _13.label = 11;
            case 11:
                _c;
                _e = (_d = again).push;
                return [4 /*yield*/, stop()];
            case 12:
                (_e.apply(_d, [((_7 = (_13.sent())) !== null && _7 !== void 0 ? _7 : '').startsWith(STILL)]));
                _13.label = 13;
            case 13:
                k++;
                return [3 /*break*/, 9];
            case 14:
                expect(again).toEqual(again.map(function () { return true; }));
                expect(Object.keys(stuckCard(files)).filter(function (key) { return /^(keptOn|carryOn|toldOpen|notDone|leftOpen)$/.test(key); })).toEqual([]);
                // Claude Code's own word that this stop follows a refused one lets it stop, so it is never asked twice in a row
                _f = expect;
                return [4 /*yield*/, stop({ stop_hook_active: true })];
            case 15:
                // Claude Code's own word that this stop follows a refused one lets it stop, so it is never asked twice in a row
                _f.apply(void 0, [_13.sent()]).toBeUndefined();
                said = {};
                isKept = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, stop()];
                        case 1: return [2 /*return*/, ((_a = (_b.sent())) !== null && _a !== void 0 ? _a : '').startsWith('You may not stop here')];
                    }
                }); }); };
                return [4 /*yield*/, sends('hold render', 'Render the heads')];
            case 16:
                render = _13.sent();
                _g = said;
                _h = 'a command of its own in the background';
                return [4 /*yield*/, stop({ background_tasks: [{ id: render }] })];
            case 17:
                _g[_h] = _13.sent();
                return [4 /*yield*/, call('TaskStop', { task_id: render })];
            case 18:
                _13.sent();
                _j = said;
                _k = 'kept, its command stopped';
                return [4 /*yield*/, isKept()
                    // (a server never ends by itself: it is left for the person, and the task has nothing to wait for)
                ];
            case 19:
                _j[_k] = _13.sent();
                return [4 /*yield*/, sends('npx vite preview --port 4174', 'Serve the preview of the heads')];
            case 20:
                server = _13.sent();
                _l = said;
                _m = 'kept, only a server running';
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 21:
                _l[_m] = ((_8 = (_13.sent())) !== null && _8 !== void 0 ? _8 : '').startsWith('You may not stop here');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the heads', prompt: 'draw', parentAgentId: 'a1' }))];
            case 22:
                _13.sent();
                agents.a2 = 'running';
                _o = said;
                _p = 'a helper at work';
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 23:
                _o[_p] = _13.sent();
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Drawn.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })];
            case 24:
                _13.sent();
                _q = said;
                _r = 'kept, its helper ended';
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
                            case 1: return [2 /*return*/, ((_a = (_b.sent())) !== null && _a !== void 0 ? _a : '').startsWith('You may not stop here') || undefined];
                        }
                    }); }); })];
            case 25:
                _q[_r] = _13.sent();
                return [4 /*yield*/, call('mcp__claudopus__ask', { text: 'Which licence may the heads carry?', choices: ['Open', 'Ours'] })];
            case 26:
                _13.sent();
                _s = said;
                _t = 'a question open for the person';
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 27:
                _s[_t] = _13.sent();
                return [4 /*yield*/, call('mcp__claudopus__ask', { text: '' })];
            case 28:
                _13.sent();
                _u = said;
                _v = 'kept, its question taken back';
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 29:
                _u[_v] = ((_9 = (_13.sent())) !== null && _9 !== void 0 ? _9 : '').startsWith('You may not stop here');
                expect(said).toEqual({
                    'a command of its own in the background': undefined,
                    'kept, its command stopped': true,
                    'kept, only a server running': true,
                    'a helper at work': undefined,
                    'kept, its helper ended': true,
                    'a question open for the person': undefined,
                    'kept, its question taken back': true,
                });
                // Kept, nothing of Claudopus's starts it again or writes to it
                return [4 /*yield*/, clock.advance(6000)];
            case 30:
                // Kept, nothing of Claudopus's starts it again or writes to it
                _13.sent();
                expect(resumed).toEqual([]);
                REPORT = "The new model is nearer on unseen heads.".concat(' Each head kept aside is closer behind the ear.'.repeat(12));
                handback = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, call('SubagentHandback', { message: REPORT })];
                        case 1: return [2 /*return*/, (_a.sent()).deny];
                    }
                }); }); };
                _w = expect;
                return [4 /*yield*/, handback()];
            case 31:
                _w.apply(void 0, [_13.sent()]).toContain('Not handed in: 3 to-dos are still open: "Draw new beside old"; "Second look"; "Check the licences".');
                return [4 /*yield*/, todo('Draw new beside old', 'done')];
            case 32:
                _13.sent();
                return [4 /*yield*/, todo('Check the licences', 'done')];
            case 33:
                _13.sent();
                ONE = 'Not handed in: a to-do is still open: "Second look".';
                _x = expect;
                return [4 /*yield*/, handback()];
            case 34:
                _y = [_13.sent()];
                return [4 /*yield*/, handback()];
            case 35:
                _y = _y.concat([_13.sent()]);
                return [4 /*yield*/, handback()];
            case 36:
                _y = _y.concat([_13.sent()]);
                return [4 /*yield*/, handback()];
            case 37:
                _x.apply(void 0, [_y.concat([_13.sent()]).map(function (deny) { return deny === null || deny === void 0 ? void 0 : deny.slice(0, ONE.length); })]).toEqual([ONE, ONE, ONE, ONE]);
                // One to-do open is said as one, as its stop is refused
                _z = expect;
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 38:
                // One to-do open is said as one, as its stop is refused
                _z.apply(void 0, [_13.sent()]).toContain('You may not stop here: a to-do is still open ("Second look")');
                reports = function () { return __spreadArray([], files.keys(), true).filter(function (path) { return path.endsWith('/report.md'); }); };
                expect(reports()).toEqual([]);
                // Dropped, none is open: it may stop, and its result goes through, as it was written, its card done
                return [4 /*yield*/, todo('Second look', 'dropped')];
            case 39:
                // Dropped, none is open: it may stop, and its result goes through, as it was written, its card done
                _13.sent();
                _0 = expect;
                return [4 /*yield*/, stop({ background_tasks: [{ id: server }] })];
            case 40:
                _0.apply(void 0, [_13.sent()]).toBeUndefined();
                _1 = expect;
                return [4 /*yield*/, handback()];
            case 41:
                _1.apply(void 0, [_13.sent()]).toBeUndefined();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't3', reason: 'answer', agentId: 'a1' })];
            case 42:
                _13.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 43:
                _13.sent();
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, reports().length || undefined];
                    }); }); })];
            case 44:
                _2.apply(void 0, [_13.sent()]).toBe(1);
                expect((_11 = files.get((_10 = reports()[0]) !== null && _10 !== void 0 ? _10 : '')) === null || _11 === void 0 ? void 0 : _11.startsWith(REPORT)).toBe(true);
                expect(files.get((_12 = reports()[0]) !== null && _12 !== void 0 ? _12 : '')).not.toContain('Not done');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 45:
                done = _13.sent();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, done.find({ type: 'Text', text: '◐ Delivered' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 46:
                _3.apply(void 0, [_13.sent()]).toBeDefined();
                _4 = expect;
                return [4 /*yield*/, done.findAll({ type: 'Text' })];
            case 47:
                _4.apply(void 0, [(_13.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (text) { return /^Not done/.test(text); })]).toEqual([]);
                return [4 /*yield*/, done.unmount()];
            case 48:
                _13.sent();
                expect(appended.filter(function (line) { return /to-dos? not done/.test(line); })).toEqual([]);
                expect(resumed).toEqual([]);
                morning = 1700000000000 - 8 * 3600000;
                old = function (id, title, items, more) { return (__assign({ id: id, parentId: '', title: title, words: title, items: items.map(function (_a) {
                        var text = _a[0], state = _a[1];
                        return ({ text: text, state: state });
                    }), entries: [], answer: '', tokens: 1, startedAt: morning - 1800000, endedAt: morning, status: 'done', model: 'claude-opus-5-5' }, more)); };
                files.set("".concat(MEMORY, "/finished/engine-id.json"), JSON.stringify([
                    old('b1', 'Fix the two tests failing on main', [['See both tests fail', 'done'], ['Fix each at its cause', 'done'], ['Run every test', 'doing'], ['Ask you to release', 'open'], ['Fix the other failures', 'open']], {}),
                    old('b2', 'Clear task clutter out of the chat', [['Find each line', 'done'], ['Release it on your press', 'open']], { notDone: ['Release it on your press'], entries: [{ at: morning, kind: 'note', text: 'Released · Claudopus 0.2.192 is out' }] }),
                ]));
                return [4 /*yield*/, $.session.start(start)];
            case 49:
                _13.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 50:
                back = _13.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, back.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })];
                        }
                    }); }); })];
            case 51:
                folded = _13.sent();
                _5 = expect;
                return [4 /*yield*/, back.find({ type: 'Text', text: /^Fix the two tests|^Clear task clutter/ })];
            case 52:
                _5.apply(void 0, [_13.sent()]).toBeUndefined();
                if (!folded) return [3 /*break*/, 54];
                return [4 /*yield*/, back.press({ key: String(folded.key) })
                    // (under the task of this test, done with its server still running)
                ];
            case 53:
                _13.sent();
                _13.label = 54;
            case 54: return [4 /*yield*/, back.findAll({ type: 'Text' })];
            case 55:
                every = (_13.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                lines = every.slice(every.indexOf('Fix the two tests failing on main'));
                expect(lines.filter(function (text) { return /(2 of 5|1 of 2) to-dos done/.test(text); })).toHaveLength(2);
                expect(lines.filter(function (text) { return text === '✓ Done'; })).toHaveLength(2);
                expect(lines.filter(function (text) { return text === 'Not done · Release it on your press'; })).toEqual([]);
                return [4 /*yield*/, back.unmount()];
            case 56:
                _13.sent();
                return [2 /*return*/];
        }
    });
}); });
