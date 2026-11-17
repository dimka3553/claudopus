// Work that goes on when the chat's process ends: what the keeper reads, the keeper started, cut-off work marked and started again
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
var KEEP_AT = "".concat(MEMORY, "/keep/engine-id");
var KEEP_NOW = 1700000000000;
// What the last process of this chat left: the work it had at work, and when the keeper saw it end
var leftAtWork = function (files, ids, cutAt, pid) {
    if (cutAt === void 0) { cutAt = KEEP_NOW - 60000; }
    if (pid === void 0) { pid = '4242'; }
    files.set("".concat(KEEP_AT, ".json"), JSON.stringify({ count: ids.length, ids: ids, title: 'Contest', pid: pid, at: cutAt - 5000 }));
    files.set("".concat(KEEP_AT, ".state"), JSON.stringify({ cutAt: cutAt, count: ids.length }));
};
var cardText = function ($, pattern) { return __awaiter(_this, void 0, void 0, function () {
    var pane, found;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 1:
                pane = _a.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: pattern })];
            case 2:
                found = (_a.sent()).map(function (one) { return ({ text: one.text, color: one.props.color }); });
                return [4 /*yield*/, pane.unmount()];
            case 3:
                _a.sent();
                return [2 /*return*/, found];
        }
    });
}); };
test('what is at work is kept for the keeper, with the process that runs it, and a chat run from another Mac starts one', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('keeper started for engine-id');
                return [4 /*yield*/, $.prompt.submit({ text: 'solve the cameras', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Solve the cameras', prompt: 'solve' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, clock.advance(21000)];
            case 4:
                _d.sent();
                expect(JSON.parse((_b = files.get("".concat(KEEP_AT, ".json"))) !== null && _b !== void 0 ? _b : '{}')).toMatchObject({ count: 1, ids: ['a1'] });
                return [4 /*yield*/, $.turn.complete({ answer: 'Solved: all 158 frames placed, and the report is written with every number.'.repeat(4), durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 5:
                _d.sent();
                return [4 /*yield*/, clock.advance(21000)];
            case 6:
                _d.sent();
                expect(JSON.parse((_c = files.get("".concat(KEEP_AT, ".json"))) !== null && _c !== void 0 ? _c : '{}')).toMatchObject({ count: 0, ids: [] });
                return [2 /*return*/];
        }
    });
}); });
test('a chat this Mac runs itself, and the copy the keeper started, start no keeper', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1', CLAUDE_CODE_SESSION_KIND: 'bg' } }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                expect((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').not.toContain('keeper started');
                return [2 /*return*/];
        }
    });
}); });
test('work cut off as the process ended is started again with a message, its card says so, and the person is told', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, resumed, logged, lines;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, resumed = _a.resumed, logged = _a.logged;
                leftAtWork(files, ['a7', 'a8']);
                return [4 /*yield*/, $.session.start(start)
                    // Nothing until Claude Code has had its moment to start what it starts itself
                ];
            case 1:
                _d.sent();
                // Nothing until Claude Code has had its moment to start what it starts itself
                expect(resumed).toEqual([]);
                return [4 /*yield*/, clock.advance(31000)];
            case 2:
                _d.sent();
                expect(resumed.map(function (one) { return one.split(':')[0]; })).toEqual(['a7', 'a8']);
                expect(resumed[0]).toContain("this chat's process was ended at");
                expect(resumed[0]).toContain('not by');
                return [4 /*yield*/, cardText($, /^Interrupted at /)];
            case 3:
                lines = _d.sent();
                expect(lines).toHaveLength(2);
                expect((_b = lines[0]) === null || _b === void 0 ? void 0 : _b.text).toMatch(/^Interrupted at \d\d:\d\d because the chat's process ended; running again since \d\d:\d\d\.$/);
                expect(logged.some(function (line) { return /^2 tasks were interrupted at \d\d:\d\d and have been running again since \d\d:\d\d\.$/.test(line); })).toBe(true);
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('cut-off notice pushed');
                // The keeper's file says both are at work again
                expect(JSON.parse((_c = files.get("".concat(KEEP_AT, ".json"))) !== null && _c !== void 0 ? _c : '{}')).toMatchObject({ count: 2 });
                return [2 /*return*/];
        }
    });
}); });
test('in the copy kept on this Mac, work Claude Code started again itself is only marked; one it could not is said in amber', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, resumed, logged, lines, said;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_CODE_SESSION_KIND: 'bg' }, agents: { a7: 'running' }, kinds: { a7: 'general-purpose' }, unresumable: new Set(['a8']) }), files = _a.files, clock = _a.clock, resumed = _a.resumed, logged = _a.logged;
                leftAtWork(files, ['a7', 'a8']);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 2:
                _d.sent();
                expect(resumed).toEqual([]);
                return [4 /*yield*/, cardText($, /^Interrupted at /)];
            case 3:
                lines = _d.sent();
                said = function (end) { return lines.find(function (one) { var _a; return (_a = one.text) === null || _a === void 0 ? void 0 : _a.endsWith(end); }); };
                expect(lines.map(function (one) { var _a; return (_a = one.text) === null || _a === void 0 ? void 0 : _a.replace(/\d\d:\d\d/g, 'hh:mm'); }).sort()).toEqual([
                    "Interrupted at hh:mm because the chat's process ended; it couldn't be restarted.",
                    "Interrupted at hh:mm because the chat's process ended; running again since hh:mm.",
                ]);
                expect((_b = said("it couldn't be restarted.")) === null || _b === void 0 ? void 0 : _b.color).toBe('#E5A50A');
                expect((_c = lines.find(function (one) { var _a; return (_a = one.text) === null || _a === void 0 ? void 0 : _a.includes('running again'); })) === null || _c === void 0 ? void 0 : _c.color).toBeUndefined();
                expect(logged.some(function (line) { return line.includes('has been running on this Mac by itself') && line.includes("couldn't be restarted"); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a chat with no keeper starts nothing again, and a cut is taken up once, through a reload of the mod before it was done', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, resumed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, resumed = _a.resumed;
                // Work left at work with no keeper to see its process end, as a chat quit on purpose days ago
                files.set("".concat(KEEP_AT, ".json"), JSON.stringify({ count: 1, ids: ['a6'], title: 'Contest', pid: '4242', at: KEEP_NOW - 5000 }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 2:
                _b.sent();
                expect(resumed).toEqual([]);
                // A cut the keeper saw, and a reload 10 s into the new process: each piece is sent one message, not two
                leftAtWork(files, ['a7'], KEEP_NOW + 31000 - 60000);
                return [4 /*yield*/, $.session.start(start)];
            case 3:
                _b.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 5:
                _b.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 6:
                _b.sent();
                expect(resumed.map(function (one) { return one.split(':')[0]; })).toEqual(['a7']);
                // Loaded again once it was done: nothing more
                return [4 /*yield*/, $.session.start(start)];
            case 7:
                // Loaded again once it was done: nothing more
                _b.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 8:
                _b.sent();
                expect(resumed).toHaveLength(1);
                // A day and more ago
                leftAtWork(files, ['a9'], KEEP_NOW - 25 * 3600000);
                return [4 /*yield*/, $.session.start(start)];
            case 9:
                _b.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 10:
                _b.sent();
                expect(resumed).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
test('the notice names each piece by its own title', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, logged, card, said;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { unresumable: new Set(['a8']) }), files = _a.files, clock = _a.clock, logged = _a.logged;
                card = function (id, title) { return ({ id: id, parentId: '', isFork: false, tokens: 0, title: title, words: '', items: [], entries: [], answer: '', startedAt: KEEP_NOW - 600000, endedAt: KEEP_NOW - 60000, status: 'stopped' }); };
                // Kept in the order the other way round from the keeper's file
                files.set("".concat(MEMORY, "/finished/engine-id.json"), JSON.stringify([card('a8', 'Train the splats'), card('a7', 'Solve the cameras')]));
                leftAtWork(files, ['a7', 'a8']);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 2:
                _c.sent();
                said = (_b = logged.find(function (line) { return line.includes('was interrupted at'); })) !== null && _b !== void 0 ? _b : '';
                expect(said).toMatch(/^"Solve the cameras" was interrupted at \d\d:\d\d and has been running again since \d\d:\d\d\. "Train the splats" interrupted at \d\d:\d\d couldn't be restarted\.$/);
                return [2 /*return*/];
        }
    });
}); });
test('a turn ended by the lapsed sign-in of the app hands the chat to the keeper, its work counted as at work', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, lapse;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'train the splats', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Train the splats', prompt: 'train' }))
                    // Another error is not a lapsed sign-in
                ];
            case 3:
                _b.sent();
                // Another error is not a lapsed sign-in
                return [4 /*yield*/, $.turn.complete({ answer: 'API Error: 529 overloaded', durationMs: 1, isAborted: false, turnId: 't0', reason: 'error', agentId: 'a1' })];
            case 4:
                // Another error is not a lapsed sign-in
                _b.sent();
                expect(files.has("".concat(KEEP_AT, ".handover"))).toBe(false);
                lapse = function (turnId) { return $.turn.complete({ answer: 'API Error: 401 {"type":"error","error":{"type":"authentication_error","message":"OAuth token has expired."}}', durationMs: 1, isAborted: false, turnId: turnId, reason: 'error', agentId: 'a1' }); };
                // Once is no lapse; twice within minutes is
                return [4 /*yield*/, lapse('t1')];
            case 5:
                // Once is no lapse; twice within minutes is
                _b.sent();
                expect(files.has("".concat(KEEP_AT, ".handover"))).toBe(false);
                return [4 /*yield*/, lapse('t2')];
            case 6:
                _b.sent();
                expect(files.has("".concat(KEEP_AT, ".handover"))).toBe(true);
                expect(JSON.parse((_a = files.get("".concat(KEEP_AT, ".json"))) !== null && _a !== void 0 ? _a : '{}')).toMatchObject({ ids: ['a1'] });
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
