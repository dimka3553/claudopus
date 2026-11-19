// Finished work: the happy green octopus and its pause
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, end, drawn, moment, outlined, pane, band, _a, _b, _c, _d, first, firstBand, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, again, _z, _0, _1, _2, _3, _4, _5, _6, after, _7, _8, _9, _10, _11, _12;
    var _this = this;
    var _13, _14;
    return __generator(this, function (_15) {
        switch (_15.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { art: true, agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _15.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _15.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))
                    // Its run over, as Claude Code lists it, and never pressed for a hand-back: its last words are its result, and it is done
                ];
            case 3:
                _15.sent();
                end = function (agentId, turnId) { return ((agents[agentId] = 'completed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: agentId })); };
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)
                            // The moment each octopus drawing is marked with: the app keeps a picture it drew before, so a happy moment drawn the same as
                            // the last would start at its end, arms down; each turn to a drawing is marked anew, and keeps its mark while it stays
                        ];
                    }
                }); }); };
                moment = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)[0]
                            // The cards in their finish moment: outlined green at the top
                        ];
                    }
                }); }); };
                outlined = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF'; }).length];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _15.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                band = _15.sent();
                _a = expect;
                return [4 /*yield*/, drawn(pane)];
            case 6:
                _a.apply(void 0, [_15.sent()]).toEqual(['working']);
                _b = expect;
                return [4 /*yield*/, drawn(band)];
            case 7:
                _b.apply(void 0, [_15.sent()]).toEqual(['working-small']);
                // One finishes while another works: both octopuses are happy
                return [4 /*yield*/, clock.advance(400)];
            case 8:
                // One finishes while another works: both octopuses are happy
                _15.sent();
                return [4 /*yield*/, end('a1', 't1')];
            case 9:
                _15.sent();
                _c = expect;
                return [4 /*yield*/, drawn(pane)];
            case 10:
                _c.apply(void 0, [_15.sent()]).toEqual(['happy']);
                _d = expect;
                return [4 /*yield*/, drawn(band)];
            case 11:
                _d.apply(void 0, [_15.sent()]).toEqual(['happy-small']);
                return [4 /*yield*/, moment(pane)];
            case 12:
                first = _15.sent();
                return [4 /*yield*/, moment(band)];
            case 13:
                firstBand = _15.sent();
                expect(first).toBeDefined();
                expect(firstBand).toBeDefined();
                _e = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /Check the ears/ })];
            case 14:
                _e.apply(void 0, [_15.sent()]).toBeUndefined();
                // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
                _15.sent();
                return [4 /*yield*/, end('a2', 't2')];
            case 16:
                _15.sent();
                _f = expect;
                return [4 /*yield*/, drawn(pane)];
            case 17:
                _f.apply(void 0, [_15.sent()]).toEqual(['happy']);
                _g = expect;
                return [4 /*yield*/, drawn(band)];
            case 18:
                _g.apply(void 0, [_15.sent()]).toEqual(['happy-small']);
                _h = expect;
                return [4 /*yield*/, moment(pane)];
            case 19:
                _h.apply(void 0, [_15.sent()]).toBe(first);
                _j = expect;
                return [4 /*yield*/, moment(band)];
            case 20:
                _j.apply(void 0, [_15.sent()]).toBe(firstBand);
                // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
                return [4 /*yield*/, clock.advance(1100)];
            case 21:
                // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
                _15.sent();
                _k = expect;
                return [4 /*yield*/, drawn(pane)];
            case 22:
                _k.apply(void 0, [_15.sent()]).toEqual(['happy']);
                _l = expect;
                return [4 /*yield*/, moment(pane)];
            case 23:
                _l.apply(void 0, [_15.sent()]).toBe(first);
                return [4 /*yield*/, clock.advance(1000)];
            case 24:
                _15.sent();
                _m = expect;
                return [4 /*yield*/, drawn(pane)];
            case 25:
                _m.apply(void 0, [_15.sent()]).toEqual(['mark']);
                _o = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: "the engine's own" })];
            case 26:
                _o.apply(void 0, [_15.sent()]).toBeDefined();
                // Work finishing while another still runs goes back to work after its pause
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 27:
                // Work finishing while another still runs goes back to work after its pause
                _15.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 28:
                _15.sent();
                _p = expect;
                return [4 /*yield*/, drawn(band)];
            case 29:
                _p.apply(void 0, [_15.sent()]).toEqual(['working-small']);
                return [4 /*yield*/, end('a3', 't3')];
            case 30:
                _15.sent();
                _q = expect;
                return [4 /*yield*/, drawn(pane)];
            case 31:
                _q.apply(void 0, [_15.sent()]).toEqual(['happy']);
                // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
                _r = expect;
                return [4 /*yield*/, moment(pane)];
            case 32:
                // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
                _r.apply(void 0, [_15.sent()]).not.toBe(first);
                _s = expect;
                return [4 /*yield*/, drawn(band)];
            case 33:
                _s.apply(void 0, [_15.sent()]).toEqual(['happy-small']);
                _t = expect;
                return [4 /*yield*/, moment(band)];
            case 34:
                _t.apply(void 0, [_15.sent()]).not.toBe(firstBand);
                return [4 /*yield*/, clock.advance(2100)];
            case 35:
                _15.sent();
                _u = expect;
                return [4 /*yield*/, drawn(pane)];
            case 36:
                _u.apply(void 0, [_15.sent()]).toEqual(['working']);
                _v = expect;
                return [4 /*yield*/, drawn(band)];
            case 37:
                _v.apply(void 0, [_15.sent()]).toEqual(['working-small']);
                // Stopped work makes no one happy
                return [4 /*yield*/, pane.press({ key: 'stop-a4' })];
            case 38:
                // Stopped work makes no one happy
                _15.sent();
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 39:
                _w.apply(void 0, [_15.sent()]).toBeDefined();
                _x = expect;
                return [4 /*yield*/, drawn(pane)];
            case 40:
                _x.apply(void 0, [_15.sent()]).toEqual(['mark']);
                _y = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: "the engine's own" })];
            case 41:
                _y.apply(void 0, [_15.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(2100)
                    // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                ];
            case 42:
                _15.sent();
                // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                return [4 /*yield*/, pane.unmount()];
            case 43:
                // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                _15.sent();
                return [4 /*yield*/, band.unmount()];
            case 44:
                _15.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 45:
                _15.sent();
                return [4 /*yield*/, end('a5', 't5')];
            case 46:
                _15.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 47:
                _15.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 48:
                again = _15.sent();
                _z = expect;
                return [4 /*yield*/, drawn(again)];
            case 49:
                _z.apply(void 0, [_15.sent()]).toEqual(['mark']);
                // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw the nose' }))];
            case 50:
                // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
                _15.sent();
                return [4 /*yield*/, end('a6', 't6')];
            case 51:
                _15.sent();
                _0 = expect;
                return [4 /*yield*/, drawn(again)];
            case 52:
                _0.apply(void 0, [_15.sent()]).toEqual(['happy']);
                return [4 /*yield*/, $.session.start(start)];
            case 53:
                _15.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 54:
                _15.sent();
                _1 = expect;
                return [4 /*yield*/, drawn(again)];
            case 55:
                _1.apply(void 0, [_15.sent()]).toEqual(['mark']);
                // Seen ended before the reload, it is not shown ended again after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the brows', prompt: 'draw the brows' }))];
            case 56:
                // Seen ended before the reload, it is not shown ended again after it
                _15.sent();
                return [4 /*yield*/, end('a7', 't7')];
            case 57:
                _15.sent();
                _2 = expect;
                return [4 /*yield*/, drawn(again)];
            case 58:
                _2.apply(void 0, [_15.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(2100)];
            case 59:
                _15.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 60:
                _15.sent();
                _3 = expect;
                return [4 /*yield*/, drawn(again)];
            case 61:
                _3.apply(void 0, [_15.sent()]).toEqual(['mark']);
                // (its card is still among the cards, done and green, with no second moment at the top)
                _4 = expect;
                return [4 /*yield*/, outlined(again)];
            case 62:
                // (its card is still among the cards, done and green, with no second moment at the top)
                _4.apply(void 0, [_15.sent()]).toBe(0);
                _5 = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: '◐ Delivered' })];
            case 63:
                _5.apply(void 0, [(_13 = (_15.sent())) === null || _13 === void 0 ? void 0 : _13.props.color]).toBe('#4C9AFF');
                // Work that ended long before a load is not
                return [4 /*yield*/, clock.advance(30000)];
            case 64:
                // Work that ended long before a load is not
                _15.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 65:
                _15.sent();
                _6 = expect;
                return [4 /*yield*/, drawn(again)];
            case 66:
                _6.apply(void 0, [_15.sent()]).toEqual(['mark']);
                // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
                return [4 /*yield*/, again.unmount()];
            case 67:
                // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
                _15.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 68:
                _15.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lips', prompt: 'draw the lips' }))];
            case 69:
                _15.sent();
                return [4 /*yield*/, end('a8', 't8')];
            case 70:
                _15.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 71:
                _15.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 72:
                _15.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 73:
                _15.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 74:
                after = _15.sent();
                _7 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: '◐ Delivered' })];
            case 75:
                _7.apply(void 0, [(_14 = (_15.sent())) === null || _14 === void 0 ? void 0 : _14.props.color]).toBe('#4C9AFF');
                _8 = expect;
                return [4 /*yield*/, outlined(after)];
            case 76:
                _8.apply(void 0, [_15.sent()]).toBe(1);
                return [4 /*yield*/, clock.advance(2100)];
            case 77:
                _15.sent();
                _9 = expect;
                return [4 /*yield*/, outlined(after)];
            case 78:
                _9.apply(void 0, [_15.sent()]).toBe(0);
                // Work stopped in the seconds of a load is not green after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 79:
                // Work stopped in the seconds of a load is not green after it
                _15.sent();
                return [4 /*yield*/, after.press({ key: 'stop-a9' })];
            case 80:
                _15.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 81:
                _15.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 82:
                _15.sent();
                _10 = expect;
                return [4 /*yield*/, outlined(after)];
            case 83:
                _10.apply(void 0, [_15.sent()]).toBe(0);
                _11 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: 'Stopped' })];
            case 84:
                _11.apply(void 0, [_15.sent()]).toBeDefined();
                _12 = expect;
                return [4 /*yield*/, drawn(after)];
            case 85:
                _12.apply(void 0, [_15.sent()]).toEqual(['mark']);
                return [4 /*yield*/, after.unmount()];
            case 86:
                _15.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that ended its step in words while a watch of its own runs has not finished: stopped by the chat or the engine, it is stopped, not done; a hand-back ends it done at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, talk, _a, clock, files, stepped, drawn, pane, stoppedCards, report, answer, _b, kept, _c, _d, _e, second, _f, _g, _h, _j, _k, handed, _l, _m, HANDED, PRESS, _i, _o, last, before, texts, _p, _q, _r, chunk, e_1_1, _s, _t, ENDED_A4, endNotice, given, _u, _v, _w, _x, _y, _z, otto, reportsBefore, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    var _this = this;
    var _20, e_1, _21, _22;
    var _23, _24, _25, _26, _27, _28;
    return __generator(this, function (_29) {
        switch (_29.label) {
            case 0:
                agents = {};
                kinds = {};
                talk = [];
                _a = world(on, { art: true, agents: agents, kinds: kinds, talk: talk }), clock = _a.clock, files = _a.files, stepped = _a.stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _29.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // The cards that say Stopped: each stays up until dismissed, so one more stopped is one more of them
                ];
            case 2:
                pane = _29.sent();
                stoppedCards = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.text === 'Stopped'; }).length];
                    }
                }); }); };
                report = "The hover is gone and idle chats are no longer listed. ".concat('All tests pass and the version is pushed to main, installed on both Macs. '.repeat(8));
                answer = function (id, turnId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: "w-".concat(turnId), agentId: id, command: 'tail -f build.log', description: 'watch the build', timeout_ms: 0 })];
                            case 1:
                                _a.sent();
                                agents[id] = 'waiting';
                                kinds[id] = 'general-purpose';
                                return [4 /*yield*/, $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: id })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                // The chat stops it with TaskStop after a report in words, given while a watcher it started still runs: words are no result, as
                // only a hand-back is, so it ends stopped, not done, and nothing is kept as its result
                return [4 /*yield*/, $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })];
            case 3:
                // The chat stops it with TaskStop after a report in words, given while a watcher it started still runs: words are no result, as
                // only a hand-back is, so it ends stopped, not done, and nothing is kept as its result
                _29.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Remove the hover', prompt: 'remove the hover' }))];
            case 4:
                _29.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 5:
                _29.sent();
                return [4 /*yield*/, answer('a1', 't1')];
            case 6:
                _29.sent();
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 7:
                _b.apply(void 0, [_29.sent()]).toEqual(['working']);
                kept = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key); }); };
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 8:
                _29.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 9:
                _c.apply(void 0, [_29.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, stoppedCards()];
            case 10:
                _d.apply(void 0, [_29.sent()]).toBe(1);
                _e = expect;
                return [4 /*yield*/, drawn(pane)];
            case 11:
                _e.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(20)];
            case 12:
                _29.sent();
                expect(kept()).toHaveLength(0);
                agents.a1 = 'killed';
                return [4 /*yield*/, clock.advance(2100)
                    // Stopped some other way, the engine lists it killed at its next look: stopped as well
                ];
            case 13:
                _29.sent();
                // Stopped some other way, the engine lists it killed at its next look: stopped as well
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the idle chats', prompt: 'fold them' }))];
            case 14:
                // Stopped some other way, the engine lists it killed at its next look: stopped as well
                _29.sent();
                return [4 /*yield*/, answer('a2', 't1b')];
            case 15:
                _29.sent();
                agents.a2 = 'killed';
                second = 0;
                _29.label = 16;
            case 16:
                _f = second < 20;
                if (!_f) return [3 /*break*/, 18];
                return [4 /*yield*/, stoppedCards()];
            case 17:
                _f = (_29.sent()) < 2;
                _29.label = 18;
            case 18:
                if (!_f) return [3 /*break*/, 21];
                return [4 /*yield*/, clock.advance(1000)];
            case 19:
                _29.sent();
                _29.label = 20;
            case 20:
                second += 1;
                return [3 /*break*/, 16];
            case 21:
                _g = expect;
                return [4 /*yield*/, stoppedCards()];
            case 22:
                _g.apply(void 0, [_29.sent()]).toBe(2);
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 23:
                _h.apply(void 0, [_29.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)
                    // Its step ended after only a short line ("started it in the background") while Claude Code lists its run as going on, it has
                    // not finished: stopped, it is stopped
                ];
            case 24:
                _29.sent();
                // Its step ended after only a short line ("started it in the background") while Claude Code lists its run as going on, it has
                // not finished: stopped, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Build the app', prompt: 'build it' }))];
            case 25:
                // Its step ended after only a short line ("started it in the background") while Claude Code lists its run as going on, it has
                // not finished: stopped, it is stopped
                _29.sent();
                agents.a3 = 'waiting';
                kinds.a3 = 'general-purpose';
                return [4 /*yield*/, $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' })];
            case 26:
                _29.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' })];
            case 27:
                _29.sent();
                _j = expect;
                return [4 /*yield*/, stoppedCards()];
            case 28:
                _j.apply(void 0, [_29.sent()]).toBe(3);
                _k = expect;
                return [4 /*yield*/, drawn(pane)];
            case 29:
                _k.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // A result handed in with SubagentHandback ends it: its card is done at once, green, with that result, though Claude Code
                    // still lists its run, and the chat need not stop it
                ];
            case 30:
                _29.sent();
                // A result handed in with SubagentHandback ends it: its card is done at once, green, with that result, though Claude Code
                // still lists its run, and the chat need not stop it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the octopus', prompt: 'name it' }))];
            case 31:
                // A result handed in with SubagentHandback ends it: its card is done at once, green, with that result, though Claude Code
                // still lists its run, and the chat need not stop it
                _29.sent();
                agents.a4 = 'waiting';
                kinds.a4 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' })];
            case 32:
                handed = (_29.sent());
                expect([handed.deny, (_23 = handed.result) === null || _23 === void 0 ? void 0 : _23.success, (_25 = (_24 = handed.result) === null || _24 === void 0 ? void 0 : _24.message) === null || _25 === void 0 ? void 0 : _25.includes('Claudopus gives it to the chat')]).toEqual([undefined, true, true]);
                _l = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 33:
                _l.apply(void 0, [(_26 = (_29.sent())) === null || _26 === void 0 ? void 0 : _26.props.color]).toBe('#4C9AFF');
                _m = expect;
                return [4 /*yield*/, drawn(pane)];
            case 34:
                _m.apply(void 0, [_29.sent()]).toEqual(['happy']);
                HANDED = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb', name: 'SubagentHandback', input: { message: 'Named it Otto.' } }] };
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                _i = 0, _o = [{ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb', content: 'Report delivered to your caller.' }] }, PRESS];
                _29.label = 35;
            case 35:
                if (!(_i < _o.length)) return [3 /*break*/, 49];
                last = _o[_i];
                talk.splice(0, talk.length, HANDED, last);
                before = stepped.length;
                texts = [];
                _29.label = 36;
            case 36:
                _29.trys.push([36, 41, 42, 47]);
                _p = true, _q = (e_1 = void 0, __asyncValues($.turn.step({ turnId: 't4s', index: 1, model: 'm', messageCount: 2, agentId: 'a4' })));
                _29.label = 37;
            case 37: return [4 /*yield*/, _q.next()];
            case 38:
                if (!(_r = _29.sent(), _20 = _r.done, !_20)) return [3 /*break*/, 40];
                _22 = _r.value;
                _p = false;
                chunk = _22;
                if (chunk.kind === 'text')
                    texts.push(chunk.text);
                _29.label = 39;
            case 39:
                _p = true;
                return [3 /*break*/, 37];
            case 40: return [3 /*break*/, 47];
            case 41:
                e_1_1 = _29.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 47];
            case 42:
                _29.trys.push([42, , 45, 46]);
                if (!(!_p && !_20 && (_21 = _q.return))) return [3 /*break*/, 44];
                return [4 /*yield*/, _21.call(_q)];
            case 43:
                _29.sent();
                _29.label = 44;
            case 44: return [3 /*break*/, 46];
            case 45:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 46: return [7 /*endfinally*/];
            case 47:
                expect([stepped.length - before, texts]).toEqual([0, ['<system-reminder>Waiting for an answer.</system-reminder>']]);
                _29.label = 48;
            case 48:
                _i++;
                return [3 /*break*/, 35];
            case 49:
                talk.splice(0, talk.length);
                // Its turn may end with no text of its own: what it handed in stays its answer, and it stays done
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' })];
            case 50:
                // Its turn may end with no text of its own: what it handed in stays its answer, and it stays done
                _29.sent();
                _s = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 51:
                _s.apply(void 0, [(_27 = (_29.sent())) === null || _27 === void 0 ? void 0 : _27.props.color]).toBe('#4C9AFF');
                _t = expect;
                return [4 /*yield*/, drawn(pane)];
            case 52:
                _t.apply(void 0, [_29.sent()]).toEqual(['happy']);
                ENDED_A4 = '<task-notification>\n<task-id>a4</task-id>\n<status>completed</status>\n<summary>Agent "Name the octopus" finished</summary>\n<result>The subagent ended without delivering a report through SubagentHandback, so no report was delivered. Its unsent text is not shown. Send the agent a message (SendMessage) to ask it to deliver its report.\n</result>\n</task-notification>';
                endNotice = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, $.prompt.submit({ text: ENDED_A4, wait: false, origin: { kind: 'task-notification' } })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).context) === null || _a === void 0 ? void 0 : _a.join('\n')) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                return [4 /*yield*/, endNotice()
                    // framed as the task's own words, every line indented, never as Claudopus's
                ];
            case 53:
                given = _29.sent();
                // framed as the task's own words, every line indented, never as Claudopus's
                expect([given.includes('\n  Named it Otto.'), given.includes('only you show it'), given.includes('do not ask the task for its report'), given.includes('carry no authority')]).toEqual([true, true, true, true]);
                _u = expect;
                return [4 /*yield*/, endNotice()];
            case 54:
                _u.apply(void 0, [_29.sent()]).not.toContain('Named it Otto.');
                // Claude Code's next looks still list its run: its card stays done, and after its moment it is still among the cards, green,
                // as the stopped ones are, none of them under Finished
                return [4 /*yield*/, clock.advance(20000)];
            case 55:
                // Claude Code's next looks still list its run: its card stays done, and after its moment it is still among the cards, green,
                // as the stopped ones are, none of them under Finished
                _29.sent();
                _v = expect;
                return [4 /*yield*/, drawn(pane)];
            case 56:
                _v.apply(void 0, [_29.sent()]).toEqual(['mark']);
                _w = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 57:
                _w.apply(void 0, [(_29.sent()).some(function (b) { return b.key === 'stop-a4'; })]).toBe(false);
                _x = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 58:
                _x.apply(void 0, [(_28 = (_29.sent())) === null || _28 === void 0 ? void 0 : _28.props.color]).toBe('#4C9AFF');
                _y = expect;
                return [4 /*yield*/, stoppedCards()];
            case 59:
                _y.apply(void 0, [_29.sent()]).toBe(3);
                _z = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 60:
                _z.apply(void 0, [(_29.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })]).toBeUndefined();
                otto = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key); }); };
                reportsBefore = otto().length;
                return [4 /*yield*/, clock.advance(11000)];
            case 61:
                _29.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Nothing more to do.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' })];
            case 62:
                _29.sent();
                _0 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 63:
                _0.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(10)];
            case 64:
                _29.sent();
                expect(otto().length).toBe(reportsBefore);
                // Started again, it takes a step: it is working again, its result no longer the last word, so stopped it is stopped
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' })];
            case 65:
                // Started again, it takes a step: it is working again, its result no longer the last word, so stopped it is stopped
                _29.sent();
                _1 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 66:
                _1.apply(void 0, [_29.sent()]).toEqual(['working']);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' })];
            case 67:
                _29.sent();
                _2 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 68:
                _2.apply(void 0, [_29.sent()]).toBe(4);
                _3 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 69:
                _3.apply(void 0, [_29.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)
                    // Sent a message after its words, it is still at work: stopped before it took a step, it is stopped
                ];
            case 70:
                _29.sent();
                // Sent a message after its words, it is still at work: stopped before it took a step, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 71:
                // Sent a message after its words, it is still at work: stopped before it took a step, it is stopped
                _29.sent();
                return [4 /*yield*/, answer('a5', 't5s')];
            case 72:
                _29.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' })];
            case 73:
                _29.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' })];
            case 74:
                _29.sent();
                _4 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 75:
                _4.apply(void 0, [_29.sent()]).toBe(5);
                _5 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 76:
                _5.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // After a report in words while its watch runs, the engine ends it as aborted: stopped too, as those words were no result
                ];
            case 77:
                _29.sent();
                // After a report in words while its watch runs, the engine ends it as aborted: stopped too, as those words were no result
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the list', prompt: 'fold the list' }))];
            case 78:
                // After a report in words while its watch runs, the engine ends it as aborted: stopped too, as those words were no result
                _29.sent();
                return [4 /*yield*/, answer('a6', 't2')];
            case 79:
                _29.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' })];
            case 80:
                _29.sent();
                _6 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 81:
                _6.apply(void 0, [_29.sent()]).toBe(6);
                _7 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 82:
                _7.apply(void 0, [_29.sent()]).toBeUndefined();
                _8 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 83:
                _8.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Stop pressed on its card in the panel: the same
                ];
            case 84:
                _29.sent();
                // Stop pressed on its card in the panel: the same
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 85:
                // Stop pressed on its card in the panel: the same
                _29.sent();
                return [4 /*yield*/, answer('a7', 't3')];
            case 86:
                _29.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a7' })];
            case 87:
                _29.sent();
                _9 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 88:
                _9.apply(void 0, [_29.sent()]).toBe(7);
                _10 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 89:
                _10.apply(void 0, [_29.sent()]).toBeUndefined();
                _11 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 90:
                _11.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Its watch starts its next step: at work as before, and stopped it is stopped
                ];
            case 91:
                _29.sent();
                // Its watch starts its next step: at work as before, and stopped it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the M4', prompt: 'watch the m4' }))];
            case 92:
                // Its watch starts its next step: at work as before, and stopped it is stopped
                _29.sent();
                return [4 /*yield*/, answer('a8', 't4')];
            case 93:
                _29.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' })];
            case 94:
                _29.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a8' })];
            case 95:
                _29.sent();
                _12 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 96:
                _12.apply(void 0, [_29.sent()]).toBe(8);
                _13 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 97:
                _13.apply(void 0, [_29.sent()]).toBeUndefined();
                _14 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 98:
                _14.apply(void 0, [_29.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                ];
            case 99:
                _29.sent();
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 100:
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                _29.sent();
                agents.a9 = 'killed';
                kinds.a9 = 'general-purpose';
                return [4 /*yield*/, clock.advance(20000)];
            case 101:
                _29.sent();
                _15 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 102:
                _15.apply(void 0, [_29.sent()]).toEqual(['mark']);
                _16 = expect;
                return [4 /*yield*/, stoppedCards()];
            case 103:
                _16.apply(void 0, [_29.sent()]).toBe(9);
                _17 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 104:
                _17.apply(void 0, [_29.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 105:
                _29.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 106:
                _29.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' })];
            case 107:
                _29.sent();
                _18 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 108:
                _18.apply(void 0, [_29.sent()]).toEqual(['mark']);
                _19 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 109:
                _19.apply(void 0, [_29.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 110:
                _29.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that hands in an answer while a copy of its own still runs, with that copy still its to-do, is refused and stays at work, its copy a row on its card; it finishes only when the copy is checked and it hands in its result', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, files, logged, drawn, pane, kept, call, todo, _b, _c, _d, job, _e, _f, _g, early, _h, _j, _k, _l, _m, _o, _p, report, _q, _r, _s;
    var _this = this;
    var _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, files = _a.files, logged = _a.logged;
                on('classic.SubagentStop', function () { return ({ value: {} }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _v.sent();
                kept = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-3d-work-ready-to-continue-on-m4\/report\.md$/.test(key); }); };
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                todo = function (item, state, id) { return call('mcp__claudopus__todo', id, { item: item, state: state }); };
                // As it ran on 13 Nov: told to send the big pieces, it marks that to-do, starts the copy in the background and a watch on it
                return [4 /*yield*/, $.prompt.submit({ text: 'Yes, send them', wait: false, origin: composer })];
            case 3:
                // As it ran on 13 Nov: told to send the big pieces, it marks that to-do, starts the copy in the background and a watch on it
                _v.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: '3D work ready to continue on M4', prompt: 'send them' }))];
            case 4:
                _v.sent();
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, todo('Report with the big pieces waiting on your yes', 'done', 't0')];
            case 5:
                _v.sent();
                return [4 /*yield*/, todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'doing', 't1')];
            case 6:
                _v.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'zsh sendbig.sh', description: 'Send the four big pieces to the M4, never overwriting', run_in_background: true })];
            case 7:
                _v.sent();
                return [4 /*yield*/, call('Monitor', 'm1', { command: 'tail -f bkdhmu6sf.output', description: 'big data copy to the M4: steps and failures', timeout_ms: 0 })
                    // Its turn ends with a line of words while the copy runs: a turn's end is only a pause, and it is at work
                ];
            case 8:
                _v.sent();
                // Its turn ends with a line of words while the copy runs: a turn's end is only a pause, and it is at work
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: 'Sending the 14.5 GB now; it takes about four hours.', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 9:
                _v.sent();
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 10:
                _b.apply(void 0, [_v.sent()]).toEqual(['working']);
                // Its stage is its colour: never a word in its top row (18 Nov, the person: "This top row should never say 'waiting for its
                // command'"), nor a line of its own under it (18 Nov "Waiting for a command to finish")
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Waiting for its/ })];
            case 11:
                // Its stage is its colour: never a word in its top row (18 Nov, the person: "This top row should never say 'waiting for its
                // command'"), nor a line of its own under it (18 Nov "Waiting for a command to finish")
                _c.apply(void 0, [_v.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Waiting for a command/ })];
            case 12:
                _d.apply(void 0, [_v.sent()]).toBeUndefined();
                job = function () { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /^Command · Send the\b/ })];
                        case 1:
                            if (!((_b = (_c.sent())) !== null && _b !== void 0)) return [3 /*break*/, 2];
                            _a = _b;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 3:
                            _a = (_c.sent()).find(function (b) { return /^Command · Send the\b/.test(String(b.props.label)); });
                            _c.label = 4;
                        case 4: return [2 /*return*/, _a];
                    }
                }); }); };
                _e = expect;
                return [4 /*yield*/, job()];
            case 13:
                _e.apply(void 0, [_v.sent()]).toBeDefined();
                // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
                // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 14:
                // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
                // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
                _v.sent();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })];
            case 15:
                _f.apply(void 0, [_v.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(0);
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '13m 00s' })];
            case 16:
                _g.apply(void 0, [_v.sent()]).toBeDefined();
                // The chat passes on "has everything already been copied?": its answer handed in with SubagentHandback while the copy still runs
                // and its to-do is open is refused, as a hand-back is its result
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' })];
            case 17:
                // The chat passes on "has everything already been copied?": its answer handed in with SubagentHandback while the copy still runs
                // and its to-do is open is refused, as a hand-back is its result
                _v.sent();
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })];
            case 18:
                _v.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })];
            case 19:
                early = (_v.sent());
                expect(early.deny).toMatch(/^Not handed in: a to-do is still open: "Send CT fits, CTs, iPhone scans and photogrammetry to the M4"\./);
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })
                    // Still at work: not green, not under Finished, and its answer is no result
                ];
            case 20:
                _v.sent();
                // Still at work: not green, not under Finished, and its answer is no result
                _h = expect;
                return [4 /*yield*/, drawn(pane)];
            case 21:
                // Still at work: not green, not under Finished, and its answer is no result
                _h.apply(void 0, [_v.sent()]).toEqual(['working']);
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 22:
                _j.apply(void 0, [_v.sent()]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, job()];
            case 23:
                _k.apply(void 0, [_v.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 24:
                _v.sent();
                _l = expect;
                return [4 /*yield*/, drawn(pane)];
            case 25:
                _l.apply(void 0, [_v.sent()]).toEqual(['working']);
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 26:
                _m.apply(void 0, [_v.sent()]).toBeDefined();
                expect(kept()).toHaveLength(0);
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                return [4 /*yield*/, $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] })
                    // The card lets go of the copy at once, before any step: its row goes
                ];
            case 27:
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                _v.sent();
                // The card lets go of the copy at once, before any step: its row goes
                _o = expect;
                return [4 /*yield*/, job()];
            case 28:
                // The card lets go of the copy at once, before any step: its row goes
                _o.apply(void 0, [_v.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, drawn(pane)];
            case 29:
                _p.apply(void 0, [_v.sent()]).toEqual(['working']);
                return [4 /*yield*/, call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
                    // It stops its watch, ticks the to-do and hands in its result: now it has finished, green, with its report kept
                ];
            case 30:
                _v.sent();
                // It stops its watch, ticks the to-do and hands in its result: now it has finished, green, with its report kept
                return [4 /*yield*/, call('TaskStop', 'k1', { task_id: 'mon-m1' })];
            case 31:
                // It stops its watch, ticks the to-do and hands in its result: now it has finished, green, with its report kept
                _v.sent();
                return [4 /*yield*/, todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')];
            case 32:
                _v.sent();
                report = "All four pieces are on the M4 and every file matches by hash. ".concat('The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)).trim();
                return [4 /*yield*/, call('SubagentHandback', 'h2', { message: report })];
            case 33:
                _v.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' })];
            case 34:
                _v.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 35:
                _q.apply(void 0, [(_t = (_v.sent())) === null || _t === void 0 ? void 0 : _t.props.color]).toBe('#4C9AFF');
                _r = expect;
                return [4 /*yield*/, drawn(pane)];
            case 36:
                _r.apply(void 0, [_v.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(10)];
            case 37:
                _v.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, kept()[0]];
                    }); }); })];
            case 38:
                _s.apply(void 0, [_v.sent()]).toBeDefined();
                expect(files.get((_u = kept()[0]) !== null && _u !== void 0 ? _u : '')).toBe("".concat(report, "\n"));
                return [4 /*yield*/, pane.unmount()];
            case 39:
                _v.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that hands in its result with everything it set out to do done, leaving a server of its own running, has finished: green, and the server stays a row under its done card, with its Stop, until it is stopped', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, stopped, appended, pane, call, rows, rowStop, fold, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, moods, _s, _t, _u, _v, _w, train, _x, _y, _z, _0, _1, _2;
    var _3;
    var _this = this;
    var _4, _5, _6, _7, _8, _9;
    return __generator(this, function (_10) {
        switch (_10.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, stopped = _a.stopped, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)
                    // (wide enough for a row's own Stop)
                ];
            case 1:
                _10.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'desktop' }))];
            case 2:
                pane = _10.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                rows = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1:
                            _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }), true]))];
                            return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (b) { var _a; return String((_a = b.props.label) !== null && _a !== void 0 ? _a : ''); }), true]))];
                    }
                }); }); };
                rowStop = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); })];
                    }
                }); }); };
                fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label];
                    }
                }); }); };
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })];
            case 3:
                _10.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Run the site', prompt: 'run it' }))];
            case 4:
                _10.sent();
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })];
            case 5:
                _10.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 6:
                _10.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })
                    // A server never ends by itself, so it alone may stay as the result is handed in: done at once, green on its line and its edge
                ];
            case 7:
                _10.sent();
                // A server never ends by itself, so it alone may stay as the result is handed in: done at once, green on its line and its edge
                _b = expect;
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })];
            case 8:
                // A server never ends by itself, so it alone may stay as the result is handed in: done at once, green on its line and its edge
                _b.apply(void 0, [(_10.sent()).deny]).toBeUndefined();
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 9:
                _10.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 10:
                _c.apply(void 0, [(_4 = (_10.sent())) === null || _4 === void 0 ? void 0 : _4.props.color]).toBe('#4C9AFF');
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 11:
                _d.apply(void 0, [(_10.sent()).filter(function (b) { var _a; return !((_a = b.key) === null || _a === void 0 ? void 0 : _a.startsWith('outline-')) && b.props.backgroundColor === '#4C9AFF'; })]).toHaveLength(1);
                // After its moment the card stays up, done, never under Finished: the server's row is under it with the row's own Stop, and the
                // task itself has none
                return [4 /*yield*/, clock.advance(20000)];
            case 12:
                // After its moment the card stays up, done, never under Finished: the server's row is under it with the row's own Stop, and the
                // task itself has none
                _10.sent();
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 13:
                _e.apply(void 0, [(_5 = (_10.sent())) === null || _5 === void 0 ? void 0 : _5.props.color]).toBe('#4C9AFF');
                _f = expect;
                return [4 /*yield*/, rows()];
            case 14:
                _f.apply(void 0, [(_10.sent()).filter(function (text) { return /Serve the site/.test(text); })]).toHaveLength(1);
                _g = expect;
                return [4 /*yield*/, rowStop()];
            case 15:
                _g.apply(void 0, [_10.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 16:
                _h.apply(void 0, [_10.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, fold()];
            case 17:
                _j.apply(void 0, [_10.sent()]).toBeUndefined();
                // and so it stays, however long, until the person stops the server: its row goes, the finished task is told nothing, and the
                // card is still up, done and green, never under Finished
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 18:
                // and so it stays, however long, until the person stops the server: its row goes, the finished task is told nothing, and the
                // card is still up, done and green, never under Finished
                _10.sent();
                _k = expect;
                return [4 /*yield*/, rows()];
            case 19:
                _k.apply(void 0, [(_10.sent()).filter(function (text) { return /Serve the site/.test(text); })]).toHaveLength(1);
                _m = (_l = pane).press;
                _3 = {};
                return [4 /*yield*/, rowStop()];
            case 20: return [4 /*yield*/, _m.apply(_l, [(_3.key = (_7 = (_6 = (_10.sent())) === null || _6 === void 0 ? void 0 : _6.key) !== null && _7 !== void 0 ? _7 : '', _3)])];
            case 21:
                _10.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, stopped.includes('bg-b1') || undefined];
                    }); }); })];
            case 22:
                _o.apply(void 0, [_10.sent()]).toBe(true);
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rows()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /Serve the site/.test(text); }) ? undefined : true)];
                        }
                    }); }); })];
            case 23:
                _p.apply(void 0, [_10.sent()]).toBe(true);
                expect(appended.filter(function (line) { return line.startsWith('a1: '); })).toEqual([]);
                return [4 /*yield*/, clock.advance(60 * 60000)];
            case 24:
                _10.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 25:
                _q.apply(void 0, [(_8 = (_10.sent())) === null || _8 === void 0 ? void 0 : _8.props.color]).toBe('#4C9AFF');
                _r = expect;
                return [4 /*yield*/, fold()];
            case 26:
                _r.apply(void 0, [_10.sent()]).toBeUndefined();
                moods = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                _s = expect;
                return [4 /*yield*/, moods()];
            case 27:
                _s.apply(void 0, [_10.sent()]).not.toContain('happy');
                return [4 /*yield*/, pressed(pane, 'dismiss-a1')];
            case 28:
                _10.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, moods()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('happy') ? true : undefined)];
                        }
                    }); }); })];
            case 29:
                _t.apply(void 0, [_10.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(2100)];
            case 30:
                _10.sent();
                _u = expect;
                return [4 /*yield*/, moods()];
            case 31:
                _u.apply(void 0, [_10.sent()]).not.toContain('happy');
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fold()];
                    }); }); })];
            case 32:
                _v.apply(void 0, [_10.sent()]).toBe('▸ Finished 1');
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 33:
                _w.apply(void 0, [_10.sent()]).toBeUndefined();
                train = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a2' }, input));
                };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Train the model', prompt: 'train it' }))];
            case 34:
                _10.sent();
                kinds.a2 = 'general-purpose';
                return [4 /*yield*/, train('mcp__claudopus__todo', 't3', { item: 'Start the training', state: 'done' })];
            case 35:
                _10.sent();
                return [4 /*yield*/, train('Bash', 'b2', { command: 'python3 train.py', description: 'Run the training', run_in_background: true })];
            case 36:
                _10.sent();
                _x = expect;
                return [4 /*yield*/, train('SubagentHandback', 'h2', { message: 'The training is started and takes two hours.' })];
            case 37:
                _x.apply(void 0, [(_10.sent()).deny]).toMatch(/^Not handed in: a command of yours still runs: /);
                agents.a2 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a2' })];
            case 38:
                _10.sent();
                _y = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 39:
                _y.apply(void 0, [_10.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 40:
                _10.sent();
                _z = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 41:
                _z.apply(void 0, [_10.sent()]).toBeUndefined();
                _0 = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a2' })];
            case 42:
                _0.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, train('TaskStop', 'k2', { task_id: 'bg-b2' })];
            case 43:
                _10.sent();
                _1 = expect;
                return [4 /*yield*/, train('SubagentHandback', 'h3', { message: 'The model is trained.' })];
            case 44:
                _1.apply(void 0, [(_10.sent()).deny]).toBeUndefined();
                _2 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 45:
                _2.apply(void 0, [(_9 = (_10.sent())) === null || _9 === void 0 ? void 0 : _9.props.color]).toBe('#4C9AFF');
                return [4 /*yield*/, pane.unmount()];
            case 46:
                _10.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that hands in its result with nothing of its own running finishes, though Claude Code still lists its run: the 14 Nov Azure card, which an answer passed on twice kept at work for hours, its clock running', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, resumed, drawn, pane, call, labels, line, stop, _b, _c, _d, asking, _e, _f, release, _g, report, _h, _j, _k, endedLine, _l, _m, sends, again, _o, steer;
    var _this = this;
    var _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, resumed = _a.resumed;
                on('classic.SubagentStop', function () { return ({ value: {} }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _r.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })
                            // The card's line with its clock
                        ];
                    }
                }); }); };
                line = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).find(function (text) { return / · (\d+m )?\d+s$/.test(text); })
                            // As the engine stops any work, it lists everything in flight in the whole session: here another work and its command
                        ];
                    }
                }); }); };
                stop = function (id) {
                    return $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'a2', type: 'local_agent', status: 'running', description: 'Eyes, next round' }, { id: 'b9', type: 'local_bash', status: 'running', description: 'Fit the eyes' }] });
                };
                return [4 /*yield*/, $.prompt.submit({ text: 'use the cloud for heavy work', wait: false, origin: composer })];
            case 3:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Heavy work on Azure', prompt: 'use azure' }))];
            case 4:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Eyes, next round', prompt: 'eyes' }))];
            case 5:
                _r.sent();
                kinds.a1 = 'general-purpose';
                agents.a2 = 'running';
                // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
                // its had ended, yet the engine went on listing it as held on background work of its own
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'One command that runs a job on Azure', state: 'done' })];
            case 6:
                // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
                // its had ended, yet the engine went on listing it as held on background work of its own
                _r.sent();
                return [4 /*yield*/, call('mcp__claudopus__ask', 'k1', { text: 'Release the Azure heavy-jobs route?', choices: ['Release it', 'Hold it'] })];
            case 7:
                _r.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'Heavy work can now run on Azure. Built, tested and pushed on its own branch; it waits for your Release it.' })];
            case 8:
                _r.sent();
                agents.a1 = 'waiting';
                return [4 /*yield*/, stop('a1')];
            case 9:
                _r.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 10:
                _r.sent();
                return [4 /*yield*/, clock.advance(20000)
                    // Ended, its question on its card to answer, its clock stopped: amber while it waits for the person, and no row under it
                ];
            case 11:
                _r.sent();
                // Ended, its question on its card to answer, its clock stopped: amber while it waits for the person, and no row under it
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 12:
                // Ended, its question on its card to answer, its clock stopped: amber while it waits for the person, and no row under it
                _b.apply(void 0, [_r.sent()]).toEqual(['wave']);
                _c = expect;
                return [4 /*yield*/, labels()];
            case 13:
                _c.apply(void 0, [_r.sent()]).toContain('Release it');
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 14:
                _d.apply(void 0, [(_r.sent()).some(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); })]).toBe(false);
                return [4 /*yield*/, line()];
            case 15:
                asking = _r.sent();
                expect(asking).not.toMatch(/Done|Waiting/);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 16:
                _e.apply(void 0, [_r.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 17:
                _r.sent();
                _f = expect;
                return [4 /*yield*/, line()];
            case 18:
                _f.apply(void 0, [_r.sent()]).toBe(asking);
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 19:
                release = (_r.sent()).find(function (b) { return b.props.label === 'Release it'; });
                return [4 /*yield*/, pane.press({ key: (_p = release === null || release === void 0 ? void 0 : release.key) !== null && _p !== void 0 ? _p : '' })];
            case 20:
                _r.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 21:
                _g.apply(void 0, [_r.sent()]).toBeDefined();
                // It finds the release already done and hands that in, Claude Code still listing its run
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'Released: the route is on main.' })];
            case 22:
                // It finds the release already done and hands that in, Claude Code still listing its run
                _r.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 23:
                _r.sent();
                report = "The Azure heavy-jobs route is on main and its deploy succeeded. ".concat('Any worktree that merged main can send a job to its own large Azure machine. '.repeat(7));
                return [4 /*yield*/, call('SubagentHandback', 'h2', { message: report })];
            case 24:
                _r.sent();
                return [4 /*yield*/, stop('a1')];
            case 25:
                _r.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })
                    // It has finished: not at work, its clock stopped
                ];
            case 26:
                _r.sent();
                // It has finished: not at work, its clock stopped
                _h = expect;
                return [4 /*yield*/, drawn(pane)];
            case 27:
                // It has finished: not at work, its clock stopped
                _h.apply(void 0, [_r.sent()]).toEqual(['happy']);
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 28:
                _j.apply(void 0, [(_r.sent()).some(function (b) { return b.key === 'stop-a1'; })]).toBe(false);
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 29:
                _k.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, line()];
            case 30:
                endedLine = _r.sent();
                expect(endedLine).not.toMatch(/Done|Waiting/);
                // and once its moment is over its card stays up, done, its clock where it stopped, never counting on
                return [4 /*yield*/, clock.advance(60000)];
            case 31:
                // and once its moment is over its card stays up, done, its clock where it stopped, never counting on
                _r.sent();
                _l = expect;
                return [4 /*yield*/, line()];
            case 32:
                _l.apply(void 0, [_r.sent()]).toBe(endedLine);
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 33:
                _m.apply(void 0, [(_q = (_r.sent())) === null || _q === void 0 ? void 0 : _q.props.color]).toBe('#4C9AFF');
                sends = resumed.length;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Release it' })];
            case 34:
                again = _r.sent();
                expect(String(again.deny)).toContain('gave on that task\'s card');
                expect(resumed.length).toBe(sends);
                _o = expect;
                return [4 /*yield*/, line()];
            case 35:
                _o.apply(void 0, [_r.sent()]).toBe(endedLine);
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Also file the quota request.' })];
            case 36:
                steer = _r.sent();
                expect(steer.deny).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 37:
                _r.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the same words as a card answer still go when they answer a newer question, or when the person typed them in the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, yes, sent, first, second;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Merge the branch', prompt: 'merge' }))];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Proceed?', choices: ['Yes', 'No'] })];
            case 4:
                _b.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 5:
                yes = (_b.sent()).find(function (b) { return b.props.label === 'Yes'; });
                return [4 /*yield*/, list.press({ key: (_a = yes === null || yes === void 0 ? void 0 : yes.key) !== null && _a !== void 0 ? _a : '' })];
            case 6:
                _b.sent();
                return [4 /*yield*/, clock.advance(5000)
                    // The work asks again, with the same answer to give: the chat passing the person's "Yes" on goes
                ];
            case 7:
                _b.sent();
                // The work asks again, with the same answer to give: the chat passing the person's "Yes" on goes
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Also merge it?', choices: ['Yes', 'No'] })];
            case 8:
                // The work asks again, with the same answer to give: the chat passing the person's "Yes" on goes
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Yes' })];
            case 9:
                sent = _b.sent();
                expect(sent.deny).toBeUndefined();
                // An answer typed in the chat and passed on, then passed on again in the same words: only a card's answer is refused as a repeat
                return [4 /*yield*/, clock.advance(5000)];
            case 10:
                // An answer typed in the chat and passed on, then passed on again in the same words: only a card's answer is refused as a repeat
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Tag it?', choices: ['Yes', 'No'] })];
            case 11:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'Yes', wait: false, origin: composer })];
            case 12:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Yes' })];
            case 13:
                first = _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a1', message: 'Yes' })];
            case 14:
                second = _b.sent();
                expect(first.deny).toBeUndefined();
                expect(second.deny).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 15:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// A dozen cards, one in the middle finishing: before, it went green where it was, among the others, and went under Finished two
