// /claudopus and /servers, and the panel opening and closing in every chat
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
test('/claudopus and /servers say the panel opened, and say plainly where it can be seen when this screen has nowhere to draw it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, $.command.run({ command: 'claudopus', args: '' })];
            case 2:
                _a.apply(void 0, [(_c.sent()).text]).toBe('Claudopus opened its panel.');
                _b = expect;
                return [4 /*yield*/, $.command.run({ command: 'servers', args: '' })];
            case 3:
                _b.apply(void 0, [(_c.sent()).text]).toBe('Claudopus opened the Servers panel.');
                return [2 /*return*/];
        }
    });
}); });
test('/claudopus and /servers on a screen with nowhere to draw a panel say it cannot be shown there and where it can', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on, { unplaced: true });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, $.command.run({ command: 'claudopus', args: '' })];
            case 2:
                _a.apply(void 0, [(_c.sent()).text]).toBe("Claudopus can't show the Claudopus panel on this screen. Open it in the Claude app on the Mac this chat runs on.");
                _b = expect;
                return [4 /*yield*/, $.command.run({ command: 'servers', args: '' })];
            case 3:
                _b.apply(void 0, [(_c.sent()).text]).toBe("Claudopus can't show the Servers panel on this screen. Open it in the Claude app on the Mac this chat runs on.");
                return [2 /*return*/];
        }
    });
}); });
test('opened in one chat, the panel opens in every other chat, at once in one that starts and within seconds in one already running', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, files, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), opened = _a.opened, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                expect(opened).toEqual([]);
                // Another chat on this Mac opened it
                files.set("".concat(MEMORY, "/panel.json"), JSON.stringify({ isOpen: true, at: 1700000000500 }));
                return [4 /*yield*/, clock.advance(2000)];
            case 2:
                _b.sent();
                expect(opened).toEqual(['claudopus']);
                // Followed once: the same choice does not open it again
                return [4 /*yield*/, clock.advance(10000)];
            case 3:
                // Followed once: the same choice does not open it again
                _b.sent();
                expect(opened).toEqual(['claudopus']);
                // A chat that starts while the choice stands opens it as it loads
                return [4 /*yield*/, $.session.start(start)];
            case 4:
                // A chat that starts while the choice stands opens it as it loads
                _b.sent();
                expect(opened).toEqual(['claudopus', 'claudopus']);
                return [2 /*return*/];
        }
    });
}); });
test("a chat that starts reads the other chats before its panel opens, so they never drop out of it while it loads", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, events, read;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), files = _a.files, events = _a.events;
                files.set("".concat(MEMORY, "/panel.json"), JSON.stringify({ isOpen: true, at: 1700000000500 }));
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                read = events.indexOf("list ".concat(MEMORY, "/live/pushed"));
                expect(read).toBeGreaterThanOrEqual(0);
                expect(read).toBeLessThan(events.indexOf('open claudopus'));
                return [2 /*return*/];
        }
    });
}); });
test('/claudopus opens the panel for every chat; closed by hand it closes in every chat and work does not bring it back until asked', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, files, closedAt, again;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), opened = _a.opened, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.command.run({ command: 'claudopus', args: '' })];
            case 2:
                _e.sent();
                expect(JSON.parse((_b = files.get("".concat(MEMORY, "/panel.json"))) !== null && _b !== void 0 ? _b : '{}').isOpen).toBe(true);
                // The person's own close, as the app raises it, keeps this choice (the test kit cannot raise a close of the person's)
                files.set("".concat(MEMORY, "/panel.json"), JSON.stringify({ isOpen: false, at: 1700000000005 }));
                closedAt = JSON.parse((_c = files.get("".concat(MEMORY, "/panel.json"))) !== null && _c !== void 0 ? _c : '{}');
                expect(closedAt.isOpen).toBe(false);
                opened.length = 0;
                // Work started after it was closed, here or in a chat that loads with work running, leaves it closed
                return [4 /*yield*/, $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })];
            case 3:
                // Work started after it was closed, here or in a chat that loads with work running, leaves it closed
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'The nose on head A is flawed, can you fix it?' }))];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 5:
                _e.sent();
                expect(opened).toEqual([]);
                // Asked for again, it is open for every chat again, as a choice later than the close
                return [4 /*yield*/, $.command.run({ command: 'claudopus', args: '' })];
            case 6:
                // Asked for again, it is open for every chat again, as a choice later than the close
                _e.sent();
                again = JSON.parse((_d = files.get("".concat(MEMORY, "/panel.json"))) !== null && _d !== void 0 ? _d : '{}');
                expect(again.isOpen).toBe(true);
                expect(again.at).toBeGreaterThan(closedAt.at);
                return [2 /*return*/];
        }
    });
}); });
test("closed by hand in another chat, the panel closes here; the mod's own close and a screen with nowhere to draw it choose nothing", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, closed, files, clock;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), closed = _a.closed, files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/panel.json"), JSON.stringify({ isOpen: true, at: 1699999999000 }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                files.set("".concat(MEMORY, "/panel.json"), JSON.stringify({ isOpen: false, at: 1700000000500 }));
                return [4 /*yield*/, clock.advance(2000)];
            case 2:
                _c.sent();
                expect(closed).toContain('claudopus');
                // That close is the mod's own and leaves the choice as it was
                expect(JSON.parse((_b = files.get("".concat(MEMORY, "/panel.json"))) !== null && _b !== void 0 ? _b : '{}')).toEqual({ isOpen: false, at: 1700000000500 });
                return [2 /*return*/];
        }
    });
}); });
test('/claudopus on a screen with nowhere to draw the panel does not open it for the other chats', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = world(on, { unplaced: true }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.command.run({ command: 'claudopus', args: '' })];
            case 2:
                _a.sent();
                expect(files.has("".concat(MEMORY, "/panel.json"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('someone whose panel was open before chats shared it has it open in every chat once this version loads', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on, { panes: ['claudopus'] }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                expect(JSON.parse((_a = files.get("".concat(MEMORY, "/panel.json"))) !== null && _a !== void 0 ? _a : '{}').isOpen).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a chat whose panel was never open writes no choice as it loads', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                expect(files.has("".concat(MEMORY, "/panel.json"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
