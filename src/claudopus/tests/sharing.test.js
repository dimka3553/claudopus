// Every chat's work in every panel: other chats listed, answered from here, the header agreeing, ended work shared, names opening chats
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
// ---- Every chat's work in every panel ----
var NOW = 1700000000000;
// This chat's own work as its file shares it with the other chats
var read$todos = function (files) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
    return [2 /*return*/, ((_c = (_b = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}').cards) === null || _b === void 0 ? void 0 : _b.find(function (one) { return one.id === 'a1'; })) !== null && _c !== void 0 ? _c : {})
        // Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
    ];
}); }); };
// Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
var otherChat = function (at, chat, title) {
    if (chat === void 0) { chat = 'chat-b'; }
    if (title === void 0) { title = 'Billing page'; }
    return JSON.stringify({
        chat: chat,
        title: title,
        folder: '/repo/billing',
        host: '',
        at: at,
        cards: [
            { id: 'b1', parentId: '', isFork: false, tokens: 0, model: 'claude-opus-5-5', title: 'Send the invoices', words: 'send them', items: [{ text: 'Draft the mail', state: 'done' }], entries: [{ at: at, kind: 'note', text: 'I drafted the mail.' }], answer: '', ask: { text: 'May I send 12 invoices?', choices: ['Send', 'Not now'], from: 'b1', at: at }, startedAt: at - 60000, endedAt: 0, status: 'working' },
            { id: 'b2', parentId: '', isFork: false, tokens: 0, title: 'Check the totals', words: 'check', items: [], entries: [{ at: at, kind: 'note', text: 'Adding up March.' }], answer: '', startedAt: at - 30000, endedAt: 0, status: 'working' },
        ],
    });
};
test("the panel shows every open chat's running work under that chat's name, this chat's first; a chat gone silent shows none", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, list, bold, _b, _c, buttons, _d, _e, was, _f;
    var _this = this;
    var _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _o.sent();
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                // A chat that has said nothing for minutes was closed, or its Mac sleeps
                files.set("".concat(MEMORY, "/live/chat-c.json"), otherChat(NOW - 200000, 'chat-c', 'Old landing page'));
                return [4 /*yield*/, clock.advance(5000)
                    // This chat says what it runs, for the others
                ];
            case 4:
                _o.sent();
                // This chat says what it runs, for the others
                expect((_j = (_h = JSON.parse((_g = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _g !== void 0 ? _g : '{}').cards) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.title).toBe('Fix the nose');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _o.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 6:
                bold = (_o.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; });
                expect(bold.indexOf('This chat')).toBeGreaterThan(-1);
                expect(bold.indexOf('This chat')).toBeLessThan(bold.indexOf('Fix the nose'));
                expect(bold.indexOf('Fix the nose')).toBeLessThan(bold.indexOf('Billing page'));
                // Under the other chat's name, its ask first
                expect(bold.indexOf('Billing page')).toBeLessThan(bold.indexOf('Send the invoices'));
                expect(bold.indexOf('Send the invoices')).toBeLessThan(bold.indexOf('Check the totals'));
                expect(bold).not.toContain('Old landing page');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'billing' })];
            case 7:
                _b.apply(void 0, [_o.sent()]).toBeDefined();
                // The header counts every chat's: the ask first, then all that runs, here and there
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '1 thing needs you, 2 running' })];
            case 8:
                // The header counts every chat's: the ask first, then all that runs, here and there
                _c.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                buttons = (_o.sent()).map(function (one) { var _a; return (_a = one.key) !== null && _a !== void 0 ? _a : ''; });
                expect(buttons.filter(function (key) { return key.startsWith('stop-'); })).toEqual(['stop-a1']);
                expect(buttons.some(function (key) { return key.startsWith('model-r-'); })).toBe(false);
                // The chat's own work ends: its file says so at once, so the others show it finished as this chat does
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer', agentId: 'a1' })];
            case 10:
                // The chat's own work ends: its file says so at once, so the others show it finished as this chat does
                _o.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 11:
                _o.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                        return [2 /*return*/, (((_c = (_b = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{"cards":[]}').ended) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.status) === 'done' ? true : undefined)];
                    }); }); })];
            case 12:
                _d.apply(void 0, [_o.sent()]).toBe(true);
                // Ended work is written apart from the running, so a chat still on a version that reads only the running cards never shows it as running
                expect(JSON.parse((_k = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _k !== void 0 ? _k : '{}').cards).toEqual([]);
                // A chat of this Mac with no work is not listed in the others' panels
                files.set("".concat(MEMORY, "/live/chat-d.json"), JSON.stringify({ chat: 'chat-d', title: 'Quiet chat', folder: '/repo/quiet', host: '', at: NOW + 6000, cards: [] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 13:
                _o.sent();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Quiet chat' })];
            case 14:
                _e.apply(void 0, [_o.sent()]).toBeUndefined();
                was = JSON.parse((_l = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _l !== void 0 ? _l : '{}').at;
                return [4 /*yield*/, clock.advance(25000)];
            case 15:
                _o.sent();
                expect(JSON.parse((_m = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _m !== void 0 ? _m : '{}').at).toBeGreaterThan(was);
                // Once that chat stops saying so, its work leaves this panel
                return [4 /*yield*/, clock.advance(95000)];
            case 16:
                // Once that chat stops saying so, its work leaves this panel
                _o.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Billing page' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _f.apply(void 0, [_o.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 18:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test("an ask of another chat's work is answered from this panel and reaches that chat's work; that chat acts on it as if pressed there", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, appended, list, send, left, _b, _c, other, replied, _d, _e, _f, _g, id, details, _h, t0, told, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _u.sent();
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _u.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 4:
                send = (_u.sent()).find(function (b) { return b.props.label === 'Send'; });
                expect(send).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_m = send === null || send === void 0 ? void 0 : send.key) !== null && _m !== void 0 ? _m : '' })];
            case 5:
                _u.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (path) { return path.startsWith("".concat(MEMORY, "/live/answers/chat-b/")); })];
                    }); }); })];
            case 6:
                left = _u.sent();
                expect(JSON.parse((_o = files.get(left !== null && left !== void 0 ? left : '')) !== null && _o !== void 0 ? _o : '{}')).toMatchObject({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW });
                expect(left === null || left === void 0 ? void 0 : left.endsWith('.json')).toBe(true);
                // The ask leaves this panel at once
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (b) { return b.props.label === 'Send'; }) ? undefined : true)];
                        }
                    }); }); })];
            case 7:
                // The ask leaves this panel at once
                _b.apply(void 0, [_u.sent()]).toBe(true);
                // A reply in their own words to another chat's ask is left for that chat the same way, and its amber goes here at once
                // (a new title, so the file's size changes as a rewritten file's would)
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW + 4000, 'chat-b', 'Billing pages'));
                return [4 /*yield*/, clock.advance(5000)];
            case 8:
                _u.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'May I send 12 invoices?' })];
                    }); }); })];
            case 9:
                _c.apply(void 0, [_u.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 10:
                other = (_u.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_p = other === null || other === void 0 ? void 0 : other.key) !== null && _p !== void 0 ? _p : '', text: 'Only the March ones' })];
            case 11:
                _u.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = __spreadArray([], files.entries(), true).find(function (_a) {
                                var path = _a[0], body = _a[1];
                                return path.startsWith("".concat(MEMORY, "/live/answers/chat-b/")) && body.includes('Only the March ones');
                            })) === null || _a === void 0 ? void 0 : _a[1]];
                    }); }); })];
            case 12:
                replied = _u.sent();
                expect(JSON.parse(replied !== null && replied !== void 0 ? replied : '{}')).toMatchObject({ card: 'b1', choice: 'Only the March ones', isReply: true, askAt: NOW + 4000 });
                // It is none of the ask's buttons, so the ask stays here, as in its own chat, with the reply under it; its buttons and box go at once
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'May I send 12 invoices?' })];
            case 13:
                // It is none of the ask's buttons, so the ask stays here, as in its own chat, with the reply under it; its buttons and box go at once
                _d.apply(void 0, [_u.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^✓ You replied “Only the March ones” · sent to the chat "Billing pages", whose work reads it at its next step$/ })];
                    }); }); })];
            case 14:
                _e.apply(void 0, [_u.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 15:
                _f.apply(void 0, [(_u.sent()).some(function (b) { return b.props.label === 'Send'; })]).toBe(false);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 16:
                _g.apply(void 0, [(_u.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 17:
                id = (_s = (_r = (_q = (_u.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('open-r-'); })) === null || _q === void 0 ? void 0 : _q.key) === null || _r === void 0 ? void 0 : _r.replace(/^open-/, '').replace(/-\d+$/, '')) !== null && _s !== void 0 ? _s : '';
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: "work-".concat(id), surface: 'desktop' }))];
            case 18:
                details = _u.sent();
                _h = expect;
                return [4 /*yield*/, details.find({ type: 'Text', text: /Its chat is shown in the panel of the chat "Billing pages"/ })];
            case 19:
                _h.apply(void 0, [_u.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 20:
                _u.sent();
                return [4 /*yield*/, details.unmount()
                    // The other way round: this chat's own work asks, and an answer another chat left for it arrives
                ];
            case 21:
                _u.sent();
                // The other way round: this chat's own work asks, and an answer another chat left for it arrives
                return [4 /*yield*/, $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })];
            case 22:
                // The other way round: this chat's own work asks, and an answer another chat left for it arrives
                _u.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))
                    // The clock has moved on 10 s in this test
                ];
            case 23:
                _u.sent();
                t0 = NOW + 10000;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })
                    // One pressed for an earlier ask in the same words is dropped, as is one that waited too long; one for the ask that stands is acted on, once
                ];
            case 24:
                _u.sent();
                // One pressed for an earlier ask in the same words is dropped, as is one that waited too long; one for the ask that stands is acted on, once
                files.set("".concat(MEMORY, "/live/answers/engine-id/0-z.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I delete the old repo?', askAt: NOW, at: NOW - 11 * 60000 }));
                files.set("".concat(MEMORY, "/live/answers/engine-id/1-a.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0 - 1000, at: NOW }));
                files.set("".concat(MEMORY, "/live/answers/engine-id/2-b.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I delete the old repo?', askAt: t0, at: NOW }));
                return [4 /*yield*/, clock.advance(5000)];
            case 25:
                _u.sent();
                told = appended.filter(function (line) { return line.startsWith('a1: ') && line.includes('"Approve"'); });
                expect(told).toHaveLength(1);
                expect(told[0]).toContain('May I delete the old repo?');
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.includes('/live/answers/engine-id/'); })).toEqual([]);
                // The answer clears the ask here too, and this chat's file says so to the other chats at its next write
                return [4 /*yield*/, clock.advance(1000)];
            case 26:
                // The answer clears the ask here too, and this chat's file says so to the other chats at its next write
                _u.sent();
                _j = expect;
                return [4 /*yield*/, read$todos(files)];
            case 27:
                _j.apply(void 0, [(_u.sent()).ask]).toBeUndefined();
                // A reply in words another chat left for a new ask clears it the same way and reaches the work
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which repo?' })];
            case 28:
                // A reply in words another chat left for a new ask clears it the same way and reaches the work
                _u.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 29:
                _u.sent();
                _k = expect;
                return [4 /*yield*/, read$todos(files)];
            case 30:
                _k.apply(void 0, [(_t = (_u.sent()).ask) === null || _t === void 0 ? void 0 : _t.text]).toBe('Which repo?');
                files.set("".concat(MEMORY, "/live/answers/engine-id/3-c.json"), JSON.stringify({ card: 'a1', choice: 'the old one', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 7000 }));
                return [4 /*yield*/, clock.advance(6000)];
            case 31:
                _u.sent();
                expect(appended.find(function (line) { return line.startsWith('a1: ') && line.includes('the old one'); })).toContain('Which repo?');
                _l = expect;
                return [4 /*yield*/, read$todos(files)];
            case 32:
                _l.apply(void 0, [(_u.sent()).ask]).toBeUndefined();
                // A second reply in words left right after, with the ask already answered, still reaches the work
                files.set("".concat(MEMORY, "/live/answers/engine-id/4-d.json"), JSON.stringify({ card: 'a1', choice: 'the one from 2024', isReply: true, ask: 'Which repo?', askAt: t0 + 6000, at: t0 + 13000 }));
                return [4 /*yield*/, clock.advance(5000)];
            case 33:
                _u.sent();
                expect(appended.find(function (line) { return line.startsWith('a1: ') && line.includes('the one from 2024'); })).toContain('Which repo?');
                return [2 /*return*/];
        }
    });
}); });
test("with another Mac named in config.json, its chats' work shows here under its chat and Mac, an answer goes there over ssh, and a Mac that stops answering shows none", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, sshed, behind, list, _b, _c, _d, send, sent, _e;
    var _this = this;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local', '-oProxyCommand=bad'] }));
                behind = NOW - 3600000;
                files.set('ssh:fetch', "Welcome to the M4\n".concat(behind / 1000, "\n---claudopus-live---\n").concat(otherChat(behind, 'chat-m4', 'Robot arm'), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, clock.advance(10000)
                    // Only a Mac that ssh takes as a name is reached
                ];
            case 2:
                _h.sent();
                // Only a Mac that ssh takes as a name is reached
                expect(sshed.every(function (_a) {
                    var command = _a[0];
                    return (command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'L=")) || (command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'echo $HOME;")) || (command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/")) || (command === null || command === void 0 ? void 0 : command.startsWith('d='));
                })).toBe(true);
                expect(sshed.length).toBeGreaterThan(0);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _h.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Robot arm' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'billing · on m4' })];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBeDefined();
                // Its running time is told on this Mac's clock: a minute and some, not an hour
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Opus 5\.5 · (\d+ of \d+ done · )?1m \d\ds$/ })];
            case 6:
                // Its running time is told on this Mac's clock: a minute and some, not an hour
                _d.apply(void 0, [_h.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 7:
                send = (_h.sent()).find(function (b) { return b.props.label === 'Send'; });
                return [4 /*yield*/, list.press({ key: (_f = send === null || send === void 0 ? void 0 : send.key) !== null && _f !== void 0 ? _f : '' })];
            case 8:
                _h.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.find(function (_a) {
                                var command = _a[0];
                                return command === null || command === void 0 ? void 0 : command.startsWith('d=');
                            })];
                    }); }); })];
            case 9:
                sent = _h.sent();
                expect(sent === null || sent === void 0 ? void 0 : sent[0]).toContain('d=~/.claude/claudopus/live/answers/chat-m4 && mkdir -p $d && cat > $d/');
                expect(JSON.parse((_g = sent === null || sent === void 0 ? void 0 : sent[1]) !== null && _g !== void 0 ? _g : '{}')).toMatchObject({ card: 'b1', choice: 'Send' });
                // The M4 goes to sleep: what was fetched from it goes stale, and its work leaves the panel
                files.delete('ssh:fetch');
                return [4 /*yield*/, clock.advance(100000)];
            case 10:
                _h.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Robot arm' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_h.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 12:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
