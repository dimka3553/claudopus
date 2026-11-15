// The asking card: an ask, its Copy, buttons and reply box
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
var GITHUB_BOX = "Claudopus needs GITHUB_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.";
var NPM_BOX = "Claudopus needs NPM_TOKEN. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.";
var ADMIN_BOX = 'Claudopus needs the admin password of this Mac to run the admin command below. Nothing is kept: it goes only to that command, and the next one asks again.';
test('work that needs the person\'s hands asks: its card stands out first with the ask, the text to paste with its Copy, and answers that go back to it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var ended, _a, played, notified, appended, terminals, submitted, resumed, shown, files, clip, list, asked, titles, _b, _c, _d, ears, _e, _f, _g, approve, _h, _j, _k, _l, box, toWork, _m, _o, _p, _i, _q, pane, _r, _s, waiting, _t, _u, _v, _w, _x, _, e_1_1, _y, _z, labels, again, done, _0, _1, _2, _3, box3, _4, _5, _6, _7, hrefs, _8, _9, _10, told, _11, openedBefore, openIn, opened, home, _12, before2, _13, _14, second, box4, _15, _16, _17;
    var _18;
    var _this = this;
    var _19, e_1, _20, _21;
    var _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39;
    return __generator(this, function (_40) {
        switch (_40.label) {
            case 0:
                ended = new Set();
                _a = world(on, { ended: ended }), played = _a.played, notified = _a.notified, appended = _a.appended, terminals = _a.terminals, submitted = _a.submitted, resumed = _a.resumed, shown = _a.shown, files = _a.files;
                clip = [];
                on('ui.copy', function (_, e) { return (clip.push(e.text), { value: { isCopied: true } }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _40.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })];
            case 2:
                _40.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _40.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _40.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 5:
                _40.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'Paste this code on the GitHub page that opened.', copy: 'ABCD-1234' })];
            case 6:
                asked = _40.sent();
                expect(asked.result).toContain('Shown on your card');
                expect(played.length).toBeGreaterThan(0);
                expect(notified).toContain('Check the ears needs you | Paste this code on the GitHub page that opened.');
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                titles = (_40.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; });
                expect(titles.indexOf('Check the ears')).toBeGreaterThan(-1);
                expect(titles.indexOf('Check the ears')).toBeLessThan(titles.indexOf('Hide the repo'));
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Paste this code on the GitHub page that opened.' })];
            case 8:
                _b.apply(void 0, [(_22 = (_40.sent())) === null || _22 === void 0 ? void 0 : _22.props.color]).toBe('#E5A50A');
                // The code is shown with one Copy button, which puts it on the clipboard and says so
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'ABCD-1234' })];
            case 9:
                // The code is shown with one Copy button, which puts it on the clipboard and says so
                _c.apply(void 0, [(_23 = (_40.sent())) === null || _23 === void 0 ? void 0 : _23.props.mono]).toBe(true);
                return [4 /*yield*/, pressed(list, 'ask-a2-copy')];
            case 10:
                _40.sent();
                expect(clip).toEqual(['ABCD-1234']);
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '✓ Copied'; })];
                        }
                    }); }); })];
            case 11:
                _d.apply(void 0, [(_40.sent())]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', surface: 'desktop' }))];
            case 12:
                ears = _40.sent();
                _e = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Needs you now' })];
            case 13:
                _e.apply(void 0, [_40.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: '' })];
            case 14:
                _40.sent();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'ABCD-1234' })];
            case 15:
                _f.apply(void 0, [_40.sent()]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Needs you now' })];
            case 16:
                _g.apply(void 0, [_40.sent()]).toBeUndefined();
                // An ask for a go-ahead carries buttons; the one pressed goes back to the work and the ask goes
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
            case 17:
                // An ask for a go-ahead carries buttons; the one pressed goes back to the work and the ask goes
                _40.sent();
                return [4 /*yield*/, ears.findAll({ type: 'Button' })];
            case 18:
                approve = (_40.sent()).find(function (b) { return b.props.label === 'Approve'; });
                expect(approve).toBeDefined();
                return [4 /*yield*/, ears.press({ key: (_24 = approve === null || approve === void 0 ? void 0 : approve.key) !== null && _24 !== void 0 ? _24 : '' })];
            case 19:
                _40.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Approve"'); })];
                    }); }); })];
            case 20:
                _h.apply(void 0, [_40.sent()]).toContain('May I delete the old repo?');
                _j = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 21:
                _j.apply(void 0, [(_40.sent()).find(function (b) { return b.props.label === 'Approve'; })]).toBeUndefined();
                // Or a reply in the person's own words, right on the small card: the reply goes to the work. One that is none of the ask's buttons,
                // such as a question back, does not settle it: the ask stays with the reply under it, and its answers go, as the person has answered
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Submit it to the plugin directory.', choices: ['Submitted', 'Not now'] })];
            case 22:
                // Or a reply in the person's own words, right on the small card: the reply goes to the work. One that is none of the ask's buttons,
                // such as a question back, does not settle it: the ask stays with the reply under it, and its answers go, as the person has answered
                _40.sent();
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 23:
                _k.apply(void 0, [(_40.sent()).some(function (b) { return b.props.label === 'Reply…'; })]).toBe(false);
                _l = expect;
                return [4 /*yield*/, ears.findAll({ type: 'Input' })];
            case 24:
                _l.apply(void 0, [(_40.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 25:
                box = (_40.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect(box === null || box === void 0 ? void 0 : box.props.placeholder).toBe('Or reply in your own words');
                return [4 /*yield*/, list.input({ key: (_25 = box === null || box === void 0 ? void 0 : box.key) !== null && _25 !== void 0 ? _25 : '', text: 'Where do I do that?' })];
            case 26:
                _40.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('Where do I do that?'); })];
                    }); }); })];
            case 27:
                toWork = (_26 = (_40.sent())) !== null && _26 !== void 0 ? _26 : '';
                expect(toWork).toContain('Submit it to the plugin directory.');
                expect(toWork).toContain('does not settle your ask by itself');
                // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
                // and no buttons, box or send, on the small card and in Details
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Submit it to the plugin directory.' })];
            case 28:
                // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
                // and no buttons, box or send, on the small card and in Details
                _m.apply(void 0, [(_27 = (_40.sent())) === null || _27 === void 0 ? void 0 : _27.props.color]).toBe('#8A63F0');
                _o = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Needs you now' })];
            case 29:
                _o.apply(void 0, [_40.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Acting on your reply' })];
            case 30:
                _p.apply(void 0, [_40.sent()]).toBeDefined();
                _i = 0, _q = [list, ears];
                _40.label = 31;
            case 31:
                if (!(_i < _q.length)) return [3 /*break*/, 35];
                pane = _q[_i];
                _r = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 32:
                _r.apply(void 0, [(_40.sent()).some(function (b) { return b.props.label === 'Submitted' || b.props.label === 'Not now'; })]).toBe(false);
                _s = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Input' })];
            case 33:
                _s.apply(void 0, [(_40.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                _40.label = 34;
            case 34:
                _i++;
                return [3 /*break*/, 31];
            case 35:
                waiting = '✓ You replied “Where do I do that?” · it reads this at its next step';
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: waiting })];
                    }); }); })];
            case 36:
                _t.apply(void 0, [_40.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ears.find({ type: 'Text', text: waiting })];
                    }); }); })];
            case 37:
                _u.apply(void 0, [_40.sent()]).toBeDefined();
                _40.label = 38;
            case 38:
                _40.trys.push([38, 43, 44, 49]);
                _v = true, _w = __asyncValues($.turn.step({ turnId: 'turn-9', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a2' }));
                _40.label = 39;
            case 39: return [4 /*yield*/, _w.next()];
            case 40:
                if (!(_x = _40.sent(), _19 = _x.done, !_19)) return [3 /*break*/, 42];
                _21 = _x.value;
                _v = false;
                _ = _21;
                void _;
                _40.label = 41;
            case 41:
                _v = true;
                return [3 /*break*/, 39];
            case 42: return [3 /*break*/, 49];
            case 43:
                e_1_1 = _40.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 49];
            case 44:
                _40.trys.push([44, , 47, 48]);
                if (!(!_v && !_19 && (_20 = _w.return))) return [3 /*break*/, 46];
                return [4 /*yield*/, _20.call(_w)];
            case 45:
                _40.sent();
                _40.label = 46;
            case 46: return [3 /*break*/, 48];
            case 47:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 48: return [7 /*endfinally*/];
            case 49:
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You replied “Where do I do that?” · it is acting on it' })];
                    }); }); })];
            case 50:
                _y.apply(void 0, [_40.sent()]).toBeDefined();
                // The work asks again: amber again, with its answers back and an empty box
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5b', agentId: 'a2', text: 'It is under Manage, then Submit new. Done?' })];
            case 51:
                // The work asks again: amber again, with its answers back and an empty box
                _40.sent();
                _z = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })];
            case 52:
                _z.apply(void 0, [(_28 = (_40.sent())) === null || _28 === void 0 ? void 0 : _28.props.color]).toBe('#E5A50A');
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 53:
                labels = (_40.sent()).map(function (b) { return b.props.label; });
                expect(labels).toContain('Done');
                expect(labels).toContain('Not now');
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 54:
                again = (_40.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect(again === null || again === void 0 ? void 0 : again.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                expect((_29 = again === null || again === void 0 ? void 0 : again.props.value) !== null && _29 !== void 0 ? _29 : '').toBe('');
                // Half a reply typed, then Done pressed twice: the answer goes once, and the half reply is not left for the next ask
                return [4 /*yield*/, list.input({ key: (_30 = again === null || again === void 0 ? void 0 : again.key) !== null && _30 !== void 0 ? _30 : '', text: 'Not y', kind: 'change' })];
            case 55:
                // Half a reply typed, then Done pressed twice: the answer goes once, and the half reply is not left for the next ask
                _40.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 56:
                done = (_32 = (_31 = (_40.sent()).find(function (b) { return b.props.label === 'Done'; })) === null || _31 === void 0 ? void 0 : _31.key) !== null && _32 !== void 0 ? _32 : '';
                return [4 /*yield*/, Promise.all([list.press({ key: done }), list.press({ key: done }).catch(function () { return undefined; })])];
            case 57:
                _40.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Done"'); })];
                    }); }); })];
            case 58:
                _0.apply(void 0, [_40.sent()]).toContain('Submit new. Done?');
                expect(appended.filter(function (line) { return line.startsWith('a2: ') && line.includes('"Done"'); })).toHaveLength(1);
                _1 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'It is under Manage, then Submit new. Done?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 59:
                _1.apply(void 0, [_40.sent()]).toBe(true);
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Done” · it reads this at its next step' })];
                    }); }); })];
            case 60:
                _2.apply(void 0, [_40.sent()]).toBeDefined();
                // A newer line from the work takes the answer's place
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a2', text: 'I submitted it.' })];
            case 61:
                // A newer line from the work takes the answer's place
                _40.sent();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'I submitted it.' })];
                    }); }); })];
            case 62:
                _3.apply(void 0, [_40.sent()]).toBeDefined();
                // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k8', agentId: 'a2', text: 'Tell me the repo name.' })];
            case 63:
                // A reply to work whose run has ended starts that work again with it, never as a message in the person's place, and clears the amber
                _40.sent();
                ended.add('a2');
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 64:
                box3 = (_40.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect((_33 = box3 === null || box3 === void 0 ? void 0 : box3.props.value) !== null && _33 !== void 0 ? _33 : '').toBe('');
                return [4 /*yield*/, list.input({ key: (_34 = box3 === null || box3 === void 0 ? void 0 : box3.key) !== null && _34 !== void 0 ? _34 : '', text: 'claudopus' })];
            case 65:
                _40.sent();
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: claudopus'); })];
                    }); }); })];
            case 66:
                _4.apply(void 0, [_40.sent()]).toContain('this answer starts you again');
                expect(submitted.some(function (line) { return line.includes('claudopus'); })).toBe(false);
                _5 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “claudopus” · it reads this at its next step' })];
                    }); }); })];
            case 67:
                _5.apply(void 0, [_40.sent()]).toBeDefined();
                _6 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Tell me the repo name.' })];
            case 68:
                _6.apply(void 0, [_40.sent()]).toBeUndefined();
                // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: 'Open the plugin directory and submit the form.', copy: 'Open the plugin directory page and fill in the form with the details' })];
            case 69:
                // Instructions passed as text to copy get no Copy: only what is pasted elsewhere does
                _40.sent();
                _7 = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 70:
                _7.apply(void 0, [(_40.sent()).some(function (b) { return b.props.label === 'Copy'; })]).toBe(false);
                // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k7', agentId: 'a2', text: 'Open https://claude.ai/directory/manage, press Submit new, and paste the repository.', copy: 'https://github.com/dimka3553/claudopus' })];
            case 71:
                // A web address in the ask is a link to press, on the card and in Details, and one to paste is a link beside its Copy
                _40.sent();
                hrefs = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Link' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.props.href; })];
                    }
                }); }); };
                _8 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, hrefs(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('https://claude.ai/directory/manage') ? true : undefined)];
                        }
                    }); }); })];
            case 72:
                _8.apply(void 0, [_40.sent()]).toBe(true);
                _9 = expect;
                return [4 /*yield*/, hrefs(list)];
            case 73:
                _9.apply(void 0, [_40.sent()]).toContain('https://github.com/dimka3553/claudopus');
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, hrefs(ears)];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('https://claude.ai/directory/manage') ? true : undefined)];
                        }
                    }); }); })];
            case 74:
                _10.apply(void 0, [_40.sent()]).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Sign in to GitHub.', command: "gh auth login --hostname 'github.com'", cwd: '/repo/site' })];
            case 75:
                told = _40.sent();
                expect(told.result).not.toContain('mcp__terminal__open_terminal_tab');
                expect(told.result).toContain('Do not open a terminal for it');
                _11 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login --hostname 'github.com'" })];
            case 76:
                _11.apply(void 0, [(_35 = (_40.sent())) === null || _35 === void 0 ? void 0 : _35.props.mono]).toBe(true);
                expect(terminals).toEqual([]);
                openedBefore = shown.length;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 77:
                openIn = (_40.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; });
                expect(openIn).toBeDefined();
                expect(shown.length).toBe(openedBefore);
                // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
                return [4 /*yield*/, list.press({ key: (_36 = openIn === null || openIn === void 0 ? void 0 : openIn.key) !== null && _36 !== void 0 ? _36 : '' })];
            case 78:
                // Its press opens Terminal with the command typed at a prompt in its folder, not run, and the button says so
                _40.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.slice(openedBefore).find(function (argv) { return String(argv[1]).endsWith('/open.command'); })];
                    }); }); })];
            case 79:
                opened = _40.sent();
                home = String(opened === null || opened === void 0 ? void 0 : opened[1]).replace(/\/open\.command$/, '');
                expect(files.get("".concat(home, "/command.txt"))).toBe("cd '/repo/site' && gh auth login --hostname 'github.com'");
                expect(files.get("".concat(home, "/.zshrc"))).toContain('print -rz -- "$(<"$_claudopus_here/command.txt")"');
                expect(files.get("".concat(home, "/.zshrc"))).toContain("cd '/repo/site'");
                expect(files.get("".concat(home, "/open.command"))).toContain('exec /bin/zsh -i');
                // Their own history file, and their own start files where their .zshenv moves them
                expect(files.get("".concat(home, "/.zshrc"))).toContain('HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"');
                expect(files.get("".concat(home, "/.zshenv"))).toContain('_CLAUDOPUS_DOT="$ZDOTDIR"');
                _12 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '✓ Opened in Terminal, typed, not run'; })];
                        }
                    }); }); })];
            case 80:
                _12.apply(void 0, [_40.sent()]).toBeDefined();
                expect(terminals).toEqual([]);
                // A folder with a quote in its name is quoted whole
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a2', text: 'Run it here.', command: 'make', cwd: "/repo/it's here" })];
            case 81:
                // A folder with a quote in its name is quoted whole
                _40.sent();
                before2 = shown.length;
                _14 = (_13 = list).press;
                _18 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 82: return [4 /*yield*/, _14.apply(_13, [(_18.key = (_38 = (_37 = (_40.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; })) === null || _37 === void 0 ? void 0 : _37.key) !== null && _38 !== void 0 ? _38 : '', _18)])];
            case 83:
                _40.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.slice(before2).find(function (argv) { return String(argv[1]).endsWith('/open.command'); })];
                    }); }); })];
            case 84:
                second = _40.sent();
                expect(files.get(String(second === null || second === void 0 ? void 0 : second[1]))).toContain("cd '/repo/it'\\''s here'");
                // A reply written into work that then ends without another step was never read: it starts the work again
                ended.delete('a2');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k9', agentId: 'a2', text: 'Which branch?', choices: ['main', 'Not now'] })];
            case 85:
                _40.sent();
                return [4 /*yield*/, ears.findAll({ type: 'Input' })];
            case 86:
                box4 = (_40.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, ears.input({ key: (_39 = box4 === null || box4 === void 0 ? void 0 : box4.key) !== null && _39 !== void 0 ? _39 : '', text: 'main' })];
            case 87:
                _40.sent();
                _15 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' })];
                    }); }); })];
            case 88:
                _15.apply(void 0, [_40.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Stopping here.', durationMs: 1, isAborted: false, turnId: 'turn-10', reason: 'answer', agentId: 'a2' })];
            case 89:
                _40.sent();
                _16 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('you ended before reading it: main'); })];
                    }); }); })];
            case 90:
                _16.apply(void 0, [_40.sent()]).toContain('Which branch?');
                expect(submitted.some(function (line) { return line.includes('Which branch?'); })).toBe(false);
                _17 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main” · it reads this at its next step' })];
                    }); }); })];
            case 91:
                _17.apply(void 0, [_40.sent()]).toBeDefined();
                return [4 /*yield*/, Promise.all([list.unmount(), ears.unmount()])];
            case 92:
                _40.sent();
                return [2 /*return*/];
        }
    });
}); });
test("while the person types into a card's reply box the list's running times stand still, and move again once they stop", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, time, before, box, _a, _b, _c;
    var _this = this;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' })];
            case 4:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _f.sent();
                time = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).find(function (text) { return /\d+s$/.test(text !== null && text !== void 0 ? text : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(2000)];
            case 6:
                _f.sent();
                return [4 /*yield*/, time()];
            case 7:
                before = _f.sent();
                expect(before).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 8:
                box = (_f.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_d = box === null || box === void 0 ? void 0 : box.key) !== null && _d !== void 0 ? _d : '', text: 'The le', kind: 'change' })];
            case 9:
                _f.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 10:
                _f.sent();
                _a = expect;
                return [4 /*yield*/, time()];
            case 11:
                _a.apply(void 0, [_f.sent()]).toBe(before);
                // Typing stopped for half a minute: the times move again, and the draft is still in the box
                return [4 /*yield*/, clock.advance(31000)];
            case 12:
                // Typing stopped for half a minute: the times move again, and the draft is still in the box
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, time()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== before ? true : undefined)];
                        }
                    }); }); })];
            case 13:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 14:
                _c.apply(void 0, [(_e = (_f.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _e === void 0 ? void 0 : _e.props.value]).toBe('The le');
                return [4 /*yield*/, list.unmount()];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('while the person types into an ask the panel holds its drawing whole, as other cards move, start and finish around it: the 15 Nov panel that jumped to its bottom and flickered with every letter typed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _loop_1, _i, _a, surface;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Keep digging for head CTs', prompt: 'dig' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which source next?', details: 'A long explanation.\n\n- one\n- two\n- three', choices: ['Kaggle', 'TCIA', 'Not now'] })];
            case 5:
                _j.sent();
                _loop_1 = function (surface) {
                    var list, ears, drawing, box, _k, before, beforeDetails, _l, _m, _o, text, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
                    var _z;
                    return __generator(this, function (_0) {
                        switch (_0.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
                            case 1:
                                list = _0.sent();
                                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: surface }))];
                            case 2:
                                ears = _0.sent();
                                return [4 /*yield*/, clock.advance(2000)];
                            case 3:
                                _0.sent();
                                drawing = function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            _b = (_a = JSON).stringify;
                                            _c = [[]];
                                            return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                                        case 1:
                                            _d = [__spreadArray.apply(void 0, _c.concat([(_e.sent()).map(function (one) { return one.text; }), true]))];
                                            return [4 /*yield*/, pane.findAll({ type: 'Input' })];
                                        case 2: return [2 /*return*/, _b.apply(_a, [__spreadArray.apply(void 0, _d.concat([(_e.sent()).map(function (one) { return [one.key, one.props.value]; }), true]))])];
                                    }
                                }); }); };
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 4:
                                box = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                                expect(box).toBeDefined();
                                return [4 /*yield*/, drawing(list)];
                            case 5:
                                _l = [_0.sent()];
                                return [4 /*yield*/, drawing(ears)];
                            case 6:
                                _k = _l.concat([_0.sent()]), before = _k[0], beforeDetails = _k[1];
                                _m = 0, _o = ['N', 'No', 'Non', 'Non-A'];
                                _0.label = 7;
                            case 7:
                                if (!(_m < _o.length)) return [3 /*break*/, 10];
                                text = _o[_m];
                                return [4 /*yield*/, list.input({ key: (_b = box === null || box === void 0 ? void 0 : box.key) !== null && _b !== void 0 ? _b : '', text: text, kind: 'change' })];
                            case 8:
                                _0.sent();
                                _0.label = 9;
                            case 9:
                                _m++;
                                return [3 /*break*/, 7];
                            case 10:
                                _p = expect;
                                return [4 /*yield*/, drawing(list)];
                            case 11:
                                _p.apply(void 0, [_0.sent()]).toBe(before);
                                // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "n-".concat(surface), agentId: 'a2', text: "I am measuring the left ear on the ".concat(surface, ".") })];
                            case 12:
                                // The other card writes a new line and its time moves: the panel still holds its drawing, and so does Details
                                _0.sent();
                                return [4 /*yield*/, clock.advance(3000)];
                            case 13:
                                _0.sent();
                                return [4 /*yield*/, list.input({ key: (_c = box === null || box === void 0 ? void 0 : box.key) !== null && _c !== void 0 ? _c : '', text: 'Non-Asian', kind: 'change' })];
                            case 14:
                                _0.sent();
                                _q = expect;
                                return [4 /*yield*/, drawing(list)];
                            case 15:
                                _q.apply(void 0, [_0.sent()]).toBe(before);
                                _r = expect;
                                return [4 /*yield*/, drawing(ears)];
                            case 16:
                                _r.apply(void 0, [_0.sent()]).toBe(beforeDetails);
                                // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
                                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Find more scans ".concat(surface), prompt: 'more' }))];
                            case 17:
                                // A third piece of work starts: it is drawn, and the box is drawn with the text it had, never the letters as they come
                                _0.sent();
                                _s = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "Find more scans ".concat(surface) })];
                                    }); }); })];
                            case 18:
                                _s.apply(void 0, [_0.sent()]).toBeDefined();
                                _t = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 19:
                                _t.apply(void 0, [(_d = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _d === void 0 ? void 0 : _d.props.value]).toBe('');
                                // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
                                return [4 /*yield*/, clock.advance(31000)];
                            case 20:
                                // Typing stopped: the panel moves on, with the other card's new line, and the box holds what was typed
                                _0.sent();
                                _u = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "I am measuring the left ear on the ".concat(surface, ".") })];
                                    }); }); })];
                            case 21:
                                _u.apply(void 0, [_0.sent()]).toBeDefined();
                                _v = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 22:
                                _v.apply(void 0, [(_e = (_0.sent()).find(function (one) { var _a; return /^ask-a1-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _e === void 0 ? void 0 : _e.props.value]).toBe('Non-Asian');
                                // A press is the person's own move: it lets the panel go at once
                                return [4 /*yield*/, list.input({ key: (_f = box === null || box === void 0 ? void 0 : box.key) !== null && _f !== void 0 ? _f : '', text: 'Non-Asian heads', kind: 'change' })];
                            case 23:
                                // A press is the person's own move: it lets the panel go at once
                                _0.sent();
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "m-".concat(surface), agentId: 'a2', text: "Both ears done on the ".concat(surface, ".") })];
                            case 24:
                                _0.sent();
                                _x = (_w = list).press;
                                _z = {};
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 25: return [4 /*yield*/, _x.apply(_w, [(_z.key = (_h = (_g = (_0.sent()).find(function (b) { return b.props.label === 'TCIA'; })) === null || _g === void 0 ? void 0 : _g.key) !== null && _h !== void 0 ? _h : '', _z)])];
                            case 26:
                                _0.sent();
                                _y = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: "Both ears done on the ".concat(surface, ".") })];
                                    }); }); })];
                            case 27:
                                _y.apply(void 0, [_0.sent()]).toBeDefined();
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(surface), agentId: 'a1', text: 'Which source next?', choices: ['Kaggle', 'TCIA', 'Not now'] })];
                            case 28:
                                _0.sent();
                                return [4 /*yield*/, Promise.all([list.unmount(), ears.unmount()])];
                            case 29:
                                _0.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ['desktop', 'terminal'];
                _j.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                surface = _a[_i];
                return [5 /*yield**/, _loop_1(surface)];
            case 7:
                _j.sent();
                _j.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/];
        }
    });
}); });
test('with work running and nobody typing, the panel is drawn again at once for anything new, but for its running times alone only every ten seconds, so a button under the pointer keeps its hover and takes its click', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, texts, before, _a, _b, after, _c, _d, _e, _f, shut, _g;
    var _h;
    var _this = this;
    var _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _l.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I go on?', choices: ['Approve', 'Not now'] })];
            case 4:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _l.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).stringify;
                            return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (one) { return one.text; })])];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(1000)];
            case 6:
                _l.sent();
                return [4 /*yield*/, texts()];
            case 7:
                before = _l.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 8:
                _l.sent();
                _a = expect;
                return [4 /*yield*/, texts()];
            case 9:
                _a.apply(void 0, [_l.sent()]).toBe(before);
                // The work writes a line: drawn at once
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' })];
            case 10:
                // The work writes a line: drawn at once
                _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'I am looking at the left ear.' })];
                    }); }); })];
            case 11:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, texts()];
            case 12:
                after = _l.sent();
                return [4 /*yield*/, clock.advance(11000)];
            case 13:
                _l.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== after ? true : undefined)];
                        }
                    }); }); })];
            case 14:
                _c.apply(void 0, [_l.sent()]).toBe(true);
                _e = (_d = list).press;
                _h = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 15: 
            // A press shows what it did at once
            return [4 /*yield*/, _e.apply(_d, [(_h.key = (_k = (_j = (_l.sent()).find(function (b) { return b.props.label === 'Approve'; })) === null || _j === void 0 ? void 0 : _j.key) !== null && _k !== void 0 ? _k : '', _h)])];
            case 16:
                // A press shows what it did at once
                _l.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'May I go on?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _f.apply(void 0, [_l.sent()]).toBe(true);
                // and so does one that only opens a part of the panel, Finished, with work ended and other work running
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the nose', prompt: 'nose' }))];
            case 18:
                // and so does one that only opens a part of the panel, Finished, with work ended and other work running
                _l.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Nose checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a2' })];
            case 19:
                _l.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 20:
                _l.sent();
                return [4 /*yield*/, texts()];
            case 21:
                shut = _l.sent();
                return [4 /*yield*/, pressed(list, 'finished-fold')];
            case 22:
                _l.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== shut ? true : undefined)];
                        }
                    }); }); })];
            case 23:
                _g.apply(void 0, [_l.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 24:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a key box keeps what is typed in it without drawing it back, and holds the panel while it is typed into', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, files, id, list, field, before, _b, _c, _d, _e, _f, _g;
    var _this = this;
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'get the data', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Get the data', prompt: 'data' }))];
            case 3:
                _j.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret SAMPLE_USER here fetch' }));
                id = '3f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'SAMPLE_USER', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-field")); })];
                        }
                    }); }); })];
            case 6:
                field = _j.sent();
                expect(field).toBeDefined();
                if (!field)
                    return [2 /*return*/];
                // The surface keeps the letters itself: the box is drawn with no value, so a drawing never puts older letters over newer ones
                expect(field.props.value).toBeUndefined();
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                before = _c.apply(_b, [(_j.sent()).map(function (one) { return one.text; })]);
                return [4 /*yield*/, list.input({ key: (_h = field.key) !== null && _h !== void 0 ? _h : '', text: 'made-up-na', kind: 'change' })];
            case 8:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am waiting for the made-up name.' })];
            case 9:
                _j.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 10:
                _j.sent();
                _d = expect;
                _f = (_e = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 11:
                _d.apply(void 0, [_f.apply(_e, [(_j.sent()).map(function (one) { return one.text; })])]).toBe(before);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 12:
                _g.apply(void 0, [(_j.sent()).find(function (one) { return one.key === field.key; })]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 13:
                _j.sent();
                return [4 /*yield*/, settle()];
            case 14:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, submitted, resumed, clock, list, _b, labels, _c, _d, _e, _f;
    var _g;
    var _this = this;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on), submitted = _a.submitted, resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _l.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run this to restart that chat yourself.', command: 'ssh m4 tmux respawn-pane -k -t claude' })];
            case 5:
                _l.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'I could not restart it; the command is on your card.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })
                    // Long after it finished, the ask is still there, amber, with its Done and Not now and its button for Terminal
                ];
            case 6:
                _l.sent();
                // Long after it finished, the ask is still there, amber, with its Done and Not now and its button for Terminal
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 7:
                // Long after it finished, the ask is still there, amber, with its Done and Not now and its button for Terminal
                _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })];
                    }); }); })];
            case 8:
                _b.apply(void 0, [(_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.props.color]).toBe('#E5A50A');
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                labels = (_l.sent()).map(function (b) { return b.props.label; });
                expect(labels).toContain('Done');
                expect(labels).toContain('Not now');
                expect(labels).toContain('Open in Terminal');
                _d = (_c = list).press;
                _g = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 10: 
            // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
            return [4 /*yield*/, _d.apply(_c, [(_g.key = (_k = (_j = (_l.sent()).find(function (b) { return b.props.label === 'Done'; })) === null || _j === void 0 ? void 0 : _j.key) !== null && _k !== void 0 ? _k : '', _g)])];
            case 11:
                // Done starts the finished work again with the answer, and the ask goes at once; nothing is sent in the person's place
                _l.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Done"') && line.includes('Run this to restart that chat yourself.'); })];
                    }); }); })];
            case 12:
                _e.apply(void 0, [_l.sent()]).toBeDefined();
                expect(submitted.some(function (line) { return line.includes('Run this to restart'); })).toBe(false);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this to restart that chat yourself.' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 13:
                _f.apply(void 0, [_l.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 14:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a press on one ended work\'s ask leaves the other asks\' buttons where they were: the 14 Nov "Release it" pressed from a phone right after another card\'s, on the keys it last drew, which ran nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, clock, list, _i, _b, _c, id, text, drawn, linux, azure, _d, _e, _f;
    var _this = this;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two releases', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Linux support', prompt: 'linux' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Azure route', prompt: 'azure' }))];
            case 4:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _j.sent();
                _i = 0, _b = [['a1', 'Release Linux support?'], ['a2', 'Release the Azure route?']];
                _j.label = 6;
            case 6:
                if (!(_i < _b.length)) return [3 /*break*/, 10];
                _c = _b[_i], id = _c[0], text = _c[1];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(id), agentId: id, text: text, choices: ['Release it', 'Not now'] })];
            case 7:
                _j.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: "turn-".concat(id), reason: 'answer', agentId: id })];
            case 8:
                _j.sent();
                _j.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 6];
            case 10: return [4 /*yield*/, clock.advance(60000)
                // The keys as the late surface last drew them, both cards amber with their buttons
            ];
            case 11:
                _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var releases;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                case 1:
                                    releases = (_a.sent()).filter(function (b) { return b.props.label === 'Release it'; });
                                    return [2 /*return*/, releases.length === 2 ? releases.map(function (b) { var _a; return (_a = b.key) !== null && _a !== void 0 ? _a : ''; }) : undefined];
                            }
                        });
                    }); })];
            case 12:
                drawn = _j.sent();
                linux = (_g = drawn === null || drawn === void 0 ? void 0 : drawn.find(function (key) { return key.startsWith('ask-a1-'); })) !== null && _g !== void 0 ? _g : '';
                azure = (_h = drawn === null || drawn === void 0 ? void 0 : drawn.find(function (key) { return key.startsWith('ask-a2-'); })) !== null && _h !== void 0 ? _h : '';
                expect(linux && azure).toBeTruthy();
                return [4 /*yield*/, list.press({ key: linux })];
            case 13:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 14:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
                return [4 /*yield*/, list.press({ key: azure }).catch(function () { return undefined; })];
            case 15:
                // The second press names the key it was drawn with: it still answers its own ask, takes the card out of amber, and wakes its work
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a2: ') && line.includes('pressed "Release it"') && line.includes('Release the Azure route?'); })];
                    }); }); })];
            case 16:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Release the Azure route?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _f.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 18:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a reply in words that does not settle an ask keeps it, and the card active, with nothing to press while the work acts on it, until it is settled: the 13 Nov "Show me images first." to work that asked "Release it?" and handed in its report', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, clock, list, ASK, texts, labels, isFinished, _b, _c, box, told, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, back, _s, _t, _u, _v, _w, _x, box2, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
    var _11;
    var _this = this;
    var _12, _13, _14, _15, _16, _17, _18, _19;
    return __generator(this, function (_20) {
        switch (_20.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _20.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'second round of terminal fixes', wait: false, origin: composer })];
            case 2:
                _20.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Terminal look, second round', prompt: 'second round of terminal fixes' }))];
            case 3:
                _20.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _20.sent();
                ASK = 'Release the second round of terminal fixes?';
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; })];
                    }
                }); }); };
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                isFinished = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, labels()];
                        case 1:
                            _a = (_b.sent()).some(function (label) { return label.includes('Finished'); });
                            if (_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, texts()];
                        case 2:
                            _a = (_b.sent()).some(function (text) { return text.startsWith('Finished'); });
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                }); }); };
                // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] })];
            case 5:
                // It asks, then hands in its report with the ask as its first line, as that work did at 20:27
                _20.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'Release it? (Answers: Release it / Not now.) Built, tested and checked; nothing is released.' })];
            case 6:
                _20.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 7:
                _20.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 8:
                _20.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: ASK })];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_20.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, labels()];
            case 10:
                _c.apply(void 0, [_20.sent()]).toContain('Release it');
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 11:
                box = (_20.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_12 = box === null || box === void 0 ? void 0 : box.key) !== null && _12 !== void 0 ? _12 : '', text: 'Show me images first.' })];
            case 12:
                _20.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('in their own words: Show me images first.'); })];
                    }); }); })];
            case 13:
                told = (_13 = (_20.sent())) !== null && _13 !== void 0 ? _13 : '';
                expect(told).toContain('does not settle your ask by itself');
                expect(told).toContain('this answer starts you again');
                // The card stays among the running cards, at work, with its question and the reply under it, and no buttons, box or send;
                // nothing is under Finished
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You replied “Show me images first.” · it reads this at its next step' })];
                    }); }); })];
            case 14:
                // The card stays among the running cards, at work, with its question and the reply under it, and no buttons, box or send;
                // nothing is under Finished
                _d.apply(void 0, [_20.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 15:
                _e.apply(void 0, [_20.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, labels()];
            case 16:
                _f.apply(void 0, [_20.sent()]).not.toContain('Release it');
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 17:
                _g.apply(void 0, [(_20.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 18:
                if (!((_14 = (_20.sent())) !== null && _14 !== void 0)) return [3 /*break*/, 19];
                _j = _14;
                return [3 /*break*/, 22];
            case 19:
                _l = (_k = JSON).stringify;
                _m = [[]];
                return [4 /*yield*/, labels()];
            case 20:
                _o = [__spreadArray.apply(void 0, _m.concat([(_20.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 21:
                _j = _l.apply(_k, [__spreadArray.apply(void 0, _o.concat([(_20.sent()), true]))]);
                _20.label = 22;
            case 22:
                _h.apply(void 0, [_j]).toBe(true);
                // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
                // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
                // time with the same reply
                return [4 /*yield*/, $.turn.complete({ answer: 'Release it? (Answers: Release it / Not now.) Here are the images.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 23:
                // Woken from the timer, the work had no panel tools: it ran no step the mod saw, and ended with the ask as its report's first line.
                // Its ask stays open and its card active, now with its answers back as it waits on the person again; it is not started a second
                // time with the same reply
                _20.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 24:
                _20.sent();
                _p = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 25:
                _p.apply(void 0, [_20.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, labels()];
            case 26:
                _q.apply(void 0, [_20.sent()]).toContain('Release it');
                _r = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 27:
                _r.apply(void 0, [(_20.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 28:
                back = (_20.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                expect(back === null || back === void 0 ? void 0 : back.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                expect(back === null || back === void 0 ? void 0 : back.props.value).toBe('');
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 29:
                if (!((_15 = (_20.sent())) !== null && _15 !== void 0)) return [3 /*break*/, 30];
                _t = _15;
                return [3 /*break*/, 33];
            case 30:
                _v = (_u = JSON).stringify;
                _w = [[]];
                return [4 /*yield*/, labels()];
            case 31:
                _x = [__spreadArray.apply(void 0, _w.concat([(_20.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 32:
                _t = _v.apply(_u, [__spreadArray.apply(void 0, _x.concat([(_20.sent()), true]))]);
                _20.label = 33;
            case 33:
                _s.apply(void 0, [_t]).toBe(true);
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toHaveLength(1);
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 34:
                box2 = (_20.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_16 = box2 === null || box2 === void 0 ? void 0 : box2.key) !== null && _16 !== void 0 ? _16 : '', text: 'And the narrow window too, please.' })];
            case 35:
                _20.sent();
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('the narrow window too'); })];
                    }); }); })];
            case 36:
                _y.apply(void 0, [_20.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Here is the narrow window.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' })];
            case 37:
                _20.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 38:
                _20.sent();
                _z = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 39:
                _z.apply(void 0, [_20.sent()]).toBeDefined();
                _1 = (_0 = list).press;
                _11 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 40: return [4 /*yield*/, _1.apply(_0, [(_11.key = (_18 = (_17 = (_20.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _17 === void 0 ? void 0 : _17.key) !== null && _18 !== void 0 ? _18 : '', _11)])];
            case 41:
                _20.sent();
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 42:
                _2.apply(void 0, [_20.sent()]).toBeDefined();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 43:
                _3.apply(void 0, [_20.sent()]).toBe(true);
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 44:
                if (!((_19 = (_20.sent())) !== null && _19 !== void 0)) return [3 /*break*/, 45];
                _5 = _19;
                return [3 /*break*/, 48];
            case 45:
                _7 = (_6 = JSON).stringify;
                _8 = [[]];
                return [4 /*yield*/, labels()];
            case 46:
                _9 = [__spreadArray.apply(void 0, _8.concat([(_20.sent()), true]))];
                return [4 /*yield*/, texts()];
            case 47:
                _5 = _7.apply(_6, [__spreadArray.apply(void 0, _9.concat([(_20.sent()), true]))]);
                _20.label = 48;
            case 48:
                _4.apply(void 0, [_5]).toBe(true);
                return [4 /*yield*/, $.turn.complete({ answer: 'Released as 0.2.77.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' })];
            case 49:
                _20.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 50:
                _20.sent();
                _10 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isFinished()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 51:
                _10.apply(void 0, [_20.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 52:
                _20.sent();
                return [2 /*return*/];
        }
    });
}); });
test('once the person has answered, by a button or in their own words, the card keeps no buttons, box or send; the same ask asked again comes back fresh, in the panel and the chat: the 14 Nov "I would say maybe stop it" to "Should I stop the depth job?"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, logged, clock, list, ASK, DETAILS, inputs, labels, _b, _c, box, _d, _e, _f, _g, _h, _j, toChat, _k, _l, again, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    var _3;
    var _this = this;
    var _4, _5, _6, _7, _8;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                _a = world(on), appended = _a.appended, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _9.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'why the M4 is stuck', wait: false, origin: composer })];
            case 2:
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Why the M4 is stuck', prompt: 'why the M4 is stuck' }))];
            case 3:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _9.sent();
                ASK = 'Should I stop the depth job on your other Mac?';
                DETAILS = 'Your other Mac is using 42 of its 44 GB of swap.';
                inputs = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] })];
            case 5:
                _9.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes(ASK); })];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_9.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, labels()];
            case 7:
                _c.apply(void 0, [_9.sent()]).toEqual(expect.arrayContaining(['Stop it', 'Not now']));
                return [4 /*yield*/, inputs()];
            case 8:
                box = (_9.sent())[0];
                return [4 /*yield*/, list.input({ key: (_4 = box === null || box === void 0 ? void 0 : box.key) !== null && _4 !== void 0 ? _4 : '', text: 'I would say maybe stop it and then tell it to release it' })];
            case 9:
                _9.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('maybe stop it'); })];
                    }); }); })];
            case 10:
                _d.apply(void 0, [_9.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color) === '#8A63F0' ? true : undefined)];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_9.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You replied “I would say maybe stop it/ })];
            case 12:
                _f.apply(void 0, [_9.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, labels()];
            case 13:
                _g.apply(void 0, [(_9.sent()).filter(function (label) { return label === 'Stop it' || label === 'Not now'; })]).toEqual([]);
                _h = expect;
                return [4 /*yield*/, inputs()];
            case 14:
                _h.apply(void 0, [_9.sent()]).toEqual([]);
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: DETAILS })];
            case 15:
                _j.apply(void 0, [_9.sent()]).toBeUndefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('replied to the work "Why the M4 is stuck"'); })];
                    }); }); })];
            case 16:
                toChat = (_5 = (_9.sent())) !== null && _5 !== void 0 ? _5 : '';
                expect(toChat).toContain('asks again if it still needs');
                expect(toChat).not.toContain('It still asks');
                // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                // The work asks the same again: amber, its answers and an empty box back, and the chat shown it afresh
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] })];
            case 18:
                _9.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color) === '#E5A50A' ? true : undefined)];
                        }
                    }); }); })];
            case 19:
                _k.apply(void 0, [_9.sent()]).toBe(true);
                _l = expect;
                return [4 /*yield*/, labels()];
            case 20:
                _l.apply(void 0, [_9.sent()]).toEqual(expect.arrayContaining(['Stop it', 'Not now']));
                return [4 /*yield*/, inputs()];
            case 21:
                again = (_9.sent())[0];
                expect((_6 = again === null || again === void 0 ? void 0 : again.props.value) !== null && _6 !== void 0 ? _6 : '').toBe('');
                expect(again === null || again === void 0 ? void 0 : again.key).not.toBe(box === null || box === void 0 ? void 0 : box.key);
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You replied/ })];
            case 22:
                _m.apply(void 0, [_9.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (logged.filter(function (line) { return line.includes(ASK) && !line.startsWith('✓'); }).length === 2 ? true : undefined)];
                    }); }); })];
            case 23:
                _o.apply(void 0, [_9.sent()]).toBe(true);
                _q = (_p = list).press;
                _3 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 24: 
            // A button pressed: the ask goes whole, nothing left to press or type
            return [4 /*yield*/, _q.apply(_p, [(_3.key = (_8 = (_7 = (_9.sent()).find(function (b) { return b.props.label === 'Stop it'; })) === null || _7 === void 0 ? void 0 : _7.key) !== null && _8 !== void 0 ? _8 : '', _3)])];
            case 25:
                // A button pressed: the ask goes whole, nothing left to press or type
                _9.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Stop it"'); })];
                    }); }); })];
            case 26:
                _r.apply(void 0, [_9.sent()]).toBeDefined();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 27:
                _s.apply(void 0, [_9.sent()]).toBe(true);
                _t = expect;
                return [4 /*yield*/, labels()];
            case 28:
                _t.apply(void 0, [(_9.sent()).filter(function (label) { return label === 'Stop it' || label === 'Not now'; })]).toEqual([]);
                _u = expect;
                return [4 /*yield*/, inputs()];
            case 29:
                _u.apply(void 0, [_9.sent()]).toEqual([]);
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Stop it” · it reads this at its next step' })];
                    }); }); })];
            case 30:
                _v.apply(void 0, [_9.sent()]).toBeDefined();
                // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 31:
                // Typed in the chat and passed on by it, the same: purple, nothing to press or type; asked again, shown in the chat afresh
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] })];
            case 32:
                _9.sent();
                _w = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (logged.filter(function (line) { return line.includes(ASK) && !line.startsWith('✓'); }).length === 3 ? true : undefined)];
                    }); }); })];
            case 33:
                _w.apply(void 0, [_9.sent()]).toBe(true);
                return [4 /*yield*/, $.prompt.submit({ text: 'Show me the swap first', wait: false, origin: composer })];
            case 34:
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their reply: “Show me the swap first”' })];
            case 35:
                _9.sent();
                _x = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color) === '#8A63F0' ? true : undefined)];
                        }
                    }); }); })];
            case 36:
                _x.apply(void 0, [_9.sent()]).toBe(true);
                _y = expect;
                return [4 /*yield*/, labels()];
            case 37:
                _y.apply(void 0, [(_9.sent()).filter(function (label) { return label === 'Stop it' || label === 'Not now'; })]).toEqual([]);
                _z = expect;
                return [4 /*yield*/, inputs()];
            case 38:
                _z.apply(void 0, [_9.sent()]).toEqual([]);
                return [4 /*yield*/, clock.advance(1000)];
            case 39:
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: ASK, details: DETAILS, choices: ['Stop it', 'Not now'] })];
            case 40:
                _9.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (logged.filter(function (line) { return line.includes(ASK) && !line.startsWith('✓'); }).length === 4 ? true : undefined)];
                    }); }); })];
            case 41:
                _0.apply(void 0, [_9.sent()]).toBe(true);
                _1 = expect;
                return [4 /*yield*/, labels()];
            case 42:
                _1.apply(void 0, [_9.sent()]).toEqual(expect.arrayContaining(['Stop it', 'Not now']));
                _2 = expect;
                return [4 /*yield*/, inputs()];
            case 43:
                _2.apply(void 0, [(_9.sent()).length]).toBe(1);
                return [4 /*yield*/, list.unmount()];
            case 44:
                _9.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work acting on a reply in words to an ask it keeps open is purple, in the panel and the terminal, with its question and no buttons; stopped again it is amber with them: the 13 Nov "Explain to me the exact differences first." to "Release PR 54 to production?"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, resumed, clock, ASK, AMBER, isPurple, desk, details, edges, inTerminal, look, before, _b, _c, box, _d, acting, _e, _f, now, _i, _g, labels, _h, _j, held, _k, after, _l, _m, _o, _p, labels, _q, _r, _s, _t, _u, released, _v, _w, _x, _y, _z, _0, pane;
    var _1;
    var _this = this;
    var _2, _3, _4;
    return __generator(this, function (_5) {
        switch (_5.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), resumed = _a.resumed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _5.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'clip wallet versus affiliate', wait: false, origin: composer })];
            case 2:
                _5.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Clipify affiliate versus clip wallet', prompt: 'clip wallet versus affiliate' }))];
            case 3:
                _5.sent();
                ASK = 'Release PR 54 to production?';
                AMBER = '#E5A50A';
                isPurple = function (colour) { return /^#(8A63F0|6E3CFF)/i.test(String(colour)); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                desk = _5.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))
                    // The edge of the card beside its title, in each drawing: amber, purple or green
                ];
            case 5:
                details = _5.sent();
                edges = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return b.props.backgroundColor; }).filter(function (c) { return c === AMBER || isPurple(c); })
                            // The terminal's panel and band are drawn afresh for each look, as a terminal draws them
                        ];
                    }
                }); }); };
                inTerminal = function (of, read) { return __awaiter(_this, void 0, void 0, function () {
                    var pane, got;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, of), { surface: 'terminal' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, read(pane)];
                            case 2:
                                got = _a.sent();
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, got];
                        }
                    });
                }); };
                look = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _this = this;
                    var _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _c = {};
                                return [4 /*yield*/, desk.find({ type: 'Text', text: ASK })];
                            case 1:
                                _c.desk = (_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.props.color;
                                return [4 /*yield*/, inTerminal(LIST, function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: ASK })];
                                            case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.color];
                                        }
                                    }); }); })];
                            case 2:
                                _c.term = _e.sent();
                                return [4 /*yield*/, inTerminal(BAND, function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (t) { return t.text === ASK && t.props.color; })) === null || _a === void 0 ? void 0 : _a.props.color];
                                        }
                                    }); }); })];
                            case 3:
                                // The band's ask is a line of its own inside the line that names the work
                                _c.band = _e.sent();
                                return [4 /*yield*/, edges(desk)];
                            case 4:
                                _c.deskEdges = _e.sent();
                                return [4 /*yield*/, inTerminal(LIST, edges)];
                            case 5:
                                _c.termEdges = _e.sent();
                                return [4 /*yield*/, desk.findAll({ type: 'Button' })];
                            case 6:
                                _a = [_e.sent()];
                                return [4 /*yield*/, inTerminal(LIST, function (pane) { return pane.findAll({ type: 'Button' }); })];
                            case 7:
                                _a = _a.concat([_e.sent()]);
                                return [4 /*yield*/, inTerminal(BAND, function (pane) { return pane.findAll({ type: 'Button' }); })];
                            case 8:
                                _c.buttons = _a.concat([_e.sent()]).map(function (all) { return all.map(function (b) { return b.props.label; }); });
                                return [4 /*yield*/, details.find({ type: 'Text', text: 'Needs you now' })];
                            case 9:
                                if (!(_e.sent())) return [3 /*break*/, 10];
                                _b = 'needs';
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, details.find({ type: 'Text', text: 'Acting on your reply' })];
                            case 11:
                                _b = (_e.sent()) ? 'acting' : 'none';
                                _e.label = 12;
                            case 12: return [2 /*return*/, (_c.heading = _b,
                                    _c)];
                        }
                    });
                }); };
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Release it', 'Not now'] })];
            case 6:
                _5.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.)', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 7:
                _5.sent();
                return [4 /*yield*/, clock.advance(60000)
                    // Before the reply: it waits on the person, amber everywhere
                ];
            case 8:
                _5.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && l.deskEdges.includes(AMBER) && l.termEdges.includes(AMBER) ? l : undefined];
                            }
                        });
                    }); })];
            case 9:
                before = _5.sent();
                _b = expect;
                if (!(before !== null && before !== void 0)) return [3 /*break*/, 10];
                _c = before;
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, look()];
            case 11:
                _c = (_5.sent());
                _5.label = 12;
            case 12:
                _b.apply(void 0, [_c]).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' });
                return [4 /*yield*/, desk.findAll({ type: 'Input' })];
            case 13:
                box = (_5.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, desk.input({ key: (_2 = box === null || box === void 0 ? void 0 : box.key) !== null && _2 !== void 0 ? _2 : '', text: 'Explain to me the exact differences first.' })];
            case 14:
                _5.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('Explain to me the exact differences first.'); })];
                    }); }); })];
            case 15:
                _d.apply(void 0, [_5.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, isPurple(l.desk) && isPurple(l.term) && isPurple(l.band) && l.heading === 'acting' ? l : undefined];
                            }
                        });
                    }); })];
            case 16:
                acting = _5.sent();
                _e = expect;
                if (!(acting !== null && acting !== void 0)) return [3 /*break*/, 17];
                _f = acting;
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, look()];
            case 18:
                _f = (_5.sent());
                _5.label = 19;
            case 19:
                _e.apply(void 0, [_f]).toMatchObject({ heading: 'acting' });
                return [4 /*yield*/, look()];
            case 20:
                now = _5.sent();
                expect(now.deskEdges.filter(function (c) { return c === AMBER; })).toEqual([]);
                expect(now.termEdges.filter(function (c) { return c === AMBER; })).toEqual([]);
                expect(now.deskEdges.some(isPurple)).toBe(true);
                expect(now.termEdges.some(isPurple)).toBe(true);
                for (_i = 0, _g = now.buttons; _i < _g.length; _i++) {
                    labels = _g[_i];
                    expect(labels.filter(function (label) { return label === 'Release it' || label === 'Not now'; })).toEqual([]);
                }
                _h = expect;
                return [4 /*yield*/, details.findAll({ type: 'Button' })];
            case 21:
                _h.apply(void 0, [(_5.sent()).some(function (b) { return b.props.label === 'Release it'; })]).toBe(false);
                _j = expect;
                return [4 /*yield*/, details.findAll({ type: 'Input' })];
            case 22:
                _j.apply(void 0, [(_5.sent()).some(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                // Its turn ends while a command it started in the background still runs, the engine listing it as running: it has not stopped,
                // and stays purple
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Writing up the differences.', durationMs: 1, isAborted: false, turnId: 'turn-2a', reason: 'answer', agentId: 'a1' })];
            case 23:
                _5.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 24:
                _5.sent();
                return [4 /*yield*/, look()];
            case 25:
                held = _5.sent();
                expect([isPurple(held.desk), isPurple(held.term), isPurple(held.band), held.heading]).toEqual([true, true, true, 'acting']);
                agents.a1 = 'completed';
                // The header counts it as running, not as needing the person
                _k = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: 'Working on 1 thing' })];
            case 26:
                // The header counts it as running, not as needing the person
                _k.apply(void 0, [_5.sent()]).toBeDefined();
                // It stops again with the ask still open, the engine listing it as running for a moment as its turn ends: amber again a moment
                // later, once the engine lists its run as over
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Release PR 54 to production? (Answers: Release it / Not now.) The differences are…', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })
                    // Listed as idle after, as the engine lists some ended work
                ];
            case 27:
                _5.sent();
                // Listed as idle after, as the engine lists some ended work
                agents.a1 = 'idle';
                return [4 /*yield*/, clock.advance(2000)];
            case 28:
                _5.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.desk === AMBER && l.term === AMBER && l.band === AMBER && l.heading === 'needs' && !l.deskEdges.some(isPurple) && !l.termEdges.some(isPurple) ? l : undefined];
                            }
                        });
                    }); })];
            case 29:
                after = _5.sent();
                _l = expect;
                if (!(after !== null && after !== void 0)) return [3 /*break*/, 30];
                _m = after;
                return [3 /*break*/, 32];
            case 30: return [4 /*yield*/, look()];
            case 31:
                _m = (_5.sent());
                _5.label = 32;
            case 32:
                _l.apply(void 0, [_m]).toMatchObject({ desk: AMBER, term: AMBER, band: AMBER, heading: 'needs' });
                _o = 0;
                return [4 /*yield*/, look()];
            case 33:
                _p = (_5.sent()).buttons;
                _5.label = 34;
            case 34:
                if (!(_o < _p.length)) return [3 /*break*/, 36];
                labels = _p[_o];
                expect(labels).toEqual(expect.arrayContaining(['Release it', 'Not now']));
                _5.label = 35;
            case 35:
                _o++;
                return [3 /*break*/, 34];
            case 36:
                _q = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: '1 thing needs you' })];
            case 37:
                _q.apply(void 0, [_5.sent()]).toBeDefined();
                _s = (_r = desk).press;
                _1 = {};
                return [4 /*yield*/, desk.findAll({ type: 'Button' })];
            case 38: 
            // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
            return [4 /*yield*/, _s.apply(_r, [(_1.key = (_4 = (_3 = (_5.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _3 === void 0 ? void 0 : _3.key) !== null && _4 !== void 0 ? _4 : '', _1)])];
            case 39:
                // Release it pressed goes back to the work and the ask goes; the card is at work on it, purple, until the work is done
                _5.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 40:
                _t.apply(void 0, [_5.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: ASK })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 41:
                _u.apply(void 0, [_5.sent()]).toBe(true);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var l;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, look()];
                                case 1:
                                    l = _a.sent();
                                    return [2 /*return*/, l.deskEdges.some(isPurple) && !l.deskEdges.includes(AMBER) && l.termEdges.some(isPurple) && !l.termEdges.includes(AMBER) ? l : undefined];
                            }
                        });
                    }); })];
            case 42:
                released = _5.sent();
                _v = expect;
                if (!(released !== null && released !== void 0)) return [3 /*break*/, 43];
                _w = released;
                return [3 /*break*/, 45];
            case 43: return [4 /*yield*/, look()];
            case 44:
                _w = (_5.sent());
                _5.label = 45;
            case 45:
                _v.apply(void 0, [_w]).toMatchObject({ desk: undefined });
                expect(released === null || released === void 0 ? void 0 : released.heading).toBe('none');
                // Releasing in the background, its turn ends with the engine still holding it: at work, purple, until it is done
                agents.a1 = 'running';
                return [4 /*yield*/, $.turn.complete({ answer: 'Releasing in the background.', durationMs: 1, isAborted: false, turnId: 'turn-3a', reason: 'answer', agentId: 'a1' })];
            case 46:
                _5.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 47:
                _5.sent();
                _x = expect;
                return [4 /*yield*/, edges(desk)];
            case 48:
                _x.apply(void 0, [(_5.sent()).some(isPurple)]).toBe(true);
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Released PR 54.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a1' })];
            case 49:
                _5.sent();
                return [4 /*yield*/, clock.advance(60000)];
            case 50:
                _5.sent();
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, edges(desk)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(isPurple) ? undefined : true)];
                        }
                    }); }); })];
            case 51:
                _y.apply(void 0, [_5.sent()]).toBe(true);
                _z = 0, _0 = [desk, details];
                _5.label = 52;
            case 52:
                if (!(_z < _0.length)) return [3 /*break*/, 55];
                pane = _0[_z];
                return [4 /*yield*/, pane.unmount()];
            case 53:
                _5.sent();
                _5.label = 54;
            case 54:
                _z++;
                return [3 /*break*/, 52];
            case 55: return [2 /*return*/];
        }
    });
}); });
test('every ask also shows in the chat as the mod\'s notice, never as the person\'s message, with its answers and pictures; an answer typed there reaches the work and the card stops asking', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, submitted, logged, files, clock, list, asked, inChat, relay, _b, _c, _d, _e, _f, _g, _h, _j;
    var _k;
    var _this = this;
    var _l, _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                _a = world(on), appended = _a.appended, submitted = _a.submitted, logged = _a.logged, files = _a.files, clock = _a.clock;
                files.set('/w/shots/a.png', 'png');
                files.set('/w/shots/b.png', 'png');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _q.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw the logo', wait: false, origin: composer })];
            case 2:
                _q.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw the logo', prompt: 'redraw the logo' }))];
            case 3:
                _q.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _q.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png', '/w/shots/gone.png', 'rel.png'] })];
            case 5:
                asked = _q.sent();
                expect(String(asked.result)).toContain('shown in the chat as a notice from the panel');
                expect(String(asked.result)).toContain('Its 2 pictures are drawn small on the card');
                expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here');
                // The chat shows the ask as the mod's notice, never a prompt in the person's place, with what it asks, its answers and its pictures
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                // The chat shows the ask as the mod's notice, never a prompt in the person's place, with what it asks, its answers and its pictures
                _q.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('Which logo do you want?'); })];
                    }); }); })];
            case 7:
                inChat = (_l = (_q.sent())) !== null && _l !== void 0 ? _l : '';
                expect(submitted.some(function (line) { return line.includes('Which logo do you want?'); })).toBe(false);
                expect(inChat).toContain('The work "Redraw the logo" needs the person: Which logo do you want?');
                expect(inChat).toContain('Answers: A · B, or a reply in the person\'s own words, here or on its card.');
                expect(inChat).toContain('Pictures: /w/shots/a.png, /w/shots/b.png');
                // The chat's model reads the ask, and how to pass an answer on, in a row the person does not see
                expect(inChat).not.toContain('SendMessage');
                relay = (_m = appended.find(function (line) { return line.startsWith('undefined: The background work "Redraw the logo" asked the person'); })) !== null && _m !== void 0 ? _m : '';
                expect(relay).toContain('Which logo do you want? (answers: A · B; pictures: /w/shots/a.png, /w/shots/b.png)');
                expect(relay).toContain('do not pass it on');
                expect(relay).toContain('SendUserFile');
                // Pictures sent as "proactive" did not show in the chat; "normal" ones did
                expect(relay).toContain('status "normal"');
                expect(relay).not.toContain('proactive');
                expect(relay).toContain('SendMessage to "a1"');
                // The same ask said again is not sent again
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png'] })];
            case 8:
                // The same ask said again is not sent again
                _q.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 9:
                _q.sent();
                expect(logged.filter(function (line) { return line.includes('Which logo do you want?'); })).toHaveLength(1);
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                return [4 /*yield*/, $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })];
            case 10:
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                _q.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' })];
            case 11:
                _q.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Which logo do you want?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_q.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your ask: \"Which logo do you want?\""); })];
                    }); }); })];
            case 13:
                _c.apply(void 0, [_q.sent()]).toBeDefined();
                expect(appended.some(function (line) { return line.includes('Decide which of three it is'); })).toBe(false);
                // A press on the card no longer counts for that ask
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 14:
                // A press on the card no longer counts for that ask
                _d.apply(void 0, [(_q.sent()).find(function (b) { return b.props.label === 'B'; })]).toBeUndefined();
                // An ask answered on the card is said in the chat, which sees and reads it; one the work withdraws is said too
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push', 'Not now'] })];
            case 15:
                // An ask answered on the card is said in the chat, which sees and reads it; one the work withdraws is said too
                _q.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 16:
                _q.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.some(function (line) { return line.includes('May I push it?'); }) || undefined];
                    }); }); })];
            case 17:
                _e.apply(void 0, [_q.sent()]).toBe(true);
                _g = (_f = list).press;
                _k = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18: return [4 /*yield*/, _g.apply(_f, [(_k.key = (_p = (_o = (_q.sent()).find(function (b) { return b.props.label === 'Push'; })) === null || _o === void 0 ? void 0 : _o.key) !== null && _p !== void 0 ? _p : '', _k)])];
            case 19:
                _q.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ✓ The person answered the work "Redraw the logo" on its card: “Push”'); })];
                    }); }); })];
            case 20:
                _h.apply(void 0, [_q.sent()]).toBeDefined();
                expect(logged.some(function (line) { return line.startsWith('✓ The person answered the work "Redraw the logo" on its card: “Push”'); })).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' })];
            case 21:
                _q.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 22:
                _q.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.some(function (line) { return line.includes('Answers: Done · Not now'); }) || undefined];
                    }); }); })];
            case 23:
                _j.apply(void 0, [_q.sent()]).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' })];
            case 24:
                _q.sent();
                expect(appended.some(function (line) { return line === 'undefined: The work "Redraw the logo" no longer asks the person anything.'; })).toBe(true);
                expect(logged.some(function (line) { return line === 'The work "Redraw the logo" no longer asks the person anything.'; })).toBe(true);
                expect(submitted).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 25:
                _q.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an ask carries what it is about, whole, on the small card, in Details and in the chat: the 13 Nov "Release PR 54, with the exact differences as explained in the chat?" asked before its explanation arrived', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, logged, clock, notified, list, away, _b, _i, _c, text, _d, _e, _f, _g, text, _h, _j, bare, differences, asked, _k, big, _l, band, _m, notice, relay, _o, _p, _q, _r, long, cutShort, _s, question, many, _t, _u, _v, longRelay;
    var _w;
    var _this = this;
    var _x, _y, _z, _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
            case 0:
                _a = world(on), appended = _a.appended, logged = _a.logged, clock = _a.clock, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _2.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the wallet', wait: false, origin: composer })];
            case 2:
                _2.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the wallet', prompt: 'fix the wallet' }))];
            case 3:
                _2.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // What happened: the ask pointed at an explanation that reached the person only with the report, after the work ended. Now it is
                    // not shown at all: no card, no sound, no notice
                ];
            case 4:
                list = _2.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it', 'Not now'] })];
            case 5:
                away = _2.sent();
                expect(String(away.result)).toContain('Not shown: the ask points at an explanation it does not carry');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Release PR 54/ })];
            case 6:
                _b.apply(void 0, [_2.sent()]).toBeUndefined();
                expect(notified.some(function (line) { return line.includes('Release PR 54'); })).toBe(false);
                _i = 0, _c = ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?'];
                _2.label = 7;
            case 7:
                if (!(_i < _c.length)) return [3 /*break*/, 10];
                text = _c[_i];
                _d = expect;
                _e = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text, choices: ['Release it', 'Not now'] })];
            case 8:
                _d.apply(void 0, [_e.apply(void 0, [(_2.sent()).result])]).toContain('Not shown');
                _2.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                _f = 0, _g = ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?'];
                _2.label = 11;
            case 11:
                if (!(_f < _g.length)) return [3 /*break*/, 14];
                text = _g[_f];
                _h = expect;
                _j = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text })];
            case 12:
                _h.apply(void 0, [_j.apply(void 0, [(_2.sent()).result])]).toContain('Shown on your card');
                _2.label = 13;
            case 13:
                _f++;
                return [3 /*break*/, 11];
            case 14: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it', 'Not now'] })];
            case 15:
                bare = _2.sent();
                expect(String(bare.result)).toContain('It carries no details');
                differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it', 'Not now'] })];
            case 16:
                asked = _2.sent();
                expect(String(asked.result)).toContain('what it is about under it');
                expect(String(asked.result)).not.toContain('carries no details');
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 17:
                _k.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 18:
                big = _2.sent();
                _l = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: differences })];
            case 19:
                _l.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 20:
                band = _2.sent();
                _m = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /What it is about is in the chat above and on its card/ })];
            case 21:
                _m.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()
                    // The chat's notice carries it whole, before the answers, plain (no marks for bold), and so does the row the chat's model reads
                ];
            case 22:
                _2.sent();
                // The chat's notice carries it whole, before the answers, plain (no marks for bold), and so does the row the chat's model reads
                return [4 /*yield*/, clock.advance(10)];
            case 23:
                // The chat's notice carries it whole, before the answers, plain (no marks for bold), and so does the row the chat's model reads
                _2.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('Release PR 54 to production?') && line.includes('What it is about'); })];
                    }); }); })];
            case 24:
                notice = (_x = (_2.sent())) !== null && _x !== void 0 ? _x : '';
                expect(notice).toContain("Release PR 54 to production?\nWhat it is about:\n".concat(differences.replaceAll('**', ''), "\nAnswers: Release it \u00B7 Not now"));
                relay = (_y = __spreadArray([], appended, true).reverse().find(function (line) { return line.startsWith('undefined: The background work "Fix the wallet" asked the person') && line.includes('Release PR 54 to production?'); })) !== null && _y !== void 0 ? _y : '';
                expect(relay).toContain("what it is about, shown to the person whole with it on the card and in the notice: ".concat(differences));
                // The chat is told not to say it again: the person has just read it
                expect(relay).toContain('do not repeat what it is about');
                _p = (_o = list).press;
                _w = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 25: 
            // A pressed answer still matches the ask that carries details
            return [4 /*yield*/, _p.apply(_o, [(_w.key = (_0 = (_z = (_2.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _z === void 0 ? void 0 : _z.key) !== null && _0 !== void 0 ? _0 : '', _w)])];
            case 26:
                // A pressed answer still matches the ask that carries details
                _2.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?'); })];
                    }); }); })];
            case 27:
                _q.apply(void 0, [_2.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 28:
                _r.apply(void 0, [_2.sent()]).toBeUndefined();
                long = "Release it? ".concat('The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)).trim();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it', 'Not now'] })];
            case 29:
                cutShort = _2.sent();
                expect(String(cutShort.result)).toContain('whole at the top of its details');
                _s = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: long })];
            case 30:
                _s.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, big.findAll({ type: 'Text' })];
            case 31:
                question = (_2.sent()).find(function (one) { return one.props.bold && String(one.text).startsWith('Release it? The refund rule'); });
                expect(question).toBeDefined();
                expect(String(question === null || question === void 0 ? void 0 : question.text).length).toBeLessThanOrEqual(302);
                expect(String(question === null || question === void 0 ? void 0 : question.text)).toMatch(/[a-z.] …$/);
                many = Array.from({ length: 120 }, function (_, n) { return "- Line ".concat(n + 1, " of what changes on the payout screens."); }).join('\n');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it', 'Not now'] })];
            case 32:
                _2.sent();
                _t = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: many })];
            case 33:
                _t.apply(void 0, [_2.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })];
            case 34:
                _u.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(10)];
            case 35:
                _2.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('Line 120 of what changes'); })];
                    }); }); })];
            case 36:
                _v.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], appended, true).reverse().find(function (line) { return line.includes('Release the payout screens?') && line.includes('asked the person'); })];
                    }); }); })];
            case 37:
                longRelay = (_1 = (_2.sent())) !== null && _1 !== void 0 ? _1 : '';
                expect(longRelay).toContain('(the rest is on the card)');
                expect(longRelay).not.toContain('Line 120 of what changes');
                return [4 /*yield*/, big.unmount()];
            case 38:
                _2.sent();
                return [4 /*yield*/, list.unmount()];
            case 39:
                _2.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an answer to ended work that cannot be started again is left in the chat as the mod\'s notice and a row its model reads, never in the person\'s place', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, submitted, logged, appended, list, _b, _c, _d, _e;
    var _f;
    var _this = this;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { unresumable: new Set(['a1']) }), submitted = _a.submitted, logged = _a.logged, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'pick a colour', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Pick a colour', prompt: 'pick a colour' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Red or blue?', choices: ['Red', 'Blue'] })];
            case 5:
                _j.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on your colour.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 6:
                _j.sent();
                _c = (_b = list).press;
                _f = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Blue'; })];
                        }
                    }); }); })];
            case 7: return [4 /*yield*/, _c.apply(_b, [(_f.key = (_h = (_g = (_j.sent())) === null || _g === void 0 ? void 0 : _g.key) !== null && _h !== void 0 ? _h : '', _f)])];
            case 8:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('answered on its card what the work "Pick a colour" asked after it ended (Red or blue?)'); })];
                    }); }); })];
            case 9:
                _d.apply(void 0, [_j.sent()]).toContain('(Red or blue?): Blue');
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ') && line.includes('could not be started again'); })];
                    }); }); })];
            case 10:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                expect(submitted.some(function (line) { return line.includes('Blue'); })).toBe(false);
                return [4 /*yield*/, list.unmount()];
            case 11:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, id, list, _b, field, _c, value, _d, _e, third, curly, before, _f, again, other, cancel, _g, _h, _j, _k;
    var _this = this;
    var _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 2:
                _r.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _r.sent();
                return [4 /*yield*/, clock.advance(1000)
                    // The chat is told only the name, and where to type it
                ];
            case 4:
                _r.sent();
                // The chat is told only the name, and where to type it
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('GITHUB_TOKEN'); })];
                    }); }); })];
            case 5:
                // The chat is told only the name, and where to type it
                _b.apply(void 0, [_r.sent()]).toContain('top of the Claudopus panel');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-field")); })];
                        }
                    }); }); })];
            case 6:
                field = _r.sent();
                expect(field).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_BOX })];
            case 7:
                _c.apply(void 0, [(_l = (_r.sent())) === null || _l === void 0 ? void 0 : _l.props.color]).toBe('#E5A50A');
                value = 'ghp_s3cret"with\\quote';
                return [4 /*yield*/, list.input({ key: (_m = field === null || field === void 0 ? void 0 : field.key) !== null && _m !== void 0 ? _m : '', text: value })
                    // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
                ];
            case 8:
                _r.sent();
                // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(id); })];
                    }); }); })];
            case 9:
                // It goes to the keychain under the box's id, escaped for security's own reading, and the box goes
                _d.apply(void 0, [_r.sent()]).toBe("add-generic-password -U -s \"claudopus-box\" -a \"".concat(id, "\" -l \"Claudopus box\" -w \"ghp_s3cret\\\"with\\\\quote\"\n"));
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_BOX })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 10:
                _e.apply(void 0, [_r.sent()]).toBe(true);
                // Nowhere else: not the chat, its saved words, the log or any file
                expect(logged.some(function (line) { return line.includes('s3cret'); })).toBe(false);
                expect(__spreadArray([], files.values(), true).some(function (text) { return text.includes('s3cret'); })).toBe(false);
                third = '2f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(third, ".json"), JSON.stringify({ id: third, kind: 'secret', name: 'NPM_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 11:
                _r.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(third, "-field")); })];
                        }
                    }); }); })];
            case 12:
                curly = _r.sent();
                before = keychain.length;
                return [4 /*yield*/, list.input({ key: (_o = curly === null || curly === void 0 ? void 0 : curly.key) !== null && _o !== void 0 ? _o : '', text: 'it’s-mine' })];
            case 13:
                _r.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('That held a line break, a curly quote'); })];
                        }
                    }); }); })];
            case 14:
                _f.apply(void 0, [_r.sent()]).toBeDefined();
                // and one whose runner has stopped takes nothing
                files.delete("".concat(MEMORY, "/boxes/").concat(third, ".json"));
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 15:
                again = (_r.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(third, "-field")); });
                return [4 /*yield*/, list.input({ key: (_p = again === null || again === void 0 ? void 0 : again.key) !== null && _p !== void 0 ? _p : '', text: 'plain-value-1234' })];
            case 16:
                _r.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _r.sent();
                expect(keychain.length).toBe(before);
                other = '1f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(other, ".json"), JSON.stringify({ id: other, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 18:
                _r.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(other, "-cancel")); })];
                        }
                    }); }); })];
            case 19:
                cancel = _r.sent();
                return [4 /*yield*/, list.press({ key: (_q = cancel === null || cancel === void 0 ? void 0 : cancel.key) !== null && _q !== void 0 ? _q : '' })];
            case 20:
                _r.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (files.has("".concat(MEMORY, "/boxes/").concat(other, ".json")) ? undefined : true)];
                    }); }); })];
            case 21:
                _g.apply(void 0, [_r.sent()]).toBe(true);
                // Its place says what was done, for a minute
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You cancelled · nothing was saved, and what asked for it stops without it' })];
                    }); }); })];
            case 22:
                // Its place says what was done, for a minute
                _h.apply(void 0, [_r.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'The admin password of this Mac' })];
            case 23:
                _j.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(61000)];
            case 24:
                _r.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'The admin password of this Mac' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 25:
                _k.apply(void 0, [_r.sent()]).toBe(true);
                return [4 /*yield*/, settle()];
            case 26:
                _r.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a chat on this Mac\'s own screen asks in the panel the same way, and opens the panel for it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, opened, id, list, _b, field, _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 1:
                _e.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                id = '0f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _e.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, logged.find(function (line) { return line.includes('GITHUB_TOKEN'); })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toContain('top of the Claudopus panel');
                // The chat takes the request, which tells the runner a panel asks, and brings the panel up with the field ready
                expect(opened.filter(function (one) { return one === 'claudopus'; }).length).toBeGreaterThan(0);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("box-".concat(id, "-field")); })];
                        }
                    }); }); })];
            case 5:
                field = _e.sent();
                return [4 /*yield*/, list.input({ key: (_d = field === null || field === void 0 ? void 0 : field.key) !== null && _d !== void 0 ? _d : '', text: 'made-up-local-k3y' })];
            case 6:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(id); })];
                    }); }); })];
            case 7:
                _c.apply(void 0, [_e.sent()]).toContain('-w "made-up-local-k3y"');
                expect(logged.some(function (line) { return line.includes('local-k3y'); })).toBe(false);
                expect(__spreadArray([], files.values(), true).some(function (text) { return text.includes('local-k3y'); })).toBe(false);
                return [4 /*yield*/, settle()];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a request of another chat's, or of this chat's with no runner of its own running, is drawn nowhere here; this chat's own while its runner runs is drawn first", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, clock, list, older, mine, _b, fields, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _d.sent();
                older = '5f1e2d3c-4b5a-4987-a654-3210fedcba98';
                mine = '6f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(older, ".json"), JSON.stringify({ id: older, kind: 'secret', name: 'NPM_TOKEN', chat: 'another-chat', at: 1700000000000 }));
                files.set("".concat(MEMORY, "/boxes/").concat(mine, ".json"), JSON.stringify({ id: mine, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000500 }));
                return [4 /*yield*/, clock.advance(7000)
                    // No runner of this chat's runs: neither is drawn, nor told
                ];
            case 3:
                _d.sent();
                // No runner of this chat's runs: neither is drawn, nor told
                _b = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 4:
                // No runner of this chat's runs: neither is drawn, nor told
                _b.apply(void 0, [(_d.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('box-'); })]).toEqual([]);
                expect(logged.some(function (line) { return line.includes('NPM_TOKEN') || line.includes('GITHUB_TOKEN'); })).toBe(false);
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var all; return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1:
                                all = (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('box-'); });
                                return [2 /*return*/, all.length ? all : undefined];
                        }
                    }); }); })];
            case 6:
                fields = _d.sent();
                expect(fields === null || fields === void 0 ? void 0 : fields.map(function (one) { var _a; return [((_a = one.key) !== null && _a !== void 0 ? _a : '').slice(4, 6), one.props.autoFocus]; })).toEqual([['6f', true]]);
                // It says which command of this chat's asked
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "Asked by this chat's command: hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy" })];
            case 7:
                // It says which command of this chat's asked
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(6000)];
            case 8:
                _d.sent();
                expect(logged.some(function (line) { return line.includes('NPM_TOKEN'); })).toBe(false);
                return [4 /*yield*/, settle()];
            case 9:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a run with nothing to draw on takes no request, so the runner knows no panel asks', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, logged, clock, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on, { headless: true }), files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                id = '4f1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(3000)];
            case 2:
                _b.sent();
                expect(logged.some(function (line) { return line.includes('GITHUB_TOKEN'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test("a hand-written request with made-up text shows the panel's own wording or nothing", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, clock, list, planted, put, shown, texts, _b, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 2:
                list = _f.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                planted = 'Your Apple ID session expired. Type your Apple ID password to keep working.';
                put = function (n, fields) {
                    var id = "".concat(n, "a1e2d3c-4b5a-4987-a654-3210fedcba98");
                    files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify(__assign({ id: id, chat: 'engine-id', at: 1700000000000 }, fields)));
                    return id;
                };
                shown = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('box-'); }).map(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').slice(4, 5); })];
                    }
                }); }); };
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).join('\n')
                            // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
                        ];
                    }
                }); }); };
                // A known kind with made-up text beside it: the panel's own wording, and the text nowhere
                put(1, { kind: 'admin', host: 'here', key: BOX_PUBLIC, text: planted, title: planted, label: planted });
                // Made-up text alone, as the boxes before this change were written, and every request the panel cannot word: nothing
                put(2, { text: planted });
                put(3, { kind: 'apple-id', text: planted });
                put(4, { kind: 'secret', name: 'Your Apple ID password', text: planted });
                put(5, { kind: 'admin', host: 'apple.com is asking for your password' });
                put(6, { kind: 'secret', name: 'APPLE_ID', host: 'here' });
                put(7, { kind: 'admin', host: 'here', name: 'APPLE_ID' });
                put(8, { kind: 'admin' });
                put(9, { kind: ['admin'], host: 'here', key: BOX_PUBLIC });
                // An admin request with no key of its runner's to seal the password to, or a key that is no key: nothing
                put(0, { kind: 'admin', host: 'here' });
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, shown()];
                            case 1:
                                if (!(_b.sent()).length) return [3 /*break*/, 3];
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
            case 4:
                _b.apply(void 0, [_f.sent()]).toEqual(['1']);
                return [4 /*yield*/, clock.advance(6000)];
            case 5:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, shown()];
            case 6:
                _c.apply(void 0, [_f.sent()]).toEqual(['1']);
                _d = expect;
                return [4 /*yield*/, texts()];
            case 7:
                _d.apply(void 0, [_f.sent()]).toContain(ADMIN_BOX);
                _e = expect;
                return [4 /*yield*/, texts()];
            case 8:
                _e.apply(void 0, [_f.sent()]).not.toContain('Apple');
                expect(logged.some(function (line) { return line.includes('Apple'); })).toBe(false);
                // The notice in the chat is the panel's wording too
                expect(logged.find(function (line) { return line.includes('admin password of this Mac'); })).toContain('top of the Claudopus panel');
                return [4 /*yield*/, settle()];
            case 9:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the box words what the runners ask from its fields: a key by name, a Mac by host, why it asks again, and a key saved by hand by its name first', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, clock, list, put, texts, all;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                ];
            case 2:
                list = _b.sent();
                // A runner of this chat's runs and waits for the box, as bin/secret does: only then is a request of this chat's drawn
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                put = function (n, fields) {
                    var id = "".concat(n, "b1e2d3c-4b5a-4987-a654-3210fedcba98");
                    files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify(__assign({ id: id, chat: 'engine-id', at: 1700000000000 + n }, fields)));
                };
                put(1, { kind: 'secret', name: 'GITHUB_TOKEN' });
                put(2, { kind: 'admin', host: 'dima@m4.local', key: BOX_PUBLIC, again: 'refused' });
                put(3, { kind: 'secret', name: 'NPM_TOKEN', again: 'short' });
                put(4, { kind: 'secret', name: 'OPENAI_KEY', again: 'Type your Apple ID password' });
                put(5, { kind: 'secret' });
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _b.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; })];
                    }
                }); }); };
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1:
                                if (!((_b.sent()).filter(function (one) { return one.startsWith('Claudopus needs') || one.includes('Claudopus needs') || one.startsWith('Name of'); }).length >= 5)) return [3 /*break*/, 3];
                                return [4 /*yield*/, texts()];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = undefined;
                                _b.label = 4;
                            case 4: return [2 /*return*/, (_a)];
                        }
                    }); }); })];
            case 4:
                all = _b.sent();
                expect(all).toContain(GITHUB_BOX);
                expect(all).toContain('That password was refused. Claudopus needs the admin password of dima@m4.local to run the admin command below. Nothing is kept: it goes only to that command, and the next one asks again.');
                expect(all).toContain("That was shorter than 4 characters. ".concat(NPM_BOX));
                // A reason it does not know is left out
                expect(all).toContain("Claudopus needs OPENAI_KEY. It is kept only in this Mac's keychain, and work uses it by name, hidden in what its commands print.");
                expect(all === null || all === void 0 ? void 0 : all.join('\n')).not.toContain('Apple');
                expect(all).toContain('Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.');
                return [4 /*yield*/, settle()];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a copy a reload replaced wakes no work: its timers stop, an answer left for its work stays for the copy in charge, and a press it still gets goes to the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, appended, files, clock, isNewer, list, at, approve, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, appended = _a.appended, files = _a.files, clock = _a.clock;
                isNewer = false;
                on('state.get', function (_, e, next) { return (e.key === 'load' && isNewer ? { value: { value: "".concat('9'.repeat(15), "-a-newer-load"), version: 99 } } : next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] })];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 6:
                _d.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
                ];
            case 7:
                _d.sent();
                // A newer load takes charge in this chat, as a /reload-plugins does; this copy's timers run on beside it, as the engine leaves them
                isNewer = true;
                at = 1700000002000;
                files.set("".concat(MEMORY, "/live/answers/engine-id/0-a.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: false, ask: 'May I restart it?', askAt: at - 2000, at: at }));
                return [4 /*yield*/, clock.advance(10000)
                    // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
                ];
            case 8:
                _d.sent();
                // Work this copy woke would run under it, and the engine calls none of its hooks there: so it wakes none, and leaves the answer
                expect(__spreadArray(['by its timers'], resumed.filter(function (line) { return line.startsWith('a1: '); }), true)).toEqual(['by its timers']);
                expect(files.has("".concat(MEMORY, "/live/answers/engine-id/0-a.json"))).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                approve = (_c = (_d.sent()).find(function (b) { return b.props.label === 'Approve'; })) === null || _c === void 0 ? void 0 : _c.key;
                expect(approve).toBeDefined();
                if (!approve) return [3 /*break*/, 12];
                return [4 /*yield*/, list.press({ key: approve })];
            case 10:
                _d.sent();
                expect(__spreadArray(['by a press'], resumed.filter(function (line) { return line.startsWith('a1: '); }), true)).toEqual(['by a press']);
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.includes('Approve') && line.includes('May I restart it?'); })];
                    }); }); })];
            case 11:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _d.label = 12;
            case 12: return [4 /*yield*/, list.unmount()];
            case 13:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('F-013 · an answer another chat left in a file for ended work wakes nothing: it is put away unread, and only a press in this chat answers', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, resumed, files, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), resumed = _a.resumed, files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'restart the old chat', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Restart the old chat', prompt: 'restart the old chat' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I restart it?', choices: ['Approve', 'Not now'] })];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'It waits on your go-ahead.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 5:
                _b.sent();
                files.set("".concat(MEMORY, "/live/answers/engine-id/0-a.json"), JSON.stringify({ card: 'a1', choice: 'Approve', isReply: true, ask: 'May I restart it?', askAt: 1700000000000, at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(6000)];
            case 6:
                _b.sent();
                expect(files.has("".concat(MEMORY, "/live/answers/engine-id/0-a.json"))).toBe(false);
                return [4 /*yield*/, $.prompt.submit({ text: 'and the logs?', wait: false, origin: composer })];
            case 7:
                _b.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 8:
                _b.sent();
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toEqual([]);
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('put away unread');
                return [2 /*return*/];
        }
    });
}); });
test('in a chat run from another Mac a command for the person is given whole, with its folder, and nothing offers to open a terminal here', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, terminals, shown, list, bare, _b, told, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), terminals = _a.terminals, shown = _a.shown;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'sign me in', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sign in', prompt: 'sign me in' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // A relative path with no folder named is not shown: it would be typed somewhere else, where it does not exist
                ];
            case 4:
                list = _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Run the release.', command: 'mods/claudopus/bin/release' })];
            case 5:
                bare = _f.sent();
                expect(String(bare.result)).toContain('Not shown');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run the release.' })];
            case 6:
                _b.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Sign in to GitHub.', command: 'gh auth login', cwd: '/repo/site' })];
            case 7:
                told = _f.sent();
                expect(String(told.result)).toContain("cd '/repo/site' && gh auth login");
                expect(String(told.result)).not.toContain('Open in Terminal');
                expect(String(told.result)).toContain('nothing opens a terminal here');
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "cd '/repo/site' && gh auth login" })];
            case 8:
                _c.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.props.mono]).toBe(true);
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                _d.apply(void 0, [(_f.sent()).find(function (b) { return b.props.label === 'Open in Terminal'; })]).toBeUndefined();
                expect(terminals).toEqual([]);
                expect(shown.some(function (argv) { return String(argv[1]).endsWith('/open.command'); })).toBe(false);
                return [4 /*yield*/, list.unmount()];
            case 10:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
