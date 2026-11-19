// The chat's process: what is at work is recorded beside it, a card found at work after the process was replaced says the app
// closed while it worked, and the watcher that brings Claudopus back
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
var KEEP_AT = "".concat(MEMORY, "/keep/engine-id");
var KEEP_NOW = 1700000000000;
test("what is at work is recorded with the chat's process that runs it, each task by its title, and is taken out as it ends; no keeper is started, whatever runs the chat", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, kept, _b, _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Solve the cameras', prompt: 'solve' }))];
            case 3:
                _e.sent();
                kept = function () { var _a; return JSON.parse((_a = files.get("".concat(KEEP_AT, ".json"))) !== null && _a !== void 0 ? _a : '{}'); };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (((_a = kept().ids) === null || _a === void 0 ? void 0 : _a.length) ? kept() : undefined)];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toMatchObject({ ids: ['a1'], titles: { a1: 'Solve the cameras' }, pid: '4242' });
                // It hands in its result: nothing is at work
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Solved: all 158 frames placed, and the report is written with every number.' })];
            case 5:
                // It hands in its result: nothing is at work
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 6:
                _e.sent();
                return [4 /*yield*/, clock.advance(21000)];
            case 7:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (((_a = kept().ids) === null || _a === void 0 ? void 0 : _a.length) === 0 ? kept() : undefined)];
                    }); }); })];
            case 8:
                _c.apply(void 0, [_e.sent()]).toMatchObject({ ids: [], pid: '4242' });
                expect((_d = files.get("".concat(MEMORY, "/log.md"))) !== null && _d !== void 0 ? _d : '').not.toContain('keeper');
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return /\/keep\/engine-id\.(state|handover)$/.test(path); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('each chat beats for the watcher that brings Claudopus back, naming its process, the key its copy has in the settings, the settings file and its load, and starts the watcher', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, beat, _b, first, load, rest;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                // This copy is loaded from a marketplace that is a folder on this Mac, as Claudopus's own checkout: its key is that marketplace's
                files.set("".concat(HOME, "/.claude/plugins/known_marketplaces.json"), JSON.stringify({ other: { installLocation: '/elsewhere' }, mine: { installLocation: PLUGIN.replace(/\/mods\/claudopus$/, '') } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                beat = "".concat(MEMORY, "/keep/engine-id.beat");
                _b = ((_c = files.get(beat)) !== null && _c !== void 0 ? _c : '').split('\n'), first = _b[0], load = _b[1], rest = _b.slice(2);
                expect(first).toBe("4242\tclaudopus@mine\t".concat(HOME, "/.claude/settings.json"));
                expect(load).toMatch(/^\d{15}-[a-z0-9]+$/);
                expect(rest).toEqual(['']);
                expect(files.get("".concat(MEMORY, "/log.md"))).not.toContain('was not started');
                files.set(beat, 'old');
                return [4 /*yield*/, clock.advance(3000)];
            case 2:
                _d.sent();
                expect(files.get(beat)).toContain('4242');
                return [2 /*return*/];
        }
    });
}); });
test('a card that was at work when the chat\'s process was replaced, as when the app quits or drops the chat, is failed with "The app closed while it worked" and offers Start again, a task this process has no card for under the title the last process kept; nothing is started again, what Claude Code itself runs again stays at work, and a reload in the same process fails nothing', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, resumed, appended, submitted, lastProcess, shown, _b, now, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on, { agents: { a8: 'running' } }), files = _a.files, clock = _a.clock, resumed = _a.resumed, appended = _a.appended, submitted = _a.submitted;
                lastProcess = function (pid) { return files.set("".concat(KEEP_AT, ".json"), JSON.stringify({ ids: ['a7', 'a8', 'a9'], titles: { a7: 'Solve the cameras', a8: 'Train the splats' }, pid: pid, at: KEEP_NOW - 600000 })); };
                shown = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, texts, buttons;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                            case 2:
                                texts = (_a.sent()).map(function (one) { var _a; return ({ text: String((_a = one.text) !== null && _a !== void 0 ? _a : ''), color: one.props.color }); });
                                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 3:
                                buttons = (_a.sent()).map(function (one) { var _a; return String((_a = one.props.label) !== null && _a !== void 0 ? _a : ''); });
                                return [4 /*yield*/, pane.unmount()];
                            case 4:
                                _a.sent();
                                return [2 /*return*/, { failed: texts.filter(function (one) { return one.text.startsWith('✕ Failed'); }), titles: texts.filter(function (one) { return /^(Solve the cameras|Train the splats)$/.test(one.text); }).map(function (one) { return one.text; }), again: buttons.filter(function (label) { return label === 'Start again'; }).length }];
                        }
                    });
                }); };
                // The same process wrote it: a reload of the mod, which ends nothing
                lastProcess('4242');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 2:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, shown()];
            case 3:
                _b.apply(void 0, [_d.sent()]).toEqual({ failed: [], titles: [], again: 0 });
                // Another process wrote it and is gone: its work ended with it
                lastProcess('3131');
                return [4 /*yield*/, $.session.start(start)];
            case 4:
                _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, shown()];
                            case 1:
                                if (!(_b.sent()).failed.length) return [3 /*break*/, 3];
                                return [4 /*yield*/, shown()];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = undefined;
                                _b.label = 4;
                            case 4: return [2 /*return*/, (_a)];
                        }
                    }); }); })];
            case 5:
                now = _d.sent();
                expect(now === null || now === void 0 ? void 0 : now.failed.map(function (one) { return one.text; })).toEqual(['✕ Failed · The app closed while it worked']);
                expect(now === null || now === void 0 ? void 0 : now.titles).toEqual(['Solve the cameras']);
                expect(now === null || now === void 0 ? void 0 : now.again).toBe(1);
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain("the chat's process was replaced (3131 to 4242) while work was at work: a7 ended with it");
                // Nothing starts it again by itself, at the moment the old keeper took or later, and the chat is told to start nothing
                return [4 /*yield*/, clock.advance(31000)];
            case 6:
                // Nothing starts it again by itself, at the moment the old keeper took or later, and the chat is told to start nothing
                _d.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 7:
                _d.sent();
                expect(resumed).toEqual([]);
                expect(__spreadArray(__spreadArray([], appended, true), submitted, true).filter(function (line) { return /again|cut off|process was ended/.test(line); })).toEqual([]);
                // Loaded again in this process, the card is as it was: failed once, never a second card
                return [4 /*yield*/, $.session.start(start)];
            case 8:
                // Loaded again in this process, the card is as it was: failed once, never a second card
                _d.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 9:
                _d.sent();
                _c = expect;
                return [4 /*yield*/, shown()];
            case 10:
                _c.apply(void 0, [(_d.sent()).failed.map(function (one) { return one.text; })]).toEqual(['✕ Failed · The app closed while it worked']);
                expect(resumed).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
