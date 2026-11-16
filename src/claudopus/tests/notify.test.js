// Sounds and notifications: work that is ready, and work that needs the person
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
test('work that is ready plays one sound and raises one notification; helpers, a second report, a Stop press and a reload make none; stopped work says so silently', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var app, _a, clock, played, notified, files, osa, own, end, pane;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                app = { noSurface: false, claudopus: 0 };
                _a = world(on, { app: app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34', __CFBundleIdentifier: 'com.anthropic.claudefordesktop' } }), clock = _a.clock, played = _a.played, notified = _a.notified, files = _a.files, osa = _a.osa, own = _a.own;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                end = function (agentId, turnId, answer, extra) {
                    if (answer === void 0) { answer = 'Done.'; }
                    if (extra === void 0) { extra = {}; }
                    return $.turn.complete(__assign({ answer: answer, durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: agentId }, extra));
                };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))
                    // Its helper ends first: nothing
                ];
            case 2:
                _d.sent();
                // Its helper ends first: nothing
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Measure the nose', prompt: 'measure', parentAgentId: 'a1' }))];
            case 3:
                // Its helper ends first: nothing
                _d.sent();
                return [4 /*yield*/, end('a2', 'h1')];
            case 4:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _d.sent();
                expect(played).toEqual([]);
                expect(notified).toEqual([]);
                // The work finishes: one sound, one line with its title and the first words of its answer
                return [4 /*yield*/, end('a1', 't1', '**The nose is fixed.** Both nostrils now match, and the tests pass.\n\nMore below.')];
            case 6:
                // The work finishes: one sound, one line with its title and the first words of its answer
                _d.sent();
                expect(played).toEqual([]);
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _d.sent();
                expect(played).toEqual(['sounds/ready.wav']);
                expect(notified).toEqual(['Fix the nose | The nose is fixed.']);
                // Sent on and ending again within seconds: no second sound or notification
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'One more look.' })];
            case 8:
                // Sent on and ending again within seconds: no second sound or notification
                _d.sent();
                return [4 /*yield*/, end('a1', 't2')];
            case 9:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 10:
                _d.sent();
                expect(played).toHaveLength(1);
                expect(notified).toHaveLength(1);
                // Two that finish together: one sound and one notification naming both; what waits on the person comes first
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 11:
                // Two that finish together: one sound and one notification naming both; what waits on the person comes first
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 12:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a3', items: ['Do you want the left ear bigger?'] })];
            case 13:
                _d.sent();
                return [4 /*yield*/, end('a3', 't3')];
            case 14:
                _d.sent();
                return [4 /*yield*/, clock.advance(300)];
            case 15:
                _d.sent();
                return [4 /*yield*/, end('a4', 't4')];
            case 16:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _d.sent();
                expect(played).toHaveLength(2);
                expect(notified.at(-1)).toBe('2 tasks are done | Check the ears: done · Draw the eyes: done');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the chin', prompt: 'check the chin' }))];
            case 18:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', agentId: 'a5', items: ['Do you want the chin rounder?'] })];
            case 19:
                _d.sent();
                return [4 /*yield*/, end('a5', 't5')];
            case 20:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 21:
                _d.sent();
                expect(notified.at(-1)).toBe('Check the chin | Waiting for the person: Do you want the chin rounder?');
                // Failed work: a notification that says so, and no sound
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Paint the hair', prompt: 'paint the hair' }))];
            case 22:
                // Failed work: a notification that says so, and no sound
                _d.sent();
                return [4 /*yield*/, end('a6', 't6', '', { reason: 'error' })];
            case 23:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 24:
                _d.sent();
                expect(played).toHaveLength(3);
                expect(notified.at(-1)).toBe('Paint the hair | Failed with an error.');
                // Work the person stops with its Stop button: nothing
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 25:
                // Work the person stops with its Stop button: nothing
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 26:
                pane = _d.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a7' })];
            case 27:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 28:
                _d.sent();
                return [4 /*yield*/, pane.unmount()];
            case 29:
                _d.sent();
                expect(notified).toHaveLength(4);
                // A reload announces nothing that ended before it, and goes on announcing what ends after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 30:
                // A reload announces nothing that ended before it, and goes on announcing what ends after it
                _d.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 31:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 32:
                _d.sent();
                expect(notified).toHaveLength(4);
                return [4 /*yield*/, end('a8', 't8', 'The ears are drawn.')];
            case 33:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 34:
                _d.sent();
                expect(notified.at(-1)).toBe('Draw the ears | The ears are drawn.');
                expect(played).toHaveLength(4);
                // Where the app takes no notification from a mod, Claudopus.app raises it, and a click opens this chat in the Claude app
                app.noSurface = true;
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the cheeks', prompt: 'draw the cheeks' }))];
            case 35:
                _d.sent();
                return [4 /*yield*/, end('a9', 't11', 'The cheeks are drawn.')];
            case 36:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 37:
                _d.sent();
                expect((_b = own.at(-1)) === null || _b === void 0 ? void 0 : _b.slice(1)).toEqual(['--title', 'Draw the cheeks', '--text', 'The cheeks are drawn.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ready-a9']);
                expect((_c = own.at(-1)) === null || _c === void 0 ? void 0 : _c[0]).toMatch(/\/bin\/notify$/);
                expect(osa).toEqual([]);
                // Claudopus notifications turned off in System Settings: macOS's plain one instead
                app.claudopus = 2;
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 38:
                _d.sent();
                return [4 /*yield*/, end('a10', 't12', 'The chin is drawn.')];
            case 39:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 40:
                _d.sent();
                expect(own).toHaveLength(2);
                expect(osa.at(-1)).toEqual(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', 'Draw the chin', 'The chin is drawn.']);
                app.noSurface = false;
                // config.json switches each off
                ownSet(files, 'config.json', JSON.stringify({ sound: false }));
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the brows', prompt: 'draw the brows' }))];
            case 41:
                _d.sent();
                return [4 /*yield*/, end('a11', 't9')];
            case 42:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 43:
                _d.sent();
                expect(played).toHaveLength(6);
                expect(notified).toHaveLength(6);
                ownSet(files, 'config.json', JSON.stringify({ notifications: false }));
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lips', prompt: 'draw the lips' }))];
            case 44:
                _d.sent();
                return [4 /*yield*/, end('a12', 't10')];
            case 45:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 46:
                _d.sent();
                expect(played).toHaveLength(7);
                expect(notified).toHaveLength(6);
                expect(osa).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
test('outside the Claude app a click on a notification brings forward the app the chat runs in, such as its terminal', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, own;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { app: { noSurface: true }, env: { CLAUDE_CODE_HOST_SESSION_ID: 'session_x', __CFBundleIdentifier: 'com.googlecode.iterm2' } }), clock = _a.clock, own = _a.own;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 3:
                _c.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 4:
                _c.sent();
                expect((_b = own.at(-1)) === null || _b === void 0 ? void 0 : _b.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--activate', 'com.googlecode.iterm2', '--key', 'ready-a1']);
                return [2 /*return*/];
        }
    });
}); });
test('with neither a chat in the Claude app nor an app to bring forward, a notification names nothing for a click to open', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, own;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { app: { noSurface: true } }), clock = _a.clock, own = _a.own;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 3:
                _c.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 4:
                _c.sent();
                expect((_b = own.at(-1)) === null || _b === void 0 ? void 0 : _b.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--key', 'ready-a1']);
                return [2 /*return*/];
        }
    });
}); });
test('work that needs the person is heard once: its notification comes as the amber Claudopus Asks carrying the sound, silent when sound is off', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var app, _a, played, own, osa, files, clock, ask, lead, before;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                app = { noSurface: true, claudopus: 0, asks: 0 };
                _a = world(on, { app: app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } }), played = _a.played, own = _a.own, osa = _a.osa, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _c.sent();
                ask = function (id, text) { return $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text: text }); };
                lead = function (argv) { return argv === null || argv === void 0 ? void 0 : argv.slice(1, argv.indexOf('--title')); };
                // The sound goes in the notification, so macOS plays it as the person set Claudopus Asks and as a Focus allows; no second sound
                return [4 /*yield*/, ask('k1', 'Paste the code.')];
            case 4:
                // The sound goes in the notification, so macOS plays it as the person set Claudopus Asks and as a Focus allows; no second sound
                _c.sent();
                expect(own).toHaveLength(1);
                expect(lead(own[0])).toEqual(['--asks', '--chime']);
                expect((_b = own[0]) === null || _b === void 0 ? void 0 : _b.slice(3)).toEqual(['--title', 'Hide the repo has a question for you', '--text', 'Paste the code.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ask-a1']);
                expect(played).toEqual([]);
                // The same ask said again is neither shown nor heard again
                return [4 /*yield*/, ask('k2', 'Paste the code.')];
            case 5:
                // The same ask said again is neither shown nor heard again
                _c.sent();
                expect(own).toHaveLength(1);
                // Sound off in Config: the amber notification, silent, and no chime of the mod's
                ownSet(files, 'config.json', JSON.stringify({ sound: false }));
                return [4 /*yield*/, ask('k3', 'Press Approve.')];
            case 6:
                _c.sent();
                expect(lead(own.at(-1))).toEqual(['--asks']);
                expect(played).toEqual([]);
                // Claudopus Asks turned off in System Settings: the purple Claudopus, which carries no sound, and the mod's own chime
                ownSet(files, 'config.json', '{}');
                app.asks = 2;
                return [4 /*yield*/, ask('k4', 'Type your password.')];
            case 7:
                _c.sent();
                expect(lead(own.at(-2))).toEqual(['--asks', '--chime']);
                expect(lead(own.at(-1))).toEqual([]);
                expect(played).toEqual(['sounds/ready.wav']);
                expect(osa).toEqual([]);
                // Another within five seconds is shown and not heard again
                return [4 /*yield*/, ask('k4b', 'Type it again.')];
            case 8:
                // Another within five seconds is shown and not heard again
                _c.sent();
                expect(lead(own.at(-1))).toEqual([]);
                expect(played).toHaveLength(1);
                // The first ask on a Mac waits for macOS's allow question without its sound, so the mod's chime is heard at once instead
                app.asks = 5;
                return [4 /*yield*/, clock.advance(6000)];
            case 9:
                _c.sent();
                return [4 /*yield*/, ask('k4c', 'Allow it.')];
            case 10:
                _c.sent();
                expect(lead(own.at(-1))).toEqual(['--asks', '--chime']);
                expect(played).toHaveLength(2);
                app.asks = 0;
                // Notifications off in Config: only the chime; both off: nothing
                ownSet(files, 'config.json', JSON.stringify({ notifications: false }));
                before = own.length;
                return [4 /*yield*/, clock.advance(6000)];
            case 11:
                _c.sent();
                return [4 /*yield*/, ask('k5', 'Pick a name.')];
            case 12:
                _c.sent();
                expect(own).toHaveLength(before);
                expect(played).toHaveLength(3);
                ownSet(files, 'config.json', JSON.stringify({ notifications: false, sound: false }));
                return [4 /*yield*/, clock.advance(6000)];
            case 13:
                _c.sent();
                return [4 /*yield*/, ask('k6', 'Pick a colour.')];
            case 14:
                _c.sent();
                expect(own).toHaveLength(before);
                expect(played).toHaveLength(3);
                return [2 /*return*/];
        }
    });
}); });