// A press on an ask draws the card answered from the press itself: its buttons and box go in the press's own drawing, before the
// answer is written to the card's file or reaches the work
var askScene = function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, hold, fails, list, key, answers;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                w = world(on);
                fails = 0;
                on('state.set', function (_, e, next) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (e.key !== 'todos')
                                    return [2 /*return*/, next(e)
                                        // Refused, as a write another copy beat would be, again and again: the card's file is never written
                                    ];
                                // Refused, as a write another copy beat would be, again and again: the card's file is never written
                                if (fails > 0) {
                                    fails -= 1;
                                    return [2 /*return*/, { value: { isSet: false, version: -1 } }];
                                }
                                if (!hold) return [3 /*break*/, 2];
                                return [4 /*yield*/, hold];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, next(e)];
                        }
                    });
                }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'release it', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Ship the branch', prompt: 'ship it' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release the branch?', choices: ['Release it', 'Not now'] })];
            case 5:
                _a.sent();
                key = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    var _this = this;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = String;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === label; })];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _a.apply(void 0, [(_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : ''])];
                        }
                    });
                }); };
                answers = function () { return w.appended.filter(function (line) { return line.startsWith('a1: ') && line.includes('in answer to your ask'); }); };
                return [2 /*return*/, __assign(__assign({}, w), { list: list, key: key, answers: answers, holdWrites: function (until) { return void (hold = until); }, failWrites: function (n) { return void (fails = n); }, freeWrites: function () { return void (hold = undefined); } })];
        }
    });
}); };
test("a press on an ask shows it answered in the press's own drawing, before the answer is written, with no buttons or box left", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, release, free, pressing, _a, _b, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, askScene($, on)];
            case 1:
                s = _f.sent();
                return [4 /*yield*/, s.key('Release it')];
            case 2:
                release = _f.sent();
                free = function () { return undefined; };
                s.holdWrites(new Promise(function (done) { return (free = done); }));
                pressing = s.list.press({ key: release });
                // The card's file is not yet written: the card says what was pressed, and nothing is left to press
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · on its way to the work' })];
                    }); }); })];
            case 3:
                // The card's file is not yet written: the card says what was pressed, and nothing is left to press
                _a.apply(void 0, [_f.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, s.list.findAll({ type: 'Button' })];
            case 4:
                _b.apply(void 0, [(_f.sent()).some(function (b) { return b.props.label === 'Release it' || b.props.label === 'Not now'; })]).toBe(false);
                _c = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: 'Release the branch?' })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeUndefined();
                expect(s.answers()).toEqual([]);
                s.freeWrites();
                free();
                return [4 /*yield*/, pressing];
            case 6:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 7:
                _d.apply(void 0, [_f.sent()]).toHaveLength(1);
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · it reads this at its next step' })];
                    }); }); })];
            case 8:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('an answer that could not be written says so on the card and puts its buttons back; pressed again it goes', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, release, _a, _b, again, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, askScene($, on)];
            case 1:
                s = _e.sent();
                return [4 /*yield*/, s.key('Release it')];
            case 2:
                release = _e.sent();
                s.failWrites(1000);
                return [4 /*yield*/, s.list.press({ key: release }).catch(function () { return undefined; })];
            case 3:
                _e.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: 'Not sent: “Release it” did not reach the work. Press it again' })];
                    }); }); })];
            case 4:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 5:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                expect(s.answers()).toEqual([]);
                // Its buttons are back, and a press now answers it
                s.failWrites(0);
                return [4 /*yield*/, s.key('Release it')];
            case 6:
                again = _e.sent();
                expect(again).not.toBe('');
                return [4 /*yield*/, s.list.press({ key: again })];
            case 7:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 8:
                _c.apply(void 0, [_e.sent()]).toHaveLength(1);
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · it reads this at its next step' })];
                    }); }); })];
            case 9:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('two presses on an ask, the second on the drawing before the first was taken, send one answer', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, release, notNow, free, first, second, third, _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, askScene($, on)];
            case 1:
                s = _b.sent();
                return [4 /*yield*/, s.key('Release it')];
            case 2:
                release = _b.sent();
                return [4 /*yield*/, s.key('Not now')];
            case 3:
                notNow = _b.sent();
                free = function () { return undefined; };
                s.holdWrites(new Promise(function (done) { return (free = done); }));
                first = s.list.press({ key: release });
                second = s.list.press({ key: notNow }).catch(function () { return undefined; });
                third = s.list.press({ key: release }).catch(function () { return undefined; });
                s.freeWrites();
                free();
                return [4 /*yield*/, Promise.all([first, second, third])];
            case 4:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_b.sent()]).toHaveLength(1);
                expect(s.answers()[0]).toContain('pressed "Release it"');
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 50); })];
            case 6:
                _b.sent();
                expect(s.answers()).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
