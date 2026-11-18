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
    var clock, end, drawn, moment, pane, band, _a, _b, _c, _d, first, firstBand, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, again, _z, _0, _1, _2, _3, _4, _5, after, _6, _7, _8, _9;
    var _this = this;
    var _10;
    return __generator(this, function (_11) {
        switch (_11.label) {
            case 0:
                clock = world(on, { art: true }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _11.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _11.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _11.sent();
                end = function (agentId, turnId) { return $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: agentId }); };
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
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /^<svg data-moment="([\w-]+)"/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)[0]];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _11.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 5:
                band = _11.sent();
                _a = expect;
                return [4 /*yield*/, drawn(pane)];
            case 6:
                _a.apply(void 0, [_11.sent()]).toEqual(['working']);
                _b = expect;
                return [4 /*yield*/, drawn(band)];
            case 7:
                _b.apply(void 0, [_11.sent()]).toEqual(['working-small']);
                // One finishes while another works: both octopuses are happy
                return [4 /*yield*/, clock.advance(400)];
            case 8:
                // One finishes while another works: both octopuses are happy
                _11.sent();
                return [4 /*yield*/, end('a1', 't1')];
            case 9:
                _11.sent();
                _c = expect;
                return [4 /*yield*/, drawn(pane)];
            case 10:
                _c.apply(void 0, [_11.sent()]).toEqual(['happy']);
                _d = expect;
                return [4 /*yield*/, drawn(band)];
            case 11:
                _d.apply(void 0, [_11.sent()]).toEqual(['happy-small']);
                return [4 /*yield*/, moment(pane)];
            case 12:
                first = _11.sent();
                return [4 /*yield*/, moment(band)];
            case 13:
                firstBand = _11.sent();
                expect(first).toBeDefined();
                expect(firstBand).toBeDefined();
                _e = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /Check the ears/ })];
            case 14:
                _e.apply(void 0, [_11.sent()]).toBeUndefined();
                // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                // The other finishes in the pause: the same drawing stays, with nothing else running, and the band stays for the pause
                _11.sent();
                return [4 /*yield*/, end('a2', 't2')];
            case 16:
                _11.sent();
                _f = expect;
                return [4 /*yield*/, drawn(pane)];
            case 17:
                _f.apply(void 0, [_11.sent()]).toEqual(['happy']);
                _g = expect;
                return [4 /*yield*/, drawn(band)];
            case 18:
                _g.apply(void 0, [_11.sent()]).toEqual(['happy-small']);
                _h = expect;
                return [4 /*yield*/, moment(pane)];
            case 19:
                _h.apply(void 0, [_11.sent()]).toBe(first);
                _j = expect;
                return [4 /*yield*/, moment(band)];
            case 20:
                _j.apply(void 0, [_11.sent()]).toBe(firstBand);
                // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
                return [4 /*yield*/, clock.advance(1100)];
            case 21:
                // The first pause ends but the second has not: still happy, the same drawing; once both are over, at rest and the band gone
                _11.sent();
                _k = expect;
                return [4 /*yield*/, drawn(pane)];
            case 22:
                _k.apply(void 0, [_11.sent()]).toEqual(['happy']);
                _l = expect;
                return [4 /*yield*/, moment(pane)];
            case 23:
                _l.apply(void 0, [_11.sent()]).toBe(first);
                return [4 /*yield*/, clock.advance(1000)];
            case 24:
                _11.sent();
                _m = expect;
                return [4 /*yield*/, drawn(pane)];
            case 25:
                _m.apply(void 0, [_11.sent()]).toEqual(['mark']);
                _o = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: "the engine's own" })];
            case 26:
                _o.apply(void 0, [_11.sent()]).toBeDefined();
                // Work finishing while another still runs goes back to work after its pause
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 27:
                // Work finishing while another still runs goes back to work after its pause
                _11.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 28:
                _11.sent();
                _p = expect;
                return [4 /*yield*/, drawn(band)];
            case 29:
                _p.apply(void 0, [_11.sent()]).toEqual(['working-small']);
                return [4 /*yield*/, end('a3', 't3')];
            case 30:
                _11.sent();
                _q = expect;
                return [4 /*yield*/, drawn(pane)];
            case 31:
                _q.apply(void 0, [_11.sent()]).toEqual(['happy']);
                // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
                _r = expect;
                return [4 /*yield*/, moment(pane)];
            case 32:
                // A new happy moment is a drawing new to the app, so its arms go up again from the start, in the header and the band
                _r.apply(void 0, [_11.sent()]).not.toBe(first);
                _s = expect;
                return [4 /*yield*/, drawn(band)];
            case 33:
                _s.apply(void 0, [_11.sent()]).toEqual(['happy-small']);
                _t = expect;
                return [4 /*yield*/, moment(band)];
            case 34:
                _t.apply(void 0, [_11.sent()]).not.toBe(firstBand);
                return [4 /*yield*/, clock.advance(2100)];
            case 35:
                _11.sent();
                _u = expect;
                return [4 /*yield*/, drawn(pane)];
            case 36:
                _u.apply(void 0, [_11.sent()]).toEqual(['working']);
                _v = expect;
                return [4 /*yield*/, drawn(band)];
            case 37:
                _v.apply(void 0, [_11.sent()]).toEqual(['working-small']);
                // Stopped work makes no one happy
                return [4 /*yield*/, pane.press({ key: 'stop-a4' })];
            case 38:
                // Stopped work makes no one happy
                _11.sent();
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 39:
                _w.apply(void 0, [_11.sent()]).toBeDefined();
                _x = expect;
                return [4 /*yield*/, drawn(pane)];
            case 40:
                _x.apply(void 0, [_11.sent()]).toEqual(['mark']);
                _y = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: "the engine's own" })];
            case 41:
                _y.apply(void 0, [_11.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(2100)
                    // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                ];
            case 42:
                _11.sent();
                // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                return [4 /*yield*/, pane.unmount()];
            case 43:
                // Work that finishes while the panel is closed leaves no happy octopus when it opens after the pause
                _11.sent();
                return [4 /*yield*/, band.unmount()];
            case 44:
                _11.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 45:
                _11.sent();
                return [4 /*yield*/, end('a5', 't5')];
            case 46:
                _11.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 47:
                _11.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 48:
                again = _11.sent();
                _z = expect;
                return [4 /*yield*/, drawn(again)];
            case 49:
                _z.apply(void 0, [_11.sent()]).toEqual(['mark']);
                // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the nose', prompt: 'draw the nose' }))];
            case 50:
                // Nor after a reload in the pause: the pause still ends, and the octopus is at rest
                _11.sent();
                return [4 /*yield*/, end('a6', 't6')];
            case 51:
                _11.sent();
                _0 = expect;
                return [4 /*yield*/, drawn(again)];
            case 52:
                _0.apply(void 0, [_11.sent()]).toEqual(['happy']);
                return [4 /*yield*/, $.session.start(start)];
            case 53:
                _11.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 54:
                _11.sent();
                _1 = expect;
                return [4 /*yield*/, drawn(again)];
            case 55:
                _1.apply(void 0, [_11.sent()]).toEqual(['mark']);
                // Seen ended before the reload, it is not shown ended again after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the brows', prompt: 'draw the brows' }))];
            case 56:
                // Seen ended before the reload, it is not shown ended again after it
                _11.sent();
                return [4 /*yield*/, end('a7', 't7')];
            case 57:
                _11.sent();
                _2 = expect;
                return [4 /*yield*/, drawn(again)];
            case 58:
                _2.apply(void 0, [_11.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(2100)];
            case 59:
                _11.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 60:
                _11.sent();
                _3 = expect;
                return [4 /*yield*/, drawn(again)];
            case 61:
                _3.apply(void 0, [_11.sent()]).toEqual(['mark']);
                _4 = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: '✓ Done' })];
            case 62:
                _4.apply(void 0, [_11.sent()]).toBeUndefined();
                // Work that ended long before a load is not
                return [4 /*yield*/, clock.advance(30000)];
            case 63:
                // Work that ended long before a load is not
                _11.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 64:
                _11.sent();
                _5 = expect;
                return [4 /*yield*/, drawn(again)];
            case 65:
                _5.apply(void 0, [_11.sent()]).toEqual(['mark']);
                // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
                return [4 /*yield*/, again.unmount()];
            case 66:
                // Work that ends while nothing is drawn, as while the mod reloads, has its pause from the panel's first drawing after the load
                _11.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 67:
                _11.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the lips', prompt: 'draw the lips' }))];
            case 68:
                _11.sent();
                return [4 /*yield*/, end('a8', 't8')];
            case 69:
                _11.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 70:
                _11.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 71:
                _11.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 72:
                _11.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 73:
                after = _11.sent();
                _6 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Done' })];
            case 74:
                _6.apply(void 0, [(_10 = (_11.sent())) === null || _10 === void 0 ? void 0 : _10.props.color]).toBe('success');
                return [4 /*yield*/, clock.advance(2100)];
            case 75:
                _11.sent();
                _7 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Done' })];
            case 76:
                _7.apply(void 0, [_11.sent()]).toBeUndefined();
                // Work stopped in the seconds of a load is not green after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 77:
                // Work stopped in the seconds of a load is not green after it
                _11.sent();
                return [4 /*yield*/, after.press({ key: 'stop-a9' })];
            case 78:
                _11.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 79:
                _11.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 80:
                _11.sent();
                _8 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Done' })];
            case 81:
                _8.apply(void 0, [_11.sent()]).toBeUndefined();
                _9 = expect;
                return [4 /*yield*/, drawn(after)];
            case 82:
                _9.apply(void 0, [_11.sent()]).toEqual(['mark']);
                return [4 /*yield*/, after.unmount()];
            case 83:
                _11.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that answered in words while only its own background work held it has not finished: stopped by the chat or the engine, it is stopped, not done; a hand-back ends it done at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, talk, _a, clock, files, stepped, drawn, pane, report, answer, _b, kept, _c, _d, _e, n, _f, _g, _h, _j, _k, handed, HANDED, PRESS, _i, _l, last, before, texts, _m, _o, _p, chunk, e_1_1, _q, _r, ENDED_A4, endNotice, given, _s, _t, _u, _v, otto, reportsBefore, _w, _x, _y, early, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
    var _this = this;
    var _14, e_1, _15, _16;
    var _17, _18, _19, _20, _21, _22;
    return __generator(this, function (_23) {
        switch (_23.label) {
            case 0:
                agents = {};
                kinds = {};
                talk = [];
                _a = world(on, { art: true, agents: agents, kinds: kinds, talk: talk }), clock = _a.clock, files = _a.files, stepped = _a.stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _23.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _23.sent();
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
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Remove the hover', prompt: 'remove the hover' }))];
            case 4:
                _23.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 5:
                _23.sent();
                return [4 /*yield*/, answer('a1', 't1')];
            case 6:
                _23.sent();
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 7:
                _b.apply(void 0, [_23.sent()]).toEqual(['working']);
                kept = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-remove-the-hover\/report\.md$/.test(key); }); };
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 8:
                _23.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 9:
                _c.apply(void 0, [_23.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 10:
                _d.apply(void 0, [_23.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, drawn(pane)];
            case 11:
                _e.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(20)];
            case 12:
                _23.sent();
                expect(kept()).toHaveLength(0);
                agents.a1 = 'killed';
                return [4 /*yield*/, clock.advance(2100)
                    // Stopped some other way, the engine lists it killed at its next look: stopped as well
                ];
            case 13:
                _23.sent();
                // Stopped some other way, the engine lists it killed at its next look: stopped as well
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the idle chats', prompt: 'fold them' }))];
            case 14:
                // Stopped some other way, the engine lists it killed at its next look: stopped as well
                _23.sent();
                return [4 /*yield*/, answer('a2', 't1b')];
            case 15:
                _23.sent();
                agents.a2 = 'killed';
                n = 0;
                _23.label = 16;
            case 16:
                _f = n < 25;
                if (!_f) return [3 /*break*/, 18];
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 17:
                _f = !(_23.sent());
                _23.label = 18;
            case 18:
                if (!_f) return [3 /*break*/, 21];
                return [4 /*yield*/, clock.advance(1000)];
            case 19:
                _23.sent();
                _23.label = 20;
            case 20:
                n += 1;
                return [3 /*break*/, 16];
            case 21:
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 22:
                _g.apply(void 0, [_23.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 23:
                _h.apply(void 0, [_23.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)
                    // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                ];
            case 24:
                _23.sent();
                // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Build the app', prompt: 'build it' }))];
            case 25:
                // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                _23.sent();
                agents.a3 = 'waiting';
                kinds.a3 = 'general-purpose';
                return [4 /*yield*/, $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' })];
            case 26:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' })];
            case 27:
                _23.sent();
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 28:
                _j.apply(void 0, [_23.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, drawn(pane)];
            case 29:
                _k.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                    // background goes on, unstopped, and the chat need not stop it
                ];
            case 30:
                _23.sent();
                // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                // background goes on, unstopped, and the chat need not stop it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the octopus', prompt: 'name it' }))];
            case 31:
                // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                // background goes on, unstopped, and the chat need not stop it
                _23.sent();
                agents.a4 = 'waiting';
                kinds.a4 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'w4', agentId: 'a4', command: 'tail -f names.log', description: 'watch the names', timeout_ms: 0 })
                    // Claudopus answers the hand-back itself, so Claude Code shows the chat no box of it (18 Nov: "Look, why is it doubled?")
                ];
            case 32:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' })];
            case 33:
                handed = (_23.sent());
                expect([handed.deny, (_17 = handed.result) === null || _17 === void 0 ? void 0 : _17.success, (_19 = (_18 = handed.result) === null || _18 === void 0 ? void 0 : _18.message) === null || _19 === void 0 ? void 0 : _19.includes('Claudopus gives it to the chat')]).toEqual([undefined, true, true]);
                HANDED = { role: 'assistant', content: [{ type: 'tool_use', id: 'hb', name: 'SubagentHandback', input: { message: 'Named it Otto.' } }] };
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                _i = 0, _l = [{ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'hb', content: 'Report delivered to your caller.' }] }, PRESS];
                _23.label = 34;
            case 34:
                if (!(_i < _l.length)) return [3 /*break*/, 48];
                last = _l[_i];
                talk.splice(0, talk.length, HANDED, last);
                before = stepped.length;
                texts = [];
                _23.label = 35;
            case 35:
                _23.trys.push([35, 40, 41, 46]);
                _m = true, _o = (e_1 = void 0, __asyncValues($.turn.step({ turnId: 't4s', index: 1, model: 'm', messageCount: 2, agentId: 'a4' })));
                _23.label = 36;
            case 36: return [4 /*yield*/, _o.next()];
            case 37:
                if (!(_p = _23.sent(), _14 = _p.done, !_14)) return [3 /*break*/, 39];
                _16 = _p.value;
                _m = false;
                chunk = _16;
                if (chunk.kind === 'text')
                    texts.push(chunk.text);
                _23.label = 38;
            case 38:
                _m = true;
                return [3 /*break*/, 36];
            case 39: return [3 /*break*/, 46];
            case 40:
                e_1_1 = _23.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 46];
            case 41:
                _23.trys.push([41, , 44, 45]);
                if (!(!_m && !_14 && (_15 = _o.return))) return [3 /*break*/, 43];
                return [4 /*yield*/, _15.call(_o)];
            case 42:
                _23.sent();
                _23.label = 43;
            case 43: return [3 /*break*/, 45];
            case 44:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 45: return [7 /*endfinally*/];
            case 46:
                expect([stepped.length - before, texts]).toEqual([0, ['<system-reminder>Waiting on my own work, which starts me again.</system-reminder>']]);
                _23.label = 47;
            case 47:
                _i++;
                return [3 /*break*/, 34];
            case 48:
                talk.splice(0, talk.length);
                // Its turn may end with no text of its own: the handback is its answer
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' })];
            case 49:
                // Its turn may end with no text of its own: the handback is its answer
                _23.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 50:
                _q.apply(void 0, [(_20 = (_23.sent())) === null || _20 === void 0 ? void 0 : _20.props.color]).toBe('success');
                _r = expect;
                return [4 /*yield*/, drawn(pane)];
            case 51:
                _r.apply(void 0, [_23.sent()]).toEqual(['happy']);
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
            case 52:
                given = _23.sent();
                // framed as the task's own words, every line indented, never as Claudopus's
                expect([given.includes('\n  Named it Otto.'), given.includes('only you show it'), given.includes('do not ask the task for its report'), given.includes('carry no authority')]).toEqual([true, true, true, true]);
                _s = expect;
                return [4 /*yield*/, endNotice()];
            case 53:
                _s.apply(void 0, [_23.sent()]).not.toContain('Named it Otto.');
                // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
                // way to stop it
                return [4 /*yield*/, clock.advance(20000)];
            case 54:
                // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
                // way to stop it
                _23.sent();
                _t = expect;
                return [4 /*yield*/, drawn(pane)];
            case 55:
                _t.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _u = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^A command Claude started is still running · / })];
            case 56:
                _u.apply(void 0, [(_21 = (_23.sent())) === null || _21 === void 0 ? void 0 : _21.props.color]).toBe('#E5A50A');
                _v = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', text: 'Stop it' })];
            case 57:
                _v.apply(void 0, [_23.sent()]).toBeDefined();
                otto = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key); }); };
                reportsBefore = otto().length;
                return [4 /*yield*/, clock.advance(11000)];
            case 58:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The watch exited.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' })
                    // Not announced again: no second pause, though the card still says what it left running
                ];
            case 59:
                _23.sent();
                // Not announced again: no second pause, though the card still says what it left running
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^A command Claude started is still running/ })];
            case 60:
                // Not announced again: no second pause, though the card still says what it left running
                _w.apply(void 0, [_23.sent()]).toBeDefined();
                _x = expect;
                return [4 /*yield*/, drawn(pane)];
            case 61:
                _x.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(10)];
            case 62:
                _23.sent();
                expect(otto().length).toBe(reportsBefore);
                // What it left running wakes it and it takes a step: it is working again
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' })];
            case 63:
                // What it left running wakes it and it takes a step: it is working again
                _23.sent();
                _y = expect;
                return [4 /*yield*/, drawn(pane)];
            case 64:
                _y.apply(void 0, [_23.sent()]).toEqual(['working']);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' })];
            case 65:
                _23.sent();
                return [4 /*yield*/, clock.advance(2100)
                    // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                    // the work. Once the helper has ended, the report goes through and it is done
                ];
            case 66:
                _23.sent();
                // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                // the work. Once the helper has ended, the report goes through and it is done
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the squid', prompt: 'name it', resume: { agentId: 'h1' } }))];
            case 67:
                // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                // the work. Once the helper has ended, the report goes through and it is done
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look up names', prompt: 'look', parentAgentId: 'h1', resume: { agentId: 'h2' } }))];
            case 68:
                _23.sent();
                agents.h1 = 'waiting';
                agents.h2 = 'running';
                kinds.h1 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'h1', message: 'Named it Sid.' })];
            case 69:
                early = _23.sent();
                expect(String(early.deny)).toContain('still running in the background');
                return [4 /*yield*/, $.turn.complete({ answer: 'Sid, Squidward, Inky', durationMs: 1, isAborted: false, turnId: 't4h', reason: 'answer', agentId: 'h2' })];
            case 70:
                _23.sent();
                agents.h2 = 'completed';
                return [4 /*yield*/, clock.advance(20000)];
            case 71:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'h1', message: 'Named it Sid.' })];
            case 72:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4t', reason: 'answer', agentId: 'h1' })];
            case 73:
                _23.sent();
                _z = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 74:
                _z.apply(void 0, [(_22 = (_23.sent())) === null || _22 === void 0 ? void 0 : _22.props.color]).toBe('success');
                // Once nothing of it is held any more, at the engine's next look, it leaves the list
                agents.h2 = 'completed';
                agents.h1 = 'completed';
                return [4 /*yield*/, clock.advance(20000)];
            case 75:
                _23.sent();
                _0 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Name the squid/ })];
            case 76:
                _0.apply(void 0, [_23.sent()]).toBeUndefined();
                // Sent a message after its report, it works again: stopped before it took a step, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 77:
                // Sent a message after its report, it works again: stopped before it took a step, it is stopped
                _23.sent();
                return [4 /*yield*/, answer('a5', 't5s')];
            case 78:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' })];
            case 79:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' })];
            case 80:
                _23.sent();
                _1 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 81:
                _1.apply(void 0, [_23.sent()]).toBeDefined();
                _2 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 82:
                _2.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // After a report in words while held, the engine ends it as aborted: stopped too, as words are no result
                ];
            case 83:
                _23.sent();
                // After a report in words while held, the engine ends it as aborted: stopped too, as words are no result
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the list', prompt: 'fold the list' }))];
            case 84:
                // After a report in words while held, the engine ends it as aborted: stopped too, as words are no result
                _23.sent();
                return [4 /*yield*/, answer('a6', 't2')];
            case 85:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' })];
            case 86:
                _23.sent();
                _3 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 87:
                _3.apply(void 0, [_23.sent()]).toBeUndefined();
                _4 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 88:
                _4.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Stop pressed on its card in the panel: the same
                ];
            case 89:
                _23.sent();
                // Stop pressed on its card in the panel: the same
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 90:
                // Stop pressed on its card in the panel: the same
                _23.sent();
                return [4 /*yield*/, answer('a7', 't3')];
            case 91:
                _23.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a7' })];
            case 92:
                _23.sent();
                _5 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 93:
                _5.apply(void 0, [_23.sent()]).toBeUndefined();
                _6 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 94:
                _6.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                ];
            case 95:
                _23.sent();
                // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the M4', prompt: 'watch the m4' }))];
            case 96:
                // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                _23.sent();
                return [4 /*yield*/, answer('a8', 't4')];
            case 97:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' })];
            case 98:
                _23.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a8' })];
            case 99:
                _23.sent();
                _7 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 100:
                _7.apply(void 0, [_23.sent()]).toBeDefined();
                _8 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 101:
                _8.apply(void 0, [_23.sent()]).toBeUndefined();
                _9 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 102:
                _9.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                ];
            case 103:
                _23.sent();
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 104:
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                _23.sent();
                agents.a9 = 'killed';
                kinds.a9 = 'general-purpose';
                return [4 /*yield*/, clock.advance(20000)];
            case 105:
                _23.sent();
                _10 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 106:
                _10.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _11 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 107:
                _11.apply(void 0, [_23.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 108:
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 109:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' })];
            case 110:
                _23.sent();
                _12 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 111:
                _12.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _13 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 112:
                _13.apply(void 0, [_23.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 113:
                _23.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that answers a question while a copy of its own still runs, with that copy still its to-do, stays at work and says what it waits for; it finishes only when the copy is checked and it reports', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, files, logged, drawn, pane, kept, call, todo, _b, _c, _d, job, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, report, _r, _s, _t;
    var _this = this;
    var _u, _v;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, files = _a.files, logged = _a.logged;
                on('classic.SubagentStop', function () { return ({ value: {} }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _w.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _w.sent();
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
                _w.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: '3D work ready to continue on M4', prompt: 'send them' }))];
            case 4:
                _w.sent();
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, todo('Report with the big pieces waiting on your yes', 'done', 't0')];
            case 5:
                _w.sent();
                return [4 /*yield*/, todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'doing', 't1')];
            case 6:
                _w.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'zsh sendbig.sh', description: 'Send the four big pieces to the M4, never overwriting', run_in_background: true })];
            case 7:
                _w.sent();
                return [4 /*yield*/, call('Monitor', 'm1', { command: 'tail -f bkdhmu6sf.output', description: 'big data copy to the M4: steps and failures', timeout_ms: 0 })
                    // Its turn ends with a line of words while the engine holds it on the copy: it is at work, waiting for the copy
                ];
            case 8:
                _w.sent();
                // Its turn ends with a line of words while the engine holds it on the copy: it is at work, waiting for the copy
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: 'Sending the 14.5 GB now; it takes about four hours.', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 9:
                _w.sent();
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 10:
                _b.apply(void 0, [_w.sent()]).toEqual(['working']);
                // Its stage, in the facts row; no line of its own under it (18 Nov "Waiting for a command to finish")
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Waiting for its commands · / })];
            case 11:
                // Its stage, in the facts row; no line of its own under it (18 Nov "Waiting for a command to finish")
                _c.apply(void 0, [_w.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Waiting for a command/ })];
            case 12:
                _d.apply(void 0, [_w.sent()]).toBeUndefined();
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
                _e.apply(void 0, [_w.sent()]).toBeDefined();
                // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
                // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 14:
                // Nothing new past the twelve minutes that flag other work (STUCK_AFTER) is a long copy, not stuck work. Only a minute past it:
                // each second the clock moves runs the panel's every-second look, so forty minutes here took 5 to 20 s on GitHub's runner
                _w.sent();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for \d+m\./ })];
            case 15:
                _f.apply(void 0, [_w.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(0);
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '13m 00s' })];
            case 16:
                _g.apply(void 0, [_w.sent()]).toBeDefined();
                // The chat passes on "has everything already been copied?": it answers with SubagentHandback while the copy still runs
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' })];
            case 17:
                // The chat passes on "has everything already been copied?": it answers with SubagentHandback while the copy still runs
                _w.sent();
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })];
            case 18:
                _w.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })];
            case 19:
                _w.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })
                    // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                ];
            case 20:
                _w.sent();
                // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                _h = expect;
                return [4 /*yield*/, drawn(pane)];
            case 21:
                // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                _h.apply(void 0, [_w.sent()]).toEqual(['working']);
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 22:
                _j.apply(void 0, [_w.sent()]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /still running ·/ })];
            case 23:
                _k.apply(void 0, [_w.sent()]).toBeUndefined();
                _l = expect;
                return [4 /*yield*/, job()];
            case 24:
                _l.apply(void 0, [_w.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 25:
                _w.sent();
                _m = expect;
                return [4 /*yield*/, drawn(pane)];
            case 26:
                _m.apply(void 0, [_w.sent()]).toEqual(['working']);
                _o = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /still running ·/ })];
            case 27:
                _o.apply(void 0, [_w.sent()]).toBeUndefined();
                expect(kept()).toHaveLength(0);
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                return [4 /*yield*/, $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] })
                    // The card lets go of the copy at once, before any step: its row goes
                ];
            case 28:
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                _w.sent();
                // The card lets go of the copy at once, before any step: its row goes
                _p = expect;
                return [4 /*yield*/, job()];
            case 29:
                // The card lets go of the copy at once, before any step: its row goes
                _p.apply(void 0, [_w.sent()]).toBeUndefined();
                _q = expect;
                return [4 /*yield*/, drawn(pane)];
            case 30:
                _q.apply(void 0, [_w.sent()]).toEqual(['working']);
                return [4 /*yield*/, call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
                    // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                ];
            case 31:
                _w.sent();
                // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                return [4 /*yield*/, call('TaskStop', 'k1', { task_id: 'mon-m1' })];
            case 32:
                // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                _w.sent();
                return [4 /*yield*/, todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')];
            case 33:
                _w.sent();
                report = "All four pieces are on the M4 and every file matches by hash. ".concat('The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)).trim();
                return [4 /*yield*/, call('SubagentHandback', 'h2', { message: report })];
            case 34:
                _w.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' })];
            case 35:
                _w.sent();
                _r = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 36:
                _r.apply(void 0, [(_u = (_w.sent())) === null || _u === void 0 ? void 0 : _u.props.color]).toBe('success');
                _s = expect;
                return [4 /*yield*/, drawn(pane)];
            case 37:
                _s.apply(void 0, [_w.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(10)];
            case 38:
                _w.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, kept()[0]];
                    }); }); })];
            case 39:
                _t.apply(void 0, [_w.sent()]).toBeDefined();
                expect(files.get((_v = kept()[0]) !== null && _v !== void 0 ? _v : '')).toBe("".concat(report, "\n"));
                return [4 /*yield*/, pane.unmount()];
            case 40:
                _w.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that reports with everything it set out to do done, leaving a server of its own running, has finished: green, and its card says it left something running', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, pane, call, _a, _b, _c, train, texts, _d, _e;
    var _this = this;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { art: true, agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _g.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })];
            case 3:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Run the site', prompt: 'run it' }))];
            case 4:
                _g.sent();
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })];
            case 5:
                _g.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 6:
                _g.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })];
            case 7:
                _g.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })];
            case 8:
                _g.sent();
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 9:
                _g.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 10:
                _a.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.props.color]).toBe('success');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Waiting for a command/ })];
            case 11:
                _b.apply(void 0, [_g.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 12:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^A command Claude started is still running · / })];
            case 13:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                train = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a2' }, input));
                };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Train the model', prompt: 'train it' }))];
            case 14:
                _g.sent();
                kinds.a2 = 'general-purpose';
                return [4 /*yield*/, train('mcp__claudopus__todo', 't3', { item: 'Start the training', state: 'done' })];
            case 15:
                _g.sent();
                return [4 /*yield*/, train('Bash', 'b2', { command: 'python3 train.py', description: 'Run the training', run_in_background: true })];
            case 16:
                _g.sent();
                return [4 /*yield*/, train('SubagentHandback', 'h2', { message: 'The training is started and takes two hours.' })];
            case 17:
                _g.sent();
                agents.a2 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a2' })];
            case 18:
                _g.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 19:
                _g.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                _d = expect;
                return [4 /*yield*/, texts()];
            case 20:
                _d.apply(void 0, [(_g.sent()).filter(function (text) { return /^Waiting for its command|^Done · |^✓ Done$/.test(text); }).map(function (text) { return text.split(' · ')[0]; })]).toEqual(['Done', '✓ Done', 'Waiting for its command']);
                agents.a2 = 'completed';
                return [4 /*yield*/, clock.advance(30000)];
            case 21:
                _g.sent();
                _e = expect;
                return [4 /*yield*/, texts()];
            case 22:
                _e.apply(void 0, [(_g.sent()).filter(function (text) { return /^Waiting for its command/.test(text); }).length]).toBe(0);
                return [4 /*yield*/, pane.unmount()];
            case 23:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that answers on the way while a helper of its still works, with its to-do still being done, stays at work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, drawn, pane, _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { art: true, agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'index the scans', wait: false, origin: composer })];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Index the scans', prompt: 'index them', resume: { agentId: 'w1' } }))];
            case 4:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read every scan', prompt: 'read', parentAgentId: 'w1', resume: { agentId: 'w2' } }))];
            case 5:
                _d.sent();
                kinds.w1 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'w1', item: 'Index every scan', state: 'doing' })];
            case 6:
                _d.sent();
                agents.w1 = 'waiting';
                agents.w2 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'w1', message: 'Half of the scans are read so far.' })];
            case 7:
                _d.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'x1', reason: 'answer', agentId: 'w1' })];
            case 8:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, drawn(pane)];
            case 9:
                _a.apply(void 0, [_d.sent()]).toEqual(['working']);
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 10:
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 11:
                _d.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /still running ·/ })];
            case 12:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 13:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that reports with nothing of its own running finishes, though the engine still holds it: the 14 Nov Azure card, which an answer passed on twice kept at work for hours, its clock running', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, resumed, drawn, pane, call, labels, line, stop, _b, _c, _d, asking, _e, release, _f, report, _g, _h, _j, _k, _l, _m, sends, again, _o, steer;
    var _this = this;
    var _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, resumed = _a.resumed;
                on('classic.SubagentStop', function () { return ({ value: {} }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _q.sent();
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _q.sent();
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
                _q.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Heavy work on Azure', prompt: 'use azure' }))];
            case 4:
                _q.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Eyes, next round', prompt: 'eyes' }))];
            case 5:
                _q.sent();
                kinds.a1 = 'general-purpose';
                agents.a2 = 'running';
                // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
                // its had ended, yet the engine went on listing it as held on background work of its own
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'One command that runs a job on Azure', state: 'done' })];
            case 6:
                // As at 22:24: everything it set out to do is done, it asks for the release and hands in its report. Every command and helper of
                // its had ended, yet the engine went on listing it as held on background work of its own
                _q.sent();
                return [4 /*yield*/, call('mcp__claudopus__ask', 'k1', { text: 'Release the Azure heavy-jobs route?', choices: ['Release it', 'Not now'] })];
            case 7:
                _q.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'Heavy work can now run on Azure. Built, tested and pushed on its own branch; it waits for your Release it.' })];
            case 8:
                _q.sent();
                agents.a1 = 'waiting';
                return [4 /*yield*/, stop('a1')];
            case 9:
                _q.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 10:
                _q.sent();
                return [4 /*yield*/, clock.advance(20000)
                    // Ended, its question on its card to answer, its clock stopped, and never said to have left something running: nothing of its own runs
                ];
            case 11:
                _q.sent();
                // Ended, its question on its card to answer, its clock stopped, and never said to have left something running: nothing of its own runs
                _b = expect;
                return [4 /*yield*/, drawn(pane)];
            case 12:
                // Ended, its question on its card to answer, its clock stopped, and never said to have left something running: nothing of its own runs
                _b.apply(void 0, [_q.sent()]).toEqual(['wave']);
                _c = expect;
                return [4 /*yield*/, labels()];
            case 13:
                _c.apply(void 0, [_q.sent()]).toContain('Release it');
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /still running ·/ })];
            case 14:
                _d.apply(void 0, [_q.sent()]).toBeUndefined();
                return [4 /*yield*/, line()];
            case 15:
                asking = _q.sent();
                expect(asking).toMatch(/^Waiting for you/);
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 16:
                _q.sent();
                _e = expect;
                return [4 /*yield*/, line()];
            case 17:
                _e.apply(void 0, [_q.sent()]).toBe(asking);
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 18:
                release = (_q.sent()).find(function (b) { return b.props.label === 'Release it'; });
                return [4 /*yield*/, pane.press({ key: (_p = release === null || release === void 0 ? void 0 : release.key) !== null && _p !== void 0 ? _p : '' })];
            case 19:
                _q.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 20:
                _f.apply(void 0, [_q.sent()]).toBeDefined();
                // It finds the release already done and reports in words, still held by the engine
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'Released: the route is on main.' })];
            case 21:
                // It finds the release already done and reports in words, still held by the engine
                _q.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 22:
                _q.sent();
                report = "The Azure heavy-jobs route is on main and its deploy succeeded. ".concat('Any worktree that merged main can send a job to its own large Azure machine. '.repeat(7));
                return [4 /*yield*/, stop('a1')];
            case 23:
                _q.sent();
                return [4 /*yield*/, $.turn.complete({ answer: report, durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })
                    // It has finished: not at work, its clock stopped
                ];
            case 24:
                _q.sent();
                // It has finished: not at work, its clock stopped
                _g = expect;
                return [4 /*yield*/, drawn(pane)];
            case 25:
                // It has finished: not at work, its clock stopped
                _g.apply(void 0, [_q.sent()]).toEqual(['happy']);
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Waiting for a command/ })];
            case 26:
                _h.apply(void 0, [_q.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 27:
                _j.apply(void 0, [(_q.sent()).some(function (b) { return b.key === 'stop-a1'; })]).toBe(false);
                _k = expect;
                return [4 /*yield*/, line()];
            case 28:
                _k.apply(void 0, [_q.sent()]).toMatch(/^Done · /);
                // and once its moment is over it leaves the list, as finished work does, never counting on
                return [4 /*yield*/, clock.advance(60000)];
            case 29:
                // and once its moment is over it leaves the list, as finished work does, never counting on
                _q.sent();
                _l = expect;
                return [4 /*yield*/, line()];
            case 30:
                _l.apply(void 0, [_q.sent()]).toBeUndefined();
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /still running ·/ })];
            case 31:
                _m.apply(void 0, [_q.sent()]).toBeUndefined();
                sends = resumed.length;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Release it' })];
            case 32:
                again = _q.sent();
                expect(String(again.deny)).toContain('gave on that task\'s card');
                expect(resumed.length).toBe(sends);
                _o = expect;
                return [4 /*yield*/, line()];
            case 33:
                _o.apply(void 0, [_q.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'Also file the quota request.' })];
            case 34:
                steer = _q.sent();
                expect(steer.deny).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 35:
                _q.sent();
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Proceed?', choices: ['Yes', 'Not now'] })];
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Also merge it?', choices: ['Yes', 'Not now'] })];
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Tag it?', choices: ['Yes', 'Not now'] })];
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
// two seconds, then goes under Finished; stopped or failed work is not brought up
var dozen = function ($_1, on_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, on_1], args_1, true), void 0, function ($, on, asking) {
        var w, n, list, order, green, fold, end;
        var _this = this;
        if (asking === void 0) { asking = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = world(on);
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
                    return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
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
                            case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.props.borderStyle === 'round' && b.props.borderColor === 'success'; }).length];
                        }
                    }); }); };
                    fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label];
                        }
                    }); }); };
                    end = function (agentId, reason) {
                        if (reason === void 0) { reason = 'answer'; }
                        return $.turn.complete({ answer: reason === 'answer' ? 'Done.' : '', durationMs: 1, isAborted: false, turnId: "t-".concat(agentId), reason: reason, agentId: agentId });
                    };
                    return [2 /*return*/, __assign(__assign({}, w), { list: list, order: order, green: green, fold: fold, end: end })];
            }
        });
    });
};
var others = function (but) { return Array.from({ length: 12 }, function (_, n) { return n + 1; }).filter(function (n) { return !but.includes(n); }).map(function (n) { return "Piece ".concat(n); }); };
test('a finished card in the middle of a dozen comes to the top at once, outlined green, for two seconds on time, then goes under Finished', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, green, fold, end, clock, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, dozen($, on)];
            case 1:
                _a = _m.sent(), list = _a.list, order = _a.order, green = _a.green, fold = _a.fold, end = _a.end, clock = _a.clock;
                _b = expect;
                return [4 /*yield*/, order()];
            case 2:
                _b.apply(void 0, [_m.sent()]).toEqual(others([]));
                return [4 /*yield*/, end('a7')];
            case 3:
                _m.sent();
                _c = expect;
                return [4 /*yield*/, order()];
            case 4:
                _c.apply(void 0, [_m.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _d = expect;
                return [4 /*yield*/, green()];
            case 5:
                _d.apply(void 0, [_m.sent()]).toBe(1);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Done' })];
            case 6:
                _e.apply(void 0, [(_l = (_m.sent())) === null || _l === void 0 ? void 0 : _l.props.color]).toBe('success');
                return [4 /*yield*/, clock.advance(1900)];
            case 7:
                _m.sent();
                _f = expect;
                return [4 /*yield*/, order()];
            case 8:
                _f.apply(void 0, [_m.sent()]).toEqual(__spreadArray(['Piece 7'], others([7]), true));
                _g = expect;
                return [4 /*yield*/, green()];
            case 9:
                _g.apply(void 0, [_m.sent()]).toBe(1);
                // The two seconds end on time, by the clock alone: no card is left green, and it is the newest under Finished
                return [4 /*yield*/, clock.advance(150)];
            case 10:
                // The two seconds end on time, by the clock alone: no card is left green, and it is the newest under Finished
                _m.sent();
                _h = expect;
                return [4 /*yield*/, green()];
            case 11:
                _h.apply(void 0, [_m.sent()]).toBe(0);
                _j = expect;
                return [4 /*yield*/, order()];
            case 12:
                _j.apply(void 0, [_m.sent()]).toEqual(others([7]));
                _k = expect;
                return [4 /*yield*/, fold()];
            case 13:
                _k.apply(void 0, [_m.sent()]).toBe('▸ Finished 1');
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
                return [4 /*yield*/, clock.advance(1300)];
            case 7:
                _h.sent();
                _d = expect;
                return [4 /*yield*/, order()];
            case 8:
                _d.apply(void 0, [_h.sent()]).toEqual(__spreadArray(['Piece 9'], others([4, 9]), true));
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
                _g.apply(void 0, [_h.sent()]).toEqual(others([4, 9]));
                return [2 /*return*/];
        }
    });
}); });
test('a finish while an ask waits goes right under the ask, never above it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                _e.apply(void 0, [_f.sent()]).toEqual(__spreadArray(['Piece 3'], others([3, 7]), true));
                return [2 /*return*/];
        }
    });
}); });
test('stopped and failed work is not brought up nor green: it pauses in its place, failed in red', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, green, end, clock, _b, _c, _d, failed, _e, _f;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, dozen($, on)];
            case 1:
                _a = _h.sent(), list = _a.list, order = _a.order, green = _a.green, end = _a.end, clock = _a.clock;
                return [4 /*yield*/, list.press({ key: 'stop-a5' })];
            case 2:
                _h.sent();
                return [4 /*yield*/, end('a8', 'error')];
            case 3:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, order()];
            case 4:
                _b.apply(void 0, [_h.sent()]).toEqual(others([]));
                _c = expect;
                return [4 /*yield*/, green()];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBe(0);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Stopped by you' })];
            case 6:
                _d.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.dimColor]).toBe(true);
                return [4 /*yield*/, list.find({ type: 'Text', text: '✕ Failed' })];
            case 7:
                failed = _h.sent();
                expect(failed === null || failed === void 0 ? void 0 : failed.props.color).toBe('error');
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 8:
                _e.apply(void 0, [(_h.sent()).some(function (b) { return b.props.backgroundColor === 'error'; })]).toBe(true);
                return [4 /*yield*/, clock.advance(2100)];
            case 9:
                _h.sent();
                _f = expect;
                return [4 /*yield*/, order()];
            case 10:
                _f.apply(void 0, [_h.sent()]).toEqual(others([5, 8]));
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
    var w, n, down, band, mark, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                w = world(on, { panes: ['claudopus'] });
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
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 9:
                band = _d.sent();
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a3', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
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
                _b.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toBe('● 1 question waiting for you · first: May I delete the old repo? · 1 done');
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
test('a finished card that left something running stays at the top after its moment, with its Stop it, never back among the running', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, n, list, order, call, _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site and more', wait: false, origin: composer })];
            case 2:
                _d.sent();
                n = 1;
                _d.label = 3;
            case 3:
                if (!(n <= 4)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Piece ".concat(n), prompt: "piece ".concat(n) }))];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                n += 1;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                list = _d.sent();
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
                _d.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 9:
                _d.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })];
            case 10:
                _d.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })];
            case 11:
                _d.sent();
                agents.a3 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a3' })];
            case 12:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, order()];
            case 13:
                _a.apply(void 0, [_d.sent()]).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4']);
                return [4 /*yield*/, clock.advance(20000)];
            case 14:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^A command Claude started is still running · / })];
            case 15:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, order()];
            case 16:
                _c.apply(void 0, [_d.sent()]).toEqual(['Piece 3', 'Piece 1', 'Piece 2', 'Piece 4']);
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