// seconds later, so with ten or more running it went by unseen. Now it comes to the top under what waits, outlined green, for its
// two seconds, then is back in its own place among the cards, still green, until the person dismisses it; stopped or failed work
// is not brought up
var dozen = function ($_1, on_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, on_1], args_1, true), void 0, function ($, on, asking) {
        var agents, kinds, w, n, list, order, green, fold, end;
        var _this = this;
        if (asking === void 0) { asking = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    agents = {};
                    kinds = {};
                    w = world(on, { agents: agents, kinds: kinds });
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })];
                case 2:
                    _a.sent();
                    n = 1;
                    _a.label = 3;
                case 3:
                    if (!(n <= 12)) return [3 /*break*/, 6];
                    return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Piece ".concat(n), prompt: "piece ".concat(n) }))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    n += 1;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                case 7:
                    list = _a.sent();
                    if (!asking) return [3 /*break*/, 9];
                    return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [4 /*yield*/, w.clock.advance(5000)];
                case 10:
                    _a.sent();
                    order = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (one) { return /^Piece \d+$/.test(one); }).filter(function (one, n, all) { return all.indexOf(one) === n; })];
                        }
                    }); }); };
                    green = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Box' })];
                            case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.key === 'outline-top' && b.props.backgroundColor === '#4C9AFF'; }).length];
                        }
                    }); }); };
                    fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label
                                // Its run over, as Claude Code lists it: with its last words taken as its result it is done, and ended by an error it failed
                            ];
                        }
                    }); }); };
                    end = function (agentId, reason) {
                        if (reason === void 0) { reason = 'answer'; }
                        return ((agents[agentId] = reason === 'answer' ? 'completed' : 'failed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: reason === 'answer' ? 'Done.' : '', durationMs: 1, isAborted: false, turnId: "t-".concat(agentId), reason: reason, agentId: agentId }));
                    };
                    return [2 /*return*/, __assign(__assign({}, w), { list: list, order: order, green: green, fold: fold, end: end })];
            }
        });
    });
};
var others = function (but) { return Array.from({ length: 12 }, function (_, n) { return n + 1; }).filter(function (n) { return !but.includes(n); }).map(function (n) { return "Piece ".concat(n); }); };
test('a finished card in the middle of a dozen comes to the top at once, outlined for two seconds on time, and stays there over what works, delivered and never under Finished, after an hour and after another task finishes; only Mark as done puts it under Finished; delivered, it has only Give feedback and Mark as done to press, at its bottom, failed Message and Dismiss at its top right, and neither press tells its task anything', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, green, fold, end, clock, appended, resumed, sent, submitted, doneLines, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, bar, onCard, _loop_1, _i, _y, _z, id, reason, said, presses;
    var _this = this;
    var _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
            case 0: return [4 /*yield*/, dozen($, on)];
            case 1:
                _a = _2.sent(), list = _a.list, order = _a.order, green = _a.green, fold = _a.fold, end = _a.end, clock = _a.clock, appended = _a.appended, resumed = _a.resumed, sent = _a.sent, submitted = _a.submitted;
                doneLines = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.text === '◐ Delivered' && one.props.color === '#4C9AFF'; }).length];
                    }
                }); }); };
                _b = expect;
                return [4 /*yield*/, order()];
            case 2:
                _b.apply(void 0, [_2.sent()]).toEqual(others([]));
                return [4 /*yield*/, end('a7')];
            case 3:
                _2.sent();
                _c = expect;
                return [4 /*yield*/, order()];
            case 4:
                _c.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _d = expect;
                return [4 /*yield*/, green()];
            case 5:
                _d.apply(void 0, [_2.sent()]).toBe(1);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '◐ Delivered' })];
            case 6:
                _e.apply(void 0, [(_0 = (_2.sent())) === null || _0 === void 0 ? void 0 : _0.props.color]).toBe('#4C9AFF');
                return [4 /*yield*/, clock.advance(1900)];
            case 7:
                _2.sent();
                _f = expect;
                return [4 /*yield*/, order()];
            case 8:
                _f.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _g = expect;
                return [4 /*yield*/, green()];
            case 9:
                _g.apply(void 0, [_2.sent()]).toBe(1);
                // The two seconds end on time, by the clock alone: no card is left outlined, and it stays on top, delivered, with
                // nothing under Finished
                return [4 /*yield*/, clock.advance(150)];
            case 10:
                // The two seconds end on time, by the clock alone: no card is left outlined, and it stays on top, delivered, with
                // nothing under Finished
                _2.sent();
                _h = expect;
                return [4 /*yield*/, green()];
            case 11:
                _h.apply(void 0, [_2.sent()]).toBe(0);
                _j = expect;
                return [4 /*yield*/, order()];
            case 12:
                _j.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _k = expect;
                return [4 /*yield*/, doneLines()];
            case 13:
                _k.apply(void 0, [_2.sent()]).toBe(1);
                _l = expect;
                return [4 /*yield*/, fold()];
            case 14:
                _l.apply(void 0, [_2.sent()]).toBeUndefined();
                // An hour on it is there as it was
                return [4 /*yield*/, clock.advance(60 * 60000)];
            case 15:
                // An hour on it is there as it was
                _2.sent();
                _m = expect;
                return [4 /*yield*/, order()];
            case 16:
                _m.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _o = expect;
                return [4 /*yield*/, doneLines()];
            case 17:
                _o.apply(void 0, [_2.sent()]).toBe(1);
                _p = expect;
                return [4 /*yield*/, fold()];
            case 18:
                _p.apply(void 0, [_2.sent()]).toBeUndefined();
                // Another task finishes and has its own moment: the first stays among the cards, and after it both are there
                return [4 /*yield*/, end('a9')];
            case 19:
                // Another task finishes and has its own moment: the first stays among the cards, and after it both are there
                _2.sent();
                _q = expect;
                return [4 /*yield*/, order()];
            case 20:
                _q.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 9', 'Piece 7'], others([7, 9]), true));
                _r = expect;
                return [4 /*yield*/, green()];
            case 21:
                _r.apply(void 0, [_2.sent()]).toBe(1);
                return [4 /*yield*/, clock.advance(2100)];
            case 22:
                _2.sent();
                _s = expect;
                return [4 /*yield*/, order()];
            case 23:
                _s.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 9', 'Piece 7'], others([7, 9]), true));
                _t = expect;
                return [4 /*yield*/, doneLines()];
            case 24:
                _t.apply(void 0, [_2.sent()]).toBe(2);
                _u = expect;
                return [4 /*yield*/, fold()];
            case 25:
                _u.apply(void 0, [_2.sent()]).toBeUndefined();
                // Only the person's Dismiss puts one under Finished, and only that one
                return [4 /*yield*/, pressed(list, 'dismiss-a7')];
            case 26:
                // Only the person's Dismiss puts one under Finished, and only that one
                _2.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 27:
                _2.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fold()];
                    }); }); })];
            case 28:
                _v.apply(void 0, [_2.sent()]).toBe('▸ Finished 1');
                _w = expect;
                return [4 /*yield*/, order()];
            case 29:
                _w.apply(void 0, [_2.sent()]).toEqual(__spreadArray(['Piece 9'], others([7, 9]), true));
                _x = expect;
                return [4 /*yield*/, doneLines()];
            case 30:
                _x.apply(void 0, [_2.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 31:
                bar = _2.sent();
                onCard = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                found = [];
                                walk = function (node) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                    var one = (node !== null && node !== void 0 ? node : {});
                                    if (one.type === 'Button')
                                        found.push([String((_e = (_c = (_b = (_a = one.props) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : one.key) !== null && _c !== void 0 ? _c : (_d = one.props) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '').replace(/-\d+$/, ''), (_f = one.props) === null || _f === void 0 ? void 0 : _f.plain, (_g = one.props) === null || _g === void 0 ? void 0 : _g.dimColor]);
                                    for (var _i = 0, _j = (_h = one.children) !== null && _h !== void 0 ? _h : []; _i < _j.length; _i++) {
                                        var child = _j[_i];
                                        walk(child);
                                    }
                                };
                                _a = walk;
                                return [4 /*yield*/, list.find({ type: 'Box', key: "todo-".concat(id) })];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                _loop_1 = function (id, reason, said, presses) {
                    var _3, _4, _5, _6, _7, told, folded, _8, _9, _10, _11, _12, _13;
                    return __generator(this, function (_14) {
                        switch (_14.label) {
                            case 0: return [4 /*yield*/, end(id, reason)];
                            case 1:
                                _14.sent();
                                _3 = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, onCard(id)];
                                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one[0] === presses[1][0]; }) ? true : undefined)];
                                        }
                                    }); }); })];
                            case 2:
                                _3.apply(void 0, [_14.sent()]).toBe(true);
                                _4 = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: said })];
                            case 3:
                                _4.apply(void 0, [_14.sent()]).toBeDefined();
                                // (a failed card also has its Start again)
                                _5 = expect;
                                _6 = [id];
                                return [4 /*yield*/, onCard(id)];
                            case 4:
                                // (a failed card also has its Start again)
                                _5.apply(void 0, [_6.concat([(_14.sent()).filter(function (one) { return one[0] !== 'Start again'; })])]).toEqual([id, __spreadArray([["Piece ".concat(id.slice(1)), true, undefined]], presses, true)]);
                                if (!(reason === 'answer')) return [3 /*break*/, 6];
                                _7 = expect;
                                return [4 /*yield*/, onCard(id)];
                            case 5:
                                _7.apply(void 0, [(_14.sent()).length]).toBe(3);
                                _14.label = 6;
                            case 6:
                                told = [appended.length, resumed.length, sent.length, submitted.length];
                                _8 = Number;
                                _10 = (_9 = /\d+/).exec;
                                _11 = String;
                                return [4 /*yield*/, fold()];
                            case 7:
                                folded = _8.apply(void 0, [(_1 = _10.apply(_9, [_11.apply(void 0, [_14.sent()])])) === null || _1 === void 0 ? void 0 : _1[0]]);
                                return [4 /*yield*/, pressed(list, "dismiss-".concat(id))];
                            case 8:
                                _14.sent();
                                return [4 /*yield*/, clock.advance(2100)];
                            case 9:
                                _14.sent();
                                _12 = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, fold()];
                                            case 1: return [2 /*return*/, ((_a.sent()) === "\u25B8 Finished ".concat(folded + 1) ? true : undefined)];
                                        }
                                    }); }); })];
                            case 10:
                                _12.apply(void 0, [_14.sent()]).toBe(true);
                                _13 = expect;
                                return [4 /*yield*/, list.find({ type: 'Box', key: "todo-".concat(id) })];
                            case 11:
                                _13.apply(void 0, [_14.sent()]).toBeUndefined();
                                return [4 /*yield*/, clock.advance(5000)];
                            case 12:
                                _14.sent();
                                expect([id, appended.length, resumed.length, sent.length, submitted.length]).toEqual(__spreadArray([id], told, true));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _y = [['a8', 'answer', /^◐ Delivered/, [['Give feedback', undefined, undefined], ['Mark as done', undefined, undefined]]], ['a10', 'error', /^✕ Failed/, [['Message', true, true], ['Dismiss', true, true]]]];
                _2.label = 32;
            case 32:
                if (!(_i < _y.length)) return [3 /*break*/, 35];
                _z = _y[_i], id = _z[0], reason = _z[1], said = _z[2], presses = _z[3];
                return [5 /*yield**/, _loop_1(id, reason, said, presses)];
            case 33:
                _2.sent();
                _2.label = 34;
            case 34:
                _i++;
                return [3 /*break*/, 32];
            case 35: return [4 /*yield*/, bar.unmount()];
            case 36:
                _2.sent();
                return [2 /*return*/];
        }
    });
}); });
test('two that finish close together stack at the top newest first, each for its own two seconds', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, order, green, end, clock, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, dozen($, on)];
            case 1:
                _a = _h.sent(), order = _a.order, green = _a.green, end = _a.end, clock = _a.clock;
                return [4 /*yield*/, end('a4')];
            case 2:
                _h.sent();
                return [4 /*yield*/, clock.advance(800)];
            case 3:
                _h.sent();
                return [4 /*yield*/, end('a9')];
            case 4:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, order()];
            case 5:
                _b.apply(void 0, [_h.sent()]).toEqual(__spreadArray(['Piece 9', 'Piece 4'], others([4, 9]), true));
                _c = expect;
                return [4 /*yield*/, green()];
            case 6:
                _c.apply(void 0, [_h.sent()]).toBe(2);
                return [4 /*yield*/, clock.advance(1300)
                    // (the first, its moment over, stays on top under the newer one)
                ];
            case 7:
                _h.sent();
                // (the first, its moment over, stays on top under the newer one)
                _d = expect;
                return [4 /*yield*/, order()];
            case 8:
                // (the first, its moment over, stays on top under the newer one)
                _d.apply(void 0, [_h.sent()]).toEqual(__spreadArray(['Piece 9', 'Piece 4'], others([4, 9]), true));
                _e = expect;
                return [4 /*yield*/, green()];
            case 9:
                _e.apply(void 0, [_h.sent()]).toBe(1);
                return [4 /*yield*/, clock.advance(800)];
            case 10:
                _h.sent();
                _f = expect;
                return [4 /*yield*/, green()];
            case 11:
                _f.apply(void 0, [_h.sent()]).toBe(0);
                _g = expect;
                return [4 /*yield*/, order()];
            case 12:
                _g.apply(void 0, [_h.sent()]).toEqual(__spreadArray(['Piece 9', 'Piece 4'], others([4, 9]), true));
                return [2 /*return*/];
        }
    });
}); });
test('a finish while an ask waits goes right under the ask, never above it, and stays there, over what works', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, order, green, end, clock, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, dozen($, on, true)];
            case 1:
                _a = _f.sent(), order = _a.order, green = _a.green, end = _a.end, clock = _a.clock;
                _b = expect;
                return [4 /*yield*/, order()];
            case 2:
                _b.apply(void 0, [_f.sent()]).toEqual(__spreadArray(['Piece 3'], others([3]), true));
                return [4 /*yield*/, end('a7')];
            case 3:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, order()];
            case 4:
                _c.apply(void 0, [_f.sent()]).toEqual(__spreadArray(['Piece 3', 'Piece 7'], others([3, 7]), true));
                _d = expect;
                return [4 /*yield*/, green()];
            case 5:
                _d.apply(void 0, [_f.sent()]).toBe(1);
                return [4 /*yield*/, clock.advance(2100)];
            case 6:
                _f.sent();
                _e = expect;
                return [4 /*yield*/, order()];
            case 7:
                _e.apply(void 0, [_f.sent()]).toEqual(__spreadArray(['Piece 3', 'Piece 7'], others([3, 7]), true));
                return [2 /*return*/];
        }
    });
}); });
test('stopped and failed work is not brought up nor green: it stays in its place, the stopped one grey and the failed one in red, saying why, with Start again, each until it is dismissed', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, green, fold, end, clock, _b, _c, _d, failed, _e, _i, _f, wait, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var _this = this;
    var _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0: return [4 /*yield*/, dozen($, on)];
            case 1:
                _a = _v.sent(), list = _a.list, order = _a.order, green = _a.green, fold = _a.fold, end = _a.end, clock = _a.clock;
                return [4 /*yield*/, list.press({ key: 'stop-a5' })];
            case 2:
                _v.sent();
                return [4 /*yield*/, end('a8', 'error')];
            case 3:
                _v.sent();
                _b = expect;
                return [4 /*yield*/, order()];
            case 4:
                _b.apply(void 0, [_v.sent()]).toEqual(others([]));
                _c = expect;
                return [4 /*yield*/, green()];
            case 5:
                _c.apply(void 0, [_v.sent()]).toBe(0);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Stopped' })];
            case 6:
                _d.apply(void 0, [(_s = (_v.sent())) === null || _s === void 0 ? void 0 : _s.props.dimColor]).toBe(true);
                return [4 /*yield*/, list.find({ type: 'Text', text: '✕ Failed · Ended with an error' })];
            case 7:
                failed = _v.sent();
                expect(failed === null || failed === void 0 ? void 0 : failed.props.color).toBe('error');
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 8:
                _e.apply(void 0, [(_v.sent()).some(function (b) { return b.props.backgroundColor === 'error'; })]).toBe(true);
                _i = 0, _f = [2100, 60 * 60000];
                _v.label = 9;
            case 9:
                if (!(_i < _f.length)) return [3 /*break*/, 18];
                wait = _f[_i];
                return [4 /*yield*/, clock.advance(wait)];
            case 10:
                _v.sent();
                _g = expect;
                return [4 /*yield*/, order()];
            case 11:
                _g.apply(void 0, [_v.sent()]).toEqual(others([]));
                _h = expect;
                return [4 /*yield*/, green()];
            case 12:
                _h.apply(void 0, [_v.sent()]).toBe(0);
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Stopped' })];
            case 13:
                _j.apply(void 0, [(_t = (_v.sent())) === null || _t === void 0 ? void 0 : _t.props.dimColor]).toBe(true);
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✕ Failed · Ended with an error' })];
            case 14:
                _k.apply(void 0, [(_u = (_v.sent())) === null || _u === void 0 ? void 0 : _u.props.color]).toBe('error');
                _l = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 15:
                _l.apply(void 0, [(_v.sent()).filter(function (b) { return b.props.label === 'Start again'; }).map(function (b) { return String(b.key).replace(/-\d+$/, ''); })]).toEqual(['again-small-a5', 'again-small-a8']);
                _m = expect;
                return [4 /*yield*/, fold()];
            case 16:
                _m.apply(void 0, [_v.sent()]).toBeUndefined();
                _v.label = 17;
            case 17:
                _i++;
                return [3 /*break*/, 9];
            case 18: 
            // Each goes under Finished only on its own Dismiss
            return [4 /*yield*/, pressed(list, 'dismiss-a5')];
            case 19:
                // Each goes under Finished only on its own Dismiss
                _v.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fold()];
                    }); }); })];
            case 20:
                _o.apply(void 0, [_v.sent()]).toBe('▸ Finished 1');
                _p = expect;
                return [4 /*yield*/, order()];
            case 21:
                _p.apply(void 0, [_v.sent()]).toEqual(others([5]));
                return [4 /*yield*/, pressed(list, 'dismiss-a8')];
            case 22:
                _v.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fold()];
                            case 1: return [2 /*return*/, ((_a.sent()) === '▸ Finished 2' ? true : undefined)];
                        }
                    }); }); })];
            case 23:
                _q.apply(void 0, [_v.sent()]).toBe(true);
                _r = expect;
                return [4 /*yield*/, order()];
            case 24:
                _r.apply(void 0, [_v.sent()]).toEqual(others([5, 8]));
                return [2 /*return*/];
        }
    });
}); });
test('a finish while a reply is being typed still shows at the top in green, under the ask being typed into, its words kept', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, green, end, clock, box, _b, _c, _d, _e;
    var _this = this;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, dozen($, on, true)];
            case 1:
                _a = _h.sent(), list = _a.list, order = _a.order, green = _a.green, end = _a.end, clock = _a.clock;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 2:
                box = (_g = (_f = (_h.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _f === void 0 ? void 0 : _f.key) !== null && _g !== void 0 ? _g : '';
                return [4 /*yield*/, list.input({ key: box, text: 'Not y', kind: 'change' })];
            case 3:
                _h.sent();
                return [4 /*yield*/, end('a7')];
            case 4:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, green()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 5:
                _b.apply(void 0, [_h.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, order()];
            case 6:
                _c.apply(void 0, [_h.sent()]).toEqual(__spreadArray(['Piece 3', 'Piece 7'], others([3, 7]), true));
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 7:
                _d.apply(void 0, [(_h.sent()).map(function (one) { return one.key; })]).toContain(box);
                return [4 /*yield*/, clock.advance(2100)];
            case 8:
                _h.sent();
                _e = expect;
                return [4 /*yield*/, green()];
            case 9:
                _e.apply(void 0, [_h.sent()]).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
test('scrolled down, a finish at the top is pointed at in green above the prompt for its two seconds, beside what waits', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, w, n, down, band, mark, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                agents = {};
                kinds = {};
                w = world(on, { panes: ['claudopus'], agents: agents, kinds: kinds });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'twelve things', wait: false, origin: composer })];
            case 2:
                _d.sent();
                n = 1;
                _d.label = 3;
            case 3:
                if (!(n <= 12)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Piece ".concat(n), prompt: "piece ".concat(n) }))];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                n += 1;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 40, bodyRows: 20 } }), surface: 'desktop' }))];
            case 7:
                down = _d.sent();
                return [4 /*yield*/, w.clock.advance(1000)];
            case 8:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))
                    // (its run over, as Claude Code lists it, its last words its result)
                ];
            case 9:
                band = _d.sent();
                // (its run over, as Claude Code lists it, its last words its result)
                agents.a7 = agents.a9 = 'completed';
                kinds.a7 = kinds.a9 = 'general-purpose';
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't7', reason: 'answer', agentId: 'a7' })];
            case 10:
                _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, band.find({ type: 'Text', text: /is done, at the top of the panel/ })];
                    }); }); })];
            case 11:
                mark = _d.sent();
                expect(mark === null || mark === void 0 ? void 0 : mark.text).toBe('↑ Piece 7 is done, at the top of the panel');
                expect(mark === null || mark === void 0 ? void 0 : mark.props.color).toBe('success');
                return [4 /*yield*/, w.clock.advance(2100)];
            case 12:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /finished/ })];
            case 13:
                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                // With an ask waiting, the amber line says both
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Refuse'] })];
            case 14:
                // With an ask waiting, the amber line says both
                _d.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 't9', reason: 'answer', agentId: 'a9' })];
            case 15:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, band.find({ type: 'Text', text: / · 1 done$/ })];
                    }); }); })];
            case 16:
                _b.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toBe('● 1 waiting for you · Piece 3: May I delete the old repo? · 1 done');
                return [4 /*yield*/, band.unmount()];
            case 17:
                _d.sent();
                return [4 /*yield*/, down.unmount()];
            case 18:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a finished card that left a server running stays at the top after its moment, the server its row with a Stop, never back among the running, and stays there an hour on', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, n, list, order, call, _a, _b, _c, _d, _e, _f, _g;
    var _this = this;
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site and more', wait: false, origin: composer })];
            case 2:
                _j.sent();
                n = 1;
                _j.label = 3;
            case 3:
                if (!(n <= 4)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Piece ".concat(n), prompt: "piece ".concat(n) }))
                    // (wide enough for a row's own Stop)
                ];
            case 4:
                _j.sent();
                _j.label = 5;
            case 5:
                n += 1;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'desktop' }))];
            case 7:
                list = _j.sent();
                order = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (one) { return /^Piece \d+$/.test(one); }).filter(function (one, n, all) { return all.indexOf(one) === n; })];
                    }
                }); }); };
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a3' }, input));
                };
                kinds.a3 = 'general-purpose';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })];
            case 8:
                _j.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 9:
                _j.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })];
            case 10:
                _j.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })];
            case 11:
                _j.sent();
                agents.a3 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a3' })];
            case 12:
                _j.sent();
                _a = expect;
                return [4 /*yield*/, order()];
            case 13:
                _a.apply(void 0, [_j.sent()]).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4']);
                return [4 /*yield*/, clock.advance(20000)];
            case 14:
                _j.sent();
                _b = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 15:
                _b.apply(void 0, [(_j.sent()).filter(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); })]).toHaveLength(1);
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
            case 16:
                _c.apply(void 0, [_j.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, order()];
            case 17:
                _d.apply(void 0, [_j.sent()]).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4']);
                return [4 /*yield*/, clock.advance(60 * 60000)];
            case 18:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 19:
                _e.apply(void 0, [(_j.sent()).filter(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); })]).toHaveLength(1);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '◐ Delivered' })];
            case 20:
                _f.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.props.color]).toBe('#4C9AFF');
                _g = expect;
                return [4 /*yield*/, order()];
            case 21:
                _g.apply(void 0, [_j.sent()]).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4']);
                return [2 /*return*/];
        }
    });
}); });
test("a task's report whose notice of its end never comes goes to the chat with the person's next message, once; a message to the task after its hand-back is a step of its own", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, talk, stepped, asked, _a, _b, _c, chunk, e_2_1, withMessage, _d, _e;
    var _this = this;
    var _f, e_2, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                agents = {};
                kinds = {};
                talk = [];
                stepped = world(on, { agents: agents, kinds: kinds, talk: talk }).stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'name the squid', wait: false, origin: composer })
                    // A report whose notice never comes goes with the person's next message, once; a message to the task after its hand-back is a step
                    // of its own, never answered with no model
                ];
            case 2:
                _j.sent();
                // A report whose notice never comes goes with the person's next message, once; a message to the task after its hand-back is a step
                // of its own, never answered with no model
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the squid', prompt: 'name it' }))];
            case 3:
                // A report whose notice never comes goes with the person's next message, once; a message to the task after its hand-back is a step
                // of its own, never answered with no model
                _j.sent();
                agents.a1 = 'waiting';
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb5', agentId: 'a1', message: 'Named it Inky.' })];
            case 4:
                _j.sent();
                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'tool_use', id: 'hb5', name: 'SubagentHandback', input: { message: 'Named it Inky.' } }] }, { role: 'user', content: [{ type: 'text', text: 'Also name the crab.' }] });
                asked = stepped.length;
                _j.label = 5;
            case 5:
                _j.trys.push([5, 10, 11, 16]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 't5s', index: 1, model: 'm', messageCount: 2, agentId: 'a1' }));
                _j.label = 6;
            case 6: return [4 /*yield*/, _b.next()];
            case 7:
                if (!(_c = _j.sent(), _f = _c.done, !_f)) return [3 /*break*/, 9];
                _h = _c.value;
                _a = false;
                chunk = _h;
                void chunk;
                _j.label = 8;
            case 8:
                _a = true;
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_2_1 = _j.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 16];
            case 11:
                _j.trys.push([11, , 14, 15]);
                if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _g.call(_b)];
            case 12:
                _j.sent();
                _j.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16:
                expect(stepped.length - asked).toBe(1);
                talk.splice(0, talk.length);
                withMessage = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, $.prompt.submit({ text: 'what did it name it?', wait: false, origin: { kind: 'composer' } })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).context) === null || _a === void 0 ? void 0 : _a.join('\n')) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                _d = expect;
                return [4 /*yield*/, withMessage()];
            case 17:
                _d.apply(void 0, [_j.sent()]).toContain('  Named it Inky.');
                _e = expect;
                return [4 /*yield*/, withMessage()];
            case 18:
                _e.apply(void 0, [_j.sent()]).not.toContain('Named it Inky.');
                return [2 /*return*/];
        }
    });
}); });
