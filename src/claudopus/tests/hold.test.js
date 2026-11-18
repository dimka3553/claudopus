// Claude's helper is never held: the engine switches off an add-on that keeps its shared helper from answering for five seconds.
// Each heavy step is run on records as large as a long chat's, with a timer of the test's own that should fire every 5 ms: the
// longest it waited is how long the mod held the helper
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
// The longest a step may hold it here: a fifth of the engine's limit, as GitHub's runners are about twice as slow as a Mac
var HOLD_MOST = 1000;
var holdMeter = function () {
    var worst = 0;
    var last = Date.now();
    var isDone = false;
    var tick = function () {
        var now = Date.now();
        worst = Math.max(worst, now - last);
        last = now;
        if (!isDone)
            setTimeout(tick, 5);
    };
    setTimeout(tick, 5);
    return function () { return ((isDone = true), worst); };
};
// One task's record as the engine saves it: rows of about `size` characters, each a step with what came back, to-dos and notes
var recordOf = function (size) {
    var rows = [];
    var length = 0;
    for (var k = 0; length < size; k++) {
        var at = "2026-11-16T".concat(String(10 + Math.floor(k / 3600) % 14).padStart(2, '0'), ":").concat(String(Math.floor(k / 60) % 60).padStart(2, '0'), ":").concat(String(k % 60).padStart(2, '0'), "Z");
        var row = k % 3 === 0
            ? JSON.stringify({ timestamp: at, type: 'assistant', message: { model: 'claude-opus-5-5', usage: { input_tokens: 10, output_tokens: 5 }, content: [{ type: 'tool_use', name: 'mcp__claudopus__todo', input: { item: "Step ".concat(k % 40), state: 'done' } }, { type: 'tool_use', name: 'mcp__claudopus__note', input: { text: "Done step ".concat(k) } }] } })
            : JSON.stringify({ timestamp: at, type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: "u".concat(k), content: 'x'.repeat(4000) }] } });
        rows.push(row);
        length += row.length + 1;
    }
    return rows.join('\n');
};
// A long hold by the mod comes back each time; one by a busy machine (the areas' tests run side by side) does not: a step is
// measured up to three times, on fresh records, and its least counts
var TRIES = 3;
test('a chat whose ended tasks have records of 4 MB and 170 MB loads without holding Claude\'s helper', { timeoutMs: 180000 }, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, folder, near, huge, pane, least, _loop_1, round;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = world(on).files;
                folder = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents");
                near = recordOf(4100000);
                huge = near.repeat(2);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 1:
                pane = _a.sent();
                least = Infinity;
                _loop_1 = function (round) {
                    var k, held, fold, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                // Each load reads back the newest forty it has no card for: a round's are newer than the last's
                                for (k = 0; k < 42; k++) {
                                    files.set("".concat(folder, "/agent-r").concat(round, "x").concat(k, ".meta.json"), JSON.stringify({ description: "Old work ".concat(round, " ").concat(k), spawnDepth: 1, finished: true }));
                                    files.set("".concat(folder, "/agent-r").concat(round, "x").concat(k, ".jsonl"), k < 2 ? huge : near);
                                    files.set("mtime:".concat(folder, "/agent-r").concat(round, "x").concat(k, ".jsonl"), String(1700000000000 + round * 1000 - k));
                                }
                                held = holdMeter();
                                return [4 /*yield*/, $.session.start(start)
                                    // read back whole, the newest forty of this round's: their fold opened, the newest listed
                                ];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /^▸ Finished 40$/.test(String(b.props.label)); })];
                                        }
                                    }); }); })];
                            case 2:
                                fold = _c.sent();
                                least = Math.min(least, held());
                                if (!fold) return [3 /*break*/, 4];
                                return [4 /*yield*/, pane.press({ key: String(fold.key) })];
                            case 3:
                                _c.sent();
                                _c.label = 4;
                            case 4:
                                _b = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _b = (_a = JSON).stringify;
                                                return [4 /*yield*/, pane.drawn()];
                                            case 1: return [2 /*return*/, (_b.apply(_a, [_c.sent()]).includes("Old work ".concat(round, " 2")) ? 'listed' : undefined)];
                                        }
                                    }); }); })];
                            case 5:
                                _b.apply(void 0, [_c.sent()]).toBe('listed');
                                return [2 /*return*/];
                        }
                    });
                };
                round = 0;
                _a.label = 2;
            case 2:
                if (!(round < TRIES && least >= HOLD_MOST)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(round)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                round++;
                return [3 /*break*/, 2];
            case 5:
                expect(least).toBeLessThan(HOLD_MOST);
                return [4 /*yield*/, pane.unmount()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('behind, the mod gives its panes as they were and leaves out what can wait until it has caught up, then draws them again; a long hold is logged with its chat and the steps begun then', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, pane, before, _b, _c, end, _d, _e, _f, _g, k, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { env: { CLAUDOPUS_TIMING: 'real' } }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose.' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _j.sent();
                return [4 /*yield*/, clock.advance(1000)
                    // A note drawn afresh just before
                ];
            case 5:
                _j.sent();
                // A note drawn afresh just before
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'Looked at the nose' })];
            case 6:
                // A note drawn afresh just before
                _j.sent();
                return [4 /*yield*/, pane.redraw()];
            case 7:
                _j.sent();
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, pane.drawn()];
            case 8:
                before = _c.apply(_b, [_j.sent()]);
                expect(before).toContain('Looked at the nose');
                end = Date.now() + 1800;
                while (Date.now() < end)
                    Math.sqrt(Date.now());
                return [4 /*yield*/, clock.advance(250)];
            case 9:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (_b = ((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').match(/Claude's helper was held (\d+) ms in chat engine-id; steps begun then: [^\n]*draw the panel/)) === null || _b === void 0 ? void 0 : _b[0]];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                // A note that would change the card: the pane is given as it was while behind
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Measured the nose' })];
            case 11:
                // A note that would change the card: the pane is given as it was while behind
                _j.sent();
                return [4 /*yield*/, pane.redraw()];
            case 12:
                _j.sent();
                _e = expect;
                _g = (_f = JSON).stringify;
                return [4 /*yield*/, pane.drawn()];
            case 13:
                _e.apply(void 0, [_g.apply(_f, [_j.sent()])]).toBe(before);
                k = 0;
                _j.label = 14;
            case 14:
                if (!(k < 44)) return [3 /*break*/, 17];
                return [4 /*yield*/, clock.advance(250)];
            case 15:
                _j.sent();
                _j.label = 16;
            case 16:
                k++;
                return [3 /*break*/, 14];
            case 17:
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /Measured the nose/ })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text];
                        }
                    }); }); })];
            case 18:
                _h.apply(void 0, [_j.sent()]).toContain('Measured the nose');
                return [4 /*yield*/, pane.unmount()];
            case 19:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