test("the header says in one line what every chat's cards say, and the octopus beside it agrees", function () {
    var head = function (here, there, chats, asks, isDone) {
        if (asks === void 0) { asks = 0; }
        if (isDone === void 0) { isDone = false; }
        var one = { here: here, there: there, chats: chats, asks: asks, isDone: isDone };
        return [headLine(one), headMood(one)];
    };
    expect(head(0, 0, 0)).toEqual(['Nothing is running', 'mark']);
    expect(head(1, 0, 0)).toEqual(['Working on 1 thing', 'working']);
    expect(head(2, 0, 0)).toEqual(['Working on 2 things', 'working']);
    expect(head(0, 1, 1)).toEqual(['Working on 1 thing in another chat', 'working']);
    expect(head(0, 3, 2)).toEqual(['Working on 3 things in 2 other chats', 'working']);
    expect(head(1, 1, 1)).toEqual(['Working on 2 things here and in 1 other chat', 'working']);
    expect(head(2, 3, 2)).toEqual(['Working on 5 things here and in 2 other chats', 'working']);
    expect(head(0, 0, 0, 1)).toEqual(['1 thing needs you', 'asking']);
    expect(head(1, 2, 1, 2)).toEqual(['2 things need you, 3 running', 'asking']);
    // A finish shows on the octopus for its moment whatever else goes on, the line still saying what needs the person or runs
    expect(head(0, 0, 0, 1, true)).toEqual(['1 thing needs you', 'happy']);
    expect(head(0, 1, 1, 0, true)).toEqual(['Working on 1 thing in another chat', 'happy']);
    expect(head(0, 0, 0, 0, true)).toEqual(['Just finished', 'happy']);
});
test("with work only in another chat the header and octopus are at work, amber while it asks, happy as it finishes, then at rest", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, drawn, file, list, _b, _c, _d, asks, _e, _f, _g, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on, { art: true }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                file = JSON.parse(otherChat(NOW));
                // Only its running card, no ask
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, file), { cards: file.cards.slice(1) })));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _k.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Working on 1 thing in another chat' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, drawn(list)];
            case 5:
                _c.apply(void 0, [_k.sent()]).toEqual(['working']);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Nothing/ })];
            case 6:
                _d.apply(void 0, [_k.sent()]).toBeUndefined();
                // It asks: the line turns amber and says so, and the octopus waves amber
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, file), { at: NOW + 5000 })));
                return [4 /*yield*/, clock.advance(5000)];
            case 7:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '1 thing needs you, 1 running' })];
                    }); }); })];
            case 8:
                asks = _k.sent();
                expect(asks === null || asks === void 0 ? void 0 : asks.props.color).toBe('#E5A50A');
                _e = expect;
                return [4 /*yield*/, drawn(list)];
            case 9:
                _e.apply(void 0, [_k.sent()]).toEqual(['wave']);
                // Both finish: happy, "Just finished", for the pause; then at rest, "Nothing is running"
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, file), { at: NOW + 11000, cards: file.cards.map(function (card) { return (__assign(__assign({}, card), { status: 'done', endedAt: NOW + 10500, ask: undefined })); }) })));
                return [4 /*yield*/, clock.advance(5000)];
            case 10:
                _k.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Just finished' })];
                    }); }); })];
            case 11:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, drawn(list)];
            case 12:
                _g.apply(void 0, [_k.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(3000)];
            case 13:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Nothing is running' })];
                    }); }); })];
            case 14:
                _h.apply(void 0, [_k.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, drawn(list)];
            case 15:
                _j.apply(void 0, [_k.sent()]).toEqual(['mark']);
                return [4 /*yield*/, list.unmount()];
            case 16:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test("open chats with nothing going on are listed nowhere, on any Mac and however many, and a chat with work is listed by its name and Mac until that Mac stops answering", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, idle, n, list, _b, _c, _d, texts, _e, _f, _g, _h, _j, _k;
    var _this = this;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                idle = function (at, chat, title) { return JSON.stringify({ chat: chat, title: title, folder: '/Users/sam/GitHub', host: '', at: at, cards: [] }); };
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(idle(NOW, 'chat-rc', 'M4 idle'), "\n---claudopus-live---\n").concat(otherChat(NOW, 'chat-m4', 'Robot arm'), "\n"));
                // A hundred chats of this Mac open with nothing going on
                for (n = 0; n < 100; n += 1)
                    files.set("".concat(MEMORY, "/live/chat-q").concat(n, ".json"), idle(NOW, "chat-q".concat(n), "Quiet ".concat(n)));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Robot arm' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'billing · on m4' })];
            case 5:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '1 thing needs you, 1 running' })];
            case 6:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                texts = (_l.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(texts.filter(function (one) { return /^Quiet \d+$|^M4 idle$|^[▸▾]? ?\d+ other chats?$/.test(one); })).toEqual([]);
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                _e.apply(void 0, [(_l.sent()).filter(function (one) { var _a; return /other chats?$/.test(String((_a = one.props.label) !== null && _a !== void 0 ? _a : '')); })]).toEqual([]);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^This chat$/ })];
            case 9:
                _f.apply(void 0, [_l.sent()]).toBeUndefined();
                // No hover anywhere in the panel
                _g = expect;
                _j = (_h = JSON).stringify;
                return [4 /*yield*/, list.drawn()];
            case 10:
                // No hover anywhere in the panel
                _g.apply(void 0, [_j.apply(_h, [_l.sent()])]).not.toContain('"hover":{"display"');
                // Nothing about a fold is kept
                expect(files.has("".concat(MEMORY, "/folds.json"))).toBe(false);
                // That Mac stops answering: its chat with work leaves too
                files.delete('ssh:fetch');
                return [4 /*yield*/, clock.advance(100000)];
            case 11:
                _l.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Robot arm' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 12:
                _k.apply(void 0, [_l.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 13:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test("work that ends in another chat turns happy in this panel for its pause, then folds into Finished, which then holds every chat's", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, list, _b, file, ended, _c, _d, _e, _f, _g, _h, _j, _k;
    var _this = this;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Billing page' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                file = JSON.parse(otherChat(NOW));
                ended = __assign(__assign({}, file), { at: NOW + 6000, cards: file.cards.map(function (card) { return (__assign(__assign({}, card), { status: 'done', endedAt: NOW + 5500, ask: undefined })); }) });
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(ended));
                return [4 /*yield*/, clock.advance(5000)];
            case 5:
                _l.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ Finished' })];
                    }); }); })];
            case 6:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Claudopus' })];
            case 7:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                // After its pause it is in the Finished row, named as every chat's, and no longer under its chat
                return [4 /*yield*/, clock.advance(3000)];
            case 8:
                // After its pause it is in the Finished row, named as every chat's, and no longer under its chat
                _l.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Finished' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 9:
                _e.apply(void 0, [_l.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'all chats' })];
            case 10:
                _f.apply(void 0, [_l.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 11:
                _g.apply(void 0, [(_l.sent()).some(function (b) { return /Finished 2/.test(String(b.props.label)); })]).toBe(true);
                // On one Mac a chat with only ended work is not listed by name, and this chat's work gets no heading of its own for it
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Billing page' })];
            case 12:
                // On one Mac a chat with only ended work is not listed by name, and this chat's work gets no heading of its own for it
                _h.apply(void 0, [_l.sent()]).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 13:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 14:
                _l.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                _l.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Fix the nose' })];
                    }); }); })];
            case 16:
                _j.apply(void 0, [_l.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^This chat$/ })];
            case 17:
                _k.apply(void 0, [_l.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 18:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test("while the person types a reply into an ask, work finishing here and in another chat still turns green and happy for its pause, then leaves", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, drawn, list, _b, box, _c, _d, _e, file, n, _f, _g, _h, _j, _k;
    var _this = this;
    var _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _a = world(on, { art: true }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Submit the mod', prompt: 'submit the mod' }))];
            case 2:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 3:
                _r.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 4:
                _r.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _r.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Billing page' })];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Submit it to the plugin directory.' })];
            case 7:
                _r.sent();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 8:
                box = (_r.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_l = box === null || box === void 0 ? void 0 : box.key) !== null && _l !== void 0 ? _l : '', text: 'Not y', kind: 'change' })
                    // This chat's work finishes mid-typing: green and happy at once, then gone after its pause, the times still held
                ];
            case 9:
                _r.sent();
                // This chat's work finishes mid-typing: green and happy at once, then gone after its pause, the times still held
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })];
            case 10:
                // This chat's work finishes mid-typing: green and happy at once, then gone after its pause, the times still held
                _r.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ Finished' })];
                    }); }); })];
            case 11:
                _c.apply(void 0, [(_m = (_r.sent())) === null || _m === void 0 ? void 0 : _m.props.color]).toBe('success');
                _d = expect;
                return [4 /*yield*/, drawn(list)];
            case 12:
                _d.apply(void 0, [_r.sent()]).toContain('happy');
                return [4 /*yield*/, clock.advance(2100)];
            case 13:
                _r.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /Draw the eyes/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 14:
                _e.apply(void 0, [_r.sent()]).toBe(true);
                file = JSON.parse(otherChat(NOW));
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, file), { at: NOW + 8000, cards: file.cards.map(function (card) { return (__assign(__assign({}, card), { status: 'done', endedAt: NOW + 7500, ask: undefined })); }) })));
                return [4 /*yield*/, list.input({ key: (_o = box === null || box === void 0 ? void 0 : box.key) !== null && _o !== void 0 ? _o : '', text: 'Not ye', kind: 'change' })
                    // This panel reads the other chats every few seconds: the pause runs from the look that saw the end
                ];
            case 15:
                _r.sent();
                n = 0;
                _r.label = 16;
            case 16:
                _f = n < 6;
                if (!_f) return [3 /*break*/, 18];
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Finished' })];
            case 17:
                _f = !(_r.sent());
                _r.label = 18;
            case 18:
                if (!_f) return [3 /*break*/, 21];
                return [4 /*yield*/, clock.advance(1000)];
            case 19:
                _r.sent();
                _r.label = 20;
            case 20:
                n += 1;
                return [3 /*break*/, 16];
            case 21:
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ Finished' })];
                    }); }); })];
            case 22:
                _g.apply(void 0, [(_p = (_r.sent())) === null || _p === void 0 ? void 0 : _p.props.color]).toBe('success');
                _h = expect;
                return [4 /*yield*/, drawn(list)];
            case 23:
                _h.apply(void 0, [_r.sent()]).toContain('happy');
                return [4 /*yield*/, clock.advance(3000)];
            case 24:
                _r.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Finished' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 25:
                _j.apply(void 0, [_r.sent()]).toBe(true);
                // The half reply is still in its box
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 26:
                // The half reply is still in its box
                _k.apply(void 0, [(_q = (_r.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _q === void 0 ? void 0 : _q.props.value]).toBe('Not ye');
                return [4 /*yield*/, list.unmount()];
            case 27:
                _r.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a chat shares the work that ended lately, the newest few, and not work that ended long ago', function () { return __awaiter(_this, void 0, void 0, function () {
    var card, list, shared;
    return __generator(this, function (_a) {
        card = function (id, endedAt) { return ({ id: id, parentId: '', isFork: false, tokens: 0, title: id, words: '', items: [], entries: [], answer: '', startedAt: endedAt - 10, endedAt: endedAt, status: 'done' }); };
        list = __spreadArray([card('old', NOW - 13 * 3600000)], Array.from({ length: 12 }, function (_, i) { return card("n".concat(i), NOW - i * 1000); }), true);
        shared = shareable(list, NOW).map(function (one) { return one.id; });
        expect(shared).toHaveLength(10);
        expect(shared).not.toContain('old');
        expect(shared).not.toContain('n11');
        return [2 /*return*/];
    });
}); });
test("a chat shares what opens it, and nothing of what was said in it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shared;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } }), files = _a.files, clock = _a.clock;
                files.set("".concat(HOME, "/.claude/sessions/41.json"), JSON.stringify({ sessionId: 'someone-else', bridgeSessionId: 'session_01Other' }));
                files.set("".concat(HOME, "/.claude/sessions/42.json"), JSON.stringify({ sessionId: 'engine-id', hostSessionId: 'local_ab12-cd34', bridgeSessionId: 'session_01Mine', updatedAt: 5 }));
                files.set("".concat(MEMORY, "/words/engine-id.md"), '## 2026-11-12T07:00:00.000Z\nSum up last month\n\n### Claude 2026-11-12T07:01:00.000Z\nHere it is.\n\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                shared = function () { var _a; return JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}'); };
                expect(shared().link).toEqual({ bridge: 'session_01Mine', app: 'local_ab12-cd34' });
                return [4 /*yield*/, $.prompt.submit({ text: 'And this month?', origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Here it is again.', reason: 'end_turn' })];
            case 3:
                _c.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 4:
                _c.sent();
                expect(shared().said).toBeUndefined();
                expect((_b = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _b !== void 0 ? _b : '').not.toContain('this month');
                return [2 /*return*/];
        }
    });
}); });
test("another chat's name, shown while it has something going on, opens that chat in the app when pressed, and shows nothing more under it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, busy, withLink, noLink, viaSsh, old, list, _b, _c, _d, _e, _f, _g, _h, _j, buttons;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, shown = _a.shown;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                busy = function (chat, title, extra) { return JSON.stringify(__assign(__assign({}, JSON.parse(otherChat(NOW, chat, title))), extra)); };
                withLink = busy('chat-rc', "Last month's work summary", { said: { you: 'Sum up last month', youAt: NOW, reply: 'Here is the summary.', replyAt: NOW }, link: { bridge: 'session_01Summary', app: 'local_m4-only' } });
                noLink = busy('chat-t', 'Terminal chat', { link: { bridge: 'session_; rm -rf ~', app: 'local_m4-two' } });
                viaSsh = busy('chat-s', 'SSH chat', { link: { bridge: '', app: 'local_run-from-here' } });
                files.set("".concat(HOME, "/Library/Application Support/Claude/claude-code-sessions/acct/org/local_run-from-here.json"), '{}');
                old = busy('chat-old', 'Old version chat', {});
                files.set("".concat(HOME, "/Library/Application Support/Claude/claude-code-sessions/acct/org/local_old-one.json"), JSON.stringify({ sessionId: 'local_old-one', cliSessionId: 'chat-old' }));
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(withLink, "\n---claudopus-live---\n").concat(noLink, "\n---claudopus-live---\n").concat(viaSsh, "\n---claudopus-live---\n").concat(old, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _k.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "Last month's work summary" })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Terminal chat' })];
            case 5:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Here is the summary.' })];
            case 6:
                _d.apply(void 0, [_k.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Sum up last month' })];
            case 7:
                _e.apply(void 0, [_k.sent()]).toBeUndefined();
                _f = expect;
                _h = (_g = JSON).stringify;
                return [4 /*yield*/, list.drawn()];
            case 8:
                _f.apply(void 0, [_h.apply(_g, [_k.sent()])]).not.toContain('"hover":{"display"');
                // The chat with Remote Control opens by its Remote Control id, the one this Mac's app runs by the app's own id; the one of the
                // other Mac's own app without Remote Control has no press at all
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ key: 'chat-open-sam@m4.local-chat-s' })];
                    }); }); })];
            case 9:
                // The chat with Remote Control opens by its Remote Control id, the one this Mac's app runs by the app's own id; the one of the
                // other Mac's own app without Remote Control has no press at all
                _j.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 10:
                buttons = (_k.sent()).map(function (one) { return String(one.key); });
                expect(buttons.filter(function (key) { return key.startsWith('chat-open-'); }).sort()).toEqual(['chat-open-sam@m4.local-chat-old', 'chat-open-sam@m4.local-chat-rc', 'chat-open-sam@m4.local-chat-s']);
                return [4 /*yield*/, list.press({ key: 'chat-open-sam@m4.local-chat-old' })];
            case 11:
                _k.sent();
                expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_old-one']);
                return [4 /*yield*/, list.press({ key: 'chat-open-sam@m4.local-chat-rc' })];
            case 12:
                _k.sent();
                expect(shown.at(-1)).toEqual(['open', 'claude://code/session_01Summary']);
                return [4 /*yield*/, list.press({ key: 'chat-open-sam@m4.local-chat-s' })];
            case 13:
                _k.sent();
                expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_run-from-here']);
                return [4 /*yield*/, list.unmount()];
            case 14:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a chat of this Mac with work opens by the app's own id when it has no Remote Control", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, mine, list, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, shown = _a.shown;
                mine = JSON.parse(otherChat(NOW));
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, mine), { link: { bridge: '', app: 'local_here-1' } })));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ key: 'chat-open--chat-b' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: 'chat-open--chat-b' })];
            case 5:
                _c.sent();
                expect(shown.at(-1)).toEqual(['open', 'claude://code/continue?session=local_here-1']);
                return [4 /*yield*/, list.unmount()];
            case 6:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
