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
test('the octopus turns happy and green when work finishes, for its pause, then goes back to work or to rest; stopped work, a closed panel and a reload leave none behind', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                return [4 /*yield*/, again.find({ type: 'Text', text: '✓ Finished' })];
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
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Finished' })];
            case 74:
                _6.apply(void 0, [(_10 = (_11.sent())) === null || _10 === void 0 ? void 0 : _10.props.color]).toBe('success');
                return [4 /*yield*/, clock.advance(2100)];
            case 75:
                _11.sent();
                _7 = expect;
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Finished' })];
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
                return [4 /*yield*/, after.find({ type: 'Text', text: '✓ Finished' })];
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
test('work that answered while only its own background work held it, then stopped by the chat, the panel or the engine, finished: green and happy for its pause; work stopped before it answered is not', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, files, drawn, pane, report, answer, _b, kept, _c, _d, _e, _f, _g, _h, _j, n, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, otto, reportsBefore, _v, _w, _x, early, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    var _this = this;
    var _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
    return __generator(this, function (_23) {
        switch (_23.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { art: true, agents: agents, kinds: kinds }), clock = _a.clock, files = _a.files;
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
                // The chat stops it with TaskStop once its report is in: it ends at once, green and happy, and its report is kept then, once
                return [4 /*yield*/, $.prompt.submit({ text: 'remove the hover', wait: false, origin: composer })];
            case 3:
                // The chat stops it with TaskStop once its report is in: it ends at once, green and happy, and its report is kept then, once
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
                return [4 /*yield*/, clock.advance(10)];
            case 8:
                _23.sent();
                expect(kept()).toHaveLength(0);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 9:
                _23.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 10:
                _c.apply(void 0, [(_13 = (_23.sent())) === null || _13 === void 0 ? void 0 : _13.props.color]).toBe('success');
                _d = expect;
                return [4 /*yield*/, drawn(pane)];
            case 11:
                _d.apply(void 0, [_23.sent()]).toEqual(['happy']);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Just finished$/ })];
            case 12:
                _e.apply(void 0, [(_14 = (_23.sent())) === null || _14 === void 0 ? void 0 : _14.text]).toBe('Just finished');
                return [4 /*yield*/, clock.advance(10)];
            case 13:
                _23.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, kept()[0]];
                    }); }); })];
            case 14:
                _f.apply(void 0, [_23.sent()]).toBeDefined();
                expect(files.get((_15 = kept()[0]) !== null && _15 !== void 0 ? _15 : '')).toBe("".concat(report.trim(), "\n"));
                // The aborted turn that follows the stop changes nothing: its pause is not begun again, and its words are no report
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                // The aborted turn that follows the stop changes nothing: its pause is not begun again, and its words are no report
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Partial words', durationMs: 1, isAborted: true, turnId: 't1x', reason: 'answer', agentId: 'a1' })];
            case 16:
                _23.sent();
                return [4 /*yield*/, clock.advance(1100)];
            case 17:
                _23.sent();
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 18:
                _g.apply(void 0, [_23.sent()]).toBeUndefined();
                expect(files.get((_16 = kept()[0]) !== null && _16 !== void 0 ? _16 : '')).toBe("".concat(report.trim(), "\n"));
                return [4 /*yield*/, clock.advance(2100)];
            case 19:
                _23.sent();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Remove the hover/ })];
            case 20:
                _h.apply(void 0, [_23.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, drawn(pane)];
            case 21:
                _j.apply(void 0, [_23.sent()]).toEqual(['mark']);
                // The engine's next look lists it killed: nothing changes, and no second report
                agents.a1 = 'killed';
                return [4 /*yield*/, clock.advance(20000)];
            case 22:
                _23.sent();
                expect(kept()).toHaveLength(1);
                // Stopped some other way, the engine lists it killed at its next look: the same green moment from then
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the idle chats', prompt: 'fold them' }))];
            case 23:
                // Stopped some other way, the engine lists it killed at its next look: the same green moment from then
                _23.sent();
                return [4 /*yield*/, answer('a2', 't1b')];
            case 24:
                _23.sent();
                agents.a2 = 'killed';
                n = 0;
                _23.label = 25;
            case 25:
                _k = n < 25;
                if (!_k) return [3 /*break*/, 27];
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 26:
                _k = !(_23.sent());
                _23.label = 27;
            case 27:
                if (!_k) return [3 /*break*/, 30];
                return [4 /*yield*/, clock.advance(1000)];
            case 28:
                _23.sent();
                _23.label = 29;
            case 29:
                n += 1;
                return [3 /*break*/, 25];
            case 30:
                _l = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 31:
                _l.apply(void 0, [(_17 = (_23.sent())) === null || _17 === void 0 ? void 0 : _17.props.color]).toBe('success');
                _m = expect;
                return [4 /*yield*/, drawn(pane)];
            case 32:
                _m.apply(void 0, [_23.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(2100)
                    // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                ];
            case 33:
                _23.sent();
                // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Build the app', prompt: 'build it' }))];
            case 34:
                // Held after only a short line ("started it in the background"), it has not finished: stopped, it is stopped
                _23.sent();
                agents.a3 = 'waiting';
                kinds.a3 = 'general-purpose';
                return [4 /*yield*/, $.turn.complete({ answer: 'The build is running in the background; I will report when it exits.', durationMs: 1, isAborted: false, turnId: 't3s', reason: 'answer', agentId: 'a3' })];
            case 35:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's3', task_id: 'a3' })];
            case 36:
                _23.sent();
                _o = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 37:
                _o.apply(void 0, [_23.sent()]).toBeDefined();
                _p = expect;
                return [4 /*yield*/, drawn(pane)];
            case 38:
                _p.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                    // background goes on, unstopped, and the chat need not stop it
                ];
            case 39:
                _23.sent();
                // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                // background goes on, unstopped, and the chat need not stop it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the octopus', prompt: 'name it' }))];
            case 40:
                // A report given with SubagentHandback ends the work's run: its card ends done at once, though what it left running in the
                // background goes on, unstopped, and the chat need not stop it
                _23.sent();
                agents.a4 = 'waiting';
                kinds.a4 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'w4', agentId: 'a4', command: 'tail -f names.log', description: 'watch the names', timeout_ms: 0 })];
            case 41:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a4', message: 'Named it Otto.' })
                    // Its turn may end with no text of its own: the handback is its answer
                ];
            case 42:
                _23.sent();
                // Its turn may end with no text of its own: the handback is its answer
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4s', reason: 'answer', agentId: 'a4' })];
            case 43:
                // Its turn may end with no text of its own: the handback is its answer
                _23.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 44:
                _q.apply(void 0, [(_18 = (_23.sent())) === null || _18 === void 0 ? void 0 : _18.props.color]).toBe('success');
                _r = expect;
                return [4 /*yield*/, drawn(pane)];
            case 45:
                _r.apply(void 0, [_23.sent()]).toEqual(['happy']);
                // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
                // way to stop it
                return [4 /*yield*/, clock.advance(20000)];
            case 46:
                // The engine's next looks still list it held: its card stays done, and stays in the list saying it left something running, with a
                // way to stop it
                _23.sent();
                _s = expect;
                return [4 /*yield*/, drawn(pane)];
            case 47:
                _s.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _t = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^It left something running in the background, / })];
            case 48:
                _t.apply(void 0, [(_19 = (_23.sent())) === null || _19 === void 0 ? void 0 : _19.props.color]).toBe('#E5A50A');
                _u = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', text: 'Stop it' })];
            case 49:
                _u.apply(void 0, [_23.sent()]).toBeDefined();
                otto = function () { return __spreadArray([], files.keys(), true).filter(function (key) { return /\/reports\/[^/]+-name-the-octopus\/report\.md$/.test(key); }); };
                reportsBefore = otto().length;
                return [4 /*yield*/, clock.advance(11000)];
            case 50:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The watch exited.', durationMs: 1, isAborted: false, turnId: 't4w', reason: 'answer', agentId: 'a4' })
                    // Not announced again: no second pause, though the card still says what it left running
                ];
            case 51:
                _23.sent();
                // Not announced again: no second pause, though the card still says what it left running
                _v = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^It left something running/ })];
            case 52:
                // Not announced again: no second pause, though the card still says what it left running
                _v.apply(void 0, [_23.sent()]).toBeDefined();
                _w = expect;
                return [4 /*yield*/, drawn(pane)];
            case 53:
                _w.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(10)];
            case 54:
                _23.sent();
                expect(otto().length).toBe(reportsBefore);
                // What it left running wakes it and it takes a step: it is working again
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4w', agentId: 'a4', command: 'ls' })];
            case 55:
                // What it left running wakes it and it takes a step: it is working again
                _23.sent();
                _x = expect;
                return [4 /*yield*/, drawn(pane)];
            case 56:
                _x.apply(void 0, [_23.sent()]).toEqual(['working']);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's4', task_id: 'a4' })];
            case 57:
                _23.sent();
                return [4 /*yield*/, clock.advance(2100)
                    // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                    // the work. Once the helper has ended, the report goes through and it is done
                ];
            case 58:
                _23.sent();
                // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                // the work. Once the helper has ended, the report goes through and it is done
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Name the squid', prompt: 'name it', resume: { agentId: 'h1' } }))];
            case 59:
                // A report handed back while a helper of its own is still at work is refused: the helper's result would reach the chat, not
                // the work. Once the helper has ended, the report goes through and it is done
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look up names', prompt: 'look', parentAgentId: 'h1', resume: { agentId: 'h2' } }))];
            case 60:
                _23.sent();
                agents.h1 = 'waiting';
                agents.h2 = 'running';
                kinds.h1 = 'general-purpose';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'h1', message: 'Named it Sid.' })];
            case 61:
                early = _23.sent();
                expect(String(early.deny)).toContain('still running in the background');
                return [4 /*yield*/, $.turn.complete({ answer: 'Sid, Squidward, Inky', durationMs: 1, isAborted: false, turnId: 't4h', reason: 'answer', agentId: 'h2' })];
            case 62:
                _23.sent();
                agents.h2 = 'completed';
                return [4 /*yield*/, clock.advance(20000)];
            case 63:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'h1', message: 'Named it Sid.' })];
            case 64:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't4t', reason: 'answer', agentId: 'h1' })];
            case 65:
                _23.sent();
                _y = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 66:
                _y.apply(void 0, [(_20 = (_23.sent())) === null || _20 === void 0 ? void 0 : _20.props.color]).toBe('success');
                // Once nothing of it is held any more, at the engine's next look, it leaves the list
                agents.h2 = 'completed';
                agents.h1 = 'completed';
                return [4 /*yield*/, clock.advance(20000)];
            case 67:
                _23.sent();
                _z = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Name the squid/ })];
            case 68:
                _z.apply(void 0, [_23.sent()]).toBeUndefined();
                // Sent a message after its report, it works again: stopped before it took a step, it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the ears', prompt: 'draw the ears' }))];
            case 69:
                // Sent a message after its report, it works again: stopped before it took a step, it is stopped
                _23.sent();
                return [4 /*yield*/, answer('a5', 't5s')];
            case 70:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a5', message: 'Sam: “Make them bigger.”' })];
            case 71:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's5', task_id: 'a5' })];
            case 72:
                _23.sent();
                _0 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 73:
                _0.apply(void 0, [_23.sent()]).toBeDefined();
                _1 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 74:
                _1.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // The engine ends it as aborted instead: the same
                ];
            case 75:
                _23.sent();
                // The engine ends it as aborted instead: the same
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fold the list', prompt: 'fold the list' }))];
            case 76:
                // The engine ends it as aborted instead: the same
                _23.sent();
                return [4 /*yield*/, answer('a6', 't2')];
            case 77:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't2b', reason: 'answer', agentId: 'a6' })];
            case 78:
                _23.sent();
                _2 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 79:
                _2.apply(void 0, [(_21 = (_23.sent())) === null || _21 === void 0 ? void 0 : _21.props.color]).toBe('success');
                _3 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 80:
                _3.apply(void 0, [_23.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(2100)
                    // Stop pressed on its card in the panel: the same
                ];
            case 81:
                _23.sent();
                // Stop pressed on its card in the panel: the same
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 82:
                // Stop pressed on its card in the panel: the same
                _23.sent();
                return [4 /*yield*/, answer('a7', 't3')];
            case 83:
                _23.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a7' })];
            case 84:
                _23.sent();
                _4 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 85:
                _4.apply(void 0, [(_22 = (_23.sent())) === null || _22 === void 0 ? void 0 : _22.props.color]).toBe('success');
                _5 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 86:
                _5.apply(void 0, [_23.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(2100)
                    // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                ];
            case 87:
                _23.sent();
                // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Watch the M4', prompt: 'watch the m4' }))];
            case 88:
                // Held work its watcher wakes takes a step again: from then it has not finished, and stopped it is stopped
                _23.sent();
                return [4 /*yield*/, answer('a8', 't4')];
            case 89:
                _23.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'a8', command: 'ls' })];
            case 90:
                _23.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a8' })];
            case 91:
                _23.sent();
                _6 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 92:
                _6.apply(void 0, [_23.sent()]).toBeDefined();
                _7 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 93:
                _7.apply(void 0, [_23.sent()]).toBeUndefined();
                _8 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 94:
                _8.apply(void 0, [_23.sent()]).toEqual(['mark']);
                return [4 /*yield*/, clock.advance(2100)
                    // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                ];
            case 95:
                _23.sent();
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the mouth', prompt: 'draw the mouth' }))];
            case 96:
                // Work stopped before it ever answered is stopped, by the engine as by the panel; work that failed is not happy either
                _23.sent();
                agents.a9 = 'killed';
                kinds.a9 = 'general-purpose';
                return [4 /*yield*/, clock.advance(20000)];
            case 97:
                _23.sent();
                _9 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 98:
                _9.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _10 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 99:
                _10.apply(void 0, [_23.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 100:
                _23.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the chin', prompt: 'draw the chin' }))];
            case 101:
                _23.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't6', reason: 'error', agentId: 'a10' })];
            case 102:
                _23.sent();
                _11 = expect;
                return [4 /*yield*/, drawn(pane)];
            case 103:
                _11.apply(void 0, [_23.sent()]).toEqual(['mark']);
                _12 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 104:
                _12.apply(void 0, [_23.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 105:
                _23.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that answers a question while a copy of its own still runs, with that copy still its to-do, stays at work and says what it waits for; it finishes only when the copy is checked and it reports', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, files, logged, drawn, pane, kept, call, todo, _b, wait, _c, job, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, report, _q, _r, _s;
    var _this = this;
    var _t, _u, _v;
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
                wait = function () { return pane.find({ type: 'Text', text: /^Still at work: it waits for its background command to finish/ }); };
                _c = expect;
                return [4 /*yield*/, wait()];
            case 11:
                _c.apply(void 0, [(_t = (_w.sent())) === null || _t === void 0 ? void 0 : _t.text]).toBe('Still at work: it waits for its background command to finish');
                job = function () { return pane.find({ type: 'Text', text: /^Command · Send the four/ }); };
                _d = expect;
                return [4 /*yield*/, job()];
            case 12:
                _d.apply(void 0, [_w.sent()]).toBeDefined();
                // Forty minutes with nothing new is a long copy, not stuck work
                return [4 /*yield*/, clock.advance(40 * 60000)];
            case 13:
                // Forty minutes with nothing new is a long copy, not stuck work
                _w.sent();
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing new for / })];
            case 14:
                _e.apply(void 0, [_w.sent()]).toBeUndefined();
                expect(logged.filter(function (line) { return line.includes('has had nothing new'); })).toHaveLength(0);
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '40m 00s' })];
            case 15:
                _f.apply(void 0, [_w.sent()]).toBeDefined();
                // The chat passes on "has everything already been copied?": it answers with SubagentHandback while the copy still runs
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Has everything already been copied?' })];
            case 16:
                // The chat passes on "has everything already been copied?": it answers with SubagentHandback while the copy still runs
                _w.sent();
                return [4 /*yield*/, call('mcp__claudopus__note', 'n1', { text: 'Not yet. 5.2 of the 6.3 GB of CT fits are there.' })];
            case 17:
                _w.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: "No, not yet. The copy keeps running on this Mac; I'll check each piece and report when it's done." })];
            case 18:
                _w.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w2', reason: 'answer', agentId: 'a1' })
                    // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                ];
            case 19:
                _w.sent();
                // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                _g = expect;
                return [4 /*yield*/, drawn(pane)];
            case 20:
                // Still at work: not green, not under Finished, not said to have left something running, and its answer is no result
                _g.apply(void 0, [_w.sent()]).toEqual(['working']);
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 21:
                _h.apply(void 0, [_w.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /left something running/ })];
            case 22:
                _j.apply(void 0, [_w.sent()]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, wait()];
            case 23:
                _k.apply(void 0, [_w.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 24:
                _w.sent();
                _l = expect;
                return [4 /*yield*/, drawn(pane)];
            case 25:
                _l.apply(void 0, [_w.sent()]).toEqual(['working']);
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /left something running/ })];
            case 26:
                _m.apply(void 0, [_w.sent()]).toBeUndefined();
                expect(kept()).toHaveLength(0);
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                return [4 /*yield*/, $.classic.SubagentStop({ agent_id: 'a1', agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [{ id: 'mon-m1', type: 'monitor', status: 'running', description: 'big data copy to the M4: steps and failures' }] })
                    // The card lets go of the copy at once, before any step: it no longer says it waits for it
                ];
            case 27:
                // The copy ends: the engine, as it stops, lists only the watch in flight, and the work's next step brings the card on
                _w.sent();
                // The card lets go of the copy at once, before any step: it no longer says it waits for it
                _o = expect;
                return [4 /*yield*/, wait()];
            case 28:
                // The card lets go of the copy at once, before any step: it no longer says it waits for it
                _o.apply(void 0, [_w.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, drawn(pane)];
            case 29:
                _p.apply(void 0, [_w.sent()]).toEqual(['working']);
                return [4 /*yield*/, call('Bash', 'b2', { command: 'shasum -a 256 -c sums.txt' })
                    // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                ];
            case 30:
                _w.sent();
                // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                return [4 /*yield*/, call('TaskStop', 'k1', { task_id: 'mon-m1' })];
            case 31:
                // It stops its watch, ticks the to-do and reports: now it has finished, green, with its report kept
                _w.sent();
                return [4 /*yield*/, todo('Send CT fits, CTs, iPhone scans and photogrammetry to the M4', 'done', 't2')];
            case 32:
                _w.sent();
                report = "All four pieces are on the M4 and every file matches by hash. ".concat('The CT fits, your CTs, the iPhone scans and the photogrammetry run open there as they do here. '.repeat(6)).trim();
                return [4 /*yield*/, call('SubagentHandback', 'h2', { message: report })];
            case 33:
                _w.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w3', reason: 'answer', agentId: 'a1' })];
            case 34:
                _w.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 35:
                _q.apply(void 0, [(_u = (_w.sent())) === null || _u === void 0 ? void 0 : _u.props.color]).toBe('success');
                _r = expect;
                return [4 /*yield*/, drawn(pane)];
            case 36:
                _r.apply(void 0, [_w.sent()]).toEqual(['happy']);
                return [4 /*yield*/, clock.advance(10)];
            case 37:
                _w.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, kept()[0]];
                    }); }); })];
            case 38:
                _s.apply(void 0, [_w.sent()]).toBeDefined();
                expect(files.get((_v = kept()[0]) !== null && _v !== void 0 ? _v : '')).toBe("".concat(report, "\n"));
                return [4 /*yield*/, pane.unmount()];
            case 39:
                _w.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that reports with everything it set out to do done, leaving a server of its own running, has finished: green, and its card says it left something running', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, pane, call, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { art: true, agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site for me', wait: false, origin: composer })];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Run the site', prompt: 'run it' }))];
            case 4:
                _e.sent();
                kinds.a1 = 'general-purpose';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Start the site', state: 'doing' })];
            case 5:
                _e.sent();
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 6:
                _e.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Start the site', state: 'done' })];
            case 7:
                _e.sent();
                return [4 /*yield*/, call('SubagentHandback', 'h1', { message: 'The site runs at http://localhost:3000.' })];
            case 8:
                _e.sent();
                agents.a1 = 'waiting';
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'w1', reason: 'answer', agentId: 'a1' })];
            case 9:
                _e.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 10:
                _a.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.props.color]).toBe('success');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Still at work/ })];
            case 11:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 12:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^It left something running in the background, / })];
            case 13:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, pane.unmount()];
            case 14:
                _e.sent();
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 10:
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(20000)];
            case 11:
                _d.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /left something running/ })];
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /left something running/ })];
            case 14:
                _d.apply(void 0, [_q.sent()]).toBeUndefined();
                return [4 /*yield*/, line()];
            case 15:
                asking = _q.sent();
                expect(asking).toMatch(/^Waits for your answer/);
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Still at work/ })];
            case 26:
                _h.apply(void 0, [_q.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 27:
                _j.apply(void 0, [(_q.sent()).some(function (b) { return b.key === 'stop-a1'; })]).toBe(false);
                _k = expect;
                return [4 /*yield*/, line()];
            case 28:
                _k.apply(void 0, [_q.sent()]).toMatch(/^Finished · /);
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /left something running/ })];
            case 31:
                _m.apply(void 0, [_q.sent()]).toBeUndefined();
                sends = resumed.length;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Release it' })];
            case 32:
                again = _q.sent();
                expect(String(again.deny)).toContain('gave on that work\'s card');
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