// What the panel reads, written in a minute, and how many seconds of it the panel was drawn afresh in: each one the app builds whole
// again, under the pointer
var watchWrites = function (on) {
    var writes = {};
    var counting = { isOn: false };
    on('ui.invalidate', function (_, e, next) { var _a; return ((counting.isOn && (writes.invalidate = ((_a = writes.invalidate) !== null && _a !== void 0 ? _a : 0) + 1)), next(e)); });
    on('state.set', function (_, e, next) {
        var _a, _b, _c, _d;
        var key = (_c = (_a = e.key) !== null && _a !== void 0 ? _a : (_b = e.ref) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : Object.keys(e).join(',');
        if (counting.isOn)
            writes[key] = ((_d = writes[key]) !== null && _d !== void 0 ? _d : 0) + 1;
        return next(e);
    });
    return { writes: writes, counting: counting };
};
test('with work running and nothing new, the panel is drawn afresh only every ten seconds and nothing it reads is written over with the same: the 15 Nov hover that flickered each second', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, drawings, i, _b, _c, _d, _e, _f;
    var _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _k.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                _k.sent();
                counting.isOn = true;
                drawings = new Set();
                i = 0;
                _k.label = 6;
            case 6:
                if (!(i < 60)) return [3 /*break*/, 10];
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _k.sent();
                _c = (_b = drawings).add;
                _e = (_d = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 8:
                (_c.apply(_b, [_e.apply(_d, [(_k.sent()).map(function (one) { return one.text; })])]));
                _k.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 6];
            case 10:
                // Nothing the panel reads is written: the times move by the mod's own call, every ten seconds
                expect({ tick: (_g = writes.tick) !== null && _g !== void 0 ? _g : 0, todos: (_h = writes.todos) !== null && _h !== void 0 ? _h : 0 }).toEqual({ tick: 0, todos: 0 });
                expect((_j = writes.invalidate) !== null && _j !== void 0 ? _j : 0).toBeLessThanOrEqual(7);
                expect(drawings.size).toBeLessThanOrEqual(7);
                expect(drawings.size).toBeGreaterThanOrEqual(5);
                // Anything new still shows at once
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the left ear.' })];
            case 11:
                // Anything new still shows at once
                _k.sent();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'I am looking at the left ear.' })];
            case 12:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 13:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('with nothing running the panel is not drawn again at all, so what is under the pointer stays as it is and a press reaches it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, i;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Ears checked.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _e.sent();
                return [4 /*yield*/, clock.advance(120000)];
            case 6:
                _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                _e.sent();
                counting.isOn = true;
                i = 0;
                _e.label = 8;
            case 8:
                if (!(i < 60)) return [3 /*break*/, 12];
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                (_e.sent());
                _e.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 8];
            case 12:
                expect((_b = writes.invalidate) !== null && _b !== void 0 ? _b : 0).toBe(0);
                expect({ tick: (_c = writes.tick) !== null && _c !== void 0 ? _c : 0, todos: (_d = writes.todos) !== null && _d !== void 0 ? _d : 0 }).toEqual({ tick: 0, todos: 0 });
                return [4 /*yield*/, list.unmount()];
            case 13:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('while the person uses the panel its running times stand still, and move again once they stop; an ask that comes meanwhile shows at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, writes, counting, list, title, still, _b, _c, i, _d, _e, _f, _g, asked, _h, _j, _k, _l, _m;
    var _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the nose', prompt: 'nose' }))];
            case 4:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _p.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 6:
                _p.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })
                    // A press in the panel: drawn once for what it did, then still while the person is at it
                ];
            case 7:
                _p.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                title = (_p.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('open-'); });
                expect(title).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_o = title === null || title === void 0 ? void 0 : title.key) !== null && _o !== void 0 ? _o : '' })];
            case 9:
                _p.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                _p.sent();
                counting.isOn = true;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 11:
                still = _c.apply(_b, [(_p.sent()).map(function (one) { return one.text; })]);
                i = 0;
                _p.label = 12;
            case 12:
                if (!(i < 13)) return [3 /*break*/, 16];
                return [4 /*yield*/, clock.advance(1000)];
            case 13:
                _p.sent();
                _d = expect;
                _f = (_e = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 14:
                (_d.apply(void 0, [_f.apply(_e, [(_p.sent()).map(function (one) { return one.text; })])]).toBe(still));
                _p.label = 15;
            case 15:
                i++;
                return [3 /*break*/, 12];
            case 16: 
            // An ask comes: shown at once all the same
            return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'May I go on?', choices: ['Approve', 'Not now'] })];
            case 17:
                // An ask comes: shown at once all the same
                _p.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'May I go on?' })];
            case 18:
                _g.apply(void 0, [_p.sent()]).toBeDefined();
                _j = (_h = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 19:
                asked = _j.apply(_h, [(_p.sent()).map(function (one) { return one.text; })]);
                return [4 /*yield*/, clock.advance(30000)];
            case 20:
                _p.sent();
                _k = expect;
                _m = (_l = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 21:
                _k.apply(void 0, [_m.apply(_l, [(_p.sent()).map(function (one) { return one.text; })])]).not.toBe(asked);
                return [4 /*yield*/, list.unmount()];
            case 22:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test('with only a Details tab in front, or the Servers tab open, the mod still asks for no more than a drawing every ten seconds', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, clock, _a, writes, counting, list, details, servers, i;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }, { id: 'servers', isShown: true, isPlaced: true }];
                clock = world(on, { live: live }).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _d.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                _d.sent();
                return [4 /*yield*/, list.unmount()];
            case 6:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 7:
                details = _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'servers', props: __assign(__assign({}, LIST.props), { title: 'Servers' }), surface: 'desktop' }))];
            case 8:
                servers = _d.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 9:
                _d.sent();
                counting.isOn = true;
                i = 0;
                _d.label = 10;
            case 10:
                if (!(i < 60)) return [3 /*break*/, 14];
                return [4 /*yield*/, clock.advance(1000)];
            case 11:
                _d.sent();
                return [4 /*yield*/, details.findAll({ type: 'Text' })];
            case 12:
                (_d.sent());
                _d.label = 13;
            case 13:
                i++;
                return [3 /*break*/, 10];
            case 14:
                expect((_b = writes.invalidate) !== null && _b !== void 0 ? _b : 0).toBeLessThanOrEqual(7);
                expect((_c = writes.tick) !== null && _c !== void 0 ? _c : 0).toBe(0);
                return [4 /*yield*/, Promise.all([details.unmount(), servers.unmount()])];
            case 15:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
